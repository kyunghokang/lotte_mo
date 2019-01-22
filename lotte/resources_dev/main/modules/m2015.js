(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2015Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2015.html",
            replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				var autoplay = 1;
				setTimeout(function(){ autoVideoPlay('autoVideo1', '#autoVideo1', false, autoplay); }, 1500);

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

	app.filter('trusted', ['$sce', function ($sce) { 
		return function(url) { 
			return $sce.trustAsResourceUrl(url); 
		};
	}]);

})(window, window.angular);