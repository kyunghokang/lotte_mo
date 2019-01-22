(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
		'lotteNgSwipe'
    ]);

    app.controller('CvsReturnGuideCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "편의점반품가이드"; //서브헤더 타이틀
        
        $scope.guideSwipeVisible = false;
        $scope.guideSwiImgs = ["http://image.lotte.com/lotte/mo2015/angular/mylotte/cvs_return_guide_1.jpg", "http://image.lotte.com/lotte/mo2015/angular/mylotte/cvs_return_guide_2.jpg", "http://image.lotte.com/lotte/mo2015/angular/mylotte/cvs_return_guide_3.jpg", "http://image.lotte.com/lotte/mo2015/angular/mylotte/cvs_return_guide_4.jpg", "http://image.lotte.com/lotte/mo2015/angular/mylotte/cvs_return_guide_5.jpg", "http://image.lotte.com/lotte/mo2015/angular/mylotte/cvs_return_guide_6.jpg"];
    
        
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/m/cvs_return_guide_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
            	$scope.showGuideSwipe = function(){
            		$scope.guideSwipeVisible = true;
            	}
            	
            	
            }
        };
    });

})(window, window.angular);