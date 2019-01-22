<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<%@ page import="java.util.Enumeration" %>
<%
Enumeration param = request.getParameterNames();
String reqName = "";
String reqValue = "";
%>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴-product_wine_buy_view</title>
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="pragma" content="no-cache">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">

    <script>
    var APP_KEY = "7fa1e44757a94fd89921";
    var SERVER_TIME = new Date();
    </script>
	<!-- JSP 영역 -->
    <%@include file="/common3/angular_common_include.jsp"%>
    <% if (LOTTE_DEVEL_MODE) { %>
    <!-- common css -->
    <%@include file="/angular_common/lotte_common_css.jsp"%>
    
    <!-- 이 화면에서 쓰이는 CSS -->
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/product/m/detail.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/product/m/detail_datepicker.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/product/m/detail_popup.css">
    
    <!-- common js -->
    <%@include file="/angular_common/lotte_common_js.jsp"%>
    
    <!-- 이 화면에서 쓰이는 JS -->
    <script src="/lotte/resources_dev/product/m/product_wine_buy_view.js"></script>
    <% } else {  %>
	    <%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/product_wine_buy_view.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/product_wine_buy_view.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/product_wine_buy_view.tpl.js"></script>
    <% } %>
</head>
<body ng-controller="ProductWindSmartpicCtrl">
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <lotte-search></lotte-search>
        <sub-header></sub-header>

        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>
	<form name="smp_frm">	
<%
while(param.hasMoreElements()) {
	reqName = (String)param.nextElement();
	reqValue = request.getParameter(reqName);
	if("null".equals(reqValue)) {
		reqValue = "";
	}
	out.println("\t\t<input type=\"hidden\" name=\""+reqName+"\" ng-model=\"postdata."+reqName+"\" ng-init=\"postdata."+reqName+"='"+reqValue+"'\" value=\"{{postdata."+reqName+"}}\" />");
}
%>
	</form>
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>