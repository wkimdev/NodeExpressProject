var express = require('express');
var router = express.Router();
var loginUserDb = require('../model/memberLogin');
var _resturn = require('../model/res');
var _social = require('../util/social_config')();
var _uuid = require('../util/uuid_creator');
var request = require('request');
var loginProcessing = require('../util/set_login_cookie');
var decode = require('urldecode')

/**  
  * 일반회원 로그인
  * @route {POST} /loginUser
  */
router.post('/loginUser', function(req, res) {
		
	loginUserDb.userLogin(req, function(err, rows) {
		if ( err ) {
			_resturn.result = 0;
			_resturn.resultMsg = err;
		} else {			
			// 로그인 회원 없음.
			if ( rows.length == 0 ) {
				_resturn.result = rows.length;
				_resturn.resultMsg = '아이디 또는 비밀번호가 다릅니다.';
				_resturn.resultData = null;				
			} else {
				_resturn.result = rows.length;
				_resturn.resultMsg = 'ACCESS USER';
				_resturn.resultData = rows[0];
				loginUserDb.updateUserToken({token: req.cookies.token, email: req.body.email});

				loginProcessing.setLoginProcess(res, rows, req);

				// res.cookie('memberNo', rows[0].memberNo);
				// res.cookie('memberType', rows[0].memberType);
				// res.cookie('nm', rows[0].nm);
				// res.cookie('email', rows[0].email);
			}			
		}		
		res.send(_resturn);
	});	
});

/**
* 관리자 로그인
* @route {POST} /loginAdmin
*/
router.all('/loginAdmin', function(req, res) {
	loginUserDb.administratorLogin(req.body, function (err, rows) {
		if (err){
			_resturn.result = 0;
			_resturn.resultMsg = err;
		}else{
			_resturn.result = 1;
			_resturn.resultMsg = '';
			_resturn.resultData = rows;

			// set cookie !!
			//res.cookie('ADMIN_NO', rows[0].adminNo);
			try {
				//res.cookie('MEMBER_NO', rows.memberNo);
				//res.cookie('ID', rows.resultData[0].nm);
				//console.log(rows.resultData);
				console.log("=================== rows ===============");
				console.log('test : '+rows);
				console.log(rows[0].memberNo);
				console.log(rows[0].nm);
				res.cookie("MEMBER_NO", rows[0].memberNo);
				res.cookie("ID", rows[0].nm);
				console.log("=================== END rows ===============");
			} catch (e) {
				console.error(e);
			} finally {
				console.log("=================== final ===============");
				res.send(_resturn);
			}			
		}		
	});
});

/**  
  * 일반회원 로그아웃
  * @route {POST} /logOutUser
  */
router.post('/logOutUser', function(req, res) {
    res.send(_resturn);
});

/**  
  * 관리자 로그아웃
  * @route {POST} /logOutAdmin
  */
router.post('/logOutAdmin', function(req, res) {
    res.send(_resturn);
});

/**
 * 네이버 로그인
 * @route {GET} /memberLogin/naverLogin
 */
router.get('/naverLogin', function (req, res) {	
	var api_url = 
	`https://nid.naver.com/oauth2.0/authorize?client_id=${_social.naver.client.id}&response_type=code&redirect_uri=${encodeURI(_social.naver.redirect_uri)}&state=${_uuid().create(10)}`;			
	res.redirect(api_url);
});

/**
 * 네이버 로그인 콜백
 * @route {GET} /memberLogin/naverLogin.callback
 */
router.get('/naverLogin.callback', function( req, res ) {
	code = req.query.code;
    state = req.query.state;
	var api_url = 
	`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${_social.naver.client.id}&client_secret=${_social.naver.client.secret}&redirect_uri=${encodeURI(_social.naver.redirect_uri)}&code=${code}&state=${state}`;   
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':_social.naver.client.id, 'X-Naver-Client-Secret': _social.naver.client.secret}
	 };
	 
	 var token = null; // token 값을 null 로 초기화
	
	 request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {						
		//res.redirect('/memberLogin/naverLogin.me?token=' + resJSON.access_token);				
		
		//유저 정보 획득
		var resJSON = JSON.parse(body);
		token = resJSON.access_token;
		var header = 'Bearer ' + token;
		var options2 = { 
			url: _social.naver.userInfo_uri, 
			headers: {'Authorization': header}
		};
		request.get(options2, function ( error, response, body) {		
			if ( !error && response.statusCode == 200 ) {
				// db update
				var bodyParse = JSON.parse(body);
				var dbParams = { 
					sns: 'naver', 
					email: bodyParse.response.email,
					nm: bodyParse.response.name,
                    token: req.cookies.token
				};
				loginUserDb.findSocialUserByEmail(dbParams, function (err, rows) {
					if ( err ) { _resturn.result = 0; _resturn.resultMsg = err; }
					
					if ( rows.length == 0 ) {
						// 소셜 첫 로그인 insert 진행
						loginUserDb.inserSocialUser(dbParams, function( err2, rows2) {
							if ( err2 ) { 								
								console.log(err2);
								res.redirect('/public/html/APP-F/APP-F-01.html');
							} else {
								loginUserDb.findSocialUserByEmail(dbParams, function ( err3, rows3 ) {
                                    loginProcessing.setLoginProcess(res, rows3, req);
									res.redirect('/public/html/APP-F/APP-F-01.html');
								});
							}		
						});						
					} else {
                        loginProcessing.setLoginProcess(res, rows, req);
						res.redirect('/public/html/APP-F/APP-F-01.html');
					}
				});													
			} else {
				console.log('error');
				if ( response != null ){
					res.status(response.statusCode).end();
					console.log('error = ' + response.statusCode);
				} 
			}
		});

        
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
});

/**
 * 카카오 로그인 API
 * @router {GET} /memberLogin/kakaoLogin
 */
router.get('/kakaoLogin', function (req, res) {
	var api_url = `https://kauth.kakao.com/oauth/authorize?client_id=${_social.kakao.rest_key}&redirect_uri=${_social.kakao.redirect_uri}&response_type=code`;	
	res.redirect(api_url);
});

/**
 * 카카오 로그인 Callback URL
 * @router {GET} /memberLogin/kakaoLogin.callback
 */
router.get('/kakaoLogin.callback', function (req, res) {
	var code 			= req.query.code;
	var client_id 		= _social.kakao.rest_key;
	var redirect_uri 	= _social.kakao.redirect_uri;
	var client_secret 	= _social.kakao.client.secret;
	var grant_type 		= 'authorization_code';

	var options = {
		url: 'https://kauth.kakao.com/oauth/token',
		form: {
			grant_type: grant_type,
			client_id: client_id,
			redirect_uri: redirect_uri,
			code: code,
			client_secret: client_secret 
		}
	}

	// 토큰 획득
	request.post(options, function (error, response, body) {
		if ( !error ) {
			var token = JSON.parse(body).access_token;
			var header = 'Bearer ' + token;
			
			var getUserInfoOptions = {
				url: 'https://kapi.kakao.com/v1/user/me',
				headers : { 
					'Authorization': header,
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
				}
			}

			request.post(getUserInfoOptions, function( error2, response2, body2) {

				if ( !error2 ) {
					var userInfo = JSON.parse(body2);
					
					// db 에서 해당 계정 사용자 조회
					var dbParams = {
						email: userInfo.kaccount_email,
						sns: 'kakao',
						nm: userInfo.properties.nickname,
						token: req.cookies.token

					};
					loginUserDb.findSocialUserByEmail(dbParams, function( err, rows) {
						
						// 1. 이메일과 소셜계정이 없을경우 insert
						if ( rows.length == 0 ) {
							loginUserDb.inserSocialUser(dbParams, function ( err2, rows2 ) {
								if ( !err2 ) {
									
									loginUserDb.findSocialUserByEmail(dbParams, function( err3, rows3 ) {
										if ( !err3 ) {
                                            loginProcessing.setLoginProcess(res, rows3, req);
											res.redirect('/public/html/APP-F/APP-F-01.html');
										} else {
											res.send(err3);
										}
									});

								} else {
									res.end(err2);
								}
							});
						}
						// 2. 있으면 바로 로그인
						else {
                            loginProcessing.setLoginProcess(res, rows, req);
							res.redirect('/public/html/APP-F/APP-F-01.html');
						}

					});					
				} else {
					res.end(error2);
				}
			});			
		} else {
			// 에러 처리
			console.log('error');
			console.log(error);
			res.end(error);
		}
	});
});

/**
 * 페이스북 로그인 API
 * @rotuer {GET} /memberLogin/facebookLogin
 */
router.get('/facebookLogin', function (req, res) {
	var api_url = `https://www.facebook.com/v2.12/dialog/oauth?client_id=${_social.facebook.app.id}&redirect_uri=${_social.facebook.redirect_uri}&state=${_uuid().create(5)}&response_type=code`;
	res.redirect(api_url);
});

/**
 * 페이스북 로그인 Callback
 * @router {GET} /memberLogin/facebookLogin.callback
 */
router.get('/facebookLogin.callback', function (req, res) {
	var code = req.query.code;
	var state = req.query.state;	
	var api_url 
		= 'https://graph.facebook.com/v2.12/oauth/access_token'
		+ '?code=' + code
		+ '&client_id=' + _social.facebook.app.id
		+ '&redirect_uri=' + encodeURI(_social.facebook.redirect_uri)
		+ '&client_secret=' + _social.facebook.app.secret;
	
	request.get(api_url, function (error, response, body) {
		var token = JSON.parse(body).access_token;
		
		// 사용자 정보 획득		
		var meUrl 
			= 'https://graph.facebook.com/me?access_token=' + token
			+ '&fields=id,name,email';
		request.get(meUrl, function(error2, response2, body2) {
			var data = JSON.parse(body2);
			var dbParams = {
				sns: 'facebook',
				email: data.email,
				nm: data.name,
                token: req.cookies.token
			};
			loginUserDb.findSocialUserByEmail(dbParams, function ( err, rows) {
				if ( !err ) {
					
					if ( rows.length == 0 ) {
						loginUserDb.inserSocialUser(dbParams, function ( err2, rows2) {
							if ( !err2 ) {
								loginUserDb.findSocialUserByEmail(dbParams, function ( err3, rows3) {
									if  ( !err3 ) {
                                        loginProcessing.setLoginProcess(res, rows3, req);
										res.redirect('/public/html/APP-F/APP-F-01.html');
									} else {
										res.end(err3);
									}
								});
							} else {
								res.end(err2);
							}
						});
					} else {
                        loginProcessing.setLoginProcess(res, rows, req);
						res.redirect('/public/html/APP-F/APP-F-01.html');
					}

				} else {
					res.end(err);
				}
			});
		});
	});
	res.end();
});


module.exports = router;