<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴-simpleSignMemberReSendEmail</title>
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="pragma" content="no-cache">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">

    <script>
    var APP_KEY = "7fa1e44757a94fd89921";
    var SERVER_TIME = new Date();
    </script>
	<!-- JSP 영역 -->
    
    <%@include file="/common3/angular_common_include.jsp"%>
    <% if (LOTTE_DEVEL_MODE) { %>
    <!-- common css -->
    <%@include file="/angular_common/lotte_common_css.jsp"%>

    <!-- 이 화면에서 쓰이는 CSS -->
    <link rel="stylesheet" type="text/css" href="/lotte/resources_dev/login/login.css"/>
    
    <!-- common js -->
    <%@include file="/angular_common/lotte_common_js.jsp"%>
    
    <!-- 이 화면에서 쓰이는 JS -->
    <script src="/lotte/resources_dev/login/resend_email.js"></script>

    <% } else {  %>
	    <%@include file="/common3/html_meta_angular.jsp"%>
	    <link rel="stylesheet" type="text/css" href="/lotte/resources/<%= pubVersion %>/simpleSignMemberReSendEmail.min.css"/>
	    <script src="/lotte/resources/<%= pubVersion %>/simpleSignMemberReSendEmail.min.js"></script>
	    <script src="/lotte/resources/<%= pubVersion %>/simpleSignMemberReSendEmail.tpl.js"></script>
    <% } %>
</head>
<body ng-controller="reSendEmailCtrl">
	<input name="cert_exp_dtime" id="cert_exp_dtime" type="hidden" value="<%=request.getParameter("cert_exp_dtime") %>" />
	<input name="mbr_nm" id="mbr_nm" type="hidden" value="<%=request.getParameter("mbr_nm") %>" />
	<input name="email_addr" id="email_addr" type="hidden" value="<%=request.getParameter("email_addr") %>" />
	<input name="mbr_no" id="mbr_no" type="hidden" value="<%=request.getParameter("mbr_no") %>" />
	<input name="mask_mbr_nm" id="mask_mbr_nm" type="hidden" value="<%=request.getParameter("mask_mbr_nm") %>" />
	<input name="mksh_cert_sn" id="mksh_cert_sn" type="hidden" value="<%=request.getParameter("mksh_cert_sn") %>" />
	<input name="easgn_sgt_sn" id="easgn_sgt_sn" type="hidden" value="<%=request.getParameter("easgn_sgt_sn") %>" />
	<input name="valid_domain" id="valid_domain" type="hidden" value="<%=request.getParameter("valid_domain") %>" />
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