<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴</title>
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
    <% if (LOTTE_DEVEL_MODE) { %>
	<!-- common css -->
    <%@include file="/angular_common/lotte_common_css.jsp"%>
	
	<!-- CSS -->
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/layout/header_sub.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/layer/coupon_layer.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/comm_unit_deal01.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/comm_unit_type01.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/search/search_list.css"/>

	<!-- unit Deal type 01 -->
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_deal_01.css"> 
	<!-- //unit Deal type 01 -->
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_01.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_02.css">
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_03.css">
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/layer/main_popup.css"/>
    
    <!-- common js -->
    <%@include file="/angular_common/lotte_common_js.jsp"%>
    
    <!-- JS -->
    <script src="/lotte/lib/angular/angular-touch.js"></script>
    <script src="/lotte/lib/angular/angular-carousel.min.js"></script>
    <script src="/lotte/resources_dev/search/search_list.js"></script>
    <script src="/lotte/resources_dev/common/lotte_unit.js"></script>
    <script src="/lotte/resources_dev/common/lotte_product.js"></script>
    <script src="/lotte/resources_dev/common/lotte_ngswipe.js"></script>
    <script src="/lotte/resources_dev/layer/lotte_coupon_layer.js"></script>
    <script src="/lotte/resources_dev/layer/main_popup.js"></script>
    <script src="/lotte/resources_dev/common/SpeedTrapInsert.js"></script>
    <% } else {  %>
	    <%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/search_list.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/search_list.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/search_list.tpl.js"></script>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/lotte_product.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/lotte_product.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/lotte_product.tpl.js"></script>
    <% } %>
</head>
<body ng-controller="SearchList">
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>        
        <sub-header></sub-header>

        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>

    <lotte-search></lotte-search>
    <lotte-main-popup ppp_tgt_pg_cd="40"></lotte-main-popup>
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>
    <!-- recobell_search_script.jsp search keyword javascript -->
    <jsp:include page="/WEB-INF/view/search/include/recobell_search_script.jsp"/>
</body>
</html>