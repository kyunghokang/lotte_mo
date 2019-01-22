(function () { // 운영 영향도 없게 function 으로 감싸기
    // 쿠키 읽기
    function getCookie(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");

        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x = x.replace(/^\s+|\s+$/g,"");

            if (x == c_name) {
                return unescape(y);
            }
        }
    }

    // 쿠키 생성
    function setCookie(name, value, expires, path, domain, secure) {
        var today = new Date();
        today.setTime( today.getTime() );

        if (expires) { // expire 일단위
            expires = expires * 1000 * 60 * 60 * 24;
        }

        var expires_date = new Date(today.getTime() + expires);

        document.cookie = name + "=" + escape(value) +
            (expires ? ";expires=" + expires_date.toGMTString() : "") +
            (path ? ";path=" + path : "") +
            (domain ? ";domain=" + domain : "lotte.com") +
            (secure ? ";secure" : "");
    }

    // 쿠키 삭제
    function deleteCookie( cookieName ) {
        var expireDate = new Date();
          
        //어제 날짜를 쿠키 소멸 날짜로 설정한다.
        expireDate.setDate( expireDate.getDate() - 1 );          
        document.cookie = cookieName + "=" + escape(true) +";expires=" + expireDate.toGMTString() + ";path=/;domain=lotte.com";
    }

    // 파라미터 값 가져오기
    function getParam(name) {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });

        return vars[name] ? vars[name] : "";
    }

    // 수집서버에 데이터 전달
    function callTrafficCollection(data) {
        console.log("[4.0]params:", data);
        if (!getCookie("trackingServerStatus")) {
            if (typeof $ != "undefined") {
                $.post('http://analytics.lotte.com/save2', {
                    params: encodeURIComponent(JSON.stringify(data))
                })
                .success(function(){
                    deleteCookie("trackingServerStatus");
                })
                .error(function(){
                    setCookie("trackingServerStatus", false, '', "/", "lotte.com");
                });
            } else {
                console.error("jQuery 지원이 되지 않습니다.");
            }
        }else{
            console.error("tracking server fail")
        }
    }

    // uniq 난수 발생
    function getRandomKey() {
        var nowDate = new Date();
        return nowDate.getTime() + "_" + Math.floor(Math.random() * 99999);
    }

    // 4.0 수집 데이터 세팅
    var nowDate = new Date(),
        data = {
            userUniqKey: getRandomKey(),
            udid: getParam("udid"), // 사용자 UDID
            cn: getParam("cn"), // 파라미터 채널 값
            cdn: getParam("cdn"), // 파리미터 상세 채널 값
            tclick: getParam("tclick"), // 티클릭
            goods_no: getParam("goods_no"), // 상품번호
            tracking_no: getParam("tracking"), // tracking
            curdispno: getParam("curDispNo"), // 인입전시코드
            page: location.href, // 현재 페이지 경로
            datetime: // 수집된 시간
                nowDate.getFullYear() + "-" 
                + (nowDate.getMonth() + 1) + "-" 
                + nowDate.getDate() + ":"
                + nowDate.getHours() + ":"
                + nowDate.getMinutes() + ":"
                + nowDate.getSeconds(),
           // dday: nowDate.toLocaleDateString(), //
            mbrno: getCookie("MBRNO"), // 사용자번호
            siteno: getCookie("SITENO"), // 사이트 번호
            chlno: getCookie("CHLNO"), // 쿠키 채널번호
            chldtlno: getCookie("CHLDTLNO"), // 쿠키 채널 상세 번호
            browserType: navigator.userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson|LG|SAMSUNG/i) ? "Mobile" : "PC" // 브라우저 타입
        };

    // User Uniq Key Check
    if (!getCookie("lotte40UniqUserKey")) {
        setCookie("lotte40UniqUserKey", data.userUniqKey, 365, "/", "lotte.com");
    } else {
        data.userUniqKey = getCookie("lotte40UniqUserKey");
    }

    callTrafficCollection(data); // 수집 데이터 전송
})();