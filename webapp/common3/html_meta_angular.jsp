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

// boolean isFAMILYMALL = false;
// boolean isFAMILYMALL = LotteUtil.LotteUtil.isFAMILYMALL(request);

// Favicon
String faviconIcon = "/lotte/lotte-touch-icon_new.png"; // 닷컴용 Favicon
String faviconSiteNo = request.getParameter("site_no") == null ? "" : (String)request.getParameter("site_no");

if (LotteUtil.isEllotte(request)) { // 엘롯데
	faviconIcon = "/ellotte/ellotte-touch-icon.png";
} else if (LotteUtil.isB2B(request)) { // B2B
	faviconIcon = "/lotte/b2b-touch-icon.png";

	if (faviconSiteNo.equals("54606")) { // 패밀리몰 용
		faviconIcon = "/lotte/b2b-touch-icon_new.png";
	}
}
%>
<link rel="apple-touch-icon" href="<%=faviconIcon%>" />
<link rel="stylesheet" type="text/css" href="/common3/css/lotte.inc" /><!-- DDOS 최초 로드 방어 -->

<!-- SSO 통합회원제 LIB + jQuery -->
<script type='text/javascript' src="/lotte/lib/jquery/jquery-1.11.2.min.js"></script>
<script type='text/javascript' src="https://members.lpoint.com/api/js/serialize.object.js"></script>
<script type='text/javascript' src="https://members.lpoint.com/api/js/json2.js"></script>
<script type='text/javascript' src="https://members.lpoint.com/api/js/lotte.sso.api.js"></script>

<!-- 어도비 타겟팅 스크립트 -->
<%
if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request) && !LotteUtil.isFAMILYMALL(request)) { // 롯데닷컴
%>
<script type="text/javascript" src="//assets.adobedtm.com/launch-EN4ca7c5041fc348648adfe91858af3bc5-development.min.js"></script>
<%
}
%>

<!-- <%=reqURI %> -->
<!-- Secure : <%=isSecure %> -->
<%
/******************************************************************************************
* 닷컴
******************************************************************************************/
if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request) && !LotteUtil.isFAMILYMALL(request)) { // 롯데닷컴
	CosmeAccCode = "19";

	pubVersion = "r20190110_1"; // 닷컴 - 공통 파일 버전 변경시 업데이트 필요 [닷컴/슈퍼]

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
	pubVersion = "r20180801_1"; // 닷컴 - 공통 이외의 리소스 버전 지정이 필요할 경우

	if (reqURI.indexOf("/lotte_template/main_phone.jsp") > -1) { // 닷컴 - 메인
		pubVersion = "r20181220_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/cscenter/m/cash_bill_list.jsp") > -1) { // 닷컴 - 영수증
		pubVersion = "r20180801_2";
	} else if (reqURI.indexOf("/lotte_template/agreement/company.jsp") > -1) { // 닷컴 - 회사소개
		pubVersion = "r20180801_3";
	} else if (reqURI.indexOf("/lotte_template/product/m/comment_write_new.jsp") > -1) { // 닷컴 - 상품평 쓰기
		pubVersion = "r20180904_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/comment_rewrite_new.jsp") > -1) { // 닷컴 - 상품평 수정
		pubVersion = "r20180904_1";
	} else if (reqURI.indexOf("/view/order/m/order_form.jsp") > -1) { // 닷컴 - 주문서
		pubVersion = "r20190103_1";
	} else if (reqURI.indexOf("/view/order/m/order_single_form.jsp") > -1) { // 닷컴 - 간단 주문서
		pubVersion = "r20190103_1";
	} else if (reqURI.indexOf("/view/order/m/order_cancel_form.jsp") > -1) { // 닷컴 - 주문취소
		pubVersion = "r20180809_1";
	} else if (reqURI.indexOf("/view/order/m/gift_order_form.jsp") > -1) { // 닷컴 - 선물 주문서
		pubVersion = "r20190103_1";
    } else if (reqURI.indexOf("/view/order/m/order_simple_form.jsp") > -1) { // 닷컴 - 간편결제 주문서
		pubVersion = "r20181206_1";
	} else if (reqURI.indexOf("/view/order/m/order_talk_form.jsp") > -1) { // 닷컴 - 음성주문서
		pubVersion = "r20181206_1";
	} else if (reqURI.indexOf("/view/order/m/simple_order_complete.jsp") > -1) { // 닷컴 - 간편결제 완료
		pubVersion = "r20180828_1";
	} else if (reqURI.indexOf("/lotte_template/category/m/cate_mid_list_anglr.jsp") > -1) { // 닷컴 - 카테고리
		pubVersion = "r20190103_1";
    } else if (reqURI.indexOf("/lotte_template/styleshop/styleshopmen.jsp") > -1) { // 닷컴 - 스타일샵 남성
		pubVersion = "r20180816_1";
    } else if (reqURI.indexOf("/lotte_template/product/m/sub/product_comment.jsp") > -1) { // 닷컴 - 전체 상품평 보기
		pubVersion = "r20181120_1";
    } else if (reqURI.indexOf("/lotte_template/product/m/product_view_new.jsp") > -1) { // 닷컴 - 상품상세
		pubVersion = "r20190110_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/sub/product_image_view.jsp") > -1) { // 닷컴 - 상품 이미지 크게보기
		pubVersion = "r20180918_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/sub/product_comment_image.jsp") > -1) { // 닷컴 - 사진/영상 보기
		pubVersion = "r20181113_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/sub/product_comment_image_detail.jsp") > -1) { // 닷컴 - 사진/영상 크게보기
		pubVersion = "r20181120_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/sub/product_comment_each.jsp") > -1) { // 닷컴 - 상품평 상세보기
		pubVersion = "r20181120_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/cart/m/cart_list.jsp") > -1) { // 닷컴 - 장바구니
		pubVersion = "r20190110_1";
    } else if (reqURI.indexOf("/lotte_template/mylotte/wish/m/wish_list.jsp") > -1) { // 닷컴 - 위시리스트
		pubVersion = "r20181113_1";
    } else if (reqURI.indexOf("/lotte_template/search/m/style_push_intro.jsp") > -1) { // 닷컴 - 스타일추천 소개페이지
		pubVersion = "r20181030_1";
    } else if (reqURI.indexOf("/lotte_template/mylotte/sub/soGoodBenefit.jsp") > -1) { // 닷컴 - 참좋은혜택
		pubVersion = "r20181206_1";
	} else if (reqURI.indexOf("/lotte_template/talk/main/voiceCommerce.jsp") > -1) { // 닷컴 - 보이스커머스
		pubVersion = "r20181206_1";
	} else if (reqURI.indexOf("/lotte_template/search/m/search_list.jsp") > -1) { // 닷컴 - 검색결과 페이지
		pubVersion = "r20190110_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/product_list.jsp") > -1) { // 닷컴 - 상품리스트
		pubVersion = "r20181211_1";
	} else if (reqURI.indexOf("/lotte_template/planshop/m/planshop_view.jsp") > -1) { // 닷컴 - 플랜샵
		pubVersion = "r20181211_1";
	} else if (reqURI.indexOf("/lotte_template/category/m/new_prod_list.jsp") > -1) { // 닷컴 - 상품 리스트
		pubVersion = "r20181226_3";
	} else if (reqURI.indexOf("/lotte_template/mall/spec_mall.jsp") > -1) { // 닷컴 - 롯데 브랜드관
		pubVersion = "r20190103_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/m/mylotte.jsp") > -1) { // 닷컴 - 마이롯데
		pubVersion = "r20190110_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/product/m/mylotte_crit_view.jsp") > -1) { // 닷컴 - 마이롯데
		pubVersion = "r20181120_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/profile/m/mylotte_profile.jsp") > -1) { // 닷컴 - 마이롯데 프로필
		pubVersion = "r20181120_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/product/m/mylotte_favorites_reviewer.jsp") > -1) { // 닷컴 - 마이롯데 리뷰어
		pubVersion = "r20181120_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/best_review_view.jsp") > -1) { // 닷컴 - 베스트 리뷰 상세
		pubVersion = "r20181120_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/reviewer_home_view.jsp") > -1) { // 닷컴 - 리뷰어 홈
		pubVersion = "r20181120_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/style_recom.jsp") > -1) { // 닷컴 - 스타일 추천
		pubVersion = "r20181004_1";
	} else if (reqURI.indexOf("/lotte_template/smartpick/smp_cpn_info.jsp") > -1) { // 닷컴 - 스마트픽 교환권 상세
		pubVersion = "r20181226_1";
	} else if (reqURI.indexOf("/lotte_template/login/m/loginForm.jsp") > -1) { // 닷컴 - 로그인폼
		pubVersion = "r20190110_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/m/myfeed.jsp") > -1) { // 닷컴 - 마이피드
		pubVersion = "r20181206_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/often/often_buy_list.jsp") > -1) { // 닷컴 - 자주구매
		pubVersion = "r20180904_1";
	} else if (reqURI.indexOf("/lotte_template/planshop/m/smartAlarmList.jsp") > -1) { // 닷컴 - 스마트 알람 리스트
		pubVersion = "r20181016_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/product_view_gucci.jsp") > -1) { // 닷컴 - 상품상세 구찌
		pubVersion = "r20181211_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/late_view_product_list.jsp") > -1) { // 닷컴 - 최근 본 상품
		pubVersion = "r20180913_1";
	} else if (reqURI.indexOf("/lotte_template/talk/voice_order.jsp") > -1) { // 닷컴 - 말로하는쇼핑
		pubVersion = "r20180911_1";
	} else if (reqURI.indexOf("/lotte_template/mall/pet/mitou_main.jsp") > -1) { // 닷컴 - 미미뚜뚜 메인
		pubVersion = "r20180918_1";
	} else if (reqURI.indexOf("/lotte_template/mall/pet/pet_write.jsp") > -1) { // 닷컴 - 미미뚜뚜 애완견 등록
		pubVersion = "r20180918_1";
	} else if (reqURI.indexOf("/lotte_template/mall/pet/dearpet_brd_best.jsp") > -1) { // 닷컴 - 미미뚜뚜 브랜드 베스트
		pubVersion = "r20180913_1";
	} else if (reqURI.indexOf("/lotte_template/mall/pet/mitou_prod_list.jsp") > -1) { // 닷컴 - 미미뚜뚜 상품리스트
		pubVersion = "r20180913_1";
	} else if (reqURI.indexOf("/lotte_template/smartpick/pick_list.jsp") > -1) { // 닷컴 - 스마트픽 리스트
		pubVersion = "r20181120_1";
	} else if (reqURI.indexOf("/lotte_template/event/m/kids/experience_write.jsp") > -1) { // 닷컴 - 유아동체험단
		pubVersion = "r20181129_1";
	} else if (reqURI.indexOf("/lotte_template/category/m/beauty_evt_tester.jsp") > -1) { // 닷컴 - 올댓뷰티
		pubVersion = "r20181129_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/sub/product_collect_benefits.jsp") > -1) { // 닷컴 - 혜택 모아보기
		pubVersion = "r20190110_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/sub/product_benefit_compare.jsp") > -1) { // 닷컴 - 동일상품 혜택 비교하기
		pubVersion = "r20180918_1";
	} else if (reqURI.indexOf("/lotte_template/smartpick/m/smartpick_booking.jsp") > -1) { // 닷컴 - 스마트픽 지점찾기
		pubVersion = "r20181226_1";
	} else if (reqURI.indexOf("/lotte_template/event/m/directAttend.jsp") > -1) { // 닷컴 - 출석체크 이벤트
		pubVersion = "r20180920_1";
	} else if (reqURI.indexOf("/lotte_template/login/simpleSignMemberPWFind.jsp") > -1) { // 닷컴 - 비밀번호 찾기/변경
		pubVersion = "r20181101_1";
	} else if (reqURI.indexOf("/lotte_template/login/simpleSignMemberPWFindAfter.jsp") > -1) { // 닷컴 - 비밀번호 찾기/변경 After
		pubVersion = "r20181101_1";
	} else if (reqURI.indexOf("/lotte_template/login/simpleSignMemberPWChange.jsp") > -1) { // 닷컴 - 비밀번호 재설정
		pubVersion = "r20181101_1";
	} else if (reqURI.indexOf("/lotte_template/login/simpleSignMemberReSendEmail.jsp") > -1) { // 닷컴 - 비밀번호 찾기/변경 send E-mail
		pubVersion = "r20181101_1";
	} else if (reqURI.indexOf("/lotte_template/mall/burberry/burberry_main.jsp") > -1) { // 닷컴 - 버버리 전문관 메인
		pubVersion = "r20181011_1";
	} else if (reqURI.indexOf("/lotte_template/category/m/burberry_prod_list.jsp") > -1) { // 닷컴 - 버버리 전문관 상품리스트
		pubVersion = "r20181011_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/product_view_burberry.jsp") > -1) { // 닷컴 - 버버리 전문관 상품상세
		pubVersion = "r20181108_1";
	} else if (reqURI.indexOf("/lotte_template/custcenter/m/burberry_cscenter.jsp") > -1) { // 닷컴 - 버버리 전문관 고객센터
		pubVersion = "r20181011_1";
	} else if (reqURI.indexOf("/lotte_template/category/m/cate_beauty_list.jsp") > -1) {
		pubVersion = "r20181213_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/pointcoupon/m/point_info.jsp") > -1) { // 닷컴 - 포인트 내역
		pubVersion = "r20181206_1";
	} else if (reqURI.indexOf("/lotte_template/custcenter/m/answer_detail.jsp") > -1) { // 닷컴 - 1:1문의하기
		pubVersion = "r20181108_1";
	} else if (reqURI.indexOf("/lotte_template/custcenter/m/question.jsp") > -1) { // 닷컴 - 1:1문의하기
		pubVersion = "r20181113_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/sub/product_req_info.jsp") > -1) { // 닷컴 - 상품상세 혜택 노출 개선
		pubVersion = "r20181122_1";
	} else if (reqURI.indexOf("/lotte_template/mall/gucci/gucci_main.jsp") > -1) { // 닷컴 - 구찌 메인
		pubVersion = "r20181204_1";
	} else if (reqURI.indexOf("/lotte_template/category/m/prod_list.jsp") > -1) { // 닷컴 - 카테고리 리스트
		pubVersion = "r20181204_1";
	} else if (reqURI.indexOf("/lotte_template/mall/smartpick.jsp") > -1) { // 닷컴 - 스마트픽 페이지 DM 쿠폰북 영역
		pubVersion = "r20181206_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/sub/newCouponzone.jsp") > -1) { // 닷컴 - 쿠폰존
		pubVersion = "r20190110_1";
	} else if (reqURI.indexOf("/lotte_template/styleshop/styleshop_main.jsp") > -1) { // 닷컴 - 스타일샵 메인
		pubVersion = "r20181211_1";
	} else if (reqURI.indexOf("/view/mylotte/purchase/m/smart_deli_info.jsp") > -1) { // 닷컴 - 배송조회 상세
		pubVersion = "r20181213_1";
	} else if (reqURI.indexOf("/lotte_template/event/m/eventSaunList.jsp") > -1) { // 닷컴 - 구매사은 > 나의 신청내역 탭
		pubVersion = "r20181213_1";
	} else if (reqURI.indexOf("/lotte_template/mall/coach/coach_main.jsp") > -1) { // 닷컴 - 코치 전문몰
		pubVersion = "r20181218_1";
	} else if (reqURI.indexOf("/lotte_template/mall/longchamp/longchamp_main.jsp") > -1) { // 닷컴 - 롱샴 아이프레임  전문몰
		pubVersion = "r20181220_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/sub/product_ext_info.jsp") > -1) { // 닷컴 - 락커팝업
		pubVersion = "r20181226_1";
	} else if (reqURI.indexOf("/lotte_template/search/m/search_planshop_list.jsp") > -1) { // 닷컴 - 기획전형 상품
		pubVersion = "r20181226_3";
	} else if (reqURI.indexOf("/lotte_template/mylotte/smartpay/m/smartpay.jsp") > -1) { // 닷컴 - 스마트페이
		pubVersion = "r20181226_1";
	} else if (reqURI.indexOf("/lotte_template/login/ssoDropGate.jsp") > -1) { // 닷컴 - 탈퇴 게이트
		pubVersion = "r20181226_2";
	}

/******************************************************************************************
* B2B
******************************************************************************************/
} else if (!LotteUtil.isEllotte(request) && (LotteUtil.isB2B(request) || LotteUtil.isFAMILYMALL(request))) { // B2B
	pubVersion = "b2b/r20181226_1"; // B2B - 공통 버전 변경시 업데이트 필요

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

	pubVersion = "b2b/r20180801_1"; // B2B - 공통 이외의 리소스 버전 지정이 필요할 경우

	if (reqURI.indexOf("/lotte_template/mylotte/cscenter/m/cash_bill_list.jsp") > -1) { // B2B - 영수증
		pubVersion = "b2b/r20180801_2";
	} else if (reqURI.indexOf("/lotte_template/login/m/b2bLogin.jsp") > -1) { // B2B - 로그인
		pubVersion = "b2b/r20190110_1";
	} else if (reqURI.indexOf("/lotte_template/main_b2b_mix.jsp") > -1) { // B2B - 메인 MIX
		pubVersion = "b2b/r20180821_1";
	} else if (reqURI.indexOf("/lotte_template/main_b2b_corp.jsp") > -1) { // B2B - 메인 Corp
		pubVersion = "b2b/r20180918_1";
	} else if (reqURI.indexOf("/lotte_template/main_phone.jsp") > -1) { // B2B - 메인 Phone
		pubVersion = "b2b/r20180821_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/product_list.jsp") > -1) { // B2B - 상품 리스트
		pubVersion = "b2b/r20190110_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/product_view_new.jsp") > -1) { // B2B - 상품 상세 NEW
		pubVersion = "b2b/r20180906_1";
	} else if (reqURI.indexOf("/lotte_template/product/m/product_view_gucci.jsp") > -1) { // B2B - 상품 상세 Gucci
		pubVersion = "b2b/r20180821_1";
	} else if (reqURI.indexOf("/lotte_template/search/m/search_list.jsp") > -1) { // B2B - Search List
		pubVersion = "b2b/r20180821_1";
	} else if (reqURI.indexOf("/lotte_template/category/m/cate_mid_list_anglr.jsp") > -1) { // B2B - Category
		pubVersion = "b2b/r20180821_1";
	} else if (reqURI.indexOf("/lotte_template/planshop/m/planshop_view.jsp") > -1) { // B2B - 플랜샵
		pubVersion = "b2b/r20180821_1";
	} else if (reqURI.indexOf("/lotte_template/mall/special_flavor/special_flavor.jsp") > -1) { // B2B - Special
		pubVersion = "b2b/r20180821_1";
	} else if (reqURI.indexOf("/lotte_template/login/m/welfareLineGate.jsp") > -1) { // B2B - 대리주부 사이트 로그인 페이지
		pubVersion = "b2b/r20181226_1";
	} else if (reqURI.indexOf("/view/order/m/order_form.jsp") > -1) { // B2B - 주문서
		pubVersion = "b2b/r20181211_1";
	} else if (reqURI.indexOf("/lotte_template/mylotte/m/mylotte.jsp") > -1) { // B2B - 마이롯데
		pubVersion = "b2b/r20180920_1";
	} else if (reqURI.indexOf("/lotte_template/login/m/welfareLineGateSk.jsp") > -1) { // B2B - 대리주부 사이트
		pubVersion = "b2b/r20181226_1";
	} 

/******************************************************************************************
* 엘롯데
******************************************************************************************/
} else { // 엘롯데
	CosmeAccCode = "320";
	pubVersion = "r20181206_1"; // 엘롯데 - 공통 파일 버전 변경시 업데이트 필요

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
	pubVersion = "r20181206_1"; // 엘롯데 - 공통 이외의 리소스 버전 지정이 필요할 경우
}
%>

<!-- 20180111 pub_tracking.js -->
<script src="/lotte/lib/jquery/pub_tracking.js?20190110"></script>


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
// Cosem 수집 스크립트
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
// 버즈니 스크립트
if (!LotteUtil.isEllotte(request) && !LotteUtil.isB2B(request) && !LotteUtil.isFAMILYMALL(request)) { // 롯데닷컴만 적용
	if(( reqURI.indexOf("/lotte_template/category/m/new_prod_list.jsp") > -1) || ( reqURI.indexOf("/lotte_template/category/m/brand_prod_list.jsp") > -1) || ( reqURI.indexOf("/lotte_template/mylotte/cart/m/cart_list.jsp") > -1) || (reqURI.indexOf("/lotte_template/product/m/product_list.jsp") > -1)) { // 장바구니, 브랜드리스트, 소카리스트, 기획전리스트
%>
<script src="//hsmoa.com/media/buzzni_rt.min.js"></script>
<%
	}
}
%>

<%

// 페이스북 픽셀 코드 - 공통
if (LotteUtil.isEllotte(request)){
%>
<!-- Facebook Pixel Code (와이즈버즈 ID:790258687716208) -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '790258687716208'); // Insert your pixel ID here.
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=790258687716208&ev=PageView&noscript=1"
/></noscript>
<!-- DO NOT MODIFY -->
<!-- End Facebook Pixel Code -->
<!-- Facebook Pixel Code (엔서치 마케팅 ID:113665055955984) -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '113665055955984'); // Insert your pixel ID here.
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=113665055955984&ev=PageView&noscript=1"
/></noscript>
<!-- DO NOT MODIFY -->
<!-- End Facebook Pixel Code -->
<%
};

%>

<jsp:include page="/common3/common_angular.jsp" />