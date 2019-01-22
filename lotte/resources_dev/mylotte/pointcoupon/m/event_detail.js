(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);
    
    app.filter('strToDate', [function() {
    	return function(item) {
    		return item.substr(4,2)+"월 "+item.substr(6,2)+"일";//item.substr(0,4)+"년 "+
    	}
    }]);

    app.controller('EventDetailCtrl', ['$scope', '$http', '$window', 'LotteCommon', function($scope, $http, $window, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "이벤트 당첨 확인"; //서브헤더 타이틀
        
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        $scope.eventNoParam = getParameterByName('evt_no'); 

        var eventDetailData = LotteCommon.eventDetailData  + "?evt_no=" + $scope.eventNoParam;
        
        // 로그인 정보 체크 후 로그인 페이지로 리턴
//    	if(!$scope.loginInfo.isLogin){
//    		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
//        	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
//    	}
        
    	try{
	        // Data get
	        $http.get(eventDetailData)
	        .success(function(data) {
	            	// 이벤트 응모 리스트 데이터
	            	$scope.eventDetail = data.eventDetail;            	
	        })
	        .error(function(data, status, headers, config){
	            console.log('Error Data : ', status, headers, config);
	        });
    	} catch(e) {
    		colsole.log('data get error............')
    	}
        
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/pointcoupon/m/event_detail_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);