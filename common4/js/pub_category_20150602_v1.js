/*
* lotte.com moblie product
* 20141204 _ksg
* 좌측카테고리
*/

var categoryProduct = function (grpNo) {
	var _$window = $( window ),
		_winHeight = $( window ).height();
	
	var _$categoryFilterWrap = $( '.category_filter_wrap' ),
		_$listWrapper = $( '.cateogry_mall_list' ),
		_$listContainer = $( '.cateogry_mall_list > ul' ),
		_$noneAlert = $('<p class="none_list">조건에 맞는 상품이 없습니다.</p>'),
		_$filterBrand = $( '#filterBrand ul' ),
		_$mallBar = $( '.category_mall_filter' ),
		$chkMall = null,
		$chkMallBranch = null,
		_$branchListCheck = null; 
	
	var _filterTabIndex = null,
		_filterWrap2Height = null,
		_scBarHeight = null;
	
	var _isScrollLoadData = true,			// scroll data load flag
		_isBrandListLoadData = true;
	
	var _mcScroll0 = null,
		_mcScroll1 = null,
		_mcScroll2 = null;
	
	var chkLength = 0;
		_arrFilterList2Index = [];

	var smpBranchNo = null;
// ---------------------------------------------------- init

	// 최초 세션스토리지 DATA
	var _sessionURL = getSessionStorage( 'categoryProduct_URL' ),
		_sessionMallBar = getSessionStorage( 'categoryProduct_mallBar' ),
		_sessionListData = getSessionStorage( 'categoryProduct_listData' ),
		_sessionScrollY = getSessionStorage( 'categoryProduct_scrollY' );
	
	if ( !_sessionListData || _sessionListData == -1 ) {
		// 세션 X
		// 최초 data 로드
		resetPage();
		removeParams();
		appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
	} else {
		// 세션O
		if ( location.href == _sessionURL ) {
			_$listContainer.html( _sessionListData );
			if ( _sessionMallBar )	_$mallBar.html( _sessionMallBar );
			if ( _sessionScrollY )	$( window ).scrollTop( _sessionScrollY );
		} else {
			resetPage();
			removeParams();
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
		}
	}
	
	//스마트픽 지점조회 추가 Start
	$chkMall = $( '#mall_checkbox_Dep' );
	// listener
	$chkMall.find( 'label' ).on( 'click', chkMallLabelClickHandler );
	$chkMall.find( 'input' ).on( 'click', chkMallInputClickHandler );
	
	$chkMallBranch = $( '#mall_checkbox_smp' );
	// listener
	$chkMallBranch.find( 'label' ).on( 'click', chkMallBranchLabelClickHandler );
	$chkMallBranch.find( 'input' ).on( 'click', chkMalllBranchInputClickHandler );
	
	_$branchListCheck = $('.branch_wrap #branchLst');
	_$branchListCheck.find( 'input' ).on( 'click', branchListCheckInputClickHandler );
	//스마트픽 지점조회 추가 End
	
	//$( '.category_more' ).on( 'click', moreButtonHandler );			//20141224 더보기 추가 <추후 적용 예정>
	_$window.on( { 'scroll': winScrollHandler, 'resize': winResizeHandler, 'unload': winUnloadHandler } );

	if ( _$categoryFilterWrap.length == 1 ) {
		setFilterWrap();
	}
	removeSessionStorage();

// ---------------------------------------------------- handler
	// 롯데백화점 상품 체크
	function chkMallLabelClickHandler (e) {
		var $input = $chkMall.find( 'input' );
		if ( $input.attr( 'checked' ) == 'checked' )	$input.removeAttr( 'checked' );
  		else										$input.attr( 'checked', 'checked' ).prop( 'checked', 'checked' );
		setParams('dept');
		_arrFilterList2Index = [];	//브랜드 선택 초기화
		_$categoryFilterWrap.find("> ul > li ").eq( 2 ).removeClass( 'filter_active' );
		resetPage();
		appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
		return false;
	}
	function chkMallInputClickHandler (e) {
		$( this ).siblings( 'label' ).trigger( 'click' );
	}
	// 스마트픽 지점조회 추가 Start
	function chkMallBranchLabelClickHandler (e) {
		var $input = $chkMallBranch.find( 'input' );
		if ( $input.attr( 'checked' ) == 'checked' )	{
			$input.removeAttr( 'checked' );
			$('#mall_checkbox_smp .smpick_branch .btn_smpick').css('background-color','#fff');			
		}else{
			$input.attr( 'checked', 'checked' ).prop( 'checked', 'checked' );
		}
		//스마트픽 지점 셀렉트 박스 색 셋팅
		if ( $input.attr( 'checked' ) == 'checked' )	{
			$('#mall_checkbox_smp .smpick_branch .btn_smpick').css('background-color','#fff');
			$('.smpick_lst .branch_wrap #smpick_lst0').prop( 'checked', 'checked' );
		} else {
			$('#mall_checkbox_smp .smpick_branch .btn_smpick').css('background-color','#ddd');
		}
		smpBranchNo = "";
		setParams('branch');
		_arrFilterList2Index = [];	//브랜드 선택 초기화
		_$categoryFilterWrap.find("> ul > li ").eq( 2 ).removeClass( 'filter_active' );
		resetPage();
		appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
		return false;
	}
	function chkMalllBranchInputClickHandler (e) {
		$( this ).siblings( 'label' ).trigger( 'click' );
	}

	//스마트픽 지점  조회
	function branchListCheckInputClickHandler(e){
		smpBranchNo = $(this).val();
		setParams('branch');
		_arrFilterList2Index = [];	//브랜드 선택 초기화
		_$categoryFilterWrap.find("> ul > li ").eq( 2 ).removeClass( 'filter_active' );
		resetPage();
		appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
		dimmedClose({target:"smpick"});
	}
	// 스마트픽 지점조회 추가 End*/
	
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
		if ( _$categoryFilterWrap.length == 1 && _winHeight < _filterWrapHeight && _winHeight >= 320) { //필터 레이어 320해상도 대응(아이폰 5, 5S) kwkwon
			$('.filter_wrap').css({maxHeight : _winHeight - _filterBarHeight - _filterLayerTitleHeight - 95})
		}else if( _$categoryFilterWrap.length == 1 && _winHeight < 320){ //필터 레이어 320 이하해상도 대응(아이폰 4)
			$('.filter_wrap').css({maxHeight : _winHeight - _filterBarHeight - _filterLayerTitleHeight})
		}else{
			$('.filter_wrap').css({maxHeight : 230})
		}
		if ( _mcScroll0 )		_mcScroll0.refresh();		//	20141226 리사이즈( 화면전환 )시 egscroll refresh()
		if ( _mcScroll1 )		_mcScroll1.refresh();
		if ( _mcScroll2 )		_mcScroll2.refresh();
	}

	// 브라우저 스크롤
	function winScrollHandler (e) {
		if ( _$window.scrollTop() + _winHeight > $( document ).height() - ( _winHeight / 4 ) ) {
			if ($("#wrapper").css("display") == "block"){ // 20141222 카테고리 레이어 안열렸을시 실행함
				if ( _isScrollLoadData )	appendLoading( _$listContainer, false, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif' , 0,  'more');
				else						_$window.off( 'scroll', winScrollHandler );			//	data 빈값으로 들어온 후로는 ajax 호출 X
			}
		}
	}
	
	// 20141224 더보기 추가 <추후 적용 예정>
	// 더보기 버튼 클릭
	function moreButtonHandler (e) {
		if ($("#wrapper").css("display") == "block"){						// 카테고리 레이어 안열렸을시 실행함
			appendLoading( _$listContainer, false, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif' );
		}
		return false;
	}
// ---------------------------------------------------- method
	// loadData ( ajax )
		
	function loadData ( $loading , type) {
		_$window.off( 'scroll', winScrollHandler );				//20141224 추가
		var pageIdx = getSessionStorage('categoryProduct_param_pageIdx') == -1 || getSessionStorage('categoryProduct_param_pageIdx') == null ? 0 : getSessionStorage('categoryProduct_param_pageIdx');
		$.ajax( {
			url: '/category/include/new_prod_list_ajax.do?'+__commonParam,
			//async: false,
			cache: true,
			dataType: 'html',
			data: getParams(),
			success: function ( data ) {
				$loading.remove();							//20141224 추가
				_$window.on( 'scroll', winScrollHandler );		//20141224 추가
				if ( !$.trim( data ) ) {
					_isScrollLoadData = false;					// 20141224 더보기 추가 <추후 삭제 예정>
					//$( '.category_more' ).remove();			// 20141224 더보기 추가 <추후 적용 예정>
					if(type == null || type == undefined) $('.total_count').text('전체 0개');	//더보기가 아닌 데이터 조회시 0개 처리
					if(_$listContainer.find('>li').length == 0){ 
						_$listWrapper.append(_$noneAlert); 
					}
				}else{
					_$noneAlert.remove();
					_$listContainer.append( data );
					pageIdx++;
					setSessionStorage('categoryProduct_param_pageIdx' , pageIdx);
					$('.comment_wishlist').find( 'button' ).on( 'click', wishListClickHandler );		/* 20141226 스크립트 위치 이동 - 위시리스트 초기 init 오류 수정 */
				}
				
				$(".countBox > .count").html($(".cateogry_mall_list > ul > li").length + "/" + $("p.total_count").attr("data"));
                $(".countBox").show(0);
                setTimeout(function(){
                    $(".countBox").hide(0);
                }, 2000);
			}
		} );
		function getParams () {		// (D) ajax 호출시 data 전달
			var params	= "&grpNo="+ grpNo;
			if(getSessionStorage('categoryProduct_param_sort') != -1 && getSessionStorage('categoryProduct_param_sort') != null && getSessionStorage('categoryProduct_param_sort') != ''){
				params += "&sort=" + getSessionStorage('categoryProduct_param_sort');
			}
			if(getSessionStorage('categoryProduct_param_grpTp') != -1 && getSessionStorage('categoryProduct_param_grpTp') != null && getSessionStorage('categoryProduct_param_grpTp') != ''){
				params += "&grpTp=" + getSessionStorage('categoryProduct_param_grpTp');
			}
			if(getSessionStorage('categoryProduct_param_brandNo') != -1 && getSessionStorage('categoryProduct_param_brandNo') != null && getSessionStorage('categoryProduct_param_brandNo') != ''){
				params += "&brdNo=" + getSessionStorage('categoryProduct_param_brandNo');
			}
			if(getSessionStorage('categoryProduct_param_cateNo') != -1 && getSessionStorage('categoryProduct_param_cateNo') != null && getSessionStorage('categoryProduct_param_cateNo') != ''){
				params += "&cate_no=" + getSessionStorage('categoryProduct_param_cateNo');
			}
			if(getSessionStorage('categoryProduct_param_cateDepth') != -1 && getSessionStorage('categoryProduct_param_cateDepth') != null && getSessionStorage('categoryProduct_param_cateDepth') != ''){
				params += "&depth=" + getSessionStorage('categoryProduct_param_cateDepth');
			}
			// 스마트픽 지점 추가 20150520 yhsun
			if(getSessionStorage('categoryProduct_param_branchNo') != -1 && getSessionStorage('categoryProduct_param_branchNo') != null && getSessionStorage('categoryProduct_param_branchNo') != ''){
				if('all' != getSessionStorage('categoryProduct_param_branchNo')){
					params += "&smpBranchNo=" + getSessionStorage('categoryProduct_param_branchNo');
				}
			}
			if(getSessionStorage('categoryProduct_param_branchYn') != -1 && getSessionStorage('categoryProduct_param_branchYn') != null && getSessionStorage('categoryProduct_param_branchYn') != ''){
				params += "&smpickYN=" + "Y";
			}
			
			params += "&page=" + pageIdx;
			
			return params;
		}
	}
	
	var brandLoadFlag = false;
	
	// 브랜드선택 리스트 로드
	function loadBrandListData (type) {
		var pageIdx = getSessionStorage('categoryProduct_param_brandPageIdx') == -1 || getSessionStorage('categoryProduct_param_brandPageIdx') == null ? 1 : getSessionStorage('categoryProduct_param_brandPageIdx');
		$.ajax( {
			url: '/category/include/brand_list_ajax.do?'+__commonParam,
			async: false,
			cache: true,
			dataType: 'html',
			data: getParams(),
			success: function ( data ) {
				if ( !$.trim( data ) ) {
					_isBrandListLoadData = false;
					if(type == null || type == undefined){
						$('.category_filter_wrap > ul').addClass('filter_two');
					}
				}else{
					_$filterBrand.append( data );
					$('.category_filter_wrap > ul').removeClass('filter_two');
					pageIdx++;
					setSessionStorage('categoryProduct_param_brandPageIdx' , pageIdx);
					// EGScroll refresh
					_mcScroll2.refresh();
					_scBarHeight = _$scBar2.height();
				}
			}
		} );
		
		function getParams(){
			var params	= "&grpNo="+ grpNo;
			if(getSessionStorage('categoryProduct_param_grpTp') != -1 && getSessionStorage('categoryProduct_param_grpTp') != null && getSessionStorage('categoryProduct_param_grpTp') != ''){
				params += "&grpTp=" + getSessionStorage('categoryProduct_param_grpTp');
			}
			if(getSessionStorage('categoryProduct_param_cateNo') != -1 && getSessionStorage('categoryProduct_param_cateNo') != null && getSessionStorage('categoryProduct_param_cateNo') != ''){
				params += "&cate_no=" + getSessionStorage('categoryProduct_param_cateNo');
			}
			if(getSessionStorage('categoryProduct_param_cateDepth') != -1 && getSessionStorage('categoryProduct_param_cateDepth') != null && getSessionStorage('categoryProduct_param_cateDepth') != ''){
				params += "&depth=" + getSessionStorage('categoryProduct_param_cateDepth');
			}
			// 스마트픽 지점 추가 20150520 yhsun
			if(getSessionStorage('categoryProduct_param_branchNo') != -1 && getSessionStorage('categoryProduct_param_branchNo') != null && getSessionStorage('categoryProduct_param_branchNo') != ''){
				if('all' != getSessionStorage('categoryProduct_param_branchNo')){
					params += "&smpBranchNo=" + getSessionStorage('categoryProduct_param_branchNo');
				}
			}
			if(getSessionStorage('categoryProduct_param_branchYn') != -1 && getSessionStorage('categoryProduct_param_branchYn') != null && getSessionStorage('categoryProduct_param_branchYn') != ''){
				params += "&smpickYN=" + "Y";
			}
			params += "&page=" + pageIdx;
			
			return params;
		}
	}

	//파라미터 셋팅
	function setParams(pin){
		sessionStorage.removeItem('categoryProduct_param_pageIdx');
		_isScrollLoadData = true;
		switch(pin){
			case 'dept' :
				//롯데백화점 상품
				if($('#depFilter').is(":checked")){
					setSessionStorage('categoryProduct_param_grpTp' , 'D');
				}else{
					sessionStorage.removeItem('categoryProduct_param_grpTp');
				}
				_isBrandListLoadData = true;	//스크롤 초기화
				sessionStorage.removeItem('categoryProduct_param_brandNo');
				setSessionStorage('categoryProduct_param_brandPageIdx' , '0');	//브랜드첫페이지 조회를 위해 0셋팅
				_$filterBrand.html('');
				loadBrandListData();
				
				break;
			case 'sort' :
				//정렬
				setSessionStorage('categoryProduct_param_sort' , $('input[name=filter01]:radio:checked').val());
				break;
			case 'cate' :
				//카테고리 선택후 완료
				sessionStorage.removeItem('categoryProduct_param_cateNo');
				sessionStorage.removeItem('categoryProduct_param_cateDepth');
				if($('input[name=filter02]:radio:checked').val() != 'all'){		//선택한 카테고리 정보 - 전체보기 제외
					var cateNo = $('input[name=filter02]:radio:checked').parent().attr("data-cate_no");
					var cateDepth = $('input[name=filter02]:radio:checked').parent().attr("data-depth");
					setSessionStorage('categoryProduct_param_cateNo' , cateNo);
					setSessionStorage('categoryProduct_param_cateDepth' , cateDepth);
				}
				_isBrandListLoadData = true;
				sessionStorage.removeItem('categoryProduct_param_brandNo');
				setSessionStorage('categoryProduct_param_brandPageIdx' , 0);
				_$filterBrand.html('');
				loadBrandListData();
				break;
			case 'brand' :
				//브랜드 선택후 완료
				sessionStorage.removeItem('categoryProduct_param_brandNo');
				if(getBrandNo() != ''){
					setSessionStorage('categoryProduct_param_brandNo' , getBrandNo());
				}
				break;
			case 'branch':
				//스마트픽지점 20150520 yhsun
				if($('#depFilter_smp').is(":checked")){
					setSessionStorage('categoryProduct_param_branchYn' , "Y");
				}else{
					sessionStorage.removeItem('categoryProduct_param_branchYn');
				}
				if(smpBranchNo == null || smpBranchNo == undefined){
					sessionStorage.removeItem('categoryProduct_param_branchNo');
				}else{
					setSessionStorage('categoryProduct_param_branchNo' , smpBranchNo);
				}
				_isBrandListLoadData = true;	//스크롤 초기화
				sessionStorage.removeItem('categoryProduct_param_brandNo');
				setSessionStorage('categoryProduct_param_brandPageIdx' , '0');	//브랜드첫페이지 조회를 위해 0셋팅
				_$filterBrand.html('');
				loadBrandListData();
				break;
		}
	}
	
	function resetPage () {
		_$window.scrollTop(0);
		_$listContainer.html( '' );
	}
	
	function removeParams () {
		sessionStorage.removeItem( 'categoryProduct_param_pageIdx' );		//상품 페이지
		sessionStorage.removeItem( 'categoryProduct_param_brandPageIdx' );	//브랜드리스트 페이지
		sessionStorage.removeItem( 'categoryProduct_param_sort' );			//정렬
		sessionStorage.removeItem( 'categoryProduct_param_grpTp' );			//롯데백화점 여부
		sessionStorage.removeItem( 'categoryProduct_param_cateNo' );		//카테고리 번호
		sessionStorage.removeItem( 'categoryProduct_param_cateDepth' );		//카테고리 번호
		sessionStorage.removeItem( 'categoryProduct_param_brandNo' );		//선택한 브랜드 번호
		sessionStorage.removeItem( 'categoryProduct_param_branchNo' );		//스마트픽 지점 20150520 yhsun
		sessionStorage.removeItem( 'categoryProduct_param_branchYn' );		//스마트픽 여부 20150520 yhsun
	}
	
	function addSessionStorage () {
		setSessionStorage( 'categoryProduct_URL', location.href );
		setSessionStorage( 'categoryProduct_listData', _$listContainer.html() );
		setSessionStorage( 'categoryProduct_mallBar', _$mallBar.html() );
		setSessionStorage( 'categoryProduct_scrollY', _$window.scrollTop() );

		if ( _$categoryFilterWrap.length == 1 ) {
			setSessionStorage( 'categoryProduct_filterTabIndex', _filterTabIndex );
			setSessionStorage( 'categoryProduct_filterWrapData',  _$categoryFilterWrap.html() );
			setSessionStorage( 'categoryProduct_EGScrollY1', _mcScroll1._y() );
			setSessionStorage( 'categoryProduct_EGScrollY2', _mcScroll2._y() );
		}
	}

	function removeSessionStorage () {
		sessionStorage.removeItem( 'categoryProduct_URL' );
		sessionStorage.removeItem( 'categoryProduct_listData' );
		sessionStorage.removeItem( 'categoryProduct_mallBar' );
		sessionStorage.removeItem( 'categoryProduct_scrollY' );

		if ( _$categoryFilterWrap.length == 1 ) {
			sessionStorage.removeItem( 'categoryProduct_filterTabIndex' );
			sessionStorage.removeItem( 'categoryProduct_filterWrapData' );
			sessionStorage.removeItem( 'categoryProduct_EGScrollY1' );
			sessionStorage.removeItem( 'categoryProduct_EGScrollY2' );
		}
	}
	
	function getBrandNo(){	//선택한 브랜드 체크
		var brdList = $("#filterBrand input[name=brandChk]");
		var brdNo = new Array();
		for(i=0; i < brdList.length; i++){
			if($(brdList[i]).is(":checked")){
				brdNo.push($(brdList[i]).val());
			}
		}
		return brdNo;
	}

	//위시리스트 담기 클릭
	function wishListClickHandler (e) {
		if(loginChk()){
			wishListData ($(this).val(),$(this));
		}else{
			alert('로그인 후 이용하실 수 있습니다.');
			goLogin();
		}
		return false;
	};
	function wishListData (goods_no,th) {
		$.ajax( {
			url : '/mylotte/wish/category_wish_add.do?' + __commonParam,
			async: false,
			cache: true,
			data: {goods_no:goods_no},
			success: function ( data ) {
				alert(data);
				th.parent().addClass("on");
			}
		} );
	}
	
	function setFilterWrap () {

		// 최초 세션스토리지 DATA
		if ( location.href == _sessionURL ) {
			var _sessionFilterTabIndex = getSessionStorage( 'categoryProduct_filterTabIndex' ),
				_sessionFilterWrapData = getSessionStorage( 'categoryProduct_filterWrapData' ),
				_sessionEGScrollY1 = getSessionStorage( 'categoryProduct_EGScrollY1' ),
				_sessionEGScrollY2 = getSessionStorage( 'categoryProduct_EGScrollY2' );

			if ( _sessionFilterTabIndex )	_filterTabIndex = _sessionFilterTabIndex;
			if ( _sessionFilterWrapData )	_$categoryFilterWrap.html( _sessionFilterWrapData );
		}

		var _$filterWrap = _$categoryFilterWrap.find( '> ul' ),
			_$filterCategory = $( '#filterCategory' ),
			_$filterTab = _$filterWrap.find( '> li' ),
			_$filterList0 = _$filterTab.eq(0).find( '.filter_list ul > li' ),
			_$filterList1 = _$filterTab.eq(1).find( '.filter_list ul > li' ),
			_$filterList2 = _$filterTab.eq(2).find( '.filter_list ul > li' ),
			_$filterListWrap1 = _$filterTab.eq(1).find( '.filter_wrap' ),
			_$filterListWrap2 = _$filterTab.eq(2).find( '.filter_wrap' ),
			_$filterClose = _$filterTab.find( '.filter_close > a' ),
			_$filterOK = _$filterTab.find( '.filter_ok a' ),
			_$mallListWishList = $('.comment_wishlist').find( 'button' ),
			_$filterDimWrapon = $('.bg_filter_dim'),
			MOVE_EV = hasTouch ? 'touchmove' : 'mousemove'; // 20141226 필터바 위아래 스크롤 막기
		
		var _$ctgFilterList = _$categoryFilterWrap.find("li"),
			_$ctgFilterDim = _$categoryFilterWrap.find(".bg_filter_dim");

		//--- 20141226 미완료 처리시 관련 추가
		var _filterList1Index = 0,
			_filterList1Storage = _$filterCategory.find( '> ul' ).html();
			//_arrFilterList2Index = [];
		
		//_$filterCategory.on( 'click', 'label', filterList1ClickHandler );			//delegate
		// listener
		_$filterTab.find( '> a' ).on( 'click', filterTabClickHandler );
		_$filterOK.on( 'click', filterOKClickHandler );
		_$filterListWrap2.on( 'touchstart', filter2TouchStartHandler );
		_$filterList0.find( 'a' ).on( 'click', filterList0ClickHandler );
		_$filterList0.find( 'input' ).on( 'click', filterListInputClickHandler );

		_$filterCategory.on( 'click', 'label', filterList1ClickHandler );			//delegate
		_$filterCategory.on( 'click', 'input', filterListInputClickHandler );		//delegate
		_$filterBrand.on( 'click', 'label', filterList2ClickHandler );				//delegate
		_$filterBrand.on( 'click', 'input', filterListInputClickHandler );			//delegate
		_$mallListWishList.on( 'click', wishListClickHandler );					 //20141219 추가

		_$filterDimWrapon.on( 'touchstart', filterDimClickHandler );	 //20141229 안드로이드 4.3버전 대응
		_$filterDimWrapon.on( 'click', filterDimClickHandler );	
		
		// attr -> prop	checked 재설정
		_$filterWrap.find( '.filter_list input' ).each( function ( index ) {
			if ( $( this ).attr( 'checked' ) == 'checked' ) {
				$( this ).prop( 'checked', 'checked' );
			}
		} );

		//하단 필터바 스크롤( egScroll 생성 )
		_mcScroll0 = $( '#filterType' ).egScroll( true, false );																					//추천순 스크롤
		if( $("#filterCategory").length > 0 )		_mcScroll1 = $("#filterCategory").egScroll( true, false );										//카테고리 선택 스크롤 //20141226 이전페이지 대응
		if( $("#filterBrand").length > 0 ) {
			_mcScroll2 = $("#filterBrand").egScroll( true, false );
		} 
		// egScroll 생성 후 scbar 등록
		_$scBar1 = _$filterListWrap1.find( '.scbar' );
		_$scBar2 = _$filterListWrap2.find( '.scbar' );
		_scBarHeight = _$scBar2.height();
		_filterWrap2Height = _$filterListWrap2.height();
		if ( location.href == _sessionURL ) {
			if ( _sessionEGScrollY1 )	_mcScroll1.setY( _sessionEGScrollY1 );
			if ( _sessionEGScrollY2 )	_mcScroll2.setY( _sessionEGScrollY2 );
		}

		//--- 20141226 필터 리스트 스크롤 처리
		var _filterList1ScrollY = null;					
		_filterList1ScrollY = _mcScroll1._y();
		// 20141226 필터 리스트 스크롤 처리 ---//
		
		// 20141226 필터바 위아래 스크롤 막기
		$( '.filter_layer > h4' ).on( MOVE_EV, function (e) {
			e.preventDefault();
		} );
		$( '.filter' ).on( MOVE_EV, function (e) {
			e.preventDefault();
		} );

//---------------------------------------------------- handler

		// 필터 tab 클릭
		function filterTabClickHandler (e) {
			_filterTabIndex = $( this ).parent().index();
		}
		function filterDimClickHandler (e) {
			closeFilter();
			e.preventDefault();
		}
		// 브랜드선택 리스트 터치스크롤
		function filter2TouchStartHandler (e) {
			_$filterListWrap2.on( 'touchmove', filter2TouchMoveHandler );
			_$filterListWrap2.on( 'touchend', filter2TouchEndHandler );
		}
		function filter2TouchMoveHandler (e) {
			if ( parseInt( _$scBar2.css( 'top' ) ) + _scBarHeight > _filterWrap2Height * 0.9 ) {
				if ( _isBrandListLoadData )	loadBrandListData('more');			//브랜드선택 리스트 로드( ajax )
				else							_$filterListWrap2.off( 'touchstart', filter2TouchStartHandler );
			}
		}
		function filter2TouchEndHandler (e) {
			_$filterListWrap2.off( 'touchmove', filter2TouchMoveHandler );
			_$filterListWrap2.off( 'touchend', filter2TouchEndHandler );
		}

		// 필터 완료 버튼 클릭
		function filterOKClickHandler (e) {
			closeFilter();
			if( _filterTabIndex == 1 && $('input[name=filter02]:radio:checked').val() == undefined){
				alert('카테고리를 선택해주세요.');
				return false;
			}
			if ( _filterTabIndex == 1 ) {				// 카테고리 완료
				//_$filterTab.removeClass( 'filter_active' );
				//_$filterTab.eq(2).find( '.check_reset a' ).trigger( 'click' );
				if ( !_$filterList1.eq(0).find( 'input' ).is( ':checked' ) ) {
					_$filterTab.eq( _filterTabIndex ).addClass( 'filter_active' );
				}
				setParams('cate');
				//--- 20141226 미완료 처리시 관련 추가
				_filterList1Storage = _$filterCategory.find( '> ul ' ).html();
				_$filterCategory.find( 'input' ).each( function ( index ) {
					if ( $( this ).is( ':checked' ) ) {
						_filterList1Index = index;
					}
				} );
				_filterList1ScrollY = _mcScroll1._y();		// 20141226 필터 리스트 스크롤 처리
				_arrFilterList2Index = [];	//브랜드 선택 초기화
				_$filterTab.eq( 2 ).removeClass( 'filter_active' );
			} else if ( _filterTabIndex == 2 ) {		// 브랜드 완료
				chkLength = 0;
				_arrFilterList2Index = [];
				_$filterTab.eq( _filterTabIndex ).find( '.filter_list li' ).each( function ( index ) {
					if ( $( this ).find( 'input' ).attr( 'checked' ) == 'checked' ) {
						chkLength++;
						_arrFilterList2Index.push( index );
					}
				} );

				setParams('brand');
				if ( chkLength == 0 ) {
					// 선택X 완료
					_$filterTab.eq( _filterTabIndex ).removeClass( 'filter_active' );
					//return false;
				} else {
					// 선택O 완료
					//_$filterTab.removeClass( 'filter_active' );
					_$filterTab.eq( _filterTabIndex ).addClass( 'filter_active' );
					//_$filterTab.eq(1).find( '.category_reset a' ).trigger( 'click' );
				}
			}
			resetPage();
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
			return false;
		}

		// 필터 체크박스 클릭
		function filterListInputClickHandler (e) {
			var tag = 'label'
			if ( _filterTabIndex == 0 )	tag = 'a';
			else						tag = 'label';
			$( this ).siblings( tag ).trigger( 'click' );
		}

		// 정렬기준 리스트 클릭
		function filterList0ClickHandler (e) {
			var $this = $( this );
				$input = $this.siblings( 'input' );

			_$filterList0.find( 'input' ).removeAttr( 'checked' );
			$input.attr( 'checked', 'checked' ).prop( 'checked', 'checked' );
			_$filterTab.eq( _filterTabIndex ).find( '.filter > .filter_name' ).html( $this.html() );
			//_$filterTab.removeClass( 'filter_active' );
			closeFilter();
			resetPage();
			setParams('sort');
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
			return false;
		}

		// 브랜드 선택 리스트 클릭
		function filterList2ClickHandler (e) {
			var $this = $( this ),
				$input = $this.siblings( 'input' );

			if ( $input.attr( 'checked' ) == 'checked' )	$input.removeAttr( 'checked' );
			else											$input.attr( 'checked', 'checked' ).prop( 'checked', 'checked' );
			return false;
		}

		// 카테고리 선택 리스트 클릭
		function filterList1ClickHandler (e) {
			var $this = $( this ),
				$li = $this.parent();

			_$filterCategory.find( 'li' ).removeClass( 'on' );
			$li.addClass( 'on' );
			_$filterList1.find( 'input' ).removeAttr( 'checked' );
			$this.siblings( 'input' ).attr( 'checked', 'checked' ).prop( 'checked', 'checked' );

			//--- 20141229 카테고리 선택 리스트 재수정 kwkwon
			if ( $li.parent().parent().attr( 'id' ) == 'filterCategory' ) {
				if ( $li.index() == 0 ) {
					$( '#filterCategory > ul li' ).find( 'ul' ).each( function ( index ) {
						if ( $( this ).parent().parent().parent().attr( 'id' ) == 'filterCategory' ) {
							$( this ).slideDown( 'fast', 	_mcScroll1.refresh );
						} else {
							$( this ).slideUp( 'fast', _mcScroll1.refresh );
						}
					} );
				}
			} else {
				$li.siblings( 'li' ).find( 'ul' ).slideUp( 'fast', _mcScroll1.refresh );
				$li.parent().parent().siblings( 'li' ).find( '> ul > li ul' ).slideUp( 'fast', _mcScroll1.refresh );
				$li.find( '> ul' ).slideDown( 'fast', _mcScroll1.refresh );
			
				if ( $li.siblings( 'li' ).find( '> ul' ).length > 0 ) {
					$li.siblings( 'li' ).find( '> ul' ).each( function ( index ) {
						if ( $( this ).css( 'display' ) == 'block' ) {
							if ( $( this ).parent().index() < $li.index() ) {
								transitionFilterCategory( _mcScroll1._y() + $( this ).height() - $li.find( '> ul' ).height() );
							}
						}
					} );
				} else if ( $li.parent().parent().siblings( 'li' ).find( '> ul > li > ul' ).length > 0 ) {
					var $siblingsUl = $li.parent().parent().siblings( 'li' ).find( '> ul > li > ul' );
					if ( $siblingsUl.css( 'display' ) == 'block' ) {
						if ( $siblingsUl.parent().parent().parent().index() < $li.parent().parent().index() ) {
							transitionFilterCategory( _mcScroll1._y() + $siblingsUl.height() - $li.find( '> ul' ).height() );
						}
					}
				}

				function transitionFilterCategory ( scrollY ) {
					_mcScroll1.setY( scrollY );
					_$filterCategory.css( { '-webkit-transform': 'translateY( ' + scrollY + 'px )', '-webkit-transition': '0.3s ease 0s' } ).on( 'webkitTransitionEnd', completeTransition );
				}
				function completeTransition () {
					_mcScroll1.refresh();
					_$filterCategory.css( { '-webkit-transition': '0s ease 0s' } );
					_$filterCategory.off( 'webkitTransitionEnd', completeTransition );
				}
			}
			// 20141229 카테고리 선택 리스트 재수정 ---//

			if ( $li.parent().parent().attr( 'id' ) != 'filterCategory' ) {
				if ( $li.find( 'ul' ).length == 0 ) {
					loadCategoryListData( $li );
				}
			}

			return false;
		}

//---------------------------------------------------- mothod
		
		// 카테고리 선택 리스트 로드
		function loadCategoryListData ( $li ) {
			if($li.attr("leafYn") != 'Y'){	//리프카테고리 이면 조회 X
				$.ajax( {
					url: '/category/include/cate_list_ajax.do?'+__commonParam,
					async: false,
					cache: true,
					dataType: 'html',
					data: getParams(),
					success: function ( data ) {
						if ( $.trim( data ) ) {
							$li.append( $.trim( data ) );
							$li.find( '> ul' ).slideUp(0);
							$li.find( '> ul' ).slideDown( 'fast', _mcScroll1.refresh );
						}else{
							$li.attr("leafYn" , "Y");	// 데이터 없으면 리프
						}
					}
				} );
			}
			function getParams () {			// (D) ajax 호출시 data 전달
				var params = '&grpNo='+ grpNo,
					dataObj = $li.data();
				$.each( dataObj, function ( key, item ) {
					params += '&' + key + '=' + item;
				} );
				return params;
			}
		}

//----------------------------------------------------

		//필터 열기/닫기
		$(".filter").on("click", function(){
			var $self = $( this );

			if($self.parent("li").hasClass("filter_on")){
				$self.siblings(".filter_layer").stop().animate({bottom:-222},200);
				$self.parent("li").removeClass("filter_on")
				_$ctgFilterDim.removeClass("dim_on");
			}else if(_$ctgFilterList.hasClass("filter_on")){
				_$ctgFilterList.filter(".filter_on").find(".filter_layer").stop().animate({bottom:-222},200, function () {
					_$ctgFilterList.filter(".filter_on").removeClass("filter_on");
					$self.siblings(".filter_layer").stop().animate({bottom:54},200);
					$self.parent("li").addClass("filter_on");
				});
			}else{
				_$ctgFilterDim.addClass("dim_on");
				$self.siblings(".filter_layer").stop().animate({bottom:54},200);
				$self.parent("li").addClass("filter_on");
				history.pushState({filter:2}, "filter"); // 20141229-2 history back 키 눌렸을 때 이벤트처리
				//--- 20141226 미완료 처리시 관련 추가
				_$filterBrand.find( 'input' ).removeAttr( 'checked' );
				for ( var i = 0; i < _arrFilterList2Index.length; ++i ) {
					_$filterBrand.find( 'li' ).eq( _arrFilterList2Index[i] ).find( 'label' ).trigger( 'click' );
				}
				_$filterCategory.find( '> ul' ).html( _filterList1Storage );
				_$filterCategory.find( 'input' ).removeAttr( 'checked' );
				_$filterCategory.find( 'li' ).removeClass( 'on' );
				_$filterCategory.find( 'input' ).each( function ( index ) {
					if ( _filterList1Index == index ) {
						if ( index == 0 ) {
							var $filterList1 = $( '#filterCategory > ul li' );
							$filterList1.find( 'input' ).removeAttr( 'checked' );
							$filterList1.removeClass( 'on' );
							$filterList1.eq(0).addClass( 'on' ).find( 'input' ).prop( 'checked', 'checked' ).attr( 'checked', 'checked' );
							$filterList1.find( 'ul' ).each( function ( index ) {
								if ( $( this ).parent().parent().parent().attr( 'id' ) == 'filterCategory' ) {
									$( this ).slideDown( 'fast', 	_mcScroll1.refresh );
								} else {
									$( this ).slideUp( 'fast', _mcScroll1.refresh );
								}
							} );
						} else {
							$( this ).siblings( 'label' ).trigger( 'click' );
						}
					}
				} );
				_mcScroll1.refresh();
				//--- 20141226 필터 리스트 스크롤 처리				
				var brandListHeight = _$filterBrand.find( '> li' ).height(),
					brandListIdx = ( _arrFilterList2Index[0] ) ? _arrFilterList2Index[0] : 0,
					filterBrandY = -1 * brandListHeight * brandListIdx;

				if ( _mcScroll1 )		_mcScroll1.setY( _filterList1ScrollY );
				if ( _mcScroll2 )		_mcScroll2.setY( filterBrandY );
			};
			return false;
		});
		function closeFilter () {
			_$filterTab.eq( _filterTabIndex ).find( '>a' ).trigger( 'click' );
		}

		// 20141229-2 history back 키 눌렸을 때 이벤트처리
		window.addEventListener( "popstate", function(event){
			if (_$filterWrap.find(">.filter_on").length > 0){
				closeFilter();
			}
		}, false);
		
		//필터 닫기 버튼
		$(".filter_close > a").on("click", function(){
			var $layerWrap = $(this).parent("li").parent("ul").parent(".filter_layer");

			_$ctgFilterDim.removeClass("dim_on");
			$layerWrap.stop().animate({bottom:-222},200);
			$layerWrap.parent("li").removeClass("filter_on");
			return false;
		});

		//카테고리 리셋 버튼
		$(".category_reset > a").on("click", function(){
			_filterList1Index = 0;
			var $filterList1 = $( '#filterCategory > ul li' );
				$filterList1.find( 'input' ).removeAttr( 'checked' );
				$filterList1.removeClass( 'on' );
				$filterList1.eq(0).addClass( 'on' ).find( 'input' ).prop( 'checked', 'checked' ).attr( 'checked', 'checked' );

			$filterList1.find( 'ul' ).each( function ( index ) {
				if ( $( this ).parent().parent().parent().attr( 'id' ) == 'filterCategory' ) {
					$( this ).slideDown( 'fast', 	_mcScroll1.refresh );
				} else {
					$( this ).slideUp( 'fast', _mcScroll1.refresh );
				}
			} );
			
			var $input = $chkMall.find( 'input' );
			if ( $input.attr( 'checked' ) == 'checked' )	{
				$input.removeAttr( 'checked' );//롯데백화점 체크 해제
				sessionStorage.removeItem('categoryProduct_param_grpTp');
			}
			var $inputBranch = $chkMallBranch.find( 'input' );
			if ( $inputBranch.attr( 'checked' ) == 'checked' )	{
				$inputBranch.removeAttr( 'checked' );
				sessionStorage.removeItem('categoryProduct_param_branchNo');
				sessionStorage.removeItem('categoryProduct_param_branchYn');
			}
			
			//데이터 초기화
			closeFilter();
			resetPage();
			//removeParams();
			_arrFilterList2Index = [];
			_$filterTab.eq( 1 ).removeClass( 'filter_active' );
			_$filterTab.eq( 2 ).removeClass( 'filter_active' );
			setParams('cate');
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
			return false;
		});

		//체크박스 리셋 버튼
		$(".check_reset > a").on("click", function(){
			var $layerWrap = $(this).parent("li").parent("ul").siblings(".filter_wrap");
			$layerWrap.find( 'input' ).removeAttr( 'checked' );
			return false;
		});

	};
};
//==========================================================================//


var brandProduct = function () {
	var _$window = $( window ),
		_winHeight = $( window ).height();

	var _$categoryFilterWrap = $( '.category_filter_wrap' ),
		_$listWrapper = $( '.cateogry_mall_list' ), 
		_$listContainer = $( '.cateogry_mall_list > ul' ),
		_$noneAlert = $('<p class="none_list">조건에 맞는 상품이 없습니다.</p>'),
		_$mallBar = $( '.category_mall_filter' ),
		_$chkMall = null;

	var _filterTabIndex = null,
		_filterWrap2Height = null,
		_scBarHeight = null;

	var _isScrollLoadData = true,			// scroll data load flag
		_isBrandListLoadData = true;

	var _mcScroll0 = null,
		_mcScroll1 = null,
		_mcScroll2 = null;
	
	var _curDispNo = null,
		_title = null;
	
	var _page = 0,
		_last_goods_no = 0,
		_dpml_no = 0,
		_sort = null;
//---------------------------------------------------- init
	

	// 최초 세션스토리지 DATA
	
	var _sessionURL = getSessionStorage( 'categoryProduct_URL' ),
		_sessionMallBar = getSessionStorage( 'categoryProduct_mallBar' ),
		_sessionListData = getSessionStorage( 'categoryProduct_listData' ),
		_sessionScrollY = getSessionStorage( 'categoryProduct_scrollY' );
	if ( !_sessionListData || _sessionListData == -1 ) {
		// 세션X
		// 최초 Data Load
			sessionStorage.setItem("page", 0);
			resetPage();
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
	} else {
		if (location.href == _sessionURL) {
			// 세션O
			resetPage();
			_$listContainer.html( _sessionListData );
			if ( _sessionScrollY )	$( window ).scrollTop( _sessionScrollY );
			if ( _sessionMallBar )	_$mallBar.html( _sessionMallBar );
		} else {
			sessionStorage.setItem("page", 0);
			resetPage();
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
		}
	}

	_$chkMall = $( '.mall_checkbox' );

	// listener
	_$chkMall.find( 'label' ).on( 'click', chkMallLabelClickHandler );
	_$chkMall.find( 'input' ).on( 'click', chkMallInputClickHandler );
	//$( '.category_more' ).on( 'click', moreButtonHandler );			//20141224 더보기 추가 <추후 적용 예정>
	_$window.on( { 'scroll': winScrollHandler, 'resize': winResizeHandler, 'unload': winUnloadHandler } );

	if ( _$categoryFilterWrap.length == 1 ) {
		setFilterWrap();
	}
	removeSessionStorage();

//---------------------------------------------------- handler
	// 롯데백화점 상품 체크
	function chkMallLabelClickHandler (e) {
		var $input = _$chkMall.find( 'input' );
		if ( $input.attr( 'checked' ) == 'checked' )	 {
			$input.removeAttr( 'checked' );
			_dpml_no = 0;
		} else {
			$input.attr( 'checked', 'checked' ).prop( 'checked', 'checked' );
			_dpml_no = 2;
		}
		sessionStorage.setItem("page", 0);
		resetPage();
		appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );		// 20141224 로딩바 추가	(D) data load
		return false;
	}
	function chkMallInputClickHandler (e) {
		$( this ).siblings( 'label' ).trigger( 'click' );
	}

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
		if ( _mcScroll2 )		_mcScroll2.refresh();
	}

	// 브라우저 스크롤
	function winScrollHandler (e) {
		
		if ( _$window.scrollTop() + _winHeight > $( document ).height() - ( _winHeight / 4 ) ) {
			if ($("#wrapper").css("display") == "block"){					 // 20141222 카테고리 레이어 안열렸을시 실행함
				if ( _isScrollLoadData )		appendLoading( _$listContainer, false, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 0, 'more' );
				else						_$window.off( 'scroll', winScrollHandler );				//	data 빈값으로 들어온 후로는 ajax 호출 X
			}
		}
	}
	
	// 20141224 더보기 추가 <추후 적용 예정>
	// 더보기 버튼 클릭
	function moreButtonHandler (e) {
		if ($("#wrapper").css("display") == "block"){						// 카테고리 레이어 안열렸을시 실행함
			appendLoading( _$listContainer, false, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif' );
		}
		return false;
	}

//---------------------------------------------------- method

	// loadData
	function loadData ($loading, type) {
		_$window.off( 'scroll', winScrollHandler );				//20141224 추가
		
		_curDispNo = _curDispNo == null ? $('#curDispNo').val() : _curDispNo;
		$.ajax( {
			url: '/category/m/brand_prod_list_unit_ajax.do?' + __commonParam,		// (D) ajax load 경로
			//async: false,
			cache: true,
			dataType: 'html',
			data: getParams(),
			success: function ( data ) {
				$loading.remove();							//20141224 추가
				_$window.on( 'scroll', winScrollHandler );		//20141224 추가
				
				if ( !$.trim( data ) ) {
					_isScrollLoadData = false;
					if(type == null || type == undefined) $('.total_count').text('전체 0개');	//더보기가 아닌 데이터 조회시 0개 처리
					
					if(_$listContainer.find('>li').length == 0){ 
						_$listWrapper.append(_$noneAlert); 
					}
				} else {
					_$noneAlert.remove();
					_$listContainer.append( data );
					$('.comment_wishlist').find( 'button' ).on( 'click', wishListClickHandler );		/* 20141226 스크립트 위치 이동 - 위시리스트 초기 init 오류 수정 */
				}
				
				$(".countBox > .count").html($(".cateogry_mall_list > ul > li").length + "/" + $("p.total_count").attr("data"));
                $(".countBox").show(0);
                setTimeout(function(){
                    $(".countBox").hide(0);
                }, 2000);
				
			}, error: function(xhr, status, error){
				//console.log(error);
			}
		} );
		function getParams () {		// (D) ajax 호출시 data 전달
			var params = '';
			params += '&curDispNo='+ _curDispNo;
			_page = parseInt((sessionStorage.getItem("page") == null ? 0 : sessionStorage.getItem("page") )) + 1;
			params += '&page='+ _page;
			sessionStorage.setItem("page", _page);
			
			_sort = (_sort == null) ? 10 : _sort;
			
			if(_sort == 10){
				_last_goods_no = (_page == 1) ? 0 : sessionStorage.getItem("last_goods_no");
				params += '&last_goods_no='+ _last_goods_no;
				params += '&navi=forward';
			}
			
			params += '&dpml_no=' + _dpml_no;
			
			params += '&sort=' + _sort;
			
			params += '&title=' + _title;
			return params;
		}
	}

	function resetPage () {
		_$listContainer.html( ' ' );
		_$window.scrollTop(0);
	}

	function addSessionStorage () {
		setSessionStorage( 'categoryProduct_URL', location.href );
		setSessionStorage( 'categoryProduct_listData', _$listContainer.html() );
		setSessionStorage( 'categoryProduct_mallBar', _$mallBar.html() );
		setSessionStorage( 'categoryProduct_scrollY', _$window.scrollTop() );

		if ( _$categoryFilterWrap.length == 1 ) {
			setSessionStorage( 'categoryProduct_filterTabIndex', _filterTabIndex );
			setSessionStorage( 'categoryProduct_filterWrapData',  _$categoryFilterWrap.html() );
			setSessionStorage( 'categoryProduct_EGScrollY1', _mcScroll1._y() );
			setSessionStorage( 'categoryProduct_EGScrollY2', _mcScroll2._y() );
		}
	}

	function removeSessionStorage () {
		sessionStorage.removeItem( 'categoryProduct_URL' );
		sessionStorage.removeItem( 'categoryProduct_listData' );
		sessionStorage.removeItem( 'categoryProduct_mallBar' );
		sessionStorage.removeItem( 'categoryProduct_scrollY' );

		if ( _$categoryFilterWrap.length == 1 ) {
			sessionStorage.removeItem( 'categoryProduct_filterTabIndex' );
			sessionStorage.removeItem( 'categoryProduct_filterWrapData' );
			sessionStorage.removeItem( 'categoryProduct_EGScrollY1' );
			sessionStorage.removeItem( 'categoryProduct_EGScrollY2' );
		}
	}

	//위시리스트 담기 클릭
	function wishListClickHandler (e) {
		if(loginChk()){
			wishListData ($(this).val(),$(this));
		}else{
			alert('로그인 후 이용하실 수 있습니다.');
			goLogin();
		}
		return false;
	};	
	function wishListData (goods_no,th) {
		$.ajax( {
			url : '/mylotte/wish/category_wish_add.do?' + __commonParam,
			async: false,
			cache: true,
			data: {goods_no:goods_no},
			success: function ( data ) {
				alert(data);
				th.parent().addClass("on");
			}
		} );
	}
	
//-------------------------------------------------------------------------------- setFilterWrap()

	function setFilterWrap () {

		// 최초 세션스토리지 DATA
		if ( location.href == _sessionURL ) {
			var _sessionFilterTabIndex = getSessionStorage( 'categoryProduct_filterTabIndex' ),
				_sessionFilterWrapData = getSessionStorage( 'categoryProduct_filterWrapData' ),
				_sessionEGScrollY1 = getSessionStorage( 'categoryProduct_EGScrollY1' ),
				_sessionEGScrollY2 = getSessionStorage( 'categoryProduct_EGScrollY2' );

			if ( _sessionFilterTabIndex )	_filterTabIndex = _sessionFilterTabIndex;
			if ( _sessionFilterWrapData )	_$categoryFilterWrap.html( _sessionFilterWrapData );
		}

		var _$filterWrap = _$categoryFilterWrap.find( '> ul' ),
		_$filterCategory = $( '#filterCategory' ),
			_$filterBrand = $( '#filterBrand ul' ),
			_$filterTab = _$filterWrap.find( '> li' ),
			_$filterList0 = _$filterTab.eq(0).find( '.filter_list ul > li' ),
			_$filterList1 = _$filterTab.eq(1).find( '.filter_list ul > li' ),
			_$filterList2 = _$filterTab.eq(2).find( '.filter_list ul > li' ),
			_$filterListWrap1 = _$filterTab.eq(1).find( '.filter_wrap' ),
			_$filterListWrap2 = _$filterTab.eq(2).find( '.filter_wrap' ),
			_$filterClose = _$filterTab.find( '.filter_close > a' ),
			_$filterOK = _$filterTab.find( '.filter_ok a' ),
			_$mallListWishList = $('.comment_wishlist').find( 'button' );
			_$filterDimWrapon = $('.bg_filter_dim'); //20141224 dim 클릭시 닫힘 추가
			MOVE_EV = hasTouch ? 'touchmove' : 'mousemove'; // 20141226 필터바 위아래 스크롤 막기

		var _$ctgFilterList = _$categoryFilterWrap.find("li"),
			_$ctgFilterDim = _$categoryFilterWrap.find(".bg_filter_dim");
		
		//--- 20141226 미완료 처리시 관련 추가
		var _filterList1Index = 0,
			_filterList1Storage = _$filterCategory.find( '> ul' ).html(),
			_arrFilterList2Index = [];

		// listener
		_$filterTab.find( '> a' ).on( 'click', filterTabClickHandler );
		_$filterOK.on( 'click', filterOKClickHandler );
		_$filterListWrap2.on( 'touchstart', filter2TouchStartHandler );
		_$filterList0.find( 'a' ).on( 'click', filterList0ClickHandler );
		_$filterList0.find( 'input' ).on( 'click', filterListInputClickHandler );

		_$filterCategory.on( 'click', 'label', filterList1ClickHandler );			//delegate
		_$filterCategory.on( 'click', 'input', filterListInputClickHandler );		//delegate
		_$filterBrand.on( 'click', 'label', filterList2ClickHandler );				//delegate
		_$filterBrand.on( 'click', 'input', filterListInputClickHandler );			//delegate
		_$mallListWishList.on( 'click', wishListClickHandler );
		
		_$filterDimWrapon.on( 'touchstart', filterDimClickHandler );	 //20141229 안드로이드 4.3버전 대응
		_$filterDimWrapon.on( 'click', filterDimClickHandler );	

		// attr -> prop	checked 재설정
		_$filterWrap.find( '.filter_list input' ).each( function ( index ) {
			if ( $( this ).attr( 'checked' ) == 'checked' ) {
				$( this ).prop( 'checked', 'checked' );
			}
		} );

		//하단 필터바 스크롤( egScroll 생성 )
		_mcScroll0 = $( '#filterType' ).egScroll( true, false );																					//추천순 스크롤
		if( $("#filterCategory").length > 0 )		_mcScroll1 = $("#filterCategory").egScroll( true, false );										//카테고리 선택 스크롤 //20141226 이전페이지 대응
		if( $("#filterBrand").length > 0 ) {
			_mcScroll2 = $("#filterBrand").egScroll( true, false );
		} 

		// egScroll 생성 후 scbar 등록
		_$scBar1 = _$filterListWrap1.find( '.scbar' );
		_$scBar2 = _$filterListWrap2.find( '.scbar' );
		_scBarHeight = _$scBar2.height();
		_filterWrap2Height = _$filterListWrap2.height();
		if ( location.href == _sessionURL ) {
			if ( _sessionEGScrollY1 )	_mcScroll1.setY( _sessionEGScrollY1 );
			if ( _sessionEGScrollY2 )	_mcScroll2.setY( _sessionEGScrollY2 );
		}
		
		//--- 20141226 필터 리스트 스크롤 처리
		var _filterList1ScrollY = null;					
		_filterList1ScrollY = _mcScroll1._y();
		// 20141226 필터 리스트 스크롤 처리 ---//
		
		// 20141226 필터바 위아래 스크롤 막기
		$( '.filter_layer > h4' ).on( MOVE_EV, function (e) {
			e.preventDefault();
		} );
		$( '.filter' ).on( MOVE_EV, function (e) {
			e.preventDefault();
		} );
		
		//--- 20141229 브랜드몰 카테고리 선택 디폴트값 수정
		_$filterCategory.find( 'input' ).each( function ( index ) {
			if ( $( this ).is( ':checked' ) ) {
				_filterTabIndex = 1;
			}

			if ( $( this ).is( ':checked' ) ) {
				_filterList1Index = index;
				if ( _$filterWrap.attr( 'class' ) == 'filter_two' ) {
					if ( _filterList1Index != 0 )		_$filterTab.eq( _filterTabIndex ).addClass( 'filter_active' );
					else							_$filterTab.eq( _filterTabIndex ).removeClass( 'filter_active' );
				} else {
					_$filterTab.eq( _filterTabIndex ).addClass( 'filter_active' );
				}
			}
		} );
		// 20141229 브랜드몰 카테고리 선택 디폴트값 수정 ---//

//---------------------------------------------------- handler

		// 필터 tab 클릭
		function filterTabClickHandler (e) {
			_filterTabIndex = $( this ).parent().index();
		}
		
		// 20141224 dim 클릭시 닫힘 추가
		// 필터 Dim 클릭
		function filterDimClickHandler (e) {
			closeFilter();
			e.preventDefault();
		}

		// 브랜드선택 리스트 터치스크롤
		function filter2TouchStartHandler (e) {
			_$filterListWrap2.on( 'touchmove', filter2TouchMoveHandler );
			_$filterListWrap2.on( 'touchend', filter2TouchEndHandler );
		}
		function filter2TouchMoveHandler (e) {
			if ( parseInt( _$scBar2.css( 'top' ) ) + _scBarHeight > _filterWrap2Height * 0.9 ) {
				if ( _isBrandListLoadData )	loadBrandListData();			//브랜드선택 리스트 로드( ajax )
				else							_$filterListWrap2.off( 'touchstart', filter2TouchStartHandler );
			}
		}
		function filter2TouchEndHandler (e) {
			_$filterListWrap2.off( 'touchmove', filter2TouchMoveHandler );
			_$filterListWrap2.off( 'touchend', filter2TouchEndHandler );
		}

		// 필터 완료 버튼 클릭
		function filterOKClickHandler (e) {
			closeFilter();
			if ( _filterTabIndex == 1 ) {				// 카테고리 완료
				
				//--- 20141229 브랜드몰 카테고리 선택 디폴트값 수정

				_filterList1Storage = _$filterCategory.find( '> ul ' ).html();
				_$filterCategory.find( 'input' ).each( function ( index ) {
					if ( $( this ).is( ':checked' ) ) {
						_filterList1Index = index;
						if ( _$filterWrap.attr( 'class' ) == 'filter_two' ) {
							if ( _filterList1Index != 0 )		_$filterTab.eq( _filterTabIndex ).addClass( 'filter_active' );
							else							_$filterTab.eq( _filterTabIndex ).removeClass( 'filter_active' );
						} else {
							_$filterTab.eq( _filterTabIndex ).addClass( 'filter_active' );
						}
					}
				} );
				_filterList1ScrollY = _mcScroll1._y();		// 20141226 필터 리스트 스크롤 처리
				
				// 20141229 브랜드몰 카테고리 선택 디폴트값 수정 ---//
				
				/*
				_$filterTab.removeClass( 'filter_active' );
				_$filterTab.eq( _filterTabIndex ).addClass( 'filter_active' );
				*/
				//_$filterTab.eq(2).find( '.check_reset a' ).trigger( 'click' );
				
				var chkValue = $(":radio[name='filter02']:checked").val();
				//alert(_curDispNo);
				chkValue = chkValue.split(",");
				//alert(_curDispNo[0]+" "+_curDispNo[1]);
				_curDispNo = chkValue[0];
				_title = chkValue[1];
				$("#head_sub span").text(_title);
				sessionStorage.setItem("page", 0);
				_isScrollLoadData = true;
				
				//--- 20141226 미완료 처리시 관련 추가
				/*
				_filterList1Storage = _$filterCategory.find( '> ul ' ).html();
				_$filterCategory.find( 'input' ).each( function ( index ) {
					if ( $( this ).is( ':checked' ) ) {
						_filterList1Index = index;
					}
				} );
				*/
			} else if ( _filterTabIndex == 2 ) {		// 브랜드 완료
				var chkLength = 0;
				_arrFilterList2Index = [];
				_$filterTab.eq( _filterTabIndex ).find( '.filter_list li' ).each( function ( index ) {
					if ( $( this ).find( 'input' ).attr( 'checked' ) == 'checked' ) {
						chkLength++;
						_arrFilterList2Index.push( index );
					}
				} );

				if ( chkLength == 0 ) {
					// 선택X 완료
					_$filterTab.eq( _filterTabIndex ).removeClass( 'filter_active' );
					return false;
				} else {
					// 선택O 완료
					_$filterTab.removeClass( 'filter_active' );
					_$filterTab.eq( _filterTabIndex ).addClass( 'filter_active' );
					_$filterTab.eq(1).find( '.category_reset a' ).trigger( 'click' );
				}
			}
			resetPage();
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );			// 20141224 로딩바 추가
			return false;
		}

		// 필터 체크박스 클릭
		function filterListInputClickHandler (e) {
			var tag = 'label'
			if ( _filterTabIndex == 0 )	tag = 'a';
			else						tag = 'label';
			$( this ).siblings( tag ).trigger( 'click' );
		}

		// 정렬기준 리스트 클릭
		function filterList0ClickHandler (e) {
			var $this = $( this );
				$input = $this.siblings( 'input' );

			_$filterList0.find( 'input' ).removeAttr( 'checked' );
			$input.attr( 'checked', 'checked' ).prop( 'checked', 'checked' );
			_$filterTab.eq( _filterTabIndex ).find( '.filter > .filter_name' ).html( $this.html() );
			//_$filterTab.removeClass( 'filter_active' );
			closeFilter();
			
			sessionStorage.setItem("sort", $input.val());
			_sort = sessionStorage.getItem("sort");
			sessionStorage.setItem("page", 0);
			_isScrollLoadData = true;
			
			resetPage();
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );			// 20141224 로딩바 추가
			return false;
		}

		// 브랜드 선택 리스트 클릭
		function filterList2ClickHandler (e) {
			var $this = $( this ),
				$input = $this.siblings( 'input' );

			if ( $input.attr( 'checked' ) == 'checked' )	$input.removeAttr( 'checked' );
			else											$input.attr( 'checked', 'checked' ).prop( 'checked', 'checked' );
			return false;
		}

		// 카테고리 선택 리스트 클릭
		function filterList1ClickHandler (e) {
			var $this = $( this ),
				$li = $this.parent();

			_$filterCategory.find( 'li' ).removeClass( 'on' );
			$li.addClass( 'on' );
			_$filterList1.find( 'input' ).removeAttr( 'checked' );
			$this.siblings( 'input' ).attr( 'checked', 'checked' ).prop( 'checked', 'checked' );

			$li.siblings( 'li' ).find( 'ul' ).slideUp( 'fast' );
			$li.parent().parent().siblings( 'li' ).find( 'ul' ).slideUp( 'fast' );
			$li.find( '> ul' ).slideDown( 'fast', _mcScroll1.refresh );

			if ( $li.parent().parent().attr( 'id' ) != 'filterCategory' ) {
				if ( $li.find( 'ul' ).length == 0 ) {
					loadCategoryListData( $li );
				}
			}

			return false;
		}

//---------------------------------------------------- mothod
		
		

		// 카테고리 선택 리스트 로드
		function loadCategoryListData ( $li ) {
			$.ajax( {
				url: '../sampledata/category_product_categoryList.html',		// (D) ajax load 경로
				async: false,
				cache: true,
				dataType: 'html',
				data: getParams(),
				success: function ( data ) {
					if ( $.trim( data ) ) {
						$li.append( $.trim( data ) );
						$li.find( '> ul' ).slideDown( 'fast', _mcScroll1.refresh );
					}
				}
			} );
			function getParams () {			// (D) ajax 호출시 data 전달
				var params = '',
					dataObj = $li.data();
				$.each( dataObj, function ( key, item ) {
					params += '&' + key + '=' + item;
				} );
				return params;
			}
		}
		
		var chk = 0;
		
		// 브랜드선택 리스트 로드
		function loadBrandListData () {
			$.ajax( {
				url: '../sampledata/category_product_brandList.html',		// (D) ajax load 경로
				async: false,
				cache: true,
				dataType: 'html',
				data: getParams(),
				success: function ( data ) {
					if ( !$.trim( data ) ) {
						_isScrollLoadData = false;
					}
					_$filterBrand.append( data );

					// EGScroll refresh
					_mcScroll2.refresh();
					_scBarHeight = _$scBar2.height();
				}
			} );
			function getParams () {			// (D) ajax 호출시 data 전달
				var params = '';

				return params;
			}
		}

//----------------------------------------------------

		//필터 열기/닫기
		$(".filter").on("click", function(){
			var $self = $( this );

			if($self.parent("li").hasClass("filter_on")){
				$self.siblings(".filter_layer").stop().animate({bottom:-222},200);
				$self.parent("li").removeClass("filter_on")
				_$ctgFilterDim.removeClass("dim_on");
			}else if(_$ctgFilterList.hasClass("filter_on")){
				_$ctgFilterList.filter(".filter_on").find(".filter_layer").stop().animate({bottom:-222},200, function () {
					_$ctgFilterList.filter(".filter_on").removeClass("filter_on");
					$self.siblings(".filter_layer").stop().animate({bottom:54},200);
					$self.parent("li").addClass("filter_on");
				});
			}else{
				_$ctgFilterDim.addClass("dim_on");
				$self.siblings(".filter_layer").stop().animate({bottom:54},200);
				$self.parent("li").addClass("filter_on");
				history.pushState({filter:2}, "filter"); // 20141229-2 history back 키 눌렸을 때 이벤트처리
				//--- 20141226 미완료 처리시 관련 추가
				_$filterBrand.find( 'input' ).removeAttr( 'checked' );
				for ( var i = 0; i < _arrFilterList2Index.length; ++i ) {
					_$filterBrand.find( 'li' ).eq( _arrFilterList2Index[i] ).find( 'label' ).trigger( 'click' );
				}
				_$filterCategory.find( '> ul' ).html( _filterList1Storage );
				//_$filterCategory.find( 'input' ).removeAttr( 'checked' );
				//_$filterCategory.find( 'li' ).removeClass( 'on' );
				_$filterCategory.find( 'input' ).each( function ( index ) {
					if ( _filterList1Index == index ) {
						if ( index == 0 ) {
							var $filterList1 = $( '#filterCategory > ul li' );
							$filterList1.find( 'input' ).removeAttr( 'checked' );
							//$filterList1.removeClass( 'on' );
							$filterList1.eq(0).addClass( 'on' ).find( 'input' ).prop( 'checked', 'checked' ).attr( 'checked', 'checked' );
							$filterList1.find( 'ul' ).each( function ( index ) {
								if ( $( this ).parent().parent().parent().attr( 'id' ) == 'filterCategory' ) {
									$( this ).slideDown( 'fast', 	_mcScroll1.refresh );
								} else {
									$( this ).slideUp( 'fast', _mcScroll1.refresh );
								}
							} );
						} else {
							$( this ).siblings( 'label' ).trigger( 'click' );
						}
					}
				});
				_mcScroll1.refresh();
				
				//--- 20141226 필터 리스트 스크롤 처리				
				var brandListHeight = _$filterBrand.find( '> li' ).height(),
					brandListIdx = ( _arrFilterList2Index[0] ) ? _arrFilterList2Index[0] : 0,
					filterBrandY = -1 * brandListHeight * brandListIdx;

				if ( _mcScroll1 )		_mcScroll1.setY( _filterList1ScrollY );
				if ( _mcScroll2 )		_mcScroll2.setY( filterBrandY );
				// 20141226 필터 리스트 스크롤 처리 ---//
			};
			return false;
		});
		function closeFilter () {
			_$filterTab.eq( _filterTabIndex ).find( '>a' ).trigger( 'click' );
		}
		
		// 20141229-2 history back 키 눌렸을 때 이벤트처리
		window.addEventListener( "popstate", function(event){
			if (_$filterWrap.find(">.filter_on").length > 0){
				closeFilter();
			}
		}, false);

		//필터 닫기 버튼
		$(".filter_close > a").on("click", function(){
			var $layerWrap = $(this).parent("li").parent("ul").parent(".filter_layer");

			_$ctgFilterDim.removeClass("dim_on");
			$layerWrap.stop().animate({bottom:-222},200);
			$layerWrap.parent("li").removeClass("filter_on");
			return false;
		});

		//카테고리 리셋 버튼
		$(".category_reset > a").on("click", function(){
			_filterList1Index = 0;
			var $filterList1 = $( '#filterCategory > ul li' );
				$filterList1.find( 'input' ).removeAttr( 'checked' );
				$filterList1.removeClass( 'on' );
				$filterList1.eq(0).addClass( 'on' ).find( 'input' ).prop( 'checked', 'checked' ).attr( 'checked', 'checked' );

			$filterList1.find( 'ul' ).each( function ( index ) {
				if ( $( this ).parent().parent().parent().attr( 'id' ) == 'filterCategory' ) {
					$( this ).slideDown( 'fast', 	_mcScroll1.refresh );
				} else {
					$( this ).slideUp( 'fast', _mcScroll1.refresh );
				}
			} );
			
			if ( _$chkMall.find( 'input' ).attr( 'checked' ) == 'checked' )	_$chkMall.find( 'input' ).removeAttr( 'checked' );//롯데백화점 체크 해제
			
			//데이터 초기화
			closeFilter();
			resetPage();
			sessionStorage.setItem("page", 0);
			_curDispNo = $("#beforeNo").val();
			$("#head_sub span").text("전체상품");
			_$filterTab.removeClass( 'filter_active' );
			appendLoading( _$listContainer, true, loadData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw_gray.gif', 20 );
			return false;
		});

		//체크박스 리셋 버튼
		$(".check_reset > a").on("click", function(){
			var $layerWrap = $(this).parent("li").parent("ul").siblings(".filter_wrap");
			$layerWrap.find( 'input' ).removeAttr( 'checked' );
			return false;
		});

	};
};

//==========================================================================//

/*
* lotte.com moblie middle
* 2014.11.26 _ksg
*/

var categoryMiddle = function () {
	var _url = '/category/m/cate_brand_list.do?'+__commonParam;			//(D) ajax load 경로

	var _$tab = $( '.list-tab' ),
		_$tabA = $( '.list-tab > a' ),
		_$brandList = $( '.brand_list' ),
		_$curDispNo = $('#curDispNo').val();
		_$lrgCateIndex = $('#idx').val();

	var _$arrBtn = [[], []];

	var _tabIndex = 0,
		_btnIndex = null,
		_sessionData = null;
	
	//도서 음반 카테고리에서는 브랜드 초성검색 비노출
	if(_$curDispNo == 5522485 || _$curDispNo == 5522486 || _$curDispNo == 5522487 || _$curDispNo == 5522488){
		$('.category_brand_find').css('display', 'none');
	}

	// (D) ㄱㄴㄷ	_tabIndex = 0; 
	//				_btnIndex = 0 ~ 26; ( ALL : 26 )
	// (D)  A B C	_tabIndex = 1; 
	//				_btnIndex = 0 ~ 14; ( 전체 : 14 )
	
	// tab 클릭
	_$tabA.on( 'click', function (e) {
		var clickIdx = $( this ).parent().index();
		activateTab( clickIdx );
		
		_$brandList.html( '' );
		offBtn();
		
		$(".noList.result").hide();

		return false;
	} );
	
	( function setBtn () {
		for ( var i = 0; i < _$arrBtn.length; ++i ) {
			for( var j = 0; j < _$tab.eq(i).find( 'ul li' ).length; ++j ) {
				_$arrBtn[i][j] = _$tab.eq(i).find( 'ul li' ).eq( j );
				_$arrBtn[i][j].find( 'a' ).on( 'click', btnClickHandler );
			}
		}
	} () );

	// 자음( btn ) 클릭
	function btnClickHandler (e) {
		var clickTabIdx = $( this ).parent().parent().parent().index(),
			clickBtnIdx = $( this ).parent().index();

		if ( _tabIndex == clickTabIdx && _btnIndex == clickBtnIdx ) {
			return false;
		}
		_tabIndex = clickTabIdx;
		_btnIndex = clickBtnIdx;
		
		offBtn();
		_$arrBtn[_tabIndex][_btnIndex].addClass( 'on' );
		appendList();

		return false;
	}
	
	// tab 활성화
	function activateTab ( idx ) {
		for ( var i = 0; i < _$tabA.length; ++i ) {
			if ( i == idx )	_$tabA.eq(i).parent().addClass( 'on' );
			else			_$tabA.eq(i).parent().removeClass( 'on' );
		}
	}
	
	// 전체 버튼 off
	function offBtn () {
		for ( var i = 0; i < _$arrBtn.length; ++i ) {
			for ( var j = 0; j < _$arrBtn[i].length; ++j ) {
				_$arrBtn[i][j].removeClass( 'on' );
			}
		}
	}

	// ajax load
	function appendList () {
		//--- *20141224 로딩바 추가
		var i = null,
			j = null;

		var loadAjax = function ( $loading ) {
			$.ajax( {
				url: _url,
				//async: false,
				cache : true,
				data: getParams(),
				success: function ( data ) {
					$loading.remove();
					_$brandList.empty();
					_$brandList.append( data );
					//setSessionStorage( 'categoryBrand_html', _$brandList.html() );
					for ( i = 0; i < _$arrBtn.length; ++i ) {
						for( j = 0; j < _$tab.eq(i).find( 'ul li' ).length; ++j ) {
							_$arrBtn[i][j].find( 'a' ).on( 'click', btnClickHandler );
						}
					}
					//20141229 추가 : 초성검색 후 에니메이션 추가
					
					setTimeout(function(){
						ytarget_pos = 105 + $(".category_middle_list").height();

						$('html, body').animate({scrollTop:ytarget_pos});
					},300);
					
					if($('.brand_list > li').length == 0) {	//검색결과가 없는 경우 
						$(".noList.result").show();
					} else {
						$(".noList.result").hide();
					}
				}
			} );
		}
		for ( i = 0; i < _$arrBtn.length; ++i ) {
			for( j = 0; j < _$tab.eq(i).find( 'ul li' ).length; ++j ) {
				_$arrBtn[i][j].find( 'a' ).off( 'click', btnClickHandler );
			}
		}
		appendLoading( _$brandList, true, loadAjax, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif', 0 );
	}
	
	
	// data 전달
	function getParams () {
		var params = '';								
		params += '&tabIndex=' + _tabIndex;		// (D) tab index ( ㄱㄴㄷ: 0, ABC: 1 )
		params += '&btnIndex=' + _btnIndex;		// (D) 자음 버튼 index
		params += '&curDispNo=' + _$curDispNo;		// 전시번호
		params += '&cateDiv=MIDDLE';
		if(_$lrgCateIndex == 9){
			params += '&dpmlNo=2';
		} else if (_$lrgCateIndex == 10){
			params += '&dpmlNo=11';
		} else {
			params += '&dpmlNo=1';
		}
		params += '&idx=' + _$lrgCateIndex;
		//params += (_$lrgCateIndex == 9) ? '&dpmlNo=2' : '&dpmlNo=1';
			
		return params;
	}
	
	//브랜드 초성검색 ㄱㄴㄷ 디폴트
	activateTab(0);

	offBtn();
	
};
//==========================================================================//

/*
* lotte.com moblie brand
* 2014.11.25 _knu
*/

$(document).ready(function(){

	/* 브랜드몰 메인 브랜드 카테고리 전체보기/접기 */
	if($(".category_brand_list").length > 0){
		$(function(){
			var $ctgBrandWrap = $(".category_brand_list");
			var $ctgBrandList = $ctgBrandWrap.find(".list_wrap");
			var BrandListLength = $ctgBrandList.find("> ul > li").length;
			var BrandListHeight = $ctgBrandList.find("> ul").height();
			var $ctgBrandBtn = $ctgBrandWrap.find("> .btn_category_all");
			
			if(BrandListLength > 6){
				$ctgBrandWrap.addClass("bnd_cnt_bar");
				$ctgBrandBtn.on("click", function(){
					if($ctgBrandWrap.hasClass("on") == false){
						$ctgBrandWrap.addClass("on");
						$ctgBrandList.stop().animate({height:BrandListHeight});
						$ctgBrandBtn.find("span").html("카테고리 접기")
					} else{
						$ctgBrandWrap.removeClass("on");
						$ctgBrandList.stop().animate({height:0});
						$ctgBrandBtn.find("span").html("카테고리 전체보기")
					};
					return false;
				});
			}else{
				$ctgBrandBtn.remove();
			}
		});
	};

	/* 브랜드몰 메인 기획전 리스트 중단 배너 탭 */
	if($("#banner_list").length > 0){
		if($("#banner_list > li").length > 1){
			$(function(){
				$bannerWrapper = $("#banner_list");
				$bannerList = $bannerWrapper.find("li");
				$bannerTabWrapper = $(".banner_tab_list");
				bannerLength = $bannerList.length;
				
				for(i = 0; i < bannerLength; i++) {
					$bannerTabWrapper.append('<li>&nbsp;</li>');
				};
				$bannerTabWrapper.find("li").eq(0).addClass("on"); //초기탭 활성화
				
				var $bannerSlide = setEGSlide("#banner_list", function(index){	//index 는 현재 위치 : 1 부터시작
					$bannerTabWrapper.find("li").removeClass("on");
					$bannerTabWrapper.find("li").eq(index-1).addClass("on");
				}, true);
			});
		}else{
			$("#banner_list > li").css({paddingBottom:10}); // 20141226 1개일 경우 아래 여백 조정
		};
	};
});

//20141224 로딩바 추가
/*20150726 - jhchoi - category_*_v*.js //pub_brandshop_gucci.js // pub_category_*_v*.js 3군데에서 로딩바처리(?) ----- */
function appendLoading ( $parent, isEmpty, completeLoadingFunc, src, top , type) {		
	var $loading = $( '<div class="loading_wrap"><p class="loading half"></p></div><img style="display:none;" class="loading" src=' + src + ' alt="loading..."><br />' );
	$loading.on( 'load', function () {
		if ( isEmpty ) {
			$parent.empty();
		}
		if($(".none_list").length > 0){
			$(".none_list").remove(); //[긴급2]로딩바 이전 검색결과없음 텍스트 삭제
		};
		$parent.append( $loading );
		$loading.css( { 'position': 'relative', 'width': 'auto', 'top': top } );
		//$loading.css( { 'width': $loading.width() / 2 }  );
		//$loading.css( { 'left': parseInt( ( $parent.width() - $loading.width() ) /2 ) } );
		completeLoadingFunc( $loading , type);
	} );
}
/* Tclick */
function setTclick(tclick){
	/*console.log("tclick(jsp1) : " + tclick); 테스트 후 삭제*/
	$("#tclick_iframe").remove();
	setTimeout(function(){
		var iframe = document.createElement('iframe');
		iframe.id = 'tclick_iframe';
		iframe.style.visibility = 'hidden';
		iframe.style.display = "none";
		iframe.src = "/exevent/tclick.jsp?" + __commonParam + "&tclick=" + tclick;//__defaultDomain : html_meta_2014.jsp
		document.body.appendChild(iframe);
	},1000);
}
function sendTclick(code) {
	/*console.log("tclick(jsp2) : " + code); 테스트 후 삭제*/
};