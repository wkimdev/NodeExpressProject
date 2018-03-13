var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function bookQuest() {
}

/**
 * 도서 질문관리 리스트 출력.
 */
bookQuest.prototype.selectBookQuest = function(query, callback) {
	var sql = ' SELECT BQM.QUEST_BOARD_ID, BQM.QUEST, IFNULL(BAM.ANSWER_CNT, 0) AS ANSWER_CNT ' +
			  ' FROM BOOK_QUEST_MNG BQM ' +
			  ' LEFT OUTER JOIN ( SELECT COUNT(*) AS ANSWER_CNT, QUEST_BOARD_ID FROM BOOK_ANS_MNG GROUP BY QUEST_BOARD_ID ) BAM ' +
			  ' ON BQM.QUEST_BOARD_ID = BAM.QUEST_BOARD_ID WHERE BQM.BOOK_BOARD_ID = ? '
	
	connection.query(
		sql,
		[query.bookBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 수정할 도서 질문관리 리스트 출력.
 */
bookQuest.prototype.selectBookQuestOne = function(query, callback) {
	var sql = ' SELECT BOOK_BOARD_ID, QUEST_BOARD_ID, QUEST, ADD_ID, ADD_DATE, UPDATE_DATE, UPDATE_ID, ANSWER_CNT ' + 
	 		  ' FROM BOOK_QUEST_MNG WHERE QUEST_BOARD_ID = ? ';
	
	connection.query(
		sql,
		[query.questBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

bookQuest.prototype.bookQuestAddIdCnt = function (query, callback) {
    var sql = " SELECT COUNT(*) AS QUEST_CNT FROM BOOK_QUEST_MNG WHERE ADD_ID = ?"

    connection.query(
        sql,
        [query.cookies.ID],
        function (err, rows) {
            if(err) console.log(err);
            else    console.log(rows);
            callback(err, camelcaseKeys(rows[0]));
        }
    )
}

/**
 * addId 에 대한 도서 질문 리스트
 */
bookQuest.prototype.bookQuestBoardId = function(query, callback) {
	var sql = " SELECT BQM.QUEST_BOARD_ID, BQM.BOOK_BOARD_ID, BQM.QUEST, BQM.ADD_ID, BQM.ADD_DATE, " +
			  " (SELECT COUNT(*) FROM BOOK_ANS_MNG WHERE QUEST_BOARD_ID = BQM.QUEST_BOARD_ID ) AS ANSWER_CNT" +
			  " FROM BOOK_QUEST_MNG AS BQM WHERE BQM.ADD_ID = ? ORDER BY BQM.QUEST_BOARD_ID DESC LIMIT ?, ?";

    var scale = 10;
    var page = 0;

    if ( query.body.page !== undefined ) {
        console.log("page is undefined");
        page = parseInt(query.body.page);
    }
	
	connection.query(
		sql,
		[query.cookies.ID, page, scale],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * questBoardId에 대한 진도 질문 리스트 출력
 */
bookQuest.prototype.selectBookQuestTp = function(query, callback) {
    var sql = ' SELECT ( CASE WHEN PICK_TP = \'\' THEN 0 ' +
              ' WHEN PICK_TP IS NULL THEN 0 END ) AS PICK_TP, QUEST_BOARD_ID, QUEST FROM BOOK_QUEST_MNG WHERE QUEST_BOARD_ID = ? ;';

	connection.query(
        sql,
        [parseInt(query["questBoardId[]"])],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
  * 도서 게시글 선정 여부 카운트
 */
bookQuest.prototype.selectBookQuesTpCnt = function(callback) {
	var sql = ' SELECT COUNT(*) AS CNT FROM BOOK_QUEST_MNG WHERE PICK_TP = 1 ;';
	
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
 * bookBoardId 에 대한 도서 질문
 */
bookQuest.prototype.bookQuestListByBookBoardId = function (query, callback) {
	var sql = " SELECT * FROM BOOK_QUEST_MNG WHERE QUEST_BOARD_ID = ?";
	console.log('>>>>>>>>>>>>>>>>>>>>>');
	console.log('questBoardId : ' + query.body.questBoardId);
    console.log('<<<<<<<<<<<<<<<<<<<<<');
	connection.query(
		sql,
		[query.body.questBoardId],
		function (err, rows) {
			if ( err )	console.log(err);
			else 		console.log(rows);
			callback(err, camelcaseKeys(rows));
        }
	);
};

/**
 * 선정된 도서 질문 게시글 정보 
 */
bookQuest.prototype.selectBookQuestTpList = function(callback) {
    var sql = ' SELECT QUEST_BOARD_ID, QUEST FROM BOOK_QUEST_MNG WHERE PICK_TP = 1;';

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
 * 도서 질문 등록
 */
bookQuest.prototype.insertBookQuest = function(query, callback) {
	var sql = ' INSERT INTO tmp.BOOK_QUEST_MNG ( BOOK_BOARD_ID, QUEST, ADD_ID ) ' + 
			  ' VALUES ( ?, ?, ? ) ';

	connection.query(
		sql,
		[query.body.bookBoardId, query.body.contents, query.cookies.ID],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
* 도서 질문 수정
*/
bookQuest.prototype.updateBookQuest = function(query, callback) {
    var sql = ' UPDATE tmp.BOOK_QUEST_MNG ' +
			  ' SET UPDATE_ID = ?, QUEST=? WHERE QUEST_BOARD_ID = ? ';

	connection.query(
		sql,
		[query.cookies.ID, query.body.contents, query.body.questBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 도서 질문 토픽 선정
 */
bookQuest.prototype.updateBookQuestTp = function(query, callback) {
    var sql = ' UPDATE tmp.BOOK_QUEST_MNG ' +
              ' SET PICK_TP = 1, UPDATE_ID = ? ' +
              ' WHERE QUEST_BOARD_ID = ? ;';

    connection.query(
        sql, 
        [query.cookies.ID, query.body.questBoardId], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }   
    );
};

/**
 * 진도 질문 토픽 해제
 */
bookQuest.prototype.bookQuestTpDelete = function(query, callback) {
    var sql = ' UPDATE tmp.BOOK_QUEST_MNG ' +
              ' SET PICK_TP = 0, UPDATE_ID = ? ' +
              ' WHERE QUEST_BOARD_ID = ? ;';

    connection.query(
        sql, 
        [query.cookies.ID, query.body.questBoardId], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }   
    );
};

/**
* 도서 질문 삭제
*/
bookQuest.prototype.deleteBookQuest = function(query, callback){
    var questBoardId = query.questBoardId;

	var sql = ' DELETE FROM tmp.BOOK_QUEST_MNG WHERE QUEST_BOARD_ID = ? ';

	connection.query(
		sql,
		[questBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

module.exports = new bookQuest();