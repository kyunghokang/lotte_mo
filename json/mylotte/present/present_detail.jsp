<%@ page contentType="application/json; charset=UTF-8" %>
<%
String order_no = request.getParameter("orderNo");
if(order_no == null){ order_no = ""; }
Double orno = Double.parseDouble(order_no) - 1;
String ordDtlSn = request.getParameter("ordDtlSn");

String[] opt1 = {"", "S", "M", "L", "XL"};
String[] opt2 = {"", "레드", "블루", "블랙", "화이트", "핑크"};
String[] opt3 = {"", "노터그", "싱글터그", "더블터그"};

String[] brands = {
	"[쉬즈미스]",
	"[블루독]",
	"[톰앤래빗]",
	"[모다까리나]",
	"[제이제이 지고트]",
	"[탑온탑]",
	"[쉬즈미스]",
	"[블루독]",
	"[톰앤래빗]",
	"[모다까리나]",
	"[제이제이 지고트]"
};
String[] products = {
	"블라우스,원피스外 20종 택1",
	"시즌오프 30%★ 티셔츠/원피스/팬츠外 20종 택 1",
	"[톰앤래빗]인기아이템 20종택1 /원피스/블라우스/팬츠/SET",
	"★여아 BEST20★ 티셔츠/팬츠/원피스/아쿠아슈즈 外 20종 택1",
	"[JJ지고트]가성비 높은 아이템만 모았어! 블라우스, 원피스 外 20종 택1",
	"[탑온탑] 뭔가 다른 탑온탑 썸머 티셔츠/셔츠/원피스",
	"블라우스,원피스外 20종 택1",
	"시즌오프 30%★ 티셔츠/원피스/팬츠外 20종 택 1",
	"[톰앤래빗]인기아이템 20종택1 /원피스/블라우스/팬츠/SET",
	"★여아 BEST20★ 티셔츠/팬츠/원피스/아쿠아슈즈 外 20종 택1",
	"[JJ지고트]가성비 높은 아이템만 모았어! 블라우스, 원피스 外 20종 택1"
};
String[] images = {
	"http://image.lotte.com/goods/38/47/44/49/2/249444738_2_280.jpg",
	"http://image.lotte.com/goods/76/18/88/64/2/264881876_4_280.jpg",
	"http://image.lotte.com/goods/28/89/62/61/2/261628928_1_280.jpg",
	"http://image.lotte.com/goods/89/09/08/58/2/258080989_1_280.jpg",
	"http://image.lotte.com/goods/66/00/66/54/2/254660066_1_280.jpg",
	"http://image.lotte.com/goods/23/65/91/61/2/261916523_1_280.jpg",
	"http://image.lotte.com/goods/38/47/44/49/2/249444738_2_280.jpg",
	"http://image.lotte.com/goods/76/18/88/64/2/264881876_4_280.jpg",
	"http://image.lotte.com/goods/28/89/62/61/2/261628928_1_280.jpg",
	"http://image.lotte.com/goods/89/09/08/58/2/258080989_1_280.jpg",
	"http://image.lotte.com/goods/66/00/66/54/2/254660066_1_280.jpg"
};
int arrcnt = 11;
int i=0;
int sint =  Integer.parseInt(String.valueOf(Math.round(orno % 13) + 10));
%>
{
          "rtgs_rsn_list" : [ {
            "ob_rsn_cd" : "33011674",
            "ob_rsn_nm" : "단순변심"
          }, {
            "ob_rsn_cd" : "33011677",
            "ob_rsn_nm" : "오배송 (다른상품 배송)"
          }, {
            "ob_rsn_cd" : "33011679",
            "ob_rsn_nm" : "상품 포장상태 불만"
          }, {
            "ob_rsn_cd" : "33011681",
            "ob_rsn_nm" : "상품 하자/파손"
          }, {
            "ob_rsn_cd" : "33011682",
            "ob_rsn_nm" : "기대수준 미달"
          }, {
            "ob_rsn_cd" : "33011688",
            "ob_rsn_nm" : "본품 또는 구성품(사은품) 누락 배송"
          }, {
            "ob_rsn_cd" : "33011725",
            "ob_rsn_nm" : "가격 불만"
          } ],	
          "exch_rsn_list" : [ {
            "ob_rsn_cd" : "05039160",
            "ob_rsn_nm" : "기대수준 미달"
          }, {
            "ob_rsn_cd" : "05039317",
            "ob_rsn_nm" : "옵션/사이즈 잘못 선택"
          }, {
            "ob_rsn_cd" : "05039157",
            "ob_rsn_nm" : "오배송 (다른상품 배송)"
          }, {
            "ob_rsn_cd" : "05039162",
            "ob_rsn_nm" : "본품 또는 구성품(사은품) 누락되어 배송"
          }, {
            "ob_rsn_cd" : "05039159",
            "ob_rsn_nm" : "상품 포장상태 불만"
          }, {
            "ob_rsn_cd" : "05039161",
            "ob_rsn_nm" : "상품 하자/파손"
          } ],  
	"gift_info":{
		"order_no":"<%=order_no%>",
		"ord_dtl_sn":"21512512544<%=i%>",
		"type":"01",
		"use_yn":"",
		"status":"<%=sint%>",
		"from_nm":"김롯데",
		"to_nm":"홍길동",
    "ord_dtl_sn" : "696657747",
    "orderNo" : "201611144435430",
    "dlvp_sn" : "341934700",
    "sct" : "10",
    "rfg_msg" : "",
    "ob_cd" : "",
    "gift_acq_agr_yn" : "Y",
    "gift_msg_rmnd_trns_cnt" : 3,
    "rtgs_psb_yn" : "Y",
    "exch_psb_yn" : "Y",
    "date" : "20161114",
    "limit_date" : "20161117",
    "to_telno" : "01092501057"
		
	},
	"delivery_info":{
		"deliver":"현대택배",
		"invoice":"693080615521",
		"date":"2016년 6월 10일",
        "url": "http://www.doortodoor.co.kr/jsp/cmn/Tracking.jsp?QueryType=3&pTdNo=1232456789012"
	},
	"ecoupon_info":[
		{
			"name":"유효기간",
			"description":"2016년 5월 29일 ~ 2016년 6월 29일"
		},
		{
			"name":"사용매장",
			"description":"전국 킹콩 떡볶이 매장"
		},
		{
			"name":"주의사항",
			"description":"포인트 적립 및 할인카드 적용 불가"
		},
		{
			"name":"사용여부",
			"description":"사용가능"
		},
		{
			"name":"문의전화",
			"description":"1577-1110"
		}
	],
	"gift_prd_info":{
		"goods_no":"1454358",
		"mall_flag":{
			"is_dept":<%=Math.random()>0.5%>,
			"is_tvhome":<%=Math.random()>0.5%>,
			"is_smartpick":<%=Math.random()>0.5%>
		},
		"img_url":"http:\/\/image.lotte.com\/goods\/38\/47\/44\/49\/2\/249444738_2_280.jpg",
		"brand_nm":"[쉬즈미스]",
		"goods_nm":"[시크헤라/하루메이비外] 여름 신상 원피스 모음전\/민소매\/린넨\/무지\/롱\/여성원피스\/쉬폰원피스",
		"rel_qty":"2",
		"selected_opt":[
			{
				"opt_name":"사이즈",
				"opt_value":"XL"
			},
			{
				"opt_name":"컬러",
				"opt_value":"블루"
			},
			{
				"opt_name":"터그",
				"opt_value":"노터그"
			}
		],
		"opt_list":[
			{
				"opt_name":"사이즈",
				"opt_value_lst":["S", "M", "L", "XL"]
			},
			{
				"opt_name":"컬러",
				"opt_value_lst":["레드", "블루", "블랙", "화이트", "핑크"]
			},
			{
				"opt_name":"터그",
				"opt_value_lst":["노터그", "싱글터그", "더블터그"]
			}
		],
		"opt_item_lst":[
			<%
			int x = 1;
			int y = 1;
			int z = 1;
			int xy = 1;
			int xyz = 1;
			double xyzc = 0;
			for(x=1; x<=4; x++){
				for(y=1; y<=5; y++){
					for(z=1; z<=3; z++){
						if(Math.random() > 0.7){
							if(xy>1){%>,<%}%>{
								"item_no":"<%=xyz%>",
								"opt_val_cd":"<%=x%> x <%=y%> x <%=z%>",
								"opt_tval":"<%=opt1[x]%> x <%=opt2[y]%> x <%=opt3[z]%>",
		      					"inv_qty":10
							}
							<%
							xy++;
						}
						xyz++;
					}
				}
			}
			%>
		]
	},
	"gift_msg_info":{
		"img_url":"\/images\/lotte2015\/temp\/present_message_img.jpg",
		"bg_color":"#fbd3d7",
		"msg":"지혜야 안녕? 잘 지냈지?<br\/>이번에 내 일 도와줘서 고마워^^<br\/>너 덕분에 이번에 얼마나 많은 도움이 됐는지 몰라. 그런 의미로 네게 주는 작은 선물이야!<br\/>예쁘게 입어~ 옷 입고 사진 찍어서 꼭 보내줘<br\/>기대할게! 우리 앞으로도 계속 사이좋게 지내자 안녕~",
		"date":"2016년 6월 5일",
		"limit_date":"2016년 6월 10일"
	},
	"recom_prd_lst":[
		<% for(i=0; i<arrcnt; i++){ %>
		<% if(i>0){ %>,<% } %>{
			"goods_no":"254634462",
			"mall_flag":{
				"is_dept":<%=Math.random()>0.5%>,
				"is_tvhome":<%=Math.random()>0.5%>,
				"is_smartpick":<%=Math.random()>0.5%>
			},
			"img_url":"<%=images[i]%>",
			"brand_nm":"<%=brands[i]%>",
			"goods_nm":"<%=products[i]%>",
			"price":"<%=(int)(Math.random()*1000)%>000"
		}
		<% } %>
	],
	"addr_info":{
		"r_name":"이미준",
		"addr_detail":"03335 서울 은펼구 연서로 25길 21-8, 102호 (갈현동, 동광빌라)",
		"addr_tel":"010-1234-5678",
		"addr_phone":"02-123-4567",
		"addr_msg":"부재시 경비실에 맡겨주세요."
	},
  "ord_addr_info" : {
    "dlvp_sn" : 341934700,
    "r_name" : "이재남",
    "addr_name" : "",
    "addr_post" : "10356",
    "addr1" : "경기 고양시 일산서구 일산3동",
    "addr2" : "1107번지 후곡마을12단지아파트 1207동 2005호",
    "addr_tel" : "010-9250-1057"
  },
	
	"user_addr_info" : {
	    "default_addr" : {
          "dlvp_sn" : 1273279216,
	      "r_name" : "유규국",
	      "addr_name" : "HOME",
	      "addr_post" : "13603",
	      "addr1" : "경기 성남시 분당구 정자동 199번지",
	      "addr2" : " 정든마을동아2단지아파트 206동 202호",
	      "addr_tel" : "010-4631-7451"
	    },
	    "addr_list" : [ {
	      "idx" : 1,
	      "is_default" : false,
	      "dlvp_sn" : 273279216,
	      "r_name" : "유규국",
	      "addr_name" : "도노란",
	      "addr_post" : "150964",
	      "addr1" : "경상북도 구미시 선산읍",
	      "addr2" : " 2013-171",
	      "addr_tel" : "552-6879-9109"
	    }, {
	      "idx" : 2,
	      "is_default" : false,
	      "dlvp_sn" : 332386101,
	      "r_name" : "최경식",
	      "addr_name" : "HOME",
	      "addr_post" : "13603",
	      "addr1" : "경기 성남시 분당구 정자동",
	      "addr2" : "199번지 정든마을동아2단지아파트 206동 202호",
	      "addr_tel" : "010-4631-7451"
	    }]
	},
	
	"xxx_user_addr_info":{
		"default_addr" : {
	      "addr_name" : "은수",
	      "addr_detail" : "전라남도 장흥군 대덕읍 방축리 398-1",
	      "addr_tel" : "552-9554-3128"
	    },
		"addr_list":[
			{
		      "idx" : 1,
		      "is_default" : false,
		      "addr_name" : "유강",
		      "addr_detail" : "전라북도 군산시 산북동 화현리 1139",
		      "addr_tel" : "552-9554-3128"
		    }, {
		      "idx" : 2,
		      "is_default" : false,
		      "addr_name" : "은수",
		      "addr_detail" : "전라남도 장흥군 대덕읍 방축리 398-1",
		      "addr_tel" : "552-9554-3128"
		    }, {
		      "idx" : 3,
		      "is_default" : true,
		      "addr_name" : "심재담금",
		      "addr_detail" : "부산광역시 부산진구 부암동 분천리 3",
		      "addr_tel" : "553-4839-6420"
		    }, {
		      "idx" : 4,
		      "is_default" : true,
		      "addr_name" : "심재담금미",
		      "addr_detail" : "서울특별시 동대문구 전농동 우두리 306",
		      "addr_tel" : "552-2334-2625"
		    }, {
		      "idx" : 5,
		      "is_default" : true,
		      "addr_name" : "현은년",
		      "addr_detail" : "인천광역시 부평구 십정동  418-15",
		      "addr_tel" : "552-2409-3040"
		    }
		]
	}
}