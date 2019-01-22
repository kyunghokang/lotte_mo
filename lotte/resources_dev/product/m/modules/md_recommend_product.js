/**
 * [상품상세] MD가 추천하는 상품
 * product module: md-recommend-product
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('mdRecommendProduct', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/md_recommend_product.html",
				replace : true,
				link : function ($scope, el, attrs) {
					// $scope.pageUI.loadData.product_mdRecom.mdRecomProdTitle = "MD가 추천한 상품";
					// $scope.pageUI.loadData.product_mdRecom.mdRecomType = "md"; // md: md가 추천한 상품, other: 다른 고객들이 함께 찾은 상품

					if ($scope.pageUI.loadData.product_mdRecom && !$scope.pageUI.loadData.product_mdRecom.mdRecomProdTitle) {
						$scope.pageUI.loadData.product_mdRecom.mdRecomProdTitle = "MD가 추천한 상품";
					}

					if ($scope.pageUI.loadData.product_mdRecom &&!$scope.pageUI.loadData.product_mdRecom.mdRecomType) {
						$scope.pageUI.loadData.product_mdRecom.mdRecomType = "md";
					}

					function setData(data, cnt) { // 리턴 받은 데이터에서 cnt개만 담기
						if (data.prdList && data.prdList.items) {
							var tempData = isSlicePlanPrd(data.prdList.items);
							data.prdList.items = tempData.slice(0, cnt);
							$scope.pageUI.loadData.product_mdRecom = data;
						}
					}

					function isSlicePlanPrd(data) { // 기획전형 상품 제거
						var rtnData = [],
							i = 0;
						
						for (i; i < data.length; i++) {
							if (!data[i].isPlanPrd) {
								rtnData.push(data[i]);
							}
						}

						return rtnData;
					}

					$scope.loadProductMDRecom = function() {
						if(!$scope.pageUI.isLoad.product_mdRecom) {
							if($scope.pageUI.data.callUrlInfo.mdRecommPrdInfoUrl) {
								$scope.pageUI.isLoad.product_mdRecom = true;
								
								var url = LotteCommon.isTestFlag ? LotteCommon.productMDRecomData : $scope.pageUI.data.callUrlInfo.mdRecommPrdInfoUrl;
								$http.get(url)
								.success(function (data) {
									if (data.data && data.data.prdList && data.data.prdList.items && data.data.prdList.items.length > 0) {
										setData(data.data, 15);
										$scope.pageUI.loadData.product_mdRecom.mdRecomType = "md";
										$scope.pageUI.loadData.product_mdRecom.mdRecomProdTitle = "MD가 추천한 상품";
									} else { // MD 추천 상품이 없을 경우 레코벨 다른고객이 함께 찾은 상품 데이터 로드
										otherBuyInfoLoad();
									}
								})
								.error(function (data) {
									console.warn("MD가 추천한 상품 데이터 오류");
									otherBuyInfoLoad();
								});
							}
						}
					};

					function otherBuyInfoLoad() {
						if ($scope.pageUI.data.callUrlInfo.otherBuyInfoUrl) {
							var recobellUrl = LotteCommon.recobellOtherBuyInfoUrl + "&iids=" + $scope.pageUI.data.commonInfo.goodsNo;
							var otherBuyInfoUrl = LotteCommon.isTestFlag ? LotteCommon.otherBuyInfoUrl : $scope.pageUI.data.callUrlInfo.otherBuyInfoUrl;
							
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
											itemArr.push(data.results[i].itemId);
										}

										$http.get(otherBuyInfoUrl, {
											params: {
												goodsRelList: itemArr.join(",")
											}
										})
										.success(function (data) {
											if (data.data) {
												// $scope.mdRecomProdTitle = "다른 고객들이 함께 찾은 상품";
												setData(data.data, 6);
												$scope.pageUI.loadData.product_mdRecom.mdRecomProdTitle = "다른 고객들이 함께 찾은 상품";
												$scope.pageUI.loadData.product_mdRecom.mdRecomType = "other";
											}
										})
										.error(function (data) {
											console.warn("다른 고객이 함께 찾은 상품 조회 오류");
										});
									} else {
										console.warn("레코벨 다른 고객이 함께 찾은 상품 없음");
									}
								},
								error: function (data, status, err) {
									console.warn("레코벨 다른 고객이 함께 찾은 상품 조회 오류");
								}
							});
						}
					}

					$scope.mdRecomAddCart = function (item) {
						var tclick = "m_RDC_ProdDetail_Swp_RelMD_Cart";

						console.log("$scope.pageUI.loadData.product_mdRecom.mdRecomType", $scope.pageUI.loadData.product_mdRecom.mdRecomType);

						if ($scope.pageUI.loadData.product_mdRecom.mdRecomType == "other") {
							tclick = "m_RDC_ProdDetail_Swp_Relcodi_Cart";
						}

						$scope.addCartOptionSelect(item, tclick);
					};

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLoad.product_mdRecom===true){ return; }
						if (args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							console.log("product mdRecom load");
							$scope.loadProductMDRecom();
							//$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo +'_Clk_load'+$scope.numberFill(($scope.moduleData.uiData.page+1),2));
						}
					});
				}
			}
	}]);
})(window, window.angular);