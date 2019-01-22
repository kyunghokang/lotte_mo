(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter'
	]);
	
	app.controller('giftSaunCtrl', ['$scope', '$http', '$filter', '$window', function ($scope, $http, $filter, $window) {
		//----------------------------------------------------------------------------------------------------
		// 변수 선언
		//----------------------------------------------------------------------------------------------------
		$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)
		$scope.subTitle = "설연휴 현물지급 구매사은 이벤트"; // 서브헤더 타이틀
		$scope.isWishDebug = false; // UI 디버깅용
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.isShowThisSns = false; // 공유버튼

		// 바닥 페이지에서 공유하기 필요시
		$window.eventSharePos = function () {
			if (angular.element("#head_sub > p > a[ng-click='showSharePop()']").length > 0) {
				angular.element("#head_sub > p > a[ng-click='showSharePop()']").trigger("click");
			}
		};
	}]);	
	
})(window, window.angular);