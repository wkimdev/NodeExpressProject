var moment = require('moment');

module.exports = new function () {
    
    this.DateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
    
    this.toDateString = function (date) {
        if (!date) {
            return '';
        }
        return moment(date).utc().format(this.DateTimeFormat);
    }
    
    this.toDateStringNow = function () {
        return this.toDateString(new Date());
    }
    
    this.toLocalDateStringNow = function () {
        var utcTime = moment.utc().format(this.DateTimeFormat);
        var localTime = moment.utc(utcTime).toDate();
        return moment(localTime).format(this.DateTimeFormat);
    }
    
    // ���� ��¥�κ��� days �� ���� �Ǵ� ������ �ð��� ��´�.
    // days �� ����ΰ�� �̷�, ������ ��� ������ �ð��� ��´�.
    this.toDateStringFromNowDay = function (days) {
        var d = new Date();
        d.setHours(d.getHours() + (24 * days));
        return this.toDateString(d);
    }
    
    // CoolTime -> ���ð� : ��
    // LastSpottedTime -> �ֱٿ� ���ð��� �˹��� �ð� : String 
    // �����ϴ�. ���� �ð� �������� CoolTime�� �������� �Ǵ��Ѵ�.
    this.CoolTimeElapsed = function (LastSpottedTime, CoolTime) {
        var now = moment.utc();
        var lastSpottedTime = moment.utc(LastSpottedTime);
        var elapsed_sec = now.diff(lastSpottedTime, 'seconds');
        
        if (elapsed_sec > CoolTime)
            return true;
        
        return false;
    }
    
    // MySQL���� Date Object�� �ð��� UTC + 0���� ��ϵ�����
    // MySQL���� SELECT�ؼ� �޾ƿ��� Server Local Time�� �������� �Ǿ� �����Ƿ�
    // UTC ������ ��Ʈ���� �����ϸ� �ȴ�. moment ������� ���� ó��
    this.ConvertDBDateToString = function (dbDate) {
        if (dbDate instanceof Date === false)
            return dbDate;      // �׳� ������...
        
        return moment(dbDate).format(this.DateTimeFormat);
    }
    
    // ����ð� - strDate �� ���� ��´�.
    // strDate �� �̷��̸� ���� ����.
    this.GetTimeDiffFromNow = function (unit, strDate) {
        var now = this.toDateStringNow();
        return this.GetTimeDiff(unit, now, strDate);
    }
    
    // strDate1 - strDate2 �� ���� ��´�.
    this.GetTimeDiff = function (unit, strDate1, strDate2) {
        var date1 = moment.utc(strDate1, this.DateTimeFormat);
        var date2 = moment.utc(strDate2, this.DateTimeFormat);
        
        return date1.diff(date2, unit);
    }
    
    this.TimeAddMilliSecond = function (strDate, amount) {
        var date = moment.utc(strDate);
        date.add(amount, 'ms');
        
        return date.format(this.DateTimeFormat);
    }
    
    this.TimeAddSecond = function (strDate, amount) {
        var date = moment.utc(strDate);
        date.add(amount, 's');
        
        return date.format(this.DateTimeFormat);
    }
    
    this.TimeAddHour = function (strDate, amount) {
        var date = moment.utc(strDate);
        date.add(amount, 'h');
        
        return date.format(this.DateTimeFormat);
    }
    
    // UTC + 0���ٰ� ����ġ�� �����ϰ� ���� ����(0 ~ 6)�� ���Ѵ�.
    this.GetDOW = function (UTCOffsetHour) {
        if (typeof UTCOffsetHour === 'undefined')
            UTCOffsetHour = 0;
        
        var UTCNow = moment.utc();
        UTCNow.add(UTCOffsetHour, 'h');
        //console.log(UTCNow.toString());
        return UTCNow.day();
    }
    
    // UTC + 0 �ð� �������� ������ �Ŀ� ��¥�� �ٲ������ Ȯ���Ѵ�.
    this.DayChanged = function (UTCOffsetHour, time) {
        
        var UTCNow = moment.utc();
        UTCNow.add(UTCOffsetHour, 'h');
        
        var date = moment.utc(time, this.DateTimeFormat);
        date.add(UTCOffsetHour, 'h');
        
        UTCNow.set({ 'hour': 0, 'minutes': 0, 'seconds': 0 });
        date.set({ 'hour': 0, 'minutes': 0, 'seconds': 0 });
        
        return UTCNow.diff(date, 'd') != 0 ? true : false;
    }
    
    //  UTC + 0 �ð� �������� ������ �Ŀ� ���� �ٲ������ Ȯ���Ѵ�.
    this.MonthElapsed = function (UTCOffsetHour, time) {
        var UTCNow = moment.utc();
        UTCNow.add(UTCOffsetHour, 'h');
        
        var date = moment.utc(time, this.DateTimeFormat);
        date.add(UTCOffsetHour, 'h');
        
        var NowYear = UTCNow.year();
        var NowMonth = UTCNow.month();
        
        var Year = date.year();
        var Month = date.month();
        
        return (NowYear > Year || NowMonth > Month);
    }
    
    // Server Local Time �������� �����. 
    // moment.utc()�� �ϸ� UTC ��¥�� ���� ���� ��¥���� �Ϸ� �и� �ð��� ������ ���� �߻��ؼ� ������.
    // �̰� �±������� �����Ե� �߻����� �ʾҴ� ����.
    this.GetUTCOffsetTime = function (Hour, UTCOffsetHour) {
        var Time = moment();        
        Time.set({ 'hour' : Hour - UTCOffsetHour, 'minutes' : 0, 'seconds' : 0 });
        return Time.format(this.DateTimeFormat);
    }
    
    // �ְ� ������ ���� ���� �Ǵ� ����
    // �־��� ���½ð��� ���¿���
    // �ֱ� ���� �ð��� ������ 
    // "���� ���� �ð�"�� ���Ѵ���
    // ���� �ð��� �������� "���� ���� �ð�"�� ���������� �Ǵ��Ѵ�.
    // DOW : 0�� �Ͽ���, 6�� �����
    this.ResetWeekDayHourElapsed = function (ResetDOW, ResetHourLocal, UTCOffsetHour, LastResetTime)
    {
        var CorrectedUTCNow = moment.utc().add(UTCOffsetHour, 'h');
        var CorrectedUTCLastResetTime = moment.utc(LastResetTime, this.DateTimeFormat).add(UTCOffsetHour, 'h');

        var LastResetDOW = CorrectedUTCLastResetTime.day();
        
        //console.log('LastResetDOW = ' + LastResetDOW)
        
        var NextResetTime = null;

        if (LastResetDOW < ResetDOW)
            NextResetTime = CorrectedUTCLastResetTime.day(ResetDOW).hour(ResetHourLocal).minute(0).second(0);
        else
            NextResetTime = CorrectedUTCLastResetTime.day(ResetDOW + 7).hour(ResetHourLocal).minute(0).second(0);
        
        //console.log('NextResetTime = ' + NextResetTime.toString());

        return CorrectedUTCNow.diff(NextResetTime, 'second') >= 0 ? true : false;
    }
    
    // ���� �ð��� ���������� �Ǵ��Ѵ�.(���� ���� �ð� �Ǵ�)
    this.ResetHourElapsed = function (DailyResetHourLocal, UTCOffsetHour, LastResetTime) {
        // ���� UTC + 0 �ð����� �����.
        // 1. ���� �ð��� ���� ���� �ð��� ���Ѵ�.
        // 1-1. ���� �ð��� ���� ���� �ð��� ���� �ƴϸ�
        // 1-1-1. ���� ���½ð��� �ֱ� ���� �ð��� ���ؼ�
        // 1-1-1-1. �ֱ� ���� �ð��� ���� ���½ð����� ũ�� Reset�� �� ���̹Ƿ� �ʿ����.
        // 1-1-1-2. �ֱ� ���� �ð��� ���� ���½ð����� ������ Reset�� ������ ���� ���̹Ƿ� Reset �ؾ� ��.
        // 1-2. ���� �ð��� ���� ���� �ð��� �Ѿ��ٸ�
        // 1-2-1. ���� ���½ð��� �ֱ� ���� �ð��� ���ؼ� 
        // 1-2-1-1. �ֱ� ���� �ð��� ���� ���½ð����� ũ�� Reset�� �� ���̹Ƿ� �ʿ����
        // 1-2-1-2. �ֱ� ���� �ð��� ���� ���½ð����� ������ Reset�� ������ ���� ���̹Ƿ� Reset �ؾ� ��.
        // UTC�� ���� �ð��� �����ϱ�
        var UTCCorrectedResetHour = DailyResetHourLocal - UTCOffsetHour;
        
        if (UTCCorrectedResetHour < 0)
            UTCCorrectedResetHour = 24 + UTCCorrectedResetHour;
        
        if (UTCCorrectedResetHour > 24)
            UTCCorrectedResetHour = UTCCorrectedResetHour - 24;

        var UTCNow = moment.utc();      // ���� �ð��� UTC�� ȯ���ϹǷ� ��� �����̴� ���� 
        var UTCTodayResetTime = moment.utc().set({ 'hour' : UTCCorrectedResetHour, 'minutes' : 0, 'seconds' : 0 });     
        var UTCYesterdayResetTime = moment.utc().set({ 'date' : UTCTodayResetTime.get('date') - 1, 'hour' : UTCCorrectedResetHour, 'minutes' : 0, 'seconds' : 0 });
        var UTCLastResetTime = moment.utc(LastResetTime, this.DateTimeFormat);
        
        //console.log(UTCTodayResetTime.toString());
        //console.log(UTCYesterdayResetTime.toString());

        if (UTCNow.diff(UTCTodayResetTime, 'seconds') < 0) {
            if (UTCLastResetTime.diff(UTCYesterdayResetTime, 'seconds') > 0)
                return false;
            
            return true;
        }

        if (UTCLastResetTime.diff(UTCTodayResetTime, 'seconds') > 0)
            return false;
            
        return true;
    }

    // ���� UTC �ð� �������� Offset �ð����� ������
    // ���� �ð��� �����´�.
    this.GetUTCOffsetMidnightTime = function (UTCOffsetHour) {
        return moment().utc().add(UTCOffsetHour, 'h').startOf('day').add(1, 'd').subtract(UTCOffsetHour, 'h').format(this.DateTimeFormat);
    }

    // ���� ���н�Ÿ�ӽ������� ��´�.
    // (�ʴ���)
    this.GetCurrentTimestamp = function () {
        var timestamp = Math.floor(Date.now() / 1000);
        return timestamp;
    }
    
    // Ư�� UTC + 0 �ð��� ���Ͽ� ������ ���� �ð��� �����´�.
    this.GetUTCOffsetMidnightTime2 = function (time, UTCOffsetHour) {
        var time = moment.utc(time, this.DateTimeFormat);
        return time.add(UTCOffsetHour, 'h').startOf('day').add(1, 'd').subtract(UTCOffsetHour, 'h').format(this.DateTimeFormat);
    }

}
