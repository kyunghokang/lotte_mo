// M63 인기카테고리..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2063Container', ['LotteUtil', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage',
	function (LotteUtil, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2063.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);

				$scope.showSideCtgHeader = function(tclick){
					$scope.rScope.sendTclick(tclick);
					$scope.rScope.showSideCtgHeader();
				};

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