<%@ page contentType="application/json; charset=UTF-8" %>
<%
String sch_nm = request.getParameter("sch_nm");
if(sch_nm == null){ sch_nm = ""; }
int total_count = (int) (Math.random() * 100);
if(total_count == 0){ total_count = 1; }
%>
{
  "brandList" : {
    "items" : [ <%
    int i = 0;
    for(i=0; i<total_count; i++){
    %><% if(i>0){ %>,<% } %>{
      "brnd_no" : "<%=(int) (Math.random() * 1000000)%>",
      "brnd_nm" : "<%=sch_nm%>브랜드",
      "brnd_shop_no" : 0,
      "big_img_url" : null,
      "mid_img_url" : null,
      "small_img_url" : null,
      "link_url" : null,
      "cnt" : "<%=i+1%>"
    } <%}%>],
    "total_count" : <%=total_count%>
  }
}