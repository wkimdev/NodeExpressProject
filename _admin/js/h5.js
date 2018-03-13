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
	cmdSendByAjax : function (_obj, _form) {
		$('form').ajaxForm({
			url: '/util/FileUpload',
			enctype: 'multipart/form-data',
			
			beforeSubmit: function (data, form, option) {
				console.info('beforeSubmit');
				console.info(data);
				console.info(form);
				console.info('beforeSubmit');
				//validation체크
				//막기위해서는 return false를 잡아주면됨
				return true;
			},
			success: function (response, status) {
				console.info(response);
	
				$('#Location').val(response.Location);
			},
			error: function () {
				console.info('error');
			}
		});
		
		$('#' + _form).submit();
	},
	cmdCheckCookie : function() {
		var _member_no = $.cookie('MEMBER_NO');

		if (!_member_no){
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
    },
    cmdLogout : function(){
        $.cookie('memberNo', null);
        $.cookie('memberType', null);
        $.cookie('nm', null);
        $.cookie('email', null);
    }
};

var __dashboard = {
	init : function(){
		console.log('=============Admin Main Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();
		//회원관리
		this.cmdLoadNewMember();
		//진도 토픽
		__progress.cmdLoadProgress();
		//도서 토픽
		__bookMng.cmdLoadBookMng();
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
						field: 'memberCodeNm',
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
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: true,
				paginationHAlign : 'left',
				buttonsClass : false,	//?
				columns: [
					{
						title: '선택',
						field: 'boardId',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.boardId + ' "> ';
						}
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
			var _temp = [];

			for(i = 0; i < _this.length ; i++){
				_temp.push(_this[i]);
			}

			//선택 갯수 여러개
			var _cnt = _temp.length;

			var _tp = 0;

			$.each(_temp, function(_index, _value){
				var _tempReq = new Object();
				_tempReq.boardId = parseInt(_value);

				__common.cmdLoadByAjax('/classMng/classMngDelete', JSON.stringify(_tempReq));
				_tp++;
			});

			if (_cnt == _tp){
				__progress.cmdLoadProgress();
			}
		} else {
			return;
		}
	},
	//
	// 진도 선택
	cmdSelectProgress : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;	//boardId

		//선택 삭제를 여기서 구현

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
		var questBoardId = __common.getUrlParameter('questBoardId');

		$("#boardId").val(boardId);
		$("#questBoardId").val(questBoardId);

		this.cmdLoadProgressQuest1(boardId);
		this.cmdLoadProgressQuest2(boardId);
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
						title: '선택',
						field: 'boardId',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.boardId + ' "> ';
						}
					}, {
						field: 'boardId',
					}, {
						field: 'quest',
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/answer/list.html?questBoardId='+ _row.questBoardId +'\';">'+ _row.answerCnt +'</buton>';
						}
					},{
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-seq="' + _row.questBoardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;'
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__progress.cmdDeleteProgress(' + _row.questBoardId + ');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	//boardId에 대한 질문 리스트
	cmdSelectProgressQuest : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;	//boardId

		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestList', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	//questBoardId에 대한 질문 리스트
	cmdSelectProgressQuestOne : function(_this) {
		var _formValue = new Object();
		_formValue.questBoardId = _this;	//questBoardId

		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestListOne', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 진도 질문 등록
	cmdInsertProgressQuest : function(_this) {		
		var _formValue = new Object();
		_formValue = _this;

		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progressQuest.cmdLoadProgressQuest1();
			__progressQuest.cmdLoadProgressQuest2();
		});
	},
	// 진도 질문 수정
	cmdUpdateProgressQuest : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progressQuest.cmdLoadProgressQuest1();
			__progressQuest.cmdLoadProgressQuest2();
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
	init : function() {
		console.log('=============ClassMng Answer Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > .treeview:eq(0)').addClass('active');
		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		var questBoardId = __common.getUrlParameter('questBoardId');
		var answerBoardId = __common.getUrlParameter('answerBoardId');

		$('#questBoardId').val(questBoardId);
		$('#answerBoardId').val(answerBoardId);

		this.cmdLoadProgressAns1(questBoardId);
		this.cmdLoadProgressAns2(questBoardId);
	},
	cmdLoadProgressAns1 :function(_questBoardId){
		var _oriData = __progressQuest.cmdSelectProgressQuestOne(_questBoardId);	//질문

		_oriData.done(function(_data){
			$('#tblProgressAns1').bootstrapTable('load', { data: _data });
			//질문 관리 
			$('#tblProgressAns1').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						field: 'quest',
					}
				]
			});
		});

	},
	cmdLoadProgressAns2 : function(_questBoardId) {
		var _formValue = new Object();
		_formValue.questBoardId = _questBoardId;

		var _returnJson = __common.cmdLoadByAjax('/classAns/classAnsList', JSON.stringify(_formValue));

		_returnJson.done(function(_data){
			//답변 목록 리스트 
			$('#tblProgressAns2').bootstrapTable({
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
						field: 'contents',
					}, {
						field: 'addId',
					}, {
						field: 'likeCnt',
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-seq="' + _row.answerBoardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;'
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__progressAnswer.cmdDeleteProgressAns(' + _row.answerBoardId + ');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	// answerBoardId에 대한 진도 답변 리스트
	cmdSelectProgressAns : function(_this) {
		var _formValue = new Object();
		_formValue.answerBoardId = _this;	//answerBoardId

		var _returnJson = __common.cmdLoadByAjax('/classAns/classAnsBoardList', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 진도 답변 등록
	cmdInsertProgressAns : function(_this) {		
		var _formValue = new Object();
		_formValue = _this;

		var _returnJson = __common.cmdLoadByAjax('/classAns/classAnsAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progressAnswer.init();
		});
		//window.open('','_self').close();
	},
	// 진도 답변 수정
	cmdUpdateProgressAns : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/classAns/classAnsUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progressAnswer.init();
		});
	},
	// 진도 답변 삭제
	cmdDeleteProgressAns : function(_this) {
		
		if (confirm(' 삭제 후 복구되지 않습니다. ') == true) {
			var _formValue = new Object();
			_formValue.boardId = _this;

			var _returnJson = __common.cmdLoadByAjax('/classAns/classAnsDelete', JSON.stringify(_formValue));
		} else {
			return;
		}

		_returnJson.done(function(_data){
			__progressAnswer.cmdLoadProgressAns1();
			__progressAnswer.cmdLoadProgressAns2();
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
						formatter: function (_string, _row, _index) {
							return '<img src="'+ _row.fileTextName +'" alt="..." class="img-rounded img-responsive" style="width:50px;">';
							//return 1;
						}
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
							return '<buton type="button" clas	s="btn btn-link btn-xs" onclick="location.href=\'/admin/question/list.html?boardId='+ _row.boardId +'\';">'+ _row.questCnt +'</buton>';
						}
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-bookboardid="' + _row.bookBoardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;' +
									'<buton type="button" class="btn btn-danger btn-xs" onclick="__progress.cmdDeleteProgress(' + _row.bookBoardId + ');">삭제</buton>';
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
        
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__bookMng.cmdLoadBookMng();
		});
	},
	// 도서 정보 수정
	cmdUpdateBookMng : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__bookMng.cmdLoadBookMng();
		});
	},
	// 도서 정보 삭제
	cmdDeleteBookMng : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngDelete', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			__bookMng.cmdLoadBookMng();
		});
	},
	// 도서 정보 선택
	cmdSelectBookMng : function(_this) {
		var _formValue = new Object();
		_formValue.bookBoardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngSelect', JSON.stringify(_formValue));

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

