var express = require('express');
var router = express.Router();
var commCodeDb = require('../model/commCode');

/**  
  * 전문가평점 리스트
  * @route {POST} /commCode/codeList
  */
router.all('/codeList', function(req, res) {
    commCodeDb.selectCodeList(function (err, rows) {
        res.send(rows);
    });
});

module.exports = router;