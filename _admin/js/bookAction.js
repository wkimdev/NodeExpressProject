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

const bookTpInfo = {
	// ajax 설정
    init: function () {
        $.ajaxSetup({
            global: false,
            async: false,
            dataType: 'json'     
        });
    },

    // 도서 토픽 목록
    bookQuestTp: function ( questBoardId ) {
        this.init();
		var list = [];
		var param = {questBoardId : questBoardId}
        $.post('/bookQuest/bookQuestTp', param, function ( res ) {
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

var __category = {
	init : function(){
		console.log('=============CategoryMng Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > .treeview:eq(1)').addClass('active');
		$('.sidebar-menu > .treeview:eq(1) > ul.treeview-menu li:eq(0)').addClass('active');

		this.cmdLoadCategory();
	},
	// 카테고리 리스트
	cmdLoadCategory : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/categoryMng/categoryList', _formValue);
		
		_returnJson.done(function(_data){
			$('#tblCategory').bootstrapTable('load', { data: _data });

			$('#tblCategory').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 5,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: true,
				paginationHAlign : 'left',
				buttonsClass : false,	//?
				columns: [
					{
						title: '선택',
						field: 'categoryId',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.categoryId + ' "> ';
						}
					}, {
						field: 'categoryNm',
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-seq="' + _row.categoryId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;'
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__category.cmdDeleteCategory(' + _row.categoryId + ');">삭제</buton>';
						}
					}
				]

			});
		});

	},

	// 선택한 baordId에 대한 게시글 ???
	cmdSelectCategoryList : function(_this) {
		var _formValue = new Object();
		_formValue.categoryId = _this;	//categoryId

		var _returnJson = __common.cmdLoadByAjax('/categoryMng/categoryList', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 카테고리 불러오기
	cmdSelectBookMngListOne : function(_this) {
		var _formValue = new Object();
		_formValue.bookBoardId = _this;	

		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngSelect', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 카테고리 등록
	cmdInsertCategory : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/categoryMng/categoryAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__category.cmdLoadCategory();
		});
	},
	// 카테고리 수정
	cmdUpdateCategory : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/categoryMng/categoryUpdate', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			__category.cmdLoadCategory();
		});
	},
	// 카테고리 삭제
	cmdDeleteCategory : function(_this) {

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
					_tempReq.categoryId = parseInt(_value);

					__common.cmdLoadByAjax('/categoryMng/categoryDelete', JSON.stringify(_tempReq));
					_tp++;
				});

				if (_cnt == _tp){
					__category.init();
				}
			} else {
				var _temp = new Object();
				_temp.categoryId = _this;
				__common.cmdLoadByAjax('/categoryMng/categoryDelete', JSON.stringify(_temp));
				__category.init();
			}
		} else {
			return;
		}
	}
};

var __bookMng = {
	init : function(){
		console.log('=============BookMng Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
 		$('.sidebar-menu > .treeview:eq(1)').addClass('active');
		$('.sidebar-menu > .treeview:eq(1) > ul.treeview-menu li:eq(1)').addClass('active');
		
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
				pagination: true,
				paginationHAlign : 'left',
				columns: [
					{
						title: '선택',
						field: 'bookBoardId',
			 			 formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.bookBoardId + ' "> ';
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
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/question/bookQuest.html?bookBoardId='+ _row.bookBoardId +'\';">'+ _row.questCnt +'</buton>';
						}
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-bookboardid="' + _row.bookBoardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;' +
								   '<buton type="button" class="btn btn-danger btn-xs" onclick="__bookMng.cmdDeleteBookMng(' + _row.bookBoardId + ');">삭제</buton>';
						}
					}
				]
			});
			console.log(_data);
		});
	},
	//questBoardId에 대한 질문 리스트
	cmdSelectBookMngListOne : function(_this) {
		var _formValue = new Object();
		_formValue.bookBoardId = _this;	

		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngSelect', JSON.stringify(_formValue));
		
		return _returnJson;
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
					_tempReq.bookBoardId = parseInt(_value);

					__common.cmdLoadByAjax('/bookMng/bookMngDelete', JSON.stringify(_tempReq));
					_tp++;
				});

				if (_cnt == _tp){
					__bookMng.cmdLoadBookMng();
				} 
			} else {
				var _temp = new Object();
				_temp.bookBoardId = _this;
				__common.cmdLoadByAjax('/bookMng/bookMngDelete', JSON.stringify(_temp));
				__bookMng.init();
			}
		} else {
			return;
		}
	},
	// 도서 정보 선택
	cmdSelectBookMng : function(_this) {
		var _formValue = new Object();
		_formValue.bookBoardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngSelect', JSON.stringify(_formValue));

		return _returnJson;
	},
};

var __bookExp = {
	init : function(){
		console.log('=============BookExp Page Init!!=============');

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
				pagination: true,
				paginationHAlign : 'left',
				columns: [
					{
						title: '선택',
						field: 'bookBoardId',
			 			 formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.bookBoardId + ' "> ';
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
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/question/bookQuest.html?bookBoardId='+ _row.bookBoardId +'\';">'+ _row.questCnt +'</buton>';
						}
					}, {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					}, {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-bookboardid="' + _row.bookBoardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;' +
								   '<buton type="button" class="btn btn-danger btn-xs" onclick="__bookMng.cmdDeleteBookMng(' + _row.bookBoardId + ');">삭제</buton>';
						}
					}
				]
			});
			console.log(_data);
		});
	},
	//questBoardId에 대한 질문 리스트
	cmdSelectBookMngListOne : function(_this) {
		var _formValue = new Object();
		_formValue.bookBoardId = _this;	

		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngSelect', JSON.stringify(_formValue));
		
		return _returnJson;
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
		console.log(0)
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__bookMng.cmdLoadBookMng();
		});
	},
	// 도서 정보 삭제
	cmdDeleteBookMng : function(_this) {

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
					_tempReq.bookBoardId = parseInt(_value);

					__common.cmdLoadByAjax('/bookMng/bookMngDelete', JSON.stringify(_tempReq));
					_tp++;
				});

				if (_cnt == _tp){
					__bookMng.cmdLoadBookMng();
				} 
			} else {
				var _temp = new Object();
				_temp.bookBoardId = _this;
				__common.cmdLoadByAjax('/bookMng/bookMngDelete', JSON.stringify(_temp));
				__bookMng.init();
			}
		} else {
			return;
		}
	},
	// 도서 정보 선택
	cmdSelectBookMng : function(_this) {
		var _formValue = new Object();
		_formValue.bookBoardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngSelect', JSON.stringify(_formValue));

		return _returnJson;
	},
};

var __bookQuest = {
	init : function(){
		console.log('=============BookMng Quest Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > .treeview:eq(0)').addClass('active');
		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		var bookBoardId = __common.getUrlParameter('bookBoardId');
		var questBoardId = __common.getUrlParameter('questBoardId');

		$("#bookBoardId").val(bookBoardId);
		$("#questBoardId").val(questBoardId);

		this.cmdLoadBookMngQuest1(bookBoardId);
		this.cmdLoadBookMngQuest2(bookBoardId);
	},
	cmdLoadBookMngQuest1 :function(_bookBoardId){
		var _formValue = new Object();
		_formValue.bookBoardId = parseInt(_bookBoardId);

		//한개만 가져오도록
		var _returnJson = __bookMng.cmdSelectBookMngListOne(_bookBoardId);

		_returnJson.done(function(_data){
			$('#tblBookMngQuest1').bootstrapTable('load', { data: _data });
			//질문 관리 
			$('#tblBookMngQuest1').bootstrapTable({
				data: _data,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						field: 'categoryNm',
					}, {
						formatter: function (_string, _row, _index) {
							return '<img src="'+ _row.fileTextName +'" alt="..." class="img-rounded img-responsive" style="width:50px;">';
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
						field: 'questCnt',
					}
				]
			});
		});

	},
	cmdLoadBookMngQuest2 : function(_bookBoardId) {
		var _formValue = new Object();
		_formValue.bookBoardId = parseInt(_bookBoardId);

		var _returnJson = __bookQuest.cmdSelectBookQuest(_bookBoardId);	

		_returnJson.done(function(_data){
			$('#tblBookMngQuest2').bootstrapTable('load', { data: _data });
			//질문 목록 리스트 
			$('#tblBookMngQuest2').bootstrapTable({
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
							return '<buton type="button" class="btn btn-link btn-xs" onclick="location.href=\'/admin/answer/bookAns.html?questBoardId='+ _row.questBoardId +'\';">'+ _row.answerCnt +'</buton>';
						}
					},{
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-seq="' + _row.questBoardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;'
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__bookQuest.cmdDeleteBookMngQuest(' + _row.questBoardId + ');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	//questBoardId에 대한 토픽 선정
	cmdSelectBookQuestTp : function(_this) {
		var questBoardId = _this;	//questBoardId

		//게시글의 토픽 선정 여부 
		var bookQuestTp = bookTpInfo.bookQuestTp(questBoardId);	

		//전체 질문게시글의 토픽 선정 여부  
		var classQuestTpCnt = TpInfoCnt.classQuestTpCnt();
		var bookQuestTpCnt = TpInfoCnt.bookQuestTpCnt();

		var temp1 = bookQuestTp[0].pickTp;
		var temp2 = classQuestTpCnt[0].cnt;
		var temp3 = bookQuestTpCnt[0].cnt;

		if (temp1 == 0 && temp2 == 0 && temp3 == 0) {

			__bookQuest.cmdUpdateBookQuestTp(questBoardId);

			alert('토픽으로 선정되었습니다.!');
		} else {
			alert('이미 선정된 토픽이 있습니다. 토픽 선정을 해제한 뒤 선택하세요!');
		}

		return ;
	},
	// 도서 질문 토픽 선정
	cmdUpdateBookQuestTp : function(_this) {
		var _formValue = new Object();
		_formValue.questBoardId = _this;	
		var _returnJson = __common.cmdLoadByAjax('/bookQuest/bookQuestUpdateTp', JSON.stringify(_formValue));
		
		_returnJson.done(function(_data){
			__bookQuest.init();
		});
	},
	//bookboardId에 대한 질문 리스트
	cmdSelectBookQuest : function(_this) {
		var _formValue = new Object();
		_formValue.bookBoardId = _this;

		var _returnJson = __common.cmdLoadByAjax('/bookQuest/bookQuestList', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 선택한 questBoardId에 대한 게시글
	cmdSelectUpdateBookQuest : function(_this) {
		var _formValue = new Object();
		_formValue.questBoardId = _this;

		var _returnJson = __common.cmdLoadByAjax('/bookQuest/bookQuestListOne', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 진도 질문 등록
	cmdInsertBookMngQuest : function(_this) {		
		var _formValue = new Object();
		_formValue = _this;

		var _returnJson = __common.cmdLoadByAjax('/bookQuest/bookQuestAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__bookQuest.init();
		});
	},
	// 진도 질문 수정
	cmdUpdateBookMngQuest : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/bookQuest/bookQuestUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__bookQuest.init();
		});
	},
	// 진도 질문 삭제
	cmdDeleteBookMngQuest : function(_this) {
		
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

					__common.cmdLoadByAjax('/bookQuest/bookQuestDelete', JSON.stringify(_tempReq));
					_tp++;
				});

				if (_cnt == _tp){
					__bookQuest.init();
				}
			} else {
				var _temp = new Object();
				_temp.questBoardId = _this;
				__common.cmdLoadByAjax('/bookQuest/bookQuestDelete', JSON.stringify(_temp));
				__bookQuest.init();
			}
		} else {
			return;
		}
	}
};

var __bookAns = {
	init : function() {
		console.log('=============BookMng Answer Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > .treeview:eq(0)').addClass('active');
		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		var questBoardId = __common.getUrlParameter('questBoardId');
		var answerBoardId = __common.getUrlParameter('answerBoardId');

		$('#questBoardId').val(questBoardId);
		$('#answerBoardId').val(answerBoardId);

		this.cmdLoadBookAns1(questBoardId);
		this.cmdLoadBookAns2(questBoardId);
	},
	cmdLoadBookAns1 :function(_questBoardId){
		var _returnJson = __bookQuest.cmdSelectUpdateBookQuest(_questBoardId);	

		_returnJson.done(function(_data){
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
	cmdLoadBookAns2 : function(_questBoardId) {
		var _formValue = new Object();
		_formValue.questBoardId = _questBoardId;

		var _returnJson = __common.cmdLoadByAjax('/bookAns/bookAnsList', JSON.stringify(_formValue));

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
						title: '선택',
						field: 'answerBoardId',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.answerBoardId + ' "> ';
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
							+ '<buton type="button" class="btn btn-danger btn-xs" onclick="__bookAns.cmdDeleteBookAns(' + _row.answerBoardId + ');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	// answerBoardId에 대한 도서 답변 리스트
	cmdSelectBookAns : function(_this) {
		var _formValue = new Object();
		_formValue.answerBoardId = _this;	//answerBoardId

		var _returnJson = __common.cmdLoadByAjax('/bookAns/bookAnsList', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 선택한 answerBoardId에 대한 게시글
	cmdSelectUpdateBookAns : function(_this) {
		var _formValue = new Object();
		_formValue.answerBoardId = _this;

		var _returnJson = __common.cmdLoadByAjax('/bookAns/bookAnsListOne', JSON.stringify(_formValue));
		
		return _returnJson;
	},
	// 도서 답변 등록
	cmdInsertBookAns : function(_this) {		
		var _formValue = new Object();
		_formValue = _this;

		var _returnJson = __common.cmdLoadByAjax('/bookAns/bookAnsAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__bookAns.init();
		});
	},
	// 도서 답변 수정
	cmdUpdateBookAns : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/bookAns/bookAnsUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__bookAns.init();
		});
	},
	// 도서 답변 삭제	
	cmdDeleteBookAns : function(_this) {
		
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

					__common.cmdLoadByAjax('/bookAns/bookAnsDelete', JSON.stringify(_tempReq));
					_tp++;
				});

				if (_cnt == _tp){
					__bookAns.init();
				}
			} else {
				var _temp = new Object();
				_temp.answerBoardId = _this;
				__common.cmdLoadByAjax('/bookAns/bookAnsDelete', JSON.stringify(_temp));
				__bookAns.init();
			}
		} else {
			return;
		}
	}
};