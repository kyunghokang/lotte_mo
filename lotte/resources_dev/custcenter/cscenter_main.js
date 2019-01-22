(function(window, angular, undefined) {
	'use strict';
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg', 
		// 'lotteSideMylotte', 
		'lotteCommFooter'
	]);
	
	app.cscenterLinkObj ; 

	app.controller('cscenterMainCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'commInitData', function($scope, $http, $window, LotteCommon, commInitData){
		$scope.faqDeatailView = [];
		$scope.noticeDeatailView = [];
		
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "고객센터"; // 서브헤더 타이틀
		
		$scope.csmainFaqData = [];
		$scope.csmainNoticeData = [];
		
		$scope.faqDeatailView[$scope.csmainFaqData] = false; // FAQ
		$scope.noticeDeatailView[$scope.csmainNoticeData] = false; // notice
		
		$scope.talkCnt = "N"; // 채팅상담 신규 메세지 카운트

		/* main data */
		$http.get(LotteCommon.cscenterMainData)
		.success(function(data){
			$scope.csMainData = data.main_custcenter;
			$scope.csmainFaqData = data.main_custcenter.faq_list.list.items;
			$scope.csmainNoticeData = data.main_custcenter.notice_list.list.items;
			//console.log($scope.csMainData);

			if (typeof $scope.csMainData.chatCnt != "undefined") {
				if ($scope.csMainData.chatCnt > 0 && $scope.csMainData.chatCnt < 10) {
					$scope.talkCnt = $scope.csMainData.chatCnt;
				} else if ($scope.csMainData.chatCnt >= 10) {
					$scope.talkCnt = "9+";
				} else {
					$scope.talkCnt = "N";
				}
			}
		})
		.error(function(data){
			console.log('Error Data :  cscenterMainData 고객센터 메인 에러');
		});
		
		// FAQ  개별보기
		$scope.faqDetail = function (item) {
			if($scope.faqDeatailView[item.bbc_no] == true){
				angular.forEach($scope.csmainFaqData, function(val, key) {
					$scope.faqDeatailView[$scope.csmainFaqData[key].bbc_no] = false;
				});				
			} else {
				angular.forEach($scope.csmainFaqData, function(val, key) {
					$scope.faqDeatailView[$scope.csmainFaqData[key].bbc_no] = false;
				});
				$scope.faqDeatailView[item.bbc_no] = true;   
				$scope.sendTclick('m_DC_Custom_Clk_Lyr_A'+ (item.bbc_no));//0211추가
			}			
		};
		
		// 공지사항 개별보기
		$scope.noticeDetail = function (item) {
			if($scope.noticeDeatailView[item.bbc_no] == true){
				angular.forEach($scope.csmainNoticeData, function(val, key) {
					$scope.noticeDeatailView[$scope.csmainNoticeData[key].bbc_no] = false;
				});
				
			} else {
				angular.forEach($scope.csmainNoticeData, function(val, key) {
					$scope.noticeDeatailView[$scope.csmainNoticeData[key].bbc_no] = false;
				});
				$scope.noticeDeatailView[item.bbc_no] = true;   
				$scope.sendTclick('m_DC_Custom_Clk_Lyr_B'+ (item.bbc_no));//0211추가
			}			
		};		
		
	}]);
	
	app.directive('lotteContainer', ['LotteCommon', function(LotteCommon){
		return {
			templateUrl: '/lotte/resources_dev/custcenter/cscenter_main_container.html',
			replace:true,
			link:function($scope, el, attrs) {
				$scope.cscenterLinkObj = {
					'questionUrl' : LotteCommon.questionUrl + "?" + $scope.baseParam + "&tclick=m_DC_Custom_Clk_Btn_1", // 1:1 문의하기
					'cscenterAnswerUrl' : LotteCommon.cscenterAnswerUrl + "?" + $scope.baseParam + "&tclick=m_DC_Custom_Clk_Btn_2", // 1:1 문의 답변확인
					'ordLstUrl' : LotteCommon.ordLstUrl + "?" + $scope.baseParam+"&fromPg=3&tclick=m_DC_Custom_Clk_Btn_3&ordListCase=1", // 주문배송조회
					'ordCancelUrl' : LotteCommon.ordCancelUrl + "?" + $scope.baseParam+"&fromPg=3&tclick=m_DC_Custom_Clk_Btn_4&ordListCase=3", // 취소교환반품
					'cscenterFaqUrl' : LotteCommon.cscenterFaqUrl + "?" + $scope.baseParam + "&page_num=1&display_cnt=10" + "&tclick=m_DC_Custom_Clk_Btn_5", // FAQ
					'cscenterNoticeUrl' : LotteCommon.cscenterNoticeUrl + "?" + $scope.baseParam + "&page_num1&display_cnt=10" + "&tclick=m_DC_Custom_Clk_Btn_6", // 공지사항
					'qnaDetailUrl' : LotteCommon.cscenterAnswerDetaileUrl + "?" + $scope.baseParam,// 1:1 문의하기 확인
					'talkUrl' : LotteCommon.talkUrl + "?" + $scope.baseParam + "&tclick=m_DC_Custom_Clk_Btn_8" // 채팅상담(Talk) URL
				}
				app.cscenterLinkObj = $scope.cscenterLinkObj ; 
			}
		};
	}]);
	
})(window, window.angular);