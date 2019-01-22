(function (window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',

		'lotteMainPop',

		'mainAppInfo',
		'lotteNgSwipe',
		'lotteProduct',
		'LotteLog',
		'lotteSlider'
	]);

	app.controller('MainCtrl', ['$rootScope', '$scope', '$http', '$timeout', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteStorage', 'LotteCookie', 'LotteUserService',  
		function ($rootScope, $scope, $http, $timeout, $window, $location, LotteCommon, commInitData, LotteStorage, LotteCookie, LotteUserService) {
		$scope.showWrap = true; // 컨텐츠 표시 Flag
		$scope.contVisible = true; // 컨텐츠 표시 Flag
		$scope.smartNoticeShow = false; // 스마트 알림 노출 Flag
		$scope.pageLoading = true; // 페이지 로딩중 여부 Flag
		$scope.productMoreScroll = true; // 페이지 더 불러오기 가능 여부 Flag
		$scope.productListLoading = false; // 페이지 더 불러오기 로딩중 Flag
		$scope.mainTemplateType = ""; // 탭 TemplateType (dispNo)
		$scope.screenID = "main"; // Tclick 을 위한 screenID
		$scope.winWidth = angular.element($window).width(); // 윈도우 넓이
		$scope.defaultRendingTabDispNo = "5537338"; // 최초 랜딩 탭 DispNo (빅딜)
		$scope.bigDealBigDataFlag = false; // 빅딜 개인화 활성화 여부를 위해 추가 (URL 파라메타에 bigdata=Y 추가시에만 나옴)
		$scope.platinumPlanshopFlag = false; // 12/07 ~ 12/13 플래티넘 고객대상 기획전 노출 Flag
		$scope.deptSaleFlag = false; // 11/20 ~ 12/06 백화점 세일
		$scope.holiday_tab_idx = ""; // 명절관 탭 idx
		$scope.holidayHotFlag = false; // 1/15 ~ 2/2명절관 Hot
		$scope.newFlag = false; //~3/31 23:59 까지 스타일샵 상단 NEW   
		$scope.eventBnrFlag = false; // 황금연휴 3종 쿠폰안내 배너 노출 (1/25 09:00 ~ 2/2 23:59)
		$scope.curDispNo = ""; // 기획전 번호와 중복 우료(yubu)
		$scope.curDispNoSctCd = "";

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

		function arrayMatchString(arr, str) { // 배열에서 Str 요소가 있는지 검사
			var i = 0,
				matchFlag = false;

			for (i = 0; i < arr.length; i++) {
				if (arr[i] == str) {
					matchFlag = true;
					break;
				}
			}

			return matchFlag;
		}

		var todayDateTime = new Date(),
			todayDate = todayDateTime.getFullYear() + getAddZero(todayDateTime.getMonth() + 1) + getAddZero(todayDateTime.getDate()), // 년월일
			todayTime = todayDateTime.getTime(); // TimeStemp

		if (commInitData.query["testDate"]) { // 날짜 설정으로 운영되는 요소에 대한 테스트 코드
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

		// 백화점탭 세일 Flag 노출 설정
		if (todayTime >= getTime(2016, 1, 2) && todayTime < getTime(2016, 1, 18)) {
			$scope.deptSaleFlag = true;
		}

		// 명절 hot Flag 노출 설정
		if (todayTime > getTime(2016, 1, 14) || todayTime < getTime(2016, 2, 3, 18)) { // 2016.01.15 00:00 ~ 2016.02.03 18:00
			$scope.holidayHotFlag = true;
		}

		//~3/31 23:59 까지 스타일샵 상단 NEW        
		if (todayTime > getTime(2016, 1, 14) && todayTime < getTime(2016, 4, 1)) { // 2016.01.15 00:00 ~ 2016.04.01 00:00
			$scope.newFlag = true;
		}

		// 탭 비노출 처리 (테스트중인 탭이 노출되는 항목을 막기 위함)
		$scope.disableTabDispNo = [];
		if (todayTime < getTime(2016, 1, 8, 13) || todayTime >= getTime(2016, 2, 3, 18)) { // 2016.01.08 13:00 ~ 2016.02.03 18: 00
			$scope.disableTabDispNo.push("5542242"); // 명절탭
		}

		// if (commInitData.query["styleshop"] != "true" && $location.host() != "mo.lotte.com" && $location.host() != "molocal.lotte.com" && !LotteCommon.isTestFlag) { // 테스트 플래그가 없을 경우에만 제외되도록
		// 	$scope.disableTabDispNo.push("5550633"); // 스타일샵탭
		// }

		$scope.setCurDisp = function (dispNo) { // 전시 인입코드, 인입카테고리 세팅
			$scope.curDispNo = dispNo;

			if (dispNo == "5537338") { // 빅딜
				$scope.curDispNoSctCd = "12";
			} else if (dispNo == "5531226") {
				$scope.curDispNoSctCd = "43";
			} else if (dispNo == "5537343") {
				$scope.curDispNoSctCd = "44";
			} else if ($scope.findMenuNodeItem(dispNo).tmpl_no == "20411") { // 카테고리탭 템플릿
				$scope.curDispNoSctCd = "78";
			}
		};

		var appVersion = "";

		if ($scope.appObj && $scope.appObj.ver) {
			appVersion = parseInt(($scope.appObj.ver + "").replace(/\./gi, ""));
		}

		function callAppSplashInfo() { // 앱에 스플래시 정보 전달
			console.log("앱 스플래시 호출", $scope.loginInfo);

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
				} else if ($scope.appObj.iOsType == "iPhone" && appVersion >= 214) { // 아이폰버전 214 이상
					window.location = "lottebridge://splashinfo/" + gen + "?" + age;
				} else if ($scope.appObj.iOsType == "iPad" && appVersion >= 135) { // 아이패드 버전 135 이상
					window.location = "lottebridge://splashinfo/" + gen + "?" + age;
				}
			}
		}

		// 20151218 회장님 보고용 ipad 스플래시 강제화
		// if (commInitData.query["udid"] != "" && commInitData.query["schema"] != "" && 
		// 	$scope.appObj.iOsType == "iPad" && appVersion >= 135) {
		// 	window.location = "lottebridge://splashinfo/male?40";
		// }

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

		if ($scope.appObj.isApp) { // 앱일 경우 스플래시, mbrNo 정보 전달
			callAppSplashInfo(); // 스플래시 정보 전달
			sendAppMbrNo(); // mbrNo 정보 전달

			$scope.$watch('loginInfo', function (newValue, oldValue) {
				if (newValue === oldValue) {
					return;
				}

				callAppSplashInfo(); // 스플래시 정보 전달
				sendAppMbrNo(); // mbrNo 정보 전달
			});
		}

		// 반응형을 위한 윈도우 넓이 계산
		angular.element($window).on("resize.main orientationchange.main", function (e) {
			$scope.winWidth = angular.element($window).width();
		});

		$scope.mainMenu = []; // 메인 탭 초기 설정

		// 이벤트탭 관련 링크
		$scope.eventLinkObj = {
			eventInfoUrl : LotteCommon.eventGumeUrl, // 응모/당첨
			eventSaunUrl : LotteCommon.eventSaunUrl, // 구매사은
			eventBenefitUrl : LotteCommon.gdBenefitUrl, // 참좋은 혜택
			eventAttendUrl : LotteCommon.directAttendUrl // 출석도짱
		};

		$scope.getMenu = function () { // 메인 상단 네비게이션 정보 Data Load
			$http.get(LotteCommon.mainTabsData)
			.success(function (data) {
				if (!data.root_menu)
					return false;

				// Main Navigation 가공 (카테고리 1차원 배열에서 2차원 배열로 변경)
				var originalData = data.root_menu,
					naviData = [],
					i = 0,
					j = 0,
					tmpUprDispNo = "";

				for (i; i < originalData.length; i++) {
					if (tmpUprDispNo != "" && tmpUprDispNo != originalData[i].upr_disp_no) { // 상위 전시 번호를 판단하여 2차원 배열로
						j++;
					}

					tmpUprDispNo = originalData[i].upr_disp_no;

					if (!naviData[j]) {
						naviData[j] = { tabName : originalData[i].upr_disp_nm, list : []};
					}

					if (!arrayMatchString($scope.disableTabDispNo, originalData[i].disp_no)) { // 비노출 설정 탭은 탭 정보에 포함시키지 않음
						naviData[j].list.push(originalData[i]);
					}
				}

				$scope.mainMenu = naviData;
				$scope.pageOptions.depth1NodeCnt = $scope.mainMenu.length; // Depth1 메뉴 갯수 저장
				$scope.pageOptions.depth2NodeCnt = $scope.mainMenu[$scope.pageOptions.depth1NodeIdx].list.length;

				if ($scope.pageOptions.dispNo != "") { // 첫 화면 지정 dispNo가 있을 경우 해당 탭 Index로 설정
					$scope.findMenuNodeIdx($scope.pageOptions.dispNo);
				}

				if ($scope.mainMenu[$scope.pageOptions.depth1NodeIdx] && $scope.mainMenu[$scope.pageOptions.depth1NodeIdx].list[$scope.pageOptions.depth2NodeIdx]) {
					$scope.mainTemplateType = $scope.getNowMenu().disp_no; // TemplateType은 DispNo

					// [TCLICK] 헤더푸터 : 7. 탭랜딩(직접랜딩)
					$scope.sendTclick("m_category_pv_" + $scope.mainTemplateType);

					// Depth2 Menu Default Index 찾아가기
					$timeout(function () { // timeout을 주지 않으면 DOM 렌더링이 끝나지 않아 탭의 넓이 계산에서 오류가 나 제대로 찾아가지 못한다.
						$scope.moveMenuSwipeFnc($scope.pageOptions.depth2NodeIdx, true); // 메인탭 2Depth Index 초기화(0) 위치로 이동 : moveMenuSwipeFnc - Swipe 없이 이동
					}, 300);
				}
			})
			.finally(function (data) { // Success던 Error던 항상 실행
				$scope.resetLoading();
			});
		};

		$scope.findMenuNodeIdx = function (disp_no) { // 전시번호로 메뉴 인덱스 찾기
			var i = 0, j = 0;

			find_loop :
			for (i; i < $scope.mainMenu.length; i++) {
				for (j = 0; j < $scope.mainMenu[i].list.length; j++) {
					if ($scope.mainMenu[i].list[j].disp_no == disp_no) {
						$scope.pageOptions.depth1NodeIdx = i;
						$scope.pageOptions.depth2NodeIdx = j;
						$scope.screenID = "main-" + $scope.mainMenu[i].list[j].disp_no;
						break find_loop;
					}
				}
			}
		};

		$scope.findMenuNodeItem = function (disp_no) { // 전시번호로 메뉴 아이템 찾기
			var i = 0,
				j = 0,
				rtnMenu = null;

			find_loop :
			for (i; i < $scope.mainMenu.length; i++) {
				for (j = 0; j < $scope.mainMenu[i].list.length; j++) {
					if ($scope.mainMenu[i].list[j].disp_no == disp_no) {
						rtnMenu = $scope.mainMenu[i].list[j];
						break find_loop;
					}
				}
			}

			return rtnMenu;
		};

		$scope.getNowMenu = function () { // 현재 선택된 상단 메뉴 item 정보 가져오기
			return $scope.mainMenu[$scope.pageOptions.depth1NodeIdx].list[$scope.pageOptions.depth2NodeIdx];
		};

		$scope.getRequiredStoreKey = function (Menu) { // Menu에 맞는 필수 키값 리턴
			if (!Menu) {
				return "";
			}

			var dispNo = Menu.disp_no, // 현재 선택된 탭의 disp_no 지정 (엘롯데 메인은 탭Index로 구성되어 있으나 닷컴은 이중 탭 구조로 dispNo로 담는게 효율적임)
				tmplNo = Menu.tmpl_no,
				requiredKey = "";

			// angular forEach는 break가 없어 for in으로
			for (var key in $scope.storedRequireData) {
				if (dispNo == key || tmplNo == key) {
					requiredKey = $scope.storedRequireData[key];
					break;
				}
			}

			return requiredKey;
		};

		// 화면 옵션에 UI 설정값 및 옵션에 대한 초기화
		$scope.optionDataReset = function () {
			$scope.smartNotice = [];
			$scope.storedData = {}; // Object형태로 초기 선언을 해야 Array로 생성되는 것을 필할 수 있다.
			$scope.pageOptions = {
				depth1NodeIdx: 0, // 메인탭 1Depth Current Index
				depth2NodeIdx: 0, // 메인탭 2Depth Current Index
				depth1NodeCnt: 0, // 메인탭 1Depth의 갯수
				depth2NodeCnt: 0, // 메인탭 2Depth의 갯수
				dispNo: $scope.defaultRendingTabDispNo, // 현재 탭의 전시 번호
				bigdataChkFlag: false, // 빅데이터 개인화 Flag 체크 여부
				isLoginData: false, // 세션 스토리지 사용시 로그인 상태가 변경되었을때 세션을 이용하면 안되서 Flag 추가
				styleShopGender: "F", // 스타일샵 선택된 탭 (F : 여성, M : 남성)
				holidayTabIdx: 0 // 명절 선택탭 인덱스
			}
		}();

		$scope.smartNoticeStruct = { // 스마트 알림 데이터
			lastAlarm: 0,
			lastAlarmGoodsNo: 0,
			lastAlarmGoodsNm: '',
			lastAlarmGoodsType: ''
		};

		$scope.pagingDispNo = [ // 페이징 처리가 필요탭 전시 번호
			'5537337', // 기획전 탭
			'5547174', // 트랜드 탭
			'5537340', // TV쇼핑 탭
			'5537343' // 랭킹존 탭			
		];

		$scope.pagingTpmlNo = [ // 페이징 처리가 필요한 탭 템플릿 번호
			'20411', // 카테고리 템플릿
			'20412', // 딜 템플릿
			'21811' // 명절관
		];

		$scope.mixedBnrDispNo = [ // 배너와 상품을 믹스 해야하는 전시 번호
			'5537340' // TV쇼핑
		];

		$scope.mixedBnrTpmlNo = [ // 배너와 상품을 믹스 해야하는 템플릿 번호
			'20411', // 카테고리 템플릿
			'20412', // 딜 템플릿
			'21811' // 명절관
		];

		$scope.isItemsKeyEnabled = function (dispNo, dataKey) { // 데이터의 items 배열이 있을때 상위 키에 대입하는 기능 사용 여부
			var enabled = true,
				tpml_no = $scope.findMenuNodeItem(dispNo).tmpl_no,
				i = 0;

			// 해당 전시번호의 템플릿 번호와 제외처리 템플릿 번호 비교
			angular.forEach($scope.originalDataSetTpmlNo, function (val, key) {
				if (key == tpml_no) {
					for (i = 0; i < $scope.originalDataSetTpmlNo[key].length; i++) {
						if ($scope.originalDataSetTpmlNo[key][i] == dataKey) {
							enabled = false;
							break;
						}
					}

					if (!enabled) {
						return true;
					}
				}
			});

			if (enabled) {
				angular.forEach($scope.originalDataSetDispNo, function (val, key) {
					if (key == dispNo) {
						for (i = 0; i < $scope.originalDataSetDispNo[key].length; i++) {
							if ($scope.originalDataSetDispNo[key][i] == dataKey) {
								enabled = false;
								break;
							}
						}

						if (!enabled) {
							return true;
						}
					}
				});
			}

			return enabled;
		};

		$scope.originalDataSetTpmlNo = { // 배열 items 를 가진 요소를 그대로 items로 사용할 템플릿 번호 

		};

		$scope.originalDataSetDispNo = { // 배열 items 를 가진 요소를 그대로 items로 사용할 전시 번호 
			'5550633': [ // 스타일샵 탭
				'first_banner_list',
				'keyword_list',
				'cate_list',
				'best_list',
				'timesale_banner',
				'theme_list1',
				'theme_list2',
				'new_prd_list',
				'last_banner_list',
				'theme_list3',
				'brand_shop_list'
			]
		};

		// 페이징될때 갱신행야하는 키값 정의 (해당 키값만 갱신된다)
		$scope.pagingUnitStruct = {
			'5537337': { // 기획전
				loopData: {brand_banner_list: true},
				list: 'brand_banner_list',
				total: 'total_count'
			},
			'5547174': { // 트랜드
				loopData: {brand_banner_list: true},
				list: 'brand_banner_list',
				total: 'total_count'
			},
			'20411': { // 카테고리딜 템플릿
				loopData: {prd_deal_list: true},
				list: 'prd_deal_list',
				total: 'total_count',
				banner: 'ban_list',
				bannerIdx: 'mrk_rnk'
			},
			'20412': { // 딜 템플릿
				loopData: {prd_deal_list: true},
				list: 'prd_deal_list',
				total: 'total_count',
				banner: 'ban_list',
				bannerIdx: 'mrk_rnk'
			},
			'5537340' : { // TV쇼핑
				loopData: {prod_list: true},
				list: 'prod_list',
				total: 'total_count',
				banner: 'ban_list',
				bannerIdx: 'mrk_rnk'
			},
			'5537343': { // 랭킹존
				loopData: {prd_deal_list: true},
				list: 'prd_deal_list',
				total: 'total_count'
			},			
			"21811": { // 명절관
				loopData: {prd_deal_list: true},
				firstLoopData: {ban_list: true},
				list: 'prd_deal_list',
				total: 'total_count',
				banner: 'ban_list',
				bannerIdx: 'mrk_rnk'
			}
		};

		$scope.productListItemKey = [ // 상품리스트 키값
			"prd_deal_list",
			"prod_list",
			"recommendPrd",
			"bestShare"
		];

		$scope.productOnlyNumberKey = [ // 숫자형태가 되어야 하는 키값
			"discounted_price",
			"original_price",
			"pmg_gdas_cnt",
			"price",
			"price1",
			"price2",
			"review_count",
			"saleCnt",
			"sale_cnt",
			"sale_rate"
		];

		$scope.productKeyMapping = { // 상품유닛 키값 매핑 필요한 요소 확인
			"5542940": { // 맞춤추천 탭
				recommendPrd: {
					saleRate: "sale_rate"
				}
			}
		};

		$scope.tapLoopDataChkDispNo = [ // 1 page에서도 keepData를 적용할 DispNo
		];

		$scope.tapLoopDataChkTpmlNo = [ // 1 page에서도 keepData를 적용할 TpmlNo
			"21811"
		];

		$scope.storedRequireData = { // store에 담긴 데이터중 현재 disp_no 또는 tpml_no에 맞는 요소에 필수 데이터 key값 정의 (부하방지 1개만 정의) (필수 데이터가 없을 경우 1회 재로드)
			"5537336": "event_banner_list", // 이벤트존
			"5537337": "brand_banner_list", // 기획전
			"5547174": "brand_banner_list", // 트랜드
			"20412": "prd_deal_list", // 빅딜, 백화점 등 홈탭용 딜형 (tpml_no)
			"5537340": "prod_list", // TV쇼핑 (빅딜 템플릿이지만 메뉴데이터에 tpml_no가 없음)
			"5544340": "stsp_banner_list", // 스토리샵
			//"5542940": "stsp_banner_list", // 맞춤추천 (맞춤추천은 로그인/로그아웃 상태의 데이터가 달라 체크하지 않는다.)
			"5537343": "ranking_category", // 랭킹존
			"21811": "prd_deal_list" // 명절관
		};

		$scope.isPagingTab = function (dispNo) { // 현재 탭이 Paging이 있는 지 여부 체크
			var i = 0,
				pagingTpmlArr = $scope.pagingDispNo.concat($scope.pagingTpmlNo),
				isPaging = false;

			for (i; i < pagingTpmlArr.length; i++) {
				if (pagingTpmlArr[i] == dispNo || pagingTpmlArr[i] == $scope.findMenuNodeItem(dispNo).tmpl_no) {
					isPaging = true;
					break;
				}
			}

			return isPaging;
		};

		$scope.getPagingUnitStruct = function (dispNo) { // dispNo로 페이징 유닛 구조 구하기
			var i = 0,
				rtnObj = {};

			for (var key in $scope.pagingUnitStruct) {
				if (key == dispNo || key == $scope.findMenuNodeItem(dispNo).tmpl_no) {
					rtnObj = $scope.pagingUnitStruct[key];
					break;
				}
			}

			return rtnObj;
		};

		$scope.isMixedBnrTab = function (dispNo) { // 배너 믹스형 템플릿인지 확인
			var i = 0,
				mixedTpmlArr = $scope.mixedBnrDispNo.concat($scope.mixedBnrTpmlNo),
				isMixed = false;

			for (i; i < mixedTpmlArr.length; i++) {
				if (mixedTpmlArr[i] == dispNo || mixedTpmlArr[i] == $scope.findMenuNodeItem(dispNo).tmpl_no) {
					isMixed = true;
					break;
				}
			}

			return isMixed;
		};

		$scope.screenDataReset = function () { // 탭 콘텐츠 데이터의 데이터 정의 초기화
			$scope.productMoreScroll = true; // 상품 리스트 페이징 가능 여부
			$scope.screenData = {
				reward_banner: {}, // 카드구매사은 배너
				deal_banners: [], // 딜 배너 가공 (구매사은 배너 제외)

				// 리스트 페이지 관련
				page: 0, // 현재 페이지 Index
				pageSize: 15, // 한페이지당 아이템 개수
				listTotal: 0, // 총 리스트 개수
				pageEnd: false, // 마지막 페이지 체크 Flag

				mix_banner: false, // [common] 배너와 상품 MIX 노출 여부 (우선순위에 따라)
				top_banner_list: [], // [event, planshop, trend] 상단 띠배너 리스트

				first_banner_list: [], // [event, 스타일샵] 상단 스와이프 배너 리스트, [trend] 상단 스와이프 배너 리스트
				event_banner_list: [], // [event] 이벤트 배너 리스트
				outer_banner_list: [], // [event] 외부 링크 배너 리스트

				brand_banner_list: [], // [planshop] 브랜드 배너 리스트
				surprise_banner_list: [], // [planshop] 서프라이즈 배너 리스트

				mixed_pos: 0,
				bannerMixContents: [], // [deal] 딜 배너, 상품 믹스 리스트
				ban_list: [], // [deal, ranking, 명절] 배너 리스트
				prd_deal_list: [], // [deal, ranking, 명절] 딜 상품 리스트
				more_category: [], // [deal] 카테고리 리스트

				mix_onair: false, // [etv]
				prod_list: [], // [etv] 상품 리스트

				stsp_banner_top: [], // [storyshop] 상단 배너 리스트
				stsp_banner_list: [], // [storyshop] 배너 리스트
				htmlTxt: "", // [storyshop] 하단 HTML 코너 데이터

				bestShare: [], // [recommend]
				recommendPrd: [], // [recommend]
				latelyPrd: [], // [recommend]

				disp_grp_no: NaN, // [ranking] 랭킹 그룹 번호
				ranking_disp_no: "", // [ranking]  랭킹 전시번호
				lank_keyword: [], // [ranking] 급상승 검색어 데이터
				ranking_ctg_depth_idx: 0, // [ranking] 랭킹 카테고리 depth
				ranking_ctg_level: "MA", // [ranking] 카테고리 현재 선택 depth (MA : 전체, M0 : 대대카, M1 : 대카, M2 : 중카)
				ranking_category: [], // [ranking] 카테고리 데이터
				ranking_ctg_depth: [null, null, null], // [ranking] 카테고리 UI 데이터
				ranking_gender: "A", // [ranking] 카테고리 현재 선택 성별 (A : 전체, M : 남자, F : 여자)
				ranking_age: "A", // [ranking] 카테고리 현재 선택 연령 (A : 전체, 20 : 20대이하, 30 : 30대, 40 : 40대, 50 : 50대 이상)
				ranking_ui: { // [ranking] select 박스 UI 관련 정보
					setting_flag: false, // 옵션값을 변경했는지 여부에 대해저장하고 변경 안했을 경우에만 로그인 정보 기반으로 Default 세팅하기 위한 Flag
					select_all: [ // 카테고리 "전체" 에 대한 정보 세팅
						{ disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "", isAll: true },
						{ disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "", isAll: true },
						{ disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "", isAll: true }
					],
					selectbox: [ // 현재 선택된 카테고리 정보 저장
						{ disp_grp_desc: "카테고리 전체", disp_grp_no: NaN, disp_no: "" },
						{ disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "" },
						{ disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "" }
					],
					selectbox_select_idx: 0 // 현재 선택된 (대대카, 대카, 중카) 카테고리 셀렉트박스 Depth 인덱스
				},

				mid_banner_list: [], // [trend] 배너1, 상품3 배너 리스트
				brand_top_banner: [], // [trend] mid_banner_list 하단 배너 리스트
				small_banner_title: "", // [trend] 작은 사각형 배너 타이틀
				small_banner_list: [], // [trend] 작은 사각형 배너 리스트 (최대 4개)

				ctg_deal_ui: { // 카테고리 딜 소팅 정보
					opt: 0, // 0: 추천순, 1: 인기순, 2: 최신순
					dept: false // 백화점 상품
				},
				top_html: "", // [명절관] 상단 HTML (추석)
				top_ban_list: [], // [명절관] 배너리스트

				keyword_list: {}, // [스타일샵] HOT KEYWORD
				cate_list: {}, // [스타일샵] 카테고리
				best_list: {}, // [스타일샵] BEST ITEM
				timesale_banner: {}, // [스타일샵] TIME SALE
				theme_list_1: {}, // [스타일샵] 스와이프 테마1
				theme_list_2: {}, // [스타일샵] 스와이프 테마2
				new_prd_list: {}, // [스타일샵] 신상품
				last_banner_list: {}, // [스타일샵] 상품형 배너
				theme_list_3: {}, // [스타일샵] 스와이프 테마3
				brand_shop_list: {} // [스타일샵] 브랜드 리스트
			};
		};

		// 메인 탭 데이터 URL / Parameter 정의
		$scope.getThemaDataUrl = function (params) {
			var url = LotteCommon.mainContentData + "?dispNo=" + params.dispNo; // 데이터 호출 경로 설정

			if ($scope.isPagingTab(params.dispNo)) { // 페이징
				url += "&rowsPerPage=" + $scope.screenData.pageSize; // 불러올 아이템 갯수 설정

				if (params.page) { // 페이징 여부 체크 후 페이지 파라메타 추가
					url += "&page=" + params.page;
				}
			}

			if (params.dispNo == "5537343") { // 랭킹존 옵션 파라메타 추가
				// 설정을 변경한 적이 없고 로그인 정보가 있을 경우에만 로그인 기반 사용자 정보로 Default 성별, 연령 세팅
				if (!$scope.screenData.ranking_ui.setting_flag && $scope.loginInfo.isLogin) {
					if ($scope.loginInfo.gradeCd) {
						$scope.screenData.ranking_gender = $scope.loginInfo.genSctCd; // 성별
					}

					if ($scope.loginInfo.mbrAge) { // 연령
						var userAge = parseInt($scope.loginInfo.mbrAge); // 로그인 정보의 회원 나이를 숫자 형태로 할당

						if (userAge < 30) { // 연령은 나이가 직접 들어와 범위에 맞게 값 세팅 되도록 분기
							$scope.screenData.ranking_age =  20;
						} else if (userAge < 40) {
							$scope.screenData.ranking_age =  30;
						} else if (userAge < 50) {
							$scope.screenData.ranking_age =  40;
						} else if (userAge >= 50) {
							$scope.screenData.ranking_age =  50;
						}
					}

					params.gender = $scope.screenData.ranking_gender; // 성별
					params.age = $scope.screenData.ranking_age; // 나이
				}

				if (params.dispGrpNo && params.selectDispNo != "5537343" && params.ctgDepth != "MA") { // 대대카가 아니라면 dispGrpNo를 파라메타에 추가한다
					url += "&dispGrpNo=" + params.dispGrpNo;
				}

				if (params.selectDispNo && params.selectDispNo != "5537343" && params.ctgDepth != "MA") {
					url += "&selectDispNo=" + (params.selectDispNo ? params.selectDispNo : "5537343");
				}

				url += "&ctgDepth=" + (params.ctgDepth ? params.ctgDepth : "MA");
				url += "&gender=" + (params.ctgDepth != "M2" && params.gender ? params.gender : "A");
				url += "&age=" + (params.ctgDepth != "M2" && params.age ? params.age : "A");
			}

			if (params.dispNo == "5542940" && $scope.loginInfo.isLogin && $scope.loginInfo.mbrNo) { // 맞춤추천탭 옵션 파라메타 추가
				url += "&mbrNo=" + $scope.loginInfo.mbrNo;
			}

			if ($scope.findMenuNodeItem(params.dispNo).tmpl_no == "20411") { // 카테고리딜 파라메타 추가
				url += "&opt=" + (params.opt ? params.opt : "0");
				url += "&dept=" + (params.dept ? params.dept : "false");
			}

			if (params.dispNo == '5537338' && $scope.bigDealBigDataFlag && $scope.loginInfo.isLogin && $scope.loginInfo.privateBigDeal && params.bigdata == "Y") { // 빅딜 개인화 예외처리
				url += "&bigdata=Y";
			}

			if ($scope.findMenuNodeItem(params.dispNo).tmpl_no == "21811") { // 명절관 파라메타 추가

				if (params.opt_dispno == undefined) {
					params.opt_dispno = $scope.pageOptions.holidayTabIdx;
				}

				url += "&opt_dispno=" + params.opt_dispno;
			}

			if (params.dispNo == "5550633") { // 스타일 샵일때 성별 정보 추가
				url += "&gender=" + (params.gender ? params.gender : $scope.pageOptions.styleShopGender);
			}

			if (LotteCommon.isTestFlag) { // 로컬 테스트 예외 처리
				try {
					console.log("url ::::: " + url); // 로컬테스트용 - 실 데이터 호출 URL 정보 로깅
				} catch (e) {}

				url = LotteCommon.mainContentData + "." + params.dispNo; // 로컬 테스트 일 경우 추가 파라메타 제외

				if (params.dispNo == "5550633") { // 스타일 샵일때 성별 정보 추가
					url += "." + $scope.pageOptions.styleShopGender;
				}
			}

			// 각 탭별 파라메터 처리 추가(params.dispNo로 분기)
			return url;
		};

		$scope.resetLoading = function () { // 로딩바와 스와이프 초기화
			$scope.pageLoading = false;
			$scope.productListLoading = false;
			$scope.$parent.LotteSuperBlockStatus = false;
		};

		$scope.swipeEndCheck = function () { // 메인 스와이프가 완료됐는지 여부 체크
			$timeout(function () {
				$scope.translateX_Reset(); // 스와이프 좌표 리셋
				$scope.moveMenuSwipe($scope.pageOptions.depth2NodeIdx);

				if (angular.element($window).scrollTop() > 45) {
					angular.element($window).scrollTop(45); // 화면 상단으로 이동
				}
			}, 50);
		} ;

		/*
		 * 메인 데이터 로드
		 */
		$scope.loadScreenData = function (params) {
			$scope.$parent.LotteSuperBlockStatus = true; // 데이터 로드중에는 클릭이나 기타 이벤트를 막는다.

			// 전시 유입코드에 대한 처리

			if (!params.page && !params.keepData) { // 1페이지가 아니고 데이터 부분 로딩이 아니라면
				$scope.screenDataReset(); // 데이터 초기화
			}

			var nowMenu = $scope.getNowMenu(),
				dispNo = params.dispNo,
				requiredKey = $scope.getRequiredStoreKey();

			$scope.pageOptions.dispNo = dispNo;

			if (typeof $scope.storedData[dispNo] == "object" && !params.keepData) { // 한번 불러왔던 데이터일 경우 저장된 변수에서 데이터 로드
				// 필수 데이터 확인 :: 저장된 데이터가 없거나 탭 콘텐츠 데이터(storedData)가 존재하는지 체크하여 기존 불러왔던 탭 콘텐츠는 storedData를 사용, 존재하지 않을 경우 새로 로드
				if ($scope.storedData[dispNo] == null || (requiredKey != "" && (!$scope.storedData[dispNo][requiredKey] || $scope.storedData[dispNo][requiredKey].length == 0))) { // 담겨져 있는 데이터가 없다면 데이터 로드
					$scope.storedData[dispNo] = false;
					params.keepData = false;
					$scope.loadScreenData(params); // 데이터 로드
					return;
				}

				$scope.pageLoading = true; // 페이지 로딩 인디케이터 노출
				$scope.screenDataReset(); // 데이터 초기화
				$scope.screenData = $scope.storedData[dispNo]; // 한번 불러왔던 데이터일 경우 저장된 변수에서 데이터로 교체
				$scope.screenID = "main-" + dispNo; // tclick을 위한 화면 ID 세팅
				$scope.swipeEndCheck();
				$scope.resetLoading(); // 로딩 초기화
			} else { // storedData가 존재하지 않을 경우
				if ((!params.page || params.page == 1) && !params.keepData) { // 첫페이지라면
					$scope.pageLoading = true; // 페이지 로딩 인디케이터 노출
					//return false; // 화면 소팅이나 항목 변경시 로딩을 보기 위한 테스트 주석
				} else { // 첫페이지가 아니고 페이징이라면
					$scope.productListLoading = true; // 페이지 로딩 인디케이터 노출
					//return false; // 페이지 로딩 보기 위한 테스트 주석
				}

				if ((!params.page && params.page > 1) && params.dispNo == "5537343" && $scope.screenData.prd_deal_list.length > 100) { // 첫페이지가 아니고 랭킹존 100개 보다 클때 예외처리
					$scope.resetLoading(); // 로딩 초기화
					return false;
				}

				if (!params.page && !params.keepData) { // 페이징이 아니고 옵션 변경이 아닐 경우 데이터 초기화
					$scope.screenDataReset(); // 데이터 초기화
				}

				if ($scope.screenData.pageEnd) { // 상품 로드가 끝났는지의 여부 체크
					$scope.productMoreScroll = false; // 상품 더 불러오기 막음
					$scope.resetLoading(); // 로딩 초기화
					return true;
				}

				var httpConfig = {
					method: "get",
					url: $scope.getThemaDataUrl(params)
				};

				// 빅딜 개인화를 위한 예외처리
				if (params.dispNo == '5537338' && (!$scope.bigDealBigDataFlag || !$scope.loginInfo.isLogin || !$scope.loginInfo.privateBigDeal || !params.bigdata || params.bigdata == "N")) {
					// 필요없는 파라메타 삭제
					delete params.bigdata;
					delete params.mbrNo;
					delete params.privateBigDeal;

					httpConfig.url = $scope.getThemaDataUrl(params);
				} else if (params.dispNo == '5537338' && $scope.bigDealBigDataFlag && $scope.loginInfo.isLogin && $scope.loginInfo.privateBigDeal && params.bigdata == "Y") {
					httpConfig.method = "post"; // 전송방식 POST로 변경 (개인화 정보로 인하여)

					delete params.keepData; // 필요없는 파라메타 삭제
					httpConfig.data = params; // POST 방식으로 parameter를 data에 적용
				}

				$http(httpConfig) // 실제 탭 데이터 호출
				.success(function (data) {
					$scope.productMoreScroll = true;
					var contents = [];

					if (typeof data["main_contents"] != undefined) { // 데이터 오류가 아닐 경우
						contents = data["main_contents"];
					} else { // 데이터 오류가 있는 경우 로딩 Reset
						// 데이터 오류가 있는경우에 어찌할지 추가 코딩이 필요해 보임
						return false;
					}

					if (params.loadContents) { // 갱신시킬 데이터 key값이 지정되었는지 판단하고 지정되지 않으면 전체 데이터 갱신
						$scope.loopData = angular.copy(params.loadContents);
					} else {
						$scope.loopData = angular.copy($scope.screenData);
					}

					// 페이징 유닛 관련 처리
					if ($scope.isPagingTab(params.dispNo) && !params.loadContents) {
						var listNm = $scope.getPagingUnitStruct(params.dispNo).list;

						if (!params.page) { // 파라메타에 지정된 페이지가 없을 경우 1페이지로 세팅
							$scope.screenData.page = 1;
							//$scope.productMoreScroll = true;
						}

						// 파라메타에 페이지가 지정되어 있을 경우 페이징이 필요한 데이터만 갱신하도록 처리
						if (params.page > 1 || // 1page 가 아닐 경우
							(params.keepData && (arrayMatchString($scope.tapLoopDataChkDispNo, params.dispNo) || arrayMatchString($scope.tapLoopDataChkTpmlNo, $scope.findMenuNodeItem(dispNo).tmpl_no)))) { // 탭으로 부분 데이터만 로드되는 경우
							$scope.loopData = $scope.getPagingUnitStruct(params.dispNo).loopData;
						}

						if ((!params.page || params.page == 1) && $scope.getPagingUnitStruct(params.dispNo).firstLoopData) { // 1페이지 일경우의 loopData 추가가 필요할 경우
							$scope.loopData = angular.extend($scope.loopData, $scope.getPagingUnitStruct(params.dispNo).firstLoopData);
						}
					} else {
						$scope.productMoreScroll = false; // 페이징이 없는 탭일 경우 스크롤시 상품 더 불러오기 비활성화
					}

					// loopData 기준의 키값에 해당 하는 데이터 담기
					angular.forEach($scope.loopData, function (val, key) {
						if (contents[key] != undefined) { // 갱신 데이터가 존재할 경우에만 처리
							if (contents[key]['items'] != undefined && $scope.isItemsKeyEnabled(params.dispNo, key)) { // 갱신 데이터에 items key값이 있을 경우 items 데이터를 해당 키값에 갱신
								// 상품 데이터 보정 (가격, 할인가, 상품평등은 숫자형태로 만들고, MappingKey를 맞춤)
								if ($scope.productListItemKey.indexOf(key) > -1) { //
									for (var i = 0; i < contents[key]['items'].length; i++) {
										angular.forEach(contents[key]['items'][i], function (itemVal, itemKey) {
											if ($scope.productOnlyNumberKey.indexOf(itemKey) > -1) { // 숫자형태여야 하는 데이터가 숫자형태가 아닌 걍우 데이터를 숫자형태로 변경
												contents[key]['items'][i][itemKey] = parseInt((itemVal + "").replace(/\,/gi, ""));
											}

											if ($scope.productKeyMapping[params.dispNo]) { // Key 표준화가 되어 있지 않을 경우 표준화 Key로 변경
												angular.forEach($scope.productKeyMapping[params.dispNo], function (mappingObj, mappingKey) {
													if (key == mappingKey) {
														angular.forEach(mappingObj, function (mappingKey, originalKey) {
															if (itemKey == originalKey) {
																contents[key]['items'][i][mappingKey] = contents[key]['items'][i][itemKey];
															}
														})
													}
												});
											}
										});
									}
								}

								if (params.page > 1) { // 페이지 파라메타가 있다면
									if (!contents[key]['items'] || contents[key]['items'].length == 0) { // 페이지 파라메타가 있을 경우 응답온 데이터의 아이템 갯수가 없다면 페이지 더보기 비활성화
										$scope.productMoreScroll = false;
									}

									$scope.screenData[key] = $scope.screenData[key].concat(contents[key]['items']); // 이전 상품데이터와 새로 로드한 상품 데이터 합침
								} else {
									$scope.screenData[key] = contents[key]['items']; // 페이징이 아닐 경우 (옵션, 소팅 등) 데이터 갱신
								}
							} else { // 갱신데이터에 items 키값이 없을 경우에는 데이터 그대로 갱신
								$scope.screenData[key] = contents[key];
							}
						}
					});

					// Mixed Content (우선순위에 따라 배너/상품 조합이 필요한 탭 : 빅딜, 카테고리딜탭) 처리
					if (contents.mix_banner || contents.mix_onair || $scope.isMixedBnrTab(params.dispNo)) {
						if ($scope.isPagingTab(params.dispNo)) {
							var mixDataTemp = []; // 배너/상품 조합 후 임시로 담을 변수

							// 넘어온 데이터가 더이상 없는 경우처리
							if (!contents[$scope.getPagingUnitStruct(params.dispNo).list].items.length) {
								$scope.screenData.pageEnd = true;
								$scope.productMoreScroll = false;
								return;
							}

							var sidx = ($scope.screenData.page - 1) * $scope.screenData.pageSize, // 배너 조합 시작 인덱스 지정 (page에 따라 시작 위치 조정)
								productContent = $scope.screenData[$scope.getPagingUnitStruct(params.dispNo).list], // 상품 데이터
								bannerContent = $scope.screenData[$scope.getPagingUnitStruct(params.dispNo).banner], // 배너 데이터
								bannerIndexKey = $scope.getPagingUnitStruct(params.dispNo).bannerIdx, // 배너 우선순위 키값 지정
								eidx = productContent.length, // 로프 완료 인덱스 지정
								onair_prod = $scope.screenData.page == 1 ? true : false, // TV쇼핑 편성표 추가 Flag (1페이지 일때만 편성표 추가)
								addItem = null,
								i = 0,
								j = 0; // 배너 index (tclick 시 사용)

							if (!params.page || params.page == 1) {
								$scope.screenData.mixed_pos = 0; // 배너 믹스 Position 초기화

								// 반응형 배너를 위한 처리 (카드혜택 배너와 일반 배너 분리)
								$scope.screenData.deal_banners = [];

								for (i = 0; i < bannerContent.length; i++) {
									if (bannerContent[i].banner_nm == "rewardevent") {
										$scope.screenData.reward_banner = bannerContent[i];
									} else {
										$scope.screenData.deal_banners.push(angular.extend({bannerIdx : j++}, bannerContent[i]));
									}
								}
							}

							for (i = sidx; i < eidx; i++) { // 루프 돌면서 배너 우선순위에 따라 배열 조합
								addItem = $scope.joinBannerContent(i + 1, bannerContent, bannerIndexKey); // 우선순위에 맞는 배너 구하기

								if (addItem) { // 우선순위에 맞는 배너가 있을 경우 배열에 추가
									mixDataTemp.push(addItem);
								}

								if (contents.mix_onair && contents.onair_prod && onair_prod) { // TV쇼핑 방송상품 (편성표) 예외 처리
									if ((i == 0 && (!productContent[i].goods_conts_vod || productContent[i].goods_conts_vod == "")) ||
										i == 1 && onair_prod) {
										contents.onair_prod.isOnAir = true;

										angular.forEach(contents.onair_prod, function (val, key) {
											if ($scope.productOnlyNumberKey.indexOf(key) > -1) { // 숫자형태여야 하는 데이터가 숫자형태가 아닌 걍우 데이터를 숫자형태로 변경
												contents.onair_prod[key] = parseInt((val + "").replace(/\,/gi, ""));
											}
										});

										mixDataTemp.push(contents.onair_prod);
										onair_prod = false;
									}
								}

								productContent[i].isProduct = true; // 상품인지 여부 Flag 설정
								productContent[i].pIdx = i; // 상품에대한 Index 따로 부여
								mixDataTemp.push(productContent[i]); // 조합 배열에 상품 추가
							}

							if (!params.page || params.page == 1) { // 페이지에 따라 데이터 교체 또는 추가
								$scope.screenData.bannerMixContents = mixDataTemp;
							} else {
								$scope.screenData.bannerMixContents = $scope.screenData.bannerMixContents.concat(mixDataTemp);
							}
						}
					}

					if (params.dispNo == "5537343") { // 랭킹존 예외 처리
						if (!params.page || params.page == 1) { // 첫페이지일때만
							if ($scope.screenData.ranking_ctg_depth_idx == 0) { // 랭킹존 카테고리 처리 (최초로드일때 전체값 세팅)
								$scope.screenData.ranking_ui.select_all[0] = { disp_grp_desc: "전체", disp_grp_no: $scope.screenData.disp_grp_no, disp_no: "5537343", isAll: true };
								$scope.screenData.ranking_ui.selectbox[0] = { disp_grp_desc: "카테고리 전체", disp_grp_no: $scope.screenData.disp_grp_no, disp_no: $scope.screenData.ranking_disp_no, isAll: true };
								$scope.screenData.ranking_ui.select_all[1] = null;
								$scope.screenData.ranking_ui.select_all[2] = null;
								$scope.screenData.ranking_ui.selectbox[1] = null;
								$scope.screenData.ranking_ui.selectbox[2] = null;
							}

							if (params.ctgDepth != "M2") { // 마지막 Depth 일때 카테고리 데이터 갱신하지 않음
								$scope.screenData.ranking_category.unshift($scope.screenData.ranking_ui.select_all[$scope.screenData.ranking_ctg_depth_idx]); // 전체에 대한 아이템 추가
								$scope.screenData.ranking_ctg_depth[$scope.screenData.ranking_ctg_depth_idx] = $scope.splitArrayItem($scope.screenData.ranking_category, 6, true); // 현재 선택된 카테고리 depth에 카테고리 정보 갱신 ( 6개씩 )
							}
						}

						if ($scope.screenData.prd_deal_list.length >= 100) { // 상품 100개 로드시 로드 완료 처리
							$scope.productMoreScroll = false;
							$scope.productListLoading = false;
						}
					}

					$scope.storedData[params.dispNo] = angular.copy($scope.screenData);
				})
				.error(function (data) {
					console.log("MainContent Data 오류");
				})
				.finally(function (data) { // Success던 Error던 항상 실행
					$scope.resetLoading(); // 로딩 초기화

					if ((!params.page || params.page == 1) && 
						!(params.keepData && (arrayMatchString($scope.tapLoopDataChkDispNo, params.dispNo) || arrayMatchString($scope.tapLoopDataChkTpmlNo, $scope.findMenuNodeItem(dispNo).tmpl_no)))) {
						$scope.swipeEndCheck();
					}
				});
			}
		};

		$scope.joinBannerContent = function (idx, bannerData, rnkKey) { // 상품과 배너 믹스 형태 처리
			var rtnArr = null;

			try {
				var i = 0, bannerTemp = [];

				for (i = $scope.screenData.mixed_pos; i < bannerData.length; i++) {
					if (bannerData[i][rnkKey] == idx || (bannerData[i][rnkKey] == 0 && idx == 1)) {
						$scope.screenData.mixed_pos = i;
						bannerTemp.push(angular.extend({bannerIdx: i, bannerPrioriry: bannerData[i][rnkKey]}, bannerData[i])); // 배너 우선순위 공통 Key 지정
					}
				}

				if (bannerTemp.length > 1) {
					rtnArr = {isSwipe: true, items: bannerTemp};
				} else if (bannerTemp.length == 1) {
					 bannerTemp[0].isBanner = true;
					rtnArr = bannerTemp[0];
				}
			} catch(e) {
				console.log('Error::checkBanner');
			}

			return rtnArr;
		};

		$scope.splitArrayItem = function (arr, count, arrayFullFlag) { // 랭킹존 카테고리 지정갯수로 이중배열 형태로 변환
			var rtnArr = [], i = 0, j = 0;

			for (i; i < arr.length; i++) {
				j = Math.floor(i / count);

				if (!rtnArr[j]) {
					rtnArr[j] = [];
				}

				rtnArr[j].push(arr[i]);
			}

			if (arrayFullFlag && rtnArr[j].length < count) { // Array 당 count 만큼의 item이 채워지지 않았을 경우 채우는 로직
				var tmpCnt = count - rtnArr[j].length;

				for (i = 0; i < tmpCnt; i++) {
					rtnArr[j].push({});
				}
			}

			return rtnArr;
		};

		$scope.moreScreenData = function () { // 상품 더 불러오기
			if ($scope.productMoreScroll && !$scope.screenData.pageEnd) {
				$scope.screenData.page++;
				$scope.loadScreenData({
					keepData: true,
					dispNo: $scope.getNowMenu().disp_no,
					page: $scope.screenData.page
				});
			}
		};

		// 메인 콘테츠 로드를 위한 이동된 탭의 Index 판단 및 템플릿 타입 판단
		$rootScope.loadMenuContent = function (e) {
			var infinitiFlag = false; // 처음에서 끝 탭으로 갈때 스와이프 애니메이션으로 이동하면 동작이 부자연스러워 애니메이션 없이 이동하게 하는 Flag

			// Infiniti Swipe를 위해 Index를 판단하여 처음 끝으로 돌리고 Index가 끝이 아니라면 정상적으로 +1, -1 Index로 이동
			if (e.moveto == "left") {
				if ($scope.pageOptions.depth2NodeIdx + 1 > $scope.pageOptions.depth2NodeCnt - 1) {
					$scope.pageOptions.depth2NodeIdx =  0;
					infinitiFlag = true;
				} else {
					$scope.pageOptions.depth2NodeIdx =  $scope.pageOptions.depth2NodeIdx + 1;
				}
			} else {
				if ($scope.pageOptions.depth2NodeIdx - 1 < 0) {
					$scope.pageOptions.depth2NodeIdx = $scope.pageOptions.depth2NodeCnt - 1;
					infinitiFlag = true;
				} else {
					$scope.pageOptions.depth2NodeIdx = $scope.pageOptions.depth2NodeIdx - 1;
				}
			}

			$scope.mainTemplateType = $scope.getNowMenu().disp_no;
			$scope.menuDepth2Click({ disp_no: $scope.mainTemplateType}, $scope.pageOptions.depth2NodeIdx, infinitiFlag);
			$scope.findMenuNodeIdx($scope.mainTemplateType); // 메인 Tclick Screen ID 지정

			// [TCLICK] 헤더푸터 : 9. 탭스와이프
			$scope.sendTclick("m_category_s_" + $scope.mainTemplateType);
		};

		// MITFT & M제휴판촉 요건 - 홈 랜덤 랜딩 (빅딜, 트랜드) 12/03 ~ 12/20
		// 20151208 박형윤 요건 변경으로 인해 주석처리
		/*
		var chlno = LotteCookie.getCookie("CHLNO");

		if ((todayTime >= getTime(2015, 12, 3) && todayTime <= getTime(2015, 12, 20) && chlno == "23") || commInitData.query["rendingTest"] == "true") {
			var rendingDispNo = "";

			if (todayTime >= getTime(2015, 12, 7) && todayTime <= getTime(2015, 12, 13) &&  // M제휴판촉 요건 12/07 ~ 12/13 (플래티넘 고객 대상 빅딜탭으로 랜딩)
				$scope.loginInfo.isLogin && 
				$scope.loginInfo.gradeCd == 10 && // 플래티넘+
				$scope.loginInfo.gradeCd == 20 && // 플래티넘
				$scope.loginInfo.gradeCd == 30) { // 플래티넘#
				rendingDispNo = "5537338";

				$scope.defaultRendingTabDispNo = rendingDispNo; // 빅딜
				$scope.pageOptions.dispNo =  rendingDispNo; // 빅딜
			} else { // MITFT 요건
				rendingDispNo = LotteCookie.getCookie("HOME_RENDING");

				if (rendingDispNo) {
					$scope.defaultRendingTabDispNo = rendingDispNo;
					$scope.pageOptions.dispNo =  rendingDispNo;
				} else {
					var rendomTab = [
							"5537338", // 빅딜
							"5547174" // 트랜드
						],
						randomKey = Math.floor(Math.random() * 2);

					rendingDispNo = rendomTab[randomKey];

					$scope.defaultRendingTabDispNo = rendingDispNo;
					$scope.pageOptions.dispNo =  rendingDispNo;

					LotteCookie.setCookie("HOME_RENDING", rendingDispNo, 1); // 하루동안 탭 랜딩 유지
				}
			}

			if (rendingDispNo) {
				var chldtNo = {
					5537338: "3168660",
					5547174: "3168661"
				};

				LotteCookie.setCookie("CHLDTLNO", chldtNo[rendingDispNo], 1, "lotte.com"); // cdn 값 변경 
				$scope.baseParam = $scope.baseParam.replace(/cdn=[0-9]+|cdn=?/, "cdn=" + chldtNo[rendingDispNo]); // BaseParameter 변경
			}
		}
		*/

		// Native APP Test
		if ($location.host() == "localhost" && commInitData.query["cn"] == "23") {
			LotteCookie.setCookie("CHLNO", "23");
		}

		// 빅딜 개인화 표시 여부 (조건 파라메타에 bigdata=Y, 로그인, 로그인에 개인화정보 있을때, 빅딜탭일때)
		if (commInitData.query['bigdata'] == "Y") {
			$scope.bigDealBigDataFlag = true;
		}

		var chlno = LotteCookie.getCookie("CHLNO");

		// 채널 상세코드 강제 변경
		function setChlDtlNoToday(chlDtlNo) {
			//LotteCookie.setCookie("MITFT_CHLDTLNO", chlDtlNo, 1); // 하루동안 채널 상세코드 유지
			LotteCookie.setCookie("CHLDTLNO", chlDtlNo, undefined, "lotte.com"); // cdn 값 변경
			$scope.baseParam = $scope.baseParam.replace(/cdn=[0-9]+|cdn=?/, "cdn=" + chlDtlNo); // BaseParameter 변경
		}

		// MITFT 랜덤 채널값 구하기
		// function getMITFTRandomChlDtlNo() {
		// 	// var chldtNo = [
		// 	// 		"3168660",
		// 	// 		"3168661"
		// 	// 	],
		// 	// 	randomKey = Math.floor(Math.random() * 2);

		// 	// return chldtNo[randomKey];
		// 	return "3168661";
		// }

		// MITFT 요건 :: APP으로 접근시 (빅딜 개인화 노출)
		// if (chlno == "23") {
		// 	var historyTodayChlDtlNo = LotteCookie.getCookie("MITFT_CHLDTLNO"); // 적용되어 있는 MITFT요건 가져오기

		// 	if (!historyTodayChlDtlNo) { // 적용된 MITFT 요건이 없다면 채널값 랜덤 세팅
		// 		historyTodayChlDtlNo = getMITFTRandomChlDtlNo();
		// 	}
			
		// 	setChlDtlNoToday(historyTodayChlDtlNo);

		// 	$scope.bigDealBigDataFlag = true; // 빅딜 체크박스 노출

		// 	if (historyTodayChlDtlNo == "3168660") {
		// 		$scope.pageOptions.bigdataChkFlag = true;
		// 	} else if (historyTodayChlDtlNo == "3168661") {
		// 		$scope.pageOptions.bigdataChkFlag = false;
		// 	}
		// }

		// MITFT 요건 변경 20160122 - 빅딜 개인화 기존 앱만 노출에서 웹도 노출로 변경
		if (chlno == "23" && $scope.appObj.isApp) { // 앱일때만 채널상세번호 3168661로 변경
			setChlDtlNoToday("3168661");
		}

		// 로그인 정보가 있어야만 사용 가능 - 템플릿 ng-if 로 조건 걸려 있음
		$scope.bigDealBigDataFlag = true; // 빅딜 체크박스 노출
		$scope.pageOptions.bigdataChkFlag = false; // 빅딜 개인화 로그인 정보가 비동기 호출로 메인 컨텐츠 보다 늦게 들어와서 로그인 정보가 적용되지 않는 이슈로 default true로 할 수 없음

		// M제휴판촉 - 플래티넘 대상 기획전 표시 여부 1/25~1/31 20160119 
		if ((todayTime >= getTime(2016, 1, 25) && todayTime < getTime(2016, 2, 1)) || commInitData.query['platinum'] == "Y") {
			$scope.platinumPlanshopFlag = true;
		}

		// 명절 상단 띠배너 표시 여부 1/8 11:00 ~ 2/4 00:00
		if ((todayTime >= getTime(2016, 1, 8, 13) && todayTime < getTime(2016, 2, 4)) || commInitData.query['holidayBnr'] == "Y") {
			$scope.holidayBnr = true;
		}

		// 황금 연휴 3종 쿠폰 안내 배너 노출 (1/25 09:00 ~ 2/2 23:59)
		if ((todayTime >= getTime(2016, 1, 25, 9) && todayTime < getTime(2016, 2, 3)) || commInitData.query['eventBnr'] == "Y") { // 2016.01.25 09:00 ~ 2016.02.02 23:59
			$scope.eventBnrFlag = true;
		}

		// 명절 탭 랜덤 인덱스 선택
		$scope.pageOptions.holidayTabIdx = Math.floor(Math.random() * 4);

		// URL 파라메타 체크하여 메인 초기 선택탭 지정
		if (commInitData.query['dispNo'] != undefined) {
			$scope.defaultRendingTabDispNo = commInitData.query['dispNo'];
			$scope.pageOptions.dispNo = commInitData.query['dispNo'];
		}

		// sessionStorage - 세션에서 가저올 부분 선언
		var lotteMainLoc = LotteStorage.getSessionStorage('lotteMainLoc');
		var lotteMainDataStr = LotteStorage.getSessionStorage('lotteMainData');
		var lotteMainScrollY = LotteStorage.getSessionStorage('lotteMainScrollY');
		// console.log('#lotteMainData', lotteMainLoc, lotteMainDataStr!=null);

		if (lotteMainLoc == window.location.href && lotteMainDataStr != null && commInitData.query["localtest"] != "true") { // 현재 URL과 session storage에 저장된 경로가 동일 할 경우
			//console.log("session");
			var lotteMainData = JSON.parse(lotteMainDataStr);

			$scope.mainMenu = lotteMainData.mainMenu;

			// console.log("세션스토리지 데이터 사용X", !$scope.mainMenu.length, lotteMainData.storedData==null, $scope.loginInfo.isLogin, lotteMainData.pageOptions.isLoginData)
			if ((!$scope.mainMenu.length && !lotteMainData.storedData) || // 메인 메뉴에 대한 데이터가 없고 저장된 데이터가 없거나
				$scope.loginInfo.isLogin != lotteMainData.pageOptions.isLoginData) { // 로그인 정보가 저장된 정보랑 다를 경우 데이터 로드
				// console.log("세션스토리지 데이터 사용X")
				$scope.getMenu(); // 세션스토리지 사용하지 않고 데이터 로드
			} else { // 세션스토리지 데이터 사용
				// console.log("세션스토리지 데이터 사용")
				$scope.storedData = lotteMainData.storedData; // 저장 데이터 갱신
				$scope.mainTemplateType = lotteMainData.mainTemplateType; // 템플릿 타입 지정
				$scope.pageOptions = lotteMainData.pageOptions; // 페이지 옵션값 지정

				/**
				 * 세션 데이터 사용시 데이터가 없거나 잘못되어 있을 시에 대한 방어 로직
				 */
				var requiredKey = $scope.getRequiredStoreKey($scope.getNowMenu()); // 현재탭의 필수 키값 확인

				// 화면데이터의 필수값 확인 :: 필수값이 없다면 데이터 로드 있다면 저장된 데이터 사용
				if (!$scope.storedData || // 데이터 로드 또는 데이터 보정
					!$scope.storedData[$scope.pageOptions.dispNo] ||
					$scope.storedData[$scope.pageOptions.dispNo] == null ||
					$scope.storedData[$scope.pageOptions.dispNo] == false ||
					(requiredKey != "" && (!$scope.storedData[$scope.pageOptions.dispNo][requiredKey] || $scope.storedData[$scope.pageOptions.dispNo][requiredKey].length == 0))) {
					$scope.loadScreenData({ dispNo: $scope.pageOptions.dispNo });
				} else { // 세션스토리지 사용
					$scope.screenData = $scope.storedData[$scope.pageOptions.dispNo]; // 화면 데이터 갱신
				}

				// [TCLICK] 헤더푸터 : 7. 탭랜딩(직접랜딩) - 세션
				if( !$scope.locationHistoryBack) {
					$scope.sendTclick("m_category_pv_" + $scope.mainTemplateType);
				}

				$timeout(function () {
					$scope.screenID = "main-" + $scope.pageOptions.dispNo;
					$scope.moveMenuSwipe($scope.pageOptions.depth2NodeIdx);
					angular.element($window).scrollTop(lotteMainScrollY);
				}, 800);
			}
		} else { // 세션에 담긴 데이터가 없을 경우 데이터 로드
			LotteUserService.loadLoginInfoComplete.then(function (result) { // 로그인 처리 부터 선행된 후 메뉴 로드
				$scope.getMenu(); // Main Navigation Data Load
			});
		}

		// unload시 관련 데이터를 sessionStorage에 저장
		angular.element($window).on("unload", function (e) {
			var sess = {};

			if (!$scope.mainMenu.length) {
				return;
			}

			sess.mainTemplateType = $scope.mainTemplateType; // 템플릿 타입
			sess.storedData = $scope.storedData; // 전체탭 저장 데이터

			$scope.pageOptions.isLoginData = $scope.loginInfo.isLogin; // 세션스토리지 저장할때의 로그인 상태값 저장

			sess.pageOptions = $scope.pageOptions; // 페이지 설정값 데이터
			sess.smartNotice = $scope.smartNotice; // 스마트 알림 데이터
			sess.mainMenu = $scope.mainMenu; // 메뉴 네비 데이터

			if (!commInitData.query.localtest && $scope.leavePageStroage) { // localtest url 파라메타가 없을때 저장
				LotteStorage.setSessionStorage('lotteMainLoc', $location.absUrl());
				LotteStorage.setSessionStorage('lotteMainData', sess, 'json');
				LotteStorage.setSessionStorage('lotteMainScrollY', angular.element($window).scrollTop());
			}
		});
	}]);

	// Directive :: 롯데닷컴 메인 헤더 네비게이션
	app.directive('lotteHeaderMain', ['$timeout', '$window', function ($timeout, $window) {
		return {
			templateUrl : "/lotte/resources_dev/main/lotte_header_main.html",
			replace : true,
			link : function ($scope, el, attrs) {
				// Scroll시 탭 고정
				var $win = angular.element($window),
					$header = angular.element("header#head"),
					headerHeight = $header.height(),
					$fixedCont = angular.element(el).find(".fixed_area");

				$scope.depth2MenuOpenFlag = false;

				function chkWinScrollHandler() { // 윈도우 스크롤 이벤트 체크
					if ($win.scrollTop() > headerHeight) {
						$fixedCont.css({position: "fixed", top: 0, width: "100%", zIndex: 1000}); // 헤더 고정
					} else {
						$fixedCont.removeAttr("style"); // 헤더 고정 해제
					}
				}

				angular.element($window).on("scroll", chkWinScrollHandler); // 윈도우 스크롤 이벤트 체크 Handler 등록

				$scope.menuDepth1Click = function (item, idx) { // 메인 Depth1 메뉴 선택
					if ($scope.pageOptions.depth1NodeIdx == idx)
						return false;

					$scope.pageOptions.depth1NodeIdx = idx;

					if ($scope.pageOptions.depth1NodeIdx  == 0) { // 홈탭일 경우에만 BIG딜(index : 2) 가 default로 되게 예외처리
						//$scope.pageOptions.depth2NodeIdx = 2;
						$scope.findMenuNodeIdx($scope.defaultRendingTabDispNo); // 빅딜의 위치가 바뀔 수 있어 빅딜 DispNo로 인덱스 찾아가게 변경
					} else {
						$scope.pageOptions.depth2NodeIdx = 0;
					}

					$scope.mainTemplateType = $scope.getNowMenu().disp_no; // 템플릿 타입 변경
					$scope.pageOptions.depth2NodeCnt = $scope.mainMenu[$scope.pageOptions.depth1NodeIdx].list.length; // Depth1에 속한 Depth2 메뉴 갯수 저장

					$timeout(function () { // timeout을 주지 않으면 DOM 렌더링이 끝나지 않아 탭의 넓이 계산에서 오류가 나 제대로 찾아가지 못한다.
						$scope.moveMenuSwipeFnc($scope.pageOptions.depth2NodeIdx, true); // 메인탭 2Depth Index 초기화(0) 위치로 이동 : moveMenuSwipeFnc - Swipe 없이 이동
					}, 0);

					if (angular.element($window).scrollTop() > 45) {
						angular.element($window).scrollTop(45); // 화면 상단으로 이동
					}

					$scope.depth2MenuOpenFlag = false;

					// [TCLICK]
					var tclickCode = "m_header_new_";

					if (idx == 0) {
						tclickCode += "home"; // [TCLICK] 헤더푸터 : 5. 홈
					} else {
						tclickCode += "cateprod" + idx; // [TCLICK] 헤더푸터 : 6. 카테고리매장
					}

					$scope.sendTclick(tclickCode);
				};

				$scope.menuDepth2Click = function (item, idx, directFlag, quickMenFlag) { // 메인 Depth2 메뉴 선택
					if ($scope.pageOptions.depth2NodeIdx == idx)
						return false;

					$scope.pageOptions.depth2NodeIdx = idx;

					$scope.mainTemplateType = $scope.getNowMenu().disp_no; // 템플릿 타입 변경

					if (!directFlag) {
						$scope.moveMenuSwipe($scope.pageOptions.depth2NodeIdx); // 메인탭 2Depth 선택된 Index로 위치로 이동 : moveMenuSwipe - Swipe로 이동
					} else {
						$scope.moveMenuSwipeFnc($scope.pageOptions.depth2NodeIdx, true); // 메인탭 2Depth Index 초기화(0) 위치로 이동 : moveMenuSwipeFnc - Swipe 없이 이동
					}

					if (angular.element($window).scrollTop() > 45) {
						angular.element($window).scrollTop(45); // 화면 상단으로 이동
					}

					$scope.depth2MenuOpenFlag = false;

					// [TCLICK] 헤더푸터 : 8. 탭클릭
					if (!quickMenFlag) { // 서브 퀵 메뉴에서 클릭시에는 중복집계 안되게
						$scope.sendTclick("m_category_click_" + $scope.mainTemplateType);
					}
				};

				$scope.depth2MenuToggle = function () { // Depth2 메뉴 펼치기/접기
					$scope.depth2MenuOpenFlag = !$scope.depth2MenuOpenFlag;

					// [TCLICK] 헤더푸터 : 36. 카테고리 퀵 레이어 열기
					if ($scope.depth2MenuOpenFlag) {
						$scope.sendTclick("m_category_quick_layer" + ($scope.pageOptions.depth1NodeIdx + 1));
					}
				};

				$scope.openMenuDepth2Click = function (item, idx, directFlag) { // 메인 Depth2 메뉴 선택
					$scope.depth2MenuOpenFlag = false;
					$scope.menuDepth2Click(item, idx, true, true);

					// [TCLICK] 헤더푸터 : 37. 카테고리 퀵 레이어 내 클릭
					$scope.sendTclick("m_category_quick_" + item.disp_no);
				};
			}
		};
	}]);

	// Directive :: Main Directive
	app.directive('lotteContainer', ['$window', '$timeout', function ($window, $timeout) {
		return {
			templateUrl : '/lotte/resources_dev/main/main_container.html',
			replace : true,
			link : function ($scope, el, attrs) {
				var $win = angular.element($window);

				var onMainOrientationChange = function () {
					angular.element(".pageLoading").css("min-height", ($win.height() - 95)+"px");

					if ($win.width() > 320) {
						$scope.pageOptions.showBanner = false;
					} else {
						$timeout(function () {
							$scope.pageOptions.showBanner = true;
							$scope.$apply();
						})
					}
				};

				if ($win.width() > 320) {
					$scope.pageOptions.showBanner = false;
				} else {
					$scope.pageOptions.showBanner = true;
				}

				onMainOrientationChange();
				$win.on("orientationchange resize", onMainOrientationChange);
			}
		}
	}]);

	// Directive :: Content Container Directive
	app.directive('contentContainer', ['$compile', '$http', '$templateCache', '$parse', 'LotteForm', function ($compile, $http, $templateCache, $parse, LotteForm) {
		return {
			restrict: 'AEC',
			replace : true,
			link : function ($scope, el, attrs) {
				function getTemplateFromType(dispNo) {
					var url = "",
						tpmlNo = $scope.findMenuNodeItem(dispNo).tmpl_no;

					if (tpmlNo != 0) { // 템플릿 번호가 있다면
						switch(tpmlNo) {
							case "20411" : // 카테고리딜 템플릿
								url = "/lotte/resources_dev/main/template_ctgdeal.html"; // 카테고리딜 템플릿
								break;
							case "20412" : // 빅딜 템플릿
								url = "/lotte/resources_dev/main/template_bigdeal.html"; // 빅딜 템플릿
								break;
							case "21811" : // 명절관 템플릿
								url = "/lotte/resources_dev/main/template_holiday.html"; // 명절관
								break;
							default :
								url = "/lotte/resources_dev/main/template_ctgdeal.html"; // 카테고리딜 템플릿
								break;
						}
					} else {
						switch(dispNo) {
							case "5537336": // 이벤트탭
								url = "/lotte/resources_dev/main/template_event.html"; // 이벤트탭 템플릿
								break;
							case "5537337": // 기획전탭
								url = "/lotte/resources_dev/main/template_planshop.html"; // 기획전탭 템플릿
								break;
							case "5537338": // 빅딜탭
								url = "/lotte/resources_dev/main/template_bigdeal.html"; // 빅딜탭 템플릿
								break;
							case "5537340": // TV쇼핑탭
								url = "/lotte/resources_dev/main/template_etv.html"; // TV쇼핑탭 템플릿
								break;
							case "5544340": // 스토리샵탭
								url = "/lotte/resources_dev/main/template_storyshop.html"; // 스토리샵탭 템플릿
								break;
							case "5542940": // 맞춤추천탭
								url = "/lotte/resources_dev/main/template_recommend.html"; // 맞춤추천탭 템플릿
								break;
							case "5537343": // 랭킹존탭
								url = "/lotte/resources_dev/main/template_ranking.html"; // 랭킹존탭 템플릿
								break;
							case "5547174": // 트랜드탭
								url = "/lotte/resources_dev/main/template_trend.html"; // 트랜드탭 템플릿
								break;
							case "5550633": // 스타일샵
								url = "/lotte/resources_dev/main/template_styleshop.html"; // 스타일샵 템플릿
								break;
							default: // 기타 백화점탭, 테마탭, 카테고리 매장탭 (빅딜탭 템플릿 사용)
								url = "/lotte/resources_dev/main/template_ctgdeal.html";
								break;
						}
					}

					$scope.mainTemplateType = dispNo; // 메인템플릿 타입에 전시번호 세팅
					$scope.setCurDisp($scope.mainTemplateType); // 전시 유입 전시번호, 카테고리 세팅

					return url;
				}

				var prevScope, nowTemplate; // 이전 scope와 template을 저장하여 초기화 또는 로드하지 않기 위해

				function loadTemplate(url) { // 템플릿 불러오기
					if (!url) { // url : 템플릿 경로 (템플릿이 없으면 실행하지 않음)
						return false;
					}

					$http.get(url, { cache: $templateCache })
					.success(function (templateContent) {
						if (nowTemplate == $scope.mainTemplateType) { // 이전 템플릿과 새로운 템플릿이 갔다면 로드하지 않음
							return false;
						}

						nowTemplate = $scope.mainTemplateType;

						if (prevScope) { // 이전 scope가 있을 경우 destroy 하여 scope 메모리 초기화
							prevScope.$destroy();
							prevScope = null;
						}

						//el.empty(); // 영역 비우기 (영역을 비웠다가 채우면 layout 그리는 이벤트가 두번 발생되기 때문에 그냥 HTML을 바로 바꿔치기)

						try {
							prevScope = $scope.$new();
							angular.element(el).html($compile(templateContent)(prevScope));
						} catch (e) {}
					})
					.finally(function (data) {
						$scope.resetLoading();
					});
				}

				// 지정된 템플릿이 있을 경우 템플릿 로드
				if ($scope.mainTemplateType != "") {
					loadTemplate(getTemplateFromType($scope.mainTemplateType));
				}

				// Templage 변경시 템플릿 로드
				$scope.$watch('mainTemplateType', function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}

					loadTemplate(getTemplateFromType(newValue));
					$scope.loadScreenData({ dispNo: newValue });
				});

				// URL에 Base Parameter 추가
				function setBaseParameter(href) {
					href = (href + "").indexOf("?") > -1 ? href : href + "?";

					if (href.substring(href.length - 1, href.length) != "?") {
						href += "&";
					}

					return href + $scope.baseParam;
				}

				// 메인 일반/아웃 링크 처리
				$scope.linkUrl = function (url, outlinkFlag, tclick, addParams) {
					if (outlinkFlag) {
						$scope.sendOutLink(url); // 외부 링크 보내기 (새창)

						if (tclick) { // tclick이 있다면
							$scope.sendTclick(tclick); // 외부링크일때 iframe으로 tclick 전송
						}
					} else {
						var url = setBaseParameter(url) ; // 링크 url에 base parameter를 붙여준다.

						if (addParams) { // 추가 파라메타가 있다면
							angular.forEach(addParams, function (val, key) {
								url += "&" + key + "=" + val;
							});
						}

						if (tclick) { // tclick 이 있다면 url 뒤에 parameter를 추가한다.
							url += "&tclick=" + tclick;
						}

						window.location.href = url; // url 이동
					}
				};
			}
		};
	}]);

	// Directive :: 스마트 알림
	app.directive('lotteSmartMessage', ['LotteCommon', 'LotteCookie', function (LotteCommon, LotteCookie) {
		return {
			templateUrl: "/lotte/resources_dev/main/smart_message.html",
			/*template: '<div class="smartNotice" ng-show="smartNoticeShow"><i class="close" ng-click="smartNoticeClose()"></i><p ng-click="smartNoticeClick()">{{smartNoticeMessage}}</p></div>',*/
			replace: true,
			controller: "lotteSmartMessageCtrl",
			link: function ($scope, el, attrs) {
				$scope.smartNoticeClose = function () { // 스마트 알림 닫기
					$scope.smartNoticeShow = false;
					LotteCookie.setCookie("LotteSmartAlarm", "true", 1);
				};

				$scope.smartNoticeClick = function () { // 스마트 알림 이동
					switch ($scope.smartNotice.lastAlarmGoodsType) {
						case "CART": // 장바구니
							window.location.href = LotteCommon.cateLstUrl + "?" + $scope.baseParam;
							break;
						case "WISH": // 위시
							window.location.href = LotteCommon.wishLstUrl + "?" + $scope.baseParam;
							break;
						case "NTC_CART": // 재입고 장바구니 | 장바구니로 가기
							window.location.href = LotteCommon.cateLstUrl + "?" + $scope.baseParam;
							break;
						case "NTC_ETC": // 재입고 위시
							window.location.href = LotteCommon.wishLstUrl + "?" + $scope.baseParam;
							break;
					}

					$scope.smartNoticeClose(); // 팝업 닫고 하루동안 안뜨게 하기
				};
			}
		};
	}]);

	// Controller :: 스마트 알림
	app.controller("lotteSmartMessageCtrl", ['$scope', '$http', 'LotteStorage', 'LotteCommon', 'LotteCookie', function ($scope, $http, LotteStorage, LotteCommon, LotteCookie) {
		// 20160120 스마트 알림 비노출 처리 - UX기획팀 이미준 대리 요청
		// var notice = LotteStorage.getSessionStorage('LotteSmartNotice', 'json'),
		// 	openAlarm = false;

		// if (notice) {
		// 	var nowTime = new Date().getTime();

		// 	if (parseInt(notice.lastAlarm) + (60 * 60 * 24 * 1000) < nowTime) { // 하루
		// 		LotteStorage.delLocalStorage('LotteSmartNotice');
		// 		notice = null;
		// 	}
		// }

		// if (LotteCookie.getCookie("LotteSmartAlarm") != "true") {
		// 	$http.get(LotteCommon.mainNewAlarmData)
		// 	.success(function (data) {
		// 		var alarm = data.alarm_info.items;

		// 		if (alarm != null) {
		// 			if (notice && ((notice.lastAlarmGoodsNm != alarm[0].goods_nm && notice.lastAlarmGoodsType != alarm[0].sum_tgt_sct_cd) || alarm.length)) {
		// 				openAlarm = true;
		// 			}

		// 			if (openAlarm) {
		// 				$scope.smartNotice = $scope.smartNoticeStruct;
		// 				$scope.smartNotice.lastAlarm = new Date().getTime();
		// 				$scope.smartNotice.lastAlarmGoodsNm = alarm[0].goods_nm;
		// 				$scope.smartNotice.lastAlarmGoodsType = alarm[0].sum_tgt_sct_cd;
		// 				LotteStorage.setLocalStorage('LotteSmartNotice',$scope.smartNotice,'json');

		// 				//$scope.smartNoticeOpen($scope.smartNotice.lastAlarmGoodsType, $scope.smartNotice.lastAlarmGoodsNm );
		// 				var newMsg = "";

		// 				if ($scope.smartNotice.lastAlarmGoodsNm.length > 12) {
		// 					newMsg = $scope.smartNotice.lastAlarmGoodsNm.substring(0, 12) + "...";
		// 				} else {
		// 					newMsg = $scope.smartNotice.lastAlarmGoodsNm;
		// 				}

		// 				switch ($scope.smartNotice.lastAlarmGoodsType) {
		// 					case "CART": // 장바구니 할인
		// 						$scope.smartNoticeMessage = "장바구니에 담으신 <span>"+newMsg+"  가격이 할인</span> 되었습니다.";
		// 						break;
		// 					case "WISH": // 위시리스트 할인
		// 						$scope.smartNoticeMessage = "위시리스트에 담으신 <span>"+newMsg+"  가격이 할인</span> 되었습니다.";
		// 						break;
		// 					case "NTC_CART": // 장바구니 재입고
		// 						$scope.smartNoticeMessage = "장바구니에 담으신 <span>"+newMsg+"</span> 상품이 <span>재입고</span> 되었습니다."
		// 						break;
		// 					case "NTC_ETC": // 위시리스트 재입고
		// 						$scope.smartNoticeMessage = "위시리스트에 담으신 <span>"+newMsg+"</span> 상품이 <span>재입고</span> 되었습니다."
		// 						break;
		// 				}

		// 				if ($scope.loginInfo.isLogin) {
		// 					$scope.smartNoticeShow = true;
		// 				}
		// 			}
		// 		}
		// 		// 멀티 노티스의 경우 데이터의 티커 인덱스가 필요함
		// 	})
		// 	.error(function (data) {
		// 		console.log("Error Data : Smart Message");
		// 	});
		// }
	}]);

	/**
	 * Template Directive
	 **/
	// Event Template Directive
	app.directive('templateEvent', ['LotteCommon', function (LotteCommon) {
		return {
			link: function ($scope, el, attrs) {
			}
		};
	}]);

	// Planshop Template Directive (기획전탭)
	app.directive('templatePlanshop', [function () {
		return {
			link: function ($scope, el, attrs) {
				$scope.getProductData = function () { // 상품 페이지 로드
					$scope.loadScreenData({
						keepData: true,
						page : ++$scope.screenData.page,
						dispNo: $scope.getNowMenu().disp_no
					});
				};
			}
		};
	}]);

	// Trend Template Directive (트랜드탭)
	app.directive('templateTrend', [function () {
		return {
			link: function ($scope, el, attrs) {
				$scope.getProductData = function () { // 상품 페이지 로드
					$scope.loadScreenData({
						keepData: true,
						page : ++$scope.screenData.page,
						dispNo: $scope.getNowMenu().disp_no
					});
				};
			}
		};
	}]);

	// Category Deal Template Directive (카테고리딜 템플릿 탭)
	app.directive('templateCtgdeal', [function () {
		return {
			link: function ($scope, el, attrs, ctrl) {
				$scope.changeSort = function (opt) { // 최신순, 인기순, 추천순 소팅 변경
					$scope.screenData.ctg_deal_ui.opt = opt;
					$scope.loadData();

					// [TCLICK] 헤더푸터 : 16,17,18. 최신순, 인기순, 추천순
					var tclick = "m_category_sort_";

					if (opt == 0) {
						tclick += "new";
					} else if (opt == 1) {
						tclick += "popular";
					} else if (opt == 2) {
						tclick += "recom";
					}

					$scope.sendTclick(tclick);
				};

				$scope.changeDeptFilter = function () { // 백화점 소팅
					//console.log('#changeDeptFilter')
					$scope.loadData();

					// [TCLICK] 헤더푸터 : 19. 백화점상품만 보기
					if ($scope.screenData.ctg_deal_ui.dept) {
						$scope.sendTclick("m_category_sort_department");
					}
				};

				$scope.loadData = function () { // 필터 데이터 로드
					$scope.screenData.page = 1;
					$scope.productMoreScroll = true;

					$scope.loadScreenData({
						keepData: true,
						dispNo: $scope.getNowMenu().disp_no, // 전시번호
						opt: $scope.screenData.ctg_deal_ui.opt, // Sortting 순 (0: 추천순, 1: 인기순, 2: 최신순)
						dept: $scope.screenData.ctg_deal_ui.dept // 백화점상품 여부 true, false
					});
				};

				$scope.getProductData = function () { // 상품 페이지 로드
					$scope.loadScreenData({
						keepData: true,
						page : ++$scope.screenData.page,
						dispNo: $scope.getNowMenu().disp_no,
						opt: $scope.screenData.ctg_deal_ui.opt, // Sortting 순 (0: 추천순, 1: 인기순, 2: 최신순)
						dept: $scope.screenData.ctg_deal_ui.dept // 백화점상품 여부 true, false
					});

					// [TCLICK] 메뉴-카테고리딜 카테고리매장추가로딩횟수
					$scope.sendTclick("m_category_" + $scope.mainTemplateType + "_load" + ($scope.screenData.page - 1));
				};
			}
		};
	}]);

	// Category Deal Template Directive
	app.directive('ctgDealMoreCtg', ['LotteCommon', '$timeout', '$window', function (LotteCommon, $timeout, $window) {
		return {
			link: function ($scope, el, attrs, ctrl) {
				$scope.ctgDealMoreCtgMinFlag = 'small';
				$scope.winHeight = 0;
				$scope.maxHeight = 0;

				function calMaxHeight() { // 다른상품 더보기 레이어 최대 높이 계산
					$scope.winHeight = angular.element($window).height();
					$scope.maxHeight = $scope.winHeight - 142;
				}

				calMaxHeight(); // 최대 높이 계산

				angular.element($window).on("resize.ctgDealMoreCtg orientationchange.ctgDealMoreCtg", calMaxHeight);

				$scope.openCtgDealMoreCtg = function () { // 다른상품 더보기 레이어 확대
					$scope.ctgDealMoreCtgMinFlag = 'large';
					$scope.dimmedOpen({
						status: false,
						dimmed: true,
						dimmedOpacity : '0.5',
						target: "ctgDealMorePop",
						popType: null, //'F': 전체화면,N': 일부화면
						callback: $scope.closeCtgDealMoreCtg,
						scrollY : 0,
						scrollEventFlag : false // 스크롤방지여부
					});


					// [TCLICK] 메뉴-카테고리딜 카테고리 더보기 레이어 호출 아이콘
					$scope.sendTclick("m_category_plusicon_" + $scope.mainTemplateType);
				};

				// 다른상품 더보기 레이어 축소
				$scope.closeCtgDealMoreCtg = function () {
					$scope.ctgDealMoreCtgMinFlag = 'min';
					$scope.dimmedClose();
				};

				// 다른상품 더보기 레이어 데이터 변경 체크
				$scope.$watch('screenData.more_category', function (newVal, oldVal) {
					if (newVal) {
						$timeout(function () {
							if ($scope.ctgDealMoreCtgMinFlag != "large") {
								$scope.ctgDealMoreCtgMinFlag = "min";
							}
						}, 3000);
					}
				}, true);
			}
		};
	}]);

	// Big Deal Template Directive (빅딜)
	app.directive('templateBigdeal', [function () {
		return {
			link: function ($scope, el, attrs, ctrl) {
				$scope.bigDataChange = function (opt) { // 빅딜 - 나만을 위한 맞춤추천순 변경
					if ($scope.bigDealBigDataFlag && $scope.loginInfo.isLogin && $scope.loginInfo.privateBigDeal) {
						$scope.loadScreenData({
							keepData: true,
							dispNo: $scope.getNowMenu().disp_no,
							bigdata: $scope.pageOptions.bigdataChkFlag ? "Y" : "N",
							mbrNo: $scope.loginInfo.mbrNo,
							privateBigDeal: $scope.loginInfo.privateBigDeal
						});
					}
				};

				$scope.bigDataChkClick = function () {
					// [TCLICK] 메뉴-빅딜 개인화
					if ($scope.pageOptions.bigdataChkFlag) { // 나만을 위한 맞춤추천순 활성화 일때만 집계
						$scope.sendTclick("m_menu_" + $scope.mainTemplateType + "_personalization");
					}
				};

				$scope.getProductData = function () { // 상품 페이지 로드
					$scope.loadScreenData({
						keepData: true,
						page : ++$scope.screenData.page,
						dispNo: $scope.getNowMenu().disp_no,
						bigdata: $scope.pageOptions.bigdataChkFlag ? "Y" : "N",
						mbrNo: $scope.loginInfo.mbrNo,
						privateBigDeal: $scope.loginInfo.privateBigDeal
					});

					// [TCLICK] 메뉴-빅딜 빅딜추가로딩횟수
					$scope.sendTclick("m_menu_" + $scope.mainTemplateType + "_load" + ($scope.screenData.page - 1));
				};
			}
		};
	}]);

	// TVShopping Template Directive (TV쇼핑탭)
	app.directive('templateEtv', ['$sce', function ($sce) {
		return {
			link: function ($scope, el, attrs, ctrl) {
				$scope.getProductData = function () { // 상품 페이지 로드
					$scope.loadScreenData({
						keepData: true,
						page : ++$scope.screenData.page,
						dispNo: $scope.getNowMenu().disp_no
					});

					// [TCLICK] 메뉴-TV쇼핑 시즌1추가로딩횟수
					$scope.sendTclick("m_menu_" + $scope.mainTemplateType + "_load" + ($scope.screenData.page - 1));
				};
			}
		};
	}]);

	// Story Shop Template Directive (스토리샵탭)
	app.directive('templateStoryshop', [function () {
		return {
			link: function ($scope, el, attrs, ctrl) {
			}
		};
	}]);

	// Recommend Template Directive (맞춤추천탭)
	app.directive('templateRecommend', ['LotteCommon', 'LotteStorage', function (LotteCommon, LotteStorage) {
		return {
			controller : "templateRecommendCtrl",
			link: function ($scope, el, attrs, ctrl) {
				var latestPrdItems = LotteStorage.getLocalStorage("viewGoods");
				$scope.getLatestGoodsInfo(latestPrdItems);

				$scope.goLatestPrdPage = function () { // 최근본 상품 전체보기
					location.href = LotteCommon.lateProdUrl + "?" + $scope.baseParam + "&viewGoods=" + latestPrdItems + "&tclick=m_DC_main" + $scope.mainTemplateType + "Clk_Btn_2";
				};
			}
		};
	}]);

	app.controller("templateRecommendCtrl", ['$scope', '$http', '$timeout', 'LotteCommon', function ($scope, $http, $timeout, LotteCommon) {
		$scope.latelyPrdItems = []; // 최근 본 상품 리스트
		$scope.latelyCompleteFlag = false;

		$scope.getLatestGoodsInfo = function (goodsItems) { // 최근본 상품 로드
			if (!goodsItems) {
				$scope.latelyCompleteFlag = true;
				// console.log('###### 최근본상품', goodsItems);
				// console.log('###### 맟춤상품', $scope.screenData.recommendPrd);
				return false;
			}

			var latelyPrdUrl = LotteCommon.recommendLatelyPrdData + "?viewGoods=" + goodsItems;

			if (LotteCommon.isTestFlag) {
				latelyPrdUrl = LotteCommon.recommendLatelyPrdData;
			}

			$http.get(latelyPrdUrl)
			.success(function (data) {
				if (data.latelyPrd && data.latelyPrd.items) {
					$scope.latelyPrdItems = data.latelyPrd.items;

					var i = 0;

					for (i; i < $scope.latelyPrdItems.length; i++) {
						angular.forEach($scope.latelyPrdItems[i], function (value, key) {
							if ($scope.productOnlyNumberKey.indexOf(key) > -1) {
								$scope.latelyPrdItems[i][key] = parseInt((value + "").replace(/\,/gi, "")); // 20151130 박형윤 맞춤추천 최근본 상품 100만원대 이상 상품 가격 오기 수정
							}
						});
					}

					$timeout(function () {
						try {
							angular.element("#latelyPrdSwipe").scope().resetSwipePos(); // 스와이프 좌표 재계산
						} catch (e) {}
					});
				}
			})
			.error(function (data) {
				console.log("최근본 상품 에러");
			}).finally(function (data) {
				$scope.latelyCompleteFlag = true;
			});
		};
	}]);

	// Ranking Template Directive (랭킹탭 템플릿)
	app.directive('templateRanking', [function () {
		return {
			link: function ($scope, el, attrs) {
				$scope.rankingCtgOpenFlag = false; // 카테고리 열림/닫힘 Flag

				function rankingSortTclick() { // [TCLICK] 메뉴-랭킹존 : 5. 성별/연령 소팅
					var tclick = "m_menu_" + $scope.mainTemplateType + "_sort";

					if ($scope.screenData.ranking_gender == "F") { // 여성
						tclick += "2";
					} else if ($scope.screenData.ranking_gender == "M") { // 남성
						tclick += "3";
					} else { // 전체
						tclick += "1";
					}

					tclick += "_";

					if ($scope.screenData.ranking_age == "20") { // 20대
						tclick += "5";
					} else if ($scope.screenData.ranking_age == "30") { // 30대
						tclick += "6";
					} else if ($scope.screenData.ranking_age == "40") { // 40대
						tclick += "7";
					} else if ($scope.screenData.ranking_age == "50") { // 50대
						tclick += "8";
					} else { // 전체
						tclick += "4";
					}

					$scope.sendTclick(tclick);
				}

				$scope.toggleCtg = function () { // 카테고리 셀렉트 박스 열기/닫기
					$scope.rankingCtgOpenFlag = !$scope.rankingCtgOpenFlag;
				};

				$scope.ctgSelectBoxClick = function (depth) { // 카테고리 선택
					if ($scope.screenData.ranking_ui.selectbox_select_idx != depth) {
						$scope.screenData.ranking_ui.selectbox_select_idx = depth;
						$scope.rankingCtgOpenFlag = true;
					} else {
						$scope.toggleCtg();
					}
				};

				$scope.ctgChange = function (item) { // 카테고리 변경
					if (item.disp_no == $scope.screenData.ranking_disp_no || item.disp_grp_no == $scope.screenData.disp_grp_no) // disp_grp_no가 다를 경우에만 처리
						return false;

					// 카테고리 Depth 판단
					if (item.isAll) { // 전체 선택일 경우 (전체선택일 경우 한 depth 위로 설정 - 이전 disp_grp_no 기반이 전체 데이터여서 한 depth 위로)
						switch ($scope.screenData.ranking_ui.selectbox_select_idx) { // 카테고리 Depth 선택 여부에 따라 카테고리 레벨, depth 설정
							case 0: // 대대카 전체 선택일 경우
								$scope.screenData.ranking_ctg_level = "MA";
								$scope.screenData.ranking_ctg_depth_idx = 0;
								break;
							case 1: // 대카 전체 선택일 경우
								$scope.screenData.ranking_ctg_level = "M0";
								$scope.screenData.ranking_ctg_depth_idx = 1;
								break;
							case 2: // 중카 전체 선택일 경우
								$scope.screenData.ranking_ctg_level = "M1";
								$scope.screenData.ranking_ctg_depth_idx = 2;
								break;
						}
					} else { // 일반
						switch ($scope.screenData.ranking_ui.selectbox_select_idx) { // 카테고리 Depth 선택 여부에 따라 카테고리 레벨, depth 설정
							case 0: // 대대카 카테고리 선택일 경우
								$scope.screenData.ranking_ctg_level = "M0";
								$scope.screenData.ranking_ctg_depth_idx = 1;
								break;
							case 1: // 대카 카테고리 선택일 경우
								$scope.screenData.ranking_ctg_level = "M1";
								$scope.screenData.ranking_ctg_depth_idx = 2;
								break;
							case 2: // 중카 카테고리 선택일 경우
								$scope.screenData.ranking_ctg_level = "M2";
								break;
						}
					}

					// 카테고리 셀렉트 박스 item 변경
					$scope.screenData.ranking_ui.select_all[$scope.screenData.ranking_ctg_depth_idx] = { disp_grp_desc: "전체", disp_grp_no: item.disp_grp_no, disp_no: item.disp_no, isAll: true};
					$scope.screenData.ranking_ui.selectbox[$scope.screenData.ranking_ctg_depth_idx] = { disp_grp_desc: "전체", disp_grp_no: item.disp_grp_no, disp_no: item.disp_no, isAll: true};

					if (!item.isAll) { // 전체선택이 아닐 경우
						$scope.screenData.ranking_ui.selectbox[$scope.screenData.ranking_ui.selectbox_select_idx] = { disp_grp_desc: item.disp_grp_desc, disp_grp_no: item.disp_grp_no, disp_no: item.disp_no};
					}

					$scope.rankingCtgOpenFlag = false; // 카테고리 선택시 카테고리 닫기
					$scope.screenData.ranking_disp_no = item.disp_no; // 카테고리 전시 번호 할당
					$scope.screenData.disp_grp_no = item.disp_grp_no; // 카테고리 disp_grp_no 할당

					$scope.loadData($scope.screenData.ranking_ctg_level, item.disp_no, item.disp_grp_no); // 변경된 데이터 로드

					// [TCLICK] 메뉴-랭킹존 : 2. 랭킹존 카테고리
					$scope.sendTclick("m_menu_" + $scope.mainTemplateType + "_cate_" + item.disp_no);
				};

				$scope.rankGenderChange = function (gender) { // 성별 변경
					$scope.screenData.ranking_ui.setting_flag = true; // 설정 변경 여부 Flag
					$scope.screenData.ranking_gender = gender; // 성별 데이터 지정
					$scope.loadData(); // 데이터 로드

					rankingSortTclick();
				};

				$scope.rankAgeChange = function () { // 나이 변경 (나이변경은 셀렉트 박스에 bindding 된 model 값 직접 참조하여 로드)
					$scope.screenData.ranking_ui.setting_flag = true; // 설정 변경 여부 Flag
					$scope.loadData(); // 데이터 로드

					rankingSortTclick();
				};

				$scope.rankAgeLabelClick = function () { // 랭킹 셀렉트박스 label 클릭시 선택되도록
					angular.element(el).find("#rankTypeAge").trigger("click");
				};

				$scope.loadData = function (ctgDepth, selectDispNo, disp_grp_no, page) { // 랭킹 데이터 로드
					$scope.screenData.page = 1; // 옵션이나 카테고리 변경일때만 loadData를 호출하기 때문에 페이지를 Default 1로 설정
					$scope.productMoreScroll = true; // 상품 페이징 기능 활성화

					var params = {
						keepData: true, // 전체 데이터 갱신이 아닐 경우 true
						dispNo: $scope.getNowMenu().disp_no, // 전시번호 (해당 전시번호에 속한 카테고리 정보를 조회하기 위한 값)
						dispGrpNo: disp_grp_no ? disp_grp_no : $scope.screenData.disp_grp_no, // 랭킹그룹번호
						selectDispNo: selectDispNo ? selectDispNo : $scope.screenData.ranking_disp_no, // 랭킹 카테고리 전시번호
						ctgDepth: ctgDepth ? ctgDepth : $scope.screenData.ranking_ctg_level, // 카테고리 레벨
						gender: $scope.screenData.ranking_gender, // 성별
						age: $scope.screenData.ranking_age // 연령
					};

					$scope.loadScreenData(params);
				};

				$scope.getProductData = function () { // 상품 페이지 로드
					$scope.loadScreenData({
						keepData: true, // 전체 데이터 갱신이 아닐 경우 true
						dispNo: $scope.getNowMenu().disp_no, // 전시번호 (해당 전시번호에 속한 카테고리 정보를 조회하기 위한 값)
						dispGrpNo: $scope.screenData.disp_grp_no, // 랭킹그룹번호
						selectDispNo: $scope.screenData.ranking_disp_no, // 랭킹 카테고리 전시번호
						ctgDepth: $scope.screenData.ranking_ctg_level, // 카테고리 레벨
						gender: $scope.screenData.ranking_gender, // 성별
						age: $scope.screenData.ranking_age, // 연령
						page : ++$scope.screenData.page, // 페이지
					});

					// [TCLICK] 메뉴 - 랭킹존 : 랭킹존 추가 로딩 횟수
					$scope.sendTclick("m_menu_" + $scope.mainTemplateType + "_load" + ($scope.screenData.page - 1));
				};
			}
		};
	}]);

	// Holiday Template Directive (명절관 템플릿)
	app.directive('templateHoliday', [function () {
		return {
			link: function ($scope, el, attrs) {
				$scope.opt_dispno = $scope.pageOptions.holidayTabIdx ? $scope.pageOptions.holidayTabIdx : 0; // 명절 탭 랜덤으로 가져오기
				$scope.holiday_tab_idx = $scope.opt_dispno;

				$scope.holidayMenu = function (id) {
					$scope.holiday_tab_idx = id;
					$scope.screenData.pageEnd = false;
					$scope.opt_dispno = id; // 명절 카테고리 데이터 지정
					$scope.pageOptions.holidayTabIdx = $scope.opt_dispno; // 클릭한 카테고리 id 세션데이터도 갱신
					$scope.loadData(); // 데이터 로드
					$scope.sendTclick("m_menu_5542242_TAB" + (id + 1));
					return false;
				};

				$scope.loadData = function () { // 명절 카테고리 데이터 로드
					$scope.screenData.page = 1; // 옵션이나 카테고리 변경일때만 loadData를 호출하기 때문에 페이지를 Default 1로 설정
					$scope.productMoreScroll = true; // 상품 페이징 기능 활성화

					var params = {
						keepData: true, // 전체 데이터 갱신이 아닐 경우 true
						dispNo: $scope.getNowMenu().disp_no, // 전시번호 (해당 전시번호에 속한 카테고리 정보를 조회하기 위한 값)
						opt_dispno: $scope.opt_dispno, // 명절 카테고리
						holidayMenuTab: true
					};

					$scope.loadScreenData(params);
				};

				$scope.getProductData = function () { // 상품 페이지 로드
					$scope.loadScreenData({
						dispNo: $scope.getNowMenu().disp_no, // 전시번호 (해당 전시번호에 속한 카테고리 정보를 조회하기 위한 값)
						keepData: true, // 전체 데이터 갱신이 아닐 경우 true
						opt_dispno: $scope.opt_dispno, // 명절 카테고리
						page : ++$scope.screenData.page // 페이지
					});
				};
			}
		};
	}]);

	// StyleShop Template Directive (스타일샵 템플릿)
	app.directive('templateStyleshop', ['$window', 'LotteCommon', function ($window, LotteCommon) {
		return {
			link: function ($scope, el, attrs) {
				$scope.tabChange = function (gender) { // WOMEN / MEN 탭 변경
					$scope.pageOptions.styleShopGender = gender;

					$scope.screenDataReset(); // 데이터 초기화

					$scope.loadScreenData({
						keepData: true, // 전체 데이터 갱신이 아닐 경우 true
						dispNo: $scope.getNowMenu().disp_no, // 전시번호 (해당 전시번호에 속한 카테고리 정보를 조회하기 위한 값)
						gender: $scope.pageOptions.styleShopGender // 성별
					});

					var tclickCode = "";

					if (gender == "F") { // 여성탭
						tclickCode = "m_DC_SpeDisp5_Tab_Women";
					} else if (gender == "M") { // 남성탭
						tclickCode = "m_DC_SpeDisp5_Tab_Men";
					}

					if (tclickCode) {
						$scope.sendTclick(tclickCode);
					}
				};

				function getParameter(url, name) {
					var vars = {};
					var parts = (url + "").replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
						vars[key] = value;
					});
					
					return vars[name];
				}

				function validateURL(url) { // URL 맵핑
					var rtnURL = "";

					rtnURL = url + "";

					if (rtnURL.indexOf("/planshop/viewPlanShopDetail.lotte") > -1) { // PC 기획전 URL일 경우 모바일 기획전 URL로 변경
						rtnURL = LotteCommon.prdlstUrl + "?curDispNo=" + getParameter(rtnURL, "spdp_no");
					} else if (rtnURL.indexOf("/product/m/product_list.do") > -1) { // 모바일 기획전일 경우
						rtnURL = LotteCommon.prdlstUrl + "?curDispNo=" + getParameter(rtnURL, "curDispNo");
					} else if (rtnURL.length >= 6 && rtnURL.length <= 8 && !rtnURL.match(/[^0-9]/)) { //숫자형태 6~8자 사이로 입력했을 경우 스타일샵 DispNo로 인식하고 스타일샵 카테고리 페이지로 이동
						rtnURL = LotteCommon.styleShopUrl + "?disp_no=" + rtnURL;
					} else if (rtnURL.indexOf("/styleshop/styleshop.do") > -1) { // 모바일 스타일샵 카테고리일 경우
						rtnURL = LotteCommon.styleShopUrl + "?disp_no=" + getParameter(rtnURL, "disp_no");
					} else if (rtnURL.indexOf("/goods/viewGoodsDetail.lotte") > -1) {
						rtnURL = LotteCommon.prdviewUrl + "?goods_no=" + getParameter(rtnURL, "goods_no");
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
						var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no;

						if (tclick) {
							url += "&tclick=" + tclick;
						}

						$window.location.href = url;
					}
				};

				$scope.goStyleShopCategory = function (dispNo, tclick) { // 스타일샵 카테고리 페이지
					if (dispNo) {
						var url = LotteCommon.styleShopUrl + "?" + $scope.baseParam + "&disp_no=" + dispNo;

						if (tclick) {
							url += "&tclick=" + tclick;
						}

						$window.location.href = url;
					}
				};

				$scope.goStyleBrand = function (brandNo, tclick) { // 브랜드 매장 연결
					if (brandNo) {
						var url = LotteCommon.brandShopSubUrl + "?" + $scope.baseParam + "&upBrdNo=" + brandNo;

						if (tclick) {
							url += "&tclick=" + tclick;
						}

						$window.location.href = url;
					}
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
			}
		};
	}]);
})(window, window.angular);