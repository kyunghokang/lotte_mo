// M10 인기카테고리..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2081Container', ['LotteUtil', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage',
		function (LotteUtil, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage) {
			return {
				restrict: 'AEC',
				scope: { moduleData : "=" },
				templateUrl : "/lotte/resources_dev/main/modules/m2081.html",
				replace : true,
				controller: 'lotteModulesCtrl',
				link : function ($scope, el, attrs) {
					$scope.rScope = LotteUtil.getAbsScope($scope);

					$scope.showSideCtgHeader = function(tclick){
						$scope.rScope.sendTclick(tclick);
						$scope.rScope.showSideCtgHeader();
					};

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
    app.filter('cutStrLen', [function(){
        return function(str, len) {
            var reStr = "";
            if(str.len <= len) reStr = str;
            else reStr = str.substring(0, len);

            return reStr;
        }
    }]);     
})(window, window.angular);