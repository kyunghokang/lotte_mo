<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@ page import="java.lang.*" %>
<%@ page import="java.io.*" %>
<%
response.setHeader("Content-Type","audio/mpeg");

String ts_text		= request.getParameter("text");
String ts_path	= "d:/workspace/MO_DC_2017_1/images/tts/tts_notUnderstood.mp3";


if(ts_text.indexOf("안녕하세요") >= 0){
	ts_path	= "d:/workspace/MO_DC_2017_1/images/tts/tts_step1.mp3";
}
if(ts_text.indexOf("생수") >= 0){
	ts_path	= "d:/workspace/MO_DC_2017_1/images/tts/tts_step2.mp3";
}
if(ts_text.indexOf("최대할인") >= 0){
	ts_path	= "d:/workspace/MO_DC_2017_1/images/tts/tts_step3.mp3";
}
if(ts_text.indexOf("결제 완료") >= 0){
	ts_path	= "d:/workspace/MO_DC_2017_1/images/tts/tts_step5.mp3";
}
if(ts_text.indexOf("한번에") >= 0){
	ts_path	= "d:/workspace/MO_DC_2017_1/images/tts/tts_cart1.mp3";
}
if(ts_text.indexOf("담기 성공") >= 0){
	ts_path	= "d:/workspace/MO_DC_2017_1/images/tts/tts_cartOk.mp3";
}

File file = new File(ts_path);

InputStream in = new FileInputStream(ts_path);
long length = file.length();

byte[] bytes = new byte[(int) length];

int offset = 0;
int numRead = 0;

while (offset < bytes.length && (numRead = in.read(bytes, offset, bytes.length - offset)) >= 0) {
    offset += numRead;
}

OutputStream outstr = response.getOutputStream();
outstr.write(bytes, 0, numRead);
outstr.flush();
outstr.close();
%>