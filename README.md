
## Project
Node js, Express 를 기반으로한 '밥상머리'라는 교육서비스 플랫폼 Project

## 개발환경
Express, Node js , AWS, MySQL

## 역할
1. Node js, Express 기반 BackEnd단 구성
2. AWS S3스토리 파일업로드 구성
3. 테이블설계, ERD 작성


## image file upload 구현
install 한 npm
작동원리
소스 설명
callback개념


## install npm
- aws-sdk
- async
- formidable
- fs
- multiparty

## 작동 원리 
aws에서 사용가능한 s3스토리지에서 저장을 하게 됩니다. 

버킷에 저장하는 multipaty 모듈의 기능을 이용하여

스토리지에 버킷에 저장하게 됩니다.



---

### 로드하는 모듈


aws-sdk 모듈 로드 : 해당 모듈은 AWS 서비스를 사용하기 위한 javascript 객체를 제공해준다.

multiparty 모듈은 파일업로드를 위한 npm 모듈.



```
var AWS = require('aws-sdk');   
var multiparty = require('multiparty');
var fs = require('fs');
var s3 = new AWS.S3();  //버킷을 불러오기 위한 S3 객체를 생성.

```


### S3의 스토리지 인프라에 접근하기 위한 AWS 인증 Credential 파일 설정.


```
AWS.config.loadFromPath();
```


### fileupload 수행 코드.

```
router.all('/FileUpload', function(){
    var form = new multiparty.Form();

    form.on('file', function(name, file){

        //bucket에 전송
        var param = {
            'Bucket' : 'bucketName',
            'Key' : file.originalFilename,
            'ACL' : 'public-read',
            'Body' : null
        };

        param.Key = file.originalFilename;
        param.Body = require('fs').createReadStream(file.path); //aws에 저장한 경로를 db파일 경로에 저장하게 된다.

        //s3업로드
        s3.upload(param, fucntion(err, data){
            console.log(err);
            console.log(data);

            res.status(200).send(data);
        });

    });
    from.parse(req);
});
```
