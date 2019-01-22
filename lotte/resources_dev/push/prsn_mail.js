(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);
    
    app.controller('prsnMailCtrl', ['$scope', '$http', '$filter', '$window', '$timeout', function($scope, $http, $filter, $window, $timeout) {
    	//----------------------------------------------------------------------------------------------------
        // 변수 선언
        //----------------------------------------------------------------------------------------------------
    	$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)
    	$scope.subTitle = "추천 알림"; /*서브헤더 타이틀*/
    	$scope.isWishDebug = false; // UI 디버깅용
        $scope.showWrap = true;
        $scope.contVisible = true;
        
        $timeout(function(){
        	angular.element('.apppush_wrap_v2').append('<div class="more_recom_wrap"><a href="/mylotte/m/myfeed.do?' + $scope.baseParam + '&tclick=m_DC_personalpush_Clk_more" class="btn_more_recom"><span>더 많은 추천을 원하신다면? &gt;</span></a></div>');
        }, 3000);
    }]);	
    
})(window, window.angular);