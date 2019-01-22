<%-- ##$$##_jsp_NEW_000 /product/crossdomain.jsp ijko --%>
<%@ page session="false" contentType="text/html; charset=euc-kr" 
%><%@ page import="java.net.*" 
%><%@ page import="java.io.*" 
%><%
%>
<%
String _url = "http://map.naver.com/api/geocode.php?key=956f6f619b13d3caf5540349078f9593&query="+request.getParameter("query");
//String _url = "http://molocal.lotte.com/resources/data/crossdomain_data.html";
%>
<%
HttpURLConnection httpConn = null;
long start = System.currentTimeMillis();
try
{
    URL httpUrl = new URL(_url);
    URLConnection conn = httpUrl.openConnection();
    httpConn = (HttpURLConnection) conn;
    httpConn.connect();
    InputStream is = null;
    try{
        is = httpConn.getInputStream();
    }
    catch (Exception e){
        throw e;
    }
    BufferedReader in = new BufferedReader(new InputStreamReader(is));
    String line = null;
    while ((line = in.readLine()) != null){
        out.println(line + "\n");
    }
}
finally
{
    if (httpConn != null)
        try{
            httpConn.disconnect();
        }
        catch (Exception e){
        }
    }
    long end = System.currentTimeMillis();
%>