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
function transLoginIdToApp(div, login_id/*, url*/) {
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
			if (window.loginCheck)
				window.loginCheck.callAndroid("loginId/"+login_id);
		} else {
			if (window.loginCheck)
				window.loginCheck.callAndroid("logout");
		}
	}
}

// 로그인체크
function chkLoginByApp() {
    // 디바이스 별 함수 호출
    if (chkDevice() == "iOS") {
        top.document.getElementById('storage_frame').src = 'loginCheck://isUserLogged/'+loginChk();
    } else { // android
        window.loginCheck.callAndroid(loginChk());
    }
}

// 앱 하단 메뉴 채널, 채널상세 번호 변경
function callChangeParamUrl(app_url) {
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

// Get Default URL Parameters
function getBaseParams() {
    var params = getUrlParams(),
        baseParam = "";

    baseParam += "c=" + (params.c ? params.c : "");
    baseParam += "&udid=" + (params.udid ? params.udid : ""); // 사용자 UDID
    baseParam += "&v=" + (params.v ? params.v : ""); // APP 버전
    baseParam += "&cn=" + (params.cn ? params.cn : ""); // 채널값
    baseParam += "&cdn=" + (params.cdn ? params.cdn : ""); // 채널 상세 번호
    baseParam += "&schema=" + (params.schema ? params.schema : ""); // APP Schema

    return baseParam;
}

// Const 이동 URL - location.host 는 port 넘버까지 넘어옴 (포트번호가 없을 경우 안넘어옴)
var appURLObj = {
    tclickUrl : "http://" + location.host + "/exevent/tclick.jsp", // Tclick 수집 IFrame URL

    mainUrl : "http://" + location.host + "/main.do", // 메인
    cateMidAngul : "http://" + location.host + "/category/m/cate_mid_list_anglr.do", // 카테고리
    brandShopUrl : "http://" + location.host + "/category/m/cate_brand_main.do", // 브랜드
    prdlstUrl : "http://" + location.host + "/product/m/product_list.do", // 기획전
    prdviewUrl : "http://" + location.host + "/product/m/product_view.do", // 상품 상세

    ordLstUrl : "https://" + location.host + "/mylotte/purchase/m/purchase_list.do", // 주문/배송 조회
    ordCancelUrl : "https://" + location.host + "/mylotte/purchase/m/purchase_list.do", // 주문취소
    cateLstUrl : "http://" + location.host + "/mylotte/cart/m/cart_list.do", // 장바구니
    wishLstUrl : "http://" + location.host + "/mylotte/wish/m/wish_list.do", // 위시리스트

    mylotteUrl : "http://" + location.host + "/mylotte/m/mylotte.do", // 마이롯데
    myLPointUrl : "https://" + location.host + "/mylotte/pointcoupon/m/point_info.do", // L.POINT
    myLMoneyUrl : "https://" + location.host + "/mylotte/pointcoupon/m/point_info.do", // L-money
    myCouponUrl : "https://" + location.host + "/mylotte/pointcoupon/m/point_info.do", // 쿠폰
    gdBenefitUrl : "http://" + location.host + "/mylotte/sub/soGoodBenefit.do", // 참좋은혜택
    smartAlarmUrl : "http://" + location.host + "/planshop/m/smartAlarmList.do", // 스마트 알림
    smartpayUrl : "https://" + location.host + "/mylotte/smartpay/m/smartpay.do", // 스마트 페이

    questionUrl : "http://" + location.host + "/custcenter/m/question.do", // 1:1 문의하기
    lateProdUrl : "http://" + location.host + "/product/m/late_view_product_list.do" // 최근 본 상품
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
    
    if (!tclick) { // tclick setting
        tclick = "m_side_cate_catebig_" + curDispNo;
    }

    targetURL += "&cateDiv=MIDDLE";
    targetURL += "&curDispNo=" + curDispNo;
    targetURL += "&title=" + cateName;
    targetURL += "&tclick=" + tclick;

    window.location.href = targetURL;
}

/**
 * 브랜드 이동
 * @param {string} disp_no - 브랜드 전시 번호 (필수)
 * @param {string} dispLrgNm - 브랜드 상위 카테고리명 (선택)
 * @param {string} tclick - TCLICK 명 (선택)
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
 * @param {string} curDispNo - 기획전 번호 (필수)
 * @param {string} tclick - TCLICK 명 (선택)
 */
function goPlanshop(curDispNo, tclick) {
    if (!curDispNo) { // 유효성 체크
        alert("잘못된 기획전입니다.");
        return false;
    }

    var targetURL = appURLObj.prdlstUrl + "?" + getBaseParams();
    
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

    for (var k in params) {
        if (params[k])
            parmasArr.push(k + "=" + params[k]);
    }

    parmasArr.push(getBaseParams());
    url += "?" + parmasArr.join("&");

    //window.location.href = url;
    console.log(url);
}

// 전시 관련 API
/**
 * Tclick 수집
 * @param {string} tclick - tclick 명 (필수)
 */
function appTclick(tclick) {
    var tclickIframe = document.getElementById("tclick_iframe");

    if (tclickIframe && tclick) { // 유효성 검증
        tclickIframe.contentDocument.location.replace(appURLObj.tclickUrl + "?tclick=" + tclick);
    }
}

/**
 * 메인 페이지 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoMain(tclick) {
    try { // iOS 개인정보 보호 모드시 sessionStorage를 사용할 경우 Exception 발생으로 예외처리
        sessionStorage.clear();
    } catch (e) {}

    appGoPageBaseParams(appURLObj.mainUrl, { tclick : "" });
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

    if (outlinkFlag) {
        var uri = url.replace(/http\:\/\/|https\:\/\//gi, "");

        if (chkDevice() == "iOS") {
            if (url.match("https://")) {
                window.location = "family://" + uri;
            } else {
                window.location = "lecsplatform://" + encodeURIComponent(uri);
            }
        } else {
            window.lecsplatform.callAndroid(encodeURIComponent(url));
        }
    } else {
        appGoPageBaseParams(url, { tclick : "" });
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

    appGoPageBaseParams(appURLObj.cateMidAngul, {
        curDispNo : curDispNo,
        title : title,
        cateDiv : "MIDDLE",
        tclick : tclick
    });
}

/**
 * 브랜드 이동
 * @param {string} curDispNo - 브랜드 전시 번호 (필수)
 * @param {string} dispLrgNm - 상위 카테고리명 (필수)
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoBrand(curDispNo, dispLrgNm, tclick) {
    if (!curDispNo || !dispLrgNm) // 유효성 검증
        return false;

    appGoPageBaseParams(appURLObj.brandShopUrl, {
        curDispNo : curDispNo,
        dispLrgNm : dispLrgNm,
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
        point_div : "lt_point"
        tclick : tclick
    });
}

/**
 * L-money 내역 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoLMoney(tclick) {
    appGoPageBaseParams(appURLObj.myLMoneyUrl, {
        point_div : "l_point"
        tclick : tclick
    });
}

/**
 * 쿠폰내역 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoCoupon(tclick) {
    appGoPageBaseParams(appURLObj.myCouponUrl, {
        point_div : "coupon"
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
 * 1:1 문의하기 이동
 * @param {string} tclick - tclick 명 (선택)
 */
function appGoQNA(tclick) {
    appGoPageBaseParams(appURLObj.questionUrl, {
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
        viewGoods : lateProdItem
        tclick : tclick
    });
}

/**
 * 동영상 자동재생 설정여부, 망(3G,LTE,Wifi)상태 앱에서 호출받는 함수
 */
function movAutoPlaylCheck(autoplay, netCondition) {
    movAutoPlayFlag = autoplay, // 자동재생설정 여부
    netCondition = netCondition; // 망 상태 확인 여부
    
    console.info('autoplay', movAutoPlayFlag);
    console.info('netCondition', netCondition);

    var pageVideoLength = $('.auto_video').length;

    console.info('pageVideoLength', pageVideoLength);
    autoVideoPlay('autoVideo1', '#autoVideo1');
}
movAutoPlaylCheck(true, true);