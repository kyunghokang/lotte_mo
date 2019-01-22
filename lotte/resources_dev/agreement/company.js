(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg', 
        // 'lotteSideMylotte', 
        'lotteCommFooter'
    ]);

    app.controller('CompanyCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon){
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "회사소개"; /*서브헤더 타이틀*/
    }]);

    app.directive('lotteContainer', function(){
        return {
            templateUrl: '/lotte/resources_dev/agreement/company_container.html',
            replace:true,
            link:function($scope, el, attrs){
            }
        };
    });

})(window, window.angular);