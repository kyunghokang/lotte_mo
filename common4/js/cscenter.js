// ?�송??번호 ?�력
var shippingNumber = function () {
	var _$btn = $("a.shipping_no");
	
	_$btn.on("click", function () {
		var $target = $(this).closest( 'li' ).find( 'div.shipping_no_wrap' );
		
		if ( $target.is(":visible") ) {
			$target.hide();
			$(this).removeClass("top").addClass("btm");
		} else {
			$target.show();
			$(this).removeClass("btm").addClass("top");
			
			$target.find(".btn_list a.col02").on("click", function () {
				$target.hide();
				_$btn.removeClass("top").addClass("btm");
			});
		}
		
		return false;
	});
};

// ?�거방법 �?��
var pickupType = function () {
	var _$select = $(".pickup_type .select_type select"),
		_$pickType = _$select.closest(".pickup_type");
	
	function selectType(idx) {
		switch (idx) {
			case 0 : // ?�배기사 방문
				_$pickType.find(".type_01").show(); // ?�내�?
				_$pickType.find(".type_02").hide();
				_$pickType.find(".type_03").hide();
				_$pickType.find(".addr_info:eq(0)").show();
				_$pickType.find(".addr_info:eq(1)").show().find("h4").show();
				break;
			case 1 : // ?�의???�배
				_$pickType.find(".type_01").hide(); // ?�내�?
				_$pickType.find(".type_02").show();
				_$pickType.find(".type_03").hide();
				_$pickType.find(".addr_info:eq(0)").hide();
				_$pickType.find(".addr_info:eq(1)").show().find("h4").hide();
				break;
			case 2 : // 고객직접발송
				_$pickType.find(".type_01").hide(); // ?�내�?
				_$pickType.find(".type_02").hide();
				_$pickType.find(".type_03").show();
				_$pickType.find(".addr_info:eq(0)").hide();
				_$pickType.find(".addr_info:eq(1)").show().find("h4").hide();
				break;
		}
	};
	
	_$select.on('change', function () {
		selectType($(this).find("option:selected").index());
	});
	
	selectType(0);
};

// 교환/반품 ?�품 ?�수 체크박스
var exchangeItemChk = function () {
	var _$chk = $(".exchange_lst > li input[type='checkbox']");
	
	_$chk.on("change", function () {
		$(this).closest("li").find(".exchange_option").toggle();
	});
};

// �?��반품 ?�결??
var refundPayItemChk = function () {
	var _$chk = $(".refund_lst > li input[type='checkbox']");
	
	_$chk.on("change", function () {
		$(this).closest("li").find(".refund_option").toggle();
		$(this).closest("li").find(".refund_payment").toggle();
	});
};

// ?�거주소 �?�� ?�의배송�??�규배송�?추�?
var addrChange = function () {
	var _$radio = $("#addr_change input[name='addrselect']");
	
	_$radio.on("change", function () {
		if ($(this).attr("id") == "addrselect1") {
			$("#addr_change .addr_lst_wrap").show();
			$("#addr_change .addr_add").hide();
		} else if ($(this).attr("id") == "addrselect2") {
			$("#addr_change .addr_lst_wrap").hide();
			$("#addr_change .addr_add").show();
		}
	});
};

// ?�불계좌 ?�록/�?��
var refundAccount = function () {
	var _$refundAccountAdd = $(".etc_payinfo .refund_account_new .a_btn"),
		_$refundAccountChange = $(".etc_payinfo .refund_account_change .a_btn");
	
	_$refundAccountAdd.on("click", function () {
		$(this).closest("li").find(".refund_account_add").show();
		$(this).hide();
		return false;
	});
	
	_$refundAccountChange.on("click", function () {
		if ($(this).index() == 0) {
			$(this).closest("li").find(".refund_account_list").show();
			$(this).closest("li").find(".refund_account_add").hide();
		} else if ($(this).index() == 1) {
			$(this).closest("li").find(".refund_account_list").hide();
			$(this).closest("li").find(".refund_account_add").show();
		}
		$(this).closest("li").find(" .refund_account_change .btn_wrap").hide();
		return false;
	});
	
	$(".etc_payinfo .refund_account_add").find(".a_btn:eq(0)").on("click", function () {
		$(this).closest(".refund_account_add").hide();
		$(this).closest("li").find(".refund_account_new .a_btn, .refund_account_change .btn_wrap").show();
		return false;
	});
	
	$(".etc_payinfo .refund_account_list").find(".a_btn:eq(0)").on("click", function () {
		$(this).closest(".refund_account_list").hide();
		$(this).closest("li").find(".refund_account_change .btn_wrap").show();
		return false;
	});
};