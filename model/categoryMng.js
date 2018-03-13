var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function categoryMng() {
}

/**
 * 카테고리관리 리스트 출력
 */
categoryMng.prototype.selectCategoryList = function(callback) {
	var sql = ' SELECT CATEGORY_ID, CATEGORY_NM FROM CATEGORY_MNG ORDER BY CATEGORY_ID ASC ;';
	
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
 * 카테고리 등록
 */
categoryMng.prototype.insertCategory = function(query, callback) {
	console.log(query.body);
	console.log(query);

	var sql = ' INSERT INTO tmp.CATEGORY_MNG ( CATEGORY_NM, ADD_ID ) ' + 
			  ' VALUES ( ?, ? ) ;';
	
	connection.query(
		sql,
		[query.body.contents, query.cookies.ID],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 카테고리 수정
 */
categoryMng.prototype.updateCategory = function(query, callback) {
    var categoryNm = query.categoryNm;
    var updateDate = query.updateDate;
    var updateId = query.updateId;
    var categoryId = query.categoryId;

	var sql = ' UPDATE tmp.CATEGORY_MNG SET CATEGORY_NM=?,  UPDATE_ID=? ' +
			  ' WHERE CATEGORY_ID = ? ';
	
	connection.query(
		sql,
		[categoryNm, updateId, categoryId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 카테고리 삭제
 */
categoryMng.prototype.deleteCategory = function(query, callback) {
    var categoryId = query.categoryId;

	var sql = ' DELETE FROM tmp.CATEGORY_MNG WHERE CATEGORY_ID = ? ';
	
	connection.query(
		sql,
		[categoryId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

module.exports = new categoryMng();