(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2003Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 
		function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2003.html",
            replace : true,
            controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function () {
					var index = '더보기';
					var label = $scope.moduleData.txt ? $scope.moduleData.txt : "";

					// if (idx != "-") {
					// 	index = LotteUtil.setDigit(idx);
					// }

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);
})(window, window.angular);