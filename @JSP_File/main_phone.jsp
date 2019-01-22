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

    <!-- common css -->
    <%@include file="/angular_common/lotte_common_css.jsp"%>
    
    <link rel="stylesheet" href="/lotte/resources_dev/layer/coupon_layer.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/unit/unit_01.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/main/main.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/layer/main_popup.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/main/mycart_news_layer.css"/>
    
    <script src="/lotte/lib/jquery/jquery-1.11.2.min.js"></script>
    <script src="/lotte/lib/jquery/LotteSlide.js"></script>
    <script src="/lotte/lib/jquery/LottePub.js"></script>
    <script src="/lotte/lib/jquery/LotteGrid.js"></script>
    <script src="/lotte/lib/jquery/LotteSwipe.js"></script>
    
    
    <script src="/lotte/lib/jquery/cnt_interface.js"></script>
    <script src="/lotte/lib/jquery/app_interface.js"></script>
    <script src="/lotte/lib/kakao/kakao-1.0.22.min.js"></script>
    <script src="/lotte/lib/kakao/kakao.link.js"></script>

    <script src="/lotte/lib/angular/angular.min.js"></script>
    <script src="/lotte/lib/angular/angular-sanitize.min.js"></script>

    <script src="/lotte/resources_dev/main/main.js"></script>
    <script src="/lotte/resources_dev/layer/main_popup.js"></script>
    <script src="/lotte/resources_dev/main/mycart_news_layer.js"></script>

    <script src="/lotte/resources_dev/common/lotte_comm.js"></script>
    <script src="/lotte/resources_dev/common/lotte_util.js"></script>
    <script src="/lotte/resources_dev/common/lotte_filter.js"></script>
    <script src="/lotte/resources_dev/common/lotte_unit_new.js"></script>

    <script src="/lotte/resources_dev/common/lotte_svc.js"></script>

    <script src="/lotte/resources_dev/common/lotte_search.js"></script>
    <script src="/lotte/resources_dev/layout/lotte_sidectg.js"></script>
    <script src="/lotte/resources_dev/layout/lotte_sidemylotte.js"></script>
    <script src="/lotte/resources_dev/common/lotte_comm_footer.js"></script>
    <script src="/lotte/resources_dev/common/lotte_log_dev.js"></script>
    <script src="/lotte/resources_dev/layer/lotte_coupon_layer.js"></script>
    <!--
    <script src="/lotte/resources_dev/js/comm/SpeedTrapInsert.js"></script>
     -->

</head>
<body ng-controller="MainCtrl">
<script>
var indexA , indexB ;  
</script>


    <lotte-coupon-layer></lotte-coupon-layer>
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <lotte-other-story></lotte-other-story>
        <share-pop></share-pop>
        <not-found ng-if="noData"></not-found>
        <lotte-container></lotte-container>
        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
        <lotte-today-other-alarm></lotte-today-other-alarm>
        <mycart-news-layer></mycart-news-layer>
    </div>
    
    <section id="cover"></section>
    <lotte-search></lotte-search>
    <lotte-main-popup ppp-tgt-pg-cd="10"></lotte-main-popup>
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar ng-if="!appObj.isApp"></lotte-footer-actionbar>

    <lotte-comm-footer></lotte-comm-footer>

<!-- 크리테오 start -->  
<!--  2015.02.17 추가-->
<script type="text/javascript" src="http://static.criteo.net/js/ld/ld.js" async="true"></script>
<script type="text/javascript">
window.criteo_q = window.criteo_q || [];
window.criteo_q.push(
        { event: "setAccount", account: "2975" },
        { event: "setSiteType", type: "m" },
        { event: "viewHome" }
);
</script>
<!-- 크리테오 end -->
</body>
</html>