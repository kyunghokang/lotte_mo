<%@ page language="java" contentType="text/html;charset=utf-8"%>
<%
String resourcesRoot = LotteUtil.isEllotte(request) ? "/ellotte" : "/lotte";
String pageTile = resourcesRoot.equals("/ellotte") ? "ellotte" : "롯데닷컴";
%>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title><%=pageTile %></title>
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="pragma" content="no-cache">
    <meta name="viewport" content="width=device-width,maximum-scale=3.0,initial-scale=1.0,user-scalable=yes">
    <meta name="format-detection" content="telephone=no">

    <script>
    var APP_KEY = "7fa1e44757a94fd89921";
    var SERVER_TIME = new Date();
    </script>
	<!-- JSP 영역 -->
    <%@include file="/common3/angular_common_include.jsp"%>
    <% if (LOTTE_DEVEL_MODE) { %>
    <!-- common css -->
    	<% if(! LotteUtil.isEllotte(request)){ %>
		    <%@include file="/angular_common/lotte_common_css.jsp"%>		   
		    <%@include file="/angular_common/lotte_common_js.jsp"%>
		<% }else{ %>
		    <%@include file="/angular_common/ellotte_common_css.jsp"%>
		    <%@include file="/angular_common/ellotte_common_js.jsp"%>
		<% } %>
     
    <!-- 이 화면에서만 쓰이는 CSS -->
	<link rel="stylesheet" href="<%=resourcesRoot%>/resources_dev/product/m/detail.css"/>
	<link rel="stylesheet" href="<%=resourcesRoot%>/resources_dev/product/m/detail_popup.css"/>
    <!--// 이 화면에서만 쓰이는 CSS -->
        
    <!-- 이 화면에서 쓰이는 JS -->
    <script src="<%=resourcesRoot%>/resources_dev/product/m/product_view_popup.js"></script>

    <% } else {  %>
    	<%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" href="<%=resourcesRoot%>/resources/<%= pubVersion %>/product_detail_new.min.css"/>
	    <script src="<%=resourcesRoot%>/resources/<%= pubVersion %>/product_detail_new.min.js"></script>
	    <script src="<%=resourcesRoot%>/resources/<%= pubVersion %>/product_detail_new.tpl.js"></script>
    <% } %>
</head>
<body ng-controller="ProductDetailPopUpCtrl">
    <product-detail-new></product-detail-new>
</body>
</html>