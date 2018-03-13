var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function classAns() {
}

/**
 * questBoardId에 대한 진도 답변 리스트
 */
classAns.prototype.selectClassAnsList = function(query, callback) {
	var sql = ' SELECT CAM.QUEST_BOARD_ID, CAM.ANSWER_BOARD_ID, CAM.CONTENTS, CAM.ADD_ID, CAM.ADD_DATE , ' +
			  ' ( SELECT COUNT(*) AS LIKE_CNT FROM CLASS_LIKE_MNG CLM WHERE CLM.ANSWER_BOARD_ID = CAM.ANSWER_BOARD_ID ) AS LIKE_CNT, ' +
			  ' ( SELECT COUNT(*) FROM CLASS_LIKE_MNG WHERE ADD_ID = ' + query.memberNo + ' AND ANSWER_BOARD_ID = CAM.ANSWER_BOARD_ID) AS isMyLike ' +
 			  ' FROM tmp.CLASS_ANS_MNG CAM ' +
			  ' WHERE CAM.QUEST_BOARD_ID = ? ;';
    connection.query(
		sql,
		[query.questBoardId],
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * answerBoardId 에 대한 진도 답변 리스트
 */
classAns.prototype.selectClassAnsBoardList = function(query, callback) {
    var sql = ' SELECT QUEST_BOARD_ID, ANSWER_BOARD_ID, CONTENTS, ADD_ID, ( SELECT COUNT(*) AS LIKE_CNT FROM CLASS_LIKE_MNG WHERE ANSWER_BOARD_ID = ? ) AS LIKE_CNT, ' +
			  ' ADD_DATE FROM tmp.CLASS_ANS_MNG ' +
			  ' WHERE ANSWER_BOARD_ID = ? ';
			
	connection.query(
		sql,
		[query.answerBoardId, query.answerBoardId],
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * addId 에 대한 진도 답변 리스트
 */
classAns.prototype.classAnsBoardIdList = function(query, callback) {
	var sql = " SELECT CAM.ANSWER_BOARD_ID, CAM.QUEST_BOARD_ID, CAM.CONTENTS, CAM.ADD_ID, CAM.ADD_DATE, " +
              " ( SELECT COUNT(*) FROM CLASS_LIKE_MNG WHERE ANSWER_BOARD_ID = CAM.ANSWER_BOARD_ID ) AS LIKE_CNT" +
			  " FROM CLASS_ANS_MNG AS CAM WHERE CAM.ADD_ID = ? ORDER BY CAM.ADD_DATE DESC; ";
			
	connection.query(
		sql,
		[query.cookies.ID],
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 진도 답변 등록
 * @comment 2018-02-13 이지훈
 * @comment 쿠키로 int memberNo 와 String email 을 같이 넘깁니다. 해당값으로 핸들링 하시면 될 듯 합니다.
 */
classAns.prototype.insertClassAns = function(query, callback) {
    var questBoardId = query.questBoardId;

    var sql = ' INSERT INTO tmp.CLASS_ANS_MNG ( QUEST_BOARD_ID, CONTENTS, ADD_ID, LIKE_YN ) ' +
				' VALUES ( ?, ?, ?, ?)';

	connection.query(
		sql,
		[questBoardId, query.contents, query.email, query.likeYn],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
//			callback(err, camelcaseKeys(rows));
		}
	);

	//질문의 답변 갯수 업데이트
	var sql = ' UPDATE tmp.CLASS_QUEST_MNG ' +
			  ' SET ANSWER_CNT = (SELECT COUNT(*) FROM CLASS_ANS_MNG WHERE QUEST_BOARD_ID = ?) ' +
	  		  ' WHERE QUEST_BOARD_ID = ?';

	connection.query(
		sql, 
		[questBoardId, questBoardId], 
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
		}
	);
};

/**
 * 진도 답변 수정
 */
classAns.prototype.updateClassAns = function(query, callback) {
	var contents = query.contents;
    var answerBoardId = query.answerBoardId;
	
	//cookie처리?
    var updateId = 'admin@test.com';
    //var updateDate = query.updateDate;

    var sql = ' UPDATE tmp.CLASS_ANS_MNG ' +
			  ' SET CONTENTS= ?, UPDATE_ID = ?, UPDATE_DATE = NOW() ' +
			  ' WHERE ANSWER_BOARD_ID = ? ';

	connection.query(
		sql,
		[contents, updateId, answerBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 진도 답변 삭제
 */
classAns.prototype.deleteClassAns = function(query, callback){
	var answerBoardId = query.answerBoardId;

	var sql = ' DELETE FROM tmp.CLASS_ANS_MNG WHERE ANSWER_BOARD_ID = ? ';
	
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

/**
 * class + book Ans
 */
classAns.prototype.ansListWithBook = function (query, callback) {
    var sql = "  (SELECT CAM.ANSWER_BOARD_ID, CAM.QUEST_BOARD_ID, CAM.CONTENTS, CAM.ADD_ID, CAM.ADD_DATE, ";
        sql += " ( SELECT COUNT(*) FROM CLASS_LIKE_MNG WHERE ANSWER_BOARD_ID = CAM.ANSWER_BOARD_ID ) AS LIKE_CNT";
        sql += " FROM CLASS_ANS_MNG AS CAM WHERE ADD_ID = ? )";
        sql += " union";
        sql += " (SELECT BAM.ANSWER_BOARD_ID, BAM.QUEST_BOARD_ID, BAM.CONTENTS, BAM.ADD_ID, BAM.ADD_DATE,";
        sql += " (SELECT COUNT(*) FROM BOOK_LIKE_MNG WHERE ANSWER_BOARD_ID = BAM.ANSWER_BOARD_ID ) AS LIKE_CNT";
        sql += " FROM BOOK_ANS_MNG AS BAM WHERE ADD_ID = ? )";
        sql += " ORDER BY ANSWER_BOARD_ID DESC";
        sql += " LIMIT ?, 10";

    var page = 0;
    if ( query.body.page !== undefined ) page = parseInt(query.body.page);


    connection.query(
        sql,
        [query.cookies.ID, query.cookies.ID, page],
        function (err, rows) {
            if ( err )  console.log(err);
            else        console.log(rows);
            callback(err, camelcaseKeys(rows));
        }
    )
};

/**
 *
 * class + book Ans Count
 */
classAns.prototype.ansListCntWithBook = function (query, callback) {
    var sql =   "SELECT " +
                "(SELECT COUNT(*) FROM BOOK_ANS_MNG WHERE ADD_ID = ? ) + " +
                "(SELECT COUNT(*) FROM CLASS_ANS_MNG WHERE ADD_ID = ? ) AS ANS_CNT";

    connection.query(
        sql,
        [query.cookies.ID, query.cookies.ID],
        function (err, rows) {
            if ( err )  console.log(err);
            else        console.log(rows);
            callback(err, camelcaseKeys(rows));
        }
    )
}

module.exports = new classAns();