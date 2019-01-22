windowWidth = $(window).width();
windowHeight = $(window).height();
// --------------------------------------------- 공통  --------------------------------------------- //
// 헤더 카테고리 펼치기/닫기
$(function(){
	var $subHeadWrap = $('#gucciSubHead');
	var $ctgWrap = $subHeadWrap.find('nav');
	var $ctgListBig = $ctgWrap.find('.ctg_list_big');
	var $ctgListMid = $ctgWrap.find('.ctg_list_mid');
	var $ctgListSml = $ctgWrap.find('.ctg_list_sml');
	var $bigCtgBtn = $ctgListBig.find(' > li > .btn_ctg_big');
	var $midCtgBtn = $ctgListMid.find(' > li > .btn_ctg_mid');

	//대카테고리 클릭
	$bigCtgBtn.on('click', function(){
		thisCtgHeight = $(this).siblings('ul').height();

		if($(this).parent().hasClass('big_on') == false && !$ctgListBig.children('li').hasClass('big_on')){
			$ctgListMid.children('.big_on').removeClass('big_on').children('ul').stop().slideUp(300);
			$(this).parent().addClass('big_on').children('ul').stop().slideDown(300);
			$subHeadWrap.stop().animate({marginBottom:thisCtgHeight},300)
		}else if($(this).parent().hasClass('big_on') == false && $ctgListBig.children('li').hasClass('big_on')){
			$subHeadWrap.animate({marginBottom:0},200);
			$subHeadWrap.animate({marginBottom:thisCtgHeight},300);
			$ctgListBig.children('.big_on').removeClass('big_on').children('ul').stop().slideUp(200);
			$(this).parent().addClass('big_on').children('ul').stop().delay(200).slideDown(300);
		}else{
			$(this).parent().children('ul').stop().slideUp(300);
			$subHeadWrap.stop().animate({marginBottom:0},300)
			setTimeout(function(){
				$ctgListBig.children('li').removeClass('big_on');
			}, 300);
		};
		return false;
	});

	//중카테고리 클릭
	$midCtgBtn.on('click', function(){
		thisCtgMargin = parseInt($subHeadWrap.css('margin-bottom'));
		activeCtgMargin = $ctgListMid.children('.mid_on').children('ul').height();
		thisCtgHeight = $(this).siblings('ul').height();

		if($(this).parent().hasClass('mid_on') == false && !$ctgListMid.children('li').hasClass('mid_on')){
			$(this).parent().addClass('mid_on').children('ul').stop().slideDown(200);
			$subHeadWrap.stop().animate({marginBottom : thisCtgMargin + thisCtgHeight},200)
		}else if($(this).parent().hasClass('mid_on') == false && $ctgListMid.children('li').hasClass('mid_on')){
			$ctgListMid.children('.mid_on').removeClass('mid_on').children('ul').stop().slideUp(200);
			$(this).parent().addClass('mid_on').children('ul').stop().slideDown(200);
			$subHeadWrap.stop().animate({marginBottom : thisCtgMargin - activeCtgMargin + thisCtgHeight},200)
		}else{
			$(this).parent().removeClass('mid_on').children('ul').stop().slideUp(200);
			$subHeadWrap.stop().animate({marginBottom:thisCtgMargin - thisCtgHeight},200)
		};
		return false;
	});
});

// ------------------------------------------- 카테고리  ------------------------------------------- //
// 필터바
if($('.category_filter_wrap').length > 0){
	var _$window = $( window ),
		_winHeight = $( window ).height();
	
	var _$categoryFilterWrap = $( '.category_filter_wrap' ),
		_$listWrapper = $( '.gucci_category_list' ),
		_$listContainer = $( '.gucci_category_list > ul' ),
		_$noneAlert = $("<p class='none_list'>조건에 맞는 상품이 없습니다.</p>"),
		MOVE_EV = hasTouch ? 'touchmove' : 'mousemove';
			
	var _filterTabIndex = null;
	
	var _isScrollLoadData = true;			// scroll data load flag
	
	var _mcScroll0 = null,
		_mcScroll1 = null;
	// ---------------------------------------------------- init

	// 최초 세션스토리지 DATA
	var _sessionURL = getSessionStorage( 'categoryProduct_URL' ),
		_sessionListData = getSessionStorage( 'categoryProduct_listData' ),
		_sessionScrollY = getSessionStorage( 'categoryProduct_scrollY' );

	if ( !_sessionListData || _sessionListData == -1 ) {
		// 세션X
		// 최초 Data Load
			//sessionStorage.setItem('page', 0);
			// 페이지번호 초기화 / smchoi4
			$("input[name='page']").val(1);
			$("input[name='last_goods_no']").val('');
			
			resetPage();
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif', 20 );
	} else {
		if (location.href == _sessionURL) {
			// 세션O
			resetPage();
			_$listContainer.html( _sessionListData );
			if ( _sessionScrollY )	$( window ).scrollTop( _sessionScrollY );
		} else {
			//sessionStorage.setItem('page', 0);
			// 페이지번호 초기화 / smchoi4
			$("input[name='page']").val(1);
			$("input[name='last_goods_no']").val('');
			
			resetPage();
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif', 20 );
		}
	}
	// listener
	_$window.on( { 'scroll': winScrollHandler, 'resize': winResizeHandler, 'unload': winUnloadHandler } );

	if ( _$categoryFilterWrap.length == 1 ) {
		setFilterWrap();
	}

	removeSessionStorage();
	//---------------------------------------------------- handler

	// 페이지 벗어날때 - sessionStorage 저장
	function winUnloadHandler (e) {
		addSessionStorage();
	}

	// 리사이즈
	function winResizeHandler (e) {
		_winHeight = $( window ).height();
		_filterBarHeight = _$categoryFilterWrap.find('> ul').height(); //필터 선택바 높이
		_filterLayerTitleHeight = _$categoryFilterWrap.find('.filter_layer > h4').height(); //필터 레이어 타이틀 높이
		_filterLayerListHeight = 230; //필터 리스트 높이
		_filterWrapHeight = _filterBarHeight + _filterLayerTitleHeight + _filterLayerListHeight; //필터 레이어 펼쳐졌을시 전체 높이
		
		if ( _$categoryFilterWrap.length == 1 && _winHeight < _filterWrapHeight && _winHeight >= 320) { //필터 레이어 320해상도 대응(아이폰 5, 5S)
			$('.filter_wrap').css({maxHeight : _winHeight - _filterBarHeight - _filterLayerTitleHeight - 95})
		}else if( _$categoryFilterWrap.length == 1 && _winHeight < 320){ //필터 레이어 320 이하해상도 대응(아이폰 4)
			$('.filter_wrap').css({maxHeight : _winHeight - _filterBarHeight - _filterLayerTitleHeight})
		}else{
			$('.filter_wrap').css({maxHeight : 230})
		}
		
		if ( _mcScroll0 )		_mcScroll0.refresh();
		if ( _mcScroll1 )		_mcScroll1.refresh();
	}

	// 브라우저 스크롤
	function winScrollHandler (e) {
		if ( _$window.scrollTop() + _winHeight > $( document ).height() - ( _winHeight / 4 ) ) {
			if ($('#wrapper').css('display') == 'block'){
				if ( _isScrollLoadData ) {
					
					// 더보기인 경우에만 페이지번호 증가 / smchoi4
					$("input[name='page']").val(parseInt($("input[name='page']").val())+1);
					
					appendLoading( _$listContainer, false, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif', 0, 'more' );
				}
				else						
					_$window.off( 'scroll', winScrollHandler );				//	data 빈값으로 들어온 후로는 ajax 호출 X
			}
		}
	}
		
	//로딩바
	/*20150726 - jhchoi - category_*_v*.js //pub_brandshop_gucci.js // pub_category_*_v*.js 3군데에서 로딩바처리(?) ----- */
	function appendLoading ( $parent, isEmpty, completeLoadingFunc, src, top , type) {		
		var $loading = $( '<div class="loading_wrap"><p class="loading half"></p></div><img style="display:none;" class="loading" src=' + src + ' alt="loading..."><br />' );
		$loading.on( 'load', function () {
			if ( isEmpty ) {
				$parent.empty();
			}
			if($('.none_list').length > 0){
				$('.none_list').remove();
			};
			$parent.append( $loading );
			//$loading.css( { 'position': 'relative', 'width': 'auto', 'top': top } );
			//$loading.css( { 'width': $loading.width() / 2 }  );
			//$loading.css( { 'left': parseInt( ( $parent.width() - $loading.width() ) /2 ) } );
			completeLoadingFunc( $loading , type);
		} );
	}
	//---------------------------------------------------- method

	// loadData
	function loadData ($loading, type) {
		
		_$window.off( 'scroll', winScrollHandler );
		
		//_curDispNo = _curDispNo == null ? $('#curDispNo').val() : _curDispNo;
		$.ajax( {
			url: '/category/m/prod_list_gucci_more.do',		// (D) ajax load 경로
			cache: true,
			async: false,
			dataType: 'html',
			data: setGucciParam(),
			success: function ( data ) {
				$loading.remove();
				_$window.on( 'scroll', winScrollHandler );
				
				if ( !$.trim( data ) ) {
					_isScrollLoadData = false;
					
					if(_$listContainer.find('>li').length == 0){
						_$listWrapper.append(_$noneAlert);
						_$listWrapper.addClass('category_list_none');
					}
				} else {
					_$noneAlert.remove();
					_$listWrapper.removeClass('category_list_none');
					_$listContainer.append( data );
				}
				
			}, error: function(xhr, status, error){
			}
		} );
		
		/** 파라미터 정의 */
		function setGucciParam() {

			// 가격
			var g_priceSelS = "";
			var g_priceSelE = "";
			var g_detail = "";

			var ctgPrice = $("input[name='ctg_price']:checked").val();
			if( ctgPrice != null && ctgPrice.length >0) {
				ctgPriceArr = ctgPrice.split("_");

				if( ctgPriceArr.length == 2) {
					g_priceSelS = ctgPriceArr[0];
					g_priceSelE = ctgPriceArr[1];
					g_detail = "Y";
				}
			}

			// 전시번호
			var g_curDispNo = $("input[name='curDispNo']").val();
			var g_upCurDispNo = $("input[name='upCurDispNo']").val();			
			var g_sort = $("input[name='sort']:checked").val();
			var g_beforeNo = $("input[name='beforeNo']").val();
			var g_size = $("input[name='size']").val();
			var g_page = $("input[name='page']").val();
			var g_last_goods_no = $("input[name='last_goods_no']").val();
			
			var g_param = {"curDispNo":g_curDispNo,"upCurDispNo":g_upCurDispNo,"sort":g_sort,"beforeNo":g_beforeNo,"detail":g_detail
					,"size":g_size,"moneyStart":g_priceSelS,"moneyEnd":g_priceSelE,"page":g_page,"last_goods_no":+g_last_goods_no};
			
			return g_param;
    	}
		/*		
		function getParams () {

			//sessionStorage.removeItem("dispChkCnt");
			var page = sessionStorage.getItem("page");
			var curDispNo = sessionStorage.getItem("curDispNo");
			var sort = sessionStorage.getItem("sort");
			var detail = sessionStorage.getItem("detail");
			
			var params = {"page":page,"curDispNo":curDispNo,"sort":sort,"detail":detail};
			
			return params;
		}
		/*function getParams () {		// (D) ajax 호출시 data 전달
			var params = '';
			params += '&curDispNo='+ _curDispNo;
			_page = parseInt((sessionStorage.getItem('page') == null ? 0 : sessionStorage.getItem('page') )) + 1;
			params += '&page='+ _page;
			sessionStorage.setItem('page', _page);
			
			_sort = (_sort == null) ? 10 : _sort;
			
			if(_sort == 10){
				_last_goods_no = (_page == 1) ? 0 : sessionStorage.getItem('last_goods_no');
				params += '&last_goods_no='+ _last_goods_no;
				params += '&navi=forward';
			}
			
			params += '&dpml_no=' + _dpml_no;
			
			params += '&sort=' + _sort;
			
			params += '&title=' + _title;
			return params;
		}*/
	}

	function resetPage () {
		_$listContainer.html( ' ' );
		_$window.scrollTop(0);
	}

	function addSessionStorage () {
		setSessionStorage( 'categoryProduct_URL', location.href );
		setSessionStorage( 'categoryProduct_listData', _$listContainer.html() );
		setSessionStorage( 'categoryProduct_scrollY', _$window.scrollTop() );

		if ( _$categoryFilterWrap.length == 1 ) {
			setSessionStorage( 'categoryProduct_filterTabIndex', _filterTabIndex );
			setSessionStorage( 'categoryProduct_filterWrapData',  _$categoryFilterWrap.html() );
		}
	}

	function removeSessionStorage () {
		sessionStorage.removeItem( 'categoryProduct_URL' );
		sessionStorage.removeItem( 'categoryProduct_listData' );
		sessionStorage.removeItem( 'categoryProduct_scrollY' );

		if ( _$categoryFilterWrap.length == 1 ) {
			sessionStorage.removeItem( 'categoryProduct_filterTabIndex' );
			sessionStorage.removeItem( 'categoryProduct_filterWrapData' );
		}
	}

	//==========================================================================//
	function setFilterWrap () {
		// 최초 세션스토리지 DATA 판단
		if ( location.href == _sessionURL ) {
			var _sessionFilterTabIndex = getSessionStorage( 'categoryProduct_filterTabIndex' ),
				_sessionFilterWrapData = getSessionStorage( 'categoryProduct_filterWrapData' );

			if ( _sessionFilterTabIndex )	_filterTabIndex = _sessionFilterTabIndex;
			if ( _sessionFilterWrapData )	_$categoryFilterWrap.html( _sessionFilterWrapData );
		}
	
		var _$filterWrap = _$categoryFilterWrap.find( '> ul' ),
			_$filterTab = _$filterWrap.find( '> li' ),
			_$filterList0 = _$filterTab.eq(0).find( '.filter_list ul > li' ),
			_$filterList1 = _$filterTab.eq(1).find( '.filter_list ul > li' ),
			_$filterClose = _$filterTab.find( '.filter_close > a' ),
			_$filterDimWrapon = $('.bg_filter_dim'),
			_$ctgFilterList = _$categoryFilterWrap.find('li'),
			_$ctgFilterDim = _$categoryFilterWrap.find('.bg_filter_dim'),
			MOVE_EV = hasTouch ? 'touchmove' : 'mousemove';

		// listner
		_$filterTab.find( '> a' ).on( 'click', filterTabClickHandler );
		_$filterList0.on( 'click', 'label', filterListClickHandler );
		_$filterList0.find( 'input' ).on( 'click', filterListInputClickHandler );
		_$filterList1.on( 'click', 'label', filterListClickHandler );
		_$filterList1.find( 'input' ).on( 'click', filterListInputClickHandler );
		_$filterDimWrapon.on( 'touchstart', filterDimClickHandler );	 //안드로이드 4.3버전 대응
		_$filterDimWrapon.on( 'click', filterDimClickHandler );

		// attr -> prop	checked 재설정
		_$filterWrap.find( '.filter_list input' ).each( function ( index ) {
			if ( $( this ).attr( 'checked' ) == 'checked' ) {
				$( this ).prop( 'checked', 'checked' );
			}
		} );

		//하단 필터바 스크롤( egScroll 생성 )
		_mcScroll0 = $( '#filterType' ).egScroll( true, false );	//추천순 스크롤
		_mcScroll1 = $( '#filterPrice' ).egScroll( true, false );	//가격순 스크롤
		
		//필터바 위아래 스크롤 막기
		$( '.filter_layer > h4' ).on( MOVE_EV, function (e) {
			e.preventDefault();
		} );
		$( '.filter' ).on( MOVE_EV, function (e) {
			e.preventDefault();
		} );

		// 필터 tab 클릭
		function filterTabClickHandler (e) {
			_filterTabIndex = $( this ).parent().index();
		}
		
		// 필터 Dim 클릭
		function filterDimClickHandler (e) {
			closeFilter();
			e.preventDefault();
		}

		// 필터 체크박스 클릭
		function filterListInputClickHandler (e) {
			var tag = 'label'
			$( this ).siblings( tag ).trigger( 'click' );
		}

		// 정렬기준 및 가격 목록 클릭
		function filterListClickHandler (e) {
			var $this = $( this );
				$input = $this.siblings( 'input' );

			// 정렬기준
			if ( _filterTabIndex == 0 ) {
				_$filterList0.find( 'input' ).removeAttr( 'checked' );
			}
			// 가격
			if ( _filterTabIndex == 1 ) {
				_$filterList1.find( 'input' ).removeAttr( 'checked' );
				_$filterTab.eq( _filterTabIndex ).addClass( 'filter_active' );
			}
			
			// 가격선택시 페이지번호 초기화 / smchoi4
			$("input[name='page']").val(1);
			$("input[name='last_goods_no']").val('');	// 신상품순 초기화
			
			$input.attr( 'checked', 'checked' ).prop( 'checked', 'checked' );
			_$filterTab.eq( _filterTabIndex ).find( '.filter > .filter_name' ).html( $this.html() );

			closeFilter();
			
			//sessionStorage.setItem('sort', $input.val());
			//_sort = sessionStorage.getItem('sort');
			//sessionStorage.setItem('page', 0);
			_isScrollLoadData = true;
			
			resetPage();
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif', 20 );
			return false;
		}

		// 필터 리스트 닫기
		function closeFilter () {
			_$filterTab.eq( _filterTabIndex ).find( '>a' ).trigger( 'click' );
		}

		//필터 열기/닫기
		$('.filter').on('click', function(){
			var $self = $( this );
			if($self.parent('li').hasClass('filter_on')){
				$self.siblings('.filter_layer').stop().animate({bottom:-270},200);
				$self.parent('li').removeClass('filter_on')
				_$ctgFilterDim.removeClass('dim_on');
				return false;
			}else if(_$ctgFilterList.hasClass('filter_on')){
				_$ctgFilterList.filter('.filter_on').find('.filter_layer').stop().animate({bottom:-270},200, function () {
					_$ctgFilterList.filter('.filter_on').removeClass('filter_on');
					$self.siblings('.filter_layer').stop().animate({bottom:54},200);
					$self.parent('li').addClass('filter_on');
				});
			}else{
				_$ctgFilterDim.addClass('dim_on');
				$self.siblings('.filter_layer').stop().animate({bottom:54},200);
				$self.parent('li').addClass('filter_on');
				history.pushState({filter:2}, 'filter'); //history back 키 눌렸을 때 이벤트처리
			};
			return false;
		});
		
		//history back 키 눌렸을 때 이벤트처리
		window.addEventListener( 'popstate', function(event){
			if (_$filterWrap.find('>.filter_on').length > 0){
				closeFilter();
			}
		}, false);
	};
	// //==========================================================================//
}

// -------------------------------------------- 원앤원  -------------------------------------------- //
// 이미지 슬라이딩
if($('.slide_image_wrap').length > 0){
	var prdImgLen = $('.slide_image_wrap').find('li').length;
	if ( prdImgLen > 1 ) {
		var prdImgBanner = $('.slide_image_wrap').swiper({
			mode : 'horizontal',
			loop : true,
			calculateHeight : false,
			pagination : '.page'
		});
		$('.slide_image_wrap').find('.zoom_view_btn').css('margin-left', 20+(prdImgLen*5) + 'px' );
	}
	$(window).resize(function() {
		setW();
	});
	function setW(){
		$('.slide_image_wrap').find('.swiper-wrapper').css('height',$(this).width()+46);
		$('.slide_image_wrap').find('li').css('height',$(this).width()+46);
	}

	$(window).load(function(){
		$('.slide_image_list').find('.photo>li img').each(function(){
			$(this).css({ 'width' : '', 'height' : '' });

			var heiBoolean = $(window).width() > $(this).height(),
				widBoolean = $(window).width() > $(this).width();
			if ( widBoolean ) {
				$(this).parent().parent().css( 'width','100%' );
				$(this).css({ 'width':'auto' });
			}
			if ( heiBoolean ) {
				$(this).css({ 'margin-top' : ($(window).width()-$(this).height())/2 });
			} else {
				$(this).css('height','100%');
			}
		});

	});
	setW();
}

// 크게보기
if($('.gucci_zoom_image').length > 0){
	handler = function(e){e.preventDefault();}
	$zoomWrap = $('.gucci_zoom_image');
	$zoomListWrap = $zoomWrap.children('.zoom_big_wrap');
	$zoomList = $zoomListWrap.children('.zoom_big_list');
	$zoomListLi = $zoomList.children('li');
	$thumListWrap = $('.zoom_thum_list');
	$thumList = $thumListWrap.children('ul');
	$thumListLi = $thumList.children('li');

	zoomListLiLength = $zoomListLi.length;
	thumListLiLength = $thumListLi.length;
	zoomListWidth =windowWidth*zoomListLiLength;
	thumListWidth =90*thumListLiLength+22;

	_wid = (zoomListLiLength * 77 ) + ( zoomListLiLength * 3 );
	_crtIdx = 0;


	/* ------------------------------------------- handler ------------------------------------------- */
	/* 20150225 첫번째 탭 활성화 수정 */
	//open
	$('.zoom_view_btn').on('click', '> a', function() {
		windowWidth = $(window).width();
		windowHeight = $(window).height();

		$('html, body').css({ height:$(window).height(), overflow:'hidden' });
		$zoomList.css({width : windowWidth*zoomListLiLength});
		$zoomListLi.css({width : windowWidth , height : windowHeight - 42 - 114});
		$thumList.css({width : thumListWidth});
		$zoomWrap.addClass('on');

		if($thumListLi.hasClass('on') == false){
			$thumListLi.eq(0).addClass('on');
		}

		$zoomWrap.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
			if ($zoomWrap.hasClass('active') == false) {
				zoomImage();
				$zoomWrap.addClass('active');
			}
		});
		return false;
	});
	/* //20150225 첫번째 탭 활성화 수정 */

	//close
	$('.zoom_image_close').on('click', function(){
		$('html, body').css({ height:'auto', overflow:'visible' });
		$zoomWrap.removeClass('on')
	});

	//slide
	$thumListLi.on('click', '> a', function(){
		if ($(this).parent().hasClass('on') == false) {
			$thumListLi.removeClass('on');
			$(this).parent().addClass('on')
			ixBand( $zoomList[0] ).transition( 'left:' + (-windowWidth*$(this).parents('li:eq(0)').index()) + 'px', 'left 0.5s ease' );
			return false;
		}
	});
	
	//resize
	$( window ).resize(function (){
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		if($zoomWrap.hasClass('on')){
			$('html, body').css({ height:$(window).height(), overflow:'hidden' });
		}
		$zoomList.css({width : windowWidth*zoomListLiLength});
		$zoomListLi.css({width : windowWidth , height : windowHeight - 42 - 114});
		ixBand( $zoomList[0] ).transition( 'left:' + (-windowWidth*$thumList.find('li.on').index()) + 'px', 'left 0.5s ease' );
	});

	/* ------------------------------------------- method -------------------------------------------- */
	//zoom
	function zoomImage(){
		var i = 0;
		for (i; i < $zoomListLi.length; i++) {
			$zoomListLi.eq(i).children('img').addClass('zoom_big_image_' + (i+1));
			$('.zoom_big_image_' + (i+1)).smartZoom({'layerZoom' : true , 'layerWrapperClass' : '.gucci_zoom_image' , 'layerOpenClass' : '.zoom_view_btn'});
		}
	};

	//thum
	function themWidth(){
		if($thumList < windowWidth){
			$thumList.css('margin','13px auto')
		}
	};
}

// 다른 컬러 상품 슬라이딩
if($('.other_product_list').length > 0){
	listLength = $('.other_product_list > ul > li').length;
	listWidth = listLength * 98 + 20;

	$('.other_product_list > ul').css({width : listWidth});
}

// 상품정보 아코디언
$(function(){
	$('.toggle_button').on('click', function(){
		if($(this).parent().hasClass('on') == false){
			if($('.gucci_product_info > ul > li').hasClass('on')){
				$('.gucci_product_info > ul > li.on').children('.content').slideUp('fast', function(){
					$('.gucci_product_info > ul > li').removeClass('on');
				});
			}
			$(this).siblings('.content').slideDown('fast', function(){
				$(this).parent().addClass('on');
			});
		} else{
			$(this).siblings('.content').slideUp('fast', function(){
				$(this).parent().removeClass('on');
			});
		}
	});
});

// --------------------------------------------- FAQ  ---------------------------------------------- //
// FAQ 페이지 내용 펼치기/접기
$('.gucci_faq_list').on('click',' > ul > li > a' , function(e){
	if($(this).parent('li').hasClass('faq_on')){
		$(this).siblings('ul').slideUp('fast', function(){
			$(this).parent('li').removeClass('faq_on');
		});
	}else{
		if($('.gucci_faq_list > ul > li').hasClass('faq_on')){
			$('.gucci_faq_list > ul > li.faq_on').children('ul').slideUp('fast', function(){
				$('.gucci_faq_list > ul > li').removeClass('faq_on');
			});
		}
		$(this).siblings('ul').slideDown('fast', function(){
			$(this).parent('li').addClass('faq_on');
		});
	};
	return false;
});