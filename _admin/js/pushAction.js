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

__pushSend = {
	cmdSendByPush : function () {
		//var push_fcm = require('../util/push_fcm');		html js에서 도는 것 
		//var send = push_fcm.init();
		//send.fcm.send();
		url : 'util/push_fcm';

		//console.
	}	
};

var __push = {
	init : function(){
		console.log('=============Push Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > li:eq(5)').addClass('active');

		this.cmdLoadPushMng();
	},
	cmdLoadPushMng : function(_this) {
		var _formValue = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/pushMng/pushList', _formValue);
		
		_returnJson.done(function(_data) {
			$('#tblPush').bootstrapTable('load', { data: _data.resultData });

			$('#tblPush').bootstrapTable({
				data: _data.resultData, 
				classes: 'table table-striped table-no-bordered',
				pageSize: 10,
				search: false,
				showRefresh: false,
				showColumns: false,
				pagination: true,
				columns: [
					{
						title: '선택',
						field: 'pushBoardId',
			 			formatter: function (_string, _row, _index) {
							return '<input type="checkbox" name="checkbox" value="' + _row.pushBoardId + ' "> ';
						}
					}, {
						field: 'title',
                    },  {
						formatter: function (_string, _row, _index) {
							return moment(_row.sendDate).format('YYYY-MM-DD');
						}
					}, {
						formatter: function (_string, _row, _index) {
							//return '<buton type="button" class="btn btn-warning btn-xs" onclick="__push.cmdPushSendFcm()" data-pushboardid="' + _row.pushBoardId + '" data-toggle="modal" data-target="#myModal">보내기</buton>&nbsp;'
							return '<buton type="button" class="btn btn-warning btn-xs" onclick="__push.cmdPushSendFcm(\'' + _row.pushBoardId + '\');">보내기</buton>';
						}
					},  {
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
	cmdSelectPushMng : function(_this) {
		var _formValue = new Object();
		_formValue.pushBoardId = _this;
		
		var _returnJson = __common.cmdLoadByAjax('/pushMng/pushSelect', JSON.stringify(_formValue));

		return _returnJson;
	},
	//fcm으로 푸시 내용에 동의한 회원에게 메세지 일괄 발송
	cmdPushSendFcm : function(_this) {
		var _formValue = new Object();
		_formValue.pushBoardId = _this;
		
		//전송할 DATA 내역 불러오기
		//title, body에 해당 내역 입력해야 함
		var _returnJson = __common.cmdLoadByAjax('/pushMng/pushSelect', JSON.stringify(_formValue));

		//fcm으로 메세지 전송
		return _returnJson;
	},
    cmdDeletePushMng : function(_this) {

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
					_tempReq.pushBoardId = parseInt(_value);

					__common.cmdLoadByAjax('/pushMng/pushDelete', JSON.stringify(_tempReq));
					_tp++;
				});

				if (_cnt == _tp){
					__push.init();
				}
			} else {
				var _temp = new Object();
				_temp.pushBoardId = _this;
				__common.cmdLoadByAjax('/pushMng/pushDelete', JSON.stringify(_temp));
				__push.init();
			}
		} else {
			return;
		}
	},
};

