(function (window, angular, undefined) {
	'use strict';

	var resSwipeModule = angular.module('lotteResponSwipe', []);

	// Swipe Controller
	resSwipeModule.controller('LotteResponSwipeCtrl', ['$scope', function ($scope) {
		var CSS_TRANSITION_END_EVENT = "transitionend.ngswipe webkitTransitionEnd.ngswipe oTransitionEnd.ngswipe MSTransitionEnd.ngswipe";

		/**
		* @ngdoc function
		* @name lotteNgSwipe.getTranslateXCssObj
		* @description
		* translateX로 이동되는 CSS Style Object 생성
		* @example
		* getTranslateXCssObj(pos, transition_millisec)
		* @param {Number} pos 목표지점 포지션
		* @param {Number} transition_millisec 이동 시간 ms
		*/
		$scope.getTranslateXCssObj = function (pos, transition_millisec) {
			var translateCSSObj = {
				"-webkit-backface-visibility": "hidden",
				"-moz-backface-visibility": "hidden",
				"backface-visibility": "hidden", // transform으로 변경되는 요소의 뒷면을 감춰 성능을 올린다.

				"-webkit-transform": "translateX(" + pos + "px)",
				"-ms-transform": "translateX(" + pos + "px)",
				"-moz-transform": "translateX(" + pos + "px)",
				"transform": "translateX(" + pos + "px)",

				"-webkit-transition": "",
				"-moz-transition": "",
				"-o-transition": "",
				"transition": ""
			};

			if (transition_millisec && transition_millisec > 0) {
				translateCSSObj["-webkit-transition"] = "-webkit-transform " + transition_millisec + "ms";
				translateCSSObj["-moz-transition"] = "-moz-transform " + transition_millisec + "ms";
				translateCSSObj["-o-transition"] = "-o-transform " + transition_millisec + "ms";
				translateCSSObj["transition"] = "transform " + transition_millisec + "ms";
			}

			return translateCSSObj;
		};

		/**
		* @ngdoc function
		* @name lotteNgSwipe.removeTranslateCSS
		* @description
		* transform 속성을 삭제한다.
		* @example
		* removeTranslateCSS()
		*/
		$scope.removeTranslateCSS = function () {
			return {
				"-webkit-backface-visibility": "",
				"-moz-backface-visibility": "",
				"backface-visibility": "",
				"-webkit-transform": "",
				"-ms-transform": "",
				"-moz-transform": "",
				"transform": ""
			};
		};

		/**
		* @ngdoc function
		* @name lotteNgSwipe.getCoordinates
		* @description
		* 터치 좌표 반환
		* @example
		* getCoordinates(event)
		* @param {Object} event javascript event 이벤트 오브젝트
		* @returns {object} e 좌표 오브젝트
		* {Number} e.clientX X좌표
		* {Number} e.clientY Y좌표
		*/
		$scope.getCoordinates = function (event) {
			var touches = event.touches && event.touches.length ? event.touches : [event],
				e = (event.changedTouches && event.changedTouches[0]) ||
				(event.originalEvent && event.originalEvent.changedTouches &&
				event.originalEvent.changedTouches[0]) ||
				touches[0].originalEvent || touches[0];

			return {
				x: e.clientX,
				y: e.clientY
			};
		};

		/**
		* @ngdoc function
		* @name lotteNgSwipe.getTransXPos
		* @description
		* 엘리먼트의 트렌젝션 X좌표 구하기
		* @example
		* getTransXPos(element)
		* @param {Object} element 스와이프 영역 엘리먼트
		*/
		$scope.getTransXPos = function (element) {
			var style = window.getComputedStyle(element.get(0)); // Need the DOM object
			var matrix = new WebKitCSSMatrix(style.webkitTransform);
			return matrix.m41;
		};

		/**
		* @ngdoc function
		* @name lotteNgSwipe.positionReCalc
		* @description
		* 엘리먼트의 위치값 셋팅하기
		* @example
		* positionReCalc(nowIdx, element, startIdx)
		* @param {number} 현재 idx
		* @param {Object} element 스와이프 영역 엘리먼트
		* @param {number} 시작 idx
		*/
		$scope.positionReCalc = function (nowIdx, element, startIdx) {
			console.log('for check');
			var $list = element.find('> ul, > ol').find('li');
			var lastIdx = 0; // 이전 idx
			var nextIdx = 0; // 다음 idx
			var listLength = $list.length;
			var winWidth = element[0].offsetWidth;

			beforeIdx(nowIdx, listLength);
			afterIdx(nowIdx, listLength);

			function beforeIdx (idx, listLength) { // 현재 활성화된 idx 기준으로 이전 idx 값 계산
				if (idx != 0) { // 현재 활성화 된 idx가 0이 아닐 경우
					lastIdx = idx - 1;
				}else if (idx == 0) { // 현재 활성화 된 idx가 0일 경우
					lastIdx = listLength - 1;
				};
				return lastIdx;
			};
			function afterIdx (idx, listLength) { // 현재 활성화된 idx 기준으로 다음 idx 값 계산
				if (idx != listLength - 1) { // 현재 활성화 된 idx가 마지막 리스트 idx가 아닐 경우
					nextIdx = idx + 1;
				}else { // 현재 활성화 된 idx가 마지막 리스트 idx일 경우
					nextIdx = 0;
				};
				return nextIdx;
			};

			var i = 0,
				el = null,
				left = 0;
			
			for (i; i < listLength; i++) {
				el = $list.eq(i);

				if (i == lastIdx) {
					left = -100 + '%';
				} else {
					left = 100 * i + '%';
				}

				el.css({
					width: winWidth,
					backfaceVisibility: "hidden",
					position: "absolute",
					left: left
				});
			}
		};


		/**
         * @ngdoc function
         * @name lotteNgSwipe.getTransitionCSSObj
         * @description
         * transition cross browsing
         * @example
         * getTransitionCSSObj()
         */
		$scope.getTransitionCSSObj = function (prop) {
			if (!prop) {
				prop = "";
			}

			return {
				"-webkit-transition": prop,
				"-moz-transition": prop,
				"-o-transition": prop,
				"transition": prop
			}
		}


		/**
         * @ngdoc function
         * @name lotteNgSwipe.moveSwipe
         * @description
         * 스와이프 이동
         * @example
         * moveSwipe(el, startX, moveToX, nowIdx)
         * @param {Object} el 스와이프 영역 엘리먼트
         * @param {Number} startX 시작점 X좌표
         * @param {Number} moveToX 목적지 X좌표 
         * @param {Number} 선택된 idx 
         */
		$scope.moveSwipeX = function(element, startX, moveToX, nowIdx) {
			/*if (startX < 0) {
				nowIdx = (nowIdx + opt.DISP_COUNT) > opt.MAX_SLIDE ? opt.MAX_SLIDE:nowIdx + opt.DISP_COUNT;
			} else {
				nowIdx = nowIdx - opt.DISP_COUNT;
			}*/
			console.info(startX);

			angular.element(element).on(CSS_TRANSITION_END_EVENT, function (event) {
				//$scope.positionReCalc(nowIdx,element,0);
				angular.element(this).css($scope.getTransitionCSSObj()).off(CSS_TRANSITION_END_EVENT); // transition이 완료 되면 transition을 삭제해야 다음 스와이프에 영향이 없다
			}).css($scope.getTranslateXCssObj(startX >= 0 ? moveToX : -moveToX, 500));//opt.SWIPE_SPEED));
			$scope.nowIdxset(nowIdx);
			return nowIdx;
		}
	}]);

	// Swipe Directive
	resSwipeModule.directive('lotteResponSwipe', ['$timeout', function ($timeout) {

		return {
			controller: "LotteResponSwipeCtrl",
			link: function ($scope, el, attrs, ctrl) {
				var $wrapper = angular.element(el),
					$listWrapper = angular.element(el).find(attrs.wrapperClass),
					$list = angular.element(el).find(attrs.listClass),
					startCoords = null, // 시작점 좌표
					startPos = null, // 움직임 시작점 좌표
					movCoords = null, // 움직임 좌표
					endCoords = null, // 움직임 끝나는 지점 좌표
					swipeFlag = false, // 스와이프 작동/미작동 플래그
					dragXYChk = false,
					nowIdx = 0; // 드래그 방향이 체크(x,y 좌표값 비교하여 x축으로 많이 이동하여 스와이프 작동필요시 true, 반대일 경우 false)

				function init() { // Wrapper, list css 초기화
					$scope.positionReCalc(0, angular.element(el));
					$list = angular.element(el).find(attrs.listClass);
				}

				$scope.nowIdxset = function(setIdx) {
					nowIdx = setIdx;
				};

				function addEvent() { // Event Binding
					angular.element(el).on({
						"touchstart": function (e) {
							console.log("touchstart");

							if ($list.length > 1) {
								e.stopPropagation();
								swipeFlag = true;
								startCoords = $scope.getCoordinates(e); // 터치좌표 반환
								startPos = $scope.getTransXPos($listWrapper);
							};
						},
						"touchmove": function (e) {
							console.log("touchmove");
							if (swipeFlag) {
								var deltaX, deltaY;

								movCoords = $scope.getCoordinates(e);
								deltaX = Math.abs(movCoords.x - startCoords.x);
								deltaY = Math.abs(movCoords.y - startCoords.y);
								
								dragXYChk = deltaX > deltaY; // 가로 스크롤인지 세로 스크롤인지 확인


								if (dragXYChk) {
									var pos = startPos + movCoords.x - startCoords.x;										
								};							
							};

							$listWrapper.css($scope.getTranslateXCssObj(pos, 0));
						},
						"touchend": function (e) {

							if (dragXYChk) {
								if (startCoords.x >= movCoords.x) { // 우에서 좌로 스와이프시 다음 항목
									nowIdx = nowIdx += 1;
									console.log('next call' + nowIdx);
									$scope.moveSwipeX($listWrapper, -1, el[0].offsetWidth, nowIdx); //element, startX, moveToX, nowIdx
								}else if (startCoords.x <= movCoords.x) { // 좌에서 우로 스와이프시 이전 항목
									nowIdx = nowIdx -= 1;
									console.log('prev call' + nowIdx);
									$scope.moveSwipeX($listWrapper, 1, el[0].offsetWidth, nowIdx); //element, startX, moveToX, nowIdx
								};
							};
							console.log("touchend");
						}
					});
				}

				$timeout(function () {
					init();
					addEvent();
				});

			}
		};
	}]);

})(window, window.angular);