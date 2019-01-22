(function(window, angular, undefined) {
	'use strict';

	var slideModule = angular.module('lotteSlider', []);

	slideModule.controller('LotteSlideCtrl', ["$scope", function ($scope) {
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
	}]);

	slideModule.directive('lotteSlider', ['$window', '$timeout', '$parse', function ($window, $timeout, $parse) {
		return {
			controller: "LotteSlideCtrl",
			link: function ($scope, el, attrs, ctrl) {
				var $wrapper = angular.element(el),
					$cont = $wrapper.find(">").eq(0),
					wrapperWidth = $wrapper.width(),
					contWidth = $cont.width(),
					slideFlag = false,
					startPos = 0,
					startCoords = null,
					movCoords = null,
					endCoords = null,
					startTime = 0,
					endTime = 0,
					durateTime = 0,
					direct = 0, // direct가  - 면 좌측, + 면 우측
					maxPos = 0;

				$scope.lotteSliderMoveXPos = function (posX, animateTime) {
					wrapperWidth = $wrapper.width();
					contWidth = $cont.width();

					if (posX > 0) {
						posX = 0;
					} else if (Math.abs(posX) > contWidth - wrapperWidth) {
						posX = -(contWidth - wrapperWidth);
					}

					if (!animateTime) {
						animateTime = 0;
					}

					setContPosX(posX, animateTime);
				};
				
				/**
				 * 동적으로 변경되었을 때 강제로 갱신
				 */
				$scope.reset = function(){
					slideFlag = false;
					setContPosX(0, 0);
					$timeout(function () {
						init();
					});
				}

				function init() { // 초기화
					wrapperWidth = $wrapper.outerWidth();
					
					$cont.css({
						display: "inline-block"
					});

					contWidth = $cont.outerWidth();
					maxPos = -(contWidth - wrapperWidth);

					var coords = $scope.getTransXPos;

					if (coords.x > 0 || coords.x < maxPos) {
						setContPosX(0, 500);
					}
				}

				function setContPosX(posX, time) {
					$cont.css($scope.getTranslateXCssObj(posX, time));

					$wrapper.trigger({
						type: "slide",
						posX: posX,
						wrapWidth: wrapperWidth,
						contWidth: contWidth
					});
				}

				var dragDirChkFlag = false; // drag 방향을 체크 했는지 여부
				var dirXFlag = false; // drag 방향이 세로인지 가로인지 확인

				function setEvent() { // Event Bindding
					$wrapper.on({
						"touchstart.lotteSlider": function (e) {
							wrapperWidth = $wrapper.outerWidth();
							contWidth = $cont.outerWidth();

							dragDirChkFlag = false;
							dirXFlag = false;

							if (wrapperWidth < contWidth) {
								e.stopPropagation();
								slideFlag = true;

								startCoords = $scope.getCoordinates(e);
								startPos = $scope.getTransXPos($cont);

								startTime = Date.now();
							}
						},
						"touchmove.lotteSlider": function (e) {
							if (slideFlag) {
								var deltaX, deltaY;
								movCoords = $scope.getCoordinates(e);

								deltaX = Math.abs(movCoords.x - startCoords.x);
								deltaY = Math.abs(movCoords.y - startCoords.y);

								if (!dragDirChkFlag) { // 가로 세로 스크롤 여부 판단 했는지 확인
									dirXFlag = deltaX > deltaY; // 가로 스크롤인지 세로 스크롤인지 확인
									dragDirChkFlag = true;
								}

								if (dirXFlag) {
									if (deltaX > 5) {
										e.preventDefault(); // 이벤트 하위로 전파 방지
									}

									e.stopPropagation();

									var pos = startPos + movCoords.x - startCoords.x;

									if (pos > 0) {
										pos = pos / 3;
									} else if (pos < maxPos) {
										pos = maxPos + (pos - maxPos) / 3;
									}

									setContPosX(pos, 0);
								}
							}
						},
						"touchend.lotteSlider": function (e) {
							endCoords = $scope.getCoordinates(e);

							if (slideFlag && startCoords.x != endCoords.x) {
								if (Math.abs(startCoords.x - endCoords.x) > 5) {
									e.preventDefault(); // 이벤트 하위로 전파 방지
								}

								event.stopPropagation(); // 이벤트 하위로 전파 방지

								dragDirChkFlag = false;

								if (dirXFlag) { // iOS 스크롤시 스와이프 방어
									wrapperWidth = $wrapper.outerWidth();

									var nowPos = $scope.getTransXPos($cont); // 현재 위치
									endTime = Date.now();

									direct = startCoords.x  > endCoords.x ? -1 : 1; // 움직인 방향
									durateTime = endTime - startTime; // 이동 시간

									var moveArrange = Math.abs(startCoords.x - endCoords.x); // 이동 거리
									var sensitive = .4;
									var moveRate = (moveArrange * sensitive) / durateTime; // 이동거리를 시간으로 나눔 (움직임 비율)
									var pos = nowPos + (wrapperWidth * moveRate * direct);

									if (pos > 0) {
										pos = 0;
									} else if (pos < maxPos) {
										pos = maxPos;
									}

									if (Math.abs(nowPos - pos) > 30 || pos == 0 || pos == maxPos) {
										setContPosX(pos, 500);
									}
								}
							}
						},
						"touchcancel.lotteSlider": function (e) {
						}
					});

					angular.element($window).on("resize.lotteSlider orientationchange.lotteSlider", function () {
						init();
					});
				}

				function removeEvent() {
					$wrapper.off(".lotteSlider");
				}

				$timeout(function () {
					init();
					setEvent();
				});
			}
		};
	}]);

})(window, window.angular);