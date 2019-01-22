<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>롯데닷컴</title>
<meta content="no_cache" http-equiv="cache_control">
<meta content="0" http-equiv="expires">
<meta content="no_cache" http-equiv="pragma">
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" name="viewport">
<meta content="telephone=no" name="format-detection">
<!-- test css -->
<%@include file="/common3/html_meta_angular.jsp"%>
<!----------------- current css ----------------->
<style>
.clear:after {content:" "; display:block;clear:both;overflow:hidden;}
.updatePoster {position:fixed;top:0;left:0;width:100%;height:100%;z-index:8000;}
.posterWrap {position:relative;width:100%;height:100%;text-align:center;}
.poster {position:relative;height:57%;width:100%;background:#8db0ff;box-sizing:border-box;-webkit-box-sizing:border-box;}
.poster>div {position:absolute;bottom:0;left:0;width:100%;}
.poster img {display:inline-block;width:53%;max-width:348px;margin:0 auto;}
.posterDown {position:absolute;bottom:0;left:0;width:100%;height:43%;padding-bottom:50px;background:#fff;text-align:center;font-size:15px;box-sizing:border-box;-webkit-box-sizing:border-box;}
.posterDown>div {padding-top:5%;font-size:16px;color:#333;}
.posterDown>div img {display:inline-block;width:80%;max-width:572px;margin:0 auto;}
.posterDown .downText p {font-size:25px;}
.btnArea {text-align:center;}
.btnArea a.btn {display:inline-block;height:28px;padding:0 20px;color:#467eff;font-size:14px;line-height:30px;border:1px solid #719cff;border-radius:15px;-webkit-border-radius:15px;}
</style>
<script>
function appUpdate() {
	if(nativeAppInfo.isAndroid) {
		if(nativeAppInfo.isSKT) {
			window.location.href = "http://market.android.com/details?id=com.lotte.skt";
		} else {
			window.location.href = "http://market.android.com/details?id=com.lotte";
		}
	} else {
		if(nativeAppInfo.isIPad) {
			window.location.href = "https://itunes.apple.com/kr/app/losdedaskeom-for-ipad/id447799601?mt=8";
		} else {
			window.location.href = "https://itunes.apple.com/kr/app/losdedaskeom/id376622474?mt=8";
		}
	}
}
</script>
</head>
<body>
<!-- container -->
<section id="container">
	<section class="updatePoster">
		<div class="posterWrap">
			<div class="poster"><div><img src="http://image.lotte.com/lotte/mo2015/angular/mylotte/updatePoster.png" alt=""></div></div>
			<div class="posterDown">
				<div><img src="http://image.lotte.com/lotte/mo2015/angular/mylotte/updateText.png" alt=""></div>
				<div class="btnArea"><a href="#none" onclick="appUpdate()" class="btn">업데이트 하기</a></div>
			</div>
		</div>
	</section>
</section>
</body>
</html>