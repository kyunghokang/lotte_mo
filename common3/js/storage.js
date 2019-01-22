// 로컬스토리지 재설정
function localStorageReSet(arg) {
	if (localStorage) {
		try {
			var mywordList = localStorage.getItem('myWord'); // 내검색 기록
			//var storage_goods = localStorage.getItem("viewGoods"); // 최근 본 상품
			var wish_goods = localStorage.getItem('wishGallery'); // 위시리스트정렬상품
			// var book_mark = localStorage.getItem('bookmark'); // 즐겨찾기
			var myCateList = localStorage.getItem('myCateList');	//카테고리 즐겨찾기
			var family_chk = localStorage.getItem('family_chk');	// 로그인폼 패밀리 안내 팝업 다시 안보기 체크 여부
			var stamp_chk = localStorage.getItem('stamp_chk');	// 장바구니 구매도장 안내 팝업 다시 안보기 체크 여부
			
			// var lotteMFavor = localStorage.getItem('lotteMFavor');	// 카테고리 즐겨찾기
			// var lotteMBrand = localStorage.getItem('lotteMBrand');	// 브랜드 즐겨찾기
			// var myHomeType = localStorage.getItem('myHomeType');	// 
			var viewGoods = localStorage.getItem('viewGoods');	// 
			var wSize = localStorage.getItem('wSize');	// 마이 사이즈 설정 : 여성
			var mSize = localStorage.getItem('mSize');	// 마이 사이즈 설정 : 남성
			var sSize = localStorage.getItem('sSize');	// 마이 사이즈 설정 : 신발
			var renewalEvent = localStorage.getItem('renewalEvent');	//리뉴얼 이벤트
			var firstStartLotteM = localStorage.getItem('firstStartLotteM');	//최초실행
			
			//localStorage.clear();
			if( arg ){
				for( var i = 0; i < localStorage.length; i++ ){
					if( localStorage.key(i).indexOf(arg) == 0 ){
						localStorage.removeItem(localStorage.key(i));
					}
				}
			}
			
			if ( mywordList ) localStorage.setItem( 'myWord', mywordList );
			//if ( storage_goods ) localStorage.setItem( 'viewGoods', storage_goods );
			if ( wish_goods ) localStorage.setItem( 'wishGallery', wish_goods );
			// if ( book_mark ) localStorage.setItem( 'bookmark', book_mark );
			if ( myCateList ) localStorage.setItem( 'myCateList', myCateList );
			if ( family_chk ) localStorage.setItem( 'family_chk', family_chk );
			
			// if ( lotteMFavor ) localStorage.setItem( 'lotteMFavor', lotteMFavor );
			// if ( lotteMBrand ) localStorage.setItem( 'lotteMBrand', lotteMBrand );
			// if ( myHomeType ) localStorage.setItem( 'myHomeType', myHomeType );
			if ( viewGoods ) localStorage.setItem( 'viewGoods', viewGoods );
			if ( wSize ) localStorage.setItem( 'wSize', wSize );
			if ( mSize ) localStorage.setItem( 'mSize', mSize );
			if ( sSize ) localStorage.setItem( 'sSize', sSize );
			if ( renewalEvent ) localStorage.setItem( 'renewalEvent', renewalEvent );
			if ( firstStartLotteM ) localStorage.setItem( 'firstStartLotteM', firstStartLotteM );
			localStorage.stamp_chk = stamp_chk;
		} catch (e) {}
	}
}