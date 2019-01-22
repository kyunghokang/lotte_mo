(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);
    
    app.controller('PurchaseViewCtrl', ['$scope', '$http', '$filter','$window', function($scope, $http, $filter, $window) {
    	//----------------------------------------------------------------------------------------------------
        // 변수 선언
        //----------------------------------------------------------------------------------------------------
    	$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)
    	
    	$scope.isWishDebug = false; // UI 디버깅용
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = '주문배송조회 상세'; // 서브헤더 타이틀
        $scope.wScroll = 0; // 윈도우 스크롤 높이

        var pop = $(".lg_deli_pop");

		// 로딩 후 컨텐츠 보이기
        angular.element($window).on('load', function() {	
		    //희망일배송 안내 팝업 열기
		    $(".lg_delivery a").on("click",function(){
            
		    	pop.css("display","block");
                $(".lgpop_dim").css("display","block");
                $scope.wScroll = angular.element($window).scrollTop();
                angular.element("body, html").css({"height":"100%","overflow":"hidden"});
                return false;
		    });
		    //희망일배송 안내 팝업 닫기
		    $(".lg_deli_pop a").on("click",function(){
                pop.css("display","none");
                angular.element("body, html").css({"height":"auto","overflow":"auto"});
				angular.element($window).scrollTop($scope.wScroll);
                $(".lgpop_dim").css("display","none");
                return false;
		    });
        });

    }]);	
})(window, window.angular);