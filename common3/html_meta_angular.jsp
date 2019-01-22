<%@ page import="com.lotte.mobile.common.util.LotteUtil"%>
<%@ page import="com.lotte.mobile.common.CookieUtil"%>
<%
	String reqURI = request.getRequestURI(); // 현재 URL
	String pubVersion = "";
	String CosmeAccCode = "";
	String domain_name = LotteUtil.isEllotte(request) ? "m.ellotte.com" : "m.lotte.com";

	// 20160428 박형윤 크리터시즘 로그인 아이디 수집을 위한 로그인 아이디 체크
	CookieUtil crittercismCookieUtil = new CookieUtil(request);
	String crittercismLoginId = crittercismCookieUtil.getValue("loginId");
	String isCrittercismLogin = crittercismLoginId == "" || crittercismLoginId == null ? "N" : "Y";
%>

<!-- favicon -->
<%
	if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request)) { // 롯데닷컴
%>
	<link rel="apple-touch-icon" href="/lotte/lotte-touch-icon.png" />
<%
	} else if (!LotteUtil.isEllotte(request) && LotteUtil.isB2B(request)) { // B2B
%>
	<link rel="apple-touch-icon" href="/lotte/b2b-touch-icon.png" />
<%
	} else { // 엘롯데
%>
	<link rel="apple-touch-icon" href="/ellotte/ellotte-touch-icon.png">
<%
	}
%>

<!-- <%=reqURI %> -->
<%
/******************************************************************************************
 * 롯데닷컴
 ******************************************************************************************/
	if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request)) { // 롯데닷컴
		CosmeAccCode = "19";
		pubVersion = "r20160614_1"; // 닷컴 - 공통 파일 버전 변경시 업데이트 필요
%>
	<link rel="stylesheet" type="text/css" href="/lotte/resources/<%=pubVersion%>/common.min.css"/>
	<script src="/lotte/resources/<%=pubVersion%>/common.min.js"></script>
	<script src="/lotte/resources/<%=pubVersion%>/common.tpl.js"></script>
<%
		pubVersion = "r20160602_1"; // 닷컴 - 공통 이외의 리소스 버전 지정이 필요할 경우

		/**
		 * reqURI 리스트
		 * 메인 : /lotte_template/main_phone.jsp
		 * 검색결과 : /search/m/search_list.jsp
		 * 전문관 템플릿 : /lotte_template/mall/spec_mall.jsp
		 * 상품상세 : /product/m/product_view_new.jsp
		 * 구찌 상품 상세 : /product/m/product_view_gucci.jsp
		 * 장바구니 : /mylotte/cart/m/cart_list.jsp
		 * 위시리스트 : /mylotte/wish/m/wish_list.jsp
		 * 주문서 : /view/order/m/order_form.jsp
		 * 주문완료 : /view/order/m/order_complete.jsp
		 * 이벤트 (공짜라면, 친구초대!) : /view/event/katalk.jsp
		 */
		if (reqURI.indexOf("/lotte_template/main_phone.jsp") > -1) { // 닷컴 - 메인
			pubVersion = "r20160614_2";
		} else if (reqURI.indexOf("/lotte_template/mall/special_flavor/special_flavor.jsp") > -1) { // 닷컴 - 전문관
			pubVersion = "r20160608_1";
		} else if (reqURI.indexOf("/lotte_template/product/m/product_view_new.jsp") > -1) { // 닷컴 - 상품상세
			pubVersion = "r20160613_1";
		} else if (reqURI.indexOf("/lotte_template/search/m/search_list.jsp") > -1) { // 닷컴 - 검색 리스트
			pubVersion = "r20160603_1";
		} else if (reqURI.indexOf("/view/order/m/order_form.jsp") > -1) { // 닷컴 - 주문서
			pubVersion = "r20160603_1";
		} else if (reqURI.indexOf("/lotte_template/mall/book/book.jsp") > -1) { // 닷컴 - 전문관 도서
			pubVersion = "r20160607_1";
		} else if (reqURI.indexOf("/lotte_template/mall/gucci/gucci_main.jsp") > -1) { // 닷컴 - 구찌 메인
			pubVersion = "r20160608_2";
		} else if (reqURI.indexOf("/lotte_template/login/m/loginForm.jsp") > -1) { // 닷컴 - 로그인
			pubVersion = "r20160609_1";
		} else if (reqURI.indexOf("/view/login/dormancyInfoFail.jsp") > -1) { // 닷컴 - 로그인실패
			pubVersion = "r20160609_1";
		} else if (reqURI.indexOf("/lotte_template/product/m/product_list.jsp") > -1) { // 닷컴 - 기획전
			pubVersion = "r20160614_1";
		} else if (reqURI.indexOf("/lotte_template/smartpick/pick_list.jsp") > -1) { // 닷컴 - 스마트픽 리스트
			pubVersion = "r20160614_1";
		} else if (reqURI.indexOf("/lotte_template/smartpick/smp_cpn_info.jsp") > -1) { // 닷컴 - 스마트픽 리스트 상세
			pubVersion = "r20160614_1";
		} else if (reqURI.indexOf("/view/order/m/order_cancel_form.jsp") > -1) { // 닷컴 - 주문취소
			pubVersion = "r20160614_1";
		} else if (reqURI.indexOf("/view/mylotte/purchase/m/purchase_list.jsp") > -1) { // 닷컴 - 구매목록
			pubVersion = "r20160614_1";
		} else if (reqURI.indexOf("/view/mylotte/purchase/m/purchase_view.jsp") > -1) { // 닷컴 - 구매상세
			pubVersion = "r20160614_1";
		}

/******************************************************************************************
 * B2B
 ******************************************************************************************/
	} else if (!LotteUtil.isEllotte(request) && LotteUtil.isB2B(request)) { // B2B
		pubVersion = "b2b/r20160609_1"; // B2B - 공통 버전 변경시 업데이트 필요
%>
    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%=pubVersion%>/common.min.css"/>
    <script src="/lotte/resources/<%=pubVersion%>/common.min.js"></script>
    <script src="/lotte/resources/<%=pubVersion%>/common.tpl.js"></script>
<%
		pubVersion = "b2b/r20160428_1"; // B2B - 공통 이외의 리소스 버전 지정이 필요할 경우

		if (reqURI.indexOf("/view/order/m/order_form.jsp") > -1) { // B2B - 주문서
			pubVersion = "b2b/r20160512_3";
		} else if (reqURI.indexOf("/lotte_template/mylotte/cart/m/cart_list.jsp") > -1) { // B2B - 장바구니
			pubVersion = "b2b/r20160609_1";
		} else if (reqURI.indexOf("/view/order/m/order_complete.jsp") > -1) { // B2B - 주문완료
			pubVersion = "b2b/r20160609_1";
		}
/******************************************************************************************
 * 엘롯데
 ******************************************************************************************/
	} else { // 엘롯데
		CosmeAccCode = "320";
		pubVersion = "r20160609_1"; // 엘롯데 - 공통 파일 버전 변경시 업데이트 필요
%>
	<link rel="stylesheet" type="text/css" href="/ellotte/resources/<%=pubVersion%>/common.min.css"/>
	<script src="/ellotte/resources/<%=pubVersion%>/common.min.js"></script>
	<script src="/ellotte/resources/<%=pubVersion%>/common.tpl.js"></script>
<%
		pubVersion = "r20160602_1"; // 엘롯데 - 공통 이외의 리소스 버전 지정이 필요할 경우

		/**
		 * reqURI 리스트
		 * 메인 : /ellotte_template/main_ellotte_phone.jsp
		 * 검색결과 : /search/m/search_list.jsp
		 * 상품상세 : /product/m/product_view_new.jsp
		 * 장바구니 : /mylotte/cart/m/cart_list.jsp
		 * 위시리스트 : /mylotte/wish/m/wish_list.jsp
		 * 주문서 : /view/order/m/order_form.jsp
		 * 주문완료 : /view/order/m/order_complete.jsp
		 */

		if (reqURI.indexOf("/ellotte_template/product/m/product_view_new.jsp") > -1) { // 엘롯데 - 상품상세
			pubVersion = "r20160613_1";
		} else if (reqURI.indexOf("/ellotte_template/login/m/loginForm.jsp") > -1) { // 엘롯데 - 로그인
			pubVersion = "r20160609_1";
		} else if (reqURI.indexOf("/view/login/dormancyInfoFail.jsp") > -1) { // 엘롯데 - 로그인실패
			pubVersion = "r20160609_1";
		} else if (reqURI.indexOf("/ellotte_template/planshop/m/planshop_view.jsp") > -1) { // 엘롯데 - 이벤트기획전
			pubVersion = "r20160610_1";
		} else if (reqURI.indexOf("/ellotte_template/smartpick/pick_list.jsp") > -1) { // 엘롯데 - 스마트픽 리스트
			pubVersion = "r20160614_1";
		} else if (reqURI.indexOf("/lotte_template/smartpick/smp_cpn_info.jsp") > -1) { // 엘롯데 - 스마트픽 리스트 상세
			pubVersion = "r20160614_1";
		} else if (reqURI.indexOf("/view/order/m/order_cancel_form.jsp") > -1) { // 엘롯데 - 주문취소
			pubVersion = "r20160614_1";
		} else if (reqURI.indexOf("/view/mylotte/purchase/m/purchase_list.jsp") > -1) { // 엘롯데 - 구매목록
			pubVersion = "r20160614_1";
		} else if (reqURI.indexOf("/view/mylotte/purchase/m/purchase_view.jsp") > -1) { // 엘롯데 - 구매상세
			pubVersion = "r20160614_1";
		}
	}
%>

<!-- SAS -->
<script src="/common3/js/SpeedTrapInsert.js"></script>

<!-- 20160226 박형윤 크리터시즘 2.5 버전 적용 -->
<script src="/common4/js/lib/crittercismClientLibraryMin_22_2.5.js"></script>
<%
	/*
	Crittercism HTML5 APP ID
	lotte : 550904cce0697fa449637803
	ellotte : 0be71eae04a1469f9e28da25fc210c1200555300
	*/
	String CrittercismHTML5_APPID = "550904cce0697fa449637803"; // 닷컴

	if (LotteUtil.isEllotte(request)) { // 엘롯데
		CrittercismHTML5_APPID = "564d9d968d4d8c0a00d082b5"; // 엘롯데
	} else if (LotteUtil.isB2B(request)) { // B2B
		CrittercismHTML5_APPID = "88c4659fdfe84d33ba3ea581d8bc4ed000555300"; // B2B
	}
%>
<script>

$(document).ready(function () {
	try {
		Crittercism.init({appId: '<%=CrittercismHTML5_APPID%>', appVersion: '20160303_ang'});
		<%
			// 닷컴 특정 사용자 login ID 수집
			if (
				crittercismLoginId.equals("phobhee") || // 임성묵 상무
				crittercismLoginId.equals("dslee93") || // 이동순 수석
				crittercismLoginId.equals("kwownos") || // 권오성 수석
				crittercismLoginId.equals("tenyu") || // 김진우 팀장
				crittercismLoginId.equals("enjoy-ksp") || // 박경식 팀장
				crittercismLoginId.equals("kmu0220") || // 강민웅 팀장
				crittercismLoginId.equals("ecofree") || // 이재훈 팀장
				crittercismLoginId.equals("greatGOD") ||  // 유신 책임
				crittercismLoginId.equals("hshur77") || // 김대흥 팀장
				crittercismLoginId.equals("charie19") || // 신봉기 팀장
				crittercismLoginId.equals("robinbat") || // 김지연 팀장
				crittercismLoginId.equals("knacky") || // 진영란 수석
				crittercismLoginId.equals("japokcomet") || // 박형윤 책임
				crittercismLoginId.equals("charisema") // 김낙운 사원
				) {
		%>
		Crittercism.setUsername('<%=crittercismLoginId%>');
		<%
			}
		%>

		if (location.href && navigator.userAgent) {
			Crittercism.leaveBreadcrumb("User Visited " + location.href); // 사용자 방문 페이지 로깅
			Crittercism.leaveBreadcrumb("User Browser Agent : " + navigator.userAgent); // 사용자 브라우저 UserAgent 로깅
		}
	} catch (e) {}
});
</script>

<!-- 와이즈 로그 -->
<script>
/**
 * WISELOG TRACKING SCRIPT CODE
 * DO NOT MODIFY THIS SCRIPT CODE.
 * COPYRIGHT (C) 1999-2010 NETHRU INC. ALL RIGHTS RESERVED.
 */
(function () {
var nl = document.createElement('script'); nl.type = 'text/javascript';
nl.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + '<%=domain_name%>/common4/js/lib/wl6.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(nl, s);
var done = false;
nl.onload = nl.onreadystatechange = function() {
	if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
		done = true;
		_n_sid = "<%=domain_name%>";
		_n_uid_cookie = "MBRNO";
		n_logging();
		nl.onload = nl.onreadystatechange = null;
	}
}
})();
</script>

<%
/**********************************************************************************
 * Cosem 수집 스크립트
 **********************************************************************************/
if (!LotteUtil.isB2B(request)) { // 롯데닷컴/엘롯데만 적용 (B2B 제외)
%>
<script>
// Cosem Log Gathering Script V.2.0
var cosem_Request = function () {
var cookieDay = 30; // 쿠키설정 날짜
var accountCode = "<%=CosmeAccCode%>";
this.getParameter = function (name) {
	var rtnval = ''; var nowAddress = unescape( location.href ); var parameters = (nowAddress.slice(nowAddress.indexOf('?')+1,nowAddress.length)).split('&');
	for(var i = 0 ; i < parameters.length ; i++){
		var varName = parameters[i].split('=')[0];if(varName.toUpperCase() == name.toUpperCase()){rtnval = parameters[i].split('=')[1]; break;};}; return rtnval;
	}
	this.imageURL = function(){ var cosem = this.getParameter('cosemkid'); var cosem_kid = ""; var cosemProtocol = ( location.protocol=="https:" )? "https:" :"http:";
	if( cosem.length == 0 ) cosem = this.getParameter('cosem');
	if( cosem.length > 0 ) { cosem_kid = "&kid=" + cosem + "&referer=" + encodeURIComponent(location.href);
	var image = new Image(); image.src = cosemProtocol + "//" + "tracking.icomas.co.kr" + "/Script/script3.php" + "?aid="+accountCode+"&ctime=" + cookieDay + cosem_kid;};};
	this.tracking = function( ){ var obj = this; setTimeout( function(){ obj.imageURL(); }, 10); };
};
var cosemRequest = new cosem_Request();
cosemRequest.tracking( );
</script>
<%
}
%>

<%
/**********************************************************************************
 * DAP 수집 스크립트
 **********************************************************************************/
if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request)) { // 롯데닷컴만 적용 DPA 수집 스크립트 적용
%>
<script>
// Facebook Pixel Code (DPA)
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,"script","//connect.facebook.net/en_US/fbevents.js");

try {
	fbq("init", "500204110159268");
	fbq("track", "PageView");
} catch (e) {
	console.log("Facebook Pixel Script Error.");
}
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=500204110159268&ev=PageView&noscript=1"/></noscript><!-- Facebook Pixel Code (DPA) noscript -->
<%
}
%>

<jsp:include page="/common3/common_angular.jsp" />