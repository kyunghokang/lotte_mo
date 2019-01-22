<%@ page language="java" contentType="text/html;charset=utf-8" %>
<%@ page import="com.lotte.mobile.common.util.ConvertUtil" %>
<%@ page import="com.lotte.mobile.common.util.LotteUtil" %>
<%@ include file="/common3/common.jsp"%>
<%
	String confirm_yn = ConvertUtil.NVL(request.getParameter("confirm_yn")); // 인증여부
	String bir_date = ConvertUtil.NVL(request.getParameter("bir_date")); // 생년월일
	String backUrl = ConvertUtil.NVL(request.getParameter("backUrl")); // 리턴페이지
	       //backUrl = java.net.URLDecoder.decode(backUrl, "UTF-8");
	
	String curr_date = DateUtil.today("yyyyMMdd");
	
	// 만19세 이상 확인 ,테스트 : 27
	String adultAgeYn = "";	
	int fullAge = 0;
	
	if(confirm_yn.equals("Y") && !"".equals(bir_date)){
		fullAge = Integer.parseInt(curr_date.substring(0,4)) - Integer.parseInt(bir_date.substring(0,4));
		
		if(fullAge >= 19){	// 만19세 이상일 경우
			adultAgeYn = "Y";
		}else{
			adultAgeYn = "N";
		}
		
	}
%>

<script src="/lotte/lib/jquery/jquery-1.11.2.min.js"></script>
<script><!--
function lotteUserGetCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
};

function lotteUserChkDevice() {
	var device = "android",
		agent = (navigator.userAgent).toLowerCase();

	if (agent.indexOf("iphone") >= 0 || agent.indexOf("ipod") >= 0 || agent.indexOf("ipad") >= 0 ) {
		device = "iOS";
	}
	return device;
};

function setSessionStorage(key, value, type) {
	
		if (type == 'json') {
			value = JSON.stringify(value);
		}
		sessionStorage.setItem(key, value);
	
};

function getSessionStorage(key, type) {
	var value = null;
	
		value = sessionStorage.getItem(key);
		if (type == 'json') {
			value = JSON.parse(value);
		}

	return value;
};

var udid = lotteUserGetCookie("UDID");
var os = lotteUserChkDevice();
var isApp = false;
if(udid != "") {
	isApp = true;
}

var backUrl = "<%=backUrl %>" ;

if(isApp && os == "iOS" ) {
	   backUrl = decodeURIComponent(backUrl);
}

	$(document).ready(function(){
	//function return_go(){
	
		
		var sci_param = localStorage.getItem('sci_param');
		var form_param = JSON.parse(sci_param); // 주문서로 전달하기 위한 파리메터
		var form_action = localStorage.getItem('sci_action'); // 주문서 이전 사은품 선택 페이지 url
		var login_href = localStorage.getItem('sci_login_href'); // 로그인 폼 url		
		var confirm_yn = "<%=confirm_yn %>";
        
		// 리턴페이지를 파라메터로 받은 경우
		if (backUrl !=''){
			login_href =backUrl;
		}
		console.log("sci_param : " + sci_param);
		console.log("form_param : " + form_param);
		console.log("form_action : " + form_action);
		console.log("login_href : " + login_href);
		
		//localStorage.removeItem('sci_param'); // 주문서로 전달하기 위한 파리메터
		//localStorage.removeItem('sci_action'); // 주문서 이전 사은품 선택 페이지 url
		//localStorage.removeItem('sci_login_href'); // 로그인 폼 url
		
		var input_str = "";
		var goods_no = "";
		for(var key in form_param){
			
			// 모바일 입력형 옵션상품 비회원 주문오류 적용
    		// if(key == 'goods_choc_desc' || key.indexOf("opt_input_value") > -1 || key.indexOf("goods_no") > -1 || key.indexOf("cartSn") > -1) {
				input_str += "<input type='text' name='"+key+"' value='"+decodeURIComponent(form_param[key])+"'>\n";
    		// } else {
    		// 	input_str += "<input type='text' name='"+key+"' value='"+form_param[key]+"'>\n";
    		// }
			if(key == 'goods_no') {
				goods_no = decodeURIComponent(form_param[key]);
			}
		}
		var frm_send_obj = parent.window.document.getElementById("frm_send");
		frm_send_obj.innerHTML = input_str;
		
		if (goods_no == null || goods_no == ""){
			if(getAdultChkYn()){	// 19금상품 인증일 경우
				if (confirm_yn == "Y"){ // 인증 처리			
					if("<%=adultAgeYn %>" == "Y"){ // 만19세 확인 
						setCookieToday('ADULTYN', 'Y', 30);
						setAdultChk();
						//sessionStorage.setItem('adult', 'Y');
					}else{
						setCookieToday('ADULTYN', 'N', 30);
					}

					var returnUrl = getReturnUrl(login_href);

					if(returnUrl != ""){
						//frm_send_obj.action = decodeURIComponent(returnUrl);
						parent.window.location.href = decodeURIComponent(returnUrl);
					}else{
						//frm_send_obj.action = login_href;
						parent.window.location.href = login_href;
					}
				}else if (confirm_yn == ""){ // 인증하지 않고 돌아오기
					//frm_send_obj.action = login_href;
					parent.window.location.href = login_href;
				}else{ // 인증 실패
					alert('인증에 실패 하였습니다.');
					//frm_send_obj.action = login_href;
					parent.window.location.href = login_href;
				}
			}else{
				alert('본인 인증 요청정보가 존재하지 않습니다.');
				//frm_send_obj.action = login_href;
				parent.window.location.href = login_href;
			}
		}else{		
			if (confirm_yn == "Y"){ // 인증 처리
				if(getAdultChkYn()){	// 19금상품 인증일 경우
					if("<%=adultAgeYn %>" == "Y"){ // 만19세 확인
						setCookieToday('ADULTYN', 'Y', 30);
						//sessionStorage.setItem('adultChk', 'Y');
						setAdultChk();
					}else{
						setCookieToday('ADULTYN', 'N', 30);
					}
				}

				frm_send_obj.action = form_action;
				frm_send_obj.submit();
				//parent.window.location.href = form_action + param_str;
			}else if (confirm_yn == ""){ // 인증하지 않고 돌아오기
				frm_send_obj.action = login_href;
				frm_send_obj.submit();
				
			}else{ // 인증 실패
				alert('인증에 실패 하였습니다.');
				frm_send_obj.action = login_href;
				frm_send_obj.submit();
			}
		}

	});

	function setAdultChk(){
		var defaultDomain = "http://"+location.hostname;
		//var defaultDomain = "http://" + location.host;
		console.log("defaultDomain ==== " + defaultDomain);
		//console.log("origin ==== " + location.origin);
		defaultDomain = defaultDomain + '/json/cn/login_check.json';
	   	$.ajax({
			type: 'post'
			, async: false
			, url: defaultDomain
			, data: $('#frm').serialize()
	   		, success: function(data) {
	   			console.log("data : " + data);
	   			if(data.loginCheck != undefined) {
	   				//$sessionStorage.LotteUserService_loginCheck = data.loginInfo;
	   				console.log("sessionStorage1 : " + sessionStorage.getItem('LotteUserService_loginCheck'));
	   				setSessionStorage('ngStorage-LotteUserService_loginCheck', data.loginCheck, 'json');
	   				console.log("data : " + data);
	   				console.log("data adult : " + data.loginCheck.adult);
	   				console.log("sessionStorage2 : " + sessionStorage.getItem('LotteUserService_loginCheck'));
	   			}
			}
			, error: function(data) {
				console.log(data);
			}
		});  
	}

	//쿠키 설정
	function setCookieToday( name, value, expiredays ){
		//내일 00:00 시 구하기
	    var todayDate = new Date();
		todayDate.setDate(todayDate.getDate() + expiredays );
	
		//쿠키 expire 날짜 세팅 
		var expireDate =new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate());

		var cookie_domain = "";
		var login_href = localStorage.getItem('sci_login_href'); // 로그인 폼 url	

		// 리턴페이지를 파라메터로 받은 경우
		if (backUrl !=''){
			login_href =backUrl;
		}
		
		if(login_href.indexOf(".ellotte.com")>-1){
			cookie_domain = ".ellotte.com";
		}else{
			cookie_domain = ".lotte.com";
		}

		document.cookie = name + '=' + escape( value ) + '; domain='+cookie_domain+'; path=/; expires=' + expireDate.toGMTString() + ';';	
	}

	function getAdultChkYn(){
		var login_href = localStorage.getItem('sci_login_href'); // 로그인 폼 url	

		// 리턴페이지를 파라메터로 받은 경우
		if (backUrl !=''){
			login_href =backUrl;
		}
		
		if(login_href.indexOf("adultChk=Y")>-1){
			return true;
		}else{
			return false;
		}
	}

	function getReturnUrl(url){
		if(url.indexOf("targetUrl")>-1){
			var url_arr = url.split("&");
			for(var i=0; i<url_arr.length; i++){
				var url_arr2 = url_arr[i].split("=");
				if(url_arr2[0]=="targetUrl"){
					if(url_arr2[1] != ""){
						//return decodeURIComponent(url_arr2[1]);
						return url_arr2[1];
					}else{
						return "";
					}

					break;
				}
			}
		}else{
			return "";
		}
	}
//
--></script>
<div style="display:none">

<form id="frm" name="frm" method="post" action=""></form>
</div>
