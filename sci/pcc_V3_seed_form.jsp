<%@ page language="java" contentType="text/html;charset=utf-8"  %>
<%@ page import="com.lotte.mobile.common.util.ConvertUtil" %>
<%@ page import="com.lotte.mobile.common.util.LotteUtil" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import ="java.util.*,java.text.SimpleDateFormat"%>
<%@ include file="/common3/taglibs.jsp"%>
<%@ include file="/common3/common.jsp"%> 
<%
/**************************************************************************************************************************
* Program Name  : 본인확인 요청 Sample JSP (Real)  
* File Name     : pcc_V3_sample_seed.jsp
* Comment       :  
* History       : 
*
**************************************************************************************************************************/
	//19금 상품 휴대폰 인증 처리 추가
	String adultChk = ConvertUtil.NVL(request.getParameter("adultChk"), "N");
	//리턴 페이지
	String backUrl = ConvertUtil.NVL(request.getParameter("backUrl"));
		   
	String pg_title = "본인확인 요청"; //페이지 타이틀 

    response.setHeader("Pragma", "no-cache" );
    response.setDateHeader("Expires", 0);
    response.setHeader("Pragma", "no-store");
    response.setHeader("Cache-Control", "no-cache" );
	// 닷컴 스키마 
	String sci_schema = (schema.equals("")?LotteUtil.ORDER_PROTOCAL:schema);
	//schema = "";

	// backUrl이 존재할 경우
	if (!backUrl.equals("")){
		backUrl = java.net.URLEncoder.encode(backUrl, "UTF-8");
		// ios 앱일 경우 한번더 Encoding
		if (LotteUtil.boolAppInstall(uagent) && !sci_schema.equals("https") && !sci_schema.equals("http")){
			backUrl = java.net.URLEncoder.encode(backUrl, "UTF-8");
		}
	}
	
	// ellotte_jklee16
	String id1       = "SLTD001";                               					// HandPhone 본인실명확인 회원사 아이디
    String srvNo1    = LotteUtil.SCI_PERSON_SRVNO;                            	// HandPhone 본인실명확인 서비스번호
    String id2       = "LTD002";                               					// ipin 본인실명확인 회원사 아이디
    String srvNo2    = LotteUtil.SCI_IPIN_SRVNO;                            	// ipin 본인실명확인 서비스번호(수정필요)
	String systemUrl = LotteUtil.MOBILE_DOMAIN;
    String returnDomain = request.getParameter("returnDomain");
    String strImagePath = getImagePath();
    // 엘롯데인 경우
	if( returnDomain!=null && returnDomain.indexOf(LotteUtil.SITE_URL_ELLOTTE) >= 0 ) {
		systemUrl = LotteUtil.ELLOTTE_MOBILE_DOMAIN;
	    strImagePath = "http://image.lotte.com/ellotte"; // 공통에서 정의하는 이미지경로는 도메인 기준인데 본인인증의 경우 엘롯데에서도 롯데닷컴 url 을 호출하므로 별도의 엘롯데 이미지를 사용하기 위한 처리
	    srvNo1    = LotteUtil.SCI_EL_PERSON_SRVNO;
	    srvNo2    = LotteUtil.SCI_EL_IPIN_SRVNO;
	}
	//siren.lottembrsauth.srvreqno.mble=005007  SCI_PERSON_SRVNO=031001
	//siren.lottembrsauth.srvreqno.ipin=013002
	//siren.lottembrsauth.srvid.mble=SLTD001
	//siren.lottembrsauth.srvid.ipin=LTD002
    
//	if(returnDomain.indexOf(LotteUtil.SITE_URL_ELLOTTE) >= 0 ) {
//		
//		
//	}
    
	String exVar    = "0000000000000000";                                       // 복호화용 임시필드
	// ellotte_jklee16
    String retUrl1   = systemUrl+"/sci/pcc_V3_popup_seed.jsp?returnDomain="+returnDomain+"&certSelGb=H";                    // HandPhone 본인실명확인 결과수신 URL
    
    String retUrl2   = systemUrl+"/sci/pcc_V3_popup_seed.jsp?returnDomain="+returnDomain+"&certSelGb=I";                    // ipin 본인실명확인 결과수신 URL
    
	
    String certDate	= day;                         								// 본인실명확인 요청시간
	String certGb1	= "H";                           							// HandPhone 본인실명확인 본인확인 인증수단
	String certGb2	= "I";                           							// ipin 본인실명확인 본인확인 인증수단
	
	//String addVar	= URLEncoder.encode("schema="+sci_schema+(backUrl.equals("")?"":"&backUrl="+backUrl), "UTF-8");             // 본인실명확인 추가 파라메터
	String addVar	= URLEncoder.encode("schema="+sci_schema, "UTF-8");
	/**
	*
	* reqNum 값은 최종 결과값 복호화를 위한 SecuKey로 활용 되므로 중요합니다.
	* reqNum 은 본인 확인 요청시 항상 새로운 값으로 중복 되지 않게 생성 해야 합니다.
	* 쿠키 또는 Session및 기타 방법을 사용해서 reqNum 값을 
	* pcc_V3_result_seed.jsp에서 가져 올 수 있도록 해야 함.
	* 샘플을 위해서 쿠키를 사용한 것이므로 참고 하시길 바랍니다.
	*
	*/

    //01. 암호화 모듈 선언
	com.sci.v2.pcc.secu.SciSecuManager seed1  = new com.sci.v2.pcc.secu.SciSecuManager();
	com.sci.v2.ipin.secu.SciSecuManager seed2 = new com.sci.v2.ipin.secu.SciSecuManager();

	//02. 1차 암호화
	String encStr1 = "";
	String reqInfo1      = id1+"^"+srvNo1+"^"+reqNum+"^"+certDate+"^"+certGb1+"^"+addVar+"^"+exVar;  // 데이터 암호화
	encStr1              = seed1.getEncPublic(reqInfo1);

	String encStr2 = "";
	//reqNum = reqNum.substring(4);
	String reqInfo2      = reqNum+"/"+id2+"/"+srvNo2+"/"+exVar;  // 데이터 암호화
	encStr2              = seed2.getEncPublic(reqInfo2);
	//03. 위변조 검증 값 생성
	com.sci.v2.pcc.secu.hmac.SciHmac hmac1 = new com.sci.v2.pcc.secu.hmac.SciHmac();
	com.sci.v2.ipin.secu.hmac.SciHmac hmac2 = new com.sci.v2.ipin.secu.hmac.SciHmac();
	String hmacMsg1 = hmac1.HMacEncriptPublic(encStr1);
	String hmacMsg2 = hmac2.HMacEncriptPublic(encStr2);

	//03. 2차 암호화
	reqInfo1  = seed1.getEncPublic(encStr1 + "^" + hmacMsg1 + "^" + "0000000000000000");  //2차암호화
	reqInfo2  = seed2.getEncPublic(encStr2 + "/" + hmacMsg2 + "/" + "00000000");  //2차암호화
	
	// 로그인 폼으로 돌아가기
	// ellotte_jklee16
	String return_url = sci_schema+"://"+systemUrl+"/sci/dotcom_return.jsp";

	// 롯데닷컴 Stage Secure 테스트를 위한 임시처리
	if (returnDomain.indexOf(LotteUtil.SITE_URL_LOTTE) >= 0 && systemUrl.equals("mo.lotte.com") && sci_schema.equals("http") && request.isSecure()) {
		return_url = "https://"+systemUrl+"/sci/dotcom_return.jsp";
	}
%>

<script>  
<!--
	// 화면 오픈 시 (submit() 함수 사용 시 무한 루프)
	function go(tp){
		if ('<%=backUrl %>'!=''){
	        sessionStorage.setItem('sci_backUrl', '<%=backUrl %>');
	    }
	    var targetUrl; 
	    //var PCC_window = window.open('', 'PCCV3Window', 'width=430, height=560, resizable=1, scrollbars=no, status=0, titlebar=0, toolbar=0, left=300, top=200' );
	    
	    if(tp == "H"){
			targetUrl = 'https://pcc.siren24.com/pcc_V3/jsp/pcc_V3_j10.jsp';
	    	$("input[name=reqInfo]").val('<%=reqInfo1 %>');
	    	$("input[name=retUrl]").val(('https:' == document.location.protocol ? '32https://' : '32http://')+'<%=retUrl1 %>');
	    	$("input[name=para1]").val('H');

	    }else{
	    	targetUrl = "https://ipin.siren24.com/i-PIN/jsp/ipin_j10.jsp";
	    	$("input[name=reqInfo]").val('<%=reqInfo2 %>');
	    	$("input[name=retUrl]").val(('https:' == document.location.protocol ? '23https://' : '23http://')+'<%=retUrl2 %>');
	    	$("input[name=para1]").val('I');

	    }

		// 모바일 입력형 옵션상품 비회원 주문오류 테스트(로컬) - start
    	var sci_param = localStorage.getItem('sci_param');
		if( sci_param != null && sci_param != "" ) {
	    	var form_param = JSON.parse(sci_param); // 주문서로 전달하기 위한 파라메터
	    	if( form_param != null && form_param != "" ) {
		    	for(var key in form_param) {
		    		if(key == 'goods_choc_desc' || key.indexOf("opt_input_value") > -1) {
		    			console.log("key : [" + key + "]  decodeURICompent value : [" + decodeURIComponent(form_param[key]) + "] \n");
		    		} else {
		    			console.log("key : [" + key + "]  value : [" + form_param[key] + "] \n");
		    		}
		    	} // end of for
	    	}
		}
		// 모바일 입력형 옵션상품 비회원 주문오류 테스트(로컬) - end

	    //alert($("input[name=retUrl]").val());
	    //mdrsFrm.location.href = targetUrl;
	    $('#mdrsFrm').attr('src', targetUrl);
	    console.log($('#mdrsFrm').attr('src'));
	    console.log($("input[name=retUrl]").val());
	    $('#mdrsFrm').show();
	    document.reqPCCForm.action = targetUrl;
	    document.reqPCCForm.target = 'mdrsFrm';
	    document.reqPCCForm.submit();
	    //document.reqPCCForm.action = 'https://pcc.siren24.com/pcc_V3/jsp/pcc_V3_j10.jsp';
	 	//document.reqPCCForm.target = 'PCCV3Window';
	    //document.reqPCCForm.submit();

	}

	// 팝업 띄우기 (onload에서 호출 시 빈 페이지 출력)
    function openPCCWindow(){
		
        var PCC_window = window.open('', 'PCCV3Window', 'width=430, height=560, resizable=1, scrollbars=no, status=0, titlebar=0, toolbar=0, left=300, top=200' );

        if(PCC_window == null){ 
			 alert(" ※ 팝업이 차단된 경우 팝업허용을 해주시기 바랍니다.");	
			 go_loginForm();
			 return false;	
        }else{
			if ('<%=backUrl %>'!=''){
               sessionStorage.setItem('sci_backUrl', '<%=backUrl %>');
            }

	        document.reqPCCForm.action = 'https://pcc.siren24.com/pcc_V3/jsp/pcc_V3_j10.jsp';
        	document.reqPCCForm.target = 'PCCV3Window';

        	document.getElementById('container').style.display = 'block';
        }

        return true;
    }	

    // 로그인 폼으로 이동
    //function go_loginForm(){
    //	location.href = "<%=return_url + (backUrl.equals("")?(LotteUtil.boolAppInstall(uagent)||LotteUtil.boolAndroid(uagent)?"?":""):"?backUrl="+backUrl) %>";
    //}
    function closeIframe(){
    	$('#mdrsFrm').hide();
    }

    function resultGo(result, birYMD){
		var backUrl = getBackUrl();
		var hrefUrl;

		if (result == "Y"){
			hrefUrl = '<%=return_url%>';
			hrefUrl = hrefUrl + '?confirm_yn=' + result + '&bir_date=' + birYMD + (backUrl==''?'':'&backUrl='+backUrl);

			location.href = hrefUrl;
		}else{
			alert("인증에 실패 하였습니다.");
			//document.getElementById("btn_div").style.display = "block";
		}
		closeIframe();
		//window.parent.closeIframe();
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
<section>
	<div class="checkPerson">
		<div class="wrap">
			<%if(!"".equals(LotteUtil.getCookieValue(request, "loginId"))){ %>
			<p class="txt19">19세 미만의 청소년에게 접근이 제한된 정보입니다.<br><strong>본인인증 후 이용이 가능합니다.</strong></p>
			<p class="txt">
				본 정보는 청소년 유해매체물로써 정보통신망이용촉진 및 정보보호 등에
				관한 법률 및 청소년보호법의 규정에 의하여 본인 확인 이후 사용 하실 수 
				있습니다.
			</p>
			<%}else{ %>
			<p class="txtNoMem">
				비회원 주문을 위한 본인인증이 필요합니다.
			</p>
			 <%} %>
			<div class="buttonWrap">
				<ul>
					<li class="phone"><span></span><a href="javascript:go('H');">휴대폰 본인인증</a></li>
					<li class="ipin"><span></span><a href="javascript:go('I');">아이핀 본인인증</a></li>
				</ul>
			</div>
		</div>
	</div>
	<!-- 본인실명확인서비스 요청 form --------------------------->
	<div style="display:none">
		<form name="reqPCCForm" method="post" action="">
			<input type="hidden" name="reqInfo" value="">
			<input type="hidden" name="retUrl" value="">
			<input type="hidden" name="para1"  value = "">
			<input type="submit" id="submit_btn" value="인증">
		</form>
	</div>
	<!--End 본인실명확인서비스 요청 form ----------------------->
</section>

<iframe id="mdrsFrm" name="mdrsFrm" src="" frameborder="0"></iframe>
<form id="frm_send" name="frm_send" method="post" action="">
</form>
