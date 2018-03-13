var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var AWS =  require('aws-sdk');
var Upload =  {};
var async = require('async');
var fileMngDb = require('../model/fileMng');
var bookMngDb = require('../model/bookMng');
AWS.config.region = 'ap-northeast-2'; //지역 서울 설정
var S3 = new AWS.S3();
var form = new formidable.IncomingForm({
    encoding: 'utf-8',
    multiples: true,
    keepExtensions: false //확장자 제거
});

/**  
  * 첨부파일 리스트
  * @route {POST} /fileMngList
  */
router.get('/fileMngList', function(req, res) {
    fileMngDb.selectFileMngList(function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 첨부파일 DB에 저장 
  * @route {POST} /fileMngAdd
  */
router.post('/fileMngAdd', function(req, res) {
    fileMngDb.insertFileMngAdd(req.body, function(err, rows){
        res.send(rows);
    });
});

/**  
  * 첨부파일 저장(S3, MySql DB)
  * @route {POST} /fileMngAdd
  */
Upload = require('../util/fileUpload'),
router.post('/upload', function (req, res) {
    var tasks = [
        function (callback) {
            //formidable 모듈을 이용해 Node 서버로 파일을 업로드
            Upload.formidable(req, function (err, files, field) {
                callback(err, files);
            })
        },
        function (files, callback, cbTxt) {
            Upload.s3(files, function (err, result) {
                callback(err, files);
            });
        },
        function (callback) {
            //Uloade한 파일에 대한 정보를 db에 넣기
            fileMngDb.insertFileMngAdd(callback, function(err, rows){
                res.send(rows);
            });
        }
    ];
    async.waterfall(tasks, function (err, result) {
        if(!err){
            res.json({success:true, msg:'업로드 성공'})
        }else{
            res.json({success:false, msg:'실패', err:err})
        }
    });

});

module.exports = router;
