var express = require('express');
var router = express.Router();
var likeHstMngDb = require('../model/likeHstMng');



/**  
  * 진도 좋아요 등록
  * @route {POST} /likeHstMng/classlikeAdd
  */
router.all('/classlikeAdd', function(req, res) {
    likeHstMngDb.insertClassLike(req, function(err, rows){
        res.send(rows);
    });
});

/**  
  * 도서 좋아요 등록
  * @route {POST} /likeHstMng/booklikeAdd
  */
  router.all('/booklikeAdd', function(req, res) {
    likeHstMngDb.insertbookLike(req, function(err, rows){
        res.send(rows);
    });
});

module.exports = router;