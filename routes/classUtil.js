var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var multiparty = require('multiparty');
var fs = require('fs');
var request = require('request');

AWS.config.loadFromPath('./config/config.json');
AWS.config.region = 'ap-northeast-2';

var s3 = new AWS.S3();

router.all('/FileUpload', function(req, res, next) {
	var form = new multiparty.Form();

	form.on('field',function(name,value){
		console.log('normal field / name = '+name+' , value = '+value);
	});

    // form.parse(req, function (err, fields, files) {
		// if ( err ) throw err;
    //     console.log('>>>>>>>>> FILES >>>>>>>>>>>>>>');
		// console.log(files);
    //     console.log('<<<<<<<<< FILES <<<<<<<<<<<<<<');
    // });

	form.on('file',function(name, file){
		console.log(file);
		var param = {
			'Bucket':'classboardimage',
			'Key':file.originalFilename,
			'ACL':'public-read',
			'Body':null
		};

		var orgFileName = file.originalFilename;
		var orgFileExtension = orgFileName.lastIndexOf(".");

		function makeid() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			
			for (var i = 0; i < 10; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
			
			return text;
		}

		param.Key = makeid() + orgFileExtension;

		//param.Key = file.originalFilename;
		param.Body = require('fs').createReadStream(file.path);


		// 예시		
	  
		var s3UploadAction = s3.upload(param, function(err, data){
			console.log(err);
			console.log(data);

			res.status(200).send(data);
		});
		
	});
	
// all uploads are completed
//	form.on('close',function(){
//		res.status(200).send('Upload complete');
//	});

	form.parse(req);
});

module.exports = router;