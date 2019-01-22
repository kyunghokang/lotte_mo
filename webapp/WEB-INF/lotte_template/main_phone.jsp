<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
	<meta charset="utf-8">
	<title>롯데닷컴</title>
	<meta http-equiv="cache-control" content="no-cache" />
	<meta http-equiv="expires" content="0" />
	<meta http-equiv="pragma" content="no-cache" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta name="format-detection" content="telephone=no" />

	<script type="text/javascript">
	var APP_KEY = "7fa1e44757a94fd89921";
	var SERVER_TIME = new Date();
	</script>
	
	<%@include file="/common3/angular_common_include.jsp" %>
	<% if (LOTTE_DEVEL_MODE) { %>

	<!-- common  -->
	<%@include file="/angular_common/lotte_common_css.jsp"%>

	<!-- 이 화면에서 쓰이는 CSS -->
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/main/main.css"/>

	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/layer/main_popup.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/layer/coupon_layer.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/main/app_info.css"/>
	
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/product_unit/product_unit.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_deal_01.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_01.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_02.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_03.css">

	<!-- common js -->
	<%@include file="/angular_common/lotte_common_js.jsp"%>

	<!-- Product -->
	<script src="/lotte/resources_dev/common/lotte_ngswipe.js"></script>
	<script src="/lotte/resources_dev/common/lotte_product.js"></script>
	
	<!-- 이 화면에서 쓰이는 JS -->
	<script src="/lotte/resources_dev/main/main.js"></script>
	<script src="/lotte/resources_dev/main/app_info.js"></script>
	<script src="/lotte/resources_dev/layer/main_popup.js"></script>
	<script src="/lotte/resources_dev/layer/lotte_coupon_layer.js"></script>
	<!-- /build -->
	<% } else {  %>
	<%@include file="/common3/html_meta_angular.jsp"%>
		<link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/main.min.css"/>
		<script src="/lotte/resources/<%= pubVersion %>/main.min.js"></script>
		<script src="/lotte/resources/<%= pubVersion %>/main.tpl.js"></script>
		<link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/lotte_product.min.css"/>
		<script src="/lotte/resources/<%= pubVersion %>/lotte_product.min.js"></script>
		<script src="/lotte/resources/<%= pubVersion %>/lotte_product.tpl.js"></script>    	
	<% } %>
</head>
<body ng-controller="MainCtrl">
	<lotte-main-app-info ng-if="appObj.isApp"></lotte-main-app-info>
	<lotte-coupon-layer></lotte-coupon-layer>

	<div id="wrapper" ng-show="showWrap">
		<lotte-header></lotte-header>
		<lotte-search></lotte-search>

		<lotte-header-main></lotte-header-main>
		<not-found ng-if="noData"></not-found>

		<lotte-container></lotte-container>

		<lotte-footer></lotte-footer>
		<lotte-btntop></lotte-btntop>

		<lotte-today-other-alarm></lotte-today-other-alarm>
		<mycart-news-layer></mycart-news-layer>
	</div>
	
	<lotte-main-popup ppp-tgt-pg-cd="10"></lotte-main-popup>
	<lotte-smart-message></lotte-smart-message>
	<lotte-side-category></lotte-side-category>
	<lotte-side-mylotte></lotte-side-mylotte>
	<lotte-footer-actionbar></lotte-footer-actionbar>

	<lotte-comm-footer></lotte-comm-footer>

	<!-- 크리테오 start -->  
	<!--  2015.02.17 추가-->
	<script type="text/javascript" src="http://static.criteo.net/js/ld/ld.js" async="true"></script>
	<script type="text/javascript">
	window.criteo_q = window.criteo_q || [];
	window.criteo_q.push(
			{ event: "setAccount", account: "2975" },
			{ event: "setSiteType", type: "m" },
			{ event: "viewHome" }
	);
	</script>
<!-- 크리테오 end -->
</body>
</html>