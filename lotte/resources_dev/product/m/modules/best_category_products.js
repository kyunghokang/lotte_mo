/**
 * [상품상세] 다른 고객이 많이 산 상품
 * product module: best-category-products
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('bestCategoryProducts', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/best_category_products.html",
				replace : true,
				link : function ($scope, el, attrs) {
					
					function setData(data, cnt) { // 리턴 받은 데이터에서 cnt개만 담기
						data.prdList.items = data.prdList.items.slice(0, cnt);
						$scope.pageUI.loadData.product_saleBest = data;
					}

					$scope.loadProductSaleBest = function() {
						if(!$scope.pageUI.isLoad.product_saleBest) {
							if($scope.pageUI.data.callUrlInfo.saleBestInfoUrl) {
								//var recobellUrl = LotteCommon.salebestlist_url + "&iids=" + $scope.pageUI.data.commonInfo.goodsNo;
                                var recobellUrl = LotteCommon.rec_good + "&size=15&iids="+ $scope.pageUI.data.commonInfo.goodsNo;
								var saleBestUrl = LotteCommon.isTestFlag ? LotteCommon.productSaleBestData : $scope.pageUI.data.callUrlInfo.saleBestInfoUrl;

								$scope.pageUI.isLoad.product_saleBest = true; // 데이터 로드 체크 Flag

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

											$http.get(saleBestUrl, {
													params: {
														goods_no: $scope.pageUI.data.commonInfo.goodsNo,
														goodsRelList: itemArr.join(",")
													}
												})
												.success(function (data) {
													if (data.data) {
														setData(data.data, 15);
														// $scope.pageUI.loadData.product_saleBest = data.data;
													}
												})
												.error(function (data) {
													console.error("다른 고객들이 많이 산 (카테고리) 상품 조회 오류");
												});
										}
									},
									error: function (data, status, err) {
										console.error("레코벨 데이터 호출 오류, 현재 상품번호만으로 호출");
										$http.get(saleBestUrl, {
												params: {
													goods_no: $scope.pageUI.data.commonInfo.goodsNo
												}
											})
											.success(function (data) {
												if (data.data) {
													setData(data.data, 15);
													// $scope.pageUI.loadData.product_saleBest = data.data;
												}
											})
											.error(function (data) {
												console.error("다른 고객들이 많이 산 (카테고리) 상품 조회 오류");
											});
									}
								});
							}
						}
					};

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLoad.product_saleBest===true){ return; }
						if (args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							console.log("product saleBest load");
							$scope.loadProductSaleBest();
							//$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo +'_Clk_load'+$scope.numberFill(($scope.moduleData.uiData.page+1),2));
						}
					});
				}
			}
	}]);
})(window, window.angular);