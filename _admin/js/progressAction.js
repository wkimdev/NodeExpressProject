 __common = {
	cmdLoadByAjax : function (url, params, method) {
		var request = $.ajax({
			type: !method ? 'POST' : method,
			url: url,
			contentType: 'application/json; charset=utf-8',
			data: params,
			dataType: 'json',
			async: true, // 비동기, false - 동기
			cache: false
		});
	
		return request;
	},
	cmdSendByAjax : function (_obj, _form) {
		$('form').ajaxForm({
			url: '/classUtil/FileUpload',
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

const classTpInfo = {
	// ajax 설정
    init: function () {
        $.ajaxSetup({
            global: false,
            async: false,
            //data: { questBoardId: questBoardId },
            dataType: 'json'     
        });
    },

    // 진도 토픽 목록
    classQuestTp: function ( questBoardId ) {
        this.init();
		var list = [];
		var param = {questBoardId : questBoardId}
        $.post('/classQuest/classQuestTp', param, function ( res ) {
            list = res;
        });

        return list;
	},	 

 }

 const TpInfoCnt = {
	// ajax 설정
		init: function () {
		$.ajaxSetup({
			//type : "GET",
			global: false,
			async: false,
			dataType: 'json'
		});
	},

	// 진도 게시글 토픽 선택된 갯수
	classQuestTpCnt: function () {
		this.init();
		var list = [];
		$.post('/classQuest/classQuestTpCnt', function ( res ) {
			list = res;
		});

		return list;
	},
	// 도서 게시글 토픽 선택된 갯수
	bookQuestTpCnt: function () {
		this.init();
		var list = [];
		$.post('/bookQuest/bookQuesTpCnt', function ( res ) {
			list = res;
		});

		return list;
	}
 }

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
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/question/classQuest.html?boardId='+ _row.boardId +'\';">'+ _row.questCnt +'</buton>';
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
	// 교과 과정명 으로 검색
	cmdSearchProgress : function(_this) {	//curriculumn text
		var _formValue = new Object();
		//_formValue.curriculum = encodeURI(_this);	//curriculumn text encoding시켜서 보내기
		_formValue.curriculum = _this;

		var _returnJson = __common.cmdLoadByAjax('/classMng/classSearchByCurNm', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			$('#tblProgressSearch').bootstrapTable('load', { data: _data });			

			$('#tblProgressSearch').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: true,
				paginationHAlign : 'left',
				buttonsClass : false,	
				columns: [
					{
						title: '선택',
						field: 'pickClassBoardId',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox1" value="' + _row.boardId + ' " data-id="' + _index + '" class="data-class" onclick="">';
						}
					}, {
						field: 'subjectCodeNm',
					}, {
						field: 'curriculum',
					}, {
						field: 'gradeCodeNm',
					}
				]

			});
		});
		
	},
	// 도서명 으로 검색
	cmdSearchBook : function(_this) {	
		var _formValue = new Object();
		_formValue.bookname = _this;

		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookSearchByBookNm', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			$('#tblBookSearch').bootstrapTable('load', { data: _data });			

			$('#tblBookSearch').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: true,
				paginationHAlign : 'left',
				buttonsClass : false,	
				columns: [
					{
						title: '선택',
						field: 'pickBookBoardId',
							formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox2" value="' + _row.bookBoardId + ' " data-id="' + _index + '" class="data-class" onclick="">';
						}
					}, {
						field: 'categoryNm',
					}, {
						field: 'bookname',
					}, {
						field: 'writer',
					}, {
						field: 'publisher'
					}
				]

			});
		});
		
	},
	// 선택한 baordId에 대한 게시글
	cmdSelectUpdateProgress : function(_this) {
		var _formValue = new Object();
		_formValue.boardId = _this;	//boardId
		
		var _returnJson = __common.cmdLoadByAjax('/classMng/classSelectList', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	//(도서) questBoardId에 대한 질문 리스트
	cmdSelectBookMngListOne : function(_this) {
		var _formValue = new Object();
		_formValue.bookBoardId = _this;	

		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngSelect', JSON.stringify(_formValue));
		
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
	// 선정한 진도 토픽 수정
	cmdUpdatePickClassTp : function(_this) {
		var _formValue = _this;	//boadId, pickClassBoardId
		console.log("test 1234========"+JSON.stringify(_formValue));
		var _returnJson = __common.cmdLoadByAjax('/classMng/updatePickClassTp', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			__progress.cmdLoadProgress();
		});
	},
	// 선정한 도서 토픽 수정
	cmdUpdatePickBookTp : function(_this) {
		var _formValue = _this;	//boadId, pickBookBoardId
		console.log("test 5678========"+JSON.stringify(_formValue));
		var _returnJson = __common.cmdLoadByAjax('/classMng/updatePickBookTp', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			__progress.cmdLoadProgress();
		});
	},
	// 진도 삭제
	cmdDeleteProgress : function(_this) {

		if (confirm(' 삭제 후 복구되지 않습니다. ') == true) {
			var _temp = [];

			if(_this.length > 0){

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
					__progress.init();
				} 
			} else {
				var _temp = new Object();
				_temp.boardId = _this;
				__common.cmdLoadByAjax('/classMng/classMngDelete', JSON.stringify(_temp));
				__progress.init();
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
	cmdLoadProgressQuest1 :function(_boardId) {
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
			$('#tblProgressQuest2').bootstrapTable('load', { data: _data });
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
						field: 'questBoardId',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.questBoardId + ' "> ';
						}
					}, {
						field: 'quest',
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/answer/classAns.html?questBoardId='+ _row.questBoardId +'\';">'+ _row.answerCnt +'</buton>';
						}
					},{
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-seq="' + _row.questBoardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;'
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__progressQuest.cmdDeleteProgressQuest(' + _row.questBoardId + ');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	//questBoardId에 대한 토픽 선정
	cmdSelectProgressQuestTp : function(_this) {
		var questBoardId = _this;	//questBoardId

		//게시글의 토픽 선정 여부 
		var classQuestTp = classTpInfo.classQuestTp(questBoardId);	//classQuestTp[0].pickTp

		//전체 질문게시글의 토픽 선정 여부  
		var classQuestTpCnt = TpInfoCnt.classQuestTpCnt();
		var bookQuestTpCnt = TpInfoCnt.bookQuestTpCnt();

		var temp1 = classQuestTp[0].pickTp;
		var temp2 = classQuestTpCnt[0].cnt;
		var temp3 = bookQuestTpCnt[0].cnt;

		if (temp1 == 0 && temp2 == 0 && temp3 == 0) {

			__progressQuest.cmdUpdateProgressQuestTp(questBoardId);

			alert('토픽으로 선정되었습니다.!');
		} else {
			alert('이미 선정된 토픽이 있습니다. 토픽 선정을 해제한 뒤 선택하세요!');
		}

		return ;
	},
	// 진도 질문 토픽 선정
	cmdUpdateProgressQuestTp : function(_this) {
		var _formValue = new Object();
		_formValue.questBoardId = _this;	
		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestUpdateTp', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			__progressQuest.init();
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
			__progressQuest.init();	
		});
	},
	// 진도 질문 수정
	cmdUpdateProgressQuest : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/classQuest/classQuestUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__progressQuest.init();
		});
	},
	// 진도 질문 삭제
	cmdDeleteProgressQuest : function(_this) {
		if (confirm(' 삭제 후 복구되지 않습니다. ') == true) {
			var _temp = [];
			
			if(_this.length > 0){

				for(i = 0; i < _this.length ; i++){
					_temp.push(_this[i]);
				}

				var _cnt = _temp.length;
				var _tp = 0;

				$.each(_temp, function(_index, _value){
					var _tempReq = new Object();
					_tempReq.questBoardId = parseInt(_value);

					__common.cmdLoadByAjax('/classQuest/classQuestDelete', JSON.stringify(_tempReq));
					
					_tp++;
				});

				if (_cnt == _tp){
					__progressQuest.init();
				}
			} else {
				var _temp = new Object();
				_temp.questBoardId = _this;
				__common.cmdLoadByAjax('/classQuest/classQuestDelete', JSON.stringify(_temp));
				__progressQuest.init();
			}
		} else {
			return;
		}
	}
};

var __progressAnswer = {
	init : function() {
		console.log('=============ClassMng Answer Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		console.log('cookie test : '+$.cookie('MEMBER_NO'));
		// Navi active !!
		$('.sidebar-menu > .treeview:eq(0)').addClass('active');
		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		var questBoardId = __common.getUrlParameter('questBoardId');
		var answerBoardId = __common.getUrlParameter('answerBoardId');

		$('#questBoardId').val(questBoardId);
		$('#answerBoardId').val(answerBoardId);

		//this.cmdLoadProgressAns1(questBoardId);
		this.cmdLoadProgressAns1(questBoardId);

		var temp = new Object();
		temp[0] = questBoardId;
		temp[1] = $.cookie('MEMBER_NO');
		this.cmdLoadProgressAns2(temp);	//여기에 cookie값도 같이 넣기.....
	},
	cmdLoadProgressAns1 :function(_questBoardId){
		var _formValue = new Object();
		_formValue.questBoardId = _questBoardId;

		var _oriData = __progressQuest.cmdSelectProgressQuestOne(_questBoardId);	

		_oriData.done(function(_data){
			$('#tblProgressAns1').bootstrapTable('load', { data: _data });
			//답변 관리 
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
	cmdLoadProgressAns2 : function(temp) {	//temp = {0: "109", 1: "55"}
		var _formValue = new Object();
		_formValue.questBoardId = temp[0];	//questBoardId
		_formValue.memberNo = temp[1]; //memberNo
		var _returnJson = __common.cmdLoadByAjax('/classAns/classAnsList', JSON.stringify(_formValue));

		_returnJson.done(function(_data){
			$('#tblProgressAns2').bootstrapTable('load', { data: _data });
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
						title: '선택',
						field: 'answerBoardId',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.answerBoardId + ' "> ';
						}
					}, {
						field: 'contents',
					}, {
						field: 'email',
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

		var _returnJson = __common.cmdLoadByAjax('/classAns/classAnsList', JSON.stringify(_formValue));
		
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
			var _temp = [];
			
			if(_this.length > 0){

				for(i = 0; i < _this.length ; i++){
					_temp.push(_this[i]);
				}

				var _cnt = _temp.length;
				var _tp = 0;

				$.each(_temp, function(_index, _value){
					var _tempReq = new Object();
					_tempReq.answerBoardId = parseInt(_value);

					__common.cmdLoadByAjax('/classAns/classAnsDelete', JSON.stringify(_tempReq));
					_tp++;
				});

				if (_cnt == _tp){
					__progressAnswer.init();
				}
			} else {
				var _temp = new Object();
				_temp.answerBoardId = _this;
				__common.cmdLoadByAjax('/classAns/classAnsDelete', JSON.stringify(_temp));
				__progressAnswer.init();
			}
		} else {
			return;
		}
	}
};
