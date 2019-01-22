<%@ include file = "/common3/common.jsp" %>
<%@ page import = "com.lotte.mobile.common.util.LotteUtil" %>
<%@ page import = "com.lotte.mobile.common.ConstCode" %>
<%@ page import="java.util.ArrayList" %>
<%
// Viewport 정의
String viewport = "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no";
String v_title = ""; // 타이틀 정의
String smp_cpn_yn = ConvertUtil.NVL(request.getParameter("smp_cpn_yn"), ConstCode.BOOLEAN_FALSE); //스마트픽 My교환권
String reqURI = request.getRequestURI(); // 현재 URL

if (reqURI.indexOf("/product/m/product_detail") > -1) {
    viewport = "width=device-width, initial-scale=1.0, user-scalable=yes";
}
// CSS/JS 리스트
ArrayList<String> css_list = new ArrayList<String>(); // CSS 리스트
ArrayList<String> js_list = new ArrayList<String>(); // js 리스트
/**
 * CSS 선언 #################################################################
 */
// 롯데닷컴 CSS
String main_home_css = "/common4/css/main_home_20150302_v1.css"; // 메인
String main_home2015_css = "/common4/css/main_home201504_20150710_v2.css"; // 메인리뉴얼 3차 
String category_menu_css = "/common4/css/category_menu_20150818_v1.css"; // 카테고리 슬라이드 메뉴
String mylotte_quick_css = "/common4/css/mylotte_quick_20150402_v1.css"; // 마이롯데 슬라이드 메뉴
String search_css = "/common4/css/search_v5.css";
String layout_css  =  "/common4/css/layout_20150709_v2.css?v=20150819";
String main_home_m_css = "/common4/css/main_home_v1_m.css";
String layout_m_css = "/common4/css/layout_m.css";
String mylotte_main_css = "/common4/css/mylotte_main_v20150423_v1.css";
String srh_lst_css = "/common4/css/srh_lst_20141230_v1.css";
String old_srh_lst_css = "/common4/css/srh_lst_20141230_v1.css";
String common_css =  "/common4/css/common_20150709_v2.css";
String footer_css = "/common4/css/footer_20150813_v1.css";
String product_css = "/common4/css/product_20150709_v3.css";
String mylotte_css = "/common4/css/mylotte_20150813_v1.css";
String category_css = "/common4/css/category_20150113_v1.css";
String order_css = "/common4/css/order_20150611_v1.css";
String main_css = "/common4/css/main_20141211_v1.css";
String cscenter_css = "/common4/css/cscenter_v1.css";
String new_category_css = "/common4/css/category_2015_20150528_v2.css"; //모바일 리뉴얼 - 카테고리 개선 kwkwon
//String order_new_css = "/common4/css/order_new_20150618_v1.css";
String order_new_css = "/common4/css/order_new_20150804_v2.css";

// 엘롯데 CSS
String e_layout_css  =  "/common4/ellotte_css/layout_20150709_v2.css"; // 공통 layout
String e_main_home_m_css = "/common4/ellotte_css/main_home_m_20150401_v1.css"; // 모바일 메인
String e_main_home_t_css = "/common4/ellotte_css/main_home_t_20150401_v1.css"; // 태블릿 메인
String e_plusdeal_css = "/common4/ellotte_css/plus_deal_20150224_v1.css"; // 플러스딜
String e_category_menu_css = "/common4/ellotte_css/category_menu_v4.css"; // 카테고리 슬라이드 메뉴
String e_mylotte_quick_css = "/common4/ellotte_css/mylotte_quick_v3.css"; // 마이롯데 슬라이드 메뉴
String e_search_css = "/common4/ellotte_css/search_v3.css";
String e_mylotte_main_css = "/common4/ellotte_css/mylotte_main_20150424_v1.css";
String e_srh_lst_css = "/common4/ellotte_css/srh_lst_v1.css";
String e_old_srh_lst_css = "/common4/ellotte_css/srh_lst.css";
String e_common_v1_css =  "/common4/ellotte_css/common_20150709_v1.css";
String e_common_v3_css =  "/common4/ellotte_css/common_v2.css";
String e_footer_css = "/common4/ellotte_css/footer_20150813_v1.css";
String e_product_css = "/common4/ellotte_css/product_20150804_v1.css";
String e_mylotte_css = "/common4/ellotte_css/mylotte_20150625_v1.css";
String e_category_css = "/common4/ellotte_css/category.css?2014082801";
String e_order_css = "/common4/ellotte_css/order_20150812_v1.css";
String e_main_css = "/common4/ellotte_css/main_v2.css";
String e_cscenter_css = "/common4/ellotte_css/cscenter_v1.css";
String e_order_new_css = "/common4/ellotte_css/order_new_20150804_v1.css";

// 스마트픽 CSS
String smp_common2013_css = "/common3/css/smp_common2013_20141230_v1.css";
String mo_smp_layout_css = "/common3/css/mo_smp_layout_v1.css?v=20140701";
String mo_smp_coupon_css = "/common3/css/mo_smp_coupon_20150825_v1.css";

// 홈쇼핑 CSS
String tvshop2013_css = "/common3/css/tvshop2013_v1.css";
String tvhome_css = "/common4/css/tvhome_20150312_v1.css";

/**
 * JS 선언 ################################################################
 */
// 닷컴 / 엘롯데 공통 JS
String common2013_js = "/common3/js/common2013_v1.js?v=20150819";
String bookmark_js = "/common3/js/bookmark.js?v=20140919";
String app_interface_js = "/common3/js/app_interface_20150210_v1.js";

// 롯데닷컴 / 엘롯데 검색결과 페이지 JS
String common_js = "/common4/js/common_20150709_v2.js";
String category_js = "/common4/js/category_20150820_v1.js";

String mylotte_js = "/common4/js/mylotte_20150312_v1.js";
String json2_js = "/common3/js/json2.js";
String product_3_js = "/common3/js/product.js";
String product_4_js = "/common4/js/product.js";
String pub_tvhome_js = "/common4/js/pub_tvhome_20150723_v1.js";
//String pub_tvhome_js = "/common4/js/pub_tvhome_20150319_v1.js";

// 롯데닷컴
//String dev_common_js = "/common4/js/dev_common_20150707_v1.js";
String dev_common_js = "/common4/js/dev_common_20150713_v2.js";
String main_js = "/common4/js/main_201504_20150630_v2.js";
String egslider_js = "/common4/js/EGSlider_20150707_v1.js";
String baby_js = "/common4/js/baby_20141230_v1.js";
String new_category_js = "/common4/js/pub_category_20150602_v1.js";

// 엘롯데
String e_common_js = "/common4/js/ellotte_common_20150709_v1.js";
String e_category_js = "/common4/js/ellotte_category_20150818_v1.js";
String e_mylotte_js = "/common4/js/ellotte_mylotte_20150428_v1.js";
String e_js = "/common4/js/ellotte_v3.js";
String e_dev_common_js = "/common4/js/ellotte_dev_common_20150224_v1.js";
String e_main_js = "/common4/js/ellotte_main_20150224_v1.js";

/**
 * CSS 분기 ################################################################
 */

// 롯데닷컴 / 엘롯데 CSS 분기 처리
if (!isEllotte) { // 롯데닷컴
    v_title = "LOTTE.COM";

    if (reqURI.indexOf("/main_phone") > -1) { // 메인
        //css_list.add(main_home_css);
        css_list.add(category_menu_css);
        css_list.add(mylotte_quick_css);
        css_list.add(search_css);
        css_list.add(layout_css);
        css_list.add(main_home2015_css);
        css_list.add(common_css);
    } else if (reqURI.indexOf("/mylotte.") > -1) { // 마이롯데
        css_list.add(mylotte_main_css);
        css_list.add(category_menu_css);
        css_list.add(mylotte_quick_css);
        css_list.add(search_css);
        css_list.add(common_css);
    } else if (reqURI.indexOf("/search/m") > -1) { // 모바일 검색페이지
        css_list.add(main_home_css);
        css_list.add(search_css);
        css_list.add(old_srh_lst_css);
        css_list.add(common_css);
    } else if ( reqURI.indexOf("/category/m/cate_brand_main") > -1 || // 브랜드 카테고리 매장 (모바일 리뉴얼)
                reqURI.indexOf("/category/m/brand_prod_list") > -1 || // 브랜드 상품 리스트
                reqURI.indexOf("/category/m/cate_mid_list") > -1 || // 카테고리 매장
                reqURI.indexOf("/category/m/new_prod_list") > -1) { // 카테고리 상품 리스트
        css_list.add(common_css);
        css_list.add(layout_css);
        css_list.add(category_menu_css);
        css_list.add(mylotte_quick_css);
        css_list.add(search_css);
        css_list.add(new_category_css);
    } else { // 기타 페이지
        css_list.add(common_css);
        css_list.add(layout_css);
        css_list.add(category_menu_css);
        css_list.add(mylotte_quick_css);
        css_list.add(search_css);
        css_list.add(footer_css);
        css_list.add(product_css);
        css_list.add(mylotte_css);
        css_list.add(category_css);
        css_list.add(order_css);
        css_list.add(main_css);
        css_list.add(cscenter_css);

        if (reqURI.indexOf("/order/m/order_form") > -1 ||
            reqURI.indexOf("/order/m/imall_order_form") > -1) { // 주문서
            css_list.add(order_new_css);
        }else if(reqURI.indexOf("/main/tvhome") > -1){
            css_list.add(tvhome_css);
        }
    }
} else { // 엘롯데
    v_title = "ellotte";

    if (reqURI.indexOf("/main_ellotte_phone") > -1 || reqURI.indexOf("/main_ellotte_tablet.") > -1) { // 메인
        css_list.add(e_layout_css);
        if (reqURI.indexOf("/main_ellotte_phone") > -1) { // 모바일
            css_list.add(e_main_home_m_css);
        } else { // 태블릿
            css_list.add(e_main_home_t_css);
        }
        css_list.add(e_category_menu_css);
        css_list.add(e_mylotte_quick_css);
        css_list.add(e_search_css); 
        css_list.add(e_plusdeal_css);
    } else if (reqURI.indexOf("/plus_deal_sub") > -1) { // 플러스딜 페이지
        css_list.add(e_layout_css);
        css_list.add(e_category_menu_css);
        css_list.add(e_mylotte_quick_css);
        css_list.add(e_search_css); 
        css_list.add(e_plusdeal_css);
    }  else if (reqURI.indexOf("/mylotte.") > -1) { // 마이롯데 페이지
        css_list.add(e_layout_css);
        css_list.add(e_mylotte_main_css);
        css_list.add(e_category_menu_css);
        css_list.add(e_mylotte_quick_css);
        css_list.add(e_search_css);
    } else if (reqURI.indexOf("/search/m") > -1) { // 모바일 검색 페이지
        css_list.add(e_layout_css);
        css_list.add(srh_lst_css);
        css_list.add(e_old_srh_lst_css);
        css_list.add(search_css);
    } else { // 기타 페이지
        css_list.add(e_common_v1_css);
        css_list.add(e_layout_css);
        css_list.add(e_category_menu_css);
        css_list.add(e_mylotte_quick_css);
        css_list.add(e_search_css);
        css_list.add(e_footer_css);
        css_list.add(e_product_css);
        css_list.add(e_mylotte_css);
        css_list.add(e_category_css);
        css_list.add(e_order_css);
        css_list.add(e_main_css);
        css_list.add(e_cscenter_css);

        if (reqURI.indexOf("/order/m/order_form") > -1 ||
            reqURI.indexOf("/order/m/imall_order_form") > -1) { // 주문서
            css_list.add(e_order_new_css);
        }
    }
}

if(smp_cpn_yn.equals(ConstCode.BOOLEAN_TRUE)){ // 닷컴, 엘롯데
    css_list.add(mo_smp_coupon_css);
}

if(LotteUtil.isSmp(request)){ // 스마트픽
    css_list.add(smp_common2013_css);
    css_list.add(mo_smp_layout_css);
    css_list.add(mo_smp_coupon_css);
}

// 홈쇼핑 관련 페이지일때 추가
if (reqURI.indexOf("/imall/cart/select_present") > -1 ||
    reqURI.indexOf("/imall/cart/m/select_present") > -1 ||
    reqURI.indexOf("/imall/cart/t/select_present") > -1 ||
    reqURI.indexOf("/product/m/imall_select_present") > -1 ||
    reqURI.indexOf("/product/imall_select_present") > -1) {
    css_list.add(tvshop2013_css);
}

/**
 * JS 분기 ################################################################
 */
// 전체 공통 (닷컴/엘롯데)
js_list.add(common2013_js);
js_list.add(bookmark_js);
js_list.add(app_interface_js);

if (reqURI.indexOf("/mobile_search_list") > -1) { //검색 결과 페이지
    js_list.add(common_js);
    js_list.add(category_js);
    js_list.add(mylotte_js);
    js_list.add(json2_js);
    js_list.add(product_3_js);
    js_list.add(product_4_js);
} else {    
    if (!isEllotte) {   //롯데닷컴
        js_list.add(dev_common_js); 
        js_list.add(common_js);
        js_list.add(category_js); 
        js_list.add(egslider_js);
        js_list.add(mylotte_js); 
        js_list.add(new_category_js);   //모바일 리뉴얼 - 카테고리 개선 kwkwon
        
        if(reqURI.indexOf("/main_phone") > -1){
            js_list.add(main_js);
        } else if(reqURI.indexOf("/mall/babymall/mall_main") > -1){
            js_list.add(baby_js);
        } else if(reqURI.indexOf("/main/tvhome") > -1){
            js_list.add(pub_tvhome_js);
        }
    } else { //엘롯데
        if(reqURI.indexOf("/dormancyInfo") == -1){
            js_list.add(e_dev_common_js);
        }
        js_list.add(e_common_js);
        js_list.add(e_category_js);
        js_list.add(e_mylotte_js);
        js_list.add(e_js);
        if(reqURI.indexOf("/main_ellotte_phone") > -1){
            js_list.add(e_main_js);
        }
    }
}

%><title><%=v_title%></title>
<meta charset="UTF-8">
<meta http-equiv="cache-control" content="no-cache"/>
<meta http-equiv="expires" content="0"/>
<meta http-equiv="pragma" content="no-cache"/>
<meta name="viewport" content="<%=viewport %>" />
<meta name="format-detection" content="telephone=no">

<% //rudolph:150723 %>
<%@include file="/common3/angular_common_include.jsp" %>

<link rel="apple-touch-icon-precomposed" href="/images/common/icon/bookmark_and.ico">
<link rel="apple-touch-icon" href="/images/common/icon/bookmark_iso.png"><%

//css 삽입
for (int css_i = 0; css_i < css_list.size(); css_i++) { %>
<link rel="stylesheet" type="text/css" href="<%=css_list.get(css_i)%>"><%
}
if (!isEllotte) {%>
<%-- 
media="screen and (min-width:768px)"
media query 조건을 밖으로 빼넣을 시 특정 브라우져에서 pending 현상이 일어남
--%>
<link rel="stylesheet" type="text/css" href="/common4/css/main_home_tablet_20150730_v2.css">
<%
}
%>

<script type="text/javascript" src="/common4/js/lib/jquery.min.1.11.0.js"></script>
<script type="text/javascript" src="/common4/js/lib/crittercismClientLibraryMin.js"></script>
<%
if (isEllotte) {
%>
<script>
var c = {TABLET:0,SMART_PHONE:0};

if ($(window).width() < <%=tabletWidth%>) {
    c.TABLET=0;c.SMART_PHONE=1;
} else {
    c.TABLET=1;c.SMART_PHONE=0;
}
</script><%
}
%>
<%if(reqURI.indexOf("/main_phone") == -1){ %>
<script type="text/javascript" src="/common3/js/jquery.merge.js"></script>
<script type="text/javascript" src="/common4/js/lib/ixBand_0.6.min.js?ixBand=$B"></script>
<link rel="stylesheet" type="text/css" href="<%= path_css%>/idangerous.swiper.css">
<script type="text/javascript" src="/common4/js/lib/idangerous.swiper.min.js"></script>
<%} %>
<script type="text/javascript">
var __defaultDomain = '<%=defaultDomain %>';
var __sslDomain = "<%=sslDomain%>";
var __commonParam = '<%=commonParam %>';
var __adultYn = '<%= adultYn %>';
var __loginYn = '<%= loginYn %>';
</script>

<script type="text/javascript" src="/common4/js/top_search.js"></script><%
//js 삽입
for(int js_i = 0; js_i < js_list.size(); js_i++){ %>
<script type="text/javascript" src="<%=js_list.get(js_i)%>"></script><%
}
%>
<script type="text/javascript" src="/common4/js/cscenter.js"></script>

<!-- 검색용 //-->
<script type="text/javascript" src="/common4/js/iscroll.js"></script>
<script type="text/javascript" src="/common4/js/jquery.simulate.js"></script>
<!--// 검색용 -->

<% // 스마트픽 체크
if (request.getParameter("smp_yn") != null &&
    "Y".equals(request.getParameter("smp_yn")) &&
    !"Y".equals(LotteUtil.getCookieValue(request, LotteUtil.COOKIE_NAME_SMP_YN))) {
%>
<script>
$(document).ready(function(){
    $.ajax({type: 'post', async: false, url: '/smp/redirect.do', data:'smp_yn=Y&returnurl=none', success: function(response){}});
});
</script>
<%
}

// 카카오톡 공유 관련 페이지
if (reqURI.indexOf("/smartpick/m/pick_list") > -1 ||
    reqURI.indexOf("/smartpick/t/pick_list") > -1 ||
    reqURI.indexOf("/smartpick/m/pick_view") > -1 ||
    reqURI.indexOf("/smartpick/t/pick_view") > -1 ||
    reqURI.indexOf("/purchase/m/purchase_list") > -1 ||
    reqURI.indexOf("/purchase/t/purchase_list") > -1 ||
    reqURI.indexOf("/purchase/m/purchase_view") > -1 ||
    reqURI.indexOf("/purchase/t/purchase_view") > -1 ||

    ((reqURI.indexOf("/product/m/product_view") > -1 || reqURI.indexOf("/product/t/product_view") > -1) && request.getParameter("smp_yn")!=null && "Y".equals(request.getParameter("smp_yn"))) ||
    reqURI.indexOf("/smartpick/smp_cpn_list") > -1 ||
    reqURI.indexOf("/smartpick/smp_cpn_info") > -1 ||
    request.getRequestURI().indexOf("/main_smp") > -1) {

    String kakao_init = ConstCode.LT_KAKAO_SCRIPT_CODE;

    if (LotteUtil.isSmp(request)) {
        kakao_init = ConstCode.SMP_KAKAO_SCRIPT_CODE;
    } else if (LotteUtil.isEllotte(request)) {
        kakao_init = ConstCode.ELT_KAKAO_SCRIPT_CODE;
    } else if (schema.equals("sklotte001")) {
        kakao_init = ConstCode.SKT_KAKAO_SCRIPT_CODE;
    }
%>
<script type="text/javascript" src="/common3/js/kakao-1.0.7.js"></script>
<script> Kakao.init("<%=kakao_init %>"); </script>
<%
}
%>
<script>
    $(document).ready(function(){
        try{
        <%-- 테스트 : 550904f1b59ef2d535336028 , 운영 : 550904cce0697fa449637803 --%>
        Crittercism.init({appId: '550904cce0697fa449637803', appVersion: '20150512'});
        }catch(e){}
    });
</script>
<% if(!isEllotte) {%>
<script src="/common4/js/LottePub.js"></script>
<% }%>
<% if(LotteUtil.isLotteDotcom(request) && LotteUtil.isApp(request)) {%>
<style type="text/css">
.side_mylotte.dimmedOpen{bottom:14px}
</style>
<% }%>
