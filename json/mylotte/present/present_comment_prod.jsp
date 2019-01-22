<%@ page contentType="application/json; charset=UTF-8" %>
<%
String goods_no = request.getParameter("goodsNo");
int goods_num = Integer.parseInt(goods_no);

%>
{
	"gift_prd_info" : {
		"wrtr_cell_no":"010-1234-5678",
		"mbrNm":"홍길동",
		"goods_no" : <%=goods_no%>,
		"mall_flag":{
			"is_dept":<%=Math.random()>0.5%>,
			"is_tvhome":<%=Math.random()>0.5%>,
			"is_smartpick":<%=Math.random()>0.5%>
		},
		"img_url" : "http://image.lotte.com/goods/99/04/47/26/1/126470499_1_220.jpg",
		"brand_nm":"[헤라]",
		"goods_nm" : "[헤라](기획)UV 미스트쿠션 커버/내추럴/롱스테이 리필 2개 세트 e-coupon",
		"selected_opt_":{
				"opt_name":"",
				"opt_value":""},
		"selected_opt":[
			{
				"opt_name":"사이즈",
				"opt_value":"XL"
			},
			{
				"opt_name":"컬러",
				"opt_value":"블루"
			}
		],
 <%
 if(goods_num<=14543585){
	// 이용후기 - E-쿠폰 혹은 스마트픽일 때
 %>
		"goods_tp_cd" : "20",
		"healthfood" : false,
<%
}else if(goods_no.equals("145435818")){
// 식품/건강용품 - 상품평 제한
%>
		"goods_tp_cd" : "10",
		"healthfood" : true,
<%
}else{
// 상품평 쓰기
%>
		"goods_tp_cd" : "10",
		"healthfood" : false,
<%
}
%>
		"smp_psb_yn" : false,
		"site_no" : 39506,
		
		
		"mbr_nm" : "최송운",
		"display_color_size" : <%=Math.random()>0.5%>
	},
	"comment_info_" : {
		"gdas_no":59741800,
		"img_file_1_nm" : "131239711_1_220.jpg",
		"img_path_1_nm" : "goods/11/97/23/31/1/",
		"img_file_2_nm" : "131239711_1_220.jpg",
		"img_path_2_nm" : "goods/11/97/23/31/1/",
		"img_file_3_nm" : "131239711_1_220.jpg",
		"img_path_3_nm" : "goods/11/97/23/31/1/",
		"reviewTxt" : "깔끔하고 세련된 느낌의 셔츠입니다. 여름은 좀 덥고 봄-여름 사이 간절기에 좋아요. 주름은 좀 많이 가지만 멋스러워요",
		"qual_stfd_val" : 3,
		"dsgn_stfd_val" : 4,
		"dlv_stfd_val" : 5,
		"prdt_size_eval_desc" : "2",
		"prdt_clor_eval_desc" : "1"
	}
}