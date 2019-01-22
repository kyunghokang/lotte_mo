<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴 - TalkShopping</title>
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
    <%@ page import="com.lotte.mobile.common.util.LotteUtil"%>
    <%
        String lpayWebUrl = LotteUtil.LPAY_WEB_URL; // L.pay 도메인
    %>

    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/talkShopping.min.css" />
    <script src="/lotte/resources/<%= pubVersion %>/talkShopping.min.js"></script>
    <script src="/lotte/resources/<%= pubVersion %>/talkShopping.tpl.js"></script>
    <script type="text/javascript" src="<%= lpayWebUrl %>/api/js/json2.js"></script>
    <script type="text/javascript" src="<%= lpayWebUrl %>/api/js/lotte.lpay.api.min.js"></script>
</head>
<body ng-controller="TalkShoppingCtrl">
	<div id="wrapper" ng-show="showWrap">
		<!-- <sub-header></sub-header> -->
		<lotte-container></lotte-container>
	</div>
</body>
</html>