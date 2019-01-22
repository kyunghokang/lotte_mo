(function (window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',

		'lotteMainPop',

		// 'mainAppInfo',
		'lotteNgSwipe',
		'lotteSlider'
	]);

	app.controller('MainCtrl', ['$rootScope', '$scope', '$timeout', '$window', '$location', '$q', 'LotteCommon', 'commInitData', 'LotteUserService', 'LotteStorage', 'LotteCookie', 'AppDownBnrService',
		function ($rootScope, $scope, $timeout, $window, $location, $q, LotteCommon, commInitData, LotteUserService, LotteStorage, LotteCookie, AppDownBnrService) {
		$scope.screenID = "main"; // Tclick 을 위한 screenID
		$scope.showWrap = true; // 컨텐츠 표시 Flag
		$scope.contVisible = true; // 컨텐츠 표시 Flag

		$scope.pageLoading = false; // 탭 페이지 로드 Flag
		$scope.productListLoading = false; // 상품 로드 Flag <div class="listLoading" ng-if="productListLoading && !pageLoading"> 가 있어야 함
		$scope.$parent.LotteSuperBlockStatus = false; // 사용자 터치 이벤트 막기 Flag

		$scope.platinumPlanshopFlag = false; // 태블릿 출석도장 배너 표시 12/07 ~ 12/13 플래티넘 고객대상 기획전 노출 Flag
		$scope.menuNewFlag = false; // 스타일샵 New Flag
		$scope.menuSaleFlag = false; // 백화점 Sale Flag
		$scope.eventOpenFlag = false; // 20주년 이벤트 표시 Flag (04/05 08:30 ~ 4/23 23:59)
		$scope.recomTabBigDealTitFlag = false; // 이거어때탭 빅딜 타이틀 20주년 타이틀 변경 Flag (04/04 08:00 ~ 04/23 23:59)
		$scope.recombigTopBanner = false; // 이거어때, 빅딜 상단 top 배너 (5/16 00:00 ~ 5/17 23:59)
		$scope.recombigTopBanner2 = false; // 이거어때, 빅딜 상단 top 배너 (5/18 00:00 ~ 5/19 23:59)
		$scope.recombigTopBanner3 = false; // 이거어때, 빅딜 상단 top 배너 (5/20 00:00 ~ 5/22 23:59)
		$scope.recombigTopBanner4 = false; // 이거어때, 빅딜 상단 임직원 배너 (5/23 00:00 ~ 5/31 23:59)
		$scope.giftbigdealFlag = true; // 선물하기 flag (5/11 23:59)
		$scope.previewDate = commInitData.query['preview'];
		$rootScope.isDirectCate = true; //빅딜 탭 바로접근
		$scope.appLpotIconFlag = true; // 엘팟 아이콘 노출 여부

		/**
		 * 안드로이드 엘팟 아이콘 노출 여부
		 * 2017.04.03 김낙운
		 * 요건
		 - 1.APP초기 진입 시
         - 2.1분 후 숨김처리
         - 3.엘팟 아이콘 스크롤시 비노출
         - 4.엘팟 아이콘 메인 화면 벗어날 경우
		 */
		function appLpotIcon() {

			// 1.APP초기 진입 시 : 플래그 체크, 안드로이드 체크, skt앱 체크(지원x), 버젼체크(2.7.9 이상)
			if ($scope.appLpotIconFlag == true && $scope.appObj.isApp && $scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 279) {
				try {
			 		window.lottebridge.lpot(true);
				} catch (e) {}
			}

			// 2.1분 후 숨김처리
			$timeout(function () {
				if ($scope.appLpotIconFlag == true && $scope.appObj.isApp && $scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 279) {
					try {
				 		window.lottebridge.lpot(false);
					} catch (e) {}
				}
			}, 60000);
		}

		// 헤더 스크롤에 따른 액션 값
		$scope.beforeScrollPos = 0;

		// 이벤트탭 관련 링크
		$scope.eventLinkObj = {
			eventInfoUrl : LotteCommon.eventGumeUrl, // 응모/당첨
			eventSaunUrl : LotteCommon.eventSaunUrl, // 구매사은
			eventBenefitUrl : LotteCommon.gdBenefitUrl, // 참좋은 혜택
			eventAttendUrl : LotteCommon.directAttendUrl // 출석도짱
		};

		var $win = angular.element($window);
		// 20160622 박형윤 - 앱다운로드 배너 추가
		$scope.appDownBnrFlag = false;
		$scope.mainHeaderHeight = {
			mobile : 90,
			tablet : 50
		};

		// 앱다운로드 배너 상태 값 변경시 처리
		function appDownBnrWatch(data) {
			if (data.pageType == "메인" && data.isShowFlag) {
				$scope.appDownBnrFlag = true;
				$scope.mainHeaderHeight = {
					mobile : 145,
					tablet : 105
				};
			} else {
				$scope.appDownBnrFlag = false;
				$scope.mainHeaderHeight = {
					mobile : 90,
					tablet : 50
				};
			}
		}

		// 앱다운로드 배너 상태 값 변경 확인
		AppDownBnrService.appDownSettingData().then(function (data) {
			appDownBnrWatch(data);
		});

		// 앱다운로드 배너 상태 값 변경 확인
		$scope.$watch(function () { return AppDownBnrService.appDownBnrInfo.isShowFlag }, function (newValue, oldValue) {
			if (typeof newValue !== 'undefined') {
				appDownBnrWatch(AppDownBnrService.appDownBnrInfo);
			}
		});

		/*****************************************
		 * Page UI / Data
		 *****************************************/
		$scope.pageUI = {
			defaultRendingDispNo: "5553631", // Default 이거 어때
			curMenuIdx: 0, // 현재 탭 Index
			curMenuDispNo: "", // 현재 탭 전시번호
			rootMenu: [], // 헤더 메뉴 데이터
			storedData: {}, // 탭 데이터
			curDispNo: "", // 전시 인입코드
			curdispNoSctCd: "", // 전시 인입 상세 코드
			isLoginData: false, // 로그인 상태
			winScrollHeaderDownFlag: false
		};

		/*****************************************
		 * Page Event Handler
		 *****************************************/
		$win.on({
			"unload.main": function () {
				var sess = {};

				if (!$scope.pageUI.rootMenu.length || !Object.getOwnPropertyNames($scope.pageUI.storedData).length) {
					return false;
				}

				sess = $scope.pageUI;

				if (!commInitData.query.localtest && $scope.leavePageStroage) { // localtest url 파라메타가 없을때 저장
					LotteStorage.setSessionStorage('lotteMain2016Loc', $location.absUrl());
					LotteStorage.setSessionStorage('lotteMain2016Data', sess, 'json');
					LotteStorage.setSessionStorage('lotteMain2016ScrollY', angular.element($window).scrollTop());
				}
				// 4.엘팟 아이콘 메인 화면 벗어날 경우
				if ($scope.appLpotIconFlag == true && $scope.appObj.isApp && $scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 279) {
					try {
				 		window.lottebridge.lpot(false);
					} catch (e) {}
				}
			},
			"load": function () {
				$win.windowLoadFlag = true; // 윈도우 로드가 완료되었는지 판단
				appLpotIcon(); // 엘팟 아이콘 노출
			}
		});

		/*****************************************
		 * Native APP Interface
		 *****************************************/
		var appVersion = "";

		if ($scope.appObj && $scope.appObj.ver) {
			appVersion = parseInt(($scope.appObj.ver + "").replace(/\./gi, ""));
		}

		function callAppSplashInfo() { // 앱에 스플래시 정보 전달
			var age = $scope.loginInfo.mbrAge ? $scope.loginInfo.mbrAge : "";
			var gen = $scope.loginInfo.genSctCd ? $scope.loginInfo.genSctCd : "";

			// 앱 스플래시 개인화 호출
			// 아이폰앱 스플래시 이미지 개인화 적용 스크립트
			if ($scope.appObj.isApp) { // 로그인중이고 성별, 나이 정보가 있을 경우에만
				if (gen == "M") {
					gen = "male";
				} else if (gen == "F") {
					gen = "female";
				} else {
					gen = "common";
				}

				// 앱이고 로그인 상태이고 성별, 나이 정보가 있을 경우
				if ($scope.appObj.isAndroid && commInitData.query["schema"] == "mlotte001" && appVersion >= 223) { // 안드로이드 버전 223 이상
					try {
						if (window.lottebridge.splashinfo) {
							window.lottebridge.splashinfo(gen, age);
						}
					} catch (e) {
						console.info("앱 스플래시 호출 없음");
					}
				} else if ($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.iOsType == "iPhone" && appVersion >= 214) { // 아이폰버전 214 이상
					window.location = "lottebridge://splashinfo/" + gen + "?" + age;
				} else if ($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.iOsType == "iPad" && appVersion >= 135) { // 아이패드 버전 135 이상
					window.location = "lottebridge://splashinfo/" + gen + "?" + age;
				}
			}
		}

		// 사용자 MBRNO APP에 전달 20160125 - 정지훈 대리
		var sendMbrNoFlag = false;

		function sendAppMbrNo() {
			var mbrNo = LotteCookie.getCookie("MBRNO");

			if (mbrNo && !sendMbrNoFlag) {
				sendMbrNoFlag = true;

				if ($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 257) { // Android 2.57 이상 버전
					try {
						// if (window.lottebridge.sendMbrNo) {
						// 	window.lottebridge.sendMbrNo(mbrNo);
						// 	console.log("앱 mbrNo 전달", mbrNo);
						// }
					} catch (e) {}
				} else if (($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.verNumber >= 2530) || // iPhone 2.52.9 버전 이상
					($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.verNumber >= 220)) { // iPad 2.19 버전 이상

					$timeout(function () { // 스플래시 호출과 붙어 있어 URL로 전달 되는 scheme 이 제대로 전달 되지 않는 문제로 1초 딜레이
						window.location = "lottebridge://sendMbrNo/" + mbrNo;
						console.log("앱 mbrNo 전달", mbrNo);
					}, 2000);
				}
			}
		}

		/*****************************************
		 * 날짜 세팅
		 *****************************************/
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

		var todayDateTime = new Date(),
			todayDate = todayDateTime.getFullYear() + getAddZero(todayDateTime.getMonth() + 1) + getAddZero(todayDateTime.getDate()), // 년월일
			todayTime = todayDateTime.getTime(); // TimeStemp

		/********************************************
		 * TEST Func. - 테스트를 위한 코드 추가
		 ********************************************/
		// 날짜 설정으로 운영되는 요소에 대한 테스트 코드
		if (commInitData.query["testDate"]) {
			var testDateStr = commInitData.query["testDate"];
			todayDate = commInitData.query["testDate"]; // 년월일
			todayTime = getTime(
				todayDate.substring(0, 4), // 년
				todayDate.substring(4, 6), // 월
				todayDate.substring(6, 8), // 일
				todayDate.substring(8, 10), // 시간
				todayDate.substring(10, 12), // 분
				todayDate.substring(12, 14)); // 초
		}

		// Native APP Test - 앱으로 인식 시키기 위하여 cn값이 23일 경우 쿠키값 강제 세팅
		if ($location.host() == "localhost" && commInitData.query["cn"] == "23") {
			LotteCookie.setCookie("CHLNO", "23");
		}
		/*
		// 태블릿 출석도장 이벤트 관련 M제휴판촉 - 플래티넘 대상 기획전 표시 여부 1/25~1/31 20160119
		if ((todayTime >= getTime(2016, 1, 25) && todayTime < getTime(2016, 2, 1)) || commInitData.query['platinum'] == "Y") {
			$scope.platinumPlanshopFlag = true;
		}

		// 20주년 이거어때탭 BigDeal 영역 타이틀 변경 Flag (2016-04-04 08:00:00 ~ 2016-04-23 23:59:59)
		if (todayTime >= getTime(2016, 4, 4, 8) && todayTime < getTime(2016, 4, 24)) {
			$scope.recomTabBigDealTitFlag = true;
		}

		// 이거어때, 빅딜탭 상단 top 배너 (5/16 00시 00분~ 5/17 23시)
		if (todayTime >= getTime(2016, 5, 16) && todayTime < getTime(2016, 5, 18)) {
			$scope.recombigTopBanner = true;
		}
		// 이거어때, 빅딜탭 상단 top 배너 (5/18 00:00 ~ 5/19 23:59)
		if (todayTime >= getTime(2016, 5, 18) && todayTime < getTime(2016, 5, 20)) {
			$scope.recombigTopBanner2 = true;
		}

		// 이거어때, 빅딜탭 상단 top 배너 (5/20 00:00 ~ 5/22 23:59)
		if (todayTime >= getTime(2016, 5, 20) && todayTime < getTime(2016, 5, 23)) {
			$scope.recombigTopBanner3 = true;
		}

		// 이거어때, 빅딜탭 상단 top 임직원 배너 (5/23 00:00 ~ 5/31 23:59)
		if (todayTime >= getTime(2016, 5, 23) && todayTime < getTime(2016, 6, 1)) {
			$scope.recombigTopBanner4 = true;
		}

		// 이거어때, 빅딜탭 상단 top 임직원 배너 (5/23 00:00 ~ 5/31 23:59)
		if (todayTime >= getTime(2016, 5, 23) && todayTime < getTime(2016, 6, 1)) {
			$scope.recombigTopBanner4 = true;
		}
		*/
		// 이거 어때 new 표시 Flag 빼기 (2016-04-04 08:30:00)
		if (todayTime < getTime(2016, 4, 4, 8, 30)) {
			$scope.menuNewFlag = true;
		}
		/*
		// 백화점 Sale Flag ( ~ 2016.7.25 00:00:00)
		if (todayTime < getTime(2016, 7, 25)) {
			$scope.menuSaleFlag = true;
		}
		*/
		// 이거어때, 빅딜탭 상단 top 배너
		$scope.bannerShow = function(sy, sm, sd, ey, em, ed){
			var flag = false;
			if (todayTime >= getTime(sy, sm, sd) && todayTime < getTime(ey, em, ed)) {
				flag = true;
			}
			return flag;
		}
        //탑배너 베이스 파람 추가
        $scope.goBannerLink = function(str){
            window.location.href  = str + "&" + $scope.baseParam;
        }
        //20170223 :이거어때,백화점 배너 shuffle (랜덤적용여부)
        $scope.banner_shuffle = function(len, shuffle){
            var bn_order = new Array(len);
            var tmpar = 0;
            var tmpindex = 0;
            var tmpmax = bn_order.length;
            if(shuffle){
                tmpmax += 20;
            }
            for(var s=0; s < tmpmax; s++){
                if(s < bn_order.length){
                    bn_order[s] = s;
                }else{
                    tmpindex = Math.floor(Math.random()*(bn_order.length - 1));
                    tmpar = bn_order[tmpindex];
                    bn_order[tmpindex] = bn_order[tmpindex + 1];
                    bn_order[tmpindex + 1] = tmpar;
                }
            }
            //console.log(bn_order);
            return bn_order;
        }


		/********************************************
		 * Util Func.
		 ********************************************/
		// Index에 맞는 헤더 메뉴 DispNo 구하기
		$scope.getHeaderMenuDispNo = function (idx) {
			return $scope.pageUI.rootMenu.length > idx ? $scope.pageUI.rootMenu[idx].disp_no : 0;
		};

		// DispNo에 맞는 헤더 메뉴 Index 구하기
		$scope.getHeaderMenuIdx = function (dispNo) {
			var i = 0, rtnIdx = 0;

			for (i = 0; i < $scope.pageUI.rootMenu.length; i++) {
				if ($scope.pageUI.rootMenu[i].disp_no == dispNo) {
					rtnIdx = i;
					break;
				}
			}

			return rtnIdx;
		};

		// DispNo에 맞는 헤더 메뉴로 메뉴 위치 이동
		$scope.setHeaderMenuIdxPos = function (dispNo, disableAnimation) {
			$timeout(function () { // timeout을 주지 않으면 DOM 렌더링이 끝나지 않아 탭의 넓이 계산에서 오류가 나 제대로 찾아가지 못한다.
				//$scope.moveMenuSwipeFnc($scope.getHeaderMenuIdx(dispNo), disableAnimation); // 메인탭 2Depth Index 초기화(0) 위치로 이동 : moveMenuSwipeFnc - Swipe 없이 이동
				var $headerMenu = angular.element("#gnb nav[lotte-slider]"),
					$headerMenuWrap = $headerMenu.find(">ul"),
					$headerMenuList = $headerMenuWrap.find(">li"),
					$target = $headerMenuList.eq($scope.getHeaderMenuIdx(dispNo)),
					targetPosX = 0,
					animateTime = disableAnimation ? 0 : 200;

				if ($headerMenu.length > 0 && $headerMenuWrap.length > 0 && $target.length > 0 && $headerMenu.width() < $headerMenuWrap.width()) {
					targetPosX = ($headerMenu.width() / 2) + $headerMenuWrap.offset().left - ($target.offset().left + ($target.outerWidth() / 2));
					angular.element("#gnb nav[lotte-slider]").scope().lotteSliderMoveXPos(targetPosX, animateTime);
				}
			}, 0);
		};

		// 메인 메뉴 이동
		$scope.moveMenu = function (dispNo, disableAnimation) {
			$scope.pageUI.curMenuDispNo = dispNo; // 현재 선택된 Menu DispNo 저장 및 템플릿 변경
			$scope.pageUI.curMenuIdx = $scope.getHeaderMenuIdx(dispNo); // 현재 선택된 Menu Index 저장
			$scope.setCurDisp($scope.pageUI.curMenuDispNo);
			$scope.setHeaderMenuIdxPos(dispNo, disableAnimation); // 메뉴 위치 이동
		};

		// DispNo에 맞는 전시 인입코드, 인입카테고리 세팅 (상품상세 페이지 이동시 매출집계를 위해 필요함)
		$scope.setCurDisp = function (dispNo) {
			$scope.pageUI.curDispNo = dispNo;
			clearInterval($rootScope.vTimer);

			if (dispNo == "5553631") { // 이거어때탭
				$scope.pageUI.curDispNoSctCd = "45";
			} else if (dispNo == "5553715") { // 빅딜탭
				$scope.pageUI.curDispNoSctCd = "12";
			} else if (dispNo == "5553646") { // 백화점탭
				$scope.pageUI.curDispNoSctCd = "43";
			} else if (dispNo == "5550633") { // 스타일샵탭
				$scope.pageUI.curDispNoSctCd = "46";
			} else if (dispNo == "5555564") { // 일반탭
				$scope.pageUI.curDispNoSctCd = "47";
			} else {
				$scope.pageUI.curDispNoSctCd = "";
			}
			/* else if (dispNo == "5544340") { // 스토리샵탭

			} else if (dispNo == "5537336") { // 이벤트탭

			}*/
		};

		// 배너 일반/아웃 링크 처리
		$scope.linkUrl = function (url, outlinkFlag, tclick, addParams) {

			if (outlinkFlag) {
				$scope.sendOutLink(url); // 외부 링크 보내기 (새창)

				if (tclick) { // tclick이 있다면
					$scope.sendTclick(tclick); // 외부링크일때 iframe으로 tclick 전송
				}
			} else {
				var url = $scope.baseLink(url) ; // 링크 url에 base parameter를 붙여준다.

				if (addParams) { // 추가 파라메타가 있다면
					angular.forEach(addParams, function (val, key) {
						url += "&" + key + "=" + val;
					});
				}

				if (url.indexOf('curDispNo') == -1) { // url에 전시 유입코드가 없다면 붙여줌
					url += "&curDispNo=" + $scope.pageUI.curDispNo;
				}

				if (url.indexOf('curDispNoSctCd') == -1 && $scope.pageUI.curDispNoSctCd) { // url에 전시 유입상세 코드가 없으면서 실제 전시 유입코드 상세 값이 있으면 붙여줌
					url += "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
				}

				if (tclick) { // tclick 이 있다면 url 뒤에 parameter를 추가한다.
					url += "&tclick=" + tclick;
				}

				if ( (url + "").indexOf('main_phone.do?dispNo=') != -1 ) { // 링크 메인탭 이동시 url 변경이 한번 된 후 는 이동이 안되는 현상 예외처리
					if(tclick){
                        $scope.sendTclick(tclick);
                    }

                    var disp_no_start = url.indexOf('dispNo=') + 7;
					var header_menu_dispno = url.substr(disp_no_start, 7);
					$scope.headerMenuClick(header_menu_dispno);
				} else {
					window.location.href = url; // url 이동
				}
			}
		};

		/********************************************
		 * Callback Func.
		 ********************************************/
		// 메인 Swipe End CallbackFunc.
		$rootScope.mainSwipeReset = function ($event) {
			var targetIdx = 0;

			if ($event.moveto == "left") { // 스와이프 좌측 이동 <<<
				targetIdx = $scope.pageUI.rootMenu.length <= $scope.pageUI.curMenuIdx + 1 ? 0 : $scope.pageUI.curMenuIdx + 1;
			} else { // 스와이프 우측 이동 >>>
				targetIdx = $scope.pageUI.curMenuIdx == 0 ? $scope.pageUI.rootMenu.length - 1 : $scope.pageUI.curMenuIdx - 1;
			}

			var targetDispNo = $scope.getHeaderMenuDispNo(targetIdx);

			$scope.sendTclick("m_DC_category_s_" + targetDispNo); // Tclick
			$scope.moveMenu(targetDispNo); // 메뉴 이동
			$scope.translateX_Reset(); // 스와이프 좌표 리셋

			// 20160622 박형윤 앱다운로드 배너 추가
			if ($scope.pageUI.winScrollHeaderDownFlag) {
				$scope.beforeScrollPos = $scope.screenType > 1 ? $scope.mainHeaderHeight.tablet : $scope.mainHeaderHeight.mobile; // 기존 스크롤 위치 90으로 초기화
				$win.scrollTop($scope.screenType > 1 ? $scope.mainHeaderHeight.tablet : $scope.mainHeaderHeight.mobile); // 윈도우 스크롤 위치 최상단으로
			} else {
				$scope.beforeScrollPos = 0; // 기존 스크롤 위치 90으로 초기화
				$win.scrollTop(0); // 윈도우 스크롤 위치 최상단으로
			}
		};

		/*****************************************
		 * 요건에 따른 초기 설정값 세팅
		 *****************************************/
		// 20160418 박형윤 - 이거어때/빅딜 50:50 랜딩
		if (todayTime >= getTime(2016, 8, 11)) { // 메인 랜딩 기준 일시변경
			var randomDefaultRendingDispNo = "5553631";
			var initRendingDispNoArr = [
				"5553631", // 이거어때
				"5553715" // 빅딜
			];

			var mainDefaultRendingDispNo = LotteCookie.getCookie('defaultRendingDispNo');

			if (mainDefaultRendingDispNo && initRendingDispNoArr.indexOf(mainDefaultRendingDispNo) > -1) {
				$scope.pageUI.defaultRendingDispNo = mainDefaultRendingDispNo;
			} else {
				randomDefaultRendingDispNo = initRendingDispNoArr[Math.floor(Math.random() * initRendingDispNoArr.length)];
				LotteCookie.setCookie("defaultRendingDispNo", randomDefaultRendingDispNo, undefined);
				$scope.pageUI.defaultRendingDispNo = randomDefaultRendingDispNo;
			}
		}
		$scope.menuTwentyFlag = true;

		// URL Parameter에 dispNo Parameter가 있다면 해당 번호로 Default Rending 탭 설정
		if (commInitData.query['dispNo'] != undefined) {
			$scope.pageUI.defaultRendingDispNo = commInitData.query['dispNo'];
		}

		// [MITFT 요건] 앱일때 채널 상세 번호 3168661로 변경
		var chlno = LotteCookie.getCookie("CHLNO");

        //LotteCookie.setCookie("CHLDTLNO", "MITFTChlNo", undefined, ".lotte.com"); // cdn 값 변경
        //LotteCookie.getCookie("CHLDTLNO", MITFTChlNo, undefined, "lotte.com"); // cdn 값 변경

		if (chlno == "23" && $scope.appObj.isApp) { // 앱일때만 채널상세번호 3168661로 변경
			var MITFTChlNo = "3168661";
			LotteCookie.setCookie("CHLDTLNO", MITFTChlNo, undefined, "lotte.com"); // cdn 값 변경
			$scope.baseParam = $scope.baseParam.replace(/cdn=[0-9]+|cdn=?/, "cdn=" + MITFTChlNo); // BaseParameter 변경
		}

		$scope.afterInitDataChk = function () {
			var deferred = $q.defer();

			LotteUserService.loadLoginInfoComplete.then(function () {
				/*****************************************
				 * 로그인 데이터 확인 이후 처리 로직
				 *****************************************/
				$scope.pageUI.isLoginData = $scope.loginInfo.isLogin; // 로그인 상태값 저장

				// 앱 인터페이스 호출
				if ($scope.appObj.isApp) { // 앱일 경우 스플래시, mbrNo 정보 전달
					callAppSplashInfo(); // 스플래시 정보 전달
					sendAppMbrNo(); // mbrNo 정보 전달

					// $scope.$watch('loginInfo', function (newValue, oldValue) {
					// 	if (newValue === oldValue) {
					// 		return;
					// 	}

					// 	callAppSplashInfo(); // 스플래시 정보 전달
					// 	sendAppMbrNo(); // mbrNo 정보 전달
					// });
				}

				/*****************************************
				 * SessionStorage 데이터 처리
				 *****************************************/
				// sessionStorage - 세션에서 가저올 부분 선언
				var lotteMainLoc = LotteStorage.getSessionStorage('lotteMain2016Loc');
				var lotteMainDataStr = LotteStorage.getSessionStorage('lotteMain2016Data');
				var lotteMainScrollY = LotteStorage.getSessionStorage('lotteMain2016ScrollY');

				var dataLoadFlag = true;

				if (lotteMainLoc == $location.absUrl() && lotteMainDataStr != null && commInitData.query["localtest"] != "true") { // 현재 URL과 session storage에 저장된 경로가 동일 할 경우
					var sessionData = JSON.parse(lotteMainDataStr);

					if (sessionData.rootMenu && sessionData.rootMenu.length > 0 && $scope.loginInfo.isLogin == sessionData.isLoginData) { // 세션 이용
						$scope.pageUI = sessionData;
						dataLoadFlag = false;

						$timeout(function () {
							$win.scrollTop(lotteMainScrollY);
							$scope.moveMenu($scope.pageUI.curMenuDispNo, true); // 메뉴 위치 이동
						}, 500);
					} else if (sessionData.rootMenu && sessionData.rootMenu.length > 0 && sessionData.curMenuDispNo && sessionData.curMenuDispNo != "") {
						$scope.pageUI.curMenuDispNo = sessionData.curMenuDispNo;

						$timeout(function () {
							$win.scrollTop(lotteMainScrollY);
						}, 500);
					}
				}

				deferred.resolve(dataLoadFlag);
			});

			return deferred.promise;
		};

		$scope.afterInitDataChkDefer = $scope.afterInitDataChk();
	}]);

	// Main Header Controller
	app.controller('lotteHeaderMainCtrl', ['$scope', '$window', '$http', '$timeout', 'LotteCommon', 'LotteCookie', 'commInitData', 'LotteStorage',
		function ($scope, $window, $http, $timeout, LotteCommon, LotteCookie, commInitData, LotteStorage) {
		$scope.stylePushFlag = false;
		$scope.speechSrhFlag = false;
		$scope.showStyleDesc = false;
		$scope.cartCount = 0;

		// 스타일 추천 안내레이어 쿠키 확인
		// if (!LotteCookie.getCookie("stylePushDesc")) {
		// 	$scope.showStyleDesc = true;
		// }

		// Main Header Menu Load
		function getRootMenu() {
			$http.get(LotteCommon.rootMenuData2016, {params : {preview : $scope.previewDate}})
			.success(function (data) {
				if (!data.root_menu)
					return false;

				var displayMenuList = [],
					i = 0,
					validateDefatultTab = false;

				for (i = 0; i < data.root_menu.length; i++) { // 전시중인 카테고리 확인/초기탭 유효성 검사
					//20161007 no 7자리 아닐경우, 숫자가 아닐경우, nm이 빈값일 경우 탭 안보임
					if(data.root_menu[i].disp_no.length != 7 || (/[^0-9]/).test(data.root_menu[i].disp_no) || data.root_menu[i].disp_nm == '') continue;

					// 20160401 박형윤 스무살의봄 탭으로 인하여 추가 조건 적용
					if (data.root_menu[i].disp_no != "5554294" || (data.root_menu[i].disp_no == "5554294" && $scope.eventOpenFlag)) {
						displayMenuList.push(data.root_menu[i]);
					}

					if ($scope.pageUI.defaultRendingDispNo == data.root_menu[i].disp_no) {
						validateDefatultTab = true;
					}
				}


				if (!validateDefatultTab && displayMenuList[0]) { // Default Rending Tab 전시번호가 데이터에 없을 경우 첫번째 데이터의 탭으로 이동되도록
					$scope.pageUI.defaultRendingDispNo = displayMenuList[0].disp_no;
				}

				$scope.pageUI.rootMenu = displayMenuList; // Menu 데이터 바인딩

				// 초기 랜딩시 탭 Tclick
				var rendingTabDispNo = $scope.pageUI.defaultRendingDispNo;

				if ($scope.pageUI.curMenuDispNo && $scope.pageUI.curMenuDispNo != "") {
					rendingTabDispNo = $scope.pageUI.curMenuDispNo;
				}

				$scope.sendTclick("m_DC_category_pv_" + rendingTabDispNo);
				$scope.moveMenu(rendingTabDispNo, true); // 초기 Default 메뉴로 메뉴 위치 이동
			})
			.finally(function (data) { // Success던 Error던 항상 실행
				console.log("finally");

				// console.timeStamp("Main Load");

				// 메인 화면 나타나는 시점을 앱에 Call 하여 스플래시 제거되도록
				if ($scope.appObj.isAndroid && commInitData.query["schema"] == "mlotte001" && $scope.appObj.verNumber >= 223) { // 안드로이드 버전 223 이상
					try {
						console.timeStamp("앱 스플래시 제거");

						if (window.lottebridge && window.lottebridge.splashEnd) {
							window.lottebridge.splashEnd();
						}
					} catch (e) {
						console.info("앱 스플래시 제거 없음");
					}
				}
			});
		}

		// 세션스토리지 체크가 완료 된 이후 메뉴 동작 (defer 사용)
		$scope.afterInitDataChkDefer.then(function (dataLoadFlag) {
			if (dataLoadFlag) {
				getRootMenu();
			}
		});

		// 음성검색 활성화 여부 (버전 변경 필요)
		(function chkSpeechSrh() {
			if (/*LotteCommon.isTestFlag || // LocalTestFlag 체크*/
				($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 259) || // 안드로이드 체크, skt앱 체크(지원x), 버젼체크(2.5.5 이상)
				($scope.appObj.isAndroid && $scope.appObj.isSktApp && $scope.appObj.verNumber >= 203) || // 안드로이드 T롯데닷컴 버전체크 (2.0.2 이상)*/
				($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.verNumber >= 2550) || // ios 체크, 버젼체크(2.53.0 이상)
				($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.verNumber >= 222) // 아이패드 체크, 버젼체크(2.2.0 이상)
			   ) {
				$scope.speechSrhFlag = true;
			}
		})();

		// console.log("$scope.speechSrhFlag", $scope.speechSrhFlag, $scope.appObj);

		// 스타일 추천 활성화 여부
		(function chkStylePush() {
			if (/*LotteCommon.isTestFlag || // LocalTestFlag 체크*/
				($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber > 254) || // 안드로이드 체크, skt앱 체크(지원x), 버젼체크(2.5.5 이상)
				($scope.appObj.isAndroid && $scope.appObj.isSktApp && $scope.appObj.verNumber >= 202) || // 안드로이드 T롯데닷컴 버전체크 (2.0.2 이상)
				($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.verNumber > 2529) || // ios 체크, 버젼체크(2.53.0 이상)
				($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.verNumber > 219) // 아이패드 체크, 버젼체크(2.2.0 이상)
			   ) {
				$scope.stylePushFlag = true;
			}
		})();

		// 장바구니 개수 조회
		function chkCartCount (sessionChk) {
			var cartCount = LotteCookie.getCookie("cartCount"),
				arrURLExceptions = [
					// LotteCommon.mainUrl, // 메인
					"/mylotte/cart/m/cart_list.do", // 장바구니
					"/order/m/order_complete.do" // 주문완료
				];

			if (cartCount && cartCount != "" && sessionChk === true && arrURLExceptions.indexOf(location.pathname + "") == -1 && !commInitData.query.localtest) {
				$scope.cartCount = parseInt(cartCount);
			} else {
				$http.get(LotteCommon.cartCountData2016)
				.success(function (data) {
					LotteCookie.setCookie("cartCount", data.cart_count);
					$scope.cartCount = data.cart_count;
				});
			}
		}

		angular.element($window).on({
			"load": function () {
				chkCartCount(true);
			},
			"refreshCartCount": chkCartCount // 카트 카운트 조회 이벤트 등록
		});

		var scrollEnabledFlag = true;

		// 화면 스크롤시 헤더 동작
		$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
			var gap = Math.abs(args.scrollPos - $scope.beforeScrollPos);

			// 20160622 박형윤 - 앱다운로드 배너 추가
			var limitYPos = $scope.screenType > 1 ? $scope.mainHeaderHeight.tablet : $scope.mainHeaderHeight.mobile;

			if (gap > 5 && scrollEnabledFlag) { // 차이가 5픽셀 이상일 경우에만 (떨림 방지)
				var scrollDownFlag = args.scrollPos > $scope.beforeScrollPos;
				$scope.beforeScrollPos = args.scrollPos;
				scrollEnabledFlag = false;

				// if (args.scrollPos > limitYPos) {
				// 	$scope.winScrollHeaderFixed = true;
				// } else if (args.scrollPos == 0) {
				// 	$scope.winScrollHeaderFixed = false;
				// }

				if (scrollDownFlag && args.scrollPos > limitYPos) { // 아래로 스크롤 (스크롤 위치가 34 이상일때만)
					$scope.pageUI.winScrollHeaderDownFlag = true;
				} else { // 위로 스크롤
					$scope.pageUI.winScrollHeaderDownFlag = false;
				}

				$timeout(function () {
					scrollEnabledFlag = true;
				}, 300);
			} else if (args.scrollPos < limitYPos) {
				$scope.pageUI.winScrollHeaderDownFlag = false;
			}

			// 3.엘팟 아이콘 스크롤시 비노출
			if (args.scrollPos > 3000) {
				if ($scope.appLpotIconFlag == true && $scope.appObj.isApp && $scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 279) {
					$scope.appLpotIconFlag == false;
					try {
				 		window.lottebridge.lpot(false);
					} catch (e) {}
				}
			}

		});
	}]);

	// Main Header Directive
	app.directive('lotteHeaderMain', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage',
		function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage) {
		return {
			templateUrl : "/lotte/resources_dev/main/lotte_header_main_2016.html",
			replace : true,
			controller: "lotteHeaderMainCtrl",
			link : function ($scope, el, attrs) {
				var $win = angular.element($window);

				// 메인으로 링크
				$scope.gotoMainHeader = function () {
					//$scope.sendTclick($scope.tClickBase + "header_Clk_Btn_1");
					$scope.gotoMain();
				};

				// 장바구니 이동
				$scope.gotoCart = function () {
					$window.location.href = LotteCommon.cartLstUrl + '?' + $scope.baseParam + '&tclick=m_DC_header_cartlist';
				};

				// 상단 검색 레이어
				$scope.showSrhLayerHeader = function () {
					$scope.sendTclick($scope.tClickBase + "header_Clk_Lyr_1");
					$scope.showSrhLayer(true);
				};

				// 검색 레이어 보기
				$scope.showSrhLayer = function (tFlag) {
					if (!tFlag) {
						$scope.sendTclick($scope.tClickBase + "header_Clk_Lyr_2");
					}

					var app_call = "lottesearch://newsearch";

					// 최근본상품 추가
					var ao = $scope.appObj;
					var isLatelyGoodsApp = false;
					if(ao.isIOS){
						if(ao.isIpad && ao.verNumber>=237){
							isLatelyGoodsApp = true;
						}else if(ao.verNumber>=2710){
							isLatelyGoodsApp = true;
						}
					}else if(ao.isSktApp && ao.verNumber >= 215){
						isLatelyGoodsApp = true;
					}else if(ao.verNumber >= 279){
						isLatelyGoodsApp = true;
					}
					if(isLatelyGoodsApp){
						var lately = LotteStorage.getLocalStorage("latelyGoods");
						if(lately != null && lately != ""){
							lately = lately.replace(/\|/g, ",");
							app_call += "?latelyGoods=" + lately;
						}
					}
					// 최근본상품 추가

					if ($scope.appObj.isApp && ! $scope.appObj.isIOS && !$scope.appObj.isOldApp) {
						try {
							$window.lottesearch.callAndroid(app_call);
						} catch (e) {}
						return;
					}

					if ($scope.appObj.isApp && $scope.appObj.isIOS && !$scope.appObj.isIpad) {
						$window.location.href =  app_call;
						return;
					} else if ($scope.appObj.isApp && $scope.appObj.isIOS && ($scope.appObj.isIpad && !$scope.appObj.isOldApp)) {
						$window.location.href =  app_call;
						return;
					}

					$scope.showRecentKeyword();
				};

				// 음성검색 링크
				$scope.speechSrhLink = function () {
					if ($scope.speechSrhFlag) {
						var tclick = "m_DC_header_Clk_Btn_voice_";

						if ($scope.appObj.isSktApp) {
							tclick += "tlotte";
						} else if ($scope.appObj.isIOS) {
							tclick += "ios";
						} else {
							tclick += "and";
						}

						$scope.sendTclick(tclick);


						var app_call = "lottesearch://newsearch/speech";

						// 최근본상품 추가
						var ao = $scope.appObj;
						var isLatelyGoodsApp = false;
						if(ao.isIOS){
							if(ao.isIpad && ao.verNumber>=237){
								isLatelyGoodsApp = true;
							}else if(ao.verNumber>=2710){
								isLatelyGoodsApp = true;
							}
						}else if(ao.isSktApp && ao.verNumber >= 215){
							isLatelyGoodsApp = true;
						}else if(ao.verNumber >= 279){
							isLatelyGoodsApp = true;
						}
						if(isLatelyGoodsApp){
							var lately = LotteStorage.getLocalStorage("latelyGoods");
							if(lately != null && lately != ""){
								lately = lately.replace(/\|/g, ",");
								app_call += "?latelyGoods=" + lately;
							}
						}
						// 최근본상품 추가

						if ($scope.appObj.isApp && ! $scope.appObj.isIOS && !$scope.appObj.isOldApp) {
							try {
								$window.lottesearch.callAndroid(app_call);
							} catch (e) {}
							return;
						} else if ($scope.appObj.isApp && $scope.appObj.isIOS) {
							$window.location.href =  app_call;
							return;
						}
					}
				};

				// 스타일 추천 링크
				$scope.stylePushLink = function () {
					if ($scope.stylePushFlag) {
						var tclick = "m_DC_header_Clk_Btn_style_";

						if ($scope.appObj.isSktApp) {
							tclick += "tlotte";
						} else if ($scope.appObj.isIOS) {
							tclick += "ios";
						} else {
							tclick += "and";
						}

						$window.location.href = LotteCommon.stylePushIntroUrl + "?" + $scope.baseParam + "&tclick=" + tclick;
					}
				};

				// 스타일 푸시 안내 레이어 감추기
				// $scope.hideStylePushDesc = function () {
				// 	$scope.showStyleDesc = false;
				// 	LotteCookie.setCookie("stylePushDesc", "hide", 365);
				// };

				// 헤더 상단 메뉴 클릭 (GNB)
				$scope.headerMenuClick = function (dispNo) {
					$scope.sendTclick("m_DC_category_click_" + dispNo);
					$scope.moveMenu(dispNo);

					if ($scope.pageUI.winScrollHeaderDownFlag) {
						$scope.beforeScrollPos = 90; // 기존 스크롤 위치 90으로 초기화
						$win.scrollTop(90); // 윈도우 스크롤 위치 최상단으로
					} else {
						$scope.beforeScrollPos = 0; // 기존 스크롤 위치 90으로 초기화
						$win.scrollTop(0); // 윈도우 스크롤 위치 최상단으로
					}
				};
			}
		}
	}]);

	// Main Menu
	app.directive('mainMenu', ['$timeout', function ($timeout) {
		return {
			link : function ($scope, element, attrs) {
				$scope.menuLeftChk = false;
				$scope.menuRightChk = false;

				var $gnbMenu = angular.element("#gnb >nav[lotte-slider]");

				$gnbMenu.on("slide", function (e) {
					if (Math.abs(e.posX) > 0) {
						$scope.menuLeftChk = true;
					} else {
						$scope.menuLeftChk = false;
					}

					if (e.posX > e.wrapWidth - e.contWidth) {
						$scope.menuRightChk = true;
					} else {
						$scope.menuRightChk = false;
					}

					$timeout(function () {
						$scope.$apply();
					});
				});
			}
		}
	}]);

	// Main Container
	app.directive('lotteContainer', [function () {
		return {
			templateUrl : '/lotte/resources_dev/main/main_container_2016.html',
			replace : true,
			link : function ($scope, element, attrs) {
			}
		}
	}]);

	// Swipe Content Container
	app.directive('contentContainer', ['$compile', '$http', '$templateCache','$timeout','$window', function ($compile, $http, $templateCache,$timeout,$window) {
		return {
			restrict: 'AEC',
			replace : true,
			transclude: true,
			link : function ($scope, element, attrs) {
                //이거어때, 빅딜 코너화 배너 20161123
                $scope.bannerBox = {};
                var previewstr = "";
                if($scope.previewDate != undefined){
                    previewstr = "?preview=" + $scope.previewDate;
                }
                //20161214 로드타이밍 수정
                angular.element($window).on({
                    "load.banner": function () {
                        $timeout(function(){
                            $http.get("/json/main/main_recomm_bigdeal_banner.json" + previewstr)
                            .success(function (data) {
                                $scope.bannerBox = data.main_recomm_bigdeal_banner;
                            });
                        }, 500);
                    }
                });
                $scope.getRbTclick = function(code){
                    var rb_tlcikCode = "m_DC_menu"+code+"_Clk_TOP_";
                    switch ($scope.loginInfo.gradeCd){
                        case "10": rb_tlcikCode = rb_tlcikCode + "PLTN01"; break;
                        case "20": rb_tlcikCode = rb_tlcikCode + "PLTN02"; break;
                        case "30": rb_tlcikCode = rb_tlcikCode + "PLTN03"; break;
                        case "40": rb_tlcikCode = rb_tlcikCode + "GOLD"; break;
                        case "50": rb_tlcikCode = rb_tlcikCode + "SILV"; break;
                        default: rb_tlcikCode = rb_tlcikCode + "COMN"; break; // 기타 또는 예외
                    }
                    return rb_tlcikCode;
                }


				// 템플릿 판단
				function loadTpml(dispNo, disableAnimation) {
					var tpmlPath = "",
						tpmlBasePath = "/lotte/resources_dev/main/tpml/";

					switch (dispNo) {
						case "5553631": tpmlPath = tpmlBasePath + "tpml_recom.html"; break; // 이거어때
						case "5553715": tpmlPath = tpmlBasePath + "tpml_bigdeal.html"; break; // 빅딜
						case "5553646": tpmlPath = tpmlBasePath + "tpml_dept.html"; break; // 백화점
						case "5547174": tpmlPath = tpmlBasePath + "tpml_planshop.html"; break; // 기획전
						case "5550633": tpmlPath = tpmlBasePath + "tpml_styleshop.html"; break; // 스타일샵
						case "5544340": tpmlPath = tpmlBasePath + "tpml_storyshop.html"; break; // 스토리샵
						case "5537336": tpmlPath = tpmlBasePath + "tpml_event.html"; break; // 이벤트
						case "5555564": tpmlPath = tpmlBasePath + "tpml_normal.html"; break; // 일반탭
						case "5556743": tpmlPath = tpmlBasePath + "tpml_giftpacking.html"; break; // 선물준비
						case "5542242": tpmlPath = "/lotte/resources_dev/main/template_holiday.html"; break; // 명절 20161229
						case "5562268": tpmlPath = "/lotte/resources_dev/main/template_fall.html"; break; // 가을맞이
						case "5563220": tpmlPath = tpmlBasePath + "tpml_shopnshop.html"; break;
						case "5554294": tpmlPath = tpmlBasePath + "tpml_twenty.html"; break;
						default: tpmlPath = tpmlBasePath + "tpml_bigdeal.html"; break; // 기타 또는 예외
					}

					loadTemplate(tpmlPath);
				}

				// 최초 템플릿 로드
				$scope.afterInitDataChkDefer.then(function (dataLoadFlag) {
					if ($scope.pageUI.curMenuDispNo != "") {
						loadTpml($scope.pageUI.curMenuDispNo, true);
					}
				});


				var prevScope, nowTemplate; // 이전 scope와 template을 저장하여 초기화 또는 로드하지 않기 위해

				function loadTemplate(url) { // 템플릿 불러오기
					if (!url) { // url : 템플릿 경로 (템플릿이 없으면 실행하지 않음)
						return false;
					}

					$http.get(url, { cache: $templateCache })
					.success(function (templateContent) {
						if (nowTemplate == $scope.pageUI.curMenuDispNo) { // 이전 템플릿과 새로운 템플릿이 갔다면 로드하지 않음
							return false;
						}

						nowTemplate = $scope.pageUI.curMenuDispNo;

						if (prevScope) { // 이전 scope가 있을 경우 destroy 하여 scope 메모리 초기화
							prevScope.$destroy();
							prevScope = null;
						}

						prevScope = $scope.$new();
						angular.element(element).html($compile(templateContent)(prevScope));
					});
				}

				// 템플릿 변경 Watch (Template 변경시 템플릿 로드)
				$scope.$watch('pageUI.curMenuDispNo', function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}

					loadTpml(newValue); // 템플릿 로드
				});
			}
		}
	}]);

	/*******************************************************************************************************************
	 * Template Directive
	 ******************************************************************************************************************/
	// 이거어때 탭 Controller
	app.controller('tpmlRecomCtrl', ['$scope', '$http', '$window', '$timeout', 'LotteCommon','LotteUtil', 'commInitData',
		function ($scope, $http, $window, $timeout, LotteCommon, LotteUtil, commInitData) {
		$scope.rScope = LotteUtil.getAbsScope($scope);// 2017.05.17
		$scope.ajaxLoadFlag = false;
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5553631"
			},
			contData: {} // 이거어때 Data 초기화
		};

		if (!$scope.pageUI.recomRBData) {
			$scope.pageUI.recomRBData = {
				latestData: {}, // 최근본상품 Data 초기화
				recommondData: {}, // 맞춤추천상품 Data 초기화
				prsnData: [] // 추천 기획전 Data 초기화
			};
		}

		$scope.recomRBData = {
			latestData: null, // 최근본상품 Data 초기화
			recommondData: null, // 맞춤추천상품 Data 초기화
			prsnData: null // 추천 기획전 Data 초기화
		};

		var resultCode = []; // 최근본상품 Dispno 초기화
		var resultMaxCode = []; // 최근본상품 Max 3개 Dispno 초기화
		var rbDispnoResult = ""; // 레코벨 조회 Dispno 초기화
		var prsResult = null; // 추천 기획전
	    var gender = "F"; // 성별 디폴트값 설정
	    var age = "30"; // 나이디 폴트값 설정
	    var ageRange = "30"; // 연령별 디폴트값 설정

        //생생샵 상품정보 로드
        $scope.sslive_flag = false;
        //20161202 아예 호출을 안하는 케이스가 있어서, 이벤트 제거 eung
        //20161213 로드 시점 수정
        $scope.loadSsliveInfo = function(){
            $scope.previewstr = "";
            if($scope.previewDate != undefined){
                $scope.previewstr = "preview=" + $scope.previewDate;
            }
			$http.get(LotteCommon.sslive_good +"?"+ $scope.previewstr)
			.success(function(data) {
				$scope.goods_info = data.sslive;
				if($scope.goods_info != undefined && $scope.goods_info.goods_no != 0){
					$scope.sslive_flag = true;
					setTimeout(function(){autoVideoPlay('autoVideo', '#autoVideo');}, 1500);
				}
			});
        }

		//최근본상품 데이타 재구성
		$scope.lateCodeGet = function(){
			// 최근 본 상품 없을시 리셋
            resultCode = [];
            resultMaxCode = [];

        	var lateCode = localStorage.getItem("latelyGoods");

            if(lateCode != undefined){

            	// 끝에 | 로 끝날경우 마지막 텍스트 삭제
            	if (lateCode.substring(lateCode.length - 1, lateCode.length) == "|") {
            		lateCode = lateCode.substring(0, lateCode.length - 1);
            	}

                lateCode = lateCode.split("|");

                // 최근 본 상품 dispno 스트링으로 변환
                if(lateCode.length == 1){
                    resultCode = lateCode;
                }else{
                    resultCode += (0?",":"") + lateCode;
                }

                // 레코벨에 조회하기 위해 Max 3개 스트링으로 변환
                if(lateCode.length >= 3){
                	var spliceLength = lateCode.length - 3; // 총갯수에서 3뺀 숫자에서 시작(마지막 3개 가져오기를 위해)
                	resultMaxCode = lateCode.splice(spliceLength, lateCode.length);
                }else{
                    resultMaxCode = lateCode;
                }
            }
        }

        //성별/연령대 값 분류 및 구성
        $scope.userAgeGenderSet = function(){
			if($scope.loginInfo.isLogin){ // 간편회원일 경우 해당 정보가 없어서 예외처리
	        	if ($scope.loginInfo.genSctCd && $scope.loginInfo.mbrAge) {
	                gender = $scope.loginInfo.genSctCd;
	                age = $scope.loginInfo.mbrAge;
	        	}
			}

			//TEST Func. - 테스트를 위한 코드 추가
			if (commInitData.query["gender"] || commInitData.query["age"]) {
	            if(commInitData.query["gender"]) {
	            	gender = commInitData.query["gender"];
	            }

	            if(commInitData.query["age"]) {
	            	age = commInitData.query["age"];
	            }
	        }

	        //연령대 계산
            if(0 < age && age < 30){
                ageRange = 20;
            }else if(age > 29 && age < 40){
                ageRange = 30;
            }else if(age > 39 && age < 50){
                ageRange = 40;
            }else{
                ageRange = 50;
            }
        }

        //데이타 분류
        $scope.makeData = function(){
            //테마배너 데이터 이미지배너 + 상품
            var tmp = $scope.tpmlData.contData.theme_plan1;
            if(tmp != null){
                $scope.theme1=tmp.theme_list.items.concat(tmp.theme_goods_list.items);
            }
            tmp = $scope.tpmlData.contData.theme_plan2;
            if(tmp != null){
                $scope.theme2=tmp.theme_list.items.concat(tmp.theme_goods_list.items);
            }
            //신규서비스 리플레이스처리
            tmp = $scope.tpmlData.contData.new_service;
            if(tmp != null){
                for(var i=0; i<tmp.brnd_list.items.length; i++){
                    $scope.tpmlData.contData.new_service.brnd_list.items[i].desc = tmp.brnd_list.items[i].desc.replace("&lt;br&gt;", "<br>");
                }
            }
            //20161222 배너 음성검색 기능 체크
            if($scope.tpmlData.contData.top_big_bnr != undefined){
                var bpb = $scope.tpmlData.contData.top_big_bnr.big_plan_bnr.items;
                for(var k=0; k < bpb.length; k++){
                    if(bpb[k].link_url == "voice"){
                           if(!$scope.appObj.isApp){
                            //해당기간이 아니고 앱이 아니면 제거한다.
                            $scope.tpmlData.contData.top_big_bnr.big_plan_bnr.items.splice(k, 1);
                        }
                    }
                }
            }
			$scope.aboutData = $scope.tpmlData.contData;

			//서프라이즈
			if ($scope.aboutData.surprise != null) {
				$scope.hsupriseArr1 = $scope.aboutData.surprise.items.slice(0, 1);
				$scope.hsupriseArr2 = $scope.aboutData.surprise.items.slice(1, $scope.aboutData.surprise.items.length);
			}

			//반짝 뜨는 검색어
			if ($scope.aboutData.search_keyword != null) {
				$scope.skeywodArr1 = $scope.aboutData.search_keyword.items.slice(0, 3);
				$scope.skeywodArr2 = $scope.aboutData.search_keyword.items.slice(3, $scope.aboutData.search_keyword.items.length);
			}

			//tv상품 남은 시간 표시
			if ($scope.aboutData.tv_prod != null) {
	            if ($scope.aboutData.tv_prod.end_date == "") {
	                //$("#tvTime").text("00:00:00");
	            } else {
	                var tmpStr = $scope.aboutData.tv_prod.end_date;
	                tmpStr = tmpStr.substr(5,2) +"/"+ tmpStr.substr(8,2) +"/"+ tmpStr.substr(0,4) +" "+ tmpStr.substr(11,8);
	                var endTime = new Date(tmpStr).getTime();
	                if ($scope.tvtimer != null && $scope.tvtimer != undefined) {
	                    clearInterval($scope.tvtimer);
	                }
	                $scope.tvtimer = setInterval(function() {
	                    tvRemainTimer();
	                }, 1000);
	                var tvRemainTimer = function(){
	                    var remainTime = endTime - new Date().getTime();
	                    var remainStr = "";
	                    if(remainTime < 10){
	                        clearInterval($scope.tvtimer);
	                        remainStr = "00:00:00";
	                    }else{
	                        var hour = Math.floor((remainTime / 60 / 60 ) / 1000);
	                        var min = Math.floor((remainTime / 60) / 1000) % 60;
	                        var sec = Math.floor(remainTime / 1000) % 60;
	                        (hour < 10 ? remainStr += "0" + hour + ":" : remainStr += hour + ":");
	                        (min < 10 ? remainStr += "0" + min + ":" : remainStr += min + ":");
	                        (sec < 10 ? remainStr += "0" + sec : remainStr += sec);
	                    }
	                    $("#tvTime").text(remainStr);
	                }
	            }
			}

            //이거어때 배너 랜덤 처리 20170223
            if($scope.aboutData.top_big_bnr != undefined){
                $scope.randomTopBann = $scope.aboutData.top_big_bnr.big_plan_bnr.items;
                $scope.bn_order = $scope.banner_shuffle($scope.randomTopBann.length, $scope.aboutData.top_big_bnr.img_random);
            }
		}


		//단골지점
		if($scope.loginInfo.isLogin && $scope.loginInfo.favDeptBranchNo != undefined){
			$scope.loginInfo.favDeptBranchNo.dept_branch_nm = ($scope.loginInfo.favDeptBranchNo.dept_branch_nm + "").replace(/\s/g, ""); // 단골지점명 공백제거
			$scope.h_branch_no = $scope.loginInfo.favDeptBranchNo.dept_branch_no;
			$scope.h_branch_nm = $scope.loginInfo.favDeptBranchNo.dept_branch_nm;
            if($scope.h_branch_nm == '' || $scope.h_branch_nm == null){$scope.h_branch_nm = "본점"}
            if($scope.h_branch_no == '' || $scope.h_branch_no == null){$scope.h_branch_no = "5494874"}
		}else{
            $scope.h_branch_nm = "본점";
            $scope.h_branch_no = "5494874";
        }

		// Data Load
		$scope.loadData = function (page) {
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;
			$scope.userAgeGenderSet(); // 성별/연령대 가공데이터 가져오기

			var httpConfig = {
				method: "get",
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: {
					dispNo: $scope.tpmlData.uiOpt.dispNo,
					gender: gender,
					age   : ageRange,
					branch_nm: $scope.h_branch_nm,
					branch_no: $scope.h_branch_no,
					preview : $scope.previewDate
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;

				$scope.makeData();//20160317
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장

				recomExcute(); // 추천 상품 관련 로드
			});
		};

		// 최근 본 상품 Data Load
		$scope.LoadLatestProd = function () {
			var httpConfig = {
				method: "get",
				url: LotteCommon.mainLatestProdData,
				params: {
					latest_prod: resultCode
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				var dataTotal = data.latest_prod.items != null ? data.latest_prod.items.length : 0; // 최근본상품 방어코딩 추가
				var latestSliceData = [];

				if (data.latest_prod.items && dataTotal > 0) {
					var i = 0,
						j = -1;

					for (i; i < dataTotal; i++) {
						if (i % 3 == 0) {
							j++;
							latestSliceData[j] = [];
						}

						latestSliceData[j].push(data.latest_prod.items[i]);
					}

					$scope.recomRBData.latestData = latestSliceData;
				}else {
					$scope.recomRBData.latestData = null;
				}
			})
			.finally(function () {
				$scope.pageUI.recomRBData.latestData = $scope.recomRBData.latestData;
			});

		};

		// 실시간 맞춤 추천 상품 Data Load
		function loadRealRecommnd(rbDispnoResult) {
			var httpConfig = {
				method: "get",
				url: LotteCommon.mainRealRecommData
			};

			if (rbDispnoResult) {
				httpConfig.params = {
					latest_prod: rbDispnoResult
				};
			}

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				var dataTotal = data.recommnd_prod.items != null ? data.recommnd_prod.items.length : 0; // 맞춤추천 일배치 방어코딩 추가
				var recommonSliceData = [];

				if (data.recommnd_prod.items && dataTotal > 0) {
					var i = 0,
						j = -1;

					for (i; i < dataTotal; i++) {
						if (i % 6 == 0) {
							j++;
							recommonSliceData[j] = [];
						}
						recommonSliceData[j].push(data.recommnd_prod.items[i]);
					}
					$scope.recomRBData.recommondData = recommonSliceData;
				} else {
					$scope.recomRBData.recommondData = null;
				}

			})
			.finally(function () {
				$scope.pageUI.recomRBData.recommondData = $scope.recomRBData.recommondData;
			});
		}

		// 실시간 맞춤 추천 상품 레코벨 조회
		$scope.LoadRealRecommnd = function() {
			if (resultMaxCode != "") { // 최근본상품이 있을 경우
				var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/a002?size=30&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids=" + resultMaxCode;
				$.ajax({
					type: 'post'
					, async: true
					, url: viewSaleBestLink
					, dataType  : "jsonp"
					, success: function(data) {
						var logrecom_view_result = new Array();

						if (data.results != null) {
							$(data.results).each(function(i, val) {
								logrecom_view_result.push(val.itemId);
							});
							rbDispnoResult = logrecom_view_result.join(",");
						}

						loadRealRecommnd(rbDispnoResult); //실시간 맞춤 추천 상품 Data Load
					}
					, error: function(data, status, err) {
						console.log('Data Error : 실시간 맞춤 추천 Data로드 실패');
					}
				});

			} else { // 최근본상품이 없을 경우
				//실시간 맞춤 추천 상품 Data Load
				if (LotteCommon.mainRealRecommData == undefined) {
					return false;
				}

				loadRealRecommnd(); //실시간 맞춤 추천 상품 Data Load
			}
		};

        //기획전추천 20161027
        $scope.func_planBanner = function(){
            //prsn_list
                var viewSaleBestLink = "http://rb-rec-api-apne1.recobell.io/rec/a101?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids=" + resultMaxCode;

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
                                    prsResult = logrecom_view_result.join(",");
                                }

                                //실시간 맞춤 추천 상품 Data Load
                                if(LotteCommon.mainRealRecommData == undefined){ return false; }

                                var httpConfig = {
                                    method: "get",
                                    url: LotteCommon.prsn_list,
                                    params: {
                                        spdp_no_list: prsResult
                                    }
                                };

                                $http(httpConfig)
                                .success(function (data) {
									if (data && data.banner_list) {
										$scope.recomRBData.prsnData = data.banner_list.items;
									}

									$scope.pageUI.recomRBData.prsnData = $scope.recomRBData.prsnData;
                                })
                                .error(function() {
									console.log('Data Error : 추천기획전 로드 실패');
                                })
								.finally(function () {
									$scope.pageUI.recomRBData.prsnData = $scope.recomRBData.prsnData;
								});
                        }
                        , error: function(data, status, err) {
                             console.log('Data Error : 추천기획전 로드 실패 rb-rec-api-apne1');
                        }
                });

        };

		// Stored Data Check
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
			$scope.makeData();

			recomExcute(); // 추천 상품 관련 로드
		} else {
			$scope.loadData();
		}

		// 추천 상품 관련 로드
		function recomExcute() {
			$scope.lateCodeGet();

			if ($scope.pageUI.recomRBData.latestData &&
				Object.getOwnPropertyNames($scope.pageUI.recomRBData.latestData).length) {
				$scope.recomRBData.latestData = $scope.pageUI.recomRBData.latestData;
			} else {
				$scope.LoadLatestProd();
			}

			if ($scope.pageUI.recomRBData.recommondData &&
				Object.getOwnPropertyNames($scope.pageUI.recomRBData.recommondData).length) {
				$scope.recomRBData.recommondData = $scope.pageUI.recomRBData.recommondData;
			} else {
				$scope.LoadRealRecommnd();
			}

			if ($scope.pageUI.recomRBData.prsnData &&
				$scope.pageUI.recomRBData.prsnData.length) { // $scope.pageUI.recomRBData.prsnData는 배열이라 getOwnPropertyNames 사용 안함
				$scope.recomRBData.prsnData = $scope.pageUI.recomRBData.prsnData;
			} else {
				$scope.func_planBanner();
			}


            $scope.loadSsliveInfo(); //20161213 생생샵정보 호출
            //20161213 smartAlram
			$http.get(LotteCommon.mainSmartAlramData).success(function(data) {
				$scope.smartAlramList = data.main_smart_alram_info;
			});
		}
	}]);

	// 이거어때 탭 Directive
	app.directive('tpmlRecom', ['$window', 'LotteCommon','LotteUtil', 'LotteLink', function ($window, LotteCommon,LotteUtil, LotteLink) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlRecomCtrl",
			link : function ($scope, element, attrs) {

				var NORMAL_BASE_TCLICK = "m_DC_menu_5553631_";
				var NORMAL_BASE_TCLICK2 = "tclick=" + NORMAL_BASE_TCLICK;

                //나의 나이대 20170321 3/17일자에 소스가 사라져서 다시 원복
                $scope.ageRange = "";
                if($scope.loginInfo.isLogin){
                    $scope.ageRange = parseInt(parseInt($scope.loginInfo.mbrAge)/10)*10;
                    if($scope.ageRange < 20){
                        $scope.ageRange = 20;
                    }else if($scope.ageRange > 50){
                        $scope.ageRange = 50;
                    }
                }
                //랭킹데이터 문구 20161027
                var lank_strA = ["센스만점", "하태하태!", "남다르네~", "남다르네~", "품격있는",
                                 "핵꿀템!", "가성비 갑!", "가성비 갑!", "품격있는"];
                var lank_strB = ["지금 인기 상품", "요즘 잇걸들은 이걸 샀다", "센스우먼들은 요즘 이걸 산다", "센스우먼들은 요즘 이걸 산다", "여성들이 주로 구매한 상품",
                                 "요즘 훈남들은 이걸 샀다", "그 짠돌이도 이건 샀다",  "그 짠돌이도 이건 샀다", "남성들이 주로 구매한 상품"];
                var lank_str_index = 0;
                if($scope.loginInfo.isLogin){
                    var lank_gen = 0;
                    if($scope.loginInfo.genSctCd == 'M'){//남성이면
                        lank_gen = 4;
                    }
                    lank_str_index = $scope.ageRange/10 - 1 + lank_gen;
                }
                $scope.lank_titlA = lank_strA[lank_str_index];
                $scope.lank_titlB = lank_strB[lank_str_index];
                //지금반짝뜨는 검색어 시간    20161027
                var ltoday = new Date();
                var lweekDay = ["일","월","화","수","목","금","토"];
                $scope.kewyord_time = (ltoday.getMonth() + 1) + "/" + ltoday.getDate() + "(" +lweekDay[ltoday.getDay()]+ ") " + ltoday.getHours() + "시";

				//항목별 더보기 링크 2번 스마트픽링크수정 (20160512)
				$scope.goToPage = function(gubun){
					//2017.01.02 linkurl 베이스파라미터 중복 개선
					//var linkurl = "?" + $scope.baseParam;
					var linkurl = "";
					switch (gubun) {
						case 1: linkurl = "/mall/ranking.do" + linkurl; break; // 랭킹존
						case 2: linkurl = "/mall/smartpick.do?" + linkurl + "curDispNo=5553631&curDispNoSctCd=45"; break; // 스마트픽
						case 3: linkurl = "/mall/tvShopping.do" + linkurl; break; // tv쇼핑
						case 4: linkurl = '/product/m/late_view_product_list.do' + linkurl; break;  // 최근본상품
					}
					return linkurl;
					//$window.location.href = linkurl;
				}
                //20160829 링크 + 새창 연결 중 선택 가능
                $scope.towwayLink = function(flag,title, link, tclick_b, index, infoFlag, item){
                    //20161222 음성검색 추가
                    if(link == "voice"){
                        $scope.speechSrhLink();
                        return;
                    }

                    if(flag){ //앱일때 새창으로 띄우기
                        var tclickLink = tclick_b;
                        if(index != null){
                            index = index + 1;
                            if(index < 10){
                                tclickLink = tclickLink + "0" + index;
                            }else{
                                tclickLink = tclickLink + index;
                            }
                        }
                        link = $scope.baseLink(link); //baseParam 추가
        				$scope.sendOutLink(link); // 외부 링크 보내기 (새창)
                        if (tclickLink) { // tclick이 있다면
                            $scope.sendTclick(tclickLink); // 외부링크일때 iframe으로 tclick 전송
                        }
                    }else{ //일반 링크
                        $scope.gotoLinkM(link, tclick_b, index, infoFlag, item);
                    }
                }

                //링크 이동 : 티클릭조함
                $scope.gotoLinkM = function(link, tclick_b, index, infoFlag, item, brandName){

                    var tclick = "m_DC_menu_5553631_" + tclick_b;
                    if(index!=null){
                        index = index + 1;
                        if(index < 10){
                            tclick = tclick + "0" + index;
                        }else{
                            tclick = tclick + index;
                        }
                    }
                    //개인정보 추가 : 0 : 없음, 1 : 성별, 2:성별 + 연령대
                    if(infoFlag > 0){
                        if($scope.loginInfo.isLogin){
                            tclick = tclick + "_sort_" +$scope.loginInfo.genSctCd;
                            if(infoFlag == 2){
                                tclick = tclick + "_" + $scope.ageRange;
                            }
                        }else{
                            tclick = tclick + "_sort_H";
                        }
                    }
                    if(item != null){ //상세
                        if(item == "search"){ //검색페이지
                            link = LotteCommon.searchUrl  + "?reqType=N&keyword=" + link;
                            $scope.locationParam = "SEARCH"; // 검색에서 언로드시 저장 방지용
                        }else{ //상세페이지
                            link =  LotteCommon.prdviewUrl + "?goods_no=" + item.goods_no + link;
                        }
                    }
                    // $window.location.href = link + "&tclick=" + tclick;
                    var params = {};

                    if ((link + "").indexOf("curDispNo") == -1) {
                    	params.curDispNo = $scope.pageUI.curDispNo;
                    	params.curDispNoSctCd = $scope.pageUI.curDispNoSctCd;
                    }
					if(brandName == "당일장보기"){
						if (confirm("롯데슈퍼로 이동 후 당일 장보기 서비스 이용이 가능합니다.\n롯데슈퍼로 이동 하시겠습니까?")) {
							$scope.sendOutLink(link);
						}
						$scope.sendTclick(tclick);
						return false;
					}

                    // LotteLink.goLink(link, $scope.baseParam, params);
                    $scope.linkUrl(link, false, tclick, params);
                };

                //빅딜 더보기
                $scope.bigdealMore = function(){
                    var tclick = "m_DC_menu_5553631_Clk_Bigdeal_Btn01";
                    if($scope.loginInfo.isLogin){
                        tclick = tclick + "_sort_" +$scope.loginInfo.genSctCd;
                    }else{
                        tclick = tclick + "_sort_H";
                    }
                    $scope.sendTclick(tclick);
                    $scope.headerMenuClick(5553715);
                }
                //TV편성표
                $scope.gotoTV = function(){
                    $window.location.href = "/main/tvhome.do?homeTabFlag=1" + $scope.baseParam + "&curDispNo=5537340&curDispNoSctCd=12&tclick=m_DC_menu_5553631_Clk_TV_Btn_idx02";
                }
                //스와이프 테스트
                $scope.endFnc = function(val){
                    console.log(val);
                }
								// 동영상 재생 TCLICK 처리
				$scope.movPlayTclick = function(){
					var tclick = NORMAL_BASE_TCLICK + "Clk_Video_play";
					$scope.sendTclick(tclick);
				}

				// 동영상 일시정지 TCLICK 처리
				$scope.movStopTclick = function(){
					var tclick = NORMAL_BASE_TCLICK + "Clk_Video_pause";
					$scope.sendTclick(tclick);
				}

				// 동영상 상세보기 링크
				$scope.movProdLink = function(goodsNo, tlick_b){
					var link = '',
                    	tclick = tlick_b;

					link =  LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goodsNo;
                    $scope.linkUrl(link, false, tclick);
				}

				// v-com : 동영상 음소거 TCLICK 처리
				$scope.movMuteTclick = function(tclick, tclick2){
					var tclick = NORMAL_BASE_TCLICK + tclick;
					if ($(".mov_auto_wrap .video_wrap .btn_move_volume").hasClass("mute")){
						tclick = NORMAL_BASE_TCLICK + tclick2;
					}
					$scope.sendTclick(tclick);
				};

				// TCLICK 처리
				$scope.processTclick = function(url, obj){
					var path = $scope.baseLink(url);
					path = path + "&" + NORMAL_BASE_TCLICK2;
					if(obj && obj.prefix != undefined){
						path = path + obj.prefix;
					}
					if(obj && obj.useIndex === true && obj.index != undefined){
						path = path + "_idx" + ((obj.index < 10) ? "0"+obj.index : obj.index);
					}
					if(obj && obj.useSex === true){
						if($scope.rScope.loginInfo && $scope.rScope.loginInfo.login){
							if($scope.rScope.loginInfo.genSctCd == "M" || $scope.rScope.loginInfo.genSctCd == "F"){
								path = path + "_sort_" + $scope.rScope.loginInfo.genSctCd;
							}else{
								path = path + "_sort_H";
							}
						}else{
							path = path + "_sort_H";
						}
					}
					if(obj && obj.useAge === true && $scope.rScope.loginInfo && $scope.ageRange){
						path = path + "_" + $scope.ageRange;
					}
					if(obj && obj.useDevice === true){
						if($scope.rScope.appObj.isIOS){
							path = path + "_ios";
						}else if($scope.rScope.appObj.isAndroid){
							path = path + "_and";
						}else if($scope.rScope.appObj.isSktApp){
							path = path + "_tlotte";
						}
					}
					location.href = path;
				}

				// 스크롤 이벤트 처리가 필요한 경우
				// var $cont = angular.element("body")[0];

				// $scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
				// 	if (!$scope.ajaxLoadFlag && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
				// 		$scope.loadData(++$scope.tpmlData.uiOpt.page);
				// 	}
				// });
			}
		}
	}]);

	// 빅딜 탭 Controller
	app.controller('tpmlBigdealCtrl', ['$rootScope', '$scope', '$http', 'LotteCommon', 'commInitData', 'LotteUtil',  function ($rootScope, $scope, $http, LotteCommon, commInitData, LotteUtil) {
		$scope.ajaxLoadFlag = false;
		$scope.rScope = LotteUtil.getAbsScope($scope);
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5553715",
				ctgDispNo: "5537338",
				page: 1,
				pageSize: 50,
				isLastPage: false,
				bannerList:[],
				reward_banner:null,
				bigdataChkFlag:false,
				deptChkFlag:false,
				rankType:0,
				subCtgDispNo:""
			},
			contData: {}
		};
		$scope.bottmBannerList = false;
		// 백화점에서 빅딜 더보기 클릭시 체크
		if($scope.pageUI.storedData['5553646'] && $scope.pageUI.storedData['5553646'].uiOpt.bigdealFrom === "dept"){
			$scope.pageUI.storedData['5553646'].uiOpt.bigdealFrom = null;
			$scope.tpmlData.uiOpt.deptChkFlag = false;//백화점 체크
			$scope.tpmlData.uiOpt.ctgDispNo = "5537338";//추천탭 선택
		}

		$scope.subctgDispNoIdx = []
		$scope.subctgDispNoIdx["5537338"] = '';
	    $scope.subctgDispNoIdx["5532325"] = null;
	    $scope.subctgDispNoIdx["5530948"] = null;
	    $scope.subctgDispNoIdx["5532629"] = null;
	    $scope.subctgDispNoIdx["5532649"] = null;
	    $scope.subctgDispNoIdx["5532664"] = null;

		/* 메뉴 랜덤 추천 70%
		var dealMenuArr = ["5537338","5537338","5537338","5537338","5537338","5537338","5537338","5532325","5530948","5532629","5532649","5532664"];
		//var dealMenuArr = ["5537338","5532325","5530948","5532629","5532649","5532664"];
		$scope.tpmlData.uiOpt.ctgDispNo = dealMenuArr[Math.floor(Math.random()*dealMenuArr.length)];
		*/
		//$scope.ctgClickFlag = false;
		// Data Load
		$scope.loadData = function (page) {
			if($scope.ajaxLoadFlag){ return false; }

			$scope.ajaxLoadFlag = true;
			$scope.tpmlData.uiOpt.page = !page || page < 1  ? 1 : page; // 로드 페이지 세팅
			//카테고리 default 설정
			if ($rootScope.isDirectCate && commInitData.query['dealDepth1'] != undefined) {
				$scope.tpmlData.uiOpt.ctgDispNo = commInitData.query['dealDepth1'];
				if (commInitData.query['dealDepth2'] == undefined) $rootScope.isDirectCate = false;
			}
			if ($rootScope.isDirectCate && commInitData.query['dealDepth2'] != undefined) {
				//하위 카테고리 default 설정
				$scope.tpmlData.uiOpt.subCtgDispNo = commInitData.query['dealDepth2'];
				$rootScope.isDirectCate = false;
			}
			var paramobj = {
				dispNo: $scope.tpmlData.uiOpt.dispNo,
				dept: $scope.tpmlData.uiOpt.deptChkFlag,
				page: $scope.tpmlData.uiOpt.page,
				rowsPerPage: $scope.tpmlData.uiOpt.pageSize,
				ctgDispNo: $scope.tpmlData.uiOpt.ctgDispNo,
				subCtgDispNo: $scope.tpmlData.uiOpt.subCtgDispNo,  //카테고리 탭 NO
				preview : $scope.previewDate
			}
			if($scope.tpmlData.uiOpt.ctgDispNo == "5537338"){
				//paramobj.recom = $scope.tpmlData.uiOpt.bigdataChkFlag;
				paramobj.bigdata = $scope.tpmlData.uiOpt.bigdataChkFlag ? "Y" : "N";
			}else{
				paramobj.opt = $scope.tpmlData.uiOpt.rankType;
			}

			var httpConfig = {
				method: "get",
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: paramobj
			};

			// 개인화 추천 파라메터 변경
			if($scope.tpmlData.uiOpt.bigdataChkFlag){
				httpConfig.method = "post";
				var obj = {}
				obj.bigdata = $scope.tpmlData.uiOpt.bigdataChkFlag ? "Y" : "N";
				obj.dispNo = paramobj.dispNo;
				obj.mbrNo = $scope.loginInfo.mbrNo;
				if($scope.loginInfo.privateBigDeal){
					obj.privateBigDeal = $scope.loginInfo.privateBigDeal;
				}
				httpConfig.data = obj;
			}

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.processBannerList(data);
				if(data.main_contents.prd_deal_list.total_count == 0){
					//리스트가 0개이면 페이지 끝
					$scope.tpmlData.uiOpt.isLastPage = true;
					$scope.bottmBannerList = true;
				}else{
					if ($scope.tpmlData.uiOpt.page == 1) { // 첫번째 로드
						$scope.tpmlData.contData = data.main_contents;
					} else { // 페이징
						if($scope.tpmlData.contData.prd_deal_list == undefined){ return false; }

						if ($scope.tpmlData.contData.prd_deal_list.items) {
							$scope.tpmlData.contData.prd_deal_list.items = $scope.tpmlData.contData.prd_deal_list.items.concat(data.main_contents.prd_deal_list.items);
						}
					}

					/* 20170323 50주년 엠블럼 노출  3/30 ~ 4/23 까지 */
					var today, end_day, start_day;
					start_day = '20170330';
					end_day = '20170424';
					today = new Date();
					today=today.getFullYear() + setDigit(today.getMonth() + 1) + setDigit(today.getDate());
					if($scope.previewDate){
						today = $scope.previewDate;
					}
					function setDigit(value){
						return ((value + "").length < 2) ? "0" + value : value + "";
					}
					//console.log(today, start_day, today >= start_day);
					if(today >= start_day && today < end_day){
						var len = $scope.tpmlData.contData.prd_deal_list.items.length;
						for(var i=0; i<len; i++){

							var item = $scope.tpmlData.contData.prd_deal_list.items[i];
								item.md_tip_50 = false;
							if (item.goods_nm.indexOf('[50주년]') >= 0){
								item.md_tip_50 = true;
							}
						}
					}
					/* END:20170323 50주년 엠블럼 노출  3/30 ~ 4/23 까지 */
				}
				if($scope.tpmlData.uiOpt.ctgDispNo != "5537338"){
					//console.log($scope.tpmlData.uiOpt.subCtgDispNo, "loadData");
					if($scope.tpmlData.uiOpt.subCtgDispNo){

					} else {
						//첫번째 하위카테고리를 디폴트로 설정
						$scope.tpmlData.uiOpt.subCtgDispNo = data.main_contents.ctgList.items[0].divObjNo;
					}
				}
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.subCtgDispNo] = $scope.subCtgDispNo; // Stored Data 저장
			});
		};

		// Stored Data Check
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			//data 를 새로 부르지 않고, 세션에 저장된 값으로 설정. 카테고리도 동일
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
			//$scope.subCtgDispNo = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.subCtgDispNo];
			//console.log($scope.tpmlData.uiOpt.subCtgDispNo, "---");
			if(commInitData.query['dealDepth1'] != undefined) $scope.loadData();//파라미터에 빅딜 카테고리 값있는경우 새로 불러옴


		} else {
			//data를 새로 불러온다. 카테고리는 데이타의 것으로 세팅
			$scope.loadData();
		}
	}]);
	app.filter('qrpage', function() {
		return function(input) {
			return parseInt(input/2);
		}
	});

	// 빅딜 탭 Directive
	app.directive('tpmlBigdeal', ['LotteCommon', 'commInitData','$window', function (LotteCommon, commInitData, $window) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlBigdealCtrl",
			link : function ($scope, element, attrs) {
				var $cont = angular.element("body")[0];
				var isSwipe = attrs.isSwipe ? true:false;
				var idxParam = attrs.idxParam ? attrs.idxParam:'idx';
				var specialKeyParam = attrs.specialKeyParam ? attrs.specialKeyParam : '';
				// 전시 유입코드 세팅
				function setCurDispNo() {
					$scope.pageUI.curDispNo = $scope.tpmlData.uiOpt.ctgDispNo;

					switch ($scope.pageUI.curDispNo + "") {
						case "5537338": $scope.tpmlData.uiOpt.curDispNoSctCd = "12"; break; // 추천
						case "5532325": $scope.tpmlData.uiOpt.curDispNoSctCd = "78"; break; // 잡화뷰티
						case "5530948": $scope.tpmlData.uiOpt.curDispNoSctCd = "78"; break; // 의류속옷
						case "5532629": $scope.tpmlData.uiOpt.curDispNoSctCd = "78"; break; // 스포츠레저
						case "5532649": $scope.tpmlData.uiOpt.curDispNoSctCd = "78"; break; // 유아식품
						case "5532664": $scope.tpmlData.uiOpt.curDispNoSctCd = "78"; break; // 리빙가전
					}

					$scope.pageUI.curDispNoSctCd = $scope.tpmlData.uiOpt.curDispNoSctCd;
				}

				setCurDispNo();

				// 출석도장 이벤트 링크
				$scope.stampEventLink = function(){
					var path = $scope.baseLink(LotteCommon.directAttendUrl);
					var tclick = "&tclick=m_DC_menu_" + $scope.tpmlData.uiOpt.ctgDispNo + "_tablebanner";
					location.href = path + tclick;
				}

				// 빅딜 티클릭 만들기
				$scope.getDealBaseTclick = function(flag){
					var tclick = "m_DC_menu_";
					if($scope.tpmlData.uiOpt.ctgDispNo == "5537338"){
						tclick = tclick + "5537338_";
					}
					else{
						tclick = tclick + $scope.tpmlData.uiOpt.subCtgDispNo + "_";
					}

					if(flag === true){
						return "&tclick=" + tclick;
					}
					return tclick;
				}

				// 빅딜 티클릭 만들기
				$scope.getDealBaseTclick2 = function(flag){
					var tclick = "m_DC_menu_";
					tclick = tclick + $scope.tpmlData.uiOpt.ctgDispNo + "_";
					/*if($scope.tpmlData.uiOpt.ctgDispNo == "5537338"){
						tclick = tclick + "5537338_";
					}else{
						tclick = tclick + $scope.tpmlData.uiOpt.subCtgDispNo + "_";
					}*/

					if(flag === true){
						return "&tclick=" + tclick;
					}
					return tclick;
				}

				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					if($scope.tpmlData.uiOpt.isLastPage===true){ return; }
					if (!$scope.ajaxLoadFlag && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
						$scope.loadData(++$scope.tpmlData.uiOpt.page);

						// TCLICK
						var tclick = $scope.getDealBaseTclick() + "load";
						if($scope.tpmlData.uiOpt.page < 10){
							tclick = tclick + "0" + $scope.tpmlData.uiOpt.page;
						}else{
							tclick = tclick + $scope.tpmlData.uiOpt.page;
						}
						$scope.sendTclick(tclick);
					}
				});

				$scope.processBannerTclick = function(item){
					var url = $scope.baseLink(item.link_url);

					var tclick = $scope.getDealBaseTclick(false) + "ban";
					var idx = item.local_idx + 1;
					if(idx < 10){
						tclick = tclick + "0" + idx;
					}else{
						tclick = tclick + idx;
					}

                    //20160920 빅딜배너 새창 띄우기
                    if(item.target != undefined && item.target){
        				$scope.sendOutLink(url); // 외부 링크 보내기 (새창)
                        $scope.sendTclick(tclick); // 외부링크일때 iframe으로 tclick 전송
                    }else{
                        location.href = url + "&tclick=" + tclick;
                    }

				}

				// 배너 리스트 선처리
				$scope.processBannerList = function(data){
					if($scope.tpmlData.uiOpt.page > 1){ return; }
					if($scope.tpmlData.uiOpt.page == 1){
						$scope.tpmlData.uiOpt.bannerList.length = 0;
					}

					if(data.main_contents.banner_list == undefined){ return; }
					if(data.main_contents.banner_list.items == undefined || data.main_contents.banner_list.items.length == 0){ return; }

					data.main_contents.tablet_banner_list = [];//태블릿용 배너

					var len = data.main_contents.banner_list.items.length;
					var item, banner, priority;
					for(var i=0; i<len; i++){
						item = data.main_contents.banner_list.items[i];
						item.local_idx = i;//티클릭 인덱싱
						priority = item.priority;
						banner = $scope.tpmlData.uiOpt.bannerList[priority];
						if(banner == undefined){
							$scope.tpmlData.uiOpt.bannerList[priority] = banner = [];
						}

						banner.push(item);
						if(item.rewardevent == true){
							$scope.tpmlData.uiOpt.reward_banner = item;
						}else{
							data.main_contents.tablet_banner_list.push(item);
						}
					}

					// 추천아닌 카테고리의 2번 배너 순서 섞기
					if($scope.tpmlData.uiOpt.ctgDispNo != "5537338"){
						if($scope.tpmlData.uiOpt.bannerList[2] == undefined || $scope.tpmlData.uiOpt.bannerList[2].length <= 1){
							//
						}else{
							$scope.tpmlData.uiOpt.bannerList[2].sort($scope.randomizeFunc);
							//console.log($scope.tpmlData.uiOpt.bannerList[2]);
						}
					}
				}

				// 랜덤배너 소팅 함수
				$scope.randomizeFunc = function(a, b){
					return Math.random() - 0.5;
				}

				// 빅딜 상단탭 클릭
				$scope.recommendMenuClick = function(e){
					$scope.tpmlData.uiOpt.isLastPage=false;
					$scope.productListLoading = true;
					var a = $(e.target);
					var li = a.parent();
					if(li.hasClass("on")){ return; }
					//li.addClass("on").siblings().removeClass("on");
					//첫번째 카테고리를 디폴트로 설정
					//if($scope.tpmlData.uiOpt.ctgDispNo != "5537338"){
					//	$scope.tpmlData.uiOpt.subCtgDispNo = $scope.tpmlData.contData.ctgList.items[0].divObjNo;
					//}
					//추천이외의 카테고리시 백화점 선택 해제
					//$scope.tpmlData.uiOpt.subCtgDispNo = null;
					console.log($scope.subctgDispNoIdx[$scope.tpmlData.uiOpt.ctgDispNo]);
					$scope.tpmlData.uiOpt.ctgDispNo = li.data("ctgDispNo");
					if($scope.tpmlData.uiOpt.ctgDispNo != "5537338"){
						$scope.tpmlData.uiOpt.deptChkFlag = false;
					}


					$scope.tpmlData.uiOpt.subCtgDispNo = $scope.subctgDispNoIdx[$scope.tpmlData.uiOpt.ctgDispNo];

					$scope.loadData(1);

					setCurDispNo(); // 전시 유입코드 세팅

					// TCLICK
					var tclick = $scope.getDealBaseTclick2() + "Clk_Btn01";
					$scope.sendTclick(tclick);
				}

				// 정렬방식 변경
				$scope.rankTypeChange = function(type){
					if($scope.tpmlData.uiOpt.rankType == type){ return; }
					$scope.tpmlData.uiOpt.rankType = type;
					$scope.loadData(1);

					// TCLICK
					var tclick = "m_DC_menu_sort_";
					switch($scope.tpmlData.uiOpt.rankType){
						case 1:
							tclick = tclick + "popular";
							break;
						case 2:
							tclick = tclick + "new";
							break;
						default:
							tclick = tclick + "recom";
							break;
					}
					$scope.sendTclick(tclick);
				}

				// 나만을 위한 추천순 체크박스 체인지
				$scope.bigDataChange = function (opt) {
					$scope.loadData(1);
				};

				// 나만을 위한 추천순 체크박스 클릭
				$scope.bigDataChkClick = function () {
					// TCLICK
					var tclick = $scope.getDealBaseTclick() + "personalization";
					$scope.sendTclick(tclick);
				};

				// 백화점상품 체크박스 체인지
				$scope.deptDataChange = function () {
					$scope.loadData(1);
				};

				// 백화점상품 체크박스 클릭
				$scope.deptDataChkClick = function () {
					// TCLICK
					var tclick = "m_DC_menu_department";
					$scope.sendTclick(tclick);
				};


				/**
				 * @ngdoc function
				 * @name productContainer.function:getProductImage2
				 * @description
				 * 상품 이미지 주소 가저 오기(성인 상품의 경우 성인 인증 안하였을 경우 19금 이미지 노출)
				 * @example
				 * $scope.getProductImage2(item)
				 * @param {Object} item 상품 json data
				 * @param {String} item.img_url 상품 이미지 주소
				 * @param {Number} item.pmg_byr_age_lmt_cd 성인 상품 여부 값이 19 이면 성인 상품
				 */
				$scope.getProductImage2 = function(item) {
					var newUrl = "";
					if(item.img_url == null) {
						return "";
					}

					var imgurl = item.img_url;

					if(commInitData.query['adultChk'] == "Y") {
						return imgurl;
					}

					if(item.pmg_byr_age_lmt_cd != '19' || item.pmg_byr_age_lmt_cd == undefined) {
						if(item.img_url != "") {
							newUrl = imgurl;
						}
					} else {
						if (!$scope.rScope.loginInfo.isAdult) {//로그인 안한 경우
							newUrl = "http://image.lotte.com/lotte/mobile/sub/img_19_280x280.png";
						} else {
							if(item.img_url != "") {
								newUrl = imgurl;
							}
						}
					}
					return newUrl;
				}

				// 빅딜 상품 클릭
				$scope.productDealClick = function (item, gubun) { // 딜상품 클릭
                    setCurDispNo(); //20160526 빅딜상품일때
					$scope.productInfoProc(item, 'deal', this.$index + 1, gubun);
				}

				/**
				 * 빅딜
				 * @ngdoc function
				 * @name productContainer.function:productInfoProc
				 * @description
				 * 상품 클릭 이벤트 처리
				 * @example
				 * $scope.productInfoProc(item, type, idx)
				 * @param {Object} item 상품 json data
				 * @param {Object} type 상품 Tyep 딜상품인지 아닌지에 대한 처리
				 * @param {Number} idx 상품 리스트 인덱스
				 *
				 * @param {Number} item.outlnkMall 외부 상품 구분값
				 * @param {Boolean} item.has_wish 위시에 담긴 상품인지에 대한 구분값
				 * @param {String} item.limit_age_yn 성인 상품 여부 Y/N
				 * @param {Number} item.pmg_byr_age_lmt_cd 성인 상품 여부 19 이면 19금
				 * @param {String} item.goods_no 상품 번호
				 * @param {String} item.outlnk 외부링크 주소
				 */
				$scope.productInfoProc = function(item, type, idx, gubun) {
					if(item.limit_age_yn == 'Y' || item.pmg_byr_age_lmt_cd == '19') {
						if (!$scope.rScope.loginInfo.isAdult && $scope.rScope.loginInfo.isLogin) { /*19금 상품이고 본인인증 안한 경우*/
							// alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
							$scope.rScope.goAdultSci();
							return false;
						} else if(!$scope.rScope.loginInfo.isLogin) {
							window.location.href = LotteCommon.loginUrl + '?'+$scope.rScope.baseParam + '&adultChk=Y'+"&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
							return false;
						} else if (!$scope.rScope.loginInfo.isAdult) {
							alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
							return false;
						}
					}

					if (item.outlnk != "" && item.outlnk != undefined) {
						if (item.outlnkMall == "SP") {
							if (confirm("롯데슈퍼로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if ($scope.rScope.appObj.isApp) {
									openNativePopup("롯데슈퍼", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}
						} else {
							if (confirm("공식 온라인 몰로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if ($scope.rScope.appObj.isApp) {
									openNativePopup("공식온라인몰", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}

						}
						return false;
					}


					var review = "";
					if (type == 'review') {
						review = "&tabIdx=1";
					}

					//var curDispNo = "&curDispNo=" + $scope.pageUI.curDispNo;
					var curDispNo = "&curDispNo=";
					if($scope.tpmlData.uiOpt.subCtgDispNo == "" || $scope.tpmlData.uiOpt.subCtgDispNo == 1){
						curDispNo += $scope.pageUI.curDispNo;
					}else{
						curDispNo += $scope.tpmlData.uiOpt.subCtgDispNo;
					}
					var curDispNoSctCd = "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
					var dealProd = "&genie_yn=Y";
					var tClickCode = $scope.getDealBaseTclick() + "unit";
                    if(gubun == "QR1" || gubun == "QR2"){
                        tClickCode = $scope.getDealBaseTclick() + "quunit";
                    }
                    if(gubun == "DEAL"){
                        idx = idx + $scope.tpmlData.contData.prd_deal_list2.items.length;
                    }else if(gubun == "QR2"){
                        idx = idx + $scope.tpmlData.contData.curation1.prd_list.items.length;
                    }
					if(idx < 10){
						tClickCode = tClickCode + "0" + idx;
					}else{
						tClickCode = tClickCode + idx;
					}

					window.location.href = LotteCommon.prdviewUrl + "?" + $scope.rScope.baseParam + "&goods_no=" + item.goods_no+ curDispNo + curDispNoSctCd + review + dealProd + "&tclick="+tClickCode;
				}

				//카테고리 추가
				$scope.ctgClick = function (idx, item) {
					$scope.tpmlData.uiOpt.isLastPage=false;
					//$scope.ctgClickFlag = true;
		            $scope.tpmlData.uiOpt.subCtgDispNo = item.divObjNo; // 카테고리 데이터 지정
		            $scope.subctgDispNoIdx[$scope.tpmlData.uiOpt.ctgDispNo] = item.divObjNo;
		            $scope.tpmlData.uiOpt.deptChkFlag = false;
		            $scope.loadData(); // 데이터 로드
		            var tclick = "m_DC_menu_" + item.divObjNo  + "_Clk_Btn01";
		            $scope.sendTclick(tclick);
		        };

                //20170209 큐레이션
                $scope.q_init = function(){
                    //console.log("init");
                    $scope.q_index1 = 1;
                    $scope.q_index2 = 1;
                    /* 20170213 테블릿버전 제거로 인한 주석처리
                    if($scope.screenType > 1){
                        $scope.q_index1 = 0;
                        $scope.q_index2 = 0;
                    } */
                }
                $scope.q_endFnc1 = function(val){
                    $scope.q_index1 = val + 1;
                }
                $scope.q_endFnc2 = function(val){
                    $scope.q_index2 = val + 1;
                }
                $scope.isqr_pad = function(index){
                    var flag = false;
                    /* 20170213 테블릿버전 제거로 인한 주석처리
                    if($scope.screenType > 1){
                        if(($scope.tpmlData.contData.curation1 && $scope.qrPosition(index, 2)) || ($scope.tpmlData.contData.curation2 && $scope.qrPosition(index, 15))){
                            flag = true;
                        }
                    } */
                    return flag;
                }
                $scope.qrPosition = function(index, type){ //20170209 빅딜 큐레이션 : 패드일때 위치잡기
                    var flag = false;
                    var bimglen = 0;
                    if($scope.tpmlData.contData.prd_deal_list2.items){
                        bimglen = $scope.tpmlData.contData.prd_deal_list2.items.length;
                    }
                    if($scope.tpmlData.uiOpt.bigdataChkFlag || $scope.tpmlData.uiOpt.deptChkFlag){
                       return false;
                    }
                    if(type == 2){
                        if(!$scope.tpmlData.contData.curation1 || !$scope.tpmlData.contData.curation1.prd_list || $scope.tpmlData.contData.curation1.prd_list.total_count == 0){
                            return false;
                        }
                        /* 20170213 테블릿버전 제거로 인한 주석처리
                        else if($scope.tpmlData.contData.curation1.prd_list.total_count == 1 && $scope.screenType > 1){
                            return false;
                        } */
                    }else{
                        if(!$scope.tpmlData.contData.curation2 || !$scope.tpmlData.contData.curation2.prd_list || $scope.tpmlData.contData.curation2.prd_list.total_count == 0){
                            return false;
                        }
                        /* 20170213 테블릿버전 제거로 인한 주석처리
                        else if($scope.tpmlData.contData.curation2.prd_list.total_count == 1 && $scope.screenType > 1){
                            return false;
                        } */
                    }
                    type = type + $scope.screenType;
                    if($scope.screenType == 2){
                        if(type + bimglen%2 == index){
                            flag = true;
                        }
                    }else if($scope.screenType == 3){
                        var tmpar = [1,3,2];
                        if(type + tmpar[bimglen%3] == index){
                            flag = true;
                        }
                    }else{
                        if(type == index){
                            flag = true;
                        }
                    }
                    return flag;
                }
			}
		}
	}]);

	// 백화점 탭 Controller
	app.controller('tpmlDeptCtrl', ['$scope', '$http', 'LotteCommon', 'LotteUtil', 'commInitData', '$window',  function ($scope, $http, LotteCommon, LotteUtil, commInitData ,$window) {
		$scope.ajaxLoadFlag = false;
		$scope.rScope = LotteUtil.getAbsScope($scope);
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5553646",
				showBranchLayer: false
			},
			contData: {}
		};

		//단골지점
		if($scope.loginInfo.isLogin && $scope.loginInfo.favDeptBranchNo != undefined){
			$scope.loginInfo.favDeptBranchNo.dept_branch_no = ($scope.loginInfo.favDeptBranchNo.dept_branch_no + "").replace(/\s/g, ""); // 단골지점명 공백제거

			$scope.h_branch_no = $scope.loginInfo.favDeptBranchNo.dept_branch_no;
			$scope.h_branch_nm = $scope.loginInfo.favDeptBranchNo.dept_branch_nm;
            if($scope.h_branch_nm == '' || $scope.h_branch_nm == null){$scope.h_branch_nm = "본점"}
            if($scope.h_branch_no == '' || $scope.h_branch_no == null){$scope.h_branch_no = "5494874"}
		}else{
            $scope.h_branch_nm = "본점";
            $scope.h_branch_no = "5494874";
        }

		// Data Load
		$scope.loadData = function (page) {
			if($scope.ajaxLoadFlag){ return false; }

			$scope.ajaxLoadFlag = true;

			var gender = $scope.loginInfo.genSctCd;
			var age = $scope.loginInfo.mbrAge;

			/********************************************
			* TEST Func. - 테스트를 위한 코드 추가
			********************************************/
			if (commInitData.query["gender"] || commInitData.query["age"]) {
	            if(commInitData.query["gender"]) {
	            	gender = commInitData.query["gender"];
	            }

	            if(commInitData.query["age"]) {
	            	age = commInitData.query["age"];
	            }
			}

			if(gender != "M"){
				gender = "F";
			}

			if(age == undefined || age == ""){
				age = 30;
			}else{
				if(age >= 40){
					age = 40;
				}else if(age < 30){
					age = 20;
				}else{
					age = 30;
				}
			}

			var httpConfig = {
				method: "get",
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: {
					dispNo: $scope.tpmlData.uiOpt.dispNo,
					age: age,
					gender: gender,
					branch_nm: $scope.h_branch_nm,
					branch_no: $scope.h_branch_no,
					preview : $scope.previewDate
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;
				$scope.processDeptData();
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});
		};

		// 백화점 데이터 가공
		$scope.processDeptData = function(){
			// 빅딜
			var bigdeal = $scope.tpmlData.contData.big_deal;
			if(bigdeal != undefined && bigdeal.items != undefined){
				var len = bigdeal.items.length;
				bigdeal.maxCount2 = Math.max(2, parseInt(len / 2, 10) * 2);
				bigdeal.maxCount3 = Math.max(3, parseInt(len / 3, 10) * 3);
			}
			/* 2016.11.02 테마기획전 데이터*/
			$scope.brand_bnr_one = $scope.tpmlData.contData.brand_bnr1.bnr_large.img_url != null;
			$scope.brand_bnr_two = $scope.tpmlData.contData.brand_bnr2.bnr_large.img_url != null;
			// 테마기획전 &lt;&gt; 리플레이스
			$scope.replaceBrandName($scope.tpmlData.contData.brand_bnr1);
			$scope.replaceBrandName($scope.tpmlData.contData.brand_bnr2);
			$scope.replaceBrandName($scope.tpmlData.contData.brand_bnr3);
			// 테마기획전 대배너 &lt;&gt; 리플레이스 2016.10.31 수정
			$scope.replaceBrandTit($scope.tpmlData.contData.brand_bnr1.bnr_large);
			$scope.replaceBrandTit($scope.tpmlData.contData.brand_bnr2.bnr_large);
			$scope.replaceBrandTit($scope.tpmlData.contData.brand_bnr3.bnr_large);

			// 스마트픽 2개로 제한
			if($scope.tpmlData.contData.smp_prod && $scope.tpmlData.contData.smp_prod.items && $scope.tpmlData.contData.smp_prod.items.length > 2){
				$scope.tpmlData.contData.smp_prod.items.length = 2;
			}

			// 카테고리 갯수 맞추기
			if($scope.tpmlData.contData.dept_ctg != undefined){
				var total = $scope.tpmlData.contData.dept_ctg.items.length;
				var i;
				for(i=total-1; i>=0; i--){
					if($scope.tpmlData.contData.dept_ctg.items[i] == null || $scope.tpmlData.contData.dept_ctg.items[i].ctg_nm == ""){
						$scope.tpmlData.contData.dept_ctg.items.splice(i, 1);
					}
				}

				total = $scope.tpmlData.contData.dept_ctg.items.length;
				var remain = total % 3;//폰
				if(remain > 0){
				var len = 3 - remain;
					for(i=0; i<len; i++){
						$scope.tpmlData.contData.dept_ctg.items.push({"ctg_nm":"","curDispNo":0,"scrtype":1});
					}
				}
				remain = total % 5;//태블릿
				if(remain > 0){
					len = 5 - remain;
					for(i=0; i<len; i++){
						$scope.tpmlData.contData.dept_ctg.items.push({"ctg_nm":"","curDispNo":0,"scrtype":2});
					}
				}
			}

			// 백화점 지점 리스트 불러오기
			if($scope.tpmlData.contData.branch_list == undefined){
				$scope.loadBranchList();
			}

            //백화점 배너 랜덤 처리 20170223
            if($scope.tpmlData.contData.main_top_bnr != undefined){
                $scope.randomTopBann = $scope.tpmlData.contData.main_top_bnr.main_bnr.items;
                $scope.bn_order = $scope.banner_shuffle($scope.randomTopBann.length, $scope.tpmlData.contData.main_top_bnr.img_random);
            }
		}

		// 테마기획전 타이틀 리플레이스
		$scope.replaceBrandName = function(banner){
			if(banner == undefined || banner.items == undefined){ return false; }
			var len = banner.items.length;
			var bnr;
			for(var i=0; i<len; i++){
				bnr = banner.items[i];
				if(i==0){
					bnr.title = $scope.replaceltgt( bnr.title );
				}
			}
		}
		// 2016.10.31 테마기획전 대배너 타이틀 리플레이스
		$scope.replaceBrandTit = function(banner){
			if(banner == undefined ){ return false; }
			if(banner.title != null){
				var bnr = banner;
				bnr.title = $scope.replaceltgt( bnr.title );
			}
		}
		// &lt;&gt; 교체
		$scope.replaceltgt = function(str){
			str = str.replace(/&lt;/g,"<");
			str = str.replace(/&gt;/g,">");
			return str;
		}

		// 지점목록 불러오기
		$scope.loadBranchList = function(){
			if(LotteCommon.mainBranchListData == undefined){ return false; }
			var httpConfig = {
				method: "get",
				url: LotteCommon.mainBranchListData
			};

			$http(httpConfig)
			.success(function (data) {
				//$scope.tpmlData.contData = data.main_contents;
				var group, branch, blen, b;

				var glen = data.branch_grp_list.items.length;
				for(var g=0; g<glen; g++){
					group = data.branch_grp_list.items[g];
					blen = group.branch_list.items.length;
					for(b=0; b<blen; b++){
						branch = group.branch_list.items[b];
                        if(g == glen - 1){ //영플라자 제거 0516
                            branch.branch_nm = branch.branch_nm.replace("(영플라자)", "");
                        }
						if(branch.is_fav){
							data.branch_grp_list.fav_branch = branch;
							//break;
						}
					}
				}
				$scope.tpmlData.contData.branch_list = data.branch_grp_list;

				/*return;
				var glen = data.main_contents.branch_list.items.length;
				for(var g=0; g<glen; g++){
					group = data.main_contents.branch_list.items[g];
					blen = group.items.length;
					for(b=0; b<blen; b++){
						branch = group.items[b];
						if(branch.is_fav){
							data.main_contents.branch_list.fav_branch = branch;
							break;
						}
					}
				}
				$scope.tpmlData.contData.branch_list = data.main_contents.branch_list;*/
			})
			.finally(function () {
				//$scope.ajaxLoadFlag = false;
			});
		}

		// Stored Data Check
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
			$scope.processDeptData();
		} else {
			$scope.loadData();
		}
		/* 2016.10.31 테마기획전 수정*/
		// 3번 테마기획전 테블릿 1번 대카 x 노출 o
		// 3번 테마기획전 테블릿 1번,2번 대카 x 노출x
		// 3번 테마기획전 테블릿 1,2,3번 대카 x 노출x
		var _$win = angular.element($window);
		angular.element($window).on("resize.bnr", function() {
			if($scope.tpmlData.uiOpt.dispNo == '5553646'){
				$scope.brandBnL = true ; //테마기획전 노출기준
				if($scope.screenType > 1){ //테블릿일 경우
					if($scope.brand_bnr_one == true && $scope.brand_bnr_two == true){ // 1.2 대배너 있을시
						$scope.brandBnL = false;
					}
					if($scope.brand_bnr_one != true && $scope.brand_bnr_two == true){// 2 대배너 있을시
						$scope.brandBnL = true;
					}
					if($scope.brand_bnr_one != true && $scope.brand_bnr_two != true){
						$scope.brandBnL = false;
					}
				}
			}
		}).trigger('resize.bnr');
	}]);

	app.filter('startFrom', function() {
		return function(input, start) {
			if(input) {
				start = +start; //parse to int
				return input.slice(start);
			}
			return [];
		}
	});

	// 백화점 탭 Directive
	app.directive('tpmlDept', ['$window', '$http', 'LotteLink', 'LotteCommon', 'commInitData', function ($window, $http, LotteLink, LotteCommon, commInitData) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlDeptCtrl",
			link : function ($scope, element, attrs) {
				var isSwipe = attrs.isSwipe ? true:false;
				var idxParam = attrs.idxParam ? attrs.idxParam:'idx';
				var specialKeyParam = attrs.specialKeyParam ? attrs.specialKeyParam : '';

                //나의 나이대
                $scope.ageRange = "";
                if($scope.loginInfo.isLogin){
                    $scope.ageRange = parseInt(parseInt($scope.loginInfo.mbrAge)/10)*10;
                    if($scope.ageRange < 20){
                        $scope.ageRange = 20;
                    }else if($scope.ageRange > 50){
                        $scope.ageRange = 50;
                    }
                }


                $scope.tpmlData.uiOpt.showBranchLayer = false;// 단골지점 레이어 닫기
				var DEPT_BASE_TCLICK = "m_DC_menu_5553646_";
				var DEPT_BASE_TCLICK2 = "tclick=" + DEPT_BASE_TCLICK;

				// TCLICK 처리
				$scope.processTclick = function(url, obj){
					//var conn = (url.indexOf("?")>=0) ? "&" : "?";
					//var path = url + conn + DEPT_BASE_TCLICK2;
					var path = $scope.baseLink(url);
					path = path + "&" + DEPT_BASE_TCLICK2;
					if(obj && obj.prefix != undefined){
						path = path + obj.prefix;
					}
					if(obj && obj.useIndex === true && obj.index != undefined){
						path = path + ((obj.index < 10) ? "0"+obj.index : obj.index);
					}
					if(obj && obj.useSex === true){
						if($scope.rScope.loginInfo && $scope.rScope.loginInfo.login){
							if($scope.rScope.loginInfo.genSctCd == "M" || $scope.rScope.loginInfo.genSctCd == "F"){
								path = path + "_sort_" + $scope.rScope.loginInfo.genSctCd;
							}else{
								path = path + "_sort_H";
							}
						}else{
							path = path + "_sort_H";
						}
					}
					if(obj && obj.useAge === true && $scope.rScope.loginInfo && $scope.ageRange){
						path = path + "_" + $scope.ageRange;
					}
					if(obj && obj.useDevice === true){
						if($scope.rScope.appObj.isIOS){
							path = path + "_ios";
						}else if($scope.rScope.appObj.isAndroid){
							path = path + "_and";
						}else if($scope.rScope.appObj.isSktApp){
							path = path + "_tlotte";
						}
					}
					location.href = path;
				}

				// 항목별 더보기 링크
				$scope.goToPage = function(gubun){
					var linkurl = "?" + $scope.baseParam;
					var tclick = {};
					switch (gubun) {
						case 1:// 랭킹존 2017.01.02 linkurl 정의수정
							linkurl = "/mall/ranking.do";
							tclick.prefix = "Clk_Btn01";
							tclick.useSex = true;
							tclick.useAge = true;
							$scope.processTclick(linkurl, tclick);
							break;
						case 2:// 스마트픽
							var tclick = DEPT_BASE_TCLICK + "Clk_smartpick_Btn01";
							if($scope.rScope.loginInfo && $scope.rScope.loginInfo.login){
								if($scope.rScope.loginInfo.genSctCd == "M" || $scope.rScope.loginInfo.genSctCd == "F"){
									tclick = tclick + "_sort_" + $scope.rScope.loginInfo.genSctCd;
								}else{
									tclick = tclick + "_sort_H";
								}
							}else{
								tclick = tclick + "_sort_H";
							}
                            /* 20160512 스마트픽 링크 변경
							if($scope.tpmlData.contData.branch_list.fav_branch){
								$scope.fn_goSearch("스마트픽 " + encodeURI(($scope.tpmlData.contData.branch_list.fav_branch.branch_nm).replace(/ /g, '')), tclick);
							}else{
								$scope.fn_goSearch("스마트픽 본점", tclick);
							}
                            */
                            location.href = "/mall/smartpick.do?" + $scope.baseParam + "&curDispNo=5553631&curDispNoSctCd=45&tclick=" + tclick;
							break;
					}
				}

				// 빅딜 더보기
				$scope.showMoreBigDeal = function(){
					$scope.pageUI.storedData['5553715'] = null;// 빅딜 데이터 삭제
					$scope.pageUI.storedData['5553646'].uiOpt.bigdealFrom = "dept";//백화점 체크

					// TCLICK
					var tclick = DEPT_BASE_TCLICK + "Clk_Bigdeal_Btn01";
					if($scope.rScope.loginInfo && $scope.rScope.loginInfo.login){
						if($scope.rScope.loginInfo.genSctCd == "M" || $scope.rScope.loginInfo.genSctCd == "F"){
							tclick = tclick + "_sort_" + $scope.rScope.loginInfo.genSctCd;
						}else{
							tclick = tclick + "_sort_H";
						}
					}else{
						tclick = tclick + "_sort_H";
					}
					$scope.sendTclick(tclick);

					$scope.headerMenuClick(5553715);
				}

				// 로그인 이동
				$scope.goLoginPage = function(){
					// TCLICK
					var tclick = DEPT_BASE_TCLICK + "Clk_smartpick_login";

					$scope.loginProc(tclick);
				}

				// 단골지점 선택
				$scope.branchClick = function(target){
					if($scope.rScope.loginInfo.isLogin == false){
						alert("로그인 후 단골지점을 설정할 수 있습니다.");
						$scope.loginProc();
						return false;
					}

					if(target.branch.is_fav){ return false; }
					if(LotteCommon.mainBranchSelectData == undefined){ return false; }
					var httpConfig = {
						method: "get",
						url: LotteCommon.mainBranchSelectData,
						params: {
							branch_nm: target.branch.branch_nm,
							branch_no: target.branch.branch_no
						}
					};

					$http(httpConfig) // 실제 탭 데이터 호출
					.success(function (data) {
						if(data.result && data.result.response_code == "0000"){
							// success
							var group, branch, blen, b;
							var glen = $scope.tpmlData.contData.branch_list.items.length;
							for(var g=0; g<glen; g++){
								group = $scope.tpmlData.contData.branch_list.items[g];
								blen = group.branch_list.items.length;
								for(b=0; b<blen; b++){
									branch = group.branch_list.items[b];
									branch.is_fav = false;
								}
							}

							target.branch.is_fav = true;
							$scope.tpmlData.contData.branch_list.fav_branch = target.branch;
							if(data.smp_prod && data.smp_prod.items){
								// 스마트픽 2개로 제한
								if(data.smp_prod.items.length > 2){
									data.smp_prod.items.length = 2;
								}
								$scope.tpmlData.contData.smp_prod = data.smp_prod;
							}

							if($scope.loginInfo.favDeptBranchNo == undefined){
								$scope.loginInfo.favDeptBranchNo = {dept_branch_no:target.branch.branch_no, dept_branch_nm:target.branch.branch_nm};
							}else{
								$scope.loginInfo.favDeptBranchNo.dept_branch_no = target.branch.branch_no;
								$scope.loginInfo.favDeptBranchNo.dept_branch_nm = target.branch.branch_nm;
							}

							$scope.tpmlData.uiOpt.showBranchLayer = false;

							// 이거어때 데이터 삭제
							$scope.pageUI.storedData['5553631'] = null;
						}else{
							// fail
							alert("단골지점을 저장하지 못했습니다.");
						}
					})
					.finally(function () {
						//$scope.ajaxLoadFlag = false;
					});

					// TCLICK
					var tclick = DEPT_BASE_TCLICK + "Clk_smartpick_store";
					var bidx = target.$index;
					var pidx = target.$parent.$index;
					var tidx = bidx * 4 + pidx + 1;
					if(tidx < 10){ tidx = "0" + tidx; }
					$scope.sendTclick(tclick + tidx);
				}

				// 단골지점 선택 레이어 on/off
				$scope.showHideStoreList = function(){
					$scope.tpmlData.uiOpt.showBranchLayer = !$scope.tpmlData.uiOpt.showBranchLayer;

					var tclick = DEPT_BASE_TCLICK + "Clk_smartpick_Lyr";
					if($scope.tpmlData.uiOpt.showBranchLayer){
						$scope.sendTclick(tclick+"01");
					}else{
						$scope.sendTclick(tclick+"02");
					}
				}


				/**
				 * @ngdoc function
				 * @name productContainer.function:getProductImage2
				 * @description
				 * 상품 이미지 주소 가저 오기(성인 상품의 경우 성인 인증 안하였을 경우 19금 이미지 노출)
				 * @example
				 * $scope.getProductImage2(item)
				 * @param {Object} item 상품 json data
				 * @param {String} item.img_url 상품 이미지 주소
				 * @param {Number} item.pmg_byr_age_lmt_cd 성인 상품 여부 값이 19 이면 성인 상품
				 */
				$scope.getProductImage2 = function(item) {
					var newUrl = "";
					if(item.img_url == null) {
						return "";
					}

					var imgurl = item.img_url;

					if(commInitData.query['adultChk'] == "Y") {
						return imgurl;
					}

					if(item.pmg_byr_age_lmt_cd != '19' || item.pmg_byr_age_lmt_cd == undefined) {
						if(item.img_url != "") {
							newUrl = imgurl;
						}
					} else {
						if (!$scope.rScope.loginInfo.isAdult) {//로그인 안한 경우
							newUrl = "http://image.lotte.com/lotte/mobile/sub/img_19_280x280.png";
						} else {
							if(item.img_url != "") {
								newUrl = imgurl;
							}
						}
					}
					return newUrl;
				}
				// 백화점 딜 상품 클릭
				$scope.productDealClick = function (item, sp_bd) { // 딜상품 클릭
					$scope.productInfoProc(item, 'deal', this.$index + 1, sp_bd);
				}

				/**
				 * 백화점
				 * @ngdoc function
				 * @name productContainer.function:productInfoProc
				 * @description
				 * 상품 클릭 이벤트 처리
				 * @example
				 * $scope.productInfoProc(item, type, idx)
				 * @param {Object} item 상품 json data
				 * @param {Object} type 상품 Tyep 딜상품인지 아닌지에 대한 처리
				 * @param {Number} idx 상품 리스트 인덱스
				 *
				 * @param {Number} item.outlnkMall 외부 상품 구분값
				 * @param {Boolean} item.has_wish 위시에 담긴 상품인지에 대한 구분값
				 * @param {String} item.limit_age_yn 성인 상품 여부 Y/N
				 * @param {Number} item.pmg_byr_age_lmt_cd 성인 상품 여부 19 이면 19금
				 * @param {String} item.goods_no 상품 번호
				 * @param {String} item.outlnk 외부링크 주소
				 */
				$scope.productInfoProc = function(item, type, idx, sp_bd) {
					if(item.limit_age_yn == 'Y' || item.pmg_byr_age_lmt_cd == '19') {
						if (!$scope.rScope.loginInfo.isAdult && $scope.rScope.loginInfo.isLogin) { /*19금 상품이고 본인인증 안한 경우*/
							// alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
							$scope.rScope.goAdultSci();
							return false;
						} else if(!$scope.rScope.loginInfo.isLogin) {
							window.location.href = LotteCommon.loginUrl + '?'+$scope.rScope.baseParam + '&adultChk=Y'+"&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
							return false;
						} else if (!$scope.rScope.loginInfo.isAdult) {
							alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
							return false;
						}
					}

					if (item.outlnk != "" && item.outlnk != undefined) {
						if (item.outlnkMall == "SP") {
							if (confirm("롯데슈퍼로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if ($scope.rScope.appObj.isApp) {
									openNativePopup("롯데슈퍼", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}
						} else {
							if (confirm("공식 온라인 몰로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if ($scope.rScope.appObj.isApp) {
									openNativePopup("공식온라인몰", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}

						}
						return false;
					}


					var review = "";
					if (type == 'review') {
						review = "&tabIdx=1";
					}

					var curDispNo = "&curDispNo=" + $scope.pageUI.curDispNo;
					var curDispNoSctCd = "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
					var dealProd = "&genie_yn=Y";
					var tClickCode = "";
					if(sp_bd == "smartpick"){
						tClickCode = DEPT_BASE_TCLICK + "Clk_smartpick_Prd_idx" + "0" + idx;
					}else if(sp_bd == "bigdeal"){
						if(idx < 10){
							tClickCode = DEPT_BASE_TCLICK + "Clk_Bigdeal_Prd_idx" + "0" + idx;
						}else{
							tClickCode = DEPT_BASE_TCLICK + "Clk_Bigdeal_Prd_idx" + idx;
						}
						if($scope.rScope.loginInfo && $scope.rScope.loginInfo.login){
							if($scope.rScope.loginInfo.genSctCd == "M" || $scope.rScope.loginInfo.genSctCd == "F"){
								tClickCode = tClickCode + "_sort_" + $scope.rScope.loginInfo.genSctCd;
							}else{
								tClickCode = tClickCode + "_sort_H";
							}
						}else{
							tClickCode = tClickCode + "_sort_H";
						}
					}
					window.location.href = LotteCommon.prdviewUrl + "?" + $scope.rScope.baseParam + "&goods_no=" + item.goods_no+ curDispNo + curDispNoSctCd + review + dealProd + "&tclick="+tClickCode;
				}

				// 백화점 - 랭킹 클릭, 상품상세 이동
				$scope.gotoDetail = function(item, idx){
					var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no;
					var tclick = {prefix:"Swp_Prd_idx", useIndex:true, index:idx+1, useSex:true, useAge:true};

					var curDispNo = "&curDispNo=" + $scope.pageUI.curDispNo;
					var curDispNoSctCd = "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
					url = url + curDispNo + curDispNoSctCd;

					$scope.processTclick(url, tclick);
				}

				// 카테고리 선택
				$scope.categoryClick = function(target){
					// TCLICK
					var tclick = DEPT_BASE_TCLICK + "Clk_Cat_idx";
					var idx = target.$index + 1;
					if(idx < 10){
						tclick = tclick + "0" + idx;
					}else{
						tclick = tclick + idx;
					}
					//명품화장품 링크 수정
					if (target.item.cur_disp_no == '5537279' || target.item.cur_disp_no == '5537965') {
						var cateMid = LotteCommon.cateMidBeauty;
					} else {
						var cateMid = LotteCommon.cateMidAngul;
					}
					$scope.linkUrl(cateMid, false, tclick, {
						curDispNo: target.item.cur_disp_no,
						title: encodeURI(target.item.ctg_nm),
						cateDiv: "MIDDLE",
						idx: "1"
					});
				}
			}

		}
	}]);

	// 기획전 탭 Controller
	app.controller('tpmlPlanshopCtrl', ['$scope', '$http', 'LotteCommon', '$timeout', 'LotteUtil', function ($scope, $http, LotteCommon, $timeout, LotteUtil) {
		$scope.rScope = LotteUtil.getAbsScope($scope);
		$scope.ajaxLoadFlag = false;
		$scope.firstCallFlag = false; // 처음 로드인지 확인 플래그
		$scope.CtgIdx = 0; // 카테고리탭 랜덤 idx 초기화
		$scope.ctgTabOffset = 0;
		$scope.scrollEnabledFlag = false;
		$scope.calOffset = 0;

		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5547174",
				ctgTabList: [ // 카테고리탭 정보
					{ctgName: "잡화뷰티", ctgNo: "5537346"},
					{ctgName: "의류속옷", ctgNo: "5537345"},
					{ctgName: "스포츠레저", ctgNo: "5537347"},
					{ctgName: "유아식품", ctgNo: "5537348"},
					{ctgName: "리빙가전", ctgNo: "5537349"}
				],
				slcCtgTabNo: "0", // 활성화된 카테고리탭 No
				slcCtgTabIdx: "0"
			},
			contData: {},
			planData: {}
		};

		// 처음 로드되었을시(세션데이터 없을시) 카테고리 탭 랜덤으로 지정
		if ( $scope.tpmlData.uiOpt.slcCtgTabNo == "0" && $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] == undefined ) {
			$scope.CtgIdx = Math.floor(Math.random() * 4) + 1;

			$scope.tpmlData.uiOpt.slcCtgTabIdx = $scope.CtgIdx; // storedData에 idx 저장하기

			switch ($scope.CtgIdx) {
				case 1: $scope.tpmlData.uiOpt.slcCtgTabNo = "5537346"; break; // 잡화뷰티
				case 2: $scope.tpmlData.uiOpt.slcCtgTabNo = "5537345"; break; // 의류속옷
				case 3: $scope.tpmlData.uiOpt.slcCtgTabNo = "5537347"; break; // 스포츠레저
				case 4: $scope.tpmlData.uiOpt.slcCtgTabNo = "5537348"; break; // 유아식품
				case 5: $scope.tpmlData.uiOpt.slcCtgTabNo = "5537349"; break; // 리빙가전
			}
		}

		// Data Load
		$scope.loadData = function () {
            $scope.productListLoading = true;

			if ($scope.ajaxLoadFlag)
				return false;
			$scope.ajaxLoadFlag = true;

			var httpConfig = {
				method: "get",
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: {
					dispNo: $scope.tpmlData.uiOpt.dispNo, // 전시 NO
					ctgDispNo: $scope.tpmlData.uiOpt.slcCtgTabNo, // 카테고리 탭 NO
					preview : $scope.previewDate
				}
			};

			if ( $scope.firstCallFlag == true ) { // 인입후 탭 클릭시 카테고리별 탭 컨텐츠 비우기 실행
				$scope.tpmlData.contData.ctg_plan_list = [];
			}

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;
			})
			.finally(function () {
				/*
				if ( $scope.firstCallFlag == false ) {
					$timeout(function () {
						$scope.ctgTabOffset = $('.ctg_tab_list').offset().top - 38;
						$scope.firstCallFlag = true;
					}, 700);
				};*/
           		$scope.productListLoading = false;
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});
		};

		// Stored Data Check
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
			$scope.CtgIdx = $scope.tpmlData.uiOpt.slcCtgTabIdx;
			/*
			if ( $scope.firstCallFlag == false ) {
				$timeout(function () {
					$scope.ctgTabOffset = $('.ctg_tab_list').offset().top - 38;
					$scope.firstCallFlag = true;
				}, 700);
			};*/
		} else {
			$scope.loadData();
		}
		/*
		// 화면 스크롤시 헤더 동작
		$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
			var gap = Math.abs(args.scrollPos - $scope.beforeScrollPos);
			var limitYPos = $scope.screenType > 1 ? 50 : 90;
			if ( $scope.firstCallFlag ) {
				if ( args.scrollPos > $scope.ctgTabOffset ) {
					$scope.scrollEnabledFlag = true;
				}else{
					$scope.scrollEnabledFlag = false;
				}
			}
		});*/
	}]);

	// 기획전 탭 Directive
	app.directive('tpmlPlanshop', [ '$window', function ($window) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlPlanshopCtrl",
			link : function ($scope, element, attrs) {
				var NORMAL_BASE_TCLICK = "m_DC_menu_5547174_";
				var NORMAL_BASE_TCLICK2 = "tclick=" + NORMAL_BASE_TCLICK;

				//$('#container').removeAttr('style'); // 탭 고정을 위한 transform 속성 삭제

				// 기획전 카테고리탭 클릭
				$scope.ctgTabClick = function(slcCtgNo, idx){
					$scope.tpmlData.uiOpt.slcCtgTabNo = slcCtgNo;
					$scope.productListLoading = true;
					$scope.loadData();

					$scope.CtgIdx = idx;
					$scope.tpmlData.uiOpt.slcCtgTabIdx = $scope.CtgIdx;

					// TCLICK
					var tclick = NORMAL_BASE_TCLICK + "Clk_Btn0" + idx;
					$scope.sendTclick(tclick);
				}

				// 카테고리탭 TCLICK 처리
				$scope.ctgTclick = function(url, obj, addParams){
					var path = $scope.baseLink(url);
					path = path + "&" + NORMAL_BASE_TCLICK2;
					if(obj && obj.prefix1 != undefined){
						path = path + obj.prefix1;
					}
					if(obj && obj.useIndex === true && obj.index != undefined){
						path = path + $scope.CtgIdx;
					}
					if(obj && obj.prefix2 != undefined){
						path = path + obj.prefix2;
					}
					if(obj && obj.useIndex === true && obj.index != undefined){
						path = path + "_idx" + ((obj.index < 10) ? "0"+obj.index : obj.index);
					}

					if (addParams) { // 추가 파라메타가 있다면
						angular.forEach(addParams, function (val, key) {
							path += "&" + key + "=" + val;
						});
					}
					location.href = path;
				}

				// TCLICK 처리
				$scope.processTclick = function(url, obj, addParams){
					var path = $scope.baseLink(url);
					path = path + "&" + NORMAL_BASE_TCLICK2;
					if(obj && obj.prefix != undefined){
						path = path + obj.prefix;
					}
					if(obj && obj.useIndex === true && obj.index != undefined){
						path = path + "_idx" + ((obj.index < 10) ? "0"+obj.index : obj.index);
					}

					if (addParams) { // 추가 파라메타가 있다면
						angular.forEach(addParams, function (val, key) {
							path += "&" + key + "=" + val;
						});
					}
					location.href = path;
				}

                //링크 이동 : 티클릭조함
                $scope.gotoLinkM = function(link, tclick_b, index, infoFlag, item){
                    var tclick = NORMAL_BASE_TCLICK + tclick_b;
                    index = index + 1;
                    if(index < 10){
                        tclick = tclick + "0" + index;
                    }else{
                        tclick = tclick + index;
                    }
                    //개인정보 추가 : 0 : 없음, 1 : 성별, 2:성별 + 연령대
                    if(infoFlag > 0){
                        if($scope.loginInfo.isLogin){
                            tclick = tclick + "_sort_" +$scope.loginInfo.genSctCd;
                            if(infoFlag == 2){
                                tclick = tclick + "_" + $scope.ageRange;
                            }
                        }else{
                            tclick = tclick + "_sort_H";
                        }
                    }
                    if(item != null){ //상세
                        if(item == "search"){ //검색페이지
                            link = LotteCommon.searchUrl  + "?" + $scope.baseParam + "&reqType=N&keyword=" + link;
                            $scope.locationParam = "SEARCH"; // 검색에서 언로드시 저장 방지용
                        }else{ //상세페이지
                            link =  LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no;
                        }
                    }
                    var params = {};

                    if ((link + "").indexOf("curDispNo") == -1) {
                    	params.curDispNo = $scope.pageUI.curDispNo;
                    	params.curDispNoSctCd = $scope.pageUI.curDispNoSctCd;
                    }

                    $scope.linkUrl(link, false, tclick, params);
                };
			}
		}
	}]);

	// 스타일샵 탭 Controller
	app.controller('tpmlStyleshopCtrl', ['$scope', '$http', 'LotteCommon', 'commInitData', function ($scope, $http, LotteCommon, commInitData) {
		$scope.ajaxLoadFlag = false;
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5550633",
				gender: "F" // 스타일샵 선택된 탭 (F : 여성, M : 남성)
			},
			contData: {}
		};
		
		$scope.gotoStyleRecom = function(){
			location.href = "/product/m/product_list.do?curDispNo=5407118&tclick=m_DC_SpeDisp5_W_Clk_Ban&" + $scope.baseParam;
		};

		// Data Load
		$scope.loadData = function (gender) {
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;
			$scope.tpmlData.uiOpt.gender = !gender ? "F" : gender; // 로드 성별 세팅

			if($scope.tpmlData.uiOpt.gender == "F"){
				if($scope.loginInfo.isLogin){
	            	if ( $scope.loginInfo.genSctCd && $scope.loginInfo.mbrAge) { // 간편회원일 경우 해당 정보가 없어서 예외처리
		                $scope.bndGen = $scope.loginInfo.genSctCd;
		                $scope.bndAge = $scope.loginInfo.mbrAge;
	            	}
	            }

	            //디폴트값 설정
	            var h_gen = "F"; // 성별(M:남,F:여)
	            var h_age = "30"; // 나이대(20, 30, 40, 50)
	            if($scope.loginInfo.isLogin){
	            	if ($scope.loginInfo.mbrAge) { // 간편회원일 경우 해당 정보가 없어서 예외처리
		                h_age = $scope.loginInfo.mbrAge;
		            }
	            }

				/********************************************
				* TEST Func. - 테스트를 위한 코드 추가
				********************************************/
				if (commInitData.query["age"]) {
		            if(commInitData.query["age"]) {
		            	h_age = commInitData.query["age"];
		            }
				}

	            //브랜드 상품 성별/연령대별 보기
	            $scope.bndAge = h_age;

				var httpConfig = {
					method: "get",
					url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo + "." + $scope.tpmlData.uiOpt.gender : "") ,
					params: {
						dispNo: $scope.tpmlData.uiOpt.dispNo,
						gender: $scope.tpmlData.uiOpt.gender,
						age   : h_age,
						preview : $scope.previewDate
					}
				};
			} else{
				var httpConfig = {
					method: "get",
					url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo + "." + $scope.tpmlData.uiOpt.gender : "") ,
					params: {
						dispNo: $scope.tpmlData.uiOpt.dispNo,
						gender: $scope.tpmlData.uiOpt.gender,
						preview : $scope.previewDate
					}
				};
			}

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;

				/* 디자이너 하단 브랜드샵 리스트 */
				var dataTotal = $scope.tpmlData.contData.brand_shop_list.items != null ? $scope.tpmlData.contData.brand_shop_list.items.length : 0;
				var brandshopSliceData = [];

				// 20170131 테블릿 제거 수정
				if ($scope.tpmlData.contData.brand_shop_list.items && dataTotal > 0) {
					var i = 0,
						j = -1;

					for (i; i < dataTotal; i++) {
						if (i % 16 == 0) {
							j++;
							brandshopSliceData[j] = [];
						}
						brandshopSliceData[j].push($scope.tpmlData.contData.brand_shop_list.items[i]);
					}
					$scope.tpmlData.brandshopData = brandshopSliceData;
				}else{
					$scope.tpmlData.brandshopData = null;
				}
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});
		};

		// Stored Data Check
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length > 0) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
		} else {
			gender=$scope.tpmlData.uiOpt.gender;
			if(commInitData.query['gender'] != undefined){
				var gender = commInitData.query['gender'];
			}
			$scope.loadData(gender);
		}
	}]);

	// 스타일샵 탭 Directive
	app.directive('tpmlStyleshop', ['$window', 'LotteCommon', function ($window, LotteCommon) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlStyleshopCtrl",
			link : function ($scope, element, attrs) {

				var NORMAL_BASE_TCLICK = "m_DC_menu_SpeDisp5_W_";
				var NORMAL_BASE_TCLICK2 = "tclick=" + NORMAL_BASE_TCLICK;

				$scope.tabChange = function (gender) { // WOMEN / MEN 탭 변경
					$scope.tpmlData.gender = gender;
					$scope.tpmlData.contData = {};
					$scope.loadData(gender);

					var tclickCode = "";

					if (gender == "F") { // 여성탭
						tclickCode = "m_DC_SpeDisp5_Tab_Women";
					} else if (gender == "M") { // 남성탭
						tclickCode = "m_DC_SpeDisp5_Tab_Men";
					} else if (gender == "D") { // 남성탭
						tclickCode = "m_DC_SpeDisp5_Tab_Designer";
					}

					if (tclickCode) {
						var mType= "";
						switch(gender){
						   default: mType='Women'; break;
						   case 'F': mType = 'Women'; break;
						   case 'M': mType = 'Men'; break;
						   case 'D': mType = 'Designer'; break;
						}
						$scope.sendTclick("m_DC_SpeDisp5_Tab_"+mType);
					}
				};

				function getParameter(url, name) { // 전달 받은 입력된 운영 URL의 파라메타를 Object 형태로 리턴
					var vars = {};
					var parts = (url + "").replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
						vars[key] = value;
					});

					return vars[name];
				}

				function validateURL(url) { // URL 맵핑
					var rtnURL = url + "";

					if (rtnURL.indexOf("/planshop/viewPlanShopDetail.lotte") > -1) { // PC 기획전 URL일 경우 모바일 기획전 URL로 변경
						rtnURL = LotteCommon.prdlstUrl + "?curDispNo=" + getParameter(rtnURL, "spdp_no");
					} else if (rtnURL.indexOf("/product/m/product_list.do") > -1) { // 모바일 기획전일 경우
						rtnURL = LotteCommon.prdlstUrl + "?curDispNo=" + getParameter(rtnURL, "curDispNo");
					} else if (rtnURL.length >= 6 && rtnURL.length <= 8 && !rtnURL.match(/[^0-9]/)) { //숫자형태 6~8자 사이로 입력했을 경우 스타일샵 DispNo로 인식하고 스타일샵 카테고리 페이지로 이동
						rtnURL = LotteCommon.styleShopUrl + "?disp_no=" + rtnURL + "&curDispNoSctCd=46";
					} else if (rtnURL.indexOf("/styleshop/styleshop.do") > -1) { // 모바일 스타일샵 카테고리일 경우
						rtnURL = LotteCommon.styleShopUrl + "?disp_no=" + getParameter(rtnURL, "disp_no") + "&curDispNoSctCd=46";
					} else if (rtnURL.indexOf("/goods/viewGoodsDetail.lotte") > -1) {
						rtnURL = LotteCommon.prdviewUrl + "?goods_no=" + getParameter(rtnURL, "goods_no") + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
					}/* else if () { // PC 스타일샵 오픈시 PC용 스타일샵 링크 페이지를 모바일 스타일샵 링크로 변경 필요

					}*/

					return rtnURL;
				}

				$scope.goStyleShopLink = function (item, tclick) { // 운영 링크 경로가 있을 경우 운영 링크로 없을 경우 상품페이지로
					if (item.sold_out) {
						return false;
					}

					if (item.img_link && (item.img_link + "").length > 3) { // 코너 입력 링크로 이동
						$scope.linkUrl(validateURL(item.img_link), false, tclick);
					} else if (item.goods_no) { // 상품으로 이동
						var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
						$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					}
				};

				$scope.goStyleShopCategory = function (dispNo, tclick) { // 스타일샵 카테고리 페이지
					if (dispNo) {
						var url = LotteCommon.styleShopUrl + "?" + $scope.baseParam + "&disp_no=" + dispNo + "&curDispNoSctCd=46";
						$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					}
				};

				$scope.goStyleShopMenLink = function (item, tclick) { // 운영 링크 경로가 있을 경우 운영 링크로 없을 경우 상품페이지로
					if (item.sold_out) {
						return false;
					}

					if (item.banner_nm !='') { // 코너 입력 링크로 이동
						var url = LotteCommon.styleShopMenUrl + "?" + $scope.baseParam  + '&' + "keyword=" + item.banner_nm;
						$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					} else if (item.goods_no) { // 상품으로 이동
						var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
						$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					}
				};


				$scope.goStyleBrand = function (item, tclick) { // 브랜드 매장 연결
					if(item.img_link!=''){
						var url = LotteCommon.brandShopSubUrl + "?" + $scope.baseParam + "&upBrdNo=" + item.img_link;
						$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					}else{
						$scope.linkUrl(validateURL(item.url_link), false, tclick);
					}
				};

				$scope.goStyleKeyword = function (item, tclick) { // 브랜드 매장 연결
					$scope.linkUrl(validateURL(item.ctg_no), false, tclick);
				};

				$scope.chkHtmlColorCode = function (color) { // 컬러 코드값 validate
					var colorCodeArr = (color + "").match(/^\#[0-9|a-f|A-F]+/i),
						colorCode = "",
						rtnColorCode = "#000";

					if (colorCodeArr && colorCodeArr.length > 0) {
						colorCode = colorCodeArr[0] + "";
					}

					if (colorCode && colorCode.match(/^\#/) && colorCode.length == 4 || colorCode.length == 7) {
						rtnColorCode = colorCode;
					}

					return rtnColorCode;
				};
				$scope.goStyleCateLink = function(link, tclick){
					var url = link.indexOf('?')>-1 ? link+'&' : link+'?';
					url += $scope.baseParam + '&tclick=' + tclick;
					location.href = url;
				};

				// 동영상 재생 TCLICK 처리
				$scope.movPlayTclick = function(){
					var tclick = NORMAL_BASE_TCLICK + "Clk_Video_play";
					$scope.sendTclick(tclick);
				}

				// 동영상 일시정지 TCLICK 처리
				$scope.movStopTclick = function(){
					var tclick = NORMAL_BASE_TCLICK + "Clk_Video_pause";
					$scope.sendTclick(tclick);
				}

				// 동영상 상세보기 링크
				$scope.movProdLink = function(goodsNo, tlick_b){
					var link = '',
                    	tclick = tlick_b;

					link =  LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goodsNo;
                    $scope.linkUrl(link, false, tclick);
				}

				// v-com : 동영상 음소거 TCLICK 처리
				$scope.movMuteTclick = function(tclick, tclick2){
					var tclick = NORMAL_BASE_TCLICK + tclick;
					if ($(".mov_auto_wrap .video_wrap .btn_move_volume").hasClass("mute")){
						tclick = NORMAL_BASE_TCLICK + tclick2;
					}
					$scope.sendTclick(tclick);
				};

				$scope.goStyleShop = function (item, tclick) { // 운영 링크 경로가 있을 경우 운영 링크로 없을 경우 상품페이지로
					if (item.sold_out) {
						return false;
					}

					if (item.link_url && (item.link_url + "").length > 3) { // 코너 입력 링크로 이동
						$scope.linkUrl(validateURL(item.link_url), false, tclick);
					} else if (item.goods_no) { // 상품으로 이동
						var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
						$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					}
				};

				$scope.themeGoLink = function(item, tclick_b){
					var url = $scope.baseLink(item.link_url);
					var tclick = tclick_b;
					location.href = url + (tclick ? "&tclick=" + tclick : "");
				}

				// TCLICK 처리
				$scope.processTclick = function(url, obj){
					var path = $scope.baseLink(url);
					path = path + "&" + NORMAL_BASE_TCLICK2;
					if(obj && obj.prefix != undefined){
						path = path + obj.prefix;
					}
					if(obj && obj.useIndex === true && obj.index != undefined){
						path = path + "_idx" + ((obj.index < 10) ? "0"+obj.index : obj.index);
					}
					if(obj && obj.useSex === true){
						if($scope.rScope.loginInfo && $scope.rScope.loginInfo.login){
							if($scope.rScope.loginInfo.genSctCd == "M" || $scope.rScope.loginInfo.genSctCd == "F"){
								path = path + "_sort_" + $scope.rScope.loginInfo.genSctCd;
							}else{
								path = path + "_sort_H";
							}
						}else{
							path = path + "_sort_H";
						}
					}
					if(obj && obj.useAge === true && $scope.rScope.loginInfo && $scope.ageRange){
						path = path + "_" + $scope.ageRange;
					}
					if(obj && obj.useDevice === true){
						if($scope.rScope.appObj.isIOS){
							path = path + "_ios";
						}else if($scope.rScope.appObj.isAndroid){
							path = path + "_and";
						}else if($scope.rScope.appObj.isSktApp){
							path = path + "_tlotte";
						}
					}
					location.href = path;
				}

				$scope.dBrandShopGo = function (items, tclick, index) { // 운영 링크 경로가 있을 경우 운영 링크로 없을 경우 상품페이지로
					if(index!=null){
						index = index + 1;
						if(index < 10){
							tclick = tclick + "0" + index;
						}else{
							tclick = tclick + index;
						}
					}

					if(items.link_url != null){
						window.location.href = items.link_url + (tclick ? "&tclick=" + tclick : "");
					} else if (item.goods_no) { // 상품으로 이동
						var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
						$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					}
				};
			}
		}
	}]);

	// 스토리샵 탭 Controller
	app.controller('tpmlStoryshopCtrl', ['$scope', '$http', 'LotteCommon',  function ($scope, $http, LotteCommon) {
		$scope.ajaxLoadFlag = false;
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5544340"
			},
			contData: {}
		};

		// Data Load
		$scope.loadData = function () {
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;

			var httpConfig = {
				method: "get",
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: {
					dispNo: $scope.tpmlData.uiOpt.dispNo,
					preview : $scope.previewDate
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});
		};

		// Stored Data Check
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
		} else {
			$scope.loadData();
		}
	}]);

	// 스토리샵 탭 Directive
	app.directive('tpmlStoryshop', [function () {
		return {
			restrict: 'A', // attribute
			controller: "tpmlStoryshopCtrl",
			link : function ($scope, element, attrs) {
                //20160419
                //카테고리 탭
                $scope.stSelectId = 0;
                $scope.stSelectIndex = 0;
                $scope.stCateLink = function(id, index){
                    $scope.stSelectId = id;  //카테고리 고유번
                    $scope.stSelectIndex = index; //순서
                    $scope.sendTclick("m_DC_menu_5544340_Clk_Btn_0" + (index + 1));
                }

                $scope.brReplace = function(str){
                    return str.replace("&lt;br&gt;", "<br>");
                }
                //스토리샵 링크
                $scope.storyLink = function(item, tclickstr, id, count){
                    var url = item.img_link;
                    var outlinkFlag = item.mov_frme_cd;
                    var addParams = {
                        ss_yn: 'Y',
                        stcate : item.category_nm,
                        stnm : item.banner_nm.replace("&lt;br&gt;", ""),
                        stdt : item.date,
                        stno : item.category_no
                    };
                    var tclick = tclickstr;
                    if(id != null){
                        var index = $(id).index() + 1;
                        if(count == 1){
                            index += $("#fbanner > li").length;
                        }
                        if(index < 10){
                            tclick += "0" + index;
                        }else{
                            tclick += index;
                        }
                    }
                    //linkUrl(tpmlData.contData.stsp_banner_top.items[0].img_link, tpmlData.contData.stsp_banner_top.items[0].mov_frme_cd, 'm_menu_5544340_banner1', {ss_yn: 'Y'})
                    $scope.linkUrl(url, outlinkFlag, tclick, addParams);
                }
			}
		}
	}]);

	// 이벤트 탭 Controller
	app.controller('tpmlEventCtrl', ['$scope', '$http', 'LotteCommon',  function ($scope, $http, LotteCommon) {
		$scope.ajaxLoadFlag = false;
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5537336"
			},
			contData: {}
		};

		// Data Load
		$scope.loadData = function () {
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;

			var httpConfig = {
				method: "get",
                cache : false,
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: {
					dispNo: $scope.tpmlData.uiOpt.dispNo,
					preview : $scope.previewDate
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});
		};

        //ios 에서 back 해서 돌아올때 갱신 처리
        /* 1101 */
        $scope.iosbackFnc = function(){
            if($scope.tpmlData.contData.today_stamp =='N' || $scope.tpmlData.contData.mbr_down_yn =='N'){
                var cnt = 0;
                var intId = setInterval(function(){
                    if(cnt < 3){
                        //alert("dataLoad");
                        $scope.loadData();
                    }else{
                        clearInterval(intId);
                    }
                    cnt++;
                }, 1000);
            }
        }


		// Stored Data Check
        /*
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
		} else {

		}
        */

        $scope.loadData();
	}]);

	// 이벤트 탭 Directive 20160406
	app.directive('tpmlEvent', ['LotteCommon', 'commInitData','$http', function (LotteCommon, commInitData,$http) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlEventCtrl",
			link : function ($scope, element, attrs) {

                //20160406 출석도장
                /* 1101 */
                var today = new Date();
                var yesterday = new Date(today.valueOf()-(24*60*60*1000));
                var tomorrow = new Date(today.valueOf()+(24*60*60*1000));
                var weekDay = ["일","월","화","수","목","금","토"];
                $scope.stamp_today = today.getDate() + "일(" + weekDay[today.getDay()] + ")";
                $scope.stamp_yesterday = yesterday.getDate() + "일(" + weekDay[yesterday.getDay()] + ")";
                $scope.stamp_tomorrow = tomorrow.getDate() + "일(" + weekDay[tomorrow.getDay()] + ")";

                $scope.linkUrlCon = function (url, outlinkFlag, tclick, index) {
                    if(index < 10){
                        index = "0" + index;
                    }
                    $scope.linkUrl(url, outlinkFlag, tclick + index, null);
                }
                //출석하기
                $scope.tomorrowStamp = function(){
                    $scope.sendTclick("m_menu_55537336_Clk_Check_Btn02");
                    alert("내일 다시 방문해주세요.");
                }
                $scope.todayStamp = function(){
                    $scope.sendTclick("m_menu_55537336_Clk_Check_Btn01");
                    if($scope.loginInfo.isLogin){
                        if($scope.tpmlData.contData.today_stamp == 'Y'){
                            alert("이미 출석도짱을 찍으셨습니다. 내일 다시 방문해주세요.");
                        }else{
                            $scope.regAttend();
                        }
                    }else{
                        $scope.loginPageFormEvent("m_menu_5537336_Clk_Login_Btn");
                    }
                }
                $scope.loginPageFormEvent = function(tclick){
        				var targUrl = "targetUrl="+encodeURIComponent(location.href + "&dispNo=5537336", 'UTF-8');
        				//eung_check
                        location.href = $scope.baseLink('/login/m/loginForm.do?' + targUrl + "&tclick=" + tclick);
                }



				var evtEntryYn = 2,
					chlNo = commInitData.query['cn'] ? commInitData.query['cn'] : 1;

				// 이벤트 대상 채널 세팅 응모대상  바로방문으로 접속한 모든 회원
				if (chlNo == "0" ||  // 미집계
					chlNo == "1" || // 모바일웹 롯데닷컴
					chlNo == "23" || // 모바일 롯데닷컴 (모바일앱)
					chlNo == "146" || // 롯데닷컴 메일
					chlNo == "510" || // 직접URL(롯데(lotte))
					chlNo == "109329" || // 이메일 모바일
					chlNo == "117124" || // SMART 바콘1
					chlNo == "117125" || // SMART 바콘 2
					chlNo == "120024" || // 모바일 미분류
					chlNo == "120724" || // SMART 바콘3
					chlNo == "125525" || // SMART 바콘4
					chlNo == "125526" || // SMART 바콘 5
					chlNo == "126124" || // SMART 바콘 교차 배포
					chlNo == "153527" || // 이메일 모바일 브릿지
					chlNo == "156027" || // SKT 이메일 쇼핑
					chlNo == "156025" || // SKT 모바일 앱
					chlNo == "132224" || // 앱 이메일 특가
					chlNo == "133025" || // 이메일 SMS
					chlNo == "140024" || // SMART 바콘 플래티넘
					chlNo == "133224" || // APP PUSH
					chlNo == "141224" || // 이거어때 앱
					chlNo == "140924" || // PC 제휴채널, 앱전환
					chlNo == "146724" || // 스마트픽 웹
					chlNo == "116824" || // 스마트픽 앱
					chlNo == "145524" || // 롯데닷컴 앱 (아이패드)
					chlNo == "123624" || // [모바일] 이거어때
					chlNo == "126824" || // 모바일 LMS
					chlNo == "156624" || // SKT 이거어때
					chlNo == "156026" || // T롯데닷컴 APP PUSH
					chlNo == "151224" || // 바탕화면 아이콘1
					chlNo == "171624" || // 롯데닷컴메일 개인화
					chlNo == "171625" || // 롯데닷컴메일 개인화 모바일
					chlNo == "171525" || // APP PUSH 개인화
					chlNo == "172324" ||// T롯데닷컴 APP PUSH 개인화
					chlNo == "171624" || // 롯데닷컴 메일 개인화
					chlNo == "171625" || // 롯데닷컴 메일 개인화 모바일
					chlNo == "171525" || // APP PUSH (개인화)
					chlNo == "172324" || // T롯데닷컴 APP PUSH (개인화)
					chlNo == "188026"  // 딥링크
					) {
					evtEntryYn = 1;
				}
                /* 1101 */
                var regAttendOne = true;
                $scope.regAttend = function () {
                    if(regAttendOne){
                        if(evtEntryYn == 1){
                            //regAttendOne = false;
                            var postParams = {
                                  evt_no : $scope.tpmlData.contData.evt_no,
                                  evt_type : "at"
                            }
                            $http({
                                url: LotteCommon.registAttendData,
                                data: $.param(postParams),
                                method: 'POST',
                                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
                            })
                            .success(function (data) {
                                if (data.data_set.response_msg.indexOf("0000") > -1) {
                                    alert("출석도짱이 발급되었습니다.");
                                }else {
                                    //alert(data.data_set.response_msg);
                                }
                                $scope.tpmlData.contData.today_stamp ='Y';
                            });
                        } else {
                            alert("출석도짱은 바로방문on으로 접속하셔야만 찍을 수 있습니다.");
                        }
                    }
				};

				//20160406 참좋은혜택 다운받기
                $scope.regCoupon = function(coupon_type, member_grade){
                    $scope.sendTclick("m_menu_5537336_Clk_Coupon_Btn");
					var postParams = {
						coupon_type : coupon_type,
						member_grade : member_grade
					};
					$http({
						url: '/json/mylotte/reg_grade_coupon.json?' + $scope.baseParam,
						data: $.param(postParams),
						method: 'POST',
						headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
					}) // AJAX 호출
					.success(function (data, status, headers, config) { // 호출 성공시
						// console.log(data.data_set.response_msg);
						if (data.data_set.response_msg == "CS") {
                            var msg = "이달의 참좋은 쿠폰이 발급되었습니다.";
                            alert(msg);
                            $scope.tpmlData.contData.mbr_down_yn = "Y";
							/*
                            if (confirm(msg)) {
                                $scope.linkUrl(eventLinkObj.eventBenefitUrl, false, 'm_menu_5537336_set3');
							}*/
						}else if (data.data_set.response_msg == "CD") {
								alert("이미 발급된 쿠폰입니다.");
						} else if (data.data_set.response_msg == "CF") {
							alert("쿠폰 발급이 실패했습니다.");
						} else if (data.data_set.response_msg == "CX") {
							alert("쿠폰 발급이 실패했습니다.");
						} else {
							alert("로그인 해 주세요.");
						}
					});
				}

				$scope.eventLinkObj = { // 이벤트탭 관련 링크
					eventInfoUrl : LotteCommon.eventGumeUrl, // 응모/당첨
					eventSaunUrl : LotteCommon.eventSaunUrl, // 구매사은
					eventBenefitUrl : LotteCommon.gdBenefitUrl, // 참좋은 혜택
					eventAttendUrl : LotteCommon.directAttendUrl, // 출석도짱
                    couponUrl : "/mylotte/pointcoupon/point_info.do?point_div=coupon" //쿠폰 확인하기
				};
			}
		}
	}]);

	app.filter("trustUrl", ['$sce', function ($sce) {
		return function (recordingUrl) {
			return $sce.trustAsResourceUrl(recordingUrl);
		};
	}]);

	// 일반 탭 Controller
	app.controller('tpmlNormalCtrl', ['$scope', '$http', 'LotteCommon', 'LotteUtil', function ($scope, $http, LotteCommon, LotteUtil) {
		$scope.ajaxLoadFlag = false;
		$scope.rScope = LotteUtil.getAbsScope($scope);
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5555564"
			},
			contData: {}
		};

		// Data Load
		$scope.loadData = function () {
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;


			var httpConfig = {
				method: "get",
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: {
					dispNo: $scope.tpmlData.uiOpt.dispNo,
					preview : $scope.previewDate
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;
                //배너 랜덤 처리 20170227
                if($scope.tpmlData.contData.top_main_bnr != undefined){
                    $scope.randomTopBann = $scope.tpmlData.contData.top_main_bnr.main_bnr.items;
                    $scope.bn_order = $scope.banner_shuffle($scope.randomTopBann.length, $scope.tpmlData.contData.top_main_bnr.img_random);
                }
				$scope.processNormalData();// 카테고리 데이터 가공
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});
		};

		// Stored Data Check
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
            //배너 랜덤 처리 20170227
            if($scope.tpmlData.contData.top_main_bnr != undefined){
                $scope.randomTopBann = $scope.tpmlData.contData.top_main_bnr.main_bnr.items;
                $scope.bn_order = $scope.banner_shuffle($scope.randomTopBann.length, $scope.tpmlData.contData.top_main_bnr.img_random);
            }
		} else {
			$scope.loadData();
		}


	}]);

	// 일반 탭 Directive
	app.directive('tpmlNormal', ['LotteCommon', 'commInitData', function (LotteCommon, commInitData) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlNormalCtrl",
			link : function ($scope, element, attrs) {

				var NORMAL_BASE_TCLICK = "m_DC_menu_5555564_";
				var NORMAL_BASE_TCLICK2 = "tclick=" + NORMAL_BASE_TCLICK;

				// 동영상 재생 TCLICK 처리
				$scope.movPlayTclick = function(){
					var tclick = NORMAL_BASE_TCLICK + "Clk_Video_play";
					$scope.sendTclick(tclick);
				}

				// 동영상 일시정지 TCLICK 처리
				$scope.movStopTclick = function(){
					var tclick = NORMAL_BASE_TCLICK + "Clk_Video_pause";
					$scope.sendTclick(tclick);
				}

				// 동영상 상세보기 링크
				$scope.movProdLink = function(goodsNo, tlick_b){
					var link = '',
                    	tclick = tlick_b;

					link =  LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goodsNo;
                    $scope.linkUrl(link, false, tclick);
				}

				// v-com : 동영상 음소거 TCLICK 처리
				$scope.movMuteTclick = function(tclick, tclick2){
					var tclick = NORMAL_BASE_TCLICK + tclick;
					if ($(".mov_auto_wrap .video_wrap .btn_move_volume").hasClass("mute")){
						tclick = NORMAL_BASE_TCLICK + tclick2;
					}
					$scope.sendTclick(tclick);
				};

				// 랜덤배너 소팅 함수
				$scope.randomizeFunc = function(a, b){
					return Math.random() - 0.5;
				}

				// 일반탭 데이터 선가공
				$scope.processNormalData = function(){
					// 대형배너 갯수 6개 제한
					var main_bnr = $scope.tpmlData.contData.main_bnr;
					if(main_bnr != undefined && main_bnr.items != undefined){
						if(main_bnr.items.length > 6){
							main_bnr.items.length = 6;
							main_bnr.total_count = 6;
						}
					}

					// 바로가기 이이콘 갯수 8개 제한
					var shortcut = $scope.tpmlData.contData.shortcut;
					if(shortcut != undefined && shortcut.items != undefined){
						if(shortcut.items.length > 8){
							shortcut.items.length = 8;
							shortcut.total_count = 8;
						}
					}

					// 빅딜
					var bigdeal = $scope.tpmlData.contData.big_deal;
					if(bigdeal != undefined && bigdeal.items != undefined){
						var len = bigdeal.items.length;
						bigdeal.maxCount2 = Math.max(2, parseInt(len / 2, 10) * 2);
						bigdeal.maxCount3 = Math.max(3, parseInt(len / 3, 10) * 3);
					}

					// 코너 운영 5개 반복
					$scope.tpmlData.contData.coner_list = [];
					var tclickarr = ["", "A", "B", "C", "D", "E", "F"];

					var total, i, remain, len, bnr_list, cate_list;
					for(var k=1; k<=5; k++){
						var corner = $scope.tpmlData.contData["corner" + k];
						$scope.tpmlData.contData.coner_list.push(corner);
						if(corner == undefined){ continue; }

						corner.tclick = tclickarr[k];

						// 배너 순서 랜덤
						bnr_list = corner.bnr_list;
						if(bnr_list != undefined && bnr_list.items != undefined && bnr_list.items.length > 1){
							bnr_list.items.sort($scope.randomizeFunc);
							if(bnr_list.items.length > 5){
								bnr_list.items.length = 5;//배너갯수 5개 제한
								bnr_list.total_count = 5;
							}
						}

						// 카테고리
						cate_list = corner.cate_list;
						if(cate_list != undefined && cate_list.items != undefined){
							total = cate_list.items.length;
							for(i=total-1; i>=0; i--){
								if(cate_list.items[i] == null || cate_list.items[i].ctg_nm == ""){
									cate_list.items.splice(i, 1);
								}
							}

							//폰
							total = cate_list.items.length;
							remain = total % 3;
							len = 0;
							if(total <= 6){
								if(remain > 0){
									len = 3 - remain;
								}
							}else{
								switch(remain){
									case 0:
										len = 2;
										break;
									case 1:
										len = 1;
										break;
								}
							}
							for(i=0; i<len; i++){
								cate_list.items.push({"ctg_nm":"","curDispNo":0,"scrtype":1});
							}

							//태블릿
							remain = total % 5;
							len = 0;
							if(total <= 10){
								if(remain > 0){
									len = 5 - remain;
								}
							}else{
								switch(remain){
									case 0:
										len = 4;
										break;
									case 1:
										len = 3;
										break;
									case 2:
										len = 2;
										break;
									case 3:
										len = 1;
										break;
								}
							}
							for(i=0; i<len; i++){
								cate_list.items.push({"ctg_nm":"","curDispNo":0,"scrtype":2});
							}
						}
					}
				}


				// TCLICK 처리
				$scope.processTclick = function(url, obj){
					var path = $scope.baseLink(url);
					path = path + "&" + NORMAL_BASE_TCLICK2;
					if(obj && obj.prefix != undefined){
						path = path + obj.prefix;
					}
					if(obj && obj.useIndex === true && obj.index != undefined){
						path = path + "_idx" + ((obj.index < 10) ? "0"+obj.index : obj.index);
					}
					if(obj && obj.useSex === true){
						if($scope.rScope.loginInfo && $scope.rScope.loginInfo.login){
							if($scope.rScope.loginInfo.genSctCd == "M" || $scope.rScope.loginInfo.genSctCd == "F"){
								path = path + "_sort_" + $scope.rScope.loginInfo.genSctCd;
							}else{
								path = path + "_sort_H";
							}
						}else{
							path = path + "_sort_H";
						}
					}
					if(obj && obj.useAge === true && $scope.rScope.loginInfo && $scope.ageRange){
						path = path + "_" + $scope.ageRange;
					}
					if(obj && obj.useDevice === true){
						if($scope.rScope.appObj.isIOS){
							path = path + "_ios";
						}else if($scope.rScope.appObj.isAndroid){
							path = path + "_and";
						}else if($scope.rScope.appObj.isSktApp){
							path = path + "_tlotte";
						}
					}
					location.href = path;
				}

				/**
				 * @ngdoc function
				 * @name productContainer.function:getProductImage2
				 * @description
				 * 상품 이미지 주소 가저 오기(성인 상품의 경우 성인 인증 안하였을 경우 19금 이미지 노출)
				 * @example
				 * $scope.getProductImage2(item)
				 * @param {Object} item 상품 json data
				 * @param {String} item.img_url 상품 이미지 주소
				 * @param {Number} item.pmg_byr_age_lmt_cd 성인 상품 여부 값이 19 이면 성인 상품
				 */
				$scope.getProductImage2 = function(item) {
					var newUrl = "";
					if(item.img_url == null) {
						return "";
					}

					var imgurl = item.img_url;

					if(commInitData.query['adultChk'] == "Y") {
						return imgurl;
					}

					if(item.pmg_byr_age_lmt_cd != '19' || item.pmg_byr_age_lmt_cd == undefined) {
						if(item.img_url != "") {
							newUrl = imgurl;
						}
					} else {
						if (!$scope.rScope.loginInfo.isAdult) {//로그인 안한 경우
							newUrl = "http://image.lotte.com/lotte/mobile/sub/img_19_280x280.png";
						} else {
							if(item.img_url != "") {
								newUrl = imgurl;
							}
						}
					}
					return newUrl;
				}

				/**
				 * 일반탭 빅딜/상품 클릭
				 * @param {Object} item 상품 json data
				 * @param {String} tcode 티클릭 코드 (A~E, Bigdeal)
				 */
				$scope.productDealClickNorm = function (item, tcode) {
					$scope.productInfoProc(item, 'deal', this.$index + 1, tcode);
				}

				/**
				 * 빅딜
				 * @ngdoc function
				 * @name productContainer.function:productInfoProc
				 * @description
				 * 상품 클릭 이벤트 처리
				 * @example
				 * $scope.productInfoProc(item, type, idx)
				 * @param {Object} item 상품 json data
				 * @param {Object} type 상품 Tyep 딜상품인지 아닌지에 대한 처리
				 * @param {Number} idx 상품 리스트 인덱스
				 * @param {String} tcode 티클릭 코드 (A~E, Bigdeal)
				 *
				 * @param {Number} item.outlnkMall 외부 상품 구분값
				 * @param {Boolean} item.has_wish 위시에 담긴 상품인지에 대한 구분값
				 * @param {String} item.limit_age_yn 성인 상품 여부 Y/N
				 * @param {Number} item.pmg_byr_age_lmt_cd 성인 상품 여부 19 이면 19금
				 * @param {String} item.goods_no 상품 번호
				 * @param {String} item.outlnk 외부링크 주소
				 */
				$scope.productInfoProc = function(item, type, idx, tcode) {
					if(item.limit_age_yn == 'Y' || item.pmg_byr_age_lmt_cd == '19') {
						if (!$scope.rScope.loginInfo.isAdult && $scope.rScope.loginInfo.isLogin) { /*19금 상품이고 본인인증 안한 경우*/
							// alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
							$scope.rScope.goAdultSci();
							return false;
						} else if(!$scope.rScope.loginInfo.isLogin) {
							window.location.href = LotteCommon.loginUrl + '?'+$scope.rScope.baseParam + '&adultChk=Y'+"&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
							return false;
						} else if (!$scope.rScope.loginInfo.isAdult) {
							alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
							return false;
						}
					}

					if (item.outlnk != "" && item.outlnk != undefined) {
						if (item.outlnkMall == "SP") {
							if (confirm("롯데슈퍼로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if ($scope.rScope.appObj.isApp) {
									openNativePopup("롯데슈퍼", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}
						} else {
							if (confirm("공식 온라인 몰로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if ($scope.rScope.appObj.isApp) {
									openNativePopup("공식온라인몰", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}

						}
						return false;
					}


					var review = "";
					if (type == 'review') {
						review = "&tabIdx=1";
					}

					var curDispNo = "&curDispNo=" + $scope.pageUI.curDispNo;
					var curDispNoSctCd = "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
					var dealProd = "&genie_yn=Y";

					var path = LotteCommon.prdviewUrl + "?" + $scope.rScope.baseParam + "&goods_no=" + item.goods_no+ curDispNo + curDispNoSctCd + review + dealProd;
					$scope.processTclick(path, {prefix:"Clk_" + tcode + "_Prd", useIndex:true, index:idx});
				}

				// 카테고리 선택
				$scope.categoryClick = function(target, tcode){
					// TCLICK
					var tclick = NORMAL_BASE_TCLICK + "Clk_" + tcode + "_Cat_idx";
					var idx = target.$index + 1;
					if(idx < 10){
						tclick = tclick + "0" + idx;
					}else{
						tclick = tclick + idx;
					}

                    $scope.linkUrl(LotteCommon.cateMidAngul, false, tclick, {
						curDispNo: target.item.curDispNo,
						title: encodeURI(target.item.ctg_nm),
						cateDiv: "MIDDLE",
						idx: "1"
					});
				}

				// 카테고리 더보기/닫기
				$scope.categoryShowMore = function(e){
					var target = $(e.currentTarget);
					var ul = target.parents("ul");
					ul.toggleClass("opened");

					var tclick = NORMAL_BASE_TCLICK + "Clk_Btn";
					if(ul.hasClass("opened")){
						tclick += "01";
					}else{
						tclick += "02";
					}
					$scope.sendTclick(tclick);
				}

				// 일반탭 빅딜 더보기
				$scope.showMoreBigDeal = function(){
					$scope.pageUI.storedData['5553715'] = null;// 빅딜 데이터 삭제
					var tclick = NORMAL_BASE_TCLICK + "Clk_Bigdeal_Btn01";
					$scope.sendTclick(tclick);
					$scope.headerMenuClick(5553715);
				}

			}
		}
	}]);

	// 선물하기 탭 Controller
	app.controller('tpmlGiftpackingCtrl', ['$scope', '$http', 'LotteCommon', 'commInitData', 'LotteUtil',  function ($scope, $http, LotteCommon, commInitData, LotteUtil) {
		$scope.ajaxLoadFlag = false;
		$scope.rScope = LotteUtil.getAbsScope($scope);
		$scope.ProListIdx = 0; // idx 초기화
		$scope.ProListIdx2 = 0; // idx 초기화
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5556743",
			},
			contData: {}
		};

		// Data Load
		$scope.loadData = function () {
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;

			var httpConfig = {
				method: "get",
                cache : false,
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: {
					dispNo: $scope.tpmlData.uiOpt.dispNo,
					preview : $scope.previewDate
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;
                //배너 랜덤 처리 20170227
                if($scope.tpmlData.contData.top_swip_banner != undefined){
                    $scope.randomTopBann = $scope.tpmlData.contData.top_swip_banner.swip_banner.items;
                    $scope.bn_order = $scope.banner_shuffle($scope.randomTopBann.length, $scope.tpmlData.contData.top_swip_banner.img_random);
                }
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});
		};

		// Stored Data Check
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
            //배너 랜덤 처리 20170227
            if($scope.tpmlData.contData.top_swip_banner != undefined){
                $scope.randomTopBann = $scope.tpmlData.contData.top_swip_banner.swip_banner.items;
                $scope.bn_order = $scope.banner_shuffle($scope.randomTopBann.length, $scope.tpmlData.contData.top_swip_banner.img_random);
            }
		} else {
			$scope.loadData();
		}
	}]);

	// 선물포장 탭 Directive
	app.directive('tpmlGiftpacking', ['LotteUtil','LotteCommon', '$location','$window', function (LotteUtil, LotteCommon, $location, $window) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlGiftpackingCtrl",
			link : function ($scope, element, attrs) {
				var NORMAL_BASE_TCLICK = "m_gift_";
				var NORMAL_BASE_TCLICK2 = "tclick=" + NORMAL_BASE_TCLICK;
				//console.log($scope.morelink);

				$scope.goLink = function(url, tclick) {
					var path = $scope.baseLink(url) + "&curDispNo=" + $scope.pageUI.curDispNo + (tclick ? "&tclick=" + tclick : "");
					location.href = path;
				};

				$scope.ProDetail = function(item, tclick_b, idx1, idx2){
					var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no;
					if(idx2 < 10){
						idx2 = "0" + idx2;
					}
					var tclick = tclick_b + idx1 + "_" + idx2;
					location.href = url + "&curDispNo=" + $scope.pageUI.curDispNo + (tclick ? "&tclick=" + tclick : "");
				};

				$scope.ProdLink2 = function(item, tclick_b) {
					var url = $scope.baseLink(item.link_url);
					var tclick = tclick_b;
					location.href = url + "&curDispNo=" + $scope.pageUI.curDispNo + (tclick ? "&tclick=" + tclick : "");
				};

				$scope.ProdLink = function(item, tclick_b, idx1, idx2, addParams) {
					var url = $scope.baseLink(item.link_url);
					if(idx2 < 10){
						idx2 = "0" + idx2;
					}
					var tclick = tclick_b + idx1 + "_" + idx2;

					if (addParams) { // 추가 파라메타가 있다면
						angular.forEach(addParams, function (val, key) {
							url += "&" + key + "=" + val;
						});
					}
					location.href = url + "&curDispNo=" + $scope.pageUI.curDispNo + (tclick ? "&tclick=" + tclick : "");
				};

				$scope.proListMoreTclick = function(url, item, tclick_b) {
					var url = $scope.baseLink(url);
					var addParams = "&divObjNo=" + item.divObjNo + "&divObjTitle=" + item.title;
                    var tclick = tclick_b;
                    location.href = url + "&curDispNo=" + $scope.pageUI.curDispNo + (tclick ? "&tclick=" + tclick : "") + addParams;
                };

				/* 선물포장용 검색 */
				$scope.fn_goSearch2 = function (keyword, tclick){
                    var linkParams = "&reqType=N&keyword=" + keyword + ' 선물포장' + "&curDispNo=" + $scope.pageUI.curDispNo + "&tclick=" + tclick;
                    $scope.locationParam = "SEARCH";
                    $window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + linkParams);
                };

				$scope.gotoAnchor01 = function() {
					$scope.sendTclick('m_gift_theme01');
					if ($(".gift_a").position() == undefined) {
						$('body').animate({"scrollTop":"500px"}, 500,'swing',function () {
							setTimeout(function () {
								if ($(".gift_a").length > 0) {
									$('body').animate({"scrollTop":$(".gift_a").position().top - 45}, 300);
								} else {
									$('body').animate({"scrollTop":$("#footer").position().top}, 300);
								}
							}, 1000);
						});
					} else {
						var scrollTop = $(".gift_a").position().top;
						if ( $( '#head_sub' ).css( 'position' ) == 'fixed' ) {
							scrollTop -= $( '#head_sub' ).height();
						}
						angular.element($window).scrollTop( scrollTop );
					}
				};

				$scope.gotoAnchor02 = function() {
					$scope.sendTclick('m_gift_theme02');
					if ($(".gift_b").position() == undefined) {
						$('body').animate({"scrollTop":"500px"}, 500,'swing',function () {
							setTimeout(function () {
								if ($(".gift_b").length > 0) {
									$('body').animate({"scrollTop":$(".gift_b").position().top - 45}, 300);
								} else {
									$('body').animate({"scrollTop":$("#footer").position().top}, 300);
								}
							}, 1000);
						});
					} else {
						var scrollTop = $(".gift_b").position().top;
						if ( $( '#head_sub' ).css( 'position' ) == 'fixed' ) {
							scrollTop -= $( '#head_sub' ).height();
						}
						angular.element($window).scrollTop( scrollTop );
					}
				};

				$scope.gotoAnchor03 = function() {
					$scope.sendTclick('m_gift_theme03');
					if ($(".gift_c").position() == undefined) {
						$('body').animate({"scrollTop":"500px"}, 500,'swing',function () {
							setTimeout(function () {
								if ($(".gift_c").length > 0) {
									$('body').animate({"scrollTop":$(".gift_c").position().top - 45}, 300);
								} else {
									$('body').animate({"scrollTop":$("#footer").position().top}, 300);
								}
							}, 1000);
						});
					} else {
						var scrollTop = $(".gift_c").position().top;
						if ( $( '#head_sub' ).css( 'position' ) == 'fixed' ) {
							scrollTop -= $( '#head_sub' ).height();
						}
						angular.element($window).scrollTop( scrollTop );
					}
				};

				$scope.gotoAnchor04 = function() {
					$scope.sendTclick('m_gift_theme04');
					if ($(".gift_d").position() == undefined) {
						$('body').animate({"scrollTop":"500px"}, 500,'swing',function () {
							setTimeout(function () {
								if ($(".gift_d").length > 0) {
									$('body').animate({"scrollTop":$(".gift_d").position().top - 45}, 300);
								} else {
									$('body').animate({"scrollTop":$("#footer").position().top}, 300);
								}
							}, 1000);
						});
					} else {
						var scrollTop = $(".gift_d").position().top;
						if ( $( '#head_sub' ).css( 'position' ) == 'fixed' ) {
							scrollTop -= $( '#head_sub' ).height();
						}
						angular.element($window).scrollTop( scrollTop );
					}
				};

				$scope.gotoAnchor05 = function() {
					$scope.sendTclick('m_gift_theme05');
					if ($(".gift_e").position() == undefined) {
						$('body').animate({"scrollTop":"500px"}, 500,'swing',function () {
							setTimeout(function () {
								if ($(".gift_e").length > 0) {
									$('body').animate({"scrollTop":$(".gift_e").position().top - 45}, 300);
								} else {
									$('body').animate({"scrollTop":$("#footer").position().top}, 300);
								}
							}, 1000);
						});
					} else {
						var scrollTop = $(".gift_e").position().top;
						if ( $( '#head_sub' ).css( 'position' ) == 'fixed' ) {
							scrollTop -= $( '#head_sub' ).height();
						}
						angular.element($window).scrollTop( scrollTop );
					}
				};
			}
		}
	}]);
	// Fall Template Directive (가을맞이 템플릿)
    app.controller('templateFallCtrl', ['$scope', '$http', 'LotteCommon','LotteUtil', 'commInitData',  function ($scope, $http, LotteCommon, LotteUtil, commInitData) {
    	$scope.rScope = LotteUtil.getAbsScope($scope);
    	$scope.tpmlData = {
            uiOpt: {
                dispNo: "5562268",
                ctgDispNo: parseInt(Math.random()*2),
				page: 1,
				pageSize: 15,
				isLastPage: false,
				subCtgDispNo:""
            },
            contData: {}
        };

        $scope.loadData = function () { // 가을맞이 카테고리 데이터 로드
            $scope.ajaxLoadFlag = true;
            var httpConfig = {
                method: "get",
                url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") + "?dispNo=" + $scope.tpmlData.uiOpt.dispNo,
                params: {
                    //dispNo : $scope.tpmlData.uiOpt.dispNo,
                    keepData: true, // 전체 데이터 갱신이 아닐 경우 true
                    page : $scope.tpmlData.uiOpt.page,
                    opt_dispno: $scope.tpmlData.uiOpt.ctgDispNo, // 가을맞이 카테고리
                    fallMenuTab: true,
                    preview : $scope.previewDate
                }
            };

            $http(httpConfig) // 실제 탭 데이터 호출
            .success(function (data) {
            	if(data.main_contents.prd_deal_list.total_count == 0){
                    $scope.tpmlData.uiOpt.isLastPage = true;
                }else{
                    if($scope.tpmlData.uiOpt.page == 1){
                        $scope.tpmlData.contData = data.main_contents;
                    }else{
                        $scope.tpmlData.contData.prd_deal_list.items = $scope.tpmlData.contData.prd_deal_list.items.concat(data.main_contents.prd_deal_list.items);
                    }
                    $scope.hDataSet();
                    /* 20170323 50주년 엠블럼 노출  3/30 ~ 4/23 까지 */
					var today, end_day, start_day;
					start_day = '20170330';
					end_day = '20170424';
					today = new Date();
					today=today.getFullYear() + setDigit(today.getMonth() + 1) + setDigit(today.getDate());
					if($scope.previewDate){
						today = $scope.previewDate;
					}
					function setDigit(value){
						return ((value + "").length < 2) ? "0" + value : value + "";
					}
					//console.log(today, start_day, today >= start_day);
					if(today >= start_day && today < end_day){
						var len = $scope.tpmlData.contData.prd_deal_list.items.length;
						for(var i=0; i<len; i++){

							var item = $scope.tpmlData.contData.prd_deal_list.items[i];
								item.md_tip_50 = false;
							if (item.goods_nm.indexOf('[50주년]') >= 0){
								item.md_tip_50 = true;
							}
						}
					}
					/* END:20170323 50주년 엠블럼 노출  3/30 ~ 4/23 까지 */
                }
            }).finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
				//$scope.pageUI.storedData[$scope.tpmlData.uiOpt.subCtgDispNo] = $scope.subCtgDispNo; // Stored Data 저장
			});;
        };
        //데이타 맞춤
        $scope.hDataSet = function(){
            //상품리스트 사이에 배너 섞어넣기
            var ban = $scope.tpmlData.contData.ban_list.items;
            var pb_list = $scope.tpmlData.contData.prd_deal_list.items;
            for(var i=0; i<ban.length; i++){
                if(ban[i].mrk_rnk < pb_list.length){
                    pb_list[ban[i].mrk_rnk].deal_banner = ban[i];
                    pb_list[ban[i].mrk_rnk].deal_banner.local_idx = i;
                }
            }
            $scope.opt_dispno = $scope.tpmlData.uiOpt.ctgDispNo;
            $scope.screenData = {};
            $scope.screenData.top_html = $scope.tpmlData.contData.top_html;
            $scope.screenData.top_ban_list = $scope.tpmlData.contData.top_ban_list.items;
            //console.log($scope.tpmlData.uiOpt.ctgDispNo,'테스트');
        }

        // Stored Data Check
        if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
            Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
            $scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
            $scope.hDataSet();
        } else {
            $scope.loadData();
        }
        //$scope.loadData();
         $scope.getProductImage2 = function(item) {
            var newUrl = "";
            if(item.img_url == null) {
                return "";
            }

            var imgurl = item.img_url;

            if(commInitData.query['adultChk'] == "Y") {
                return imgurl;
            }

            if(item.pmg_byr_age_lmt_cd != '19' || item.pmg_byr_age_lmt_cd == undefined) {
                if(item.img_url != "") {
                    newUrl = imgurl;
                }
            } else {
                if (!$scope.rScope.loginInfo.isAdult) {//로그인 안한 경우
                    newUrl = "http://image.lotte.com/lotte/mobile/sub/img_19_280x280.png";
                } else {
                    if(item.img_url != "") {
                        newUrl = imgurl;
                    }
                }
            }
            return newUrl;
        }

        // 빅딜 상품 클릭
        $scope.productDealClick = function (item) { // 딜상품 클릭
            //$scope.pageUI.curDispNo = $scope.tpmlData.uiOpt.ctgDispNo;
            $scope.productInfoProc(item, 'deal', this.$index + 1);
        }

        $scope.productInfoProc = function(item, type, idx, sp_bd) {
			if(item.limit_age_yn == 'Y' || item.pmg_byr_age_lmt_cd == '19') {
				if (!$scope.rScope.loginInfo.isAdult && $scope.rScope.loginInfo.isLogin) { /*19금 상품이고 본인인증 안한 경우*/
					// alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
					$scope.rScope.goAdultSci();
					return false;
				} else if(!$scope.rScope.loginInfo.isLogin) {
					window.location.href = LotteCommon.loginUrl + '?'+$scope.rScope.baseParam + '&adultChk=Y'+"&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
					return false;
				} else if (!$scope.rScope.loginInfo.isAdult) {
					alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
					return false;
				}
			}

			if (item.outlnk != "" && item.outlnk != undefined) {
				if (item.outlnkMall == "SP") {
					if (confirm("롯데슈퍼로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
						if ($scope.rScope.appObj.isApp) {
							openNativePopup("롯데슈퍼", item.outlnk);
						} else {
							window.open(item.outlnk);
						}
					}
				} else {
					if (confirm("공식 온라인 몰로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
						if ($scope.rScope.appObj.isApp) {
							openNativePopup("공식온라인몰", item.outlnk);
						} else {
							window.open(item.outlnk);
						}
					}

				}
				return false;
			}


			var review = "";
			if (type == 'review') {
				review = "&tabIdx=1";
			}

			//var curDispNo = "&curDispNo=" + $scope.pageUI.curDispNo;
			var curDispNo = "&curDispNo=";
			if($scope.tpmlData.uiOpt.subCtgDispNo == "" || $scope.tpmlData.uiOpt.subCtgDispNo == 1){
				curDispNo += $scope.pageUI.curDispNo;
			}else{
				curDispNo += $scope.tpmlData.uiOpt.subCtgDispNo;
			}
			var curDispNoSctCd = "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
			var dealProd = "&genie_yn=Y";
			var tClickCode = $scope.getDealBaseTclick() + "unit";
			if(idx < 10){
				tClickCode = tClickCode + "0" + idx;
			}else{
				tClickCode = tClickCode + idx;
			}

			window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no+ curDispNo + curDispNoSctCd + review + dealProd + "&tclick="+tClickCode;
		}


        // 빅딜 티클릭 만들기
		$scope.getDealBaseTclick = function(flag){
			var tclick = "m_DC_menu_";
			if($scope.tpmlData.uiOpt.ctgDispNo == "5562268"){
				tclick = tclick + "5562268_";
			}
			else{
				tclick = tclick + "5562268_"+ $scope.tpmlData.uiOpt.ctgDispNo + "_";
			}

			if(flag === true){
				return "&tclick=" + tclick;
			}
			return tclick;
		}

        // 빅딜 배너 TCLICK 처리
		$scope.processBannerTclick = function(item){
			var url = $scope.baseLink(item.img_link);
			var path = url + $scope.getDealBaseTclick(true) + "ban";
			var idx = item.local_idx + 1;
			if(idx < 10){
				path = path + "0" + idx;
			}else{
				path = path + idx;
			}
			location.href = path;
		}

        //탭메뉴
        $scope.fallMenu = function (id, index) {
            $scope.tpmlData.uiOpt.isLastPage = false;
            $scope.tpmlData.uiOpt.page = 1;
            $scope.tpmlData.uiOpt.ctgDispNo = id; // 가을맞이 카테고리 데이터 지정
            $scope.loadData(); // 데이터 로드
            $scope.sendTclick("m_DC_menu_5562268_TAB" + (id + 1));
        };
        var $cont = angular.element("body")[0];
        $scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
            if($scope.tpmlData.uiOpt.isLastPage == true){ return; }
            if (!$scope.ajaxLoadFlag && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
                $scope.tpmlData.uiOpt.page ++;
                $scope.loadData();
            }
        });

    }]);
	app.directive('templateFall', [function () {
		return {
			restrict: 'A', // attribute
			controller: "templateFallCtrl",
			link: function ($scope, el, attrs) {

			}
		};
	}]);
	// 샵앤샵 탭 Controller
	app.controller('tpmlShopnshopCtrl', ['$scope', '$http', 'LotteCommon',  function ($scope, $http, LotteCommon) {
		$scope.ajaxLoadFlag = false;
		$scope.vodIdx = 0;
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5563220"
			},
			contData: {},
			playVod: {},
			vodLn: 0,
			prvListNum:8
		};
		$scope.tBase = $scope.tClickBase + 'menu_' + $scope.tpmlData.uiOpt.dispNo + '_Clk_';

		// Data Load
		$scope.loadData = function () {
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;

			var httpConfig = {
				method: "get",
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: {
					dispNo: $scope.tpmlData.uiOpt.dispNo,
					preview : $scope.previewDate
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;
				$scope.tpmlData.contData.prvList = $scope.tpmlData.contData.stsp_banner_list.items.splice(4);
				$scope.tpmlData.vodLn = $scope.tpmlData.contData.vod_list.items.length;

				var nextPrd = data.main_contents.live_next;
				if(nextPrd != null && nextPrd.items.length){
					angular.forEach(nextPrd.items, function (val, key) {
						nextPrd.items[key].live_date = nextPrd.items[key].live_date.split('|');
					});
				}
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});
		};

		// Stored Data Check
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
		} else {
			$scope.loadData();
		}
	}]);

	// 샵앤샵 탭 Directive
	app.directive('tpmlShopnshop', ['$rootScope', '$http', 'LotteCommon', '$timeout', function ($rootScope, $http, LotteCommon, $timeout) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlShopnshopCtrl",
			link : function ($scope, element, attrs) {
				$scope.liveFlag = false;
				$scope.rerunFlag = false;

				var movUrl = true, talkParam, remainTime = 0, vodFlag = true, chatFlag = true, //실시간 채팅 나오게
					liveUrl = 'http://liveshop.lotte.com/lotteliveshop/livestream.mp4.m3u8';
				var autoplay = 1;// 자동플레이 플레그(0:자동재생함, 1:Wifi만 자동재생, 2:사용안함)

				$('#vodWrap').addClass('endVod');//처음 진입 시

				$scope.movTime = function(){
					$rootScope.vTimer = setInterval(vodTime,1000);
				}

				setTimeout($scope.movTime,500);

				function vodTime(){
					var nowT = new Date();
					var vodH = nowT.getHours();
					var vodM = nowT.getMinutes();
					if(vodH == 16 || (vodH == 17 && vodM < 3)){//16시부터 17시 3분까지
						if(!$scope.liveFlag){
                            var previewstr = "";
                            if($scope.previewDate != undefined){
                                previewstr = "?preview=" + $scope.previewDate;
                            }
							$http.get(LotteCommon.sslive_good + previewstr).success(function(data) {
								$scope.tpmlData.playVod = data.sslive;
								$scope.tpmlData.playVod.vod_url = liveUrl;
								if($scope.tpmlData.playVod != undefined && $scope.tpmlData.playVod.goods_no != 0){
									$scope.chatFlag = chatFlag;
									vodFlag = true;
									$scope.liveFlag = true;
									vodPlay();
									talkParam = {start_dtime : $scope.tpmlData.playVod.start_dtime,
										spdpNo : $scope.tpmlData.playVod.spdp_no,
										is_main : true
									};
									if(chatFlag) $scope.loadTalk();
								}else{
									clearInterval($rootScope.vTimer);
									$scope.chatFlag = false;
									$scope.liveFlag = false;
									vodFlag = false;
									$scope.tpmlData.playVod = $scope.tpmlData.contData.vod_list.items[$scope.vodIdx];
									vodPlay();
								}
							});
						}
						if(remainTime==0){
							remainTime = 10;//10초마다 댓글 가져오기
							if(chatFlag) $scope.loadTalk();
						}
						else remainTime--;
						return;
					}else if(!$scope.rerunFlag && vodH == 14 && movUrl){//14시에 진입시 재방송 재생,동영상끝날때 까지 재생
						if($scope.tpmlData.contData.vod_full_rerun.vod_url){
							$scope.tpmlData.playVod = $scope.tpmlData.contData.vod_full_rerun;
							vodFlag = false;
							$scope.chatFlag = false;
							$scope.liveFlag = false;
							$scope.rerunFlag = true;
							vodPlay();
						}else movUrl = false;
					}else if(vodFlag){
						$scope.chatFlag = false;
						$scope.liveFlag = false;
						vodFlag = false;
						$scope.tpmlData.playVod = $scope.tpmlData.contData.vod_list.items[$scope.vodIdx];
						vodPlay();
					}
				}

				function vodPlay() {
					//if(!$scope.liveFlag) $scope.$apply();

					$timeout(function(){
						$scope.vSource(true);

						if ($('#autoVideo')[0]) {
							$('#autoVideo')[0].load();
						}
					}, 500); // 왜 딜레이 500인지 확인 필요

					$timeout(function() {
						autoVideoPlay('autoVideo', '#autoVideo', false, autoplay);

						$('#vodWrap').removeClass('endVod');

						if ($('#autoVideo')[0]) {
							$('#autoVideo')[0].addEventListener('play',movStart);
							$('#autoVideo')[0].addEventListener('ended',movEnd);
						}
					}, 1500); // 왜 딜레이 1500인지 확인 필요
				}

				function movStart() {
					if ($scope.rerunFlag) clearInterval($rootScope.vTimer);

					if ($('#autoVideo')[0]) {
						$('#autoVideo')[0].removeEventListener('play',movStart);
					}
				}

				function movEnd(){
					if (!$scope.liveFlag && !$scope.rerunFlag)
						$scope.vodIdx = $scope.vodIdx>=$scope.tpmlData.vodLn-1 ? 0 : ++$scope.vodIdx;

					$scope.tpmlData.playVod = [];
					$scope.liveFlag = false;
					vodFlag = true;
					$('#vodWrap').addClass('endVod');

					if ($scope.rerunFlag)
						$rootScope.vTimer = setInterval(vodTime,1000);

					$scope.rerunFlag = false;

					if ($('#autoVideo')[0]) {
						$('#autoVideo')[0].removeEventListener('ended',movEnd);
					}
				}

				$('#vodWrap .btn_move_start').click(function(){//웹에서만 한번 플레이 후 자동재생
					if (autoplay) {
						autoplay = 0;
						autoVideoPlay('autoVideo', '#autoVideo', false, autoplay);
					}
				});

				//비디오 티클릭
				$scope.movClk = function(v) {
					if(autoplay != 0) return false;//티클릭 두번 실행 방지
					var tclick = $scope.tBase;
					if($scope.liveFlag) tclick += 'Live_' +v;
					else if($scope.rerunFlag) tclick += 'Replay_' +v;
					else tclick += 'Video_' + v + '_idx' + ($scope.vodIdx+1);
					$scope.sendTclick(tclick);
				};

				$scope.movPrd = function(v) {
					var tclick = $scope.tBase;
					if($scope.liveFlag) tclick += 'Live_' +v;
					else if($scope.rerunFlag) tclick += 'Replay_' +v;
					else tclick += 'Video_' + v + '_idx' + ($scope.vodIdx+1);
					var url = LotteCommon.prdviewUrl+'?curDispNoSctCd=13&goods_no='+$scope.tpmlData.playVod.goods_no;
					$scope.linkUrl(url, false, tclick, false);
				};

				$scope.loadTalk = function() {
					$http.get(LotteCommon.sslive_talk, {params : talkParam}).success(function(data) {
						$scope.chatList = data.result.items;
					});
				};

				$scope.goChat = function() {
					var url = '/mall/sslive.do'
					var tclick = $scope.tBase + 'Live_chat';
					$scope.linkUrl(url, false, tclick, false);
				};

				$scope.goPrd = function(no, tclick) {
					var url = LotteCommon.prdviewUrl+'?curDispNoSctCd=13&goods_no='+no;
					$scope.linkUrl(url, false, tclick, false);
				};

				$scope.goPlanshop = function(no, tclick) {
					var url = '/product/m/product_list.do?curDispNo='+no;
					$scope.linkUrl(url, false, tclick, false);
				};

				$scope.bannerClk = function(url, t) {
					var tclick = $scope.tBase + t;
					$scope.linkUrl(url, false, tclick, false);
				};

				$scope.brReplace = function(str) {
					return str.replace("&lt;br&gt;", "<br>");
				};

				//스토리샵 링크
				$scope.storyLink = function(item, tclickstr, id, count) {
					var url = item.img_link;
					var outlinkFlag = item.mov_frme_cd;
					var addParams = {
						ss_yn: 'Y',
						stcate : item.category_nm,
						stnm : item.banner_nm.replace("&lt;br&gt;", ""),
						stdt : item.date,
						stno : item.category_no
					};
					var tclick = tclickstr;
					if(id != null){
						var index = $(id).index() + 1;
						if(count == 1){
							index += $("#fbanner > li").length;
						}
						if(index < 10){
							tclick += "0" + index;
						}else{
							tclick += index;
						}
					}
					//linkUrl(tpmlData.contData.stsp_banner_top.items[0].img_link, tpmlData.contData.stsp_banner_top.items[0].mov_frme_cd, 'm_menu_5544340_banner1', {ss_yn: 'Y'})
					$scope.linkUrl(url, outlinkFlag, tclick, addParams);
				};

				$scope.moreStory = function() {
					$scope.tpmlData.prvListNum +=8;
					var tclick = $scope.tBase + 'Btn_B02';
					$scope.sendTclick(tclick);
				};
			}
		}
	}]);
	// 20주년 탭 Controller
	app.controller('tpmlTwentyCtrl', ['$scope', '$http', 'LotteCommon', 'commInitData',  function ($scope, $http, LotteCommon, commInitData) {
		$scope.ajaxLoadFlag = false;
		$scope.tpmlData = {
			uiOpt: {
				dispNo: "5554294",
				take: "B" // 20주년 선택된 탭 (B : 혜택을 봄, S : 할인해 봄)
			},
			contData: {}
		};
		//console.log("commInitData.query.tab2", commInitData.query.tab2);
		// Data Load
		$scope.loadData = function (take) {
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;
			$scope.tpmlData.uiOpt.take = !take ? "B" : take; // 탭 세팅

			var httpConfig = {
				method: "get",
				url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
				params: {
					dispNo: $scope.tpmlData.uiOpt.dispNo,
					take: $scope.tpmlData.uiOpt.take
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.tpmlData.contData = data.main_contents;
				if ($scope.tpmlData.contData.tab_cont.goods != null && $scope.tpmlData.contData.tab_cont.goods.is_soldout && $scope.tpmlData.contData.tab_cont.coupon.is_end) { // 솔드 아웃이고 마감인 경우 할인탭적용
					$scope.tpmlData.uiOpt.take = 'S';
				}
				if(commInitData.query.tab2 == 'Y'){
					$scope.tpmlData.uiOpt.take = 'S';	// 할인해봄 url 넘겨주는 값 main_phone.do?dispNo=5554294&tab2=Y
				} else if (commInitData.query.tab1 == 'Y'){
					$scope.tpmlData.uiOpt.take = 'B';	// 혜택을봄 url 넘겨주는 값 main_phone.do?dispNo=5554294&tab1=Y
				}

			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
			});

		};

		/*
		if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
			Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
			$scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
		} else {
			$scope.loadData();
		}
		*/
		$scope.loadData($scope.tpmlData.uiOpt.take);

	}]);

	// 20주년 탭 Directive
	app.directive('tpmlTwenty', ['$window', '$http', 'LotteCommon', function ($window, $http, LotteCommon) {
		return {
			restrict: 'A', // attribute
			controller: "tpmlTwentyCtrl",
			link : function ($scope, element, attrs) {
				$scope.tabChange = function (take) { // 탭 변경
					if($scope.screenType == 1){
						$scope.tpmlData.uiOpt.take = take;

						//$scope.tpmlData.contData = {};

						var tclickCode = "";

						if (take == "B") { // 혜택을 봄
							tclickCode = "m_menu_5554294_tap1";
						} else if (take == "S") { // 할인해 봄
							tclickCode = "m_menu_5554294_tap2";
						}

						if (tclickCode) {
							$scope.sendTclick("m_menu_5554294_tap" + (take == "B" ? "1" : "2"));
						}
					}

				};


				$scope.goTwentyLink = function (item, tclick) { // 운영 링크 경로가 있을 경우 운영 링크로 없을 경우 상품페이지로
					if (item.is_soldout) {
						return false;
					}

					if (item.link_url && (item.link_url + "").length > 4) { // 코너 입력 링크로 이동
						$scope.linkUrl(item.link_url, false, tclick);
					} else if (item.goods_no) { // 상품으로 이동
						var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
						$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					}
				};


	            /* 쿠폰받기 */
                $scope.getCoupon = function(couponNo){
                	$scope.loginInfo = getLoginInfo();
                	// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				alert("로그인 후 다운로드 받을 수 있습니다.");
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = '/login/m/loginForm.do?' + targUrl;
        				return;
        			}
                	//데이타 전송
                    $http({
                        url : LotteCommon.couponRegCouponData,
                        data : 'cpn_issu_no=' + couponNo,
                        method : 'POST',
                        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
                    }).success(function (data) {
        				alert(data.result);
        			})
                };


			}
		}
	}]);

	// Holiday Template Directive (명절관 템플릿)  20161229
    app.controller('templateHolidayCtrl', ['$scope', '$http', 'LotteCommon','LotteUtil', 'commInitData',  function ($scope, $http, LotteCommon, LotteUtil, commInitData) {
		//$scope.rScope = LotteUtil.getAbsScope($scope);
        $scope.tpmlData = {
            uiOpt: {
                dispNo: "5542242",
				ctgDispNo: parseInt(Math.random() * 4),
				page: 1,
				pageSize: 15,
				isLastPage: false,
			    subCtgDispNo:""

            },
            contData: {}
        };
        $scope.loadData = function () { // 명절 카테고리 데이터 로드
            $scope.ajaxLoadFlag = true;
            var httpConfig = {
                method: "get",
                url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") + "?dispNo=" + $scope.tpmlData.uiOpt.dispNo,
                params: {
                    //dispNo : $scope.tpmlData.uiOpt.dispNo,
                    keepData: true, // 전체 데이터 갱신이 아닐 경우 true
                    page : $scope.tpmlData.uiOpt.page,
                    opt_dispno: $scope.tpmlData.uiOpt.ctgDispNo, // 명절 카테고리
                    holidayMenuTab: true
                }
            };

            $http(httpConfig) // 실제 탭 데이터 호출
            .success(function (data) {
                if(data.main_contents.prd_deal_list.total_count == 0){
                    $scope.tpmlData.uiOpt.isLastPage = true;
                }else{
                    if($scope.tpmlData.uiOpt.page == 1){
                        $scope.tpmlData.contData = data.main_contents;
                    }else{
                        $scope.tpmlData.contData.prd_deal_list.items = $scope.tpmlData.contData.prd_deal_list.items.concat(data.main_contents.prd_deal_list.items);
                    }
                    $scope.hDataSet();
                }
            }).finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
				//$scope.pageUI.storedData[$scope.tpmlData.uiOpt.subCtgDispNo] = $scope.subCtgDispNo; // Stored Data 저장
			});;
        };
        //데이타 맞춤
        $scope.hDataSet = function(){
            //상품리스트 사이에 배너 섞어넣기
            var ban = $scope.tpmlData.contData.ban_list.items;
            var pb_list = $scope.tpmlData.contData.prd_deal_list.items;
            for(var i=0; i<ban.length; i++){
                if(ban[i].mrk_rnk < pb_list.length){
                    pb_list[ban[i].mrk_rnk].deal_banner = ban[i];
					pb_list[ban[i].mrk_rnk].deal_banner.local_idx = i;  //20161229 추가
                }
            }
            $scope.opt_dispno = $scope.tpmlData.uiOpt.ctgDispNo;
            $scope.screenData = {};
            $scope.screenData.top_html = $scope.tpmlData.contData.top_html;
            $scope.screenData.top_ban_list = $scope.tpmlData.contData.top_ban_list.items;
        }

        // Stored Data Check
		/* 20161229 삭제
        if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
            Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
            $scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
            $scope.hDataSet();
        } else {
            $scope.loadData();
        }*/
        $scope.loadData();  // 20161229 추가


        $scope.getProductImage2 = function(item) {
            var newUrl = "";
            if(item.img_url == null) {
                return "";
            }

            var imgurl = item.img_url;

            if(commInitData.query['adultChk'] == "Y") {
                return imgurl;
            }

            if(item.pmg_byr_age_lmt_cd != '19' || item.pmg_byr_age_lmt_cd == undefined) {
                if(item.img_url != "") {
                    newUrl = imgurl;
                }
            } else {
                if (!$scope.rScope.loginInfo.isAdult) {//로그인 안한 경우
                    newUrl = "http://image.lotte.com/lotte/mobile/sub/img_19_280x280.png";
                } else {
                    if(item.img_url != "") {
                        newUrl = imgurl;
                    }
                }
            }
            return newUrl;
        }

        // 빅딜 상품 클릭
        $scope.productDealClick = function (item) { // 딜상품 클릭
            //$scope.pageUI.curDispNo = $scope.tpmlData.uiOpt.ctgDispNo;
            $scope.productInfoProc(item, 'deal', this.$index + 1);
        }

		// 빅딜 배너 TCLICK 처리 - 20161229 추가
		$scope.processBannerTclick = function(item){
			var url = $scope.baseLink(item.img_link);
			var path = url + $scope.getDealBaseTclick(true) + "ban";
			var idx = item.local_idx + 1;
			if(idx < 10){
				path = path + "0" + idx;
			}else{
				path = path + idx;
			}
			location.href = path;
		}

        $scope.productInfoProc = function(item, type, idx, sp_bd) {
					if(item.limit_age_yn == 'Y' || item.pmg_byr_age_lmt_cd == '19') {
						if (!$scope.rScope.loginInfo.isAdult && $scope.rScope.loginInfo.isLogin) { /*19금 상품이고 본인인증 안한 경우*/
							// alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
							$scope.rScope.goAdultSci();
							return false;
						} else if(!$scope.rScope.loginInfo.isLogin) {
							window.location.href = LotteCommon.loginUrl + '?'+$scope.rScope.baseParam + '&adultChk=Y'+"&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
							return false;
						} else if (!$scope.rScope.loginInfo.isAdult) {
							alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
							return false;
						}
					}

					if (item.outlnk != "" && item.outlnk != undefined) {
						if (item.outlnkMall == "SP") {
							if (confirm("롯데슈퍼로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if ($scope.rScope.appObj.isApp) {
									openNativePopup("롯데슈퍼", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}
						} else {
							if (confirm("공식 온라인 몰로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if ($scope.rScope.appObj.isApp) {
									openNativePopup("공식온라인몰", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}

						}
						return false;
					}


					var review = "";
					if (type == 'review') {
						review = "&tabIdx=1";
					}

					//var curDispNo = "&curDispNo=" + $scope.pageUI.curDispNo;
					var curDispNo = "&curDispNo=";
					if($scope.tpmlData.uiOpt.ctgDispNo == "" || $scope.tpmlData.uiOpt.ctgDispNo == 1){  //20161229 subCtgDispNo를 ctgDispNo로 수정
						curDispNo += $scope.pageUI.curDispNo;
					}else{
						curDispNo += $scope.tpmlData.uiOpt.ctgDispNo;  //20161229 subCtgDispNo를 ctgDispNo로 수정
					}
					var curDispNoSctCd = "&curDispNoSctCd=" + $scope.pageUI.curDispNoSctCd;
					var dealProd = "&genie_yn=Y";
					var tClickCode = $scope.getDealBaseTclick() + "unit";
					if(idx < 10){
						tClickCode = tClickCode + "0" + idx;
					}else{
						tClickCode = tClickCode + idx;
					}

					window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no+ curDispNo + curDispNoSctCd + review + dealProd + "&tclick="+tClickCode;
				}
        // 빅딜 티클릭 만들기
        $scope.getDealBaseTclick = function(flag){
            var tclick = "m_DC_menu_5542242_"+ $scope.tpmlData.uiOpt.ctgDispNo + "_";
            if(flag == true){
                return "&tclick=" + tclick;
            }
            return tclick;
        }
        //탭메뉴
        $scope.holidayMenu = function (id) {
            $scope.tpmlData.uiOpt.isLastPage = false;
            $scope.tpmlData.uiOpt.page = 1;
            $scope.tpmlData.uiOpt.ctgDispNo = id; // 명절 카테고리 데이터 지정
            $scope.loadData(); // 데이터 로드
            $scope.sendTclick("m_DC_menu_5542242_TAB" + (id + 1));
        };
        var $cont = angular.element("body")[0];
        $scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
            if($scope.tpmlData.uiOpt.isLastPage == true){ return; }
            if (!$scope.ajaxLoadFlag && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
                $scope.tpmlData.uiOpt.page ++;
                $scope.loadData();
            }
        });

    }]);
	app.directive('templateHoliday', [function () {
		return {
			restrict: 'A', // attribute
			controller: "templateHolidayCtrl",
			link: function ($scope, el, attrs) {

			}
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
				$scope.vPoster = function(){
					angular.element(element).attr("poster", attrs.videoPoster);
				}
			}
		};
	}]);

	// 동영상 주소 - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
	app.directive('videoSource', ['$timeout', function ($timeout) {
		return {
			restrict: 'A', // attribute
			link : function ($scope, element, attrs) {
				if (attrs.videoSource) {
					angular.element(element).attr("src", attrs.videoSource);
				}else{
					// 생생샵 동영상 video-src 데이터 호출이 늦음으로 인한 분기 처리(생생샵 삭제 처리시 같이 제거 필요)
					$timeout(function () {
						if (attrs.videoSource) {
							angular.element(element).attr("src", attrs.videoSource);
						}
					}, 4500);
				}
				$scope.vSource = function(vod){
					if (attrs.videoSource) {
						angular.element(element).attr("src", attrs.videoSource);
						if(vod) angular.element(element).parent().attr("src", attrs.videoSource);
					}else{
					// 생생샵 동영상 video-src 데이터 호출이 늦음으로 인한 분기 처리(생생샵 삭제 처리시 같이 제거 필요)
					$timeout(function () {
						if (attrs.videoSource) {
							angular.element(element).attr("src", attrs.videoSource);
							if(vod) angular.element(element).parent().attr("src", attrs.videoSource);
						}
					}, 4500);
				}

				}
			}
		};
	}]);
})(window, window.angular);
