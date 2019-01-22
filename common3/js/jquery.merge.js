/**
 * This file is part of the MobilizeToday.com mobile optimization core.
 * Copyright (c) 2011 Mobile Web Solutions Inc, d/b/a MobilizeToday.com
 * All rights reserved.
 * License: MIT
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	/*********************** jquery.touchslider-1.0 ***********************/
	$.fn.reverse = [].reverse;
	
	$.fn.touchSlider = function(options){
		
		var options = $.extend({
			item: 'div.item',
			holder: 'div.holder',
			box: 'div.list',
			debug: false,
			mode: 'shift',
			shift: '80%',
			delta: 40,
			single: false,
			center: false,
			animation: 'auto',
			touch: true,
			duration: 500,
			prevLink: null,
			nextLink: null,
			onChange: null,
			onStart: null,
			onCheckItems: null,
			lockScroll: false,
			hideClass: 'mt-hidden',
			activeClass: 'active',
			itemGapWidth:10,
			movePrevNextFlag:false,
			animationEasign : 'swing',
			beforeIdxChangeFunc : function (previousIndex, currentIndex) {},
			afterIdxChangeFunc : function (previousIndex, currentIndex) {} // mode가 index일때만 작동
		}, options);
		
		this.each(function() {
			var $this = jQuery(this);

			if(options.debug) $('body').append('<div id="console"></div>');

			var events =  [{start: 'mousedown', end: 'mouseup', move: 'mousemove', leave: 'mouseout', touchcancel: 'touchcancel'}, {start: 'touchstart', end: 'touchend', move: 'touchmove', leave: 'touchend', touchcancel: 'touchcancel'}];
			var eventIndex = "ontouchend" in document ? 1 : 0;

			var items = $(options.item, this);
			if (!items.length) return;

			var holder = $(options.holder, this).first();
			if (!holder.length) return;

			var box = $(options.box, this).first();
			if (!box.length) return;

			var cssTransitionsSupported = false;
			
			var iphoneKeyWords = new Array('iPhone', 'iPad'); // 아이폰 분기처리
			var androidKeyWords = "Android"; // 안드로이드 분기처리
			var isIPhone = false;
			var isAndroid = false;
			var isAndroid_ver4 = false;
			var dataLoadFalg = false;
			var movePrevNextFlag = false;
			
			// 아이폰 체크
			for (var word in iphoneKeyWords) {
				if (navigator.userAgent.match(iphoneKeyWords[word]) != null)
					isIPhone = true;
			}
			
			// 안드로이드 체크
			if (navigator.userAgent.match(/Android/i))
				isAndroid = true;
			
			// 안드로이드 4 이상 버전
			if (navigator.userAgent.toLowerCase().indexOf("android 4") > -1)
				isAndroid_ver4 = true;

			if (options.animation && options.animation != 'js') {
				var body = document.body || document.documentElement;
				var bodyStyle = body.style;
				
				var transitionEndEvent = (bodyStyle.WebkitTransition !== undefined) ? "webkitTransitionEnd" : "transitionend";
				cssTransitionsSupported = bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.transition !== undefined;

				if (cssTransitionsSupported && options.animation == 'auto') {
					debug('Detected Transitions Support', '');
					box.css({
						'-webkit-transition-property': '-webkit-transform',
						'-webkit-transition-timing-function': 'ease',
						'-moz-transition-property': '-moz-transform',
						'-moz-transition-timing-function': 'ease',
						'transition-property': 'transform',
						'transition-timing-function': 'ease'
					});
					box.unbind(transitionEndEvent);
					box.bind(transitionEndEvent, endAnimation);
				}

				//var has3D = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
				
				var has3D = isIPhone || isAndroid_ver4;
				
				if (has3D) {
					debug('Detected 3D Support', '');
				}
			}

			var currentIndex = null;
			var currentPage = 0;
			var currentOffset = null;

			var graphRealIndex = 0;
			var graphItems = [];
			var currentSubOffset = 0;

			var previousIndex = null;
			var previousPage = null;
			var previousOffset = null;
			var touchOffset = 0;
			
			var tmpCurrentIdx = null;

			var hasChanges = false;
			
			setCurrentIndex(0);
			setCurrentOffset(0);

			if(options.touch) {
				var b = box.get(0);
				b.addEventListener(events[eventIndex]['start'], touchEvent, false);
				b.addEventListener(events[eventIndex]['end'], touchEvent, false);
				b.addEventListener(events[eventIndex]['leave'], touchEvent, false);
				b.addEventListener(events[eventIndex]['move'], touchEvent, false);
				b.addEventListener(events[eventIndex]["touchcancel"], touchEvent, false);
			}

			if(options.prevLink) {
				$(options.prevLink, $this).bind('click', function(){
					if (!movePrevNextFlag)
						$this.get(0).movePrev();
						
					if (options.movePrevNextFlag) movePrevNextFlag = true;
					return false;
				});
			}

			if(options.nextLink) {
				$(options.nextLink, $this).bind('click', function(){
					if (!movePrevNextFlag)
						$this.get(0).moveNext();
					
					if (options.movePrevNextFlag) movePrevNextFlag = true;
					return false;
				});
			}

			window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", resizeEvent, false);
			window.addEventListener("load", resizeEvent, false);

			function resizeEvent() {
				setTimeout(initPosition, 200);
			}

			var isTouching = false;
			var startX = 0;
			var startY = 0;
			var width = holder.width();
			debug('Current width:', width);
			
			this.getCount = function() {
				return options.mode == 'auto' ? graphItems.length : $(items).length;
			};

			this.moveNext = function() {
				switch(options.mode)
				{
					case 'index': moveNextIndex();
						break;
					case 'shift': moveNextOffset();
						break;
					case 'auto': moveNextAuto();
						break;
					case 'page': moveNextPage();
						break;
				}
			};

			this.movePrev = function() {
				switch(options.mode)
				{
					case 'index': movePrevIndex();
						break;
					case 'shift': movePrevOffset();
						break;
					case 'auto': movePrevAuto();
						break;
					case 'page': movePrevPage();
						break;
				}
			};
			
			this.moveTo = function(i) {
				switch(options.mode)
				{
					case 'index': moveToIndex(i);
						break;
					//case 'auto': moveToAuto(i);
						//break;
				}
			};
			
			this.moveIdx = function(index, now) {
				switch(options.mode)
				{
					case 'index':
						if (typeof(items[index]) != 'undefined') {
							setCurrentIndex(parseInt(index));
							touchOffset = 0;
							moveIndex(now);
						}
						break;
				}
			};
			
			this.setDuration = function (value) {
				options.duration = value;
			};
			
			this.itemRefresh = function (idx) {
				tmpCurrentIdx = idx;
				items = $(options.item, this);
				setCurrentIndex(idx);
				setCurrentOffset(-$(items[idx]).width() * idx);
				moveTo(-$(items[idx]).width() * idx, true);
			};
			
			this.refresh = function() {
				items = $(options.item, this);
				initPosition();
			};
			
			this.getCurrentIndex = function () {
				return currentIndex;
			};
			
			this.getCurrentOffset = function () {
				return currentOffset;
			};
			
			this.setPageIndex = function (page) {
				var cIdx = 0;
				var pageCnt = 0;
				var itemsWidth = 0;
				
				width =  holder.width();
				
				$.each(items, function(i){
					itemsWidth += this.offsetWidth;
					
					if (itemsWidth < width)
						cIdx++;
				});
				
				pageCnt = Math.round(itemsWidth / width);
				
				if (options.mode != "page")
					return;
					
				if (page > pageCnt - 1 && pageCnt > 1)
					return;
					
				if (pageCnt <= 1) {
					page = 0;
					this.removeTouchEvent();
				}
					
				setCuttentPage(page);
				setCurrentOffset(page * -width);
				moveTo(currentOffset, true);
			};
			
			this.removeTouchEvent = function () {
				if(options.touch) {
					var b = box.get(0);
					b.removeEventListener(events[eventIndex]['start'], touchEvent);
					b.removeEventListener(events[eventIndex]['end'], touchEvent);
					b.removeEventListener(events[eventIndex]['leave'], touchEvent);
					b.removeEventListener(events[eventIndex]['move'], touchEvent);
					b.removeEventListener(events[eventIndex]['touchcancel'], touchEvent);
					b.removeEventListener(events[eventIndex]['touchcancel'], touchEvent);
				}
			};
			
			this.setDataLoadFalg = function (value) {
				dataLoadFalg = value;
			};
			
			if (options.mode != "page")
				initPosition(true);

			function initPosition(init) {
				width =  holder.width();
				touchOffset = 0;
				var init = typeof(init) == 'undefined' ? false: init;

				if (init && $.isFunction(options.onStart)) {
					options.onStart();
				}
				switch(options.mode)
				{
					case 'index':
						if (options.single) {
							var itemsWidth = 0;
							if (init) {
								resizeItems();

							} else {
								$(items[currentIndex]).css('width', width);
								setTimeout(delayResizeItems, 100);
							}
							moveIndex();
						}
						else if(options.center) {
							moveIndex();
						}
						break;
					case 'shift':
						moveShift();
						break;
					case 'auto':
						graphItems = [];
						if (options.single) resetGraphItems();
						showLink('both');

						items.each(function(i, el) {
							var w = this.offsetWidth;
							var l = graphItems.length;
							if (i == 0) {
								if (w > width){
									graphItems.push([w, new Array(new Array(i, w)), 0]);
								} else {
									graphItems.push([w, new Array(new Array(i, w))]);
								}
								detectGraphIndex(i);
							} else {
								if (graphItems[l-1][0] + w <= width) {
									graphItems[l-1][0] += w;
									graphItems[l-1][1].push(new Array(i, w));
									detectGraphIndex(i);
								} else {
									if (w > width){
										graphItems.push([w, new Array(new Array(i, w)), 0]);
									} else {
										graphItems.push([w, new Array(new Array(i, w))]);
									}
									detectGraphIndex(i);
								}
							}
						});

						if (currentIndex >= graphItems.length) setCurrentIndex(graphItems.length-1);

						if (options.single) resizeGraphItems();

						if ($.isFunction(options.onCheckItems)) options.onCheckItems();

						moveAuto();
						break;
					case 'page':
						movePage();
						break;
				}
			};

			function resetGraphItems() {
				$(items).css('width', 'auto');
			}

			function detectGraphIndex(i) {
				if (i == graphRealIndex) {
					setCurrentIndex(graphItems.length-1);
				}
			}

			function resizeItems() {
				$.each(items, function() {
					$(this).css('width', 'auto');

					var _w = $(this).width();
					if (_w < width) {
						$(this).css('width', width);
					}
				});
			}

			function resizeGraphItems() {
				$.each(graphItems, function(i, el) {
					
					if (el[0] < width) {
						var orig =  el[0];
						el[0] = width;

						$(el[1]).each(function(k, item){
							item[1] = parseInt(width*item[1]/orig);
							$(items[item[0]]).css('width', item[1]);
						})
					}
				});
			}

			function delayResizeItems() {
				resizeItems();
				moveIndex(true);
			}
			

			function touchEvent(e) {
				var touch = (eventIndex) ? e.touches[0] : e;
				switch(e.type)
				{
					case events[eventIndex]['move']:
						touchMove(e, touch);
						break;
					case events[eventIndex]['start']:
						touchStart(e, touch);
						break;
					case events[eventIndex]['touchcancel']:
					case events[eventIndex]['end']:
					case events[eventIndex]['leave']:
						touchEnd(e);
						break;
				}
			};
			
			var scrollChkFlag = false;
			var yScrollFlag = false;

			function touchMove(e, touch) {

				if (isTouching) {
					/*
					if (isAndroid && e.type != 'click' && isAndroid_ver4 > -1) // 안드로이드 터치 이벤트 오류 처리
						e.preventDefault();
					*/
					
					if (!scrollChkFlag && Math.abs(touch.pageY - startY) > Math.abs(touch.pageX - startX)) {
						scrollChkFlag = true;
						yScrollFlag = true;
						
						if (isAndroid_ver4) {
							isTouching = false;
							touchOffset = 0;
						}
					} else if (!scrollChkFlag) {
						if (options.lockScroll && e.type != 'click' && isAndroid_ver4) e.preventDefault();
					}
					
					if (!yScrollFlag) {
						if (options.lockScroll && e.type != 'click' && !isAndroid_ver4) e.preventDefault();
						
						touchOffset = startX - touch.pageX;
						
						if (touchOffset != 0) {
							moveTo(currentOffset - touchOffset, true);
						}
					}
				}
			};

			function touchStart(e, touch) {
				scrollChkFlag = false;
				yScrollFlag = false;
				
				if (!isTouching) {
					hasChanges = false;
					/*
					if (isAndroid && e.type != 'click' && isAndroid_ver4) // 안드로이드 터치 이벤트 오류 처리
						e.preventDefault();
					*/
					//if (options.lockScroll && e.type != 'click') e.preventDefault();
					
					debug('Touch Start');
					isTouching = true;
					touchOffset = 0;

					startX = (eventIndex) ? touch.pageX : e.clientX;
					startY = (eventIndex) ? touch.pageY : e.clientY;
					
					/*
					if (isAndroid && e.type != 'click') // 안드로이드 터치 이벤트 오류 처리
						e.preventDefault();
					*/
				}
			};

			function touchEnd(e, touch) {
				if (isTouching) {
					debug('Touch End');
					isTouching = false;
					scrollChkFlag = false;
					yScrollFlag = false;
					startX = 0;
					startY = 0;
					
					if (touchOffset != 0) {
						if (touchOffset > options.delta || touchOffset < (0 - options.delta)) {
							detectMove();
						} else {
							moveTo(currentOffset);
						}
					}
				}

				touchOffset = 0;
			};

			function detectMove() {
				switch(options.mode)
				{
					case 'shift':
						moveShift();
						break;
					case 'index':
						moveIndex();
						break;
					case 'auto':
						moveAuto();
						break;
					case 'page':
						movePage();
						break;
				}
			};

			function moveIndex(now) {
				var itemsWidth = 0;
				var itemsBeforeWidth = 0;
				
				$.each(items, function(i){
					if (i < currentIndex) {
						itemsBeforeWidth += this.offsetWidth;
					}
					itemsWidth += this.offsetWidth;
				});

				if(itemsWidth <= width) {hideLink('both');return;}else{showLink('both');}
				
				var possibleOffset = 0;
				
				if (touchOffset > 0) {
					if (options.center) {
						possibleOffset = 0 - (itemsBeforeWidth + $(items[currentIndex]).width() + $(items[currentIndex+1]).width()/2) + width/2;

						if(currentIndex < items.length-1) {
							setCurrentIndex(currentIndex+1);
							setCurrentOffset(possibleOffset);
							moveTo(currentOffset);
						} else {
							moveTo(currentOffset);
						}
					} else {
						possibleOffset = 0 - (itemsBeforeWidth + $(items[currentIndex]).width());

						if(itemsWidth + possibleOffset > width) {
							setCurrentIndex(currentIndex+1);
							setCurrentOffset(possibleOffset);
							moveTo(currentOffset);
						} else {
							setCurrentIndex(items.length - 1);
							setCurrentOffset(0 - (itemsWidth - width));
							moveTo(currentOffset);
						}
						
					}
				} else if (touchOffset < 0) {
							
					if (options.center, possibleOffset) {
						possibleOffset = 0 - (itemsBeforeWidth - $(items[currentIndex-1]).width()/2) + width/2;
						
						if(currentIndex > 0) {
							setCurrentIndex(currentIndex-1);
							setCurrentOffset(possibleOffset);
							moveTo(currentOffset);
						} else {
							moveTo(currentOffset);
						}
					} else {
						possibleOffset = 0 - (itemsBeforeWidth - $(items[currentIndex]).width());
						
						if (currentOffset == possibleOffset) {
							setCurrentIndex(currentIndex-1);
							setCurrentOffset(possibleOffset - $(items[currentIndex]).width());
							moveIndex();
						} else {
							if(possibleOffset < 0) {
								setCurrentIndex(currentIndex-1);
								setCurrentOffset(possibleOffset);
								moveTo(currentOffset);
							} else {
								setCurrentIndex(0);
								setCurrentOffset(0);
								moveTo(currentOffset);
							}
						}
					}
				} else {
					if (options.center) {
						possibleOffset = 0 - (itemsBeforeWidth + $(items[currentIndex]).width()/2)  + width/2;
						setCurrentOffset(possibleOffset);
						
						if (typeof(now) == 'undefined') {
							moveTo(currentOffset);
						}else {
							moveTo(currentOffset, true);
						}
					} else {
						possibleOffset = 0 - itemsBeforeWidth;
						setCurrentOffset(possibleOffset);

						if (typeof(now) == 'undefined') {
							moveTo(currentOffset);
						}else {
							moveTo(currentOffset, true);
						}
						
					}
				}
			};

			function moveAuto() {
				var itemsWidth = 0;
				var itemsBeforeWidth = 0;

				$.each(graphItems, function(i){
					if (i < currentIndex) {
						itemsBeforeWidth += this[0];
					}
					itemsWidth +=  this[0];
				});

				var long = graphItems[currentIndex].length > 2 ? true : false;

				if(itemsWidth <= width) {hideLink('both');}else{showLink('both');}

				if (options.center && itemsWidth < width) {
					possibleOffset = width/2 - itemsWidth/2;
					setCurrentOffset(possibleOffset);
					moveTo(currentOffset);
					return;
				} 

				var possibleOffset = 0;
				
				if (touchOffset > 0) {
					if(currentIndex < graphItems.length-1 || (currentIndex >= graphItems.length-1 && long)) {
					
						if (long && graphItems[currentIndex][0] - width > graphItems[currentIndex][2]) {
							graphItems[currentIndex][2] += width;

							if (graphItems[currentIndex][0] - graphItems[currentIndex][2] > width) {
								setCurrentOffset(currentOffset - width);
								moveTo(currentOffset);
							} else {
								setCurrentOffset(currentOffset - (graphItems[currentIndex][0] - graphItems[currentIndex][2]));
								graphItems[currentIndex][2] += graphItems[currentIndex][0] - graphItems[currentIndex][2];
								graphItems[currentIndex][2] -= width;
								moveTo(currentOffset);
							}
						}
						else {
							if(typeof(graphItems[currentIndex+1]) != 'undefined') {
								if( graphItems[currentIndex+1].length > 2) {
									possibleOffset = 0 - (itemsBeforeWidth + graphItems[currentIndex][0]);
								} else {
									possibleOffset = 0 - (itemsBeforeWidth + graphItems[currentIndex][0] + graphItems[currentIndex+1][0]/2) + width/2;
								}

								if(itemsWidth + possibleOffset > width) {
									setCurrentIndex(currentIndex+1);
									setCurrentOffset(possibleOffset);
									moveTo(currentOffset);
								} else {
									setCurrentIndex(graphItems.length - 1);
									setCurrentOffset(0 - (itemsWidth - width));
									moveTo(currentOffset);
								}
							} else {
								moveTo(currentOffset);
							}
						}
					} else {
						moveTo(currentOffset);
					}

				} else if (touchOffset < 0) {
					if(currentIndex > 0 || (currentIndex <= 0 && long)) {

						if (long && graphItems[currentIndex][2] > 0) {

							graphItems[currentIndex][2] -= width;

							if (graphItems[currentIndex][2] >= 0) {
								setCurrentOffset(currentOffset + width);
								moveTo(currentOffset);
							} else {
								setCurrentOffset(currentOffset + (graphItems[currentIndex][2] + width));
								graphItems[currentIndex][2] = 0;
								moveTo(currentOffset);
							}
							
						}
						else {
							if(typeof(graphItems[currentIndex-1]) != 'undefined' ) {
								if (graphItems[currentIndex-1].length > 2) {
									possibleOffset = 0 - (itemsBeforeWidth - width);
									graphItems[currentIndex-1][2] = graphItems[currentIndex-1][0] - width;
								} else {
									possibleOffset = 0 - (itemsBeforeWidth - graphItems[currentIndex-1][0]/2) + width/2;
								}

								if(possibleOffset < 0) {
									setCurrentIndex(currentIndex-1);
									setCurrentOffset(possibleOffset);
									moveTo(currentOffset);
								} else {
									setCurrentIndex(0);
									setCurrentOffset(0);
									moveTo(currentOffset);
								}
							} else {
								moveTo(currentOffset);
							}
						}
					} else {
						moveTo(currentOffset);
					}
				}  else {
					if (long) {
						possibleOffset = 0 - itemsBeforeWidth;
					} else {
						possibleOffset = 0 - (itemsBeforeWidth + graphItems[currentIndex][0]/2)  + width/2;
					}

					if (possibleOffset >= 0) {
						setCurrentOffset(0);
						moveTo(currentOffset);
					} else if (itemsWidth + possibleOffset <= width) {
						setCurrentOffset(0 - (itemsWidth - width));
						moveTo(currentOffset);
					} else {
						setCurrentOffset(possibleOffset);
						moveTo(currentOffset);
					}
				}
			};
			
			function movePage() {
				var itemsWidth = 0;
				var pageCnt = 0;
				$.each(items, function(i){
					itemsWidth += this.offsetWidth;
				});
				
				pageCnt = Math.round(itemsWidth / width);
					
				if (touchOffset > 0) {
					if (pageCnt * width + currentOffset > width && currentPage < pageCnt - 1) {
						setCuttentPage(currentPage + 1);
						setCurrentOffset(currentPage * -width);
						moveTo(currentOffset);
					} else {
						moveTo(currentOffset);
					}
				} else if (touchOffset < 0) {
					if (currentPage > 0) {
						setCuttentPage(currentPage - 1);
						setCurrentOffset(currentPage * -width);
						moveTo(currentOffset);
					} else {
						setCurrentOffset(0);
						moveTo(currentOffset);
					}
				} else {
					setCurrentOffset(currentPage * -width);
					moveTo(currentOffset);
				}
			};

			function hideLink(name) {
				switch(name) {
					case "both":
						if(options.prevLink) $(options.prevLink, $this).addClass(options.hideClass);
						if(options.nextLink) $(options.nextLink, $this).addClass(options.hideClass);
						break;
					case "prev":
						if(options.prevLink) $(options.prevLink, $this).addClass(options.hideClass);
						break;
					case "next":
						if(options.nextLink) $(options.nextLink, $this).addClass(options.hideClass);
						break;
				}

				width = holder.width();
			}

			function showLink(name) {
				switch(name) {
					case "both":
						if(options.prevLink) $(options.prevLink, $this).removeClass(options.hideClass);
						if(options.nextLink) $(options.nextLink, $this).removeClass(options.hideClass);
						break;
					case "prev":
						if(options.prevLink) $(options.prevLink, $this).removeClass(options.hideClass);
						break;
					case "next":
						if(options.nextLink) $(options.nextLink, $this).removeClass(options.hideClass);
						break;
				}

				width = holder.width();
			}

			function moveShift() {
				var itemsWidth = 0;
				$.each(items, function(){
					itemsWidth += this.offsetWidth;
				});

				if (itemsWidth < width && !options.center) {return;}

				var shift = options.shift+'';
				var possibleOffset = 0;

				if(shift.indexOf('%') != -1) {
					shift = parseInt(width*options.shift.substr(0, options.shift.length-1)/100);
				} else {
					shift = parseInt(options.shift);
				}

				if (options.center && itemsWidth < width) {
					possibleOffset = width/2 - itemsWidth/2;
					setCurrentOffset(possibleOffset);
					moveTo(currentOffset);
				} else {
					if (touchOffset > 0) {
						possibleOffset = currentOffset - shift;

						if(itemsWidth + possibleOffset > width) {
							setCurrentOffset(possibleOffset);
							moveTo(currentOffset);
						} else {
							setCurrentOffset(0 - (itemsWidth - width));
							moveTo(currentOffset);
						}
					} else {

						possibleOffset = currentOffset + shift;
						if(possibleOffset < 0) {
							setCurrentOffset(possibleOffset);
							moveTo(currentOffset);
						} else {
							setCurrentOffset(0);
							moveTo(currentOffset);
						}
					}
				}
			};

			function moveNextOffset() {
				touchOffset = 1;
				moveShift();
			}

			function movePrevOffset() {
				touchOffset = -1;
				moveShift();
			}

			function debug(msg, param) {
				if (typeof(param) == 'undefined') {
					param = '';
				}
				if (options.debug) {
					var d = new Date();
					$('#console').prepend('<div class="debug-item"><strong>'+d.getMinutes()+':'+d.getSeconds()+'.'+d.getMilliseconds()+'</strong> '+ msg+' '+param+'</div>');
				}
			};

			function setCurrentIndex(index) {
				if (index != currentIndex) {
					hasChanges = true;
					previousIndex = currentIndex;
					currentIndex = index;

					if (options.mode == 'auto' && graphItems.length) {
						graphRealIndex = graphItems[currentIndex][1][0][0];
					} else {
						$(items).removeClass(options.activeClass);
						$(items[currentIndex]).addClass(options.activeClass);
					}
					debug('Setting up current index:', index);

				} else {
					hasChanges = true;
				}
				
				options.beforeIdxChangeFunc(previousIndex, currentIndex);
			};
			
			function setCuttentPage(index) {
				if (index != currentPage) {
					hasChanges = true;
					previousPage = currentPage;
					currentPage = index;
				} else {
					hasChanges = true;
				}
			};
			
			function setCurrentOffset(offset) {
				if (offset != currentOffset) {
					previousOffset = currentOffset;
					currentOffset = offset;
					debug('Setting current offset:', offset);
				}
			};

			function moveToIndex(index) {
				if (typeof(items[index]) != 'undefined') {
					setCurrentIndex(parseInt(index));
					touchOffset = 0;
					moveIndex();
				}
			}

			function moveNextIndex() {
				touchOffset = 1;
				moveIndex();
			};

			function movePrevIndex() {
				touchOffset = -1;
				moveIndex();
			};

			function moveNextAuto() {
				touchOffset = 1;
				moveAuto();
			};

			function movePrevAuto() {
				touchOffset = -1;
				moveAuto();
			};
			
			function moveNextPage() {
				touchOffset = 1;
				movePage();
			};
			
			function movePrevPage() {
				touchOffset = -1;
				movePage();
			};
			
			function moveTo(coord, now) {
				var delay = typeof(now) == 'undefined' ? options.duration : 0;

				if ($.isFunction(options.onChange) && hasChanges) {
					options.onChange(previousIndex, currentIndex);
				}

				if (!options.animation) {
					if (delay) {
						startAnimation();
						box.css({
							'margin-left': coord+'px'
						});
						endAnimation();
					}
					
				} else {
					startAnimation();
					var delayTransition = typeof(now) == 'undefined' ? options.duration/1000+'s' : '0s';

					if (cssTransitionsSupported) {
						box.css({
							'-webkit-transition-duration': delayTransition,
							'-moz-transition-duration': delayTransition,
							'transition-duration': delayTransition
						});
						
						if(has3D) {
							debug('CSS 3D Transition To:', coord);
							box.css({
								'-webkit-transform': 'translate3d('+coord+'px,0,0)',
								'transform': 'translate3d('+coord+'px,0,0)'
							});
						}else {
							debug('CSS Transition To:', coord);
							box.css({
								'-webkit-transform': 'translate('+coord+'px,0)',
								'-moz-transform': 'translate('+coord+'px,0)',
								'transform': 'translate('+coord+'px,0)'
							});
						}

					} else {
						debug('jQuery Animate To:', coord);
						if (box.filter(":animated").length > 0) {
							box.stop(true);
							if (typeof(now) == 'undefined')
								endAnimation();
						}
						
						box.stop(true).animate({
							'margin-left': coord+'px'
						},{
							queue: false,
							duration: delay,
							easing: options.animationEasign,
							complete: endAnimation
						});
					}
				}
				
				if (options.movePrevNextFlag) movePrevNextFlag = false;
			};

			function startAnimation() {
				box.addClass("moving");
				debug('Animation start', '');
			}
			
			function endAnimation() {
				box.removeClass("moving");
				debug('Animation end', '');
				
				if (tmpCurrentIdx != currentIndex) {
					options.afterIdxChangeFunc(tmpCurrentIdx, currentIndex);
					tmpCurrentIdx = currentIndex;
				}
			}

		});
		
		return this;
	};

	/*********************** jquery.tabs ***********************/
	$.fn.mtTabs = function(options){
		
		var options = $.extend({
			item: 'a',
			activeTabClass: 'selected',
			onStart: null
		}, options);

		var $this = $(this);
		
		this.each(function() {

			var $this = $(this);
			var items = $(options.item, $this);
			if (!items.length) return;

			 items.bind('click', function () {
				showTab($(this));
				return false;
			});

			if ($.isFunction(options.onStart)) options.onStart();

			items.filter(':first').click();

			 function showTab(link) {
				var tab = link.attr('href');
				items.each(function() {
					if (link.attr('href') != $(this).attr('href')) {
						$(this).parent().removeClass(options.activeTabClass);
					} else {
						$(this).parent().addClass(options.activeTabClass);
					}
					if ($(this).attr('href') != '#') {
						$($(this).attr('href')).hide();
					}
				});
				jQuery(tab).show();
			}
		});
		return this;
	};
})(jQuery);