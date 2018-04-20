
## Project
javascript기반의 서버 플랫폼으로서 높은 인기도를 얻고 있는
비동기 프로그래밍 등을 가능하게 하는 Node.js를 선택하여 Express 기반'밥상머리'라는 교육 서비스 플랫폼 베타개발.

## 관련 Tech Stack
Express, Node js , AWS, MySQL

---
1. 프로젝트 구분 : 팀프로젝트(2명)
2. 역할 :  
> 전담 : 
> - Express기반으로 기능별로 module/router로 나누어 Back단 구성(MySQL)
> - AWS의 S3스토리지에 파일업로드 기능 구현
> - 테이블설계, ERD작성  
>  
> 보조 :  view단 구성.

## 구현사항
- Express기반으로  Rest api 형식으로 기본정보를 받아오게 구성했습니다. rodule/router로 나누어 Back단 구성(MySQL)
- npm들을 이용해 필수패키지들을 설치하여 기획서를 기반으로 액션처리 구현

## 1. image file upload 구현
- [AWS S3 스토리지에 파일업로드 구현/개인블로그정리](https://wkimdev.github.io/node/aws-s3/2018/03/13/node-project-fileUpload/)

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


- aws-sdk 모듈 로드 : 해당 모듈은 AWS 서비스를 사용하기 위한 javascript 객체를 제공해준다.
- multiparty 모듈은 파일업로드를 위한 npm 모듈.



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
## 2. [사용자 푸쉬알람 fcm처리/개인블로그정리](https://wkimdev.github.io/node/fcm/2018/03/13/node-project-fcm/).

