(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2050Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage',
		function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage) {
			return {
				restrict: 'AEC',
				scope: { moduleData : "=" },
				templateUrl : "/lotte/resources_dev/main/modules/m2050.html",
				replace : true,
				controller: 'lotteModulesCtrl',
				link : function ($scope, el, attrs) {

				}
			}
		}]);
})(window, window.angular);