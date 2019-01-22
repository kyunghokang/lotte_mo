// M54 5+6형..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2054Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2054.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.unitShow = true;

				/**
				 * UI 데이터 저장
				 */
				if (!$scope.moduleData.uiData) {
					$scope.moduleData.uiData = {
						tabIdx : parseInt($scope.moduleData.items.length * Math.random()),	// 탭 인덱스
						pageDispNo: attrs.pageDispNo
					}
				}

				/**
				 * DOM 로딩이 다 안되어 슬라이드 포커스 안가는 문제 때문에 timeout 줌
				 */
				$timeout(function() {
					$scope.setSliderIdxPos($scope.moduleData.uiData.tabIdx, true);
				}, 100);

				// 유닛 숨김 처리
				var disableTabCnt = 0;

				for (var i = 0; i < $scope.moduleData.items.length; i++) {
					var prdList = $scope.moduleData.items[i].prdList;

					if (prdList.items.length < 3) { // 탭중 상품이 3개보다 적으면 disableTab으로 판단
						disableTabCnt++;
					}
				}

				if(disableTabCnt >= 2){
					$scope.unitShow = false;
				}

				// 탭 클릭
				$scope.tabClick = function (e, index) {
					$scope.moduleData.uiData.tabIdx = index;
					$scope.rScope.sendTclick($scope.moduleData.tclick + '_Swp_Btn'+ $scope.numberFill((index + 1), 2));
					$scope.setSliderIdxPos($scope.moduleData.uiData.tabIdx, false); // 200 animateTime
				};

				// slider를 현재 선택된 Idx 위치로 이동함
				$scope.setSliderIdxPos = function(sliderIdx, disableAnimation) {
					// $scope.setHeaderMenuIdxPos = function (dispNo, disableAnimation) {
					$timeout(function () { // timeout을 주지 않으면 DOM 렌더링이 끝나지 않아 탭의 넓이 계산에서 오류가 나 제대로 찾아가지 못한다.
						var slider = el.find('div[lotte-slider]'),
							listWrap = slider.find('>ul'),
							list = listWrap.find('>li'),
							target = list.eq(sliderIdx),
							targetPosX = 0,
							animateTime = disableAnimation ? 0 : 200;

						if (slider.length > 0 && listWrap.length > 0 && target.length > 0 && slider.width() < listWrap.width()) {
							targetPosX = (slider.width() / 2) + listWrap.offset().left - (target.offset().left + (target.outerWidth() / 2));

							slider.scope().lotteSliderMoveXPos(targetPosX, animateTime);
						}

					}, 300);
				};

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, subIdx) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";
					if (idx != "-") {
						index = (!subIdx) ? "탭_" +  LotteUtil.setDigit(idx) : "탭_" + LotteUtil.setDigit(idx) + "_상품_" + LotteUtil.setDigit(subIdx) ;
					}

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);
})(window, window.angular);