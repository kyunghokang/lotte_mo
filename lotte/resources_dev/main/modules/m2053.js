// M53 선물함 즐겨찾기
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2053Container', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2053.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.loginInfo = $scope.rScope.loginInfo;
				
				$scope.presentData = {};
				// Data Load
				$scope.loadData = function () {
					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2053.json" : $scope.moduleData.jsonCallUrl;
					var httpConfig = {
						method: "get",
						url: jsonUrl
					};

					$http(httpConfig) 
					.success(function (data) {
						$scope.presentData = data.data;
					})
					.finally(function () {
					});
				};
				
				$scope.loadData();
				
				$scope.presentWriteClick = function(linkUrl, tclick, writable) {
					if (!writable) {
						alert("선물 발송완료 후 후기를 작성해주세요.");
						return false;
					}
					
					if (linkUrl) {
							// if($scope.listDataCheck(this.item)) {
							// 	tclick += "_"+(this.$index+1)+"_Rel_Clk"+$scope.getDeviceTclickName($scope.rScope.appObj);
							// } else {
							// 	tclick += "_Rel_Clk"+$scope.getDeviceTclickName($scope.rScope.appObj);
							// }
						window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick);
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