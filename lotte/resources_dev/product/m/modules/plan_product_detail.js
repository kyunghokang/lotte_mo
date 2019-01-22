/**
 * [상품상세] 기획전형 상품 상세
 * product module: plan-product-detail
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('planProductDetail', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/plan_product_detail.html",
				replace : true,
				link : function ($scope, el, attrs) {

					$scope.setPlanProductDetailLayoutData = function(data) {
						// 기술서 금지 태그 삭제
						$scope.defenseBadHtml(data, angular.element("#planDetailLayout"));

						// 상품기술서 iframe, 사이즈 조견표 처리
						$scope.prdDetailInfoModified(angular.element("#planDetailLayout"), angular.element("#planDetailLayout iframe, #planDetailLayout #sizeGuideTable .tabel_list_wrap >table"));
					};
					
					$scope.loadPlanProductDetailInfo = function() {
						var url = LotteCommon.isTestFlag ? "/json/product/product_detail_60832055.json" : LotteCommon.productDetailData + "?goods_no="+$scope.pageUI.planProduct.goodsNo;
						$http.get(url)
						.success(function (data) {
							if (data.max) {
								$scope.pageUI.planProduct.data[$scope.pageUI.planProduct.goodsNo].detailHtml = data.max;
								$scope.setPlanProductDetailLayoutData(data.max);
							}
						});
					};
					
					$scope.loadPlanProductDetail = function(goodsNo) {
						// console.log('loadPlanProductDetail goodsNo: '+ goodsNo);
						var url = LotteCommon.isTestFlag ? "/json/product/product_view_418852201.json" : LotteCommon.productProductView2017Data + "?goods_no="+goodsNo;
						$http.get(url)
						.success(function(data) {
							
							$scope.pageUI.planProduct.data[goodsNo] = data.data;
							
							$scope.pageUI.planProduct.data[goodsNo].detailGift = ($scope.pageUI.planProduct.data[goodsNo].basicInfo.giftInfo) ? true : false; 
							//20180726 기획전 상품 상세 선물하기 안내 문구 추가
							
							var prdDetailInfo = $scope.pageUI.planProduct.data[goodsNo].basicInfo.itemInfoList.items;

								//20180528 선물하기 안내 문구 추가
							angular.forEach(prdDetailInfo, function(val,key){
								//상품정보 리스트에 선물서비스가 있다면 비노출처리
								if(val.key == '선물서비스'){
									$scope.pageUI.planProduct.data[goodsNo].detailGift =  false;
									return;
								}
							
							});

							// lg희망일배송 
							$scope.pageUI.lgDeliver = ($scope.pageUI.planProduct.data[goodsNo].dlvInfo.lgDeliveryYn) ? true : false;
							
							// $scope.pageUI.planProduct.show = true;
							// APP 다운 배너가 있다면 감추기
							// angular.element("#wrapper").addClass("hide_appdown_bnr");
							// angular.element("html, body").css({overflow: "hidden"});

			                //동영상
			                setTimeout(function() {
								autoVideoPlay('autoVideoPlanDetail', '#autoVideoPlanDetail');
							}, 1500);

							location.href = "#/planProductDetail";

							// location.hash = "planProductDetail";
							// Back 버튼 클릭시 기획전 상세 레이어 닫기
							// $scope.pushState("planProductDetailLayer", function () {
							// 	$scope.pageUI.planProduct.show = false;
							// 	angular.element("html, body").css({overflow: ""});
							// 	$scope.dimmedClose();

							// 	// 앱다운 배너가 있다면 다시 활성화
							// 	angular.element("#wrapper").removeClass("hide_appdown_bnr");
							// });

							//기획전 상품 좌우 이동하기 버튼 유효여부 판단위해
							$scope.pageUI.planProduct.prevIdx = $scope.getPrevPlanProdIdx();
							$scope.pageUI.planProduct.nextIdx = $scope.getNextPlanProdIdx();

							// console.log('angular.element(\'#planProductDetail\')', angular.element('#planProductDetail'));
							angular.element('#planProductDetail').scrollTop(0);

						})
						.error(function () {
							$scope.pageUI.loadingFail = true;
							console.log('Data Error : 기획상품 상세정보 데이터 로드 실패');
						})
						.finally(function () {
							$scope.loadPlanProductDetailInfo();
						});
					}

					$scope.planProdSelectClick = function(goodsNo, index){
						// console.log('planProdSelectClick', goodsNo, index);
						
						$scope.pageUI.planProduct.showSelectBox = false;
						
						$scope.pageUI.planProduct.idx = index;
						$scope.pageUI.planProduct.goodsNo = goodsNo;
						$scope.loadPlanProductDetail(goodsNo);

						// 페이지 최상단으로 이동
						// $window.scrollTop(0);
						angular.element(document.getElementById('planProductDetailScrollArea')).scrollTop(0);
					}
					
					$scope.planProdSelectOpen = function(event) {
						if (event) {
							event.stopPropagation();
						}

						$scope.pageUI.planProduct.showSelectBox = !$scope.pageUI.planProduct.showSelectBox;

						angular.element($window).on("click.planProdSelectOpen", function () {
							angular.element($window).off(".planProdSelectOpen");
							$scope.pageUI.planProduct.showSelectBox = false;
						});
					}
					
					$scope.closePlanProductDetail = function() {
						// $scope.pageUI.planProduct.show = false;
						// angular.element("html, body").css({overflow: ""});

						// angular.element("#wrapper").attr("style",""); // 기획전 상품 레이어팝업 열때 베이스 컨텐츠 스크롤 막았던것 풀기
						// $scope.dimmedClose(); // 기획전 상품 레이어팝업 열때 베이스 컨텐츠 스크롤 막기위해
						// $scope.pushStateRemove(); // 페이지에 pushState가 남아 있는지 확인하여 남아 있다면 제거
						//location.href = "#/";
                        history.go(-1); //20180730 eung 
					}

					// 기획전 상품 좌우 이동버튼 클릭 시 품절여부 판단하여 알맞는 상품Idx 찾기
					$scope.getPrevPlanProdIdx = function () {
						var goodsIdx;
						for (var i = $scope.pageUI.planProduct.idx - 1; i >= 0; i--) {
							if($scope.pageUI.data.planPrdInfo.prdList.items[i].goodsNo && !$scope.pageUI.data.planPrdInfo.prdList.items[i].soldOutYn){
								goodsIdx = i; // 구매가능 goodsNo의 idx 저정
								break;
							}
						}

						// 가능한 prev 상품 없으면 뒤부터 찾음
						if(goodsIdx == undefined){
							for (var i = $scope.pageUI.data.planPrdInfo.prdList.items.length - 1; i >= 0; i--) {
								if ($scope.pageUI.data.planPrdInfo.prdList.items[i].goodsNo && !$scope.pageUI.data.planPrdInfo.prdList.items[i].soldOutYn) {
									goodsIdx = i; // 구매가능 goodsNo의 idx 저정
									break;
								}
							}
						}
						// console.log('getPrevPlanProdIdx', goodsIdx);
						return goodsIdx;
					}

					$scope.getNextPlanProdIdx = function () {
						var goodsIdx;
						for (var i = $scope.pageUI.planProduct.idx + 1; i < $scope.pageUI.data.planPrdInfo.prdList.items.length; i++) {
							if ($scope.pageUI.data.planPrdInfo.prdList.items[i].goodsNo && !$scope.pageUI.data.planPrdInfo.prdList.items[i].soldOutYn) {
								goodsIdx = i; // 구매가능 goodsNo의 idx 저정
								break;
							}
						}

						// 가능한 next 상품 없으면 처음부터 찾음
						if(goodsIdx == undefined){
							for (var i = 0; i < $scope.pageUI.data.planPrdInfo.prdList.items.length; i++) {
								if ($scope.pageUI.data.planPrdInfo.prdList.items[i].goodsNo && !$scope.pageUI.data.planPrdInfo.prdList.items[i].soldOutYn) {
									goodsIdx = i; // 구매가능 goodsNo의 idx 저정
									break;
								}
							}
						}
						// console.log('getNextPlanProdIdx', goodsIdx);
						return goodsIdx;
					}
				}
			}
	}]);
    
    app.filter('trusted', ['$sce', function ($sce) { 
        return function(url) { 
            return $sce.trustAsResourceUrl(url); 
        };
    }]);
})(window, window.angular);