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
	<%@ page import = "com.lotte.mobile.common.util.LotteUtil" %>    
	<%@ page import="com.lotte.mobile.common.util.*" %>
    <script type="text/javascript">
    	var APP_KEY = "<%=LotteUtil.getPushAppKey(request)%>";
        var SERVER_TIME = <%=DateUtil.today("yyyyMMddHHmmss")%> ;
    </script>
    <!-- <jsp:include page="/common3/html_meta_angular.jsp" flush="true" /> -->

    <!-- common css -->
    <%@include file="/angular_common/lotte_common_css.jsp"%>

    <!-- build:remove -->
    <link rel="stylesheet" href="/lotte/resources_dev/sns/comm_sns.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/sns/layer_sns.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/list/prd_lst.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/list/storyshop_other_list.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/list/smart_window.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/layer/coupon_layer.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/unit/comm_unit.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/icon/sns_ico.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/icon/unit_ico.css"/>
    <link rel="stylesheet" href="/lotte/resources_dev/product/product_list.css"/>
    <!-- /build -->

    <!-- build:remove -->
    <script src="/lotte/lib/jquery/jquery-1.11.2.min.js"></script>
    <script src="/lotte/lib/jquery/EGSlider.js"></script>
    <script src="/lotte/lib/jquery/lottePub.js"></script>
    <script src="/lotte/lib/jquery/cnt_interface.js"></script>
    <script src="/lotte/lib/jquery/app_interface.js"></script>
    <script src="/lotte/lib/jquery/bookmark.js"></script>
    <script src="/lotte/lib/kakao/kakao-1.0.22.min.js"></script>
    <script src="/lotte/lib/kakao/kakao.link.js"></script>

    <script src="/lotte/lib/angular/angular.min.js"></script>
    <script src="/lotte/lib/angular/angular-sanitize.min.js"></script>
    <!-- /build -->

    <!-- build:remove -->
    <script src="/lotte/resources_dev/product/product_list.js"></script>
    <script src="/lotte/resources_dev/common/lotte_svc.js"></script>
    <script src="/lotte/resources_dev/common/lotte_comm.js"></script>
    <script src="/lotte/resources_dev/common/lotte_util.js"></script>
    <script src="/lotte/resources_dev/common/lotte_filter.js"></script>
    <script src="/lotte/resources_dev/common/lotte_unit.js"></script>
    <script src="/lotte/resources_dev/common/lotte_search.js"></script>
    <script src="/lotte/resources_dev/common/lotte_comm_footer.js"></script>
    <script src="/lotte/resources_dev/common/lotte_log_dev.js"></script>
    <script src="/lotte/resources_dev/layout/lotte_sidectg.js"></script>
    <script src="/lotte/resources_dev/layout/lotte_sidemylotte.js"></script>
    <script src="/lotte/resources_dev/sns/lotte_sns.js"></script>
    <script src="/lotte/resources_dev/list/lotte_list.js"></script>
    <script src="/lotte/resources_dev/list/storyshop_other_list.js"></script>
    <script src="/lotte/resources_dev/layer/lotte_coupon_layer.js"></script>
    <!-- /build -->

</head>
<body ng-controller="PlanCtrl">
    <lotte-coupon_layer></lotte-coupon_layer>
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <lotte-search></lotte-search>
        <sub-header></sub-header>
        <lotte-other-story></lotte-other-story>
        <share-pop ></share-pop>
        <not-found ng-if="noData"></not-found>

        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
        <lotte-today-other-alarm></lotte-today-other-alarm>
    </div>
    <section id="cover"></section>
    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>

    <lotte-smartwindow></lotte-smartwindow>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>