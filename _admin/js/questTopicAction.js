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

var __questTp = {
	init : function(){
		console.log('=============quest Topic Mng Page Init!!=============');

		// 로그인 체크 !!
		__common.cmdCheckCookie();

		// Navi active !!
		$('.sidebar-menu > li:eq(6)').addClass('active');
//		$('.sidebar-menu > .treeview:eq(0) > ul.treeview-menu li:eq(0)').addClass('active');

		this.cmdLoadquestTopicMng();
	},
	cmdLoadquestTopicMng : function(_this) {
		var _formValue = _this;
		
		var classQuestTpCnt = TpInfoCnt.classQuestTpCnt();
		var bookQuestTpCnt = TpInfoCnt.bookQuestTpCnt();

		var temp1 = classQuestTpCnt[0].cnt;
		var temp2 = bookQuestTpCnt[0].cnt;
		var pk = [];
		var _returnJson = ''

		if (temp1 == 1) {
			//진도 질문 값
			_returnJson = __common.cmdLoadByAjax('/classQuest/selectedClassQuest', _formValue);
			pk.key = 'C';
		} else if(temp2 == 1) {
			//도서 질문 값
			_returnJson = __common.cmdLoadByAjax('/bookQuest/selectedBookQuest', _formValue);
			pk.key = 'B';
		} else {
			alert('선정된 질문이 없습니다!');
		}
		
		_returnJson.done(function(_data) {
			$('#tblQuestTp').bootstrapTable('load', { data: _data });

			console.log(JSON.stringify(_data));
			$('#tblQuestTp').bootstrapTable({
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
                    }, {
						field: this.pk,
						visible : true
                    }, {
						formatter: function (_string, _row, _index) {
							_row.pk = pk.key;
							return '<buton type="button" class="btn btn-warning btn-xs" onclick="__questTp.cmdUpdateQuestTopic(' + _row.questBoardId + ',\'' + _row.pk + '\');">선정해제</buton>';
						}
					}
				]
			});
		});
	},
	cmdUpdateQuestTopic : function(_this, _pk) {
		var _formValue = new Object();
		_formValue.questBoardId = _this;
		_formValue.pk = _pk;
		var _returnJson = ''

		if (_formValue.pk == 'C') {
			//CLASS 토픽 선택 수정
			_returnJson = __common.cmdLoadByAjax('/classQuest/classQuestTpDelete', JSON.stringify(_formValue));

			alert('진도 토픽 선정 질문 해제!');
		} else {
			//BOOK 토픽 선택 수정
			_returnJson = __common.cmdLoadByAjax('/bookQuest/bookQuestTpDelete', JSON.stringify(_formValue));
			alert('도서 토픽 선정 질문 해제!');
		} 

		_returnJson.done(function(_data){
			__questTp.cmdLoadquestTopicMng();
		});
	}
};

