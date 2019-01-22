<%@ page contentType="application/json; charset=UTF-8" %>
<%
String keyword = request.getParameter("keyword");
String rtnType = request.getParameter("rtnType");
String ctgNo = request.getParameter("ctgNo");
String ctgDepth = request.getParameter("ctgDepth");
String dsCtgDepth = request.getParameter("dsCtgDepth");

if(keyword == null){ keyword = ""; }
if(rtnType == null){ rtnType = ""; }
if(ctgNo == null){ ctgNo = ""; }
if(ctgDepth == null){ ctgDepth = ""; }
if(dsCtgDepth == null){ dsCtgDepth = ""; }
keyword = keyword.replace("\"", "\\\"");

int cnt, i, len;

if(keyword.indexOf("empty")>=0){
%>
{
"max":{
	"resultCode": "1000",
	"isVoice": "N",
	"brdNm": "",
	"sortType": "RANK,1",
	"keyword": "<%=keyword%>",
	<% /*"price": {
		"min": "2850",
		"max": "559200"
	},*/ %>
	"store": {
		"dept": 0,
		"tvhome": 0,
		"brdstore": 0,
		"super": 0
	},
	"recomLink": {
		"linkUrl": "",
		"blankFlag": false,
		"label": "",
		"alertStr": ""
	},
    "ctgLst": {
      "items": [],
      "tcnt": 0
   },
   "brdLst": {
      "items": [],
      "tcnt": 0
	},
   "smpick" : 0,
	"smpickBranch": [],
	"colors":[],
   "reatedKeyword": {
      "result": [{
         "totalcount": 0,
         "items": []
      }],
      "responsestatus": 0
   }
}
}
<%
}else{
%>
{
"max":{
	"resultCode": "0000",
	"isVoice": "N",
	"brdNm": "",
	"sortType": "RANK,1",
	"keyword": "<%=keyword%>",
	<% /*"price": {
		"min": "2850",
		"max": "559200"
	},*/ %>
	"store": {
		"dept": 1,
		"tvhome": 1,
		"brdstore": 1,
		"super": 1
	},
	"recomLink": {
		"linkUrl": "",
		"blankFlag": false,
		"label": "",
		"alertStr": ""
	},
	
<%
// 중소 카테 목록
// 뎁스가 대카(1)일 경우에만 서브카테 리턴
if(rtnType.equals("C") && (dsCtgDepth.equals("2") || dsCtgDepth.equals("3") || dsCtgDepth.equals("4"))){
	String subdp = "3";
	if(dsCtgDepth.equals("3")){
		subdp = "4";
	}else if(dsCtgDepth.equals("4")){
		subdp = "5";
	}
%>
	"subCtgLst": {
		"items": [{
			"cnt": "14337",
			"mall": "",
			"ctgName": "<%=dsCtgDepth%>뎁스",
			"ctgNo": "<%=ctgNo%>",
			"subCtgLst": {
				"items": [{
					"cnt": "6706",
					"mall": "",
					"ctgName": "<%=subdp%>뎁스-1",
					"ctgNo": "<%=subdp%><%=ctgNo%>1"
				}, {
					"cnt": "2525",
					"mall": "",
					"ctgName": "<%=subdp%>뎁스-2",
					"ctgNo": "<%=subdp%><%=ctgNo%>2"
				}, {
					"cnt": "1838",
					"mall": "",
					"ctgName": "<%=subdp%>뎁스-3",
					"ctgNo": "<%=subdp%><%=ctgNo%>3"
				}],
				"tcnt": 3
			}
		}]
	},
<%
}

// 대대카, 대카 목록 (1, 2 뎁스)
//if(!rtnType.equals("C")){
%>
    "ctgLst": {
      "items": [{
         "subCtgLst": {
            "items": [{
               "cnt": "6706",
               "mall": "롯데닷컴",
               "ctgName": "원피스",
               "ctgNo": "5415550"
            }],
            "tcnt": 1
         },
         "cnt": "14337",
         "mall": "롯데닷컴",
         "ctgName": "여성 트렌디의류",
         "ctgNo": "1670756"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "2552",
               "mall": "롯데닷컴",
               "ctgName": "원피스",
               "ctgNo": "1695987"
            }],
            "tcnt": 1
         },
         "cnt": "8264",
         "mall": "롯데닷컴",
         "ctgName": "여성 캐주얼/정장",
         "ctgNo": "5827"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "4800",
               "mall": "영플라자",
               "ctgName": "원피스",
               "ctgNo": "5415648"
            }],
            "tcnt": 1
         },
         "cnt": "7054",
         "mall": "영플라자",
         "ctgName": "영캐주얼",
         "ctgNo": "1695234"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "5415583",
               "mall": "롯데백화점",
               "ctgName": "원피스",
               "ctgNo": "5230103"
            }],
            "tcnt": 1
         },
         "cnt": "5492",
         "mall": "롯데백화점",
         "ctgName": "영캐주얼",
         "ctgNo": "1692766"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "1939",
               "mall": "롯데백화점",
               "ctgName": "원피스",
               "ctgNo": "5414480"
            }],
            "tcnt": 2
         },
         "cnt": "3651",
         "mall": "롯데백화점",
         "ctgName": "여성 캐주얼/정장",
         "ctgNo": "1694687"
      }],
      "tcnt": 5
   },
<%
//}
%>
   "brdLst": {
      "items": [{
         "brdName": "라푸마",
         "cnt": 1007,
         "brdNo": "8624"
      }, {
         "brdName": "천이백엠",
         "cnt": 797,
         "brdNo": "11844"
      }, {
         "brdName": "몽클레어",
         "cnt": 673,
         "brdNo": "263244"
      }, {
         "brdName": "빈폴아웃도어",
         "cnt": 554,
         "brdNo": "163657"
      }, {
         "brdName": "케이투",
         "cnt": 545,
         "brdNo": "602"
      }, {
         "brdName": "아디다스(의류)",
         "cnt": 477,
         "brdNo": "255905"
      }, {
         "brdName": "헤드",
         "cnt": 473,
         "brdNo": "605"
      }, {
         "brdName": "케이스위스",
         "cnt": 473,
         "brdNo": "5704"
      }, {
         "brdName": "빈폴",
         "cnt": 441,
         "brdNo": "1703"
      }, {
         "brdName": "빈폴키즈",
         "cnt": 436,
         "brdNo": "7181"
      }, {
         "brdName": "블랙야크",
         "cnt": 428,
         "brdNo": "10865"
      }, {
         "brdName": "아이더",
         "cnt": 399,
         "brdNo": "47726"
      }, {
         "brdName": "헤지스골프",
         "cnt": 398,
         "brdNo": "14273"
      }, {
         "brdName": "프랑코페라로",
         "cnt": 315,
         "brdNo": "11601"
      }, {
         "brdName": "노스페이스",
         "cnt": 261,
         "brdNo": "126"
      }, {
         "brdName": "코오롱스포츠",
         "cnt": 244,
         "brdNo": "411"
      }, {
         "brdName": "베어파우(슈즈)",
         "cnt": 239,
         "brdNo": "12105"
      }, {
         "brdName": "레노마캐주얼",
         "cnt": 234,
         "brdNo": "7732"
      }, {
         "brdName": "갤럭시라이프스타일",
         "cnt": 207,
         "brdNo": "57237"
      }, {
         "brdName": "밀레(아웃도어)",
         "cnt": 206,
         "brdNo": "6034"
      }, {
         "brdName": "마모트",
         "cnt": 206,
         "brdNo": "134207"
      }, {
         "brdName": "몽클레어(패션잡화)",
         "cnt": 198,
         "brdNo": "278714"
      }, {
         "brdName": "몽벨",
         "cnt": 197,
         "brdNo": "47112"
      }, {
         "brdName": "블루독",
         "cnt": 197,
         "brdNo": "5302"
      }, {
         "brdName": "프랜치캣",
         "cnt": 196,
         "brdNo": "8809"
      }, {
         "brdName": "위버럭스(남성 액세서리)",
         "cnt": 194,
         "brdNo": "300671"
      }, {
         "brdName": "엠씨",
         "cnt": 193,
         "brdNo": "5851"
      }, {
         "brdName": "엠엘비키즈",
         "cnt": 191,
         "brdNo": "15707"
      }, {
         "brdName": "빈폴레이디스",
         "cnt": 190,
         "brdNo": "6147"
      }, {
         "brdName": "아디다스",
         "cnt": 190,
         "brdNo": "3778"
      }, {
         "brdName": "쇼콜라",
         "cnt": 189,
         "brdNo": "271"
      }, {
         "brdName": "닥스골프",
         "cnt": 189,
         "brdNo": "122407"
      }, {
         "brdName": "무스너클",
         "cnt": 186,
         "brdNo": "277689"
      }, {
         "brdName": "올젠",
         "cnt": 186,
         "brdNo": "5420"
      }, {
         "brdName": "마에스트로",
         "cnt": 185,
         "brdNo": "4413"
      }, {
         "brdName": "베네통키즈",
         "cnt": 183,
         "brdNo": "6471"
      }, {
         "brdName": "아이슈즈",
         "cnt": 180,
         "brdNo": "284003"
      }, {
         "brdName": "에르노",
         "cnt": 173,
         "brdNo": "289774"
      }, {
         "brdName": "일꼬르소델마에스트로",
         "cnt": 173,
         "brdNo": "40632"
      }, {
         "brdName": "프로스펙스",
         "cnt": 170,
         "brdNo": "451"
      }, {
         "brdName": "홀하우스",
         "cnt": 169,
         "brdNo": "52544"
      }, {
         "brdName": "머렐",
         "cnt": 169,
         "brdNo": "4783"
      }, {
         "brdName": "빈폴골프",
         "cnt": 168,
         "brdNo": "11946"
      }, {
         "brdName": "쉬즈미스",
         "cnt": 168,
         "brdNo": "2451"
      }, {
         "brdName": "엠-리미티드",
         "cnt": 167,
         "brdNo": "271486"
      }, {
         "brdName": "리바이스(키즈)",
         "cnt": 166,
         "brdNo": "8808"
      }, {
         "brdName": "텐바이텐",
         "cnt": 165,
         "brdNo": "155112"
      }, {
         "brdName": "노비스",
         "cnt": 162,
         "brdNo": "290910"
      }, {
         "brdName": "디스커버리",
         "cnt": 161,
         "brdNo": "248342"
      }, {
         "brdName": "섀르반",
         "cnt": 161,
         "brdNo": "273143"
      }, {
         "brdName": "센터폴",
         "cnt": 159,
         "brdNo": "260557"
      }, {
         "brdName": "노스페이스 화이트라벨",
         "cnt": 156,
         "brdNo": "15706"
      }, {
         "brdName": "트렉스타",
         "cnt": 156,
         "brdNo": "3991"
      }, {
         "brdName": "오가닉맘",
         "cnt": 156,
         "brdNo": "9638"
      }, {
         "brdName": "파코라반 베이비",
         "cnt": 153,
         "brdNo": "440"
      }, {
         "brdName": "닥스 키즈",
         "cnt": 152,
         "brdNo": "16858"
      }, {
         "brdName": "블랙야크(키즈)",
         "cnt": 152,
         "brdNo": "273142"
      }, {
         "brdName": "로가디스",
         "cnt": 151,
         "brdNo": "3788"
      }, {
         "brdName": "모넬라",
         "cnt": 150,
         "brdNo": "282022"
      }, {
         "brdName": "푸마(의류)",
         "cnt": 149,
         "brdNo": "255914"
      }, {
         "brdName": "압소바",
         "cnt": 146,
         "brdNo": "308"
      }, {
         "brdName": "팬콧",
         "cnt": 143,
         "brdNo": "13524"
      }, {
         "brdName": "버커루",
         "cnt": 142,
         "brdNo": "7525"
      }, {
         "brdName": "앤듀",
         "cnt": 140,
         "brdNo": "7017"
      }, {
         "brdName": "테이트",
         "cnt": 139,
         "brdNo": "9271"
      }, {
         "brdName": "게스(키즈)",
         "cnt": 136,
         "brdNo": "9233"
      }, {
         "brdName": "리스트",
         "cnt": 135,
         "brdNo": "5802"
      }, {
         "brdName": "컬럼비아",
         "cnt": 134,
         "brdNo": "2232"
      }, {
         "brdName": "임페리얼",
         "cnt": 133,
         "brdNo": "4676"
      }, {
         "brdName": "월튼키즈",
         "cnt": 130,
         "brdNo": "9267"
      }, {
         "brdName": "투스카로라",
         "cnt": 130,
         "brdNo": "9929"
      }, {
         "brdName": "천삼백케이",
         "cnt": 130,
         "brdNo": "287236"
      }, {
         "brdName": "플레이키즈프로",
         "cnt": 130,
         "brdNo": "312268"
      }, {
         "brdName": "덕마운트",
         "cnt": 130,
         "brdNo": "277390"
      }, {
         "brdName": "로가디스 그린",
         "cnt": 126,
         "brdNo": "6306"
      }, {
         "brdName": "마인드브릿지",
         "cnt": 124,
         "brdNo": "9273"
      }, {
         "brdName": "헤지스 남성",
         "cnt": 122,
         "brdNo": "258163"
      }, {
         "brdName": "크로커다일 레이디",
         "cnt": 122,
         "brdNo": "9650"
      }, {
         "brdName": "니",
         "cnt": 122,
         "brdNo": "5638"
      }, {
         "brdName": "게스(진)",
         "cnt": 122,
         "brdNo": "244862"
      }, {
         "brdName": "휠라",
         "cnt": 121,
         "brdNo": "1318"
      }, {
         "brdName": "클럽캠브리지",
         "cnt": 119,
         "brdNo": "50740"
      }, {
         "brdName": "프리미에쥬르",
         "cnt": 119,
         "brdNo": "2810"
      }, {
         "brdName": "리복",
         "cnt": 118,
         "brdNo": "187"
      }, {
         "brdName": "기타",
         "cnt": 118,
         "brdNo": "184528"
      }, {
         "brdName": "지프",
         "cnt": 116,
         "brdNo": "12838"
      }, {
         "brdName": "르까프",
         "cnt": 115,
         "brdNo": "8819"
      }, {
         "brdName": "엠비오",
         "cnt": 113,
         "brdNo": "1712"
      }, {
         "brdName": "알로봇",
         "cnt": 112,
         "brdNo": "3704"
      }, {
         "brdName": "젤리스푼",
         "cnt": 110,
         "brdNo": "273527"
      }, {
         "brdName": "휠라 키즈",
         "cnt": 110,
         "brdNo": "3706"
      }, {
         "brdName": "모니즈",
         "cnt": 110,
         "brdNo": "300659"
      }, {
         "brdName": "네파",
         "cnt": 109,
         "brdNo": "10855"
      }, {
         "brdName": "마코",
         "cnt": 108,
         "brdNo": "52552"
      }, {
         "brdName": "나파피리",
         "cnt": 107,
         "brdNo": "269581"
      }, {
         "brdName": "프룹스",
         "cnt": 106,
         "brdNo": "164367"
      }, {
         "brdName": "아이더(브이아이피)",
         "cnt": 106,
         "brdNo": "285730"
      }, {
         "brdName": "더휴즈",
         "cnt": 106,
         "brdNo": "158152"
      }, {
         "brdName": "티비제이",
         "cnt": 106,
         "brdNo": "1689"
      }],
      "tcnt": 99
	},
   "smpick" : 1,
	"smpickBranch": [{
		"name": "청량리점",
		"branchNo": "104849"
	}, {
		"name": "영등포점",
		"branchNo": "11050"
	}, {
		"name": "인천점",
		"branchNo": "11054"
	}, {
		"name": "대구점",
		"branchNo": "110551"
	}, {
		"name": "분당점",
		"branchNo": "111155"
	}, {
		"name": "안양점",
		"branchNo": "111158"
	}, {
		"name": "광복점",
		"branchNo": "111163"
	}, {
		"name": "울산점",
		"branchNo": "111165"
	}, {
		"name": "대전점",
		"branchNo": "111169"
	}, {
		"name": "명동점(영플라자)",
		"branchNo": "12719"
	}, {
		"name": "잠실점",
		"branchNo": "195476"
	}, {
		"name": "본  점",
		"branchNo": "20"
	}, {
		"name": "포항점",
		"branchNo": "245785"
	}, {
		"name": "상인점",
		"branchNo": "245805"
	}, {
		"name": "부평점",
		"branchNo": "245812"
	}, {
		"name": "안산점",
		"branchNo": "245813"
	}, {
		"name": "중동점",
		"branchNo": "245969"
	}, {
		"name": "수원점",
		"branchNo": "278374"
	}],
	"colors":[
		{"colorCd":"010"},
		{"colorCd":"020"},
		{"colorCd":"030"},
		{"colorCd":"040"},
		{"colorCd":"050"},
		{"colorCd":"060"},
		{"colorCd":"070"},
		{"colorCd":"080"},
		{"colorCd":"090"},
		{"colorCd":"100"},
		{"colorCd":"110"},
		{"colorCd":"120"},
		{"colorCd":"130"},
		{"colorCd":"140"},
		{"colorCd":"150"},
		{"colorCd":"160"},
		{"colorCd":"170"},
		{"colorCd":"180"}
	]<% /*,
	"reatedKeyword":{
		"Data":{
			"Word":[
				"아동",
				"여성",
				"남성",
				"운동화",
				"슬리퍼",
				"티셔츠",
				"에어맥스",
				"루나",
				"런닝화",
				"반팔티",
				"모자",
				"허라취",
				"레깅스",
				"후드집업",
				"트레이닝복",
				"바람막이",
				"로쉬뤈"
			],
			"TotalCount":10,
			"Return":0
		}
	},
   "relatedKeyword":{
      "result": [{
         "totalcount": 10,
         "items": [{
            "hkeyword": "<strong>패딩<\/strong>",
            "count": 57347,
            "keyword": "패딩",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "여성<strong>패딩<\/strong>",
            "count": 35059,
            "keyword": "여성패딩",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "<strong>패딩<\/strong>조끼",
            "count": 25037,
            "keyword": "패딩조끼",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "<strong>패딩<\/strong>점퍼",
            "count": 9036,
            "keyword": "패딩점퍼",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "여성 <strong>패딩<\/strong>",
            "count": 7685,
            "keyword": "여성 패딩",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "노스페이스 <strong>패딩<\/strong>",
            "count": 6821,
            "keyword": "노스페이스 패딩",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "남성<strong>패딩<\/strong>",
            "count": 6492,
            "keyword": "남성패딩",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "롱<strong>패딩<\/strong>",
            "count": 6402,
            "keyword": "롱패딩",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "<strong>패딩<\/strong>부츠",
            "count": 6101,
            "keyword": "패딩부츠",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "아이더<strong>패딩<\/strong>",
            "count": 4959,
            "keyword": "아이더패딩",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "밀레<strong>패딩<\/strong>",
            "count": 4259,
            "keyword": "밀레패딩",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }, {
            "hkeyword": "컬럼비아<strong>패딩<\/strong>",
            "count": 3459,
            "keyword": "컬럼비아패딩",
            "linkurl": "",
            "type": 2,
            "linkname": ""
         }]
      }],
      "responsestatus": 0
   } */ %>
}
}
<% } %>