/*
* lotte.com moblie
* 2014.02.26 _khv
* 탑검색 관련 파일
*/

$( document ).ready( function () {
	
	var isEllotte = (location.hostname.indexOf("ellotte.com") != -1);
	
	//***************************************************************//
	//*********************** main top search ***********************//

	var topSearch = (function () {
		
		var _$main = $( '#wrapper' ),
			_$btn = $( '#head' ).find( 'li.search a' ),
			_$cont = $( '#main_search' ),
			_$cover = $( '.srh_cover' ); /* #cover => .srh_cover 이중 dimmed 처리 오류 수정*/
		
		if(isEllotte){
			_$cover = $( '#cover' ); /*ellotte 시 검색 딤처리 별도로 만듬 (엘롯데 리뉴얼시 롯데와 통일해야함)*/
		}
		
		var _content;

		var _mainSearchOpen = false;
		
		//====================== search tab ==========================//

		var _$searchTab = $( 'section.search_tab' ),
			_$content = $( 'section.layer_srch' ),
			_$searchF = $( 'section.search_f' );

		var _crtIdx = 0;

		//====================== initialize ==========================//

		_$btn.on( 'click', mainSearchHandler );
		
		_$cover.on( 'click', function () {
			if ( _mainSearchOpen ) mainSearchHandler();
		});
		/*
		_$cont.on( 'click', function () {
			if ( _mainSearchOpen ) mainSearchHandler();
		});
		*/

		//====================== private methods ==========================//

		function mainSearchHandler () {
			if ( _mainSearchOpen ) {
				mainSearchClose();
			} else {
				if ( _$cover.css( 'display' ) == 'none' ) mainSearchOpen();
			}
		}

		function mainSearchOpen () {
			_mainSearchOpen = true;
			_$cover.css( 'display', 'block' );
			
			_$cont.css({ 'display' : 'block' });
			//_$main.css({ 'height' : $(window).height() + 'px', 'overflow' : 'hidden' });

			$( '#top_search_input' ).focus();
			_$searchTab.css( 'display', 'block' ).find( 'li' ).removeClass( 'on' ).eq(0).addClass( 'on' );
			_$content.css( 'display', 'none' ).eq( 0 ).css( 'display', 'block' );
			
		}

		function mainSearchClose () {
			_mainSearchOpen = false;
			_$cover.css( 'display', 'none' );

			_$cont.css({ 'display' : 'none' });
			$( '#searchKeyword' ).val( '' );
			_$searchF.find( 'a' ).eq(0).css( 'display', 'none' );
		}

		//====================== search tab ==========================//

		_$content.eq( _crtIdx ).css( 'display', 'block' );
		_$searchF.find( 'a' ).eq(0).css( 'display', 'none' );

		_$searchTab.on( 'click', 'li', tabHandler );
		_$searchF.on( 'click', 'a', mainSearchClose );


		function tabHandler (e) {
			var idx = $(this).index();

			_crtIdx = idx;

			_$searchTab.find( 'li' ).removeClass( 'on' ).eq( _crtIdx ).addClass( 'on' );
			_$content.css( 'display', 'none' ).eq( _crtIdx ).css( 'display', 'block' );
			( idx == 1 )? _$searchF.find( 'a' ).eq(0).css( 'display', 'inline-block' ) : _$searchF.find( 'a' ).eq(0).css( 'display', 'none' );
		}

	}());

});