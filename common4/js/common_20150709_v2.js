/*
* lotte.com moblie common
* 2014.04.16 _khv
*/

// url 파라미터 추출하기
$.extend({
    getUrlVars : function(){
        var vars = [], hash;
        var hashes = window.location.href.slice( window.location.href.indexOf('?') + 1 ).split( '&' );
        for( var i = 0; i < hashes.length; i++ ) {
            hash = hashes[i].split( '=' );
            vars.push( hash[0] );
            vars[ hash[0] ] = hash[1];
        }
        return vars;
    },
    getUrlVar : function( name ) {
        return $.getUrlVars()[ name ];
    }
});

$.redirect = function(url, params){
	url = url || window.location.href || '';
	url = url.match(/\?/) ? url : url + '?';
	
	for(var key in params){
		var re = RegExp(';?' + key + '=?[^&;]*', 'g');
		url = url.replace(re, '');
		url += '&' + key + '=' + params[key];
	}
	
	url = url.replace(/[;&]$/, '');
	url = url.replace(/\?[;&]/, '?');
	url = url.replace(/[;&]{2}/g, '&');
	
	window.location.replace(url);
}

// 상단 메인 메뉴 사이즈, 여백 셋팅
/*
var mainTopTab = function () {
	var _$cont = $('#head_main' ),
		_$menu = _$cont.find( 'li' );

	var _contW = _$cont.find( 'ul' ).width(),
		_menuW = 0,
		_gap;

	var i;
	for ( i=0; i<_$menu.length; ++i ) {
		_menuW += _$cont.find( 'li' ).eq(i).width();
	}
//console.log( _menuW )
	_gap = parseInt( (_contW-_menuW)/4 );
	
	for ( i=0; i<_$menu.length-1; ++i ) {
		//_$cont.find( 'li' ).eq(i).css( 'padding-right', _gap + 'px' );
	}
}
$( document ).ready( function () {
	mainTopTab();
	$(window).resize( function () {
		mainTopTab();
	});
});
*/
// 페이지 내 탭스타일
var pageTab = function () {

	var _$tab = $( '.list-tab' ),
		_$list = $( '.sub-tab' );

	if(document.URL.indexOf('/product/m/product_view') > -1 || document.URL.indexOf('/product/m/product_wine_view') > -1){
		//원앤원에서 상품상세가 디폴트
		_$tab.eq(1).addClass( 'on' );
		_$list.eq(1).css( 'display', 'block' );
	}else{
		_$tab.eq(0).addClass( 'on' );
		_$list.eq(0).css( 'display', 'block' ); // 초기탭 설정
	}
	_$tab.on( 'click', 'a', function () {
		var idx = $(this).parent().index();

		if ( $(this).attr( 'href' ).substr(0,1) == '#' ) {
			_$tab.removeClass( 'on' ).eq( idx ).addClass( 'on' );
			_$list.css( 'display', 'none' ).eq( idx ).css( 'display', 'block' );
		}
		return false;
	});
}

// 서브 페이지 상품 상세 옵션 레이어 
var orderOption = function () {
	var _$btn = $( 'a.y_btn' );

	_$btn.on( 'click', function () {
		var target = $(this).closest( '.group' ).find( 'div.option_layer' );
		
		if ( $(this).hasClass( 'top' ) ) {
			$(this).removeClass( 'top' );
			$(this).addClass( 'btm' );
			target.css( 'display', 'none' );
		} else {
			$(this).removeClass( 'btm' );
			$(this).addClass( 'top' );
			target.css( 'display', 'block' );
		}

		target.on( 'click', 'a.a_btn.col01', function () {
			$(this).closest( '.group' ).find( 'a.y_btn' ).removeClass( 'top' );
			$(this).closest( '.group' ).find( 'a.y_btn' ).addClass( 'btm' );
			target.css( 'display', 'none' );
		});
	});
}

// 상품목록 header selectBox
var prdListSelect = function ( cls ) {
	/*
	&sort
		10 - 신상품
		11 - 판매인기
		12 - 낮은가격
		13 - 높은가격
		14 - 상품평
	&imgListGbn
		L - 리스트형(1개)
		D - 썸네일형(2개)
		B - 큰이미지
	*/
	var _$cont = $( cls ),
		_$product = _$cont.find( '.s_box01' ),
		_$detail = _$cont.find( '.b_box01' ),
		_$sort = _$cont.find( '.s_box03' ),
		_$prdList = _$product.find( 'ul.s_list01' ),
		_$detailList = _$detail.find( 'div.b_list01' ),
		_$sortList = _$sort.find( 'ul.s_list03' );

	var _tab;

	//

	var bySort = $.getUrlVar('sort'),
		byView = $.getUrlVar('imgListGbn');

	initSort();

	_$prdList.css( 'width', _$product.width() );
	_$sortList.css( 'width', _$sort.width() );

	_$product.on( 'click', 'div.tl a', function () {
		listHandler( 0 );
		return false;
	});
	_$detail.on( 'click', 'div.tl a', function () {
		listHandler( 1 );
		return false;
	});
	_$sort.on( 'click', 'div.tl a', function () {
		listHandler( 2 );
		
		//리뉴얼 이벤트
		renewalLPEvent();
		
		return false;
	});
	
	_$prdList.on( 'click', 'li', function () {
		listHandler( 0 );
	});
	_$detailList.on( 'click', 'a.col01', function () {
		searchSubmit();
	});
	_$detailList.on( 'click', 'a.col02', function () {
		detailInit( 1 );
	});
	_$detailList.on( 'click', 'a.d_btn' , function () {
		_$detailList.find( 'a.d_btn' ).removeClass( 'on' );
		$(this).addClass( 'on' );
	});
	_$sortList.on( 'click', 'li', function () {
		listHandler( 2 );
	});

	//

	function initSort () {
		var txt = _$prdList.find( 'li' ).eq( bySort-10 ).text();
		if ( txt ) _$product.find( 'div.tl a' ).html( txt );
		switch ( byView ) {
			case 'L' :
				_$sort.find( 'div.tl span' ).attr( 'class', 'line01' );
				break;
			case 'D' :
				_$sort.find( 'div.tl span' ).attr( 'class', 'line02' );
				break;
			case 'B' :
				_$sort.find( 'div.tl span' ).attr( 'class', 'line03' );
				break;
		}
	}

	function listHandler ( idx ) {
		_tab = idx;

		switch ( _tab ) {
			case 0 :
				if ( _$product.hasClass( 'on' ) ) {
					_$product.removeClass( 'on' );
					_$prdList.css( 'display', 'none' );
				} else {
					_$product.addClass( 'on' );
					_$prdList.css( 'display', 'block' );
				}
				_$detail.removeClass( 'on' );
				_$sort.removeClass( 'on' );
				_$detailList.css( 'display', 'none' );
				_$sortList.css( 'display', 'none' );
				break;
			case 1 :
				if ( _$detail.hasClass( 'on' ) ) {
					_$detail.removeClass( 'on' );
					_$detailList.css( 'display', 'none' );
				} else {
					_$detail.addClass( 'on' );
					_$detailList.css( 'display', 'block' );
				}
				_$product.removeClass( 'on' );
				_$sort.removeClass( 'on' );
				_$prdList.css( 'display', 'none' );
				_$sortList.css( 'display', 'none' );

				break;
			case 2 :
				if ( _$sort.hasClass( 'on' ) ) {
					_$sort.removeClass( 'on' );
					_$sortList.css( 'display', 'none' );
				} else {
					_$sort.addClass( 'on' );
					_$sortList.css( 'display', 'block' );
				}
				_$product.removeClass( 'on' );
				_$detail.removeClass( 'on' );
				_$prdList.css( 'display', 'none' );
				_$detailList.css( 'display', 'none' );
				break;
		}
		var _$list = $( '.product_list01' ).find( 'li' );
		
		for( var i=0; i<_$list.length; ++i ) {
			$B( _$list[i] ).transition( 'left:0px', 'left 0.2s ease' );
		}
	}

	function searchSubmit () {
		listHandler( 1 );
	}

	function detailInit () {
		_$detailList.find( 'option' ).attr( 'selected', false );
		_$detailList.find( 'input.input01' ).val( '' );
		_$detailList.find( 'input.check01' ).attr( 'checked', false );
		return false;
	}
}

// 서브 페이지 내 flick banner
var flickBanner = function ( cls, arrow, bullet, btnAlign ) {

	var WIDTH = $( cls ).closest( 'section' ).width();//$(window).width();
	
	var _$cont = $( cls ),
		_$imgWrap = _$cont.find( 'ul.photo' ),
		_$imgList = _$imgWrap.find( '> li' ),
		_$prev,
		_$next,
		_$bulletWrap;

	var _len = _$imgList.length,
		_oldIdx,
		_crtIdx = 0;

	//====================== initialize ==========================//

	// bullets setting
	if ( bullet ) {
		_$bulletWrap = _$cont.find( 'div.page ul' );

		for ( i=0; i < _len; ++i ) {
			var html = '<li><span>' + (i+1) + '</span></li>';
			_$bulletWrap.append( html );
		}

		var bulletWidth = 12; // _$bulletWrap.find( 'li' ).outerWidth();
		_$bulletWrap.css( 'width', bulletWidth*_len + 'px' );

		_$cont.find( 'div.btn02' ).css( 'left', _$bulletWrap.width()/2 + 20 );
	}

	// arrow button setting
	if ( arrow ) {
		_$prev = _$cont.find( 'span.prev a' );
		_$next = _$cont.find( 'span.next a' );

		_$prev.on( 'click', prevHandler );
		_$next.on( 'click', nextHandler );
	}

	init();
	
	if ( _len > 1 ) {
		var gesture = new $B.mobile.Gesture( _$cont[0], 'horizontal', { onSwipe: swipeHandler } );
		gesture.sensitivity( 0.5 );
	}

	// current banner view
	_$imgList.eq( _crtIdx ).css( 'display', 'block' );
	_$bulletWrap.find( 'span' ).eq( _crtIdx ).addClass( 'on' );

	$( window ).resize( function () {
		WIDTH = $( window ).width();
		init();
	});

	//====================== private methods ==========================//

	function init () {
		var i;
		for ( i=0; i < _len; ++i ) {
			_$imgWrap.find( '> li' ).eq(i).css( 'width', WIDTH + 'px' );
		}

		// arrow button setting
		if ( arrow ) {
			// arrow button align
			if ( btnAlign == 'bottom' ) {
				_$prev.parent().css( 'left', WIDTH/2 - _$bulletWrap.width()/2 - _$prev.width() - 10 + 'px' );
				_$next.parent().css( 'left', WIDTH/2 + _$bulletWrap.width()/2 + 10 + 'px' );
			}

		}
	}

	function swipeHandler (e) {
		switch ( e.swipe ) {
			case 'left' : nextHandler();
				break;
			case 'right' : prevHandler();
				break;
		}
	}

	function prevHandler () {
		if ( arrow ) {
			_$prev.off( 'click' );
			_$prev.on( 'click', function () { return false; } );
		}
		gesture.disable();

		_oldIdx = _crtIdx;

		if ( _crtIdx == 0 ) {
			_crtIdx = _len - 1;
		} else {
			_crtIdx--;
		}

		prevMoveHandler();
		setBullet();

		return false;
	}

	function nextHandler () {
		if ( arrow ) {
			_$next.off( 'click' );
			_$next.on( 'click', function () { return false; } );
		}
		gesture.disable();

		_oldIdx = _crtIdx;

		if ( _crtIdx == _len - 1 ) {
			_crtIdx = 0;
		} else {
			_crtIdx++;
		}

		nextMoveHandler();
		setBullet();

		return false;
	}

	function prevMoveHandler () {
		_$imgWrap.css( 'width', WIDTH*2 + 'px' );
		_$imgWrap.find( '> li' ).eq( _len-1 ).css( 'display', 'block' );

		var $clone;
		$clone = _$imgWrap.find( '> li' ).eq( _len-1 ).clone();
		$clone.css( 'left', -WIDTH + 'px' );

		_$imgWrap.find( '> li' ).eq( _len-1 ).remove();
		_$imgWrap.find( '> li' ).eq(0).css( 'left', -WIDTH + 'px' );
		_$imgWrap.prepend( $clone );
		
		$B( _$imgWrap[0] ).transition( 'left:' + WIDTH + 'px', 'left 0.5s ease', { onTransitionEnd : function (e) {
			$B( _$imgWrap[0] ).transition( 'none' );

			_$imgWrap.css({ 'left' : 0, 'width' : WIDTH + 'px' });
			
			_$imgWrap.find( '> li' ).eq(0).css({ 'left' : 0 });
			_$imgWrap.find( '> li' ).eq(1).css({ 'display' : 'none' });

			if ( arrow ) _$prev.on( 'click', prevHandler );
			gesture.enable();
		} });
		
		return false;
	}

	function nextMoveHandler () {
		_$imgWrap.css( 'width', WIDTH*2 + 'px' );
		_$imgWrap.find( '> li' ).eq(1).css({ 'display' : 'block', 'left' : 0 });

		var $clone;
		$clone = _$imgWrap.find( '> li' ).eq(0).clone();
		
		$B( _$imgWrap[0] ).transition( 'left:' + (-WIDTH) + 'px', 'left 0.3s ease', { onTransitionEnd : function (e) {
			$B( _$imgWrap[0] ).transition( 'none' );
			
			_$imgWrap.css({ 'left' : 0, 'width' : WIDTH + 'px' });
			_$imgWrap.append( $clone );
			_$imgWrap.find( '> li' ).eq(0).remove();
			$clone.hide();

			if ( arrow ) _$next.on( 'click', nextHandler );
			gesture.enable();
		} });
		
		return false;
	}

	function setBullet () {
		_$bulletWrap.find( 'span' ).eq( _oldIdx ).removeClass( 'on' );
		_$bulletWrap.find( 'span' ).eq( _crtIdx ).addClass( 'on' );
	}
}

// 서브 페이지 내 flick banner with Timer
var flickTimerBanner = function ( cls, arrow, bullet, btnAlign, time ) {

	var WIDTH = $( cls ).closest( 'section' ).width();//$(window).width();
	
	var _$cont = $( cls ),
		_$imgWrap = _$cont.find( 'ul.photo' ),
		_$imgList = _$imgWrap.find( '> li' ),
		_$prev,
		_$next,
		_$bulletWrap;

	var _len = _$imgList.length,
		_oldIdx,
		_crtIdx = 0;

	var _time = time*1000,
		_timer = setTimeout( timerHandler, _time );

	//====================== initialize ==========================//

	// bullets setting
	if ( bullet ) {
		_$bulletWrap = _$cont.find( 'div.page ul' );

		for ( i=0; i < _len; ++i ) {
			var html = '<li><span>' + (i+1) + '</span></li>';
			_$bulletWrap.append( html );
		}

		var bulletWidth = 12; // _$bulletWrap.find( 'li' ).outerWidth();
		_$bulletWrap.css( 'width', bulletWidth*_len + 'px' );

		_$cont.find( 'div.btn02' ).css( 'left', _$bulletWrap.width()/2 + 20 );
	}

	// arrow button setting
	if ( arrow ) {
		_$prev = _$cont.find( 'span.prev a' );
		_$next = _$cont.find( 'span.next a' );

		_$prev.on( 'click', prevHandler );
		_$next.on( 'click', nextHandler );
	}

	init();
	
	if ( _len > 1 ) {
		var gesture = new $B.mobile.Gesture( _$cont[0], 'horizontal', { onSwipe: swipeHandler } );
		gesture.sensitivity( 0.5 );
	}

	// current banner view
	_$imgList.eq( _crtIdx ).css( 'display', 'block' );
	_$bulletWrap.find( 'span' ).eq( _crtIdx ).addClass( 'on' );

	$( window ).resize( function () {
		WIDTH = $( window ).width();
		init();
	});

	//====================== private methods ==========================//

	function init () {
		var i;
		for ( i=0; i < _len; ++i ) {
			_$imgWrap.find( '> li' ).eq(i).css( 'width', WIDTH + 'px' );
		}

		// arrow button setting
		if ( arrow ) {
			// arrow button align
			if ( btnAlign == 'bottom' ) {
				_$prev.parent().css( 'left', WIDTH/2 - _$bulletWrap.width()/2 - _$prev.width() - 10 + 'px' );
				_$next.parent().css( 'left', WIDTH/2 + _$bulletWrap.width()/2 + 10 + 'px' );
			}

		}
	}

	function swipeHandler (e) {
		clearTimeout( _timer );

		switch ( e.swipe ) {
			case 'left' : nextHandler();
				break;
			case 'right' : prevHandler();
				break;
		}
	}

	function prevHandler () {
		if ( arrow ) {
			_$prev.off( 'click' );
			_$prev.on( 'click', function () { return false; } );
		}
		gesture.disable();

		_oldIdx = _crtIdx;

		if ( _crtIdx == 0 ) {
			_crtIdx = _len - 1;
		} else {
			_crtIdx--;
		}

		prevMoveHandler();
		setBullet();

		return false;
	}

	function nextHandler () {
		if ( arrow ) {
			_$next.off( 'click' );
			_$next.on( 'click', function () { return false; } );
		}
		gesture.disable();

		_oldIdx = _crtIdx;

		if ( _crtIdx == _len - 1 ) {
			_crtIdx = 0;
		} else {
			_crtIdx++;
		}

		nextMoveHandler();
		setBullet();

		return false;
	}

	function prevMoveHandler () {
		_$imgWrap.css( 'width', WIDTH*2 + 'px' );
		_$imgWrap.find( '> li' ).eq( _len-1 ).css( 'display', 'block' );

		var $clone;
		$clone = _$imgWrap.find( '> li' ).eq( _len-1 ).clone();
		$clone.css( 'left', -WIDTH + 'px' );

		_$imgWrap.find( '> li' ).eq( _len-1 ).remove();
		_$imgWrap.find( '> li' ).eq(0).css( 'left', -WIDTH + 'px' );
		_$imgWrap.prepend( $clone );

		$B( _$imgWrap[0] ).transition( 'left:' + WIDTH + 'px', 'left 0.5s ease', { onTransitionEnd : function (e) {
			$B( _$imgWrap[0] ).transition( 'none' );

			_$imgWrap.css({ 'left' : 0, 'width' : WIDTH + 'px' });
			
			_$imgWrap.find( '> li' ).eq(0).css({ 'left' : 0 });
			_$imgWrap.find( '> li' ).eq(1).css({ 'display' : 'none' });

			if ( arrow ) _$prev.on( 'click', prevHandler );
			gesture.enable();
		} });

		_timer = setTimeout( timerHandler, _time );

		return false;
	}

	function nextMoveHandler () {
		_$imgWrap.css( 'width', WIDTH*2 + 'px' );
		_$imgWrap.find( '> li' ).eq(1).css({ 'display' : 'block', 'left' : 0 });

		var $clone;
		$clone = _$imgWrap.find( '> li' ).eq(0).clone();

		$B( _$imgWrap[0] ).transition( 'left:' + (-WIDTH) + 'px', 'left 0.3s ease', { onTransitionEnd : function (e) {
			$B( _$imgWrap[0] ).transition( 'none' );
			
			_$imgWrap.css({ 'left' : 0, 'width' : WIDTH + 'px' });

			_$imgWrap.append( $clone );
			_$imgWrap.find( '> li' ).eq(0).remove();
			$clone.hide();

			if ( arrow ) _$next.on( 'click', nextHandler );
			gesture.enable();
		} });

		_timer = setTimeout( timerHandler, _time );
		
		return false;
	}

	function setBullet () {
		_$bulletWrap.find( 'span' ).eq( _oldIdx ).removeClass( 'on' );
		_$bulletWrap.find( 'span' ).eq( _crtIdx ).addClass( 'on' );
	}

	function timerHandler () {
		clearTimeout( _timer );
		nextHandler();
	}
}

// 리스트페이지 '이거어때' flick
var listFlick = function ( target ) {
	var _$cont = $( target ),
		_$list = _$cont.find( 'li' ),
		_$btn = _$list.find( 'div.info a' );

	var _target;

	var _$option = $( '.list_header' ),
		_$product = _$option.find( '.s_box01' ),
		_$detail = _$option.find( '.b_box01' ),
		_$sort = _$option.find( '.s_box03' ),
		_$prdList = _$product.find( 'ul.s_list01' ),
		_$detailList = _$detail.find( 'div.b_list01' ),
		_$sortList = _$sort.find( 'ul.s_list03' );

	//====================== initialize ==========================//

	// swipe
	var gesture = new $B.mobile.Gesture( _$cont[0], 'horizontal', { onSwipe: swipeHandler } );
	gesture.sensitivity( 0.5 );

	_$btn.on( 'click', function () {
		setRight();
		return false;
	});

	_$list.on( 'touchstart', function () {
		_target = this;
	});

	//====================== private methods ==========================//

	function swipeHandler (e) {
		renewalLPEvent();
		
		_$cont.find( 'li' ).css( 'left', 0 + 'px' );
		switch ( e.swipe  ) {
			case 'left' : setLeft();
				break;
			case 'right' : setRight();
				break;
		}
		_$product.removeClass( 'on' );
		_$detail.removeClass( 'on' );
		_$sort.removeClass( 'on' );
		_$prdList.css( 'display', 'none' );
		_$detailList.css( 'display', 'none' );
		_$sortList.css( 'display', 'none' );
	}

	function setRight () {
		$B( _target ).transition( 'left:0px', 'left 0.2s ease' );
	}

	function setLeft () {
		$B( _target ).transition( 'left:' + (-80) + 'px', 'left 0.2s ease' );
	}
}

var layerAjax = function ( url, targetId ) {
	$( '#cover' ).css({ 'display' : 'block', 'height' : '100%', 'top' : '0' });
	// load content ( string )
	$.ajax ({
		type : 'POST',
		cache : false,
		url : url,	//**** 컨텐츠1 파일 경로 ( ex: /content/content.jsp ) ****//
		dataType : 'html',
		async : true, 
		beforeSend : function () {
			if ( targetId == '#calculator' ) {
				$( '#calLoading' ).css( 'display', 'block' );
				$( targetId ).css( 'top', $(document).scrollTop() );
			} else {
				$( '#loading' ).css( 'display', 'block' );
			}
		},
		success : ajaxHandler,
		error : ajaxHandler,
		complete : function () {
			if ( targetId == '#calculator' ) {
				$( '#calLoading' ).css( 'display', 'none' );
			} else {
				$( '#loading' ).css( 'display', 'none' );
				if ( targetId != '#prd_option' ) {
					$(document).scrollTop( 0, 1 );
				}
			}
		}
	});
/*
	if ( $B.ua.IPHONE ) {
		var gAxis = new $B.mobile.GestureAxis( targetId, {
			onAxis: function (e) {
			}
		});
	}
*/
	$( targetId ).css( 'display', 'block' );

	function ajaxHandler ( args, status ) {
		switch ( status ) {
			case 'success' :
				$( targetId ).html( args ).on( 'click', 'p.close a', optionClose );
				break;
			case 'error' :
				alert( 'content 데이터를 불러오지 못했습니다.' );
				break;
		}
	}

	function optionClose () {
		$( '#cover' ).css({ 'display' : 'none' });
		$( targetId ).html('').css( 'display', 'none' );
		return false;
	}
}

// 입력폼
jQuery(function($){
	var overlapLabel = $('.form').find('>:text,>:password,>textarea').prev('label');
	var overlapInput = overlapLabel.next(':text,:password,textarea');
	overlapLabel.css({'position':'absolute','top':'10px','left':'5px'}).parent().css('position','relative');
	overlapInput
		.focus(function(){
			$(this).prev(overlapLabel).css('visibility','hidden');
		})
		.blur(function(){
			if($(this).val() == ''){
				$(this).prev(overlapLabel).css('visibility','visible');
			} else {
				$(this).prev(overlapLabel).css('visibility','hidden');
			}
		})
		.change(function(){
			if($(this).val() == ''){
				$(this).prev(overlapLabel).css('visibility','visible');
			} else {
				$(this).prev(overlapLabel).css('visibility','hidden');
			}
		})
		.blur();
});
// 중복쿠폰
var doubleCoupon = function () {
	var _$cont = $( 'div.coupon_layer' ),
		_$cover = $( '#cover' );

	_$cont.css({ 'top' : $(window).height()/2 - _$cont.height()/2 + 'px', 'display' : 'block' });
	
	//_$cover.css({ 'top' : 0, 'height' : 100 + '%', 'display' : 'block' });

	_$cont.on( 'click', '.close a', function () {
		_$cover.css({ 'height' : '', 'display' : 'none' });
		_$cont.css( 'display', 'none' );
		return false;
	});
}
//페이지 TOP 버튼
$(window).scroll(function(){
	if($(window).scrollTop() > 100 ){
		$("div.btn_top, div.btn_back").css( 'display', 'block' );
	}else{
		$("div.btn_top, div.btn_back").css( 'display', 'none' );
	}
});


//textarea 안내문
function clearText(thefield){
	if(thefield.defaultValue == thefield.value) thefield.value="";
}

if (typeof com == 'undefined') var com = {};
if (typeof com.lotte == 'undefined') com.lotte = {};
if (typeof com.lotte.util == 'undefined') com.lotte.util = {};

/* dynamic script loading */
com.lotte.util.LoadScript = function(src, callback, charset, defer, id) {
	if (typeof src != 'string' || src == '' || src == 'undefined') return;
	
	var isLoaded= false;
	var head	= document.getElementsByTagName('head')[0];	
	var script	= document.createElement('script');
	var charset	= (charset && typeof charset == 'string') ? charset : 'UTF-8';
	
	if (id && typeof id == 'string' && id != ''){
		script.id = id;
	}
	script.src = src;
	script.charset = charset;
	script.type	 = 'text/javascript';
	script.async = true;
	script.defer = (typeof defer == 'boolean') ? defer : true;
	
	if (typeof callback == 'function') {
		script.onreadystatechange = function() {
			if (this.readyState == 'loaded' || this.readyState == 'complate') {
				if (isLoaded) return;
				window.setTimeout(callback(), 1);
				isLoaded = true;				
			}
		};
		script.onload = function() {
			if (isLoaded) return;
			window.setTimeout(callback(), 1);
			isLoaded = true;
		};
	}	
	head.appendChild(script);
};

/**
 * Util - sessionStorage get / set
 * 20141126
 */

 function getSessionStorage ( key ) {
	var value = null;
	try {
		value =  sessionStorage.getItem( key );
	} catch (e) {
		value = -1;
	}
	return value;
}

function setSessionStorage ( key, value ) {
	try {
		sessionStorage.setItem( key, value );
	} catch (e) {

	}
}


/* 간편회원가입 사용자 유효성 체크 (작성자 : 김낙운 date : 20150615) */
var korCheck = /([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i; // 한글외에 입력 정규식
var engCheck = /([가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i; // 한글제외 입력 정규식 //20150617 수정
var blankAllCheck = /^\s+|\s+$/g; // 공백만 입력 확인 정규식
var blankCheck = /[\s]/g; // 중간 공백 확인 정규식
var numCheck = /^[0-9]*$/; // 숫자 정규식 // 20150616 정규식 수정
var mixCheck = /^(?=.*[a-zA-Z])(?=.*[`~!@#$%^*+=-?:;.,|\\\{\}\[\]\(\)\/])(?=.*[0-9]).{6,16}$/; // 영문, 숫자, 특수문자 혼합 확인 정규식 // 20150618 수정
var specificCheck = /([\<\>\&\'\"])/i; // 특수문자 제외 정규식

// 한글외에 입력 체크(이름)
function korWordCheck(sel, val) {
	var nameSel = sel; // 받아온 인자 [이름] 선택자
	var nameVal = val; // 받아온 인자 [이름] value값

	nameVal = trim(val); //공백이 포함되어 있을 경우 체크가 안되어서 공백제거후 반환
	$(nameSel).val(nameVal);

	if (korCheck.test(nameVal)){// 유효성 체크
		alert('이름은 한글만 입력 가능합니다.');
		$(nameSel).focus();
		return false;
	}else if(nameVal == ''){ // 빈 값일 경우
		alert('입력되지 않은 정보가 있습니다.');
		$(nameSel).focus();
		return false;
	};
	return true;
};

// 한글제외 입력 체크(이메일)
function notKorWordCheck(sel, val) {
	var emailSel = sel; // 받아온 인자 [이름] 선택자
	var emailVal = val; // 받아온 인자 [이름] value값

	emailVal = trim(val); //공백이 포함되어 있을 경우 체크가 안되어서 공백제거후 반환
	$(emailSel).val(emailVal);

	if(engCheck.test(emailVal)){// 유효성 체크
		alert('이메일 주소는 영문, 숫자, 특수문자만 입력 가능합니다.');
		$(emailSel).focus();
		return false;
	}else if(emailVal == ''){ // 빈 값일 경우
		alert('입력되지 않은 정보가 있습니다.');
		$(emailSel).focus();
		return false;
	};
	return true;
};

// 숫자외에 입력 체크(핸드폰 번호)
function numWordCheck(sel, val) {
	var numSel = sel; // 받아온 인자 [이름] 선택자
	var numVal = val; // 받아온 인자 [이름] value값

	numVal = trim(val); //공백이 포함되어 있을 경우 체크가 안되어서 공백제거후 반환
	$(numSel).val(numVal);

	if(numVal == ''){
		alert('입력되지 않은 정보가 있습니다.');
		$(numSel).focus();
		return false;
	}else if(numCheck.test(numVal)){ // 빈 값일 경우
		if(numVal.length < 3){ // 숫자 3자리 미만일 경우
			alert('휴대폰번호는 3~4자리 입력 가능합니다.') // 20150615-2 오타수정
			$(numSel).focus();
			return false;
		}
	}else{ // 유효성 체크
		alert('휴대폰번호는 숫자만 입력 가능합니다.');
		$(numSel).focus();
		return false;
	};
	return true;
}

// 비밀번호 유효성 체크
function pwWordCheck(sel, val) {
	var pwSel = sel; // 받아온 인자 [이름] 선택자
	var pwVal = val; // 받아온 인자 [이름] value값

	if(pwVal == ''){ // 빈 값일 경우
		alert('입력되지 않은 정보가 있습니다.');
		$(pwSel).focus();
		return false;
	}else if(pwVal.length < 8 || pwVal.length > 15 || !mixCheck.test(pwVal)){ // 숫자 7자리 미만 15자 초과이고 영문, 숫자, 특수문자 혼합 아닐 경우
		alert('비밀번호는 8~15자리의 영문, 숫자, 특수문자를 혼합하여 설정해주세요.')
		$(pwSel).focus();
		return false;
	}else if(blankAllCheck.test(pwVal)){ // 공백만 입력 되어 있을 경우
		alert('공백은 사용할 수 없습니다.');
		$(pwSel).focus();
		return false;
	}else if(blankCheck.test(pwVal)){ // 공백이 포함 되어 있을 경우
		alert('공백은 사용할 수 없습니다.');
		$(pwSel).focus();
		return false;
	}else{ // 제외 특수문자 포함 되어 있을 경우
		if(specificCheck.test(pwVal)) {
			alert('특수문자 중 &, <, >,", ' + "'는 사용할 수 없습니다.")
			$(pwSel).focus();
			return false;
		}
	};
	return true;
};

// 비밀번호 재입력값 체크
function pwReWordCheck(sel, val, orVal) {
	var pwReSel = sel; // 받아온 인자 [이름] 선택자
	var pwReVal = val; // 받아온 인자 [이름] value값
	var pwOrVal = orVal; // 받아온 인자 [기존 비밀번호] value값

	if(pwReVal !== pwOrVal){ // 재입력값이 변경값과 다를 경우
		alert('입력했던 비밀번호와 다릅니다. 다시 입력해주세요.');
		$(pwReSel).focus();
		return false;
	};
	return true;
};

// 공백 제거
function trim(val) {
	val = val.replace( /(\s*)/g, "");
    return val;
};