<%@ page import="com.lotte.mobile.common.util.LotteUtil"%>
<%
String reqURI = request.getRequestURI(); // 현재 URL
String reqProtocol = request.getProtocol(); // Protocol 확인 (HTTP/1.1)
Boolean isSecure = false; // 현재 페이지가 Secure(HTTPS) 인지 확인

if (request.isSecure()) {
	isSecure = true;
}

String pubVersion = "";
String domain_name = "m.lotte.com";

// Favicon
String faviconIcon = "/ellotte/ellotte-touch-icon.png"; // 닷컴용 Favicon
String faviconSiteNo = request.getParameter("site_no") == null ? "" : (String)request.getParameter("site_no");
%>
<link rel="apple-touch-icon" href="<%=faviconIcon%>" />
<link rel="stylesheet" type="text/css" href="/common3/css/lotte.inc" /><!-- DDOS 최초 로드 방어 -->
<!-- <%=reqURI %> -->
<!-- Secure : <%=isSecure %> -->
<%
/******************************************************************************************
* 엘롯데
******************************************************************************************/
// 엘롯데
pubVersion = "rm20181022_2"; // 엘롯데 - 공통 파일 버전 변경시 업데이트 필요

if (isSecure) {
%>
<link rel="stylesheet" type="text/css" href="/ellotte/resources/<%=pubVersion%>/common_secure.min.css" />
<script src="/ellotte/resources/<%=pubVersion%>/common_secure.min.js"></script>
<script src="/ellotte/resources/<%=pubVersion%>/common_secure.tpl.js"></script>
<%
} else {
%>
<link rel="stylesheet" type="text/css" href="/ellotte/resources/<%=pubVersion%>/common.min.css" />
<script src="/ellotte/resources/<%=pubVersion%>/common.min.js"></script>
<script src="/ellotte/resources/<%=pubVersion%>/common.tpl.js"></script>
<%	
}

pubVersion = "rm20181022_2"; // 엘롯데 - 공통 이외의 리소스 버전 지정이 필요할 경우

//if (reqURI.indexOf("/ellotte_template/main_ellotte_phone.jsp") > -1) { // 엘롯데 - 메인
//	pubVersion = "r20180830_1";
//} else if (reqURI.indexOf("/ellotte_template/mylotte/cscenter/m/cash_bill_list.jsp") > -1) { // 엘롯데 - 영수증
//	pubVersion = "r20180801_2";
//}
%>
 
<jsp:include page="/common3/common_angular.jsp" />