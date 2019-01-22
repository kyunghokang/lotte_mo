<%@ page import="com.lotte.mobile.common.util.LotteUtil"%>
<%@ page import="com.lotte.mobile.common.ConstCode"%>
<script>
<%
// mo.properties 중 javascript 전역변수로 정의해야할 사항
// HOST_API : MAPI URL (ex: http://mapi.lotte.com, http://mapilocal.lotte.com), 기존 mo가 fo에 API로 호출하는 URL
// HOST_SSL_API : MAPI Seurce URL(ex: https://mapi.lotte.com, https://mapilocal.lotte.com), 신규 angular에서 주문/마이페이지를 호출하는 https url
// HOST_MOBILE : lotte mobile URL(ex: http://m.lotte.com, http://molocal.lotte.com), https 에서  명시적으로 http를 호출할 때 사용
// HOST_SSL : lotte mobile secure URL(ex: https://m.lotte.com, https://molocal.lotte.com), http에서 명시적으로 https를 호출할 때 사용
// PC_HOST_WEB : 기존 운영팀에서 fo에 json 호출을 하기 위해 사용(ex: http://www.lotte.com, http://fo.lotte.com)

//ConstCode.ST_STD_CD_PAY_MEAN_CD_L_POINT :L-포인트
//ConstCode.ST_STD_CD_PAY_MEAN_CD_LOTTE_POINT :롯데포인트
//ConstCode.ST_STD_CD_PAY_MEAN_CD_DEPOSIT :회원보관금
//DEFAULT_LATE_VIEW_GOODS_COUNT; // 최근본 상품 수
%>
var LOTTE_CONSTANTS = [];
LOTTE_CONSTANTS['MAPI_HOST_API'] = "<%=com.lotte.mobile.common.MLotteProperties.get( "MAPI_URL" ).toString()%>";
LOTTE_CONSTANTS['MAPI_HOST_SSL_API'] = "<%=com.lotte.mobile.common.MLotteProperties.get( "MAPI_SSL_URL" ).toString()%>";
LOTTE_CONSTANTS['M_HOST_MOBILE'] = "<%=com.lotte.mobile.common.MLotteProperties.get( "HOST_MOBILE" ).toString()%>";
LOTTE_CONSTANTS['M_HOST_SSL'] = "<%=com.lotte.mobile.common.MLotteProperties.get( "HOST_SSL" ).toString()%>";
LOTTE_CONSTANTS['PC_HOST_WEB'] = "<%=com.lotte.mobile.common.MLotteProperties.get( "HOST_WEB" ).toString()%>";

// 1차분 호환성을 위해 중복 정의
var MAPI_HOST_API = LOTTE_CONSTANTS['MAPI_HOST_API'];
var MAPI_HOST_SSL_API = LOTTE_CONSTANTS['MAPI_HOST_SSL_API'];
var M_HOST_MOBILE = LOTTE_CONSTANTS['M_HOST_MOBILE'];
var M_HOST_SSL = LOTTE_CONSTANTS['M_HOST_SSL'];
var PC_HOST_WEB = LOTTE_CONSTANTS['PC_HOST_WEB'];

LOTTE_CONSTANTS['SPLIT_GUBUN_1'] = "<%=LotteUtil.SPLIT_GUBUN_1%>"; 
LOTTE_CONSTANTS['SPLIT_GUBUN_3'] = "<%=LotteUtil.SPLIT_GUBUN_3%>"; 
LOTTE_CONSTANTS['ONENONE_BUY_LOGIN'] = "<%=LotteUtil.ONENONE_BUY_LOGIN%>"; 
LOTTE_CONSTANTS['IMALL_BUY_LOGIN'] = "<%=LotteUtil.IMALL_BUY_LOGIN%>";
LOTTE_CONSTANTS['ST_STD_CD_PAY_MEAN_CD_L_POINT'] = "<%=ConstCode.ST_STD_CD_PAY_MEAN_CD_L_POINT%>";
LOTTE_CONSTANTS['ST_STD_CD_PAY_MEAN_CD_LOTTE_POINT'] = "<%=ConstCode.ST_STD_CD_PAY_MEAN_CD_LOTTE_POINT%>";
LOTTE_CONSTANTS['ST_STD_CD_PAY_MEAN_CD_DEPOSIT'] = "<%=ConstCode.ST_STD_CD_PAY_MEAN_CD_DEPOSIT%>";
LOTTE_CONSTANTS['DEFAULT_LATE_VIEW_GOODS_COUNT'] = "<%=LotteUtil.DEFAULT_LATE_VIEW_GOODS_COUNT%>";

</script>

<%
boolean LOTTE_DEVEL_MODE = false;
String get_lotte_devel = request.getParameter("resources_dev") == null ? "" : request.getParameter("resources_dev");
if ("true".equals(get_lotte_devel)) {
	LOTTE_DEVEL_MODE = true;
}
LOTTE_DEVEL_MODE = true;
%>