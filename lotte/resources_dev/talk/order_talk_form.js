(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
         'lotteComm',
         'lotteSrh',
         'lotteSideCtg',
         'lotteSideMylotte',
         'lotteCommFooter'
     ]);

     app.controller('OrderCtrl', ['$scope','$filter','$sce','$http','$window','$log','LotteCommon', 'LotteUtil', function($scope , $filter , $sce , $http , $window , $log, LotteCommon, LotteUtil){
         $scope.showWrap = true;
         $scope.contVisible = true;
         $scope.subTitle = orderSubTitle; /*서브헤더 타이틀*/
         $scope.actionBar = true; /*액션바*/
         $scope.isShowThisSns = false; /*공유버튼*/
         $scope.orderSgl = true;

		 // iOS12에서 기존 주문번호 삭제가 안되는 현상 방어코딩 추가 2018.09.17 박형윤
		 console.log("페이지 인입 주문번호 초기화");
		 var del_date = new Date(0);
		 document.cookie = 'ORD_NO=; path=/; domain=lotte.com; expires=' + del_date + ';';
     }]);

     app.controller('ordersimpleCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
         $scope.showWrap = true;
         $scope.contVisible = true;
         $scope.subTitle = "";//서브헤더 타이틀
     }]);

})(window, window.angular);



fn_log = function(message){
	var console = window.console || {log:function(){}}; 
	console.log(message);
}

function sendTclick(t){

	if(!isEllotte){
		t = ("m_DC_" + t);
	}
	else {
		t = ("m_EL_" + t);
	}

		var setTime = 1000;
		$("#tclick_iframe").remove();
		setTimeout(function() {
				var iframe = document.createElement('iframe');
				iframe.id = 'tclick_iframe';
				iframe.style.visibility = 'hidden';
				iframe.style.display = "none";
				iframe.src = LOTTE_CONSTANTS['M_HOST_SSL'] + "/exevent/tclick.jsp?tclick=" + t + "&" + __commonParam;
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
	var lpay_yn = "N";
	var card_yn = "N";



	$("#frm_inp input[name=lpay_type]:radio").each(function() {
		if($(this).val() == cardkndcd || $(this).val() == cardkndcd_dup){
			lpay_yn = "Y";
		}
	});



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

		if(firsObjName != ""){
			paySelect(firsObjName);	//최근결제수단 선택
		}
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
		$("#dcAmt1").text("");
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

		// 개수표시 추가, 모바일주문서간소화, 2015-01-28, hglee4
		// 할인(n개), n = '선택안함'이 아니며 disable 상태가 아닌 선택옵션의 개수
		$("#dcAmt2").text("(" + $("#frm_inp select[name=dup_coupon] option")
				.not("[value=N], :disabled").length + "개)");
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
		$("#dcAmt3").text("");
		$("singlePayText").text(""); // 이영석 2016.11.28 할부결제 체크 시 수정
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
					"<option value='" + cardinstmonlist[i] + "'>무이자" + text + "</option>");
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
					"<option value='" + cardinstmonlist[i] + "'>할부" + text + "</option>");
		}
		//$("#frm_inp select[name=cardinstmon]").attr('disabled' , false);
	}

	if ( $("#frm_inp select[name=cardinstmon] option").length > 1 && $("#frm_send input[name=prommdclcd_third]").val() != "35" ) {
		$("#frm_inp select[name=cardinstmon]").attr('disabled' , false);
	} else {
		$("#frm_inp select[name=cardinstmon]").attr('disabled' , true);
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

	if(pay_id != ""){
		if($("#frm_inp input[name="+pay_id+"_card_confirm_type]:hidden").val() != "" && $("#frm_inp input[name="+pay_id+"_card_confirm_type]:hidden").val() != undefined){
			$("#frm_inp input[name=card_confirm_type]:radio[value='"+$("#frm_inp input[name="+pay_id+"_card_confirm_type]:hidden").val()+"']").prop("checked", true);
		}
	}
}

// 할부월 및 할인구분 제어
function select_third_coupon_controll(prommdclcd) {

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
	paycardinstmon();
}

function fnClear(obj) {
		obj.style.background = '';
}

// 롯데카드 결제 (pay_type => EACS:안심클릭 only, ESPS:간편결제 only, ACS:안심클릭기본, SPS:간편결제기본)
function lottecard_payment(pay_type){
	$("#ANSIM_LAYER").css("width"	,"100%");
	$("#ANSIM_LAYER").css("height"	,"530px");
	window.scrollTo(0, 0);
	$("#ANSIM_LAYER").show();
	$("#X_ANSIM_FRAME").show();
	$("#SIMPLEPAYFORM input[name=PAY]:hidden").val(pay_type);
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
	fn_log("spay_exec() 실행");
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
	//fn_talkOrderFail(); 넣으면 안됨 
}
// 결제창 닫기
function close_iframe() {
	returnPaymentPage();
	location.hash="#PAYMENT_ANCHAR"; // 위치이동

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

// 2011.05.26 무료배송권 사용 함수
function fn_freeDlvpCpnUse(){
	var dlv_prom_use_yn = $("#dlv_prom_use_yn").val();
	var dlv_fvr_val = $("#dlv_fvr_val").val();
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	if (dlv_prom_use_yn == "N" && parseInt(dlv_fvr_val) > parseInt(totsttlamt)){
		$("#dlv_prom_use_yn").val("N");
		$("#frm_inp input[name=free]").eq(1).prop('checked',true);
		alert("배송비할인 금액이 결제금액보다 클 수 없습니다.");
		return;
	}
	$("#dlv_prom_use_yn").val($("#frm_inp input[name=free]:checked").val());
	fn_calcTotalPrice();
	paycardinstmon();
}

// 2011.06.14 스마트페이 결제 완료 후
function setCertSmartpayResult(xid, eci, cavv, cardno, joinCode, hs_useamt_sh, restype, userkey, result ) {
	paramSmartpaySet(xid, eci, cavv, cardno, hs_useamt_sh, restype, userkey, result );
}

//-->실제 승인페이지로 넘겨주는 form에 xid, eci, cavv, realPan를 세팅한다.
function paramSmartpaySet(xid, eci, cavv, realPan, hs_useamt_sh, restype, userkey, result ){
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
	$("#frm_inp select[name=rdo_cash]").change();

	// 롯데포인트 적립금액 세팅
	setLottePointSaveDiv(0);
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
				$("#bene_group_deli_amt_" + deli_idx).find("span").attr("dlex", dlex_amt);
				$("#bene_group_deli_amt_" + deli_idx).find("span").html(
						freeShippingYn=='Y' ? "무료 <span class=\"no_bold\">(플래티넘+ 회원)</span>" : (dlex_amt==0? "무료" : new String(dlex_amt).money() + "<span class=\"no_bold\">원</span>"));
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


function send() {
	// iOS12에서 기존 주문번호 삭제가 안되는 현상 방어코딩 추가 2018.09.17 박형윤
	console.log("주문번호 초기화");
	var del_date = new Date(0);
	document.cookie = 'ORD_NO=; path=/; domain=lotte.com; expires=' + del_date + ';';
		
	//음성주문 아이프레임 
	iscmcd = $("#frm_send input[name=iscmcd]:hidden").val();
	cpncardcd	= $("#frm_send input[name=cardkndcd]:hidden").val();	// 할인쿠폰의 카드정보
	cpncardcd_dup = $("#frm_send input[name=cardkndcd_dup]:hidden").val();	// 중복카드할인쿠폰의 카드정보
	
	if(totpayamt == ""){
		var spayamt	 = $("#frm_send input[name=defaulttotsttlamt]:hidden").val(); // 배송비가 합쳐 있는 금액
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
			stot_deli_amt = $("#frm_send input[name=orgtotdeliamt]:hidden").val(); // 배송비
		}else{
			if(qs_yn == "Y"){
				stot_deli_amt = $("#frm_send input[name=orgtotdeliamt]:hidden").val(); // 배송비
			}
		}
		// 배송비 적용
		if (freeShippingYn=='N'){ // 플래티넘 플러스가 아니면
			totpayamt   = (parseInt(totpayamt) + parseInt(stot_deli_amt) - parseInt($("#frm_send input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
		}else{
			if(qs_yn == "Y"){
				totpayamt   = (parseInt(totpayamt) + parseInt(stot_deli_amt) - parseInt($("#frm_send input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
			}
		}
	}

	// 결제정보	
	paytype	= $("#frm_send input[name=paytype]:hidden").val(); // 결제수단	
	totsttlamt = $("#frm_send input[name=totsttlamt]:hidden").val(); // 총결제금액	
	if (parseInt(totsttlamt) > 0){
		var iscmcd, cardinstmon, virAcctBank, onlineacctname;
		if ( paytype == PAYTYPE_CODE_CARD || paytype == PAYTYPE_CODE_LPAY ) {
			iscmcd			= $("#frm_send input[name=iscmcd]:hidden").val();
			// 2012.12.26
			cardinstmon		= $("#frm_send input[name=cardinstmon]:hidden").val();
			
			//음성주문은 일시불 고정
			cardinst = "01";
			cardinstmon = "";			
			totsttlamt 		= $("#frm_send input[name=totsttlamt]:hidden").val();
			bankno			= "";
			onlineacctname  = "";
			reg_no1 = "";
			reg_no2 = "";
			
			//주문확정 페이지에서 미리 체크 예정이지만 남겨둠
			if ( totsttlamt < 10 ) {
				alert('10원 이상 결제 시 신용카드 사용이 가능합니다.');
				return;
			} else if ( $.trim(iscmcd) == '' && paytype == PAYTYPE_CODE_CARD ) {
				alert('카드 종류를 선택해주세요.');
				return;
			} else if ( paytype == PAYTYPE_CODE_LPAY ) {
				if( $.trim(iscmcd) == '' ){
					alert('L.pay 앱을 실행하여 카드를 등록해주세요.');
					//return;
				}
			} else if (totsttlamt > 300000 && (varUa < 0) && cp_schema == 'mlotte003' && $.trim(iscmcd)!=paytype_card_048 && $.trim(iscmcd)!=paytype_card_029 && $.trim(iscmcd)!=paytype_card_016 && $.trim(iscmcd)!=paytype_card_026 && $.trim(iscmcd)!=paytype_card_047 && $.trim(iscmcd)!=paytype_card_002 && $.trim(iscmcd)!=paytype_card_054 && $.trim(iscmcd)!=paytype_card_021 && $.trim(iscmcd)!=paytype_card_020 && $.trim(iscmcd)!=paytype_card_008){ // 아이패드 : 롯데/신한/현대/국민/BC/삼성/광주/우체국 카드/농협 외 30만원 결제 불가 처리
				// 30만원 이상 결제시 안내처리
				alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
				return;
			} else if (totsttlamt > 300000 && (varUa < 0) && $.trim(iscmcd)!=paytype_card_048 && $.trim(iscmcd)!=paytype_card_029 && $.trim(iscmcd)!=paytype_card_016 && $.trim(iscmcd)!=paytype_card_026 && $.trim(iscmcd)!=paytype_card_047 && $.trim(iscmcd)!=paytype_card_031 && $.trim(iscmcd)!=paytype_card_002 && $.trim(iscmcd)!=paytype_card_054 && $.trim(iscmcd)!=paytype_card_021 && $.trim(iscmcd)!=paytype_card_020 && $.trim(iscmcd)!=paytype_card_008 && $.trim(iscmcd)!=paytype_card_018 && $.trim(iscmcd)!=paytype_card_036){ // 아이폰 및 웹 : 롯데/신한/현대/국민/BC/광주/우체국 카드/농협 외 30만원 결제 불가 처리
				// 30만원 이상 결제시 안내처리
				alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 삼성, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
				return;
			} else if (totsttlamt > 300000 && $.trim(iscmcd)!=paytype_card_048 && $.trim(iscmcd)!=paytype_card_029 && $.trim(iscmcd)!=paytype_card_016 && $.trim(iscmcd)!=paytype_card_026 && $.trim(iscmcd)!=paytype_card_020 && $.trim(iscmcd)!=paytype_card_047 && $.trim(iscmcd)!=paytype_card_031 && $.trim(iscmcd)!=paytype_card_002 && $.trim(iscmcd)!=paytype_card_054 && $.trim(iscmcd)!=paytype_card_021 && $.trim(iscmcd)!=paytype_card_008 && $.trim(iscmcd)!=paytype_card_018 && $.trim(iscmcd)!=paytype_card_036){ // 롯데/신한/현대/국민/삼성/BC/하나SK/광주/우체국 카드/농협 외 30만원 결제 불가 처리
				// 30만원 이상 결제시 안내처리
				alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 삼성, 비씨, 하나SK, 광주, 우체국 카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
				return;
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
/*			iscmcd		= "";
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
			}*/
			alert("음성주문은 카드, 엘페이 결제만 가능합니다."); //가칭 
			return;
		} else if  ( paytype == PAYTYPE_CODE_PHONE ) {
		/*			iscmcd		= "";
					cardinst	= "";
					cardinstmon	= "";
					bankno			= "";
					onlineacctname  = "";
					reg_no1 = $("#frm_inp input[name=reg_no1]").val();
					reg_no2 = $("#frm_inp input[name=reg_no2]").val();*/
			alert("음성주문은 카드, 엘페이 결제만 가능합니다."); //가칭 
			return;
		} else if  ( typeof($("#pntOnlyPay").val()) != undefined &&  $("#pntOnlyPay").val() == '19' ) {
			alert("L.POINT 전용 상품입니다. \n음성주문은 카드, 엘페이 결제만 가능합니다.");
			return;
		} else if  ( typeof($("#pntOnlyPay").val()) != undefined &&  $("#pntOnlyPay").val() == '21' ) {
			alert("L-money 전용 상품입니다. \n음성주문은 카드, 엘페이 결제만 가능합니다.");
			return;
		} else {
			alert('결제수단 사전등록 해주세요.');
			return;
		}

		$("#frm_send input[name=paytype]:hidden").val( paytype );
		$("#frm_send input[name=iscmcd]:hidden").val( iscmcd );
		$("#frm_send input[name=cardinst]:hidden").val( cardinst );
		$("#frm_send input[name=cardinstmon]:hidden").val( cardinstmon );
		$("#frm_send input[name=bankno]:hidden").val( bankno );
		$("#frm_send input[name=onlineacctname]:hidden").val( onlineacctname );

		if(paytype == PAYTYPE_CODE_LPAY){
/*			$("#frm_send input[name=lpay_card_id]:hidden").val( $("select[name=iscmcd]").find("option:selected").attr("data-card-id") ); // 고객 보유 카드 ID
			$("#frm_send input[name=lpay_card_anm]:hidden").val( $("select[name=iscmcd]").find("option:selected").attr("data-card-anm") ); // 고객 보유 카드명(닉네임)*/
			//음성주문 사전 등록한 결제수단 정보로 입력 
			//$("#frm_send input[name=lpay_card_id]:hidden").val( $("#frm_send input[name=iscmcd]:hidden").val() ); // 고객 보유 카드 ID 카드명은 추후 처리해야 함
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

/*	$.each($("#frm_inp input:checkbox[name=chk_point]:checked"), function(){
			chk_arr.push($(this).val());

			if($(this).val()=="lpoint"){ // L-money
				pay_cd_arr.push(lPoint);
				pay_amt_arr.push(lpoint_amt);

			}

			if($(this).val()=="lt_point"){ // 롯데포인트
				pay_cd_arr.push(ltPoint);
				pay_amt_arr.push(lt_point_amt);
			}
		}
	);*/

	/*var chk_arr_all = new Array();
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
	$("#frm_send input[name=chk_point]:hidden").val( chk_point );
	$("#frm_send input[name=chk_point_all]:hidden").val( chk_point_all );
	$("#frm_send input[name=pay_mean_cd]:hidden").val( pay_mean_cd );
	$("#frm_send input[name=pay_amt]:hidden").val( pay_amt );*/

	// 무료배송권 정보
/*	var dlv_prom_use_yn, dlv_fvr_val, dlv_prom_no, dlv_rsc_mgmt_sn
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
	$("#frm_send input[name=dlv_rsc_mgmt_sn]:hidden").val( dlv_rsc_mgmt_sn );*/

	// 총결제금액 
	//$("#frm_send input[name=totsttlamt]:hidden").val( totsttlamt );

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
	$("#ANSIM_LAYER").css("top"	,"10px");
	window.scrollTo(0, 0); // 안심레이어 위치 지정
}

function doXansim() {
	console.log("doXansim");
	
	iscmcd = $("#frm_send input[name=iscmcd]:hidden").val();
	paytype		= $("#frm_send input[name=paytype]:hidden").val();
	pay_mean_cd	= $("#frm_send input[name=pay_mean_cd]:hidden").val();
	cardkndcd   = $("#frm_send input[name=cardkndcd]:hidden").val();
	cardkndcd_dup   = $("#frm_send input[name=cardkndcd_dup]:hidden").val();
	$("#frm_send input[name=credit_crd_gb]:hidden").val(""); // ISP, MPI 구분

/*	console.log("iscmcd : "+iscmcd);
	console.log("paytype : "+paytype);
	console.log("pay_mean_cd : "+pay_mean_cd);
	console.log("cardkndcd : "+cardkndcd);
	console.log("cardkndcd_dup : "+cardkndcd_dup);*/
	
	disableItems(true);
	
	if ( paytype == PAYTYPE_CODE_LPAY ){ // LPAY 결제
		$("#frm_lpay input[name=req_div]:hidden").val("pay_req"); // 결제요청
		
		fn_LpayIframeSet(); // Lpay iframe 설정
		
		var lpay_param = ["goodsno", "lt_point_amt", "totsttlamt", "iscmcd", "cardinst", "cardinstmon", "lpay_card_id", "lpay_card_anm", "giftyn", "prommdclcd", "ordr_nm", "ordr_cell_no"];		
		for (var i=0; i<lpay_param.length; i++){ // 파라메터 셋팅
			$("#frm_lpay input[name="+lpay_param[i]+"]:hidden").val($("#frm_send input[name="+lpay_param[i]+"]:hidden").val());
		}
		
		// L.pay WEB : 결제 데이터 초기화
		$("#frm_send input[name=xid]:hidden").val("");
		$("#frm_send input[name=eci]:hidden").val("");
		$("#frm_send input[name=cavv]:hidden").val("");
		//$("#frm_send input[name=cardno]:hidden").val(""); //초기화빼야함 
		$("#frm_send input[name=lpay_conf_no]:hidden").val(""); // LPAY_CONF_NO
		$("#frm_send input[name=lpay_pay_sn]:hidden").val(""); // pay_sn
		$("#frm_send input[name=lpay_json_data]:hidden").val("");
		
		//$("#frm_send input[name=cardno]:hidden").val($("#frm_lpay input[name=lpay_card_id]:hidden").val()); //webTalkClient에서 셋팅		
		$("#frm_send input[name=credit_crd_gb]:hidden").val("4"); // LPAY 카드 구분
		$("#frm_send input[name=smart_pay_use_yn]").val(""); // 스마트페이 여부
		
		$("#pageDesc").html("결제 준비 중입니다.<br>잠시만 기다려 주세요.");
		$("#pageCover,#pageLoading").show(); // 로딩 이미지 적용
		$("#frm_lpay").submit();
	// 002:광주, 008:외환, 016:KB국민, 018:NH, 020:하나SK, 026:비씨, 029:신한, 031:삼성, 036:씨티, 047:롯데, 048:현대, 054:우체국체크
	}else if ( paytype == PAYTYPE_CODE_CARD ) {	// 결제 수단이 카드
		X_CARDTYPE	= $("#frm_card input[name=X_CARDTYPE]:hidden").val();
		
		/*console.log("X_CARDTYPE : "+X_CARDTYPE);*/
		
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
		//var pay_confirm_type = $("input[name=card_confirm_type]:radio:checked").val(); // 카드 인증 방식
		
		
		var pay_confirm_type = $("#frm_send input[name=op_pay_mean_hist_card_pay_meth_cd]:hidden").val();
		
		/*console.log("pay_confirm_type : "+pay_confirm_type);*/
		

		$("#frm_send input[name=smart_pay_use_yn]").val(""); // 스마트페이 여부

		if (X_CARDTYPE == paytype_card_047 ) { // 롯데카드
			if (pay_confirm_type == "01"){ // 스마트페이(간편결제)
				$("#frm_send input[name=smart_pay_use_yn]").val("Y");
				lottecard_payment('SPS');
			}else if (pay_confirm_type == "02"){ // 안심결제
				lottecard_payment('ACS');
			}else if (pay_confirm_type == "03"){ // 앱결제
				// lottecard_payment('APC'); // 롯데카드사에서 개발하지 않음
				lottecard_payment('ACS');
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
			fn_log("spay_exec() 실행전");
			spay_exec(); // spay 실행 (KBApp Card)
		} else if (X_CARDTYPE == paytype_card_016
				|| X_CARDTYPE == paytype_card_021
				|| X_CARDTYPE == paytype_card_054
				|| X_CARDTYPE == paytype_card_002
			) { // mISP (KB국민, 비씨, 우체국체크, 광주)
			
			if (confirm("국민,광주,우체국체크카드(ISP) 결제는 3G 또는 LTE로 진행 해야 안정적으로 결제하실 수 있습니다.\n결제를 진행하시겠습니까?")){
				fn_log('국민,광주,우체국체크카드 misp 전송 페이지 호출');
				$("#frm_send input[name=credit_crd_gb]:hidden").val("1"); // ISP
				misp_create_data();
			}else{
				disableItems(false);
				fn_talkOrderFail();
			}
		} else if (X_CARDTYPE == paytype_card_026) {
			fn_log('BC카드 misp 전송 페이지 호출');
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
			alert("지원되지 않는 카드 입니다.");
			fn_talkOrderFail();
		}

	} else if ( paytype == PAYTYPE_CODE_BANK ) {	// 결제 수단이 인터넷뱅킹
		bankno			= $("#frm_send input[name=bankno]:hidden").val();
		onlineacctname	= $("#frm_send input[name=onlineacctname]:hidden").val();

		if ( $.trim(bankno) == ''
			|| $.trim(onlineacctname) == '' )
		{
			disableItems(false);
			alert('무통장 입금 정보가 부정확합니다.');
			fn_talkOrderFail();
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
		fn_talkOrderFail();
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
		alert("지원되지 않는 결제방법 입니다.");
		fn_talkOrderFail();
	}
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
	dcamt = $("#frm_send input[name=totdcamt]").val();
	dup_cpn_amt = sessionStorage.getItem("fvr_val"); // 중복쿠폰
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

	// 참좋은혜택 합계 계산
	var totOrdAmt = totpayamt;
	if(includeSaveInstCpn != 'Y'){
		totOrdAmt = Number(totOrdAmt) + Number(dcamt);
	}
	$("#bene_tot_amt").find("span").text( String(totOrdAmt).money() + "원" );
	$("#frm_inp input[name=totordamt]:hidden").val(totOrdAmt);

	var ordDlvInfo = "";

	if(freeShippingYn == "Y"){
		ordDlvInfo = "배송비무료";
	}else if($("#frm_inp input[name=orgtotdeliamt]:hidden").val() > 0){
		ordDlvInfo = "배송비포함";
	}else{
		ordDlvInfo = "배송비무료";
	}

	$("#totalOrdAmt").html( "<strong>" + String(totOrdAmt).money() + "</strong>원<span>"+ordDlvInfo+"</span>");

	//총 적립금액
	var totRsrvAplyVal = $("#frm_send input[name=totRsrvAplyVal]").val();
	var totRsrvAplyHtml = "";
	var temp_dcamt = 0;

	if( $("#frm_send input[name=includeSaveInstCpn]").val() != 'Y' ){ // 할인선택값에 대한 적립여부 체크
		temp_dcamt = 0;
	}else{
		temp_dcamt = dcamt;
	}

	if ($("select[name='coupon']").val() == "0" && $("#frm_send input[name=prommdclcd]").val() == "27") {
		totRsrvAplyVal = 0;
	}

	if( (Number(totRsrvAplyVal) + Number(temp_dcamt)) > 0 && $("#frm_send input[name=prommdclcd]").val() != "27"){
		totRsrvAplyHtml = "<ul><li class='list_depth2'><p class='left'>총 적립 금액</p><p class='right'>"+new String(Number(temp_dcamt) + Number(totRsrvAplyVal)).money()+"점 예정</p></li></ul>";
		$("#li_totRsrvAplyVal").html(totRsrvAplyHtml);
	}else{
		$("#li_totRsrvAplyVal").hide();
	}

	// 중복쿠폰 사용
	if (dup_cpn_amt > 0){
		totpayamt	= (totpayamt - dup_cpn_amt).toString();
	}

	// 3차쿠폰 사용
	if (third_cpn_amt > 0){
		totpayamt	= (totpayamt - third_cpn_amt).toString();
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

//			dlv_prom_use_yn = 'N';
//			$("#dlv_prom_use_yn").val("N"); // 무료배송권 사용 여부
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

	// 배송비 적용 kschoi2 이거 처리해야됨 내일 처리
	$("#deli_amt_ul").show();
	$("#deli_amt_ul li").filter(".pr_text2").text(new String(tot_deli_amt).money()+"원");

	// 2014.12.24 모바일주문간소화 jjkim59
	var discountSum = 0;
	var pointSum = 0;

	// 할인 쿠폰 정보
	if ( dcamt > 0 && includeSaveInstCpn=='N') {	// 할인금액만 체크하고 카드구분코드는 null 일 수도 있고 not null 일수도 있기때문에 조건에서 제거.
		totalPriceHtml += '<li class="pr_text1">'+prommdclcdNm+'</li>'
								+ '<li class="pr_text2">(-)' + dcamt.money() + '원</li>';
		discountSum += parseInt(dcamt);
	}

	// 중복 쿠폰 정보
	if ( dup_cpn_amt > 0 ){
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">추가할인</li>'
									+ '<li class="pr_text2">(-)' + dup_cpn_amt.money() + '원</li>';

		discountSum += parseInt(dup_cpn_amt);

	}

	// 3차 쿠폰 정보
	if ( third_cpn_amt > 0 ){
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">'+(prommdclcd_third=="35"?'일시불할인':'')+'</li>'
									+ '<li class="pr_text2">(-)' + third_cpn_amt.money() + '원</li>';

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

	// L_포인트 정보
	if ( lpoint_amt > 0 ) {
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">L-money</li>'
								+ '<li class="pr_text2">(-)' + lpoint_amt.money() + '점</li>';

		$("#old_lpoint_amt").val(lpoint_amt);

		discountSum += parseInt(lpoint_amt);
		pointSum += parseInt(lpoint_amt);
	} else if ( lpoint_amt > -1 ) {
		$("#old_lpoint_amt").val(lpoint_amt);
	}

	// 롯데포인트 정보
	if ( lt_point_amt > 0 ) {
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">L.POINT</li>'
								+ '<li class="pr_text2">(-)' + lt_point_amt.money() + '점</li>';

		$("#old_lt_point_amt").val(lt_point_amt);

		if($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_LPAY){
			$("#temp_lt_point_amt").val(lt_point_amt);
		}

		discountSum += parseInt(lt_point_amt);
		pointSum += parseInt(lt_point_amt);
	} else if ( lt_point_amt > -1 ) {
		$("#old_lt_point_amt").val(lt_point_amt);
	}

	// 보관금 정보
	if ( deposit_amt > 0 ) {
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">보관금</li>'
								+ '<li class="pr_text2">(-)' + deposit_amt.money() + '원</li>';

		$("#old_deposit_amt").val(deposit_amt);

		discountSum += parseInt(deposit_amt);
		pointSum += parseInt(deposit_amt);
	} else if ( deposit_amt > -1 ) {
		$("#old_deposit_amt").val(deposit_amt);
	}

	// 내포인트사용 -- 모바일주문서간소화
	$("#usePointSum").html(pointSum.toString().money()+"<span class=\"no_bold\">원</span>");

	// 무료배송권 정보
	if (dlv_prom_use_yn=="Y" && dlv_fvr_val > 0){
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">무료배송권</li>'
								+ '<li class="pr_text2">(-)' + dlv_fvr_val.money() + '원</li>';
	}

	// 2014.12.24 모바일주문간소화 jjkim59
	var discountHTML = (discountSum.toString().money() == "0" ? "" : "") + discountSum.toString().money() + '원';
	$("#discount").html(discountHTML);

	// 할인 인 경우만 금액 차감
	$("#lottepointSave").empty();
	setLottePointSaveDiv(dcamt);

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

	$("#totalprice").html(totpayamt.money() +"<span>원</span>");
	$("#frm_inp input[name=totsttlamt]:hidden").val(totpayamt);

	// 청구할인
	if ('Y' == claim_sale_yn){
		//console.log("청구할인!");
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
				//20160127
		//console.log("청구할인 : " + claim_sale_price + "/" + claim_sale_fvr_val);
		//console.log("cpcnFlag : " + cpcnFlag);
		if(cpcnFlag){
			//console.log("################################1");

			$("#eventcardsaleamt_cont").html("청구할인가 " + String(claim_sale_price).money() + "원 예상"); // 청구 할인 금액
						$("#eventcardsaleamt_cont").show();
						$("#claim_sale_price").html(String(claim_sale_price).money() + "원");
				}else{
					//console.log("################################2");
					$("#eventcardsaleamt_cont").hide();
					$("#claim_sale_price").html("");
				}
		if (parseInt(totpayamt) >= parseInt(claim_sale_aply_lmt_amt)
		 && $("#frm_inp select[name=iscmcd]").val() == claim_sale_card_knd_cd
		 && (paytype == PAYTYPE_CODE_CARD || paytype == PAYTYPE_CODE_LPAY) && parseInt(totpayamt) > 0){
			//20160127   청구할인 구간대 설정
			if(cpcnFlag){
										 fn_formshow();
						 }
		}else{
			//20160127
							if(cpcnFlag){
										 fn_formshow();
						 }

		}
	}

	pointUse();
	fn_all_dc();
	//console.log("호출2");

	//paycardinstmon();
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
	fn_log("misp_exec 실행");
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
		fn_talkOrderFail();
	}
}

// misp 자료 전송
function misp_send(){
	fn_log("misp_send()실행");
	$("#frm_send").attr("action", "/misp/toTransData.jsp");
	$("#frm_send").attr("method", "post");
	$("#frm_send").attr("target", "X_ANSIM_FRAME");
	$("#frm_send").submit();
}

// misp 정보 셋팅 후 misp 전송 페이지 호출
function misp_create_data(){
	 $("#frm_send input[name=isp_yn]:hidden").val("Y");
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
			fn_log("misp_send() 실행 ssh");
			misp_send();
			}
		, error : init_misp()
	});
}

// misp 정보 초기화
function init_misp(){
	fn_log("init_misp() 실행");
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
	fn_log("init_misp() 실행완료");
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

//최대할인금액 설정 용...
var maxFirstIdx = ""; // 1차할인 최대값 index.
var maxDupIdx = ""; // 2차할인 최대값 index.
var maxSaveFirstIdx = ""; // 1차할인 적립최대값 index
var maxSaveDupIdx = ""; // 1차할인 적립일 때, 2차할인 최대값 index
// 최대할인금액 설정.
function setMaxDc() {
	var maxAmt = 0; // 최대금액
	var maxFirstAmt = 0; // 1차할인 최대값.
	var maxDupAmt = 0; // 2차할인 최대값.
	var maxSaveFirstAmt = 0; // 1차할인 적립최대값.
	var maxSaveDupAmt = 0; // 1차할인 적립일 때, 2차할인 최대값.

	var first_cpn = "0";
	var dup_cpn   = "0";

	$("#frm_inp select[name=coupon]").find("option").each(function(){

		var coupon_idx = $(this).val();

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

			if ( $.type($("#frm_inp select[name=dup_coupon]").val()) == "undefined" ) { // 2차가 없다.
				if ( parseInt(totdcamt) >= parseInt(maxFirstAmt) ) {
					maxAmt = totdcamt;
					// 적립여부에 따라 구분
					if( "N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt) ){
						maxFirstAmt = totdcamt;
						maxFirstIdx = coupon_idx;
						maxDupAmt = 0;
						maxDupIdx = "";
					}
					else if( "Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt) ){
						maxSaveFirstAmt = totdcamt;
						maxSaveFirstIdx = coupon_idx;
						maxSaveDupAmt = 0;
						maxSaveDupIdx = "";
					}
				}
			} else { // 2차가 있다.

				$("#frm_inp select[name=dup_coupon]").find("option").each(function(){
					var dupcpn_idx = $(this).val();
					var tmp_arr_cnt = 0;
					var tmp_arr;

					v_cpn_crd_dc_amt = 0;
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
								//alert("1:"+totdcamt+":"+coupon_idx+":"+totdupdcamt+":"+dupcpn_idx);
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
											if ( parseInt(totdcamt) + parseInt(totdupdcamt) >= parseInt(maxAmt) ) {
												maxAmt = parseInt(totdcamt)+parseInt(totdupdcamt);
												// 적립여부에 따라 구분
												if( "N" == includeSaveInstCpn && parseInt(maxAmt) > parseInt(maxFirstAmt) + parseInt(maxDupAmt) ){
													maxFirstAmt = totdcamt;
													maxFirstIdx = coupon_idx;
													maxDupAmt = totdupdcamt;
													maxDupIdx = dupcpn_idx;
												}else if( "Y" == includeSaveInstCpn && parseInt(maxAmt) > parseInt(maxSaveFirstAmt) + parseInt(maxSaveDupAmt) ){
													maxSaveFirstAmt = totdcamt;
													maxSaveFirstIdx = coupon_idx;
													maxSaveDupAmt = totdupdcamt;
													maxSaveDupIdx = dupcpn_idx;
												}
											}
										}
									}else if (prommdclcd == "27"){ // 임직원할인
										if ( parseInt(totdcamt) >= parseInt(maxAmt) ) { // 2차 사용못함
											// 적립여부에 따라 구분
											if( "N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt) ){
												maxFirstAmt = totdcamt;
												maxFirstIdx = coupon_idx;
												maxDupAmt = 0;
												maxDupIdx = "";
											}
											else if( "Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt) ){
												maxSaveFirstAmt = totdcamt;
												maxSaveFirstIdx = coupon_idx;
												maxSaveDupAmt = 0;
												maxSaveDupIdx = "";
											}
										}
									}else{
										if ( parseInt(totdcamt) + parseInt(totdupdcamt) >= parseInt(maxAmt) ) {
											maxAmt = parseInt(totdcamt)+parseInt(totdupdcamt);
											// 적립여부에 따라 구분
											if( "N" == includeSaveInstCpn && parseInt(maxAmt) > parseInt(maxFirstAmt) + parseInt(maxDupAmt) ){
												maxFirstAmt = totdcamt;
												maxFirstIdx = coupon_idx;
												maxDupAmt = totdupdcamt;
												maxDupIdx = dupcpn_idx;
											}else if( "Y" == includeSaveInstCpn && parseInt(maxAmt) > parseInt(maxSaveFirstAmt) + parseInt(maxSaveDupAmt) ){
												maxSaveFirstAmt = totdcamt;
												maxSaveFirstIdx = coupon_idx;
												maxSaveDupAmt = totdupdcamt;
												maxSaveDupIdx = dupcpn_idx;
											}
										}
									}
								} else {
									//alert("2:"+totdcamt+":"+coupon_idx+":"+totdupdcamt+":"+dupcpn_idx);
									if ( parseInt(totdcamt) >= parseInt(maxAmt) ) {
										maxAmt = totdcamt;
										// 적립여부에 따라 구분
										if( "N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt) ){
											maxFirstAmt = totdcamt;
											maxFirstIdx = coupon_idx;
											maxDupAmt = 0;
											maxDupIdx = "";
										}
										else if( "Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt) ){
											maxSaveFirstAmt = totdcamt;
											maxSaveFirstIdx = coupon_idx;
											maxSaveDupAmt = 0;
											maxSaveDupIdx = "";
										}

										promcartsn      = "";
										prommdclcd		= "";
										fvrpolctpcd		= "";
										totdcamt		= "0";
										cpnpromno		= "";
										cpnrscmgmtsn		= "";
										adtncostdtlsctnm	= "";
										cardkndcd		= "";
										includeSaveInstCpn = "";
									}
								}
							} else {
								//alert("3:"+totdcamt+":"+coupon_idx+":"+totdupdcamt+":"+dupcpn_idx);
								if ( parseInt(totdcamt) >= parseInt(maxAmt) ) {
									maxAmt = parseInt(totdcamt);
									// 적립여부에 따라 구분
									if( "N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt) ){
										maxFirstAmt = totdcamt;
										maxFirstIdx = coupon_idx;
										maxDupAmt = 0;
										maxDupIdx = "";
									}
									else if( "Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt) ){
										maxSaveFirstAmt = totdcamt;
										maxSaveFirstIdx = coupon_idx;
										maxSaveDupAmt = 0;
										maxSaveDupIdx = "";
									}

									promcartsn      = "";
									prommdclcd		= "";
									fvrpolctpcd		= "";
									totdcamt		= "0";
									cpnpromno		= "";
									cpnrscmgmtsn		= "";
									adtncostdtlsctnm	= "";
									cardkndcd		= "";
									includeSaveInstCpn = "";
								}
							}
						}
					} else {
						if ( parseInt(totdcamt) >= parseInt(maxAmt) ) {
							maxAmt = totdcamt;
							// 적립여부에 따라 구분
							if( "N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt) ){
								maxFirstAmt = totdcamt;
								maxFirstIdx = coupon_idx;
								maxDupAmt = 0;
								maxDupIdx = "";
							}
							else if( "Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt) ){
								maxSaveFirstAmt = totdcamt;
								maxSaveFirstIdx = coupon_idx;
								maxSaveDupAmt = 0;
								maxSaveDupIdx = "";
							}
						}
					}
				});
			}
		} else { // 1차 선택이 안된경우.
			if ( $.type($("#frm_inp select[name=dup_coupon]").val()) != "undefined" ) { // 2차가 있다.
				$("#frm_inp select[name=dup_coupon]").find("option").each(function(){
					var dupcpn_idx = $(this).val();
					var tmp_arr_cnt = 0;
					var tmp_arr;

					v_cpn_crd_dc_amt = 0;
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

									if ( parseInt(v_cpn_crd_dc_amt) > parseInt(maxAmt) ) {
										maxAmt = parseInt(v_cpn_crd_dc_amt);

										maxFirstAmt = parseInt(v_cpn_crd_dc_amt);;
										maxFirstIdx = coupon_idx;
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
								} else {
									promcartsn      = "";
									prommdclcd		= "";
									fvrpolctpcd		= "";
									totdcamt		= "0";
									cpnpromno		= "";
									cpnrscmgmtsn		= "";
									adtncostdtlsctnm	= "";
									cardkndcd		= "";
									includeSaveInstCpn = "";
								}
							}
						}
					}
				});
			}
		}
	});
	//alert(maxFirstIdx+":"+maxDupIdx);
	//maxDupIdx = "0";
	if( parseInt(maxFirstAmt) + parseInt(maxDupAmt) < parseInt(maxSaveFirstAmt) + parseInt(maxSaveDupAmt) ){
		maxFirstIdx = maxSaveFirstIdx;
		maxDupIdx = maxSaveDupIdx;
	}
	maxFirstIdx = maxFirstIdx == ""?"N":maxFirstIdx;
	maxDupIdx = maxDupIdx == ""?"N":maxDupIdx;
	if ( maxFirstIdx != "N" ) {
		$("#frm_inp select[name=coupon]").val(maxFirstIdx);
		$("#frm_inp select[name=coupon]").change();
		//console.log('maxFirstIdx : ' + maxFirstIdx);
	}
	if ( maxDupIdx != "N" ) {
		$("#frm_inp select[name=dup_coupon]").val(maxDupIdx);
		$("#frm_inp select[name=dup_coupon]").change();
		//console.log('maxDupIdx : ' + maxDupIdx);
	}
	if ( maxFirstIdx=="N" && maxDupIdx=="N" ){
		if (app_card_only_yn=='Y'){
			//console.log("앱카드 전용 이면");
			$('#frm_inp select[name=iscmcd]').val(app_card_cd);
			getCardInsCheck(); // 할부선택
		}else if ($("#frm_inp input[name=rdo_paytype]:radio:checked").index()==0 && $('#frm_inp select[name=iscmcd] option:selected').index()!=0){ // 결제 수단 중 카드가 선택 되어있으면
			//console.log("최대 할인 카드 선택 이면");
			getCardInsCheck(); // 할부선택
		}
	}

	// 20160108 박형윤 임직원할인일 경우 LPOINT 임시 감춤처리
	if (maxFirstIdx == 0) {
		$(".order_tp #lottepointSave .lottepointOrange").hide();
	}

	// 임직원할인이 아니고, 일시불할인 가능할 때
//		if( $("#frm_inp input[name=third_coupon]:radio").length > 0
//				&& $("#frm_send input[name=prommdclcd]").val() != "27" ){
//			$("#frm_inp input[name=third_coupon]:radio:first").prop("checked", true);
//			$("#frm_inp input[name=third_coupon]:radio:first").click();
//		}
}


$(window).load(function(){
	
	paytype	= $("#frm_send input[name=paytype]:hidden").val();
	
	if(PAYTYPE_CODE_LPAY == paytype){
		/* L.pay WEB :사용자 인증 */
		lpayCertInfo();
	}else{
		//바로 결제 모듈 띄우기
		send();
	}
});


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


/** L.pay WEB :사용자 인증 **/
function lpayCertInfo(){
	selPayType(4);
	
	$("#frm_lpay input[name=req_div]:hidden").val("card_req");
	$("#frm_lpay input[name=card_search_type]:hidden").val("info");
	
	$("#frm_lpay").submit();
}


/** L.pay WEB :결제 요청 **/
function lpayPaymentReq(){
	selPayType(4);
	
	$("#frm_lpay input[name=req_div]:hidden").val("pay_req");
	$("#frm_lpay input[name=card_search_type]:hidden").val("");
	
	$("#frm_lpay").submit();
}


//L.pay WEB : iframe 설정
function fn_LpayIframeSet(){
	payment_pop_position(); // 결제 레이어팝업 위치 지정
	$("#ANSIM_LAYER").css("width"	,"100%");
	$("#ANSIM_LAYER").css("height"	,"550px");
	window.scrollTo(0, 0); // 안심레이어 위치 지정
	$("#ANSIM_LAYER").show();
	$("#X_ANSIM_FRAME").show();
}

//결제처리 오류시 퍼블 콜백함수 요청 
function fn_talkOrderFail(){
	try{
		parent.talkOrderCallBack("9999","결제중단","");
	}catch(e){
		alert("P0001");
		return;
	}	
}

function getPage() {
	return document.frm_send.pageName.value;
}
