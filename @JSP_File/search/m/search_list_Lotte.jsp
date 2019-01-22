<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴-검색결과페이지</title>
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
    
    <link rel="stylesheet" href="/lotte/resources_dev/layer/coupon_layer.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/unit/comm_unit_deal01.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/unit/comm_unit_type01.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/search/search_list.css"/>

    <script src="/lotte/lib/jquery/jquery-1.11.2.min.js"></script>
    <script src="/lotte/lib/jquery/EGSlider.js"></script>
    <script src="/lotte/lib/jquery/LottePub.js"></script>
    <script src="/lotte/lib/jquery/app_interface.js"></script>
    <script src="/lotte/lib/jquery/cnt_interface.js"></script>

    <script src="/lotte/lib/angular/angular.min.js"></script>
    <script src="/lotte/lib/angular/angular-sanitize.min.js"></script>
    <script src="/lotte/lib/angular/angular-touch.js"></script>
    <script src="/lotte/lib/angular/angular-carousel.min.js"></script>

    <script src="/lotte/resources_dev/search/search_list.js"></script>

    <script src="/lotte/resources_dev/common/lotte_comm.js"></script>
    <script src="/lotte/resources_dev/common/lotte_util.js"></script>
    <script src="/lotte/resources_dev/common/lotte_unit.js"></script>
    <script src="/lotte/resources_dev/common/lotte_filter.js"></script>
    <script src="/lotte/resources_dev/layer/lotte_coupon_layer.js"></script>
    <script src="/lotte/resources_dev/common/lotte_search.js"></script>
    <script src="/lotte/resources_dev/layout/lotte_sidectg.js"></script>
    <script src="/lotte/resources_dev/layout/lotte_sidemylotte.js"></script>
    <script src="/lotte/resources_dev/common/lotte_svc.js"></script>
    <script src="/lotte/resources_dev/common/lotte_comm_footer.js"></script>
    
    <script src="/lotte/resources_dev/common/SpeedTrapInsert.js"></script>
</head>
<body ng-controller="SearchList">
    <lotte-coupon-layer></lotte-coupon-layer>
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <lotte-search></lotte-search>
        <sub-header></sub-header>

        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>

    <section id="cover"></section>
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>
    <jsp:include page="/WEB-INF/view/search/include/recobell_search_script.jsp"/>
</body>
</html>