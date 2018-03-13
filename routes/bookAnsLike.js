var express = require('express');
var router = express.Router();
var bookAnsLikeDb = require('../model/bookAnsLike');

/**  
  * 도서 답변 좋아요 히스토리 등록
  * @route {POST} /bookAnsLike/bookAnsLikeAdd
  */
router.all('/bookAnsLikeAdd', function(req, res) {
    bookAnsLikeDb.insertBookAnsLike(req, function(err, rows){
        res.send(rows);
    });
});


module.exports = router;