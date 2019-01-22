(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2051Container', ['$rootScope', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($rootScope, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2051.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.selectIdx = 0;

				// 탭 클릭
				$scope.tabClick = function (e, index) {
					console.log(index);
					$scope.selectIdx = index;
					$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_Btn'+$scope.numberFill((index+1),2));

					/*var tElem = $(e.currentTarget);
					var li = tElem;
					// if(li.hasClass('on')){ return; }
					li.addClass('on').siblings().removeClass('on');*/
				};

				$scope.bestMoreClick = function() {
					console.log('bestMoreClick');
				};

				// 유닛 숨김처리
				$scope.unitShow = calcUnitShow();

				function calcUnitShow() {
					console.log('calcUnitShow');

					var unitShow = true;

					for (var i = 0; i < $scope.moduleData.items.length; i++) {
						var items = $scope.moduleData.items[i].prdList.items;

						if (items.length < 4) { // 탭중 상품이 4개보다 작으면 미노출
							unitShow = false;
						}
					}
					return unitShow;
				}
				
				$scope.dispNoClick = function(dispNo, tclick) {
					if (dispNo) {
						window.location.href = LotteUtil.setUrlAddBaseParam(LotteCommon.mainUrl+"?dispNo="+dispNo + "&" + $rootScope.pageUI.baseParam , "tclick="+ tclick);
					}

					console.log(" DispNo Click : ", dispNo);
				};

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabNm, subIdx) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";
				
					if (idx != "-") {
						index = (subIdx) ? "탭_" + tabNm + "_상품_" + LotteUtil.setDigit(subIdx): "탭_" + tabNm + "_" + LotteUtil.setDigit(idx);
					}

					label = (label + "").replace(/\n/gi, " ");
					
					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);
})(window, window.angular);