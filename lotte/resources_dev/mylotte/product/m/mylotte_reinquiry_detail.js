(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('mylotteReinquiryDetailCtrl', ['$scope', 'LotteCommon', '$window', '$http', '$filter', 'LotteUtil', function($scope, LotteCommon, $window, $http, $filter, LotteUtil) {
    	$scope.showWrap = true;
    	$scope.contVisible = true;
    	$scope.subTitle = '상품 문의 답변 확인'; /* 서브헤더 타이틀 */
    	
    	// 문의 상세 조회
    	$scope.productQuest = {};
    	try {
	    	$http.get(
	    		LotteCommon.productQuestDetailData + '?' + $scope.baseParam + '&inq_no=' + LotteUtil.getParameter('inq_no')
	    	).success(function(data) {
	    		$scope.productQuest = data.product_quest_detail;
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
	    	
    	} catch (e) {
    		console.error(e);
    	}
    	
    	// linkToProductQuestWriteUrl(): 같은 상품의 상품문의 페이지로 이동
    	$scope.linkToProductQuestWriteUrl = function() {
    		$window.location.href = LotteCommon.productQuestWriteUrl + '?' + $scope.baseParam + '&goods_no=' + $scope.productQuest.goods_no;
    	}
    	
    	// linkToProductView(): 문의중인 상품의 상품상세로 이동
    	$scope.linkToProductView = function() {
    		$window.location.href = LotteCommon.prdviewUrl + '?' + $scope.baseParam + '&goods_no=' + $scope.productQuest.goods_no;
    	}
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/product/m/mylotte_reinquiry_detail_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });
})(window, window.angular);