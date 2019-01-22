/**
 * 동일상품 혜택 비교하기 page
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

    app.controller('ProductBenefitCompareCtrl', ['$http', '$scope', '$window', 'LotteCommon', 'LotteUtil', 'commInitData', 'LotteGA', function($http, $scope, $window, LotteCommon, LotteUtil, commInitData, LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "동일 상품 혜택 비교하기"; // 서브헤더 타이틀
        $scope.screenID = "product_benefit_compare"; // 스크린 아이디 
        $scope.goodsNo = commInitData.query['goods_no']; // 상품번호
		$scope.jsonLoading = false; // 로딩커버
        
		$scope.pageUI = {
			baseParam: $scope.baseParam,
			loadData: null,
			goodsNo: commInitData.query['goods_no'],
			brndNo: commInitData.query['brnd_no'],
			modelNo: commInitData.query['model_no']
		}

		$scope.loadData = function() {
			var url = LotteCommon.isTestFlag ? '/json/product/compare_prd_info.json' : LotteCommon.productBenefitCompareData
				+ "?goods_no=" + $scope.pageUI.goodsNo
				+ "&brnd_no=" + $scope.pageUI.brndNo
				+ "&model_no=" + $scope.pageUI.modelNo;

			$scope.jsonLoading = true; // 로딩커버

			$http.get(url)
			.success(function (data) {
				if(data.data) {
					console.log("동일 상품 혜택 비교하기 데이터 로드");
					$scope.pageUI.loadData = data.data;
				}
			}).error(function () {
				console.log('Data Error : 동일 상품 혜택 비교하기 데이터 로드 실패');
			}).finally(function () {
				$scope.jsonLoading = false; // 로딩커버
			});
		}

		$scope.loadData();

		// todo : 상품 클릭 기능구현
		$scope.productClick = function(goodsNo, tclick, idx){
			if(goodsNo) {

				//20180830 GA태깅 추가
				LotteGA.evtTag('MO_상품상세', '동일상품혜택비교하기', idx, goodsNo);

				var url = LotteUtil.setUrlAddBaseParam(LotteCommon.productviewUrl , $scope.pageUI.baseParam + "&goods_no=" + goodsNo);
				$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
			}
			console.log(" Product Click : ", goodsNo, "\n tclick : " ,tclick);
		};

		$scope.numberFill = function(idx, length) {
			var strIdx = "" + idx;
			var fillData = "00000000000000000";
			return fillData.substring(0,length - strIdx.length) + strIdx;
		}

	}]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/product/m/sub/product_benefit_compare_container.html',
            replace : true,
            link : function($scope, el, attrs) {
				$scope.isShowBtnTalk = false; // 톡상담 버튼 감추기
			}
        };
    });

})(window, window.angular);