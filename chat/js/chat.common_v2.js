

var isEllotte = (location.host.indexOf(".ellotte.com") > -1);

var _splitUrl = location.href.split("&");
var _appVer = "";
var _appUdid = "";
var _appSchema = "";
var _appBtDispYn = false;
var _userAgent = navigator.userAgent.toLowerCase();
for(i=0; i < _splitUrl.length; i++){
	if(_splitUrl[i].indexOf("v=") > -1){
		_appVer = _splitUrl[i].replace("v=",""); 
	}else if(_splitUrl[i].indexOf("udid=") > -1){
		_appUdid = _splitUrl[i].replace("udid=","");
		
	}else if(_splitUrl[i].indexOf("schema=") > -1){
		_appSchema = _splitUrl[i].replace("schema=","");
	}
}




//alert(_appUdid);
//String udid	= ConvertUtil.removeHtml(request.getParameter("udid"), "");
//String udid	= ConvertUtil.removeHtml(request.getParameter("udid"), "");


//String lotte_app = (_appUdid.equals("")?"N":"Y"); // 롯데닷컴앱

//alert(lotte_app);
var isChatDev = (location.host.indexOf("m.ellotte.com") ==  -1);
var command = "";
var subcommand = "";
var domain_id = "";
var node_id = "";

if(isEllotte){
	if(isChatDev){ //개발용
		domain_id = "NODE0000000003";
		node_id = "NODE0000000009";
	}else{
		domain_id = "NODE0000000003";
		node_id = "NODE0000000006";
	}
	
}else{
	domain_id = "NODE0000000001";
	node_id = "NODE0000000004";
	rop_node_id = "NODE0000000014";
}

// 롯데닷컴 : NODE0000000001
// 롯데닷컴(중문) : NODE0000000002
// 엘롯데 : NODE0000000003

var service_type = "SVTLK";

var in_channel_id = "";

if(isAppForTalk2_script > -1 || isAppForTalk_script > -1){
	in_channel_id = "CHNL0000000003";
}else{
	in_channel_id = "CHNL0000000002";
}
//  1) PC웹       - CHNL0000000001
//  2) 모바일웹  - CHNL0000000002
//  3) 모바일앱  - CHNL0000000003

//var customer_id = "hong";
var customer_id = userId;
//alert(customer_id);

//롯데닷컴 : NODE0000000004               4
//롯데닷컴(중문) : NODE0000000006         5
//엘롯데 : NODE0000000009                 6

var chatUrl = "/proxy";
