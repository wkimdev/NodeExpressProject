var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function bookAns() {
}

/**
 * 도서 답변 리스트
 */
bookAns.prototype.selectBookAns = function(query, callback) {
	var sql = ' SELECT BAM.QUEST_BOARD_ID, BAM.ANSWER_BOARD_ID, BAM.CONTENTS, BAM.ADD_ID, BAM.ADD_DATE , ' +
			  ' ( SELECT COUNT(*) AS LIKE_CNT FROM BOOK_LIKE_MNG BLM WHERE BLM.ANSWER_BOARD_ID = BAM.ANSWER_BOARD_ID ) AS LIKE_CNT, ' +
			  ' ( SELECT COUNT(*) FROM BOOK_LIKE_MNG WHERE ADD_ID = "' + query.cookies.ID + '" AND ANSWER_BOARD_ID = BAM.ANSWER_BOARD_ID) AS isMyLike ' +
 			  ' FROM tmp.BOOK_ANS_MNG BAM ' +
			  ' WHERE BAM.QUEST_BOARD_ID = ? ORDER BY BAM.ANSWER_BOARD_ID DESC;';
			
	connection.query(
		sql,
		[query.body.questBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 수정할 도서 답변 리스트
 */
bookAns.prototype.selectBookAnsOne = function(query, callback) {
	var sql = ' SELECT ANSWER_BOARD_ID, CONTENTS, ADD_ID, IFNULL(LIKE_YN, 0) AS LIKE_CNT, ADD_DATE ' + 
			  ' FROM BOOK_ANS_MNG WHERE ANSWER_BOARD_ID = ? ';
			
	connection.query(
		sql,
		[query.answerBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * addId 에 대한 도서 답변 리스트
 */
bookAns.prototype.bookAnsBoardIdList = function(query, callback) {

	var sql = ' SELECT BAM.ANSWER_BOARD_ID, BAM.QUEST_BOARD_ID, BAM.CONTENTS, BAM.ADD_ID, BAM.ADD_DATE,' +
              ' (SELECT COUNT(*) FROM BOOK_LIKE_MNG WHERE ANSWER_BOARD_ID = BAM.ANSWER_BOARD_ID ) AS LIKE_CNT ' +
			  ' FROM BOOK_ANS_MNG AS BAM WHERE BAM.ADD_ID = ? ORDER BY BAM.ADD_DATE DESC';
			
	connection.query(
		sql,
		[query.cookies.ID],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 도서 답변 등록
 */
bookAns.prototype.insertBookAns = function(query, callback) {
	var sql = ' INSERT INTO tmp.BOOK_ANS_MNG ( QUEST_BOARD_ID, CONTENTS, ADD_ID ) ' +
			  ' VALUES ( ?, ?, ? ) ';

	connection.query(
		sql,
		[query.body.questBoardId, query.body.contents, query.cookies.ID],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 도서 답변 좋아요
 */

/**
 * 도서 답변 수정
 */
bookAns.prototype.updateBookAns = function(query, callback) {
	var sql = ' UPDATE tmp.BOOK_ANS_MNG ' +
			  ' SET CONTENTS=?, UPDATE_ID = ? ' +
			  ' WHERE ANSWER_BOARD_ID = ? ';

	connection.query(
		sql,
		[query.body.contents, query.cookies.ID, query.body.answerBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 도서 답변 삭제
 */
bookAns.prototype.deleteBookAns = function(query, callback){
    var answerBoardId = query.answerBoardId;

	var sql = ' DELETE FROM tmp.BOOK_ANS_MNG WHERE ANSWER_BOARD_ID = ? ';

	connection.query(
		sql,
		[answerBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

module.exports = new bookAns();