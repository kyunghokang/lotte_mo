<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<%
String resourcesRoot = LotteUtil.isEllotte(request) ? "/ellotte" : "/lotte";

java.util.Random ran = new Random();
//랜덤 문자 길이
int numLength = 6;
String randomStr = "";

for (int i = 0; i < numLength; i++) {
    //0 ~ 9 랜덤 숫자 생성
    randomStr += ran.nextInt(10);
}

//날짜 생성
Calendar today = Calendar.getInstance();
SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
String day = sdf.format(today.getTime());
	
String reqNum   = day + randomStr;                           				// 본인실명확인 요청번호 40byte 까지 사용 가능

Cookie sci_c = new Cookie("reqNum", reqNum);
//c.setMaxAge(1800);  // <== 필요시 설정(초단위로 설정됩니다)
response.addCookie(sci_c);

%>
<!DOCTYPE html>
<html ng-app="app" ng-controller="LotteCtrl">
<head>
    <meta charset="utf-8">
    <title>롯데닷컴</title>
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <meta name="format-detection" content="telephone=no" />

    <script>
    var APP_KEY = "7fa1e44757a94fd89921";
    var SERVER_TIME = new Date();
    </script>

    <%@include file="/common3/angular_common_include.jsp"%>
    
    <% if (LOTTE_DEVEL_MODE) { %>
 		<% if(! LotteUtil.isEllotte(request)){ %>
		    <%@include file="/angular_common/lotte_common2_css.jsp"%>		   
		    <%@include file="/angular_common/lotte_common2_js.jsp"%>
		<% }else{ %>
		    <%@include file="/angular_common/ellotte_common2_css.jsp"%>
		    <%@include file="/angular_common/ellotte_common2_js.jsp"%>
		<% } %>
		 <link rel="stylesheet" href="<%=resourcesRoot%>/resources_dev/sci/pcc_v3_seed.css">
		<script src="<%=resourcesRoot%>/resources_dev/sci/pcc_v3_seed.js"></script>
	    <script src="/common3/js/function.js"></script>
		<script src="/common3/js/storage.js"></script>
		<script src="https://flyasiana.com/CW/common/linkage/ozcd.js"></script>
		<script src="/common4/js/lib/crittercismClientLibraryMin.js"></script> 
    <% } else {  %>    	
    	<%@include file="/common3/html_meta_angular.jsp"%>
	    <script src="/common3/js/function.js"></script>
		<script src="/common3/js/storage.js"></script>
		<script src="https://flyasiana.com/CW/common/linkage/ozcd.js"></script>
		<script src="/common4/js/lib/crittercismClientLibraryMin.js"></script> 
	    <script src="<%=resourcesRoot%>/resources/<%= pubVersion %>/pcc_V3_seed.min.js"></script>
	    <link rel="stylesheet" href="<%=resourcesRoot%>/resources/<%= pubVersion %>/pcc_V3_seed.min.css">
    <% } %>
    
</head>
<body ng-controller="SeedCtrl" >
	<script>
	//var resCode = "${responseCode}";
	//var orderSubTitle = "본인확인 요청";
	</script>
    <div id="wrapper" ng-show="showWrap">
        <lotte-header></lotte-header>
        <sub-header></sub-header>

		<%@ include file="/sci/pcc_V3_seed_form.jsp"%>

		<lotte-footer></lotte-footer>
	</div>	
	<lotte-search></lotte-search>
	<lotte-side-category></lotte-side-category>
	<lotte-side-mylotte></lotte-side-mylotte>
    <lotte-footer-actionbar></lotte-footer-actionbar>
    
	<lotte-comm-footer></lotte-comm-footer>
</body>
</html>
