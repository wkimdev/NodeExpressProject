var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var md5 = require('md5');
var connection = dbPool.init();

function memberLogin() {
}

/**
 * 유저 token update
 * @param String token
 * @param String memberNo
 */
memberLogin.prototype.updateUserToken = function (query) {
    var token = query.token === undefined ? null : query.token;
    var email = query.email;

    console.log('===================== update user token ===============');
    var sql = " UPDATE MEMBER_MNG SET DEVICE_TOKEN = ? WHERE EMAIL = ?";
    console.log('===================== update user token ===============');
    connection.query(
        sql,
        [token, email],
        function (err, rows) {
            if ( err ) 	console.log( err );
            else { console.log(rows); }
        }
    );
};

/**
 * 관리자 화면 로그인 
 * 2018.02.27
 * 기존 관리자 테이블 (ADMIN_MEMBER_MNG) --> 회원 테이블 (MEMBER_MNG)에서 다 관리. 
 * MEMBER_TYPE 구분
 */
memberLogin.prototype.administratorLogin = function(query, callback) {
	//console.log('test test :'+JSON.stringify(query));
	//var sql = ' SELECT * FROM ADMIN_MEMBER_MNG WHERE ID = ? AND PASSWORD = ? ';
	var password = md5(query.password);
	var sql = 'SELECT * FROM MEMBER_MNG WHERE EMAIL = ? AND PASSWORD = ? AND MEMBER_TYPE = 2;';

	connection.query(
		sql,
		[query.id, password],
		function(err, rows){
			if (err) {
				callback(err, err.errno);
			}
			else {
				callback(err, camelcaseKeys(rows));
			}
		}
	);
};

/**
 * 사용자 로그인
 */
memberLogin.prototype.userLogin = function(query, callback) {
	
	var sql = ' SELECT * FROM MEMBER_MNG WHERE EMAIL = ? AND PASSWORD = ?';			
	connection.query(
		sql,
		[query.body.userId, md5(query.body.userPassword)],
		function(err, rows) {
			if ( err ) {
				callback(err, err.errno);
			}
			else {												
				callback(err, camelcaseKeys(rows));				
			}
		}
	);		
};

/**
 * 소셜 로그인 유저 확인 
 */
memberLogin.prototype.findSocialUserByEmail = function(query, callback) {
	var sns = query.sns;
	var email = query.email;
	var device_token = query.token === undefined ? null : query.token;

	var sql = 'SELECT * FROM MEMBER_MNG WHERE EMAIL = ? AND SNS = ?';
	connection.query(
		sql,
		[email, sns],
		function(err, rows) {
			if ( err ) { callback(err, err.errno); }
			else {
				if ( rows.length > 0 ) {
					var member = new memberLogin();
                    member.updateUserToken({token: device_token, email: email});
				}
				callback(err, camelcaseKeys(rows));
			}
		}
	)
}

/**
 * 소셜 로그인 유저 insert
 */
memberLogin.prototype.inserSocialUser = function(query, callback) {	
	var sns = query.sns;
	var email = query.email;
	var nm = (query.nm == 'undefined') ? null : query.nm;	
	var sql = 'INSERT INTO tmp.MEMBER_MNG (EMAIL, MEMBER_TYPE, NM, ENROL_CHILD_CNT, SNS,ADD_ID, MEMBER_CODE_NM, EXPOSE_YN) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )';
	connection.query(
		sql,
		[email, 1, nm, 0, sns, email, '일반', 1],
		function(err, rows, fields) {
			if ( err ) { callback(err, err.errno); }
			else { callback(err, camelcaseKeys(rows)); } 
		}
	)
};


module.exports = new memberLogin();