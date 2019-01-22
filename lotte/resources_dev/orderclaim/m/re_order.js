(function(window, angular, undefined) {
	'use strict';
	
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		'lotteCommFooter'
	]);
	
	app.controller('ReOrderCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "부분반품재결제";//서브헤더 타이틀
	}]);
	
	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/orderclaim/m/re_order_container.html',
			replace : true,
			link : function($scope, el, attrs) {
			}
		};
	});

})(window, window.angular);