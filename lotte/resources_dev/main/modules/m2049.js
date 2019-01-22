(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2049Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 
    function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
        return {
            restrict: 'AEC',
            scope: { moduleData : "=" },
            templateUrl : "/lotte/resources_dev/main/modules/m2049.html",
            replace : true,
            controller: 'lotteModulesCtrl',
            link : function ($scope, el, attrs) {
                // 20180125 아웃링크 구분하여 연결 : 아웃링크 또는 상품상세 
                $scope.link2049 = function(item, tclick) {
                    // 아웃링크 있으면 
                    if (item.isOutLink) {
                        if (getScope().appObj.isApp) {
                            openNativePopup('', item.linkUrl);    
                        } else {
                            window.open(item.linkUrl);
                        }
                    } else {
                        if (item.linkUrl != undefined) {
                            location.href = item.linkUrl + "&" + $scope.baseParam; // +"&tclick="+$scope.moduleData.tclick + tclick;                                   
                        } else {
                            $scope.mainProductClick(item.prdInfo.goodsNo, $scope.moduleData.tclick + tclick);           
                        }
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