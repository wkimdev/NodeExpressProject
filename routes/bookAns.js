var express = require('express');
var router = express.Router();
var bookAnsDb = require('../model/bookAns');

/**  
  * 도서 답변 리스트
  * @route {POST} /bookAns/bookAnsList
  */
router.all('/bookAnsList', function(req, res) {
    bookAnsDb.selectBookAns(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 수정할 도서 답변 리스트
  * @route {POST} /bookAns/bookAnsListOne
  */
  router.all('/bookAnsListOne', function(req, res) {
    bookAnsDb.selectBookAnsOne(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * addId 에 대한 도서 답변 리스트
  * @route {POST} /bookAns/bookAnsListByAddId
  */
  router.all('/bookAnsListByAddId', function(req, res) {
    bookAnsDb.bookAnsBoardIdList(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 도서 답변 등록
  * @route {POST} /bookAns/bookAnsAdd
  */
router.all('/bookAnsAdd', function(req, res) {
    bookAnsDb.insertBookAns(req, function(err, rows){
        res.send(rows);
    });
});

/**  
  * 도서 답변 수정
  * @route {POST} /bookAns/bookAnsUpdate
  */
router.all('/bookAnsUpdate', function(req, res){
    bookAnsDb.updateBookAns(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 도서 답변 삭제
  * @route {POST} /bookAns/bookAnsDelete
  */
  router.all('/bookAnsDelete', function(req, res, next){
    bookAnsDb.deleteBookAns(req.body, function (err, rows) {
        res.send(rows);
    });
});

module.exports = router;