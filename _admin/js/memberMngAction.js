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
			$('#tblMemberMng').bootstrapTable('load', { data: _data });

			$('#tblMemberMng').bootstrapTable({
				data: _data, 
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: true,
				columns: [
					{
						title: '선택',
						field: 'memberNo',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.memberNo + ' "> ';
						}
					}, {
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
	//총 회원수 
	cmdSelectMemberCnt : function(_this) {
		var _formValue = new Object();
		_formValue.memberNo = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberMng/memberCnt', JSON.stringify(_formValue));

		return _returnJson;
	},
	//회원 체크
	cmdCheckUserExist : function(_this) {
		var _formValue = new Object();
		_formValue.email = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberMng/checkUserExist', JSON.stringify(_formValue));

		return _returnJson;
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
	cmdSelectMemberMng : function(_this) {
		var _formValue = new Object();
		_formValue.memberNo = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/memberMng/memberSelect', JSON.stringify(_formValue));

		return _returnJson;
	},
	cmdDeleteMemberMng : function(_this) {
		//_this = 32;
		var mb = parseInt(_this);

		if (confirm(' 삭제 후 복구되지 않습니다. ') == true) {
			var _temp = [];
			
			if(mb.length > 0){

				for(i = 0; i < mb.length ; i++){
					_temp.push(mb[i]);
				}

				var _cnt = _temp.length;
				var _tp = 0;

				$.each(_temp, function(_index, _value){
					var _tempReq = new Object();
					_tempReq.memberNo = parseInt(_value);

					__common.cmdLoadByAjax('/memberMng/memberDelete', JSON.stringify(_tempReq));
					_tp++;
				});

				if (_cnt == _tp){
					__memberMng.init();
				}
			} else {
				var _temp = new Object();
				_temp.memberNo = mb;
				__common.cmdLoadByAjax('/memberMng/memberDelete', JSON.stringify(_temp));
				__memberMng.init();
			}
		} else {
			return;
		}
	}
};
