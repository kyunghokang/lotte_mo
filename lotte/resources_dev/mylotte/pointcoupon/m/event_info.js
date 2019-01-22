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
    		return item.substr(0,4)+"년 "+item.substr(4,2)+"월 "+item.substr(6,2)+"일";
    	}
    }]);
    
    app.controller('EventInfoCtrl', ['$scope', '$http', '$window', 'LotteCommon', function($scope, $http, $window, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "이벤트 응모 내역"; //서브헤더 타이틀
        $scope.pageLoading = true;
        $scope.isShowLoadingImage = false;

        // login data
        $scope.eventInfoList = [];
        $scope.eventInfo_tot_cnt= 0;

        // Data Load
        $scope.getEventInfoDataLoad = function() {
        	$scope.thisPage++;
        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
        		return;
        	}
	        $http.get(LotteCommon.eventGumeData + "?" + $scope.baseParam + "&mbr_no=" + "&pageIdx=" + $scope.thisPage)
	        .success(function(data) {
	       		// 공지사항 리스트
	        	$scope.page_end = parseInt(data.page_end);
	        	console.log('page end ; ' + $scope.page_end)
	       		angular.forEach(data.eventInfoList.items, function(val, key) {
	       			$scope.eventInfoList.push(val);
	       		});
	            $scope.eventInfo_tot_cnt= data.eventInfoList.total_count;
	            $scope.pageLoading = false;
	            $scope.isShowLoadingImage = false;
	        })
	        .error(function(data, status, headers, config){
	        	 $scope.pageLoading = false;
		         $scope.isShowLoadingImage = false;
	            console.log('Error Data : ', status, headers, config);
	        });
        }
        
        $scope.page_end = 0;
        $scope.thisPage = 0;
        $scope.getEventInfoDataLoad();
        
        // 더보기 클릭
    	$scope.moreListClick = function() {
    		$scope.getEventInfoDataLoad();
    	}
        
        $scope.goEvnetDetailClick = function(evtNo) {
       		$window.location.href = LotteCommon.eventDetailUrl + "?" + $scope.baseParam + "&evt_no=" + evtNo;	
        }
        
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/pointcoupon/m/event_info_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);