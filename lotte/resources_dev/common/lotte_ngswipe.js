var isSwipeActive = false;
var isSwipeLock = false;
var isLoadingData = false;
var LeftSwipeStartExec = false;
var RightSwipeStartExec = false;

(function(window, angular, undefined) {
	'use strict';
	
	/**
     * @ngdoc overview
     * @name lotteNgSwipe
     * @description 
     * lotte_ngswipe.js<br/>
     * 스와이프 공통 모듈
     */
	var swipeQueue = [];
	var loadOnOrientationChange = false;
	var lotteNgSwipe = angular.module('lotteNgSwipe', []);
	/**
     * @ngdoc object
     * @name lotteNgSwipe.controller:lotteNgSwipeCtrl
     * @description
     * 스와이프 컨트롤러 
     */
	lotteNgSwipe.controller('lotteNgSwipeCtrl', ['$scope', function ($scope) {}]);
	/**
     * @ngdoc object
     * @name lotteNgSwipe.factory:lotteNgSwipe
     * @description
     * 스와이프 팩토리
     */
	lotteNgSwipe.factory('lotteNgSwipe', ['$interval', '$timeout', '$window', function ($interval, $timeout, $window) {
		var windowBind = null;
		
		var diff = 0;
		
		var swipeLen = 0;

		var CSS_TRANSITION_END_EVENT = "transitionend.ngswipe webkitTransitionEnd.ngswipe oTransitionEnd.ngswipe MSTransitionEnd.ngswipe";
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
		function getCoordinates(event) {
			var touches = event.touches && event.touches.length ? event.touches : [event];
			var e = (event.changedTouches && event.changedTouches[0]) ||
				(event.originalEvent && event.originalEvent.changedTouches &&
				event.originalEvent.changedTouches[0]) ||
				touches[0].originalEvent || touches[0];

			return {
				x: e.clientX,
				y: e.clientY
			};
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.positionReCalc
         * @description
         * 스와이프 엘리먼트 좌표 계산
         * @example
         * positionReCalc(nowIdx, element, opt)
         * @param {int} nowIdx 현제 인덱스
         * @param {Object} element 스와이프 영역 엘리먼트
         * @param {Object} opt 옵션
         */
		function positionReCalc(nowIdx, element, opt) {
			if (opt.SLIDE_SWIPE) {
				var wWidth = element[0].offsetWidth-opt.LEFT_MARGIN-opt.RIGHT_MARGIN;

				if (wWidth == 0) {
				  wWidth = window.innerWidth;
				}

				var itemWidth = wWidth / opt.DISP_COUNT;
				var left = 0;
				var startPos = 0;

				diff = element[0].offsetWidth - itemWidth - opt.LEFT_MARGIN;

				if ((element.find("ul, ol").eq(0).find('>li').length >= 1 || element.find('>li').length >= 1) && !opt.LOADING_ELEMENT && !opt.LEFT_ELEMENT && !opt.RIGHT_ELEMENT) {
					if (element.context.className.indexOf('recommond_swipe') != -1) { // li안에 li있는 경우 분기처리 제외함(이거어때탭 포지션 문제로 인함)
						var swipeEl = element.find('>li');
					} else {
						var swipeEl = element.find("ul, ol").eq(0).find('>li').length > 1 ? element.find("ul, ol").eq(0).find('>li') : element.find('>li');
					}
						var i = nowIdx,
							j = 0,
							el = null;

					for (i, j; j < swipeEl.length; i++, j++) {
						el = swipeEl.eq(i);

						if (j <= i || i < 0) { // start 상품이 0이 아닐 경우 이전 상품 idx가 마이너스값 예외 추가

							if (i < 0) { // start 상품이 0이 아닐 경우 이전 상품 idx가 마이너스값 예외 추가
								left = itemWidth*element.find('>li').length + opt.LEFT_MARGIN + ( opt.EDGE_LAST && nowIdx == swipeEl.length - 1 ? diff : 0 );
							}else{
								left = itemWidth*j + opt.LEFT_MARGIN + ( opt.EDGE_LAST && nowIdx == swipeEl.length - 1 ? diff : 0 );
							}
						} else {
							left = itemWidth*-(nowIdx-i) + opt.LEFT_MARGIN + ( opt.EDGE_LAST && nowIdx == swipeEl.length - 1 ? diff : 0 );
						}
						if (element.context.className.indexOf('latest_swipe') != -1 && window.innerWidth >= 640) { // pad일 경우 50%로 분할이 되어있는 경우 제외 처리
				  			wWidth = window.innerWidth;
							el.css({
								width: wWidth/2,
								backfaceVisibility: "hidden",
								position: "absolute",
								left: left
							});
						}else{
							el.css({
								width: wWidth/opt.DISP_COUNT,
								backfaceVisibility: "hidden",
								position: "absolute",
								left: left
							});
						}

						if (i+1 >= element.find('>li').length) {
							i = -1;
						}
					}
					swipeLen = swipeEl.length;
					//element[0].style.webkitTransform = "translateX(" + 0 + "px)";
					angular.element(element).eq(0).css(getTranslateXCssObj(0));
					angular.element(element).find(">li").css("top", 0).eq(0).css("position", "relative");
				} else {
					//element[0].style.webkitTransform = "";
					if(!opt.LOADING_ELEMENT) {
						angular.element(element).eq(0).css(removeTranslateCSS());
					}
				}
			}
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.getListInfo
         * @description
         * 리스트 스와이프 엘리먼트 정보 
         * @example
         * getListInfo(element)
         * @param {int} nowIdx 현제 인덱스
         * @param {Object} element 스와이프 영역 엘리먼트
         * @param {Object} opt 옵션
         * @returns {Object} info 스와이프 엘리먼트 인포
         */
		function getListInfo(element) {
			var info = {totalwidth:0,width:[], paddingleft:[], marginleft:[], paddingright:[], marginright:[]};

			for(var i=0;i < element.find('>li').length;i++) {
				var el = element.find('>li:eq('+i+')');
				info.width[i] = parseInt(el.width());
				info.width[i] += info.marginleft[i] = parseInt(el.css("margin-left"));
				info.width[i] += info.marginright[i] = parseInt(el.css("margin-right"));
				info.width[i] += info.paddingleft[i] = parseInt(el.css("padding-left"));
				info.width[i] += info.paddingright[i] = parseInt(el.css("padding-right"));
				info.totalwidth += info.width[i];
			}

			//console.log("메뉴 최대폭 : "+info.totalwidth);
			return info;
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.getTransXPos
         * @description
         * 엘리먼트의 트렌젝션 X좌표 구하기
         * @example
         * getTransXPos(element)
         * @param {Object} element 스와이프 영역 엘리먼트
         */
		function getTransXPos(element) {
			var style = window.getComputedStyle(element.get(0)); // Need the DOM object
			var matrix = new WebKitCSSMatrix(style.webkitTransform);
			return matrix.m41;
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.resetSwipe
         * @description
         * 스와이프 원래 위치로 복원
         * @example
         * resetSwipe(el, opt, startCoords, lastPos)
         * @param {Object} el 스와이프 영역 엘리먼트
         * @param {Object} opt 옵션
         * @param {Number} startCoords 시작점 X 좌표
         * @param {Number} lastPos 목적지 X 좌표
         */
		function resetSwipe(el, opt, startCoords, lastPos) {
			isSwipeActive = true;
			angular.element(el).on(CSS_TRANSITION_END_EVENT, function (event) {
				isSwipeActive = false;

				if (opt.LOADING_ELEMENT) {
					angular.element(opt.LOADING_ELEMENT).css(getTransitionCSSObj());
				}

				angular.element(this).css(getTransitionCSSObj()).off(CSS_TRANSITION_END_EVENT); // transition이 완료 되면 transition을 삭제해야 다음 스와이프에 영향이 없다
			}).css(getTranslateXCssObj(0, opt.SWIPE_SPEED));

			if (opt.LOADING_ELEMENT || opt.LEFT_ELEMENT || opt.LEFT_ELEMENT) {
				angular.element(opt.LOADING_ELEMENT).css(getTranslateXCssObj(0, opt.SWIPE_SPEED));
			}
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.moveMenuSwipe
         * @description
         * 메뉴 스와이프 이동
         * @example
         * moveMenuSwipe(element,options,idx, directMoveFlag)
         * @param {Object} element 스와이프 영역 엘리먼트
         * @param {Object} options 옵션
         * @param {Number} idx 이동할 메뉴 인덱스
         * @param {Boolean} directMoveFlag 에니메이션 효과 true/false
         */
		function moveMenuSwipe(element,options,idx, directMoveFlag) {
			var elInfo = getListInfo(element);
			if (window.innerWidth-options.LEFT_MARGIN-options.RIGHT_MARGIN > elInfo.totalwidth) {
				return false;
			}

			var screenHalf = window.innerWidth / 2;
			var targetHalf = elInfo.width[idx]/2;
			var moveX = 0;

			for (var i = 0; i < elInfo.width.length; i++) {
				if (i == idx) {
				  break;
				}

				moveX += elInfo.width[i];
			}

			var startTransX = getTransXPos(element);
			var moveTo = ((moveX - screenHalf) + targetHalf) * -1;

			if (directMoveFlag) {
				if (moveTo > 0) {
					moveTo = 0;
				} else if (moveTo < -(elInfo.totalwidth - window.innerWidth + options.RIGHT_MARGIN)) {
					moveTo = -(elInfo.totalwidth - window.innerWidth + options.RIGHT_MARGIN);
				}

				//element[0].style.webkitTransform = "translateX(" + moveTo + "px)";
				angular.element(element).eq(0).css(getTranslateXCssObj(moveTo));
			} else {
				if (Math.abs(moveX) > screenHalf && elInfo.totalwidth-window.innerWidth+options.RIGHT_MARGIN > Math.abs(moveTo)) {
					moveMenu(element[0],options,startTransX,moveTo);
				} else {
					if (Math.abs(moveX) <= screenHalf) {
						moveMenu(element[0],options,startTransX,0);
					} else {
						moveMenu(element[0],options,startTransX,(elInfo.totalwidth-window.innerWidth)*-1-options.RIGHT_MARGIN);
					}
				}
			}
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.moveMenu
         * @description
         * 메뉴 이동 moveMenuSwipe 에서 호출
         * @example
         * moveMenu(el, opt, startX, moveToX)
         * @param {Object} el 스와이프 영역 엘리먼트
         * @param {Object} opt 옵션
         * @param {Number} startX 시작점 X좌표
         * @param {Number} moveToX 목적지 X좌표 
         */
		function moveMenu(el, opt, startX, moveToX) {
			if (startX == moveToX) {
				return true;
			}

			angular.element(el).on(CSS_TRANSITION_END_EVENT, function (event) {
				if (opt.LOADING_ELEMENT) {
					angular.element(opt.LOADING_ELEMENT).css(getTransitionCSSObj());
				}

				angular.element(this).css(getTransitionCSSObj()).off(CSS_TRANSITION_END_EVENT); // transition이 완료 되면 transition을 삭제해야 다음 스와이프에 영향이 없다
			}).css(getTranslateXCssObj(moveToX, opt.SWIPE_SPEED));

			if (opt.LOADING_ELEMENT) {
				angular.element(opt.LOADING_ELEMENT).css(getTranslateXCssObj(moveToX, opt.SWIPE_SPEED));
			}
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.moveSwipe
         * @description
         * 스와이프 이동
         * @example
         * moveSwipe(el, opt, startX, moveToX)
         * @param {Object} el 스와이프 영역 엘리먼트
         * @param {Object} opt 옵션
         * @param {Number} startX 시작점 X좌표
         * @param {Number} moveToX 목적지 X좌표 
         */
		function moveSwipe(el, opt, startX, moveToX) {
			isSwipeActive = true;
			angular.element(el).on(CSS_TRANSITION_END_EVENT, function (event) {
				isSwipeActive = false;
				

				if (opt.LOADING_ELEMENT) {
					angular.element(opt.LOADING_ELEMENT).css(getTransitionCSSObj());
				}

				angular.element(this).css(getTransitionCSSObj()).off(CSS_TRANSITION_END_EVENT); // transition이 완료 되면 transition을 삭제해야 다음 스와이프에 영향이 없다
			}).css(getTranslateXCssObj(startX >= 0 ? moveToX : -moveToX, opt.SWIPE_SPEED));
			
			if (opt.LOADING_ELEMENT) {
				angular.element(opt.LOADING_ELEMENT).css(getTranslateXCssObj(startX >= 0 ? moveToX : -moveToX, opt.SWIPE_SPEED));
			}
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.moveSwipe
         * @description
         * 스와이프 이동
         * @example
         * moveSwipe(el, opt, startX, moveToX, nowIdx)
         * @param {Object} el 스와이프 영역 엘리먼트
         * @param {Object} opt 옵션
         * @param {Number} startX 시작점 X좌표
         * @param {Number} moveToX 목적지 X좌표 
         * @param {Number} nowIdx 현제 스와이프 인덱스
         */
		function moveSwipeX(element, opt, startX, moveToX, nowIdx) {
			if (startX < 0) {
				nowIdx = (nowIdx + opt.DISP_COUNT) > opt.MAX_SLIDE ? opt.MAX_SLIDE:nowIdx + opt.DISP_COUNT;
			} else {
				nowIdx = nowIdx - opt.DISP_COUNT;
			}

			if(opt.EDGE_LAST && (nowIdx == swipeLen - 1 || ( nowIdx == swipeLen - 2 && startX > 0 )))	moveToX -= diff;
			
			angular.element(element).on(CSS_TRANSITION_END_EVENT, function (event) {
				if (opt.LOADING_ELEMENT) {
					angular.element(opt.LOADING_ELEMENT).css(getTransitionCSSObj());
				}

				positionReCalc(nowIdx,element,opt);
				angular.element(this).css(getTransitionCSSObj()).off(CSS_TRANSITION_END_EVENT); // transition이 완료 되면 transition을 삭제해야 다음 스와이프에 영향이 없다
			}).css(getTranslateXCssObj(startX >= 0 ? moveToX : -moveToX, opt.SWIPE_SPEED));

			if (opt.LOADING_ELEMENT) {
				angular.element(opt.LOADING_ELEMENT).css(getTranslateXCssObj(startX >= 0 ? moveToX : -moveToX, opt.SWIPE_SPEED));
			}

			return nowIdx;
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.menuOverCheck
         * @description
         * 메뉴 좌우로 범위를 넘어가는값 체크
         * @example
         * menuOverCheck(element, opt, elInfo)
         * @param {Object} element 스와이프 영역 엘리먼트
         * @param {Object} opt 옵션
         * @param {Object} elInfo 스와이프 엘리먼트 정보
         */
		function menuOverCheck(element, opt, elInfo) {
			var startTransX = getTransXPos(element);

			if (startTransX > 0) {
				moveSwipe(element[0],opt,startTransX,0);
				startTransX = 0;
			} else if (Math.abs(startTransX)+window.innerWidth > Math.abs(elInfo.totalwidth)+opt.RIGHT_MARGIN) {
				moveSwipe(element[0],opt,startTransX,elInfo.totalwidth-window.innerWidth+opt.RIGHT_MARGIN);
				startTransX = -1*(elInfo.totalwidth-window.innerWidth);
			}

			return startTransX;
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.getTranslateXCssObj
         * @description
         * translateX로 이동되는 CSS Style Object 생성
         * @example
         * getTranslateXCssObj(pos, transition_millisec)
         * @param {Number} pos 시작점 포지션
         * @param {Number} transition_millisec 이동 시간 ms
         */
		function getTranslateXCssObj(pos, transition_millisec) {
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
		}
		/**
         * @ngdoc function
         * @name lotteNgSwipe.removeTranslateCSS
         * @description
         * transform 속성을 삭제한다.
         * @example
         * removeTranslateCSS()
         */
		function removeTranslateCSS() {
			return {
				"-webkit-backface-visibility": "",
				"-moz-backface-visibility": "",
				"backface-visibility": "",
				"-webkit-transform": "",
				"-ms-transform": "",
				"-moz-transform": "",
				"transform": ""
			};
		}

		/**
         * @ngdoc function
         * @name lotteNgSwipe.getTransitionCSSObj
         * @description
         * transition cross browsing
         * @example
         * getTransitionCSSObj()
         */
		function getTransitionCSSObj(prop) {
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

		/* Galaxy Note II 오류 디버깅용
		var consoleIdx = 0;

		function consoleGalaxyNoteII(text) {
			try {
				angular.element("#Note2Debug").prepend(++consoleIdx+ ". " + text + "<br>");
			} catch (e) {}
		}
		*/
		
		return {
			unbind: function(element) {
				element.off('touchstart.ngswipe mousedown.ngswipe touchcancel.ngswipe touchmove.ngswipe mousemove.ngswipe touchend.ngswipe mouseup.ngswipe');
				//angular.element(window).off('resize.ngswipe orientationchange.ngswipe');
			},
			bind: function(element, opt, eventHandlers) {
				var el = element[0];
				var totalX, totalY;
				var startCoords;
				var lastPos;
				var active = false;
				var checkPropagation = false;
				var nowPos = 0;
				var nowIdx = opt.FIRST_INDEX;
				var scope = angular.element(element).scope();
				var dragDirChkFlag = false; // drag 방향을 체크 했는지 여부
				var dirXFlag = false; // drag 방향이 세로인지 가로인지 확인
				var elInfo = [];
				var startTransX = 0;
				var startTime = 0;
				var endTime = 0;
				var swipeUsing = true;
				var original_dispcount = opt.DISP_COUNT;
				var isIOSFlag = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
				var iOsSwipeEnableFlag = true;
				var iOsSwipeEnableScrollRange = 30;
				var iOsSwipeEnableScrollPos = angular.element($window).scrollTop();
				
				if (opt.SLIDE_MENU_SWIPE) {
					angular.element(el).css(getTranslateXCssObj(0));
				}
					
				element.on('touchstart.ngswipe mousedown.ngswipe', function (event) {
					event.stopPropagation(); // 이벤트 하위로 전파 방지
					//consoleGalaxyNoteII("touchstart"); //Galaxy Note II 오류 디버깅용

					/* iPhone APP 스크롤시 스와이프되는 현상 방어 */
					if (isIOSFlag) {
						var scrollTopPos = angular.element($window).scrollTop();

						if (iOsSwipeEnableScrollPos < scrollTopPos + iOsSwipeEnableScrollRange &&
							iOsSwipeEnableScrollPos > scrollTopPos - iOsSwipeEnableScrollRange) {
							iOsSwipeEnableFlag = true;
						} else {
							iOsSwipeEnableFlag = false;
							iOsSwipeEnableScrollPos = scrollTopPos;
						}
					}

					dragDirChkFlag = false;
					dirXFlag = false;

					if (opt.SLIDE_MENU_SWIPE) {
						  elInfo = getListInfo(element);
						  if (window.innerWidth - opt.LEFT_MARGIN-opt.RIGHT_MARGIN > elInfo.totalwidth) {
							  swipeUsing = false;
						  } else {
							  swipeUsing = true;
						  }
					}
					
					if(isSwipeLock) {
						return ;
					}

					if (!swipeUsing) {
						return ;
					}
					
					if (window.innerWidth >= 900 && opt.RESPONSIVE_SWIPE) {
						opt.DISP_COUNT = opt.RESPONSIVE_SWIPE_900;
					} else if(window.innerWidth >= 640 && opt.RESPONSIVE_SWIPE) {
						opt.DISP_COUNT = opt.RESPONSIVE_SWIPE_640;
					} else if(opt.RESPONSIVE_SWIPE) {
						opt.DISP_COUNT = opt.RESPONSIVE_SWIPE_320;
					}
					
					opt.MAX_SLIDE = element.find('>li').length-1;
					
					// 스와이프 한개 일때 작동 안시킴
					if (opt.MAX_SLIDE < 1 && !opt.LOADING_ELEMENT && !opt.LEFT_ELEMENT && !opt.RIGHT_ELEMENT) { 
						return ;
					}
					
					startCoords = getCoordinates(event);
					startCoords.x += opt.EDGE_LAST && nowIdx==swipeLen - 1 ? diff : 0;
					active = true;
					totalX = 0;
					totalY = 0;
					isSwipeActive = true;
					lastPos = startCoords;
					nowIdx = scope.swipeIdx;
					startTime = new Date().getTime();
					
					if (opt.SLIDE_MENU_SWIPE) {
						elInfo = getListInfo(element);
						startTransX = getTransXPos(element);
					}

					eventHandlers['start'] && eventHandlers['start'](startCoords, event);

					if (opt.LOADING_ELEMENT) {
						angular.element(opt.LOADING_ELEMENT).css({
							position: "fixed",
							zIndex: opt.LOADING_ELEMENT_ZINDEX,
							minHeight: window.innerHeight - el.offsetTop,
							height: window.innerHeight-el.offsetTop,
							width: "100%",
							left: el.offsetWidth,
							right: "auto"
						}).removeClass("none");
					}
					if (opt.LEFT_ELEMENT) {
						angular.element(opt.LEFT_ELEMENT).css({
							position: "fixed",
							zIndex: opt.LOADING_ELEMENT_ZINDEX,
							minHeight: window.innerHeight - el.offsetTop,
							height: window.innerHeight-el.offsetTop,
							width: "100%",
							left: el.offsetWidth,
							right: "auto"
						}).removeClass("none");
					}
					if (opt.RIGHT_ELEMENT) {
						angular.element(opt.RIGHT_ELEMENT).css({
							position: "fixed",
							zIndex: opt.LOADING_ELEMENT_ZINDEX,
							minHeight: window.innerHeight - el.offsetTop,
							height: window.innerHeight-el.offsetTop,
							width: "100%",
							left: el.offsetWidth,
							right: "auto"
						}).removeClass("none");
					}
				});

				element.on('touchcancel.ngswipe', function(event) { // 포커스 벗어나거나 잃어버릴경우 
					//consoleGalaxyNoteII("touchcancel"); //Galaxy Note II 오류 디버깅용
					active = false;
					resetSwipe(el, opt, startCoords, lastPos);
					return;
				});

				element.on('touchmove.ngswipe mousemove.ngswipe', function(event) { // 터치 드래그
					if (!active || !swipeUsing ) {
						return;
					}

					if (!startCoords) {
						return;
					}

					//consoleGalaxyNoteII("touchmove"); //Galaxy Note II 오류 디버깅용
					var coords = getCoordinates(event);
					coords.x += opt.EDGE_LAST && nowIdx==swipeLen - 1 ? diff : 0;

					totalX += Math.abs(coords.x - lastPos.x);
					totalY += Math.abs(coords.y - lastPos.y);

					lastPos = coords;

					var deltaX, deltaY, ratio;

					deltaX = Math.abs(coords.x - startCoords.x);
					deltaY = Math.abs(coords.y - startCoords.y);

					if (!dragDirChkFlag/* && totalX >= opt.MIN_DISTANCE*/) { // 민감도 조절로 인하여 특정폰 스와이프 안되는 현상 발생
						dirXFlag = deltaX > deltaY;
						dragDirChkFlag = true;
					}

					var moveStartPos = lastPos.x - startCoords.x;
					if (moveStartPos > 0) {
						event.moveto = 'right';
					} else {
						event.moveto = 'left';
					}

					if (dirXFlag && // Drag 방향이 X축일때만 작동시키고 기본 이벤트 중단시켜 스크롤 방지
						(iOsSwipeEnableFlag || !isIOSFlag)) { // iOS 스크롤시 스와이프 방어
						event.preventDefault();
						event.stopPropagation();

						var translateCSS = "";

						if (!opt.SLIDE_MENU_SWIPE) {
							//el.style.webkitTransform = "translateX(" + (coords.x-startCoords.x) + "px)";
							angular.element(el).css(getTranslateXCssObj(coords.x-startCoords.x));
						} else {
							//el.style.webkitTransform = "translateX(" + (coords.x-startCoords.x+startTransX) + "px)";
							angular.element(el).css(getTranslateXCssObj(coords.x - startCoords.x + startTransX));
						}

						if (opt.LOADING_ELEMENT) {
							// CSS 적용은 개별로 하는거 보다 한번에 해주는게 성능에 더 좋다
							/*
							if(coords.x - startCoords.x <= 0) {
								angular.element(opt.LOADING_ELEMENT).css("left",el.offsetWidth);
								angular.element(opt.LOADING_ELEMENT).css("right",'auto');
							} else {
								angular.element(opt.LOADING_ELEMENT).css("left",'auto');
								angular.element(opt.LOADING_ELEMENT).css("right",el.offsetWidth);
							}

							angular.element(opt.LOADING_ELEMENT).css('webkitTransform',"translateX(" + (coords.x-startCoords.x) + "px)");
							*/
							angular.element(opt.LOADING_ELEMENT).css(angular.extend({
								left : coords.x - startCoords.x <= 0 ? el.offsetWidth : "auto",
								right : coords.x - startCoords.x <= 0 ? "auto" : el.offsetWidth
							}, getTranslateXCssObj(coords.x-startCoords.x)));
						}
						if(event.moveto == 'left') {
							if (opt.RIGHT_ELEMENT) {
								angular.element(opt.RIGHT_ELEMENT).css(angular.extend({
									left : coords.x - startCoords.x <= 0 ? el.offsetWidth : "auto",
									right : coords.x - startCoords.x <= 0 ? "auto" : el.offsetWidth
								}, getTranslateXCssObj(0)));
							}
							if (opt.LEFT_ELEMENT) {
								angular.element(opt.LEFT_ELEMENT).css(getTranslateXCssObj(0));
							}
						} else {
							if (opt.LEFT_ELEMENT) {
								angular.element(opt.LEFT_ELEMENT).css(angular.extend({
									left : coords.x - startCoords.x <= 0 ? el.offsetWidth : "auto",
									right : coords.x - startCoords.x <= 0 ? "auto" : el.offsetWidth
								}, getTranslateXCssObj(0)));
							}
							if (opt.RIGHT_ELEMENT) {
								angular.element(opt.RIGHT_ELEMENT).css(getTranslateXCssObj(0));
							}
						}
						eventHandlers['move'] && eventHandlers['move'](coords, event);
					}
				});

				element.on('touchend.ngswipe mouseup.ngswipe', function(event) { // 터치 종료
					event.stopPropagation(); // 이벤트 하위로 전파 방지
					//consoleGalaxyNoteII("touchend"); //Galaxy Note II 오류 디버깅용

					dragDirChkFlag = false;

					if (dirXFlag && 
						(iOsSwipeEnableFlag || !isIOSFlag)) { // iOS 스크롤시 스와이프 방어
						if (!active || !swipeUsing) {
							return;
						}

						active = false;
						isSwipeActive = false;
						
						var clientW = element[0].offsetWidth;
						var deltaX = Math.abs(lastPos.x - startCoords.x);
						var moveStartPos = lastPos.x - startCoords.x;
						endTime = new Date().getTime();
						
						if (moveStartPos > 0) {
							event.moveto = 'right';
						} else {
							event.moveto = 'left';
						}
						event.max = opt.MAX_SLIDE;
						
						if (!opt.SLIDE_MENU_SWIPE) {
							if (clientW * opt.MAX_RATIO <= deltaX) {
								if (!opt.SLIDE_SWIPE) {
									moveSwipe(el, opt, moveStartPos, clientW);
								} else {
									if ((nowIdx >= opt.MAX_SLIDE && moveStartPos < 0) || (nowIdx < 0 && moveStartPos > 0) || (nowIdx == 0 && moveStartPos > 0) || (opt.MAX_SLIDE+1 <= opt.DISP_COUNT) || ((nowIdx+opt.DISP_COUNT > opt.MAX_SLIDE) && event.moveto == 'left')) {
										resetSwipe(el,opt,startCoords,lastPos + (opt.EDGE_LAST && nowIdx==swipeLen - 1 ? diff : 0));
										return;
									} else {
										if (opt.SLIDE_SWIPE) { // 슬라이드 아이템 양여백형(] [] [)일 경우
											var clientW = clientW - opt.LEFT_MARGIN- opt.RIGHT_MARGIN;
										}
										nowIdx = moveSwipeX(element, opt, moveStartPos ,clientW, nowIdx);
										event.idx = nowIdx;
									}
								}
								var coords = getCoordinates(event);
								coords.x += opt.EDGE_LAST && nowIdx==swipeLen - 1 ? diff : 0;
								var rtn = eventHandlers['end'] && eventHandlers['end'](coords, event);
								//console.log("w:"+clientW+"|movew:"+(clientW*opt.MAX_RATIO)+"|moveX:"+deltaX);
							} else {
								resetSwipe(el,opt,startCoords,lastPos);
								angular.element(element).eq(0).css(removeTranslateCSS());
							}
						} else {
							//startTransX = lastPos.x - startCoords.x + startTransX;
							var endPos = lastPos.x - startCoords.x + startTransX;
							var runOver = -80;
							var overPos = event.moveto == "left" ? endPos+runOver:endPos-runOver;
							var overStep = event.moveto == "left" ? -5:5;
							// console.log("Over Run [STEP:"+overStep+"][S:"+endPos+"]->"+"[E:"+overPos+"]")
							// run over 가속 슬라이드

							if (Math.abs(lastPos.x - startCoords.x) > 5 && endTime - startTime <= 400) {
								var stop = $interval(function() {
									endPos = endPos+overStep;
									//element[0].style.webkitTransform = "translateX(" + endPos + "px)";
									angular.element(element).eq(0).css(getTranslateXCssObj(endPos));
									// console.log(endPos +"||"+ (elInfo.totalwidth*-1));

									if ((endPos <= overPos && event.moveto == "left") || (endPos >= overPos && event.moveto == "right") || endPos > 0 || endPos <= -elInfo.totalwidth + window.innerWidth) {
										startTransX = menuOverCheck(element, opt, elInfo);
										$interval.cancel(stop);
									}
								}, 10);
							} else {
								startTransX = menuOverCheck(element, opt, elInfo);
							}
						}
					}

					if (isIOSFlag) { // iOS 스크롤시 스와이프 방어
						iOsSwipeEnableScrollPos = angular.element($window).scrollTop(); // iOS 스크롤시 Swipe되는 현상을 막기위한 스크롤 위치 기억
						iOsSwipeEnableFlag = true;
					}

					startCoords = null;
				});
			},
			moveSwipeX:moveSwipeX,
			positionReCalc:positionReCalc,
			resetSwipe:resetSwipe,
			moveMenuSwipe:moveMenuSwipe,
			getListInfo:getListInfo
		}
	}]);
	/**
     * @ngdoc directive
     * @name lotteNgSwipe.directive:lotteNgListSwipe
     * @description
     * 스와이프 디렉티브<br>
     * 옵션
     <pre>
	 swipe-end-exec : 실행할 scope 함수 [Function Name($event)]
	 swipe=loading-el : 로딩 엘리면트 class 또는 id
	 swipe-max-ratio : 실행 조건 비율 [0.0 ~ 1]
	 swipe-min-distance : 최소 범위 [0-100]%
	 swipe-loop : 무한 스와이프 [true/false]
	 swipe-responsive : 반응형 스와이프 [true/false]
	 swipe-responsive320 : 320px 이상 640 이하 일때의 반응형 스와이프 겟수
	 swipe-responsive640 : 640px 이상 900 이하 일때의 반응형 스와이프 겟수
	 swipe-responsive900 : 900px 이상 일때의 반응형 스와이프 겟수
	 swipe-disp-count : 노출 갯수
	 swipe-slide-item : 슬라이드형 스와이프 좌 우 둘다 사용시 ] [ ] [ 이련 유형의 스와이프 구성 가능
	 swipe-left-margin : 좌측 여백 설정 ] [ ] 이련 유형의 스와이프 구성 가능
	 swipe-right-margin: 우측 여백 설정 [ ] [ 이련 유형의 스와이프 구성 가능
	 swipe-first-index : 처음에 노출할 인덱스(1개씩 노출할때 사용 권장)
	 swipe-list-model : 리스트 스코프명 (적용 안할경우 기존 리스트로 구동 사용할경우 리스트가 변경됨에 따라 같이 변경)
	 swipe-autoheight : true/false 스와이프 자동 높이 계산
	 </pre>
	 Bullet  설정예제
	 <pre>
		<ol class="bullet">
			<li ng-repeat="item in swipeBullet" ng-class=“{on:$index==swipeBulletIdx}" >{{$index}}</li>
		</ol>
	</pre>
	이전 다음 버튼 설정 예제 
	<pre>
	<p class="btn prev" ng-click="beforeSlide()" ng-show="swipeBulletIdx > 0”><button>이전</button></p>
	<p class="btn next" ng-click="nextSlide()" ng-show=“swipeBulletIdx<=(swipeBullet.length-2)"><button>다음</button></p>
	</pre>
     * @example
     <pre>
      <div lotte-ng-list-swipe swipe-end-exec="otherProductList($event)" swipe-max-ratio="0.3" swipe-min-distance="40">
      	<ul>
      		<li ng-repeat="...">
      		....
      		</li>
      	</ul>
      </div>
     </pre>
     */
	lotteNgSwipe.directive('lotteNgListSwipe',['$window','$parse','$timeout','lotteNgSwipe', function($window, $parse,$timeout,lotteNgSwipe) {
		return {
			link: function(scope, element, attr) {
				function getTranslateXCssObj(pos, transition_millisec) {
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
				}

				// transform 속성을 삭제한다.
				function removeTranslateCSS() {
					return {
						"-webkit-backface-visibility": "",
						"-moz-backface-visibility": "",
						"backface-visibility": "",
						"-webkit-transform": "",
						"-ms-transform": "",
						"-moz-transform": "",
						"transform": ""
					};
				}

				// transition cross browsing
				function getTransitionCSSObj(prop) {
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

				var options = {
					MAX_RATIO: attr.swipeMaxRatio ? attr.swipeMaxRatio : 0.3,
					MIN_DISTANCE: attr.swipeMinDistance ? attr.swipeMinDistance : 25,
					SWIPE_LOOP: attr.swipeLoop ? attr.swipeLoop : false,
					LEFT_ELEMENT: attr.swipeLeftEl ? attr.swipeLeftEl : null,
					RIGHT_ELEMENT: attr.swipeRightEl ? attr.swipeRightEl : null,
					LOADING_ELEMENT: attr.swipeLoadingEl ? attr.swipeLoadingEl : null,
					LOADING_ELEMENT_ZINDEX: attr.swipeLoadingElZindex ? attr.swipeLoadingElZindex : 50,
					SLIDE_SWIPE: attr.swipeSlideItem ? attr.swipeSlideItem : false,
					SLIDE_MENU_SWIPE: attr.swipeSlideMenu ? attr.swipeSlideMenu : false,
					RESPONSIVE_SWIPE: attr.swipeResponsive ? attr.swipeResponsive : false,
					RESPONSIVE_SWIPE_320: parseInt(attr.swipeResponsive320) ? parseInt(attr.swipeResponsive320) : 1,
					RESPONSIVE_SWIPE_640: parseInt(attr.swipeResponsive640) ? parseInt(attr.swipeResponsive640) : 2,
					RESPONSIVE_SWIPE_900: parseInt(attr.swipeResponsive900) ? parseInt(attr.swipeResponsive900) : 2,
					AUTO_HEIGHT: attr.swipeAutoheight ? attr.swipeAutoheight : false,
					DISP_COUNT: attr.swipeDispCount ? parseInt(attr.swipeDispCount) : 1,
					FIRST_INDEX: attr.swipeFirstIndex ? parseInt(attr.swipeFirstIndex) : 0,
					LEFT_MARGIN: attr.swipeLeftMargin ? parseInt(attr.swipeLeftMargin) : 0,
					RIGHT_MARGIN:attr.swipeRightMargin ? parseInt(attr.swipeRightMargin) : 0,
					START_EXEC: attr.swipeStartExec ? attr.swipeStartExec : null,
					EXEC: attr.swipeEndExec ? attr.swipeEndExec : null,
					LIST_SCOPE: attr.swipeListModel ? attr.swipeListModel : null,
					SWIPE_ID: attr.swipeId ? attr.swipeId : '',
					MAX_SLIDE: 0,
					SWIPE_SPEED: attr.swipSpeed ? attr.swipSpeed : 150,  // millisecond // 스와이프 속도
					IGNORE_DESTORY: attr.ignoreDestory ? attr.ignoreDestory:false,
					EDGE_LAST: attr.swipeEdgeLast ? true : false
				};
				//console.log("SWIPE INIT : "+options.LIST_SCOPE);
				
				scope.swipeIdx = options.FIRST_INDEX;
				scope.swipeBulletIdx = parseInt(scope.swipeIdx/options.DISP_COUNT);
				scope.swipeBullet = [];
				var swipeStartHandler = null;
				var swipeHandler = null;
				
				if (options.START_EXEC != null) {
					swipeStartHandler = $parse(options.START_EXEC);
				}
				if (options.EXEC != null) {
					swipeHandler = $parse(options.EXEC);
				}
				
				if (options.RESPONSIVE_SWIPE) {
				  options.DISP_COUNT = options.RESPONSIVE_SWIPE_320;
				}
				
				if (options.SLIDE_MENU_SWIPE) {
					scope.moveMenuSwipe = function (idx) {
						scope.moveMenuSwipeFnc(idx, false);
					}

					scope.moveMenuSwipeFnc = function (idx, directMoveFlag) {
						lotteNgSwipe.moveMenuSwipe(element,options,idx, directMoveFlag);
					}
				}

				if (!options.SLIDE_MENU_SWIPE && !options.SLIDE_SWIPE) {
					scope.translateX_Reset = function() {
						console.log("스와이프 좌표 리셋");
						//element[0].style.webkitTransform = "translateX(" + 0 + "px)";
						angular.element(element).eq(0).css(getTranslateXCssObj(0));

						if (options.LOADING_ELEMENT) {
							angular.element(options.LOADING_ELEMENT).css(getTranslateXCssObj(0));
						}
					}
				  }

				scope.setSlide = function (slideIdx) {
					if (slideIdx < 0)
						slideIdx = options.MAX_SLIDE;
					else if (slideIdx > options.MAX_SLIDE)
						slideIdx = 0;

					scope.swipeIdx = slideIdx;

					if (options.EXEC != null) {
						swipeHandler(scope.$parent, { $event: {idx:scope.swipeIdx,max:options.MAX_SLIDE} });
						console.log("Call swipe exec. "+options.EXEC);
					}
				};
				
				scope.goSlide = function (idx) {

					lotteNgSwipe.positionReCalc(idx,element,options);
					
					scope.swipeIdx = scope.swipeBulletIdx = idx;

					if (options.EXEC != null) {
						swipeHandler(scope.$parent, { $event: {idx:scope.swipeIdx,max:options.MAX_SLIDE} });
						console.log("Call swipe exec. "+options.EXEC);
					}
				};
				
				scope.nextSlide = function () {
					if (scope.swipeIdx != options.MAX_SLIDE) {
						lotteNgSwipe.moveSwipeX(element, options, -1, element[0].offsetWidth-10, scope.swipeIdx);
						scope.swipeIdx+=options.DISP_COUNT;
						scope.swipeBulletIdx++;

						if (options.EXEC != null) {
							swipeHandler(scope.$parent, { $event: {idx:scope.swipeIdx,max:options.MAX_SLIDE} });
							console.log("Call swipe exec. "+options.EXEC);
						}
					}
				}

				scope.beforeSlide = function () {
					if(scope.swipeIdx != 0) {
						lotteNgSwipe.moveSwipeX(element, options, 1, element[0].offsetWidth-10, scope.swipeIdx);
						scope.swipeIdx-=options.DISP_COUNT;
						scope.swipeBulletIdx--;
						if(options.EXEC != null) {
							swipeHandler(scope.$parent, { $event: {idx:scope.swipeIdx,max:options.MAX_SLIDE} });
							console.log("Call swipe exec. "+options.EXEC);
						}
					}
				}

				scope.ngswipeInit = function () {
					if (options.SLIDE_SWIPE) {
						scope.swipeBullet = [];
						options.MAX_SLIDE = element.find('>li').length;

						for(var i=0;i < options.MAX_SLIDE/options.DISP_COUNT;i++) {
							scope.swipeBullet.push(i);
						}
					}

					if(options.MAX_SLIDE < scope.swipeIdx) {
						scope.swipeIdx = options.FIRST_INDEX;
						scope.swipeBulletIdx = parseInt(options.FIRST_INDEX/options.DISP_COUNT);
						lotteNgSwipe.positionReCalc( scope.swipeIdx,element,options);
						$timeout(function() {
							scope.$apply();
						});
					} else if (!scope.swipeIdx) {
						scope.swipeBulletIdx = parseInt(options.FIRST_INDEX/options.DISP_COUNT);
						scope.swipeIdx = options.FIRST_INDEX;
						$timeout(function() {
							scope.$apply();
						});
					}
				}

				function onOrientationChange() {
					var el = element[0];
					
					if (window.innerWidth >= 900 && options.RESPONSIVE_SWIPE) {
						options.DISP_COUNT = options.RESPONSIVE_SWIPE_900;
					} else if(window.innerWidth >= 640 && options.RESPONSIVE_SWIPE) {
						options.DISP_COUNT = options.RESPONSIVE_SWIPE_640;
					} else if(options.RESPONSIVE_SWIPE) {
						options.DISP_COUNT = options.RESPONSIVE_SWIPE_320;
					}
					

					if (options.LOADING_ELEMENT) {
						  angular.element(options.LOADING_ELEMENT).css("min-height",window.innerHeight-el.offsetTop+"px");
					}
					if (options.LEFT_ELEMENT) {
						  angular.element(options.LEFT_ELEMENT).css("min-height",window.innerHeight-el.offsetTop+"px");
					}
					if (options.RIGHT_ELEMENT) {
						  angular.element(options.RIGHT_ELEMENT).css("min-height",window.innerHeight-el.offsetTop+"px");
					}

					if (scope.swipeIdx != 0 && options.DISP_COUNT > 1) {
						var recalc = scope.swipeIdx % options.DISP_COUNT;

						if (recalc != 0) {
							scope.swipeIdx -= recalc;
						}
					}
					
					scope.swipeBulletIdx = parseInt(scope.swipeIdx/options.DISP_COUNT);
					
					if (options.SLIDE_MENU_SWIPE) {
						var elInfo = lotteNgSwipe.getListInfo(element);

						if (elInfo.width.length > 1) { 
							if (window.innerWidth - options.LEFT_MARGIN - options.RIGHT_MARGIN > elInfo.totalwidth) {
								angular.element(el).css(getTranslateXCssObj(0));
							}
						}
					}
					
					if (options.LOADING_ELEMENT) {
						// CSS는 한꺼번에 적용해야 성능에 더 좋다
						angular.element(options.LOADING_ELEMENT).css({
							position: "fixed",
							zIndex: options.LOADING_ELEMENT_ZINDEX,
							minHeight: window.innerHeight - el.offsetTop,
							height: window.innerHeight - el.offsetTop,
							width: "100%",
							left: el.offsetWidth,
							right: "auto"
						}).removeClass("none");
					}
					if (options.LEFT_ELEMENT) {
						// CSS는 한꺼번에 적용해야 성능에 더 좋다
						angular.element(options.LEFT_ELEMENT).css({
							position: "fixed",
							zIndex: options.LOADING_ELEMENT_ZINDEX,
							minHeight: window.innerHeight - el.offsetTop,
							height: window.innerHeight - el.offsetTop,
							width: "100%",
							left: el.offsetWidth,
							right: "auto"
						}).removeClass("none");
					}
					if (options.RIGHT_ELEMENT) {
						// CSS는 한꺼번에 적용해야 성능에 더 좋다
						angular.element(options.RIGHT_ELEMENT).css({
							position: "fixed",
							zIndex: options.LOADING_ELEMENT_ZINDEX,
							minHeight: window.innerHeight - el.offsetTop,
							height: window.innerHeight - el.offsetTop,
							width: "100%",
							left: el.offsetWidth,
							right: "auto"
						}).removeClass("none");
					}
					
					scope.ngswipeInit();
					lotteNgSwipe.positionReCalc(scope.swipeIdx, element, options);
				}

				scope.resetSwipePos = function () { // 스와이프 좌표 리셋
					lotteNgSwipe.positionReCalc(scope.swipeIdx, element, options);
				};
				
				if (options.LIST_SCOPE != null) {
					var zeroItem = null;
					scope.$watch(options.LIST_SCOPE, function(newVal, oldVal) {
						if (newVal != undefined) {
							if (newVal.length >= 1) {
								if (zeroItem != newVal[0]) {
									scope.swipeIdx = 0;
									scope.swipeBulletIdx = 0;
									zeroItem = newVal[0];
								}

								if (attr.swipeId == "recommondSwipe_0" || attr.swipeId == "lastestSwipe_0") {
									var timeSec = 2000;
								}else {
									var timeSec = 100;
								}

								$timeout(function () {
									scope.ngswipeInit();
									lotteNgSwipe.positionReCalc(scope.swipeIdx, element,options); 
								}, timeSec);

							}
						}
					}, true);
				}

				onOrientationChange();
				
				function runStartSwipeHandler(event,options) {
					if(LeftSwipeStartExec && event.moveto == "left") {
						return;
					} else if(RightSwipeStartExec && event.moveto == "right") {
						return;
					}
					if(event.moveto == "left") {
						LeftSwipeStartExec = true;
					} else {
						RightSwipeStartExec = true;
					}
					var res = null;
					scope.$apply(function() {
					 	res = swipeStartHandler(scope.$parent, { $event: {idx:event.idx,max:options.MAX_SLIDE,moveto:event.moveto} });
						return res;
					});
				}
				
				function runSwipeHandler(event,options) {
					if (isSwipeActive) {
						$timeout(function() {
							runSwipeHandler(event,options);
						},100);
						return false;
					}

					var res = null;
					scope.$apply(function() {
					 	res = swipeHandler(scope.$parent, { $event: {idx:event.idx,max:options.MAX_SLIDE,moveto:event.moveto} });

						if (res == 'translateX_Reset') {
							$timeout(function() {
								//element[0].style.webkitTransform = "translateX(" + 0 + "px)";
								angular.element(element).eq(0).css(getTranslateXCssObj(0));
							},500);
						}

						return res;
					});
				}
				
//                if(swipeQueue.indexOf(options.SWIPE_ID) == -1) {
//                    swipeQueue.push(options.SWIPE_ID);
//                  if(!options.IGNORE_DESTORY) {
//                  }
//                }
				if(swipeQueue.indexOf(options.SWIPE_ID) == -1) {
                    swipeQueue.push(options.SWIPE_ID);
				}

				var winEl = angular.element($window);
            	winEl.on('orientationchange.ngswipe resize.ngswipe', onOrientationChange);
                scope.$on('$destroy', function() {
   					lotteNgSwipe.unbind(element);
				});

                lotteNgSwipe.bind(element, options, {
					'start': function(coords, event) {
						// 이동에 필요한 로딩 그려야함
						//console.log("::Swipe Start::");
					},
					'move': function(coords, event) {
						// 이동
						//console.log("::Swipe Move::"+event.moveto);
						if (options.START_EXEC != null) {
							isLoadingData = true;
							return runStartSwipeHandler(event,options);
						}
					},
					'cancel': function() {
						isLoadingData = false;
						// 이동 취소 행동 
					},
					'end': function(coords, event) {
						isLoadingData = false;
						LeftSwipeStartExec = false;
						RightSwipeStartExec = false;
						scope.swipeIdx = event.idx ? event.idx:0;
						scope.swipeBulletIdx = parseInt(event.idx/options.DISP_COUNT);
						scope.$apply();
						if (options.EXEC != null) {
							return runSwipeHandler(event,options);
						}
					}
				});
			}
		}
	}]);
})(window, window.angular);