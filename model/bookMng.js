var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function bookMng() {
}

/**
* 도서 list를 출력(노출 최대 5명/전부).
*/
bookMng.prototype.selectbookList = function(query, callback) {
	var _temp_where = '';
	var valueId = ''
	
	if(!(query.pageValue)){
		_temp_where = ' ORDER BY BIM.ADD_DATE DESC; ';
	} else {
		_temp_where = ' WHERE BIM.BOOK_BOARD_ID = ? ORDER BY BIM.ADD_DATE DESC; ';
		valueId = query.bookBoardId;
	}

	var sql = ' SELECT BIM.BOOK_BOARD_ID, BIM.CATEGORY_NM, BIM.CATEGORY_ID, BIM.FILE_TEXT_NAME, BIM.BOOKNAME, BIM.WRITER, BIM.PUBLISHER, BIM.PRICE, IFNULL(BQM.QUEST_CNT, 0) AS QUEST_CNT , ' + 
			  ' BIM.ADD_DATE FROM BOOK_INFO_MNG BIM ' +
			  ' LEFT OUTER JOIN (SELECT COUNT(*) AS QUEST_CNT, BOOK_BOARD_ID FROM BOOK_QUEST_MNG GROUP BY BOOK_BOARD_ID ) BQM ' +
			  ' ON BIM.BOOK_BOARD_ID = BQM.BOOK_BOARD_ID ' + _temp_where; 

	connection.query(
		sql,
		[valueId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
* 사용자단 최신 도서 정보 노출
 * Month 파라미터 - 자꾸 String 으로 긁어져서 int 형으로 변경함. - 이지훈
*/
bookMng.prototype.selectBookLatest = function(query, callback) {
   var month = query.month;	//01 ~ 12
   var sql = ' SELECT * FROM BOOK_INFO_MNG WHERE SUBSTRING(ADD_DATE, 6, 2) = ? ORDER BY ADD_DATE DESC LIMIT 10; ';

	connection.query(
		sql,
		[parseInt(month)],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
* 사용자단 최초 호출시 화면
*/
bookMng.prototype.selectbookListFirst = function(callback) {
	var sql = ' SELECT * FROM BOOK_INFO_MNG WHERE CATEGORY_ID = (SELECT CATEGORY_ID FROM CATEGORY_MNG ORDER BY CATEGORY_ID ASC LIMIT 1) ' +
				' ORDER BY ADD_DATE DESC LIMIT 6; '; 

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
* 사용자단 카테고리별 도서 정보 노출
*/
bookMng.prototype.selectBookCategory = function(query, callback) {
   var sql = ' SELECT * FROM BOOK_INFO_MNG WHERE CATEGORY_ID = ? ORDER BY ADD_DATE DESC LIMIT 6 ; ';

	connection.query (
		sql,
		[query.categoryId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 *
 */
bookMng.prototype.selectBookListOne = function (query, callback) {
	var sql = " SELECT * FROM BOOK_INFO_MNG WHERE BOOK_BOARD_ID = ?";

    connection.query (
        sql,
        [query.body.bookBoardId],
        function(err, rows){
            if(err) console.log(err);
            else    console.log(rows);
            callback(err, camelcaseKeys(rows));
        }
    );
};

/**
* 도서정보 ID에 대한 리스트 노출
*/
bookMng.prototype.selectedBookBoardId = function(query, callback) {
    var sql = ' SELECT BIM.BOOK_BOARD_ID, BIM.CATEGORY_NM, BIM.CATEGORY_ID, BIM.CONTENTS, BIM.FILE_TEXT_NAME, BIM.BOOKNAME, BIM.WRITER, BIM.PUBLISHER, BIM.PRICE, BIM.READ_LEVEL, BIM.FUN_LEVEL, BIM.UNIVERS_LEVEL, BIM.MOVE_LEVEL, BIM.EDIT_LEVEL, IFNULL(BQM.QUEST_CNT, 0) AS QUEST_CNT , ' +
		      ' BIM.ADD_DATE FROM BOOK_INFO_MNG BIM ' +
		      ' LEFT OUTER JOIN (SELECT COUNT(*) AS QUEST_CNT, BOOK_BOARD_ID FROM BOOK_QUEST_MNG GROUP BY BOOK_BOARD_ID ) BQM ' +
			  ' ON BIM.BOOK_BOARD_ID = BQM.BOOK_BOARD_ID WHERE BIM.BOOK_BOARD_ID = ? ;';

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
* 도서정보 검색 BY BOOMNAME
*/
bookMng.prototype.bookSearchByBookNm = function(query, callback) {
	var text = query.bookname;
    text.replace("\"", "");

	var sql = " SELECT BOOK_BOARD_ID, CATEGORY_NM, BOOKNAME, WRITER, PUBLISHER FROM BOOK_INFO_MNG WHERE BOOKNAME LIKE '%" + text + "%' ";    

	connection.query(
		sql,
		[text],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
* 도서정보 ID에 대한 별점 평균
*/
bookMng.prototype.selectedBookRateAvg = function(query, callback) {
    var sql = ' SELECT SUM(RATE) AS SUM_RATE  , COUNT(RATE) AS CNT_RATE , ROUND((SUM(RATE))/(COUNT(RATE)), 0) AS AVG_RATE ' +
			  ' FROM BOOK_RATE WHERE BOOK_BOARD_ID = ? ';

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
 * 도서정보 등록 & 전문가 평점 등록
 */
bookMng.prototype.insertbookMng = function(query, callback) {
	//categoryNm을 id값을 받아서 subquery형식으로 넣는 걸로 진행
	var sql = ' INSERT INTO tmp.BOOK_INFO_MNG ( CATEGORY_ID, CATEGORY_NM, FILE_TEXT_NAME, BOOKNAME, WRITER, PUBLISHER ' +
			   ', PRICE, CONTENTS, ADD_ID, READ_LEVEL, FUN_LEVEL, UNIVERS_LEVEL, MOVE_LEVEL, EDIT_LEVEL ) ' + 
			  ' VALUES (?, ( SELECT CATEGORY_NM FROM CATEGORY_MNG WHERE CATEGORY_ID = ? ) , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); '; 

	connection.query(
		sql,
		[query.body.categoryId, query.body.categoryId, query.body.Location, query.body.bookname, 
			query.body.writer, query.body.publisher, query.body.price, query.body.contents, query.cookies.ID,
			query.body.readLevel, query.body.funLevel, query.body.universLevel, query.body.moveLevel, query.body.editLevel],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);


};

/**
 * 도서정보 수정
 */
bookMng.prototype.updatebookMng = function(query, callback) {
    var sql = ' UPDATE tmp.BOOK_INFO_MNG ' +
				' SET UPDATE_ID = ?, CATEGORY_NM=?, BOOKNAME=?, WRITER=?, PUBLISHER=?, PRICE=?, FILE_TEXT_NAME = ?, CONTENTS = ?  ' + 
				' WHERE BOOK_BOARD_ID= ? ';

	connection.query(
		sql,
		[query.cookies.ID, query.body.categoryNm, query.body.bookname, query.body.writer
			, query.body.publisher, query.body.price, query.body.Location, query.body.contents, query.body.bookBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * 도서정보 삭제
 */
bookMng.prototype.deletebookMng = function(query, callback){
	var bookBoardId = query.bookBoardId;

	var sql = ' DELETE FROM tmp.BOOK_INFO_MNG WHERE BOOK_BOARD_ID = ? ';

	connection.query(
		sql,
		[bookBoardId],
		function(err, rows){
			if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	);
};

/**
 * @comment 2018-02-14 16:43 create by DELTA-WORKS
 * @param int rate 유저가 평가한 별점
 * @param int memberNo 평가한 유저
 * @param int bookBoardId 평가 된 도서 ID
 */
bookMng.prototype.bookRatingSave = function(query, callback) {

	// 평가한 유저 primary key
	var memberNo = query.memberNo;

	// 평가한 유저 email(Id)
	var email = query.email;

	// 평가점수 0~5
	var rate = query.rate;

	// 평가 된 도서 primary key
	var bookBoardId = query.bookBoardId;

	// 이곳에 쿼리를 작성 해 주시면 됩니다. 각 parameter 는 윗쪽 주석 참고 해주세요.
	var sql = ' INSERT INTO tmp.BOOK_RATE ( MEMBER_NO, RATE, BOOK_BOARD_ID, EMAIL) ' +
			   ' VALUES ( ?, ?, ?, ? ) ';

	connection.query(
		sql,
		[memberNo, rate, bookBoardId, email], // 각 넘어 온 파라미터 입니다.
		function(err, rows) {
			if ( err ) 	console.log(err);
			else 		console.log(rows);
			callback(err, camelcaseKeys(rows));
		}
	)
};


/**
 * 도서 유저 레이팅 참여 여부
 * @route {POST} /bookMng/bookMngRatingByMe
 * @param int memberNo ( cookie )
 * @param int bookBoardId
 */
bookMng.prototype.bookMngRatingByMe = function (query, callback) {
	var memberNo = parseInt(query.cookies.memberNo);
	var bookBoardId = parseInt(query.body.bookBoardId);
	var sql = ' SELECT COUNT(*) AS bookRatingMe FROM BOOK_RATE WHERE MEMBER_NO = ? AND BOOK_BOARD_ID = ?';

	connection.query(
		sql,
		[memberNo, bookBoardId],
		function (err, rows) {
			if ( err )	console.log(err);
			else		console.log(rows);
			callback(err, camelcaseKeys(rows));
        }
	)
};

module.exports = new bookMng();