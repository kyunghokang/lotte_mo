(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2006Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 
		function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				restrict: 'AEC',
				scope: { moduleData : "=" },
				replace : true,
				controller: 'lotteModulesCtrl',
				templateUrl : "/lotte/resources_dev/main/modules/m2006.html",
				link : function ($scope, el, attrs) {
					
					// Google Analytics Event Tagging
					$scope.logGAEvtModuleEach = function (item, idx) {
						var index = idx;
						var label = item.cardTxt + " " + item.benefitTxt;
	
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