var commModule = {};
var mainApp = {};
var loginInfo = {};

(function(window, angular, undefined) {
    'use strict';

    /**
     * @ngdoc overview
     * @name lotteComm
     * @description 
     * 공통 모듈
     */
    commModule = angular.module('lotteComm', ['ngSanitize', 'lotteUtil', 'lotteFilter', 'lotteUrl', 'LotteLog']);
    commModule.config([ '$httpProvider', function($httpProvider) {
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
    } ]);
    /**
     * @ngdoc service
     * @name lotteComm.LotteUserService
     * @description
     * User 관련 기능 제공 service
     */
    commModule.service('LotteUserService', ['$http', '$timeout', '$q', '$log', 'LotteCommon', '$sessionStorage',
                                            function($http, $timeout, $q, $log, LotteCommon, $sessionStorage) {
        var logger = $log.getLogger('LotteUserService');
        logger.debug("start");
        
        var loginCheck = {
                name : '',
                mbrNo : '',
                gradeCd : '',
                mbrAge : '',
                genSctCd : '',
                isLogin : false,
                isStaff : false,
                isAdult : false,
                privateBigDeal : false
            };
        /**
         * @ngdoc service
         * @name lotteComm.LotteUserService.getLoginObj
         * @description
         * loginCheck 구조 리턴 
         */
        this.getLoginObj = function() {
            return loginCheck;
        }
        
        /**
         * @ngdoc service
         * @name lotteComm.LotteUserService.getCookie
         * @description
         * ngCookies를 사용하기 위해 angular-s.js를 모두 include하는 것에 대한 부담으로 인해 getCookie 함수만 정의해서 사용함
         */
        this.getCookie = function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        };
        
        /**
         * @ngdoc service
         * @name lotteComm.LotteUserService.retriveLoginInfo
         * @description
         * 비동기 통신 : 로그인 사용자 데이터 가저 오기
         */
        this.retriveLoginInfo = function() {
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
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response, status, headers, config);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response, status, headers, config);
                    });
            } catch (e) {
                log.error(e.message, e);
            }
            
            log.debug("end");
            return deferred.promise;
        };
        
        /**
         * @ngdoc service
         * @name lotteComm.LotteUserService.getLoginInfo
         * @description
         * 로그인 체크 : 로그인한 경우 필수 정보를 sessionStorage에 담고 session 내에서는 sessionStorage에 저장된 data를 return한다.
         * 호출 url : /json/cn/login_check.json
         */
        this.getLoginInfo = function() {
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
                    return loginCheck;
                }
                /**/
                
                if ($sessionStorage.LotteUserService_loginCheck) {
                    scope.loginInfo = $sessionStorage.LotteUserService_loginCheck;
                    isLogin = scope.loginInfo.isLogin;
                    return $sessionStorage.LotteUserService_loginCheck;
                }
                
                this.retriveLoginInfo()
                    .then(function(response) {
                        if (response.HasError) {
                            //log.error("user 정보 조회중 에러발생:", response);
                            return loginCheck;
                        } else {
                            //log.info("user 정보 조회 완료:", response);
                            $sessionStorage.LotteUserService_loginCheck = response.loginCheck;
                            scope.loginInfo = response.loginCheck;
                            isLogin = scope.loginInfo.isLogin;
                            return response.loginCheck;
                        }
                    })
                    .catch(function(response) {
                        //log.error("user 정보 조회중 에러발생:", response);
                        return loginCheck;
                    });
            } catch (e) {
                log.error(e.message, e);
            }
            return loginInfo;
            log.debug("end");
        };
        
        /**
         * @ngdoc service
         * @name lotteComm.LotteUserService.setSessionStorage
         * @description
         * /json/cn/login_check.json을 수행한 후 login 정보를 sessionStorage에 저장하고 callback 실행 
         */
        this.setSessionStorage = function(callback) {
            var log = logger.getChildLogger("retriveLoginInfo");
            log.debug("start");
            
            this.retriveLoginInfo()
            .then(function(response) {
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
        }
        
        logger.debug("end");
    } ]);

    commModule.controller('LotteCtrl', [
            '$scope',
            '$parse',
            '$location',
            '$window',
            '$document',
            '$http',
            '$compile',
            '$timeout',
            'LotteUtil',
            'LotteLink',
            'commInitData',
            'LotteCommon',
            'LotteUserService',
            'LotteForm',
            'LotteStorage',
            function($scope, $parse, $location, $window, $document, $http, $compile,$timeout, LotteUtil, LotteLink, commInitData, LotteCommon, LotteUserService, LotteForm, LotteStorage) {

                $scope.loginInfo = LotteUserService.getLoginObj();
                LotteUserService.getLoginInfo();
                
                /**
                 * History back 체크 루틴
                 */
                $scope.locationHistoryBack = false;
                var lotteMobileHistory = LotteStorage.getSessionStorage("LotteMobileHistory", 'json');

                if(lotteMobileHistory != -1 && lotteMobileHistory != null) {
                	if(lotteMobileHistory[lotteMobileHistory.length-1].href == window.location.href &&
                			lotteMobileHistory[lotteMobileHistory.length-1].referrer == document.referrer) {
                		/* 페이지 새로 고침 체크 로직 필요 하면 이곳에 */
                	} else {
	                	if(lotteMobileHistory.length > 1) {
	                		if(lotteMobileHistory[lotteMobileHistory.length-2].href == window.location.href &&
	                				lotteMobileHistory[lotteMobileHistory.length-2].referrer == document.referrer){
	                			$scope.locationHistoryBack = true;
	                    		lotteMobileHistory.pop();
	                    		LotteStorage.setSessionStorage("LotteMobileHistory", lotteMobileHistory, 'json');
	                		}
	                	}
	                	if(lotteMobileHistory.length > 10 && !$scope.locationHistoryBack) {
	                		lotteMobileHistory.shift();
	                		LotteStorage.setSessionStorage("LotteMobileHistory", lotteMobileHistory, 'json');
	                	}
	                	if(!$scope.locationHistoryBack) {
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
                }

                // App 일 경우 header 가 없으므로 높이값을 넣음 (닷컴:45 ,엘롯데:53)
                $scope.headerHeight = 46;
                $scope.subHeaderHeight = 46;
                
                // 터치 방지 디렉티브 생성
                var superBlockElem = angular.element(document.body).append($compile('<lotte-super-block></lotte-super-block>')($scope));
                $scope.$watch("LotteSuperBlockStatus", function(newVal) {
                    if(newVal != null) {
                        console.log("Screen Block :"+newVal);
                    }
                }, true);

                // 공통 알림 유닛 디렉티브 생성
                var alertMessageElem = angular.element(document.body).append($compile('<lotte-alert-message></lotte-alert-message>')($scope));
                // 상품 이미지 확대 보기 창
                var productZoomElem = angular.element(document.body).append($compile('<zoom-product-continer></zoom-product-contine>')($scope));
                
                // 딤 유닛 디렉티브 생성
                var dimmElem = angular.element(document.body).append($compile('<lotte-dimm></lotte-dimm>')($scope));
                $scope.dimmedOpen = function(dimmed) {
                    if(dimmed.dimmed == false){
                        $scope.LotteDimm.dimmedOpacity = '0.0';
                    }
                    if($scope.LotteDimm.target != null && $scope.LotteDimm.callback) {
                        $scope.LotteDimm.callback();
                    }
                    $scope.LotteDimm.scrollY = angular.element($window).scrollTop();  
                    $scope.LotteDimm.status = true;
                    $scope.LotteDimm.target = dimmed.target ? dimmed.target : null;
                    $scope.LotteDimm.callback = dimmed.callback ? dimmed.callback : null;
                    $scope.LotteDimm.scrollEventFlag = dimmed.scrollEventFlag == true ?  true : false;
                    if($scope.LotteDimm.scrollEventFlag){
                        angular.element($window).on("touchmove.dimmedScrollEvt", function (e) {
                            e.preventDefault();
                        });
                    } else {
                        angular.element("#wrapper").css("height","100%");
                    }
                }
                $scope.dimmedClose = function() {
                    if(!$scope.LotteDimm.status) {
                        return false;
                    }
                    $scope.LotteDimm.status = false;
                    $scope.LotteDimm.target = null;
                    if($scope.LotteDimm.callback) {
                        $scope.LotteDimm.callback();
                    }
                    $scope.LotteDimm.dimmedOpacity = '0.5';                    
                    if($scope.LotteDimm.scrollEventFlag){
                        angular.element($window).off("touchmove.dimmedScrollEvt");
                        $scope.LotteDimm.scrollEventFlag = false;
                    } else {
                        angular.element("#wrapper").attr("style","");
                    }
                    $timeout(function(){
                        angular.element($window).scrollTop($scope.LotteDimm.scrollY);
                    },100);
                }
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
                
                /*app 체크 & 디바이스 체크*/
                $scope.appObj = {
                    isApp : (commInitData.query['udid'] || commInitData.query['schema'] || (LotteUserService.getCookie('UDID')!='' && LotteUserService.getCookie('UDID')!='""')) ? true : false,
                    isAndroid : false,
                    isIOS : false,
                    isTablet : false,
                    iOsType : "iPhone",
                    isSktApp: false,
                    ver : commInitData.query['v']
                };
                
                var mobileInfo = new Array('Android', 'iPhone', 'iPod', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
                
                for ( var info in mobileInfo) {
                    var matchKw = navigator.userAgent.match(mobileInfo[info]);
                    if (matchKw != null) {
                        if (matchKw[0] == 'iPhone' || matchKw[0] == 'iPad') {
                            $scope.appObj.isIOS = true;
                            $scope.appObj.iOsType = matchKw[0];
                        } else if (matchKw[0] == 'Android')
                            $scope.appObj.isAndroid = true;
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
                if(location.href.indexOf(".ellotte.com") != -1) {
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
                
                // 강제 업데이트 관련 사항 추가 20151114 이인성
                // 닷컴,닷컴 iPad,엘롯데,T롯데,스마트픽
                var appVerArr = {
                		android:{mlotte001:220,ellotte002:109,sklotte001:103},
                		ios:    {mlotte001:215,mlotte003:135, ellotte001:108}
                }
                var versionCheckRegKey = {mlotte001:/(mlotte001\/.[\d\.]*)/gi,
					                        mlotte003:/(mlotte003\/.[\d\.]*)/gi,
					                        ellotte002:/(ellotte002\/.[\d\.]*)/gi,
					                        ellotte001:/(ellotte001\/.[\d\.]*)/gi,
					                        sklotte001:/(sklotte001\/.[\d\.]*)/gi}

                // 테스트 UserAgent
                // IOS
                // var uagent = "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13B143 mlotte001/2.5.0 udid/87bbc656e624300142c5d76c8a78d3807ba7db8872c727e442fb2f0b07bf968e";
                // 안드로이드 
                // var uagent = "Mozilla/5.0 (Linux; Android 4.4.2; SM-T320 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36 sklotte001/1.50 udid/9fdd9213b118a6ee";
                // var uagent = "Mozilla/5.0 (Linux; Android 4.4.2; SM-T320 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36 mlotte001/2.50 udid/9fdd9213b118a6ee";
                $scope.appForceUpdateCheck = function(os) {
                	angular.forEach(appVerArr[os], function(val, key) {
	        			var mt = navigator.userAgent.match(versionCheckRegKey[key]);
	        			if(mt != null) {
	        				var spVersion = mt[0].split("/");
	        				var appVersion = parseInt(spVersion[1].replace(/\./gi,''));
	        				if(appVersion <= val) {
	        					$scope.appUpdate = true;
	        					window.location.href = "/update/update.do";
	        					return false;
	        				}
	        			}
	        		});
                }
                
                if($scope.appObj.isApp) {
	               	$scope.appUpdate = false;
	               	if($scope.appObj.isAndroid) {
	               		$scope.appForceUpdateCheck('android');
	               	} else {
	               		// 엡스토어 오픈후 주석 제거
	               		$scope.appForceUpdateCheck('ios');
	               	}
	                if($scope.appUpdate) {
	                	return false;
	                }
                }

                
                // 화면 회전시 확인
                angular.element($window).on("resize", function() {
                    if (angular.element($window).width() >= 768) {
                        $scope.appObj.isTablet = true;
                    }

                    isTablet = $scope.appObj.isTablet; // lib/jquery/cnt_interface.js
                });

                $scope.showSrh = false; /*검색 레이어 여부*/
                $scope.isShowSideCtg = false; /*카테고리 레이어 여부*/
                $scope.isShowSideMylotte = false; /*mylotte 레이어 여부*/

                $scope.getShowSideCtg = function() {
                    console.log($scope.isShowSideCtg)
                    return $scope.isShowSideCtg;
                }

                /*홈으로 이동 (sessionStorage 제거)*/
                $scope.gotoMain = function(str) {
                    for (i = 0; i < sessionStorage.length; i++) {
                        if (sessionStorage.key(i).indexOf("ngStorage-LotteUserService_loginCheck") < 0) {
                            if ( sessionStorage.getItem( sessionStorage.key(i) ) != null ) {
                                sessionStorage.removeItem( sessionStorage.key(i) );
                            }
                        }
                    }
                    //로그인정보까지 날아가던것 방지 : rudolph:151014
                    //sessionStorage.clear();
                    $scope.leavePageStroage = false; /* 페이지 벗어남(unload)에 저장 여부 기능 */
                    var tclick = "&tclick="+$scope.tClickBase+"header_new_logo";
                    if (str != undefined) {
                        if (str == 'footer') {
                        	tclick = "&tclick="+$scope.tClickBase+"actionbar_home";
                        }
                    }
                   	$window.location.href = LotteCommon.mainUrl + "?" + $scope.baseParam + tclick;
                };

                /*뒤로가기 시, url return*/
                $scope.managePrepage = function() {
                    var referUrl;
                    if ($document.context.referrer != '')
                        referUrl = $document.context.referrer;
                    else
                        referUrl = LotteCommon.baseUrl;

                    return referUrl;
                };

                /*로그인/아웃 처리*/
                $scope.loginProc = function(adultChk) {
					$scope.loginMoveProc($scope.tClickBase + "footer_Clk_Lnk_10", adultChk);
				};
				$scope.myLayerLoginProc = function() {
					$scope.loginMoveProc('m_mylayer_login',undefined);
				};
				$scope.loginMoveProc = function(tclick,adultChk) {
					sessionStorage.clear();
					if (LotteUserService.getLoginInfo().isLogin) { /*go logout*/
					    if (isApp){
                            $window.location.href = "logincheck://logout";
                        }
						$window.location.href = LotteCommon.logoutUrl + "?" + $scope.baseParam + "&tclick="+tclick;
					} else { /*go logout*/
						var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
						var adultParam = "";

						if (adultChk == 'Y') {
							adultParam = "&adultChk=Y";
						}

						$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&tclick=" + tclick + adultParam + targUrl;
					}
				};

                /*본인인증 링크*/
                $scope.goAdultSci = function(loginChk) {
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

                    $window.location.href = LotteCommon.sciUrl + "?" + $scope.baseParam + "&adultChk=Y&&returnDomain=m.lotte.com&backUrl="
                            + encodeURIComponent(backUrl, 'UTF-8');
                };

                /*카테고리 링크*/
                $scope.categoryView = function(disp_no, title, tclick, etcStr) {
                    if (!disp_no || !title) {
                        alert("카테고리 정보가 잘못되었습니다.");
                        return false;
                    }
                    /*http://m.lotte.com/category/new_prod_list.do?c=mlotte&udid=&v=&cn=&cdn=&disp_no=5522765&title=각질관리/스크럽/필링&idx=1&tclick=categorylist_prodlistgo_idx01*/
                    var tclickStr = "";
                    if (tclick) {
                        tclickStr = "&tclick=m_side_cate_catesmall_" + tclick;
                    }
                    ;
                    $window.location.href = LotteCommon.categoryUrl + "?" + $scope.baseParam + "&disp_no=" + disp_no + "&title=" + title + tclickStr + etcStr;
                };

                /*기획전 링크*/
                $scope.planShopView = function(curDispNo, tclick) {
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

                /*배너등 링크*/
                $scope.cornerBanView = function(linkUrl, tclick, title, isOutLink) {
                    var tclickStr = "", titleStr = "", linkUrlStr = linkUrl;
                    if (tclick) {
                        tclickStr = "&tclick=" + tclick;
                    }
                    ;
                    if (title) {
                        titleStr = "&title=" + title;
                    }
                    ;

                    linkUrlStr = LotteUtil.setUrlAddBaseParam(linkUrl, $scope.baseParam + titleStr + tclickStr);
                    /*console.log(linkUrlStr);*/

                    if (!isOutLink) {
                        $window.location.href = linkUrlStr;
                    } else {
                        LotteLink.goOutLink(linkUrlStr);
                    }
                };
                /*검색키워드 링크로 연결*/
                $scope.goSearch = function(keyword, tclick) { /*새 키워드 검색*/
                    /*tclick 있을 경우 tclick 수집을 위한 url parameter 추가*/
                    var tClickStr = "";

                    if (tclick) {
                        tClickStr = "&tclick=" + tclick;
                    }

                    /*URL 이동*/
                    $window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + '&keyword=' + keyword + tClickStr);
                };

                /*상품상세페이지 링크(본인인증)*/
                $scope.productView = function(item, curDispNo, curDispNoSctCd, tclick) {
                    if (item.byrAgelmt == 19) { /*19금 상품*/
                        if ($scope.loginInfo.isAdult == "") { /*본인인증 안한 경우*/

                            if (!$scope.loginInfo.isLogin) { /*로그인 안한 경우*/
                                $scope.loginProc('Y');
                            } else {
                                $scope.goAdultSci();
                            }
                            return false;
                        } else if (!$scope.loginInfo.isAdult) { /*성인이 아닌 경우*/
                            alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
                            return false;
                        }
                    }

                    /*상품 연결해!*/
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
                    $window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goodsNoStr + curDispNoStr + curDispNoSctCdStr + genieYnStr
                            + tclickStr;
                };

                /*상품 위시리스트 담기*/
                $scope.sendProductWish = function(goodsNo, callBackFunc) {
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
                    .error(function(ex) {
                    	if (ex.error) {
                    		var errorCode = ex.error.response_code;
                    		var errorMsg = ex.error.response_msg;
                    		
                    		if ('9003' == errorCode) {
                        		alert(errorMsg);
                    			// TODO ywkang2 : lotte_svc.js 를 참조해야함
                    			var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8'); 
//                        		$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl
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

                $scope.sendTclick = function(tclick, outlink) {
                    var setTime = 1000;
                    if (outlink) {
                        setTime = 0;
                    }
                    //console.log("tclick(ang) : " + tclick); 테스트 후 삭제

                    console.info("TCLICK : ", tclick);

                    $("#tclick_iframe").remove();
                    setTimeout(function() {
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

                $scope.sendOutLink = function(url) {
                    //$window.open(url);
                    LotteLink.goOutLink(url);
                    return false;
                };

                /*우측 마이롯데 데이터 get (로그인 데이터 로드 완료 후)*/
                var loadSideMylotteData = function() {
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

                // LotteUserService로 기능 이전
                /*로그인 데이터 get*/
//              $scope.loadLoginData = function() {
//                  $http.get(LotteCommon.loginData).success(function(data) {
//                      // chpark : mapi login_check으로 변경  $scope.loginInfo = data;
//                      $scope.loginInfo = data.loginCheck;
//                      isLogin = $scope.loginInfo.isLogin; /*lib/jquery/cnt_interface.js*/
//
//                      /*데이터 개발 후 적용*/
//                      /*if($scope.loginInfo.isLogin) {
//                          loadSideMylotteData();
//                      }*/
//                      commModule.loginInfo = $scope.loginInfo;
//                  }).error(function(data) {
//                      console.log('Error Data :  로그인');
//                  });
//              };
//
//              $scope.loadLoginData();
//              commModule.loadLoginData = $scope.loadLoginData;

                $scope.loadAction2Data = function() {
                    $http.get(LotteCommon.mylotteLayerData2 + '?' + $scope.baseParam).success(function(data) {
                        $scope.loginAction2 = data.main_action_bar;
                    }).error(function(data) {
                        console.log('Error Data :  loadAction2Data');
                    });
                };
                $scope.loadAction2Data();
                
            } ]);
    /* header directive */
    commModule.directive('lotteHeader', [ '$window', '$http', 'LotteCommon', '$timeout', function($window, $http, LotteCommon, $timeout) {
        return {
            templateUrl : '/lotte/resources_dev/layout/header.html',
            replace : true,
            link : function($scope, el, attrs) {
                /*메인으로 링크*/
                $scope.gotoMainHeader = function() {
                    // $scope.sendTclick('m_header_new_logo');
                    $scope.gotoMain();
                };

                /*상단 검색 레이어*/
                $scope.showSrhLayorHeader = function() {
                    if($scope.appObj.isApp && ! $scope.appObj.isIOS) {
                        $window.lottesearch.callAndroid("lottesearch://newsearch");
                        return;
                    }
                    if($scope.appObj.isApp && $scope.appObj.isIOS) {
                        location.href =  "lottesearch://newsearch";
                        return;
                    }
                    $scope.showSrhLayor();
                	$scope.sendTclick($scope.tClickBase+'header_new_search');
                };     

                /*검색 레이어 보기*/
                $scope.showSrhLayor = function(e) {
                    if (isApp && !isIpad) {
                        if (isAndroid) {
                            $window.lottesearch.callAndroid("lottesearch://newsearch");
                            /* $window.lottebridge.callAndroid("lottebridge://lotteapps/hide"); android 액션바 감추기*/
                        } else {
                            $window.location.href = "lottesearch://newsearch";
                            /*$window.location.href= "lottebridge://lotteapps/hide"; ios는 액션바 감출 필요가 없음!! */
                        }
                    } else { /*web*/
                        $scope.showRecentKeyword();
                    }
                };
            }
        }
    } ]);

    /* footer directive */
    commModule.directive('lotteFooter', [ '$window', '$http', 'LotteCommon', 'LotteCookie', 'LotteUtil', function($window, $http, LotteCommon, LotteCookie, LotteUtil) {
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
                $scope.pcClick = function() {
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
                $scope.companyClick = function() {
                    if ($scope.appObj.isApp) {
                        openNativePopup('회사소개', $scope.companyUrl);
                    } else {
                        window.open($scope.companyUrl);
                    }
                };
                
                //사업자정보확인
                $scope.ftcClick = function() {
                	$scope.sendTclick($scope.tClickBase + 'footer_Clk_Btn_' + "8");
                    if ($scope.appObj.isApp) {
                        openNativePopup('사업자정보확인', 'http://www.ftc.go.kr/info/bizinfo/communicationList.jsp');
                    } else {
                        window.open('http://www.ftc.go.kr/info/bizinfo/communicationList.jsp');
                    }   
                }

                //채무지급보증안내
                $scope.forwardClick = function() {
                	$scope.sendTclick($scope.tClickBase + 'footer_Clk_Btn_' + "9");
                    if ($scope.appObj.isApp) {
                        openNativePopup('채무지급보증안내', 'http://www.lotte.com/main/common/forward.GuaranteeService_pop.lotte');
                    } else {
                        window.open('http://www.lotte.com/main/common/forward.GuaranteeService_pop.lotte');
                    }                   
                }
                
                /*로그인 데이터 watch*/
                $scope.footTxt_staff = '오류신고'; /*임직원인 경우*/
                $scope.footLink_staff = LotteCommon.errorAlarmUrl + '?' + $scope.baseParam + "&evt_no=275960&tclick=" + $scope.tClickBase + "footer_Clk_Lnk_2";
                $scope.footTxt_mylotte = '마이롯데'; /*비로그인, 고객인 경우*/
                $scope.footLink_mylotte = LotteCommon.mylotteUrl + '?' + $scope.baseParam + "&tclick=" + $scope.tClickBase + "footer_Clk_Lnk_1";
                /*앱알림 설정 안내*/
                $scope.infoAppAlarm = function() {
                    alert('알림(앱Push) 수신 여부는\n하단 [MY > 설정 > 알림설정] 에서\n변경하실 수 있습니다.');
                };
                
                // 긴급공지 데이터
                try {
                    $http.get(LotteCommon.mainNoticeData)
                    .success(function(data){
                        $scope.mainNotice = data.notice_list;
                    });
                } catch(e) {
                    console.log('Notice Error....')
                }
                
                // 긴급공지 클릭
                $scope.noticeListUrl = function(bbc_no){
                	$window.location.href = LotteCommon.noticeListUrl + "?" + $scope.baseParam + "&bbc_no=" + bbc_no +"&tclick=m_t_notice";
                }
                
                //footer 바로방문처리
                $scope.vDirectBoxDispYn = false;
                $scope.fnDirectBoxOpen = function(){
                	$scope.sendTclick($scope.tClickBase + 'footer_Clk_Btn_' + "13");
                    $scope.dimmedOpen({
                        target : "directPop",
                        callback : this.fnDirectBoxClose
                    });
                    $scope.vDirectBoxDispYn = true;
                }
                $scope.fnDirectBoxClose = function(){
                    $scope.dimmedClose({
                        target : "directPop"
                    });
                    $scope.vDirectBoxDispYn = false;
                }
            }
        }
    } ]);

    /* top button */
    commModule.directive('lotteBtntop',['$window',function($window) {
        return {
            template : '<div class="quick_btn" ng-show="visible"><a class="btn_back" ng-click="gotoPrepageSide()" ng-show="quickBackBtn">뒤로</a><a class="btn_top" ng-click="gotoTop()">위로</a></div>',
            replace : true,
            link : function($scope, el, attrs) {
                // 스크롤 위치에 따른 btn button visible 처리
                $scope.quickBackBtn = true;
                if($scope.screenID != undefined) {
                    if($scope.screenID.indexOf("main") == 0) {
                        $scope.quickBackBtn = false;
                    }
                }
                angular.element($window).on('scroll', function(evt) {
                    if (this.pageYOffset > 100){
                        $scope.visible = true;
                    }else{
                        $scope.visible = false;
                    }
                    $scope.$apply();
                });
                /*이전 페이지 하다 링크*/
                $scope.gotoPrepageSide = function() {
                	$scope.sendTclick($scope.tClickBase + "subheader_Clk_Btn_1");
                    $scope.sendTclick("m_side_new_pre");
                    history.go(-1);
                };
                // 상단으로 스크롤 처리
                $scope.gotoTop = function() {
                    angular.element($window).scrollTop(0);
                }
            }
        }
    } ]);

    /* dim cover */
    commModule.directive('baseCover', [ function() {
        return {
            template : '<section id="dimCover" ng-if="showDimCover"></section>',
            replace : true
        }
    } ]);

    /* sub header directive */
    commModule.directive('subHeader', [ '$window', function($window) {
        return {
            templateUrl : '/lotte/resources_dev/layout/sub_header.html',
            replace : true,
            link : function($scope, el, attrs) {
                /*이전 페이지 링크*/
                var $body = angular.element('body'),
                    $headerSpace = angular.element('#headerSpace');
            
                $scope.gotoPrepage = function() {
                    $scope.sendTclick("m_header_new_pre");
                    history.go(-1);
                };
                angular.element($window).on('scroll', function(evt) {
                    //if(!$body.hasClass("fixfixed")) {
                        if (this.pageYOffset > $scope.headerHeight){
                            $headerSpace.css("paddingTop",$scope.subHeaderHeight+"px");
                            el[0].style.cssText = 'z-index:100;position:fixed;top:0px;width:100%;';
                        }else{
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

    /* actionbar */
    commModule.directive('lotteFooterActionbar', [ '$window', 'LotteCommon', function($window, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/layout/actionbar.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.gotoMainFooter = function() {
                    $scope.gotoMain('footer');
                }
                
                $scope.$watch('showSrh', function(newVal) {
                    if(newVal == true) {
                        angular.element(el).hide();
                    } else {
                        angular.element(el).show();
                    }
                });

                /*좌측 카테고리 열기*/
                $scope.showSideCtgFooter = function() {
                    if (isApp && isAndroid) {
                        $scope.sendTclick('m_app_actionbar_category_and');
                    } else if (isApp && isIOS) {
                        $scope.sendTclick('m_app_actionbar_category_ios');
                    } else {
                        $scope.sendTclick('m_actionbar_category');
                    }
                    $scope.showSideCategory();
                };
                
                /*하단 검색 레이어*/
                $scope.showSrhLayorFooter = function() {
                    if (isApp && isAndroid) {
                        $scope.sendTclick('m_app_actionbar_search_and');
                    } else if (isApp && isIOS) {
                        $scope.sendTclick('m_app_actionbar_search_ios');
                    } else {
                        $scope.sendTclick('m_actionbar_search');
                    }
                    $scope.showSrhLayor();
                };
            }
        }
    } ]);

    /* sub header directive */
    commModule.directive('loadingBar', [ function() {
        return {
            template : '<div ly-cover class="ajax_loading" ng-if="isShowLoading"><p class="loading half"></p></div>',
            compile : function(element, attrs) {

                var cover = element[0];
                if (cover.parentNode.classList.contains('wrapBox')) {

                    var container = document.querySelector('ul.container'), header = document.querySelector('header#head'), menuOne = document
                            .querySelector('nav.main_one'), menuTwo = document.querySelector('nav.main_two'), contentH = window.innerHeight - header.offsetHeight
                            - menuOne.offsetHeight - menuTwo.offsetHeight;

                    contentH -= 50; /* 하단 액션바 세로값 */

                    cover.style.cssText = 'position: relative; width: 100%; min-height: ' + contentH + 'px ';
                }
            }

        }
    } ]);

    commModule.factory('commInitData', [ '$window', '$location', function($window, $location) {
        var queries = $window.location.search.replace(/^\?/, '').split('&'), queryObj = [], viewTypeObj;
        /*param 초기 세팅*/
        angular.forEach(queries, function(value) {
            var split = value.split('=');
            queryObj[split[0]] = split[1];
        });
        return {
            query : queryObj
        };
    } ]);
})(window, window.angular);