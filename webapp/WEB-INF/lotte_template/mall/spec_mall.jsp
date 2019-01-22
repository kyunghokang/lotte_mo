<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
<meta charset="utf-8">
<title>롯데닷컴-전문몰</title>
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="pragma" content="no-cache">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
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
<link rel="stylesheet" type="text/css"
	href="/lotte/resources_dev/list/prd_lst.css" />
<link rel="stylesheet" type="text/css"
	href="/lotte/resources_dev/unit/comm_unit.css" />
<link rel="stylesheet" type="text/css"
	href="/lotte/resources_dev/icon/unit_ico.css" />
<link rel="stylesheet" type="text/css"
	href="/lotte/resources_dev/mall/spec_mall.min.css" />

<!-- common js -->
<%@include file="/angular_common/lotte_common_js.jsp"%>

<!-- 이 화면에서 쓰이는 JS -->
<script src="/lotte/lib/jquery/EGSlider.js"></script>
<script src="/lotte/lib/angular/angular-route.min.js"></script>
<script src="/lotte/resources_dev/mall/kshop.js"></script>
<script src="/lotte/resources_dev/common/lotte_unit.js"></script>
<% } else {  %>
<%@include file="/common3/html_meta_angular.jsp"%>
<link rel="stylesheet" type="text/css"
	href="/lotte/resources/<%= pubVersion %>/spec_mall.min.css" />
<script src="/lotte/resources/<%= pubVersion %>/spec_mall.min.js"></script>
<script src="/lotte/resources/<%= pubVersion %>/spec_mall.tpl.js"></script>
<% } %>
</head>
<!-- 
<body ng-controller="SpecMallCtrl">
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        
        <sub-header></sub-header>

        <SPEC-MALL-CTG></SPEC-MALL-CTG>
        <section ng-view ng-show="contVisible" class="cont_minheight"></section>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>

    <section id="cover"></section>
    <lotte-search></lotte-search>
    
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>
</body>
 -->
<BODY ng-controller="SpecMallCtrl">
	<DIV id=wrapper ng-show="showWrap">
		<LOTTE-HEADER></LOTTE-HEADER>
		<LOTTE-SEARCH></LOTTE-SEARCH>
		<SUB-HEADER></SUB-HEADER>
		<SPEC-MALL-CTG></SPEC-MALL-CTG>
		<SECTION class=cont_minheight ng-show="contVisible" ng-view></SECTION>
		<LOTTE-FOOTER></LOTTE-FOOTER>
		<LOTTE-BTNTOP></LOTTE-BTNTOP>
	</DIV>
	<LOTTE-SIDE-CATEGORY></LOTTE-SIDE-CATEGORY>
	<LOTTE-SIDE-MYLOTTE></LOTTE-SIDE-MYLOTTE>
	<LOTTE-FOOTER-ACTIONBAR></LOTTE-FOOTER-ACTIONBAR>
	<LOTTE-COMM-FOOTER></LOTTE-COMM-FOOTER>
</BODY>
</HTML>

</html>