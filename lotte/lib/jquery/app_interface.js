// 디바이스 체크
function chkDevice() {
	var device = "android",
		agent = (navigator.userAgent).toLowerCase();

	if (agent.indexOf("iphone") >= 0 || agent.indexOf("ipod") >= 0 || agent.indexOf("ipad") >= 0 ) {
		device = "iOS";
	}
	return device;
}

/**
 * 앱으로 로그인아이디전송
 */
function transLoginIdToApp(div, login_id) {
	// 디바이스 별 함수 호출
	if (chkDevice() == "iOS") {
		if (div=='login') {
			// location.href = 'loginCheck://loginId/' + login_id + '?returnUrl=' + (typeof url == 'undefined' ? '' : encodeURIComponent(url) );
			var iframe = document.createElement('iframe');
			iframe.style.visibility = 'hidden';
			iframe.style.display = 'none';
			iframe.src = 'loginCheck://loginId/' + login_id;
			document.body.appendChild(iframe);
		} else {
			location.href = 'loginCheck://logout';
		}
	} else { // android
		if (div=='login') {
			if (window.loginCheck) {
				try {
					window.loginCheck.callAndroid("loginId/"+login_id);
				} catch (e) {}
			}
		} else {
			if (window.loginCheck) {
				try {
					window.loginCheck.callAndroid("logout");
				} catch (e) {}
			}
		}
	}
}

// 로그인체크
function chkLoginByApp() {
	// 디바이스 별 함수 호출
	if (chkDevice() == "iOS") {
		top.document.getElementById('storage_frame').src = 'loginCheck://isUserLogged/'+loginChk();
	} else { // android
		try {
			window.loginCheck.callAndroid(loginChk());
		} catch (e) {}
	}
}

// 앱 하단 메뉴 채널, 채널상세 번호 변경
function callChangeParamUrl(app_url) {
	// 앱버전 체크
	// 2016.10.19: 신규앱은 키워드 인코딩 안함
	// 2016.11.22: URL대신 app_url로 버전 확인
	//var newApp = false;
	//var ver, vn;

	//var ver = getUrlParams().v ? getUrlParams().v : "";
	//var vn = parseInt(ver.replace(/\./gi, ""), 10);
	/*if(app_url.indexOf("?")>=0){
		var uri = app_url.split("?");
		var params = uri[1].split("&");
		var len = params.length;
		var p;
		for(var i=0; i<len; i++){
			p = params[i];
			if(p.indexOf("v=")==0){
				ver = p.substring(2);
				vn = parseInt(ver.replace(/\./gi, ""), 10);
			}
		}
	}*/
	var url_arr;
	var $scope = getScope();
	var param_obj;
	if(app_url.indexOf("?") >= 0){
		url_arr = app_url.split("?");
		var param_obj = $scope.convertParamObject(url_arr[1]);
		/*if(param_obj.v != undefined){
			vn = parseInt(param_obj.v.replace(/\./gi, ""), 10);
		}*/
	}
	
	/*var vn = $scope.appObj.verNumber;
	if(isNaN(vn)){
		newApp = true;// 버전없으면 인코딩 안함 2016.11.22
	}else if( ! isNaN(vn) ){
		if(nativeAppInfo.isIPad){//iPAD: 2.3.1
			newApp = (vn >= 231);
		}else if(nativeAppInfo.isIOS){//iOS: 2.65.0
			newApp = (vn >= 2650);
		}else if(nativeAppInfo.isSKT){//T롯데닷컴: 2.0.9
			newApp = (vn >= 209);
		}else{//Android: 2.7.1
			newApp = (vn >= 271);
		}
	}*/
	
	if(param_obj != undefined){
		var commInitData = getNGService("commInitData");
		var comm_query = commInitData.query;
		
		// 검색 키워드 인코딩 추가 2016.10.18
		/*if(newApp==false){
			if (param_obj.keyword != undefined) {
				param_obj.keyword = encodeURIComponent(param_obj.keyword);
			}
		}*/
		
		if(param_obj.keyword != undefined){
			try{
				// $.param()에서 인코딩하므로 이전에 디코딩 처리
				param_obj.keyword = decodeURIComponent(param_obj.keyword);
			}catch(e){}
			
			// 채널코드 유지 2017.03.28
			// 검색 키워드가 있는 URL의 경우 해당 외부링크가 채널값이 없거나, 23일경우 기존 채널코드값을 유지 2017.04.10
			if(param_obj.cn == undefined || param_obj.cn == "" || param_obj.cn == "23"){
				if(comm_query.cn != undefined && comm_query.cn != ""){
					param_obj.cn = comm_query.cn;
				}
			}
		}

		
		// $.param() 함수에서 인코딩 함
		app_url = url_arr[0] + "?" + $.param(param_obj);
	}
	// 검색 키워드 인코딩 추가 2016.10.18
	/*if(newApp==false && app_url.indexOf("?")>=0){
		var uri = app_url.split("?");
		var params = uri[1].split("&");
		var len = params.length;
		var p;
		for(var i=0; i<len; i++){
			p = params[i];
			if(p.indexOf("keyword=")==0){
				params[i] = "keyword=" + encodeURIComponent(p.substring(8));
			}
		}
		app_url = uri[0] + "?" + params.join("&");
	}*/
	
	// app_url 마지막에 '&' 가 있으면 삭제
	app_url = (app_url.substring(app_url.length - 1)=="&"?app_url.substring(0, app_url.length - 2):app_url);
	// 현재 페이지의 파라메터 읽기
	var curr_url = location.href; // 현재 url 주소
	var chk_para = ["cn", "cdn"]; // 치환 파라메터 명
	var chk_idx = -1;
	var tmp_str = "";
	var param_cn = "23";

	if (curr_url.indexOf(".ellotte.com") > -1) {  //엘롯데 채널셋팅
		param_cn = "152726";
	} else if(curr_url.toLowerCase().indexOf("smp_yn=y") > -1) {  //스마트픽 채널셋팅
		param_cn = "116824";
	}

	getUrlParameter(curr_url);

	for (var i=0; i<chk_para.length; i++) {
		chk_idx = app_url.indexOf(chk_para[i]+"=");

		if (chk_idx > -1) {
			continue;
		} else {

			if (sessionStorage.getItem(chk_para[i])!=null && sessionStorage.getItem(chk_para[i])!="" ) {
				app_url = (app_url + (app_url.indexOf("?")>-1?"&":"?") + chk_para[i]+"="+sessionStorage.getItem(chk_para[i]));
			} else {
				if (chk_para[i]=="cn") {
					app_url = (app_url + (app_url.indexOf("?")>-1?"&":"?") + "cn="+param_cn);
				} else if (chk_para[i]=="cdn") {
					app_url = (app_url + (app_url.indexOf("?")>-1?"&":"?") + "cdn=");
				}
			}
		}
	}

	location.href = (app_url.split("@").join("&"));
}

// url 파라메터 반환
function getUrlParameter(req_url) {
	var url_param = "";
	var tmp_1_arr, tmp_2_arr; // 파라메터1차구분, 파라메터2차구분, 반환값
	try {
		var mainTabIdx = sessionStorage.getItem("mainTabIdx") != null ? sessionStorage.getItem("mainTabIdx") : 1;   //모바일 메인 탭
		var myHomeType = sessionStorage.getItem("myHomeType") != null ? sessionStorage.getItem("myHomeType") : "all";   //모바일 지니딜 탭
		sessionStorage.clear();

		sessionStorage.setItem("mainTabIdx" , mainTabIdx);
		sessionStorage.setItem("myHomeType" , myHomeType);
	} catch(e) {}

	if (req_url.indexOf("?") > -1) { // 사이트 주소와 파라메터가 같이 있는 경우
		url_param = req_url.substring(req_url.indexOf("?") + 1);
	} else { // 사이트 주소와 파라메터가 같이 있지 않은 경우
		url_param = req_url;
	}

	// 파라메터 명과 값이 존재할 때
	if (url_param.indexOf("=") > -1) {
		tmp_1_arr = url_param.split("&");

		for (var i=0; i<tmp_1_arr.length; i++) {
			tmp_2_arr = tmp_1_arr[i].split("=");

			if (tmp_2_arr[0] == "cn" || tmp_2_arr[0] == "cdn") {
				sessionStorage.setItem(tmp_2_arr[0], tmp_2_arr[1]);
			}
		}
	}
}

//앱 최신버전 비교 ver1:현재앱 compareVer:비교버전
function appVerChk(ver1,compareVer) {
	// ellotte_jklee16
	if (window.location.href.indexOf(".ellotte.com") >= 0) {
		return true;
	}

	var appVer = ver1.replace(/\./gi,"");

	if (parseInt(appVer) > parseInt(compareVer)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 앱 최신버전 비교 ver1:현재앱 compareVer:비교버전
 * 수정자: 이형근 (hglee63)
 * 내용: 세자리 유지하도록 수정함
 */
function appChkVer(ver1,compareVer) {
	var appVer = ver1.replace(/\./gi,"");
	while (appVer.length < 3) {
		appVer = appVer + '0';
	}
	if (appVer.length > 3) {
		appVer = appVer.substring(0, 3);
	}
	if (parseInt(appVer) > parseInt(compareVer)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 20150806 박형윤 모바일 리뉴얼 NativeApp Category 호출 Interface
 */
// Get URL Parameters
function getUrlParams() {
	var params = {};

	if (location.search) {
		var parts = location.search.substring(1).split('&');

		for (var i = 0; i < parts.length; i++) {
			var nv = parts[i].split('=');
			if (!nv[0]) continue;
			params[nv[0]] = nv[1] || null;
		}
	}
	return params;
}

// Set Cookie
function setCookie(name, value, days, path) {
	var expires;
	path = path ? "; path=" + path : "";

	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	} else {
		expires = "";
	}

	document.cookie = escape(name) + "=" + escape(value) + expires + path;
}

// Get Cookie
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
};

// Get Default URL Parameters
function getBaseParams() {
	var params = getUrlParams(),
		baseParam = "";

	if (!params.udid && getCookie("UDID")) {
		params.udid = getCookie("UDID");
	}

	if (!params.cn && getCookie("CHLNO")) {
		params.cn = getCookie("CHLNO");
	}

	if (!params.cdn && getCookie("CHLDTLNO")) {
		params.cdn = getCookie("CHLDTLNO");
	}

	baseParam += "c=" + (params.c ? params.c : "");
	baseParam += "&udid=" + (params.udid ? params.udid : ""); // 사용자 UDID
	baseParam += "&v=" + (params.v ? params.v : ""); // APP 버전
	baseParam += "&cn=" + (params.cn ? params.cn : ""); // 채널값
	baseParam += "&cdn=" + (params.cdn ? params.cdn : ""); // 채널 상세 번호
	baseParam += "&schema=" + (params.schema ? params.schema : ""); // APP Schema

	return baseParam;
}

// Const Protocol 정의
var appProtocol = {
	base : "http://",
	secure : "https://"
};

if (location.host.indexOf("m.lotte.com") == -1) { // 운영서버가 아닐 경우 https 사용 안함
	appProtocol.secure = "http://";
}

// Const 이동 URL - location.host 는 port 넘버까지 넘어옴 (포트번호가 없을 경우 안넘어옴)
var appURLObj = {
	baseUrl : appProtocol.base + location.host, // 기본 경로
	tclickUrl : appProtocol.base + location.host + "/exevent/tclick.jsp", // Tclick 수집 IFrame URL

	mainUrl : appProtocol.base + location.host + "/main.do", // 메인
	cateMidAngul : appProtocol.base + location.host + "/category/m/cate_mid_list_anglr.do", // 카테고리
	cateMidBeauty : appProtocol.base + location.host + "/category/m/cate_beauty_list.do", // 명품화장품 카테고리
	// brandShopUrl : appProtocol.base + location.host + "/category/m/cate_brand_main.do", // 브랜드
	brandShopUrl : appProtocol.base + location.host + "/category/m/brand_prod_list.do", // 브랜드
	prdlstUrl : appProtocol.base + location.host + "/product/m/product_list.do", // 기획전
	prdviewUrl : appProtocol.base + location.host + "/product/m/product_view.do", // 상품 상세

	ordLstUrl : appProtocol.secure + location.host + "/mylotte/purchase/m/purchase_list.do", // 주문/배송 조회
	ordCancelUrl : appProtocol.secure + location.host + "/mylotte/purchase/m/purchase_list.do", // 주문취소
	cateLstUrl : appProtocol.base + location.host + "/mylotte/cart/m/cart_list.do", // 장바구니
	wishLstUrl : appProtocol.base + location.host + "/mylotte/wish/m/wish_list.do", // 위시리스트

	loginUrl : appProtocol.secure + location.host + "/login/m/loginForm.do", // 로그인
	mylotteUrl : appProtocol.base + location.host + "/mylotte/m/mylotte.do", // 마이롯데
	myLPointUrl : appProtocol.secure + location.host + "/mylotte/pointcoupon/m/point_info.do", // L.POINT
	myLMoneyUrl : appProtocol.secure + location.host + "/mylotte/pointcoupon/m/point_info.do", // L-money
	myCouponUrl : appProtocol.secure + location.host + "/mylotte/pointcoupon/m/point_info.do", // 쿠폰
	gdBenefitUrl : appProtocol.base + location.host + "/mylotte/sub/soGoodBenefit.do", // 참좋은혜택
	smartAlarmUrl : appProtocol.base + location.host + "/planshop/m/smartAlarmList.do", // 스마트 알림
	smartpayUrl : appProtocol.secure + location.host + "/mylotte/smartpay/m/smartpay.do", // 스마트 페이

	customerCenterUrl : appProtocol.base + location.host + "/custcenter/cscenter_main.do", // 고객센터
	questionUrl : appProtocol.base + location.host + "/custcenter/m/question.do", // 1:1 문의하기
	chattingUrl : appProtocol.base + location.host + "/talk/main/talk_main.do", // 채팅상담
	lateProdUrl : appProtocol.base + location.host + "/product/m/late_view_product_list.do", // 최근 본 상품

	tLotteBenefitUrl: appProtocol.base + location.host + "/planshop/m/planshop_view.do", // t롯데닷컴 혜택안내
	stylePushUrl: appProtocol.secure + location.host + "/search/m/style_push.do", // 스타일 푸시 검색결과 리스트
	
	petMallMainUrl: appProtocol.secure + location.host + "/mall/pet/dearpet_main.do", // 디어펫 메인
	mitouMainUrl: appProtocol.secure + location.host + "/mall/pet/mitou_main.do" // 미미뚜뚜 메인
};

/*
 * 카테고리 이동 (모바일은 현재 중카 이동만 존재함)
 * Params
 * - curDispNo : 카테고리 번호 (필수)
 * - title : 카테고리명 (필수)
 * - tclick : TCLICK 명 (선택)
 */
function goCategory(curDispNo, title, tclick) {
	if (!curDispNo || !title) { // 유효성 체크
		alert("잘못된 카테고리입니다.");
		return false;
	}

	var targetURL = appURLObj.cateMidAngul + "?" + getBaseParams();
	
	//명품화장품 카테고리 추가
	if(curDispNo == '5537279' || curDispNo == '5537965'){
		targetURL = appURLObj.cateMidBeauty + "?" + getBaseParams();
	}
	
	if (!tclick) { // tclick setting
		tclick = "m_side_cate_catebig_" + curDispNo;
	}

	targetURL += "&cateDiv=MIDDLE";
	targetURL += "&curDispNo=" + curDispNo;
	targetURL += "&title=" + cateName;
	targetURL += "&tclick=" + tclick;

	window.location.href = targetURL;
}

/*
 * 브랜드 이동
 * Params
 * - disp_no : 브랜드 번호 (필수)
 * - dispLrgNm : 브랜드 상위 카테고리명 (선택)
 * - tclick : TCLICK 명 (선택)
 */
function goBrand(disp_no, dispLrgNm, tclick) {
	if (!disp_no) { // 유효성 체크
		alert("잘못된 브랜드입니다.");
		return false;
	}

	var targetURL = appURLObj.brandShopUrl + "?" + getBaseParams();
	
	if (!tclick) { // tclick setting
		tclick = "m_side_brand_" + disp_no;
	}

	targetURL += "&curDispNo=" + disp_no;
	targetURL += "&dispLrgNm=" + dispLrgNm;
	targetURL += "&tclick=" + tclick;

	window.location.href = targetURL;
}

/*
 * 기획전 이동
 * Params
 * - curDispNo : 기획전 번호 (필수)
 * - tclick : TCLICK 명 (선택)
 */
function goPlanshop(curDispNo, tclick) {
	if (!curDispNo) { // 유효성 체크
		alert("잘못된 기획전입니다.");
		return false;
	}

	var targetURL = appURLObj.planShopUrl + "?" + getBaseParams();
	
	if (!tclick) { // tclick setting
		tclick = "m_side_planshop_cate_" + curDispNo;
	}

	targetURL += "&curDispNo=" + curDispNo;
	targetURL += "&tclick=" + tclick;

	window.location.href = targetURL;
}

/**
 * 20150907 박형윤 Renew Interface 재정의
 */

/**
 * 넘어온 URL에 Base Parameter 붙여서 링크 이동
 * @param {string} url - url parameter를 제외한 기본 URL
 * @param {object} params - parameter object
 */
function appGoPageBaseParams(url, params) {
	if (!url)
		return false;

	var parmasArr = [];
	parmasArr.push(getBaseParams());

	for (var k in params) {
		if (params[k])
			parmasArr.push(k + "=" + params[k]);
	}

	url += (url + "").indexOf("?") > -1 ? "&" : "?";
	url += parmasArr.join("&");

	window.location.href = url;
}

// 전시 관련 API
/**
 * Tclick 수집
 * @param {string} tclick - tclick 명 (필수)
 */
var tclickTestTimeout = null;

function appTclick(tclick) {
	var tclickIframe = document.getElementById("tclick_iframe");

	if (tclickIframe && tclickIframe.contentDocument && tclick) { // 유효성 검증
		tclickIframe.contentDocument.location.replace(appURLObj.tclickUrl + "?tclick=" + tclick);
	}

	/* APP TCLICK Test 코드
	if (location.host.indexOf("m.lotte.com") == -1) {
		$toastMsgAlert = null;

		if ($("#toastMstAlertWrap").length == 0) {
			$toastMsgAlert = $('<div id="toastMstAlertWrap" style="display:none;position:fixed;bottom:100px;left:50%;width:300px;margin:0 -150px;line-height:50px;color:#fff;font-size:14px;font-weight:bold;text-align:center;background-color:rgba(0,0,0,.8);border-radius:15px;">tclick 영역</div>');
			$("body").append($toastMsgAlert);
		} else {
			$toastMsgAlert = $("#toastMstAlertWrap");
		}

		$toastMsgAlert.text(tclick).show().fadeIn(300);

		clearTimeout(tclickTestTimeout);

		tclickTestTimeout = setTimeout(function () {
			$toastMsgAlert.fadeOut(300);
		}, 1500);
	}
	*/
}

/**
 * 메인 페이지 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoMain(tclick) {
	try { // iOS 개인정보 보호 모드시 sessionStorage를 사용할 경우 Exception 발생으로 예외처리
		sessionStorage.clear();
	} catch (e) {}

	appGoPageBaseParams(appURLObj.mainUrl, { tclick : tclick });
}

/**
 * 전문관 이동
 * @param {string} url - 전문관 이동 URL (필수)
 * @param {boolean} outlinkFlag - OutLink 여부 (필수)
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoMall(url, outlinkFlag, tclick) {
	if (!url) // 유효성 검증
		return false;

	if (outlinkFlag && outlinkFlag != "false") {
		var uri = url.replace(/http\:\/\/|https\:\/\//gi, "");

		if (chkDevice() == "iOS") {
			if (url.match("https://")) {
				window.location = "family://" + uri;
			} else {
				window.location = "lecsplatform://" + encodeURIComponent(uri);
			}
		} else {
			try {
				window.lecsplatform.callAndroid(encodeURIComponent(url));
			} catch (e) {}
		}

		if (tclick) {
			appTclick(tclick);
		}
	} else {
		//lotte_side_ctg가 절대경로로 수정되어 baseUrl 삭제 - rudolph:151127
//		if (url.indexOf(appURLObj.baseUrl + "/") == 0) {
//			url = appURLObj.baseUrl + "/" + url;
//		}

		appGoPageBaseParams(url, { tclick : tclick });
	}
}

/**
 * 카테고리(중카) 이동
 * @param {string} curDispNo - 카테고리 전시 번호 (필수)
 * @param {string} title - 카테고리명 (필수)
 * @param {string} tclick - tclick 코드 (선택)
 */
function appGoCategory(curDispNo, title, tclick) {
	if (!curDispNo || !title) // 유효성 검증
		return false;
	
	//명품화장품 카테고리 추가
	var targetURL = appURLObj.cateMidAngul;
	
	if(curDispNo == '5537279' || curDispNo == '5537965'){
		targetURL = appURLObj.cateMidBeauty;
	}
	// 애완용품인 경우 디어펫으로 이동
	if(curDispNo == '5548848'){
		appGoPageBaseParams(appURLObj.mitouMainUrl, {
			dispNo: '5553935',
			tclick: tclick
		});
	}else{
		appGoPageBaseParams(targetURL, {
			curDispNo : curDispNo,
			title : title,
			cateDiv : "MIDDLE",
			tclick : tclick
		});
	}
}

/**
 * 카테고리/전문몰 이동 공통 - 201603 모바일 리뉴얼 신규
 * @param {string} type - ctg : 카테고리, mall : 전문몰
 * @param {string} name - 카테고리명
 * @param {string} link - 카테고리일 경우 카테고리 번호, 전문몰일 경우 링크 경로
 * @param {boolean} outlink - 외부링크 여부 (true/false)
 * @param {string} tclick - tclick
 */
function appGoCtgMall(type, name, link, outlink, tclick) {
	if (type == "ctg") {
		appGoCategory(link, name, tclick);
	} else {
		var tclick = "m_RDC_side_cate_specialshop_";

		switch (name) {
			case "롯데 브랜드관": tclick += "LotteBrand"; break;
			case "미미뚜뚜": tclick += "petshop"; break;
			case "특별한 맛남": tclick += "Specialfood"; break;
			case "LEGO": tclick += "LEGO"; break;
			case "빅사이즈": tclick += "Bigsize"; break;
			case "도서": tclick += "Book"; break;
			case "K.shop": tclick += "Kshop"; break;
			case "GUCCI": tclick += "Gucci"; break;
			case "텐바이텐": tclick += "10x10"; break;
			case "1200m": tclick += "1200m"; break;
			case "1300k": tclick += "1300k"; break;
			case "Vine": tclick += "Vine"; break;
			case "kokdeal": tclick += "Kokdeal"; break;
			case "맞춤셔츠": tclick += "customshirts"; break; //20160629 추가
			case "위즈위드": tclick += "WIZWID"; break;
			case "TV아울렛": tclick += "Loutlets"; break; //20170103 추가
			case "두피전문관": tclick += "scalpcare"; break; //20170317 추가
			case "쌤소나이트": tclick += "samsonite"; break; //20170418 추가
            case "아모레퍼시픽": tclick += "amorepacific"; break; //20170518 추가
			case "몽블랑": tclick += "montblanc"; break;
			case "브라이튼몰": tclick += "brightonmall"; break;/*2017.07.27 추가*/
			case "스타일샵": tclick += "styleshop"; break;/*2017.07.27 추가*/
		}

		if (nativeAppInfo.isSKT) {
			tclick += "_tlotte";
		} else if (nativeAppInfo.isIOS) {
			tclick += "_ios";
		} else {
			tclick += "_and";
		}

		appGoMall(link, outlink, tclick);
	}
}

/**
 * 브랜드 이동
 * @param {string} brandNo - 브랜드 전시 번호 (필수)
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoBrand(brandNo, tclick) {
	if (!brandNo) // 유효성 검증
		return false;

	appGoPageBaseParams(appURLObj.brandShopUrl, {
		upBrdNo : brandNo,
		idx : 1,
		tclick : tclick
	});
}

/**
 * 상품상세 이동
 * @param {string} goods_no - 상품전시번호 (필수)
 * @param {string} curDispNo - 상위전시 카테고리 번호 (매출집계를 해야하는 경우 필수)
 * @param {string} curDispNoSctCd - 인입전시코드 (매출집계를 해야하는 경우 필수)
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoProductDetail(goods_no, curDispNo, curDispNoSctCd, tclick) {
	if (!goods_no) // 유효성 검증
		return false;

	appGoPageBaseParams(appURLObj.prdviewUrl, {
		goods_no : goods_no,
		curDispNo : curDispNo,
		curDispNoSctCd : curDispNoSctCd,
		tclick : tclick
	});
}

/**
 * 기획전 이동
 * @param {string} curDispNo - 기획전 전시 번호 (필수)
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoPlanshop(curDispNo, tclick) {
	if (!curDispNo) // 유효성 검증
		return false;

	appGoPageBaseParams(appURLObj.prdlstUrl, {
		curDispNo : curDispNo,
		tclick : tclick
	});
}

// 주문서 관련 API
/**
 * 주문배송 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoOrderDelivery(tclick) {
	appGoPageBaseParams(appURLObj.ordLstUrl, {
		fromPg : 3,
		ordListCase : 1,
		tclick : tclick
	});
}

/**
 * 주문취소 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoOrderCancel(tclick) {
	appGoPageBaseParams(appURLObj.ordCancelUrl, {
		fromPg : 3,
		ordListCase : 3,
		tclick : tclick
	});
}

/**
 * 장바구니 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoOrderCart(tclick) {
	appGoPageBaseParams(appURLObj.cateLstUrl, {
		tclick : tclick
	});
}

/**
 * 위시리스트 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoWish(tclick) {
	appGoPageBaseParams(appURLObj.wishLstUrl, {
		tclick : tclick
	});
}

/**
 * 로그인 페이지 이동
 * @param {string} targetUrl - 로그인 후 이동될 페이지 *URI Encode 하지 말 것! (선택)
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoLogin(targetUrl, tclick) {
	if (!targetUrl) {
		targetUrl = appURLObj.mainUrl;
	}

	appGoPageBaseParams(appURLObj.loginUrl, {
		targetUrl : encodeURIComponent(targetUrl),
		tclick : tclick
	});
}

// 마이롯데 관련 API
/**
 * 마이롯데 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoMyLotte(tclick) {
	appGoPageBaseParams(appURLObj.mylotteUrl, {
		tclick : tclick
	});
}

/**
 * L.POINT 내역 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoLPoint(tclick) {
	appGoPageBaseParams(appURLObj.myLPointUrl, {
		point_div : "lt_point",
		tclick : tclick
	});
}

/**
 * L-money 내역 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoLMoney(tclick) {
	appGoPageBaseParams(appURLObj.myLMoneyUrl, {
		point_div : "l_point",
		tclick : tclick
	});
}

/**
 * 쿠폰내역 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoCoupon(tclick) {
	appGoPageBaseParams(appURLObj.myCouponUrl, {
		point_div : "coupon",
		tclick : tclick
	});
}

/**
 * 참좋은 혜택 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoBenefit(tclick) {
	appGoPageBaseParams(appURLObj.gdBenefitUrl, {
		tclick : tclick
	});
}

/**
 * 스마트 알림 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoSmartNoti(tclick) {
	appGoPageBaseParams(appURLObj.smartAlarmUrl, {
		curDispNoSctCd : 22,
		tclick : tclick
	});
}

/**
 * 스마트페이 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoSmartPay(tclick) {
	appGoPageBaseParams(appURLObj.smartpayUrl, {
		tclick : tclick
	});
}

// 고객센터 관련 API
/**
 * 고객센터 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoCustomerCenter(tclick) {
	appGoPageBaseParams(appURLObj.customerCenterUrl, {
		tclick : tclick
	});
}

/**
 * 1:1 문의하기 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoQNA(tclick) {
	appGoPageBaseParams(appURLObj.questionUrl, {
		tclick : tclick
	});
}

/**
 * 채팅 페이지 이동
 *
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoChatting(tclick) {
	appGoPageBaseParams(appURLObj.chattingUrl, {
		tclick : tclick
	});
}

// 기타 API
/**
 * 최근본 상품
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoRecentProduct(tclick) {
	var lateProdItem = null;
	try { // Safari 개인정보보호모드에서는 localStorage 접근시 Exception 발생으로 예외처리
		lateProdItem = localStorage.getItem("viewGoods");
	} catch (e) {}

	appGoPageBaseParams(appURLObj.lateProdUrl, {
		viewGoods : lateProdItem,
		tclick : tclick
	});
}

/**
 * lotteApp 앱 실행
 */
var appAppInfoObj = {
	lotte : { // 롯데닷컴 앱
		iphoneStoreUrl: "http://itunes.apple.com/app/id376622474?mt=8", // iPhone appStore URL
		iphoneScheme: "mlotte001", // iPhone Scheme
		//iphoneScheme: "mlotte001://m.lotte.com/main.do?cn=23&cdn=537217", // iPhone Scheme
		ipadStoreUrl: "http://itunes.apple.com/app/id447799601?&mt=8", // iPad appStore URL
		ipadScheme: "mlotte003", // iPad Scheme
		//ipadScheme: "mlotte003://m.lotte.com/main.do?cn=145524&cdn=2911590", // iPad Scheme
		//androidScheme: "intent://m.lotte.com/main.do?cn=23&cdn=537217#Intent;scheme=mlotte001;action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;category=android.intent.category.BROWSABLE;package=com.lotte;end" // Android Scheme
		androidScheme: "intent://m.lotte.com/main.do?cn=23&cdn=537217#Intent;scheme=mlotte001;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte;end" // Android Scheme
	},
	ellotte : { // 엘롯데 앱
		iphoneStoreUrl: "http://itunes.apple.com/kr/app/id902962633?mt=8", // iPhone appStore URL
		iphoneScheme: "ellotte001",
		//iphoneScheme: "ellotte001://m.ellotte.com/main.do?cn=152726&cdn=3112669", // iPhone Scheme
		androidScheme: "intent://m.ellotte.com/main.do?cn=152726&cdn=3112669#Intent;scheme=ellotte002;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.ellotte;end" // Android Scheme
	},
	smp : { // 스마트픽 앱
		iphoneStoreUrl: "https://itunes.apple.com/app/id483508898", // iPhone appStore URL
		iphoneScheme: "splotte001", // iPhone Scheme
		//iphoneScheme: "splotte001://m.lotte.com/main_smp.do?cn=116824&cdn=601848&smp_yn=Y", // iPhone Scheme
		androidScheme: "intent://m.lotte.com/main_smp.do?cn=116824&cdn=601848&smp_yn=Y#Intent;scheme=splotte002a;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.smartpick2a;end" // Android Scheme
	},
	lottedfs : { // 롯데면세점 앱
		iphoneStoreUrl: "https://itunes.apple.com/app/losdemyeonsejeom/id492083651?mt=8", // iPhone appStore URL
		iphoneScheme: "lottedfs", // iPhone Scheme
		//iphoneScheme: "lottedfs://m.lottedfs.com/handler/Index?CHANNEL_CD=303396", // iPhone Scheme
		androidScheme: "intent://chindex#Intent;scheme=lottedutyfree;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.lottedutyfree;end" // Android Scheme
	},
	lottesuper : { // 롯데슈퍼 앱
		iphoneStoreUrl: "https://itunes.apple.com/app/losdemobailsyupeo/id618095243?mt=8", // iPhone appStore URL
		iphoneScheme: "lottesuper", // iPhone Scheme
		//iphoneScheme: "lottesuper://order?redirect=http://m.lottesuper.co.kr/handler/Index-Start?CHL_NO=M385701&AFCR_NO=110682", // iPhone Scheme
		androidScheme: "intent://order?redirect=http://m.lottesuper.co.kr/handler/Index-Start?CHL_NO=M385701&AFCR_NO=110682#Intent;scheme=lottesuper;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lottesuper.mobile;end" // Android Scheme
	}
};

/**
 * NativeApp 세분화
 */
 var nativeAppInfo = {
	isAndroid : false,
	isSKT : false,
	isIOS : false,
	isIPhone : false,
	isIPad : false,
	isIPod : false
 };

function getNativeInfo() {
    var ua = (navigator.userAgent).toLowerCase();

    /**
     * Native 앱 여부 확인
     * mlotte001 : 닷컴 AOS/iPhone
     * sklotte001 : 닷컴(SKT) AOS
     * mlotte003 : 닷컴 iPad
     **/
    nativeAppInfo.isApp = /mlotte001|sklotte001|mlotte003/gi.test(ua);
    nativeAppInfo.isSKT = /sklotte001/gi.test(ua);

    // Native APP 여부가 아닌 OS 구분
    nativeAppInfo.isAndroid = /android/gi.test(ua);
    nativeAppInfo.isIOS = /iphone|ipad/gi.test(ua);
    nativeAppInfo.isIPhone = /iphone/gi.test(ua);
    nativeAppInfo.isIPad = /ipad/gi.test(ua);

    // 버전 정보 확인
    // var sampleUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 mlotte001/2.73.0 udid/3bf8ee2f64fcf5d3ebb71ea410c614d4a5e8babce59fd99d9f08cda21f14c4bc talk/";
    // var uaStr = sampleUA;
    var uaStr = ua,
        versionChk = uaStr.match(/(mlotte001|mlotte003|sklotte001)\/([0-9\.])+/gi),
        versionNum = 0;

    if (versionChk && versionChk.length > 0) {
        versionNum = parseInt(versionChk[0].replace(/(mlotte001|mlotte003|sklotte001)\/|\./gi, ""));
    }

    nativeAppInfo.versionNum = versionNum;
}

getNativeInfo(); // Native 정보 읽어오기

/**
 * 계열사 앱 실행 (NativeApp 이 아닐 경우에는(웹) 해당 Function 을 사용하지 않는다.)
 * @param {string} appName - 앱명 (필수)
 * @param {string} schema - 현재 닷컴/엘롯데/T롯데닷컴 앱스키마정보 (필수)
 * Schema 정보
 * iOS - 롯데닷컴 : mlotte001, 롯데닷컴 for iPad : mlotte003, 엘롯데 : ellotte001, 스마트픽 : splotte001
 * Android - 롯데닷컴: mlotte001, 롯데닷컴 for SKT : sklotte001, 엘롯데 : ellotte002, 스마트픽 : splotte002a
 * @param {string} tclick - tclick 명 (선택)
 */
function appExecApp(appName, schema, tclick) {
	if (!appName) {
		return false;
	}

	var tclick = "m_RDC_side_cate_outlink_";

	switch (appName) {
		case "ellotte": // 엘롯데
			tclick += "ellotte";
			break;
		case "smp": // 스마트픽
			tclick += "smartpick";
			break;
		case "uniqlo": // 유니클로
			tclick += "uniqlo";
			break;
		case "lottesuper": // 롯데슈퍼
			tclick += "lottesuper";
			break;
	}

	if (nativeAppInfo.isSKT) {
		tclick += "_tlotte";
	} else if (nativeAppInfo.isIOS) {
		tclick += "_ios";
	} else {
		tclick += "_and";
	}

	if (appName == "uniqlo") { // 유니클로 예외처리
		appGoMall("http://www.uniqlo.kr/", true, tclick);
		return false;
	}

	var appCallUrl = "";

	if (nativeAppInfo.isAndroid) { // Android 일때
		appCallUrl = appAppInfoObj[appName].androidScheme;
	} else if (nativeAppInfo.isIOS) { // iOS 일때
		var iOSScheme = appAppInfoObj[appName].iphoneScheme;

		if (nativeAppInfo.isIPad && appAppInfoObj[appName].ipadStoreUrl && appAppInfoObj[appName].ipadScheme) { // iPad 일때
			iOSScheme = appAppInfoObj[appName].ipadScheme;
		}

		appCallUrl = "appScheme://callApp/?" + iOSScheme;
		appCallUrl += "|" + appAppInfoObj[appName].iphoneStoreUrl;
		appCallUrl += "|" + (appAppInfoObj[appName].ipadStoreUrl ? appAppInfoObj[appName].ipadStoreUrl : appAppInfoObj[appName].iphoneStoreUrl);
	}

	window.location = appCallUrl;

	if (tclick) {
		appTclick(tclick);
	}
}

/**
 * 작성일: 2015년 11월 11일
 * 작성자: 이형근(hglee63)
 * 
 * 최신버전 앱인지 판단. 기준은 파라미터 'v'와 'schema'
 * /ellotte/lib/jquery/app_interface.js와 내용 다르니 주의할 것
 * 
 * 모바일 리뉴얼프로젝트 오픈시점 기준으로 앱의 버전은 다음처럼 확정되었음.
 * 	- 안드로이드 롯데닷컴: 2.5.0
 *  - 안드로이드 T롯데닷컴: 1.5.0
 *  - 안드로이드 엘롯데: 1.5.0
 *  - IOS 롯데닷컴: 2.5.0
 *  - IOS 엘롯데: 1.5.0
 *  - IPAD 롯데닷컴: 1.5.0
 * 
 * @return boolean
 */
function isNewestApp() {
	var v = getUrlParams().v ? getUrlParams().v : null;

	if (v == null || typeof v == 'undefined') {
		console.warn('parameter "v" is missing');
		return;
	}

	var AND_DOTCOM = '249';
	var AND_SKT = '149';
	var IOS_DOTCOM = '249';
	var IPAD = '149';
	return ((nativeAppInfo.isAndroid && appChkVer(v, AND_DOTCOM))
			|| (nativeAppInfo.isAndroid && nativeAppInfo.isSKT && appChkVer(v, AND_SKT))
			|| (nativeAppInfo.isIPhone && appChkVer(v, IOS_DOTCOM))
			|| (nativeAppInfo.isIPad && appChkVer(v, IPAD))) 
					? true : false;
}

/**
 * 네이티브 팝업 열기
 * 버전 체크 네이티브 팝업 혹은 새 창(브라우저)을 연다.
 * 
 * @param String title 팝업 타이틀
 * @param String url 페이지 경로
 */
function openNativePopup(title, url) {
	if (chkDevice() == 'android') {
		if (isNewestApp()) {
			try {
				window.lottebridge.popup(title, url);
			} catch (e) {}
		} else {
			try {
				window.lecsplatform.callAndroid(encodeURIComponent(url));
			} catch (e) {}
		}
	} else if (chkDevice() == 'iOS') {
		if (isNewestApp()) {
			location.href = 'lottebridge://popup?title=' + title + '&url=' + url;
		} else {
			if(url.match("https://")) {
				url = url.replace("https://", "");
				window.location = "family://" + url;
			} else if(url.match("http://")) {
				url = url.replace("http://", "");
				window.location = "lecsplatform://" + encodeURIComponent(url);
			}
		}
	}
}

/**
 * 좌측 카테고리 레이어 열기 및 해당 탭 활성화
 * 
 * @param String tabName 탭 명
 * @return
 */
function openSideCategoryMenu(tabName) {
	if (chkDevice() == 'android') {
		try {
			window.lottebridge.showleftmenu(tabName);
		} catch (e) {}
	} else if (chkDevice() == 'iOS') {
		location.href = 'lottebridge://showleftmenu/'+tabName;
	}
}

/**
 * T롯데닷컴 T혜택안내 페이지 이동
 *
 * @param {string} sktno 고객 전화번호 (SKT Number)
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoTBenefit(sktno, tclick) {
	appGoPageBaseParams(appURLObj.tLotteBenefitUrl, {
		spdp_no: "5374743",
		tstore_yn: "Y",
		sktno: sktno,
		tclick: tclick
	});
}

function getLoginInfo() {
	var loginInfo = null;

	try {
		loginInfo = JSON.parse(sessionStorage.getItem("ngStorage-LotteUserService_loginCheck"));
	} catch (e) {}

	return loginInfo;
}

function loginChk() {
	var loginInfo = getLoginInfo(),
		rtnBoolean = false;

	if (loginInfo && loginInfo.isLogin) {
		rtnBoolean = loginInfo.isLogin;
	}

	return rtnBoolean;
}

/**
 * 사용자 정보 앱에 전달
 */
function getUserInfo() {
	var name = "", 
		mbr_no = "", 
		site_no = "", 
		mbr_nm = "", 
		login_id = "", 
		chl_no = "", 
		chl_dtl_no = "", 
		grade_cd = "", 
		cart_info = "", 
		loginInfo = {}, 
		isLogin = false, 
		isStaffYN = false,
		returnVal = "";

	loginInfo = getLoginInfo();

	mbr_no = getCookie("MBRNO_M");
	site_no = getCookie("SITENO");
	mbr_nm = getCookie("MBRNM");
	login_id = getCookie("LOGINID");
	chl_no = getCookie("CHLNO");
	chl_dtl_no = getCookie("CHLDTLNO");
	grade_cd = getCookie("GRADECD");
	cart_info = getCookie("CARTINFO");

	if (loginInfo && loginInfo.isLogin) {
		isLogin = loginInfo.isLogin;
		name = loginInfo.name;
		isStaffYN = loginInfo.isStaff;
	}

	returnVal += "name=" + encodeURIComponent(name + (isStaffYN ? " 임직원" : ""));
	returnVal += "&mbr_no=" + encodeURIComponent(mbr_no);
	returnVal += "&site_no=" + site_no;
	returnVal += "&mbr_nm=" + encodeURIComponent(mbr_nm);
	returnVal += "&login_id=" + encodeURIComponent(login_id);
	returnVal += "&chl_no=" + chl_no;
	returnVal += "&chl_dtl_no=" + chl_dtl_no;
	returnVal += "&grade_cd=" + encodeURIComponent(grade_cd);

	if (!isLogin) {
		returnVal += "&cart_info=" + encodeURIComponent(cart_info);
	}

	return returnVal;
}


/**
 * 이미지 검색 Callback Func.
 */
function callbackImgSearch(uuid, rid, accessToken, cat1Name, cat2Name, imgPath) {
	try {
		if (imgPath) {
			$("body[ng-controller='StylePushIntroCtrl']").scope().$apply(function () {
				$("body[ng-controller='StylePushIntroCtrl']").scope().captureImg = "https://c-lottedotcom-g.oddconcepts.kr" + imgPath;
			}, 100);
		}
	} catch (e) {}

	setTimeout(function () {
		appGoPageBaseParams(appURLObj.stylePushUrl, {
			uuid: uuid,
			rid: rid,
			accessToken: accessToken,
			cat1Name: cat1Name,
			cat2Name: cat2Name,
			imgPath: encodeURIComponent(imgPath)
		});
	}, 500);
}

/**
 * Touch ID Callback Func.
 * @param {boolean} true/false 성공 여부
 */
function callbackTouchID(result) { // 지문인식 성공 여부 Callback
	if (result === true) { // 성공시
		try {
			angular.element("#lotteLoginFormCont").scope().fingerPrintLogin();
			//$("#lotteLoginFormCont").scope().fingerPrintLogin();
		} catch (e) {}
	}
}

/**
 * 20160129 박형윤 크리터시즘 오류 예외처리
 */
function checkDomStatus() {
	return true;
}

/**
 * 동영상 자동재생 설정여부, 망(3G,LTE,Wifi)상태 앱에서 호출받는 함수
 */
var movAutoPlayFlag = 2, // 자동플레이 플레그(0:자동재생함, 1:Wifi만 자동재생, 2:사용안함)
    netConditionFlag = false; // 망(3G,LTE,Wifi)상태(true:Wifi, false:3G,LTE)
var vod_useScroll = true; //스크롤 이벤트 사용여부
function movAutoPlaylCheck(autoplay, netCondition) {
	
	// 설정 상세화 이전 방어 코딩
	if (autoplay === true) { // true:자동재생함이므로 0으로 변경
		autoplay = 0;
	}else if (autoplay === false) { // false:사용안함이므로 2으로 변경
		autoplay =2;
	}
	
    movAutoPlayFlag = autoplay, // 자동재생설정 여부
    netConditionFlag = netCondition; // 망 상태 확인 여부
}
/* 동영상 자동재생 스크롤 값에 따른 실행 함수 */
function autoVideoPlay(videoById, videoSlctId, movFirstSetupFlag, setAutoPlay, prdAutoPlay, fixedMovie) { //fixedMovie : 동영상이 fixed로 배치되어 분기처리
    var videoJavaId = document.getElementById(videoById), // 비디오 이벤트 위한 선택자
        $videoId = $(videoSlctId); // 비디오 제이쿼리 위한 선택자

	if ($videoId.length > 0) { // 탭 빠른이동 방어코딩
	    var videoPlayWrap = $videoId.parent(), // 비디오 플레이 버튼 선택자
	    	videoPlayBtn = $videoId.siblings('.btn_move_start'), // 비디오 플레이 버튼 선택자
	        videoStopBtn = $videoId.siblings('.btn_move_stop'), // 비디오 스탑 버튼 선택자
	        videoGoodsBtn = $videoId.siblings('.btn_move_goods'), // 비디오 상품바로가기 버튼 선택자
	        stopCover = $videoId.siblings('.stop_cover'), // 비디오 재생중 클릭했을때(정지버튼 나올때) 커버
	        startCover = $videoId.siblings('.play_cover'), // 비디오 정지중(플레이버튼 나올때) 커버
	        clickCover = $videoId.siblings('.click_cover'), // 비디오 클릭시 커버, 비디오 상영중 커버 노출(클릭했을때 stopCover 노출)
	        videoMuteBtn = $videoId.siblings('.btn_move_volume'), // v-com : 음소거 버튼 선택자
	        videoFullBtn = $videoId.siblings('.btn_move_full'), // v-com : 전체화면 버튼 선택자
	        winH = $(window).height(), // 윈도우 높이
	        winOffsetTop = 0, // 윈도우 스크롤 시 위 기준 수치 
	        winOffsetBtm = 0 + winH, // 윈도우 스크롤 시 아래 기준 수치
	        videoHeight = $videoId.height(), // 비디오 재생/멈춤 50% 기준 수치
	        videoOffsetTop = $videoId.length > 0 ? $videoId.offset().top : 0; // 비디오 상단 기준 offset top값
	        activeVideoTH = videoOffsetTop, // (위 스크롤 기준)비디오 상단 기준 offset top값  + 비디오 재생/멈춤 100% 기준 수치값
	        activeVideoBH = videoOffsetTop + videoHeight, // (아래 스크롤 기준)비디오 상단 기준 offset top값  + 비디오 재생/멈춤 100% 기준 수치값
	        btnHideTime = 2000, // 비디오 버튼 감춤 시간
	        autoPlayFlag = movAutoPlayFlag, // 자동플레이 플레그(true:자동재생함, false:자동재생안함)
	        netConFlag = netConditionFlag, // 망(3G,LTE,Wifi)상태(true:Wifi, false:3G,LTE)
	        autoIngFlag = false, // 플레이중 여부 플레그
	        firstSetupFlag = true, // 기획전 html bind시 두번실행 방지 플레그
	        confirmCheckFlag =false, // 수동재생일 경우 알람창 노출 플레그
	        videoCurrentSrc = $videoId.get(0).currentSrc, // 비디오 src 저장하기
	        videoWecandeo = false; //위캔디오 비디오 여부

		if(setAutoPlay != undefined) autoPlayFlag = setAutoPlay;//재생 값 변경
		videoJavaId.addEventListener("ended", resetVideo, false);

        /**
         * 박해원 20171121 [이탈방지팝업]
         * 비디오 재생,정지 상태값 이탈방지 팝업 관리 서비스에 전달
         */
        var videoEvent = {
            play:function(){
            	// 2번째 인자값을 넘기면 재생중인 hwVideo(재생중일때) 정지
                window.videoStateModel.setPlay(true,String(Math.random()*9999999));
            },
            pause:function(){
                window.videoStateModel.setPlay(false);
            }
        };
        videoJavaId.addEventListener("play", videoEvent.play, false);
        videoJavaId.addEventListener("pause", videoEvent.pause, false);
		// [end] 박해원 20171121 [이탈방지팝업]

		if(videoCurrentSrc.indexOf('api.wecandeo') != -1) { // 위캔디오 영상 여부 체크
			videoWecandeo = true;
		}

		// 동영상 종료 후 실행 함수
		function resetVideo() {
		    videoJavaId.src=''; // 비디오 src 비우기
		    videoJavaId.src = videoCurrentSrc; // 비디오 src 가져와서 셋팅하기

	        clickCover.hide(); // 커버 감춤
	        startCover.show(); // 비디오 재생전 커버 노출
	        videoPlayBtn.show(); // 재생 버튼 노출
		}

		// 비디오 플레이 버튼 클릭
		if (!videoPlayBtn.hasClass("bind")){
			videoPlayBtn.addClass("bind");
			videoPlayBtn.bind('click',function(e) { // 비디오 플레이
				 if(nativeAppInfo.isSKT && videoWecandeo && !netConFlag){ // T롯데닷컴, 위캔디오 영상, 3G/LTE 일경우
					if (confirm("3G/LTE에서 재생시 데이터 요금이 부과할 수 있으니 유의하세요~\n(자동재생 설정:앱설정에서 가능)")) {
						confirmCheckFlag = true;
						startCover.hide(); // 비디오 재생전 커버 노출
						stopCover.show(); // 비디오 재생전 커버 노출
						videoJavaId.play(); // 재생 시작
						videoPlayBtn.hide(); // 재생 버튼 감춤
						videoStopBtn.show(); // 정지 버튼 노출
						videoGoodsBtn.stop().show(); // 정지 버튼 노출
						videoMuteBtn.show(); // v-com : 음소거 노출
						videoFullBtn.show(); // v-com : 전체화면 버튼 노출
						setTimeout(function() {
							videoStopBtn.stop().fadeOut(); // 정지 버튼 감춤
							videoGoodsBtn.stop().fadeOut(); // 상품상세 버튼 감춤
							stopCover.stop().fadeOut(); // 비디오 재생전 커버 감춤
							clickCover.show(); // 커버 노출
							videoMuteBtn.stop().fadeOut(); // v-com : 음소거 비노출
							videoFullBtn.stop().fadeOut(); // v-com : 전체화면 버튼 비노출
						},btnHideTime);
					}else{
                        //TV쇼핑 예외처리 추가 
                        if(location.href.indexOf("tvShopping") > 1){
                            getScope().playcover = false;    
                        }                        
                    }

				} else if (autoPlayFlag == 0 || (autoPlayFlag == 1 && netConFlag) || confirmCheckFlag || netConFlag || nativeAppInfo.isSKT) { // 자동재생여부 확인
					startCover.hide(); // 비디오 재생전 커버 노출
					stopCover.show(); // 비디오 재생전 커버 노출
					videoJavaId.play(); // 재생 시작
					videoPlayBtn.hide(); // 재생 버튼 감춤
					videoStopBtn.show(); // 정지 버튼 노출
					videoGoodsBtn.show(); // 정지 버튼 노출
					videoMuteBtn.show(); // v-com : 음소거 노출
					videoFullBtn.show(); // v-com : 전체화면 버튼 노출
					setTimeout(function() {
						videoStopBtn.stop().fadeOut(); // 정지 버튼 감춤
						videoGoodsBtn.stop().fadeOut(); // 상품상세 버튼 감춤
						stopCover.stop().fadeOut(); // 비디오 재생전 커버 감춤
						clickCover.show(); // 커버 노출
						videoMuteBtn.stop().fadeOut(); // v-com : 음소거 비노출
						videoFullBtn.stop().fadeOut(); // v-com : 전체화면 버튼 비노출
					},btnHideTime);
				} else {
					if (confirm("3G/LTE에서 재생시 데이터 요금이 부과할 수 있으니 유의하세요~\n(자동재생 설정:앱설정에서 가능)")) {
						confirmCheckFlag = true;
						startCover.hide(); // 비디오 재생전 커버 노출
						stopCover.show(); // 비디오 재생전 커버 노출
						videoJavaId.play(); // 재생 시작
						videoPlayBtn.hide(); // 재생 버튼 감춤
						videoStopBtn.show(); // 정지 버튼 노출
						videoGoodsBtn.stop().show(); // 정지 버튼 노출
						videoMuteBtn.show(); // v-com : 음소거 노출
						videoFullBtn.show(); // v-com : 전체화면 버튼 노출
						setTimeout(function() {
							videoStopBtn.stop().fadeOut(); // 정지 버튼 감춤
							videoGoodsBtn.stop().fadeOut(); // 상품상세 버튼 감춤
							stopCover.stop().fadeOut(); // 비디오 재생전 커버 감춤
							clickCover.show(); // 커버 노출
							videoMuteBtn.stop().fadeOut(); // v-com : 음소거 비노출
							videoFullBtn.stop().fadeOut(); // v-com : 전체화면 버튼 비노출
						},btnHideTime);
					}else{
                        //TV쇼핑 예외처리 추가 
                        if(location.href.indexOf("tvShopping") > 1){
                            getScope().playcover = false;    
                        }                        
                    }
				}
			});
		};

		// 정지 버튼 클릭
		if (!videoStopBtn.hasClass("bind")){
			videoStopBtn.addClass("bind");
			videoStopBtn.bind('click',function(e) { // 비디오 일시정지
				videoJavaId.pause(); // 재생 정지
				videoStopBtn.hide(); // 정지 버튼 감춤
				videoGoodsBtn.hide(); // 정지 버튼 감춤
				videoPlayBtn.show(); // 재생 버튼 노출
				stopCover.hide(); // 비디오 재생전 커버
				startCover.show(); // 비디오 재생전 커버
				clickCover.hide(); // 커버 비노출
				videoMuteBtn.hide(); // v-com : 음소거 비노출
				videoFullBtn.hide(); // v-com : 전체화면 버튼 비노출
			});
		};

		// 동영상 화면 클릭
	    clickCover.bind('click', function(e) { // 커버 클릭
	        clickCover.show(); // 커버 노출
	        stopCover.show(); // 비디오 재생전 커버
	        videoStopBtn.show(); // 정지 버튼 노출
	        videoGoodsBtn.show(); // 정지 버튼 노출
			videoMuteBtn.show(); // v-com : 음소거 노출
			videoFullBtn.show(); // v-com : 전체화면 버튼 노출
	        setTimeout(function() {
	            videoStopBtn.stop().fadeOut(); // 정지버튼 감춤
	            videoGoodsBtn.stop().fadeOut(); // 정지 버튼 노출
	        	stopCover.stop().fadeOut(); // 비디오 재생전 커버 감춤
	        	videoMuteBtn.stop().fadeOut(); // v-com : 음소거 비노출
	        	videoFullBtn.stop().fadeOut(); // v-com : 전체화면 버튼 비노출
	        },btnHideTime);
	    });

		// v-com : 음소거 버튼 클릭
		if (!videoMuteBtn.hasClass("bind")){
			videoMuteBtn.addClass("bind");
			videoMuteBtn.bind('click', function(e) {
				if (videoJavaId.muted){
					videoMuteBtn.removeClass("mute")
					videoMuteBtn.text("음소거");
					videoJavaId.muted=false; // 비음소거
				}else{
					videoMuteBtn.addClass("mute");
					videoMuteBtn.text("음소거해제");
					videoJavaId.muted=true; // 음소거
				}
			});
		};

		$(window).unbind("scroll.scrollPlay");//메인 탭 이동시 중첩실행 방지
		if (autoPlayFlag == 0 || (autoPlayFlag == 1 && netConFlag && !fixedMovie)) { // 설정값이 자동재생이거나, Wifi만 자동재생일 경우 자동재생함(추가:무비스토어 fixed영상 분기 처리 추가 20171025)
			$(window).bind("scroll.scrollPlay", function (event) {
				if(!vod_useScroll || fixedMovie) return false;
				//컨텐츠 로드로 인한 계산 오류로 재계산
				winOffsetTop = $(window).scrollTop(); // 윈도우 스크롤 시 위 기준 수치 재계산
				winOffsetBtm = $(window).scrollTop() + winH; // 윈도우 스크롤 시 아래 기준 수치
				videoOffsetTop = $videoId.offset().top; // 비디오 상단 기준 offset top값
				if (prdAutoPlay) { //상품상세 상단 동영상일 경우 비디오 가운데 정렬로 인한 여백이 생겨 분기 처리
					activeVideoTH = videoOffsetTop + ($(window).width()/4);
				}else{
					activeVideoTH = videoOffsetTop; // (위 스크롤 기준)비디오 상단 기준 offset top값  + 비디오 재생/멈춤 100% 기준 수치값
				}

				activeVideoBH = videoOffsetTop + videoHeight, // (아래 스크롤 기준)비디오 상단 기준 offset top값  + 비디오 재생/멈춤 100% 기준 수치값
				autoplayCheck(winOffsetTop, winOffsetBtm);
			});
		}
		
	    function autoplayCheck (winOffsetTop, winOffsetBtm) {
	        if ((autoPlayFlag == 0 || (autoPlayFlag == 1 && netConFlag)) && !fixedMovie) { // 앱자동재생 활성화일 경우 자동재생함
	            // 재생 기준 높이가 스크롤 아래 기준 수치보다 작거나 같고, 재생 기준 높이가 스크롤 위 기준 수치보다 크고 자동재생 플래그가 false 일때
	            if(activeVideoBH <= winOffsetBtm && activeVideoTH > winOffsetTop && autoIngFlag != true ) {
	                autoIngFlag = true;
	                videoPlayBtn.trigger('click');
	            }else if ( activeVideoBH > winOffsetBtm || activeVideoTH <= winOffsetTop && autoIngFlag != false && !fixedMovie ) {
	                autoIngFlag = false;
	                videoStopBtn.trigger('click');
	            }
	        }else if ((autoPlayFlag == 0 || (autoPlayFlag == 1 && netConFlag)) && fixedMovie){ //추가:무비스토어 fixed영상 분기 처리 추가 20171025
	                autoIngFlag = true;
	                videoPlayBtn.trigger('click');
	        }else { // 앱이 아니거나 자동재생이 아닐 경우 자동재생안함
	            videoPlayBtn.stop().show();
	        }
	    }

		/* v-com : 앱일 경우 음소거 상태
		var $scope = getScope();
		if ($scope.appObj.isApp){
			videoMuteBtn.trigger('click');
		}; */
	    if (videoFullBtn.length > 0 && !videoFullBtn.hasClass("bind")){
	    	videoFullBtn.addClass("bind");
		    videoFullBtn.bind('touchend', function(e){
		    	var elem = $(this).parent().find('video')[0];
		    	var elemParent = $(this).parent().parent().find('.video_wrap')[0];

		    	if (!document.fullscreenElement && !document.mozFullScreenElement && document.webkitFullscreenElement == null && elem.webkitEnterFullscreen) {
		        	if(elem.requestFullscreen){
		        		elemParent.requestFullscreen();
					}else if(elem.mozRequestFullScreen){
						elemParent.mozRequestFullScreen();
					}else if(elem.webkitRequestFullscreen){
						elemParent.webkitRequestFullscreen();
					}else if(elem.webkitEnterFullscreen){
						elem.webkitEnterFullscreen();
					}
					$videoId.parent('.video_wrap').addClass('fullscreen');
		    	}else{
		    		e.preventDefault();
		    		e.stopPropagation();

		    		if (document.cancelFullScreen) {
				      document.cancelFullScreen();
				    } else if (document.mozCancelFullScreen) {
				      document.mozCancelFullScreen();
				    } else if (document.webkitCancelFullScreen) {
				      document.webkitCancelFullScreen();
				    }
					elemParent.parent('.video_wrap').removeClass('fullscreen');
		    	}
		    });
	    }
		
	    $videoId.unbind('webkitendfullscreen');
	    $videoId.bind('webkitendfullscreen', function(e){
	    	//alert('webkitendfullscreen');
	    	videoJavaId.pause(); // 재생 정지
			videoStopBtn.hide(); // 정지 버튼 감춤
			videoGoodsBtn.hide(); // 정지 버튼 감춤
			videoPlayBtn.show(); // 재생 버튼 노출
			stopCover.hide(); // 비디오 재생전 커버
			startCover.show(); // 비디오 재생전 커버
			clickCover.hide(); // 커버 비노출
			videoMuteBtn.hide(); // v-com : 음소거 비노출
			videoFullBtn.hide(); // v-com : 전체화면 버튼 비노출
	    });
	    
	    autoplayCheck(winOffsetTop, winOffsetBtm);
	}
};

/*201610 일반페이지에서 티클릭 처리*/
function sendNormalTclick(tclick) {
    $("#tclick_iframe").remove();
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      iframe.id = 'tclick_iframe';
      iframe.style.visibility = 'hidden';
      iframe.style.display = "none";
      iframe.src = "/test/tclick.html?tclick=" + tclick ;
      document.body.appendChild(iframe);
    }, 100);
};

/**
 * 앱 업데이트 필요 시 앱에서 호출
 * 화면 업데이트 위해 $timeout 사용
 * 2016.11.07 한상훈
 */
function needUpdateApp(){
	sessionStorage.setItem("needUpdateApp", "Y");
	var $scope = getScope();
	var $timeout = getNGService("$timeout");
    $timeout(function(){
    	$scope.appObj.needUpdateApp = true;
    }, 0);
};




/**
 * 맞춤설정 레이어 열기 (App에서 호출)
 * 2016.11.16 한상훈
 */
function showCustomSettingLayer(tclick){
	var $scope = getScope();
	$scope.csShowHideCustomSearch();
	
	if(tclick != undefined){
		$scope.sendTclick(tclick)
	}
};

/**
 * 스타일추천 페이지 이동 (App에서 호출)
 * 2016.11.16 한상훈
 */
function goStylePushIntro(tclick){
	var $scope = getScope();
	var LotteCommon = getNGService("LotteCommon");
    
	var url = LotteCommon.stylePushIntroUrl + "?" + $scope.baseParam;
	if(tclick != undefined){
		url += "&tclick=" + tclick;
	}
	window.location.href = url;
};

/**
 * 검색 페이지 이동
 */
function goSearchResult(data){
	if(data == undefined || data.keyword == undefined){ return; }
	var $scope = getScope();
    var url = getServicePath("searchUrl") + "?" + $scope.baseParam;
    url = url + "&" + $.param(data);
    window.location.href = url;
};

/**
 * 상품상세 페이지 이동
 */
function goProductView(data){
	if(data == undefined || data.goods_no == undefined){ return; }
	
	// 최근본상품 코드 수집
	if(data.curDispNo == undefined){
		data.curDispNo = 5572036;
	}
	if(data.curDispNoSctCd == undefined){
		data.curDispNoSctCd = 50;
	}
	
	var $scope = getScope();
	if(data.tclick == undefined){
		$scope.productView(data);
	}else{
		$scope.productView(data, "", "", data.tclick);
	}
};

/**
 * 최근본상품 삭제
 * @param goods_no
 */
function deleteLatelyGood(goods_no){
	if(goods_no == undefined){ return; }
	var $scope = getScope();
	var LotteStorage = getNGService("LotteStorage");
	var lately = LotteStorage.getLocalStorage("latelyGoods");
	var arr = lately.split("|");
	var len = arr.length;
	for(var i=len-1; i>=0; i--){
		if(arr[i] == goods_no){
			arr.splice(i, 1);
			break;
		}
	}
	var str = arr.join("|");
	LotteStorage.setLocalStorage("latelyGoods", str);
	
	$scope.updateLatelyGoodsUI(goods_no, arr.length);
};

/**
 * 최근본상품 조회하기 App용
 */
function callLatelyGoods() {
    var lateProdItem = null;

    try { // Safari 개인정보보호모드에서는 localStorage 접근시 Exception 발생으로 예외처리
        lateProdItem = localStorage.getItem("latelyGoods"); // | 구분자로 상품 코드 연결되어 있음
    } catch (e) {}


    // OS 별 Native Interface 호출
    if (nativeAppInfo.isApp) { // 앱일 경우
        if (nativeAppInfo.isAndroid) { // AOS
            try {
            	window.lottebridge.setLatelyGoods(lateProdItem);
            } catch(e) {}
        } else { // iOS
        	location.href = 'lottebridge://setLatelyGoods/?'+lateProdItem;
        }
    }
}

function updateCartCount(cnt) {
    if (nativeAppInfo.isApp) { // 앱일 경우
        if (nativeAppInfo.isAndroid) { // AOS
            try {
            	window.lottebridge.addCartCount(cnt);
            } catch(e) {}
        } else { // iOS
        	location.href = 'lottebridge://addCartCount/?'+cnt;
        }
    }
}

function customSearchChange() {
    if (nativeAppInfo.isApp) { // 앱일 경우
    	var customSettingData = "";
    	
    	try { // Safari 개인정보보호모드에서는 localStorage 접근시 Exception 발생으로 예외처리
    		customSettingData = localStorage.getItem("customSearchSettings"); // 맞춤설정 데이터
    	} catch (e) {}
    	if (nativeAppInfo.isAndroid) { // AOS
            try {
            	window.lottebridge.customSearchChange(customSettingData);
            } catch(e) {}
        } else { // iOS
        	location.href = 'lottebridge://customSearchChange/?'+customSettingData;
        }
    }
}

function appSendBack() {
	console.log("app history back");
	setTimeout(function () {
	    if (nativeAppInfo.isApp) { // 앱일 경우
	        if (nativeAppInfo.isAndroid) { // AOS
	            try {
	            	window.lottebridge.back()
	            } catch(e) {}
	        } else { // iOS
	        	location.href = 'lottebridge://back';
	        }
	    }
	},500);
}

function clearSessionStorage() {
	sessionStorage.clear();
}

/**
 * 최근본상품 조회하기
 */
function getLatelyGoods(){
	var str = localStorage.getItem("latelyGoods");
	if(str == null || str == ""){ return ""; }
	str = str.replace(/\|/g, ",");
	return str;
};