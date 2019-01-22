var commModule = {};
var mainApp = {};
var loginInfo = {};
var appObj2 = {};

(function (window, angular, undefined) {
	'use strict';

	// lotteSideMylotte 모듈 제거로 이전 이벤트 페이지 오류 방지를 위한 모듈 선언 실제 기능 없음
	// 이벤트 페이지에서 resources 버전을 이전걸로 고정시켜 문제 발생됨.
	var sideMylotteModule = angular.module('lotteSideMylotte', []);

	/**
	 * @ngdoc overview
	 * @name lotteComm
	 * @description 
	 * lotte_comm.js<br/>
	 * 공통 모듈
	 */
	commModule = angular.module('lotteComm', ['ngSanitize', 'lotteUtil', 'lotteFilter', 'lotteUrl','PreventPop']);

	commModule.config(['$httpProvider', function ($httpProvider) {
		/* [2015.06.25 박철휘]
		크로스 도메인 : mapi.lotte.com 의 쿠키를 못 읽는 문제, json data를 angularjs에서 못읽는 문제에 대한 대처
		https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
		HTTP access control (CORS : Cross-site HTTP requests)

		http://jsfiddle.net/X2p7r/41/
		$httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
		$httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
		$httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
		$httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
		$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
		*/
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.withCredentials = true;
	}]);
	
	/**
	 * @ngdoc service
	 * @name lotteComm.service:LotteUserService
	 * @description
	 * User 관련 기능 제공 service
	 */
	commModule.service('LotteUserService', ['$http', '$timeout', '$q', 'LotteCommon', '$sessionStorage', 'commInitData', 'LotteStorage', 
		function($http, $timeout, $q, LotteCommon, $sessionStorage, commInitData, LotteStorage) {
		var self = this;
		// var $scope = angular.element('html').scope();

		this.loginCheck = {
			name: '',
			mbrNo: '',
			gradeCd: '',
			mbrAge: '',
			genSctCd: '',
			isLogin: false,
			isStaff: false,
			isAdult: false,
			privateBigDeal: false
		};

		/**
		 * @ngdoc function
		 * @name LotteUserService.getLoginObj
		 * @description
		 * loginCheck 구조 리턴 
		 */
		this.getLoginObj = function () {
			return self.loginCheck;
		};
	
		/**
		 * @ngdoc function
		 * @name LotteUserService.getCookie
		 * @description
		 * ngCookies를 사용하기 위해 angular-s.js를 모두 include하는 것에 대한 부담으로 인해 getCookie 함수만 정의해서 사용함
		 */
		this.getCookie = function (cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';'),
				i = 0;

			for (i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ')

					c = c.substring(1);

				if (c.indexOf(name) == 0)
					return c.substring(name.length,c.length);
			}

			return "";
		};
	
		/**
		 * @ngdoc function
		 * @name LotteUserService.retriveLoginInfo
		 * @description
		 * 비동기 통신 : 로그인 사용자 데이터 가저 오기
		 */
		this.retriveLoginInfo = function () {
			var deferred = $q.defer();
			var storage_loginchk = $sessionStorage.LotteUserService_loginCheck;
			
			var cookieLoginchk = self.getCookie("LOGINCHK"),
				cookieLoginId = self.getCookie("LOGINID");

			if ((cookieLoginchk || cookieLoginId) &&
				location.pathname != "/login/m/loginForm.do") { // 로그인한 사용자 (로그인 페이지는 무조건 로그 아웃 추가)
				if (storage_loginchk) { // 로그인 정보가 세션스토리지에 있다면 스토리지 내용으로 전달
					self.loginCheck = storage_loginchk;
					// $scope.loginInfo = self.loginCheck;
					
					deferred.resolve({loginCheck: self.loginCheck});
				} else { // 로그인 정보가 세션스토리지에 없다면 서버에 로그인 정보 요청
					try {
						var req = {
							method : "GET",
							url : LotteCommon.loginData,
							params : {
								bigdataFlag : "Y" // 메인 빅딜 개인화 추가로 인해 Flag 추가
							}
						};
		
						$http(req)
						.success(function (response, status, headers, config) {
							deferred.resolve(response, status, headers, config);
						})
						.error(function (response, status, headers, config) {
							deferred.reject({loginCheck: self.loginCheck});
						});
					} catch (e) {
						if (storage_loginchk) {
							delete $sessionStorage.LotteUserService_loginCheck; // sessionStorage에 데이터가 존재하는 경우 clear
						}

						deferred.reject({loginCheck: self.loginCheck});
					}
				}
			} else { // 로그인하지 않은 사용자
				if (storage_loginchk) {
					delete $sessionStorage.LotteUserService_loginCheck; // sessionStorage에 데이터가 존재하는 경우 clear
				}
				
				// $scope.loginInfo = self.loginCheck;
				deferred.reject({loginCheck: self.loginCheck});
			}
			
			return deferred.promise;
		};
		/*****************************************************************************
		 * 2017-08-26 박형윤 로그인체크 문제로 로그인관련 서비스 새로 생성 --
		 ****************************************************************************/

		// 
		/**
		 * @ngdoc function
		 * @name LotteUserService.promiseLoginInfo
		 * @description
		 * 로그인 정보 보장
		 * 쿠키값을 이용하여 로그인 관련 쿠키(LOGINCHK, LOGINID, MBRNO, MBRNO_M)가 하나라도 있을 경우 로그인한 사용자로 판단.)
		 * MBRNO가 로그 아웃을 해도 유지되는 케이스가 있어 체크항목에서 제외
		 * 사용법
		 * LotteUserService를 Controller 또는 디렉티브에 주입한 후
		 * LotteUserService.promiseLoginInfo().then(function (loginInfo) {
		 * 	loginInfo.isLogin 등으로 판단
		 * });
		 */
		this.promiseLoginInfo = function () {
			var deferred = $q.defer();
			var storage_loginchk = $sessionStorage.LotteUserService_loginCheck;
			
			var cookieLoginchk = self.getCookie("LOGINCHK"),
				cookieLoginId = self.getCookie("LOGINID");

			// console.log("cookie chk ", cookieLoginchk, cookieLoginId, (cookieLoginchk || cookieLoginId));

			if ((cookieLoginchk || cookieLoginId) &&
				location.pathname != "/login/m/loginForm.do") { // 로그인한 사용자 (로그인 페이지는 무조건 로그 아웃 추가)
				if (storage_loginchk) { // 로그인 정보가 세션스토리지에 있다면 스토리지 내용으로 전달
					// console.log("1. storage_loginchk :" , storage_loginchk);
					self.loginCheck = storage_loginchk;
					// $scope.loginInfo = self.loginCheck;
					// console.log("loginInfo Storage ::", self.loginCheck);
					
					deferred.resolve(self.loginCheck);
				} else { // 로그인 정보가 세션스토리지에 없다면 서버에 로그인 정보 요청
					self.retriveLoginInfo().then(function (res) {
						if (res.HasError) {
							if (storage_loginchk) {
								delete $sessionStorage.LotteUserService_loginCheck; // sessionStorage에 데이터가 존재하는 경우 clear
							}
							// console.log("2. res.HasError ::", self.loginCheck);
							deferred.reject(self.loginCheck);
						} else {
							$sessionStorage.LotteUserService_loginCheck = res.loginCheck;
							LotteStorage.setLocalStorage("userName", res.loginCheck.name);
							
							self.loginCheck = res.loginCheck;
							// $scope.loginInfo = self.loginCheck;
							
							// console.log("3. res.success ::", self.loginCheck);
							deferred.resolve(self.loginCheck);
						}
					}).catch(function (res) {
						if (storage_loginchk) {
							delete $sessionStorage.LotteUserService_loginCheck; // sessionStorage에 데이터가 존재하는 경우 clear
						}

						console.warn("로그인 정보 로드 실패!");
						// console.log("4. catch ::", self.loginCheck);
						deferred.reject(self.loginCheck);
					});
				}
			} else { // 로그인하지 않은 사용자
				if (storage_loginchk) {
					delete $sessionStorage.LotteUserService_loginCheck; // sessionStorage에 데이터가 존재하는 경우 clear
				}
				
				// $scope.loginInfo = self.loginCheck;
				
				// console.log("5. 로그인 안함 (쿠키값 없음, 로그인페이지 아님) :" , self.loginCheck);
				deferred.reject(self.loginCheck);
			}

			return deferred.promise;
		};
		/*****************************************************************************
		 * -- 2017-08-26 박형윤 로그인체크 문제로 로그인관련 서비스 새로 생성
		 ****************************************************************************/

		/*****************************************************************************
		 * 2017-08-26 박형윤 하단 내용으로 구현된 로그인 관련 개선 필요
		 ****************************************************************************/
		this.loadLoginInfoComplete; // 로그인 정보 로드에 대한 deferred

		/**
		 * @ngdoc function
		 * @name LotteUserService.getLoginInfo
		 * @description
		 * 로그인 체크 : 로그인한 경우 필수 정보를 sessionStorage에 담고 session 내에서는 sessionStorage에 저장된 data를 return한다.
		 * 호출 url : /json/cn/login_check.json
		 */
		this.getLoginInfo = function () {
			try {
				var cookie_loginchk = this.getCookie("MBRNO");
				var storage_loginchk = $sessionStorage.LotteUserService_loginCheck;
				var scope = angular.element('html').scope();
                
                // 20170118 eung 로그아웃 풀림 임시방편으로 사라진 MBRNO 값을 복원
                if(cookie_loginchk){
                    LotteStorage.setSessionStorage("MBRNO_tmp", cookie_loginchk);
                }else{
                    if(this.getCookie("MBRNO_M")){
                        var tmplogin = LotteStorage.getSessionStorage("MBRNO_tmp");
                        if(tmplogin != undefined){
                            cookie_loginchk = tmplogin;
                        }
                    }
                }
				//쿠키값이 없으면 로그인하지 않은 사용자이므로 default login 객체 return
				/* 로그인 테스트 - 로컬 테스트시 주석 처리 필요 */
				if (!cookie_loginchk) {                    
					if (storage_loginchk) {
						delete $sessionStorage.LotteUserService_loginCheck; // sessionStorage에 데이터가 존재하는 경우 clear
					}

					var deferred =$q.defer();
					self.loadLoginInfoComplete = deferred.promise;
					deferred.resolve();
					return self.loginCheck;
				}
				
				if (commInitData.query['adultChk'] != "Y") {
					if ($sessionStorage.LotteUserService_loginCheck) {	            	
						scope.loginInfo = $sessionStorage.LotteUserService_loginCheck;
						isLogin = scope.loginInfo.isLogin;

						var deferred =$q.defer();
						self.loadLoginInfoComplete = deferred.promise;
						deferred.resolve();
						return $sessionStorage.LotteUserService_loginCheck;
					}
				}

				self.loadLoginInfoComplete = this.retriveLoginInfo();
				self.loadLoginInfoComplete.then(function (response) {
                   
					if (response.HasError) {
						return loginCheck;
					} else {
						$sessionStorage.LotteUserService_loginCheck = response.loginCheck;
						LotteStorage.setLocalStorage("userName", response.loginCheck.name);

						self.loginCheck = response.loginCheck;
						scope.loginInfo = response.loginCheck;
						isLogin = scope.loginInfo.isLogin;
						return response.loginCheck;
					}
				}).catch(function (response) {
					return self.loginCheck;
				});
			} catch (e) {
			}

			return self.loginCheck;
		};
	}]);

	/**
	 * @ngdoc object
	 * @name lotteComm.controller:LotteCtrl
	 * @requires  
	 * $scope, $parse, $location, $window, $document, $http, $compile,$timeout, LotteUtil, LotteLink, commInitData, LotteCommon, LotteUserService, LotteForm, LotteStorage
	 * @description
	 * 공통 컨트롤러 
	 */
	commModule.controller('LotteCtrl', ['$scope', '$parse', '$location', '$window', '$document', '$http', '$compile', '$timeout', 'LotteUtil', 'LotteLink', 'commInitData', 'LotteCommon', 'LotteUserService', 'LotteForm', 'LotteStorage', 'LotteCookie',
		function($scope, $parse, $location, $window, $document, $http, $compile,$timeout, LotteUtil, LotteLink, commInitData, LotteCommon, LotteUserService, LotteForm, LotteStorage, LotteCookie) {
		// 공통 Scope 정의
		$scope.loginInfo = { // 사용자 로그인 정보
			name: '',
			mbrNo: '',
			gradeCd: '',
			mbrAge: '',
			genSctCd: '',
			isLogin: false,
			isStaff: false,
			isAdult: false,
			privateBigDeal: false
		};
		$scope.imgPath = ""; // 이미지 경로
		$scope.scrollY = 0;
		$scope.scrollFlag = true; // 스크롤 가능 여부
		$scope.leavePageStroage = true; // 페이지 벗어남(unload)에 저장 여부 기능
		$scope.mainYn = false; // 메인여부
		$scope.showSrh = false; // 검색 레이어 여부
		$scope.isShowSideCtg = false; // 카테고리 레이어 여부
		// $scope.isShowSideMylotte = false; // mylotte 레이어 여부
		$scope.tClickBase = ""; // Tclick Base
		$scope.tClickRenewalBase = ""; // Tclick Renewal Base

		// 사용자 로그인 정보
		$scope.loginInfo = LotteUserService.getLoginObj();
		LotteUserService.getLoginInfo();

		// 사용자 로그인 정보 보장을 위한 추가 2017-08-26 박형윤
		LotteUserService.promiseLoginInfo().then(function (loginInfo) {
			// console.log("loginInfo", loginInfo);
			$scope.loginInfo = loginInfo;
			// console.log("$scope.loginInfo 11111111111  ", $scope.loginInfo);
		}).catch(function (loginInfo) {
			$scope.loginInfo = loginInfo;
			// console.log("$scope.loginInfo 33333333333  ", $scope.loginInfo);
		});

		// console.log("$scope.loginInfo 222222222222  ", $scope.loginInfo);

        /******************************************
		 * Native APP 체크 & 디바이스 체크
		 ******************************************/
		var lotteNativeAppUA = navigator.userAgent.match(/mlotte00[\d]\/[\d\.]*/);
        $scope.appObj = {
			isApp : (lotteNativeAppUA || commInitData.query['udid'] || commInitData.query['schema'] || (LotteUserService.getCookie('UDID')!='' && LotteUserService.getCookie('UDID')!='""')) ? true : false,
			isAndroid : false,
			isIOS : false,
			isIpad : false,
			isTablet : angular.element($window).width() >= 768, // 태블릿 여부
			isOldApp : false,
			iOsType : "",
			isSktApp: navigator.userAgent.indexOf("sklotte001") > -1 || commInitData.query['schema'] == "sklotte001", // T롯데(SKT 앱) 여부
			ver : commInitData.query['v'] ? commInitData.query['v'] : 0,
			verNumber : lotteNativeAppUA != null ? parseInt((lotteNativeAppUA[0] + "").replace(/(mlotte00[\d]\/)|(\.)/g, "")):parseInt(((commInitData.query['v'] ? commInitData.query['v'] : 0) + "").replace(/\./gi, "")),
			schema: commInitData.query['schema'] ? commInitData.query['schema'] : "",
			needUpdateApp : sessionStorage.getItem("needUpdateApp")=="Y",
			isNativeHeader : false
		};

        appObj2 = $scope.appObj;
		var mobileInfo = new Array('Android', 'iPhone', 'iPod', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
		
		for (var info in mobileInfo) {
			var matchKw = navigator.userAgent.match(mobileInfo[info]);

			if (matchKw != null) {
				if (matchKw[0] == 'iPhone' || matchKw[0] == 'iPad') {
					$scope.appObj.isIOS = true;
					$scope.appObj.iOsType = matchKw[0];
				} else if (matchKw[0] == 'Android') {
					$scope.appObj.isAndroid = true;
				}

				if (matchKw[0] == 'iPad') {
					$scope.appObj.isIpad = true;
				}
			}
		}

		// TEST 코드
		$scope.stgServerChk = false;
		$scope.stgServerMonitor = true;

		// if (($window.location.host + "").indexOf("localhost") > -1 || $window.location.host == "mo.lotte.com") {
		// 	$scope.stgServerChk = true;
		// }

		$scope.testLocation = $location.absUrl();
		$scope.testCurDispStcCD = get_base("curDispNoSctCd");
		$scope.testCurDispNo = get_base("curDispNo");
		$scope.testTclick = get_base("tclick");
		$scope.testCn = get_base("cn");
		$scope.testCdn = get_base("cdn");

		$scope.closeStgServerMonitor = function () {
			$scope.stgServerMonitor = false;
		};
		
		// History back 체크 루틴
		$scope.locationHistoryBack = false;
		var lotteMobileHistory = LotteStorage.getSessionStorage("LotteMobileHistory", 'json');
	
		if (lotteMobileHistory != -1 && lotteMobileHistory != null) {
			if (lotteMobileHistory[lotteMobileHistory.length-1].href == window.location.href &&
				lotteMobileHistory[lotteMobileHistory.length-1].referrer == document.referrer) {
				// 페이지 새로 고침 체크 로직 필요 하면 이곳에
			} else {
				if (lotteMobileHistory.length > 1) {
					if (lotteMobileHistory[lotteMobileHistory.length-2].href == window.location.href &&
						lotteMobileHistory[lotteMobileHistory.length-2].referrer == document.referrer) {
						$scope.locationHistoryBack = true;
						lotteMobileHistory.pop();
						LotteStorage.setSessionStorage("LotteMobileHistory", lotteMobileHistory, 'json');
					}
				}

				if (lotteMobileHistory.length > 10 && !$scope.locationHistoryBack) {
					lotteMobileHistory.shift();
					LotteStorage.setSessionStorage("LotteMobileHistory", lotteMobileHistory, 'json');
				}

				if (!$scope.locationHistoryBack) {
					lotteMobileHistory.push({href:window.location.href,referrer:document.referrer});
					LotteStorage.setSessionStorage("LotteMobileHistory", lotteMobileHistory, 'json');
				}
			}
		} else {
			var newHistory = [{href:window.location.href,referrer:document.referrer}];
			LotteStorage.setSessionStorage("LotteMobileHistory", newHistory, 'json');
		}

		// 이미지 경로 header url
		var protocol = $location.protocol();

		if (protocol == "http") {
			$scope.imgPath = protocol + "://image.lotte.com";
		} else {
			$scope.imgPath = protocol + "://simage.lotte.com";
		}

		// 메인 페이지 체크
		if (location.pathname.indexOf("/main_phone.") >= 0) {
			$scope.mainYn = true;
		}
		
		// 딤처리 공통 
		$scope.LotteDimm = {
			status: false,
			dimmed: true,
			dimmedOpacity : '0.6',
			target: null,
			popType: null, //'F': 전체화면,N': 일부화면
			callback: null,
			scrollY : 0,
			scrollEventFlag : false // 스크롤방지여부
		};

		// App 일 경우 header 가 없으므로 높이값을 넣음 (닷컴:48 ,엘롯데:53)
		$scope.headerHeight = 48;
		$scope.subHeaderHeight = 48;
		
		// 터치 방지 디렉티브 생성
		var superBlockElem = angular.element(document.body).append($compile('<lotte-super-block></lotte-super-block>')($scope));

		$scope.$watch("LotteSuperBlockStatus", function (newVal) {
			if (newVal != null) {
				//console.log("Screen Block :"+newVal);
			}
		}, true);

		// 공통 알림 유닛 디렉티브 생성
		var alertMessageElem = angular.element(document.body).append($compile('<lotte-alert-message></lotte-alert-message>')($scope));

		// 상품 이미지 확대 보기 창
		var productZoomElem = angular.element(document.body).append($compile('<zoom-product-continer></zoom-product-contine>')($scope));
		
		// 딤 유닛 디렉티브 생성
		var dimmElem = angular.element(document.body).append($compile('<lotte-dimm></lotte-dimm>')($scope));
		
		/**
		 * @ngdoc function
		 * @name LotteCtrl.dimmedOpen
		 * @description
		 * 공통 딤 오픈
		 * @example
		 * $scope.dimmedOpen({
		 * 		target:'newPopup',
		 * 		callback: this.newPopupClose()
		 * });
		 * @param {Object} dimmed 오픈할 요소 구조
		 * @param {float} dimmed.dimmedOpacity 투명도
		 * @param {String} dimmed.target Target
		 * @param {function} dimmed.callback 창 닫힐때 콜백 함수
		 */
		$scope.dimmedOpen = function (dimmed) {
			if (dimmed.dimmed == false) {
				$scope.LotteDimm.dimmedOpacity = '0.0';
			}

			if ($scope.LotteDimm.target != null && $scope.LotteDimm.callback) {
				$scope.LotteDimm.callback();
			}

			$scope.LotteDimm.scrollY = angular.element($window).scrollTop();  
			$scope.LotteDimm.status = true;
			$scope.LotteDimm.target = dimmed.target ? dimmed.target : null;
			$scope.LotteDimm.callback = dimmed.callback ? dimmed.callback : null;
			$scope.LotteDimm.scrollEventFlag = dimmed.scrollEventFlag == true ?  true : false;

			if ($scope.LotteDimm.scrollEventFlag) {
				angular.element($window).on("touchmove.dimmedScrollEvt", function (e) {
					e.preventDefault();
				});
			} else {
				angular.element("#wrapper").css("height","100%");
			}
		};
		
		/**
		 * @ngdoc function
		 * @name LotteCtrl.dimmedClose
		 * @description
		 * 공통 딤 클로즈
		 * @example
		 * $scope.dimmedClose();
		 */
		$scope.dimmedClose = function () {
			if (!$scope.LotteDimm.status) {
				return false;
			}

			$scope.LotteDimm.status = false;
			$scope.LotteDimm.target = null;

			if ($scope.LotteDimm.callback) {
				$scope.LotteDimm.callback();
			}

			$scope.LotteDimm.dimmedOpacity = '0.6';                    
			
			if ($scope.LotteDimm.scrollEventFlag) {
				angular.element($window).off("touchmove.dimmedScrollEvt");
				$scope.LotteDimm.scrollEventFlag = false;
			} else {
				angular.element("#wrapper").attr("style","");
			}

			$timeout(function () {
				angular.element($window).scrollTop($scope.LotteDimm.scrollY);
			}, 100);
		};
            
		// 기본 param 정의
		$scope.baseParam = "c=" + get_base('c') + "&udid="
			+ get_base('udid') + "&v=" + get_base('v') + "&cn="
			+ (get_base('cn') == 'undefined' ? "" : get_base('cn')) + "&cdn=" + (get_base('cdn') == 'undefined' ? "" : get_base('cdn')) + "&schema="
			+ get_base('schema');
            
		baseParam = $scope.baseParam; // current-dev.js

        //20170511 파라미터 저장 및 세팅
        /*
        1. baseParam 이 존재하고 값이 있으면
            - 세션스토리지에 저장한다.
        2. 존재하지 않으면 
            - 세션스토리지 있는 값으로 세팅한다.
        */
        function get_base(str) {
			var rtnUrlParamValue = "";

			rtnUrlParamValue = commInitData.query[str] ? commInitData.query[str] : "";

			/************************************************************************************
			 * 20170804 박형윤
			 * 닷컴 APP일때 CN, CDN 값이 파라미터에 없거나 undefined로 잘못 들어올 경우 보정 처리 추가
			 ***********************************************************************************/
			if ($scope.appObj.isApp && 
				str == "cn" &&
				(
					($scope.appObj.isAndroid && $scope.appObj.verNumber >= 290) || 
					($scope.appObj.isIOS && $scope.appObj.verNumber >= 2800)
				)) {
				if (commInitData.query["cn"] == "" || typeof commInitData.query["cn"] == "undefined") {
					rtnUrlParamValue = "23";
				} else if (typeof commInitData.query["cdn"] == "undefined") {
					rtnUrlParamValue = "";
				}
			}

            return rtnUrlParamValue;
        }

        $scope.check_param = true;
		
        if (get_base('c') == "" && get_base('udid') == "" && get_base('schema') == "") { // 존재하지 않는경우
            setTimeout(function() {
                if ($scope.check_param) {
                    var saved_param = LotteStorage.getSessionStorage("base_param", "json");
                    var pstr = "";                    

                    if (saved_param != null) {
                        pstr = "c=" + saved_param.c + "&udid=" + saved_param.udid + "&v=" + saved_param.v + "&schema=" + saved_param.schema;
                        $scope.baseParam = pstr;

                        if (get_base('cdn') == '') {
                            $scope.baseParam += "&cdn=" + saved_param.cdn ;                
                            pstr = $scope.baseParam;
                        } else {
                            $scope.baseParam += "&cdn=" + (get_base('cdn') == 'undefined' ? "" : get_base('cdn'));
                        }

                        if (get_base('cn') == '') {
                            $scope.baseParam += "&cn=" + saved_param.cn ;                
                            pstr = $scope.baseParam;
                        } else {
                            $scope.baseParam += "&cn=" + (get_base('cn') == 'undefined' ? "" : get_base('cn'));
                        }

                        baseParam = $scope.baseParam;
                    }else{ //201707 추가 cn, cdn 값만 들어오는 경우 추가 
                        pstr = "c=" + get_base('c') + "&udid=" + get_base('udid') + "&v=" + get_base('v') +"&schema=" + get_base('schema');
                        if(get_base('cn') == ''){
                            pstr += "&cn=";
                        }
                        if(get_base('cdn') == ''){
                            pstr += "&cdn=";
                        }
                    }            

                    if (location.search.indexOf("udid=") < 0) {
                        if (location.search.length > 0) {
                            location.search += "&" + pstr;
                        } else {
                            location.search += pstr; 
                        }
                    }     

                }
            }, 500);
        } else { // 값이 있는 경우
            LotteStorage.setSessionStorage("base_param", {
                c : get_base('c'),
                udid : get_base('udid'),
                v : get_base('v'),
                cn :(get_base('cn') == 'undefined' ? "" : get_base('cn')),
                cdn :(get_base('cdn') == 'undefined' ? "" : get_base('cdn')),
                schema :get_base('schema')
            }, 'json');  
		}
		
		/*************************************************************************************
		 * 20170804 박형윤
		 * AOS 2.9.0, iOS 2.80.0 Native 전환 이후 메인페이지를 거치지 않아 쿠키값이 초기화 되지 못해
		 * cn, cdn 값이 계속 이전값으로 유지되는 현상 수정
		 * 개발쪽 ChannelIntercepter.java 참고
		 *************************************************************************************/
		function appChannelInit() {
			if ($scope.appObj.isApp && 
				(
					($scope.appObj.isAndroid && $scope.appObj.verNumber >= 290) || 
					($scope.appObj.isIOS && $scope.appObj.verNumber >= 2800)
				)
			) { // 닷컴 앱일 때만 처리하자 (웹은 메인웹페이지를 거치므로)
				// var expire_date_num = new Date();
				if (get_base('cn') == "" || get_base('cn') == "23" || get_base('cn') == "1" || typeof commInitData.query["cn"] == "undefined" || LotteCookie.getCookie("CHLNO") == "1") { // CN 값 처리 (앱일 경우 1인 케이스가 있으면 안되므로 1일때도 처리)
					if (LotteCookie.getCookie("CHLNO") != "23") {
						LotteCookie.setCookie("CHLNO", "23", null, "lotte.com");
						// console.info("CHLNO 초기화");
					}
				}

				if (get_base('cdn') == "" || typeof commInitData.query["cdn"] == "undefined") { // CDN 값 처리
					if (LotteCookie.getCookie("CHLDTLNO") != "" && LotteCookie.getCookie("CHLDTLNO") != "0") {
						LotteCookie.setCookie("CHLDTLNO", "", null, "lotte.com");
						// console.info("CHLDTLNO 초기화");
					}
				}
			}
		}

		$timeout(appChannelInit, 100); // 앱 채널 초기화

        //기본 Param 을 붙인 링크를 리턴 (eung)   
        $scope.baseLink = function(href){
            href = (href + "").indexOf("?") > -1 ? href : href + "?";
            if (href.substring(href.length - 1, href.length) != "?") {
                href += "&";
            }
            return href + $scope.baseParam;                        
        }

		// 앱 버전에 따른 처리
		if(($scope.appObj.isIOS && $scope.appObj.verNumber >= 2800) || ($scope.appObj.isAndroid && $scope.appObj.verNumber >= 290 && !$scope.appObj.isSktApp)) {
			$scope.appObj.isNativeHeader = true;
		}

		isApp = $scope.appObj.isApp; // lib/jquery/cnt_interface.js
		isIOS = $scope.appObj.isIOS; // lib/jquery/cnt_interface.js
		isAndroid = $scope.appObj.isAndroid; // lib/jquery/cnt_interface.js
		isTablet = $scope.appObj.isTablet; // lib/jquery/cnt_interface.js
		
		// Tclick Base 선언
		$scope.tClickBase = "m_" + (location.href.indexOf(".ellotte.com") != -1 ? "EL" : "DC") + "_";
		$scope.tClickRenewalBase = "m_RDC_";
		
		/*
		 * 강제 업데이트 관련 사항 추가 20151114 이인성
		 * mlotte001 닷컴,
		 * mlotte003 닷컴 iPad,
		 * ellotte002 엘롯데 안드로이드
		 * ellotte001 엘롯데 ios
		 * sklotte001 T롯데
		 */
		var appVerArr = {
			android: {mlotte001: 225, ellotte002: 107, sklotte001: 103},
			ios: {mlotte001: 215, mlotte003:138, ellotte001:109},
			Newandroid: {mlotte001: 250, ellotte002:150, sklotte001:150},
			Newios: {mlotte001:250, mlotte003:150, ellotte001:150}
		};

		var versionCheckRegKey = {
			mlotte001: /(mlotte001\/.[\d\.]*)/gi,
			mlotte003: /(mlotte003\/.[\d\.]*)/gi,
			ellotte002: /(ellotte002\/.[\d\.]*)/gi,
			ellotte001: /(ellotte001\/.[\d\.]*)/gi,
			sklotte001: /(sklotte001\/.[\d\.]*)/gi
		};

		// 테스트 UserAgent
		// IOS
		// var uagent = "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13B143 mlotte001/2.5.0 udid/87bbc656e624300142c5d76c8a78d3807ba7db8872c727e442fb2f0b07bf968e";
		// 안드로이드 
		// var uagent = "Mozilla/5.0 (Linux; Android 4.4.2; SM-T320 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36 sklotte001/1.50 udid/9fdd9213b118a6ee";
		// var uagent = "Mozilla/5.0 (Linux; Android 4.4.2; SM-T320 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36 mlotte001/2.50 udid/9fdd9213b118a6ee";

		/**
		 * @ngdoc function
		 * @name LotteCtrl.appForceUpdateCheck
		 * @description
		 * 강제 업데이트 체크
		 * @example
		 * $scope.appForceUpdateCheck('android');
		 * @param {String} os 운영체제 android/ios
		 */
		$scope.appForceUpdateCheck = function (os) {
			angular.forEach(appVerArr[os], function (val, key) {
				var mt = navigator.userAgent.match(versionCheckRegKey[key]);

				if (mt != null) {
					var spVersion = mt[0].split("/");
					var appVersion = parseInt(spVersion[1].replace(/\./gi,'').substring(0,3));

					if (appVersion <= val) {
						if (os == $scope.appObj.isIpad) {
							// 아이패드
							$scope.appUpdate = true;
							window.location.href = "/update/update.do";
							return false;
						} else if (os == 'ios') {
							// 아이폰
							$scope.appObj.isOldApp = true;
						} else {  
							// 안드로이드
							$scope.appUpdate = true;
							window.location.href = "/update/update.do";
							return false;
						}
					} else if (appVerArr['New'+os][key] > appVersion) {
						$scope.appObj.isOldApp = true;
					}
				}
			});
		};
		
		if ($scope.appObj.isApp) {
			$scope.appUpdate = false;

			if ($scope.appObj.isAndroid) {
				$scope.appForceUpdateCheck('android');
			} else {
				$scope.appForceUpdateCheck('ios');
			}

			if ($scope.appUpdate) {
				return false;
			}
		}

		// 20161104 박형윤 닷컴 안드로이드 2.7.1 미만 웹에서 앱 버전 체크하여 업데이트 Confirm 노출
		// if ($scope.appObj.isApp && // Native App이고 
		// 	$scope.appObj.isAndroid && // 안드로이드이고
		// 	!$scope.appObj.isSktApp && // T롯데가 아니고
		// 	$scope.appObj.verNumber < 271) { // 버전이 2.7.1 미만인 경우
		// 	if (LotteCookie.getCookie("app271ConfirmChk") != "true" && 
		// 		confirm("신규 업데이트 항목이 있습니다.\n최신버전으로 업데이트하고 더욱 더 편리한 쇼핑을 즐기세요.")) {
		// 		location.href = "market://details?id=com.lotte";
		// 	} else {
		// 		LotteCookie.setCookie("app271ConfirmChk", "true");
		// 	}
		// }
		
		// 카테고리가 펼쳐졌는지 확인
		$scope.getShowSideCtg = function () {
			return $scope.isShowSideCtg;
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.gotoMain
		 * @description
		 * 홈으로 이동 (sessionStorage 제거)
		 * @example
		 * $scope.gotoMain();
		 * @param {String} str 티클릭을 위한 코드
		 */
		$scope.gotoMain = function (str) {
			$scope.clearSessionStorage();

			var tclick = "&tclick=" + $scope.getHeadTclick("new_logo");

			if (str != undefined) {
				if (str == 'footer') {
					tclick = "&tclick="+$scope.tClickRenewalBase+"actionbar_home";
				}
			}

			$window.location.href = LotteCommon.mainUrl + "?" + $scope.baseParam +  tclick;
		};

		// 로그인/아웃 처리
		$scope.loginProc = function (tclick, adultChk) {
			LotteCookie.delCookie("cartCount"); // 장바구니 갯수 제거 (로그인/로그아웃 시 장바구니 개수는 따로 체크되어야해서 세션에서 삭제);

			if (tclick) {
				$scope.loginMoveProc(tclick, adultChk);
			}else {
				$scope.loginMoveProc($scope.tClickBase + "footer_Clk_Lnk_10", adultChk);
			}
		};
		
		/**
		 * 로그인 정보 제외한 세션스토리지 제거
		 */
		var sessionClearExecptions = [
			"ngStorage-LotteUserService_loginCheck",
			"lotteSideCtgData",
			"lotteSideCtgData_2017",
			"opt_val",
			"app_update_cancel",
			"app_ipad_update_info_close"
		];

		$scope.clearSessionStorage = function() {
			try {
				for (var i = 0; i < sessionStorage.length; i++) {
					if (sessionClearExecptions.indexOf(sessionStorage.key(i)) < 0) {
						if ( sessionStorage.getItem(sessionStorage.key(i)) != null ) {
							sessionStorage.removeItem(sessionStorage.key(i));
						}
					}
				}
			} catch (e) {}

			//로그인정보까지 날아가던것 방지 : rudolph:151014
			//sessionStorage.clear();
			$scope.leavePageStroage = false; // 페이지 벗어남(unload)에 저장 여부 기능
		};

		// 마이레이어 로그인
		// $scope.myLayerLoginProc = function () {
		// 	$scope.loginMoveProc('m_mylayer_login', undefined);
		// };
		
		/**
		 * @ngdoc function
		 * @name LotteCtrl.loginMoveProc
		 * @description
		 * 로그인 페이지 이동
		 * @example
		 * $scope.loginMoveProc(tclick,adultChk);
		 * @param {String} tclick 티클릭을 위한 코드
		 * @param {String} adultChk 성인 인증 Y/N
		 */
		$scope.loginMoveProc = function (tclick, adultChk) {
			sessionStorage.clear();

			/*
			for (var i = 0; i < sessionStorage.length; i++) {
				if (sessionStorage.key(i).indexOf("lotteMain2016") < 0) {
					if ( sessionStorage.getItem(sessionStorage.key(i)) != null ) {
						sessionStorage.removeItem(sessionStorage.key(i));
					}
				}
			}
			*/

			if (LotteUserService.getLoginInfo().isLogin) { // go logout
				if ($scope.appObj.isApp) {
					// 20160728 박형윤 iOS 로그아웃 호출 이슈로 iOS / Android 분기
					if ($scope.appObj.isIOS) { //IOS 일때 
						$window.location.href = "logincheck://logout";
						setTimeout(function () { // iOS 스키마 호출 보장을 위한 500ms 딜레이 후 로그아웃 처리
							$window.location.href = LotteCommon.logoutUrl + "?" + $scope.baseParam + "&tclick="+tclick;
						}, 500);
					} else { // Android
						//20160115 로그아웃시 PMS 호출 , 안드로이드일때 
						try {
							window.loginCheck.callAndroid("logout");
						} catch (e) {}

						$window.location.href = LotteCommon.logoutUrl + "?" + $scope.baseParam + "&tclick="+tclick;
					}

					console.log("로그아웃 PMS 호출");
				} else {
					$window.location.href = LotteCommon.logoutUrl + "?" + $scope.baseParam + "&tclick="+tclick;
				}
			} else { // go logout
				var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
				var adultParam = "";

				if (adultChk == 'Y') {
					adultParam = "&adultChk=Y";
				}

				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&tclick=" + tclick + adultParam + targUrl;
			}
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.goAdultSci
		 * @description
		 * 본인인증 링크
		 * @example
		 * $scope.goAdultSci(loginChk);
		 * @param {String} loginChk 로그인 유무 Y/N
		 */
		$scope.goAdultSci = function (loginChk) {
			if (loginChk != "Y") {
				if (!confirm("19세 미만 청소년 접근이 제한된 정보로 본인인증이 필요합니다.")) {
					if ($window.location.href.indexOf('/product_view.do') > -1) {
						$window.location.href = LotteCommon.mainUrl + '?' + $scope.baseParam;
					}

					return false;
				}
			}

			var backUrl = "";

			if ($window.location.href.indexOf('adultChk=Y') > -1) {
				backUrl = $window.location.href;
			} else {
				backUrl = $window.location.href + '&adultChk=Y';
			}

			localStorage.removeItem('sci_param'); /*주문서로 전달하기 위한 파라메터*/
			localStorage.removeItem('sci_action'); /*주문서 이전 사은품 선택 페이지 url*/
			localStorage.removeItem('sci_login_href'); /*로그인 폼 url*/

			$window.location.href = LotteCommon.sciUrl + "?" + $scope.baseParam + "&adultChk=Y&returnDomain=" + $window.location.host + "&backUrl="
				+ encodeURIComponent(backUrl, 'UTF-8');
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.categoryView
		 * @description
		 * 좌측 카테고리 링크
		 * @example
		 * $scope.categoryView(disp_no, title, tclick, etcStr);
		 * @param {number} disp_no 전시번호
		 * @param {string} title 제목
		 * @param {string} tclick 티클릭
		 * @param {string} etcStr 기타
		 */
		$scope.categoryView = function (disp_no, title, tclick, etcStr) {
			if (!disp_no || !title) {
				alert("카테고리 정보가 잘못되었습니다.");
				return false;
			}

			/*http://m.lotte.com/category/new_prod_list.do?c=mlotte&udid=&v=&cn=&cdn=&disp_no=5522765&title=각질관리/스크럽/필링&idx=1&tclick=categorylist_prodlistgo_idx01*/
			var tclickStr = "";

			if (tclick) {
				tclickStr = "&tclick=m_side_cate_catesmall_" + tclick;
			}

			$window.location.href = LotteCommon.categoryUrl + "?" + $scope.baseParam + "&disp_no=" + disp_no + "&title=" + title + tclickStr + etcStr;
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.planShopView
		 * @description
		 * 좌측 기획전 링크
		 * @example
		 * $scope.planShopView(curDispNo, tclick);
		 * @param {number} curDispNo 전시번호
		 * @param {String} tclick 티클릭
		 */
		$scope.planShopView = function (curDispNo, tclick) {
			if (!curDispNo) {
				alert("기획전 정보가 잘못되었습니다.");
				return false;
			}

			//http://m.lotte.com/category/new_prod_list.do?c=mlotte&udid=&v=&cn=&cdn=&disp_no=5522765&title=각질관리/스크럽/필링&idx=1&tclick=categorylist_prodlistgo_idx01
			var tclickStr = "";

			if (tclick) {
				tclickStr = "&tclick=" + tclick;
			}

			$window.location.href = LotteCommon.prdlstUrl + "?" + $scope.baseParam + "&curDispNo=" + curDispNo + tclickStr;
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.cornerBanView
		 * @description
		 * 코너 배너 링크
		 * @example
		 * $scope.cornerBanView(linkUrl, tclick, title, isOutLink);
		 * @param {String} linkUrl 링크 주소
		 * @param {string} tclick 티클릭
		 * @param {string} title 제목
		 * @param {boolean} isOutLink 앱을 위한 아웃링크 
		 */
		$scope.cornerBanView = function (linkUrl, tclick, title, isOutLink) {
			var tclickStr = "", titleStr = "", linkUrlStr = linkUrl;

			if (tclick) {
				tclickStr = "&tclick=" + tclick;
			}

			if (title) {
				titleStr = "&title=" + title;
			}

			linkUrlStr = LotteUtil.setUrlAddBaseParam(linkUrl, $scope.baseParam + titleStr + tclickStr);
			//console.log(linkUrlStr);

			if (!isOutLink) {
				$window.location.href = linkUrlStr;
			} else {
				LotteLink.goOutLink(linkUrlStr);
			}
		};
		
		/**
		 * @ngdoc function
		 * @name LotteCtrl.goSearch
		 * @description
		 * 검색 실행 검색 페이지로 이동
		 * @example
		 * $scope.goSearch(keyword, tclick);
		 * @param {String} keyword 검색어
		 * @param {string} tclick 티클릭
		 */
		$scope.goSearch = function (keyword, tclick) { // 새 키워드 검색
			//tclick 있을 경우 tclick 수집을 위한 url parameter 추가
			var tClickStr = "";

			if (tclick) {
				tClickStr = "&tclick=" + tclick;
			}

			// URL 이동
			$window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + '&keyword=' + keyword + tClickStr);
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.productView
		 * @description
		 * 상품상세페이지 링크(본인인증)
		 * @example
		 * $scope.productView(item, curDispNo, curDispNoSctCd, tclick);
		 * @param {Object} item 상품 아이탬
		 * @param {Number} curDispNo 전시번호 
		 * @param {Number} curDispNoSctCd 유입코드
		 * @param {String} tclick 티클릭
		 */
		$scope.productView = function (item, curDispNo, curDispNoSctCd, tclick) {
			if (item.byrAgelmt == 19) { // 19금 상품
				if ($scope.loginInfo.isAdult == "") { // 본인인증 안한 경우
					if (!$scope.loginInfo.isLogin) { // 로그인 안한 경우
						$scope.loginProc('Y');
					} else {
						$scope.goAdultSci();
					}
					
					return false;
				} else if (!$scope.loginInfo.isAdult) { // 성인이 아닌 경우
					alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
					return false;
				}
			}
			
			$window.location.href = $scope.getProductViewUrl(item, tclick);
		};
		
		/**
		 * 상품상세 페이지 링크 URL 구하기
		 * @param {Object} item 상품 아이탬
		 * @param {String} tclick 티클릭
		 * @param {Boolean} noBaseParam 베이스파람 미사용 여부
		 */
		$scope.getProductViewUrl = function(item, tclick, noBaseParam) {
			var curDispNoStr = "";
			if (item.curDispNo) {
				curDispNoStr = "&curDispNo=" + item.curDispNo;
			}

			var curDispNoSctCdStr = "";
			if (item.curDispNoSctCd) {
				curDispNoSctCdStr = "&curDispNoSctCd=" + item.curDispNoSctCd;
			}

			var goodsNoStr = item.goods_no != undefined ? item.goods_no : item.goodsNo;
			
			var genieYnStr = "";
			if (item.genie_yn) {
				genieYnStr = "&genie_yn=" + item.genie_yn;
			}

			var tclickStr = "";
			if (tclick) {
				tclickStr = "&tclick=" + tclick;
			}
			
			var path = LotteCommon.prdviewUrl + "?goods_no=" + goodsNoStr + curDispNoStr + curDispNoSctCdStr + genieYnStr + tclickStr;
			path += "&" + $scope.getBaseParam(noBaseParam);
			return path;
			//$window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goodsNoStr + curDispNoStr + curDispNoSctCdStr + genieYnStr + tclickStr;
		};
		
		/**
		 * baseParam에서 개인정보 제거
		 * @param noUDID udid, v, schema 제거
		 */
		$scope.getBaseParam = function(noUDID){
			var base = $scope.baseParam;
			if(noUDID === true){
				if($scope.baseParamStriped != undefined){
					base = $scope.baseParamStriped;
				}else{
					base = base.replace(/(udid=).*?(&|$)/,"$1$2");
					base = base.replace(/(v=).*?(&|$)/,"$1$2");
					base = base.replace(/(schema=).*?(&|$)/,"$1$2");
					$scope.baseParamStriped = base;
				}
			}
			return base;
		};
		
		/**
		 * URL 파라메터를 오브젝트로 변환하기
		 * @param param URL 파라메터 스트링
		 * @return 파라메터 오브젝트
		 */
		$scope.convertParamObject = function(param){
			if(param.length > 0){
				var amp = param.lastIndexOf("&");
				var eqr = param.lastIndexOf("=");
				if(eqr < 0 || eqr < amp){
					param = param + "=";
				}
			}

			// https일 경우 앱에서 &을 @로 변경되기 때문에 추가
			if (param.indexOf("@") > -1) {
				param = param.split("@").join("&");
			}

			return param ? JSON.parse(
				'{"' + param.replace(/&/g, '","').replace(/=/g,'":"') + '"}'
				//'{"' + param.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
	            //function(key, value) { return key===""?value:decodeURIComponent(value) }
			):{}
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.sendProductWish
		 * @description
		 * 상품 위시리스트 담기
		 * @example
		 * $scope.sendProductWish(goodsNo, callBackFunc);
		 * @param {Number} goodsNo 상품
		 * @param {function} callBackFunc 리턴 받을 함수
		 */
		$scope.sendProductWish = function (goodsNo, callBackFunc) {
			var postParams = {
				goods_nos : goodsNo
			};

			$http({
				method: 'POST',
				url: LotteCommon.prdAddWish,
				data: postParams,
				transformRequest: LotteForm.JsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				$scope.openCireleSystemAlert({type:"wishPop"}); 
				if (callBackFunc) {
					callBackFunc(true);
				}
			})
			.error(function (ex) {
				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;
					
					if ('9003' == errorCode) {
						alert(errorMsg);
						// TODO ywkang2 : lotte_svc.js 를 참조해야함
						var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8'); 
						// $window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl
						location.href = '/login/m/loginForm.do?' + targUrl;
					} else {
						$scope.openSystemAlert({msg:errorMsg}); 
					}
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}

				if (callBackFunc) {
					callBackFunc(false);
				}
			});
		};
		
		/**
		 * 베이스파람 추가하여 링크 이동
		 * @param e 클릭 이벤트 객체
		 */
		$scope.gotoLinkTarget = function(e){
			var a = $(e.currentTarget);
			var url = a.prop("href");
			if(url == undefined || url == ""){ return; }
			
			location.href = $scope.getURLQualified(url);
		};
		
		/**
		 * 검증된 URL 구하기
		 * @param url 검증할 url
		 * @param noUDID 
		 */
		$scope.getURLQualified = function(url, noUDID){
			if(url == undefined){ return ""; }
			
			// add baseparam
			if(url.indexOf("?") < 0){
				url = url + "?" + $scope.getBaseParam(noUDID);
			}else{
				var arr = url.split("?");
				var obj = $scope.convertParamObject(arr[1]);
				obj.c		= commInitData.query.c;
				obj.cdn		= commInitData.query.cdn;
				obj.cn		= commInitData.query.cn;
				if(noUDID === true){
					obj.schema	= "";
					obj.udid	= "";
					obj.v		= "";
				}else{
					obj.schema	= commInitData.query.schema;
					obj.udid	= commInitData.query.udid;
					obj.v		= commInitData.query.v;
				}
				//url = arr[0] + "?" + $.param(obj);
				url = arr[0];
				var div = "?";
				for(var key in obj){
					url += div + key + "=" + obj[key];
					div = "&";
				}
			}
			return url;
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.sendTclick
		 * @description
		 * 티클릭 보내기
		 * @example
		 * $scope.sendTclick(tclick, outlink);
		 * @param {String} tclick 티클릭
		 * @param {String} outlink 아웃링크 있을경우 타이머 0 (사용 안하는듯함)
		 */
		$scope.sendTclick = function (tclick, outlink) {
			console.info(tclick);
			var setTime = 1000;

			if (outlink) {
				setTime = 0;
			}
			// console.log("tclick(ang) : " + tclick); 테스트 후 삭제
			// console.info("TCLICK : ", tclick);

			$("#tclick_iframe").remove();

			setTimeout(function () {
				var iframe = document.createElement('iframe');
				iframe.id = 'tclick_iframe';
				iframe.style.visibility = 'hidden';
				iframe.style.display = "none";
				//iframe.src = LotteCommon.baseUrl + "/exevent/tclick.jsp?" + $scope.baseParam + "&tclick=" + tclick;
				iframe.src = LotteCommon.tclickUrl + tclick + "&" + $scope.baseParam;
				document.body.appendChild(iframe);
			}, setTime);

			/* pending 현상때문에 jsp 와 같은 기능을 가져옴. 
			angular.element('#tclick_iframe')[0].contentDocument.location.replace(LotteCommon.tclickUrl + tclick);*/
		};

		commModule.sendTclick = $scope.sendTclick;

		/**
		 * @ngdoc function
		 * @name LotteCtrl.shareStorage
		 * @description
		 * sessionStorage / localStorage http/https 간 상호 호환을 위한 iframe 생성 호출
		 * @example
		 * $scope.shareStorage(type, key, val);
		 * @param {String} type Storage 타입 (local : localStorage, session : sessionStorage)
		 * @param {String} key storage Key값
		 * @param {String} val storage 저장될 값
		 * @param {String} frameId iframe ID로 사용할 값 (동일 ID로 여러개 호출될 경우 적용이 되지 않을 수 있음)
		 */
		$scope.shareStorage = function (type, key, val, frameId) {
			if (!type || !key || !val) {
				return false;
			}

			if (type.indexOf("local") > -1) {
				type = "local";
			} else {
				type = "session";
			}

			var setTime = 300;

			if (!frameId) {
				frameId = "storageShare";
			}

			$("#" + frameId).remove();

			setTimeout(function () {
				try {
					var iframe = document.createElement("iframe");
					iframe.id = frameId;
					iframe.style.visibility = "hidden";
					iframe.style.display = "none";

					var storageShareUrl = LotteCommon.secureStorageShareUrl;

					if ($location.protocol() == "https") {
						storageShareUrl = LotteCommon.storageShareUrl;
					}

					iframe.src = storageShareUrl + "?type=" + type + "&key=" + key + "&val=" + val;
					document.body.appendChild(iframe);
				} catch (e) {}
			}, setTime);
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.sendOutLink
		 * @description
		 * 새창으로 열기
		 * @example
		 * $scope.sendOutLink(url);
		 * @param {String} url 주소
		 */
		$scope.sendOutLink = function (url) {
			//$window.open(url);
			LotteLink.goOutLink(url);
			return false;
		};

		/**
		 * @ngdoc function
		 * @name LotteCtrl.loadSideMylotteData
		 * @description
		 * 우측 마이롯데 데이터 가저오기 (로그인 데이터 로드 완료 후)
		 * @example
		 * $scope.loadSideMylotteData();
		 */
		var loadSideMylotteData = function () {
			$http.get(LotteCommon.sideMylotteData, {
				params : {
					mbrNo : $scope.loginInfo.mbrNo
				}
			}).success(function(data) {
				$scope.mylotteData = data;
			}).error(function(data) {
				console.log('Error Data :  우측 마이롯데 데이터');
			});
		};
		
		// 모바일 리뉴얼 윈도우 기본 이벤트에 대한 처리 공통으로 이동
		var $win = angular.element($window);

		$scope.winWidth = 0; // 윈도우 넓이
		$scope.winHeight = 0; // 윈도우 높이
		$scope.screenType = 1; // 스크린 타입 (1 : 0 ~ 640미만, 2: 640 ~ 900미만, 3 : 900 이상)
		$scope.winScrollTopPos = 0;

		$win.on("resize.comm orientationchange.comm", function (e) {
			$scope.winWidth = $win.width();
			$scope.winHeight = $win.height();
			$scope.screenType = $scope.winWidth < 640 ? 1 : $scope.winWidth < 900 ? 2 : 3;
			$timeout(function () {
				var topPos = $win.scrollTop();

				if ($scope.winWidth >= 768) {
					$scope.appObj.isTablet = true;
				}

				$win.scrollTop(topPos + 1); // ios 앱 헤더 fixed 자리 못잡는 결함
			}, 300);

		}).on("scroll.comm", function (e) {
			$scope.winScrollTopPos = $win.scrollTop();
			$scope.$broadcast("winScroll", {scrollPos: $scope.winScrollTopPos, winWidth: $scope.winWidth, winHeight: $scope.winHeight});
		}).trigger("resize.comm")

		// 동영상 자동재생 설정값 및 망(3G,LTE,Wifi) 앱 호출 체크 함수
		$scope.autoPlayCheck = function () { // 동영상 자동재생 설정값 앱 호출
			if ($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 262) { // 안드로이드이면서 T롯데닷컴이 아닌 경우 안드로이드 버전 2.6.0이상 (5월 30일 자동재생 설정값 배포후 적용 예정)
				try {
					if (window.lottebridge.autoPlayAnd) { 
						window.lottebridge.autoPlayAnd();
					}
				} catch (e) {
				}
			} else if ($scope.appObj.isAndroid && $scope.appObj.isSktApp) { // 안드로이드이면서 T롯데닷컴일 경우
				if ($scope.appObj.verNumber >= 205) { // 버젼이 2.0.5 이상일 경우 앱 자동재생여부 호출
					try {
						if (window.lottebridge.autoPlayAnd) { 
							window.lottebridge.autoPlayAnd();
						}
					} catch (e) {}
				} else {
					movAutoPlaylCheck(false, true);
				}
			} else if (
				($scope.appObj.iOsType == "iPhone" && $scope.appObj.verNumber >= 2560) || // 아이폰이면서 아이폰버전  2.56.0 이상
				($scope.appObj.iOsType == "iPad" && $scope.appObj.verNumber >= 223) // 아이패드이면서 아이패드버전 2.2.3 이상
			) {
				$timeout(function () { // IOS 버그로 인해 호출 딜레이
					window.location.href = "lottebridge://autoPlayIos";
				}, 300);
			}
		}

		// 앱일 경우에만 & 주문서, 로그인페이지에서는 동영상이 존재 하지 않음으로 동영상 플레이 호출 제거
		// 로그인 페이지에서는 지문로그인과 스킴이 겹쳐 지문로그인이 되지 않는 현상으로 추가 제거
		if ($scope.appObj.isApp && (window.location.href + "").indexOf("/order/m/order_form.do") == -1 && (window.location.href + "").indexOf("/login/m/loginForm.do") == -1) {
			$scope.autoPlayCheck();
		}
        
        /**
         * 공통 모달 팝업 스크립트
         * 2016-08-19
         */
        $scope.modalPopList2016 = [];
        
        $scope.inform_2016 = function(message, msgObj){
        	if(message == undefined){
        		console.warn("TypeError: Not enough arguments to 'inform_2016'.");
        		return;
        	}
        	
        	if(msgObj == undefined){
        		msgObj = {};
        	}
        	msgObj.message = message;
        	msgObj.type = "inform";
        	
        	$scope.modalPopList2016.unshift(msgObj);
        	$scope.showModalPop_2016();
        };
        
        $scope.alert_2016 = function(message, msgObj){
        	if(message == undefined){
        		console.warn("TypeError: Not enough arguments to 'alert_2016'.");
        		return;
        	}
        	
        	if(msgObj == undefined){
        		msgObj = {};
        	}
        	msgObj.message = message;
        	msgObj.type = "alert";
        	
        	$scope.modalPopList2016.unshift(msgObj);
        	$scope.showModalPop_2016();
        };
        
        $scope.confirm_2016 = function(message, msgObj){
        	if(message == undefined){
        		console.warn("TypeError: Not enough arguments to 'confirm_2016'.");
        		return;
        	}
        	
        	if(msgObj == undefined){
        		msgObj = {};
        	}
        	msgObj.message = message;
        	msgObj.type = "confirm";
        	
        	$scope.modalPopList2016.unshift(msgObj);
        	$scope.showModalPop_2016();
        };
        
        $scope.showModalPop_2016 = function(){
        	if($scope.modalPopList2016.length == 0){ return; }
        	
        	var pop = $("#modalPop2016");
        	if(pop.length == 0){
        		var query = '';
        		query += '<div id="modalPop2016" class="modalPop2016">';
        		query += '<div class="mp16_wrap">';
        		query += '<div class="mp16_msg"></div>';
        		query += '<div class="mp16_btn">';
        		query += '<a href="#" class="cancel">취소</a>';
        		query += '<a href="#" class="ok">확인</a>';
        		query += '</div>';
        		query += '</div></div>';
        		pop = $(query);
        		
        		pop.find("a.cancel").bind("click", $scope.modalPopBtnClick_2016);
        		pop.find("a.ok").bind("click", $scope.modalPopBtnClick_2016);
        		
        		pop.unbind("touchmove").bind("touchmove", function(e){ e.preventDefault(); });
        	}
        	
        	pop.addClass("open");
        	$("body").append(pop);
        	
        	$scope.updateModalPop_2016();
        };
        
        $scope.updateModalPop_2016 = function(){
        	if($scope.modalPopList2016.length == 0){
        		$("#modalPop2016").removeClass("open");
        	}else{
        		var pop = $("#modalPop2016");
        		var msgObj = $scope.modalPopList2016[0];
        		
        		pop.removeClass("alert confirm");
        		pop.addClass(msgObj.type);
        		
        		pop.find(".mp16_msg").html(msgObj.message);
        		if(msgObj.label == undefined){
        			pop.find("a.ok").text("확인");
        			pop.find("a.cancel").text("취소");
        		}else{
        			if(msgObj.label.ok == undefined){
        				pop.find("a.ok").text("확인");
        			}else{
        				pop.find("a.ok").text(msgObj.label.ok);
        			}
        			if(msgObj.label.cancel == undefined){
        				pop.find("a.cancel").text("취소");
        			}else{
        				pop.find("a.cancel").text(msgObj.label.cancel);
        			}
        		}
        		
        		var wrap = pop.find(".mp16_wrap");
        		var h = wrap.outerHeight();
        		var wh = $(window).height();
        		wrap.css("top", Math.round((wh - h) / 2) - 50);
        	}
        };
        
        $scope.modalPopBtnClick_2016 = function(e){
        	if($scope.modalPopList2016.length == 0){ return; }
        	
        	var a = $(e.currentTarget);
        	var isOk = a.hasClass("ok");
        	var msgObj = $scope.modalPopList2016.shift();
        	
        	if(msgObj != undefined){
        		var cbtype = typeof(msgObj.callback);
        		if(cbtype == "function"){
        			msgObj.callback(isOk);
        		}
        	}
        	
        	$scope.updateModalPop_2016 ();
        };
        // 공통 모달 팝업 스크립트 끝
        
        /**
         * 오늘 날짜 문자열 구하기
         */
        $scope.getTodayDate = function(){
			var now = new Date();
			return "" + now.getFullYear() + "." + (now.getMonth()+1) + "." + now.getDate();
        };
        
		/**
		 * 유효한 배열인지 검사 (길이가 1 이상의 배열)
		 * @param {Object} arr - 배열인지 검사할 오브젝트
		 */
		$scope.isValidArray = function(arr){
			return angular.isArray(arr) && arr.length > 0;
		};
		
		/**
		 * 유효한 문자열인지 검사 (1자 이상의 문자열)
		 * @param {Object} str - 문자열인지 검사할 오브젝트
		 */
		$scope.isValidString = function(str){
			return angular.isString(str) && str.length > 0;
		};
		
		/**
		 * 유효한 숫자인지 검사 (0보다 큰 숫자)
		 * @param {Object} num - 숫자인지 검사할 오브젝트
		 */
		$scope.isValidNumber = function(num){
			return angular.isNumber(num) && num > 0;
		};
        
        /**
         * 모바일 단말기 디버깅
         * 2016.11.03 한상훈
         */
        $scope.trace = function(){
        	if(location.host == "m.lotte.com"){ return; }
        	//if(commInitData.query.tracable != "Y"){ return; }
        	
        	var now = new Date();
        	var h = now.getHours();
        	var hh = (h < 10) ? "0"+h : "" + h;
        	var m = now.getMinutes();
        	var mm = (m < 10) ? "0"+m : "" + m;
        	var s = now.getSeconds();
        	var ss = (s < 10) ? "0"+s : "" + s;
        	var ms = now.getMilliseconds();
        	var mss = "" + ms;
        	if(ms < 10){
        		mss = "00" + mss;
        	}else if(ms < 100){
        		mss = "0" + mss;
        	}
        	var time = '<span style="color:#999">[' + hh + ":" + mm + ':' + ss + '.' + mss + ']</span> ';
        	var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
        	var str = JSON.stringify(args, null, 1);
        	str = time + str.substr(3, str.length - 5);
        	
        	var wrap = angular.element("#traceWarp");
        	if(wrap.length == 0){
        		window.traceEval = function(){
        			var $scope = getScope();
        			try{
        				var str = angular.element("#traceTf").val();
        				if(str.indexOf("$scope.trace(") >= 0){
        					eval(str);
        				}else{
        					$scope.trace( eval(str) );
        				}
        			}catch(e){
        				$scope.trace(e.toString());
        			}
        		};
        		
        		var query = '<div id="traceWarp" style="position:fixed;z-index:10000;bottom:0;left:0;right:0;height:100px;background-color:#fff;padding:10px;border-top:1px solid #333;font-size:11px;">';
        		query += '<a onclick="angular.element(\'#traceWarp\').hide();" style="display:block;width:41px;height:24px;position:absolute;top:-24px;right:0;background-color:#fff;box-shadow:inset 0 0 0 1px #333;letter-spacing:-1px;text-align:center;line-height:24px;">Close</a>';
        		query += '<a onclick="angular.element(\'#traceWarp > div\').empty();return false;" onmousedown="event.preventDefault();" style="display:block;width:41px;height:24px;position:absolute;top:-24px;right:40px;background-color:#fff;box-shadow:inset 0 0 0 1px #333;letter-spacing:-1px;text-align:center;line-height:24px;">Clear</a>';
        		query += '<a onclick="traceEval();return false;" onmousedown="event.preventDefault();" style="display:block;width:41px;height:24px;position:absolute;top:-24px;right:80px;background-color:#fff;box-shadow:inset 0 0 0 1px #333;letter-spacing:-1px;text-align:center;line-height:24px;">Exec</a>';
        		query += '<span style="display:block;height:24px;position:absolute;left:0;top:-24px;right:120px;">';
        		query += '<input id="traceTf" type="text" style="height:24px;margin:0;padding:0 4px;box-sizing:border-box;border:none;width:99%;background-color:#fff;box-shadow:inset 0 0 0 1px #333;" /></span>';
        		query += '<div style="width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch;word-break:break-all;"></div></div>';
        		wrap = angular.element(query);
        		angular.element("body").append(wrap);
        	}
        	wrap.show();
        	wrap.find("> div").prepend('<pre>' + str + '</pre>');
        };
        
		/**
		 * 와이더플래닛 모바일 스크립트, 로그 추가하기
		 * 2016.09.19 한상훈
		 */
		$scope.addWiderPlanetLog = function(type, items){
			if($location.host() == "localhost"){ return; }
			
			if(angular.element("#wp_tg_cts").length == 0){
				angular.element(document.body).append('<div id="wp_tg_cts"></div>');
			}
			
			window.wptg_tagscript_vars = window.wptg_tagscript_vars || [];
			
			if(items == undefined){
				window.wptg_tagscript_vars.push(
					(function(){
						return {
							wp_hcuid:"",
							ti:"30390",
							ty:type,
							device:"mobile"
						};
					})
				);
			}else{
				window.wptg_tagscript_vars.push(
					(function(){
						return {
							wp_hcuid:"",
							ti:"30390",
							ty:type,
							items:items,
							device:"mobile"
						};
					})
				);
			}
			
			$scope.sendWiderPlanetLog();
		};
		
		/**
		 * 와이더플래닛 모바일 스크립트, 로그 전송하기
		 * 2016.09.19 한상훈
		 */
		$scope.sendWiderPlanetLog = function(){
			if(window.wptg_tagscript== undefined || window.wptg_tagscript.exec == undefined){
				var body = document.getElementsByTagName("body")[0];
				var scr = document.createElement("script");
				scr.type = "text/javascript";
				scr.async = "async";
				scr.id = "widerplanetLogger";
				scr.src = "//cdn-aitg.widerplanet.com/js/wp_astg_4.0.js";
				body.appendChild(scr);
				return;
			}
		
			window.wptg_tagscript.exec();
		};

		/**
		 * 와이더플래닛 모바일 스크립트, 현재 페이지 확인
		 * 장바구니, 상품상세 이외 페이지 기본 코드 호출
		 * 2016.09.19 한상훈
		 */
		$timeout(function(){
			var url = $location.absUrl();

			// if(url.indexOf(LotteCommon.cartLstUrl) >= 0){
			// 	// 장바구니 별도 처리
			// }else if(url.indexOf(LotteCommon.prdviewUrl) >= 0){
			// 	// 상품상세 별도 처리
			// }else if(url.indexOf("/product/m/product_view_gucci") >= 0){
			// 	// 구찌 상품상세
			// }else if(url.indexOf("/product/m/product_wine_view") >= 0){
			// }else if(url.indexOf("/product/product_wine_view") >= 0){
			// 	// 와인 상품상세
			// }else{
			// 	// 공통
			// 	$scope.addWiderPlanetLog("Home"); // 공통일 경우에만 삽입
			// }

			// 20161027 박형윤	하루동안 와이더 플래닛 수집 스크립트 제거 (메인만)
			if (/*url.indexOf(LotteCommon.mainUrl) < 0 &&*/ // 메인 예외 처리 (20161031 박형윤 다시 원복)
				url.indexOf(LotteCommon.cartLstUrl) < 0 && // 장바구니 별도 처리
				url.indexOf(LotteCommon.prdviewUrl) < 0 && // 상품상세 별도 처리
				url.indexOf("/product/m/product_view_gucci") < 0 && // 구찌 상품상세
				url.indexOf("/product/m/product_wine_view") < 0 && //  와인 상품상세
				url.indexOf("/product/product_wine_view") < 0) { // 와인 상품상세
				$scope.addWiderPlanetLog("Home"); // 공통일 경우에만 삽입
			}
			
			// 구글 리마케팅 스크립트
			// 적용 기간 : 2017.09.12 ~ 2018.03.11
			var google_conversion_id = 1066415867;  // 애드워즈 계정에 맞는 값
			var axel = Math.random() + "";   // 브라우저 캐시를 막기 위한 난수
			var a = axel * 10000000000000;
			var tags = '<img height="1" width="1" style="border-style:none;display:none" alt="" src="http://googleads.g.doubleclick.net/pagead/viewthroughconversion/'+google_conversion_id+'/?random='+a+'&amp;value=0&amp;guid=ON&amp;script=0"/>';
			angular.element(document.body).append(tags);
			
		}, 3000);
        
        /*
        //오늘하루 보지않기 
        2016.11.04 김응
        ex) 태그 예제
        <div id="pop1" ng-if="showToday.show('pop1')">
            <a ng-click="showToday.check('pop1')">오늘하루 보지않기</a>
        </div>
        */
        $scope.showToday = {
            show : function(id){
                var show_flag = true;
                if(LotteStorage.getLocalStorage("SHOW_TODAY_" + id) == $scope.getTodayDate()){
                    show_flag = false;
                }
                return show_flag;    
            },
            check : function(id){
                LotteStorage.setLocalStorage("SHOW_TODAY_" + id, $scope.getTodayDate());
            }            
        }      
		
		/**
		 * jQuery 애니메이션 이징 설정
		 * 2016.11.25 한상훈
		 */
		function setJQueryEasing(ease, easeFunc){
			if(jQuery.easing[ease] == undefined){
				jQuery.easing[ease] = easeFunc;
			}
		};
		$scope.checkJQueryEasing = function(ease){
			switch(ease){
				case "easeOutQuad":
					setJQueryEasing(ease, function(x, t, b, c, d){ return -c *(t/=d)*(t-2) + b; });
					break;
				
				case "easeInOutCubic":
					setJQueryEasing(ease, function(x, t, b, c, d){ if((t/=d/2) < 1){return c/2*t*t*t + b;}return c/2*((t-=2)*t*t + 2) + b; });
					break;
					
				case "easeOutBack":
					setJQueryEasing(ease, function(x, t, b, c, d, s){ if(s == undefined){ s = 1.70158; } return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b; });
					break;
					
				case "linear":
				case "swing":
					// do nothing
					break;
					
				default:
					ease = "swing";
					break;
			}
			
			return ease;
		};
		
		$scope.specHeadLogoLink = function(title){
			var data = JSON.parse(sessionStorage.getItem("lotteSideCtgData"));
			if (data==undefined || data.ctgAll==undefined || data.ctgAll.length==0){
				return ""
			}
			switch(title){
				case "1200M":
					title="1200m"
					break;
				case "1300K":
					title="1300k"
					break;
				case "와인&스토리 Vine":
					title="Vine"
					break;
				case "WIZWID":
					title="위즈위드"
					break;
				case "10X10":
					title="텐바이텐"
					break;
				case "K샵":
					title="K.shop"
					break;
				case "롯데브랜드관":
					title="롯데 브랜드관"
					break;
				case "House of Samsonite":
					title="쌤소나이트"
					break;
				case "스타일샵":
					return "";
					break;
			}
			var ctgAll = data.ctgAll
			var leng = ctgAll.length;
			var ctg;
			if (window.temprandom==undefined){
				window.temprandom=Math.round(Math.random()*1000000);
			}
			for (var i=0; i<leng; i++){
				ctg = ctgAll[i]
				if (ctg.name=="전문관"){
					var lctgs = ctg.lctgs;
					var sub, link;
					for (var k=0; k<lctgs.length; k++){
						sub=lctgs[k]
						if (sub.name==title){
							link = sub.link
							if (link.indexOf("?")<0){
								link = link+"?"+$scope.baseParam+"&temp="+window.temprandom
							} else{
								link = link+"&"+$scope.baseParam+"&temp="+window.temprandom
							}
							return link
						}
					}
				}
			}
			return "";
		};

		
		/**
		 * @ngdoc function
		 * @name LotteCtrl.sendBuzzni
		 * @description
		 * 버즈니 리타겟팅
		 * @example
		 * $scope.sendBuzzni(type, product);
		 * @param {String} type 리타겟팅 이벤트 타입
		 * @param {String} product 제품의 goods_no 또는 검색이벤트인 경우 키워드
		 */
		$scope.sendBuzzni = function (type, product) {
			var account = "5";
	        var site = "mweb";
	        var user_id = $scope.loginInfo.mbrNo || "";
	        var email = "";
	        var from_hsmoa = commInitData.query['cn'] == "194925" ? true : false;
	        if(window.buzzni_rt){
	            if(location.hostname != 'm.lotte.com')	window.buzzni_rt.setDevelop();
	            if(type == 'list'){
	            	window.buzzni_rt.sendList(account, site, user_id, email, product, from_hsmoa);
	            }else if(type == 'cart'){
	            	window.buzzni_rt.sendBasket(account, site, user_id, email, product, from_hsmoa);
	            }
	        }
		};         
		
		/**
		 * ACE 리타케팅 스크립트
		 * 적용 기간 : 2017.08.01 ~ 2018.01.31
		 * 2017.07.28 고영우
		 */
		function aceRetargeting(){
			if($('#aceRetargeting').length == 0){
				var body = document.getElementsByTagName("body")[0];
				var scr = document.createElement("script");
				scr.type = "text/javascript";
				scr.id = "aceRetargeting";
				scr.src = "//static.tagmanager.toast.com/tag/view/830";
				scr.onload = function(){
					window.ne_tgm_q = window.ne_tgm_q || [];
					window.ne_tgm_q.push(
					{
						tagType: 'visit',
						device:'mobile'/*web, mobile, tablet*/,
						uniqValue:'',
						pageEncoding:'utf-8'
					});
				}
				body.appendChild(scr);
			}
		}
		if(location.href.indexOf(LotteCommon.cartLstUrl) < 0 &&  // 장바구니
				location.href.indexOf(LotteCommon.prdviewUrl) < 0){ // 상품상세 제외
			aceRetargeting();
		}
		
		// 서브헤더 티클릭 함수
		$scope.getHeadTclick = function (str){
			var tclick = $scope.tClickRenewalBase;
			if ($("#main_header").length==0){
				tclick += "subheader_"+str;
			}else{
				tclick += "header_"+str;
			}
			return tclick;
			//return $scope.tClickBase + (($("#main_header").length==0) ? "subheader_" : "header_") + str;
		}
		
		
		/**
		 * 서비스 URL로 이동
		 * @param {String} svc_name - 이동할 서비스 명 (LotteCommon에 정의된 이름)
		 * @param {Object} [param] - 파라메터 오브젝트 (티클릭 등)
		 */
		$scope.gotoService = function(svc_name, param){
			var path = LotteCommon[svc_name];
			if(path == undefined){ return false; }
			
			$scope.gotoURL(path, param);
			/*var div = "?";
			if(path.indexOf(div) >= 0){ div = "&"; }
			
			path += div + $scope.baseParam;
			div = "&";
			
			if(param != undefined){
				var p;
				for(p in param){
					path += div + p + "=" + param[p];
				}
			}
			
			location.href = path;*/
		};
		
		/**
		 * URL로 이동
		 * @param {String} path - 이동할 URL
		 * @param {Object} param - 파라메터 오브젝트 (티클릭 등)
		 */
		$scope.gotoURL = function(path, param){
			if(!$scope.isValidString(path)){ return; }
			
			var div = "?";
			if(path.indexOf(div) >= 0){ div = "&"; }
			
			path += div + $scope.baseParam;
			div = "&";
			
			if(param != undefined){
				var p;
				for(p in param){
					path += div + p + "=" + param[p];
				}
			}
			
			location.href = path;
		};

	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:lotteHeader
	 * @description
	 * header directive
	 * @example
	 * <lotte-header></lotte-header>
	 * 서브 공통 탑 헤더
	 */
	commModule.directive('lotteHeader', [ '$window', '$http', '$location', 'LotteCommon', '$timeout', 'LotteCookie', 'AppDownBnrService', 'LotteStorage', 'commInitData',
		function ($window, $http, $location, LotteCommon, $timeout, LotteCookie, AppDownBnrService, LotteStorage, commInitData) {
		return {
			templateUrl : '/lotte/resources_dev/layout/header_2017.html',
			replace : true,
			link : function($scope, el, attrs) {
				$scope.hideLotteHeaderFlag = false; // 노출 여부
				$scope.stylePushFlag = false;
				$scope.speechSrhFlag = false;
				$scope.showStyleDesc = false;
				$scope.fixedHeader = false;
				$scope.cartCount = 0;
				$scope.headerFixed = true;
				
				// 이전 페이지 링크
				$scope.gotoPrepage = function () {
					$scope.sendTclick("m_RDC_header_new_pre");
					if($scope.appObj.isNativeHeader) {
						appSendBack();
					} else {
						history.go(-1);
					}
				};

				if ($scope.screenID == "main") { // 메인이 아닐 경우에만 노출
					$scope.hideLotteHeaderFlag = true;
				} else {
					// 20160622 박형윤 - 앱다운로드 배너 추가
					$scope.appDownBnrFlag = false;
					$scope.fixedHeader = true;

					// 앱다운로드 배너 상태 값 변경 확인
					$scope.$watch(function () { return AppDownBnrService.appDownBnrInfo.isShowFlag }, function (newValue, oldValue) {
						if (typeof newValue !== 'undefined') {
							$scope.appDownBnrFlag = AppDownBnrService.appDownBnrInfo.isShowFlag;

							if (AppDownBnrService.appDownBnrInfo.isShowFlag) {
								$scope.headerFixed = false;
							}
						}
					});
				}

				// 스타일 추천 안내레이어 쿠키 확인
				// if (!LotteCookie.getCookie("stylePushDesc")) {
				// 	$scope.showStyleDesc = true;
				// }

				// 음성검색 활성화 여부 (버전 변경 필요)
				(function chkSpeechSrh() {
					if (/*LotteCommon.isTestFlag || // LocalTestFlag 체크*/
						($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 259) || // 안드로이드 체크, skt앱 체크(지원x), 버젼체크(2.5.5 이상)
						($scope.appObj.isAndroid && $scope.appObj.isSktApp && $scope.appObj.verNumber >= 203) || // 안드로이드 T롯데닷컴 버전체크 (2.0.3 이상)
						($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.verNumber >= 2550) || // ios 체크, 버젼체크(2.53.0 이상)
						($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.verNumber >= 222) // 아이패드 체크, 버젼체크(2.2.0 이상)
					   ) {
						$scope.speechSrhFlag = true;
					}
				})();

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
					if (!$scope.hideLotteHeaderFlag) {
						var cartCount = LotteCookie.getCookie("cartCount"),
							arrURLExceptions = [
								// LotteCommon.mainUrl, // 메인
								// "/product/m/product_view.do", // 상품상세
								"/mylotte/cart/m/cart_list.do", // 장바구니
								"/login/m/loginForm.do", // 로그인
								"/order/m/order_complete.do" // 주문완료
							];

						if (cartCount && cartCount != "" && sessionChk === true && arrURLExceptions.indexOf(location.pathname + "") == -1 && !commInitData.query.localtest) {
							$scope.cartCount = parseInt(cartCount);
							updateCartCount(parseInt(cartCount));
						} else {
							$http.get(LotteCommon.cartCountData2016)
							.success(function (data) {
								LotteCookie.setCookie("cartCount", data.cart_count);
								$scope.cartCount = data.cart_count;
								updateCartCount(data.cart_count);
							});
						}
					}
				}

				angular.element($window).on({
					"load": function () {
						chkCartCount(true);
					},
					"refreshCartCount": chkCartCount // 카트 카운트 조회 이벤트 등록
				});

				// 메인으로 링크
				$scope.gotoMainHeader = function () {
					//$scope.sendTclick($scope.tClickBase + "header_Clk_Btn_1");
					$scope.gotoMain();
				};

				// 장바구니 이동
				$scope.gotoCart = function () {
                   $window.location.href = LotteCommon.cartLstUrl + '?' + $scope.baseParam + "&tclick=" + $scope.getHeadTclick("cartlist");
                   //$window.location.href = LotteCommon.cartLstUrl + '?' + $scope.baseParam + "&tclick=m_RDC_header_cartlist";
				};

				// 상단 검색 레이어
				$scope.showSrhLayerHeader = function () {
					angular.element('.main_popup').remove();
					$scope.sendTclick($scope.getHeadTclick("Clk_Lyr_1"));
					//$scope.sendTclick($scope.tClickBase + "header_Clk_Lyr_1");
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

				// 스크롤시 헤더 고정
				var $el = angular.element(el),
					headerHeight = $scope.subHeaderHeight;

				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					// console.log(args.scrollPos, AppDownBnrService.appDownBnrInfo.height);
					// args.scrollPos < 0 : iOS Bendding 현상으로 스크롤 포지션 마이너스때 처리
					var chkPos = AppDownBnrService.appDownBnrInfo.isShowFlag ? AppDownBnrService.appDownBnrInfo.height : 0; // 앱다운 배너 활성화 체크

					if (args.scrollPos >= chkPos || (!AppDownBnrService.appDownBnrInfo.isShowFlag && args.scrollPos < 0) || (angular.element("#wrapper").hasClass("hide_appdown_bnr") && args.scrollPos < 0)) {
						$scope.headerFixed = true;
					} else {
						$scope.headerFixed = false;
					}

					$timeout(function () {
						$scope.$apply();
					});
				});

				// 스타일 푸시 안내 레이어 감추기
				// $scope.hideStylePushDesc = function () {
				// 	$scope.showStyleDesc = false;
				// 	LotteCookie.setCookie("stylePushDesc", "hide", 365);
				// };
			}
		}
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:lotteFooter
	 * @description
	 * footer directive
	 * @example
	 * <lotte-footer></lotte-footer>
	 */
	commModule.directive('lotteFooter', ['$window', '$http', 'LotteCommon', 'LotteCookie', 'LotteUtil', function ($window, $http, LotteCommon, LotteCookie, LotteUtil) {
		return {
			templateUrl : '/lotte/resources_dev/layout/footer.html',
			replace : true,
			link : function($scope, el, attrs) {
				$scope.footTxtUrl3 = LotteCommon.cateLstUrl + '?' + $scope.baseParam + '&tclick=' + $scope.tClickBase + "footer_Clk_Lnk_4"; /*장바구니*/
				$scope.footTxtUrl4 = LotteCommon.custcenterUrl + '?' + $scope.baseParam + '&tclick=' + $scope.tClickBase + "footer_Clk_Lnk_5"; /*고객센터*/
				$scope.companyUrl = LotteCommon.companyUrl + '?' + $scope.baseParam + '&tclick='; /*회사소개*/
				$scope.agreeUrl = LotteCommon.agreeUrl + '?' + $scope.baseParam + '&tclick=' + $scope.tClickBase + "footer_Clk_Lnk_10"; /*이용약관*/
				$scope.privacyUrl = LotteCommon.privacyUrl + '?' + $scope.baseParam + '&tclick=' + $scope.tClickBase + "footer_Clk_Lnk_11"; /*개인정보취급방침*/
				$scope.protectYouthUrl = LotteCommon.protectYouthUrl + '?' + $scope.baseParam + '&tclick=' + $scope.tClickBase + "footer_Clk_Lnk_12"; /*청소년보호방침*/

				/*공통 배너 데이터 watch*/
				/*var commBnrWatcher = $scope.$watch('commBnr', function(){
					if($scope.commBnr!=undefined){
						$scope.footBnr = $scope.commBnr.footer[0];
						commBnrWatcher(); 
					}
				});*/
				
				//바로가기 온 체크
				$scope.cookieVisitchk = LotteCookie.getCookie('VISITYN');
				
				// PC버전
				$scope.pcClick = function () {
					$scope.sendTclick($scope.tClickBase + 'footer_Clk_Btn_' + "3");
					var url = 'http://www.lotte.com/main/viewMain.lotte?dpml_no=1&check=N';
					if ($scope.appObj.isApp) {
						openNativePopup('PC버전', url);
					} else if($scope.appObj.isIOS) {
						window.open(url);
					} else {
						window.open(url);
					}
				};
				
				// 회사소개
				$scope.companyClick = function () {
					if ($scope.appObj.isApp) {
						openNativePopup('회사소개', $scope.companyUrl);
					} else {
						window.open($scope.companyUrl);
					}
				};
				
				//사업자정보확인
				$scope.ftcClick = function () {
					$scope.sendTclick($scope.tClickBase + 'footer_Clk_Btn_' + "8");
					
					if ($scope.appObj.isApp) {
						openNativePopup('사업자정보확인', 'http://www.ftc.go.kr/bizCommPop.do?wrkr_no=1018152964');
					} else {
						window.open('http://www.ftc.go.kr/bizCommPop.do?wrkr_no=1018152964');
					}   
				};
				
				// 채무지급보증안내
				$scope.forwardClick = function () {
					$scope.sendTclick($scope.tClickBase + 'footer_Clk_Btn_' + "9");

					if ($scope.appObj.isApp) {
						openNativePopup('채무지급보증안내', 'http://www.lotte.com/main/common/forward.GuaranteeService_pop.lotte');
					} else {
						window.open('http://www.lotte.com/main/common/forward.GuaranteeService_pop.lotte');
					}                   
				};
				
				// 로그인 데이터 watch
				$scope.footTxt_staff = '오류신고'; // 임직원인 경우
				$scope.footLink_staff = LotteCommon.errorAlarmUrl + '?' + $scope.baseParam + "&evt_no=275960&tclick=" + $scope.tClickBase + "footer_Clk_Lnk_2";
				$scope.footTxt_mylotte = '마이롯데'; // 비로그인, 고객인 경우
				$scope.footLink_mylotte = LotteCommon.mylotteUrl + '?' + $scope.baseParam + "&tclick=" + $scope.tClickBase + "footer_Clk_Lnk_1";

				// 앱알림 설정 안내
				$scope.infoAppAlarm = function () {
					$scope.sendTclick($scope.tClickBase + 'footer_Clk_Lnk_' + "13");
					alert('알림(앱Push) 수신 여부는\n하단 [MY > 설정 > 알림설정] 에서\n변경하실 수 있습니다.');
				};

				$scope.srhPromotKeyword = ""; // 검색 홍보 문구(기본 문구와 홍보문구 겹칠시 재로드 되면서 바뀌는 현상 제거) - 요청자 : 검색TFT 전인화, 작업자 : 김낙운
				$scope.srhPromotKeywordUrl = ""; // 검색 홍보 문구 URL
				$scope.srhPromotKeywordTc = ""; // 검색 홍보 문구 티클릭
				
				// 긴급공지 & 검색홍보문구 데이터
				//angular.element($window).on("load", function () { 기본 문구와 홍보문구 겹칠시 재로드 되면서 바뀌는 현상 제거 - 요청자 : 검색TFT 전인화, 작업자 : 김낙운
					try {
						$http.get(LotteCommon.mainNoticeData)
						.success(function (data) {
							$scope.mainNotice = data.notice_list;

							if (data.srh_promot_keyword) { // 검색 홍보문구가 있다면
								$scope.srhPromotKeyword = data.srh_promot_keyword;
							}
							if(data.srh_promot_keyword_url){ // 검색 홍보문구URL이 있다면
								$scope.srhPromotKeywordUrl = data.srh_promot_keyword_url;
							}
							if(data.srh_promot_tclick){ // 검색 홍보문구 티클릭이 있다면
								$scope.srhPromotKeywordTc = data.srh_promot_tclick;
							}
						});
					} catch(e) {
						console.log("Notice Error....");
					}
				//});
				
				// 긴급공지 클릭
				$scope.noticeListUrl = function (bbc_no) {
					$window.location.href = LotteCommon.noticeListUrl + "?" + $scope.baseParam + "&bbc_no=" + bbc_no +"&tclick=m_t_notice";
				};
				
				// footer 바로방문처리
				$scope.vDirectBoxDispYn = false;

				$scope.fnDirectBoxOpen = function () {
					$scope.sendTclick($scope.tClickBase + 'footer_Clk_Btn_' + "13");
					$scope.dimmedOpen({
						target : "directPop",
						callback : this.fnDirectBoxClose
					});
					$scope.vDirectBoxDispYn = true;
				};

				$scope.fnDirectBoxClose = function () {
					$scope.dimmedClose({
						target : "directPop"
					});
					$scope.vDirectBoxDispYn = false;
				};
			}
		}
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:lotteBtntop
	 * @description
	 * top button
	 * @example
	 * <lotte-btntop></lotte-btntop>
	 */
	commModule.directive('lotteBtntop',
						['$window', 'LotteCommon', 'LotteStorage', '$timeout', 'commInitData', 'LotteLink',
	            function ($window,   LotteCommon,   LotteStorage,   $timeout,   commInitData,   LotteLink) {
		return {
			template: '<div class="quick_btn"><div ng-show="visible"><a class="btn_back" ng-click="gotoPrepageSide()" ng-show="quickBackBtn">뒤로</a><a class="btn_top" ng-click="gotoTop()">위로</a></div><div ng-show="isShowBtnTalk" class="btn_talk"><a class="qbta0" ng-click="openTalkBtn()"><img ng-src="http://image.lotte.com/lotte/mo2017/common/talkFloatAni.gif" /></a></div></div>',
			replace: true,
			link: function ($scope, el, attrs) {
				// 스크롤 위치에 따른 btn button visible 처리
				$scope.quickBackBtn = true;
				$scope.isShowBtnTalk = true;

				if ($scope.screenID != undefined) {
					if ($scope.screenID.indexOf("main") == 0) {
						$scope.quickBackBtn = false;
					}
				}

				angular.element($window).on('scroll', function (evt) {
					if (this.pageYOffset > 100) {
						$scope.visible = true;
					} else {
						$scope.visible = false;
					}

					$scope.$apply();
				});

				// 이전 페이지 하다 링크
				$scope.gotoPrepageSide = function () {
					$scope.sendTclick($scope.tClickBase + "subheader_Clk_Btn_1");
					// $scope.sendTclick("m_side_new_pre");
					if($scope.appObj.isNativeHeader) {
						appSendBack();
					} else {
						history.go(-1);
					}
				};

				// 상단으로 스크롤 처리
				$scope.gotoTop = function () {
					angular.element($window).scrollTop(0);
					$scope.sendTclick("m_RDC_main_Clk_Btn_Top");
				};
				
				
				var QB, QBD, QBTA, QBTA1, QBTA2, QBTA3, QBTK;
				
				/**
				 * 톡상담 초기화
				 */
				function startOver(){
					QB 		= angular.element(".quick_btn");
					QBTA	= angular.element(".quick_btn .btn_talk");
					
					// 스크롤 방지
					QB.bind("touchmove", function(e){
						e.preventDefault();
					});
					

					if($scope.appObj.isApp != true && LotteStorage.getSessionStorage("TALK_GATE_hideTicker") !== "Y"){
						QBTK = angular.element('<div class="ticker"><div><span>음성주문</span><span>beta</span><span>오픈</span></div></div>');
						QBTA.append(QBTK);
						$timeout(openTicker, 100);
						$timeout(closeTicker, 5000);
						angular.element(window).bind("scroll", closeTicker);
						LotteStorage.setSessionStorage("TALK_GATE_hideTicker", "Y");
					}
					
					validateAndroidVer();
				};
				
				/**
				 * 톡상담 버튼들 초기화
				 */
				function initTalkBtns(){
					//QBTA	= angular.element(".quick_btn .btn_talk");
					QBTA1	= angular.element('<a class="qbta" id="qbta1"><span>톡상담</span></a>');
					QBTA2	= angular.element('<a class="qbta" id="qbta2"><span>사만다의 톡추천</span></a>');
					QBTA3	= angular.element('<a class="qbta" id="qbta3"><span>음성주문</span></a>');
					QBD		= angular.element('<div class="qbt_dim"></div>');
					
					QBTA.append(QBTA1);
					QBTA.append(QBTA2);
					QBTA.append(QBTA3);
					QB.append(QBD);
					
					QBTA1.bind("click", gotoTalkChat);
					QBTA2.bind("click", gotoTalkRecom);
					QBTA3.bind("click", gotoTalkShop);
					QBD.bind("touchstart", function(e){
						angular.element(".quick_btn").removeClass("open");
						e.preventDefault();
						tsTclick(161);
					});
				};
				
				/**
				 * 톡상담 버튼
				 */
				$scope.openTalkBtn = function(){
					if(QBD == undefined){
						initTalkBtns();
						//$timeout(function(){ QB.toggleClass("open"); }, 10);
						$timeout(openCloseTalkBtn, 10);
					}else{
						//QB.toggleClass("open");
						openCloseTalkBtn();
					}
					closeTicker();
				};
				
				function openCloseTalkBtn(){
					//QB.toggleClass("open");					
					if(QB.hasClass("open")){
						QB.removeClass("open");
						tsTclick(16);
					}else{
						QB.addClass("open");
						tsTclick(15);
					}
				}
				
				/**
				 * 티커 열기
				 */
				function openTicker(){
					QBTK.addClass("open");
				};
				
				/**
				 * 티커 닫기
				 */
				function closeTicker(e){
					if(QBTK == undefined){ return; }
					if(e != undefined && angular.element(window).scrollTop() < 10){ return; }
					
					QBTK.removeClass("open");
					angular.element(window).unbind("scroll", closeTicker);
				};
				
				/**
				 * 톡상담
				 */
				function gotoTalkChat(){
					location.href = LotteCommon.talkUrl + "?" + $scope.baseParam + "&tclick=" + tsTclick(19, true);
				};
				 /**
				  * 톡추천
				  */
				function gotoTalkRecom(){
					var dev_mode = commInitData.query.dev_mode === "Y";
					var needUpdate = false;
					var ao = $scope.appObj;
					var tc = tsTclick(18, true);
					if(ao.isApp){
						// app
						var MBRNO = $scope.loginInfo.mbrNo;
						if(!$scope.isValidString(MBRNO)){
							var path = encodeURIComponent( LotteCommon.talkRecomUrl + "?" + $scope.baseParam );
							$scope.gotoService("loginUrl", {targetUrl : path, tclick : tc});
							return;
						}
						
						if(ao.isIOS){
							if(ao.verNumber < 2830){
								needUpdate = true;
							}
						}else{
							if(ao.verNumber < 294){
								needUpdate = true;
							}
						}
						
						if(needUpdate){
							var msg = "톡추천이 더욱 새로워졌어요!<br/>24시간 이용가능한 톡추천을<br/>앱 업데이트를 통해 만나보세요.";
							var obj = {
								"label" : {
									"ok" : "승인",
									"cancel" : "취소"
								},
								"callback" : function(rtn){
									if(rtn){
										if(ao.isIOS){
											location.href = "http://itunes.apple.com/app/id376622474?mt=8";
										}else{
											location.href = "market://details?id=com.lotte";
										}
									}
								}
							}
							$scope.confirm_2016(msg, obj);
						}else{
							$scope.gotoService("talkRecomUrl", {"tclick" : tc});
						}
						
					}else{
						// web
						var path = LotteCommon["talkRecomUrl"] + "?" + $scope.baseParam;
						LotteLink.appDeepLink("lotte", path, tc, "");
						/*if(dev_mode){
							$scope.alert_2016("스마트 톡추천은<br/>앱에서만 이용가능 합니다.<br/><br/>개발자 모드로 이동", {callback:function(){
								$scope.gotoService("talkRecomUrl", {"tclick" : tc, "dev_mode" : "Y"});
							}});
						}else{
							$scope.alert_2016("스마트 톡추천은<br/>앱에서만 이용가능 합니다.");
							tsTclick(18);
						}*/
					}
				};
				
				/**
				 * 음성주문
				 */
				function gotoTalkShop(){
					var dev_mode = commInitData.query.dev_mode === "Y";
					var needUpdate = false;
					var ao = $scope.appObj;
					var tc = tsTclick(17, true);
					if(ao.isApp){
						// app
						var MBRNO = $scope.loginInfo.mbrNo;
						if(!$scope.isValidString(MBRNO)){
							var path = encodeURIComponent( LotteCommon.talkShopUrl + "?" + $scope.baseParam );
							$scope.gotoService("loginUrl", {targetUrl : path, tclick : tc});
							return;
						}
						
						if(ao.isIOS){
							if(ao.verNumber < 3050){
								needUpdate = true;
							}
						}else{
							if(ao.verNumber < 305){
								needUpdate = true;
							}
						}
						
						if(needUpdate){
							// 음성주문 이전 구버전
							var msg = "음성주문이 더욱 새로워졌어요!<br/>24시간 이용가능한 음성주문을<br/>앱 업데이트를 통해 만나보세요.";
							var obj = {
								"label" : {
									"ok" : "승인",
									"cancel" : "취소"
								},
								"callback" : function(rtn){
									if(rtn){
										if(ao.isIOS){
											location.href = "http://itunes.apple.com/app/id376622474?mt=8";
										}else{
											location.href = "market://details?id=com.lotte";
										}
									}
								}
							}
							$scope.confirm_2016(msg, obj);
						}else{
							//$scope.gotoService("talkShopUrl", {"tclick" : tc});
							// 음성주문 이후 신버전 - 앱에서 마이크 권한체크 후 링크이동
							try{
								if(ao.isIOS){
									location.href = "talkshop://voiceChat_Permission";
								}else{
									window.lottebridge.voiceChat_Permission();
								}
							}catch(e){}
						}
						
					}else{
						// web
						//var path = LotteCommon["talkShopUrl"];
						var path = LotteCommon["mainUrl"];
						LotteLink.appDeepLink("lotte", path, tc, null);
						/*if(dev_mode){
							$scope.alert_2016("음성주문은<br/>앱에서만 이용가능 합니다.<br/><br/>개발자 모드로 이동", {callback:function(){
								$scope.gotoService("talkShopUrl", {tclick : tc, "dev_mode" : "Y"});
							}});
						}else{
							$scope.alert_2016("음성주문은<br/>앱에서만 이용가능 합니다.");
							tsTclick(17);
						}*/
					}
				};
				
				
				function tsTclick(tc, link){
					var tclick = $scope.tClickRenewalBase + "main_Clk_Btn_";
					
					switch(tc){
					case 15:
						tclick += "Custom";
						break;
					case 16:
						tclick += "Custom_Close";
						break;
					case 161:
						tclick += "Custom_dim";
						break;
					case 17:
						tclick += "Custom_gotoVoiceOrder";
						break;
					case 18:
						tclick += "Custom_gotoRecommand";
						break;
					case 19:
						tclick += "Custom_gotoCounsel";
						break;
					}
					
					if(link === true){
						return tclick;
					}else{
						$scope.sendTclick(tclick);
					}
				}
				
				

				/**
				 * 음성쇼핑 불가 안드로이드 OS 구분
				 */
				function validateAndroidVer(){
					if($scope.appObj.isAndroid){
						var vav = LotteStorage.getSessionStorage("TALK_GATE_validAndroidVer");
						if(vav == undefined || vav == ""){
							if($scope.appObj.isApp){
								// APP
								try{
									voiceChat_validAndroidVer( window.lottebridge.voiceChat_validAndroidVer() );
								}catch(e){}
							}else{
								// WEB
								var ua = navigator.userAgent.toLowerCase();
								var match = ua.match(/android\s([0-9\.]*)/);
								var ver = match ? match[1] : 5;
								var vn = parseInt(ver, 10);
								var vav = (vn >= 5) ? "Y" : "N";
								voiceChat_validAndroidVer(vav);
							}
						}else{
							voiceChat_validAndroidVer(vav);
						}
					}
				};
				
				/**
				 * 음성쇼핑 불가 안드로이드 OS 구분 콜백 
				 * @param {String} vav - 음성쇼핑 불가 여부 (Y|N)
				 */
				function voiceChat_validAndroidVer(vav){
					if(vav == undefined){ return; }
					
					LotteStorage.setSessionStorage("TALK_GATE_validAndroidVer", vav);
					if(vav == "N"){
						QBTA.addClass("noTalkShop");
					}
				};
				window.voiceChat_validAndroidVer = voiceChat_validAndroidVer;
				
				
				startOver();

				//톡상담 링크
				//$scope.appObj.isApp = true;
				/*$scope.gotoTalk = function(){
					if($scope.appObj.isApp){
						location.href=LotteCommon.talkIntroUrl + '?' + $scope.baseParam + '&tclick=' + $scope.tClickRenewalBase + 'main_Clk_Btn_Custom01';
					} else {
						location.href=LotteCommon.talkIntroUrl + '?' + $scope.baseParam + '&tclick=' + $scope.tClickRenewalBase + 'main_Clk_Btn_Custom';
					}
				};*/
			}
		}
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:baseCover
	 * @description
	 * dim cover
	 * @example
	 * <base-cover></base-cover>
	 */
	commModule.directive('baseCover', [function () {
		return {
			template : '<section id="dimCover" ng-if="showDimCover"></section>',
			replace : true
		}
	}]);

	/*********************************************************************************************
	 * 서브헤더
	 * 메인헤더 (lotteHeaderMain) 메인
	 * 각 페이지별 별도 헤더 (subHeaderEach) 리스트 (소카, 상품상세, FAQ, 구찌 메인, 구찌 상세, 기획전)
	 * 그외 헤더는 이곳에 있음 (헤더 개선시 참고할 것)
	 ********************************************************************************************/
	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:subHeader
	 * @description
	 * sub header directive
	 * @example
	 * <sub-header></sub-header>
	 * 서브헤더 공통 (이벤트 포함)
	 */
	commModule.directive('subHeader', ['$window', '$timeout', 'AppDownBnrService', function ($window, $timeout, AppDownBnrService) {
		return {
			templateUrl: '/lotte/resources_dev/layout/sub_header_2017.html',
			replace: true,
			link: function ($scope, el, attrs) {
				// 이전 페이지 링크
				$scope.gotoPrepage = function () {
					$scope.sendTclick("m_RDC_header_new_pre");
					if($scope.appObj.isNativeHeader) {
						appSendBack();
					} else {
						history.go(-1);
					}
				};

				$scope.subHeaderFixed = true;

/*
				// 스크롤시 서브헤더 고정
				var $el = angular.element(el).find("header"),
					$headerSpace = angular.element('#subHeaderSpace'),
					headerHeight = $scope.subHeaderHeight;
				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					headerHeight = $scope.subHeaderHeight;
					if ($headerSpace.length == 0) {
						$headerSpace = angular.element('#subHeaderSpace');
					}

					if (args.scrollPos > 0) {
						var top = $el.outerHeight();
						if(!$scope.appObj.isNativeHeader) {
							top = $scope.fixedHeader ? $el.outerHeight()+48:$el.outerHeight();
						}
				 		$headerSpace.css("paddingTop", top);
					} else {
						if(angular.element("#lotteHeader").html() != undefined) {
							$headerSpace.css("paddingTop", $el.outerHeight());
						}
					}

					$timeout(function () {
						$scope.$apply();
					});
				});
				// 앱다운로드 배너 상태 값 변경 확인
				$scope.$watch(function () { return AppDownBnrService.appDownBnrInfo.isShowFlag }, function (newValue, oldValue) {
					if (typeof newValue !== 'undefined') {
						headerHeight = AppDownBnrService.appDownBnrInfo.isShowFlag ? $scope.subHeaderHeight + $scope.subHeaderHeight : $scope.subHeaderHeight;
					}
				});
*/
			}
		}
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:subHeader
	 * @description
	 * sub header directive
	 * @example
	 * <sub-header-search></sub-header-search>
	 * 검색용 서브 헤더
	 */
	commModule.directive('subHeaderSearch', ['$window', '$timeout', function ($window, $timeout) {
		return {
			templateUrl: '/lotte/resources_dev/layout/sub_header_search_2017.html',
			replace: true,
			link: function ($scope, el, attrs) {
				// 이전 페이지 링크
				$scope.gotoPrepage = function () {
					$scope.sendTclick("m_RDC_SrhLayer_Clk_back");
					if($scope.appObj.isNativeHeader) {
						appSendBack();
					} else {
						history.go(-1);
					}
				};

				// 스크롤시 서브헤더 고정
				$scope.subHeaderFixed = false;
				var $headerSpace = angular.element('#headerSpace');

				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					if ($headerSpace.length == 0) {
						$headerSpace = angular.element('#headerSpace');
					}

					if (args.scrollPos > 48) {
						$scope.subHeaderFixed = true;
				 		$headerSpace.css("paddingTop", $scope.subHeaderHeight+"px");
					} else {
						$scope.subHeaderFixed = false;
				 		$headerSpace.css("paddingTop", 0);
					}

					$timeout(function () {
						$scope.$apply();
					});
				});
			}
		}
	}]);
	
	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:sortHeader
	 * @description
	 * header 구분자
	 * @example
	 * <sub-header></sub-header>
	 * 전문관용 헤더
	 */
	commModule.directive('sortHeader', ['$window','$timeout', '$location', 'AppDownBnrService', function ($window, $timeout, $location, AppDownBnrService) {
		return {
			replace:true,
			link:function($scope, el, attrs) {
				var $el = angular.element(el),
					$win = angular.element($window),
					headerHeight = $scope.subHeaderHeight;

				function setHeaderFixed() {
					if ($scope.appObj.isNativeHeader) {
						headerHeight = 0;
					}

					var fixedTopPos = AppDownBnrService.appDownBnrInfo.height + headerHeight + 47;

					if ($win.scrollTop() >= 0) {
						$el.attr("style", "z-index:10;position:fixed;top:" + fixedTopPos +"px;width:100%");
						// $el.parent().css({paddingTop: $el.outerHeight()});
					} else {
						$el.removeAttr("style");
						// $el.parent().css({paddingTop: 0});
					}
				}

				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					setHeaderFixed();
				});

				// 앱다운로드 배너 상태 값 변경 확인
				$scope.$watch(function () { return AppDownBnrService.appDownBnrInfo.isShowFlag }, function (newValue, oldValue) {
					setHeaderFixed();
				});
			}
		};
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:lotteFooterActionbar
	 * @description
	 * actionbar
	 * @example
	 * <lotte-footer-actionbar></lotte-footer-actionbar>
	 */
	commModule.directive('lotteFooterActionbar', ['$http', '$window', '$timeout', 'LotteCommon', 'LotteStorage', function ($http, $window, $timeout, LotteCommon, LotteStorage) {
		return {
			templateUrl: '/lotte/resources_dev/layout/actionbar_2016.html',
			replace: true,
			link: function ($scope, el, attrs) {
				$scope.actionbarHideFlag = false;
				$scope.orderStateFlag = false;

                //웹 액션바 활성화 처리 20160902
                var currentloc = location.href;
                $scope.cur_pageid = 0;
                if(currentloc.indexOf("main_phone.do") > 0){ //메인
                    $scope.cur_pageid = 1;
                }else if(currentloc.indexOf("purchase_list.do") > 0){ //주문배송
                    $scope.cur_pageid = 2;
                }else if(currentloc.indexOf("mylotte.do") > 0){ //마이롯데
                    $scope.cur_pageid = 3;
                }else if(currentloc.indexOf("cart_list.do") > 0){ //장바구니
                    $scope.cur_pageid = 4;
                }
                
                $scope.getOrderState = function() {
        			$http.get(LotteCommon.orderState)
        			.success(function(data) {
        				if(data.data != null) {
        					$scope.orderStateData = data.data;
        					var today = new Date();
        					var orderYMD = data.data.substr(0,4) +"-"+ data.data.substr(4,2) +"-"+ data.data.substr(6,2);
        					var orderHIS = data.data.substr(8,2) +":"+ data.data.substr(10,2) +":"+ data.data.substr(12,2);
        					var orderDay = new Date(orderYMD + " " + orderHIS);
        					var lastOrderCheck = LotteStorage.getLocalStorage('lastOrderCheck');
        					var orderCheck = false;
        					if(lastOrderCheck != null) {
        						var lastOrderCheckDate = new Date(lastOrderCheck);
        						if((lastOrderCheckDate - orderDay) > 0) {
        							orderCheck = true;
        						}
        					}
        					if(parseInt(((today - orderDay)/1000)/60/60) <= 72 && !orderCheck) {
        						$scope.orderStateFlag = true;
        					}
        				}
        			}).error(function(data) {
        				console.log('Error Data : 최근 주문 기록');
        			});
                };
                
                $scope.getOrderState();
                
				// 검색레이어 펼쳐졌을때 actionbar 감추기
				$scope.$watch('showSrh', function (newVal) {
					if (newVal == true) {
						$scope.actionbarHideFlag = true;
					} else {
						$scope.actionbarHideFlag = false;
					}
				});

				// 홈으로 이동
				$scope.gotoMainFooter = function () {
					$scope.gotoMain('footer');
				};

				// 탐색 (좌측 카테고리) 열기
				$scope.showSideCtgFooter = function () {
					if ($scope.appObj.isApp && $scope.appObj.isAndroid) {
						$scope.sendTclick('m_RDC_app_actionbar_category_and');
					} else if ($scope.appObj.isApp && $scope.appObj.isIOS) {
						$scope.sendTclick('m_RDC_app_actionbar_category_ios');
					} else {
						$scope.sendTclick('m_RDC_actionbar_category');
					}

					$scope.showSideCategory();
				};

				// 주문배송 페이지 이동
				$scope.gotoOrderLstFooter = function () {
					var today = new Date();
					
					LotteStorage.setLocalStorage('lastOrderCheck', today);
					$window.location.href = LotteCommon.ordLstUrl + "?" + $scope.baseParam + "&fromPg=3&tclick=m_RDC_actionbar_purchaselist";
				};

				// 마이롯데 페이지 이동
				$scope.gotoMyPageFooter = function () {
					$window.location.href = LotteCommon.mylotteUrl + "?" + $scope.baseParam + "&tclick=m_RDC_actionbar_mylotte";
				};
			}
		}
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:loadingBar
	 * @description
	 * loading bar
	 * @example
	 * <loading-bar></loading-bar>
	 */
	commModule.directive('loadingBar', [function () {
		return {
			template: '<div ly-cover class="ajax_loading" ng-if="isShowLoading"><p class="loading half"></p></div>',
			compile: function (element, attrs) {
				var cover = element[0];

				if (cover.parentNode.classList.contains('wrapBox')) {
					var container = document.querySelector('ul.container'), header = document.querySelector('header#head'), menuOne = document
						.querySelector('nav.main_one'), menuTwo = document.querySelector('nav.main_two'), contentH = window.innerHeight - header.offsetHeight
						- menuOne.offsetHeight - menuTwo.offsetHeight;

					contentH -= 50; // 하단 액션바 세로값
					cover.style.cssText = 'position: relative; width: 100%; min-height: ' + contentH + 'px ';
				}
			}
		}
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:errSrc
	 * @description
	 * 이미지를 못 찾을 경우 대체이미지
	 * @example
	 * <err-src></err-src>
	 */
	commModule.directive('errSrc', [function () {
		return {
			link : function (scope, el, attrs) {
				el.bind('error', function () {
					var noImageSrc = '',
						noImageBaseRootLotte = 'http://image.lotte.com/lotte/images/common/product/no_',
						noImageBaseRootEllotte = 'http://image.lotte.com/ellotte/images/common/product/no_',
						noImageSize = '150';

					if (attrs.errSrc) {
						noImageSize = attrs.errSrc;

						if (window.location.href.indexOf(".ellotte.com") >= 0) {
							noImageSrc= noImageBaseRootEllotte +  noImageSize + ".gif";
						} else {
							noImageSrc= noImageBaseRootLotte + noImageSize + ".gif";
						}	
					}else{
						if (window.location.href.indexOf(".ellotte.com") >= 0) {
							noImageSrc=noImageBaseRootEllotte + "150.gif";
						} else {
							noImageSrc=noImageBaseRootLotte + "150.gif";
						}
					}

					attrs.$set('src', noImageSrc);
				});
			}
		};
	}]);
	
	/**
	 * @ngdoc service
	 * @name lotteComm.factory:commInitData
	 * @description
	 * request param 값 추출 유틸
	 * @require
	 * commInitData
	 * @example
	 * commInitData.query('goods_no');
	 * @param {String} String 쿼리 스트링
	 */
	commModule.factory('commInitData', ['$window', '$location', function ($window, $location) {
		var queries = $window.location.search.replace(/^\?/, '').split('&'), queryObj = [], viewTypeObj;

		// param 초기 세팅
		angular.forEach(queries, function (value) {
			var split = value.split('=');
			queryObj[split[0]] = split[1];
		});

		return {
			query : queryObj
		};
	}]);
	
	/**
	 * @ngdoc service
	 * @name lotteComm.service:AppDownBnrService
	 * @description
	 * AppDownBnrService
	 */
	commModule.service('AppDownBnrService', ['$q', '$location', function ($q, $location) {
		var self = this,
			currentAbsUrl = $location.absUrl() + "",
			pageName = "",
			referrer = "",
			tclick = "",
			appBnrInfo = null;

		this.appDownBnrInfo = {
			isShowFlag: false,
			height: 0,
			pageType: "",
			imgPath: "",
			linkUrl: "",
			bgColor: "",
			referrer: "",
			tclick: ""
		};

		if (currentAbsUrl.indexOf("main_phone.do") > -1 || currentAbsUrl.indexOf("main_2016_dev.html") > -1 || currentAbsUrl.indexOf("main_2017_dev.html") > -1) {
			pageName = "메인";
			referrer = "lotte811111lotte";
			tclick = "m_RDC_header_appdown_Clk_1";
		} else if (currentAbsUrl.indexOf("product/m/product_view.do") > -1 || currentAbsUrl.indexOf("product/m/product_view_dev.html") > -1 || currentAbsUrl.indexOf("product/m/product_view_2017_dev.html") > -1) {
			pageName = "상품상세";
			referrer = "lotte811112lotte";
			tclick = "m_RDC_header_appdown_Clk_2";
		} else if (currentAbsUrl.indexOf("product/m/product_list.do") > -1 || currentAbsUrl.indexOf("product/m/product_list_dev.html") > -1) {
			pageName = "기획전";
			referrer = "lotte811113lotte";
			tclick = "m_RDC_header_appdown_Clk_3";
		} else if (currentAbsUrl.indexOf("planshop/m/planshop_view.do") > -1 || currentAbsUrl.indexOf("planshop/m/planshop_view_dev.html") > -1) {
			pageName = "이벤트";
			referrer = "lotte811114lotte";
			tclick = "m_RDC_header_appdown_Clk_4";
		}

		this.appDownBnrLoadDefer = $q.defer();
		this.appDownSettingDefer = $q.defer();

		this.appDownLoadData = function () { // 앱다운로드 배너 데이터 로드 여부
			return self.appDownBnrLoadDefer.promise;
		};

		this.appDownSettingData = function () { // 앱다운로드 배너 세팅 완료 여부
			return self.appDownSettingDefer.promise;
		};

		this.appDownLoadData().then(function (data) {
			var i = 0;

			for (i; i < data.length; i++) {
				if (data[i].page_type == pageName) {
					if (data[i].img_path) {
						self.appDownBnrInfo.isShowFlag = true;
						self.appDownBnrInfo.pageType = data[i].page_type;
						self.appDownBnrInfo.imgPath = data[i].img_path;
						self.appDownBnrInfo.linkUrl = data[i].link_url;
					}

					if (data[i].bg_color) {
						self.appDownBnrInfo.bgColor = data[i].bg_color;
					} else {
						self.appDownBnrInfo.bgColor = "#05bdc9";
					}

					self.appDownBnrInfo.height = 80; //20171212 55 -> 80;

					self.appDownBnrInfo.referrer = referrer;
					self.appDownBnrInfo.tclick = tclick;

					self.appDownSettingDefer.resolve(self.appDownBnrInfo);
				}
			}
		});
	}]);
    
	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:dungdung
	 * @description
	 * 공통 럭키박스 둥둥이 배너
	 * @example
	 * <dungdung></dungdung>
	 */
	commModule.directive('dungdung', ['$window', '$timeout','$http','LotteLink','commInitData','LotteUserService', function ($window, $timeout, $http, LotteLink,commInitData,LotteUserService) {
		return {
			template: '<div ng-if="flag_dd" style="position:fixed;bottom:150px;right:10px;z-index:100"><img ng-src="http://image.lotte.com/lotte/mo2015/angular/dungdung_banner_20170213.png" style="width:160px;height:175px"><div ng-click="dd_close()" style="width:50%;height:50%;position:absolute;top:0;right:0"></div><div ng-click="dd_reg()" style="width:100%;height:50%;position:absolute;top:50%"></div></div>',
			replace: true,
			link: function ($scope, el, attrs) {
                //둥둥이 배너를 보여줄지 여부 
                $scope.flag_dd = false;
                var THIS_ID = attrs.id;
                //==== 기간별 수정 영역 =====
                var SHOW_START = attrs.start ;//"201611111000";//보여주기 시작
                var SHOW_END = attrs.end ;//"201611120000";//보여주기 끝
                
                if(THIS_ID == undefined){
                    THIS_ID = "dungpop";
                }

                function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
                    return num < 10 ? "0" + num : num + "";
                }
                function getTime(todayDate) { // Timestemp 구하기
                    var Year, Month, Day, Hour, Min, Sec;
                        Year = todayDate.substring(0, 4), // 년
                        Month = todayDate.substring(4, 6), // 월
                        Day = todayDate.substring(6, 8), // 일
                        Hour = todayDate.substring(8, 10), // 시간
                        Min = todayDate.substring(10, 12), // 분
                        Sec = todayDate.substring(12, 14); // 초                    
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
                    todayTime = getTime(todayDate);
                }                
                if(todayTime >= getTime(SHOW_START) && todayTime < getTime(SHOW_END) && $scope.showToday.show(THIS_ID)){
                    LotteUserService.loadLoginInfoComplete.then(function(){
                        $scope.flag_dd = true;
                    });
                }
                
                //럭키박스 신청하기
                $scope.dd_close = function(){
                    $scope.flag_dd = false;
                    $scope.showToday.check(THIS_ID);
                }

                $scope.dd_reg = function(){
                    //console.log("click " + $scope.appObj.isApp +", "+ $scope.loginInfo.isLogin);
                    if($scope.appObj.isApp){						
							if($scope.loginInfo.isLogin){
								 $.ajax({
									type: 'post'
									, async: false                                      
									, url: '/event/regLuckyBox.do'
									, data: ({evt_type : 'new'}) 
									, success: function(data) {
										if(data == "F"){
											alert("죄송합니다. 고객님은 럭키박스 신청 대상이 아닙니다.");
										}else if(data == "S1"){
											//alert("L-money 500점 적립 신청이 완료되었습니다!\n(적립일:11/28(월))");
											alert("L-money 500점 적립 신청이 완료되었습니다!\n적립일은 이벤트 안내 더보기를 확인해주세요.");
										}else if(data == "L2"){
											//alert("e쿠폰 신청이 선착순 마감되어\nL-money 500점 적립 신청이 완료되었습니다!\n(적립일:11/28(월))");
											alert("e쿠폰 신청이 선착순 마감되어\nL-money 500점 적립 신청이 완료되었습니다!\n자세한 내용은 이벤트 페이지를 확인해주세요.");
										}else if(data == "S2"){
											alert("L-money 1000점 적립 신청이 완료되었습니다!\n자세한 내용은 이벤트 페이지를 확인해주세요.");

										}else if(data == "D1"){
											alert("고객님은 이미 신청하셨습니다.");
										}else if(data == "D2"){
											alert("고객님은 이미 신청하셨습니다.");
										}
										//location.href = "/event/luckyBox.do?" +  $scope.baseParam;
									}
								 });
							}else{ //로그아웃이면
								 if(confirm('로그인 후 참여하실 수 있습니다.')){
									var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
									location.href = '/login/m/loginForm.do?' + targUrl;
								 }
							}  
					
                    }else{//앱이아니면
                        LotteLink.appDeepLink("lotte", "/event/luckyBox.do?" +  $scope.baseParam, null, null); // 앱 딥링크 params : lotte/ellotte, 딥링크URL (없을 경우 default 현재 URL, tclick, referrer)
                    }
                }
			}
		}
	}]);    
    
	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:rollSwipeBanner
	 * @description
	 * 무한롤링 스와이프 배너
	 * @example
     20170111 : 아직 시험 테스트중인 모듈임. 
     rolling : 무한롤링 여부 true, false
     interval :  자동롤링 시킬때 추가, 값은 자동롤링 간격 
     itemMargin : ][][ 형태로 표현할때에 등록
     endfnc : 스와이프가 끝났을때 호출할 함수등록
     getcontrol : 외부에서 제어하기 위한 제어객체를 얻기 위한 함수 등록
        <div roll-swipe-banner id="roll1" rolling="true" interval="3000" width320="1" width640="2" width900="3" info="aboutData.big_plan_bnr.items" endfnc="setInfo" getcontrol="getControl1">
           <ul class="swipeBox">
                <li ng-repeat="item in aboutData.big_plan_bnr.items">
                
                </li>
            </ul>
            <ul class="indicator">
                <li ng-repeat="indicator in aboutData.big_plan_bnr.items"><span>{{$index}}</span></li>
            </ul>
        </div>       
        스크립트 예제
        //외부에서 호출하는 함수
        $scope.setInfo = function(id){                    
            console.log(id);
        }
        //외부에서 호출하는 함수
        $scope.getControl1 = function(control){
            $scope.control = control;
        }        
        control  객체는 하단의 소스의 control 객체 참조
     */
    commModule.directive('rollSwipeBanner', ['$timeout','$window', function($timeout,$window) {
        return {            
            scope : {
                listinfo : '=info',
                endfnc : '=endfnc',
                controlfnc : "=getcontrol"
            },
            link : function($scope, el, attr){
                console.log('EGSwipe set ---');

                var itemMargin = attr.itemMargin;
                var box = angular.element(el);
                if(itemMargin)	box.css("width", box.width() - (itemMargin*2) + "px");
                var prvx = -1,DOWNPOS,OPOS = 0,target = box.find(".swipeBox"),DOWNY,DOWNX,dragDist = 0,dragDir = 2,childTotal=1,$win=angular.element($window),autoRolling = false, moving = false, tween = false, 
                myid=attr.id,tx = 0,downTime,rolling=attr.rolling,wwd = box.width(),w320 = attr.width320,w640 = attr.width640,w900 = attr.width900,bindex = 0,len,startIndex=0,startBindex=0,lastBindex=0,nowBindex=0,resize=false,interval = attr.interval;
                $(document.body).attr("ondragstart","return false");$(document.body).attr("onselectstart","return false");
                target.hide();
                $win.on("resize.egswip", function() {if(wwd != box.width())setSize(0);resize=true;});  
                if(interval != undefined){
                    interval = parseInt(interval);
                    autoRolling = true;
                }
                if(rolling == undefined || rolling != "true"){
                    rolling = false;
                }else{
                    rolling = true;
                }
                myid = "#" + myid;
                
                if(autoRolling && (!attr.itemCnt || (attr.itemCnt && attr.itemCnt > 1))) {
                    //자동롤링 
                    $timeout(function(){
                        if(rolling){
                            $scope.autoRollFlag = true;
                            var IntervalID = setInterval(function(){     
                                if($(myid).length == 0){ //대상이 존재하지 않으면
                                    clearInterval(IntervalID);
                                }
                                //console.log($scope.autoRollFlag, bindex);
                                if($scope.autoRollFlag){
                                    bindex += 1;
                                    setTxTween(-bindex*wwd);                        
                                    setIndicator();                            
                                }
                            }, interval);                            
                        }
                    }, interval);
                }
                function setSize(time){ //초기화              
                    bindex = startIndex = startBindex = lastBindex = 0;
                    $timeout(function(){

                        /**
                         * 박해원
                         * 20171113 1개일때 스와이프 미적용 옵션 추가 (oneNoSwipe)
                         * @type {boolean}
                         */
                        var oneSwipeNo = attr.oneNoSwipe == "true" ? true : false;
                        try{
                            if( oneSwipeNo && target.find('li').length < 2 ) {
                                target.unbind("touchstart.eg touchmove.eg touchend.eg");
                                console.log( 'unbind swipe' );
                                target.show();
                                return;
                            }
                        } catch(e){} //end 20171113

                        var scrWid = $win.width();                        
                        if(scrWid < 640){
                            childTotal = w320;
                        }else if(scrWid < 900 && scrWid >= 640){
                            childTotal = w640;
                        }else{
                            childTotal = w900;
                        }                        
                        (childTotal == undefined || childTotal == '') ? childTotal = 1 : childTotal = parseInt(childTotal);
                        angular.element(myid).find("li.dummy").remove();
                        if($scope.listinfo != undefined){
                            len = $scope.listinfo.length;
                        }else{
                            len = target.find("li").length;
                        }
                        //1개 이상의 그룹인 경우 나머지 배너는 안보이게 처리한다.
                        var others = len%childTotal;
                        var kk = 0;
                        if(others != 0 && childTotal > 1){
                            for(var kk=1; kk <= others; kk++){
                                box.find("li").eq(len-kk).hide();
                            }
                            len = len - others;
                        }else{
                            box.find("li").show();
                        }                        

                        if(len == 0 && $(myid).length > 0){
                            $timeout(function(){
                                setSize(200);
                            }, 50);
                        }else{

                            //무한롤링  
                            if(rolling){                                             
                                var $li = target.find("li");
                                var $dummy = [], $dummy2 = [];                            
                                for(var i = 1; i <= childTotal; i++){                                
                                    $dummy.push($li.eq(len - i).clone().addClass("dummy"));
                                    $dummy2.push($li.eq(i - 1).clone().addClass("dummy"));
                                }
                                for(var i = 0; i < childTotal; i++){                                
                                    target.append($dummy2[i]);
                                    $li.eq(0).before($dummy[$dummy.length - 1 - i]);                                
                                }
                                startIndex = childTotal;   
                                startBindex = 1;
                                lastBindex = parseInt(len/childTotal) + startBindex - 1;
                                len = target.find("li").length; //가공한 이후의 길이
                            }                        
                            wwd = box.width();
                            target.css({
                                "width" : (101 * parseInt(len/childTotal)) + "%","-webkit-transition-property" : "transform","transition-property" : "transform","display":"table"
							});

							var listCssObj = {
                                "width" : wwd/childTotal + "px","backfaceVisibility" : "hidden","float" : "left"
							};

							if (attr.fixedHeight) {
								listCssObj.height = wwd/childTotal + "px";
							}
							
							target.find("li").css(listCssObj);
							                           
                            if (!resize) {
	                            bindex = startBindex;
	                            setTx(-startBindex*wwd); 
                            }else{
	                            bindex = nowBindex;
	                            setTx(-nowBindex*wwd); 
                            }
                            setIndicator();                        
                        }
                        if($scope.controlfnc != undefined){ //외부에 제어함수를 넘김
                            $scope.controlfnc(control);
                        }
                    }, time);
                }
                setSize(200);

				if(!attr.itemCnt || (attr.itemCnt && attr.itemCnt > 1)) {
					target.on({"touchstart.eg" : mDown,"touchmove.eg" : mMove,"touchend.eg" : mUp});
				}
				function setIndicator(){
                    var indicator = box.find(".indicator");
                    if(indicator != undefined){                        
                        box.find(".indicator > li").removeClass("on");
                        box.find(".indicator > li").eq(bindex - startBindex).addClass("on");                        
                        if(childTotal > 0){
                            var showmax = parseInt(len/childTotal) - 1 - startBindex*2;
                            for(var i=0; i<len; i++){
                                (i > showmax)? box.find(".indicator > li").eq(i).hide() : box.find(".indicator > li").eq(i).show();                                
                            }                            
                        }
                    }                    
                }
                function mUp(e){
                    if(!tween){
                        if(Math.abs(dragDist) > 20){
                            if(dragDist > 0){
                                dragDir = 1;
                                bindex -= 1;
                            }else{
                                dragDir = 0;
                                bindex += 1;
                            }
                        }else{
                            dragDir = 2;
                        }
                        if(childTotal > 1 && bindex > parseInt(len/childTotal)-1){                        
                            bindex = parseInt(len/childTotal)-1;
                        }
                        var rightSide = wwd - target.width();
                        var tmpx = -bindex * wwd;                    
                        if(tmpx > 0){
                            setTxTween(0);
                            bindex = 0;
                        }else if(tmpx < rightSide){                        
                            setTxTween(rightSide);                        
                            bindex = len - 1;
                        }else{
                            setTxTween(tmpx);
                        }
                        setIndicator();
                        if(autoRolling){                        
                            $timeout(function(){                            
                                if(!moving){
                                    $scope.autoRollFlag = true;                                    
                                }
                            },6000);
                        }
                        
                    }
                }	                    
                function mDown(e){
                    e.stopPropagation(); // 이벤트 하위로 전파 방지
                    moving = true;                    
                    if(!tween){                        
                        downTime = new Date().getMilliseconds();
                        dragDist = 0;
                        var point = e.originalEvent.touches[0];		
                        OPOS = tx;
                        DOWNPOS = point.clientX - OPOS;
                        DOWNY = point.clientY;
                        DOWNX = point.clientX;
                        prvx = 0;                    
                    }
                }
                function mMove(e){            
                    $scope.autoRollFlag = false;
                    if(!tween){
                        var point = e.originalEvent.touches[0];
                        if(Math.abs(point.clientY - DOWNY) < Math.abs(point.clientX - DOWNX)){
                            e.preventDefault();	
                            dragDist = point.clientX - DOWNX;
                            prvx = OPOS - tx;
                            tx = point.clientX - DOWNPOS;
                            setTx(tx);
                        }
                    }
                }
                function setTxTween(val){
                    //$(document.body).css("pointer-events", "none");
                    tween = true;
                    resize = true;                 
                    var time = 300;                    
                    if(childTotal > 1){ //pad 에서는 약간 느리게 
                        time = 600;
                    }
                    $(target).css("-webkit-transition-duration", time + "ms");
                    $(target).css("transition-duration", time + "ms");
                                            
                    setTx(val);
                    $timeout(function(){                        
                        //$(document.body).css("pointer-events", "auto");            
                        $(target).css("-webkit-transition-duration", "0ms");
                        $(target).css("transition-duration", "0ms");
                        //console.log(bindex*childTotal, lastIndex);
                        if(rolling){ //무한롤링이면
                            if(val == 0){
                                bindex = lastBindex;
                                setTx(-lastBindex*wwd);
                            }else if(bindex > lastBindex){
                                bindex = startBindex;
                                setTx(-wwd);
                            }
                            setIndicator();
                        }
                        nowBindex = bindex;
                        
                        if($scope.endfnc != undefined){
                            $scope.endfnc(bindex - startIndex);
                        }
                        moving = false; //움직임종료
                        tween = false; //트위닝종료
                    }, time);                    
                }
                function setTx(val){ 
                    $(target).css("-webkit-transform","translate3d(" + val + "px, 0, 0)");
                    $(target).css("transform","translate3d(" + val + "px, 0, 0)");
                    tx = val;
                }
                var control = {
                    getIndex : function(){
                       return bindex - startIndex; 
                    },
                    setIndex : function(index){
                        bindex = index + startIndex;
                        setTx(-bindex*wwd);                           
                        setIndicator();
                    },
                    moveIndex : function(index){
                        bindex = index + startIndex;
                        setTxTween(-bindex*wwd);                           
                        setIndicator();
                    },
                    init : function(){
                        setSize(0);
                    }
                }
            }
        };
    }]);
    
    /**
     * 일반 링크 3D터치 대응
     */
    commModule.directive('ngLink3dTouch', ["commInitData", "$timeout", function(commInitData, $timeout){
		return {
			restrict: 'A',
			link: function($scope, element, attrs) {

				/**
				 * 링크 3D터치 대응 초기화
				 */
				function initElement(){
					var url = element.attr("href");
					
					if(url == undefined){ return; }
					if(url.indexOf("#") == 0){
						element.removeAttr("href");
						return;
					}

					element.attr("href", $scope.getURLQualified(url, true));
					element.bind("click", linkClickListener)
				};
				
				/**
				 * 링크 클릭 이벤트
				 */
				function linkClickListener(e){
					$scope.gotoLinkTarget(e);
					return false;
				};
				$timeout(initElement, 1);//ng-href 대응
			}
		};
	}]);
    
	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:keepPopup
	 * @description
	 * 외부연동 3가지 타입 팝업
	 * @example
	 * <keep-popup></keep-popup>
	 */
	commModule.directive('keepPopup', ['$compile','$window','LotteStorage','$http','LotteCommon','LotteCookie','popupOpenTimer','commInitData',
		function ($compile, $window,LotteStorage,$http,LotteCommon,LotteCookie, popupOpenTimer, commInitData) {
		return {
			templateUrl : '/lotte/resources_dev/layer/keep_popup.html',
			replace : true,
			link : function($scope, el, attrs) {
                $scope.pop_type = 0;
                $scope.recoNum; //레코벨 번호
				$scope.recoGoodsNoArray = []; //최근 본 상품 + 레코벨 데이터
				$scope.popLatelyGoods_no; //최근 본 상품 번호
                $scope.logrecom_type_view_jsonp = function (data,reset) {
                    var guestArr = new String();
					if(!reset){
						for (var i = 0; i < data.items.length; i++) {
							if (i > 0) {
								guestArr += ",";
							}
							guestArr += data.items[i];
                    	}
					}else{
						for (var i = 0; i < data.length; i++) {
							if (i > 0) {
								guestArr += ",";
							}
							guestArr += data[i];
						}
					}
                    return guestArr;
                };

                $scope.show_keepPop = function(typeNo){
					var keepPopLatelyGoods;
					if(typeNo == 1){ 
						keepPopLatelyGoods = LotteStorage.getLocalStorage('latelyGoods');
						if(keepPopLatelyGoods){
							var popLatelyGoodsArry = keepPopLatelyGoods.split('|'),
								latelyIdx = popLatelyGoodsArry.length -1;
							$scope.popLatelyGoods_no = popLatelyGoodsArry[latelyIdx];
						}
						
                        //레코벨데이타 조회
                        var r_goods_no = $scope.popLatelyGoods_no;// 최근 본 상품
						var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/a002?size=10&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+r_goods_no;
                        $.ajax({
                                type: 'post'
                                , async: true
                                , url: viewSaleBestLink
                                , dataType  : "jsonp"
                                , success: function(data) {
                                	// console.log('data',data);
									var v_guestArr = new Array();
                                    //레코벨 데이타가 있는 경우에만 조회
                                    if(keepPopLatelyGoods && data.results != null && data.results.length > 0){
										$(data.results).each(function(i, val) {
											v_guestArr.push(val.itemId);
										});
										$scope.recoNum = $scope.logrecom_type_view_jsonp({"items" : v_guestArr},false); 
										$scope.keepLoadData(typeNo); // 로드 함수
                                    }else{
                                        //팝업을 띄우지 않음
                                        $scope.pop_type = 0;
                                    }
                                }
                                , error: function(data, status, err) {
									console.log(err);
                                }
                        });
                    }else{
						$scope.keepLoadData(typeNo);
                    }
                    //화면갱신용
                    angular.element($window).scrollTop(angular.element($window).scrollTop() + 1);
                };
				$scope.keepLoadData = function(typeNo){
					$scope.recoGoodsNo = null;

					var type_str = ["", "product", "planshop", "banner"];
					if(typeNo == 1){
						$scope.recoGoodsNoArray= [$scope.popLatelyGoods_no,$scope.recoNum];
						$scope.recoGoodsNo = $scope.logrecom_type_view_jsonp ($scope.recoGoodsNoArray,true);
					}
					$scope.typeStr = type_str[typeNo];
					$scope.pop_type = typeNo;

					var	httpConfig = {
							method: "get",
							url: LotteCommon.keepPopData,
							params: {
								goods_nos : $scope.recoGoodsNo,
								type : $scope.typeStr,

							}
						};

					$http(httpConfig) // 실제 탭 데이터 호출
					.success(function (data) {
						$scope.keepPopBaseData = data.keep_stay;
						$scope.keepPopData();
					});
				};
				$scope.keepPopData = function(){
					if($scope.keepPopBaseData.coupon){
						$scope.keepCoupon = $scope.keepPopBaseData.coupon;
					}
					if($scope.keepPopBaseData.prd_list && $scope.keepPopBaseData.prd_list.items){
						$scope.keepPrdList = $scope.keepPopBaseData.prd_list.items;
					}
					if($scope.keepPopBaseData.spdp_list  && $scope.keepPopBaseData.spdp_list.items){
						$scope.keepSpdpList = $scope.keepPopBaseData.spdp_list.items;
					}
					if($scope.keepPopBaseData.add_banner){
						$scope.keepAddBanner = $scope.keepPopBaseData.add_banner;
					}
				};
					
				$scope.keepLinkUrl = function(obj,typeNm,tclick){
					switch (typeNm) {
						case 'planList': 
							window.location.href =	LotteCommon.prdlstUrl +'?'+ $scope.baseParam + '&curDispNo=' + obj + '&tclick=' + tclick ;
							break;
						case 'prdList':
							window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + obj + '&tclick=' + tclick ;
							break;
						case 'baseLink' :
							window.location.href = $scope.baseLink(obj) + '&tclick=' + tclick ;
							break;
						case 'couponDown' :
							if(loginChk()){ 
								var url = "/event/regNewCoupon.do?"; 
								var params = "cpn_issu_no="+obj; 
								$.post(url, params, function(data){ 
									$('#msg').html(data).show();
                                    $scope.keepPopClose(true); // 20171129 박해원 [ 다운로드 후 팝업 닫기 ]
								}); 
								$scope.sendTclick(tclick);
							}else{ 
								if(confirm('로그인 후 다운로드 받을 수 있습니다.')){
									// 비로그인 상태 로그인 페이지로 이동시에는 쿠키삭제 ( 20171121 박해원 popup/prevent.js )
                                    popupOpenTimer.setCookie("blockingLeavePopup",'0',-1);
									goLogin(); 
								} 
							} 
						break;
					}
				};
						
				$scope.keepPopClose =function(trigger){
					$scope.pop_type = 0;
					$scope.sendTclick('m_DC_PausePop_clk_Btn02');
					angular.element($window).scrollTop(angular.element($window).scrollTop() - 1);
					// 쿠키저장 ( 20171121 박해원 popup/prevent.js )
					if(!trigger) popupOpenTimer.setCookie("blockingLeavePopup",'3',3);
				};

            }
		}
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:assentLayer
	 * @description
	 * assent layer
	 * @example
	 * <assent-layer></assent-layer>
	 */
	
	commModule.directive('assentLayer', ['$window','LotteStorage','$http','LotteCommon','LotteCookie', function ($window,LotteStorage,$http,LotteCommon,LotteCookie) {
		return {
			templateUrl: '/lotte/resources_dev/layer/assent_layer.html',
			replace : true,
			link : function($scope, el, attrs) {
				 $scope.assentShow = false;	// 팝업 레이어 show/hide
				
				 $scope.assentTab = function(flag){
					$scope.index = flag;
					
					var path = "";
					switch(flag){
					case 0:
						  path = LotteCommon.clauseECommerce;
						  break;
					case 1:
						  path = LotteCommon.clausePIUse;
						  break;
					case 2:
						  path = LotteCommon.clausePIConsign;
						  break;
					default:
						  return;
						  break;
					}
					angular.element("#clauseHolder").scrollTop(0);
					angular.element("#clauseHolder").load(path + " .clause_wrap");

					if(!$scope.assentShow){
						$scope.assentShow = true;
						$("#cover").show();
					}
				 };
				$scope.closePop = function(){

					if($scope.subTitle == "주문배송조회 상세"){
						$("#cover").css("z-index",110);
					}else{
						$("#cover").hide();
					}
					$scope.assentShow = false;
				}	
				
			}
		}
	}]);


})(window, window.angular);

//연동 팝업 열기 
function openKeepPop(type){
	console.log('pType',type);
    getScope().show_keepPop(type);
}                                        
//모바일상품권 구매 대상 제어 20170223
function pticketCheck(gubun, goods_no_list, callbackFnc){
    $.ajax({
        type: 'post',
        dataType:'json',
        async: false,
        url: '/json/order/getPticketCheck.json',
        data: ({goods_no_list : goods_no_list}), 
        success:function(data) {
            var pticket_yn = data.pticket_yn;
            if(pticket_yn == "Y"){
                //gubun : 0 팝업, 1 alert
                if(gubun == 0){
                    var tag = '<div class=pop_giftcertificate><div class=bg></div><div class=box><h2>상품권 구매 안내</h2><div class=cont><p>이용에 불편을 드려 죄송합니다.<p>상품권은 본인확인을 통해 가입하신<br>L.POINT 정회원만 구매가 가능합니다.<p>롯데닷컴은 건전한 상품권 거래 문화의<br>정착을 위해 노력하고 있습니다.<br>고객님의 너그러운 양해 부탁드립니다.<p class=mem_join_go><a href=javascript:outLink("https://member.lpoint.com/door/user/login_common.jsp?sid=DOTCOM")>L.POINT 통합회원 가입하러 가기</a><p>(아직 로그인을 하지 않으셨다면,<br />화면 하단의 로그인을 하시면 구매가능합니다.)</div><div class=foot><a href=javascript:$(".pop_giftcertificate").remove()>닫기</a></div></div></div>';
                    $("body").append(tag);
                }else{
                    alert("죄송합니다.\n'상품권'은 본인확인이 가능한 \nLPOINT 정회원만 구매하실 수 있습니다.\n롯데닷컴은 안전한 상품권 거래 문화를\n만들기 위해 최선을 다하고 있습니다.");                    
                }             
                callbackFnc(true);
            }else{
                callbackFnc(false);
            }
        },
        error:function(request, status) {
            console.log("pticketCheck error");
            callbackFnc(false);
        }
    });                        
}
function outLink(url){ //일반아웃링크    
    if (appObj2.isApp) {
        var uri = url.replace(/http\:\/\/|https\:\/\//gi, "");
        if (appObj2.isIOS) {
            if (url.match("https://")) {
                window.location.href = "family://" + uri;
            } else {
                window.location.href = "lecsplatform://" + encodeURIComponent(uri);
            }
        } else if (appObj2.isAndroid) {
            window.lecsplatform.callAndroid(encodeURIComponent(url));
        }
    } else {
        var linkURL = url + "";
        if (!linkURL.match(/http|https/gi)) {
            linkURL = "http://" + linkURL;
        }
        window.open(linkURL);
    }
}
