(function($) {
	/*Slide 에 Tab기능 추가 */
	$.fn.lotteMSlide = function (options) {
		var opts = $.extend({
			tabSelector:"",
			contentSelector:"",
			holderSelector:"",
			box:"",
			prevLink:"",
			nextLink:"",
			activeClass:"on",
			disableClass:"disable",
			lockScroll:true,
			mode:"index",
			randomFlag:false,
			prodIndex:-1,
			pageIndex:-1
		}, options);
		
		return this.each(function () {
			var self = this,
				$self = $(this),
				currentTabIdx = 0,
				$tabs,
				tabSelectorFunc = function (beforeIdx, currentIdx) {},
				$contents = $(opts.contentSelector, this),
				$box = $(opts.box, this),
				$holder = $(opts.holderSelector, this),
				$prevLink = $(opts.prevLink, this),
				$nextLink = $(opts.nextLink, this),
				$slide = null,
				randomFlag = opts.randomFlag,
				prodIdx = opts.prodIndex,
				mode = opts.mode,
				disableClass = opts.disableClass,
				pageIndex = opts.pageIndex;
				
			function checkBtnEnable(current_idx) {
			
				if (mode == "index") {
					if (current_idx == 0) {
						if($contents.length <= 2){ //20130121 오른쪽탭 버그수정
							$prevLink.addClass(disableClass); 
							$nextLink.addClass(disableClass);
						}else{
							$prevLink.addClass(disableClass);
							$nextLink.removeClass(disableClass);
						}
					} else if (currentTabIdx == $contents.length - 1) {
						$nextLink.addClass(disableClass);
						$prevLink.removeClass(disableClass);
					} else {
						if(currentTabIdx == $contents.length - 2){ //20130121 : 오른쪽탭 버그수정
							$prevLink.removeClass(disableClass);
							$nextLink.addClass(disableClass);						
						}else{
							$prevLink.removeClass(disableClass);
							$nextLink.removeClass(disableClass);
						}
					}
				} else if ($slide != null) {
					var contentWrapWidth = 0;
					$contents.each(function () {
						contentWrapWidth += $(this).width();
					});
					
					if ($slide[0].getCurrentOffset() == 0) {						
						$prevLink.addClass(disableClass);
						$nextLink.removeClass(disableClass);
					} else if (contentWrapWidth - $holder.width() + $slide[0].getCurrentOffset() <= 0) {						
						$nextLink.addClass(disableClass);
						$prevLink.removeClass(disableClass);
					} else {						
						$prevLink.removeClass(disableClass);
						$nextLink.removeClass(disableClass);
					}
				}
			}
			
			if (mode == "index") {
				tabSelectorFunc = function (beforeIdx, currentIdx) { 					
				
					currentTabIdx = currentIdx; 
					checkBtnEnable(currentTabIdx); 
				};
			} else {
				tabSelectorFunc = function () {
					if ($slide == null)
						return;
						
					if ($slide[0].getCurrentOffset() == 0) {
						$prevLink.addClass(disableClass);
						$nextLink.removeClass(disableClass);
					} else if (Math.abs($slide[0].getCurrentOffset()) == $holder.width()) {
						$prevLink.removeClass(disableClass);
						$nextLink.addClass(disableClass);
					} else {
						$prevLink.removeClass(disableClass);
						$nextLink.removeClass(disableClass);
					}
				};
			}
				
			if (opts.tabSelector != "") {
				$tabs = $(opts.tabSelector, this);
				tabSelectorFunc = function (beforeIdx, currentIdx) {
					
					$tabs.eq(beforeIdx).removeClass(opts.activeClass);
					$tabs.eq(currentIdx).addClass(opts.activeClass);
					
					/*20120918 태블릿모드에서 버그수정*/
					currentTabIdx = currentIdx;					
					if($(document).width() > 683){
						if(currentTabIdx == ($contents.length - 1) && $holder.attr("id") != "mainRecomFlick"){
							currentTabIdx -= 1;
						}
					}					
					checkBtnEnable(currentTabIdx);

					if($holder.attr("id") == "mainRecomFlick"){
						//왼쪽의 경계표시 제거						
						if(currentIdx > 0){
							$("#carouselSet0914 > #carouselTab > li:nth-child(" + (currentIdx - 1) +") > .off_title > .tline").hide();
						}
						if(beforeIdx > 0){
							$("#carouselSet0914 > #carouselTab > li:nth-child(" + (beforeIdx - 1) +") > .off_title > .tline").show();
						}						
						if((currentIdx%2) == 0){
							$("#carouselSet0914 >  #carouselTab > .menua").show();
							$("#carouselSet0914 > #carouselTab > .menub").hide();
						}else{
							$("#carouselSet0914 > #carouselTab > .menub").show();
							$("#carouselSet0914 > #carouselTab > .menua").hide();
						}
						
					}
					
				}
			}
			
			$slide = $self.touchSlider({
				item:opts.contentSelector,
				holder:opts.holderSelector,
				box:opts.box,
				prevLink:opts.prevLink,
				nextLink:opts.nextLink,
				onChange:tabSelectorFunc,
				activeClass:opts.activeClass,
				lockScroll:opts.lockScroll,
				mode:opts.mode
			});
			checkBtnEnable(0);
			
			if (prodIdx > -1) {
				$slide[0].moveIdx(prodIdx, true);
				$(window).bind("load", function () {
					
					$slide[0].moveIdx(prodIdx, true);
				});
			}
			
			if (pageIndex > -1) {
				$slide[0].setPageIndex(pageIndex);
			}
			
			$(window).bind("resize", function () {
				if (mode != "page")
					$slide[0].moveIdx(currentTabIdx, true);
				else
					$slide[0].setPageIndex(pageIndex);
			});
			
			if (opts.tabSelector != "") {
				$tabs.click(function () {
					if (typeof($slide[0].moveTo != 'undefined')){						
						/*20120917 오늘의 모바일 특가용 탭 셀렉터*/
						
						var goIndex = $(this).index();
						if($holder.attr("id") == "mainRecomFlick"){
							if((goIndex%2) != 0){
								goIndex -= 1;
							}
						}
						
						$slide[0].moveIdx(goIndex);		
					}
				});
			}
			
		});
	};
})(jQuery);