// Zero-Fill
String.prototype.zf = function(l) { return '0'.string(l - this.length) + this; }
//VB-like string
String.prototype.string = function(l) { var s = '', i = 0; while (i++ < l) { s += this; } return s; }
/*
Just bear in mind there's no check for the l (length) parameter, so you must always provide a number, and finally, you must create a number prototype for it (kind of an override) in order to use it directly on numbers:
*/
Number.prototype.zf = function(l) { return this.toString().zf(l); }

// the date format prototype
Date.prototype.format = function(f)
{
    if (!this.valueOf())
        return '&nbsp;';
 
    var d = this;
 
    return f.replace(/(yyyy|mm|dd|hh|nn|ss|a\/p)/gi,
        function($1)
        {
            switch ($1)
            {
            case 'yyyy': return d.getFullYear();
            case 'mm':   return (d.getMonth() + 1).zf(2);
            case 'dd':   return d.getDate().zf(2);
            case 'hh':   return d.getHours().zf(2);
            case 'nn':   return d.getMinutes().zf(2);
            case 'ss':   return d.getSeconds().zf(2);
            case 'a/p':  return d.getHours() < 12 ? 'a' : 'p';
            }
        }  
    );
}

String.prototype.isNum = function(){
    var pattern = /^[0-9]+$/;
    return pattern.test(this);
}

// String trim
String.prototype.trim = function() { 
	return this.replace(/(^\s+)|(\s+$)/g, '');
}

// byte count ( 2byte 문자 포함 )
String.prototype.bytes = function() { 
    var str = this; 
    var len = 0;
    for (var i = 0; i < str.length; i++) {
    	len += (str.charCodeAt(i) > 128) ? 2 : 1;
    }
    return len;
}

// byte 만큼 문자열자르기
String.prototype.cut = function(len) {
    var str = this; 
    var s = 0;
    for (var i = 0; i < str.length; i++) {
        s += (str.charCodeAt(i) > 128) ? 2 : 1;
        if (s > len) {
        	return str.substring(0,i);
        }       
    }
    return str;
}

String.prototype.money = function() {
	var num = this.trim();
	while((/(-?[0-9]+)([0-9]{3})/).test(num)) {
		num = num.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
	}
	return num;
}

function limitChars(textarea, limit, infodiv) {
	str = $("#"+textarea).val();
	strlen = str.length;  
	
    var s = 0;
    for (var i = 0; i < strlen; i++) {
        s += (str.charCodeAt(i) > 128) ? 2 : 1;
        
        if (s > limit) {
        	alert('최대 '+ limit +'byte까지 입력가능합니다.');
    		
        	$("#"+textarea).val( str.cut(limit) );
    		$("#"+infodiv).html(limit);
    		return false;
        }
    }
    $("#"+infodiv).html(strlen);
    return true;
	
}

function getParameter(strParamName) {
    var strReturn = "";
    var strHref = window.location.href;
    
    if (strHref.indexOf("?") > -1) {
        var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
        var aQueryString = strQueryString.split("&");
        for (var iParam = 0; iParam < aQueryString.length; iParam++) {
            if (aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1) {
                var aParam = aQueryString[iParam].split("=");
                strReturn = aParam[1];
                break;
            }
        }
    }    
    return unescape(strReturn);
}

function fn_getServerTimer()
{
	return serverTime;
}

(function(){
	var timerObj = [];
	/*
	 * @desc : 텍스트 타입 카운터
	 * @param : etime [ 마감시간(년월일시분초) ]
	 * @param : m_cls [적용 스타일시트 클래스명]
	 * @param : func [카운트 변경 호출 함수명]
	 *
	*/
	$.fn.jsLotteCounter = function( etime, m_cls, func ) {
		var id = $(this).attr('id');

		$(this).append('<div class="restDate"></div><div class="timer '+m_cls+'"><div class="hours"><span>0</span><span>0</span></div><div class="min"><span>0</span><span>0</span></div><div class="sec"><span>0</span><span>0</span></div></div>');
		
		$syear = serverTime.slice(0,4);
		$smon = serverTime.slice(4,6);
		$sday = serverTime.slice(6,8);

		$sdate = new Date($syear * 1, $smon * 1-1, $sday * 1, serverTime.slice(8,10) * 1, serverTime.slice(10,12) * 1, serverTime.slice(12,14) * 1);
		$edate = new Date(etime.slice(0,4) * 1, etime.slice(4,6) * 1-1, etime.slice(6,8) * 1, etime.slice(8,10) * 1, etime.slice(10,12) * 1, etime.slice(12,14) * 1);

		/* init */
		$('#'+id+ '> .restDate').html( $edate - $sdate );
		changeTimer(id, $edate - $sdate);
		timerObj.push({idObj:id, funcObj:func});
		if (timerObj.length == 1)
			startTimer();
	}

	startTimer = function () {
		var timer = window.setInterval(function () {
			if (timerObj.length > 0)
			{
				var i = 0;
				var selector;
				var restDate;

				for (i; i < timerObj.length; i++)
				{
					selector = $('#'+timerObj[i].idObj+ '> .restDate');
					restDate = selector.html();
					restDate -= 1000;

					selector.html( restDate );

					if(restDate >= 0)
						timerObj[i].funcObj(timerObj[i].idObj, restDate);
					else
						timerObj.splice(i--, 1);
				}
			} else {
				clearInterval(timer);
			}
		}, 1000);
	};

	changeTimer = function (id, rd) {
		var day = Math.floor(rd / 86400000);
		var hour = Math.floor((rd - day * 86400000) / 3600000);
		var min = Math.floor((rd - ( day * 86400000 + hour * 3600000 )) / 60000);
		var sec = (rd - ( day * 86400000 + hour * 3600000 + min * 60000 )) / 1000;
		var ahour = day * 24 + hour;
		var amin = min;
		var asec = sec;

		setSpanNumber($('#'+id+ '> .timer > .hours > span:eq(0)'), setDigit(ahour).slice(0,1));
		setSpanNumber($('#'+id+ '> .timer > .hours > span:eq(1)'), setDigit(ahour).slice(1,2));
		setSpanNumber($('#'+id+ '> .timer > .min > span:eq(0)'), setDigit(amin).slice(0,1));
		setSpanNumber($('#'+id+ '> .timer > .min > span:eq(1)'), setDigit(amin).slice(1,2));
		setSpanNumber($('#'+id+ '> .timer > .sec > span:eq(0)'), setDigit(asec).slice(0,1));
		setSpanNumber($('#'+id+ '> .timer > .sec > span:eq(1)'), setDigit(asec).slice(1,2));
	};

	setDigit = function (value) { 
		return ((value + "").length < 2)?"0" + value:value + "";
	};

	setSpanNumber = function(selector, value) {
		selector.html( value );
	};
}());
