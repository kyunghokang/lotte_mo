// M08 프로모션배너 C형..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2083Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 
		function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				restrict: 'AEC',
				scope: { moduleData : "=" },
				templateUrl : "/lotte/resources_dev/main/modules/m2083.html",
				replace : true,
				controller: 'lotteModulesCtrl',
				link : function ($scope, el, attrs) {

					// Google Analytics Event Tagging
					$scope.logGAEvtModuleEach = function (item) {
						var index = "";
						var label = item.btmTxt ? item.btmTxt : "";
	
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