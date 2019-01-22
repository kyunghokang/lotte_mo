(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('lpayG', ['$http', '$scope', 'LotteCommon', function($http, $scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "L.pay 간편결제 신청/수정"; // 서브헤더 타이틀
        $scope.screenID = "L.pay 간편결제 신청/수정"; // 스크린 아이디 
        
        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
        	}
        	$scope.screenData = {
        		page: 0,
        		pageSize: 20,
        		pageEnd: false
        	}
        })();
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/lpay_web_mng_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);