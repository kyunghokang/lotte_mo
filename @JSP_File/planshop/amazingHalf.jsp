<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴-하프찬스</title>
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
    <jsp:include page="/common3/html_meta_angular.jsp" flush="true" />
        
</head>
<body ng-controller="HalfChanceCtrl">
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <lotte-search></lotte-search>
        <sub-header></sub-header>
		<share-pop ></share-pop>
        <lotte-container></lotte-container>

        <lotte-footer></lotte-footer>
        <lotte-btntop></lotte-btntop>
    </div>

    <lotte-side-category></lotte-side-category>
    <lotte-side-mylotte></lotte-side-mylotte>

    <lotte-comm-footer></lotte-comm-footer>
</body>
</html>