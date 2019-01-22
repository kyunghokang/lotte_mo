var callDownCpn; //상품상세에서 ABTEST 베너 클릭시 호출

(function (window, angular, undefined) {
	'use strict';

	var popModule = angular.module('lotteMainPop', []);

	popModule.controller('lotteMainPopCtrl', ['$scope', '$window', '$location', '$http', 'LotteCommon', 'LotteUtil', 'LotteCookie', 'LotteStorage', 'AppDownBnrService', 'LotteLink', 'commInitData','LotteGA','$timeout',
		function ($scope, $window, $location, $http, LotteCommon, LotteUtil, LotteCookie, LotteStorage, AppDownBnrService,LotteLink, commInitData,LotteGA,$timeout) {		    
            $scope.loadMainPopup = function (attr) {
			/*
			 * ppp_tgt_pg_cd = "10"; 메인 main ppp_tgt_pg_cd = "20"; 상품상세 goods
			 * ppp_tgt_pg_cd = "30"; 기획전 special_plan ppp_tgt_pg_cd = "40"; 검색결과
			 * search ppp_tgt_pg_cd = "50"; 카테고리 category
			 */
			var comQuery = commInitData.query;
			var params = {
				ppp_tgt_pg_cd : attr.pppTgtPgCd, // pppTgtPgCd: from directive attribute
				cn: comQuery["cn"],
				udid: comQuery["udid"],
				schema: comQuery["schema"]
			};
            $scope.nopopup = comQuery["nopop"];
                
			if (LotteUtil.getParameter('testDate')) {
				params.testDate = LotteUtil.getParameter('testDate');
			}

			$scope.hideActionBar = false;
			$scope.cookieName = null; // 오늘 하루 안보기 쿠키
			$scope.appActionBarHide = function () {
				if ($scope.appObj.isApp && $scope.hideActionBar) {
					location.href = 'lottebridge://lotteapps/fullscreenhide';
				}
			};

			$scope.appActionBarShow = function () {
				if ($scope.appObj.isApp && $scope.hideActionBar) {
					location.href = 'lottebridge://lotteapps/fullscreenshow';
				}
			};
            $scope.pop_move = function(str){
                location.href = str;
            }
            $scope.popGATag = function(type, index){
                if($scope.mainPopNew != null){ //메인 팝업일 때만 처리 
                    //LotteGA.evtTag("MO_플로팅버튼", "플로팅버튼", "플로팅버튼", "-", "-");
                    if(type == 0){
                        LotteGA.evtTag("MO_메인_팝업", "팝업", "닫기", "", "");
                    }else if(type == 1){
                        LotteGA.evtTag("MO_메인_팝업", "팝업", "오늘하루그만보기", "", "");
                    }else if(type == 2){
                        index += 1;
                        if(index < 10){
                            index = "0" + index;
                        }
                        LotteGA.evtTag("MO_메인_팝업", "팝업", index, "", "");
                    }
                }
            }            
			// popOpen(): 열기            
			$scope.popOpen = function () {
				angular.element('.main_popup').show();
                //20180403                
                $("#wrapper").css("height", "97%");
                if($scope.mainPopNew == null){ //스와이핑 팝업이 아닌 경우에만 
                    // 20181109 팝업 중앙 정렬 시 이미지 로딩 체크 - 주영남
                    $timeout(function(){                    
                        var $img = angular.element(".main_popup .inner.noswipe img");
                        var total = $img.length,count = 0;

                        if (total === 0) { $scope.isShowPop = false;}
                        $img.each(function() {
                            $(this).one('load error', function(e) {
                                if (++count === total) {  $scope.isShowPop = true; }
                            }).each(function() {
                                if (this.complete || this.src == '') { $(this).trigger('load'); }
                            });
                        });                         
                        if(!$scope.isShowPop){
                           $("#wrapper").css("height", "auto");
                        }                        
				    },100);                   
                }
			};

			// popClose(): 닫기
			$scope.popClose = function (code) {
				$scope.sendTclick("m_RDC_popup_Close");
				angular.element('.main_popup').remove();
                //20180403                
                $("#wrapper").css("height", "auto");
                if(code == undefined){
                    $scope.popGATag(0);
                }
                // groupModuleNm : 모듈데이터의 modleNm, idx, label
				//$scope.logGAEvtModule("MO_메인_팝업", null, "닫기");
                
                //angular.element(document.body).off("touchmove.dimmedScrollEvt2");                
                
				//20160818
                /*
                $scope.dimmedClose({target:"popup"});
				$scope.appActionBarShow();
                */
			};

			// popToday(): 오늘 하루 안보기
			$scope.popToday = function () {
				$scope.sendTclick("m_RDC_popup_stoptoday");
				LotteCookie.setCookie($scope.cookieName, 'Y', 1);
                $scope.popGATag(1);
				$scope.popClose(0);
				//20160818
                //$scope.appActionBarShow();
			};
            
            //---------------- 제휴채널 전면팝업 -------------
            $scope.chkAlliancePopupObj = {
                flag: true, // 노출 여부
                imgPath: "", // 팝업 이미지 경로
                deepLinkFlag: true, // 딥링크 연결 여부
                tclick: "" // Tclick
            };            
            // 제휴채널 전면 팝업 닫기
            $scope.closeAlliancePopup = function () {
                $scope.chkAlliancePopupObj.flag = false;
            };

            // 제휴채널 팝업에서 앱실행 링크
            $scope.allianceExcuteApp = function (referrer) {
                var deepLinkUrl = $scope.chkAlliancePopupObj.deepLinkFlag ? null : "http://m.lotte.com";
                var tclick = $scope.chkAlliancePopupObj.tclick ? $scope.chkAlliancePopupObj.tclick : null;
                LotteLink.appDeepLink("lotte", deepLinkUrl, $scope.chkAlliancePopupObj.tclick, referrer); // 앱 딥링크 params : lotte/ellotte, 딥링크URL (없을 경우 default 현재 URL, tclick, referrer)
            };
            //===============================================
            //==========================
			function loadMainPopData() {
				$http.get(LotteCommon.mainPopupData, {params: params})
				.success(function (data) {
					// 앱다운로드 데이터 로드 체크
					if (!LotteStorage.getSessionStorage("appDownBnrHide") && !$scope.appObj.isApp) {
						var appDownLoadDataChk = AppDownBnrService.appDownBnrLoadDefer;

						if (data.app_down_popup && data.app_down_popup.length > 0) {
							appDownLoadDataChk.resolve(data.app_down_popup);
						}
					}

					$scope.mainPop = data.current_page_popup;
                    $scope.mainPopNew = null;
                    $scope.isShowPop = false;
                    //메인이고 신규 데이타가 있으면                     
                    if(params.ppp_tgt_pg_cd == '10' && data.main_new_popup != undefined && data.main_new_popup.length > 1){ //(params.cn == undefined || params.cn == '')
                        $scope.mainPopNew = data.main_new_popup;
                        $scope.isShowPop = true;
                        //팝업창 내 스와이프 컨트롤
                        $scope.getControlmp = function(control){
                            $scope.controlmp = control;
                        }        
                        $scope.next_pop = function(dir){
                            var now = $scope.controlmp.getIndex() + dir;
                            $scope.controlmp.moveIndex(now);
                        }                        
                    }
					/*
					* hideActionBar: 액션바를 숨기거나 다시 노출할 페이지인지 여부. 앱이고 전체화면 팝업이며 상품상세
					* 혹은 기획전이 아닐때만 액션바를 숨기거나 다시 노출한다.
					*/
					$scope.hideActionBar = (LotteUtil.isApp() && $scope.mainPop.ppp_prt_tp_cd == 'F'
						&& attr.pppTgtPgCd != '20'
						&& attr.pppTgtPgCd != '30') ? true : false;

					if ($scope.mainPop.ppp_sn != 0) {
						// dupCouponIssue(): 중복 쿠폰 발급
						
						//상품상세에서 ABTEST 베너 클릭시 호출
						callDownCpn = function(){
							$scope.dupCouponIssue('88045');
							$scope.sendTclick('m_abtest_naverbanner_01');
							
						}
						
						$scope.dupCouponIssue = function (couponNo) {
							if ($scope.loginInfo.isLogin) {
								if (couponNo.length > 0) {
									$http({
										url : LotteCommon.couponRegCouponData + '?' + $scope.baseParam,
										data : 'cpn_issu_no=' + couponNo,
										method : 'POST',
										headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
									}).success(function (data) {
										data.result = data.result.replace('\\n', ' ');

										if (typeof LotteUtil.getParameter('cn') != 'undefined' && LotteUtil.getParameter('cn') == '140924') {
											if (data.result.indexOf('발급받은') >- 1) {
												alert("이달의 앱 쿠폰을 모두 받으셨습니다. 참좋은혜택 등급 쿠폰도 확인하세요!");
												location.href = LotteCommon.gdBenefitUrl + '?' + $scope.baseParam;
											} else {
												alert(data.result);
											}
										} else {
											alert(data.result);
										}

										$scope.popClose();
									}).error(function(ex) {
										if (ex.error.response_code == '1000') {
											alert(ex.error.response_msg);
										} else {
											ajaxResponseErrorHandler(ex, function() {});
										}
									});
								}
							} else {
								var params = '?' + $scope.baseParam;
								params += "&targetUrl=" + encodeURIComponent(location.href);

								// 20160511 박형윤 제휴 팝업 로그인 이후 자동 발급 추가
								LotteStorage.setSessionStorage("alliancePopupPPPSN", $scope.mainPop.ppp_sn);

								location.href = LotteCommon.loginUrl + params;
							}
						};

						// 팝업 데이터가 유효할 때
						$scope.cookieName = $scope.mainPop.cookie_nm;

						// 20160511 박형윤 제휴 팝업 로그인 이후 자동 발급 추가
						if (LotteStorage.getSessionStorage("alliancePopupPPPSN") != null && $scope.loginInfo.isLogin) {
							$scope.dupCouponIssue($scope.mainPop.cpn_no);
						} else {

							if (!($scope.screenType > 1 && attr.pppTgtPgCd == 10)) { // 임시 메인 팝업 태블릿 제외처리 추가
                                //특정파라미터에서는 안뜨도록 추가 
                                if($scope.nopopup == undefined){
								    $scope.isOpenPop = true;
								    $scope.popOpen();
                                }
							}
						}

						LotteStorage.delSessionStorage("alliancePopupPPPSN");
					}
				}).error(function (data) {
					console.log('Error Data :  메인팝업');
				});
			}
			loadMainPopData();
		};
	}]);

	popModule.config(['$compileProvider' , function ($compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/); // unsafe: 제거 AppExec.appExecute()
	}]);

	popModule.directive('lotteMainPopup', ['$window', function ($window) {
		return {
			templateUrl: '/lotte/resources_dev/layer/main_popup.html',
			controller: 'lotteMainPopCtrl',
			replace: true,
			link: function ($scope, el, attr) {
				$scope.isOpenPop = false;
				$scope.loadMainPopup(attr);
				$scope.couponBnrLink = function (obj){
                    if (obj.isOutLink) {
                        if (getScope().appObj.isApp) {
                            openNativePopup('', obj.lnk_url_addr);
                        } else {
                            window.open(obj.lnk_url_addr);
                        }
                    } else {
						location.href = $scope.baseLink(obj.lnk_url_addr);
                    }
				};
			}
		};
	}]);

	// 앱다운로드 유도 팝업 Ctrl
	popModule.controller('appDownBnrCtrl', ['$scope', 'AppDownBnrService', function ($scope, AppDownBnrService) {
		$scope.appBnrInfo = null;

		AppDownBnrService.appDownSettingData().then(function (data) {
			$scope.appBnrInfo = data;
            //console.log(data, "---");
		});
	}]);

	// 앱다운로드 유도 팝업 Dir
	popModule.directive('appDownBnr', ['$location', 'LotteLink', 'LotteStorage', 'AppDownBnrService', function ($location, LotteLink, LotteStorage, AppDownBnrService) {
		return {
			templateUrl: '/lotte/resources_dev/layer/app_down_bnr.html',
			controller: 'appDownBnrCtrl',
			replace: true,
			link: function ($scope, el, attr) {
                //20181016 앱딥링 대신 새창으로 연결 
                $scope.appDown_pop = function(){
                    if(AppDownBnrService.appDownBnrInfo.linkUrl !=  "./"){
                        window.open(AppDownBnrService.appDownBnrInfo.linkUrl);
                    }
                }
				// 앱 딥링크
				$scope.appDown = function () {
					var deepLink = null,
						linkUrl = AppDownBnrService.appDownBnrInfo.linkUrl + "",
						tclick = AppDownBnrService.appDownBnrInfo.tclick != "" ? AppDownBnrService.appDownBnrInfo.tclick : null;

					if (linkUrl != "./") { // 지정 페이지로 딥링크 (./는 현재 페이지로 딥링크로 인식)
						if (linkUrl.substring(0, 4) == "http") {
							deepLink =  AppDownBnrService.appDownBnrInfo.linkUrl;
						} else {
							if (linkUrl.substring(0, 1) == "/") {
								deepLink = $location.protocol() + "://" + $location.host() + linkUrl;
							} else {
								deepLink = $location.protocol() + "://" + $location.host() + "/" + linkUrl;
							}
						}
					}

					if (tclick) { // 티클릭 수집
						$scope.sendTclick(tclick);
					}
                    
                    LotteLink.appDeepLink("lotte", deepLink, null, AppDownBnrService.appDownBnrInfo.referrer); // (target, deepLinkUrl, tclick, referrer)   
				};

				// 앱 다운 배너 감추기
				$scope.appDownBnrClose = function () {
					LotteStorage.setSessionStorage("appDownBnrHide", true);
					AppDownBnrService.appDownBnrInfo.isShowFlag = false;
					return false;
				};
			}
		};
	}]);
})(window, window.angular); 