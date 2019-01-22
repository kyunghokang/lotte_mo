// M36 인기검색어(실시간검색어) 형..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2036Container', ['$rootScope','$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($rootScope, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2036.html",
            replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.selectIdx = 0;

				
                                
                // 탭 클릭
				$scope.tabClick = function (e, index) {
					$scope.selectIdx = index;
					$scope.rScope.sendTclick($scope.moduleData.tclick + '_Swp_idx'+$scope.numberFill((index+1),2));
                    
                    //클릭 후 위치 이동 
                    $timeout(function () { 
                        var $headerMenu = angular.element(el).find("div[lotte-slider]"),
                            $headerMenuWrap = $headerMenu.find(">ul"),
                            $headerMenuList = $headerMenuWrap.find(">li"),
                            $target = $headerMenuList.eq(index),
                            targetPosX = 0,
                            animateTime = 200;
                        
                        if ($headerMenu.length > 0 && $headerMenuWrap.length > 0 && $target.length > 0 && $headerMenu.width() < $headerMenuWrap.width()) {                            
                            targetPosX = ($headerMenu.width() / 2) + $headerMenuWrap.offset().left - ($target.offset().left + ($target.outerWidth() / 2));
                            $headerMenu.scope().lotteSliderMoveXPos(targetPosX, animateTime);
                        }
                    }, 0);
				};
                
                
				
				$scope.m36Today = "";

				var nowDate = new Date();
				var nowDay = new Array('일', '월', '화', '수', '목', '금', '토');

				$scope.m36Today = (nowDate.getMonth()+1) + "/" + nowDate.getDate() + "(" + nowDay[nowDate.getDay()] + ") "+nowDate.getHours() + "시";

				$scope.keywordMoreClick = function(tclick) {
					var curKeyword = $scope.moduleData.items[$scope.selectIdx].keyword;

					//http://mprj2.lotte.com/search/m/mobile_search_list.do?c=mlotte&udid=&v=&cn=&cdn=&schema=&dpml_no=1&type=&dispCnt=30&reqType=N&reqKind=C&tclick=m_DC_SrhLayer_Clk_Btn_1&keyword=%EC%95%84%EB%94%94%EB%8B%A4%EC%8A%A4
					var url = LotteCommon.searchUrl+"?"+$rootScope.$$childHead.baseParam+"&tclick="+tclick+"&keyword="+curKeyword;
					$window.location.href = url;
				};

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabNm, subIdx) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";
					
					if (idx != "-") {
						index = (!subIdx) ? "탭_"+ LotteUtil.setDigit(idx) : "탭_" + LotteUtil.setDigit(idx) +"_상품_" + LotteUtil.setDigit(subIdx);
					}else{
						index = "더보기";
					}

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);
})(window, window.angular);