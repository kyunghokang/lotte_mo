/**
 * [상품상세] 샤넬 연관상품 정보
 * product module: chanel-relation-info
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('chanelRelationInfo', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/chanel_relation_info.html",
				replace : true,
				link : function ($scope, el, attrs) {
					function setData(data, cnt) { // 리턴 받은 데이터에서 cnt개만 담기
						data.chanelRelList.items = data.chanelRelList.items.slice(0, cnt);
						data.chanelBestItemList.items = data.chanelBestItemList.items.slice(0, cnt);
						$scope.pageUI.loadData.chanel_relation_info = data;
					}					
					
					$scope.loadChanelRelationInfo = function() {
						if(!$scope.pageUI.isLoad.chanel_relation_info) {
							if($scope.pageUI.data.callUrlInfo.chanelRelInfoUrl) {
								$scope.pageUI.isLoad.chanel_relation_info = true;
								var url = LotteCommon.isTestFlag ? LotteCommon.chanelRelInfoUrlData : $scope.pageUI.data.callUrlInfo.chanelRelInfoUrl;
								$http.get(url)
								.success(function (data) {
									if(data.data) {
										$scope.pageUI.loadData.chanel_relation_info = data.data;
									}
								});
							}
						}
					}

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLoad.chanel_relation_info===true){ return; }
						if (args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							console.log("Chanel Realtion Info load");
							$scope.loadChanelRelationInfo();
							//$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo +'_Clk_load'+$scope.numberFill(($scope.moduleData.uiData.page+1),2));
						}
					});
				}
			}
	}]);
})(window, window.angular);