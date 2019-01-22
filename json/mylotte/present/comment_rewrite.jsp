<%@ page contentType="application/json; charset=UTF-8" %>
<%
String goods_no = request.getParameter("goods_no");

if(goods_no.equals("40213530")){
// 이용후기 - E-쿠폰 혹은 스마트픽일 때
%>
{
  "comment_rewrite" : {
    "gdas_no" : 65049174,
    "goods_no" : 131239711,
    "usm_goods_no" : "110000001768732",
    "goods_nm" : "[헤지스]2015 S/S 신상품 : 블루 기본핏 퍼피자수 린넨 긴팔셔츠 HZK15B401NV (네이비)",
    "sale_prc" : 142000,
    "opt_desc" : "사이즈:100",
    "goods_img_url" : "http://image.lotte.com/goods/11/97/23/31/1/131239711_1_220.jpg",
    "goods_tp_cd" : "20",
    "e_use_loc_desc_cont" : "",
    "smp_psb_yn" : false,
    "frst_gdas" : false,
    "wrtr_pur" : true,
    "healthfood" : false,
    "display_color_size" : true,
    "img_disp" : false,
    "img_file_1_nm" : "111",
    "img_path_1_nm" : "222",
    "img_file_2_nm" : "",
    "img_path_2_nm" : "",
    "img_file_3_nm" : "",
    "img_path_3_nm" : "",
    "gdas_cont" : "깔끔하고 세련된 느낌의 셔츠입니다. 여름은 좀 덥고 봄-여름 사이 간절기에 좋아요. 주름은 좀 많이 가지만 멋스러워요",
    "prc_stfd_val" : 5,
    "qual_stfd_val" : 5,
    "dsgn_stfd_val" : 5,
    "dlv_stfd_val" : 5,
    "prdt_size_eval_desc" : "1",
    "prdt_clor_eval_desc" : "1",
    "login_id" : "songuoon",
    "mbr_no" : "0008419854",
    "mbr_nm" : "최송운",
    "mbr_email" : "songuoon@naver.com",
    "site_no" : 39506
  }
}
<%
}else if(goods_no.equals("23990212")){
// 식품/건강용품 - 상품평 제한
%>
{
  "comment_rewrite" : {
    "gdas_no" : 65049174,
    "goods_no" : 131239711,
    "usm_goods_no" : "110000001768732",
    "goods_nm" : "[헤지스]2015 S/S 신상품 : 블루 기본핏 퍼피자수 린넨 긴팔셔츠 HZK15B401NV (네이비)",
    "sale_prc" : 142000,
    "opt_desc" : "사이즈:100",
    "goods_img_url" : "http://image.lotte.com/goods/11/97/23/31/1/131239711_1_220.jpg",
    "goods_tp_cd" : "10",
    "e_use_loc_desc_cont" : "",
    "smp_psb_yn" : false,
    "frst_gdas" : false,
    "wrtr_pur" : true,
    "healthfood" : true,
    "display_color_size" : true,
    "img_disp" : false,
    "img_file_1_nm" : "",
    "img_path_1_nm" : "",
    "img_file_2_nm" : "",
    "img_path_2_nm" : "",
    "img_file_3_nm" : "",
    "img_path_3_nm" : "",
    "gdas_cont" : "깔끔하고 세련된 느낌의 셔츠입니다. 여름은 좀 덥고 봄-여름 사이 간절기에 좋아요. 주름은 좀 많이 가지만 멋스러워요",
    "prc_stfd_val" : 5,
    "qual_stfd_val" : 5,
    "dsgn_stfd_val" : 5,
    "dlv_stfd_val" : 5,
    "prdt_size_eval_desc" : "1",
    "prdt_clor_eval_desc" : "1",
    "login_id" : "songuoon",
    "mbr_no" : "0008419854",
    "mbr_nm" : "최송운",
    "mbr_email" : "songuoon@naver.com",
    "site_no" : 39506
  }
}
<%
}else{
// 상품평 쓰기
%>
{
  "comment_rewrite" : {
    "gdas_no" : 65049174,
    "goods_no" : 131239711,
    "usm_goods_no" : "110000001768732",
    "goods_nm" : "[헤지스]2015 S/S 신상품 : 블루 기본핏 퍼피자수 린넨 긴팔셔츠 HZK15B401NV (네이비)",
    "sale_prc" : 142000,
    "opt_desc" : "사이즈:100",
    "goods_img_url" : "http://image.lotte.com/goods/11/97/23/31/1/131239711_1_220.jpg",
    "goods_tp_cd" : "10",
    "e_use_loc_desc_cont" : "",
    "smp_psb_yn" : false,
    "frst_gdas" : false,
    "wrtr_pur" : true,
    "healthfood" : false,
    "display_color_size" : true,
    "img_disp" : false,
    "img_file_1_nm" : "131239711_1_220.jpg",
    "img_path_1_nm" : "goods/11/97/23/31/1/",
    "img_file_2_nm" : "131239711_1_220.jpg",
    "img_path_2_nm" : "goods/11/97/23/31/1/",
    "img_file_3_nm" : "131239711_1_220.jpg",
    "img_path_3_nm" : "goods/11/97/23/31/1/",
    "gdas_cont" : "깔끔하고 세련된 느낌의 셔츠입니다. 여름은 좀 덥고 봄-여름 사이 간절기에 좋아요. 주름은 좀 많이 가지만 멋스러워요",
    "prc_stfd_val" : 5,
    "qual_stfd_val" : 5,
    "dsgn_stfd_val" : 5,
    "dlv_stfd_val" : 5,
    "prdt_size_eval_desc" : "1",
    "prdt_clor_eval_desc" : "1",
    "login_id" : "songuoon",
    "mbr_no" : "0008419854",
    "mbr_nm" : "최송운",
    "mbr_email" : "songuoon@naver.com",
    "site_no" : 39506
  }
}
<%
}
%>