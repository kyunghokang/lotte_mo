(function (window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter'
	]);
	
	app.controller('katalkCtrl', ['$scope', '$http', '$filter', '$window', function ($scope, $http, $filter, $window) {
		//----------------------------------------------------------------------------------------------------
		// 변수 선언
		//----------------------------------------------------------------------------------------------------
		$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)
		$scope.subTitle = "공짜라면, 친구초대!"; // 서브헤더 타이틀
		$scope.isWishDebug = false; // UI 디버깅용
		$scope.showWrap = true;
		$scope.contVisible = true;
	}]);	
	
})(window, window.angular);