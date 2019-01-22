$(function(){

	//AddClass 함수
	function addClassFunc(selElem){
		$(selElem).addClass('on').siblings('.on').removeClass('on');
	};

	//main 대카  텝 클릭
	$('.big_cate li a').on('click',function(){
		var menuIIdx = $(this).parent().index();
		addClassFunc($(this).parent());
		addClassFunc($('.mid_cate > ul').eq(menuIIdx));
		addClassFunc($('.big_cate_all li').eq(menuIIdx));
		moveMenuTwo(menuIIdx);
		$('.big_cate_all .open_btn').removeClass('on');
	});

	//main 대카 카테고리 더보기
	$('.big_cate_all .open_btn').on('click',function(){
		$(this).toggleClass('on');
	});

	$('.big_cate_all li a').on('click',function(){
		var menuIIdx = $(this).parent().index();
		moveMenuTwo(menuIIdx);
		$(this).parents('.big_cate_all').find('.open_btn').removeClass('on');
		addClassFunc($(this).parent());
		addClassFunc($('.big_cate li').eq(menuIIdx));
		addClassFunc($('.mid_cate > ul').eq(menuIIdx));
	});

	//main 중카 더보기
	$('.mid_cate li a').on('click',function(){
		addClassFunc($(this).parent());
	});

	//sub 카테고리 텝 클릭
	$('.sub_cate .menu a').on('click',function(){
		var menuIIdx = $(this).parent().index();

		if($(this).parent('.on').length !== 1){
			$('.sub_cate .box_btn').show();
		};

		addClassFunc($(this).parent());
		addClassFunc($('.sub_cate .cotn_cate>div').eq(menuIIdx));
	});

	//sub 카테고리 텝 클릭
	$('.sub_cate .category a').on('click',function(){
		addClassFunc($(this).parent());
	});

	//닫기버튼 클릭시
	$('.box_btn .close button').on('click',function(){
		$('.sub_cate .box_btn').hide();
		$('.sub_cate .on').removeClass('on');

	});



	var menu = $('.big_cate')[0] , 
	openBtn = document.querySelector( 'button.open_btn' ) , 
	openBtnW = openBtn.offsetWidth ; 


	menu.addEventListener( 'touchstart' , menuSwipeHandler ) ;
	window.addEventListener( 'orientationchange' , menuOrientationChangeHandler ) ;
	
	function menuSwipeHandler (e) {
		if ( menu.classList.contains( 'move' ) ) return ;

		var m = e.changedTouches[0] ; 
		switch(e.type) {
			case 'touchstart' : 
			rect = menu.getBoundingClientRect() ;
			startX = m.pageX - rect.left ; 
			oldX = m.pageX ;  
			menu.addEventListener( 'touchmove' , menuSwipeHandler ) ; 
			menu.addEventListener( 'touchend' , menuSwipeHandler ) ;
			break ;
			case 'touchmove' :
			e.preventDefault() ;
			rect = menu.getBoundingClientRect() ;
			
			if ( oldX < m.pageX ) { 
				dir = 'right' ; 
			} else if ( oldX >= m.pageX ) {
				dir = 'left' ; 
			}
			
			addX = m.pageX- startX ;
			
			menu.style[transformCss]  = "translateX(" + (addX) + "px) translateZ(0px)";
			oldX = m.pageX ;
			
			break ;
			case 'touchend' :  
			var endX = m.pageX - rect.left ;
			rect = menu.getBoundingClientRect() ;
			
			menu.removeEventListener( 'touchstart' , menuSwipeHandler ) ; 
			menu.removeEventListener( 'touchmove' , menuSwipeHandler ) ; 
			menu.removeEventListener( 'touchend' , menuSwipeHandler ) ;
			

			if ( menu.offsetWidth <= window.innerWidth - openBtnW ) {
				menu.classList.add( 'move' ) ; 
				menu.style[transformCss]  = "translateX(" + (0) + "px) translateZ(0px)"; 

				setTimeout(function(){
					menu.classList.remove( 'move' ) ;
					menu.addEventListener( 'touchstart' , menuSwipeHandler ) ;
				} , 350 ) ; 
			} else {
				
				switch( dir ) {
					case 'left' :
					var w1 = Math.max( window.innerWidth , menu.offsetWidth ) ;
					var w2 = Math.min( window.innerWidth , menu.offsetWidth ) ;

					if ( Math.abs(rect.left) >= Math.abs(w1 - w2 - openBtnW) ) {
						menu.classList.add( 'move' ) ;
						menu.style[transformCss]  = "translateX(" + (window.innerWidth - menu.offsetWidth - openBtnW) + "px) translateZ(0px)";
						setTimeout(function(){
							menu.classList.remove( 'move' ) ; 
							menu.addEventListener( 'touchstart' , menuSwipeHandler ) ; 
						} , 350 ) ; 
					} else {
						if ( rect.left > 0 ) {
							menu.classList.add( 'move' ) ;
							menu.style[transformCss]  = "translateX(" + (0) + "px) translateZ(0px)";
							setTimeout(function(){
								menu.classList.remove( 'move' ) ;
								menu.addEventListener( 'touchstart' , menuSwipeHandler ) ;
							} , 350 ) ;                                                 
						} else {
							menu.addEventListener( 'touchstart' , menuSwipeHandler ) ;
						}
					}
					break ;
					default : /*right*/
					if ( rect.left > 0 ) { 
						menu.classList.add( 'move' ) ;
						menu.style[transformCss]  = "translateX(" + (0) + "px) translateZ(0px)";
						setTimeout(function(){
							menu.classList.remove( 'move' ) ;
							menu.addEventListener( 'touchstart' , menuSwipeHandler ) ;
						} , 350 ) ;
					} else {
						if ( rect.left < 0 && menu.offsetWidth - Math.abs(rect.left) < window.innerWidth ) {
							
							menu.classList.add( 'move' ) ;
							menu.style[transformCss]  = "translateX(" + (window.innerWidth - menu.offsetWidth - openBtnW) + "px) translateZ(0px)";
							setTimeout(function(){
								menu.classList.remove( 'move' ) ;
								menu.addEventListener( 'touchstart' , menuSwipeHandler ) ;
							} , 350 ) ; 
						} else {
							menu.addEventListener( 'touchstart' , menuSwipeHandler ) ;
						}
					}
					break ;
				} /*end of switch*/
			} /*end of if*/
			break ;
		} /*end of switch*/
	} /*end of menuSwipeHandler*/

	function moveMenuTwo (indexB) {
		var menu = document.querySelector( '.box_cate .big_cate' ) ,
		lis = document.querySelectorAll( '.box_cate .big_cate li' ) ,
		openBtn = document.querySelector( '.big_cate_all .open_btn' ) , 
		winW = window.innerWidth ,
		menuW = 0 , 
		reW = 0 , 
		li , 
		idx = indexB ; 

		[].forEach.call( lis , function ( li , i ){
			menuW += li.offsetWidth ;
		}) ;

		li = lis[idx] ;

		/* 서브메뉴 중앙 정령 자동화, 서브메뉴 길이가 브라우저 길이보다 작을 경우는 제외 */ 
		if ( menuW < winW ) return ;
		if ( li.offsetLeft > winW/2 ) {

			if ( li.offsetLeft >= menuW - winW / 2 - openBtn.offsetWidth ) {
				reW = menuW - winW + openBtn.offsetWidth ; 
			} else {
				reW = li.offsetLeft - winW/2 + (li.offsetWidth/2) ;
			}
			menu.classList.add( 'move' ) ; 
			menu.style[transformCss]  = "translateX(" + -(reW) + "px) translateZ(0px)";

			setTimeout(function(){
				menu.classList.remove( 'move' ) ;
			} , 350 ) ; 
		} else if ( li.offsetLeft <= winW/2 ) {
			menu.style[transformCss]  = "translateX(" + -(0) + "px) translateZ(0px)"; 
		}
	};
	function menuOrientationChangeHandler () {
		switch( window.orientation ) {
			case -90 :
			case 90 :
			menu.style[transformCss]  = "translateX(" + (0) + "px) translateZ(0px)";
			reSetSize() ; 
			break ; 
			default :
			reSetSize() ; 
			break ; 
		}
	};

	function reSetSize () {
		setTimeout(function(){
			winW = window.innerWidth ; 
			remainedW = winW - menuW - openBtnW ; 
		} , 500 )
	};
	setTimeout(function(){
		ImgSlide('div.main_slide');
	})
	
})