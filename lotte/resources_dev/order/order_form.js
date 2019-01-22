// 20180321 burberry_yn 방어코딩 
var burberry_yn = (burberry_yn) ? burberry_yn : "N";

function sendTclick(t) {

	if (!isEllotte) {
		t = ("m_DC_" + t);
	} else {
		t = ("m_EL_" + t);
	}

	var setTime = 1000;
	//	    console.log("tclick(non-ang) : " + t);
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

// 배송메시지 수정
// @param mode mod:수정 | cnfm:완료 | back:취소
// @param deli_cnt 상품별 배송지 순번
// @param suffix 새배송지 여부 접미사
// @return void
function changeDeliMsg(mode, deli_cnt, suffix) {

	var msg = '';

	if (mode == "mod") {
		$("#rcvmessage_view_txt_" + deli_cnt).hide();
		$("#rcvmessage_view_" + deli_cnt).show();
	} else if (mode == "cnfm") {
		$("#rcvmessage_view_txt_" + deli_cnt).show();
		$("#rcvmessage_view_" + deli_cnt).hide();

		if ($("#rcvmessage_select_" + deli_cnt).val() == '직접입력') {
			msg = $("#rcvmessage_" + deli_cnt).val();
		} else {
			msg = $("#rcvmessage_select_" + deli_cnt).val();
		}
		$("#rcvmessage_text_" + deli_cnt).text(msg);
	}
}

// 연락처 수정 가능하도록 입력필드 노출
// @param deli_cnt 상품별 배송지 순번
// @param dlvpSn 내배송지 순번(값이 없을경우 새로운 배송지)
// @return void
function changePhone(deli_cnt, dlvpSn) {
	$("#deli_phone_text_" + deli_cnt + "_" + dlvpSn).hide();
	$("#deli_phone_val_" + deli_cnt + "_" + dlvpSn).show();
	switchDeliOption("mine", deli_cnt, dlvpSn); // 코드 위치 주의
}

// 내배송지 수정/수정취소 (레이어팝업시)
// @param gbn 수정/수정취소여부
// @return void
function changeMyDlvp_layer(deliDlvpSn, lindex) {

	//2016-05-09 주문서 작성시 받는분 주소정보 임시저장(타 배송지 선택 및 수정중 취소할경우 기존정보를 세팅하기 위한) start
	var f = $("#deli_mine");

	$("<input />").attr("type", "hidden").attr("name", "tmp_inprmitnm").attr("value", $("#deli_mine input[name=inprmitnm]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_inpdlvpnm").attr("value", $("#deli_mine input[name=inpdlvpnm]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_inpbasedlvpyn").attr("value", $("#deli_mine input[name=inpbasedlvpyn]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_inpzip1").attr("value", $("#deli_mine input[name=inpzip1]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_inpzip2").attr("value", $("#deli_mine input[name=inpzip2]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_inpaddr1").attr("value", $("#deli_mine input[name=inpaddr1]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_inpaddr2").attr("value", $("#deli_mine input[name=inpaddr2]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_stnm_inp_zip1").attr("value", $("#deli_mine input[name=stnm_inp_zip1]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_stnm_inp_zip2").attr("value", $("#deli_mine input[name=stnm_inp_zip2]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_stnm_inp_addr1").attr("value", $("#deli_mine input[name=stnm_inp_addr1]").val()).appendTo(f);
	$("<input />").attr("type", "hidden").attr("name", "tmp_stnm_inp_addr2").attr("value", $("#deli_mine input[name=stnm_inp_addr2]").val()).appendTo(f);
	//2016-05-12추가분

	$("<input />").attr("type", "hidden").attr("name", "tmp_detail_list").attr("value", $("input[name=detail_list]").val()).appendTo(f);

	$("<input />").attr("type", "hidden").attr("name", "tmp_deli_selected_no").appendTo(f);
	if ($("input:radio[name=detail_list]:checked").val() == deliDlvpSn) {
		//$("<input />").attr("type","hidden").attr("name", "tmp_deli_selected_no").attr("value", lindex).appendTo(f);
		$("#deli_mine input[name=tmp_deli_selected_no]").attr("value", lindex);
	}
	//2016-05-09 주문서 작성시 받는분 주소정보 임시저장(타 배송지 선택 및 수정중 취소할경우 기존정보를 세팅하기 위한) end


	//내배송지 레이어 선택완료
	btnComplate();

	var deli_cnt = $('#sel_deli_cnt').val();

	//기본배송지의 경우 수정 불가 알럿
	/* 기본배송지 멤버스 동기화 제한 수정_20160927
	if ( $("#deli_"+deli_cnt+" #deliVal_basedlvpyn_" + deliDlvpSn).val() == 'Y') {
		alert("기본 배송지는 마이롯데 > 회원정보 에서 수정 가능합니다.");
		return;
	}
	*/

	//수정옵션 radio 체크
	$("#deli_" + deli_cnt + " input[name=deli_chk_" + deli_cnt + "]:radio[value='U']").prop("checked", true);

	$("#deli_" + deli_cnt + " #deli_mine").hide(); //배송지 정보 텍스트 영역
	$("#deli_" + deli_cnt + " #deli_new").show(); //배송지 정보 input 영역

	$("#changeNameN").hide(); //[내 배송지 수정] 버튼 숨김
	$("#changeMyDlvpCncl").show(); //[수정 취소] 버튼 표시

	$("#dlvpuseyn_dd_" + deli_cnt).hide(); //[내 배송지 목록에 추가] 체크박스 숨김
	$("#dlvp_reuse_mod").show(); //[지금 배송지를 다음에도 사용] 체크박스 표시

	// 배송지 텍스트 컴포넌트 비활성
	$("#deli_" + deli_cnt + " #deli_mine").children().find("input, select").prop("disabled", true);

	// 배송지 수정(입력) 컴포넌트 활성
	$("#deli_" + deli_cnt + " #deli_new").children().find("input, select").prop("disabled", false);

	//주문자 text, input박스, 버튼
	var $spanWrap = $("#orderer_name_text_" + deli_cnt + "_new");
	var $inptWrap = $("#orderer_name_val_" + deli_cnt + "_new");
	var $span = $spanWrap.find("#nameSp");
	var $inpt = $inptWrap.find("#nameInpt");
	var nameText = $span.text();
	$inpt.val(nameText);
	$spanWrap.hide(); //주문자 텍스트 숨김
	$inptWrap.show(); //주문자 input 표시
	$("#changeNameNC").hide(); //완료버튼 숨김
	$("#changeMyDlvpCncl").show(); //수정취소 버튼 노출

	// 선택된 주소정보를 input컴포넌트로 복사
	stnmDlvZip1 = $("#deli_" + deli_cnt + " deliVal_stnmzip1_" + deliDlvpSn).val();

	// 레이어 순번 등록
	$("#deli_" + deli_cnt + " #li_mine #deli_selected_no_" + deli_cnt).val(lindex);

	//우편번호 및 주소 히든값
	$("#deli_" + deli_cnt + " input[name=inpzip1]").val($("#deli_" + deli_cnt + " #deliVal_zip1_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=inpzip2]").val($("#deli_" + deli_cnt + " #deliVal_zip2_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=inpaddr1]").val($("#deli_" + deli_cnt + " #deliVal_addr1_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=inpaddr2]").val($("#deli_" + deli_cnt + " #deliVal_addr2_" + deliDlvpSn).val());

	$("#deli_" + deli_cnt + " input[name=stnm_inp_zip1]").val($("#deli_" + deli_cnt + " #deliVal_stnmzip1_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=stnm_inp_zip2]").val($("#deli_" + deli_cnt + " #deliVal_stnmzip2_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=stnm_inp_addr1]").val($("#deli_" + deli_cnt + " #deliVal_stnmaddr1_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=stnm_inp_addr2]").val($("#deli_" + deli_cnt + " #deliVal_stnmaddr2_" + deliDlvpSn).val());

	//우편번호 및 주소 노출값  -- 도로명 주소가 우선적으로 노출
	if (stnmDlvZip1 != null && stnmDlvZip1 != "") {
		$("#txt_zip_tot_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmzip1_" + deliDlvpSn).val() + $("#deli_" + deli_cnt + " #deliVal_stnmzip2_" + deliDlvpSn).val());
		$("#txt_zip1_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmzip1_" + deliDlvpSn).val());
		$("#txt_zip2_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmzip2_" + deliDlvpSn).val());
		$("#txt_addr1_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmaddr1_" + deliDlvpSn).val());
		$("#txt_addr2_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmaddr2_" + deliDlvpSn).val());
	} else {
		$("#txt_zip_tot_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_zip1_" + deliDlvpSn).val() + $("#deli_" + deli_cnt + " #deliVal_zip2_" + deliDlvpSn).val());
		$("#txt_zip1_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_zip1_" + deliDlvpSn).val());
		$("#txt_zip2_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_zip2_" + deliDlvpSn).val());
		$("#txt_addr1_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_addr1_" + deliDlvpSn).val());
		$("#txt_addr2_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_addr2_" + deliDlvpSn).val());
	}

	//이름,배송지명
	$("#deli_" + deli_cnt + " input[name=inpdlvpnm]").val($("#deli_" + deli_cnt + " #deliVal_dlvpnm_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=inprmitnm]").val($("#deli_" + deli_cnt + " #deliVal_rmitnm_" + deliDlvpSn).val());

	//전화번호
	var cellSctnoSel = $("#deli_" + deli_cnt + " #deliVal_cellsctno_" + deliDlvpSn).val();
	$("#deli_" + deli_cnt + " input[name=inptel1]").val($("#deli_" + deli_cnt + " #deliVal_cbltelrgnno_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=inptel2]").val($("#deli_" + deli_cnt + " #deliVal_cblteltxnono_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=inptel3]").val($("#deli_" + deli_cnt + " #deliVal_cbltelendno_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " select[name=inpcell1]").val(cellSctnoSel);
	$("#deli_" + deli_cnt + " input[name=inpcell1]").val(cellSctnoSel);
	if (cellSctnoSel == '010' || cellSctnoSel == '011' || cellSctnoSel == '016' || cellSctnoSel == '017' ||
		cellSctnoSel == '018' || cellSctnoSel == '019' || cellSctnoSel == '0502' || cellSctnoSel == '0505') {
		$("#deli_" + deli_cnt + " input[name=inpcell1]").prop("disabled", true).hide();
	} else {
		$("#deli_" + deli_cnt + " select[name=inpcell1]").prop("disabled", true).parent().hide();
		$("#deli_" + deli_cnt + " input[name=inpcell1]").prop("disabled", false).show();
	}

	$("#deli_" + deli_cnt + " input[name=inpcell2]").val($("#deli_" + deli_cnt + " #deliVal_celltxnono_" + deliDlvpSn).val());
	$("#deli_" + deli_cnt + " input[name=inpcell3]").val($("#deli_" + deli_cnt + " #deliVal_cellendno_" + deliDlvpSn).val());

	//배송메시지 복사
	//alert("배송메시지 가능--->"+ $("#deli_"+deli_cnt+" #li_mine select[name=deli_msg]").length);
	if ($("#deli_" + deli_cnt + " #li_mine select[name=deli_msg]").length > 0) {
		delimsgsel = $("#deli_" + deli_cnt + " #li_mine select[name=deli_msg]").val();
		$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").val(delimsgsel);

		if (delimsgsel == "직접입력") {
			$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").parent().hide();
			$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").parent().next().show();
			$("#deli_" + deli_cnt + " #li_new input[name=rcvmessage]").val($("#deli_" + deli_cnt + " #li_mine input[name=rcvmessage]").val());
		}
	}

	//alert("선물 메시지 가능--->"+$("#deli_"+deli_cnt+" #deli_mine #gift_msg_sel_"+deli_cnt).length);
	if ($("#deli_" + deli_cnt + " #deli_mine #gift_msg_sel_" + deli_cnt).length > 0) {
		var $deliMineParent = $("#deli_" + deli_cnt + " #deli_mine");
		var $deliNewParent = $("#deli_" + deli_cnt + " #deli_new");

		$deliNewParent.find("input[name^=gift_yn_]:radio").eq(0).prop("checked", ($deliMineParent.find("input[name^=gift_yn_]:radio").eq(0).prop("checked")));
		$deliNewParent.find("input[name^=gift_yn_]:radio").eq(1).prop("checked", ($deliMineParent.find("input[name^=gift_yn_]:radio").eq(1).prop("checked")));

		$deliNewParent.find("input[name^=receivename_]").val($deliMineParent.find("input[name^=receivename_]").val());
		$deliNewParent.find("textarea[name^=sendmessage_]").val($deliMineParent.find("textarea[name^=sendmessage_]").val());
		$deliNewParent.find("input[name^=sendname]").val($deliMineParent.find("input[name^=sendname]").val());
	}

}

// 내배송지 수정/수정취소
// @param deli_cnt 상품별 배송지 순번
// @param gbn 수정/수정취소여부
// @return void
function changeMyDlvp(deli_cnt, gbn) {
	sendTclick('order_Clk_Btn_1');

	//alert(deli_cnt+"/"+gbn);
	// 내 배송지 수정
	if (gbn == "mod") {

		//셀렉트박스에서 선택된 배송지 순번 조회
		deliDlvpSn = $("#deli_select_" + deli_cnt).val(); //선택된 dlvpSn

		//기본배송지의 경우 수정 불가 알럿
		/* 기본배송지 멤버스 동기화 제한 수정_20160927
		if ( $("#deli_"+deli_cnt+" #deliVal_basedlvpyn_" + deliDlvpSn).val() == 'Y') {
			alert("기본 배송지는 마이롯데 > 회원정보 에서 수정 가능합니다.");
			return;
		}
		*/
		//수정옵션 radio 체크
		$("#deli_" + deli_cnt + " input[name=deli_chk_" + deli_cnt + "]:radio[value='U']").prop("checked", true);

		$("#deli_" + deli_cnt + " #deli_mine").hide(); //배송지 정보 텍스트 영역
		$("#deli_" + deli_cnt + " #deli_new").show(); //배송지 정보 input 영역

		$("#changeNameN").hide(); //[내 배송지 수정] 버튼 숨김
		$("#changeMyDlvpCncl").show(); //[수정 취소] 버튼 표시

		$("#dlvpuseyn_dd_" + deli_cnt).hide(); //[내 배송지 목록에 추가] 체크박스 숨김
		$("#dlvp_reuse_mod").show(); //[지금 배송지를 다음에도 사용] 체크박스 표시

		// 배송지 텍스트 컴포넌트 비활성
		$("#deli_" + deli_cnt + " #deli_mine").children().find("input, select").prop("disabled", true);

		// 배송지 수정(입력) 컴포넌트 활성
		$("#deli_" + deli_cnt + " #deli_new").children().find("input, select").prop("disabled", false);

		//주문자 text, input박스, 버튼
		var $spanWrap = $("#orderer_name_text_" + deli_cnt + "_new");
		var $inptWrap = $("#orderer_name_val_" + deli_cnt + "_new");
		var $span = $spanWrap.find("#nameSp");
		var $inpt = $inptWrap.find("#nameInpt");
		var nameText = $span.text();
		$inpt.val(nameText);
		$spanWrap.hide(); //주문자 텍스트 숨김
		$inptWrap.show(); //주문자 input 표시
		$("#changeNameNC").show(); //완료버튼 숨김
		$("#changeMyDlvpCncl").show(); //수정취소 버튼 노출

		// 선택된 주소정보를 input컴포넌트로 복사
		stnmDlvZip1 = $("#deli_" + deli_cnt + " #deliVal_stnmzip1_" + deliDlvpSn).val();

		//우편번호 및 주소 히든값
		$("#deli_" + deli_cnt + " input[name=inpzip1]").val($("#deli_" + deli_cnt + " #deliVal_zip1_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=inpzip2]").val($("#deli_" + deli_cnt + " #deliVal_zip2_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=inpaddr1]").val($("#deli_" + deli_cnt + " #deliVal_addr1_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=inpaddr2]").val($("#deli_" + deli_cnt + " #deliVal_addr2_" + deliDlvpSn).val());

		$("#deli_" + deli_cnt + " input[name=stnm_inp_zip1]").val($("#deli_" + deli_cnt + " #deliVal_stnmzip1_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=stnm_inp_zip2]").val($("#deli_" + deli_cnt + " #deliVal_stnmzip2_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=stnm_inp_addr1]").val($("#deli_" + deli_cnt + " #deliVal_stnmaddr1_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=stnm_inp_addr2]").val($("#deli_" + deli_cnt + " #deliVal_stnmaddr2_" + deliDlvpSn).val());

		//우편번호 및 주소 노출값  -- 도로명 주소가 우선적으로 노출
		if (stnmDlvZip1 != null && stnmDlvZip1 != "") {
			$("#txt_zip_tot_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmzip1_" + deliDlvpSn).val() + $("#deli_" + deli_cnt + " #deliVal_stnmzip2_" + deliDlvpSn).val());
			$("#txt_zip1_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmzip1_" + deliDlvpSn).val());
			$("#txt_zip2_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmzip2_" + deliDlvpSn).val());
			$("#txt_addr1_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmaddr1_" + deliDlvpSn).val());
			$("#txt_addr2_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_stnmaddr2_" + deliDlvpSn).val());
		} else {
			$("#txt_zip_tot_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_zip1_" + deliDlvpSn).val() + $("#deli_" + deli_cnt + " #deliVal_zip2_" + deliDlvpSn).val());
			$("#txt_zip1_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_zip1_" + deliDlvpSn).val());
			$("#txt_zip2_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_zip2_" + deliDlvpSn).val());
			$("#txt_addr1_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_addr1_" + deliDlvpSn).val());
			$("#txt_addr2_" + deli_cnt).val($("#deli_" + deli_cnt + " #deliVal_addr2_" + deliDlvpSn).val());
		}

		//이름,배송지명
		$("#deli_" + deli_cnt + " input[name=inpdlvpnm]").val($("#deli_" + deli_cnt + " #deliVal_dlvpnm_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=inprmitnm]").val($("#deli_" + deli_cnt + " #deliVal_rmitnm_" + deliDlvpSn).val());

		//전화번호
		var cellSctnoSel = $("#deli_" + deli_cnt + " #deliVal_cellsctno_" + deliDlvpSn).val();
		$("#deli_" + deli_cnt + " input[name=inptel1]").val($("#deli_" + deli_cnt + " #deliVal_cbltelrgnno_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=inptel2]").val($("#deli_" + deli_cnt + " #deliVal_cblteltxnono_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=inptel3]").val($("#deli_" + deli_cnt + " #deliVal_cbltelendno_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " select[name=inpcell1]").val(cellSctnoSel);
		$("#deli_" + deli_cnt + " input[name=inpcell1]").val(cellSctnoSel);
		if (cellSctnoSel == '010' || cellSctnoSel == '011' || cellSctnoSel == '016' || cellSctnoSel == '017' ||
			cellSctnoSel == '018' || cellSctnoSel == '019' || cellSctnoSel == '0502' || cellSctnoSel == '0505') {
			$("#deli_" + deli_cnt + " input[name=inpcell1]").prop("disabled", true).hide();
		} else {
			$("#deli_" + deli_cnt + " select[name=inpcell1]").prop("disabled", true).parent().hide();
			$("#deli_" + deli_cnt + " input[name=inpcell1]").prop("disabled", false).show();
		}

		$("#deli_" + deli_cnt + " input[name=inpcell2]").val($("#deli_" + deli_cnt + " #deliVal_celltxnono_" + deliDlvpSn).val());
		$("#deli_" + deli_cnt + " input[name=inpcell3]").val($("#deli_" + deli_cnt + " #deliVal_cellendno_" + deliDlvpSn).val());

		//배송메시지 복사
		//alert("배송메시지 가능--->"+ $("#deli_"+deli_cnt+" #li_mine select[name=deli_msg]").length);
		if ($("#deli_" + deli_cnt + " #li_mine select[name=deli_msg]").length > 0) {
			delimsgsel = $("#deli_" + deli_cnt + " #li_mine select[name=deli_msg]").val();
			$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").val(delimsgsel);

			if (delimsgsel == "직접입력") {
				$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").parent().hide();
				$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").parent().next().show();
				$("#deli_" + deli_cnt + " #li_new input[name=rcvmessage]").val($("#deli_" + deli_cnt + " #li_mine input[name=rcvmessage]").val());
			}
		}

		//alert("선물 메시지 가능--->"+$("#deli_"+deli_cnt+" #deli_mine #gift_msg_sel_"+deli_cnt).length);
		if ($("#deli_" + deli_cnt + " #deli_mine #gift_msg_sel_" + deli_cnt).length > 0) {
			var $deliMineParent = $("#deli_" + deli_cnt + " #deli_mine");
			var $deliNewParent = $("#deli_" + deli_cnt + " #deli_new");

			$deliNewParent.find("input[name^=gift_yn_]:radio").eq(0).prop("checked", ($deliMineParent.find("input[name^=gift_yn_]:radio").eq(0).prop("checked")));
			$deliNewParent.find("input[name^=gift_yn_]:radio").eq(1).prop("checked", ($deliMineParent.find("input[name^=gift_yn_]:radio").eq(1).prop("checked")));

			$deliNewParent.find("input[name^=receivename_]").val($deliMineParent.find("input[name^=receivename_]").val());
			$deliNewParent.find("textarea[name^=sendmessage_]").val($deliMineParent.find("textarea[name^=sendmessage_]").val());
			$deliNewParent.find("input[name^=sendname]").val($deliMineParent.find("input[name^=sendname]").val());
		}

		// 내 배송지 수정취소
	} else if (gbn == "cncl") {
		//수정옵션 radio 체크해제
		$("#deli_" + deli_cnt + " input[name=deli_chk_" + deli_cnt + "]:radio[value='U']").prop("checked", false);

		$("#deli_" + deli_cnt + " #deli_new").hide(); //배송지 정보 input 영역 숨김
		$("#deli_" + deli_cnt + " #deli_mine").show(); //배송지 정보 텍스트 영역 표시

		$("#changeMyDlvpCncl").hide(); //[수정 취소] 버튼
		$("#changeNameN").show(); //[내 배송지 수정] 버튼

		// 배송지 텍스트 컴포넌트 활성
		$("#deli_" + deli_cnt + " #deli_mine").children().find("input, select").prop("disabled", false);

		// 배송지 수정(입력) 컴포넌트 비활성
		$("#deli_" + deli_cnt + " #deli_new").children().find("input, select").prop("disabled", true);

		//주문자 text, input박스, 버튼
		var $spanWrap = $("#orderer_name_text_" + deli_cnt + "_new");
		var $inptWrap = $("#orderer_name_val_" + deli_cnt + "_new");
		var $span = $spanWrap.find("#nameSp");
		var $inpt = $inptWrap.find("#nameInpt");
		var nameText = $span.text();
		$inpt.val("");
		$("#changeNameNC").show(); //완료버튼 표시
		$("#changeMyDlvpCncl").hide(); //수정취소 버튼 숨김
		$spanWrap.show(); //주문자 텍스트 표시
		$inptWrap.hide(); //주문자 input 숨김

		//배송메시지 복사 초기화
		if ($("#deli_" + deli_cnt + " #li_mine select[name=deli_msg]").length > 0) {
			$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").val("");
			$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").parent().show();
			$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").parent().next().hide();
			$("#deli_" + deli_cnt + " #li_new input[name=rcvmessage]").val("");
		}

		//선물메시지 복사 초기화
		if ($("#deli_" + deli_cnt + " #deli_mine #gift_msg_sel_" + deli_cnt).length > 0) {
			var $deliMineParent = $("#deli_" + deli_cnt + " #deli_mine #gift_msg_sel_" + deli_cnt).parent();
			var $deliNewParent = $("#deli_" + deli_cnt + " #deli_new #gift_msg_sel_" + deli_cnt).parent();

			$deliNewParent.find("input[name^=gift_yn_]:radio").eq(0).prop("checked", false);
			$deliNewParent.find("input[name^=gift_yn_]:radio").eq(1).prop("checked", true);

			$deliNewParent.find("input[name^=receivename_]").val("");
			$deliNewParent.find("textarea[name^=sendmessage_]").val("");
			$deliNewParent.find("input[name^=sendname]").val("");

			if ($deliMineParent.find("dd[name^=gift_msg_form_]").css("display") == "block") {
				$deliMineParent.find("input[name^=gift_yn_]:radio").eq(0).prop("checked", true);
				//$(this).find("input[name^=gift_yn_]:radio").eq(0).click();
			} else {
				$deliMineParent.parent().find("input[name^=gift_yn_]:radio").eq(1).prop("checked", true);
				//$(this).find("input[name^=gift_yn_]:radio").eq(1).click();
			}
		}

		//2016-05-09 주문서 작성시 받는분 주소(최초) 임시저장한 값을 submit 해야 할 hidden 에 다시담기(타 배송지 선택 및 수정중 취소할경우 기존정보를 세팅하기 위한) start
		$("#deli_mine input[name=inprmitnm]").val($("#deli_mine input[name=tmp_inprmitnm]").val());
		$("#deli_mine input[name=inpdlvpnm]").val($("#deli_mine input[name=tmp_inpdlvpnm]").val());
		$("#deli_mine input[name=inpbasedlvpyn]").val($("#deli_mine input[name=tmp_inpbasedlvpyn]").val());
		$("#deli_mine input[name=inpzip1]").val($("#deli_mine input[name=tmp_inpzip1]").val());
		$("#deli_mine input[name=inpzip2]").val($("#deli_mine input[name=tmp_inpzip2]").val());
		$("#deli_mine input[name=inpaddr1]").val($("#deli_mine input[name=tmp_inpaddr1]").val());
		$("#deli_mine input[name=inpaddr2]").val($("#deli_mine input[name=tmp_inpaddr2]").val());
		$("#deli_mine input[name=stnm_inp_zip1]").val($("#deli_mine input[name=tmp_stnm_inp_zip1]").val());
		$("#deli_mine input[name=stnm_inp_zip2]").val($("#deli_mine input[name=tmp_stnm_inp_zip2]").val());
		$("#deli_mine input[name=stnm_inp_addr1]").val($("#deli_mine input[name=tmp_stnm_inp_addr1]").val());
		$("#deli_mine input[name=stnm_inp_addr2]").val($("#deli_mine input[name=tmp_stnm_inp_addr2]").val());
		$("input[name=detail_list]").val($("input[name=tmp_detail_list]").val());

		$("#deli_mine input[name=deli_selected_no]").val($("#deli_mine input[name=tmp_deli_selected_no]").val());


		$("#deli_new input[name=inpzip1]").attr("disabled", "disabled");
		$("#deli_new input[name=inpzip1]").val("");
		$("#deli_new input[name=inpzip2]").attr("disabled", "disabled");
		$("#deli_new input[name=inpzip2]").val("");
		$("#deli_new input[name=inpaddr1]").attr("disabled", "disabled");
		$("#deli_new input[name=inpaddr1]").val("");
		$("#deli_new input[name=inpaddr2]").attr("disabled", "disabled");
		$("#deli_new input[name=inpaddr2]").val("");

		$("#deli_new input[name=stnm_inp_zip1]").attr("disabled", "disabled");
		$("#deli_new input[name=stnm_inp_zip1]").val("");
		$("#deli_new input[name=stnm_inp_zip2]").attr("disabled", "disabled");
		$("#deli_new input[name=stnm_inp_zip2]").val("");
		$("#deli_new input[name=stnm_inp_addr1]").attr("disabled", "disabled");
		$("#deli_new input[name=stnm_inp_addr1]").val("");
		$("#deli_new input[name=stnm_inp_addr2]").attr("disabled", "disabled");
		$("#deli_new input[name=stnm_inp_addr2]").val("");

		$("#deli_new input[id=temp_zip1_1]").attr("disabled", "disabled");
		$("#deli_new input[id=temp_zip1_1]").val("");
		$("#deli_new input[id=temp_zip2_1]").attr("disabled", "disabled");
		$("#deli_new input[id=temp_zip2_1]").val("");
		$("#deli_new input[id=temp_addr1_1]").attr("disabled", "disabled");
		$("#deli_new input[id=temp_addr1_1]").val("");
		$("#deli_new input[id=temp_addr2_1]").attr("disabled", "disabled");
		$("#deli_new input[id=temp_addr2_1]").val("");

		$("#deli_new input[id=txt_zip1_1]").attr("disabled", "disabled");
		$("#deli_new input[id=txt_zip1_1]").val("");
		$("#deli_new input[id=txt_zip2_1]").attr("disabled", "disabled");
		$("#deli_new input[id=txt_zip2_1]").val("");

		$("#deli_new input[id=txt_zip_tot_1]").attr("disabled", "disabled");

		$("#deli_new input[name=inprmitnm]").attr("disabled", "disabled");
		$("#deli_new input[name=inpdlvpnm]").attr("disabled", "disabled");

		$("#deli_new input[name=inpcell1]").attr("disabled", "disabled");
		$("#deli_new input[name=inpcell2]").attr("disabled", "disabled");
		$("#deli_new input[name=inpcell3]").attr("disabled", "disabled");

		$("#deli_new input[name=inptel1]").attr("disabled", "disabled");
		$("#deli_new input[name=inptel1]").val("");
		$("#deli_new input[name=inptel2]").attr("disabled", "disabled");
		$("#deli_new input[name=inptel2]").val("");
		$("#deli_new input[name=inptel3]").attr("disabled", "disabled");
		$("#deli_new input[name=inptel3]").val("");

		$("#dlvp_reuse_mod").css("display", "none");
		$("#chk_dlvp_reuse_mod").attr("disabled", "disabled");

		$("#dlvpuseyn_dd_1").css("display", "");
		$("#dlvpuseyn_1").attr("disabled", "disabled");

		$("deli_new input[name=del_msg]").attr("disabled", "disabled");
		//2016-05-09 주문서 작성시 받는분 주소(최초) 임시저장한 값을 submit 해야 할 hidden 에 다시담기(타 배송지 선택 및 수정중 취소할경우 기존정보를 세팅하기 위한) end
	}
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
	if ($("input[name=grockle_name]").length > 0) {
		// 비회원일때
		mid = "";
	}

	// 주문시 전송되는 지번 주소
	var $inpZip1 = $("#deli_" + deli_cnt + mid + " input[name=inpzip1]");
	var $inpZip2 = $("#deli_" + deli_cnt + mid + " input[name=inpzip2]");
	var $inpAddr1 = $("#deli_" + deli_cnt + mid + " input[name=inpaddr1]");
	var $inpAddr2 = $("#deli_" + deli_cnt + mid + " input[name=inpaddr2]");

	// 주문시 전송되는 도로명 주소
	var $stnmInpZip1 = $("#deli_" + deli_cnt + mid + " input[name=stnm_inp_zip1]");
	var $stnmInpZip2 = $("#deli_" + deli_cnt + mid + " input[name=stnm_inp_zip2]");
	var $stnmInpAddr1 = $("#deli_" + deli_cnt + mid + " input[name=stnm_inp_addr1]");
	var $stnmInpAddr2 = $("#deli_" + deli_cnt + mid + " input[name=stnm_inp_addr2]");

	var cpcg_dlv_yn = $("#frm_send input[name=cpcg_dlv_yn]:hidden", parent.document).val(); // 전담배송 여부
	var cpcg_deli_yn;

	// 화면에 표시되는 주소
	var $txtZip1 = $("#txt_zip1_" + deli_cnt);
	var $txtZip2 = $("#txt_zip2_" + deli_cnt);
	var $txtZipTot = $("#txt_zip_tot_" + deli_cnt);
	var $txtAddr1 = $("#txt_addr1_" + deli_cnt);
	var $txtAddr2 = $("#txt_addr2_" + deli_cnt);

	// 임시저장 폼
	var $tempZip1 = $("#temp_zip1_" + deli_cnt);
	var $tempZip2 = $("#temp_zip2_" + deli_cnt);
	var $tempAddr1 = $("#temp_addr1_" + deli_cnt);
	var $tempAddr2 = $("#temp_addr2_" + deli_cnt);
	//var $tempBldg = $("#temp_bldg_" + deli_cnt);

	// 전담 배송일 경우 배송가능한 지역인지 체크 start	
	if (cpcg_dlv_yn == 'Y' && proc_div == "M") {
		var deli_text = $tempAddr1.val();
		cpcg_deli_yn = chkCpcgAddrNoEntr(deli_text);
		if (false == cpcg_deli_yn) return;
	}
	// 전담 배송일 경우 배송가능한 지역인지 체크 end

	if (proc_div == "S" && addr_gbn == "J") { // 지번 주소 검색일 때
		// addrHtml = 우편번호\n우편주소+상세주소
		var addrHtml = "<br/>" + post_addr;
		$("#txt_seq2_J_" + deli_cnt).html(addrHtml);

		// 선택한 주소의 실제 값은 hidden에 할당
		$tempZip1.val(post_no.substring(0, 3));
		$tempZip2.val(post_no.substring(3, 6));
		$tempAddr1.val(post_addr);

		$("#seq1_J_" + deli_cnt).hide();
		$("#seq2_J_" + deli_cnt).show();

		$("#inp_seq2_J_" + deli_cnt).val(dtl_addr).focus(); // 상세주소 입력란에 포커싱
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
		$("#txt_seq2_N_" + deli_cnt).html(addrHtml);

		$("#seq1_N_" + deli_cnt).hide();
		$("#seq2_N_" + deli_cnt).show();
		$("#inp_seq2_N_" + deli_cnt).focus(); // 상세주소 입력란에 포커싱
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

		if (cpcg_dlv_yn == 'Y') {
			$("input[name=dlvseqSel]:radio", parent.document).prop("checked", false);
			$("#dlvseqSel", parent.document).val("");
			$("#selCpcgDlv", parent.document).html("배송정보를 선택해주세요.");
		}

		// 주소 변환일 경우 검색 레이어 닫기
		$("#search_addr_trigger_" + deli_cnt).click()
		$('#txt_addr_wrap_' + deli_cnt).show();
	}
}

//전담 배송 주소 체크 비회원용 
function chkCpcgAddrNoEntr(deli_text) {

	var sel_dlv = deli_text.split(' '); // 선택한 배송지
	var dlv_area; // 배송회차의 배송지역
	var chkCnt = 0; // 선택한 배송지와 배송회차의 지역이 같은게 있는지 확인
	var dlv_seq_cnt = $("#dlv_seq_cnt", parent.document).val(); // 배송회차 수

	for (var i = 0; i < dlv_seq_cnt; i++) {
		dlv_area = $("#dlvSeq_" + i, parent.document).attr("area");
		if (dlv_area == sel_dlv[1]) {
			chkCnt++;
		}
	}

	if (chkCnt == 0) {
		alert('배송지가 런닝피쉬 서비스 가능 지역이 아닙니다.\n배송 가능 주소지로 변경해주세요');
		return false;
	}

	for (var i = 0; i < dlv_seq_cnt; i++) {

		dlv_area = $("#dlvSeq_" + i, parent.document).attr("area");

		if (dlv_area == sel_dlv[1]) {
			$("#dlvSeq_" + i, parent.document).css('display', '');
		} else {
			$("#dlvSeq_" + i, parent.document).css('display', 'none');
		}
	}

	if (chkCnt > 0) {
		$("#cpcg_view_yn", parent.document).val('Y');
		$("#dlv_yes", parent.document).css('display', '');
		$("#dlv_no", parent.document).css('display', 'none');
	} else {
		$("#cpcg_view_yn", parent.document).val('N');
		$("#dlv_yes", parent.document).css('display', 'none');
		$("#dlv_no", parent.document).css('display', '');
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

	if (proc_div == "S" && addr_gbn == "J") { // 지번 주소 조회
		var $dongName = $("#inp_seq1_J_" + deli_cnt);
		if ($.trim($dongName.val()).length <= 0) { // validation
			alert("읍/면/동을 입력해 주세요.");
			$dongName.focus();
			return false;
		}

		reqData += "&dong_nm=" + $dongName.val();
		callBack = function (resp) {
			$("#result_seq1_J_" + deli_cnt).html(resp).show();
		};

	} else if (proc_div == "S" && addr_gbn == "N") { // 도로명 주소 조회
		var $key1 = $("#key1_seq1_N_" + deli_cnt);
		var $key2 = $("#key2_seq1_N_" + deli_cnt);
		var $key3 = $("#key3_seq1_N_" + deli_cnt);
		var $key4 = $("#key4_seq1_N_" + deli_cnt);
		var $key5 = $("#key5_seq1_N_" + deli_cnt);

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
			$("#result_seq1_N_" + deli_cnt).html(resp).show();
		};
	} else if (proc_div == "M" && addr_gbn == "J") { // 지번 -> 도로명
		var $addr2 = $("#inp_seq2_J_" + deli_cnt);
		if ($.trim($addr2.val()).length <= 0) { // validation
			alert("상세주소를 입력해 주세요.");
			$addr2.focus();
			return false; // function exit
		}
		var zipcode = $("#temp_zip1_" + deli_cnt).val() + $("#temp_zip2_" + deli_cnt).val();
		var addr1 = $("#temp_addr1_" + deli_cnt).val();
		var addr2 = $addr2.val();
		reqData += "&zipcode=" + zipcode.replace("-", "") + "&addr1=" + addr1 +
			"&addr2=" + addr2;

		$("#temp_addr2_" + deli_cnt).val(addr2); // 임시폼 설정(상세주소)

		callBack = function (resp) {
			$("#seq2_J_" + deli_cnt).hide();
			$("#seq3_J_" + deli_cnt).html(resp).show();
		};
	} else if (proc_div == "M" && addr_gbn == "N") { // 도로명 -> 지번
		var $addr2 = $("#inp_seq2_N_" + deli_cnt);
		var zipcode = $("#temp_zip1_" + deli_cnt).val() + $("#temp_zip2_" + deli_cnt).val();
		var addr1 = $("#temp_addr1_" + deli_cnt).val();
		var addr2 = $("#temp_addr2_" + deli_cnt).val() + " " + $addr2.val();
		reqData += "&zipcode=" + zipcode.replace("-", "") + "&addr1=" + addr1 +
			"&addr2=" + addr2;

		$("#temp_addr2_" + deli_cnt).val(addr2); // 임시폼 설정(상세주소)

		callBack = function (resp) {
			$("#seq2_N_" + deli_cnt).hide();
			$("#seq3_N_" + deli_cnt).html(resp).show();
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
// @return void
function switchDeliOption(mode, deli_cnt, dlvpSn) {
	var $rdioBtnU = $("#deli_" + deli_cnt + " input[name=deli_chk_" + deli_cnt + "]:radio[value='U']");
	var $rdioBtnC = $("#deli_" + deli_cnt + " input[name=deli_chk_" + deli_cnt + "]:radio[value='C']");
	if (mode == "mine") {
		$rdioBtnC.prop("checked", false);
		if ($("#deli_phone_text_" + deli_cnt + "_" + dlvpSn).is(":hidden")) {
			// 수정버튼(배송지 > 연락처의 우측버튼)이 클릭되어 해당 영역이 숨겨진 상태일 때
			$rdioBtnU.prop("checked", true);
		} else {
			$rdioBtnU.prop("checked", false);
		}
	} else if (mode == "new") {
		$rdioBtnC.prop("checked", true);

		//배송지수정 정보가 있을수 있음으로 초기화한다.
		$("#deli_" + deli_cnt + " input[name=inpdlvpnm]").val("");
		$("#deli_" + deli_cnt + " input[name=inprmitnm]").val("");
		$("#deli_" + deli_cnt + " input[name=inpzip1]").val("");
		$("#deli_" + deli_cnt + " input[name=inpzip2]").val("");
		$("#deli_" + deli_cnt + " input[name=inpaddr1]").val("");
		$("#deli_" + deli_cnt + " input[name=inpaddr2]").val("");
		$("#txt_zip_" + deli_cnt).text("");
		$("#txt_addr_" + deli_cnt).text("");
		$("#deli_" + deli_cnt + " input[name=stnm_inp_zip1]").val("");
		$("#deli_" + deli_cnt + " input[name=stnm_inp_zip2]").val("");
		$("#deli_" + deli_cnt + " input[name=stnm_inp_addr1]").val("");
		$("#deli_" + deli_cnt + " input[name=stnm_inp_addr2]").val("");
		$("#txt_stnm_zip_" + deli_cnt).text("");
		$("#txt_stnm_addr_" + deli_cnt).text("");
		$("#deli_" + deli_cnt + " input[name=inptel1]").val("");
		$("#deli_" + deli_cnt + " input[name=inptel2]").val("");
		$("#deli_" + deli_cnt + " input[name=inptel3]").val("");
		$("#deli_" + deli_cnt + " select[name=inpcell1]").prop("disabled", false).parent().show();
		$("#deli_" + deli_cnt + " input[name=inpcell1]").prop("disabled", true).hide();
		$("#deli_" + deli_cnt + " select[name=inpcell1]").val("010");
		$("#deli_" + deli_cnt + " input[name=inpcell1]").val("");
		$("#deli_" + deli_cnt + " input[name=inpcell2]").val("");
		$("#deli_" + deli_cnt + " input[name=inpcell3]").val("");

		$("#txt_zip1_" + deli_cnt).val("");
		$("#txt_zip2_" + deli_cnt).val("");
		$("#txt_addr1_" + deli_cnt).val("");
		$("#txt_addr2_" + deli_cnt).val("");
		$("#txt_zip_tot_" + deli_cnt).val("");

		$("#deli_" + deli_cnt + " input[name=inprmitnm]").attr("placeholder", "이름");
		$("#deli_" + deli_cnt + " input[name=inpdlvpnm]").attr("placeholder", "배송지명");

		if (deli_cnt == 1 && $("#deli_" + deli_cnt + " #deli_mine").length > 0) {
			//새로운 배송지 클릭시 주문자 수정 input 초기화
			var $spanWrap = $("#orderer_name_text_" + deli_cnt + "_new");
			var $inptWrap = $("#orderer_name_val_" + deli_cnt + "_new");
			var $span = $spanWrap.find("#nameSp");
			var $inpt = $inptWrap.find("#nameInpt");
			var nameText = $span.text();
			$inpt.val("");
			$("#changeNameNC").show();
			$("#changeMyDlvpCncl").hide();
			$spanWrap.show();
			$inptWrap.hide();

			//[지금 배송지를 다음에도 사용] 숨김
			$("#dlvp_reuse_mod").prop("checked", false);
			$("#dlvp_reuse_mod").hide();

			//[내 배송지 목록에 추가] 표시
			$("#dlvpuseyn_dd_" + deli_cnt).show();

			//배송메시지 복사 초기화
			if ($("#deli_" + deli_cnt + " #li_mine select[name=deli_msg]").length > 0) {
				$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").val("");
				$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").parent().show();
				$("#deli_" + deli_cnt + " #li_new select[name=deli_msg]").parent().next().hide();
				$("#deli_" + deli_cnt + " #li_new input[name=rcvmessage]").val("");
			}

			//선물메시지 복사 초기화
			if ($("#deli_" + deli_cnt + " #deli_mine #gift_msg_sel_" + deli_cnt).length > 0) {
				//var $deliMineParent = $("#deli_"+deli_cnt+" #deli_mine #gift_msg_sel_"+deli_cnt).parent();
				var $deliNewParent = $("#deli_" + deli_cnt + " #deli_new #gift_msg_sel_" + deli_cnt).parent();

				$deliNewParent.find("input[name^=gift_yn_]:radio").eq(0).prop("checked", false);
				$deliNewParent.find("input[name^=gift_yn_]:radio").eq(1).prop("checked", true);
				$deliNewParent.find("input[name^=receivename_]").val("");
				$deliNewParent.find("textarea[name^=sendmessage_]").val("");
				$deliNewParent.find("input[name^=sendname]").val("");
			}
		}
	}
}

// '주문자와 받는자 동일' 체크박스 핸들러. <br/>
// 연락처#1(지역번호 또는 통신망 식별번호)의 경우,
// 주문자 연락처의 활성화 상태(select인지 input인지)에 따라 받는자 연락처의 상태도 변경된다.
// @param obj event target
// @return void
function setRcverInfo(obj) {
	if ($(obj).prop("checked") == true) {
		var grockleName = $("#deli_1 [name=grockle_name]").val(); // 주문자명
		var cell2 = $("#deli_1 [name=grockle_cell2]").val(); // 연락처#2
		var cell3 = $("#deli_1 [name=grockle_cell3]").val(); // 연락처#3
		$("#deli_1 [name=inprmitnm]").val(grockleName); // 받는분 이름
		$("#deli_1 [name=inpcell2]").val(cell2); // 받는분 연락처#2
		$("#deli_1 [name=inpcell3]").val(cell3); // 받는분 연락처#3

		// 연락처#1 설정
		var $cell1 = $("#deli_1 [name=grockle_cell1]:enabled");
		if ($cell1.get(0).tagName == "SELECT") {
			$("#deli_1 input[name=inpcell1]").prop("disabled", true).hide();
			$("#deli_1 select[name=inpcell1]")
				.prop("disabled", false).val($cell1.val()).parent().show();
		} else if ($cell1.get(0).tagName == "INPUT") {
			$("#deli_1 select[name=inpcell1]").prop("disabled", true).parent().hide();
			$("#deli_1 input[name=inpcell1]").prop("disabled", false).val($cell1.val()).show();
		}
	}
}

// 다중배송 일 경우, '보낼 상품 선택하기' 영역 초기화
function init_deli_area() {
	var tit_product_choice_len = $(".tit_product_choice").length;
	for (i = 0; i < tit_product_choice_len; i++) {
		if ($(".tit_product_choice").eq(i).hasClass("show")) {
			$(".tit_product_choice").eq(i).toggleClass("show");
			$(".tit_product_choice").parent().parent().parent().parent().find(".order_goods").css("display", "none");
		}
	}
}

// 중복배송지 상품 수량 변경
function multi_qty_chg(obj) {

	var type = obj.name.substring(0, 5);
	var trgObj = $("#" + obj.name.substring(5));

	// 종이카드 체크 추가
	var deli_idx = obj.name.substring(obj.name.lastIndexOf("_") + 1);
	var ord_qty = 0;
	var msg_idx = 0;
	var re_name = "";
	var card_msg_arr = new Array();
	var card_msg_yn = "N";


	if (type == "mins_") {
		if (Number(trgObj.val()) > 0) {
			trgObj.val(Number(trgObj.val()) - 1);
		}
	} else {
		trgObj.val(Number(trgObj.val()) + 1);
	}
	trgObj.change();

	// 종이 카드 체크 추가
	$("input[name^=multi_prod_][name$=_" + deli_idx + "]").each(function () { // 배송지에 해당하는 상품의 수량 및 이름 체크
		ord_qty += $(this).val();
		re_name = $(this).attr("name").replace("multi_prod_", "");
		card_msg_arr[msg_idx] = "card_msg_info_" + re_name;
		msg_idx++;
	});

	for (var i = 0; i < card_msg_arr.length; i++) {
		re_name = card_msg_arr[i].replace("card_msg_info_", "");
		ord_qty = $("input[name=multi_prod_" + re_name + "]").val();
		if (ord_qty > 0 && $("#" + card_msg_arr[i]).val() == "Y") { // 카드 메시지 작성 가능 상품 수량 지정 한 경우
			card_msg_yn = "Y";
		}
	}

	if (card_msg_yn == "N") {
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:first").attr("disabled", true);
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:first").prop("disabled", true);
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").attr("disabled", true);
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").prop("disabled", true);
	} else {
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:first").attr("disabled", false);
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:first").prop("disabled", false);
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").attr("disabled", false);
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").prop("disabled", false);
	}

	if (type == "mins_" && trgObj.val() == 0) {
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:first").attr("disabled", false);
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:first").prop("disabled", false);
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").attr("disabled", false);
		$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").prop("disabled", false);
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

	// 신용카드 개월수 항목 분리 - 20181029
	$("#frm_inp select[name=cardinstmon2]").empty();
	$("#frm_inp select[name=cardinstmon2]").append("<option value=''>일시불</option>");
	$("#frm_inp select[name=cardinstmon2]").attr('disabled', true);

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
			// 신용카드 개월수 항목 분리 - 20181029
			$("#frm_inp select[name=cardinstmon2] option:first").prop('selected', true);
			$("#frm_inp select[name=cardinstmon2]").prop('disabled', true); // 비활성 처리
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
		// 신용카드 개월수 항목 분리 - 20181029
		$("#frm_inp select[name=cardinstmon2]").attr('disabled', true);
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

	// L-POINT 점수가 0 보다 크면 버튼 활성화, 아니면 포인트란 활성화 - 20181029 
	if ($("#useable_lt_point_amt").val() > 0) {
		$("#lt_point_amt").hide();
		$("#lt_point_amt_btn").show();
	} else {
		$("#lt_point_amt").show();
		$("#lt_point_amt_btn").hide();
	}
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
		$("singlePayText").text(""); // 이영석 2016.11.28 할부결제 체크 시 수정
	}
}

function setcardinstmon() {

	$("#frm_inp select[name=cardinstmon]").empty();
	$("#frm_inp select[name=cardinstmon]").append("<option value=''>일시불</option>");
	// 신용카드 개월수 항목 분리 - 20181029
	$("#frm_inp select[name=cardinstmon2]").empty();
	$("#frm_inp select[name=cardinstmon2]").append("<option value=''>일시불</option>");
	cardinstmonlist = $("#frm_inp input[name=onintmonth]:hidden").val().split(',');
	if (cardinstmonlist.length > 0) {
		for (i = 0; i < cardinstmonlist.length; i++) {
			if (cardinstmonlist[i] == "null" || cardinstmonlist[i] == "") {
				continue;
			}

			text = cardinstmonlist[i] + "개월";
			$("#frm_inp select[name=cardinstmon]").append("<option value='" + cardinstmonlist[i] + "'>(무) " + text + "</option>");
			// 신용카드 개월수 항목 분리 - 20181029
			$("#frm_inp select[name=cardinstmon2]").append("<option value='" + cardinstmonlist[i] + "'>(무) " + text + "</option>");
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
			$("#frm_inp select[name=cardinstmon]").append("<option value='" + cardinstmonlist[i] + "'>(유) " + text + "</option>");
			// 신용카드 개월수 항목 분리 - 20181029
			$("#frm_inp select[name=cardinstmon2]").append("<option value='" + cardinstmonlist[i] + "'>(유) " + text + "</option>");
		}
		//$("#frm_inp select[name=cardinstmon]").attr('disabled' , false);
	}

	if ($("#frm_inp select[name=cardinstmon] option").length > 1 && $("#frm_send input[name=prommdclcd_third]").val() != "35") {
		$("#frm_inp select[name=cardinstmon]").attr('disabled', false);
		$("#frm_inp select[name=cardinstmon2]").attr('disabled', false); // 20181029
	} else {
		$("#frm_inp select[name=cardinstmon]").attr('disabled', true);
		$("#frm_inp select[name=cardinstmon2]").attr('disabled', true); // 20181029
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
	console.log("selPayType : " + idx);
	// PG PROJECT : 주문 동의 영역 노출 제어
	if ($("#pay_method").css("display") == "block" && (id == "#pay_type4" || id == "#pay_type1")) { // 주결제 수단 노출된 상태이고 L.pay, 신용카드된 경우
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

// 배송지 선택
function deliSelect(mode, deli_idx) {
	// 새로운 배송지
	if (mode == 'new') {
		$("#deli_" + deli_idx + " dl.deli_mine").hide();
		$("#deli_" + deli_idx + " dl.deli_new").show();
		$("#deli_" + deli_idx + " #li_mine").removeClass('on');
		$("#deli_" + deli_idx + " #li_new").addClass("on");
	}
	// 내 배송지
	else if (mode == 'mine') {
		$("#deli_" + deli_idx + " dl.deli_mine").show();
		$("#deli_" + deli_idx + " dl.deli_new").hide();
		$("#deli_" + deli_idx + " #li_mine").addClass("on");
		$("#deli_" + deli_idx + " #li_new").removeClass('on');
	}
}

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

// 배송메시지 입력 값 길이제한 및 완료 버튼
// function.js 의 limitChars 와 동일하나, 메시지만 수정됨.
// 추후 비슷한 케이스 발생 시, 리팩토링 필요
function chkDeliMsgLimitAddBtn(textarea, limit, infodiv, deli_cnt) {
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
		// 휴대폰 소액 결제 || 네이버페이 인 경우
		if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == PAYTYPE_CODE_PHONE) {
			alert('일시불 할인을 받으시면 휴대폰결제를 하실수 없습니다.');
			//$("#frm_inp input[name=rdo_paytype]:radio[value='"+PAYTYPE_CODE_CARD+"']").click();
		} else if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == PAYTYPE_CODE_NAVERPAY) {
			alert('일시불 할인을 받으시면 네이버페이 결제를 하실수 없습니다.');
			//$("#frm_inp input[name=rdo_paytype]:radio[value='"+PAYTYPE_CODE_CARD+"']").click();
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
		})
		*/
		;

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

	if (maxDupIdx != dupcpn_idx) { // 최적가 체크 해제
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
	init_point();
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
		// 신용카드 개월수 항목 분리 - 20181029
		$("#frm_inp select[name=cardinstmon2] option:first").prop("selected", true);
		$("#frm_inp select[name=cardinstmon2]").prop("disabled", true);
	} else {
		// 결제수단 카드의 할부구분 제어
		$("#frm_inp input[name=rdo_cardinst]:radio").each(function () {
			$(this).prop("disabled", false);
		});
		$("#frm_inp input[name=rdo_cardinst]:radio:eq(0)").prop("checked", true);

		// 결제수단 카드의 할부월 제어
		$("#frm_inp select[name=cardinstmon] option:first").prop("selected", true);
		$("#frm_inp select[name=cardinstmon]").prop("disabled", false);
		// 신용카드 개월수 항목 분리 - 20181029
		$("#frm_inp select[name=cardinstmon2] option:first").prop("selected", true);
		$("#frm_inp select[name=cardinstmon2]").prop("disabled", false);
	}
}

function fnClear(obj) {
	obj.style.background = '';
}

// 롯데카드 결제 처리
function lottecard_payment(pay_type) {

	/*
	 * 2017.06.26 모바일/앱 체크 추가 , 롯데카드 앱설치 여부 ,롯데앱카드 설치 여부
	 * web은 롯데카드 앱설치여부 확인불가  ==> SPSW , ACSW , MAPC , ALP
	 * app이고 롯데카드 앱설치여부 Y==> SPSA , ACSA
	 * app이고 롯데카드 앱설치여부 N==> null , null
	 * app이고 롯데앱카드 Y      ==> MAPC
	 * app이고 롯데앱카드 N      ==> null
	 * 페이서비스는 전부              ==> ALP
	 * 다른결재방식 선택 null값 보냄
	 */

	lotte_auth_type = pay_type; //전역변수 lotte_auth_type 에 값을 미리 설정한다

	if (pay_type == "SPSA" || pay_type == "ACSA" || pay_type == "MAPC") {
		//앱체크 함수 호출 로직 추가
		chkAppIsInstall(pay_type);
	} else {
		console.log("1545 lotte_auth_type==" + lotte_auth_type);
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

//롯데카드 앱 설치여부 판단 리턴함수w
function rtnCardPaymentApp(appYn) {
	if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_CARD) {
		// 롯데카드 앱설치여부 값을 확인하여 appYn == 'Y' 이면 변경 없음. appYn == 'N' 이면 "null"값으로 호출
		if (appYn == 'N') {
			lotte_auth_type = "";
		}
		console.log("1704 lotte_auth_type==" + lotte_auth_type);
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

		}*/

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
	$("#dlv_prom_use_yn").val($("#frm_inp input[name=free]:checked").val());
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
	console.log("1840 auth_type==" + auth_type + " ,, " + $("#frm_send input[name=acqr_cd]").val());
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
		console.log("1858 card_pay_meth_cd==" + $("#frm_send input[name=card_pay_meth_cd]").val());
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

function init() {

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
		//$("#pay_card").show();
		$("#card_list").show(); // 신용카드 추가 - 20181029
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
	$("#frm_inp select[name=cardinstmon2]").attr('disabled', true); // 20181029
	$("#frm_inp select[name=bankno] option:first").attr('selected', true); // 무통장입금 은행
	//메시지카드 영역 초기화
	$("input[name^=gift_yn_]:visible:last").prop("checked", true);
	$("input[name^=gift_yn_]:visible:last").click();

	//선물하기 1차 관련 추가_20160517_선택 종이카드
	$("#frm_inp input[name=gift_msg_y_index]:hidden").val("");
	$("#frm_inp input[name=choose_card_msg_one]:hidden").val("");
	$("#frm_inp input[name=choose_card_msg_many]:hidden").val("");

	//선물하기 1차 추가_20160519
	var recvNmFix = $("#deli_1 #li_mine input[name=inprmitnm]").val();
	$(".gift_msgMultiInsert input[name=defultRecvNm]:hidden").val(recvNmFix);

	if (imallYN != "Y") {
		// 다중배송 배송지 n군데 설정
		$("#frm_inp select[name=areaNum_select]").val(1);
		$("#frm_inp select[name=areaNum_select]").prop("disabled", true);
		show_multi_deli_area(1);
		// 보낼 상품 선택하기 toggle
		init_deli_area();
	}

	// 참좋은혜택 배송비 default Setting
	benefit_dlvp_set();

	if (isDeliPlcChg) {
		// 새로운배송지 li 하위 컴포넌트 비활성
		$(".tab_addr #li_new").find("input").attr("disabled", true);
		$(".tab_addr #li_new").find("select").attr("disabled", true);
	} else {
		// 내배송지 li 하위 컴포넌트 비활성
		$(".tab_addr #li_mine").find("input").attr("disabled", true);
		$(".tab_addr #li_mine").find("select").attr("disabled", true);
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
	// 신용카드 선택 초기화 - 20181029
	$('.inlineBorder').removeClass('active');
}

// 구찌 상품 - 결제 전 재고 실시간 체크 Function
function fn_gucci_realtime() {
	var rtnFlag = true;

	var ordqty_arr = ($("#frm_send input[name=ordqty]:hidden").val()).split(split_gubun_1);
	var itemno_arr = ($("#frm_send input[name=itemno]:hidden").val()).split(split_gubun_1);
	var goodsno_arr = ($("#frm_send input[name=goodsno]:hidden").val()).split(split_gubun_1);

	var v_goods_no = '';
	var v_item_no = '';
	var v_real_qty = '';

	//상품정보획득
	for (var i = 0; i < goodsno_arr.length; i++) {
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
			dataType: "json",
			url: "/product/searchGucciRealtimeCheck.do?" + __commonParam,
			data: {
				ord_qty: v_real_qty,
				goods_no: v_goods_no,
				item_no: v_item_no
			},
			success: function (data) {
				if (data.count > 0) {
					alert("구찌연동오류: " + data.msg);
					rtnFlag = false;
				}
			},
			error: function (request, status) {
				alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
				rtnFlag = false;
			}
		});
		if (!rtnFlag) {
			return rtnFlag;
		}

	}
	return rtnFlag;
}

// 망고 상품 - 실시간 재고 체크 Function 
function fn_mango_realtime() {
	var return_val = true;

	var ordqty_arr = ($("#frm_send input[name=ordqty]:hidden").val()).split(split_gubun_1);
	var itemno_arr = ($("#frm_send input[name=itemno]:hidden").val()).split(split_gubun_1);
	var goodsno_arr = ($("#frm_send input[name=goodsno]:hidden").val()).split(split_gubun_1);
	var goodsnm_arr = ($("#frm_send input[name=goodsnm]:hidden").val()).split(split_gubun_1);

	var v_goods_no = '';
	var v_item_no = '';
	var v_real_qty = '';
	var goodsObj = {};

	//상품정보획득
	for (var i = 0; i < goodsno_arr.length; i++) {
		var sComma = "";
		if (i != 0) {
			sComma = "[!AND!]";
		}

		v_goods_no += sComma + goodsno_arr[i];
		v_item_no += sComma + itemno_arr[i];
		v_real_qty += sComma + ordqty_arr[i];

		goodsObj[goodsno_arr[i] + itemno_arr[i]] = goodsnm_arr[i];

	}
	//for ( var p in goodsObj ) console.log('goodsObj['+p+']: '+ goodsObj[p]);	
	$.ajax({
		async: false,
		type: "POST",
		dataType: "json",
		url: "/product/searchMangoRealtimeCheck.do?" + __commonParam,
		data: {
			goods_no_list: v_goods_no,
			item_no_list: v_item_no,
			real_qty_list: v_real_qty
		},
		success: function (data) {
			if (data.count > 0) {
				if (data.count == goodsno_arr.length) {
					alert('선택하신 상품이 모두 품절되어 주문이\n불가합니다.');
				} else {
					var goodsnmArr = [];
					var soldoutArr = data.list;
					for (var i = 0; i < soldoutArr.length; i++) {
						for (var key in goodsObj) {
							if (soldoutArr[i] == key) {
								goodsnmArr.push(goodsObj[key]);
							}
						}
					}
					alert('선택하신 상품 중 [' + goodsnmArr + ']의 재고수량이 부족하여 주문이 불가합니다.');
				}
				return_val = false;
			}
		},
		error: function (request, status) {
			//console.log('<<< 망고 실시간 재고체크 실패 >>>');
		}
	});
	return return_val;
}

function fn_orderGucciAgreeSup(target) {
	if ($(target).closest('div.check_layer').hasClass('on')) {
		$(target).closest('div.check_layer').removeClass('on');
		$(target).closest('div.check').removeClass('on').addClass('off');
		$("#gucci_sup_div").hide();
	} else {
		$(target).closest('div.check_layer').addClass('on');
		$(target).closest('div.check').removeClass('off').addClass('on');
		$("#gucci_sup_div").show();
	}
}

function fn_orderGucciAgreeTrns(target) {
	if ($(target).closest('div.check_layer').hasClass('on')) {
		$(target).closest('div.check_layer').removeClass('on');
		$(target).closest('div.check').removeClass('on').addClass('off');
		$("#gucci_trns_div").hide();
	} else {
		$(target).closest('div.check_layer').addClass('on');
		$(target).closest('div.check').removeClass('off').addClass('on');
		$("#gucci_trns_div").show();
	}
}

// 참좋은혜택 > 배송비 설정
function benefit_dlvp_set(arg) {
	var deli_idx = 1; // 상품 품목순번
	var bene_prd_obj;
	// default Setting
	if (arg == null) {
		while (true) {
			bene_prd_obj = $("input[name=bene_deli_data_" + deli_idx + "]:hidden");
			if (bene_prd_obj.length == 0) {
				break;
			}
			// 상품코드,배송코드,상품가격,주문수량
			var detail_data = $("input[name=bene_deli_data_" + deli_idx + "]:hidden").val().split('|');
			var goodsNoMany = "";
			var dlvPolcNoMany = "";
			var realSalePrcMany = "";
			var smpUseYnMany = "";
			var ordQtyMany = "";
			var split_str = "";
			var smartOrd = $("input[name=smartOrd]").val();
			var crspk_exist_yn = $("input[name=crspk_exist_yn]").val(); // 크로스픽 존재 여부

			if (crspk_exist_yn == "Y") { // 크로스픽 존재
				smartOrd = "N";
			}

			// 배송비 조회를 위한 데이터 생성
			$("input[name=bene_deli_data_" + deli_idx + "]:hidden").each(function () {
				chk_data = ($(this).val()).split('|');
				if (detail_data[1] == chk_data[1]) {
					split_str = (goodsNoMany == "" ? "" : split_gubun_1);

					goodsNoMany += (split_str + chk_data[0]);
					dlvPolcNoMany += (split_str + chk_data[1]);
					realSalePrcMany += (split_str + chk_data[2]);
					smpUseYnMany += (split_str + smartOrd);

					ordQtyMany += (split_str + chk_data[3]);
				}
			});

			// 배송비 조회
			var res_str = "";
			var res_code = "";
			var res_msg = "";
			var dlex_amt = 0;
			$.ajax({
				type: 'post',
				async: false,
				url: '/popup/multi_deli_amt.do?' + __commonParam,
				data: 'goodsNoMany=' + goodsNoMany + '&dlvPolcNoMany=' + dlvPolcNoMany + '&realSalePrcMany=' + realSalePrcMany + '&smpUseYnMany=' + smpUseYnMany + '&ordQtyMany=' + ordQtyMany,
				success: function (response) {
					res_str = response.split(':');
					res_code = res_str[0];
					res_msg = res_str[1];
					dlex_amt = $.trim(res_str[2]);
				}
			});

			if ($.trim(res_code) == '0000') {
				$("#bene_group_deli_amt_" + deli_idx).find("span").attr("dlex", dlex_amt);
				$("#bene_group_deli_amt_" + deli_idx).find("span").html(
					freeShippingYn == 'Y' ? "무료 <span class=\"no_bold\">(플래티넘+ 회원)</span>" : (dlex_amt == 0 ? "무료" : new String(dlex_amt).money() + "<span class=\"no_bold\">원</span>"));
			} else {
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
		$("input[name^=bene_deli_data_]").each(function () {
			var thisVal = $(this).val().substring(0, $(this).val().lastIndexOf("|"));
			if (thisVal == deli_data) {
				deli_idx = $(this).attr("name").substring("bene_deli_data_".length);
			}
		});
		var orgDlex = $("#bene_group_deli_amt_" + deli_idx).find("span").attr("dlex");

		$("#bene_group_deli_amt_" + deli_idx).find("span").attr("dlex", dlex_amt);
		$("#bene_group_deli_amt_" + deli_idx).find("span").html(
			freeShippingYn == 'Y' ? "무료 <span class=\"no_bold\">(플래티넘+ 회원)</span>" :
			(dlex_amt == 0 ? "무료<span class=\"no_bold\">(배송지 " + dlvp_cnt + ")</span>" :
				new String(dlex_amt).money() + "<span class=\"no_bold\">원(배송지 " + dlvp_cnt + ")</span>"));

		fn_calcTotalPrice(); // 금액 계산
	}
}

// 홈쇼핑 상품 - 우편번호 검색결과 선택 Function (단일 배송지만 해당)
function selSearchImallAddr(inpzip1, inpzip2, postaddr, corpPostNoSn, postNo) {
	$("#frm_inp input[name=corpPostNoSn]:hidden").eq(0).val(corpPostNoSn);
	$("#frm_inp input[name=postNo]:hidden").eq(0).val(postNo);
	$("#frm_inp input[name=inpzip1]:hidden").eq(0).val(inpzip1);
	$("#frm_inp input[name=inpzip2]:hidden").eq(0).val(inpzip2);
	$("#frm_inp input[name=inpaddr1]").eq(0).val(postaddr);
	$("#frm_inp input[name=inpaddr2]").eq(0).val('');
	$("#frm_inp input[name=inpaddr2]").focus();
	$("dd.add_result").empty();
	$("dd.add_result").hide();
}

// 홈쇼핑 상품 - 우편번호 검색 Function
function searchImallAddr() {
	var inpsearch = $("#inpsearch").val(); //검색 주소명
	if (!inpsearch) {
		alert("검색할 동이름을 입력해주세요.");
		return;
	}
	$.ajax({
		type: 'post',
		async: false,
		url: '/order/imall_search_address.do?' + __commonParam,
		data: "dname=" + inpsearch + "&grockle_yn=" + grockle_yn,
		success: function (response) {
			$("dd.add_result").show();
			$("dd.add_result").html(response);
		},
		error: function (request, status, err) {
			alert('우편번호 검색이 실패했습니다.\n다시 시도해주세요.');
			$("#frm_inp input[name=inpsearch]").focus();
		}
	});
}

// 홈쇼핑 상품 - 결제 전 재고/가격 실시간 체크 Function
function fn_pay_realtime(simpleMemberYnFirst) {
	var dup_goods_info = JSON.parse(dupGoodsInfo.replace(/'/g, '"'));
	var rtnFlag = true;
	// multdlv_goods_cnt : 주문 상품 갯수
	// $('#etMbrDlvpInfoArr') : 기존 등록된 배송지 갯수
	// v_goods_no_many : 상품 번호
	// v_item_no_many  : 단품번호
	// v_real_qty_many : 상품별 주문 수량
	// 배송지가 분리되지 않고 기존 배송지 중 선택할 경우는 모든 주문의 배송지 번호가 0으로 셋팅된다.
	var v_goods_no_many = '';
	var v_item_no_many = '';
	var v_real_qty_many = '';
	var v_post_no_manay = '';
	// 모바일 홈쇼핑 상품 주문시 재고 체크 로직 수정 - jyyoon10
	var v_cart_sn = '';
	//상품정보획득
	for (var i = 0; i < dup_goods_info.length; i++) {
		if (v_goods_no_many != '' && v_goods_no_many.length > 0) { // 구분자로 연결
			v_goods_no_many += "[!AND!]";
			v_item_no_many += "[!AND!]";
			v_real_qty_many += "[!AND!]";
		}
		v_goods_no_many += dup_goods_info[i][0];
		v_item_no_many += dup_goods_info[i][1];
		v_real_qty_many += dup_goods_info[i][2];
	}

	// 단일 배송지
	if (simpleMemberYnFirst == "Y") { //간편회원이면
		v_post_no_manay = $("#temp_zip1_1").val() + $("#temp_zip2_1").val();
	}
	//해당 회원의 등록된 홈쇼핑용 배송지 수
	else if (deli_size == "0") { //최초 구매 신규 입력
		v_post_no_manay = $("#frm_inp input[name=inpzip1]:hidden").val() + $("#frm_inp input[name=inpzip2]:hidden").val();
	} else {
		//신규 입력
		if ($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() != undefined || $("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() != "undefined") {
			v_post_no_manay = $(":hidden[name=postNo]").eq(0).val();
		}
		//기존 배송지 선택
		else {
			v_post_no_manay = $("#frm_inp input[name=postNo]").eq(0).val();
		}
	}

	// 모바일 홈쇼핑 상품 주문시 재고 체크 로직 수정 - jyyoon10
	v_cart_sn = $("#frm_send input[name=cartsn]:hidden").val();

	//alert("call Ajax");
	//alert('Call Ajax 1. goods_no : ' + v_goods_no_many + ' 2. item_no : ' + v_item_no_many + ' 3. real_qty : ' + v_real_qty_many + ' 4. cart_sn : ' + v_cart_sn);

	$.ajax({
		async: false,
		cache: false,
		type: "POST",
		dataType: "json",
		url: "/product/searchOrderRealtimePay.do?" + __commonParam,
		data: {
			goods_no_list: v_goods_no_many,
			item_no_list: v_item_no_many,
			real_qty_list: v_real_qty_many,
			post_no_manay: v_post_no_manay,
			cartSn: v_cart_sn,
			dlvp_cnt: 0,
			goods_no_many: "",
			item_no_manay: "",
			ord_qty_many: ""
		},
		success: function (data) {
			if (data.count > 0) {
				var msg = "상품의 재고 수량이 부족합니다.";

				if (data.list != "[null]") {
					if (data.count > 1) {
						msg = '각상품 ' + data.list + '의 재고 수량이 부족합니다.';
					} else {
						msg = '상품 ' + data.list + '의 재고 수량이 부족합니다.';
					}
				}

				alert(msg);

				rtnFlag = false;
			} else if (data.deliv == "N") {
				alert('배송불가 지역 입니다');
				rtnFlag = false;
			} else {
				rtnFlag = true;
			}
		},
		error: function (request, status) {
			//alert("error");
			alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
			rtnFlag = false;
		}
	});
	return rtnFlag;
}

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
	iscmcd = $("#frm_inp select[name=iscmcd]").val();
	cpncardcd = $("#frm_send input[name=cardkndcd]:hidden").val(); // 할인쿠폰의 카드정보
	cpncardcd_dup = $("#frm_send input[name=cardkndcd_dup]:hidden").val(); // 중복카드할인쿠폰의 카드정보

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
	// 문화비 소득공제 제외 동의
	if ($("#frm_send input[name=is_idne_part]:hidden").val() == "Y" && !$("#frm_inp input[name=idne_ord_agr_yn]").is(":checked")) {
		if (confirm("도서∙공연비 소득공제 미적용 동의하셔야 구매가 가능합니다.")) {
			$("#frm_inp input[name=idne_ord_agr_yn]:checkbox").focus();
			$("#frm_inp input[name=idne_ord_agr_yn]").prop("checked", true);
		}
		return;
	} else {
		$("#frm_send input[name=idne_ord_agr_yn]:hidden").val("Y");
	}
	// 망고몰 개인정보 동의안
	if (manggo_yn == 'Y') {
		//망고상품 재고체크
		if (!fn_mango_realtime()) {
			return;
		}
		var manggo_agr_yn = $("#frm_inp input[name=manggo_agr_yn]:checkbox").attr("checked");
		if (!$("#frm_inp input[name=manggo_agr_yn]").is(":checked")) {
			alert("개인정보 국외 이전 동의를 하셔야 합니다.");
			$("#frm_inp input[name=manggo_agr_yn]:checkbox").focus();
			$("#frm_inp input[name=manggo_agr_yn]").prop("checked", true);
			return;
		}
	}

	// 구찌 개인정보 동의안
	if (gucci_yn == 'Y') {
		//구찌 재고체크
		if (!fn_gucci_realtime()) {
			return;
		}
		if (!$("#frm_inp input[name=gucci_trns_yn]").is(":checked")) {
			alert("개인정보의 국외 이전에 동의하셔야 구매가 가능합니다.");
			$("#frm_inp input[name=gucci_trns_yn]:checkbox").focus();
			$("#frm_inp input[name=gucci_trns_yn]").prop("checked", true);
			return;
		}
		if (!$("#frm_inp input[name=gucci_sup_yn]").is(":checked")) {
			$("#frm_send input[name=gucci_arg_yn]:hidden").val("N");
		} else {
			$("#frm_send input[name=gucci_arg_yn]:hidden").val("Y");
		}
		$("#frm_send input[name=gucci_yn]:hidden").val("Y");
	}

	// 몽블랑 개인정보 동의
	if (montblanc_yn == 'Y') {
		if (!$("#frm_inp input[name=montblanc_trns_yn]").is(":checked")) {
			alert("개인정보 국외 이전 동의를 하셔야 합니다.");
			$("#frm_inp input[name=montblanc_trns_yn]:checkbox").focus();
			$("#frm_inp input[name=montblanc_trns_yn]").prop("checked", true);
			return;
		}
		$("#frm_send input[name=montblanc_yn]:hidden").val("Y");
	}

	// 버버리 개인정보 동의
	if (burberry_yn && burberry_yn == 'Y') {
		if (!$("#frm_inp input[name=burberry_trns_yn]").is(":checked")) {
			alert("개인정보 제 3자 정보 제공에 동의하셔야 구매가 가능합니다.");
			$("#frm_inp input[name=burberry_trns_yn]:checkbox").focus();
			//$("#frm_inp input[name=burberry_trns_yn]").prop("checked", true);
			return;
		}
		$("#frm_send input[name=burberry_yn]:hidden").val("Y");
	}

	// 크로스픽 편의점 동의
	if ($("#frm_send input[name=crspk_exist_yn]:hidden").val() == "Y" && !$("#frm_inp input[name=crspk_ord_agr_yn]").is(":checked")) {
		alert('스마트픽 픽업 배송 확인에 동의하셔야 구매가 가능합니다.');
		$("#frm_inp input[name=crspk_ord_agr_yn]:checkbox").focus();
		$("#frm_inp input[name=crspk_ord_agr_yn]").prop("checked", true);
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

		var qs_yn = $("#frm_send input[name=qs_yn]:hidden").val(); //퀵배송정보

		if (freeShippingYn == 'N') { // 플래티넘 플러스가 아니면
			if ($("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")) { // 다중배송여부
				stot_deli_amt = $("#frm_inp input[name=caltotdeliamt]:hidden").val(); // 계산된 총배송비
			} else {
				stot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
			}
		} else {
			if (qs_yn == "Y") {
				stot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
			}
		}
		// 배송비 적용
		if (freeShippingYn == 'N') { // 플래티넘 플러스가 아니면
			totpayamt = (parseInt(totpayamt) + parseInt(stot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
		} else {
			if (qs_yn == "Y") {
				totpayamt = (parseInt(totpayamt) + parseInt(stot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
			}
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

	if (imallYN == "Y") {
		// (신규)배송지 목록으로 추가여부 (배송지사용 여부)
		dlvpuseyn = "Y";
		cbltelrgnno = "000";
		cblteltxnono = "0000";
		cbltelendno = "0000";
	}

	if ("Y" == grockle_yn) {
		// 비회원 구매 관련 Start
		var grockle_info = $("#frm_inp input[name=grockle_info]:checkbox").attr("checked");
		var grockle_info = $("#frm_inp input[name=grockle_info]:checkbox").prop("checked");
		var grockle_name = $("#frm_inp input[name=grockle_name]");
		var grockle_cell1 = $("#frm_inp [name=grockle_cell1]:enabled");
		var grockle_cell2 = $("#frm_inp input[name=grockle_cell2]");
		var grockle_cell3 = $("#frm_inp input[name=grockle_cell3]");
		var grockle_mail1 = $("#frm_inp input[name=grockle_mail1]");
		var grockle_mail2 = $("#frm_inp [name=grockle_mail2]:enabled");

		if (!grockle_info) {
			alert("비회원 주문을 위한 개인정보 수집 및 이용 동의를 하셔야 합니다.");
			$("#frm_inp input[name=grockle_info]:checkbox").prop("checked", true).focus();
			return;
		}

		if (grockle_name.val() == "") {
			alert("주문하시는 분 성명을 입력하세요.");
			grockle_name.focus();
			return;
		}

		if (!$.trim(grockle_cell2.val()).isNum() || ($.trim(grockle_cell2.val()).length < 3 || $.trim(grockle_cell2.val()).length > 4)) {
			alert('주문자 연락처를 3~4자리 숫자로 입력해주세요.');
			grockle_cell2.focus();
			return;
		}

		if (!$.trim(grockle_cell3.val()).isNum() || ($.trim(grockle_cell3.val()).length < 3 || $.trim(grockle_cell3.val()).length > 4)) {
			alert('주문자 연락처를 3~4자리 숫자로 입력해주세요.');
			grockle_cell3.focus();
			return;
		}

		if (grockle_mail1.val() == "") {
			alert("주문자 메일 주소를 입력하세요.");
			grockle_mail1.focus();
			return;
		}

		if (grockle_mail1.val().indexOf("@") > 0) {
			alert("주문자 메일계정에 '@'문자는 사용할 수 없습니다.");
			$("#frm_inp input[name=grockle_mail1]").focus();
			return;
		}

		if (grockle_mail2.val() == "") {
			alert("주문자 메일 주소를 선택하세요.");
			grockle_mail2.focus();
			return;
		}

		if (grockle_mail2.val().indexOf("@") > 0) {
			alert("주문자 메일계정에 '@'문자는 사용할 수 없습니다.");
			grockle_mail2.focus();
			return;
		}

		$("#frm_send input[name=grockle_mail]").val(grockle_mail1.val() + '@' + grockle_mail2.val());
		$("#frm_send input[name=grockle_cell_1]").val(grockle_cell1.val());
		$("#frm_send input[name=grockle_cell_2]").val(grockle_cell2.val());
		$("#frm_send input[name=grockle_cell_3]").val(grockle_cell3.val());
		$("#frm_send input[name=grockle_name]").val(grockle_name.val());
		// 비회원 구매 관련 End
		$("#frm_send input[name=ord_final_nm]").val(grockle_name.val()); //선물하기 1차 추가_주문자명 세팅_문구 체크
	} else {
		if (username != $('#nameSp').text()) { // 고객명과 수정된 이름이 다른 경우
			$("#frm_send input[name=ord_man_nm]").val($('#nameSp').text()); // 주문하시는 분 성명 변경
			$("#frm_send input[name=ord_final_nm]").val($('#nameSp').text()); //선물하기 1차 추가_주문자명 세팅_문구 체크
		} else {
			$("#frm_send input[name=ord_man_nm]").val("");
			$("#frm_send input[name=ord_final_nm]").val(username); //선물하기 1차 추가_주문자명 세팅_문구 체크
		}
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
			$("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val(recvNmMsg);
			$(".gift_msgMultiInsert #sendmessage_1").val(txtMsg);
			$("#frm_inp .gift_msgMultiInsert input[name=sendname_1]").val(sendNmMsg);
		}
	}
	//선물하기 1차 관련 추가_20160517
	if (imallYN != "Y") {
		if (!setDeliData()) {
			return;
		}
	} else {
		if (!setImallDeliData()) {
			//alert("setImallDeliData is false");
			return;
		}
	}

	/**************************************************************
	 * 퀵배송추가 휴무/배송지서울체크 S
	 **************************************************************/
	if (!fn_chkDeliDeptClose()) {
		return;
	}
	/**************************************************************
	 * 퀵배송추가 휴무/배송지서울체크 E
	 **************************************************************/

	/**************************************************************
	 * LG희망 배송일 체크 및 세팅 S
	 **************************************************************/
	var goodsNoArr = ($("#frm_send input[name=goodsno]:hidden").val()).split(split_gubun_1);
	var useDlvHopeDdArr = ($("#frm_send input[name=use_dlv_hope_dd]:hidden").val()).split(split_gubun_1);
	var mdlNoArr = ($("#frm_send input[name=mdl_no]:hidden").val()).split(split_gubun_1);
	var ordqtyArr = ($("#frm_send input[name=ordqty]:hidden").val()).split(split_gubun_1);

	var dlvHopeChk = true;
	var goodsNoDlvhope = "";

	for (var i = 0; i < goodsNoArr.length; i++) {

		if ('Y' == useDlvHopeDdArr[i]) { // 희망 배송일 사용 일때
			if ('' == $("#select_dd_" + i).val() || '날짜를 선택해 주세요.' == $("#select_dd_" + i).val()) {
				$("#select_dd_" + i).focus();
				alert("희망배송일을 선택하세요.");
				return;
			} else {
				$.ajax({
					async: false,
					url: "/order/dlvHopeChk.do",
					dataType: "json",
					cache: false,
					data: {
						mdlNo: mdlNoArr[i],
						qty: ordqtyArr[i],
						dlvHopeDd: $("#select_dd_" + i).val()
					},
					success: function (result) {
						if (result.success) {
							if (i < goodsNoArr.length - 1) {
								goodsNoDlvhope += $("#select_dd_" + i).val() + ':^:';
							} else goodsNoDlvhope += $("#select_dd_" + i).val();
						} else {
							$("#select_dd_" + i).focus();
							alert("선택하신 배송일의 예약이 마감되었습니다.\n 희망배송일을 다시 선택해주세요.");
							dlvHopeChk = false;
							return;
						}
					}
				});
			}
		} else {
			if (i < goodsNoArr.length - 1) {
				goodsNoDlvhope += '9999-12-31:^:';
			} else goodsNoDlvhope += '9999-12-31';
		}
	}

	if (!dlvHopeChk) return;

	$("#frm_send input[name=goods_choc_desc]:hidden").val(goodsNoDlvhope); // 희망배송일 세팅

	/**************************************************************
	 * LG희망 배송일 체크 및 세팅 E
	 **************************************************************/

	/**************************************************************
	 * 전담배송 주문 가능 수량 체크 S
	 **************************************************************/
	if ('Y' == $("#frm_send input[name=cpcg_dlv_yn]:hidden").val()) {

		var cpcgDlvChk = true;
		var dlvseqSel = $('[name=dlvseqSel]:checked').val();
		var cpcgViewYn = $('#cpcg_view_yn').val();
		var dlvseqSelArr;
		var ordqty_arr = ($("#frm_send input[name=ordqty]:hidden").val()).split(split_gubun_1);
		var v_real_qty = 0;

		if (undefined == cpcgViewYn || 'Y' != cpcgViewYn) {
			alert('배송지가 런닝피쉬 서비스 가능 지역이 아닙니다.\n배송 가능 주소지로 변경해주세요.');
			return;
		}

		if (undefined == dlvseqSel || '' == dlvseqSel) {
			alert('배송일자/시간을 선택 해주세요.');
			return;
		} else {
			dlvseqSelArr = dlvseqSel.split('_');
		}

		// 상품수량
		for (var i = 0; i < ordqty_arr.length; i++) {
			v_real_qty += ordqty_arr[i] * 1;
		}

		$.ajax({
			async: false,
			url: "/order/cpcgDlvChk.do",
			dataType: "json",
			cache: false,
			data: {
				seq_mgmt_sn: dlvseqSelArr[0],
				dlv_rgn_nm: dlvseqSelArr[1],
				dlv_dtime: dlvseqSelArr[2],
				ord_qty: v_real_qty
			},
			success: function (result) {
				if (result.msg != 'success') {
					alert('주문마감 되었습니다. 배송일자와 시간을 다시 선택해주세요.\n' + result.msg);
					cpcgDlvChk = false;
				}
			}
		});

		if (!cpcgDlvChk) {
			location.reload();
			return;
		}

		$("#frm_send input[name=seq_mgmt_sn]:hidden").val(dlvseqSelArr[0]); // 전담배송 회차
		$("#frm_send input[name=dlv_rgn_nm]:hidden").val(dlvseqSelArr[1]); // 전담배송 배송지역
		$("#frm_send input[name=dlv_dtime]:hidden").val(dlvseqSelArr[2]); // 전담배송 배송일
		$("#frm_send input[name=dlv_strt_time]:hidden").val(dlvseqSelArr[3]); // 전담배송 배송시작시간
		$("#frm_send input[name=dlv_end_time]:hidden").val(dlvseqSelArr[4]); // 전담배송 배송종료시간

	}
	/**************************************************************
	 * 전담배송 주문 가능 수량 체크 E
	 **************************************************************/



	if ("Y" != grockle_yn) {
		// 스마트픽 교환권 MMS 보내기 (hsu)
		//var sendSms = ($("#frm_inp input[name=sendSms]:checkbox").prop("checked")?"Y":"N");
		if (gubun == 'SMARTPICK' || gubun == 'ECOUPON') { //20160620 jnlee e쿠폰 다중배송 기능 추가 and 지금보내기 삭제
			//if (sendSms=='Y' && (gubun=='SMARTPICK' || gubun=='ECOUPON') ){
			//$("#frm_send input[name=sendSms]:hidden").val(sendSms);
			var rNum = $("#frm_inp select[name=areaNum_select]").val();
			var adre_no_01 = "";
			var adre_no_02 = "";
			var adre_no_03 = "";
			var adre_nm = "";
			var msg_cont = "";
			if (rNum == undefined || rNum.length == 0) rNum = 1;
			for (var i = 1; i <= rNum; i++) {
				//마스터 휴대폰번호로 우선 셋팅
				$("#frm_inp input[name=mst_adre_nm_temp_" + i + "]:hidden").val($("#frm_inp input[name=mst_adre_nm_" + i + "]").val());
				$("#frm_inp input[name=mst_adre_no_temp_01_" + i + "]:hidden").val($("#frm_inp select[name=mst_adre_no_01_" + i + "]").val());
				$("#frm_inp input[name=mst_adre_no_temp_02_" + i + "]:hidden").val($("#frm_inp input[name=mst_adre_no_02_" + i + "]").val());
				$("#frm_inp input[name=mst_adre_no_temp_03_" + i + "]:hidden").val($("#frm_inp input[name=mst_adre_no_03_" + i + "]").val());

				//마스터 휴대폰번호가 없을때 기본주소로 셋팅
				//					if ($("#frm_inp input[name=mst_adre_no_01_"+i+"]:hidden").val() == "" ) {
				//					    $("#frm_inp input[name=mst_adre_nm_"+i+"]:hidden").val($("#frm_inp input[name=ordr_nm_"+i+"]:hidden").val());
				//					    $("#frm_inp input[name=mst_adre_no_01_"+i+"]:hidden").val($("#frm_inp input[name=adre_no_01_"+i+"]:hidden").val());
				//					    $("#frm_inp input[name=mst_adre_no_02_"+i+"]:hidden").val($("#frm_inp input[name=adre_no_02_"+i+"]:hidden").val());
				//					    $("#frm_inp input[name=mst_adre_no_03_"+i+"]:hidden").val($("#frm_inp input[name=adre_no_03_"+i+"]:hidden").val());
				//					}
				$("#frm_inp input[name=msg_cont_temp_" + i + "]:hidden").val($("#frm_inp textarea[name=msg_cont_" + i + "]").val());

				var adre_no_input = $.trim($("#frm_inp input[name=mst_adre_no_temp_02_" + i + "]:hidden").val()) + $.trim($("#frm_inp input[name=mst_adre_no_temp_03_" + i + "]:hidden").val());
				var adre_no = $.trim($("#frm_inp input[name=mst_adre_no_temp_01_" + i + "]:hidden").val()) + adre_no_input;
				var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;

				var tgMsg = "받는 분";
				if ($("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")) {
					tgMsg += i;
				}

				if (adre_no_input == "") {
					alert(tgMsg + "의 휴대폰 번호가 비어있습니다.");
					return;
				} else {
					if (!regExp.test(adre_no)) {
						alert(tgMsg + "의 휴대폰 번호가 올바르지 않습니다.");
						return;
					}
				}

				// 수취인 체크
				if ($.trim($("#frm_inp input[name=mst_adre_nm_temp_" + i + "]:hidden").val()) == "") {
					alert(tgMsg + "의 이름이 비어있습니다.");
					return;
				}

				if (i > 1) {
					adre_no_01 += split_gubun_1;
					adre_no_02 += split_gubun_1;
					adre_no_03 += split_gubun_1;
					adre_nm += split_gubun_1;
					msg_cont += split_gubun_1;
				}
				adre_nm += $("#frm_inp input[name=mst_adre_nm_temp_" + i + "]:hidden").val();
				adre_no_01 += $.trim($("#frm_inp input[name=mst_adre_no_temp_01_" + i + "]:hidden").val());
				adre_no_02 += $.trim($("#frm_inp input[name=mst_adre_no_temp_02_" + i + "]:hidden").val());
				adre_no_03 += $.trim($("#frm_inp input[name=mst_adre_no_temp_03_" + i + "]:hidden").val());
				msg_cont += $("#frm_inp input[name=msg_cont_temp_" + i + "]:hidden").val();
			}
			$("#frm_send input[name=mst_adre_nm]:hidden").val(adre_nm);
			$("#frm_send input[name=mst_adre_no_01]:hidden").val(adre_no_01);
			$("#frm_send input[name=mst_adre_no_02]:hidden").val(adre_no_02);
			$("#frm_send input[name=mst_adre_no_03]:hidden").val(adre_no_03);
			$("#frm_send input[name=msg_cont]:hidden").val(msg_cont);

		} //20160620 end jnlee e쿠폰 다중배송 기능 추가 and 지금보내기 삭제
	}

	// 상품수량 체크
	if ($("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")) { // 다중배송이면
		var cartsn_arr = ($("#frm_send input[name=cartsn]:hidden").val()).split(split_gubun_1);
		var ordqty_arr = ($("#frm_send input[name=ordqty]:hidden").val()).split(split_gubun_1); // 상품별 총 주문 수량
		var goodsnm_arr = ($("#frm_send input[name=goodsnm]:hidden").val()).split(split_gubun_1); // 상품별 총 주문 수량
		var dlvmeancd_arr = ($("#frm_send input[name=dlvmeancd]:hidden").val()).split(split_gubun_1); // 배송수단코드

		var tmp_qty = 0;
		//20160620 start jnlee e쿠폰 다중배송 기능추가
		var rNum = $("#frm_inp select[name=areaNum_select]").val();
		var smpadreperqty = "";
		//20160620 end jnlee e쿠폰 다중배송 기능추가

		for (var i = 0; i < cartsn_arr.length; i++) {
			tmp_qty = 0;
			var j = 1; //20160620 jnlee e쿠폰 다중배송 기능추가

			$("input[name^=multi_prod_" + cartsn_arr[i] + "]").each(function () {
				tmp_qty += parseInt($(this).val());
				//20160620 start jnlee e쿠폰 다중배송 기능추가
				if (j <= rNum) smpadreperqty += $(this).val();
				if (j < rNum) {
					smpadreperqty += split_gubun_3;
				} else if (j == rNum) {
					smpadreperqty += split_gubun_1;
				}
				j++;
				//20160620 end jnlee e쿠폰 다중배송 기능추가
			});

			if (parseInt(ordqty_arr[i]) != tmp_qty && dlvmeancd_arr[i] != '90') {
				alert(goodsnm_arr[i] + ' 수가 맞지 않습니다.');
				return;
			}
		}
		$("#frm_send input[name=smpadreperqty]:hidden").val(smpadreperqty); //20160620 jnlee e쿠폰 다중배송 기능추가
	}

	// 결제정보
	paytype = $("#frm_inp input[name=paytype]:hidden").val(); // 결제수단
	totsttlamt = $("#frm_inp input[name=totsttlamt]:hidden").val(); // 총결제금액

	if (parseInt(totsttlamt) > 0) {
		var iscmcd, cardinstmon, virAcctBank, onlineacctname;
		var cardinst, bankno;
		if (paytype == PAYTYPE_CODE_CARD || paytype == PAYTYPE_CODE_LPAY) {
			iscmcd = $("#frm_inp select[name=iscmcd]").val();

			// L.Pay, 신용카드 분기 체크 - 20181029
			if (paytype == PAYTYPE_CODE_LPAY) {
				// 2012.12.26
				cardinstmon = $("#frm_inp select[name=cardinstmon]").val();
			} else {
				cardinstmon = $("#frm_inp select[name=cardinstmon2]").val();
			}

			if (cardinstmon == "" || $("#frm_send input[name=prommdclcd_third]").val() == "35") {
				cardinst = "01";
				cardinstmon = "";

				// L.Pay, 신용카드 분기 체크 - 20181029
				if (paytype == PAYTYPE_CODE_LPAY) {
					$("#frm_inp select[name=cardinstmon]").val("");
				} else {
					$("#frm_inp select[name=cardinstmon2]").val("");
				}

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
			alert("L-money 전용 상품입니다. \n현재 보유하고 계신 L-money가 부족하여 주문을 진행 하실 수 없습니다.");
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

	var goodsno_arr = ($("#frm_send input[name=goodsno]:hidden").val()).split(split_gubun_1);
	var v_goods_no = "";

	for (var i = 0; i < goodsno_arr.length; i++) {
		v_goods_no += goodsno_arr[i] + ":";
	}

	//상품권 구매제한 체크
	pticketCheck(0, v_goods_no, function (flag) {
		if (flag) {
			return;
		} else {
			/* 20170607 결재 모니터링 로그 등록 처리  */
			regOpOrdPayErrLog(); // 결재 모니터링 로그 등록

			doXansim();
		}
	});
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

		fn_LpayIframeSet(); // Lpay iframe 설정

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
			//			} else if (X_CARDTYPE == paytype_card_020){ // 하나SK
			//				$("#frm_send input[name=credit_crd_gb]:hidden").val("2"); // MPI
			//
			//				hanaskcard_payment();
		} else if (X_CARDTYPE == paytype_card_026) {
			$("#frm_send input[name=credit_crd_gb]:hidden").val("1"); // ISP
			misp_create_data();
		} else if (X_CARDTYPE == paytype_card_036 || X_CARDTYPE == paytype_card_008 || X_CARDTYPE == paytype_card_020) { // ilkMPI (씨티, 외환)
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

// 2011.05.20 포인트 선택에 따른 금액 변경
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
	var qs_yn = $("#frm_send input[name=qs_yn]:hidden").val(); //퀵배송정보

	lpoint_amt = ($("#lpoint_amt").prop("id") == undefined ? "" : (($("#lpoint_amt").val()).length < 1 ? 0 : $("#lpoint_amt").val())); // L_포인트
	lt_point_amt = ($("#lt_point_amt").prop("id") == undefined ? "" : (($("#lt_point_amt").val()).length < 1 ? 0 : $("#lt_point_amt").val())); // 롯데포인트
	deposit_amt = ($("#deposit_amt").prop("id") == undefined ? "" : (($("#deposit_amt").val()).length < 1 ? 0 : $("#deposit_amt").val())); // 보관금
	//		soil_point_amt  = ($("#soil_point_amt").prop("id")==undefined?"":(($("#soil_point_amt").val()).length<1?0:$("#soil_point_amt").val())); // S-oil포인트

	dlv_prom_use_yn = $("#dlv_prom_use_yn").val(); // 무료배송권 사용 여부
	dlv_fvr_val = (dlv_prom_use_yn == "Y" ? $("#dlv_fvr_val").val() : "0"); // 무료배송권 금액

	tot_deli_amt = 0; // 총배송비

	if (freeShippingYn == 'N') { // 플래티넘 플러스가 아니면
		if ($("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")) { // 다중배송여부
			tot_deli_amt = $("#frm_inp input[name=caltotdeliamt]:hidden").val(); // 계산된 총배송비
		} else {
			tot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
		}
	} else {
		/**********************************************
		 * 퀵배송추가 배송비 S
		 ***********************************************/
		if (qs_yn == "Y") {
			tot_deli_amt = $("#frm_inp input[name=orgtotdeliamt]:hidden").val(); // 배송비
		}
		/**********************************************
		 * 퀵배송추가 배송비 E
		 ***********************************************/
	}

	// 할인 인 경우만 금액 차감
	if (includeSaveInstCpn == 'Y') {
		totpayamt = payamt.toString();
	} else {
		totpayamt = (payamt - dcamt).toString();
	}

	// 배송비 적용
	if (freeShippingYn == 'N') { // 플래티넘 플러스가 아니면
		totpayamt = (parseInt(totpayamt) + parseInt(tot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
	} else {

		/**********************************************
		 * 퀵배송추가 배송비 S
		 ***********************************************/
		if (qs_yn == "Y") {
			totpayamt = (parseInt(totpayamt) + parseInt(tot_deli_amt) - parseInt($("#frm_inp input[name=orgtotdeliamt]:hidden").val())).toString(); // 기존 배송비 를 빼고 신규 배송비 적용
		}
		/**********************************************
		 * 퀵배송추가 배송비 E
		 ***********************************************/
	}

	// 참좋은혜택 합계 계산
	var totOrdAmt = totpayamt;
	if (includeSaveInstCpn != 'Y') {
		totOrdAmt = Number(totOrdAmt) + Number(dcamt);
	}
	$("#bene_tot_amt").find("span").text(String(totOrdAmt).money() + "원");
	$("#frm_inp input[name=totordamt]:hidden").val(totOrdAmt);
	$("#totalOrdAmt").html("<strong>" + String(totOrdAmt).money() + "</strong>원");

	// 중복쿠폰 사용
	if (dup_cpn_amt > 0) {
		totpayamt = (totpayamt - dup_cpn_amt).toString();
	}

	// 3차쿠폰 사용
	if (third_cpn_amt > 0) {
		totpayamt = (totpayamt - third_cpn_amt).toString();
	}

	/**********************************************
	 * 퀵배송추가 배송비 S 총주문금액(배송비미포함), 배송비, 할인금액, 총결제금액
	 ***********************************************/
	if (qs_yn == "Y") {
		var all_dc_amt = Number(dcamt) + Number(dup_cpn_amt) + Number(third_cpn_amt);
		totpayamt = fn_quicDeliAmtChk(totOrdAmt, tot_deli_amt, all_dc_amt, totpayamt);
		dlv_prom_use_yn = 'N';
	} else {
		//무료배송권은 퀵배송에서는 사용못함
		// 무료배송권 사용 시
		// 무료배송권은 배송비가 있을시에만 사용가능하다.
		if (dlv_prom_use_yn == "Y" && dlv_fvr_val > 0 && tot_deli_amt > 0) {
			totpayamt = (totpayamt - dlv_fvr_val).toString();
		} else if (dlv_prom_use_yn == "Y" && dlv_fvr_val > 0 && tot_deli_amt == 0) {
			dlv_prom_use_yn = 'N';
			$("#dlv_prom_use_yn").val("N"); // 무료배송권 사용 여부
		}
	}
	/**********************************************
	 * 퀵배송추가 배송비 E
	 ***********************************************/

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
	//배송비금액이 있을시만 사용이 가능하다.
	if (dlv_prom_use_yn == "Y" && dlv_fvr_val > 0 && tot_deli_amt > 0) {
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
		}*/

	// 내포인트사용 -- 모바일주문서간소화
	$("#usePointSum").html(pointSum.toString().money() + "<span class=\"no_bold\">원</span>");

	// 무료배송권 정보
	if (dlv_prom_use_yn == "Y" && dlv_fvr_val > 0 && tot_deli_amt > 0) {
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
		$("#div_paytype #card_list").hide(); // 신용카드 추가 - 20181029
		$("#div_paytype #pay_card").hide();
		$("#div_paytype #pay_bank").hide();
		$("#h3_paytype_title").hide();
		$(".paytype_title_wrap").hide();
		$("#payment_method_next_use").hide();
	} else {
		$("#div_paytype_void").show(); // 흰색영역 비노출 처리 20160218
		$("#div_paytype #pay_method").show();
		// L.Pay, 신용카드 분리 체크 - 20181029
		if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == paytype_code_card) {
			$("#div_paytype #card_list").show();
		} else if ($("#frm_inp input[name=rdo_paytype]:radio:checked").val() == paytype_code_lpay) {
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
	// 결제버튼 금액 추가 - 20181029
	$("#submitAmt").html(totpayamt.money() + "원");

	// PG PROJECT : 주문 동의 영역 노출 제어
	var id = $("[id^=pay_type].on").attr("id");
	if (totpayamt > 0 && $("#pay_method").css("display") == "block" && (id == "pay_type4" || id == "pay_type1")) { // 주결제 금액 >0 이고 주결제 수단 노출된 상태이고 L.pay, 신용카드 선택 된 경우
		fn_setDisplayAssentArea('Y');
	} else {
		fn_setDisplayAssentArea('N');
	}

	// 청구할인
	if ('Y' == claim_sale_yn) {
		console.log("청구할인!");
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
		console.log("청구할인 : " + claim_sale_price + "/" + claim_sale_fvr_val);
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
		$("#lpoint_amt").val("0");
		$("#old_lpoint_amt").val("");
		$("#lpoint_amt").attr("disabled", true);
		$("#chk_lpoint_all").attr("checked", false);
		$("#chk_lpoint_all").prop("checked", false);
		$("#chk_lpoint_all").attr("disabled", true);
	}

	if (point_div == "ALL" || point_div == ltPoint) {
		$("#lt_point_amt").val("0");
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
		}*/

	disableItems(true);
}

// 비회원약관 관련
function showGrockleDiv(divName) {
	var divObj = $("#" + divName);
	var display = divObj.css("display");

	if (display == "block") {
		divObj.css("display", "none");
	} else {
		divObj.css("display", "block");
	}
}
// 비회원 본인인증
function oneselfCheck() {
	$('#cover').css({
		'display': 'block',
		'height': '100%',
		'top': 0
	});
	window.scrollTo(0, $("#container").offset().top); // 레이어 위치 지정
	//$("#container").hide();
	$("#CONFIRM_FRAME").attr("src", "/popup/oneself_certification_form.do?" + __commonParam + "&name=" + $("#grockle_name").val());
	$("#CONFIRM_LAYER").css("width", "100%");
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
	console.log("현금영수증 컨트롤 pay_type : " + pay_type);
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

// 중복배송 함수 Start
function show_multi_deli_area(idx) {
	var ord_qty = 0;

	deli_init(); // 중복 배송지 초기화

	// 상품선택n , 보낼 상품 선택하기 영역 노출여부
	if (idx > 1) {
		$("#deli_1_amt_area").show();
		for (i = 0; i < idx; i++) {
			$(".deli_chk1").eq(i).show();
		}
	} else {
		$("#deli_1_amt_area").hide();
		for (i = 0; i < idx; i++) {
			$(".deli_chk1").eq(i).hide();
		}
	}

	$("div[id^=multi_deli_]").hide();
	$("div[id^=prod_title_]").hide();
	$("div[id^=deli_prod_]").hide();

	// 배송지 수 만큼 for
	for (i = 1; i <= idx; i++) {
		$("#multi_deli_" + i).show();

		if (idx != 1) {
			$("#prod_title_" + i).show();
		}

		//메시지카드 영역 초기화
		//복수배송일때만 초기화_선물하기1차작업관련 추가_20160516
		if ($("#chk_multi_dlvp").prop("checked")) {

			$("input[name=gift_yn_" + i + "]:visible:last").prop("checked", true);
			$("input[name=gift_yn_" + i + "]:visible:last").click();


		} else { //단일배송_선물하기1차작업관련 추가_20160516
			var prodTotCnt = $("#frm_inp input[name=prodTotalCnt]:hidden").val();

			for (var j = 2; j <= prodTotCnt; j++) {
				$("#frm_inp .gift_msg_sel_" + j + " input[name^=gift_yn_" + j + "]:radio[value='1']").prop("checked", false);
				$("#frm_inp .gift_msg_sel_" + j + " input[name^=gift_yn_" + j + "]:radio[value='2']").prop("checked", true);

				$("dd[name^=gift_msg_form_" + j + "]").hide();
				$("#gift_none_msg_" + j).hide();
			}

			$("input[name=gift_yn_" + i + "]:visible:last").click();
		}
	}

	fn_calcTotalPrice(); // 금액 재 계산
}

// 배송정보 setting
function setImallDeliData() {
	var addrcvmessageyn;

	var chkStatus = false;
	// 비회원이면서 e-coupon 이 아닐 경우
	if ("Y" == grockle_yn && "ECOUPON" != gubun) {
		chkStatus = true;
	} else {
		// 주문자명 수정완료 체크
		var $nameInpt = $("[id^=orderer_name_val]:visible").find("#nameInpt");

		//회원배송지 수정이 있을경우 주문자 정보 자동 복사
		if ($("#deli_1 input[name=deli_chk_1]:radio:checked").val() != undefined &&
			$("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "U") {

			//alert("회원배송지 수정 주문자-->"+$nameInpt.val());
			if ($.trim($nameInpt.val()) == '') {
				alert("주문자를 입력해 주세요.");
				$nameInpt.focus();
				return false;
			}
			$("[id^='orderer_name_text']").find("#nameSp").text($nameInpt.val());
			$("[id^='orderer_name_val']").find("#nameInpt").val($nameInpt.val());
		} else if ($nameInpt.length > 0) {
			alert("주문자를 입력해 주세요.");
			$nameInpt.focus();
			return false;
		}

		if ($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() == "U" ||
			$("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() == "C" ||
			(($("input[name=deli_select]").val() == "undefined" || $("input[name=deli_select]").val() == undefined) && ($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() == "undefined" || $("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() == undefined))
		) { //수정 or 신규 or 새로입력
			chkStatus = true;
		}
	}

	if (chkStatus) {
		// 간편회원인 경우 첫번째일때는 undefined 로 들어온다.
		var simpleMemberYnFirst = "N";
		if ($("#deli_1 input[name=deli_chk_1]:radio:checked").val() == undefined && simple_mem_yn == "Y") {
			simpleMemberYnFirst = "Y";
			$("#deli_1 input[name=deli_chk_1]:radio:checked").val("C");
		}

		var deli_span_nm = "#frm_inp";
		if ("Y" != grockle_yn) {
			if ($("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "C" ||
				$("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "U" ||
				simpleMemberYnFirst == "Y") {
				deli_span_nm += " #li_new";
			} else {
				deli_span_nm += " #li_mine";
			}
		}

		deliidx = "";
		basedlvpyn = ""; // 기본배송지여부
		dlvpnm = ""; // 배송지명
		dlvpsn = "";
		usrsortrnk = "";
		deli_chk = "";
		rmitnm = $(deli_span_nm + " input[name=inprmitnm]").val();
		dlvzip1 = $(deli_span_nm + " input[name=inpzip1]:hidden").val();
		dlvzip2 = $(deli_span_nm + "  input[name=inpzip2]:hidden").val();
		postaddr = $(deli_span_nm + "  input[name=inpaddr1]").val();
		dtladdr = $(deli_span_nm + "  input[name=inpaddr2]").val();
		postNo = $("#frm_inp input[name=postNo]").eq(0).val();
		corpPostNoSn = $("#frm_inp input[name=corpPostNoSn]").eq(0).val();

		if ($("#deli_1 input[name=deli_chk_1]:radio:checked").val() == undefined && simpleMemberYnFirst != "Y") {
			// 배송지 수정/신규 둘 다 아닐 경우
			var dlvpSn = $(deli_span_nm + " #deli_select_1").val();
			cellsctno = $("#deli_phone_val_1" + dlvpSn + " [name=inpcell1]:enabled").val();
			celltxnono = $("#deli_phone_val_1" + dlvpSn + " input[name=inpcell2]").val();
			cellendno = $("#deli_phone_val_1" + dlvpSn + " input[name=inpcell3]").val();
			//alert('배송지 수정/신규 둘 다 아닐 경우');
		} else if ($("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "C" ||
			$("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "U" ||
			simpleMemberYnFirst == "Y") {
			// 배송지 신규, 수정 (비회원 포함)
			cellsctno = $("#deli_phone_val_1 [name=inpcell1]:enabled").val();
			celltxnono = $("#deli_phone_val_1 input[name=inpcell2]").val();
			cellendno = $("#deli_phone_val_1 input[name=inpcell3]").val();

			//수정일 경우 일반전화번호 셋팅
			if ($("#deli_1 input[name=deli_chk_1]:radio:checked").val() == "U") {
				cbltelrgnno = $("#deli_phone_val_1 input[name=inptel1]").val();
				cblteltxnono = $("#deli_phone_val_1 input[name=inptel2]").val();
				cbltelendno = $("#deli_phone_val_1 input[name=inptel3]").val();
			}
			//alert('배송지 신규, 수정 (비회원 포함)'+cbltelrgnno[tmp_idx]);
		}

		rcvmessage = $(deli_span_nm + " select[name=deli_msg]").val();
		if (rcvmessage == "직접입력") {
			rcvmessage = $(deli_span_nm + " input[name=rcvmessage]").val();
			addrcvmessageyn = "Y";
		}

		if ("Y" != grockle_yn) {
			deliidx = $(deli_span_nm + " input[name=deli_selected_no]").val();
			basedlvpyn = $("#frm_inp input[name=basedlvpyn]").eq(deliidx).val();
			dlvpnm = $(deli_span_nm + " input[name=inpdlvpnm]").val();

			if ($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() == 'C' || simpleMemberYnFirst == "Y" ||
				(($("input[name=deli_select]").val() == "undefined" || $("input[name=deli_select]").val() == undefined) && ($("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() == "undefined" || $("#deli_option_1 input[name=deli_chk_1]:radio:checked").val() == undefined))
			) {
				dlvpsn = "";
				usrsortrnk = "0";
				deli_chk = "C"; //배송지 수정이면 U 신규이면 C
			} else {
				dlvpsn = $("#frm_inp input[name=dlvpsn]").eq(deliidx).val();
				usrsortrnk = $("#frm_inp input[name=usrsortrnk]").eq(deliidx).val();
				deli_chk = "U";
			}

			if ($.trim(dlvpnm) == '') {
				alert('배송지명을 입력해주세요.');
				$("#frm_inp input[name=inpdlvpnm]").focus();
				return;
			}

			if ($("#dlvpuseyn_1").length > 0 && $("#dlvpuseyn_1").prop("checked") == false) {
				dlvpuseyn = "N";
			}
		}

		if ($.trim(rmitnm) == '') {
			alert('받으시는 분을 입력해주세요.');
			$("#frm_inp input[name=inprmitnm]").focus();
			return;
		} else if ($.trim(dlvzip1) == '' || $.trim(dlvzip2) == '' || $.trim(postaddr) == '' ||
			$.trim($(deli_span_nm + " #txt_zip1_1").val()) == '' ||
			$.trim($(deli_span_nm + " #txt_zip2_1").val()) == ''
		) {
			alert('주소를 검색 후 입력해주세요.');
			$("#frm_inp input[name=inpsearch]").focus();
			return;
		} else if ($.trim(dtladdr) == '') {
			alert('나머지 주소를  입력해주세요.');
			$("#frm_inp input[name=inpaddr2]").focus();
			return;
		} else if (!$.trim(celltxnono).isNum() || ($.trim(celltxnono).length < 3 || $.trim(celltxnono).length > 4)) {
			alert('연락처를 3~4자리 숫자로 입력해주세요.');
			$("#frm_inp input[name=inpcell2]").focus();
			return;
		} else if (!$.trim(cellendno).isNum() || ($.trim(cellendno).length < 3 || $.trim(cellendno).length > 4)) {
			alert('연락처를 3~4자리 숫자로 입력해주세요.');
			$("#frm_inp input[name=inpcell3]").focus();
			return;
		}
	} else { //수정없을경우
		var deliidx = $("#frm_inp input[name=deli_selected_no]").val();
		basedlvpyn = $("#frm_inp input[name=basedlvpyn]").eq(deliidx).val(); //rcvCode
		dlvpsn = $("#frm_inp input[name=dlvpsn]").eq(deliidx).val(); //rcvCode
		dlvpnm = $("#frm_inp input[name=dlvpnm]").eq(deliidx).val();
		rmitnm = $("#frm_inp input[name=rmitnm]").eq(deliidx).val();
		dlvzip1 = $("#frm_inp input[name=dlvzip1]").eq(deliidx).val();
		dlvzip2 = $("#frm_inp input[name=dlvzip2]").eq(deliidx).val();
		postaddr = $("#frm_inp input[name=postaddr]").eq(deliidx).val();
		dtladdr = $("#frm_inp input[name=dtladdr]").eq(deliidx).val();
		cellsctno = $("#deli_phone_val_1_" + dlvpsn + " [name=inpcell1]:enabled").val();
		celltxnono = $("#deli_phone_val_1_" + dlvpsn + " input[name=inpcell2]").val();
		cellendno = $("#deli_phone_val_1_" + dlvpsn + " input[name=inpcell3]").val();
		usrsortrnk = $("#frm_inp input[name=usrsortrnk]").eq(deliidx).val();
		corpPostNoSn = $("#frm_inp input[name=corpPostNoSn]").eq(deliidx).val();
		postNo = $("#frm_inp input[name=postNo]").eq(deliidx).val();
		deli_chk = "";
		rcvmessage = $("#frm_inp #li_mine select[name=deli_msg]").val();
		if (rcvmessage == "직접입력") {
			rcvmessage = $("#frm_inp #li_mine input[name=rcvmessage]").val();
			addrcvmessageyn = "Y";
		}
	}

	// 배송지재사용 셋팅
	$("#frm_send input[name=chk_dlvp_reuse]").val("");
	if ($("#chk_dlvp_reuse") != undefined && $("#chk_dlvp_reuse") != null) {
		if ($("#deli_1 #li_mine").hasClass('on') && $("#chk_dlvp_reuse").prop("checked") == true) {
			$("#frm_send input[name=chk_dlvp_reuse]").val("Y");
		}
	}

	// 배송지재사용 셋팅
	$("#frm_send input[name=chk_dlvp_reuse]").val("");
	if ($("#chk_dlvp_reuse").length > 0) {
		if (deli_chk == "U" && $("#chk_dlvp_reuse_mod").prop("checked") == true) {
			$("#frm_send input[name=chk_dlvp_reuse]").val("Y");
		} else if (deli_chk == "" && $("#chk_dlvp_reuse").prop("checked") == true) {
			$("#frm_send input[name=chk_dlvp_reuse]").val("Y");
		}
	}

	// 홈쇼핑 상품 - 결제 전 재고/가격 실시간 체크
	if (!fn_pay_realtime(simpleMemberYnFirst)) {
		return;
	}

	$("#frm_send input[name=basedlvpyn]:hidden").val(basedlvpyn);
	$("#frm_send input[name=dlvpsn]:hidden").val(dlvpsn);
	$("#frm_send input[name=dlvpnm]:hidden").val(dlvpnm);
	$("#frm_send input[name=rmitnm]:hidden").val(rmitnm);
	$("#frm_send input[name=dlvzip1]:hidden").val(dlvzip1);
	$("#frm_send input[name=dlvzip2]:hidden").val(dlvzip2);
	$("#frm_send input[name=postaddr]:hidden").val(postaddr);
	$("#frm_send input[name=dtladdr]:hidden").val(dtladdr);
	$("#frm_send input[name=cellsctno]:hidden").val(cellsctno);
	$("#frm_send input[name=celltxnono]:hidden").val(celltxnono);
	$("#frm_send input[name=cellendno]:hidden").val(cellendno);
	$("#frm_send input[name=cbltelrgnno]:hidden").val(cbltelrgnno);
	$("#frm_send input[name=cblteltxnono]:hidden").val(cblteltxnono);
	$("#frm_send input[name=cbltelendno]:hidden").val(cbltelendno);
	$("#frm_send input[name=usrsortrnk]:hidden").val(usrsortrnk);
	$("#frm_send input[name=delichk]:hidden").val(deli_chk);
	$("#frm_send input[name=corp_post_no_sn]:hidden").val(corpPostNoSn);
	$("#frm_send input[name=post_no]:hidden").val(dlvzip1 + dlvzip2);
	$("#frm_send input[name=rcvmessage]").val(rcvmessage);
	$("#frm_send input[name=addrcvmessageyn]").val(addrcvmessageyn);
	$("#frm_send input[name=dlvpuseyn]:hidden").val(dlvpuseyn);

	// 선물메시지
	// 선물하기 1차 수정_20160525
	if (!$("#frm_inp input[name=chk_multi_dlvp]:checkbox").prop("checked")) { //복수배송 기존
		if ($(deli_span_nm + " input[name=gift_yn]:radio:checked").val() == '1') {
			receivename = $(deli_span_nm + " input[name=receivename]").val();
			sendmessage = $(deli_span_nm + " textarea[name=sendmessage]").val();
			sendname = $(deli_span_nm + " input[name=sendname]").val();
			if ($.trim(receivename) == '' && $.trim(sendmessage) == '' && $.trim(sendname) == '') {
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
	} else { //단일배송일 경우 추가
		if ($("#frm_inp .gift_msgMultiInsert input[name=gift_yn_1]:radio:checked").val() == '1') {
			receivename = $("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val();
			sendmessage = $(".gift_msgMultiInsert #sendmessage_1").val();
			sendname = $("#frm_inp .gift_msgMultiInsert input[name=sendname_1]").val();

			if ($.trim(receivename) == '' || $.trim(sendmessage) == '' || $.trim(sendname) == '') {
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

	$("#frm_send input[name=receivename]:hidden").val(receivename);
	$("#frm_send input[name=sendmessage]:hidden").val(sendmessage);
	$("#frm_send input[name=sendname]:hidden").val(sendname);

	var prodArr = cartSn.split(split_gubun_1);
	var tmp_val = "";
	var tmp_arr = new Array(prodArr);

	// 매장전달메시지
	for (var i = 0; i < prodArr.length; i++) {
		if (typeof ($("#frm_inp textarea[name=shop_memo_" + prodArr[i] + "]")) == undefined) {
			tmp_val = "";
		} else {
			tmp_val = $("#frm_inp textarea[name=shop_memo_" + prodArr[i] + "]").val();
		}

		tmp_arr[i] = tmp_val;
	}

	$("#frm_send input[name=shop_memo_cont]:hidden").val(tmp_arr.join(split_gubun_1));

	// 선물포장여부
	for (var i = 0; i < prodArr.length; i++) {
		if (typeof ($("#frm_inp input[name=gift_pkg_" + prodArr[i] + "]:radio:checked")) == undefined) {
			tmp_val = "N";
		} else {
			tmp_val = $("#frm_inp input[name=gift_pkg_" + prodArr[i] + "]:radio:checked").val();
		}

		tmp_arr[i] = tmp_val;
	}
	$("#frm_send input[name=gift_pkg_yn]:hidden").val(tmp_arr.join(split_gubun_1));

	return true;
}

// 배송비 초기화
function deli_init(deli_idx) {
	var deli_scope = "";

	if (deli_idx != undefined && deli_idx != "") {
		deli_scope = deli_idx + "_";
	}

	$("input[name^=tmp_deli_amt_" + deli_scope + "]:hidden").each(function () {
		$("#frm_inp input[name=caltotdeliamt]:hidden").val(parseInt($("#frm_inp input[name=caltotdeliamt]:hidden").val()) - parseInt($(this).val()));
		$(this).val("0");
	});

	$("div[id^=tmp_deli_amt_" + deli_scope + "]").each(function () {
		$(this).find('span').text("배송비 : 무료");
	});

	//$("#tmp_deli_amt_"+deli_idx+"_div").find('span').text("배송비 : 무료");

	$("input[name^=deli_data_" + deli_scope + "]:hidden").each(function () {
		$(this).next().next().children().val("0");
	});
}

// 중복배송비 조회
function multiDeliAmt(std_obj) {

	var std_obj_nm = std_obj.attr("name"); // 중복배송 수량 select box 명
	var std_smp_nm = std_obj_nm.replace('multi_prod_', ''); // 상품정보를 담은 div 영역 찾기 위한 이름 추출
	var std_deli_idx = std_obj_nm.substring(std_obj_nm.lastIndexOf('_') + 1); // 배송지 순번 추출

	var std_deli_data = $("#deli_product_" + std_smp_nm + " input[name^=deli_data_]:hidden").val();

	// 선택된 상품을 배송지 개수만큼 돌면서 체크
	// 수량이  존재할 경우, 배송지 카운트 증가 및 금액 sum
	// 품목 Array
	var objArr = new Array();
	// 배송지 수
	var dlvp_cnt = 0;
	// 배송비 합계
	var dlex_sum = 0;

	var dlvpObjArr = new Array();
	$("input[name^=deli_data_]").each(function () {
		if ($(this).val().split("|")[1] == std_deli_data.split("|")[1]) {
			$(this).each(function () {
				if (Number($(this).next().next().find("input").val()) > 0) {

					var dupChk = false;
					for (var i = 0; i < dlvpObjArr.length; i++) {
						if (dlvpObjArr[i] == $(this).attr("name")) {
							dupChk = true;
							break;
						}
					}

					if (!dupChk) {
						dlvpObjArr[dlvp_cnt] = $(this).attr("name");
						objArr[dlvp_cnt] = $(this).next().next().find("input");
						dlvp_cnt++;
					}

				}
			});
		}
	});

	for (var i = 0; i < dlvp_cnt; i++) {

		var obj = objArr[i];

		var obj_nm = obj.attr("name"); // 중복배송 수량 select box 명
		var smp_nm = obj_nm.replace('multi_prod_', ''); // 상품정보를 담은 div 영역 찾기 위한 이름 추출
		var deli_idx = obj_nm.substring(obj_nm.lastIndexOf('_') + 1); // 배송지 순번 추출

		var deli_data = $("#deli_product_" + smp_nm + " input[name^=deli_data_]:hidden").val(); // 배송비 조회를 위한 데이터 조회
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

		if (crspk_exist_yn == "Y") {
			smartOrd = "N";
		}

		// 배송비 조회를 위한 데이터 생성
		$("input[name=deli_data_" + deli_idx + "]:hidden").each(function () {
			chk_data = ($(this).val()).split('|');
			if (detail_data[1] == chk_data[1]) {
				split_str = (goodsNoMany == "" ? "" : split_gubun_1);

				goodsNoMany += (split_str + chk_data[0]);
				dlvPolcNoMany += (split_str + chk_data[1]);
				realSalePrcMany += (split_str + chk_data[2]);
				smpUseYnMany += (split_str + smartOrd);

				ordQtyMany += (split_str + ($(this).siblings('span').find('input').val()));
			}
		});

		// 배송비 조회
		var res_str = "";
		var res_code = "";
		var res_msg = "";
		var dlex_amt = 0;
		$.ajax({
			type: 'post',
			async: false,
			url: '/popup/multi_deli_amt.do?' + __commonParam,
			data: 'goodsNoMany=' + goodsNoMany + '&dlvPolcNoMany=' + dlvPolcNoMany + '&realSalePrcMany=' + realSalePrcMany + '&smpUseYnMany=' + smpUseYnMany + '&ordQtyMany=' + ordQtyMany,
			success: function (response) {
				res_str = response.split(':');
				res_code = res_str[0];
				res_msg = res_str[1];
				dlex_amt = $.trim(res_str[2]);
			}
		});

		if ($.trim(res_code) == '0000') {
			var old_dlex_amt = $("input[name=tmp_deli_amt_" + deli_idx + "_" + detail_data[1] + "]:hidden").val();
			$("input[name=tmp_deli_amt_" + deli_idx + "_" + detail_data[1] + "]:hidden").val(dlex_amt);
			$("#tmp_deli_amt_" + deli_idx + "_" + detail_data[1]).find('span').text("배송비 : " + (dlex_amt == 0 ? "무료" : new String(dlex_amt).money() + "원"));

			var tmp_deli_amt = 0;
			$("input[name^=tmp_deli_amt_" + deli_idx + "_]:hidden").each(function () {
				tmp_deli_amt += parseInt($(this).val());
			});

			// 총 배송비 계산
			$("input[name=tmp_deli_amt_" + deli_idx + "_" + detail_data[1] + "]:hidden").each(function () {
				$("#frm_inp input[name=caltotdeliamt]:hidden").val(parseInt($("#frm_inp input[name=caltotdeliamt]:hidden").val()) - parseInt(old_dlex_amt) + parseInt($(this).val()));
			});
			fn_calcTotalPrice(); // 금액 계산

			$("#frm_send input[name=totdeliamt]:hidden").val($("#frm_inp input[name=caltotdeliamt]:hidden").val()); // 총중복배송비
			dlex_sum += Number(dlex_amt);
		} else {
			alert($.trim(res_msg));
		}
	}

	// 선택된 상품의 배송지가 없을 경우
	if (dlvp_cnt < 1) {

		var obj, obj_nm, smp_nm, deli_idx, deli_data, detail_data, old_dlex_amt;
		var dlex_amt = 0;
		$("input[name^=deli_data_]").each(function () {
			if ($(this).val().split("|")[1] == std_deli_data.split("|")[1]) {
				$(this).each(function () {
					obj = $(this).next().next().find("input");
					obj_nm = obj.attr("name"); // 중복배송 수량 select box 명
					smp_nm = obj_nm.replace('multi_prod_', ''); // 상품정보를 담은 div 영역 찾기 위한 이름 추출
					deli_idx = obj_nm.substring(obj_nm.lastIndexOf('_') + 1); // 배송지 순번 추출
					deli_data = $("#deli_product_" + smp_nm + " input[name^=deli_data_]:hidden").val(); // 배송비 조회를 위한 데이터 조회
					detail_data = deli_data.split('|'); // 상품코드,배송코드,상품가격
					old_dlex_amt = $("input[name=tmp_deli_amt_" + deli_idx + "_" + detail_data[1] + "]:hidden").val();

					$("input[name=tmp_deli_amt_" + deli_idx + "_" + detail_data[1] + "]:hidden").val(dlex_amt);
					$("#tmp_deli_amt_" + deli_idx + "_" + detail_data[1]).find('span').text("배송비 : " + (dlex_amt == 0 ? "무료" : new String(dlex_amt).money() + "원"));

					// 총 배송비 계산
					$("input[name=tmp_deli_amt_" + deli_idx + "_" + detail_data[1] + "]:hidden").each(function () {
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

			if ($("#frm_inp input[name=dup_coupon]").length < 2) { // 2차가 없다.
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
									} else if (prommdclcd == "27") { // 임직원할인
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
			if ($("#frm_inp input[name=dup_coupon]").length > 1) { // 2차가 있다.
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
		console.log('maxFirstIdx : ' + maxFirstIdx);
	}
	if (maxDupIdx != "N") {
		$("#frm_inp select[name=dup_coupon]").val(maxDupIdx);
		$("#frm_inp select[name=dup_coupon]").change();
		console.log('maxDupIdx : ' + maxDupIdx);
	}
	if (maxFirstIdx == "N" && maxDupIdx == "N") {
		if (app_card_only_yn == 'Y') {
			console.log("앱카드 전용 이면");
			$('#frm_inp select[name=iscmcd]').val(app_card_cd);
			getCardInsCheck(); // 할부선택
		} else if ($("#frm_inp input[name=rdo_paytype]:radio:checked").index() == 0 && $('#frm_inp select[name=iscmcd] option:selected').index() != 0) { // 결제 수단 중 카드가 선택 되어있으면
			console.log("최대 할인 카드 선택 이면");
			getCardInsCheck(); // 할부선택
		}
	}

	// 20160108 박형윤 임직원할인일 경우 LPOINT 임시 감춤처리
	if (maxFirstIdx == 0) {
		if (ord_pnt_rsrv_yn != 'Y') {
			$(".order_tp #lottepointSave .lottepointOrange").hide();
		}
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

// L.pay WEB :사용자 인증
function lpayCertInfo() {
	selPayType(4);

	$("#card_list").hide(); // 신용카드 추가 - 20181029
	$("#pay_card").show();
	$("#pay_card_confirm").hide();
	$("#pay_bank").hide();
	$("#pay_phone").hide();
	$("#pay_phone2").hide(); // 휴대폰 결제시 안내문구 - 20181029
	$("#pay_naverPay").hide();
	$("#card_select").show(); // 20181029
	//$("#pay_card > dl").show(); // 20181029

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

//20150629 단일 배송지 주소 변경 start
function listOpen(ck, deli_cnt) {

	//복수 배송지 순번 저장
	$('#sel_deli_cnt').val(deli_cnt);

	//선택한 배송지를 배송지 레이어에 자동 선택
	var deli_idx = $('#sel_deli_cnt').val();
	var deli_dlvp_sn = $("#deli_" + deli_idx + " #li_mine #deli_select_" + deli_idx).val();

	$('input[type=radio][value=' + deli_dlvp_sn + ']').trigger("click");
	//console.log($('input[type=radio][value='+deli_dlvp_sn+']'));

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

	//하단 필터바 스크롤( egScroll 생성 ) 2017.01.17 수정
	filterBarScroll = $('#filterType').egScroll(true, false, true);
	$('#filterType2').egScroll(true, false);

};

//배송지 목록 내 수정 버튼
function btnModi() {

	var _$opLayer = $('.addr_list_layer'),
		_$optionBtn = $('.addr_list_open'),
		_$opLayerBg = $('.addr_list_bg');

	var _open = false;

	changeInfo('1');
	_$opLayerBg.hide();
	$B(_$opLayer[0]).transition('bottom:' + (-_$opLayer.height() - 12) + 'px', 'bottom 0.3s ease', {
		onTransitionEnd: function (e) {
			_open = false;
		}
	});
	_$optionBtn.removeClass('on');

}

//배송지 삭제 더블클릭 방지
var delete_flag = false;

// 배송지정보 삭제
function deleteDlvpInfo(dlvp_sn, mbr_no) {
	//간편회원의 경우 기본배송지가 없어 마지막 배송지를 남겨둔다
	if ($("#filterType >ul >li").size() == 1) {
		alert("마지막 배송지입니다.");
		return false;
	}

	if (confirm('내 배송지 목록에서 삭제하시겠습니까?')) {
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
				url: "/popup/delete_deli.do?dlvp_sn=" + dlvp_sn + "&index=" + dataIdx + "&mbr_no=" + mbr_no,
				success: function (resp) {

					if (resp == "0000") {
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

	// 받는 사람  셋팅
	var $tmp_addr = $('input:radio[name="detail_list"]:checked');

	var deli_idx = $('#sel_deli_cnt').val();
	$("#deli_" + deli_idx + " dd[class*=deli_]").hide();
	$("#deli_" + deli_idx + " dd.deli_" + $tmp_addr.data('d12')).show();

	$("#deli_" + deli_idx + " #li_mine #selectedRmitNmList").html($("#deli_" + deli_idx + " #deliVal_rmitnm_" + $tmp_addr.data('d12')).val() + " (" + $("#deli_" + deli_idx + " #deliVal_dlvpnm_" + $tmp_addr.data('d12')).val() + ")");
	$("#deli_" + deli_idx + " #li_mine #deli_select_" + deli_idx).val($tmp_addr.data('d12'));
	$("#deli_" + deli_idx + " #li_mine #deli_selected_no_" + deli_idx).val($tmp_addr.data('d16'));
	$("#deli_" + deli_idx + " #li_mine input[name=inprmitnm]").val($("#deli_" + deli_idx + " #deliVal_rmitnm_" + $tmp_addr.data('d12')).val());
	$("#deli_" + deli_idx + " #li_mine input[name=inpdlvpnm]").val($("#deli_" + deli_idx + " #deliVal_dlvpnm_" + $tmp_addr.data('d12')).val());
	$("#deli_" + deli_idx + " #li_mine input[name=inpzip1]").val($("#deli_" + deli_idx + " #deliVal_zip1_" + $tmp_addr.data('d12')).val());
	$("#deli_" + deli_idx + " #li_mine input[name=inpzip2]").val($("#deli_" + deli_idx + " #deliVal_zip2_" + $tmp_addr.data('d12')).val());
	$("#deli_" + deli_idx + " #li_mine input[name=inpaddr1]").val($("#deli_" + deli_idx + " #deliVal_addr1_" + $tmp_addr.data('d12')).val());
	$("#deli_" + deli_idx + " #li_mine input[name=inpaddr2]").val($("#deli_" + deli_idx + " #deliVal_addr2_" + $tmp_addr.data('d12')).val());
	$("#deli_" + deli_idx + " #li_mine input[name=stnm_inp_zip1]").val($("#deli_" + deli_idx + " #deliVal_stnmzip1_" + $tmp_addr.data('d12')).val());
	$("#deli_" + deli_idx + " #li_mine input[name=stnm_inp_zip2]").val($("#deli_" + deli_idx + " #deliVal_stnmzip2_" + $tmp_addr.data('d12')).val());
	$("#deli_" + deli_idx + " #li_mine input[name=stnm_inp_addr1]").val($("#deli_" + deli_idx + " #deliVal_stnmaddr1_" + $tmp_addr.data('d12')).val());
	$("#deli_" + deli_idx + " #li_mine input[name=stnm_inp_addr2]").val($("#deli_" + deli_idx + " #deliVal_stnmaddr2_" + $tmp_addr.data('d12')).val());

	//메시지카드 작성 여부 체크해서 배송지순번 넣어서 event 발생
	if ($("input[name=gift_yn_" + deli_idx + "]:radio").prop("checked")) {
		$("input[name=gift_yn_" + deli_idx + "]:radio").eq(0).prop("checked", true);
		$("input[name=gift_yn_" + deli_idx + "]:radio").eq(0).click();
	}

	// 배송옵션 컨트롤 추가, 2014-12-30, hglee4
	switchDeliOption("mine", deli_idx, $tmp_addr.data('d12'));

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

//뒤로가기
$(window).on('popstate', function(e) {
	// 20190103 로그인 뒤로가기 개선
	if (hasFromLoginValue) {
		historyBackToProductView();
	}

	if (browserChk() != 'Safari') {

		if (null == e.originalEvent.state || 'history2' == e.originalEvent.state){
			searchOrdDeliveryListClose();
			if('history2' == e.originalEvent.state){
				history.back();
			}
		}
		else if ('history1' == e.originalEvent.state) {
			$("#deliIframe").contents().find("#ordSearchAddressNewPop").hide();
			$("#deliIframe").contents().find("#ordSearchAddressNewPop").find("iframe").remove();
		}
	}
});

$(window).load(function () {

	sendTclick('order_load');

	$(".tab_addr > li > a").click(function () {
		if (!isDeliPlcChg) {
			return;
		}

		$(this).parent().siblings().removeClass("on")
		$(this).parent().siblings().children().find("input, select").prop("disabled", true);
		$(this).parent().siblings().children().next().hide();

		$(this).parent().addClass("on");
		$(this).parent().children().find("input, select").prop("disabled", false);

		// 연락처 1번 처리
		$(this).siblings().find('[id^=deli_phone_val_]').each(function () {
			var $slct = $(this).find("select[name=inpcell1]"); // this = div
			if ($slct.length <= 0 || $slct.val() == "직접입력") {
				$slct.prop("disabled", true).parent();
			} else {
				$(this).find("input[name=inpcell1]").prop("disabled", true);
			}
		});

		$(this).parent().children().next().css("display", "block");

		if ($(this).parent().find("dd[name^=gift_msg_form_]").css("display") == "block") {
			$(this).parent().find("input[name^=gift_yn_]:radio").eq(0).prop("checked", true);
			//$(this).find("input[name^=gift_yn_]:radio").eq(0).click();
		} else {
			$(this).parent().find("input[name^=gift_yn_]:radio").eq(1).prop("checked", true);
			//$(this).find("input[name^=gift_yn_]:radio").eq(1).click();
		}

		if ($(this).parent().attr("id") == "li_mine") { // 내배송지 탭
			switchDeliOption("mine", $(this).attr("cnt"), $(this).next().find("[name=deli_select]").val());
			sendTclick("order_Clk_tap_1");
		} else if ($(this).parent().attr("id") == "li_new") { // 새배송지 탭
			switchDeliOption("new", $(this).attr("cnt"), "");
			sendTclick("order_Clk_tap_2");
		}
	});

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
				.find("option[value='배송 전 연락바랍니다.']").prop("selected", true);;
		}
	}
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
		return false;
	});
	$(".addrInput").on("focusin", function () {
		if ($(".wrap_addr_detail").css("display") == "none") {
			$(".tit_addr_search").trigger("click");
		}
	});

	//보낼 상품 선택하기
	$(".tit_product_choice").on("click", function () {
		var p_choice = $(this)
		p_choice.toggleClass("show");
		if (p_choice.hasClass("show")) {
			p_choice.parent().parent().parent().parent().find(".order_goods").css("display", "block");
		} else {
			p_choice.parent().parent().parent().parent().find(".order_goods").css("display", "none");
		}
	});
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

	// 여러곳으로 보내기
	$("#chk_multi_dlvp").click(function () {

		//선물하기 1차 관련 추가_추천메세지 선택메시지 초기화_20160518
		$("#frm_inp input[name=choose_card_msg_one]:hidden").val("");
		$("#frm_inp input[name=choose_card_msg_many]:hidden").val("");
		var prodTotCnt = $("#frm_inp input[name=prodTotalCnt]:hidden").val(); //상품건수

		// 여러곳으로 보내기
		if ($("#chk_multi_dlvp").prop("checked")) {

			//선물하기 1차 작업관련 추가_20160517 start
			$(".gift_msgMulti").show();
			$(".gift_msgMulti_new").show();
			$("dd[name^=gift_msg_form_1]").hide();


			//선택안된 상품의 문구처리할 종이카드 확인
			for (var j = 2; j <= prodTotCnt; j++) {
				$("dd[name^=gift_msgMulti_" + j + "]").hide();
				$("dd[name^=gift_msg_form_" + j + "]").hide();
				$("#gift_none_msg_" + j).hide();

			}
			//선물하기 1차 작업관련 추가_20160517 end

			$("#frm_inp select[name=areaNum_select]").val(2);
			$("#frm_inp select[name=areaNum_select]").prop("disabled", false);
			$("#areaNum_select2").hide();
			$("#dlvp_reuse").hide();
			$("#dlvp_reuse_new").hide();

			// 20160620 e쿠폰 여러명 보내기 추가 start
			if (gubun == 'SMARTPICK' || gubun == 'ECOUPON') {
				var rNum = $("#frm_inp select[name=areaNum_select]").val();
				$("#send_gift").hide();
				if (!$("#send_gift").prop("checked")) {
					$("#send_gift").click();
				}
				$("#gift_label").hide();

				$("#phn_num_show_adre1").hide();
				var appVer = $("#frm_inp input[name=appVer]:hidden").val();

				if (appVerChk(cp_v, appVer)) {
					$("#phn_num_show_multi").show();
				} else {
					$("#phn_num_show_multi").hide();
				}
				$("#cpn_snd_div").addClass("mgt5");
				$("#cpn_snd_div").removeClass("bd_none_top");
				$("#multi_deli_1").removeClass("bd_none_btm");

				$("#frm_inp div[id^=adre_title_]").hide();
				$("#frm_inp div[id^=adre_title_multi_]").show();

				$("#frm_inp input[name^=mst_adre_nm_]").attr("readonly", false);
				$("#frm_inp input[name^=mst_adre_nm_]").val("");
				$("#frm_inp select[name^=mst_adre_no_01_]").val("010");
				$("#frm_inp input[name^=mst_adre_no_02_]").val("");
				$("#frm_inp input[name^=mst_adre_no_03_]").val("");
				$("#frm_inp textarea[name^=msg_cont_]").val("");
				/*					for(var i=1;i<=rNum;i++){
									$("#adre_title_"+i).hide();
									$("#adre_title_multi_"+i).show();
									$("#mst_adre_nm_"+i).val("");
									$("#mst_adre_nm_"+i).attr("readonly",false);

									$("#frm_inp input[name=mst_adre_nm_"+i+"]").val("");
									$("#frm_inp select[name=mst_adre_no_01_"+i+"]").val("010");
									$("#frm_inp input[name=mst_adre_no_02_"+i+"]").val("");
									$("#frm_inp input[name=mst_adre_no_03_"+i+"]").val("");
									$("#frm_inp textarea[name=msg_cont_"+i+"]").val("");
								}*/
			}
			// 20160620 e쿠폰 여러명 보내기 추가 end

			//첫번째 배송지 수정모드 일때 내배송지탭 배송지수정 버튼등 숨김
			//if (    $("#deli_1 input[name=deli_chk_1]:radio[value='U']").length > 0
			//    && $("#deli_1 input[name=deli_chk_1]:radio[value='U']").prop("checked")==true) {
			changeMyDlvp('1', 'cncl');
			$("#changeMyDlvp").hide();
			$("#changeNameM").show();
			//}
			// 2개 선택했을 때 func 호출
			show_multi_deli_area(2);

			//레이어 팝업시 수정 버튼 기능 숨기기
			$(".btn_deli_mod").hide();

			// 종이 카드 영역 보이기
			for (var i = 1; i <= prodTotCnt; i++) {
				$("#message_card_" + i).show();
				$("#frm_inp input[name=gift_yn_" + i + "]:visible:last").prop("checked", true);
			}

			// 주문자명 보이기
			$("[id^='orderer_name_text']").hide();
			$("#orderer_name_text_2").show();
		}
		// 한곳으로 보내기
		else {
			//선물하기 1차 작업관련 추가_20160517
			$(".gift_msgMulti").hide();
			$(".gift_msgMulti_new").hide();

			for (var j = 2; j <= prodTotCnt; j++) {
				$("dd[name^=gift_msgMulti_" + j + "]").show();
			}
			//선물하기 1차 작업관련 추가_20160517

			$("#frm_inp select[name=areaNum_select]").val(1);
			$("#frm_inp select[name=areaNum_select]").prop("disabled", true);
			$("#areaNum_select2").show();
			$("#dlvp_reuse").show();
			$("#dlvp_reuse_new").show();

			// 20160620 e쿠폰 여러명 보내기 추가 start
			if (gubun == 'SMARTPICK' || gubun == 'ECOUPON') {
				$("#gift_label").show();
				$("#adre_title_1").show();
				$("#frm_inp div[id^=adre_title_multi_]").hide();
				$("#phn_num_show_adre1").hide();
				$("#phn_num_show_multi").hide();

				$("#cpn_snd_div").removeClass("mgt5");
				$("#cpn_snd_div").addClass("bd_none_top");
				$("#multi_deli_1").addClass("bd_none_btm");

				$("#send_gift").show();
				if ('Y' != $("#frm_inp input[name=giftChkYn]:hidden").val()) {
					$("#send_gift").click();
					$("#frm_inp input[name=mst_adre_nm_1]").val($("#frm_inp input[name=ordr_nm]:hidden").val());
					$("#frm_inp select[name=mst_adre_no_01_1]").val($("#frm_inp input[name=adre_no_01]:hidden").val());
					$("#frm_inp input[name=mst_adre_no_02_1]").val($("#frm_inp input[name=adre_no_02]:hidden").val());
					$("#frm_inp input[name=mst_adre_no_03_1]").val($("#frm_inp input[name=adre_no_03]:hidden").val());
					$("#frm_inp textarea[name=msg_cont_1]").val("");
				} else {
					$("#frm_inp input[name=mst_adre_nm_1]").val("");
					$("#frm_inp select[name=mst_adre_no_01_1]").val("010");
					$("#frm_inp input[name=mst_adre_no_02_1]").val("");
					$("#frm_inp input[name=mst_adre_no_03_1]").val("");
					$("#frm_inp textarea[name=msg_cont_1]").val("");
				}
			}
			// 20160620 e쿠폰 여러명 보내기 추가 end

			//첫번째 배송지 수정모드 일때 내배송지탭 배송지수정 버튼등 표시
			//if (    $("#deli_1 input[name=deli_chk_1]:radio[value='U']").length > 0
			//	 && $("#deli_1 input[name=deli_chk_1]:radio[value='U']").prop("checked")==true) {
			$("#changeNameM").hide();
			$("#changeMyDlvp").show();
			//}
			show_multi_deli_area(1);
			// 보낼 상품 선택하기 toggle
			init_deli_area();
			// 참좋은혜택 초기화
			benefit_dlvp_set();
			//레이어 팝업시 수정 버튼 기능 보이기
			$(".btn_deli_mod").show();

			// 종이 카드 영역 숨기기
			for (var i = 1; i <= prodTotCnt; i++) {
				$("#message_card_" + i).hide();
			}

			// 주문자명 보이기
			$("[id^='orderer_name_text']").hide();
			$("#orderer_name_text_1").show();
		}

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

		if (idx != "N") {
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

			// 임직원할인 선택 시 중복쿠폰 선택 불가 및 초기화
			if (prommdclcd == "27") {
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
			$("#singlePayText").text("*할부결제 시 '적용안함'을 선택해주세요"); // 이영석 2016.11.28 할부결제 체크 시 수정

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
			$("#singlePayText").text(""); // 이영석 2016.11.28 할부결제 체크 시 수정
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
		$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").prop('checked', true);
		$("#pay_bank").hide();
		$("#card_list").show(); // 신용카드 추가 - 20181029
		$("#pay_card").show();
		$("#pay_phone").hide();
		$("#pay_phone2").hide(); // 휴대폰 결제시 안내문구 - 20181029
		$("#pay_naverPay").hide();

		$("#no_lpay_card").hide();
		$(".box_Lpay_agree_check").hide();
		$("#card_select").hide(); // 숨김 - 20181029
		//$("#pay_card > dl").show(); // 주석 - 20181029

		$("input[name=temp_paytype]:hidden").val(0);

		// 20151222 박형윤 L-PAY 카드 안내 긴급 조치
		$("#SHINHAN_CARD_LAYER").hide();
		//$("input[name='sinhan_point'][type=radio][value=N]").click(); // check로 변경 - 20181029
		$("#shinhan_point").attr("checked", false);
		$("#shinhan_point").prop("checked", false);
		$("#shinhan_point").change();
		$("#BC_CARD_LAYER").hide();
		//$("input[name='bc_point'][type=radio][value=N]").click(); // check로 변경 - 20181029
		$("#bc_point").attr("checked", false);
		$("#bc_point").prop("checked", false);
		$("#bc_point").change();
		$("#SAMSUNG_CARD_LAYER").hide();
		//$("input[name='samsung_point'][type=radio][value=N]").click(); // check로 변경 - 20181029
		$("#samsung_point").attr("checked", false);
		$("#samsung_point").prop("checked", false);
		$("#samsung_point").change();
		// 2016.05.18
		$("#KB_CARD_LAYER").hide();
		//$("input[name='kb_point'][type=radio][value=N]").click(); // check로 변경 - 20181029
		$("#kb_point").attr("checked", false);
		$("#kb_point").prop("checked", false);
		$("#kb_point").change();
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
		$("#card_list").hide(); // 신용카드 추가 - 20181029
		$("#pay_card").hide();
		$("#pay_bank").show();
		$("#pay_phone").hide();
		$("#pay_phone2").hide(); // 휴대폰 결제시 안내문구 - 20181029
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
		$("#card_list").hide(); // 신용카드 추가 - 20181029
		$("#pay_card").hide();
		$("#pay_bank").hide();
		$("#pay_phone").show();
		$("#pay_phone2").show(); // 휴대폰 결제시 안내문구 - 20181029
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
		$("#card_list").hide(); // 신용카드 추가 - 20181029
		$("#pay_card").hide();
		$("#pay_bank").hide();
		$("#pay_phone").hide();
		$("#pay_phone2").hide(); // 휴대폰 결제시 안내문구 - 20181029
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

		console.log("rdo_paytype]:radio start ================  : " + $("#frm_inp input[name=paytype]:hidden").val());

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

		$(".btn_addpay").hide(); // L.pay WEB : 결제수단 등록 버튼 가림
		var payTypeCard = $('#pay_type1').hasClass('disable');
		var payTypeBank = $('#pay_type2').hasClass('disable');
		var payTypePhone = $('#pay_type3').hasClass('disable');
		var payTypeLpay = $('#pay_type4').hasClass('disable');
		var payTypeNPay = $('#pay_type5').hasClass('disable');

		// 카트 할인 체크(무통장||휴대폰||네이버페이)
		if ((coupon_cd != '' && coupon_cardcd != '') && (clickPayType == PAYTYPE_CODE_BANK || clickPayType == PAYTYPE_CODE_PHONE || clickPayType == PAYTYPE_CODE_NAVERPAY)) {
			alert("카드 할인쿠폰 및 적립쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
			if (!payTypeCard) {
				//$("#frm_inp select[name=iscmcd]").val(cardkndcd);
				iscmcd = $("#frm_inp select[name=iscmcd]").val(cardkndcd);
				if (temp_paytype == 3) {
					$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").prop('checked', true);
					payTypeCodeLpaySetting();
				} else {
					$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").prop('checked', true);
					payTypeCodeCardSetting();
				}
				console.log("cardkndcd : " + cardkndcd);
				//$("#frm_inp select[name=iscmcd]").val(cardkndcd);
				init_cardselect();
				//getCardInsCheck();
				$("#frm_inp select[name=iscmcd]").change(); // 할인정보 재조회
			} else {
				// 결제수단 선택
				if (!payTypeBank) {
					$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").prop('checked', true);
					payTypeCodeBankSetting();
				} else if (!payTypeLpay) {
					$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").prop('checked', true);
					payTypeCodeLpaySetting();
				}
			}
			// 중복카드할인쿠폰 체크(무통장||휴대폰||네이버페이)
		} else if ((coupon_cd_dup != '' && coupon_cardcd_dup != '') && (clickPayType == PAYTYPE_CODE_BANK || clickPayType == PAYTYPE_CODE_PHONE || clickPayType == PAYTYPE_CODE_NAVERPAY)) {
			alert("중복카드 할인쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
			if (temp_paytype == 3) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").prop('checked', true);
				payTypeCodeLpaySetting();
			} else {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_CARD + "']").prop('checked', true);
				payTypeCodeCardSetting();
			}
			//$("#frm_inp select[name=iscmcd]").val(coupon_cardcd_dup);
			iscmcd = $("#frm_inp select[name=iscmcd]").val(coupon_cardcd_dup);
			init_cardselect();
			$("#frm_inp select[name=iscmcd]").change(); // 할인정보 재조회
			//init_cardselect();
			//getCardInsCheck();
			// 일시불 할인 체크(휴대폰||네이버페이)
		} else if ($("#frm_send input[name=prommdclcd_third]").val() == "35" && (clickPayType == PAYTYPE_CODE_PHONE || clickPayType == PAYTYPE_CODE_NAVERPAY)) {
			if (clickPayType == PAYTYPE_CODE_PHONE) alert('일시불 할인을 받으시면 휴대폰결제를 하실수 없습니다.');
			if (clickPayType == PAYTYPE_CODE_NAVERPAY) alert('일시불 할인을 받으시면 네이버페이 결제를 하실수 없습니다.');

			if (!payTypeCard) {
				if (temp_paytype == 3) {
					$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").prop('checked', true);
					payTypeCodeLpaySetting();
				} else {
					payTypeCodeCardSetting();
				}
				//$("#frm_inp select[name=iscmcd]").val(coupon_cardcd_dup);
				init_cardselect();
				getCardInsCheck();
			} else if (!payTypeLpay) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_LPAY + "']").prop('checked', true);
				payTypeCodeLpaySetting();
			} else if (!payTypeBank) {
				$("#frm_inp input[name=rdo_paytype]:radio[value='" + PAYTYPE_CODE_BANK + "']").prop('checked', true);
				payTypeCodeBankSetting();
			}
		} else if (clickPayType == PAYTYPE_CODE_CARD) {
			payTypeCodeCardSetting();
			cardSelect(); // 선택카드 정보 초기화 - 20181029
		} else if (clickPayType == PAYTYPE_CODE_BANK) {
			payTypeCodeBankSetting();
		} else if (clickPayType == PAYTYPE_CODE_PHONE) {
			payTypeCodePhoneSetting();
		} else if (clickPayType == PAYTYPE_CODE_LPAY) {
			payTypeCodeLpaySetting();
		} else if (clickPayType == PAYTYPE_CODE_NAVERPAY) {
			payTypeCodeNpaySetting();
		}

		getCardInsCheck(); // 2011.06.07 추가(결제수단 변경 시 카드 정보 초기화)
		setCashReceiptArea(); // 현금영수증 영역 컨트롤

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

	// 중복배송 선택
	$("#chk_multi_div").click(function () {
		if ($(this).hasClass("checked")) {
			$(this).removeClass("checked");
			$(this).find('input').attr("checked", false);
			$(this).find('input').prop("checked", false);

			$("#deli_area_cnt").hide();
			$("dt").filter(".district").hide();

			show_multi_deli_area(1);

			$("a.send_commodity.on").each(function () {
				$(this).removeClass("on");
			});
		} else {
			$(this).addClass("checked");
			$(this).find('input').attr("checked", true);
			$(this).find('input').prop("checked", true);

			$("#deli_area_cnt").show();
			$("dt").filter(".district").show();

			show_multi_deli_area($("#frm_inp select[name=areaNum_select]").val());
		}

		var gift_yn_nm = "";
		var deli_idx = -1;
		$("#frm_inp input[name^=gift_yn_]:radio").each(function () {
			gift_yn_nm = $(this).attr("name");
			deli_idx = gift_yn_nm.substring(gift_yn_nm.lastIndexOf("_") + 1);

			$("#frm_inp input[name=" + gift_yn_nm + "]:radio:last").attr("checked", true)
			$("#frm_inp input[name=" + gift_yn_nm + "]:radio:last").prop("checked", true)
			$("dd[name^=gift_msg_form_" + deli_idx + "]").hide();
		});

	});

	// 중복배송지 상품 수 체크
	$("input[name^=multi_prod_]").change(function () {
		var obj_name = $(this).attr("name");
		var idx = obj_name.lastIndexOf("_");
		var multi_qty = 0;
		var ord_qty = parseInt($(this).parents().next(".btnPlus").attr("qty"));
		var re_name = obj_name.replace("multi_prod_", "");
		var deli_idx = obj_name.substring(idx + 1);

		$("input[name^=" + obj_name.substring(0, idx) + "_]").each(function () {
			multi_qty += parseInt($(this).val());
		});
		//if (parseInt($(this).val()) < 1 && $("#card_msg_info_" + re_name).val()=="Y"){
		if ($("#card_msg_info_" + re_name).val() == "Y") {
			// 메시지 가리기
			var card_msg_arr = new Array();
			var card_msg_yn = "N";
			var hpcl_msg_yn = "N";

			$("input[name^=multi_prod_][name$=_" + deli_idx + "]").each(function () { // 배송지에 해당하는 상품의 수량 및 이름 체크
				re_name = $(this).attr("name").replace("multi_prod_", "");
				if (card_msg_yn == "N" && $(this).val() > 0 && $("#card_msg_info_" + re_name).val() == "Y") {
					card_msg_yn = "Y";
				}
				if (hpcl_msg_yn == "N" && $(this).val() > 0 && $("#happy_call_info_" + re_name).val() == "Y") {
					hpcl_msg_yn = "Y";
				}
			});

			if (card_msg_yn == "N" || (card_msg_yn == "Y" && hpcl_msg_yn != $("#hpcl_msg_" + deli_idx).val())) { // 카드메시지 가능 상품이 없으면
				//$("dd[name^=gift_msg_form_"+deli_idx+"]").hide();

				$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").prop("checked", true);
				$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").click();
			}
		}
		if (ord_qty < multi_qty) {
			alert('주문수량을 초과 하실 수 없습니다.');

			$(this).val(0); //
			$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").prop("checked", true);
			$("#frm_inp input[name=gift_yn_" + deli_idx + "]:visible:last").click();
		}
		if (gubun != 'SMARTPICK' && gubun != 'ECOUPON') { //20160620 jnlee e쿠폰 다중배송 기능 추가
			// 다중배송 배송비 계산
			multiDeliAmt($(this));
		}

		// 할인 부분 초기화
		$("#frm_inp select[name=coupon]").val("N");
		$("#frm_inp select[name=coupon]").change();
	});

	// 중복배송지 상품 수 체크
	$("select[name=areaNum_select]").change(function () {

		if (!$("#chk_multi_dlvp").prop("checked")) {
			$("#chk_multi_dlvp").prop("checked", true);
		}

		init_deli_area();
		show_multi_deli_area($(this).val());
		var areaNum = parseInt($(this).val());

		$("input[name^=gift_yn_]:radio").each(function () {
			var deli_idx = parseInt($(this).attr("name").replace("gift_yn_", ""));

			if (deli_idx > areaNum) {
				$("input[name=" + $(this).attr("name") + "]:last").attr("checked", true);
				$("input[name=" + $(this).attr("name") + "]:last").prop("checked", true);
				$("#hpcl_msg_" + deli_idx).val("N");
				$("input[name^=gift_msg_form_" + deli_idx + "]").hide();
				$("#send_commodity_" + deli_idx).removeClass("on");
			}
		});

		if (areaNum < 2) {
			$("#chk_multi_dlvp").prop("checked", false);
			$("#frm_inp select[name=areaNum_select]").val(1);
			$("#frm_inp select[name=areaNum_select]").prop("disabled", true);
			$("#areaNum_select2").show();
			$("#dlvp_reuse").show();
			$("#dlvp_reuse_new").show();

			//첫번째 배송지 수정모드 일때 내배송지탭 배송지수정 버튼등 표시
			$("#changeNameM").hide();
			$("#changeMyDlvp").show();
			show_multi_deli_area(1);
			// 보낼 상품 선택하기 toggle
			init_deli_area();
			// 참좋은혜택 초기화
			benefit_dlvp_set();
			//레이어 팝업시 수정 버튼 기능 보이기
			$(".btn_deli_mod").show();
		}

		// 20160620 e쿠폰 여러명 보내기 추가 start
		if (gubun == 'SMARTPICK' || gubun == 'ECOUPON') {
			if (areaNum < 2) {
				$("#send_gift").show();
				$("#send_gift").click();
				$("#gift_label").show();

				$("#adre_title_multi_1").hide();
				$("#adre_title_1").show();

				$("#mst_adre_nm_1").val($("#frm_inp input[name=ordr_nm]:hidden").val());
				$("#mst_adre_no_01_1").val($("#frm_inp input[name=adre_no_01]:hidden").val());
				$("#mst_adre_no_02_1").val($("#frm_inp input[name=adre_no_02]:hidden").val());
				$("#mst_adre_no_03_1").val($("#frm_inp input[name=adre_no_03]:hidden").val());
			} else {
				for (var i = 1; i <= areaNum; i++) {
					$("#adre_title_" + i).hide();
					$("#adre_title_multi_" + i).show();
					$("#mst_adre_nm_" + i).val("");
					$("#mst_adre_nm_" + i).attr("readonly", false);
					$("#frm_inp select[name=mst_adre_no_01_" + i + "]").val("010");
					$("#frm_inp input[name=mst_adre_no_02_" + i + "]").val("");
					$("#frm_inp input[name=mst_adre_no_03_" + i + "]").val("");
					$("#frm_inp textarea[name=msg_cont_" + i + "]").val("");

				}
			}
		}
		// 20160620 e쿠폰 여러명 보내기 추가 end

		// 주문자명 보이기
		$("[id^='orderer_name_text']").hide();
		$("#orderer_name_text_" + $(this).val()).show();
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

		$(popNm).show();
		$(popNm).find('.gift_con').css('height', 'auto').height($(popNm).height() - 45);
		$(popNm).css('margin-top', $(popNm).outerHeight() / -2);
		$('.gift_pop .gift_pop_cls').unbind('click').bind('click', function () {
			$('#pageCover').hide();
			$(popNm).hide();
			return false;
		});
		return false;
	});

	//추천메시지 팝업
	$('.gift_card_open').click(function () {
		$this = $(this);
		$('#pageCover').show();
		$('.gift_card_layer').addClass('on');
		$('#filterType_gift').egScroll(true, false);
		$('.btn_cancel').unbind('click').bind('click', function () {
			$('#pageCover').hide();
			$('.gift_card_layer').removeClass('on');
		});
		$('.btn_msg_list').unbind('click').bind('click', function () {
			var cardMsg = $('input[name=card_msg_list]:checked').next('.rdo_txt').text();

			$('#pageCover').hide();
			$('.gift_card_layer').removeClass('on');


			//선물하기 1차 작업관련 추가_20160513
			//				cardMsg!=''?$this.parent().next('textarea').text(cardMsg):false;
			var choose_card_msg_one = $("#frm_inp input[name=choose_card_msg_one]:hidden").val(); //선택한메세지카드
			var choose_card_msg_many = $("#frm_inp input[name=choose_card_msg_many]:hidden").val();

			var gift_card_open_nm = $this.attr("name");
			var many_deli_idx = gift_card_open_nm.substring(gift_card_open_nm.lastIndexOf("_") + 1);

			// 복수배송
			if ($("#chk_multi_dlvp").prop("checked")) {
				//					if(choose_card_msg_many != many_deli_idx){
				$("input[name=card_msg_list]:radio").prop("checked", false);
				//					}

				$("#frm_inp input[name=choose_card_msg_many]:hidden").val(many_deli_idx);
				cardMsg != '' ? $("#frm_inp textarea[name=sendmessage_" + many_deli_idx + "]").val(cardMsg) : false;
				//20160620 start e쿠폰 추천메시지 추가
				if (gubun == 'SMARTPICK' || gubun == 'ECOUPON') {
					cardMsg != '' ? $("#frm_inp textarea[name=msg_cont_" + many_deli_idx + "]").val(cardMsg) : false;
				}
				//20160620 end e쿠폰 추천메시지 추가

			} else { //단일배송
				//					if(choose_card_msg_one != many_deli_idx){
				$("input[name=card_msg_list]:radio").prop("checked", false);
				//					}

				$("#frm_inp input[name=choose_card_msg_one]:hidden").val(many_deli_idx);
				cardMsg != '' ? $("#frm_inp textarea[name=sendmessage_" + many_deli_idx + "]").val(cardMsg) : false;

				//20160620 start e쿠폰 추천메시지 추가
				if (gubun == 'SMARTPICK' || gubun == 'ECOUPON') {
					cardMsg != '' ? $("#frm_inp textarea[name=msg_cont_" + many_deli_idx + "]").val(cardMsg) : false;
				}
				//20160620 end e쿠폰 추천메시지 추가
			}
			//선물하기 1차 작업관련 추가_20160513

		});
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

	// 비회원 이메일
	if ("Y" == grockle_yn &&
		"ECOUPON" != gubun && "SMARTPICK" != gubun) {
		deliSelect('new', '1'); // 신규 배송지 입력
	}

	// 선물메시지 입력 선택
	$("#frm_inp input[name^=gift_yn_]:radio").click(function () {

		var gift_yn_nm = $(this).attr("name");
		var deli_idx = gift_yn_nm.substring(gift_yn_nm.lastIndexOf("_") + 1);

		//주문서 내 메세지 카드 관련 안내 문구 추가 - jyyoon10
		//			var card_msg = " 님, 언제나 많은 사랑과 관심에 감사드립니다. 앞으로도 건강하시고 행복하시길 바랍니다.";
		var card_msg = "";

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
				//선물하기 1차_20160525_메시지내용,받는분 초기화
				$("#frm_inp #li_mine input[name=receivename_" + deli_idx + "]").val("");
				$("#sendmessage_" + deli_idx).val("");

				if ("Y" != grockle_yn) {
					$("dd[name^=gift_msg_form_" + deli_idx + "]").show();

					// 내 배송지 - 받는분, 메시지, 보내는분
					var objNm = $("#deli_" + deli_idx + " #li_mine input[name=inprmitnm]").val();
					if (objNm != "") {
						$("#frm_inp #li_mine input[name=receivename_" + deli_idx + "]").val(objNm + " 님");
						//주문서 내 메세지 카드 관련 안내 문구 추가 - jyyoon10
						//$("#sendmessage_"+deli_idx).val((happy_call_yn=="N"?objNm:"") + card_msg);
						$("#sendmessage_" + deli_idx).val(card_msg);
					}

					// 새로운 배송지 - 받는분, 메시지, 보내는분
					var nm1 = $("#deli_" + deli_idx + " #li_new input[name=inprmitnm]").val();
					if (nm1 != "") {
						$("#frm_inp #li_new input[name=receivename_" + deli_idx + "]").val(nm1 + " 님");
						//주문서 내 메세지 카드 관련 안내 문구 추가 - jyyoon10
						//$("#sendmessage_"+deli_idx).val((happy_call_yn=="N"?nm1:"") + card_msg);
						$("#sendmessage_" + deli_idx).val(card_msg);
					}

					$("#frm_inp input[name=sendname_" + deli_idx + "]").val($("#nameSp").text() + "드림"); // 보내는 이
				} else {
					$("#frm_inp input[name=receivename_" + deli_idx + "]").val('');
					var nm1 = $("#deli_" + deli_idx + " input[name=inprmitnm]").val();
					var nm2 = $("#frm_inp input[name=grockle_name]").val(); // 주문자
					if (nm1 != "") {
						nm1 = nm1 + " 님";
						$("#frm_inp input[name=receivename_" + deli_idx + "]").val(nm1);
						//주문서 내 메세지 카드 관련 안내 문구 추가 - jyyoon10
						//$("#frm_inp textarea[name=sendmessage_"+deli_idx+"]").val((happy_call_yn=="N"?nm1:"") + card_msg);
						$("#frm_inp textarea[name=sendmessage_" + deli_idx + "]").val(card_msg);
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
				//선물하기 1차_20160525_메시지내용,받는분 초기화
				$("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val("");
				$("#frm_inp input[name=receivename_" + deli_idx + "]").val("");
				$(".gift_msgMultiInsert #sendmessage_1").val("");
				$("#frm_inp textarea[name=sendmessage_" + deli_idx + "]").val("");

				if ("Y" != grockle_yn) {
					$("#frm_inp #giftMs_" + deli_idx).show();
					$("#gift_none_msg_" + deli_idx).hide();

					// 내 배송지 - 받는분, 메시지, 보내는분
					var objNm = $("#deli_" + deli_idx_new + " #li_mine input[name=inprmitnm]").val();
					//						var objNm = $(".gift_msgMultiInsert input[name=defultRecvNm]:hidden").val();
					if (objNm != "") {
						$("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val(objNm + " 님"); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp input[name=receivename_" + deli_idx + "]").val(objNm + " 님");

						//주문서 내 메세지 카드 관련 안내 문구 추가 - jyyoon10
						//				            $(".gift_msgMultiInsert #sendmessage_1").val((happy_call_yn=="N"?objNm:"") + card_msg); //선물하기 1차 작업관련 추가_160516
						//				            $("#frm_inp textarea[name=sendmessage_"+deli_idx+"]").val((happy_call_yn=="N"?objNm:"") + card_msg);
						$(".gift_msgMultiInsert #sendmessage_1").val(card_msg); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp textarea[name=sendmessage_" + deli_idx + "]").val(card_msg);
					}

					// 새로운 배송지 - 받는분, 메시지, 보내는분
					var nm1 = $("#deli_" + deli_idx_new + " #li_new input[name=inprmitnm]").val();
					if (nm1 != "") {
						$("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val(nm1 + " 님"); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp input[name=receivename_" + deli_idx + "]").val(nm1 + " 님");

						//주문서 내 메세지 카드 관련 안내 문구 추가 - jyyoon10
						//							$(".gift_msgMultiInsert #sendmessage_1").val((happy_call_yn=="N"?nm1:"") + card_msg); //선물하기 1차 작업관련 추가_160516
						//							$("#frm_inp textarea[name=sendmessage_"+deli_idx+"]").val((happy_call_yn=="N"?nm1:"") + card_msg);
						$(".gift_msgMultiInsert #sendmessage_1").val(card_msg); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp textarea[name=sendmessage_" + deli_idx + "]").val(card_msg);
					}

					$("#frm_inp .gift_msgMultiInsert input[name=sendname_1]").val($("#nameSp").text() + "드림"); // 보내는 이 //선물하기 1차 작업관련 추가_160516
					$("#frm_inp input[name=sendname_" + deli_idx + "]").val($("#nameSp").text() + "드림"); // 보내는 이
				} else {
					$("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val(''); //선물하기 1차 작업관련 추가_160516
					$("#frm_inp input[name=receivename_" + deli_idx_new + "]").val('');
					var nm1 = $("#deli_" + deli_idx_new + " input[name=inprmitnm]").val();
					var nm2 = $("#frm_inp input[name=grockle_name]").val(); // 주문자
					if (nm1 != "") {
						nm1 = nm1 + " 님";
						$("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val(nm1); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp input[name=receivename_" + deli_idx + "]").val(nm1);

						//주문서 내 메세지 카드 관련 안내 문구 추가 - jyyoon10
						//							$("#frm_inp .gift_msgMultiInsert textarea[name=sendmessage_1]").val((happy_call_yn=="N"?nm1:"") + card_msg); //선물하기 1차 작업관련 추가_160516
						//							$("#frm_inp textarea[name=sendmessage_"+deli_idx+"]").val((happy_call_yn=="N"?nm1:"") + card_msg);
						$("#frm_inp .gift_msgMultiInsert textarea[name=sendmessage_1]").val(card_msg); //선물하기 1차 작업관련 추가_160516
						$("#frm_inp textarea[name=sendmessage_" + deli_idx + "]").val(card_msg);
					}
					if (nm2 != "") {
						$("#frm_inp .gift_msgMultiInsert input[name=sendname_1]").val(nm2 + "드림"); //선물하기 1차 작업관련 추가_160516
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

				$("#frm_inp .gift_msgMultiInsert input[name=receivename_1]").val("");
				$(".gift_msgMultiInsert #sendmessage_1").val("");
				$("#frm_inp .gift_msgMultiInsert input[name=sendname_1]").val("");

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

		// 신용카드인 경우 - 20181029
		if ($("#frm_inp input[name=paytype]:hidden").val() == PAYTYPE_CODE_CARD) {
			if ($("#frm_inp select[name=iscmcd]").val() == "") {
				// 신용카드 선택 초기화
				$('.inlineBorder').removeClass('active');
			} else {
				// 신용카드 선택 처리.
				toggleAction5($("#cardList_" + $("#frm_inp select[name=iscmcd]").val()));
			}
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
	console.log("name=paytype : " + $("#frm_inp input[name=paytype]:hidden").val());

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

	// 소득공제 대상 주문 이면 경고창
	if ('Y' == $('#frm_send input[name=is_idne]:hidden').val()) {
		alert("도서∙공연비 소득공제 대상상품 주문은 L.pay(은행계좌 제외) 또는 신용카드 결제만 가능합니다.");
	}

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

		//payType 여부에 따라 우선순위에 해당 하는 결제수단 가져 오기
		var returnHistPay = fn_inputPayType(histPayMeanCd);

		coupon_cd = $("#frm_send input[name=prommdclcd]").val();
		coupon_cardcd = $("#frm_send input[name=cardkndcd]").val();
		// 중복카드할인쿠폰 선택되어 있을 경우 초기화 처리
		coupon_cd_dup = $("#frm_send input[name=prommdclcd_dup]").val();
		coupon_cardcd_dup = $("#frm_send input[name=cardkndcd_dup]").val();
		var payTypeCard = $('#pay_type1').hasClass('disable');
		// 카트 할인 체크(무통장||휴대폰||네이버페이)
		if ((coupon_cd != '' && coupon_cardcd != '') && (returnHistPay == PAYTYPE_CODE_BANK || returnHistPay == PAYTYPE_CODE_PHONE || returnHistPay == PAYTYPE_CODE_NAVERPAY)) {
			console.log("cardkndcd : " + cardkndcd);
			if (!payTypeCard) {
				//alert("카드 할인쿠폰 및 적립쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
				payTypeCodeCardSetting();
				iscmcd = $("#frm_inp select[name=iscmcd]").val(cardkndcd);
				returnHistPay = PAYTYPE_CODE_CARD;
			}
			return;

			// 중복카드할인쿠폰 체크(무통장||휴대폰||네이버페이)
		} else if ((coupon_cd_dup != '' && coupon_cardcd_dup != '') && (returnHistPay == PAYTYPE_CODE_BANK || returnHistPay == PAYTYPE_CODE_PHONE || returnHistPay == PAYTYPE_CODE_NAVERPAY)) {
			alert("중복카드 할인쿠폰은 카드로 결제를 하셔야 사용 가능 합니다.");
			if (!payTypeCard) {
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
		setCashReceiptArea(); //현금영수증
	}

	// PG PROJECT : 주문 동의 영역 노출 제어
	if ($("#pay_method").css("display") == "block" && ($('[id^=pay_type].on').attr('id') == "pay_type4" || $('[id^=pay_type].on').attr('id') == "pay_type1")) { // 주결제 수단 노출된 상태이고 L.pay, 신용카드 선택 된 경우
		fn_setDisplayAssentArea('Y');
	} else {
		fn_setDisplayAssentArea('N');
	}
});

//최근결제수단 선택전 해당 결제수단 결제가능한지 체크
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
function paytypeDisableCheckHist(checkValue) {
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
	var id = '#pay_type' + clickIdx;
	var idHassYn = $(id).hasClass('disable');

	return idHassYn;
}
//PayType결제수단 결제가능한지 체크
function fn_inputPayType(checkVal) {
	var clickIdx;
	console.log("checkVal : " + checkVal);
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


// 상품 크로스픽 <-> 일반택배 변경
function chgCrspkWithNormal(div, cart_sn, crspk_corp_cd, crspk_corp_str_sct_cd, crspk_str_no, frame_close_yn) {
	// 크로픽으로 변환 시 점 정보 체크
	if (div == 'C' && (crspk_corp_cd == null || crspk_corp_str_sct_cd == null || crspk_str_no == null || crspk_corp_cd == "" || crspk_corp_str_sct_cd == "" || crspk_str_no == "")) { // C:toCrspk, N:toNormal
		alert('지정된 스마트픽 픽업 지점 정보가 존재하지 않습니다.');
		return;
	}

	// 파라메터 생성
	var params = '{"div":"' + div + '", "cart_sn":"' + cart_sn + '"';
	if (crspk_corp_cd != null && crspk_corp_str_sct_cd != null && crspk_str_no != null) {
		params += ',"crspk_yn":"Y"';
		params += ',"crspk_corp_cd":"' + crspk_corp_cd + '"';
		params += ',"crspk_corp_str_sct_cd":"' + crspk_corp_str_sct_cd + '"';
		params += ',"crspk_str_no":"' + crspk_str_no + '"';
	} else {
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
		success: function (data) {
			alert(data.result.response_msg);

			if (data.result.response_code == "0000") { // 변경 성공 시 오픈창 닫기
				if (frame_close_yn == "Y") { // 팝업 창에서 실행 했으면 팝업창 닫기
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
function searchMartResult(cart_sn) {
	var crspk_map_url = "/smartpick/crosspick_map.do";
	var param = "?chg_attr_yn=Y";

	param += "&cart_sn=" + cart_sn;

	// iframe 보이기 및 url, parameter 셋팅
	$("#searchMartPop").show();
	$("#searchMartPop").find("iframe").attr("src", crspk_map_url + param);
}

// 크로스픽 지도 닫기
function searchMartClose() {
	$("#searchMartPop").hide();
	$("#searchMartPop").find("iframe").attr("src", "");
	$("#shipping_type_1").prop("checked", true);
}


/**************************************************************
 * 퀵배송추가 휴무/배송지서울체크 S
 **************************************************************/
function fn_chkDeliDeptClose() {

	var returnYn = true;
	var qs_yn = $("#frm_send input[name=qs_yn]:hidden").val(); //퀵배송정보


	if (typeof (qs_yn) != "undefined" && qs_yn == 'Y') {

		var postno = "";
		var postno1 = "";

		if ("Y" == grockle_yn) { // 비회원
			postno = $("#frm_inp input[name=inpzip1]:hidden").val() + $("#frm_inp input[name=inpzip2]:hidden").val();
		} else { //회원
			postno = $("#frm_send input[name=dlvzip]").val();
		}

		if (typeof (postno) == "undefined" || postno == "") {
			alert("우편번호가 저장되어있지 않아 배송지 정보를 알수 없습니다.\n새 배송지를 입력하여 다시 시도해주세요!");
			return false;
		}

		$.ajax({
			async: false,
			url: "/mylotte/searchDlvChk_quick.do",
			dataType: "json",
			data: {
				post_no: postno
			},
			success: function (result) {
				if (result.success) {
					if (result.postyn == "Y") {
						if (result.dpclose != 'Y') {
							alert("공휴일 및 롯데백화점 본점 휴무일, \n배송마감일에는 \n퀵 배송 주문이 불가합니다.");
							returnYn = false;
						}
						if (result.timeyn != 'Y') {
							alert("퀵 배송 주문은 09:00~16:30에만 가능합니다.");
							returnYn = false;
						}
					} else {
						alert("서울지역만 퀵 배송이 가능합니다.\n배송지를 다시 입력해 주세요.");
						returnYn = false;
					}
				} else {
					alert("서버와 통신 조회중 입니다. 결제하기 버튼을 다시 클릭해 주세요.");
					returnYn = false;
				}
			}
		});
	}
	return returnYn;
}


/**************************************************************
 * 퀵배송추가 배송비 S  총주문금액(배송비미포함), 배송비, 할인금액, 총결제금액
 **************************************************************/
function fn_quicDeliAmtChk(quickOrdAmt, tot_deli_amt, all_dc_amt, totpayamt) {

	var stdamt = $("#frm_send input[name=stdamt]:hidden").val(); //퀵배송정보 배송기준금액 100000
	var deliamtup = $("#frm_send input[name=deliamtup]:hidden").val(); //퀵배송정보 기준 이하금액일때 10000
	var deliamtdown = $("#frm_send input[name=deliamtdown]:hidden").val(); //퀵배송정보 기준 이상금액일때5000
	var deliamt = 0; //퀵배송비

	totpayamt = ((parseInt(quickOrdAmt) - parseInt(all_dc_amt)) - parseInt(tot_deli_amt)).toString(); //총주문금액 - 할인금액 - 배송비
	quickOrdAmt = parseInt(quickOrdAmt) - parseInt(tot_deli_amt);
	//		alert("1 : totpayamt : " + totpayamt + " / quickOrdAmt :  " + quickOrdAmt + " / tot_deli_amt : " + tot_deli_amt);

	if (parseInt(totpayamt) >= parseInt(stdamt)) { //기준금액 이상주문시
		deliamt = deliamtdown;
	} else { //기준금액 미만주문시
		deliamt = deliamtup;
	}
	totpayamt = (parseInt(totpayamt) + parseInt(deliamt)).toString(); //결제금액에 배송비를 추가해준다.
	quickOrdAmt = parseInt(quickOrdAmt) + parseInt(deliamt); //총주문금액 재계산 (순주문금액+배송비)

	//		alert(totpayamt + " / " + deliamt);

	$("#frm_inp input[name=defaulttotsttlamt]:hidden").val(quickOrdAmt); // 배송비가 합쳐 있는 금액
	$("#frm_inp input[name=totsttlamt]:hidden").val(quickOrdAmt); // 배송비가 합쳐 있는 금액
	$("#bene_tot_amt").find("span").text(String(quickOrdAmt).money() + "원");
	$("#frm_inp input[name=totordamt]:hidden").val(quickOrdAmt);
	$("#totalOrdAmt").html("<strong>" + String(quickOrdAmt).money() + "</strong>원");

	$("#frm_inp input[name=orgtotdeliamt]:hidden").val(deliamt); // 배송비
	$("#frm_inp input[name=caltotdeliamt]:hidden").val(deliamt); // 배송비
	$("#frm_send input[name=totdeliamt]:hidden").val(deliamt); // 배송비
	$("#bene_group_deli_amt_1").find("span").attr("dlex", deliamt);
	$("#bene_group_deli_amt_1").find("span").html(deliamt.money() + "<span class=\"no_bold\">원</span>");
	$("#quickDeliAmt").text(deliamt.money());
	return totpayamt;
}
/**************************************************************
 * 퀵배송추가 배송비 E
 **************************************************************/

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
	console.log(card_cd + "/" + claim_sale_card_knd_cd + " / " + parseInt(totsttlamt) + "/" + parseInt(claim_sale_aply_lmt_amt));

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

// 배송지 팝업
function searchOrdDeliveryListPop(deli_cnt, single) {
	var tag = '<iframe id="deliIframe" src="" style="width:100%;height:100%;border:0"></iframe>'
	var dlvp_sn = $("input[name=indlvpsn]").val();
	var deli_pop_url = "/popup/ord_search_delivery_list.do?deli_cnt=" + deli_cnt + "&selectedDlvpSn=" + dlvp_sn + "&single=" + single;

	// iframe 보이기 및 url, parameter 셋팅
	$("#ordSearchDeliPop").show();
	$("#ordSearchDeliPop").html(tag);
	$("#ordSearchDeliPop").find("iframe").attr("src", deli_pop_url);

	// 부모창 스크롤 방지
	$('html, body').css({
		'overflow': 'hidden',
		'height': '100%'
	});
	$('body').addClass('stop_scroll');
	$('body').on('scroll touchmove mousewheel', function (event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	});

	if (browserChk() != 'Safari') {
		history.pushState('history1', '');
	}
}

// 배송지 팝업 닫기
function searchOrdDeliveryListClose() {

	$("#ordSearchDeliPop").hide();
	$("#ordSearchDeliPop").find("iframe").remove();

	// 부모창 스크롤 풀기
	$('html, body').css({
		'overflow': 'visible',
		'height': '100%'
	});
	$('body').removeClass('stop_scroll');
	$('body').off('scroll touchmove mousewheel');

	if (browserChk() != 'Safari') {
		if (history.state != null) {
			history.back();
		}
	}
}

// 배송방법 변경
function changeShippingType(type, cartSn) {
	if (type == '2') {
		if (confirm('배송방법을 스마트픽으로 변경 하시겠습니까?')) {
			searchMartResult(cartSn);
		} else {
			$("#shipping_type_1").prop("checked", true);
		}
	}
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

function naverPayCheck() {
	var bool_send = true;
	var cash_cd = $("#frm_inp select[name=rdo_cash]").val();
	var cr_issu_mean_sct_cd = $("#frm_inp select[name=cr_issu_mean_sct_cd]").val();


	if (cash_cd == "1") { // 소득공제
		$("#frm_send input[name=cr_issu_mean_sct_cd]:hidden").val(cr_issu_mean_sct_cd);
		$("#frm_send input[name=cr_use_sct_cd]:hidden").val("0");

		$("#cash_receipts0" + cr_issu_mean_sct_cd + " input").each(function () {
			max_length = $(this).attr("maxlength");
			title = $(this).attr("title");
			tmp_val = $(this).val();
			tmp_str = " 이상";
			disabled = $(this).attr("disabled");

			if (disabled != "disabled") {
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
					bool_send = false;
					return false;
				}
			}
		});
	} else if (cash_cd == "2") { // 지출증빙용
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
	}

	return bool_send;
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

//전담배송 선택 날짜
function selCpcgDlvSeq(selVal) {

	var week = new Array('일', '월', '화', '수', '목', '금', '토');
	var selDay;
	var dlvseqSelArr;
	var dlvdateArr;

	dlvseqSelArr = selVal.value.split('_');
	dlvdateArr = dlvseqSelArr[2].split('-');

	selDay = new Date(dlvseqSelArr[2]).getDay();

	$("#selCpcgDlv").html(dlvdateArr[1] + "월 " + dlvdateArr[2] + "일 (" + week[selDay] + ") " + dlvseqSelArr[3] + "~" + dlvseqSelArr[4]);
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

	console.log("normal 현금영수증 ===============");

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

//신용카드 클릭시
function toggleAction5(e) {
	$('.inlineBorder').removeClass('active');
	$(e).addClass('active');
	$('.clear').addClass('off');
	$('.pay-step').addClass('on');
	//$('.order_product_content').addClass('off');
}

// 신용카드 클릭시 카드정보 셋팅
function setIscmCd(iscmCd) {
	$("#frm_inp select[name=iscmcd]").val(iscmCd);
	$("#frm_inp select[name=iscmcd]").change();

	// 신한카드 포인트 클릭 해제 - 20181029
	$("#shinhan_point").attr("checked", false);
	$("#shinhan_point").prop("checked", false);
	$("#shinhan_point").change();
	// BC카드 포인트 클릭 해제 - 20181029
	$("#bc_point").attr("checked", false);
	$("#bc_point").prop("checked", false);
	$("#bc_point").change();
	// 삼성카드 포인트 클릭 해제 - 20181029
	$("#samsung_point").attr("checked", false);
	$("#samsung_point").prop("checked", false);
	$("#samsung_point").change();
	// 국민카드 포인트 클릭 해제 - 20181029
	$("#kb_point").attr("checked", false);
	$("#kb_point").prop("checked", false);
	$("#kb_point").change();
}

// 선택된 신용카드 정보 초기화
function cardSelect() {
	var selVal = $("#frm_inp select[name=iscmcd]").val();

	$("#frm_inp div[name=point_card_layer]").attr("style", "display:none");
	$("#frm_send input[name=pnt_use_yn]:hidden").val("N"); /* 포인트 결제 */

	// 비씨카드
	if ("026" == selVal) {
		$("#BC_CARD_LAYER").attr("style", "display:");
	}
	// 신한카드
	else if ("029" == selVal) {
		$("#SHINHAN_CARD_LAYER").attr("style", "display:");
	}
	// 삼성카드
	else if ("031" == selVal) {
		$("#SAMSUNG_CARD_LAYER").attr("style", "display:");
	}
	// 국민카드
	else if ("016" == selVal) {
		$("#KB_CARD_LAYER").attr("style", "display:");
	}

}

function addShipTop() {
	$(".add_ship_section_layer .ship_top").click(function () {
		$("html,body").animate({
			scrollTop: 0
		}, 400);
		return false;
	})
}