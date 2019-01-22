(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteProduct',
		'lotteNgSwipe',
		'lotteSns'
	]);

	app.controller('evtReviewCtrl', ['$window', '$location', '$http', '$scope', '$timeout', 'LotteCommon', 'LotteStorage', 'commInitData', function($window, $location, $http, $scope, $timeout, LotteCommon, LotteStorage, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "상품평 이벤트"; //서브헤더 타이틀
		$scope.pageLoading = true; //페이지 첫 로딩
		$scope.isShowThisSns = true;

		/*
		 * 스크린 데이터 로드
		 */
		$scope.evtData={}
		if(commInitData.query['evtNo'] != undefined) {
			$scope.evtData.paramEvtNo = commInitData.query['evtNo'];
		}
		$scope.loadScreenData = function() {
			$http.get(LotteCommon.beautyEvtReviewData+'?evt_no='+$scope.evtData.paramEvtNo)
			.success(function(data) {
				/* 세션 */
				$scope.evtData = data.review_evt;

				$scope.evtData.evtStrDate = $scope.evtData.evtStrDate.substring(2);
				$scope.evtData.evtEndDate = $scope.evtData.evtEndDate.substring(2);
				$scope.evtData.winDate = $scope.evtData.winDate.substring(2).replace(/(\d{2})(\d{2})/g,'$1.$2.');
				
				$scope.pageLoading = false;
			}).error(function(data) {
				$scope.pageLoading = false;
			});
		}

		// 세션에서 가저올 부분 선언 
		var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
		var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');

		if($scope.locationHistoryBack) {
			var StoredData = JSON.parse(StoredDataStr);
			$scope.pageLoading = false;

			$scope.evtData = StoredData.evtData;
			$timeout(function() {
				angular.element($window).scrollTop(StoredScrollY);
			},800);
		} else {
			$scope.loadScreenData();
		}
		
		/**
		 * unload시 관련 데이터를 sessionStorage에 저장
		 */
		angular.element($window).on("unload", function(e) {
			var sess = {};
			sess.evtData = angular.copy($scope.evtData);
			if ($scope.leavePageStroage) {
				LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
				LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
			}
		});
	}]);

	app.directive('lotteContainer', ['LotteCommon', function(LotteCommon) {
		return {
			templateUrl : '/lotte/resources_dev/category/m/beauty_evt_review_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				$scope.templateType='image';
				//상품평작성하기 클릭
				$scope.myReviewClk = function(){
					var url = LotteCommon.mylotteCritViewUrl+'?'+$scope.baseParam;
					location.href = url;
				}
				//FAQ 아코디언
				$scope.faqIdx=-1;
				$scope.faqAccordion = function(i){
					if($scope.faqIdx==i) $scope.faqIdx=-1;
					else $scope.faqIdx=i;
				}
			}
		};
	}]);

})(window, window.angular);