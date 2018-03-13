var mysql = require('mysql');
var timeHelper = require('../util/time_helper');
var typeHelper = require('../util/type_helper');
var log = require('../util/log.js');

function Db() {
}

Db.prototype.createPool = function (name, host, user, password, database) {
    console.log('Create mysql-pool. name=' + name + ' host=' + host + ' database=' + database);
    
    var config = {
        host: host,
        user: user,
        password: password,
        connectionLimit : 10,
        multipleStatements : true,
    };

    console.log('# config');
    console.log(config);

    if (database) {
        config.database = database;
    }

    this.pool = mysql.createPool(config);

    console.log('## createPool');
    console.log(this.pool);
}

Db.prototype.enableSqlLogging = function (enable) {
    this.enableSqlLogging = enable ? true : false;
}

Db.prototype.getConnection = function (callback) {
    console.log('#1!!');
    // this.pool.getConnection(callback);
    // this.pool.getConnection();
    this.pool.getConnection();

    console.log(this.pool);

    this.pool.getConnection(function(err, connection){

        console.log('#1-1');

        if(!err) {
            console.log('## connected! ##');
        }

        connection.release();
    });

    console.log('#2');
}

Db.prototype.getConditionString = function (conditions) {
    if (!conditions) {
        return '';
    }
    
    if (typeHelper.IsArray(conditions) == false) {
        conditions = [conditions];
    }
    
    var s = ' WHERE ';
    for (var c = 0; c < conditions.length; c++) {
        var condition = conditions[c];
        
        if (c > 0) {
            s += ' OR ';
        }
        
        s += '(';
        var keys = Object.keys(condition);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = condition[key];
            if (i > 0) {
                s += ' AND ';
            }
            
            s += mysql.escapeId(key);
            if (typeof value == 'undefined' || value === null) {
                s += ' IS NULL';
            }
            else {
                s += '=' + mysql.escape(value);
            }
        }
        s += ')';
    }
    return s;
}

// 얻은 결과에서 Date타입의 객체를 로컬시간의 문자열로 바꾼다.
Db.prototype.convertDateToString = function (row) {
    Object.keys(row).forEach(function (key) {
        var value = row[key];
        if (value instanceof Date === true) {
            row[key] = timeHelper.ConvertDBDateToString(value);
        }
    });
}

// 얻은 결과에서 Date타입의 객체를 로컬시간의 문자열로 바꾼다.
Db.prototype.convertRowsDateToString = function (rows) {
    if (rows) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            this.convertDateToString(row);
        }
    }            
}

// 조건에 해당하는 값들을 얻는다.
// ex, db.select('table', ['Gold', 'Exp'], { AccountId : 7 }, function (err, rows)..
Db.prototype.select = function (tableName, columns, condition, callback) {
    var self = this;
    this.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err, null);
            }
            return;
        }
        
        var conditionString = self.getConditionString(condition);
        var sql = 'SELECT ?? FROM ??' + conditionString;
        var args = [columns, tableName];
        
        sql = mysql.format(sql, args);
        
        connection.query(sql, function (err, rows) {
            connection.release();
            
            if (err) {
                log.error(err + " QUERY=" + sql);
            }            
            else if (self.enableSqlLogging) {
                log.debug(sql + ' >> rows count : ' + (rows ? rows.length : 0));
            }
            
            self.convertRowsDateToString(rows);
            
            if (callback) {
                callback(err, rows);
            }
        });
    });
}

// 조건에 해당하는 값들의 모든컬럼을 얻는다.
// ex, db.select('table', { AccountId : 7 }, function (err, rows)..
Db.prototype.selectAll = function (tableName, condition, callback) {
    var self = this;

    console.log('select All 1');

    this.getConnection(function (err, connection) {
        console.log('select All 1-1');

        if (err) {
            if (callback) {
                callback(err, null);
            }
            return;
        }
        
        var conditionString = self.getConditionString(condition);
        var sql = 'SELECT * FROM ??' + conditionString;
        var args = [tableName];
        
        sql = mysql.format(sql, args);
        
        connection.query(sql, function (err, rows) {
            connection.release();
            
            if (err) {
                log.error(err + " QUERY=" + sql);
            }            
            else if (self.enableSqlLogging) {
                log.debug(sql + ' >> selected count : ' + (rows ? rows.length : 0));
            }
            
            self.convertRowsDateToString(rows);
            
            if (callback) {
                callback(err, rows);
            }
        });
    });
}

Db.prototype.selectAllConditionString = function (tableName, condition, callback) {
    // condition이 A = B AND A1 = C 이런 식이 아닌 경우 호출을 위해서
    var self = this;
    this.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err, null);
            }
            return;
        }
        
        var sql = 'SELECT * FROM ?? ' + condition;
        var args = [tableName];
        
        sql = mysql.format(sql, args);
        
        connection.query(sql, function (err, rows) {
            connection.release();
            
            if (err) {
                log.error(err + " QUERY=" + sql);
            }            
            else if (self.enableSqlLogging) {
                log.debug(sql + ' >> selected count : ' + (rows ? rows.length : 0));
            }

            self.convertRowsDateToString(rows);
            
            if (callback) {
                callback(err, rows);
            }
        });
    });
}

// 여러개의 값을 한번에 인서트한다.    
// ex, db.bulkInsert('table', ['AccountId', 'Message'], [['7', 'aaa'], ['7', 'bbb']], function (err, result)..
Db.prototype.bulkInsert = function (tableName, columns, values, callback) {
    var self = this;
    this.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err, null);
            }
            return;
        }
        
        if (!values || values.length == 0) {
            if (callback) {
                callback(err, null);
            }
            return;
        }
        
        var sql = 'INSERT INTO ??(??) VALUES ?';
        var args = [tableName, columns, values];
        
        sql = mysql.format(sql, args);
        
        connection.query(sql, function (err, result) {
            connection.release();

            // 데드락 발생시 다시 커넥션을 얻어와 재시도한다.
            if (err && err.code == 'ER_LOCK_DEADLOCK') {
                log.warn('Retry deadlock query : ' + sql);

                setTimeout(function () {
                    self.getConnection(function (err, connection) {
                        if (err) {
                            if (callback) {
                                callback(err, null);
                            }
                            return;
                        }
                        connection.query(sql, function (err, result) {
                            connection.release();

                            if (err) {
                                log.error(err + " DEADLOCK_QUERY=" + sql);
                            }
                            else if (self.enableSqlLogging) {
                                log.debug(sql + ' >> inserted count : ' + (result ? result.affectedRows : 0));
                            }

                            if (callback) {
                                callback(err, result);
                            }
                        });
                    });
                }, 100);
                return;
            }
            
            if (err) {
                log.error(err + " QUERY=" + sql);
            }            
            else if (self.enableSqlLogging) {
                log.debug(sql + ' >> inserted count : ' + (result ? result.affectedRows : 0));
            }
            
            if (callback) {
                callback(err, result);
            }
        });
    });
}

// 하나의 객체를 인서트한다.
Db.prototype.insert = function (tableName, value, callback) {
    var self = this;
    this.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err, null);
            }
            return;
        }
        
        var sql = 'INSERT INTO ' + tableName + ' SET ?';
        
        sql = mysql.format(sql, value);
        
        connection.query(sql, function (err, result) {
            connection.release();
            
            if (err) {
                log.error(err + " QUERY=" + sql);
            }           
            else if (self.enableSqlLogging) {
                log.debug(sql + ' >> inserted count : ' + (result ? result.affectedRows : 0));
            }
            
            if (callback) {
                callback(err, result);
            }
        });
    });
}

// 하나의 객체를 리플레이스한다.
Db.prototype.replace = function (tableName, value, callback) {
    var self = this;
    this.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err, null);
            }
            return;
        }
        
        var sql = 'REPLACE INTO ' + tableName + ' SET ?';
        
        sql = mysql.format(sql, value);
        
        connection.query(sql, function (err, result) {
            connection.release();
            
            if (err) {
                log.error(err + " QUERY=" + sql);
            }
            else if (self.enableSqlLogging) {
                log.debug(sql + ' >> replaced count : ' + (result ? result.affectedRows : 0));
            }
            if (callback) {
                callback(err, result);
            }
        });
    });
}

// 조건에 해당하는 값들을 갱신한다.
// ex, db.update('table', { Gold : 1111 }, { AccountId : 7 }, function (err, result)..
Db.prototype.update = function (tableName, value, condition, callback) {
    var self = this;
    this.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err, null);
            }
            return;
        }
        
        var conditionString = self.getConditionString(condition);
        var sql = 'UPDATE ' + tableName + ' SET ?' + conditionString;
        var args = [value];
        
        sql = mysql.format(sql, args);
        
        connection.query(sql, function (err, result) {
            connection.release();
            
            if (err) {
                log.error(err + " QUERY=" + sql);
            }            
            else if (self.enableSqlLogging) {
                log.debug(sql + ' >> updated count : ' + (result ? result.affectedRows : 0));
            }
            
            if (callback) {
                callback(err, result);
            }
        });
    });
}

// 조건에 맞는 항목들을 제거한다.
Db.prototype.delete = function (tableName, condition, callback) {
    var self = this;
    this.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err, null);
            }
            return;
        }
        
        var conditionString = self.getConditionString(condition);
        var sql = 'DELETE FROM ' + tableName + conditionString;
        
        connection.query(sql, function (err, result) {
            connection.release();
            
            if (err) {
                log.error(err + " QUERY=" + sql);
            }            
            else if (self.enableSqlLogging) {
                log.debug(sql + ' >> deleted count : ' + (result ? result.affectedRows : 0));
            }
            
            if (callback) {
                callback(err, result);
            }
        });
    });
}

// 쿼리를 스트리밍으로 결과를 얻는다.
Db.prototype.streamingQuery = function (queryStr, onResult, callback) {
    var self = this;
    self.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }
        
        var queryError = null;
        var q = connection.query(queryStr);
        q.on("error", function (err) { queryError = err; });
        q.on("result", function (result) { if (onResult) onResult(result); });
        q.on("end", function () { if (callback) callback(queryError); });
    });
}

// 외부에서 query string을 구축해서 쿼리하는 방식
Db.prototype.CustomSelectQuery = function (querystr, callback) {
    var self = this;
    self.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }
        
        connection.query(querystr, function (err, rows) {
            connection.release();
            
            if (err) {
                log.error(err + " QUERY=" + querystr);
            }            
            else if (self.enableSqlLogging)
                log.debug(querystr + ' >> selected count : ' + (rows ? rows.length : 0));
            
            self.convertRowsDateToString(rows);

            if (callback) {
                callback(err, rows);
            }
        });
    });
}

Db.prototype.CustomQuery = function (querystr, callback) {
    var self = this;
    self.getConnection(function (err, connection) {
        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }
        
        connection.query(querystr, function (err, result) {
            connection.release();
            
            if (err) {
                log.error(err + " QUERY=" + querystr);
            }            
            else if (self.enableSqlLogging)
                log.debug(querystr + ' >> affected row count : ' + (result ? result.affectedRows : 0));
            
            if (callback) {
                callback(err, result);
            }
        });
    });
}

module.exports = Db;
