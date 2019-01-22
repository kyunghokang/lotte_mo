<%@ page language="java" contentType="application/json; charset=utf-8" %>
<%
//String talk_cmd			= request.getParameter("command");
String ts_cmd		= request.getParameter("command");
String ts_step		= request.getParameter("step");
String ts_text		= request.getParameter("text");
String ts_pgid		= request.getParameter("prod_grp_id");
String ts_gno		= request.getParameter("goods_no");
String ts_orno		= request.getParameter("order_no");

if(ts_text == null){
	ts_text = "";
}

String[] ts_title = {"", "생수", "탄산수", "음료수", "커피", "김치", "라면", "햇반", "쌀", "참치", "만두", "햄", "두유"};
String[] ts_thumb = {
	"",
	"http://image.lotte.com/goods/96/60/40/79/1/179406096_1_280.jpg",
	"http://image.lotte.com/goods/29/57/53/87/87535729_1_280.jpg",
	"http://image.lotte.com/goods/81/05/88/07/3/307880581_1_280.jpg",
	"http://image.lotte.com/goods/81/52/47/13/4/413475281_1_280.jpg",
	"http://image.lotte.com/goods/87/52/22/49/1/149225287_1_280.jpg",
	"http://image.lotte.com/goods/95/89/94/85/2/285948995_1_280.jpg",
	"http://image.lotte.com/goods/87/29/53/45/3/345532987_1_280.jpg",
	"http://image.lotte.com/goods/71/70/62/86/1/186627071_1_280.jpg",
	"http://image.lotte.com/goods/38/67/42/37/37426738_1_280.jpg",
	"http://image.lotte.com/goods/52/96/42/62/1/162429652_1_550.jpg",
	"http://image.lotte.com/goods/14/92/22/57/3/357229214_1_550.jpg",
	"http://image.lotte.com/goods/77/06/19/69/2/269190677_1_280.jpg"
};

int ts_i, ts_k, ts_len, ts_klen;
%>

{
"err_cd"	: "0000",
"err_msg"	: "",
"data" : {
<%
//////////////////////////////// GET PROD GROUP
if(ts_cmd.equals("getProdGroup")){
	ts_len = 12;
	ts_klen = 10;
%>
	"talk_list" : [
		"안녕하세요!",
		"원하는 상품을 말씀해보세요."
	],
	"tts_text"	: [
		"안녕하세요. 원하는 상품을 말씀해보세요."
	],
	"group_list" : [
		<%
		for(ts_i=1; ts_i<=ts_len; ts_i++){
		%>
		<% if(ts_i>1){ %>,<% } %>{
			"title"			: "<%= ts_title[ts_i] %>",
			"thumb"			: "<%= ts_thumb[ts_i] %>",
			"prod_grp_id"	: "20170000<%= ts_i %>",
			"prod_list"		: [
				<%
				for(ts_k=1; ts_k<=ts_klen; ts_k++){
				%>
				<% if(ts_k>1){ %>,<% } %>{
					"goods_nm"		: "<%= ts_title[ts_i] %> <%= ts_k %>",
					"price"			: 12500,
					"goods_cmps_cd"	: "20170215<%= ts_i %><%= ts_k %>",
					"goods_no"		: "20170215<%= ts_i %><%= ts_k %>",
					"img_url"		: "<%= ts_thumb[ts_i] %>"
				}
				<%
				}
				%>
			]
		}
		<% } %>
	]
<%
//////////////////////////////// GO FIRST
}else if(ts_text.equals("취소")){
%>
	"command"		: "goFirst"
<%
//////////////////////////////// GO PREVIOUS
}else if(ts_text.equals("이전으로")){
%>
	"command"		: "goBack"
<%
//////////////////////////////// SHOW MORE
}else if(ts_text.equals("더보기")){
%>
	"command"		: "scrollDown"
<%
//////////////////////////////// TO TOP
}else if(ts_text.equals("맨위로")){
%>
	"command"		: "scrollTop"
<%
//////////////////////////////// GO CART
}else if(ts_text.equals("장바구니로 이동")){
%>
	"command"		: "gotoCart"
<%
////////////////////////////////SELECT GROUP
}else if(ts_step.equals("5") && ts_text.equals("배송조회")){
%>
"command"		: "gotoPurchaseList"
<%
//////////////////////////////// SELECT GROUP
}else if(ts_step.equals("1") && ts_text.equals("생수 주문해줘")){
%>
	"command"		: "selectGroup",
	"prod_grp_id"	: "201700001",
	"error_list"	: [],
	"talk_list"		: [
		"주문 가능한 '<b>생수</b>'상품입니다.",
		"원하시는 상품의 번호를 말씀해보세요."
	],
	"tts_text"		: [
		"주문 가능한 생수 상품입니다. 원하시는 상품의 번호를 말씀해보세요."
	],
	"user_text"		: "---생수 주문해줘---"
<%
//////////////////////////////// SELECT GROUP
}else if((ts_step.equals("1") || ts_step.equals("2")) && ts_text.equals("아이시스 주문해줘")){
%>
	"command"		: "selectGroup",
	"prod_grp_id"	: "201700001",
	"goods_no_list"	: ["2017021511", "2017021514"],
	"error_list"	: [],
	"talk_list"		: [
		"주문 가능한 '<b>아이시스</b>'상품입니다.",
		"원하시는 상품의 번호를 말씀해보세요."
	],
	"tts_text"		: [
		"주문 가능한 생수 상품입니다. 원하시는 상품의 번호를 말씀해보세요."
	],
	"user_text"		: "---아이시스 주문해줘---"
<%
//////////////////////////////// SELECT PRODUCT
}else if(ts_step.equals("2") && ts_text.indexOf("번 주문해줘")>=0){
%>
	"command"		: "selectProduct",
	"prod_grp_id"	: "201700001",
	"goods_no"		: "2017000011",
	"error_list"	: [],
	"talk_list"		: [
		"최대할인이 적용된 <b>12,000원</b>에 주문 가능하세요.",
		"구매에 동의하시겠어요?"
	],
	"tts_text"		: [
		"최대할인이 적용된 12,000원에 주문 가능하세요.",
		"구매에 동의하시겠어요?"
	],
	"user_text"		: "---x번 주문해줘---",
	"ret_object"	: {
		"cart_sn"		: "123456",
		"total_amt"		: 12000,
		"discount_amt"	: 1200,
		"total_price"	: 10800,
		"goods_list"	: {
			"total_count"	: 1,
			"items"			: [
				{
					"goods_no"		: "987654",
					"goods_nm"		: "아이시스8.0 2L, 24페트",
					"item_no"		: "item number",
					"item_nm"		: "item name",
					"brand_nm"		: "brand name",
					"goods_cmps_cd"	: "50",
					"img_url"		: "http://image.lotte.com/goods/96/60/40/79/1/179406096_1_280.jpg",
					"ord_qty"		: 1,
					"sale_prc"		: 12000
				}
			]
		},
		"discount_list"	: {
			"total_count"	: 1,
			"items"			: [
				{
					"prom_cart_sn"			: 1,
					"prom_mdcl_cd"			: "promotion code",
					"fvr_polc_tp_cd"		: "benefit code",
					"fvr_polc_tp_nm"		: "benefit name",
					"tot_dc_amt"			: 1000,
					"cpn_prom_nm"			: "promotion number",
					"card_knd_cd"			: "card code",
					"cpn_rsc_mgmt_sn"		: 1234,
					"adtn_cost_dtl_sct_nm"	: "promotion name",
					"include_save_inst_cpn"	: "",
					"goods_nm"				: "아이시스8.0 2L, 24페트"
				}
			]
		},
		"deliver_info"	: {
			"dlvp_sn"			: 1,
			"dlvp_nm"			: "회사",
			"member_no"			: "12345678",
			"base_dlvp_yn"		: "N",
			"post_no"			: "12345",
			"post_addr"			: "서울시 중구 을지로4가",
			"dtl_addr"			: "삼풍넥서스 빌딩",
			"cbl_tel_rgn_no"	: "02",
			"cbl_tel_txno_no"	: "1234",
			"cbl_tel_end_no"	: "5678",
			"cbl_tel_exno_no"	: "",
			"cell_sct_no"		: "010",
			"cell_txno_no"		: "1234",
			"cell_end_no"		: "5678",
			"rmit_nm"			: "홍길동",
			"stnm_post_no"		: "12345",
			"stnm_post_addr"	: "서울 중구 을지로 158",
			"stnm_dtl_addr"		: "삼풍넥서스 빌딩"
		},
		"pay_info"		: {
			"member_no"			: "12345678",
			"pay_mean_seq"		: 1234,
			"pay_mean_cd"		: "99",
			"bnk_cd"			: "",
			"acqr_cd"			: "",
			"card_pay_meth_cd"	: "",
			"use_yn"			: "Y",
			"morc_man_nm"		: "name",
			"pay_mean_nm"		: "pay mean name",
			"pay_nm"			: "pay name",
			"pay_card_rcgn_id"	: "123456"
		}
	}
<%
//////////////////////////////// ADD CART
}else if(ts_step.equals("2") && ts_text.equals("1번 담아줘")){
%>
	"command"		: "addCart",
	"error_list"	: ["장바구니 담기 성공했어요."],
	"talk_list"		: [],
	"tts_text"		: ["장바구니 담기 성공했어요."]
<%
}else if(ts_step.equals("2") && ts_text.equals("1번 실패")){
%>
	"command"		: "addCart",
	"error_list"	: ["한 번에 하나씩 담을 수 있어요."],
	"talk_list"		: [],
	"tts_text"		: ["한번에 하나씩 담을 수 있어요."]
<%
//////////////////////////////// DETAIL VIEW
}else if(ts_step.equals("2") && ts_text.equals("1번 자세히")){
%>
	"command"		: "productDetail",
	"goods_no"		: "426693086",
	"error_list"	: [],
	"talk_list"		: [],
	"tts_text"		: []
<%
//////////////////////////////// PAYMENT
}else if(ts_step.equals("3") && ts_text.equals("응")){
%>
	"command"		: "payRequest",
	"error_list"	: [],
	"talk_list"		: [],
	"tts_text"		: []
<%
//////////////////////////////// PAY DONE
}else if(ts_step.equals("4") && ts_text.equals("결제완료")){
%>
	"command"		: "payComplete",
	"error_list"	: [],
	"talk_list"		: [
		"<b>12,000원</b>에 결제 완료되었어요.",
		"<b>8월 17일 발송 예정</b>이며,<br/>자세한 주문정보는 주문배송조회에서 확인하실 수 있어요.",
		"그럼, 3초 후 처음으로 이동할게요."
	],
	"tts_text"		: ["12,000원에 결제 완료되었어요."],
	"ret_object"	: {
		"total_amt"		: 12000,
		"discount_amt"	: 1200,
		"total_price"	: 10800,
		"ord_no"		: "2017-11-02-123456",
		"goods_list"	: {
			"total_count"	: 1,
			"items"			: [
				{
					"goods_no"		: "goods number",
					"goods_nm"		: "아이시스8.0 2L, 24페트",
					"item_no"		: "item number",
					"item_nm"		: "item name",
					"brand_nm"		: "brand name",
					"goods_cmps_cd"	: "50",
					"img_url"		: "http://image.lotte.com/goods/96/60/40/79/1/179406096_1_280.jpg",
					"ord_qty"		: 1,
					"sale_prc"		: 12000
				}
			]
		},
		"discount_list"	: {
			"total_count"	: 1,
			"items"			: [
				{
					"prom_cart_sn"			: 1,
					"prom_mdcl_cd"			: "promotion code",
					"fvr_polc_tp_cd"		: "benefit code",
					"fvr_polc_tp_nm"		: "benefit name",
					"tot_dc_amt"			: 1000,
					"cpn_prom_nm"			: "promotion number",
					"card_knd_cd"			: "card code",
					"cpn_rsc_mgmt_sn"		: 1234,
					"adtn_cost_dtl_sct_nm"	: "promotion name",
					"include_save_inst_cpn"	: "",
					"goods_nm"				: "아이시스8.0 2L, 24페트"
				}
			]
		},
		"deliver_info"	: {
			"dlvp_sn"			: 1,
			"dlvp_nm"			: "회사",
			"member_no"			: "12345678",
			"base_dlvp_yn"		: "N",
			"post_no"			: "12345",
			"post_addr"			: "서울시 중구 을지로4가",
			"dtl_addr"			: "삼풍넥서스 빌딩",
			"cbl_tel_rgn_no"	: "02",
			"cbl_tel_txno_no"	: "1234",
			"cbl_tel_end_no"	: "5678",
			"cbl_tel_exno_no"	: "",
			"cell_sct_no"		: "010",
			"cell_txno_no"		: "1234",
			"cell_end_no"		: "5678",
			"rmit_nm"			: "홍길동",
			"stnm_post_no"		: "12345",
			"stnm_post_addr"	: "서울 중구 을지로 158",
			"stnm_dtl_addr"		: "삼풍넥서스 빌딩"
		},
		"pay_info"		: {
			"member_no"			: "12345678",
			"pay_mean_seq"		: 1234,
			"pay_mean_cd"		: "99",
			"bnk_cd"			: "",
			"acqr_cd"			: "",
			"card_pay_meth_cd"	: "",
			"use_yn"			: "Y",
			"morc_man_nm"		: "name",
			"pay_mean_nm"		: "pay mean name",
			"pay_nm"			: "pay name",
			"pay_card_rcgn_id"	: "123456"
		}
	}
<%
//////////////////////////////// NOT UNDERSTAND
}else{
%>
	"error_list"	: ["이해하지 못했어요."],
	"talk_list"		: [],
	"tts_text"		: ["이해하지 못했어요."],
	"xxxxx"			: "<%=ts_step %> - <%=ts_text %>"
<%
}
%>
}
}