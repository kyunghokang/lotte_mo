(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);
    
    app.controller('appDownKtCtrl', ['$scope', '$http', '$filter', '$window', function($scope, $http, $filter, $window) {
    	//----------------------------------------------------------------------------------------------------
        // 변수 선언
        //----------------------------------------------------------------------------------------------------
    	$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)
    	$scope.subTitle = "신규 앱 다운로드 이벤트"; /*서브헤더 타이틀*/
    	$scope.isWishDebug = false; // UI 디버깅용
        $scope.showWrap = true;
        $scope.contVisible = true;
    }]);	
    
})(window, window.angular);