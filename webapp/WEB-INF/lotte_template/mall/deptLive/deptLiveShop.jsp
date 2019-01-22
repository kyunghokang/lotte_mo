<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴-백화점라이브</title>
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
    <%@include file="/angular_common/lotte_common_css.jsp"%>

    <!-- 이 화면에서 쓰이는 CSS -->
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/sns/comm_sns.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/sns/layer_sns.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/icon/sns_ico.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/deptLive/deptLive.css"/>
    
    <!-- common js -->
    <%@include file="/angular_common/lotte_common_js.jsp"%>
    
    <!-- 이 화면에서 쓰이는 JS -->
    <script src="/lotte/lib/angular/angular-route.min.js"></script>
    <script src="/lotte/lib/angular/angulargrid.min.js"></script>
    <script src="/lotte/lib/kakao/kakao.js"></script>    
    <script src="/lotte/resources_dev/sns/lotte_sns.js"></script>    
    <script src="/lotte/resources_dev/deptLive/deptLive.js"></script>

    <% } else {  %>
		<%@include file="/common3/html_meta_angular.jsp"%>
		<link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/deptLive.min.css"/>
		<script src="/lotte/resources/<%= pubVersion %>/deptLive.min.js"></script>
		<script src="/lotte/resources/<%= pubVersion %>/deptLive.tpl.js"></script>
    <% } %>
</head>
<body ng-controller="DeptLiveCtrl">
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <lotte-search></lotte-search>
        <sub-header></sub-header>
        <share-pop ></share-pop>    
		<div ng-view class="nsh_con"></div>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>
    
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>