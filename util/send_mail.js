module.exports = function () {

    var nodemailer = require('nodemailer');
    console.log('setup email module');
    var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com', // 호스트
        port: 587, // 포트
        secure: false, // 암호화
        auth: {
            user: 'wkimdev@gmail.com', // 이메일주소
            pass: '' // 비밀번호
        }
    });

    return {         
        send: function ( opt ) {
            smtpTransport.sendMail(opt, function( err, info ) {
                if ( err ) return console.log( err );
                
                console.log(`Send Main From ${opt.from} To ${opt.to}`);
            });
        }
    }
}