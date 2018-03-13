var typeHelper = require(__base + 'util/type_helper.js');
var randomstring = require('randomstring');
//�־��� ����[min, max) ������ ���� ����.
function GetRandom(min, max) {
    if (!max) {
        return Math.floor(Math.random() * min);
    }
    else {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

//�ִ� max�� rate���� Ȯ���� ��츦 ����.
function PollRate(rate, max) {
    var r = GetRandom(max);
    return r < rate;
}

//�ش� Ȯ���� ����ϸ� �־��� �������� ������ ������ ����.
function PollCountByRate(rate, minCount, maxCount) {
    if (!rate) {
        return 0;
    }
    
    var pass = PollRate(rate, 1000);
    if (pass) {
        var count = GetRandom(minCount, maxCount + 1);
        return count;
    }
    return 0;
}

function GetRandomString(length) {
    return randomstring.generate(length);
}

module.exports.GetRandom = GetRandom;
module.exports.PollRate = PollRate;
module.exports.PollCountByRate = PollCountByRate;
module.exports.GetRandomString = GetRandomString;
