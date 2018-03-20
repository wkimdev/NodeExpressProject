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
		this.cmdLoadNewMember();
	},
	// 회원관리
	cmdLoadNewMember : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberMng/memberList', _formValue);
		
		_returnJson.done(function(_data){
			var _temp = []; 

			if(Object.keys(_data).length < 5){
				for(i=0; i < _data.length; i++){
					_temp.push(_data[i]);
				}
				
			} else {
				for(i=0; i < 5; i++){
					_temp.push(_data[i]);
				}
			}

			$("#tblMainMember").bootstrapTable('load', { data: _temp });

			$('#tblMainMember').bootstrapTable({
				data: _temp,
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				columns: [
					{
						field: 'memberType',
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
}

var __progress = {
	init : function(){
		console.log('=============ClassMng Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		//$('.sidebar-menu > .treeview:eq(0)').addClass('active');
		//$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		this.cmdLoadProgress();
		console.log('1111');
	},
	// 진도 리스트
	cmdLoadProgress : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/classMng/classMngList', _formValue);
		
		_returnJson.done(function(_data){
			var _temp = [];

			if(Object.keys(_data).length < 5){	
				for(i=0; i < _data.length; i++){
					_temp.push(_data[i]);
				}

			} else { 
				for(i=0; i < 5; i++){
					_temp.push(_data[i]);
				}
			}
			
			$("#tblMainProgress").bootstrapTable('load', { data: _temp });
			
			$('#tblMainProgress').bootstrapTable({
				data: _temp,
				classes: 'table table-striped table-no-bordered',
				pageSize: 5,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: false,
				buttonsClass : false,	//?
				columns: [
					{
						field: 'gradeCodeNm',
					}, {
						field: 'subjectCodeNm',
					}, {
						field: 'curriculum',
					},  {
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

var __bookMng = {
	init : function(){
		console.log('=============BookMng Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();
		this.cmdLoadBookMng();
	},
	// 도서 리스트
	cmdLoadBookMng : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/bookMng/bookMngList', _formValue);
		
		
		_returnJson.done(function(_data){
			var _temp = [];

			if(Object.keys(_data).length < 5 ) {
				for(i = 0; i < _data.length ; i++){
					_temp.push(_data[i]);
				}

			} else {
				for(i =0; i < 5; i++) {
					_temp.push(_data[i]);
				}
			}

			$('#tblMainBookMng').bootstrapTable('load', { data: _temp });

			$('#tblMainBookMng').bootstrapTable({
				data: _temp, 
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
					},{
						field: 'questCnt',
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
