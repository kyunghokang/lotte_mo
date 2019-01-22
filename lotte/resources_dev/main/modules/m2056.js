(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2056Container', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 
	function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2056.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.prdData = {};

				// Data Load
				$scope.loadData = function () {
					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2056.json" : $scope.moduleData.jsonCallUrl;
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
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabNm) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";

					if (idx != "-") {
						index = LotteUtil.setDigit(idx);
					}

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label, tabNm);
				};
			}
		}
	}]);
})(window, window.angular);