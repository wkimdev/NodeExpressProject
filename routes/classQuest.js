var express = require('express');
var router = express.Router();
var classQuestDb = require('../model/classQuest');

/**  
  * boardId에 대한 진도 질문 리스트 출력
  * @route {POST} /classQuest/classQuestList
  */
router.all('/classQuestList', function(req, res) {
    classQuestDb.selectClassQuestList(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * questBoardId에 대한 진도 질문 리스트 출력
  * @route {POST} /classQuest/classQuestListOne
  */
  router.all('/classQuestListOne', function(req, res) {
    classQuestDb.selectClassQuestListOne(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * addId 에 대한 진도 질문 리스트
  * @route {POST} /classQuest/classQuestListId
  */
  router.all('/classQuestListId', function(req, res) {
    classQuestDb.classQuestBoardId(req, function (err, rows) {
        res.send(rows);
    });
});

/**
 * ADD_ID 에 대한 전체 질문 갯수
 * @route {POST} /classQuest/classQuestAddIdCnt
 * @param String ID (cookie)
 * @return object {questCnt: Integer}
 */
router.all('/classQuestAddIdCnt', function (req, res) {
      classQuestDb.classQuestAddIdCnt(req, function (err, rows) {
          res.send(rows);
      });
  })

/**  
  * 선택한 진도 게시글 선정 여부
  * @route {GET} /classQuest/classQuestTp
  */
  router.all('/classQuestTp', function(req, res) {
    classQuestDb.selectClassQuestTp(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도 게시글 선정 여부 카운트
  * @route {GET} /classQuest/classQuestTpCnt
  */
  router.all('/classQuestTpCnt', function(req, res) {
    classQuestDb.selectClassQuestTpCnt(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 선정된 진도 질문 게시글 정보
  * @route {GET} /classQuest/selectedClassQuest
  */
  router.all('/selectedClassQuest', function(req, res) {
    classQuestDb.selectClassQuestTpList(function (err, rows) {
        res.send(rows);
    });
});

/**
 * 선정된 진도 질문 게시글 정보 ( 단일 )
 * @route {GET} /classQuest/selectOneClassQuestTopic
 */
router.all('/selectOneClassQuestTopic', function (req, res) {
    classQuestDb.selectOneClassQuestTopic(req, function (err, rows) {
        res.send(rows);
    });
})

/**
 * 진도 질문 등록
  * @route {POST} /classQuest/classQuestAdd
  */
router.all('/classQuestAdd', function(req, res) {
    classQuestDb.insertClassQuest(req, function(err, rows){
        res.send(rows);
    });
});

/**  
  * 진도 질문 수정
  * @route {POST} /classQuest/classQuestUpdate
*/
router.all('/classQuestUpdate', function(req, res){
    classQuestDb.updateClassQuest(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도 질문 토픽 선정
  * @route {POST} /classQuest/classQuestUpdateTp
*/
router.all('/classQuestUpdateTp', function(req, res){
    classQuestDb.updateClassQuestTp(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도 질문 토픽 해제
  * @route {POST} /classQuest/classQuestTpDelete
*/
router.all('/classQuestTpDelete', function(req, res){
    classQuestDb.classQuestTpDelete(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도 질문 갯수 수정
  * @route {POST} /classQuest/classQuestCntUpdate
*/
router.all('/classQuestCntUpdate', function(req, res){
    classQuestDb.updateClassQuestCnt(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도 질문 삭제
  * @route {POST} /classQuest/classQuestDelete
  */
  router.all('/classQuestDelete', function(req, res){
    classQuestDb.deleteClassQuest(req.body, function (err, rows) {
        res.send(rows);
    });
});

module.exports = router;