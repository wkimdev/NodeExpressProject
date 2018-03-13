var express = require('express');
var router = express.Router();
var classMngDb = require('../model/classMng');

/**  
  * 진도 list를 출력.
  * @route {POST} /classMng/classMngList
  */
router.all('/classMngList', function(req, res) {
    classMngDb.selectClassMngList(function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도 선택한 list.
  * @route {POST} /classMng/classSelectList
  */
router.all('/classSelectList', function(req, res) {
    classMngDb.selectClassBoardList(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 교과 과정명 검색 리스트
  * @route {POST} /classMng/classSearchByCurNm
  */
  router.all('/classSearchByCurNm', function(req, res) {
    classMngDb.classSearchByCurNm(req.body, function (err, rows) {                
        res.send(rows);
    });
});

/**  
  * 자녀 학년,월,주차 정보에 대한 진도리스트
  * @route {POST} /classMng/classMngList
  */
  router.all('/classMngListChild', function(req, res) {
    classMngDb.selectClassMngListChild(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 자녀 학년,월 정보에 대한 진도리스트
  * @route {POST} /classMng/classMngMonthList
  */
  router.all('/classMngMonthList', function(req, res) {
    classMngDb.selectClassMngMonth(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 주차별 진도 그룹 리스트
 * @route {POST} /classMng/classMngWeekGroup
 * @param Integer gradeCodeNb
 * @param Integer monthCodeNb
 */
router.all('/classMngWeekGroup', function (req, res) {
    classMngDb.classMngWeekGroup(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도과정관리 등록
  * @route {POST} /classMng/classMngAdd
  */
router.all('/classMngAdd', function(req, res) {
    classMngDb.insertClassMng(req, function(err, rows){
        res.send(rows);
    });
});

/**  
  * 진도과정관리 수정
  * @route {POST} /classMng/classMngUpdate
  */
router.all('/classMngUpdate', function(req, res){
    classMngDb.updateClassMng(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 선정한 진도토픽 업데이트
  * @route {POST} /classMng/updatePickClassTp
  */
  router.all('/updatePickClassTp', function(req, res){
    classMngDb.updatePickClassTp(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 선정한 도서토픽 업데이트
  * @route {POST} /classMng/updatePickBookTp
  */
  router.all('/updatePickBookTp', function(req, res){
    classMngDb.updatePickBookTp(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 진도과정관리 삭제
  * @route {POST} /classMng/classMngDelete
  */
  router.all('/classMngDelete', function(req, res){
    classMngDb.deleteClassMng(req.body, function (err, rows) {
        
        res.send(rows);
    });
});

module.exports = router;