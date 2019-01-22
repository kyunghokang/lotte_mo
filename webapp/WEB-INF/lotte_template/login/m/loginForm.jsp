<%@ page language="java" contentType="text/html;charset=utf-8"  %>
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
    </script>
    <%@include file="/common3/angular_common_include.jsp"%>
    <% if (LOTTE_DEVEL_MODE) { %>
    <!-- common css -->
    <%@include file="/angular_common/lotte_common_css.jsp"%>
    
    <!-- 이 화면에서 쓰이는 CSS -->
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/login/login.css"/>
    
    <!-- common js -->
    <%@include file="/angular_common/lotte_common_js.jsp"%>
    
    <!-- 이 화면에서 쓰이는 JS -->
    <script src="/lotte/resources_dev/login/login_form.js"></script>

    <% } else {  %>
    	<%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/loginForm.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/loginForm.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/loginForm.tpl.js"></script>
    <% } %>
</head>
<body ng-controller="loginFormCtrl" ng-class="{app:smp_yn}">
	<form id="frm_send" name="frm_send" method="post">
		<%		
		java.util.Enumeration<String> enu = request.getParameterNames();
		while(enu.hasMoreElements()) {
			String param_name;
			param_name = enu.nextElement();
		%>		
		<input type="hidden" name="<%=param_name %>" value="<%=request.getParameter(param_name) %>">
		<% 
		}
		%>
		<input type="hidden" name="grockle_yn" value="N" ng-if="grockle_yn==false" ng-show="grockle_yn==true"><!-- 비회원여부 -->	
		<input type="hidden" name="grockle_yn" value="Y" ng-if="grockle_yn==true" ng-show="grockle_yn==false"><!-- 비회원여부 -->
		<input type="hidden" name="grockle_mbr_no" value="">
		<input type="hidden" name="mbrIP" value="<%=request.getRemoteAddr()%>">
		
	</form>
    <div id="wrapper" ng-show="showWrap">
        <lotte-header ng-if="!smp_yn"></lotte-header>
        <lotte-search></lotte-search>
        <sub-header></sub-header>

        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>

    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar ng-if="!smp_yn"></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>