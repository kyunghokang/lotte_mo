(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2001Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage',
    	function($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage) {
        return {
        	restrict: 'AEC',
            templateUrl : '/lotte/resources_dev/main/modules/m2001.html',
            replace : true,
            scope: { moduleData : "=" },
            link : function($scope, el, attrs) {
            }
        };
    }]);
})(window, window.angular);