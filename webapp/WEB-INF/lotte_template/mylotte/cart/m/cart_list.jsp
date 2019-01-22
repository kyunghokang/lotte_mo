<%@ page language="java" contentType="text/html;charset=utf-8"%> 
<%
String resourcesRoot = LotteUtil.isEllotte(request) ? "/ellotte" : "/lotte";
String pageTitle = resourcesRoot.equals("/ellotte") ? "ellotte" : "롯데닷컴";
%>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title><%=pageTitle %></title>
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="pragma" content="no-cache">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">

    <script>
    var APP_KEY = "7fa1e44757a94fd89921";
    var SERVER_TIME = new Date();
    </script>
    
    <!-- 크리테오 -->
    <script type="text/javascript" src="http://static.criteo.net/js/ld/ld.js" async="true"></script>
    <script type="text/javascript">
   		window.criteo_q = window.criteo_q || [];
    </script>
    
    <%@include file="/common3/angular_common_include.jsp"%>
    
    <% if (LOTTE_DEVEL_MODE) { %>
    	<!-- 공통 -->
    	<% if(!LotteUtil.isEllotte(request)){ %>
		    <%@include file="/angular_common/lotte_common_css.jsp"%>		   
		    <%@include file="/angular_common/lotte_common_js.jsp"%>
		<% }else{ %>
		    <%@include file="/angular_common/ellotte_common_css.jsp"%>
		    <%@include file="/angular_common/ellotte_common_js.jsp"%>
		<% } %>
        
	   	<!-- 이 화면에서 쓰이는 CSS -->
	    <link rel="stylesheet" href="<%=resourcesRoot%>/resources_dev/mylotte/cart/m/cart.css"/>
	    <link rel="stylesheet" href="<%=resourcesRoot%>/resources_dev/mylotte/cart/m/detail_datepicker.css"/>
	    <link rel="stylesheet" href="<%=resourcesRoot%>/resources_dev/common/navermap.css"/>
	    
	    <!-- 이 화면에서 쓰이는 JS -->
	    <script src="<%=resourcesRoot%>/resources_dev/common/lotte_navermap.js"></script>
	    <script src="<%=resourcesRoot%>/resources_dev/mylotte/cart/m/cart.js"></script>
    
    <% } else {  %>
	    <%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" href="<%=resourcesRoot%>/resources/<%= pubVersion %>/cart_list.min.css"/>
	    <script src="<%=resourcesRoot%>/resources/<%= pubVersion %>/cart_list.min.js"></script>
	    <script src="<%=resourcesRoot%>/resources/<%= pubVersion %>/cart_list.tpl.js"></script>
    <% } %>
</head>
<body ng-controller="cartCtrl">
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <lotte-search></lotte-search>
        <sub-header></sub-header>

        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>

    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>