(function(window, angular, undefined) {
    //'use strict';
    var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg', 
		// 'lotteSideMylotte', 
		'lotteCommFooter'
    ]);
    app.controller('OrderChangeReg3Ctrl', ['$scope','$filter','$sce','$http','$window','$log','LotteCommon', 'LotteUtil', function($scope , $filter , $sce , $http , $window , $log, LotteCommon, LotteUtil){
    	$scope.showWrap = true;
        $scope.contVisible = true;
        //$scope.subTitle = orderSubTitle; /*서브헤더 타이틀*/
        $scope.subTitle = '교환 접수'; /*서브헤더 타이틀*/
        $scope.actionBar = true; /*액션바*/ 
        $scope.isShowThisSns = false; /*공유버튼*/
    }]);
    

})(window, window.angular);
