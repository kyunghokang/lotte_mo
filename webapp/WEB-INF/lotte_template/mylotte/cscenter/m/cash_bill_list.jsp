<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴</title>
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

    
    <!-- 이 화면에서 쓰이는 CSS -->
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/mylotte/cscenter/m/cash_bill_list.css"/>

    <!-- common js -->
    <%@include file="/angular_common/lotte_common_js.jsp"%>
    
    <!-- 이 화면에서 쓰이는 JS -->
    <script src="/lotte/resources_dev/mylotte/cscenter/m/cash_bill_list.js"></script>

    <% } else {  %>
    	<%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/cash_bill_list.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/cash_bill_list.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/cash_bill_list.tpl.js"></script>
    	
    <% } %>

</head>
<body ng-controller="CashBillCtrl">
    <div id="wrapper" ng-show="showWrap">
<!--        <lotte-header></lotte-header>-->
<!--        <lotte-search></lotte-search>-->
<!--        <sub-header></sub-header>-->
<!--        <share-pop></share-pop>-->
        
        <lotte-container></lotte-container>

<!--        <lotte-footer></lotte-footer>-->
<!--        <lotte-btntop></lotte-btntop>-->
<!--        <lotte-today-other-alarm></lotte-today-other-alarm>-->
    </div>

<!--    <lotte-search></lotte-search>-->
<!--    <lotte-side-category></lotte-side-category>-->
<!--    <lotte-side-mylotte></lotte-side-mylotte>-->
<!--    <lotte-footer-actionbar></lotte-footer-actionbar>-->
<!--    <lotte-smartwindow></lotte-smartwindow>-->

<!--    <lotte-comm-footer></lotte-comm-footer>-->
</body>
</html>