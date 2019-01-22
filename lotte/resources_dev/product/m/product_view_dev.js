var LOGIN_EXCEPTION = "9004";
var GOODS_SMP_NORMAL_ETC = "0102ETC";  // 로드샵 일반(e쿠폰)

// 앱으로 연결
// 20160616 앱전용/제휴채널팝업 데이터화로 인한 삭제 - 박형윤
/*
var AppExec = {
	isIPHONE : false,
	isIPAD : false,
	isANDROID : false,
	isCHROME : false,

	MARKET_URL_IPHONE : "http://itunes.apple.com/app/id376622474?mt=8",
	MARKET_URL_IPAD : "http://itunes.apple.com/app/id447799601?&mt=8",
	MARKET_URL_ANDROID : "market://details?id=com.lotte&referrer=lotte200004lotte",

	ANDROID_APP_SCHEME : "mlotte001://",
	IPHONE_APP_SCHEME : "mlotte001://",
	IPAD_APP_SCHEME : "mlotte003://",
	APP_RUN_URL : "",
	MARKET_LANDING_URL : "",
	CHROME_LANDING_URL : "",

	init: function () {
		this.isIPHONE = (navigator.userAgent.match('iPhone') != null || navigator.userAgent.match('iPod') != null);
		this.isIPAD = (navigator.userAgent.match('iPad') != null);
		this.isANDROID = (navigator.userAgent.match('Android') != null);
		this.isCHROME = (navigator.userAgent.match('Chrome') != null);
	},
	goMarket: function () {
		isIPHONE = (navigator.userAgent.match('iPhone') != null || navigator.userAgent.match('iPod') != null);
		isIPAD = (navigator.userAgent.match('iPad') != null);
		isANDROID = (navigator.userAgent.match('Android') != null);
		isCHROME = (navigator.userAgent.match('Chrome') != null);

		if (isANDROID) {
			if (isCHROME) {
				window.location = AppExec.MARKET_URL_ANDROID + "&url=" + AppExec.ANDROID_APP_SCHEME + "<%=domain_nm%>/app_landing.do?url=" + AppExec.CHROME_LANDING_URL;
			} else {
				window.location = AppExec.MARKET_URL_ANDROID + "&returnUrl=" + AppExec.ANDROID_APP_SCHEME + AppExec.MARKET_LANDING_URL;
			}
		} else if (isIPHONE) {
			window.location = AppExec.MARKET_URL_IPHONE;
		} else if (isIPAD) {
			window.location = AppExec.MARKET_URL_IPAD;
		}
	},
	setRunUrl: function (cn) {
		var split_url = location.href.split("&");
		var run_url = split_url[0].replace("c=mlotte", "");

		for (i = 1; i < split_url.length; i++) {
			if (split_url[i].indexOf("cn=") > -1) {
					run_url += "&cn=" + cn + "&tclick=m_web_appdown_201503";
			} else {
				if ( split_url[i].indexOf("c=") > -1 || split_url[i].indexOf("udid=") > -1 || split_url[i].indexOf("v=") > -1 ||
					split_url[i].indexOf("cdn=") > -1 || split_url[i].indexOf("isMainLogo=") > -1) {
					// 제외
				}else{
					run_url += "&" + split_url[i]+ "&tclick=m_web_appdown_201503";
				}
			}
		}

		this.APP_RUN_URL = run_url.replace(/(http:\/\/|https:\/\/)/g, "").replace(".do?&",".do?").replace(/(mo.lotte.com|mt.lotte.com)/g, "m.lotte.com");
		this.MARKET_LANDING_URL = run_url.replace(/(http:\/\/|https:\/\/)/g, "").replace(".do?&",".do?").replace(/\&/g, "@");
		this.CHROME_LANDING_URL = run_url.replace(".do?&",".do?").replace(/\&/g, "@");
	},
	appExecute: function () {
			this.init();
			this.setRunUrl('23');

			if (this.isIPHONE) {
				setTimeout(this.goMarket, 350);
				window.location = this.IPHONE_APP_SCHEME + this.APP_RUN_URL;
                
			} else if (this.isIPAD) {
				setTimeout(this.goMarket, 350);
				window.location = this.IPAD_APP_SCHEME + this.APP_RUN_URL;
			} else if (this.isANDROID) {
				var iframe = document.createElement('iframe');
				iframe.style.visibility = 'hidden';
				iframe.style.display = "none";

				if(!this.isCHROME) iframe.src = this.ANDROID_APP_SCHEME + this.APP_RUN_URL;
				iframe.onload = this.goMarket;
				document.body.appendChild(iframe);
			}
	}
};
*/
//201605크로스픽 편의점 지도 연동 
var martIndex = 0;
function searchMartClose(){
    $("#searchMartPop").hide();
}
function searchMartResult(paramObj){
    $("#crspk_name_" + martIndex).val(paramObj.name);
    $("#crspk_corp_cd_" + martIndex).val(paramObj.crspk_corp_cd);
    $("#crspk_corp_str_sct_cd_" + martIndex).val(paramObj.crspk_corp_str_sct_cd);
    $("#crspk_str_no_" + martIndex).val(paramObj.crspk_str_no);                                                                                              
   
    $("#crspk_name_" + martIndex).trigger("change");
    $("#crspk_corp_cd_" + martIndex).trigger("change");
    $("#crspk_corp_str_sct_cd_" + martIndex).trigger("change");
    $("#crspk_str_no_" + martIndex).trigger("change");
}

(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'ngRoute',
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteUnit',
		'lotteCommFooter',
		'angular-carousel',
		'lotteNgSwipe',
		'lotteSns',
		'lotteUtil',
		'lotteMainPop'
	]);

	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		.otherwise({
			templateUrl : '/lotte/resources_dev/product/m/product_view_container.html',
			controller: 'ProductDetailPage',
			reloadOnSearch : false
		})
	}]);

	app.factory('SharedData', function () {
		var data = {SharedData : undefined};
		return {
			getSharedData : function () {
				return data.SharedData;
			},
			setSharedData : function (data_) {
				data.SharedData = data_;
			}
		};
	});

	app.service('Fnproductview', function () {
		this.productbtnlayertp = function ($scope) {
			// console.log('productbtnlayertp', 'called');
			var rtnVal = "00";

			if ($scope.BasicData.tworld_sell == "N") { // skt 판매 여부
				rtnVal = "01";
			} else if ($scope.reqParam.goods_no == '19338070') { // 모바일 주문 불가
				rtnVal = "02";
			} else if ($scope.BasicData.product.goods_tp_cd == '30' || $scope.BasicData.product.goods_tp_cd == '40' || $scope.BasicData.m_yn == 'Y') { // 모바일 주문 불가
				rtnVal = "03";
			} else if ($scope.BasicData.product.item_opt_yn == 'Y') { // 모바일 주문 불가
				rtnVal = "04";
			} else if ($scope.BasicData.product.entr_yn == 'Y') { // 모바일 주문 불가
				rtnVal = "05";
			} else if ($scope.BasicData.product.pmg_md_gsgr_no == '1696' && $scope.BasicData.product.org_sale_prc == '10') { // 모바일 주문 불가
				rtnVal = "06";
			} else if ($scope.BasicData.product.sale_stat_cd == '20') { // 품절
				rtnVal = "07";
			} else if ($scope.BasicData.product.sale_stat_cd == '30') { // 품절
				rtnVal = "08";
			} else if ($scope.BasicData.product.smp_only_yn == 'Y' && $scope.BasicData.product.smp_goods_view_yn != 'Y') { // 품절
				rtnVal = "09";
			}

			return rtnVal;
		};

		this.getDeliveryInfo = function ($scope) {
			var rtnVal = "";

			if ($scope.BasicData.product.entr_no =='13145') {
				rtnVal = "홈쇼핑상품";
			} else if ($scope.BasicData.product.reserve_start !='' && $scope.BasicData.product.reserve_start != null) {
				rtnVal = "예약상품";
			} else if ($scope.BasicData.product.dlv_goods_sct_cd =='02' || $scope.BasicData.product.dlv_goods_sct_cd =='04') {
				rtnVal = "설치상품";
			} else if ($scope.BasicData.product.dlv_goods_sct_cd =='03') {
				rtnVal = "주문제작상품";
			} else if ($scope.BasicData.product.dlv_goods_sct_cd =='05') {
				rtnVal = "e쿠폰상품";
			}else {
				rtnVal = "일반상품";
			}

			if (rtnVal != '') {
				rtnVal += "/ " + $scope.BasicData.product.delivery_info;
			}
            
            //20160513 추가 : 배송정보에서 일반상품 나오지 않게 
            if($scope.BasicData.product.dlv_goods_sct_cd == '01' && $scope.BasicData.product.dlv_dday =='7'){
                rtnVal = $scope.BasicData.product.delivery_info;
            }

			return rtnVal;
		};

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
					console.log("toNumber Error ==> " + strNum);
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

	app.filter("trustUrl", ['$sce', function ($sce) {
		return function (recordingUrl) {
			return $sce.trustAsResourceUrl(recordingUrl);
		};
	}]);

	// 전체 Controller
	app.controller('ProductCtrl', ['$scope', '$window', '$http', '$timeout', '$routeParams', '$location', 'LotteCommon', 'Fnproductview', 'commInitData', 'LotteUtil',
		function ($scope, $window, $http, $timeout, $routeParams, $location, LotteCommon, Fnproductview, commInitData, LotteUtil) {
		// console.log('ProductCtrl call start');
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "상품상세"; // 서브헤더 타이틀
		$scope.isShowThisSns = true;
		$scope.isBasicData = false;
		$scope.windowWidth = $(window).width();
		$scope.windowHeight = $(window).height();
		$scope.cateViewFlag = false; // 서브헤더 카테고리 여부
		$scope.loadingFail = false; // 상품상세 로딩 실패
		$scope.viewBigImg = false; // 상품상세 크게 보기버튼 여부
		// menu Small Category GET

		// 20160616 앱전용/제휴채널팝업 데이터화로 인한 삭제 - 박형윤
		/*
		$scope.bigdealFlag = true;// 기특한 빅딜일때 위시,장바구니 안보이게 처리 20160113  
		*/
        //AB테스트용 인입배너 20160708    
        //AB테스트용 인입배너 20160708    
        $scope.AB_TRACK_NO = 100;
        var abcn = commInitData.query['cn'];
        if(abcn == "152131"){
			$scope.AB_TRACK_NO = 1;
			/* 2016.10.17 수정
            $scope.AB_TRACK_NO = getCookie("TRACK_NO");
            if($scope.AB_TRACK_NO == ""){
                $scope.AB_TRACK_NO = parseInt(Math.random()*10); //0~9 까지의 난수
                setCookie("TRACK_NO", $scope.AB_TRACK_NO);                    
            } 
			*/
        }   
 		
        //오늘도착 20160701
        $scope.openWin = function(){
            if ($scope.appObj.isApp) {
                    openNativePopup('배송제외지역 확인하기', 'http://m.lotte.com/product/m/product_list.do?curDispNo=5387795')
            }else{
                window.open('http://m.lotte.com/product/m/product_list.do?curDispNo=5387795');
            } 
        }
		$scope.detailCateView = function () {
			if($scope.BasicData.product.vod_url != undefined && $scope.BasicData.product.vod_url !=''){ return; }
			$scope.sendTclick('m_DC_ProdDetail_Clk_Ttl');
			$scope.cateViewFlag = !$scope.cateViewFlag;
		};

		function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
			return num < 10 ? "0" + num : num + "";
		}

		function getTime(Year, Month, Day, Hour, Min, Sec) { // Timestemp 구하기
			var date = new Date(Year, Month, Day, Hour, Min, Sec);

			if (Year && Month && Day) {
				date.setFullYear(Year);
				date.setMonth(Month - 1);
				date.setDate(Day);

				if (Hour) {
					date.setHours(Hour);
				}

				if (Min) {
					date.setMinutes(Min);
				}

				if (Sec) {
					date.setSeconds(Sec);
				}
			}
			
			return date.getTime();
		}

		// 20160616 앱전용/제휴채널팝업 데이터화로 인한 추가 - 박형윤 --
		function strToTime(str) {
			var rtnTime = 0;

			rtnTime = getTime(
				str.substring(0, 4), // 년
				str.substring(4, 6) ? str.substring(4, 6) : 1, // 월
				str.substring(6, 8) ? str.substring(6, 8) : 1, // 일
				str.substring(8, 10), // 시간
				str.substring(10, 12), // 분
				str.substring(12, 14)); // 초

			return rtnTime;
		}
		// --20160616 앱전용/제휴채널팝업 데이터화로 인한 추가 - 박형윤
		var todayDateTime = new Date(),
			todayDate = todayDateTime.getFullYear() + getAddZero(todayDateTime.getMonth() + 1) + getAddZero(todayDateTime.getDate()), // 년월일
			todayTime = todayDateTime.getTime(); // TimeStemp			
		if (commInitData.query["testDate"]) { // 날짜 설정으로 운영되는 요소에 대한 테스트 코드
			var testDateStr = commInitData.query["testDate"];
			todayDate = commInitData.query["testDate"]; // 년월일
			todayTime = strToTime(todayDate); // 20160616 앱전용/제휴채널팝업 데이터화로 인한 수정
		}
		
		// 20160616 앱전용/제휴채널팝업 데이터화로 인한 추가 - 박형윤 --
		var goodsNo = Fnproductview.objectToString(commInitData.query['goods_no']); // 상품번호
		var cn = "";  // 채널번호

		if (!Fnproductview.isEmpty(commInitData.query['cn'])) {
			cn = Fnproductview.objectToString(commInitData.query['cn']); // 채널번호
		}

		// 앱전용 상품 체크 Object
		$scope.chkAppOnlyObj = {
			flag: false, // 앱 전용 상품 여부
			alertMsg: "", // 앱전용 안내 Alert문구
			referrer: "", // 앱(안드로이드) 설치시 referrer
			tclick: "", // Tclick
			webEnterFlag: true, // 웹으로 상세페이지 접근 가능 여부 (불가시 Alert 노출 후 메인으로 이동됨)
			deepLinkFlag: true, // 딥링크 연결 여부
			shareEnable: true // 공유 기능 가능여부 및 상품번호 노출 노출 여부
		};

		// 제휴채널 전면팝업 체크 Object
        
		$scope.chkAlliancePopupObj = {
			flag: false, // 노출 여부
			imgPath: "", // 팝업 이미지 경로
			deepLinkFlag: true, // 딥링크 연결 여부
			referrer: "", // 앱(안드로이드) 설치시 referrer
			tclick: "" // Tclick
		};

		// 앱전용 상품/제휴채널 전면팝업 정보 로드            
		$http.get(LotteCommon.productLimitInfoData)
		.success(function (data) {
			var i = 0, j = 0;

			// 앱전용 상품 체크
			if (data.appOnlyInfo && data.appOnlyInfo.length > 0) {
				var appOnlyInfo = data.appOnlyInfo;

				for (i = 0; i < appOnlyInfo.length; i++) {
					if (appOnlyInfo[i].goodsLst && appOnlyInfo[i].goodsLst.length > 0) {
						for (j = 0; j < appOnlyInfo[i].goodsLst.length; j++) {
							if (goodsNo == appOnlyInfo[i].goodsLst[j]) {
								if (!appOnlyInfo[i].dateLimitFlag || 
									(appOnlyInfo[i].dateLimitFlag && 
									appOnlyInfo[i].sdate &&
									appOnlyInfo[i].edate &&
									(todayTime >= strToTime(appOnlyInfo[i].sdate) && todayTime < strToTime(appOnlyInfo[i].edate)))) {
									$scope.chkAppOnlyObj.flag = true;
									$scope.chkAppOnlyObj.alertMsg = appOnlyInfo[i].alertMsg;
									$scope.chkAppOnlyObj.referrer = appOnlyInfo[i].referrer;
									$scope.chkAppOnlyObj.tclick = appOnlyInfo[i].tclick;
									$scope.chkAppOnlyObj.webEnterFlag = appOnlyInfo[i].webEnterFlag;
									$scope.chkAppOnlyObj.deepLinkFlag = appOnlyInfo[i].deepLinkFlag;
									$scope.chkAppOnlyObj.shareEnable = appOnlyInfo[i].shareEnable;
									break;
								}
							}
						}
					}
				}
			}
            
			// 제휴채널 전면팝업 체크
			if (data.alliancePopup && data.alliancePopup.length > 0) {
				var alliancePopup = data.alliancePopup;

				for (i = 0; i < alliancePopup.length; i++) {
					if (alliancePopup[i].chlnoLst && alliancePopup[i].chlnoLst.length > 0) {
						for (j = 0; j < alliancePopup[i].chlnoLst.length; j++) {
							if (cn == alliancePopup[i].chlnoLst[j]) {

								console.log("alliancePopup[i].dateLimitFlag", alliancePopup[i].dateLimitFlag, alliancePopup[i].sdate, alliancePopup[i].edate);
								if (!alliancePopup[i].dateLimitFlag || 
									(alliancePopup[i].dateLimitFlag && 
									alliancePopup[i].sdate && 
									alliancePopup[i].edate && 
									(todayTime >= strToTime(alliancePopup[i].sdate) && todayTime < strToTime(alliancePopup[i].edate)))) {
                                    $scope.chkAlliancePopupObj.flag = true;
									$scope.chkAlliancePopupObj.imgPath = alliancePopup[i].imgPath;
									$scope.chkAlliancePopupObj.deepLinkFlag = alliancePopup[i].deepLinkFlag;
									$scope.chkAlliancePopupObj.referrer = alliancePopup[i].referrer;
									$scope.chkAlliancePopupObj.tclick = alliancePopup[i].tclick;

									break;
								}
							}
						}
					}
				}
			}
            //console.log($scope.chkAlliancePopupObj);
			// 앱 전용 상품이며, 웹페이지로의 접근이 막혀 있는 케이스일 경우 메인으로 이동
			if (!$scope.appObj.isApp && $scope.chkAppOnlyObj.flag && !$scope.chkAppOnlyObj.webEnterFlag) {
				if ($scope.chkAppOnlyObj.alertMsg) {
					alert($scope.chkAppOnlyObj.alertMsg);
					window.location.href = "/";
				}
			}
		})
		.error(function (data) {
			console.log("앱전용 상품/제휴채널 전면팝업 데이터 오류");
		});
        
		//-- 20160616 앱전용/제휴채널팝업 데이터화로 인한 추가 - 박형윤

		// UI Scope
		$scope.reqParam = {
			curDispNo: "",
			curDispNoSctCd: ""
		};

		if (!Fnproductview.isEmpty(commInitData.query['upCurDispNo'])) {
			$scope.reqParam.upCurDispNo = Fnproductview.objectToString(commInitData.query['upCurDispNo']); // 상위 카테고리번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['curDispNo'])) {
			$scope.reqParam.curDispNo = Fnproductview.objectToString(commInitData.query['curDispNo']); // 카테고리번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['goods_no'])) {
			$scope.reqParam.goods_no = Fnproductview.objectToString(commInitData.query['goods_no']); // 상품번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['wish_lst_sn'])) {
			$scope.reqParam.wish_lst_sn = Fnproductview.objectToString(commInitData.query['wish_lst_sn']); // 위시리스트번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['cart_sn'])) {
			$scope.reqParam.cart_sn = Fnproductview.objectToString(commInitData.query['cart_sn']); // 장바구니 번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['item_no'])) {
			$scope.reqParam.item_no = Fnproductview.objectToString(commInitData.query['item_no']); // 단품번호
		}

		if (!Fnproductview.isEmpty(commInitData.query['genie_yn'])) {
			$scope.reqParam.genie_yn = Fnproductview.objectToString(commInitData.query['genie_yn']); // 빅딜여부
		}

		if (!Fnproductview.isEmpty(commInitData.query['curDispNoSctCd'])) {
			$scope.reqParam.curDispNoSctCd = Fnproductview.objectToString(commInitData.query['curDispNoSctCd']); // 유입코드
		}

		if (!Fnproductview.isEmpty(commInitData.query['late_view_yn'])) {
			$scope.reqParam.late_view_yn = Fnproductview.objectToString(commInitData.query['late_view_yn']); // 최근본상품여부
		}

		if (!Fnproductview.isEmpty(commInitData.query['cn'])){$scope.reqParam.cn = Fnproductview.objectToString(commInitData.query['cn']);/* 채널코드 */}
		if (!Fnproductview.isEmpty(commInitData.query['cdn'])){$scope.reqParam.cdn = Fnproductview.objectToString(commInitData.query['cdn']);/* 채널상세코드 */}

		$scope.reqParamStr = $scope.baseParam;

		if (!Fnproductview.isEmpty($scope.reqParam.curDispNoSctCd)) {
			$scope.reqParamStr += "&curDispNoSctCd="+$scope.reqParam.curDispNoSctCd;
		}

		if (!Fnproductview.isEmpty($scope.reqParam.curDispNo)) {
			$scope.reqParamStr += "&curDispNo="+$scope.reqParam.curDispNo;
		}

		if (!Fnproductview.isEmpty($scope.reqParam.goods_no)) {
			$scope.reqParamStr += "&goods_no="+$scope.reqParam.goods_no;
		}
		
		$scope.Fnproductview = Fnproductview;
		$scope.priceInfo = {};
		$scope.imageList = []; //상품 스와이프 이미지 목록
		$scope.smartpickBookingBrch = {}; //스마트픽 지점정보

		var getPriceInfo = function () {
			// console.log('getPriceInfo called');
			var product = $scope.BasicData.product;

			$scope.priceInfo.titlePrice = "0"; // 상품명하단 가격정보
			$scope.priceInfo.sale_price = "0";
			$scope.priceInfo.discount_amt = "0";
			$scope.priceInfo.lowPrice = "0"; // 가격노출순위에 따은 상단 가격정보
			$scope.priceInfo.finalPromCardPrice = "0";

			var intSalePrc = Fnproductview.toNumber(product.sale_prc)
			var intDscntSalePrc = Fnproductview.toNumber(product.dscnt_sale_prc)
			var intInstCpnAplyUnitPrice = Fnproductview.toNumber(product.inst_cpn_aply_unit_price)
			var intImmedPayDscntAmt = Fnproductview.toNumber(product.immed_pay_dscnt_amt)

			if (product.ec_goods_artc_cd == '31' && $scope.BasicData.elotte_yn != 'Y' ) {
				$scope.priceInfo.lowPrice = product.sale_prc;
			} else {
				$scope.priceInfo.lowPrice = product.sale_prc;
			}

			if (($scope.BasicData.chl_no == '109329' || $scope.BasicData.chl_no == '132224' || $scope.BasicData.chl_no == '156027')
				&& (product.sale_prc != product.dscnt_sale_prc)) {
				$scope.priceInfo.sale_price = intDscntSalePrc - (intInstCpnAplyUnitPrice + intImmedPayDscntAmt);
				$scope.priceInfo.discount_amt = (intSalePrc - intDscntSalePrc) + intInstCpnAplyUnitPrice + intImmedPayDscntAmt ;
				$scope.priceInfo.lowPrice = $scope.priceInfo.sale_price;
			} else {
				if (product.inst_fvr_polc_tp_cd == '03' || product.inst_fvr_polc_tp_cd == '04') {
					$scope.priceInfo.sale_price = intSalePrc - (intInstCpnAplyUnitPrice + intImmedPayDscntAmt);
					$scope.priceInfo.discount_amt = intInstCpnAplyUnitPrice + intImmedPayDscntAmt ;
				} else {
					$scope.priceInfo.sale_price = intSalePrc - intImmedPayDscntAmt;
					$scope.priceInfo.discount_amt = intImmedPayDscntAmt ;
				}
			}

			if (product.immed_pay_dscnt_amt != '0' || product.inst_fvr_polc_tp_cd == '03' || product.inst_fvr_polc_tp_cd == '04') {
				$scope.priceInfo.lowPrice = $scope.priceInfo.sale_price;
			}

			var intPromCardPrice = 0,
				intPromAplyLmtAmt = 0,
				intPromFvrVal=0,
				intMaxFvrVal=0;

			if (product.prom_card_yn == 'Y' && $scope.priceInfo.lowPrice > product.lotte_card_dc_prc) {
				$scope.priceInfo.promCardPrice = product.lotte_card_dc_prc;
			} else {
				$scope.priceInfo.promCardPrice = $scope.priceInfo.lowPrice;
			}

			intPromCardPrice = Fnproductview.toNumber($scope.priceInfo.promCardPrice);
			intPromFvrVal = Fnproductview.toNumber(product.prom_fvr_val);
			intPromAplyLmtAmt = Fnproductview.toNumber(product.prom_aply_lmt_amt);
			intMaxFvrVal = Fnproductview.toNumber(product.max_fvr_val);

			if (intPromCardPrice >= intPromAplyLmtAmt && !Fnproductview.isEmpty(product.prom_card_nm)) {
				var dscntPromCardPrice = intPromCardPrice*(intPromFvrVal*0.01);
				var finalPromCardPrice = (intPromCardPrice - dscntPromCardPrice)/10;

				if (dscntPromCardPrice>= intMaxFvrVal) {
					finalPromCardPrice = (intPromCardPrice-intMaxFvrVal)/10;
				}

				$scope.priceInfo.finalPromCardPrice = (finalPromCardPrice*10);
			}

			if (product.reserve_lpoint == null) {
				product.reserve_lpoint == '';
			}

			if (product.reserve_plus_card == null) {
				product.reserve_plus_card == '';
			}

			if (Fnproductview.isEmpty($scope.reqParam.curDispNo)) {
				$scope.reqParam.curDispNo = product.mast_disp_no;
			}

			//총 할인률을 별도로 구한다. 기존쿼리에서 보내주는 할인정책별 전체 할인률을 구하려면 복잡(정액???처리)+누락이 발생할수 있어서
			//총할인률 : 최종금액 + 최종 할인금
			var disc_rt = null;

			if ($scope.BasicData.product.org_sale_prc != $scope.priceInfo.lowPrice) {
				var tmpPrice = Fnproductview.toNumber($scope.BasicData.product.org_sale_prc);
				disc_rt = parseInt( (tmpPrice - $scope.priceInfo.lowPrice)/tmpPrice*100,0);
				$scope.priceInfo.disc_prc = intDscntSalePrc - $scope.priceInfo.lowPrice;
			}

			$scope.priceInfo.immed_pay_dscnt_amt = intImmedPayDscntAmt;
			//if ($scope.BasicData.product.inst_cpn_aply_val != null) {
			//  disc_rt = parseInt(disc_rt +Fnproductview.toNumber($scope.BasicData.product.inst_cpn_aply_val));
			//}

			if ($scope.BasicData.product.prc_dif_view_yn != 'Y' && $scope.BasicData.product.inst_cpn_aply_val != null) {
				disc_rt = parseInt(Fnproductview.toNumber($scope.BasicData.product.inst_cpn_aply_val));
			}

			$scope.priceInfo.disc_rt = disc_rt ;
		};

		var getProdBannerList = function () {
			var rtnBannerList = [];
			var product_banner = $scope.BasicData.product_banner;
			var proBaDispCnt=0,showSetRnk=1;

			if (product_banner != null) {
				var doneLoop = 2;

				if ($scope.BasicData.product.entr_no == '13145') {
					showSetRnk = 2; // 홈쇼핑
				} else {
					showSetRnk = 1; // 닷컴
				}

				for (var i = 0; i < product_banner.total_count; i++) {
					if (proBaDispCnt >= doneLoop) {
						break;
					}

					var item = product_banner.items[i];

					if ($scope.BasicData.elotte_yn != 'Y') {
						if (Fnproductview.objectToString(showSetRnk) == item.set_rnk) {
							proBaDispCnt = proBaDispCnt + 1;
							rtnBannerList.push(item);
						}
					} else {
						proBaDispCnt = proBaDispCnt + 1;
						rtnBannerList.push(item);
					}
				}
			}

			return rtnBannerList;
		};

		// 최근본상품
		var lastStatusViewGoods = function () {
			var storageViewGoods = localStorage.getItem('latelyGoods');
			var scope = angular.element('html').scope();
			var storageViewGoodsArr = [];
			var newStorageViewGoodsObj = {};
			var newStorageViewGoods = "";
			var userGoodsDataInsert = false;
			var loginUserMbrNo = "";
			var storageStr = "";


			if (storageViewGoods != null) {
				storageViewGoodsArr = storageViewGoods.split("|");

				newStorageViewGoodsObj['goods_no'] = [];

				for (var i = 0; i < storageViewGoodsArr.length; i++) {
					newStorageViewGoodsObj['goods_no'].push(storageViewGoodsArr[i]);
				}

				if (newStorageViewGoodsObj['goods_no'].indexOf($scope.BasicData.goods_no) != -1) {
					newStorageViewGoodsObj['goods_no'].splice(newStorageViewGoodsObj['goods_no'].indexOf($scope.BasicData.goods_no),1);
				}
				newStorageViewGoodsObj['goods_no'].push($scope.BasicData.goods_no);

				angular.forEach(newStorageViewGoodsObj, function (val, key) {
					if (val.length > 20) {
						val.splice(0, (val.length-20));
					}

					if (newStorageViewGoods != "") { newStorageViewGoods += "|"; }
					newStorageViewGoods += val.join("|");
				});

				storageStr = newStorageViewGoods;
				localStorage.setItem("latelyGoods", storageStr);
				$scope.shareStorage("local", "latelyGoods", storageStr); //https일때 추가
			} else {
				storageStr = $scope.BasicData.goods_no;
				localStorage.setItem("latelyGoods", storageStr);
				$scope.shareStorage("local","latelyGoods", storageStr); //https일때 추가
			}
		};
		
		$scope.makerInfo = ""; //20160201 제조사/제조국 정보

		// 20160616 앱전용/제휴채널팝업 데이터화로 인한 삭제 - 박형윤
		/*
		// 20160315 박형윤 - 백화점잡화(아동) 앱전용(폐쇄몰) 상품 웹 진입 불가 처리 및 APP에서 공유하기 제거
		$scope.shareDisableFlag = false;
		$scope.checkDeptBabyAppProd = function (goodNo) {
			//if (todayTime >= getTime(2016, 3, 15) && todayTime < getTime(2016, 4, 1)) { // 3.22 ~ 3.28
				if (
					goodNo == "247443971" ||
					goodNo == "247442735" ||
					goodNo == "247443139" ||
					goodNo == "247443801" ||
					goodNo == "247444258" ||
					goodNo == "247445041" ||
					goodNo == "247443633" ||
					goodNo == "247427701" ||
					goodNo == "247430208" ||
					goodNo == "247432064" ||
					goodNo == "247434874" ||
					goodNo == "247435540"
				) {
					if ($scope.appObj.isApp) { // 앱일 경우
						$scope.shareDisableFlag = true;
					} else {
						alert("※ 본 상품은 모바일 APP에서만 구매하실 수 있습니다.");
						window.location.href = "/";
					}
				}
			//}
		};
		*/

		/**
		 * Data Load Scope Func
		 */
		// 상품기본정보 데이터 로드
		$scope.loadBasicData = function() {
			if ($scope.BasicData == undefined) {
				//console.log('reqParam', $scope.reqParam);

				$http.get(LotteCommon.productProductViewData, {params:$scope.reqParam})
				.success(function(data) {
					//console.log('loadBasicData complete!!');

					$scope.BasicData = data.max; // 상품기본정보 로드
					$scope.isBasicData = true;

					// 20160616 앱전용/제휴채널팝업 데이터화로 인한 삭제 - 박형윤
					/*
					//20160315 박형윤 - 백화점잡화(아동) 앱전용(폐쇄몰) 상품 웹 진입 불가 처리 및 APP에서 공유하기 제거
					$scope.checkDeptBabyAppProd($scope.BasicData.goods_no);
					*/
			                //@@선물하기
			                $scope.BasicData.product.review_totalcnt =  parseInt($scope.BasicData.product.review_totalcnt);
			                $scope.BasicData.product.gift_totalcnt = parseInt($scope.BasicData.product.gift_totalcnt);

					
					// 20160616 앱전용/제휴채널팝업 데이터화로 인한 삭제 - 박형윤
					/*
					//기특한 빅딜 예외처리 (5/2 ~ 5/16 까지 BHC 프로모션으로 운영)
					if (todayTime >= getTime(2016, 5, 2) && todayTime < getTime(2016, 5, 16)) { // 현재 진행 상품
						if($scope.BasicData.goods_no == "246147442" ||
							$scope.BasicData.goods_no == "246147234" ||
							$scope.BasicData.goods_no == "249408154" ||
							$scope.BasicData.goods_no == "249404277" ||
							$scope.BasicData.goods_no == "247670292"
						  ) {
							$scope.bigdealFlag = false;
						}
					}
					//20160512 기특한 빅딜 예외처리 1차
					$scope.bigDealGoods0512 = false;
					var goodNo = $scope.BasicData.goods_no;
					if( goodNo == "254681407" ||
						goodNo == "256613474" ||
						goodNo == "256582743" ||
						goodNo == "256389090"
					  ){
						$scope.bigDealGoods0512 = true;
						$scope.bigdealFlag = false;
					}                    
					//20160512 기특한 빅딜 예외처리 2차
					if( goodNo == "256399690" ||
						goodNo == "256396237" ||
						goodNo == "256568909" ||
						goodNo == "256398120"
					  ){
						$scope.bigDealGoods0512 = true;
						$scope.bigdealFlag = false;
					}  
					 //20160602 기특한 빅딜 1차
					if( goodNo == "260240906" ||
						goodNo == "259861867" ||
						goodNo == "261634191" ||
						goodNo == "261364101" ||
						goodNo == "260025723"
					  ){
						$scope.bigDealGoods0512 = true;
						$scope.bigdealFlag = false;
					}
					 //20160613 기특한 빅딜 2차
					if( goodNo == "264920029" ||
						goodNo == "264909300" ||
						goodNo == "264924545" ||
						goodNo == "264898234" ||
						goodNo == "266585093" || //20160615 기특한 빅딜 2차 추가
						goodNo == "266585766" ||
						goodNo == "264917901" ||
						goodNo == "266587253" ||
						goodNo == "266638093"
					  ){
						$scope.bigDealGoods0512 = true;
						$scope.bigdealFlag = false;
					}
					 //20160607 페리카나 1차
					if( goodNo == "261630852" ||
						goodNo == "261631114"
					  ){
						$scope.bigDealGoods0512 = true;
						$scope.bigdealFlag = false;
					}  
					//20160512 기특한빅딜 채널코드 전면팝업
					$scope.event0512Flag = false;
					var cnCodes = ['186925','186926','186927','186928','186929','186930','186931','186932','186933','186934','186935','186936','186937','186938','186940','186941','186942','186943','186944']; //채널코드 리스트 
					var cnParam = commInitData.query['cn'];
					if(cnParam != '' && !$scope.appObj.isApp){
						for(var k=0; k< cnCodes.length; k++){
							if(cnCodes[k] == cnParam){
								$scope.event0512Flag = true;
							}
						}                        
					}
					//20160602 채널코드 전면팝업
					$scope.event0602Flag = false;
					cnCodes = ['150824']; //채널코드 리스트 
					if(cnParam != '' && !$scope.appObj.isApp){
						for(var k=0; k< cnCodes.length; k++){
							if(cnCodes[k] == cnParam){
								$scope.event0602Flag = true;
							}
						}                        
					}                    
					$scope.goToApp = function(){                            
						AppExec.MARKET_URL_ANDROID = "market://details?id=com.lotte&referrer=lotte200066lotte";
						AppExec.appExecute();
					}
					//20160608
					$scope.goToApp2 = function(){                            
						AppExec.MARKET_URL_ANDROID = "market://details?id=com.lotte&referrer=lotte200089lotte";
						AppExec.appExecute();
					}
					
					//세븐카페 아메리카노(2016/4/14 ~ 5/31) 행사 상품 체크
					if (todayTime >= getTime(2016, 4, 14) && todayTime < getTime(2016, 6, 1)) { // 현재 진행 상품
						if($scope.BasicData.goods_no == "248961642" || $scope.BasicData.goods_no == "257086184") {
							$scope.bigdealFlag = false;
						}
					}
					*/
					
					//$scope.goodsnm = $scope.reqParam.curDispNo;
					$scope.btnDispTp = Fnproductview.productbtnlayertp($scope);
					$scope.mdNtcFcont = '';

					if (Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont)) {
						$scope.mdNtcFcont += $scope.BasicData.product.md_ntc_fcont;
					}

					if (Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont1)) {
						$scope.mdNtcFcont += $scope.BasicData.product.md_ntc_fcont1;
					}

					if (Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont2)) {
						$scope.mdNtcFcont += $scope.BasicData.product.md_ntc_fcont2;
					}

					getPriceInfo(); // 가격정보 셋팅

					var dstr = Fnproductview.getDeliveryInfo($scope); // 배송비 정보 셋팅

					dstr = dstr.replace("</br>", "<br>");
					$scope.deliveryInfoTpStr = dstr.replace("<br/>", "<br>");

					$scope.prodBannerList = getProdBannerList($scope); // 혜택정보 배너 셋팅
					$scope.reqCheckList(); // 체크리스트

					if ($scope.BasicData.min_lmt_qty == null || $scope.BasicData.min_lmt_qty == '') {
						$scope.BasicData.min_lmt_qty = "1";
					}

					// 스와이프 동영상및 이미지 정의
					if ($scope.BasicData.product.dtl_info_vod != null && $scope.BasicData.product.dtl_info_vod != '') {
						var item = {};

						item.tp = "vod";
						item.dtl_info_vod = $scope.BasicData.product.dtl_info_vod;
						$scope.imageList.push(item);
					}

					// 이미지정보 셋팅[스와이프용]
					angular.forEach($scope.BasicData.product, function(val,key) {
						// console.log(val +":"+ key);

						if (key != 'img_url' && key.indexOf('img_url') == 0) {
							if ($scope.BasicData.product[key] != null && $scope.BasicData.product[key] != '') {
								var item = {};
								item.tp = "img";
								item.imgUrl = $scope.BasicData.product[key].replace('_280', '_550');
								$scope.imageList.push(item);
							}
						}
					});

					if ($scope.imageList.length > 0) {
						$scope.share_img = $scope.imageList[0].imgUrl;
					} else {
						$scope.share_img = "";
					}

					$scope.subTitle = $scope.BasicData.product.mgoods_nm; // 공유하기 상품명 타이틀 (goods_nm 는 브랜드명 없음)

					// 기획전인경우 상품명 가공
					if ($scope.BasicData.product.select_goods_list.items != null && $scope.BasicData.product.select_goods_list.items.length > 0) {
							for (var k = 0; k<$scope.BasicData.product.select_goods_list.items.length; k++) {
								$scope.BasicData.product.select_goods_list.items[k].goods_nm = "[선택 " + (k + 1) + "] " + $scope.BasicData.product.select_goods_list.items[k].goods_nm;
							}
					}

					// 와인상품이면 마지막 이미지는 국가 이미지로 지정되어 있음.
					// -- 스와이프 이미지 목록에서는 제거한다.
					var smp_wine_yn = $scope.BasicData.smp_wine_yn;

					if (smp_wine_yn != null && smp_wine_yn=='Y') {
						if ($scope.imageList.length > 0) {
							$scope.imageList.splice($scope.imageList.length-1, 1);
						}
					}

					// 최근 본 상품에서 온 경우가 아니면
					if ($scope.reqParam.late_view_yn != 'Y') {
							lastStatusViewGoods();
					}
                    
                    //20160201 제조사/제조국 정보
                    if($scope.BasicData.product.mfcp_nm != null && $scope.BasicData.product.orpl_nm != null){
                        $scope.makerInfo = $scope.BasicData.product.mfcp_nm +"/"+  $scope.BasicData.product.orpl_nm; 
                    }
                    
                    if($scope.BasicData.product.vod_url != undefined && $scope.BasicData.product.vod_url != ""){
                    	// 동영상이 있으면 초기화
                    	$timeout(function(){
                    		autoVideoPlay('autoVideo', '#autoVideo');
                    	}, 100);
                    }
                    


            		/**
            		 * 와이더플래닛 모바일 스크립트
            		 * 2016.09.19 한상훈
            		 */
            		$timeout(function(){
            			var items = [{i:$scope.BasicData.goods_no, t:$scope.BasicData.product.goods_nm}];
            			$scope.addWiderPlanetLog("Item", items);
            		}, 3000);
				})
				.error(function () {
					$scope.loadingFail = true;
					console.log('Data Error : 상품기본정보 로드 실패');

					// 20160616 앱전용/제휴채널팝업 데이터화로 인한 삭제 - 박형윤
					/*
					//20160315 박형윤 - 백화점잡화(아동) 앱전용(폐쇄몰) 상품 웹 진입 불가 처리 및 APP에서 공유하기 제거
					$scope.checkDeptBabyAppProd($scope.reqParam.goods_no);
					*/
				});
			}
		};

		$scope.intFnc = function (val) {
			return parseInt(val);
		};

		$scope.reqCheckList = function () {
			// 성인 인증 체크
			if ($scope.BasicData.product.byr_age_lmt_cd == "19") { // 19금 상품
				if ($scope.loginInfo.isAdult == "") { //본인인증 안한 경우
					if (!$scope.loginInfo.isLogin) {  // 로그인 안한 경우
						// $scope.loginProc('Y');
						Fnproductview.goToLogin($window, $scope, LotteCommon.loginUrl + '?adultChk=Y');
					} else {
						$scope.goAdultSci();
					}

					return false;
				} else if (!$scope.loginInfo.isAdult) { //성인이 아닌 경우
					alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
					return false;
				}
			}
		};

		if(location.host == "localhost:8082" || location.host == "mo.lotte.com"){
			window.scope = $scope;
		};
		/*2016.09.06 배송메세지 안내*/
		$scope.enableDate = function(startDate, endDate){
			var dValue = false;
			if(todayTime >= strToTime(startDate) && todayTime < strToTime(endDate)){
				dValue = true;
			}
			return dValue;
		};
		$scope.goDeliveryMsg = function(curD,tclick){
			location.href = $scope.baseLink('/product/m/product_list.do?'+ curD + "&tclick=" + tclick);
		};	
			
	}]);

	// Route용 Controller
	app.controller('ProductDetailPage', ['$scope', '$window', 'Fnproductview', function ($scope, $window,Fnproductview) {
		//console.log('ProductDetailPage called');
		$scope.loadBasicData();

		// $scope.productDetail(); //bottom 상품옵션정보 layer
		angular.element($window).scrollTop(0);

		// 상품기본정보 데이터 로드
		$scope.optionChange = function (idx, t) {
			 //console.log('idx', idx);
		};

		// 절친쿠폰
	  $scope.goBestFriendCoupon = function (url) {
	   var goUrl = url + "&tclick=m_o_footer_banner";
	   //goUrl += "&tclick=m_o_footer_banner"; 

	   Fnproductview.goUrl($window, $scope, goUrl, null);
	  };
	}]);

	// 동영상 포스트컷(스냅샷) - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
	app.directive('videoPoster', [function () {
		return {
			restrict: 'A', // attribute
			link : function ($scope, element, attrs) {
				if (attrs.videoPoster) {
					angular.element(element).attr("poster", attrs.videoPoster);
					//poster="http://image.lotte.com/lotte/mo2015/angular/common/transparent.png"
					//element.parent('.video_wrap').attr("style", "background:url("+attrs.videoPoster+") no-repeat 50% 50%;background-size:cover;");
				}
			}
		};
	}]);

	// 동영상 주소 - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
	app.directive('videoSource', [function () {
		return {
			restrict: 'A', // attribute
			link : function ($scope, element, attrs) {
				if (attrs.videoSource) {
					angular.element(element).attr("src", attrs.videoSource);
				}
			}
		};
	}]);

	// Directive :: rendering 후 호출하기위한 함수
	app.directive('onFinishRender', function ($timeout) {
		return {
			restrict:'A',
			scope:true,
			link: function($scope, el, attrs) {
				//console.log('$scope.$last : ',$scope.$last);
				if ($scope.$last === true) {
					$timeout(function (ngFinishedEvent) {
						$scope.$emit(attrs.onFinishRender);
						$scope.$apply();
					}, 0);
				}
			}
		};
	});

	// 하단 주문레이어 시작
	app.directive('footerOptionbar', ['$http', '$window', '$timeout', '$location', '$compile', 'LotteCommon', 'Fnproductview', 'LotteForm', 'LotteCookie', 'LotteLink',
		function($http, $window, $timeout, $location, $compile, LotteCommon, Fnproductview, LotteForm, LotteCookie, LotteLink) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/footer_optionbar.html',
			replace:true,
			link: function ($scope, el, attrs) {
                
                
				// 20160616 앱전용/제휴채널팝업 데이터화로 인한 추가 - 박형윤 --
				// 제휴채널 전면 팝업 닫기
				$scope.closeAlliancePopup = function () {
					$scope.chkAlliancePopupObj.flag = false;
				};

				// 제휴채널 팝업에서 앱실행 링크
				$scope.allianceExcuteApp = function () {
					var deepLinkUrl = $scope.chkAlliancePopupObj.deepLinkFlag ? null : "http://m.lotte.com";
					var referrer = $scope.chkAlliancePopupObj.referrer ? $scope.chkAlliancePopupObj.referrer : null;
					var tclick = $scope.chkAlliancePopupObj.tclick ? $scope.chkAlliancePopupObj.tclick : null;

					LotteLink.appDeepLink("lotte", deepLinkUrl, tclick, referrer); // 앱 딥링크 params : lotte/ellotte, 딥링크URL (없을 경우 default 현재 URL, tclick, referrer)
				};
				//-- 20160616 앱전용/제휴채널팝업 데이터화로 인한 추가 - 박형윤
				$scope.google_map_url = LotteCommon.pickMapUrl;
				el = el.find("#optionWrap");
                //20160303 구매사은
                $scope.tabFixed = false;//상품설명,상품평~ 탭이 상단에 고정되는지 여부를 판단 -> 바로주문바 구매사은팝업 20160303 
                $scope.showBuyGift = true;
                $scope.buygift = $scope.BasicData.product.buy_gift;
				$scope.holiday = $scope.BasicData.quick_dlv_holiday;//퀵배송(백화점 휴일 영업일:false)
				$scope.qs_yn = 'N';//퀵배송 선택 시 Y
                if($scope.buygift == undefined){
                    $scope.buygift = null;
                }

                if($scope.buygift != null){
					// 옵션바 : 구매사은
					$scope.buygiftOptionBar = "/event/m/eventSaunMain.do?"+ $scope.baseParam +"&evt_no=" + $scope.buygift.link + "&tclick=m_DC_ProdDetail_Clk_Lnk_4";
                    $scope.showBuyGiftDetail = "<a href='"+ $scope.buygiftOptionBar +"'>" + $scope.buygift.txt2 + "<img class='arrow' src='http://image.lotte.com/lotte/mo2015/angular/detail/arrow_buygift.png'></a>";
                }

				// info-normal : 구매사은
				$scope.buyGift = function() {
					location.href = "/event/m/eventSaunMain.do?"+ $scope.baseParam +"&evt_no=" + $scope.buygift.link + "&tclick=m_DC_ProdDetail_Clk_Lnk_3";
				}

                $scope.closeBuyGift = function(){
                    $scope.showBuyGift = false;
                }
                $scope.tabFixedChange = function(flag){
                    $scope.tabFixed = flag;
                }
                
                // 품절일경우
    			if( $scope.BasicData.product.sale_stat_cd == '20' ) {
    				$scope.brieflyPop({target : "soldoutPop"});
    			}	
    			
    			// 판매종료일경우
    			if( $scope.BasicData.product.sale_stat_cd == '30' ) {
    				$scope.brieflyPop({target : "soldout2Pop"});
    			}	
    			
				setTimeout(function () {
					$scope.$apply(function () {
						//console.log("footerOptionbar called");
						$scope.brch_shop_no = ""; //스마트픽 상품인경우 선택된 지점 모델정보
						/*
						var btnOrder = el.find(".btnOrder"),
								btnCart = el.find(".btnCart"),
								btnWish = el.find(".btnWish"),
								btnAlarm = el.find(".btnAlarm"),
								btnSmart = el.find(".btnSmart"),
								btnOptionClose = el.find(".btnOptionClose,.dim"),
								selPopup = el.find(".selPopup"),
								selLayer = el.find(".selLayer"),
								selOption = el.find(".selOption");
						*/

						// DIM 레이어 높이 조절
						$scope.dimAutoHeight = function () {
							var hh = $(window).height() - $(".optionLayer").height() - 50;
							$("#optionDim").css("height", hh);

							setTimeout(function () {
								hh = $(window).height() - $(".optionLayer").height() - 50;
								$("#optionDim").css("height", hh);
							}, 300);
						};

						// eung 제거 예정
						$scope.smpDispYn = ($scope.BasicData.product.smp_exchange_yn == 'Y' && $scope.BasicData.product.smp_only_yn != 'Y') ? "Y" : "N";

						if ($scope.BasicData.product.smp_exchange_yn == "Y") { // 배송방법 선택가능이면 스마트픽 상품
							$scope.deliSelect = true;
							$scope.isSmpYn = true;

							if ($scope.BasicData.product.smp_only_yn == "Y") {
								$scope.isDeliveryYn = false; // 택배선택 불가
							} else {
								$scope.isDeliveryYn = true;
							}
						}

						// eung 택배&스마트픽 유형 체크
						// 0 : 택배&스마트픽 겸용, 1 : 택배전용, 2 : 스마트픽 전용
						$scope.showDelivery = false;
						$scope.totalDelivery_type = "0";
						$scope.isAnySmp = false; // 기획전이고 스마트픽 상품이 한개라도 있으면 true
						$scope.isDept = false;
						$scope.isBtnDeli = true;//택배로 받기 버튼 활성화
						$scope.isBtnQuick = false;//퀵배송 받기 버튼 활성화
						if ($scope.BasicData.product.select_goods_list.total_count == 0) { //단품인 경우
							//스마트픽 상품이고, 택배와 겸용인경우에만 보여짐 (smp_exchange_yn 롯데백화점 스마트픽업 겸용, crspk_psb_yn 편의점 크로스픽업 겸용)
							if ($scope.BasicData.product.smp_exchange_yn == "Y" || $scope.BasicData.product.crspk_psb_yn == "Y"){
								$scope.showDelivery = true;
							}
							//스마트픽 일때, 일반상품(예약상품X)일경우
							if($scope.BasicData.product.smp_exchange_yn == 'Y' && $scope.BasicData.product.dlv_goods_sct_cd == '01' && !$scope.BasicData.product.reserve_start) $scope.isBtnQuick = true;
							if($scope.BasicData.product.smp_only_yn == 'Y') $scope.isBtnDeli = false;
						} else { //기획전인 경우
							var i, kitem;
							$scope.isBtnDeli = false;

							for (i = 0; i <  $scope.BasicData.product.select_goods_list.total_count; i++) {
								kitem = $scope.BasicData.product.select_goods_list.items[i];

								if (kitem.delivery_type != "1") {
									$scope.showDelivery = true;
									$scope.isAnySmp = true;
									$scope.isBtnQuick = true;
								}
								if(kitem.delivery_type != '2'){//스마트픽 전용일 때 택배로 받기 비노출
									$scope.isBtnDeli = true;
								}
								if(kitem.usm_goods_no != "" && kitem.usm_goods_no != null){
									$scope.isDept = true;
								}
							}
						}

						// 스마트픽 옵션레이어 지점 유지
						$scope.tempIndex;

						$scope.setTempIndex = function (id) {
							$scope.tempIndex = id;
						};

						$scope.smpSelectCheck = function (shopNo) {
							var check = false;
                            if(!$scope.orderTypeGift){ //선물하기가 아닌 경우
                                var obj = $scope.orderList[$scope.tempIndex];

                                if (obj.smp_shop_no != undefined && obj.smp_shop_no != '') {
                                    if (obj.smp_shop_no == shopNo) {
                                        check = true;
                                    }
                                }                                
                            }console.log($scope.tempIndex,obj.smp_shop_no,check,shopNo);
							return check;
						};

						// 옵션항목[기획전형 상품과 일반상품을 같이 사용하기 위해서 재처리 한다.+화면에서 사용하는 속성값 추가]
						if ($scope.BasicData.goods_cmps_cd == '30') {
							if ($scope.BasicData.product.select_goods_list != null && $scope.BasicData.product.select_goods_list.total_count > 0) {
								$scope.BasicData.product.select_goods_list.selectedItem = "";
								$scope.BasicData.product.select_goods_list.displayName = "상품선택";//20160211
							}
						} else {
							/*
								1.마지막 옵션 선택시 주문항목으로 추가한다.
								2.스마트픽 상품은 마지막 옵션선택후 지점선택시 주문항목으로 추가한다.
								-일반상품인데 단품옵션이 없다면 주문항목을 선택할수 없기 때문에 자동으로 한개를 넣어 준다.
							*/
							if ($scope.BasicData.product.item_dtl == null) {
								// if (!$scope.deliSelect){ // 스마트픽상품은 지점 선택시 자동으로 넣어 준다.
								// if ($scope.BasicData.product.smp_only_yn == "Y" || $scope.showDelivery) {
								var img_url = '';
								var ord_cnt = Fnproductview.toNumber($scope.BasicData.min_lmt_qty);
								var smartOrd = 'N';  //스마트픽 주문예약
								var smp_entr_no = ''; //스마트픽 예약화면으로 넘겨줄 지점정보
								var smp_shop_no = ''; //스마트픽 예약화면으로 넘겨줄 지점정보
								var rsv_sale_yn = !$scope.BasicData.product.reserve_start ? "N":"Y";

								$scope.addOrderList(getOrderListItem(null, $scope.BasicData.goods_no, null, $scope.BasicData.product.item_no, $scope.smpDispYn
									,ord_cnt,$scope.priceInfo.lowPrice, $scope.BasicData.product.inv_qty, $scope.BasicData.product.mast_disp_no, $scope.BasicData.product.goods_cmps_cd
									,smartOrd, img_url, $scope.BasicData.min_lmt_qty, $scope.BasicData.max_lmt_qty, smp_entr_no
									,smp_shop_no, false,$scope.BasicData.product.crspk_psb_yn,$scope.BasicData.product.smp_only_yn,$scope.BasicData.product.dept_main_inv_qty_sum,$scope.BasicData.product.dlv_goods_sct_cd,rsv_sale_yn));
								//}
							} else {
								// 일반 상품의 옵션 레이어에 출력할 List
								$scope.prodItemList = setDefaultDisplayAttr($scope.BasicData.goods_no, $scope.BasicData.product.item_dtl.items, $scope.BasicData.product.goods_nm, "N", $scope.BasicData.product.mast_disp_no, $scope.BasicData.product.goods_cmps_cd,$scope.BasicData.product.crspk_psb_yn,$scope.BasicData.product.dept_main_inv_qty_sum,$scope.BasicData.product.dlv_goods_sct_cd,rsv_sale_yn);
							}
						}

						// 존재하는 서브옵션인지 확인
						/*
						$scope.isSubOption = function(vt, itemNo) {
							var rt = true;
							var topNo = $scope.prodItemList[0].selectedItem;

							if (vt != "OPT_1_TVAL") { //서브옵션인경우
								var imsiObj, key;

								if (vt == "OPT_2_TVAL" && topNo != '') {
									rt = false;
									// var topNo = $scope.prodItemList[0].selectedItem;
									// console.log(topNo +" : "+ itemNo +" : "+ vt);
									for(var i = 0; i < $scope.BasicData.product.item_dtl_stk_list.total_count; i++) {
										imsiObj = $scope.BasicData.product.item_dtl_stk_list.items[i];
										key = imsiObj.opt_val_cd.split(" x ");

										if (key[0] == topNo && key[1] == itemNo) {
											rt = true;

											break;
										}
									}

								}
							}

							return rt;
						}
						*/

                        //20160408 두번째 이상의 옵션의 품절여부를 체크하기 위한 로직
                        $scope.selectedOptValue = [];
                        if($scope.BasicData.product.item_dtl != null){
                            $scope.selectedOptValue = new Array($scope.BasicData.product.item_dtl.total_count);    
                        }
                        
                        
						// eung 첫번째 옵션항목에서 서브옵션의 전체 재고갯수를 구함.
						if ($scope.BasicData.product.item_dtl != null && $scope.BasicData.product.item_dtl.total_count > 1) {
                            $scope.optArr = new Array($scope.BasicData.product.item_dtl.items[0].item.total_count);
							var imsiObj, key, kindex, optName;
							for (var a = 0; a < $scope.optArr.length; a++) {
								optName = $scope.BasicData.product.item_dtl.items[0].item.items[a].opt_value;
								$scope.optArr[a] = 0;
								for (var i = 0; i < $scope.BasicData.product.item_dtl_stk_list.total_count; i++) {
									imsiObj = $scope.BasicData.product.item_dtl_stk_list.items[i];
									key = imsiObj.opt_tval.split(" x ");
									if (optName == key[0]) {
										$scope.optArr[a] += parseInt(imsiObj.inv_qty);
									}
								}
							}

    					} else {
							$scope.optArr = null;
						}
					});
				},0);


				// L-money 10원 다운로드가 있을 경우
				$scope.rentalOnlyYn = false;
				$scope.rentalOnlyYnNew = false; //렌탈 개선
				if (($scope.BasicData.product.ec_goods_artc_cd == '30' || $scope.BasicData.product.ec_goods_artc_cd == '31') && $scope.BasicData.elotte_yn != 'Y') {
					//$scope.rentalOnlyYn = true;
					$scope.rentalOnlyYnNew = true; //렌탈상품 오픈할때 처리 20151217
				}
				// 버튼제어용 변수
				$scope.btnCartShow = false; // 장바구니 버튼show여부
				$scope.btnWishShow = true; // 위시리스트 버튼show여부
				$scope.btnAlarmShow = true; // 재입고 알람 버튼show여부
				$scope.btnOrderShow = true; // 바로주문 버튼show여부

				var DELIVERY_PARCEL = "1"; // 배송방법 택배
				var DELIVERY_SMARTPIC = "2"; // 배송방법 스마트픽
				var ENTRNO_IMALL = "13145"; // imall 코드

				$scope.isShowCartComp = false; // 장바구니 처리 완료시 인스턴스 메시지박스 show
				$scope.isShowWishComp = false; // 위시리스트 처리 완료시 인스턴스 메시지박스 show
				$scope.totalOrderCnt = 0; // 바로구매 버튼에 출력되는 전체 주문상품 수량
				$scope.totalOrderAmt = 0; // 바로구매 버튼에 출력되는 전체 주문상품 금액
				$scope.hasWishList = false; // 위시리스트 상품 여부

				// 주문레이어의 멀티주문항목
				$scope.orderList = [];
				//주문서페이지로 보내기 위한 데이터 정보
				$scope.orderSendInfo = {};

				var setSmpDefault = function () {
					$scope.deliSelected = DELIVERY_PARCEL; //수령방법은 default 택배
					el.find(".btnDelivery").addClass("on");
					el.find(".btnSmartpick").removeClass("on");
				};

				// 전체List타입의 display:none 속성을 부여하기 위한 함수
				var setDefaultDisplayAttr = function(goods_no,objList,goods_nm,smpDispYn,master_disp_no,goods_cmps_cd,crspk_psb_yn,dept_main_inv_qty,dlv_goods_sct_cd,rsv_sale_yn) {
					if (objList != null) {
						for (var i=0; i < objList.length; i++) {
							objList[i].displayOn = "on";
							objList[i].displayName = "(" + objList[i].name + ") 선택";
							objList[i].selectedItem = "";
							objList[i].master_disp_no = master_disp_no;
							objList[i].goods_cmps_cd = goods_cmps_cd;
							objList[i].goods_no = goods_no;
							objList[i].dept_main_inv_qty = dept_main_inv_qty;
							objList[i].dlv_goods_sct_cd = dlv_goods_sct_cd;
							objList[i].rsv_sale_yn = rsv_sale_yn;

							if (goods_nm != null) {
								objList[i].goods_nm = goods_nm;
							}

							if (smpDispYn != null) {
								objList[i].smpDispYn = smpDispYn;
							}

							/*
								- 기획전형 상품을 위한 옵션 키코드 셋팅
								- 기획전형 상품의 옵션이 구분되지 않고 단품정보가 그대로 오면서 value_type이 null인상태로 넘어온다.
								- 주문항목셋팅시 value_type을 key값으로  옵션정보조합의 단품키를 찾는데 값이 null이면 찾을수가 없기때문에 고정된값을 셋팅해준다.]
							*/
							if (objList[i].value_type == null) {
								objList[i].value_type = "SELECTGOODS";
							}
							if(crspk_psb_yn != null){
								objList[i].crspk_psb_yn = crspk_psb_yn;
							}							
						}

						if (objList.length == 1) {
							for (var i = 0; i < objList[0].item.total_count; i++) {
								var item = objList[0].item.items[i];

								// 단품의 재고를 조회한다.
								item.opt_cnt = item.opt_cnt;

								// 마지막옵션에서 재입고 알림버튼의 매개변수(goods_no,item_no)중 item_no[단품번호]를 넘겨주기 위해서
								// 마지막옵션인경우 stk_item_no속성을 부여하여 footer_optionbar.html에서 사용한다.[option => item_no와 틀리다]
								// 옵션이 한개인경우만 셋팅한다[옵션이 한개면 마지막 바로전옵션 change이벤트가  없기때문에 여기에서 셋팅하고 2개이상은 마지막 바로전 옵션선택시 셋팅한다.]
								item.stc_item_no = item.item_no;
							}
						}
					}

					return objList;
				};

				// display:none 속성을 부여하기 위한 함수
				$scope.selectOptionDepth = 0;

				$scope.chgDisplayAttr = function (value_type) {
					for (var i = 0; i < $scope.prodItemList.length; i++) {
						if (value_type == $scope.prodItemList[i].value_type){
							$scope.selectOptionDepth = i;
							$scope.prodItemList[i].displayOn = "on";
						} else {
							$scope.prodItemList[i].displayOn = "";
						}
					}
				};

				// 공통적인 multi 주문을 위한 Object[기획전형과 같이 사용하기 위해서 별도의 Object를 사용한다]
				var getOrderListItem = function (goods_nm, goods_no, item_nm, item_no, smp_yn
					,ord_cnt, sale_price, inv_qty, master_disp_no, goods_cmps_cd
					,smartOrd, img_url, min_lmt_qty, max_lmt_qty, smp_entr_no
					,smp_shop_no, isAbleDelete,crspk_psb_yn,smp_only_yn,dept_main_inv_qty,dlv_goods_sct_cd,rsv_sale_yn) {
					var eCheckData = function (value) {
						if (value == undefined || value == null) {
							value = "";
						}

						return value;
					};

					var pItem = $scope.getSelectedGoodsItem(goods_no);

					var rtnItem = {};

					rtnItem.goods_nm = goods_nm;
					rtnItem.goods_no = goods_no;
					rtnItem.item_nm = item_nm;
					rtnItem.item_no = item_no;
					rtnItem.smp_yn = smp_yn;
					rtnItem.ord_cnt = ord_cnt;
					rtnItem.inv_qty = (inv_qty == null) ? 9999 : inv_qty;
					rtnItem.isAbleDelete = isAbleDelete;  // 단품이 없는 일반상품은 화면 로드시 자동으로 추가 되어 삭제하면 안되기때문에 삭제불가 여부를 셋팅한다.
					rtnItem.master_disp_no = master_disp_no;
					rtnItem.goods_cmps_cd = goods_cmps_cd;
					rtnItem.smartOrd = smartOrd; // Y:N
					rtnItem.smp_prod_yn = smartOrd; // smartOrd 와 항상동일하여 파라메터 하나로 처리함.
					// rtnItem.img_url = img_url;
					rtnItem.dept_main_inv_qty = dept_main_inv_qty;//본점 재고 개수
					rtnItem.dlv_goods_sct_cd = dlv_goods_sct_cd;//상품유형
					rtnItem.rsv_sale_yn = rsv_sale_yn;//예약상품

					if (pItem == null) {
						rtnItem.img_url = "";
						rtnItem.org_sale_price = sale_price;
						rtnItem.sale_price = ord_cnt * sale_price;
						rtnItem.inst_cpn_aply_unit_price = 0;
						rtnItem.immed_pay_dscnt_amt = 0;
						rtnItem.min_lmt_qty = Fnproductview.toNumber(min_lmt_qty); // 최소구매수량
						rtnItem.max_lmt_qty = Number(rtnItem.inv_qty) > Number(max_lmt_qty) ? Fnproductview.toNumber(max_lmt_qty) :Fnproductview.toNumber(rtnItem.inv_qty) ; //최대구매수량
                        rtnItem.crspk_psb_yn = crspk_psb_yn;
                        rtnItem.smp_only_yn = smp_only_yn;
                        //rtnItem.gift_pkg_yn = "";
					} else {
						rtnItem.goods_nm = pItem.goods_nm;
						rtnItem.img_url = pItem.img_url;
						rtnItem.org_sale_price = pItem.sale_prc;
						rtnItem.inst_cpn_aply_unit_price = pItem.inst_cpn_aply_unit_price;
						rtnItem.immed_pay_dscnt_amt = pItem.immed_pay_dscnt_amt;
						rtnItem.sale_price = ord_cnt * (pItem.sale_prc - pItem.inst_cpn_aply_unit_price - pItem.immed_pay_dscnt_amt);
						rtnItem.min_lmt_qty = Fnproductview.toNumber(pItem.min_lmt_qty); // 최소구매수량
						rtnItem.max_lmt_qty = Number(rtnItem.inv_qty) > Number(pItem.max_lmt_qty) ? Fnproductview.toNumber(pItem.max_lmt_qty) :Fnproductview.toNumber(rtnItem.inv_qty) ; //최대구매수량
                        rtnItem.crspk_psb_yn = pItem.crspk_psb_yn;
                        rtnItem.smp_only_yn = pItem.smp_only_yn;
                        //rtnItem.gift_pkg_yn = pItem.gift_pkg_yn;
					}

					//rtnItem.min_lmt_qty = Fnproductview.toNumber(min_lmt_qty); //최소구매수량
					//rtnItem.max_lmt_qty = Number(rtnItem.inv_qty) > Number(max_lmt_qty) ? Fnproductview.toNumber(max_lmt_qty) :Fnproductview.toNumber(rtnItem.inv_qty) ; //최대구매수량
					rtnItem.smp_shop_no = smp_shop_no;
					rtnItem.smp_entr_no = smp_entr_no;

					if (pItem != null) {
							rtnItem.item_opt_list = eCheckData(pItem.item_opt_list);
							rtnItem.buy_term = eCheckData(pItem.buy_term);
							rtnItem.is_ecoupon = eCheckData(pItem.is_ecoupon);
							rtnItem.delivery_type = eCheckData(pItem.delivery_type);
					}
					//단품, 입력형 옵션정보 20160121 분석함. - 20160129
					//if ($scope.BasicData.product.item_dtl == null && $scope.BasicData.product.item_opt_list != null) {
                    if ($scope.BasicData.product.item_opt_list != null) {    
                            var optObj = {};
                            optObj.total_count = $scope.BasicData.product.item_opt_list.total_count;
                            optObj.items = [];
                            for(var i=0; i<optObj.total_count; i++){
                                optObj.items.push({
                                    item_opt_name : $scope.BasicData.product.item_opt_list.items[i].item_opt_name
                                    ,item_opt_type : $scope.BasicData.product.item_opt_list.items[i].item_opt_type
                                    ,item_opt_value:""
                                });
                            }
							rtnItem.item_opt_list = optObj;
					}

					return rtnItem;
				};

				// 단품정보 조회[재고수량,단품명]
				$scope.getOptObj = function (item_key) {
					var rtnObj = {};

					rtnObj.inv_qty = "0";
					rtnObj.opt_tval = "";
					rtnObj.item_no = "";
					rtnObj.goods_no = "";
					rtnObj.dlv_goods_sct_cd = $scope.BasicData.product.dlv_goods_sct_cd;
					rtnObj.rsv_sale_yn = !$scope.BasicData.product.reserve_start ? "N":"Y";
					if($scope.goodsOptData != undefined){
						rtnObj.dlv_goods_sct_cd = $scope.goodsOptData.dlv_goods_sct_cd;
						rtnObj.rsv_sale_yn = $scope.goodsOptData.rsv_sale_yn;
					}

					if ($scope.BasicData.product.goods_cmps_cd=='30') { // 기획전형 상품은 상품선택시 단품정보 를 가지고 온다.
						if ($scope.goodsOptData.item_dtl.total_count > 0) {
							for (var i = 0; i < $scope.goodsOptData.item_dtl.items[0].item.total_count; i++) {
								var item = $scope.goodsOptData.item_dtl.items[0].item.items[i];

								if (item.item_no == item_key) {
									rtnObj.inv_qty = item.opt_cnt;
									rtnObj.opt_tval = item.opt_value;
									rtnObj.item_no = item.item_no;
									rtnObj.goods_no = $scope.goodsOptData.goods_no; /*java모델이 아니고 json call완료시 스크립트에서 추가된 모델*/
									rtnObj.dept_main_inv_qty = item.dept_main_inv_qty;//본점 재고
									break;
								}
							}
						} else {
							rtnObj.item_no = "0";
							rtnObj.goods_no = $scope.goodsOptData.goods_no;
						}
					} else {
						// 옵션의종류가 한가지 라면  옵션의 item_no와 단품의 item_no가 같다.
						if ($scope.BasicData.product.item_dtl != null && $scope.BasicData.product.item_dtl.total_count == 1) {
							for (var i = 0; i < $scope.BasicData.product.item_dtl_stk_list.total_count; i++) {
								var item = $scope.BasicData.product.item_dtl_stk_list.items[i];

								if (item.item_no == item_key) {
									rtnObj.inv_qty = item.inv_qty;
									rtnObj.opt_tval = item.opt_tval;
									rtnObj.item_no = item.item_no;
									rtnObj.goods_no = item.goods_no;
									rtnObj.dept_main_inv_qty = item.dept_main_inv_qty;
									break;
								}
							}
						} else {
							for (var i = 0; i < $scope.BasicData.product.item_dtl_stk_list.total_count; i++) {
								var item = $scope.BasicData.product.item_dtl_stk_list.items[i];

								if (item.opt_val_cd == item_key) {
									rtnObj.inv_qty = item.inv_qty;
									rtnObj.opt_tval = item.opt_tval;
									rtnObj.item_no = item.item_no;
									rtnObj.goods_no = item.goods_no;
									rtnObj.dept_main_inv_qty = item.dept_main_inv_qty;
									break;
								}
							}
						}
					}

					return rtnObj;
				};

				// eung 삭제예정 : 스마트픽상품인경우 택배+스마트픽 선택 레이어를 보여 줘야 한다.
				$scope.deliSelect = false;

				$scope.deliSelect_li_click = function (v) {
					if (!$scope.isAllSelect()) {
						alert("상품정보를 먼저 선택해 주세요.");
						return;
					}

					// 기 스마트픽 주문항목정보가 있으면 복합주문불가로 메시지 처리 하여 막는다.
					var isMixDeli = false;
					var mixDeliMsg = '';

					if (v == DELIVERY_PARCEL) {
						var smpOrderInfo = Fnproductview.getObjListKey($scope.orderList,"smartOrd","Y");

						if (smpOrderInfo != null) {
							isMixDeli = true;mixDeliMsg = '두개 이상의 상품 주문시, 처음 선택한 상품과 동일한 배송방법(택배)으로만 주문 가능합니다.';
						}
					} else {
						var smpOrderInfo = Fnproductview.getObjListKey($scope.orderList,"smartOrd","N");
						if (smpOrderInfo != null) {
							isMixDeli = true;mixDeliMsg = '두개 이상의 상품 주문시, 처음 선택한 상품과 동일한 배송방법(스마트픽)으로만 주문 가능합니다.';
						}
					}

					if (isMixDeli) {
						alert(mixDeliMsg);
						return;
					}

					$scope.deliSelected = v;

					if (v == DELIVERY_PARCEL) {
						el.find(".btnDelivery").addClass("on");
						el.find(".btnSmartpick").removeClass("on");

						if ($scope.BasicData.product.item_dtl == null) {
							// 단품정보가 없을시 주문항목을 자동으로 추가 해줘야 하는데 스마트픽선택 상품은 지점찾기에서 자동으로 넣어준다.
							// 따라서 택배받기로 선택시에도 기존에 추가된 항목이 없다면 추가해줘야 한다.
							if ($scope.orderList.length == 0) {
									var img_url = '';
									var ord_cnt = Fnproductview.toNumber($scope.BasicData.min_lmt_qty);
									var smp_entr_no = ''; //스마트픽 예약화면으로 넘겨줄 지점정보
									var smp_shop_no = ''; //스마트픽 예약화면으로 넘겨줄 지점정보
									var smartOrd = 'N';

									$scope.addOrderList(getOrderListItem(null, $scope.BasicData.goods_no, null, $scope.BasicData.product.item_no, $scope.smpDispYn
										,ord_cnt, $scope.priceInfo.lowPrice, $scope.BasicData.product.inv_qty, $scope.BasicData.product.mast_disp_no, $scope.BasicData.product.goods_cmps_cd
										,smartOrd, img_url, $scope.BasicData.min_lmt_qty, $scope.BasicData.max_lmt_qty, smp_entr_no
										,smp_shop_no, false,$scope.BasicData.product.smp_only_yn));
							}
						} else {
							if ($scope.isAllSelect()) { // 전체 선택이 되었다면 주문항목을 추가한다.
								addOrderItemProc(false, null);
							}
						}

						$scope.deliSelect = false; // 택배받기선택시 배송방법을 선택할 필요가 없기때문에 제거한다.[SB 요건]
					} else { // 스마트픽 선택이면 지점정보를 조회 한다.
						var param = {};

						if ($scope.BasicData.goods_cmps_cd == '30') {
							param.goods_no = $scope.BasicData.product.select_goods_list.selectedItem;
						} else {
							param.goods_no = $scope.BasicData.goods_no;
						}

						if ($scope.prodItemList != null) {
							var selectItem = addOrderItemProc(true, null);

							if (selectItem != null) {
								param.item_no = selectItem.item_no;
							} else { // 단품정보가 없으면
								param.item_no = $scope.BasicData.product.item_no;
							}
						} else {
							param.item_no = $scope.BasicData.product.item_no;
						}

						param.smp_prod_yn = "Y";

						$http.get(LotteCommon.smartpickSmartpickBookingData, {params:param})
						.success(function (data) {
							// console.log('SmartpickBookingData complete!!');
							var goodsInfo = Fnproductview.getObjListKey(data.smartpick_booking.goods_list.items,"goods_no",param.goods_no);

							if (goodsInfo != null) {
								if (goodsInfo.smp_brch_list != null && goodsInfo.smp_brch_list.total_count > 0) {
									$scope.smartpickBookingBrch = goodsInfo.smp_brch_list; // 지점 목록정보
								} else {
									if ($scope.BasicData.product.smp_only_yn== 'Y') {
										alert("스마트픽 가능지점이 없습니다"); // 스마트픽전용 상품인데 지점 목록이 없으면 주문불가. 별도의 메시지처리가 필요할듯보임..
									} else {
										alert("스마트픽 가능지점이 없습니다.");
										$scope.deliSelect = false; // 스마트픽 상품이지만 지점이 존재 하지 않으면 스마트픽 찾기 불가
										$scope.deliSelected = DELIVERY_PARCEL;
										// 지점을 선택해야 주문항목을 추가하는데 지점선택을 할수 없기때문에 강제로 추가해준다.
										addOrderItemProc(false,null);
									}
								}
							} else {
								if ($scope.BasicData.product.smp_only_yn == 'Y') {
									alert("스마트픽 가능지점이 없습니다"); // 스마트픽전용 상품인데 지점 목록이 없으면 주문불가. 별도의 메시지처리가 필요할듯보임..
								} else {
									alert("스마트픽 가능지점이 없습니다.");
									$scope.deliSelect = false; // 스마트픽 상품이지만 지점이 존재 하지 않으면 스마트픽 찾기 불가
									$scope.deliSelected = DELIVERY_PARCEL;
									// 지점을 선택해야 주문항목을 추가하는데 지점선택을 할수 없기때문에 강제로 추가해준다.
									addOrderItemProc(false,null);
								}
							}
						})
						.error(function () {
							console.log('Data Error : 스마트픽 지점정보 로드 실패');
						});

						el.find(".btnDelivery").removeClass("on");
						el.find(".btnSmartpick").addClass("on");
					}
				};

				$scope.myshopFlag = function (flag, itemFlag) {
						var str = "";

						if (flag == itemFlag) {
							str = "단골지점 : ";
						}

						return str;
				};

				$scope.inputNumber = false;
				$scope.deliSelect2 = false;

				// eung 스마트픽 지점 선택 다시 작성
				// 닫기
				$scope.close_smpLayer = function () {
					//인풋박스 활성화
					$scope.inputNumber = false;
					$scope.deliSelect2 = false;
					$("body").removeClass("fixBody");
				};

				// 확인
				$scope.ok_smpLayer = function () {
					//선택한 지점을 반영
					//인풋박스 활성화
					$scope.inputNumber = false;
					//addOrderItemProc(false,null);

					var tmp = "", closeFlag = true;
                    var crosspickSelect = false; //
                    var crosspickFlag = false;
					for (var i = 0; i < $scope.smpData.goods_list.total_count; i++) {
						if ($("#smartpickSpot0" + i + ":checked").attr("data-goods_no") != undefined) {
							tmp = $("#brch_area_" + i).val();
                            
                            //크로스픽 여부
                            //$scope.orderList[i].crspk_psb_yn =  $scope.smpData.goods_list.items[i].crspk_psb_yn;
                            if($scope.smpData.goods_list.items[i].crspk_psb_yn == 'Y'){
                                crosspickFlag = true;
                            }else{
                                crosspickFlag = false;
                            }
                            if($("#mart_a" + i + ":checked").length == 1){
                                crosspickSelect = false;  //백화점 선택
                            }else{
                                crosspickSelect = true;   //편의점 선택
                            }    
                                
							if (tmp == "") {
								if ($scope.orderList[i].disable != undefined && $scope.orderList[i].disable == true){
									// 비활성인 상품은 패스
								} else {
                                    //크로스픽을 선택한 경우                                    
                                    if(crosspickFlag && crosspickSelect){
                                        //편의점을 선택하지 않았으면 
                                        if($scope.smpData.goods_list.items[i].mart_name == undefined){
                                            alert("지점을 선택해 주세요.");
                                            closeFlag = false;
                                            $(".selList > li").eq(i).removeClass("disable");
                                            break;                                              
                                        }else{// 편의점을 선택했으면
                                            $scope.orderList[i].crspk_yn  = "Y" ;
                                            $scope.orderList[i].smartOrd = "Y";
                                            $scope.orderList[i].smp_prod_yn = "Y";
                                            $scope.orderList[i].mart_name  = $scope.smpData.goods_list.items[i].mart_name ;
                                            $scope.orderList[i].crspk_corp_cd  = $scope.smpData.goods_list.items[i].crspk_corp_cd ;
                                            $scope.orderList[i].crspk_corp_str_sct_cd  = $scope.smpData.goods_list.items[i].crspk_corp_str_sct_cd ;
                                            $scope.orderList[i].crspk_str_no = $scope.smpData.goods_list.items[i].crspk_str_no;
                                            $scope.orderList[i].disable = false;
                                            $(".selList > li").eq(i).removeClass("disable");
                                            //break;
                                        }
                                    }else{
									   // 지점을 선택하지 않은 경우
									    alert("지점을 선택해 주세요.");
                                        closeFlag = false;
                                        $(".selList > li").eq(i).removeClass("disable");
                                        break;                                        
                                    }
								}
							} else if (tmp == undefined) {
                                //크로스픽을 선택한 경우                                    
                                if(crosspickFlag && crosspickSelect){        
                                    $scope.orderList[i].crspk_yn  = "Y" ;
                                    $scope.orderList[i].smartOrd = "Y";
                                     $scope.orderList[i].smp_prod_yn = "Y";
                                     $scope.orderList[i].mart_name  = $scope.smpData.goods_list.items[i].mart_name ;
                                    $scope.orderList[i].crspk_corp_cd  = $scope.smpData.goods_list.items[i].crspk_corp_cd ;
                                    $scope.orderList[i].crspk_corp_str_sct_cd  = $scope.smpData.goods_list.items[i].crspk_corp_str_sct_cd ;
                                    $scope.orderList[i].crspk_str_no = $scope.smpData.goods_list.items[i].crspk_str_no;                                
                                }                                
								// 셀렉트박스가 없는 경우, 즉 이쿠폰인 경우
								$(".selList > li").eq(i).removeClass("disable");
							} else {
								// 선택한 경우
								//console.log("shop_no:" + tmp);
                                //크로스픽 체크 
                                //크로스픽을 선택한 경우                                    
                                if(crosspickFlag && crosspickSelect){        
                                    $scope.orderList[i].crspk_yn  = "Y" ;
                                    $scope.orderList[i].smartOrd = "Y";
                                     $scope.orderList[i].smp_prod_yn = "Y";
                                     $scope.orderList[i].mart_name  = $scope.smpData.goods_list.items[i].mart_name ;
                                    $scope.orderList[i].crspk_corp_cd  = $scope.smpData.goods_list.items[i].crspk_corp_cd ;
                                    $scope.orderList[i].crspk_corp_str_sct_cd  = $scope.smpData.goods_list.items[i].crspk_corp_str_sct_cd ;
                                    $scope.orderList[i].crspk_str_no = $scope.smpData.goods_list.items[i].crspk_str_no;                                
                                }else{
                                    $scope.orderList[i].crspk_yn  = "N" ;
                                    $scope.orderList[i].smp_shop_no = tmp;
                                    $scope.orderList[i].smartOrd = "Y";
                                    $scope.orderList[i].smp_prod_yn = "Y";
                                }
                                $scope.orderList[i].disable = false;
								$(".selList > li").eq(i).removeClass("disable");
							}
						} else { // 선택을 하지 않았을 경우
							// 옵션x, 상품 선택 x 인데 체크를 안하면 계속 띄우게 만듬
							if ($scope.BasicData.product.select_goods_list.total_count == 0 && $scope.BasicData.product.item_dtl_stk_list.total_count == 0) {
								$scope.orderList[i].smp_shop_no = "";
							} else {
								$(".selList > li").eq(i).addClass("disable");
								$scope.orderList[i].disable = true;
								$scope.orderList[i].smp_shop_no = "";
							}
						}
					}

					// 레이어 닫기
					if (closeFlag) {
						$scope.deliSelect2 = false;
						$("body").removeClass("fixBody");
					}
				};

				// eung 비활성 버튼
				$scope.deliSelect_layer_cov = function (id) {
					if(id=='#method11' && !$scope.isQuick){
						artQuick();
						return false;
					}
					if ($(id + ":disabled").length == 1) {
						alert("2개 이상 상품 주문하실 경우 택배 상품끼리 또는 롯데 스마트픽 상품끼리 주문 가능합니다.");
					}
				};

				// eung
				$scope.deliSelect_layer = function (v) {
					// 스마트픽으로 찾기
					if(v == "2" && !$scope.onlyEcoupon){ //20151204
						$("body").addClass("fixBody");
						// 인풋박스 비활성화
						$scope.inputNumber = true;

						$scope.sendTclick( 'm_DC_ProdDetail_Clk_Btn_7' );
						$scope.qs_yn = 'N';

						setTimeout(function () {
							$("#smpShopList").scrollTop(0);
						}, 300);

						var param = {};
						param.goods_no = "";
						param.item_no = "";
						param.smp_prod_yn = "";
						param.crspk_psb_yn = "";
                        param.smp_only_yn = "";
						var gubunStr = ":^:";

						if ($scope.orderList != undefined && $scope.orderList.length > 0) {
							// orderList 내에 선택한 상품이 모두 딤처리 된 경우
							var smpCheckFlag = true;

							for (var i = 0; i < $scope.orderList.length; i++) {
								if ($scope.orderList[i].disable == undefined || !$scope.orderList[i].disable) {
									smpCheckFlag = false;
								}
							}

							if (smpCheckFlag) {
								alert("상품을 선택해 주세요");
								return;
							}

							for (var i = 0; i < $scope.orderList.length; i++) {
								if (i == $scope.orderList.length - 1) {
									gubunStr = "";
								}

								param.goods_no += $scope.orderList[i].goods_no + gubunStr;
								param.item_no += $scope.orderList[i].item_no + gubunStr;

								if ($scope.orderList[i].delivery_type == "1") {
									param.smp_prod_yn += "N" + gubunStr;
								} else {
									param.smp_prod_yn += "Y" + gubunStr;
								}
								param.crspk_psb_yn += $scope.orderList[i].crspk_psb_yn + gubunStr;
                                param.smp_only_yn += $scope.orderList[i].smp_only_yn + gubunStr;
							}

							param.rgl_brch_entr_contr_no += $scope.BasicData.product.rgl_brch_entr_contr_no;

							$http.get(LotteCommon.smartpickSmartpickBookingData, {params:param})
							.success(function (data) {
								$scope.deliSelect2 = true;
								$scope.smpData = data.smartpick_booking;
							})
							.error(function () {
								console.log('Data Error : 스마트픽 지점정보 로드 실패');
							});
						} else {
							alert("상품정보를 먼저 선택해 주세요.");
						}
					}else if(v == "1"){ //택배로 받기 20151204
						$scope.sendTclick( 'm_DC_ProdDetail_Clk_Btn_6' );
						$scope.qs_yn = 'N';

						// 스마트픽으로 받기 정보 삭제
						for (var i = 0; i < $scope.orderList.length; i++) {
							$scope.orderList[i].smp_shop_no = "";
							$scope.orderList[i].smartOrd = "N";
							$scope.orderList[i].smp_prod_yn = "N";
							$scope.orderList[i].disable = false;
						}

						$(".selList > li").removeClass("disable");
					}else if(v=='3'){//퀵배송
						if ($scope.orderList != undefined && $scope.orderList.length > 0) {
							var rt=artQuick();
							if(rt=='deli' || rt=='main') return false;
							$("body").addClass("fixBody");
							$scope.inputNumber=true;//팝업 열때
							$scope.quickPop = true;
							$scope.qs_yn = 'Y';

							// 스마트픽으로 받기 정보 삭제
							for (var i = 0; i < $scope.orderList.length; i++) {
								$scope.orderList[i].smp_shop_no = "";
								$scope.orderList[i].smartOrd = "N";
								$scope.orderList[i].smp_prod_yn = "N";
								$scope.orderList[i].disable = false;
							}
						}else{
							alert("상품정보를 먼저 선택해 주세요.");
						}
					}
				};

				$scope.myshopFlag = function (flag, itemFlag) {
					var str = "";

					if (flag == itemFlag) {
						str = "단골지점 : ";
					}

					return str;
				};

				// 옵션타이틀 선택시 해당옵션목록 출력용
				$scope.selLayer_optClick = function (value_type, val) {
                    //@@선물하기 옵션 한개만 선택가능 value_type == 'OPT_1_TVAL'
                    if($scope.orderTypeGift && $scope.totalOrderCnt > 0){
                        console.log(val, " val");
                        if(val != 'auto'){
                            alert("옵션은 1개만 선택 가능합니다.");                            
                        }
                        return;
                    }                    
					//렌탈상품이 이미 하나 선택되어 있는 경우
					if($scope.rentalOnlyYnNew && $scope.orderList.length > 0){
						alert("렌탈상품은 1개씩 상담신청할 수 있습니다. \n이미 선택한 상품 상담완료 또는 삭제후 시도해주세요.");
					}else{
						el.addClass("option");
						$scope.chgDisplayAttr(value_type);
						$scope.isShowOption = true; // 일반상품 옵션보이기
						$scope.isShowGoods = false; // 선택상품 상품목록보이기
					}
					// $scope.dimAutoHeight();
				};

				// 옵션타이틀 선택시 해당옵션목록 출력용
				$scope.selLayer_prodClick = function (val) {
                    //console.log($scope.optionLayerYn);
                    //@@선물하기 옵션 한개만 선택가능                    
                    if($scope.orderTypeGift && $scope.totalOrderCnt > 0 && $scope.BasicData.product.item_dtl_stk_list.items == null){
                        if(val != 'auto'){
                            alert("단품은 1개만 선택 가능합니다.");
                        }
                        return;
                    }                    
                    
					el.addClass("option");
					$scope.isShowOption = false; // 일반상품 옵션보이기
					$scope.isShowGoods = true; // 선택상품 상품목록보이기
					//$scope.dimAutoHeight();
				};
                //20160211 선택레이어 바로 열기 20160407
                $scope.autoOpenOpt = function(optValue){
                	if($scope.BasicData.product.select_goods_list.total_count > 0){
                        if(optValue == "SELECTGOODS"){
                            $scope.selLayer_optClick(optValue);
                        }else{
                            $scope.selLayer_prodClick("auto");    
                        }                        
                    }else{
                        if($scope.prodItemList != undefined){
                            $scope.selLayer_optClick($scope.prodItemList[optValue].value_type, "auto");    
                        }else{
                            //20160223-1 단품이고, 옵션이 없거나, 입력형 옵션만 있는 경우 
							checkQuick();
                            $scope.boldOptionBorder();
                        }                          
                    }

                }
				$scope.optionLayerYn = false;

                //20160211
                var nextOptFlag = true;
				// 옵션레이어 닫기
				$scope.closeOptionLayer = function () {
					nextOptFlag = false;
					$scope.btnOptionClose_click();
					setTimeout($scope.btnOrder_click(), 300);
				};
                
                //@@선물하기 바로주문
                $scope.orderTypeGift = false; //@@선물하기 버튼을 선택한 주문인 경우
                //$scope.orderListType = true; //바로주문 true, 선물하기 false
                $scope.btnOrderGift_click = function(){
                    //if(!$scope.orderTypeGift && !($scope.BasicData.product.select_goods_list.items == null && $scope.BasicData.opt_list == null)){ //다른 주문 버튼을 누르면 초기화
                    if(!$scope.orderTypeGift){ //다른 주문 버튼을 누르면 초기화                                                
                        $scope.deliSelect_layer('1');
                        if(!($scope.BasicData.product.select_goods_list.items == null && $scope.BasicData.opt_list == null && $scope.BasicData.product.item_dtl == null)){
                            $scope.orderList = [];
                            $scope.totalOrderCnt = 0;                                                    
                        }
                    }                
                    $scope.orderTypeGift = true;
                    $scope.btnOrder_click();    
                    //console.log($scope.orderList);
                };
                $scope.btnOrderNormal_click = function(){ 
                    //if($scope.orderTypeGift && !($scope.BasicData.product.select_goods_list.items == null && $scope.BasicData.opt_list == null)){ //다른 주문버튼을 누르면 초기화
                    if($scope.orderTypeGift  && !($scope.BasicData.product.select_goods_list.items == null && $scope.BasicData.opt_list == null && $scope.BasicData.product.item_dtl == null)){ //다른 주문버튼을 누르면 초기화
                        $scope.orderList = [];
                        $scope.totalOrderCnt = 0;
                    }                
                    $scope.orderTypeGift = false;
                    $scope.btnOrder_click();                    
                }
				// 바로주문f
				$scope.btnOrder_click = function () {
					if($scope.orderFlag){
						if($scope.orderTypeGift){
							$scope.sendTclick( 'm_DC_ProdDetail_Gift_Main_btn' );
						}else{
							$scope.sendTclick( 'm_DC_ProdDetail_Clk_Btn_2' );
						}
                        
						//기획전상세팝업일때에 상품을 자동으로 추가하는 기능
						if ($(".layerPop.detailInfoPop").length > 0 && nextOptFlag) {
                            if($scope.orderTypeGift && $scope.totalOrderCnt > 0){
                                //선물하기이고 이미 상품이 담겼으면 처리안함
                            }else{
                                //console.log("error 1 ----");
                                // 일단 옵션 초기화
                                $scope.prodItemList = [];
                                $scope.BasicData.product.select_goods_list.selectedItem = "";
                                $scope.BasicData.product.select_goods_list.displayName = "상품선택";//20160211

                                var index = $(".layerPop.detailInfoPop").attr("productIndex");
                                var obj = $scope.BasicData.product.select_goods_list.items[index];                            
                                if ($scope.BasicData.product.item_dtl_stk_list.total_count > 0) {
                                    // 기본적으로 가지고 있는 옵션이 있는 경우
                                    $scope.ncGoodsSelected(obj.goods_no);
                                } else {
                                    // 네트워크로 옵션이 있는 경우를 조회
                                    $http.get(LotteCommon.productSelectGoodsOptInfoData, {params:{goods_no:obj.goods_no}})
                                    .success(function(data) {
                                         //if (data.select_goods_opt_info.item_dtl.items != null) {
                                            $scope.ncGoodsSelected(obj.goods_no);
                                         //}
                                    });                                    
                                }
                                //console.log("error 2 ----");
                            }
						}

						if ($scope.optionLayerYn) {

							// 20160616 앱전용/제휴채널팝업 데이터화로 인한 추가 - 박형윤 --
							if ($scope.chkAppOnlyObj.flag) { // 앱전용 상품일 경우
								// 앱 접속 여부 판단
								if (!$scope.appObj.isApp) { // 웹인 경우
									if (confirm($scope.chkAppOnlyObj.alertMsg)) {
										var deepLinkUrl = $scope.chkAppOnlyObj.deepLinkFlag ? null : "http://m.lotte.com";
										var referrer = $scope.chkAppOnlyObj.referrer ? $scope.chkAppOnlyObj.referrer : null;
										var tclick = $scope.chkAppOnlyObj.tclick ? $scope.chkAppOnlyObj.tclick : null;

										LotteLink.appDeepLink("lotte", deepLinkUrl, tclick, referrer); // 앱 딥링크 params : lotte/ellotte, 딥링크URL (없을 경우 default 현재 URL, tclick, referrer)
									}
								} else { // 앱인 경우
									// 앱전용 상품은 통합회원만 구매 가능 (간편계정 구입 불가)
									if ((LotteCookie.getCookie("MBRSCTCD") + "").trim() == "5") { // 로그인상태이지만, 간편회원계정인경우
										alert("간편계정 회원의 경우 구매불가합니다.\nLPOINT 통합회원 가입 후 구매해주세요.");
									} else {
										$scope.buy();
									}
								}
							} else { // 앱전용 상품이 아닐 경우
								$scope.buy();
							}
							//-- 20160616 앱전용/제휴채널팝업 데이터화로 인한 추가 - 박형윤
															
							return;
						}

						el.addClass("on");
						$scope.optionLayerYn = true;
						// $scope.dimAutoHeight();
						$scope.btnCartShow = true;
						$scope.btnWishShow = false;
                        if(nextOptFlag){
                            $scope.autoOpenOpt(0); //20160211
                        }else{ //옵션을 클로징할 때에는 다음 옵션을 열지 않음
                            nextOptFlag = true;
                            //20160223  상품 선택 후 첫번째 옵션에 하이라이트 
                            var nextIndex = 0;
                            if($scope.prodItemList != undefined){
                                for(var k=0; k<$scope.prodItemList.length; k++){
                                    if($scope.prodItemList[k].selectedItem == ""){
                                        nextIndex = k;
                                        console.log(k, $scope.prodItemList[k].selectedItem)
                                        break;
                                    }
                                }                                
                                if($scope.BasicData.product.item_dtl_stk_list.total_count == 0 && $scope.BasicData.product.select_goods_list.total_count > 0){
                                    nextIndex ++;
                                }
                            }

                            if ($(".orderLayerWrap .selLayer").eq(nextIndex).length > 0) { // 20160223 박형윤 셀렉트 취소시 현재 상태 유지
	                            $(".selLayer").removeClass("nextSelect");
	                            $(".orderLayerWrap .selLayer").eq(nextIndex).addClass("nextSelect");                              
                            }
                        }					
					}
				};

				
				// 와인 바로주문
				$scope.btnOrder_wine_click = function () {
					// $scope.sendTclick( 'm_DC_ProdDetail_Clk_Btn_2' );
					$scope.buy();
				};

				// 장바구니
				$scope.btnCart_click = function () {
                    if($scope.orderTypeGift && !($scope.BasicData.product.select_goods_list.items == null && $scope.BasicData.opt_list == null)){ //선물하기를 했던 경우
                        $scope.orderList = [];
                        $scope.totalOrderCnt = 0;
                    }
                    $scope.orderTypeGift = false;
                    if($('#method11').is(':checked') && !artQuick()) return false;
					$scope.sendTclick( 'm_DC_ProdDetail_Clk_Btn_4' );
                    //모아보기가 열려있는 경우 20160211
                    if ($(".layerPop.detailInfoPop").length > 0 && nextOptFlag) {
                        // 일단 옵션 초기화
                        $scope.prodItemList = [];
                        $scope.BasicData.product.select_goods_list.selectedItem = "";
                        $scope.BasicData.product.select_goods_list.displayName = "상품선택";//20160211

                        var index = $(".layerPop.detailInfoPop").attr("productIndex");
                        var obj = $scope.BasicData.product.select_goods_list.items[index];

                        if ($scope.BasicData.product.item_dtl_stk_list.total_count > 0) {
                            // 기본적으로 가지고 있는 옵션이 있는 경우
                            $scope.ncGoodsSelected(obj.goods_no);
                        } else {
                            // 네트워크로 옵션이 있는 경우를 조회
                            $http.get(LotteCommon.productSelectGoodsOptInfoData, {params:{goods_no:obj.goods_no}})
                            .success(function(data) {
                                 //if (data.select_goods_opt_info.item_dtl.items != null) {
                                    $scope.ncGoodsSelected(obj.goods_no);
                                 //}
                            });
                        }
                    }
					
					if ($scope.optionLayerYn) {
						// $scope.openOptionCheck('cart');
						$scope.cartAdd();
						return;
					}

					el.addClass("on");
					$scope.optionLayerYn = true;
					$scope.btnWishShow = false; //20160127
					// $scope.dimAutoHeight();
                    //20160211 옵션 바로 열기 
                    if(nextOptFlag){
                        $scope.autoOpenOpt(0); //20160211
                    }else{ //옵션을 클로징할 때에는 다음 옵션을 열지 않음
                        nextOptFlag = true;
                    }
				};

				// 위시리스트
				$scope.btnWish_click = function () {
					$scope.sendTclick( 'm_DC_ProdDetail_Clk_Btn_3' );
					$scope.wishListAdd();
					// if($scope.optionLayerYn){
					// 	$scope.wishListAdd()
					// }
					// el.addClass("on");
					// $scope.optionLayerYn = true;
				};

				// 재입고알림
				$scope.btnSmart_click = function(goods_no, item_no) {
					$scope.sendTclick( 'm_DC_ProdDetail_Clk_Btn_5' );

					if (item_no == null) {
						$scope.StockRechargeCall(goods_no,$scope.BasicData.product.item_no);
					} else {
						$scope.StockRechargeCall(goods_no,item_no);
					}

					// el.addClass("on");
					// $scope.optionLayerYn = true;
				};

				// 예약상품 datePicker
				$scope.datePickerState = "";
				$scope.datePickerYn = false;

				$scope.datePickerOpen = function (obj) {
					$scope.datePickerYn = true;

					if (obj) {
						$scope.datePickerState = obj.target;
						$scope.datePickerObj = obj;
					}
				};

				$scope.datePickerClose = function () {
					$scope.datePickerYn = false;
				};

				// 바로주문 레이어 닫기
				$scope.btnOptionClose_click = function () {
					el.removeClass("on").removeClass("option");
					$scope.optionLayerYn = false;
					$scope.datePickerYn = false;

					$scope.btnCartShow = false;
					$scope.btnWishShow = true;
				};

				$scope.orderFlag = true; //주문버튼을 막을 수 있음
				// 기획전형상품 선택시 해당 옵션정보를 가져 온다.
				$scope.ncGoodsSelected = function (goods_no) {
					el.removeClass("option");
					$scope.orderFlag = false;
					var goodsItem = $scope.getSelectedGoodsItem(goods_no);
					$scope.BasicData.product.select_goods_list.selectedItem = goods_no;
					$scope.BasicData.product.select_goods_list.displayName = goodsItem.goods_nm;

					$http.get(LotteCommon.productSelectGoodsOptInfoData, {params:{goods_no:goodsItem.goods_no}})
					.success(function(data) {
						// console.log('ncGoodsSelectedData complete!!');
						$scope.goodsOptData = data.select_goods_opt_info; // 상품기본정보 로드
						$scope.goodsOptData.goods_no = goodsItem.goods_no; // 단품찾을때 사용하기 위해서
						$scope.isGoodsOptData = true;

						/*
							1.마지막 옵션 선택시 주문항목으로 추가한다.
							2.스마트픽 상품은 마지막 옵션선택후 지점선택시 주문항목으로 추가한다.
							-기획전 상품인데 단품옵션이 없다면 주문항목을 선택할수 없기 때문에 자동으로 한개를 넣어 준다.
						*/
						if ($scope.goodsOptData.item_dtl.items == null || $scope.goodsOptData.item_dtl.items[0].item.items[0].opt_value == null) {//기획전형 상품 중 스마트픽 가능한 상품 선택 시
							if (!$scope.deliSelect) { // 스마트픽상품은 지점 선택시 자동으로 넣어 준다.
								var img_url = goodsItem.img_url;
								var ord_cnt = Fnproductview.toNumber($scope.goodsOptData.min_lmt_qty);
								var smartOrd = 'N';  // 스마트픽 주문예약
								var smp_entr_no = ''; // 스마트픽 예약화면으로 넘겨줄 지점정보
								var smp_shop_no = ''; // 스마트픽 예약화면으로 넘겨줄 지점정보
								var dept_qty = $scope.goodsOptData.item_dtl.items!=null ? $scope.goodsOptData.item_dtl.items[0].item.items[0].dept_main_inv_qty:false;
                                
								$scope.addOrderList(getOrderListItem($scope.goodsOptData.goods_nm, goods_no, null, $scope.BasicData.product.item_no, $scope.smpDispYn
									,ord_cnt, $scope.goodsOptData.sale_prc, $scope.goodsOptData.inv_qty, $scope.goodsOptData.master_disp_no, $scope.goodsOptData.goods_cmps_cd
									,smartOrd, img_url, $scope.goodsOptData.min_lmt_qty, $scope.goodsOptData.max_lmt_qty, smp_entr_no
									,smp_shop_no, true,$scope.BasicData.product.crspk_psb_yn, $scope.BasicData.product.smp_only_yn, dept_qty,$scope.goodsOptData.dlv_goods_sct_cd, $scope.goodsOptData.rsv_sale_yn));
		                        //20160223  상품 선택 후 첫번째 옵션에 하이라이트 
                                $scope.boldOptionBorder();
								checkQuick();
							}
						} else {
							/*기획전 상품의 옵션 레이어에 출력할 List*/
							$scope.prodItemList = setDefaultDisplayAttr(goodsItem.goods_no,$scope.goodsOptData.item_dtl.items,$scope.goodsOptData.goods_nm,"N",$scope.goodsOptData.master_disp_no,$scope.goodsOptData.goods_cmps_cd, goodsItem.crspk_psb_yn, dept_qty, $scope.goodsOptData.dlv_goods_sct_cd, $scope.goodsOptData.rsv_sale_yn);
							//20160211 옵션창 자동 열기
							$scope.autoOpenOpt('SELECTGOODS');
						}
						//$scope.dimAutoHeight();
						$scope.orderFlag = true;
					})
					.error(function() {
						console.log('Data Error : 기획전형 상품 옵션정보 로드 실패');
						$scope.orderFlag = true;
					});
				};

				// 스마트픽 지점 선택
				$scope.ncChangeBrch = function () {
					if ($scope.brch_shop_no != '') {
						var shopInfo = Fnproductview.getObjListKey($scope.smartpickBookingBrch.items,"shop_no",$scope.brch_shop_no);

						if (shopInfo != null) {
							//주문항목 추가한다. 지점별 재고수량을 사용한다.
							addOrderItemProc(false,shopInfo.inv_qty);
						}
					}
				};

				// 옵션+상품 선택항목을 모두 선택했는지 여부
				$scope.isAllSelect = function () {
					var rtnBool = true;

					if ($scope.prodItemList != undefined && $scope.prodItemList.length > 0) {
						for (var i = 0; i < $scope.prodItemList.length; i++) {
							if ($scope.prodItemList[i].selectedItem == "") {
								rtnBool = false;
								break;
							}
						}
					}

					return rtnBool;
				};

				// 옵션항목 선택시 처리작업
				$scope.selOption_click = function (value_type, item_no, isStock) {
					el.removeClass("option");

					var isLastOpt = false; // 마지막 옵션인지여부
					var isLastPreOpt = false; // 마지막 바로전 옵션인지여부
					var isSetting = false; // 선택된 옵션 다음옵션은 초기화 하기 위한 변수

					for (var i = 0; i < $scope.prodItemList.length; i++) {
						if (isSetting) { // 선택된 항목이 있다면 지금부터는 초기화 한다.option1이 변경되면 option2+ 는 모두 초기화
							$scope.prodItemList[i].displayName = "(" + $scope.prodItemList[i].name + ") 선택";
							$scope.prodItemList[i].selectedItem = "";
						}

						if (value_type == $scope.prodItemList[i].value_type) {
							isSetting = true;
							isLastOpt = (i == $scope.prodItemList.length-1);
							isLastPreOpt = (i == $scope.prodItemList.length-2);

							var opt_name = "";

							for (var ii = 0; ii < $scope.prodItemList[i].item.items.length; ii++) {
								if (item_no == $scope.prodItemList[i].item.items[ii].item_no) {
									opt_name = $scope.prodItemList[i].item.items[ii].opt_value;
									$scope.prodItemList[i].selectedItem = item_no;
								}
							}

							$scope.prodItemList[i].displayName = "(" + $scope.prodItemList[i].name + ") " + opt_name;
						}
					}

					var isLastPreOptChecked = false;

					if (isLastPreOpt) { // 마지막 바로전 옵션이면 재고정보 조회한다.
						var strOptKey = ""; // 재고조회용 키(1 x 2)

						for(var i = 0; i < $scope.prodItemList.length; i++) {
							if (isLastPreOptChecked){ // 마지막 옵션이면.. 재고 조회를 한다.
								var tmp_item_no = "";

								for (var ii = 0; ii < $scope.prodItemList[i].item.items.length; ii++) {
									// strOptKey += $scope.prodItemList[i].item.items[ii].item_no;
									$scope.prodItemList[i].item.items[ii].opt_cnt = $scope.getOptObj(strOptKey + $scope.prodItemList[i].item.items[ii].item_no).inv_qty;
									//퀵배송
									$scope.prodItemList[i].item.items[ii].dept_main_inv_qty = $scope.getOptObj(strOptKey + $scope.prodItemList[i].item.items[ii].item_no).dept_main_inv_qty;
									// 마지막loop
									// 마지막옵션에서 재입고 알림버튼의 매개변수(goods_no,item_no)중 item_no[단품번호]를 넘겨주기 위해서
									// 마지막옵션인경우 stk_item_no속성을 부여하여 footer_optionbar.html에서 사용한다.
									if (i == $scope.prodItemList.length - 1) {
										$scope.prodItemList[i].item.items[ii].stc_item_no = $scope.getOptObj(strOptKey + $scope.prodItemList[i].item.items[ii].item_no).item_no;
									}
								}
							} else {
								strOptKey += $scope.prodItemList[i].selectedItem + " x ";
							}

							if (value_type == $scope.prodItemList[i].value_type) {
								isLastPreOptChecked = true;
							}
						}
					}
                    $scope.subOpt = []; //20160408 초기화
                    
					// console.log("last:" + isLastOpt);
					if (isLastOpt) { // 마지막 옵션이면 주문항목으로 추가한다.
						/*
							1.스마트픽선택이 없는 일반인경우만 주문항목으로 추가한다.
							- 스마트픽은 지점도 선택해야 하기때문에 지점선택시 주문항목으로 추가된다.
						*/
						// if (!$scope.deliSelect || ($scope.deliSelected == DELIVERY_PARCEL)){
						addOrderItemProc(false,null);
                        //20160223-1  상품 선택 후 첫번째 옵션에 하이라이트
                        $scope.boldOptionBorder();
						// }

					}else{
                       //20160408 다음 옵션의 재고 파악 
                        var optDepth = parseInt(value_type.substr(4,1));
                        $scope.selectedOptValue[optDepth - 1] = opt_name;                            
                        if(optDepth == 1){ //2번째 옵션인경우 
                            var obr = $scope.prodItemList[1].item.items;                             
                            $scope.subOpt = new Array(obr.length);
                            var imsiObj, key;
                            
                            for(var i1=0; i1<obr.length;i1++){
                                $scope.subOpt[i1] = 0;
                                $scope.selectedOptValue[1] = obr[i1].opt_value;                            
								for (var i = 0; i < $scope.BasicData.product.item_dtl_stk_list.total_count; i++) {
									imsiObj = $scope.BasicData.product.item_dtl_stk_list.items[i];
									key = imsiObj.opt_tval.split(" x ");
                                    if ($scope.selectedOptValue[0] == key[0] && $scope.selectedOptValue[1] == key[1]) {
                                        $scope.subOpt[i1] += parseInt(imsiObj.inv_qty);
									}
								}                                
                            }
                        }
                        if(optDepth == 2){ //3번째 옵션인경우 
                            var obr = $scope.prodItemList[2].item.items;                             
                            $scope.subOpt = new Array(obr.length);
                            var imsiObj, key;
                            for(var i1=0; i1<obr.length;i1++){
                                $scope.subOpt[i1] = 0;
                                $scope.selectedOptValue[2] = obr[i1].opt_value;  
								for (var i = 0; i < $scope.BasicData.product.item_dtl_stk_list.total_count; i++) {
									imsiObj = $scope.BasicData.product.item_dtl_stk_list.items[i];
									key = imsiObj.opt_tval.split(" x ");
                                    if ($scope.selectedOptValue[0] == key[0] && $scope.selectedOptValue[1] == key[1]&& $scope.selectedOptValue[2] == key[2]) {
										$scope.subOpt[i1] += parseInt(imsiObj.inv_qty);
									}
								}                                
                            }
                        }
                        
                        //20160211 다음 옵션을 연다.
                        $scope.autoOpenOpt(optDepth);
                    }
					checkQuick();
					// $scope.dimAutoHeight();
				};
                //20160223-1 최종 상품을 선택한 경우 옵션 테두리 볼드처리 
                $scope.boldOptionBorder = function(){
                	$(".selLayer").removeClass("nextSelect");
                	$(".orderLayerWrap .selLayer").eq(0).addClass("nextSelect"); 
                }
				// param  b:true=> 주문항목으로 셋팅하지 않고 현재 선택된 주문항목을 return해준다[선택된 goods_no, item_no를 가져오기 위해서]
				//         false=> 선택된 상품및 옵션정보를 주문항목으로 추가한다.
				//      p_inv_qty:null => 재고 수량정보[상품정보의 재고수량을 사용한다. ]
				//      p_inv_qty:not null => 재고 수량정보[스마트픽 지점의 재고수량을 사용한다. ]
				var addOrderItemProc = function (b, p_inv_qty) {
					var strOptKey = ""; // 재고조회용 키(1 x 2)
					var goods_no = "";
					var goods_nm = "";
					var smpDispYn = ""; // 스마트픽 가능여부
					var master_disp_no = "";
					var goods_cmps_cd = "";
					var crspk_psb_yn = "";
					var isAllSelected = true;
                    var smp_only_yn = "";
                    
					if ($scope.prodItemList != undefined) {
						for (var i = 0; i < $scope.prodItemList.length;i++) {
							if ($scope.prodItemList[i].selectedItem != '') { // 마지막 옵션이면.. 재고 조회를 한다.
								if ($scope.prodItemList[i].value_type=='SELECTGOODS') { // 기획전형 상품은 단품정보가 셋팅되어 있다. + 따라서 현재 for loop는 한번만 돌아 간다.
									strOptKey += $scope.prodItemList[i].selectedItem;
								} else {
									strOptKey += $scope.prodItemList[i].selectedItem + " x ";
								}
							} else {
								isAllSelected = false;
								break; // 상위 옵션중 미선택 항목이 있으면 더이상 처리 하지 않는다.
							}

							goods_no = $scope.prodItemList[i].goods_no; // 제일 마지막상품번호[동일셋팅]
							goods_nm = $scope.prodItemList[i].goods_nm; // 제일 마지막상품명[동일셋팅]
							smpDispYn = $scope.prodItemList[i].smpDispYn; // 제일 마지막스마트픽가능여부[동일셋팅]
							master_disp_no = $scope.prodItemList[i].master_disp_no;
							goods_cmps_cd = $scope.prodItemList[i].goods_cmps_cd;
							crspk_psb_yn = $scope.prodItemList[i].crspk_psb_yn;
                            smp_only_yn = $scope.prodItemList[i].smp_only_yn;
						}
					} else {
						goods_no = $scope.BasicData.goods_no; // 상품번호[동일셋팅]
						goods_nm = $scope.BasicData.product.goods_nm; // 상품명[동일셋팅]
						smpDispYn = $scope.smpDispYn; // 스마트픽가능여부[동일셋팅]
						master_disp_no = $scope.BasicData.product.mast_disp_no;
						goods_cmps_cd = $scope.BasicData.goods_cmps_cd;
						crspk_psb_yn = $scope.BasicData.product.crspk_psb_yn;
                        smp_only_yn = $scope.BasicData.product.smp_only_yn;
                        //console.log("---2");
					}

					if (isAllSelected) {
						var img_url = ""; // 기획전형 상품은 이미지정보를 가지고 있다.
						var goodsItem = $scope.getSelectedGoodsItem(null);

						if (goodsItem != null && goodsItem.img_url != undefined) {
							img_url  = goodsItem.img_url;
						}

						if (strOptKey.length >= 3 && strOptKey.indexOf('x') >= 0) { // 마지막 gabage문자 삭제
							strOptKey = strOptKey.substr(0,strOptKey.length-3); // |1 x 2 x |
						}

						var optObj = $scope.getOptObj(strOptKey);
						var smartOrd = $scope.deliSelected==DELIVERY_SMARTPIC ? 'Y':'N';  // 스마트픽 주문예약
						var ord_cnt = Fnproductview.toNumber($scope.BasicData.min_lmt_qty);
						var inv_qty = optObj.inv_qty;
						var dept_main_inv_qty = optObj.dept_main_inv_qty;
						var dlv_goods_sct_cd = optObj.dlv_goods_sct_cd;
						var rsv_sale_yn = optObj.rsv_sale_yn;
						var smp_entr_no = ''; // 스마트픽 예약화면으로 넘겨줄 지점정보
						var smp_shop_no = ''; // 스마트픽 예약화면으로 넘겨줄 지점정보

						if (smartOrd == 'Y' && p_inv_qty != null) { // 스마트픽 지점의 재고수량을 사용한다.
							inv_qty = p_inv_qty;

							// 스마트픽 주문시 상품단위로 지점정보를 저장하여 스마트픽 예약화면으로 넘겨준다.
							if ($scope.brch_shop_no != null) {
								var shopInfo = Fnproductview.getObjListKey($scope.smartpickBookingBrch.items,"shop_no",$scope.brch_shop_no);

								if (shopInfo != null) {
									smp_entr_no = shopInfo.brch_entr_no;
									smp_shop_no = shopInfo.shop_no;
								}
							}
						}

						if (b) {
							return getOrderListItem(goods_nm,goods_no, optObj.opt_tval, optObj.item_no, smpDispYn
								,ord_cnt, $scope.priceInfo.lowPrice, inv_qty, master_disp_no, goods_cmps_cd
								,smartOrd, img_url, $scope.BasicData.min_lmt_qty, $scope.BasicData.max_lmt_qty, smp_entr_no
								,smp_shop_no, true,crspk_psb_yn,smp_only_yn);
						} else {
							// 선택옵션이 없는 상품은 자동으로 한개가 추가 되기때문에 삭제 할수 없다.
							var isDelete = false;

							if (($scope.prodItemList != undefined && $scope.prodItemList != null && $scope.prodItemList.length > 0)
											|| ($scope.BasicData.product.select_goods_list.items != null)) {
								isDelete = true;
							}

							$scope.addOrderList(getOrderListItem(goods_nm, goods_no, optObj.opt_tval, optObj.item_no, smpDispYn
								,ord_cnt, $scope.priceInfo.lowPrice, inv_qty, master_disp_no, goods_cmps_cd
								,smartOrd, img_url, $scope.BasicData.min_lmt_qty, $scope.BasicData.max_lmt_qty, smp_entr_no
								,smp_shop_no, isDelete,crspk_psb_yn,smp_only_yn,dept_main_inv_qty,dlv_goods_sct_cd,rsv_sale_yn));
						}
					}
				};

				// eung 선택한 상품 + 단품정보 삭제
				$scope.selPrdDel_click =  function (goods_no, item_no) {
					$scope.orderList.splice();
					$scope.totalDelivery_type = "0";

					for (var i = $scope.orderList.length; i--;) {
						if ($scope.orderList[i].goods_no == goods_no &&  $scope.orderList[i].item_no == item_no ) {
							$scope.orderList.splice(i, 1);
						}
					}

					for (i = $scope.orderList.length; i--;) {
						if ($scope.orderList[i].delivery_type != undefined) {
							if ($scope.orderList[i].delivery_type == "1") { // 택배전용
								$scope.totalDelivery_type = "1";
							} else if ($scope.orderList[i].delivery_type == "2") { // 스마트픽 전용
								$scope.totalDelivery_type = "2";
							}
						}
					}
					checkQuick();
					$scope.addOrderList(null); // null bind이면 주문항목을 추가하지 않고 수량과 금액만 재계산한다.
				};

				$scope.getSelectedOrderItem = function (goods_no, item_no) {
					var rtnItem ;

					for (var i = $scope.orderList.length; i--;) {
						if (item_no == undefined || item_no == null || item_no == '') {
							if ($scope.orderList[i].goods_no == goods_no) {
								rtnItem = $scope.orderList[i];
								break;
							}
						} else {
							if ($scope.orderList[i].goods_no == goods_no &&  $scope.orderList[i].item_no == item_no ) {
								rtnItem = $scope.orderList[i];
								break;
							}
						}
					}

					return rtnItem;
				};

				// 선택형 상품의 구성품중 해당하는 상품정보(goods_no->null ? 선택된 상품)
				$scope.getSelectedGoodsItem = function (goods_no) {
					var rtnItem = null ;

					if ($scope.BasicData.product.select_goods_list != null) {
						for (var i = 0; i < $scope.BasicData.product.select_goods_list.total_count; i++) {
							var item = $scope.BasicData.product.select_goods_list.items[i];

							if (goods_no == null) {
								if (item.selectedItem != '') {
									rtnItem = item;
									break;
								}
							} else {
								if (item.goods_no == goods_no) {
									rtnItem = item;
									break;
								}
							}
						}
					}

					return rtnItem;
				};

				// 선택된 상품을 주문항목으로 추가
				$scope.addOrderList =  function (OrderItem) {
                    //console.log("--------------3");
					var isOk = true,
						isOk2 = true;
					var total_ord_cnt = 0;
					var total_ord_amt = 0;

					// 기존재 여부 체크
					if (OrderItem!= null && $scope.orderList != undefined && $scope.orderList.length > 0) {
						for (var i=0; i < $scope.orderList.length; i++) {
							if ($scope.orderList[i].goods_no == OrderItem.goods_no && $scope.orderList[i].item_no == OrderItem.item_no){
								// 기존재
								isOk = false;

								// 선택은 되었으나 딤드처리된 경우 -> 딤을 풀어준다.
								if ($scope.orderList[i].disable != undefined && $scope.orderList[i].disable == true) {
									$scope.orderList[i].disable = false;
									$(".selList > li").eq(i).removeClass("disable");
									isOk2 = false;
								}

								break;
							}
						}
					}

					if (OrderItem!= null && isOk) {
						$scope.orderList.push(OrderItem);
					} else {
						// $scope.dimAutoHeight();
						if (OrderItem != null && isOk2) {
							if ($scope.prodItemList != null) {
								alert("이미 선택된 옵션입니다.");
								return;
							} else {
								alert("이미 선택된 상품입니다.");
								return;
							}
						}
					}

					// eung 택배&스마트픽 유형 체크
					//이쿠폰만 있는지 여부도 체크 20151204
					var i, kitem,
						ecpnNum = 0;
					$scope.totalDelivery_type = "0";
					$scope.onlyEcoupon = false; //이쿠폰만 담긴경우
					for (i = 0; i < $scope.orderList.length; i++) {
						kitem = $scope.orderList[i];
						total_ord_cnt += kitem.ord_cnt;
						total_ord_amt += kitem.sale_price;

						if (kitem.delivery_type == "1") { // 택배전용
							$scope.totalDelivery_type = "1";
							if(kitem.is_ecoupon){ //택배전용이지만 이쿠폰이면
								$scope.totalDelivery_type = "2";
								ecpnNum ++;
							}
						} else if (kitem.delivery_type == "2") { // 스마트픽 전용
							$scope.totalDelivery_type = "2";
						}
					}
					
					$scope.totalOrderCnt = total_ord_cnt;
					$scope.totalOrderAmt = total_ord_amt;

					// 주문항목 추가후 선택된 상품및 옵션정보를 초기화 한다.
					if ($scope.BasicData.goods_cmps_cd == '30') {
						$scope.BasicData.product.select_goods_list.selectedItem = "";
						$scope.BasicData.product.select_goods_list.displayName = "상품선택";//20160211
						$scope.prodItemList = [];
					} else {
						if ($scope.BasicData.product.item_dtl != null) {
							var rsv_sale_yn = !$scope.BasicData.product.reserve_start ? "N":"Y";
							$scope.prodItemList = setDefaultDisplayAttr($scope.BasicData.goods_no,$scope.BasicData.product.item_dtl.items,$scope.BasicData.product.goods_nm,"N",$scope.BasicData.product.mast_disp_no,$scope.BasicData.product.goods_cmps_cd,$scope.BasicData.product.crspk_psb_yn,$scope.BasicData.product.dept_main_inv_qty_sum,$scope.BasicData.product.dlv_goods_sct_cd,rsv_sale_yn);
						}
					}

					// 스마트픽 레이어가 열려 있다면 스마트픽관련 초기화
					// 스마트픽 지점정보를 초기화 한다.(그대로 있으면 변경사항이 없기때문에 onchange이벤트가 작동을 하지 않는다.)
					// $scope.brch_shop_no="";

					$scope.deliSelected = null;
					el.find(".btnDelivery").removeClass("on");
					el.find(".btnSmartpick").removeClass("on");
				};

				// 주문 수량 체크
				$scope.setOptsQty = function (goods_no,item_no,num,return_yn,smp_yn) { // 수량 +, - 처리
                    
					// 단품의 재고수
					var item = $scope.getSelectedOrderItem(goods_no,item_no);

					// max value를 초과 하면 해당 input value가 undefined처리되기때문에..
					if (typeof item.ord_cnt == 'undefined') {
						item.ord_cnt = item.max_lmt_qty;
					} else if (item.ord_cnt == null) {
						if (return_yn == 'Y') { // input box의 수량을 수정하기 위해서 back space 시 모두 지워지면 가격도 0으로 표시 되기에 onchange:return_yn->Y, onblur:return_yn->N 으로 처리하여 수량을 재조정한다.
							return;
						} else {
							item.ord_cnt = item.min_lmt_qty;
						}
					}

					if (item.ord_cnt < 1) {
						item.ord_cnt = 1;
					}
					if (item.inv_qty < item.ord_cnt) {
						// 재고가 단품재고 인지, 스마트픽 지점별 재고인지 구분하여 메시지를 보여준다.
						if (smp_yn == 'Y') {
							alert("지점 보유 재고가 부족합니다.");
						} else {
							alert("보유 재고가 부족합니다.");
						}
						return;
					}
					if (num != null) {
						if (num < 0 && item.min_lmt_qty >= item.ord_cnt) {
							alert("구매 최소 수량은 " + item.min_lmt_qty + "개 입니다.");
							item.ord_cnt = item.min_lmt_qty;
							return;
						}

						if (num > 0 && item.max_lmt_qty <= item.ord_cnt){ // && $scope.BasicData.pur_qty_lmt_yn == 'Y'
							alert("구매 최대 수량은 " + item.max_lmt_qty + "개 입니다.");
							item.ord_cnt = item.max_lmt_qty;
							return;
						}
                        //@@선물하기 구매 최대수량 20개 
                        
                        if($scope.orderTypeGift && item.ord_cnt > 19 && num == 1){
							alert("선물주문은 1회에 20명까지만 동시 전달이 가능합니다.");
							item.ord_cnt = 20;
                            item.max_lmt_qty = 20;                            
                            //item.sale_price = (item.org_sale_price - item.inst_cpn_aply_unit_price - item.immed_pay_dscnt_amt) * item.ord_cnt;
							//return;                            
                        }
						item.ord_cnt = num > 0 ? item.ord_cnt + 1: ((item.ord_cnt - 1) < 1 ? 1 : item.ord_cnt - 1) ;
					}

					if($('#method11').is(':checked') && !artQuick(item.ord_cnt)) return false;

					item.sale_price = (item.org_sale_price - item.inst_cpn_aply_unit_price - item.immed_pay_dscnt_amt) * item.ord_cnt;

					$scope.addOrderList(null); // null bind이면 주문항목을 추가하지 않고 수량과 금액만 재계산한다.
				};

				// 바로구매, 예약구매, 스마트픽구매
				$scope.buy = function () {
					// $scope.loginInfo.isLogin = true; //테스트
					//console.log("buy called");
					if($('#method11').is(':checked') && !artQuick()) return false;//퀵배송 체크
					var dlvGoodsSctCd = $scope.BasicData.product.dlv_goods_sct_cd;
					var deliveryInfo = $scope.BasicData.product.delivery_info;
					var delivery = deliveryInfo.replace("순차적", "주문순서대로");
					var isImall = ($scope.BasicData.product.entr_no == ENTRNO_IMALL);  //홈쇼핑상품인지 여부
					var isReserve = Fnproductview.isEmpty($scope.BasicData.product.reserve_start) ? false : true; //예약주문 상품인지 여부
					var checkResult = $scope.cartCheckResult('buy');

					if (checkResult == null) { // cartCheckResult함수에서 action 특정액션이 있는경우 null return
						return;
					}

					if (checkResult != "") {
						alert(checkResult);
						return;
					}
                    //선물하기 갯수에서 막음
                    if($scope.orderTypeGift && $scope.orderList.length != 1){                             
                        return;
                    }

					// 로딩바 출력
					$("#stayLoading").show();

					if (isImall) {
						// 모바일 홈쇼핑 상품 주문시 재고 체크 로직 수정 - jyyoon10
						var goods_no  = $scope.orderSendInfo.goods_no;
						var item_no   = $scope.orderSendInfo.item_no;
						var ord_qty   = $scope.orderSendInfo.ord_qty; //장바구니 수량 파라메터

						$scope.imall_prod_chk('buy', goods_no, item_no, ord_qty); // 아이몰 재고수량 체크
//						$scope.imall_prod_chk('buy'); // 아이몰 재고수량 체크
					} else {
						var isSmp = ($scope.orderSendInfo.smartOrd != null && $scope.orderSendInfo.smartOrd.indexOf('Y') >= 0) ? true : false; // 스마트픽 주문 여부
						var goUrl;
						var frm_send = el.find("#frm_send");

						if (!$scope.loginInfo.isLogin) {  // 로그인 안한 경우 !$scope.loginInfo.isLogin eung 임시 로 막음
							goUrl = LotteCommon.loginUrl + "?" + $scope.baseParam + "&fromPg=" + LOTTE_CONSTANTS['ONENONE_BUY_LOGIN'] + "&smp_buy_yn=" + (isSmp ? 'Y' : 'N') + "&minority_yn=" + $scope.BasicData.minority_limit_yn + "&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
							if($scope.rentalOnlyYnNew){ //렌탈상품인경우
								frm_send = el.find("#frm_rent_send");
								goUrl = LotteCommon.loginUrl + "?" + $scope.baseParam + "&fromPg=" + LOTTE_CONSTANTS['ONENONE_BUY_LOGIN'] + "&isRental=Y&smp_buy_yn=N&minority_yn=" + $scope.BasicData.minority_limit_yn + "&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
							}
                            if (isSmp) { // 스마트픽 예약주문 이거나 크로스픽인 경우 
                                    frm_send = el.find("#frm_smart_send");
                            }							
                            				//선물하기
							if($scope.orderTypeGift){ //비회원주문 막음
								goUrl = LotteCommon.loginUrl + "?" + $scope.baseParam + "&fromPg=" + LOTTE_CONSTANTS['ONENONE_BUY_LOGIN'] + "&fromGift=1&isRental=N&smp_buy_yn=N&minority_yn=" + $scope.BasicData.minority_limit_yn + "&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
							}
                        
						} else {
							if ($scope.BasicData.smp_wine_yn == 'Y') { // 와인 상품이면
								$scope.orderSendInfo.smartOrd = "Y";
								goUrl = LotteCommon.secureUrl + "/product/m/product_wine_buy_view.do?"+$scope.baseParam;
								goUrl += "&mastDispNo="+$scope.BasicData.product.mast_disp_no;
								goUrl += "&goods_no="+$scope.BasicData.goods_no;
								goUrl += "&smp_tp_cd="+$scope.BasicData.product.smp_tp_cd;

								if ($scope.BasicData.spick_app_yn == 'Y') {
									goUrl += "&spick_app_yn=Y";
								}
							} else {
								if (isSmp) { // 스마트픽 예약주문 이거나 크로스픽인 경우 
									frm_send = el.find("#frm_smart_send");
									goUrl = LotteCommon.baseUrl + "/smartpick/m/smartpick_booking.do?" + $scope.baseParam;
                                    if (LotteCommon.isTestFlag){                                    
                                        goUrl = "/smartpick/m/smartpick_booking_dev.html?" + $scope.baseParam;
                                    }
                                    
									if ($scope.BasicData.product.spick_app_yn == "Y") {
										goUrl += "&spick_app_yn=Y";
									}
								}else if($scope.rentalOnlyYnNew){ //렌탈상품
									frm_send = el.find("#frm_rent_send");
									goUrl = LotteCommon.secureUrl + "/product/m/product_rent.do?" + $scope.baseParam + "&tclick=";
									//goUrl = "product_rent_dev.html?" + $scope.baseParam + "&tclick=" + tclickcd; //test
								} else {
									var tclickcd = Fnproductview.getTclickCd($scope.BasicData.elotte_yn,"selectorder");
									goUrl = LotteCommon.secureUrl + "/order/m/order_form.do?" + $scope.baseParam + "&tclick=" + tclickcd;
								}
							}
						}
                        
						goUrl += '&tclick=m_DC_ProdDetail_Clk_Btn_2';

						$scope.orderSendInfo.back_url = encodeURIComponent(window.location.href,'UTF-8');
						frm_send.attr("action", goUrl);
						/*$timeout(function() {
								frm_send.submit();
						}, 1000);
						*/
						LotteForm.FormSubmit(frm_send);
					}
				};
				// $scope.buy end

				// 장바구니 담기
				$scope.cartAdd = function () {
					var checkResult = $scope.cartCheckResult('cart');

					if (checkResult == null) {
						return;
					}

					if (checkResult != "") {
						alert(checkResult);
						return;
					}
					
					var isImall = ($scope.BasicData.product.entr_no == ENTRNO_IMALL);

					// 홈쇼핑 상품인경우 - 연동에 의해 장바구니 담기가 결정됨
					if (isImall) {
						var goods_no  = $scope.orderSendInfo.goods_no;
						var item_no   = $scope.orderSendInfo.item_no;
						var ord_qty   = $scope.orderSendInfo.ord_qty; //장바구니 수량 파라메터

						// 모바일 홈쇼핑 상품 주문시 재고 체크 로직 수정 - jyyoon10
						$scope.imall_prod_chk('cart', goods_no, item_no, ord_qty); // 아이몰 재고수량 체크
//						$scope.imall_prod_chk('cart'); // 아이몰 재고수량 체크
					} else {
						var isSmp = ($scope.orderSendInfo.smartOrd != null && $scope.orderSendInfo.smartOrd.indexOf('Y') >= 0) ? true : false; // 스마트픽 주문 여부

						if (isSmp){ // 스마트픽 예약주문이면..
							var frm_send = el.find("#frm_smart_send");
							var goUrl = LotteCommon.baseUrl + "/smartpick/m/smartpick_booking.do?" + $scope.baseParam;
							goUrl += "&url_div=C";

							if ($scope.BasicData.product.spick_app_yn == "Y") {
								goUrl += "&spick_app_yn=Y";
							}

							goUrl += '&tclick=m_DC_ProdDetail_Clk_Btn_4';

							$scope.orderSendInfo.back_url = encodeURIComponent(window.location.href,'UTF-8');
							frm_send.attr("action", goUrl);
							LotteForm.FormSubmit(frm_send);
						} else {
							$scope.cartAddProc();
						}
					}
				};
				// cartAdd end

				// cartAdd common
				$scope.cartAddProc = function () {
					LotteForm.FormSubmitForAjax(LotteCommon.cartCartInsData,$scope.orderSendInfo)
					.success(function (data) {
						// if (!confirm("장바구니에 상품이 담겼습니다. \n장바구니로 이동하시겠습니까?")){
						$scope.btnOptionClose_click();
						$scope.brieflyPop({target : "cartPop"});

						try {
							angular.element($window).trigger("refreshCartCount");
						} catch (e) {}
						// return;
						// }
						/*장바구니로 이동시 탭셋팅값
						var type = "normal";
						if ($scope.BasicData.product.entr_no == ENTRNO_IMALL){
								type = "imall";
						} else if ($scope.BasicData.product.entr_no == '443808'){
								type = "manggo";
						} else if ($scope.BasicData.product.entr_contr_no == '226680'){
								type = "book";
						}
						var tclickcd = Fnproductview.getTclickCd($scope.BasicData.elotte_yn,"cart");
						$window.location.href = LotteCommon.cateLstUrl + "?type="+type + "&" + $scope.baseParam;
						*/
					})
					.error(function(ex) {console.log(ex);
						if (ex.error.response_code == LOGIN_EXCEPTION) {
							alert(ex.error.response_msg);
							// $scope.loginProc('N');
							Fnproductview.goToLogin($window, $scope, LotteCommon.loginUrl);
						} else if (ex.error.response_code == 'M000200') {
							alert(ex.error.response_msg);
						} else {
							alert("프로그램 오류로 인해 처리되지 않았습니다." );
							console.log('[Error]Cart Save Fail', ex.error.response_msg);
						}
					});
				};
				// cartAdd common end

				// 위시리스트담기[단품정보를 저장 하지 않기때문에 재고 및 수량정보를 체크하지 않는다.]
				$scope.wishListAdd = function () {
					//console.log('wishListAdd : called');
					// var checkResult = $scope.cartCheckResult('wish');
					// if (checkResult != ""){
					// 	alert(checkResult);
					// 	return;
					// }

					if (!$scope.loginInfo.isLogin) {  //로그인 안한 경우
						Fnproductview.goToLogin($window, $scope, LotteCommon.loginUrl);
						return;
					}

					// 추가 파라메터 셋팅
					$scope.orderSendInfo.ord_qty = "1";
					$scope.orderSendInfo.dno = $scope.reqParam.curDispNo;
					$scope.orderSendInfo.goods_no = $scope.BasicData.goods_no;
					$scope.orderSendInfo.mc = "1";
					$scope.orderSendInfo.item_no = "0";
					$scope.orderSendInfo.master_goods_yn = "Y";
					// $scope.orderSendInfo.conr_no = "0";

					LotteForm.FormSubmitForAjax(LotteCommon.wishWishInsData, $scope.orderSendInfo)
					.success(function (data) {
						$scope.brieflyPop({target:"wishPop"}); // 알림리스트 레이어
						$scope.hasWishList = true;
						// alert("위시리스트에 상품이 담겼습니다.");
					})
					.error(function (ex) {
						if (ex.error.response_code == '1001') {
							alert("이미 담은 상품입니다.");
						} else if (ex.error.response_code == LOGIN_EXCEPTION) {
							alert("로그인이 필요한 서비스입니다.");
							// $scope.loginProc('N');
							Fnproductview.goToLogin($window, $scope, LotteCommon.loginUrl);
						} else {
							alert("프로그램 오류로 인해 처리되지 않았습니다." );
						}
					});
				};
                //크로스픽
                var undefinedCheck = function(str){
                    if(str == undefined){
                        str = "";
                    }
                    return str;
                }
				var setOrderSendInfo = function () {
					var select_goods_no="", select_item_no="", select_goods_cmps_cd="", select_ord_qty="", select_goods_choc_desc="", select_infw_disp_no="", select_infw_disp_no_sct_cd=""
						,select_master_goods_yn="", select_cart_sn="", select_cmps_qty="", select_master_disp_no = "", select_shop_memo_tp_cd="", select_shop_memo_cont=""
						, select_smp_vst_shop_no="", select_smp_vst_rsv_dtime="", select_conr_no="", select_smp_tp_cd="", select_std_goods_no="", select_smp_deli_loc_sn=""
						,select_smartOrd="", select_smp_prod_yn="", select_smp_entr_no="", select_smp_shop_no="", select_is_ecoupon = "",select_smp_only_yn="";
                    
                    //크로스픽 추가    
                    var crspk_yn = "", crspk_corp_cd = "",crspk_corp_str_sct_cd = "", crspk_str_no = "", crspk_store = "";

					if ($scope.orderList != null) {
						var count = 0;

						for(var i = 0; i < $scope.orderList.length; i++) {
							// var gbn_str = $scope.orderList.length != i+1 ? LOTTE_CONSTANTS['SPLIT_GUBUN_1']: "";
							var gbn_str =  (i != 0) ? LOTTE_CONSTANTS['SPLIT_GUBUN_1']: "";
							var item = $scope.orderList[i];

							if ( $scope.BasicData.smp_wine_yn == 'Y' || 
                                    (!$(".selList > li").eq(i).hasClass("disable") && !(item.delivery_type != undefined && item.delivery_type != '1' && item.smp_shop_no == '' && $(".radio01:checked").val() == 2)) ||
                                    (item.crspk_corp_cd != undefined && item.crspk_corp_cd != '')
                               ) {
								 if (count == 0) {
									gbn_str = '';
									count = 1;
								}

								select_goods_no += gbn_str + item.goods_no;
								select_item_no += gbn_str + item.item_no;
								select_goods_cmps_cd += gbn_str + item.goods_cmps_cd;
								select_ord_qty += gbn_str + item.ord_cnt;

								select_goods_choc_desc += gbn_str;

								// eung 기획전형 입력형 옵션 처리
								if (item.item_opt_list != undefined && item.item_opt_list.items != null && item.item_opt_list.items != undefined) {
									for (var i2 = 0; i2 < item.item_opt_list.total_count; i2++) {
										var item2 = item.item_opt_list.items[i2];
										var opt_value = item2.item_opt_value.replace(/-/gi, "");

										if (i2 > 0) {
											select_goods_choc_desc += LOTTE_CONSTANTS['SPLIT_GUBUN_3'];
										}

										select_goods_choc_desc += item2.item_opt_type;
										select_goods_choc_desc += ":"+item2.item_opt_name;
										select_goods_choc_desc += ":"+item2.item_opt_value;
									}
								}

								select_conr_no += gbn_str;
								select_infw_disp_no += gbn_str + $scope.reqParam.curDispNo;
								select_infw_disp_no_sct_cd += gbn_str + $scope.BasicData.disp_no_sct_cd ;
								select_master_goods_yn += gbn_str + "N";
								select_cart_sn += gbn_str;
								select_cmps_qty += gbn_str + "0";
								select_master_disp_no += gbn_str + item.master_disp_no;
								select_shop_memo_tp_cd += gbn_str;
								select_shop_memo_cont += gbn_str;
								select_smp_vst_shop_no += gbn_str + item.smp_shop_no;
								select_smp_vst_rsv_dtime += gbn_str;
								select_smp_tp_cd += gbn_str;
								select_std_goods_no += gbn_str + item.goods_no;
								select_smp_deli_loc_sn += gbn_str;
								select_smartOrd += gbn_str + item.smartOrd;
								select_smp_prod_yn += gbn_str + item.smp_prod_yn;
								select_smp_entr_no += gbn_str + item.smp_entr_no;
								select_smp_shop_no += gbn_str + item.smp_shop_no;
								select_is_ecoupon += gbn_str + item.is_ecoupon;
                                
                                //크로스픽 추가                                
                                crspk_yn += gbn_str + undefinedCheck(item.crspk_yn);
                                crspk_corp_cd += gbn_str + undefinedCheck(item.crspk_corp_cd);
                                crspk_corp_str_sct_cd += gbn_str + undefinedCheck(item.crspk_corp_str_sct_cd);
                                crspk_str_no += gbn_str + undefinedCheck(item.crspk_str_no); 
                                crspk_store += gbn_str + undefinedCheck(item.mart_name); 
                                select_smp_only_yn			+= gbn_str + undefinedCheck(item.smp_only_yn);
							}
						}
					}

					/*
					if ($scope.BasicData.product.item_opt_list != null) {
						for(var i=0; i < $scope.BasicData.product.item_opt_list.total_count; i++) {
							if (!$(".selList > li").eq(i).hasClass("disable")) {
								var item = $scope.BasicData.product.item_opt_list.items[i];
								var opt_value = item.item_opt_value.replace(/-/gi, "");

								if (i > 0) {
									select_goods_choc_desc += LOTTE_CONSTANTS['SPLIT_GUBUN_3'];
								}

								select_goods_choc_desc += item.item_opt_type;
								select_goods_choc_desc += ":"+item.item_opt_name;
								select_goods_choc_desc += ":"+$scope.item_opt_value[i];
							}
						}
					}
					*/

					var orderSendInfo = $scope.orderSendInfo;
					orderSendInfo.goods_no = select_goods_no;
					orderSendInfo.item_no = select_item_no;
					orderSendInfo.goods_cmps_cd = select_goods_cmps_cd;
					orderSendInfo.goods_choc_desc = select_goods_choc_desc;
					orderSendInfo.ord_qty = select_ord_qty; //장바구니 수량 파라메터
					orderSendInfo.infw_disp_no = select_infw_disp_no;
					orderSendInfo.infw_disp_no_sct_cd = select_infw_disp_no_sct_cd;
					orderSendInfo.master_goods_yn = select_master_goods_yn;
					orderSendInfo.cart_sn = select_cart_sn;
					orderSendInfo.cmps_qty = select_cmps_qty;
					orderSendInfo.mast_disp_no = select_master_disp_no;
					orderSendInfo.shop_memo_tp_cd = select_shop_memo_tp_cd;
					orderSendInfo.shop_memo_cont = select_shop_memo_cont;
					orderSendInfo.smp_vst_shop_no = select_smp_vst_shop_no;
					orderSendInfo.smp_vst_rsv_dtime = select_smp_vst_rsv_dtime;
					orderSendInfo.conr_no = select_conr_no;
					orderSendInfo.std_goods_no = select_std_goods_no;
					orderSendInfo.smp_tp_cd = select_smp_tp_cd;
					orderSendInfo.smp_deli_loc_sn = select_smp_deli_loc_sn;
					orderSendInfo.smartOrd = select_smartOrd;
					orderSendInfo.smp_prod_yn = select_smp_prod_yn;
					orderSendInfo.smp_entr_no = select_smp_entr_no;
					orderSendInfo.smp_shop_no = select_smp_shop_no;
                    orderSendInfo.is_ecoupon = select_is_ecoupon;
                    //렌탈상품용
                    if($scope.rentalOnlyYnNew){
                        orderSendInfo.entr_no = $scope.BasicData.product.entr_no;
                        orderSendInfo.pImg = $scope.BasicData.product.img_url0;
                        orderSendInfo.pTitle =  $scope.BasicData.product.mgoods_nm;
                        orderSendInfo.pPrice = $scope.BasicData.product.sale_prc;
                    }
                    //크로스픽 추가
                    orderSendInfo.crspk_yn = crspk_yn;
                    orderSendInfo.crspk_corp_cd = crspk_corp_cd;
                    orderSendInfo.crspk_corp_str_sct_cd = crspk_corp_str_sct_cd;
                    orderSendInfo.crspk_str_no = crspk_str_no;
                    orderSendInfo.crspk_store = crspk_store;
                    orderSendInfo.smp_only_yn = select_smp_only_yn;
					//퀵배송 추가
					orderSendInfo.qs_yn = $scope.qs_yn;
				};

				// cart and buy option check && 주문서 항목 셋팅 setting
				$scope.cartCheckResult = function (btnTp) {
					var checkResult = "";
					var succ_bool = true;

					// 로직 체크
					if ($scope.BasicData.order_yn == 'N') {
						alert("롯데닷컴 정회원만 주문/결제가 가능합니다. 정회원 신청은 롯데닷컴 웹사이트를 이용해 주세요.");
						return;
					}

					//eung
					var smpCheckFlag = false; // 지점을 선택하지 않은 상품이 한개라도 있는지

					// 기획전인경우
					if ($scope.BasicData.product.select_goods_list != null && $scope.BasicData.product.select_goods_list.total_count > 0
						&& $scope.BasicData.product.select_goods_list.selectedItem == '') {
						if ($scope.orderList.length == 0) {
							return "상품을 선택해 주세요";
						} else {
							if ($scope.showDelivery && $(".deliSelect").find("input:checked").length == 0 && !$scope.orderTypeGift) {
									return "배송방법을 선택해 주세요";
							} else if ($("#method10:checked").length > 0) {// 스마트픽으로 받기 한 경우
								for (var i = 0; i < $scope.orderList.length; i++) {
									// 비활성이 아닌 상태에서
									if ($scope.orderList[i].disable == undefined || $scope.orderList[i].disable == false) {
				                        
                                        //크로스픽 추가
                                        if($scope.orderList[i].crspk_yn == undefined || $scope.orderList[i].crspk_yn != "Y"){
                                            //20151204 스마트픽 백화점
                                            if ($scope.orderList[i].smp_shop_no == "" && ($scope.orderList[i].is_ecoupon == undefined || !$scope.orderList[i].is_ecoupon) && ($scope.orderList[i].crspk_corp_cd == undefined || $scope.orderList[i].crspk_corp_cd == '')) {
                                                //console.log($scope.orderList[i].smp_shop_no,"-",$scope.orderList[i].is_ecoupon,"-",$scope.orderList[i].crspk_corp_cd);
                                                smpCheckFlag = true;
                                            }
                                        }
									}
								}

								// 지점선택 레이어를 띄운다.
								if (smpCheckFlag) {
									$scope.deliSelect_layer('2');
									return null;
								} else {
									// 상품을 담았지만, 모두 비활성인 경우는 상품을 선택하라는 메세지를 띄운다.
									var len = 0;

									for (var i = 0; i < $scope.orderList.length; i++) {
										// 비활성이 아닌 상태에서
										if ($scope.orderList[i].disable != undefined && $scope.orderList[i].disable == true) {
											len ++;
										}
									}

									if (len == $scope.orderList.length) {
										return "상품을 선택해 주세요";
									}
								}
							} else if (!$scope.showDelivery) { // 택배전용 또는 스마트픽 전용
								for (var i = 0; i < $scope.orderList.length; i++) {
									// 택배전용아니면서, 비활성이 아니고, 선택한 지점 항목이 없으면
									if ($scope.orderList[i].delivery_type != "1" && ($scope.orderList[i].disable == undefined || $scope.orderList[i].disable == false)) {
										if ($scope.orderList[i].smp_shop_no == "") {
											smpCheckFlag = true;
										}
									}
								}

								if (smpCheckFlag) {
									$scope.deliSelect_layer('2');
									return null;
								}
							}
						}
					} else { // 단품인 경우 -------------------------------
						// 스마트픽 상품
                        //크로스픽 케이스 추가 
						if ($scope.BasicData.product.smp_exchange_yn == "Y" || $scope.BasicData.product.crspk_psb_yn == "Y"){
							if (!$scope.isAllSelect() && $scope.orderList.length == 0) {
								return "상품정보를 먼저 선택해 주세요.";
							}

							// 지점을 선택하지 않았으면 레이어 띄운다.
							if ($scope.showDelivery) {
								// 배송방법이 선택되어있지 않으면 + 선물하기인경우 제외                                
								if ($(".deliSelect").find("input:checked").length == 0 && !$scope.orderTypeGift) {
									return "배송방법을 선택해 주세요";
								} else if ($("#method10:checked").length > 0) {
									smpCheckFlag = false;

									//지점을 선택하지 않았으면 레이어 띄움
									for (var i = 0; i < $scope.orderList.length; i++) {
										if ($scope.orderList[i].disable == undefined || $scope.orderList[i].disable == false) {
											//console.log($scope.orderList[i].crspk_corp_cd, $scope.orderList[i].smp_shop_no);
                                            //크로스픽 케이스 추가
                                            if ($scope.orderList[i].smp_shop_no == "" && ($scope.orderList[i].crspk_corp_cd == undefined || $scope.orderList[i].crspk_corp_cd == '')) {
												smpCheckFlag = true;
											}
										}
									}

									if (smpCheckFlag) {
										$scope.deliSelect_layer('2');
										return null;
									} else {
										// 상품을 담았지만, 모두 비활성인 경우는 상품을 선택하라는 메세지를 띄운다.
										var len = 0;
										for (var i = 0; i < $scope.orderList.length; i++) {
											// 비활성이 아닌 상태에서
											if ($scope.orderList[i].disable != undefined && $scope.orderList[i].disable == true) {
												len ++;
											}
										}

										if(len == $scope.orderList.length) {
											return "상품을 선택해 주세요";
										}
									}
								}
								// console.log()
							} else {
								if ($scope.orderList[0].smp_shop_no == '') {
									$scope.deliSelect_layer('2');
									return null;
								}
							}
							// return null;
						}
					}

					if (btnTp != "wish") {
						if ($scope.orderList == undefined || $scope.orderList.length == 0) {
							if (!$scope.isAllSelect()) {
								if ($scope.BasicData.product.select_goods_list != null && $scope.BasicData.product.select_goods_list.total_count > 0
									&& $scope.BasicData.product.select_goods_list.selectedItem == '') {
									checkResult = "상품을 선택해 주세요";
								} else {
									checkResult = "옵션을 선택해 주세요";
								}

								return checkResult;
							}
						} else {
							if (btnTp == "buy") {
								for (var i = 0 ; i < $scope.orderList.length; i++) {
									var ordCnt = $scope.orderList[i].ord_cnt;

									// 망고 상품 체크
									if ($scope.BasicData.product.entr_no == "443808" && (parseInt(ordCnt) > 30 || (parseInt(ordCnt) * parseInt($scope.BasicData.product.sale_prc) > 1500000))) {
											checkResult = "망고 상품의 경우 구매수량이 30개 이상 혹은 판매금액이 150만원 이상인 경우 구매가 제한되오니 구매를 원하시면 나눠서 구매해주세요!";
											return checkResult;
									}

								}
							}
						}

						// eung 기획전형 추가 입력형 옵션 상품 체크
						var checkChoc_desc = "", k, i, item, opt_name;

						for (k = 0; k < $scope.orderList.length; k++) {
							if ($scope.orderList[k].item_opt_list != null && $scope.orderList[k].item_opt_list != undefined) {
								for (i = 0; i < $scope.orderList[k].item_opt_list.total_count; i++) {
									item = $scope.orderList[k].item_opt_list.items[i];

									if (item.item_opt_value == undefined || item.item_opt_value == "") {
										opt_name = item.item_opt_name;

										if (Fnproductview.isEmpty(opt_name)) {
											opt_name = '옵션';
										}

										checkChoc_desc = opt_name + '을(를) 입력해주세요.';
										break;
									}
								}
								if (checkChoc_desc != "") {
									return checkChoc_desc;
								}
							}
						}

					}

					if ($scope.BasicData.smp_wine_yn == 'Y') { // 와인상품
						if (!$scope.loginInfo.isLogin) {  // 로그인 안한 경우
							alert("본 상품은 19세 미만의 청소년 예약 불가한 상품으로 확인 절차를 위하여 로그인이 필요합니다.");
							Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
							return null;
						}

						if (parseInt($scope.BasicData.mbr_age,'10') < 19) {
							checkResult = "본 상품은 19세 미만의 청소년은 예약이 불가능합니다.";
							 return checkResult;
						}
					}

					// 주문항목에 필요한 parameter 수집및 form데이터 object 생성
					setOrderSendInfo();  // $scope.orderSendInfo 셋팅

					// 위시리스트는 옵션선택 없이 상품만 저장할수 있음.
					if (btnTp == "wish") {
						if (orderSendInfo.goods_no == '') {
							if ($scope.BasicData.product.goods_tp_cd == '30') { // 기획전형 상품이면 구성상품목록에서 선택된 상품
								var goods_no = "";

								for (var i = 0; $scope.BasicData.product.select_goods_list.total_count;i++) {
									var item = $scope.BasicData.product.select_goods_list.items[i];

									if (item.selectedItem != '') {
										goods_no = item.goods_no;
										break;
									}
								}

								if (goods_no == '') {
									checkResult = "상품을 선택해 주세요";
									return checkResult;
								} else {
									orderSendInfo.goods_no = goods_no;
								}
							} else { // 일반상품이면 상품기본
								orderSendInfo.goods_no = $scope.BasicData.goods_no;
							}
						}
					}

					return checkResult;
				};

				// 아이몰 재고 체크
				$scope.imall_prod_chk = function (gubun, goods_no, item_no, ord_qty) {
					$http({
						url:     LotteCommon.productImallStockCheckData,
						method:  'GET',
						async:   false,
						cache:   false,
						headers: {'Accept': 'application/json', 'Pragma': 'no-cache'},
						params:  {
							ord_qty : ord_qty,
							goods_no : goods_no,
							item_no : item_no
						}
					}).success(function (data) {
						if (gubun == 'cart') {
							$scope.cartAddProc();
						} else {
							var goUrl;

							if (!$scope.loginInfo.isLogin) {  // 로그인 안한 경우
								goUrl = LotteCommon.loginUrl + "?"+$scope.baseParam+"&fromPg="+LOTTE_CONSTANTS['IMALL_BUY_LOGIN']+"&minority_yn="+$scope.BasicData.minority_limit_yn +"&smp_prod_yn=N&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8')+ '&imallYN=Y';
							} else {
								var tclickcd = Fnproductview.getTclickCd($scope.BasicData.elotte_yn,"select_buynow");
								goUrl = LotteCommon.secureUrl + "/order/m/order_form.do?"+$scope.baseParam+"&tclick="+tclickcd + '&imallYN=Y';
							}

							 var frm_send = el.find("#frm_send");
							frm_send.attr("action", goUrl);
							LotteForm.FormSubmit(frm_send);
						}
					}).error(function (ex) {
						if (ex.error.response_code == '1000') {
							alert(ex.error.response_msg);
						} else {
							alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
						}

						if (gubun == 'cart') {
							$scope.cartAddProc();
						} else {
							var goUrl;

							if (!$scope.loginInfo.isLogin) {  // 로그인 안한 경우
								goUrl = LotteCommon.loginUrl + "?"+$scope.baseParam+"&fromPg="+LOTTE_CONSTANTS['IMALL_BUY_LOGIN']+"&minority_yn="+$scope.BasicData.minority_limit_yn +"&smp_prod_yn=N&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8')+ '&imallYN=Y';
							} else {
								var tclickcd = Fnproductview.getTclickCd($scope.BasicData.elotte_yn,"select_buynow");
								goUrl = LotteCommon.secureUrl + "/order/m/order_form.do?"+$scope.baseParam+"&tclick="+tclickcd + '&imallYN=Y';
							}

							 var frm_send = el.find("#frm_send");
							frm_send.attr("action", goUrl);
							LotteForm.FormSubmit(frm_send);
						}

//						$("#stayLoading").hide();
					});
				};
				// imall_prod_chk end

				// 기존코드
				// 재입고 알림
				$scope.StockRechargeCall = function (goods_no, item_no) {
					var mbrNo = '';

					if ($scope.loginInfo.isLogin == true) {
						mbrNo = $scope.loginInfo.mbrNo;
					} else {
						alert("로그인을 해주세요.");
						Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						return;
					}

					$http.get('/json/system/restock_alram.json', {params:{
						mbr_no: mbrNo,
						goods_no: goods_no,
						spdp_goods_no: '',
						item_no: item_no,
						channel: '1' // 1:상품상세,2:장바구니,3:위시리스트
					}})
					.success(function (data) {
						if (data.RESPONSE_CODE == '0000') {
							$scope.btnOptionClose_click();
							$scope.brieflyPop({target : "alarmPop", phone : data.PHONE});
						} else if (data.RESPONSE_CODE == '1001') {
							alert("상품정보가 없습니다.");
						} else if (data.RESPONSE_CODE == '1003') {
							alert("신청 정보가 이미 존재 합니다.");
						} else if (data.RESPONSE_CODE == '1004') {
							alert("로그인을 해주세요.");
							Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						} else {
							alert("상품정보가 없습니다.");
						}
					})
					.error(function (ex) {
						if (ex.error.response_code == '1001') {
							alert("상품정보가 없습니다.");
						} else if (ex.error.response_code == LOGIN_EXCEPTION) {
							alert("로그인을 해주세요.");
							// $scope.loginProc('N');
							Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						} else {
							alert("프로그램 오류로 인해 처리되지 않았습니다." );
						}
					});
				};

				// 품절 상품 체크
				// LG패션 재고 관리
				$scope.lgFashionStockMng = function (buy, dlvGoodsSctCd, delivery) {
					var item_no = $("#frm_send input[name=itemno]:hidden").val();
					var ord_qty = $("#frm_send input[name=order_qty]:hidden").val();

					$http.get(LotteCommon.productLgStockCheckData, {params:{
						ord_qty : $("#frm_send input[name=order_qty]:hidden").val(),
						goods_no : $scope.BasicData.goods_no,
						item_no : opt_value,
						entr_no : $scope.BasicData.product.entr_no
					}})
					.success(function (data) {
						// $scope.buy(buy, dlvGoodsSctCd, delivery);
						$scope.buy();
					})
					.error(function (ex) {
						if (ex.error.response_code == '1000') {
							alert(ex.error.response_msg);
						} else {
							alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
						}
					});
				};
				// lgFashionStockMng end
                
                //201605 크로스픽
                //지도검색
                $scope.show_map = function(radioIndex){
                    martIndex = radioIndex;
                    $("#searchMartPop").show();
                    
                }
                
				$scope.isQuick = true;//퀵배송 체크
				$scope.quickPop = false;//퀵배송 안내팝업
				var checkQuick = function(v){
					$scope.isQuick = false;
					var nowT = Fnproductview.toTimeString(new Date(),'HHMNSS'),prdNum=0;
					if($scope.holiday){//백화점 휴무일일때
						$('#method11').prop('checked',false);
						return 'holi';
					}else if(nowT < "090000" || "163000" < nowT){//09:00~16:30 에만 주문가능
						$('#method11').prop('checked',false);
						return 'time';
					}
					var list = $scope.orderList;
					if(list.length){
						for(var i=0;i<list.length;i++){
							var item = list[i];
							if(item.dept_main_inv_qty==undefined || item.dlv_goods_sct_cd!='01' || item.rsv_sale_yn=='Y' || item.delivery_type=='1'){//스마트픽상품이 아닐 경우,일반상품아닌경우
								$('#method11').prop('checked',false);
								return 'deli';
							}
							if(item.dept_main_inv_qty==0){
								$('#method11').prop('checked',false);
								return 'main';//본점 재고 없을 경우
							}
							if($('#method11').is(':checked')){
								if(item.dept_main_inv_qty<item.ord_cnt){
									$scope.isQuick = true;
									$scope.orderList[i].ord_cnt = item.dept_main_inv_qty;
									if(v!=undefined) return item.dept_main_inv_qty;//개별재고체크
									else{
										item.sale_price = (item.org_sale_price - item.inst_cpn_aply_unit_price - item.immed_pay_dscnt_amt) * item.ord_cnt;
										prdNum++;
									}
								}
							}
						}
						if(prdNum) return 'qty';//전체적으로 재고 체크
					}
					$scope.isQuick = true;
				}
				var artQuick = function(v){
					var str = checkQuick(v), aTxt;
					if(str == undefined) return true;
					switch(str){
						case 'holi' : aTxt = '공휴일 및 롯데백화점 본점 휴무일,\n배송마감일에는\n퀵 배송 주문이 불가합니다.';break;
						case 'time' : aTxt = '퀵 배송 주문은 09:00 ~ 16:30에만 가능합니다.';break;
						case 'deli' : aTxt = '선택하신 상품 중, 퀵 배송 받을 수 없는\n상품이 포함되어 있습니다.';break;
						case 'main' : aTxt = '롯데백화점 본점 스마트픽 상품만\n퀵 배송 받을 수 있습니다.';break;
						case 'qty' : aTxt = '퀵 배송 가능한 최대 구매 수량을\n초과하였습니다.';
							$scope.addOrderList(null);break;
						default : aTxt = '퀵배송 가능한 최대 구매 수량은 '+str+'개입니다.';break;
					}
					
					alert(aTxt);
					return str;
				}
				//퀵배송 안내 팝업
				$scope.close_quickPop = function(){
					$scope.inputNumber = false;
					$scope.quickPop = false;
					$("body").removeClass("fixBody");
				}
			}
		};
	}]);
	// 하단 주문레이어 끝

	// Directive :: 상품주문관련 Form 정보
	app.directive('productFormInfo', ['$window', '$location', function ($window, $location) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/productFormInfo.html',
			replace: true,
			link: function($scope, el, attrs) {
				console.log('productFormInfo', 'called');
			}
		};
	}]);

	app.directive('productSendForm', ['$window', '$location', function ($window, $location) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/product_send_form.html',
			replace: true,
			link: function ($scope, el, attrs) {
				console.log('productSendForm', 'called');
			}
		};
	}]);

	// Directive :: 같은상품 비교하기
	app.directive('productCompareList', ['$window', '$http', 'LotteCommon', 'Fnproductview',
		function ($window, $http, LotteCommon, Fnproductview) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/product_compare_list.html',
			replace: true,
			link: function ($scope, el, attrs) {
				$scope.Fnproductview = Fnproductview;
				$scope.ProdCompList = [];
				$scope.isProdCompList = false;
				// console.log('productCompareList', 'called');

				$http.get(LotteCommon.productCompareModelProduct, {
					params:{
						goods_no: $scope.BasicData.goods_no,
						brnd_no: $scope.BasicData.product.brnd_no,
						model_no: $scope.BasicData.product.model_no
					}
				})
				.success(function(data) {
					// console.log('productCompareList Success!!');
					$scope.ProdCompList = data.max.same_product.items; // 상품정보 로드

					if($scope.ProdCompList != null && data.max.same_product.total_count > 0){
						$scope.isProdCompList = true;

						// 참좋은 혜택가 동일
						for (var i = 0; i < $scope.ProdCompList.length; i++) {
							$scope.ProdCompList[i].final_prc = Fnproductview.toNumber($scope.ProdCompList[i].sale_prc) - (Fnproductview.toNumber($scope.ProdCompList[i].inst_cpn_aply_unit_price) + Fnproductview.toNumber($scope.ProdCompList[i].immed_pay_dscnt_amt));
						}
					}
				})
				.error(function() {
					console.log('Data Error : productCompareList 실패');
				});

				$scope.goProduct_view = function (goods_no) {
					var fullUrl = LotteCommon.productviewUrl + "?goods_no="+goods_no+"&" + $scope.baseParam;

					if ($scope.reqParam.curDispNoSctCd != null) {
						fullUrl += "&curDispNoSctCd="+$scope.reqParam.curDispNoSctCd;
					}

					if ($scope.reqParam.curDispNo != null) {
						fullUrl += "&curDispNo="+$scope.reqParam.curDispNo;
					}

					// $scope.sendTclick( 'm_DC_ProdDetail_Swp_Rel_A' + ( this.$index + 1 ) );
					fullUrl += '&tclick=m_DC_ProdDetail_Swp_Rel_A' + ( this.$index + 1 );
					$window.location.href = fullUrl;
				};
			
			}
		};
	}]);

	// Directive :: 상품정보>상품설명>가격정보
	app.directive('productInfoPrice', ['$window', '$http', 'Fnproductview', 'LotteCommon',
		function ($window, $http, Fnproductview, LotteCommon) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/product_info_price.html',
			replace: true,
			link : function ($scope, el, attrs) {
				// console.log('productInfoPrice', 'called');
				$scope.priceInfoTp = ""

				if ($scope.BasicData.product.prc_dif_view_yn == 'Y') {
					$scope.priceInfoTp = "00";
				} else if (($scope.BasicData.product.ec_goods_artc_cd == '30' || $scope.BasicData.product.ec_goods_artc_cd == '31') && $scope.BasicData.elotte_yn != 'Y') {
					$scope.priceInfoTp = "01";
				} else {
					$scope.priceInfoTp = "02";
				}

				if ($scope.BasicData.smp_wine_yn == 'Y') { //와인상품
					$scope.priceInfoTp = "03";
				}

				$scope.goPromotionList = function(url) {
					Fnproductview.goUrl($window,$scope,url + '&tclick=m_DC_ProdDetail_Clk_Ban_' + ( this.$index + 1 ),"benefit");
				};

				/*지점별 쿠폰 다운로드*/
				$scope.brch_cpn_down = function (prom_no) {
					$scope.reqParam.prom_no = prom_no;

					$http.get(LotteCommon.couponRegCouponData, {params:$scope.reqParam})
					.success(function(data) {
						// console.log('Download Success!!');
					})
					.error(function(ex) {
						console.log('Data Error : Download 실패');

						if (ex.error.response_code == LOGIN_EXCEPTION) {
							alert("로그인이 필요한 서비스입니다.");
							// $scope.loginProc('N');
							Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						} else {
							alert("프로그램 오류로 인해 처리되지 않았습니다.");
						}
					});
				};

				var LoadScript = function (src, callback, charset, defer, id) {
					if (typeof src != 'string' || src == undefined) return;

					var isLoaded= false;
					var head    = document.getElementsByTagName('head')[0];
					var script  = document.createElement('script');
					var charset = (charset && typeof charset == 'string') ? charset : 'UTF-8';

					if (id && typeof id == 'string' && id != '') {
							script.id = id;
					}

					script.src = src;
					script.charset = charset;
					script.type  = 'text/javascript';
					script.async = true;
					script.defer = (typeof defer == 'boolean') ? defer : true;

					if (typeof callback == 'function') {
						script.onreadystatechange = function () {
								if (this.readyState == 'loaded' || this.readyState == 'complate') {
									if (isLoaded) return;
									window.setTimeout(callback(), 1);
									isLoaded = true;
								}
						};

						script.onload = function() {
								if (isLoaded) return;
								window.setTimeout(callback(), 1);
								isLoaded = true;
						};
					}

					head.appendChild(script);
				};
			}
		};
	}]);

	// Directive :: 상품상세 Html정보 셋팅
	app.directive('productDetailHtml', ['$http', '$timeout', 'LotteCommon', 'Fnproductview',
		function ($http, $timeout, LotteCommon, Fnproductview) {
		return {
			link: function ($scope, el, attrs) {
				//console.log('reqParam', $scope.reqParam);
				$http.get(LotteCommon.productProductDetailData, {params:$scope.reqParam})
				.success(function(data) {
					//$scope.DetailData = Fnproductview.replaceAll(data.max.dtl_info_fcont, ";", "<br>");/*상품기본정보 로드*/
					$scope.DetailData = data.max.dtl_info_fcont;
					$scope.isDetailData = true;
					el.html($scope.DetailData);
					
				})
				.error(function() {
					console.log('Data Error : 상품상세정보 로드 실패');
				});
			}
		};
	}]);

	// Directive :: 상품상세 Big딜 정보 셋팅
	app.directive('bigDealInfo', ['Fnproductview', function (Fnproductview) {
		return {
			template : "<div class='bigDealState' ng-if='isEndTime || isSaleCnt'><span class='bigDealTime' ng-if='isEndTime && !BasicData.product.find_much'><span>{{remainTime}}</span> 남음</span><span class='bigDealBuy' ng-if='BasicData.product.genie_sale_cnt != null && BasicData.product.genie_sale_cnt > 0'><span>{{BasicData.product.genie_sale_cnt | number:0}}개</span> 구매중</span></div>",
			link:function($scope, el, attrs) {
				// console.log('bigDealInfo called');
				// $scope.BasicData.product.genie_sale_cnt = "10";
				// $scope.BasicData.product.genie_disp_end_dtime = "20150929204659";

				$scope.isEndTime = false;
				$scope.isSaleCnt = false;

				if ($scope.BasicData.product.genie_sale_cnt > 0) {
					$scope.isSaleCnt = true;
				}

				if ($scope.BasicData.product.genie_disp_end_dtime != null && $scope.BasicData.product.genie_disp_end_dtime.length >= 12) {
					if ($scope.BasicData.product.genie_disp_end_dtime.substring(0,4) != '9999') {
						// console.log('bigDealInfo remain time==>' + Fnproductview.getHourInterval(undefined,$scope.BasicData.product.genie_disp_end_dtime));

						if (Fnproductview.getHourInterval(undefined,$scope.BasicData.product.genie_disp_end_dtime) < 6) {
							$scope.isEndTime = true;
							$scope.remainTime = Fnproductview.getMinuteIntervalStr(undefined,$scope.BasicData.product.genie_disp_end_dtime);
						}
					}
				}
			}
		};
	}]);

	// Directive :: 상품상세 상단기본정보[일반,기획전형] 셋팅
	app.directive('productInfoNormal', ['Fnproductview', '$window', '$http', 'LotteCommon',
		function(Fnproductview, $window, $http,LotteCommon) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/product_info_normal.html',
			link: function ($scope, el, attrs) {
				// console.log('productInfoNormal called');
				$scope.Fnproductview = Fnproductview;

				// 브랜드샵 이동
				$scope.goBrandShjop = function (url,dispCnt) {
					var goUrl = url + "?curDispNo=" + $scope.BasicData.product.brnd_disp_shop_no + "&upBrdNo=" + $scope.BasicData.product.upr_brnd_no;

					if (dispCnt != undefined) {
							goUrl += "&dispCnt=" + dispCnt;
					}
					//샤넬화장품일 경우
					if($scope.BasicData.product.brnd_no=='255'){
						goUrl = '/category/m/prod_list.do?c&curDispNo=5036840&isWine=Y&isComm=Y&title=샤넬&c=mlotte';
					}

					// $scope.sendTclick( 'm_DC_ProdDetail_Clk_Lnk_1' );
					goUrl += '&tclick=m_DC_ProdDetail_Clk_Lnk_1';
					Fnproductview.goUrl($window,$scope,goUrl,"brandshop");
				};
								

				// 남들은 뭘 샀지 이동
				$scope.goPeopleBuy = function () {
					// 해더 카테고리 닫기
					$(".titLocation").removeClass("on");

					$scope.sendTclick( 'm_DC_ProdDetail_Clk_Btn_1' );
					// SaleBestData

					if ($(".peopleBuy").position() == undefined) {
						$('body').animate({"scrollTop":"500px"}, 500,'swing',function () {
							setTimeout(function () {
								//angular.element($window).scrollTop($(".peopleBuy").position().top);

								if ($(".peopleBuy").length > 0) {
									$('body').animate({"scrollTop":$(".peopleBuy").position().top - 45}, 300);
								} else {
									$('body').animate({"scrollTop":$("#footer").position().top}, 300);
								}
							}, 1000);
						});
					} else {
						//angular.element($window).scrollTop( $(".peopleBuy").position().top );
						var scrollTop = $(".peopleBuy").position().top;

						if ( $( '#head_sub' ).css( 'position' ) == 'fixed' ) {
							scrollTop -= $( '#head_sub' ).height();
						}

						angular.element($window).scrollTop( scrollTop );
					}
				};
				/*
				// L-money 10원 다운로드가 있을 경우
				if (($scope.BasicData.product.ec_goods_artc_cd == '30' || $scope.BasicData.product.ec_goods_artc_cd == '31') && $scope.BasicData.elotte_yn != 'Y') {
					$scope.rentalOnlyYn = true;
				}
				*/
				// 렌탈상품 10원 받기
				$scope.fn_RentalOnly = function (money) {
					$http.get(LotteCommon.productRegistRentalPoint, {params:$scope.reqParam})
					.success(function(data) {
						// alert("10점이 적립 되셨습니다.\n적립된 L-money 10점은 오을 자정 12시에 소멸되며, 내일 또 적립 받으실 수 있습니다.");
						$scope.helpLayer({target:'rentalOnly',lmoney : money});
						// if (data.error.response_code == "0001") {
						//	$scope.helpLayer({target:'rentalOnlyError',response_msg : data.error.response_msg});
						// }
					})
					.error(function (ex) {
						console.log('Data Error : Download 실패');
						if (ex.error.response_code == LOGIN_EXCEPTION) {
							alert("로그인이 필요한 서비스입니다.");
							Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						} else {
							// "response_msg" : "이미 L-money를 받으셨습니다.\n상품 구매후 다시 받으실 수 있습니다."
							//alert(ex.error.response_msg);
							$scope.helpLayer({target:'rentalOnlyError',response_msg : ex.error.response_msg});
						}
					});
				};

				// .titTop 높이 고정
				el.find('.titTop').height(19);
			}
		};
	}]);

	// Directive :: 상품상세 상단기본정보[와인상품] 셋팅
	app.directive('productInfoWine', ['Fnproductview', '$window', function (Fnproductview, $window) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/product_info_wine.html',
			link: function ($scope, el, attrs) {
				//console.log('productInfoWine called');
				$scope.Fnproductview = Fnproductview;
				$scope.contryImg = "";

				//wine상품의 국가 아이콘정보[마지막 이미지가 국기정보]
				//이미지정보 셋팅[스와이프용]
				angular.forEach($scope.BasicData.product, function (val, key) {
					if (key != 'img_url' && key.indexOf('img_url') == 0) {
						if ($scope.BasicData.product[key] != null && $scope.BasicData.product[key] != '') {
							//맨마지막 이미지를 출력하기 위해서 loop set
							$scope.contryImg = $scope.BasicData.product[key].replace('_280', '_280');
						}
					}
				});

				$scope.goGuideInfo = function () {
						var goUrl = "/smartpick/vine_guide.do";
						Fnproductview.goUrl($window,$scope,goUrl,null);
				};

				$scope.wineGuide = false; //와인안내페이지
				$scope.wineInfoFoot = false;

				$scope.wineFootOpen = function () {
						$scope.wineInfoFoot = !$scope.wineInfoFoot;

						if ($scope.wineInfoFoot) {
								setTimeout(function () {
									$(".wineGuideLayer").animate({"scrollTop":"1000px"}, 300);
									//scrollTop(500);
								}, 500);
						}
				};
			}
		};
	}]);

	// Directive :: 상품상세 카테고리 네비게이션 정보 셋팅
	app.directive('cateNavi', ['$http', '$window', 'Fnproductview', 'LotteCommon','LotteStorage',
		function($http, $window, Fnproductview, LotteCommon,LotteStorage) {
		return {
			//template : "<section class='titLocation' ng-if='isCateNaviData'><a ng-repeat='item in cateNaviList' ng-click='goCateList(item.move_tp,item.disp_no)' >{{item.disp_nm}}</a></section>",
			link:function ($scope, el, attrs) {
				// console.log('cateNavi called');
				// 홈으로 이동할지 해당 카테고리로 이동할지 여부를
				var homeDispNo = "5537335"; //모바일홈메뉴

				// 카테고리목록 이동
				$scope.goCateList = function (move_tp,dispNo,title) {
					if (move_tp == "00") {
						return;
					}

					var goUrl;

					if (move_tp == "01") {
						// 기본 대표카테고리-> 링크없음
						// console.log("move_tp==>01");
					} else if (move_tp == "02") { // 모바일 대카테고리
						// 좌측카테고리를 열고 해당 카테고리 메뉴를 open 한다.
						$scope.showSideCtgHeader();

						var dt = angular.element(".categorySet dl.menu").find("dt");
						dt.each(function () {
							var th = $(this);

							if (th.attr("data-ctgno") == dispNo) {
								if (! th.parent().hasClass("active")) {
									setTimeout(function () {
										th.click();
									}, 1000);
									return false;
								}
							}
						});
					} else if (move_tp == "03") { // 모바일 소카테고리-> 화면이동
						goUrl = "/category/m/cate_mid_list_anglr.do?curDispNo="+dispNo;
						goUrl += "&tclick=m_DC_ProdDetail_Clk_CateLayer_Flt1_1";
						Fnproductview.goUrl($window,$scope,goUrl,"brandshop");
					} else if (move_tp == "04") { // 모바일 세카테고리-> 화면이동
						goUrl = "/category/m/new_prod_list.do?disp_no="+dispNo+"&title="+title;
						goUrl += "&tclick=m_DC_ProdDetail_Clk_CateLayer_Flt1_2";
						Fnproductview.goUrl($window,$scope,goUrl,"brandshop");
					}
				};

				$scope.cateNaviList = [];
				$scope.isCateNaviData = false;

				$http.get(LotteCommon.productCateNavi, {params:$scope.reqParam})
				.success(function (data) {
					$scope.CateNaviData = data.result; // 정보 로드

					if ($scope.CateNaviData != null) {
						$scope.isCateNaviData = true;

						var move_tp ="00"; // 기본 대표카테고리-> 링크없음

						if ($scope.CateNaviData.disp_lrg_no != "" && $scope.CateNaviData.disp_lrg_no != "0") {
							move_tp = "01"; // 모바일 대카테고리-> 레이어 오폰

							var cateItem = {
								disp_nm: $scope.CateNaviData.disp_lrg_nm,
								move_tp: move_tp,
								disp_no: $scope.CateNaviData.disp_lrg_no
							};

							if (cateItem.disp_nm != "") {
								$scope.cateNaviList.push(cateItem);
							}
						}

						if ($scope.CateNaviData.disp_mid_no != "") {
							move_tp = "02"; // 모바일 중카테고리-> 화면이동

							var cateItem = {
								disp_nm:$scope.CateNaviData.disp_mid_nm,
								move_tp:move_tp,
								cur_disp_no:$scope.CateNaviData.disp_mid_no
							};

							$scope.cateNaviList.push(cateItem);
						}

						if ($scope.CateNaviData.disp_sml_no != "") {
							move_tp = "03"; // 모바일 소카테고리-> 화면이동

							var cateItem = {
								disp_nm:$scope.CateNaviData.disp_sml_nm,
								move_tp:move_tp,
								cur_disp_no:$scope.CateNaviData.disp_sml_no
							};

							$scope.cateNaviList.push(cateItem);
						}

						if ($scope.CateNaviData.disp_thn_no != "") {
							move_tp = "04"; // 모바일 세카테고리-> 화면이동

							var cateItem = {
								disp_nm:$scope.CateNaviData.disp_thn_nm,
								move_tp:move_tp,
								cur_disp_no:$scope.CateNaviData.disp_thn_no
							};

							$scope.cateNaviList.push(cateItem);
						}
                        
                        //20160927 이동할 카테고리 링크를 저장해둠 : 렌탈상품 신청 등에서 쓰임
                        var lastItem = $scope.cateNaviList[$scope.cateNaviList.length-1];
                        var lastItemLink = "/category/m/";
                        if (lastItem.move_tp == "03") { // 모바일 소카테고리-> 화면이동
						    lastItemLink += "cate_mid_list_anglr.do?tclick=m_DC_ProdDetail_Clk_CateLayer_Flt1_1&curDispNo="+lastItem.cur_disp_no;
					    }else if(lastItem.move_tp == "04") { // 모바일 세카테고리-> 화면이동
                            lastItemLink += "new_prod_list.do?tclick=m_DC_ProdDetail_Clk_CateLayer_Flt1_2&disp_no="+lastItem.cur_disp_no+"&title="+lastItem.disp_nm;
                        }
                        LotteStorage.setSessionStorage("lastItemCateLink", lastItemLink);
                        
					}
				})
				.error(function () {
					console.log('Data Error : 상품상세 네비게이션  로드 실패');
				});
			}
		};
	}]);

	// Directive :: 상품상세 미리계산기
	app.directive('popPreCalculator', ['$window', '$http', '$timeout', 'LotteCommon', 'Fnproductview',
		function ($window, $http, $timeout, LotteCommon, Fnproductview) {
		return {
			 templateUrl: '/lotte/resources_dev/product/m/pop_pre_calculator.html',
			 replace: true,
			link: function ($scope, el, attrs) {
				// console.log('popPreCalculator called');
				$scope.L_POINT = LOTTE_CONSTANTS['ST_STD_CD_PAY_MEAN_CD_L_POINT']; // L-포인트
				$scope.LOTTE_POINT = LOTTE_CONSTANTS['ST_STD_CD_PAY_MEAN_CD_LOTTE_POINT']; // 롯데포인트
				$scope.DEPOSIT = LOTTE_CONSTANTS['ST_STD_CD_PAY_MEAN_CD_DEPOSIT']; // 회원보관금
				$scope.usePriceInfo = {};
				$scope.usePriceInfo.ordAmt = 0; // 판매가
				$scope.usePriceInfo.totDeliAmt = 0; // 배송비
				$scope.usePriceInfo.dlv_fvr_val = 0; // 무료배송권금액
				$scope.usePriceInfo.cbDiscOption = ""; // 할인권사용금액
				$scope.usePriceInfo.cbDupDiscOption = ""; // 추가할인권사용금액
				$scope.usePriceInfo.cbDupDiscOption = ""; // 추가할인권사용금액
				$scope.usePriceInfo.cbThirdDiscOption = ""; // 중복추가할인권사용금액
				$scope.usePriceInfo.usel_point_yn = false; // l-money사용
				$scope.usePriceInfo.usel_point = 0; // l-money사용금액
				$scope.usePriceInfo.uselt_point_yn = false; // l-point사용
				$scope.usePriceInfo.uselt_point = 0; // l-point사용금액
				$scope.usePriceInfo.usedeposit_yn = false; // 보관금사용
				$scope.usePriceInfo.usedeposit = 0; // 보관금사용금액
				$scope.usePriceInfo.smpDcAmt = 0; // 스마트픽

				$scope.cbDupDiscOption_desabled = false; // 중복할인 쿠폰 selectbox 비활성여부

				if ($scope.isBasicData) {
					$scope.reqParam.item_no = $scope.BasicData.product.item_no;
				}

				$scope.isPreCalculatorData = false;
				$scope.layerPopup_st_disp = false;

				// 미리계산 팝업 닫기
				$scope.closePopPreCalculator = function () {
					// console.log("close---");

					if ($scope.isPreCalculatorData) {
						$scope.dimmedClose();
					}

					$scope.isPreCalculatorData = false;
					$scope.layerPopup_st_disp = false;
				};

				// 미리계산 팝업 열기
				$scope.openPopPreCalculator = function () {
					$scope.sendTclick('m_DC_ProdDetail_Clk_Pop_2');

					if (!$scope.loginInfo.isLogin) { // 로그인 안한 경우 !$scope.loginInfo.isLogin 1111 테스트용으로 잠시 막음
						alert("로그인이 필요한 서비스입니다.");
						Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						return;
					}

					$scope.dimmedOpen({target:"pop_calculator", callback: this.closePopPreCalculator });
					$scope.layerPopup_st_disp = true;

					// if (!$scope.isPreCalculatorData) {
					$http.get(LotteCommon.productAheadCaculation, {params:$scope.reqParam})
					.success(function(data) {
						$scope.PreCalculatorData = data.max; // 정보 로드
						$scope.isPreCalculatorData = true;

						if ($scope.PreCalculatorData.free_shipping_yn == 'Y') {
							$scope.deliveryTitleCd="01";  // 배송비무료(플래티넘+ 회원)
						} else if ($scope.PreCalculatorData.tot_deli_amt < 1) {
							$scope.deliveryTitleCd="02";  // 배송비무료
						} else if ($scope.PreCalculatorData.dlv_fvr_val > 0) {
							$scope.deliveryTitleCd="03"; // 무료배송권사용
						} else {
							$scope.deliveryTitleCd="00"; // 배송비부과
						}

						// option desabled 용 속성추가
						if ($scope.PreCalculatorData.dis_list != null) {
							for (var i = 0; i < $scope.PreCalculatorData.dis_list.total_count; i++) {
								$scope.PreCalculatorData.dis_list.items[i].opt_desabled = false;
							}
						}

						if ($scope.PreCalculatorData.dup_lis_list!= null) {
							for (var i = 0; i < $scope.PreCalculatorData.dup_lis_list.total_count; i++) {
								$scope.PreCalculatorData.dup_lis_list.items[i].opt_desabled = false;
							}
						}

						if ($scope.PreCalculatorData.third_dis_list!= null) {
							for (var i = 0; i < $scope.PreCalculatorData.third_dis_list.total_count; i++) {
								$scope.PreCalculatorData.third_dis_list.items[i].opt_desabled = false;
							}
						}

						if ($scope.PreCalculatorData.point_list!= null) {
							for (var i = 0; i < $scope.PreCalculatorData.point_list.total_count; i++) {
								$scope.PreCalculatorData.point_list.items[i].opt_desabled = false;
							}
						}

						// $scope.exec_calculation();

						// 계산 초기화
						// $scope.usePriceInfo.totDeliAmt
						$scope.usePriceInfo.smpDcAmt = 0;
						$scope.usePriceInfo.usedeposit_yn = false;
						$scope.usePriceInfo.usel_point_yn = false;
						$scope.usePriceInfo.cbThirdDiscOption = "";
						$scope.usePriceInfo.cbDupDiscOption = "";
						$scope.usePriceInfo.cbDiscOption = "";
						$scope.usePriceInfo.useList = [];
						$scope.usePriceInfo.uselt_point_yn = false;
						$scope.usePriceInfo.ordAmt = Fnproductview.toNumber($scope.PreCalculatorData.ord_amt);
						// 배송비가 있는 경우만 배송비 세팅
						$scope.usePriceInfo.totDeliAmt = Fnproductview.toNumber($scope.PreCalculatorData.tot_deli_amt);

						if ($scope.usePriceInfo.totDeliAmt > 0 && $scope.PreCalculatorData.free_shipping_yn == "N") {
							// 무료배송권이 있는 경우
							if ($scope.PreCalculatorData.dlv_fvr_val > 0) {
								$scope.usePriceInfo.useList = [
									{"title":"배송비","addTp":"+","addAmt":$scope.usePriceInfo.totDeliAmt,"amtTitle":"원"},
									{"title":"무료배송권","addTp":"-","addAmt":$scope.PreCalculatorData.dlv_fvr_val,"amtTitle":"원"}
								];
								$scope.usePriceInfo.ordAmt = $scope.usePriceInfo.ordAmt + $scope.usePriceInfo.totDeliAmt - $scope.PreCalculatorData.dlv_fvr_val;
								$scope.usePriceInfo.dlv_fvr_val =  Fnproductview.toNumber($scope.PreCalculatorData.dlv_fvr_val);
								$scope.fvrSelect = true;
							} else {
								$scope.usePriceInfo.useList = [
									{"title":"배송비","addTp":"+","addAmt":$scope.usePriceInfo.totDeliAmt,"amtTitle":"원"}
								];
								$scope.usePriceInfo.ordAmt = $scope.usePriceInfo.ordAmt + $scope.usePriceInfo.totDeliAmt;
							}
						}
					})
					.error(function (ex) {
						console.log('Data Error : 상품미리계산기 로드 실패');

						if (ex.error.response_code == LOGIN_EXCEPTION) {
							alert("로그인이 필요한 서비스입니다.");
							Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						} else {
							alert("미리계산기에 필요한 정보를 읽지 못하였습니다." );
						}
					});
				};

				$scope.getDisTpTitle = function (s) {
						var rtnVal = "원 적립";

						if (s=="N") {
							rtnVal = "점 할인";
						}

						return rtnVal;
				};

				// 포인트 사용
				$scope.chgUse_point = function (tp,amt) {
					if (tp == $scope.L_POINT) {
						if ($scope.usePriceInfo.usel_point_yn) {
							$scope.usePriceInfo.usel_point = amt;
						} else {
							$scope.usePriceInfo.usel_point = 0;
						}
					}

					if (tp == $scope.LOTTE_POINT) {
							if ($scope.usePriceInfo.uselt_point_yn) {
								$scope.usePriceInfo.uselt_point = amt;
							} else {
								$scope.usePriceInfo.uselt_point = 0;
							}
					}

					if (tp == $scope.DEPOSIT) {
						if ($scope.usePriceInfo.usedeposit_yn) {
							$scope.usePriceInfo.usedeposit = amt;
						} else {
							$scope.usePriceInfo.usedeposit = 0;
						}
					}

					$scope.exec_calculation();
				};

				var getUseListItem = function (title,addTp, addAmt, amtTitle) {
					var useListItem = {};

					useListItem.title = title;
					useListItem.addTp = addTp;
					useListItem.addAmt = addAmt;
					useListItem.amtTitle = amtTitle;

					return useListItem;
				};

				// 계산기 초기화 (쿠폰구분, 쇼핑지원권여부, 중복쿠폰적용 불가 여부)
				$scope.calculator_init = function (div) {
					var obj_str = new Array(); // 하위 할인수단
					var disabled = new Array();
					var obj_nm, val_arr, tmp_prom, tmp_value;
					var point_yn = "N";
					var first_cpn = "0";
					var dup_amt = 0; // 2차 중복할인
					var dup_idx = -1; // 2차 중복쿠폰 위치
					var lump_amt = 0; // 3차 할인금액(일시불)

					if (div == "discount_one") {
						tmp_value = $scope.usePriceInfo.cbDiscOption;
					} else if (div == "discount_two") {
						tmp_value = $scope.usePriceInfo.cbDupDiscOption;
					} else if (div == "discount_three") {
						tmp_value = $scope.usePriceInfo.cbThirdDiscOption;
					}

					// 선택된 값의 구분 (금액|할인구분|쿠폰프로모션번호|적립여부)
					if (tmp_value.toString().indexOf("|") >= 0) {
						val_arr = tmp_value.split("|");
					}

					// console.log(div);
					// 현재 할인 수단 구분
					switch (div) {
						case "discount_one" :
							// 존재하는 하위 할인 수단만 등록
							$scope.usePriceInfo.cbDupDiscOption = "";
							$scope.usePriceInfo.cbThirdDiscOption = "";
							$scope.usePriceInfo.dup_amt = 0; // 2차 선택된 상태에서 1차 변경시 초기화(1차 선태에 따른 할인 다름에 따른 적용)

							// 2차 중복 할인 쿠폰 존재 시
							if ($scope.PreCalculatorData.dup_lis_list != null && $scope.PreCalculatorData.dup_lis_list.total_count > 0) {
								for (var i = 0; i < $scope.PreCalculatorData.dup_lis_list.total_count; i++) {
									var item = $scope.PreCalculatorData.dup_lis_list.items[i];

									if ($scope.usePriceInfo.cbDiscOption != null) {
										if (tmp_value != "") { // 1차쿠폰 사용 선택
											if (val_arr[1] == "27") { // 1차쿠폰 임직원 할인
												// console.log("--------");
												if (item.prom_mdcl_cd !="25") { // 스마트픽이라면
													item.opt_desabled = true; // 2차쿠폰 모두 막기
												}
											} else {
												item.opt_desabled = true; // 2차쿠폰 모두 막기
												tmp_prom = $scope.PreCalculatorData.multi_prom;
												first_cpn = (val_arr[2] == "0" ? val_arr[1] : val_arr[2]);

												if (item.prom_mdcl_cd=="25") { // 스마트픽이라면
													item.opt_desabled = false;
												} else if (item.prom_mdcl_cd=="30" && item.card_knd_cd!="") { // 중복카드 쿠폰
													if (val_arr[4] == "" || val_arr[4] == item.card_knd_cd) { // 카드할인쿠폰이 아니거나 같은 카드면
														item.opt_desabled = false;
													}
												} else {
													if (tmp_prom != undefined && tmp_prom != '') {
														for (var i = 0; i < tmp_prom.length; i++) {
															if (tmp_prom[i][0] == first_cpn && tmp_prom[i][1] == item.cpn_prom_no) {
																item.opt_desabled = false;
																break;
															}
														}
													}
												}
											}
										} else {
											item.opt_desabled = false;
										}
									}
								}
							}

							// 3차 일시불할인
							if ($scope.PreCalculatorData.third_dis_list != null && $scope.PreCalculatorData.third_dis_list.total_count > 0) {
								for (var i = 0; i < $scope.PreCalculatorData.third_dis_list.total_count; i++) {
									var item = $scope.PreCalculatorData.third_dis_list.items[i];

									if (tmp_value != undefined && tmp_value != "") { // 1차쿠폰 사용 선택
										if (val_arr[1]=="27") { // 1차쿠폰 임직원 할인
											if (item.prom_mdcl_cd!="25") { // 스마트픽이라면
												item.opt_desabled = true;
											}
										} else {
											item.opt_desabled = false;
										}
									} else {
										item.opt_desabled = false;
									}
								};
							}

							break;

						case "discount_two" :
							var one_value = "";
							var one_arr = "";
							var tmp_prom;
							var first_cpn = "0";

							// 존재하는 하위 할인 수단만 등록
							$scope.usePriceInfo.cbThirdDiscOption = "";

							// 1차 할인 쿠폰 사용여부 체크
							if ($scope.usePriceInfo.cbDiscOption != "") {
								one_arr = $scope.usePriceInfo.cbDiscOption.split("|");
							}

							if (val_arr != undefined && val_arr[1]=="25") { // 스마트픽이면
								dup_amt = 0;
							} else if (one_arr == "") { // 1차 쿠폰 사용 안함
								tmp_prom = $scope.PreCalculatorData.single_prom.split("|");

								if (tmp_prom != undefined && tmp_prom != "" && val_arr != undefined) {
									for (var i = 0; i < tmp_prom.length; i++) {
										var tmp_prom2 = tmp_prom[i].split(",");

										if (tmp_prom2[0] == "0" && tmp_prom2[1] == val_arr[2]) {
											dup_amt = tmp_prom2[2];
											break;
										}
									}
								}
							} else { // 1차 쿠폰 사용
								tmp_prom = $scope.PreCalculatorData.multi_prom.split("|");
								first_cpn = (one_arr[2]=="0"?one_arr[1]:one_arr[2]);

								if (tmp_prom != undefined && tmp_prom != "" && val_arr != undefined) {
									// 1차쿠폰이 카드일 경우 2차쿠폰이 카드 종류 체크
									for (var i = 0; i < tmp_prom.length; i++) {
										var tmp_prom2 = tmp_prom[i].split(",");

										if (tmp_prom2[0] == first_cpn && tmp_prom2[1] == val_arr[2]) {
											dup_amt = tmp_prom2[2];

											if (dup_amt < 1) { // 중복쿠폰 금액이 0이면 비활성화
												alert("죄송합니다. 추가할인 불가능 상품입니다.");
												$scope.usePriceInfo.cbDupDiscOption = "";
												$scope.cbDupDiscOption_desabled = true;
											}
											break;
										}
									}
								}
							}

							$scope.usePriceInfo.dup_amt = dup_amt;

							break;

						case "discount_three" :
							// 2차쿠폰 금액 읽기
							if (tmp_value != "") {
								$scope.usePriceInfo.lump_amt = val_arr[0];
							}

							break;

						case "dlv_fvr_val" : // 무료배송권
							break;

						case "smp_dc_amt" : // 스마트픽 할인
							// console.log("---------------");
							// $scope.usePriceInfo.smpDcAmt = 10;
							// 2차쿠폰 금액 읽기
							// if (tmp_value != "") {
								// $scope.usePriceInfo.lump_amt = val_arr[0];
							// }
							break;

						default :
							break;
					}

					// 포인트 초기화
					if (point_yn == "N") {
						// 2차 쿠폰 금액
						if ($scope.PreCalculatorData.point_list != null && $scope.PreCalculatorData.point_list.total_count > 0) {
							for (var i = 0; i < $scope.PreCalculatorData.point_list.total_count; i++) {
								var item = $scope.PreCalculatorData.point_list.items[i];

								if (item.point_div == $scope.L_POINT) {
									$scope.usePriceInfo.usel_point_yn = false;
								} else if (item.point_div == $scope.LOTTE_POINT) {
									$scope.usePriceInfo.uselt_point_yn = false;
								} else if (item.point_div == $scope.DEPOSIT) {
									$scope.usePriceInfo.useable_point = false;
								}

								item.opt_desabled = false;

								if (div=="discount_three" && tmp_value!="" && val_arr[1]=="35" && item.point_div != $scope.DEPOSIT) { // 3차 일시불 쿠폰 사용하고 보관금이 아니면
									item.opt_desabled = true;
								}
							}
						}
					}

					$scope.exec_calculation(); // 계산실행
				};

				// 미리계산 실행
				$scope.exec_calculation = function () {
					$scope.usePriceInfo.useList = [];
					// $scope.usePriceInfo.smpDcAmt=0; //스마트픽상품 할인금액(3-2차 스마트픽 프로젝트  추가)

					var tmp_val = "";
					var tbody_contents = "";
					var third_contents = "";
					var discount_arr = ["discount_one", "discount_two", "discount_three"];

					$scope.usePriceInfo.ordAmt = Fnproductview.toNumber($scope.PreCalculatorData.ord_amt);
					$scope.usePriceInfo.totDeliAmt = Fnproductview.toNumber($scope.PreCalculatorData.tot_deli_amt);

					// 플래티넘이면 배송비 0
					if ($scope.usePriceInfo.totDeliAmt > 0 && $scope.PreCalculatorData.free_shipping_yn == "Y") {
						$scope.usePriceInfo.totDeliAmt = 0;
					}

					// 배송비 포함
					if ($scope.usePriceInfo.totDeliAmt > 0) {
						$scope.usePriceInfo.useList.push(getUseListItem("배송비","+",$scope.usePriceInfo.totDeliAmt,"원"));
						$scope.usePriceInfo.ordAmt += $scope.usePriceInfo.totDeliAmt;
					}

					// 무료 배송권 사용
					if ($scope.usePriceInfo.totDeliAmt > 0 && $scope.usePriceInfo.dlv_fvr_val > 0) {
						$scope.usePriceInfo.useList.push(getUseListItem("무료배송권","-",$scope.usePriceInfo.dlv_fvr_val,"원"));
						$scope.usePriceInfo.ordAmt -= $scope.usePriceInfo.dlv_fvr_val;
					}

					// 할인 적용
					if ($scope.usePriceInfo.cbDiscOption != "") {
						var tmp_val = $scope.usePriceInfo.cbDiscOption.split("|");

						if (tmp_val[3]!="Y" && parseInt(tmp_val[0]) > 0) { // 적립 쿠폰이 아닌 경우 금액 차감 (중복할인은 금액이 0이기 때문에 반영 안됨)
							$scope.usePriceInfo.ordAmt -= parseInt(tmp_val[0]);
							$scope.usePriceInfo.useList.push(getUseListItem(tmp_val[1]=="25"?'스마트픽':'할인금액',"-",tmp_val[0],"원"));
						}
					}
					if ($scope.usePriceInfo.cbDupDiscOption != "") {
						var tmp_val = $scope.usePriceInfo.cbDupDiscOption.split("|");

						if (tmp_val[3]!="Y" && parseInt(tmp_val[0]) > 0) { // 적립 쿠폰이 아닌 경우 금액 차감 (중복할인은 금액이 0이기 때문에 반영 안됨)
							$scope.usePriceInfo.ordAmt -= parseInt(tmp_val[0]);
							$scope.usePriceInfo.useList.push(getUseListItem(tmp_val[1]=="25"?'스마트픽':'할인금액',"-",tmp_val[0],"원"));
						}
					}
					if ($scope.usePriceInfo.cbThirdDiscOption != "") {
						var tmp_val = $scope.usePriceInfo.cbThirdDiscOption.split("|");

						if (tmp_val[3]!="Y" && parseInt(tmp_val[0]) > 0) { // 적립 쿠폰이 아닌 경우 금액 차감 (중복할인은 금액이 0이기 때문에 반영 안됨)
							$scope.usePriceInfo.ordAmt -= parseInt(tmp_val[0]);
							$scope.usePriceInfo.useList.push(getUseListItem("일시불할인","-",tmp_val[0],"원"));
						}
					}

					// 중복할인 적용
					if ($scope.usePriceInfo.dup_amt > 0) {
						$scope.usePriceInfo.ordAmt -= $scope.usePriceInfo.dup_amt;
						$scope.usePriceInfo.useList.push(getUseListItem("추가할인","-",$scope.usePriceInfo.dup_amt,"원"));
					}

					if ($scope.usePriceInfo.smpDcAmt > 0) {
						$scope.usePriceInfo.ordAmt -= $scope.usePriceInfo.smpDcAmt;
						$scope.usePriceInfo.useList.push(getUseListItem("스마트픽할인","-",$scope.usePriceInfo.smpDcAmt,"원"));
					}

					// 일시불할인 적용
					if (third_contents != "") {
						tbody_contents += $scope.usePriceInfo.third_contents;
					}

					// L_money포인트 적용
					var totPoint = $scope.usePriceInfo.usel_point + $scope.usePriceInfo.uselt_point + $scope.usePriceInfo.usedeposit ;

					if ($scope.usePriceInfo.usel_point_yn) {
						var tmp_amt = $scope.usePriceInfo.usel_point;

						if ($scope.usePriceInfo.ordAmt < tmp_amt) {
							tmp_amt = $scope.usePriceInfo.ordAmt;
							$scope.usePriceInfo.ordAmt = 0;
						} else {
							$scope.usePriceInfo.ordAmt -= tmp_amt;
						}

						if (tmp_amt > 0) {
							$scope.usePriceInfo.useList.push(getUseListItem("L-money","-",tmp_amt,"원"));
						}
					}

					// L_포인트 적용
					if ($scope.usePriceInfo.uselt_point_yn) {
						var tmp_amt = $scope.usePriceInfo.uselt_point;

						if ($scope.usePriceInfo.ordAmt < tmp_amt) {
							tmp_amt = $scope.usePriceInfo.ordAmt;
							$scope.usePriceInfo.ordAmt = 0;
						} else {
							$scope.usePriceInfo.ordAmt -= tmp_amt;
						}

						if (tmp_amt > 0) {
							$scope.usePriceInfo.useList.push(getUseListItem("L.POINT","-",tmp_amt,"원"));
						}
					}

					// 보관금
					if ($scope.usePriceInfo.usedeposit_yn) {
						var tmp_amt = $scope.usePriceInfo.usedeposit;

						if ($scope.usePriceInfo.ordAmt < tmp_amt) {
							tmp_amt = $scope.usePriceInfo.ordAmt;
							$scope.usePriceInfo.ordAmt = 0;
						} else {
							$scope.usePriceInfo.ordAmt -= tmp_amt;
						}

						if (tmp_amt > 0) {
							$scope.usePriceInfo.useList.push(getUseListItem("보관금","-",tmp_amt,"원"));
						}
					}

					// console.log($scope.usePriceInfo.cbDiscOption + " : $scope.usePriceInfo.cbDiscOption");
				};
			}
		};
	}]);

	// Directive :: 상품이미지 정보
	app.directive('imagelist', ['$window', '$location', function ($window, $location) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/imagelist.html',
			replace: true,
			link: function ($scope, el, attrs) {
				console.log('imagelist', 'called');
			}
		};
	}]);

	// Directive :: 상품vod 정보
	app.directive('productVodInfo', ['$window', '$location', function ($window, $location) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/product_vod_info.html',
			replace: true,
			link: function ($scope, el, attrs) {
				console.log('productVodInfo', 'called');
			}
		};
	}]);

	// Directive :: 상품vod 정보
	app.directive('smpDeskInfo', ['$window', '$location', function ($window, $location) {
		return {
			templateUrl: '/lotte/resources_dev/product/m/smp_desk_info.html',
			replace: true,
			link: function ($scope, el, attrs) {
				console.log('productVodInfo', 'called');
			}
		};
	}]);

	// :::::::::::::::::::  20151205  박형윤 여기까지 코드 정리 완료

	////////////////////////////////////////////////////////
	///// 상품 상세 js start
	////////////////////////////////////////////////////////
	// 전체 Controller
	app.controller('ProductDetailCtrl', ['$scope','$window', '$http', '$routeParams', '$location', 'LotteCommon','Fnproductview','commInitData','LotteUtil','LotteStorage',function($scope,$window, $http,$routeParams, $location, LotteCommon,Fnproductview,commInitData,LotteUtil,LotteStorage) {
		
            //console.log('ProductDetailCtrl call start');

			$scope.reqDetailParam = {
				upCurDispNo : Fnproductview.objectToString(commInitData.query['upCurDispNo']), // 상위 카테고리번호
				dispDep : Fnproductview.objectToString(commInitData.query['dispDep']),
				curDispNo : Fnproductview.objectToString(commInitData.query['curDispNo']),
				goods_no : Fnproductview.objectToString(commInitData.query['goods_no']) ,
				wish_lst_sn : Fnproductview.objectToString(commInitData.query['wish_lst_sn']),
				cart_sn : Fnproductview.objectToString(commInitData.query['cart_sn']),
				item_no : Fnproductview.objectToString(commInitData.query['item_no']),
				genie_yn : Fnproductview.objectToString(commInitData.query['genie_yn']),
				cn : Fnproductview.objectToString(commInitData.query['cn']),
				cdn : Fnproductview.objectToString(commInitData.query['cdn']),
				curDispNoSctCd : Fnproductview.objectToString(commInitData.query['curDispNoSctCd']),
				tclick : Fnproductview.objectToString(commInitData.query['tclick']),
				page : Fnproductview.objectToString(commInitData.query['page']),
				sort: Fnproductview.objectToString(commInitData.query['sort']),
				siteNo: Fnproductview.objectToString(commInitData.query['siteNo']),
				usm_goods_no: Fnproductview.objectToString(commInitData.query['usm_goods_no']),
				guestArrList:[]
			};
			$scope.reqDetailParamStr = $scope.baseParam;

			if ($scope.reqDetailParam.curDispNoSctCd != null) {
				$scope.reqDetailParamStr += "&curDispNoSctCd="+$scope.reqDetailParam.curDispNoSctCd;
			}

			if ($scope.reqDetailParam.curDispNo != null) {
				$scope.reqDetailParamStr += "&curDispNo="+$scope.reqDetailParam.curDispNo;
			}

			if ($scope.reqDetailParam.goods_no != null) {
				$scope.reqDetailParamStr += "&goods_no="+$scope.reqDetailParam.goods_no;
			}

			if ($scope.reqDetailParam.usm_goods_no != null) {
				$scope.reqDetailParamStr += "&usm_goods_no="+$scope.reqDetailParam.usm_goods_no;
			}

			$scope.productInfotabIdx = 0;

			// 외부에서 탭의 위치를 변경 가능
			if (commInitData.query['tabIdx'] != undefined) {
				$scope.productInfotabIdx = parseInt(commInitData.query['tabIdx']);

				// 상품평이면 무조건 스크롤
				if ($scope.productInfotabIdx == '1') {
					$scope.dimmedClose(); //팝업창 닫구

					setTimeout(function () {
						$('body').animate({"scrollTop": ($(".detailInfoCnt").offset().top - 85)+"px"}, 500);
					}, 1000);
				}
	    	}else{ //20161004 기본 스크롤
				setTimeout(function () {
					$('body').animate({"scrollTop": ($("#head_sub").offset().top + 1) + "px"}, 500);
				}, 500);                
            }
            
            //20160121 Q&A 탭으로 바로가기 
            if(LotteStorage.getSessionStorage("qnaBack") == "true"){
				// Q&A
				$scope.productInfotabIdx = '2';
				$scope.dimmedClose(); //팝업창 닫구

				setTimeout(function () {
                    //데이타 호출
                    $scope.selectedItem = LotteStorage.getSessionStorage("qnaguest");
                    $scope.getFaqListPaging(0, LotteStorage.getSessionStorage("qnaguest"), "S");
                    //화면 스크롤 
                    $('body').animate({"scrollTop": ($(".detailInfoCnt").offset().top - 85)+"px"}, 500);
                    LotteStorage.setSessionStorage("qnaBack", "");
				}, 1000);                
            }
			$scope.productInfotabUrl = "";
			$scope.prdZoomImg = "";
			$scope.SaleBestData="";

			// CommentViewList paging 테스트
			$scope.CommentViewList = [];
			$scope.CommentViewCurrnetPage = 1;  // 상품평 현재페이지

			$scope.mdNoticeAccordionYn = true; // MD공지 아코디언 20160309
			$scope.mdTipAccordionYn = true; // MD팁 아코디언

			// CommentViewList paging 테스트
			$scope.FaqList = [];
			$scope.FaqListPage = 1; // faq 현재페이지

			$scope.goods_no_auto_set_yn =""; // 모아보기 넘버 숫자 유무
			$scope.imgDomainUrl; //이미지경로

			var v_img_url = LotteUtil.getImagePath('');

			if (v_img_url.length > 0) {
				$scope.imgDomainUrl = v_img_url.substr(0,v_img_url.length-1);
			}

			//console.log('$scope.imgDomainUrl',$scope.imgDomainUrl);

			$scope.loadingTabData = function (idx) {
				$scope.sendTclick( 'm_DC_ProdDetail_Clk_tap_' + ( idx + 1 ) );
				$scope.productInfotabIdx = idx;
				//console.log('productInfotabIdx', $scope.productInfotabIdx+"|"+$scope.BasicData.goods_cmps_cd);

				switch (idx) {
					case 0:
						$scope.productInfotabUrl=LotteCommon.productProductDetailData; // 상품상세
						break;
					case 1:
						$scope.productInfotabUrl=LotteCommon.commentCommentViewMobileData; 
                        $scope.BasicData.product.gift_check = true; 
                        $scope.reqDetailParam.gift_review = "N";     					
                        break;
					case 2:
						$scope.productInfotabUrl=LotteCommon.commentProductQuestListMobileData; // [상품상세]faq List
						break;
					case 3:
						$scope.productInfotabUrl=LotteCommon.productProductItemInfoData; // [상품상세]상품정보
						break;
				}

				if (idx < 4) {
					$scope.reqDetailParam.usm_goods_no = $scope.BasicData.product.usm_goods_no;
					$scope.reqDetailParam.curDispNo = $scope.reqParam.curDispNo;
					$scope.reqDetailParam.item_no = $scope.reqParam.item_no;
					$scope.reqDetailParam.page = 1;
					$scope.reqDetailParam.goods_no = $scope.BasicData.goods_no;
					$scope.reqDetailParam.goods_cmps_cd = $scope.BasicData.goods_cmps_cd;
                    console.log($scope.productInfotabUrl);
					$http.get($scope.productInfotabUrl, {params:$scope.reqDetailParam}) // $scope.reqParam
					.success(function (data) {
						switch(idx) {
							case 0:
								$scope.func_Tab0(idx,data);
								break;
							case 1:
								$scope.func_Tab1(idx,data);
								break;
							case 2:
								$scope.func_Tab2(idx,data);
								break;
							case 3:
								$scope.func_Tab3(idx,data);
								break;
						}
					})
					.error(function() {
						console.log('Data Error : 상품상세 정보 로드 실패 ', $scope.productInfotabUrl);
					});
				}

				// 구매정보 일경우 데이터만 보여주고 있는 데이터 보이는 화면 처리만 ajax는 필요 없음
				if ($scope.SaleBestData == "") {
					$scope.func_SaleBestData();
                    //추천기획전 20161027
                    setTimeout(function(){
                        $scope.func_planBanner();    
                    }, 500);
                    
				}
			};


				// 상품설명tab0
				$scope.func_Tab0 = function(idx,data){
					// md_ntc_fcont: EL
					// md_ntc_fcont1: BO
					// md_ntc_fcont2: PO

					var arrChkStr = ['<p>&nbsp;</p>', '<p><br>&nbsp;</p>', '<p><br />&nbsp;</p>', '<br />', '<br>', 'null'];
					for ( var i = 0; i < arrChkStr.length; ++i ) {
						if ( $.trim( $scope.BasicData.product.md_ntc_fcont2 ).indexOf( arrChkStr[i] ) > -1 ) {
							$scope.BasicData.product.md_ntc_fcont2 = '';
							if ( !$scope.BasicData.product.md_ntc_fcont1 ) {
								$scope.BasicData.product.md_ntc_fcont1 = '';
							}
						}
					}

					setTimeout(function(){
						$scope.BasicData.product.md_ntc_fcont1 = Fnproductview.replaceAll($scope.BasicData.product.md_ntc_fcont1, "&#34;", "'");
						$scope.BasicData.product.md_ntc_fcont1 = Fnproductview.replaceAll($scope.BasicData.product.md_ntc_fcont1, "\r\n", "");
						$("#mdNoti2").html($scope.BasicData.product.md_ntc_fcont1);

						$scope.BasicData.product.md_ntc_fcont2 = Fnproductview.replaceAll($scope.BasicData.product.md_ntc_fcont2, "&#34;", "'");
						$scope.BasicData.product.md_ntc_fcont2 = Fnproductview.replaceAll($scope.BasicData.product.md_ntc_fcont2, "\r\n", "");
						$("#mdNoti3").html($scope.BasicData.product.md_ntc_fcont2);
					}, 300);

					if (data.result) {
						$scope.PrdExplainData = data.result; //상품기본정보 로드
						$scope.isPrdExplainData = true;
						  //$scope.PrdExplainData.goods_no_auto_set_yn='Y';
						  //$scope.PrdExplainData.goods_info_auto_prt_yn='Y';
						  //$scope.PrdExplainData.spdp_shp_goods_tmpl_cd = 'B'

						setTimeout(function(){
							if($scope.PrdExplainData.lwnd_sumr_fcont != null){
								$scope.PrdExplainData.lwnd_sumr_fcont = Fnproductview.replaceAll($scope.PrdExplainData.lwnd_sumr_fcont, "&#34;", "'");
								$scope.PrdExplainData.lwnd_sumr_fcont = Fnproductview.replaceAll($scope.PrdExplainData.lwnd_sumr_fcont, "\r\n", "");
								$("#lwnd_sumr_c").html($scope.PrdExplainData.lwnd_sumr_fcont);
							}
							if($scope.PrdExplainData.uptn_sumr_fcont != null){
								$scope.PrdExplainData.uptn_sumr_fcont = Fnproductview.replaceAll($scope.PrdExplainData.uptn_sumr_fcont, "&#34;", "'");
								$scope.PrdExplainData.uptn_sumr_fcont = Fnproductview.replaceAll($scope.PrdExplainData.uptn_sumr_fcont, "\r\n", "");
								$("#uptn_sumr_c").html($scope.PrdExplainData.uptn_sumr_fcont);
							}
							//옵션 팝업 안내
							//($scope.PrdExplainData.uptn_sumr_fcont == null || $scope.PrdExplainData.uptn_sumr_fcont == '' || $scope.PrdExplainData.uptn_sumr_fcont == undefined) &&
							if( $scope.BasicData.product.select_goods_list.total_count > 0 && $scope.PrdExplainData.select_products != null ) {
								$scope.brieflyPop({target : "optionPop"});
							}
						}, 300);

						if($scope.PrdExplainData.spdp_shp_goods_tmpl_cd == "A"){
							$scope.PrdExplainData.goods_no_auto_set_yn='Y';
							$scope.PrdExplainData.goods_info_auto_prt_yn='Y';
							$scope.scopeBasicDataChange($scope.PrdExplainData,$scope.PrdExplainData.spdp_shp_goods_tmpl_cd );
							setTimeout(function(){
								for(var i=0; i<$scope.PrdExplainData.select_products.total_count; i++){
									if($scope. PrdExplainData.select_products.items[i].uptn_desc_fcont != null){
										$scope.PrdExplainData.select_products.items[i].uptn_desc_fcont = Fnproductview.replaceAll($scope.PrdExplainData.select_products.items[i].uptn_desc_fcont,"&#34;", "'");
										$scope.PrdExplainData.select_products.items[i].uptn_desc_fcont = Fnproductview.replaceAll($scope.PrdExplainData.select_products.items[i].uptn_desc_fcont,"\r\n", "");
										$("#det_up_" + i).html($scope.PrdExplainData.select_products.items[i].uptn_desc_fcont);
									}
									if($scope.PrdExplainData.select_products.items[i].lwnd_desc_fcont != null){
										$scope.PrdExplainData.select_products.items[i].lwnd_desc_fcont = Fnproductview.replaceAll($scope.PrdExplainData.select_products.items[i].lwnd_desc_fcont,"&#34;", "'");
										$scope.PrdExplainData.select_products.items[i].lwnd_desc_fcont = Fnproductview.replaceAll($scope.PrdExplainData.select_products.items[i].lwnd_desc_fcont,"\r\n", "");
										$("#det_down_" + i).html($scope.PrdExplainData.select_products.items[i].lwnd_desc_fcont);
									}
								}
							}, 500);


						}else if($scope.PrdExplainData.spdp_shp_goods_tmpl_cd == "B"){
							$scope.scopeBasicDataChange($scope.PrdExplainData,$scope.PrdExplainData.spdp_shp_goods_tmpl_cd );
						}else{
							$scope.scopeProductDetailDefault();
						}
					}else{
						$scope.scopeProductDetailDefault();
					}
					//el.html($scope.PrdExplainData);
					//tab css 적용 필요 on off
					};

					$scope.scopeProductDetailDefault = function(){
						$scope.PrdExplainData = $scope.BasicData.product.dtl_info_fcont; //상품기본정보 로드
						$scope.isPrdExplainData = true;
						//console.log('$scope.PrdExplainData',$scope.PrdExplainData);

						//네스프레스 script 테스트
						//var html = $scope.PrdExplainData.replace(/<script/gi,"<noscript").replace(/<\/script/gi,"</noscript");
						var html = $scope.PrdExplainData;
						$scope.prdZoomImg= html;
						$scope.lodomain= LotteCommon.productProductImgData+"?"+$scope.reqDetailParamStr;
						//console.log('$scope.lodomain',$scope.lodomain);
						$("#detailLayout").html(html);
						$("#detailLayout").find("object").remove();
						$("#detailLayout").find("embed").remove();

						// 20151121 박형윤 사이즈 조견표 및 Iframe 처리 추가
						$("#detailLayout iframe").lotteMOPrdDetailWrapper({arrowTopPos:50});
						$("#detailLayout #sizeGuideTable .tabel_list_wrap >table").lotteMOPrdDetailWrapper({arrowTopPos:50});
				};

				// 20151121 박형윤 사이즈 조견표 및 Iframe 처리 추가
				$.fn.lotteMOPrdDetailWrapper = function (options) {
					var opts = $.extend({
						wrapperGap : 0,
						arrowAnimateTime : 1000,
						arrowMiddleFlag : false,
						arrowTopPos : 0
					}, options);

					return this.each(function () {
						var self = this,
							$self = $(self),
							$win = $(window),
							$wrap = $('<div class="prddetail_scrollwrap"></div>'),
							$scrollBox = $('<div class="prddetail_scrollbox"></div>'),
							$l_arrow = $('<span class="scroll_arrow left">&lt;</span>'),
							$r_arrow = $('<span class="scroll_arrow right">&gt;</span>'),
							wrapperGap = opts.wrapperGap,
							arrowAnimateTime = opts.arrowAnimateTime,
							arrowMiddleFlag = opts.arrowMiddleFlag,
							arrowTopPos = opts.arrowTopPos,
							contentWidth = 0,
							contentHeight = 0,
							winWidth = 0,
							selfWidth = 0;

						function init() {
							wrappingDOM();
							addEvent();
						}

						// IFrame Div로 감싸기
						function wrappingDOM() {
							$self.after($wrap);
							$wrap.append($scrollBox.append($self), $l_arrow, $r_arrow);

							winResize();
							showScrollArrow();
						}

						function showScrollArrow() {
							var scrollLeft = $scrollBox.scrollLeft();

							if (scrollLeft > 5) {
								$l_arrow.stop().css("opacity", 0).show().animate({opacity:1}, arrowAnimateTime);
								$wrap.addClass("left_scroll");
							} else {
								$wrap.removeClass("left_scroll");
								$l_arrow.hide();
							}

							if (scrollLeft + 5 < contentWidth - $scrollBox.width()) {
								$r_arrow.stop().css("opacity", 0).show().animate({opacity:1}, arrowAnimateTime);
								$wrap.addClass("right_scroll");
							} else {
								$wrap.removeClass("right_scroll");
								$r_arrow.hide();
							}
						}

						// Resize Event Handler
						function winResize() {
							if (winWidth == $win.width()) {
								return false;
							}

							winWidth = $win.width();
							contentWidth = $self.outerWidth();
							contentHeight = $self.outerHeight();

							if (arrowMiddleFlag) {
								$l_arrow.css("top", contentHeight / 2 - $l_arrow.height() / 2);
								$r_arrow.css("top", contentHeight / 2 - $r_arrow.height() / 2);
							} else {
								$l_arrow.css("top", arrowTopPos);
								$r_arrow.css("top", arrowTopPos);
							}

							if ($self.width() > winWidth - wrapperGap) {
								$scrollBox.attr("style", "max-width:100%;overflow-x:scroll;width:" + (winWidth - wrapperGap) + "px !important");
								$l_arrow.show();
								$r_arrow.show();
							} else {
								$scrollBox.removeAttr("style");
								$l_arrow.hide();
								$r_arrow.hide();
							}
						}

						function addEvent() {
							$win.on("resize", winResize);
							$scrollBox.on("scroll", showScrollArrow);
						}

						init();
					});
				};

				//정보입력형일 경우 BasicData.product.select_goods_list 값 중에 금액/할인율
				$scope.scopeBasicDataChange = function(data,type){
						if(data){
								//console.log(data);
								var forItems = $scope.BasicData.product.select_goods_list.items;
								var copyPrdExplainData = $scope.PrdExplainData;
								var idx = 0;
								for(var j= 0;j <data.select_products.items.length ; j++){
										var item = data.select_products.items[j];
										if(forItems != null && forItems.length > 0 ){
												var tempItem = Fnproductview.getObjListKey(forItems,"goods_no",item.tgt_goods_no);
												if(tempItem){
														item.sale_prc = tempItem.sale_prc;
														item.immed_pay_dscnt_amt = tempItem.immed_pay_dscnt_amt;
														if(type == "A"){ //정보입력형은 대표이미지 정보를 가져 온다.
																item.spdp_shp_img_file_path_nm = '';
																item.spdp_shp_img_file_nm = tempItem.img_url0;  // 280 사이즈
														}
												}
										}
										var img_conts_list = [];
										if (item.product_conts != null && item.product_conts.total_count > 0){
												for(var i=0; i < item.product_conts.total_count; i++){
														var img_item1 = {};
														if (Fnproductview.isEmpty(item.product_conts.items[i].img_file_2_nm)){
																img_item1.img_disp_type = '1';
														} else {
																img_item1.img_disp_type = '2';
														}
														img_item1.idx = idx;
														img_item1.dtl_conts_sn = item.product_conts.items[i].dtl_conts_sn;
														img_item1.img_file_desc = item.product_conts.items[i].img_file_1_desc;
														img_item1.img_file_nm = item.product_conts.items[i].img_file_1_nm;
														img_item1.img_file_path_nm = item.product_conts.items[i].img_file_1_path_nm;
														img_conts_list.push(img_item1);
														idx = idx+1;
														if (!Fnproductview.isEmpty(item.product_conts.items[i].img_file_2_nm)){
																var img_item2= {};
																img_item2.img_disp_type = '2';
																img_item2.idx = idx;
																img_item2.dtl_conts_sn = item.product_conts.items[i].dtl_conts_sn;
																img_item2.img_file_desc = item.product_conts.items[i].img_file_2_desc;
																img_item2.img_file_nm = item.product_conts.items[i].img_file_2_nm;
																img_item2.img_file_path_nm = item.product_conts.items[i].img_file_2_path_nm;
																img_conts_list.push(img_item2);
																idx = idx+1;
														}
												}
										}
										data.select_products.items[j].img_conts_list = img_conts_list;
								}
								//console.log('data',data);
						}
				};
				// 상품평 tab1
				$scope.func_Tab1 = function(idx,data){
						$scope.PrdCommentData = data.data_set; //상품평
						$scope.isPrdCommentData = true;
						$scope.CommentViewList = (data.data_set.product_review != null) ? data.data_set.product_review.items : []; //상품평 페이징
						//$scope.goods_no = $scope.BasicData.product.select_goods_list.items[0].goods_no +"^"+ $scope.BasicData.product.select_goods_list.items[0].usm_goods_no;
						//$scope.getCommentViewListPaging(0,'S',$scope.goods_no);
				};
				// 상품평 tab2
				$scope.func_Tab2 = function(idx,data){
						$scope.FAQData = data.data_set; //Q&A
						$scope.isFAQData = true;
						$scope.FaqList = (data.data_set.product_quest != null) ? data.data_set.product_quest.items : []; //상품평 페이징
						//$scope.goods_no = $scope.BasicData.product.select_goods_list.items[0].goods_no +"^"+ $scope.BasicData.product.select_goods_list.items[0].usm_goods_no;
						//$scope.getFaqListPaging(0,$scope.goods_no,'S');
						//$scope.isPrdExplainData = true;
				};

				// 상품 tab3
				$scope.func_Tab3 = function(idx,data){
						$scope.ItemInfo = data.result; //
						if($scope.BasicData.product.select_goods_list.items != null){
							$scope.goods_no = $scope.BasicData.product.select_goods_list.items[0].goods_no +"^"+ $scope.BasicData.product.select_goods_list.items[0].usm_goods_no;
							$scope.productTabChange(3,$scope.goods_no);
						}
						//$scope.selectedItem = $scope.BasicData.product.select_goods_list.items[0].goods_no;

						//$scope.isPrdExplainData = true;
				};
				/*
				$scope.prdZoom = function() {
						if ($scope.prdZoomImg != undefined || $scope.prdZoomImg != "") {

						}else{
								console.log('상품이미지가 없습니다.');
						}
				};
				*/
				$scope.prdZoom = function () {
							var modalInstance = window.open({
									templateUrl:'/lotte/resources_dev/product/prdZoomPop.html',
									replace:true,
									link : function(){
										console.log('prdZoom', 'called');
								}
							});
				};
                //기획전추천 20161027
                $scope.func_planBanner = function(){
                    //prsn_list
						var viewSaleBestLink = "http://rb-rec-api-apne1.recobell.io/rec/a101?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+$scope.reqDetailParam.goods_no;
						$.ajax({
								type: 'post'
								, async: true
								, url: viewSaleBestLink
								, dataType  : "jsonp"
								, success: function(data) {                                    
                                    var logrecom_view_result = new Array();

                                    if(data.results != null){
                                        $(data.results).each(function(i, val) {
                                            logrecom_view_result.push(val.itemId);
                                        });
                                    }
                                    //console.log(logrecom_view_result);
                                    //실시간 맞춤 추천 상품 Data Load
                                    var httpConfig = {
                                        method: "get",
                                        url: LotteCommon.prsn_list,
                                        params: {
                                            spdp_no_list : logrecom_view_result.join(","),
                                            goods_no : $scope.reqDetailParam.goods_no                                        
                                        }
                                    };

                                    $http(httpConfig) // 실제 탭 데이터 호출
                                    .success(function (data) {
                                        $scope.prsnData = data.banner_list;
                                    });    
                                  }
                        });
                        
                }

				//뭘 봤지?뭘싸지 기획전
				$scope.func_SaleBestData = function() {
						//엘롯데 "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/r002?size=10&format=jsonp&cuid=5dfabb12-dae3-4a56-a123-c097dadbca58&iids=<%=goods_no%>",
						//console.log('func_saleBestData1',$scope.reqParam);
						//var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/r002?size=10&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+$scope.reqDetailParam.goods_no;
						var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/a002?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+$scope.reqDetailParam.goods_no;

						$.ajax({
								type: 'post'
								, async: true
								, url: viewSaleBestLink
								, dataType  : "jsonp"
								, success: function(data) {
										var logrecom_view_result = new Array();
										var v_guestArr = new Array();
										if(data.results != null){
											$(data.results).each(function(i, val) {
													logrecom_view_result.push(val.itemId);
											});
											v_guestArr=Fnproductview.logrecom_type_view_jsonp({"items" : logrecom_view_result});
										}
										 $scope.reqDetailParam.goodsRelList=v_guestArr;
										 $scope.reqDetailParam.disp_no = $scope.BasicData.product.mast_disp_no;
										$http.get(LotteCommon.productProductSalebestData, {params:$scope.reqDetailParam})
										.success(function(data) {
												//console.log('func_saleBestData2',data.max);
												$scope.SaleBestData = data.max;
										})
										.error(function() {
												 console.log('Data Error : saleBestData로드 실패');
										});
								}
								, error: function(data, status, err) {
										$scope.reqParam.disp_no = $scope.BasicData.product.mast_disp_no;
										$http.get(LotteCommon.productProductSalebestData, {params:$scope.reqParam})
										.success(function(data) {
												//console.log('func_saleBestData2',data.max);
												$scope.SaleBestData = data.max;
										})
										.error(function() {
												 console.log('Data Error : saleBestData로드 실패');
										});
								}
						});
				/*
						$http.get(viewSaleBestLink)
						.success(function(data) {
								var logrecom_view_result = new Array();
								$(data.results).each(function(i, val) {
										logrecom_view_result.push(val.itemId);
								});
								var v_guestArr = new Array();

								v_guestArr=Fnproductview.logrecom_type_view_jsonp({"items" : logrecom_view_result});

								 $scope.reqDetailParam.guestArrList=v_guestArr;
								 $scope.reqDetailParam.disp_no = $scope.BasicData.product.mast_disp_no;
								$http.get(LotteCommon.productProductSalebestData, {params:$scope.reqDetailParam})
								.success(function(data) {
										console.log('func_saleBestData2',data.max);
										$scope.SaleBestData = data.max;
								})
								.error(function() {
										 console.log('Data Error : saleBestData로드 실패');
								});
						})
						.error(function() {
								$scope.reqParam.disp_no = $scope.BasicData.product.mast_disp_no;
								$http.get(LotteCommon.productProductSalebestData, {params:$scope.reqParam})
								.success(function(data) {
										console.log('func_saleBestData2',data.max);
										$scope.SaleBestData = data.max;
								})
								.error(function() {
										 console.log('Data Error : saleBestData로드 실패');
								});
						});
				*/
				};
                /*20160929 상품평추천*/
                $scope.recomm_click = function(item){
                    if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
								Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
				    }else{
                        $http.get("/json/comment/comment_recomm_write.json?gdas_no="+item.gdas_no+"&goods_no=" +  $scope.reqDetailParam.goods_no)
                        .success(function(data) {
                            if (data.result == "reg_success") { // 추천완료
                                alert("추천하셨습니다.");
                                item.recomm_cnt += 1;
                                $("#recomm_" + item.gdas_no).addClass("on");                        
                            }else if (data.result == "reg_clv_success") { // 클로버 적립 
                                alert("추천하셨습니다.\n클로버 20개 적립되었습니다.\nID당 1일 3회까지 지급됩니다."); 
                                item.recomm_cnt += 1;
                                $("#recomm_" + item.gdas_no).addClass("on");                                                        
                            }else if (data.result == "reg_duplicate") { // 중복추천
                                alert("이미 추천하셨습니다.");
                            }else if (data.result == "reg_mywrit") {   // 본인글 추천
                                alert("본인이 작성한 상품평에는 추천하실 수 없습니다.");
                            }else {
                                alert("다시 한번 시도해주시기 바랍니다.");
                            }	
                        })                                            
                    }
                }


				$scope.reqDetailParam.sort = "P"; // 최초 사진상품평순 P
				$scope.getCommentViewListPaging = function(pageNum,fun_gubun,searchVal) {
                        console.log(searchVal);
						pageNum *= 1;
						// 사진상품평순P/최근상품평순L
						if(fun_gubun == "P" || fun_gubun == "L"){
								$scope.reqDetailParam.sort = fun_gubun;
						}
						if(pageNum == 0 ){
								$scope.CommentViewList = [];
						}


						$scope.CommentViewCurrnetPage = pageNum+1;
						//console.log('$scope.CommentViewCurrnetPage',$scope.CommentViewCurrnetPage);
						$scope.reqDetailParam.page = $scope.CommentViewCurrnetPage;
						//select box 경우에 확인 하기 fun_gubun S
						if(fun_gubun == "S"){
								if(searchVal != ""){
										var paramArr = searchVal.split("^");
										$scope.reqDetailParam.goods_no = paramArr[0];
										//$scope.reqDetailParam.usm_goods_no = paramArr[1];
								}else{
										$scope.reqDetailParam.goods_no =  $scope.BasicData.goods_no;
								}
						};
                        //선물하기 상품평탭 안에 상품평/선물후기 탭 20160725
                        if(fun_gubun == "S2"){
                            if($scope.BasicData.product.select_goods_list.items !=null && $scope.BasicData.product.select_goods_list.items.length > 0 && $scope.BasicData.goods_cmps_cd == '30'){ //기획전
                                if($("#vselect").val() == ""){
                                    $scope.reqDetailParam.goods_no =  $scope.BasicData.goods_no;
                                }else{
                                    $scope.reqDetailParam.goods_no = $("#vselect").val().split("^")[0];
                                }
                            }else{ //단품
                                $scope.reqDetailParam.goods_no =  $scope.BasicData.goods_no;
                            }                            
                            
                        }
                        //@@선물하기 상품평에 선물후기 옵션 추가 
                        if($scope.BasicData.product.gift_check == undefined || $scope.BasicData.product.gift_check == true){
                            $scope.reqDetailParam.gift_review = "N";     
                        }else{
                            $scope.reqDetailParam.gift_review = "Y";     
                        }
                        
    
						//console.log('page',$scope.reqDetailParam);

						$http.get(LotteCommon.commentCommentViewMobileData, {params:$scope.reqDetailParam})
						.success(function(data) {
								try {
										var dataset = data.data_set;
										if(dataset.product_review) {
												for(var i=0;i < dataset.product_review.items.length;i++) {
														$scope.CommentViewList.push(dataset.product_review.items[i]);
												}
										}
										 $scope.PrdCommentData = data.data_set; //상품평
								}catch(e) {
								}
						})
						.error(function() {
								 console.log('Data Error : getCommentViewListPaging 실패');
						});

						//console.log('$scope.CommentViewList22',$scope.CommentViewList);
				};

				// faq 페이징  작업 후 진행
				$scope.getFaqListPaging = function(pageNum,searchVal,fun_gubun) {
						if(pageNum == 0){
								$scope.FaqList = [];
						}

						pageNum *= 1;
						$scope.FaqListPage = pageNum+1;
						//console.log('$scope 1',$scope.FaqList);
						$scope.reqDetailParam.page = $scope.FaqListPage;
						if(fun_gubun == "S"){
								if(searchVal != ""){
										var paramArr = searchVal.split("^");
										$scope.reqDetailParam.goods_no = paramArr[0];
										$scope.reqDetailParam.usm_goods_no = paramArr[1]; //20160919 FAQ
								}else{
										$scope.reqDetailParam.goods_no =  $scope.BasicData.goods_no;
								}
						}

						//console.log('page',$scope.reqDetailParam);

						$http.get(LotteCommon.commentProductQuestListMobileData, {params:$scope.reqDetailParam})
						.success(function(data) {
								try {
										var dataset = data.data_set;
										//console.log('$scope 1',dataset);
										if(dataset.product_quest) {
												for(var i=0;i < dataset.product_quest.items.length;i++) {
														$scope.FaqList.push(dataset.product_quest.items[i]);
												}
										}
										//console.log('$scope 2',$scope.FaqList);
										 $scope.FAQData = data.data_set; ////Q&A
								}catch(e) {
								}
						})
						.error(function() {
								 console.log('Data Error : getCommentViewListPaging 실패');
						});

						//console.log('$scope.getFaqListPaging3 ',$scope.FaqList);
				};


				//구매하기 select box productTabChange
				$scope.productTabChange = function(tabIdx,searchVal) {
						//console.log('$scope.productDetailLayer',tabIdx+"|"+searchVal);
						if(searchVal != ""){
								var paramArr = searchVal.split("^");
								$scope.reqDetailParam.goods_no = paramArr[0];
								$scope.reqDetailParam.usm_goods_no = paramArr[1];
						}else{
								$scope.reqDetailParam.goods_no      = $scope.BasicData.goods_no;
								$scope.reqDetailParam.usm_goods_no  = '';
						}

								$http.get(LotteCommon.productProductItemInfoData, {params:$scope.reqDetailParam})
								.success(function(data) {
										 $scope.ItemInfo = data.result; //상품정보 가져오기
								})
								.error(function() {
										 console.log('Data Error : productChange 실패');
								});

				};


				//layer close

				$scope.qnaListOpenClose = function (idx)  {
						//console.log('qnaListOpenClose idx',idx);
						addClassFunc($(this).parent());
						addClassFunc($('.qnaList li').eq(idx));
				};

				//AddClass 함수
				function addClassFunc(selElem){
						$(selElem).addClass('on').siblings('.on').removeClass('on');
				};

				//MD공지 아코디언
				$scope.mdNoticeAccordion = function(){
						$scope.mdNoticeAccordionYn = !$scope.mdNoticeAccordionYn;
				};

				//MD팁 아코디언
				$scope.mdTipAccordion = function(){
						$scope.mdTipAccordionYn = !$scope.mdTipAccordionYn;
				};

				//상품문의하기 페이지 이동
				$scope.goQuestWrite = function(){
						console.log('QA :' + $scope.reqDetailParam.goods_no +", "+  $scope.BasicData.goods_no);
						var goUrl= "";

						// if($scope.reqDetailParam.goods_no ==  $scope.BasicData.goods_no){
						if($scope.BasicData.product.goods_cmps_cd == 30 && $scope.reqDetailParam.goods_no ==  $scope.BasicData.goods_no){
								alert("문의하실 상품을 선택해주세요."); // 기획전형 상품인 경우만 alert처리
						}else if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
								Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
						}else{
							 //20160121
                            var faqcnt = 0 ;
                            if($scope.FAQData != undefined){
                                faqcnt = $scope.FAQData.total_cnt;
                            }    
							 if(faqcnt == 0 || faqcnt == "" || faqcnt == null){
									 faqcnt = 0;
							 }
                             LotteStorage.setSessionStorage("qnaBack", "true");
                             LotteStorage.setSessionStorage("qnaguest", $scope.reqDetailParam.goods_no);
							 location.href = "/product/product_quest_write.do?"+$scope.baseParam+"&curDispNo="+$scope.reqDetailParam.curDispNo+"&goods_no="+$scope.reqDetailParam.goods_no+"&usm_goods_no="+$scope.reqDetailParam.usm_goods_no+"&totalCnt="+faqcnt;
						 }
				};

				/**
				 * 상품설명/구매정보탭 스마트픽/크로스픽 가능 문구 추가
				 */
				$scope.get_SMP_CRP = function(){
					var obj = {smp:false, crp:false};
					
					if($scope.BasicData.product.select_goods_list.items==null){
						// 일반상품
						obj.smp = $scope.BasicData.product.smp_psb_yn=='Y' || $scope.BasicData.product.smp_only_yn=='Y';
						obj.crp = $scope.BasicData.product.crspk_psb_yn=='Y';
						if($scope.BasicData.product.smp_only_yn=='Y'){
							obj.crp = false;
						}
					}else if($scope.BasicData.product.select_goods_list.items.length > 0){
						// 기획전형
						var prd;
						if($(".prdBuyInfo .selWrap select").length==0){
							// 상품설명탭
							prd = $scope.BasicData.product.select_goods_list.items[0];
						}else{
							// 구매정보탭
							//prd = $scope.BasicData.product.select_goods_list.items[$(".prdBuyInfo .selWrap select").prop("selectedIndex")];
						}
						if(prd == undefined){ return ''; }

						obj.smp = $scope.isAnySmp || prd.smp_psb_yn=='Y' || prd.smp_only_yn=='Y';
						obj.crp = prd.crspk_psb_yn=='Y';
						if(prd.smp_only_yn=='Y'){
							obj.crp = false;
						}
					}
					
					var query = '';
					if(obj.smp || obj.crp){
						query += '<div class="sm_cr_pick">';
						query += '<h6>스마트픽</h6>';
						query += '<em>';
						if(obj.smp){
							query += '<span>롯데백화점</span>';
						}
						if(obj.crp){
							query += '<span>세븐일레븐</span>';
						}
						query += '</em> 픽업 가능';
						query += '</div>';
					}
					return query;
				}
		}]);

		// Directive :: 상품정보
		app.directive('productInfo', ['Fnproductview', '$window', '$http', 'LotteCommon',
		                      		function(Fnproductview, $window, $http,LotteCommon) {
				return {
						templateUrl: '/lotte/resources_dev/product/m/product_info.html',
						replace:true,
						link : function($scope,el,attr){
								console.log('productInfo', 'called');
								$scope.Fnproductview = Fnproductview;	
								$scope.viewNaverMap = function(){
										//console.log('$scope.$emit==>' + typeof $scope.$emit)
										$scope.$broadcast('showNaverStoreMap', {
												goods_no: $scope.BasicData.goods_no,
												entr_no: $scope.BasicData.product.pmg_entr_no,
												entr_contr_no: $scope.BasicData.product.entr_contr_no,
												smp_ecoupon_yn: GOODS_SMP_NORMAL_ETC == $scope.BasicData.product.smp_goods_type ? 'Y' : 'N'
										});
								};
								
								// 20160527 브랜드샵 하단에 붙는 타입 추가
								$scope.goBrandShjopBottom = function (url,dispCnt) {
									var goUrl = url + "?curDispNo=" + $scope.BasicData.product.brnd_disp_shop_no + "&upBrdNo=" + $scope.BasicData.product.upr_brnd_no;

									if (dispCnt != undefined) {
											goUrl += "&dispCnt=" + dispCnt;
									}
									//샤넬화장품일 경우
									if($scope.BasicData.product.brnd_no=='255'){
										goUrl = '/category/m/prod_list.do?c&curDispNo=5036840&isWine=Y&isComm=Y&title=샤넬&c=mlotte';
									}

									// $scope.sendTclick( 'm_DC_ProdDetail_Clk_Lnk_1' );
									goUrl += '&tclick=m_DC_ProdDetail_Clk_Lnk_2';
									Fnproductview.goUrl($window,$scope,goUrl,"brandshop");
								};
						}
				};

		}]);
		// Directive :: wine 상품정보
		app.directive('productWineInfo', [function() {
				return {
						templateUrl: '/lotte/resources_dev/product/m/product_wine_info.html',
						replace:true,
						link : function(){
								console.log('productWineInfo', 'called');
						}
				};

		}]);


		// Directive :: 상품정보
		app.directive('productInfoDetail', ['Fnproductview',function(Fnproductview) {
				return {
						templateUrl: '/lotte/resources_dev/product/m/product_info_detail.html',
						replace:true,
						link : function($scope, el, attrs){
								//console.log('productInfoDetail', 'called');
			                    //20160120 모아보기팝업 좌우 이동 기능 추가 
			                    $scope.popIndex = 0; //모아보기팝업의 현재 인덱스 20160120
			                    $scope.popNext = function(){
			                        $scope.popIndex += 1;
			                        if($scope.popIndex >= $scope.PrdExplainData.select_products.items.length){
			                            $scope.popIndex = 0;
			                        }
			                        $scope.productLayer($scope.PrdExplainData.select_products.items[$scope.popIndex].tgt_goods_no, $scope.popIndex);
			                    }
			                    $scope.popPrev = function(){
			                        $scope.popIndex -= 1;
			                        if($scope.popIndex < 0){
			                            $scope.popIndex = $scope.PrdExplainData.select_products.items.length - 1;
			                        }
			                        $scope.productLayer($scope.PrdExplainData.select_products.items[$scope.popIndex].tgt_goods_no, $scope.popIndex);                                    
			                    }
								$scope.isShowproductDetailLayer = false;
								$scope.goods_info_auto_prt_yn ="";//타이틀유조립유무
								//$scope.productDetailLayer = []; //상품레이어 값 set
//                $scope.productDetailLayer = { tgt_goods_nm:"" , sale_prc:0, spdp_shp_img_file_path_nm:""  , spdp_shp_img_file_nm:"" , lwnd_desc_fcont:"",immed_pay_dscnt_amt:"",lay_idx:0};
								$scope.productDetailLayer = {};
								$scope.productLayer = function(goods_no, index) {
									$scope.popIndex = index; //20160120	
									$scope.sendTclick( 'm_DC_ProdDetail_Clk_Prd_idx' + ( this.$index + 1 ) );
									$scope.productDetailLayer = Fnproductview.getObjListKey($scope.PrdExplainData.select_products.items,"tgt_goods_no",goods_no);										
									$scope.dimmedOpen({target : "productLayer",callback : this.closeProductDetailLayer});
									$scope.isShowproductDetailLayer = true;
									//1116 html 영역처리 추가
									setTimeout(function(){
											$("#pop_html_up").html($scope.productDetailLayer.uptn_desc_fcont);
											$("#pop_html_down").html($scope.productDetailLayer.lwnd_desc_fcont);
											 $(".preview.detail").scrollTop(0); //20160122
									}, 300);
								};
								//모아보기 2단일 경우 셀의 높이를 맞춤
								$scope.setCellSize = function(index, flag, type){
										if(flag && type != "1"){
												$(".amassPrd > li").eq(index).css("height", "auto");
												$(".amassPrd > li").eq(index-1).css("height", "auto");
												setTimeout(function(){
														if($(".amassPrd > li").eq(index - 1).height() > $(".amassPrd > li").eq(index).height()){
																$(".amassPrd > li").eq(index).height($(".amassPrd > li").eq(index - 1).height());
														}else{
																$(".amassPrd > li").eq(index - 1).height($(".amassPrd > li").eq(index).height());
														}
												}, 300);
										}
								}
                                //모아보기 셀맞추기 20161014
                                $scope.moa_height = function(id){
                                    var vh = $("#moa_" + id).height() + 1 + "px";
                                    $("#span_" + id).css("height", vh);
                                    return  vh;   
                                }
								$scope.closeProductDetailLayer = function() {
										$scope.isShowproductDetailLayer = false;
										$scope.dimmedClose();
								};
                            
                                //20161004 모아보기 -> 장바구니 담기 버튼
                                $scope.moa_add_cart = function(item){
                                    $scope.btnCart_click();
                                    setTimeout(function(){
                                        $scope.ncGoodsSelected(item.tgt_goods_no);    
                                    }, 500);                                    
                                }
						}
				};

		}]);

		//상품상세 상단 for : $scope.detailTopHeight
		app.directive('detailTopWrap', ['$window','$timeout',function($window,$timeout) {
				return {
						replace:true,
						link : function($scope, el, attrs){
								//상품상세 상단 높이값을 구함
								$scope.$watch("isBasicData", function(newVal) {
										if(newVal != null && $scope.isBasicData) {
												$timeout(function(){
														$scope.detailTopHeight = el.height() + angular.element('#comparePdtLst').height();
												},300);
										}
								}, true);
								if($(window).width() >= 640){
									setTimeout(function(){
										var hh = $(".detailSwipe").width();
										$(".detailSwipe").height(hh);
										$(".detailTitWrap").height(hh);
									},300);
								}
                                $scope.winH = $(window).height();//20161010
								//상품상세 상단 resize 시 높이값 구함
								angular.element($window).on('resize', function(evt) {
                                        $scope.winH = $(window).height();
										$timeout(function(){
												$scope.detailTopHeight = el.height() + angular.element('#comparePdtLst').height();
												if($(window).width() >= 640){
														$scope.isPrdExplainData = true;
														var hh = $(".detailSwipe").width();
														$(".detailSwipe").height(hh);
														$(".detailTitWrap").height(hh);
												}else{
														$(".detailSwipe").height("270px");
														$(".detailTitWrap").height("auto");
												}
										},300);
								});
						}
				}
		}]);

		// 상품상세 탭
		app.directive('detailPrdTab', ['$window','$timeout',function($window,$timeout) {
				return {
						replace:true,
						link : function($scope, el, attrs){
								$scope.first = true; //첫로딩시...
								//if(angular.element($window).height() > 400 && first){ // 400 = 상품상세영역이 보이지 않는다면 로딩을 막고있음
										//$scope.loadingTabData(0);
										//first = false;
								//}
								//20160303
								angular.element($window).on('scroll', function(evt) {
										if (this.pageYOffset >= $scope.detailTopHeight + 45){ // 45 = header
											$scope.tabFixedChange(true);	
											el[0].style.cssText = 'z-index:20;position:fixed;top:0px;width:100%;';
										}else{
											$scope.tabFixedChange(false);
											el[0].style.cssText = '';
										}
										setTimeout(function(){
												if (this.pageYOffset >= $scope.detailTopHeight + 45){ // 45 = header
													$scope.tabFixedChange(true);	
													el[0].style.cssText = 'z-index:20;position:fixed;top:0px;width:100%;';
												}else{
													$scope.tabFixedChange(false);
													el[0].style.cssText = '';
												}
										}, 300);
										// 스크롤이 시작된다면 상품상세영역 로딩시작
										if (this.pageYOffset > 100){
												if($scope.first){
														$scope.loadingTabData($scope.productInfotabIdx); // 높이값 충족시 스크롤 후 최초 로딩
														$scope.first = false;
												}
										}
								});

								//태블릿이면 그냥 로딩
								if($(window).width() >= 768){
									$scope.loadingTabData($scope.productInfotabIdx); // 높이값 충족시 스크롤 후 최초 로딩
									$scope.first = false;
								}


								el.find("li").click(function(){
										$timeout(function(){
												var tarY = $(".detailInfoCnt").offset().top;
												if($("#head_sub").css("position") == "fixed" && $(".detailPrdTabWrap").css("position") != "fixed"){
														angular.element($window).scrollTop(tarY - 90);
												}else if($("#head_sub").css("position") == "fixed" && $(".detailPrdTabWrap").css("position") == "fixed"){
														angular.element($window).scrollTop(tarY - 45);
												}else{
														angular.element($window).scrollTop(tarY - 85);
												}
										},300);
								});


						}
				};
		}]);

		/* 상세이미지크게보기  */
		commModule.directive('ditailImgWrap', ['$window','$timeout', function($window,$timeout) {
				return {
						replace : true,
						link : function($scope, el, attrs) {
								angular.element($window).on('scroll', function() {
										var elTop = el.position().top;
										if ( ( ( this.pageYOffset > elTop ) && ( elTop + $( '#productDetailSelect' ).height() - $( '.ditailImgWrap > a' ).height() > this.pageYOffset ) ) && $(".detailPrdTab > li:first-child").hasClass("on") ){
												$scope.viewBigImg = true;
												$( '.viewBigImg' ).show();
										}else{
												$scope.viewBigImg = false;
												$( '.viewBigImg' ).hide();
										}
								});
						}
				}
		}]);

		// 20160628 박형윤 앱다운로드 배너 추가로 인한 변경 --
		// 상품상세 별도 헤더 동작
		commModule.directive('subHeaderEach', [ '$window', 'AppDownBnrService', function ($window, AppDownBnrService) {
			return {
				replace : true,
				link : function($scope, el, attrs) {
					// 이전 페이지 링크
					$scope.gotoPrepage = function () {
						$scope.sendTclick("m_header_new_pre");
						history.go(-1);
					};

					var $el = angular.element(el),
						$win = angular.element($window),
						headerHeight = $scope.subHeaderHeight;

					function setHeaderFixed() {
						if ($win.scrollTop() > headerHeight) {
							$el.attr("style", "z-index:10;position:fixed;top:0;width:100%");
							$scope.$parent.cateViewFlag = false;
							$el.parent().css({paddingTop: $el.outerHeight()});
						} else {
							$el.removeAttr("style");
							$el.parent().css({paddingTop: 0});
						}
					}

					$win.on('scroll', function (evt) {
						setHeaderFixed();
						setTimeout(setHeaderFixed, 300);
					});

					// 앱다운로드 배너 상태 값 변경 확인
					$scope.$watch(function () { return AppDownBnrService.appDownBnrInfo.isShowFlag }, function (newValue, oldValue) {
						if (typeof newValue !== 'undefined') {
							headerHeight = AppDownBnrService.appDownBnrInfo.isShowFlag ? $scope.subHeaderHeight + $scope.subHeaderHeight : $scope.subHeaderHeight;
						}
					});
				}
			}
		}]);
		//-- 20160628 박형윤 앱다운로드 배너 추가로 인한 변경

		// Directive :: 아코디언
		app.directive('accordionList', [function() {
				return {
						replace:true,
						link : function($scope, el, attrs){
								var li = el.find("li"),
										btn = li.find(".accordionTit");
								//console.log(li);
								//console.log(btn);
								btn.click(function(){
										var status = $(this).parent().hasClass("on");
										li.removeClass("on");
										if(! status){
												$(this).parent().addClass("on");
										}
								});
						}
				};
		}]);

		// Directive :: 상품 Q&A 아코디언
		app.directive('qnaList', ['$timeout',function($timeout) {
				return {
						replace:true,
						link : function($scope, el, attrs){
								$scope.qnaListIndex;
								$scope.qnaListClick = function(idx){
										if($scope.qnaListIndex == idx){
												$scope.qnaListIndex = null;
										}else{
												$scope.qnaListIndex = idx;
										}
								}
						}
				};
		}]);

		// 팝업:롯데닷컴 선물 서비스
		app.directive('popGift', [function() {
				return {
						replace:true,
						link : function($scope, el, attrs){
								$scope.giftFlag='fWrap';
								$scope.dimZidx=$('lotte-dimm section').css('z-index');
								$scope.popGift = function(type,brdImg,brdNm){
										$scope.popScl=null;
										switch(type){
												case 'brand' : 
													$scope.giftFlag='fWrap';
													$scope.brnd_gift_logo_img=brdImg!=undefined?brdImg:$scope.BasicData.product.brnd_gift_logo;
													$scope.brnd_nm=brdNm!=undefined?brdNm:$scope.BasicData.product.main_brnd_nm;
													break;
												case 'card' : $scope.giftFlag='fCard'; break;
										}
										el.show();
										setTimeout(function(){
											el.find('.gift_wrap').css('height','auto').height(el.height()-45);
										},300);
										el.css('margin-top',el.outerHeight()/-2);
										$scope.LotteDimm.status=true;
										$scope.LotteDimm.callback=this.popGiftClose;
										$('lotte-dimm section').css('z-index',150);
										if($scope.LotteDimm.target=="productLayer"){
												$scope.popScl=$scope.LotteDimm.scrollY
												$scope.LotteDimm.scrollY=$(window).scrollTop();
										}else $scope.LotteDimm.scrollY=$(window).scrollTop();
								}
								$scope.popGiftClose = function(){
										el.hide();
										$scope.dimmedClose();
										$('lotte-dimm section').css('z-index',$scope.dimZidx); 
										if($scope.popScl!=null) $scope.LotteDimm.scrollY=$scope.popScl;
								}
						}
				};
		}]);

		// 팝업:말풍선
		app.directive('helpLayer', ['$timeout',function($timeout) {
				return {
						replace:true,
						link : function($scope, el, attrs){
								$scope.eventTarget = null;
								$scope.helpLayer = function(obj){
										/* <span class="icQst" ng-click="helpLayer({target:'',title:BasicData.product.reserve_value1,txt:BasicData.product.reserve_value2})">?</span>
										 * @param : target,title,txt
										 * target 이 없을때 레이어 내용을 받아옴
										 */
										angular.element(".icQst").each(function(){ // 말풍선 아이콘 on 클래스 초기화
												$(this).removeClass("on");
										});
										$scope.eventTarget = $(event.target);
										$scope.eventTarget.removeClass("on").addClass("on");

										//참좋은 혜택
										if(obj.target == 'giftPrice'){
												$scope.helpTitle = "참좋은 혜택가란?";
												$scope.helpTxt = "즉석 쿠폰이나 일시불 할인 등 다양한 <br>할인혜택이 자동으로 적용된 가격입니다.<br>본 가격은 대표상품의 가격으로 선택상품에<br>따라 가격 및 할인혜택이<br>다를 수 있습니다.";
										}
										//롯데포인트플러스카드
										else if(obj.target == 'lottePointPlusCard'){
												$scope.helpTitle = "";
												$scope.helpTxt = "<p>" + obj.reserve_value1 + "</p><p class=tit>적립 기준</strong></p><ol>" +
														"<li>상기 표시된 적립금은 쿠폰 등 할인 금액에 따라 변동될 수 있습니다.</li>" +
														"<li>무이자할부 이용시 롯데카드 적립은 제외됩니다.</li>"+
														"<li>적립쿠폰은 2배 적립에서 제외됩니다.</li>"+
														"<li>카드사에서 제공되는 적립금은 롯데포인트플러스카드 결제분에 한해 산정된 적립율로 지급됩니다.<br>(롯데포인트플러스카드와 현금/포인트 복합 결제시 현금/포인트 결제금액 제외)</li>";
												if ($scope.BasicData.elotte_yn != 'Y'){
														$scope.helpTxt += "<li>롯데닷컴 ID기준의 멤버스 회원과 결제하신 롯데포인트플러스카드의 소유주가<br> 다른 경우 롯데카드 적립금은 적립되지 않습니다. (롯데닷컴 적립금은 정상 지급)</li>";
												}   else  {
														$scope.helpTxt += "<li>엘롯데 ID기준의 멤버스 회원과 결제하신 롯데포인트플러스카드의 소유주가 <br>다른 경우 롯데카드 적립금은 적립되지 않습니다. (엘롯데 적립금은 정상 지급)</li>";
												}
												$scope.helpTxt += "</ol>";
										}
										//렌탈 상품
										else if(obj.target == 'rentalOnly'){
												$scope.helpTitle =  "<strong>" + obj.lmoney + "</strong>점이 적립 되셨습니다.";
												$scope.helpTxt = "적립된 L-money " + obj.lmoney + "점은 오늘 자정 12시에 소멸되며, 내일 또 적립 받으실 수 있습니다.";
												$scope.eventTarget = angular.element("#rentalOnlyDown");
										}else if(obj.target == "rentalOnlyError"){
												var tmpstr = obj.response_msg.split("\n");
												$scope.helpTitle = tmpstr[0];
												$scope.helpTxt = tmpstr[1];
												$scope.eventTarget = angular.element("#rentalOnlyDown");
										}

										// console.log('######', obj.target, angular.element("#rentalOnlyDown").offset());
										setTimeout(function(){
											$("#helpText").html($scope.helpTxt);
										}, 300);

										if($scope.eventTarget.offset() != undefined){
												if(obj.target == "giftPrice")//임시 yubu
														el.css("top" , $scope.eventTarget.offset().top + 20-45);
												else if(obj.target=="rentalOnly" || obj.target=="rentalOnlyError")
														el.css("top" , $scope.eventTarget.offset().top + 20-35);
												else
														el.css("top" , $scope.eventTarget.offset().top + 20);
										}

										el.addClass(obj.target).show();
								}
								$scope.helpLayerClose = function(e){
										el.attr("class","").addClass("helpLayer").hide();
										$scope.eventTarget.removeClass("on");
										$scope.eventTarget = null;
										$("#helpText").html('');
								}
						}
				};
		}]);

		// datePicker
		app.directive('datePicker', ['$timeout','$window','$rootScope',function($timeout,$window) {
				return {
						replace:true,
						link : function(scope, el, attrs){
								scope.item_opt_value = [];
								scope.getFirstDay = function(year, month) { //첫째요일
										return new Date(year, month, 1).getDay();
								}
								scope.getLastDay = function(year, month) { //마지막날짜
										return new Date(year, month + 1, 0).getDate();
								}
								scope.addZero = function(n) {return n < 10 ? "0" + n : n;};
								scope.date = new Date();
								scope.now = new Date();
								scope.cdate = new Date(); //input current date
								scope.today = scope.now.getDate();
								scope.month = scope.now.getMonth();
								scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
								scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
								scope.dateHead = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

								scope.datePrev = function(obj){
										scope.date.setMonth(scope.date.getMonth() - 1);
										scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
										scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
										scope.makeDays();
								}
								scope.dateNext = function(e){
										scope.date.setMonth(scope.date.getMonth() + 1);
										scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
										scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
										scope.makeDays();
								}
								scope.makeDays = function(){
										scope.day = [];
										for (var i = 0 ; i < scope.firstDay ; i++) {
												scope.day.push(0-i);
										}
										for (var i = 0 ; i < scope.lastDay ; i++) {
												scope.day.push(i + 1);
										}
								}
								//eung 피커에 기획전형 추가
								scope.pick = function(i){
										scope.cdate.setDate(i);
//                  $("#" + scope.datePickerState).val(scope.date.getFullYear() + "-" + scope.addZero(scope.date.getMonth() + 1) + "-" + scope.addZero(i));
										var dateValue = scope.date.getFullYear() + "-" + scope.addZero(scope.date.getMonth() + 1) + "-" + scope.addZero(i);
										if(scope.datePickerObj.pindex != null && scope.datePickerObj.pindex != undefined){
												scope.orderList[scope.datePickerObj.pindex].item_opt_list.items[scope.datePickerObj.idx].item_opt_value = dateValue;
										}else{
												scope.item_opt_value[scope.datePickerObj.idx] = dateValue;
										}

										scope.datePickerClose();
                                        //20160223-1
                                        scope.boldOptionBorder();										

								}
								scope.makeDays();
						}
				};
		}]);

		//알림리스트
		app.directive('brieflyPop', ['$window','$timeout', function($window,$timeout){
				return {
						replace : true, link:function($scope, el, attrs){
								$scope.brieflyHtml = "";
								$scope.brieflyPop = function(obj){
										//확대안내
										if(obj.target == "imgZoomPop"){
												$scope.brieflyHtml = "<div class=popTxt>자유로운 확대가<br />가능합니다</div>";
										}
										//재입고 알림 신청 $scope.brieflyPop({target : "alarmPop", phone : "010-"});
										else if(obj.target == "alarmPop"){
												if (obj.phone == undefined){
														$scope.brieflyHtml = "<span class=empy></span><div class=popTxt>재 입고 알림<br />신청되었습니다</div>";
												} else {
														$scope.brieflyHtml = "<span>" + obj.phone + "</span>" + "<div class=popTxt>재 입고 알림<br />신청되었습니다</div>"+ "<p>연락처 수정은 마이롯데에서<br />하실 수 있습니다</p>";
												}
										}
										//장바구니
										else if(obj.target == "cartPop"){
												$scope.brieflyHtml = "<div class=popTxt>장바구니에<br />담겼습니다 </div>";
										}
										//위시리스트
										else if(obj.target == "wishPop"){
												$scope.brieflyHtml = "<div class=popTxt>위시리스트에<br />담았습니다</div>";
										}
										//상세 옵션이미지 설명
										else if(obj.target == "optionPop"){
												//console.log("--------- opt pop");
												$scope.brieflyHtml = "<div class=popTxt>옵션 이미지를 터치하면<br />자세한 상품설명을<br />볼 수 있어요!</div>";
										}
										
										//품절시 설명
										else if(obj.target == "soldoutPop"){
												$scope.brieflyHtml = "<p class=tle>품절</p><div class=popTxt>이 상품은 품절되었습니다. <br />재 입고 알림 서비스를 <br />이용해주세요. </div>";
										}
										
										//판매종료 설명										
										else if(obj.target == "soldout2Pop"){
												$scope.brieflyHtml = "<p class=tle>판매종료</p><div class=popTxt>판매종료된 상품입니다. <br />보내주신 성원에 <br />감사드립니다. </div>";
										}
										
										el.attr('class', 'brieflyPop ' + obj.target).fadeIn(500,function(){
												$timeout(function(){
														el.fadeOut(500);
												},1000)
										});
								}
						}
				};
		}]);
		app.controller('ProductWineDetailCtrl', ['$scope', '$http', '$routeParams', '$location', 'LotteCommon','Fnproductview','commInitData', function($scope, $http,$routeParams, $location, LotteCommon,Fnproductview,commInitData) {
				console.log('ProductWineDetailCtrl call start smp_wine_yn');

				$scope.reqDetailParam = {
						upCurDispNo : Fnproductview.objectToString(commInitData.query['upCurDispNo']), // 상위 카테고리번호
						dispDep : Fnproductview.objectToString(commInitData.query['dispDep']),
						curDispNo : Fnproductview.objectToString(commInitData.query['curDispNo']),
						goods_no : Fnproductview.objectToString(commInitData.query['goods_no']) ,
						wish_lst_sn : Fnproductview.objectToString(commInitData.query['wish_lst_sn']),
						cart_sn : Fnproductview.objectToString(commInitData.query['cart_sn']),
						item_no : Fnproductview.objectToString(commInitData.query['item_no']),
						genie_yn : Fnproductview.objectToString(commInitData.query['genie_yn']),
						cn : Fnproductview.objectToString(commInitData.query['cn']),
						cdn : Fnproductview.objectToString(commInitData.query['cdn']),
						curDispNoSctCd : Fnproductview.objectToString(commInitData.query['curDispNoSctCd']),
						tclick : Fnproductview.objectToString(commInitData.query['tclick']),
						page : Fnproductview.objectToString(commInitData.query['page']),
						sort: Fnproductview.objectToString(commInitData.query['sort']),
						siteNo: Fnproductview.objectToString(commInitData.query['siteNo']),
						usm_goods_no: Fnproductview.objectToString(commInitData.query['usm_goods_no'])
				};
				$scope.reqDetailParamStr = $scope.baseParam;
				if ($scope.reqDetailParam.curDispNoSctCd != null){$scope.reqDetailParamStr += "&curDispNoSctCd="+$scope.reqDetailParam.curDispNoSctCd;}
				if ($scope.reqDetailParam.curDispNo != null){$scope.reqDetailParamStr += "&curDispNo="+$scope.reqDetailParam.curDispNo;}
				if ($scope.reqDetailParam.goods_no != null){$scope.reqDetailParamStr += "&goods_no="+$scope.reqDetailParam.goods_no;}

				$scope.productInfotabUrl = "";
				$scope.prdZoomImg = "";

				// paging
				$scope.FaqList = [];
				$scope.FaqListPage = 1;//faq 현재페이지

				$scope.winelodomain= LotteCommon.productProductImgData+"?"+$scope.reqDetailParamStr;
				var dtl_info_fcont = $scope.BasicData.product.dtl_info_fcont;

				if(dtl_info_fcont !="" ){
						var html = dtl_info_fcont.replace(/<script/gi,"<noscript").replace(/<\/script/gi,"</noscript");
						//console.log('$scope.winelodomain',$scope.winelodomain);
						$("#wineDetailLayout").html(html);
						$("#wineDetailLayout").find("object").remove();
						$("#wineDetailLayout").find("embed").remove();
				}

				$scope.productWineInfotabIdx = 0;

				$scope.mdNoticeAccordionYn = true; //MD공지 아코디언 20160309
				$scope.mdTipAccordionYn = true; //MD팁 아코디언

				$scope.loadingTabData = function(){}; //EmptyFn

				//MD공지 아코디언
				$scope.mdNoticeAccordion = function(){
						$scope.mdNoticeAccordionYn = !$scope.mdNoticeAccordionYn;
				}

		}]);

////////////////////////////////////////////////////////
///// 상품 상세 js end
////////////////////////////////////////////////////////

})(window, window.angular);




