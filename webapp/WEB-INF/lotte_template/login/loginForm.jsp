<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<script src="/ellotte/lib/jquery/jquery-1.11.2.min.js"></script>
<%@include file="/common3/angular_common_include.jsp"%>
<script>
<% // 롯데용 초기진입 Login View %>
$(document).ready(function(){
	document.submitForm.action=LOTTE_CONSTANTS['M_HOST_SSL'] + "/login/m/loginForm.do?<%=request.getQueryString() %>";
	document.submitForm.submit();
});
</script>
<form id="submitForm" name="submitForm" action="" method="post">
<%
		String rQueryString = request.getQueryString();
		String[] splitString    = rQueryString.split("&");  
		String[] splitParamName = rQueryString.split("&");

		java.util.Enumeration enu = request.getParameterNames();
				
		while(enu.hasMoreElements()){
			String param_name = "";
			param_name = (String)enu.nextElement();
			boolean paramDubCheck = false;
			
			for (int i=0;i<splitParamName.length;i++){
				if (param_name.equals(splitParamName[i])){
					paramDubCheck = true;
				}
			}
			
			if (!paramDubCheck){
				%>
				<input type="hidden" name="<%=param_name%>" value="<%=request.getParameter(param_name)%>" />
				<%
			}	
			
		}
%>
</form>
