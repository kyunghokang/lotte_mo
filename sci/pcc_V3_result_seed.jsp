<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<%@ page import="com.lotte.mobile.common.util.LotteUtil" %>
<%@ page import="com.lotte.mobile.common.util.ConvertUtil" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import = "java.util.*" %>
<%@ include file="/common3/taglibs.jsp"%>
<%@ include file="/common3/common.jsp"%>
<%
/**************************************************************************************************************************
* Program Name  : 본인확인 결과 수신 Sample JSP 
* File Name     : pcc_V3_result_seed.jsp
* Comment       : 
* History       :   
*
**************************************************************************************************************************/
	String pg_title = "본인확인 요청 결과"; //페이지 타이틀

    // 변수 --------------------------------------------------------------------------------
    // 휴대폰
    String retInfo		= "";																// 결과정보

	String name			= "";                                                               //성명
	String sex			= "";																//성별
	String birYMD		= "";																//생년월일
	String fgnGbn		= "";																//내외국인 구분값
	
    String di			= "";																//DI
    String ci1			= "";																//CI
    String ci2			= "";																//CI
    String civersion    = "";                                                               //CI Version
    
    String reqNum		= "";                                                               // 본인확인 요청번호
    String result		= "N";                                                              // 본인확인결과 (Y/N)
    String certDate		= "";                                                               // 검증시간
    String certGb		= "";                                                               // 인증수단
	String cellNo		= "";																// 핸드폰 번호
	String cellCorp		= "";																// 이동통신사
	String addVar		= "";


	//복화화용 변수
	String encPara		= "";
	String encMsg		= "";
	String msgChk       = "N";  
	
	//아이핀
	String strReqNum = "";
	String vDiscrNo = "";
	String strUserName = "";
	String strNameCheck = "";
	String strAge = "";
	String strSex = "";
	String strIp = "";
	String strCba = "";
	String strBirth = "";
	String strFgn = "";
	String discrHash = "";
	String ciVersion = "";
	String ciscrHash = "";

	String strIpinNo = "";
	boolean blnInvalidAccess = false;
	
	//-----------------------------------------------------------------------------------------------------------------
    
    //쿠키값 가져 오기
    Cookie[] cookies = request.getCookies();
    String cookiename = "";
    String cookiereqNum = "";
	if(cookies!=null){
		for (int i = 0; i < cookies.length; i++){
			Cookie sci_c = cookies[i];
			cookiename = sci_c.getName();
			cookiereqNum = sci_c.getValue();
			if(cookiename.compareTo("reqNum")==0) break;
			
			cookiereqNum = null;
		}
	}
	
	// 닷컴 URL
	String return_url = "";
	String certSelGb = "";
    try{
        certSelGb = request.getParameter("certSelGb").trim(); // 인증수단(H:휴대폰, I:아이핀
        //certSelGb = request.getParameter("para1").trim(); // 인증수단(H:휴대폰, I:아이핀
        //certSelGb = "H";
        
	    // Parameter 수신 --------------------------------------------------------------------			
	    retInfo  = request.getParameter("retInfo").trim();
    	if(certSelGb.equals("H")){
	        // 1. 암호화 모듈 (jar) Loading
	        com.sci.v2.pcc.secu.SciSecuManager sciSecuMg = new com.sci.v2.pcc.secu.SciSecuManager();
	        //쿠키에서 생성한 값을 Key로 생성 한다.
	        retInfo  = sciSecuMg.getDec(retInfo, cookiereqNum);
	        // 2.1차 파싱---------------------------------------------------------------
	        String[] aRetInfo1 = retInfo.split("\\^");
			encPara  = aRetInfo1[0];         //암호화된 통합 파라미터
	        encMsg   = aRetInfo1[1];    //암호화된 통합 파라미터의 Hash값
			
			String  encMsg2   = sciSecuMg.getMsg(encPara);
				// 3.위/변조 검증 ---------------------------------------------------------------
	        if(encMsg2.equals(encMsg)){
	            msgChk="Y";
	        }
				
			if(msgChk.equals("N")){
	%>
			    <script language=javascript>
	            alert("비정상적인 접근입니다.!!<%=msgChk%>");
			    </script>
	<%
				return;
			}
	
	
	        // 복호화 및 위/변조 검증 ---------------------------------------------------------------
			retInfo  = sciSecuMg.getDec(encPara, cookiereqNum);
	        String[] aRetInfo = retInfo.split("\\^");
	        name		= aRetInfo[0];
			birYMD		= aRetInfo[1];
	        sex			= aRetInfo[2];        
	        fgnGbn		= aRetInfo[3];
	        di			= aRetInfo[4];
	        ci1			= aRetInfo[5];
	        ci2			= aRetInfo[6];
	        civersion	= aRetInfo[7];
	        reqNum		= aRetInfo[8];
	        result		= aRetInfo[9];
	        certGb		= aRetInfo[10];
			cellNo		= aRetInfo[11];
			cellCorp	= aRetInfo[12];
	        certDate	= aRetInfo[13];
			addVar		= aRetInfo[14];
		
		
    	}else{ //아이핀
    		// 1. 암호화 모듈 (jar) Loading
			com.sci.v2.ipin.secu.SciSecuManager sciSecuMg = new com.sci.v2.ipin.secu.SciSecuManager();

			retInfo = sciSecuMg.getDec(retInfo, cookiereqNum);
			// 2.1차
			// 파싱---------------------------------------------------------------
			int inf1 = retInfo.indexOf("/", 0);
			int inf2 = retInfo.indexOf("/", inf1 + 1);
			
			if (inf1 < 0 || inf2 < 0) {
				%>
			    <script language=javascript>
			    	console.log('<%=retInfo%>');
			    	console.log('<%=inf1%>');
			    	console.log('<%=inf2%>');
			    	alert('인증에 실패 하였습니다.');
			    </script>
				<%
				return;
			}
			encPara = retInfo.substring(0, inf1); // 암호화된 통합 파라미터
			encMsg = retInfo.substring(inf1 + 1, inf2);
			if (sciSecuMg.getMsg(encPara).equals(encMsg)) {
				msgChk = "Y";
				result = "Y";
			}
			if(msgChk.equals("N")){
				%>
						    <script language=javascript>
				            alert("비정상적인 접근입니다.!!<%=msgChk%>");
						    </script>
				<%
							return;
			}
			// 복호화 및 위/변조 검증 ---------------------------------------------------------------
			String decPara = sciSecuMg.getDec(encPara, cookiereqNum);
			int info1 = decPara.indexOf("/", 0);
			int info2 = decPara.indexOf("/", info1 + 1);
			int info3 = decPara.indexOf("/", info2 + 1);
			int info4 = decPara.indexOf("/", info3 + 1);
			int info5 = decPara.indexOf("/", info4 + 1);
			int info6 = decPara.indexOf("/", info5 + 1);
			int info7 = decPara.indexOf("/", info6 + 1);
			int info8 = decPara.indexOf("/", info7 + 1);
			int info9 = decPara.indexOf("/", info8 + 1);
			int info10 = decPara.indexOf("/", info9 + 1);
			int info11 = decPara.indexOf("/", info10 + 1);
			int info12 = decPara.indexOf("/", info11 + 1);
			int info13 = decPara.indexOf("/", info12 + 1);
			
			//if ( info1 > 0 ) {
		        //jumin    = retInfo.substring(0,info1);			//주민번호
		    //name     = retInfo.substring(info1+1,info2);	//성명
		    //name     = decPara.substring(info2+1,info3);	//요청번호
		    //result   = retInfo.substring(info3+1,info4);	//인증성공여부
		    //strAge   = decPara.substring(info4+1,info5);	//인증수단
	        //certDate = retInfo.substring(info5+1,info6);	//요청시간
	        //userIp   = retInfo.substring(info6+1,info7);	//Client IP
	        //cellNo   = retInfo.substring(info7+1,info8);	//휴대폰번호
			//cellCorp = retInfo.substring(info8+1,info9);	//이동통신사
			//addVar = decPara.substring(info9+1,info10);
			
			//birYMD		= decPara.substring(info8 + 1, info9);
			
			strReqNum = decPara.substring(0, info1);
			vDiscrNo = decPara.substring(info1 + 1, info2);
			strUserName = decPara.substring(info2 + 1, info3);
			strNameCheck = decPara.substring(info3 + 1, info4);
			strAge = decPara.substring(info4 + 1, info5);
			strSex = decPara.substring(info5 + 1, info6);
			strIp = decPara.substring(info6 + 1, info7);
			strCba = decPara.substring(info7 + 1, info8);
			strBirth = decPara.substring(info8 + 1, info9);
			strFgn = decPara.substring(info9 + 1, info10);
			discrHash = decPara.substring(info10 + 1, info11);
			ciVersion = decPara.substring(info11 + 1, info12);
			ciscrHash = decPara.substring(info12 + 1, info13);
			discrHash = sciSecuMg.getDec(discrHash, cookiereqNum);
			ciscrHash = sciSecuMg.getDec(ciscrHash, cookiereqNum);
			strIpinNo = vDiscrNo;
			birYMD = strBirth;
			//}			
    	}
    	
		//닷컴 호출 시 파라메터 지정
		//String param = URLDecoder.decode(addVar, "UTF-8");
		//String[] para_grp = param.split("&");
		//String[] para_unit = null;
		//Map<String, String> dotcom_para = new HashMap<String, String>();
		
		//for(String para : para_grp){
		//	para_unit = para.split("=");
			
		//	dotcom_para.put(para_unit[0], ConvertUtil.NVL(para_unit[1]));
		//}
		
		// ellotte_jklee16
	    String returnDomain = request.getParameter("returnDomain");
	    // 엘롯데인 경우
		if( returnDomain!=null && returnDomain.indexOf(LotteUtil.SITE_URL_ELLOTTE) >= 0 ) {
			//return_url = (dotcom_para.get("schema")+"://"+LotteUtil.ELLOTTE_MOBILE_DOMAIN+"/sci/dotcom_return.jsp");
			return_url = LotteUtil.ORDER_PROTOCAL+"://"+LotteUtil.ELLOTTE_MOBILE_DOMAIN+"/sci/dotcom_return.jsp";
		}else{
			//return_url = (dotcom_para.get("schema")+"://"+LotteUtil.MOBILE_DOMAIN+"/sci/dotcom_return.jsp");
			return_url = LotteUtil.ORDER_PROTOCAL+"://"+LotteUtil.MOBILE_DOMAIN+"/sci/dotcom_return.jsp";

			// 롯데닷컴 Stage Secure 테스트를 위한 임시처리
			if (LotteUtil.MOBILE_DOMAIN.equals("mo.lotte.com") && request.isSecure()) {
				return_url = "https://"+LotteUtil.MOBILE_DOMAIN+"/sci/dotcom_return.jsp";
			}
		}
	    
	    //String backUrl = (dotcom_para.containsKey("backUrl")?dotcom_para.get("backUrl"):"");
%>
<script src="/lotte/lib/jquery/jquery-1.11.2.min.js"></script>
<script>
<!--
	// 인증완료
	$(document).ready(function(){
	//function result_go(){
		//document.getElementById("toApp").href = "<%=(return_url + result)%>";
		//var backUrl = getBackUrl();
		console.log('<%=addVar%>');
		console.log('<%=strReqNum%>:<%=strUserName%>:<%=strAge%>:<%=strBirth%>:<%=strFgn%>:<%=discrHash%>:<%=ciscrHash%>');
		var result = '<%=(result.equals("Y")?"true":"false") %>';
	
		resultGo('<%=result%>', '<%=birYMD%>');
		//var backUrl = getBackUrl();
		//if(result == "Y"){
		//	location.href = backUrl;
		//}else{

		//}
	});

	function resultGo(result, birYMD){
		var backUrl = getBackUrl();
		var hrefUrl;
	
		if (result == "Y"){
			hrefUrl = '<%=return_url%>';
			hrefUrl = hrefUrl + '?confirm_yn=' + result + '&bir_date=' + birYMD + (backUrl==''?'':'&backUrl='+backUrl);
	
			location.href = hrefUrl;
		}else{
			//alert("인증에 실패 하였습니다.");
			//document.getElementById("btn_div").style.display = "block";
			//location.href = LotteCommon.sciUrl + "?" + $scope.baseParam + "&adultChk=Y&returnDomain=" + window.location.host + "&backUrl=" + encodeURIComponent(backUrl, 'UTF-8');
			hrefUrl = '<%=return_url%>';
			hrefUrl = hrefUrl + '?confirm_yn=' + result + '&bir_date=' + birYMD + (backUrl==''?'':'&backUrl='+backUrl);
	
			location.href = hrefUrl;
		}
	}

	// backUrl 조회
	function getBackUrl(){
		var back_url = "";

		if (sessionStorage.getItem('sci_backUrl')!=null){
			back_url = sessionStorage.getItem('sci_backUrl');
		}

		return back_url;
	}

	// backUrl 조회
	function getBackUrl(){
		var back_url = "";

		if (sessionStorage.getItem('sci_backUrl')!=null){
			back_url = sessionStorage.getItem('sci_backUrl');
		}

		return back_url;
	}
//-->
</script>

<%--
<div id="wrap">
	<div id="container">

	<table cellpadding="1" cellspacing="1" border="1" style="display:none">
		<tr>
			<td align="center" colspan="2">본인확인 결과</td>
		</tr><tr>
			<td align="left">성명</td>
	        <td align="left"><%=name%></td>
	    </tr><tr>
	        <td align="left">성별</td>
	        <td align="left"><%=sex%></td>
	    </tr><tr>
	        <td align="left">생년월일</td>
	        <td align="left"><%=birYMD%></td>
	    </tr><tr>
	        <td align="left">내외국인 구분값(1:내국인, 2:외국인)</td>
	        <td align="left"><%=fgnGbn%></td>
	    </tr><tr>
	        <td align="left">중복가입자정보</td>
	        <td align="left"><%=di%></td>
	    </tr><tr>
	        <td align="left">연계정보1</td>
	        <td align="left"><%=ci1%></td>
	    </tr><tr>
	        <td align="left">연계정보2</td>
	        <td align="left"><%=ci2%></td>
	    </tr><tr>
	        <td align="left">연계정보버전</td>
	        <td align="left"><%=civersion%></td>
	    </tr><tr>
	        <td align="left">요청번호</td>
	        <td align="left"><%=reqNum%></td>
	    </tr><tr>
	        <td align="left">인증성공여부</td>
	        <td align="left"><%=result%></td>
	    </tr><tr>
	        <td align="left">인증수단</td>
	        <td align="left"><%=certGb%></td>
	    </tr><tr>
	        <td align="left">핸드폰번호</td>
	        <td align="left"><%=cellNo%>&nbsp;</td>                
	    </tr><tr>
	        <td align="left">이동통신사</td>
	        <td align="left"><%=cellCorp%>&nbsp;</td>                
	    </tr><tr>
	        <td align="left">요청시간</td>
	        <td align="left"><%=certDate%></td>
	    </tr><tr>
	        <td align="left">추가파라미터</td>
	        <td align="left"><%=addVar%>&nbsp;</td>
	    </tr>
    </table>    
    <span><a href="" id="toApp">앱 호출</a> </span>    
    <div id="btn_div" style="display:none">
    	<input type="button" value="돌아가기" onclick="go_loginForm()">
		<input type="button" value="재인증하기" onclick="go_confirm()">
    </div>       
		<div id="eventPage">				         
		    <div style="margin:20px 0;display:table;width:100%">
		        <img src="<%=getImagePath()%>/mobile/sub/guide_0123_01.jpg" class="w100">
		        <a href="javascript:go_loginForm();"><img src="<%=getImagePath()%>/mobile/sub/guide_0123_02.jpg" alt="<%=EXP_TITLE%>으로돌아가기" class="w50" style="border:0"></a>
		        <a href="javascript:go_confirm();"><img src="<%=getImagePath()%>/mobile/sub/guide_0123_03.jpg" alt="본인확인인증창 다시띄우기" class="w50" style="border:0"></a>
		    </div>            
		</div>
	</div>
</div>
--%>

<%
        // ----------------------------------------------------------------------------------

    }catch(Exception ex){
    	//System.out.println("[pcc] Receive Error -"+ex.getMessage());
%>
    	<script language=javascript>
        alert("시스템 오류가 발생 하였습니다.\n[pcc] Receive Error -<%=ex.getMessage()%>");
        window.parent.closeIframe();
	    </script>
<%
    }
%>