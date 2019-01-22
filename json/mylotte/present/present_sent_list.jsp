<%@ page contentType="application/json; charset=UTF-8" %>
<%
String mbr_no = request.getParameter("mbr_no");
if(mbr_no == null){ mbr_no = ""; }
int total_cnt = 19;
String phone_no = "010-1234-5678";
String[] sender = {"박신혜", "김수현", "이민정", "이나영", "송중기", "김혜수"};
String[] recieve = {"장동건", "서현진", "고소영", "전지현", "원빈", "박보검", "박보영", "김민희"};
String[] sizes = {"S", "M", "L", "XL"};
String[] colors = {"레스", "블루", "옐로우", "그린"};

String[] brands = {
	"[쉬즈미스]",
	"[블루독]",
	"[톰앤래빗]",
	"[모다까리나]",
	"[제이제이 지고트]",
	"[탑온탑]",
	"[티렌러비]",
	"[탑걸]",
	"[시크헤라]",
	"[프랜치캣]"
};
String[] products = {
	"블라우스,원피스外 20종 택1",
	"시즌오프 30%★ 티셔츠/원피스/팬츠外 20종 택 1",
	"[톰앤래빗]인기아이템 20종택1 /원피스/블라우스/팬츠/SET",
	"★여아 BEST20★ 티셔츠/팬츠/원피스/아쿠아슈즈 外 20종 택1",
	"[JJ지고트]가성비 높은 아이템만 모았어! 블라우스, 원피스 外 20종 택1",
	"[탑온탑] 뭔가 다른 탑온탑 썸머 티셔츠/셔츠/원피스",
	"티셔츠/팬츠/원피스 20종",
	"[TOPGIRL] 탑 of 탑! 여름 데일리 원피스/티셔츠 20종택1",
	"[시크헤라/하루메이비外] 여름 신상 원피스 모음전/민소매/린넨/무지/롱/여성원피스/쉬폰원피스",
	"안녕 여름아! 러블리 원피스/티셔츠/팬츠 20종 택 1"
};
String[] images = {
	"http://image.lotte.com/goods/38/47/44/49/2/249444738_2_280.jpg",
	"http://image.lotte.com/goods/76/18/88/64/2/264881876_4_280.jpg",
	"http://image.lotte.com/goods/28/89/62/61/2/261628928_1_280.jpg",
	"http://image.lotte.com/goods/89/09/08/58/2/258080989_1_280.jpg",
	"http://image.lotte.com/goods/66/00/66/54/2/254660066_1_280.jpg",
	"http://image.lotte.com/goods/23/65/91/61/2/261916523_1_280.jpg",
	"http://image.lotte.com/goods/44/08/61/61/2/261610844_12_280.jpg",
	"http://image.lotte.com/goods/83/20/57/63/2/263572083_1_280.jpg",
	"http://image.lotte.com/goods/44/71/49/63/2/263497144_1_280.jpg",
	"http://image.lotte.com/goods/45/31/59/63/2/263593145_2_280.jpg"
};
int arrcnt = 10;

if(mbr_no.equals("")){
	total_cnt = 0;
	phone_no = "";
}
%>
{
"gift_lst":{
	"total_cnt":<%=total_cnt%>,
	"items":[
<%
int i=0;
int n=0;
boolean ecoupon = true;
for(i=0; i<total_cnt; i++){
	n = i % 10;
	if(i>=6){ ecoupon = false; }
%>
		<% if(i>0){ %>,<% } %>{
			"gift_info":{
                "date" : "20161014", 
                "limit_date" : "20161211", 
                "rtgs_psb_yn" : "Y",
                "exch_psb_yn" : "Y",
                "to_telno" : "01092501057",
			    "ob_cd" : "1",
			    "sct" : "10",			    
				"order_no":"2016060535251<%=i%>",
				"ord_dtl_sn":"21512512544<%=i%>",
				"type":"<% if(ecoupon){//쿠폰 %>02<% }else{//일반상품 %>01<% } %>",
				"use_yn":"<% if(ecoupon){ %>00<%=(i+1)%><% } %>",
				"status":"<% if(!ecoupon){ %><%=((i-6)%13)+10%><% } %>",
				"from_nm":"<%=sender[i%6]%>",
				"to_nm":"<%=recieve[i%8]%>",
               "detail_status" : "60",
                "sct" : "14", 
                "rfg_msg" : "다음을 기약하겠습니다.",
                "ob_cd" : "", 
                "gift_acq_agr_yn" : "", 
                "gift_msg_rmnd_trns_cnt" : 2, 
                "opt_cnt" : 384, 
                "exch_rtgs_psb_yn" : "N",
                "dlvp_sn" : "341933700" 
			},
			"delivery_info":{
				"deliver":"<% if(Math.random()>0.5){ %>대한통운<% }else{ %>현대택배<% } %>",
				"invoice":"5431358456<%=i%>",
				"date":"2016년 6월 <%=i+1%>일",
        		"url":""
			},
			"gift_pdf_info":{
			    "site_no" : 1,
			     
				"goods_no":"1454358<%=i%>",
				"mall_flag":{
					"is_dept":<%=Math.random()>0.5%>,
					"is_tvhome":<%=Math.random()>0.5%>,
					"is_smartpick":<%=Math.random()>0.5%>
				},
				"img_url":"<%=images[n]%>",
				"brand_nm":"<%=brands[n]%>",
				"goods_nm":"<%=products[n]%>",
				<% if(Math.random()<0.3){ %>
				"selected_opt":[]
				<% }else{ %>
				"selected_opt":[
					{
						"opt_name":"사이즈",
						"opt_value":"<%=sizes[i%4]%>"
					}<% if(Math.random()>0.4){ %>,
					{
						"opt_name":"컬러",
						"opt_value":"<%=colors[i%4]%>"
					}<% } %>
				]
				<% } %>
			}
		}
<%
}//for
%>
	]
}
}