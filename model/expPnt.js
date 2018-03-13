var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function expPnt() {
}

/**
 * 전문가평점 리스트
 */
expPnt.prototype.selectExpPnt = function(callback) {
    var sql = ' SELECT BOOK_BOARD_ID, EXPERT_PNT FROM BOOK_EXP_PNT ';

        connection.query(
            sql, 
            function(err, rows) {
                if(err) console.log(err);
                else    console.log(rows);
                callback(err, camelcaseKeys(rows));			
        }
    );
}

/**
 * 전문가평점 등록
 */
expPnt.prototype.insertExpPnt = function(query, callback) {
    var bookBoardId = 1;

	var sql = ' INSERT INTO BOOK_EXP_PNT (BOOK_BOARD_ID, ADD_ID, READ_LEVEL, FUN_LEVEL, UNIVERS_LEVEL, MOVE_LEVEL, EDIT_LEVEL) ' +
				' VALUES (?, ?, ?, ?, ?, ?, ?); ';

	connection.query(
		sql,
		[bookBoardId, query.cookies.ID, query.body.readLevel, query.body.funLevel, 
			query.body.universLevel, query.body.moveLevel, query.body.editLevel],
		function(err, rows){
		//			if(err) console.log(err);
		//			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	); 
}

/**
 * 전문가평점 수정
 */
expPnt.prototype.updateExpPnt = function(query, callback) {
    var expertPnt = query.params.expertPnt;
    var updateId = query.params.updateId;
    var updateDate = query.params.updateDate;
    var bookBoardId = query.params.bookBoardId;

    var sql = ' UPDATE tmp.BOOK_EXP_PNT ' +
              ' SET EXPERT_PNT = ?, UPDATE_ID = ?, UPDATE_DATE = ? ' +
              ' WHERE BOOK_BOARD_ID = ? ';
    connection.query(
        sql, 
        [expertPnt, updateId, updateDate, bookBoardId], 
        function(err, rows) {
            if(err) console.log(err);
            else    console.log(rows);
            callback(err, camelcaseKeys(rows));			
        }
    );
}

module.exports = new expPnt();