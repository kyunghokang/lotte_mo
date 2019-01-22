(function(window, angular, undefined) {
	'use strict';

	/*
	var sideMylotteModule = angular.module('lotteSideMylotte', []);
	sideMylotteModule.myLotteLinkObj ; 

	sideMylotteModule.directive('lotteSideMylotte', ['$location', '$window','$http', '$timeout' ,'LotteCommon', 'LotteUtil', 'LotteStorage', 'commInitData', function($location, $window,$http, $timeout, LotteCommon, LotteUtil, LotteStorage, commInitData) {
		return {
			templateUrl:'/lotte/resources_dev/layout/lotte_side_mylotte.html',
			replace:true,
			link:function($scope, el, attrs){
				console.log("lotteSideMylotte");
				// ios 뒤로가기 history 초기화 위함
				el.find("a").click(function(){
					$scope.closeSideMylotte();
				});

				$scope.isOpenOrdCon = false;
				
				// 하단 마이페이지 열기
				$scope.mylotteBool = true; // IOS앱이 뻗는 상황을 막기 위함
				$scope.isShowSideMylotte = false;
				
				$scope.$watch("isShowSideMylotte", function(newVal) {
					console.log("mylotte: "+newVal)
				});
				$scope.minHeightMylotteClose = function(){
					$timeout(function(){
						if (angular.element($window).height() <= 460) {
							$scope.closeSideMylotte();
						}
					},300);
				}
				angular.element($window).on('orientationchange resize',function(){
					$scope.minHeightMylotteClose();
				});
				$scope.openSideMylotte = function() {
					el.show();
					if (angular.element($window).height() >= 460) {
						if($scope.isShowSideMylotte) {
							$scope.closeSideMylotte();
							return true;
						}
						if($scope.appObj.isOldApp){
							LotteUtil.elementMoveY(el, -100, -460, 15);
						}else{
							LotteUtil.elementMoveY(el, -100, -510, 15);
						}
						if (!$scope.isShowSideMylotte) {
							commModule.scrollY = parseInt(LotteStorage.getSessionStorage('m_nowScrollY'));
							$scope.isShowSideMylotte = true;
						} else {
							window.scrollTo(0, commModule.scrollY);
							$scope.isShowSideMylotte = false;
						}
						$scope.isShowMyLotteLoading = true; // 마이롯데 로딩바
						$scope.getMylotteData(0);
					} else {
						location.href = LotteCommon.mylotteUrl + "?" + $scope.baseParam + "&tclick=m_q_mylotte";
						return false;
					}
					$scope.dimmedOpen({
						target:"mylotte",
						callback: this.closeSideMylotte,
						scrollEventFlag : true
					});
				};
				
				$scope.getMylotteData = function (procCnt) {
					if ($scope.mylotteBool) {
						$scope.mylotteBool = false;
						try {
							$http.get(LotteCommon.mylotteLayerData + '?' + $scope.baseParam + '&viewGoods=' + localStorage.getItem("viewGoods") + '&amlist=' + localStorage.getItem("amlist"))
							.success(function (data) {
								// 로그인 후 메뉴 호출시 로딩바 노출 허용
								// loadingBar.classList.add( 'none' ) ;
								$scope.isShowMyLotteLoading = false;
								$scope.loginAction = data.obj;
								$scope.lateAction = data.obj.late_prod.items;
								// 액션바 클릭 시 데이터 호출. 후처리 스크립트 추가
								localStorage.setItem("amlist", data.obj.alarm_txt);
								localStorage.setItem("viewGoods", data.obj.late_prod_txt);

								// 20160129 박형윤 마이레이어 알림갯수, 최근본 상품 http/https간 호환문제로 추가
								$scope.shareStorage("local", "amlist", data.obj.alarm_txt, "amlistStorage");
								$scope.shareStorage("local", "viewGoods", data.obj.late_prod_txt, "viewGoodsStorage");

								setTimeout(function () {
									$scope.mylotteBool = true;
									if (isApp && isAndroid) {
										$scope.sendTclick('m_app_actionbar_my_and');
									} else if (isApp && isIOS) {
										$scope.sendTclick('m_app_actionbar_my_ios');
									} else {
										$scope.sendTclick('m_actionbar_my');
									}
								}, 500);
							}).error(function (data) {
								console.log('Error Data :  mylotteLayerData');
								$scope.mylotteBool = true;
								procCnt++;

								if ( procCnt < 3 ) {
									setTimeout(function () {
										$scope.getMylotteData(procCnt)
									}, 3000);
								} else {
									$scope.isShowMyLotteLoading = false;
									alert("데이터 로딩에 실패했습니다.");
									$scope.closeSideMylotte();
								}
							});                     
						} catch (e) {
							log.error(e.message, e);
						}
					}
				};
				
				// 하단 마이롯데 레이어 닫기
				$scope.closeSideMylotte = function () {
					if ($scope.isShowSideMylotte) {
						// dimmedClose({target : "mylotte"});
						if ($scope.LotteDimm.target == "mylotte") {
							$scope.dimmedClose();
						}

						LotteUtil.elementMoveY(el, -510, 0, 15);

						$timeout(function () {
							$scope.isShowSideMylotte = false;
							$scope.$apply();
						});
					}
				};

				commModule.closeSideMylotte = $scope.closeSideMylotte;
				
				$scope.openOrdCon = function (e) {
					var $targ = $(e.target).parent().parent().find('> li:gt(5):lt(3)');
					if ($scope.isOpenOrdCon == false) { // open
						$scope.isOpenOrdCon = true;
						$targ.stop().animate({'margin-top' : 43}, 100);
					} else { // close
						$scope.isOpenOrdCon = false;
						$targ.stop().animate({'margin-top' : 0}, 100);
					}
				};

				$scope.goSmartAlarm = function () {
					$window.location.href = LotteCommon.smartAlarmUrl + "?" + $scope.baseParam + "&tclick=m_my_customizing_0108&curDispNoSctCd=22";
				};

				$scope.callCustmercenter = function () {
					$scope.sendTclick("m_mylayer_customercenter");
					location.href="tel:1577-1110";
				};

				// 액션바 tclick 앱일 경우 IOS/Android 티클릭
				$scope.cartListTclick = "m_actionbar_cartlist";
				$scope.purchaseListTclick = "m_actionbar_purchaselist";

				if (isApp && isAndroid) {
					$scope.cartListTclick = "m_app_actionbar_cartlist_and";
					$scope.purchaseListTclick = "m_app_actionbar_purchaselist_and";
				} else if (isApp && isIOS) {
					$scope.cartListTclick = "m_app_actionbar_cartlist_ios";
					$scope.purchaseListTclick = "m_app_actionbar_purchaselist_ios";
				}

				$scope.myLotteLinkObj = {
					'cateLstUrl' : LotteCommon.cateLstUrl + "?" + $scope.baseParam+"&tclick=" + $scope.cartListTclick,
					'ordLstUrl' : LotteCommon.ordLstUrl + "?" + $scope.baseParam+"&fromPg=3&tclick=" + $scope.purchaseListTclick + "&ordListCase=1",
					'gdBenefitUrl' : LotteCommon.gdBenefitUrl + "?" + $scope.baseParam+"&tclick=m_mylayer_sogoodbenefit",
					'mylotteUrl' : LotteCommon.mylotteUrl + "?" + $scope.baseParam+"&tclick=m_mylayer_mylotte",
					'myCouponUrl' : LotteCommon.pointInfoUrl + "?" + $scope.baseParam+"&point_div=coupon&tclick=m_mylayer_coupon",
					'smartAlarmUrl' : LotteCommon.smartAlarmUrl + "?" + $scope.baseParam+"&curDispNoSctCd=22&tclick=m_mylayer_alarmlist",
					'wishLstUrl' : LotteCommon.wishLstUrl + "?" + $scope.baseParam+"&tclick=m_mylayer_wishlist",
					'ordLst2Url' : LotteCommon.ordLstUrl + "?" + $scope.baseParam+"&fromPg=3&tclick=m_mylayer_purchaselist&ordListCase=1",
					'ordCancelUrl' : LotteCommon.ordCancelUrl + "?" + $scope.baseParam+"&fromPg=3&tclick=m_mylayer_purchasechange&ordListCase=3",
					'questionUrl' : LotteCommon.questionUrl + "?" + $scope.baseParam+"&tclick=m_mylayer_question",
					'smartpayUrl' : LotteCommon.smartpayUrl + "?" + $scope.baseParam+"&tclick=m_mylayer_smartpay",
					'lateProdUrl' : LotteCommon.lateProdUrl + "?" + $scope.baseParam + "&tclick=m_mylayer_recentviewprodmore&viewGoods="+localStorage.getItem("viewGoods"),
					'critViewUrl' : LotteCommon.critViewUrl + "?" + $scope.baseParam+"&tclick=m_q_goodscomment",
					'ordChangeUrl' : LotteCommon.ordChangeUrl + "?" + $scope.baseParam+"&fromPg=3&tclick=m_q_orderchange&ordListCase=2",
					'prdReturnUrl' : LotteCommon.prdReturnUrl + "?" + $scope.baseParam+"&fromPg=3&tclick=m_q_exchange&ordListCase=4",
					'directAttendUrl' : LotteCommon.directAttendUrl + "?" + $scope.baseParam+"&tclick=m_q_attend",
					'appPresentUrl' : LotteCommon.appPresentUrl + "?spdp_no=5380051&" + $scope.baseParam,
					'custcenterUrl' : LotteCommon.custcenterUrl + "?" + $scope.baseParam+"&tclick=m_mylayer_customercenter",
					'myLpointUrl' : LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=lt_point&tclick=m_mylayer_lpoint",
					'myLmoneyUrl' : LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=l_point&tclick=m_mylayer_lmoney",
					'talkUrl' : LotteCommon.talkUrl + "?" + $scope.baseParam + "&tclick=m_mylayer_talk" // 톡(채팅) 하기 URL
				};
				sideMylotteModule.myLotteLinkObj = $scope.myLotteLinkObj ; 
				// 최근상품 더보기 링크 (IOS에서 historyback 캐시오류)
				$scope.lateProdView = function(){
					$scope.closeSideMylotte();
					setTimeout(function(){
						$window.location.href  = LotteCommon.lateProdUrl + "?" + $scope.baseParam + "&tclick=m_mylayer_recentviewprodmore&viewGoods="+localStorage.getItem("viewGoods");
					});
				}                
			}
		};
	}]);
	*/

})(window, window.angular);