// M31 개인화 기획전 배너..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2031Container', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2031.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.bannerData = {};
				
				// Data Load
				$scope.loadData = function () {
					var goodsItems = LotteStorage.getLocalStorage('latelyGoods');

					if (goodsItems == null || goodsItems == undefined) {
						return;
					}

					goodsItems = goodsItems.replace(/\|/ig,",");
					
					var goodsItemArr = goodsItems.split(",");
					goodsItemArr.reverse();
					goodsItems = goodsItemArr.slice(0, 6).toString();
					
					//var jsonUrl = LotteCommon.salebestPaln_url + "&iids="+ goodsItems;
					var jsonUrl = LotteCommon.rec_plan + "&size=10&iids="+ goodsItems;
					//var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2031.json" : $scope.moduleData.jsonCallUrl;

					$.ajax({
						type: 'post'
						, async: true
						, url: jsonUrl
						, dataType  : "jsonp"
						, jsonp  : "callback"
						, success: function(data) {
							var result = [];

							
							if (data.results != null) {
								$(data.results).each(function (i, val) {
									result.push(val.itemId);
								});
								
								if (result.length > 0) {
									var jsonUrl = LotteCommon.isTestFlag ? "/json/main/main_m2031.json" : $scope.moduleData.jsonCallUrl + "&spdp_no_list=" + result.join(",");
									
									var httpConfig = {
										method: "get",
										url: jsonUrl
									};
									
									$http(httpConfig)
									.success(function (data) {
										$scope.bannerData = data.data;
									});
								}
							}
						}
						, error: function(data, status, err) {
							console.log('Data Error : 추천기획전 로드 실패');
						}
					});
				};
				
				$scope.loadData();

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";

					if (idx != "-") {
						index = LotteUtil.setDigit(idx);
					}

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);
})(window, window.angular);