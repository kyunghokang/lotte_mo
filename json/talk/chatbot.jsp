<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%
String talk_cmd			= request.getParameter("command");
String talk_text		= request.getParameter("text");
String talk_type		= request.getParameter("type");
String talk_group_id	= request.getParameter("group_id");
String talk_item_no		= request.getParameter("item_no");
String talk_option_title	= request.getParameter("option_title");
String talk_option_value	= request.getParameter("option_value");
String talk_ctgNo	= request.getParameter("ctgNo");
boolean talk_showRelkey = true;
boolean talk_no_opt = false;//	= talk_item_no == null || talk_item_no.equals("");

java.text.DateFormat talk_df = new java.text.SimpleDateFormat("yyyyMMddHHmmss");
String talk_date_str = talk_df.format(new java.util.Date());
String talk_gid = talk_date_str.substring(0, 12);

int talk_r, talk_rndno;
String talk_emo, talk_txt, talk_msg, talk_msg2;
%>
{
	"err_cd" : "0000",
	"err_msg" : "",
	"data" : {
	
	<%
	//////////////////////////////////////// 그룹 목록 구하기
	if(talk_cmd.equals("getGroups")){
	%>
	"total_count" : 2,
	"group_list" : [
		{
			"date"		: "20170608092438",
			"group_id"	: "11111",
			"count"		: "5"
		},{
			"date"		: "20170712091124",
			"group_id"	: "22222",
			"count"		: "5"
		}
	]
	
	<%
	//////////////////////////////////////// 대화 목록 구하기
	}else if(talk_cmd.equals("getTalks")){
		talk_rndno = (int) ((Math.random() * 10) + 1);
	%>
	"total_count" : <%= talk_rndno %>,
	"talk_list" : [
		<% if(talk_group_id.equals("11111")){ %>
		{
			"date"		: "20170608092438",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>1",
			"auth"		: "A",
			"img_url"	: "http://image.lotte.com/lotte/mo2017/talk/01_hello.png",
			"text"		: ""
		},{
			"date"		: "20170608092438",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>2",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "혜민님, 반가워요! 저는 사만다에요. 혜민님이 원하는 추천해줄 쇼핑친구라고 편하게 생각하세요~"
		},{
			"date"		: "20170608092438",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>3",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "립스틱"
		},{
			"date"		: "20170608092438",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>4",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "생일선물"
		},{
			"date"		: "20170608092438",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>5",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "닥스지갑"
		},{
			"date"		: "20170608092438",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>6",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "이렇게 간단한 단어만 보내도 사만다가 상품을 추천해 드려요!"
		}
		<% }else if(talk_group_id.equals("22222")){ %>
		{
			"date"		: "20170611091124",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>1",
			"auth"		: "U",
			"img_url"	: "http://image.lotte.com/upload/display/corner/5545415_47355_0_30_13008656_73.jpg",
			"text"		: ""
		},{
			"date"		: "20170611091124",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>2",
			"auth"		: "U",
			"img_url"	: "",
			"text"		: "이미지 폭 100%"
		},{
			"date"		: "20170611091124",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>3",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "어떤 상품을 추천 받고 싶은지 말해주면 내가 찾아볼게"
		},{
			"date"		: "20170611221124",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>4",
			"auth"		: "U",
			"img_url"	: "",
			"text"		: "이미지 높이 260으로 제한"
		},{
			"date"		: "20170611221124",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>5",
			"auth"		: "U",
			"img_url"	: "http://image.lotte.com/lotte/images/02CardPoint/201706/lpayfestival_mo_01.jpg",
			"text"		: ""
		},{
			"date"		: "20170611221124",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>6",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "어떤 상품을 추천 받고 싶은지 말해주면 내가 찾아볼게"
		}
		<% }else{ %>
		{
			"date"		: "20170611091124",
			"group_id"	: "<%=talk_group_id%>",
			"talk_id"	: "<%=talk_group_id%>1",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "ㄷㄷㄷ"
		}
		<% } %>
	]
	
	
	<%
	//////////////////////////////////////// 새 추천 시작하기
	}else if(talk_cmd.equals("startGroup")){
		if(talk_type.equals("T")){
	%>
	"total_count" : 2,
	"talk_list" : [
		{
			"date"		: "<%=talk_date_str%>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>1",
			"auth"		: "U",
			"text"		: "대화하며 상품추천"
		},{
			"date"		: "<%=talk_date_str%>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>2",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "혜민님, 반가워요! 저는 사만다에요. 혜민님이 원하는 추천해줄 쇼핑친구라고 편하게 생각하세요~"
		},{
			"date"		: "<%=talk_date_str%>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>3",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "립스틱"
		},{
			"date"		: "<%=talk_date_str%>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>4",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "생일선물"
		},{
			"date"		: "<%=talk_date_str%>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>5",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "닥스지갑"
		},{
			"date"		: "<%=talk_date_str%>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>6",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "이렇게 간단한 단어만 보내도 사만다가 상품을 추천해 드려요!"
		}
	]
	
	<%
	}
	
	
	//////////////////////////////////////// 메시지 전송
	}else if(talk_cmd.equals("sendTalk")){
		boolean useEmoticon = false;
		boolean isCategory = talk_text.equals("나이키");
		talk_emo = "";
		talk_txt = "";
		if(talk_text.equals("비속어")){
			talk_emo = "http://image.lotte.com/lotte/mo2017/talk/04_restrict.png";
			talk_txt = "그런 말을 들으면... 저는 맘이 여려서 견딜 수가 없어요...";
			useEmoticon = true;
		}else if(talk_text.equals("무의미1")){
			talk_text = "추천을 시작하기 전 의미없는 단어 전송";
			talk_emo = "http://image.lotte.com/lotte/mo2017/talk/02_norecognation.png";
			talk_txt = "혜민님...... 사만다가 이해하기에 너무 어려운 말이에요...";
			useEmoticon = true;
		}else if(talk_text.equals("무의미2")){
			talk_text = "(카테고리탐색) 선택항목 필요시 의미없는 단어 전송";
			talk_emo = "http://image.lotte.com/lotte/mo2017/talk/04_restrict.png";
			talk_txt = "혜민님...... 사만다가 이해하기에 너무 어려운 말이에요...";
			useEmoticon = true;
		}else if(talk_text.equals("결과없음")){
			talk_text = "검색/탐색 결과 없음";
			talk_emo = "http://image.lotte.com/lotte/mo2017/talk/03_noresult.png";
			talk_txt = "혜민님, 죄송해요. 원하시는 상품이 없어요.<br/>사만다가 열심히 데이터를 쌓아서 다음에 꼭 추천해 드릴 수 있도록 연구할게요.";
			useEmoticon = true;
		}else if(talk_text.equals("가격대없음")){
			talk_text = "가격대 없음";
			talk_emo = "http://image.lotte.com/lotte/mo2017/talk/03_noresult.png";
			talk_txt = "혜민님, 죄송해요. 원하시는 가격대의 상품이 없어요.";
			useEmoticon = true;
		}
		
		if(useEmoticon){
	%>
	"total_count" : 3,
	"talk_list" : [
		{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>1",
			"auth"		: "U",
			"text"		: "<%=talk_text%>"
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>2",
			"auth"		: "A",
			"img_url"	: "<%=talk_emo%>",
			"text"		: ""
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>3",
			"auth"		: "A",
			"img_url"	: "",
			"text"		: "<%=talk_txt%>"
		}
	]
	<%
		}else{
	%>
	"total_count" : 2,
	"talk_list" : [
		{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>1",
			"auth"		: "U",
			"text"		: "<%=talk_text%>"
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>2",
			"auth"		: "A",
			"text"		: "이 상품들은 어때요?"
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>3",
			"auth"		: "A",
			"goods_no"	: [<%
			    talk_r = (int) ((Math.random() * 12) + 3);
				for(int i=0; i<talk_r; i++){
					talk_rndno = (int) ((Math.random() * 100000000) + 1);
					if(i>0){%>,<%}%>"<%=talk_rndno%>"<%
				}
			%>],
			"text"		: ""
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>2",
			"auth"		: "A",
			"text"		: "혹시 또 이런 거 찾고 있지는 않으세요?"
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>2",
			"auth"		: "A",
			"text"		: "키워드를 선택하면 알맞은 상품 또 추천해 드릴게요!",
			"option_list" : {
				"items" : [
					{
						"opt_title" : "reatedKeyword",
						"opt_value" : [
							{
								"opt_tval"		: "입생로랑",
								"opt_tval_cd"	: "입생로랑"
							},{
								"opt_tval"		: "디올",
								"opt_tval_cd"	: "디올"
							},{
								"opt_tval"		: "맥",
								"opt_tval_cd"	: "맥"
							},{
								"opt_tval"		: "슈에무라",
								"opt_tval_cd"	: "슈에무라"
							},{
								"opt_tval"		: "바비브라운",
								"opt_tval_cd"	: "바비브라운"
							},{
								"opt_tval"		: "에스티로더",
								"opt_tval_cd"	: "에스티로더"
							}
						]
					},{
						"opt_title" : "colors",
						"opt_value" : [
							{
								"opt_tval"		: "010",
								"opt_tval_cd"	: "010"
							},{
								"opt_tval"		: "030",
								"opt_tval_cd"	: "030"
							},{
								"opt_tval"		: "080",
								"opt_tval_cd"	: "080"
							},{
								"opt_tval"		: "090",
								"opt_tval_cd"	: "090"
							},{
								"opt_tval"		: "110",
								"opt_tval_cd"	: "110"
							},{
								"opt_tval"		: "120",
								"opt_tval_cd"	: "120"
							}
						]
					},{
						"opt_title" : "price",
						"opt_value" : [
							{
								"opt_tval"		: "10,000원 미만",
								"opt_tval_cd"	: "10000"
							},{
								"opt_tval"		: "10,000원 ~ 20,000원",
								"opt_tval_cd"	: "20000"
							},{
								"opt_tval"		: "20,000 ~ 50,000",
								"opt_tval_cd"	: "30000"
							},{
								"opt_tval"		: "50,000 ~ 100,000",
								"opt_tval_cd"	: "50000"
							},{
								"opt_tval"		: "100,000 ~ 500,000",
								"opt_tval_cd"	: "100000"
							},{
								"opt_tval"		: "500,000원 이상",
								"opt_tval_cd"	: "500000"
							}
						]
					},{
						"opt_title" : "smpDept",
						"opt_value" : [
							{
								"opt_tval"		: "전체",
								"opt_tval_cd"	: "1"
							},{
								"opt_tval"		: "본점",
								"opt_tval_cd"	: "1234"
							},{
								"opt_tval"		: "영등포점",
								"opt_tval_cd"	: "30000"
							},{
								"opt_tval"		: "여의도점",
								"opt_tval_cd"	: "50000"
							},{
								"opt_tval"		: "분당점",
								"opt_tval_cd"	: "100000"
							},{
								"opt_tval"		: "부산점",
								"opt_tval_cd"	: "500000"
							}
						]
					},{
						"opt_title" : "smpSeven",
						"opt_value" : []
					},{
						"opt_title" : "tdar",
						"opt_value" : []
					},{
						"opt_title" : "quick",
						"opt_value" : []
					},{
						"opt_title" : "freediv",
						"opt_value" : []
					},{
						"opt_title" : "noint",
						"opt_value" : []
					},{
						"opt_title" : "point",
						"opt_value" : []
					},{
						"opt_title" : "freepack",
						"opt_value" : []
					}
				]
			<% if(isCategory){ %>
			},
			"subCtgLst" : {
				"items" : [
					{
						"ctgNo" : "5416099",
						"ctgName" : "면원피스",
						"cnt" : 4960,
						"mall" : "롯데닷컴",
						"ctgDepth" : "3"
					},{
						"ctgNo" : "5416193",
						"ctgName" : "프린트원피스",
						"cnt" : 3337,
						"mall" : "롯데닷컴",
						"ctgDepth" : "3"
					},{
						"ctgNo" : "5416217",
						"ctgName" : "탑/민소매원피스",
						"cnt" : 2204,
						"mall" : "롯데닷컴",
						"ctgDepth" : "3"
					},{
						"ctgNo" : "5416112",
						"ctgName" : "쉬폰/레이스원피스",
						"cnt" : 1715,
						"mall" : "롯데닷컴",
						"ctgDepth" : "3"
					},{
						"ctgNo" : "5416242",
						"ctgName" : "정장원피스",
						"cnt" : 790,
						"mall" : "롯데닷컴",
						"ctgDepth" : "3"
					},{
						"ctgNo" : "5416141",
						"ctgName" : "니트원피스",
						"cnt" : 460,
						"mall" : "롯데닷컴",
						"ctgDepth" : "3"
					},{
						"ctgNo" : "5416123",
						"ctgName" : "새틴/실크원피스",
						"cnt" : 53,
						"mall" : "롯데닷컴",
						"ctgDepth" : "3"
					},{
						"ctgNo" : "5416170",
						"ctgNo" : "5416170",
						"ctgName" : "모직/트위드원피스",
						"cnt" : 32,
						"mall" : "롯데닷컴",
						"ctgDepth" : "3"
					}
				],
				"total_count" : 8
			<% } %>
			}
		}
	]
		<% } %>
	
	
	<%
	//////////////////////////////////////// 옵션 선택
	}else if(talk_cmd.equals("selectOption")){
		talk_r = (int) (Math.random() * 10000);
		//if((int) (Math.random() * 2) == 0){
			talk_showRelkey = false;
		//}
		
		talk_no_opt = talk_option_title.equals("subCtgLst") || talk_option_title.equals("colors") || talk_option_title.equals("price") || talk_option_title.equals("smpDept")
				|| talk_option_value.equals("smpSeven") || talk_option_value.equals("tdar") || talk_option_value.equals("quick")
				|| talk_option_value.equals("freediv") || talk_option_value.equals("noint") || talk_option_value.equals("point") || talk_option_value.equals("freepack");
		if(talk_no_opt){
			talk_msg2 = "혜민님을 위한 상품입니다. 둘러보세요.";
			talk_msg = "새 추천받기를 선택해주세요!";
		}else{
			talk_msg2 = "괜찮은 상품은 장바구니에 담아보세요.";
			talk_msg = "혜민님, 생각해둔 가격대는 있어요?";
		}
	%>
	"total_count" : 2,
	"talk_list" : [
		{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%><%=talk_r%>1",
			"auth"		: "U",
			"text"		: "<%=talk_option_title%> - <% if(talk_option_value != null){ out.print(talk_option_value); }else if(talk_ctgNo != null){ out.print(talk_ctgNo); }%>"
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%><%=talk_r%>2",
			"auth"		: "A",
			"text"		: "<%=talk_msg2%>"
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%><%=talk_r%>3",
			"auth"		: "A",
			"goods_no"	: [<%
				for(int i=0; i<14; i++){
					talk_rndno = (int) ((Math.random() * 100000000) + 1);
					if(i>0){%>,<%}%>"<%=talk_rndno%>"<%
				}
			%>],
			"text"		: ""
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%><%=talk_r%>4",
			"auth"		: "A",
			"text"		: "<%=talk_msg%>",
			"option_list" : {
				"items" : [
					<% if(!talk_no_opt){ %>
					{
						"opt_title" : "reatedKeyword",
						"opt_value" : [
							<% if(talk_showRelkey){ %>{
								"opt_tval"		: "입생로랑",
								"opt_tval_cd"	: "입생로랑"
							},{
								"opt_tval"		: "디올",
								"opt_tval_cd"	: "디올"
							},{
								"opt_tval"		: "맥",
								"opt_tval_cd"	: "맥"
							},{
								"opt_tval"		: "슈에무라",
								"opt_tval_cd"	: "슈에무라"
							},{
								"opt_tval"		: "바비브라운",
								"opt_tval_cd"	: "바비브라운"
							},{
								"opt_tval"		: "에스티로더",
								"opt_tval_cd"	: "에스티로더"
							}<% } %>
						]
					},{
						"opt_title" : "colors",
						"opt_value" : [
							{
								"opt_tval"		: "010",
								"opt_tval_cd"	: "010"
							},{
								"opt_tval"		: "030",
								"opt_tval_cd"	: "030"
							},{
								"opt_tval"		: "080",
								"opt_tval_cd"	: "080"
							},{
								"opt_tval"		: "090",
								"opt_tval_cd"	: "090"
							},{
								"opt_tval"		: "110",
								"opt_tval_cd"	: "110"
							},{
								"opt_tval"		: "120",
								"opt_tval_cd"	: "120"
							}
						]
					},{
						"opt_title" : "price",
						"opt_value" : [
							{
								"opt_tval"		: "10,000원 미만",
								"opt_tval_cd"	: "10000"
							},{
								"opt_tval"		: "10,000원 ~ 20,000원",
								"opt_tval_cd"	: "20000"
							},{
								"opt_tval"		: "20,000 ~ 50,000",
								"opt_tval_cd"	: "30000"
							},{
								"opt_tval"		: "50,000 ~ 100,000",
								"opt_tval_cd"	: "50000"
							},{
								"opt_tval"		: "100,000 ~ 500,000",
								"opt_tval_cd"	: "100000"
							},{
								"opt_tval"		: "500,000원 이상",
								"opt_tval_cd"	: "500000"
							}
						]
					},{
						"opt_title" : "smpDept",
						"opt_value" : [
							{
								"opt_tval"		: "전체",
								"opt_tval_cd"	: "1"
							},{
								"opt_tval"		: "본점",
								"opt_tval_cd"	: "1234"
							},{
								"opt_tval"		: "영등포점",
								"opt_tval_cd"	: "30000"
							},{
								"opt_tval"		: "여의도점",
								"opt_tval_cd"	: "50000"
							},{
								"opt_tval"		: "분당점",
								"opt_tval_cd"	: "100000"
							},{
								"opt_tval"		: "부산점",
								"opt_tval_cd"	: "500000"
							}
						]
					},{
						"opt_title" : "smpSeven",
						"opt_value" : []
					},{
						"opt_title" : "tdar",
						"opt_value" : []
					},{
						"opt_title" : "quick",
						"opt_value" : []
					},{
						"opt_title" : "freediv",
						"opt_value" : []
					},{
						"opt_title" : "noint",
						"opt_value" : []
					},{
						"opt_title" : "point",
						"opt_value" : []
					},{
						"opt_title" : "freepack",
						"opt_value" : []
					}
					<% } %>
				],
				"total_count" : 1
			},
			"pre_request_url" : "search.json",
			"pre_parameter" : "keyword=원피스&test=<%=talk_r%>"
		}
	]
	
	
	<%
	//////////////////////////////////////// 위시 리스트
	}else if(talk_cmd.equals("addWish")){
		talk_r = (int) (Math.random() * 2);
		if(talk_r<1){
			talk_msg = "이미 위시리스트에 담겨있어요.";
		}else{
			talk_msg = "위시리스트에 추가되었어요.";
		}
	%>
	"total_count" : 1,
	"talk_list" : [
		{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>1",
			"auth"		: "U",
			"text"		: "위시리스트 담기"
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>2",
			"auth"		: "A",
			"text"		: "<%=talk_msg%>"
		}
	]
	<%

	
	//////////////////////////////////////// 장바구니
	}else if(talk_cmd.equals("addCart")){
	%>
	"total_count" : 1,
	"talk_list" : [
		{
			"date"		: "<%=talk_date_str%>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>1",
			"auth"		: "U",
			"text"		: "장바구니 담기<br/>item_no: <%=talk_item_no%>"
		},{
			"date"		: "<%= talk_date_str %>",
			"group_id"	: "<%=talk_gid%>",
			"talk_id"	: "<%=talk_gid%>2",
			"auth"		: "A",
			<% if(talk_no_opt){ %>
			"text"		: "옵션을 선택해 주세요.",
			"option_list" : {
				"items" : [
					{
						"opt_title" : "제품번호/색상",
						"opt_value" : [
							{
								"opt_tval"		: "7SMS312_블랙",
								"opt_tval_cd"	: "1"
							},{
								"opt_tval"		: "7SMS312_베이지",
								"opt_tval_cd"	: "2"
							},{
								"opt_tval"		: "7SMS312_핑크",
								"opt_tval_cd"	: "3"
							}
						]
					},{
						"opt_title" : "사이즈",
						"opt_value" : [
							{
								"opt_tval"		: "225",
								"opt_tval_cd"	: "1"
							},{
								"opt_tval"		: "230",
								"opt_tval_cd"	: "2"
							}
						]
					}
				],
				"total_count" : 2
			},
			"complex_option_list" : {
				"items" : [
					{
						"opt_nm"	: "null",
						"opt_tval"	: "7SMS312_블랙 x 225",
						"opt_val_cd": "1 x 1",
						"item_no"	: "0",
						"inv_qty"	: 0
					},{
						"opt_nm"	: "null",
						"opt_tval"	: "7SMS312_블랙 x 230",
						"opt_val_cd": "1 x 2",
						"item_no"	: "1",
						"inv_qty"	: 1
					},{
						"opt_nm"	: "null",
						"opt_tval"	: "7SMS312_베이지 x 225",
						"opt_val_cd": "2 x 1",
						"item_no"	: "2",
						"inv_qty"	: 1
					},{
						"opt_nm"	: "null",
						"opt_tval"	: "7SMS312_베이지 x 230",
						"opt_val_cd": "2 x 2",
						"item_no"	: "3",
						"inv_qty"	: 1
					},{
						"opt_nm"	: "null",
						"opt_tval"	: "7SMS312_핑크 x 225",
						"opt_val_cd": "3 x 1",
						"item_no"	: "4",
						"inv_qty"	: 1
					},{
						"opt_nm"	: "null",
						"opt_tval"	: "7SMS312_핑크 x 230",
						"opt_val_cd": "3 x 2",
						"item_no"	: "5",
						"inv_qty"	: 0
					}
				],
				"total_count" : 5
			}
			<% }else{ %>
			"text"		: "장바구니에 담겼습니다."
			<% } %>
		}
	]
	<%
	}
	%>
	
	
	}
}