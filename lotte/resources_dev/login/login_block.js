(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
	     'lotteComm',
	     'lotteSrh',
	     'lotteSideCtg', 
	    //  'lotteSideMylotte', 
	     'lotteCommFooter'
    ]);

    app.controller('loginBlockCtrl', ['$scope', '$filter', '$sce', '$http', '$window', 'LotteCommon' , function($scope, $filter, $sce, $http, $window, LotteCommon ){
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "비밀번호 변경";
        $scope.actionBar = true; // 액션바 
    }]);
    
    app.directive('lotteContainer',['LotteCommon', function(LotteCommon){
        return {
            templateUrl: '/lotte/resources_dev/login/login_block_container.html',
            replace:true,
            link:function($scope, el, attrs){
        	
	            $scope.fn_findPw = function() {
	                document.changePwMemberForm.action = LotteCommon.simpleSignMemberPWFind;    
	                document.changePwMemberForm.submit();
	            }
        	
            }
        };
    }]);
    
})(window, window.angular);
