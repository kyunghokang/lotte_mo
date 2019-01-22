// NativeApp 세분화
var nativeAppInfo = {
    isApp: false,
    isSKT: false,
    isAndroid: false,
    isIOS: false,
    isIPhone: false,
    isIPad: false,
    isIPod: false,
    versionNum: 0
};

// 앱 정보 확인
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
    nativeAppInfo.isIOS = /iphone|ipad|ipod/gi.test(ua);
    nativeAppInfo.isIPhone = /iphone/gi.test(ua);
    nativeAppInfo.isIPad = /ipad/gi.test(ua);
    nativeAppInfo.isIPod = /ipod/gi.test(ua);

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

getNativeInfo();

// URL 파라미터 배열 리턴
var urlPrams = {};

function parseUrlParams() {
    var search = location.search.substring(1);
    urlPrams = search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
    function(key, value) { return key===""?value:decodeURIComponent(value) }):{}
}

parseUrlParams();

// 최근본 상품 연동 WEB -> APP
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

/**
 * 최근 본 상품 추가
 * @param {string} goodsNo 상품번호
 */
function setLatelyGoods(goodsNo) {
    try {
        var storageViewGoods = localStorage.getItem('latelyGoods');
        var storageGoodsVal = "";

        if (storageViewGoods != null) {
            var goodsArr = storageViewGoods.split("|"),
                newGoodsArr = [],
                i = 0;

            // 중복제거 및 추가되는 상품번호가 기존 항목에 있는지 확인 후 있다면 제거
            for (i = 0; i < goodsArr.length; i++) {
                if (newGoodsArr.indexOf(goodsArr[i]) == -1 && goodsArr[i] != goodsNo) {
                    newGoodsArr.push(goodsArr[i]);
                }
            }

            newGoodsArr.push(goodsNo);

            if (newGoodsArr.length > 20) {
                newGoodsArr.splice(0, 1);
            }

            localStorage.setItem("latelyGoods", newGoodsArr.join("|"));
            storageGoodsVal = newGoodsArr.join("|");
        } else {
            localStorage.setItem("latelyGoods", goodsNo);
            storageGoodsVal = goodsNo;
        }

        var storageShareUrl = "https://" + location.host + "/common3/secureShareStorage.jsp?type=local&key=latelyGoods&val=" + storageGoodsVal;

        if (location.protocol == "https") {
            storageShareUrl = "http://" + location.host + "/common3/secureShareStorage.jsp?type=local&key=latelyGoods&val=" + storageGoodsVal;
        }

        iframeLoadURL(storageShareUrl);
    } catch (e) {}
}

// 최근본 상품 전체 변경 APP -> WEB
function setAllLateProd(lateProds) { // Array로 받을지, String | 구분자로 받을지 확인 필요
    try { // Safari 개인정보보호모드에서는 localStorage 접근시 Exception 발생으로 예외처리
        localStorage.setItem("latelyGoods", lateProds); // | 구분자로 배열 연결 후 String으로 저장

        var storageShareUrl = "https://" + location.host + "/common3/secureShareStorage.jsp?type=local&key=latelyGoods&val=" + lateProds;

        if (location.protocol == "https") {
            storageShareUrl = "http://" + location.host + "/common3/secureShareStorage.jsp?type=local&key=latelyGoods&val=" + lateProds;
        }

        iframeLoadURL(storageShareUrl);
    } catch (e) {}
}

// 세션 스토리지 삭제 로그아웃시 사용 
function clearSessionStorage() {
	sessionStorage.clear();
}

// 최근본 상품 추가 APP -> WEB
function addLateProd(goodsNo) {
    try {
        var storageViewGoods = localStorage.getItem('latelyGoods');
        var storageGoodsVal = "";

        if (storageViewGoods != null) {
            var goodsArr = storageViewGoods.split("|"),
                newGoodsArr = [],
                i = 0;

            // 중복제거 및 추가되는 상품번호가 기존 항목에 있는지 확인 후 있다면 제거
            for (i = 0; i < goodsArr.length; i++) {
                if (newGoodsArr.indexOf(goodsArr[i]) == -1 && goodsArr[i] != goodsNo) {
                    newGoodsArr.push(goodsArr[i]);

                    // console.log(goodsArr[i], goodsNo);
                }
            }

            newGoodsArr.push(goodsNo);

            if (newGoodsArr.length > 20) {
                newGoodsArr.splice(0, 1);
            }

            localStorage.setItem("latelyGoods", newGoodsArr.join("|"));
            storageGoodsVal = newGoodsArr.join("|");
        } else {
            localStorage.setItem("latelyGoods", goodsNo);
            storageGoodsVal = goodsNo;
        }

        var storageShareUrl = "https://" + location.host + "/common3/secureShareStorage.jsp?type=local&key=latelyGoods&val=" + storageGoodsVal;

        if (location.protocol == "https") {
            storageShareUrl = "http://" + location.host + "/common3/secureShareStorage.jsp?type=local&key=latelyGoods&val=" + storageGoodsVal;
        }

        iframeLoadURL(storageShareUrl);
    } catch(e) {}
}

/**
 * 최근 본 상품 중 상품 삭제
 * @param {string} goodsNo 상품번호
 */
function deleteLatelyGood(goodsNo) {
    try {
        if (goodsNo == undefined) {
            return;
        }

        var lately = localStorage.getItem("latelyGoods"), // 최근 본 상품 Local Storage
            arr = lately.split("|"),
            len = arr.length,
            i = len - 1;
        
        for (i; i >= 0; i--) {
            if (arr[i] == goodsNo) {
                arr.splice(i, 1);
                break;
            }
        }
        
        var str = arr.join("|");
        localStorage.setItem("latelyGoods", str);

        var storageShareUrl = "https://" + location.host + "/common3/secureShareStorage.jsp?type=local&key=latelyGoods&val=" + str;

        if (location.protocol == "https") {
            storageShareUrl = "http://" + location.host + "/common3/secureShareStorage.jsp?type=local&key=latelyGoods&val=" + str;
        }

        iframeLoadURL(storageShareUrl);
    } catch(e) {}
}

// 쿠키 읽기
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");

    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x = x.replace(/^\s+|\s+$/g,"");
        
        if (x==c_name) {
            return unescape(y);
        }
    }
}

// 쿠키 생성
function setCookie( name, value, expires, path, domain, secure ) {
    var today = new Date();
    today.setTime( today.getTime() );

    if ( expires ) {
        expires = expires * 1000 * 60 * 60 * 24;
    }

    var expires_date = new Date( today.getTime() + (expires) );

    document.cookie = name + "=" + escape( value ) +
    ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
    ( ( path ) ? ";path=" + path : "" ) +
    ( ( domain ) ? ";domain=" + domain : "lotte.com" ) +
    ( ( secure ) ? ";secure" : "" );
}

// 장바구니 담기 시 CARTINFO 수신 API (비회원 장바구니 담기 시 CARTINFO)
function cartInfoChk(cartInfo) {
    if (cartInfo) {
        setCookie("CARTINFO", cartInfo, null, "/", "lotte.com");
    }
}

// APP -> 메인 페이지 로드 API & Tclick API
var iframeIdx = 0;

function remove(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

function iframeLoadURL(url) {
    console.log("tracking", url);

    var iframe = document.createElement('iframe');
    iframe.id = 'tclick_iframe_' + iframeIdx;
    iframeIdx++;

    if (iframeIdx > 20) {
        iframeIdx = 0;
    }

    iframe.style.visibility = 'hidden';
    iframe.style.display = "none";
    iframe.src = url;
    // iframe.onload = function () {
    //     var targetIframe = document.getElementById(iframe.id);

    //     if (targetIframe) {
    //         // remove(iframe.id);
    //         setTimeout(function () {
    //             remove(iframe.id);
    //         }, 3000);
    //     }
    // };
    document.body.appendChild(iframe);

    var targetIframe = document.getElementById(iframe.id);
    
    if (targetIframe) {
        // remove(iframe.id);
        setTimeout(function () {
            remove(iframe.id);
        }, 5000);
    }
}

// iframe loader  닷컴/슈퍼 로그인 SSO를 위하여 영구적인 iframe 생성 로직 추가
function iframeStaticLoadURL(url) {
    console.log("static iframe", url);

    var staticIframe = null;

    if (document.getElementById("staticIframe")) {
        staticIframe = document.getElementById("staticIframe");
        staticIframe.src = url;
    } else {
        staticIframe = document.createElement("iframe");
        staticIframe.id = "staticIframe";
        staticIframe.style.visibility = 'hidden';
        staticIframe.style.display = "none";
        staticIframe.src = url;

        document.body.appendChild(staticIframe);
    }
}

try {
    // 20170703 박형윤 6/28 배포된 안드로이드 2.9.0 버전에서 채널값 cn, cdn 파라미터 유실로 인해 undefined 되는 현상 방지
    if (getCookie("CHLNO") == "undefined") {
        setCookie("CHLNO", "23", null, "/", "lotte.com");
    }

    if (getCookie("CHLDTLNO") == "undefined") {
        setCookie("CHLDTLNO", "0", null, "/", "lotte.com");
    }
} catch (e) {}

/**
 * 오드컨샙 스타일 추천 APP <-> WEB API
 */
var STYLE_ODDCONCEPT_API_KEY = "LOTT5afb4ffde7d5521fbe52a00cb8191e9dc77d2b0eae5ead382c2d99f9";//"LOTT2ed4a4b9022e8805e25baa2eba02f7598babe414a6e0d13a61e3f8e4";
var STYLE_ODDCONCEPT_API_URL = "https://dl-api.oddconcepts.kr/v1/";
var STYLE_ODDCONCEPT_SEX_CATEGORY = {
    F1  : 536870913,
    F2  : 536870914,
    F4  : 536870916,
    F8  : 536870920,
    F16 : 536870928,
    F32 : 536870944,
    M2  : 1073741826,
    M4  : 1073741828,
    M16 : 1073741840,
    M32 : 1073741856,
    A1  : 1,
    A2  : 2,
    A4  : 4,
    A8  : 8,
    A16 : 16,
    A32 : 32
};
var STYLE_ODDCONCEPT_GENDER = {
    female	: "F",
    male	: "M",
    all		: "A"
};
var STYLE_ODDCONCEPT_CATEGORY = {
    dresses	: 1,
    pants	: 2,
    shorts	: 4,
    skirts	: 8,
    tops	: 16,
    outers	: 32
};

/**
 * 카테고리 구하기
 * @param sex 성별
 * @param cate 카테고리
 */
function getCategory(sex, cate) {
	try{
		var base = 0;
		
		switch(sex){
		case "F":
			base = 536870912;
			break;
		case "M":
			base = 1073741824;
			break;
		// no default
		}
		
		return base + cate;
	}catch(e){}
	
	return "";
	
    /*try {
        var len = cate.length;
        var rtn = 0;
        // console.log(sex, cate);

        for (var i = 0; i < len; i++) {
            if (STYLE_ODDCONCEPT_SEX_CATEGORY[sex + cate[i]] != undefined) {
                rtn = rtn | STYLE_ODDCONCEPT_SEX_CATEGORY[sex + cate[i]];
            }
        }

        return rtn;
    } catch (e) {}

    return "";*/
}

/**
 * 스타일 추천 APP 호출
 */
function styleRecomAppReturn(type, result, sortCate) {
    try {
    	console.log("styleRecomAppReturn", type, result, sortCate);
    	if(sortCate == undefined){
    		sortCate = "";
    	}else{
    		sortCate = "" + sortCate;
    	}

        if(nativeAppInfo.isIOS){
        	if(type == "detect" && nativeAppInfo.versionNum >= 4140){
        		window.location.href = "lottebridge://stylerecom?" + type +  "=" + result + "&sortCate=" + sortCate;
        	}else{
        		window.location.href = "lottebridge://stylerecom?" + type +  "/" + result;
        	}
        }else{
        	//if(type == "detect" && nativeAppInfo.versionNum >= 417){
        	if(nativeAppInfo.versionNum >= 417){
        		window.lottebridge.stylerecom(type, result, sortCate);
        	}else{
        		window.lottebridge.stylerecom(type, result);
        	}
        }
    } catch (e) {
        console.error("APP 인터페이스 호출 오류");
    }
}

/**
 * 오드컨샙 스타일 추천 Detect - 이미지에서 스타일 추천 영역 검색
 * @param imgUrl 이미지 경로
 */
function styleRecomDetect(imgUrl, callbackFunc) {
    if (imgUrl == undefined || imgUrl == "") {
        if (!callbackFunc) {
            styleRecomAppReturn("detect", false);
        } else {
            callbackFunc([]);
        }
        return false;
    }

    var detectImgUrl = (imgUrl + "").replace("_280", "_550"); // 550 사이즈 이미지로 변경

    // 20170922 박형윤 oddConcept detect 호출 시 Tclick 수집 추가
    iframeLoadURL("/exevent/tclick.jsp?tclick=DC_StyleReco_Detect");
    
    var goods_no = "";
    try{
    	var arr = detectImgUrl.split("/");
    	var img = arr[arr.length - 1];
    	goods_no = img.substr(0, img.indexOf("_"));
		if(isNaN(goods_no)){ goods_no = ""; }
    }catch(e){}
    
    //var path = "/json/search/m/styleRecoDetect.json?url="+ encodeURIComponent(detectImgUrl) + "&goods_no=" + goods_no + "&isApp=true&call_type=detail";
    $.ajax({
        url: STYLE_ODDCONCEPT_API_URL + "detect?url=" + encodeURIComponent(detectImgUrl) + "&product_code=" + goods_no,
        //url: path,
        type: "get",
        dataType: "json",
        async: true,
        beforeSend : function (xhr) {
            xhr.setRequestHeader("apikey", STYLE_ODDCONCEPT_API_KEY);
        },
        success: function (data) {
            var styleRecomDetectData = processDetection(data);
            //console.warn(styleRecomDetectData)

            if (styleRecomDetectData.length > 0) {
                if (!callbackFunc) {
                    styleRecomAppReturn("detect", true, styleRecomDetectData[0].category);
                } else {
                    callbackFunc(styleRecomDetectData);
                }
            } else {
                if (!callbackFunc) {
                    styleRecomAppReturn("detect", false);
                } else {
                    callbackFunc(styleRecomDetectData);
                }
            }
            
            styleRecomLog({
				"goodsNo"	: goods_no,
				"type"		: "detect",
				"result"	: "success"
    		});
        },
        error: function(data) {
            if (!callbackFunc) {
                styleRecomAppReturn("detect", false);
            } else {
                callbackFunc(styleRecomDetectData);
            }
            
            styleRecomLog({
				"goodsNo"	: goods_no,
				"type"		: "detect",
				"result"	: "fail"
    		});

            styleRecomSendErrorTclick();
        }
    });
}

/**
 * 스타일 추천 데이터 가공
 */
function processDetection(data) {
	//if(data == undefined || data.list == undefined){ return []; }
	if(data == undefined){ return []; }
	if(data.status === false){
		console.warn(data.message);
		styleRecomSendErrorTclick();
		return [];
	}
	if(data.list == undefined){ return []; }
	
	var list = data.list;
    var arr = [];
    var i, len, li, dt, ctg, map;
    
	len = list.length;
	for(i=0; i<len; i++){
		dt = list[i];
		
		// 카테고리
		ctg = dt.category;
		dt.ctgObj = ctg;
		dt.category = ctg.code;
		/*if(dt.sub_category.code != 0){
			dt.category = dt.sub_category.code;
		}else{
			dt.category = ctg.code;
		}*/

		// 카테고리명 하드코딩, 성별전용 설정
		if(dt.sub_category.code != 0){
			map = cateMap[dt.sub_category.code];
		}else{
			map = cateMap[dt.category];
		}
		if(map){
			dt.ctgName = map.name;
			dt.genOnly = map.gender;
		}else{
			dt.ctgName = "";
			dt.genOnly = "";
		}
		
		// 성별
		switch(dt.gender.code){
		case 1073741824:
			dt.genCd = "M";
			break;
		case 536870912:
			dt.genCd = "F";
			break;
		case 1610612736:
			dt.genCd = "A";
			break;
		default:
			dt.genCd = "";
			break;
		}
		
		// 영역
		dt.score = Math.round(dt.score * 100);
		dt.rx1 = Math.round(dt.rx1 * 10000) / 100;
		dt.rx2 = Math.round(dt.rx2 * 10000) / 100;
		dt.ry1 = Math.round(dt.ry1 * 10000) / 100;
		dt.ry2 = Math.round(dt.ry2 * 10000) / 100;
		// 중심좌표
		switch(ctg.code){
		case 2:// 바지
		case 4:// 반바지
		case 1024:// 수영복하의
			dt.cx = Math.round(dt.rx1 + (dt.rx2 - dt.rx1) * 0.3);
			dt.cy = Math.round(dt.ry1 + (dt.ry2 - dt.ry1) * 0.3);
			break;
		default:
			dt.cx = Math.round(dt.rx1 + (dt.rx2 - dt.rx1) * 0.5);
			dt.cy = Math.round(dt.ry1 + (dt.ry2 - dt.ry1) * 0.5);
			break;
		}
		arr.push(dt);
	}
    
    arr = arr.sort(sortFunc);
    
    return arr;
	
	
    /*if (data == undefined) { return []; }
    if (data.status === false) {
        console.warn(data.message);
        styleRecomSendErrorTclick();
        return [];
    }
    
    if (data.list == undefined) { return []; }
    
    var list = data.list;
    var arr = [];
    var i, len, li, dt;

    for (var k in list) {
        li = list[k];
        len = li.length;

        for (i = 0; i < len; i++) {
            dt = li[i];
            dt.category = parseInt(k, 10);
            dt.score = Math.round(dt.score * 100);
            dt.rx1 = Math.round(dt.rx1 * 10000) / 100;
            dt.rx2 = Math.round(dt.rx2 * 10000) / 100;
            dt.ry1 = Math.round(dt.ry1 * 10000) / 100;
            dt.ry2 = Math.round(dt.ry2 * 10000) / 100;
            dt.genCd = data.genCd;
            arr.push(dt);
        }
    }
    
    arr = arr.sort(sortFunc);
    
    return arr;*/
}

var cateMap = {
	8			: {gender:"F",	name:"스커트"},
	252			: {gender:"F",	name:"롱스커트"},
	253			: {gender:"F",	name:"미디스커트"},
	254			: {gender:"F",	name:"미니스커트"},
	32			: {gender:"",	name:"아우터"},
	232			: {gender:"",	name:"가디건"},
	233			: {gender:"",	name:"점퍼"},
	234			: {gender:"",	name:"코트"},
	235			: {gender:"",	name:"자켓"},
	236			: {gender:"",	name:"조끼"},
	1			: {gender:"F",	name:"원피스"},
	4			: {gender:"",	name:"반바지"},
	16			: {gender:"",	name:"상의"},
	242			: {gender:"",	name:"셔츠"},
	243			: {gender:"F",	name:"뷔스티에"},
	239			: {gender:"",	name:"후드"},
	241			: {gender:"F",	name:"블라우스"},
	240			: {gender:"",	name:"니트"},
	237			: {gender:"",	name:"티셔츠"},
	238			: {gender:"",	name:"맨투맨"},
	2			: {gender:"",	name:"바지"},
	249			: {gender:"",	name:"긴바지"},
	250			: {gender:"",	name:"7부 바지"},
	512			: {gender:"",	name:"수영복상의"},
	247			: {gender:"F",	name:"비키니상의"},
	248			: {gender:"",	name:"래쉬가드"},
	1024		: {gender:"",	name:"수영복하의"},
	258			: {gender:"F",	name:"비키니하의"},
	259			: {gender:"M",	name:"삼각수영복"},
	260			: {gender:"M",	name:"사각수영복"},
	2048		: {gender:"",	name:"원피스수영복"},
	265			: {gender:"F",	name:"원피스수영복"},
	266			: {gender:"F",	name:"모노키니"},
	267			: {gender:"",	name:"전신수영복"},
	2097152		: {gender:"",	name:"부츠"},
	274			: {gender:"M",	name:"부츠"},
	268			: {gender:"F",	name:"부티"},
	269			: {gender:"F",	name:"앵클부츠"},
	270			: {gender:"",	name:"워커"},
	271			: {gender:"F",	name:"롱부츠"},
	272			: {gender:"F",	name:"하프부츠"},
	273			: {gender:"",	name:"레인부츠"},
	4194304		: {gender:"F",	name:"구두"},
	275			: {gender:"F",	name:"펌프스"},
	276			: {gender:"F",	name:"스틸레토힐"},
	277			: {gender:"F",	name:"웨지힐"},
	278			: {gender:"F",	name:"토오픈힐"},
	279			: {gender:"F",	name:"슬링백"},
	280			: {gender:"F",	name:"스트랩힐"},
	8388608		: {gender:"",	name:"로퍼"},
	281			: {gender:"F",	name:"플랫슈즈"},
	282			: {gender:"",	name:"로퍼"},
	283			: {gender:"F",	name:"블로퍼"},
	284			: {gender:"F",	name:"옥스퍼드화"},
	296			: {gender:"M",	name:"정장화"},
	297			: {gender:"M",	name:"보트슈즈"},
	16777216	: {gender:"",	name:"샌들"},
	298			: {gender:"",	name:"샌들"},
	285			: {gender:"F",	name:"플랫샌들"},
	286			: {gender:"F",	name:"플랫폼샌들"},
	287			: {gender:"F",	name:"웨지샌들"},
	288			: {gender:"F",	name:"글래디에이터"},
	289			: {gender:"F",	name:"스트랩샌들"},
	290			: {gender:"",	name:"슬리퍼"},
	291			: {gender:"",	name:"쪼리"},
	292			: {gender:"F",	name:"뮬"},
	33554432	: {gender:"",	name:"스니커즈"},
	293			: {gender:"",	name:"하이탑"},
	294			: {gender:"",	name:"스니커즈"},
	295			: {gender:"",	name:"슬립온"},
	67108864	: {gender:"",	name:"운동화"},
	299			: {gender:"",	name:"등산화"},
	4096		: {gender:"",	name:"토트백"},
	8192		: {gender:"",	name:"숄더백"},
	65536		: {gender:"",	name:"클러치"},
	131072		: {gender:"F",	name:"파우치"},
	16384		: {gender:"",	name:"백팩"},
	262144		: {gender:"M",	name:"서류가방"},
	1048576		: {gender:"",	name:"캐리어"},
	32768		: {gender:"",	name:"힙색"},
	524288		: {gender:"",	name:"스포츠가방"}
}


/**
 * 스타일 추천 데이터 정확도순 정렬
 */
function sortFunc(s1, s2) {
    var a = s1.score;
    var b = s2.score;

    if (a > b) {
        return -1;
    } else if (a < b) {
        return 1;
    }

    return 0;
}

/**
 * Array 중복 데이터 삭제
 */
function uniqueArray(arr) {
    var rtnArr = [],
        i = 0;

    for (i; i < arr.length; i++) {
        if (rtnArr.indexOf(arr[i]) === -1) {
            rtnArr.push(arr[i]);
        }
    }

    return rtnArr;
}

/**
 * 오드컨샙 스타일 추천 Search - 이미지 관련 추천 상품 번호 추출
 * @param imgUrl 비슷한 스타일 찾기 이미지 (상품의 첫번째 이미지)
 * @param gender 성별
 * @param styleCate 스타일 추천 카테고리 그룹 번호
 */
function styleRecomSearch(imgUrl, gender, styleCate, prdSex) {
    styleRecomDetect(imgUrl, function (list) {
        // id 스타일 추천 ID
        // sex 성별
        // cate 카테고리
        // subcate 서브카테고리

        if (list.length > 0) { // 리턴 결과가 있을 경우 스타일 추천 데이터 사용 (없을 경우 비노출)
        	
        	var item = list[0];
        	var prdCtg = styleCate;
        	var mbrSex = gender;
            
            var reg = /^F$|^M$/;
			var sex = item.genCd;
			if(reg.test(item.genOnly)){
				// 전용 성별 카테고리
				sex = item.genOnly;
			}else if(reg.test(prdSex)){
				// 상품 성별
				sex = prdSex;
			}else{
				if(prdCtg == "5"){
					// 아동복이면 회원정보 성별 사용안함
					sex = item.genCd;
				}else{
					// 기타
					if(reg.test(item.genCd)){
						// 오드컨셉 성별
						sex = item.genCd;
					}else if(reg.test(mbrSex)){
						// 회원정보 성별
						sex = mbrSex;
					}else{
						sex = "A";
					}
					/*if(reg.test(mbrSex)){
						// 회원정보 성별
						sex = mbrSex;
					}else{
						// 오드컨셉 성별
						sex = item.genCd;
					}*/
				}
			}
			//return sex;
            

        	
            /*var cate = list[0].category; // 1, 2, 4, 8, 16, 32
            var sex = "A"; // A: 전체, M: 남성, F: 여성
            var genderCode = list[0].genCd;

            if (cate == 1 || cate == 8) { // 1, 8 일 경우 여성 카테고리
                sex = "F"; // 여성으로 고정
            }else if(genderCode == "F" || genderCode == "M"){
            	sex = genderCode;
            } else { // 1, 8이 아닐 경우에는 현재 로그인 정보의 성별 이용
                if (gender){
                    sex = gender; // 현재 로그인정보의 성별 정보로 세팅
                }
            }*/
            
			var cate = item.category;
            var subcate = styleCate ? styleCate : undefined;
            var id = list[0].id;
            
			if (id == undefined || id == "") {
                console.warn("NO ID");
                styleRecomAppReturn("search", "");
				return false;
            }
            
			if (sex == undefined || sex == "") {
				console.warn("NO SEX");
                styleRecomAppReturn("search", "");
				return false;
            }
            
			if (cate == undefined || cate.length == 0) {
				console.warn("NO CATEGORY");
                styleRecomAppReturn("search", "");
				return false;
            }
            
			if (typeof(cate) != "object"){
				cate = [cate];
            }
			
            var category = getCategory(sex, cate[0]);
            
			if (category == "") {
				console.warn("INCORRECT CATEGORY");
                styleRecomAppReturn("search", "");
				return false;
			}
			
			var obj = {
				category: category,
				count: 150 // 리턴 상품 개수
			};
            
		    var goods_no = "";
		    try{
		    	var arr = imgUrl.split("/");
		    	var img = arr[arr.length - 1];
		    	goods_no = img.substr(0, img.indexOf("_"));
		    }catch(e){}
			
            
            //var path = "/json/search/m/styleRecoSearch.json";
            obj = {
            	"id"			: id,
            	"category"		: category,
            	//"goods_no"		: goods_no,
            	//"recommcgcd"	: 1,
            	"count"			: 150//50, // 2018-04-18 박형윤 스타일 추천 연동 개수 조정
                //"isApp"         : "true", // 2018-05-11 김낙운 스타일추천 API호출 로그 세분화
                //"call_type"     : "detail" // 2018-05-11 김낙운 스타일추천 API호출 로그 세분화
            };
            var path = STYLE_ODDCONCEPT_API_URL + "search/" + id + "?" + $.param(obj);// + "&goods_no=" + goods_no;
            
            var obj2 = {
                "recommcgcd"	: 1
            }
			/*if(data.sub_cate != undefined && data.sub_cate != 0){
				obj2.sub_category = [data.sub_cate];
			}*/
            if(item.sub_category.score > 0.2 && item.sub_category.code != 0){
    			obj2.sub_category = item.sub_category.code;
    		}

            if (subcate != undefined || subcate != "") {
                var n = parseInt(subcate, 10);

                if (!isNaN(n)) {
                    obj2.recommcgcd = n;
                }
            }
            
            // 20170922 박형윤 oddConcept search 호출 시 Tclick 수집 추가
            iframeLoadURL("/exevent/tclick.jsp?tclick=DC_StyleReco_Search");
            
    		$.ajax({
				url: path,
				type: "POST",
				data: JSON.stringify(obj2),
				dataType: "JSON",
				async: true,
				method: "POST",
				beforeSend : function (xhr) {
					xhr.setRequestHeader("apikey", STYLE_ODDCONCEPT_API_KEY);
					xhr.setRequestHeader('Content-Type', 'application/json');
				},
				success: function (data) {
					loadProductList(data);
					
					styleRecomLog({
						"goodsNo"	: goods_no,
						"type"		: "search",
						"result"	: "success"
            		});

                    /*var list = [];

                    for (var x in data) {
                        if (data[x] != undefined && typeof(data[x]) != "string") {
                            list = data[x];
                            break;
                        }
                    }
                    
                    if (list == undefined || list.length == 0) {
                        styleRecomAppReturn("search", "");
                        return;
                    }
                    
                    var p;
                    var prod = [];
                    var len = list.length;

                    for (var i = 0; i < len; i++) {
                        p = list[i];
                        prod.push(p.product_code);
                    }
                    
                    if (prod.length == 0) {
                        styleRecomAppReturn("search", "");
                        return;
                    }

                    prod = uniqueArray(prod);
                    styleRecomAppReturn("search", (prod.splice(0, 50)).join());*/
				},
				error: function (data) {
					styleRecomLog({
						"goodsNo"	: goods_no,
						"type"		: "search",
						"result"	: "fail"
            		});
				    styleRecomAppReturn("search", "");
					styleRecomSendErrorTclick();
				}
    		});
        }
    });
}


function loadProductList(data) {
	var cb = function(str){
		styleRecomAppReturn("search", str);
	}
	
	var list = [];
	
	if(data.list == undefined){
		cb("");
		return;
	}
	data = data.list;
	
	for(var x in data){
		if(data[x] && data[x].length > 0){
			list = data[x];
			break;
		}
	}
	
	if (list == undefined || list.length == 0) {
		cb("");
		return;
	}
	
	var p;
	var prod = [];
	var len = list.length;

	for (var i=0; i < len; i++) {
		p = list[i];
		prod.push(p.product_code);
	}
	
	if (prod.length == 0) {
		cb("");
		return;
	}

	prod = uniqueArray(prod);
	
	cb(prod.join());
};

/**
 * DB에 로그 쌓기
 */
function styleRecomLog(data){
	var path = "/json/search/m/insertStyleRecoLogInfo.json?call_api=" + data.type + "&isApiResult=" + data.result
			+ "&isApp=true&call_type=detail&goods_no=" + data.goodsNo;
	
	$.ajax({
        url: path,
        type: "GET"
    });
};

/**
 * 에러 티클릭 전송
 */
function styleRecomSendErrorTclick() {
    var now = new Date();
    var h = now.getHours();
    var HH = (h < 10) ? "0" + h : "" + h;
    iframeLoadURL("/exevent/tclick.jsp?tclick=m_RDC_ProdDetail_DataError_" + HH);
}

/** 
 * 앱 맞춤설정 데이터 호출
 */
function getCustomSearchSetting() {
    var customSettingData = "";
    // ex) {"customized":true,"category":[{"ctgName":"여성의류","ctgNo":"5842","on":true}],"brand":[],"color":[]}

    try { // Safari 개인정보보호모드에서는 localStorage 접근시 Exception 발생으로 예외처리
        customSettingData = localStorage.getItem("customSearchSettings"); // 맞춤설정 데이터
    } catch (e) {}

    // OS 별 Native Interface 호출
    if (nativeAppInfo.isApp) { // 앱일 경우
        if (nativeAppInfo.isAndroid) { // AOS
            try {
            	window.lottebridge.customSearch(encodeURIComponent(customSettingData));
            } catch(e) {}
        } else { // iOS
        	location.href = 'lottebridge://customSearch/?' + encodeURIComponent(customSettingData);
        }
    }
}

/** 
 * 앱 맞춤설정 데이터 초기화
 */
function initCustomSearchSetting() {
    try { // Safari 개인정보보호모드에서는 localStorage 접근시 Exception 발생으로 예외처리
        localStorage.removeItem("customSearchSettings"); // 맞춤설정 데이터 삭제
    } catch (e) {}
}

/**
 * GA Key 홀수/짝수 판단
 */
function isGAOddEvenChk() {
    var GACode = getCookie("_ga"),
        GALastChar = 0,
        appReturnVal = 2;
    
    if (GACode) {
        GALastChar = GACode.charAt(GACode.length - 1);
        appReturnVal = parseInt(GALastChar) % 2;
    } else {
        appReturnVal = 2;
    }

    // return appReturnVal; // 짝수면 0, 홀수면 1 리턴, 쿠키 없을 경우나 읽지 못했을 경우 2

    if (nativeAppInfo.isAndroid) { // AOS
        try {
            window.lottebridge.GAOddEvenChk(appReturnVal);
        } catch(e) {}
    } else { // iOS
        location.href = 'lottebridge://GAOddEvenChk/?' + appReturnVal;
    }
}

/** 
 * @name alidoCollectLog
 * @description
 * ALIDO 수집스크립트 (작성자 : 김낙운 / 날짜 : 2018-11-15)
 * @example
 * alidoCollectLog(action,data);
 * @param
 * action,data
 * @param {String} action 수집 데이터 각 페이지 구분
 * @param {Object} data 수집 데이터 용 데이터
 */
function alidoCollectLog(data, action) {
    // 라이브러리 호출용
    var alidoLibSrc = '//js-collect.alido.co.kr/js/v1/alido-collect.init.js',
        body = angular.element('body')[0],
        scr = document.createElement('script');

    scr.type = 'text/javascript',
    scr.src = (location.host.indexOf("mo2.lotte.com") >=0 || location.host.indexOf("localhost") >=0 ) ? 'http:' + alidoLibSrc : 'https:' + alidoLibSrc;
    body.appendChild(scr);

    // 수집데이터용
    var alidoData = JSON.parse(data),
        alidoItemList = [];



    scr.onload = function() {
        // 초기 공통 셋팅
        alido('service',{
            'cuid' : 'lotte.com',
            'authkey' : 'e86120208b56bfbd5cdfa5014b4efabd57dc64f69df2c6fadecdce44d6b29398',
            'sid' : 'service-id-1',
            'uid' : null
        });

        // 일반 상품상세용 셋팅
        if (action == 'prdView') {
            // 기획전일 경우 데이터 정보 다름(브랜드 번호, 브랜드명)
            if(alidoData.goodsCmpsCd == 10 || alidoData.goodsCmpsCd == 30){
                alido('view',{
                    'available' : alidoData.saleStatCd == '10' ? 'Y' : 'N', // 상품판매가능여부
                    'brandId' : '999999',                                       // 브랜드ID
                    'categoryId1' : alidoData.categoryId1,       // 카테고리ID1
                    'categoryId2' : alidoData.categoryId2,       // 카테고리ID2
                    'categoryId3' : alidoData.categoryId3,       // 카테고리ID3
                    'categoryName1' : alidoData.categoryId1,     // 카테고리명1
                    'categoryName2' : alidoData.categoryId2,     // 카테고리명1
                    'categoryName3' : alidoData.categoryId3,     // 카테고리명1
                    'currency' : 'KRW',                                         // 통화
                    'itemId' : alidoData.itemId.toString(),    // 상품ID
                    'itemTitle' : alidoData.itemTitle,               // 상품설명
                    'price' : (alidoData.price != undefined ? alidoData.price : alidoData.salePrice),   // 가격
                    'salePrice' : alidoData.salePrice             // 판매가격
                });
                
                console.log(
                    "%c[ALIDO " + action + " data]" +
                    "%cgoodsCmpsCd : %c" + alidoData.goodsCmpsCd + 
                    "%c, saleStatCd : %c" + alidoData.saleStatCd + 
                    "%c, categoryId1 : %c" + alidoData.categoryId1 +
                    "%c, categoryId2 : %c" + alidoData.categoryId2 +
                    "%c, categoryId3 : %c" + alidoData.categoryId3 +
                    "%c, itemId : %c" + alidoData.itemId +
                    "%c, itemTitle : %c" + alidoData.itemTitle +
                    "%c, price : %c" + alidoData.price +
                    "%c, salePrice : %c" + alidoData.salePrice,
                    "background:yellow;color:black;font-weight:bold;", // TITLE
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;" // value
                );
            }else{
                alido('view',{
                    'available' : alidoData.saleStatCd == '10' ? 'Y' : 'N', // 상품판매가능여부
                    'brandId' : alidoData.brandId,        // 브랜드ID
                    'brandName' : alidoData.brandName,      // 브랜드명
                    'categoryId1' : alidoData.categoryId1,       // 카테고리ID1
                    'categoryId2' : alidoData.categoryId2,       // 카테고리ID2
                    'categoryId3' : alidoData.categoryId3,       // 카테고리ID3
                    'categoryName1' : alidoData.categoryId1,     // 카테고리명1
                    'categoryName2' : alidoData.categoryId2,     // 카테고리명1
                    'categoryName3' : alidoData.categoryId3,     // 카테고리명1
                    'currency' : 'KRW',                                         // 통화
                    'itemId' : alidoData.itemId.toString(),    // 상품ID
                    'itemTitle' : alidoData.itemTitle,               // 상품설명
                    'price' : alidoData.price != undefined ? alidoData.price : alidoData.salePrice, // 가격
                    'salePrice' : alidoData.salePrice             // 판매가격
                });
                
                console.log(
                    "%c[ALIDO " + action + " data]" +
                    "%cgoodsCmpsCd : %c" + alidoData.goodsCmpsCd + 
                    "%c, saleStatCd : %c" + alidoData.saleStatCd + 
                    "%c, brandId : %c" + alidoData.brandId +
                    "%c, brandName : %c" + alidoData.brandName +
                    "%c, categoryId1 : %c" + alidoData.categoryId1 +
                    "%c, categoryId2 : %c" + alidoData.categoryId2 +
                    "%c, categoryId3 : %c" + alidoData.categoryId3 +
                    "%c, itemId : %c" + alidoData.itemId +
                    "%c, itemTitle : %c" + alidoData.itemTitle +
                    "%c, price : %c" + alidoData.price +
                    "%c, salePrice : %c" + alidoData.salePrice,
                    "background:yellow;color:black;font-weight:bold;", // TITLE
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;" // value
                );
            };
        }

        // 상품상세 장바구니담기용 셋팅
        if (action == 'prdCartAdd') {
            // 기획전일 경우 상품번호가 다른 상품이 여러개 담길 수 있기 때문에 분기 처리
            if(alidoData.goodsCmpsCd == 10 || alidoData.goodsCmpsCd == 30){
                for (var i = 0;i < alidoData.itemList.length; i++) { // 상품 선택수 만큼 반복문 돌리기
                    alidoItemList.push({    
                        itemId : alidoData.itemList[i].itemId.toString(),
                        totalPrice : alidoData.itemList[i].totalPrice,
                        currency : 'KRW'
                    });
                }
                alido('cart',{
                    'action' : 'ADD',
                    'itemList' : alidoItemList
                });

                console.log(
                    "%c[ALIDO " + action + " data]" +
                    "%cgoodsCmpsCd : %c" + alidoData.goodsCmpsCd + 
                    "%c, itemList : %c" + JSON.stringify(alidoItemList),
                    "background:yellow;color:black;font-weight:bold;", // TITLE
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;" // value
                );
            }else{ // 단품 상품은 옵션마다 다르게 담길순 있으나 상품번호는 동일함
                alido('cart',{
                    'action' : 'ADD',
                    'itemList' : [{
                        'itemId': alidoData.itemList[0].itemId.toString(), // 상품ID
                        'totalPrice' : alidoData.itemList[0].totalPrice,      // 전체가격
                        'currency' : 'KRW'                                          // 통화
                    }]
                });
                
                console.log(
                    "%c[ALIDO " + action + " data]" +
                    "%cgoodsCmpsCd : %c" + alidoData.goodsCmpsCd + 
                    "%c, itemId : %c" + alidoData.itemList[0].itemId + 
                    "%c, totalPrice : %c" + alidoData.itemList[0].totalPrice,
                    "background:yellow;color:black;font-weight:bold;", // TITLE
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;", // value
                    "background:yellow;color:black;", // key
                    "background:yellow;color:red;font-weight:bold;" // value
                );
            }

        }
        
        // 검색결과용 셋팅
        if (action == 'search') {
            var itemLength = alidoData.itemList.length < 10 ? alidoData.itemList.length : 10; // 검색결과가 10개이상일 경우 10개만 보냄

            for (var i = 0;i < itemLength; i++) { // 상품 선택수 만큼 반복문 돌리기
                alidoItemList.push({    
                    itemId : alidoData.itemList[i],    // 상품ID
                });
            }

            alido('search',{
                'searchtxt' : alidoData.searchtxt,
                'itemList' : [{
                    'itemId': alidoItemList // 상품ID
                }]
            });

            console.log(
                "%c[ALIDO " + action + " data]" +
                "%csearchtxt : %c" + alidoData.searchtxt + 
                "%c, itemList : %c" + JSON.stringify(alidoItemList),
                "background:yellow;color:black;font-weight:bold;", // TITLE
                "background:yellow;color:black;", // key
                "background:yellow;color:red;font-weight:bold;", // value
                "background:yellow;color:black;", // key
                "background:yellow;color:red;font-weight:bold;" // value
            );
        }
    };
    console.log(
        "%c[ALIDO data]" +
        "%cdata : %c" + JSON.stringify(data) + 
        "%c, action : %c" + action,
        "background:yellow;color:black;font-weight:bold;", // TITLE
        "background:yellow;color:black;", // key
        "background:yellow;color:red;font-weight:bold;", // value
        "background:yellow;color:black;", // key
        "background:yellow;color:red;font-weight:bold;" // value
    );
}