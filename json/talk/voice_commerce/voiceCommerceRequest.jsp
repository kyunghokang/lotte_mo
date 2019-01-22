<%@ page language="java" contentType="application/json; charset=utf-8" %>
<%
String mbrNo		= request.getParameter("mbrNo");
String qType		= request.getParameter("qType");
String screen		= request.getParameter("screen");
String text			= request.getParameter("text");
String preReqParam	= request.getParameter("preReqParam");
/*
* data: {
*  responseCode: 결과코드
*  responseMsg: 결과메시지
*  basicVoiceMent: 기본 음성 멘트
*  homeScreenMent: 홈 화면 멘트
*  topScreenMent: 상단 화면 멘트
*  queryMent: 질의멘트
*  command: 명령어 텍스트
*  commandVal: 음성 발화 추가 데이터 (옵션변경해줘: yes|no, 옵션바꿔줘: 1,2,3,4,5,6,7,8,9,10...)
*  preReqParam: 결과를 호출하기 위해 사용한 URL
*  goodsNoList: 검색된 상품 리스트 정보
*  analysisData: 의미분석을 위해 사용된 data (챗봇서버 디버그 용도임)
*  recommendData: 의미분석을 통해 식별된 추천용 분석 정보 (챗봇서버 디버그 용)
*  commandNumber : 숫자
*  commandDate  일 
*  commandDayOfWeek 요일
*  commandPeriod 기간
*  commandMonth 달
* }

REPLACE
analysisData":"(.*)","requestUrl
analysisData":"","requestUrl
*/
%>

<%

switch(text){

case "처음으로":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"actionFirst","homeScreenMent":"","topScreenMent":"","queryMent":"","command":"actionFirst","commandVal":"처음화면_이동","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"","goodsNoList":"","recommendData":"","analysisData":"","requestUrl":""}
	<%
	break;

case "출석체크":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"goAttCheckEvent","homeScreenMent":"","topScreenMent":"","queryMent":"","command":"goAttCheckEvent","commandVal":"출석체크_이벤트","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"","goodsNoList":"","recommendData":"","analysisData":"[{\"reqid\":\"0\",\"kma\":\"출석/NNG+체크/NFG\",\"lsp\":\"출석+체크\",\"ner\":\"출석체크\",\"filterSF\":{\"SFName\":\"\",\"SFEntry\":\"\"},\"info\":{\"lspid\":\"75211\",\"conceptid\":\"379 \\u003e 418 \\u003e 419\",\"conceptcodes\":\"일상대화 \\u003e 이벤트 \\u003e D_이벤트1\",\"conceptlabel\":\"일상대화 \\u003e 이벤트 \\u003e 이벤트1\",\"lspattributes\":[{\"id\":\"486\",\"name\":\"일반\"}],\"lspweight\":\"1\"},\"sentence\":{\"string\":\"출석체크\",\"offset\":\"0\",\"index\":\"0\"},\"matched_text\":{\"string\":\"출석체크\",\"begin\":\"0\",\"end\":\"8\"},\"variables\":[],\"categories\":[]},{\"reqid\":\"0\",\"kma\":\"출석/NNG+체크/NFG\",\"lsp\":\"출석+체크\",\"ner\":\"출석체크\",\"filterSF\":{\"SFName\":\"\",\"SFEntry\":\"\"},\"info\":{\"lspid\":\"75476\",\"conceptid\":\"1 \\u003e 601\",\"conceptcodes\":\"명령어 \\u003e C_출석체크_이벤트\",\"conceptlabel\":\"명령어 \\u003e 출석체크_이벤트\",\"lspattributes\":[{\"id\":\"486\",\"name\":\"일반\"}],\"lspweight\":\"1\"},\"sentence\":{\"string\":\"출석체크\",\"offset\":\"0\",\"index\":\"0\"},\"matched_text\":{\"string\":\"출석체크\",\"begin\":\"0\",\"end\":\"8\"},\"variables\":[],\"categories\":[]}]","requestUrl":""}
	<%
	break;

case "포인트":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"getPoint","homeScreenMent":"","topScreenMent":"","queryMent":"","command":"getPoint","commandVal":"포인트_보기","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"","goodsNoList":"","recommendData":"","analysisData":"[{\"reqid\":\"0\",\"kma\":\"포인트/NFG\",\"lsp\":\"포인트\",\"ner\":\"포인트\",\"filterSF\":{\"SFName\":\"\",\"SFEntry\":\"\"},\"info\":{\"lspid\":\"13734\",\"conceptid\":\"1 \\u003e 374\",\"conceptcodes\":\"명령어 \\u003e C_포인트_보기\",\"conceptlabel\":\"명령어 \\u003e 포인트_보기\",\"lspattributes\":[{\"id\":\"101\",\"name\":\"일반\"}],\"lspweight\":\"1\"},\"sentence\":{\"string\":\"포인트\",\"offset\":\"0\",\"index\":\"0\"},\"matched_text\":{\"string\":\"포인트\",\"begin\":\"0\",\"end\":\"6\"},\"variables\":[],\"categories\":[]}]","requestUrl":""}
	<%
	break;

case "원피스 추천해줘":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"원피스 길이는 어느정도 생각하세요?","homeScreenMent":"원피스 길이는 어느정도 생각하세요?@롱원피스#미디원피스#미니원피스#다보여줘","topScreenMent":"","queryMent":"","command":"getManagementItem","commandVal":"","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"talkId\u003d2\u0026groupId\u003d1\u0026firstManagementItem\u003d원피스\u0026managementItemCd\u003d016","goodsNoList":"","recommendData":"{\"ageValue\":null,\"ageLabel\":null,\"age\":null,\"genderValue\":null,\"genderLabel\":null,\"gender\":null,\"noAgeNoGender\":false,\"best\":false,\"priceVariableName\":null,\"priceVariableValue\":null,\"priceMin\":0,\"priceMax\":0,\"priceOnly\":false,\"shoeSizeValue\":null,\"firstManagementItem\":\"원피스\",\"managementItem\":\"원피스\",\"managementItemCd\":\"016\",\"managementItemQuestion\":\"원피스 길이는 어느정도 생각하세요?@롱원피스#미디원피스#미니원피스#다보여줘\",\"managementItemSearchWord\":null,\"managementItemComboSearchWordExposure\":null,\"situationKeyword\":null,\"situationKeywordCd\":null,\"situationKeywordQuestion\":null,\"situationKeywordSearchWord\":null,\"eventItem\":null,\"brandValue\":null,\"brandNo\":null,\"keyword\":null,\"colorValue\":null,\"colorLabel\":null,\"color\":null,\"colorOnly\":false,\"sort\":null,\"freeDeliYN\":null,\"freeInstYN\":null,\"pointYN\":null,\"pkgYN\":null,\"delTdarYN\":null,\"delQuickYN\":null,\"deliveryAndBenefitOnly\":false,\"multiCondition\":false,\"deliveryAndBenefit\":false,\"searchType\":null}","analysisData":"","requestUrl":""}
	<%
	break;

case "롱원피스":
case "미디원피스":
case "미니원피스":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"패턴은 어떤 걸로 찾으세요?","homeScreenMent":"패턴은 어떤 걸로 찾으세요?@체크#플라워#스트라이프#다보여줘","topScreenMent":"","queryMent":"","command":"getManagementItem","commandVal":"","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"talkId\u003d8\u0026groupId\u003d2\u0026firstManagementItem\u003d원피스\u0026managementItemCd\u003d01601","goodsNoList":"","recommendData":"{\"ageValue\":null,\"ageLabel\":null,\"age\":null,\"genderValue\":null,\"genderLabel\":null,\"gender\":null,\"noAgeNoGender\":false,\"best\":false,\"priceVariableName\":null,\"priceVariableValue\":null,\"priceMin\":0,\"priceMax\":0,\"priceOnly\":false,\"shoeSizeValue\":null,\"firstManagementItem\":\"원피스\",\"managementItem\":\"롱원피스\",\"managementItemCd\":\"01601\",\"managementItemQuestion\":\"패턴은 어떤 걸로 찾으세요?@체크#플라워#스트라이프#다보여줘\",\"managementItemSearchWord\":null,\"managementItemComboSearchWordExposure\":null,\"situationKeyword\":null,\"situationKeywordCd\":null,\"situationKeywordQuestion\":null,\"situationKeywordSearchWord\":null,\"eventItem\":null,\"brandValue\":null,\"brandNo\":null,\"keyword\":null,\"colorValue\":null,\"colorLabel\":null,\"color\":null,\"colorOnly\":false,\"sort\":null,\"freeDeliYN\":null,\"freeInstYN\":null,\"pointYN\":null,\"pkgYN\":null,\"delTdarYN\":null,\"delQuickYN\":null,\"deliveryAndBenefitOnly\":false,\"multiCondition\":false,\"deliveryAndBenefit\":false,\"searchType\":null}","analysisData":"","requestUrl":""}
	<%
	break;

case "체크":
case "플라워":
case "스트라이프":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"체크롱원피스 추천해드려요.","homeScreenMent":"체크롱원피스 추천해드려요.","topScreenMent":"체크롱원피스 추천해드려요.","queryMent":"","command":"getManagementItem","commandVal":"","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"talkId\u003d2\u0026groupId\u003d3\u0026keyword\u003d체크롱원피스\u0026firstManagementItem\u003d원피스\u0026searchType\u003dT","goodsNoList":"570616943,589865153,593102045,593483993,593007970,593136767,593159457,587246866,578280491,584465263,592839253,592676515,495724862,569460323,593132030,593024611,563605931,578331125,592725713,585727859,577777920,592669542,561200888,593105440,593136770,572236222,590350995,581044302,567405625,587294126,572321012,529203718,502829257,512822681,510699431,577405849,570047012,587868577,590026831,587868600","recommendData":"{\"ageValue\":null,\"ageLabel\":null,\"age\":null,\"genderValue\":null,\"genderLabel\":null,\"gender\":null,\"noAgeNoGender\":false,\"best\":false,\"priceVariableName\":null,\"priceVariableValue\":null,\"priceMin\":0,\"priceMax\":0,\"priceOnly\":false,\"shoeSizeValue\":null,\"firstManagementItem\":\"원피스\",\"managementItem\":\"체크\",\"managementItemCd\":\"0160101\",\"managementItemQuestion\":null,\"managementItemSearchWord\":\"체크롱원피스\",\"managementItemComboSearchWordExposure\":null,\"situationKeyword\":null,\"situationKeywordCd\":null,\"situationKeywordQuestion\":null,\"situationKeywordSearchWord\":null,\"eventItem\":null,\"brandValue\":null,\"brandNo\":null,\"keyword\":\"체크롱원피스\",\"colorValue\":null,\"colorLabel\":null,\"color\":null,\"colorOnly\":false,\"sort\":null,\"freeDeliYN\":null,\"freeInstYN\":null,\"pointYN\":null,\"pkgYN\":null,\"delTdarYN\":null,\"delQuickYN\":null,\"deliveryAndBenefitOnly\":false,\"multiCondition\":false,\"deliveryAndBenefit\":false,\"searchType\":\"T\"}","analysisData":"","requestUrl":"http://m.lotte.com/json/talk/talk_goods_list.json?searchType\u003dT\u0026keyword\u003d체크롱원피스"}
	<%
	break;

case "자세히":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"actionDetail","homeScreenMent":"","topScreenMent":"","queryMent":"","command":"actionDetail","commandVal":"자세히","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"","goodsNoList":"","recommendData":"","analysisData":"","requestUrl":""}
	<%
	break;

case "스타일추천":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"getStyle","homeScreenMent":"","topScreenMent":"","queryMent":"","command":"getStyle","commandVal":"스타일_추천","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"","goodsNoList":"","recommendData":"","analysisData":"[","requestUrl":""}
	<%
	break;

case "이전으로":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"actionBack","homeScreenMent":"","topScreenMent":"","queryMent":"","command":"actionBack","commandVal":"이전페이지_이동","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"","goodsNoList":"","recommendData":"","analysisData":"","requestUrl":""}
	<%
	break;

case "응":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"actionYesNo","homeScreenMent":"","topScreenMent":"","queryMent":"","command":"actionYesNo","commandVal":"Y","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"","goodsNoList":"","recommendData":"","analysisData":"[{\"reqid\":\"0\",\"kma\":\"응/IC\",\"lsp\":\"$KEYWORD\\u003d@키워드_all+(/J_)?\",\"ner\":\"응\",\"filterSF\":{\"SFName\":\"\",\"SFEntry\":\"\"},\"info\":{\"lspid\":\"13765\",\"conceptid\":\"378\",\"conceptcodes\":\"사만다\",\"conceptlabel\":\"사만다\",\"lspattributes\":[{\"id\":\"101\",\"name\":\"일반\"}],\"lspweight\":\"1\"},\"sentence\":{\"string\":\"응\",\"offset\":\"0\",\"index\":\"0\"},\"matched_text\":{\"string\":\"응\",\"begin\":\"0\",\"end\":\"2\"},\"variables\":[{\"name\":\"KEYWORD\",\"value\":\"응\"}],\"categories\":[{\"label\":\"키워드_all\",\"entries\":[\"(@키워드_긍정[L])\"]},{\"label\":\"키워드_긍정\",\"entries\":[\"응[L]\"]}]},{\"reqid\":\"0\",\"kma\":\"응/IC\",\"lsp\":\"응\",\"ner\":\"응\",\"filterSF\":{\"SFName\":\"\",\"SFEntry\":\"\"},\"info\":{\"lspid\":\"13179\",\"conceptid\":\"1 \\u003e 78\",\"conceptcodes\":\"명령어 \\u003e C_답변_긍정\",\"conceptlabel\":\"명령어 \\u003e 답변_긍정\",\"lspattributes\":[{\"id\":\"101\",\"name\":\"일반\"}],\"lspweight\":\"1\"},\"sentence\":{\"string\":\"응\",\"offset\":\"0\",\"index\":\"0\"},\"matched_text\":{\"string\":\"응\",\"begin\":\"0\",\"end\":\"2\"},\"variables\":[],\"categories\":[]}]","requestUrl":""}
	<%
	break;

case "아니":
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"actionYesNo","homeScreenMent":"","topScreenMent":"","queryMent":"","command":"actionYesNo","commandVal":"N","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"","goodsNoList":"","recommendData":"","analysisData":"[{\"reqid\":\"0\",\"kma\":\"응/IC\",\"lsp\":\"$KEYWORD\\u003d@키워드_all+(/J_)?\",\"ner\":\"응\",\"filterSF\":{\"SFName\":\"\",\"SFEntry\":\"\"},\"info\":{\"lspid\":\"13765\",\"conceptid\":\"378\",\"conceptcodes\":\"사만다\",\"conceptlabel\":\"사만다\",\"lspattributes\":[{\"id\":\"101\",\"name\":\"일반\"}],\"lspweight\":\"1\"},\"sentence\":{\"string\":\"응\",\"offset\":\"0\",\"index\":\"0\"},\"matched_text\":{\"string\":\"응\",\"begin\":\"0\",\"end\":\"2\"},\"variables\":[{\"name\":\"KEYWORD\",\"value\":\"응\"}],\"categories\":[{\"label\":\"키워드_all\",\"entries\":[\"(@키워드_긍정[L])\"]},{\"label\":\"키워드_긍정\",\"entries\":[\"응[L]\"]}]},{\"reqid\":\"0\",\"kma\":\"응/IC\",\"lsp\":\"응\",\"ner\":\"응\",\"filterSF\":{\"SFName\":\"\",\"SFEntry\":\"\"},\"info\":{\"lspid\":\"13179\",\"conceptid\":\"1 \\u003e 78\",\"conceptcodes\":\"명령어 \\u003e C_답변_긍정\",\"conceptlabel\":\"명령어 \\u003e 답변_긍정\",\"lspattributes\":[{\"id\":\"101\",\"name\":\"일반\"}],\"lspweight\":\"1\"},\"sentence\":{\"string\":\"응\",\"offset\":\"0\",\"index\":\"0\"},\"matched_text\":{\"string\":\"응\",\"begin\":\"0\",\"end\":\"2\"},\"variables\":[],\"categories\":[]}]","requestUrl":""}
	<%
	break;

default:
	%>
	{"responseCode":"00000","responseMsg":"","basicVoiceMent":"","homeScreenMent":"","topScreenMent":"","queryMent":"","command":"talk","commandVal":"","commandNumber":"","commandQuantity":"","commandNewProductName":"","commandMonth":"","commandDate":"","commandDayOfWeek":"","commandPeriod":"","commandCard":"","preReqParam":"","goodsNoList":"","recommendData":"","analysisData":"","requestUrl":""}
	<%
	break;
}
%>