/**
 * [상품상세] 하단 배너
 * product module: product-bottom-banner
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('productBottomBanner', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/product_bottom_banner.html",
				replace : true,
				link : function ($scope, el, attrs) {

					$scope.loadProductBottomBanner = function() {
						if(!$scope.pageUI.isLoad.product_bottom_banner) {
							console.info($scope.pageUI.data.callUrlInfo.footerBannerInfoUrl);
							if($scope.pageUI.data.callUrlInfo.footerBannerInfoUrl) {
								$scope.pageUI.isLoad.product_bottom_banner = true;
								var url = LotteCommon.isTestFlag ? LotteCommon.productBottomBannerData : $scope.pageUI.data.callUrlInfo.footerBannerInfoUrl;
								$http.get(url)
								.success(function (data) {
									if(data.data) {
										$scope.pageUI.loadData.product_bottom_banner = data.data;
									}
								});
							}
						}
					}

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLoad.product_bottom_banner===true){ return; }
						if (args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							$scope.loadProductBottomBanner();
						}
					});
				}
			}
			
	}]);
	
})(window, window.angular);