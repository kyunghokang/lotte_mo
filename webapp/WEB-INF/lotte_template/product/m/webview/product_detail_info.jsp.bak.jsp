<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
	<meta charset="utf-8">
	<title>롯데닷컴-단일 상품상세정보</title>
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
	<%@include file="/common3/html_meta_angular.jsp"%>
	<link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/product_detail_info.min.css"/>
	<script src="/lotte/resources/<%= pubVersion %>/product_detail_info.min.js"></script>
	<script src="/lotte/resources/<%= pubVersion %>/product_detail_info.tpl.js"></script>
</head>
<body ng-controller="productDetailInfoCtrl">
	<div id="wrapper" ng-show="showWrap">
		<lotte-container></lotte-container>
	</div>
</body>
</html>