var express = require('express');
var router = express.Router();
var bookMngDb = require('../model/bookMng');
var fileMngDb = require('../model/fileMng');
var Upload = require('../util/fileUpload');
var formidable = require('formidable');
var AWS =  require('aws-sdk');
var async = require('async');
var HashMap = require('hashmap');
var dateUtil = require('date-utils');
const ROOT_PATH = process.cwd();

/**
 * 도서정보를 호출합니다.
 * @name 도서정보 호출
 * @constructor
 * @route {POST} /book/list/:bookId
 * @routeparam {Int} :bookId 도서정보 아이디
 */
router.all('/bookMngList', function(req, res, next) {
    bookMngDb.selectbookList(function (err, rows) {
        res.send(rows);
    });
});

/**
 * 도서정보 ID 호출
 * @name 도서정보 ID 호출
 * @constructor
 * @route {GET} /book/list/:bookId
 * @routeparam {Int} :bookId 도서정보 아이디
 */
router.all('/bookMngBoardId', function(req, res, next) {
    bookMngDb.selectbookBoardId(function (err, rows) {
        res.send(rows);
    });
});

/**
 * 첨부파일 ID 호출
 * @name 첨부파일 ID 호출
 * @constructor
 * @route {GET}
 * @routeparam {Int} FileId 첨부파일 아이디
 */
router.all('/bookMngBoardFileId', function(req, res, next) {
    bookMngDb.selectbookBoardFileId(function (err, rows) {
        res.send(rows);
    });
});

/**
 * 도서정보를 등록합니다.
 * @name 도서정보 등록
 * @constructor
 * @route {POST} /book/add
 * @queryparam {String} [categoryId] 카테고리 아이디
 * @queryparam {String} [bookName] 도서명
 * @queryparam {String} [writer] 작성자
 * @queryparam {String} [publisher] 작가
 * @queryparam {String} [price] 가격
 * @queryparam {String} [contents] 글내용
 * @queryparam {String} [bookType] 책 구분값. (`H - 호러`, `D - 연애`, `M - 인문학`)<br />2017.02.12 dj.ko added ('S - 과학')
 */
//Upload = require('../util/fileUpload'),
router.all('/bookMngAdd', function (req, res) {

    var map = new HashMap();

    var fileId = '';
    var bookBoardId = '';

    var tasks = [
        /* function (callback) {
            var form = new formidable.IncomingForm();
            var fields = '';
            form.parse(req, function(err, fields, files) {
                 console.log('fields 111111 : '+JSON.stringify(fields));
                 console.log('fields 222222 : '+JSON.stringify(files));
                //fields = fields.txt;
                //return fields;
                //callback(err, files);
                return callback;
            });    
            console.log("fields 44444 : "+callback);
        }, */
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
        
        fileMngDb.insertFileMngAdd(callback, function(err, rows){
        
                var newDate = new Date();
                var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
                //console.log('fields :'+fields); //form의 text값 일단 제외
                var _data = {'fileId': rows[0].fileId, 'addDate' : time};
                console.log(JSON.stringify(_data));
                bookMngDb.insertbookMng(_data, function(err, rows){
                    res.send(rows);
                });
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

/**  
  * 도서정보 수정
  * @route {POST} /bookMng/bookMngUpdate
  */
router.all('/bookMngUpdate', function(req, res, next){
    bookMngDb.updatebookMng(req.query, function (err, rows) {
        res.send(rows);
    });
});

/**  
  * 도서정보 삭제
  * @route {POST} /bookMng/bookMngDelete
  */
router.all('/bookMngDelete', function(req, res, next) {
    bookMngDb.deletebookMng(req.query, function (err, rows) {
        res.send(rows);
    });
});  


module.exports = router;