var express = require('express');
var router = express.Router();
var classAnsLikeDb = require('../model/classAnsLike');

/**  
  * 진도 답변 좋아요 히스토리 등록
  * @route {POST} /classAnsLike/classAnsLikeAdd
  */
router.all('/classAnsLikeAdd', function(req, res) {
    classAnsLikeDb.insertclassAnsLike(req.body, function(err, rows){
        res.send(rows);
    });
});

module.exports = router;