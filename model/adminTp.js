var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function adminTp() {
}

/**
 *  관리자 토픽 리스트
 */
adminTp.prototype.selectAdminTpList = function(callback) {
	var sql = ' SELECT ADMIN_BOARD_ID, TITLE, ADD_ID, ADD_DATE FROM tmp.ADMIN_TP_MNG '; 

	connection.query(
		sql,
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 *  사용자단 노출될 관리자 토픽(최신글)
 */
adminTp.prototype.selectedTpList = function(callback) {
	var sql = ' SELECT * FROM ADMIN_TP_MNG ORDER BY ADD_DATE DESC LIMIT 1; '; 

	connection.query(
		sql,
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 *  선택한 관리자 토픽 리스트
 */
adminTp.prototype.selectAdminTpListOne = function(query, callback) {
	var sql = ' SELECT ADMIN_BOARD_ID, TITLE, ADD_ID, CONTENTS, ADD_DATE FROM tmp.ADMIN_TP_MNG ' + 
			  ' WHERE ADMIN_BOARD_ID = ? ' ;

	connection.query(
		sql,
		[query.adminBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 관리자 토픽 등록
 */
adminTp.prototype.insertAdminTp = function(query, callback) {
	//ADMIN_NO
	//EXPOSE_YN 여부 체크
    var sql = ' INSERT INTO tmp.ADMIN_TP_MNG (ADD_ID, CONTENTS, TITLE) ' +
 			  ' VALUES ( ?, ?, ?) ' ;
			
	connection.query(
		sql,
		[query.cookies.ID, query.body.contents, query.body.title, query.body.exposeYn],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 관리자 토픽 수정
 */
adminTp.prototype.updateAdminTp = function(query, callback) {
     var sql = ' UPDATE tmp.ADMIN_TP_MNG ' +
				' SET TITLE=?, CONTENTS = ?, UPDATE_ID = ? ' +
			    ' WHERE ADMIN_BOARD_ID = ?';

	connection.query(
		sql,
		[query.body.title, query.body.contents, query.cookies.ID, query.body.adminBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 관리자 토픽 삭제
 */
adminTp.prototype.deleteAdminTp = function(query, callback){
	var sql = ' DELETE FROM tmp.ADMIN_TP_MNG WHERE ADMIN_BOARD_ID = ? ' ;
	
	connection.query(
		sql,
		[query.adminBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

module.exports = new adminTp();