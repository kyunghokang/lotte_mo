(function (window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
		'lotteMainPop',
		'lotteNgSwipe',
		'lotteSlider',
		'hwVideo',
		'hwSwipe'
	]);

	app.controller('MainCtrl', ['$rootScope', '$http', '$compile', '$scope', '$timeout', '$window', '$location', '$q', 'LotteCommon', 'commInitData', 'LotteUserService', 'LotteStorage', 'LotteCookie', 'AppDownBnrService',
		function ($rootScope, $http, $compile, $scope, $timeout, $window, $location, $q, LotteCommon, commInitData, LotteUserService, LotteStorage, LotteCookie, AppDownBnrService) {
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
		$scope.DisplayContent = {'left':0,'right':0};
		$scope.ipadAppDownInfo = ($scope.appObj.isApp && $scope.appObj.isIpad && $scope.appObj.verNumber < 2800 && LotteStorage.getSessionStorage("app_ipad_update_info_close") != "Y") ? true:false;

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
		$rootScope.pageUI = {
			baseParam: $scope.baseParam,
			defaultRendingDispNo: "", // Default 이거 어때
			curMenuIdx: 0, // 현재 탭 Index
			curMenuDispNo: "", // 현재 탭 전시번호
			curTabMenuDispNo: "", // 현제 텝/서브탭 메뉴 전시번호
			rootMenu: [], // 헤더 메뉴 데이터
			storedData: {}, // 탭 데이터
			curDispNo: "", // 전시 인입코드
			curDispNoSctCd: "", // 전시 인입 상세 코드
			lastCallUrl: "", // 마지막 호출 URL
			isLoginData: false, // 로그인 상태
			winScrollHeaderDownFlag: false,
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

		/**
		 * 안드로이드 OS 4.4 이상 이전버전앱 사용자 업데이트 알림
		 */
		var lottecomNativeChk = window.navigator.userAgent.match(/mlotte001/gi);
		var AOS_UA = window.navigator.userAgent.match(/Android (\d|\.)+/gi);
		var appUpdateCancelFlag = LotteStorage.getSessionStorage("app_update_cancel");
		var appUpdateConfirmStr = "신규 업데이트 항목이 있습니다.\n최신버전으로 업데이트 하시고 더욱 더 편리한 쇼핑을 즐기세요.";

		if (todayTime >= getTime(2017, 7, 10, 9) && todayTime < getTime(2017, 7, 17)) {
			appUpdateConfirmStr = "신규 업데이트 항목이 있습니다.\n최신 버전으로 업데이트 하고, 100% 경품당첨의 기회도 놓치지 마세요.";
		}

		if (appUpdateCancelFlag != "Y" && lottecomNativeChk && lottecomNativeChk.length > 0 && $scope.appObj.isAndroid && $scope.appObj.verNumber < 290 && AOS_UA) {
			var AOS_VER = (AOS_UA[0] + "").replace(/Android|\s|/gi, "");
			var AOS_VER_ARR = AOS_VER.split(".");

			if (AOS_VER_ARR.length >= 2) {
				if (AOS_VER_ARR[0] >= 4) {
					if ((AOS_VER_ARR[0] == 4 && AOS_VER_ARR[1] >= 4) || AOS_VER_ARR[0] > 4) {
						if (confirm(appUpdateConfirmStr)) {
							window.location.href = "market://details?id=com.lotte";
						} else {
							LotteStorage.setSessionStorage("app_update_cancel", "Y");
						}
					}
				}
			}
		}

		/********************************************
		 * Util Func.
		 ********************************************/
		// Index에 맞는 헤더 메뉴 DispNo 구하기
		$scope.getHeaderMenuDispNo = function (idx) {
			if($scope.pageUI.rootMenu.length <= idx) {
				return $scope.pageUI.rootMenu[0].dispNo;
			} else if(idx < 0) {
				return $scope.pageUI.rootMenu[$scope.pageUI.rootMenu.length-1].dispNo;
			}
			return $scope.pageUI.rootMenu.length > idx ? $scope.pageUI.rootMenu[idx].dispNo : 0;
		};

		$scope.getHeaderMenuInfo = function(dispNo) {
			var i = 0, data = {url:"", curDispNoSctCd:"", idx:"", subIdx:""};

			for (i = 0; i < $scope.pageUI.rootMenu.length; i++) {
				if ($scope.pageUI.rootMenu[i].dispNo == dispNo) {
					data.url = $scope.pageUI.rootMenu[i].jsonFilePath;
					data.curDispNoSctCd = $scope.pageUI.rootMenu[i].curDispNoSctCd ? $scope.pageUI.rootMenu[i].curDispNoSctCd:"";
					data.idx = i;
				} else if($scope.pageUI.rootMenu[i].subTab) {
					var subItems = $scope.pageUI.rootMenu[i].subTab.items;
					for (var j = 0; j < subItems.length; j++) {
						if (subItems[j].dispNo == dispNo) {
							data.url = subItems[j].jsonFilePath;
							data.curDispNoSctCd = subItems[j].curDispNoSctCd ? subItems[j].curDispNoSctCd:"";
							data.idx = i;
							data.subIdx = j;
						}
					}
				}
			}
			return data;
		}
		
		// DispNo에 맞는 헤더 메뉴로 메뉴 위치 이동
		$scope.setHeaderMenuIdxPos = function (dispNo, disableAnimation) {
			$timeout(function () { // timeout을 주지 않으면 DOM 렌더링이 끝나지 않아 탭의 넓이 계산에서 오류가 나 제대로 찾아가지 못한다.
				var menuInfo = $scope.getHeaderMenuInfo(dispNo);
				var $headerMenu = angular.element("#gnb nav[lotte-slider]"),
					$headerMenuWrap = $headerMenu.find(">ul"),
					$headerMenuList = $headerMenuWrap.find(">li"),
					$target = $headerMenuList.eq(menuInfo.idx),
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
			var randingInfo = {dispNo:"",menuIdx:0};
			var menuInfo = $scope.getHeaderMenuInfo(dispNo);

			$scope.pageUI.curMenuIdx = menuInfo.idx; // 현재 선택된 Menu Index 저장
			randingInfo.menuIdx = $scope.pageUI.curMenuIdx;
			$scope.pageUI.curMenuDispNo = dispNo; // 현재 선택된 Menu DispNo 저장 및 템플릿 변경

			if($scope.pageUI.rootMenu[$scope.pageUI.curMenuIdx].subTab) {
				var subItems = $scope.pageUI.rootMenu[$scope.pageUI.curMenuIdx].subTab.items;
				var subSelectedItem = subItems[$scope.pageUI.rootMenu[$scope.pageUI.curMenuIdx].tabIndex];
				$scope.setCurDisp(subSelectedItem.dispNo);
				$scope.pageUI.curDispNoSctCd = subSelectedItem.curDispNoSctCd;
				randingInfo.dispNo = subSelectedItem.dispNo;
			} else {
				randingInfo.dispNo = dispNo;
				$scope.setCurDisp($scope.pageUI.curMenuDispNo);
				$scope.pageUI.curDispNoSctCd = menuInfo.curDispNoSctCd;
			}
			$scope.setHeaderMenuIdxPos(dispNo, disableAnimation); // 메뉴 위치 이동
			return randingInfo;
		};

		// 서브탭이 있는 경우 전시 인입코드 세팅
		$scope.setSubTabChangeCurDisp = function (curDispNo, curDispNoSctCd) {
			$scope.pageUI.curDispNo = $scope.pageUI.curTabMenuDispNo = curDispNo;
			$scope.pageUI.curDispNoSctCd = curDispNoSctCd;
		};

		// DispNo에 맞는 전시 인입코드, 인입카테고리 세팅 (상품상세 페이지 이동시 매출집계를 위해 필요함)
		$scope.setCurDisp = function (dispNo, idx) {
			console.log('$scope.setCurDisp',dispNo);
			$scope.pageUI.curDispNo = $scope.pageUI.curTabMenuDispNo = dispNo;
			clearInterval($rootScope.vTimer);
		};

		$rootScope.mainSwipeStart = function($event) {
			if($scope.LotteDimm.dimmed) {
				if($scope.LotteDimm.target != null && $scope.LotteDimm.callback) {
					$scope.LotteDimm.callback();
				}
			}
			console.log("loading swipe content data");
			var target = "";
			var targetIdx = 0;
			if ($event.moveto == "left") { // 스와이프 좌측 이동 <<<
				target = "swipeRightContainer";
				targetIdx = $scope.pageUI.rootMenu.length <= $scope.pageUI.curMenuIdx + 1 ? 0 : $scope.pageUI.curMenuIdx + 1;
			} else { // 스와이프 우측 이동 >>>
				target = "swipeLeftContainer";
				targetIdx = $scope.pageUI.curMenuIdx == 0 ? $scope.pageUI.rootMenu.length - 1 : $scope.pageUI.curMenuIdx - 1;
			}

			var targetDispNo = "";

			if($scope.pageUI.rootMenu[targetIdx].subTab) {
				var subItems = $scope.pageUI.rootMenu[targetIdx].subTab.items;
				targetDispNo = subItems[$scope.pageUI.rootMenu[targetIdx].tabIndex].dispNo;
			} else {
				targetDispNo = $scope.getHeaderMenuDispNo(targetIdx);
			}
			
			if($scope.DisplayContent[$event.moveto] == targetDispNo) {
				return;
			}
			
			$scope.DisplayContent[$event.moveto] = targetDispNo;
			if($scope.pageUI.storedData[targetDispNo] != null) {
				$scope.dispScreen(targetDispNo, target);
			} else {
				$scope.loadData(0, targetDispNo, target);
			}
		}
		
		/********************************************
		 * Callback Func.
		 ********************************************/
		// 메인 Swipe End CallbackFunc.
		$rootScope.mainSwipeReset = function ($event) {
			var targetIdx = 0;
			var targetContainerDataEl = null;

			var srcContainer = "contentContainer";
			if ($event.moveto == "left") { // 스와이프 좌측 이동 <<<
				srcContainer = "swipeRightContainer";
				targetContainerDataEl = angular.element("#swipeRightContainer > div");
				targetIdx = $scope.pageUI.rootMenu.length <= $scope.pageUI.curMenuIdx + 1 ? 0 : $scope.pageUI.curMenuIdx + 1;
			} else { // 스와이프 우측 이동 >>>
				srcContainer = "swipeLeftContainer";
				targetContainerDataEl = angular.element("#swipeLeftContainer > div");
				targetIdx = $scope.pageUI.curMenuIdx == 0 ? $scope.pageUI.rootMenu.length - 1 : $scope.pageUI.curMenuIdx - 1;
			}

			var targetDispNo = $scope.getHeaderMenuDispNo(targetIdx);

			$scope.sendTclick("m_RDC_category_s_" + targetDispNo); // Tclick
			var randingInfo = $scope.moveMenu(targetDispNo); // 메뉴 이동
			if(!$scope.pageUI.storedData[randingInfo.dispNo]) {
				isSwipeLock = true;
			}
			$scope.translateX_Reset(); // 스와이프 좌표 리셋

			// 20160622 박형윤 앱다운로드 배너 추가
			if ($scope.pageUI.winScrollHeaderDownFlag) {
				$scope.beforeScrollPos = $scope.screenType > 1 ? $scope.mainHeaderHeight.tablet : $scope.mainHeaderHeight.mobile; // 기존 스크롤 위치 90으로 초기화
				$win.scrollTop($scope.screenType > 1 ? $scope.mainHeaderHeight.tablet : $scope.mainHeaderHeight.mobile); // 윈도우 스크롤 위치 최상단으로
			} else {
				$scope.beforeScrollPos = 0; // 기존 스크롤 위치 90으로 초기화
				$win.scrollTop(0); // 윈도우 스크롤 위치 최상단으로
			}

			$scope.DisplayContent['left'] = 0;
			$scope.DisplayContent['right'] = 0;

			var contentContainerEl = angular.element("#contentContainer");
			var contentContainerDataEl = angular.element("#contentContainer > div");
			contentContainerDataEl.remove();
			contentContainerEl.prepend(targetContainerDataEl);
			
			angular.element("#container").css({"-webkit-backface-visibility": "",
				"-moz-backface-visibility": "",
				"backface-visibility": "",
				"-webkit-transform": "",
				"-ms-transform": "",
				"-moz-transform": "",
				"transform": ""});
			angular.element("#swipeLeftContainer").html('<div class="bg_loading"><p class="loading_circle"></p></div>');
			angular.element("#swipeRightContainer").html('<div class="bg_loading"><p class="loading_circle"></p></div>');
		};

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
                
			LotteUserService.loadLoginInfoComplete.finally(function () {                

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
						$rootScope.pageUI = sessionData;
						dataLoadFlag = false;

						$timeout(function () {
							$scope.dispScreen($scope.pageUI.curTabMenuDispNo, "contentContainer");
							$scope.moveMenu($scope.pageUI.curMenuDispNo, true); // 메뉴 위치 이동
							$timeout(function () {
								$win.scrollTop(lotteMainScrollY);
							}, 100);
						}, 500);
					} else if (sessionData.rootMenu && sessionData.rootMenu.length > 0 && sessionData.curMenuDispNo && sessionData.curMenuDispNo != "") {
						$scope.pageUI.curMenuDispNo = sessionData.curMenuDispNo;
						$timeout(function () {
							$scope.dispScreen($scope.pageUI.curMenuDispNo, "contentContainer");
							$timeout(function () {
								$win.scrollTop(lotteMainScrollY);
							}, 100);
						}, 500);
					}
				}
                
				deferred.resolve(dataLoadFlag);
			});

			return deferred.promise;
		};

		$scope.ipadAppDownPopupClose = function() {
			$scope.ipadAppDownInfo = false;
			LotteStorage.setSessionStorage("app_ipad_update_info_close", "Y");
		}
		
		$scope.ipadAppDown = function () {
			$scope.sendOutLink("http://itunes.apple.com/app/id376622474?mt=8");
		};
		
		$scope.afterInitDataChkDefer = $scope.afterInitDataChk();

	    var gender = "F"; // 성별 디폴트값 설정
	    var age = "30"; // 나이디 폴트값 설정
	    var ageRange = "30"; // 연령별 디폴트값 설정
	    
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
		
		$scope.ajaxLoadFlag = false;
		// Data Load
		$rootScope.loadData = function (page, dispNo, target, tabIndex) {
			if ($scope.ajaxLoadFlag) {
				return false;
			}
			
			if($scope.pageUI.storedData[dispNo]) {
				$scope.dispScreen(dispNo, target, tabIndex);
				return false;
			}

			angular.element("#"+target).html('<div class="bg_loading"><p class="loading_circle"></p></div>');
			
			$scope.mainData = {};
			$scope.ajaxLoadFlag = true;
			$scope.userAgeGenderSet(); // 성별/연령대 가공데이터 가져오기

			var menuInfo = $scope.getHeaderMenuInfo(dispNo);
			
			var jsonUrl = LotteCommon.isTestFlag ? LotteCommon.mainContentData+"."+dispNo : menuInfo.url;
			$scope.pageUI.lastCallUrl = jsonUrl;
			var httpConfig = {
				method: "get",
				url: jsonUrl ,
				params: {
					dispNo: dispNo,
					gender: gender,
					age   : ageRange,
					branch_nm: $scope.h_branch_nm,
					branch_no: $scope.h_branch_no,
					preview : $scope.previewDate
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.mainData = data;
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				$scope.pageUI.storedData[dispNo] = $scope.mainData; // Stored Data 저장
				if(isLoadingData && target != "contentContainer") {
					$scope.dispScreen(dispNo, target, tabIndex);
				} else {
					if(target != "contentContainer") {
						$timeout(function () {
							var menuInfo = $scope.getHeaderMenuInfo(dispNo);
							if(menuInfo.idx == $scope.pageUI.curMenuIdx) {
								isSwipeLock = false;
								$scope.dispScreen(dispNo, "contentContainer", tabIndex);
							}
						}, 400);
					} else if(target != "") {
						$scope.dispScreen(dispNo, "contentContainer", tabIndex);
					}
				}
				// 마이추천 통해서 이벤트 탭 왔을 경우 처리
				if(commInitData.query["dispNo"] == "5570119" && commInitData.query["prom"] && !angular.element(document.body).data('open5570119')){
					angular.element(document.body).data('open5570119', true);
					$timeout(function(){
						angular.element($window).scrollTop(angular.element('.evt_bnr_list').offset().top - 100);
					}, 500);
				}
			});
		};
        //20170901 명절관 칼라 추가 : purple     
		function getColorCode(rgb, cls) {
			if(!rgb) {
				return "";
			}
			
			var code = "";
			switch(rgb) {
				case "#98ADD9":  
				case "#7291CF":  
					code = "bl";
					break;
				case "#99857F":
				case "#8C7169":
					code = "brw";
					break;
				case "#D998A3":
				case "#E68A97":
					code = "pk";
					break;
				case "#5C997F":
				case "#4D8C71":
					code = "gr";
					break;
				case "#F09461":
				case "#F27C3D":
					code = "org";
					break;
				case "#8677b6":
					code = "purple";
					break;
			}
			if(code != "" && cls.indexOf("tpml_"+code) < 0) {
				code = " tpml_"+code;
			} else {
				code = "";
			}
			
			return code;
		}
		
		var prevScope, nowTemplate; // 이전 scope와 template을 저장하여 초기화 또는 로드하지 않기 위해
		prevScope = [];
		$scope.dispScreen = function(dispNo, target, tabIndex) {
			if(dispNo != undefined) {
				$scope.mainData = $scope.pageUI.storedData[dispNo];
				var menuInfo = $scope.getHeaderMenuInfo(dispNo);
				
				var contentContainerHtml = "";
				if($scope.mainData && $scope.mainData.moduleData) {
					isSwipeLock = false;
					var mData = $scope.mainData.moduleData;
					if($scope.mainData.moduleData.length > 0) {
						if(tabIndex != undefined) {
							$scope.pageUI.curTabMenuDispNo = dispNo; // 20170707 박형윤 추가
							$scope.pageUI.rootMenu[menuInfo.idx].tabIndex = tabIndex;
						}
						if($scope.pageUI.rootMenu[menuInfo.idx].subTab) {
							var classLine = "";
							if($scope.mainData.colorInfo) {
								classLine = getColorCode($scope.mainData.colorInfo.lineColor, classLine);
							}
							contentContainerHtml += "<div class='"+classLine+"'><tab-menu-container tab-data=\"pageUI.rootMenu["+menuInfo.idx+"].subTab.items\" tab-index=\"pageUI.rootMenu["+menuInfo.idx+"].tabIndex\"></tab-menu-container></div>";
						}
						for(i=0;i < mData.length;i++) {
							var classVal = "";
							if($scope.mainData.colorInfo) {
								classVal += getColorCode($scope.mainData.colorInfo.fontColor, classVal);
								classVal += getColorCode($scope.mainData.colorInfo.lineColor, classVal);
								classVal += getColorCode($scope.mainData.colorInfo.loadingBgColor, classVal);
								classVal += getColorCode($scope.mainData.colorInfo.copyBgColor, classVal);
							}
							contentContainerHtml += "<div class='"+classVal+"'> <"+mData[i].moduleId.replace(/M/ig,'m')+"-Container page-disp-no=\""+dispNo+"\" module-data=\"pageUI.storedData["+dispNo+"].moduleData["+i+"]\"></"+mData[i].moduleId.replace(/M/ig,'m')+"-Container></div>";
						}
					}
				}
				if (prevScope[dispNo]) { // 이전 scope가 있을 경우 destroy 하여 scope 메모리 초기화
					prevScope[dispNo].$destroy();
					prevScope[dispNo] = null;
				}
				
				prevScope[dispNo] = $scope.$new();
				angular.element("#"+target).html($compile(contentContainerHtml)(prevScope[dispNo]));					
			} else {
				console.log("undefined screen no");
			}
		};
	}]);

	/**
	 * lotteModulesCtrl
	 * 2017 유닛 모듈 컨트롤러
	 * 모듈내 버튼 클릭 등 처리
	 */
	app.controller('lotteModulesCtrl', ['$rootScope', '$scope' , '$window', 'LotteCommon', 'LotteUtil', function($rootScope, $scope, $window, LotteCommon, LotteUtil) {
		$scope.rScope = LotteUtil.getAbsScope($scope);
		$scope.loginInfo = $scope.rScope.loginInfo;

		$scope.sb_index = 1;
		$scope.swipeEnd = function(idx) {
			$scope.sb_index = idx + 1;
		}

		$scope.numberFill = function(idx, length) {
			var strIdx = "" + idx;
			var fillData = "00000000000000000";
			return fillData.substring(0,length - strIdx.length) + strIdx;
		}
		
		$scope.listDataCheck = function(item) {
			if(item == undefined) {
				return false;
			}
			return true;
		}
		
		$scope.getDeviceTclickName = function(appObj) {
			if(appObj.isSktApp) {
				return "Tlotte";
			} else if(appObj.isIOS || appObj.isIpad) {
				return "_iOS";
			} else if(appObj.isAndroid) {
				return "_And";
			}
			return "";
		}
		
		$scope.mainProductClick = function(goodsNo, tclick) {
			if(goodsNo) {
				var url = LotteUtil.setUrlAddBaseParam(LotteCommon.productviewUrl , $rootScope.pageUI.baseParam + "&goods_no=" + goodsNo + "&curDispNo=" + $rootScope.pageUI.curDispNo + "&curDispNoSctCd=" + $rootScope.pageUI.curDispNoSctCd + "&"+ $rootScope.pageUI.baseParam);
				$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
			}
			console.log(" Product Click : ", goodsNo, "\n tclick : " ,tclick);
		} 
		$scope.moreClick = function(linkUrl, tclick) {
			if(linkUrl) {
				window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick + "&"+ $rootScope.pageUI.baseParam);
			}
			console.log(" More Click : ", linkUrl, "\n tclick : " ,tclick);
		} 
		$scope.planClick = function(linkUrl, tclick) {
			if(linkUrl) {
				window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick + "&"+ $rootScope.pageUI.baseParam);
			}
			console.log(" Plan Click : ", linkUrl, "\n tclick : " ,tclick);
		} 
		$scope.movieClick = function(linkUrl, tclick) {
			if(linkUrl) {
				window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick + "&"+ $rootScope.pageUI.baseParam);
			}
			console.log(" Plan Click : ", linkUrl, "\n tclick : " ,tclick);
		} 
		$scope.mainBannerClick = function(linkUrl, isOutLink, tclick) {
			if(linkUrl) {
				if(isOutLink) {
					window.open(linkUrl);
				} else {
					window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick + "&"+ $rootScope.pageUI.baseParam);
				}
				console.log(" Main Banner Click : ", linkUrl, "\n tclick : " ,tclick);
			}
		} 
		$scope.swipeBannerClick = function(linkUrl, isOutLink, tclick) {
			if(linkUrl) {
				if(isOutLink) {
					window.open(linkUrl);
				} else {
					window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick + "&"+ $rootScope.pageUI.baseParam);
				}
				console.log(" Banner Click : ", linkUrl, "\n tclick : " ,tclick);
			}
			console.log(" Swipe Banner Click : ", linkUrl, "\n tclick : " ,tclick);
		} 
		$scope.categoryClick = function(linkUrl, tclick) {
			if(linkUrl) {
				window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick + "&"+ $rootScope.pageUI.baseParam);
			}
			console.log(" Category Click : ", linkUrl, "\n tclick : " ,tclick);
		} 
		$scope.keywordClick = function(linkUrl, tclick) {
			if(linkUrl) {
				window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick + "&"+ $rootScope.pageUI.baseParam);
			}
			console.log(" Keyword Click : ", linkUrl, "\n tclick : " ,tclick);
		}
	}]);
    
    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/main/main_2017_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });
    
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
			$http.get(LotteCommon.rootMenuData2017, {params : {preview : $scope.previewDate}})
			.success(function (data) {
				if (!data.data) {
					return false;
				}

				if (!data.data.items) {
					return false;
				}

				var displayMenuList = [],
					i = 0,
					validateDefatultTab = false;

				for (i = 0; i < data.data.items.length; i++) { // 전시중인 카테고리 확인/초기탭 유효성 검사
					//20161007 no 7자리 아닐경우, 숫자가 아닐경우, nm이 빈값일 경우 탭 안보임
					//if(data.data.items[i].dispNo.length != 7 || (/[^0-9]/).test(data.data.items[i].dispNo) || data.data.items[i].dispNm == '') continue;

					// 20160401 박형윤 스무살의봄 탭으로 인하여 추가 조건 적용
					//if (data.data.items[i].dispNo != "5554294" || (data.root_menu[i].disp_no == "5554294" && $scope.eventOpenFlag)) {
					//}
					

					if ($scope.pageUI.defaultRendingDispNo == data.data.items[i].dispNo) {
						validateDefatultTab = true;
					}
					
					if(data.data.items[i].subTab) {
						var subItems = data.data.items[i].subTab.items;
                        
						data.data.items[i].tabIndex = 0;                         
                        //20171107 특정 탭 랜덤처리 parseInt(Math.random() * 10)%2 스타일, 라이프 
						if(data.data.items[i].dispNm == "스타일" || data.data.items[i].dispNm == "라이프"){
                           data.data.items[i].tabIndex = parseInt(Math.random() * 10)%2;
                        }
                        
                        
                        for (var j = 0; j < subItems.length; j++) { 
							if ($scope.pageUI.defaultRendingDispNo == subItems[j].dispNo) {
								validateDefatultTab = true;
							}
						}
					}

					displayMenuList.push(data.data.items[i]);
				}


				if (!validateDefatultTab && displayMenuList[0]) { // Default Rending Tab 전시번호가 데이터에 없을 경우 첫번째 데이터의 탭으로 이동되도록
					$scope.pageUI.defaultRendingDispNo = displayMenuList[0].dispNo;
				}

				$scope.pageUI.rootMenu = displayMenuList; // Menu 데이터 바인딩

				// 초기 랜딩시 탭 Tclick
				var rendingTabDispNo = $scope.pageUI.defaultRendingDispNo;

				if ($scope.pageUI.curMenuDispNo && $scope.pageUI.curMenuDispNo != "") {
					rendingTabDispNo = $scope.pageUI.curMenuDispNo;
				}

				$scope.pageUI.curDispNo = rendingTabDispNo;
				$scope.pageUI.curMenuDispNo = rendingTabDispNo;
				$scope.pageUI.curTabMenuDispNo = rendingTabDispNo;
				
				$scope.sendTclick("m_RDC_category_pv_" + rendingTabDispNo);
				$timeout(function () {
					$scope.moveMenu(rendingTabDispNo, true); // 초기 Default 메뉴로 메뉴 위치 이동
				}, 300);
				$scope.loadData(0, rendingTabDispNo, "contentContainer");
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
	app.directive('lotteHeaderMain', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'AppDownBnrService',
		function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, AppDownBnrService) {
		return {
			templateUrl : "/lotte/resources_dev/main/lotte_header_main_2017.html",
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
					$window.location.href = LotteCommon.cartLstUrl + '?' + $scope.baseParam + '&tclick=m_RDC_header_cartlist';
				};

				// 상단 검색 레이어
				$scope.showSrhLayerHeader = function () {
					$scope.sendTclick($scope.tClickRenewalBase + "header_Clk_Lyr_1");
					$scope.showSrhLayer(true);
				};
				
				/**
				 * 상단 검색 레이어 버튼 - 프로모션
				 */
				$scope.showSrhLayerHeaderPromo = function(){
					var param = {};
					if($scope.isValidString($scope.srhPromotKeywordTc)){
						param.tclick = $scope.srhPromotKeywordTc;
					}
					
					if($scope.isValidString($scope.srhPromotKeywordUrl)){
						// URL 있는 경우 링크 이동
						$scope.gotoURL($scope.srhPromotKeywordUrl, param);
						return false;
					}
					
					if($scope.isValidString($scope.srhPromotKeyword)){
						// 키워드만 있는 경우 검색 이동
						param.keyword = $scope.srhPromotKeyword;
						$scope.gotoService("searchUrl", param);
						return false;
					}
					
					// 이도저도 없으면 검색 레이어 열기
					$scope.showSrhLayerHeader();
				};

				// 검색 레이어 보기
				$scope.showSrhLayer = function (tFlag) {
					if (!tFlag) {
						$scope.sendTclick($scope.tClickBase + "header_Clk_Lyr_2");
					}
					angular.element('.main_popup').remove();
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
						var tclick = "m_RDC_header_Clk_Btn_voice_";

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
						var tclick = "m_RDC_header_Clk_Btn_style_";

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
					if($scope.ajaxLoadFlag) {
						return false;
					}
					$scope.sendTclick("m_RDC_category_click_" + dispNo);
					var menuInfo = $scope.getHeaderMenuInfo(dispNo);
					if($scope.pageUI.rootMenu[menuInfo.idx].subTab) {
						var subItems = $scope.pageUI.rootMenu[menuInfo.idx].subTab.items;
						$scope.loadData(0, subItems[$scope.pageUI.rootMenu[menuInfo.idx].tabIndex].dispNo, "contentContainer");
					} else {
						$scope.loadData(0, dispNo, "contentContainer");
					}
					$scope.moveMenu(dispNo);

					if ($scope.pageUI.winScrollHeaderDownFlag) {
						$scope.beforeScrollPos = 0; // 기존 스크롤 위치 90으로 초기화
						$win.scrollTop(0); // 윈도우 스크롤 위치 최상단으로
					} else {
						$scope.beforeScrollPos = 0; // 기존 스크롤 위치 90으로 초기화
						$win.scrollTop(0); // 윈도우 스크롤 위치 최상단으로
					}
				};

				$scope.isMainHeaderFixed = false;

				function chkMainHeaderFixed() {
					if ($win.scrollTop() >= AppDownBnrService.appDownBnrInfo.height) {
						$scope.isMainHeaderFixed = true;
					} else {
						$scope.isMainHeaderFixed = false;
					}
				}

				// 스크롤에 따른 헤더 고정
				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					chkMainHeaderFixed();
				});

				// 앱다운로드 배너 상태 값 변경 확인
				$scope.$watch(function () { return AppDownBnrService.appDownBnrInfo.isShowFlag }, function (newValue, oldValue) {
					if (typeof newValue !== 'undefined') {
						chkMainHeaderFixed();
					}
				});
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
})(window, window.angular);
