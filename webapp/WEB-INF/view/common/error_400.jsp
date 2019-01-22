<%@page import="org.slf4j.LoggerFactory"%>
<%@page import="org.slf4j.Logger"%>
<%@page import="com.lotte.mobile.common.util.LotteUtil"%>
<%
// 롯데닷컴 모바일 generic error page
Exception exception = (Exception)request.getAttribute("exception");
if (exception != null) {
	Logger logger = LoggerFactory.getLogger("error.page");
	logger.error(exception.getMessage(), exception);
}
boolean isEllotte = LotteUtil.isEllotte(request);
%>

<%if (!isEllotte) { %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>롯데닷컴</title>
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="pragma" content="no-cache">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<meta name="format-detection" content="telephone=no">
	<style type="text/css">
	*{padding: 0; margin: 0; border:0; font-size: 12px; line-height: 1.5em; text-decoration: none; }
	body{background-color: #f9f9f9;}
	.box_error{position: relative; padding-top: 112px; text-align: center;}
	.box_error .img_error{width: 108px; height: 108px; margin:0 auto 30px;background: url('http://image.lotte.com/lotte/mo2015/angular/img_error_lotte.gif') no-repeat 0 0; -webkit-background-size: 108px; background-size: 108px;}
	.box_error .img_error a { overflow:hidden; display:block; height:100%; width:100%; text-indent:-999em; color:transparent;}
	.box_error .desc{ position: relative; }
	.box_error .desc dt{margin-bottom: 7px; font-size: 16px; color: #333; font-weight: bold; letter-spacing: -1px;}
	.box_error .desc dd{margin-bottom: 40px; font-size: 14px; color:#999;}
	.box_error .btn_area{position: relative;}
	.box_error .btn_area a{display: inline-block; width: 137px; height: 40px; line-height: 39px;  border-radius:2px; -webkit-border-radius:2px; font-weight: bold; color:#fff; font-size: 14px; letter-spacing: -1px;}
	.box_error .btn_area a:first-child{ margin-right: 6px;}
	.box_error .btn_area a.pre{background-color: #929292;}
	.box_error .btn_area a.home{background-color: #6190ff;}
	</style>
	</head>
<body>
	<div class="box_error">
		<!-- <p class="img_error"><img src="http://image.lotte.com/lotte/mo2015/angular/img_error_lotte.gif" alt="에러 페이지 롯데 닷컴"></p> -->
		<p class="img_error"><a href="javascript:void(0)" onclick="location = '/' + location.search">에러 페이지 롯데 닷컴</a></p>
		<dl class="desc">
			<dt>쇼핑에 불편을 드려 죄송합니다.</dt>
			<dd>페이지를 찾을 수 없습니다. <br> 이전 페이지 또는 롯데닷컴 홈으로 이동하여 <br>다시 이용해 주세요.</dd>
		</dl>
		<div class="btn_area">
			<a class="pre" href="javascript:history.go(-1);">이전 페이지</a>
			<a class="home" href="javascript:void(0)" onclick="location = '/' + location.search">롯데닷컴 홈</a>
		</div>
	</div>
	
</body>
</html>
<% } else { %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>롯데닷컴</title>
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="pragma" content="no-cache">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no">
<link rel="stylesheet" type="text/css" href="/ellotte/resources_dev/error/error.css">
<style>
/**{padding: 0; margin: 0; border:0; font-size: 12px; line-height: 1.5em; text-decoration: none; }*/
body{background-color: #f9f9f9;}
a{text-decoration:none;color:#932324;}
.error_page {text-align:center; width:100%; overflow:hidden; clear:both;}
.error_page i {background:url(http://image.lotte.com/ellotte/mo2015/angular/common/sns.png) no-repeat; margin:110px auto 20px auto; background-size:300px 300px; display:block; width:113px; height:113px; background-position:-101px -84px;}
.error_page p {font-size:14px; color:#999; padding:7px 0;}
.error_page strong {font-size:16px; color:#333;}
.error_page .btn {padding:45px 0; width:100%; overflow:hidden; clear:both; font-weight:bold;}
.error_page .btn li {border:1px solid #ab9668; display:inline-block; width:130px; height:38px; line-height:38px; color:#333; border-radius:3px;}
.error_page .btn a {display:block; color:#ab9668;}
.error_page .btn li.home {background-color:#ab9668; }
.error_page .btn li.home a {color:#fff;}
</style>
</head>
<body>
<div class="error_page">
	<i><a style="width:100%; height:100%; overflow:hidden; display:block; text-indent:-999em;" href="javascript:void(0)" onclick="location = '/' + location.search">엘롯데 홈</a></i>
	<p><strong>쇼핑에 불편을 드려 죄송합니다.</strong></p>
	<p>페이지를 찾을 수 없습니다.<br>
	이전 페이지 또는 엘롯데 홈으로 이동하여<br>
	다시 이용해 주세요.</p>
	
	<ul class="btn">
		<li class="back"><a class="back" href="javascript:history.go(-1);">이전 페이지</a></li>
		<li class="home"><a class="home" href="javascript:void(0)" onclick="location = '/' + location.search">엘롯데 홈</a></li>
	</ul>
</div>
</body>
</html>
<% } %>