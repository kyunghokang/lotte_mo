/**
 * 상품상세 서브페이지: 배송/교환/반품/결제정보 안내
 */

(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'product-sub-header'
    ]);

    app.controller('ProductExtInfoCtrl', ['$http', '$scope', 'LotteCommon', 'commInitData', function($http, $scope, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "배송/교환/반품/결제정보 안내"; // 서브헤더 타이틀
        $scope.screenID = "product_ext_info"; // 스크린 아이디 
        $scope.goodsNo = commInitData.query['goods_no']; // 상품번호
		$scope.jsonLoading = false; // 로딩커버
        
		$scope.pageUI = {
	       	baseParam: $scope.baseParam,
	       	loadData: null,
	       	togeListOpen1: false,
	       	togeListOpen2: false,
	       	togeListOpen3: false,
	       	togeListOpen4: false,
			togeListOpen5: false,
			togeListOpen6: false			  
		}

		$scope.loadData = function() {
			var url = LotteCommon.isTestFlag ? LotteCommon.productExtInfoData : LotteCommon.productExtInfoData + "?goods_no="+$scope.goodsNo;
			$scope.jsonLoading = true; // 로딩커버

			$http.get(url)
			.success(function (data) {
				console.info(data);
				if(data.data) {
					console.log("배송/교환/반품/결제정보 안내 데이터 로드");
					$scope.pageUI.loadData = data.data;
					//20171123 스마트픽/크로스픽 문구 추가 수정
					$scope.pageUI.loadData['smtPick'] = (data.data.dlvInfo.smpDlvArea.indexOf("롯데백화점") > -1) ? true : false;
					$scope.pageUI.loadData['crsPick'] = (data.data.dlvInfo.smpDlvArea.indexOf("세븐일레븐") > -1) ? true : false;

				}
			})
			.error(function () {
				console.log('Data Error : 배송/교환/반품/결제정보 안내 데이터 로드 실패');
			})
			.finally(function () {
				$scope.jsonLoading = false; // 로딩커버
			});
		}
		$scope.loadData();

		// 배송비영역 무료배송 출력 여부 
        $scope.check_fee = function(amount){
            var flag = false;
            var v = parseInt(amount);
            if(v > 0 && v < 100000){
                flag = true;
            }
            return flag;        
        }
    }]);

    app.directive('lotteContainer', ['$http', 'LotteCommon', 'LotteUtil', '$window',
    	function ($http, LotteCommon, LotteUtil, $window) {
	        return {
	            templateUrl : '/lotte/resources_dev/product/m/sub/product_ext_info_container.html',
	            replace : true,
	            link : function($scope, el, attrs) {
					$scope.isShowBtnTalk = false; // 톡상담 버튼 감추기
					
	            	$scope.ordLstUrl = LotteCommon.ordLstUrl; // 주문배송조회 url
					
					$scope.linkClick = function (linkUrl, tclick) {
						console.log('linkUrl', linkUrl);
						$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.pageUI.baseParam + "&tclick=" + tclick);
					}
	            }
	        };
    	}
    ]);

})(window, window.angular);