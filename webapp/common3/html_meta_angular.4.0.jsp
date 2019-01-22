<%@ page import="com.lotte.mobile.common.util.LotteUtil"%>
<%
	String reqURI = request.getRequestURI(); // 현재 URL
	String reqProtocol = request.getProtocol(); // Protocol 확인 (HTTP/1.1)
	Boolean isSecure = false; // 현재 페이지가 Secure(HTTPS) 인지 확인
	if (request.isSecure()) {
		isSecure = true;
	}
	String pubVersion = "";
	String CosmeAccCode = "";
	String domain_name = "";

	if (LotteUtil.isEllotte(request)){
		domain_name = "m.ellotte.com";
	} else if (LotteUtil.isB2B(request) || reqURI.indexOf("lottefamilymall") > -1) {
		domain_name = "m.lottefamilymall.com";
	}else{
		domain_name = "m.lotte.com";
	}
%>

<!-- favicon -->
<%
	if (LotteUtil.isLotteDotcom(request) && !LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request)) { // 롯데닷컴
%>
	<link rel="apple-touch-icon" href="/lotte/lotte-touch-icon_new.png" />
<%
	} else if (!LotteUtil.isLotteDotcom(request) && LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request)) { // 엘롯데
%>
	<link rel="apple-touch-icon" href="/ellotte/ellotte-touch-icon.png" />
<%
	} else if (!LotteUtil.isLotteDotcom(request) && !LotteUtil.isEllotte(request) && LotteUtil.isB2B(request)) { // B2B
%>
<script>
	var iconLink = document.createElement("link"); 
	iconLink.rel = "apple-touch-icon"; 
	iconLink.href = "";
	if (document.location.href.indexOf('site_no=54606') > -1) { // 패밀리몰 용
		iconLink.href = "/lotte/b2b-touch-icon_new.png";
		document.getElementsByTagName("head")[0].appendChild(iconLink); 
	} else{ // 일반 B2B용
		iconLink.href = "/lotte/b2b-touch-icon.png";
		document.getElementsByTagName("head")[0].appendChild(iconLink); 
	}
</script>
<%
	}
%>
<!-- DDOS 최초 로드 방어 -->
<link rel="stylesheet" type="text/css" href="/common3/css/lotte.inc" />
<!-- <%=reqURI %> -->
<!-- Secure : <%=isSecure %> -->
<%
	if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request) && !LotteUtil.isFAMILYMALL(request)) { // 롯데닷컴
		CosmeAccCode = "19";

		pubVersion = "r20170822_1"; // 닷컴 - 공통 파일 버전 변경시 업데이트 필요

		if (isSecure) {
%>
	<link rel="stylesheet" type="text/css" href="/lotte/resources/<%=pubVersion%>/common_secure.min.css" />
	<script src="/lotte/resources/<%=pubVersion%>/common_secure.min.js"></script>
	<script src="/lotte/resources/<%=pubVersion%>/common_secure.tpl.js"></script>
<%
		} else {
%>
	<link rel="stylesheet" type="text/css" href="/lotte/resources/<%=pubVersion%>/common.min.css" />
	<script src="/lotte/resources/<%=pubVersion%>/common.min.js"></script>
	<script src="/lotte/resources/<%=pubVersion%>/common.tpl.js"></script>
<%	
		}

		pubVersion = "r20170704_2"; // 닷컴 - 공통 이외의 리소스 버전 지정이 필요할 경우

		/**
		 * reqURI 리스트
		 * 메인 : /lotte_template/main_phone.jsp
		 */
		if (reqURI.indexOf("/view/gift/m/present_list.jsp") > -1 || // 닷컴 - 선물후기
			reqURI.indexOf("/lotte_template/search/m/search_list.jsp") > -1 || // 닷컴 - 검색결과
			reqURI.indexOf("/lotte_template/category/m/brand_prod_list.jsp") > -1 || // 닷컴 - 브랜드몰
			reqURI.indexOf("/lotte_template/category/m/cate_mid_list_anglr.jsp") > -1 || // 닷컴 - 대카테고리
			reqURI.indexOf("/lotte_template/product/m/product_list.jsp") > -1 || // 닷컴 - 기획전
			reqURI.indexOf("/lotte_template/planshop/m/planshop_view.jsp") > -1 || // 닷컴 - 이벤트 기획전
			reqURI.indexOf("/lotte_template/mall/spec_mall.jsp") > -1 || // 닷컴 - 전문관
			reqURI.indexOf("/lotte_template/mall/spec_mall_sub.jsp") > -1 || // 닷컴 - 전문관 서브
			reqURI.indexOf("/view/order/m/order_form.jsp") > -1 || // 닷컴 - 주문서 페이지
			reqURI.indexOf("/lotte_template/category/m/cate_beauty_list.jsp") > -1 || // 닷컴 - 명품화장품 No.1
			reqURI.indexOf("/lotte_template/mall/pet/dearpet_prod_list.jsp") > -1 || // 닷컴 - 디어펫 상품리스트
			reqURI.indexOf("/lotte_template/mall/pet/pet_write.jsp") > -1 || // 닷컴 - 디어펫 작성
			reqURI.indexOf("/lotte_template/mylotte/cart/m/cart_list.jsp") > -1 || // 닷컴 - 장바구니
			reqURI.indexOf("/lotte_template/mall/m/mall_sub.jsp") > -1 || // 닷컴 - 상품리스트
			reqURI.indexOf("/lotte_template/mylotte/m/mylotte.jsp") > -1 || // 닷컴 - 마이롯데 메인
			reqURI.indexOf("/lotte_template/custcenter/cscenter_main.jsp") > -1 || // 닷컴 - 고객센터 메인
			reqURI.indexOf("/lotte_template/mylotte/product/m/mylotte_crit_view.jsp") > -1 || // 닷컴 - 상품평 작성
			reqURI.indexOf("/lotte_template/mylotte/product/m/mylotte_reinquiry_list.js") > -1 || // 닷컴 - 나의상품Q&A
			reqURI.indexOf("/lotte_template/mylotte/product/m/mylotte_reinquiry_detail.jsp") > -1 || // 닷컴 - 나의상품Q&A상세
			reqURI.indexOf("/lotte_template/mall/pet/mitou_main.jsp") > -1 || // 닷컴 - 미미뚜뚜 메인
			reqURI.indexOf("/lotte_template/mall/pet/mitou_prod_list.jsp") > -1 || // 닷컴 - 미미뚜뚜 상품리스트
			reqURI.indexOf("/lotte_template/mall/pet/mitou_gallery.jsp") > -1 || // 닷컴 - 미미뚜뚜 갤러리
			reqURI.indexOf("/lotte_template/mall/pet/mitou_news.jsp") > -1 // 닷컴 - 미미뚜뚜 뉴스
		) {
			pubVersion = "r20170817_1";
		} else if (reqURI.indexOf("/lotte_template/product/m/product_view_new.jsp") > -1) { // 닷컴 - 상품상세
			pubVersion = "r20170824_1";
		} else if (reqURI.indexOf("/lotte_template/planshop/m/smartAlarmList.jsp") > -1) { // 닷컴 - 스마트알림
			pubVersion = "r20170706_1";
		} else if (reqURI.indexOf("/lotte_template/mall/baby/baby_main.jsp") > -1) { // 닷컴 - 유아동 메인
			pubVersion = "r20170706_1";
		} else if (reqURI.indexOf("/lotte_template/mall/baby/swag_baby_write.jsp") > -1) { // 닷컴 - 유아동 등록
			pubVersion = "r20170706_1";
		} else if (reqURI.indexOf("/lotte_template/mall/baby/swag_baby_rewrite.jsp") > -1) { // 닷컴 - 유아동 수정
			pubVersion = "r20170706_1";
		} else if (reqURI.indexOf("/lotte_template/styleshop/styleshop_main.jsp") > -1) { // 닷컴 - 스타일샵
			pubVersion = "r20170803_1";
		} else if (reqURI.indexOf("/view/order/m/gift_order_form.jsp") > -1) { // 닷컴 - 선물주문서 페이지
			pubVersion = "r20170821_2";
		} else if (reqURI.indexOf("/view/gift/m/present_comment_write_2.jsp") > -1) { // 닷컴 - 선물후기 수정
			pubVersion = "r20170706_1";
		} else if (reqURI.indexOf("/lotte_template/mall/smartpick.jsp") > -1) { // 닷컴 - 스마트픽
			pubVersion = "r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/product/m/photoreview.jsp") > -1) { // 닷컴 - 사진상품평
			pubVersion = "r20170713_1";
		} else if (reqURI.indexOf("/lotte_template/mall/pet/dearpet_main.jsp") > -1) { // 닷컴 - 디어펫 메인
			pubVersion = "r20170727_2";
		} else if (reqURI.indexOf("/lotte_template/mall/pet/dearpet_gallery.jsp") > -1) { // 닷컴 - 디어펫 갤러리
			pubVersion = "r20170727_1";
		} else if (reqURI.indexOf("/lotte_template/mall/pet/dearpet_news.jsp") > -1) { // 닷컴 - 디어펫 뉴스
			pubVersion = "r20170727_1";
		} else if (reqURI.indexOf("/view/popup/ord_search_delivery_list.jsp") > -1) { // 닷컴 - 간단주문서 배송지 팝업
			pubVersion = "r20170727_2";
		} else if (reqURI.indexOf("/view/popup/ord_search_address_new.jsp") > -1) { // 닷컴 - 간단주문서 배송지 수정 팝업
			pubVersion = "r20170727_2";
		} else if (reqURI.indexOf("/lotte_template/mylotte/sub/soGoodBenefit.jsp") > -1) { // 닷컴 - 참좋은혜택
			pubVersion = "r20170727_2";
		} else if (reqURI.indexOf("/lotte_template/mall/tenbyten/m/mall_main.jsp") > -1) { // 닷컴 - 텐바이텐
			pubVersion = "r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/mall/m1200m/m1200m.jsp") > -1) { // 닷컴 - 1200m
			pubVersion = "r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/mall/m1300k/m1300k.jsp") > -1) { // 닷컴 - 1300k
			pubVersion = "r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/mall/book/book.jsp") > -1) { // 닷컴 - 도서몰
			pubVersion = "r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/mall/tvShopping.jsp") > -1) { // 닷컴 - TV쇼핑
			pubVersion = "r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/custcenter/dotcomStaffBoard.jsp") > -1) { // 닷컴 - 오류신고게시판(admin 포함)
			pubVersion = "r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/talk/main/Samanda_main.jsp") > -1) { // 닷컴 - 사만다 메인
			pubVersion = "r20170822_1";
		} else if (reqURI.indexOf("/view/talk/main/talk_gateway.jsp") > -1) { // 닷컴 - 톡상담 메인
			pubVersion = "r20170822_1";
		} else if (reqURI.indexOf("/lotte_template/category/m/new_prod_list.jsp") > -1) { // 닷컴 - 몰 서브
			pubVersion = "r20170817_2";
		} else if (reqURI.indexOf("/lotte_template/product/m/style_recom.jsp") > -1) { // 닷컴 - 스타일추천
			pubVersion = "r20170822_1";
		} else if (reqURI.indexOf("/view/order/m/order_single_form.jsp") > -1) { // 닷컴 - 간단주문서
			pubVersion = "r20170824_1";
		} else if (reqURI.indexOf("/lotte_template/login/m/loginForm.jsp") > -1) { // 닷컴 - 로그인
			pubVersion = "r20170824_1";
		} else if (reqURI.indexOf("/lotte_template/main_phone.jsp") > -1) {// 닷컴 - 메인
			pubVersion = "r20170830_2";
		}
			
/******************************************************************************************
 * B2B
 ******************************************************************************************/
	} else if (!LotteUtil.isEllotte(request) && (LotteUtil.isB2B(request) || LotteUtil.isFAMILYMALL(request))) { // B2B
		pubVersion = "b2b/r20170803_1"; // B2B - 공통 버전 변경시 업데이트 필요

		if (isSecure) {
%>
	<link rel="stylesheet" type="text/css" href="/lotte/resources/<%=pubVersion%>/common_secure.min.css" />
	<script src="/lotte/resources/<%=pubVersion%>/common_secure.min.js"></script>
	<script src="/lotte/resources/<%=pubVersion%>/common_secure.tpl.js"></script>
<%
		} else {
%>
	<link rel="stylesheet" type="text/css" href="/lotte/resources/<%=pubVersion%>/common.min.css" />
	<script src="/lotte/resources/<%=pubVersion%>/common.min.js"></script>
	<script src="/lotte/resources/<%=pubVersion%>/common.tpl.js"></script>
<%	
		}

		pubVersion = "b2b/r20160428_1"; // B2B - 공통 이외의 리소스 버전 지정이 필요할 경우

		if (reqURI.indexOf("/view/order/m/order_form.jsp") > -1) { // B2B - 주문서
			pubVersion = "b2b/r20170817_1";
		} else if (reqURI.indexOf("/lotte_template/mylotte/cart/m/cart_list.jsp") > -1) { // B2B - 장바구니
			pubVersion = "b2b/r20170208_1";
		} else if (reqURI.indexOf("/view/order/m/order_complete.jsp") > -1) { // B2B - 주문완료
			pubVersion = "b2b/r20160822_3";
		} else if (reqURI.indexOf("/lotte_template/product/m/product_view_new.jsp") > -1) { // B2B - 상품상세
			pubVersion = "b2b/r20170208_1";
		} else if (reqURI.indexOf("/lotte_template/login/m/b2bLogin.jsp") > -1) { // B2B - 로그인
			pubVersion = "b2b/r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/login/m/welfareLineGate.jsp") > -1) { // B2B - 로그인 전 분기 페이지
			pubVersion = "b2b/r20170216_1";
		} else if (reqURI.indexOf("/view/mylotte/purchase/m/smart_deli_info.jsp") > -1) { // B2B - 배송정보확인
			pubVersion = "b2b/r20161222_1";
		} else if (reqURI.indexOf("/lotte_template/mylotte/m/mylotte.jsp") > -1) { // B2B - 마이롯데메인
			pubVersion = "b2b/r20170822_1";
		} else if (reqURI.indexOf("/lotte_template/mylotte/product/m/mylotte_crit_view.jsp") > -1) { // B2B - 상품평 관리화면
			pubVersion = "b2b/r20161222_1";
		} else if (reqURI.indexOf("/view/mylotte/purchase/m/purchase_list.jsp") > -1) { // B2B - 주문배송조회
			pubVersion = "b2b/r20170530_1";
		} else if (reqURI.indexOf("/lotte_template/main_b2b_corp.jsp") > -1) { // B2B - 메인
			pubVersion = "b2b/r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/special/special_b2b_corp.jsp") > -1) { // B2B - 전문관
			pubVersion = "b2b/r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/custcenter/cscenter_main.jsp") > -1) { // B2B - 고객센터
			pubVersion = "b2b/r20170721_1";
		} else if (reqURI.indexOf("/lotte_template/login/m/b2bMemberJoin.jsp") > -1) { // B2B - 회원가입
			pubVersion = "b2b/r20170721_1";
		} else if (reqURI.indexOf("/lotte_template/product/m/product_list.jsp") > -1) { // B2B - 기획전
			pubVersion = "b2b/r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/agreement/custAgreement.jsp") > -1) { // B2B - 상거래이용약관
			pubVersion = "b2b/r20170803_1";
		} else if (reqURI.indexOf("/lotte_template/agreement/custPrivacy.jsp") > -1) { // B2B - 개인정보취급(처리)방침
			pubVersion = "b2b/r20170803_1";
		}
		
/******************************************************************************************
 * 엘롯데
 ******************************************************************************************/
	} else { // 엘롯데
		CosmeAccCode = "320";
		pubVersion = "r20170817_1"; // 엘롯데 - 공통 파일 버전 변경시 업데이트 필요

		if (isSecure) {
%>
	<link rel="stylesheet" type="text/css" href="/ellotte/resources/<%=pubVersion%>/common_secure.min.css" />
	<script src="/ellotte/resources/<%=pubVersion%>/common_secure.min.js"></script>
	<script src="/ellotte/resources/<%=pubVersion%>/common_secure.tpl.js"></script>
<%
		} else {
%>
	<link rel="stylesheet" type="text/css" href="/ellotte/resources/<%=pubVersion%>/common.min.css" />
	<script src="/ellotte/resources/<%=pubVersion%>/common.min.js"></script>
	<script src="/ellotte/resources/<%=pubVersion%>/common.tpl.js"></script>
<%	
		}

		pubVersion = "r20170427_3"; // 엘롯데 - 공통 이외의 리소스 버전 지정이 필요할 경우

		if (reqURI.indexOf("/ellotte_template/main_ellotte_phone.jsp") > -1) { // 엘롯데 - 메인
			pubVersion = "r20170830_1";
		} else if (reqURI.indexOf("/ellotte_template/product/m/product_view_new.jsp") > -1) { // 엘롯데 - 상품상세
			pubVersion = "r20170822_1";
		} else if (reqURI.indexOf("/ellotte_template/product/m/product_list.jsp") > -1) { // 엘롯데 - 기획전
			pubVersion = "r20170803_2";
		} else if (reqURI.indexOf("/ellotte_template/event/m/viewDepartmentReceiptEventMain.jsp") > -1) { // 엘롯데 - 영수증 이벤트
			pubVersion = "r20170831_1";
		} else if (reqURI.indexOf("/ellotte_template/planshop/m/planshop_view.jsp") > -1) { // 엘롯데 - 이벤트기획전
			pubVersion = "r20170518_1";
		} else if (reqURI.indexOf("/ellotte_template/mall/ralph_prod_list.jsp") > -1) { // 엘롯데 - 랄프로렌 브랜드몰 상품리스트
			pubVersion = "r20170629_1";
		} else if (reqURI.indexOf("/view/mylotte/purchase/m/purchase_list.jsp") > -1) { // 엘롯데 - 주문배송조회
			pubVersion = "r20170525_1";
		} else if (reqURI.indexOf("/view/mylotte/purchase/m/purchase_view.jsp") > -1) { // 엘롯데 - 주문상세조회
			pubVersion = "r20170525_1";
		} else if (reqURI.indexOf("/view/order/m/order_form.jsp") > -1) { // 엘롯데 - 주문서 페이지
			pubVersion = "r20170810_1";
		} else if (reqURI.indexOf("/view/order/m/gift_order_form.jsp") > -1) { // 엘롯데 - 선물 주문서 페이지
			pubVersion = "r20170821_2";
		} else if (reqURI.indexOf("/view/order/m/order_complete.jsp") > -1) { // 엘롯데 - 선물 완료 페이지
			pubVersion = "r20170525_1";
		} else if (reqURI.indexOf("/view/gift/m/giftcheck.jsp") > -1) { // 엘롯데 - 선물 확인
			pubVersion = "r20170525_1";
		}else if (reqURI.indexOf("/view/gift/m/present_detail.jsp") > -1) { // 엘롯데 - 선물상세
			pubVersion = "r20170525_1";
		} else if (reqURI.indexOf("/view/gift/m/present_comment_write.jsp") > -1) { // 엘롯데 - 선물 이용후기
			pubVersion = "r20170612_1";
		} else if (reqURI.indexOf("/view/mylotte/orderclaim/m/order_return_cancel_info.jsp") > -1) { // 엘롯데 - 반품취소
			pubVersion = "r20170530_1";
		} else if (reqURI.indexOf("/view/mylotte/orderclaim/m/order_return_reg_step2.jsp") > -1) { // 엘롯데 - 반품 접수 반품정보확인
			pubVersion = "r20170530_1";
		} else if (reqURI.indexOf("/view/mylotte/orderclaim/m/order_return_reg_step3.jsp") > -1) { // 엘롯데 - 반품 접수 수거방법
			pubVersion = "r20170530_1";
		} else if (reqURI.indexOf("/ellotte_template/product/m/style_recom.jsp") > -1) { // 엘롯데 - 스타일추천
			pubVersion = "r20170822_1";
		} else if (reqURI.indexOf("/ellotte_template/smartpick/m/smartpick_booking.jsp") > -1) { // 엘롯데 - 스마트픽 찾기
			pubVersion = "r20170612_1";
		} else if (reqURI.indexOf("/ellotte_template/mall/elshop_spec_mall.jsp") > -1) { // 엘롯데 - 전문관 메인
			pubVersion = "r20170801_2";
		} else if (reqURI.indexOf("/ellotte_template/mall/elshop_spec_mall_sub.jsp") > -1) { // 엘롯데 - 전문관 서브
			pubVersion = "r20170801_2";
		} else if (reqURI.indexOf("/ellotte_template/product/product_quest_write.jsp") > -1) { // 엘롯데 - 상품문의 작성
			pubVersion = "r20170612_1";
		} else if (reqURI.indexOf("/ellotte_template/planshop/m/smartAlarmList.jsp") > -1) { // 엘롯데 - 스마트알람
			pubVersion = "r20170612_1";
		} else if (reqURI.indexOf("/ellotte_template/custcenter/m/answer_detail.jsp") > -1) { // 엘롯데 - 답변 상세
			pubVersion = "r20170612_1";
		} else if (reqURI.indexOf("/ellotte_template/mylotte/sub/soGoodBenefit.jsp") > -1) { // 엘롯데 - 참좋은혜택
			pubVersion = "r20170727_2";
		} else if (reqURI.indexOf("/ellotte_template/mall/ralph_main.jsp") > -1) { // 엘롯데 - 랄프로렌 메인
			pubVersion = "r20170629_1";
		} else if (reqURI.indexOf("/view/gift/m/present_comment_write_2.jsp") > -1) { // 엘롯데 - 선물후기 수정
			pubVersion = "r20170706_1";
		} else if (reqURI.indexOf("/ellotte_template/search/m/search_list.jsp") > -1) { // 엘롯데 - 검색리스트
			pubVersion = "r20170713_1";
		}

		 else if (reqURI.indexOf("/ellotte_template/category/m/cate_mid_list_anglr.jsp") > -1 || // 엘롯데 - 카테고리 리스트
		 		  reqURI.indexOf("/ellotte_template/custcenter/cscenter_main.jsp") > -1 || // 엘롯데 - 고객센터 메인
		 		  reqURI.indexOf("/ellotte_template/mylotte/cart/m/cart_list.jsp") > -1 || // 엘롯데 - 장바구니
		 		  reqURI.indexOf("/ellotte_template/mylotte/product/m/mylotte_crit_view.jsp") > -1 || // 엘롯데 - 상품평 작성
		 		  reqURI.indexOf("/ellotte_template/mylotte/product/m/mylotte_reinquiry_list.js") > -1 || // 엘롯데 - 나의상품Q&A
		 		  reqURI.indexOf("/ellotte_template/mylotte/product/m/mylotte_reinquiry_detail.jsp") > -1 || // 엘롯데 - 나의상품Q&A상세
		 		  reqURI.indexOf("/view/gift/m/present_list.jsp") > -1 || // 엘롯데 - 선물함
		 		  reqURI.indexOf("/ellotte_template/mylotte/m/mylotte.jsp") > -1 || // 엘롯데 - 마이롯데
		 		  reqURI.indexOf("/ellotte_template/login/m/loginForm.jsp") > -1 // 엘롯데 - 로그인
		) {
			pubVersion = "r20170817_1";
		}
	}
%>

<!-- SAS -->
<script src="/common3/js/SpeedTrapInsert.js"></script>
<!-- 와이즈 로그 -->
<script>
(function () {
var nl = document.createElement('script'); nl.type = 'text/javascript';
nl.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + '<%=domain_name%>/common4/js/lib/wl6.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(nl, s);
var done = false;
nl.onload = nl.onreadystatechange = function() {
	if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
		done = true;
		_n_sid = "<%=domain_name%>";
		_n_uid_cookie = "MBRNO";
		n_logging();
		nl.onload = nl.onreadystatechange = null;
	}
}
})();
</script>
<%
/*Cosem 수집 스크립트*/
if (!LotteUtil.isB2B(request) && !LotteUtil.isFAMILYMALL(request)) { // 롯데닷컴/엘롯데만 적용 (B2B 제외)
%>
<script>
// NSM script: 2017.01.10
var nsm_Request = function(){
	this.getParam = function( name ){
		var rtnval = ''; var nowAddress = unescape( location.href ); var parameters = (nowAddress.slice(nowAddress.indexOf('?')+1,nowAddress.length)).split('&');
		for(var i = 0 ; i < parameters.length ; i++){ var varName = parameters[i].split('=')[0];if(varName.toUpperCase() == name.toUpperCase()){rtnval = parameters[i].split('=')[1]; break;};}; return rtnval;
	}
	this.imageURL = function(){ var af = this.getParam('af'); var ak = this.getParam('ak'); var nsmProtocol = ( location.protocol=="https:" )? "https:" :"http:"; 
if( af.length > 0 && ak.length > 0 ){
var nsmParam = "&l=" + encodeURIComponent(location.href);
			var nsm = new Image();nsm.src = nsmProtocol + "//" + "ntracker.nsm-corp.com" + "/t/rdGate.php" + "?af="+af+"&ak="+ak+nsmParam;
	}; };
	this.tracking = function( ){ var obj = this; setTimeout( function(){ obj.imageURL(); }, 10); };
};
var nsmRequest = new nsm_Request();
nsmRequest.tracking( );
// Cosem Log Gathering Script V.2.0
var cosem_Request = function () {
var cookieDay = 30; // 쿠키설정 날짜
var accountCode = "<%=CosmeAccCode%>";
this.getParameter = function (name) {
	var rtnval = ''; var nowAddress = unescape( location.href ); var parameters = (nowAddress.slice(nowAddress.indexOf('?')+1,nowAddress.length)).split('&');
	for(var i = 0 ; i < parameters.length ; i++){
		var varName = parameters[i].split('=')[0];if(varName.toUpperCase() == name.toUpperCase()){rtnval = parameters[i].split('=')[1]; break;};}; return rtnval;
	}
	this.imageURL = function(){ var cosem = this.getParameter('cosemkid'); var cosem_kid = ""; var cosemProtocol = ( location.protocol=="https:" )? "https:" :"http:";
	if( cosem.length == 0 ) cosem = this.getParameter('cosem');
	if( cosem.length > 0 ) { cosem_kid = "&kid=" + cosem + "&referer=" + encodeURIComponent(location.href);
	var image = new Image(); image.src = cosemProtocol + "//" + "tracking.icomas.co.kr" + "/Script/script3.php" + "?aid="+accountCode+"&ctime=" + cookieDay + cosem_kid;};};
	this.tracking = function( ){ var obj = this; setTimeout( function(){ obj.imageURL(); }, 10); };
};
var cosemRequest = new cosem_Request();
cosemRequest.tracking( );
</script>
<%
}
%>
<%
/*FROSMO 수집 스크립트*/
if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request) && !LotteUtil.isFAMILYMALL(request)) { // 롯데닷컴만 적용 FROSMO 수집 스크립트 적용
%>
<script type="text/javascript" charset="utf-8" src="//inpref-asia.s3.amazonaws.com/frosmo.easy.js"></script>
<script type="text/javascript" charset="utf-8" src="//inpref-asia.s3.amazonaws.com/sites/lotte_com.js"></script>
<%
}
%>
<%
/*버즈니 스크립트*/
if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request) && !LotteUtil.isFAMILYMALL(request)) { // 롯데닷컴만 적용 FROSMO 수집 스크립트 적용
	if(( reqURI.indexOf("/lotte_template/category/m/new_prod_list.jsp") > -1) || ( reqURI.indexOf("/lotte_template/category/m/brand_prod_list.jsp") > -1) || ( reqURI.indexOf("/lotte_template/mylotte/cart/m/cart_list.jsp") > -1) || (reqURI.indexOf("/lotte_template/product/m/product_list.jsp") > -1)) { // 장바구니, 브랜드리스트, 소카리스트, 기획전리스트
%>
<script src="//hsmoa.com/media/buzzni_rt.min.js"></script>
<%
	}
}
%>
<%
/**********************************************************************************
 * 4.0추진팀 요청 수집 스크립트 - 스테이지만 반영 담당자 : 4.0 추진팀 조영우 대리
 **********************************************************************************/
if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request) && !LotteUtil.isFAMILYMALL(request)) { // 롯데닷컴만 적용 FROSMO 수집 스크립트 적용
%>
<script type="text/javascript">
/* <![CDATA[ */
if (document.location.href.indexOf('mo.lotte.com') > -1 || document.location.href.indexOf('mt.lotte.com') > -1 || document.location.href.indexOf('mt2.lotte.com') > -1) {
	var script = document.createElement("script"); 
	script.src = "/lotte/lib/jquery/traffic_4_0_test.js"; 
	script.type = "text/javascript"; 
	script.charset = 'UTF-8'; 
	script.async = "async"; 
	document.getElementsByTagName("head")[0].appendChild(script); 
}
/* ]]> */
</script>
<%
	}
%>
<jsp:include page="/common3/common_angular.jsp" />