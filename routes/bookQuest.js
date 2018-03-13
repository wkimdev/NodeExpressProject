var express = require('express');
var router = express.Router();
var bookQuestDb = require('../model/bookQuest');

/**  
  * 도서 질문관리 리스트 출력
  * @route {POST} /bookQuest/bookQuestList
  */
router.all('/bookQuestList', function(req, res) {
    bookQuestDb.selectBookQuest(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 수정할 도서 질문관리 리스트 출력
  * @route {POST} /bookQuest/bookQuestList
  */
  router.all('/bookQuestListOne', function(req, res) {
    bookQuestDb.selectBookQuestOne(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * addId 에 대한 도서 질문 리스트
  * @route {POST} /bookQuest/bookQuestListId
  */
  router.all('/bookQuestListId', function(req, res) {
    bookQuestDb.bookQuestBoardId(req, function (err, rows) {
        res.send(rows);
    });
});

/**
 * bookBoardId 에 대한 도서 질문
 * @route {POST} /bookQuest/bookQuestListByBookBoardId
 */
router.all('/bookQuestListByBookBoardId', function (req, res) {
    bookQuestDb.bookQuestListByBookBoardId(req, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 선택한 도서 게시글 선정 여부
  * @route {GET} /bookQuest/bookQuestTp
  */
  router.all('/bookQuestTp', function(req, res) {
    bookQuestDb.selectBookQuestTp(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 도서 게시글 선정 여부 카운트
  * @route {GET} /bookQuest/bookQuesTpCnt
  */
  router.all('/bookQuesTpCnt', function(req, res) {
    bookQuestDb.selectBookQuesTpCnt(function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 선정된 도서 질문 게시글 정보
  * @route {GET} /bookQuest/selectedBookQuest
  */
  router.all('/selectedBookQuest', function(req, res) {
    bookQuestDb.selectBookQuestTpList(function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 도서 질문 등록
  * @route {POST} /bookQuest/bookQuestAdd
  * @function router /bookQuest/bookQuestAdd 질문 등록
  */
router.all('/bookQuestAdd', function(req, res) {
    bookQuestDb.insertBookQuest(req, function(err, rows){
        res.send(rows);
    });
});

/**  
  * 도서 질문 수정
  * @route {POST} /bookQuest/bookQuestUpdate
  */
router.all('/bookQuestUpdate', function(req, res) {
    bookQuestDb.updateBookQuest(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 도서 질문 토픽 선정
  * @route {POST} /bookQuest/bookQuestUpdateTp
*/
router.all('/bookQuestUpdateTp', function(req, res){
    bookQuestDb.updateBookQuestTp(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도 질문 토픽 해제
  * @route {POST} /bookQuest/bookQuestTpDelete
*/
router.all('/bookQuestTpDelete', function(req, res){
    bookQuestDb.bookQuestTpDelete(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 도서 질문 삭제
  * @route {POST} /bookQuest/bookQuestDelete
  */
  router.all('/bookQuestDelete', function(req, res){
    bookQuestDb.deleteBookQuest(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * ADD_ID 에 대한 전체 질문 갯수
 * @route {POST} /bookQuest/bookQuestAddIdCnt
 * @param String ID (cookie)
 * @return object {questCnt: Integer}
 */
router.all('/bookQuestAddIdCnt', function (req, res) {
      bookQuestDb.bookQuestAddIdCnt(req, function (err, rows) {
          res.send(rows);
      });
  })

module.exports = router;