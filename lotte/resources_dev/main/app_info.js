(function(window, angular, undefined) {
    'use strict';
    var mainAppInfo = angular.module('mainAppInfo', []);
    mainAppInfo.controller('mainAppInfoCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'LotteCookie', function($scope, $http, $window, LotteCommon, LotteCookie) {

    }]);
    
    // sub header directive
    mainAppInfo.directive('lotteMainAppInfo',[function(){
        return {
            templateUrl:'/lotte/resources_dev/main/app_info.html',
            controller:'mainAppInfoCtrl',
            replace:true,
            link:function($scope, el, attrs){
	        	
            }
        }
    }]);
})(window, window.angular);