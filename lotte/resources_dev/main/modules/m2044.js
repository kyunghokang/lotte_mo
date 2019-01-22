(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2044Container', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2044.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.loginInfo = $scope.rScope.loginInfo;
				
				$scope.prdData = {};
				// Data Load
				$scope.loadData = function () {
					var goodsItems = LotteStorage.getLocalStorage('latelyGoods');

					if (goodsItems == null || goodsItems == undefined || goodsItems == "") {
						return;
					}
					
					goodsItems = goodsItems.replace(/\|/ig,",");

					var goodsItemArr = goodsItems.split(",");
					goodsItemArr.reverse();
					goodsItems = goodsItemArr.slice(0, 6).toString();
					
					//var jsonUrl = LotteCommon.salebestlist_url + "&iids="+ goodsItems;
					var jsonUrl = LotteCommon.rec_good + "&size=50&iids="+ goodsItems;
					//var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2030.json" : $scope.moduleData.jsonCallUrl;
					$.ajax({
						type: 'post'
						, async: true
						, url: jsonUrl
						, dataType  : "jsonp"
						, jsonp  : "callback"
						, success: function(data) {
							// var result = "";
							// if(data.results) {
							// 	for(var i=0;i < data.results.length;i++) {
							// 		if(result != "") {
							// 			result += ",";
							// 		}
							// 		result += data.results[i].itemId;
							// 	}
							// }
							// if(result != "") {
							// 	var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2030.json" : $scope.moduleData.jsonCallUrl + "&latest_prod=" + goodsItems;
							// 	var httpConfig = {
							// 		method: "get",
							// 		url: jsonUrl
							// 	};
							// 	$http(httpConfig) 
							// 	.success(function (data) {
							// 		$scope.prdData = data.data;
							// 	})
							// 	.finally(function () {
							// 	});
							// }
							var result = [];

							if (data.results != null) {
								$(data.results).each(function (i, val) {
									result.push(val.itemId);
								});

								if (result.length > 0) {
									var jsonUrl = LotteCommon.isTestFlag ? "/json/main/main_m2030.json" : $scope.moduleData.jsonCallUrl + "&latest_prod=" + result.join(",");

									var httpConfig = {
										method: "get",
										url: jsonUrl
									};

									$http(httpConfig)
									.success(function (data) {
										$scope.prdData = data.data;
									});
								}
							}
						}
						, error: function(data, status, err) {
							console.log('Data Error : 실시간 맞춤 추천 Data로드 실패');
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