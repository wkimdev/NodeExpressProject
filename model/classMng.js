var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function classMng() {
}

/**
 * 진도 list를 출력.
 */
classMng.prototype.selectClassMngList = function(callback) {
    var sql = ' SELECT CM.BOARD_ID ' +
                '  , ( CASE WHEN CM.MONTH_WEEK_CODE_NM = \'\' AND CM.MONTH_WEEK_CODE_NB =1 THEN \'1주차\' ' +
                '       ELSE CM.MONTH_WEEK_CODE_NM END ) AS MONTH_WEEK_CODE_NM ' +
                ', ( CASE WHEN CM.GRADE_CODE_NM = \'\' AND CM.GRADE_CODE_NB = 1 THEN \'1학년\'' +
                ' ELSE CM.GRADE_CODE_NM END ) AS GRADE_CODE_NM ' +
                ', ( CASE WHEN CM.SUBJECT_CODE_NM = \'\' AND CM.SUBJECT_CODE_NB = 1 THEN \'국어\' ' +
                ' ELSE CM.SUBJECT_CODE_NM END ) AS SUBJECT_CODE_NM ' +
                ', CM.CURRICULUM , IFNULL(CQM.QUEST_CNT, 0) AS QUEST_CNT, CM.ADD_DATE, CM.PICK_BOOK_BOARD, CM.PICK_CLASS_BOARD  ' +
                ' FROM CLASS_MNG CM ' +
                ' LEFT OUTER JOIN ( SELECT COUNT(*) AS QUEST_CNT , BOARD_ID FROM CLASS_QUEST_MNG GROUP BY BOARD_ID ) CQM ' +
                ' ON CQM.BOARD_ID = CM.BOARD_ID ORDER BY CM.ADD_DATE DESC ; ';

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
 * 진도 선택한 list
 */
classMng.prototype.selectClassBoardList = function(query, callback) {
    var sql = ' SELECT CM.BOARD_ID, CM.MONTH_WEEK_CODE_NM, CM.MONTH_WEEK_CODE_NB, CM.GRADE_CODE_NM, CM.GRADE_CODE_NB, CM.SUBJECT_CODE_NM, CM.SUBJECT_CODE_NB, ' +
              ' CM.CURRICULUM, CM.CONTENTS, CM.PICK_CLASS_BOARD, ' +
              ' (SELECT CURRICULUM FROM CLASS_MNG WHERE BOARD_ID = CM.PICK_CLASS_BOARD) AS PICK_CLASS_BOARD_ID_TEXT, ' +
              ' CM.PICK_BOOK_BOARD, (SELECT BOOKNAME FROM BOOK_INFO_MNG WHERE BOOK_BOARD_ID = CM.PICK_BOOK_BOARD ) AS PICK_BOOK_BOARD_ID_TEXT, '  +
              ' (SELECT COUNT(*) FROM tmp.CLASS_QUEST_MNG WHERE BOARD_ID = ?) AS QUEST_CNT, CM.ADD_DATE ' +
              ' FROM CLASS_MNG CM WHERE CM.BOARD_ID = ? '
    console.log(sql);

    connection.query(
        sql, 
        [query.boardId, query.boardId],
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

/**
 * Class 와 Book 에서
 */

/**
 * 교과 과정명 검색 리스트
 */
classMng.prototype.classSearchByCurNm = function(query, callback) {
    var text = query.curriculum;
    text.replace("\"", "");

    var sql = " SELECT BOARD_ID, CURRICULUM, SUBJECT_CODE_NM, GRADE_CODE_NM FROM CLASS_MNG WHERE CURRICULUM LIKE '%" + text + "%'";    

    connection.query(
        sql, 
        [text],
        function(err, rows) {
            if(err) console.log(err);
            else    console.log(rows);            
			callback(err, camelcaseKeys(rows));			
        }
    );
};

/**
 * 자녀 학년,월,주차 정보에 대한 진도리스트
 */
classMng.prototype.selectClassMngListChild = function(query, callback) {
    var monthCodeNb = query.monthCodeNb;     //현재 시간 기준 월
    var monthWeekCodeNb = query.monthWeekCodeNb; //현재 시간 기준 주차

    var sql = ' SELECT CM.* FROM CLASS_MNG AS CM ' +
              ' WHERE CM.GRADE_CODE_NB = ?  ' +
              ' AND CM.MONTH_WEEK_CODE_NB = ?  ' +
              ' AND CM.MONTH_CODE_NB = ? ' +
              ' ORDER BY MONTH_WEEK_CODE_NB ASC;';

    console.log(sql);
    connection.query(
        sql,
        [query.gradeCodeNb, monthWeekCodeNb, monthCodeNb],
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
        }
    );
};

/**
 * 자녀 학년,월 정보에 대한 진도리스트
 */
classMng.prototype.selectClassMngMonth = function(query, callback) {
    var monthCodeNb = 1;     //현재 시간 기준 월

    var sql = ' SELECT * FROM CLASS_MNG WHERE GRADE_CODE_NB = ?  AND MONTH_CODE_NB = ? ;';

    connection.query(
        sql, 
        [query.gradeCodeNb, monthCodeNb],
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

/**
 * 주차별 진도 그룹 리스트
 * @route {POST} /classMng/classMngWeekGroup
 * @param Integer gradeCodeNb
 * @param Integer monthCodeNb
 */
classMng.prototype.classMngWeekGroup = function (query, callback) {

    // 나중에 query.gradeCodeNb 로 변경
    var gradeCodeNb = 1;

    // 나중에 query.monthCodeNb 로 변경
    var monthCodeNb = 1;

    var sql = ' SELECT MONTH_WEEK_CODE_NB FROM CLASS_MNG WHERE GRADE_CODE_NB = ? AND MONTH_CODE_NB = ? GROUP BY MONTH_WEEK_CODE_NB';
    console.log(sql);
    connection.query(
        sql,
        [gradeCodeNb, monthCodeNb],
        function (err, rows) {
            if(err) console.log(err);
            else    console.log(rows);
            callback(err, camelcaseKeys(rows));
        }
    )
};

/**
 * 진도과정관리 등록
 */
classMng.prototype.insertClassMng = function(query, callback) {
    if(!query.body.pickClassBoardId){
        var pickClassBoardId = '';
    }else{
        var pickClassBoardId = query.body.pickClassBoardId;
    }

    if(!query.body.pickBookBoardId){
        var pickBookBoardId = '';
    }else{
        var pickBookBoardId = query.body.pickBookBoardId;
    }

    var sql = ' INSERT INTO tmp.CLASS_MNG ( CURRICULUM, CONTENTS, ADD_ID, MONTH_WEEK_CODE_NB, MONTH_WEEK_CODE_NM, ' + 
              ' GRADE_CODE_NB, GRADE_CODE_NM, SUBJECT_CODE_NB, SUBJECT_CODE_NM, MONTH_CODE_NM, MONTH_CODE_NB, PICK_CLASS_BOARD, PICK_BOOK_BOARD ) ' +
              ' VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ';

    connection.query(
        sql, 
        [ query.body.curriculum, query.body.contents, query.cookies.ID, query.body.monthWeekCodeNb, query.body.monthWeekCodeNm
            , query.body.gradeCodeNb, query.body.gradeCodeNm, query.body.subjectCodeNb, query.body.subjectCodeNm
            , query.body.monthCodeNm, query.body.monthCodeNb, pickClassBoardId, pickBookBoardId ], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

/**
 * 진도과정관리 수정
 */
classMng.prototype.updateClassMng = function(query, callback) {
    //console.log(JSON.stringify(query));
    var curriculum = query.curriculum;
    var contents = query.contents;
    //var updateDate = query.updateDate;
    var updateId = 'admin'; //session id값 호출

    //var monthWeekCodeNb = query.monthWeekCodeNb;
    var monthWeekCodeNm = query.monthWeekCodeNm;
    //var gradeCodeNb = query.gradeCodeNb;
    var gradeCodeNm = query.gradeCodeNm;
    //var subCodeNb = query.subCodeNb;
    var subjectCodeNm = query.subjectCodeNm;
    var boardId = query.boardId;

/*     var sql = ' UPDATE tmp.CLASS_MNG ' +
              ' SET CURRICULUM=?, CONTENTS=?, UPDATE_DATE=NOW(), UPDATE_ID=?, MONTH_WEEK_CODE_NB=?, MONTH_WEEK_CODE_NM=?, GRADE_CODE_NB=?, GRADE_CODE_NM=?, SUBJECT_CODE_NB=?, SUBJECT_CODE_NM=? ' + 
              ' WHERE BOARD_ID =? ';
 */
    var sql = ' UPDATE tmp.CLASS_MNG ' +
              ' SET CURRICULUM=?, CONTENTS=?, UPDATE_DATE=NOW(), UPDATE_ID=?, MONTH_WEEK_CODE_NM=?, GRADE_CODE_NM=?, SUBJECT_CODE_NM=? ' + 
              ' WHERE BOARD_ID =? ;';

    connection.query(
        sql, 
        [curriculum, contents, updateId, monthWeekCodeNm, gradeCodeNm, subjectCodeNm, boardId],
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};


/**
 * 선정한 진도토픽 업데이트
 */
classMng.prototype.updatePickClassTp = function(query, callback) {
    var sql = ' UPDATE tmp.CLASS_MNG ' +
              ' SET PICK_CLASS_BOARD = ? ' +
              ' WHERE BOARD_ID = ?';

    connection.query(
        sql, 
        [query.body[1], query.body[0]],
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

/**
 * 선정한 도서토픽 업데이트
 */
classMng.prototype.updatePickBookTp = function(query, callback) {
    var sql = ' UPDATE tmp.CLASS_MNG ' +
              ' SET PICK_BOOK_BOARD = ? ' +
              ' WHERE BOARD_ID = ?';

    connection.query(
        sql, 
        [query.body[1], query.body[0]],
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

/**
 * 진도과정관리 삭제
 */
classMng.prototype.deleteClassMng = function(query, callback){
    var boardId = query.boardId;

    var sql = ' DELETE FROM tmp.CLASS_MNG WHERE BOARD_ID =  ?  ;';
    connection.query(sql, 
        [boardId], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

module.exports = new classMng();