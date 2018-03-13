var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function classMng() {
}

/**
 * 진도 좋아요 등록
 */
classMng.prototype.insertClassLike = function(query, callback) {
    var sql = ' INSERT INTO CLASS_LIKE_MNG (ADD_ID, ANSWER_BOARD_ID)  VALUES ( ?, ? ) ; ' ;

    connection.query(
        sql, 
        [query.cookies.ID, query.body.answerBoardId], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

/**
 * 도서 좋아요 등록
 */
classMng.prototype.insertbookLike = function(query, callback) {
    var sql = ' INSERT INTO BOOK_LIKE_MNG (ADD_ID, ANSWER_BOARD_ID)  VALUES ( ?, ? ) ; ' ;

    connection.query(
        sql, 
        [query.cookies.ID, query.body.answerBoardId], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};


module.exports = new classMng();