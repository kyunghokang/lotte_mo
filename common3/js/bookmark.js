// 프로토콜로 개별저장되는 localStorage 동기화
function bookmarkCopy(bookmark_str, act_div, tgt_div){
	var app_yn = $(".bookmarListkLayer input[name=app_yn]:hidden", top.document).val(); // 앱 저장여부
	var app_save = $(".bookmarListkLayer input[name=app_save]:hidden", top.document).val(); // 앱 저장여부
	if (app_yn=="Y" && app_save=="Y"){
		setBookMarkToApp(bookmark_str, act_div, tgt_div);
	}
}

// 앱 버튼 활성화 여부
function appBookMarkAvailable(android_yn, available){	
	if (android_yn == "N"){ // iOS
		top.document.getElementById('storage_frame').src = 'favorcontroll://isThisPageAvailable/'+available;
	} else { // android
		if (window.favorcontroll)
			window.favorcontroll.callAndroid(available);
	}
}

// 앱 저장 공간 사용 시 북마크 조회
function getBookMarkFromApp(bookmark_str){
	localStorage.setItem("bookmark", bookmark_str);
	bookmarkCopy(localStorage.getItem("bookmark"), "ADD", "READ");
}

// 앱 저장 공간 사용 시 북마크 저장
function setBookMarkToApp(bookmark_str, act_div, tgt_div){
	var android_yn = $(".bookmarListkLayer input[name=android_yn]:hidden", top.document).val();

	bookmark_str = bookmark_str.replace(/'/g, '');
	bookmark_str = encodeURIComponent(bookmark_str);
	if (android_yn == "N"){ // iOS
		if (act_div == "ADD"){
			if (tgt_div == "GOODS"){
				top.document.getElementById('storage_frame').src = 'favorlist://AddToApp/list?'+bookmark_str;
			}else{
				top.document.getElementById('storage_frame').src = 'favorlist://InsToApp/list?'+bookmark_str;
			}
		}else{
			top.document.getElementById('storage_frame').src = 'favorlist://DelToApp/list?'+bookmark_str;
		}
	} else { // android
		window.favorlist.callAndroid(bookmark_str);
	}
}

// 북마크를 배열로 변경하여 반환
function getBookMarkObj(){
	var storage_obj, bookmark_obj;
	storage_str = localStorage.getItem("bookmark"); // localStorage에 기록된 북마크 정보
	// 기존 즐겨찾기가 없다면
	if(storage_str==null || storage_str=="null" || storage_str=="undefined"){
		storage_str = "";
	}

	if (storage_str.length < 1){ // localStorage에 기록된 정보가 없으면
		bookmark_obj = new Array(); // 빈 배열 생성
	}else{ // localStorage에 기록된 정보가 있으면
		storage_obj = eval('(' + storage_str + ')'); // 문자열로 된 북마크 정보를 json 형태로 변경
		bookmark_obj = storage_obj.bookmark; // json의 key로 data 받음
	}

	return bookmark_obj;
}

// 상품추가
function setProductBookMark(goods_no){
	var return_arr, copy_arr, tot_length;

	return_arr = getBookMarkObj();
	tot_length = return_arr.length;
	copy_arr = new Array((tot_length==20?tot_length:tot_length+1));
	
	for(var i=0;i<tot_length && i<19;i++){
		copy_arr[i+1] = return_arr[i];
	}
	
	copy_arr[0] = goods_no;
	
	return_arr = copy_arr;
	
	localStorage.setItem("bookmark", JSONtoString(return_arr, "set"));
	bookmarkCopy(localStorage.getItem("bookmark"), "ADD", "GOODS");
	//top.storage_frame.setBookMark(JSONtoString(url_obj, product_obj));
	
	var uagent = navigator.userAgent.toLowerCase(); // 디바이스 구분을 위해
	var cur_url = location.href;
	    cur_url = cur_url.substring(cur_url.indexOf('v='));
	    cur_url = cur_url.substring(0, cur_url.indexOf('&'));
	var app_ver = cur_url.replace('v=', '');
	/** ELLOTTE PROJECT : DSYOON START **/
	if(location.href.indexOf(".ellotte.com")==-1){
		if (uagent.search('ipad') < 0 || (uagent.search('ipad') > -1 && !appVerChk(app_ver, '126'))){ // 아이패드가 아닌 경우 
			alert('스크랩에 추가되었습니다.');//alert('즐겨찾기에 추가되었습니다.');
		}
	}else{
		alert('스크랩에 추가되었습니다.');
	}/** ELLOTTE PROJECT : DSYOON END **/
}

// Url 주소 및 파라메터 추가
function setPageBookMark(){
	var return_arr, copy_arr, tot_length;

	return_arr = getBookMarkObj();
	tot_length = return_arr.length;
	copy_arr = new Array((tot_length==20?tot_length:tot_length+1));
	
	for(var i=0;i<tot_length && i<19;i++){
		copy_arr[i+1] = return_arr[i];
	}
	
	//공통파라메터를 제외한 필요한 내용 추리기
	var url_str = (location.href).replace("://", ""); // 페이지를 찾을 때를 위해 :// 는 삭제
	var page_str = url_str.substring(url_str.indexOf("/"), url_str.indexOf("?")); // 도메인 부분이후부터 파라메터 시작 전까지
	var param_arr = (url_str.substring(url_str.indexOf("?") + 1)).split("&"); // 파라메터 구분
	var param_mem;
	var param_key="", param_str="";
	var goods_no = ""; // 상품상세 url 저장 시 상품이 저장 되도록하기 위한 변수 선언
	
	for(var i=0; i<param_arr.length; i++){
		param_mem = param_arr[i].split("=");
		param_key = param_mem[0];
		
		if (page_str.indexOf("product_view.do") > -1 && param_key=="goods_no"){
			goods_no = param_mem[1];
			break;
		}
		
		if(param_key=="c" || param_key=="v" || param_key=="cn" 
		|| param_key=="cdn" || param_key=="udid" || param_key=="schema" 
		|| param_key=="tstore_yn" || param_key=="cosemkid"){
			continue;
		}
		
		param_str += ((param_str.length>0?"&":"") + param_arr[i]);
	}
	
	// page에 따른 타이틀 생성하기
	var title = ""; // 기본 타이틀
	var uagent = navigator.userAgent.toLowerCase(); // 디바이스 구분을 위해
	if (page_str.indexOf("product_view.do") > -1){ // 상품상세일 경우 상품명 찾기
		if (goods_no.length > 0){
			setProductBookMark(goods_no);
			
			return;
		}
		
	}else if (page_str.indexOf("/category/") > -1){ // 카테고리인 경우
		title = (($(".subTitle h2").text()).replace("카테고리", "") + " 카테고리"); // 최상위카테고리에 카테고리 텍스트가 있어서 삭제 후 붙이도록 함
		if(title==""){
			title = (($("#head_sub h2").text()).replace("카테고리", "") + " 카테고리"); 
		}
	}else if (uagent.search('ipad') > -1 && page_str.indexOf("/search/t/") > -1){ // 아이패드 검색 결과인 경우
		title = $("#searchTxt").text(); // 기본 타이틀
	}else{
		title = $(".subTitle h2").text(); // 기본 타이틀
		if(title == ""){
			title = $("#head_sub h2").text(); // 기본 타이틀
		}
	}
	
	
	
	var add_url_data = new Array();
	add_url_data[add_url_data.length] = title; // 제목
	add_url_data[add_url_data.length] = (location.protocol=="https:"?"https":"http"); // 프로토콜
	add_url_data[add_url_data.length] = page_str; // 페이지 주소
	add_url_data[add_url_data.length] = param_str; // 공통파라메터 외 파라메터
	
	
	copy_arr[0] = add_url_data;
	
	return_arr = copy_arr;
	 
	localStorage.setItem("bookmark", JSONtoString(return_arr, "set"));
	bookmarkCopy(localStorage.getItem("bookmark"), "ADD", "PAGE");

	var uagent = navigator.userAgent.toLowerCase(); // 디바이스 구분을 위해
	var cur_url = location.href;
	    cur_url = cur_url.substring(cur_url.indexOf('v='));
	    cur_url = cur_url.substring(0, cur_url.indexOf('&'));
	var app_ver = cur_url.replace('v=', '');
	/** ELLOTTE PROJECT : DSYOON START **/
	if(location.href.indexOf(".ellotte.com")==-1){
		if (uagent.search('ipad') < 0 || (uagent.search('ipad') > -1 && !appVerChk(app_ver, '126'))){ // 아이패드가 아닌 경우 
			alert('스크랩에 추가되었습니다.');//alert('즐겨찾기에 추가되었습니다.');
		}
	}else{
		alert('스크랩에 추가되었습니다.');
	}/** ELLOTTE PROJECT : DSYOON END **/
}

//Url 주소 및 파라메터 추가
function setPageBookMark_2014(){
	var return_arr, copy_arr, tot_length;

	return_arr = getBookMarkObj();
	tot_length = return_arr.length;
	copy_arr = new Array((tot_length==20?tot_length:tot_length+1));
	
	for(var i=0;i<tot_length && i<19;i++){
		copy_arr[i+1] = return_arr[i];
	}
	
	//공통파라메터를 제외한 필요한 내용 추리기
	var url_str = (location.href).replace("://", ""); // 페이지를 찾을 때를 위해 :// 는 삭제
	var page_str = url_str.substring(url_str.indexOf("/"), url_str.indexOf("?")); // 도메인 부분이후부터 파라메터 시작 전까지
	var param_arr = (url_str.substring(url_str.indexOf("?") + 1)).split("&"); // 파라메터 구분
	var param_mem;
	var param_key="", param_str="";
	var goods_no = ""; // 상품상세 url 저장 시 상품이 저장 되도록하기 위한 변수 선언
	
	for(var i=0; i<param_arr.length; i++){
		param_mem = param_arr[i].split("=");
		param_key = param_mem[0];
		
		if (page_str.indexOf("product_view.do") > -1 && param_key=="goods_no"){
			goods_no = param_mem[1];
			break;
		}
		
		if(param_key=="c" || param_key=="v" || param_key=="cn" 
		|| param_key=="cdn" || param_key=="udid" || param_key=="schema" 
		|| param_key=="tstore_yn" || param_key=="cosemkid"){
			continue;
		}
		
		param_str += ((param_str.length>0?"&":"") + param_arr[i]);
	}
	
	// page에 따른 타이틀 생성하기
	var title = ""; // 기본 타이틀
	var uagent = navigator.userAgent.toLowerCase(); // 디바이스 구분을 위해
	if (page_str.indexOf("product_view.do") > -1){ // 상품상세일 경우 상품명 찾기
		if (goods_no.length > 0){
			setProductBookMark(goods_no);
			return;
		}
	}else if (page_str.indexOf("/category/") > -1){ // 카테고리인 경우
		title = $("#head_sub span").text(); // 최상위카테고리에 카테고리 텍스트가 있어서 삭제 후 붙이도록 함
	}else if (uagent.search('ipad') > -1 && page_str.indexOf("/search/t/") > -1){ // 아이패드 검색 결과인 경우
		title = $("#searchTxt").text(); // 기본 타이틀
	}else{
		title = $("#head_sub h2").text(); // 기본 타이틀
	}
	var add_url_data = new Array();
	add_url_data[add_url_data.length] = title; // 제목
	add_url_data[add_url_data.length] = (location.protocol=="https:"?"https":"http"); // 프로토콜
	add_url_data[add_url_data.length] = page_str; // 페이지 주소
	add_url_data[add_url_data.length] = param_str; // 공통파라메터 외 파라메터
	
	copy_arr[0] = add_url_data;
	
	return_arr = copy_arr;
	
	localStorage.setItem("bookmark", JSONtoString(return_arr, "set"));
	bookmarkCopy(localStorage.getItem("bookmark"), "ADD", "PAGE");

	var uagent = navigator.userAgent.toLowerCase(); // 디바이스 구분을 위해
	var cur_url = location.href;
	    cur_url = cur_url.substring(cur_url.indexOf('v='));
	    cur_url = cur_url.substring(0, cur_url.indexOf('&'));
	var app_ver = cur_url.replace('v=', '');
	/** ELLOTTE PROJECT : DSYOON START **/
	if(location.href.indexOf(".ellotte.com")==-1){
		if (uagent.search('ipad') < 0 || (uagent.search('ipad') > -1 && !appVerChk(app_ver, '126'))){ // 아이패드가 아닌 경우 
			alert('스크랩에 추가되었습니다.');//alert('즐겨찾기에 추가되었습니다.');
		}
	}else{
		alert('스크랩에 추가되었습니다.');
	}/** ELLOTTE PROJECT : DSYOON END **/
}

// 북마크 내용 조회
function getBookMarkParam(){
	var return_arr;
	
	return_arr = getBookMarkObj();
	
	return encodeURIComponent((JSONtoString(return_arr, "get")));
}

// 북마크 내용 삭제 (북마크구분, 북마크 인덱스, 실행위치)
function deleteBookMarkItem(idx, offset){
	var return_arr, tmp_arr;


	return_arr = getBookMarkObj();
	tmp_arr = new Array();
	
	for (var i=0; i < return_arr.length; i++){ // 대상 북마크 수만큼 루프 실행
		if (i!=idx){			
			tmp_arr[tmp_arr.length] = return_arr[i];
		}
	}
	
	return_arr = tmp_arr;
	
	localStorage.setItem("bookmark", JSONtoString(return_arr, "set"));
	bookmarkCopy(localStorage.getItem("bookmark"), "DEL", "");
	
	// 삭제 클릭 시 재조회
	var common_param = $(".bookmarListkLayer input[name=common_param]:hidden", parent.document).val();
	//$(".bookmarListkLayer iframe", top.document).attr('src', '/popup/bookmark_list.do?'+common_param+'&bm_param='+getBookMarkParam()+'&offset='+offset);
	self.location.href = "/popup/bookmark_list_2014.do?"+common_param+"&bm_param="+getBookMarkParam()+"&offset="+offset;
	
}

//북마크 내용 삭제 (북마크구분, 북마크 인덱스, 실행위치)
function deleteBookMarkItem_2014(idx, offset, common_param, return_url){
	var return_arr, tmp_arr;
	
	if(confirm('삭제 하시겠습니까?'))
	{
		return_arr = getBookMarkObj();
		tmp_arr = new Array();
		for (var i=0; i < return_arr.length; i++){ // 대상 북마크 수만큼 루프 실행
			if (i!=idx){			
				tmp_arr[tmp_arr.length] = return_arr[i];
			}
		}
		return_arr = tmp_arr;
		localStorage.setItem("bookmark", JSONtoString(return_arr, "set"));
		bookmarkCopy(localStorage.getItem("bookmark"), "DEL", "");
		
		// 삭제 클릭 시 재조회
		//var common_param = $(".bookmarListkLayer input[name=common_param]:hidden").val();
		//var common_param = $(".bookmarListkLayer input[name=common_param]:hidden", parent.document).val();
		//$(".bookmarListkLayer iframe", top.document).attr('src', '/popup/bookmark_list.do?'+common_param+'&bm_param='+getBookMarkParam()+'&offset='+offset);
		var url = "/popup/bookmark_list_2014.do?"+common_param+"&bm_param="+getBookMarkParam()+"&offset="+offset+"&return_url="+encodeURIComponent(return_url);
	
		location.href = url;
	}
}

//북마크 내용 전체삭제 (북마크구분, 북마크 인덱스, 실행위치)
function deleteBookMarkItem_ALL_2014(idx, offset, common_param, return_url){
	if(confirm('삭제 하시겠습니까?'))
	{		
		localStorage.removeItem("bookmark");
		/** ELLOTTE PROJECT : DSYOON START **/
		var strDelBookmark = new Array();
		bookmarkCopy(JSONtoString(strDelBookmark, "set"), "DEL", "");
		/** ELLOTTE PROJECT : DSYOON END **/
		var url = "/popup/bookmark_list_2014.do?"+common_param+"&bm_param="+getBookMarkParam()+"&offset="+offset+"&return_url="+encodeURIComponent(return_url);
	
		location.href = url;
	}
}

// 배열을 JSON 형태의 문자열로 변환
function JSONtoString(bookmark_obj, div) {   
	var return_str = (div=="set"?"{bookmark:[":"");
	var tmp_str = "";
	var tmp_obj_i, tmp_obj_j;
	var limit = (div=="get"?":^:":",");
	
	// 배열 루프 실행
	if (bookmark_obj.length > 0){
		
		for (var i=0; i < bookmark_obj.length; i++){
			break_tf = false;
			
			if (typeof(bookmark_obj[i]) == "string"){ // 상품코드인 경우
				
				tmp_str += ('\"' + bookmark_obj[i] + '\"');
			}else if (typeof(bookmark_obj[i]) == "object"){ // url 사이트 주소인 경우
				tmp_obj_i = bookmark_obj[i];
				tmp_str += "[";
				
				for (var j=0; j < tmp_obj_i.length; j++){ // url 북마크 데이터 수만큼 루프 실행
					tmp_obj_j = tmp_obj_i[j];
					
					tmp_obj_j = tmp_obj_j.replace(/'/g, '');
					
					tmp_str += ('\"' + tmp_obj_j + '\"' + (j!=(tmp_obj_i.length-1)?",":""));
				}
				
				tmp_str += "]";
			}
			
			tmp_str += (i!=(bookmark_obj.length-1)?limit:"");
		}
		
		return_str += tmp_str;
	}

	return_str += (div=="set"?"]}":"");
	
	if (div=="get"){
		return_str = return_str.replace(/"/g, '');
	}
	
	return return_str;  
}

// 즐겨찾기에 기록된 페이지로 이동
function bookMarkResultGo(url){
	parent.location.href = url;
}

//=========== 즐겨찾기 팝업 열고 닫기 =========
function showBookmarkList(bookmark_str){
	bookmark_str = bookmark_str.replace(/'/g, '');
	
	// 앱에서 저장된 북마크 내용을 전달 받을 경우
	var android_yn = $(".bookmarListkLayer input[name=android_yn]:hidden", top.document).val(); // 안드로이드 여부
	var app_yn = $(".bookmarListkLayer input[name=app_yn]:hidden", top.document).val(); // 앱 여부
	var app_save = $(".bookmarListkLayer input[name=app_save]:hidden", top.document).val(); // 앱 저장 여부
	
	if (app_yn=="Y" && app_save=="Y" && bookmark_str!="" && typeof(bookmark_str)!="undefined"){
		getBookMarkFromApp(bookmark_str);
		
		appBookMarkAvailable(android_yn, false);
	}
	
	var offset = window.pageYOffset;
	$(window).scrollTop(0);
	var common_param = $(".bookmarListkLayer input[name=common_param]:hidden").val();
	//$(".bookmarListkLayer").show();
	//$(".bookmarListkLayer iframe").attr('src', '/popup/bookmark_list.do?'+common_param+'&bm_param='+getBookMarkParam()+'&offset='+offset);
	//$("#container").hide();
	
	var url = "/popup/bookmark_list_2014.do?"+common_param+"&bm_param="+getBookMarkParam()+"&offset="+offset+"&return_url="+encodeURIComponent(document.URL);
	var app_tclick = $(".bookmarListkLayer input[name=app_tclick]:hidden").val();/** ELLOTTE PROJECT : DSYOON START **/
	if(typeof app_tclick != 'undefined' && app_tclick!="" ){
		url +="&tclick="+app_tclick;
	}/** ELLOTTE PROJECT : DSYOON END **/
	location.href = url;
	
	// 태블릿에서 사용하는 태그 숨기기 start add by jjhan 20131119
	if($(".btn-top"))      {$(".btn-top").hide();}
	// 태블릿에서 사용하는 태그 숨기기 end   add by jjhan 20131119
		
}

//=========== 즐겨찾기 팝업 열고 닫기 (모바일 리뉴얼) =========
function showBookmarkList_2014(bookmark_str){
	if(typeof bookmark_str == 'undefined'){
		bookmark_str = "";
	}
	bookmark_str = bookmark_str.replace(/'/g, '');
	
	// 앱에서 저장된 북마크 내용을 전달 받을 경우
	var android_yn = $(".bookmarListkLayer input[name=android_yn]:hidden", top.document).val(); // 안드로이드 여부
	var app_yn = $(".bookmarListkLayer input[name=app_yn]:hidden", top.document).val(); // 앱 여부
	var app_save = $(".bookmarListkLayer input[name=app_save]:hidden", top.document).val(); // 앱 저장 여부
	
	if (app_yn=="Y" && app_save=="Y" && bookmark_str!="" && typeof(bookmark_str)!="undefined"){
		getBookMarkFromApp(bookmark_str);
		
		appBookMarkAvailable(android_yn, false);
	}
	
	var offset = window.pageYOffset;
	$(window).scrollTop(0);
	var common_param = $(".bookmarListkLayer input[name=common_param]:hidden").val();
	//$(".bookmarListkLayer").show();
	//$(".bookmarListkLayer iframe").attr('src', '/popup/bookmark_list.do?'+common_param+'&bm_param='+getBookMarkParam()+'&offset='+offset);
	//$("#container").hide();
	var url = "/popup/bookmark_list_2014.do?"+common_param+"&bm_param="+getBookMarkParam()+"&offset="+offset+"&return_url="+encodeURIComponent(document.URL);
	var app_tclick = $(".bookmarListkLayer input[name=app_tclick]:hidden").val();/** ELLOTTE PROJECT : DSYOON START **/
	if(typeof app_tclick != 'undefined' && app_tclick!="" ){
		url +="&tclick="+app_tclick;
	}/** ELLOTTE PROJECT : DSYOON END **/
	location.href = url;
	
	// 태블릿에서 사용하는 태그 숨기기 start add by jjhan 20131119
	if($(".btn-top"))      {$(".btn-top").hide();}
	// 태블릿에서 사용하는 태그 숨기기 end   add by jjhan 20131119
		
}

function hideBookmarkList_2014(url){	
	var android_yn = $(".bookmarListkLayer input[name=android_yn]:hidden", top.document).val(); // 안드로이드 여부
	var app_yn = $(".bookmarListkLayer input[name=app_yn]:hidden", top.document).val(); // 앱 여부
	var available = $(".bookmarListkLayer input[name=available]:hidden", top.document).val(); // 저장 활성화
	
	if (app_yn=='Y'){
		appBookMarkAvailable(android_yn, available);
	}
	
	//var url = "/popup/bookmark_list_2014.do?"+common_param+"&bm_param="+getBookMarkParam()+"&offset="+offset;
	
	location.href = url;
}

function hideBookmarkList(){	
	var offset = $("#container input[name=offset]:hidden").val();
	var android_yn = $(".bookmarListkLayer input[name=android_yn]:hidden", top.document).val(); // 안드로이드 여부
	var app_yn = $(".bookmarListkLayer input[name=app_yn]:hidden", top.document).val(); // 앱 여부
	var available = $(".bookmarListkLayer input[name=available]:hidden", top.document).val(); // 저장 활성화
	
	if (app_yn=='Y'){
		appBookMarkAvailable(android_yn, available);
	}
	
	//$(".bookmarListkLayer", parent.document).hide();
	//$("#container", parent.document).show();
	
	location.href = url;
	
	// 태블릿에서 사용하는 태그 보이기 start add by jjhan 20131119
	//if($(".btn-top"))      {$(".btn-top", parent.document).show();}
	// 태블릿에서 사용하는 태그 보이기 start add by jjhan 20131119
		
	//$(top).scrollTop(offset);
}
//============= 사이드 메뉴 ===================
function goTop(){
	$(window).scrollTop(0);
}
/*0225 스크롤 위치 수정*/
var scrollGap;
function setSG(){
	scrollGap = document.body.clientHeight - 110 - Math.floor(document.body.clientHeight*0.05);
}
function setSideH(){
	$("#sideMeniu").hide();
	$("#sideMeniu").css("top", window.pageYOffset +  scrollGap + "px");
	$("#sideMeniu").show(500);
}
$(document).ready(function(){
	setSG();
});
$(window).scroll(function(){
	setSideH();
});
$(window).resize(function(){
	setSG();
	setSideH();
});