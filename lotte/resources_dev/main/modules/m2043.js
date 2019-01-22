(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2043Container', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2043.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.loginInfo = $scope.rScope.loginInfo;
				
				$scope.prdData = {};

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
						$scope.prdData = data.data;
					})
					.finally(function () {
					});
				};
				
				$scope.loadData();

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