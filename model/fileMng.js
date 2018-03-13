var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function fileMng() {
}

/**
 * 첨부파일 리스트
 */
fileMng.prototype.selectFileMngList = function(callback) {
    var sql = ' SELECT FILE_ID, BOOK_BOARD_ID, ORIGIN_FILE_NAME, SAVED_FILE_NM, ADD_DATE, ADD_ID, FILE_PATH, FILE_SIZE, FILE_TYPE FROM COMM_FILE_MNG ';

    connection.query(
        sql, 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
}

/**
 * 첨부파일 DB에 저장 
 */
fileMng.prototype.insertFileMngAdd = function(query, callback) {
    console.log(" ===========================================");
    console.log(" fileMng model의 insertFileMngAdd");
    console.log(JSON.stringify(query));

    var orgFileName = query[0].name;
    var orgFileExtension = orgFileName.lastIndexOf(".");
    var delFlag = '0';
    var addId = 'testAdmin';
    var addDate = query[0].mtime;
    var fileSize = query[0].size;  
    var filePath = query[0].path;
    var fileType = query[0].type;
    
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        
        return text;
    }
    
    var savedFileName = makeid() + orgFileExtension;
 
    var sql = ' INSERT INTO tmp.COMM_FILE_MNG ( ORIGIN_FILE_NAME, SAVED_FILE_NM, DEL_FLAG, ADD_DATE, ADD_ID, ' +
              ' FILE_SIZE, FILE_PATH, FILE_TYPE ) ' +
              ' VALUES ( ?, ?, ?, ?, ?, ?, ?, ? ) ';

    connection.query(
        sql,
        [orgFileName, savedFileName, delFlag, addDate, addId, fileSize, filePath, fileType], 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
	
    var sql = ' SELECT FILE_ID FROM COMM_FILE_MNG ORDER BY FILE_ID DESC LIMIT 1 ';
    connection.query(
        sql, 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
};

module.exports = new fileMng();