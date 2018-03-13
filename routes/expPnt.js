var express = require('express');
var router = express.Router();
var expPntDb = require('../model/expPnt');

/**  
  * 전문가평점 리스트
  * @route {POST} /expPnt/expPntList
  */
router.all('/expPntList', function(req, res) {
    expPntDb.selectExpPnt(function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 전문가평점 등록
  * @route {POST} /expPnt/expPntAdd
  */
router.all('/expPntAdd', function(req, res) {
    expPntDb.insertExpPnt(req.body, function(err, rows){
        res.send(rows);
    });
});

/**  
  * 전문가평점 수정
  * @route {POST} /expPnt/expPntUpdate
  */
router.all('/expPntUpdate', function(req, res){
    expPntDb.updateExpPnt(req.body, function (err, rows) {
        res.send(rows);
    })
})

module.exports = router;