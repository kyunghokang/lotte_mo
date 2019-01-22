<%@ page import="java.io.FileReader" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%
//String file_nm = "d:\\lotte\\project\\mo\\webapp\\app\\oddconcept_cateList.json";
String file_nm =  "/h2010/mo/webapp/app/oddconcept_cateList.json";
FileReader fr =  new FileReader(file_nm);
BufferedReader br = new BufferedReader( fr );
String temp = "";
while( ( temp = br.readLine()) != null ) {
	out.println(temp);
}
%>