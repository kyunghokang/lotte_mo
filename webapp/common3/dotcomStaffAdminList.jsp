<%@ page import="com.lotte.mobile.common.CookieUtil" %>
<%
CookieUtil cookieUtil = new CookieUtil(request); 
String loginId = cookieUtil.getValue("loginId");

boolean admin_yn = false;

if (
	loginId.equals("jinx99") || // UX기획1팀 이종봉 팀장
	loginId.equals("dlpulusm") || // UX기획1팀 임정선 매니저
	loginId.equals("songuoon") || // UX기획1팀 최송운 책임
	loginId.equals("guii") || // UX기획1팀 김동석 책임
	loginId.equals("337sj337") || // UX기획1팀 정수정 대리
	loginId.equals("khj1129") || // UX기획1팀 김현정 대리
	loginId.equals("windydog") || // UX기획1팀 이미준 대리
	loginId.equals("thomasyl5") || // UX기획1팀 이웅재 대리
	loginId.equals("merongsmile") || // UX기획1팀 백수지 대리
	loginId.equals("jijang35") || // UX기획1팀 박지혜 대리
	loginId.equals("nanunkhs") || // UX기획1팀 김희석 대리
	loginId.equals("ymssr163") || // UX기획1팀 김성태 사원
	loginId.equals("minji3661") || // UX기획1팀 한민지 사원
	loginId.equals("tkfnqldk74") || // UX기획1팀 노혜민 사원
	loginId.equals("rhow1195") || // UX기획1팀 노연주 사원
	loginId.equals("domoto77") || // UX기획1팀 이가현 사원
	loginId.equals("hello2095") || // UX기획1팀 임유진 사원

	loginId.equals("pinkyou80") || // KEDS 전시 김유경 대리

	loginId.equals("smss221") || 
	loginId.equals("daylilly4") || 
	loginId.equals("whyu") || 
	loginId.equals("nexsus") || 
	loginId.equals("kyouna89") || 
	loginId.equals("bloomy74") || 
	loginId.equals("yellowme") || 
	loginId.equals("rainfive") ||
	loginId.equals("kay0722") 
) {
	admin_yn = true;
}
%>