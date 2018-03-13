module.exports = {

    setLoginProcess: function (res, rows, req) {

        console.log("########################## SET LOGIN PROCESSING ##########################");
        var memberLoginDb = require('../model/memberLogin');
        if ( req !== undefined ) {

        }

        console.log("########################## COOKIE CLEAR FOR INIT ##########################");
        if ( res.cookie('ADMIN_NO') != null ) res.clearCookie('ADMIN_NO');
        if ( res.cookie('memberNo') != null ) res.clearCookie('memberNo');
        if ( res.cookie('memberType') != null ) res.clearCookie('memberType');
        if ( res.cookie('nm') != null ) res.clearCookie('nm');
        if ( res.cookie('email') != null ) res.clearCookie('email');
        if ( res.cookie('sns') != null ) res.clearCookie('sns');
        if ( res.cookie('ID') != null ) res.clearCookie('ID');
        // res.clearCookie('memberNo');
        // res.clearCookie('memberType');
        // res.clearCookie('nm');
        // res.clearCookie('email');
        // res.clearCookie('sns');
        // res.clearCookie('ID');
        console.log("########################## COOKIE CLEAR EXIT ##########################");

        console.log("########################## SETUP USER LOGIN ##########################");
        res.cookie('memberNo', rows[0].memberNo);
        res.cookie('memberType', rows[0].memberType);
        res.cookie('nm', rows[0].nm);
        res.cookie('email', rows[0].email);
        res.cookie('sns', rows[0].sns);
        res.cookie('ID', rows[0].email);
        console.log("########################## SETUP USER LOGIN END ##########################");

        console.log("########################## SET LOGIN PROCESSING EXIT ##########################");

        //var token = req.cookies.device_token;
        var token = 1234;
        if ( token !== null || token !== undefined) {
            /**
             * DB 업데이트
             */
            res.cookie('token', token);
            memberLoginDb.updateUserToken(res);

            return;
        }
    }
};