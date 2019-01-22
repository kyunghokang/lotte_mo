/**
 * M65 명절상품 검색
 * Autor : 박해원
 * Date : 20180109
 */
(function() {
    var app = angular.module('app');
    app.directive('m2066Container', ['$http','$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage','commInitData', 'LotteUtil', 
    function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, commInitData, LotteUtil) {
        return {
            restrict: 'AEC',
            scope: { moduleData : "=" },
            templateUrl : "/lotte/resources_dev/main/modules/m2066.html",
            replace : true,
            controller: 'lotteModulesCtrl',
            link : function ($scope, el) {

                var actionBarShow = false;

                $scope.color = getScope().mainData.colorInfo.fontColor;

                // 디바이스별 전용 css
                $timeout(function() {
                    if (!getMobileIs()) return;

                    if (nativeAppInfo.isIOS) {
                        el.addClass('m2066_ios');
                    }

                    if (nativeAppInfo.isAndroid)
                        el.addClass('m2066_android');
                }, 1000);

                function getMobileIs() {
                    var filter = "win16|win32|win64|mac",
                        r = false;

                    if (navigator.platform) {
                        if (0 > filter.indexOf(navigator.platform.toLowerCase())) {
                            r = true;
                        }
                    }

                    return r;
                }
                
                $scope.sulPrdModel = { keyword : '' };
                $scope.goSearch = function() {
                    var keyword =  $scope.sulPrdModel.keyword;
                    
                    if (!keyword) {
                        alert( '검색어를 입력해주세요.' );
                        return;
                    }

                    var URL = LotteCommon.searchUrl;

                    // holyDayYN = Y <- 명절전용 검색 파라미터
                    URL += "?tclick=m_RDC_main_5581805_M2066_Clk_search&keyword=" + keyword + "&holyDayYN=Y&" + getScope().baseParam;
                    location.href = URL;
                };

                $scope.keyDown = function(e) {
                    if (e.key === "Enter" || e.keyCode === 13)
                        $scope.goSearch();
                };

                $scope.keyUp = function() {
                    if ($scope.sulPrdModel.keyword)
                        $scope.clearShow = true;
                    else
                        $scope.clearShow = false;
                };

                // actionBar hide
                $scope.focusIn = function() {
                    if (actionBarShow) return;

                    getScope().actionbarHideFlag = actionBarShow = true;
                }

                $scope.blur = function() {
                    actionBarShow = false;
                };

                $scope.keywordReset = function() {
                    $scope.sulPrdModel.keyword = '';
                    $scope.clearShow = false;
                    angular.element(".input_search_wrap input").select();
                };

                // actionBar show
                angular.element(window).unbind('scroll.m2066');
                angular.element(window).bind('scroll.m2066', function() {
                    var leaveCehck = angular.element(".input_search_wrap input").length;

                    if (!leaveCehck) {
                        angular.element(window).unbind('scroll.m2066');
                        getScope().actionbarHideFlag = actionBarShow = false;
                        $scope.$apply();
                        return;
                    }

                    if (getScope().actionbarHideFlag && !actionBarShow) {
                        getScope().actionbarHideFlag = false;
                        $scope.$apply();
                    }
                });

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
})();