/**
 * 각 소셜 develop site 에서 각 키를 바꿔주세요.
 * @see NAVER https://developers.naver.com/main/
 * @see KAKAO https://developers.kakao.com/features/platform#%EC%82%AC%EC%9A%A9%EC%9E%90-%EA%B4%80%EB%A6%AC
 * @see FACEBOOK https://developers.facebook.com/
 */

module.exports = function () {                
    return {
        naver: {
            client : {                
                id: 'KgNyLvy5fnJFDw5hCrpo',    // 네이버 client_id
                secret:'Ksta6km1Bd'// 네이버 client_secret
            },
            redirect_uri: 'http://127.0.0.1:3000/memberLogin/naverLogin.callback', // 호스트만 변경
            userInfo_uri: 'https://openapi.naver.com/v1/nid/me' // 변경 불필요
        },
        kakao: {
            rest_key: 'b11ca955bdc297c6abb9ff5264b4e47a', // kakao rest api key
            javascript: 'aedf7cb4f2b76bee03b5c10e9fe694b8', // kakao javascript key
            admin: 'af749151f33c4f5ee0eab6df9829843b', // kakao admin key
            navtive: '58165df8e0283ddca1e27cd952422f19', // kakao native key
            redirect_uri: 'http://127.0.0.1:3000/memberLogin/kakaoLogin.callback', // 호스트만 변경
            client: {
                secret: 'ZFltZVTMsNAjaVWIYHH6s1I1u36oJbya' // kakao client secret
            }
        },
        facebook: { 
            app: {
                id: '231894277381456', // facebook app-id
                secret: '0c84c7e6845f1e9e49977852ae3824d8' //facebook app-secret
            },
            redirect_uri: 'http://127.0.0.1:3000/memberLogin/facebookLogin.callback' // 호스트만 변경
        }
    }
}