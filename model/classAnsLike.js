var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function classAnsLike() {
}

/**
 * 도서 답변 좋아요 히스토리 등록
 */
classAnsLike.prototype.insertclassAnsLike = function(query, callback) {
    var answerBoardId = query.answerBoardId;
    var addId = query.addId;
    var likeYn = query.likeYn;

    // var sql = ' INSERT INTO tmp.CLASS_LIKE_MNG ( ANSWER_BOARD_ID, ADD_ID, LIKE_YN ) ' +
		// 		' VALUES ( ( SELECT ANSWER_BOARD_ID FROM CLASS_ANS_MNG WHERE ANSWER_BOARD_ID = ? ),' +
		// 		' ?, ?) ';

	if ( query.like == 'true' ) {
        var sql = ' INSERT INTO tmp.CLASS_LIKE_MNG ( ANSWER_BOARD_ID, ADD_ID ) ' +
            ' VALUES (?, ?)';
	} else {
		var sql = ' DELETE FROM tmp.CLASS_LIKE_MNG WHERE ANSWER_BOARD_ID = ? AND ADD_ID = ?';
	}

	connection.query (
		sql,
		[parseInt(answerBoardId), parseInt(addId)],
		function(err, rows) {
			if(err) console.log(err);
			else    console.log(rows);

			var sql2 = ' SELECT COUNT(*) as likeCnt FROM CLASS_LIKE_MNG WHERE ANSWER_BOARD_ID = ? ';
            connection.query(
                sql2,
                [query.answerBoardId],
                function (err, rows) {
                    if ( err ) 	console.log(err);
                    else		console.log(rows);
                    callback(err, camelcaseKeys(rows));
                }
            ); // END Query Block
		}
	); // END Query Block
};

module.exports = new classAnsLike();