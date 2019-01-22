/**
 * 상품 이미지 확대보기 Page
 */

(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'product-sub-header',
        'ngPinchZoom',
        'lotteSlider'
    ]);

    app.controller('ProductImageViewCtrl', ['$http', '$scope', '$timeout', '$compile', 'LotteCommon', 'commInitData', 'LotteUtil', 'LotteGA',
     function($http, $scope, $timeout, $compile, LotteCommon, commInitData, LotteUtil, LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "상품이미지 확대보기"; // 서브헤더 타이틀
        $scope.screenID = "product_image_view"; // 스크린 아이디 
        $scope.goodsNo = commInitData.query['goods_no']; // 상품번호
        var initImgIdx = commInitData.query['imgIdx']; // 상품번호
		$scope.jsonLoading = false; // 로딩커버
        
		$scope.pageUI = {
            baseParam: $scope.baseParam,
            imgIdx: initImgIdx ? initImgIdx : 0,
            loadData: null
        };

		$scope.loadData = function() {
			var url = LotteCommon.isTestFlag ? LotteCommon.productProductView2017Data : LotteCommon.productProductView2017Data + "?goods_no="+$scope.goodsNo;
			$scope.jsonLoading = true; // 로딩커버

			$http.get(url)
			.success(function (data) {
				if(data.data) {
					console.log("상품이미지 확대보기 데이터 로드");
                    $scope.pageUI.loadData = data.data;
                    
                    $timeout(function () {
                        $compile(angular.element("#pinchArea"))($scope);

                        if (initImgIdx && initImgIdx != 0) {
                            $scope.imgChange(initImgIdx);
                        }
                    }, 100);
				}
			})
			.error(function () {
				console.warn('Data Error : 상품이미지 확대보기 데이터 로드 실패');
			})
			.finally(function () {
				$scope.jsonLoading = false; // 로딩커버
			});
		}
		
        $scope.loadData();
        
		$scope.imgChange = function (idx) {
            $scope.pageUI.imgIdx = idx;

            angular.element("#pinchArea >img").trigger("resetPinch"); // 확대초기화

            //20180830 GA태깅 추가
			LotteGA.evtTag('MO_상품상세', '상품이미지확대보기', $scope.numberFill(idx+1,2),'-');

            var $targetEl = angular.element("#thumbList");
            var $selectTargetEl = $targetEl.find(">li").eq(idx);
            var parentWidth = $targetEl.parent().width();
            var targetWidth = $targetEl.width();
            var selectTargetWidth = $selectTargetEl.width();
            var selectTargetRealPosX = $selectTargetEl.offset().left - $targetEl.offset().left;
            var targetPosX = parentWidth / 2 - selectTargetWidth / 2 - selectTargetRealPosX;

            if (parentWidth < targetWidth) {
                if (targetPosX > 0) {
                    targetPosX = 0;
                } else if (targetPosX < -(targetWidth - parentWidth)) {
                    targetPosX = -(targetWidth - parentWidth);
                }

                angular.element("#thumbList").css({
                    transform: "translateX(" + (targetPosX) + "px)",
                    backfaceVisibility: "hidden",
                    transition: "transform 500ms"
                });
            }
        }

        $scope.numberFill = function(idx, length) {
            var strIdx = "" + idx;
            var fillData = "00000000000000000";
            return fillData.substring(0,length - strIdx.length) + strIdx;
        }
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/product/m/sub/product_image_view_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.isShowBtnTalk = false; // 톡상담 버튼 감추기
            }
        };
    });

})(window, window.angular);