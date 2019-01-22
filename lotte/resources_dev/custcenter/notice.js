(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg', 
        // 'lotteSideMylotte', 
        'lotteCommFooter'
    ]);

    app.controller('cscenterNoticeCtrl', ['$scope', '$http', '$window', 'LotteCommon' , function($scope, $http, $window, LotteCommon ){
    	$scope.noticeDeatailView = [];
    	
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "공지사항"; // 서브헤더 타이틀
        $scope.noticeDeatailView[$scope.csmainNoticeData] = false; //notice
        
        $scope.csNoticeData = [];
        $scope.noticeList_tot_cnt= 0;
        $scope.noticeClickFalg = false;
        
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        
        $scope.noticeParam = getParameterByName('bbc_no'); //긴급공지 클릭시
        
        // Data Load
        $scope.getNoticeDataLoad = function() {
        	$scope.thisPage++;
        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
        		return;
        	}
	        $http.get(LotteCommon.cscenterNoticeData + "?" + $scope.baseParam + "&page_num=" + $scope.thisPage)
	        .success(function(data) {
	       		// 공지사항 리스트
	        	$scope.page_end = parseInt(data.page_end);
	        	console.log('page end ; ' + $scope.page_end)
	       		angular.forEach(data.notice_list.list.items, function(val, key) {
	       			$scope.csNoticeData.push(val);
	       		});
	            $scope.noticeList_tot_cnt= data.notice_list.total_rows;
	        })
	        .error(function(data, status, headers, config){
	            console.log('Error Data : ', status, headers, config);
	        });
        }
        
        $scope.page_end = 0;
        $scope.thisPage = 0;
        $scope.getNoticeDataLoad();
        
        // 더보기 클릭
    	$scope.moreListClick = function() {
    		$scope.getNoticeDataLoad();
    	}
    	
    	// 긴급공지 처리
    	if($scope.noticeParam != '') {
    		$scope.noticeDeatailView[$scope.noticeParam] = true;
        }
    	
        // 공지사항 개별보기
        $scope.noticeDetail = function (item) {
        	if($scope.noticeDeatailView[item.bbc_no] == true){
	       		angular.forEach($scope.csNoticeData, function(val, key) {
	       			$scope.noticeDeatailView[$scope.csNoticeData[key].bbc_no] = false;
	       		});
        	} else {
        		angular.forEach($scope.csNoticeData, function(val, key) {
        			$scope.noticeDeatailView[$scope.csNoticeData[key].bbc_no] = false;
	       		});
        		$scope.noticeDeatailView[item.bbc_no] = true;        		
        	}
        };
        
    }]);
    
    app.directive('lotteContainer',[function(){
        return {
            templateUrl: '/lotte/resources_dev/custcenter/notice_container.html',
            replace:true,
            link:function($scope, el, attrs){
            }
        };
    }]);
    
})(window, window.angular);