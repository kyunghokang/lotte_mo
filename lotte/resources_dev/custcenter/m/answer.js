(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg', 
        // 'lotteSideMylotte', 
        'lotteCommFooter'
    ]);
    
    app.questionLinkObj ; 

    app.controller('answerCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'LotteStorage', '$location', '$timeout', function($scope, $http, $window, LotteCommon, LotteStorage, $location, $timeout) {
    	$scope.screenID = 'answer';
        
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "1:1문의 답변확인"; /*서브헤더 타이틀*/
        $scope.totalRows = 0; // 문의 데이터 전체 개수
        $scope.endCount = 0; // 답변 완료된 문의 전체 개수
        $scope.receiveCount = 0; // 처리중인 문의 전체 개수
        $scope.ingCount = 0; // 접수완료 문의 전체 개수
        $scope.answerList = [];
        $scope.answerListCount = 0;
        $scope.pageNum = 0;

        /* getAnswerList(): 1:1 문의 목록 */
        $scope.getAnswerList = function() {
        	try {
        		$http.get(LotteCommon.cscenterQnaData + '?' + $scope.baseParam + '&page_num=' + ++$scope.pageNum)
		    			.success(function(data) {
		    		$scope.answerList = $scope.answerList.concat(data.inquiry_list.list.items);
		            $scope.answerListCount += data.inquiry_list.list.total_count;
		            $scope.totalRows = ($scope.totalRows == 0) ? data.inquiry_list.total_rows : $scope.totalRows;
		            $scope.endRows = data.inquiry_list.end_count;
		            $scope.receiveRows = data.inquiry_list.receive_count;
		            $scope.ingRows = data.inquiry_list.ing_count;
		            $scope.completeGetAnswerList = true;
		    	}).error(function(ex) {
		    		ajaxResponseErrorHandler(ex);
		        })
        	} catch (e) {
            	console.error(e);
            }
        };
        
        // goQnaDetail(): 1:1 문의 답변확인 상세 페이지
        $scope.goQnaDetail = function(ccn_no) {
        	$window.location.href = LotteCommon.cscenterAnswerDetaileUrl + "?" + $scope.baseParam + "&ccn_no=" + ccn_no;
        }
        
        // 세션에서 가저올 부분 선언
        var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID + 'Data');
        var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID + 'ScrollY');

        if ($scope.locationHistoryBack) {
        	var StoredData = JSON.parse(StoredDataStr);
    		$scope.pageLoading = false;
        	$scope.answerList = StoredData.answerList;
        	$scope.answerListCount = StoredData.answerListCount;
        	$scope.totalRows = StoredData.totalRows;
        	$scope.endRows = StoredData.endRows;
        	$scope.receiveRows = StoredData.receiveRows;
        	$scope.ingRows = StoredData.ingRows;
        	$scope.completeGetAnswerList = StoredData.completeGetAnswerList;
        	$timeout(function() {
        		angular.element($window).scrollTop(StoredScrollY);
        	},800);
        } else {
    		$scope.getAnswerList();
        }
        
        // unload시 관련 데이터를 sessionStorage에 저장
        angular.element($window).on("unload", function(e) {
            var sess = {};
            sess.answerList = $scope.answerList;
            sess.answerListCount = $scope.answerListCount;
            sess.totalRows = $scope.totalRows;
            sess.endRows = $scope.endRows;
            sess.receiveRows = $scope.receiveRows;
            sess.ingRows = $scope.ingRows;
            sess.completeGetAnswerList = $scope.completeGetAnswerList;
            if ($scope.leavePageStroage) {
	            LotteStorage.setSessionStorage($scope.screenID + 'Data', sess, 'json');
	            LotteStorage.setSessionStorage($scope.screenID + 'ScrollY', angular.element($window).scrollTop());
            }
        });
    }]);
    
    app.directive('lotteContainer', ['LotteCommon', function(LotteCommon){
        return {
        	templateUrl: '/lotte/resources_dev/custcenter/m/answer_container.html',
            replace:true,
            link:function($scope, el, attrs){
            }
        };
    }]);
    
})(window, window.angular);

/**
 * 비동기 서비스 요청 후 실패 시 핸들러
 * 		- 응답을 정상(500)으로 받은 후
 * 		  리턴된 결과로 호출됨 
 */
// TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseFailHandler = function(errorCallback) {
	alert('처리중 오류가 발생하였습니다.');
	if (errorCallback) errorCallback();
};

/**
 * 비동기 서비스 요청 후 에러 시 핸들러
 * 		- 응답을 서버수행에러(500)으로 받은 후 호출 됨 
 */
// TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseErrorHandler = function(ex, errorCallback) {
	if (ex.error) {
		var errorCode = ex.error.response_code;
		var errorMsg = ex.error.response_msg;
		if ('9004' == errorCode) {
			// TODO ywkang2 : lotte_svc.js 를 참조해야함
			var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8'); 
//    		$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl
			location.href = '/login/m/loginForm.do?' + targUrl;
		} else {
			alert('[' + errorCode + '] ' + errorMsg);
		}
	} else {
		alert('처리중 오류가 발생하였습니다.');
	}
	if (errorCallback) errorCallback();
};