/**
 * 상품상세 서브페이지: 상품 필수정보표기
 *
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

    app.controller('ProductReqInfoCtrl', ['$http', '$scope', 'LotteCommon', 'commInitData', '$timeout', function($http, $scope, LotteCommon, commInitData, $timeout) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "상품 필수표기정보 안내"; // 서브헤더 타이틀
        $scope.screenID = "product_req_info"; // 스크린 아이디 
		$scope.goodsNo = commInitData.query['goods_no']; // 상품번호
		$scope.jsonLoading = false; // 로딩커버

		$scope.pageUI = {
	       	baseParam: $scope.baseParam,
	       	loadData: null,
	       	giftServiceInfo: false		// 무료포장 선물카드
        }
        
		$scope.loadData = function() {
        	var url = LotteCommon.isTestFlag ? LotteCommon.productSubReqInfoData : LotteCommon.productSubReqInfoData + "?goods_no="+$scope.goodsNo;
			$scope.jsonLoading = true; // 로딩커버

			$http.get(url)
			.success(function (data) {
				if(data.data) {
					$scope.pageUI.loadData = data.data;
					
					//20180528 선물하기 안내 문구 추가
					$scope.pageUI.loadData.giftChk = true;
					
					var prdInfoList = $scope.pageUI.loadData.itemInfoList.items;
					angular.forEach(prdInfoList, function(val,key){

						//상품정보 리스트에 선물서비스가 있다면 비노출처리
						if(val.key == '선물서비스'){
							$scope.pageUI.loadData.giftChk = false;
							return;
						}

					});


				}
			})
			.error(function () {
				console.log('Data Error : 상품필수정보 페이지 데이터 로드 실패');
			})
			.finally(function () {
				$scope.jsonLoading = false; // 로딩커버
			});
		}
		$scope.loadData();
		
		// 무료포장 선물카드 레이어
		$scope.giftServiceInfoClick = function(tclick) {
			$scope.dimmedOpen({
				target: "giftServiceInfo",
				//dimmedOpacity : "0.6",
				callback: this.giftServiceInfoClose
			});
			$scope.LotteDimm.dimmedOpacity = "0.6";
			$timeout(function() {
				angular.element("#lotteDimm").css("z-index", "210");
			});
			$scope.pageUI.giftServiceInfo = true;
			$timeout(function() { //중앙정렬로 수정
				angular.element(".pop_gift").css("margin-top", -(angular.element(".pop_gift").height()/2));
			});
		}		
		$scope.giftServiceInfoClose = function() {
			$scope.pageUI.giftServiceInfo = false;
			$scope.dimmedClose();
		}
		
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/product/m/sub/product_req_info_container.html',
            replace : true,
            link : function($scope, el, attrs) {
				$scope.isShowBtnTalk = false; // 톡상담 버튼 감추기
            }
        };
    });

	app.filter('newlinesBR', function () {
		return function(txt) {
			return txt.replace(/\n/g, '<br/>');
		}
	});

	/*app.filter('newlinesWithSpace', function(){
		return function (txt) {
			return txt.replace(/\n/g,' \n ');
		}
	});*/

})(window, window.angular);