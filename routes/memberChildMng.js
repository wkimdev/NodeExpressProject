var express = require('express');
var router = express.Router();
var memberChildMngDb = require('../model/memberChildMng');

/**  
  * 회원자녀 리스트
  * @route {POST} /memberChildMng/memberChildList
  */
router.all('/memberChildList', function(req, res) {
    memberChildMngDb.selectMemberChild(req, function (err, rows) {
        res.send(rows);
    });
});

/**
 * 특정회원자녀 리스트
 * @route {GET} /memberChildMng/memberChild/:memberNo
 */
router.get('/memberChild/:memberChildId', function(req, res) {      
    memberChildMngDb.selectOnMemberChild(req.params, function( err, rows ) {             
        res.send(rows);        
    });    
});

/**  
  * 회원자녀 등록
  * @route {POST} /memberChildMng/memberChildAdd
  */
router.all('/memberChildAdd', function(req, res) {
    console.log(req.params);
    memberChildMngDb.insertMemberChild(req, function(err, rows){        
        res.send(rows);
    });
});

/**  
  * 회원자녀 수정
  * @route {POST} /memberChildMng/memberChildUpdate
  */
router.all('/memberChildUpdate', function(req, res){
    memberChildMngDb.updateMemberChild(req, function (err, rows) {
        res.send(rows);
    })
})

/**  
  * 회원관리 삭제
  * @route {POST} /memberChildMng/memberChildDelete
  */
  router.all('/memberChildDelete', function(req, res){
    memberChildMngDb.deleteMemberChild(req.body, function (err, rows) {
        res.send(rows);
    })
});

/**
 * 랜덤 자녀 디테일
 * @route {GET} /memberChildMng/memberRandomChild
 * @param int memberNo 회원 primary key
 * @param String email 회원 이메일
 */
router.get('/memberRandomChild', function(req, res) {
    memberChildMngDb.memberRandomChild(req.query, function (err, rows) {
        res.send(rows);
    });
});

router.get('/childAllCnt', function (req, res) {
    memberChildMngDb.childAllCnt(req, function (err, rows) {
        res.send(rows);
    });
})

module.exports = router;