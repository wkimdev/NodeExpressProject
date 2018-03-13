var express = require('express');
var router = express.Router();
var categoryMngDb = require('../model/categoryMng');

/**
* 카테고리관리 리스트 출력.
* @route {POST} /categoryMng/categoryList
*/
router.all('/categoryList', function(req, res) {
    categoryMngDb.selectCategoryList(function (err, rows) {
        res.send(rows);
    });
});

/**
* 카테고리 등록.
* @route {POST} /categoryMng/categoryAdd
*/
router.all('/categoryAdd', function(req, res) {
	categoryMngDb.insertCategory(req, function(err, rows){
		res.send(rows);
	});
});

/**
* 카테고리 수정.
* @route {POST} /categoryMng/categoryUpdate
*/
router.all('/categoryUpdate', function(req, res){
    categoryMngDb.updateCategory(req.body, function (err, rows) {
        res.send(rows);
    });
});

/**
* 카테고리 삭제
* @route {POST} /categoryMng/categoryDelete
*/
router.all('/categoryDelete', function(req, res){
	categoryMngDb.deleteCategory(req.body, function (err, rows) {
		res.send(rows);
	});
});

module.exports = router;