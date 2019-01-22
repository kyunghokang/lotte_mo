/** ##$$##_jsp_EDT_000 /common3/common2013_v2.jsp jyyoon6 */
/** ELLOTTE PROJECT : HSLIM8 START **/

if ( window.location.href.indexOf(".ellotte.com") >= 0 ) {
	document.title = 'ellotte';
}else{
	document.title = '롯데닷컴';
}
/** ELLOTTE PROJECT : HSLIM8 END **/ 
var PAYTYPE_CODE_BANK   = '03';
var PAYTYPE_CODE_CARD   = '16';
var PAYTYPE_CODE_SMART  = '16-1'; // 2011.06.07 스마트페이 추가
var PAYTYPE_CODE_PHONE  = '15'; // 2011.05.27 (LotteUtil.java 참조)
var PAYTYPE_CODE_LPAY  = '40'; // 2015.07.01 L.pay

var MSG_ERROR_MY00401   = '조회하신 기간 동안의 주문내역이 없습니다.';
var MSG_ERROR_MY00402   = '선택하신 주문번호는 고객님의 주문이 아닙니다.';
var MSG_ERROR_MY00403   = '모바일에서 주문할 수 없는 상품입니다. 컴퓨터로 접속 후 이용하세요.';

//var MSG_ERROR_M000002 = '필수 파라미터가 전달되지 않았습니다.';
var MSG_ERROR_M000002   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000200   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000201   = '롯데닷컴 정회원만 주문/결제가 가능합니다. 정회원 신청은 롯데닷컴 웹사이트(www.lotte.com)을 이용해 주세요.';
var MSG_ERROR_M000202   = '모바일에서 주문할 수 없는 상품입니다. 컴퓨터로 접속 후 이용하세요.';
var MSG_ERROR_M000203_1 = '주문서 작성 중 오류가 발생했습니다.';
var MSG_ERROR_M000203_2 = '결제 진행 중 오류가 발생했습니다. 다시 결제를 시도해 주세요.';
var MSG_ERROR_M000204   = '당일 구매가능한 수량이 초과되었습니다.';
var MSG_ERROR_M000205   = '선택하신 상품은 재고 부족으로 주문하실 수 없습니다.';
var MSG_ERROR_M000206   = '죄송합니다. 선택하신 상품은 주문하실 수 없습니다.';
var MSG_ERROR_M000207   = '죄송합니다. 선택하신 상품은 주문하실 수 없습니다.';
var MSG_ERROR_M000208   = '주문과정 중에 품절되어 주문을 진행할 수가 없습니다.';
var MSG_ERROR_M000209   = '선택하신 상품의 최소 구매가능 수량 미만입니다.';

var MSG_ERROR_M000400   = '주문서 작성 중 오류가 발생했습니다.';
var MSG_ERROR_M000401_1 = '주문서 작성 중 오류가 발생했습니다.';
var MSG_ERROR_M000402_2 = '결제 진행 중 오류가 발생했습니다. 다시 결제를 시도해 주세요.';
var MSG_ERROR_M000403   = '우편번호가 변경되었습니다. 배송지 주소를 새로 입력해 주세요.';
var MSG_ERROR_M000404   = '주문서 작성 중 오류가 발생했습니다.';
var MSG_ERROR_M000405   = '이미 주문이 완료되었습니다. 마이롯데>주문/배송조회 내역을 확인하세요.';
var MSG_ERROR_M000406   = '주문 진행 중 오류가 발생했습니다.';

var MSG_ERROR_M000600   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000601   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000602   = '롯데카드로 결제 불가능한 상품입니다. 다른 결제수단을 선택해 주세요.';
var MSG_ERROR_M000603   = '유효하지 않은 카드번호입니다.';
var MSG_ERROR_M000604   = '모바일에서 주문할 수 없는 상품입니다. 컴퓨터로 접속 후 이용하세요.';
var MSG_ERROR_M000605   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000606   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000607   = '결제금액이 30만원 이상인 경우, 모바일에서 카드결제를 하실 수 없습니다.';
var MSG_ERROR_M000608   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000609   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000610   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000611   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000612   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000613   = '결제 진행 중 오류가 발생했습니다. 다시 결제를 시도해 주세요.';
var MSG_ERROR_M000614   = '결제 진행 중 오류가 발생했습니다. 다시 결제를 시도해 주세요.';
var MSG_ERROR_M000615   = '결제수단을 선택해 주세요.';
var MSG_ERROR_M000616   = '입금자명을 입력해 주세요.';
var MSG_ERROR_M000617   = '결제 진행 중 오류가 발생했습니다. 다시 결제를 시도해 주세요.';
var MSG_ERROR_M000618   = '결제 진행 중 오류가 발생했습니다. 다시 결제를 시도해 주세요.';
var MSG_ERROR_M000619   = '이미 주문이 완료되었습니다. 마이롯데>주문/배송조회 내역을 확인하세요.';
var MSG_ERROR_M000620   = '결제 진행 중 오류가 발생했습니다. 다시 결제를 시도해 주세요.';
var MSG_ERROR_M000621   = '선택하신 주문번호는 고객님의 주문이 아닙니다.';
var MSG_ERROR_M000622   = '주문 진행 중 오류가 발생했습니다.';
var MSG_ERROR_M000623   = '주문과정 중에 품절되어 주문을 진행할 수가 없습니다.';

var MSG_ECPN_CONF_001   = '관람권 확인 후 구매취소가 불가하오니 주의 바랍니다. \n확인하시겠습니까?';

var keyword_log;

function navback() {
	if ( history.length > 0 ) {
		history.go(-1);
	} else {
		alert('이전페이지가 존재하지 않습니다.');
	}
}

function errmove(msg, url) {
    if (msg) {
        alert(msg);
    }
    self.location.href = url;
}

function errback(msg, pagenum) {
	
	/*
    if (pagenum.length == 0) pagenum = -1;
    if (msg) {
        document.write('<div id="container"><div class="alert_box"><div class="top"></div><div class="bg">');
        document.write('<p class="mg_left30 pd_top4"><img src="http://image.lotte.com/lotte/mobile/sub/text_sorry.gif" alt="" /></p>');
        document.write('<p class="mg_left48 mg_right30"><span class="fs13 fc1e1e1e">');
        document.write(msg);
        document.write('</span></p>');
        document.write('<p class="ac mg_top15"><a href="javascript:history.go(' + pagenum + ')"><img src="http://image.lotte.com/lotte/mobile/btn/btn_previous2.png" alt="이전페이지로" /></a></p>');
        document.write('</div></div></div>');
    } else {
        history.go(pagenum);
    }
    */
	
	// 새로운 디자인
	if (pagenum.length == 0) pagenum = -1;
    if (msg) {
        document.write('<section class="order_none">');
        document.write('	<div class="box">');
        document.write('		<div class="txt">');
        document.write('			<p>');
        document.write('				<span class="txt01">');
        document.write(						msg	);
        document.write('				</span>');
        document.write('			</p>');
        document.write('		</div>');
        document.write('		<div class="btn">');
        document.write('			<a href="javascript:navback()" class="a_btn col02"><span>이전 페이지 가기</span></a>');
        document.write('		</div>');
        document.write('	</div>');
        document.write('</section>');
    } else {
        history.go(pagenum);
    }
	
}

function chImg(objThis, i) {	
	// ellotte_jklee16
	if ( window.location.href.indexOf(".ellotte.com") >= 0 ) {
		objThis.src="http://image.lotte.com/ellotte/images/common/product/no_"+i+".gif" 
	}else{
		objThis.src="http://image.lotte.com/lotte/images/common/product/no_"+i+".gif" 
	}
}

function goAppStore(pin) {
    if(pin == 'spick'){
        //alert('아이폰용 앱은 12월초에 오픈 예정입니다.');
        self.location.href = 'http://itunes.apple.com/kr/app/id483508898';
    }else if(pin == 'tablet'){  
        self.location.href="http://itunes.apple.com/kr/app//id447799601?l=ko&ls=1&mt=8";
    }else{
        self.location.href = 'http://itunes.apple.com/kr/app/id376622474?mt=8';
    }
}
function goMarketStore(pin) {
    if(pin == 'mobile'){    //롯데닷컴 app
        self.location.href = 'market://details?id=com.lotte';
    }else if(pin == 'spick'){   //스마트픽 app
        self.location.href = 'market://details?id=com.lotte.smartpick2a';
    }else{      //롯데닷컴  태블릿 app
        self.location.href = 'market://details?id=com.lotte.tab7';
    }
}

function goFacebookFan() {
    self.location.href = 'http://www.facebook.com/lottebeauty';
}

function goLottePc() {
    self.location.href = 'http://www.lotte.com/forward.index.lotte?m=1';
}

function dimmed(show) {
    if ( show == 'show' ) {
        $("#wrap_dimBg").show();
    } else {
        $("#wrap_dimBg").hide();
    }
}

//검색 버튼 클릭시 호출
function goSearch(){
	keyword = $('#searchText').val().replace(/(<|>)/g, "");
	if(!keyword ){
		alert("검색어를 입력해 주세요");
		$('#searchText').focus();
		return false;
	}else{
		insertMyword(keyword);
	}
}   

//최근본 상품 기록 삭제
function lateViewGoodsClear(){
	localStorage.removeItem("viewGoods");
}

//로컬스토리지에 키워드 추가
function insertMyword(str){ 
	var myWordList = localStorage.getItem('myWord');
	keyword = str.replace(/(<|>)/g, "");
	if(keyword == ''){
		return false;
	}
	if(myWordList != null){ //내검색기록 있을경우
		if(myWordList.indexOf(keyword) < 0){
			var temp = myWordList.split("|");
			var temp2 = ""; 
			if(temp.length <= 10){  //10개 이하
					myWordList = localStorage.getItem('myWord') + keyword + "|";    // 구분자 :
					localStorage.myWord = myWordList;
			}else{      //검색기록 10개 이상
				for(i=0 ; i < temp.length -2; i++){
					temp[i] = temp[i+1];
					temp2 = temp2 + temp[i] + "|";
				}
				temp2 = temp2 +keyword+ "|"; 
				localStorage.myWord = temp2;
			}
		}
	}else{      //처음 입력
		if(keyword != ''){
			myWordList = keyword + "|";
			localStorage.myWord =myWordList;
		}
	}
}

// 롯데맴버스카드 등록 영역 보이기
function showMembersCard(flag, reload_yn, res_str){ // 보이기 여부, 등록결과문자열
	if (flag){
		lt_crd_no = $("#lt_crd_no").val();
		
		$("#container").hide();
		//$('section.subTitle > a.prevPage2').hide();
		$("#common_frame").attr('src', '/popup/lotte_members_card_reg.jsp?lt_crd_no='+lt_crd_no+'&reload_yn='+reload_yn);
		$("#common_layer").show();
		$("#common_frame").show();
	}else{
		var reload_yn = $("#reload_yn").val();
		
		if (reload_yn == "Y"){
			parent.location.reload();
		}else{
			if ($.trim(res_str).length>0 && $.trim(res_str[4]) == 'Y'){
				var ltp_useable_point = 0;
				var ltp_rest_point = 0;
				
				ltp_rest_point = $.trim(res_str[3]); // 잔여 롯데 포인트
				while((/(-?[0-9]+)([0-9]{3})/).test(ltp_rest_point)) {
					ltp_rest_point = ltp_rest_point.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
				}
				
				if ($.trim(res_str[2]) > 1000){
					$("#ltp_chk_area", parent.document).show();
					$("#ltp_body_area", parent.document).show();
					$("#ltp_reg_btn_area", parent.document).hide();
					
					ltp_useable_point = $.trim(res_str[2]); // 사용가능 롯데 포인트
					while((/(-?[0-9]+)([0-9]{3})/).test(ltp_useable_point)) {
						ltp_useable_point = ltp_useable_point.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
					}
					
					$("#ltp_useable_text", parent.document).text(ltp_useable_point);				
				}
				$("#ltp_rest_area", parent.document).show();
				$("#ltp_rest_text", parent.document).text(ltp_rest_point);
				
				var alert_str = $.trim(res_str[1]) + "\n" + "고객님의 적립된 롯데 포인트는" + ltp_rest_point +"점이며\n";
				    alert_str += "사용가능포인트는 " + ltp_useable_point + "점 입니다.\n";
				    alert_str += "롯데 포인트는 1,000점이상 부터 사용가능 합니다.";
				    
				alert(alert_str);
			}
			
			$("#container", parent.document).show();
			//$('section.subTitle > a.prevPage2', parent.document).show();
			$("#common_frame", parent.document).attr('src', '/dacom/xansim/iframe.jsp');
			$("#common_layer", parent.document).hide();
			$("#common_frame", parent.document).hide();			
		}		
	}
}

// 롯데맴버스 카드 등록
function regMembersCard(reg_type){ // 등록/수정,삭제구분
	var card_num = $("input[name=cardNo1]").val()+$("input[name=cardNo2]").val()+$("input[name=cardNo3]").val()+$("input[name=cardNo4]").val();
	var res_str = ""; // 결과코드, 결과메시지, 사용가능포인트, 잔여포인트, 조회여부
	var res_code = "";
	var res_msg = "";
	
	if (!$('input[name=confirm_chk]:checkbox').attr('checked')){
		alert('제3자 정보제공 동의를 해주셔야 합니다.');
		return;
	}
	
	if (card_num.length < 16){
		alert('카드번호를 모두 입력해주세요.');
		return;
	}
	
	$.ajax({
		type: 'post'
		, async: false
		, url: '/popup/lotte_members_card_reg.do'
		, data: 'reg_type='+reg_type+'&card_num='+card_num
		, success: function(response) {
			res_str = response.split(':');	
			res_code = res_str[0];
			res_msg = res_str[1];
		}
	});
	
	if ($.trim(res_code)=='0000'){	
		$("#lt_crd_no", parent.document).val((reg_type=="D"?"":card_num));
		showMembersCard(false, 'N', res_str);
	}else{
		alert(res_msg);
	}
}

function getCookie (pin) {
	var mCookie = document.cookie;
	var ckName = pin + "=";
	var ckSize = mCookie.length;
	var ckBegin = 0;
	while (ckBegin < ckSize) {
		var vbegin = ckBegin + ckName.length;
			if (mCookie.substring(ckBegin, vbegin) == ckName) {
				var vend = mCookie.indexOf (";", vbegin);
				if (vend == -1) vend = ckSize;
			return unescape(mCookie.substring(vbegin, vend));
		}
		ckBegin = mCookie.indexOf(" ", ckBegin) + 1;
		if (ckBegin == 0) break;
	}
	return "";
}

jQuery(function($) {
	
	/* SEARCH */
	var searchURL;
	var tabletYn = "N";
	if($(window).width() < 684){
		searchURL = "/search/search_keyword.do";
	}else{
		tabletYn = "Y";
		/** ##$$##_js_EDT_STA /common3/js/common2013_v2.js jyyoon6 */
		var dpml_no = $("#dpml_no").val() ? $("#dpml_no").val() : 1;
		if($("#dpml_no").val() == 21){
			searchURL = "/search/search_keyword.do";
		}else{
			searchURL = "/search/t/search_keyword.do";
		}
		/** ##$$##_js_EDT_END /common3/js/common2013_v2.js jyyoon6 */
	}
	var searchARK = function(mode){
		switch (mode){
			case "start" :
			var myWordList = localStorage.getItem('myWord'); //로컬스토리지
			var keyword = $.trim($("#searchText").val());
			if ( keyword != keyword_log ) {
				if( $.trim(keyword) != '' ){
					$("#searchMYList").hide();
					var param = $("#searchForm").serialize();
					$.ajax({
						type: 'post'
						, async: true
						, url: searchURL
						, data: param
						, success: function(response) {
							$("#searchARKList").html(response).show();
							showContent(false);
							}
					});
				}else{
					if( myWordList != null ){ //마이키워드가 있는 경우
						showMykeywordList(true);
						$("#searchARKList").empty();
						showContent(false);
					}else{
						showMykeywordList(false);
						$("#searchARKList").empty();
						showContent(true);
					}
				}
				//$("#searchQueryCount").empty();
				
			}
			keyword_log = keyword;
			break;

			default :
			if ( keyword_log != "" )
				keyword_log = "";
			
			$("#searchARKList").empty();
			clearMyWord();
			showContent(true);
				
			break;
		}
	}

	var showContent = function(flag){
		if( !flag ){
			if(tabletYn == "N"){
				/** 모바일개선 검색레이어 - 201131126
				$("#container").hide();
				$("footer").hide();
				$(".footBanner").hide();
				$(".subTitle").hide();
				if($("body").attr("class") == "main"){
					$("#mainPopWindow").hide();
					$("#mbbsIcon").hide();
					$("#blotIcon").hide();
				}
				**/
				$("#container").show();
				$("footer").show();
				$(".footBanner").show();
				$(".subTitle").show();
				if($("body").attr("class") == "main"){
					$(".subTitle").hide();
					$("#ddban2").hide();
					$("#mainPopWindow").hide();
					$("#mbbsIcon").hide();
					$("#blotIcon").hide();
				}
			}
			//$("nav").hide();
			//$("#searchMylotte").hide();
			//$("#searchARKList").hide();
			/*if($("body").attr("class") == "main"){
				$(".subTitle").hide();
			}*/
			//$("#searchButton").show();
		}else{
			$("#container").show();
			$("footer").show();
			$(".footBanner").show();
			if($("body").attr("class") != "main"){
				$(".subTitle").show();
			}
			//$("nav").show();
			//$("#searchMylotte").show();
			//$("#searchButton").hide();
		}
	}
	
	var showMykeywordList = function(flag){
		if( flag ){
			searchMyWord();
		}else{
			clearMyWord();
		}
		showContent(flag);
	}
	//로컬스토리지에서 키워드 load후 마크업 생성
	var searchMyWord = function(){
		//var searchURL = "/search/search_keyword.do";
		var param = $("#searchForm").serialize() + "&type=myList";
		$.ajax({
			type: 'post'
			, async: true
			, url: searchURL
			, data: param
			, success: function(response) {
				$("#searchMYList").html(response).show();
				showContent(false);
				}
		});
		/*
		var $delKeyBtn = $('#searchview > .delview > a');
		$delKeyBtn.unbind();
		$delKeyBtn.bind('click', function(){
			delMyWord('');
			$('#searchMYList').empty();
			showContent(true);
			return false;
		});
		*/
	}

	

	/*로컬스토리지 삭제, str이 있는 경우 해당 값만 삭제
	var delMyWord = function(str){ 
		if(str == ''){
			localStorage.removeItem('myWord');
		}else{
			var myWordList = localStorage.getItem('myWord');
			var temp = myWordList.split("|");
			if(temp.length == 2){   //한건만 있을때 삭제할시
				localStorage.removeItem('myWord');
			}else{
				var temp = myWordList.replace(str+"|","");
				localStorage.myWord = temp;
			}
		}
		//searchMyWord();
	}*/

	//마이키워드 숨김
	var clearMyWord = function(){
		$("#searchMYList").empty().hide();
	}
	
	//검색영역 Event
	$('#searchText').bind('focusin keyup', function(){
		//20131209 추가
		$("header.new1025 > section.top > h1").hide();
		$(".searchFormArea").css("margin-left", "0px");
		$("#searchMylotte").hide();
		$("#searchButton").show();
		$('.keyword_box img').hide();
		searchARK('start');
	}).bind('focusout', function(){
		$('.keyword_box img').show();
	});
	
	if ($('#searchText').length > 0) {	//안드로이드에서는 keyup이벤트 안먹혀서 setInterval설정
		var beforeKeyword = "";
		
		var chkSearchTxt = setInterval(function () {
			if (beforeKeyword != $('#searchText').val() && $('#searchText').val() != "") {
				$('#searchText').trigger("keyup");
			}
		}, 300);
	}
	
	$('#searchButton').bind('click', function(){
		$('.keyword_box img').hide();
		$("#searchForm").submit();
	});
	
	//이전버튼
	$('section.subTitle > a.prevPage2').bind('click', function(){
		navback();
		return false;
	});
	/*
	//상품리스트 unit > 확대보기
	if( $('section#product_list a.thumb').length > 0 ){
		$('section#product_list a.thumb').click(function() {
			var img = $(this).find('img').attr('src');
			img = img.replace('_280.jpg','_550.jpg');   // 100사이즈 이미지 주소를 550사이즈 이미지 주소로 변경
			$('<div id="blackBG"></div>').appendTo('div#wrap');
			$('<div id="zoomIMG"><div><img class="prod" src="'+img+'" alt=""><img class="icon" src="http://image.lotte.com/lotte/mobile/btn/product_zoom_close.gif" alt=""></div></div>').appendTo('div#wrap');
			$('div#zoomIMG img').css('margin-top',$('body').scrollTop()+"px");
			$('div#zoomIMG img').click(function() {
				$('div#blackBG').remove();
				$('div#zoomIMG').remove();
			});
			$(document).focus();
			return false;
		});
	}
	*/
});

//디바이스 체크
function chk_device(){
	var device = "android";
	var agent = (navigator.userAgent).toLowerCase();
	
	// 디바이스 체크
	if( agent.indexOf("iphone") >= 0 ||	agent.indexOf("ipod") >= 0 || agent.indexOf("ipad") >= 0 ) {
		device = "iOS";
	}
	
	return device;
}

//앱체크
function app_install_chk(value){ 
	storage_frame.location.href = value;
	
	var device = chk_device();
	
	// 디바이스 별 함수 호출
	if (device == "iOS"){
		window.setTimeout("iOS_install_callback('"+value+"')",1000);
	} else if (device == "android"){
		window.setTimeout("android_install_callback('"+value+"')",1000);
	}	 
} 
	  
function iOS_install_callback(value){ 
	try{ 
		var html_str = document.getElementById("storage_frame").document.body.innerHTML;
	}catch(e){ 
		alert("앱이 설치되지 않았습니다. 다운로드 화면으로 이동합니다."); 
		var url = ""; 

		if(value=="ispmobile://") { 
			url = "http://itunes.apple.com/kr/app/id369125087?mt=8"; 
		}
		
		storage_frame.location = url; 
	} 
}

function android_install_callback(value){ 
	try{ 
		var html_str = document.getElementById("storage_frame").document.body.innerHTML;
	}catch(e){ 
		alert("앱이 설치되지 않았습니다. 다운로드 화면으로 이동합니다."); 
		var url = "";
		var curr_href = window.location.href;
		
		if(value=="ispmobile://") { 
			if (curr_href.indexOf('&tstore_yn=Y') > -1){ // 티스토어
				url = "tstore://PRODUCT_VIEW/0000025711/0";
			}else{ // 안드로이드 플레이 스터어
				url = "http://mobile.vpay.co.kr/jsp/MISP/andown.jsp";
			}
		}
				
		storage_frame.location = url; 
	} 
}

/*20130625 checkbox & radio input*/
function dvCheckboxClick(divID){
	if($(divID).hasClass("checked")){
		$(divID).removeClass("checked");
		$(divID + " input").attr("checked", false);
		try{
			$(divID + " input").prop("checked", false);
		}catch(err){
		}
	}else{
		$(divID).addClass("checked");
		$(divID + " input").attr("checked", true);
		try{
			$(divID + " input").prop("checked", true);
		}catch(err){
		}
	}			
}
function dvRadioClick(divID, divClass){			
	$(divClass).removeClass("checked");				
	$(divID).addClass("checked");
	$(divID + "  input").attr("checked", true);
}

// 임시 alert 출력 (iOS7 오류로 인한 프레임에서 출력)
function frm_alert(msg){
	document.getElementById("frm_alert").src = "/common3/frm_alert.jsp?alert_msg="+msg;
}

//안심번호
/*function closeANSPop(){
	dimmedClose({target:"ansimPop"});
}
function showANSPop(){
	dimmedOpen({target:"ansimPop"});
}*/

var isEllotte = (location.host.indexOf(".ellotte.com") > -1); 

//안심번호
function closeANSPop(){
	if(isEllotte){
		$("#ansimPop").hide();
	    dimmed('hide');
	    $("#cover").css("display", "none");
	}else{
		dimmedClose({target:"ansimPop"});
	}
}
function showANSPop(){
	if(isEllotte){
		$("#ansimPop").css("top", $(window).scrollTop() + 100);
		$("#ansimPop").show();
		dimmed('show');
		$("#cover").css("display", "block");
	}else{
		dimmedOpen({target:"ansimPop"});
	}
}