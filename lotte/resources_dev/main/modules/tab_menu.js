(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('tabMenuContainer', ['$rootScope', '$timeout', '$window', '$location','LotteUtil', 'LotteCommon', 'LotteCookie', 'LotteStorage',
	function ($rootScope, $timeout, $window, $location, LotteUtil, LotteCommon, LotteCookie, LotteStorage) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=", tabData : "=", tabIndex : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/tab_menu.html",
            replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
                $scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.bgcolor = $scope.rScope.mainData.colorInfo.copyBgColor;
                $scope.linecolor = $scope.rScope.mainData.colorInfo.lineColor;

                $scope.other_bg = "";
                if ($scope.rScope.mainData.dispNo == '5570121') {
                    $scope.linecolor = "#4D8C71";
                    $scope.bgcolor = "#5C997F";
                    $scope.other_bg = "#E7A1A1";                    
                } else if($scope.rScope.mainData.dispNo == '5570122') {
                    $scope.linecolor = "#E68A97";
                    $scope.bgcolor = "#D998A3";
                    $scope.other_bg = "#5C997F";
                } else if($scope.rScope.mainData.dispNo == '5570123') {
                    $scope.linecolor = "#F27C3D";
                    $scope.bgcolor = "#F09461";
                    $scope.other_bg = "#98ADD9";
                } else if($scope.rScope.mainData.dispNo == '5570124') {
                    $scope.linecolor = "#7291CF";
                    $scope.bgcolor = "#98ADD9";
                    $scope.other_bg = "#F09461";
                } else if($scope.rScope.mainData.dispNo == '5572537' || $scope.rScope.mainData.dispNo == '5572539') {
                    $scope.linecolor = "#7291CF";
                    $scope.bgcolor = "#98ADD9";
                    $scope.other_bg = "#98ADD9";
                } else{
                    $scope.rScope.mainData.subTab.items[0].colorInfo
                    //신규 탭인 경우                     
                    $scope.bgcolor = $scope.rScope.mainData.colorInfo.copyBgColor;
                }
                $scope.linecolor = $scope.bgcolor;

				$scope.tabClick = function(index) {
                    $scope.tabIndex = index;//this.$index; 20170912
                    var item = $scope.tabData[index];
                    $scope.rScope.sendTclick('m_RDC_main_'+ item.dispNo+'_Clk_subtab');
					$rootScope.loadData(0, item.dispNo, "contentContainer", $scope.tabIndex);
					$scope.rScope.setSubTabChangeCurDisp(item.dispNo, item.curDispNoSctCd);
					// console.log("tab click : "+$scope.tabIndex);
				};

				// Google Analytics Event Tagging
				$scope.logGASubTabEach = function (subTab,labelTxt) {
					var index = subTab;
					var label = labelTxt ? labelTxt : "";
					label = (label + "").replace(/\n/gi, " ");
					// idx, label
					$scope.logGAEvtTab(index, label);
				};
			}
		}
	}]);
})(window, window.angular);