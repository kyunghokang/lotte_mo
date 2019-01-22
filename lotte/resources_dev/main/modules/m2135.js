// M2135 프로모션배너 A형..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2135Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'arrayService', 'LotteUtil',
		function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, arrayService, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2135.html",
            replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.isShowAll = false;
				$scope.randomItems = [];

				// 랜덤 코드에 따른 처리 randomCd: F(irst), A(ll), N(o)
				if ($scope.moduleData.randomCd == 'F') { // First
					if ($scope.moduleData.items.length > 1) {
						var firstItem = $scope.moduleData.items[0];
						$scope.randomItems.push(firstItem);
						var otherItems = $scope.moduleData.items.slice(1);
						var shuffledItems = arrayService.shuffle(otherItems);
						$scope.randomItems = $scope.randomItems.concat(shuffledItems); // 첫번째 item 제외하고 random
					} else {
						$scope.randomItems = $scope.moduleData.items;
					}
				} else if ($scope.moduleData.randomCd == 'A') { // All
					$scope.randomItems = arrayService.shuffle($scope.moduleData.items);
				} else {
					$scope.randomItems = $scope.moduleData.items;
				}
                var sctop = 0;
				$scope.showAll = function() {
					$scope.isShowAll = true;
					//angular.element(document).find('body').addClass('noscroll');
                    //console.log("sctop", $($window).scrollTop());                    
                    sctop = $($window).scrollTop();
                    setTimeout(function(){
                        $(".unit_bn_promo.all.fixed").scrollTop(0);    
                    }, 10);                    
					$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_Btn01');
				};

				$scope.showAllClose = function() {
                    $($window).scrollTop(sctop);
					$scope.isShowAll = false;
					//angular.element(document).find('body').removeClass('noscroll');
				};

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (item, idx, labelTxt, showAllFlag) {
					var label = "",
						index = LotteUtil.setDigit(idx);

					if (showAllFlag) index = "모두보기_" + index;

					if (labelTxt) {
						label = labelTxt;
					} else {
						label += item.topTxt ? item.topTxt + " " : "";
						label += item.btmTxt ? item.btmTxt : "";
					}

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);

	app.filter('newlinesWithSpace', function(){
		return function (txt) {
			return txt.replace(/\n/g,' \n ');
		}
	});
})(window, window.angular);