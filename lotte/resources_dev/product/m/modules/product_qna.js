/**
 * [상품상세] QnA
 * product module: product-qna
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('productQna', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/product_qna.html",
				replace : true,
				link : function ($scope, el, attrs) {

					$scope.loadProductQnA = function() {
						if(!$scope.pageUI.isLoad.product_qna) {
							if($scope.pageUI.data.callUrlInfo.qnaInfoUrl) {
								$scope.pageUI.isLoad.product_qna = true;
								var url = LotteCommon.isTestFlag ? LotteCommon.productQnAData : $scope.pageUI.data.callUrlInfo.qnaInfoUrl;
								$http.get(url)
									.success(function (data) {
										if(data.data) {
											$scope.pageUI.loadData.product_qna = data.data;
										}
									});
							}
						}
					}

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLoad.product_qna===true){ return; }
						if (args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							console.log("product qna load");
							$scope.loadProductQnA();
							//$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo +'_Clk_load'+$scope.numberFill(($scope.moduleData.uiData.page+1),2));
						}
					});

					/*$scope.productInfoDetailMore = function() {
					 $scope.pageUI.productInfoMoreBtn = false;
					 }*/

					$scope.moreQuestion = function(){
						angular.element('.qna_area li .question .qtLongTxt').eq(this.$index).show();
						angular.element('.qna_area li .question .qtShortTxt').eq(this.$index).hide();
					}
					$scope.moreAnswer = function(){
						angular.element('.qna_area li .answer .asLongTxt').eq(this.$index).show();
						angular.element('.qna_area li .answer .asShortTxt').eq(this.$index).hide();
					}

				}
			}
			
	}]);

	app.filter('qtShortTxt', function(){
		return function (txt) {
			return txt.substring(0, 73);
		}
	});
	app.filter('asShortTxt', function(){
		return function (txt) {
			return txt.substring(0, 46);
		}
	});
	
})(window, window.angular);