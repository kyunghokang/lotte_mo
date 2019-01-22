<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
	<meta charset="utf-8">
	<title>롯데닷컴-브랜드 찾기</title>
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
	<!-- 
	<%@ page language="java" contentType="text/html;charset=utf-8"  %>
	<%@include file="/common3/angular_common_include.jsp"%>
	<%@include file="/common3/html_meta_angular.jsp"%>
	<link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/brandsearch.min.css"/>
	<script src="/lotte/resources/<%= pubVersion %>/brandsearch.min.js"></script>
	<script src="/lotte/resources/<%= pubVersion %>/brandsearch.tpl.js"></script>
	 -->
	<!-- // JSP 영역 -->
	 
	<!-- build:template
	<link rel="stylesheet" type="text/css" href="/lotte/resources/<%= version %>/common.min.css"/>
	/build -->
	<!-- build:remove -->
	<script src="/lotte/resources_dev/common/common_load_2017.js"></script>
	<!-- /build -->

	<!-- build:template
	<link rel="stylesheet" type="text/css" href="/lotte/resources/<%= version %>/brandsearch.min.css"/>
	/build -->
	<!-- build:remove -->
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/brand/brandsearch.css"/>
	<!-- /build -->

	<!-- build:template
	<script src="/lotte/resources/<%= version %>/common.min.js"></script>
	/build -->
	<!-- build:remove -->
	<!-- /build -->

	<!-- build:template
	<script src="/lotte/resources/<%= version %>/brandsearch.min.js"></script>
	/build -->
	<!-- build:remove -->
	<script src="/lotte/resources_dev/brand/brandsearch.js"></script>
	<!-- /build -->
	
	<!-- build:template
	<script src="/lotte/resources/<%= version %>/brandsearch.tpl.js"></script>
	/build -->
</head>
<body ng-controller="BrandSearchCtrl">
	<div id="wrapper" ng-show="showWrap">
		<sub-header></sub-header>
		<lotte-container></lotte-container>
	</div>
</body>
</html>