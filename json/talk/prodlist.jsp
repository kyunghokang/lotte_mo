<%@ page contentType="application/json; charset=UTF-8" %>
<%
String goods_no		= request.getParameter("goods_no");
String[] arr		= goods_no.split(",");

int i, n, r;
int len = arr.length;
%>
{
	"result" : {
		"response_code" : "00000",
		"response_msg" : "",
		"response_msgtxt" : ""
	},
	"prdLst" : {
		"total_count" : <%=len%>,
		"items" : [
			<%
			for(i=0; i<len; i++){
				n = i + 1;
				if(i>0){ %>,<% } %>
			{
				"avg_gdas_stfd_val" : "<%=(i*0.5)+2%>",
				"reviewCnt"		: <%=(int) (Math.random() * 100) %>,
				"brandNm"		: "맥",
				"goodsNm"		: "<%=arr[i]%> 프로 롱웨어 SPF 10 파운데이션 촉촉한 버전 지복합성용",
				"goodsNo"		: "<%=arr[i]%>",
				"goodsCmpsCd"	: "<%=arr[i]%>",
				"imgUrl"		: "http://image.lotte.com/goods/81/25/37/66/3/366372581_1_280.jpg",
				"price"			: 25400,
				<%
				r = (int) (Math.random() * 5);
				switch(r){
				case 0:
				%>
				"md_tip"		: "",
				"find_age"		: "20",
				"find_gender"	: "F"
				<%
				break;
				case 1:
				%>
				"md_tip"		: "건성피부도 보송함을 느끼게해줘요",
				"md_tip_conts"	: "지속력甲 커버력 甲<br/>도자기같은 매끄러운 피부연출을 위한 핫아이템!",
				"find_age"		: "40",
				"find_gender"	: "M"
				<%
					break;
				case 2:
				%>
				"md_tip"		: "건성피부도 보송함을 느끼게해줘요",
				"md_tip_conts"	: "지속력甲 커버력 甲<br/>도자기같은 매끄러운 피부연출을 위한 핫아이템!",
				"find_age"		: "",
				"find_gender"	: ""
				<%
					break;
				case 3:
				%>
				"md_tip"		: "건성피부도 보송함을 느끼게해줘요",
				"md_tip_conts"	: "",
				"find_age"		: "30",
				"find_gender"	: "F"
				<%
					break;
				default:
				%>
				"md_tip"		: "",
				"find_age"		: "",
				"find_gender"	: ""
				<%
				}
				%>
			}	
			<% } %>
		]
	}
}