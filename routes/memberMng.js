var express = require('express');
var router = express.Router();
var memberMngDb = require('../model/memberMng');
var _resturn = require('../model/res');
var mailSender = require('../util/send_mail')();
var uid = require('../util/uuid_creator')();
var loginProcessing = require('../util/set_login_cookie');
var loginUserDb = require('../model/memberLogin');

/**
* 총 회원수
* @route {GET} /memberMng/memberCnt
*/
router.all('/memberCnt', function(req, res) {
	memberMngDb.selectMemberCnt(function (err, rows) {
        res.send(rows);
    });
});

/**
* 회원관리 list를 출력.
* @route {POST} /memberMng/memberList
*/
router.all('/memberList', function(req, res) {
	/* memberMngDb.selectMemberList(function (err, rows) {
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		} else {
			_resturn.result = 1;
			_resturn.resultMsg = '';
			_resturn.resultData = rows;
		}

		res.send(_resturn);
	}); */

	memberMngDb.selectMemberList(function (err, rows) {
        res.send(rows);
    });
});

/**
* 회원관리 list를 출력.(MEMBER_NO)
* @route {POST} /memberMng/memberSelect
*/
router.all('/memberSelect', function(req, res) {
	memberMngDb.selectMember(req.body, function (err, rows) {
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		}else{
			_resturn.result = 1;
			_resturn.resultMsg = '';
			_resturn.resultData = rows;
		}

		res.send(_resturn);
	});
});

/**  
  * 회원관리 푸시알람 수신여부 
  * @route {POST} /memberMng/memberPushSend
  */
  router.all('/memberPushYn', function(req, res) {
	memberMngDb.selectMemberPushYn(function (err, rows) {
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		}else{
			_resturn.result = 1;
			_resturn.resultMsg = '';
			_resturn.resultData = rows;
		}

		res.send(_resturn);
	});
});  

/**  
  * 회원관리 푸시알람 수신여부 
  * @route {POST} /memberMng/checkUserExist
  */
  router.all('/checkUserExist', function(req, res) {
	memberMngDb.checkUserExist(req.body, function (err, rows) {
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		}else{
			//여기서 처리가 안됨.. 
			console.log('test length : '+rows.length);
			if(0 < rows.length){	//중복이 아닐경우
				_resturn.result = 1;
				_resturn.resultMsg = '';
				_resturn.resultData = rows;
			}else{
				_resturn.result = 2;
				_resturn.resultMsg = '중복입니다.';
				_resturn.resultData = rows;
			}
		}

		res.send(_resturn);
	});
});  

/**
* 회원관리 등록
* @route {POST} /memberMng/memberAdd
*/
router.all('/memberAdd', function(req, res) {
	
    memberMngDb.insertMember(req, function(err, rows){
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
            res.send(_resturn);
		}else{
			
			if (!!rows){
				console.log("!!rows ============================");
				_resturn.result = 0;
                var insertId = rows.insertId;
                memberMngDb.selectMember({memberNo: insertId, autoRedirect: true}, function (err1, rows1) {
                    loginProcessing.setLoginProcess(res, rows1);
                    res.send(_resturn);
                });
			}else{
				_resturn.result = 1;
                res.send(_resturn);
			}
		}

		//res.send(_resturn);
    });
});

/**  
  * 회원관리 수정
  * @route {POST} /memberMng/memberUpdate
  */
router.post('/memberUpdate', function(req, res){
    memberMngDb.updateMember(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 사용자 비밀번호 초기화
 * @route {POST} /memberMng/forgotUserPassword
 * @param String email 
 */
router.post('/forgotUserPassword', function( req, res ) {

	var randomPassword = uid.create(10);	
	// EMAIL SETUP
	var opt = {
		from: 'thtjwls@gmail.com',
		to: `${req.body.email}`,
		subject: '비밀번호 초기화',
		text: `초기화된 비밀번호는 ${randomPassword} 입니다.`
	};		

	//초기화된 비밀번호 update
	req.body.password = randomPassword;
	memberMngDb.randomUpdateUserPassword(req.body, function(err, rows) {		

		// 이메일 전송
		if ( rows.changedRows > 0 ) {
			mailSender.send(opt);
		}

		res.send(rows);
	});
});

/**  
  * 회원관리 삭제
  * @route {POST} /memberMng/memberDelete
  */
  router.all('/memberDelete', function(req, res){
    memberMngDb.deleteMember(req.body, function (err, rows) {		
        res.send(rows);
    })
})

/**  
  * 회원관리 이메일수신여부
  * @route {POST} /memberMng/emailSendUpdate
  */
  router.all('/emailSendUpdate', function(req, res){
    memberMngDb.updateEmailSend(req, function (err, rows) {
        res.send(rows);
    });
});
	
/**  
  * 회원관리 푸시알람 수신여부 수정
  * @route {POST} /memberMng/pushSendUpdate
  */
  router.all('/pushSendUpdate', function(req, res){
    memberMngDb.updatePushSend(req, function (err, rows) {
        res.send(rows);
    });
});


module.exports = router;