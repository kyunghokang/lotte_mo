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
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/sns/sns.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/list/prd_lst.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/list/storyshop_other_list.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/list/smart_window.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/layer/coupon_layer.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/comm_unit.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/icon/unit_ico.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/planshop/m/planshop.css"/>
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_01.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_deal_01.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_02.css"/>
	<link rel="stylesheet" type="text/css" href="/lotte/resources_dev/unit/unit_list_03.css"/>
    
    <!-- common js -->
    <%@include file="/angular_common/lotte_common_js.jsp"%>
    
    <!-- 이 화면에서 쓰이는 JS -->
    <script src="/lotte/lib/jquery/bookmark.js"></script>
    <script src="/lotte/lib/kakao/kakao-1.0.22.min.js"></script>
    <script src="/lotte/resources_dev/common/lotte_product.js"></script>
    <script src="/lotte/lib/kakao/kakao.link.js"></script>
    <script src="/lotte/resources_dev/common/lotte_unit.js"></script>
    <script src="/lotte/resources_dev/sns/lotte_sns.js"></script>
    <script src="/lotte/resources_dev/list/lotte_list.js"></script>
    <script src="/lotte/resources_dev/list/storyshop_other_list.js"></script>
    <script src="/lotte/resources_dev/layer/lotte_coupon_layer.js"></script>
    <script src="/lotte/resources_dev/common/lotte_ngswipe.js"></script>
	<script src="/lotte/resources_dev/planshop/m/planshop.js"></script>
    
    <% } else {  %>
    	<%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/planshop.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/planshop.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/planshop.tpl.js"></script>
    <% } %>

</head>
<body ng-controller="PlanshopCtrl">
    <lotte-coupon-layer></lotte-coupon-layer>
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <share-pop></share-pop>
        
        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
        <lotte-today-other-alarm></lotte-today-other-alarm>
    </div>

    
    <lotte-search></lotte-search>
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>
    <lotte-smartwindow></lotte-smartwindow>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>