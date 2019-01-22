/**
 * [상품상세] 기획전 상품 리스트
 * product module: plan-product-list
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('planProductList', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/plan_product_list.html",
				replace : true,
				link : function ($scope, el, attrs) {

					function prdPlanDetailInfoModify(selector, data) {
						// 기술서 금지 태그 삭제
						$scope.defenseBadHtml(data, angular.element(selector));
						// 상품기술서 iframe, 사이즈 조견표 처리
						$scope.prdDetailInfoModified(angular.element(selector), angular.element(selector + " iframe, " + selector + " #sizeGuideTable .tabel_list_wrap >table"));
					}

					$timeout(function () {
						if ($scope.pageUI.data.planPrdInfo.topHtml) {
							prdPlanDetailInfoModify("#planPrdTopHtml", $scope.pageUI.data.planPrdInfo.topHtml);
						}

						if ($scope.pageUI.data.planPrdInfo.bottomHtml) {
							prdPlanDetailInfoModify("#planPrdBottomHtml", $scope.pageUI.data.planPrdInfo.bottomHtml);
						}
					}, 100);

					/**
					 * 부모(product_view_2017.js product_view_2017_container.html) 스코프에 저장되어 있는 데이터 이용
					 * $scope.pageUI.data.planPrdInfo
					 */

					// todo : 상품 클릭 기능구현
					// product_view_2017.js에 있어서 주석처리
					// $scope.productClick = function(goodsNo, tclick){
					// 	if(goodsNo) {
					// 		var url = LotteUtil.setUrlAddBaseParam(LotteCommon.productviewUrl , $scope.pageUI.baseParam + "&goods_no=" + goodsNo + "&curDispNo=" + $scope.pageUI.reqParam.curDispNo + "&curDispNoSctCd=" + $scope.pageUI.reqParam.curDispNoSctCd + "&"+ $scope.pageUI.baseParam);
					// 		$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					// 	}
					// 	console.log(" Product Click : ", goodsNo, "\n tclick : " ,tclick);
					// }

					$scope.planBenefitClick = function(goodsNo, tclick) {
						var url = LotteUtil.setUrlAddBaseParam(LotteCommon.productCollectBenefitsUrl , $scope.pageUI.baseParam + "&goods_no=" + goodsNo + "&curDispNo=" + $scope.pageUI.reqParam.curDispNo + "&curDispNoSctCd=" + $scope.pageUI.reqParam.curDispNoSctCd + "&"+ $scope.pageUI.baseParam);
						$window.location.href = url + (tclick ? "&tclick=" + tclick : "");
					}
						
					$scope.addCartClick = function(goodsNo) {
						var optionScope = angular.element("#optionWrap").scope();
						console.log('plan cart goodsNo : ', goodsNo);
						optionScope.cartPlanProduct(goodsNo, this.item.idx);
					}

					$scope.planProductDetailView = function(goodsNo) {
						$scope.pageUI.cultureY = false; // 도서.문화 소득공제 체크 여부
						$scope.pageUI.planProduct.idx = this.$index;
						$scope.pageUI.planProduct.goodsNo = goodsNo;
						var planProdDetailScope = angular.element("#planProductDetail").scope();
						planProdDetailScope.loadPlanProductDetail(goodsNo);

						$scope.pageUI.planProduct.beforeScrollPosY = angular.element($window).scrollTop();
						// angular.element("#wrapper").css("height","100%");// 기획전 상품 레이어팝업 열때 베이스 컨텐츠 스크롤 막기위해
						$scope.dimmedOpen({dimmed:false}); // 기획전 상품 레이어팝업 열때 베이스 컨텐츠 스크롤 막기위해
					}
				}
			}
	}]);
})(window, window.angular);