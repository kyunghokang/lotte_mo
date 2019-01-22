var chekAppType = 0; //1 웹 ,2 안드로이드, 3 ios

//웹 앱 구분처리
if(window.nativeAppInfo.isApp){
	chekAppType = 2; //앱
}else{
	chekAppType = 1; //웹
}

function sendTclick(t){

	if(!isEllotte){
		t = ("m_DC_" + t);
	}
	else {
		t = ("m_EL_" + t);
	}
	//20180903 GA 태깅 추가
    if(t == 'm_DC_Sporder_clk_Btn8') GAEvtTag('MO_상품상세', '엘페이 바로결제', '주문동의');
	
		var setTime = 1000;
		//console.log("tclick(non-ang) : " + t);
		$("#tclick_iframe").remove();
		setTimeout(function() {
				var iframe = document.createElement('iframe');
				iframe.id = 'tclick_iframe';
				iframe.style.visibility = 'hidden';
				iframe.style.display = "none";
				//iframe.src = LotteCommon.baseUrl + "/exevent/tclick.jsp?" + $scope.baseParam + "&tclick=" + tclick;
				iframe.src = LOTTE_CONSTANTS['M_HOST_SSL'] + "/exevent/tclick.jsp?tclick=" + t + "&" + __commonParam;
				//console.log("src : " + LOTTE_CONSTANTS['M_HOST_MOBILE'] + "/exevent/tclick.jsp?tclick=" + t + "&" + __commonParam);
				document.body.appendChild(iframe);
		}, setTime);
}


// 금액 변경 적용 시 중복 <br> 태그 함수 처리
function apply_br_tag(str){
	if (str!=""){
		//str += "<br/>";
	}

	return str;
}

	function confirm_end(){
		//console.log("confirm_end()");
			$("#useLottePoint").hide();
			$("#chk_lt_point").attr("disabled", false);
			ltPointCert = "Y";
			$("#lt_point_amt").show();
			$("#lt_point_amt_btn").hide();
			if (!$("#chk_lt_point").is(":checked")) {
					$("#chk_lt_point").trigger("click");
			}
	}

// 할부선택 radio 버튼의 활성화에 대해 UI를 구현한다.
// 카드선택 후 할부개월이 존재할 경우 개월수를 선택할 수 있다.
	// kschoi2 카드선택 작업해야됨
function init_cardinstmon() {	
	totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();	// 실제 총결제금액
	iscmcd = $("#frm_inp select[name=iscmcd]").val();	
	prom_third = $("#frm_send input[name=prommdclcd_third]").val();	
	
	$("#frm_inp input[name=rdo_cardinst]:radio").attr("checked", "");
	$("#frm_inp input[name=rdo_cardinst]:radio").prop("checked", "");

	$("#frm_inp select[name=cardinstmon]").empty();
	$("#frm_inp select[name=cardinstmon]").append("<option value=''>일시불</option>");
	$("#frm_inp select[name=cardinstmon]").attr('disabled' , true);
	
	if ( iscmcd != '' ) {

		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('disabled' , false);
		// 무이자 할부
		onintmonth = $("#frm_inp input[name=onintmonth]:hidden").val();
		if ( onintmonth == "" || onintmonth == "null" || prom_third == "35") {
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(1)").attr('disabled' , true);
		}else {
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(1)").attr('disabled' , false);
		}

		// 일반할부 개월수
		intmonth = $("#frm_inp input[name=intmonth]:hidden").val();
		if ( intmonth == "" || intmonth == "null" || prom_third == "35") {
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(2)").attr('disabled' , true);
		}else {
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(2)").attr('disabled' , false);
		}

		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('checked' , true);
		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop('checked' , true);
		if ( parseInt(totsttlamt) < 50000 ) {
			// 5만원 미만일 경우 일시불만 가능
			$("#frm_inp select[name=cardinstmon] option:first").prop('selected',true);
			$("#frm_inp select[name=cardinstmon]").prop('disabled' , true);	// 비활성 처리
			return;
		}

		//L.pay 등록카드가 신용카드가 아닐경우 일시불만 가능
		lpayCardDivCd = $("select[name=iscmcd]").find("option:selected").attr("data-card-div");
		if(lpayCardDivCd != undefined && lpayCardDivCd != "CC"){
			$("#frm_inp select[name=cardinstmon] option:first").prop('selected',true);
			$("#frm_inp select[name=cardinstmon]").prop('disabled' , true);	// 비활성 처리
			return;
		}
	} else {
		// 비활성 처리
		$("#frm_inp input[name=rdo_cardinst]:radio").attr('disabled' , true);
		$("#frm_inp select[name=cardinstmon]").attr('disabled' , true);
	}
	setcardinstmon();
}

function init_cardselect() {
	cardkndcd		= $("#frm_send input[name=cardkndcd]").val();	// 할인쿠폰 카드코드
	cardkndcd_dup	= $("#frm_send input[name=cardkndcd_dup]").val();	// 중복 카드 할인쿠폰 카드코드
	paytype = $("#frm_inp input[name=paytype]:hidden").val();
	var lpay_yn = "Y";
	var card_yn = "N";
	
	if ( cardkndcd != null && cardkndcd != '' ) {
		//최근결제수단
		if($("#frm_inp input[name=hist_paymean_iscmcd]:hidden").val() == cardkndcd){
			$("#frm_inp input[name=rdo_paytype]:radio[value='"+PAYTYPE_CODE_CARD+"']").click();

			$("#frm_inp select[name=iscmcd] option").each(function(){
				if($(this).val() == cardkndcd){
					card_yn = "Y";
				}
			});

			if(card_yn == "Y"){
				$("#frm_inp select[name=iscmcd]").val( cardkndcd );
				setIscmCd(cardkndcd);
				toggleAction5("#cardList_"+cardkndcd);
				selPayMean("hist_paymean");
				if($("#frm_inp select[name=iscmcd]").val() == null){
					$("#frm_inp select[name=iscmcd]").val('');
					$('.inlineBorder').removeClass('active');
				}
			}
		//엘페이
		}else if(lpay_yn == "Y"){
			$("#frm_inp input[name=rdo_paytype]:radio[value='"+PAYTYPE_CODE_LPAY+"']").click();

			$("#frm_inp input[name=lpay_type]:radio[value='"+cardkndcd+"']").prop("checked", true);
			$("#card_select").show();

			$("#frm_inp select[name=iscmcd]").val( cardkndcd );
			if($("#frm_inp select[name=iscmcd]").val() == null){
				$("#frm_inp select[name=iscmcd]").val('');
				$("#frm_inp input[name=lpay_type]").prop("checked", false);
			}
			
			selPayMean("lpay_paymean_"+$("#frm_inp input[name=lpay_type]:radio[value='"+cardkndcd+"']").attr("data-card-id"));
		//다른결제수단
		}else{
			$("#frm_inp input[name=rdo_paytype]:radio[value='"+PAYTYPE_CODE_CARD+"']").click();

			$("#frm_inp select[name=iscmcd] option").each(function(){
				if($(this).val() == cardkndcd){
					card_yn = "Y";
				}
			});

			if(card_yn == "Y"){
				$("#frm_inp select[name=iscmcd]").val( cardkndcd );
				setIscmCd(cardkndcd);
				toggleAction5("#cardList_"+cardkndcd);				
				payShortCut("16", cardkndcd);

				if($("#frm_inp select[name=iscmcd]").val() == null){
					$("#frm_inp select[name=iscmcd]").val('');
					$('.inlineBorder').removeClass('active');
				}
			}
		}

	} else if ( cardkndcd_dup != null && cardkndcd_dup != '' ){
		if($("#frm_inp input[name=hist_paymean_iscmcd]:hidden").val() == cardkndcd_dup){
			$("#frm_inp input[name=rdo_paytype]:radio[value='"+PAYTYPE_CODE_CARD+"']").click();
			$("#frm_inp select[name=iscmcd] option").each(function(){
				if($(this).val() == cardkndcd_dup){
					card_yn = "Y";
				}
			});

			if(card_yn == "Y"){
				$("#frm_inp select[name=iscmcd]").val( cardkndcd_dup );
				setIscmCd(cardkndcd_dup);
				toggleAction5("#cardList_"+cardkndcd_dup);
				selPayMean("hist_paymean");
				if($("#frm_inp select[name=iscmcd]").val() == null){
					$("#frm_inp select[name=iscmcd]").val('');
					$('.inlineBorder').removeClass('active');
				}
			}
		}else if(lpay_yn == "Y"){
			$("#frm_inp input[name=rdo_paytype]:radio[value='"+PAYTYPE_CODE_LPAY+"']").click();
			$("#frm_inp input[name=lpay_type]:radio[value='"+cardkndcd_dup+"']").prop("checked", true);
			$("#frm_inp select[name=iscmcd]").val( cardkndcd_dup );
			selPayMean("lpay_paymean_"+$("#frm_inp input[name=lpay_type]:radio[value='"+cardkndcd_dup+"']").attr("data-card-id"));
			if($("#frm_inp select[name=iscmcd]").val() == null){
				$("#frm_inp select[name=iscmcd]").val('');
				$("#frm_inp input[name=lpay_type]").prop("checked", false);
			}
		}else{
			$("#frm_inp input[name=rdo_paytype]:radio[value='"+PAYTYPE_CODE_CARD+"']").click();

			$("#frm_inp select[name=iscmcd] option").each(function(){
				if($(this).val() == cardkndcd_dup){
					card_yn = "Y";
				}
			});

			if(card_yn == "Y"){
				$("#frm_inp select[name=iscmcd]").val( cardkndcd_dup );
				setIscmCd(cardkndcd_dup);
				toggleAction5("#cardList_"+cardkndcd_dup);				
				payShortCut("16", cardkndcd_dup);
				if($("#frm_inp select[name=iscmcd]").val() == null){
					$("#frm_inp select[name=iscmcd]").val('');
					$('.inlineBorder').removeClass('active');
				}
			}
		}
	} else {
		$("#frm_inp select[name=iscmcd]").find('option').attr('selected',false).eq(0).attr('selected',true);
		$("#frm_inp select[name=iscmcd]").find('option').prop('selected',false).eq(0).prop('selected',true);

		$("#frm_inp input[name=onintmonth]:hidden").val('');
		$("#frm_inp input[name=intmonth]:hidden").val('');

		//초기화
		$('.inlineBorder').removeClass('active');	//카드
		$("#frm_inp input[name=lpay_type]").prop("checked", false);
		removeClassPayMean();	//결제블록 비활성화
		$("#eventcardsaleamt_cont").hide();	////청구할인 예상

		/*		if(firsObjName != ""){
			paySelect(firsObjName);	//최근결제수단 선택
		}*/
	}
}

// 포인트 초기화 사전작업
function init_point() {
	// 포인트 선택 부분
	$("#chk_lpoint").attr("checked", false); // L-포인트
	$("#chk_lt_point").attr("checked", false); // 롯데포인트
	$("#chk_deposit_all").attr("checked", false); // 보관금
//		$("#chk_soil_point").attr("checked", false); // S-oil포인트

	$("#chk_lpoint").prop("checked", false); // L-포인트
	$("#chk_lt_point").prop("checked", false); // 롯데포인트
	$("#chk_deposit_all").prop("checked", false); // 보관금
//		$("#chk_soil_point").prop("checked", false); // S-oil포인트
}

// 쿠폰 할인 정보 초기화
function init_cpn_info(cpn, dup_cpn, third_cpn){
	// 1차쿠폰 정보 초기화	
	if (cpn == "Y"){
		$("#frm_send input[name=promcartsn]").val("");
		$("#frm_send input[name=prommdclcd]").val("");
		$("#frm_send input[name=fvrpolctpcd]").val("");
		$("#frm_send input[name=totdcamt]").val("");
		$("#frm_send input[name=cpnpromno]").val("");
		$("#frm_send input[name=cpnrscmgmtsn]").val("");
		$("#frm_send input[name=adtncostdtlsctnm]").val("");
		$("#frm_send input[name=cardkndcd]").val("");
		$("#frm_send input[name=includeSaveInstCpn]").val("");	
		$("#frm_send input[name=orgfvrval]").val("");		
	}

	// 2차쿠폰 정보 초기화
	if (dup_cpn == "Y"){
		$("#frm_send input[name=promcartsn_dup]").val("");
		$("#frm_send input[name=prommdclcd_dup]").val("");
		$("#frm_send input[name=fvrpolctpcd_dup]").val("");
		$("#frm_send input[name=totdcamt_dup]").val("");
		$("#frm_send input[name=cpnpromno_dup]").val("");
		$("#frm_send input[name=cpnrscmgmtsn_dup]").val("");
		$("#frm_send input[name=adtncostdtlsctnm_dup]").val("");
		$("#frm_send input[name=cardkndcd_dup]").val("");
		$("#frm_send input[name=includeSaveInstCpn_dup]").val("");

	}

	// 3차쿠폰 정보 초기화
	if (third_cpn == "Y"){
		$("#frm_send input[name=promcartsn_third]").val("");
		$("#frm_send input[name=prommdclcd_third]").val("");
		$("#frm_send input[name=fvrpolctpcd_third]").val("");
		$("#frm_send input[name=totdcamt_third]").val("");
		$("#frm_send input[name=cpnpromno_third]").val("");
		$("#frm_send input[name=cpnrscmgmtsn_third]").val("");
		$("#frm_send input[name=adtncostdtlsctnm_third]").val("");
		$("#frm_send input[name=cardkndcd_third]").val("");
		$("#frm_send input[name=includeSaveInstCpn_third]").val("");
	}
}


function setcardinstmon() {

	$("#frm_inp select[name=cardinstmon]").empty();
	$("#frm_inp select[name=cardinstmon]").append("<option value=''>일시불</option>");
	cardinstmonlist = $("#frm_inp input[name=onintmonth]:hidden").val().split(',');	
	if ( cardinstmonlist.length > 0 ) {
		for (i=0; i<cardinstmonlist.length; i++ ) {
			if (cardinstmonlist[i] == "null" || cardinstmonlist[i] == "") {
				continue;
			}

			text = cardinstmonlist[i] + "개월";
			
			$("#frm_inp select[name=cardinstmon]").append(					
					"<option value='" + cardinstmonlist[i] + "'>(무) " + text + "</option>");
		}
		//$("#frm_inp select[name=cardinstmon]").attr('disabled' , false);
	}
	cardinstmonlist = $("#frm_inp input[name=intmonth]:hidden").val().split(',');	
	if ( cardinstmonlist.length > 0 ) {
		for (i=0; i<cardinstmonlist.length; i++ ) {
			if (cardinstmonlist[i] == "null" || cardinstmonlist[i] == "") {
				continue;
			}

			text = cardinstmonlist[i] + "개월";			
			$("#frm_inp select[name=cardinstmon]").append(					
					"<option value='" + cardinstmonlist[i] + "'>(유) " + text + "</option>");
		}
		//$("#frm_inp select[name=cardinstmon]").attr('disabled' , false);
	}

	if ( $("#frm_inp select[name=cardinstmon] option").length > 1 && $("#frm_send input[name=prommdclcd_third]").val() != "35" ) {
		$("#frm_inp select[name=cardinstmon]").attr('disabled' , false);
	} else {
		$("#frm_inp select[name=cardinstmon]").attr('disabled' , true);
	}
}

	// s:2015.01.13아시아나 제휴몰 마일리지 적립 icjung
//정보제공 동의
function chkboxMAsianaAgree() {

	if(document.getElementById('info_agree_check').checked) {
		if(document.getElementById('ip_asianaNo').value.length == 0) {
			alert('회원번호가 올바르지 않습니다. 확인후 입력해 주시기 바랍니다.');
			return;
		} else if(document.getElementById('ip_asianaNo').value.length <= 0) {
			alert('아시아나클럽 회원번호를 9자리의 숫자로 입력해 주세요');
			return;
		} else if(isNaN(document.getElementById('ip_asianaNo').value)) {
			alert('아시아나클럽 회원번호는 숫자로만 입력하셔야 합니다.');
			return;
		}

		if(checkForAsiana(document.getElementById('ip_asianaNo').value)==true){
			$("#frm_send input[name=asiana_mbr_no]:hidden").val(document.getElementById('ip_asianaNo').value);
			alert('회원번호가 정상적으로 확인되었습니다.');
		} else {
			alert('회원번호가 올바르지 않습니다. 확인후 입력해 주시기 바랍니다.');
		}

	} else {
		alert('정보제공 동의를 하셔야 합니다.');
	}

}
// e:2015.01.13아시아나 제휴몰 마일리지 적립 icjung

// 이미지 버튼 클릭 시
function checkBtn(obj) {
	var ckObj = $(obj).find('input:checkbox');
	var ckObj_nm = ckObj.attr('name');

	if (ckObj_nm=='grockle_info'){
		ckObj.attr('checked', $(obj).hasClass("checked"));
	}else if (ckObj_nm=='grockle_same'){
		ckObj.trigger("click");
	}else{
		ckObj.trigger("click");
	}
}

function selPayType(idx){
	var id = '#pay_type' + idx;
	//$( 'span.pay_box' ).removeClass( 'on' );
	$( "[id^='pay_type']" ).removeClass( 'on' );
	$( id ).addClass("on");

	setPaytype(idx);
}

function setPaytype(idx){

	var payTypeArr = [[1, PAYTYPE_CODE_CARD],
										[2, PAYTYPE_CODE_BANK],
										[3, PAYTYPE_CODE_PHONE],
										[4, PAYTYPE_CODE_LPAY]];

	for( var i = 0; i < payTypeArr.length; i++ ){
		if( payTypeArr[i][0] == idx ){
			$("#frm_inp input[name=paytype]:hidden").val(payTypeArr[i][1]);
			break;
		}
	}
}



function fn_ordernomemberAgree( target ){
	if ( $(target).closest('div.check_layer03').hasClass('on') ){
		$(target).closest('div.check_layer03').removeClass('on');
		$(target).closest('div.check').removeClass('on').addClass('off');
		$("#grockle_resident_div").hide();
	} else {
		$(target).closest('div.check_layer03').addClass( 'on' );
		$(target).closest('div.check').removeClass('off').addClass('on');
		$("#grockle_resident_div").show();
	}
}

// 배송지 선택
function deliSelect(mode, deli_idx){
	// 새로운 배송지
	if(mode == 'new'){
		$("#deli_"+deli_idx+" dl.deli_mine").hide();
		$("#deli_"+deli_idx+" dl.deli_new").show();
		$("#deli_"+deli_idx+" #li_mine").removeClass('on');
		$("#deli_"+deli_idx+" #li_new").addClass("on");
	}
	// 내 배송지
	else if(mode == 'mine'){
		$("#deli_"+deli_idx+" dl.deli_mine").show();
		$("#deli_"+deli_idx+" dl.deli_new").hide();
		$("#deli_"+deli_idx+" #li_mine").addClass("on");
		$("#deli_"+deli_idx+" #li_new").removeClass('on');
	}
}

function chkSendMsgLimit(textarea, limit, infodiv) {
	str = $("#"+textarea).val();
	strlen = str.length;

		var s = 0;
		for (var i = 0; i < strlen; i++) {
				//s += (str.charCodeAt(i) > 128) ? 2 : 1;
				s += 1;

				if (s > limit) {
					alert('최대 '+ limit +'자 까지 입력가능합니다.');

					//$("#"+textarea).val( str.cut(limit) );
					$("#"+textarea).val( str.substring(0, limit) );
				$("#"+infodiv).html(limit);
				return false;
				}
		}
		$("#"+infodiv).html(s);
		return true;

}

// 배송메시지 입력 값 길이제한
// function.js 의 limitChars 와 동일하나, 메시지만 수정됨.
// 추후 비슷한 케이스 발생 시, 리팩토링 필요
function chkDeliMsgLimit(textarea, limit, infodiv) {
	str = $("#"+textarea).val();
	strlen = str.length;

		var s = 0;
		for (var i = 0; i < strlen; i++) {
				s += (str.charCodeAt(i) > 128) ? 2 : 1;

				if (s > limit) {
					alert('최대 ' + limit + 'byte까지 입력가능합니다.');

					$("#"+textarea).val( str.cut(limit) );
				$("#"+infodiv).html(limit);
				return false;
				}
		}
		$("#"+infodiv).html(strlen);
		return true;

}

	function fn_useLottePointCancel() {
		$("#useLottePoint").hide();
		$("#card_no1").val("");
		$("#card_no2").val("");
		$("#card_no3").val("");
		$("#card_no4").val("");
		$("#card_passwd").val("");

		$('.btn_lotte_point2').text("본인 확인하기");

		if($("input[name=temp_paytype]:hidden").val() == 3){
			if($("#chk_lt_point").prop("checked") == true){
				$("#chk_lt_point").trigger("click");
				$("#lt_point_amt").show();
				$("#lt_point_amt_btn").hide();
			}
		}
	}

function select_third_coupon() {
	// 포인트 선택 부분
	init_point();

	// 현금영수증 영역 컨트롤
	setCashReceiptArea();

	// 쿠폰 변경 시 포인트 부분 초기화
	fn_initPointList("ALL");

	if ($("#frm_send input[name=prommdclcd_third]").val() == "35"){ // 일시불인 경우
		// 휴대폰 소액 결제인 경우
		if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == PAYTYPE_CODE_PHONE){
			$("#frm_inp input[name=rdo_paytype]:radio[value='"+PAYTYPE_CODE_CARD+"']").click();
			removeClassPayMean();	//결제바로가기 비활성화 처리
		}

		// 결제수단 제어
		$("#frm_inp input[name=rdo_paytype]:radio").each(function() {
			if ($(this).val() == PAYTYPE_CODE_PHONE){
				$(this).prop("disabled" , true);
			}
		});

		// 포인트 제어 (보관금만 사용가능)
		$("#chk_lpoint").prop("checked", false);

		$("#chk_lpoint").prop("disabled", true);

		$("#chk_lt_point").prop("checked", false);

		$("#chk_lt_point").prop("disabled", true);
/*			$("#chk_soil_point").prop("checked", false);
		$("#chk_soil_point").prop("disabled", true);*/

	}else{
		if($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == PAYTYPE_CODE_LPAY){
			ltPointCert = "Y";
			$("#lt_point_amt").show();
			$("#lt_point_amt_btn").hide();
		}

		// 결제수단 제어
		$("#frm_inp input[name=rdo_paytype]:radio").each(function() {
			$(this).prop("disabled" , false);
		});

		// 포인트 제어
		if ( parseInt($("#useable_lpoint_amt").val()) > 0 ) {
			$("#chk_lpoint").prop("disabled", false);
		}

		if ( ltPointCert == "Y" ) {
			$("#chk_lt_point").prop("disabled", false);
		}
//			$("#chk_soil_point").prop("disabled", false);
	}

	// 결제 결제 정보 제어
	select_third_coupon_controll($("#frm_send input[name=prommdclcd_third]").val());

	// 쿠폰 및 포인트 사용에 대한 주문 금액 계산
	fn_calcTotalPrice();
}

// 주문서 내 사용 sessionStorage 삭제
function ord_session_clear(){
	sessionStorage.removeItem("dup_cnt_div");
	sessionStorage.removeItem("dup_prom_no");
	sessionStorage.removeItem("fvr_val");
	sessionStorage.removeItem("goods_no");
	sessionStorage.removeItem("itme_no");
	sessionStorage.removeItem("max_fvr_val");
	sessionStorage.removeItem("prom_no");
	sessionStorage.removeItem("prom_nm");
	sessionStorage.removeItem("rsc_mgmt_sn");
	sessionStorage.removeItem("safe_browsing");
}

function dup_coupon_select() {

	var dupcpn_idx = $(this).val();
	iphoneChk = false;

	if ( maxDupIdx != dupcpn_idx ) { // 최적가 체크 해제
		$("#max_dc").prop("checked", false);
		//$("#select_sale_div").show();
	}

	$("#frm_inp select[name=dup_coupon]").find("option").each(function(){
		if( dupcpn_idx == $(this).val() ){

			var coupon_idx = $("#frm_inp select[name=coupon]").val();
			var prommdclcd = $("#frm_inp input[name=prommdclcd]").eq(coupon_idx).val(); // 1차쿠폰
			var cpnpromno = $("#frm_inp input[name=cpnpromno]").eq(coupon_idx).val(); // 1차쿠폰
			var cpnpromno_dup = $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val(); // 중복쿠폰 프로모션 번호
			var tmp_arr_cnt = 0;
			var tmp_arr;
			var first_cpn = "0";
			var v_cpn_crd_dc_amt = 0;

			ord_session_clear();

			// 3차 쿠폰 할인 정보 지우기
			init_cpn_info("N", "N", "Y");
			$("#frm_inp input[name=third_coupon]:radio:last").prop('checked', true); // 3차 쿠폰 사용안함으로 셋팅

			// 중복할인금액 정보 지우기
			$("span[name=dup_span]").each(function() {
				$(this).html("");
			});

			if (dupcpn_idx=="N"){
				// 2차 할인 쿠폰 정보 지우기
				init_cpn_info("N", "Y", "N");

				select_dup_coupon();
				return;
			}

			$(this).prop("disabled", false); // 활성화

			if ( coupon_idx == undefined || coupon_idx == "N" ){ // 중복쿠폰
				tmp_arr = single_prom;
				tmp_arr_cnt = single_prom_cnt;
				sessionStorage.setItem("dup_cnt_div", "single"); // 중복쿠폰 단독/추가 구분
			}else{ // 1차쿠폰 + 중복쿠폰 사용
				tmp_arr = multi_prom;
				tmp_arr_cnt = multi_prom_cnt;
				first_cpn = (cpnpromno=="0"?prommdclcd:cpnpromno);
				sessionStorage.setItem("dup_cnt_div", "multi"); // 중복쿠폰 단독/추가 구분
			}

			if ( tmp_arr_cnt > 0 ){
				for (var i = 0 ; i <  tmp_arr.length  ; i ++ ){
					if ( tmp_arr[i][0] == first_cpn && tmp_arr[i][1] == cpnpromno_dup ){
						v_cpn_crd_dc_amt = tmp_arr[i][2];

						sessionStorage.setItem("prom_no", tmp_arr[i][0]);
						sessionStorage.setItem("dup_prom_no", tmp_arr[i][1]);
						sessionStorage.setItem("fvr_val", tmp_arr[i][2]);
						sessionStorage.setItem("goods_no", tmp_arr[i][3]);
						sessionStorage.setItem("itme_no", tmp_arr[i][4]);
						sessionStorage.setItem("max_fvr_val", tmp_arr[i][5]);
						sessionStorage.setItem("prom_nm", tmp_arr[i][6]);
						sessionStorage.setItem("rsc_mgmt_sn", tmp_arr[i][7]);

						break;
					}
				}

				if ( parseInt( v_cpn_crd_dc_amt) > 0 ){

					if ( dupcpn_idx != 'N' ) {
						promcartsn		= $("#frm_inp input[name=promcartsn_dup]").eq(dupcpn_idx).val();
						prommdclcd		= $("#frm_inp input[name=prommdclcd_dup]").eq(dupcpn_idx).val();
						fvrpolctpcd		= $("#frm_inp input[name=fvrpolctpcd_dup]").eq(dupcpn_idx).val();
						totdcamt		= sessionStorage.getItem("fvr_val");	// 쿠폰할인금액
						cpnpromno		= $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();
						cpnrscmgmtsn		= $("#frm_inp input[name=cpnrscmgmtsn_dup]").eq(dupcpn_idx).val();
						adtncostdtlsctnm	= $("#frm_inp input[name=adtncostdtlsctnm_dup]").eq(dupcpn_idx).val();
						cardkndcd		= $("#frm_inp input[name=cardkndcd_dup]").eq(dupcpn_idx).val();
						includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn_dup]").eq(dupcpn_idx).val();
					} else {
						promcartsn      = "";
						prommdclcd		= "";
						fvrpolctpcd		= "";
						totdcamt		= "";
						cpnpromno		= "";
						cpnrscmgmtsn		= "";
						adtncostdtlsctnm	= "";
						cardkndcd		= "";
						includeSaveInstCpn = "";
					}
					$("#frm_send input[name=promcartsn_dup]").val( promcartsn );
					$("#frm_send input[name=prommdclcd_dup]").val( prommdclcd );
					$("#frm_send input[name=fvrpolctpcd_dup]").val( fvrpolctpcd );
					$("#frm_send input[name=totdcamt_dup]").val( totdcamt );
					$("#frm_send input[name=cpnpromno_dup]").val( cpnpromno );
					$("#frm_send input[name=cpnrscmgmtsn_dup]").val( cpnrscmgmtsn );
					$("#frm_send input[name=adtncostdtlsctnm_dup]").val( adtncostdtlsctnm );
					$("#frm_send input[name=cardkndcd_dup]").val( cardkndcd );
					$("#frm_send input[name=includeSaveInstCpn_dup]").val( includeSaveInstCpn );

					//이거 확인필요
					$("span[name=dup_span]:eq("+dupcpn_idx+")").html("(" + "<strong>"+String(totdcamt).money()+"</strong> 원 할인)");

					select_dup_coupon();

					$("#dcAmt2").html( "(-" + String(v_cpn_crd_dc_amt).money() + "원)" );
					return;
				}else{
					// 사용불가처리
					$(this).prop("disabled", true);

					if (!alert("죄송합니다.\n추가할인 불가능 상품입니다.")) {
						add_dis_impossible_flag = true;
						add_dis_impossible();
					}
					else {
						add_dis_impossible_flag = false;
						add_dis_impossible();
					}
				}
			}else{
				// 2차 할인 쿠폰 정보 지우기
				init_cpn_info("N", "Y", "N");
			}

		}
	});

}
var add_dis_impossible_flag = false;
function add_dis_impossible(){
	$("#frm_inp select[name=dup_coupon]").blur();

	$("#frm_inp select[name=dup_coupon]").val("N"); // 중복 쿠폰 사용안함으로 셋팅
	$("#frm_inp select[name=dup_coupon]")[0].selectedIndex = 0;
	//$("#frm_inp select[name=dup_coupon] option:first").prop('selected',true);
	// 2차 할인 쿠폰 정보 지우기
	init_cpn_info("N", "Y", "N");
	select_dup_coupon();
}

//kschoi2 이거 확인 해야
function select_coupon() {
	init_cardselect();
	getCardInsCheck();	//카드 종류 선택시 일시불/무이자할부/일반할부에 대한 정보를 가져온 후 UI구현
	// 포인트 선택 부분
	init_point()	//포인트 초기화 사전작업
	setCashReceiptArea(); // 현금영수증 영역 컨트롤
	fn_initPointList("ALL");	//// 포인트 관련 Element 값 초기화
	fn_calcTotalPrice(); // 쿠폰 및 포인트 사용에 대한 주문 금액 계산
	//console.log("paycardinstmon select_coupon");
	paycardinstmon();

	if ( $("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_CARD ) {
		sel_card_confirm_type();
	}
}

function select_dup_coupon() {
	init_cardselect();
	init_point(); // 포인트 선택 부분
	setCashReceiptArea(); // 현금영수증 영역 컨트롤
	fn_initPointList("ALL"); // 쿠폰 변경 시 포인트 부분 초기화
	fn_calcTotalPrice(); // 쿠폰 및 포인트 사용에 대한 주문 금액 계산
	getCardInsCheck(); // 카드 할부 개월 조회
	//console.log("paycardinstmon select_dup_coupon");
	paycardinstmon();

	if ( $("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_CARD ) {
		sel_card_confirm_type();
	}
}

function sel_card_confirm_type(){
	var pay_id = "";
	$(".slide_ul .check").each(function() {
		pay_id = $(this).attr('id');
	});

	//console.log("sel_card_confirm_type      pay_id["+pay_id+"]");

	if(pay_id != ""){
		if($("#frm_inp input[name="+pay_id+"_card_confirm_type]:hidden").val() != "" && $("#frm_inp input[name="+pay_id+"_card_confirm_type]:hidden").val() != undefined){
			$("#frm_inp input[name=card_confirm_type]:radio[value='"+$("#frm_inp input[name="+pay_id+"_card_confirm_type]:hidden").val()+"']").prop("checked", true);
			//console.log("여기오면 성공");
		}
	}
}

// 할부월 및 할인구분 제어
function select_third_coupon_controll(prommdclcd) {
	//console.log("select_third_coupon_controll!");

	if (prommdclcd == "35"){ // 일시불인 경우
		// 결제수단 카드의 할부구분 제어
		$("#frm_inp input[name=rdo_cardinst]:radio").each(function() {
			$(this).prop("disabled" , true);
		});
		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop("disabled" , false);
		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop("checked", true);

		// 결제수단 카드의 할부월 제어
		$("#frm_inp select[name=cardinstmon] option:first").prop("selected", true);
		$("#frm_inp select[name=cardinstmon]").prop("disabled", true);
	} else {
		// 결제수단 카드의 할부구분 제어
		$("#frm_inp input[name=rdo_cardinst]:radio").each(function() {
			$(this).prop("disabled" , false);
		});
		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop("checked", true);

		// 결제수단 카드의 할부월 제어
		$("#frm_inp select[name=cardinstmon] option:first").prop("selected", true);
		$("#frm_inp select[name=cardinstmon]").prop("disabled", false);
	}
	//console.log("paycardinstmon select_third_coupon_controll");
	paycardinstmon();
}

function fnClear(obj) {
		obj.style.background = '';
}

// 롯데카드 결제 처리
function lottecard_payment(pay_type){
	
	/*
	 * 2017.08.18 모바일/앱 체크 추가 , 롯데카드 앱설치 여부 ,롯데앱카드 설치 여부
	 * web은 롯데카드 앱설치여부 확인불가  ==> SPSW , ACSW , MAPC , ALP
	 * app이고 롯데카드 앱설치여부 Y==> SPSA , ACSA
	 * app이고 롯데카드 앱설치여부 N==> null , null
	 * app이고 롯데앱카드 Y      ==> MAPC
	 * app이고 롯데앱카드 N      ==> null  
	 * 페이서비스는 전부              ==> ALP
	 * 다른결재방식 선택 null값 보냄
	*/
	
	lotte_auth_type = pay_type;  //전역변수 lotte_auth_type 에 값을 미리 설정한다
	
	if(pay_type=="SPSA" || pay_type=="ACSA" || pay_type=="MAPC"){
		//앱체크 함수 호출 로직 추가
		chkAppIsInstall(pay_type);
	}else{
		//롯데카드 smpi 인증페이지 호출
		fn_simple_payform_submit(lotte_auth_type);
	}
	
}

//롯데카드 앱 설치여부 판단
function chkAppIsInstall(pay_type){
	//app 에 스키마 정보 호출함. 리턴받는 함수:: rtnCardPaymentApp(appYn)
	if(pay_type=="MAPC"){//"앱카드APP"앱체크 
		if(cp_schema != "" && isAndroid ){ //app일경우 && 안드로이드일경우
			window.myJs.appIsInstall("com.lcacApp");
		}else if(cp_schema != "" && isIOS ){ //app일경우 && 아이폰일경우
			window.location = "appIsInstall://lotteappcard";
		}else{
			//롯데카드 smpi 인증페이지 호출
			fn_simple_payform_submit(lotte_auth_type);
		}
	}else{//"모바일결제APP"앱체크
		if(cp_schema != "" && isAndroid ){ //app일경우 && 안드로이드일경우
			window.myJs.appIsInstall("com.lotte.lottesmartpay");
		}else if(cp_schema != "" && isIOS ){ //app일경우 && 아이폰일경우
			window.location = "appIsInstall://lottesmartpay";
		}else{
			//롯데카드 smpi 인증페이지 호출
			fn_simple_payform_submit(lotte_auth_type);
		}
	}
}

//롯데카드 앱 설치여부 판단 리턴함수w
function rtnCardPaymentApp(appYn){
	//기존 롯데카드 앱체크만 사용했지만 추가로 L.pay 앱체크도 반영 2017.07.28
	if($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_LPAY){
		
		if(appYn == 'N'){
			if(confirm("L.pay APP이 설치되어 있지 않습니다.\n지금 L.pay APP을 설치 하시겠습니까?")){
				lpay_lnk_app();
			}else{
				$("#frm_inp input[name=rdo_paytype]:radio:eq(1)").trigger("click");
			}
			
		}else{
			//기존 엘페이로직 처리  2017.07.28
			fn_lpay_process_call();
		}
		
	}else if( $("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_CARD ) {
		// 롯데카드 앱설치여부 값을 확인하여 appYn == 'Y' 이면 변경 없음. appYn == 'N' 이면 "null"값으로 호출
		if(appYn == 'N'){
			lotte_auth_type = "";
		}
		console.log("1704 lotte_auth_type=="+lotte_auth_type);
		//롯데카드 smpi 인증페이지 호출
		fn_simple_payform_submit(lotte_auth_type);
	}
}

//롯데카드 smpi 인증페이지 호출
function fn_simple_payform_submit(lotte_auth_type){
	$("#ANSIM_LAYER").css("width"	,"100%");
	$("#ANSIM_LAYER").css("height"	,"530px");
	window.scrollTo(0, 0);
	$("#ANSIM_LAYER").show();
	$("#X_ANSIM_FRAME").show();
	$("#SIMPLEPAYFORM input[name=PAY]:hidden").val(lotte_auth_type);
	$("#SIMPLEPAYFORM").attr("target", "X_ANSIM_FRAME");
	$("#SIMPLEPAYFORM").attr("action", "/smpi/M_LCSMPIAgent01.jsp");
	$("#SIMPLEPAYFORM").submit();
}

// xmpi 실행
function xmpi_exec(){
	$("#frm_card").attr("target", "X_ANSIM_FRAME");
	$("#frm_card").attr("action", "/dacom/xansim/m_hagent01.jsp");
	$("#frm_card").submit();
}

// spay 실행 (KBApp Card)
function spay_exec(){
	$("#frm_spay input[name=totsttlamt]:hidden").val($("#frm_send input[name=totsttlamt]:hidden").val()); // 결제금액
	$("#frm_spay input[name=cardinst]:hidden").val($("#frm_send input[name=cardinst]:hidden").val()); // 할부구분
	$("#frm_spay input[name=cardinstmon]:hidden").val($("#frm_send input[name=cardinstmon]:hidden").val()); // 할부개월
	$("#frm_spay").attr("target", "X_ANSIM_FRAME");
	$("#frm_spay").attr("action", "/spay/shopMW.jsp");
	$("#frm_spay").submit();
}

// mobilians 실행
function cellphone_exec(){
	$("#frm_mobilians input[name=totsttlamt]:hidden").val($("#frm_send input[name=totsttlamt]:hidden").val());
	$("#frm_mobilians").attr("target", "X_ANSIM_FRAME");
	$("#frm_mobilians").attr("action", "/mobilians/mc_web.jsp");
	$("#frm_mobilians").submit();
}

// 카드사로 부터 인증 결과 수신시 호출되는 함수입니다.
function setCertResult(xid, eci, cavv, cardno, etc) {

	//안심클릭 창 닫아주자
	$("#ANSIM_LAYER").hide();
	$("#X_ANSIM_FRAME").attr("src","/dacom/xansim/iframe.jsp");
	$("#frm_send input[name=xid]:hidden").val( xid );
	$("#frm_send input[name=eci]:hidden").val( eci );
	$("#frm_send input[name=cavv]:hidden").val( cavv );
	$("#frm_send input[name=cardno]:hidden").val( cardno );

	doPayment();	// 쇼핑몰의 결제요청 함수로 변경하세요.
}

// 신한카드 카드사로 부터 제휴코드가 포함된 인증 결과 수신시 호출되는 함수입니다.
//--------------------------------
// 20085.08.01
// 신한카드의 요청으로 인증결과 정보에 제휴코드(join code)가 추가됨.
//---------------------------------
function setCertResult2(xid, eci, cavv, cardno, joincode) {
	$("#frm_send input[name=xid]:hidden").val( xid );
	$("#frm_send input[name=eci]:hidden").val( eci );
	$("#frm_send input[name=cavv]:hidden").val( cavv );
	$("#frm_send input[name=cardno]:hidden").val( cardno );
	$("#frm_send input[name=joincode]:hidden").val( joincode );
	doPayment();	// 쇼핑몰의 결제요청 함수로 변경하세요.
}
function disableItems(arg) {
	$("#cover").css("z-index", "1000004");
	if( arg ) {
		$("#cover").css("display", "block");		
		$("#ORDER").hide();
		$("#PROCESSING").show();
				$("#cover").on('click',function(){
					close_iframe();
				});
	}
	else {
		$("#cover").css("display", "none");
		$("#ORDER").show();
		$("#PROCESSING").hide();
				$("#cover").off('click');
	}
}
function returnPaymentPage() {
	disableItems(false);
	$("#X_ANSIM_FRAME").attr("src","/dacom/xansim/iframe.jsp");
}
// 결제창 닫기
function close_iframe() {
	returnPaymentPage();

	document.getElementById("X_ANSIM_FRAME").width=450;
	document.getElementById("X_ANSIM_FRAME").height=0;
	document.getElementById("ANSIM_LAYER").style.display="none";
	document.getElementById("X_ANSIM_FRAME").style.display="none";
}
// 카드사로 부터 인증 결과 수신시 호출되는 결제 요청 함수 샘플입니다.
function doPayment() {
	if($("#frm_send input[name=totdcamt]:hidden").val()==""){
		$("#frm_send input[name=totdcamt]:hidden").val('0')
	}
	//dimmedClose();
	$("#cover").css("display", "none");
	$("#ORDER").show();
	$("#PROCESSING").hide();

	$("#X_ANSIM_FRAME").attr("src","/dacom/xansim/iframe.jsp");
	$("#frm_send").submit();
}
function ansimclose(){
	$("#ANSIM_LAYER").hide();
	$("#X_ANSIM_FRAME").attr("src","/dacom/xansim/iframe.jsp");
	$("#ORDER").show();
	$("#PROCESSING").hide();
}

function getName(){
	var nm = $("#frm_inp input[name=inprmitnm]").val();
	nm = nm+" 님";
	$("#frm_inp input[name=receivename]").val(nm);
}

// 2011.05.20 포인트 전체 선택시
function fn_selPointAll(obj) {
	var point = "";
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	var useable_amt = 0;
	var obj_id = obj.id;
	// 보관금
	if (obj_id == 'chk_deposit_all'){
		setCashReceiptArea(); // 현금영수증 영역 컨트롤
	}

	if (obj.checked){
		if (parseInt(totsttlamt) == 0) // 결제금액이 없는데 모두 사용을 선택 할 경우
		{
			obj.checked=false;
			return;
		}
		if (obj_id == 'chk_lpoint_all'){// L_포인트
			totsttlamt = parseInt(totsttlamt) + parseInt($("#old_lpoint_amt").val());
			useable_amt = parseInt($("#useable_lpoint_amt").val());

			$("#lpoint_amt").val((totsttlamt<useable_amt?totsttlamt:useable_amt));
		}else if (obj_id == 'chk_lt_point_all'){
			totsttlamt = parseInt(totsttlamt) + parseInt($("#old_lt_point_amt").val());
			useable_amt = parseInt($("#useable_lt_point_amt").val());

			$("#lt_point_amt").val((totsttlamt<useable_amt?totsttlamt:useable_amt));
		}else if (obj_id == 'chk_deposit_all'){
			$("#cash_receipts").show(); // 현금영수증 영역 보이기

			totsttlamt = parseInt(totsttlamt) + parseInt($("#old_deposit_amt").val());
			useable_amt = parseInt($("#useable_deposit_amt").val());

			$("#deposit_amt").val((totsttlamt<useable_amt?totsttlamt:useable_amt));
		}
	}else{
		if (obj_id == 'chk_lpoint_all'){// L_포인트
			$("#lpoint_amt").val("");
			$("#old_lpoint_amt").val("0");
		}else if (obj_id == 'chk_lt_point_all'){// 롯데포인트
			$("#lt_point_amt").val("");
			$("#old_lt_point_amt").val("0");
		}else if (obj_id == 'chk_deposit_all'){// 보관금
			$("#deposit_amt").val("");
			$("#old_deposit_amt").val("0");
		}
	}

	fn_calcTotalPrice();
	paycardinstmon();
}

// 포인트 값 직접 등록 시
function fn_point_change(obj){
	var obj_id = obj.id;
	var obj_val = obj.value;
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	var old_amt = $("#old_"+obj_id).val();
	var useable_amt = 0;

	obj_val = (obj_val==""?"0":obj_val);
	totsttlamt = parseInt(totsttlamt) + parseInt(old_amt);

	if (obj_id == "lpoint_amt" && $("#chk_lpoint").prop("checked")){ // L_포인트
		useable_amt = parseInt($("#useable_lpoint_amt").val());
		$("#chk_lpoint_all").prop("checked", false);

	}else if (obj_id == "lt_point_amt" && $("#chk_lt_point").prop("checked")){ // 롯데포인트
		useable_amt = parseInt($("#useable_lt_point_amt").val());
		$("#chk_lt_point_all").prop("checked", false);

	}

	useable_amt = (totsttlamt<useable_amt?totsttlamt:useable_amt);
	if (parseInt(obj_val) > useable_amt){
		obj.value = (useable_amt==0?0:Math.floor(useable_amt/10) * 10);
	}else{
		obj.value = (obj_val=="0"?"":obj_val);
	}
	fn_calcTotalPrice();
	paycardinstmon();
}

// 포인트 값 직접 등록 시
function fn_point_focus(obj){
	obj.value = "";
	fn_point_change(obj);
}

// 2011.05.26 무료배송권 사용 함수
function fn_freeDlvpCpnUse(){
	var dlv_prom_use_yn = $("#dlv_prom_use_yn").val();		
	var dlv_fvr_val = $("#dlv_fvr_val").val();
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	if (dlv_prom_use_yn == "N" && parseInt(dlv_fvr_val) > parseInt(totsttlamt)){
		$("#dlv_prom_use_yn").val("N");
		alert("배송비할인 금액이 결제금액보다 클 수 없습니다.");
		return;
	}
}

// 2011.06.14 스마트페이 결제 완료 후
function setCertSmartpayResult(xid, eci, cavv, cardno, joinCode, hs_useamt_sh, restype, userkey, result, auth_type ) {
	paramSmartpaySet(xid, eci, cavv, cardno, hs_useamt_sh, restype, userkey, result, auth_type );
}

//-->실제 승인페이지로 넘겨주는 form에 xid, eci, cavv, realPan를 세팅한다.
function paramSmartpaySet(xid, eci, cavv, realPan, hs_useamt_sh, restype, userkey, result, auth_type ){
	$("#frm_send input[name=xid]").val(xid);
	$("#frm_send input[name=eci]").val(eci);
	$("#frm_send input[name=cavv]").val(cavv);
	$("#frm_send input[name=cardno]").val(realPan);
	$("#frm_send input[name=restype]").val(restype);
	if ( restype!='' && userkey!='' && userkey != $("#frm_send input[name=user_key]").val() ){
		$("#frm_send input[name=update_easn_yn]").val("Y");
	}
	$("#frm_send input[name=user_key]").val(userkey);
	$("#frm_send input[name=res_type]").val(restype);
	$("#frm_send input[name=req_type]").val(restype);
	$("#frm_send input[name=apvl_desc]").val(result);
	
	//결재수단이 롯데 카드인 경우만  '지금 결재수단 다음에도 사용'에 카드 유형 정보를 재설정 한다20170818 추가
	if( $("#frm_send input[name=acqr_cd]").val() == paytype_card_047 ){
		
		if( auth_type == "SPS" || auth_type == "SPSW" ) {
			$("#frm_send input[name=card_pay_meth_cd]").val( "01" );	/* 카드유형( 인터넷결제(간편) ) */
		}
		else if( auth_type == "SPSA" ) {
			$("#frm_send input[name=card_pay_meth_cd]").val( "11" );	/* 카드유형( 모바일결제 ) */
		}
		else if( auth_type == "ACS" || auth_type == "ACSW" ) {
			$("#frm_send input[name=card_pay_meth_cd]").val( "02" );	/* 카드유형( 인터넷결제(일반) ) */
		}
		else if( auth_type == "ACSA" ) {
			$("#frm_send input[name=card_pay_meth_cd]").val( "22" );	/* 카드유형( 모바일결제 ) */
		}
		else if( auth_type == "APC" || auth_type == "MAPC" ) {
			$("#frm_send input[name=card_pay_meth_cd]").val( "03" );	/* 카드유형( 앱카드 ) */
		}
		else if( auth_type == "ALP" ) {
			$("#frm_send input[name=card_pay_meth_cd]").val( "04" );	/* 카드유형( 페이서비스 ) */
		}
		else{
			$("#frm_send input[name=card_pay_meth_cd]").val( "" );	    /* 만약 auth_type 없다면 null값 설정 */
		}
	}
	//결재수단이 롯데 카드인 경우만  '지금 결재수단 다음에도 사용'에 카드 유형 정보를 재설정 한다_20170818 추가

	
	if(xid=="" && eci=="" && cavv=="" && realPan=="") {
		returnPaymentPage();
		$("#X_ANSIM_FRAME").css("width"	,"450px");
		$("#X_ANSIM_FRAME").css("height","0px");
		$("#X_ANSIM_FRAME").hide();
		$("#ANSIM_LAYER").hide();
	} else {
		doPayment();
	}
}

// 아래부터 주문서에서 가져온 js
var totpayamt;
var ltPointCert = "N"; // 롯데포인트 인증여부
//	var soilPointSearch = "N"; // soil포인트 조회 여부

// 중복쿠폰혜택
var single_prom, single_prom_cnt;
var multi_prom, multi_prom_cnt;

// 2011.06.15 misp 다운 플러그인 div 보이기
function misp_plugIn(iscmcd){
	if (iscmcd == paytype_card_016 || iscmcd == paytype_card_026 || iscmcd == paytype_card_002 || iscmcd == paytype_card_054 || iscmcd == paytype_card_021){ // 국민카드, 비씨카드, 광주, 우체국
		$("#mISP_INFO").show();
	}else{
		$("#mISP_INFO").hide();
	}
}

function init() {
	// 결제수단 초기화
	$("#pay_card").show();

	// 로컬 스토리지 재 셋팅 (mISP, ilkmpi 에서 사용)
	localStorageReSet("order_");


	// 중복쿠폰
	ord_session_clear();

	single_prom = singleProm;
	single_prom_cnt = singlePromCnt;
	multi_prom = multiProm;
	multi_prom_cnt = multiPromCnt;

	$("#frm_inp select[name=iscmcd] option:first").attr('selected',true);
	$("#frm_inp input[name=rdo_cardinst]:radio").attr('disabled' , true);
	$("#frm_inp select[name=cardinstmon]").attr('disabled' , true);
	$("#frm_inp select[name=bankno] option:first").attr('selected',true);	// 무통장입금 은행

	// 참좋은혜택 배송비 default Setting
	benefit_dlvp_set();

	// 무료배송권 존재 시, 선택 event 발생
	fn_freeDlvpCpnUse();

	// 현금영수증 영역 선택 event 발생
	//$("#frm_inp input[name=rdo_cash]:radio:checked").click();
	$("#frm_inp select[name=rdo_cash]").change();

	// 롯데포인트 적립금액 세팅
	setLottePointSaveDiv(0);
}

// 보낼상품 선택 열고 닫기
function productToggle(btnId, product){
	$(btnId).toggleClass("on");
	$(product).toggle();
}

// 2011.06.07 카드 목록 생성
function createCardType(){
	var card_src = '<option value ="">카드선택</option>';
	card_src += cardStr;
	$("#frm_inp select[name=iscmcd]").html(card_src);
	// 카드값 기본 셋팅
	getCardInsCheck();
	$('.inlineBorder').removeClass('active');
}

// 구찌 상품 - 결제 전 재고 실시간 체크 Function
function fn_gucci_realtime(){
	var rtnFlag = true;

	var ordqty_arr = ($("#frm_send input[name=ordqty]:hidden").val()).split(split_gubun_1);
	var itemno_arr = ($("#frm_send input[name=itemno]:hidden").val()).split(split_gubun_1);
	var goodsno_arr = ($("#frm_send input[name=goodsno]:hidden").val()).split(split_gubun_1);

	var v_goods_no = '';
	var v_item_no  = '';
	var v_real_qty = '';

	//상품정보획득
	for (var i = 0 ; i <  goodsno_arr.length  ; i ++ ){
		// 20161014 박형윤 구찌 상품 재고 체크 오류 수정 배포
		// v_goods_no += goodsno_arr[i];
		// v_item_no += itemno_arr[i];
		// v_real_qty += ordqty_arr[i];
		v_goods_no = goodsno_arr[i];
		v_item_no = itemno_arr[i];
		v_real_qty = ordqty_arr[i];

		$.ajax({
					async: false,
					type: "POST",
					dataType:"json",
					url: "/product/searchGucciRealtimeCheck.do?" + __commonParam,
					data: {
						ord_qty : v_real_qty,
						goods_no : v_goods_no,
						item_no : v_item_no
					},
					success:function(data) {
						if(data.count > 0){
							alert("구찌연동오류: " + data.msg);
							rtnFlag = false;
						}
					},
					error:function(request, status) {
							alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
							rtnFlag = false;
						}
			 });
		 if(!rtnFlag){
			 return rtnFlag;
		 }

	}
	return rtnFlag;
}

function fn_orderGucciAgreeSup( target ){
	if ( $(target).closest('div.check_layer').hasClass('on') ){
		$(target).closest('div.check_layer').removeClass('on');
		$(target).closest('div.check').removeClass('on').addClass('off');
		$("#gucci_sup_div").hide();
	} else {
		$(target).closest('div.check_layer').addClass( 'on' );
		$(target).closest('div.check').removeClass('off').addClass('on');
		$("#gucci_sup_div").show();
	}
}
function fn_orderGucciAgreeTrns( target ){
	if ( $(target).closest('div.check_layer').hasClass('on') ){
		$(target).closest('div.check_layer').removeClass('on');
		$(target).closest('div.check').removeClass('on').addClass('off');
		$("#gucci_trns_div").hide();
	} else {
		$(target).closest('div.check_layer').addClass( 'on' );
		$(target).closest('div.check').removeClass('off').addClass('on');
		$("#gucci_trns_div").show();
	}
}

// 참좋은혜택 > 배송비 설정
function benefit_dlvp_set( arg ){
	var deli_idx = 1; // 상품 품목순번
	var bene_prd_obj;
	// default Setting
	if( arg == null ){
		while ( true ){
			bene_prd_obj = $("input[name=bene_deli_data_"+deli_idx+"]:hidden");
			if( bene_prd_obj.length == 0 ){
				break;
			}
			// 상품코드,배송코드,상품가격,주문수량
			var detail_data = $("input[name=bene_deli_data_"+deli_idx+"]:hidden").val().split('|');
			var goodsNoMany = "";
			var dlvPolcNoMany = "";
			var realSalePrcMany = "";
			var smpUseYnMany = "";
			var ordQtyMany = "";
			var split_str = "";
			var smartOrd = $("input[name=smartOrd]").val();
			var crspk_exist_yn = $("input[name=crspk_exist_yn]").val(); // 크로스픽 존재 여부

			if (crspk_exist_yn == "Y"){ // 크로스픽 존재
					smartOrd = "N";
			}

			// 배송비 조회를 위한 데이터 생성
			$("input[name=bene_deli_data_"+deli_idx+"]:hidden").each(function(){
				chk_data = ($(this).val()).split('|');
				if (detail_data[1]==chk_data[1]){
					split_str = (goodsNoMany==""?"":split_gubun_1);

					goodsNoMany += (split_str+chk_data[0]);
					dlvPolcNoMany += (split_str+chk_data[1]);
					realSalePrcMany += (split_str+chk_data[2]);
					smpUseYnMany += (split_str+smartOrd);

					ordQtyMany += (split_str+chk_data[3]);
				}
			});

			// 배송비 조회
			var res_str = "";
			var res_code = "";
			var res_msg = "";
			var dlex_amt = 0;
			$.ajax({
				type: 'post'
				, async: false
				, url: '/popup/multi_deli_amt.do?' + __commonParam
				, data: 'goodsNoMany='+goodsNoMany+'&dlvPolcNoMany='+dlvPolcNoMany+'&realSalePrcMany='+realSalePrcMany+'&smpUseYnMany='+smpUseYnMany+'&ordQtyMany='+ordQtyMany
				, success: function(response) {
					res_str = response.split(':');
					res_code = res_str[0];
					res_msg = res_str[1];
					dlex_amt = $.trim(res_str[2]);
				}
			});

			if ($.trim(res_code)=='0000'){
//				$("#bene_group_deli_amt_" + deli_idx).find("span").attr("dlex", dlex_amt);
//				$("#bene_group_deli_amt_" + deli_idx).find("span").html(
//						freeShippingYn=='Y' ? "무료 <span class=\"no_bold\">(플래티넘+ 회원)</span>" : (dlex_amt==0? "무료" : new String(dlex_amt).money() + "<span class=\"no_bold\">원</span>"));
			}
			else{
				alert($.trim(res_msg));
			}
			deli_idx++;
		}

	} // default Setting End
	// 다배송일 경우
	else {
		var deli_data = arg[0];
		var dlex_amt = arg[1];
		var dlvp_cnt = arg[2];
		var deli_idx = "";
		$("input[name^=bene_deli_data_]").each(function(){
			var thisVal = $(this).val().substring(0, $(this).val().lastIndexOf("|"));
			if ( thisVal == deli_data ){
				deli_idx = $(this).attr("name").substring("bene_deli_data_".length);
			}
		});
		var orgDlex = $("#bene_group_deli_amt_" + deli_idx).find("span").attr("dlex");

		$("#bene_group_deli_amt_" + deli_idx).find("span").attr("dlex", dlex_amt);
		$("#bene_group_deli_amt_" + deli_idx).find("span").html(
				freeShippingYn=='Y' ? "무료 <span class=\"no_bold\">(플래티넘+ 회원)</span>"
					: (dlex_amt==0? "무료<span class=\"no_bold\">(배송지 " + dlvp_cnt + ")</span>"
							: new String(dlex_amt).money() + "<span class=\"no_bold\">원(배송지 " + dlvp_cnt + ")</span>"));

		fn_calcTotalPrice(); // 금액 계산
	}
}

// 홈쇼핑 상품 - 우편번호 검색결과 선택 Function (단일 배송지만 해당)
function selSearchImallAddr(inpzip1, inpzip2, postaddr, corpPostNoSn, postNo) {
	$("#frm_inp input[name=corpPostNoSn]:hidden").eq(0).val( corpPostNoSn );
	$("#frm_inp input[name=postNo]:hidden").eq(0).val( postNo );
	$("#frm_inp input[name=inpzip1]:hidden").eq(0).val( inpzip1 );
	$("#frm_inp input[name=inpzip2]:hidden").eq(0).val( inpzip2 );
	$("#frm_inp input[name=inpaddr1]").eq(0).val( postaddr );
	$("#frm_inp input[name=inpaddr2]").eq(0).val('');
	$("#frm_inp input[name=inpaddr2]").focus();
	$("dd.add_result").empty();
	$("dd.add_result").hide();
}

// 홈쇼핑 상품 - 우편번호 검색 Function
function searchImallAddr() {
	var inpsearch = $("#inpsearch").val();			//검색 주소명
		if(!inpsearch) {
			alert("검색할 동이름을 입력해주세요.");
			return;
		}
	$.ajax({
		type: 'post'
		, async: false
		, url: '/order/imall_search_address.do?' + __commonParam
		, data: "dname=" + inpsearch + "&grockle_yn=" + grockle_yn
		, success: function(response) {
			$("dd.add_result").show();
			$("dd.add_result").html(response);
		}
		, error: function(request, status, err) {
			alert('우편번호 검색이 실패했습니다.\n다시 시도해주세요.');
			$("#frm_inp input[name=inpsearch]").focus();
			}
	});
 }

// 홈쇼핑 상품 - 결제 전 재고/가격 실시간 체크 Function
function fn_pay_realtime(simpleMemberYnFirst){
	var dup_goods_info = JSON.parse(dupGoodsInfo.replace(/'/g,'"'));
	var rtnFlag = true;
	// multdlv_goods_cnt : 주문 상품 갯수
	// $('#etMbrDlvpInfoArr') : 기존 등록된 배송지 갯수
	// v_goods_no_many : 상품 번호
	// v_item_no_many  : 단품번호
	// v_real_qty_many : 상품별 주문 수량
	// 배송지가 분리되지 않고 기존 배송지 중 선택할 경우는 모든 주문의 배송지 번호가 0으로 셋팅된다.
	var v_goods_no_many = '';
	var v_item_no_many  = '';
	var v_real_qty_many = '';
	var v_post_no_manay = '';
	// 모바일 홈쇼핑 상품 주문시 재고 체크 로직 수정 - jyyoon10
	var v_cart_sn       = '';
	//상품정보획득
	for (var i = 0 ; i <  dup_goods_info.length  ; i ++ ){
		if(v_goods_no_many != '' && v_goods_no_many.length>0) {	// 구분자로 연결
			v_goods_no_many += "[!AND!]";
			v_item_no_many += "[!AND!]";
			v_real_qty_many += "[!AND!]";
		}
		v_goods_no_many += dup_goods_info[i][0];
		v_item_no_many += dup_goods_info[i][1];
		v_real_qty_many += dup_goods_info[i][2];
	}

	// 단일 배송지
	if (simpleMemberYnFirst == "Y" ){ //간편회원이면
		v_post_no_manay = $("#temp_zip1_1").val()+$("#temp_zip2_1").val();
	}
	//해당 회원의 등록된 홈쇼핑용 배송지 수
	else if(deli_size=="0" ){ //최초 구매 신규 입력
		v_post_no_manay = $("#frm_inp input[name=inpzip1]:hidden").val()+$("#frm_inp input[name=inpzip2]:hidden").val();
	}
	else{
		//신규 입력
		if($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() != undefined||$("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() != "undefined" ){
			v_post_no_manay = $(":hidden[name=postNo]").eq(0).val();
		}
		//기존 배송지 선택
		else {
			v_post_no_manay	= $("#frm_inp input[name=postNo]").eq(0).val();
		}
	}

	// 모바일 홈쇼핑 상품 주문시 재고 체크 로직 수정 - jyyoon10
	v_cart_sn = $("#frm_send input[name=cartsn]:hidden").val();

	//alert("call Ajax");
	//alert('Call Ajax 1. goods_no : ' + v_goods_no_many + ' 2. item_no : ' + v_item_no_many + ' 3. real_qty : ' + v_real_qty_many + ' 4. cart_sn : ' + v_cart_sn);

	$.ajax({
		async: false,
		cache : false,
		type: "POST",
		dataType:"json",
		url: "/product/searchOrderRealtimePay.do?" + __commonParam,
		data: {
			goods_no_list : v_goods_no_many,
			item_no_list : v_item_no_many,
			real_qty_list : v_real_qty_many,
			post_no_manay : v_post_no_manay,
			cartSn : v_cart_sn,
			dlvp_cnt : 0,
			goods_no_many : "",
			item_no_manay : "",
			ord_qty_many : ""
			},
		success:function(data) {
			if(data.count > 0){
				var msg = "상품의 재고 수량이 부족합니다.";

				if (data.list != "[null]") {
					if (data.count > 1){
						msg = '각상품 '+data.list+'의 재고 수량이 부족합니다.';
					}else{
						msg = '상품 '+data.list+'의 재고 수량이 부족합니다.';
					}
				}

				alert(msg);

				rtnFlag = false;
			}else if(data.deliv == "N"){
				alert('배송불가 지역 입니다');
				rtnFlag = false;
			}else{
				rtnFlag = true;
			}
		},
		error:function(request, status) {
			//alert("error");
				alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
			rtnFlag = false;
		}
	});
	return rtnFlag;
}

function send() {
	sendTclick('Sporder_Clk_Btn_9');
	
	//20180903 GA 태깅 추가
	GAEvtTag('MO_상품상세', '엘페이 바로결제', 'L.pay 간편결제');
	
	if( "137725" == cp_cn ){  // TWorld OKCASHBAG
		if (!chk_ocb_card_no()){ // 카드번호 체크
			return;
		}
	}
	// 반복구매제한고객체크
	if ("Y" != grockle_yn) {
		if ( !searchCncnMbrChk() ) {
			return;
		}
	}
	/* 재고수량체크 */
	if(!fn_invQtyCheck($("#frm_send input[name=cartsn]:hidden").val())) return;
	
	iscmcd = $("#frm_inp select[name=iscmcd]").val();
	//console.log("iscmcd==	"+iscmcd);
	//return;
	cpncardcd	= $("#frm_send input[name=cardkndcd]:hidden").val();	// 할인쿠폰의 카드정보
	cpncardcd_dup = $("#frm_send input[name=cardkndcd_dup]:hidden").val();	// 중복카드할인쿠폰의 카드정보

	// 1차할인, 2차할인 중 카드할인이 존재할 경우
	if ( (cpncardcd != '' || cpncardcd_dup != '') && !lpay_card_set ) {
		if( iscmcd == ''){
			alert("카드할인을 받으시려면 해당 카드로 결제하셔야 합니다.");
			$("#frm_inp select[name=iscmcd]").change();	// 할인정보 재조회
			return;
		} else if( iscmcd != '' && !(iscmcd == cpncardcd || iscmcd == cpncardcd_dup) ){
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('disabled' , false);
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('checked' , true);
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop('checked' , true);
			$("#frm_inp select[name=iscmcd]").change();	// 할인정보 재조회
			return;
		}
	}

	// 구매동의
	if (  !$("#frm_inp input[name=ord_agr_yn]").is(":checked")  ){
		if(confirm("주문 내역 확인 동의를 하셔야 합니다.")) {
			$("#frm_send input[name=ord_agr_yn]:hidden").val("Y");
			$("input[name=ord_agr_yn]:checkbox")[0].checked = true;
		}
		return;
	}else{
		$("#frm_send input[name=ord_agr_yn]:hidden").val("Y");
	}

	if(totpayamt == ""){
		var spayamt	 = $("#frm_inp input[name=defaulttotsttlamt]:hidden").val(); // 배송비가 합쳐 있는 금액
		var sincludeSaveInstCpn = $("#frm_send input[name=includeSaveInstCpn]").val(); // 2011.05.19 적립여부
		var sdcamt = $("#frm_send input[name=totdcamt]").val();

		if(includeSaveInstCpn=='Y'){
			totpayamt	= spayamt.toString();
		}else{
			totpayamt	= (spayamt - sdcamt).toString();
		}

		var stot_deli_amt = 0; // 총배송비

		var qs_yn = $("#frm_send input[name=qs_yn]:hidden").val(); //퀵배송정보

		if (freeShippingYn=='N'){ // 플래티넘 플러스가 아니면
			if ($("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")){ // 다중배송여부
				stot_deli_amt = $("#frm_inp input[name=caltotdeliamt]:hidden").val(); // 계산된 총배송비
			}else{
				stot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
			}
		}else{
			if(qs_yn == "Y"){
				stot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
			}
		}
		// 배송비 적용
		if (freeShippingYn=='N'){ // 플래티넘 플러스가 아니면
			totpayamt   = (parseInt(totpayamt) + parseInt(stot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
		}else{
			if(qs_yn == "Y"){
				totpayamt   = (parseInt(totpayamt) + parseInt(stot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
			}
		}
	}


	// 결제정보
	paytype		= $("#frm_send input[name=paytype]:hidden").val(); // 결제수단
	totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val(); // 총결제금액

	if (parseInt(totsttlamt) > 0){
		var iscmcd, cardinstmon, virAcctBank, onlineacctname;
		if ( paytype == PAYTYPE_CODE_CARD || paytype == PAYTYPE_CODE_LPAY ) {
			iscmcd			= $("#frm_inp select[name=iscmcd]").val();
			// 2012.12.26
			cardinstmon		= $("#frm_inp select[name=cardinstmon]").val();

			if ( cardinstmon == "" || $("#frm_send input[name=prommdclcd_third]").val() == "35" ) {
				cardinst = "01";
				cardinstmon = "";
				$("#frm_inp select[name=cardinstmon]").val("");
			} else {
				var onintmonth = $("#frm_inp input[name=onintmonth]:hidden").val();
				var intmonth = $("#frm_inp input[name=intmonth]:hidden").val();
				if ( cardinstmon == "2" ) {
					if ( onintmonth.indexOf(cardinstmon) == 0 ) {
						cardinst = "02";
					} else {
						cardinst = "03";
					}
				} else {
					if ( onintmonth.indexOf(cardinstmon) > -1 ) {
						cardinst = "02";
					} else {
						cardinst = "03";
					}
				}
			}
			$("#frm_inp input[name=rdo_cardinst]:radio[value='"+cardinst+"']").prop("checked", true)

			totsttlamt 		= $("#frm_inp input[name=totsttlamt]:hidden").val();
			bankno			= "";
			onlineacctname  = "";
			reg_no1 = "";
			reg_no2 = "";

			if ( totsttlamt < 10 ) {
				alert('10원 이상 결제 시 신용카드 사용이 가능합니다.');
				return;
			} else if ( $.trim(iscmcd) == '' && paytype == PAYTYPE_CODE_CARD ) {
				alert('카드 종류를 선택해주세요.1');
				return;
			} else if ( paytype == PAYTYPE_CODE_LPAY ) {
				if(lpay_card_set){
					alert('L.pay에 카드를 등록해주세요.');
					return;
				} else if( $.trim(iscmcd) == '' ){
					alert('카드 종류를 선택해주세요.2');
					return;
				}
			} else if (totsttlamt > 300000 && (varUa < 0) && cp_schema == 'mlotte003' && $.trim(iscmcd)!=paytype_card_048 && $.trim(iscmcd)!=paytype_card_029 && $.trim(iscmcd)!=paytype_card_016 && $.trim(iscmcd)!=paytype_card_026 && $.trim(iscmcd)!=paytype_card_047 && $.trim(iscmcd)!=paytype_card_002 && $.trim(iscmcd)!=paytype_card_054 && $.trim(iscmcd)!=paytype_card_021 && $.trim(iscmcd)!=paytype_card_020 && $.trim(iscmcd)!=paytype_card_008){ // 아이패드 : 롯데/신한/현대/국민/BC/삼성/광주/우체국 카드/농협 외 30만원 결제 불가 처리
				// 30만원 이상 결제시 안내처리
				if ( $("#frm_inp input[name=rdo_paytype]:radio").length > 1 ) {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				} else {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				}
			} else if (totsttlamt > 300000 && (varUa < 0) && $.trim(iscmcd)!=paytype_card_048 && $.trim(iscmcd)!=paytype_card_029 && $.trim(iscmcd)!=paytype_card_016 && $.trim(iscmcd)!=paytype_card_026 && $.trim(iscmcd)!=paytype_card_047 && $.trim(iscmcd)!=paytype_card_031 && $.trim(iscmcd)!=paytype_card_002 && $.trim(iscmcd)!=paytype_card_054 && $.trim(iscmcd)!=paytype_card_021 && $.trim(iscmcd)!=paytype_card_020 && $.trim(iscmcd)!=paytype_card_008 && $.trim(iscmcd)!=paytype_card_018 && $.trim(iscmcd)!=paytype_card_036){ // 아이폰 및 웹 : 롯데/신한/현대/국민/BC/광주/우체국 카드/농협 외 30만원 결제 불가 처리
				// 30만원 이상 결제시 안내처리
				if ( $("#frm_inp input[name=rdo_paytype]:radio").length > 1 ) {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 삼성, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				} else {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 삼성, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				}
			} else if (totsttlamt > 300000 && $.trim(iscmcd)!=paytype_card_048 && $.trim(iscmcd)!=paytype_card_029 && $.trim(iscmcd)!=paytype_card_016 && $.trim(iscmcd)!=paytype_card_026 && $.trim(iscmcd)!=paytype_card_020 && $.trim(iscmcd)!=paytype_card_047 && $.trim(iscmcd)!=paytype_card_031 && $.trim(iscmcd)!=paytype_card_002 && $.trim(iscmcd)!=paytype_card_054 && $.trim(iscmcd)!=paytype_card_021 && $.trim(iscmcd)!=paytype_card_008 && $.trim(iscmcd)!=paytype_card_018 && $.trim(iscmcd)!=paytype_card_036){ // 롯데/신한/현대/국민/삼성/BC/하나SK/광주/우체국 카드/농협 외 30만원 결제 불가 처리
				// 30만원 이상 결제시 안내처리
				if ( $("#frm_inp input[name=rdo_paytype]:radio").length > 1 ) {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 삼성, 비씨, 하나SK, 광주, 우체국 카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				} else {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 삼성, 비씨, 하나SK, 광주, 우체국 카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				}
			} else if (totsttlamt > 300000 && (varUa < 0) && cp_schema == 'mlotte001' && $.trim(iscmcd)==paytype_card_031 && cp_schema!='' && cp_udid!='' && !appVerChk(cp_v, '133')){ // 삼성카드 결제 시
				alert('롯데닷컴 앱에서 삼성카드 30만원 이상 결제를 하시려면 롯데닷컴 최신버전 앱으로 업데이트 해주세요.');
				return;
			} else if (totsttlamt > 300000 && (varUa > -1) && $.trim(iscmcd)==paytype_card_047 && cp_schema=='mlotte001' && cp_udid!='' && !appVerChk(cp_v, '160')){ // 롯데카드 결제 시
				alert('롯데닷컴 앱에서 롯데카드 30만원 이상 결제를 하시려면 롯데닷컴 최신버전 앱으로 업데이트 해주세요.');
				return;
			} else if (totsttlamt > 300000 && (varUa > -1) && $.trim(iscmcd)==paytype_card_031 && cp_schema=='mlotte001' && cp_udid!='' && !appVerChk(cp_v, '164')){ // 삼성카드 결제 시
				alert('롯데닷컴 앱에서 삼성카드 30만원 이상 결제를 하시려면 롯데닷컴 최신버전 앱으로 업데이트 해주세요.');
				return;
			} else if ( cardinst != '01' && $.trim(cardinstmon) == '' ) {	// 일시불이 아니면서 할부기간이 선택안된경우
				alert('할부기간을 선택해주세요.');
				return;
			}
		} else if ( paytype == PAYTYPE_CODE_BANK ) {
			iscmcd		= "";
			cardinst	= "";
			cardinstmon	= "";
			bankno		= $("#frm_inp select[name=bankno]").val();
			onlineacctname	= $("#frm_inp input[name=onlineacctname]").val();
			reg_no1 = "";
			reg_no2 = "";

			if ( $.trim(bankno) == '' ) {
				alert('입금 은행을 선택해주세요.');
				return;
			} else if ( $.trim(onlineacctname) == '' ) {
				alert('입금자이름을 입력해주세요.');
				$("#frm_inp input[name=onlineacctname]").focus();
				return;
			}
		} else if  ( paytype == PAYTYPE_CODE_PHONE ) {
			iscmcd		= "";
			cardinst	= "";
			cardinstmon	= "";
			bankno			= "";
			onlineacctname  = "";
			reg_no1 = $("#frm_inp input[name=reg_no1]").val();
			reg_no2 = $("#frm_inp input[name=reg_no2]").val();
		} else if  ( typeof($("#pntOnlyPay").val()) != undefined &&  $("#pntOnlyPay").val() == '19' ) {
			alert("L.POINT 전용 상품입니다. \n현재 보유하고 계신 L.POINT가 부족하여 주문을 진행 하실 수 없습니다.");
			return;
		} else if  ( typeof($("#pntOnlyPay").val()) != undefined &&  $("#pntOnlyPay").val() == '21' ) {
			alert("L-money 전용 상품입니다. \n현재 보유하고 계신 L-money가 부족하여 주문을 진행 하실 수 없습니다.");
			return;
		} else {
			alert('결제수단을 선택해주세요.');
			return;
		}

		$("#frm_send input[name=paytype]:hidden").val( paytype );
		$("#frm_send input[name=iscmcd]:hidden").val( iscmcd );
		$("#frm_send input[name=cardinst]:hidden").val( cardinst );
		$("#frm_send input[name=cardinstmon]:hidden").val( cardinstmon );
		$("#frm_send input[name=bankno]:hidden").val( bankno );
		$("#frm_send input[name=onlineacctname]:hidden").val( onlineacctname );
		$("#frm_send input[name=reg_no1]:hidden").val( reg_no1 ); // 주민등록번호
		$("#frm_send input[name=reg_no2]:hidden").val( reg_no2 ); // 주민등록번호
		if(paytype == PAYTYPE_CODE_LPAY){
			if ($('#lpay_paymean .lpay.check.on.crucial').length>0){ // 화면에서 선택 된 것이 있으면
				var lpay_sel_paymean_id = $('#lpay_paymean .lpay.check.on.crucial').attr('id').replace('lpay_paymean_', '');			
				$("#frm_send input[name=lpay_card_id]:hidden").val( $("select[name=iscmcd] option[data-card-id='"+lpay_sel_paymean_id+"']").data("card-id") ); // 고객 보유 카드 ID
				$("#frm_send input[name=lpay_card_anm]:hidden").val( $("select[name=iscmcd] option[data-card-id='"+lpay_sel_paymean_id+"']").data("card-anm") ); // 고객 보유 카드명(닉네임)
			}else{
				$("#frm_send input[name=lpay_card_id]:hidden").val( $("select[name=iscmcd]").find("option:selected").attr("data-card-id") ); // 고객 보유 카드 ID
				$("#frm_send input[name=lpay_card_anm]:hidden").val( $("select[name=iscmcd]").find("option:selected").attr("data-card-anm") ); // 고객 보유 카드명(닉네임)
			}
		}
	}
	else
	{
		$("#frm_send input[name=paytype]:hidden").val("");
		$("#frm_send input[name=iscmcd]:hidden").val("");
		$("#frm_send input[name=cardinst]:hidden").val("");
		$("#frm_send input[name=cardinstmon]:hidden").val("");
		$("#frm_send input[name=bankno]:hidden").val("");
		$("#frm_send input[name=onlineacctname]:hidden").val("");
		$("#frm_send input[name=reg_no1]:hidden").val("");
		$("#frm_send input[name=reg_no2]:hidden").val("");
		$("#frm_send input[name=lpay_card_id]:hidden").val("");
		$("#frm_send input[name=lpay_card_anm]:hidden").val("");
	}

	// 포인트정보
	var lpoint_amt, lt_point_amt, deposit_amt, soil_point_amt, chk_point, chk_point_all, pay_mean_cd, pay_amt;
	lpoint_amt      = ($("#lpoint_amt").prop("id")==undefined?0:(($("#lpoint_amt").val()).length<1?0:$("#lpoint_amt").val())); // 2011.05.23 L_포인트
	lt_point_amt    = ($("#lt_point_amt").prop("id")==undefined?0:(($("#lt_point_amt").val()).length<1?0:$("#lt_point_amt").val())); // 2011.05.23 롯데포인트
	deposit_amt     = ($("#deposit_amt").prop("id")==undefined?0:(($("#deposit_amt").val()).length<1?0:$("#deposit_amt").val())); // 2011.05.23 보관금
//		soil_point_amt  = ($("#soil_point_amt").prop("id")==undefined?"":(($("#soil_point_amt").val()).length<1?0:$("#soil_point_amt").val())); // 2013.05.07 Soil포인트

	var chk_arr = new Array();
	var pay_cd_arr = new Array();
	var pay_amt_arr = new Array();
	// 선택된 내역

	$.each($("#frm_inp input:checkbox[name=chk_point]:checked"), function(){
			chk_arr.push($(this).val());

			if($(this).val()=="lpoint"){ // L-money
				pay_cd_arr.push(lPoint);
				pay_amt_arr.push(lpoint_amt);

			}

			if($(this).val()=="lt_point"){ // 롯데포인트
				pay_cd_arr.push(ltPoint);
				pay_amt_arr.push(lt_point_amt);
			}

/*				if($(this).val()=="soil_point"){ // S-oil포인트
				pay_cd_arr.push(soilPoint);
				pay_amt_arr.push(soil_point_amt);
			}*/
		}
	);

	var chk_arr_all = new Array();
	// 모두선택된 내역
	$.each($("#frm_inp input:checkbox[name=chk_point_all]:checked"), function(){
			chk_arr_all.push($(this).val());

			if($(this).val()=="deposit"){ // 보관금
				pay_cd_arr.push(deposit);
				pay_amt_arr.push(deposit_amt);
			}
		}
	);

	chk_point = chk_arr.join();
	pay_mean_cd = pay_cd_arr.join();
	pay_amt = pay_amt_arr.join();
	chk_point_all = chk_arr_all.join();

	$("#frm_send input[name=lpoint_amt]:hidden").val( lpoint_amt );
	$("#frm_send input[name=lt_point_amt]:hidden").val( lt_point_amt );
	$("#frm_send input[name=deposit_amt]:hidden").val( deposit_amt );
//		$("#frm_send input[name=soil_point_amt]:hidden").val( soil_point_amt );
	$("#frm_send input[name=chk_point]:hidden").val( chk_point );
	$("#frm_send input[name=chk_point_all]:hidden").val( chk_point_all );
	$("#frm_send input[name=pay_mean_cd]:hidden").val( pay_mean_cd );
	$("#frm_send input[name=pay_amt]:hidden").val( pay_amt );

	// 무료배송권 정보
	var dlv_prom_use_yn, dlv_fvr_val, dlv_prom_no, dlv_rsc_mgmt_sn
	dlv_prom_use_yn = $("#dlv_prom_use_yn").val(); // 무료배송권사용여부

	if (dlv_prom_use_yn=="Y"){
		dlv_fvr_val     = $("#dlv_fvr_val").val(); // 무료배송권금액
		dlv_prom_no     = $("#dlv_prom_no").val(); // 무료배송권 프로모션번호
		dlv_rsc_mgmt_sn = $("#dlv_rsc_mgmt_sn").val(); // 무료배송권 자원관리일련번호
	} else {
		dlv_fvr_val = "";
		dlv_prom_no = "";
		dlv_rsc_mgmt_sn = "";
	}

	$("#frm_send input[name=dlv_prom_use_yn]:hidden").val( dlv_prom_use_yn );
	$("#frm_send input[name=dlv_fvr_val]:hidden").val( dlv_fvr_val );
	$("#frm_send input[name=dlv_prom_no]:hidden").val( dlv_prom_no );
	$("#frm_send input[name=dlv_rsc_mgmt_sn]:hidden").val( dlv_rsc_mgmt_sn );

	// 총결제금액
	$("#frm_send input[name=totsttlamt]:hidden").val( totsttlamt );

	// 카드결제정보 설정
	$("#frm_card input[name=X_CARDTYPE]:hidden").val( iscmcd );
	$("#frm_card input[name=X_AMOUNT]:hidden").val( totsttlamt );
	if (totsttlamt > 300000 && (iscmcd==paytype_card_048 || iscmcd==paytype_card_029)){ // 신한/현대카드 30만원 이상 결제
		$("#frm_card input[name=X_ISMART_USE_SIGN]:hidden").val("Y");

		if (lotte_app_yn == 'Y' || smart_pic_app_yn == 'Y' || ellotte_app_yn == 'Y'){ // ellotte_yhchoi9
		$("#frm_card input[name=X_MALL_APP_NAME]:hidden").val(schema_domain);
		}
	}else{
		$("#frm_card input[name=X_ISMART_USE_SIGN]:hidden").val("");
		$("#frm_card input[name=X_MALL_APP_NAME]:hidden").val("");
	}

	// 롯데카드 정보
	if (iscmcd==paytype_card_047){ // 롯데카드
		$("#SIMPLEPAYFORM input[name=order_amount]:hidden").val( totsttlamt );
		$("#SIMPLEPAYFORM input[name=order_cardname]:hidden").val( "LOTTECARD" );
	}

	// 현금영수증 (무통장입금, L-money, 보관금)
	if (paytype == PAYTYPE_CODE_BANK || (lpoint_amt != "" && lpoint_amt > 0) || (deposit_amt != "" && deposit_amt > 0)){

		var cr_issu_mean_sct_cd = $("#frm_inp select[name=cr_issu_mean_sct_cd]").val();
		//var cash_cd = $("#frm_inp input[name=rdo_cash]:radio:checked").val();
		var cash_cd = $("#frm_inp select[name=rdo_cash]").val();
		var tmp_val = "";
		var cash_val = "";
		var max_length = 0;
		var title = "";
		var bool_send = true;
		var disabled = "";

		if (cash_cd == "1"){ // 소득공제
			$("#frm_send input[name=cr_issu_mean_sct_cd]:hidden").val(cr_issu_mean_sct_cd);
			$("#frm_send input[name=cr_use_sct_cd]:hidden").val("0");

			var cash_id = "cash_receipts0";

			if (cr_issu_mean_sct_cd == "1"){
				cr_issu_mean_sct_cd = "2";
			}

			if (cr_issu_mean_sct_cd == "3"){
				cash_val = $("#frm_inp select[name=cr_issu_mean_no_phone1]").val();
			}

			$("#cash_receipts0"+cr_issu_mean_sct_cd+" input").each(function(){
				max_length = $(this).attr("maxlength");
				title = $(this).attr("title");
				tmp_val = $(this).val();
				tmp_str = " 이상";
				disabled = $(this).attr("disabled");

				if(disabled != "disabled"){
					if ($(this).attr("name") == "cr_issu_mean_no_credit_crd4"){ // 신용카드 마지막 자리 수는 3자리 이상 되도록
						max_length = 3;
					}else if ($(this).attr("name") == "cr_issu_mean_no_rcpt_crd4"){ // 현금영수증 카드 마지막 자리 수는 1자리 이상 되도록
						max_length = 1;
					}else if ($(this).attr("name") == "cr_issu_mean_no_phone2"){ // 휴대전화 중간자리 3자리 이상 되도록
						max_length = 3;
					}else{
						tmp_str = "로";
					}

					if (tmp_val.length < max_length){
						alert(title + "를 " + max_length + "자리" + tmp_str + " 입력해 주세요.");
						$(this).focus();
						bool_send = false;
						return false;
					}
				}

				cash_val += tmp_val;
			});
			$("#frm_send input[name=cr_issu_mean_no]:hidden").val(cash_val);
		}else if (cash_cd == "2"){ // 지출증빙용
			$("#frm_send input[name=cr_issu_mean_sct_cd]:hidden").val($("#frm_inp input[name=cr_issu_mean_sct_cd_bman]:hidden").val());
			$("#frm_send input[name=cr_use_sct_cd]:hidden").val("1");
			$("#co_value input").each(function(){
				max_length = $(this).attr("maxlength");

				if (max_length>1) {
					title = $(this).attr("title");
					tmp_val = $(this).val();

					if (tmp_val.length < max_length){
						alert(title + "를 " + max_length + "자리로 입력해 주세요.");
						$(this).focus();
						bool_send = false;
						return false;
					}
					cash_val += tmp_val;
				}
			});
			num1 = cash_val.charAt(0);	num2 = cash_val.charAt(1);	num3 = cash_val.charAt(2);	num4 = cash_val.charAt(3);
			num5=  cash_val.charAt(4);	num6 = cash_val.charAt(5);	num7 = cash_val.charAt(6);
			num8 = cash_val.charAt(7);	num9 = cash_val.charAt(8);	num10 = cash_val.charAt(9);

			var total = (num1*1)+(num2*3)+(num3*7)+(num4*1)+(num5*3)+(num6*7)+(num7*1)+(num8*3)+(num9*5);
			total = total + parseInt((num9 * 5) / 10);
			var tmp = total % 10;
			if(tmp == 0) {
				var num_chk = 0;
			} else {
				var num_chk = 10 - tmp;
			}
			if(num_chk != num10) {
				alert("사업자등록번호가 올바르지 않습니다.");
				$("#frm_inp input[name=cr_issu_mean_no_bman1]").focus();
				bool_send = false;
				return false;
			}

			$("#frm_send input[name=cr_issu_mean_no]:hidden").val(cash_val);
		}else{ // 선택안함
			$("#frm_send input[name=cr_issu_mean_sct_cd]:hidden").val("");
			$("#frm_send input[name=cr_use_sct_cd]:hidden").val("");
			$("#frm_send input[name=cr_issu_mean_no]:hidden").val(cash_val);
		}

		if (!bool_send){
			return;
		}
	}

	//L.POINT 비밀번호 입력 레이어
	if($("#frm_inp input[name=paytype]:hidden").val() != PAYTYPE_CODE_LPAY && $("#frm_send input[name=lt_cd_no]").val() == "" && simple_mem_yn != "Y"
		&& $("#temp_lt_point_amt").length > 0 && $("#temp_lt_point_amt").val() != "" && $("#temp_lt_point_amt").val() != "0" ){
		$("html, body").animate({
			scrollTop: $("#submit_btn").offset().top
		}, function(){ $("#laver_Lpay_order").show(); });
		return;
	}

	//이쿠폰 환불주체 변경 관련 추가
	if($("#chk_smp_ecpn_gift_yn").length > 0) {
		$("#frm_send input[name=smp_ecpn_gift_yn]:hidden").val(($("#chk_smp_ecpn_gift_yn").val()));
	}
	if($("#smp_ecpn_rfd_tgt").length > 0) {

		if ($("#smp_ecpn_rfd_tgt_cd_01").attr("checked") == true || $("#smp_ecpn_rfd_tgt_cd_01").prop("checked") == true) {
			$("#frm_send input[name=smp_ecpn_rfd_tgt_cd]:hidden").val(($("#smp_ecpn_rfd_tgt_cd_01").val()));
		} else if($("#smp_ecpn_rfd_tgt_cd_02").attr("checked") == true || $("#smp_ecpn_rfd_tgt_cd_02").prop("checked") == true ) {
			$("#frm_send input[name=smp_ecpn_rfd_tgt_cd]:hidden").val(($("#smp_ecpn_rfd_tgt_cd_02").val()));
		} else {
			$("#frm_send input[name=smp_ecpn_rfd_tgt_cd]:hidden").val("");
		}
	}

	var goodsno_arr = ($("#frm_send input[name=goodsno]:hidden").val()).split(split_gubun_1);
	var v_goods_no = "";

	for (var i = 0 ; i <  goodsno_arr.length  ; i ++ ){
		v_goods_no += goodsno_arr[i] + ":";
	}

	//상품권 구매제한 체크
	/*
	pticketCheck(0, v_goods_no, function(flag){
		if(flag){
			return;
		}else{
			doXansim();
		}
	});
	*/
	doXansim();
}

// 하나SK 결제
function hanaskcard_payment(){
	var iscmcd = $("#frm_send input[name=iscmcd]:hidden").val();
	var vp_cardcode = "hanaM";
	var vp_quota = $("#frm_send input[name=cardinstmon]:hidden").val(); // 할부개월
	var vp_quota_flag = ($("#frm_send input[name=cardinst]:hidden").val()=="02"?"Y":"N"); // 무이자여부
	var vp_price = $("#frm_send input[name=totsttlamt]:hidden").val(); //결제금액
	var vp_goodname = $("#frm_send input[name=goodsnm]:hidden").val(); //상품명
	var goods_unit = vp_goodname.split(split_gubun_1);

	if (goods_unit.length > 1){
		vp_goodname = (goods_unit[0] + " 외 " + (goods_unit.length - 1));
	}

	$("#frm_vpay input[name=vp_cardcode]:hidden").val(vp_cardcode);
	$("#frm_vpay input[name=vp_goodname]:hidden").val(vp_goodname);
	$("#frm_vpay input[name=vp_price]:hidden").val(vp_price);
	$("#frm_vpay input[name=vp_quota]:hidden").val(vp_quota);
	$("#frm_vpay input[name=vp_quota_flag]:hidden").val(vp_quota_flag);
	$("#frm_vpay input[name=vp_iscmcd]:hidden").val(iscmcd);

	$("#frm_vpay").attr("target", "X_ANSIM_FRAME");
	$("#frm_vpay").attr("action", "/vpay/req-authM.jsp");

	$("#frm_vpay").submit();
}

// 결제, 롯데핀 레이어팝업 위치 지정
function payment_pop_position(){
	$("#ANSIM_LAYER").css("top"	,"0px");
	window.scrollTo(0, 0); // 안심레이어 위치 지정
}

function doXansim() {
	paytype		= $("#frm_send input[name=paytype]:hidden").val();
	pay_mean_cd	= $("#frm_send input[name=pay_mean_cd]:hidden").val();
	cardkndcd   = $("#frm_send input[name=cardkndcd]:hidden").val();
	cardkndcd_dup   = $("#frm_send input[name=cardkndcd_dup]:hidden").val();

	$("#frm_send input[name=credit_crd_gb]:hidden").val(""); // ISP, MPI 구분

	disableItems(true);

	if ( paytype == PAYTYPE_CODE_LPAY ){ // L.pay WEB : 결제
		$("#frm_lpay input[name=req_div]:hidden").val("pay_req"); // 결제요청
		
		fn_LpayIframeSet(); // L.pay WEB : iframe 설정
		
		var lpay_param = ["goodsno", "lt_point_amt", "totsttlamt", "iscmcd", "cardinst", "cardinstmon", "lpay_card_id", "lpay_card_anm", "giftyn", "prommdclcd", "ordr_nm", "ordr_cell_no"];			
		for (var i=0; i<lpay_param.length; i++){ // 파라메터 셋팅
			$("#frm_lpay input[name="+lpay_param[i]+"]:hidden").val($("#frm_send input[name="+lpay_param[i]+"]:hidden").val());
		}
		
		// L.pay WEB : 결제 데이터 초기화
		$("#frm_send input[name=xid]:hidden").val("");
		$("#frm_send input[name=eci]:hidden").val("");
		$("#frm_send input[name=cavv]:hidden").val("");
		$("#frm_send input[name=cardno]:hidden").val("");
		$("#frm_send input[name=lpay_conf_no]:hidden").val(""); // LPAY_CONF_NO
		$("#frm_send input[name=lpay_pay_sn]:hidden").val(""); // pay_sn
		$("#frm_send input[name=lpay_json_data]:hidden").val("");
		
		$("#frm_send input[name=cardno]:hidden").val($("select[name=iscmcd]").find("option:selected").attr("data-card-no")); // LPAY 카드 번호
		$("#frm_send input[name=credit_crd_gb]:hidden").val("4"); // LPAY 카드 구분
		$("#frm_send input[name=smart_pay_use_yn]").val(""); // 스마트페이 여부
		
		$("#pageDesc").html("결제 준비 중입니다.<br>잠시만 기다려 주세요.");
		$("#pageCover,#pageLoading").show(); // 로딩 이미지 적용
		
		$("#frm_lpay").submit();
	// 002:광주, 008:외환, 016:KB국민, 018:NH, 020:하나SK, 026:비씨, 029:신한, 031:삼성, 036:씨티, 047:롯데, 048:현대, 054:우체국체크
	}else if ( paytype == PAYTYPE_CODE_CARD ) {	// 결제 수단이 카드
		X_CARDTYPE	= $("#frm_card input[name=X_CARDTYPE]:hidden").val();

		if (X_CARDTYPE == paytype_card_047
			|| X_CARDTYPE == paytype_card_029
				|| X_CARDTYPE == paytype_card_031
				|| X_CARDTYPE == paytype_card_048
				|| X_CARDTYPE == paytype_card_020
				|| X_CARDTYPE == paytype_card_008
				|| X_CARDTYPE == paytype_card_036
				|| X_CARDTYPE == paytype_card_018
				) { // MPI
			payment_pop_position(); // 결제 레이어팝업 위치 지정

			$("#ANSIM_LAYER").css("width"	,"100%");
			$("#ANSIM_LAYER").css("height"	,"530px");
			window.scrollTo(0, 0); // 안심레이어 위치 지정
			$("#ANSIM_LAYER").show();
			$("#X_ANSIM_FRAME").show();

			$("#frm_send input[name=credit_crd_gb]:hidden").val("2"); // MPI
		}
		//--------------------------------------------------------
		// X-안심클릭 서비스 관련 스크립트 Start !!!
		//--------------------------------------------------------
		var pay_confirm_type = $("input[name=card_confirm_type]:radio:checked").val(); // 카드 인증 방식

		$("#frm_send input[name=smart_pay_use_yn]").val(""); // 스마트페이 여부

		var	lotte_hist_card_pay_meth_cd = $("#frm_inp input[name=lotte_hist_card_pay_meth_cd]").val(); //카드 방식 결제코드 이력
		
		if (X_CARDTYPE == paytype_card_047 ) { // 롯데카드
			if (pay_confirm_type == "01" && lotte_hist_card_pay_meth_cd == "11"){ // 모바일결제
				$("#frm_send input[name=smart_pay_use_yn]").val("Y");
				lottecard_payment('SPSA'); 
			}else if (pay_confirm_type == "01" && lotte_hist_card_pay_meth_cd == "01"){ // 인터넷결제(간편)
				$("#frm_send input[name=smart_pay_use_yn]").val("Y");
				lottecard_payment('SPSW'); 
			}else if (pay_confirm_type == "02" && lotte_hist_card_pay_meth_cd == "02"){ // 모바일결제
				lottecard_payment('ACSW'); 
			}else if (pay_confirm_type == "02" && lotte_hist_card_pay_meth_cd == "22"){ // 인터넷결제(일반)
				lottecard_payment('ACSA'); 
			}else if (pay_confirm_type == "03"){ // 앱결제
				// lottecard_payment('APC'); // 롯데카드사에서 개발하지 않음
				lottecard_payment('MAPC');
			}else if (pay_confirm_type == "04"){ // 페이서비스
				lottecard_payment('ALP'); 
			}else if (pay_confirm_type == "99"){ // 다른결재방식 선택
				lottecard_payment(''); 
			}
		} else if ( X_CARDTYPE == paytype_card_029
			|| X_CARDTYPE == paytype_card_031
			|| X_CARDTYPE == paytype_card_048
			|| X_CARDTYPE == paytype_card_018
				) { // MPI (NH, 신한, 삼성, 현대)

			window.scrollTo(0, 0); // 안심레이어 위치 지정

			// 현대/신한/삼성 결제 인증 구분
			if (iscmcd!=paytype_card_018){
				if ( pay_confirm_type == "01" ){ // 스마트페이(간편결제)
					$("#frm_send input[name=smart_pay_use_yn]").val("Y");
					$("#frm_card input[name=X_SP_CHAIN_CODE]:hidden").val("1");
				}else if (pay_confirm_type == "03"){ // 앱카드
					$("#frm_card input[name=X_SP_CHAIN_CODE]:hidden").val("3");
				}else{ // 안심결제
					$("#frm_card input[name=X_SP_CHAIN_CODE]:hidden").val("0");
				}
			}

			xmpi_exec(); // xmpi 실행
		} else if (X_CARDTYPE == paytype_card_016
					&& (cp_udid==''
					|| (cp_udid!='' && varUa > -1 && cp_schema=='mlotte001' && appVerChk(cp_v, '169'))
					|| (cp_udid!='' && varUa < 0 && ua_lower_str.search("iphone") > -1 && appVerChk(cp_v, '136'))
					|| (cp_udid!='' && varUa < 0 && ua_lower_str.search("ipad") > -1 && appVerChk(cp_v, '127'))
					|| smart_pic_app_yn=='Y'
					|| ellotte_app_yn=='Y'
					|| cp_schema=='sklotte001'
						)
				){
			payment_pop_position(); // 결제 레이어팝업 위치 지정

			$("#ANSIM_LAYER").css("width"	,"350px");
			$("#ANSIM_LAYER").css("height"	,"530px");
			window.scrollTo(0, 0); // 안심레이어 위치 지정
			$("#ANSIM_LAYER").show();
			$("#X_ANSIM_FRAME").show();

			spay_exec(); // spay 실행 (KBApp Card)
		} else if (X_CARDTYPE == paytype_card_016
			|| X_CARDTYPE == paytype_card_021
			|| X_CARDTYPE == paytype_card_054
			|| X_CARDTYPE == paytype_card_002
			) { // mISP (KB국민, 비씨, 우체국체크, 광주)

			if (confirm("국민,광주,우체국체크카드(ISP) 결제는 3G 또는 LTE로 진행 해야 안정적으로 결제하실 수 있습니다.\n결제를 진행하시겠습니까?")){
				$("#frm_send input[name=credit_crd_gb]:hidden").val("1"); // ISP

				misp_create_data();
				}else{
					disableItems(false);
				}
		} else if (X_CARDTYPE == paytype_card_026) {
			$("#frm_send input[name=credit_crd_gb]:hidden").val("1"); // ISP
			misp_create_data();
		} else if (X_CARDTYPE == paytype_card_020){ // 하나SK
			$("#frm_send input[name=credit_crd_gb]:hidden").val("2"); // MPI

			hanaskcard_payment();
		} else if (X_CARDTYPE == paytype_card_036 || X_CARDTYPE == paytype_card_008) { // ilkMPI (씨티, 외환)
			$("#frm_send input[name=credit_crd_gb]:hidden").val("2"); // MPI

			ilkmpi_send();
		}
		//--------------------------------------------------------
		// X-안심클릭 서비스 관련 스크립트 End
		//--------------------------------------------------------
		else {
			// 그외 방법....
			//alert('Xansim, Visa3D, ISP 이외의 방식을 사용하는 카드입니다.');
			disableItems(false);

			alert("지원되지 않는 카드 입니다.\n다시 시도해 주십시오.");
		}

	} else if ( paytype == PAYTYPE_CODE_BANK ) {	// 결제 수단이 인터넷뱅킹
		bankno			= $("#frm_send input[name=bankno]:hidden").val();
		onlineacctname	= $("#frm_send input[name=onlineacctname]:hidden").val();

		if ( $.trim(bankno) == ''
			|| $.trim(onlineacctname) == '' )
		{
			disableItems(false);
			alert('무통장 입금 정보가 부정확합니다.\n다시 시도해 주십시오.');
		} else {
			$("#frm_send").attr("action","/order/order_complete.do?" + __commonParam);
			doPayment();
		}
	} else if ( paytype == PAYTYPE_CODE_PHONE ) {	// 결제 수단이 휴대폰결제
		//$("#frm_send").attr("action","/order/cellphone_confirm.do?" + __commonParam);
		//doPayment();
		payment_pop_position(); // 결제 레이어팝업 위치 지정

		$("#ANSIM_LAYER").css("width"	,"380px");
		$("#ANSIM_LAYER").css("height"	,"800px");
		window.scrollTo(0, 0); // 안심레이어 위치 지정
		$("#ANSIM_LAYER").show();
		$("#X_ANSIM_FRAME").show();

		cellphone_exec(); // 휴대폰 소액결제 실행
	} else if ( (paytype != PAYTYPE_CODE_CARD && paytype != PAYTYPE_CODE_LPAY) && (cardkndcd!='' || cardkndcd_dup!='')) {	// 카드결제 아니면서 카드할인/적립을 선택한 경우
		disableItems(false);
		alert("카드외 다른 결제방법 사용 시 카드할인 및 적립을 할 수 없습니다.");
	} else if ( paytype == '' &&  pay_mean_cd != '') {	// 주결제 수단 없이 아닌 포인트로 모두 결제 시
		if( pay_mean_cd.indexOf(ltPoint) != -1 && $("#frm_send input[name=lt_cd_no]").val() == ""){
			//alert("포인트로 모두 결제 시 1");
			disableItems(false);
			$("html, body").animate({
				scrollTop: $("#submit_btn").offset().top
			}, function(){ $("#laver_Lpay_order").show(); });
		} else {
			//alert("포인트로 모두 결제 시 2");
			$("#frm_send").attr("action","/order/order_complete.do?" + __commonParam);
			doPayment();
		}
	} else {
		disableItems(false);
		alert("지원되지 않는 결제방법 입니다.\n다시 시도해 주십시오.");
	}
}

	 function openLotteMembers(){
		alert('롯데멤버스 페이지로 이동합니다.\n비밀번호를 설정하시면\n롯데닷컴에서 L.POINT를 사용하실 수 있습니다.');
		var url = "m.lpoint.com/app/point/WMPA100100.do";
				if(cp_schema != ""){  //app일경우
					if(isIOS){ //아이폰일경우
							window.location="family://"+url;
					}else if(isAndroid){ //안드로이드일경우
					window.myJs.callAndroid("https://"+url);
				}
				}else{
				window.open("https://"+url);
			}
		}

 function make_certification(){
		//confirm_end(); // local 테스트용.

	 //console.log("make_certification");

		if( $("input[name=third_coupon]:radio:checked").val() == '0' ){
			alert("일시불 할인은 L.POINT, L-money와 함께 사용할 수 없습니다.");
			return;
		}

		var card_no1 ;
		var card_no2 ;
		var card_no3 ;
		var card_no4 ;
		var passwd   ;
		passwd   = $("#card_passwd").val();

		if (passwd.length < 1){
			alert("카드 비밀번호를 입력해 주세요.");
			return;
		}
		var card_no = card_no1+card_no2+card_no3+card_no4;

		$.ajax({
			type: 'post'
			, async: false
			, url: '/popup/lotte_point_mng.do?' + __commonParam
			, data: 'card_no='+card_no+'&passwd='+passwd+'&from_page=' + from_page + '&page_div=R&proc_div=P'
			, success: function(response) {
				$("#LottePoint_Result_div").html(response);

				if($("#temp_lt_point_amt").val() != "" && $("#temp_lt_point_amt").val() != "0"){
				$("#lt_point_amt").val($("#temp_lt_point_amt").val());
				fn_calcTotalPrice();
				}
			}
		});
	 }

// 2011.05.20 포인트 관련 함수 추가
function fn_selPoint(obj) {

	var obj_id = obj.id;
	setCashReceiptArea(); // 현금영수증 영역 컨트롤

	if (obj.checked){
		var totsttlamt = parseInt($("#frm_inp input[name=totsttlamt]:hidden").val());
		var useable_amt = 0;

		if (totsttlamt == 0) // 결제금액이 없는데  선택 할 경우
		{
			obj.checked=false;
			return;
		}

		if (obj_id=='chk_lpoint'){ // L_포인트
			$("#cash_receipts").show(); // 현금영수증 영역 보이기

			useable_amt = parseInt($("#useable_lpoint_amt").val());
			//useable_amt = (Math.floor(useable_amt/10)) * 10; // 10원이하 절사

			$("#lpoint_amt").val((totsttlamt<useable_amt?totsttlamt:useable_amt));
			$("#lpoint_amt").attr("disabled", false);
			$("#chk_lpoint_all").attr("disabled", false);
			$("#chk_lpoint_all").attr("checked", true);
			$("#chk_lpoint_all").prop("checked", true);
			//sendTclick('order_Clk_Btn_2');

		}else if (obj_id == 'chk_lt_point'){ // 롯데포인트
			useable_amt = parseInt($("#useable_lt_point_amt").val());
			//useable_amt = (Math.floor(useable_amt/10)) * 10; // 10원이하 절사

//				if(ltPointCert == "N"){
//					$("#chk_lt_point").attr("checked", false); // L-포인트
//					$("#useLottePoint").show();
//					return;
//				}

			if($("#temp_lt_point_amt").val() != "" && $("#temp_lt_point_amt").val() != "0"){
				$("#lt_point_amt").val($("#temp_lt_point_amt").val());
			} else {
				$("#lt_point_amt").val((totsttlamt<useable_amt?totsttlamt:useable_amt));
			}

			$("#lt_point_amt").attr("disabled", false);
			$("#chk_lt_point_all").attr("disabled", false);
			$("#chk_lt_point_all").attr("checked", true);
			$("#chk_lt_point_all").prop("checked", true);
			//sendTclick('order_Clk_Btn_3');

		}
		else if(obj_id == 'chk_deposit_all') { // 보관금
			//sendTclick('order_Clk_Btn_4');
		}
	}else{
		if (obj_id=='chk_lpoint'){ // L_포인트
			fn_initPointList(lPoint);
		}else if (obj_id == 'chk_lt_point'){
			fn_initPointList(ltPoint);
		}
/*			else if (obj_id == 'chk_soil_point'){
			fn_initPointList(soilPoint);
		}*/
	}
	fn_calcTotalPrice();

	// 보관금이 존재하고 체크 해제 할 경우
	if (!obj.checked && $("#chk_deposit_all").attr("id")!=undefined){
		fn_selPointAll(document.getElementById("chk_deposit_all"));
	}

	pointUse();
	paycardinstmon();
}

// 2011.05.20 포인트 선택에 따른 금액 변경
function fn_calcTotalPrice(){
	var totalPriceHtml = "";

	// TODO : 결제금액 계산 후 UI 구현
	prommdclcd = $("#frm_send input[name=prommdclcd]").val();
	dcamt = $("#frm_send input[name=totdcamt]").val(); //1차 쿠폰
	dup_cpn_amt = $("#frm_send input[name=totdcamt_dup]").val(); // 2차중복쿠폰
	third_cpn_amt = $("#frm_send input[name=totdcamt_third]").val(); // 3차쿠폰
	prommdclcd_third = $("#frm_send input[name=prommdclcd_third]").val();
	cardkndcd = $("#frm_send input[name=cardkndcd]").val();
	payamt	 = $("#frm_inp input[name=defaulttotsttlamt]:hidden").val(); // 배송비가 합쳐 있는 금액
	includeSaveInstCpn = $("#frm_send input[name=includeSaveInstCpn]").val(); // 2011.05.19 적립여부
	var qs_yn = $("#frm_send input[name=qs_yn]:hidden").val(); //퀵배송정보

	lpoint_amt      = ($("#lpoint_amt").prop("id")==undefined?"":(($("#lpoint_amt").val()).length<1?0:$("#lpoint_amt").val())); // L_포인트
	lt_point_amt    = ($("#lt_point_amt").prop("id")==undefined?"":(($("#lt_point_amt").val()).length<1?0:$("#lt_point_amt").val())); // 롯데포인트
	deposit_amt     = ($("#deposit_amt").prop("id") ==undefined?"":(($("#deposit_amt").val() ).length<1?0:$("#deposit_amt").val())); // 보관금
//		soil_point_amt  = ($("#soil_point_amt").prop("id")==undefined?"":(($("#soil_point_amt").val()).length<1?0:$("#soil_point_amt").val())); // S-oil포인트
	dlv_prom_use_yn = $("#dlv_prom_use_yn").val(); // 무료배송권 사용 여부
	dlv_fvr_val = (dlv_prom_use_yn=="Y"?$("#dlv_fvr_val").val():"0"); // 무료배송권 금액

	
	tot_deli_amt = 0; // 총배송비

	if (freeShippingYn=='N'){ // 플래티넘 플러스가 아니면
		if ($("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")){ // 다중배송여부
			tot_deli_amt = $("#frm_inp input[name=caltotdeliamt]:hidden").val(); // 계산된 총배송비
		}else{
			tot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
		}
	}else{
		/**********************************************
		 * 퀵배송추가 배송비 S
		***********************************************/
		if(qs_yn == "Y"){
			tot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
		}
		/**********************************************
		 * 퀵배송추가 배송비 E
		***********************************************/
	}

	// 할인 인 경우만 금액 차감
	if(includeSaveInstCpn=='Y'){
		totpayamt	= payamt.toString();
	}else{
		totpayamt	= (payamt - dcamt).toString();
	}

	// 배송비 적용
	if (freeShippingYn  =='N'){ // 플래티넘 플러스가 아니면
		totpayamt   = (parseInt(totpayamt) + parseInt(tot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
	}else{

		/**********************************************
		 * 퀵배송추가 배송비 S
		***********************************************/
		if(qs_yn == "Y"){
			totpayamt   = (parseInt(totpayamt) + parseInt(tot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
		}
		/**********************************************
		 * 퀵배송추가 배송비 E
		***********************************************/
	}

	/**********************************************
	 * 퀵배송추가 배송비 S 총주문금액(배송비미포함), 배송비, 할인금액, 총결제금액
	***********************************************/
	
	if(qs_yn == "Y"){
		var all_dc_amt = Number(dcamt) + Number(dup_cpn_amt) + Number(third_cpn_amt);
		totpayamt =  fn_quicDeliAmtChk(totOrdAmt, tot_deli_amt, all_dc_amt, totpayamt);
		dlv_prom_use_yn = 'N';		
	}else{
		//무료배송권은 퀵배송에서는 사용못함
		// 무료배송권 사용 시
		if (dlv_prom_use_yn=="Y" && dlv_fvr_val > 0 && tot_deli_amt > 0){			
			totpayamt   = (totpayamt - dlv_fvr_val).toString();			
		}else if(dlv_prom_use_yn=="Y" && dlv_fvr_val > 0 && tot_deli_amt == 0){
			dlv_prom_use_yn = 'N';
			$("#dlv_prom_use_yn").val("N"); // 무료배송권 사용 여부
		}
	}
	
	// 참좋은혜택 합계 계산
	var totOrdAmt = totpayamt;
	if(includeSaveInstCpn != 'Y'){
		totOrdAmt = Number(totOrdAmt) + Number(dcamt);
	}
	$("#bene_tot_amt").find("span").text( String(totOrdAmt).money() + "원" );
	$("#frm_inp input[name=totordamt]:hidden").val(totOrdAmt);


	// 중복쿠폰 사용
	if (dup_cpn_amt > 0){
		totpayamt	= (totpayamt - dup_cpn_amt).toString();
	}

	// 3차쿠폰 사용
	if (third_cpn_amt > 0){
		totpayamt	= (totpayamt - third_cpn_amt).toString();
	}


	/**********************************************
	 * 퀵배송추가 배송비 E
	***********************************************/

	// L_포인트 사용 시
	if (lpoint_amt > 0){
		totpayamt   = (totpayamt - lpoint_amt).toString();
	}

	// 롯데_포인트 사용 시
	if (lt_point_amt > 0){
		totpayamt   = (totpayamt - lt_point_amt).toString();
	}

	// 보관금 사용 시
	if (deposit_amt > 0){
		totpayamt   = (totpayamt - deposit_amt).toString();
	}

	// soil_포인트 사용 시
/*		if (soil_point_amt > 0){
		totpayamt   = (totpayamt - soil_point_amt).toString();
	}
*/
	prommdclcdNm = "";
	if(prommdclcd==adtn_cost_dtl_sct_cd_card){

		if (cardkndcd==paytype_card_002){
			prommdclcdNm = "광주";
		}else if (cardkndcd==paytype_card_008){
			prommdclcdNm = "외환";
		}else if (cardkndcd==paytype_card_016){
			prommdclcdNm = "KB국민";
		}else if (cardkndcd==paytype_card_018){
			prommdclcdNm = "NH";
		}else if (cardkndcd==paytype_card_021){
			prommdclcdNm = "우리";
		}else if (cardkndcd==paytype_card_020){
			prommdclcdNm = "하나SK";
		}else if (cardkndcd==paytype_card_026){
			prommdclcdNm = "비씨";
		}else if (cardkndcd==paytype_card_029){
			prommdclcdNm = "신한";
		}else if (cardkndcd==paytype_card_031){
			prommdclcdNm = "삼성";
		}else if (cardkndcd==paytype_card_036){
			prommdclcdNm = "씨티";
		}else if (cardkndcd==paytype_card_047){
			prommdclcdNm = "롯데";
		}else if (cardkndcd==paytype_card_048){
			prommdclcdNm = "현대";
		}else if (cardkndcd==paytype_card_054){
			prommdclcdNm = "우체국체크";
		}
		prommdclcdNm += "카드할인";
	}else if(prommdclcd==adtn_cost_dtl_sct_cd_coupon){
		prommdclcdNm = "즉석쿠폰";
	}else if(prommdclcd==adtn_cost_dtl_sct_cd_staff){
		prommdclcdNm = "임직원할인";
	}else if(prommdclcd==adtn_cost_dtl_sct_cd_mrktng_cpn){
		prommdclcdNm = "쿠폰/쇼핑지원권";
	}

	// 배송비 적용 
	$("#deli_amt_ul").show();
	$("#deli_amt_ul li").filter(".pr_text2").text(new String(tot_deli_amt).money()+"원");

	// 2014.12.24 모바일주문간소화 jjkim59
	var discountSum = 0;
	var pointSum = 0;

	// 할인 쿠폰 정보
	if ( dcamt > 0 && includeSaveInstCpn=='N') {	// 할인금액만 체크하고 카드구분코드는 null 일 수도 있고 not null 일수도 있기때문에 조건에서 제거.
		discountSum += parseInt(dcamt);
	}

	// 중복 쿠폰 정보
	if ( dup_cpn_amt > 0 ){
		discountSum += parseInt(dup_cpn_amt);
	}

	// 3차 쿠폰 정보
	if ( third_cpn_amt > 0 ){
		discountSum += parseInt(third_cpn_amt);
	}

	
	// 무료배송권
	if (dlv_prom_use_yn=="Y" && dlv_fvr_val > 0 && tot_deli_amt > 0){
		discountSum += parseInt(dlv_fvr_val);
		$("#fdAmt").html( "(<span class=tBold>-" + String(dlv_fvr_val).money() + "</span><span class=\"no_bold\">원</span>)" );
	}
	else {
		$("#fdAmt").html( "" );
	}

	// 최대할인 적용 금액 setting
	if(maxdc_yn == "Y"){
		if(includeSaveInstCpn == "Y"){
			$("#max_bene_dctot_amt").html(String(Number(dcamt) + Number(discountSum)).money());
		}else{
			$("#max_bene_dctot_amt").html(String(Number(discountSum)).money());
		}
	}

	// 선택한 할인 금액 setting
	if(includeSaveInstCpn == "Y"){
		$("#bene_dctot_amt").html(String(Number(dcamt) + Number(discountSum)).money());
	}else{
		$("#bene_dctot_amt").html(String(Number(discountSum)).money());
	}

	if($("#bene_dctot_amt").text() == $("#max_bene_dctot_amt").text()){
		$("#max_slae_dlv").removeClass("type2");
		$("#select_sale_div").addClass("type2");
		$("#select_sale_div").hide();
	}else{
		$("#select_sale_div").removeClass("type2");
		$("#max_slae_dlv").addClass("type2");
		$("#select_sale_div").show();
	}
	
	//할인 금액 셋팅
	var discountHTML = discountSum.toString().money();
	$("#discount").html(discountHTML);
	//문구 보여주기
	if(Number(discountSum) > 0){
		$("#discount_p").show();
	}else{
		$("#discount_p").hide();
	}
	//? 숨기기 보여주기
	var totRsrvAplyVal = $("#frm_send input[name=totRsrvAplyVal]").val(); // 상품적립금
	var add_val = ord_pnt_rsrv_yn == 'Y' ? Number('10') : Number('0');		
	if(Number(discountSum) > 0 || Number(totRsrvAplyVal) > 0 || ord_pnt_rsrv_yn == 'Y' ){				
		$("#pay_notice").removeClass("off");		
	}else{		
		$("#pay_notice").addClass("off");
	}
	

	// 할인 인 경우만 금액 차감
	//$("#lottepointSave").empty();
	//setLottePointSaveDiv(dcamt);

	// 총결제 금액이 0이 되어 버리면 결제수단 보이지 않도록 && 포인트단일결제 L-money/L.POINT 아닐 경우
	if (totpayamt == 0 && ( typeof($("#pntOnlyPay").val()) == undefined || $("#pntOnlyPay").val() == '' || $("#pntOnlyPay").val() == 'N'))
	{
		$("#div_paytype_void").hide(); // 흰색영역 비노출 처리 20160218
		$("#div_paytype #pay_method").hide();
		$("#div_paytype #pay_card").hide();
		$("#div_paytype #pay_bank").hide();
		$("#h3_paytype_title").hide();
		$("#payment_method_next_use").hide();
		$(".slide_wrap").hide();
		$("#eventcardsale_cont").hide();
		$("#eventcard_cont").hide();
		$("#eventcardsaleamt_cont").hide();
	}
	else
	{
		$("#div_paytype_void").show(); // 흰색영역 비노출 처리 20160218
		$("#div_paytype #pay_method").show();
		if ( $("#frm_inp input[name=rdo_paytype]:radio:checked").val() == paytype_code_card || $("#frm_inp input[name=rdo_paytype]:radio:checked").val() == paytype_code_lpay ) {
			$("#div_paytype #pay_card").show();
		} else if ( $("#frm_inp input[name=rdo_paytype]:radio:checked").val() == paytype_code_bank ) {
			$("#div_paytype #pay_bank").show();
		}
		$("#h3_paytype_title").show();
		$("#payment_method_next_use").show();
		$(".slide_wrap").show();
		if($("#eventcardsale_cont").text() != ''){
			$("#eventcardsale_cont").show();
		}
		if($("#eventcard_cont").text() != ''){
			$("#eventcard_cont").show();
		}
		if($("#eventcardsaleamt_cont").text() != ''){
			$("#eventcardsaleamt_cont").show();
		}
	}
	$("#submit_btn").show();

	$("#totalprice").html(totpayamt.money());
	$("#frm_inp input[name=totsttlamt]:hidden").val(totpayamt);
	
	
	var ordDlvInfo = "";
	if(freeShippingYn == "Y"){
		ordDlvInfo = "(배송비무료)";		
	}else if($("#frm_inp input[name=orgtotdeliamt]:hidden").val() > 0 ){
		ordDlvInfo = "(배송비포함)";
	}else{
		ordDlvInfo = "(배송비무료)";		
	}
	
	$("#ordDlvInfo").text(ordDlvInfo);

	// 청구할인
	if ('Y' == claim_sale_yn){
		var claim_sale_fvr_val = ($("#frm_inp input[name=claim_sale_fvr_val]:hidden").val()==''?'0':$("#frm_inp input[name=claim_sale_fvr_val]:hidden").val());
		var maxamt = $("#frm_inp input[name=claim_sale_card_max_amt]:hidden").val();
		var claim_sale_aply_lmt_amt = (claim_sale_aply_lmt_amt==''?'0':claim_sale_aply_lmt_amt);
		var paytype = $("#frm_inp input[name=paytype]:hidden").val();
		//20160127
		var cpcnFlag = cp_cn != '138425' && cp_cn != '137725' && cp_cn != '156230';

		var clm_sale_prc = 	parseInt(totpayamt) - (parseInt(totpayamt) * parseInt(claim_sale_fvr_val) * 0.01);
		var claim_sale_price = Math.floor(clm_sale_prc * 0.1) * 10;
		//최대할인금액체크
		if(parseInt(maxamt) < (parseInt(totpayamt) - parseInt(clm_sale_prc))){
			claim_sale_price = parseInt(totpayamt) - parseInt(maxamt);
		}

		if(cpcnFlag){
			$("#eventcardsaleamt_cont").html("청구할인가 " + String(claim_sale_price).money() + "원 예상"); // 청구 할인 금액
						$("#eventcardsaleamt_cont").show();
						$("#claim_sale_price").html(String(claim_sale_price).money() + "원");
				}else{					
					$("#eventcardsaleamt_cont").hide();
					$("#claim_sale_price").html("");
				}
		if (parseInt(totpayamt) >= parseInt(claim_sale_aply_lmt_amt)
		 && $("#frm_inp select[name=iscmcd]").val() == claim_sale_card_knd_cd
		 && (paytype == PAYTYPE_CODE_CARD || paytype == PAYTYPE_CODE_LPAY) && parseInt(totpayamt) > 0){
			//20160127   청구할인 구간대 설정
			if(cpcnFlag){ fn_formshow();}
		}else{
			//20160127
			if(cpcnFlag){ fn_formshow();}
		}
	}
	pointUse();
	fn_all_dc();
}

// dcamt : 적립쿠폰 적립금
function setLottePointSaveDiv(dcamt){
	var lottepointSaveHtml = "";
	try {
		var totRsrvAplyVal = $("#frm_send input[name=totRsrvAplyVal]").val(); // 상품적립금
		if( $("#frm_send input[name=includeSaveInstCpn]").val() != 'Y' ){ // 할인선택값에 대한 적립여부 체크
			dcamt = 0;
		}

		if( Number(totRsrvAplyVal) > 0 ){

			if ($("select[name='coupon']").val() == "0" && $("#frm_send input[name=prommdclcd]").val() == "27") {
				$("#lottepointSave").html('<li class="list_depth2 lpoint"><p class="left">적립 L.POINT</p><p class="right">임직원할인 이용 시 적립 대상 제외</p></li>');
			}
			else {
				lottepointSaveHtml = '<li class="list_depth2 lpoint"><p class="left">적립 L.POINT</p><p class="right">'+new String(Number(totRsrvAplyVal)).money()+'점 예정</p></li>'
									 + '<li class="list_depth2 lpoint2"><p class="left">(롯데포인트플러스카드 시</p><p class="right">'+new String(Number(totRsrvAplyVal)*2).money()+'점 예정)</p></li>';
				$("#lottepointSave").html(lottepointSaveHtml);

			}
		}else {
			//$("#lottepointSave").hide();
			//$("#li_lottepointSave").hide();
		}
	}
	catch(e){}
}

// 포인트 관련 Element 값 초기화
function fn_initPointList(point_div){
	if (point_div == "ALL" || point_div == lPoint){
		$("#lpoint_amt").val("");
		$("#old_lpoint_amt").val("");
		$("#lpoint_amt").attr("disabled", true);
		$("#chk_lpoint_all").attr("checked", false);
		$("#chk_lpoint_all").prop("checked", false);
		$("#chk_lpoint_all").attr("disabled", true);
	}

	if (point_div == "ALL" || point_div == ltPoint){
		$("#lt_point_amt").val("");
		$("#old_lt_point_amt").val("");
		$("#temp_lt_point_amt").val("");
		$("#lt_point_amt").attr("disabled", true);
		$("#chk_lt_point_all").attr("checked", false);
		$("#chk_lt_point_all").prop("checked", false);
		$("#chk_lt_point_all").attr("disabled", true);
	}

	if (point_div == "ALL" || point_div == deposit){
		$("#deposit_amt").val("");
		$("#old_deposit_amt").val("");
	}
}

// 2011.05.30 휴대폰 인증
function cellphone_confirm(){
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	if(parseInt(totsttlamt) > 500000) {
		alert("휴대폰 결제는 월 50만원까지 결제 가능합니다.");
		return false;
	}
	if(parseInt(totsttlamt) + parseInt(curMonPhnSttlAmt) > 500000) {
		alert("휴대폰 결제는 월 50만원까지 결제 가능합니다.(잔여한도:"+ (500000-parseInt(curMonPhnSttlAmt)) +")");
		return false;
	}
	return true;
}

// misp 플러그인 설치
function misp_install(){
	// 안드로이드, 아이폰 구별에 따른 ISP Application  호출
	if (isAndroid){
		if ('Y' == tstore_yn){ // T-store 인 경우
			$("#X_ANSIM_FRAME").attr("src", "tstore://PRODUCT_VIEW/0000025711/0");
		}else{
			$("#X_ANSIM_FRAME").attr("src", "http://mobile.vpay.co.kr/jsp/MISP/andown.jsp");
		}
	}else if (isIOS){
		$("#X_ANSIM_FRAME").attr("src", "http://itunes.apple.com/kr/app/id369125087?mt=8");
	}else{
		alert("지원되지 않는 운영체제 입니다.");
	}
}

// misp 실행
function misp_exec(){
	// 안드로이드, 아이폰 구별에 따른 ISP Application  호출
	if (isIOS){ // IOS
		var before = new Date();
		setTimeout(function() {
			if (new Date() - before < 3000) {
				window.location.href = "http://itunes.apple.com/kr/app/id369125087?mt=8";
			}
		}, 1500);
		//$("#X_ANSIM_FRAME").attr("src", "ispmobile://?TID="+$("#frm_send input[name=MISP_TID]:hidden").val());
		top.location.href = "ispmobile://?TID="+$("#frm_send input[name=MISP_TID]:hidden").val();
	}else if (isAndroid){ // 안드로이드
		window.location.href = "intent://TID="+$("#frm_send input[name=MISP_TID]:hidden").val()+"#Intent;scheme=ispmobile;package=kvp.jjy.MispAndroid320;end";
	}else{
		alert("지원되지 않는 운영체제 입니다.");
	}
}

// misp 자료 전송
function misp_send(){
	$("#frm_send").attr("action", "/misp/toTransData.jsp");
	$("#frm_send").attr("method", "post");
	$("#frm_send").attr("target", "X_ANSIM_FRAME");

	$("#frm_send").submit();
}

// misp 정보 셋팅 후 misp 전송 페이지 호출
function misp_create_data(){
	iscmcd = $("#frm_send input[name=iscmcd]:hidden").val();
	if( "Y" == grockle_yn ){
		phone_num1 = $("#frm_inp [name=grockle_cell1]:enabled").val();
		phone_num2 = $("#frm_inp input[name=grockle_cell2]").val();
		phone_num3 = $("#frm_inp input[name=grockle_cell3]").val();
		companyCd = "SKT"; // 기본값 전달
		grockle_mbr_no = $("#frm_send input[name=grockle_mbr_no]:hidden").val(); // 비회원번호
	}
	else {
		phone_num1 = phone_no1;
		phone_num2 = phone_no2;
		phone_num3 = phone_no3;
		companyCd = commid;
		grockle_mbr_no = "";
	}
	cardinst = $("#frm_send input[name=cardinst]:hidden").val();
	cardinstmon = $("#frm_send input[name=cardinstmon]:hidden").val();
	totsttlamt = $("#frm_send input[name=totsttlamt]:hidden").val();
	goodsnm = $("#frm_send input[name=goodsnm]:hidden").val().replace(/'/gi, "").replace(/&/gi, "").replace(/=/gi, "").replace(/%/gi, "");
	goodsnm = encodeURIComponent(goodsnm);

	$.ajax({
		type: 'post'
		, async: false
		, url: '/order/misp_confirm.do?' + __commonParam
		, data: 'iscmcd='+iscmcd+'&companyCd='+companyCd+'&cardinst='+cardinst+'&cardinstmon='+cardinstmon+'&phone_num1='+phone_num1+'&phone_num2='+phone_num2+'&phone_num3='+phone_num3+'&totsttlamt='+totsttlamt+'&goodsnm='+goodsnm+'&grockle_yn=' + grockle_yn + '&grockle_mbr_no='+grockle_mbr_no
		, success: function(response) {
			$("#cover").off('click');
					$("#cover").on('click',function(){
						$(this).hide();
					});
			$("#misp_confirm_div").html( response );
			misp_send();
			}
		, error : init_misp()
	});
}

// misp 정보 초기화
function init_misp(){
	$("#frm_send input[name=KVP_NOINT]:hidden").val("");
	$("#frm_send input[name=KVP_QUOTA]:hidden").val("");
	$("#frm_send input[name=KVP_GOODNAME]:hidden").val("");
	$("#frm_send input[name=KVP_PRICE]:hidden").val("");
	$("#frm_send input[name=KVP_NOINT_INF]:hidden").val("");
	$("#frm_send input[name=KVP_QUOTA_INF]:hidden").val("");
	$("#frm_send input[name=MISP_GoodName]:hidden").val("");
	$("#frm_send input[name=MISP_Price]:hidden").val("");
	$("#frm_send input[name=MISP_NoInt]:hidden").val("");
	$("#frm_send input[name=MISP_Noint_Inf]:hidden").val("");
	$("#frm_send input[name=MISP_HpNum]:hidden").val("");
	$("#frm_send input[name=MISP_MerchantNo]:hidden").val("");
	$("#frm_send input[name=MISP_Tcode]:hidden").val("");
	$("#frm_send input[name=MISP_TID]:hidden").val("");
}

// ilkmpi 정보 셋팅 후 ilkmpi
function ilkmpi_send(){

	iscmcd = $("#frm_send input[name=iscmcd]:hidden").val();
	pan = "";

	//cardinst = $("#frm_send input[name=cardinst]:hidden").val(); // 일시, 할부 여부
	apvl_halbu = $("#frm_send input[name=cardinstmon]:hidden").val(); // 할부개월
	pay_ansim_price = $("#frm_send input[name=totsttlamt]:hidden").val(); //결제금액
	handNum = phone_no1 + phone_no2 + phone_no3;

	if (handNum.length < 10){
		handNum = "00000000000";
	}

	if (iscmcd == paytype_card_008) { // KEB
		pan = "4599300000000000";
	} else if (iscmcd == paytype_card_036) { // Citi Mobile
		pan = "4539350000000007";
	}

	$("#ILKFORM input[name=apvl_halbu]:hidden").val(apvl_halbu);
	$("#ILKFORM input[name=pay_ansim_price]:hidden").val(pay_ansim_price);
	$("#ILKFORM input[name=handNum]:hidden").val(handNum);
	$("#ILKFORM input[name=purchase_amount]:hidden").val(pay_ansim_price);
	$("#ILKFORM input[name=pan]:hidden").val(pan);

	$("#ILKFORM").submit();
}

// 스마트페이 신청/수정 화면으로 이동
function go_smartpay(){
	self.location.href = __sslDomain + "/mylotte/smartpay/smartpay.do?" + __commonParam + "&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
}

// 제휴 포인트 사용하기
function alliancePointUse(point_div){ // L:롯데포인트, S:에스오일포인트
	if (point_div=="L"){ // 롯데포인트

		//$( '#cover' ).css({ 'display' : 'block', 'height' : '100%', 'top' : 0 });
		//window.scrollTo(0, $("#container").offset().top); // 레이어 위치 지정

		//$("#CONFIRM_FRAME").attr("src", "/popup/lotte_point_mng.do?" + __commonParam + "&page_div=F&from_page=of");
		//$("#CONFIRM_LAYER").css("width" , "100%");
		//$("#CONFIRM_LAYER").css("height", "100%");
		//$("#CONFIRM_LAYER").show();
		//$("#CONFIRM_FRAME").show();

	}
	disableItems(true);
}

// 비회원약관 관련
function showGrockleDiv(divName){
	var divObj = $("#"+divName);
	var display = divObj.css("display");

	if (display=="block"){
		divObj.css("display", "none");
	}else{
		divObj.css("display", "block");
	}
}
// 비회원 본인인증
function oneselfCheck(){
	$( '#cover' ).css({ 'display' : 'block', 'height' : '100%', 'top' : 0 });
	window.scrollTo(0, $("#container").offset().top); // 레이어 위치 지정
	//$("#container").hide();
	$("#CONFIRM_FRAME").attr("src","/popup/oneself_certification_form.do?" + __commonParam + "&name="+$("#grockle_name").val());
	$("#CONFIRM_LAYER").css("width"	, "100%");
	$("#CONFIRM_LAYER").css("height", "100%");
	$("#CONFIRM_LAYER").show();
	$("#CONFIRM_FRAME").show();

	disableItems(true);
}

// 계좌번호 숫자 체크
function acthChkNum(obj) {
	var filter = /^[0-9]+$/;
	var keyCode = event.keyCode;
	var sKey = String.fromCharCode(keyCode);
	var re = new RegExp(filter);

	if (keyCode!=8 && keyCode!=46){ // Backspace, Del
		if(!re.test(sKey)) {
			event.returnValue=false;
		}
	}
}

// 현금영수증 관련 자리 이동
function nextElement(obj){
	if( varUa > -1 ){ // 안드로이드만 적용 (아이폰 스크립트 먹지 않음)
		var max_length = $(obj).attr("maxlength");
		var obj_val = $(obj).val();
		var input_nm = "";

		if ($(obj).attr("name") == "cr_issu_mean_no_phone2"){
			input_nm = "cr_issu_mean_no_phone3";
		}else{
			input_nm = $(obj).next('input').attr("name");
		}

		if (obj_val.length == max_length){
			$("#frm_inp input[name="+input_nm+"]").focus();
		}
	}
}

// 현금영수증 영역 컨트롤
function setCashReceiptArea(){
	var pay_type = "";
	var chk_lpoint = $("#chk_lpoint").prop("checked");
	var chk_deposit_all = $("#chk_deposit_all").prop("checked");

	if ($("#frm_inp input[name=rdo_paytype]:radio").length > 0){
		pay_type = $("#frm_inp input[name=rdo_paytype]:radio:checked").val();
	}else{
		pay_type = $("#frm_inp input[name=paytype]:hidden").val();
	}

	// 결제수단이 무통장입금이 아니고 L-money 사용하지 않고 보관금을 사용하지 않는 경우
	if (pay_type != PAYTYPE_CODE_BANK && !chk_lpoint && !chk_deposit_all){
		$("#cash_receipts").hide(); // 현금영수증 영역 가리기
		$("#pers_value span > input").val(""); // 소득공제 정보 지우기
		$("#co_value p > input").val(""); // 지출증빙용 정보 지우기
	}else{
		$("#cash_receipts").show(); // 현금영수증 영역 보이기
		setCellNo();
	}
}

function navback() {		//주문서페이지에서 이전버튼 클릭시 상품상세페이지로 가도록 수정  기존 : 원앤원 > 선물페이지 > 주문서
	if ( history.length > 0 ) {
		history.go(-2);
	} else {
		alert('이전페이지가 존재하지 않습니다.');
	}
}

// 중복배송 함수 Start
function show_multi_deli_area(idx){
	var ord_qty = 0;

	deli_init(); // 중복 배송지 초기화

	// 상품선택n , 보낼 상품 선택하기 영역 노출여부
	if (idx > 1){
		$("#deli_1_amt_area").show();
		for(i=0; i < idx; i++){
			$(".deli_chk1").eq(i).show();
		}
	}else{
		$("#deli_1_amt_area").hide();
		for(i=0; i < idx; i++){
			$(".deli_chk1").eq(i).hide();
		}
	}

	$("div[id^=multi_deli_]").hide();
	$("div[id^=prod_title_]").hide();
	$("div[id^=deli_prod_]").hide();

	// 배송지 수 만큼 for
	for (i = 1 ; i <= idx ; i++){
		$("#multi_deli_"+i).show();

		if(idx!=1){
			$("#prod_title_"+i).show();
		}

		//메시지카드 영역 초기화
		//복수배송일때만 초기화_선물하기1차작업관련 추가_20160516
		if ($("#chk_multi_dlvp").prop("checked")){

			$("input[name=gift_yn_" + i + "]:visible:last").prop("checked", true);
			$("input[name=gift_yn_" + i + "]:visible:last").click();


		}else{ //단일배송_선물하기1차작업관련 추가_20160516
			var prodTotCnt = $("#frm_inp input[name=prodTotalCnt]:hidden").val();

			for(var j=2; j<=prodTotCnt; j++){
				$("#frm_inp .gift_msg_sel_"+j+" input[name^=gift_yn_"+j+"]:radio[value='1']").prop("checked", false);
				$("#frm_inp .gift_msg_sel_"+j+" input[name^=gift_yn_"+j+"]:radio[value='2']").prop("checked", true);

				$("dd[name^=gift_msg_form_"+j+"]").hide();
				$("#gift_none_msg_"+j).hide();
			}

			$("input[name=gift_yn_" + i + "]:visible:last").click();
		}
	}

	fn_calcTotalPrice(); // 금액 재 계산
}

// 배송정보 setting
function setImallDeliData(){
	var addrcvmessageyn;

	var chkStatus = false;
	// 비회원이면서 e-coupon 이 아닐 경우
	if( "Y" == grockle_yn && "ECOUPON" != gubun ){
		chkStatus = true;
	}
	else {
		// 주문자명 수정완료 체크
		var $nameInpt = $("[id^=orderer_name_val]:visible").find("#nameInpt");

		//회원배송지 수정이 있을경우 주문자 정보 자동 복사
		if (    $("#deli_1 input[name=deli_chk_1]:radio:checked").val() != undefined
			 && $("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "U" ) {

			//alert("회원배송지 수정 주문자-->"+$nameInpt.val());
			if ( $.trim($nameInpt.val()) == '') {
				alert("주문자를 입력해 주세요.");
				$nameInpt.focus();
				return false;
			}
			$("[id^='orderer_name_text']").find("#nameSp").text($nameInpt.val());
			$("[id^='orderer_name_val']").find("#nameInpt").val($nameInpt.val());
		} else 	if ($nameInpt.length > 0) {
			alert("주문자를 입력해 주세요.");
			$nameInpt.focus();
			return false;
		}

		if ($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val()=="U"
				|| $("#deli_option_1 input[name=deli_chk_1]:radio:checked").val()=="C"
				|| (($("input[name=deli_select]").val()=="undefined"||$("input[name=deli_select]").val()==undefined)&&($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val()=="undefined"||$("#deli_option_1 input[name=deli_chk_1]:radio:checked").val()==undefined))
			) {  //수정 or 신규 or 새로입력
			chkStatus = true;
		}
	}

	if( chkStatus ){
		// 간편회원인 경우 첫번째일때는 undefined 로 들어온다.
		var simpleMemberYnFirst = "N";
				if ($("#deli_1 input[name=deli_chk_1]:radio:checked").val() == undefined && simple_mem_yn == "Y"){
					simpleMemberYnFirst = "Y";
					$("#deli_1 input[name=deli_chk_1]:radio:checked").val("C");
		}

		var deli_span_nm = "#frm_inp";
		if( "Y" != grockle_yn ){
			if ( $("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "C" ||
				 $("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "U" ||
				 simpleMemberYnFirst == "Y" ) {
				deli_span_nm += " #li_new";
			} else {
				deli_span_nm += " #li_mine";
			}
		}

		deliidx = "";
		basedlvpyn	= ""; // 기본배송지여부
		dlvpnm 		= ""; // 배송지명
		dlvpsn		= "";
		usrsortrnk	= "";
		deli_chk	= "";
		rmitnm		= $(deli_span_nm + " input[name=inprmitnm]").val();
		dlvzip1		= $(deli_span_nm + " input[name=inpzip1]:hidden").val();
		dlvzip2		= $(deli_span_nm + "  input[name=inpzip2]:hidden").val();
		postaddr	= $(deli_span_nm + "  input[name=inpaddr1]").val();
		dtladdr		= $(deli_span_nm + "  input[name=inpaddr2]").val();
		postNo 		= $("#frm_inp input[name=postNo]").eq(0).val();
		corpPostNoSn = $("#frm_inp input[name=corpPostNoSn]").eq(0).val();

		if ( $("#deli_1 input[name=deli_chk_1]:radio:checked").val() == undefined && simpleMemberYnFirst != "Y" ) {
			// 배송지 수정/신규 둘 다 아닐 경우
			var dlvpSn = $(deli_span_nm + " #deli_select_1").val();
			cellsctno 	= $("#deli_phone_val_1" + dlvpSn + " [name=inpcell1]:enabled").val();
			celltxnono 	= $("#deli_phone_val_1" + dlvpSn + " input[name=inpcell2]").val();
			cellendno 	= $("#deli_phone_val_1" + dlvpSn + " input[name=inpcell3]").val();
			//alert('배송지 수정/신규 둘 다 아닐 경우');
		} else if ($("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "C"  ||
						 $("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "U"  ||
						 simpleMemberYnFirst == "Y"    ) {
			// 배송지 신규, 수정 (비회원 포함)
			cellsctno = $("#deli_phone_val_1 [name=inpcell1]:enabled").val();
			celltxnono	= $("#deli_phone_val_1 input[name=inpcell2]").val();
			cellendno = $("#deli_phone_val_1 input[name=inpcell3]").val();

			//수정일 경우 일반전화번호 셋팅
			if ($("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "U" ) {
				cbltelrgnno =  $("#deli_phone_val_1 input[name=inptel1]").val();
				cblteltxnono = $("#deli_phone_val_1 input[name=inptel2]").val();
				cbltelendno =  $("#deli_phone_val_1 input[name=inptel3]").val();
			}
			//alert('배송지 신규, 수정 (비회원 포함)'+cbltelrgnno[tmp_idx]);
		}

		rcvmessage = $(deli_span_nm + " select[name=deli_msg]").val();
		if (rcvmessage == "직접입력") {
			rcvmessage = $(deli_span_nm + " input[name=rcvmessage]").val();
			addrcvmessageyn = "Y";
		}

		if( "Y" != grockle_yn ){
			deliidx = $(deli_span_nm+" input[name=deli_selected_no]").val();
			basedlvpyn	= $("#frm_inp input[name=basedlvpyn]").eq(deliidx).val();
			dlvpnm 		= $(deli_span_nm + " input[name=inpdlvpnm]").val();

			if($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() == 'C' || simpleMemberYnFirst == "Y"
				||(($("input[name=deli_select]").val()=="undefined"||$("input[name=deli_select]").val()==undefined)&&($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val()=="undefined"||$("#deli_option_1 input[name=deli_chk_1]:radio:checked").val()==undefined))
				){
				dlvpsn		= "";
				usrsortrnk	= "0";
				deli_chk	= "C";	//배송지 수정이면 U 신규이면 C
			}else{
				dlvpsn		= $("#frm_inp input[name=dlvpsn]").eq(deliidx).val();
				usrsortrnk	= $("#frm_inp input[name=usrsortrnk]").eq(deliidx).val();
				deli_chk	= "U";
			}

			if ( $.trim(dlvpnm) == '' ) {
				alert('배송지명을 입력해주세요.');
				$("#frm_inp input[name=inpdlvpnm]").focus();
				return;
			}

			if ($("#dlvpuseyn_1").length > 0 &&  $("#dlvpuseyn_1").prop("checked")==false) {
				dlvpuseyn = "N";
			}
		}

		if ( $.trim(rmitnm) == '' ) {
			alert('받으시는 분을 입력해주세요.');
			$("#frm_inp input[name=inprmitnm]").focus();
			return;
		} else if ( $.trim(dlvzip1) == '' ||  $.trim(dlvzip2) == '' || $.trim(postaddr) == ''
							|| $.trim($(deli_span_nm + " #txt_zip1_1").val()) == ''
							|| $.trim($(deli_span_nm + " #txt_zip2_1").val()) == ''
			) {
			alert('주소를 검색 후 입력해주세요.');
			$("#frm_inp input[name=inpsearch]").focus();
			return;
		} else if ( $.trim(dtladdr) == '' ) {
			alert('나머지 주소를  입력해주세요.');
			$("#frm_inp input[name=inpaddr2]").focus();
			return;
		} else if ( !$.trim(celltxnono).isNum() || ($.trim(celltxnono).length < 3 || $.trim(celltxnono).length > 4) ) {
			alert('연락처를 3~4자리 숫자로 입력해주세요.');
			$("#frm_inp input[name=inpcell2]").focus();
			return;
		} else if ( !$.trim(cellendno).isNum() || ($.trim(cellendno).length < 3 || $.trim(cellendno).length > 4) ) {
			alert('연락처를 3~4자리 숫자로 입력해주세요.');
			$("#frm_inp input[name=inpcell3]").focus();
			return;
		}
	}else {		//수정없을경우
		var deliidx = $("#frm_inp input[name=deli_selected_no]").val();
		basedlvpyn	= $("#frm_inp input[name=basedlvpyn]").eq(deliidx).val(); //rcvCode
		dlvpsn		= $("#frm_inp input[name=dlvpsn]").eq(deliidx).val(); //rcvCode
		dlvpnm      = $("#frm_inp input[name=dlvpnm]").eq(deliidx).val();
		rmitnm		= $("#frm_inp input[name=rmitnm]").eq(deliidx).val();
		dlvzip1		= $("#frm_inp input[name=dlvzip1]").eq(deliidx).val();
		dlvzip2		= $("#frm_inp input[name=dlvzip2]").eq(deliidx).val();
		postaddr	= $("#frm_inp input[name=postaddr]").eq(deliidx).val();
		dtladdr		= $("#frm_inp input[name=dtladdr]").eq(deliidx).val();
		cellsctno 	= $("#deli_phone_val_1_" + dlvpsn + " [name=inpcell1]:enabled").val();
		celltxnono 	= $("#deli_phone_val_1_" + dlvpsn + " input[name=inpcell2]").val();
		cellendno 	= $("#deli_phone_val_1_" + dlvpsn + " input[name=inpcell3]").val();
		usrsortrnk	= $("#frm_inp input[name=usrsortrnk]").eq(deliidx).val();
		corpPostNoSn = $("#frm_inp input[name=corpPostNoSn]").eq(deliidx).val();
		postNo		= $("#frm_inp input[name=postNo]").eq(deliidx).val();
		deli_chk	= "";
		rcvmessage = $("#frm_inp #li_mine select[name=deli_msg]").val();
		if (rcvmessage == "직접입력") {
			rcvmessage = $("#frm_inp #li_mine input[name=rcvmessage]").val();
			addrcvmessageyn = "Y";
		}
	}

	// 배송지재사용 셋팅
	$("#frm_send input[name=chk_dlvp_reuse]").val("");
	if ($("#chk_dlvp_reuse") != undefined && $("#chk_dlvp_reuse") != null) {
		if ( $("#deli_1 #li_mine").hasClass('on') && $("#chk_dlvp_reuse").prop("checked") == true) {
			$("#frm_send input[name=chk_dlvp_reuse]").val("Y");
		}
	}

	// 배송지재사용 셋팅
	$("#frm_send input[name=chk_dlvp_reuse]").val("");
	if ($("#chk_dlvp_reuse").length > 0) {
		if ( deli_chk == "U" && $("#chk_dlvp_reuse_mod").prop("checked") == true) {
			$("#frm_send input[name=chk_dlvp_reuse]").val("Y");
		} else  if ( deli_chk == "" && $("#chk_dlvp_reuse").prop("checked") == true) {
			$("#frm_send input[name=chk_dlvp_reuse]").val("Y");
		}
	}

	// 홈쇼핑 상품 - 결제 전 재고/가격 실시간 체크
	if(!fn_pay_realtime(simpleMemberYnFirst)){
		return;
	}

	$("#frm_send input[name=basedlvpyn]:hidden").val( basedlvpyn );
	$("#frm_send input[name=dlvpsn]:hidden").val( dlvpsn );
	$("#frm_send input[name=dlvpnm]:hidden").val( dlvpnm );
	$("#frm_send input[name=rmitnm]:hidden").val( rmitnm );
	$("#frm_send input[name=dlvzip1]:hidden").val( dlvzip1 );
	$("#frm_send input[name=dlvzip2]:hidden").val( dlvzip2 );
	$("#frm_send input[name=postaddr]:hidden").val( postaddr );
	$("#frm_send input[name=dtladdr]:hidden").val( dtladdr );
	$("#frm_send input[name=cellsctno]:hidden").val( cellsctno );
	$("#frm_send input[name=celltxnono]:hidden").val( celltxnono );
	$("#frm_send input[name=cellendno]:hidden").val( cellendno );
	$("#frm_send input[name=cbltelrgnno]:hidden").val( cbltelrgnno );
	$("#frm_send input[name=cblteltxnono]:hidden").val( cblteltxnono );
	$("#frm_send input[name=cbltelendno]:hidden").val( cbltelendno );
	$("#frm_send input[name=usrsortrnk]:hidden").val( usrsortrnk );
	$("#frm_send input[name=delichk]:hidden").val( deli_chk );
	$("#frm_send input[name=corp_post_no_sn]:hidden").val( corpPostNoSn );
	$("#frm_send input[name=post_no]:hidden").val(dlvzip1 + dlvzip2);
	$("#frm_send input[name=rcvmessage]").val( rcvmessage );
	$("#frm_send input[name=addrcvmessageyn]").val( addrcvmessageyn );
	$("#frm_send input[name=dlvpuseyn]:hidden").val(dlvpuseyn);

	// 선물메시지
	// 선물하기 1차 수정_20160525
	if (!$("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")){//복수배송 기존
		if ( $(deli_span_nm + " input[name=gift_yn]:radio:checked").val() == '1' ) {
			receivename = $(deli_span_nm + " input[name=receivename]").val();
			sendmessage = $(deli_span_nm + " textarea[name=sendmessage]").val();
			sendname = $(deli_span_nm + " input[name=sendname]").val();
			if ( $.trim(receivename) == '' && $.trim(sendmessage) == '' && $.trim(sendname) == '' ) {
				if (confirm('종이카드를 작성하지 않고 주문을 진행하시겠습니까?')) {
					// true;
				} else {
					return;
				}
			}
		} else {
			receivename = "";
			sendmessage = "";
			sendname = "";
		}
	}else{//단일배송일 경우 추가
		if ( $("#frm_inp .gift_msgMultiInsert input[name=gift_yn_1]:radio:checked").val() == '1' ) {
			receivename = $("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val();
			sendmessage = $(".gift_msgMultiInsert #sendmessage_1").val();
			sendname = $("#frm_inp .gift_msgMultiInsert input[name=sendname_1]").val();

			if ( $.trim(receivename) == '' || $.trim(sendmessage) == '' || $.trim(sendname) == '' ) {
				if (confirm('종이카드를 작성하지 않고 주문을 진행하시겠습니까?')) {
					// true;
				} else {
					return;
				}
			}
		} else {
			receivename = "";
			sendmessage = "";
			sendname = "";
		}
	}

	$("#frm_send input[name=receivename]:hidden").val( receivename );
	$("#frm_send input[name=sendmessage]:hidden").val( sendmessage );
	$("#frm_send input[name=sendname]:hidden").val( sendname );

	var prodArr = cartSn.split(split_gubun_1);
	var tmp_val = "";
	var tmp_arr = new Array(prodArr);

	// 매장전달메시지
	for(var i=0; i<prodArr.length; i++){
		if (typeof($("#frm_inp textarea[name=shop_memo_"+prodArr[i]+"]"))==undefined){
			tmp_val = "";
		}else{
			tmp_val = $("#frm_inp textarea[name=shop_memo_"+prodArr[i]+"]").val();
		}

		tmp_arr[i] = tmp_val;
	}

	$("#frm_send input[name=shop_memo_cont]:hidden").val( tmp_arr.join(split_gubun_1) );

	// 선물포장여부
	for(var i=0; i<prodArr.length; i++){
		if (typeof($("#frm_inp input[name=gift_pkg_"+prodArr[i]+"]:radio:checked"))==undefined){
			tmp_val = "N";
		}else{
			tmp_val = $("#frm_inp input[name=gift_pkg_"+prodArr[i]+"]:radio:checked").val();
		}

		tmp_arr[i] = tmp_val;
	}
	$("#frm_send input[name=gift_pkg_yn]:hidden").val( tmp_arr.join(split_gubun_1) );

	return true;
}

// 배송비 초기화
function deli_init(deli_idx){
	var deli_scope = "";

	if (deli_idx!=undefined && deli_idx!=""){
		deli_scope = deli_idx+"_";
	}

	$("input[name^=tmp_deli_amt_"+deli_scope+"]:hidden").each(function(){
		$("#frm_inp input[name=caltotdeliamt]:hidden").val(parseInt($("#frm_inp input[name=caltotdeliamt]:hidden").val()) - parseInt($(this).val()));
		$(this).val("0");
	});

	$("div[id^=tmp_deli_amt_"+deli_scope+"]").each(function(){
		$(this).find('span').text("배송비 : 무료");
	});

	//$("#tmp_deli_amt_"+deli_idx+"_div").find('span').text("배송비 : 무료");

	$("input[name^=deli_data_"+deli_scope+"]:hidden").each(function(){
		$(this).next().next().children().val("0");
	});
}

// 중복배송비 조회
function multiDeliAmt(std_obj){

	var std_obj_nm = std_obj.attr("name"); // 중복배송 수량 select box 명
	var std_smp_nm = std_obj_nm.replace('multi_prod_', ''); // 상품정보를 담은 div 영역 찾기 위한 이름 추출
	var std_deli_idx = std_obj_nm.substring(std_obj_nm.lastIndexOf('_')+1); // 배송지 순번 추출

	var std_deli_data = $("#deli_product_"+std_smp_nm+" input[name^=deli_data_]:hidden").val();

	// 선택된 상품을 배송지 개수만큼 돌면서 체크
	// 수량이  존재할 경우, 배송지 카운트 증가 및 금액 sum
	// 품목 Array
	var objArr = new Array();
	// 배송지 수
	var dlvp_cnt = 0;
	// 배송비 합계
	var dlex_sum = 0;

	var dlvpObjArr = new Array();
	$("input[name^=deli_data_]").each(function(){
		if( $(this).val().split("|")[1] == std_deli_data.split("|")[1] ){
			$(this).each(function(){
				if( Number( $(this).next().next().find("input").val() ) > 0 ){

					var dupChk = false;
					for( var i = 0; i < dlvpObjArr.length; i++ ){
						if( dlvpObjArr[i] == $(this).attr("name") ){
							dupChk = true;
							break;
						}
					}

					if( !dupChk ){
						dlvpObjArr[dlvp_cnt] = $(this).attr("name");
						objArr[dlvp_cnt] = $(this).next().next().find("input");
						dlvp_cnt++;
					}

				}
			});
		}
	});

	for( var i = 0; i < dlvp_cnt; i++ ){

		var obj = objArr[i];

		var obj_nm = obj.attr("name"); // 중복배송 수량 select box 명
		var smp_nm = obj_nm.replace('multi_prod_', ''); // 상품정보를 담은 div 영역 찾기 위한 이름 추출
		var deli_idx = obj_nm.substring(obj_nm.lastIndexOf('_')+1); // 배송지 순번 추출

		var deli_data = $("#deli_product_"+smp_nm+" input[name^=deli_data_]:hidden").val(); // 배송비 조회를 위한 데이터 조회
		var detail_data = deli_data.split('|'); // 상품코드,배송코드,상품가격
		var chk_data;

		var goodsNoMany = "";
		var dlvPolcNoMany = "";
		var realSalePrcMany = "";
		var smpUseYnMany = "";
		var ordQtyMany = "";
		var split_str = "";
		var smartOrd = $("input[name=smartOrd]").val();
		var crspk_exist_yn = $("input[name=crspk_exist_yn]").val();

		if (crspk_exist_yn == "Y"){
			smartOrd = "N";
		}

		// 배송비 조회를 위한 데이터 생성
		$("input[name=deli_data_"+deli_idx+"]:hidden").each(function(){
			chk_data = ($(this).val()).split('|');
			if (detail_data[1]==chk_data[1]){
				split_str = (goodsNoMany==""?"":split_gubun_1);

				goodsNoMany += (split_str+chk_data[0]);
				dlvPolcNoMany += (split_str+chk_data[1]);
				realSalePrcMany += (split_str+chk_data[2]);
				smpUseYnMany += (split_str+smartOrd);

				ordQtyMany += (split_str+(    $(this).siblings('span').find('input').val())    );
			}
		});

		// 배송비 조회
		var res_str = "";
		var res_code = "";
		var res_msg = "";
		var dlex_amt = 0;
		$.ajax({
			type: 'post'
			, async: false
			, url: '/popup/multi_deli_amt.do?' + __commonParam
			, data: 'goodsNoMany='+goodsNoMany+'&dlvPolcNoMany='+dlvPolcNoMany+'&realSalePrcMany='+realSalePrcMany+'&smpUseYnMany='+smpUseYnMany+'&ordQtyMany='+ordQtyMany
			, success: function(response) {
				res_str = response.split(':');
				res_code = res_str[0];
				res_msg = res_str[1];
				dlex_amt = $.trim(res_str[2]);
			}
		});

		if ($.trim(res_code)=='0000'){
			var old_dlex_amt = $("input[name=tmp_deli_amt_"+deli_idx+"_"+detail_data[1]+"]:hidden").val();
			$("input[name=tmp_deli_amt_"+deli_idx+"_"+detail_data[1]+"]:hidden").val(dlex_amt);
			$("#tmp_deli_amt_"+deli_idx+"_"+detail_data[1]).find('span').text("배송비 : " + (dlex_amt==0?"무료":new String(dlex_amt).money() + "원"));

			var tmp_deli_amt = 0;
			$("input[name^=tmp_deli_amt_"+deli_idx+"_]:hidden").each(function(){
				tmp_deli_amt += parseInt($(this).val());
			});

			// 총 배송비 계산
			$("input[name=tmp_deli_amt_"+deli_idx+"_"+detail_data[1]+"]:hidden").each(function(){
				$("#frm_inp input[name=caltotdeliamt]:hidden").val(parseInt($("#frm_inp input[name=caltotdeliamt]:hidden").val()) - parseInt(old_dlex_amt) + parseInt($(this).val()));
			});
			fn_calcTotalPrice(); // 금액 계산

			$("#frm_send input[name=totdeliamt]:hidden").val($("#frm_inp input[name=caltotdeliamt]:hidden").val()); // 총중복배송비
			dlex_sum += Number(dlex_amt);
		}
		else{
			alert($.trim(res_msg));
		}
	}

	// 선택된 상품의 배송지가 없을 경우
	if( dlvp_cnt < 1 ){

		var obj, obj_nm, smp_nm, deli_idx, deli_data, detail_data, old_dlex_amt;
		var dlex_amt = 0;
		$("input[name^=deli_data_]").each(function(){
			if( $(this).val().split("|")[1] == std_deli_data.split("|")[1] ){
				$(this).each(function(){
					obj = $(this).next().next().find("input");
					obj_nm = obj.attr("name"); // 중복배송 수량 select box 명
					smp_nm = obj_nm.replace('multi_prod_', ''); // 상품정보를 담은 div 영역 찾기 위한 이름 추출
					deli_idx = obj_nm.substring(obj_nm.lastIndexOf('_')+1); // 배송지 순번 추출
					deli_data = $("#deli_product_"+smp_nm+" input[name^=deli_data_]:hidden").val(); // 배송비 조회를 위한 데이터 조회
					detail_data = deli_data.split('|'); // 상품코드,배송코드,상품가격
					old_dlex_amt = $("input[name=tmp_deli_amt_"+deli_idx+"_"+detail_data[1]+"]:hidden").val();

					$("input[name=tmp_deli_amt_"+deli_idx+"_"+detail_data[1]+"]:hidden").val(dlex_amt);
					$("#tmp_deli_amt_"+deli_idx+"_"+detail_data[1]).find('span').text("배송비 : " + (dlex_amt==0?"무료":new String(dlex_amt).money() + "원"));

					// 총 배송비 계산
					$("input[name=tmp_deli_amt_"+deli_idx+"_"+detail_data[1]+"]:hidden").each(function(){
						$("#frm_inp input[name=caltotdeliamt]:hidden").val(parseInt($("#frm_inp input[name=caltotdeliamt]:hidden").val()) - parseInt(old_dlex_amt) + parseInt($(this).val()));
					});

				});
			}
		});

		fn_calcTotalPrice(); // 금액 계산
		$("#frm_send input[name=totdeliamt]:hidden").val($("#frm_inp input[name=caltotdeliamt]:hidden").val()); // 총중복배송비
	}

	// 참좋은혜택 > 배송비 reset
	benefit_dlvp_set([std_deli_data, dlex_sum, dlvp_cnt]);

}
// 중복배송 함수 End

function getPage() {
	return document.frm_send.pageName.value;
}

//네이버지도
function naver_store_map(arg, isLoadScript, smpEtNo, smpEtContrNo, smp_goods_type){

	if (typeof isLoadScript != 'boolean' || isLoadScript === false)
	{	// NaverMap Loading 개선, 2014-07-03 by sylee58@lotte.com
		com.lotte.util.LoadScript("http://map.naver.com/js/naverMap.naver?key=956f6f619b13d3caf5540349078f9593", function(){naver_store_map(arg, true, smpEtNo, smpEtContrNo, smp_goods_type);});
		return;
	}

	$( '#cover' ).css({ 'display' : 'block', 'height' : '100%', 'top' : 0 });
	// <div id="container"> 가 relative 라 이녀석에 top 을 잡고 있어
	// 헤더 영역만큼 $('.new1025').height() 빼고 100px 더한다.
	var cal_top = ( $(document).scrollTop() - $('.new1025').height() ) + 100;//$('#calculator').scroll().top;
	var	loading_style = "position:absolute;width:100%;opacity:1;z-index:999;top:"+cal_top+"px;left:0px;";
	$('#shop_location').removeClass("shop_location");
	$('#shop_location').attr("style", loading_style);

	var smp_ecpn_yn = (smp_goods_type==goods_smp_normal_etc?'Y':'N'); // 이쿠폰 여부
	var req_data = 'goods_no='+arg+'&smp_entr_no='+smpEtNo+'&smp_entr_contr_no='+smpEtContrNo+'&smp_ecoupon_yn='+smp_ecpn_yn+'&' + __commonParam;
	$.ajax({
				type: 'post'
				, async: true
				, url: '/product/m/mobileNaverMap.do?'
				, data: req_data
				, beforeSend : function () { $( '#loading' ).css( 'display', 'block' ); }
				, success: function(response) {
					$("#shop_location").html(response);
					$("#shop_location").show();
				}
			, error: function(err) {
					alert('매장위치 조회 중 오류가 발생하였습니다.\n잠시 후 조회해 주세요.');
				$("#shop_location").hide();
			}
			, complete : function () { $( '#loading' ).css( 'display', 'none' ); }
		});
}

//최대할인금액 설정 용...
var maxFirstIdx = ""; // 1차할인 최대값 index.
var maxDupIdx = ""; // 2차할인 최대값 index
var maxThirdIdx = ""; // 3차할인 최대값 index
var maxSaveFirstIdx = ""; // 1차할인 적립최대값 index
var maxSaveDupIdx = ""; // 1차할인 적립일 때, 2차할인 최대값 index
// 최대할인금액 설정.
var maxDcAmt = 0;

var staff = false; //임직원 여부 

//임직원 할인 일때는 0으로처리.
function getThirdAmt(amt ,prommdclcd){
	if(prommdclcd != undefined  && prommdclcd == "27"){
		amt = 0;
	} 
	return parseInt(amt);
}


//임직원여부 true 일 경우 0으로처리. 비교용도로 사용
function getThirdAmtChk(amt , chk ){
	if(chk){
		amt = 0;
	} 
	return parseInt(amt);
}

function setStaff(prommdclcd){
	var chk = false;
	if(prommdclcd != undefined  && prommdclcd == "27"){
		chk = true;
	} 
	return chk;
}



/***
 *신규 최대할인 구분 
1.input_cardkndcd : 카드 구분값(카드할인 쿠폰 제어용 카드 종류 셋팅 안할경우 'N', 그외 ex: 031 
2.set_yn : 셋팅여부 (최대값만 알아볼경우 N,frm_send 에 셋팅할경우 Y)
***/
function setMaxDcNew(input_cardkndcd,set_yn ){
	
	var maxAmt = 0; // 최대금액
	var maxFirstAmt = 0; // 1차할인 최대값.
	var maxDupAmt = 0; // 2차할인 최대값.
	var maxThirdAmt = 0; //3차 할인 최대값 (적립없다)
	var maxSaveFirstAmt = 0; // 1차할인 적립최대값.
	var maxSaveDupAmt = 0; // 1차할인 적립일 때, 2차할인 최대값.
	var thirdAmt = 0; //3차 할인
	var first_cpn = "0";
	var dup_cpn   = "0";
	var orgfvrval = ""; 
	
	if(set_yn == 'Y'){//계산전 초기화 
		maxFirstIdx = "N";
		maxDupIdx = "N";
		maxThirdIdx = "N";
		maxSaveFirstIdx = "N";
		maxSaveDupIdx = "N";
		//쿠폰 정보 초기화
		init_cpn_info("Y", "Y", "Y");		
	}
	var paytype = $("#frm_send input[name=paytype]:hidden").val();
	if($("#frm_inp input[name=third_coupon]").val() != undefined  && (paytype == PAYTYPE_CODE_CARD || paytype == PAYTYPE_CODE_LPAY) ){ //3차 할인 금액 생성
		thirdAmt = $("#frm_inp input[name=totdcamt_third]").val();
		if($("#frm_inp input[name=prommdclcd_third]").eq(0).val() =="35"){			
			thirdAmt		= $("#frm_inp input[name=lumpSumFvrVal]").val();	// 일시불할인금액
		}else{			
			thirdAmt		= $("#frm_inp input[name=totdcamt_third]").eq(0).val();	// 쿠폰할인금액
		}
	}
	$("#frm_inp input[name=coupon]:hidden").each(function(){
		//초기화
		promcartsn      = "";
		prommdclcd		= "";
		fvrpolctpcd		= "";
		totdcamt		= "0";
		cpnpromno		= "";
		cpnrscmgmtsn		= "";
		adtncostdtlsctnm	= "";
		cardkndcd		= "";
		includeSaveInstCpn = "";
		
		
		var coupon_idx = $(this).val();
		var v_cardkndcd		= $("#frm_inp input[name=cardkndcd]").eq(coupon_idx).val(); //047		
		var v_prommdclcd	= $("#frm_inp input[name=prommdclcd]").eq(coupon_idx).val(); 
		if(v_prommdclcd !="10" || v_cardkndcd =="" || input_cardkndcd == 'N' || (v_cardkndcd == input_cardkndcd )){ //카드 할인아닐때나 카드구분 인자값이 안넘어올때는 그냥 넘어가고 넘어올경우 카드 종류가 일치해야 진행한다.
			if ( coupon_idx != "N" ) { // 1차 선택
				promcartsn		= $("#frm_inp input[name=promcartsn]").eq(coupon_idx).val(); // 9
				prommdclcd		= $("#frm_inp input[name=prommdclcd]").eq(coupon_idx).val(); // 10
				fvrpolctpcd		= $("#frm_inp input[name=fvrpolctpcd]").eq(coupon_idx).val(); // 04
				totdcamt		= $("#frm_inp input[name=totdcamt]").eq(coupon_idx).val();	// 쿠폰할인금액 20800
				cpnpromno		= $("#frm_inp input[name=cpnpromno]").eq(coupon_idx).val(); // 1123188
				cpnrscmgmtsn		= $("#frm_inp input[name=cpnrscmgmtsn]").eq(coupon_idx).val(); // 0
				adtncostdtlsctnm	= $("#frm_inp input[name=adtncostdtlsctnm]").eq(coupon_idx).val(); // 롯데카드 5% 할인
				cardkndcd		= $("#frm_inp input[name=cardkndcd]").eq(coupon_idx).val(); //047
				includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn]").eq(coupon_idx).val(); // 2011.05.19 적립여부 N
				
				if ( $("#frm_inp input[name=dup_coupon]").length == 1 ) { // 2차가 없다.
					if ( parseInt(totdcamt)+ parseInt(getThirdAmt(thirdAmt ,prommdclcd)) >= parseInt(maxAmt)  ) {
						maxAmt = parseInt(totdcamt) + parseInt(getThirdAmt(thirdAmt ,prommdclcd));
						// 적립여부에 따라 구분
						if( "N" == includeSaveInstCpn && (parseInt(maxAmt) > parseInt(maxFirstAmt) +parseInt(maxDupAmt) + parseInt(getThirdAmtChk(thirdAmt ,staff))) ){
							maxFirstAmt = totdcamt;
							maxFirstIdx = coupon_idx;
							maxDupAmt = 0;
							maxDupIdx = "";
							staff = setStaff(prommdclcd);
						}
						else if( "Y" == includeSaveInstCpn &&(parseInt(maxAmt) > parseInt(maxSaveFirstAmt) +parseInt(maxSaveDupAmt) + parseInt(getThirdAmtChk(thirdAmt ,staff))) ){
							maxSaveFirstAmt = totdcamt;
							maxSaveFirstIdx = coupon_idx;
							maxSaveDupAmt = 0;
							maxSaveDupIdx = "";
							staff = setStaff(prommdclcd);
						}
					}
				} else { // 2차가 있다.
					$("#frm_inp input[name=dup_coupon]").each(function(){										
						var dupcpn_idx = $(this).val();
						var tmp_arr_cnt = 0;
						var tmp_arr;												
						v_cpn_crd_dc_amt = 0;
						var v_dup_cardkndcd		= $("#frm_inp input[name=cardkndcd_dup]").eq(dupcpn_idx).val(); //047
						dup_promcartsn		= "";
						dup_prommdclcd		= "";
						dup_fvrpolctpcd		= "";
						dup_cpnpromno		= "";
						dup_cpnrscmgmtsn		= "";
						dup_adtncostdtlsctnm	= "";
						dup_cardkndcd		= "";
						dup_includeSaveInstCpn = "";
						if(v_dup_cardkndcd ==undefined || v_dup_cardkndcd =="" || input_cardkndcd == 'N' || (v_dup_cardkndcd == input_cardkndcd )){
								dup_cpnpromno = $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();

								if ( dupcpn_idx != "N" ){
									if ( coupon_idx == undefined || coupon_idx == "N" ){ // 중복쿠폰
										tmp_arr = single_prom;
										tmp_arr_cnt = single_prom_cnt;
									}else{ // 1차쿠폰 + 중복쿠폰 사용
										tmp_arr = multi_prom;
										tmp_arr_cnt = multi_prom_cnt;
										first_cpn = (cpnpromno=="0"?prommdclcd:cpnpromno);
									}
									
									if ( tmp_arr_cnt > 0 ){
										v_cpn_crd_dc_amt = 0;
										totdupdcamt = 0;
										for (var i = 0 ; i <  tmp_arr.length  ; i ++ ){
											if ( tmp_arr[i][0] == first_cpn && tmp_arr[i][1] == dup_cpnpromno ){
												v_cpn_crd_dc_amt = tmp_arr[i][2];			
												totdupdcamt = tmp_arr[i][2];
												break;
											}
										}

										if ( parseInt( v_cpn_crd_dc_amt) > 0 ){
											if ( dupcpn_idx != 'N' ) {
												dup_promcartsn		= $("#frm_inp input[name=promcartsn_dup]").eq(dupcpn_idx).val();
												dup_prommdclcd		= $("#frm_inp input[name=prommdclcd_dup]").eq(dupcpn_idx).val();
												dup_fvrpolctpcd		= $("#frm_inp input[name=fvrpolctpcd_dup]").eq(dupcpn_idx).val();
												dup_cpnpromno		= $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();
												dup_cpnrscmgmtsn		= $("#frm_inp input[name=cpnrscmgmtsn_dup]").eq(dupcpn_idx).val();
												dup_adtncostdtlsctnm	= $("#frm_inp input[name=adtncostdtlsctnm_dup]").eq(dupcpn_idx).val();
												dup_cardkndcd		= $("#frm_inp input[name=cardkndcd_dup]").eq(dupcpn_idx).val();
												dup_includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn_dup]").eq(dupcpn_idx).val();
			
												if (prommdclcd=="10" && cardkndcd!=""){ // 카드할인쿠폰
													if (($("#frm_inp input[name=prommdclcd_dup]:eq("+$(this).val()+")").val()=="30" && cardkndcd==$("#frm_inp input[name=cardkndcd_dup]:eq("+$(this).val()+")").val())
														|| $("#frm_inp input[name=cardkndcd_dup]:eq("+$(this).val()+")").val()==""){ // 같은 중복카드쿠폰이거나 중복카드쿠폰이 아니면
														if ( parseInt(totdcamt) + parseInt(totdupdcamt) + getThirdAmt(thirdAmt ,prommdclcd) >= parseInt(maxAmt) ) {															
															maxAmt = parseInt(totdcamt)+parseInt(totdupdcamt)+getThirdAmt(thirdAmt ,prommdclcd);															
															// 적립여부에 따라 구분
															if( "N" == includeSaveInstCpn && parseInt(maxAmt) > (parseInt(maxFirstAmt) + parseInt(maxDupAmt) +getThirdAmtChk(thirdAmt ,staff) )){
																maxFirstAmt = totdcamt;
																maxFirstIdx = coupon_idx;
																maxDupAmt = totdupdcamt;
																maxDupIdx = dupcpn_idx;
																staff = setStaff(prommdclcd);																
															}else if( "Y" == includeSaveInstCpn && parseInt(maxAmt) > (parseInt(maxSaveFirstAmt) + parseInt(maxSaveDupAmt)+getThirdAmtChk(thirdAmt ,staff) ) ){
																maxSaveFirstAmt = totdcamt;
																maxSaveFirstIdx = coupon_idx;
																maxSaveDupAmt = totdupdcamt;
																maxSaveDupIdx = dupcpn_idx;
																staff = setStaff(prommdclcd);																
															}
														}
													}
												}else if (prommdclcd == "27"){ // 임직원할인
													if ( parseInt(totdcamt) >= parseInt(maxAmt) ) { // 2차,3차 사용못함
														maxAmt = parseInt(totdcamt);
													
														// 적립여부에 따라 구분
														if( "N" == includeSaveInstCpn && (parseInt(maxAmt) > parseInt(maxFirstAmt)+ parseInt(maxDupAmt) +getThirdAmtChk(thirdAmt ,staff))){
															maxFirstAmt = totdcamt;
															maxFirstIdx = coupon_idx;
															maxDupAmt = 0;
															maxDupIdx = "";
															staff = setStaff(prommdclcd);
														}
														else if( "Y" == includeSaveInstCpn && (parseInt(maxAmt) > parseInt(maxSaveFirstAmt)+ parseInt(maxSaveDupAmt) +getThirdAmtChk(thirdAmt ,staff))){
															maxSaveFirstAmt = totdcamt;
															maxSaveFirstIdx = coupon_idx;
															maxSaveDupAmt = 0;
															maxSaveDupIdx = "";
															staff = setStaff(prommdclcd);
														}
													}
												}else{
													if ( parseInt(totdcamt) + parseInt(totdupdcamt) +getThirdAmt(thirdAmt ,prommdclcd)  >= parseInt(maxAmt) ) {
														maxAmt = parseInt(totdcamt)+parseInt(totdupdcamt) +getThirdAmt(thirdAmt ,prommdclcd);
														// 적립여부에 따라 구분
														if( "N" == includeSaveInstCpn && (parseInt(maxAmt) > (parseInt(maxFirstAmt) + parseInt(maxDupAmt) +getThirdAmtChk(thirdAmt ,staff) )) ){
															maxFirstAmt = totdcamt;
															maxFirstIdx = coupon_idx;
															maxDupAmt = totdupdcamt;
															maxDupIdx = dupcpn_idx;
															staff = setStaff(prommdclcd);
														}else if( "Y" == includeSaveInstCpn && (parseInt(maxAmt) > (parseInt(maxSaveFirstAmt) + parseInt(maxSaveDupAmt) +getThirdAmtChk(thirdAmt ,staff) )) ){
															maxSaveFirstAmt = totdcamt;
															maxSaveFirstIdx = coupon_idx;
															maxSaveDupAmt = totdupdcamt;
															maxSaveDupIdx = dupcpn_idx;
															staff = setStaff(prommdclcd);
														}
													}
												}
											} 
										}
									}
								} else { //2차 쿠폰 있지만 선택 안함
									if ( parseInt(totdcamt) +getThirdAmt(thirdAmt ,prommdclcd) >= parseInt(maxAmt) ) {
										maxAmt = parseInt(totdcamt) + parseInt(getThirdAmt(thirdAmt ,prommdclcd));
										console.log('여기서 금액이 나와야 함:== '+maxAmt);
										// 적립여부에 따라 구분
										if( "N" == includeSaveInstCpn && (parseInt(maxAmt) > parseInt(maxFirstAmt)+ parseInt(maxDupAmt) +getThirdAmtChk(thirdAmt ,staff) ) ){
											maxFirstAmt = totdcamt;
											maxFirstIdx = coupon_idx;
											maxDupAmt = 0;
											maxDupIdx = "";
											staff = setStaff(prommdclcd);
										}
										else if( "Y" == includeSaveInstCpn && (parseInt(maxAmt) > parseInt(maxSaveFirstAmt)+ parseInt(maxSaveDupAmt) +getThirdAmtChk(thirdAmt ,staff) ) ){
											maxSaveFirstAmt = totdcamt;
											maxSaveFirstIdx = coupon_idx;
											maxSaveDupAmt = 0;
											maxSaveDupIdx = "";
											staff = setStaff(prommdclcd);
										}
									}
								}
						}
					});
				}
			} else { // 1차 선택이 안된경우.
				if ( $("#frm_inp input[name=dup_coupon]").length > 1 ) { // 2차가 있다.
					$("#frm_inp input[name=dup_coupon]").each(function(){
						var dupcpn_idx = $(this).val();
						var tmp_arr_cnt = 0;
						var tmp_arr;
						v_cpn_crd_dc_amt = 0;
						
						var v_dup_cardkndcd		= $("#frm_inp input[name=cardkndcd_dup]").eq(dupcpn_idx).val(); //047										 
						if(v_dup_cardkndcd ==undefined || v_dup_cardkndcd =="" || input_cardkndcd == 'N' || (v_dup_cardkndcd == input_cardkndcd )){ 
							if ( dupcpn_idx != "N" ){
								if ( coupon_idx == undefined || coupon_idx == "N" ){ // 중복쿠폰
									tmp_arr = single_prom;
									tmp_arr_cnt = single_prom_cnt;
								}else{ // 1차쿠폰 + 중복쿠폰 사용
									tmp_arr = multi_prom;
									tmp_arr_cnt = multi_prom_cnt;
									first_cpn = (cpnpromno=="0"?prommdclcd:cpnpromno);
								}
								cpnpromno_dup = $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();
								if ( tmp_arr_cnt > 0 ){
									for (var i = 0 ; i <  tmp_arr.length  ; i ++ ){
										if ( tmp_arr[i][0] == first_cpn && tmp_arr[i][1] == cpnpromno_dup ){
											v_cpn_crd_dc_amt = tmp_arr[i][2];
		
											totdupdcamt = tmp_arr[i][2];
											break;
										}
									}
		
									if ( parseInt( v_cpn_crd_dc_amt) > 0 ){
										if ( dupcpn_idx != 'N' ) {
											promcartsn		= $("#frm_inp input[name=promcartsn_dup]").eq(dupcpn_idx).val();
											prommdclcd		= $("#frm_inp input[name=prommdclcd_dup]").eq(dupcpn_idx).val();
											fvrpolctpcd		= $("#frm_inp input[name=fvrpolctpcd_dup]").eq(dupcpn_idx).val();
											cpnpromno		= $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();
											cpnrscmgmtsn		= $("#frm_inp input[name=cpnrscmgmtsn_dup]").eq(dupcpn_idx).val();
											adtncostdtlsctnm	= $("#frm_inp input[name=adtncostdtlsctnm_dup]").eq(dupcpn_idx).val();
											cardkndcd		= $("#frm_inp input[name=cardkndcd_dup]").eq(dupcpn_idx).val();
											includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn_dup]").eq(dupcpn_idx).val();
		
											if ( parseInt(v_cpn_crd_dc_amt) +getThirdAmt(thirdAmt ,prommdclcd)  > parseInt(maxAmt) ) {
												maxAmt = parseInt(v_cpn_crd_dc_amt)+ getThirdAmt(thirdAmt ,prommdclcd);
												staff = setStaff(prommdclcd);
												if ( parseInt(v_cpn_crd_dc_amt) > 0 ) {
													maxDupAmt = v_cpn_crd_dc_amt;
													maxDupIdx = dupcpn_idx;													
												} else {
													maxDupAmt = 0;
													maxDupIdx = "";
													maxSaveDupAmt = 0;
													maxSaveDupIdx = "";
												}
											}
										}
									}
								}
							}
						}
					});
				}
			}		
		}	
	});

	if( parseInt(maxFirstAmt) + parseInt(maxDupAmt) < parseInt(maxSaveFirstAmt) + parseInt(maxSaveDupAmt) ){
		maxFirstIdx = maxSaveFirstIdx;
		maxDupIdx = maxSaveDupIdx;
	}
	maxFirstIdx = maxFirstIdx == ""?"N":maxFirstIdx;
	maxDupIdx = maxDupIdx == ""?"N":maxDupIdx;
		
	
	//최대 할인 혜택이 임직원 할인이고 3차 할인(일시불)과 금액 비교시 일시불할인이 금액이 더 크면 1차 할인을 없애고 3차 할인만 셋팅한다.
	if(maxFirstIdx != "N" && $("#frm_inp input[name=prommdclcd]").eq(maxFirstIdx).val() == "27"  ){
		if( parseInt($("#frm_inp input[name=totdcamt]").eq(maxFirstIdx).val()) < thirdAmt ){
			maxFirstIdx = "N";
			maxFirstAmt = 0;
		}				
	}

	if ( maxFirstIdx != "N" ) {
		//1차 쿠폰이 카드할인쿠폰이고 input_cardkndcd == 'N' 일 경우(전체카드 대상)
		if($("#frm_inp input[name=cardkndcd]").eq(maxFirstIdx).val() != '' && $("#frm_inp input[name=prommdclcd]").eq(maxFirstIdx).val() == '10'  && input_cardkndcd == 'N'){			
			tot_dc_iscmcdnm = $("#card_nm_"+$("#frm_inp input[name=cardkndcd]").eq(maxFirstIdx).val()).val();			
		}
		if(set_yn == 'Y'){//1차쿠폰 셋팅		  
			promcartsn		= $("#frm_inp input[name=promcartsn]").eq(maxFirstIdx).val(); // 9
			prommdclcd		= $("#frm_inp input[name=prommdclcd]").eq(maxFirstIdx).val(); // 10
			fvrpolctpcd		= $("#frm_inp input[name=fvrpolctpcd]").eq(maxFirstIdx).val(); // 04
			totdcamt		= $("#frm_inp input[name=totdcamt]").eq(maxFirstIdx).val();	// 쿠폰할인금액 20800
			cpnpromno		= $("#frm_inp input[name=cpnpromno]").eq(maxFirstIdx).val(); // 1123188
			cpnrscmgmtsn		= $("#frm_inp input[name=cpnrscmgmtsn]").eq(maxFirstIdx).val(); // 0
			adtncostdtlsctnm	= $("#frm_inp input[name=adtncostdtlsctnm]").eq(maxFirstIdx).val(); // 롯데카드 5% 할인
			cardkndcd		= $("#frm_inp input[name=cardkndcd]").eq(maxFirstIdx).val(); //047
			includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn]").eq(maxFirstIdx).val(); // 2011.05.19 적립여부 N
			orgfvrval 		= $("#frm_inp input[name=orgfvrval]").eq(maxFirstIdx).val(); //할인율 
			// 임직원할인 선택시 물음표 영역 노출 khlee51
			if ( prommdclcd == "27" ) {
				$("#staff_text").show();
			} else {
				$("#staff_text").hide();
				
			}			
			$("#frm_send input[name=promcartsn]").val( promcartsn );
			$("#frm_send input[name=prommdclcd]").val( prommdclcd );
			$("#frm_send input[name=fvrpolctpcd]").val( fvrpolctpcd );
			$("#frm_send input[name=totdcamt]").val( totdcamt );
			$("#frm_send input[name=cpnpromno]").val( cpnpromno );
			$("#frm_send input[name=cpnrscmgmtsn]").val( cpnrscmgmtsn );
			$("#frm_send input[name=adtncostdtlsctnm]").val( adtncostdtlsctnm );
			$("#frm_send input[name=cardkndcd]").val( cardkndcd );
			$("#frm_send input[name=includeSaveInstCpn]").val( includeSaveInstCpn );	
			$("#frm_send input[name=orgfvrval]").val( orgfvrval );
			ord_session_clear();
		}		
	}
	   	

	if ( maxDupIdx != "N" ) {	
		if(tot_dc_iscmcdnm == "" && $("#frm_inp input[name=cardkndcd_dup]").eq(maxDupIdx).val() != '' && input_cardkndcd == 'N'){			
			tot_dc_iscmcdnm = $("#card_nm_"+$("#frm_inp input[name=cardkndcd_dup]").eq(maxDupIdx).val()).val();			
		}
		if(set_yn == 'Y'){//2차 쿠폰 셋팅
			var coupon_idx = maxFirstIdx;
			var prommdclcd = $("#frm_inp input[name=prommdclcd]").eq(coupon_idx).val(); // 1차쿠폰
			var cpnpromno = $("#frm_inp input[name=cpnpromno]").eq(coupon_idx).val(); // 1차쿠폰
			var cpnpromno_dup = $("#frm_inp input[name=cpnpromno_dup]").eq(maxDupIdx).val(); // 중복쿠폰 프로모션 번호
			var tmp_arr_cnt = 0;
			var tmp_arr;
			var first_cpn = "0";
			var v_cpn_crd_dc_amt = 0;

			ord_session_clear();
			
			if ( coupon_idx == undefined || coupon_idx == "N" ){ // 중복쿠폰
				tmp_arr = single_prom;
				tmp_arr_cnt = single_prom_cnt;
				sessionStorage.setItem("dup_cnt_div", "single"); // 중복쿠폰 단독/추가 구분
			}else{ // 1차쿠폰 + 중복쿠폰 사용
				tmp_arr = multi_prom;
				tmp_arr_cnt = multi_prom_cnt;
				first_cpn = (cpnpromno=="0"?prommdclcd:cpnpromno);
				sessionStorage.setItem("dup_cnt_div", "multi"); // 중복쿠폰 단독/추가 구분
			}
			
			if ( tmp_arr_cnt > 0 ){
				for (var i = 0 ; i <  tmp_arr.length  ; i ++ ){
					if ( tmp_arr[i][0] == first_cpn && tmp_arr[i][1] == cpnpromno_dup ){
						v_cpn_crd_dc_amt = tmp_arr[i][2];

						sessionStorage.setItem("prom_no", tmp_arr[i][0]);
						sessionStorage.setItem("dup_prom_no", tmp_arr[i][1]);
						sessionStorage.setItem("fvr_val", tmp_arr[i][2]);
						sessionStorage.setItem("goods_no", tmp_arr[i][3]);
						sessionStorage.setItem("itme_no", tmp_arr[i][4]);
						sessionStorage.setItem("max_fvr_val", tmp_arr[i][5]);
						sessionStorage.setItem("prom_nm", tmp_arr[i][6]);
						sessionStorage.setItem("rsc_mgmt_sn", tmp_arr[i][7]);

						break;
					}
				}

				if ( parseInt( v_cpn_crd_dc_amt) > 0 ){
						promcartsn		= $("#frm_inp input[name=promcartsn_dup]").eq(maxDupIdx).val();
						prommdclcd		= $("#frm_inp input[name=prommdclcd_dup]").eq(maxDupIdx).val();
						fvrpolctpcd		= $("#frm_inp input[name=fvrpolctpcd_dup]").eq(maxDupIdx).val();
						totdcamt		= sessionStorage.getItem("fvr_val");	// 쿠폰할인금액
						cpnpromno		= $("#frm_inp input[name=cpnpromno_dup]").eq(maxDupIdx).val();
						cpnrscmgmtsn		= $("#frm_inp input[name=cpnrscmgmtsn_dup]").eq(maxDupIdx).val();
						adtncostdtlsctnm	= $("#frm_inp input[name=adtncostdtlsctnm_dup]").eq(maxDupIdx).val();
						cardkndcd		= $("#frm_inp input[name=cardkndcd_dup]").eq(maxDupIdx).val();
						includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn_dup]").eq(maxDupIdx).val();
						
						$("#frm_send input[name=promcartsn_dup]").val( promcartsn );
						$("#frm_send input[name=prommdclcd_dup]").val( prommdclcd );
						$("#frm_send input[name=fvrpolctpcd_dup]").val( fvrpolctpcd );
						$("#frm_send input[name=totdcamt_dup]").val( totdcamt );
						$("#frm_send input[name=cpnpromno_dup]").val( cpnpromno );
						$("#frm_send input[name=cpnrscmgmtsn_dup]").val( cpnrscmgmtsn );
						$("#frm_send input[name=adtncostdtlsctnm_dup]").val( adtncostdtlsctnm );
						$("#frm_send input[name=cardkndcd_dup]").val( cardkndcd );
						$("#frm_send input[name=includeSaveInstCpn_dup]").val( includeSaveInstCpn );
				}
			}
		}
	}
	
	//3차 할인
	maxThirdAmt =   getThirdAmt(thirdAmt ,$("#frm_inp input[name=prommdclcd]").eq(maxFirstIdx).val());

	if(set_yn == 'Y' && maxThirdAmt > 0  ){//3차 쿠폰 셋팅
		
		promcartsn		= $("#frm_inp input[name=promcartsn_third]").eq(0).val();
		prommdclcd		= $("#frm_inp input[name=prommdclcd_third]").eq(0).val();
		fvrpolctpcd		= $("#frm_inp input[name=fvrpolctpcd_third]").eq(0).val();
		cpnpromno		= $("#frm_inp input[name=cpnpromno_third]").eq(0).val();
		cpnrscmgmtsn		= $("#frm_inp input[name=cpnrscmgmtsn_third]").eq(0).val();
		adtncostdtlsctnm	= $("#frm_inp input[name=adtncostdtlsctnm_third]").eq(0).val();
		cardkndcd		= $("#frm_inp input[name=cardkndcd_third]").eq(0).val();
		includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn_third]").eq(0).val(); // 2011.05.19 적립여부

		$("#frm_send input[name=promcartsn_third]").val( promcartsn );
		$("#frm_send input[name=prommdclcd_third]").val( prommdclcd );
		$("#frm_send input[name=fvrpolctpcd_third]").val( fvrpolctpcd );
		$("#frm_send input[name=totdcamt_third]").val( thirdAmt );
		$("#frm_send input[name=cpnpromno_third]").val( cpnpromno );
		$("#frm_send input[name=cpnrscmgmtsn_third]").val( cpnrscmgmtsn );
		$("#frm_send input[name=adtncostdtlsctnm_third]").val( adtncostdtlsctnm );
		$("#frm_send input[name=cardkndcd_third]").val( cardkndcd );
		$("#frm_send input[name=includeSaveInstCpn_third]").val( includeSaveInstCpn );
	}	
	maxDcAmt = parseInt(maxFirstAmt) + parseInt(maxDupAmt) + parseInt(maxThirdAmt);
	
	if(set_yn == 'Y'){
		lPointChange();	// L.POINT 재계산 호출
	}
//	console.log("1차할인== "+$("#frm_send input[name=totdcamt]").val());
//	console.log("2차할인== "+$("#frm_send input[name=totdcamt_dup]").val());
//	console.log("3차할인== "+$("#frm_send input[name=totdcamt_third]").val());
//	console.log("총할인== "+maxDcAmt);
	return maxDcAmt;
}

/*** 할인 레이어 내용 만들어주기 ***/
function setDcList(){
	
	var frist_dcamt = Number($("#frm_send input[name=totdcamt]").val());
	var dup_dcamt = Number($("#frm_send input[name=totdcamt_dup]").val()); // 중복쿠폰  
	var third_dcamt = Number($("#frm_send input[name=totdcamt_third]").val()); // 3차쿠폰	
	var adtncostdtlsctnm = $("#frm_send input[name=adtncostdtlsctnm]").val();
	var adtncostdtlsctnm_dup = $("#frm_send input[name=adtncostdtlsctnm_dup]").val();
	var adtncostdtlsctnm_third = $("#frm_send input[name=adtncostdtlsctnm_third]").val();
	var includeSaveInstCpn = $("#frm_send input[name=includeSaveInstCpn]").val();
	var v_dlv_prom_use_yn = $("#dlv_prom_use_yn").val();
	var dlv_prom_amt = Number($("#dlv_fvr_val").val());
	var dcListHtml = "";
	var saveListHtml = "";
	var dc_yn = false;
	//내역 초기화
	$("#dclist").html("");
	$("#savelist").html("");
	//1차 쿠폰 사용
	if (frist_dcamt > 0 ){
		dc_yn = true;
		if(includeSaveInstCpn == "Y" ){
			dcListHtml += "<li>"+adtncostdtlsctnm+"<span>"+new String(frist_dcamt).money()+"점 예정</span></li>";
		}else{
			dcListHtml += "<li>"+adtncostdtlsctnm+"<span>(-) "+new String(frist_dcamt).money()+"원</span></li>";
		}		
	}

	// 중복쿠폰 사용
	if (dup_dcamt > 0){
		dc_yn = true;
		dcListHtml += "<li>"+adtncostdtlsctnm_dup+"<span>(-) "+new String(dup_dcamt).money()+"원</span></li>";
	}

	// 3차쿠폰 사용
	if (third_dcamt > 0){
		dc_yn = true;
		dcListHtml += "<li>"+adtncostdtlsctnm_third+"<span>(-) "+new String(third_dcamt).money()+"원</span></li>";
	}
	
	// 무료배송쿠폰
	if (dlv_prom_use_yn == 'Y' && dlv_prom_amt > 0){
		dc_yn = true;
		dcListHtml += "<li>무료배송권<span>(-) "+new String(dlv_prom_amt).money()+"원</span></li>";
	}
	
	if(dc_yn){				
		$("#dclist").html(dcListHtml);
		$("#dclist").show();
	}else{
		$("#dclist").hide();		
	}

	var totRsrvAplyVal = $("#frm_send input[name=totRsrvAplyVal]").val(); // 상품적립금
	var add_val = ord_pnt_rsrv_yn == 'Y' ? Number('10') : Number('0');
		
	//적립금 표시
	if(Number(totRsrvAplyVal) > 0 || ord_pnt_rsrv_yn == 'Y' ){		
		if(Number(totRsrvAplyVal) > 0){
			if ($("#frm_send input[name=prommdclcd]").val() == "27") {
				if ( ord_pnt_rsrv_yn == 'Y' ) {
					saveListHtml += "<li>적립 L.POINT<span>"+new String(add_val).money()+"점이 적립됩니다.</span></li>";					
				} else {
					saveListHtml += "<li>적립 L.POINT<span>임직원할인 이용 시 적립 대상 제외</span></li>";
				}
			}else{
				saveListHtml += "<li>적립 L.POINT<span>"+new String(Number(totRsrvAplyVal)+ add_val).money()+"점 예정</span></li>";
				saveListHtml += "<li>롯데포인트플러스카드 시<span>"+new String(Number(totRsrvAplyVal)*2+add_val).money()+"점 예정</span></li>";
			}				
		}else {
			if(ord_pnt_rsrv_yn == 'Y'){
				saveListHtml += "<li>적립 L.POINT<span>"+new String(add_val).money()+"점이 적립됩니다.</span></li>";
			}			
		}
		$("#savelist").html(saveListHtml);
		$("#savelist").show();
	}else{		
		$("#savelist").hide();
	}

}

function chkEmpty(obj){
	var empty = false;
	if( $(obj).val() == null || $(obj).val() == "" ){
		empty = true;
	}
	return empty;
}

//안심번호
function closeANSPop(){
			$("#ansimPop,#cover").hide();
			$("#cover").off('click');
	}

function showANSPop(){
		$("#ansimPop,#cover").show();
		$("#cover").on('click',function(){
				closeANSPop();
		});
}

function setCellNo(){
	if( phone_no1 != "" && phone_no2 != "" && phone_no3 != "" ){
		$("select[name=cr_issu_mean_no_phone1]").val(phone_no1);
		$("input[name=cr_issu_mean_no_phone2]").val(phone_no2);
		$("input[name=cr_issu_mean_no_phone3]").val(phone_no3);
	}
}

function lpayCertInfoView(){
	$("#frm_inp select[name=iscmcd]").html(lpayCardStr);
	$("#frm_inp input[name=lpay_type]").prop("checked", false);
	$(".btn_addpay").show(); // L.pay WEB : 결제수단 등록 버튼 가림
}

function lpayCertInfoTemp(){
	lpayCardStr = "";
	$(".box_Lpay_agree_check").css("display","none");

	lpayCardStr = '<option value ="">카드선택</option>';
	lpayCardStr += "" 
				+ "<option value='047' data-card-div='CC' data-card-id='PM002' data-card-anm='롯데카드'  data-card-no='33333' data-card-nm='롯데카드(주)'>롯데카드(주)</option>"
				 
	$("#frm_inp select[name=iscmcd]").html(lpayCardStr);
	lpay_card_list();
	getCardInsCheck();
}

// L.pay WEB : 사용자 인증
function lpayCertInfo(){
	selPayType(4);
	$("#frm_lpay input[name=req_div]:hidden").val("card_req"); // lpay 인증 및 카드 목록 요청
	$("#frm_lpay").submit();
}

//L.pay WEB : 현재 카드 목록 기록
function replaceLpayCardList(){
	lpayCardStr = $("#frm_inp select[name=iscmcd]").html();
	var lpay_html = createLpayMean(); // L.pay WEB : <li> 생성
	if(lpay_html != ""){
		$("#add_lpay_div").html("");
		$("#add_lpay_div").hide();		
	}
	$("#lpay_paymean").html(lpay_html); // L.pay WEB : 카드목록 생성
	$("#lpay_paymean").show();
	$("#loading_block_div").hide();
	toggleAction17(); // 결제수단 정렬
	checkSimpleMaxDc();// 최대할인 금액 및 셋팅
}


function checkSimpleMaxDc(){
	
	//할인 체크		
	var lpay_id_array = lpay_id_list.split(',');
	var lpay_iscmcd_array = lpay_iscmcd_list.split(',');
	var lpay_index_array = lpay_index_list.split(','); 
	var maxLpayDcAmt = 0;
	var maxLpayIscmcd = "";
	var maxLpayId = "";
	var maxLpayIndex = "";
	//lpay_iscmcdnm_list
	if(lpay_id_list == ""){
		//사용가능한 엘페이 카드가 없을 시 제한 없는 최대 할인금액 셋팅
		lpay_card_set = true;
		setMaxDcNew('N','Y');
		getCardInsCheck();
		paycardinstmon();
		//금액 재계산
		fn_calcTotalPrice();
		//할인상세 레이어 갱신
		setDcList();
	}else{
		for (var lpay_idx = 0; lpay_idx < lpay_id_array.length; lpay_idx++) {
			lpay_card_set = false;
			if(lpay_idx == 0){
				maxLpayDcAmt = setMaxDcNew(lpay_iscmcd_array[lpay_idx],'N');
				maxLpayIscmcd = lpay_iscmcd_array[lpay_idx];
				maxLpayId = lpay_id_array[lpay_idx];
				maxLpayIndex = lpay_index_array[lpay_idx];			
			}else if(maxLpayDcAmt < setMaxDcNew(lpay_iscmcd_array[lpay_idx],'N')){
				maxLpayDcAmt = setMaxDcNew(lpay_iscmcd_array[lpay_idx],'N');
				maxLpayIscmcd = lpay_iscmcd_array[lpay_idx];
				maxLpayId = lpay_id_array[lpay_idx];
				maxLpayIndex = lpay_index_array[lpay_idx];
			}		
		}
	}

	var ttotsttlamt = $("#frm_inp input[name=defaulttotsttlamt]:hidden").val();

	//카드 제약없이 결제시 최대 할인금액이 현재 카드 할인금액보다 클경우
    if(tot_dc_amt > maxLpayDcAmt && !lpay_card_set ){   	
    	var beni_card_id_text = tot_dc_iscmcdnm+" 결제시 : "+new String(parseInt(ttotsttlamt) - tot_dc_amt).money()+"원";
    	$("#beni_card_id").text(beni_card_id_text);
    	$("#beni_card_id").show();
    }else{    	    	
    	$("#beni_card_id").hide();    	
    }

    if(maxLpayId != ""){
    	paySelect(maxLpayId, maxLpayIndex);
    }
    
}

//L.pay 간편결제 서비스 이용안내 레이어
function LpayAgreeCheckLayer() {
	if ($(".box_Lpay_agree_check .txt01").css('display') == 'none' )
	{
		$(".box_Lpay_agree_check").addClass("open");
	} else {
		$(".box_Lpay_agree_check").removeClass("open");
	}
}

//L.pay 비밀번호 입력안내 레이어 닫기
function fn_useLPayLPointCancel(){
	$(".laver_Lpay_order").hide();
	$("#useLottePoint").hide();
	if($("#chk_lt_point").prop("checked") == true){
		$("#chk_lt_point").trigger("click");
	}
	if($("input[name=temp_paytype]:hidden").val() != 3){
		$("#temp_lt_point_amt").val("");
	}
}
// L.pay 카드 등록
function lpay_card_reg(){
	$("#X_ANSIM_FRAME").attr("src","/lpay/callDLP.jsp?lpay_id=LP-PM-IAPI-03-002");
}
// L.pay 앱 연결
function lpay_lnk_app(){
	$("#X_ANSIM_FRAME").attr("src","https://www.lpay.com/dlp/ldc/appInstall");
}

// L.pay 카드 종류 생성
function lpay_card_list(){
	var lpay_html = "<div id='lpay_list'><h3>L.Pay 간편결제 선택</h3>";
	var lpay_yn = "N";
	
	
	$("#frm_inp select[name=iscmcd] option").each(function(){
		var card_cd = $(this).val();
		var card_nm = $(this).text();;

		if(card_cd != ""){
			lpay_html += "<radiobox-list class='ng-scope'>"
						 + "	<radiobox class='combo'>";

			lpay_html += "		<input type='radio' name='lpay_type' value='"+$(this).val()+"' onClick='lpay_card_click(\""+$(this).attr("data-card-id")+"\")' data-card-nm='"+$(this).attr("data-card-nm")+"'  class='radio01' data-card-id='"+$(this).attr("data-card-id")+"'>";
			lpay_html += "		<label for='pay_type_n0' class='ng-binding'>"+$(this).text()+" </label>"
						 + "	</radiobox>			"
						 + "</radiobox-list>";

			lpay_yn = "Y";
		}


	});
	lpay_html += "</div>";

	if(lpay_yn == "Y"){
		$("#lpay_list").html(lpay_html);
	}else{
		lpayListCheck();
	}
}

function lpay_card_click(id){
	$("#frm_inp select[name=iscmcd] option").each(function(){
		if($(this).attr("data-card-id") == id){
			$(this).prop("selected", true);
		}
	});

	$("#frm_inp select[name=iscmcd]").change();

	if($("#frm_inp select[name=iscmcd]").val() != ""){
		if("Y" == card_sale_yn || "Y" == claim_sale_yn){
			fn_cardsavegoods();
		}
	}
}

var filterBarScroll = null;

//20150629 단일 배송지 주소 변경 start
function listOpen(ck,deli_cnt) {

	//복수 배송지 순번 저장
	$('#sel_deli_cnt').val(deli_cnt);

	//선택한 배송지를 배송지 레이어에 자동 선택
	var deli_idx = $('#sel_deli_cnt').val();
	var deli_dlvp_sn = $("#deli_" + deli_idx + " #li_mine #deli_select_" + deli_idx).val();

	$('input[type=radio][value='+deli_dlvp_sn+']').trigger("click");

	//레이어 팝업 띄우기
	var _$opLayer = $( '.addr_list_layer' ),
			_$optionBtn = $( '.addr_list_open' ),
			_$opLayerBg = $( '.addr_list_bg' );

	var _open = false;

	if ( ck=='1' ) {
		optionLayerHandler();
	} else if ( ck=='2' ) {
		_$opLayer = $( '.addr_list_layer2' );
		optionLayerHandler();
	}

	function optionLayerHandler () {
		if(_open){
			$("#pageCover").hide();
			_$opLayer.css({"bottom":(-_$opLayer.height()-12) + 'px',"z-index":0});
			_$optionBtn.removeClass( 'on' );
		}
		else{
			$("#pageCover").show();
			_$opLayer.css({"bottom":0,"z-index":"9999"});
			_$optionBtn.addClass( 'on' );
		}
		return false;
	}

	//하단 필터바 스크롤( egScroll 생성 ) 2017.01.17 수정
	filterBarScroll = $( '#filterType' ).egScroll( true, false, true );
	$( '#filterType2' ).egScroll( true, false );

} ;

//배송지 목록 내 수정 버튼
function btnModi() {

		var _$opLayer = $( '.addr_list_layer' ),
			_$optionBtn = $( '.addr_list_open' ),
			_$opLayerBg = $( '.addr_list_bg' );

		var _open = false;

		changeInfo('1');
		 _$opLayerBg.hide();
			$B( _$opLayer[0] ).transition( 'bottom:' + (-_$opLayer.height()-12) + 'px', 'bottom 0.3s ease', { onTransitionEnd : function (e) {
				_open = false;
			} });
			_$optionBtn.removeClass( 'on' );

		}

//배송지 삭제 더블클릭 방지
var delete_flag = false;

// 배송지정보 삭제
function deleteDlvpInfo(dlvp_sn, mbr_no){
	//간편회원의 경우 기본배송지가 없어 마지막 배송지를 남겨둔다
	if($("#filterType >ul >li").size() == 1){
		alert("마지막 배송지입니다.");
		return false;
	}

	if(confirm('내 배송지 목록에서 삭제하시겠습니까?')){
		if (!delete_flag) {

			//배송지 삭제 더블클릭 방지
			delete_flag = true;

			//배송지 리스트내 첫번째 배송지순번값 확인
			var $target = $("#filterType >ul >li[data-dlvpSn=" + dlvp_sn + "]"),
				dataIdx = $target.data("idx");

			//배송지 삭제
			$.ajax({
				type: "post",
				async: false,
				url: "/popup/delete_deli.do?dlvp_sn="+dlvp_sn+"&index="+dataIdx+"&mbr_no="+mbr_no,
				success: function(resp) {

					if(resp=="0000"){
						alert("ok");
					}

					var idx = $target.index();

					for (var i = idx + 1; i < $("#filterType >ul >li").length; i++) {
						var tmpIdx = $("#filterType >ul >li").eq(i).attr("data-idx");
						$("#filterType >ul >li").eq(i).attr("data-idx", tmpIdx - 1);
					}

					//선택 배송지 삭제 후 refresh
					$target.remove();
					filterBarScroll.refresh();

					delete_flag = false;

					return true;
				}
			});
		} else {
			alert("배송지 삭제중입니다.");
		}
	}

}

//배송지 목록 내 선택완료
function btnComplate() {

	if(!$('input:radio[name="detail_list"]').is(":checked")){
		alert("배송지를 선택해 주세요");
		return false;
	};

	var _$opLayer = $( '.addr_list_layer' ),
		_$optionBtn = $( '.addr_list_open' ),
		_$opLayerBg = $( '.addr_list_bg' );
	var _open = false;

	$("#pageCover").hide();
	_$opLayer.css({"bottom":(-_$opLayer.height()-12) + 'px',"z-index":0});
	_$optionBtn.removeClass( 'on' );
	_open = false;

	// 받는 사람  셋팅
	var $tmp_addr = $('input:radio[name="detail_list"]:checked');

	var deli_idx = $('#sel_deli_cnt').val();
	$("#deli_"+deli_idx+" dd[class*=deli_]").hide();
	$("#deli_"+deli_idx+" dd.deli_" + $tmp_addr.data('d12')).show();

	$("#deli_" + deli_idx + " #li_mine #selectedRmitNmList").html($("#deli_"+deli_idx+" #deliVal_rmitnm_" + $tmp_addr.data('d12')).val() + " (" + $("#deli_"+deli_idx+" #deliVal_dlvpnm_" + $tmp_addr.data('d12')).val() + ")");
	$("#deli_" + deli_idx + " #li_mine #deli_select_" + deli_idx).val($tmp_addr.data('d12') );
	$("#deli_" + deli_idx + " #li_mine #deli_selected_no_" + deli_idx).val($tmp_addr.data('d16') );
	$("#deli_" + deli_idx + " #li_mine input[name=inprmitnm]").val( $("#deli_"+deli_idx+" #deliVal_rmitnm_" + $tmp_addr.data('d12')).val() );
	$("#deli_" + deli_idx + " #li_mine input[name=inpdlvpnm]").val( $("#deli_"+deli_idx+" #deliVal_dlvpnm_" + $tmp_addr.data('d12')).val() );
	$("#deli_" + deli_idx + " #li_mine input[name=inpzip1]").val( $("#deli_"+deli_idx+" #deliVal_zip1_" + $tmp_addr.data('d12')).val() );
	$("#deli_" + deli_idx + " #li_mine input[name=inpzip2]").val( $("#deli_"+deli_idx+" #deliVal_zip2_" + $tmp_addr.data('d12')).val() );
	$("#deli_" + deli_idx + " #li_mine input[name=inpaddr1]").val( $("#deli_"+deli_idx+" #deliVal_addr1_" + $tmp_addr.data('d12')).val() );
	$("#deli_" + deli_idx + " #li_mine input[name=inpaddr2]").val( $("#deli_"+deli_idx+" #deliVal_addr2_" + $tmp_addr.data('d12')).val() );
	$("#deli_" + deli_idx + " #li_mine input[name=stnm_inp_zip1]").val( $("#deli_"+deli_idx+" #deliVal_stnmzip1_" + $tmp_addr.data('d12')).val() );
	$("#deli_" + deli_idx + " #li_mine input[name=stnm_inp_zip2]").val( $("#deli_"+deli_idx+" #deliVal_stnmzip2_" + $tmp_addr.data('d12')).val() );
	$("#deli_" + deli_idx + " #li_mine input[name=stnm_inp_addr1]").val( $("#deli_"+deli_idx+" #deliVal_stnmaddr1_" + $tmp_addr.data('d12')).val() );
	$("#deli_" + deli_idx + " #li_mine input[name=stnm_inp_addr2]").val( $("#deli_"+deli_idx+" #deliVal_stnmaddr2_" + $tmp_addr.data('d12')).val() );

	//메시지카드 작성 여부 체크해서 배송지순번 넣어서 event 발생
	if( $("input[name=gift_yn_" + deli_idx + "]:radio").prop("checked") ){
		$("input[name=gift_yn_" + deli_idx + "]:radio").eq(0).prop("checked", true);
		$("input[name=gift_yn_" + deli_idx + "]:radio").eq(0).click();
	}

	// 배송옵션 컨트롤 추가, 2014-12-30, hglee4
	switchDeliOption("mine", deli_idx, $tmp_addr.data('d12'));

	//sendTclick('order_ClkW_Btn_1');
}
// 20150629 단일 배송지 주소 변경 end

//배송지 목록 내 취소
function btnCancel() {
	var _$opLayer = $( '.addr_list_layer' ),
		_$opLayerBg = $( '.addr_list_bg' );
	$("#pageCover").hide();
	_$opLayer.css({"bottom":(-_$opLayer.height()-12) + 'px',"z-index":0});
	_open = false;
}
// 20160302 취소버튼 추가

function chImg(objThis, i) {
	objThis.src="http://image.lotte.com/lotte/images/common/product/no_"+i+".gif";
}

$(window).load(function(){ //SSH	
	//간편회원  or 비회원일으로 인입 시 닫아버리기  
	if(order_f){
		if(resMsg != ""){
			alert(resMsg);
		}
		fn_close('2');
		return;
	}else if(simple_mem_yn == 'Y' || grockle_yn == 'Y' || lpayPsbYn != 'Y'){
		fn_close('2');
		return;
	}
	
	toggleAction17();
	payScrollView(1);
	
	sendTclick('Sporder_load');
	
	$("#card_nm_list").html(cardNmStr);
	cardSaleView(); //청구할인 노출

	// 아래부터 주문서에서 가져온 js

	// 주문 내역 확인 동의
	$(".box_agree_check .tit_agree_check span").bind("click", function(){
		$(this).parent().toggleClass("show").next().toggle();
	});

	// 오류로 개인정보보호 브라우징 여부체크
	try{
		sessionStorage.setItem("safe_browsing", "Y");
		sessionStorage.removeItem("safe_browsing");
	}catch(e){
		alert('아이폰 설정을 확인/수정하시기 바랍니다. [설정]>[Safari]>[개인정보 보호 브라우징] 해제');
	}

	// 초기화
	init();
	init_cardinstmon();
	init_payMean();
	
	tot_dc_amt = setMaxDcNew('N','N'); //lpay 카드 제한 없이 기본 최대할인금액 구하기
	
	// 카드 선택시 할부정보 UI 구현 
	$("#frm_inp select[name=iscmcd]").change(function () {
		getCardInsCheck();

		$('.inlineBorder').removeClass('active');
		$("#cardList_"+$("#frm_inp select[name=iscmcd]").val()).addClass('active');
	});
		
	if ( $("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_CARD ) {
		createCardType();
		$("#pay_card").show();
	} else if  ( $("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_BANK ) {
		$("#pay_bank").show();
	} else if  ( $("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_LPAY ) {
		lpayCertInfoView();
		$("#pay_card").show();
	}

	// 무통장 입금만 존재할 경우 현금영수증 영역 제어
	if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_BANK){
		$("#cash_receipts").show(); // 현금영수증 영역 보이기
	}


	var selFlag = false;
	var histPayMeanCd = $("#frm_inp input[name=op_pay_mean_hist_pay_mean_cd]").val();

	coupon_cardcd_dup	= $("#frm_send input[name=cardkndcd_dup]").val();

	// 저장된 결제수단이 존재하는지 여부 체크
	$("input[name=rdo_paytype]:radio").each(function(){
		if( $(this).val() == histPayMeanCd ){
			//$(this).click();
			selFlag = true;
		}
	});


	maxdc_yn = "N";	//최대할인 노출여부	
	allPointView();
	paycardinstmon();

});

// 상품 크로스픽 <-> 일반택배 변경
function chgCrspkWithNormal(div, cart_sn, crspk_corp_cd, crspk_corp_str_sct_cd, crspk_str_no, frame_close_yn){
	// 크로픽으로 변환 시 점 정보 체크
	if (div == 'C' && (crspk_corp_cd==null || crspk_corp_str_sct_cd==null || crspk_str_no==null || crspk_corp_cd=="" || crspk_corp_str_sct_cd=="" || crspk_str_no=="")) { // C:toCrspk, N:toNormal
		alert('지정된 스마트픽 핃업 지점 정보가 존재하지 않습니다.');
		return;
	}

	// 파라메터 생성
	var params = '{"div":"'+div+'", "cart_sn":"'+cart_sn+'"';
	if (crspk_corp_cd!=null && crspk_corp_str_sct_cd!=null && crspk_str_no!=null){
		params += ',"crspk_yn":"Y"';
		params += ',"crspk_corp_cd":"'+crspk_corp_cd+'"';
		params += ',"crspk_corp_str_sct_cd":"'+crspk_corp_str_sct_cd+'"';
		params += ',"crspk_str_no":"'+crspk_str_no+'"';
	}else{
		params += ',"crspk_yn":"N"';
		params += ',"crspk_corp_cd":""';
		params += ',"crspk_corp_str_sct_cd":""';
		params += ',"crspk_str_no":""';
	}
	params += '}';

	// 업데이트
	$.ajax({
		type: "POST",
		url: "/json/mylotte/cart/chgCrspkWithNormal.json",
		data: JSON.parse(params),
		dataType: "json",
		success: function(data){
			alert(data.result.response_msg);

			if (data.result.response_code == "0000"){ // 변경 성공 시 오픈창 닫기
				if (frame_close_yn=="Y"){ // 팝업 창에서 실행 했으면 팝업창 닫기
					$("#searchMartPop").hide();
				}
				$("#pageCover").show();
				$("#pageLoading").show();
				location.reload();
			}
		}
	});
}

//크로스픽 지도 위치 조회
function searchMartResult(cart_sn){
	var crspk_map_url = "/smartpick/crosspick_map.do";
	var param = "?chg_attr_yn=Y";

	param += "&cart_sn="+cart_sn;

	// iframe 보이기 및 url, parameter 셋팅
	$("#searchMartPop").show();
	$("#searchMartPop").find("iframe").attr("src", crspk_map_url + param);
}

// 크로스픽 지도 닫기
function searchMartClose(){
	$("#searchMartPop").hide();
	$("#searchMartPop").find("iframe").attr("src", "");
}


/**************************************************************
 * 퀵배송추가 휴무/배송지서울체크 S
 **************************************************************/
function fn_chkDeliDeptClose(){

	var returnYn = true;
	var qs_yn = $("#frm_send input[name=qs_yn]:hidden").val(); //퀵배송정보


	if(typeof(qs_yn) != "undefined" && qs_yn == 'Y'){

		var postno = "";
		var postno1 = "";

		if( "Y" == grockle_yn ){	// 비회원
			postno = $("#frm_inp input[name=inpzip1]:hidden").val() + $("#frm_inp input[name=inpzip2]:hidden").val();
		}else{ //회원
			postno = $("#frm_send input[name=dlvzip]").val();
		}

		if(typeof(postno) == "undefined" || postno == ""){
			alert("우편번호가 저장되어있지 않아 배송지 정보를 알수 없습니다.\n새 배송지를 입력하여 다시 시도해주세요!");
			return false;
		}

		$.ajax({
			async:false,
			url:"/mylotte/searchDlvChk_quick.do",
			dataType:"json",
			data:{post_no : postno},
			success:function(result){
				if(result.success){
					if(result.postyn == "Y"){
						if(result.dpclose != 'Y'){
							alert("공휴일 및 롯데백화점 본점 휴무일, \n배송마감일에는 \n퀵 배송 주문이 불가합니다.");
							returnYn = false;
						}
						if(result.timeyn != 'Y'){
							alert("퀵 배송 주문은 09:00~16:30에만 가능합니다.");
							returnYn = false;
						}
					}else{
						alert("서울지역만 퀵 배송이 가능합니다.\n배송지를 다시 입력해 주세요.");
						returnYn = false;
					}
				}else{
					alert("서버와 통신 조회중 입니다. 결제하기 버튼을 다시 클릭해 주세요.");
					returnYn = false;
				}
			}
		});
	}
	return returnYn ;
}


/**************************************************************
 * 퀵배송추가 배송비 S  총주문금액(배송비미포함), 배송비, 할인금액, 총결제금액
 **************************************************************/
function fn_quicDeliAmtChk(quickOrdAmt, tot_deli_amt, all_dc_amt, totpayamt){

	var stdamt = $("#frm_send input[name=stdamt]:hidden").val(); //퀵배송정보 배송기준금액 100000
	var deliamtup = $("#frm_send input[name=deliamtup]:hidden").val(); //퀵배송정보 기준 이하금액일때 10000
	var deliamtdown = $("#frm_send input[name=deliamtdown]:hidden").val(); //퀵배송정보 기준 이상금액일때5000
	var deliamt = 0;//퀵배송비

	totpayamt   = ((parseInt(quickOrdAmt) - parseInt(all_dc_amt)) - parseInt(tot_deli_amt)).toString() ; //총주문금액 - 할인금액 - 배송비
	quickOrdAmt = parseInt(quickOrdAmt) - parseInt(tot_deli_amt);
//		alert("1 : totpayamt : " + totpayamt + " / quickOrdAmt :  " + quickOrdAmt + " / tot_deli_amt : " + tot_deli_amt);

	if(parseInt(totpayamt) >= parseInt(stdamt)){ //기준금액 이상주문시
		deliamt   = deliamtdown ;
	}else{ //기준금액 미만주문시
		deliamt   = deliamtup ;
	}
	totpayamt   = (parseInt(totpayamt) + parseInt(deliamt)).toString() ; //결제금액에 배송비를 추가해준다.
	quickOrdAmt = parseInt(quickOrdAmt) + parseInt(deliamt); //총주문금액 재계산 (순주문금액+배송비)

//		alert(totpayamt + " / " + deliamt);

	$("#frm_inp input[name=defaulttotsttlamt]:hidden").val(quickOrdAmt); // 배송비가 합쳐 있는 금액
	$("#frm_inp input[name=totsttlamt]:hidden").val(quickOrdAmt); // 배송비가 합쳐 있는 금액
	$("#bene_tot_amt").find("span").text( String(quickOrdAmt).money() + "원" );
	$("#frm_inp input[name=totordamt]:hidden").val(quickOrdAmt);
	$("#totalOrdAmt").html( "<strong>" + String(quickOrdAmt).money() + "</strong>원<span>(배송비포함)</span>");

	$("#frm_inp input[name=orgtotdeliamt]:hidden").val(deliamt); // 배송비
	$("#frm_inp input[name=caltotdeliamt]:hidden").val(deliamt);// 배송비
	$("#frm_send input[name=totdeliamt]:hidden").val(deliamt); // 배송비
	$("#bene_group_deli_amt_1").find("span").attr("dlex", deliamt);
	$("#bene_group_deli_amt_1").find("span").html(deliamt.money() + "<span class=\"no_bold\">원</span>");
	$("#quickDeliAmt").text( deliamt.money());
	return totpayamt;
}
/**************************************************************
 * 퀵배송추가 배송비 E
 **************************************************************/

/**************************************************************
 * 주문서 혜택내역 UI구현
 **************************************************************/
function fn_all_dc(){
	var firstYn = "Y";
	var all_dv_html = "";

	if($('.max_discount').hasClass('on')){
		if($("#frm_send input[name=prommdclcd]").val() != ""){

			if(firstYn == "Y"){
				all_dv_html = "<ul>"
							+ "<li class='list_depth2'>"
							+ "<div class='left'>"
							+ "<span class='coupon_title'>" + $("#frm_send input[name=adtncostdtlsctnm]").val() + "</span>"
							+ "<div class='coupon_wrap' onclick=\"javascript:$('.coupon_pop').show(); scrollYN('N','');sendTclick('Sporder_clk_Pop2');\">"
							+ "<a href='#' class='coupon'>쿠폰변경</a>"
							+ "</div></div>"
							+ "<p class='right middle short_blind ' style='display:block;'>"+($("#frm_send input[name=includeSaveInstCpn]").val()!="Y"?"(-)":"")+ $("#frm_send input[name=totdcamt]").val().money() + ($("#frm_send input[name=includeSaveInstCpn]").val()!="Y"?"원":"점 적립")+"</p>";

				firstYn = "N";
			}
		}
		if($("#frm_send input[name=prommdclcd_dup]").val() != ""){


			if(firstYn == "Y"){
				all_dv_html = "<ul>"
							+ "<li class='list_depth2'>"
							+ "<div class='left'>"
							+ "<span class='coupon_title'>" + $("#frm_send input[name=adtncostdtlsctnm_dup]").val() + "</span>"
							+ "<div class='coupon_wrap' onclick=\"javascript:$('.coupon_pop').show(); scrollYN('N','');sendTclick('Sporder_clk_Pop2');\">"
							+ "<a href='#' class='coupon'>쿠폰변경</a>"
							+ "</div></div>"
							+ "<p class='right middle short_blind' style='display:block;'>"+($("#frm_send input[name=includeSaveInstCpn_dup]").val()!="Y"?"(-)":"")+ $("#frm_send input[name=totdcamt_dup]").val().money() + ($("#frm_send input[name=includeSaveInstCpn_dup]").val()!="Y"?"원":"점 적립")+"</p>";
				firstYn = "N";
			}else{
				all_dv_html +="<li class='list_depth2'>"
							+ "<p class='left coupon_name'>"+ $("#frm_send input[name=adtncostdtlsctnm_dup]").val() +"</p>"
							+ "<p class='right short_blind' style='display:block;'>"+($("#frm_send input[name=includeSaveInstCpn_dup]").val()!="Y"?"(-)":"")+ $("#frm_send input[name=totdcamt_dup]").val().money() + ($("#frm_send input[name=includeSaveInstCpn_dup]").val()!="Y"?"원":"점 적립")+"</p>";
							+ "</li>";
			}
		}
		if($("#frm_send input[name=prommdclcd_third]").val() != ""){

			if(firstYn == "Y"){
				all_dv_html = "<ul>"
							+ "<li class='list_depth2'>"
							+ "<div class='left'>"
							+ "<span class='coupon_title'>" + $("#frm_send input[name=adtncostdtlsctnm_third]").val() + "</span>"
							+ "<div class='coupon_wrap' onclick=\"javascript:$('.coupon_pop').show(); scrollYN('N','');sendTclick('Sporder_clk_Pop2');\">"
							+ "<a href='#' class='coupon'>쿠폰변경</a>"
							+ "</div></div>"
							+ "<p class='right middle short_blind' style='display:block;'>(-)"+ $("#frm_send input[name=totdcamt_third]").val().money() +"원</p>";
				firstYn = "N";
			}else{
				all_dv_html +="<li class='list_depth2'>"
							+ "<p class='left coupon_name'>"+ $("#frm_send input[name=adtncostdtlsctnm_third]").val() +"</p>"
							+ "<p class='right short_blind' style='display:block;'>(-)"+ $("#frm_send input[name=totdcamt_third]").val().money() +"원</p>"
							+ "</li>";
			}
		}
		if( $("#frm_inp input[name=free]:radio:checked").val() == "Y" && freeShippingYn != "Y"){
			if(firstYn == "Y"){
				all_dv_html = "<ul>"
							+ "<li class='list_depth2'>"
							+ "<div class='left'>"
							+ "<span class='coupon_title'>무료배송권</span>"
							+ "<div class='coupon_wrap' onclick=\"javascript:$('.coupon_pop').show(); scrollYN('N','');sendTclick('Sporder_clk_Pop2');\">"
							+ "<a href='#' class='coupon'>쿠폰변경</a>"
							+ "</div></div>"
							+ "<p class='right short_blind' style='display:block;'>(-)"+ $("#dlv_fvr_val").val().money() +"원</p>";
				firstYn = "N";
			}else{
				all_dv_html +="<li class='list_depth2'>"
							+ "<p class='left coupon_name'>무료배송권</p>"
							+ "<p class='right short_blind' style='display:block;'>(-)"+ $("#dlv_fvr_val").val().money() +"원</p>"
							+ "</li>";
			}
		}
	}else{
		if($("#frm_send input[name=prommdclcd]").val() != "N" && $("#frm_send input[name=prommdclcd]").val() == "10"){
			if(firstYn == "Y"){
				all_dv_html = "<ul>"
							+ "<li class='list_depth2'>"
							+ "<div class='left'>"
							+ "<span class='coupon_title'>" + getCardNm($("#frm_send input[name=cardkndcd]").val()) + "카드 할인이 적용되어 있습니다.</span>"
							+ "<div class='coupon_wrap off' onclick=\"javascript:$('.coupon_pop').show(); scrollYN('N','');sendTclick('Sporder_clk_Pop2');\">"
							+ "<a href='#' class='coupon'>쿠폰변경</a>"
							+ "</div></div>"
							+ "<p class='right middle short_blind'>"+ $("#frm_send input[name=totdcamt]").val().money() +"원</p>";

				firstYn = "N";
			}
		}

		if($("#frm_send input[name=prommdclcd_dup]").val() != "" && $("#frm_send input[name=cardkndcd_dup]").val() != ""){
			if(firstYn == "Y"){
				all_dv_html = "<ul>"
							+ "<li class='list_depth2'>"
							+ "<div class='left'>"
							+ "<span class='coupon_title'>" + getCardNm($("#frm_send input[name=cardkndcd_dup]").val()) + "카드 쿠폰이 적용되어 있습니다.</span>"
							+ "<div class='coupon_wrap off' onclick=\"javascript:$('.coupon_pop').show(); scrollYN('N','');sendTclick('Sporder_clk_Pop2');\">"
							+ "<a href='#' class='coupon'>쿠폰변경</a>"
							+ "</div></div>"
							+ "<p class='right middle short_blind'>(-)"+ $("#frm_send input[name=totdcamt_dup]").val().money() +"원</p>";
				firstYn = "N";
			}else{
				all_dv_html +="<li class='list_depth2'>"
							+ "<p class='left coupon_name'>"+ getCardNm($("#frm_send input[name=cardkndcd_dup]").val()) + "카드 쿠폰이 적용되어 있습니다.</span>"
							+ "<p class='right short_blind'>(-)"+ $("#frm_send input[name=totdcamt_dup]").val().money() +"원</p>"
							+ "</li>";
			}
		}

		if($("#frm_send input[name=prommdclcd_third]").val() != ""){
			if(firstYn == "Y"){
				all_dv_html = "<ul>"
							+ "<li class='list_depth2'>"
							+ "<div class='left'>"
							+ "<span class='coupon_title'>일시불 할인이 적용되어 있습니다.</span>"
							+ "<div class='coupon_wrap off' onclick=\"javascript:$('.coupon_pop').show(); scrollYN('N','');sendTclick('Sporder_clk_Pop2');\">"
							+ "<a href='#' class='coupon'>쿠폰변경</a>"
							+ "</div></div>"
							+ "<p class='right middle short_blind'>(-)"+ $("#frm_send input[name=totdcamt_third]").val().money() +"원</p>";
				firstYn = "N";
			}else{
				all_dv_html +="<li class='list_depth2'>"
							+ "<p class='left coupon_name'>일시불 할인이 적용되어 있습니다.</p>"
							+ "<p class='right short_blind'>(-)"+ $("#frm_send input[name=totdcamt_third]").val().money() +"원</p>"
							+ "</li>";
			}
		}
	}

	if(firstYn == "N"){
		all_dv_html += "</ui>";
	}else{
		if( (($("#frm_inp input[name=prommdclcd]").val() != "" && $("#frm_inp input[name=prommdclcd]").val() != undefined)
			|| ($("#frm_inp input[name=prommdclcd_dup]").val() != "" && $("#frm_inp input[name=prommdclcd_dup]").val() != undefined)
			|| ($("#frm_inp input[name=prommdclcd_third]").val() != "" && $("#frm_inp input[name=prommdclcd_third]").val() != undefined)
			|| $("#dlv_prom_use_yn").val() == "Y") && $('.max_discount').hasClass('on')) {
			all_dv_html = "<ul>"
				+ "<li class='list_depth2'>"
				+ "<div class='left'>"
				+ "<span class='coupon_title'></span>"
				+ "<div class='coupon_wrap off' onclick=\"javascript:$('.coupon_pop').show(); scrollYN('N','');sendTclick('Sporder_clk_Pop2');\">"
				+ "<a href='#' class='coupon'>쿠폰변경</a>"
				+ "</div></div>"
				+ "<p class='right middle short_blind'></p>";
		}
	}

	$("#amount_detail_list").html(all_dv_html);
	fn_all_dc_view();
}

function fn_all_dc_view(){
	//1차 전체 영역이 있는지 체크
	var coupon_1 = "N";
	var coupon_2 = "N";
	var coupon_3 = "N";
	var coupon_4 = "N";
	var totRsrvAplyVal = $("#frm_send input[name=totRsrvAplyVal]").val();
	var temp_dcamt ="";

	$("#amount_detail_list").removeClass('bb_none');
	$("#pointUse").removeClass('bb_none');
	$("#li_lottepointSave").removeClass('bb_none');
	$("#li_totRsrvAplyVal").removeClass('bb_none');

	if( ($("#frm_inp input[name=prommdclcd]").val() != "" && $("#frm_inp input[name=prommdclcd]").val() != undefined)
			|| ($("#frm_inp input[name=prommdclcd_dup]").val() != "" && $("#frm_inp input[name=prommdclcd_dup]").val() != undefined)
			|| ($("#frm_inp input[name=prommdclcd_third]").val() != "" && $("#frm_inp input[name=prommdclcd_third]").val() != undefined)
			|| $("#dlv_prom_use_yn").val() == "Y"){
		coupon_1 = "Y";
	}

	if($("#lt_point_amt").val() != "" && $("#lt_point_amt").val() != undefined ||
			$("#lpoint_amt").val() != "" && $("#lpoint_amt").val() != undefined ||
			$("#deposit_amt").val() != "" && $("#deposit_amt").val() != undefined){
		coupon_2 = "Y";
	}

	if( $("#frm_send input[name=includeSaveInstCpn]").val() != 'Y' ){ // 할인선택값에 대한 적립여부 체크
		temp_dcamt = 0;
	}else{
		temp_dcamt = dcamt;
	}

	if(Number(totRsrvAplyVal) > 0){
		coupon_3 = "Y";
	}

	if($("#frm_send input[name=prommdclcd]").val() != "27" && (Number(totRsrvAplyVal) + Number(temp_dcamt)) > 0 ){
		coupon_4 = "Y";
	}

	if(coupon_1 == "Y" || coupon_2 == "Y" || coupon_3 == "Y" || coupon_4 == "Y"){
		$("#amount_detail").show();
		if($('.max_discount').hasClass('on')){
				if(coupon_1 == "Y"){
				$("#amount_detail_list").show();

				if(coupon_2 != "Y" && coupon_3 != "Y"){
					$("#amount_detail_list").addClass('bb_none');
				}
			}else{
				$("#amount_detail_list").hide();
			}

				if(coupon_2 == "Y"){
				$("#pointUse").show();

				if(coupon_3 != "Y"){
					$("#pointUse").addClass('bb_none');
				}
			}else{
				$("#pointUse").hide();
			}

				if(coupon_3 == "Y"){
				$("#li_lottepointSave").show();
				$("#li_lottepointSave").addClass('bb_none');
			}else{
				$("#li_lottepointSave").hide();
			}

				$("#li_totRsrvAplyVal").hide();
				$('.list_depth2 .coupon_wrap').removeClass('off');
				$('.right.short_blind').show();
			}else{
				if((coupon_1 == "Y")
						&&  ($("#frm_send input[name=prommdclcd]").val() != "N" && $("#frm_send input[name=prommdclcd]").val() == "10"
							|| $("#frm_send input[name=prommdclcd_dup]").val() != "" && $("#frm_send input[name=cardkndcd_dup]").val() != ""
							|| $("#frm_send input[name=prommdclcd_third]").val() != "")){
				$("#amount_detail_list").show();

				if(coupon_4 != "Y"){
					$("#amount_detail_list").addClass('bb_none');
				}
			}else{
				$("#amount_detail_list").hide();
			}
				$("#pointUse").hide();
				$("#li_lottepointSave").hide();
				if(coupon_4 == "Y"){
				$("#li_totRsrvAplyVal").show();
				$("#li_totRsrvAplyVal").addClass('bb_none');
				//$("#general_paymean")

			}else{
				$("#li_totRsrvAplyVal").hide();
			}
				$('.list_depth2 .coupon_wrap').addClass('off');
				$('.right.short_blind').hide();
			}
	}else{
		$("#amount_detail").hide();	//전체쿠폰혜택 닫기

	}

	//혜택영역 접힌 상태에서 노출되는 안내문구가 없을때 쿠폰혜택영역 hide처리
	if((!$('.max_discount').hasClass('on'))
			&& (!($("#frm_send input[name=prommdclcd]").val() != "N" && $("#frm_send input[name=prommdclcd]").val() == "10"
			||  $("#frm_send input[name=prommdclcd_dup]").val() != "" && $("#frm_send input[name=cardkndcd_dup]").val() != ""
			||  $("#frm_send input[name=prommdclcd_third]").val() != ""
			|| coupon_4 == "Y"))){
		$("#amount_detail").hide();
	}
}

function pointUse(){
	//lt_point_amt  l-point
	//lpoint_amt  l-money
	//deposit_amt 보관금
	var pointUseHtml = "";
	var t_lt_point_amt = $("#lt_point_amt").val();
	var t_lpoint_amt = $("#lpoint_amt").val();
	var t_deposit_amt =$("#deposit_amt").val();

	if(t_lt_point_amt != "" && t_lt_point_amt != undefined){
		pointUseHtml += '<li class="list_depth2">'
							+ '<p class="left">L.POINT 사용</p>'
							+ '<p class="right">(-)'+new String(Number(t_lt_point_amt)).money()+'원</p>'
							+ '</li>';
	}

	if(t_lpoint_amt != "" && t_lpoint_amt != undefined){
		pointUseHtml += '<li class="list_depth2">'
							+ '<p class="left">L-money사용</p>'
							+ '<p class="right">(-)'+new String(Number(t_lpoint_amt)).money()+'원</p>'
							+ '</li>';
	}

	if(t_deposit_amt != "" && t_deposit_amt != undefined){
		pointUseHtml += '<li class="list_depth2">'
							+ '<p class="left">보관금 사용</p>'
							+ '<p class="right">(-)'+new String(Number(t_deposit_amt)).money()+'원</p>'
							+ '</li>';
	}

	if(pointUseHtml != ""){
		$("#pointUse").html("<ul>"+pointUseHtml+"</ul>");
		if($('.max_discount').hasClass('on')){
			$("#pointUse").show();
		}else{
			$("#pointUse").hide();
		}
	}else{
		$("#pointUse").hide();
	}
}

function setIscmCd(iscmCd){
	$("#frm_inp select[name=iscmcd]").val( iscmCd );
	$("#frm_inp select[name=iscmcd]").change();

	/*********************************************
	 * 청구할인로직변경S
	 *********************************************/
	if($("#frm_inp select[name=iscmcd]").val() != ""){
		if("Y" == card_sale_yn || "Y" == claim_sale_yn){
			fn_cardsavegoods();
		}
	}
	/*********************************************
	 * 청구할인로직변경E
	 *********************************************/
}

function fn_card_point(){	
	$("#SHINHAN_CARD_LAYER").hide();
	$("#BC_CARD_LAYER").hide();
	$("#SAMSUNG_CARD_LAYER").hide();
	$("#KB_CARD_LAYER").hide();
	$("#shinhan_point").attr("checked", false);
	$("#shinhan_point").prop("checked", false);
	$("#shinhan_point").change();
	$("#bc_point").attr("checked", false);
	$("#bc_point").prop("checked", false);
	$("#bc_point").change();
	$("#samsung_point").attr("checked", false);
	$("#samsung_point").prop("checked", false);
	$("#samsung_point").change();
	$("#kb_point").attr("checked", false);
	$("#kb_point").prop("checked", false);
	$("#kb_point").change();
}

//다른결제수단 선택
function setAnother(close_yn){
	var pay_type = $("#frm_inp input[name=paytype]:hidden").val();

	var general_paymean_html = "";
	$("#general_paymean").removeClass('phone');
	$("#general_paymean").removeClass('lpay');

	if(pay_type == PAYTYPE_CODE_CARD){
		if($("#frm_inp select[name=iscmcd] option:selected").val() == "" || $("#frm_inp select[name=iscmcd] option:selected").val() == undefined){
			alert("신용카드를 선택해 주세요.");
			return false;
		}
		general_paymean_html = cardView("general_paymean");
	}else if(pay_type == PAYTYPE_CODE_BANK){	//무통장입금
		if($("#frm_inp select[name=bankno] option:selected").val() == ""){
			return false;
		}
		if(!bankCheck()){
			return false;
		}
		general_paymean_html = bankView("general_paymean");
	}else if(pay_type == PAYTYPE_CODE_PHONE){	//휴대폰
		general_paymean_html = phoneView();
		$("#general_paymean").addClass('phone');
	}else if(pay_type == PAYTYPE_CODE_LPAY){	//L-Pay
		if($("#frm_inp input[name=lpay_type]:checked").length<1){
			alert("신용카드를 선택해 주세요.");
			return false;
		}
		general_paymean_html = lpayView("general_paymean");
		$("#general_paymean").addClass('lpay');
	}else if(pay_type == undefined){
		alert("결제수단을 선택해 주세요.");
		return false;
	}

	general_paymean_html += "<input type='hidden' name='general_paymean_type' value='"+pay_type+"'>";
	$("#general_paymean").html(general_paymean_html);



	selPayMean("general_paymean");
	$("#general_paymean").show();
	if(close_yn == "Y"){
		$("#agree_layer_bg").hide();
		$("#agree_layer").hide();
		scrollYN('Y','');
		$('.pay_method').hide();
		$('.pay_method').hide();
	}

	toggleAction17();
	payScrollView(0);
	$("#general_paymean_evt").addClass('on');

	if(pay_type == PAYTYPE_CODE_CARD || pay_type == PAYTYPE_CODE_LPAY){
		paycardinstmon();
	}
}

function lpayView(obj){	
	var card_cardinstmon = "";
	var lpay_html = "";
	var cardinstmon =  $("#frm_inp select[name=cardinstmon] option:selected").val();
	var cardkndcd = $("#frm_inp select[name=iscmcd] option:selected").val();

	$("#frm_inp select[name=cardinstmon] option").each(function(){
		if(cardinstmon == $(this).val()){
			card_cardinstmon += "<option value='"+$(this).val()+"' selected>"+$(this).text()+"</option>";
		}else{
			card_cardinstmon += "<option value='"+$(this).val()+"'>"+$(this).text()+"</option>";
		}
	});

	lpay_html +="<input type='hidden' name='"+obj+"_iscmcd' value='"+$("#frm_inp select[name=iscmcd] option:selected").val()+"'>";
	lpay_html +="<input type='hidden' name='"+obj+"_switch' value='N'>";

	lpay_html	+="<div class='l_pay_logo'>"
					+ "    <img src='http://image.lotte.com/lotte/mo2015/angular/order/pay_lpay_2.png' alt=''>"
					+ "    <img src='http://image.lotte.com/lotte/mo2015/angular/order/pay_lpay_on_2.png' alt='' class='on_img'>"
					+ "</div>"
					+ "<div class='card_name'>"
					+ "    <p class='title1'>"+$("#frm_inp input[name=lpay_type]:radio[value='"+cardkndcd+"']").attr("data-card-nm")+"</p>"
					+ "    <p class='title2'>"+$("#frm_inp select[name=iscmcd] option:selected").text()+"</p>"
					+ "</div>"
					+ "<div class='s_text'>"
					+ "	   <span class='s_box02'>"
					+ "	       <select name='"+obj+"_cardinstmon' class='del_msg' data-idx='1' style='width:100%' onChange='sel_cardinstmon(this);'>"
					+ 				card_cardinstmon
					+ "        </select>"
					+ "		   <span class='img_box'> <i></i> </span>"
					+ "		   <span class='evt_clip' onClick='paySelect(\""+obj+"\",0);' id='"+obj+"_evt'></span>"
					+ "	   </span>"
					+ "</div>";
	return lpay_html
}

function cardView(obj){
	var card_text = $("#card_confirm_label_"+ $("#frm_inp input[name=card_confirm_type]:radio:checked").val()).text();
	var card_cardinstmon = "";
	var card_html = "";
	var cardinstmon =  $("#frm_inp select[name=cardinstmon] option:selected").val();

	$("#frm_inp select[name=cardinstmon] option").each(function(){
		if(cardinstmon == $(this).val()){
			card_cardinstmon += "<option value='"+$(this).val()+"' selected>"+$(this).text()+"</option>";
		}else{
			card_cardinstmon += "<option value='"+$(this).val()+"'>"+$(this).text()+"</option>";
		}
	});

	if($("#shinhan_point").prop("checked") || $("#bc_point").prop("checked") || $("#samsung_point").prop("checked") || $("#kb_point").prop("checked")){
		card_text += ", 포인트 결제";
		card_html += "<input type='hidden' name='"+obj+"_point' value='Y'>";
	}else{
		card_html += "<input type='hidden' name='"+obj+"_point' value='N'>";
	}
	card_html +="<input type='hidden' name='"+obj+"_iscmcd' value='"+$("#frm_inp select[name=iscmcd] option:selected").val()+"'>";
	card_html +="<input type='hidden' name='"+obj+"_switch' value='N'>";
	card_html +="<input type='hidden' name='"+obj+"_card_confirm_type' value='"+$("#frm_inp input:radio[name=card_confirm_type]:checked").val()+"'>";


	card_html +="<div class='card_name'>"
					 +"	<p class='title1'>"+$("#frm_inp select[name=iscmcd] option:selected").text()+"</p>"
					 +"	<p class='title2'>"+card_text+"</p>"
					 +"</div>"
					 +"<div class='s_text'>"
					 +"	<span class='s_box02'>"
					 +"		<select name='"+obj+"_cardinstmon' class='del_msg' data-idx='1' style='width:100%' onChange='sel_cardinstmon(this);'> "+card_cardinstmon+" </select>"
					 +"		<span class='img_box'> <i></i> </span>"
					 +"		<span class='evt_clip' onClick='paySelect(\""+obj+"\",0);' id='"+obj+"_evt'></span>"
					 +"	</span>"
					 +"</div>";

	return card_html;
}

function bankView(obj){
	var cash_text = "현금영수증 ";
	var back_html = "";

	back_html +="<input type='hidden' name='"+obj+"_bankcd' value='"+$("#frm_inp select[name=bankno] option:selected").val()+"'>"
				 +"<input type='hidden' name='"+obj+"_rdo_cash' value='"+$("#frm_inp select[name=rdo_cash] option:selected").val()+"'>"
				 +"<input type='hidden' name='"+obj+"_cr_issu_mean_sct_cd' value='"+$("#frm_inp select[name=cr_issu_mean_sct_cd] option:selected").val()+"'>";

	//소득공제 개인
	if($("#frm_inp select[name=rdo_cash] option:selected").val() == 1){
		//휴대폰
		if($("#frm_inp select[name=cr_issu_mean_sct_cd] option:selected").val() == 3){
				cash_text += $("select[name=cr_issu_mean_no_phone1]").val() + "-" + $("input[name=cr_issu_mean_no_phone2]").val() + "-" + $("input[name=cr_issu_mean_no_phone3]").val();
				back_html += "<input type='hidden' name='"+obj+"_text1' value= '"+$("select[name=cr_issu_mean_no_phone1]").val()+"'>";
				back_html += "<input type='hidden' name='"+obj+"_text2' value= '"+$("input[name=cr_issu_mean_no_phone2]").val()+"'>";
				back_html += "<input type='hidden' name='"+obj+"_text3' value= '"+$("input[name=cr_issu_mean_no_phone3]").val()+"'>";
		//신용카드 번호
		}else if($("#frm_inp select[name=cr_issu_mean_sct_cd] option:selected").val() == 4){
			cash_text += $("input[name=cr_issu_mean_no_credit_crd1]").val() + "-" + $("input[name=cr_issu_mean_no_credit_crd2]").val() + "-"
								 + $("input[name=cr_issu_mean_no_credit_crd3]").val() + "-" + $("input[name=cr_issu_mean_no_credit_crd4]").val();
			back_html += "<input type='hidden' name='"+obj+"_text1' value= '"+$("input[name=cr_issu_mean_no_credit_crd1]").val()+"'>";
			back_html += "<input type='hidden' name='"+obj+"_text2' value= '"+$("input[name=cr_issu_mean_no_credit_crd2]").val()+"'>";
			back_html += "<input type='hidden' name='"+obj+"_text3' value= '"+$("input[name=cr_issu_mean_no_credit_crd3]").val()+"'>";
			back_html += "<input type='hidden' name='"+obj+"_text4' value= '"+$("input[name=cr_issu_mean_no_credit_crd4]").val()+"'>";
		//현금영수증 번호
		}else if($("#frm_inp select[name=cr_issu_mean_sct_cd] option:selected").val() == 5){
			cash_text += $("input[name=cr_issu_mean_no_rcpt_crd1]").val() + "-" + $("input[name=cr_issu_mean_no_rcpt_crd2]").val() + "-"
									 + $("input[name=cr_issu_mean_no_rcpt_crd3]").val() + "-" + $("input[name=cr_issu_mean_no_rcpt_crd4]").val();
			back_html += "<input type='hidden' name='"+obj+"_text1' value= '"+$("input[name=cr_issu_mean_no_rcpt_crd1]").val()+"'>";
			back_html += "<input type='hidden' name='"+obj+"_text2' value= '"+$("input[name=cr_issu_mean_no_rcpt_crd2]").val()+"'>";
			back_html += "<input type='hidden' name='"+obj+"_text3' value= '"+$("input[name=cr_issu_mean_no_rcpt_crd3]").val()+"'>";
			back_html += "<input type='hidden' name='"+obj+"_text4' value= '"+$("input[name=cr_issu_mean_no_rcpt_crd4]").val()+"'>";
		}
	//소득공제 법인
	}else if($("#frm_inp select[name=rdo_cash] option:selected").val() == 2){
		cash_text += $("input[name=cr_issu_mean_no_bman1]").val() + "-" + $("input[name=cr_issu_mean_no_bman2]").val() + "-" + $("input[name=cr_issu_mean_no_bman3]").val()
		back_html += "<input type='hidden' name='"+obj+"_text1' value= '"+$("input[name=cr_issu_mean_no_bman1]").val()+"'";
		back_html += "<input type='hidden' name='"+obj+"_text2' value= '"+$("input[name=cr_issu_mean_no_bman2]").val()+"'";
		back_html += "<input type='hidden' name='"+obj+"_text3' value= '"+$("input[name=cr_issu_mean_no_bman3]").val()+"'";
	}else{
		cash_text = "";
	}
	back_html	+="<div class='card_name'>"
				 +"    <p class='title1'>무통장입금</p>"
				 +"	<p class='title2'>"+$("#frm_inp select[name=bankno] option:selected").text()+"</p>"



				 +"</div>"
				 +"<div class='s_text'>"
				 +"	<div class='s_box02 pay_receipt'>"+cash_text+"</div>"
				 +"</div>";
	return back_html;
}

function phoneView(){
	var phone_html = "";
	phone_html  ="<div class='card_name'>"
				+"    <p class='title1'>휴대폰결제</p>"
				+"</div>"
				+"<div class='mobile_img'>"
				+"    <img src='http://image.lotte.com/lotte/mo2015/angular/order/pay_phone.gif' alt=''>"
				+"    <img src='http://image.lotte.com/lotte/mo2015/angular/order/pay_phone_on.gif' alt='' class='on_img'>"
				+"</div>";

	return phone_html;
}

function cardSaleCheck(pay_type, obj){
	cpncardcd	= $("#frm_send input[name=cardkndcd]:hidden").val();	// 할인쿠폰의 카드정보
	cpncardcd_dup = $("#frm_send input[name=cardkndcd_dup]:hidden").val();	// 중복카드할인쿠폰의 카드정보
	var prom_third = $("#frm_send input[name=prommdclcd_third]").val(); //일시불 여부

	if(pay_type == PAYTYPE_CODE_BANK || pay_type == PAYTYPE_CODE_PHONE){
		if ( cpncardcd != '' || cpncardcd_dup != '') {
			alert("카드할인을 받으시려면 해당 카드로 결제하셔야 합니다."); 
			return false;
		}
	}else if(pay_type == PAYTYPE_CODE_CARD || pay_type == PAYTYPE_CODE_LPAY){
		var iscmcd = $("#"+obj+" input[name="+obj+"_iscmcd]").val();
		if((cpncardcd != '' && cpncardcd != iscmcd) || (cpncardcd_dup != '' && cpncardcd_dup != iscmcd)){
			alert("카드할인을 받으시려면 해당 카드로 결제하셔야 합니다.");
			return false;
		}
	}

	return true;
}

function sel_cardinstmon(obj){
	$("#frm_inp select[name=cardinstmon]").val( $(obj).val() );
}

//카드 선택시 최대할인 혜택 자동 적용
function paySelect(obj, index){
	var pay_type = $("#"+obj+" input[name="+obj+"_type]").val();
	var pay_switch = $("#"+obj+" input[name="+obj+"_switch]").val();

	paytype = $("#frm_inp input[name=paytype]:hidden").val();
	
	if(pay_type == PAYTYPE_CODE_CARD || pay_type == PAYTYPE_CODE_LPAY){
		if(pay_switch == "N"){
			var iscmcd = $("#"+obj+" input[name="+obj+"_iscmcd]").val();
			var point = $("#"+obj+" input[name="+obj+"_point]").val();
			var card_confirm_type = $("#"+obj+" input[name="+obj+"_card_confirm_type]").val();
			var cardinstmon = $("#frm_inp select[name="+obj+"_cardinstmon] option:selected").val();
			var check = "N";
			var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();	// 실제 총결제금액
			var card_cardinstmon = "";
			var card_cardinstmon_yn = "N"
			var totsttlamt = ($("#frm_inp input[name=totsttlamt]:hidden").val()==''?'0':$("#frm_inp input[name=totsttlamt]:hidden").val());

			//선택된 스위치 말고 전부 N으로 변경
			paycardinstmon_disabled_all(obj+"_cardinstmon");
			pay_switch_off(obj+"_switch");
			
			$("#frm_inp select[name=iscmcd]").val( iscmcd );
			$("#frm_inp select[name=cardinstmon]").attr('disabled' , false);
			
			setMaxDcNew(iscmcd,'Y'); //최대할인가 셋팅
			//카드체크시작
			getCardInsCheck();
			//paycardinstmon();

			$("#frm_inp select[name=cardinstmon] option").each(function(){
				card_cardinstmon += "<option value='"+$(this).val()+"'>"+$(this).text()+"</option>";

				if(card_cardinstmon_yn == "N" && $(this).val() != ""){
					card_cardinstmon_yn = "Y";
				}
			});

			$("#frm_inp select[name="+obj+"_cardinstmon]").empty();
			$("#frm_inp select[name="+obj+"_cardinstmon]").append(card_cardinstmon);


			if(card_cardinstmon_yn == "Y" && prom_third != "35" && parseInt(totsttlamt) >= 50000){
				$("#"+obj+" input[name="+obj+"_switch]").val("Y");	//스위치온
				$("#frm_inp select[name="+obj+"_cardinstmon]").attr('disabled' , false);
			}else{
				$("#"+obj+" input[name="+obj+"_switch]").val("N");	//스위치온
				$("#frm_inp select[name="+obj+"_cardinstmon]").attr('disabled' , true);
			}
			
	
		}

		//청구할인 조회
		if("Y" == card_sale_yn || "Y" == claim_sale_yn){
			fn_cardsavegoods();
		}
	}else if(pay_type == PAYTYPE_CODE_BANK){
	
	}else if(pay_type == PAYTYPE_CODE_PHONE){

	}

	selPayMean(obj);
	
	var lpay_paymean_id = obj;
	lpay_paymean_id = lpay_paymean_id.replace('lpay_paymean_', '');	
	if(pay_type == PAYTYPE_CODE_LPAY){
		if (lpay_paymean_id!=''){
			var lpay_card_div = $("select[name=iscmcd] option[data-card-id='"+lpay_paymean_id+"']").data("card-div");	
			console.log("lpay_card_div=	"+lpay_card_div);
			if(lpay_card_div != undefined && lpay_card_div != "CC"){
				$("#frm_inp select[name="+obj+"_cardinstmon] option:eq(0)").prop('selected' , true);	// 일시불선택
				$("#frm_inp select[name="+obj+"_cardinstmon]").prop('disabled' , true);	// 비활성 처리
			}
		}
	}
	payScrollView(index);

	if(index == 0){
		index = pay_index;
	}
	
	//20180903 GA 태깅 추가 
	var GAIdx = (parseInt(index) <= 9 && parseInt(index) != 0) ? '0' + parseInt(index) : index;
	GAEvtTag('MO_상품상세', '엘페이 바로결제', '카드선택' + GAIdx);
	   
	//금액 재계산
	fn_calcTotalPrice();
	//할인상세 레이어 갱신
	setDcList();
}

function payScrollView(index){
	console.log("포커싱처리 진입");
	console.log("선택 카드: "+index);
	if(index == 0){
		index = pay_index;
	}

	var windowwidth = $(window).width();
	var windowwidthhalf = windowwidth / 2;
	var outerWidth = 253;
	var outerWidthhalf = outerWidth / 2;
	var halfhalf = windowwidthhalf - outerWidthhalf;
	var leftValue = (outerWidth * (index - 1)) + 8;
	var howleft = leftValue - halfhalf;
	if(index == 1){
		$('.orderSimple_wrap .orderSimple_mid .slide .slide_ul').css('padding-left', halfhalf+'px');		
	}else{
		$('.orderSimple_wrap .orderSimple_mid .slide .slide_ul').css('padding-left','0px');		
	}
	$('.slide').scrollLeft(howleft);
}

function init_payMean(){
	
	var paymean_html = "";
	var histPayMeanCd = $("#frm_inp input[name=op_pay_mean_hist_pay_mean_cd]").val();
	var bank_nm = "";

	if(lpayPsbYn == "Y"){

		$("select[name=iscmcd]").html("");
		lpayCertInfo();
	}

	if(creditPsbYn != "Y"){
		$("#pay_card").hide();
	}

	//청구할인
	var card_html = "";
	var credit_cardinstmon = "";
	$("#frm_inp select[name=cardinstmon] option").each(function(){
		credit_cardinstmon += "<option value='"+$(this).val()+"' >"+$(this).text()+"</option>";
	});

	//console.log("-----------------청구할인진행, 구매사은 진행");

	$("#frm_inp input[name=card_clm_nm]").each(function() {
		if(cardOverlapCheck($(this).val(), '1') == "N"){
			//alert("청구할인진행");
			card_html   +="<li id='card_paymean_"+$(this).val()+"' onClick='paySelect(\"card_paymean_"+$(this).val()+"\","+pay_index+");'>"
						 +"    <input type='hidden' name='card_paymean_"+$(this).val()+"_point' value='N'>"
						 +"	   <input type='hidden' name='card_paymean_"+$(this).val()+"_switch' value='N'>"
						 +"    <input type='hidden' name='card_paymean_"+$(this).val()+"_card_confirm_type' value='02'>"
						 +"    <input type='hidden' name='card_paymean_"+$(this).val()+"_iscmcd' value='"+$(this).val()+"'>"
						 +"    <div class='card_name'>"
						 +"	       <p class='title1'>"+getCardNm($(this).val())+"카드</p>"
						 +"		   <p class='title2'>일반결제</p>"
						 +"	   </div>"
						 +"    <div class='s_text'>"
						 +"        <span class='s_box02'>"
						 +"   	       <select name='card_paymean_"+$(this).val()+"_cardinstmon' class='del_msg' data-idx='1' style='width:100%' onChange='sel_cardinstmon(this);'>"
						 + 			       credit_cardinstmon
						 +"       	   </select>"
						 +"	           <span class='img_box'> <i></i> </span>"
						 +"	           <span class='evt_clip' onClick='paySelect(\"card_paymean_"+$(this).val()+"\","+pay_index+");' id='card_paymean_"+$(this).val()+"_evt'></span>"
						 +"	       </span>"
						 +"    </div>"
						 +"    <input type='hidden' name='card_paymean_"+$(this).val()+"_type' value='16'>"
						 +"    <input type='hidden' name='card_paymean_"+$(this).val()+"_index' value='"+pay_index+"'>"
						 +"</li>";

			pay_index = pay_index+1;
		}
	});

	//구매사은
	var evtcardminprc =  $("#frm_inp input[name=evtcardminprc]").val();
	var temp_evtcardcd =  $("#frm_inp input[name=evtcrcmcd]").val();
	var saleprc = $("#frm_send input[name=saleprc]").val();
	var evtcardcd  = "";

	/*
	007	구 신한
	008	하나카드(구.외환)
	016	국민
	018	NH카드
	020	하나카드 (구.하나SK카드)
	026	비씨
	027	현대
	028	JCB
	029	통합 신한
	031	삼성
	037	(구)롯데백화점카드
	047	롯데
	055	우리은행엘페이

	매입사코드 승인사 코드로 강제 변환
	*/
	if(temp_evtcardcd == "007"){
		evtcardcd = "029";
	}else if(temp_evtcardcd == "020"){
		evtcardcd = "008";
	}else if(temp_evtcardcd == "027"){
		evtcardcd = "048";
	}else if(temp_evtcardcd == "037"){
		evtcardcd = "047";
	}else{
		evtcardcd = temp_evtcardcd;
	}

	if(parseInt(saleprc) > parseInt(evtcardminprc) && evtcardcd != ""){
		if(cardOverlapCheck(evtcardcd, '2') == "N"){
			card_html   +="<li id='card_paymean_"+evtcardcd+"' onClick='paySelect(\"card_paymean_"+evtcardcd+"\","+pay_index+");'>"
						 +"    <input type='hidden' name='card_paymean_"+evtcardcd+"_point' value='N'>"
						 +"	   <input type='hidden' name='card_paymean_"+evtcardcd+"_switch' value='N'>"
						 +"    <input type='hidden' name='card_paymean_card_confirm_"+evtcardcd+"_type' value='02'>"
						 +"    <input type='hidden' name='card_paymean_"+evtcardcd+"_iscmcd' value='"+evtcardcd+"'>"
						 +"    <div class='card_name'>"
						 +"	       <p class='title1'>"+getCardNm(evtcardcd)+"카드</p>"
						 +"		   <p class='title2'>일반결제</p>"
						 +"	   </div>"
						 +"    <div class='s_text'>"
						 +"        <span class='s_box02'>"
						 +"   	       <select name='card_paymean_"+evtcardcd+"_cardinstmon' class='del_msg' data-idx='1' style='width:100%' onChange='sel_cardinstmon(this);'>"
						 + 			       credit_cardinstmon
						 +"       	   </select>"
						 +"	           <span class='img_box'> <i></i> </span>"
						 +"	           <span class='evt_clip' onClick='paySelect(\"card_paymean_"+evtcardcd+"\","+pay_index+");' id='card_paymean_"+evtcardcd+"_evt'></span>"
						 +"	       </span>"
						 +"    </div>"
						 +"    <input type='hidden' name='card_paymean_"+evtcardcd+"_type' value='16'>"
						 +"    <input type='hidden' name='card_paymean_"+evtcardcd+"_index' value='"+pay_index+"'>"
						 +"</li>";

			pay_index = pay_index+1;
		}
	}
	if(card_html != "" && creditPsbYn == "Y"){
		$("#card_paymean").html(card_html);
		$("#card_paymean").show();
	}
}

//결제블록 카드 중복체크
function cardOverlapCheck(cardCd, gubun){
	var resultVal = "N";
	var creditCardCheck = "N";

	if($("#frm_inp input[name=op_pay_mean_hist_acqr_cd]").val() == cardCd){
		resultVal = "Y";
	}

	$("#frm_inp input[name=lpay_type]:radio").each(function() {
		if($(this).val() == cardCd){
			resultVal = "Y";
		}
	});

	if(gubun == "2"){
		$("#frm_inp input[name=card_clm_nm]").each(function() {
			if($(this).val() == cardCd){
				resultVal = "Y";
			}
		});
	}

	//결제 가능한 카드인지 체크
	$("#credit_card_list li").each(function() {
		if(cardCd == $(this).attr("card-id")){
			creditCardCheck = "Y";
		}
	});

	if(creditCardCheck == "N"){
		resultVal = "Y";
	}
	return resultVal;
}

//L.pay WEB : <li> 생성
function createLpayMean(){
	pay_index = pay_index - $("#lpay_paymean").children("li").length; // L.pay 카드 수 초기화 값 pay_index에 적용
	var lpay_html = "";
	var lpay_cardinstmon = "";
	var lpay_id = "";
	$("#frm_inp select[name=cardinstmon] option").each(function(){
		lpay_cardinstmon += "<option value='"+$(this).val()+"' >"+$(this).text()+"</option>";
	});	
	
	$("#frm_inp select[name=iscmcd] option").each(function(){
		if($(this).val() != ""){							
				if(lpay_id_list != ""){
					lpay_id_list += ","+"lpay_paymean_"+$(this).attr("data-card-id");
					lpay_iscmcd_list += ","+$(this).val();					
					lpay_index_list += ","+pay_index;
				}else{
					lpay_id_list = "lpay_paymean_"+$(this).attr("data-card-id");
					lpay_iscmcd_list = $(this).val();
					lpay_index_list = ""+pay_index;
				}
				lpay_html    += "<li id='lpay_paymean_"+$(this).attr("data-card-id")+"' onClick='paySelect(\"lpay_paymean_"+$(this).attr("data-card-id")+"\","+pay_index+");' class='lpay'>"
							  + "<input type='hidden' name='lpay_paymean_"+$(this).attr("data-card-id")+"_iscmcd' value='"+$(this).val()+"'>"
							  + "<input type='hidden' name='lpay_paymean_"+$(this).attr("data-card-id")+"_switch' value='N'>"
							  + "<div class='l_pay_logo'>"
							  + "	<img src='http://image.lotte.com/lotte/mo2015/angular/order/pay_lpay_2.png' alt=''>"
							  + "	<img src='http://image.lotte.com/lotte/mo2015/angular/order/pay_lpay_on_2.png' alt='' class='on_img'>"
							  + "</div>"
							  + "<div class='card_name'>"
							  + "	<p class='title1'>"+$(this).attr("data-card-nm")+"</p>"
							  + "   <p class='title2'>"+$(this).text()+"</p>"
							  + "</div>"
							  + "<div class='s_text'>"
							  + "	<span class='s_box02'>"
							  + "		<select name='lpay_paymean_"+$(this).attr("data-card-id")+"_cardinstmon' class='del_msg' data-idx='1' style='width:100%' onChange='sel_cardinstmon(this);'>"
							  + 			lpay_cardinstmon
							  + "       </select>"
							  + "		<span class='img_box'> <i></i> </span>"
							  + "		<span class='evt_clip' onClick='paySelect(\"lpay_paymean_"+$(this).attr("data-card-id")+"\","+pay_index+");' id='lpay_paymean_"+$(this).attr("data-card-id")+"_evt'></span>"
							  + "	</span>"
							  + "</div>"
							  + "<input type='hidden' name='lpay_paymean_"+$(this).attr("data-card-id")+"_type' value='40'>"
							  + "<input type='hidden' name='lpay_paymean_"+$(this).attr("data-card-id")+"_index' value='"+pay_index+"'>"
							  + "</li>";
				pay_index = pay_index+1;	
		}
	});	

	return lpay_html;
}

function selPayMean(obj){
	var index = 0;

	if(obj == "general_paymean"){
		index = pay_index;
	}else{
		index = $("#frm_inp input[name="+obj+"_index]:hidden").val();
	}
	removeClassPayMean();
	$("#"+obj).addClass('check');
	$("#"+obj).addClass('on');
	$("#"+obj).addClass('crucial');

	payBlockEvent(obj);
}

function removeClassPayMean(){
	$("#hist_paymean").removeClass( 'check' );
	$("#general_paymean").removeClass( 'check' );
	$("#lpay_paymean li").removeClass('check');
	$("#card_paymean li").removeClass( 'check' );

	$("#hist_paymean").removeClass( 'on' );
	$("#general_paymean").removeClass( 'on' );
	$("#lpay_paymean li").removeClass('on');
	$("#card_paymean li").removeClass( 'on' );

	$("#hist_paymean").removeClass( 'crucial' );
	$("#general_paymean").removeClass( 'crucial' );
	$("#lpay_paymean li").removeClass('crucial');
	$("#card_paymean li").removeClass( 'crucial' );
}

function goNormal(cartSn, imallYN){
	if(confirm("일반주문서는 기존에 이용하시던 주문서입니다.\n이동하시겠습니까?")){
		window.location = "/order/m/order_form.do?cartSn="+cartSn+"&smartOrd=N&imallYN="+imallYN+"&normal_yn=Y&"+__commonParam +"&tclick=m_DC_Sporder_clk_Btn1";
	}
}

function goMessageDelivery(idx, cartSn, imallYN){
	var messageDelivery = "";
	var tClickCode = "";

	if(idx == 1){
		messageDelivery = "매장전달메시지";
		tClickCode = 'm_DC_Sporder_clk_Btn2';
	}else if(idx == 2){
		messageDelivery = "선물포장메시지";
		tClickCode = 'm_DC_Sporder_clk_Btn3';
	}else if(idx == 3){
		messageDelivery = "종이카드메시지";
		tClickCode = 'm_DC_Sporder_clk_Btn4';
	}


	if(confirm(messageDelivery+"를 설정하기 위해 일반주문서로 이동합니다.")){
		window.location = "/order/m/order_form.do?cartSn="+cartSn+"&smartOrd=N&imallYN="+imallYN+"&normal_yn=Y&"+__commonParam +"&tclick="+tClickCode;
	}
}

function payShortCut(payType, id){
	//신용카드
	if(payType == PAYTYPE_CODE_CARD){
		//최근결제
		if($("#frm_inp input[name=hist_paymean_iscmcd]:hidden").val() == id){
			$("#frm_inp input[name=card_confirm_type]:radio[value='"+$("#frm_inp input[name=hist_paymean_card_confirm_type]:hidden").val()+"']").prop("checked", true);
			selPayMean("hist_paymean");
		//카드혜택
		}else if($("#frm_inp input[name=card_paymean_"+id+"_iscmcd]:hidden").val() == id){
			selPayMean("card_paymean_"+id);
			$("#frm_inp input[name=card_confirm_type]:radio[value='02']").prop("checked", true);
			$("#frm_inp input[name=card_confirm_type]:radio[value='"+$("#frm_inp input[name=card_paymean_"+id+"_card_confirm_type]:hidden").val()+"']").prop("checked", true);
		//다른결제수단
		}else if($("#frm_inp input[name=general_paymean_iscmcd]:hidden").val() == cardkndcd){
			$("#frm_inp input[name=card_confirm_type]:radio[value='"+$("#frm_inp input[name=general_paymean_card_confirm_type]:hidden").val()+"']").prop("checked", true);
			selPayMean("general_paymean");
		}else{			
			setAnother('N');
		}
	}
}

// 배송지 팝업
function searchOrdDeliveryListPop(deli_cnt,single){
	var tag = '<iframe id="deliIframe" src="" style="width:100%;height:100%;border:0"></iframe>'
	var dlvp_sn = $("input[name=indlvpsn]").val();
	var crspk_map_url = "/popup/ord_search_delivery_list.do?deli_cnt="+deli_cnt+"&selectedDlvpSn="+dlvp_sn+"&single="+single;

	$(".lpoint_btn3").hide(); // 일반주문서 가기 숨기기
	// iframe 보이기 및 url, parameter 셋팅
	$("#ordSearchDeliPop").show();
	$("#ordSearchDeliPop").html(tag);
	$("#ordSearchDeliPop").find("iframe").attr("src", crspk_map_url);

	scrollYN('N','DELI');

	sendTclick('Sporder_clk_Pop1');

}

// 배송지 팝업 닫기
function searchOrdDeliveryListClose(){

	$(".lpoint_btn3").show();

	$("#ordSearchDeliPop").hide();
	$("#ordSearchDeliPop").find("iframe").remove();

	scrollYN('Y','DELI');
}

/*
007	구 신한
008	하나카드(구.외환)
016	국민
018	NH카드
020	하나카드 (구.하나SK카드)
026	비씨
027	현대
028	JCB
029	통합 신한
031	삼성
037	(구)롯데백화점카드
047	롯데
055	우리은행엘페이

*/

function getCardNm(cardCd){
	var cardNm = "";

	if(paytype_card_002 == cardCd){
		cardNm = "광주";
	}else if("007" == cardCd){
		cardNm = "신한";
	}else if(paytype_card_008 == cardCd){
		cardNm = "외환";
	}else if(paytype_card_016 == cardCd){
		cardNm = "KB국민";
	}else if(paytype_card_018 == cardCd){
		cardNm = "NH";
	}else if(paytype_card_020 == cardCd){
		cardNm = "하나SK";
	}else if(paytype_card_021 == cardCd){
		cardNm = "우리";
	}else if(paytype_card_026 == cardCd){
		cardNm = "비씨";
	}else if("027" == cardCd){
		cardNm = "현대";
	}else if("028" == cardCd){
		cardNm = "JCB";
	}else if(paytype_card_029 == cardCd){
		cardNm = "신한";
	}else if(paytype_card_031 == cardCd){
		cardNm = "삼성";
	}else if("037" == cardCd){
		cardNm = "롯데";
	}else if(paytype_card_036 == cardCd){
		cardNm = "씨티";
	}else if(paytype_card_047 == cardCd){
		cardNm = "롯데";
	}else if(paytype_card_048 == cardCd){
		cardNm = "현대";
	}else if(paytype_card_054 == cardCd){
		cardNm = "우체국체크";
	}else if("055" == cardCd){
		cardNm = "우리은행엘페이";
	}

	return cardNm;
}

function paycardinstmon(){	
	//일시불 여부
	var prom_third = $("#frm_send input[name=prommdclcd_third]").val(); //일시불 여부
	var totsttlamt = ($("#frm_inp input[name=totsttlamt]:hidden").val()==''?'0':$("#frm_inp input[name=totsttlamt]:hidden").val());

	if(prom_third == "35" || parseInt(totsttlamt) < 50000){
		//console.log("일시불 할부 비활성화 처리");

		$("#lpay_paymean select").each(function() {
			$(this).empty();
			$(this).append("<option value=''>일시불</option>");
		});

		$("#card_paymean select").each(function() {
			$(this).empty();
			$(this).append("<option value=''>일시불</option>");
		});

		paycardinstmon_disabled_all("all");
		pay_switch_off("all");
		payBlockEvent("");

		$("#frm_inp select[name=cardinstmon]").empty();
		$("#frm_inp select[name=cardinstmon]").append("<option value=''>일시불</option>");
		$("#frm_inp select[name=cardinstmon]").attr('disabled' , true);
	}else{
		var pay_id = "";
		$(".slide_ul .check").each(function() {
			pay_id = $(this).attr('id');
		});

		if(pay_id != "" && pay_id != undefined){
			if($("#frm_inp select[name=iscmcd]").val() != "" && $("#frm_inp select[name=cardinstmon]").val() == ""){
				getCardInsCheck();
				selCardinstmon(pay_id);
			}

			paycardinstmon_disabled_all(pay_id+"_cardinstmon");		//할부개월 일시불로 초기화
			//pay_switch_off(pay_id+"_switch");						//결제블록 스위치 off
			payBlockEvent(pay_id);									//결제블록 일시불영역 클릭 이벤트 생성
		}else{
			paycardinstmon_disabled_all("all");
			pay_switch_off("all");
			payBlockEvent("");
		}
	}
}

function selCardinstmon(obj){
	var card_cardinstmon = "";

	$("#frm_inp select[name=cardinstmon] option").each(function(){
		card_cardinstmon += "<option value='"+$(this).val()+"'>"+$(this).text()+"</option>";
	});

	$("#frm_inp select[name="+obj+"_cardinstmon]").empty();
	$("#frm_inp select[name="+obj+"_cardinstmon]").append(card_cardinstmon);
}

function paycardinstmon_disabled_all(obj){
	if(obj == "all"){

		$("#lpay_paymean select").each(function() {
			$(this).attr('disabled' , true);
		});

	}else{

		$("#lpay_paymean li").each(function() {
			if(obj != $(this).attr('id')+"_cardinstmon"){
				$("#frm_inp select[name="+$(this).attr('id')+"_cardinstmon]").attr('disabled' , true);
			}else{
				$("#frm_inp select[name="+$(this).attr('id')+"_cardinstmon]").attr('disabled' , false);
			}
		});
	}
}

function pay_switch_off(obj){
	if(obj == "all"){
		$("#lpay_paymean li").each(function() {
			$("#frm_inp input[name="+$(this).attr('id')+"_switch]").val("N");
		});
	}else{
		$("#lpay_paymean li").each(function() {
			if(obj != $(this).attr('id')+"_switch"){		
				$("#frm_inp input[name="+$(this).attr('id')+"_switch]").val("N");
			}else{				
				$("#frm_inp input[name="+$(this).attr('id')+"_switch]").val("Y");
			}
		});
		$("#card_paymean li").each(function() {
			if(obj != $(this).attr('id')+"_switch"){
				//console.log($(this).attr('id'));
				$("#frm_inp input[name="+$(this).attr('id')+"_switch]").val("N");
			}else{
				$("#frm_inp input[name="+$(this).attr('id')+"_switch]").val("Y");
			}
		});
	}
}

function payBlockEvent(obj){
	//console.log("payBlockEvent obj["+obj+"]");
	$("#hist_paymean_evt").addClass('on');
	$("#general_paymean_evt").addClass('on');
	$("#lpay_paymean li").each(function() {
		if(obj != $(this).attr('id')+"_switch"){
			$("#"+$(this).attr('id')+"_evt").addClass('on');
		}
	});

	$("#card_paymean li").each(function() {
		if(obj != $(this).attr('id')+"_switch"){
			$("#"+$(this).attr('id')+"_evt").addClass('on');
		}
	});

	if(obj != ""){
		$("#"+obj+"_evt").removeClass('on');
	}
}

function viewEvtCard(){
	var evtcardminprc =  $("#frm_inp input[name=evtcardminprc]").val();
	var evtcardnm =  getCardNm($("#frm_inp input[name=evtcrcmcd]").val());
	var saleprc = $("#frm_send input[name=saleprc]").val();

	if(parseInt(saleprc) > parseInt(evtcardminprc) && evtcardnm != ""){
		$("#eventcard_cont").html("구매사은 적립(신청필수):"+evtcardnm+" "+String(evtcardminprc).money()+"원 이상 결제 시");
		$("#eventcard_cont").show();
	}else{
		$("#eventcard_cont").hide();
	}
}

function bankCheck(){
	var cr_issu_mean_sct_cd = $("#frm_inp select[name=cr_issu_mean_sct_cd]").val();
	var cash_cd = $("#frm_inp select[name=rdo_cash]").val();
	var tmp_val = "";
	var cash_val = "";
	var max_length = 0;
	var title = "";
	var bool_send = true;
	var disabled = "";

	if (cash_cd == "1"){ // 소득공제
		$("#frm_send input[name=cr_issu_mean_sct_cd]:hidden").val(cr_issu_mean_sct_cd);
		$("#frm_send input[name=cr_use_sct_cd]:hidden").val("0");

		var cash_id = "cash_receipts0";

		if (cr_issu_mean_sct_cd == "1"){
			cr_issu_mean_sct_cd = "2";
		}

		if (cr_issu_mean_sct_cd == "3"){
			cash_val = $("#frm_inp select[name=cr_issu_mean_no_phone1]").val();
		}

		if ( $("#frm_inp select[name=bankno]").val() == '' ) {
			alert('입금 은행을 선택해주세요.');
			return false;
		} else if ( $("#frm_inp input[name=onlineacctname]").val() == '' ) {
			alert('입금자이름을 입력해주세요.');
			$("#frm_inp input[name=onlineacctname]").focus();
			return false;
		}


		$("#cash_receipts0"+cr_issu_mean_sct_cd+" input").each(function(){
			max_length = $(this).attr("maxlength");
			title = $(this).attr("title");
			tmp_val = $(this).val();
			tmp_str = " 이상";
			disabled = $(this).attr("disabled");

			if(disabled != "disabled"){
				if ($(this).attr("name") == "cr_issu_mean_no_credit_crd4"){ // 신용카드 마지막 자리 수는 3자리 이상 되도록
					max_length = 3;
				}else if ($(this).attr("name") == "cr_issu_mean_no_rcpt_crd4"){ // 현금영수증 카드 마지막 자리 수는 1자리 이상 되도록
					max_length = 1;
				}else if ($(this).attr("name") == "cr_issu_mean_no_phone2"){ // 휴대전화 중간자리 3자리 이상 되도록
					max_length = 3;
				}else{
					tmp_str = "로";
				}

				if (tmp_val.length < max_length){
					alert(title + "를 " + max_length + "자리" + tmp_str + " 입력해 주세요.");
					bool_send = false;
					return false;
				}
			}
		});
	}else if (cash_cd == "2"){ // 지출증빙용
		$("#co_value input").each(function(){
			max_length = $(this).attr("maxlength");

			if (max_length>1) {
				title = $(this).attr("title");
				tmp_val = $(this).val();

				if (tmp_val.length < max_length){
					alert(title + "를 " + max_length + "자리로 입력해 주세요.");
					$(this).focus();
					bool_send = false;
					return false;
				}
				cash_val += tmp_val;
			}
		});
		num1 = cash_val.charAt(0);	num2 = cash_val.charAt(1);	num3 = cash_val.charAt(2);	num4 = cash_val.charAt(3);
		num5=  cash_val.charAt(4);	num6 = cash_val.charAt(5);	num7 = cash_val.charAt(6);
		num8 = cash_val.charAt(7);	num9 = cash_val.charAt(8);	num10 = cash_val.charAt(9);

		var total = (num1*1)+(num2*3)+(num3*7)+(num4*1)+(num5*3)+(num6*7)+(num7*1)+(num8*3)+(num9*5);
		total = total + parseInt((num9 * 5) / 10);
		var tmp = total % 10;
		if(tmp == 0) {
			var num_chk = 0;
		} else {
			var num_chk = 10 - tmp;
		}
		if(num_chk != num10) {
			alert("사업자등록번호가 올바르지 않습니다.");
			$("#frm_inp input[name=cr_issu_mean_no_bman1]").focus();
			bool_send = false;
			return false;
		}
	}
	return bool_send;
}

function lpayListCheck(){
	var lpay_yn = "N";
	$("#frm_inp input[name=lpay_type]:radio").each(function() {
		lpay_yn = "Y";
		return;
	});

	if(lpay_yn == "Y"){
		$("#pay_card").show();
		$(".box_Lpay_agree_check").show();
		$(".box_Lpay_agree_check div a").hide();
		$("#lpay_list").show();
		$("#card_select").show();
	}else{
		//고객정보 없음
		if($(".box_Lpay_agree_check .txt01").css('display') == 'block'){
			$("#pay_card").hide();
			$("#card_select").hide();
			$(".box_Lpay_agree_check").show();
			$(".box_Lpay_agree_check div a").show();
		//카드등록이 안되어 있음
		}else{
			$("#pay_card").hide();
			$("#card_select").hide();
			$("#no_lpay_card").show();
			$(".box_Lpay_agree_check").show();
			$(".box_Lpay_agree_check div a").hide();
		}


		//lpay자체 없는경우 처리해야됨
	}
}

// 스크롤 방지
function scrollYN(scroll,type){

	if(scroll == 'N'){
		// 부모창 스크롤 방지
		$('html, body').css({'overflow': 'hidden'});
		if(type == 'DELI'){
			$('body').on('scroll touchmove mousewheel', function(event) {
				event.preventDefault();
				event.stopPropagation();
				return false;
			});
		}
		//이력추가
		if(browserChk() != 'Safari'){
			history.pushState('history1', '');
		}
	}
	else {
		// 부모창 스크롤 풀기
		$('html, body').css({'overflow': 'visible'});
		if(type == 'DELI'){
			$('body').off('scroll touchmove mousewheel');
		}
		if(browserChk() != 'Safari'){
			if(history.state != null){
				history.back();
			}
		}
	}
}

function cardSelect(){
	var	selVal	= $("#frm_inp select[name=iscmcd]").val();

	$( "#frm_inp div[name=point_card_layer]" ).attr( "style", "display:none" );
	$( "#frm_inp input[name=sinhan_point]:radio[value='N']" ).attr( "checked", true );	/* 신한카드 포인트 */
	$( "#frm_inp input[name=bc_point]:radio[value='N']" ).attr( "checked", true );		/* 비씨카드 포인트 */
	$( "#frm_send input[name=pnt_use_yn]:hidden" ).val( "N" );							/* 포인트 결제 */

	// 비씨카드
	if( "026" == selVal ) {
		$( "#BC_CARD_LAYER" ).attr( "style", "display:" );
	}
	// 신한카드
	else if( "029" == selVal ) {
		$( "#SHINHAN_CARD_LAYER" ).attr( "style", "display:" );
	}
	// 삼성카드
	else if( "031" == selVal ) {
		$( "#SAMSUNG_CARD_LAYER" ).attr( "style", "display:" );
	}
	// 국민카드
	else if( "016" == selVal ) {
		$( "#KB_CARD_LAYER" ).attr( "style", "display:" );
	}

	//현대카드
	if( "048" == selVal ){
		$("#card_confirm_label_02").text('일반/PayShot결제');
		$("#card_confirm_label_03").text('앱카드');
	//신한카드
	}else if( "029" == selVal ){
		$("#card_confirm_label_02").text('일반결제');
		$("#card_confirm_label_03").text('FAN페이');
	}else{
		$("#card_confirm_label_02").text('일반결제');
		$("#card_confirm_label_03").text('앱카드');
	}
}

//청구할인 노출
function cardSaleView(){
	var cardText = "";
	var first_yn = "Y";
	$("#frm_inp input[name=card_clm_nm]").each(function() {
		if(first_yn == "N"){
			cardText += "/";
		}
		cardText += getCardNm($(this).val()) + "카드";
		first_yn = "N";
	});

	if(cardText != ""){
		$("#eventcardsale_cont").html("청구할인 행사 카드 : "+cardText);
		$("#eventcardsale_cont").show();
	}
}

//청구할인 여부
function fn_cardsavegoods(){
	var goodsno 	= $("#frm_send input[name=goodsno]:hidden").val();

	while(goodsno.indexOf(split_gubun_1) > -1){
		goodsno = goodsno.replace(split_gubun_1, ",");
	}

	var v_goods_no_list = goodsno;
	var card_cd =  $("#frm_inp select[name=iscmcd]").val();
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();

	$.ajax({
		async: false,
		type: "POST",
		dataType:"json",
		url: "/order/searchCardSalePromView2.do",
		data: {goods_no_list:v_goods_no_list, card_knd_cd:card_cd, tot_sttl_amt:totsttlamt},
		success:function(data) {
			if(data.success){

				claim_sale_aply_lmt_amt = data.aplylmtamt;
				claim_sale_card_knd_cd  = data.cardkndcd;
				claim_sale_fvr_val          = data.fvrval;
				claim_sale_card_max_amt = data.maxfvrval;
				$("#frm_inp input[name=claim_sale_fvr_val]:hidden").val(data.fvrval);
				$("#frm_inp input[name=claim_sale_aply_lmt_amt]:hidden").val(data.aplylmtamt);
				$("#frm_inp input[name=claim_sale_card_max_amt]:hidden").val(data.maxfvrval);
				$("#frm_inp input[name=claim_sale_card_knd_cd]:hidden").val(data.cardkndcd);
			}else{

			}
		},
		error:function(request, status) {
			//alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
		}
	});
	fn_formshow();
}


//카드선택에 따라서 청구할인 내용을 보여준다.
function fn_formshow(){
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	var paytype = $("#frm_inp input[name=paytype]:hidden").val();
	var card_save_cnt = $("#frm_inp input[name=card_save_cnt]:hidden").val(); //청구할인이 가능한 카드인지 확인
	var card_cd =  $("#frm_inp select[name=iscmcd]").val();
	var fvrval = $("#frm_inp input[name=claim_sale_fvr_val]:hidden").val();
	var maxamt = $("#frm_inp input[name=claim_sale_card_max_amt]:hidden").val();
	$("#frm_inp input[name=select_card_payment_yn]:hidden").val("N"); //청구할인대상금액은 충족하나 대상상품 + 비대상상품 케이스로 청구할인 적용이 불가능할경우 얼럿 노출을 위해 추가함 (기본셋팅 : N)
	$("#btn_goods_view").attr("style", "display:none;");
	$("#li_claim_sale_info2").html("");	
	$("#eventcardsaleamt_cont").hide();


	if(claim_sale_yn == "Y"){

		if ($("#frm_inp select[name=iscmcd]").val() == claim_sale_card_knd_cd
			 && $("#frm_inp select[name=iscmcd] option:selected").text() != "카드선택"
			 && parseInt(totsttlamt) >= parseInt(claim_sale_aply_lmt_amt)
			 && parseInt(totsttlamt) > 0){ // 카드 할인 정보 표현
			//청구할인 대상카드를 선택하고 대상상품이고 결제금액구간대에 속해있는경우
			//console.log("------------------------------7");			
			$("#claim_sale_info00").show();
			$("#claim_sale_info01").show();
			$("#claim_sale_info02").hide();
			$("#claim_sale_info03").hide();
			$("#claim_sale_info05").hide();
			$("#claim_sale_info04").hide();
			eventCardSaleInfo();
		}else if($("#frm_inp select[name=iscmcd]").val() == claim_sale_card_knd_cd
			&& $("#frm_inp select[name=iscmcd] option:selected").text() != "카드선택"
			 && parseInt(totsttlamt) < parseInt(claim_sale_aply_lmt_amt)
			 && parseInt(totsttlamt) > 0){
			//청구할인 대상카드를 선택하고 대상상품이고 결제금액구간대 이하일경우
			//console.log("------------------------------8");			
			$("#claim_sale_info00").hide();
			$("#claim_sale_info01").hide();
			$("#claim_sale_info02").hide();
			$("#claim_sale_info03").show();
			$("#claim_sale_info05").hide();
			$("#claim_sale_info04").hide();
			$("#li_claim_sale_info2").html("<strong>" + $("#frm_inp select[name=iscmcd] option:selected").text()+ String(claim_sale_aply_lmt_amt).money() + "원 이상 결제 시 추가 " + fvrval + "% 청구 할인</strong><br/>" + "(단, 개인별 1일 할인한도 최대 "+String(maxamt).money()+"원)");

		}else if($("#frm_inp select[name=iscmcd] option:selected").text() == "카드선택"){			
			//console.log("------------------------------9");
			$("#claim_sale_info00").hide();
			$("#claim_sale_info01").hide();
			$("#claim_sale_info02").hide();
			$("#claim_sale_info03").hide();
			$("#claim_sale_info05").show();
			$("#claim_sale_info04").hide();
		}else{			
			//console.log("------------------------------10");
			//그외에 무조건 안보이게 처리
			$("#claim_sale_info00").hide();
			$("#claim_sale_info01").hide();
			$("#claim_sale_info02").hide();
			$("#claim_sale_info03").hide();
			$("#claim_sale_info05").hide();
			$("#claim_sale_info04").hide();
		}
	}else{
		//console.log("------------------------------청구할인 불가");
		$("#claim_sale_info00").hide();
		$("#claim_sale_info01").hide();
		$("#claim_sale_info02").hide();
		$("#claim_sale_info03").hide();
		$("#claim_sale_info05").hide();
		$("#claim_sale_info04").hide();
	}
}

function eventCardSaleInfo(){
	// 청구할인
	if ('Y'==claim_sale_yn){
		//console.log("eventCardSaleInfo----------------1");
		var claim_sale_fvr_val = ($("#frm_inp input[name=claim_sale_fvr_val]:hidden").val()==''?'0':$("#frm_inp input[name=claim_sale_fvr_val]:hidden").val());
		var totsttlamt = ($("#frm_inp input[name=totsttlamt]:hidden").val()==''?'0':$("#frm_inp input[name=totsttlamt]:hidden").val());
		var claim_sale_aply_lmt_amt = ($("#frm_inp input[name=claim_sale_aply_lmt_amt]:hidden").val()==''?'0':$("#frm_inp input[name=claim_sale_aply_lmt_amt]:hidden").val());
		var paytype = ($("#frm_send input[name=paytype]:hidden").val()==''?'0':$("#frm_send input[name=paytype]:hidden").val());
		var claim_sale_card_max_amt =  ($("#frm_inp input[name=claim_sale_card_max_amt]:hidden").val()==''?'0':$("#frm_inp input[name=claim_sale_card_max_amt]:hidden").val());// 할인금액

		if ($("#frm_inp select[name=iscmcd]").val() == claim_sale_card_knd_cd
		 && parseInt(totsttlamt) >= parseInt(claim_sale_aply_lmt_amt)
		 && (paytype == PAYTYPE_CODE_CARD || paytype == PAYTYPE_CODE_LPAY) && parseInt(totsttlamt) > 0){ // 카드 할인 정보 표현
			//console.log("eventCardSaleInfo---------------2");
			var claim_sale_price = parseInt(totsttlamt);
				claim_sale_price = parseInt(claim_sale_price) * parseInt(claim_sale_fvr_val) * 0.01;
				if(parseInt(claim_sale_price) > parseInt(claim_sale_card_max_amt)){
					claim_sale_price = parseInt(claim_sale_card_max_amt);
				}
				claim_sale_price = parseInt(totsttlamt) - parseInt(claim_sale_price);
			claim_sale_price = Math.floor(parseInt(claim_sale_price) * 0.1) * 10;

			$("#eventcardsaleamt_cont").html("청구할인 예상가 " + String(claim_sale_price).money() + "원"); // 청구 할인 금액
			$("#eventcardsaleamt_cont").show();

			$("#claim_sale_price").html(String(claim_sale_price).money() + "원"); // 청구 할인 금액
		}else{
			//console.log("eventCardSaleInfo---------------3");
			$("#eventcardsaleamt_cont").hide();
		}
	}else{
		//console.log("eventCardSaleInfo---------------4");
		 $("#eventcardsaleamt_cont").hide();
	}
}

function allPointView(){
	if( ($("#useable_lt_point_amt").val() == 0 || $("#useable_lt_point_amt").val() == undefined)
		&& ($("#useable_lpoint_amt").val() == 0 || $("#useable_lpoint_amt").val() == undefined)
		&& ($("#useable_deposit_amt").val() == 0 || $("#useable_deposit_amt").val() == undefined)){
		$("#lp_layer").hide();
	}
}

function normalOrd(){
	goNormal(cartSn, imallYN);
}

function normalOdr(){
	goNormal(cartSn, imallYN);
}

function toggleAction (){
	$('.right_cont_area').toggleClass('off');
}
function toggleAction2 (){
	$('.box_agree_check').toggleClass('on');
}
function toggleAction3 (){
	$('.max_discount').toggleClass('on');
	$('.box_section.type4').toggleClass('active');
}
function toggleAction4 (){
	$('.Lpay-help').toggleClass('on');
}
function toggleAction5 (e){
	$('.inlineBorder').removeClass('active');
	$(e).addClass('active');
	$('.clear').addClass('off');
	$('.pay-step').addClass('on');
	//$('.order_product_content').addClass('off');
}
function toggleAction6 (e){
	$('.pay_method_area span').removeClass('on');
	$('.pay-inner').removeClass('on');
	$(e).addClass('on');
	var tab_id = $(e).attr('data-tab');
	$("#"+tab_id).addClass('on');
}
function toggleAction7 (e){
	$('.pay-inner .ng-scope').removeClass('active');
	$(e).closest('.ng-scope').addClass('active');
}
function toggleAction8 (e){
	$('.inlineBorder').removeClass('active');
	$('.tab-con').removeClass('active');
	$(e).addClass('active');
	var tab_id = $(e).attr('data-tab2');
	$("#"+tab_id).addClass('active');
}
function toggleAction9 (e){
	$('.pay-inner').removeClass('on');
	$('.tab-con').removeClass('active');
	$(e).addClass('active');
	var tab_id = $(e).attr('data-tab');
	$("#"+tab_id).addClass('active');
}
function toggleAction10(e){
	if($(e).change()){
		$('.apply_box.type2').toggleClass('off')
	};
};
function toggleAction13(){
	setTimeout(toggleAction14, 2000);
};
function toggleAction14(){
	$('.introduce_comment_wrap').hide()
}
(function disappear(){
	setTimeout(function() { $('.introduce_comment_wrap').hide(); }, 5000);
}());

//20170622기획변경
function toggleAction15(){
	$("#card_no1").val("");
	$("#card_no2").val("");
	$("#card_no3").val("");
	$("#card_no4").val("");
		var viewLayer = $('.lpoint_cert');
		if (viewLayer.css("display") == "none") {
			viewLayer.show();
			$('.btn_lotte_point2').text("취소하기");
		} else  {
			viewLayer.hide();
			fn_useLottePointCancel();
			$('.btn_lotte_point2').text("본인 확인하기");
		}
};
function toggleAction16(){
	$('.lpoint_cert').hide();
	$(".btn_lotte_point2").text("본인 확인하기");
}

//20170629수정사항
function toggleAction17(){
//console.log("슬라이드 넓이 계산 시작");
  try{
   var winwd = parent.frameWid();		
		$(".slide_wrap").width(winwd); 
		$("html, body").width(winwd);   
  	}catch(e){
        $(".slide_wrap").width(window.innerWidth);    		
        $("html, body").width(window.innerWidth);
    }

/*슬라이드 영역 넓이 계산 -- 20180508 넓이 계산 수정*/
var li_num1 = $('.slide_ul li').size(),
li_num2 = $('.slide_ul li[style="display:none"]').size(),
li_num1_width = (li_num1 * 266),
li_num2_width = (li_num2 * 266),
li_num_total = (li_num1_width - li_num2_width) + 35;
$('.slide_ul').width(li_num_total); 
//console.log("슬라이드 넓이 계산 끝");
}
//20170703스탑스크롤
function toggleAction18(){
	$('body').addClass('stop_scroll');
}
function toggleAction19(){
	$('body').removeClass('stop_scroll');
}

// 브라우저 체크
function browserChk(){
	var browser = "";
	var ua = window.navigator.userAgent;

	if(ua.indexOf('Safari') > 0) {
		if(ua.indexOf('Chrome') > 0) browser = "Chrome";
		else browser = "Safari";
	}
	return browser;
}


// L.pay WEB : 카드 등록
function fn_LpayCardRegister(){
	
	try{
		if(chekAppType == 1){
			//parent.LpayCardAdd();//사이즈로 인해 마이롯데로 변경
			window.parent.postMessage("5", "*");
		}else{
			disableItems(true);
			$("#frm_lpay input[name=req_div]:hidden").val("card_reg"); // lpay 카드 등록
			fn_LpayIframeSet(); // Lpay iframe 설정
			$("#frm_lpay").submit();
		}		
	}catch(e){
		console.log("P0000 e : " + e);
	}
	

}

// L.pay WEB : iframe 설정
function fn_LpayIframeSet(){
	var height_size = $(window).height();
	payment_pop_position(); // 결제 레이어팝업 위치 지정
	$("#ANSIM_LAYER").css("width"	,"100%");
	$("#ANSIM_LAYER").css("height"	,height_size+"px");	
	$("#frm_lpay input[name=layer_size]:hidden").val(height_size);
	window.scrollTo(0, 0); // 안심레이어 위치 지정
	$("#ANSIM_LAYER").show();
	$("#X_ANSIM_FRAME").css("height"	,height_size+"px");
	$("#X_ANSIM_FRAME").show();
}

// L.pay WEB : iframe 닫기
function fn_LpayIframeErrHide(y_offset){
	$("#frm_inp input[name=rdo_paytype]:radio[value='16']").click();
	close_iframe();
	$("#pageDesc").html("");
	$("#pageCover,#pageLoading").hide(); // 로딩 이미지 가리기 적용
	window.scrollTo(0, y_offset); // 안심레이어 위치 지정
}


//L.pay WEB : lpayCardStr 비움
/*function cleanLpayCardStr(){
	lpayCardStr = "";
	$("#lpay_paymean").html("");
	$("#lpay_paymean").hide();
	$("#lpay_list").html("");
	lpay_card_list();
	$("#lpay_list").hide();
	$("#card_select").hide();
}*/

// 재고수량체크
function fn_invQtyCheck(p_val){
	
	var return_val = false;
	
	$.ajax({
	    type: "POST",
	    dataType:"json",
	    url: "/json/mylotte/cart/searchInvQtyCheckAjax.json",
	    data: {arr_cart_sn : p_val},
	    async:false,
	    success:function(data) {
	    	
	    	if(data.resultCd == "S"){
	    		return_val = true;
	    	}else{
	    		if(data.resultCd == "P"){
	    			alert("선택하신 상품 중 [" + data.resultMsg + "]의 재고 수량이 부족하여 주문이 불가합니다.");
	    		}else{
	    			alert("선택하신 상품이 모두 품절되어 주문이\n불가합니다. 상품상세 페이지에서 재입고\n알람을 이용해주세요.");
	    		}
	    	}
	   	},
	   	error:function(request, status) {
       		alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
        }
	});
	
	return return_val;
}

function searchCncnMbrChk() {
	var returnYn = true;
	var goodsno	= $("#frm_send input[name=goodsno]:hidden").val();
	while(goodsno.indexOf(split_gubun_1) > -1){
		goodsno = goodsno.replace(split_gubun_1, ",");
	}
	var v_goods_no_list = goodsno;	
	$.ajax({
		async: false,
		type: "POST",
		dataType:"json",
		data: { goods_no_list: v_goods_no_list },
		url: "/order/searchCncnMbrInfoAjax.do",
		success:function(data) {
			if (!data.success) {
				alert(data.msg);
				returnYn = false;
			}
		},
		error:function(request, status) {		    
			alert("서버와 통신 조회중 오류 입니다. 결제하기 버튼을 다시 클릭해 주세요.");
			returnYn = false;
		}
	});
	return returnYn;	
}

//L.POINT 재계산
function lPointChange(){
	
	var dcamt;
	var ordqty;
	var goods_no;
	var saleprc;
	var lpoint_view;
	var lpoint_rsrv_rt;
	var prom_all;
	var l_point = 0;	
	var sumDisAmt = 0;	// 상품별 총 할인 금액		
	var couponType;
	var	prommdclcd;
	var	cpnpromno;
	var tempAmt		= 0;
	
	try{		
		dcamt 			= $("#frm_send input[name=totdcamt]").val();		
		ordqty 			= ($("#frm_send input[name=ordqty]:hidden").val()).split(split_gubun_1);
		goods_no 		= ($("#frm_send input[name=goodsno]:hidden").val()).split(split_gubun_1);
		saleprc			= ($("#frm_send input[name=saleprc]:hidden").val()).split(split_gubun_1);			
		lpoint_view 	= ($("#frm_inp input[name=lpoint_view]:hidden").val()).split(split_gubun_1);
		lpoint_rsrv_rt 	= ($("#frm_inp input[name=lpoint_rsrv_rt]:hidden").val()).split(split_gubun_1);
		prom_all 		= $("#frm_inp input[name=cpnpromno_all]");		
		
		for (var i=0; i < goods_no.length ; i++) {		// 주문 상품 갯수 만큼
			
			salePrc = 0;
			sumDisAmt = 0;
			
			if(lpoint_view[i] > 0){
									
				for(var curType = 0; curType < 3; curType++){		// 쿠폰 type 만큼 현재는 3개
					
					if(curType == 0){		// 1차쿠폰
						couponType	= $("#frm_send input[name=promcartsn]").val();
						if(couponType != null && couponType != ''){
							prommdclcd	= $("#frm_send input[name=prommdclcd]").val();
							cpnpromno   = $("#frm_send input[name=cpnpromno]").val();
						}
						else {
							prommdclcd = '';
						}
					}
					else if(curType == 1){		// 2차쿠폰
						couponType	= $("#frm_send input[name=promcartsn_dup]").val();
						if(couponType != null && couponType != ''){
							prommdclcd	= $("#frm_send input[name=prommdclcd_dup]").val();
							cpnpromno   = $("#frm_send input[name=cpnpromno_dup]").val();
						}
						else {
							prommdclcd = '';
						} 
					}
					else if(curType == 2){		// 3차쿠폰						
						couponType	= $("#frm_send input[name=promcartsn_third]").val();						
						if(couponType != null && couponType != ''){
							prommdclcd	= $("#frm_send input[name=prommdclcd_third]").val();
							cpnpromno   = $("#frm_send input[name=cpnpromno_third]").val();
						}
						else {
							prommdclcd = '';
						} 
					}
					
					if(prommdclcd != '' && prommdclcd != undefined){
						
						if(prommdclcd == '10'){	// 카드
							sumDisAmt =  Math.floor( (saleprc[i] * $("#frm_send input[name=orgfvrval]").val()/100) /10 ) *10;	// 판매가에서 할인율 적용
						}
						else {
							for (var j=0; j < prom_all.length ; j++) {		// 고객 전체 프로모션수 만큼															
								if( cpnpromno == $("#frm_inp input[name=cpnpromno_all]").eq(j).val() && prommdclcd == $("#frm_inp input[name=prommdclcd_all]").eq(j).val() && goods_no[i] == $("#frm_inp input[name=goodsno_all]").eq(j).val()){
									if(curType == 0){				// 1차쿠폰										
										if($("#frm_inp input[name=fvrpolctpcd_all]").eq(j).val() == '04'){		// 정율할인
											sumDisAmt = Math.floor( ($("#frm_inp input[name=dcamt_all]").eq(j).val()*1/ordqty[i]) / 10) * 10;
										}
										else {
											sumDisAmt = $("#frm_inp input[name=dcamt_all]").eq(j).val()*1;
										}										
									}
									else if(curType == 1){			// 2차 쿠폰
										tempAmt		= Math.floor( ((saleprc[i]*1-sumDisAmt) * $("#frm_inp input[name=orgfvrval_all]").eq(j).val() / 100) / 10 ) * 10;
										sumDisAmt 	+= $("#frm_inp input[name=maxfvrval_all]").eq(j).val()*1 > 0 ? (tempAmt > $("#frm_inp input[name=maxfvrval_all]").eq(j).val()*1 ? $("#frm_inp input[name=maxfvrval_all]").eq(j).val()*1 : tempAmt) : tempAmt;
									}
									else if(curType == 2){			// 3차 쿠폰
										tempAmt		= Math.floor( (saleprc[i]*$("#frm_inp input[name=orgfvrval_all]").eq(j).val()/100) / 100 ) * 100;
										sumDisAmt 	+= $("#frm_inp input[name=maxfvrval_all]").eq(j).val()*1 > 0 ? (tempAmt > $("#frm_inp input[name=maxfvrval_all]").eq(j).val()*1 ? $("#frm_inp input[name=maxfvrval_all]").eq(j).val()*1 : tempAmt) : tempAmt; 
									}								
								}							
							}
						}						
					}
				}

				l_point += Math.round(((saleprc[i]*1-sumDisAmt) * lpoint_rsrv_rt[i]/100 )) * ordqty[i];
			}			
		}
		
		$("#frm_send input[name=totRsrvAplyVal]").val(l_point);
		//setLottePointSaveDiv(dcamt);
	}
	catch(e){}
}


//퍼블 기본주문서 진입 호출
function fn_normalOrder(type){
	var v_ment = "";
	if(type == '1'){
		v_ment = "일반주문서는 기존에 이용하시던 주문서입니다. 이동하시겠습니까?";
	}else if(type == '2'){
		v_ment = "일반주문서로 이동하여 배송지 변경이 가능합니다. 이동하시겠습니까?";
	}
	try{
		if(confirm(v_ment)){
			if(chekAppType == 1){
				//20180903 GA 태깅 추가
	            GAEvtTag('MO_상품상세', '엘페이 바로결제', '배송지변경');
				window.parent.postMessage("4", "*");
			}else{
				location.href = "lpay://orderForm";
			}
		}
	}catch(e){
		console.log("P0001 e : " + e);
	}	
}

//퍼블 닫기 호출
function fn_close(ck_type){
	try{
		if(chekAppType == 1){
			if(ck_type == '1'){
				window.parent.postMessage("1", "*");
			}else if(ck_type == '2'){
				//오류 발생시 레이어 닫기
				window.parent.postMessage("3", "*");
			}			
		}else{
			location.href = "lpay://close?1";
		}
		
	}catch(e){
		console.log("P0002 e : " + e);
	}
}