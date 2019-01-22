<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<%@ include file="/common3/taglibs.jsp"%> 
<%@ include file="/common3/common.jsp"%>
<%
String pg_title = "";
String shareTitle = request.getParameter("shareTitle");
String shareUrl = request.getParameter("shareUrl");
String shareImg = request.getParameter("shareImg");
String share_site_nm = "롯데닷컴";
if(isEllotte) share_site_nm = "엘롯데";
%>
<!DOCTYPE html>
<html>
<head>
<meta name="og:title" content="[<%=share_site_nm%> 이거어때?] <%=shareTitle %>">
<link rel="image_src" href="<%=shareImg %>">
</head>
</html>
<script>
	location.href = "<%=shareUrl%>";
</script>