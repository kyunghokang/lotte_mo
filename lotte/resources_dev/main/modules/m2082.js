// M07 프로모션배너 B형..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2082Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'arrayService', 'LotteUtil', 
	function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, arrayService, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2082.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {

				$scope.randomItems = [];
                $scope.sb_index = 1;
                $scope.swipeEnd = function(idx){
                    $scope.sb_index = idx + 1;
                }
				// 랜덤 코드에 따른 처리 randomCd: F(irst), A(ll), N(o)
				if ($scope.moduleData.randomCd == 'F') { // First
					if ($scope.moduleData.items.length > 1) {
						var firstItem = $scope.moduleData.items[0];
						var otherItems = $scope.moduleData.items.slice(1);
						var shuffledItems = arrayService.shuffle(otherItems);
						
						$scope.randomItems.push(firstItem);
						$scope.randomItems = $scope.randomItems.concat(shuffledItems); // 첫번째 item 제외하고 random
					} else {
						$scope.randomItems = $scope.moduleData.items;
					}
				} else if ($scope.moduleData.randomCd == 'A') { // All
					$scope.randomItems = arrayService.shuffle($scope.moduleData.items);
				} else {
					$scope.randomItems = $scope.moduleData.items;
				}
				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (item, idx) {
					var index = idx;
					var label = item.btmTxt ? item.btmTxt : "";

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

	app.service('arrayService', function () {
		this.shuffle = function(array){
			var m = array.length, t, i;

			// While there remain elements to shuffle
			while (m) {
				// Pick a remaining element…
				i = Math.floor(Math.random() * m--);

				// And swap it with the current element.
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			return array;
		}

	});

	app.filter('newlinesWithSpace', function(){
		return function (txt) {
			return txt.replace(/\n/g,' \n ');
		}
	});
})(window, window.angular);