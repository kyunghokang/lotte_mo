(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2042Container', ['$rootScope', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($rootScope, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2042.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
					
				$scope.dispNoClick = function(dispNo, idx) {
					if(dispNo) {
						window.location.href =  LotteUtil.setUrlAddBaseParam( LotteCommon.mainUrl + "?dispNo=" + dispNo + "&" + $rootScope.pageUI.baseParam , "tclick=" + $scope.moduleData.tclick + '_'+ idx +'_Swp_more');
					}
					console.log(" DispNo Click : ", dispNo);
				};

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