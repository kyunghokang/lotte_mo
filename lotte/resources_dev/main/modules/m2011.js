(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2011Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2011.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {

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

	/*app.filter('showPair',function(){
		return function (items) {
			var filtered = [];

			console.log('items', items);

			/!*for (var i = 0; i < items.length; i++) {
				var item = items[i];
				console.log(item);

				if (i % 2 == 1){ // 2개 쌍으로 리턴하기 위해
					filtered.push(item[i-1]);
					filtered.push(item[i]);
				}
			}
			return filtered;*!/
		}
	});*/

})(window, window.angular);