// M29 최근 본 상품 일반형
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2029Container', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 
	function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2029.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				
				$scope.limitToCnt = 0;
				$scope.latelyData = {};

				//alert($scope.moduleData.jsonCallUrl);
				// Data Load
				$scope.loadData = function () {
					var goodsItems = LotteStorage.getLocalStorage('latelyGoods');
					if(goodsItems == null || goodsItems == undefined) {
						return;
					}
					goodsItems = goodsItems.replace(/\|/ig,",");
					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2029.json" : $scope.moduleData.jsonCallUrl + "&latest_prod=" + goodsItems;
					var httpConfig = {
						method: "get",
						url: jsonUrl
					};

					$http(httpConfig) 
					.success(function (data) {
						if(data.data) {
							$scope.latelyData = data.data;
							/* DATA 3, 6개 단위로 뿌리기 */
							if($scope.latelyData.prdList.items.length >= 3){
								if($scope.latelyData.prdList.items.length/6 == 1){
									$scope.limitToCnt = 6;
								} else if($scope.latelyData.prdList.items.length/3 >= 1){
									$scope.limitToCnt = 3;
								}
							}
						}
					})
					.finally(function () {
					});
				};
				
				$scope.loadData();
				$scope.unitShow = true; //유닛 숨김처리

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";

					if (idx != "-") {
						index = LotteUtil.setDigit(idx);
					}

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);
})(window, window.angular);