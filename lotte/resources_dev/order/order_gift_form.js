(function (window, angular, undefined) {
	//'use strict';
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte', 
		'lotteCommFooter'
	]);
	app.controller('OrderGiftCtrl', ['$scope', '$filter', '$sce', '$http', '$window', '$log', 'LotteCommon', 'LotteUtil', 'LotteCookie',
		function ($scope, $filter, $sce, $http, $window, $log, LotteCommon, LotteUtil, LotteCookie) {
			$scope.showWrap = true;
			$scope.contVisible = true;
			$scope.subTitle = orderSubTitle; /*서브헤더 타이틀*/
			$scope.actionBar = true; /*액션바*/
			$scope.isShowThisSns = false; /*공유버튼*/

			// iOS12에서 기존 주문번호 삭제가 안되는 현상 방어코딩 추가 2018.09.17 박형윤
			console.log("페이지 인입 주문번호 초기화");
			var del_date = new Date(0);
			document.cookie = 'ORD_NO=; path=/; domain=lotte.com; expires=' + del_date + ';';
		}
	]);


})(window, window.angular);

function sendTclick(t) {

	if (!isEllotte) {
		t = ("m_DC_" + t);
	} else {
		t = ("m_EL_" + t);
	}

	var setTime = 1000;
	//console.log("tclick(non-ang) : " + t);
	$("#tclick_iframe").remove();
	setTimeout(function () {
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

// 주문자명 수정
// @param mode mod:수정 | cnfm:완료 | back:취소
// @param deli_cnt 상품별 배송지 순번
// @param suffix 새배송지 여부 접미사
// @return void
function changeName(mode, deli_cnt, suffix) {
	var $spanWrap = $("#orderer_name_text_" + deli_cnt + suffix);
	var $inptWrap = $("#orderer_name_val_" + deli_cnt + suffix);
	var $span = $spanWrap.find("#nameSp");
	var $inpt = $inptWrap.find("#nameInpt");

	if (mode == "mod") {
		var nameText = $span.text();
		$inpt.val(nameText);
		$spanWrap.hide();
		$inptWrap.show();
	} else if (mode == "cnfm") {
		var nameVal = $inpt.val();
		if ($.trim(nameVal) == "") {
			nameVal = $span.text();
		}
		// 모든 배송지의 주문자명 일괄저장
		$("[id^='orderer_name_text']").show().find("#nameSp").text(nameVal);
		$("[id^='orderer_name_val']").hide().find("#nameInpt").val(nameVal);
	}
}


//선택한 상품수량,배송지수,배송비총액 임시셋팅
function setTotalDeliSelInfo() {
	var totOrdCnt = $("#goodsTotQty").val() * 1; //주문상품 총수량
	var dlex_one_goods = $("input[name=dlex_one_goods]").val(); //1개기준 배송비
	var dlex_std_amt = $("input[name=dlex_std_amt]").val(); //배송비 기준금액
	var selCnt = 0; //선택한 상품수량 
	var totSelCnt = 0; //선택한 상품수량 총계
	var realSalePrcOne = ""; //상품판매가
	var deli_tab = $("#sel_deli_tab").val(); // 받는분입력 선택된값: 휴대폰/주소/혼합
	var dlvp_cnt = 0; //배송비 발생건수
	var tot_dlex_amt = 0; //총배송비 
	var deli_cnt = 0; //선택된 배송지수
	var deli_cnt_no = 0; //휴대폰/주소 선택되지 않은 건

	// 배송비 조회할 상품정보
	$("input[name=bene_deli_data_1]:hidden").each(function () {
		var chk_data = ($(this).val()).split('|');
		realSalePrcOne += (chk_data[2]);
	});

	//휴대폰번호로 주문하기
	if (deli_tab == '0') {

		$("#dlvp_info li").each(function (index) {
			//수신자별 선택수량
			selCnt = $(this).children().find('select[name=ord_qty]').val() * 1;
			totSelCnt += selCnt;

			deli_cnt++;

			//배송지수 및 배송비
			if (Number(dlex_one_goods) == 0) { //무료배송
				dlvp_cnt = 0;
				tot_dlex_amt = 0;
			} else {
				if (Number(dlex_std_amt) > (Number(realSalePrcOne) * Number(selCnt))) { //배송비 발생
					dlvp_cnt += 1;
					tot_dlex_amt += Number(dlex_one_goods);
				}
			}
		});
		//주소로 주문하기
	} else if (deli_tab == '1') {

		//대량주문 경우 
		if (totOrdCnt > 10) {
			totSelCnt = totOrdCnt;
			deli_cnt = totOrdCnt;
			dlvp_cnt = totOrdCnt;
			deli_cnt_no = 0;
			tot_dlex_amt = Number(dlex_one_goods) * totOrdCnt;

			//대량주문 아닐경우
		} else {
			if (totOrdCnt == 1) {
				deli_cnt = 1;
			} else {
				deli_cnt = $("#rcv_qty_1").val();
			}

			for (var k = 1; k <= deli_cnt; k++) {

				//내배송지
				if ($("#deli_" + k + "_1").hasClass('on')) {
					selCnt = $("#deli_" + k + "_1 select[name=ord_qty]").val() * 1;
				}
				//새배송지
				else {
					selCnt = $("#deli_" + k + "_1 select[name=ord_qty]").val() * 1;
				}
				totSelCnt += selCnt;

				//배송지수 및 배송비
				if (Number(dlex_one_goods) == 0) { //무료배송
					dlvp_cnt = 0;
					tot_dlex_amt = 0;
				} else {
					if (Number(dlex_std_amt) > (Number(realSalePrcOne) * Number(selCnt))) { //배송비 발생
						dlvp_cnt += 1;
						tot_dlex_amt += Number(dlex_one_goods);
					}
				}
			}
		}
		//휴대폰번호+주소
	} else {
		deli_cnt = $("#rcv_qty_2").val();
		for (var k = 1; k <= deli_cnt; k++) {

			//라디오버튼 선택여부
			//if( $("#gift_type_"+k+"_1").prop("checked") == true || $("#gift_type_"+k+"_2").prop("checked") == true  ) {
			if ($("#deli_" + k + "_2_t").is(':visible') == true || $("#deli_" + k + "_2_d").is(':visible') == true) {

				//휴대폰번호 선택
				if ($("#deli_" + k + "_2_t").is(':visible') == true) {

					selCnt = $("#deli_" + k + "_2_t select[name=ord_qty]").val() * 1;
					//주소 선택	
				} else {
					//내배송지
					if ($("#deli_" + k + "_2_d").hasClass('on')) {
						selCnt = $("#deli_" + k + "_2_d select[name=ord_qty]").val() * 1;
					}
					//새배송지
					else {
						selCnt = $("#deli_" + k + "_2_d select[name=ord_qty]").val() * 1;
					}
				}
				totSelCnt += selCnt;

				//배송지수 및 배송비
				if (Number(dlex_one_goods) == 0) { //무료배송
					dlvp_cnt = 0;
					tot_dlex_amt = 0;
				} else {
					if (Number(dlex_std_amt) > (Number(realSalePrcOne) * Number(selCnt))) { //배송비 발생
						dlvp_cnt += 1;
						tot_dlex_amt += Number(dlex_one_goods);
					}
				}
			} else {
				deli_cnt_no += 1
			}
		}
	}

	//히든값으로 셋팅
	$("#tot_ord_goods_cnt").val(totSelCnt);
	$("#tot_ord_deli_cnt").val(deli_cnt);
	$("#tot_ord_dlvp_cnt").val(dlvp_cnt);
	$("#tot_ord_deli_no").val(deli_cnt_no);
	$("#tot_ord_deli_amt").val(tot_dlex_amt);
}

// 주소검색: <br/> 
//  2. 주소 검색 결과에서 주소 선택 시 처리 (proc_div='S'일 때) <br/>
//  4. 지번->도로명 or 도로명->지번 변환결과 설정 (proc_div='M'일 때)
// @param deli_cnt 상품별 배송지 순번
// @param proc_div S:조회 | M:변환
// @param addr_gbn J:지번 | N:도로명
// @param post_no 지번 우편번호
// @param post_addr 지번 우편주소
// @param dtl_addr 지번 상세주소
// @param bldg_nm 도로명 건물명
// @return void
function selectAddress(deli_cnt, proc_div, addr_gbn, post_no, post_addr, dtl_addr, bldg_nm) {
	var mid = " #li_new";
	var deliTabStr = "_" + $("#sel_deli_tab").val() + " ";

	if ($("input[name=grockle_name]").length > 0) {
		// 비회원일때
		mid = "";
	}

	// 주문시 전송되는 지번 주소
	var $inpZip1 = $("#deli_" + deli_cnt + deliTabStr + mid + " input[name=inpzip1]");
	var $inpZip2 = $("#deli_" + deli_cnt + deliTabStr + mid + " input[name=inpzip2]");
	var $inpAddr1 = $("#deli_" + deli_cnt + deliTabStr + mid + " input[name=inpaddr1]");
	var $inpAddr2 = $("#deli_" + deli_cnt + deliTabStr + mid + " input[name=inpaddr2]");

	// 주문시 전송되는 도로명 주소
	var $stnmInpZip1 = $("#deli_" + deli_cnt + deliTabStr + mid + " input[name=stnm_inp_zip1]");
	var $stnmInpZip2 = $("#deli_" + deli_cnt + deliTabStr + mid + " input[name=stnm_inp_zip2]");
	var $stnmInpAddr1 = $("#deli_" + deli_cnt + deliTabStr + mid + " input[name=stnm_inp_addr1]");
	var $stnmInpAddr2 = $("#deli_" + deli_cnt + deliTabStr + mid + " input[name=stnm_inp_addr2]");

	// 화면에 표시되는 주소
	var $txtZip1 = $("#deli_" + deli_cnt + deliTabStr + "#txt_zip1_" + deli_cnt);
	var $txtZip2 = $("#deli_" + deli_cnt + deliTabStr + "#txt_zip2_" + deli_cnt);
	var $txtZipTot = $("#deli_" + deli_cnt + deliTabStr + "#txt_zip_tot_" + deli_cnt);
	var $txtAddr1 = $("#deli_" + deli_cnt + deliTabStr + "#txt_addr1_" + deli_cnt);
	var $txtAddr2 = $("#deli_" + deli_cnt + deliTabStr + "#txt_addr2_" + deli_cnt);

	// 임시저장 폼
	var $tempZip1 = $("#deli_" + deli_cnt + deliTabStr + "#temp_zip1_" + deli_cnt);
	var $tempZip2 = $("#deli_" + deli_cnt + deliTabStr + "#temp_zip2_" + deli_cnt);
	var $tempAddr1 = $("#deli_" + deli_cnt + deliTabStr + "#temp_addr1_" + deli_cnt);
	var $tempAddr2 = $("#deli_" + deli_cnt + deliTabStr + "#temp_addr2_" + deli_cnt);
	//var $tempBldg = $("#temp_bldg_" + deli_cnt);

	if (proc_div == "S" && addr_gbn == "J") { // 지번 주소 검색일 때
		// addrHtml = 우편번호\n우편주소+상세주소
		var addrHtml = "<br/>" + post_addr;
		$("#txt_seq2_J_" + deli_cnt).html(addrHtml);

		// 선택한 주소의 실제 값은 hidden에 할당
		$tempZip1.val(post_no.substring(0, 3));
		$tempZip2.val(post_no.substring(3, 6));
		$tempAddr1.val(post_addr);

		$("#deli_" + deli_cnt + deliTabStr + "#seq1_J_" + deli_cnt).hide();
		$("#deli_" + deli_cnt + deliTabStr + "#seq2_J_" + deli_cnt).show();
		$("#deli_" + deli_cnt + deliTabStr + "#inp_seq2_J_" + deli_cnt).val(dtl_addr).focus(); // 상세주소 입력란에 포커싱
	} else if (proc_div == "S" && addr_gbn == "N") { // 도로명 주소 검색

		$tempZip1.val(post_no.substring(0, 3));
		$tempZip2.val(post_no.substring(3, 6));
		$tempAddr1.val(post_addr);
		if (bldg_nm.length > 0) { // 건물명이 있을 경우 상세주소에 포함
			dtl_addr += " " + bldg_nm;
		}
		$tempAddr2.val(dtl_addr);

		// 화면에 표시
		var addrHtml = "<br/>" + post_addr + " " + dtl_addr;
		$("#deli_" + deli_cnt + deliTabStr + "#txt_seq2_N_" + deli_cnt).html(addrHtml);

		$("#deli_" + deli_cnt + deliTabStr + "#seq1_N_" + deli_cnt).hide();
		$("#deli_" + deli_cnt + deliTabStr + "#seq2_N_" + deli_cnt).show();
		$("#deli_" + deli_cnt + deliTabStr + "#inp_seq2_N_" + deli_cnt).focus(); // 상세주소 입력란에 포커싱
	} else if (proc_div == "M" && addr_gbn == "J") { // 지번 -> 도로명
		$tempZip1.val(post_no.substring(0, 3));
		$tempZip2.val(post_no.substring(3, 6));
		// 지번주소 설정
		$inpZip1.val($tempZip1.val());
		$inpZip2.val($tempZip2.val());
		$inpAddr1.val($tempAddr1.val());
		$inpAddr2.val($tempAddr2.val());

		// 도로명주소 설정
		$txtZip1.add($stnmInpZip1).val(post_no.substring(0, 3));
		$txtZip2.add($stnmInpZip2).val(post_no.substring(3, 6));
		$txtZipTot.val($txtZip1.val() + $txtZip2.val());
		$txtAddr1.add($stnmInpAddr1).val(post_addr);
		$txtAddr2.add($stnmInpAddr2).val(dtl_addr);

	} else if (proc_div == "M" && addr_gbn == "N") { // 도로명 -> 지번
		$tempZip1.val(post_no.substring(0, 3));
		$tempZip2.val(post_no.substring(3, 6));
		// 도로명주소 설정
		$stnmInpZip1.val($tempZip1.val());
		$stnmInpZip2.val($tempZip2.val());
		$stnmInpAddr1.val($tempAddr1.val());
		$stnmInpAddr2.val($tempAddr2.val());

		// 지번주소 설정
		$txtZip1.add($inpZip1).val(post_no.substring(0, 3));
		$txtZip2.add($inpZip2).val(post_no.substring(3, 6));
		$txtZipTot.val($txtZip1.val() + $txtZip2.val());
		$txtAddr1.add($inpAddr1).val(post_addr);
		$txtAddr2.add($inpAddr2).val(dtl_addr);

	} else if (proc_div == "M" && addr_gbn == "J_alone") { // 지번 하나만 사용되는 경우

		$tempZip1.val(post_no.substring(0, 3));
		$tempZip2.val(post_no.substring(3, 6));
		// 화면표시값과 지번주소 설정
		$txtZip1.add($inpZip1).val($tempZip1.val());
		$txtZip2.add($inpZip2).val($tempZip2.val());
		$txtZipTot.val($txtZip1.val() + $txtZip2.val());
		$txtAddr1.add($inpAddr1).val($tempAddr1.val());
		$txtAddr2.add($inpAddr2).val($tempAddr2.val());

		// 도로명주소 히든폼 초기화
		$stnmInpZip1.add($stnmInpZip2).add($stnmInpAddr1).add($stnmInpAddr2).val("");

	} else if (proc_div == "M" && addr_gbn == "N_select") { // 도로명 -> 지번 변환 후 도로명을 선택한 경우
		$tempZip1.val(post_no.substring(0, 3));
		$tempZip2.val(post_no.substring(3, 6));
		// 도로명주소 설정
		$txtZip1.add($stnmInpZip1).val($tempZip1.val());
		$txtZip2.add($stnmInpZip2).val($tempZip2.val());
		$txtZipTot.val($txtZip1.val() + $txtZip2.val());
		$txtAddr1.add($stnmInpAddr1).val($tempAddr1.val());
		$txtAddr2.add($stnmInpAddr2).val($tempAddr2.val());

		// 지번주소 설정
		$inpZip1.val(post_no.substring(0, 3));
		$inpZip2.val(post_no.substring(3, 6));
		$inpAddr1.val(post_addr);
		$inpAddr2.val(dtl_addr);
	}

	if (proc_div == "M") {
		// 주소 변환일 경우 검색 레이어 닫기
		$("#deli_" + deli_cnt + deliTabStr + "#search_addr_trigger_" + deli_cnt).click()
		$("#deli_" + deli_cnt + deliTabStr + '#txt_addr_wrap_' + deli_cnt).show();
	}
}

// 주소검색: <br/>
//  1. 지번/도로명 주소 검색 (proc_div='S'일 때) <br/>
//  3. 지번->도로명 or 도로명->지번 변환 (proc_div='M'일 때)
// @param deli_cnt 상품별 배송지 순번
// @param proc_div S:조회 | M:변환
// @param addr_gbn J:지번 | N:도로명
// @param commonParam
// @return boolean
function searchAddress(deli_cnt, proc_div, addr_gbn, commonParam) {
	var reqData = "proc_div=" + proc_div + "&addr_gbn=" + addr_gbn + "&deli_cnt=" + deli_cnt;
	var layerId = "";
	var callBack = null;
	var deliTab = $("#sel_deli_tab").val();
	var cntTabId = "#deli_" + deli_cnt + "_" + deliTab + " ";

	if (proc_div == "S" && addr_gbn == "J") { // 지번 주소 조회
		var $dongName = $(cntTabId + "#inp_seq1_J_" + deli_cnt);
		if ($.trim($dongName.val()).length <= 0) { // validation
			alert("읍/면/동을 입력해 주세요.");
			$dongName.focus();
			return false;
		}

		reqData += "&dong_nm=" + $dongName.val();
		callBack = function (resp) {
			$(cntTabId + "#result_seq1_J_" + deli_cnt).html(resp).show();
		};

	} else if (proc_div == "S" && addr_gbn == "N") { // 도로명 주소 조회
		var $key1 = $(cntTabId + "#key1_seq1_N_" + deli_cnt);
		var $key2 = $(cntTabId + "#key2_seq1_N_" + deli_cnt);
		var $key3 = $(cntTabId + "#key3_seq1_N_" + deli_cnt);
		var $key4 = $(cntTabId + "#key4_seq1_N_" + deli_cnt);
		var $key5 = $(cntTabId + "#key5_seq1_N_" + deli_cnt);

		// validation start
		var invalid = false;
		$key1.add($key2).add($key3).each(function () {
			if ($.trim($(this).val()).length <= 0) {
				alert("조회 필수항목을 입력해 주세요.");
				$(this).focus();
				invalid = true;
				return false; // each break
			}
		});
		if (invalid) {
			return false; // function exit
		}
		// validation end

		reqData += "&keyword1=" + $key1.val() + "&keyword2=" + $key2.val() +
			"&keyword3=" + $key3.val();
		if ($key4.val() != "") {
			// 건물본번호가 입력되었을 때
			reqData += ("&keyword4=" + $key4.val());
		}
		if ($key5.val() != "") {
			// 건물명이 입력되었을 때
			reqData += ("&keyword5=" + $key5.val());
		}
		callBack = function (resp) {
			$(cntTabId + "#result_seq1_N_" + deli_cnt).html(resp).show();
		};
	} else if (proc_div == "M" && addr_gbn == "J") { // 지번 -> 도로명
		var $addr2 = $(cntTabId + "#inp_seq2_J_" + deli_cnt);
		if ($.trim($addr2.val()).length <= 0) { // validation
			alert("상세주소를 입력해 주세요.");
			$addr2.focus();
			return false; // function exit
		}
		var zipcode = $(cntTabId + "#temp_zip1_" + deli_cnt).val() + $(cntTabId + "#temp_zip2_" + deli_cnt).val();
		var addr1 = $(cntTabId + "#temp_addr1_" + deli_cnt).val();
		var addr2 = $addr2.val();
		reqData += "&zipcode=" + zipcode.replace("-", "") + "&addr1=" + addr1 +
			"&addr2=" + addr2;

		$(cntTabId + "#temp_addr2_" + deli_cnt).val(addr2); // 임시폼 설정(상세주소)

		callBack = function (resp) {
			$(cntTabId + "#seq2_J_" + deli_cnt).hide();
			$(cntTabId + "#seq3_J_" + deli_cnt).html(resp).show();
		};
	} else if (proc_div == "M" && addr_gbn == "N") { // 도로명 -> 지번
		var $addr2 = $(cntTabId + "#inp_seq2_N_" + deli_cnt);
		var zipcode = $(cntTabId + "#temp_zip1_" + deli_cnt).val() + $(cntTabId + "#temp_zip2_" + deli_cnt).val();
		var addr1 = $(cntTabId + "#temp_addr1_" + deli_cnt).val();
		var addr2 = $(cntTabId + "#temp_addr2_" + deli_cnt).val() + " " + $addr2.val();
		reqData += "&zipcode=" + zipcode.replace("-", "") + "&addr1=" + addr1 +
			"&addr2=" + addr2;

		$("#temp_addr2_" + deli_cnt).val(addr2); // 임시폼 설정(상세주소)

		callBack = function (resp) {
			$(cntTabId + "#seq2_N_" + deli_cnt).hide();
			$(cntTabId + "#seq3_N_" + deli_cnt).html(resp).show();
		};
	}

	$.ajax({
		type: "post",
		async: false,
		url: "/popup/ord_search_address.do?" + commonParam,
		data: reqData,
		success: function (resp) {
			callBack(resp);
			return true;
		}
	});
}

// 배송지정보 옵션 컨트롤.
// @param mode mine:내배송지 | new:새로운배송지
// @param deli_cnt 상품별 배송지 순번
// @param dlvpSn 내배송지 순번(값이 없을경우 새로운 배송지)
// @param deli_tab 주소로선물하기 1, 휴대폰번호 또는 주소로 선물하기 2
// @return void
function switchDeliOption(mode, deli_cnt, dlvpSn, deli_tab) {
	var $rdioBtnU = $("#deli_" + deli_cnt + " input[name=deli_chk_" + deli_cnt + "]:radio[value='U']");
	var $rdioBtnC = $("#deli_" + deli_cnt + " input[name=deli_chk_" + deli_cnt + "]:radio[value='C']");

	// 기존배송지추가, 신규배송지 여부인데... 선물하기는 무조건 신규배송지로 입력됨.. 
	if (mode == "mine") {
		$rdioBtnC.prop("checked", false);
		if ($("#deli_phone_text_" + deli_cnt + "_" + dlvpSn).is(":hidden")) {
			// 수정버튼(배송지 > 연락처의 우측버튼)이 클릭되어 해당 영역이 숨겨진 상태일 때				
			$rdioBtnU.prop("checked", true);
		} else {
			$rdioBtnU.prop("checked", false);
		}
	} else if (mode == "new") {

	}
}

// 금액 변경 적용 시 중복 <br> 태그 함수 처리
function apply_br_tag(str) {
	if (str != "") {
		//str += "<br/>";
	}
	return str;
}

function confirm_end() {
	$("#useLottePoint").hide();
	$("#chk_lt_point").attr("disabled", false);
	//$("#chk_lt_point").prop("checked", true);
	//fn_selPoint($("#chk_lt_point"));
	ltPointCert = "Y";
	$("#lt_point_amt").show();
	$("#lt_point_amt_btn").hide();
	//20160218
	if (!$("#chk_lt_point").is(":checked")) {
		$("#chk_lt_point").trigger("click");
	}
}

// 할부선택 radio 버튼의 활성화에 대해 UI를 구현한다.
// 카드선택 후 할부개월이 존재할 경우 개월수를 선택할 수 있다.
function init_cardinstmon() {

	totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val(); // 실제 총결제금액

	iscmcd = $("#frm_inp select[name=iscmcd]").val();
	prom_third = $("#frm_send input[name=prommdclcd_third]").val();

	$("#frm_inp input[name=rdo_cardinst]:radio").attr("checked", "");
	$("#frm_inp input[name=rdo_cardinst]:radio").prop("checked", "");

	$("#frm_inp select[name=cardinstmon]").empty();
	$("#frm_inp select[name=cardinstmon]").append("<option value=''>일시불</option>");
	$("#frm_inp select[name=cardinstmon]").attr('disabled', true);

	if (iscmcd != '') {

		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('disabled', false);
		// 무이자 할부 
		onintmonth = $("#frm_inp input[name=onintmonth]:hidden").val();
		if (onintmonth == "" || onintmonth == "null" || prom_third == "35") {
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(1)").attr('disabled', true);
		} else {
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(1)").attr('disabled', false);
		}

		// 일반할부 개월수
		intmonth = $("#frm_inp input[name=intmonth]:hidden").val();
		if (intmonth == "" || intmonth == "null" || prom_third == "35") {
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(2)").attr('disabled', true);
		} else {
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(2)").attr('disabled', false);
		}

		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('checked', true);
		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop('checked', true);
		if (parseInt(totsttlamt) < 50000) {
			// 5만원 미만일 경우 일시불만 가능
			$("#frm_inp select[name=cardinstmon] option:first").prop('selected', true);
			$("#frm_inp select[name=cardinstmon]").prop('disabled', true); // 비활성 처리
			return;
		}

		//L.pay 등록카드가 신용카드가 아닐경우 일시불만 가능
		lpayCardDivCd = $("select[name=iscmcd]").find("option:selected").attr("data-card-div");
		if (lpayCardDivCd != undefined && lpayCardDivCd != "CC") {
			$("#frm_inp select[name=cardinstmon] option:first").prop('selected', true);
			$("#frm_inp select[name=cardinstmon]").prop('disabled', true); // 비활성 처리
			return;
		}
	} else {
		// 비활성 처리
		$("#frm_inp input[name=rdo_cardinst]:radio").attr('disabled', true);
		$("#frm_inp select[name=cardinstmon]").attr('disabled', true);
	}
	setcardinstmon();
}

function init_cardselect() {
	cardkndcd = $("#frm_send input[name=cardkndcd]").val(); // 할인쿠폰 카드코드
	cardkndcd_dup = $("#frm_send input[name=cardkndcd_dup]").val(); // 중복 카드 할인쿠폰 카드코드
	paytype = $("#frm_inp input[name=paytype]:hidden").val();

	var payTypeCard = $('#pay_type1').hasClass('disable');
	var payTypeBank = $('#pay_type2').hasClass('disable');
	var payTypeLpay = $('#pay_type4').hasClass('disable');

	if (cardkndcd != null && cardkndcd != '') {
		if (paytype == PAYTYPE_CODE_BANK || paytype == PAYTYPE_CODE_NAVERPAY || paytype == PAYTYPE_CODE_PHONE) {
			if (!payTypeCard) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").click();

				$("#frm_inp select[name=iscmcd]").val(cardkndcd);
				if ($("#frm_inp select[name=iscmcd]").val() == null) {
					$("#frm_inp select[name=iscmcd]").val('');
				}
			} else if (!payTypeBank) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").click();
			} else if (!payTypeLpay) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").click();
			}
		} else {
			$("#frm_inp select[name=iscmcd]").val(cardkndcd);
			if ($("#frm_inp select[name=iscmcd]").val() == null) {
				$("#frm_inp select[name=iscmcd]").val('');
			}
		}
	} else if (cardkndcd_dup != null && cardkndcd_dup != '') {
		if (paytype == PAYTYPE_CODE_BANK || paytype == PAYTYPE_CODE_NAVERPAY || paytype == PAYTYPE_CODE_PHONE) {
			if (!payTypeCard) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").click();
				$("#frm_inp select[name=iscmcd]").val(cardkndcd);
				if ($("#frm_inp select[name=iscmcd]").val() == null) {
					$("#frm_inp select[name=iscmcd]").val('');
				}
			} else if (!payTypeBank) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").click();
			} else if (!payTypeLpay) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").click();
			}
		} else {
			$("#frm_inp select[name=iscmcd]").val(cardkndcd_dup);
			if ($("#frm_inp select[name=iscmcd]").val() == null) {
				$("#frm_inp select[name=iscmcd]").val('');
			}
		}
	} else {
		$("#frm_inp select[name=iscmcd]").find('option').attr('selected', false).eq(0).attr('selected', true);
		$("#frm_inp select[name=iscmcd]").find('option').prop('selected', false).eq(0).prop('selected', true);

		$("#frm_inp input[name=onintmonth]:hidden").val('');
		$("#frm_inp input[name=intmonth]:hidden").val('');
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
function init_cpn_info(cpn, dup_cpn, third_cpn) {
	// 1차쿠폰 정보 초기화
	if (cpn == "Y") {
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
	if (dup_cpn == "Y") {
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
	if (third_cpn == "Y") {
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
	}
}

function setcardinstmon() {

	$("#frm_inp select[name=cardinstmon]").empty();
	$("#frm_inp select[name=cardinstmon]").append("<option value=''>일시불</option>");
	cardinstmonlist = $("#frm_inp input[name=onintmonth]:hidden").val().split(',');
	if (cardinstmonlist.length > 0) {
		for (i = 0; i < cardinstmonlist.length; i++) {
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
	if (cardinstmonlist.length > 0) {
		for (i = 0; i < cardinstmonlist.length; i++) {
			if (cardinstmonlist[i] == "null" || cardinstmonlist[i] == "") {
				continue;
			}

			text = cardinstmonlist[i] + "개월";
			$("#frm_inp select[name=cardinstmon]").append(
				"<option value='" + cardinstmonlist[i] + "'>(유) " + text + "</option>");
		}
		//$("#frm_inp select[name=cardinstmon]").attr('disabled' , false);
	}

	if ($("#frm_inp select[name=cardinstmon] option").length > 1 && $("#frm_send input[name=prommdclcd_third]").val() != "35") {
		$("#frm_inp select[name=cardinstmon]").attr('disabled', false);
	} else {
		$("#frm_inp select[name=cardinstmon]").attr('disabled', true);
	}

}

// s:2015.01.13아시아나 제휴몰 마일리지 적립 icjung
//정보제공 동의
function chkboxMAsianaAgree() {

	if (document.getElementById('info_agree_check').checked) {
		if (document.getElementById('ip_asianaNo').value.length == 0) {
			alert('회원번호가 올바르지 않습니다. 확인후 입력해 주시기 바랍니다.');
			return;
		} else if (document.getElementById('ip_asianaNo').value.length <= 0) {
			alert('아시아나클럽 회원번호를 9자리의 숫자로 입력해 주세요');
			return;
		} else if (isNaN(document.getElementById('ip_asianaNo').value)) {
			alert('아시아나클럽 회원번호는 숫자로만 입력하셔야 합니다.');
			return;
		}

		if (AsianaSavingMall.checkForAsiana(document.getElementById('ip_asianaNo').value) == true) {
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

	if (ckObj_nm == 'grockle_info') {
		ckObj.attr('checked', $(obj).hasClass("checked"));
	} else if (ckObj_nm == 'grockle_same') {
		ckObj.trigger("click");
	} else {
		ckObj.trigger("click");
	}
}

//PG PROJECT : 결제 동의 영역 노출
function fn_setDisplayAssentArea(pg_display) {
	if ($(".box_agree_check.assent_all_wrap").length > 0) {
		if (pg_display == 'Y') {
			$(".box_agree_check").has("input[name=ord_agr_yn]:checkbox").hide();
			$(".box_agree_check.assent_all_wrap").show();
		} else {
			$(".box_agree_check").has("input[name=ord_agr_yn]:checkbox").show();
			$(".box_agree_check.assent_all_wrap").hide();
		}
	}
}

function selPayType(idx) {
	var id = '#pay_type' + idx;
	//$( 'span.pay_box' ).removeClass( 'on' );
	$("[id^='pay_type']").removeClass('on');
	$(id).addClass("on");

	setPaytype(idx);

	// PG PROJECT : 주문 동의 영역 노출 제어
	if ($("#pay_method").css("display") == "block" && (id == "#pay_type4" || id == "#pay_type1")) { // 주결제 수단 노출된 상태이고 L.pay, 신용카드 선택 된 경우
		fn_setDisplayAssentArea('Y');
	} else {
		fn_setDisplayAssentArea('N');
	}
}

function setPaytype(idx) {

	var payTypeArr = [
		[1, PAYTYPE_CODE_CARD],
		[2, PAYTYPE_CODE_BANK],
		[3, PAYTYPE_CODE_PHONE],
		[4, PAYTYPE_CODE_LPAY],
		[5, PAYTYPE_CODE_NAVERPAY]
	];

	for (var i = 0; i < payTypeArr.length; i++) {
		if (payTypeArr[i][0] == idx) {
			$("#frm_inp input[name=paytype]:hidden").val(payTypeArr[i][1]);
			break;
		}
	}
}

function fn_ordernomemberAgree(target) {
	if ($(target).closest('div.check_layer03').hasClass('on')) {
		$(target).closest('div.check_layer03').removeClass('on');
		$(target).closest('div.check').removeClass('on').addClass('off');
		$("#grockle_resident_div").hide();
	} else {
		$(target).closest('div.check_layer03').addClass('on');
		$(target).closest('div.check').removeClass('off').addClass('on');
		$("#grockle_resident_div").show();
	}
}

//입력글자제한 체크
function chkSendMsgLimit(textarea, limit, infodiv) {
	str = $("#" + textarea).val();
	strlen = str.length;

	var s = 0;
	for (var i = 0; i < strlen; i++) {
		//s += (str.charCodeAt(i) > 128) ? 2 : 1;
		s += 1;

		if (s > limit) {
			alert('최대 ' + limit + '자 까지 입력가능합니다.');

			//$("#"+textarea).val( str.cut(limit) );
			$("#" + textarea).val(str.substring(0, limit));
			$("#" + infodiv).html(limit);
			return false;
		}
	}
	$("#" + infodiv).html(s);
	return true;

}

// 배송메시지 입력 값 길이제한
// function.js 의 limitChars 와 동일하나, 메시지만 수정됨.
// 추후 비슷한 케이스 발생 시, 리팩토링 필요
function chkDeliMsgLimit(textarea, limit, infodiv) {
	str = $("#" + textarea).val();
	strlen = str.length;

	var s = 0;
	for (var i = 0; i < strlen; i++) {
		s += (str.charCodeAt(i) > 128) ? 2 : 1;

		if (s > limit) {
			alert('최대 ' + limit + 'byte까지 입력가능합니다.');

			$("#" + textarea).val(str.cut(limit));
			$("#" + infodiv).html(limit);
			return false;
		}
	}
	$("#" + infodiv).html(strlen);
	return true;
}

function fn_useLottePointCancel() {
	$("#useLottePoint").hide();
	$("#card_no1").val("");
	$("#card_no2").val("");
	$("#card_no3").val("");
	$("#card_no4").val("");
	$("#card_passwd").val("");

	$("#temp_lt_point_amt").val("");
	if ($("input[name=temp_paytype]:hidden").val() == 3) {
		if ($("#chk_lt_point").prop("checked") == true) {
			$("#chk_lt_point").trigger("click");
			$("#lt_point_amt").show();
			$("#lt_point_amt_btn").hide();
		}
	}
}

function select_third_coupon() {
	// 포인트 선택 부분
	init_point();
	// 쿠폰 변경 시 포인트 부분 초기화
	fn_initPointList("ALL");

	if ($("#frm_send input[name=prommdclcd_third]").val() == "35") { // 일시불인 경우
		// 휴대폰 소액 결제인 경우 || 네이버페이 인 경우
		if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == PAYTYPE_CODE_PHONE) {
			alert("일시불 할인을 받으시면 휴대폰결제를 하실수 없습니다.");
			setCashReceiptArea(); //현금영수증 영역 컨트롤
		} else if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == PAYTYPE_CODE_NAVERPAY) {
			alert("일시불 할인을 받으시면 네이버페이 결제를 하실수 없습니다.");
			setCashReceiptArea(); //현금영수증 영역 컨트롤
		}

		var payTypeCard = $('#pay_type1').hasClass('disable');
		var payTypeBank = $('#pay_type2').hasClass('disable');
		if (!payTypeCard) {
			$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").prop('checked', true);
			$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").click();
		} else if (!payTypeBank) {
			$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").prop('checked', true);
			$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").click();
		}

		// 삭제 (네이버페이 추가 하면서 삭제)
		/*
		// 결제수단 제어
		$("#frm_inp input[name=rdo_paytype]:radio").each(function() {
			if ($(this).val() == PAYTYPE_CODE_PHONE){
				$(this).prop("disabled" , true);
			} else if ($(this).val() == PAYTYPE_CODE_NAVERPAY){
				$(this).prop("disabled" , true);
			}
		});
		*/

		// 포인트 제어 (보관금만 사용가능)
		$("#chk_lpoint").prop("checked", false);
		//$("#chk_lpoint").prop("disabled", true);//L-money 비활성화 대신 얼럿으로 막기로 함
		$("#chk_lt_point").prop("checked", false);
		$("#chk_lt_point").prop("disabled", true);

	} else {
		if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == PAYTYPE_CODE_LPAY) {
			ltPointCert = "Y";
			$("#lt_point_amt").show();
			$("#lt_point_amt_btn").hide();
		}

		// 결제수단 제어
		$("#frm_inp input[name=rdo_paytype]:radio").each(function () {
			$(this).prop("disabled", false);
		});

		// 포인트 제어
		if (parseInt($("#useable_lpoint_amt").val()) > 0) {
			$("#chk_lpoint").prop("disabled", false);
		}
		if (ltPointCert == "Y") {
			$("#chk_lt_point").prop("disabled", false);
		}
		//			$("#chk_soil_point").prop("disabled", false);
	}

	// 결제 결제 정보 제어
	select_third_coupon_controll($("#frm_send input[name=prommdclcd_third]").val());

	// 쿠폰 및 포인트 사용에 대한 주문 금액 계산
	fn_calcTotalPrice();
	// 현금영수증 영역 컨트롤
	setCashReceiptArea();
}

// 주문서 내 사용 sessionStorage 삭제
function ord_session_clear() {
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

	if (maxDupIdx != dupcpn_idx) { // 최저가 체크 해제
		$("#max_dc").prop("checked", false);
	}

	$("#frm_inp select[name=dup_coupon]").find("option").each(function () {
		if (dupcpn_idx == $(this).val()) {

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
			$("span[name=dup_span]").each(function () {
				$(this).html("");
			});

			if (dupcpn_idx == "N") {
				// 2차 할인 쿠폰 정보 지우기
				init_cpn_info("N", "Y", "N");

				select_dup_coupon();
				return;
			}

			$(this).prop("disabled", false); // 활성화

			if (coupon_idx == undefined || coupon_idx == "N") { // 중복쿠폰
				tmp_arr = single_prom;
				tmp_arr_cnt = single_prom_cnt;
				sessionStorage.setItem("dup_cnt_div", "single"); // 중복쿠폰 단독/추가 구분 
			} else { // 1차쿠폰 + 중복쿠폰 사용
				tmp_arr = multi_prom;
				tmp_arr_cnt = multi_prom_cnt;
				first_cpn = (cpnpromno == "0" ? prommdclcd : cpnpromno);
				sessionStorage.setItem("dup_cnt_div", "multi"); // 중복쿠폰 단독/추가 구분 
			}

			if (tmp_arr_cnt > 0) {
				for (var i = 0; i < tmp_arr.length; i++) {
					if (tmp_arr[i][0] == first_cpn && tmp_arr[i][1] == cpnpromno_dup) {
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

				if (parseInt(v_cpn_crd_dc_amt) > 0) {

					if (dupcpn_idx != 'N') {
						promcartsn = $("#frm_inp input[name=promcartsn_dup]").eq(dupcpn_idx).val();
						prommdclcd = $("#frm_inp input[name=prommdclcd_dup]").eq(dupcpn_idx).val();
						fvrpolctpcd = $("#frm_inp input[name=fvrpolctpcd_dup]").eq(dupcpn_idx).val();
						totdcamt = sessionStorage.getItem("fvr_val"); // 쿠폰할인금액
						cpnpromno = $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();
						cpnrscmgmtsn = $("#frm_inp input[name=cpnrscmgmtsn_dup]").eq(dupcpn_idx).val();
						adtncostdtlsctnm = $("#frm_inp input[name=adtncostdtlsctnm_dup]").eq(dupcpn_idx).val();
						cardkndcd = $("#frm_inp input[name=cardkndcd_dup]").eq(dupcpn_idx).val();
						includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn_dup]").eq(dupcpn_idx).val();
					} else {
						promcartsn = "";
						prommdclcd = "";
						fvrpolctpcd = "";
						totdcamt = "";
						cpnpromno = "";
						cpnrscmgmtsn = "";
						adtncostdtlsctnm = "";
						cardkndcd = "";
						includeSaveInstCpn = "";
					}
					$("#frm_send input[name=promcartsn_dup]").val(promcartsn);
					$("#frm_send input[name=prommdclcd_dup]").val(prommdclcd);
					$("#frm_send input[name=fvrpolctpcd_dup]").val(fvrpolctpcd);
					$("#frm_send input[name=totdcamt_dup]").val(totdcamt);
					$("#frm_send input[name=cpnpromno_dup]").val(cpnpromno);
					$("#frm_send input[name=cpnrscmgmtsn_dup]").val(cpnrscmgmtsn);
					$("#frm_send input[name=adtncostdtlsctnm_dup]").val(adtncostdtlsctnm);
					$("#frm_send input[name=cardkndcd_dup]").val(cardkndcd);
					$("#frm_send input[name=includeSaveInstCpn_dup]").val(includeSaveInstCpn);

					$("span[name=dup_span]:eq(" + dupcpn_idx + ")").html("(" + "<strong>" + String(totdcamt).money() + "</strong> 원 할인)");

					select_dup_coupon();

					$("#dcAmt2").html("(-" + String(v_cpn_crd_dc_amt).money() + "<span class=\"no_bold\">원</span>)");
					return;
				} else {
					// 사용불가처리
					$(this).prop("disabled", true);

					if (!alert("죄송합니다.\n추가할인 불가능 상품입니다.")) {
						add_dis_impossible_flag = true;
						add_dis_impossible();
					} else {
						add_dis_impossible_flag = false;
						add_dis_impossible();
					}
				}
			} else {
				// 2차 할인 쿠폰 정보 지우기
				init_cpn_info("N", "Y", "N");
			}

		}
	});
	lPointChange(); // L.POINT 재계산 호출
}
var add_dis_impossible_flag = false;

//중복쿠폰 불가처리
function add_dis_impossible() {
	$("#frm_inp select[name=dup_coupon]").blur();

	$("#frm_inp select[name=dup_coupon]").val("N"); // 중복 쿠폰 사용안함으로 셋팅
	$("#frm_inp select[name=dup_coupon]")[0].selectedIndex = 0;
	//$("#frm_inp select[name=dup_coupon] option:first").prop('selected',true);
	// 2차 할인 쿠폰 정보 지우기
	init_cpn_info("N", "Y", "N");
	select_dup_coupon();
}

function select_coupon() {
	init_cardselect();
	getCardInsCheck();
	$("#frm_inp select[name=iscmcd]").change(); // 할인정보 재조회
	// 포인트 선택 부분
	init_point()
	// 쿠폰 변경 시 포인트 부분 초기화
	fn_initPointList("ALL");
	// 쿠폰 및 포인트 사용에 대한 주문 금액 계산
	fn_calcTotalPrice();
	setCashReceiptArea(); // 현금영수증 영역 컨트롤		
}

function select_dup_coupon() {
	init_cardselect();
	init_point(); // 포인트 선택 부분
	fn_initPointList("ALL"); // 쿠폰 변경 시 포인트 부분 초기화
	fn_calcTotalPrice(); // 쿠폰 및 포인트 사용에 대한 주문 금액 계산
	setCashReceiptArea(); // 현금영수증 영역 컨트롤
	getCardInsCheck(); // 카드 할부 개월 조회
}

// 할부월 및 할인구분 제어
function select_third_coupon_controll(prommdclcd) {
	if (prommdclcd == "35") { // 일시불인 경우	
		// 결제수단 카드의 할부구분 제어
		$("#frm_inp input[name=rdo_cardinst]:radio").each(function () {
			$(this).prop("disabled", true);
		});
		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop("disabled", false);
		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop("checked", true);

		// 결제수단 카드의 할부월 제어
		$("#frm_inp select[name=cardinstmon] option:first").prop("selected", true);
		$("#frm_inp select[name=cardinstmon]").prop("disabled", true);
	} else {
		// 결제수단 카드의 할부구분 제어
		$("#frm_inp input[name=rdo_cardinst]:radio").each(function () {
			$(this).prop("disabled", false);
		});
		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop("checked", true);

		// 결제수단 카드의 할부월 제어
		$("#frm_inp select[name=cardinstmon] option:first").prop("selected", true);
		$("#frm_inp select[name=cardinstmon]").prop("disabled", false);
	}
}

function fnClear(obj) {
	obj.style.background = '';
}

// 롯데카드 결제 (pay_type => EACS:안심클릭 only, ESPS:간편결제 only, ACS:안심클릭기본, SPS:간편결제기본)
function lottecard_payment(pay_type) {

	/*
	 * 2017.06.26 모바일/앱 체크 추가 , 롯데카드 앱설치 여부 ,롯데앱카드 설치 여부
	 * web은 롯데카드 앱설치여부 확인불가  ==> SPSW , ACSW , MAPC , ALP
	 * app이고 롯데카드 앱설치여부Y ==> SPSA , ACSA
	 * app이고 롯데카드 앱설치여부N ==> null , null
	 * app이고 롯데앱카드Y       ==> MAPC
	 * app이고 롯데앱카드N       ==> null  
	 * 페이서비스는 전부               ==> ALP
	 * 다른결재방식 선택 null값 보냄
	 */

	lotte_auth_type = pay_type; //전역변수 lotte_auth_type 에 값을 미리 설정한다

	if (pay_type == "SPSA" || pay_type == "ACSA" || pay_type == "MAPC") {
		//앱체크 함수 호출 로직 추가
		chkAppIsInstall(pay_type);
	} else {
		console.log("1137 lotte_auth_type==" + lotte_auth_type);
		//롯데카드 smpi 인증페이지 호출
		fn_simple_payform_submit(lotte_auth_type);
	}
}

//롯데카드 앱 설치여부 판단
function chkAppIsInstall(pay_type) {
	//app 에 스키마 정보 호출함. 리턴받는 함수:: rtnCardPaymentApp(appYn)
	if (pay_type == "MAPC") { //"앱카드APP"앱체크 
		if (cp_schema != "" && isAndroid) { //app일경우 && 안드로이드일경우
			window.myJs.appIsInstall("com.lcacApp");
		} else if (cp_schema != "" && isIOS) { //app일경우 && 아이폰일경우
			window.location = "appIsInstall://lotteappcard";
		} else {
			//롯데카드 smpi 인증페이지 호출
			fn_simple_payform_submit(lotte_auth_type);
		}
	} else { //"모바일결제APP"앱체크
		if (cp_schema != "" && isAndroid) { //app일경우 && 안드로이드일경우
			window.myJs.appIsInstall("com.lotte.lottesmartpay");
		} else if (cp_schema != "" && isIOS) { //app일경우 && 아이폰일경우
			window.location = "appIsInstall://lottesmartpay";
		} else {
			console.log("1568 lotte_auth_type==" + lotte_auth_type);
			//롯데카드 smpi 인증페이지 호출
			fn_simple_payform_submit(lotte_auth_type);
		}
	}

}

//롯데카드 앱 설치여부 판단 리턴함수
function rtnCardPaymentApp(appYn) {

	if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_CARD) {
		// 롯데카드 앱설치여부 값을 확인하여 appYn == 'Y' 이면 변경 없음. appYn == 'N' 이면 "null"값으로 호출
		if (appYn == 'N') {
			lotte_auth_type = "";
		}
		console.log("1201 lotte_auth_type==" + lotte_auth_type);
		//롯데카드 smpi 인증페이지 호출
		fn_simple_payform_submit(lotte_auth_type);
	}

}

//롯데카드 smpi 인증페이지 호출
function fn_simple_payform_submit(lotte_auth_type) {
	$("#ANSIM_LAYER").css("width", "100%");
	$("#ANSIM_LAYER").css("height", "530px");
	window.scrollTo(0, 0);
	$("#ANSIM_LAYER").show();
	$("#X_ANSIM_FRAME").show();
	$("#SIMPLEPAYFORM input[name=PAY]:hidden").val(lotte_auth_type);
	$("#SIMPLEPAYFORM").attr("target", "X_ANSIM_FRAME");
	$("#SIMPLEPAYFORM").attr("action", "/smpi/M_LCSMPIAgent01.jsp");
	$("#SIMPLEPAYFORM").submit();
}

// xmpi 실행
function xmpi_exec() {
	$("#frm_card").attr("target", "X_ANSIM_FRAME");
	$("#frm_card").attr("action", "/dacom/xansim/m_hagent01.jsp");
	$("#frm_card").submit();
}

// spay 실행 (KBApp Card)
function spay_exec() {
	$("#frm_spay input[name=totsttlamt]:hidden").val($("#frm_send input[name=totsttlamt]:hidden").val()); // 결제금액
	$("#frm_spay input[name=cardinst]:hidden").val($("#frm_send input[name=cardinst]:hidden").val()); // 할부구분
	$("#frm_spay input[name=cardinstmon]:hidden").val($("#frm_send input[name=cardinstmon]:hidden").val()); // 할부개월
	$("#frm_spay").attr("target", "X_ANSIM_FRAME");
	$("#frm_spay").attr("action", "/spay/shopMW.jsp");
	$("#frm_spay").submit();
}

// mobilians 실행
function cellphone_exec() {
	$("#frm_mobilians input[name=totsttlamt]:hidden").val($("#frm_send input[name=totsttlamt]:hidden").val());
	$("#frm_mobilians").attr("target", "X_ANSIM_FRAME");
	$("#frm_mobilians").attr("action", "/mobilians/mc_web.jsp");
	$("#frm_mobilians").submit();
}

// 카드사로 부터 인증 결과 수신시 호출되는 함수입니다.
function setCertResult(xid, eci, cavv, cardno, etc) {

	//안심클릭 창 닫아주자 
	$("#ANSIM_LAYER").hide();
	$("#X_ANSIM_FRAME").attr("src", "/dacom/xansim/iframe.jsp");
	$("#frm_send input[name=xid]:hidden").val(xid);
	$("#frm_send input[name=eci]:hidden").val(eci);
	$("#frm_send input[name=cavv]:hidden").val(cavv);
	$("#frm_send input[name=cardno]:hidden").val(cardno);

	doPayment(); // 쇼핑몰의 결제요청 함수로 변경하세요.
}

// 신한카드 카드사로 부터 제휴코드가 포함된 인증 결과 수신시 호출되는 함수입니다.
//--------------------------------
// 20085.08.01
// 신한카드의 요청으로 인증결과 정보에 제휴코드(join code)가 추가됨.
//---------------------------------
function setCertResult2(xid, eci, cavv, cardno, joincode) {
	$("#frm_send input[name=xid]:hidden").val(xid);
	$("#frm_send input[name=eci]:hidden").val(eci);
	$("#frm_send input[name=cavv]:hidden").val(cavv);
	$("#frm_send input[name=cardno]:hidden").val(cardno);
	$("#frm_send input[name=joincode]:hidden").val(joincode);
	doPayment(); // 쇼핑몰의 결제요청 함수로 변경하세요.
}

function disableItems(arg) {
	if (arg) {
		$("#cover").css("display", "block");
		$("#ORDER").hide();
		$("#PROCESSING").show();
		$("#cover").on('click', function () {
			close_iframe();
		});
	} else {
		$("#cover").css("display", "none");
		$("#ORDER").show();
		$("#PROCESSING").hide();
		$("#cover").off('click');
	}
}

function returnPaymentPage() {
	disableItems(false);
	$("#X_ANSIM_FRAME").attr("src", "/dacom/xansim/iframe.jsp");
}
// 결제창 닫기
function close_iframe() {
	returnPaymentPage();
	location.hash = "#PAYMENT_ANCHAR"; // 위치이동

	document.getElementById("X_ANSIM_FRAME").width = 450;
	document.getElementById("X_ANSIM_FRAME").height = 0;
	document.getElementById("ANSIM_LAYER").style.display = "none";
	document.getElementById("X_ANSIM_FRAME").style.display = "none";
}
// 카드사로 부터 인증 결과 수신시 호출되는 결제 요청 함수 샘플입니다.
function doPayment() {
	if ($("#frm_send input[name=totdcamt]:hidden").val() == "") {
		$("#frm_send input[name=totdcamt]:hidden").val('0')
	}
	//dimmedClose();
	$("#cover").css("display", "none");
	$("#ORDER").show();
	$("#PROCESSING").hide();

	$("#X_ANSIM_FRAME").attr("src", "/dacom/xansim/iframe.jsp");
	$("#frm_send").submit();
}

function ansimclose() {
	$("#ANSIM_LAYER").hide();
	$("#X_ANSIM_FRAME").attr("src", "/dacom/xansim/iframe.jsp");
	$("#ORDER").show();
	$("#PROCESSING").hide();
}

function getName() {
	var nm = $("#frm_inp input[name=inprmitnm]").val();
	nm = nm + " 님";
	$("#frm_inp input[name=receivename]").val(nm);
}

// 2011.05.20 포인트 전체 선택시 
function fn_selPointAll(obj) {
	var point = "";
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	var useable_amt = 0;
	var obj_id = obj.id;

	if (obj.checked) {
		if (parseInt(totsttlamt) == 0) // 결제금액이 없는데 모두 사용을 선택 할 경우
		{
			obj.checked = false;
			return;
		}
		if (obj_id == 'chk_lpoint_all') { // L_포인트
			totsttlamt = parseInt(totsttlamt) + parseInt($("#old_lpoint_amt").val());
			useable_amt = parseInt($("#useable_lpoint_amt").val());

			$("#lpoint_amt").val((totsttlamt < useable_amt ? totsttlamt : useable_amt));
		} else if (obj_id == 'chk_lt_point_all') {
			totsttlamt = parseInt(totsttlamt) + parseInt($("#old_lt_point_amt").val());
			useable_amt = parseInt($("#useable_lt_point_amt").val());

			$("#lt_point_amt").val((totsttlamt < useable_amt ? totsttlamt : useable_amt));
		} else if (obj_id == 'chk_deposit_all') {
			$("#cash_receipts").show(); // 현금영수증 영역 보이기

			totsttlamt = parseInt(totsttlamt) + parseInt($("#old_deposit_amt").val());
			useable_amt = parseInt($("#useable_deposit_amt").val());

			$("#deposit_amt").val((totsttlamt < useable_amt ? totsttlamt : useable_amt));
		}
		/*			else if (obj_id == 'chk_soil_point_all'){
						totsttlamt = parseInt(totsttlamt) + parseInt($("#old_soil_point_amt").val());
						useable_amt = parseInt($("#useable_soil_point_amt").val());

						$("#soil_point_amt").val((totsttlamt<useable_amt?totsttlamt:useable_amt));
					}*/
	} else {
		if (obj_id == 'chk_lpoint_all') { // L_포인트	
			$("#lpoint_amt").val("");
			$("#old_lpoint_amt").val("0");
		} else if (obj_id == 'chk_lt_point_all') { // 롯데포인트
			$("#lt_point_amt").val("");
			$("#old_lt_point_amt").val("0");
		} else if (obj_id == 'chk_deposit_all') { // 보관금
			$("#deposit_amt").val("");
			$("#old_deposit_amt").val("0");
		}
		/*			else if (obj_id == 'chk_soil_point_all'){// S-oil포인트
						$("#soil_point_amt").val("");
						$("#old_soil_point_amt").val("0");
					}*/
	}

	fn_calcTotalPrice();

	//20180704 포인트선택시 결제수단리셋
	init_cardselect();
	init_cardinstmon();
	// 보관금
	if (obj_id == 'chk_deposit_all') {
		setCashReceiptArea(); // 현금영수증 영역 컨트롤
	}
}

// 포인트 값 직접 등록 시
function fn_point_change(obj) {
	var obj_id = obj.id;
	var obj_val = obj.value;
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	var old_amt = $("#old_" + obj_id).val();
	var useable_amt = 0;

	obj_val = (obj_val == "" ? "0" : obj_val);
	totsttlamt = parseInt(totsttlamt) + parseInt(old_amt);

	if (obj_id == "lpoint_amt" && $("#chk_lpoint").prop("checked")) { // L_포인트
		useable_amt = parseInt($("#useable_lpoint_amt").val());
		$("#chk_lpoint_all").prop("checked", false);

	} else if (obj_id == "lt_point_amt" && $("#chk_lt_point").prop("checked")) { // 롯데포인트
		useable_amt = parseInt($("#useable_lt_point_amt").val());
		$("#chk_lt_point_all").prop("checked", false);

	}
	/*		else if (obj_id == "soil_point_amt" && $("#chk_soil_point").prop("checked")){ // S-oil포인트
				useable_amt = parseInt($("#useable_soil_point_amt").val());
				$("#chk_soil_point_all").prop("checked", false);

			}
	*/
	useable_amt = (totsttlamt < useable_amt ? totsttlamt : useable_amt);
	if (parseInt(obj_val) > useable_amt) {
		obj.value = (useable_amt == 0 ? 0 : Math.floor(useable_amt / 10) * 10);
	} else {
		obj.value = (obj_val == "0" ? "" : obj_val);
	}
	fn_calcTotalPrice();

	//20180704 포인트선택시 결제수단리셋
	init_cardselect();
	init_cardinstmon();

	var pay_type = "";

	if ($("#frm_inp input[name=rdo_paytype]:radio").length > 0) {
		pay_type = $("#frm_inp input[name=rdo_paytype]:radio:checked").val();
	} else {
		pay_type = $("#frm_inp input[name=paytype]:hidden").val();
	}
	//20180822 서울보증보험 노출여부 추가
	if (pay_type == PAYTYPE_CODE_BANK && Number(totpayamt) != 0) {
		fn_usafeAgree("2"); //서울보증보험 가입동의 노출
	} else {
		fn_usafeAgree("3"); //서울보증보험 가입동의 숨기기
	}
}

// 포인트 값 직접 등록 시
function fn_point_focus(obj) {
	obj.value = "";
	fn_point_change(obj);
}

// 2011.05.26 무료배송권 사용 함수
function fn_freeDlvpCpnUse() {
	var dlv_prom_use_yn = $("#dlv_prom_use_yn").val();
	var dlv_fvr_val = $("#dlv_fvr_val").val();
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	if (dlv_prom_use_yn == "N" && parseInt(dlv_fvr_val) > parseInt(totsttlamt)) {
		$("#dlv_prom_use_yn").val("N");
		$("#frm_inp input[name=free]").eq(1).prop('checked', true);
		alert("배송비할인 금액이 결제금액보다 클 수 없습니다.");
		return;
	}
	//받는분 2개 이상 시 무료배송쿠폰 적용 불가
	//$("#dlv_prom_use_yn").val($("#frm_inp input[name=free]:checked").val());
	fn_getDeliCnt();
	fn_calcTotalPrice();
}

// 2011.06.14 스마트페이 결제 완료 후
function setCertSmartpayResult(xid, eci, cavv, cardno, joinCode, hs_useamt_sh, restype, userkey, result, auth_type) {
	paramSmartpaySet(xid, eci, cavv, cardno, hs_useamt_sh, restype, userkey, result, auth_type);
}

//-->실제 승인페이지로 넘겨주는 form에 xid, eci, cavv, realPan를 세팅한다.
function paramSmartpaySet(xid, eci, cavv, realPan, hs_useamt_sh, restype, userkey, result, auth_type) {
	$("#frm_send input[name=xid]").val(xid);
	$("#frm_send input[name=eci]").val(eci);
	$("#frm_send input[name=cavv]").val(cavv);
	$("#frm_send input[name=cardno]").val(realPan);
	$("#frm_send input[name=restype]").val(restype);
	if (restype != '' && userkey != '' && userkey != $("#frm_send input[name=user_key]").val()) {
		$("#frm_send input[name=update_easn_yn]").val("Y");
	}
	$("#frm_send input[name=user_key]").val(userkey);
	$("#frm_send input[name=res_type]").val(restype);
	$("#frm_send input[name=req_type]").val(restype);
	$("#frm_send input[name=apvl_desc]").val(result);

	//결재수단이 롯데 카드인 경우만  '지금 결재수단 다음에도 사용'에 카드 유형 정보를 재설정 한다_20170626 추가
	console.log("1435 auth_type==" + auth_type + " ,, " + $("#frm_send input[name=acqr_cd]").val());
	if ($("#frm_send input[name=acqr_cd]").val() == paytype_card_047) {

		if (auth_type == "SPS" || auth_type == "SPSW") {
			$("#frm_send input[name=card_pay_meth_cd]").val("01"); /* 카드유형( 인터넷결제(간편) ) */
		} else if (auth_type == "SPSA") {
			$("#frm_send input[name=card_pay_meth_cd]").val("11"); /* 카드유형( 모바일결제 ) */
		} else if (auth_type == "ACS" || auth_type == "ACSW") {
			$("#frm_send input[name=card_pay_meth_cd]").val("02"); /* 카드유형( 인터넷결제(일반) ) */
		} else if (auth_type == "ACSA") {
			$("#frm_send input[name=card_pay_meth_cd]").val("22"); /* 카드유형( 모바일결제 ) */
		} else if (auth_type == "APC" || auth_type == "MAPC") {
			$("#frm_send input[name=card_pay_meth_cd]").val("03"); /* 카드유형( 앱카드 ) */
		} else if (auth_type == "ALP") {
			$("#frm_send input[name=card_pay_meth_cd]").val("04"); /* 카드유형( 페이서비스 ) */
		} else {
			$("#frm_send input[name=card_pay_meth_cd]").val(""); /* 만약 auth_type 없다면 null값 설정 */
		}
		console.log("1453 card_pay_meth_cd==" + $("#frm_send input[name=card_pay_meth_cd]").val());

	}
	//결재수단이 롯데 카드인 경우만  '지금 결재수단 다음에도 사용'에 카드 유형 정보를 재설정 한다_20170626 추가

	if (xid == "" && eci == "" && cavv == "" && realPan == "") {
		returnPaymentPage();
		$("#X_ANSIM_FRAME").css("width", "450px");
		$("#X_ANSIM_FRAME").css("height", "0px");
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
function misp_plugIn(iscmcd) {
	if (iscmcd == paytype_card_016 || iscmcd == paytype_card_026 || iscmcd == paytype_card_002 || iscmcd == paytype_card_054 || iscmcd == paytype_card_021) { // 국민카드, 비씨카드, 광주, 우체국
		$("#mISP_INFO").show();
	} else {
		$("#mISP_INFO").hide();
	}
}

//선물하기 2차, 받는사람 수 조회
function fn_getDeliCnt() {
	//var deliCnt = $("#dlvp_info li").length;
	//console.log("fn_getDeliCnt:"+deliCnt);
	var deliCnt = $("#tot_ord_deli_cnt").val();

	//중복쿠폰 무료배송권 설정
	if (deliCnt > 1) {
		// 무료배송권
		if ($("#frm_inp input[name=free]:radio").length > 0) {
			$("#dlv_prom_use_yn").val("N");
			$("#frm_inp input[name=free]:radio").eq(1).prop("checked", true);
			$("#frm_inp input[name=free]:radio").eq(0).prop("disabled", true);
		}
		// 중복쿠폰
		if ($.type($("#frm_inp select[name=dup_coupon]").val()) != "undefined") {
			$("#frm_inp select[name=dup_coupon]").val('N');
			$("#frm_inp select[name=dup_coupon]").prop('disabled', true);
		}
	} else {
		// 무료배송권
		if ($("#frm_inp input[name=free]:radio").length > 0) {
			$("#frm_inp input[name=free]:radio").prop("disabled", false);
			$("#dlv_prom_use_yn").val($("#frm_inp input[name=free]:checked").val());
		}
		// 중복쿠폰, 임직원할인 선택 안되었을 때
		if ($.type($("#frm_inp select[name=dup_coupon]").val()) != "undefined" &&
			$("#frm_send input[name=prommdclcd]").val() != "27") {
			$("#frm_inp select[name=dup_coupon]").prop('disabled', false);
		}
	}

	return deliCnt;
}

//선물하기 2차, 선물 주문/메시지 전송정보 체크 및 setting (수신자(배송지별))
function setDeliDataGift() {
	var areaNum = 1; // 배송지 수
	//var tmp_idx = 0;
	//var deliidx = 0;
	//var k = 1; // 배송지 값		
	var cart_sn = null;
	var deli_prod_cnt = new Array(); // 상품 목록
	var card_msg_chk = false; // 선물메시지 체크 여부
	var basedlvpyn = new Array(),
		dlvpnm = new Array();
	var dlvpsn = new Array(),
		usrsortrnk = new Array(),
		deli_chk = new Array(),
		rmitnm = new Array();
	var dlvzip = new Array(),
		dlvzip1 = new Array(),
		dlvzip2 = new Array(),
		postaddr = new Array(),
		dtladdr = new Array();
	var stnm_dlv_zip = new Array(),
		stnm_dlv_zip1 = new Array(),
		stnm_dlv_zip2 = new Array(),
		stnm_post_addr = new Array(),
		stnm_dtl_addr = new Array();
	var cellsctno = new Array(),
		celltxnono = new Array(),
		cellendno = new Array();
	//var cbltelrgnno = new Array(), cblteltxnono = new Array(), cbltelendno = new Array(), cbltelexnono= new Array();
	var rcvmessage = new Array(),
		ord_qty_list = new Array(),
		dlvp_idx = new Array(),
		dlvp_idx_tmp = new Array(),
		addrcvmessageyn = new Array();
	var receivename = new Array(),
		sendmessage = new Array(),
		sendname = new Array(),
		dlvpuseyn = new Array();
	var gift_msg_cd = new Array();
	//var deli_span_nm = "#deli_1"; // "#multi_deli_1";
	var chk_multi_dlvp = false;

	var totSelCnt = 0;
	ord_man_nm = '';
	//var deli_span_nm = "";		

	if (fn_getDeliCnt() == 1) { // 단일배송
		areaNum = 0;
		chk_multi_dlvp = true;
	} else {
		$("#frm_send input[name=chk_multi_dlvp]:hidden").val("Y");
	}

	//주문자명 체크
	if ($.trim($("#order_nm").val()) == '') {
		alert("보내는 분 이름을 입력해 주세요.");
		$("#order_nm").focus();
		return false;
	} else {
		ord_man_nm = $.trim($("#order_nm").val());
		$("#frm_send input[name=ord_man_nm]").val(ord_man_nm);
	}

	//주문자 전화번호 체크
	if ($.trim($("[name=inpcell1]:enabled").val()) == '' ||
		$.trim($("input[name=inpcell2]").val()) == '' ||
		$.trim($("input[name=inpcell3]").val()) == ''
	) {
		alert("보내는 분 연락처를 입력해 주세요.");
		$("input[name=inpcell2]").focus();
		return false;
	} else {
		$("#frm_send input[name=ord_man_tell_no]").val($.trim($("[name=inpcell1]:enabled").val()) + $.trim($("input[name=inpcell2]").val()) + $.trim($("input[name=inpcell3]").val()));
	}

	//전체수량 체크되었는지 확인
	setTotalDeliSelInfo();
	totSelCnt = $("#tot_ord_goods_cnt").val() * 1;

	//주문수량 - 선택수량 비교체크
	if (totSelCnt < totOrdCnt) {
		alert('주문수량 ' + totOrdCnt + '개를 모두 선택하세요.');
		return false;
	}

	//수신자 정보 및 수량 체크
	if (!fn_chkSendInfo()) {
		return false;
	}

	//수신자별 정보 send-data 셋팅
	var totOrdCnt = $("#goodsTotQty").val() * 1;
	var rcv_nm = "";
	var msg_rcv_nm = "";
	var rcv_tel_no = "";
	var ord_qty = "";
	var cell_1 = "";
	var cell_2 = "";
	var cell_3 = "";

	//선물하기 3차 주소추가
	// 지번 주소
	var $inpZip = "";
	var $inpZip1 = "";
	var $inpZip2 = "";
	var $inpAddr1 = "";
	var $inpAddr2 = "";

	// 도로명 주소
	var $stnmInpZip = "";
	var $stnmInpZip1 = "";
	var $stnmInpZip2 = "";
	var $stnmInpAddr1 = "";
	var $stnmInpAddr2 = "";
	var deli_tab = $("#sel_deli_tab").val(); // 받는분입력 선택된값: 휴대폰/주소/혼합
	var deli_cnt = $("#tot_ord_deli_cnt").val(); //선택된 배송지수

	var msg_bg_sel = "";
	var msg_bg_cont = "";
	var $sndMsgs = $('.msg_card .to_list li'); //개인별메시지
	var loopError = false;
	var rcv_idx = 0;
	var mass_ord = "N"; //대량주문여부

	//배송지 수만큼 반복하여 처리
	for (var k = 1; k < +deli_cnt + 1; k++) {
		rcv_idx++;
		skip_yn = "N";

		//휴대폰번호로 주문하기
		if (deli_tab == '0') {
			rcv_nm = $("#dlvp_info li").eq(k - 1).find('input[name=rcv_nm]').val();
			rcv_tel_no = $("#dlvp_info li").eq(k - 1).find('input[name=rcv_tel_no]').val();

			if (chk_multi_dlvp) { //한사람에게 보내기
				ord_qty = totOrdCnt;
			} else {
				ord_qty = $("#dlvp_info li").eq(k - 1).find('select[name=ord_qty]').val() * 1;
			}

			//휴대폰번호
			cell_1 = rcv_tel_no.substring(0, 3);

			if (rcv_tel_no.length == 10) {
				cell_2 = rcv_tel_no.substring(3, 6);
				cell_3 = rcv_tel_no.substring(6);
			} else {
				cell_2 = rcv_tel_no.substring(3, 7);
				cell_3 = rcv_tel_no.substring(7);
			}

			//우편번호:"-"로 처리 : 나머지 주소도 없음
			$inpZip1 = "-";

			//주소로 주문하기
		} else if (deli_tab == '1') {

			//대량주문 경우 
			if (totOrdCnt > 10) {
				rcv_nm = '-';
				cell_1 = '000';
				cell_2 = '0000';
				cell_3 = '0000';
				$inpZip1 = "-";
				mass_ord = "Y";
				ord_qty = 1;

				//대량주문 아닐경우
			} else {
				//내배송지
				/*if ( $("#deli_"+k+"_"+deli_tab+" #li_mine").hasClass('on')) {
				
					var deli_dlvp_sn = $("#deli_" + k +"_"+deli_tab+" #li_mine #deli_select_" + k).val();
					var $tmp_addr = $('input:radio[name="detail_list"][value="'+deli_dlvp_sn+'"]');
					
					//수신자명
					rcv_nm = $tmp_addr.data('d02');
					
					//주문수량
					if (chk_multi_dlvp) { //한사람에게 보내기
						ord_qty = totOrdCnt;
					} else {
						ord_qty =  $("#deli_"+k+"_" + deli_tab + " #li_mine select[name=ord_qty]").val()*1;
					}
	
					//휴대폰번호
					if ($("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell2]").is(':visible') == false) {
						rcv_tel_no = $("#deli_" + k + "_" + deli_tab + " #deli_phone_text_"+k).html().replace(/-/g, "");
						cell_1 = rcv_tel_no.substring(0, 3);
						if (rcv_tel_no.length == 10) {
							cell_2 = rcv_tel_no.substring(3, 6);
							cell_3 = rcv_tel_no.substring(6);
						} else {
							cell_2 = rcv_tel_no.substring(3, 7);
							cell_3 = rcv_tel_no.substring(7);
						}
					} else {
						cell_1 = $("#deli_" + k + "_" + deli_tab + " #li_mine select[name=inpcell1]").val();
						cell_2 = $("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell2]").val();
						cell_3 = $("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell3]").val();
					}
					
					//우편번호 및 주소
					$inpZip1  = $tmp_addr.data('d03').toString();;
					$inpZip2  = $tmp_addr.data('d04').toString();;
					$inpAddr1 = $tmp_addr.data('d05');
					$inpAddr2 = $tmp_addr.data('d06');
					$inpZip   = $inpZip1 + $inpZip2;
					
					$stnmInpZip1  = $tmp_addr.data('d07').toString();
					$stnmInpZip2  = $tmp_addr.data('d08').toString();
					$stnmInpAddr1 = $tmp_addr.data('d09')
					$stnmInpAddr2 = $tmp_addr.data('d10')
					$stnmInpZip   = $stnmInpZip1 + $stnmInpZip2;
			
				//새배송지
				} else {*/
				//수신자명
				var deli_span_nm = "#deli_" + k + "_" + deli_tab;
				//deli_span_nm += ('Y' != $("#deli_"+k+"_"+deli_tab+" input[name=newAddrYn]").val()?"mine":"new");
				rcv_nm = $(deli_span_nm + " input[name=inprmitnm]").val();

				//주문수량
				if (chk_multi_dlvp) { //한사람에게 보내기
					ord_qty = totOrdCnt;
				} else {
					ord_qty = $("#deli_" + k + "_" + deli_tab + deli_span_nm + " select[name=ord_qty]").val() * 1;
				}

				// 지번 주소
				$inpZip1 = $(deli_span_nm + " input[name=inpzip1]").val();
				$inpZip2 = $(deli_span_nm + " input[name=inpzip2]").val();
				$inpAddr1 = $(deli_span_nm + " input[name=inpaddr1]").val();
				$inpAddr2 = $(deli_span_nm + " input[name=inpaddr2]").val();
				$inpZip = $inpZip1 + $inpZip2;

				// 도로명 주소
				$stnmInpZip1 = $(deli_span_nm + " input[name=stnm_inp_zip1]").val();
				$stnmInpZip2 = $(deli_span_nm + " input[name=stnm_inp_zip2]").val();
				$stnmInpAddr1 = $(deli_span_nm + " input[name=stnm_inp_addr1]").val();
				$stnmInpAddr2 = $(deli_span_nm + " input[name=stnm_inp_addr2]").val();
				$stnmInpZip = $stnmInpZip1 + $stnmInpZip2;

				//휴대폰번호
				cell_1 = $(deli_span_nm + " input[name=inpcell1]").val();
				cell_2 = $(deli_span_nm + " input[name=inpcell2]").val();
				cell_3 = $(deli_span_nm + " input[name=inpcell3]").val();
				//}
			}
			//휴대폰번호+주소
		} else {
			//옵션이 선택되었을	경우
			//=>배송지수 만큼 선택 안될 수도 있다
			if ($("#deli_" + k + "_" + deli_tab + "_t").is(':visible') == true || $("#deli_" + k + "_" + deli_tab + "_d").is(':visible') == true) {
				//휴대폰번호 선택
				if ($("#deli_" + k + "_" + deli_tab + "_t").is(':visible') == true) {
					//수신자명		
					rcv_nm = $("#deli_" + k + "_" + deli_tab + "_t input[name=rcv_nm]").val();
					//휴대폰번호
					rcv_tel_no = $("#deli_" + k + "_" + deli_tab + "_t input[name=rcv_tel_no]").val();

					if (chk_multi_dlvp) { //한사람에게 보내기
						ord_qty = totOrdCnt;
					} else {
						ord_qty = $("#deli_" + k + "_" + deli_tab + "_t select[name=ord_qty]").val() * 1;
					}

					//휴대폰번호
					cell_1 = rcv_tel_no.substring(0, 3);

					if (rcv_tel_no.length == 10) {
						cell_2 = rcv_tel_no.substring(3, 6);
						cell_3 = rcv_tel_no.substring(6);
					} else {
						cell_2 = rcv_tel_no.substring(3, 7);
						cell_3 = rcv_tel_no.substring(7);
					}

					//우편번호:"-"로 처리 : 나머지 주소도 없음
					$inpZip1 = "-";

					//주소 선택	
				} else {
					//내배송지
					/*if ( $("#deli_"+k+"_"+deli_tab+"_d #li_mine").hasClass('on')) {
							var deli_dlvp_sn = $("#deli_" + k +"_"+deli_tab+"_d #li_mine #deli_select_" + k).val();
							var $tmp_addr = $('input:radio[name="detail_list"][value="'+deli_dlvp_sn+'"]');
							rcv_nm = $tmp_addr.data('d02');
							
							var deli_dlvp_sn = $("#deli_" + k +"_"+deli_tab+"_d #li_mine #deli_select_" + k).val();
							var $tmp_addr = $('input:radio[name="detail_list"][value="'+deli_dlvp_sn+'"]');
							
							//수신자명
							rcv_nm = $tmp_addr.data('d02');
							
							//주문수량
							if (chk_multi_dlvp) { //한사람에게 보내기
								ord_qty = totOrdCnt;
							} else {
								ord_qty =  $("#deli_"+k+"_"+deli_tab+"_d #li_mine select[name=ord_qty]").val()*1;
							}
		
							//휴대폰번호
							if ($("#deli_" + k + "_" + deli_tab + "_d #li_mine input[name=inpcell2]").is(':visible') == false) {
								rcv_tel_no = $("#deli_" + k + "_" + deli_tab + "_d #deli_phone_text_"+k).html().replace(/-/g, "");
								cell_1 = rcv_tel_no.substring(0, 3);
								if (rcv_tel_no.length == 10) {
									cell_2 = rcv_tel_no.substring(3, 6);
									cell_3 = rcv_tel_no.substring(6);
								} else {
									cell_2 = rcv_tel_no.substring(3, 7);
									cell_3 = rcv_tel_no.substring(7);
								}
							} else {
								cell_1 = $("#deli_" + k + "_" + deli_tab + "_d #li_mine select[name=inpcell1]").val();
								cell_2 = $("#deli_" + k + "_" + deli_tab + "_d #li_mine input[name=inpcell2]").val();
								cell_3 = $("#deli_" + k + "_" + deli_tab + "_d #li_mine input[name=inpcell3]").val();
							}
							
							//우편번호 및 주소
							$inpZip1  = $tmp_addr.data('d03').toString();
							$inpZip2  = $tmp_addr.data('d04').toString();
							$inpAddr1 = $tmp_addr.data('d05');
							$inpAddr2 = $tmp_addr.data('d06');
							$inpZip   = $inpZip1 + $inpZip2;
							
							$stnmInpZip1  = $tmp_addr.data('d07').toString();
							$stnmInpZip2  = $tmp_addr.data('d08').toString();
							$stnmInpAddr1 = $tmp_addr.data('d09')
							$stnmInpAddr2 = $tmp_addr.data('d10')
							$stnmInpZip   = $stnmInpZip1 + $stnmInpZip2;
						
						//새배송지
						} else {*/
					var deli_span_nm = "#deli_" + k + "_" + deli_tab + "_d";
					//deli_span_nm += ('Y' != $("#deli_"+k+"_"+deli_tab+"_d input[name=newAddrYn]").val()?"mine":"new");

					rcv_nm = $(deli_span_nm + " input[name=inprmitnm]").val();

					//수신자명
					rcv_nm = $(deli_span_nm + " input[name=inprmitnm]").val();

					//주문수량
					if (chk_multi_dlvp) { //한사람에게 보내기
						ord_qty = totOrdCnt;
					} else {
						ord_qty = $(deli_span_nm + " select[name=ord_qty]").val() * 1;
					}

					// 지번 주소
					$inpZip1 = $(deli_span_nm + " input[name=inpzip1]").val();
					$inpZip2 = $(deli_span_nm + " input[name=inpzip2]").val();
					$inpAddr1 = $(deli_span_nm + " input[name=inpaddr1]").val();
					$inpAddr2 = $(deli_span_nm + " input[name=inpaddr2]").val();
					$inpZip = $inpZip1 + $inpZip2;

					// 도로명 주소
					$stnmInpZip1 = $(deli_span_nm + " input[name=stnm_inp_zip1]").val();
					$stnmInpZip2 = $(deli_span_nm + " input[name=stnm_inp_zip2]").val();
					$stnmInpAddr1 = $(deli_span_nm + " input[name=stnm_inp_addr1]").val();
					$stnmInpAddr2 = $(deli_span_nm + " input[name=stnm_inp_addr2]").val();
					$stnmInpZip = $stnmInpZip1 + $stnmInpZip2;

					//휴대폰번호
					cell_1 = $(deli_span_nm + " input[name=inpcell1]").val();
					cell_2 = $(deli_span_nm + " input[name=inpcell2]").val();
					cell_3 = $(deli_span_nm + " input[name=inpcell3]").val();
					//}
				}
			} else {
				rcv_idx--;
				skip_yn = "Y";
			}
		}

		//SKIP 여부에 따른 처리
		if (skip_yn == "N") {
			// [개인별 메시지 쓰기] 클릭상태에 따른 선물 메시지처리			
			if ($("#each_msg_write").prop("checked")) {

				//받는사람명과 메시지카드 수신자명이 동일해야 한다.
				msg_rcv_nm = $sndMsgs.eq(rcv_idx - 1).find('input[name=cd_name]').val()
				if (rcv_nm != msg_rcv_nm) {
					//alert("받는 분/메시지TO 이름 불일치:"+rcv_nm+"/"+msg_rcv_nm);
					$sndMsgs.eq(rcv_idx - 1).find('input[name=cd_name]').val(rcv_nm);
					$sndMsgs.eq(rcv_idx - 1).find('span').text(rcv_nm);
					//loopError = true;
					//return false;
				}

				//현재 선택된 건(class on)일 경우, 화면에 보이는 내용으로 처리
				if ($sndMsgs.eq(rcv_idx - 1).hasClass('on')) {
					msg_bg_sel = $('#giftCardBgImgNo').val();
					msg_bg_cont = $('#card_txt_view').val();

					$sndMsgs.eq(rcv_idx - 1).find('input[name=cd_img]').val(msg_bg_sel);
					$sndMsgs.eq(rcv_idx - 1).find('input[name=cd_msg]').val(msg_bg_cont);

					//선택된 건 아닐 경우 개인별 메시지와 수취인 동일한 순번(index)건 처리
				} else {
					msg_bg_sel = $sndMsgs.eq(rcv_idx - 1).find('input[name=cd_img]').val()
					msg_bg_cont = $sndMsgs.eq(rcv_idx - 1).find('input[name=cd_msg]').val()
				}

				if ($.trim(msg_bg_sel) == '' || $.trim(msg_bg_cont) == '') {
					alert("개인별 카드 메시지를 작성해 주세요"); //(To "+msg_rcv_nm+")
					loopError = true;
					$sndMsgs.eq(rcv_idx - 1).click();
					$('#card_txt_view').val('');
					$('#card_txt_view').focus();
					return false;
				}
			} else {
				msg_bg_sel = $('#giftCardBgImgNo').val();
				msg_bg_cont = $('#card_txt_view').val();

				if ($.trim(msg_bg_sel) == '' || $.trim(msg_bg_cont) == '') {
					alert("카드 메시지를 작성해 주세요.");
					$('#card_txt_view').focus();
					loopError = true;
					return false;
				}
			}
			//코드형식 맞추기
			if (msg_bg_sel.length == 1) {
				msg_bg_sel = "0" + msg_bg_sel;
			}

			//휴대폰번호로 선물 또는 대량주문
			if ($inpZip1 == "-") {
				$inpZip = "";
				$inpAddr1 = "";
				$inpAddr2 = "";
				$stnmInpZip = "";
				$stnmInpAddr1 = "";
				$stnmInpAddr2 = "";
			}

			//배송, 메시지 데이터 배열에 담기
			dlvp_idx[rcv_idx - 1] = rcv_idx - 1;
			sendname[rcv_idx - 1] = ord_man_nm;
			dlvpnm[rcv_idx - 1] = rcv_nm;
			receivename[rcv_idx - 1] = rcv_nm;
			rmitnm[rcv_idx - 1] = rcv_nm;
			cellsctno[rcv_idx - 1] = cell_1;
			celltxnono[rcv_idx - 1] = cell_2;
			cellendno[rcv_idx - 1] = cell_3;
			ord_qty_list[rcv_idx - 1] = ord_qty;
			sendmessage[rcv_idx - 1] = msg_bg_cont;
			gift_msg_cd[rcv_idx - 1] = msg_bg_sel;
			deli_chk[rcv_idx - 1] = 'C'; //배송지신규
			basedlvpyn[rcv_idx - 1] = 'N';
			//선물하기 3차, 주소추가
			dlvzip[rcv_idx - 1] = $inpZip;
			postaddr[rcv_idx - 1] = $inpAddr1;
			dtladdr[rcv_idx - 1] = $inpAddr2;
			stnm_dlv_zip[rcv_idx - 1] = $stnmInpZip;
			stnm_post_addr[rcv_idx - 1] = $stnmInpAddr1;
			stnm_dtl_addr[rcv_idx - 1] = $stnmInpAddr2;
		}
	}

	//루프내에서 체크오류 발생 시 return;
	if (loopError) {
		return false;
	}

	// 전송폼 데이터 셋팅
	$("#frm_send input[name=dlvp_idx]").val(dlvp_idx.join(split_gubun_3));
	$("#frm_send input[name=dlvpnm]:hidden").val(dlvpnm.join(split_gubun_3));
	$("#frm_send input[name=rmitnm]:hidden").val(rmitnm.join(split_gubun_3));
	$("#frm_send input[name=cellsctno]:hidden").val(cellsctno.join(split_gubun_3));
	$("#frm_send input[name=celltxnono]:hidden").val(celltxnono.join(split_gubun_3));
	$("#frm_send input[name=cellendno]:hidden").val(cellendno.join(split_gubun_3));
	$("#frm_send input[name=ord_qty_list]").val(ord_qty_list.join(split_gubun_3));
	$("#frm_send input[name=sendmessage]:hidden").val(sendmessage.join(split_gubun_3));
	$("#frm_send input[name=gift_msg_cd]:hidden").val(gift_msg_cd.join(split_gubun_3));
	$("#frm_send input[name=delichk]:hidden").val(deli_chk.join(split_gubun_3));
	$("#frm_send input[name=receivename]:hidden").val(receivename.join(split_gubun_3));
	$("#frm_send input[name=sendname]:hidden").val(sendname.join(split_gubun_3));
	$("#frm_send input[name=basedlvpyn]:hidden").val(basedlvpyn.join(split_gubun_3));
	//선물하기 3차, 주소추가
	$("#frm_send input[name=dlvzip]:hidden").val(dlvzip.join(split_gubun_3));
	$("#frm_send input[name=postaddr]:hidden").val(postaddr.join(split_gubun_3));
	$("#frm_send input[name=dtladdr]:hidden").val(dtladdr.join(split_gubun_3));
	$("#frm_send input[name=stnm_dlv_zip]:hidden").val(stnm_dlv_zip.join(split_gubun_3));
	$("#frm_send input[name=stnm_post_addr]:hidden").val(stnm_post_addr.join(split_gubun_3));
	$("#frm_send input[name=stnm_dtl_addr]:hidden").val(stnm_dtl_addr.join(split_gubun_3));

	//줄바꿈 선물메시지
	if ($("#frm_send input[name=sendmessage]:hidden").val().length > 0) {
		$("#frm_send input[name=sendmessage]:hidden").val($("#frm_send input[name=sendmessage]:hidden").val().replace(/\n/g, "<br>"));
	}

	// 선물메시지 예약전송일자
	// 대량주문
	if (mass_ord == "Y") {
		$("#frm_send input[name=str_msg_snd_fcst_dtime]:hidden").val($("#giftmsg_day").find("option:eq(2)").val());
	} else if ($("#giftmsg_send2").prop("checked")) {
		$("#frm_send input[name=str_msg_snd_fcst_dtime]:hidden").val($("#giftmsg_day").val());
	}

	// 쇼핑백 신청여부(공통)
	if ($("input[name=gift_bag]") != undefined) {
		if ($("#gift_bag_y").prop("checked")) {
			$("#frm_send input[name=spbg_req_yn]:hidden").val($("input[name=gift_bag_size]:radio:checked").val());
		} else {
			$("#frm_send input[name=spbg_req_yn]:hidden").val("0");
		}
	}

	// 종이카드 함께 보내기여부 (공통)
	if ($("#with_paper") != undefined && $("#with_paper").prop("checked")) {
		$("#frm_send input[name=msg_card_encl_yn]:hidden").val("Y");
	} else {
		$("#frm_send input[name=msg_card_encl_yn]:hidden").val("N");
	}

	// 매장전달메시지(공통)
	if ($("#shop_memo_cont_") != undefined && $.trim($("#shop_memo_cont_").val()) != "") {
		$("#frm_send input[name=shop_memo_cont]:hidden").val($.trim($("#shop_memo_cont_").val()));
	}

	// 선물포장유형코드, 선물포장여부(공통)
	if ($("#giftopt1") != undefined && $("#giftopt1").prop("checked")) {
		$("#frm_send input[name=gift_pkg_tp_cd]:hidden").val("01"); //무료포장	
		$("#frm_send input[name=gift_pkg_yn]:hidden").val("Y");
	} else {
		$("#frm_send input[name=gift_pkg_tp_cd]:hidden").val("00"); //포장안함
		$("#frm_send input[name=gift_pkg_yn]:hidden").val("N");
	}

	if (true) {
		//alert("check test data...");
		//return false;
	}

	return true;
}

//(-)버튼 클릭 시 처리
function fn_clickMinus(obj) {
	$(obj).parent().remove();

	//개인별 메시지쓰기 초기화
	if ($("#each_msg_write").prop("checked")) {
		$('.msg_card .to_list li').each(function (index) {
			$(this).remove();
		});
		$("#to_name_msg").hide();
		$("#giftMsgConfirm").val("N");
		//$('#card_txt_view').val(""); 
		$("#each_msg_write").prop("checked", false);
	}

	//받는분 한명만 남았을 경우 개인별 메시지 쓰기 
	if ($("#dlvp_info li").length == 1) {
		$("#each_msg_write").prop("disabled", true);
	}

	setTotalDeliSelInfo();

	//배송비 - 참좋은혜택 재계산
	benefit_dlvp_set();
}

//선물하기 2차 - 받는분 입력란 추가
function fn_appendNewAddr1() {

	//수량초과 확인
	if (!fn_chkOrdQty(1)) {
		return;
	}

	//추가할 row html
	$.dlvClone = "<li class=\"flex\">" + $("#empty_dlvp_info ul li").clone().html() + "</li>";
	//alert($.dlvClone);

	$("#dlvp_info:last").append($.dlvClone);

	// (-)버튼 클릭 시 이벤트 추가
	$("#dlvp_info li:last>a").on('click', function () {
		fn_clickMinus(this);
	});

	// 받는분 명  변경시
	/*
	$("#dlvp_info li:last>input[name=rcv_nm]").on('blur', function(){
		console.log("rcv_nm blur2...");
		fn_changeRcvNm(this);
	});
	*/

	// 셀렉트박스 수량변경 시 이벤트 추가
	$("#dlvp_info li:last>span>select").on('change', function () {
		if ($(this).is(':visible') == true) {
			fn_changeOrdQty(this);
		} else {}
		//fn_changeOrdQty(this);
		setTotalDeliSelInfo();
	});

	//[한 명에게 보내기] 체크박스 해제
	if ($("#one_send").prop("checked")) {
		$("#one_send").prop("checked", false);
	}

	setTotalDeliSelInfo();
	//배송비 - 참좋은혜택 재계산
	//benefit_dlvp_set();
}
//선물하기 2차 - 받는분 이름  focusout시 호출
function fn_changeRcvNm(obj) {

	var $sndMsgs = $('.msg_card .to_list li'); //개인별메시지
	var rcv_nm = "";
	var msg_rcv_nm = "";

	//수량 2개 이상이며  개인별 메시지 쓰기 체크상태일때만
	if (($("#goodsTotQty").val() * 1) > 1 && $("#each_msg_write").prop("checked")) {


		//선물하기 3차, 주석처리 : 탭 추가로 인해 blur시 오류 가능성
		if ($.trim($(obj).val()).length <= 0 && $(obj).is(':visible')) {
			alert("받는 분 이름을 입력해 주세요.");
			$(obj).focus();
			return;
		}

		$("#dlvp_info li").each(function (index) {
			rcv_nm = $(this).find('input[name=rcv_nm]').val();
			msg_rcv_nm = $sndMsgs.eq(index).find('input[name=cd_name]').val()

			//이름 불일치의 경우 받는분 정보로 통일
			if (rcv_nm != msg_rcv_nm) {
				$sndMsgs.eq(index).find('input[name=cd_name]').val(rcv_nm);
				$sndMsgs.eq(index).find('span').text(rcv_nm);
			}
		});
	}
}
//선물하기 2차 - 주문수량 변경 선택시 확인
function fn_changeOrdQty(obj) {

	var chgQty = $(obj).val();
	var orgQty = ($(obj).next('input')).val();
	var deli_tab = $("#sel_deli_tab").val();

	//alert(orgQty);

	//수량초과 확인
	if (!fn_chkOrdQty(0)) {
		$(obj).val(orgQty);
		setTotalDeliSelInfo();
		return;
	} else {
		($(obj).next('input')).val(chgQty);

		//동일탭 내 동일순번 invisible수량 동일하게 설정
		if ($(obj).data("qtyidx") != undefined) {
			$("#deli_" + $(obj).data("qtyidx")).find('select[name=ord_qty]').val(chgQty);
			$("#deli_" + $(obj).data("qtyidx")).find('input[name=ord_qty_temp]').val(chgQty);
		}
	}

	//배송비 - 참좋은혜택 재계산
	benefit_dlvp_set();
}

//선물하기 2차 - 선택한 수량, 주문수량 초과 확인
function fn_chkOrdQty(plusQty) {

	//현재수량 조회 셋팅
	setTotalDeliSelInfo();

	//현재 선택된 주문수량 구하기
	var rowIdx = 0;
	var totOrdCnt = $("#goodsTotQty").val() * 1;
	var totSelCnt = $("#tot_ord_goods_cnt").val() * 1; //선택한 수량 총계

	//주문수량 - 선택수량 비교체크
	if (totSelCnt + plusQty > totOrdCnt) {
		alert('주문수량 ' + totOrdCnt + '개를 초과 하실 수 없습니다.');
		return false;
	} else {
		return true;
	}
}

//선물하기 2차 - 받는분 배송지정보, 주문수량 검증
function fn_chkSendInfo() {

	//현재 선택된 주문수량 구하기
	var rowIdx = 0;
	var totOrdCnt = $("#goodsTotQty").val() * 1;
	var totSelCnt = 0; //선택한 수량 총계
	var deli_cnt_no = 0;
	var chkOk = "Y";
	var deli_tab = $("#sel_deli_tab").val(); // 받는분입력 선택된값: 휴대폰/주소/혼함
	var selCnt = 0;
	var rcv_nm = ""; //수신자명
	var rcv_tel_no = ""; //수신자 휴대폰번호

	// 지번 주소
	var $inpZip1 = "";
	var $inpZip2 = "";
	var $inpAddr1 = "";
	var $inpAddr2 = "";

	// 도로명 주소
	var $stnmInpZip1 = "";
	var $stnmInpZip2 = "";
	var $stnmInpAddr1 = "";
	var $stnmInpAddr2 = "";

	//휴대폰번호로 주문하기
	if (deli_tab == '0') {

		$("#dlvp_info li").each(function (index) {
			rowIdx++;
			selCnt = $(this).children().find('select[name=ord_qty]').val();
			rcv_nm = $(this).find('input[name=rcv_nm]').val();
			rcv_tel_no = $(this).find('input[name=rcv_tel_no]').val();
			var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;

			if ($.trim(rcv_nm) == '') {
				alert('선물 받으시는 분의 성함을 정확히 확인해 주세요.');
				$(this).find('input[name=rcv_nm]').focus();
				chkOk = "N";
				return false;
			} else if (!regExp.test(rcv_tel_no)) {
				if ($.trim(rcv_tel_no).length <= 0) {
					alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요.");
				} else {
					alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요. [" + rcv_tel_no + "]");
				}
				$(this).find('input[name=rcv_tel_no]').focus();
				chkOk = "N";
				return false;
			}
			totSelCnt += selCnt * 1;
		});

		//주소로 주문하기
	} else if (deli_tab == '1') {

		//대량주문 경우 
		if (totOrdCnt > 10) {
			totSelCnt += totOrdCnt;

			//대량주문 아닐경우
		} else {
			if (totOrdCnt == 1) {
				deli_cnt = 1;
			} else {
				deli_cnt = $("#rcv_qty_1").val();
			}

			for (var k = 1; k <= deli_cnt; k++) {

				//내배송지
				//if ( $("#deli_"+k+"_1 #li_mine").hasClass('on')) {
				/*if ( 'Y' != $("#deli_"+k+"_1"+" input[name=newAddrYn]").val()) {
					//선택수량
					selCnt = $("#deli_"+k+"_1 #li_mine select[name=ord_qty]").val()*1;
					//내배송지중 배송지 변경시
					if('N' == $("#deli_"+k+"_1"+" input[name=newAddrYn]").val()){
						var deli_dlvp_sn = $("#deli_" + k +"_"+deli_tab+" #li_mine #deli_select_" + k).val();
						var $tmp_addr = $('input:radio[name="detail_list"][value="'+deli_dlvp_sn+'"]');
	
						//전화번호 유효성 체크
						if ($("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell2]").is(':visible') == false) {
							rcv_tel_no = $("#deli_" + k + "_" + deli_tab + " #deli_phone_text_"+k).html().replace(/-/g, "");
						} else {
							rcv_tel_no =   $("#deli_" + k + "_" + deli_tab + " #li_mine select[name=inpcell1]").val()
							             + $("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell2]").val()
							             + $("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell3]").val();
						}
						var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;
						if (!regExp.test(rcv_tel_no)) {
							if ($.trim(rcv_tel_no).length <= 0) {
								alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요.");
							} else {
								alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요. ["+rcv_tel_no+"]");
							}
							$("#deli_" + k + "_" + deli_tab + " #li_mine #deli_phone_text_"+k).hide();
							$("#deli_" + k + "_" + deli_tab + " #li_mine #deli_phone_inp_"+k).show();
							$("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell2]").show();
							$("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell3]").show();
							$("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell2]").focus();
							
							chkOk = "N";
							return false;	 					
						}
	
						 저장된 배송지정보 데이터 참고
						data-d01="${deli.dlvpNm}"         data-d02="${deli.rmitNm}"        data-d03="${deli.dlvZip1}"       data-d04="${deli.dlvZip2}"
						data-d05="${deli.postAddr}"       data-d06="${deli.dtlAddr}"       data-d07="${deli.stnm_dlv_zip1}" data-d08="${deli.stnm_dlv_zip2}"
						data-d09="${deli.stnm_post_addr}" data-d10="${deli.stnm_dtl_addr}" data-d11="${deli.baseDlvpYn}"    data-d12="${deli.dlvpSn}"
						data-d13="${deli.cellSctNo}"      data-d14="${deli.cellTxnoNo}"    data-d15="${deli.cellEndNo}"     data-d16="${status.index }" >
						
	
						//기존 주소정보 유효성 체크 (우편번호 및 주소1,2)
						if (    ($tmp_addr.data('d03') =='000' || $tmp_addr.data('d03').length <=0 || $tmp_addr.data('d04').length <=0 || $tmp_addr.data('d05').length <=0 || $tmp_addr.data('d06').length <=0) 
							 &&	($tmp_addr.data('d07') =='000' || $tmp_addr.data('d07').length <=0 || $tmp_addr.data('d08').length <=0 || $tmp_addr.data('d09').length <=0 || $tmp_addr.data('d10').length <=0)
						) {
							alert("기존 배송지정보(우편번호/주소)가 유효하지 않습니다.\n새로운 배송지로 입력해 주세요.");
							$("#deli_" + k + "_" + deli_tab + " #li_new > a").click();
							$("#deli_" + k + "_" + deli_tab + " #li_new [name=inprmitnm]").val($tmp_addr.data('d02'));
							$("#deli_" + k + "_" + deli_tab + " #li_new select[name=inpcell1]").val($tmp_addr.data('d13'));
							$("#deli_" + k + "_" + deli_tab + " #li_new input[name=inpcell2]").val($tmp_addr.data('d14'));
							$("#deli_" + k + "_" + deli_tab + " #li_new input[name=inpcell3]").val($tmp_addr.data('d15'));
							$("#deli_" + k + "_" + deli_tab + " #li_new input[name=txt_zip_tot]").focus();
							
							chkOk = "N";
							return false;
						}
					}
				}
				//새배송지
				else {*/
				var deli_span_nm = "#deli_" + k + "_" + deli_tab;
				//deli_span_nm += ('Y' != $("#deli_"+k+"_"+deli_tab+" input[name=newAddrYn]").val()?"mine":"new");
				//선택 수량
				selCnt = $("#deli_" + k + "_1 select[name=ord_qty]").val() * 1;

				// 지번 주소
				$inpZip1 = $(deli_span_nm + " input[name=inpzip1]").val();
				$inpZip2 = $(deli_span_nm + " input[name=inpzip2]").val();
				$inpAddr1 = $(deli_span_nm + " input[name=inpaddr1]").val();
				$inpAddr2 = $(deli_span_nm + " input[name=inpaddr2]").val();

				// 도로명 주소
				$stnmInpZip1 = $(deli_span_nm + " input[name=stnm_inp_zip1]").val();
				$stnmInpZip2 = $(deli_span_nm + " input[name=stnm_inp_zip2]").val();
				$stnmInpAddr1 = $(deli_span_nm + " input[name=stnm_inp_addr1]").val();
				$stnmInpAddr2 = $(deli_span_nm + " input[name=stnm_inp_addr2]").val();

				//수신자명
				rcv_nm = $(deli_span_nm + " input[name=inprmitnm]").val();

				//휴대폰번호
				rcv_tel_no = $(deli_span_nm + " input[name=inpcell1]").val() +
					$(deli_span_nm + " input[name=inpcell2]").val() +
					$(deli_span_nm + " input[name=inpcell3]").val();

				//받는분
				if ($.trim(rcv_nm).length <= 0) {
					alert('선물 받으시는 분의 성함을 정확히 확인해 주세요.');
					$(deli_span_nm + " input[name=inprmitnm]").focus();
					chkOk = "N";
					return false;
				}

				//전화번호
				var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;
				if (!regExp.test(rcv_tel_no)) {
					if ($.trim(rcv_tel_no).length <= 0) {
						alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요.");
					} else {
						alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요. [" + rcv_tel_no + "]");
					}
					$(deli_span_nm + " input[name=inpcell2]").val("");
					$(deli_span_nm + " input[name=inpcell3]").val("");
					$(deli_span_nm + " input[name=inpcell2]").focus();

					chkOk = "N";
					return false;
				}

				//주소정보 체크 (우편번호 및 주소1,2)
				if (($inpZip1 == '000' || $inpZip1.length <= 0 || $inpZip2.length <= 0 || $inpAddr1.length <= 0 || $.trim($inpAddr2).length <= 0) &&
					($stnmInpZip1 = '000' || $stnmInpZip1.length <= 0 || $stnmInpZip2.length <= 0 || $stnmInpAddr1.length <= 0 || $.trim($stnmInpAddr2).length <= 0)) {

					alert("선물 받으시는 분의 주소를 확인해 주세요.");
					$(deli_span_nm + " input[name=txt_zip_tot]").focus();
					chkOk = "N";
					return false;
				}
				//}
				totSelCnt += selCnt;
			}
		}
		//휴대폰번호+주소
	} else {
		deli_cnt = $("#rcv_qty_2").val();
		for (var k = 1; k <= deli_cnt; k++) {

			//라디오버튼 선택여부
			//if( $("#gift_type_"+k+"_1").prop("checked") == true || $("#gift_type_"+k+"_2").prop("checked") == true  ) {
			if ($("#deli_" + k + "_2_t").is(':visible') == true || $("#deli_" + k + "_2_d").is(':visible') == true) {

				//휴대폰번호 선택
				if ($("#deli_" + k + "_2_t").is(':visible') == true) {
					selCnt = $("#deli_" + k + "_2_t select[name=ord_qty]").val();
					rcv_nm = $("#deli_" + k + "_2_t input[name=rcv_nm]").val();
					rcv_tel_no = $("#deli_" + k + "_2_t input[name=rcv_tel_no]").val();

					var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;
					if ($.trim(rcv_nm) == '') {
						alert('선물 받으시는 분의 성함을 정확히 확인해 주세요.');
						$("#deli_" + k + "_2_t input[name=rcv_nm]").focus();
						chkOk = "N";
						return false;
					} else if (!regExp.test(rcv_tel_no)) {
						if ($.trim(rcv_tel_no).length <= 0) {
							alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요.");
						} else {
							alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요. [" + rcv_tel_no + "]");
						}
						$("#deli_" + k + "_2_t input[name=rcv_tel_no]").focus();
						chkOk = "N";
						return false;
					}
					totSelCnt += selCnt * 1;

					//주소 선택	
				} else {
					//내배송지
					//if ( $("#deli_"+k+"_2_d #li_mine").hasClass('on')) {
					/*if ( 'Y' != $("#deli_"+k+"_2_d"+" input[name=newAddrYn]").val()) {
														
							//선택수량
							selCnt = $("#deli_"+k+"_2_d #li_mine select[name=ord_qty]").val()*1;
							//내배송지중 배송지 변경시
							if('N' == $("#deli_"+k+"_2_d"+" input[name=newAddrYn]").val()){
								var deli_dlvp_sn = $("#deli_" + k +"_"+deli_tab+"_d #li_mine #deli_select_" + k).val();
								var $tmp_addr = $('input:radio[name="detail_list"][value="'+deli_dlvp_sn+'"]');
	
								//전화번호 유효성 체크
								if ($("#deli_" + k + "_" + deli_tab + " #li_mine input[name=inpcell2]").is(':visible') == false) {
									rcv_tel_no = $("#deli_" + k + "_" + deli_tab + "_d #deli_phone_text_"+k).html().replace(/-/g, "");
								} else {
									rcv_tel_no =   $("#deli_" + k + "_" + deli_tab + "_d #li_mine select[name=inpcell1]").val()
									             + $("#deli_" + k + "_" + deli_tab + "_d #li_mine input[name=inpcell2]").val()
									             + $("#deli_" + k + "_" + deli_tab + "_d #li_mine input[name=inpcell3]").val();
								}
								
								var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;
								if (!regExp.test(rcv_tel_no)) {
									if ($.trim(rcv_tel_no).length <= 0) {
										alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요.");
									} else {
										alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요. ["+rcv_tel_no+"]");
									}
									$("#deli_" + k + "_" + deli_tab + "_d #li_mine #deli_phone_text_"+k).hide();
									$("#deli_" + k + "_" + deli_tab + "_d #li_mine #deli_phone_inp_"+k).show();
									$("#deli_" + k + "_" + deli_tab + "_d #li_mine input[name=inpcell2]").show();
									$("#deli_" + k + "_" + deli_tab + "_d #li_mine input[name=inpcell3]").show();
									$("#deli_" + k + "_" + deli_tab + "_d #li_mine input[name=inpcell2]").focus();
									
									chkOk = "N";
									return false;	 					
								}
								
								//기존 주소정보 유효성 체크 (우편번호 및 주소1,2)
								if (    ($tmp_addr.data('d03') =='000' || $tmp_addr.data('d03').length <=0 || $tmp_addr.data('d04').length <=0 || $tmp_addr.data('d05').length <=0 || $tmp_addr.data('d06').length <=0) 
									 &&	($tmp_addr.data('d07') =='000' || $tmp_addr.data('d07').length <=0 || $tmp_addr.data('d08').length <=0 || $tmp_addr.data('d09').length <=0 || $tmp_addr.data('d10').length <=0)
								) {
									alert("기존 배송지정보(우편번호/주소)가 유효하지 않습니다.\n새로운 배송지로 입력해 주세요.");
									$("#deli_" + k + "_" + deli_tab + "_d #li_new > a").click();
									$("#deli_" + k + "_" + deli_tab + "_d #li_new [name=inprmitnm]").val($tmp_addr.data('d02'));
									$("#deli_" + k + "_" + deli_tab + "_d #li_new select[name=inpcell1]").val($tmp_addr.data('d13'));
									$("#deli_" + k + "_" + deli_tab + "_d #li_new input[name=inpcell2]").val($tmp_addr.data('d14'));
									$("#deli_" + k + "_" + deli_tab + "_d #li_new input[name=inpcell3]").val($tmp_addr.data('d15'));
									$("#deli_" + k + "_" + deli_tab + "_d #li_new input[name=txt_zip_tot]").focus();
									
									chkOk = "N";
									return false;
								}
							}
						}
						//새배송지
						else {*/
					var deli_span_nm = "#deli_" + k + "_" + deli_tab + "_d";
					//deli_span_nm += ('Y' != $("#deli_"+k+"_"+deli_tab+"_d input[name=newAddrYn]").val()?"mine":"new");
					selCnt = $(deli_span_nm + " select[name=ord_qty]").val() * 1;

					//선택 수량
					selCnt = $(deli_span_nm + " select[name=ord_qty]").val() * 1;

					// 지번 주소
					$inpZip1 = $(deli_span_nm + " input[name=inpzip1]").val();
					$inpZip2 = $(deli_span_nm + " input[name=inpzip2]").val();
					$inpAddr1 = $(deli_span_nm + " input[name=inpaddr1]").val();
					$inpAddr2 = $(deli_span_nm + " input[name=inpaddr2]").val();

					// 도로명 주소
					$stnmInpZip1 = $(deli_span_nm + " input[name=stnm_inp_zip1]").val();
					$stnmInpZip2 = $(deli_span_nm + " input[name=stnm_inp_zip2]").val();
					$stnmInpAddr1 = $(deli_span_nm + " input[name=stnm_inp_addr1]").val();
					$stnmInpAddr2 = $(deli_span_nm + " input[name=stnm_inp_addr2]").val();

					//수신자명
					rcv_nm = $(deli_span_nm + " input[name=inprmitnm]").val();

					//휴대폰번호
					rcv_tel_no = $(deli_span_nm + " input[name=inpcell1]").val() +
						$(deli_span_nm + " input[name=inpcell2]").val() +
						$(deli_span_nm + " input[name=inpcell3]").val();

					//받는분
					if ($.trim(rcv_nm).length <= 0) {
						alert('선물 받으시는 분의 성함을 정확히 확인해 주세요.');
						$(deli_span_nm + " input[name=inprmitnm]").focus();
						chkOk = "N";
						return false;
					}

					//전화번호
					var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;
					if (!regExp.test(rcv_tel_no)) {
						if ($.trim(rcv_tel_no).length <= 0) {
							alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요.");
						} else {
							alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요. [" + rcv_tel_no + "]");
						}
						$(deli_span_nm + " input[name=inpcell2]").val("");
						$(deli_span_nm + " input[name=inpcell3]").val("");
						$(deli_span_nm + " input[name=inpcell2]").focus();

						chkOk = "N";
						return false;
					}

					//주소정보 체크 (우편번호 및 주소1,2)
					if (($inpZip1 == '000' || $inpZip1.length <= 0 || $inpZip2.length <= 0 || $inpAddr1.length <= 0 || $.trim($inpAddr2).length <= 0) &&
						($stnmInpZip1 == '000' || $stnmInpZip1.length <= 0 || $stnmInpZip2.length <= 0 || $stnmInpAddr1.length <= 0 || $.trim($stnmInpAddr2).length <= 0)) {

						alert("선물 받으시는 분의 주소를 확인해 주세요.");
						$(deli_span_nm + " input[name=txt_zip_tot]").focus();
						chkOk = "N";
						return false;
					}
					//}
					totSelCnt += selCnt;
				}
			} else {
				deli_cnt_no += 1
			}
		}
	}

	// 유효성체크시 실패
	if (chkOk == "N") {
		return false;
	}

	//주문수량 - 선택수량 비교체크
	if (totSelCnt < totOrdCnt) {
		alert('주문수량 ' + totOrdCnt + '개를 모두 선택하세요.');
		return false;
	} else {
		//배송비 - 참좋은혜택 재계산
		benefit_dlvp_set();
		return true;
	}
}

//페이지 로딩 후
function init() {

	//선물하기2차  퍼블작업 js
	if ($('#card_swipe').length) {
		var crtIdx = 0,
			$card = $('#card_swipe').parent(),
			ln = $('#card_swipe > li').length + 2,
			dir = -1,
			$toLi = $('.msg_card .to_list');
		var cardSwipe = setEGSlide('#card_swipe', msgSwipeEnd, true);
		$('.msg_card_wrap').css('background', $('#card_swipe > li').eq(1).data('cdBg'));
		//카드배경 이미지 변경
		$card.children('.btn_swipe').click(function () {
			if ($(this).hasClass('prev')) dir = 1
			else if ($(this).hasClass('next')) dir = -1;
			var wd = $card.width(),
				sx = cardSwipe._x() + wd * dir;
			cardSwipe.setMoveX(sx, 300, function () {
				var idx = cardSwipe.getIndex(ln, wd);

				msgSwipeEnd();
			});
		});

		//선물메시지 view focus out시
		$("#card_txt_view").focusout(function () {
			var idx = $('#giftCardBgImgNo').val();
			//alert("idx:"+idx);
			var imgMsg = $('#card_swipe > li').eq(idx * 1).children('input[name=msgDescHd]').val();
			var viewMsg = $('#card_txt_view').val();
			//alert(imgMsg);

			//선택이미지 기본메시지와 표시메시지가 다르다면 문구선택(결정)건으로 처리
			if ($('#giftMsgConfirm').val() == "N" && viewMsg != undefined && viewMsg != "" && imgMsg != viewMsg) {
				$('#giftMsgConfirm').val("Y");
			}
			if (viewMsg == undefined || viewMsg == "") {
				$('#giftMsgConfirm').val("N");
			}

			//개인별 메시지일 경우 해당문구 입력 처리
			if ($("#each_msg_write").prop("checked") && viewMsg != undefined && viewMsg != "") {
				$toLi.children('li').eq(crtIdx).find('input[name=cd_msg]').val(viewMsg);
			}
		});


		//선물하기 2차 - 개인별 메시지 쓰기 클릭
		$("#each_msg_write").click(function () {
			// 체크시
			if ($("#each_msg_write").prop("checked")) {
				//받는분 배송지 정보 및 수량 확인
				if (!fn_chkSendInfo()) {
					$("#each_msg_write").prop("checked", false);
					//정보가 틀릴경우 개인별 작성란도 초기화
					fn_eachMsgWriteInit();
					return;
				}
				//초기화
				$('#card_txt_view').val("");

				var deli_tab = $("#sel_deli_tab").val(); //받는분입력 선택된값, 휴대폰/주소/혼합
				var deli_cnt = $("#tot_ord_deli_cnt").val(); //선택된 배송지수
				var rcv_nm = ""; //수신자명
				var rcv_idx = 0;


				//배송지 수만큼 반복
				for (var k = 1; k < +deli_cnt + 1; k++) {

					//휴대폰번호로 주문하기
					if (deli_tab == '0') {
						rcv_nm = $("#dlvp_info li").eq(k - 1).find('input[name=rcv_nm]').val();

						//주소로 주문하기
					} else if (deli_tab == '1') {

						//내배송지
						/*if ( $("#deli_"+k+"_"+deli_tab+" #li_mine").hasClass('on')) {
							var deli_dlvp_sn = $("#deli_" + k +"_"+deli_tab+" #li_mine #deli_select_" + k).val();
							var $tmp_addr = $('input:radio[name="detail_list"][value="'+deli_dlvp_sn+'"]');
							rcv_nm = $tmp_addr.data('d02');
							
						//새배송지
						} else {*/
						rcv_nm = $("#deli_" + k + "_" + deli_tab + " input[name=inprmitnm]").val();
						//}
						//휴대폰번호+주소
					} else {
						//옵션이 선택되었을	경우
						if ($("#deli_" + k + "_" + deli_tab + "_t").is(':visible') == true || $("#deli_" + k + "_" + deli_tab + "_d").is(':visible') == true) {

							//휴대폰번호 선택
							if ($("#deli_" + k + "_" + deli_tab + "_t").is(':visible') == true) {
								rcv_nm = $("#deli_" + k + "_" + deli_tab + "_t input[name=rcv_nm]").val();

								//주소 선택	
							} else {
								//내배송지
								/*if ( $("#deli_"+k+"_"+deli_tab+"_d #li_mine").hasClass('on')) {
									var deli_dlvp_sn = $("#deli_" + k +"_"+deli_tab+"_d #li_mine #deli_select_" + k).val();
									var $tmp_addr = $('input:radio[name="detail_list"][value="'+deli_dlvp_sn+'"]');
									rcv_nm = $tmp_addr.data('d02');
									
								//새배송지
								} else {*/
								rcv_nm = $("#deli_" + k + "_" + deli_tab + "_d" + " input[name=inprmitnm]").val();
								//}
							}
						} else {
							rcv_nm = "";
						}
					}
					//수신자명 유효한 경우 버튼생성
					if (rcv_nm != "") {
						$.msg_write_on = "<li class='on'><span>" + rcv_nm + "</span><input type='hidden' name='cd_name' value='" + rcv_nm + "'/><input type='hidden' name='cd_img' value='1' /><input type='hidden' name='cd_msg' value=''/>";
						$.msg_write_off = "<li><span>" + rcv_nm + "</span><input type='hidden' name='cd_name' value='" + rcv_nm + "'/><input type='hidden' name='cd_img' value='1' /><input type='hidden' name='cd_msg' value=''/>";

						if (rcv_idx == 0) {
							$("#msg_write_list ul:last").append($.msg_write_on);
						} else {
							$("#msg_write_list ul:last").append($.msg_write_off);
						}

						// 클릭 시 이벤트 추가
						$('.msg_card .to_list li').on('click', function () {
							if (crtIdx == $(this).index()) return false;
							$toLi.children('li').eq(crtIdx).find('input[name=cd_msg]').val($('.order_section .msg_card_wrap .msg_card .card_cnt .card_txt').val());
							var tNm = $(this).find('input[name=cd_name]').val(),
								tImg = $(this).find('input[name=cd_img]').val(),
								tMsg = $(this).find('input[name=cd_msg]').val();

							//$("#giftCardBgImgNo").val(tImg);
							$('.msg_card .to_name em').html(tNm);
							$('.msg_card .card_cnt .card_txt').val(tMsg);
							crtIdx = $(this).index();
							cardSwipe.setX(-tImg * $card.width());
							msgSwipeEnd();
							$(this).addClass('on').siblings().removeClass('on');

							$("#to_name_msg").show();
						});
						rcv_idx++;
					}
				}
				//첫번째 수신자 클릭처리
				crtIdx = -1;
				$('.msg_card .to_list li').eq(0).click();
				// 체크 해제시
			} else {
				//초기화
				fn_eachMsgWriteInit();
			}
		});

		//선물하기 2차, 카드배경 이미지 변경 후 메시지 등 후처리
		function msgSwipeEnd() {
			var wd = $card.width(),
				idx = cardSwipe._x() / -wd,
				cardMsg,
				cMsgIpt = $toLi.children('li').eq(crtIdx).find('input[name=cd_msg]');
			if (idx == 0) {
				cardSwipe.setX(-(ln - 2) * wd);
				idx = ln - 2;
			} else if (idx == ln - 1) {
				cardSwipe.setX(-1 * wd);
				idx = 1;
			}
			$card.find('.swipe_num .current').text(idx);
			$('.msg_card_wrap').css('background', $('#card_swipe > li').eq(idx).data('cdBg'));

			if ($toLi.children('li').length) {
				$toLi.children('li').eq(crtIdx).find('input[name=cd_img]').val(idx);
			}

			if (cMsgIpt.val() == '' || cMsgIpt.val() == undefined) cardMsg = $('#card_swipe > li').eq(idx).children('img').attr('alt');

			//대표 이미지
			$('#giftCardBgImgNo').val(idx);

			//대표 메시지
			$("#giftCardBgMsg").val($('#card_swipe > li').eq(idx).children('input[name=msgDescHd]').val());


			//전체 메시지 일때
			if (!$("#each_msg_write").prop("checked")) {
				if (cMsgIpt.val() == undefined || cMsgIpt.val() == '') {
					if ($('#giftMsgConfirm').val() == "N") {
						cardMsg = $('#card_swipe > li').eq(idx).children('input[name=msgDescHd]').val();
						$('.msg_card .card_cnt .card_txt').val(cardMsg);
					}
				}
			} else {
				//개인별 메시지
				if ($toLi.children('li').length) {
					$toLi.children('li').eq(crtIdx).find('input[name=cd_img]').val(idx);
				}
				if (cMsgIpt.val() == '' || cMsgIpt.val() == undefined) cardMsg = $('#card_swipe > li').eq(idx).children('img').attr('alt');
				else cardMsg = cMsgIpt.val();
				$('.msg_card .card_cnt .card_txt').val(cardMsg);
			}
			//글자수제한 체크
			chkSendMsgLimit('card_txt_view', 100, 'sendmessagebyte_1');
		}
	}

	//선물하기 2차 - 개인별 메시지 쓰기 초기화(해제)
	function fn_eachMsgWriteInit() {
		$('.msg_card .to_list li').each(function (index) {
			$(this).remove();
		});

		$("#to_name_msg").hide();
		$("#giftMsgConfirm").val("N");

		//메시지카드 swap초기화
		//viewMsg = $('#card_txt_view').val();
		$('#card_txt_view').val(""); //giftCardBgMsg
		crtIdx = 1;
		cardSwipe.setX(-1 * $card.width());
		msgSwipeEnd();
	}

	//프리미엄 팝업 스와이프
	if ($('#premium_detail_list').length) {
		var $pBtn = $('.layer_gift_pop.view_premium .swipe_wrap'),
			$pWrap = $('#premium_detail_list').parent(),
			prmLn = $('#premium_detail_list > li').length + 2,
			pDir = -1;
		var premiumSwipe = setEGSlide('#premium_detail_list', null, true);
		premiumSwipe.off();
		$pBtn.children('.btn_swipe').click(function () {
			if ($(this).hasClass('prev')) pDir = 1
			else if ($(this).hasClass('next')) pDir = -1;
			var prmWd = $pWrap.width(),
				prmSx = premiumSwipe._x() + prmWd * pDir;
			premiumSwipe.setX(prmSx);
			var pIdx = premiumSwipe.getIndex(prmLn, prmWd);
			if (pIdx == 0) {
				premiumSwipe.setX(-(prmLn - 2) * prmWd);
			} else if (pIdx == prmLn - 1) {
				premiumSwipe.setX(-1 * prmWd);
			}
		});
	}

	//전체 팝업보기, 미리보기 : 메시지카드, 포장지
	$('.pop_layer_pop').on('click', function () {
		var clsNm = $(this).attr('class').match(/\b(view_).*?\b/),
			popNm = '.layer_gift_pop.' + clsNm;
		$('#pageCover').show();
		$(popNm).css({
			'top': 0,
			'bottom': 'auto'
		}).addClass('on');

		//메시지카드
		if ($(popNm).hasClass('view_card')) {
			$('#pop_view_card_img').attr('src', $('#card_swipe > li').eq(($('#giftCardBgImgNo')).val()).children('img').attr('src'));
			$('#pop_view_card_txt').html($('#card_txt_view').val().replace(/\n/g, "<br>"));
			$('#pop_view_card_from').text('From. ' + $('#order_nm').val());
		}

		$('.layer_gift_pop p.close, .layer_gift_pop .btn_cls').unbind('click').bind('click', function () {
			$('#pageCover').hide();
			$(popNm).css('top', 'auto').removeClass('on');
		});
	});

	if ($('#premium_list').length) {
		var $pList = $('#premium_list'),
			pLn = $pList.children('label').length,
			listW = $pList.children('label').eq(0).outerWidth(true) * pLn;
		$pList.width(listW);
		var $pdrag = $pList.simpleDrag(function () {
			var wd = $pList.parent().width(),
				curwd = $pdrag._width() - wd,
				curpos = $pdrag._x();
			if (curpos > 0) curpos = 0;
			else if (curpos < -curwd) curpos = -curwd;
			$pdrag.setMoveX(curpos, 300, null);
		});
	}

	//선물하기 2차 - 쇼핑백 사이즈 선택 추가
	$('input[name=gift_bag]').click(function () {
		var $giftSize = $('.gift_bag_size');
		if ($('#gift_bag_y').is(':checked')) $giftSize.addClass('on');
		else $giftSize.removeClass('on');
	});

	//선물하기 2차 - 한 명에게 보내기 체크박스 클릭
	//$("#one_send").click(function(){
	$('input[name=one_send]').click(function () {
		var totOrdCnt = $("#goodsTotQty").val() * 1;
		var rowIdx = 0;
		var deliTab = $("#sel_deli_tab").val();

		//주문수량 1개일 경우 그냥 종료
		if (totOrdCnt == 1) {
			if (!$(this).prop("checked")) {
				$(this).prop("checked", true);
			}
			return;
		}

		//한 명에게 보내기 체크 시
		if ($(this).prop("checked")) {

			// 1번탭, 전화번호로 선물
			if (deliTab == '0') {
				$("#dlvp_info li").each(function (index) {
					rowIdx++;
					if (index == 0) {
						$(this).children().find('select[name=ord_qty]').val(totOrdCnt);
						$(this).children().find('select[name=ord_qty]').attr("disabled", true);
					} else {
						$(this).remove();
					}


				});

				// 2번탭, 주소로 선물
			} else if (deliTab == '1') {
				//첫번째 탭 제외하고 off처리
				for (var k = 1; k <= totOrdCnt; k++) {
					if (k == 1) {
						$("#deli_1_1 select[name=ord_qty]").val(totOrdCnt);
						$("#deli_1_1 select[name=ord_qty]").attr("disabled", true);

					} else {
						$("#deli_" + k + "_" + deliTab + " select[name=ord_qty]").val(1);
						$("#deli_" + k + "_" + deliTab).hide();
					}
				}
				//받는사람 1명
				$(this).parent().siblings().children().find("select").val(1);
			}

			//개인별 메시지쓰기 비활성화 및 초기화
			$("#each_msg_write").prop("checked", false);
			$("#each_msg_write").attr("disabled", true);
			fn_eachMsgWriteInit();
			$("#giftMsgConfirm").val("N");

			//한 명에게 보내기 체크 해제 시
		} else {
			// 1번탭, 전화번호로 선물
			if (deliTab == '0') {
				//기존 row존재여부 체크  주소 수량 1처리
				$("#dlvp_info li").each(function (index) {
					rowIdx++;
					if (index == 0) {
						$(this).children().find('select[name=ord_qty]').val(1);
						$(this).children().find('select[name=ord_qty]').attr("disabled", false);
					}
				});
				//부족한 수 만큼 추가
				for (var k = rowIdx; k < totOrdCnt; k++) {
					fn_appendNewAddr1();
				}

				// 2번탭, 주소로 선물
			} else if (deliTab == '1') {
				for (var k = 1; k <= totOrdCnt; k++) {
					$("#deli_" + k + "_" + deliTab).show();
				}
				//받는사람  total명
				$(this).parent().siblings().children().find("select").val(totOrdCnt);

				$("#deli_1_" + deliTab).find('select[name=ord_qty]').val(1);
				$("#deli_1_" + deliTab).find('select[name=ord_qty]').attr("disabled", false);
			}

			//개인별 메시지쓰기 활성화
			$("#each_msg_write").attr("disabled", false);
		}
		//탭 선택에 따른 배송비등 계산
		setTotalDeliSelInfo();
		//배송비 - 참좋은혜택 재계산
		benefit_dlvp_set();
	});

	//받는사람 수 변경
	$("select[name=rcv_qty]").change(function () {
		var rcvQty = $(this).val() * 1;
		var orgRcvQty = ($(this).next('input')).val() * 1;
		var deli_tab = $('#sel_deli_tab').val();
		var totOrdCnt = $("#goodsTotQty").val() * 1;
		//1명 선택
		if (rcvQty == 1) {
			//주소로 선물하기
			if (deli_tab == '1') {
				//한명에게 보내기로 인한 변경건일경우 pass
				if ($('#one_send1').prop("checked")) {
					return;
				} else {
					$('#one_send1').click();
				}

				//주소+전화번호
			} else {
				//첫번째 탭 제외하고 off처리
				for (var k = 1; k <= totOrdCnt; k++) {
					if (k == 1) {
						$("#deli_1_2 select[name=ord_qty]").val(totOrdCnt);
						$("#deli_1_2 select[name=ord_qty]").attr("disabled", true);

					} else {
						$("#deli_" + k + "_" + deli_tab).hide();
					}
				}
			}
			//여러명 선택
		} else {
			for (var k = 1; k <= totOrdCnt; k++) {
				if (deli_tab == '1') {
					$('#one_send1').prop("checked", false);
				}
				if (rcvQty >= k) {
					$("#deli_" + k + "_" + deli_tab + " select[name=ord_qty]").val(1);
					$("#deli_" + k + "_" + deli_tab + " select[name=ord_qty]").attr("disabled", false);
					$("#deli_" + k + "_" + deli_tab).show();
				} else {
					$("#deli_" + k + "_" + deli_tab).hide();
				}
			}
		}
		//탭 선택에 따른 배송비등 계산
		setTotalDeliSelInfo();
		//배송비 - 참좋은혜택 재계산
		benefit_dlvp_set();

		// 개인별 메시지 쓰기 처리
		//배송지 2군데 이상이며 개인별 메시지 쓰기 disabled일 경우 해제처리
		if ($("#tot_ord_deli_cnt").val() * 1 > 1 && $("#each_msg_write").attr("disabled")) {
			$("#each_msg_write").attr("disabled", false);

			//배송지 1군데일 경우 disable처리
		} else if ($("#tot_ord_deli_cnt").val() * 1 == 1) {
			//개인별 메시지쓰기 비활성화 및 초기화
			$("#each_msg_write").prop("checked", false);
			$("#each_msg_write").attr("disabled", true);
			fn_eachMsgWriteInit();
			$("#giftMsgConfirm").val("N");

			//개인별 메시지 쓰기 체크되 있을 경우 초기화
		} else if ($("#each_msg_write").prop("checked")) {
			fn_eachMsgWriteInit();
			$("#each_msg_write").prop("checked", false);
			$("#giftMsgConfirm").val("N");
		}
	});


	//선물하기 2차 - 받는분(+) 클릭, 추가
	$(".btnPlus").click(function () {
		//alert('btnPlus Click... ...');
		//주문수량 1개일 경우 그냥 종료
		if ($("#goodsTotQty").val() * 1 == 1) {
			return;
		}

		// 한명에게 보내기 체크되었으면 disabled해제
		if ($("#one_send").prop("checked")) {
			$("#one_send").prop("checked", false);
			$("#one_send").attr("disabled", false);

			//선택수량 selectbox disabled 해제 및 수량 1처리
			$("#dlvp_info li").eq(0).children().find('select[name=ord_qty]').val(1);
			$("#dlvp_info li").eq(0).children().find('select[name=ord_qty]').attr("disabled", false);
		}

		//개인별 메시지쓰기 초기화
		if ($("#each_msg_write").attr("disabled")) {
			$("#each_msg_write").attr("disabled", false);
		}
		if ($("#each_msg_write").prop("checked")) {
			fn_eachMsgWriteInit();
			$("#each_msg_write").prop("checked", false);
		}

		//추가
		fn_appendNewAddr1();

		//배송비 - 참좋은혜택 재계산
		benefit_dlvp_set();
	});

	//선물하기 2차 - 받는분(-) 클릭 , 삭제
	$(".btnMinus").click(function () {
		fn_clickMinus(this);
	});
	//선물하기 2차 - 받는분 명  변경시
	/*
	$("#dlvp_info input[name=rcv_nm]").blur(function(){
		console.log("rcv_nm blur1...");
		fn_changeRcvNm(this);
	});
	*/
	//선물하기 2차 - 셀렉트박스 주문수량 변경
	$("select[name=ord_qty]").change(function () {
		if ($(this).is(':visible') == true) {
			fn_changeOrdQty(this);
		} else {}
	});

	//선물하기 2차 - 선물메시지 - 바로 전송 클릭
	$("#giftmsg_send1").click(function () {
		$("#giftmsg_send_date").hide();
	});

	//선물하기 2차 - 선물메시지 - 예약 전송 클릭
	$("#giftmsg_send2").click(function () {
		$("#giftmsg_send_date").show();
	});

	//추천메시지 팝업, 선물하기 1차, 선물하기 2차  
	$('.gift_card_open').click(function () {
		$this = $(this);
		$('#pageCover').show();
		$('.gift_card_layer').addClass('on');
		$('#frm_inp #filterType_gift').egScroll(true, false);
		$('.btn_cancel').unbind('click').bind('click', function () {
			$('#pageCover').hide();
			$('.gift_card_layer').removeClass('on');
		});
		$('.btn_msg_list').unbind('click').bind('click', function () {
			var cardMsg = $('input[name=card_msg_list]:checked').next('.rdo_txt').text();

			$('#pageCover').hide();
			$('.gift_card_layer').removeClass('on');

			var cardSelMsg = $('input[name=card_msg_list]:checked').next('.rdo_txt').text();
			//alert(cardSelMsg);				
			$("#card_txt_view").val(cardSelMsg);
			$('#giftMsgConfirm').val("Y");
			chkSendMsgLimit('card_txt_view', 100, 'sendmessagebyte_1');
			$("#card_txt_view").focus();
		});
	});


	//선물하기 1차관련 추가_20160516
	$(".gift_msgMulti").hide();
	$(".gift_msgMulti_new").hide();

	// 선물메시지 초기화
	var gift_yn_nm = "";
	var deli_idx = -1;
	$("#frm_inp input[name^=gift_yn_]:radio").each(function () {
		gift_yn_nm = $(this).attr("name");
		deli_idx = gift_yn_nm.substring(gift_yn_nm.lastIndexOf("_") + 1);

		if ($("#frm_inp input[name=" + gift_yn_nm + "]:radio:checked").val() == '1') {
			$("dd[name^=gift_msg_form_" + deli_idx + "]").show();
		} else {
			$("dd[name^=gift_msg_form_" + deli_idx + "]").hide();
		}
	});

	// 결제수단 초기화
	if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_CARD) {
		$("#pay_card").show();
	} else if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_BANK) {
		$("#pay_bank").show();
	} else if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_LPAY) {
		$("#pay_card").show();
	}
	// 로컬 스토리지 재 셋팅 (mISP, ilkmpi 에서 사용)
	localStorageReSet("order_");

	// 중복쿠폰
	ord_session_clear();

	single_prom = singleProm;
	single_prom_cnt = singlePromCnt;
	multi_prom = multiProm;
	multi_prom_cnt = multiPromCnt;

	$("#frm_inp select[name=iscmcd] option:first").attr('selected', true);
	$("#frm_inp input[name=rdo_cardinst]:radio").attr('disabled', true);
	$("#frm_inp select[name=cardinstmon]").attr('disabled', true);
	$("#frm_inp select[name=bankno] option:first").attr('selected', true); // 무통장입금 은행
	//메시지카드 영역 초기화
	$("input[name^=gift_yn_]:visible:last").prop("checked", true);
	$("input[name^=gift_yn_]:visible:last").click();

	//선물하기 1차 관련 추가_20160517_선택 종이카드
	$("#frm_inp input[name=gift_msg_y_index]:hidden").val("");
	$("#frm_inp input[name=choose_card_msg_one]:hidden").val("");
	$("#frm_inp input[name=choose_card_msg_many]:hidden").val("");

	//선물하기 1차 추가_20160519
	var recvNmFix = $("#deli_1 input[name=inprmitnm]").val();
	$(".gift_msgMultiInsert input[name=defultRecvNm]:hidden").val(recvNmFix);

	// 선물하기 탭 퍼블 ui 2016.11.04 (상단 3탭 이동)
	$('.sendGiftTebBtn > div').click(function () {
		var $num = $(this).index();
		$(this).addClass('on').siblings().removeClass('on');
		$('.sendGift_cont_wrap > div').eq($num).addClass('on').siblings().removeClass('on');

		$('#sel_deli_tab').val($num.toString());
		var totOrdCnt = $("#goodsTotQty").val() * 1; //주문상품 총수량

		if ($num == 0) {
			$('#sendGift_dtl_1').hide();
			$('#sendGift_dtl_2').hide();
			//대량주문 여부에 따른 처리
			if (totOrdCnt > 10) {
				//메시지예약전송 선택 표시
				$("#giftmsg_send_div").show();
			}
		} else if ($num == 1) {
			//대량주문 여부에 따른 처리
			if (totOrdCnt <= 10) {
				$('#sendGift_dtl_1').show();
				$('#sendGift_dtl_2').hide();
			} else {
				//메시지예약전송 선택 숨김
				$("#giftmsg_send_div").hide();
			}
		} else {
			$('#sendGift_dtl_1').hide();
			$('#sendGift_dtl_2').show();
		}
		//탭 선택에 따른 배송비등 계산
		setTotalDeliSelInfo();
		//배송비 - 참좋은혜택 재계산
		benefit_dlvp_set();

		//대량주문일 선택 경우
		if ($num == 1 && totOrdCnt > 10) {
			//개인별 메시지쓰기 비활성화 및 초기화
			$("#each_msg_write").prop("checked", false);
			$("#each_msg_write").attr("disabled", true);
			fn_eachMsgWriteInit();
			$("#giftMsgConfirm").val("N");

			//수량 2개 이상일 경우 개인별 메시지 쓰기 초기화
		} else if (totOrdCnt > 1) {

			//배송지 2군데 이상이며 개인별 메시지 쓰기 disabled일 경우 해제처리
			if ($("#tot_ord_deli_cnt").val() * 1 > 1 && $("#each_msg_write").attr("disabled")) {
				$("#each_msg_write").attr("disabled", false);

				//배송지 1군데일 경우 disable처리
			} else if ($("#tot_ord_deli_cnt").val() * 1 == 1) {
				//개인별 메시지쓰기 비활성화 및 초기화
				$("#each_msg_write").prop("checked", false);
				$("#each_msg_write").attr("disabled", true);
				fn_eachMsgWriteInit();
				$("#giftMsgConfirm").val("N");

				//개인별 메시지 쓰기 체크되 있을 경우 초기화
			} else if ($("#each_msg_write").prop("checked")) {
				fn_eachMsgWriteInit();
				$("#each_msg_write").prop("checked", false);
				$("#giftMsgConfirm").val("N");
			}
		}
	});


	// 휴대폰번호 또는 주소로 선물하기 보내기 클릭시
	$('.order_send_select .s_text').each(function (i) {
		var $contI, $tabCont, $contOpen; //$contI 인덱스 체크,$tabCont 콘텐츠

		$(this).find("input:radio").change(function () {
			$contI = $(this).parent().index();
			$tabCont = $(this).parents('li').find('.cont > div').eq($contI);

			if ($tabCont.hasClass('on') || $tabCont.siblings().hasClass('on')) {
				$contOpen = false;
			} else {
				$contOpen = true;
			}

			//휴대폰/주소 최초선택시 주문수량 체크
			if ($contOpen == true) {
				//주문수량 초과 확인
				if (!fn_chkOrdQty(1)) {
					$(this).prop("checked", false);
					return;
				}
			}
			$tabCont.addClass('on').siblings().removeClass('on');
			//선택에 따른 배송비등 계산
			setTotalDeliSelInfo();
			//배송비 - 참좋은혜택 재계산
			benefit_dlvp_set();

			//주문수량 2개 이상일 경우 개인별 메시지 쓰기 초기화
			if ($("#goodsTotQty").val() * 1 > 1) {
				//개인별 메시지 쓰기 체크되 있을 경우 초기화
				if ($("#each_msg_write").prop("checked")) {
					fn_eachMsgWriteInit();
					$("#each_msg_write").prop("checked", false);
				}
			}
		});
	});

	// 배송 주문지 (내 배송지, 새로운 배송지 탭 클릭시)
	$(".tab_addr > li > a").click(function () {
		if (!isDeliPlcChg) {
			return;
		}

		$(this).parent().siblings().removeClass("on")
		$(this).parent().siblings().children().next().hide();
		$(this).parent().addClass("on");
		$(this).parent().children().next().css("display", "block");

		if ($(this).parent().attr("id") == "li_mine") { // 내배송지 탭
			switchDeliOption("mine", $(this).attr("cnt"), $(this).next().find("[name=deli_select]").val(), $(this).attr("cnttab"));
			sendTclick("order_Clk_tap_1");
		} else if ($(this).parent().attr("id") == "li_new") { // 새배송지 탭
			switchDeliOption("new", $(this).attr("cnt"), "", $(this).attr("cnttab"));
			sendTclick("order_Clk_tap_2");
		}
		//탭 선택에 따른 배송비등 계산
		setTotalDeliSelInfo();
		//배송비 - 참좋은혜택 재계산
		benefit_dlvp_set();

		//주문수량 2개 이상일 경우 개인별 메시지 쓰기 초기화
		if ($("#goodsTotQty").val() * 1 > 1) {
			//개인별 메시지 쓰기 체크되 있을 경우 초기화
			if ($("#each_msg_write").prop("checked")) {
				fn_eachMsgWriteInit();
				$("#each_msg_write").prop("checked", false);
			}
		}
	});

	//지번주소와 도로명 주소 탭
	$(".tab_addr_detail > li > a").click(function () {
		$(this).parent().siblings().removeClass("on").children().next().hide();
		$(this).parent().addClass("on").children().next().eq(0).show().nextAll().hide(); // FIXME
	});

	// 배송지 '주소찾기' 버튼
	$(".tit_addr_search").on("click", function () {
		var addrSearch = $(this);
		addrSearch.toggleClass("show");
		if (addrSearch.hasClass("show")) {
			addrSearch.children(".txt").replaceWith("<span class=\"txt\">취소하기</span>");
			addrSearch.parent().next().show().next().hide();
			addrSearch.parent().next().find("input").val(""); // 필드 초기화
			addrSearch.parent().next().find("[id^=result_seq1_]").hide().empty(); // 주소검색 결과 초기화
			addrSearch.parent().find("[id^=txt_zip]").val("");
			addrSearch.parent().next().find("li:eq(0) a").click();
		} else {
			addrSearch.children(".txt").replaceWith("<span class=\"txt\">주소찾기</span>");
			if (addrSearch.parent().find("[name=stnm_inp_zip1]").val().length > 0) {
				addrSearch.parent().find("[id^=txt_zip1]").val(addrSearch.parent().find("[name=stnm_inp_zip1]").val());
				addrSearch.parent().find("[id^=txt_zip2]").val(addrSearch.parent().find("[name=stnm_inp_zip2]").val());
			} else {
				addrSearch.parent().find("[id^=txt_zip1]").val(addrSearch.parent().find("[name=inpzip1]").val());
				addrSearch.parent().find("[id^=txt_zip2]").val(addrSearch.parent().find("[name=inpzip2]").val());
			}
			addrSearch.parent().next().hide().next().show();
		}
	});

	/* 2016.11.04 end*/
	/*
	if( imallYN != "Y" ){
		// 다중배송 배송지 n군데 설정
		$("#frm_inp select[name=areaNum_select]").val(1);
		$("#frm_inp select[name=areaNum_select]").prop("disabled", true);
		show_multi_deli_area(1);
	}
	*/

	// 배송비 default Setting 후 참좋은혜택 설정
	benefit_dlvp_set();

	if (isDeliPlcChg) {
		// 새로운배송지 li 하위 컴포넌트 비활성
		//$(".tab_addr #li_new").find("input").attr("disabled", true);
		//$(".tab_addr #li_new").find("select").attr("disabled", true);
	} else {
		// 내배송지 li 하위 컴포넌트 비활성
		//$(".tab_addr #li_mine").find("input").attr("disabled", true);
		//$(".tab_addr #li_mine").find("select").attr("disabled", true);
	}

	//페이지 로딩시 기본 배송지 출력 icjung 20150707
	$("dd.deli_" + $("input[name=deli_select]").val()).show();
	var name1 = "deli_" + $("input[name=deli_select]").val();
	var objNm1 = $("#frm_inp input[name=" + name1 + "]:hidden").val();
	$("#frm_inp input[name=defaultNm]:hidden").val(objNm1);

	// 무료배송권 존재 시, 선택 event 발생
	fn_freeDlvpCpnUse();

	// 현금영수증 영역 선택 event 발생
	$("#frm_inp input[name=rdo_cash]:radio:checked").click();

	// 롯데포인트 적립금액 세팅
	setLottePointSaveDiv(0);

	//2016.02.25 결제수단 공지사항 초기값 세팅 시작	
	if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_CARD) {
		$("#pay_notice_lpay").hide();
		$("#pay_notice_card").show();
		$("#pay_notice_bank").hide();
		$("#pay_notice_phone").hide();
		$("#pay_notice_naverpay").hide();
	} else if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_BANK) {
		$("#pay_notice_lpay").hide();
		$("#pay_notice_card").hide();
		$("#pay_notice_bank").show();
		$("#pay_notice_phone").hide();
		$("#pay_notice_naverpay").hide();
	} else if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_PHONE) {
		$("#pay_notice_lpay").hide();
		$("#pay_notice_card").hide();
		$("#pay_notice_bank").hide();
		$("#pay_notice_phone").show();
		$("#pay_notice_naverpay").hide();
	} else if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_LPAY) {
		$("#pay_notice_lpay").show();
		$("#pay_notice_card").hide();
		$("#pay_notice_bank").hide();
		$("#pay_notice_phone").hide();
		$("#pay_notice_naverpay").hide();
	} else if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_NAVERPAY) {
		$("#pay_notice_lpay").hide();
		$("#pay_notice_card").hide();
		$("#pay_notice_bank").hide();
		$("#pay_notice_phone").hide();
		$("#pay_notice_naverpay").show();
	}
	//2016.02.25 끝
}

// 보낼상품 선택 열고 닫기
function productToggle(btnId, product) {
	$(btnId).toggleClass("on");
	$(product).toggle();
}

// 2011.06.07 카드 목록 생성
function createCardType() {
	var card_src = '<option value ="">카드선택</option>';
	card_src += cardStr;
	$("#frm_inp select[name=iscmcd]").html(card_src);
	// 카드값 기본 셋팅
	getCardInsCheck();
}


// 참좋은혜택 > 배송비 설정
function benefit_dlvp_set(arg) {

	var dlex_one_goods = $("input[name=dlex_one_goods]").val(); //1개기준 배송비
	var dlvp_cnt = $("#tot_ord_dlvp_cnt").val();
	var deli_cnt = $("#tot_ord_deli_cnt").val();
	var tot_dlex_amt = $("#tot_ord_deli_amt").val();

	//배송지 2군데 이상일 경우 중복쿠폰  사용 불가 처리.
	if (deli_cnt > 1) {
		if ($("#frm_inp select[name=dup_coupon]") != null && $.type($("#frm_inp select[name=dup_coupon]").val()) != "undefined") {
			add_dis_impossible_flag = true;
			$("#frm_inp select[name=dup_coupon]").val("N"); // 중복 쿠폰 사용안함으로 셋팅
			$("#frm_inp select[name=dup_coupon]")[0].selectedIndex = 0;
			$("#frm_inp select[name=dup_coupon]").attr('disabled', true);
		}
	}

	// 배송비 표시 문구 설정
	if (dlvp_cnt <= 1) {
		$("#bene_group_deli_amt_1").html(
			freeShippingYn == 'Y' ? "무료 (플래티넘+ 회원)" :
			(tot_dlex_amt == 0 ? "무료" :
				new String(tot_dlex_amt).money() + "원"));
	} else {
		$("#bene_group_deli_amt_1").html(
			freeShippingYn == 'Y' ? "무료(플래티넘+ 회원)" :
			(tot_dlex_amt == 0 ? "무료" :
				new String(tot_dlex_amt).money() + "원(" + new String(dlex_one_goods).money() + "원x" + dlvp_cnt + "건)"));
	}
	//이전배송비 및 결제금액
	var old_dlex_amt = Number($("#frm_inp input[name=caltotdeliamt]:hidden").val());
	var totSettl = Number($("#frm_inp input[name=totsttlamt]:hidden").val());

	//배송비로 인해 결제금액이 마이너스가 될 경우, 포인트사용 초기화
	if (totSettl - (old_dlex_amt - tot_dlex_amt) < 0) {
		init_point()
		setCashReceiptArea(); // 현금영수증 영역 컨트롤		
		fn_initPointList("ALL");
	}

	// 총 배송비 셋팅
	$("#frm_inp input[name=caltotdeliamt]:hidden").val(tot_dlex_amt);
	$("#frm_send input[name=totdeliamt]:hidden").val(tot_dlex_amt);

	fn_calcTotalPrice(); // 금액 계산		
}

//주문선택정보 전송
function send() {
	// iOS12에서 기존 주문번호 삭제가 안되는 현상 방어코딩 추가 2018.09.17 박형윤
	console.log("주문번호 초기화");
	var del_date = new Date(0);
	document.cookie = 'ORD_NO=; path=/; domain=lotte.com; expires=' + del_date + ';';

	// iOS12에서 기존 주문번호 삭제가 안되는 현상 IOS앱 쿠키삭제 스키마 추가 2018.09.17 김낙운
	if (cp_schema != "") { //app일경우
		if (isIOS) { //아이폰일경우
			angular.element("#app_del_cookie_iframe").remove();
			setTimeout(function () {
				var iframe = document.createElement('iframe');
				iframe.id = 'app_del_cookie_iframe';
				iframe.style.visibility = 'hidden';
				iframe.style.display = "none";
				iframe.src = 'lottebridge://deletecookie?' + 'ord_no'; // 삭제 쿠키명 파라메터 형태로 다중 처리 가능(ex) abc,def,ghi)
				document.body.appendChild(iframe);
			}, 100);
		}
	}

	sendTclick('order_Clk_Btn_9');
	if ("137725" == cp_cn) { // TWorld OKCASHBAG
		if (!chk_ocb_card_no()) { // 카드번호 체크
			return;
		}
	}
	// 반복구매제한고객체크
	if ("Y" != grockle_yn) {
		if (!searchCncnMbrChk()) {
			return;
		}
	}
	/* 재고수량체크 */
	if (!fn_invQtyCheck($("#frm_send input[name=cartsn]:hidden").val())) return;

	// 20180822 서울보증보험 데이터체크 및 세팅
	if (!fn_usafeAgree("4")) {
		return;
	} else {
		$("#frm_send input[name=usafe_psb_yn]:hidden").val($("#usafe_psb_yn").val());
		$("#frm_send input[name=gen_sct_cd]:hidden").val($("#gen_mn").prop("checked") ? "M" : "F");
		$("#frm_send input[name=insu_bday_dt]:hidden").val($("#insu_brth_year").val() + $("#insu_brth_month").val() + $("#insu_brth_day").val());
		$("#frm_send input[name=insu_rgst_agr]:hidden").val($("#insu_rgst_chk").prop("checked") ? "Y" : "N");
		$("#frm_send input[name=insu_mail_agr]:hidden").val($("#insu_mail_chk").prop("checked") ? "Y" : "N");
		$("#frm_send input[name=insu_sms_agr]:hidden").val($("#insu_sms_chk").prop("checked") ? "Y" : "N");
	}

	iscmcd = $("#frm_inp select[name=iscmcd]").val();
	cpncardcd = $("#frm_send input[name=cardkndcd]:hidden").val(); // 할인쿠폰의 카드정보
	cpncardcd_dup = $("#frm_send input[name=cardkndcd_dup]:hidden").val(); // 중복카드할인쿠폰의 카드정보

	// 1차할인, 2차할인 중 카드할인이 존재할 경우
	if (cpncardcd != '' || cpncardcd_dup != '') {
		if (iscmcd == '' ||
			!($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == PAYTYPE_CODE_CARD ||
				$("#frm_inp input[name=rdo_paytype]:radio:checked").val() == PAYTYPE_CODE_LPAY)) {
			alert("카드할인을 받으시려면 해당 카드로 결제하셔야 합니다.");
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('disabled', false);
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('checked', true);
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop('checked', true);
			$("#frm_inp select[name=iscmcd]").change(); // 할인정보 재조회
			return;
		} else if (iscmcd != '' && !(iscmcd == cpncardcd || iscmcd == cpncardcd_dup)) {
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('disabled', false);
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").attr('checked', true);
			$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop('checked', true);
			$("#frm_inp select[name=iscmcd]").change(); // 할인정보 재조회
			return;
		}
	}

	// PG PROJECT : 구매동의 + pg 결제 서비스 이용약관 동의 여부
	if ($("#assent_all").length > 0 && $("#assent_all").parents(".box_agree_check").css("display") == "block" && !$("#pg_assent_crd").prop("checked") && !$("#frm_inp input[name=ord_agr_yn]").is(":checked")) {
		if (confirm("주문 내역 확인 및 결제 서비스 이용약관을 확인 후 동의하셔야 구매가 가능합니다.")) {
			$("#frm_send input[name=ord_agr_yn]:hidden").val("Y");
			$("input:checkbox[id='order_agree_on']").prop("checked", true).trigger("change");
			$("#pg_assent_crd").click();
		}
		return;
	}

	// 구매동의
	if (!$("#frm_inp input[name=ord_agr_yn]").is(":checked")) {
		if (confirm("주문 내역 확인 동의를 하셔야 합니다.")) {
			//$('#pointcheck7').addClass("checked");
			$("#frm_send input[name=ord_agr_yn]:hidden").val("Y");
			//$("input[name=ord_agr_yn]:checkbox")[0].checked = true;
			//$("input:checkbox[id='order_agree_off']").prop("checked", true);
			$("input:checkbox[id='order_agree_on']").prop("checked", true).trigger("change"); // PG PROJECT : change 발생 추가
		}
		return;
	} else {
		$("#frm_send input[name=ord_agr_yn]:hidden").val("Y");
	}

	// PG PROJECT : pg 결제 서비스 이용약관 동의 여부
	if ($("#assent_all").parents(".box_agree_check").css("display") == "block" && !$("#pg_assent_crd").prop("checked")) {
		if (confirm("결제 서비스 이용약관을 확인 후 동의하셔야 구매가 가능합니다.")) {
			$("#pg_assent_crd").click();
		}
		return;
	}

	if (totpayamt == "") {
		var spayamt = $("#frm_inp input[name=defaulttotsttlamt]:hidden").val(); // 배송비가 합쳐 있는 금액
		var sincludeSaveInstCpn = $("#frm_send input[name=includeSaveInstCpn]").val(); // 2011.05.19 적립여부
		var sdcamt = $("#frm_send input[name=totdcamt]").val();

		if (includeSaveInstCpn == 'Y') {
			totpayamt = spayamt.toString();
		} else {
			totpayamt = (spayamt - sdcamt).toString();
		}

		var stot_deli_amt = 0; // 총배송비

		if (freeShippingYn == 'N') {
			if ($("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")) { // 다중배송여부
				stot_deli_amt = $("#frm_inp input[name=caltotdeliamt]:hidden").val(); // 계산된 총배송비
			} else {
				stot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
			}
		}
		// 배송비 적용
		if (freeShippingYn == 'N') { // 플래티넘 플러스가 아니면			
			totpayamt = (parseInt(totpayamt) + parseInt(stot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
		}
	}

	// 모바일주문서간소화 2015.01.02 jjkim59
	// 결제수단다음에도사용
	if ($("#frm_inp input[name=next_use]").is(":checked") && Number(totpayamt) > 0) {
		$("#frm_send input[name=pay_mean_hist_use_yn]").val("Y");
		$("#frm_send input[name=pay_mean_hist_pay_mean_cd]").val($("#frm_inp input[name=rdo_paytype]:radio:checked").val());
		$("#frm_send input[name=bnk_cd]").val("");
		$("#frm_send input[name=acqr_cd]").val("");
		$("#frm_send input[name=card_pay_meth_cd]").val("");
		if ($("#frm_send input[name=pay_mean_hist_pay_mean_cd]").val() == PAYTYPE_CODE_CARD) {
			$("#frm_send input[name=acqr_cd]").val($("#frm_inp select[name=iscmcd]").val());
			$("#frm_send input[name=card_pay_meth_cd]").val($("#frm_inp input[name=card_confirm_type]:radio:checked").val());
		} else if ($("#frm_send input[name=pay_mean_hist_pay_mean_cd]").val() == PAYTYPE_CODE_BANK) {
			$("#frm_send input[name=bnk_cd]").val($("#frm_inp select[name=bankno]").val());
		} else if ($("#frm_send input[name=pay_mean_hist_pay_mean_cd]").val() == PAYTYPE_CODE_LPAY) {
			$("#frm_send input[name=acqr_cd]").val($("#frm_inp select[name=iscmcd]").val());
		}
	}
	// 주결제수단을 사용하지 않은경우 결제수단 다음에도 사용을 유지시킨다.
	if (Number(totpayamt) == 0 && $("#frm_inp input[name=op_pay_mean_hist_pay_mean_cd]").val() != "") {
		$("#frm_send input[name=pay_mean_hist_use_yn]").val("Y");
		$("#frm_send input[name=pay_mean_hist_pay_mean_cd]").val($("#frm_inp input[name=op_pay_mean_hist_pay_mean_cd]").val());
		$("#frm_send input[name=bnk_cd]").val("");
		$("#frm_send input[name=acqr_cd]").val("");
		$("#frm_send input[name=card_pay_meth_cd]").val("");
		if ($("#frm_send input[name=pay_mean_hist_pay_mean_cd]").val() == PAYTYPE_CODE_CARD) {
			$("#frm_send input[name=acqr_cd]").val($("#frm_inp input[name=op_pay_mean_hist_acqr_cd]").val());
			$("#frm_send input[name=card_pay_meth_cd]").val($("#frm_inp input[name=op_pay_mean_hist_card_pay_meth_cd]").val());
		} else if ($("#frm_send input[name=pay_mean_hist_pay_mean_cd]").val() == PAYTYPE_CODE_BANK) {
			$("#frm_send input[name=bnk_cd]").val($("#frm_inp input[name=op_pay_mean_hist_bnk_cd]").val());
		} else if ($("#frm_send input[name=pay_mean_hist_pay_mean_cd]").val() == PAYTYPE_CODE_LPAY) {
			$("#frm_send input[name=acqr_cd]").val($("#frm_inp select[name=iscmcd]").val());
		}
	}

	// 휴대폰 소액 결제 일 경우 체크
	if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_PHONE && !cellphone_confirm()) {
		return;
	}

	if (username != $('#nameSp').text()) { // 고객명과 수정된 이름이 다른 경우
		$("#frm_send input[name=ord_man_nm]").val($('#nameSp').text()); // 주문하시는 분 성명 변경
	} else {
		$("#frm_send input[name=ord_man_nm]").val("");
	}

	// 배송지 정보
	//선물하기 1차 관련 추가_20160517
	if (!$("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")) { //단일배송인 경우만
		var giftMsgChkInx = $("#frm_inp input[name=gift_msg_y_index]:hidden").val();
		var recvNmMsg = "";
		var sendNmMsg = "";
		var txtMsg = "";

		recvNmMsg = $("#frm_inp #giftMs_" + giftMsgChkInx + " input[name=receivename_" + giftMsgChkInx + "]").val();;
		sendNmMsg = $("#frm_inp #giftMs_" + giftMsgChkInx + " input[name=sendname_" + giftMsgChkInx + "]").val();;
		txtMsg = $("#frm_inp #giftMs_" + giftMsgChkInx + " #sendmessage_" + giftMsgChkInx).val();;

		if ($("#frm_inp #gift_msgMulti_" + giftMsgChkInx + " input[name=gift_yn_" + giftMsgChkInx + "]:radio:checked").val() == '1') {

			$("#frm_inp .gift_msgMultiInsert input[name=gift_yn_1]:radio[value='1']").prop("checked", true);
			$("#frm_inp .gift_msgMultiInsert input[name=gift_yn_1]:radio[value='2']").prop("checked", false);
			$("#frm_inp .gift_msgMultiInsert input[name=receivename_1").val(recvNmMsg);
			$(".gift_msgMultiInsert #sendmessage_1").val(txtMsg);
			$("#frm_inp .gift_msgMultiInsert input[name=sendname_1").val(sendNmMsg);
		}
	}
	//받는분 정보 등 체크 및 셋팅
	if (!setDeliDataGift()) {
		return;
	}


	// 스마트픽 교환권 MMS 보내기 (hsu)
	var sendSms = ($("#frm_inp input[name=sendSms]:checkbox").prop("checked") ? "Y" : "N");
	if (sendSms == 'Y' && (gubun == 'SMARTPICK' || gubun == 'ECOUPON')) {
		$("#frm_send input[name=sendSms]:hidden").val(sendSms);

		//마스터 휴대폰번호로 우선 셋팅
		$("#frm_send input[name=mst_adre_nm]:hidden").val($("#frm_inp input[name=mst_adre_nm]").val());
		$("#frm_send input[name=mst_adre_no_01]:hidden").val($("#frm_inp select[name=mst_adre_no_01]").val());
		$("#frm_send input[name=mst_adre_no_02]:hidden").val($("#frm_inp input[name=mst_adre_no_02]").val());
		$("#frm_send input[name=mst_adre_no_03]:hidden").val($("#frm_inp input[name=mst_adre_no_03]").val());

		//마스터 휴대폰번호가 없을때 기본주소로 셋팅
		if ($("#frm_send input[name=mst_adre_no_01]:hidden").val() == "") {
			$("#frm_send input[name=mst_adre_nm]:hidden").val($("#frm_inp input[name=ordr_nm]:hidden").val());
			$("#frm_send input[name=mst_adre_no_01]:hidden").val($("#frm_inp input[name=adre_no_01]:hidden").val());
			$("#frm_send input[name=mst_adre_no_02]:hidden").val($("#frm_inp input[name=adre_no_02]:hidden").val());
			$("#frm_send input[name=mst_adre_no_03]:hidden").val($("#frm_inp input[name=adre_no_03]:hidden").val());
		}
		$("#frm_send input[name=msg_cont]:hidden").val($("#frm_inp textarea[name=msg_cont]").val());

		var adre_no = $.trim($("#frm_send input[name=mst_adre_no_01]:hidden").val()) + $.trim($("#frm_send input[name=mst_adre_no_02]:hidden").val()) + $.trim($("#frm_send input[name=mst_adre_no_03]:hidden").val());
		var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;
		if (!regExp.test(adre_no)) {
			alert('교환권 수신 휴대폰 번호가 올바르지 않습니다.');
			return;
		}
	}


	// 상품수량 체크
	if ($("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")) { // 다중배송이면
		var cartsn_arr = ($("#frm_send input[name=cartsn]:hidden").val()).split(split_gubun_1);
		var ordqty_arr = ($("#frm_send input[name=ordqty]:hidden").val()).split(split_gubun_1); // 상품별 총 주문 수량
		var goodsnm_arr = ($("#frm_send input[name=goodsnm]:hidden").val()).split(split_gubun_1); // 상품별 총 주문 수량

		var tmp_qty = 0;
		for (var i = 0; i < cartsn_arr.length; i++) {
			tmp_qty = 0;

			$("input[name^=multi_prod_" + cartsn_arr[i] + "]").each(function () {
				tmp_qty += parseInt($(this).val());
			});

			if (parseInt(ordqty_arr[i]) != tmp_qty) {
				alert(goodsnm_arr[i] + ' 수가 맞지 않습니다.');
				return;
			}
		}
	}

	// 결제정보
	paytype = $("#frm_inp input[name=paytype]:hidden").val(); // 결제수단
	totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val(); // 총결제금액

	if (parseInt(totsttlamt) > 0) {
		var iscmcd, cardinstmon, virAcctBank, onlineacctname;
		if (paytype == PAYTYPE_CODE_CARD || paytype == PAYTYPE_CODE_LPAY) {
			iscmcd = $("#frm_inp select[name=iscmcd]").val();
			// 2012.12.26 
			cardinstmon = $("#frm_inp select[name=cardinstmon]").val();

			if (cardinstmon == "" || $("#frm_send input[name=prommdclcd_third]").val() == "35") {
				cardinst = "01";
				cardinstmon = "";
				$("#frm_inp select[name=cardinstmon]").val("");
			} else {
				var onintmonth = $("#frm_inp input[name=onintmonth]:hidden").val();
				var intmonth = $("#frm_inp input[name=intmonth]:hidden").val();
				if (cardinstmon == "2") {
					if (onintmonth.indexOf(cardinstmon) == 0) {
						cardinst = "02";
					} else {
						cardinst = "03";
					}
				} else {
					if (onintmonth.indexOf(cardinstmon) > -1) {
						cardinst = "02";
					} else {
						cardinst = "03";
					}
				}
			}
			$("#frm_inp input[name=rdo_cardinst]:radio[value='" + cardinst + "']").prop("checked", true)

			totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
			bankno = "";
			onlineacctname = "";
			reg_no1 = "";
			reg_no2 = "";

			if (totsttlamt < 10) {
				alert('10원 이상 결제 시 신용카드 사용이 가능합니다.');
				return;
			} else if ($.trim(iscmcd) == '' && paytype == PAYTYPE_CODE_CARD) {
				alert('카드 종류를 선택해주세요.');
				return;
			} else if (paytype == PAYTYPE_CODE_LPAY) {
				if ($(".box_Lpay_agree_check").css("display") != "none" && $(".box_Lpay_agree_check div a").css("display") != "none") {
					alert('L.pay 결제수단을 먼저 등록해주세요.');
					return;
				} else if ($.trim(iscmcd) == '') {
					alert('카드 종류를 선택해주세요.');
					return;
				}
			} else if (totsttlamt > 300000 && (varUa < 0) && cp_schema == 'mlotte003' && $.trim(iscmcd) != paytype_card_048 && $.trim(iscmcd) != paytype_card_029 && $.trim(iscmcd) != paytype_card_016 && $.trim(iscmcd) != paytype_card_026 && $.trim(iscmcd) != paytype_card_047 && $.trim(iscmcd) != paytype_card_002 && $.trim(iscmcd) != paytype_card_054 && $.trim(iscmcd) != paytype_card_021 && $.trim(iscmcd) != paytype_card_020 && $.trim(iscmcd) != paytype_card_008) { // 아이패드 : 롯데/신한/현대/국민/BC/삼성/광주/우체국 카드/농협 외 30만원 결제 불가 처리
				// 30만원 이상 결제시 안내처리
				if ($("#frm_inp input[name=rdo_paytype]:radio").length > 1) {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				} else {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				}
			} else if (totsttlamt > 300000 && (varUa < 0) && $.trim(iscmcd) != paytype_card_048 && $.trim(iscmcd) != paytype_card_029 && $.trim(iscmcd) != paytype_card_016 && $.trim(iscmcd) != paytype_card_026 && $.trim(iscmcd) != paytype_card_047 && $.trim(iscmcd) != paytype_card_031 && $.trim(iscmcd) != paytype_card_002 && $.trim(iscmcd) != paytype_card_054 && $.trim(iscmcd) != paytype_card_021 && $.trim(iscmcd) != paytype_card_020 && $.trim(iscmcd) != paytype_card_008 && $.trim(iscmcd) != paytype_card_018 && $.trim(iscmcd) != paytype_card_036) { // 아이폰 및 웹 : 롯데/신한/현대/국민/BC/광주/우체국 카드/농협 외 30만원 결제 불가 처리
				// 30만원 이상 결제시 안내처리
				if ($("#frm_inp input[name=rdo_paytype]:radio").length > 1) {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 삼성, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				} else {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 비씨, 삼성, 광주, 우체국카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				}
			} else if (totsttlamt > 300000 && $.trim(iscmcd) != paytype_card_048 && $.trim(iscmcd) != paytype_card_029 && $.trim(iscmcd) != paytype_card_016 && $.trim(iscmcd) != paytype_card_026 && $.trim(iscmcd) != paytype_card_020 && $.trim(iscmcd) != paytype_card_047 && $.trim(iscmcd) != paytype_card_031 && $.trim(iscmcd) != paytype_card_002 && $.trim(iscmcd) != paytype_card_054 && $.trim(iscmcd) != paytype_card_021 && $.trim(iscmcd) != paytype_card_008 && $.trim(iscmcd) != paytype_card_018 && $.trim(iscmcd) != paytype_card_036) { // 롯데/신한/현대/국민/삼성/BC/하나SK/광주/우체국 카드/농협 외 30만원 결제 불가 처리
				// 30만원 이상 결제시 안내처리
				if ($("#frm_inp input[name=rdo_paytype]:radio").length > 1) {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 삼성, 비씨, 하나SK, 광주, 우체국 카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				} else {
					alert('결제금액이 30만원 이상인 경우는 롯데, 신한, 현대, 국민, 삼성, 비씨, 하나SK, 광주, 우체국 카드만 가능합니다. 그 외 카드는 무통장입금으로 결제하시거나 고객센터(' + exp_tel_no + ')로 전화주세요.');
					return;
				}
			} else if (totsttlamt > 300000 && (varUa < 0) && cp_schema == 'mlotte001' && $.trim(iscmcd) == paytype_card_031 && cp_schema != '' && cp_udid != '' && !appVerChk(cp_v, '133')) { // 삼성카드 결제 시
				alert('롯데닷컴 앱에서 삼성카드 30만원 이상 결제를 하시려면 롯데닷컴 최신버전 앱으로 업데이트 해주세요.');
				return;
			} else if (totsttlamt > 300000 && (varUa > -1) && $.trim(iscmcd) == paytype_card_047 && cp_schema == 'mlotte001' && cp_udid != '' && !appVerChk(cp_v, '160')) { // 롯데카드 결제 시
				alert('롯데닷컴 앱에서 롯데카드 30만원 이상 결제를 하시려면 롯데닷컴 최신버전 앱으로 업데이트 해주세요.');
				return;
			} else if (totsttlamt > 300000 && (varUa > -1) && $.trim(iscmcd) == paytype_card_031 && cp_schema == 'mlotte001' && cp_udid != '' && !appVerChk(cp_v, '164')) { // 삼성카드 결제 시
				alert('롯데닷컴 앱에서 삼성카드 30만원 이상 결제를 하시려면 롯데닷컴 최신버전 앱으로 업데이트 해주세요.');
				return;
			} else if (cardinst != '01' && $.trim(cardinstmon) == '') { // 일시불이 아니면서 할부기간이 선택안된경우
				alert('할부기간을 선택해주세요.');
				return;
			}

			/*청구할인 추가S*/
			if ($("#frm_inp input[name=select_card_payment_yn]:hidden").val() == "Y") {
				if (!confirm("선택하신 카드로 청구할인이 불가능한 상품이 있어 청구할인이 적용되지 않습니다. 계속 결제 하시겠습니까?")) {
					return;
				}
			}
			/*청구할인 추가E*/

		} else if (paytype == PAYTYPE_CODE_BANK) {
			iscmcd = "";
			cardinst = "";
			cardinstmon = "";
			bankno = $("#frm_inp select[name=bankno]").val();
			onlineacctname = $("#frm_inp input[name=onlineacctname]").val();
			reg_no1 = "";
			reg_no2 = "";

			if ($.trim(bankno) == '') {
				alert('입금 은행을 선택해주세요.');
				return;
			} else if ($.trim(onlineacctname) == '') {
				alert('입금자이름을 입력해주세요.');
				$("#frm_inp input[name=onlineacctname]").focus();
				return;
			}
		} else if (paytype == PAYTYPE_CODE_PHONE) {
			iscmcd = "";
			cardinst = "";
			cardinstmon = "";
			bankno = "";
			onlineacctname = "";
			reg_no1 = $("#frm_inp input[name=reg_no1]").val();
			reg_no2 = $("#frm_inp input[name=reg_no2]").val();
		} else if (paytype == PAYTYPE_CODE_NAVERPAY) { //네이버페이
			if (totsttlamt < 100) {
				alert("네이버페이는 100원 이상만 결제 가능합니다.");
				return;
			}
			iscmcd = "";
			cardinst = "";
			cardinstmon = "";
			bankno = "";
			onlineacctname = "";
			reg_no1 = "";
			reg_no2 = "";
		} else if (typeof ($("#pntOnlyPay").val()) != undefined && $("#pntOnlyPay").val() == '19') {
			alert("L.POINT 전용 상품입니다. \n현재 보유하고 계신 L.POINT가 부족하여 주문을 진행 하실 수 없습니다.");
			return;
		} else if (typeof ($("#pntOnlyPay").val()) != undefined && $("#pntOnlyPay").val() == '21') {
			alert("L-money 전용 상품입니다. \n현재 보유하고 계신L-money가 부족하여 주문을 진행 하실 수 없습니다.");
			return;
		} else {
			alert('결제수단을 선택해주세요.');
			return;
		}

		$("#frm_send input[name=paytype]:hidden").val(paytype);
		$("#frm_send input[name=iscmcd]:hidden").val(iscmcd);
		$("#frm_send input[name=cardinst]:hidden").val(cardinst);
		$("#frm_send input[name=cardinstmon]:hidden").val(cardinstmon);
		$("#frm_send input[name=bankno]:hidden").val(bankno);
		$("#frm_send input[name=onlineacctname]:hidden").val(onlineacctname);
		$("#frm_send input[name=reg_no1]:hidden").val(reg_no1); // 주민등록번호
		$("#frm_send input[name=reg_no2]:hidden").val(reg_no2); // 주민등록번호			
		if (paytype == PAYTYPE_CODE_LPAY) {
			$("#frm_send input[name=lpay_card_id]:hidden").val($("select[name=iscmcd]").find("option:selected").attr("data-card-id")); // 고객 보유 카드 ID
			$("#frm_send input[name=lpay_card_anm]:hidden").val($("select[name=iscmcd]").find("option:selected").attr("data-card-anm")); // 고객 보유 카드명(닉네임)
		}
	} else {
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
	lpoint_amt = ($("#lpoint_amt").prop("id") == undefined ? 0 : (($("#lpoint_amt").val()).length < 1 ? 0 : $("#lpoint_amt").val())); // 2011.05.23 L_포인트
	lt_point_amt = ($("#lt_point_amt").prop("id") == undefined ? 0 : (($("#lt_point_amt").val()).length < 1 ? 0 : $("#lt_point_amt").val())); // 2011.05.23 롯데포인트
	deposit_amt = ($("#deposit_amt").prop("id") == undefined ? 0 : (($("#deposit_amt").val()).length < 1 ? 0 : $("#deposit_amt").val())); // 2011.05.23 보관금
	//		soil_point_amt  = ($("#soil_point_amt").prop("id")==undefined?"":(($("#soil_point_amt").val()).length<1?0:$("#soil_point_amt").val())); // 2013.05.07 Soil포인트

	var chk_arr = new Array();
	var pay_cd_arr = new Array();
	var pay_amt_arr = new Array();
	// 선택된 내역
	$.each($("#frm_inp input:checkbox[name=chk_point]:checked"), function () {
		chk_arr.push($(this).val());

		if ($(this).val() == "lpoint") { // L-money
			pay_cd_arr.push(lPoint);
			pay_amt_arr.push(lpoint_amt);

		}

		if ($(this).val() == "lt_point") { // 롯데포인트
			pay_cd_arr.push(ltPoint);
			pay_amt_arr.push(lt_point_amt);
		}

		/*				if($(this).val()=="soil_point"){ // S-oil포인트
							pay_cd_arr.push(soilPoint);
							pay_amt_arr.push(soil_point_amt);
						}*/
	});

	var chk_arr_all = new Array();
	// 모두선택된 내역
	$.each($("#frm_inp input:checkbox[name=chk_point_all]:checked"), function () {
		chk_arr_all.push($(this).val());

		if ($(this).val() == "deposit") { // 보관금
			pay_cd_arr.push(deposit);
			pay_amt_arr.push(deposit_amt);
		}
	});

	chk_point = chk_arr.join();
	pay_mean_cd = pay_cd_arr.join();
	pay_amt = pay_amt_arr.join();
	chk_point_all = chk_arr_all.join();

	$("#frm_send input[name=lpoint_amt]:hidden").val(lpoint_amt);
	$("#frm_send input[name=lt_point_amt]:hidden").val(lt_point_amt);
	$("#frm_send input[name=deposit_amt]:hidden").val(deposit_amt);
	//		$("#frm_send input[name=soil_point_amt]:hidden").val( soil_point_amt );
	$("#frm_send input[name=chk_point]:hidden").val(chk_point);
	$("#frm_send input[name=chk_point_all]:hidden").val(chk_point_all);
	$("#frm_send input[name=pay_mean_cd]:hidden").val(pay_mean_cd);
	$("#frm_send input[name=pay_amt]:hidden").val(pay_amt);

	// 무료배송권 정보
	var dlv_prom_use_yn, dlv_fvr_val, dlv_prom_no, dlv_rsc_mgmt_sn
	dlv_prom_use_yn = $("#dlv_prom_use_yn").val(); // 무료배송권사용여부

	if (dlv_prom_use_yn == "Y") {
		dlv_fvr_val = $("#dlv_fvr_val").val(); // 무료배송권금액
		dlv_prom_no = $("#dlv_prom_no").val(); // 무료배송권 프로모션번호
		dlv_rsc_mgmt_sn = $("#dlv_rsc_mgmt_sn").val(); // 무료배송권 자원관리일련번호
	} else {
		dlv_fvr_val = "";
		dlv_prom_no = "";
		dlv_rsc_mgmt_sn = "";
	}

	$("#frm_send input[name=dlv_prom_use_yn]:hidden").val(dlv_prom_use_yn);
	$("#frm_send input[name=dlv_fvr_val]:hidden").val(dlv_fvr_val);
	$("#frm_send input[name=dlv_prom_no]:hidden").val(dlv_prom_no);
	$("#frm_send input[name=dlv_rsc_mgmt_sn]:hidden").val(dlv_rsc_mgmt_sn);

	// 총결제금액
	$("#frm_send input[name=totsttlamt]:hidden").val(totsttlamt);

	// 카드결제정보 설정
	$("#frm_card input[name=X_CARDTYPE]:hidden").val(iscmcd);
	$("#frm_card input[name=X_AMOUNT]:hidden").val(totsttlamt);
	if (totsttlamt > 300000 && (iscmcd == paytype_card_048 || iscmcd == paytype_card_029)) { // 신한/현대카드 30만원 이상 결제
		$("#frm_card input[name=X_ISMART_USE_SIGN]:hidden").val("Y");

		if (lotte_app_yn == 'Y' || smart_pic_app_yn == 'Y' || ellotte_app_yn == 'Y') { // ellotte_yhchoi9
			$("#frm_card input[name=X_MALL_APP_NAME]:hidden").val(schema_domain);
		}
	} else {
		$("#frm_card input[name=X_ISMART_USE_SIGN]:hidden").val("");
		$("#frm_card input[name=X_MALL_APP_NAME]:hidden").val("");
	}

	// 롯데카드 정보				
	if (iscmcd == paytype_card_047) { // 롯데카드
		$("#SIMPLEPAYFORM input[name=order_amount]:hidden").val(totsttlamt);
		$("#SIMPLEPAYFORM input[name=order_cardname]:hidden").val("LOTTECARD");
	}

	// 현금영수증 (무통장입금, L-money, 보관금)
	if (paytype == PAYTYPE_CODE_BANK || paytype == PAYTYPE_CODE_NAVERPAY || (lpoint_amt != "" && lpoint_amt > 0) || (deposit_amt != "" && deposit_amt > 0)) {

		var cr_issu_mean_sct_cd = $("#frm_inp select[name=cr_issu_mean_sct_cd]").val();
		var cash_cd = $("#frm_inp input[name=rdo_cash]:radio:checked").val();
		var tmp_val = "";
		var cash_val = "";
		var max_length = 0;
		var title = "";
		var bool_send = true;

		if (cash_cd == "1") { // 소득공제
			$("#frm_send input[name=cr_issu_mean_sct_cd]:hidden").val(cr_issu_mean_sct_cd);
			$("#frm_send input[name=cr_use_sct_cd]:hidden").val("0");

			var cash_id = "cash_receipts0";

			if (cr_issu_mean_sct_cd == "1") {
				cr_issu_mean_sct_cd = "2";
			}

			if (cr_issu_mean_sct_cd == "3") {
				cash_val = $("#frm_inp select[name=cr_issu_mean_no_phone1]").val();
			}

			$("#cash_receipts0" + cr_issu_mean_sct_cd + " input").each(function () {
				max_length = $(this).attr("maxlength");
				title = $(this).attr("title");
				tmp_val = $(this).val();
				tmp_str = " 이상";

				if ($(this).attr("name") == "cr_issu_mean_no_credit_crd4") { // 신용카드 마지막 자리 수는 3자리 이상 되도록
					max_length = 3;
				} else if ($(this).attr("name") == "cr_issu_mean_no_rcpt_crd4") { // 현금영수증 카드 마지막 자리 수는 1자리 이상 되도록
					max_length = 1;
				} else if ($(this).attr("name") == "cr_issu_mean_no_phone2") { // 휴대전화 중간자리 3자리 이상 되도록
					max_length = 3;
				} else {
					tmp_str = "로";
				}

				if (tmp_val.length < max_length) {
					alert(title + "를 " + max_length + "자리" + tmp_str + " 입력해 주세요.");
					$(this).focus();
					bool_send = false;
					return false;
				}

				cash_val += tmp_val;
			});
			$("#frm_send input[name=cr_issu_mean_no]:hidden").val(cash_val);
		} else if (cash_cd == "2") { // 지출증빙용
			$("#frm_send input[name=cr_issu_mean_sct_cd]:hidden").val($("#frm_inp input[name=cr_issu_mean_sct_cd_bman]:hidden").val());
			$("#frm_send input[name=cr_use_sct_cd]:hidden").val("1");
			$("#co_value input").each(function () {
				max_length = $(this).attr("maxlength");

				if (max_length > 1) {
					title = $(this).attr("title");
					tmp_val = $(this).val();

					if (tmp_val.length < max_length) {
						alert(title + "를 " + max_length + "자리로 입력해 주세요.");
						$(this).focus();
						bool_send = false;
						return false;
					}
					cash_val += tmp_val;
				}
			});
			num1 = cash_val.charAt(0);
			num2 = cash_val.charAt(1);
			num3 = cash_val.charAt(2);
			num4 = cash_val.charAt(3);
			num5 = cash_val.charAt(4);
			num6 = cash_val.charAt(5);
			num7 = cash_val.charAt(6);
			num8 = cash_val.charAt(7);
			num9 = cash_val.charAt(8);
			num10 = cash_val.charAt(9);

			var total = (num1 * 1) + (num2 * 3) + (num3 * 7) + (num4 * 1) + (num5 * 3) + (num6 * 7) + (num7 * 1) + (num8 * 3) + (num9 * 5);
			total = total + parseInt((num9 * 5) / 10);
			var tmp = total % 10;
			if (tmp == 0) {
				var num_chk = 0;
			} else {
				var num_chk = 10 - tmp;
			}
			if (num_chk != num10) {
				alert("사업자등록번호가 올바르지 않습니다.");
				$("#frm_inp input[name=cr_issu_mean_no_bman1]").focus();
				bool_send = false;
				return false;
			}

			$("#frm_send input[name=cr_issu_mean_no]:hidden").val(cash_val);
		} else { // 선택안함
			$("#frm_send input[name=cr_issu_mean_sct_cd]:hidden").val("");
			$("#frm_send input[name=cr_use_sct_cd]:hidden").val("");
			$("#frm_send input[name=cr_issu_mean_no]:hidden").val(cash_val);
		}

		if (!bool_send) {
			return;
		}
	}

	//L.POINT 비밀번호 입력 레이어
	if ($("#frm_inp input[name=paytype]:hidden").val() != PAYTYPE_CODE_LPAY && $("#frm_send input[name=lt_cd_no]").val() == "" && simple_mem_yn != "Y" &&
		$("#temp_lt_point_amt").length > 0 && $("#temp_lt_point_amt").val() != "" && $("#temp_lt_point_amt").val() != "0") {
		$("html, body").animate({
			scrollTop: $("#submit_btn").offset().top
		}, function () {
			$("#laver_Lpay_order").show();
		});
		return;
	}

	//이쿠폰 환불주체 변경 관련 추가
	if ($("#chk_smp_ecpn_gift_yn").length > 0) {
		$("#frm_send input[name=smp_ecpn_gift_yn]:hidden").val(($("#chk_smp_ecpn_gift_yn").val()));
	}
	if ($("#smp_ecpn_rfd_tgt").length > 0) {

		if ($("#smp_ecpn_rfd_tgt_cd_01").attr("checked") == true || $("#smp_ecpn_rfd_tgt_cd_01").prop("checked") == true) {
			$("#frm_send input[name=smp_ecpn_rfd_tgt_cd]:hidden").val(($("#smp_ecpn_rfd_tgt_cd_01").val()));
		} else if ($("#smp_ecpn_rfd_tgt_cd_02").attr("checked") == true || $("#smp_ecpn_rfd_tgt_cd_02").prop("checked") == true) {
			$("#frm_send input[name=smp_ecpn_rfd_tgt_cd]:hidden").val(($("#smp_ecpn_rfd_tgt_cd_02").val()));
		} else {
			$("#frm_send input[name=smp_ecpn_rfd_tgt_cd]:hidden").val("");
		}
	}

	/* 20170607 결재 모니터링 로그 등록 처리  */
	regOpOrdPayErrLog(); // 결재 모니터링 로그 등록

	doXansim();
}


//결재 모니터링 로그 등록
function regOpOrdPayErrLog() {

	var paytype = $("#frm_send input[name=paytype]:hidden").val();
	var pay_mean_cd = $("#frm_send input[name=pay_mean_cd]:hidden").val();

	var non_login_id = ""; // 비회원번호
	var grockle_mbr_no = $("#frm_send input[name=grockle_mbr_no]:hidden").val(); // 비회원구매
	var iscmcd = "";
	//결재수단이 신용카드 일때만 발급스코드 입력
	if (paytype == '16') {
		iscmcd = $("#frm_send input[name=iscmcd]:hidden").val(); // 발급사코드	 
	}

	// 비회원이고 비회원번호가 존재 시
	if (grockle_yn == 'Y' && grockle_mbr_no != '') {
		non_login_id = grockle_mbr_no;
	}

	$.ajax({
		type: 'post',
		async: false,
		url: '/order/order_regordpay.do?' + __commonParam,
		data: 'pay_mean_cd=' + pay_mean_cd + '&paytype=' + paytype + '&iscmcd=' + iscmcd + '&non_login_id=' + non_login_id + '&grockle_yn=' + grockle_yn,
		success: function (response) {

			$("#cardinscheck").html(response);
		},
		error: function (request, status, err) {
			//결재 로그 등록 실패
		}
	});

}

// 하나SK 결제
function hanaskcard_payment() {
	var iscmcd = $("#frm_send input[name=iscmcd]:hidden").val();
	var vp_cardcode = "hanaM";
	var vp_quota = $("#frm_send input[name=cardinstmon]:hidden").val(); // 할부개월
	var vp_quota_flag = ($("#frm_send input[name=cardinst]:hidden").val() == "02" ? "Y" : "N"); // 무이자여부
	var vp_price = $("#frm_send input[name=totsttlamt]:hidden").val(); //결제금액	
	var vp_goodname = $("#frm_send input[name=goodsnm]:hidden").val(); //상품명
	var goods_unit = vp_goodname.split(split_gubun_1);

	if (goods_unit.length > 1) {
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
function payment_pop_position() {
	$("#ANSIM_LAYER").css("top", "3px");
	window.scrollTo(0, 0); // 안심레이어 위치 지정
}

function doXansim() {
	paytype = $("#frm_send input[name=paytype]:hidden").val();
	pay_mean_cd = $("#frm_send input[name=pay_mean_cd]:hidden").val();
	cardkndcd = $("#frm_send input[name=cardkndcd]:hidden").val();
	cardkndcd_dup = $("#frm_send input[name=cardkndcd_dup]:hidden").val();

	$("#frm_send input[name=credit_crd_gb]:hidden").val(""); // ISP, MPI 구분

	disableItems(true);

	if (paytype == PAYTYPE_CODE_LPAY) { // L.pay WEB : 결제
		$("#frm_lpay input[name=req_div]:hidden").val("pay_req"); // 결제요청

		fn_LpayIframeSet(); // L.pay WEB : iframe 설정

		var lpay_param = ["goodsno", "lt_point_amt", "totsttlamt", "iscmcd", "cardinst", "cardinstmon", "lpay_card_id", "lpay_card_anm", "giftyn", "prommdclcd", "ordr_nm", "ordr_cell_no"];
		for (var i = 0; i < lpay_param.length; i++) { // 파라메터 셋팅
			$("#frm_lpay input[name=" + lpay_param[i] + "]:hidden").val($("#frm_send input[name=" + lpay_param[i] + "]:hidden").val());
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
	} else if (paytype == PAYTYPE_CODE_CARD) { // 결제 수단이 카드
		X_CARDTYPE = $("#frm_card input[name=X_CARDTYPE]:hidden").val();

		if (X_CARDTYPE == paytype_card_047 ||
			X_CARDTYPE == paytype_card_029 ||
			X_CARDTYPE == paytype_card_031 ||
			X_CARDTYPE == paytype_card_048 ||
			X_CARDTYPE == paytype_card_020 ||
			X_CARDTYPE == paytype_card_008 ||
			X_CARDTYPE == paytype_card_036 ||
			X_CARDTYPE == paytype_card_018
		) { // MPI
			payment_pop_position(); // 결제 레이어팝업 위치 지정

			$("#ANSIM_LAYER").css("width", "100%");
			$("#ANSIM_LAYER").css("height", "530px");
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

		var lotte_hist_card_pay_meth_cd = $("#frm_inp input[name=lotte_hist_card_pay_meth_cd]").val(); //카드 방식 결제코드 이력

		if (X_CARDTYPE == paytype_card_047) { // 롯데카드
			if (pay_confirm_type == "01" && lotte_hist_card_pay_meth_cd == "11") { // 모바일결제
				$("#frm_send input[name=smart_pay_use_yn]").val("Y");
				lottecard_payment('SPSA');
			} else if (pay_confirm_type == "01" && lotte_hist_card_pay_meth_cd == "01") { // 인터넷결제(간편)
				$("#frm_send input[name=smart_pay_use_yn]").val("Y");
				lottecard_payment('SPSW');
			} else if (pay_confirm_type == "02" && lotte_hist_card_pay_meth_cd == "02") { // 모바일결제
				lottecard_payment('ACSW');
			} else if (pay_confirm_type == "02" && lotte_hist_card_pay_meth_cd == "22") { // 인터넷결제(일반)
				lottecard_payment('ACSA');
			} else if (pay_confirm_type == "03") { // 앱결제
				// lottecard_payment('APC'); // 롯데카드사에서 개발하지 않음
				lottecard_payment('MAPC');
			} else if (pay_confirm_type == "04") { // 페이서비스
				lottecard_payment('ALP');
			} else if (pay_confirm_type == "99") { // 다른결재방식 선택
				lottecard_payment('');
			}
		} else if (X_CARDTYPE == paytype_card_029 ||
			X_CARDTYPE == paytype_card_031 ||
			X_CARDTYPE == paytype_card_048 ||
			X_CARDTYPE == paytype_card_018
		) { // MPI (NH, 신한, 삼성, 현대)

			window.scrollTo(0, 0); // 안심레이어 위치 지정

			// 현대/신한/삼성 결제 인증 구분
			if (iscmcd != paytype_card_018) {
				if (pay_confirm_type == "01") { // 스마트페이(간편결제)
					$("#frm_send input[name=smart_pay_use_yn]").val("Y");
					$("#frm_card input[name=X_SP_CHAIN_CODE]:hidden").val("1");
				} else if (pay_confirm_type == "03") { // 앱카드
					$("#frm_card input[name=X_SP_CHAIN_CODE]:hidden").val("3");
				} else { // 안심결제
					$("#frm_card input[name=X_SP_CHAIN_CODE]:hidden").val("0");
				}
			}

			xmpi_exec(); // xmpi 실행
		} else if (X_CARDTYPE == paytype_card_016 &&
			(cp_udid == '' ||
				(cp_udid != '' && varUa > -1 && cp_schema == 'mlotte001' && appVerChk(cp_v, '169')) ||
				(cp_udid != '' && varUa < 0 && ua_lower_str.search("iphone") > -1 && appVerChk(cp_v, '136')) ||
				(cp_udid != '' && varUa < 0 && ua_lower_str.search("ipad") > -1 && appVerChk(cp_v, '127')) ||
				smart_pic_app_yn == 'Y' ||
				ellotte_app_yn == 'Y' ||
				cp_schema == 'sklotte001'
			)
		) {
			payment_pop_position(); // 결제 레이어팝업 위치 지정

			$("#ANSIM_LAYER").css("width", "350px");
			$("#ANSIM_LAYER").css("height", "530px");
			window.scrollTo(0, 0); // 안심레이어 위치 지정
			$("#ANSIM_LAYER").show();
			$("#X_ANSIM_FRAME").show();

			spay_exec(); // spay 실행 (KBApp Card)
		} else if (X_CARDTYPE == paytype_card_016 ||
			X_CARDTYPE == paytype_card_021 ||
			X_CARDTYPE == paytype_card_054 ||
			X_CARDTYPE == paytype_card_002
		) { // mISP (KB국민, 비씨, 우체국체크, 광주)

			if (confirm("국민,광주,우체국체크카드(ISP) 결제는 3G 또는 LTE로 진행 해야 안정적으로 결제하실 수 있습니다.\n결제를 진행하시겠습니까?")) {
				$("#frm_send input[name=credit_crd_gb]:hidden").val("1"); // ISP

				misp_create_data();
			} else {
				disableItems(false);
			}
		} else if (X_CARDTYPE == paytype_card_026) {
			$("#frm_send input[name=credit_crd_gb]:hidden").val("1"); // ISP
			misp_create_data();
		} else if (X_CARDTYPE == paytype_card_020) { // 하나SK
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

	} else if (paytype == PAYTYPE_CODE_BANK) { // 결제 수단이 인터넷뱅킹
		bankno = $("#frm_send input[name=bankno]:hidden").val();
		onlineacctname = $("#frm_send input[name=onlineacctname]:hidden").val();

		if ($.trim(bankno) == '' ||
			$.trim(onlineacctname) == '') {
			disableItems(false);
			alert('무통장 입금 정보가 부정확합니다.\n다시 시도해 주십시오.');
		} else {
			$("#frm_send").attr("action", "/order/order_complete.do?" + __commonParam);
			doPayment();
		}
	} else if (paytype == PAYTYPE_CODE_PHONE) { // 결제 수단이 휴대폰결제
		//$("#frm_send").attr("action","/order/cellphone_confirm.do?" + __commonParam);
		//doPayment();
		payment_pop_position(); // 결제 레이어팝업 위치 지정

		$("#ANSIM_LAYER").css("width", "380px");
		$("#ANSIM_LAYER").css("height", "800px");
		window.scrollTo(0, 0); // 안심레이어 위치 지정
		$("#ANSIM_LAYER").show();
		$("#X_ANSIM_FRAME").show();

		cellphone_exec(); // 휴대폰 소액결제 실행
	} else if ((paytype != PAYTYPE_CODE_CARD && paytype != PAYTYPE_CODE_LPAY) && (cardkndcd != '' || cardkndcd_dup != '')) { // 카드결제 아니면서 카드할인/적립을 선택한 경우
		disableItems(false);
		alert("카드외 다른 결제방법 사용 시 카드할인 및 적립을 할 수 없습니다.");
	} else if (paytype == PAYTYPE_CODE_NAVERPAY) { // 결제 수단이 네이버페이
		$("#frm_send").attr("action", "/order/insertTempOrderInfoNaverPay.do?" + __commonParam);
		doPayment();
	} else if (paytype == '' && pay_mean_cd != '') { // 주결제 수단 없이 아닌 포인트로 모두 결제 시
		if (pay_mean_cd.indexOf(ltPoint) != -1 && $("#frm_send input[name=lt_cd_no]").val() == "") {
			disableItems(false);
			$("html, body").animate({
				scrollTop: $("#submit_btn").offset().top
			}, function () {
				$("#laver_Lpay_order").show();
			});
		} else {
			$("#frm_send").attr("action", "/order/order_complete.do?" + __commonParam);
			doPayment();
		}
	} else {
		disableItems(false);
		alert("지원되지 않는 결제방법 입니다.\n다시 시도해 주십시오.");
	}
}

function openLotteMembers() {
	alert('롯데멤버스 페이지로 이동합니다.\n비밀번호를 설정하시면\n롯데닷컴에서 L.POINT를 사용하실 수 있습니다.');
	var url = "m.lpoint.com/app/point/WMPA100100.do";
	if (cp_schema != "") { //app일경우
		if (isIOS) { //아이폰일경우
			window.location = "family://" + url;
		} else if (isAndroid) { //안드로이드일경우
			window.myJs.callAndroid("https://" + url);
		}
	} else {
		window.open("https://" + url);
	}
}

function make_certification() {
	//confirm_end(); // local 테스트용.

	if ($("input[name=third_coupon]:radio:checked").val() == '0') {
		alert("L.POINT를 사용하시려면 일시불할인을 해제해주세요.");
		return;
	}

	var card_no1;
	var card_no2;
	var card_no3;
	var card_no4;
	var passwd;
	passwd = $("#card_passwd").val();

	if (passwd.length < 1) {
		alert("카드 비밀번호를 입력해 주세요.");
		return;
	}
	var card_no = card_no1 + card_no2 + card_no3 + card_no4;


	$.ajax({
		type: 'post',
		async: false,
		url: '/popup/lotte_point_mng.do?' + __commonParam,
		data: 'card_no=' + card_no + '&passwd=' + passwd + '&from_page=' + from_page + '&page_div=R&proc_div=P',
		success: function (response) {
			$("#LottePoint_Result_div").html(response);
			if ($("#temp_lt_point_amt").val() != "" && $("#temp_lt_point_amt").val() != "0") {
				$("#lt_point_amt").val($("#temp_lt_point_amt").val());
				fn_calcTotalPrice();
			}
		}
	});
}

// 2011.05.20 포인트 관련 함수 추가
function fn_selPoint(obj) {
	var obj_id = obj.id;

	if (obj.checked) {
		var totsttlamt = parseInt($("#frm_inp input[name=totsttlamt]:hidden").val());
		var useable_amt = 0;

		if (totsttlamt == 0) // 결제금액이 없는데  선택 할 경우
		{
			obj.checked = false;
			return;
		}

		if (obj_id == 'chk_lpoint') { // L_포인트
			//일시불할인 적용 되었을 경우 얼럿				
			if ($("input[name=third_coupon]:radio:checked").val() == '0') {
				alert("L-money를 사용하시려면 일시불할인을 해제해주세요.");
				obj.checked = false;
				return;
			}
			$("#cash_receipts").show(); // 현금영수증 영역 보이기

			useable_amt = parseInt($("#useable_lpoint_amt").val());
			//useable_amt = (Math.floor(useable_amt/10)) * 10; // 10원이하 절사

			$("#lpoint_amt").val((totsttlamt < useable_amt ? totsttlamt : useable_amt));
			$("#lpoint_amt").attr("disabled", false);
			$("#chk_lpoint_all").attr("disabled", false);
			$("#chk_lpoint_all").attr("checked", true);
			$("#chk_lpoint_all").prop("checked", true);
			sendTclick('order_Clk_Btn_2');

		} else if (obj_id == 'chk_lt_point') { // 롯데포인트
			useable_amt = parseInt($("#useable_lt_point_amt").val());
			//useable_amt = (Math.floor(useable_amt/10)) * 10; // 10원이하 절사

			if ($("#temp_lt_point_amt").val() != "" && $("#temp_lt_point_amt").val() != "0") {
				$("#lt_point_amt").val($("#temp_lt_point_amt").val());
			} else {
				$("#lt_point_amt").val((totsttlamt < useable_amt ? totsttlamt : useable_amt));
			}

			$("#lt_point_amt").attr("disabled", false);
			$("#chk_lt_point_all").attr("disabled", false);
			$("#chk_lt_point_all").attr("checked", true);
			$("#chk_lt_point_all").prop("checked", true);
			sendTclick('order_Clk_Btn_3');

		}
		/*			else if (obj_id == 'chk_soil_point'){ // S-oil포인트		
						if (soilPointSearch == "N"){ // 포인트 조회 하지 않은 경우		
							alliancePointUse("S"); // s-oil 포인트 조회
						}				
						useable_amt = parseInt($("#useable_soil_point_amt").val());
						//useable_amt = (Math.floor(useable_amt/10)) * 10; // 10원이하 절사
						
						//$("#soil_point_amt").val((totsttlamt<useable_amt?totsttlamt:useable_amt));
						$("#soil_point_amt").attr("disabled", false);
						$("#chk_soil_point_all").attr("disabled", false);
						//$("#chk_soil_point_all").attr("checked", true);
					}*/
		else if (obj_id == 'chk_deposit_all') { // 보관금
			sendTclick('order_Clk_Btn_4');
		}
	} else {
		if (obj_id == 'chk_lpoint') { // L_포인트
			fn_initPointList(lPoint);
		} else if (obj_id == 'chk_lt_point') {
			fn_initPointList(ltPoint);
		}
		/*			else if (obj_id == 'chk_soil_point'){
						fn_initPointList(soilPoint);				
					}*/
	}
	fn_calcTotalPrice();

	//20180704 포인트선택시 결제수단리셋
	init_cardselect();
	init_cardinstmon();

	// 보관금이 존재하고 체크 해제 할 경우 
	if (!obj.checked && $("#chk_deposit_all").attr("id") != undefined) {
		fn_selPointAll(document.getElementById("chk_deposit_all"));
	}
	setCashReceiptArea(); // 현금영수증 영역 컨트롤
}

// 할인, 배송비 및 포인트 선택에 따른 금액 변경
function fn_calcTotalPrice() {
	var totalPriceHtml = "";

	// TODO : 결제금액 계산 후 UI 구현
	prommdclcd = $("#frm_send input[name=prommdclcd]").val();
	dcamt = $("#frm_send input[name=totdcamt]").val();
	dup_cpn_amt = sessionStorage.getItem("fvr_val"); // 중복쿠폰 
	third_cpn_amt = $("#frm_send input[name=totdcamt_third]").val(); // 3차쿠폰
	prommdclcd_third = $("#frm_send input[name=prommdclcd_third]").val();
	cardkndcd = $("#frm_send input[name=cardkndcd]").val();
	payamt = $("#frm_inp input[name=defaulttotsttlamt]:hidden").val(); // 배송비가 합쳐 있는 금액
	includeSaveInstCpn = $("#frm_send input[name=includeSaveInstCpn]").val(); // 2011.05.19 적립여부

	lpoint_amt = ($("#lpoint_amt").prop("id") == undefined ? "" : (($("#lpoint_amt").val()).length < 1 ? 0 : $("#lpoint_amt").val())); // L_포인트
	lt_point_amt = ($("#lt_point_amt").prop("id") == undefined ? "" : (($("#lt_point_amt").val()).length < 1 ? 0 : $("#lt_point_amt").val())); // 롯데포인트
	deposit_amt = ($("#deposit_amt").prop("id") == undefined ? "" : (($("#deposit_amt").val()).length < 1 ? 0 : $("#deposit_amt").val())); // 보관금
	//		soil_point_amt  = ($("#soil_point_amt").prop("id")==undefined?"":(($("#soil_point_amt").val()).length<1?0:$("#soil_point_amt").val())); // S-oil포인트

	dlv_prom_use_yn = $("#dlv_prom_use_yn").val(); // 무료배송권 사용 여부

	//선물하기 2차
	var totOrdCnt = $("#goodsTotQty").val() * 1; //주문수량
	var oneSendChk = false; //한곳으로 보내기 여부

	//현재 보내는곳 1군데일 경우 선택 수량 맞지 않아도 한곳으로 보내기로 처리
	if (fn_getDeliCnt() == 1) {
		oneSendChk = true;
	}

	//여러곳으로 보내기일 경우 무료배송권 적용 불가
	if (dlv_prom_use_yn == 'Y' && totOrdCnt > 1 && !oneSendChk) {
		dlv_prom_use_yn = 'N';
	}

	dlv_fvr_val = (dlv_prom_use_yn == "Y" ? $("#dlv_fvr_val").val() : "0"); // 무료배송권 금액

	tot_deli_amt = 0; // 총배송비

	if (freeShippingYn == 'N') {
		tot_deli_amt = $("#frm_inp input[name=caltotdeliamt]:hidden").val(); // 계산된 총배송비
		/*	
			if ($("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")){ // 다중배송여부
				tot_deli_amt = $("#frm_inp input[name=caltotdeliamt]:hidden").val(); // 계산된 총배송비
			}else{
				tot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
			}
		*/
	}

	// 할인 인 경우만 금액 차감
	if (includeSaveInstCpn == 'Y') {
		totpayamt = payamt.toString(); //적립
	} else {
		totpayamt = (payamt - dcamt).toString(); //할인
	}

	// 배송비 적용
	if (freeShippingYn == 'N') { // 플래티넘 플러스가 아니면			
		totpayamt = (parseInt(totpayamt) + parseInt(tot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
	}

	// 참좋은혜택 합계 계산
	var totOrdAmt = totpayamt;
	if (includeSaveInstCpn != 'Y') {
		totOrdAmt = Number(totOrdAmt) + Number(dcamt);
	}
	$("#bene_tot_amt").find("span").text(String(totOrdAmt).money() + "원");
	$("#frm_inp input[name=totordamt]:hidden").val(totOrdAmt);
	$("#totalOrdAmt").html("<strong>" + String(totOrdAmt).money() + "</strong>원");


	//여러곳으로 보내기일 경우 중복쿠폰 적용 불가
	if (totOrdCnt > 1 && !oneSendChk) {
		dup_cpn_amt = 0;
	}

	// 중복쿠폰 사용
	if (dup_cpn_amt > 0) {
		totpayamt = (totpayamt - dup_cpn_amt).toString();
	}

	// 3차쿠폰 사용
	if (third_cpn_amt > 0) {
		totpayamt = (totpayamt - third_cpn_amt).toString();
	}

	// 무료배송권 사용 시
	if (dlv_prom_use_yn == "Y" && dlv_fvr_val > 0) {
		totpayamt = (totpayamt - dlv_fvr_val).toString();
	}

	// L_포인트 사용 시
	if (lpoint_amt > 0) {
		totpayamt = (totpayamt - lpoint_amt).toString();
	}

	// 롯데_포인트 사용 시
	if (lt_point_amt > 0) {
		totpayamt = (totpayamt - lt_point_amt).toString();
	}

	// 보관금 사용 시
	if (deposit_amt > 0) {
		totpayamt = (totpayamt - deposit_amt).toString();
	}

	// soil_포인트 사용 시
	/*		if (soil_point_amt > 0){
				totpayamt   = (totpayamt - soil_point_amt).toString();
			}
	*/
	prommdclcdNm = "";
	if (prommdclcd == adtn_cost_dtl_sct_cd_card) {

		if (cardkndcd == paytype_card_002) {
			prommdclcdNm = "광주";
		} else if (cardkndcd == paytype_card_008) {
			prommdclcdNm = "외환";
		} else if (cardkndcd == paytype_card_016) {
			prommdclcdNm = "KB국민";
		} else if (cardkndcd == paytype_card_018) {
			prommdclcdNm = "NH";
		} else if (cardkndcd == paytype_card_021) {
			prommdclcdNm = "우리";
		} else if (cardkndcd == paytype_card_020) {
			prommdclcdNm = "하나SK";
		} else if (cardkndcd == paytype_card_026) {
			prommdclcdNm = "비씨";
		} else if (cardkndcd == paytype_card_029) {
			prommdclcdNm = "신한";
		} else if (cardkndcd == paytype_card_031) {
			prommdclcdNm = "삼성";
		} else if (cardkndcd == paytype_card_036) {
			prommdclcdNm = "씨티";
		} else if (cardkndcd == paytype_card_047) {
			prommdclcdNm = "롯데";
		} else if (cardkndcd == paytype_card_048) {
			prommdclcdNm = "현대";
		} else if (cardkndcd == paytype_card_054) {
			prommdclcdNm = "우체국체크";
		}
		prommdclcdNm += "카드할인";
	} else if (prommdclcd == adtn_cost_dtl_sct_cd_coupon) {
		prommdclcdNm = "즉석쿠폰";
	} else if (prommdclcd == adtn_cost_dtl_sct_cd_staff) {
		prommdclcdNm = "임직원할인";
	} else if (prommdclcd == adtn_cost_dtl_sct_cd_mrktng_cpn) {
		prommdclcdNm = "쿠폰/쇼핑지원권";
	}

	// 배송비 적용
	$("#deli_amt_ul").show();
	$("#deli_amt_ul li").filter(".pr_text2").text(new String(tot_deli_amt).money() + "원");

	// 2014.12.24 모바일주문간소화 jjkim59
	var discountSum = 0;
	var pointSum = 0;

	// 할인 쿠폰 정보
	if (dcamt > 0 && includeSaveInstCpn == 'N') { // 할인금액만 체크하고 카드구분코드는 null 일 수도 있고 not null 일수도 있기때문에 조건에서 제거.
		totalPriceHtml += '<li class="pr_text1">' + prommdclcdNm + '</li>' +
			'<li class="pr_text2">(-)' + dcamt.money() + '원</li>';
		discountSum += parseInt(dcamt);
	}

	// 중복 쿠폰 정보
	if (dup_cpn_amt > 0) {
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">추가할인</li>' +
			'<li class="pr_text2">(-)' + dup_cpn_amt.money() + '원</li>';

		discountSum += parseInt(dup_cpn_amt);
	}

	// 3차 쿠폰 정보
	if (third_cpn_amt > 0) {
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">' + (prommdclcd_third == "35" ? '일시불할인' : '') + '</li>' +
			'<li class="pr_text2">(-)' + third_cpn_amt.money() + '원</li>';

		discountSum += parseInt(third_cpn_amt);
	}

	// 무료배송권
	if (dlv_prom_use_yn == "Y" && dlv_fvr_val > 0) {
		discountSum += parseInt(dlv_fvr_val);
		$("#fdAmt").html("(<span class=tBold>-" + String(dlv_fvr_val).money() + "</span><span class=\"no_bold\">원</span>)");
	} else {
		$("#fdAmt").html("");
	}

	// 참좋은혜택 > 할인받은 금액 setting
	$("#bene_dctot_amt").html("<span class=tBold>" + (discountSum > 0 ? "-" : "") + String(discountSum).money() + "</span><span class=\"no_bold\">원</span>");

	// L_포인트 정보
	if (lpoint_amt > 0) {
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">L-money</li>' +
			'<li class="pr_text2">(-)' + lpoint_amt.money() + '점</li>';

		$("#old_lpoint_amt").val(lpoint_amt);

		discountSum += parseInt(lpoint_amt);
		pointSum += parseInt(lpoint_amt);
	} else if (lpoint_amt > -1) {
		$("#old_lpoint_amt").val(lpoint_amt);
	}

	// 롯데포인트 정보
	if (lt_point_amt > 0) {
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">L.POINT</li>' +
			'<li class="pr_text2">(-)' + lt_point_amt.money() + '점</li>';

		$("#old_lt_point_amt").val(lt_point_amt);

		if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_LPAY) {
			$("#temp_lt_point_amt").val(lt_point_amt);
		}

		discountSum += parseInt(lt_point_amt);
		pointSum += parseInt(lt_point_amt);
	} else if (lt_point_amt > -1) {
		$("#old_lt_point_amt").val(lt_point_amt);
	}

	// 보관금 정보
	if (deposit_amt > 0) {
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">보관금</li>' +
			'<li class="pr_text2">(-)' + deposit_amt.money() + '원</li>';

		$("#old_deposit_amt").val(deposit_amt);

		discountSum += parseInt(deposit_amt);
		pointSum += parseInt(deposit_amt);
	} else if (deposit_amt > -1) {
		$("#old_deposit_amt").val(deposit_amt);
	}

	// S-oil포인트 정보
	/*		if ( soil_point_amt > 0 ) {
				totalPriceHtml = apply_br_tag(totalPriceHtml);
					
				totalPriceHtml += '<li class="pr_text1">S-oil포인트</li>'
						        + '<li class="pr_text2">(-)' + soil_point_amt.money() + '점</li>';
				$("#old_soil_point_amt").val(soil_point_amt);

				discountSum += parseInt(soil_point_amt);
			} else if ( soil_point_amt > -1 ) {
				$("#old_soil_point_amt").val(soil_point_amt);
			}
	*/
	// 내포인트사용 -- 모바일주문서간소화
	$("#usePointSum").html(pointSum.toString().money() + "<span class=\"no_bold\">원</span>");

	// 무료배송권 정보
	if (dlv_prom_use_yn == "Y" && dlv_fvr_val > 0) {
		totalPriceHtml = apply_br_tag(totalPriceHtml);

		totalPriceHtml += '<li class="pr_text1">무료배송권</li>' +
			'<li class="pr_text2">(-)' + dlv_fvr_val.money() + '원</li>';

		//			discountSum += parseInt(dlv_fvr_val);
	}

	// 2014.12.24 모바일주문간소화 jjkim59
	var discountHTML = '<li class="fl">총 할인금액</li>';
	discountHTML += '<li class="fr"><strong>' + (discountSum.toString().money() == "0" ? "" : "-") + discountSum.toString().money() + '</strong>원</li>';
	$("#discount").html(discountHTML);

	// 할인 인 경우만 금액 차감
	$("#lottepointSave").empty();
	setLottePointSaveDiv(dcamt);

	// 총결제 금액이 0이 되어 버리면 결제수단 보이지 않도록 && 포인트단일결제 L-money/L.POINT 아닐 경우
	if (totpayamt == 0 && (typeof ($("#pntOnlyPay").val()) == undefined || $("#pntOnlyPay").val() == '' || $("#pntOnlyPay").val() == 'N')) {
		$("#div_paytype_void").hide(); // 흰색영역 비노출 처리 20160218
		$("#div_paytype #pay_method").hide();
		$("#div_paytype #pay_card").hide();
		$("#div_paytype #pay_bank").hide();
		$("#h3_paytype_title").hide();
		$(".paytype_title_wrap").hide();
		$("#payment_method_next_use").hide();
	} else {
		$("#div_paytype_void").show(); // 흰색영역 비노출 처리 20160218
		$("#div_paytype #pay_method").show();
		if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == paytype_code_card || $("#frm_inp input[name=rdo_paytype]:radio:checked").val() == paytype_code_lpay) {
			$("#div_paytype #pay_card").show();
		} else if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == paytype_code_bank) {
			$("#div_paytype #pay_bank").show();
		}
		$("#h3_paytype_title").show();
		$(".paytype_title_wrap").show();
		$("#payment_method_next_use").show();
	}
	$("#submit_btn").show();

	$("#totalprice").html("<span></span><strong>" + totpayamt.money() + "</strong>" + "원");
	$("#frm_inp input[name=totsttlamt]:hidden").val(totpayamt);

	// PG PROJECT : 주문 동의 영역 노출 제어
	var id = $("[id^=pay_type].on").attr("id");
	if (totpayamt > 0 && $("#pay_method").css("display") == "block" && (id == "pay_type4" || id == "pay_type1")) { // 주결제 금액 >0 이고 주결제 수단 노출된 상태이고 L.pay, 신용카드 선택 된 경우
		fn_setDisplayAssentArea('Y');
	} else {
		fn_setDisplayAssentArea('N');
	}

	// 청구할인		
	if ('Y' == claim_sale_yn) {
		var claim_sale_fvr_val = ($("#frm_inp input[name=claim_sale_fvr_val]:hidden").val() == '' ? '0' : $("#frm_inp input[name=claim_sale_fvr_val]:hidden").val());
		var maxamt = $("#frm_inp input[name=claim_sale_card_max_amt]:hidden").val();
		var claim_sale_aply_lmt_amt = (claim_sale_aply_lmt_amt == '' ? '0' : claim_sale_aply_lmt_amt);
		var paytype = $("#frm_inp input[name=paytype]:hidden").val();
		//20160127
		var cpcnFlag = cp_cn != '138425' && cp_cn != '137725' && cp_cn != '156230';

		var clm_sale_prc = parseInt(totpayamt) - (parseInt(totpayamt) * parseInt(claim_sale_fvr_val) * 0.01);
		var claim_sale_price = Math.floor(clm_sale_prc * 0.1) * 10;
		//최대할인금액체크
		if (parseInt(maxamt) < (parseInt(totpayamt) - parseInt(clm_sale_prc))) {
			claim_sale_price = parseInt(totpayamt) - parseInt(maxamt);
		}
		//20160127
		if (cpcnFlag) {
			$("#claim_sale_price").html("<strong>" + String(claim_sale_price).money() + "</strong><span>원</span>"); // 청구 할인 금액
		}
		if (parseInt(totpayamt) >= parseInt(claim_sale_aply_lmt_amt) &&
			$("#frm_inp select[name=iscmcd]").val() == claim_sale_card_knd_cd &&
			(paytype == PAYTYPE_CODE_CARD || paytype == PAYTYPE_CODE_LPAY) && parseInt(totpayamt) > 0) {
			//20160127   청구할인 구간대 설정
			if (cpcnFlag) {
				fn_formshow();
			}
		} else {
			//20160127
			if (cpcnFlag) {
				fn_formshow();
			}

		}
	}
}

// dcamt : 적립쿠폰 적립금
function setLottePointSaveDiv(dcamt) {

	var couponType;
	var tenPointSaveHtml = '<p class="lottepointOrange">* L.POINT <span> 10점</span>이 적립됩니다.</p>'; // 주문적립포인트안내
	var add_val = ord_pnt_rsrv_yn == 'Y' ? Number('10') : Number('0');

	try {
		var totRsrvAplyVal = $("#frm_send input[name=totRsrvAplyVal]").val(); // 상품적립금
		if ($("#frm_send input[name=includeSaveInstCpn]").val() != 'Y') { // 할인선택값에 대한 적립여부 체크
			dcamt = 0;
		}
		if ((Number(totRsrvAplyVal) + Number(dcamt)) > 0) {
			$("#lottepointSave").html(
				'<p class="lottepointOrange">* L.POINT <span>' +
				new String(Number(dcamt) + Number(totRsrvAplyVal) + add_val).money() +
				'점</span>이 적립됩니다.</p>');

			//$("#lottepointSave").show();

			// 20160108 박형윤 임직원할인일 경우 LPOINT 임시 감춤처리
			if ($("select[name='coupon']").val() == "0") {
				$("#lottepointSave").hide();
			} else {
				$("#lottepointSave").show();
			}

			couponType = $("#frm_inp select[name=coupon]").val();

			if ($("#frm_inp input[name=prommdclcd]").eq(couponType).val() == "27") {
				if (ord_pnt_rsrv_yn != 'Y') {
					$("#lottepointSave").hide();
				} else {
					$("#lottepointSave").html(tenPointSaveHtml);
					$("#lottepointSave").show();
				}
			} else {
				$("#lottepointSave").show();
			}

		} else {
			if (ord_pnt_rsrv_yn != 'Y') {
				$("#lottepointSave").hide();
			} else {
				$("#lottepointSave").html(tenPointSaveHtml);
				$("#lottepointSave").show();
			}
		}
	} catch (e) {}
}

// 포인트 관련 Element 값 초기화
function fn_initPointList(point_div) {
	if (point_div == "ALL" || point_div == lPoint) {
		$("#lpoint_amt").val("");
		$("#old_lpoint_amt").val("");
		$("#lpoint_amt").attr("disabled", true);
		$("#chk_lpoint_all").attr("checked", false);
		$("#chk_lpoint_all").prop("checked", false);
		$("#chk_lpoint_all").attr("disabled", true);
	}

	if (point_div == "ALL" || point_div == ltPoint) {
		$("#lt_point_amt").val("");
		$("#old_lt_point_amt").val("");
		$("#temp_lt_point_amt").val("");
		$("#lt_point_amt").attr("disabled", true);
		$("#chk_lt_point_all").attr("checked", false);
		$("#chk_lt_point_all").prop("checked", false);
		$("#chk_lt_point_all").attr("disabled", true);
	}

	if (point_div == "ALL" || point_div == deposit) {
		$("#deposit_amt").val("");
		$("#old_deposit_amt").val("");
	}

	/*		if (point_div == "ALL" || point_div == soilPoint){
				$("#soil_point_amt").val("");
				$("#old_soil_point_amt").val("");
				$("#soil_point_amt").attr("disabled", true);
				$("#chk_soil_point_all").attr("checked", false);
				$("#chk_soil_point_all").prop("checked", false);
				$("#chk_soil_point_all").attr("disabled", true);
			}*/
}

// 2011.05.30 휴대폰 인증
function cellphone_confirm() {
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	if (parseInt(totsttlamt) > 500000) {
		alert("휴대폰 결제는 월 50만원까지 결제 가능합니다.");
		return false;
	}
	if (parseInt(totsttlamt) + parseInt(curMonPhnSttlAmt) > 500000) {
		alert("휴대폰 결제는 월 50만원까지 결제 가능합니다.(잔여한도:" + (500000 - parseInt(curMonPhnSttlAmt)) + ")");
		return false;
	}
	return true;
}

// misp 플러그인 설치
function misp_install() {
	// 안드로이드, 아이폰 구별에 따른 ISP Application  호출
	if (isAndroid) {
		if ('Y' == tstore_yn) { // T-store 인 경우
			$("#X_ANSIM_FRAME").attr("src", "tstore://PRODUCT_VIEW/0000025711/0");
		} else {
			$("#X_ANSIM_FRAME").attr("src", "http://mobile.vpay.co.kr/jsp/MISP/andown.jsp");
		}
	} else if (isIOS) {
		$("#X_ANSIM_FRAME").attr("src", "http://itunes.apple.com/kr/app/id369125087?mt=8");
	} else {
		alert("지원되지 않는 운영체제 입니다.");
	}
}

// misp 실행
function misp_exec() {
	// 안드로이드, 아이폰 구별에 따른 ISP Application  호출
	if (isIOS) { // IOS
		var before = new Date();
		setTimeout(function () {
			if (new Date() - before < 3000) {
				window.location.href = "http://itunes.apple.com/kr/app/id369125087?mt=8";
			}
		}, 1500);
		//$("#X_ANSIM_FRAME").attr("src", "ispmobile://?TID="+$("#frm_send input[name=MISP_TID]:hidden").val());
		top.location.href = "ispmobile://?TID=" + $("#frm_send input[name=MISP_TID]:hidden").val();
	} else if (isAndroid) { // 안드로이드
		window.location.href = "intent://TID=" + $("#frm_send input[name=MISP_TID]:hidden").val() + "#Intent;scheme=ispmobile;package=kvp.jjy.MispAndroid320;end";
	} else {
		alert("지원되지 않는 운영체제 입니다.");
	}
}

// misp 자료 전송
function misp_send() {
	$("#frm_send").attr("action", "/misp/toTransData.jsp");
	$("#frm_send").attr("method", "post");
	$("#frm_send").attr("target", "X_ANSIM_FRAME");

	$("#frm_send").submit();
}

// misp 정보 셋팅 후 misp 전송 페이지 호출
function misp_create_data() {
	iscmcd = $("#frm_send input[name=iscmcd]:hidden").val();
	if ("Y" == grockle_yn) {
		phone_num1 = $("#frm_inp [name=grockle_cell1]:enabled").val();
		phone_num2 = $("#frm_inp input[name=grockle_cell2]").val();
		phone_num3 = $("#frm_inp input[name=grockle_cell3]").val();
		companyCd = "SKT"; // 기본값 전달 
		grockle_mbr_no = $("#frm_send input[name=grockle_mbr_no]:hidden").val(); // 비회원번호
	} else {
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
		type: 'post',
		async: false,
		url: '/order/misp_confirm.do?' + __commonParam,
		data: 'iscmcd=' + iscmcd + '&companyCd=' + companyCd + '&cardinst=' + cardinst + '&cardinstmon=' + cardinstmon + '&phone_num1=' + phone_num1 + '&phone_num2=' + phone_num2 + '&phone_num3=' + phone_num3 + '&totsttlamt=' + totsttlamt + '&goodsnm=' + goodsnm + '&grockle_yn=' + grockle_yn + '&grockle_mbr_no=' + grockle_mbr_no,
		success: function (response) {
			$("#cover").off('click');
			$("#cover").on('click', function () {
				$(this).hide();
			});
			$("#misp_confirm_div").html(response);
			misp_send();
		},
		error: init_misp()
	});
}

// misp 정보 초기화
function init_misp() {
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
function ilkmpi_send() {

	iscmcd = $("#frm_send input[name=iscmcd]:hidden").val();
	pan = "";

	//cardinst = $("#frm_send input[name=cardinst]:hidden").val(); // 일시, 할부 여부
	apvl_halbu = $("#frm_send input[name=cardinstmon]:hidden").val(); // 할부개월
	pay_ansim_price = $("#frm_send input[name=totsttlamt]:hidden").val(); //결제금액
	handNum = phone_no1 + phone_no2 + phone_no3;

	if (handNum.length < 10) {
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
function go_smartpay() {
	self.location.href = __sslDomain + "/mylotte/smartpay/smartpay.do?" + __commonParam + "&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
}

// 제휴 포인트 사용하기
function alliancePointUse(point_div) { // L:롯데포인트, S:에스오일포인트
	if (point_div == "L") { // 롯데포인트

		//$( '#cover' ).css({ 'display' : 'block', 'height' : '100%', 'top' : 0 });
		//window.scrollTo(0, $("#container").offset().top); // 레이어 위치 지정

		//$("#CONFIRM_FRAME").attr("src", "/popup/lotte_point_mng.do?" + __commonParam + "&page_div=F&from_page=of");
		//$("#CONFIRM_LAYER").css("width" , "100%");
		//$("#CONFIRM_LAYER").css("height", "100%");
		//$("#CONFIRM_LAYER").show();
		//$("#CONFIRM_FRAME").show();

	}
	/*		else if (point_div=="S"){ // s-oil 포인트
				$( '#cover' ).css({ 'display' : 'block', 'height' : '100%', 'top' : 0 });
				window.scrollTo(0, $("#container").offset().top); // 레이어 위치 지정
				//$("#container").hide();
				 
				$("#CONFIRM_FRAME").attr("src", "/popup/soil_card_mng.do?" + __commonParam + "&proc_div=S");
				$("#CONFIRM_LAYER").css("width"	, "100%");
				$("#CONFIRM_LAYER").css("height", "100%");
				$("#CONFIRM_LAYER").show();
				$("#CONFIRM_FRAME").show();
			}
	*/
	disableItems(true);
}

// 계좌번호 숫자 체크
function acthChkNum(obj) {
	var filter = /^[0-9]+$/;
	var keyCode = event.keyCode;
	var sKey = String.fromCharCode(keyCode);
	var re = new RegExp(filter);

	if (keyCode != 8 && keyCode != 46) { // Backspace, Del	
		if (!re.test(sKey)) {
			event.returnValue = false;
		}
	}
}

// 현금영수증 관련 자리 이동
function nextElement(obj) {
	if (varUa > -1) { // 안드로이드만 적용 (아이폰 스크립트 먹지 않음)
		var max_length = $(obj).attr("maxlength");
		var obj_val = $(obj).val();
		var input_nm = "";

		if ($(obj).attr("name") == "cr_issu_mean_no_phone2") {
			input_nm = "cr_issu_mean_no_phone3";
		} else {
			input_nm = $(obj).next('input').attr("name");
		}

		if (obj_val.length == max_length) {
			$("#frm_inp input[name=" + input_nm + "]").focus();
		}
	}
}

// 현금영수증 영역 컨트롤
function setCashReceiptArea() {
	var pay_type = "";
	var chk_lpoint = $("#chk_lpoint").prop("checked");
	var chk_deposit_all = $("#chk_deposit_all").prop("checked");

	if ($("#frm_inp input[name=rdo_paytype]:radio").length > 0) {
		pay_type = $("#frm_inp input[name=rdo_paytype]:radio:checked").val();
	} else {
		pay_type = $("#frm_inp input[name=paytype]:hidden").val();
	}

	// 결제수단이 무통장입금이 아니고 L-money 사용하지 않고 보관금을 사용하지 않는 경우
	if (pay_type != PAYTYPE_CODE_BANK && !chk_lpoint && !chk_deposit_all && pay_type != PAYTYPE_CODE_NAVERPAY) {
		$("#cash_receipts").hide(); // 현금영수증 영역 가리기
		$("#pers_value span > input").val(""); // 소득공제 정보 지우기
		$("#co_value p > input").val(""); // 지출증빙용 정보 지우기
		// E쿠폰, 상품권 인 경우 - 20181011
	} else if (!fn_giftCashReceipt()) {
		$("#cash_receipts").hide(); // 현금영수증 영역 가리기
		$("#frm_inp input[name=rdo_cash]:radio[value='3']").click(); // 신청안함으로 변경
	} else {
		$("#cash_receipts").show(); // 현금영수증 영역 보이기
		setCellNo();
	}
	//20180822 서울보증보험 노출여부 추가
	if (pay_type == PAYTYPE_CODE_BANK && Number(totpayamt) != 0) {
		fn_usafeAgree("2"); //서울보증보험 가입동의 노출
	} else {
		fn_usafeAgree("3"); //서울보증보험 가입동의 숨기기
	}
}

function navback() { //주문서페이지에서 이전버튼 클릭시 상품상세페이지로 가도록 수정  기존 : 원앤원 > 선물페이지 > 주문서
	if (history.length > 0) {
		history.go(-2);
	} else {
		alert('이전페이지가 존재하지 않습니다.');
	}
}

function getPage() {
	return document.frm_send.pageName.value;
}

//네이버지도
function naver_store_map(arg, isLoadScript, smpEtNo, smpEtContrNo, smp_goods_type) {

	if (typeof isLoadScript != 'boolean' || isLoadScript === false) { // NaverMap Loading 개선, 2014-07-03 by sylee58@lotte.com
		com.lotte.util.LoadScript("http://map.naver.com/js/naverMap.naver?key=956f6f619b13d3caf5540349078f9593", function () {
			naver_store_map(arg, true, smpEtNo, smpEtContrNo, smp_goods_type);
		});
		return;
	}

	$('#cover').css({
		'display': 'block',
		'height': '100%',
		'top': 0
	});
	// <div id="container"> 가 relative 라 이녀석에 top 을 잡고 있어 
	// 헤더 영역만큼 $('.new1025').height() 빼고 100px 더한다.
	var cal_top = ($(document).scrollTop() - $('.new1025').height()) + 100; //$('#calculator').scroll().top;
	var loading_style = "position:absolute;width:100%;opacity:1;z-index:999;top:" + cal_top + "px;left:0px;";
	$('#shop_location').removeClass("shop_location");
	$('#shop_location').attr("style", loading_style);

	var smp_ecpn_yn = (smp_goods_type == goods_smp_normal_etc ? 'Y' : 'N'); // 이쿠폰 여부
	var req_data = 'goods_no=' + arg + '&smp_entr_no=' + smpEtNo + '&smp_entr_contr_no=' + smpEtContrNo + '&smp_ecoupon_yn=' + smp_ecpn_yn + '&' + __commonParam;
	$.ajax({
		type: 'post',
		async: true,
		url: '/product/m/mobileNaverMap.do?',
		data: req_data,
		beforeSend: function () {
			$('#loading').css('display', 'block');
		},
		success: function (response) {
			$("#shop_location").html(response);
			$("#shop_location").show();
		},
		error: function (err) {
			alert('매장위치 조회 중 오류가 발생하였습니다.\n잠시 후 조회해 주세요.');
			$("#shop_location").hide();
		},
		complete: function () {
			$('#loading').css('display', 'none');
		}
	});
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
	var dup_cpn = "0";
	var dlv_cnt = fn_getDeliCnt();

	$("#frm_inp input[name=coupon]").each(function () {

		var coupon_idx = $(this).val();

		if (coupon_idx != "N") { // 1차 선택
			promcartsn = $("#frm_inp input[name=promcartsn]").eq(coupon_idx).val(); // 9
			prommdclcd = $("#frm_inp input[name=prommdclcd]").eq(coupon_idx).val(); // 10
			fvrpolctpcd = $("#frm_inp input[name=fvrpolctpcd]").eq(coupon_idx).val(); // 04
			totdcamt = $("#frm_inp input[name=totdcamt]").eq(coupon_idx).val(); // 쿠폰할인금액 20800
			cpnpromno = $("#frm_inp input[name=cpnpromno]").eq(coupon_idx).val(); // 1123188
			cpnrscmgmtsn = $("#frm_inp input[name=cpnrscmgmtsn]").eq(coupon_idx).val(); // 0
			adtncostdtlsctnm = $("#frm_inp input[name=adtncostdtlsctnm]").eq(coupon_idx).val(); // 롯데카드 5% 할인
			cardkndcd = $("#frm_inp input[name=cardkndcd]").eq(coupon_idx).val(); //047
			includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn]").eq(coupon_idx).val(); // 2011.05.19 적립여부 N

			if ($("#frm_inp input[name=dup_coupon]").length < 2 || dlv_cnt > 1) { // 2차가 없다. && 배송지 2군데 이상
				if (parseInt(totdcamt) >= parseInt(maxFirstAmt)) {
					maxAmt = totdcamt;
					// 적립여부에 따라 구분
					if ("N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt)) {
						maxFirstAmt = totdcamt;
						maxFirstIdx = coupon_idx;
						maxDupAmt = 0;
						maxDupIdx = "";
					} else if ("Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt)) {
						maxSaveFirstAmt = totdcamt;
						maxSaveFirstIdx = coupon_idx;
						maxSaveDupAmt = 0;
						maxSaveDupIdx = "";
					}
				}
			} else { // 2차가 있다.
				//alert("2:"+totdcamt+":"+coupon_idx+":"+totdupdcamt+":"+dupcpn_idx);
				$("#frm_inp input[name=dup_coupon]").each(function () {
					var dupcpn_idx = $(this).val();

					var tmp_arr_cnt = 0;
					var tmp_arr;

					v_cpn_crd_dc_amt = 0;
					dup_cpnpromno = $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();

					if (dupcpn_idx != "N") {

						if (coupon_idx == undefined || coupon_idx == "N") { // 중복쿠폰
							tmp_arr = single_prom;
							tmp_arr_cnt = single_prom_cnt;

						} else { // 1차쿠폰 + 중복쿠폰 사용
							tmp_arr = multi_prom;
							tmp_arr_cnt = multi_prom_cnt;
							first_cpn = (cpnpromno == "0" ? prommdclcd : cpnpromno);
						}

						if (tmp_arr_cnt > 0) {
							v_cpn_crd_dc_amt = 0;
							totdupdcamt = 0;
							for (var i = 0; i < tmp_arr.length; i++) {
								if (tmp_arr[i][0] == first_cpn && tmp_arr[i][1] == dup_cpnpromno) {
									v_cpn_crd_dc_amt = tmp_arr[i][2];

									totdupdcamt = tmp_arr[i][2];
									break;
								}
							}

							if (parseInt(v_cpn_crd_dc_amt) > 0) {
								//alert("1:"+totdcamt+":"+coupon_idx+":"+totdupdcamt+":"+dupcpn_idx);
								if (dupcpn_idx != 'N') {
									dup_promcartsn = $("#frm_inp input[name=promcartsn_dup]").eq(dupcpn_idx).val();
									dup_prommdclcd = $("#frm_inp input[name=prommdclcd_dup]").eq(dupcpn_idx).val();
									dup_fvrpolctpcd = $("#frm_inp input[name=fvrpolctpcd_dup]").eq(dupcpn_idx).val();
									dup_cpnpromno = $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();
									dup_cpnrscmgmtsn = $("#frm_inp input[name=cpnrscmgmtsn_dup]").eq(dupcpn_idx).val();
									dup_adtncostdtlsctnm = $("#frm_inp input[name=adtncostdtlsctnm_dup]").eq(dupcpn_idx).val();
									dup_cardkndcd = $("#frm_inp input[name=cardkndcd_dup]").eq(dupcpn_idx).val();
									dup_includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn_dup]").eq(dupcpn_idx).val();

									if (prommdclcd == "10" && cardkndcd != "") { // 카드할인쿠폰
										if (($("#frm_inp input[name=prommdclcd_dup]:eq(" + $(this).val() + ")").val() == "30" && cardkndcd == $("#frm_inp input[name=cardkndcd_dup]:eq(" + $(this).val() + ")").val()) ||
											$("#frm_inp input[name=cardkndcd_dup]:eq(" + $(this).val() + ")").val() == "") { // 같은 중복카드쿠폰이거나 중복카드쿠폰이 아니면
											if (parseInt(totdcamt) + parseInt(totdupdcamt) >= parseInt(maxAmt)) {
												maxAmt = parseInt(totdcamt) + parseInt(totdupdcamt);
												// 적립여부에 따라 구분
												if ("N" == includeSaveInstCpn && parseInt(maxAmt) > parseInt(maxFirstAmt) + parseInt(maxDupAmt)) {
													maxFirstAmt = totdcamt;
													maxFirstIdx = coupon_idx;
													maxDupAmt = totdupdcamt;
													maxDupIdx = dupcpn_idx;
												} else if ("Y" == includeSaveInstCpn && parseInt(maxAmt) > parseInt(maxSaveFirstAmt) + parseInt(maxSaveDupAmt)) {
													maxSaveFirstAmt = totdcamt;
													maxSaveFirstIdx = coupon_idx;
													maxSaveDupAmt = totdupdcamt;
													maxSaveDupIdx = dupcpn_idx;
												}
											}
										}
									} else if (prommdclcd == "27" || dlv_cnt > 1) { // 임직원할인
										if (parseInt(totdcamt) >= parseInt(maxAmt)) { // 2차 사용못함
											// 적립여부에 따라 구분
											if ("N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt)) {
												maxFirstAmt = totdcamt;
												maxFirstIdx = coupon_idx;
												maxDupAmt = 0;
												maxDupIdx = "";
											} else if ("Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt)) {
												maxSaveFirstAmt = totdcamt;
												maxSaveFirstIdx = coupon_idx;
												maxSaveDupAmt = 0;
												maxSaveDupIdx = "";
											}
										}
									} else {
										if (parseInt(totdcamt) + parseInt(totdupdcamt) >= parseInt(maxAmt)) {
											maxAmt = parseInt(totdcamt) + parseInt(totdupdcamt);
											// 적립여부에 따라 구분
											if ("N" == includeSaveInstCpn && parseInt(maxAmt) > parseInt(maxFirstAmt) + parseInt(maxDupAmt)) {
												maxFirstAmt = totdcamt;
												maxFirstIdx = coupon_idx;
												maxDupAmt = totdupdcamt;
												maxDupIdx = dupcpn_idx;
											} else if ("Y" == includeSaveInstCpn && parseInt(maxAmt) > parseInt(maxSaveFirstAmt) + parseInt(maxSaveDupAmt)) {
												maxSaveFirstAmt = totdcamt;
												maxSaveFirstIdx = coupon_idx;
												maxSaveDupAmt = totdupdcamt;
												maxSaveDupIdx = dupcpn_idx;
											}
										}
									}
								} else {
									//alert("2:"+totdcamt+":"+coupon_idx+":"+totdupdcamt+":"+dupcpn_idx);
									if (parseInt(totdcamt) >= parseInt(maxAmt)) {
										maxAmt = totdcamt;
										// 적립여부에 따라 구분
										if ("N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt)) {
											maxFirstAmt = totdcamt;
											maxFirstIdx = coupon_idx;
											maxDupAmt = 0;
											maxDupIdx = "";
										} else if ("Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt)) {
											maxSaveFirstAmt = totdcamt;
											maxSaveFirstIdx = coupon_idx;
											maxSaveDupAmt = 0;
											maxSaveDupIdx = "";
										}

										promcartsn = "";
										prommdclcd = "";
										fvrpolctpcd = "";
										totdcamt = "0";
										cpnpromno = "";
										cpnrscmgmtsn = "";
										adtncostdtlsctnm = "";
										cardkndcd = "";
										includeSaveInstCpn = "";
									}
								}
							} else {
								//alert("3:"+totdcamt+":"+coupon_idx+":"+totdupdcamt+":"+dupcpn_idx);
								if (parseInt(totdcamt) >= parseInt(maxAmt)) {
									maxAmt = parseInt(totdcamt);
									// 적립여부에 따라 구분
									if ("N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt)) {
										maxFirstAmt = totdcamt;
										maxFirstIdx = coupon_idx;
										maxDupAmt = 0;
										maxDupIdx = "";
									} else if ("Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt)) {
										maxSaveFirstAmt = totdcamt;
										maxSaveFirstIdx = coupon_idx;
										maxSaveDupAmt = 0;
										maxSaveDupIdx = "";
									}

									promcartsn = "";
									prommdclcd = "";
									fvrpolctpcd = "";
									totdcamt = "0";
									cpnpromno = "";
									cpnrscmgmtsn = "";
									adtncostdtlsctnm = "";
									cardkndcd = "";
									includeSaveInstCpn = "";
								}
							}
						}
					} else {
						if (parseInt(totdcamt) >= parseInt(maxAmt)) {
							maxAmt = totdcamt;
							// 적립여부에 따라 구분
							if ("N" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxFirstAmt)) {
								maxFirstAmt = totdcamt;
								maxFirstIdx = coupon_idx;
								maxDupAmt = 0;
								maxDupIdx = "";
							} else if ("Y" == includeSaveInstCpn && parseInt(totdcamt) > parseInt(maxSaveFirstAmt)) {
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
			if ($("#frm_inp input[name=dup_coupon]").length > 1 && dlv_cnt == 1) { // 2차가 있다. && 배송지 1군데
				$("#frm_inp input[name=dup_coupon]").each(function () {
					var dupcpn_idx = $(this).val();

					var tmp_arr_cnt = 0;
					var tmp_arr;

					v_cpn_crd_dc_amt = 0;
					if (dupcpn_idx != "N") {
						if (coupon_idx == undefined || coupon_idx == "N") { // 중복쿠폰
							tmp_arr = single_prom;
							tmp_arr_cnt = single_prom_cnt;

						} else { // 1차쿠폰 + 중복쿠폰 사용
							tmp_arr = multi_prom;
							tmp_arr_cnt = multi_prom_cnt;
							first_cpn = (cpnpromno == "0" ? prommdclcd : cpnpromno);
						}
						cpnpromno_dup = $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();
						if (tmp_arr_cnt > 0) {
							for (var i = 0; i < tmp_arr.length; i++) {
								if (tmp_arr[i][0] == first_cpn && tmp_arr[i][1] == cpnpromno_dup) {
									v_cpn_crd_dc_amt = tmp_arr[i][2];

									totdupdcamt = tmp_arr[i][2];
									break;
								}
							}

							if (parseInt(v_cpn_crd_dc_amt) > 0) {

								if (dupcpn_idx != 'N') {
									promcartsn = $("#frm_inp input[name=promcartsn_dup]").eq(dupcpn_idx).val();
									prommdclcd = $("#frm_inp input[name=prommdclcd_dup]").eq(dupcpn_idx).val();
									fvrpolctpcd = $("#frm_inp input[name=fvrpolctpcd_dup]").eq(dupcpn_idx).val();
									cpnpromno = $("#frm_inp input[name=cpnpromno_dup]").eq(dupcpn_idx).val();
									cpnrscmgmtsn = $("#frm_inp input[name=cpnrscmgmtsn_dup]").eq(dupcpn_idx).val();
									adtncostdtlsctnm = $("#frm_inp input[name=adtncostdtlsctnm_dup]").eq(dupcpn_idx).val();
									cardkndcd = $("#frm_inp input[name=cardkndcd_dup]").eq(dupcpn_idx).val();
									includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn_dup]").eq(dupcpn_idx).val();

									if (parseInt(v_cpn_crd_dc_amt) > parseInt(maxAmt)) {
										maxAmt = parseInt(v_cpn_crd_dc_amt);
										//2차 쿠폰만 적용 되는 오류로 삭제
										//maxFirstAmt = parseInt(v_cpn_crd_dc_amt);
										//maxFirstIdx = coupon_idx;
										if (parseInt(v_cpn_crd_dc_amt) > 0) {
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
									promcartsn = "";
									prommdclcd = "";
									fvrpolctpcd = "";
									totdcamt = "0";
									cpnpromno = "";
									cpnrscmgmtsn = "";
									adtncostdtlsctnm = "";
									cardkndcd = "";
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
	if (parseInt(maxFirstAmt) + parseInt(maxDupAmt) < parseInt(maxSaveFirstAmt) + parseInt(maxSaveDupAmt)) {
		maxFirstIdx = maxSaveFirstIdx;
		maxDupIdx = maxSaveDupIdx;
	}
	maxFirstIdx = maxFirstIdx == "" ? "N" : maxFirstIdx;
	maxDupIdx = maxDupIdx == "" ? "N" : maxDupIdx;
	if (maxFirstIdx != "N") {
		$("#frm_inp select[name=coupon]").val(maxFirstIdx);
		$("#frm_inp select[name=coupon]").change();
	}
	if (maxDupIdx != "N") {
		$("#frm_inp select[name=dup_coupon]").val(maxDupIdx);
		$("#frm_inp select[name=dup_coupon]").change();
	}
	if (maxFirstIdx == "N" && maxDupIdx == "N") {
		if (app_card_only_yn == 'Y') {
			$('#frm_inp select[name=iscmcd]').val(app_card_cd);
			getCardInsCheck(); // 할부선택
		} else if ($("#frm_inp input[name=rdo_paytype]:radio:checked").index() == 0 && $('#frm_inp select[name=iscmcd] option:selected').index() != 0) { // 결제 수단 중 카드가 선택 되어있으면
			getCardInsCheck(); // 할부선택
		}
	}

	// 20160108 박형윤 임직원할인일 경우 LPOINT 임시 감춤처리
	if (maxFirstIdx == 0) {
		$(".order_tp #lottepointSave .lottepointOrange").hide();
	}
}

function chkEmpty(obj) {
	var empty = false;
	if ($(obj).val() == null || $(obj).val() == "") {
		empty = true;
	}
	return empty;
}

//안심번호
function closeANSPop() {
	$("#ansimPop,#cover").hide();
	$("#cover").off('click');
}

function showANSPop() {
	$("#ansimPop,#cover").show();
	$("#cover").on('click', function () {
		closeANSPop();
	});
}

function setCellNo() {
	if (phone_no1 != "" && phone_no2 != "" && phone_no3 != "") {
		$("select[name=cr_issu_mean_no_phone1]").val(phone_no1);
		$("input[name=cr_issu_mean_no_phone2]").val(phone_no2);
		$("input[name=cr_issu_mean_no_phone3]").val(phone_no3);
	}
}

// L.pay WEB : 사용자 인증
function lpayCertInfo() {
	selPayType(4);

	$("#pay_card").show();
	$("#pay_card_confirm").hide();
	$("#pay_bank").hide();
	$("#pay_phone").hide();
	$("#pay_naverPay").hide();

	$("input[name=temp_paytype]:hidden").val(3);

	// 20151222 박형윤 L-PAY 카드 안내 긴급 조치
	$("#SHINHAN_CARD_LAYER").hide();
	$("input[name='sinhan_point'][type=radio][value=N]").click();
	$("#BC_CARD_LAYER").hide();
	$("input[name='bc_point'][type=radio][value=N]").click();
	$("#SAMSUNG_CARD_LAYER").hide();
	$("input[name='samsung_point'][type=radio][value=N]").click();
	// 2016.05.18
	$("#KB_CARD_LAYER").hide();
	$("input[name='kb_point'][type=radio][value=N]").click();
	$("#LOTTE_CARD_LAYER").hide();

	//2016.02.25 결제수단별 공지사항 시작
	$("#pay_notice_lpay").show(); //L.PAY노출
	$("#pay_notice_card").hide();
	$("#pay_notice_bank").hide();
	$("#pay_notice_phone").hide();
	$("#pay_notice_naverpay").hide();
	//2016.02.25 끝

	$("#pageDesc").html("L.pay 서비스에 연결 중입니다.<br>잠시만 기다려 주세요.");
	$("#pageCover,#pageLoading").show(); // 로딩 이미지 적용

	$("#frm_lpay input[name=req_div]:hidden").val("card_req"); // lpay 인증 및 카드 목록 요청

	$("#frm_inp select[name=iscmcd]").html('<option value="">카드선택</option>'); // 카드 목록 변경

	$("#frm_lpay").submit();
}

//L.pay 간편결제 서비스 이용안내 레이어
function LpayAgreeCheckLayer() {
	if ($(".box_Lpay_agree_check .txt01").css('display') == 'none') {
		$(".box_Lpay_agree_check").addClass("open");
	} else {
		$(".box_Lpay_agree_check").removeClass("open");
	}
}

//네이버페이 간편결제 서비스 이용안내 레이어
function NaverPayAgreeCheckLayer() {
	if ($(".npay_notice_wrap .txt").css('display') == 'none' && $("#pay_type5").hasClass("on")) {
		$(".npay_notice_wrap").addClass("open");
	} else {
		$(".npay_notice_wrap").removeClass("open");
	}
}

//L.pay 비밀번호 입력안내 레이어 닫기
function fn_useLPayLPointCancel() {
	$(".laver_Lpay_order").hide();
	$("#useLottePoint").hide();
	if ($("#chk_lt_point").prop("checked") == true) {
		$("#chk_lt_point").trigger("click");
	}
	if ($("input[name=temp_paytype]:hidden").val() != 3) {
		$("#temp_lt_point_amt").val("");
	}
}
// L.pay 카드 등록
function lpay_card_reg() {
	$("#X_ANSIM_FRAME").attr("src", "/lpay/callDLP.jsp?lpay_id=LP-PM-IAPI-03-002");
}
// L.pay 앱 연결
function lpay_lnk_app() {
	$("#X_ANSIM_FRAME").attr("src", "https://www.lpay.com/dlp/ldc/appInstall");
}

var filterBarScroll = null;

// 배송지 주소 변경 start
function listOpen(ck, deli_cnt, deli_tab) {

	//복수 배송지 순번/탭 저장
	$('#sel_deli_cnt').val(deli_cnt);
	$('#sel_deli_tab').val(deli_tab);

	//선택한 배송지를 배송지 레이어에 자동 선택
	var deli_idx = $('#sel_deli_cnt').val();
	var deli_dlvp_sn = $("#deli_" + deli_idx + "_" + deli_tab + " #li_mine #deli_select_" + deli_idx).val();

	$('input[type=radio][value=' + deli_dlvp_sn + ']').trigger("click");
	//console.log($('input[type=radio][value='+deli_dlvp_sn+']'));

	//레이어 팝업시 수정 버튼 기능 숨기기(다중배송시)
	$(".btn_deli_mod").hide();

	//레이어 팝업 띄우기
	var _$opLayer = $('.addr_list_layer'),
		_$optionBtn = $('.addr_list_open'),
		_$opLayerBg = $('.addr_list_bg');

	var _open = false;

	if (ck == '1') {
		optionLayerHandler();
	} else if (ck == '2') {
		_$opLayer = $('.addr_list_layer2');
		optionLayerHandler();
	}

	function optionLayerHandler() {
		if (_open) {
			$("#pageCover").hide();
			_$opLayer.css({
				"bottom": (-_$opLayer.height() - 12) + 'px',
				"z-index": 0
			});
			_$optionBtn.removeClass('on');
		} else {
			$("#pageCover").show();
			_$opLayer.css({
				"bottom": 0,
				"z-index": "9999"
			});
			_$optionBtn.addClass('on');
		}
		return false;
	}

	//하단 필터바 스크롤( egScroll 생성 )
	filterBarScroll = $('#filterType').egScroll(true, false);
	$('#filterType2').egScroll(true, false);

};

//배송지 목록 내 선택완료
function btnComplate() {

	if (!$('input:radio[name="detail_list"]').is(":checked")) {
		alert("배송지를 선택해 주세요");
		return false;
	};

	var _$opLayer = $('.addr_list_layer'),
		_$optionBtn = $('.addr_list_open'),
		_$opLayerBg = $('.addr_list_bg');
	var _open = false;

	$("#pageCover").hide();
	_$opLayer.css({
		"bottom": (-_$opLayer.height() - 12) + 'px',
		"z-index": 0
	});
	_$optionBtn.removeClass('on');
	_open = false;

	// 회원주소정보 조회
	var $tmp_addr = $('input:radio[name="detail_list"]:checked');

	var deli_idx = $('#sel_deli_cnt').val();
	var deli_tab = $('#sel_deli_tab').val();

	/* 저장된 배송지정보 데이터 참고
	data-d01="${deli.dlvpNm}"         data-d02="${deli.rmitNm}"        data-d03="${deli.dlvZip1}"       data-d04="${deli.dlvZip2}"
	data-d05="${deli.postAddr}"       data-d06="${deli.dtlAddr}"       data-d07="${deli.stnm_dlv_zip1}" data-d08="${deli.stnm_dlv_zip2}"
	data-d09="${deli.stnm_post_addr}" data-d10="${deli.stnm_dtl_addr}" data-d11="${deli.baseDlvpYn}"    data-d12="${deli.dlvpSn}"
	data-d13="${deli.cellSctNo}"      data-d14="${deli.cellTxnoNo}"    data-d15="${deli.cellEndNo}"     data-d16="${status.index }" >
	*/

	//기존 주소정보 유효성 체크 (우편번호 및 주소1,2)
	if (($tmp_addr.data('d03') == '000' || $tmp_addr.data('d03').length <= 0 || $tmp_addr.data('d04').length <= 0 || $tmp_addr.data('d05').length <= 0 || $tmp_addr.data('d06').length <= 0) &&
		($tmp_addr.data('d07') == '000' || $tmp_addr.data('d07').length <= 0 || $tmp_addr.data('d08').length <= 0 || $tmp_addr.data('d09').length <= 0 || $tmp_addr.data('d10').length <= 0)
	) {
		alert("기존 배송지정보(우편번호/주소)가 유효하지 않습니다.\n새로운 배송지로 입력해 주세요.");
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_new > a").click();
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_new [name=inprmitnm]").val($tmp_addr.data('d02'));
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_new select[name=inpcell1]").val($tmp_addr.data('d13'));
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_new input[name=inpcell2]").val($tmp_addr.data('d14'));
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_new input[name=inpcell3]").val($tmp_addr.data('d15'));

		return;
	}

	//휴대폰번호 유효성 체크
	var deli_hp = $tmp_addr.data('d13') + $tmp_addr.data('d14') + $tmp_addr.data('d15');

	var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;
	if (!regExp.test(deli_hp)) {
		if ($.trim(deli_hp).length <= 0) {
			alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요.");
		} else {
			alert("선물 받으시는 분의 휴대폰 번호를 확인해 주세요. [" + deli_hp + "]");
		}
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine #deli_phone_text_" + deli_idx).hide();
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine #deli_phone_inp_" + deli_idx).show();
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine input[name=inpcell2]").show();
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine input[name=inpcell3]").show();
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine input[name=inpcell2]").focus();
	} else {
		//휴대폰번호
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine #deli_phone_inp_" + deli_idx).hide();
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine input[name=inpcell2]").hide();
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine input[name=inpcell3]").hide();
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine #deli_phone_text_" + deli_idx).show();
		$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine #deli_phone_text_" + deli_idx).html($tmp_addr.data('d13') + "-" + $tmp_addr.data('d14') + "-" + $tmp_addr.data('d15'));
	}

	// 주소, 도로명 우편번호 유효할 경우 도로명주소, 아닐경우 지번주소
	if ($tmp_addr.data('d07') != '') {
		$("#deli_" + deli_idx + "_" + deli_tab + " #deli_addr_text_" + deli_idx).html($tmp_addr.data('d09') + " " + $tmp_addr.data('d10'));
	} else {
		$("#deli_" + deli_idx + "_" + deli_tab + " #deli_addr_text_" + deli_idx).html($tmp_addr.data('d05') + " " + $tmp_addr.data('d06'));
	}
	/* 저장된 배송지정보 데이터 참고
	data-d01="${deli.dlvpNm}"         data-d02="${deli.rmitNm}"        data-d03="${deli.dlvZip1}"       data-d04="${deli.dlvZip2}"
	data-d05="${deli.postAddr}"       data-d06="${deli.dtlAddr}"       data-d07="${deli.stnm_dlv_zip1}" data-d08="${deli.stnm_dlv_zip2}"
	data-d09="${deli.stnm_post_addr}" data-d10="${deli.stnm_dtl_addr}" data-d11="${deli.baseDlvpYn}"    data-d12="${deli.dlvpSn}"
	data-d13="${deli.cellSctNo}"      data-d14="${deli.cellTxnoNo}"    data-d15="${deli.cellEndNo}"     data-d16="${status.index }" >
	*/

	//선물하기의 경우, 배송지수정이 없기 때문에 dlvp_sn값만 저장해 놓는다.
	$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine #selectedRmitNmList").html($tmp_addr.data('d02') + " (" + $tmp_addr.data('d01') + ")");
	$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine #deli_select_" + deli_idx).val($tmp_addr.data('d12'));
	$("#deli_" + deli_idx + "_" + deli_tab + " #li_mine #deli_selected_no_" + deli_idx).val($tmp_addr.data('d16'));

	// 배송옵션 컨트롤 추가, 2014-12-30, hglee4
	switchDeliOption("mine", deli_idx, $tmp_addr.data('d12'), deli_tab);

	sendTclick('order_ClkW_Btn_1');
}
// 20150629 단일 배송지 주소 변경 end

//배송지 목록 내 취소
function btnCancel() {
	var _$opLayer = $('.addr_list_layer'),
		_$opLayerBg = $('.addr_list_bg');
	$("#pageCover").hide();
	_$opLayer.css({
		"bottom": (-_$opLayer.height() - 12) + 'px',
		"z-index": 0
	});
	_open = false;
}
// 20160302 취소버튼 추가

function chImg(objThis, i) {
	objThis.src = "http://image.lotte.com/lotte/images/common/product/no_" + i + ".gif";
}
//청구할인추가
function fn_cardsavegoods() {
	var goodsno = $("#frm_send input[name=goodsno]:hidden").val();

	while (goodsno.indexOf(split_gubun_1) > -1) {
		goodsno = goodsno.replace(split_gubun_1, ",");
	}

	var v_goods_no_list = goodsno;
	var card_cd = $("#frm_inp select[name=iscmcd]").val();
	var no_items = "";

	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();

	$("#no_discount_items").html("<li><div class=\"visual\"></div><div class=\"cont\"></div></li>");
	$.ajax({
		async: false,
		type: "POST",
		dataType: "json",
		url: "/order/searchCardSalePromViewList.do",
		data: {
			goods_no_list: v_goods_no_list,
			card_knd_cd: card_cd
		},
		success: function (data) {
			if (data.length > 0) { //청구할인 불가상품조회
				$("#no_discount_items").html("");
				for (var i = 0; i < data.length; i++) {
					no_items += "<li>";
					no_items += "<div class=\"visual\"><img src=\"http://image.lotte.com/goods" + data[i].img_path_nm + data[i].goods_no + "_1_100.jpg\" alt=\"#\"></div>";
					no_items += "<div class=\"cont\"><p class=\"tit\"><strong>";
					//						no_items += data[i].ITEM_NM;
					no_items += "</strong><span>";
					no_items += data[i].goods_nm;
					no_items += "</span></p>";
					if (data[i].card_knd_nm != null && data[i].card_knd_nm != "null") {
						no_items += "<p class=\"card_info\">";
						no_items += data[i].card_knd_nm + " 청구할인";
					} else {
						no_items += "<p class=\"card_info none\">";
						no_items += "청구할인 제외상품";
					}
					no_items += "</p></div></li>";

					$("#frm_inp input[name=card_save_cnt]:hidden").val(data[i].card_save_cnt);
				}
				$("#no_discount_items").html(no_items);
				if ($("#frm_inp select[name=iscmcd] option:selected").text() != "카드선택") {

					$("#card_sale_goods_list_h2").html($("#frm_inp select[name=iscmcd] option:selected").text() + " 청구할인 불가 상품");
					$("#ok_card_noti_04").html("<strong>" + $("#frm_inp select[name=iscmcd] option:selected").text() + " 청구할인이 불가한 상품이 있습니다.</strong><br/>청구할인을 원하시면 불가한 상품은 따로 결제해주세요.");

				} else {
					$("#card_sale_goods_list_h2").html("청구할인 불가 상품");
					$("#ok_card_noti_04").html("");
				}

				fn_formshow();
			} else { //청구할인 불가상품이 없을경우 청구할인이 가능함
				//청구할인이 2건이상일경우 청구할인 예상금액을 계산하기 위해 재조회해서 셋팅을 해줘야한다.

				$.ajax({
					async: false,
					type: "POST",
					dataType: "json",
					url: "/order/searchCardSalePromView2.do",
					data: {
						goods_no_list: v_goods_no_list,
						card_knd_cd: card_cd,
						tot_sttl_amt: totsttlamt
					},
					success: function (data) {
						if (data.success) {

							claim_sale_aply_lmt_amt = data.aplylmtamt;
							claim_sale_card_knd_cd = data.cardkndcd;
							claim_sale_fvr_val = data.fvrval;
							claim_sale_card_max_amt = data.maxfvrval;
							$("#frm_inp input[name=claim_sale_fvr_val]:hidden").val(data.fvrval);
							$("#frm_inp input[name=claim_sale_aply_lmt_amt]:hidden").val(data.aplylmtamt);
							$("#frm_inp input[name=claim_sale_card_max_amt]:hidden").val(data.maxfvrval);
							$("#frm_inp input[name=claim_sale_card_knd_cd]:hidden").val(data.cardkndcd);
						} else {

						}
					},
					error: function (request, status) {
						//						    alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
					}
				});

				fn_formshow();
			}
		},
		error: function (request, status) {
			//			   alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
		}
	});

}

//카드선택에 따라서 청구할인 내용을 보여준다.
function fn_formshow() {
	var totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val();
	var paytype = $("#frm_inp input[name=paytype]:hidden").val();
	var card_save_cnt = $("#frm_inp input[name=card_save_cnt]:hidden").val(); //청구할인이 가능한 카드인지 확인
	var card_cd = $("#frm_inp select[name=iscmcd]").val();
	var fvrval = $("#frm_inp input[name=claim_sale_fvr_val]:hidden").val();
	var maxamt = $("#frm_inp input[name=claim_sale_card_max_amt]:hidden").val();
	$("#frm_inp input[name=select_card_payment_yn]:hidden").val("N"); //청구할인대상금액은 충족하나 대상상품 + 비대상상품 케이스로 청구할인 적용이 불가능할경우 얼럿 노출을 위해 추가함 (기본셋팅 : N)
	$("#btn_goods_view").attr("style", "display:none;");
	$("#li_claim_sale_info2").html("");
	if (claim_sale_yn == "N" && card_sale_yn == "Y") {

		if ($("#frm_inp select[name=iscmcd] option:selected").text() != "카드선택") {
			if (parseInt(card_save_cnt) > 0) {
				//선택카드로 청구할인이 불가한 상품이 있습니다. 청구할인을 받으시려면 불가능한 상품은 따로 결제해주세요
				$("#claim_sale_info00").hide();
				$("#claim_sale_info01").hide();
				$("#claim_sale_info02").hide();
				$("#claim_sale_info03").hide();
				$("#claim_sale_info05").hide();
				$("#claim_sale_info04").show();
				$("#btn_goods_view").attr("style", "");

				if (parseInt(totsttlamt) >= parseInt(claim_sale_aply_lmt_amt) && parseInt(totsttlamt) > 0) {
					$("#frm_inp input[name=select_card_payment_yn]:hidden").val("Y"); //청구할인대상금액은 충족하나 대상상품 + 비대상상품 케이스로 청구할인 적용이 불가능할경우 얼럿 노출을 위해 추가함
				}

			} else { //청구
				$("#claim_sale_info00").hide();
				$("#claim_sale_info01").hide();
				$("#claim_sale_info02").hide();
				$("#claim_sale_info03").hide();
				$("#claim_sale_info05").hide();
				$("#claim_sale_info04").hide();
			}

		} else {
			$("#claim_sale_info00").hide();
			$("#claim_sale_info01").hide();
			$("#claim_sale_info02").show();
			$("#claim_sale_info03").hide();
			$("#claim_sale_info05").hide();
			$("#claim_sale_info04").hide();
		}

	} else if (claim_sale_yn == "Y" && card_sale_yn == "Y") {

		if ($("#frm_inp select[name=iscmcd]").val() == claim_sale_card_knd_cd &&
			$("#frm_inp select[name=iscmcd] option:selected").text() != "카드선택" &&
			parseInt(totsttlamt) >= parseInt(claim_sale_aply_lmt_amt) &&
			parseInt(totsttlamt) > 0) { // 카드 할인 정보 표현
			//청구할인 대상카드를 선택하고 대상상품이고 결제금액구간대에 속해있는경우
			$("#claim_sale_info00").show();
			$("#claim_sale_info01").show();
			$("#claim_sale_info02").hide();
			$("#claim_sale_info03").hide();
			$("#claim_sale_info05").hide();
			$("#claim_sale_info04").hide();

		} else if ($("#frm_inp select[name=iscmcd]").val() == claim_sale_card_knd_cd &&
			$("#frm_inp select[name=iscmcd] option:selected").text() != "카드선택" &&
			parseInt(totsttlamt) < parseInt(claim_sale_aply_lmt_amt) &&
			parseInt(totsttlamt) > 0) {
			//청구할인 대상카드를 선택하고 대상상품이고 결제금액구간대 이하일경우
			$("#claim_sale_info00").hide();
			$("#claim_sale_info01").hide();
			$("#claim_sale_info02").hide();
			$("#claim_sale_info03").show();
			$("#claim_sale_info05").hide();
			$("#claim_sale_info04").hide();

			$("#li_claim_sale_info2").html("<strong>" + $("#frm_inp select[name=iscmcd] option:selected").text() + String(claim_sale_aply_lmt_amt).money() + "원 이상 결제 시 추가 " + fvrval + "% 청구 할인</strong><br/>" + "(단, 개인별 1일 할인한도 최대 " + String(maxamt).money() + "원)");

		} else if ($("#frm_inp select[name=iscmcd] option:selected").text() == "카드선택") {
			$("#claim_sale_info00").hide();
			$("#claim_sale_info01").hide();
			$("#claim_sale_info02").hide();
			$("#claim_sale_info03").hide();
			$("#claim_sale_info05").show();
			$("#claim_sale_info04").hide();
		} else {
			//그외에 무조건 안보이게 처리
			$("#claim_sale_info00").hide();
			$("#claim_sale_info01").hide();
			$("#claim_sale_info02").hide();
			$("#claim_sale_info03").hide();
			$("#claim_sale_info05").hide();
			$("#claim_sale_info04").hide();
		}
	} else {
		$("#claim_sale_info00").hide();
		$("#claim_sale_info01").hide();
		$("#claim_sale_info02").hide();
		$("#claim_sale_info03").hide();
		$("#claim_sale_info05").hide();
		$("#claim_sale_info04").hide();
	}

}

// 20190103 로그인 뒤로가기 개선
function checkFromLoginValueInSessionStorage(predicate) {
	var result = false;
	try {
		var FROM_LOGIN = sessionStorage.getItem('fromLogin');
		if (predicate(FROM_LOGIN)) {
			result = true;
		}
	} catch (e) {
		if (e) {
			result = false;
			console.error(e);
		}
	}

	return result;
}

// 20190103 로그인 뒤로가기 개선
function historyBackToProductView() {
	sessionStorage.removeItem('fromLogin');
	history.go(-2);
}

// 20190103 로그인 뒤로가기 개선
var hasFromLoginValue = checkFromLoginValueInSessionStorage(function (FROM_LOGIN) {
	return FROM_LOGIN === 'Y';
});

if (hasFromLoginValue) {
	history.pushState({
		fromLogin: true
	}, '');
}

$(window).on('popstate', function() {
	// 20190103 로그인 뒤로가기 개선
	if (hasFromLoginValue) {
		historyBackToProductView();
	} else {
		return;
	}
});

$(window).load(function () {
	// 연락처 직접입력 선택
	jQuery.fn.selectMenu = function (options) {
		var $select = $(this);
		var $input = $select.parent().next();
		$select.on("change", function () {
			if ($select.val() == "직접입력") {
				$select.prop("disabled", true).parent().hide();
				$input.prop("disabled", false).show().focus();
				$input.on("click", function () {
					$(this).focus();
				}).trigger("click");
			}
		});
		$input.on("focusin", inputFocusInHandler);

		function inputFocusInHandler() {
			var $select = $(this);
			$input.on("focusout", inputFocusOutHandler);
			$select.val(" ");
			setTimeout(function () {
				$select.val("");
			}, 100);
		}

		function inputFocusOutHandler() {
			$input.off("focusout", inputFocusOutHandler);
			if ($(this).val() == "") {
				$input.prop("disabled", true).hide();
				$select.prop("disabled", false).parent().show();
				$select.find("option:eq(0)").prop("selected", true);
			}
		}
	}
	$(".phone_modi").each(function (index) {
		$(this).selectMenu();
	});
	// 이메일 직접입력
	$(".mail_modi").each(function (index) {
		$(this).selectMenu();
	});

	// 배송메시지 직접입력 선택
	var $delMsg = $(".del_msg");
	var $delMsgInput = $delMsg.parent().siblings(".txt01.mgb0");
	$delMsg.on("change", function () {
		if ($(this).val() == "직접입력") {
			$(this).parent().hide();
			$(this).parent().next().show().focus().click(function () {
				$(this).focus();
			}).trigger("click");
		}
	});
	$delMsgInput.on("focusin", delMsgFocusInHandler);

	function delMsgFocusInHandler() {
		$delMsgInput.on("focusout", delMsgFocusOutHandler);
		var $select = $(this);
		if ($select.val() == "") {
			$select.val(" ");
			setTimeout(function () {
				$select.val("");
			}, 100);
		}
	}

	function delMsgFocusOutHandler() {
		$delMsgInput.off("focusout", delMsgFocusOutHandler);
		if ($(this).val() == "") {
			$delMsgInput.hide();
			$(this).prev().show().children("select")
				.find("option:eq(0)").prop("selected", true);;
		}
	}

	//20150114 롯데포인트 버튼 start
	$(".btn_lotte_point").bind("click", function () {
		$("#card_no1").val("");
		$("#card_no2").val("");
		$("#card_no3").val("");
		$("#card_no4").val("");

		var viewLayer = $(this).parent().parent().next();
		if (viewLayer.css("display") == "none") {
			if ($("input[name=third_coupon]:radio:checked").val() == '0') {
				alert("L.POINT를 사용하시려면 일시불할인을 해제해주세요.");
				return;
			}
			viewLayer.show();
			$(this).text("취소하기");
		} else {
			viewLayer.hide();
			fn_useLottePointCancel();
			$(this).text("본인확인");
		}
	});
	$(".point_cancle").on("click", function () {
		$(".box_lotte_point").hide();
		$(".btn_lotte_point").text("본인확인");
	});

	// 자세히 보기/닫기 (공지사항, OK캐쉬백, 망고)
	$(".box_card_noti .tit_agree_check").bind("click", function () {
		$(this).toggleClass("show").next().toggle();
	});
	// 주문 내역 확인 동의
	$(".box_agree_check .tit_agree_check span").bind("click", function () {
		$(this).parent().toggleClass("show").next().toggle();
	});

	$('input[name^=gift_pkg_]').change(function () { //선물 포장 매장전달 메시지
		var name_ = this.name.replace("gift_pkg_", "");
		//변경한 radio 버튼따라 조절
		if (this.id.indexOf('1') > 0) { //포장
			$(".gift_text textarea").prop("disabled", false);
			$(".gift_text textarea").remove("disabled");
		} else {
			$(".gift_text textarea").prop("disabled", true);
			$(".gift_text textarea").add("disabled");
		}
	});

	//선물포장이 있는 경우 textarea disabled
	if ($("#giftopt1").length > 0) {
		$(".gift_text textarea").prop("disabled", false);
		$(".gift_text textarea").remove("disabled");
	}

	// 주문서간소화 일시불할인
	if (!$("#frm_inp input[name=third_coupon]:radio:first").attr('disabled')) {
		$("#frm_inp input[name=third_coupon]:radio:first").trigger('click');
	}

	//임직원 여부 체크 후에  임직원할인 문구 변경적용_20170714
	var prommtypechk = false;
	for (var xidx = 0; xidx < $("#frm_inp input[name=prommdclcd]").length; xidx++) {
		if ($("#frm_inp input[name=prommdclcd]").eq(xidx).val() == "27") {
			prommtypechk = true;
			break;
		}
	}
	if (prommtypechk) {
		$("#max_dc_label").text("임직원께 드리는 최대혜택입니다.");
	} else {
		$("#max_dc_label").text("최대할인 적용");
	}

	// 쿠폰/할인 정보 조회
	$("#frm_inp select[name=coupon]").change(function () {
		var idx = $(this).val();

		if (maxFirstIdx != idx) { // 최적가 체크 해제
			$("#max_dc").prop("checked", false);
		}

		// 중복할인금액 정보 지우기
		$("span[name=dup_span]").each(function () {
			$(this).html("");
		});

		if (idx != "N") { //N:선택안함
			promcartsn = $("#frm_inp input[name=promcartsn]").eq(idx).val(); // 9
			prommdclcd = $("#frm_inp input[name=prommdclcd]").eq(idx).val(); // 10
			fvrpolctpcd = $("#frm_inp input[name=fvrpolctpcd]").eq(idx).val(); // 04
			totdcamt = $("#frm_inp input[name=totdcamt]").eq(idx).val(); // 쿠폰할인금액 20800
			cpnpromno = $("#frm_inp input[name=cpnpromno]").eq(idx).val(); // 1123188
			cpnrscmgmtsn = $("#frm_inp input[name=cpnrscmgmtsn]").eq(idx).val(); // 0
			adtncostdtlsctnm = $("#frm_inp input[name=adtncostdtlsctnm]").eq(idx).val(); // 롯데카드 5% 할인
			cardkndcd = $("#frm_inp input[name=cardkndcd]").eq(idx).val(); //047
			includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn]").eq(idx).val(); // 2011.05.19 적립여부 N

			// 임직원할인 선택시 물음표 영역 노출 khlee51 
			if (prommdclcd == "27") {
				$("#order .safe_num2").show();
				$('#cover2').on('click', function () {
					$('#staffPop2').hide();
					$(this).hide();
				});
			} else {
				$("#order .safe_num2").hide();
				$("#cover2").off("click");
			}

			// 할인(-n원)
			$("#dcAmt1").html("(<span class=tBold>" + (includeSaveInstCpn == 'Y' ? "" : "-") + String(totdcamt).money() + "</span><span class=\"no_bold\">원" + (includeSaveInstCpn == 'Y' ? " 적립" : "") + "</span>)");
		} else {
			promcartsn = "";
			prommdclcd = "";
			fvrpolctpcd = "";
			totdcamt = "";
			cpnpromno = "";
			cpnrscmgmtsn = "";
			adtncostdtlsctnm = "";
			cardkndcd = "";
			includeSaveInstCpn = ""; // 2011.05.19 적립여부

			// 임직원인 경우 물음표 영역 노출 khlee51 
			$("#order .safe_num2").hide();

			// 개수표시 추가, 모바일주문서간소화, 2015-01-28, hglee4
			// 할인(n개), n = '선택안함'이 아니며 disable 상태가 아닌 선택옵션의 개수
			//$("#dcAmt1").text("");
			$("#dcAmt1").text("(" + $(this).find("option").not("[value=N], :disabled").length + "개)");
		}
		$("#frm_send input[name=promcartsn]").val(promcartsn);
		$("#frm_send input[name=prommdclcd]").val(prommdclcd);
		$("#frm_send input[name=fvrpolctpcd]").val(fvrpolctpcd);
		$("#frm_send input[name=totdcamt]").val(totdcamt);
		$("#frm_send input[name=cpnpromno]").val(cpnpromno);
		$("#frm_send input[name=cpnrscmgmtsn]").val(cpnrscmgmtsn);
		$("#frm_send input[name=adtncostdtlsctnm]").val(adtncostdtlsctnm);
		$("#frm_send input[name=cardkndcd]").val(cardkndcd);
		$("#frm_send input[name=includeSaveInstCpn]").val(includeSaveInstCpn);

		ord_session_clear();
		$("#frm_inp select[name=dup_coupon]").val("N"); // 중복 쿠폰 사용안함으로 셋팅

		$("#frm_inp select[name=dup_coupon]").find("option").each(function () { // 중복쿠폰 임직원 외 활성화, 임직원 비활성화
			$(this).attr("disabled", false);

			if (prommdclcd == "10" && cardkndcd != "") { // 카드할인쿠폰
				if (($("#frm_inp input[name=prommdclcd_dup]:eq(" + $(this).val() + ")").val() == "30" && cardkndcd == $("#frm_inp input[name=cardkndcd_dup]:eq(" + $(this).val() + ")").val()) ||
					$("#frm_inp input[name=cardkndcd_dup]:eq(" + $(this).val() + ")").val() == "") { // 같은 중복카드쿠폰이거나 중복카드쿠폰이 아니면
					$(this).attr("disabled", false);
				} else {
					$(this).attr("disabled", true);
				}
			} else {
				$(this).attr("disabled", false);
			}

			// 임직원할인 또는 배송지 2개이상 선택 시 중복쿠폰 선택 불가 및 초기화
			if (prommdclcd == "27" || fn_getDeliCnt() > 1) {
				if ($(this).val() != "N") {
					$(this).attr("disabled", true);
					$(this).prop("disabled", true);
				}
			} else {
				// 중복쿠폰 활성화 체크
				if (multi_prom_cnt > 0) {
					for (var i = 0; i < multi_prom.length; i++) {
						if (multi_prom[i][0] == cpnpromno && multi_prom[i][1] == $("#frm_inp input[name=cpnpromno_dup]:eq(" + $(this).val() + ")").val() && parseInt(multi_prom[i][2]) < 1) { // 중복쿠폰 할인금액이  없을 경우 
							$(this).attr("disabled", true);
						}
					}
				}
			}

			// 중복할인쿠폰 체크 : 선택된 쿠폰과 같이 쓸 수 없는 쿠폰 비활성화
			if (idx != "N" && $(this).val() != "N") {
				var first_cpn = (cpnpromno == "0" ? prommdclcd : cpnpromno);
				var cpnpromno_dup = $("#frm_inp input[name=cpnpromno_dup]").eq($(this).val()).val(); // 중복쿠폰 프로모션 번호
				var v_cpn_crd_dc_amt = 0;

				var tmp_arr_cnt = 0;
				var tmp_arr;

				if (idx == undefined || idx == "N") {
					tmp_arr = single_prom;
					tmp_arr_cnt = single_prom_cnt;
				} else { // 1차쿠폰 + 중복쿠폰 사용
					tmp_arr = multi_prom;
					tmp_arr_cnt = multi_prom_cnt;
					first_cpn = (cpnpromno == "0" ? prommdclcd : cpnpromno);
				}

				if (Number(tmp_arr_cnt) > 0) {
					for (var i = 0; i < tmp_arr.length; i++) {
						if (tmp_arr[i][0] == first_cpn &&
							tmp_arr[i][1] == cpnpromno_dup) {
							v_cpn_crd_dc_amt = tmp_arr[i][2];
							break;
						}
					}
					if (parseInt(v_cpn_crd_dc_amt) <= 0) {
						// 사용불가처리
						$(this).attr("disabled", true);
						$(this).prop("disabled", true);
					}
				}
			}
			// End
		});
		$("#frm_inp select[name=dup_coupon]").attr('disabled', false);
		$("#frm_inp select[name=dup_coupon]").prop('disabled', false);

		// 2, 3차 쿠폰 할인 정보 지우기
		init_cpn_info("N", "Y", "Y");

		$("#frm_inp select[name=dup_coupon]").attr('disabled', false);
		$("#frm_inp select[name=dup_coupon]").prop('disabled', false);
		$("#frm_inp input[name=third_coupon]:radio:last").attr('checked', true); // 3차 쿠폰 사용안함으로 셋팅
		$("#frm_inp input[name=third_coupon]:radio:last").prop('checked', true); // 3차 쿠폰 사용안함으로 셋팅

		$("#frm_inp input[name=third_coupon]:radio").each(function () { // 3차쿠폰 임직원 외 활성화, 임직원 비활성화
			$(this).attr("disabled", false);
			$(this).prop("disabled", false);

			// 임직원할인 선택 시 중복쿠폰 선택 불가 및 초기화
			if (prommdclcd == "27") {
				$(this).attr("disabled", true);
				$(this).prop("disabled", true);
			}
		});
		$("#frm_inp input[name=third_coupon]:radio:last").attr('disabled', false);
		$("#frm_inp input[name=third_coupon]:radio:last").prop('disabled', false);
		$("#frm_inp input[name=third_coupon]:radio:last").click();

		select_coupon();

		// 20160108 박형윤 임직원할인일 경우 LPOINT 임시 감춤처리
		if (idx == 0) {
			$(".order_tp #lottepointSave .lottepointOrange").hide();
		} else {
			$(".order_tp #lottepointSave .lottepointOrange").show();
		}

		lPointChange(); // L.POINT 재계산 호출

	});

	// 중복쿠폰
	$("#frm_inp select[name=dup_coupon]").click(function () {
		// 임직원 할인 인 경우
		if ("27" == $("#frm_send input[name=prommdclcd]").val()) {
			alert("임직원할인 적용 시 추가할인 및 일시불할인 혜택을 받으실 수 없습니다.");
			$(this).attr("disabled", true);
			$(this).prop("disabled", true);
			$(this).val("N");
			$("#frm_inp select[name=dup_coupon]").change();
			return;
		}
	});

	// 중복쿠폰
	$("#frm_inp select[name=dup_coupon]").change(dup_coupon_select);

	// 3차쿠폰 (일시불할인)
	$("#frm_inp input[name=third_coupon]:radio").click(function () {
		var idx = $(this).val();

		if (idx != 'N') {
			promcartsn = $("#frm_inp input[name=promcartsn_third]").eq(idx).val();
			prommdclcd = $("#frm_inp input[name=prommdclcd_third]").eq(idx).val();
			fvrpolctpcd = $("#frm_inp input[name=fvrpolctpcd_third]").eq(idx).val();
			if (prommdclcd == "35") {
				totdcamt = $("#frm_inp input[name=lumpSumFvrVal]").val(); // 일시불할인금액
			} else {
				totdcamt = $("#frm_inp input[name=totdcamt_third]").eq(idx).val(); // 쿠폰할인금액
			}
			cpnpromno = $("#frm_inp input[name=cpnpromno_third]").eq(idx).val();
			cpnrscmgmtsn = $("#frm_inp input[name=cpnrscmgmtsn_third]").eq(idx).val();
			adtncostdtlsctnm = $("#frm_inp input[name=adtncostdtlsctnm_third]").eq(idx).val();
			cardkndcd = $("#frm_inp input[name=cardkndcd_third]").eq(idx).val();
			includeSaveInstCpn = $("#frm_inp input[name=includeSaveInstCpn_third]").eq(idx).val(); // 2011.05.19 적립여부
			$("#dcAmt3").html("(-" + String(totdcamt).money() + "<span class=\"no_bold\">원</span>)");

			if ("none" != $("#useLottePoint").css("display")) {
				$("#lt_point_amt_btn").click();
				fn_useLottePointCancel();
			}

		} else {
			promcartsn = "";
			prommdclcd = "";
			fvrpolctpcd = "";
			totdcamt = "";
			cpnpromno = "";
			cpnrscmgmtsn = "";
			adtncostdtlsctnm = "";
			cardkndcd = "";
			includeSaveInstCpn = ""; // 2011.05.19 적립여부 
			$("#dcAmt3").text("");
		}
		$("#frm_send input[name=promcartsn_third]").val(promcartsn);
		$("#frm_send input[name=prommdclcd_third]").val(prommdclcd);
		$("#frm_send input[name=fvrpolctpcd_third]").val(fvrpolctpcd);
		$("#frm_send input[name=totdcamt_third]").val(totdcamt);
		$("#frm_send input[name=cpnpromno_third]").val(cpnpromno);
		$("#frm_send input[name=cpnrscmgmtsn_third]").val(cpnrscmgmtsn);
		$("#frm_send input[name=adtncostdtlsctnm_third]").val(adtncostdtlsctnm);
		$("#frm_send input[name=cardkndcd_third]").val(cardkndcd);
		$("#frm_send input[name=includeSaveInstCpn_third]").val(includeSaveInstCpn);

		select_third_coupon();

		lPointChange(); // L.POINT 재계산 호출
	});

	// 현금영수증 선택
	$("#frm_inp input[name=rdo_cash]:radio").click(function () {
		cash_val = $(this).val();

		$("#pers_select").hide();
		$("#pers_value").hide();
		$("#co_value").hide();

		if (cash_val == "1") {
			$("#pers_select").show();
			$("#pers_value").show();
			$("#co_value p > input").val("");
		} else if (cash_val == "2") {
			$("#co_value").show();
			$("#pers_value span > input").val("");
		}

	});

	// 현금영수증 소득공제용 선택
	$("#frm_inp select[name=cr_issu_mean_sct_cd]").change(function () {
		sct_cd = $(this).val();

		$("#cash_receipts02").hide();
		$("#cash_receipts03").hide();
		$("#cash_receipts04").hide();
		$("#cash_receipts05").hide();
		$("#cash_receipts06").hide();
		$("#pers_value span > input").val("");

		if (sct_cd == "1") {
			$("#cash_receipts02").show();
		} else if (sct_cd == "3") {
			$("#cash_receipts03").show();
			setCellNo();
		} else if (sct_cd == "4") {
			$("#cash_receipts04").show();
		} else if (sct_cd == "5") {
			$("#cash_receipts05").show();
		} else {
			$("#cash_receipts06").show();
		}
	});

	//최근결제수단 선택전 해당 결제수단 결제가능한지 체크
	function paytypeDisableCheck(clickVal, tempVal) {
		var clickIdx;
		if (clickVal == PAYTYPE_CODE_CARD) {
			clickIdx = "1";
		} else if (clickVal == PAYTYPE_CODE_BANK) {
			clickIdx = "2";
		} else if (clickVal == PAYTYPE_CODE_PHONE) {
			clickIdx = "3";
		} else if (clickVal == PAYTYPE_CODE_LPAY) {
			clickIdx = "4";
		} else if (clickVal == PAYTYPE_CODE_NAVERPAY) {
			clickIdx = "5";
		}
		var id = '#pay_type' + clickIdx;
		var idHassYn = $(id).hasClass('disable');
		console.log("idHassYn : " + idHassYn);
		if (idHassYn) {
			var tempIdx;
			if (tempVal == PAYTYPE_CODE_CARD) {
				tempIdx = "1";
			} else if (tempVal == PAYTYPE_CODE_BANK) {
				tempIdx = "2";
			} else if (tempVal == PAYTYPE_CODE_PHONE) {
				tempIdx = "3";
			} else if (tempVal == PAYTYPE_CODE_LPAY) {
				tempIdx = "4";
			} else if (tempVal == PAYTYPE_CODE_NAVERPAY) {
				tempIdx = "5";
			}
			console.log("selPayType c");
			selPayType(tempIdx);
		}
		return idHassYn;
	}

	//결제타입 카드 셋팅 
	function payTypeCodeCardSetting() {
		sendTclick('order_Clk_Btn_6');
		selPayType(1);
		createCardType();
		$("#pay_bank").hide();
		$("#pay_card").show();
		$("#pay_phone").hide();
		$("#pay_naverPay").hide();

		$("#no_lpay_card").hide();
		$(".box_Lpay_agree_check").hide();
		$("#card_select").show();
		$("#pay_card > dl").show();

		$("input[name=temp_paytype]:hidden").val(0);

		// 20151222 박형윤 L-PAY 카드 안내 긴급 조치
		$("#SHINHAN_CARD_LAYER").hide();
		$("input[name='sinhan_point'][type=radio][value=N]").click();
		$("#BC_CARD_LAYER").hide();
		$("input[name='bc_point'][type=radio][value=N]").click();
		$("#SAMSUNG_CARD_LAYER").hide();
		$("input[name='samsung_point'][type=radio][value=N]").click();
		// 2016.05.18
		$("#KB_CARD_LAYER").hide();
		$("input[name='kb_point'][type=radio][value=N]").click();
		$("#LOTTE_CARD_LAYER").hide();

		//2016.02.25 결제수단별 공지사항 시작
		$("#pay_notice_lpay").hide();
		$("#pay_notice_card").show(); //카드공지사항 노출
		$("#pay_notice_bank").hide();
		$("#pay_notice_phone").hide();
		$("#pay_notice_naverpay").hide();
		//2016.02.25 끝
	}
	//결제타입 무통장 셋팅 
	function payTypeCodeBankSetting() {
		sendTclick('order_Clk_Btn_8');
		selPayType(2);
		$("#pay_card").hide();
		$("#pay_bank").show();
		$("#pay_phone").hide();
		$("#pay_naverPay").hide();
		setCellNo();

		//2016.02.25 결제수단별 공지사항 시작
		$("#pay_notice_lpay").hide();
		$("#pay_notice_card").hide();
		$("#pay_notice_bank").show(); //무통장입금노출
		$("#pay_notice_phone").hide();
		$("#pay_notice_naverpay").hide();
		//2016.02.25 끝
	}
	//결제타입 휴대폰결제 셋팅
	function payTypeCodePhoneSetting() {
		sendTclick('order_Clk_Btn_7');
		selPayType(3);
		$("#pay_card").hide();
		$("#pay_bank").hide();
		$("#pay_phone").show();
		$("#pay_naverPay").hide();

		//2016.02.25 결제수단별 공지사항 시작
		$("#pay_notice_lpay").hide();
		$("#pay_notice_card").hide();
		$("#pay_notice_bank").hide();
		$("#pay_notice_phone").show(); //휴대폰결제노출
		$("#pay_notice_naverpay").hide();
		//2016.02.25 끝
	}
	//결제타입 L.pay 셋팅
	function payTypeCodeLpaySetting() {
		sendTclick('order_Clk_Btn_5');
		lpayCertInfo(); // L.pay WEB : 사용자 인증
	}
	//결제타입 N.pay 셋팅
	function payTypeCodeNpaySetting() {
		sendTclick('order_Clk_Btn_5'); //확인!!!!!!!!!!!!!!!!!!!!추가?
		selPayType(5);
		$("#pay_card").hide();
		$("#pay_bank").hide();
		$("#pay_phone").hide();
		$("#pay_naverPay").show();
		setCellNo();

		//2016.02.25 결제수단별 공지사항 시작
		$("#pay_notice_lpay").hide();
		$("#pay_notice_card").hide();
		$("#pay_notice_bank").hide();
		$("#pay_notice_phone").hide(); //휴대폰결제노출
		$("#pay_notice_naverpay").show();
	}

	//결제수단 Click
	$("#frm_inp input[name=rdo_paytype]:radio").click(function () {
		var card_coupon_use = false;
		var tempPayTypeVal = $("#frm_inp input[name=paytype]:hidden").val();

		if (paytypeDisableCheck($(this).val(), tempPayTypeVal)) return; //최근결제수단 선택전 해당 결제수단 결제가능한지 체크

		$("#frm_inp input[name=paytype]:hidden").val($(this).val());
		console.log("this value : " + $(this).val());
		var temp_paytype = $("input[name=temp_paytype]:hidden").val(); //L.pay 관련 처리 내역(인증) 있으면 값이 있음
		var clickPayType = $("#frm_inp input[name=paytype]:hidden").val();

		coupon_cd = $("#frm_send input[name=prommdclcd]").val();
		coupon_cardcd = $("#frm_send input[name=cardkndcd]").val();
		// 중복카드할인쿠폰 선택되어 있을 경우 초기화 처리
		coupon_cd_dup = $("#frm_send input[name=prommdclcd_dup]").val();
		coupon_cardcd_dup = $("#frm_send input[name=cardkndcd_dup]").val();

		var payTypeCard = $('#pay_type1').hasClass('disable');
		var payTypeBank = $('#pay_type2').hasClass('disable');
		var payTypePhone = $('#pay_type3').hasClass('disable');
		var payTypeLpay = $('#pay_type4').hasClass('disable');
		var payTypeNPay = $('#pay_type5').hasClass('disable');

		$(".btn_addpay").hide(); // L.pay WEB : 결제수단 등록 버튼 가림

		// 카트 할인 체크(무통장||휴대폰||네이버페이)
		if ((coupon_cd != '' && coupon_cardcd != '') && (clickPayType == PAYTYPE_CODE_BANK || clickPayType == PAYTYPE_CODE_PHONE || clickPayType == PAYTYPE_CODE_NAVERPAY)) {

			$("#frm_inp select[name=iscmcd]").val(cardkndcd);
			alert("카드 할인쿠폰 및 적립쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
			if (!payTypeCard) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").prop('checked', true);
				payTypeCodeCardSetting();
				console.log("cardkndcd : " + cardkndcd);
				$("#frm_inp select[name=iscmcd]").val(cardkndcd);
				init_cardselect();
				$("#frm_inp select[name=iscmcd]").change(); // 할인정보 재조회
			} else if (temp_paytype == 3 && !payTypeLpay) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").prop('checked', true);
				payTypeCodeLpaySetting();
				console.log("cardkndcd : " + cardkndcd);
				$("#frm_inp select[name=iscmcd]").val(cardkndcd);
				init_cardselect();
				$("#frm_inp select[name=iscmcd]").change(); // 할인정보 재조회
			} else {
				if (!payTypeBank) {
					$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").prop('checked', true);
					payTypeCodeBankSetting();
				}
			}

			// 중복카드할인쿠폰 체크(무통장||휴대폰||네이버페이)
		} else if ((coupon_cd_dup != '' && coupon_cardcd_dup != '') && (clickPayType == PAYTYPE_CODE_BANK || clickPayType == PAYTYPE_CODE_PHONE || clickPayType == PAYTYPE_CODE_NAVERPAY)) {
			alert("중복카드 할인쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
			if (!payTypeCard) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").prop('checked', true);
				payTypeCodeCardSetting();
				console.log("cardkndcd : " + cardkndcd);
				$("#frm_inp select[name=iscmcd]").val(coupon_cardcd_dup);
				init_cardselect();
				$("#frm_inp select[name=iscmcd]").change(); // 할인정보 재조회

			} else if (temp_paytype == 3 && !payTypeLpay) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").prop('checked', true);
				payTypeCodeLpaySetting();
				console.log("cardkndcd : " + cardkndcd);
				$("#frm_inp select[name=iscmcd]").val(coupon_cardcd_dup);
				init_cardselect();
				$("#frm_inp select[name=iscmcd]").change(); // 할인정보 재조회

			} else {
				if (!payTypeBank) {
					$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").prop('checked', true);
					payTypeCodeBankSetting();
				}
			}

			// 일시불 할인 체크(휴대폰||네이버페이)
		} else if ($("#frm_send input[name=prommdclcd_third]").val() == "35" && (clickPayType == PAYTYPE_CODE_PHONE || clickPayType == PAYTYPE_CODE_NAVERPAY)) {
			if (clickPayType == PAYTYPE_CODE_PHONE) alert("일시불 할인을 받으시면 휴대폰결제를 하실수 없습니다.");
			if (clickPayType == PAYTYPE_CODE_NAVERPAY) alert("일시불 할인을 받으시면 네이버페이 결제를 하실수 없습니다.");
			if (temp_paytype == 3 && !payTypeLpay) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").prop('checked', true);
				payTypeCodeLpaySetting();
			} else if (!payTypeCard) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").prop('checked', true);
				payTypeCodeCardSetting();
			} else {
				if (!payTypeBank) {
					$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").prop('checked', true);
					payTypeCodeBankSetting();
				}
			}
			//init_cardselect();
			//getCardInsCheck();
		} else if (clickPayType == PAYTYPE_CODE_CARD) {
			payTypeCodeCardSetting();

		} else if (clickPayType == PAYTYPE_CODE_BANK) {
			payTypeCodeBankSetting();

		} else if (clickPayType == PAYTYPE_CODE_PHONE) {
			payTypeCodePhoneSetting();

		} else if (clickPayType == PAYTYPE_CODE_LPAY) {
			payTypeCodeLpaySetting();

		} else if (clickPayType == PAYTYPE_CODE_NAVERPAY) {
			payTypeCodeNpaySetting();

		}

		setCashReceiptArea(); // 현금영수증 영역 컨트롤
		getCardInsCheck(); // 2011.06.07 추가(결제수단 변경 시 카드 정보 초기화)

		//L.pay 사용자 인증되었을때는 L.pay로 결제시 L.POINT 본인확인 없이 사용가능
		if ($("#frm_send input[name=lt_cd_no]:hidden").val() == "") {
			if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_LPAY && $("input[name=third_coupon]:radio:checked").val() != '0') {
				$("#useLottePoint").hide();
				$("#chk_lt_point").attr("disabled", false);
				ltPointCert = "Y";
				$("#lt_point_amt_btn").hide();
				$("#lt_point_amt").show();
				if ($("#temp_lt_point_amt").val() != "") {
					$("#chk_lt_point").prop("checked", true);
					$("#lt_point_amt").val($("#temp_lt_point_amt").val());
				}
			} else {
				$("#lt_point_amt").val("");
				$("#chk_lt_point").prop("checked", false);
				$("#chk_lt_point").attr("disabled", true);
				ltPointCert = "N";
				$("#lt_point_amt").hide();
				$("#lt_point_amt_btn").show();
			}
			fn_calcTotalPrice();
		}
		$("#laver_Lpay_order").hide();

		/*********************************************
		 * 청구할인로직변경S
		 *********************************************/
		if (clickPayType == PAYTYPE_CODE_LPAY || clickPayType == PAYTYPE_CODE_CARD) {
			if ("Y" == card_sale_yn || "Y" == claim_sale_yn) {
				fn_cardsavegoods();
			}
		}
		/*********************************************
		 * 청구할인로직변경E
		 *********************************************/

	});

	//L.pay 외 결제수단으로 L.POINT 사용시 비밀번호 입력레이어로 이동
	$("#input_lpoint_pw").click(function () {
		$("#laver_Lpay_order").hide();
		$("#lt_point_amt_btn").show();
		$("#lt_point_amt").hide();
		if ($("#useLottePoint").css("display") == "none") {
			$("#lt_point_amt_btn").trigger("click");
		}
		//20160218
		$('html, body').scrollTop($("#pay_info2").offset().top - 49); // 비밀번호 입력 클릭시 참좋은 혜택 최상단 위치 khlee51
		setTimeout(function () {
			$("#card_passwd").focus(); // Lpoint 입력 포커싱
		}, 500);
	});

	//선물포장, 종이카드 팝업
	$('.safe_num[class*=gift_]').click(function () {

		var clsNm = $(this).attr('class').match(/\b(gift_).*?\b/),
			popNm = '.gift_pop.' + clsNm;

		//선물하기 1차 추가_20160519_선물포장 상품명 세팅
		if (clsNm[0] == "gift_wrap") {
			var nameGift = $(this).attr('name');
			var nameGiftIdx = nameGift.substring(nameGift.lastIndexOf("_") + 1) - 1;

			var nmGiftGoods = $(".order_goods input[name=bene_prod_gift_" + nameGiftIdx + "]:hidden").val();
			$(".gift_pop .brand").text(nmGiftGoods);

			var freeImgIdx = nameGiftIdx + 1;

			var freeImg = $("#frm_inp input[name=free_img_url_" + freeImgIdx + "]:hidden").val();
			$(".free_img_url_cls").attr("src", freeImg);
		}
		//선물하기 1차 추가_20160519

		$('#pageCover').show();
		$(popNm).show().css('margin-top', $(popNm).height() / -2);
		$(popNm).find('.gift_con').css('height', 'auto').height($(popNm).height() - 45);
		$('.gift_pop .gift_pop_cls').unbind('click').bind('click', function () {
			$('#pageCover').hide();
			$(popNm).hide();
			return false;
		});
		return false;
	});



	// 아래부터 주문서에서 가져온 js
	// 오류로 개인정보보호 브라우징 여부체크
	try {
		sessionStorage.setItem("safe_browsing", "Y");
		sessionStorage.removeItem("safe_browsing");
	} catch (e) {
		alert('아이폰 설정을 확인/수정하시기 바랍니다. [설정]>[Safari]>[개인정보 보호 브라우징] 해제');
	}
	// 초기화
	init();
	init_cardinstmon();
	// 배송지 주소 출력
	// 받는 분 세팅
	//icjung 20150707
	$("dd.deli_" + $("input[name=deli_select]").val()).show();
	var name1 = "deli_" + $("input[name=deli_select]").val();
	var objNm1 = $("#frm_inp input[name=" + name1 + "]:hidden").val();
	$("#frm_inp input[name=defaultNm]:hidden").val(objNm1);
	// var meg = ' 님께서 보내시는 선물입니다.';
	//$("#frm_inp input[name=sendM]:hidden").val(meg);

	// 주문동의 및 비회원약관 
	//$('.nonmember_order_agree dt span.button a').click(function(){
	//	$(this).parent().parent().parent().toggleClass('on');
	//	return false;
	//});


	// 선물메시지 입력 선택
	$("#frm_inp input[name^=gift_yn_]:radio").click(function () {

		var gift_yn_nm = $(this).attr("name");
		var deli_idx = gift_yn_nm.substring(gift_yn_nm.lastIndexOf("_") + 1);
		var card_msg = " 님, 언제나 많은 사랑과 관심에 감사드립니다. 앞으로도 건강하시고 행복하시길 바랍니다.";

		//선물하기 1차 작업관련 추가_20160513
		var deli_idx_new = 1;
		var prodTotCnt = $("#frm_inp input[name=prodTotalCnt]:hidden").val(); //상품건수

		// 단일배송인 경우_선택된 작성 값 세팅
		if (!$("#chk_multi_dlvp").prop("checked")) {
			$("#frm_inp input[name=gift_msg_y_index]:hidden").val(deli_idx);
		}
		//선물하기 1차 작업관련 추가_20160513

		if ($("#frm_inp input[name=" + gift_yn_nm + "]:radio:checked").val() == '1') {

			// 수량 체크
			var ord_qty = 0;
			var card_msg_arr = new Array();
			var happy_call_arr = new Array();
			var re_name = "";
			var msg_idx = 0;
			var happy_call_yn = "N";

			// 복수배송일 경우
			if ($("#chk_multi_dlvp").prop("checked")) {

				$("input[name^=multi_prod_][name$=_" + deli_idx + "]").each(function () { // 배송지에 해당하는 상품의 수량 및 이름 체크
					ord_qty += $(this).val();

					re_name = $(this).attr("name").replace("multi_prod_", ""); // 1278448375_1
					card_msg_arr[msg_idx] = "card_msg_info_" + re_name;
					happy_call_arr[msg_idx] = "happy_call_info_" + re_name;
					msg_idx++;
				});

				if (ord_qty < 1) {
					alert("보낼 상품 수량을 선택해 주세요.");
					$("#frm_inp input[name=" + gift_yn_nm + "]:visible:last").prop("checked", true);
					$("#frm_inp input[name=" + gift_yn_nm + "]:visible:last").click();
					return;
				} else {
					var card_msg_yn = "N";
					for (var i = 0; i < card_msg_arr.length; i++) {
						re_name = card_msg_arr[i].replace("card_msg_info_", "");
						ord_qty = $("input[name=multi_prod_" + re_name + "]").val();
						if (ord_qty > 0 && $("#" + card_msg_arr[i]).val() == "Y") { // 카드 메시지 작성 가능 상품 수량 지정 한 경우 
							card_msg_yn = "Y";

							if ($("#" + happy_call_arr[i]).val() == "Y") {
								card_msg = "정겨움과 따스함이 가득한 명절이 되시길 진심으로 기원합니다.";
								happy_call_yn = "Y";
							}
						}
					}

					$("#hpcl_msg_" + deli_idx).val(happy_call_yn); // 배송지별 해피콜 메시지 여부

					if (card_msg_yn == "N") {
						alert("메시지 작성이 가능한 상품이 없습니다.");
						$("#frm_inp input[name=" + gift_yn_nm + "]:visible:last").attr("checked", true);
						$("#frm_inp input[name=" + gift_yn_nm + "]:visible:last").prop("checked", true);
						return;
					}
				}
			} else {

				if ($("#tot_card_yn").val() == "Y" && $("#tot_happy_yn").val() == "Y") {
					card_msg = "정겨움과 따스함이 가득한 명절이 되시길 진심으로 기원합니다.";
					happy_call_yn = "Y";
				}
			}

			// 선물메시지 디폴트  출력
			var nm;

			//선물하기 1차 작업 관련 수정-20160513_단일배송일 경우에만 수정!
			// 복수배송일 경우_기존대로
			if ($("#chk_multi_dlvp").prop("checked")) {

				for (var j = 2; j <= prodTotCnt; j++) {
					$("#frm_inp #giftMs_" + j).hide();
					$("#gift_none_msg_" + j).hide();
				}

				if ("Y" != grockle_yn) {
					$("dd[name^=gift_msg_form_" + deli_idx + "]").show();

					// 내 배송지 - 받는분, 메시지, 보내는분
					var objNm = $("#deli_" + deli_idx + " input[name=inprmitnm]").val();
					if (objNm != "") {
						$("#frm_inp input[name=receivename_" + deli_idx + "]").val(objNm + " 님");
						$("#sendmessage_" + deli_idx).val((happy_call_yn == "N" ? objNm : "") + card_msg);
					}

					// 새로운 배송지 - 받는분, 메시지, 보내는분
					var nm1 = $("#deli_" + deli_idx + " #li_new input[name=inprmitnm]").val();
					if (nm1 != "") {
						$("#frm_inp #li_new input[name=receivename_" + deli_idx + "]").val(nm1 + " 님");
						$("#sendmessage_" + deli_idx).val((happy_call_yn == "N" ? nm1 : "") + card_msg);
					}

					$("#frm_inp input[name=sendname_" + deli_idx + "]").val($("#nameSp").text() + "드림"); // 보내는 이
				} else {
					$("#frm_inp input[name=receivename_" + deli_idx + "]").val('');
					var nm1 = $("#deli_" + deli_idx + " input[name=inprmitnm]").val();
					var nm2 = $("#frm_inp input[name=grockle_name]").val(); // 주문자
					if (nm1 != "") {
						nm1 = nm1 + " 님";
						$("#frm_inp input[name=receivename_" + deli_idx + "]").val(nm1);
						$("#frm_inp textarea[name=sendmessage_" + deli_idx + "]").val((happy_call_yn == "N" ? nm1 : "") + card_msg);
					}
					if (nm2 != "") {
						$("#frm_inp input[name=sendname_" + deli_idx + "]").val(nm2 + "드림");
					}
				}

				// 선물메시지 디폴트 출력 끝
				$("dd[name^=gift_msg_form_" + deli_idx + "]").show();
				$("#gift_none_msg_" + deli_idx).hide(); //선물하기 1차 작업관련 추가_160516_동일메세지 문구 hide
			} else { //단일배송일 경우

				$("#frm_inp .gift_msgMultiInsert input[name=gift_yn_1]:radio[value='1']").prop("checked", true);
				$("#frm_inp .gift_msgMultiInsert input[name=gift_yn_1]:radio[value='2']").prop("checked", false);

				//선택안된 상품의 문구처리할 종이카드 확인					
				for (var j = 2; j <= prodTotCnt; j++) {

					//선택안된 종이카드인 경우
					if (deli_idx != j) {
						//선택된거 외에 전부 hide							
						$("#frm_inp .gift_msg_sel_" + j + " input[name^=gift_yn_" + j + "]:radio[value='1']").prop("checked", true);
						$("#frm_inp .gift_msg_sel_" + j + " input[name^=gift_yn_" + j + "]:radio[value='2']").prop("checked", false);

						$("#frm_inp #giftMs_" + j).hide();
						$("#gift_none_msg_" + j).show();
					}
				}

				if ("Y" != grockle_yn) {
					$("#frm_inp #giftMs_" + deli_idx).show();
					$("#gift_none_msg_" + deli_idx).hide();

					// 내 배송지 - 받는분, 메시지, 보내는분
					var objNm = $("#deli_" + deli_idx_new + " #li_mine input[name=inprmitnm]").val();
					//						var objNm = $(".gift_msgMultiInsert input[name=defultRecvNm]:hidden").val();
					if (objNm != "") {
						$("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val(objNm + " 님"); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp input[name=receivename_" + deli_idx + "]").val(objNm + " 님");

						$(".gift_msgMultiInsert #sendmessage_1").val((happy_call_yn == "N" ? objNm : "") + card_msg); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp textarea[name=sendmessage_" + deli_idx + "]").val((happy_call_yn == "N" ? objNm : "") + card_msg);
					}

					// 새로운 배송지 - 받는분, 메시지, 보내는분
					var nm1 = $("#deli_" + deli_idx_new + " #li_new input[name=inprmitnm]").val();
					if (nm1 != "") {
						$("#frm_inp .gift_msgMultiInsert input[name=receivename_1").val(nm1 + " 님"); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp input[name=receivename_" + deli_idx + "]").val(nm1 + " 님");

						$(".gift_msgMultiInsert #sendmessage_1").val((happy_call_yn == "N" ? nm1 : "") + card_msg); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp textarea[name=sendmessage_" + deli_idx + "]").val((happy_call_yn == "N" ? nm1 : "") + card_msg);
					}

					$("#frm_inp .gift_msgMultiInsert input[name=sendname_1").val($("#nameSp").text() + "드림"); // 보내는 이 //선물하기 1차 작업관련 추가_160516
					$("#frm_inp input[name=sendname_" + deli_idx + "]").val($("#nameSp").text() + "드림"); // 보내는 이
				} else {
					$("#frm_inp .gift_msgMultiInsert input[name=receivename_1").val(''); //선물하기 1차 작업관련 추가_160516
					$("#frm_inp input[name=receivename_" + deli_idx_new + "]").val('');
					var nm1 = $("#deli_" + deli_idx_new + " input[name=inprmitnm]").val();
					var nm2 = $("#frm_inp input[name=grockle_name]").val(); // 주문자
					if (nm1 != "") {
						nm1 = nm1 + " 님";
						$("#frm_inp .gift_msgMultiInsert input[name=receivename_1").val(nm1); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp input[name=receivename_" + deli_idx + "]").val(nm1);
						$("#frm_inp .gift_msgMultiInsert textarea[name=sendmessage_1").val((happy_call_yn == "N" ? nm1 : "") + card_msg); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp textarea[name=sendmessage_" + deli_idx + "]").val((happy_call_yn == "N" ? nm1 : "") + card_msg);
					}
					if (nm2 != "") {
						$("#frm_inp .gift_msgMultiInsert input[name=sendname_1").val(nm2 + "드림"); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp input[name=sendname_" + deli_idx + "]").val(nm2 + "드림");
					}
				}

				// 선물메시지 디폴트 출력 끝
				$(".giftMs_" + deli_idx + " dd[name^=gift_msg_form_" + deli_idx + "]").show();
				$("#gift_none_msg_" + deli_idx).hide(); //선물하기 1차 작업관련 추가_160516_동일메세지 문구 hide
			}
		}
		// 메시지카드 작성안함
		else {
			//선물하기 1차 작업관련 추가_160516 start
			if (!$("#chk_multi_dlvp").prop("checked")) { //단일배송
				$("#frm_inp .gift_msgMultiInsert input[name=gift_yn_1]:radio[value='1']").prop("checked", false);
				$("#frm_inp .gift_msgMultiInsert input[name=gift_yn_1]:radio[value='2']").prop("checked", true);

				$("#frm_inp .gift_msgMultiInsert input[name=receivename_1").val("");
				$(".gift_msgMultiInsert #sendmessage_1").val("");
				$("#frm_inp .gift_msgMultiInsert input[name=sendname_1").val("");

				//선택안된 상품의 문구처리할 종이카드 확인					
				for (var k = 2; k <= prodTotCnt; k++) {
					$("#frm_inp .gift_msg_sel_" + k + " input[name^=gift_yn_" + k + "]:radio[value='1']").prop("checked", false);
					$("#frm_inp .gift_msg_sel_" + k + " input[name^=gift_yn_" + k + "]:radio[value='2']").prop("checked", true);

					$("#gift_none_msg_" + k).hide();
					$("dd[name^=gift_msg_form_" + k + "]").hide();
				}
				//선물하기 1차 작업관련 추가_160516 end
			} else { //복수배송
				$("#frm_inp input[name=receivename_" + deli_idx + "]").val("");
				$("#sendmessage_" + deli_idx).val("");
				$("#frm_inp input[name=sendname_" + deli_idx + "]").val("");

				$("dd[name^=gift_msg_form_" + deli_idx + "]").hide();
			}

			$("#gift_none_msg_" + deli_idx).hide(); //선물하기 1차 작업관련 추가_160516_동일메세지 문구 hide
		}
		chkSendMsgLimit('sendmessage_' + deli_idx, 150, 'sendmessagebyte_' + deli_idx); //메시지 길이 체크
	});

	// 아시아나 동의
	$("#info_agree_check").change(function () {
		if ($("#info_agree_check").prop("checked")) {
			$("#ip_asianaNo").prop("disabled", false);
		} else {
			$("#ip_asianaNo").val("");
			$("#ip_asianaNo").prop("disabled", true);
		}
	});

	// OK캐쉬백 동의
	$("#ocb_agree, #ocb_offer_agree").change(function () {
		if ($("#ocb_agree").prop("checked") && $("#ocb_offer_agree").prop("checked")) {
			$("#ocb_card_no1").prop("disabled", false);
			$("#ocb_card_no2").prop("disabled", false);
			$("#ocb_card_no3").prop("disabled", false);
			$("#ocb_card_no4").prop("disabled", false);
		} else {
			$("#ocb_card_no1").val("");
			$("#ocb_card_no2").val("");
			$("#ocb_card_no3").val("");
			$("#ocb_card_no4").val("");
			$("#ocb_card_no1").prop("disabled", true);
			$("#ocb_card_no2").prop("disabled", true);
			$("#ocb_card_no3").prop("disabled", true);
			$("#ocb_card_no4").prop("disabled", true);
		}
	});

	// 카드 선택시 할부정보 UI 구현
	//$("#frm_inp select[name=iscmcd]").change(getCardInsCheck);
	$("#frm_inp select[name=iscmcd]").change(function () {

		/*********************************************
		 * 청구할인로직변경S
		 *********************************************/
		if ("Y" == card_sale_yn || "Y" == claim_sale_yn) {
			fn_cardsavegoods();
		}
		/*********************************************
		 * 청구할인로직변경E
		 *********************************************/

		getCardInsCheck();

		if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_LPAY) {
			// 20151222 박형윤 L-PAY 카드 안내 긴급 감춤
			$("#SHINHAN_CARD_LAYER").hide();
			$("input[name='sinhan_point'][type=radio][value=N]").click();
			$("#BC_CARD_LAYER").hide();
			$("input[name='bc_point'][type=radio][value=N]").click();
			$("#SAMSUNG_CARD_LAYER").hide();
			$("input[name='samsung_point'][type=radio][value=N]").click();
			// 2016.05.18
			$("#KB_CARD_LAYER").hide();
			$("input[name='kb_point'][type=radio][value=N]").click();
			$("#LOTTE_CARD_LAYER").hide();
		}
	});

	$("#frm_inp input[name=rdo_cardinst]:radio").click(setcardinstmon);

	// 결제 정보 출력
	$("#frm_inp input[name=rdo_paytype]:radio").each(function () {
		if ($("#frm_inp input[name=paytype]:hidden").val() == $(this).val()) {
			$(this).attr("checked", "checked");
			$(this).prop("checked", "checked");
		}
	});

	// payType 여부에 따라 우선순위에 해당 하는 결제수단 가져 오기
	var checkVal = fn_inputPayType($("#frm_inp input[name=paytype]:hidden").val());
	// 결제수단 선택
	if (checkVal == PAYTYPE_CODE_CARD) {
		payTypeCodeCardSetting();
	} else if (checkVal == PAYTYPE_CODE_BANK) {
		$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").prop('checked', true);
		payTypeCodeBankSetting();
	} else if (checkVal == PAYTYPE_CODE_PHONE) {
		$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_PHONE + "']").prop('checked', true);
		payTypeCodePhoneSetting();
	} else if (checkVal == PAYTYPE_CODE_LPAY) {
		$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").prop('checked', true);
		payTypeCodeLpaySetting();
	} else if (checkVal == PAYTYPE_CODE_NAVERPAY) {
		$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_NAVERPAY + "']").prop('checked', true);
		payTypeCodeNpaySetting();
	}

	// 현금영수증 영역 컨트롤
	setCashReceiptArea();


	// 무통장 입금만 존재할 경우 현금영수증 영역 제어
	if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_BANK) {
		$("#cash_receipts").show(); // 현금영수증 영역 보이기
	}

	$("#max_dc").change(function () { // 최대할인적용 선택시.
		if ($("#max_dc").prop("checked")) {
			// 최대할인금액 설정.
			setMaxDc();
		} else {
			$("#frm_inp select[name=coupon]").val("N");
			$("#frm_inp select[name=coupon]").change();
		}
	});
	$("#max_dc").attr("checked", true);
	$("#max_dc").prop("checked", true);
	$("#max_dc").change();

	// 임직원할인이 아니고, 일시불할인 가능할 때
	if ($("#frm_inp input[name=third_coupon]:radio").length > 0 &&
		$("#frm_send input[name=prommdclcd]").val() != "27") {
		$("#frm_inp input[name=third_coupon]:radio:first").prop("checked", true);
		$("#frm_inp input[name=third_coupon]:radio:first").click();
	}

	/*  
	 * 	주문 동의 체크 박스 관련
	 * 	PG PROJECT : 체크박스 조정
	 */
	$("#order_agree_on").change(function () { // PG 무관 주문동의
		if ($("#assent_all").length > 0) {
			$("#pg_assent_ord").prop("checked", $(this).prop("checked"));

			$("#assent_all").prop("checked", ($("#pg_assent_crd").prop("checked") && $(this).prop("checked")));
		}
	});

	$("#pg_assent_ord").change(function () { // PG 주문동의
		$("#order_agree_on").prop("checked", $(this).prop("checked"));

		$("#assent_all").prop("checked", ($("#pg_assent_crd").prop("checked") && $(this).prop("checked")));
	});

	$("#pg_assent_crd").change(function (event, pg_sub_yn) { // PG 결제동의
		$("#assent_all").prop("checked", ($("#pg_assent_ord").prop("checked") && $(this).prop("checked")));

		if (typeof (pg_sub_yn) == "undefined") {
			$("#pg_sub_assent1,#pg_sub_assent2,#pg_sub_assent3").prop("checked", $(this).prop("checked"));
		}
	});

	$("#assent_all").change(function () { // PG 동의
		$("#order_agree_on").prop("checked", $(this).prop("checked"));
		$("#pg_assent_ord").prop("checked", $(this).prop("checked"));
		$("#pg_assent_crd").prop("checked", $(this).prop("checked")).trigger("change");
	});

	$("#pg_sub_assent1,#pg_sub_assent2,#pg_sub_assent3").change(function () { // PG 약관 동의
		$("#pg_assent_crd").prop("checked", ($("#pg_sub_assent1").prop("checked") && $("#pg_sub_assent2").prop("checked") && $("#pg_sub_assent3").prop("checked"))).trigger("change", ["Y"]);
	});

	// 주문서간소화 결제수단 다음에도 사용
	if ($("#frm_send input[name=org_pay_mean_hist_use_yn]").val() == "Y") {
		var selFlag = true;
		var histPayMeanCd = $("#frm_inp input[name=op_pay_mean_hist_pay_mean_cd]").val();
		//최근결제수단 선택전 해당 결제수단 결제가능한지 체크
		if (paytypeDisableCheckHist(histPayMeanCd)) {
			return;
			//최근결제 수단이 결제 가능 하면 '최근' add
		} else {
			$('#ordRates_' + paytypeCode(histPayMeanCd)).addClass('recent_icon');
		}
		console.log("histPayMeanCd : " + histPayMeanCd);
		// 저장된 결제수단과 현재 선택된 결제수단 비교
		if (selFlag) {
			if (histPayMeanCd == PAYTYPE_CODE_CARD &&
				!chkEmpty($("#frm_inp select[name=iscmcd]")) &&
				($("#frm_inp select[name=iscmcd]").val() != $("#frm_inp input[name=op_pay_mean_hist_acqr_cd]").val() ||
					!chkEmpty($("#frm_inp select[name=bankno]")))) {
				selFlag = false;
			} else if (histPayMeanCd == PAYTYPE_CODE_BANK &&
				(!chkEmpty($("#frm_inp select[name=iscmcd]")) ||
					!chkEmpty($("#frm_inp select[name=bankno]")))) {
				selFlag = false;
			} else if (histPayMeanCd == PAYTYPE_CODE_PHONE &&
				(!chkEmpty($("#frm_inp select[name=iscmcd]")) ||
					!chkEmpty($("#frm_inp select[name=bankno]")))) {
				selFlag = false;
			}
		}
		if (!selFlag) {
			//모바일리뉴얼 - 지금 선택한 결제수단을 다음에도 사용. Default Check
			//$("#frm_inp input[name=next_use]:checkbox").prop("checked", false);
			return;
		}
		var returnHistPay = fn_inputPayType(histPayMeanCd);

		coupon_cd = $("#frm_send input[name=prommdclcd]").val();
		coupon_cardcd = $("#frm_send input[name=cardkndcd]").val();
		// 중복카드할인쿠폰 선택되어 있을 경우 초기화 처리
		coupon_cd_dup = $("#frm_send input[name=prommdclcd_dup]").val();
		coupon_cardcd_dup = $("#frm_send input[name=cardkndcd_dup]").val();

		var payTypeCard = $('#pay_type1').hasClass('disable');
		var payTypeBank = $('#pay_type2').hasClass('disable');
		var payTypePhone = $('#pay_type3').hasClass('disable');
		var payTypeLpay = $('#pay_type4').hasClass('disable');
		var payTypeNPay = $('#pay_type5').hasClass('disable');

		// 카트 할인 체크(무통장||휴대폰||네이버페이)
		if ((coupon_cd != '' && coupon_cardcd != '') && (returnHistPay == PAYTYPE_CODE_BANK || returnHistPay == PAYTYPE_CODE_PHONE || returnHistPay == PAYTYPE_CODE_NAVERPAY)) {
			console.log("cardkndcd : " + cardkndcd);
			//alert("카드 할인쿠폰 및 적립쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
			if (!payTypeCard) {
				//alert("카드 할인쿠폰 및 적립쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
				payTypeCodeCardSetting();
				iscmcd = $("#frm_inp select[name=iscmcd]").val(cardkndcd);
				returnHistPay = PAYTYPE_CODE_CARD;
			}

			// 중복카드할인쿠폰 체크(무통장||휴대폰||네이버페이)
		} else if ((coupon_cd_dup != '' && coupon_cardcd_dup != '') && (returnHistPay == PAYTYPE_CODE_BANK || returnHistPay == PAYTYPE_CODE_PHONE || returnHistPay == PAYTYPE_CODE_NAVERPAY)) {
			//alert("중복카드 할인쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
			if (!payTypeCard) {
				//alert("중복카드 할인쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
				payTypeCodeCardSetting();
				iscmcd = $("#frm_inp select[name=iscmcd]").val(coupon_cardcd_dup);
				returnHistPay = PAYTYPE_CODE_CARD;
			}

			// 일시불 할인체크 (휴대폰||네이버)
		} else if ($("#frm_send input[name=prommdclcd_third]").val() == "35" && (returnHistPay == PAYTYPE_CODE_PHONE || returnHistPay == PAYTYPE_CODE_NAVERPAY)) {
			//alert("일시불 할인 혜택을 받으시려면 다른 결제수단을 선택해주세요.");
			if (!payTypeCard) {
				payTypeCodeCardSetting();
				returnHistPay = PAYTYPE_CODE_CARD;
			}

		} else if (returnHistPay == PAYTYPE_CODE_CARD) {
			//결제타입 카드 셋팅 
			payTypeCodeCardSetting();

		} else if (returnHistPay == PAYTYPE_CODE_BANK) {
			//결제타입 무통장 셋팅 
			payTypeCodeBankSetting();

		} else if (returnHistPay == PAYTYPE_CODE_PHONE) {
			//결제타입 휴대폰결제 셋팅
			payTypeCodePhoneSetting();

		} else if (returnHistPay == PAYTYPE_CODE_LPAY) {
			//결제타입 L.pay 셋팅
			payTypeCodeLpaySetting();

		} else if (returnHistPay == PAYTYPE_CODE_NAVERPAY) {
			//결제타입 NAVER PAY 셋팅
			payTypeCodeNpaySetting();

		}

		$("#frm_inp input[name=rdo_paytype]:radio[value='" + returnHistPay + "']").prop("checked", true);
		setCashReceiptArea(); //현금영수증s
	}

	// PG PROJECT : 주문 동의 영역 노출 제어
	if ($("#pay_method").css("display") == "block" && ($('[id^=pay_type].on').attr('id') == "pay_type4" || $('[id^=pay_type].on').attr('id') == "pay_type1")) { // 주결제 수단 노출된 상태이고 L.pay, 신용카드 선택 된 경우
		fn_setDisplayAssentArea('Y');
	} else {
		fn_setDisplayAssentArea('N');
	}
});

//결제수단에 해당하는 pay code return
function paytypeCode(checkValue) {
	var clickIdx;
	if (checkValue == PAYTYPE_CODE_CARD) {
		clickIdx = "1";
	} else if (checkValue == PAYTYPE_CODE_BANK) {
		clickIdx = "2";
	} else if (checkValue == PAYTYPE_CODE_PHONE) {
		clickIdx = "3";
	} else if (checkValue == PAYTYPE_CODE_LPAY) {
		clickIdx = "4";
	} else if (checkValue == PAYTYPE_CODE_NAVERPAY) {
		clickIdx = "5";
	}
	return clickIdx;
}

//최근결제수단 선택전 해당 결제수단 결제가능한지 체크
function paytypeDisableCheckHist(clickVal) {
	var clickIdx;
	if (clickVal == PAYTYPE_CODE_CARD) {
		clickIdx = "1";
	} else if (clickVal == PAYTYPE_CODE_BANK) {
		clickIdx = "2";
	} else if (clickVal == PAYTYPE_CODE_PHONE) {
		clickIdx = "3";
	} else if (clickVal == PAYTYPE_CODE_LPAY) {
		clickIdx = "4";
	} else if (clickVal == PAYTYPE_CODE_NAVERPAY) {
		clickIdx = "5";
	}
	var id = '#pay_type' + clickIdx;
	var idHassYn = $(id).hasClass('disable');
	return idHassYn;
}
//PayType결제수단 결제가능한지 체크
function fn_inputPayType(checkVal) {
	var payTypeCard = $('#pay_type1').hasClass('disable');
	var payTypeBank = $('#pay_type2').hasClass('disable');
	var payTypePhone = $('#pay_type3').hasClass('disable');
	var payTypeLpay = $('#pay_type4').hasClass('disable');
	var payTypeNPay = $('#pay_type5').hasClass('disable');
	if (checkVal == PAYTYPE_CODE_CARD) {
		clickIdx = "1";
	} else if (checkVal == PAYTYPE_CODE_BANK) {
		clickIdx = "2";
	} else if (checkVal == PAYTYPE_CODE_PHONE) {
		clickIdx = "3";
	} else if (checkVal == PAYTYPE_CODE_LPAY) {
		clickIdx = "4";
	} else if (checkVal == PAYTYPE_CODE_NAVERPAY) {
		clickIdx = "5";
	}
	var id = '#pay_type' + clickIdx;
	var idHassYn = $(id).hasClass('disable');
	console.log("input idHassYn : " + idHassYn);
	//선택 된 값이 비활성화 이면 우선순위 에해당 하는 결제 수단으로 셋팅
	if (idHassYn) {
		if (!$('#pay_type1').hasClass('disable')) return PAYTYPE_CODE_CARD;
		if (!$('#pay_type2').hasClass('disable')) return PAYTYPE_CODE_BANK;
		if (!$('#pay_type3').hasClass('disable')) return PAYTYPE_CODE_PHONE;
		if (!$('#pay_type4').hasClass('disable')) return PAYTYPE_CODE_LPAY;
		if (!$('#pay_type5').hasClass('disable')) return PAYTYPE_CODE_NAVERPAY;
	} else {
		return checkVal;
	}
}


// L.pay WEB : 카드 등록
function fn_LpayCardRegister() {
	disableItems(true);

	$("#frm_lpay input[name=req_div]:hidden").val("card_reg"); // lpay 카드 등록

	fn_LpayIframeSet(); // Lpay iframe 설정

	$("#frm_lpay").submit();
}

// L.pay WEB : iframe 설정
function fn_LpayIframeSet() {
	payment_pop_position(); // 결제 레이어팝업 위치 지정
	//$("#ANSIM_LAYER").css("max-width","400px");
	$("#ANSIM_LAYER").css("width", "100%");
	$("#ANSIM_LAYER").css("height", "500px");
	window.scrollTo(0, 0); // 안심레이어 위치 지정
	$("#ANSIM_LAYER").show();
	$("#X_ANSIM_FRAME").show();
}

// L.pay WEB : iframe 닫기
function fn_LpayIframeErrHide() {
	$("#frm_inp input[name=rdo_paytype]:radio[value='16']").click();
	close_iframe();
	$("#pageDesc").html("");
	$("#pageCover,#pageLoading").hide(); // 로딩 이미지 가리기 적용
}


// 배송지 팝업 닫기
function searchOrdDeliveryListClose(deli_span_nm) {

	$(".lpoint_btn3").show();

	$("#ordSearchDeliPop").hide();
	$("#ordSearchDeliPop").find("iframe").remove();

	scrollYN('Y', 'DELI');
	$(document).scrollTop($(deli_span_nm).offset().top - 150);
	//$(deli_span_nm).focus(); // 상세주소 입력란에 포커싱

}

// 스크롤 방지
function scrollYN(scroll, type) {

	if (scroll == 'N') {
		// 부모창 스크롤 방지
		$('html, body').css({
			'overflow': 'hidden'
		});
		if (type == 'DELI') {
			$('body').on('scroll touchmove mousewheel', function (event) {
				event.preventDefault();
				event.stopPropagation();
				return false;
			});
		}
		//이력추가
		if (browserChk() != 'Safari') {
			history.pushState('history1', '');
		}
	} else {
		// 부모창 스크롤 풀기
		$('html, body').css({
			'overflow': 'visible'
		});
		if (type == 'DELI') {
			$('body').off('scroll touchmove mousewheel');
		}
		if (browserChk() != 'Safari') {
			if (history.state != null) {
				history.back();
			}
		}
	}
}

// 배송지 팝업
function searchOrdDeliveryListPop(deli_cnt, single) {
	var tag = '<iframe id="deliIframe" src="" style="width:100%;height:100%;border:0"></iframe>'
	var dlvp_sn = $("input[name=indlvpsn]").val();
	var crspk_map_url = "/popup/ord_search_delivery_list.do?deli_cnt=" + deli_cnt + "&selectedDlvpSn=" + dlvp_sn + "&single=" + single;

	// iframe 보이기 및 url, parameter 셋팅
	$("#ordSearchDeliPop").show();
	$("#ordSearchDeliPop").html(tag);
	$("#ordSearchDeliPop").find("iframe").attr("src", crspk_map_url);

	scrollYN('N', 'DELI');

	//sendTclick('Sporder_clk_Pop1');

}

// 브라우저 체크
function browserChk() {
	var browser = "";
	var ua = window.navigator.userAgent;

	if (ua.indexOf('Safari') > 0) {
		if (ua.indexOf('Chrome') > 0) browser = "Chrome";
		else browser = "Safari";
	}
	return browser;
}


// 재고수량체크
function fn_invQtyCheck(p_val) {

	var return_val = false;

	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/json/mylotte/cart/searchInvQtyCheckAjax.json",
		data: {
			arr_cart_sn: p_val
		},
		async: false,
		success: function (data) {

			if (data.resultCd == "S") {
				return_val = true;
			} else {
				if (data.resultCd == "P") {
					alert("선택하신 상품 중 [" + data.resultMsg + "]의 재고 수량이 부족하여 주문이 불가합니다.");
				} else {
					alert("선택하신 상품이 모두 품절되어 주문이\n불가합니다. 상품상세 페이지에서 재입고\n알람을 이용해주세요.");
				}
			}
		},
		error: function (request, status) {
			alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
		}
	});

	return return_val;
}

function searchCncnMbrChk() {
	var returnYn = true;
	var goodsno = $("#frm_send input[name=goodsno]:hidden").val();
	while (goodsno.indexOf(split_gubun_1) > -1) {
		goodsno = goodsno.replace(split_gubun_1, ",");
	}
	var v_goods_no_list = goodsno;
	$.ajax({
		async: false,
		type: "POST",
		dataType: "json",
		data: {
			goods_no_list: v_goods_no_list
		},
		url: "/order/searchCncnMbrInfoAjax.do",
		success: function (data) {
			if (!data.success) {
				alert(data.msg);
				$("html, body").animate({
					scrollTop: $("#bene_deli_product_1").offset().top - 49
				});
				returnYn = false;
			}
		},
		error: function (request, status) {
			alert("서버와 통신 조회중 오류 입니다. 결제하기 버튼을 다시 클릭해 주세요.");
			returnYn = false;
		}
	});
	return returnYn;
}

// L.POINT 재계산
function lPointChange() {

	var dcamt;
	var ordqty;
	var goods_no;
	var saleprc;
	var lpoint_view;
	var lpoint_rsrv_rt;
	var prom_all;
	var l_point = 0;
	var sumDisAmt = 0; // 상품별 총 할인 금액		
	var couponType;
	var prommdclcd;
	var cpnpromno;
	var tempAmt = 0;

	try {

		dcamt = $("#frm_send input[name=totdcamt]").val();
		ordqty = ($("#frm_send input[name=ordqty]:hidden").val()).split(split_gubun_1);
		goods_no = ($("#frm_send input[name=goodsno]:hidden").val()).split(split_gubun_1);
		saleprc = ($("#frm_send input[name=saleprc]:hidden").val()).split(split_gubun_1);
		lpoint_view = ($("#frm_inp input[name=lpoint_view]:hidden").val()).split(split_gubun_1);
		lpoint_rsrv_rt = ($("#frm_inp input[name=lpoint_rsrv_rt]:hidden").val()).split(split_gubun_1);
		prom_all = $("#frm_inp input[name=cpnpromno_all]");

		for (var i = 0; i < goods_no.length; i++) { // 주문 상품 갯수 만큼

			salePrc = 0;
			sumDisAmt = 0;

			if (lpoint_view[i] > 0) {

				for (var curType = 0; curType < 3; curType++) { // 쿠폰 type 만큼 현재는 3개

					if (curType == 0) { // 1차쿠폰
						couponType = $("#frm_inp select[name=coupon]").val();
						if (couponType != null && couponType != '') {
							prommdclcd = $("#frm_inp input[name=prommdclcd]").eq(couponType).val();
							cpnpromno = $("#frm_inp input[name=cpnpromno]").eq(couponType).val();
						} else {
							prommdclcd = '';
						}
					} else if (curType == 1) { // 2차쿠폰
						couponType = $("#frm_inp select[name=dup_coupon]").val();
						if (couponType != null && couponType != '') {
							prommdclcd = $("#frm_inp input[name=prommdclcd_dup]").eq(couponType).val();
							cpnpromno = $("#frm_inp input[name=cpnpromno_dup]").eq(couponType).val();
						} else {
							prommdclcd = '';
						}
					} else if (curType == 2) { // 3차쿠폰						
						couponType = $("#frm_inp input[name=third_coupon]:radio:checked").val();
						if (couponType != 'N') {
							prommdclcd = $("#frm_inp input[name=prommdclcd_third]").eq(couponType).val();
							cpnpromno = $("#frm_inp input[name=cpnpromno_third]").eq(couponType).val();
						} else {
							prommdclcd = '';
						}
					}

					if (prommdclcd != '' && prommdclcd != undefined) {

						if (prommdclcd == '10') { // 카드
							sumDisAmt = Math.floor((saleprc[i] * $("#frm_inp input[name=orgfvrval]").eq(couponType).val() / 100) / 10) * 10; // 판매가에서 할인율 적용
						} else {
							for (var j = 0; j < prom_all.length; j++) { // 고객 전체 프로모션수 만큼															
								if (cpnpromno == $("#frm_inp input[name=cpnpromno_all]").eq(j).val() && prommdclcd == $("#frm_inp input[name=prommdclcd_all]").eq(j).val() && goods_no[i] == $("#frm_inp input[name=goodsno_all]").eq(j).val()) {
									if (curType == 0) { // 1차쿠폰										
										if ($("#frm_inp input[name=fvrpolctpcd_all]").eq(j).val() == '04') { // 정율할인
											sumDisAmt = Math.floor(($("#frm_inp input[name=dcamt_all]").eq(j).val() * 1 / ordqty[i]) / 10) * 10;
										} else {
											sumDisAmt = $("#frm_inp input[name=dcamt_all]").eq(j).val() * 1;
										}
									} else if (curType == 1) { // 2차 쿠폰
										tempAmt = Math.floor(((saleprc[i] * 1 - sumDisAmt) * $("#frm_inp input[name=orgfvrval_all]").eq(j).val() / 100) / 10) * 10;
										sumDisAmt += $("#frm_inp input[name=maxfvrval_all]").eq(j).val() * 1 > 0 ? (tempAmt > $("#frm_inp input[name=maxfvrval_all]").eq(j).val() * 1 ? $("#frm_inp input[name=maxfvrval_all]").eq(j).val() * 1 : tempAmt) : tempAmt;
									} else if (curType == 2) { // 3차 쿠폰
										tempAmt = Math.floor((saleprc[i] * $("#frm_inp input[name=orgfvrval_all]").eq(j).val() / 100) / 100) * 100;
										sumDisAmt += $("#frm_inp input[name=maxfvrval_all]").eq(j).val() * 1 > 0 ? (tempAmt > $("#frm_inp input[name=maxfvrval_all]").eq(j).val() * 1 ? $("#frm_inp input[name=maxfvrval_all]").eq(j).val() * 1 : tempAmt) : tempAmt;
									}
								}
							}
						}
					}
				}

				l_point += Math.round(((saleprc[i] * 1 - sumDisAmt) * lpoint_rsrv_rt[i] / 100)) * ordqty[i];
			}
		}

		$("#frm_send input[name=totRsrvAplyVal]").val(l_point);
		setLottePointSaveDiv(dcamt);
	} catch (e) {}
}

/* 20180906 주문서 판촉구좌 토글 */
function togglePayBanner() {
	if (!$("#order .paytype_title_wrap.has_banner").length) return;

	var boo = $("#pay_banner").css("display");
	var title = $("#order .paytype_title_wrap");
	if (boo == "block") {
		$("#pay_banner").hide();
		title.removeClass("open");
	} else {
		$("#pay_banner").show();
		title.addClass("open");
	}
}

//20180822 서울보증보험 동의 펑션모음
function fn_usafeAgree(flag) {
	var usafe_psb_yn = $("#usafe_psb_yn").val();
	var reset_yn = false;

	if (usafe_psb_yn == "Y") { // 서울보증보험 가입 조건 충족시
		var agree_yn = $("#insu_rgst_chk").prop("checked");

		// 화면 가입동의선택 시 약관,추가동의영역 노출
		if (agree_yn) {
			//$("#insu_rgst_desc").prop("style", "display:block");
			$("#insu_rgst_desc").css("display", "block");
			$("#div_insurance .tit_agree_check").addClass('show');
		} else {
			reset_yn = true;
			$("#div_insurance .tit_agree_check").removeClass('show');
		}

		if (flag == "2") { // 현금:무통장입금,실시간계좌이체 선택 시 노출
			if (Number(totpayamt) != 0) {
				//$("#div_insurance").prop("style", "display:block");
				$("#div_insurance").css("display", "block");
			} else {
				//$("#div_insurance").prop("style", "display: none");
				$("#div_insurance").css("display", "none");
				reset_yn = true;
			}
		} else if (flag == "3") { // 이외결제수단선택 선택 시 숨김 && 리셋
			//$("#div_insurance").prop("style", "display: none");
			$("#div_insurance").css("display", "none");
			reset_yn = true;
		} else if (flag == "4") { // 결제 전 밸리데이션 체크

			if (agree_yn) {

				if (!$("#insu_mail_chk").prop("checked")) {

					alert("개인정보제공 및 보험증권 이메일 수신에 동의를 체크해 주세요.");
					$("#insu_mail_chk").focus();
					return false;

				} else if ("" == $("#insu_brth_year").val() || "" == $("#insu_brth_month").val() || "" == $("#insu_brth_day").val() ||
					(!$("#gen_mn").prop("checked") && !$("#gen_wm").prop("checked"))) {

					alert("생년월일 또는 성별을 선택해 주세요.");
					$("#insu_brth_year").focus();
					return false;

				}
			}
			return true;

		} else if (flag == "5") {
			if ($("#gen_mn").attr("checked")) {
				$("#gen_sct_cd").val("M");
			} else {
				$("#gen_sct_cd").val("F");
			}
		} else if (flag == "6") {

			if ($("#insu_mail_chk").prop("checked")) {
				$("#insu_sms_chk").prop("disabled", false);
			} else {
				$("#insu_sms_chk").prop("disabled", true);
				$("#insu_sms_chk").prop("checked", false);
			}
		}

		if (agree_yn && !reset_yn) {
			$("#insu_mail_chk").prop("disabled", false);
			$("#gen_mn").prop("disabled", false);
			$("#gen_wm").prop("disabled", false);
			$("#insu_brth_year").prop("disabled", false);
			$("#insu_brth_month").prop("disabled", false);
			$("#insu_brth_day").prop("disabled", false);
		}
	} else {
		if (flag == "4") { // 결제 전 밸리데이션 체크
			return true;
		} else {
			$("#div_insurance").css("display", "none");
			//$("#div_insurance").prop("style", "display:none");
			reset_yn = true;
		}
	}

	if (reset_yn) {
		$("#insu_rgst_desc").css("display", "none");
		//$("#insu_rgst_desc").prop("style", "display:none");
		$("#insu_rgst_chk").prop("checked", false);
		$("#insu_mail_chk").prop("checked", false);
		$("#insu_sms_chk").prop("checked", false);
		$("#gen_mn").prop("checked", false);
		$("#gen_wm").prop("checked", false);
		$("#insu_brth_year").val("");
		$("#insu_brth_month").val("");
		$("#insu_brth_day").val("");
		$("#insu_mail_chk").prop("disabled", true);
		$("#insu_sms_chk").prop("disabled", true);
		$("#gen_mn").prop("disabled", true);
		$("#gen_wm").prop("disabled", true);
		$("#insu_brth_year").prop("disabled", true);
		$("#insu_brth_month").prop("disabled", true);
		$("#insu_brth_day").prop("disabled", true);
	}
}

//20180822 서울보증보험 생년월일세팅
function fn_setInsuBday(flag) {
	var f = document.frm_inp;

	f.insu_brth_day.length = 0;
	f.insu_brth_day.options[0] = new Option("일", "");

	if (f.insu_brth_year.value != "" && f.insu_brth_month.value != "") {
		var tg_date = new Date(f.insu_brth_year.options[f.insu_brth_year.selectedIndex].value, f.insu_brth_month.options[f.insu_brth_month.selectedIndex].value, 0);
		var max_days = tg_date.getDate();
		for (var i = 1; i <= max_days; i++) {
			f.insu_brth_day.options[i] = new Option(i, i < 10 ? '0' + i : i);
		}
	}

	f.insu_brth_day.options[0].selected = true;
}

//현금영수증 발급불가 체크 (E쿠폰, 상품권) - 20181011
function fn_giftCashReceipt() {

	var tpCdVal = true;

	// 상품코드
	var goodsNo = $("#frm_send input[name=goodsno]:hidden").val();
	if (goodsNo == undefined) goodsNo = "";
	var goodsNoArr = goodsNo.split(split_gubun_1);

	// 상품유형코드
	var tpCd = $("#frm_send input[name=goodstpcd]:hidden").val();
	if (tpCd == undefined) tpCd = "";
	var tpCdArr = tpCd.split(split_gubun_1);

	// 스마트픽 픽업 유형 코드
	var smpTpCd = $("#frm_send input[name=smp_tp_cd]:hidden").val();
	if (smpTpCd == undefined) smpTpCd = "";
	var smpTpCdArr = smpTpCd.split(split_gubun_1);

	// 쿠폰상품유형상세 코드
	var tpDtlCd = $("#frm_send input[name=smp_cpn_goods_tp_dtl_cd]:hidden").val();
	if (tpDtlCd == undefined) tpDtlCd = "";
	var tpDtlCdArr = tpDtlCd.split(split_gubun_1);

	// 과면세 구분코드
	var sctCd = $("#frm_send input[name=tdf_sct_cd]:hidden").val();
	if (sctCd == undefined) sctCd = "";
	var sctCdArr = sctCd.split(split_gubun_1);

	console.log("gift 현금영수증 ===============");

	var allGift = true;
	// 상품 Loop
	for (var i = 0; i < goodsNoArr.length; i++) {
		// 상품유형이 상품권(05) 인 경우
		if (tpCdVal && typeof goods_tp_cd_gift_card != "undefined" && tpCdArr[i] == goods_tp_cd_gift_card) {
			tpCdVal = false;
			// 상품유형이 E쿠폰(02), 스마트픽 유형 코드 값이 있는 경우
		} else if (tpCdVal && typeof goods_tp_cd_e_coupon != "undefined" && tpCdArr[i] == goods_tp_cd_e_coupon || (null != smpTpCdArr[i] && "" != smpTpCdArr[i])) {
			// 쿠폰상품유형상세 코드가 일반(02) 인 경우
			if (typeof goods_tp_dtl_cd_normal != "undefined" && tpDtlCdArr[i] == goods_tp_dtl_cd_normal) {
				tpCdVal = false;
			}
		}
		// 상품권일 경우 불가처리
		if ("4" != sctCdArr[i]) {
			allGift = false;
		}
		// 배송수단코드가 E쿠폰(90) 인경우
		if (tpCdVal && $("#frm_send input[name=dlvmeancd]:hidden").val() == "90") {
			tpCdVal = false;
		}
	}

	// 과면세 구분코드 모두 상품권일 경우 불가처리
	if (allGift) tpCdVal = false;

	console.log("tpCdVal ::: " + tpCdVal);
	console.log("=========================");

	return tpCdVal;
}