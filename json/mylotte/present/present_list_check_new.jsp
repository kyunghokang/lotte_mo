<%@ page contentType="application/json; charset=UTF-8" %>
<%
String mbr_no = request.getParameter("mbr_no");
String tel_no = request.getParameter("tel_no");
String pw = request.getParameter("pw");
if(mbr_no == null){ mbr_no = ""; }
int total_cnt = 19;
String phone_no = tel_no;
String[] sender = {"박신혜", "김수현", "이민정", "이나영", "송중기", "김혜수"};
String[] recieve = {"장동건", "서현진", "고소영", "전지현", "원빈", "박보검", "박보영", "김민희"};
String[] sizes = {"S", "M", "L", "XL"};

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
	"A 블라우스,원피스外 20종 택1",
	"B 시즌오프 30%★ 티셔츠/원피스/팬츠外 20종 택 1",
	"C [톰앤래빗]인기아이템 20종택1 /원피스/블라우스/팬츠/SET",
	"D ★여아 BEST20★ 티셔츠/팬츠/원피스/아쿠아슈즈 外 20종 택1",
	"E [JJ지고트]가성비 높은 아이템만 모았어! 블라우스, 원피스 外 20종 택1",
	"F [탑온탑] 뭔가 다른 탑온탑 썸머 티셔츠/셔츠/원피스",
	"G 티셔츠/팬츠/원피스 20종",
	"H [TOPGIRL] 탑 of 탑! 여름 데일리 원피스/티셔츠 20종택1",
	"I [시크헤라/하루메이비外] 여름 신상 원피스 모음전/민소매/린넨/무지/롱/여성원피스/쉬폰원피스",
	"J 안녕 여름아! 러블리 원피스/티셔츠/팬츠 20종 택 1"
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

if(pw.equals("0000")){
	total_cnt = 0;
	phone_no = "";
}
%>
{
<%
if(pw.equals("0000")){
%>
"result_code":"1111",
"error_msg":"일치하는 선물 내역이 없습니다.",
<% }else{ %>
"result_code":"0000",
"error_msg":"",
<% } %>
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
				"order_no":"2016-06-05-35251<%=i%>",
				"ord_dtl_sn":"21512512544<%=i%>",
				"type":"<% if(ecoupon){//쿠폰 %>02<% }else{//일반상품 %>01<% } %>",
				"use_yn":"<% if(ecoupon){ %>00<%=(i+1)%><% } %>",
				"status":"<%=(i%13)+10%>",
				"from_nm":"<%=sender[i%6]%>",
				"to_nm":"<%=recieve[i%8]%>"
			},
			"delivery_info":{
				"deliver":"<% if(Math.random()>0.5){ %>대한통운<% }else{ %>현대택배<% } %>",
				"invoice":"5431358456<%=i%>",
				"date":"2016년 6월 <%=i+1%>일"
			},
			"gift_pdf_info":{
				"goods_no":"1454358<%=i%>",
				"mall_flag":{
					"is_dept":<%=Math.random()>0.5%>,
					"is_tvhome":<%=Math.random()>0.5%>,
					"is_smartpick":<%=Math.random()>0.5%>
				},
				"img_url":"<%=images[n]%>",
				"brand_nm":"<%=brands[n]%>",
				"goods_nm":"<% if(ecoupon){ %>[쿠폰]<% }else{ %>[일반]<% } %> <%=products[n]%>",
				<% if((i%3)==0){ %>
				"selected_opt":{
					"opt_name":"",
					"opt_value":""
				}
				<% }else{ %>
				"selected_opt":{
					"opt_name":"사이즈",
					"opt_value":"<%=sizes[i%4]%>"
				}
				<% } %>
			}
		}
<%
}//for
%>
	]
}
}