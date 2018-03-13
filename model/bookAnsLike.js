var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function bookAnsLike() {
}

/**
 * 도서 답변 좋아요 히스토리 등록
 */
bookAnsLike.prototype.insertBookAnsLike = function(query, callback) {
    var answerBoardId = query.body.answerBoardId;
    var addId = query.cookies.ID;
    var likeYn = query.likeYn;

    // var sql = ' INSERT INTO tmp.BOOK_LIKE_MNG ( ANSWER_BOARD_ID, ADD_ID,ADD_DATE, LIKE_YN ) ' +
		// 		' VALUES ( ( SELECT ANSWER_BOARD_ID FROM BOOK_ANS_MNG WHERE ANSWER_BOARD_ID = ? ), ' +
		// 		' ?, ?, ? ) ';

    if ( query.body.like == 'true' ) {
        var sql = ' INSERT INTO tmp.BOOK_LIKE_MNG ( ANSWER_BOARD_ID, ADD_ID ) ' +
            ' VALUES (?, ?)';
    } else {
        var sql = ' DELETE FROM tmp.BOOK_LIKE_MNG WHERE ANSWER_BOARD_ID = ? AND ADD_ID = ?';
    }

	connection.query(
		sql,
		[answerBoardId, addId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);

            var sql2 = ' SELECT COUNT(*) as likeCnt FROM BOOK_LIKE_MNG WHERE ANSWER_BOARD_ID = ? ';
            connection.query(
                sql2,
                [query.body.answerBoardId],
                function (err, rows) {
                    if ( err ) 	console.log(err);
                    else		console.log(rows);
                    callback(err, camelcaseKeys(rows));
                }
            ); // END Query Block
		}
	);
};


module.exports = new bookAnsLike();