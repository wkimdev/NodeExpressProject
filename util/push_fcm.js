var FCM = require('fcm-node');
/* var firebase = require("firebase"); */

var serverKey = require('./babsang-75c6b-firebase-adminsdk-i2ndo-d85bc56dfd.json');

var fcm = new FCM(serverKey);

module.exports = new function () {
    this.Send = function (query, callback) {
    /** Firebase(구글 개발자 사이트)에서 발급받은 서버키 */
    // 가급적 이 값은 별도의 설정파일로 분리하는 것이 좋다.
    //var serverKey = 'AAAAKNo3bUE:APA91bGUAhTgq3GfiNbD7gZ6zMz6KC-O_Aposmi1VvQIn3YfdxRWB7RVlK-bCYV6qBQJaXfZTP4N21ovtctWc-OT_gjTPj9xZtUkUf1GvZFHUjk28JIePNxRvhRE6ibkDorI9vY6Riuc';
    
    /** 안드로이드 단말에서 추출한 token값 */
    //var client_token = 'eTPU0e1_mV8:APA91bFuUJl_MZs6XVUBruM1n9oBR3KyjlYOyLRDuIjuG4hcd__06_Xi-4E2w0h_Bwhh43jK_P0wIJdtwcTcC65nZcgH1Q7TtDK2dS-CqegAdbyGa0Dii_YmB460zr6AKe2HIwZ_L8iX';
    
    /** 아래는 푸시메시지 발송절차 */
    //var fcm = new FCM(serverKey);
    console.log('===========================');
    console.log(query);
    var client_token = query.deviceToken; 
    var title = query.title;
    var body = query.contents;

    //발송 후 시간 리턴(db에 timestamp 처리하기)

    /** 발송할 Push 메시지 내용 */
    var push_data = {

    // 수신대상
    to: client_token,
    // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
    notification: {
        title: title,
        body: body,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon"
    }
    };

    fcm.send(push_data, function(err, response) {
    if (err) {
        console.error('Push메시지 발송에 실패했습니다.');
        console.error(err);
        return;
    }

    console.log('Push메시지가 발송되었습니다.');
    console.log(response);
    console.log(response.results);
    });

    }
}
