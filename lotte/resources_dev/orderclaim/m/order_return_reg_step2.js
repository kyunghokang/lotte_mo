(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('OrderReturnReg2Ctrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "order_return_reg_step2"; //서브헤더 타이틀
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/orderclaim/m/order_return_reg_step2_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);