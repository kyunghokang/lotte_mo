
/*
	20180830 	주영남
	pub_tracking.js 는 jQuery가 없는곳에서도 로드 되므로
	jQuery 사용시 jQuery가 존재하는지를 파악후 사용하십시요.

	ex>
	if (typeof jQuery == 'function') {
		// 제이쿼리 코드 사용
	}

*/

//2017.11.24 ds_analytics.js 내용 삽입
// 2017.10.26 ga
var uiEllotteFlag = (window.location.href + "").indexOf("ellotte.com") > -1 ;

if(!uiEllotteFlag) { 
// GA
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-59563316-15', 'auto');

//2018.01.09 구글 옵티마이즈 추가
ga('require','GTM-T9NBSK7');  

//GTM
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-KCGCMBM');
}

//데이터사이언스팀 수집스크립트(담당자 : 조영우 대리)

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
   // console.log("[4.0]params:", data);

	try{
		// get new XHR object
		var newXHR;
		if (window.XMLHttpRequest) { // 모질라, 사파리등 그외 브라우저, ...
			newXHR = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE 8 이상
			newXHR = new ActiveXObject("Microsoft.XMLHTTP");
		}
		newXHR.open( 'POST', '//analytics.lotte.com/save2' );
		newXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		  
		newXHR.onreadystatechange = function (oEvent) {  
		};
		
		var formData = 'params=' + encodeURIComponent(encodeURIComponent(JSON.stringify(data)));
		// send it off
		newXHR.send( formData );
	}catch(e){}

}

// uniq 난수 발생
function getRandomKey() {
	var nowDate = new Date();
	return nowDate.getTime() + "_" + Math.floor(Math.random() * 99999);
}

/* 
 * 주문 완료 시 호출 위한 함수
 */
function ds_call(itemId){    
	// 수집 데이터 세팅
	var ord_goods_no = "";
	ord_goods_no = itemId;    ////////////////////////////////////////주문상품 
	//console.log("ord_goods_no:" + ord_goods_no);
   
	var strURL = location.href.split('?'); 
	var nowDate = new Date(),
		data = {
			userUniqKey: getRandomKey(),
			udid: getParam("udid"), // 사용자 UDID
			cn: getParam("cn"), // 파라미터 채널 값
			cdn: getParam("cdn"), // 파리미터 상세 채널 값
			tclick: getParam("tclick"), // 티클릭
			goods_no: getParam("goods_no"), // 상품번호
			ord_goods_no: ord_goods_no, /////////////////////////////////// 주문상품번호
			tracking_no: getParam("tracking"), // tracking
			curdispno: getParam("curDispNo"), // MO인입전시코드
			spdp_no: getParam("spdp_no"), // PC인입전시코드 
			disp_no: getParam("disp_no"),
      		infw_disp_no: getParam("infw_disp_no"),
      		keyword: decodeURIComponent(getParam("keyword")),   //MO 검색어
      		query: decodeURIComponent(getParam("query")),       //PC 검색어
      		requery: decodeURIComponent(getParam("requery")),   //PC 검색결과 내 검색
			page: strURL[0], // 현재 페이지 경로
			datetime: // 수집된 시간
				nowDate.getFullYear() + "-" 
				+ (nowDate.getMonth() + 1) + "-" 
				+ nowDate.getDate() + ":"
				+ nowDate.getHours() + ":"
				+ nowDate.getMinutes() + ":"
				+ nowDate.getSeconds(),
			mbrno: getCookie("MBRNO"), // 사용자번호
			siteno: getCookie("SITENO"), // 사이트 번호
			chlno: getCookie("CHLNO"), // 쿠키 채널번호
			chldtlno: getCookie("CHLDTLNO"), // 쿠키 채널 상세 번호
			gid: getCookie("_gid"), // GA 쿠키식별값
			browserType: navigator.userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson|LG|SAMSUNG/i) ? "Mobile" : "PC" // 브라우저 타입
		};  
	
	// User Uniq Key Check
	if (!getCookie("lotte40UniqUserKey")) {
		setCookie("lotte40UniqUserKey", data.userUniqKey, 365, "/", "lotte.com");
	} else {
		data.userUniqKey = getCookie("lotte40UniqUserKey");
	}

	callTrafficCollection(data); // 수집 데이터 전송
	
} //주문완료 시 호출되서 동작


/**
 * ADN 광고스크립트
 * 적용 기간 : 2018.08.30 ~ 2019.02.28
 * 2018.08.28 주영남
 */
function adAdn_load() {

	var body = document.getElementsByTagName("body")[0];

	if(jQuery('#AdnClosingad').length == 0){
		var scr = document.createElement("script");
			scr.type = "text/javascript";
			scr.id = "AdnClosingad";
			scr.async = true;
			scr.src = "//fin.rainbownine.net/js/adn_closingad_2.0.0.js";
		body.appendChild(scr);
	}

	// 20180830 ADN 클로징애드 광고코드
	window.adn_panel_param = window.adn_panel_param || [];
	window.adn_panel_param.push([{ 	
		ui:'100247',          
		ci:'1002470022',
		gi:'4577',
		h:'1^1'
	}]);

}

var uiLotteFlag = /(m|mo|mo2).lotte.com/.test(window.location.href);
if (typeof jQuery == 'function' && uiLotteFlag) {
	jQuery('document').ready(function(){
		adAdn_load(); // 20180830 ADN 광고스크립트
	});
}


/* 
 * 전 페이지 데이터 수집 함수
 */
(function () { // 운영 영향도 없게 function 으로 감싸기
    // 4.0 수집 데이터 세팅
    var strURL = location.href.split('?'); 
    var nowDate = new Date(),
        data = {
            userUniqKey: getRandomKey(),
            udid: getParam("udid"), // 사용자 UDID
            cn: getParam("cn"), // 파라미터 채널 값
            cdn: getParam("cdn"), // 파리미터 상세 채널 값
            tclick: getParam("tclick"), // 티클릭
            goods_no: getParam("goods_no"), // 상품번호
            tracking_no: getParam("tracking"), // tracking
            curdispno: getParam("curDispNo"), // MO인입전시코드
            spdp_no: getParam("spdp_no"), // PC인입전시코드 
			disp_no: getParam("disp_no"),
            infw_disp_no: getParam("infw_disp_no"),
            keyword: decodeURIComponent(getParam("keyword")),   //MO 검색어
            query: decodeURIComponent(getParam("query")),       //PC 검색어
            requery: decodeURIComponent(getParam("requery")),   //PC 검색결과 내 검색
            page: strURL[0], // 현재 페이지 경로
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
       		gid: getCookie("_gid"), // GA 쿠키식별값
            browserType: navigator.userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson|LG|SAMSUNG/i) ? "Mobile" : "PC" // 브라우저 타입
        };

    // User Uniq Key Check
    if (!getCookie("lotte40UniqUserKey")) {
        setCookie("lotte40UniqUserKey", data.userUniqKey, 365, "/", "lotte.com");
    } else {
        data.userUniqKey = getCookie("lotte40UniqUserKey");
    }

	callTrafficCollection(data); // 수집 데이터 전송
})(); //상시 호출되서 동작

/**
 * groobee 기본 스크립트
 * 적용 기간 : 2018.12.26 ~ 2019.06.26
 * 2018.12.19 고영우
 */
if (typeof jQuery == 'function'){
	(function(a,i,u,e,o) {
		a[u]=a[u]||function(){(a[u].q=a[u].q||[]).push(arguments)};e=i.createElement("script");e.async=1;
		e.charset="utf-8"; e.src="//s3.ap-northeast-2.amazonaws.com/static.groobee.io/dist/groobee_i.min.js";
		o=i.getElementsByTagName("script")[0]; o.parentNode.insertBefore(e,o);
	})(window, document, "groobee");
	groobee("serviceKey", "d700cbf9c30f4454b80cb4687019df50");
	groobee("siteType", "custom");
}

 
