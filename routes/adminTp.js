var express = require('express');
var router = express.Router();
var adminTpDb = require('../model/adminTp');

/**  
  * 관리자 토픽 리스트
  * @route {POST} /adminTp/adminTpList
  */
router.all('/adminTpList', function(req, res) {
    adminTpDb.selectAdminTpList(function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 선정될 관리자 토픽 리스트
  * @route {POST} /adminTp/selectTpList
  */
  router.all('/selectTpList', function(req, res) {
    adminTpDb.selectedTpList(function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 선택한 관리자 토픽 리스트
  * @route {POST} /adminTp/adminTpListOne
  */
  router.all('/adminTpListOne', function(req, res) {
    adminTpDb.selectAdminTpListOne(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 관리자 토픽 등록
  * @route {POST} /adminTp/adminTpAdd
  */
router.all('/adminTpAdd', function(req, res) {
    adminTpDb.insertAdminTp(req, function(err, rows){
        res.send(rows);
    });
});

/**  
  * 관리자 토픽 수정
  * @route {POST} /adminTp/adminTpUpdate
  */
router.all('/adminTpUpdate', function(req, res){
    adminTpDb.updateAdminTp(req, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 관리자 토픽 삭제
  * @route {POST} /adminTp/adminTpDelete
  */
  router.all('/adminTpDelete', function(req, res){
    adminTpDb.deleteAdminTp(req.body, function (err, rows) {
        res.send(rows);
    });
});

module.exports = router;