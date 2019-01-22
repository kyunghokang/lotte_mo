<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
	<meta charset="utf-8">
	<title>롯데닷컴-상품상세 기획전 상세정보 상단html영역</title>
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="pragma" content="no-cache">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, minimum-scale=1.0, user-scalable=yes">
	<meta name="format-detection" content="telephone=no">
	<link rel="stylesheet" type="text/css" href="/lotte/resources/webview/product_plan_detail_info_top_webview.min.css?20171113"/>
	<script src="/lotte/lib/jquery/jquery-1.11.2.min.js"></script>
</head>
<body>
	<div id="detailLayout" class="detailLayout webview_plan_detail">
	<!-- HTML 시작 //-->
	${planPrdHtml }
	<!--// HTML 끝 -->
	</div>
	<script src="/lotte/resources/webview/product_plan_detail_info_top_webview.min.js?20171113"></script>
</body>
</html>