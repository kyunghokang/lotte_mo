<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
	<meta charset="utf-8">
	<title>롯데닷컴-product_view</title>
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
	 
	<!-- 이 화면에서만 쓰이는 CSS -->
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/sns/sns.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/layer/main_popup.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/product/m/detail.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/product/m/detail_datepicker.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/product/m/detail_popup.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/common/navermap.css"/>
	<!--// 이 화면에서만 쓰이는 CSS -->
	
	<!-- common js -->
	<%@include file="/angular_common/lotte_common_js.jsp"%>
	
	<!-- 이 화면에서 쓰이는 JS -->
	<script src="/lotte/lib/kakao/kakao-1.0.22.min.js"></script>
	<script src="/lotte/lib/kakao/kakao.link.js"></script>
	<script src="/lotte/lib/angular/angular-route.min.js"></script>
	<script src="/lotte/resources_dev/layer/main_popup.js"></script>
	<script src="/lotte/resources_dev/common/lotte_unit_new.js"></script>
	<script src="/lotte/resources_dev/common/lotte_ngswipe.js"></script>
	<script src="/lotte/resources_dev/sns/lotte_sns.js"></script>
	<script src="/lotte/resources_dev/product/m/product_view_popup.js"></script>
	<script src="/lotte/resources_dev/product/m/product_view.js"></script>

	<% } else {  %>
		<%@include file="/common3/html_meta_angular.jsp"%>
		<link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/product_view.min.css"/>
		<script src="/lotte/resources/<%= pubVersion %>/product_view.min.js"></script>
		<script src="/lotte/resources/<%= pubVersion %>/product_view.tpl.js"></script>
	<% } %>


</head>
<body ng-controller="ProductCtrl">
	<div id="wrapper" ng-show="showWrap">
		<lotte-header></lotte-header>
		<lotte-search></lotte-search>

		<share-pop></share-pop>

		<section ng-view ng-show="contVisible" class="cont_minheight"></section>

		<lotte-footer></lotte-footer>
		<lotte-btntop></lotte-btntop>
	</div>

	<lotte-main-popup ppp-tgt-pg-cd="20"></lotte-main-popup>

	<lotte-side-category></lotte-side-category>
	<lotte-side-mylotte></lotte-side-mylotte>
	<lotte-comm-footer></lotte-comm-footer>
	<!-- recobell_product_script.jsp javascript -->
	<jsp:include page="/WEB-INF/view/product/include/recobell_product_script.jsp"/>
	<!-- criteo_product_script.jsp javascript -->
	<jsp:include page="/WEB-INF/view/product/include/criteo_product_script.jsp"/>
	
</body>
</html>