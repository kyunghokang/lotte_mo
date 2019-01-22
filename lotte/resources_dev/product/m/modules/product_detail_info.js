/**
 * [상품상세] 상품정보 자세히보기
 * product module: product-detail-info
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('productDetailInfo', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/product_detail_info.html",
				replace : true,
				link : function ($scope, el, attrs) {
					var $el = angular.element(el);
					
					$scope.viewPrdDetailPageBtn = false; // 상품기술서 원본보기 버튼 활성화 Flag
					$scope.pageUI.productInfoMoreBtn = $scope.pageUI.productInfoMoreBtn ? $scope.pageUI.productInfoMoreBtn : false; // 상품정보 더보기
					$scope.pageUI.productInfoMoreBtnUp = $scope.pageUI.productInfoMoreBtnUp ? $scope.pageUI.productInfoMoreBtnUp : false; // 상품정보 접기
					$scope.pageUI.productInfoGradient = $scope.pageUI.productInfoGradient ? $scope.pageUI.productInfoGradient : false; // 상품정보 그라데이션
					$scope.linkRealProdDetail = $scope.baseLink(LotteCommon.productProductImgData) + "&goods_no=" + $scope.pageUI.reqParam.goods_no;
					
					$scope.productInfoMoreCk = function() {
						//alert(angular.element("#detailLayout").height());
						$timeout(function() {
							//alert(angular.element("#detailLayout").height());
							if(angular.element("#detailLayout").height() > 2000) {
								$scope.pageUI.productInfoMoreBtn = true;
								$scope.pageUI.productInfoGradient = true;
							}
						},1500);
					};

					$scope.setDetailLayoutData = function(data) {
						// 기술서 금지 태그 삭제
						$scope.defenseBadHtml(data, angular.element("#detailLayout"));
						// 상품기술서 iframe, 사이즈 조견표 처리
						$scope.prdDetailInfoModified(angular.element("#detailLayout"), angular.element("#detailLayout iframe, #detailLayout #sizeGuideTable .tabel_list_wrap >table"));
					};

					// 세션 스토리지 사용시 데이터 로드 못하는 문제 해결
					if ($scope.pageUI.loadData.product_detail) {
						$scope.pageUI.isLoad.product_detail = true;
						$scope.setDetailLayoutData($scope.pageUI.loadData.product_detail);
					}
					
					$scope.loadProductDetailInfo = function() {
						if(!$scope.pageUI.isLoad.product_detail) {
							if($scope.pageUI.data.callUrlInfo.prdDetailInfoUrl) {
								$scope.pageUI.isLoad.product_detail = true;
								var url = LotteCommon.isTestFlag ? LotteCommon.productDetailData : $scope.pageUI.data.callUrlInfo.prdDetailInfoUrl;
								$http.get(url)
								.success(function (data) {
									if (data.max) {
										$scope.pageUI.loadData.product_detail = data.max;
										$scope.setDetailLayoutData(data.max);
										$scope.productInfoMoreCk();
									}
								});
							}
						}
					};
					
					$scope.productInfoDetailMore = function() {
						$scope.pageUI.productInfoMoreBtn = false;
						$scope.pageUI.productInfoMoreBtnUp = true;
					};

					$scope.productInfoDetailMoreShow = function() {
						$scope.pageUI.productInfoMoreBtn = true;
						$scope.pageUI.productInfoMoreBtnUp = false;
						angular.element(window).scrollTop(angular.element('#productDetailSelect').offset().top+1962);
					};
					
					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						// 상품기술서 원본보기 버튼 활성화 체크 (48은 헤더 높이)
						if (args.scrollPos + ($scope.appObj.isApp ? 0 : 48) > $el.offset().top && args.scrollPos < $el.offset().top + $el.height() - 100) { // (100 은 상품상세기술서가 끝날때 사라지면 늦은 감이 있어서 추가)
							//console.log($el.offset().top+":"+args.scrollPos+":"+$el.height());
							$scope.viewPrdDetailPageBtn = true;
						} else {
							$scope.viewPrdDetailPageBtn = false;
						}

						if ($scope.pageUI.isLoad.product_detail === true) {
							return;
						}

						if (args.winHeight * 1.5 <= args.scrollPos + args.winHeight) {
							// console.log("product info load");
							$scope.loadProductDetailInfo();
							//$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo +'_Clk_load'+$scope.numberFill(($scope.moduleData.uiData.page+1),2));
						}
					});
				}
			}
	}]);
})(window, window.angular);