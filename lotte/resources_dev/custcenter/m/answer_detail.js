(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg', 
        // 'lotteSideMylotte', 
        'lotteCommFooter'
    ]);

    app.controller('answerDetailCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'LotteUtil', function($scope, $http, $window, LotteCommon, LotteUtil){
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = '1:1 문의하기'; // 서브헤더 타이틀
        $scope.product_write_box = false;   /* textarea (inq_ans_cont) 입력바  */    
        $scope.question_submit_end = false; /* 질문 등록 완료 여부 */
        $scope.goodsData; /* 상품 데이터 */
        /* model */
        $scope.goods_no; 	 /* 상품번호  */
        $scope.usm_goods_no; /* 통합판매관리상품번호  */
        $scope.inq_ans_cont; /* 문의 내용 */

        $scope.ccnParam = LotteUtil.getParameter('ccn_no');         
        var questionData = LotteCommon.productQuestionData + '?' + $scope.baseParam + '&ccn_no=' + $scope.ccnParam;

        /* data get */
        $http.get(questionData)
        .success(function(data){
            $scope.answerState = data.inquiry_detail.ccn_prgs_stat_cd; // 답변 상태
        	$scope.inquiryDetail = data.inquiry_detail; // 답변내역
        	$scope.viewOrdNo = data.inquiry_detail.view_ord_no;
        	$scope.selectObj = data.inquiry_detail.goods_list.items;
            $scope.inquiryDetail.accp_cont = $scope.inquiryDetail.accp_cont.replace(/\n/gi,'<br/>');
            $scope.inquiryDetail.ans_cont = $scope.inquiryDetail.ans_cont.replace(/\n/gi,'<br/>');
            
        	// 주문내역 선택 여부
        	$scope.selectCs = data.inquiry_detail.is_with_order ? '0' : '1';        	
    	}).error(function(ex) {
    		ajaxResponseErrorHandler(ex);
        });
        
        // moreQuestion(): 1:1문의 등록 화면으로 이동
        $scope.moreQuestion = function() {
        	location.href = LotteCommon.questionUrl + '?' + $scope.baseParam;
        }
        
        // 주문/배송조회 상세로 이동
        $scope.linkToPuchaseView = function() {
        	location.href = LotteCommon.purchaseViewUrl + '?' + $scope.baseParam + '&orderNo=' + $scope.inquiryDetail.ord_no;
        };
    }]);	
    app.directive('lotteContainer',[function(){
        return {
            templateUrl: '/lotte/resources_dev/custcenter/m/answer_detail_container.html',
            replace:true,
            link:function($scope, el, attrs){
            	setTimeout(function () {
            		if($('.btn_continue').length > 0){
	                    	angular.element('html, body').stop()
	                    	.animate({
	            				scrollTop: angular.element('#custcenter > div:nth-last-child(3)').offset().top -50
	    					},0);
                    	}            		
    			},1000); 
            	$scope.fn_imgPop = function(url) {
            		$(".img_pop .thumbnail").html("<img src=\""+url+"\" alt=\"\" />");
            		$(".img_pop").show();
    	    	}
            	$scope.fn_imgPopClose = function(){
            		$(".layer_pop").hide();
            	}
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
			var targUrl = 'targetUrl='+encodeURIComponent(location.href, 'UTF-8'); 
//    		$window.location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+targUrl
			location.href = '/login/m/loginForm.do?' + targUrl;
		} else {
			alert('[' + errorCode + '] ' + errorMsg);
		}
	} else {
		alert('처리중 오류가 발생하였습니다.');
	}
	if (errorCallback) errorCallback();
};

//todo angular 공통 처리 필요
//function fn_imgPop(msg){
//	$(".img_pop .thumbnail").html("<img src=\""+msg+"\" alt=\"\" />");
//	$("#cover, .img_pop").show();
//	$('.layer_pop').show();
//}

//function fn_imgPop(msg){
//	$(".img_pop .thumbnail").html("<img id=\"imgPopRoof\" name=\"imgPopRoof\" src=\""+msg+"\" alt=\"\" />");
//	$("#cover, .img_pop").show();
//	$('.layer_pop').show();
//}

