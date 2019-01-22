var LOGIN_EXCEPTION = "9004";
var _rlq = _rlq || []; // 레코벨 수집데이터 push 변수 초기화

/* youtube 재생용 스크립트(https://www.youtube.com/iframe_api에서 호출) */
var player = null;
isLoop =false; // youtube loob 설정값(전역변수)

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
	videoId: $(".vodBox").attr("youtubeID"),
	playerVars: { 'rel' : 0},
	events: {
		'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
	}                      
  });
}

var pauseVideo = function () {
	player.pauseVideo();
};

function onPlayerStateChange(event){ 
    if(event.data == 1){
        //재생시 스타일추천 아이콘 비노출
        $(".recom").hide(); 
    }else if(event.data == 2){
        $(".recom").show();
    }
}

function onPlayerReady(event) {
	//멈춤 관련 페이지별 정의 ===========================    
	//스크롤
	$(window).scroll(function () {
		pauseVideo();    
	}) ;

	//메뉴 열렸을 때 
	$("#wrapper").on("touchend", function () {
		if ($("#main_mylotte").hasClass("on") || $("#s_category").hasClass("on") || !$(".pape span").hasClass("swiper-slide-active")) {
			pauseVideo();
		}                        
	});
}
/* //youtube 재생용 스크립트(https://www.youtube.com/iframe_api에서 호출) */

(function(window, angular, undefined) {
    'use strict';
    
    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
		'lotteSns',
		'lotteSlider',
		'lotteNgSwipe',
		'ngRoute',
		'lotteMainPop',
		'lotteVideo'
	]);

	
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('', {
			routeName: "Default"
		})
		.when('/planProductDetail', {
			routeName: "planProductDetail"
		}).otherwise({
			redirectTo:'/'
		});
	}]);

	app.service('Fnproductview', function () {
		this.replaceAll = function (str, searchStr, replaceStr) {
			if (str != undefined && str != null && str != "") {
				str = str.split(searchStr).join(replaceStr);
			}

			return str;
		};

		this.isEmpty = function (str) {
			var rtnVal = true;

			if (str != undefined && str != null && str != "" && str != 'null') {
				rtnVal = false;
			}

			return rtnVal;
		};

		this.getNumberFormat = function (num) { // 숫자 콤마찍기, 원단위 절삭
			var pattern = /(-?[0-9]+)([0-9]{3})/;
			num = parseInt(num/10)*10;

			while (pattern.test(num)) {
				num = (num + "").replace(pattern, "$1,$2");
			}
			return num;
		};

		this.getNumberFormat2 = function (num) { // 숫자 콤마찍기, 전체 보여주기
			var pattern = /(-?[0-9]+)([0-9]{3})/;
			num = parseInt(num);

			while (pattern.test(num)) {
				num = (num + "").replace(pattern, "$1,$2");
			}

			return num;
		};

		this.toNumber = function (num) { // 문자->숫자
			if (num == undefined || num == null || num == '' ||  num == 'null') {
				return 0;
			} else {
				var strNum = this.objectToString(num);
				try{
					if (strNum.indexOf(',') >= 0) {
						Number(this.replaceAll(strNum,',',''));
					} else {
						return Number(strNum);
					}
				} catch(e) {
					//console.log("toNumber Error ==> " + strNum);
				}
			}
		};

		this.objectToString = function (obj) {
			return obj == undefined ? "" : obj.toString();
		};

		this.goUrl = function ($window, $scope, url, tclick) {
			if (tclick != null) {
				var tclickcd = this.getTclickCd($scope.BasicData.elotte_yn,tclick);
			}

			var fullUrl = "";

			if (url.indexOf("?") >= 0) {
				fullUrl = url + "&" + $scope.baseParam;
			} else {
				fullUrl = url + "?" + $scope.baseParam;
			}

			$window.location.href = fullUrl;
		};

		this.goToLogin = function ($window, $scope,url) {
			var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');

			if (url.indexOf('?') > 0) {
				$window.location.href = url + "&" + $scope.baseParam + targUrl;
			} else {
				$window.location.href = url + "?" + $scope.baseParam + targUrl;
			}
		};

		this.toTimeObject = function (time) { // parseTime(time)
			var year  = time.substr(0,4);
			var month = time.substr(4,2) - 1; // 1월=0,12월=11
			var day   = time.substr(6,2);
			var hour  = time.substr(8,2);
			var min   = time.substr(10,2);
			var min   = time.substr(10,2);

			return new Date(year,month,day,hour,min);
		};

		/*==================================================================
		* 두 Time이 몇 시간 차이나는지 구함
		* time1이 time2보다 크면(미래면) minus(-)
		------------------------------------------------------------------*/
		this.getHourInterval = function (time1, time2) {
			var date1 = (time1 == undefined) ? new Date() : this.toTimeObject(time1); // 대상시간 From
			var date2 = this.toTimeObject(time2); // 대상시간 To
			var hour  = 1000 * 3600; // 1시간
			return parseInt((date2 - date1) / hour, 10);
		};

		/*==================================================================
		* 두 Time이 몇 시간/분 차이나는지 구함
		* time1이 time2보다 크면(미래면) minus(-)
		------------------------------------------------------------------*/
		this.getMinuteIntervalStr =function (time1, time2) {
			var date1 = (time1 == undefined) ? new Date() : this.toTimeObject(time1); // 대상시간 From
			var date2 = this.toTimeObject(time2); // 대상시간 To

			var minute  = parseInt((date2 - date1) / (1000 * 60), 10); // 남은분
			// var rtnVal = parseInt((minute / 60)) + "시간 " + (minute % 60) + "분";
			var sHour = parseInt(minute / 60);;
			var sMinute = parseInt(minute % 60);

			if ((minute / 60) < 10) {
				sHour = "0" + parseInt(minute / 60);
			}

			if ((minute % 60) < 10) {
				sMinute = "0" + parseInt(minute % 60);
			}

			var rtnVal = sHour + "시간 " + sMinute + "분";
			return rtnVal;
		};

		/*==================================================================
		* 자바스크립트 Date 객체를 Time 스트링으로 변환
		* parameter date: JavaScript Date Object, YYYY
		------------------------------------------------------------------*/
		this.toTimeString =function (date, fmt) { // formatTime(date)
			var year  = date.getFullYear();
			var month = date.getMonth() + 1; // 1월=0,12월=11이므로 1 더함
			var day   = date.getDate();
			var hour  = date.getHours();
			var min   = date.getMinutes();
			var sec   = date.getSeconds();

			if (("" + month).length == 1) {
				month = "0" + month;
			}

			if (("" + day).length   == 1) {
				day   = "0" + day;
			}

			if (("" + hour).length  == 1) {
				hour  = "0" + hour;
			}

			if (("" + min).length   == 1) {
				min   = "0" + min;
			}

			if (("" + sec).length   == 1) {
				sec   = "0" + sec;
			}

			var rtnVal = "" + year + month + day + hour + min + sec;

			if (fmt != undefined) {
				rtnVal = fmt.replace("YYYY",year.toString())
					.replace("YY",year.toString())
					.replace("MM",month)
					.replace("DD",day)
					.replace("HH",hour)
					.replace("MN",min)
					.replace("SS",sec);
			}

			return rtnVal;
		};

		/*==================================================================
		* 자바스크립트 Date 객체를 Time 스트링으로 변환
		* parameter date: JavaScript Date Object, YYYY
		------------------------------------------------------------------*/
		this.httpPost = function ($http, targetUrl, param) { // formatTime(date)
			var rtnObj = {};
			rtnObj.isError = false;
			rtnObj.result = null;

			$http({
				method: 'POST',
				url: targetUrl,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function (obj) {
					var str = [];

					for (var p in obj) {
						if (obj[p] != null) {
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						}
					}

					return str.join("&");
				},
				data: param
			}).success(function (data) {
				rtnObj.isError = false;
				rtnObj.result = data;
				return rtnObj;
			})
			.error(function (e) {
				rtnObj.isError = true;
				rtnObj.result = e;
				return rtnObj;
			});

			return rtnObj;
		};

		this.getTclickCd = function (isEllotte,cd) { // 상품상세용 tclick
			var rtnVal = "";

			if (isEllotte) {
				rtnVal = "el_m_o_" + cd;
			} else {
				rtnVal = "m_o_" + cd;
			}

			return rtnVal;
		};

		this.getObjListKey = function (objList, itemkey, itemval) {
			var rtnObj = null;
			var keepGoing = true;

			for (var c = 0; c < objList.length; c++) {
				var rtn = this.getObjKeyValue(objList[c],itemkey);

				if (rtn == itemval) {
					rtnObj = objList[c];
					rtnObj.disp_prio_rnk = c+1;
					break;
				}
			}

			return rtnObj;
		};

		this.getObjKeyValue = function (obj, itemkey) {
			var rtnObj = null;
			var keepGoing = true;

			angular.forEach(obj, function (val, key) {
				if (keepGoing == true) {
					if (key == itemkey) {
						rtnObj = val;
						keepGoing = false;
					}
				}
			});

			return rtnObj;
		};

		//이미지이름구하기
		this.getSubImgName = function (imgName) {
			var retImgNameVal="";

			if (imgName.length > 0) {
				var paramArr = imgName.split("|");
				retImgNameVal = paramArr[0];
			}

			// console.log('retImgNameVal',retImgNameVal);
			return retImgNameVal;
		};

		this.logrecom_type_view_jsonp = function (data) {
			var guestArr = new String();

			for (var i = 0; i < data.items.length; i++) {
				if (i > 0) {
					guestArr += ",";
				}

				guestArr += "\'" + data.items[i] + "\'";
			}

			return guestArr;
		};
	});

    app.controller('ProductCtrl', ['$http', '$rootScope', '$location', '$scope', 'LotteCommon', 'LotteUtil', 'commInitData', 'Fnproductview', '$timeout', '$interval', '$window', '$compile', 'LotteCookie', 'StyleRecom', 'LotteStorage', 'AppDownBnrService', '$route', 'LotteGA',
    	function($http, $rootScope, $location, $scope, LotteCommon, LotteUtil, commInitData, Fnproductview, $timeout, $interval, $window, $compile, LotteCookie, StyleRecom, LotteStorage, AppDownBnrService, $route, LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "상품상세";
        $scope.screenID = "product_view_2017"; // 스크린 아이디
		$scope.alert = function(text){ // alert 메시지 용
			$window.alert(text);
		};
		$scope.Math = $window.Math; // inject Math function

		$scope.sendTclick("m_RDC_ProdDetail_Enter"); // Tclick
		
		var $cont = angular.element("body")[0];
		
		$scope.stayLoading = false; // 주문시 로딩 화면  
		$scope.jsonLoading = false;
		$scope.coachMarkPop = false; // 최초진입시 코치마크
		$scope.alertTemplate = { content: "", button: "" };
		var deliveryMethod = {
			type: "ship",
			onOff: {ship:true, quick: true, smartpic: true},
			showMethodBox: true,
			smartpicOnly: false,
			smartpic: false,
			crosspic: false,
			quick: false
		};

		$scope.pageUI = {
			// pushStateCnt: 0,				// pushState length 관리 (1개이상 push 하지 않도록)
        	baseParam: $scope.baseParam,
        	loadingFail: false,
        	isMyBrand: false,				// 나의 즐겨찾기 브랜드 
        	showDatePicker: false,			// 달력 보여주기 
        	showBrandAdd: false,			// 브랜드 즐겨찾기 팝업
        	showBrandAddResult: false,		// 브랜드 즐겨찾기 공통 얼럿 
        	showCartAddResult: false,		// 장바구니 결과 공통 얼럿 
        	showPlanDetail: false,			// 기획전 상세 자세히 보기 
        	productInfoMoreBtn: false,		// 상품 정보 더보기
			productInfoMoreBtnUp:  false, // 상품 정보 접기
			productInfoGradient:  false, // 상품정보 그라데이션
			todayArriveShipInfo: false,		// 오늘도착 안내
			nintCardOpen: false, // 무이자혜택 카드혜택 팝업
			smpOpen: false, // 스마트픽 팝업
        	time: {
        		serverTime: '',
        		localTime: '',
        		quickTimeS: '',		// 퀵배송 주문 가능 시작 시간 
				quickTimeE: ''		// 퀵배송 주문 가능 종료 시간
        	},
        	giftServiceInfo: {				// 무료포장 선물카드
        		showPopup:  false,
				giftPkgImgUrl: null,
				futMsgImgUrl: null
			},
        	planProduct: {
        		show: false,
        		idx: 0,						// 선택한 기획전 상품 인덱스
        		goodsNo: 0,					// 선택한 상품번호 
        		showSelectBox: false,		// 기획전 상품 리스트 선택창 
        		data: {}					// 기획전 상세 데이터
        	},
        	wish: {},
        	data: {},
        	chanel: {
        		selectColorNo: '',
        		imgUrl: '',
        		data: {}
        	},
        	myBrand: {},
        	myBrandStr: "",
        	loadData: {
        		product_detail: null,		// 상품상세 디테일 정보
        		//상품정보
        		planPrdInfo: null, // 기획전 상품 모아보기
        		product_saleBest: null, // 다른 고객들이 가장 많이 산 카테고리명 상품
        		product_similarStyle: null, // 비슷환 스타일 추천
        		product_comment: null, // 상품평
        		product_qna: null, // Q&A
        		product_brandBest: null, // 베스트 상품
        		product_bestView: null, // 다른 고객들이 함께 본 상품
        		product_mdRecom: null, // MD가 추천하는 상품
        		product_togePlan: null, // 함께 볼만한 기획전
        		chanel_relation_info: null,
        		product_bottom_banner: null // 하단 배너
        	},
        	isLoad: {
        		product_detail: false,
        		product_comment: false,
        		chanel_relation_info: false
        	},
        	reqParam: {},
			popupQuickInfo: false, 		// 퀵배송 안내
			popupQuickInfo2: false, 	// 퀵배송 주문 가능시간
			popupSmartPickInfo: false, 	// 스마트픽 안내
        	option: {
        		goodsNo: 0,
        		planIdx: 0,
        		quickDisp: false,
        		lpayShow: false, // LPay 말풍성 활성화 여부
        		searchKey: "", // 옵션 검색 키워드
        		showSoldout: false, // 품절바 여부
        		selectBox: false, // 옵션 선택창 활성화 여부
        		selectOption: [], // 선택 완료된 옵션 배열
        		selectStep: 1, // 옵션 레이어 선택 단계 Step
        		selectedType: '', // 옵션 선택창 타입 (cart: 장바구니, but: 바로구매, gift: 선물하기)
        		selectedIdx: 0,
        		selectedBox: false, // 옵션 선택 완료창 활성화 여부
        		selectedItem: {gift:[],buy:[],cart:[]},
        		selectedPrice: {gift:0,buy:0,cart:0},
        		selectedCnt: {gift:0,buy:0,cart:0},
        		minorityLimit: {gift:false,buy:false,cart:false},
        		selectDateInputItem: {idx: null, inputIdx: null},
        		inputOption: [],
        		planSelect: false,
        		calendar: false,
        		data: {},
				deliveryMethod: {gift:{},buy:{},cart:{}},
				radioValue:"ship", // 20180518 배송방법 및 선물하기 라디오버튼 체크 값
				holdingType : "" // 선물하기 이전 선택 타입 저장
        	},
        	// option data
			togeListOpen: false,
			mdNotiOpen: true,
			colorSelectIdx: null,	// 샤넬 등의 컬러칩 선택값
			styleIconShow: true,
			openHopePop: false,  // lg 희망배송일
			showOrderSimple :false,  //간편 주문서 레이어 노출
			orderLoading:false, // 간편주문서 로딩 문구
			orderSuccess:false, // 주문성공여부
			targetFrame : "", // 간편 주문서 타켓 프레임
			giftChk : true, // 선물하기 선택가능 여부
			cultureY : true,// 도서.문화 소득공제 체크 여부
			prdCtgInfoData : {} // 상품 카테고리 정보 데이터
		};
		
		angular.copy(deliveryMethod, $scope.pageUI.option.deliveryMethod.gift);
		angular.copy(deliveryMethod, $scope.pageUI.option.deliveryMethod.buy);
		angular.copy(deliveryMethod, $scope.pageUI.option.deliveryMethod.cart);
            
		// 코치마크 팝업 체크 
		//LotteStorage.delLocalStorage("productCoachMarkPop");
		var productCoachMarkPop = LotteStorage.getLocalStorage("productCoachMarkPop");
		if(!productCoachMarkPop && (!$scope.appObj.isApp || 
			($scope.appObj.isApp && $scope.appObj.isAndroid && $scope.appObj.verNumber <= 295) || 
			($scope.appObj.isApp && $scope.appObj.isIOS && $scope.appObj.verNumber <= 2840)
		)) {
			$scope.coachMarkPop = true;
			LotteStorage.setLocalStorage("productCoachMarkPop",'1');
		}
		
		$scope.coachMarkPopClose = function() {
			$scope.coachMarkPop = false;
		}
		
        $scope.showStayLoading = function() {
        	$scope.stayLoading = true; // 주문시 로딩 화면 
        }

        $scope.hideStayLoading = function() {
        	$scope.stayLoading = false; // 주문시 로딩 화면 
        }
        
        //201804 광고솔루션 ============================
		if (!Fnproductview.isEmpty(commInitData.query['clickId'])) {
			LotteCookie.setCookie("ADCLICKID", commInitData.query['clickId'], 30);
		}                
        
		if (!Fnproductview.isEmpty(commInitData.query['upCurDispNo'])) {
			$scope.pageUI.reqParam.upCurDispNo = Fnproductview.objectToString(commInitData.query['upCurDispNo']); // 상위 카테고리번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['curDispNo'])) {
			$scope.pageUI.reqParam.curDispNo = Fnproductview.objectToString(commInitData.query['curDispNo']); // 카테고리번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['goods_no'])) {
			$scope.pageUI.reqParam.goods_no = Fnproductview.objectToString(commInitData.query['goods_no']); // 상품번호
			$scope.op_goods_no = $scope.pageUI.reqParam.goods_no; //goods_no 를 유지하기위함 201701
		}

		if (!Fnproductview.isEmpty(commInitData.query['wish_lst_sn'])) {
			$scope.pageUI.reqParam.wish_lst_sn = Fnproductview.objectToString(commInitData.query['wish_lst_sn']); // 위시리스트번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['cart_sn'])) {
			$scope.pageUI.reqParam.cart_sn = Fnproductview.objectToString(commInitData.query['cart_sn']); // 장바구니 번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['item_no'])) {
			$scope.pageUI.reqParam.item_no = Fnproductview.objectToString(commInitData.query['item_no']); // 단품번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['genie_yn'])) {
			$scope.pageUI.reqParam.genie_yn = Fnproductview.objectToString(commInitData.query['genie_yn']); // 빅딜여부
		}

		if (!Fnproductview.isEmpty(commInitData.query['curDispNoSctCd'])) {
			$scope.pageUI.reqParam.curDispNoSctCd = Fnproductview.objectToString(commInitData.query['curDispNoSctCd']); // 유입코드
		}

		if (!Fnproductview.isEmpty(commInitData.query['late_view_yn'])) {
			$scope.pageUI.reqParam.late_view_yn = Fnproductview.objectToString(commInitData.query['late_view_yn']); // 최근본상품여부
		}

		if (!Fnproductview.isEmpty(commInitData.query['cn'])){$scope.pageUI.reqParam.cn = Fnproductview.objectToString(commInitData.query['cn']);/* 채널코드 */}
		if (!Fnproductview.isEmpty(commInitData.query['cdn'])){$scope.pageUI.reqParam.cdn = Fnproductview.objectToString(commInitData.query['cdn']);/* 채널상세코드 */}
        
        //도서산간, 제주 배송비 
        $scope.delivery_pop = {
            dlvfee1 : 0,
            dlvfee2 : 0
        }                
        $scope.delivery_popup = function(val1, val2){
            $scope.delivery_pop.dlvfee1 = val1;
            $scope.delivery_pop.dlvfee2 = val2;
            $scope.pageUI.delivery_pop = true;
        }    
        $scope.delivery_view = function(){
            location.href = LotteCommon.delivery_view_url +"?"+ $scope.baseParam;
        }    
		// L.Pay 말풍선 노출
		// 하루에 한번 노출
		$scope.lpyaIconCheck = function() {
			if($scope.pageUI.data.commonInfo.lpayDispYn) {
				var today = new Date();
				var ymd = today.getFullYear()+""+today.getMonth()+""+today.getDate();
				var initLpayIcon = {
						show: true,
						date: ymd
				}
				var lpayIconInfo = LotteStorage.getLocalStorage('lpayIconInfo');
				if(lpayIconInfo != null && lpayIconInfo != ""){
					var lpayData = JSON.parse(lpayIconInfo);
					if(lpayData.date == ymd) {
						if(!lpayData.show) {
							$scope.pageUI.option.lpayShow = false;
						} else {
							$scope.pageUI.option.lpayShow = true;
						}
					} else {
						LotteStorage.setLocalStorage("lpayIconInfo", initLpayIcon, 'json');
						$scope.pageUI.option.lpayShow = true;
					}
				} else {
					LotteStorage.setLocalStorage("lpayIconInfo", initLpayIcon, 'json');
					$scope.pageUI.option.lpayShow = true;
				}
			}						
		}
		
		// 스타일 추천 아이콘 클릭 이벤트
		$scope.goStyleRecom = function (imgIdx, tclick) {
			StyleRecom.setTclickBase = $scope.tClickRenewalBase; // 스타일 추천 티클릭 Base 리뉴얼용으로 변경

			var styleRecomTargetImg = $scope.pageUI.data.imgInfo.imgList[0],
				curImgIdx = $scope.sb_index - 1;

			// $scope.pageUI.data.imglist[i]
			if (!imgIdx && imgIdx !== 0 && $scope.pageUI.data.imglist.length > curImgIdx && $scope.pageUI.data.imglist[curImgIdx] && $scope.pageUI.data.imglist[curImgIdx].type == "img") {
				styleRecomTargetImg = $scope.pageUI.data.imglist[curImgIdx].img;
			}

			var obj = {
				"image"		: styleRecomTargetImg,
				"goodsNo"	: commInitData.query["goods_no"],
				"screen"	: "detail"
			}
			//StyleRecom.detect(styleRecomTargetImg, function (list) {
			StyleRecom.detect(obj, function (list) {
				if (list.length > 0 && $scope.pageUI.data.imgInfo.styleShopUrl) { // 리스트가 있고 스타일샵 링크가 있을 경우 스타일추천 페이지로 이동
					var more = "";
					var tclickCode = "&tclick=" + (tclick ? tclick : "m_RDC_ProdDetail_Clk_RelSty");
					var styleRecomShopUrl = LotteCommon.isTestFlag ? LotteCommon.styleRecomUrl : $scope.pageUI.data.imgInfo.styleShopUrl;

					ga("send", {
						"hitType"		: "event",
						"eventCategory"	: "MO_상품상세_스타일추천",
						"eventAction"	: "스타일추천아이콘",
						"eventLabel"	: ""
					});
					$scope.logGAEvtPrdView('스타일추천','스타일추천아이콘');
					// cate값은 서버에서 붙여줌
					// if ($scope.pageUI.data.imgInfo.styleRecommCatGrpCd != undefined) {
					// 	more = "&cate=" + $scope.pageUI.data.imgInfo.styleRecommCatGrpCd;
					// }
					
					var obj = {
						"img"		: styleRecomTargetImg,
						"tclick"	: (tclick ? tclick : "m_RDC_ProdDetail_Clk_RelSty"),
						"goods_no"	: commInitData.query["goods_no"],
						"prdGen"	: $scope.pageUI.data.imgInfo.genCd,
						"sortCate"	: list[0].category
					}
					
					location.href = $scope.baseLink(styleRecomShopUrl) + "&" + $.param(obj);
					//window.location.href = $scope.baseLink(styleRecomShopUrl) + "&img=" + styleRecomTargetImg + tclickCode + "&goods_no=" + commInitData.query["goods_no"] + "&prdGen=" + $scope.pageUI.data.imgInfo.genCd;
				} else { // 리스트가 없을때는 Alert, Error Tclick
					var tmphour = new Date().getHours();

					if (("" + tmphour).length  == 1) {
						tmphour  = "0" + tmphour;
					}
					$scope.sendTclick("m_RDC_ProdDetail_DataError_HH_" + tmphour + "_" + $scope.pageUI.data.commonInfo.goodsNo);
					$scope.logGAEvtPrdView();
					alert("죄송합니다. 추천 상품을 준비중입니다.");
				}
			});//, commInitData.query["goods_no"], "detail", $scope.appObj.isApp);
		};
		
		$scope.numberFill = function(idx, length) {
			var strIdx = "" + idx;
			var fillData = "00000000000000000";
			return fillData.substring(0,length - strIdx.length) + strIdx;
		}
		
		$scope.soldOutCheck = function(goodsNo, key) {
			for(i=0;i < $scope.pageUI.option.data[goodsNo].optDtlList.items.length;i++) {
				var item = $scope.pageUI.option.data[goodsNo].optDtlList.items[i];
				if(item.optValCd.indexOf(key+" x") == 0 || item.optValCd == key) {
					if(item.invQty != 0 || !item.optStkYn) {
						return false;
					}
				}
			}
			return true;
		}
		
		// 상품 옵션 데이터 처리 
		$scope.productOptionDataProc = function(goodsNo, flag) {
			var optionScope = angular.element("#optionWrap").scope();
			$scope.pageUI.option.goodsNo = goodsNo;
			if($scope.pageUI.option.data[goodsNo].optSelectList) {
				for(var i=0;i < $scope.pageUI.option.data[goodsNo].optSelectList.items[0].itemList.items.length;i++) {
					var key = $scope.pageUI.option.data[goodsNo].optSelectList.items[0].itemList.items[i].optValCd;
					$scope.pageUI.option.data[goodsNo].optSelectList.items[0].itemList.items[i].dtl = optionScope.findOptionItem(goodsNo, key);
					$scope.pageUI.option.data[goodsNo].optSelectList.items[0].itemList.items[i].soldout = $scope.soldOutCheck(goodsNo, key);
				}
				$scope.pageUI.option.selectOption = [];
			}
			switch(flag) {
				case 'cart':
					$scope.pageUI.option.selectedType = 'cart';
					optionScope.showOptionBox(flag);
					break;
				case 'planBuy':
					$scope.pageUI.option.selectedType = 'buy';
					optionScope.showOptionBox();
					break;
				case 'planGift':
					if($scope.pageUI.option.data[goodsNo].dlvInfo.gubunCd == '1' ||
							$scope.pageUI.option.data[goodsNo].dlvInfo.gubunCd == '2' ||
							$scope.pageUI.option.data[goodsNo].dlvInfo.gubunCd == '3' ||
							$scope.pageUI.option.data[goodsNo].dlvInfo.gubunCd == '6' ||
							$scope.pageUI.option.data[goodsNo].dlvInfo.gubunCd == '9') {
						$scope.productViewAlert({type:'alert',msg:'선택하신 상품은 선물하기 주문이 불가합니다.',time:2500});
						return false;
					}
					$scope.pageUI.option.selectedType = 'gift';
					optionScope.showOptionBox();
					break;
				case 'planCart':
					optionScope.buyItNow('m_RDC_ProdDetail_Clk_PlanPrd_Cart');
					break;
			}
			$timeout(function() {
				var optionScope = angular.element("#optionWrap").scope();
				optionScope.setOptionLayer(goodsNo, flag);
			},100);
		}
		
		// 상품 옵션 데이터 로드
		$scope.loadProductOption = function(goodsNo, flag, curDispNoSctCd) {
			var url = LotteCommon.productOptionData(goodsNo);
			if(curDispNoSctCd) {
				url += '&curDispNoSctCd='+curDispNoSctCd;
			}

			if($scope.pageUI.option.data[goodsNo]) {
				
				$scope.productOptionDataProc(goodsNo, flag);
				
			} else {
				$scope.jsonLoading = true;
				
				$http.get(url)
				.success(function (data) {
					if (data.data) {
						$scope.pageUI.option.data[goodsNo] = data.data;
						if ($scope.pageUI.data.commonInfo.chanelYn && // 샤넬 상품이라면
							$scope.pageUI.option.data[goodsNo].optDtlList) { // 선택된 상품의 옵션 상세 리스트가 있다면
							if ($scope.pageUI.option.data[goodsNo].optSelectList) {
								for (var i=0;i < $scope.pageUI.option.data[goodsNo].optSelectList.items[0].itemList.items.length;i++) {
									$scope.pageUI.option.data[goodsNo].optSelectList.items[0].itemList.items[i];
									for(var j=0;j < $scope.pageUI.option.data[goodsNo].optDtlList.items.length;j++) {
										var item = $scope.pageUI.option.data[goodsNo].optDtlList.items[j];
										if($scope.pageUI.option.data[goodsNo].optSelectList.items[0].itemList.items[i].optValCd == item.optValCd) {
											$scope.pageUI.option.data[goodsNo].optSelectList.items[0].itemList.items[i].colorImgUrl = item.imgUrl ? item.imgUrl:'';
										}
									}
								}
							}
						}
					
						$scope.productOptionDataProc(goodsNo, flag);
					}
				})
				.finally(function () {
					$scope.jsonLoading = false;
				});
			}
		}
		
		// 장바구니 curDispNoSctCd
		$scope.addCartOptionSelect = function(item, tclick) {
			var curDispNoSctCd = item.curDispNoSctCd;
			$timeout(function() {
				angular.element("#optPopupWrap").scrollTop(0);
			},300);
			$scope.loadProductOption(item.goodsNo, 'cart', curDispNoSctCd);

			if (tclick) {
				$scope.sendTclick(tclick);
			}
		}
		
		/**
		 * 3회 방문 체크
		 */
		$scope.visitThreeTimesCheck = function(goodsNo, brandNo) {
			// 기획전 상세 체크 안함
			if($scope.pageUI.data.commonInfo.goodsCmpsCd == '30' || !brandNo) {
				return false;
			}
			
			var brandInfo = LotteStorage.getLocalStorage("productVisitBrand");
			var d = new Date();
			var ymd = d.getFullYear()+""+d.getMonth()+""+d.getDate();
			var initBrand = {
				visit: 1,
				goods: '|'+goodsNo+'|'
			}

			if($scope.pageUI.myBrandStr != '') {
				if($scope.pageUI.myBrandStr.indexOf("|"+brandNo+'|') >= 0) {
					return false;
				}
			}

			if(brandInfo != null && brandInfo != ""){
				var brandData = JSON.parse(brandInfo);
				// console.log(brandData);
				if(brandData.brand[brandNo]) {
					if(brandData.date == ymd) {
						if(!brandData.pass) {
							// 당일 방문상품 여부 체크
							if(brandData.brand[brandNo].goods.indexOf(goodsNo) < 0) {
								// 다른 상품 같은 브랜드 방문 
								brandData.brand[brandNo].visit++;
								brandData.brand[brandNo].goods += '|'+goodsNo+'|';
								LotteStorage.setLocalStorage("productVisitBrand", brandData, 'json');
							}
							if(brandData.brand[brandNo].visit >= 3) {
								// 3회이상 방문 즐겨찾기
								console.log("3회이상 방문+++++");
								$timeout(function() {
									$scope.showBrandAddToday();
								},100);
							}
							return true;
						} else {
							return true;
						}
					} else {
						brandData.date = ymd;
						brandData.pass = false;
					}
				}
				brandData.brand[brandNo] = initBrand;
				LotteStorage.setLocalStorage("productVisitBrand", brandData, 'json');
			} else {
				brandData = { brand: {}, pass: false, date: ymd };
				brandData.brand[brandNo] = initBrand;
				LotteStorage.setLocalStorage("productVisitBrand", brandData, 'json');
			}
		} 
		
		$scope.goBrandPage = function (brandNo) {
			$window.location.href = LotteUtil.setUrlAddBaseParam(LotteCommon.brandShopSubUrl , $scope.pageUI.baseParam + "&upBrdNo="+brandNo+"&tclick=");
		}
		
		$scope.getMyBrandCnt = function(){
			var searchStr = $scope.pageUI.myBrandStr;
			var cnt = (searchStr.split("|").length - 1) / 2;
			return cnt;
		}
		
		/*
		파라미터값 정의 flag : 등록 (i), 삭제(d), 조회시 없음
		brnd_no : 등록,삭제할 브랜드번호
		등록,삭제 : http://m.lotte.com/json/main_new/my_brnd_info.json?flag=i&brnd_no=33143
		조회 : http://m.lotte.com/json/main_new/my_brnd_info.json
		*/
		$scope.brandBookMark = function(brandNo, type, mode, brandNm) {
			$scope.closeBrandAdd();
			if (!$scope.loginInfo.isLogin) { /*로그인 안한 경우*/
				alert('로그인 후 이용하실 수 있습니다.');
				Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
				return false;
			} else {
				if(!type) {
					type = 'add';
				}
				var flag = (type == 'add') ? 'i':'d';
				var jsonUrl = LotteCommon.myBrandInfo+"?flag="+flag+"&brnd_no="+brandNo;
				var myBrandCnt = $scope.getMyBrandCnt();
				if(myBrandCnt > 50){
					$scope.productViewAlert({type:'alert',msg:'브랜드 즐겨찾기는 최대 50개까지 가능합니다.',time:2500});
					return;
				}

				var httpConfig = {
					method: "get",
					url: jsonUrl
				};
				$scope.jsonLoading = true;
				
				$http(httpConfig)
				.success(function (data) {
					if(mode == 'popup') {
						$scope.pageUI.myBrandStr += "|"+brandNo+"|";
						$scope.productViewAlert({type:'brand',time:2500, brandNo: brandNo});
					} else if(type == 'add') {
						$scope.pageUI.myBrandStr += "|"+brandNo+"|";
						$scope.pageUI.loadData.product_brandBest.saveBrndYn = true;
						$scope.productViewAlert({type:'alert',msg:brandNm +' 브랜드를 즐겨찾기에 추가하였습니다.',time:2500});
					} else if(type == 'del') {
						$scope.pageUI.myBrandStr = $scope.pageUI.myBrandStr.replace("\|"+brandNo+"\|","");
						$scope.pageUI.loadData.product_brandBest.saveBrndYn = false;
						$scope.pageUI.isMyBrand = false;
						$scope.productViewAlert({type:'alert',msg:brandNm +' 브랜드를 즐겨찾기에서 삭제하였습니다.',time:2500});
					}
				})
				.finally(function () {
					$scope.jsonLoading = false;
				});
			}
		}

		// 브랜드 즐겨찾기창 오늘 하루 보이지 않기 
		$scope.closeBrandAddToday = function() {
			var brandInfo = LotteStorage.getLocalStorage("productVisitBrand");
			var brandData = JSON.parse(brandInfo);
			brandData.pass = true;
			LotteStorage.setLocalStorage("productVisitBrand", brandData, 'json');
			$scope.closeBrandAdd();
		}
		
		// 브랜드 즐겨찾기 닫기
		$scope.closeBrandAdd = function() {
			if($scope.pageUI.showBrandAdd) {
				$scope.pageUI.showBrandAdd = false;
				$scope.dimmedClose();
			}
		}
		
		// 브랜드 즐겨찾기 
		$scope.showBrandAddToday = function() {
			$scope.pageUI.showBrandAdd = true;
			$scope.dimmedOpen({
				target: "brandVisitThreeTimes",
				callback: this.closeBrandAdd
			});
			$scope.LotteDimm.dimmedOpacity = "0.6";
			$timeout(function() {
				angular.element("#lotteDimm").css("z-index", "110");
			});
		}
	
		// 상품상세 데이터 로드
		$scope.productDataLoad = function() {
			$scope.jsonLoading = true;
			$http.get(LotteCommon.productProductView2017Data, {params:$scope.pageUI.reqParam})
			.success(function(data) {
                //20171228 기획전형 샤넬 -> 일반 기획전형으로 변환
                if (data.data.commonInfo.goodsCmpsCd == '30' && data.data.commonInfo.chanelYn) {
                    data.data.commonInfo.chanelYn = false;    
                }
				
				$scope.pageUI.data = data.data;
				
				//20180528 선물하기 안내 문구 추가
				var prdInfoList = $scope.pageUI.data.basicInfo.itemInfoList.items;
				angular.forEach(prdInfoList, function(val,key){

					//상품정보 리스트에 선물서비스가 있다면 비노출처리
					if(val.key == '선물서비스'){
						$scope.pageUI.giftChk = false;
						return;
					}

				});

				// console.log("$scope.pageUI", $scope.pageUI);
				if($scope.pageUI.data) {
					// 이미지 재배열
					if($scope.pageUI.data.imgInfo && $scope.pageUI.data.imgInfo.imgList) {
						$scope.pageUI.data.imglist = [];
						
						var i;
						for(i=0;i < $scope.pageUI.data.imgInfo.imgList.length;i++) {
							$scope.pageUI.data.imglist[i] = {};
							$scope.pageUI.data.imglist[i].img =  $scope.pageUI.data.imgInfo.imgList[i];
							$scope.pageUI.data.imglist[i].type = "img";
						}
						
						if($scope.pageUI.data.imgInfo.wecandeoVodUrl || $scope.pageUI.data.imgInfo.youtubeVodUrl || $scope.pageUI.data.imgInfo.prdVodUrl) {
							$scope.pageUI.data.imglist[0].type = "vodimg";
							$scope.pageUI.data.imglist[0].playidx = i;
							$scope.pageUI.data.imglist[i] = {
									img: $scope.pageUI.data.imgInfo.wecandeoImgUrl,
									type: 'vod'
							};
							if($scope.pageUI.data.imgInfo.wecandeoVodUrl) {
								$scope.pageUI.data.imglist[i].vodurl = $scope.pageUI.data.imgInfo.wecandeoVodUrl;
							} else if($scope.pageUI.data.imgInfo.youtubeVodUrl) {
								$scope.pageUI.data.imglist[i].vodurl = $scope.pageUI.data.imgInfo.youtubeVodUrl;
								$scope.pageUI.data.imglist[i].type = "youtube";
							} else if($scope.pageUI.data.imgInfo.prdVodUrl) {
								$scope.pageUI.data.imglist[i].vodurl = $scope.pageUI.data.imgInfo.prdVodUrl;
							}
						}
					}
	
					// console.log($scope.pageUI.data.imglist);
					// 플레그 재조립
					if($scope.pageUI.data.prdInfo) {
						$scope.pageUI.data.prdInfo.flagData = [];
						if($scope.pageUI.data.prdInfo.flag) {
							for(i=0;i < $scope.pageUI.data.prdInfo.flag.length;i++) {
								$scope.pageUI.data.prdInfo.flagData[i] = {};
								switch($scope.pageUI.data.prdInfo.flag[i]) {
								case "dept":
									$scope.pageUI.data.prdInfo.flagData[i].name = "롯데백화점";
									$scope.pageUI.data.prdInfo.flagData[i].css = "depart";
									break;
								case "tvhome":
									$scope.pageUI.data.prdInfo.flagData[i].name = "롯데홈쇼핑";
									$scope.pageUI.data.prdInfo.flagData[i].css = "tv_shopping";
									break;
								case "himart":
									$scope.pageUI.data.prdInfo.flagData[i].name = "하이마트";
									$scope.pageUI.data.prdInfo.flagData[i].css = "himart";
									break;
								case "smartpick":
									$scope.pageUI.data.prdInfo.flagData[i].name = "스마트픽";
									$scope.pageUI.data.prdInfo.flagData[i].css = "smartpick";
									break;
								case "freeDlv":
									$scope.pageUI.data.prdInfo.flagData[i].name = "무료배송";
									$scope.pageUI.data.prdInfo.flagData[i].css = "freeDlv";
									break;
								}
							}
						}
					}

					// L.Pay Icon 상태 체크 
					$scope.lpyaIconCheck();

					// 퀵배송 주문 시간체크를 위한 서버시간 로컬시간 저장
					var d = new Date();

					if (!$scope.pageUI.data.commonInfo.nowServerTime) { // 서버타임이 없을 경우 방어
						$scope.pageUI.data.commonInfo.nowServerTime = Fnproductview.toTimeString(d, "YYYYMMDDHHMNSS");
					}
					
					var serverYYYY = $scope.pageUI.data.commonInfo.nowServerTime.substr(0,4);
					var serverMM = $scope.pageUI.data.commonInfo.nowServerTime.substr(4,2);
					var serverDD = $scope.pageUI.data.commonInfo.nowServerTime.substr(6,2);
					var serverHH = $scope.pageUI.data.commonInfo.nowServerTime.substr(8,2);
					var serverII = $scope.pageUI.data.commonInfo.nowServerTime.substr(10,2);
					var serverSS = $scope.pageUI.data.commonInfo.nowServerTime.substr(12,2);
					$scope.pageUI.time.quickTimeS = new Date(serverYYYY,serverMM,serverDD,'09','00','00','000','GMT+0900').toString();
					$scope.pageUI.time.quickTimeE = new Date(serverYYYY,serverMM,serverDD,'16','30','59','000','GMT+0900').toString();
					$scope.pageUI.time.serverTime = new Date(serverYYYY,serverMM,serverDD,serverHH,serverII,serverSS,'000','GMT+0900').toString();
					$scope.pageUI.time.localTime = d.toString();

					// 기획전 상품 재조립
					if ($scope.pageUI.data.commonInfo.goodsCmpsCd == '30') {
						if($scope.pageUI.data.planPrdInfo) {
							for(var i=0;i < $scope.pageUI.data.planPrdInfo.prdList.items.length;i++) {
								$scope.pageUI.data.planPrdInfo.prdList.items[i].idx = i;
							}
						} 
						$scope.pageUI.option.selectStep == 0;
					} else {
						// 일반 옵션 로드
						$scope.pageUI.option.selectStep == 1;
						$scope.loadProductOption($scope.pageUI.reqParam.goods_no);
					}
					
					$scope.pageUI.wish[$scope.pageUI.reqParam.goods_no] = $scope.pageUI.data.prdInfo.saveWishYn;
					
					if ($scope.pageUI.data.commonInfo.chanelYn) {
						$scope.pageUI.chanel.imgUrl = $scope.pageUI.data.imglist[0].img;
					}
					
					$scope.dataLoadAfterFunc();
					
					$timeout(function () {
						$win.scrollTop(0);
					}, 100);

					// 20170829 박형윤 수집스크립트 누락본 추가
					/**
					 * 와이더플래닛 모바일 스크립트
					 * 2016.09.19 한상훈
					 */
					$timeout(function() {
						var items = [{i: $scope.pageUI.reqParam.goods_no, t: $scope.pageUI.data.prdInfo.goodsNm}];
						$scope.addWiderPlanetLog("Item", items);
					}, 3000);

					/**
	 				 * ACE 리타케팅 스크립트 (detail)
	 				 * 적용 기간 : 2017.08.01 ~ 2018.01.31
	 				 * 2017.07.28 고영우
	 				 */
					// function aceRetargetingDetail() {
					var aceRetargetingDetail = function () {
						if (angular.element('#aceRetargetingDetail').length == 0) {
							var body = angular.element("body")[0];
							var scr = document.createElement("script");
							scr.type = "text/javascript";
							scr.id = "aceRetargetingDetail";
							scr.src = "//static.tagmanager.toast.com/tag/view/830";
							scr.onload = function() {
								window.ne_tgm_q = window.ne_tgm_q || [];
								window.ne_tgm_q.push({
									tagType: 'detail',
									device: 'mobile'/*web, mobile, tablet*/,
									uniqValue: '',
									pageEncoding: 'utf-8',
									items : [{
										id: $scope.pageUI.reqParam.goods_no, // ID값입력
										price: $scope.pageUI.data.prdPriceInfo.price, // 가격정보입력
										quantity: "1", // 갯수정보입력
										category: "", // 카테고리 대|중|소
										imgUrl: $scope.pageUI.data.imglist[0].img, // img링크값입력 ex)http://example.com/img/img.jpg
										name: $scope.pageUI.data.prdInfo.goodsNm, // 제품명또는 전환메뉴명입력
										desc: "", // 상품상세 설명 text
										link: "http://m.lotte.com/product/m/product_view.do?goods_no=" + $scope.pageUI.reqParam.goods_no // 상품상세페이지 URL ex)http://example.com/detail/product.html
									}]
								});
							};

							body.appendChild(scr);
						}
					}
					aceRetargetingDetail();

					/**
	 				 * 레코벨 수집스크립트
	 				 * 2018.07.5 김낙운
                     * 2018.09.18 김응 기획전이 아닌 경우 카테고리 정보 추가 
	 				 */
	 				$scope.recobellCollectLog = function () {
				        var rlqDevice = "MW";
				        if ($scope.appObj.isApp && $scope.appObj.isAndroid) {
				            rlqDevice = "MA";
				        } else if ($scope.appObj.isApp && $scope.appObj.isIOS) {
				            rlqDevice = "MI";
				        }
				        // recobell용
                        _rlq.push(['setVar','cuid','fdd29847-94cd-480d-a0d9-16144485d58b']);
                        _rlq.push(['setVar','device',rlqDevice]);
                        _rlq.push(['setVar','itemId',$scope.pageUI.data.commonInfo.goodsNo ? $scope.pageUI.data.commonInfo.goodsNo : ""]);                        
                        _rlq.push(['setVar','brandId',$scope.pageUI.data.commonInfo.goodsCmpsCd != "30" ? $scope.pageUI.data.commonInfo.collectBrndNo : ""]);                        
                        //20180918 카테고리 정보 수집    
                        //기획전이면 null 을 전달 
                        if($scope.pageUI.data.commonInfo.goodsCmpsCd == 10 || $scope.pageUI.data.commonInfo.goodsCmpsCd == 30){
                            _rlq.push(['setVar','cateId01', null]);
                            _rlq.push(['setVar','cateId02', null]);
                            _rlq.push(['setVar','cateId03', null]);
                        }else{
                            //기획전이 아니면 카테고리 정보를 추가로 전달함
                            _rlq.push(['setVar','cateId01', $scope.pageUI.prdCtgInfoData.disp_lrg_no]);
                            _rlq.push(['setVar','cateId02', $scope.pageUI.prdCtgInfoData.disp_mid_no]);
                            _rlq.push(['setVar','cateId03', $scope.pageUI.prdCtgInfoData.disp_sml_no]);
                        }
                        _rlq.push(['setVar','userId',LotteCookie.getCookie('MBRNO') ? LotteCookie.getCookie('MBRNO') : ""]);
                        _rlq.push(['track','view']);
                        setTimeout(function() {
                          (function(s,x){s=document.createElement('script');s.type='text/javascript';
                          s.async=true;s.defer=true;s.src=(('https:'==document.location.protocol)?'https':'http')+ '://d1hn8mrtxasu7m.cloudfront.net/rblc/js/rblc-apne1.min.js';
                          x=document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);})();
                        }, 0);                        
	 				}

					/**
					 * ADN 광고스크립트
					 * 적용 기간 : 2018.08.30 ~ 2019.02.28
					 * 2018.08.28 주영남
					 */
					function adAdn(){

						if($('#AdnTag').length == 0){
						var body = document.getElementsByTagName("body")[0];
							var scr = document.createElement("script");
								scr.type = "text/javascript";
								scr.id = "AdnTag";
								scr.async = true;
								scr.src = "//fin.rainbownine.net/js/adn_tags_1.0.0.js";

							body.appendChild(scr);

						}

						// console.log("ADN 광고 스크립트 상품상세 %o", $('#AdnTag').length);
						// console.log("ui : 100247 | ut: Item | items : %o",$scope.op_goods_no);
						window.adn_param = window.adn_param || [];
						window.adn_param.push([{ 	
							ui:'100247',
							ut:'Item',
							items:[{i:$scope.op_goods_no}]
						}]);
					}
					

					angular.element(document).ready(function () {
						adAdn();  // ADN 광고스크립트
					});
				}
			})
			.error(function () {
				$scope.pageUI.loadingFail = true;
				console.log('Data Error : 상품기본정보 로드 실패');
			})
			.finally(function () {
				if($scope.loginInfo.isLogin){
					$scope.getMyBrandInfo();
				} else {
					$scope.visitThreeTimesCheck($scope.pageUI.reqParam.goods_no, $scope.pageUI.data.commonInfo.uprBrndNo);
				}
				$scope.jsonLoading = false;
				$scope.prdCtgInfoDataLoad(); // 상품 카테고리 정보 가져오기
			});
		};

		// 카테고리 데이터 로드
		$scope.prdCtgInfoDataLoad = function() {
			// 기획전이 아닐 경우 상품 카테고리 정보 가져오기
			if ($scope.pageUI.data.commonInfo.goodsCmpsCd != 10 || $scope.pageUI.data.commonInfo.goodsCmpsCd != 30) {
				$http.get(LotteCommon.productCategoryInfoData + $scope.pageUI.reqParam.goods_no)
				.success(function(data){
					$scope.pageUI.prdCtgInfoData = data.data;
				})
				.error(function () {
					console.log('Data Error : 상품 카테고리정보 로드 실패');
				})
				.finally(function () {
					$scope.alidoCollectLog('prdView', $scope.pageUI); // // ALIDO 수집스크립트 호출(상품상세 보기), 카테고리 데이러 로드 완료 후로 변경
	 				$scope.recobellCollectLog(); // 레코벨 수집스크립트 호출 시점 카테고리 데이러 로드 완료 후로 변경
				});
			}
		}

		$scope.dataLoadAfterFunc = function () {
			// MD 공지 html 처리
			if ($scope.pageUI.data.mdNoticeInfo) {
				setTimeout(function () {
					$scope.pageUI.data.mdNoticeInfo.mdNtcFcont1 = Fnproductview.replaceAll($scope.pageUI.data.mdNoticeInfo.mdNtcFcont1, "&#34;", "'");
					$scope.pageUI.data.mdNoticeInfo.mdNtcFcont1 = Fnproductview.replaceAll($scope.pageUI.data.mdNoticeInfo.mdNtcFcont1, "\r\n", "");

					//$scope.pageUI.data.mdNoticeInfo.mdNtcFcont1  = $scope.pageUI.data.mdNoticeInfo.mdNtcFcont1.replace(/\&\#34;/g, "'").(/\\r\\n/g, "");
					// angular.element("#mdNoti1").html($scope.pageUI.data.mdNoticeInfo.mdNtcFcont1);

					$scope.defenseBadHtml($scope.pageUI.data.mdNoticeInfo.mdNtcFcont1, angular.element("#mdNoti1"));

					$scope.pageUI.data.mdNoticeInfo.mdNtcFcont2 = Fnproductview.replaceAll($scope.pageUI.data.mdNoticeInfo.mdNtcFcont2, "&#34;", "'");
					$scope.pageUI.data.mdNoticeInfo.mdNtcFcont2 = Fnproductview.replaceAll($scope.pageUI.data.mdNoticeInfo.mdNtcFcont2, "\r\n", "");

					// angular.element("#mdNoti2").html($scope.pageUI.data.mdNoticeInfo.mdNtcFcont2);
					$scope.defenseBadHtml($scope.pageUI.data.mdNoticeInfo.mdNtcFcont2, angular.element("#mdNoti2"));
				}, 300);
			}
			
			// todo: style flag에 따라 애니이미지 노출 처부 처리
			$interval(animateStyleIcon, 500);
		};

		/*****************************************
		 * Page Event Handler
		 *****************************************/
		var $win = angular.element($window);
		$win.on({
			"unload.product": function () {
				var sess = {};

				if (!$scope.pageUI.data.prdInfo) {
					return false;
				}

				sess = $scope.pageUI;
				
				var lotteProductHistory = [];
				var lotteProductHistoryData = LotteStorage.getSessionStorage('lotteProductHistory');
				if(lotteProductHistoryData != '' && lotteProductHistoryData != null) {
					lotteProductHistory = lotteProductHistoryData.split(",");
					if(lotteProductHistory.indexOf($scope.pageUI.reqParam.goods_no+'') < 0) {
						lotteProductHistory.push($scope.pageUI.reqParam.goods_no);
					}
					// 최대 10개까지 저장
					if(lotteProductHistory.length > 10) {
						LotteStorage.delSessionStorage('lotteProduct2017Data'+lotteProductHistory[0]);
						lotteProductHistory.splice(0,1);
					}
				} else {
					lotteProductHistory.push($scope.pageUI.reqParam.goods_no);
				}
				lotteProductHistoryData = lotteProductHistory.toString();
				LotteStorage.setSessionStorage('lotteProductHistory', lotteProductHistoryData);
				
				if (!commInitData.query.localtest && $scope.leavePageStroage) { // localtest url 파라메타가 없을때 저장
					LotteStorage.setSessionStorage('lotteProduct2017Loc'+$scope.pageUI.reqParam.goods_no, $location.absUrl());
					LotteStorage.delSessionStorage('lotteProduct2017Data'+$scope.pageUI.reqParam.goods_no);
					LotteStorage.setSessionStorage('lotteProduct2017Data'+$scope.pageUI.reqParam.goods_no, sess, 'json');
					LotteStorage.setSessionStorage('lotteProduct2017ScrollY'+$scope.pageUI.reqParam.goods_no, angular.element($window).scrollTop());
				}
			},
			"load": function () {
			}
		});

		/*****************************************
		 * SessionStorage 데이터 처리
		 *****************************************/
		// sessionStorage - 세션에서 가저올 부분 선언	
		var lotteProductLoc = LotteStorage.getSessionStorage('lotteProduct2017Loc'+$scope.pageUI.reqParam.goods_no);
		var lotteProductData = LotteStorage.getSessionStorage('lotteProduct2017Data'+$scope.pageUI.reqParam.goods_no);
		var lotteProductScrollY = LotteStorage.getSessionStorage('lotteProduct2017ScrollY'+$scope.pageUI.reqParam.goods_no);

		var dataLoadFlag = true;
		
		if ($location.host().match(/(m|mo|mo2|mt|mt2|mprj|mprj2)\.lotte\.com/i) && // 실제 m,mo,mprj 등일 때만 스토리지 데이터 사용하도록 수정
			lotteProductLoc == $location.absUrl() &&
			lotteProductData != null && 
			commInitData.query["localtest"] != "true") { // 현재 URL과 session storage에 저장된 경로가 동일 할 경우
			var sessionData = JSON.parse(lotteProductData);
			if(sessionData.data) {
				$scope.jsonLoading = true;
				$scope.pageUI = sessionData;
				$scope.lpyaIconCheck();
				$scope.dataLoadAfterFunc();
				$timeout(function () {
					$win.scrollTop(lotteProductScrollY);
					if ($scope.loginInfo.isLogin) {
						$scope.getMyBrandInfo();
					} else {
						$scope.visitThreeTimesCheck($scope.pageUI.reqParam.goods_no, $scope.pageUI.data.commonInfo.uprBrndNo);
					}
				}, 100);
				$scope.prdCtgInfoDataLoad(); // 20181204 ALIDO API 개발 및 ABC 테스트 요청
			} else {
				$scope.productDataLoad();
			}
		} else {
			$scope.productDataLoad();
		}

		$rootScope.$on('$routeChangeSuccess', function(currentRoute, previousRoute) {
			if ($route.current.routeName == "planProductDetail") {
				$timeout(function () {
					if ($scope.pageUI.planProduct.goodsNo && 
						$scope.pageUI.planProduct.data) { // 기획전 상세 기술서 팝업 데이터가 있다면 표시
						// APP 다운 배너가 있다면 감추기
						angular.element("#wrapper").addClass("hide_appdown_bnr");
						angular.element("html, body").css({overflow: "hidden", position: "fixed"});
						// console.log($scope.pageUI.planProduct);
						$scope.dimmedOpen({dimmed:false}); // 기획전 상품 레이어팝업 열때 베이스 컨텐츠 스크롤 막기위해
						$scope.pageUI.planProduct.show = true;
		
						$timeout(function () {
							if ($scope.pageUI.planProduct.data[$scope.pageUI.planProduct.goodsNo].detailHtml) { // 기술서 내용이 있다면
								// 기술서 금지 태그 삭제
								$scope.defenseBadHtml($scope.pageUI.planProduct.data[$scope.pageUI.planProduct.goodsNo].detailHtml, angular.element("#planDetailLayout"));
		
								// 상품기술서 iframe, 사이즈 조견표 처리
								$scope.prdDetailInfoModified(angular.element("#planDetailLayout"), angular.element("#planDetailLayout iframe, #planDetailLayout #sizeGuideTable .tabel_list_wrap >table"));
							}

							$scope.jsonLoading = false;
						}, 1000);
					} else { // 기획전 상세 기술서 팝업 데이터가 없다면 오류 방지를 위해 기본페이지로 리다이렉팅
						location.href = "#/"; 
					}
				});
			} else {
				// APP 다운 배너가 있다면 보이기
				angular.element("html, body").css({overflow: "", position: ""});
				angular.element("#wrapper").removeClass("hide_appdown_bnr");
				$scope.dimmedClose();
				$scope.pageUI.planProduct.show = false;

				$timeout(function () {
					if ($scope.pageUI.planProduct.beforeScrollPosY) {
						angular.element($window).scrollTop($scope.pageUI.planProduct.beforeScrollPosY);
					}

					$scope.jsonLoading = false;
				}, 100);
				location.href = "#/";
			}
		});
		
		$scope.getMyBrandInfo = function() {
			var jsonUrl = LotteCommon.isTestFlag ?  "/json/brand/my_brnd_info.json" : LotteCommon.myBrandInfo;
			var httpConfig = {
				method: "get",
				url: jsonUrl
			};

			$http(httpConfig)
			.success(function (data) {
				if(data.data) {
					var mybrand = data.data;
					$scope.pageUI.myBrandStr = "";
					if(!mybrand.isBestBrand) {
						if(mybrand.brndList) {
							$scope.pageUI.myBrand = mybrand.brndList.items;
							for(var i=0;i < mybrand.brndList.items.length;i++) {
								$scope.pageUI.myBrandStr += "|"+mybrand.brndList.items[i].brdNo+"|";
							}
						}
					}
				}
			})
			.finally(function () {
				// 브랜드 방문 즐겨찾기 
				$scope.visitThreeTimesCheck($scope.pageUI.reqParam.goods_no, $scope.pageUI.data.commonInfo.uprBrndNo);
				if($scope.pageUI.myBrandStr.indexOf("|"+$scope.pageUI.data.commonInfo.uprBrndNo+'|') >= 0) {
					$scope.pageUI.isMyBrand = true;
				}										
			});
		}
		
		$scope.moreBuyPrdCartClick = function() {
			if(!$scope.loginInfo.isLogin) { 
				alert("로그인을 해주세요.");
				Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
				return false;
			}
			var optionScope = angular.element("#optionWrap").scope();
			optionScope.buildCartForm($scope.pageUI.data.moreBuyPrdInfo.prdList.items);
			optionScope.cartAddProc(true);
		};

		$scope.wishClick = function(goodsNo, tclick) {
			var tclickCode = "m_RDC_ProdDetail_Clk_Wsh";

			if (tclick) {
				tclickCode = tclick;
			}

			$scope.sendTclick(tclickCode);

			if(!$scope.loginInfo.isLogin) { 
				alert("로그인을 해주세요.");
				Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
				return false;
			}
			if($scope.pageUI.wish[goodsNo]) {
				$scope.productViewAlert({type:'alert',msg:'이미 담은 상품 입니다.',time:2500});
				return false;
			}
			console.log("위시 담기 시도 ::: "+goodsNo);
			$scope.pageUI.wish[goodsNo] = true;
			if(goodsNo == $scope.pageUI.data.commonInfo.goodsNo) {
				$scope.pageUI.data.prdInfo.saveWishYn = true;
			}
			$scope.sendProductWish(goodsNo, function (res) {
				if (res) {
					$scope.productViewAlert({type:'alert',msg:'위시리스트에 담았습니다.',time:2500});
				} else {
					$scope.pageUI.wish[goodsNo] = false;
					if(goodsNo == $scope.pageUI.data.commonInfo.goodsNo) {
						$scope.pageUI.data.prdInfo.saveWishYn = false;
					}
				}
			});
		};
		
		$scope.sb_index = 1;
		$scope.swipeEnd = function(idx) {
			if (idx == $scope.prdSwipeCurIdx) {
				return false;
			}

			if($scope.pageUI.data.imglist[idx].type == 'vod') { // 동영상일경우 스타일 추천 아이콘 비노출 처리
				$scope.pageUI.styleIconShow = false;
				vod_useScroll = true; // 스크롤 자동재생 기능 활성화
				$scope.swipeVideoStart();
			}else if($scope.pageUI.data.imglist[idx].type == 'youtube'){
				$scope.swipeYoutubeStart();
			}else{
				vod_useScroll = false; // 스크롤 자동재생 기능 비활성화
				$scope.pageUI.styleIconShow = true;
				$scope.swipeVideoStop(); // 동영상 정지
			}
			$scope.sb_index = idx + 1;
			$scope.prdSwipeCurIdx = idx;
		};

		$scope.prdSwipeCurIdx = 0;
		
        $scope.getProdDetailSwipeControl = function(control){
            $scope.swipeControl = control;
            $scope.prdSwipeCurIdx = $scope.swipeControl.getIndex();
        };

		$scope.swipeBefore = function() {
			$scope.indi_index = $scope.sb_index
			$scope.indi_index--;
			$scope.swipeControl.moveIndex(($scope.indi_index - 1));
			
			if($scope.sb_index == 1) {
			 	$scope.sb_index = $scope.pageUI.data.imglist.length;
			}else{
				$scope.sb_index--;
			}
		};
		
		$scope.swipeNext = function() {
			$scope.indi_index = $scope.sb_index;
			$scope.indi_index++;
			$scope.swipeControl.moveIndex(($scope.indi_index - 1));
			
			if($scope.sb_index == $scope.pageUI.data.imglist.length) {
			 	$scope.sb_index = 1;
			}else{
				$scope.sb_index++;
			}
		};
				
		$scope.goSWipe = function (idx) {
			$scope.sendTclick( 'm_RDC_ProdDetail_Clk_vod' );
			$scope.logGAEvtPrdView('상품이미지','비디오보기');
			$scope.swipeControl.moveIndex((idx - 1));
			$scope.sb_index = idx - 1;
		};


		// 컬러 선택 : 샤넬 등
		$scope.colorSelect = function () {
			$scope.pageUI.chanel.selectColorNo = this.item.colorNo;
			if(this.item.imgUrl) {
				$scope.pageUI.chanel.imgUrl = this.item.imgUrl;
			} else {
				$scope.pageUI.chanel.imgUrl = $scope.pageUI.data.imglist[0].img;
			}
			$scope.pageUI.chanel.data = this.item;
		};

		// todo: 혜택 모두보기
		$scope.benefitAllView = function () {

		};

		// todo: 더보기
		$scope.moreClick = function(linkUrl, tclick) {
			if(linkUrl) {
				window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.pageUI.baseParam + "&tclick=" + tclick);
			}
			console.log(" More Click : ", linkUrl, "\n tclick : " ,tclick);
		};

		$scope.linkClick = function (linkUrl, tclick) {
			console.log('linkUrl', linkUrl);
			$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.pageUI.baseParam + "&tclick=" + tclick);
		};
		
		// 오늘도착 안내 레이어
		$scope.todayArriveShipInfoClick = function(tclick) {
			$scope.dimmedOpen({
				target: "todayArriveShipInfo",
				//dimmedOpacity : "0.6",
				callback: this.todayArriveShipInfoClose
			});
			$scope.LotteDimm.dimmedOpacity = "0.6";
			$timeout(function() {
				angular.element("#lotteDimm").css("z-index", "110");
			});
			$scope.pageUI.todayArriveShipInfo = true;
			if($scope.pageUI.data.commonInfo.goodsCmpsCd == "30" && $scope.pageUI.planProduct.show){
				$scope.logGAEvtPrdView("기획전형상품상세", "오늘도착 안내");
			} else{
				$scope.logGAEvtPrdView("상품정보", "오늘도착 안내");
			}
		};

		$scope.todayArriveShipInfoClose = function() {
			$scope.pageUI.todayArriveShipInfo = false;
			$scope.dimmedClose();
		};

		// 무이자혜택 카드혜택 레이어
		$scope.nintCardClick = function() {
			$scope.dimmedOpen({
				target: "nintCard",
				callback: this.nintCardClose
			});
			$scope.LotteDimm.dimmedOpacity = "0.6";
			$timeout(function() {
				angular.element("#lotteDimm").css("z-index", "110");
			});
			$scope.pageUI.nintCardOpen = true;
			if($scope.pageUI.data.commonInfo.goodsCmpsCd == "30" && $scope.pageUI.planProduct.show){
				$scope.logGAEvtPrdView("기획전형상품상세", "무이자 안내");
			} else{
				$scope.logGAEvtPrdView("상품정보", "무이자 안내");
			}
		};

		$scope.nintCardClose = function() {
			$scope.pageUI.nintCardOpen = false;
			$scope.dimmedClose();
		};

		// 스마트픽 레이어
		$scope.smpClick = function() {
			$scope.dimmedOpen({
				target: "smartpick",
				callback: this.smpClose
			});
			$scope.LotteDimm.dimmedOpacity = "0.6";
			$timeout(function() {
				angular.element("#lotteDimm").css("z-index", "110");
			});
			$scope.pageUI.smpOpen = true;
			if($scope.pageUI.data.commonInfo.goodsCmpsCd == "30" && $scope.pageUI.planProduct.show){
				$scope.logGAEvtPrdView("기획전형상품상세", "스마트픽 안내");
			} else{
				$scope.logGAEvtPrdView("상품정보", "스마트픽 안내");
			}
		};

		$scope.smpClose = function() {
			$scope.pageUI.smpOpen = false;
			$scope.dimmedClose();
		};
		
		// 무료포장 선물카드 레이어
		$scope.giftServiceInfoClick = function(option, tclick) {
			// 선물서비스 팝업을 기획전형 상세와 공통으로 사용하기 위해 (별도 데이터로 저장하여 사용함)
			if(option == 'op_prodDetail'){	//일반 상품상세
				$scope.pageUI.giftServiceInfo.giftPkgImgUrl = $scope.pageUI.data.basicInfo.giftPkgImgUrl;
				$scope.pageUI.giftServiceInfo.futMsgImgUrl = $scope.pageUI.data.basicInfo.futMsgImgUrl;
			}else if(option == 'op_planProdDetail'){	// 기획전 상품상세
				$scope.pageUI.giftServiceInfo.giftPkgImgUrl = $scope.pageUI.planProduct.data[$scope.pageUI.planProduct.goodsNo].basicInfo.giftPkgImgUrl;
				$scope.pageUI.giftServiceInfo.futMsgImgUrl = $scope.pageUI.planProduct.data[$scope.pageUI.planProduct.goodsNo].basicInfo.futMsgImgUrl;
			}

			$scope.dimmedOpen({
				target: "giftServiceInfo",
				//dimmedOpacity : "0.6",
				callback: this.giftServiceInfoClose
			});
			$scope.LotteDimm.dimmedOpacity = "0.6";
			$timeout(function() {
				angular.element("#lotteDimm").css("z-index", "110");
			});
			$scope.pageUI.giftServiceInfo.showPopup = true;
			$timeout(function() { //중앙정렬로 수정
				angular.element(".pop_gift").css("margin-top", -(angular.element(".pop_gift").height()/2));
			});
		};

		$scope.giftServiceInfoClose = function() {
			$scope.pageUI.giftServiceInfo.showPopup = false;
			$scope.dimmedClose();
		};

		var autoVideoPlayFirst = true; // 비디오 처음 실행 분기 처리

		//youtube동영상
		$scope.swipeYoutubeStart = function() {
			if (autoVideoPlayFirst) {
				angular.element("[id='vodBox']").each(function (idx, entry) {
					var newId = "vodBoxDummy",
						newPlayerId = "playerDummy";
					if (idx == 0) {
						$(entry).attr("id", newId);
						$(entry).find('#player').attr("id", newPlayerId);
					}else{
						var script = document.createElement("script"); 
							script.src = "https://www.youtube.com/iframe_api"; 
							script.type = "text/javascript"; 
							script.charset = 'UTF-8'; 
							script.async = "ture";
						var insertNode = document.getElementById("player");

						insertNode.parentNode.insertBefore(script, insertNode);
					}
				});
			}
		};
		//동영상
		$scope.swipeVideoStart = function() {
			$timeout(function(){

				if (autoVideoPlayFirst) {
					angular.element("[id='autoVideoPrdView']").each(function (idx, entry) {
						var newId = "autoVideoPrdView" + idx;
						$(entry).attr("id", newId);
						var $chkVideoElement = angular.element('#' + newId).parents(".dummy");
						if ($chkVideoElement.length == 0) {
							autoVideoPlay(newId, '#'+ newId,false,undefined,true);
						}
					});
					autoVideoPlayFirst = false;
				}else{
					autoVideoPlay('autoVideoPrdView1', '#autoVideoPrdView1',false,undefined,true);
				}
			}, 100);

		};

		// 동영상 정지
		$scope.swipeVideoStop = function(){
			$(".video_wrap video").each(function(idx, item){
				if ($(item).siblings(".stop_cover:visible, .click_cover:visible").length>=1){
					$timeout(function(){
						$(item).siblings(".btn_move_stop").trigger("click")
					}, 10);
				}
			});
		};
		
		// 상품상세 이미지 자세히 보기 페이지 링크
		$scope.prodImgDeatilView = function (idx, tclick) {
			idx = idx ? idx : 0;
			
			$window.location.href = LotteUtil.setUrlAddBaseParam(LotteCommon.prodSubImageDetailView, "goods_no=" + $scope.pageUI.data.commonInfo.goodsNo + "&imgIdx=" + idx + "&" + $scope.pageUI.baseParam + (tclick ? "&tclick=" + tclick : ""));/* + "&imgList=" + encodeURIComponent($scope.pageUI.data.imgInfo.imgList.join(",")))*/
		};

		// todo : 상품 클릭 기능구현
		// 상품상세 바로가기 공통으로 구현 -> $scope.gotoProductPage
		// $scope.productClick = function(goodsNo, tclick){
		// 	if(goodsNo) {
		// 		var url = LotteUtil.setUrlAddBaseParam(LotteCommon.productviewUrl , $scope.pageUI.baseParam + "&goods_no=" + goodsNo + "&curDispNo=" + $scope.pageUI.reqParam.curDispNo + "&curDispNoSctCd=" + $scope.pageUI.reqParam.curDispNoSctCd);

		// 		$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
		// 	}
		// 	console.log(" Product Click : ", goodsNo, "\n tclick : " ,tclick);
		// };

		/**
		 * Tclick의 순번 등에 01, 02 처럼 두자릿 숫자형태로 값을 변경해야 할 경우
		 * @param val 변경할 숫자
		 */
		$scope.idxSetDigit = function (val) {
			return (("" + val).length  == 1) ? "0" + val : val;
		};

		/**
		 * 상품상세 바로가기 공통
		 * @since 20181204
		 * @param goodsNo 상품번호
		 * @param curDispNo 전시인입코드
		 * @param curDispNoSctCd 매출전시코드
		 * @param algorithm alido 파라미터 값
		 * @param algorithmSetId alido 파라미터 값
		 * @param pageareaId alido 파라미터 값
		 * @param tclick 티클릭
     * @param _reco &_reco=M_detail
     * @param recoAB recoAB 테스트
		 */
		$scope.gotoProductPage = function (goodsNo, curDispNo, curDispNoSctCd, tclick, _reco, recoAB, algorithm, algorithmSetId, pageareaId) {
			if($scope.pageUI.reqParam.goods_no == goodsNo) {
				$win.scrollTop(0);
				return false;
			}
			var lotteProductHistory = [];
			var lotteProductHistoryData = LotteStorage.getSessionStorage('lotteProductHistory');
			if(lotteProductHistoryData != '' && lotteProductHistoryData != null) {
				lotteProductHistory = lotteProductHistoryData.split(",");
				var idx = lotteProductHistory.indexOf(goodsNo+'');
				if(idx >= 0) {
					LotteStorage.delSessionStorage('lotteProduct2017Data'+goodsNo);
					LotteStorage.delSessionStorage('lotteProduct2017Loc'+goodsNo);
					LotteStorage.delSessionStorage('lotteProduct2017ScrollY'+goodsNo);
					lotteProductHistory.splice(idx,1);
					lotteProductHistoryData = lotteProductHistory.toString();
					LotteStorage.setSessionStorage('lotteProductHistory', lotteProductHistoryData);
				}
			}

			/* 상품추천 API(recobell,DS팀,Alido) GA cid 마지막자리에 따라 ABC TEST(요청자:데이터사이언스팀 류화진) */
			if (recoAB) {
        /* 20181204 ABC테스트 */
				var lastIndex = LotteCookie.getCookie("_ga").length - 1;
				var gaCidLastNum = LotteCookie.getCookie("_ga").charAt(lastIndex); // GA cid cookie 마지막 자리수 체크
				var castCidNum = parseInt(gaCidLastNum, 10);

				var rcbRegx = /[0-2]/;
				var dsRegx = /[3-5]/;
        var alidoRegx = /[6-8]/;

				var recoABCTclick = "";

				if (rcbRegx.test(castCidNum)) {
					recoABCTclick = "_rc"; // 상품추천 API A/B/C TEST티클릭 구분자(레코벨)
				} else if (dsRegx.test(castCidNum)) {
					_reco = ""; // 상품추천 API A/B/C TEST티클릭 _reco 초기화(DS팀)
					recoABCTclick = "_ds"; // GA cid 마지막자리 (3,4,5)일 경우 DS팀 상품추천 API호출
				} else if (alidoRegx.test(castCidNum)) {
					_reco = ""; // 상품추천 API A/B/C TEST티클릭 구분자(ALIDO)
					recoABCTclick = "_al"; // GA cid 마지막자리 (6,7,8)일 경우 ALIDO 상품추천 API호출
					var alidoParams = {
						itemId: goodsNo,
						widgetId: null,
						pageareaId: pageareaId,
						pageType: 'NORMAL',
						algorithm: algorithm,
						algorithmSetId: algorithmSetId,
					};

					alido('relevance', alidoParams);
				}
			}

			$window.location.href = $scope.baseLink(LotteCommon.productviewUrl)
				+ "&goods_no=" + goodsNo
				+ (curDispNo ? "&curDispNo=" + curDispNo : "")
				+ (curDispNoSctCd ? "&curDispNoSctCd=" + curDispNoSctCd : "")
				+ (tclick ? "&tclick=" + tclick : "")
				+ (recoAB ? recoABCTclick : "")
				+ (_reco ? "&_reco=" + _reco : "");

			if (tclick) {
				console.log("Product Click : ", goodsNo, "\n tclick : ", tclick);
			}
		};

		/**
		 * 스타일추천 아이콘 애니메이션
		 */
		var styleIconIntervalCount = 0;
		function animateStyleIcon(){
			var n = styleIconIntervalCount - 1;
			if(n < 0){
				n = 0;
			}
			styleIconIntervalCount++;
			if(styleIconIntervalCount > 8){
				styleIconIntervalCount = 0;
			}
			
			/*var n = -1;
			if(styleIconIntervalCount < 7){
				n = 0;
			}else{
				n = Math.floor((styleIconIntervalCount - 7) / 5) + 1;
			}
			styleIconIntervalCount++;
			if(styleIconIntervalCount > 40){
				styleIconIntervalCount = 0;
			}*/
			
			if(n >= 0){
				var x = -60 * n;
				angular.element(".recom .recom_btn").css("background-position", x+"px 0");
			}
		};
		
		// 위시리스트
		$scope.btnWish_click = function () {
			$scope.sendTclick( 'm_DC_ProdDetail_Clk_Btn_3' );
			//$scope.wishListAdd();
		};
		
		$scope.showFadeInOutPop = function (id, t) {
			var alertPop = angular.element(id);
			alertPop.fadeIn(500,function(){
				$timeout(function(){
					alertPop.fadeOut(500);
				},t)
			});
		};
		
		$scope.goMemberInfoChange = function() {
			$window.location.href = LotteCommon.mylotteUrl + "?" + $scope.baseParam;
		};
		
		/*
		 * 상품상세 공통얼럿
		 * obj { // 구조
		 *    type: "오브젝트 타입",
		 *    msg: "얼럿 메시지",
		 *    time: "노출 시간",
		 *    speed: "노출 속도"
		 *    data: object // 데이터오브젝트 
		 * }
		 */
		$scope.productViewAlert = function(obj) {
			switch(obj.type) {
				case 'alert':
					$scope.alertTemplate.content = '<div class="msg"><span>'+obj.msg+'</span></div>';
					$scope.alertTemplate.button = '';
					angular.element("#alertTemplateContent").html($scope.alertTemplate.content);
					break;
				case 'brand':	// 브랜드 즐겨찾기 결과
					if(!$scope.pageUI.data.basicInfo.brndShopNm) {
						$scope.pageUI.data.basicInfo.brndShopNm = '';
					}
					$scope.alertTemplate.content = '<div class="msg"><span>'+$scope.pageUI.data.basicInfo.brndShopNm+'</span> 브랜드가 즐겨찾기에 추가되었습니다.</div>';
					$scope.alertTemplate.button = '<p class="btn"><a ng-click="goBrandPage('+obj.brandNo+')"><span class="right_clamp">마이 브랜드매장으로 이동</span></a></p>';
					angular.element("#alertTemplateContent").html($scope.alertTemplate.content);
					break;					
				case 'cart':	// 장바구니 담기 결과
					// 장바구니 Refresh 추가
					try {
						angular.element($window).trigger("refreshCartCount");
					} catch (e) {}

					$scope.alertTemplate.content = '<div class="msg"><span>장바구니에 담겼습니다.</span></div>';
					$scope.alertTemplate.button = '<p class="btn"><a ng-click="gotoCart()"><span class="right_clamp">장바구니 바로가기</span></a></p>';
					angular.element("#alertTemplateContent").html($scope.alertTemplate.content);
					break;
				case 'rent': // 렌탈상품 장바구니 담기시 상품상세 이동 안내
					$scope.alertTemplate.content = '<div class="msg"><span>상담신청이 필요한 상품입니다.<br />상품상세에서 확인해주세요.</span></div>';
					$scope.alertTemplate.button = '<p class="btn"><a ng-click="gotoProductPage(' + 
						'\'' + obj.goodsNo + '\', '+
						(obj.curDispNo ? '\'' + obj.curDispNo + '\', ' : 'null, ') +
						(obj.curDispNoSctCd ? '\'' + obj.curDispNoSctCd + '\', ' : 'null, ') +
						(obj.tclick ? '\'' + obj.tclick + '\', ' : 'null, ') +
						(obj._reco ? '\'' + obj._reco + '\'' : 'null') + ')"><span class="right_clamp">상품상세페이지로 가기</span></a></p>';
					angular.element("#alertTemplateContent").html($scope.alertTemplate.content);
					break;
				case 'stockRechargeAlarm': // 재입고 알림 결과 
					if(obj.data.PHONE) {
						$scope.alertTemplate.content = '<div class="msg"><span>SMS 재입고 알림 신청되었습니다.</span></div>';
						$scope.alertTemplate.button = '<p class="btn"><a ng-click="goMemberInfoChange()"><span class="right_clamp">'+obj.data.PHONE+' 변경하기</span></a></p>';
					} else {
						$scope.alertTemplate.content = '<div class="msg"><span>재입고 알림 신청되었습니다.</span></div>';
					}
					angular.element("#alertTemplateContent").html($scope.alertTemplate.content);
					break;
					
			}
			$timeout(function() {
				angular.element("#alertTemplateButton").html($compile($scope.alertTemplate.button)($scope));
			});

			var alertPop = angular.element("#productViewAlert");

			if(!obj.speed) {
				obj.speed = 500;
			}
			if(!obj.time) {
				obj.time = 1000;
			}
			alertPop.fadeIn(obj.speed,function(){
				$timeout(function(){
					alertPop.fadeOut(obj.speed);
				},obj.time)
			});
		};

		// 상품평 사진 클릭 상품평 상세보기로 이동
		$scope.productCommentDetailView = function (idx) {
			console.log("상품평 사진 클릭");
			$window.location.href = LotteCommon.productSubCommentImageDetail + "?" + $scope.pageUI.baseParam + "&goods_no=" + $scope.pageUI.reqParam.goods_no + "&idx=" + idx + "&tclick="; // to-di 티클릭 작업 필요
		};

		/**
		 * html 영역 (md공지, 상품기술서, 기획전형 상품 기술서)
		 * link, style, script, embed, object 태그 제거
		 */
		$scope.defenseBadHtml = function (html, $target) {
			html = html ? html : "";
			html = html.replace(/<link(.*?)>/gi, "");
			html = html.replace(/<meta(.*?)>/gi, "");
			html = html.replace(/<script/gi,"<noscript");
			html = html.replace(/<\/script/gi, "</noscript");

			$target.html(html);
			$target.find("style, object, embed, noscript").remove();
		};

		/**
		 * 상품상세 기술서 iframe, 사이즈조견표 처리
		 */
		$scope.prdDetailInfoModified = function ($wrapperTarget, $targets) {
			if (!$wrapperTarget || !$targets) {
				return false;
			}

			$targets.each(function (idx, entry) {
				var $win = angular.element($window),
					$wrapper = null,
					$entry = null,
					$scrollBox = null,
					$l_arrow = null,
					$r_arrow = null,
					wrapperGap = 0,
					arrowMiddleFlag = false,
					arrowTopPos = 50,
					ratio = 1,
					wrapperHeight = 0,
					contentWidth = 0,
					contentHeight = 0,
					winWidth = $win.width(),
					showScrollArrow = function () {},
					wrappingDOMHandler = function () {},
					resizeEvtHandler = function () {};

				if (entry.tagName == "TABLE") {
					$wrapper = angular.element('<div class="prddetail_scrollwrap"></div>');
					$entry = angular.element(entry);
					$scrollBox = angular.element('<div class="prddetail_scrollbox"></div>');
					$l_arrow = angular.element('<span class="scroll_arrow left">&lt;</span>');
					$r_arrow = angular.element('<span class="scroll_arrow right">&gt;</span>');

					showScrollArrow = function () {
						var scrollLeft = $scrollBox.scrollLeft();
						contentWidth = $entry.outerWidth();

						if (scrollLeft > 5) {
							$l_arrow.stop().css("opacity", 0).show().animate({opacity: 1}, 1000);
							$wrapper.addClass("left_scroll");
						} else {
							$wrapper.removeClass("left_scroll");
							$l_arrow.hide();
						}

						if (scrollLeft + 5 < contentWidth - $scrollBox.width()) {
							$r_arrow.stop().css("opacity", 0).show().animate({opacity: 1}, 1000);
							$wrapper.addClass("right_scroll");
						} else {
							$wrapper.removeClass("right_scroll");
							$r_arrow.hide();
						}
					};

					wrappingDOMHandler = function () {
						$entry.after($wrapper);
						$wrapper.append($scrollBox.append($entry), $l_arrow, $r_arrow);
						$scrollBox.on("scroll", showScrollArrow);

						resizeEvtHandler();
						showScrollArrow();
					};

					resizeEvtHandler = function () {
						if (winWidth == $win.width()) {
							return false;
						}
		
						winWidth = $win.width();
						contentWidth = $entry.outerWidth();
						contentHeight = $entry.outerHeight();
		
						if (arrowMiddleFlag) {
							$l_arrow.css("top", contentHeight / 2 - $l_arrow.height() / 2);
							$r_arrow.css("top", contentHeight / 2 - $r_arrow.height() / 2);
						} else {
							$l_arrow.css("top", arrowTopPos);
							$r_arrow.css("top", arrowTopPos);
						}
		
						if ($entry.width() > winWidth - wrapperGap) {
							$scrollBox.attr("style", "max-width:100%;overflow-x:scroll;width:" + (winWidth - wrapperGap) + "px !important");
							$l_arrow.show();
							$r_arrow.show();
						} else {
							$scrollBox.removeAttr("style");
							$l_arrow.hide();
							$r_arrow.hide();
						}
					};
				} else if (entry.tagName == "IFRAME") {
					$wrapper = angular.element('<div class="resizer"></div>');
					$entry = angular.element(entry);
					
					wrappingDOMHandler = function () {
						$entry.after($wrapper);
						$wrapper.append($entry);
					};
					
					resizeEvtHandler = function () {
						ratio = $wrapperTarget.width() / $entry.width();
						wrapperHeight = $entry.height() * ratio;

						if (ratio < 1) {
							$entry.css({
								"-transform-origin": "0 0",
								"transform": "scale(" + ratio + ", " + ratio + ")",
							});

							$wrapper.attr("style", "overflow:hidden;height:" + Math.round(wrapperHeight) + "px !important");
						}
					};
				}

				wrappingDOMHandler();
				resizeEvtHandler();
				$win.on("resize.prdDetailInfoModified", resizeEvtHandler);
			});
		};

		// 최근본상품
		var lastStatusViewGoods = function () {
			var storageViewGoods = LotteStorage.getLocalStorage('latelyGoods');
			var storageViewGoodsArr = [];
			var newStorageViewGoodsObj = {};
			var newStorageViewGoods = "";
			var storageStr = "";

			if (storageViewGoods != null) {
				storageViewGoodsArr = storageViewGoods.split("|");

				newStorageViewGoodsObj['goods_no'] = [];

				for (var i = 0; i < storageViewGoodsArr.length; i++) {
					newStorageViewGoodsObj['goods_no'].push(storageViewGoodsArr[i]);
				}

				if (newStorageViewGoodsObj['goods_no'].indexOf(commInitData.query['goods_no']) != -1) {
					newStorageViewGoodsObj['goods_no'].splice(newStorageViewGoodsObj['goods_no'].indexOf(commInitData.query['goods_no']),1);
				}
				newStorageViewGoodsObj['goods_no'].push(commInitData.query['goods_no']);

				angular.forEach(newStorageViewGoodsObj, function (val, key) {
					if (val.length > 20) {
						val.splice(0, (val.length-20));
					}

					if (newStorageViewGoods != "") { newStorageViewGoods += "|"; }
					newStorageViewGoods += val.join("|");
				});

				storageStr = newStorageViewGoods;
				LotteStorage.setLocalStorage("latelyGoods", storageStr);
				$scope.shareStorage("local", "latelyGoods", storageStr); //https일때 추가
			} else {
				storageStr = commInitData.query['goods_no'];
				LotteStorage.setLocalStorage("latelyGoods", storageStr);
				$scope.shareStorage("local","latelyGoods", storageStr); //https일때 추가
			}
		};

		// 최근 본 상품에서 온 경우가 아니면
		if (commInitData.query['late_view_yn'] != 'Y') {
			lastStatusViewGoods();
		}
		
		/**
         * @ngdoc function
         * @name hopePop
         * @description
         * lg 희망일배송 안내 팝업 레이어 열고 닫기
         * @example
         * $scope.hopePop(openHopePop)
         * @param {boolen} openHopePop 레이어 열기 
        */

		$scope.hopePop = function(openHopePop){
			if(openHopePop){
				angular.element("body, html").css({"height":"auto","overflow":"auto"});
				angular.element($window).scrollTop($scope.wScroll);
			}else{
				$scope.wScroll = angular.element($window).scrollTop();
				angular.element("body, html").css({"height":"100%","overflow":"hidden"});
			}
			$scope.pageUI.openHopePop = (!openHopePop) ? true : false;
		}

		/**
		 * 상품상세 GA event tag 공통 함수
		 * 2018.08.30 작성자 : 김지호 
		 * @name logGAEvtPrdView
         * @description
		 * 상품상세 모듈 및 서브페이지 이벤트 태깅 공통 함수
		 * @example
		 * $scope.logGAEvtPrdView(actionNm,labelNm,prdData)
		 * @param {String} actionNm 이벤트명
		 * @param {String} labelNm 라벨명
		 * @param {String} prdData 선택적 개별값 (인덱스넘버 or 상품코드 or 클릭텍스트)
		*/
		$scope.logGAEvtPrdView = function (actionNm,labelNm,prdData){
			var prdCtg = "MO_상품상세",
				prdAction = (actionNm) ? actionNm : "",
				prdLabel = (labelNm) ? labelNm : "",
				prdDim53 = (prdData) ? prdData : "-";

			// eventCategory, eventAction, eventLabel, dimension53, dimension54
			LotteGA.evtTag(prdCtg, prdAction, prdLabel, prdDim53);
			// 테스트용 오류 코드
			//GAPrdtest; 
		}


	}]);

    app.directive('lotteContainer', ['AppDownBnrService', function(AppDownBnrService) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/product_view_2017_container.html',
            replace : true,
            link : function($scope, el, attrs) {
        		$scope.getColorRange = function (itemLength, range) {
        			var rangeList = [];

        			for (var i = 0;i < itemLength / range; i++) {
        				rangeList.push(i);
        			}

        			return rangeList;
        		};
        		
				
				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					var chkPosY = AppDownBnrService.appDownBnrInfo.isShowFlag ? AppDownBnrService.appDownBnrInfo.height : 0, // 앱다운 배너 활성화 체크
						headerPosY = $scope.appObj.isApp ? 0 : 48;
		
					if (args.scrollPos > 50) {
						$scope.pageUI.option.lpayShow = false;
					}
				});
            }
        };
	}]);
	
	// 샤넬일 경우 헤더 디렉티브
	app.directive('chanelSubHeader', ['AppDownBnrService', function (AppDownBnrService) {
		return {
			link: function ($scope, el, attrs) {
				var $el = angular.element(el);

				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					var chkPosY = AppDownBnrService.appDownBnrInfo.isShowFlag ? AppDownBnrService.appDownBnrInfo.height : 0, // 앱다운 배너 활성화 체크
						headerPosY = $scope.appObj.isApp ? 0 : 48;
		
					if (args.scrollPos > chkPosY) {
						$el.css({
							position: "fixed",
							top: headerPosY + "px"
						});
					} else {
						$el.removeAttr("style");
					}
				});
			}
		}
	}]);

	app.filter('pageRange', [function () {
		return function (items, page, pgsize) {
			var newItem = [];

			for (var i = 0;i < items.length; i++) {
				if (page * pgsize <= i && (page+1) * pgsize > i) {
					newItem.push(items[i]);
				}
			}
			return newItem;
		}
	}]);

	/**
	 * 별점 정책 filter
	 * input: 입력값 5이하 값으로 소수점 있음
	 * convertPerfectScore: [옵션] 변환 만점 기준
	 */
	app.filter('starScorePolicy', function () {
		return function (input, convertPerfectScore) {
			if(!input) {return 0;}

			var originPerfectScore = 5;
			var newScore = Math.ceil(input * 2) / 2;

			if(convertPerfectScore != undefined){
				 newScore = newScore / originPerfectScore * convertPerfectScore;
			}
			// console.log('starScorePolicy newScore', newScore);

			return newScore;
		}
	});

	/* roundUp filter
	 * input: 입력값
	 * unit: 올림할 단위 (예)10: 10단위로 올림
	 * 미사용중
	app.filter('roundUp', function () {
		return function (input, unit) {
			if(!input) {return;}

			if(!unit) unit = 1;

			var newVal = Math.ceil(input / unit) * unit;
			console.log('roundUp newVal', newVal);

			return newVal;
		}
	});*/

	app.filter('trusted', ['$sce', function ($sce) {
		return function(url) { 
			return $sce.trustAsResourceUrl(url); 
		};
	}]);
	
	// 동영상 포스트컷(스냅샷) - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
	app.directive('videoPoster', [function () {
		return {
			restrict: 'A', // attribute
			link : function ($scope, element, attrs) {
				if (attrs.videoPoster) {
					angular.element(element).attr("poster", attrs.videoPoster);
				}
			}
		};
	}]);
	
	app.filter('txtCut5', function(){
		return function (txt) {
			return txt.substring(0, 5);
		}
	});

})(window, window.angular);
