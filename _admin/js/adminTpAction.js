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

var __adminTpMng = {
	init : function(){
		console.log('=============Admin TopicMng Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > li:eq(4)').addClass('active');
//		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		this.cmdLoadadminTpMng();
	},
	cmdLoadadminTpMng : function(_this) {
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/adminTp/adminTpList', _formValue);
		
		_returnJson.done(function(_data) {
			$('#tblAdminTp').bootstrapTable('load', { data: _data });

			$('#tblAdminTp').bootstrapTable({
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
						field: 'adminBoardId',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.adminBoardId + ' "> ';
						}
					}, {
						field: 'title',
                    },  {
						field: 'addId',
                    },  {
						formatter: function (_string, _row, _index) {
							return moment(_row.addDate).format('YYYY-MM-DD');
						}
					},  {
						formatter: function (_string, _row, _index) {
							return '<buton type="button" class="btn btn-warning btn-xs" data-pushboardid="' + _row.adminBoardId + '" data-toggle="modal" data-target="#myModal">수정</buton>&nbsp;' +
									'<buton type="button" class="btn btn-danger btn-xs" onclick="__adminTpMng.cmdDeleteAdminTpMng(\'' + _row.adminBoardId + '\');">삭제</buton>';
						}
					}
				]
			});
		});
	},
	cmdInsertAdminTpMng : function(_this) {	
		var _formValue = _this;
		var _returnJson = __common.cmdLoadByAjax('/adminTp/adminTpAdd', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__adminTpMng.cmdLoadadminTpMng();
		}); 
	},
	cmdUpdateAdminTpMng : function(_this) {
		var _formValue = _this;
		console.log(JSON.stringify(_formValue.serializeObject()));
		var _returnJson = __common.cmdLoadByAjax('/adminTp/adminTpUpdate', JSON.stringify(_formValue.serializeObject()));
		
		_returnJson.done(function(_data){
			__adminTpMng.cmdLoadadminTpMng();
		});
	},
	cmdSelectAdminTpMng : function(_this) {
		var _formValue = new Object();
		_formValue.adminBoardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/adminTp/adminTpListOne', JSON.stringify(_formValue));

		return _returnJson;
    },
    cmdDeleteAdminTpMng : function(_this) {

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
					_tempReq.adminBoardId = parseInt(_value);

					__common.cmdLoadByAjax('/adminTp/adminTpDelete', JSON.stringify(_tempReq));
					_tp++;
				});

				if (_cnt == _tp){
					__adminTpMng.init();
				}
			} else {
				var _temp = new Object();
				_temp.adminBoardId = _this;
				__common.cmdLoadByAjax('/adminTp/adminTpDelete', JSON.stringify(_temp));
				__adminTpMng.init();
			}
		} else {
			return;
		}
	},
};

