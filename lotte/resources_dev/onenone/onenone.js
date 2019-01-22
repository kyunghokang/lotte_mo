(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteUnit',
        'lotteSideCtg', 
        // 'lotteSideMylotte', 
        'lotteCommFooter',
        'lotteSns'
    ]);

    app.controller('OnenOneCtrl', ['$scope', '$filter', '$sce', '$http', '$window', 'LotteCommon' , function($scope, $filter, $sce, $http, $window, LotteCommon ){
        /*common*/
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = true; /*서브헤더 타이틀*/
        $scope.actionBar = false; /*액션바*/ 
        $scope.isShowThisSns = true; /*공유버튼*/
        /*test*/
        $scope.isPickupPop = false;
    }]);
    
    app.directive('lotteContainer',[function(){
        return {
            templateUrl: '/lotte/resources_dev/onenone/onenone_container.html',
            replace:true,
            link:function($scope, el, attrs){
	        	
            }
        };
    }]);
    app.directive('pickupPop', ['$window', function($window){
        return {
            templateUrl: '/lotte/resources_dev/onenone/pickup_pop.html',
            replace : true,
            link:function($scope, el, attrs){           
        	}
        };
    }]);
    app.directive('productImg', ['$window', function($window){
        return {
            templateUrl: '/lotte/resources_dev/onenone/product_img.html',
            replace : true,
            link:function($scope, el, attrs){
	        	$('div.product_slide img').load(function(){
	        		ImgSlide('div.product_slide',{minWArr :[10024,10280,10600]});
	        	})
        	}
        };
    }]);
    
    
    
    
})(window, window.angular);
