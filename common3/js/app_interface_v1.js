// 로그인아이디전송
function transLoginIdToApp(div, login_id){	
	// 디바이스 별 함수 호출
	if (chk_device()=="iOS"){
		var app_frame = top.document.getElementById('app_frame');
		/*
		if (app_frame==null || app_frame==undefined){
			app_frame = top.document.createElement('app_frame');
			app_frame.style.display = 'none';
		}
		*/
		if (div=='login'){
			//top.document.getElementById('storage_frame').src = 'loginCheck://loginId/'+login_id;
			app_frame.src = 'loginCheck://loginId/'+login_id;
		}else{
			//top.document.getElementById('storage_frame').src = 'loginCheck://logout';
			app_frame.src = 'loginCheck://logout';
		}
	} else { // android
		if (div=='login'){
			if (window.loginCheck)
				window.loginCheck.callAndroid("loginId/"+login_id);
		}else{
			if (window.loginCheck)
				window.loginCheck.callAndroid("logout");
		}
	}
}

function getLoginInfo() {
	var loginInfo = null;

	try {
		loginInfo = JSON.parse(sessionStorage.getItem("ngStorage-LotteUserService_loginCheck"));
	} catch (e) {}

	return loginInfo;
}

function loginChk() {
	var loginInfo = getLoginInfo(),
		rtnBoolean = false;

	if (loginInfo && loginInfo.isLogin) {
		rtnBoolean = loginInfo.isLogin;
	}

	return rtnBoolean;
}

// 로그인체크
function chkLoginByApp(){	
	// 디바이스 별 함수 호출
	if (chk_device()=="iOS"){
		top.document.getElementById('storage_frame').src = 'loginCheck://isUserLogged/'+loginChk();
	} else { // android
		window.loginCheck.callAndroid(loginChk());
	}
}

// 앱 하단 메뉴 채널, 채널상세 번호 변경
function callChangeParamUrl(app_url){
	// app_url 마지막에 '&' 가 있으면 삭제
	app_url = (app_url.substring(app_url.length - 1)=="&"?app_url.substring(0, app_url.length - 2):app_url);
	// 현재 페이지의 파라메터 읽기
	var curr_url = location.href; // 현재 url 주소
	var chk_para = ["cn", "cdn"]; // 치환 파라메터 명
	var chk_idx = -1;
	var tmp_str = "";
	var param_cn = "23";
		
	if(curr_url.indexOf(".ellotte.com") > -1){	//엘롯데 채널셋팅
		param_cn = "152726";
	}else if(curr_url.toLowerCase().indexOf("smp_yn=y") > -1){	//스마트픽 채널셋팅
		param_cn = "116824";
	}
	getUrlParameter(curr_url);

	for (var i=0; i<chk_para.length; i++){
		chk_idx = app_url.indexOf(chk_para[i]+"=");
		
		if (chk_idx > -1){
			continue;
		}else{

			if (sessionStorage.getItem(chk_para[i])!=null && sessionStorage.getItem(chk_para[i])!="" ){
				app_url = (app_url + (app_url.indexOf("?")>-1?"&":"?") + chk_para[i]+"="+sessionStorage.getItem(chk_para[i]));
			}else{
				if (chk_para[i]=="cn"){
					app_url = (app_url + (app_url.indexOf("?")>-1?"&":"?") + "cn="+param_cn);
				}else if (chk_para[i]=="cdn"){
					app_url = (app_url + (app_url.indexOf("?")>-1?"&":"?") + "cdn=");
				}
			}
		}
	}
	
	location.href = (app_url.split("@").join("&"));
}

// url 파라메터 반환
function getUrlParameter(req_url){
	var url_param = "";
	var tmp_1_arr, tmp_2_arr; // 파라메터1차구분, 파라메터2차구분, 반환값
	sessionStorage.clear();
	
	if (req_url.indexOf("?") > -1){ // 사이트 주소와 파라메터가 같이 있는 경우
		url_param = req_url.substring(req_url.indexOf("?") + 1);
	} else { // 사이트 주소와 파라메터가 같이 있지 않은 경우
		url_param = req_url;
	}
	
	// 파라메터 명과 값이 존재할 때
	if (url_param.indexOf("=") > -1){
		tmp_1_arr = url_param.split("&");
		
		for(var i=0; i<tmp_1_arr.length; i++){
			tmp_2_arr = tmp_1_arr[i].split("=");
			
			if(tmp_2_arr[0] == "cn" || tmp_2_arr[0] == "cdn"){
				sessionStorage.setItem(tmp_2_arr[0], tmp_2_arr[1]);
			}
		}
	}
}

//앱 최신버전 비교 ver1:현재앱 compareVer:비교버전
function appVerChk(ver1,compareVer){
	// ellotte_jklee16
	if ( window.location.href.indexOf(".ellotte.com") >= 0 ) {
		return true;
	}
	var appVer = ver1.replace(/\./gi,"");
	if(parseInt(appVer) > parseInt(compareVer)){
		return true;
	}else{
		return false;
	}
}

//앱 최신버전 비교 ver1:현재앱 compareVer:비교버전
function appChkVer(ver1,compareVer){
	var appVer = ver1.replace(/\./gi,"");
	if(parseInt(appVer) > parseInt(compareVer)){
		return true;
	}else{
		return false;
	}
}