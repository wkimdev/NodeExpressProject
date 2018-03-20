var express = require('express');   //express 로드
var router = express.Router();  //express의 router 모듈 로드
var AWS = require('aws-sdk');   

//aws-sdk 모듈 로드 : 해당 모듈은 AWS 서비스를 사용하기 위한 
// javascript 객체를 제공해준다.

var multiparty = require('multiparty');

// multiparty 모듈은 파일업로드를 위한 npm 모듈이다.

var fs = require('fs');
var s3 = new AWS.S3();  //버킷을 불러오기 위한 S3 객체를 생성한다.

//S3의 스토리지 인프라에 접근하기 위해선
//AWS 인증 credential 파일이 필요했다.
//어플이 로딩될때, 해당 Credential 파일을 읽도록 했다.

AWS.config.loadFromPath();
AWS.config.region = 'ap-northeast-2'  //aws 지역설정

//all method는 get, post, put, delete같은 http 요청 방법을
//다 수행한다. //http://expressjs.com/en/4x/api.html#app.all
router.all('/FileUpload', function(req, res, next) {
    var form = new multiparty.Form();

    //파일을 읽음
    form.on('field', function(name, value){
        console.log('field / name : '+name+',  value = '+value );
    });

    //
    form.on('file', function(name, file){   //file정보를 가져옴?
        //bucket에 넣음
        var param = {
            'Buket' : 'buketName',
            'Key':file.originalFilename,
            'ACL':'public-read',
            'Body':null
            //버킷설정
        };

        param.key = originalFilename;
        param.Body = require('fs').createReadStream(file.path);

        //s3모듈을 실행하여 파일 업로드 수행
        s3.upload(param, function(err, data){
            console.log(err);
            console.log(data);

            res.status(200).send(data); //??
        });

    });

});










