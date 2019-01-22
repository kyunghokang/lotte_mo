/*
App 이 호출하는 함수
1.showSideCtg (좌측 카테고리 레이어)
2.openSideMylotte (마이롯데 레이어)
3.openSrhLayer (검색 레이어)
4.removeLatestItems (최근 본 상품 전체 삭제)

앱스 보이기 감추기
window.lottebridge.appsIcon("lottebridge://lotteapps/hide"); 
window.lottebridge.appsIcon("lottebridge://lotteapps/show");
*/
var isLogin = false,
    baseParam = "",
    isApp = false;

function loginChk() {
	return isLogin;
}

/*Device check*/
var isIOS = (/ipad|iphone/i.test(navigator.userAgent.toLowerCase())),
	isIphone = (navigator.userAgent.match('iPhone') != null),
	isIpad = (navigator.userAgent.match('iPad') != null),
	isAndroid = (navigator.userAgent.match('Android') != null),
	isTablet = (/ipad|xoom|sm-t800|sm-t320|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));
/*App check*/
/*
schema 조건 jsp 쪽 확인필요 - 앱조건에서 삭제함 : && searchToJson().schema != undefined && searchToJson().schema != ""
*/

/*if(searchToJson().udid != undefined && searchToJson().udid != ""){
    isApp = true;
}*/

/*액션바를 숨길 페이지 목록(APP일 경우 native 호출을 막는다.)*/
var hiddenUrl = [
    // 상품상세 
    "/product/m/product_view."          
    // 상품상세(기획전형)
    ,"/product/m/select_product_view."  
    // 상품상세(와인)
    ,"/product/m/product_wine_view."    
    // 상품상세(구찌) 
    ,"/product/m/product_view_gucci."   
    // 상품상세 확대보기 
    ,"/product/m/product_detail."       
    // 사은품선택 
    ,"/product/m/select_present."       
    // imall사은품선택 
    ,"/product/m/imall_select_present." 
    // 주문서 
    ,"/order/m/order_form."             
    // imall주문서 
    ,"/order/m/imall_order_form."       
];
var hiddenFlag = false;
for( var i = 0; i < hiddenUrl.length; i++ ){
    var h_url = hiddenUrl[i];
    if( location.pathname.indexOf(h_url) >= 0 ){
        hiddenFlag = true;
        break;
    }
}

/* scope 가져오기*/
function getScope(ctrl){
    var appElement = angular.element('[ng-app=app]');
    if (ctrl == undefined){
        return  appElement.scope().$$childHead;
    }
    var conElement = appElement.find('[ng-controller='+ctrl+']');
    return  conElement.scope();
}

/**
 * 앵귤러 서비스 구하기
 * @param name 서비스명
 * @returns 앵귤러 서비스
 */
function getNGService(name){
	if(name == undefined){ return null; }
	try{
		var injector = angular.element(document.body).injector();
		return injector.get(name);
	}catch(e){ return null; }
}

/**
 * 페이지 URL 구하기
 * @param name 페이지명
 */
function getServicePath(name){
	return getNGService("LotteCommon")[name];
}

/*카테고리(native call)*/
function showSideCtg() { 
    var scope = getScope();
    scope.$apply(function() {
        scope.showSideCategory();
    });
}

/* LotteSlide 관련 compile 문제 (angularjs 정리 필요) */
function commonLink(th){
	var url = th.parent().attr("data-link");
	location.href = url + (url.indexOf("?") > 0?"&":"?") + baseParam + "&tclick=" + th.parent().attr("data-tclick") + (parseInt(th.parent().attr("data-cnum")) + 1);
}

// MyLotte 레이어(native call) (기존 마이레이어는 우측이지만 수정되는 마이레이어는 하단임)
// 20161116 박형윤 사용안하는 Func. 확인 완료 내용 삭제
function openSideMylotte() {
    // var scope = getScope();
    // scope.$apply(function() {
    //     scope.openSideMylotte();
    // });
}

/*검색 ipad에서만 호출(나머지는 네이티브로 구현되어 있음) : openSrhLayer() (native call)*/
function openSrhLayer() {
	var scope = getScope();
    scope.$apply(function() {
    	scope.showSrhLayer();
    });
}

/*설정(native call) - (app 이 혼자 열고 닫기때문에 닫기 scheme 가 없음)*/
function showAppConfig() {
    if ((/android/gi).test(navigator.appVersion)) {  /*Android*/
        window.lottebridge.opensetting("on");
    } else if ((/iphone|ipad/gi).test(navigator.appVersion)) { /*iOS*/
        location.href="lottebridge://opensetting/on";
    };
}
/*최근본상품 전체삭제(native call)*/
function removeLatestItems(){
    localStorage.removeItem("viewGoods");
    if (isIOS){
        window.location='lottebridge://viewlatestitems/viewGoods=';
    }else if(isAndroid){
        window.JsObject.callAndroid('viewGoods=');
    }
    setTimeout(function(){
        alert("삭제되었습니다.");
        //location.href = LotteCommon.mainUrl + "?" + baseParam;
    }, 1000);
}

/*음성검색-안드로이드*/
function voiceSearch(){
	window.voicesearch.callAndroid();
}

function goLogin() {
//    self.location.href = "https://m.lotte.com/login/loginForm.do?"+baseParam+"&tclick=m_footer_log&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
	//2015.11.06 신홍균 angular Merge작업화면에서 사용중
	self.location.href = "/login/loginForm.do?"+baseParam+"&tclick=m_footer_log&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
}

/*디바이스 체크*/
function chk_device() {
    var device = "android";
    var agent = (navigator.userAgent).toLowerCase();
    if( agent.indexOf("iphone") >= 0 || agent.indexOf("ipod") >= 0 || agent.indexOf("ipad") >= 0 ) {
        device = "iOS";
    }
    return device;
}

/*out link*/
function outLink(url) {
    if(isApp) {
        if(isIOS) {
            if(url.match("https://")) {
                url = url.replace("https://", "");
                window.location = "family://" + url;
            } else if(url.match("http://")) {
                url = url.replace("http://", "");
                window.location = "lecsplatform://" + encodeURIComponent(url);
            }
        } else if(isAndroid) {
            window.lecsplatform.callAndroid(encodeURIComponent(url));
        }
    } else {
        window.open(url);
    }
}

/*기획전 html의 링크 url 변경*/
$("#mobile_html a").each(function(){
    var href = $(this).attr("href");
    if(href.indexOf("javascript") < 0){
        if(href.indexOf("?") > -1){
            $(this).attr("href", href+"&"+"c=mlotte&udid=1234&v=&cn=&cdn=");
        }else{
            $(this).attr("href", href+"?"+"c=mlotte&udid=1234&v=&cn=&cdn=");
        }
    }
});