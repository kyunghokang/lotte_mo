(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2048Container', ['$rootScope', '$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 'LotteCookie',
	function ($rootScope, $http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil, LotteCookie) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2048.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {			
				$scope.rScope = LotteUtil.getAbsScope($scope);

				$scope.allSubCateClick = function (idx) {
					if ($scope.allSubCateOpenFlag == idx) {
						$scope.allSubCateOpenFlag = null;
					} else {
						$scope.allSubCateOpenFlag = idx;
					}
				};
				
				/*$scope.quantityCnt = []; //수량 갯수
				$scope.subCate = []; 
				for(var i = 0; i < 5; i++){
					$scope.quantityCnt.push(i+1);
					$scope.subCate[i] = 0;
				}				
				
				$scope.cateName = [1,1,1,1];
				$scope.subCateClick = function(pidx, idx, itemNo){
					$scope.subCate[pidx] = idx;	
					$scope.cateName[pidx] = itemNo;
					$scope.allSubCateOpenFlag = null;
				}*/
				
				$scope.cateName = [1,1,1,1];
				$scope.cartData = {};
				
				$scope.cartSelect = function(goodsNo, quantity, minCnt, maxCnt, prdIdx, prdTclick) {
					//alert(goodsNo+":"+quantity+":"+minCnt+":"+maxCnt+":"+prdIdx+":"+prdTclick);
					if (minCnt > quantity) {
						alert("구매 최소수량은 "+minCnt+"개입니다.");
						return false;
					}

					if (maxCnt < quantity) {
						alert("최대 선택 가능한 개수는 "+maxCnt+"개 입니다.");
						return false;
					}
					
					$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_Cart');
					
					//var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2048.json" : $scope.moduleData.jsonCallUrl+"?goods_no="+goodsNo+"&ord_qty="+quantity;
					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2048.json" : "/json/mylotte/direct_cart_ins.json?goods_no="+goodsNo+"&ord_qty="+quantity;					
					var httpConfig = {
						method: "get",
						url: jsonUrl
					};

					$http(httpConfig) 
					.success(function (data) {
						$scope.cartData = data;
						$scope.resultData(goodsNo, prdIdx, prdTclick);
					})
					.finally(function () {
					});
				};				
				
				$scope.resultData = function(goodsNo2, prdIdx2, prdTclick2) {
					if ($scope.cartData.data != null) {
						if ($scope.cartData.data.resultCode == "0000") {  // 성공 : 0000 , 실패 : 9999
							try {
								angular.element($window).trigger("refreshCartCount");
							} catch (e) {}

							alert($scope.cartData.data.resultMsg);
						} else if ($scope.cartData.data.resultCode == "9999") {
							alert($scope.cartData.data.resultMsg);
							//alert("옵션이 있는 상품입니다. \n상품상세에서 선택후 장바구니에 담아주세요!!");

						} else if ($scope.cartData.data.resultCode == "1000") {	
							alert($scope.cartData.data.resultMsg);
							$scope.mainProductClick(goodsNo2, prdTclick2 + '_Clk_Prd'+$scope.numberFill((prdIdx2+1),2));
						} else {
							alert($scope.cartData.data.resultMsg); //기타
						}
					} else {
						alert($scope.cartData.error.response_msg);
					}
				};

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabNm) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";

					if (idx != "-") {
						index = LotteUtil.setDigit(idx);
					}

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label, tabNm);
				};
			}
		}
	}]);
})(window, window.angular);