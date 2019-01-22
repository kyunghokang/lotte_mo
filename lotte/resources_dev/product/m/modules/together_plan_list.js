/**
 * [상품상세] 함께 볼만한 기획전
 * product module: together-plan-list
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('togetherPlanList', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/together_plan_list.html",
				replace : true,
				link : function ($scope, el, attrs) {
					// $scope.prdTogePlanTotalCnt = 0;
					$scope.prdTogePlanCurIdx = 0;
					$scope.prdTogePlanSwipeEnd = function (idx) {
						$scope.prdTogePlanCurIdx = idx;
					};
					
					function setData(data, cnt) { // 리턴 받은 데이터에서 cnt개만 담기
						if (data.items.length % 2 == 1) { // 짝수개로 노출되도록 수정
							data.items = data.items.slice(0, data.items.length - 1);
						}

						data.items = data.items.slice(0, cnt);
						$scope.pageUI.loadData.product_togePlan = data;
					}

					function setDigit(val) {
						return (("" + val).length  == 1) ? "0" + val : val;
					}

					$scope.loadProductTogePlan = function() {
						if(!$scope.pageUI.isLoad.product_togePlan) {
							if($scope.pageUI.data.callUrlInfo.recommSpdpInfoUrl) {
								$scope.pageUI.isLoad.product_togePlan = true;
								
								//var recobellUrl = LotteCommon.salebestPaln_url + "&iids=" + $scope.pageUI.data.commonInfo.goodsNo;
								var recobellUrl = LotteCommon.rec_plan + "&size=10&iids="+ $scope.pageUI.data.commonInfo.goodsNo;
                                var recommSpdpInfoUrl = LotteCommon.isTestFlag ? LotteCommon.recommSpdpInfoUrl : $scope.pageUI.data.callUrlInfo.recommSpdpInfoUrl;

								$.ajax({
									type: LotteCommon.isTestFlag ? "get" : "post",
									async: true,
									url: recobellUrl,
									dataType: LotteCommon.isTestFlag ? "json" : "jsonp",
									success: function (data) {
										var itemArr = [],
											i = 0;
										
										if (data.results && data.results.length > 0) {
											for (i; i < data.results.length; i++) {
												itemArr.push((data.results[i].itemId + "").trim());
											}

											$http.get(recommSpdpInfoUrl, {
												params: {
													spdp_no_list: itemArr.join(",")
												}
											})
											.success(function (data) {
												if (data.data) {
													 $scope.pageUI.loadData.product_togePlan = data.data;
													//setData(data.data, 6);

													// $scope.prdTogePlanTotalCnt = Math.ceil($scope.pageUI.loadData.product_togePlan.items.length / 2);
												}
											})
											.error(function (data) {
												console.warn("추천기획전 조회 오류");
											});
										}
									},
									error: function (data, status, err) {
										console.warn("레코벨 추천기획전 조회 오류");
									}
								});
							}
						}
					};

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLoad.product_togePlan===true){ return; }
						if (args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							console.log("product togePlan load");
							$scope.loadProductTogePlan();
							//$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo +'_Clk_load'+$scope.numberFill(($scope.moduleData.uiData.page+1),2));
						}
					});
					
					$scope.togePlanGoPlanshop = function (item, idx) {
						var tclick = "m_RDC_ProdDetail_Swp_RelPlan_Ban",
							reco = "";

						if ((item.linkUrl).indexOf("_reco=M_plan_detail") > -1) {
							tclick = "m_RDC_ProdDetail_Swp_RelRecoPlan_Ban";
							reco = "&_reco=M_plan_detail";
						}

						//20180830 GA태깅 추가
						$scope.logGAEvtPrdView('함께볼만한기획전', setDigit(idx + 1), item.btmTxt);

						$window.location.href = $scope.baseLink(item.linkUrl)
							+ "&tclick=" + tclick + setDigit(idx + 1) + reco;
					};

					$scope.getPageGroup = function (itemLength, pageSize) {
						var pageList = [];

						for (var i = 0;i < itemLength / pageSize; i++) {
							pageList.push(i);
						}

						//console.log('pageList', itemLength, pageSize, pageList);
						return pageList;
					};

				}
			}
	}]);

	app.filter('paging', [function () {
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
})(window, window.angular);