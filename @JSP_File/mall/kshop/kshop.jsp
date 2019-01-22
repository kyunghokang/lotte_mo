<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴-kshop</title>
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="pragma" content="no-cache">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">

    <script>
    var APP_KEY = "7fa1e44757a94fd89921";
    var SERVER_TIME = new Date();
    </script>

    <%-- <jsp:include page="/common3/html_meta_angular.jsp" flush="true" /> --%>

    <!-- common css -->
    <%@include file="/angular_common/lotte_common_css.jsp"%>

    <!-- build:remove -->
    <link rel="stylesheet" href="/lotte/resources_dev/list/prd_lst.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/unit/comm_unit.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/icon/unit_ico.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/mall/kshop.css"/>
    <!-- /build -->

    <!-- build:remove -->
    <script src="/lotte/lib/jquery/jquery-1.11.2.min.js"></script>
    <script src="/lotte/lib/jquery/EGSlider.js"></script>
    <script src="/lotte/lib/jquery/LottePub.js"></script>
    <script src="/lotte/lib/jquery/app_interface.js"></script>
    <script src="/lotte/lib/jquery/cnt_interface.js"></script>

    <script src="/lotte/lib/angular/angular.min.js"></script>
    <script src="/lotte/lib/angular/angular-sanitize.min.js"></script>
    <script src="/lotte/lib/angular/angular-route.min.js"></script>
    <script src="/lotte/lib/angular/angular-touch.min.js"></script>
    <script src="/lotte/lib/angular/angular-carousel.min.js"></script>

    <!-- /build -->

    <!-- build:remove -->
    <script src="/lotte/resources_dev/mall/kshop.js"></script>
    <script src="/lotte/resources_dev/common/lotte_svc.js"></script>
    <script src="/lotte/resources_dev/common/lotte_comm.js"></script>
    <script src="/lotte/resources_dev/common/lotte_util.js"></script>
    <script src="/lotte/resources_dev/common/lotte_unit.js"></script>
    <script src="/lotte/resources_dev/common/lotte_filter.js"></script>
    <script src="/lotte/resources_dev/common/lotte_search.js"></script>
    <script src="/lotte/resources_dev/common/lotte_comm_footer.js"></script>
    <script src="/lotte/resources_dev/common/lotte_log_dev.js"></script>
    <script src="/lotte/resources_dev/layout/lotte_sidectg.js"></script>
    <script src="/lotte/resources_dev/layout/lotte_sidemylotte.js"></script>
    <!-- /build -->

</head>
</head>
<body ng-controller="KshopCtrl">
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <lotte-search></lotte-search>
        <sub-header></sub-header>

        <kshop-header></kshop-header>
        <section ng-view ng-show="contVisible" class="cont_minheight"></section>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>

    <section id="cover"></section>
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>