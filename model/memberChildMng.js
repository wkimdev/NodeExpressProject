var mysql = require('mysql');
var camelcaseKeys = require('camelcase-keys');
var dbPool = require('../util/dbPool');
var connection = dbPool.init();

function memberChildMng() {
}

/**
 * 회원자녀 리스트
 */
memberChildMng.prototype.selectMemberChild = function(query, callback) {
    var sql = ' SELECT MEMBER_CHILD_ID, CHILD_NM, GRADE, GENDER, BIRTHDAY, HEIGHT, WEIGHT FROM MEMBER_CHILD_MNG ' +
              ' WHERE MEMBER_NO=?';
        connection.query(
            sql,
            [query.cookies.memberNo],
            function(err, rows) {
                if(err) console.log(err);
                else    console.log(rows);
                callback(err, camelcaseKeys(rows));	
            }
        );
}

memberChildMng.prototype.selectOnMemberChild = function(query, callback) {
    var sql = 'SELECT * FROM MEMBER_CHILD_MNG WHERE MEMBER_CHILD_ID = ?';
    connection.query(
        sql,
        [query.memberChildId],
        function( err, rows ) {
            if ( err ) console.log(err);
            else callback(err, camelcaseKeys(rows));
        }
    )
}

/**
 * 회원자녀 등록
 */
memberChildMng.prototype.insertMemberChild = function(query, callback) {
    var sql = ' INSERT INTO tmp.MEMBER_CHILD_MNG ( EMAIL, MEMBER_NO, CHILD_NM, GRADE, GENDER, ' +
              ' BIRTHDAY, HEIGHT, WEIGHT, ADD_ID ) ' +
              ' VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? ) ';  

        connection.query(
            sql, 
            [query.body.email, query.body.memberNo ,query.body.childNm ,query.body.grade, query.body.gender, query.body.birthday
                , query.body.height, query.body.weight, query.cookies.ID], 
            function(err, rows) {
                if(err) console.log(err);
                else    console.log(rows);
                callback(err, camelcaseKeys(rows));	
        });
}

/**
 * 회원자녀 수정
 */   
memberChildMng.prototype.updateMemberChild = function(query, callback) {
    var sql = ' UPDATE MEMBER_CHILD_MNG ' +
              ' SET CHILD_NM = ?, GRADE=?, GENDER=?, BIRTHDAY=?, HEIGHT=?, ' +
              ' WEIGHT=?, UPDATE_ID=? ' +
              ' WHERE MEMBER_CHILD_ID = ? ';

        connection.query(
            sql, 
            [query.body.childNm, query.body.grade, query.body.gender, query.body.birthday, query.body.height
                , query.body.weight, query.cookies.ID, query.body.memberChildId],
            function(err, rows) {
                if(err) console.log(err);
                else    console.log(rows);
                callback(err, camelcaseKeys(rows));			
            }
        );
}

/**
 * 회원자녀 삭제
 */
memberChildMng.prototype.deleteMemberChild = function(query, callback){
    var sql = ' DELETE FROM MEMBER_CHILD_MNG WHERE MEMBER_CHILD_ID = ? ';
    
        connection.query(
            sql, 
            [query.body.memberChildId], 
            function(err, rows) {
                if(err) console.log(err);
                else    console.log(rows);
                callback(err, camelcaseKeys(rows));			
            }
        );
}

/**
 * 랜덤 자녀 디테일
 * @route {GET} /memberChildMng/memberRandomChild
 * @param int memberNo 회원 primary key
 * @param String email 회원 이메일
 */
memberChildMng.prototype.memberRandomChild = function (query, callback) {
    var sql = 'SELECT * FROM MEMBER_CHILD_MNG WHERE MEMBER_NO = ? ORDER BY RAND() LIMIT 1;';

    connection.query(
        sql,
        [query.memberNo],
        function(err, rows) {
            if(err) console.log(err);
            else    console.log(rows);
            callback(err, camelcaseKeys(rows));
        }
    );
};

memberChildMng.prototype.childAllCnt = function (query, callback) {
    var sql = "SELECT COUNT(*) AS CHILD_ALL_CNT FROM MEMBER_CHILD_MNG";

    connection.query(
        sql,
        function (err, rows) {
            if ( err )  console.log(err);
            else        console.log(rows);
            callback(err, camelcaseKeys(rows));
        }
    )
}

module.exports = new memberChildMng();