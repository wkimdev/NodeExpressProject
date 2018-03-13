var express = require('express');
var router = express.Router();
var dbTest = require('../model/test');

router.get('/', function(req, res, next) {
    dbTest.selectJsonTest(function (err, rows) {
        res.send(rows);
    });
});

router.get('/test', function(req, res, next) {
    res.send('test.html');
});


router.get('/insertTest', function(req, res, next) {
    dbTest.insertJsonTest(req.query, function(err, rows){
        res.send(rows);
    });
});

router.get('/updateTest', function(req, res, next){
    dbTest.updateJsonTest(req.query, function (err, rows) {
        res.send(rows);
    })
})

/**
 * Upload a file.
 * @
 * @route {POST} /v1/file
 * @name Test
 */
router.post('/test', function(req, res, next){
    console.log(test);
});

router.post('/test/upload', function(req, res){
    console.log('req : '+req);
});

module.exports = router;