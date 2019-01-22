/**
 * [상품상세] 다른 고객들이 함께 본 상품
 * product module: product-best-view
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('productBestView',
				['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 'commInitData',
		function ($http,   $timeout,   $window,   $location,   LotteCommon,   LotteCookie,   LotteStorage,   LotteUtil,   commInitData) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/product_best_view.html",
				replace : true,
				link : function ($scope, el, attrs) {
					function setData(data, cnt) { // 리턴 받은 데이터에서 cnt개만 담기
            if(Object.keys(data).length === 0) {
              return;
            }
						data.prdList.items = data.prdList.items.slice(0, cnt);
						$scope.pageUI.loadData.product_bestView = data;
					}

					$scope.loadProductBestView = function() {
						if (!$scope.pageUI.isLoad.product_bestView) {
							if ($scope.pageUI.data.callUrlInfo.recommPrdInfoUrl) {
								$scope.pageUI.isLoad.product_bestView = true; // 데이터 로드 체크 Flag

								// 20181204 Alido API 개발 및 ABC테스트
								/* 상품추천 API(recobell,DS팀,Alido) GA cid 마지막자리에 따라 ABC TEST(요청자:데이터사이언스팀 류화진) */
								var lastIndex = LotteCookie.getCookie("_ga").length - 1;
								var gaCidLastNum = LotteCookie.getCookie("_ga").charAt(lastIndex); // GA cid cookie 마지막 자리수 체크
								var castCidNum = parseInt(gaCidLastNum, 10);
								var rcbRegx = /[0-2]/;
								var dsRegx = /[3-5]/;
								var alidoRegx = /[6-8]/;

								var abcUrl = "";
								var alidoHeader = {};
								var goodsNoForParam = $scope.pageUI.data.commonInfo.goodsNo;
								var dispLrgNoForParam = $scope.pageUI.data.commonInfo.dispLrgNo;
								var dispMidNoForParam = $scope.pageUI.data.commonInfo.dispMidNo;
								var dispSmlNoForParam = $scope.pageUI.data.commonInfo.dispSmlNo;
								var isAlido = false;

								if (rcbRegx.test(castCidNum)) {
									abcUrl = LotteCommon.rec_good + "&size=15&iids=" + goodsNoForParam;
								} else if (dsRegx.test(castCidNum)) {
									abcUrl = LotteCommon.salebestlist_url_ds + "?size=15&iids=" + goodsNoForParam;
								} else if (alidoRegx.test(castCidNum)) {
									isAlido = true;
									alidoHeader["alido-customer-domain"] = "lotte.com"; // 임시
									alidoHeader["alido-access-key"] = "RCM_e86120208b56bfbd5cdfa5014b4efabd57dc64f69df2c6fadecdce44d6b29398"; // 임시
									abcUrl = LotteCommon.salebestlist_url_al +
										"?pageareaSetId=1" +
										"&itemInfoYn=Y" +
										"&preview=N" +
										"&addup=N" +
										"&exBrandId=999999" +
										"&itemList=" + goodsNoForParam +
										"&categoryId=" + dispLrgNoForParam + "|" + dispMidNoForParam + "|" + dispSmlNoForParam +
										"&limit=15";
								} else {
									// GA 끝자리 9
								}

								var bestViewUrl = LotteCommon.isTestFlag ? LotteCommon.productBestViewData : $scope.pageUI.data.callUrlInfo.recommPrdInfoUrl;

								var ajaxInfo = {
									type: LotteCommon.isTestFlag ? isAlido ? "post" : "get" : "post",
									async: true,
									url: abcUrl,
									timeout: 5000, // api 호출 5초 이상 걸릴 시 화면 그리지 않음.
									headers: isAlido ? alidoHeader : {},
									dataType: LotteCommon.isTestFlag ? "json" : isAlido ? "json" : "jsonp",
									success: function (recoData) {
										var itemArr = [],
											resultData = isAlido ? recoData.itemList : recoData.results,
											i = 0;

										if (resultData && resultData.length > 0) {
											for (i; i < resultData.length; i++) {
												itemArr.push(resultData[i].itemId);
											}

											$http.get(bestViewUrl, {
												params: {
													goods_no: $scope.pageUI.data.commonInfo.goodsNo,
													goodsRelList: itemArr.join(",")
												}
											})
											.success(function (data) {
												if (data.data) {
													if (isAlido) {
														for (var j = 0, arrLen = data.data.prdList.items.length; j < arrLen; j++) {
															data.data.prdList.items[j].algorithm = resultData[j].algorithm;
															data.data.prdList.items[j].algorithmSetId = resultData[j].algorithmSetId;
															data.data.prdList.items[j].pageareaId = recoData.pageareaId;
														}
													}

                          setData(data.data, 10);
												}
											})
											.error(function (data) {
												console.warn("다른 고객들이 함께 본 상품 조회 오류");
											});
										}
									},
									error: function (data, status, err) {
										console.warn("레코벨 데이터 호출 오류, 현재 상품번호만으로 호출");
										$http.get(bestViewUrl, {
											params: {
												goods_no: $scope.pageUI.data.commonInfo.goodsNo
											}
										})
										.success(function (data) {
											if (data.data) {
												setData(data.data, 10);
											}
										})
										.error(function (data) {
											console.warn("다른 고객들이 함께 본 상품 조회 오류");
										});
									},
								};
								$.ajax(ajaxInfo);
							}
						}
					};

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLoad.product_bestView===true){ return; }
						if (args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							console.log("product bestView load");
							$scope.loadProductBestView();
							//$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo +'_Clk_load'+$scope.numberFill(($scope.moduleData.uiData.page+1),2));
						}
					});
				}
			};
	}]);
})(window, window.angular);
