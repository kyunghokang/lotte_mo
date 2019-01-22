<%@ page contentType="application/json; charset=UTF-8" %>
<%
int dispNo = Integer.parseInt(request.getParameter("dispNo"));
String subtitle = "";

switch(dispNo){
case 5550543:
	subtitle = "빅사이즈";
	break;
case 5535841:
	subtitle = "K샵";
	break;
case 5569995:
	subtitle = "두피전문관";
	break;
case 5565610:
	subtitle = "TV아웃렛";
	break;
case 5557917:
	subtitle = "맟춤셔츠";
	break;
case 5558814:
	subtitle = "특별한 맛남";
	break;
case 5553048:
	subtitle = "롯데브랜드관";
	break;
default:
	break;
}

int i,k,m;
int d1 = 2;
int d2 = 35;
int d3 = 7;
boolean useimg = true;
%>
{
	"kshopCtg" : {
		"disp_nm" : "<%=subtitle%>",
		"ctgs" : [
		<%
		for(i=0; i<d1; i++){
			if(i>0){ %>,<% } %>
			{
				"ctg_no":<%=dispNo%><%=i%>,
				"img_url":"<% if(useimg){ %>http://image.lotte.com/goods/07/30/80/56/2/256803007_1_280.jpg<% } %>",
				"name":"Category <%=i%>",
				"new_flag":false,
				"sctgs":[
				<%
				for(k=0; k<d2; k++){
					if(k>0){ %>,<% } %>
					{
						"ctg_no":<%=dispNo%><%=i%><%=k%>,
						"name":"Sub Cate <%=i%>-<%=k%>",
						"new_flag":false,
						"ssctgs":[
							<%
							if(k > 4){
								for(m=0; m<d3; m++){
									if(m>0){ %>,<% } %>
									{
										"ctg_no":<%=dispNo%><%=i%><%=k%><%=m%>,
										"name":"Sub Sub Cate <%=i%>-<%=k%>-<%=m%>",
										"new_flag":false
									}
								<%
								}
							}
							%>
						]
					}
				<% } %>
				]
			}
		<% } %>
		]
	}
}