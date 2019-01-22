(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2159Container', ['$rootScope', '$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil','commInitData', 
	function ($rootScope, $http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil,commInitData) {
		return {
			restrict: 'AEC',
			scope: { moduleData:"=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2159.html",
            replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.benefitData = $scope.moduleData;
				$scope.linkClick = function(linkUrl, tclick) {
					console.log('linkClick', linkUrl);
					$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick + "&" + getScope().baseParam);
				};
			}
		}
	}]);
})(window, window.angular);