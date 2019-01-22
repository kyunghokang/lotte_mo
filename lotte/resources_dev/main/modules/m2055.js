// M55 N+4형..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2055Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2055.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);

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

				// 탭 클릭
				$scope.tabClick = function (e, index) {
					$scope.moduleData.uiData.tabIdx = index;
					$scope.rScope.sendTclick($scope.moduleData.tclick + '_Swp_idx'+ $scope.numberFill((index+1),2));
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
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabNm, subIdx) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";

					if (idx != "-") {
						index =(subIdx) ? "탭_" + tabNm + "_상품_" + LotteUtil.setDigit(subIdx) : "탭_" + tabNm +"_"+ LotteUtil.setDigit(idx);
					}
					
					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);
})(window, window.angular);