(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2071Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 
		function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2071.html",
            replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.mainBannerClick_check = function(item, $index){
                    var morestr = "";
                    if(item.linkUrl.indexOf('main_phone.do') > 0){
                        morestr = "&tmp=" + Math.floor(Math.random(10)*100);   
                    }
                    $scope.mainBannerClick(item.linkUrl + morestr, item.isOutLink, '');
                }
                
				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (item, idx) {
					var index = idx;
					var label = item.txt ? item.txt : "";

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
    app.filter('cutStrLen', [function(){
        return function(str, len) {
            var reStr = "";
            if(str.len <= len) reStr = str;
            else reStr = str.substring(0, len);

            return reStr;
        }
    }]); 
	app.filter('myLimitTo', function() {
		return function(input, limit, begin) {
			return input.slice(begin, begin + limit);
		};
	});

})(window, window.angular);