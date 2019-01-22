<%@ page contentType="application/json; charset=UTF-8" %>
<%
String keyword		= request.getParameter("keyword");
String rtnType		= request.getParameter("rtnType");
String ctgNo		= request.getParameter("ctgNo");
String dtCtgNo		= request.getParameter("dtCtgNo");
String ctgDepth		= request.getParameter("ctgDepth");
String dtDsCtgDepth	= request.getParameter("dtDsCtgDepth");
String voice		= request.getParameter("isVoice");
String chkTypo		= request.getParameter("chkTypo");

if(keyword == null){ keyword = ""; }
if(rtnType == null){ rtnType = ""; }
if(ctgNo == null){ ctgNo = ""; }
if(ctgDepth == null){ ctgDepth = ""; }
if(dtDsCtgDepth == null){ dtDsCtgDepth = ""; }
if(chkTypo == null){ chkTypo = "Y"; }
keyword = keyword.replace("\"", "\\\"");

boolean isVoice = false;
boolean redirectUrl = false;
if(voice.equals("Y") || voice.equals("T")){
	// 음성검색
	if(keyword.indexOf("마이롯데")>=0){
		// 키워드 URL 포워딩
		redirectUrl = true;
	}else{
		// 일반 음성검색
		isVoice = true;
	}	
}

int cnt, i, len;


if(keyword.equals("우너피스") && chkTypo.equals("Y")){
	keyword = "원피스";
}

if(keyword.indexOf("nodata")>=0){
// 검색결과 없는 경우
%>
{
	"resultCode": "1000",
	"keyword": "<%=keyword%>",
	"isVoice": "N",
	"redirectUrl":"",
	"_brdNm": "",
	"sortType": "RANK,1",
	"price": {
		"min": "2850",
		"max": "559200"
	},
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
<%
// 검색결과 없는 경우 끝
}else{
// 검색결과 있는 경우
%>
{
	"resultCode": "0000",
	<%
	if(redirectUrl){
	// 키워드 URL 포워딩
	%>
	"isVoice": "Y",
	"redirectUrl":"/mylotte/m/mylotte_dev.html",
	<%
	}else if(isVoice){
	// 음성검색
	%>
	"isVoice": "T",
	"brdNm":"나이키",
	"redirectUrl":"",
	<%
	}else{
	// 일반 검색
	%>
	"isVoice": "N",
	"brdNm": "",
	"redirectUrl":"",
	<% } %>
	"keyword": "<%=keyword%>",
	"sortType": "RANK,1",
	"price": {
		"min": "2850",
		"max": "559200"
	},
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
	"smpSeven":1,
	"tdar":1,
	"quick":1,
	
<%
// 중소 카테 목록
// 뎁스가 대카(1)일 경우에만 서브카테 리턴
//if(rtnType.equals("C") && ctgDepth.equals("1")){
if(dtDsCtgDepth.equals("2")){
%>
	"subCtgLst": {},
	"dtlCtgLst": {
		"ctgNo": "<%=ctgNo%>",
		<% if(ctgNo.equals("5522717")){//서브카테 없는 경우 %>
		"items": []
		<% }else{// 서브카테 있는 경우 %>
		"items": [{
			"subCtgLst": {
				"items": [{
					"cnt": "6706",
					"mall": "",
					"ctgName": "4뎁스-1-1",
					"ctgNo": "<%=dtCtgNo%>0011"
				}, {
					"cnt": "2525",
					"mall": "",
					"ctgName": "4뎁스-1-2",
					"ctgNo": "<%=dtCtgNo%>0012"
				}, {
					"cnt": "1838",
					"mall": "",
					"ctgName": "4뎁스-1-3",
					"ctgNo": "<%=dtCtgNo%>0013"
				}, {
					"cnt": "1580",
					"mall": "",
					"ctgName": "4뎁스-1-4",
					"ctgNo": "<%=dtCtgNo%>0014"
				}],
				"tcnt": 7
			},
			"cnt": "14337",
			"mall": "",
			"ctgName": "3뎁스 <%=dtCtgNo%>-1",
			"ctgNo": "<%=dtCtgNo%>001"
		},{
			"subCtgLst": {
				"items": [{
					"cnt": "6706",
					"mall": "",
					"ctgName": "4뎁스-2-1",
					"ctgNo": "<%=dtCtgNo%>0021"
				}, {
					"cnt": "2525",
					"mall": "",
					"ctgName": "4뎁스-2-2",
					"ctgNo": "<%=dtCtgNo%>0022"
				}],
				"tcnt": 7
			},
			"cnt": "14337",
			"mall": "",
			"ctgName": "3뎁스 <%=dtCtgNo%>-2",
			"ctgNo": "<%=dtCtgNo%>002"
		},{
			"subCtgLst": {
				"items": [{
					"cnt": "6706",
					"mall": "",
					"ctgName": "4뎁스-3-1",
					"ctgNo": "<%=dtCtgNo%>0031"
				}, {
					"cnt": "2525",
					"mall": "",
					"ctgName": "4뎁스-3-2",
					"ctgNo": "<%=dtCtgNo%>0032"
				}, {
					"cnt": "1838",
					"mall": "",
					"ctgName": "4뎁스-3-3",
					"ctgNo": "<%=dtCtgNo%>0033"
				}],
				"tcnt": 7
			},
			"cnt": "14337",
			"mall": "",
			"ctgName": "3뎁스 <%=dtCtgNo%>-3",
			"ctgNo": "<%=dtCtgNo%>003"
		}]
		<% } %>
	},
<%
}

// 대대카, 대카 목록 (1, 2 뎁스)
if(!rtnType.equals("C")){
%>
    "ctgLst": {
      "items": [{
         "subCtgLst": {
            "items": [{
               "cnt": "6706",
               "mall": "백화점",
               "ctgName": "등산\/골프\/수영",
               "ctgNo": "1488049"
            }, {
               "cnt": "2525",
               "mall": "닷컴",
               "ctgName": "스포츠패션\/슈즈",
               "ctgNo": "1696687"
            }, {
               "cnt": "1838",
               "mall": "영플라자",
               "ctgName": "스포츠패션\/슈즈\/구기",
               "ctgNo": "1687397"
            }, {
               "cnt": "1580",
               "mall": "",
               "ctgName": "등산\/캠핑\/낚시",
               "ctgNo": "1689272"
            }, {
               "cnt": "1425",
               "mall": "",
               "ctgName": "골프의류\/용품",
               "ctgNo": "1689931"
            }, {
               "cnt": "258",
               "mall": "",
               "ctgName": "헬스\/요가\/수영\/스키",
               "ctgNo": "1689074"
            }, {
               "cnt": "5000",
               "mall": "",
               "ctgName": "자전거\/보드\/익스트림",
               "ctgNo": "1732809"
            }],
            "tcnt": 7
         },
         "cnt": "14337",
         "mall": "",
         "ctgName": "스포츠\/레저",
         "ctgNo": "5844"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "2552",
               "mall": "",
               "ctgName": "진\/유니섹스",
               "ctgNo": "1695987"
            }, {
               "cnt": "2304",
               "mall": "롯데닷컴",
               "ctgName": "영캐주얼",
               "ctgNo": "1695234"
            }, {
               "cnt": "1358",
               "mall": "",
               "ctgName": "여성 트렌디의류",
               "ctgNo": "1670756"
            }, {
               "cnt": "825",
               "mall": "영플라자",
               "ctgName": "진\/유니섹스",
               "ctgNo": "1696547"
            }, {
               "cnt": "785",
               "mall": "백화점",
               "ctgName": "진\/유니섹스",
               "ctgNo": "1672762"
            }, {
               "cnt": "440",
               "mall": "백화점",
               "ctgName": "영캐주얼",
               "ctgNo": "1692766"
            }],
            "tcnt": 6
         },
         "cnt": "8264",
         "mall": "",
         "ctgName": "영패션\/유니섹스",
         "ctgNo": "5827"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "4800",
               "mall": "백화점",
               "ctgName": "유아동\/용품",
               "ctgNo": "5152208"
            }, {
               "cnt": "2241",
               "mall": "",
               "ctgName": "유아동의류\/잡화",
               "ctgNo": "5152205"
            }, {
               "cnt": "12",
               "mall": "",
               "ctgName": "유아동용품\/임신\/출산",
               "ctgNo": "5152204"
            }, {
               "cnt": "1",
               "mall": "",
               "ctgName": "유아동도서\/완구\/교구",
               "ctgNo": "5152207"
            }],
            "tcnt": 4
         },
         "cnt": "7054",
         "mall": "",
         "ctgName": "유아동",
         "ctgNo": "5847"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "2257",
               "mall": "백화점",
               "ctgName": "남성 캐주얼",
               "ctgNo": "5230103"
            }, {
               "cnt": "1574",
               "mall": "",
               "ctgName": "남성 캐릭터정장\/캐주얼",
               "ctgNo": "5211749"
            }, {
               "cnt": "650",
               "mall": "백화점",
               "ctgName": "남성 정장\/셔츠",
               "ctgNo": "5230101"
            }, {
               "cnt": "587",
               "mall": "",
               "ctgName": "남성 정장\/셔츠",
               "ctgNo": "5211738"
            }, {
               "cnt": "424",
               "mall": "백화점",
               "ctgName": "남성 캐릭터정장",
               "ctgNo": "5230102"
            }],
            "tcnt": 5
         },
         "cnt": "5492",
         "mall": "",
         "ctgName": "남성의류",
         "ctgNo": "5843"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "1939",
               "mall": "닷컴",
               "ctgName": "여성 캐주얼\/정장",
               "ctgNo": "1694687"
            }, {
               "cnt": "1712",
               "mall": "백화점",
               "ctgName": "여성 캐주얼\/정장",
               "ctgNo": "1670930"
            }],
            "tcnt": 2
         },
         "cnt": "3651",
         "mall": "",
         "ctgName": "여성의류",
         "ctgNo": "5842"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "1881",
               "mall": "",
               "ctgName": "수입명품",
               "ctgNo": "1675880"
            }, {
               "cnt": "967",
               "mall": "",
               "ctgName": "패션슈즈",
               "ctgNo": "1674767"
            }, {
               "cnt": "128",
               "mall": "",
               "ctgName": "슈즈",
               "ctgNo": "5516387"
            }, {
               "cnt": "91",
               "mall": "닷컴",
               "ctgName": "패션잡화",
               "ctgNo": "1675137"
            }, {
               "cnt": "27",
               "mall": "",
               "ctgName": "시계\/주얼리\/시즌ACC",
               "ctgNo": "1514071"
            }, {
               "cnt": "5",
               "mall": "영플라자",
               "ctgName": "패션잡화",
               "ctgNo": "1698054"
            }],
            "tcnt": 6
         },
         "cnt": "3099",
         "mall": "",
         "ctgName": "잡화\/슈즈\/명품",
         "ctgNo": "5845"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "797",
               "mall": "",
               "ctgName": "1200m",
               "ctgNo": "5453087"
            }, {
               "cnt": "273",
               "mall": "",
               "ctgName": "침구",
               "ctgNo": "5348544"
            }, {
               "cnt": "126",
               "mall": "",
               "ctgName": "1300K",
               "ctgNo": "5492531"
            }, {
               "cnt": "23",
               "mall": "",
               "ctgName": "소파\/침대\/옷장",
               "ctgNo": "5374430"
            }, {
               "cnt": "8",
               "mall": "",
               "ctgName": "커튼\/카페트\/인테리어",
               "ctgNo": "5374432"
            }, {
               "cnt": "5",
               "mall": "",
               "ctgName": "책상\/의자\/식탁\/싱크대",
               "ctgNo": "5348043"
            }, {
               "cnt": "2",
               "mall": "",
               "ctgName": "아동\/수납\/사무가구",
               "ctgNo": "5374431"
            }],
            "tcnt": 7
         },
         "cnt": "1234",
         "mall": "",
         "ctgName": "가구\/침구\/인테리어",
         "ctgNo": "5848"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "169",
               "mall": "",
               "ctgName": "텐바이텐",
               "ctgNo": "5293948"
            }, {
               "cnt": "8",
               "mall": "",
               "ctgName": "수납\/청소\/생활잡화",
               "ctgNo": "5348843"
            }, {
               "cnt": "3",
               "mall": "",
               "ctgName": "주방\/식기",
               "ctgNo": "1682489"
            }, {
               "cnt": "1",
               "mall": "",
               "ctgName": "건강\/다이어트\/실버",
               "ctgNo": "1683525"
            }],
            "tcnt": 4
         },
         "cnt": "181",
         "mall": "",
         "ctgName": "주방\/생활\/건강",
         "ctgNo": "5849"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "57",
               "mall": "",
               "ctgName": "문구\/사무기기\/보안",
               "ctgNo": "1682792"
            }, {
               "cnt": "21",
               "mall": "",
               "ctgName": "악기\/애완\/취미\/원예",
               "ctgNo": "1683721"
            }],
            "tcnt": 2
         },
         "cnt": "78",
         "mall": "",
         "ctgName": "교환권\/문구,취미\/서비스",
         "ctgNo": "5963"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "24",
               "mall": "",
               "ctgName": "가정\/생활",
               "ctgNo": "1693792"
            }],
            "tcnt": 1
         },
         "cnt": "24",
         "mall": "",
         "ctgName": "프리미엄 가정\/생활",
         "ctgNo": "5855"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "12",
               "mall": "",
               "ctgName": "TV쇼핑",
               "ctgNo": "5080600"
            }, {
               "cnt": "8",
               "mall": "",
               "ctgName": "카탈로그",
               "ctgNo": "5355343"
            }],
            "tcnt": 2
         },
         "cnt": "20",
         "mall": "",
         "ctgName": "롯데홈쇼핑",
         "ctgNo": "5866"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "11",
               "mall": "",
               "ctgName": "스마트폰\/디지털\/자동차용품",
               "ctgNo": "1684389"
            }],
            "tcnt": 1
         },
         "cnt": "11",
         "mall": "",
         "ctgName": "가전\/컴퓨터",
         "ctgNo": "5851"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "2",
               "mall": "",
               "ctgName": "롯데닷컴 도서",
               "ctgNo": "5443047"
            }],
            "tcnt": 1
         },
         "cnt": "2",
         "mall": "",
         "ctgName": "롯데닷컴 도서",
         "ctgNo": "6784"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "1",
               "mall": "",
               "ctgName": "언더웨어",
               "ctgNo": "1673641"
            }],
            "tcnt": 1
         },
         "cnt": "1",
         "mall": "",
         "ctgName": "언더웨어",
         "ctgNo": "5854"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "1",
               "mall": "",
               "ctgName": "화장품\/이미용",
               "ctgNo": "1677642"
            }],
            "tcnt": 1
         },
         "cnt": "1",
         "mall": "",
         "ctgName": "화장품",
         "ctgNo": "5846"
      }, {
         "subCtgLst": {
            "items": [{
               "cnt": "1",
               "mall": "",
               "ctgName": "Gucci 공식 온라인 스토어",
               "ctgNo": "5522717"
            }],
            "tcnt": 1
         },
         "cnt": "1",
         "mall": "",
         "ctgName": "Gucci 공식 온라인 스토어",
         "ctgNo": "6831"
      }],
      "tcnt": 16
   },
<%
}

// 브랜드 목록 시작
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
   "smpDept" : 1,
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
	],
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
   },
	"shoseSizeLst":{
		"items":[
			{"shoseNm":"140","shoseCnt":5},
			{"shoseNm":"160","shoseCnt":1},
			{"shoseNm":"170","shoseCnt":3},
			{"shoseNm":"275","shoseCnt":56},
			{"shoseNm":"280","shoseCnt":39},
			{"shoseNm":"285","shoseCnt":50},
			{"shoseNm":"290","shoseCnt":47},
			{"shoseNm":"295","shoseCnt":10},
			{"shoseNm":"300이상","shoseCnt":2}
		]
	},
	"starPointLst":{
		"items":[
			{"starCnt":36,"starNo":"5"},
			{"starCnt":11,"starNo":"4"},
			{"starCnt":1,"starNo":"3"},
			{"starCnt":1,"starNo":"2"}
		]
	}
}
<%
}
// 검색결과 있는 경우 끝
%>