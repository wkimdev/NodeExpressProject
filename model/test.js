var mysql = require('mysql');
const camelcaseKeys = require('camelcase-keys');
var propertiesReader = require('properties-reader');
//var properties = propertiesReader('../db.properties');

function User() {
    var config = {
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        connectionLimit : 10,
        multipleStatements : true,
        database : 'tmp'
    };
    
    this.pool = mysql.createPool(config);
}



User.prototype.getConnection = function(callback) {
    this.pool.getConnection(callback);
}

User.prototype.selectJsonTest = function(callback) {
    var sql = 'SELECT * FROM MEMBER_MNG';
    this.getConnection(function (err, connection) {
        connection.query(sql, function(err, rows) {
            connection.release();
            if (callback) {
                callback(err, camelcaseKeys(rows));
            }
        });
    });
}

User.prototype.insertJsonTest = function(query, callback) {
    var sql = 'INSERT INTO MEMBER_MNG(EMAIL, MEMBER_TYPE) VALUES(?, ?)';
    this.getConnection(function (err, connection) {
        connection.query(sql, ['tesst06@naver.com', '2'], function(err, rows) {
            connection.release();
            if (callback) {
                callback(err, camelcaseKeys(rows));
            }
        });
    });
}

User.prototype.updateJsonTest = function(query, callback) {
    var sql = 'UPDATE MEMBER_MNG SET PASSWORD = ? WHERE EMAIL = ?';
    this.getConnection(function (err, connection) {
        connection.query(sql, ['1111', 'tesst06@naver.com'], function(err, rows) {
            connection.release();
            if (callback) {
                callback(err, camelcaseKeys(rows));
            }
        });
    });
}

module.exports = new User();