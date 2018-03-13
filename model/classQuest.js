var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function classQuest() {
}

/**
 * boardId에 대한 진도 질문 리스트 출력
 */
classQuest.prototype.selectClassQuestList = function(query, callback) {
    var sql = ' SELECT CQM.BOARD_ID, CQM.QUEST_BOARD_ID, CQM.QUEST, IFNULL(CAM.ANSWER_CNT, 0) AS ANSWER_CNT ' +
              ' FROM CLASS_QUEST_MNG CQM ' +
              ' LEFT OUTER JOIN ( SELECT COUNT(*) AS ANSWER_CNT, QUEST_BOARD_ID FROM CLASS_ANS_MNG GROUP BY QUEST_BOARD_ID ) CAM ' +
              ' ON CQM.QUEST_BOARD_ID = CAM.QUEST_BOARD_ID ' +
              ' WHERE CQM.BOARD_ID = ? ;';

	connection.query (
        sql,
        [query.boardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));	
		}
	);
};

/**
 * questId에 대한 진도 질문 리스트 출력
 */
classQuest.prototype.selectClassQuestListOne = function(query, callback) {
    var sql = ' SELECT BOARD_ID, QUEST_BOARD_ID, QUEST FROM CLASS_QUEST_MNG ' +
              ' WHERE QUEST_BOARD_ID = ?';

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

/**
 * questBoardId에 대한 진도 질문 리스트 출력
 */
classQuest.prototype.selectClassQuestTp = function(query, callback) {
    var sql = ' SELECT ( CASE WHEN PICK_TP = \'\' THEN 0 ' +
              ' WHEN PICK_TP IS NULL THEN 0 END ) AS PICK_TP, QUEST_BOARD_ID, QUEST FROM CLASS_QUEST_MNG WHERE QUEST_BOARD_ID = ? ;';

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
 * 진도 게시글 선정 여부 카운트
 */
classQuest.prototype.selectClassQuestTpCnt = function(query, callback) {
    var sql = ' SELECT COUNT(*) AS CNT FROM CLASS_QUEST_MNG WHERE PICK_TP = 1 ;';

	connection.query(
        sql,
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

classQuest.prototype.classQuestAddIdCnt = function (query, callback) {
    var sql = " SELECT COUNT(*) AS QUEST_CNT FROM CLASS_QUEST_MNG WHERE ADD_ID = ?";

    connection.query(
        sql,
        [query.cookies.ID],
        function (err, rows) {
            if( err )   console.log(err);
            else        console.log(rows);
            callback(err, camelcaseKeys(rows[0]));
        }
    )
}

/**
 * addId 에 대한 진도 질문 리스트
 */
classQuest.prototype.classQuestBoardId = function(query, callback) {
    var sql = " SELECT CQM.QUEST_BOARD_ID, CQM.BOARD_ID, CQM.QUEST, CQM.ADD_ID, CQM.ADD_DATE, " +
			  " (SELECT COUNT(*) FROM CLASS_ANS_MNG WHERE QUEST_BOARD_ID = CQM.QUEST_BOARD_ID ) AS ANSWER_CNT " +
              " FROM CLASS_QUEST_MNG AS CQM WHERE ADD_ID = ? ORDER BY QUEST_BOARD_ID DESC limit ?, ?";

    var scale = 10;
    var page = 0;

    if ( query.body.page !== undefined ) {
        console.log("page is undefined");
        page = parseInt(query.body.page);
    }
    console.log(page);

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
 * 선정된 진도 질문 게시글 정보 
 */
classQuest.prototype.selectClassQuestTpList = function(callback) {
    var sql = ' SELECT QUEST_BOARD_ID, QUEST FROM CLASS_QUEST_MNG WHERE PICK_TP = 1;';

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
 * 선정된 진도 질문 게시글 정보 ( 단일 )
 *
 */
classQuest.prototype.selectOneClassQuestTopic = function (query, callback) {
    var sql = ' (SELECT *, "jindo" FROM CLASS_QUEST_MNG WHERE PICK_TP = 1)' +
              ' UNION ' +
              ' (SELECT *, "book" FROM BOOK_QUEST_MNG WHERE PICK_TP = 1)';

    connection.query(
        sql,
        function (err, rows) {
            if ( err )  console.log(err);
            else        console.log(rows);
            callback(err, camelcaseKeys(rows));
        }
    )
};

/**
 * 진도 질문 등록
 */
classQuest.prototype.insertClassQuest = function(query, callback) {
    var sql = ' INSERT INTO tmp.CLASS_QUEST_MNG ( BOARD_ID, QUEST, ADD_ID ) ' +
               ' VALUES ( ?, ?, ? ) ';

    connection.query(
        sql, 
        [query.body.boardId, query.body.contents, query.cookies.ID], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    ); 

    
};

/**
 * 진도 질문 갯수 수정
 */
classQuest.prototype.updateClassQuestCnt = function(query, callback) {
    var questBoardId = query.questBoardId;

    var sql = ' UPDATE tmp.CLASS_MNG ' +
              ' SET QUEST_CNT = (SELECT COUNT(*) FROM tmp.CLASS_QUEST_MNG WHERE BOARD_ID = (SELECT BOARD_ID FROM CLASS_QUEST_MNG WHERE QUEST_BOARD_ID = ?)) ' +
              ' WHERE BOARD_ID = (SELECT BOARD_ID FROM tmp.CLASS_QUEST_MNG WHERE QUEST_BOARD_ID = ?) ;'

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
 * 진도 질문 토픽 선정
 */
classQuest.prototype.updateClassQuestTp = function(query, callback) {
    var sql = ' UPDATE tmp.CLASS_QUEST_MNG ' +
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
classQuest.prototype.classQuestTpDelete = function(query, callback) {
    var sql = ' UPDATE tmp.CLASS_QUEST_MNG ' +
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
 * 진도 질문 수정
 */
classQuest.prototype.updateClassQuest = function(query, callback) {
    var sql = ' UPDATE tmp.CLASS_QUEST_MNG ' +
              ' SET  UPDATE_ID = ?, QUEST=? WHERE QUEST_BOARD_ID = ? ';

    connection.query(
        sql, 
        [query.cookies.ID, query.body.contents, query.body.questBoardId], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }   
    );
};

/**
 * 진도 질문 삭제
 */
classQuest.prototype.deleteClassQuest = function(query, callback){
    var sql = ' DELETE FROM tmp.CLASS_QUEST_MNG WHERE QUEST_BOARD_ID = ? ';

    connection.query (
        sql, 
        [query.questBoardId], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

module.exports = new classQuest();