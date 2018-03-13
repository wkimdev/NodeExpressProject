var express = require('express');
var router = express.Router();
var pushMngDb = require('../model/pushMng');
var memberMngDb = require('../model/memberMng');
var _resturn = require('../model/res');
var _fcm = require('../util/push_fcm');

/**  
  * 푸시 발송 리스트
  * @route {POST} /pushMng/pushList
  */
router.all('/pushList', function(req, res) {
	pushMngDb.selectPushMngList(function (err, rows) {
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		} else {
			_resturn.result = 1;
			_resturn.resultMsg = '';
			_resturn.resultData = rows;
		}

		res.send(_resturn);
	});
});

/**  
  * 푸시 발송 메세지 등록
  * @route {POST} /pushMng/pushAdd
  */
router.all('/pushAdd', function(req, res) {
    pushMngDb.insertPushMng(req, function(err, rows){
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		} else {
			_resturn.result = 1;
			_resturn.resultMsg = '';
			_resturn.resultData = rows;
		}

		res.send(_resturn);
    });
});

/**  
  * 푸시 발송 수정
  * @route {POST} /pushMng/pushAdd
  */
router.all('/pushUpdate', function(req, res){
    pushMngDb.updatePushMng(req.body, function (err, rows) {
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		} else {
			_resturn.result = 1;
			_resturn.resultMsg = '';
			_resturn.resultData = rows;
		}

		res.send(_resturn);
    });
});

/**  
  * 푸시 발송 삭제
  * @route {POST} /pushMng/pushDelete
  */
  router.all('/pushDelete', function(req, res){
    pushMngDb.deletePushMng(req.body, function (err, rows) {
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		} else {
			_resturn.result = 1;
			_resturn.resultMsg = '';
			_resturn.resultData = rows;
		}

		res.send(_resturn);
    });
});

/**
* 푸시 발송 선택 by pushBoardId
* @route {POST} /pushMng/pushSelect
*/
router.all('/pushSelect', function(req, res){
	pushMngDb.selectPushMng(req.body, function (err, rows) {
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		} else {
			_resturn.result = 1;
			_resturn.resultMsg = '';
			_resturn.resultData = rows;
		}

		res.send(_resturn);
	});
});

/**
* 푸시 발송 by pushBoardId
* @route {POST} /pushMng/pushSend
*/
router.all('/pushSend', function(req, res){
	var __title = '';
	var __contents = '';

	pushMngDb.selectPushMngListOne(req.body, function (err, rows) {
		__title = rows[0].title;
		__contents = rows[0].contents;
		console.log('selectPushMngListOne');

		memberMngDb.selectMemberPushYn(function(err, rows){
			console.log('selectMemberPushYn');
				
				for(var i =0; i < rows.length ; i++){
					if(rows[i].pushsendYn == 'Y'){
						var _temp = new Object();
						_temp.deviceToken = rows[i].deviceToken;
						_temp.title = __title;
						_temp.contents = __contents;
				
						console.log(_temp);
						_fcm.Send(_temp);
					}
				}
	
	
			});
	});


		res.send();
});


module.exports = router;