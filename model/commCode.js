var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function commCode() {
}

/**
 * 코드값 출력
 */
commCode.prototype.selectCodeList = function(callback) {
    var sql = ' SELECT CODE_NB, CODE_NM FROM COMM_CODE ';

    connection.query(sql, 
        function(err, rows) {
            if(err) console.log(err);
			else    console.log(rows);
			callback(err, camelcaseKeys(rows));			
        }
    );
}

module.exports = new commCode();