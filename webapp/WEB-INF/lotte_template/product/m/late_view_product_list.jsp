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
    
    <script type="text/javascript">
    var APP_KEY = "7fa1e44757a94fd89921";
    var SERVER_TIME = new Date();
    </script>
    
    <%@include file="/common3/angular_common_include.jsp"%>
    <% if (LOTTE_DEVEL_MODE) { %>
    <!-- common css -->
    <%@include file="/angular_common/lotte_common_css.jsp"%>
    
    <!-- 이 화면에서 쓰이는 CSS -->
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/product/m/lately_product.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/comm_unit.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/icon/unit_ico.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_01.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_deal_01.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_02.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_03.css"/>
	<!-- common js -->
    <%@include file="/angular_common/lotte_common_js.jsp"%>
    
    <!-- 이 화면에서 쓰이는 JS -->
    <script src="/lotte/resources_dev/common/lotte_salebest.js"></script>
    <script src="/lotte/resources_dev/common/lotte_product.js"></script>
    <script src="/lotte/resources_dev/common/lotte_ngswipe.js"></script>
    <script src="/lotte/resources_dev/product/m/lately_product.js"></script>

    <% } else {  %>
    	<%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/late_view_product_list.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/late_view_product_list.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/late_view_product_list.tpl.js"></script>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/lotte_product.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/lotte_product.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/lotte_product.tpl.js"></script>
    <% } %>
    
</head>
<body ng-controller="LatelyProductCtrl">
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <lotte-search></lotte-search>
        <sub-header></sub-header>

        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>

    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>