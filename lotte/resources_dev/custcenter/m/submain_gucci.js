(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('gucciFaqCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "submain_gucci"; //서브헤더 타이틀
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/custcenter/m/submain_gucci_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);