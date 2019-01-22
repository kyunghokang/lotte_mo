(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('mylotteReinquiryListCtrl', ['$scope', 'LotteCommon', '$http', '$window', 'LotteStorage', '$location', '$timeout', function($scope, LotteCommon, $http, $window, LotteStorage, $location, $timeout) {
    	$scope.screenID = 'mylotteReinquiryList';
    	
    	$scope.showWrap = true;
    	$scope.contVisible = true;
    	$scope.subTitle = "상품 문의 내역"; /* 서브헤더 타이틀 */
    	
    	// 문의 내역 목록 조회
    	$scope.productQuestList = [];
    	var displayCnt = 10;
    	$scope.pageNum = 1;
    	$scope.totalRows = 0;
    	$scope.currentRows = 0;
    	$scope.getList = function() {
    		$scope.isShowLoadingImage = true; // 로딩이미지 출력 여부
	    	try {
		    	$http.get(
		    		LotteCommon.productQuestListData + '?' + $scope.baseParam + '&display_cnt=' + displayCnt + '&page_num=' + $scope.pageNum
		    	).success(function(data) {
		    		if (data.product_quest_list.list.items.length > 0) {
		    			$scope.productQuestList = $scope.productQuestList.concat(data.product_quest_list.list.items);
		    			$scope.pageNum++;
		    			$scope.totalRows = ($scope.totalRows == 0 ? data.product_quest_list.total_rows : $scope.totalRows);
		    			$scope.currentRows += data.product_quest_list.list.total_count;
		    		} else {
		    			$scope.empty = true;
		    		}
		    		$scope.isShowLoadingImage = false;
		    	}).error(function(ex) {
					// ajaxResponseErrorHandler(ex);
					if (ex.error) {
						var errorCode = ex.error.response_code;
						var errorMsg = ex.error.response_msg;

						if (errorCode == "9004") {
							var targetUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
							$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&" + targetUrl;
						} else {
							alert("[" + errorCode + "] " + errorMsg);
						}
					} else {
						alert("처리중 오류가 발생하였습니다.");
					}
		        });
	    	} catch(e) {
	    		console.error(e);
	    	}
    	};
    	
    	// '문의 내역 상세' 주소 생성
    	$scope.getMylotteReinquiryDetailUrl = function(inqNo) {
    		return LotteCommon.mylotteReinquiryDetailUrl + '?' + $scope.baseParam + '&inq_no=' + inqNo;
    	};
    	
    	$scope.linkToDetail = function($index, $event) {
    		$event.preventDefault(); // a태그 작동 방지
    		location.href = LotteCommon.mylotteReinquiryDetailUrl + '?' + $scope.baseParam + '&inq_no=' + $scope.productQuestList[$index].inq_no;
    	};
    	
    	// 세션에서 가저올 부분 선언
        var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID + 'Data');
        var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID + 'ScrollY');

        if ($scope.locationHistoryBack) {
        	var StoredData = JSON.parse(StoredDataStr);
        	$scope.productQuestList = StoredData.productQuestList;
        	$scope.pageNum = StoredData.pageNum;
        	$scope.totalRows = StoredData.totalRows;
        	$scope.currentRows = StoredData.currentRows;
        	$timeout(function() {
        		angular.element($window).scrollTop(StoredScrollY);
        	},800);
        } else {
    		$scope.getList();
        }
        
        // unload시 관련 데이터를 sessionStorage에 저장
        angular.element($window).on("unload", function(e) {
            var sess = {};
            sess.productQuestList = $scope.productQuestList;
            sess.pageNum = $scope.pageNum;
            sess.totalRows = $scope.totalRows;
            sess.currentRows = $scope.currentRows;
            if ($scope.leavePageStroage) {
	            LotteStorage.setSessionStorage($scope.screenID + 'Data', sess, 'json');
	            LotteStorage.setSessionStorage($scope.screenID + 'ScrollY', angular.element($window).scrollTop());
            }
        });
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/product/m/mylotte_reinquiry_list_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });
})(window, window.angular);