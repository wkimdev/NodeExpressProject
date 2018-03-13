 __common = {
	cmdLoadByAjax : function (url, params, method) {
		var request = $.ajax({
			type: !method ? 'POST' : method,
			url: url,
			contentType: 'application/json; charset=utf-8',
			data: params,
			dataType: 'json',
			async: true,
			cache: false
		});
	
		return request;
	},
	cmdCheckCookie : function() {
		var _admin_no = $.cookie('ADMIN_NO');

		if (!_admin_no){
			location.href = '/admin';
		}
	},
	cmdOpenModal : function(_id) {
		$('#' + _id).modal(); 
	},
	getUrlParameter : function( queryString ) {
		queryString = queryString.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + queryString + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	},
};

$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});

	return o;
};

var __login = {
	init : function(){
		console.log('=============Loin Init!!=============');

		this._id = null;
		this._pw = null;
	},
	cmdLogin : function(_this) {
		this.init();

		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberLogin/loginAdmin', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			if (_data.result && 0 < _data.resultData.length){
				location.href = '/admin/index.html';
			}
		});
	}
};

var __dashboard = {
	init : function(){
		console.log('=============Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		this.cmdLoadNewMember();
	},
	// 회원관리
	cmdLoadNewMember : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberMng/memberList', _formValue);
		
		_returnJson.done(function(_data){
			$('#tblMember').bootstrapTable({
				data: _data.resultData,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						formatter: function (_string, _row, _index) {
							return _data.resultData.length - _index;
						}
					}, {
						field: 'nm',
					}, {
						field: 'email',
					}, {
						field: 'enrolChildCnt',
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}
				]
			});
	
			console.log(_data);
		});
	}
};

var __progress = {
	init : function(){
		console.log('=============ClassMng Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > .treeview:eq(0)').addClass('active');
		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		this.cmdLoadProgress();
	},
	// 진도 리스트
	cmdLoadProgress : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/classMng/classMngList', _formValue);
		
		_returnJson.done(function(_data){
			$('#tblProgress').bootstrapTable('load', { data: _data });

			$('#tblProgress').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 5,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: true,
				paginationHAlign : 'left',
				buttonsClass : true,	//?
				columns: [
					{	
						checkbox : true,
						/* formatter: function (_string, _row, _index) {
							return _data.length - _index;
						} */
					}, {
						field: 'monthWeekCodeNm',
					}, {
						field: 'gradeCodeNm',
					}, {
						field: 'subjectCodeNm',
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/question/list.html?boardId='+ _row.boardId +'\';">'+ _row.questCnt +'</buton>';
						}
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-seq="' + _row.boardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;'
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__progress.cmdDeleteProgress(' + _row.boardId + ');">삭제</buton>';
						}
					}
				]

			});
		});
	},
	// // 선택한 baordId에 대한 게시글
	cmdSelectUpdateProgress : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;	//boardId

		var _returnJson = __common.cmdLoadByAjax('/classMng/classSelectList', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 진도 등록
	cmdInsertProgress : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/classMng/classMngAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progress.cmdLoadProgress();
		});
		//window.open('','_self').close();
	},
	// 진도 수정
	cmdUpdateProgress : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/classMng/classMngUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progress.cmdLoadProgress();
		});
	},
	// 진도 삭제
	cmdDeleteProgress : function(_this) {
		
		if (confirm(' 삭제 후 복구되지 않습니다. ') == true) {
			var _formValue = new Object();
			_formValue.boardId = _this;

			var _returnJson = __common.cmdLoadByAjax('/classMng/classMngDelete', JSON.stringify(_formValue));
		} else {
			return;
		}

		_returnJson.done(function(_data){
			__progress.cmdLoadProgress();
		});
	},
	// 진도 선택
	cmdSelectProgress : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;	//boardId

		var _returnJson = __common.cmdLoadByAjax('/classMng/classMngList', JSON.stringify(_formValue));

		return _returnJson;
	},
};

var __progressQuest = {
	init : function(){
		console.log('=============ClassMng Quest Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > .treeview:eq(0)').addClass('active');
		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		var boardId = __common.getUrlParameter('boardId');

		this.cmdLoadProgressQuest2(boardId);
		this.cmdLoadProgressQuest1(boardId);
	},
	cmdLoadProgressQuest1 :function(_boardId){
		var _oriData = __progress.cmdSelectUpdateProgress(_boardId);	

		_oriData.done(function(_data){
			$('#tblProgressQuest1').bootstrapTable('load', { data: _data });
			//질문 관리 
			$('#tblProgressQuest1').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						field: 'monthWeekCodeNm',
					}, {
						field: 'gradeCodeNm',
					}, {
						field: 'subjectCodeNm',
					}, {
						field: 'questCnt',
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}
				]
			});
		});

	},
	cmdLoadProgressQuest2 : function(_boardId) {
		var _formValue = new Object();
		_formValue.boardId = _boardId;

		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestList', JSON.stringify(_formValue));

		_returnJson.done(function(_data){
			//질문 목록 리스트 
			$('#tblProgressQuest2').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						formatter: function (_string, _row, _index) {
							return _data.length - _index;
						}
					}, {
						field: 'boardId',
					}, {
						field: 'quest',
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/answer/list.html?questBoardId='+ _row.questBoardId +'\';">'+ _row.answerCnt +'</buton>';
						}
					},
					
					/* {
						field: 'answerCnt',
					},  */
					{
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-seq="' + _row.boardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;'
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__progress.cmdDeleteProgress(' + _row.boardId + ');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	//questId에 대한 질문 리스트
	cmdSelectProgressQuest : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;	//boardId

		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestList', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 진도 질문 등록
	cmdInsertProgressQuest : function(_this) {		
		console.log('test 111 : '+_this.boardId);	//boardId 던지는 부분
		console.log('test 222 : '+_this.contents);
		var _formValue = new Object();
		_formValue = _this;

		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progressQuest.init();
		});
		//window.open('','_self').close();
	},
	// 진도 질문 수정
	cmdUpdateProgressQuest : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progressQuest.cmdLoadProgress();
		});
	},
	// 진도 질문 삭제
	cmdDeleteProgressQuest : function(_this) {
		
		if (confirm(' 삭제 후 복구되지 않습니다. ') == true) {
			var _formValue = new Object();
			_formValue.boardId = _this;

			var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestDelete', JSON.stringify(_formValue));
		} else {
			return;
		}

		_returnJson.done(function(_data){
			__progressQuest.cmdLoadProgress();
		});
	}
};

var __progressAnswer = {
	init : function(){
		console.log('=============ClassMng Answer Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > .treeview:eq(0)').addClass('active');
		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		var boardId = __common.getUrlParameter('boardId');

		this.cmdLoadProgressAns2(questBoardId);
		this.cmdLoadProgressAns1(questBoardId);
	},
	cmdLoadProgressAns1 :function(questBoardId){
		var _oriData = __progressQuest.cmdSelectUpdateProgress(questBoardId);	

		_oriData.done(function(_data){
			$('#tblProgressQuest1').bootstrapTable('load', { data: _data });
			//질문 관리 
			$('#tblProgressQuest1').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						field: 'monthWeekCodeNm',
					}, {
						field: 'gradeCodeNm',
					}, {
						field: 'subjectCodeNm',
					}, {
						field: 'questCnt',
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}
				]
			});
		});

	},
	cmdLoadProgressQuest2 : function(_boardId) {
		var _formValue = new Object();
		_formValue.boardId = _boardId;

		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestList', JSON.stringify(_formValue));

		_returnJson.done(function(_data){
			//질문 목록 리스트 
			$('#tblProgressQuest2').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						formatter: function (_string, _row, _index) {
							return _data.length - _index;
						}
					}, {
						field: 'boardId',
					}, {
						field: 'quest',
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/answer/list.html?questBoardId='+ _row.questBoardId +'\';">'+ _row.answerCnt +'</buton>';
						}
					},
					
					/* {
						field: 'answerCnt',
					},  */
					{
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-seq="' + _row.boardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;'
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__progress.cmdDeleteProgress(' + _row.boardId + ');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	//questId에 대한 질문 리스트
	cmdSelectProgressQuest : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;	//boardId

		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestList', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 진도 질문 등록
	cmdInsertProgressQuest : function(_this) {		
		console.log('test 111 : '+_this.boardId);	//boardId 던지는 부분
		console.log('test 222 : '+_this.contents);
		var _formValue = new Object();
		_formValue = _this;

		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progressQuest.init();
		});
		//window.open('','_self').close();
	},
	// 진도 질문 수정
	cmdUpdateProgressQuest : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progressQuest.cmdLoadProgress();
		});
	},
	// 진도 질문 삭제
	cmdDeleteProgressQuest : function(_this) {
		
		if (confirm(' 삭제 후 복구되지 않습니다. ') == true) {
			var _formValue = new Object();
			_formValue.boardId = _this;

			var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestDelete', JSON.stringify(_formValue));
		} else {
			return;
		}

		_returnJson.done(function(_data){
			__progressQuest.cmdLoadProgress();
		});
	}
};

var __bookMng = {
	init : function(){
		console.log('=============BookMng Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > .treeview:eq(0)').addClass('active');
		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		this.cmdLoadBookMng();
	},
	// 도서 리스트
	cmdLoadBookMng : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngList', _formValue);
		
		_returnJson.done(function(_data){
			$('#tblBookMng').bootstrapTable('load', { data: _data });

			$('#tblBookMng').bootstrapTable({
				data: _data, //_data .list랑 _data로 받는 것의 차이
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						formatter: function (_string, _row, _index) {
							return _data.length - _index;
						}
					}, {
						field: 'categoryNm',
					}, {
						field: '',	//도서 이미지
					}, {
						field: 'bookname',
					}, {
						field: 'writer',
					}, {
						field: 'publisher',
					}, {
						field: 'price',
					}, {
						field: 'writer',
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/question/list.html?boardId='+ _row.boardId +'\';">'+ _row.questCnt +'</buton>';
						}
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-seq="' + _row.boardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;'
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__progress.cmdDeleteProgress(' + _row.boardId + ');">삭제</buton>';
						}
					}
				]
			});
			console.log(_data);
		});
	},
	// 도서 정보 등록
	cmdInsertBookMng : function(_this) {	
		var _formValue = _this;
		console.log(' _formValue.serializeObject() : '+JSON.stringify(_formValue.serializeObject()));
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__bookMng.cmdLoadBookMng();
		});
	},
	// 도서 정보 수정
	cmdUpdateBookMng : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/class/Update', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__bookMng.cmdLoadBookMng();
		});
	},
	// 도서 정보 삭제
	cmdDeleteBookMng : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/class/Delete', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			__bookMng.cmdLoadBookMng();
		});
	},
	// 도서 정보 선택
	cmdSelectBookMng : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngList', JSON.stringify(_formValue));

		return _returnJson;
	},
};


var __memberMng = {
	init : function(){
		console.log('=============Member Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > li:eq(3)').addClass('active');
//		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		this.cmdLoadMemberMng();
	},
	cmdLoadMemberMng : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberMng/memberList', _formValue);
		
		_returnJson.done(function(_data){
			$('#tblBookMng').bootstrapTable('load', { data: _data.resultData });

			$('#tblBookMng').bootstrapTable({
				data: _data.resultData, 
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						formatter: function (_string, _row, _index) {
							return _data.resultData.length - _index;
						}
					}, {
						field: 'memberType',
					}, {
						field: 'nm',	//도서 이미지
					}, {
						field: 'email',
					}, {
						field: 'enrolChildCnt',
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-memberno="' + _row.memberNo + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;' +
									'<buton type="button" class="btn btn-danger btn-xs" onclick="__memberMng.cmdDeleteMemberMng(\'' + _row.memberNo + '\');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	// 회원 정보 등록
	cmdInsertMemberMng : function(_this) {	
		var _formValue = _this;
		console.log(' _formValue.serializeObject() : '+JSON.stringify(_formValue.serializeObject()));
		var _returnJson = __common.cmdLoadByAjax('/memberMng/memberAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__memberMng.cmdLoadMemberMng();
		});
	},
	// 회원 정보 수정
	cmdUpdateMemberMng : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberMng/memberUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__memberMng.cmdLoadMemberMng();
		});
	},
	cmdDeleteMemberMng : function(_this) {
		var _formValue = new Object();
		_formValue.memberNo = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberMng/memberDelete', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			__memberMng.cmdLoadMemberMng();
		});
	},
	cmdSelectMemberMng : function(_this) {
		var _formValue = new Object();
		_formValue.memberNo = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberMng/memberSelect', JSON.stringify(_formValue));

		return _returnJson;
	},
};

var __push = {
	init : function(){
		console.log('=============Push Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > li:eq(3)').addClass('active');
//		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		this.cmdLoadPushMng();
	},
	cmdLoadPushMng : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/pushMng/pushList', _formValue);
		
		_returnJson.done(function(_data){
			$('#tblPush').bootstrapTable('load', { data: _data.resultData });

			$('#tblPush').bootstrapTable({
				data: _data.resultData, 
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						formatter: function (_string, _row, _index) {
							return _data.resultData.length - _index;
						}
					}, {
						field: 'title',
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.sendDate).format('YYYY-MM-DD');
						}
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-pushboardid="' + _row.pushBoardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;' +
									'<buton type="button" class="btn btn-danger btn-xs" onclick="__push.cmdDeletePushMng(\'' + _row.pushBoardId + '\');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	cmdInsertPushMng : function(_this) {	
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/pushMng/pushAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__push.cmdLoadPushMng();
		});
	},
	cmdUpdatePushMng : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/pushMng/pushUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__push.cmdLoadPushMng();
		});
	},
	cmdDeletePushMng : function(_this) {
		var _formValue = new Object();
		_formValue.pushBoardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/pushMng/pushDelete', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			__push.cmdLoadPushMng();
		});
	},
	cmdSelectPushMng : function(_this) {
		var _formValue = new Object();
		_formValue.pushBoardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/pushMng/pushSelect', JSON.stringify(_formValue));

		return _returnJson;
	},
};

