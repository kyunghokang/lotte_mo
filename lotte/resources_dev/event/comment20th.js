(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter'
	]);
	
	app.controller('comment20thCtrl', ['$scope', '$http', '$filter', '$window', function($scope, $http, $filter, $window) {
		//----------------------------------------------------------------------------------------------------
		// 변수 선언
		//----------------------------------------------------------------------------------------------------
		$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)
		$scope.subTitle = "롯데닷컴 20주년 기념 이벤트"; /*서브헤더 타이틀*/
		$scope.isWishDebug = false; // UI 디버깅용
		$scope.showWrap = true;
		$scope.contVisible = true;
	}]);	
	
})(window, window.angular);