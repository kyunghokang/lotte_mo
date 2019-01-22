/**
 * [상품상세] 브랜드 베스트 상품
 * product module: brand-best
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('brandBest', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/brand_best.html",
				replace : true,
				link : function ($scope, el, attrs) {

					$scope.loadProductBrandBest = function() {
						if(!$scope.pageUI.isLoad.product_brandBest) {
							if($scope.pageUI.data.callUrlInfo.brandBestInfoUrl) {
								$scope.pageUI.isLoad.product_brandBest = true;
								var url = LotteCommon.isTestFlag ? LotteCommon.productBrandBestData : $scope.pageUI.data.callUrlInfo.brandBestInfoUrl;
								$http.get(url)
								.success(function (data) {
									if(data.data) {
										$scope.pageUI.loadData.product_brandBest = data.data;
										if($scope.pageUI.myBrandStr.indexOf("|"+$scope.pageUI.data.commonInfo.uprBrndNo+'|') >= 0 || $scope.pageUI.isMyBrand) {
											$scope.pageUI.loadData.product_brandBest.saveBrndYn = true;
										}										
									}
								});
							}
						}
					}

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLoad.product_brandBest===true){ return; }
						if (args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							console.log("product brandBest load");
							$scope.loadProductBrandBest();
							//$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo +'_Clk_load'+$scope.numberFill(($scope.moduleData.uiData.page+1),2));
						}
					});

					$scope.addBrandFavoriteClick = function(brndNo, brndNm){
						if($scope.pageUI.loadData.product_brandBest.saveBrndYn || $scope.pageUI.isMyBrand) {
							$scope.brandBookMark(brndNo, 'del', '', brndNm);
						} else {
							$scope.brandBookMark(brndNo, 'add', '', brndNm);
						}
					}
				}
			}
	}]);

	app.filter('txt7Length', function(){
		return function (txt) {
			return txt.substring(0, 7);
		}
	});
})(window, window.angular);