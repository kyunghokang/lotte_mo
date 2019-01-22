var commModule = {};
var mainApp = {};
var loginInfo = {};

(function (window, angular, undefined) {
	'use strict';

	/**
	 * @ngdoc overview
	 * @name lotteComm
	 * @description 
	 * lotte_comm.js<br/>
	 * 공통 모듈
	 */
	commModule = angular.module('lotteComm', ['ngSanitize', 'lotteUtil', 'lotteFilter', 'lotteUrl', 'LotteLog']);

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
	commModule.service('LotteUserService', ['$http', '$timeout', '$q', '$log', 'LotteCommon', '$sessionStorage', 'commInitData', 'LotteStorage', 
		function($http, $timeout, $q, $log, LotteCommon, $sessionStorage, commInitData, LotteStorage) {
		var self = this;

		var logger = $log.getLogger('LotteUserService');
		logger.debug("start");
		
		var loginCheck = {
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
			return loginCheck;
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
			var log = logger.getChildLogger("retriveLoginInfo");
			log.debug("start");
			
			var deferred = $q.defer(); 

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
					deferred.reject(response, status, headers, config);
				});
			} catch (e) {
				log.error(e.message, e);
			}
			
			log.debug("end");
			return deferred.promise;
		};

		/**
		 * 최근본 상품 관련 최대 담을수 있는 갯수 조정 
		 */
		this.checkViewGoods = function () {
			var storageViewGoods = localStorage.getItem('viewGoods');
			var scope = angular.element('html').scope();
			var storageViewGoodsArr = [];
			var newStorageViewGoodsObj = {};
			var newStorageViewGoods = "";
			var userGoodsDataInsert = false;

			if (storageViewGoods != null) {
				storageViewGoodsArr = storageViewGoods.split("|");

				if (scope.loginInfo.isLogin) {
					newStorageViewGoodsObj[scope.loginInfo.mbrNo] = [];
				}

				newStorageViewGoodsObj['guest'] = [];
				
				for (var i = 0; i < storageViewGoodsArr.length; i++) {
					var tmp = storageViewGoodsArr[i].split("^");

					if (tmp[0] == "guest") {
						newStorageViewGoodsObj['guest'].push(storageViewGoodsArr[i]);
					} else if (scope.loginInfo.isLogin) {
						if(scope.loginInfo.mbrNo == tmp[0]) {
							if(newStorageViewGoodsObj[scope.loginInfo.mbrNo].indexOf(storageViewGoodsArr[i]) == -1) {
								newStorageViewGoodsObj[scope.loginInfo.mbrNo].push(storageViewGoodsArr[i]);
							}
						}
					} else {
						if (!userGoodsDataInsert) {
							if (newStorageViewGoodsObj[tmp[0]] == undefined) {
								newStorageViewGoodsObj[tmp[0]] = [];
							}

							if (newStorageViewGoodsObj[tmp[0]].indexOf(storageViewGoodsArr[i]) == -1) {
								newStorageViewGoodsObj[tmp[0]].push(storageViewGoodsArr[i]);
							}

							userGoodsDataInsert = true;
						} else if (newStorageViewGoodsObj[tmp[0]] != undefined) {
							if (newStorageViewGoodsObj[tmp[0]].indexOf(storageViewGoodsArr[i]) == -1) {
								newStorageViewGoodsObj[tmp[0]].push(storageViewGoodsArr[i]);
							}
						}
					}
				}

				angular.forEach(newStorageViewGoodsObj, function (val, key) {
					if (val.length > 20) {
						val.splice(0, (val.length-20));
					}

					if (newStorageViewGoods != "") {
						newStorageViewGoods += "|";
					}

					newStorageViewGoods += val.join("|");
				});

				localStorage.setItem('viewGoods', newStorageViewGoods);
			}
		};

		/**
		 * @ngdoc function
		 * @name LotteUserService.getLoginInfo
		 * @description
		 * 로그인 체크 : 로그인한 경우 필수 정보를 sessionStorage에 담고 session 내에서는 sessionStorage에 저장된 data를 return한다.
		 * 호출 url : /json/cn/login_check.json
		 */
		this.getLoginInfo = function () {
			var log = logger.getChildLogger("retriveLoginInfo");
			log.debug("start");
			
			try {
				var cookie_loginchk = this.getCookie("MBRNO");
				var storage_loginchk = $sessionStorage.LotteUserService_loginCheck;
				var scope = angular.element('html').scope();
				
				//쿠키값이 없으면 로그인하지 않은 사용자이므로 default login 객체 return
				/* 로그인 테스트 - 로컬 테스트시 주석 처리 필요 */
				/**/
				if (!cookie_loginchk) {
					if (storage_loginchk) {
						// sessionStorage에 데이터가 존재하는 경우 clear
						delete $sessionStorage.LotteUserService_loginCheck;
					}

					this.checkViewGoods();
					return loginCheck;
				}
				/**/
				
				if (commInitData.query['adultChk'] != "Y") {
					if ($sessionStorage.LotteUserService_loginCheck) {	            	
						scope.loginInfo = $sessionStorage.LotteUserService_loginCheck;
						isLogin = scope.loginInfo.isLogin;
						this.checkViewGoods();
						return $sessionStorage.LotteUserService_loginCheck;
					}
				}

				this.retriveLoginInfo().then(function (response) {
					if (response.HasError) {
						//log.error("user 정보 조회중 에러발생:", response);
						//this.checkViewGoods();
						self.checkViewGoods();
						return loginCheck;
					} else {
						//log.info("user 정보 조회 완료:", response);
						$sessionStorage.LotteUserService_loginCheck = response.loginCheck;
						LotteStorage.setLocalStorage("userName", response.loginCheck.name);

						scope.loginInfo = response.loginCheck;
						isLogin = scope.loginInfo.isLogin;
						// this.checkViewGoods();
						self.checkViewGoods();
						return response.loginCheck;
					}
				}).catch(function (response) {
					//log.error("user 정보 조회중 에러발생:", response);
					return loginCheck;
				});
			} catch (e) {
				log.error(e.message, e);
			}

			this.checkViewGoods();
			return loginInfo;
			log.debug("end");
		};
		
		/**
		 * @ngdoc function
		 * @name LotteUserService.setSessionStorage
		 * @description
		 * /json/cn/login_check.json을 수행한 후 login 정보를 sessionStorage에 저장하고 callback 실행 
		 */
		this.setSessionStorage = function (callback) {
			var log = logger.getChildLogger("retriveLoginInfo");
			log.debug("start");
			
			this.retriveLoginInfo()
			.then(function (response) {
				if (response.HasError) {
					log.error("user 정보 조회 중 에러 발생", response);
				} else {
					$sessionStorage.LotteUserService_loginCheck = response.loginCheck;
				}

				callback.apply(null, []);
			})
			.catch(function(response) {
				log.error("user 정보 조회 중 에러 발생", response);
			});
		};
		
		logger.debug("end");
	}]);

	/**
	 * @ngdoc object
	 * @name lotteComm.controller:LotteCtrl
	 * @requires  
	 * $scope, $parse, $location, $window, $document, $http, $compile,$timeout, LotteUtil, LotteLink, commInitData, LotteCommon, LotteUserService, LotteForm, LotteStorage
	 * @description
	 * 공통 컨트롤러 
	 */
	commModule.controller('LotteCtrl', ['$scope', '$parse', '$location', '$window', '$document', '$http', '$compile', '$timeout', 'LotteUtil', 'LotteLink', 'commInitData', 'LotteCommon', 'LotteUserService', 'LotteForm', 'LotteStorage',
		function($scope, $parse, $location, $window, $document, $http, $compile,$timeout, LotteUtil, LotteLink, commInitData, LotteCommon, LotteUserService, LotteForm, LotteStorage) {
		$scope.loginInfo = LotteUserService.getLoginObj();
		LotteUserService.getLoginInfo();
		
		/**
		 * History back 체크 루틴
		 */
		$scope.locationHistoryBack = false;
		var lotteMobileHistory = LotteStorage.getSessionStorage("LotteMobileHistory", 'json');
	
		if (lotteMobileHistory != -1 && lotteMobileHistory != null) {
			if (lotteMobileHistory[lotteMobileHistory.length-1].href == window.location.href &&
				lotteMobileHistory[lotteMobileHistory.length-1].referrer == document.referrer) {
				/* 페이지 새로 고침 체크 로직 필요 하면 이곳에 */
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

		//console.log(lotteMobileHistory);
		//console.log("History back : "+$scope.locationHistoryBack);

		/*이미지 경로 header url*/
		var protocol = $location.protocol();
		/*$scope.imgPath = (protocol == "http") ? protocol + "://image.lotte.com" : protocol + "://simage.lotte.com";*/

		if (protocol == "http") {
			$scope.imgPath = protocol + "://image.lotte.com";
		} else {
			$scope.imgPath = protocol + "://simage.lotte.com";
		}

		$scope.scrollY = 0;
		$scope.scrollFlag = true; /* 스크롤 가능 여부 */
		$scope.leavePageStroage = true; /* 페이지 벗어남(unload)에 저장 여부 기능 */
		
		/* page 여부 & tclick */
		$scope.mainYn = false; /*메인여부*/

		if (location.pathname.indexOf("/main_phone.") >= 0) {
			$scope.mainYn = true;
		}
		
		/*
		 * 딤처리 공통 
		 */ 
		$scope.LotteDimm = {
			status: false,
			dimmed: true,
			dimmedOpacity : '0.5',
			target: null,
			popType: null, //'F': 전체화면,N': 일부화면
			callback: null,
			scrollY : 0,
			scrollEventFlag : false // 스크롤방지여부
		};

		// App 일 경우 header 가 없으므로 높이값을 넣음 (닷컴:45 ,엘롯데:53)
		$scope.headerHeight = 46;
		$scope.subHeaderHeight = 46;
		
		// 터치 방지 디렉티브 생성
		var superBlockElem = angular.element(document.body).append($compile('<lotte-super-block></lotte-super-block>')($scope));

		$scope.$watch("LotteSuperBlockStatus", function (newVal) {
			if (newVal != null) {
				console.log("Screen Block :"+newVal);
			}
		}, true);

		// 공통 알림 유닛 디렉티브 생성
		var alertMessageElem = angular.element(document.body).append($compile('<lotte-alert-message></lotte-alert-message>')($scope));
		// 상품 이미지 확대 보기 창
		var productZoomElem = angular.element(document.body).append($compile('<zoom-product-continer></zoom-product-continer>')($scope));
		
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

			$scope.LotteDimm.dimmedOpacity = '0.5';                    
			
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
		
		$scope.$watch("LotteDimm.target", function(newVal) {
			if(newVal != null) {
				console.log("Popup Focus :"+newVal);
			}
		}, true);

		/*기본 param 정의*/
		$scope.baseParam = "c=" + (commInitData.query['c'] ? commInitData.query['c'] : "") + "&udid="
				+ (commInitData.query['udid'] ? commInitData.query['udid'] : "") + "&v=" + (commInitData.query['v'] ? commInitData.query['v'] : "") + "&cn="
				+ (commInitData.query['cn'] ? commInitData.query['cn'] : "") + "&cdn=" + (commInitData.query['cdn'] ? commInitData.query['cdn'] : "") + "&schema="
				+ (commInitData.query['schema'] ? commInitData.query['schema'] : "");
		baseParam = $scope.baseParam; /*current-dev.js*/

		/******************************************
		 * 닷컴 앱 히스토리
		 ******************************************/
		 // iPhone 최종 버전 : 2.51.0
		
		/*app 체크 & 디바이스 체크*/
		$scope.appObj = {
			isApp : (commInitData.query['udid'] || commInitData.query['schema'] || (LotteUserService.getCookie('UDID')!='' && LotteUserService.getCookie('UDID')!='""')) ? true : false,
			isAndroid : false,
			isIOS : false,
			isIpad : false,
			isTablet : false,
			isOldApp : false,
			iOsType : "iPhone",
			isSktApp: false,
			ver : commInitData.query['v'] ? commInitData.query['v'] : 0,
			verNumber : parseInt(((commInitData.query['v'] ? commInitData.query['v'] : 0) + "").replace(/\./gi, "")),
			schema: commInitData.query['schema'] ? commInitData.query['schema'] : ""
		};
		
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

		// Tablet 확인
		if (angular.element($window).width() >= 768) {
			$scope.appObj.isTablet = true;
		}

		// SKT용 앱인지 확인 (T롯데닷컴)
		if (navigator.userAgent.indexOf("sklotte001") > -1 || commInitData.query['schema'] == "sklotte001") {
			$scope.appObj.isSktApp = true;
		}

		isApp = $scope.appObj.isApp; // lib/jquery/cnt_interface.js
		isIOS = $scope.appObj.isIOS; // lib/jquery/cnt_interface.js
		isAndroid = $scope.appObj.isAndroid; // lib/jquery/cnt_interface.js
		isTablet = $scope.appObj.isTablet; // lib/jquery/cnt_interface.js
		
		$scope.tClickBase = "";
		var SiteCode = "DC";
		
		if (location.href.indexOf(".ellotte.com") != -1) {
			SiteCode = "EL";
		}

		$scope.tClickBase = "m_"+SiteCode+"_";
		
		/*
		if($scope.appObj.isApp) {
			if($scope.appObj.isAndroid) {
				$scope.tClickBase = "m_app_"+SiteCode+"_and_";
			} else {
				$scope.tClickBase = "m_app_"+SiteCode+"_ios_";
			}
		} else {
			if($scope.appObj.isAndroid) {
				$scope.tClickBase = "m_"+SiteCode+"_and_";
			} else if($scope.appObj.isSktApp) {
				$scope.tClickBase = "m_"+SiteCode+"_skt_";
			} else {
				$scope.tClickBase = "m_"+SiteCode+"_ios_";
			}
		}
		*/
		/**
			* 강제 업데이트 관련 사항 추가 20151114 이인성
			* mlotte001 닷컴,
			* mlotte003 닷컴 iPad,
			* ellotte002 엘롯데 안드로이드
			* ellotte001 엘롯데 ios
			* sklotte001 T롯데
		*/
		var appVerArr = {
			android: {
				mlotte001: 225, 
				ellotte002: 107, 
				sklotte001: 103
			},
			ios: {
				mlotte001: 215,
				mlotte003:138, 
				ellotte001:109
			},
			Newandroid: {
				mlotte001: 250,
				ellotte002:150,
				sklotte001:150
			},
			Newios: {
				mlotte001:250,
				mlotte003:150, 
				ellotte001:150
			}
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
		
		// 화면 회전시 확인
		angular.element($window).on('orientationchange resize', function () {
			$timeout(function () {
				var topPos = angular.element($window).scrollTop();

				if (angular.element($window).width() >= 768) {
					$scope.appObj.isTablet = true;
				}

				angular.element($window).scrollTop(topPos+1); // ios 앱 헤더 fixed 자리 못잡는 결함
			}, 300);
		});

		$scope.showSrh = false; /*검색 레이어 여부*/
		$scope.isShowSideCtg = false; /*카테고리 레이어 여부*/
		$scope.isShowSideMylotte = false; /*mylotte 레이어 여부*/
		
		$scope.getShowSideCtg = function () {
			//console.log($scope.isShowSideCtg);
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
			for (var i = 0; i < sessionStorage.length; i++) {
				if (sessionStorage.key(i).indexOf("ngStorage-LotteUserService_loginCheck") < 0) {
					if ( sessionStorage.getItem(sessionStorage.key(i)) != null ) {
						sessionStorage.removeItem(sessionStorage.key(i));
					}
				}
			}

			//로그인정보까지 날아가던것 방지 : rudolph:151014
			//sessionStorage.clear();
			$scope.leavePageStroage = false; // 페이지 벗어남(unload)에 저장 여부 기능

			var tclick = "&tclick="+$scope.tClickBase+"header_new_logo";

			if (str != undefined) {
				if (str == 'footer') {
					tclick = "&tclick="+$scope.tClickBase+"actionbar_home";
				}
			}

			$window.location.href = LotteCommon.mainUrl + "?" + $scope.baseParam + tclick;
		};

		// 로그인/아웃 처리
		$scope.loginProc = function (adultChk) {
			$scope.loginMoveProc($scope.tClickBase + "footer_Clk_Lnk_10", adultChk);
		};

		$scope.myLayerLoginProc = function () {
			$scope.loginMoveProc('m_mylayer_login',undefined);
		};
		
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

			if (LotteUserService.getLoginInfo().isLogin) { // go logout
				if ($scope.appObj.isApp) {
					//IOS 일때 
					$window.location.href = "logincheck://logout";
					//20160115 로그아웃시 PMS 호출 , 안드로이드일때 
					try {
						window.loginCheck.callAndroid("logout");
						console.log("로그아웃 PMS 호출");
					} catch (e) {}					
				}

				$window.location.href = LotteCommon.logoutUrl + "?" + $scope.baseParam + "&tclick="+tclick;
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

			// 상품 연결해!
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

			$window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goodsNoStr + curDispNoStr + curDispNoSctCdStr + genieYnStr + tclickStr;
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
		
		/**
		 * @ngdoc function
		 * @name LotteCtrl.loadAction2Data
		 * @description
		 * 액션바 상품수 데이터 가저 오기
		 * @example
		 * $scope.loadAction2Data();
		 */
		$scope.loadAction2Data = function () {
			$http.get(LotteCommon.mylotteLayerData2 + '?' + $scope.baseParam).success(function (data) {
				$scope.loginAction2 = data.main_action_bar;
			}).error(function(data) {
				console.log('Error Data :  loadAction2Data');
			});
		};

		$scope.loadAction2Data();
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:lotteHeader
	 * @description
	 * header directive
	 * @example
	 * <lotte-header></lotte-header>
	 */
	commModule.directive('lotteHeader', [ '$window', '$http', 'LotteCommon', '$timeout', 'LotteCookie', 
		function ($window, $http, LotteCommon, $timeout, LotteCookie) {
		return {
			templateUrl : '/lotte/resources_dev/layout/header.html',
			replace : true,
			link : function($scope, el, attrs) {
				$scope.showStyleDesc = false;

				if (!LotteCookie.getCookie("stylePushDesc")) {
					$scope.showStyleDesc = true;
				}

				// 스타일 푸시 안내 레이어 감추기
				$scope.hideStylePushDesc = function () {
					$scope.showStyleDesc = false;
					LotteCookie.setCookie("stylePushDesc", "hide", 365);
				};

				// 메인으로 링크
				$scope.gotoMainHeader = function () {
					$scope.sendTclick($scope.tClickBase + "header_Clk_Btn_1");
					$scope.gotoMain();
				};

				// 상단 검색 레이어
				$scope.showSrhLayorHeader = function () {
					$scope.sendTclick($scope.tClickBase + "header_Clk_Lyr_1");
					$scope.showSrhLayor(true);
				};

				// 검색 레이어 보기
				$scope.showSrhLayor = function (tFlag) {
					if (!tFlag) {
						$scope.sendTclick($scope.tClickBase + "header_Clk_Lyr_2");
					}

					if ($scope.appObj.isApp && ! $scope.appObj.isIOS && !$scope.appObj.isOldApp) {
						$window.lottesearch.callAndroid("lottesearch://newsearch");
						return;
					}

					if ($scope.appObj.isApp && $scope.appObj.isIOS && !$scope.appObj.isIpad) {
						location.href =  "lottesearch://newsearch";
						return;
					} else if ($scope.appObj.isApp && $scope.appObj.isIOS && ($scope.appObj.isIpad && !$scope.appObj.isOldApp)) {
						location.href =  "lottesearch://newsearch";
						return;
					}

					$scope.showRecentKeyword();
				};

				// 스타일 추천 활성화 여부
				$scope.stylePushIntro = function () {
					if (LotteCommon.isTestFlag || // LocalTestFlag 체크
						($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber > 254) || // 안드로이드 체크, skt앱 체크(지원x), 버젼체크(2.5.5 이상)
						($scope.appObj.isAndroid && $scope.appObj.isSktApp && $scope.appObj.verNumber >= 202) || // 안드로이드 T롯데닷컴 버전체크 (2.0.2 이상)
						($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.verNumber > 2529) || // ios 체크, 버젼체크(2.53.0 이상)
						($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.verNumber > 219) // 아이패드 체크, 버젼체크(2.2.0 이상)
					   ) {
						$scope.stylePushFlag = true;
					}
				};

				$scope.stylePushIntro();

				// 스타일 추천 링크
				$scope.stylePushLink = function () {
					if ($scope.stylePushFlag) {
						var tclick = "m_header_new_patternsearch_";

						if ($scope.appObj.isSktApp) {
							tclick += "tlotte_";
						}

						if ($scope.appObj.isIOS) {
							tclick += "ios";
						} else {
							tclick += "and";
						}

						$window.location.href = LotteCommon.stylePushIntroUrl + "?" + $scope.baseParam + "&tclick=" + tclick;
					}
				};
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
						openNativePopup('사업자정보확인', 'http://www.ftc.go.kr/info/bizinfo/communicationList.jsp');
					} else {
						window.open('http://www.ftc.go.kr/info/bizinfo/communicationList.jsp');
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
				
				// 긴급공지 데이터
				try {
					$http.get(LotteCommon.mainNoticeData)
					.success(function (data){
						$scope.mainNotice = data.notice_list;
					});
				} catch(e) {
					console.log('Notice Error....')
				}
				
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
	commModule.directive('lotteBtntop', ['$window', function ($window) {
		return {
			template: '<div class="quick_btn" ng-show="visible"><a class="btn_back" ng-click="gotoPrepageSide()" ng-show="quickBackBtn">뒤로</a><a class="btn_top" ng-click="gotoTop()">위로</a></div>',
			replace: true,
			link: function ($scope, el, attrs) {
				// 스크롤 위치에 따른 btn button visible 처리
				$scope.quickBackBtn = true;

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
					history.go(-1);
				};

				// 상단으로 스크롤 처리
				$scope.gotoTop = function () {
					angular.element($window).scrollTop(0);
				};
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

	/**
	 * @ngdoc directive
	 * @name lotteComm.directive:subHeader
	 * @description
	 * sub header directive
	 * @example
	 * <sub-header></sub-header>
	 */
	commModule.directive('subHeader', ['$window', function ($window) {
		return {
			templateUrl: '/lotte/resources_dev/layout/sub_header.html',
			replace: true,
			link: function ($scope, el, attrs) {
				// 이전 페이지 링크
				var $body = angular.element('body'),
					$headerSpace = angular.element('#headerSpace');
			
				$scope.gotoPrepage = function () {
					$scope.sendTclick("m_header_new_pre");
					history.go(-1);
				};

				angular.element($window).on('scroll', function (evt) {
					// if(!$body.hasClass("fixfixed")) {
					if (this.pageYOffset > $scope.headerHeight) {
						$headerSpace.css("paddingTop",$scope.subHeaderHeight+"px");
						el[0].style.cssText = 'z-index:110;position:fixed;top:0px;width:100%;';
					} else {
						$headerSpace.css("paddingTop","0px");
						el[0].style.cssText = '';
					}
					//}
				});
				/*if($scope.appObj.isIOS) {
					angular.element(document).on('focus', 'input[type=text],input[type=tel],input[type=number],input[type=search], textarea', function(evt) {
						$headerSpace[0].style.cssText = '';
						el[0].style.cssText = '';
						$body.addClass("fixfixed");
					});
					angular.element(document).on('blur', 'input[type=text],input[type=tel],input[type=number],input[type=search], textarea', function(evt) {
						$body.removeClass("fixfixed");
					});
				}*/
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
	 */
	commModule.directive('sortHeader', ['$window','$timeout', '$location', function ($window, $timeout, $location) {
		return {
			replace:true,
			link:function($scope, el, attrs) {
				var $body = angular.element('body'),
					$headerSpace = angular.element('#headerSpace');

				angular.element($window).on('scroll', function (evt) {
					if (this.pageYOffset > $scope.headerHeight) {
						$headerSpace.css("height",$scope.subHeaderHeight+"px");
						el[0].style.cssText = 'z-index:100;position:fixed;top:'+$scope.headerHeight+'px;width:100%;';
					} else {
						$headerSpace.css("height","0px");
						el[0].style.cssText = '';
					}
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
	commModule.directive('lotteFooterActionbar', ['$window', 'LotteCommon', function ($window, LotteCommon) {
		return {
			templateUrl: '/lotte/resources_dev/layout/actionbar.html',
			replace: true,
			link: function ($scope, el, attrs) {
				$scope.gotoMainFooter = function () {
					$scope.gotoMain('footer');
				};
				
				$scope.$watch('showSrh', function (newVal) {
					if (newVal == true) {
						angular.element(el).hide();
					} else {
						angular.element(el).show();
					}
				});

				// 좌측 카테고리 열기
				$scope.showSideCtgFooter = function () {
					if ($scope.appObj.isApp && $scope.appObj.isAndroid) {
						$scope.sendTclick('m_app_actionbar_category_and');
					} else if ($scope.appObj.isApp && $scope.appObj.isIOS) {
						$scope.sendTclick('m_app_actionbar_category_ios');
					} else {
						$scope.sendTclick('m_actionbar_category');
					}

					$scope.showSideCategory();
				};
				
				// 하단 검색 레이어
				$scope.showSrhLayorFooter = function () {
					if ($scope.appObj.isApp && $scope.appObj.isAndroid) {
						$scope.sendTclick('m_app_actionbar_search_and');
					} else if ($scope.appObj.isApp && $scope.appObj.isIOS) {
						$scope.sendTclick('m_app_actionbar_search_ios');
					} else {
						$scope.sendTclick('m_actionbar_search');
					}

					$scope.showSrhLayor(true);
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
					var noImageSrc = '';
					
					if (window.location.href.indexOf(".ellotte.com") >= 0) {
						noImageSrc="http://image.lotte.com/ellotte/images/common/product/no_150.gif" 
					} else {
						noImageSrc="http://image.lotte.com/lotte/images/common/product/no_150.gif" 
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
})(window, window.angular);