(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('{%= controller_name %}Ctrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "{%= job_name %}"; //서브헤더 타이틀
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '../resources_dev/{%= folder_name %}/{%= file_name %}_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);