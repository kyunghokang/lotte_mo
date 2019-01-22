// M60 실시간베스트(베스트)..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2060Container', ['$rootScope', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($rootScope, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2060.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);

				if (!$scope.moduleData.uiData) {
					$scope.moduleData.uiData = {
						page: 1,
						lotteSelIdx : 0,		
						naverSelIdx : 0,	
						keywordType: "lotte",
					}
				}
				
				$scope.m60Today = "";

				var nowDate = new Date();
				var nowDay = new Array('일', '월', '화', '수', '목', '금', '토');

				$scope.m60Today = (nowDate.getMonth() + 1) + "월 " + nowDate.getDate() + "일 " + nowDate.getHours() + "시 " + nowDate.getMinutes() + "분";

				$scope.tabClick = function (keywordType, index) { // 탭 클릭
					$scope.moduleData.uiData.keywordType = keywordType;

					if (keywordType == 'lotte') {
						$scope.moduleData.uiData.lotteSelIdx = index;
						$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_DCSearch_idx'+$scope.numberFill((index+1),2));
					} else {
						$scope.moduleData.uiData.naverSelIdx = index;
						$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_NASearch_idx'+$scope.numberFill((index+1),2));
					}
                    
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

				$scope.keywordMoreClick = function (keywordType, tclick) {
					$scope.moduleData.uiData.keywordType = keywordType;

					var curKeyword;

					if (keywordType == 'lotte') {
						curKeyword = $scope.moduleData.lotteKeywordList.items[$scope.moduleData.uiData.lotteSelIdx].keyword;
					} else {
						curKeyword = $scope.moduleData.naverKeywordList.items[$scope.moduleData.uiData.naverSelIdx].keyword;
					}

					// console.log('keywordMoreClick', curKeyword);

					//http://mprj2.lotte.com/search/m/mobile_search_list.do?c=mlotte&udid=&v=&cn=&cdn=&schema=&dpml_no=1&type=&dispCnt=30&reqType=N&reqKind=C&tclick=m_DC_SrhLayer_Clk_Btn_1&keyword=%EC%95%84%EB%94%94%EB%8B%A4%EC%8A%A4
					var url = LotteCommon.searchUrl + "?" + $rootScope.$$childHead.baseParam + "&tclick=" + tclick + "&keyword=" + curKeyword;
					$window.location.href = url;
				};

				$scope.keywordTypeClick = function(type) {
					$scope.moduleData.uiData.keywordType = type;

					if ($scope.moduleData.uiData.keywordType == 'lotte') {
						$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_DCSearch_Tab');
					} else {
						$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_NASearch_Tab');
					}
				};

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabName, subIdx) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";
					var tabNm = tabName ? tabName : "";

					if (idx != "-") {
						index = (subIdx) ? "검색어_" +  ((idx == "더보기") ?  LotteUtil.setDigit(subIdx) + "_더보기" : LotteUtil.setDigit(idx) + "_상품_" + LotteUtil.setDigit(subIdx)) : (tabName == ("최근3시간베스트") ? "상품_" :"검색어_") + LotteUtil.setDigit(idx);
					}

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule(tabNm + "|실시간베스트", index, label);
				};
			}
		}
	}]);

	app.filter('makePositive', function(){
		return function (num) {
			return Math.abs(num);
		}
	});
})(window, window.angular);