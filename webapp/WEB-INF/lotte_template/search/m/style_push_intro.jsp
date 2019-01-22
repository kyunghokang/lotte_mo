<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴 - 스타일 추천</title>
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="pragma" content="no-cache">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">

    <script>
      var APP_KEY = "7fa1e44757a94fd89921";
      var SERVER_TIME = new Date(); 
    </script>
    
    <%@include file="/common3/angular_common_include.jsp" %>
    <%@include file="/common3/html_meta_angular.jsp"%>
    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/style_push_intro.min.css"/>
    <script src="/lotte/resources/<%= pubVersion %>/style_push_intro.min.js"></script>
    <script src="/lotte/resources/<%= pubVersion %>/style_push_intro.tpl.js"></script>
</head>
<body ng-controller="StylePushIntroCtrl">
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>  
        <lotte-search></lotte-search>
        <sub-header></sub-header>

        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
    </div>

    <lotte-search></lotte-search>
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>