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

/**
 * 상품상세 기술서 iframe, 사이즈조견표 처리
 */
function prdDetailInfoModified($wrapperTarget, $targets) {
    if (!$wrapperTarget || !$targets) {
        return false;
    }

    $targets.each(function (idx, entry) {
        var $win = $(window),
            $wrapper = null,
            $entry = null,
            $scrollBox = null,
            $l_arrow = null,
            $r_arrow = null,
            wrapperGap = 0,
            arrowMiddleFlag = false,
            arrowTopPos = 50,
            ratio = 1,
            wrapperHeight = 0,
            contentWidth = 0,
            contentHeight = 0,
            winWidth = $win.width(),
            showScrollArrow = function () {},
            wrappingDOMHandler = function () {},
            resizeEvtHandler = function () {};

        if (entry.tagName == "TABLE") {
            $wrapper = $('<div class="prddetail_scrollwrap"></div>');
            $entry = $(entry);
            $scrollBox = $('<div class="prddetail_scrollbox"></div>');
            $l_arrow = $('<span class="scroll_arrow left">&lt;</span>');
            $r_arrow = $('<span class="scroll_arrow right">&gt;</span>');

            showScrollArrow = function () {
                var scrollLeft = $scrollBox.scrollLeft();
                contentWidth = $entry.outerWidth();

                if (scrollLeft > 5) {
                    $l_arrow.stop().css("opacity", 0).show().animate({opacity: 1}, 1000);
                    $wrapper.addClass("left_scroll");
                } else {
                    $wrapper.removeClass("left_scroll");
                    $l_arrow.hide();
                }

                if (scrollLeft + 5 < contentWidth - $scrollBox.width()) {
                    $r_arrow.stop().css("opacity", 0).show().animate({opacity: 1}, 1000);
                    $wrapper.addClass("right_scroll");
                } else {
                    $wrapper.removeClass("right_scroll");
                    $r_arrow.hide();
                }
            };

            wrappingDOMHandler = function () {
                $entry.after($wrapper);
                $wrapper.append($scrollBox.append($entry), $l_arrow, $r_arrow);
                $scrollBox.on("scroll", showScrollArrow);

                resizeEvtHandler();
                showScrollArrow();
            };

            resizeEvtHandler = function () {
                if (winWidth == $win.width()) {
                    return false;
                }

                winWidth = $win.width();
                contentWidth = $entry.outerWidth();
                contentHeight = $entry.outerHeight();

                if (arrowMiddleFlag) {
                    $l_arrow.css("top", contentHeight / 2 - $l_arrow.height() / 2);
                    $r_arrow.css("top", contentHeight / 2 - $r_arrow.height() / 2);
                } else {
                    $l_arrow.css("top", arrowTopPos);
                    $r_arrow.css("top", arrowTopPos);
                }

                if ($entry.width() > winWidth - wrapperGap) {
                    $scrollBox.attr("style", "max-width:100%;overflow-x:scroll;width:" + (winWidth - wrapperGap) + "px !important");
                    $l_arrow.show();
                    $r_arrow.show();
                } else {
                    $scrollBox.removeAttr("style");
                    $l_arrow.hide();
                    $r_arrow.hide();
                }
            };
        } else if (entry.tagName == "IFRAME") {
            $wrapper = $('<div class="resizer"></div>');
            $entry = $(entry);
            
            wrappingDOMHandler = function () {
                $entry.after($wrapper);
                $wrapper.append($entry);
            };
            
            resizeEvtHandler = function () {
                ratio = $wrapperTarget.width() / $entry.width();
                wrapperHeight = $entry.height() * ratio;

                if (ratio < 1) {
                    $entry.css({
                        "-transform-origin": "0 0",
                        "transform": "scale(" + ratio + ", " + ratio + ")",
                    });

                    $wrapper.attr("style", "overflow:hidden;height:" + Math.round(wrapperHeight) + "px !important");
                }
            };
        }

        wrappingDOMHandler();
        resizeEvtHandler();
        $win.on("resize.prdDetailInfoModified", resizeEvtHandler);
    });
}

prdDetailInfoModified($("#detailLayout"), $("#detailLayout iframe, #detailLayout .size_guide_wrap .tabel_list_wrap >table")); // 상품기술서 iframe, 사이즈 조견표 처리

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

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

// a 링크 APP 인터페이스로 변경
function changeAppLink() {
    var linkParam = location.search,
        baseParam = ""; // c=&udid=&v=&schema=&cdn=

    // var url = new URL(location.href),
    //     c = url.searchParams.get("c") ? url.searchParams.get("c") : "",
    //     udid = url.searchParams.get("udid") ? url.searchParams.get("udid") : "",
    //     v = url.searchParams.get("v") ? url.searchParams.get("v") : "",
    //     schema = url.searchParams.get("schema") ? url.searchParams.get("schema") : "",
    //     cn = getCookie("CHLNO") != null ? getCookie("CHLNO") : (url.searchParams.get("cn") ? url.searchParams.get("cn") : ""),
    //     cdn = getCookie("CHLDTLNO") != null ? getCookie("CHLDTLNO") : (url.searchParams.get("cdn") ? url.searchParams.get("cdn") : "");

    baseParam += "c=" + (getUrlParameter("c") ? getUrlParameter("c") : "");
    baseParam += "&udid=" + (getUrlParameter("udid") ? getUrlParameter("udid") : "");
    baseParam += "&v=" + (getUrlParameter("v") ? getUrlParameter("v") : "");;
    baseParam += "&schema=" + (getUrlParameter("schema") ? getUrlParameter("schema") : "");
    baseParam += "&cn=" + (getUrlParameter("cn") ? getUrlParameter("cn") : "");
    baseParam += "&cdn=" + (getUrlParameter("cdn") ? getUrlParameter("cdn") : "");

    $("#detailLayout").find("a, area").each(function (idx, entry) {
        var href = $(entry).attr("href") + "",
            targetLink = href.indexOf("?") > -1 ? href + "&" + baseParam : href + "?" + baseParam,
            outlinkFlag = ($(entry).attr("target") + "").toLowerCase() == "_blank";

        if (href.indexOf("http") > -1 && href.indexOf("lotte.com") == -1) {
            outlinkFlag = true;
        }

        try {
            if (nativeAppInfo.isIOS) {
                if (outlinkFlag) { // 외부 링크 여부
                    $(entry).removeAttr("target");
                    $(entry).attr("href", "lottebridge://outlink/?" + encodeURIComponent(targetLink));
                } else {
                    $(entry).attr("href", "lottebridge://gotourl/?" + encodeURIComponent(targetLink));
                }
            } else {
                // $(entry).removeAttr("href");
                
                if (outlinkFlag) { // 외부 링크 여부
                    $(entry).removeAttr("target");
                    $(entry).attr("href", "javascript:window.lottebridge.outlink('" + targetLink + "');");
                } else {
                    $(entry).attr("href", "javascript:window.lottebridge.gotourl('" + targetLink + "');");
                }
            }
        } catch (e) {
            console.error("APP Interface 호출 오류");
        }
    });
}

// 링크 변경
changeAppLink();

var $detailLayout = $("#detailLayout"),
    documentHeight = 0;

// APP Schema 호출 (Webview 높이 재계산)
function resizeWebview() {
    if (documentHeight != $detailLayout.outerHeight()) {
        documentHeight = $detailLayout.outerHeight();
    
        try {
            if (nativeAppInfo.isIOS) {
                window.location.href = "lottebridge://webheight/?" + documentHeight
            } else {
                window.lottebridge.webheight(documentHeight);
            }
            // console.log("APP Interface 호출", documentHeight);
        } catch (e) {
            console.error("APP Interface 호출 오류");
        }
    }
}

var totImgCnt = $detailLayout.find("img").length, // 전체 이미지 개수
    imgLoadCnt = 0, // 로드/로드실패 된 이미지 개수
    apiCallFlag = false, // API 호출 여부
    apiCallFlag2000 = false; // API 호출 여부

// console.log("totImgCnt", totImgCnt);
$detailLayout.find("img").one("load error", function () {
    imgLoadCnt++;
    // console.log("이미지로드 완료/실패");
    // console.log("totImgCnt: ", totImgCnt, "imgLoadCnt: ", imgLoadCnt);
    // resizeWebview();

    // 이미지 로드 중 2000픽셀 이상일 경우 우선 앱API 한번 호출 (더보기 버튼 노출을 위하여)
    if (!apiCallFlag2000 && $detailLayout.outerHeight() > 2000) {
        apiCallFlag2000 = true;
        // console.log("웹뷰 2000px 이상 인터페이스 호출");
        resizeWebview();
    }
    
    if (!apiCallFlag && imgLoadCnt > 0) {
        apiCallFlag = true;
        resizeWebview();
    }

    if (totImgCnt == imgLoadCnt) {
        // console.log("이미지 전체 로드 완료");
        resizeWebview();
    }
});

$(window).one("load resize", function () {
    // console.log("페이지 로드 완료, 화면 리사이즈");
    resizeWebview();
});

if (totImgCnt == 0) {
    // console.log("이미지 없음, 인터페이스 호출");
    resizeWebview();
}