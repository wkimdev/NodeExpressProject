var express = require('express');
var router = express.Router();
var bookMngDb = require('../model/bookMng');
var fileMngDb = require('../model/fileMng');
var expPntDb = require('../model/expPnt');
var Upload = require('../util/fileUpload');
var formidable = require('formidable');
var AWS =  require('aws-sdk');
var async = require('async');
var HashMap = require('hashmap');
var dateUtil = require('date-utils');
const ROOT_PATH = process.cwd();

/**
 * 도서정보를 호출합니다.
 * @name 도서정보 호출
 * @constructor
 * @route {POST} /book/list/:bookId
 * @routeparam {Int} :bookId 도서정보 아이디
 */
router.all('/bookMngList', function(req, res) {
    bookMngDb.selectbookList(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 사용자단에서 선정할 이달의
 * @name 도서정보 호출 (도서게시글 id한개에 대한)
 * @constructor
 * @route {POST} /book/list/:bookId
 * @routeparam {Int} :bookId 도서정보 아이디
 */
router.all('/bookMngListOne', function(req, res) {
    bookMngDb.selectBookListOne(req, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 사용자단 최초 호출시 화면
 * @route {GET} 
 */
router.all('/bookMngListFirst', function(req, res) {
    bookMngDb.selectbookListFirst( function (err, rows) {
        res.send(rows);
    });
});

/**
 * 도서정보 ID 호출
 * @name 도서정보 ID 호출
 * @constructor
 * @route {GET} /book/list/:bookId
 * @routeparam {Int} :bookId 도서정보 아이디
 */
router.all('/bookMngSelect', function(req, res) {
    bookMngDb.selectedBookBoardId(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 도서정보 검색
 * @name 도서정보 검색
 * @constructor
 * @route {GET} /book/list/:bookname
 * @routeparam {Int} :bookname 도서정보 검색
 */
router.all('/bookSearchByBookNm', function(req, res) {
    bookMngDb.bookSearchByBookNm(req.body, function (err, rows) {
        res.send(rows);
    });
});



/**
 * 도서정보 별점 평균 
 * @name 도서정보 ID 호출
 * @route {GET} /book/list/:bookId
 * @routeparam {Int} :bookId 별점 평균 
 */
router.all('/bookMngRateAvg', function(req, res) {
    bookMngDb.selectedBookRateAvg(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 사용자단 최신 도서 정보 노출
 * @route {GET} 
 * @routeparam {Int} :month 월
 */
router.all('/bookLatestList', function(req, res) {
    bookMngDb.selectBookLatest(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 사용자단 카테고리별 도서 정보 노출
 * @route {GET} 
 * @routeparam {Int} :categoryId 카테고리아이디
 */
router.all('/bookListCategory', function(req, res) {
    bookMngDb.selectBookCategory(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 첨부파일 ID 호출
 * @name 첨부파일 ID 호출
 * @constructor
 * @route {GET}
 * @routeparam {Int} FileId 첨부파일 아이디
 */
router.all('/bookMngBoardFileId', function(req, res, next) {
    bookMngDb.selectbookBoardFileId(function (err, rows) {
        res.send(rows);
    });
});

/**
* 도서정보를 등록합니다.
* @name 도서정보 등록
* @constructor
* @route {POST} /book/add
* @queryparam {String} [categoryId] 카테고리 아이디
* @queryparam {String} [bookName] 도서명
* @queryparam {String} [writer] 작성자
* @queryparam {String} [publisher] 작가
* @queryparam {String} [price] 가격
* @queryparam {String} [contents] 글내용
* @queryparam {String} [bookType] 책 구분값. (`H - 호러`, `D - 연애`, `M - 인문학`)<br />2017.02.12 dj.ko added ('S - 과학')
*/
router.all('/bookMngAdd', function (req, res) {
	bookMngDb.insertbookMng(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 도서정보 수정
  * @route {POST} /bookMng/bookMngUpdate
  */
router.all('/bookMngUpdate', function(req, res){
    bookMngDb.updatebookMng(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 도서정보 삭제
  * @route {POST} /bookMng/bookMngDelete
  */
router.all('/bookMngDelete', function(req, res, next) {
    bookMngDb.deletebookMng(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 도서 유저 레이팅 update
 * @route {POST} /bookMng/bookRatingSave
 * @param int rate 유저가 평가한 별점
 * @param int memberNo 평가한 유저
 * @param int bookBoardId 평가 된 도서 ID
 */
router.post('/bookRatingSave', function (req, res, next) {
    bookMngDb.bookRatingSave(req.body, function( err, rows) {
        res.send(rows);
    });
});

/**
 * 도서 유저 레이팅 참여 여부
 * @route {POST} /bookMng/bookMngRatingByMe
 * @param int memberNo ( cookie )
 * @param int bookBoardId
 */
router.post('/bookMngRatingByMe', function (req, res) {
    bookMngDb.bookMngRatingByMe(req, function (err, rows) {
        res.send(rows);
    });
});

module.exports = router;