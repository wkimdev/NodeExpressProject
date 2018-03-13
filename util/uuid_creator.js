module.exports = function() {
    var uuidV1 = require('uuid/v1');

    return {
        // 파라미터 로 넘겨온 값 만큼 생성
        create: function( len ) {
            var uid = uuidV1();
            uid = uid.split('-').join('').substr(0, len);
            return uid;
        }
    }
}