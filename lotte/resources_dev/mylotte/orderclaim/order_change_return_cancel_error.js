(function(window, angular, undefined) {
    //'use strict';
    var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg', 
		// 'lotteSideMylotte', 
		'lotteCommFooter'
    ]);
    app.controller('OrderChangeReturnCancelErrorCtrl', ['$scope','$filter','$sce','$http','$window','$log','LotteCommon', 'LotteUtil', function($scope , $filter , $sce , $http , $window , $log, LotteCommon, LotteUtil){
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "교환/반품 취소불가"; /*서브헤더 타이틀*/
        $scope.actionBar = true; /*액션바*/ 
        $scope.isShowThisSns = false; /*공유버튼*/
    }]);
    

})(window, window.angular);
