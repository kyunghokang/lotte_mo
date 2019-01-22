<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<%@ page import="com.lotte.mobile.common.CookieUtil" %>
<%@ page import="java.util.Date" %>
<%@ page import="com.lotte.mobile.common.util.*"%>
<%
String curr_date = DateUtil.today("yyyyMMdd");
String curr_time = DateUtil.today("yyyyMMddHH");
CookieUtil cookieUtil 	= new CookieUtil(request); 

//회원정보 수정을 위한 정보
String custid = cookieUtil.getValue("custid");
String loginid = cookieUtil.getValue("LOGINID");
String mbr_sct_cd = cookieUtil.getValue("MBRSCTCD");
String mbr_info_chg = ConvertUtil.NVL(cookieUtil.getValue("mbr_info_chg"), ConstCode.BOOLEAN_FALSE); // 회원정보 수정/탈퇴를 위한 로그인을 한적이 있는지
String f_custid = (new com.lotte.member.bean.ctm.secure.SeedUtil(LotteUtil.SEED_DEFAULT_PATH, "FAMILY").getSeedEncData(curr_time+"|"+custid));

%>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴</title>
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="pragma" content="no-cache">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">

    <script>
    var APP_KEY = "7fa1e44757a94fd89921";
    var SERVER_TIME = new Date();
    var SEED_DATA = '<%=f_custid%>';
    </script>

    <%@include file="/common3/angular_common_include.jsp"%>
    <% if (LOTTE_DEVEL_MODE) { %>
    <!-- common css -->
    <%@include file="/angular_common/lotte_common_css.jsp"%>

    
    <!-- 이 화면에서 쓰이는 CSS -->
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/mylotte/mylotte.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/mylotte/popup_mem_edit.css"/>

    <!-- common js -->
    <%@include file="/angular_common/lotte_common_js.jsp"%>
    
    <!-- 이 화면에서 쓰이는 JS -->
    <script src="/lotte/resources_dev/mylotte/m/mylotte_main.js"></script>

    <% } else {  %>
    	<%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/mylotte.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/mylotte.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/mylotte.tpl.js"></script>
    <% } %>

</head>
<body ng-controller="MyLotteMainCtrl">
    <lotte-coupon-layer></lotte-coupon-layer>
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
		<sub-header></sub-header>
		        
        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
        <lotte-today-other-alarm></lotte-today-other-alarm>
    </div>
    
    <lotte-search></lotte-search>
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>
    <lotte-smartwindow></lotte-smartwindow>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>