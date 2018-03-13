var mysql = require('mysql');
var md5 = require('md5');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function memberMng() {
}

/**
 * 총 회원수 
 */
memberMng.prototype.selectMemberCnt = function(callback) {
	var sql = ' SELECT COUNT(*) AS CNT FROM MEMBER_MNG ;';

	connection.query(
        sql, 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};


/**
 * 회원관리 list를 출력(노출 최대 5명/전부).
 */
memberMng.prototype.selectMemberList = function(callback) {
	var sql = ' SELECT ( CASE WHEN MEMBER_TYPE = 1 THEN \'일반회원\' ELSE \'관리자\' END ) AS MEMBER_TYPE ' +
			  ' , MEMBER_NO, MEMBER_CODE_NM, NM, EMAIL, IFNULL(ENROL_CHILD_CNT, 0) AS ENROL_CHILD_CNT , ADD_DATE FROM tmp.MEMBER_MNG ORDER BY ADD_DATE DESC ;' ;

	connection.query(
        sql, 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};



/**
 * 회원관리 PUSH 수신여부 확인
 */
memberMng.prototype.selectMemberPushYn = function(callback) {
	var sql = ' SELECT PUSHSEND_YN, DEVICE_TOKEN FROM MEMBER_MNG ' +
			  '	WHERE PUSHSEND_YN = \'Y\'';

	connection.query(
        sql, 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};


/**
 * 회원관리 등록
 */
memberMng.prototype.insertMember = function(query, callback) {
    var email = query.body.email;
    var memberType = query.body.memberType;
    var memberPw = md5(query.body.password);
    var memberNm = query.body.nm;
    var enrolChildCnt = query.body.enrolChildCnt;
	var sns = query.body.sns;
	var deviceToken = query.body.deviceToken;

    var sql = ' INSERT INTO tmp.MEMBER_MNG ( EMAIL, MEMBER_TYPE, PASSWORD, NM, ENROL_CHILD_CNT, SNS, DEVICE_TOKEN ) ' +
              ' VALUES (?, ?, ?, ?, ?, ?, ?) ';

	// 중복 아이디 체크!!
	this.checkUserExist(query, function(err, rows){
		if (0 < rows.length){
			callback(err, false);
		} else {
			connection.query(
				sql,
                [email, memberType ,memberPw ,memberNm, enrolChildCnt, sns, deviceToken],
				function(err, rows) {
					if(err) console.log(err);
					else    console.log(rows);
					callback(err, rows);
				}
			);
		}
	});
};

/**
* 회원관리 수정
*/
memberMng.prototype.updateMember = function(query, callback) {
    var email = query.email;
    var memberType = query.memberType;
    var memberPw = md5(query.password);
    var memberNm = query.nm;
    var sns = query.sns;
	var memberNo = query.memberNo;

	var sql = ' UPDATE tmp.MEMBER_MNG SET MEMBER_TYPE = ?, NM = ?, EMAIL = ?, ' +
				' PASSWORD = ?, SNS = ? ' +
				' WHERE MEMBER_NO = ? ';
	connection.query(
		sql,
		[memberType, memberNm, email, memberPw, sns, memberNo],
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 회원관리 삭제
 */
memberMng.prototype.deleteMember = function(query, callback){
    var sql = ' DELETE FROM tmp.MEMBER_MNG WHERE MEMBER_NO = ? ';
        connection.query(
            sql, 
            [query.memberNo], 
            function(err, rows) {
                if(err) console.log(err);
                else    console.log(rows);
                callback(err, camelcaseKeys(rows));
            }
        );
}

/**
 * 회원관리 이메일 수신여부
 */ 
memberMng.prototype.updateEmailSend = function(query, callback){
	//Y 수신
	//N 미수신
    var sql = ' UPDATE tmp.MEMBER_MNG ' +
              ' SET EMAILSEND_YN=? '    +
              ' WHERE MEMBER_NO=? ';
        connection.query(
            sql, 
			[query.body.emailSendYn, query.cookies.memberNo],
            function(err, rows) {
            	console.log('ID : ' + query.cookies.ID);
                if(err) console.log(err);
                else    console.log(rows);
                callback(err, camelcaseKeys(rows));
            }
        );
}

/**
* 회원관리 푸시알람 수신여부 수정
*/
memberMng.prototype.updatePushSend = function(query, callback){
	//Y 수신
	//N 미수신
	var sql =  ' UPDATE tmp.MEMBER_MNG ' +
				' SET PUSHSEND_YN=? '     +
				' WHERE MEMBER_NO=? ';
	connection.query(
		sql, 
		[query.body.pushsendYn, query.cookies.memberNo],
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
* 회원관리 가입여부 확인
*/
memberMng.prototype.checkUserExist = function(query, callback){
	var email = query.email;

	var sql = ' SELECT * FROM tmp.MEMBER_MNG ' +
				' WHERE EMAIL = ? ';
	connection.query(
		sql, 
		[email],
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);

			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
* 회원정보 by memberNo
*/
memberMng.prototype.selectMember = function(query, callback){
	var memberNo = query.memberNo;

	var sql = ' SELECT * FROM tmp.MEMBER_MNG ' +
				' WHERE MEMBER_NO = ? ';
	connection.query(
		sql, 
		[memberNo],
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);

			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 회원 랜덤 패스워드 업데이트
 */
memberMng.prototype.randomUpdateUserPassword = function( query, callback ) {
	
	var sql = 'UPDATE tmp.MEMBER_MNG SET PASSWORD = ? WHERE EMAIL = ?';
	connection.query(
		sql,
		[md5(query.password), query.email],
		function( err, rows ) {
			if ( err ) console.log( err );		

			callback(err, camelcaseKeys(rows));
		} 
	);
};

module.exports = new memberMng();