var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var fs = require('fs');
var formidable = require('formidable');

AWS.config.region = 'ap-northeast-2'; //지역 서울 설정

function Upload() {
}

Upload.prototype.Upload = function(query, callback) {
};

module.exports = Upload;