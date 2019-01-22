(function(window, angular, undefined) {
	//'use strict';
	
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		'lotteCommFooter'
	]);
	
	app.controller('orderSimpleCompleteCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "order_simple_complete";//서브헤더 타이틀
	}]);

})(window, window.angular);