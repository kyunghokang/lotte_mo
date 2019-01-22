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
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<meta name="format-detection" content="telephone=no">

	<script>
	var APP_KEY = "7fa1e44757a94fd89921";
	var SERVER_TIME = new Date();
	</script>
	
	<%@ page language="java" contentType="text/html;charset=utf-8"  %>
	
	<%@include file="/common3/angular_common_include.jsp"%>

	<% if (true) { // LOTTE_DEVEL_MODE %>
	
	<!-- common css -->
	<%@include file="/common3/html_meta_angular.jsp"%>
	 
	<!-- 이 화면에서만 쓰이는 CSS -->
	<link rel="stylesheet" href="<%=resourcesRoot%>/resources_dev/sns/sns.css"/>
	<link rel="stylesheet" href="<%=resourcesRoot%>/resources_dev/event/bigDeal.css"/>
	<!--// 이 화면에서만 쓰이는 CSS -->
	
	<!-- 이 화면에서 쓰이는 JS -->
	<script src="<%=resourcesRoot%>/resources_dev/sns/lotte_sns.js"></script>
	<script src="<%=resourcesRoot%>/lib/kakao/kakao.js"></script>
	<script src="<%=resourcesRoot%>/resources_dev/event/bigDeal.js"></script>
	<script src="/common3/js/tablets.js"></script>

	<% } else {  %>
		<%@include file="/common3/html_meta_angular.jsp"%>
		<link rel="stylesheet" href="<%=resourcesRoot%>/resources/<%= pubVersion %>/bigDeal.min.css"/>
		<script src="<%=resourcesRoot%>/resources/<%= pubVersion %>/bigDeal.min.js"></script>
		<script src="<%=resourcesRoot%>/resources/<%= pubVersion %>/bigDeal.tpl.js"></script>
		<script src="/common3/js/tablets.js"></script>
	<% } %>
	
	<!--
	<script src="<%=resourcesRoot%>/resources_dev/common/SpeedTrapInsert.js"></script>
	-->
</head>
<body ng-controller="bigDealCtrl">
	<div id="wrapper" ng-show="showWrap">
		<lotte-header></lotte-header>
		<lotte-search></lotte-search>
		<sub-header></sub-header>
		<share-pop></share-pop>
		
		<%@ include file="/WEB-INF/view/event/bigDeal_for_angular.jsp"%>

		<lotte-footer></lotte-footer>
		<lotte-btntop></lotte-btntop>
	</div>

	<lotte-side-category></lotte-side-category>
	<lotte-side-mylotte></lotte-side-mylotte>
	<lotte-footer-actionbar></lotte-footer-actionbar>

	<lotte-comm-footer></lotte-comm-footer>
</body>
</html>