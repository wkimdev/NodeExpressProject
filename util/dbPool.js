var mysql = require('mysql');

if( process.env.NODE_ENV == 'production' ) {
	config = {
		host: process.env.RDS_HOSTNAME,
		user: process.env.RDS_USERNAME,
		password : process.env.RDS_PASSWORD,
		database : 'tmp',
		connectionLimit : 10,
		multipleStatements : true,
	};
} else if( process.env.NODE_ENV == 'development' ) {
	config = {
		host: 'hello5mysql.ci9ipxrkurji.ap-northeast-2.rds.amazonaws.com',
		user: 'master',
		password : 'byefive5%5',
		database : 'tmp',
		connectionLimit : 10,
		multipleStatements : true,
	};
}

var _mysqlPool = {
	init: function () {
		return mysql.createPool(config);
	}
};


module.exports = _mysqlPool;