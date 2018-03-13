var express = require('express');
var router = express.Router();
var classAnsDb = require('../model/classAns');

/**  
  * qeustBoardId에 대한 진도 답변 리스트
  * @route {POST} /classAns/classAnsList
  */
router.all('/classAnsList', function(req, res) {
    classAnsDb.selectClassAnsList(req.body, function (err, rows) {
        res.send(rows);
    });
}); 

/**  
  * addId 에 대한 진도 답변 리스트
  * @route {POST} /classAns/classAnsListId
  */
  router.all('/classAnsListId', function(req, res) {
    classAnsDb.classAnsBoardIdList(req, function (err, rows) {
        res.send(rows);
    });
}); 


/**  
  * 진도 답변 등록
  * @route {POST} /classAns/classAnsAdd
  */
router.all('/classAnsAdd', function(req, res) {
    classAnsDb.insertClassAns(req.body, function(err, rows){
        res.send(rows);
    });
});

/**  
  * 진도 답변 수정
  * @route {POST} /classAns/classAnsUpdate
  */
router.all('/classAnsUpdate', function(req, res){
    classAnsDb.updateClassAns(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도 답변 삭제
  * @route {POST} /classAns/classAnsDelete
  */
  router.all('/classAnsDelete', function(req, res){
    classAnsDb.deleteClassAns(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * ADD ID 에 대한 class + book List
 * @route {POST} /classAns/ansClassWithBook
 */
router.all('/ansClassWithBook', function (req, res) {
      classAnsDb.ansListWithBook(req, function (err, rows) {
          res.send(rows);
      });
  })

/**
 * ADD_ID 에 대한 CLASS + BOOK LIST COUNT
 * @route {POST}
 */
router.all('/ansListCntWithBook', function (req, res) {
    classAnsDb.ansListCntWithBook(req, function (err, rows) {
        res.send(rows);
    });
});

module.exports = router;