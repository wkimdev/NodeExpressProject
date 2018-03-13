var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function pushMng() {
}

/**
* 푸시 발송 리스트
*/
pushMng.prototype.selectPushMngList = function(callback) {
	var sql = ' SELECT * FROM PUSH_MNG ORDER BY ADD_DATE DESC ; ';

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
* 선택한 푸시 발송 리스트
*/
pushMng.prototype.selectPushMngListOne = function(query, callback) {
	var sql = ' SELECT * FROM PUSH_MNG WHERE PUSH_BOARD_ID = ? ; ';

	connection.query(
        sql, 
        [query.pushBoardId],
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
		}
	);
};

/**
 * 푸시 발송 등록
 */
pushMng.prototype.insertPushMng = function(query, callback) {
    var sql = ' INSERT INTO tmp.PUSH_MNG ( TITLE, CONTENTS ) ' +
              ' VALUES ( ?, ? ) ';

    connection.query(
        sql, 
        [query.body.title,  query.body.contents, query.cookies.ID], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

/**
 * 푸시 발송 수정
 */
pushMng.prototype.updatePushMng = function(query, callback) {
    var title = query.title;
    var contents = query.contents;
    var pushBoardId = query.pushBoardId;
    
    var sql = ' UPDATE tmp.PUSH_MNG ' +
              ' SET TITLE=?, CONTENTS=? ' +
              ' WHERE PUSH_BOARD_ID = ? ' ;

    connection.query(
        sql, 
        [title , contents, pushBoardId], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

/**
 * 푸시 발송 삭제
 */
pushMng.prototype.deletePushMng = function(query, callback){
    var sql = ' DELETE FROM tmp.PUSH_MNG WHERE PUSH_BOARD_ID = ? ' ;

    connection.query(
        sql,
        [query.pushBoardId], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

pushMng.prototype.selectPushMng = function(query, callback) {
    var pushBoardId = query.pushBoardId;

	var sql = ' SELECT * FROM PUSH_MNG WHERE PUSH_BOARD_ID = ?; ';

	connection.query(
		sql, 
        [pushBoardId], 
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
		}
	);
};

pushMng.prototype.sendPushMng = function(query, callback) {
    var pushBoardId = query.pushBoardId;

	var sql = ' SELECT * FROM PUSH_MNG WHERE PUSH_BOARD_ID = ?; ';

	connection.query(
		sql, 
        [pushBoardId], 
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
		}
	);
};



module.exports = new pushMng();