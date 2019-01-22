/*
*****************************************************
* 액션바 관련 수정 2015-07-22 추가 및 수정(jhchoi) START 
*/

/*
App 이 호출하는 함수
1.showSideCtg (좌측 카테고리 레이어)
2.openSideMylotte (마이롯데 레이어)
3.openSrhLayer (검색 레이어)
4.removeLatestItems (최근 본 상품 전체 삭제)
*/

/*Device check*/
var isIos = (/ipad|iphone/i.test(navigator.userAgent.toLowerCase())),
isIphone = (navigator.userAgent.match('iPhone') != null),
isIpad = (navigator.userAgent.match('iPad') != null),
isAndroid = (navigator.userAgent.match('Android') != null),
isTablet = (/ipad|xoom|sm-t800|sm-t320|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));

var isShowSideCtg = false, /*카테고리 레이어 활성화 여부*/
showSrh = false, /*검색 레이어 활성화 여부*/
isShowSideMylotte = false; /*마이롯데 레이어 활성화 여부*/

var scrollY = 0 ; 

/*파라메타 json 으로 가져오기*/
function searchToJson() {
	return location.search.substring(1).split("&").reduce(function(result, value) {
		var parts = value.split('=');
		if (parts[0]) result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
		return result;
	},{})
}

/*App check*/
var isApp = false; 
if(searchToJson().udid != undefined && searchToJson().udid != ""
	&& searchToJson().schema != undefined && searchToJson().schema != ""){
	isApp = true;
}

/*baseParam*/
baseParam = "c="+(searchToJson().c?searchToJson().c:"")
+"&udid="+(searchToJson().udid?searchToJson().udid:"")
+"&v="+(searchToJson().v?searchToJson().v:"")
+"&cn="+(searchToJson().cn?searchToJson().cn:"")
+"&cdn="+(searchToJson().cdn?searchToJson().cdn:"")
+"&schema="+(searchToJson().schema?searchToJson().schema:"");

/*액션바를 숨길 페이지 목록(APP일 경우 native 호출을 막는다.)*/
hiddenUrl = [
	"/product/m/product_view." 			/* 상품상세 */
	,"/product/m/select_product_view."	/* 상품상세(기획전형) */
	,"/product/m/product_wine_view."	/* 상품상세(와인) */
	,"/product/m/product_view_gucci."	/* 상품상세(구찌) */
	,"/product/m/product_detail."		/* 상품상세 확대보기 */
	,"/product/m/select_present."		/* 사은품선택 */
	,"/product/m/imall_select_present."	/* imall사은품선택 */
	,"/order/m/order_form."				/* 주문서 */
	,"/order/m/imall_order_form."		/* imall주문서 */
];
hiddenFlag = false;
for( var i = 0; i < hiddenUrl.length; i++ ){
	var h_url = hiddenUrl[i];
	if( location.pathname.indexOf(h_url) >= 0 ){
		hiddenFlag = true;
		break;
	}
}
var beforeScrollTop = 0;
/*공통 dimmedOpen 처리*/
function dimmedOpen(instances){
	beforeScrollTop = $(window).scrollTop();
	var cover = $('#cover'),
	main_popup = $('.main_popup');
	
	var defaultOpen = {
		target : null,
		dimmed : true,
		dimmedFn : function(){ /*딤처리*/	
			if(! this.dimmed){
				cover.addClass("white");
			}
		},
		popType : null,
		init : function(){
			var htmlEl = $("html");
			if(htmlEl.hasClass(this.target + "_act")){  /*actionbar 관련하여 (지속되는 오류로 인해) 스크립트 제거하고 css 로 컨트롤합니다 */
				htmlEl.attr("class",""); 
				window.scrollTo( 0 , scrollY ) ; 
				return false;
			}else{
				htmlEl.attr("class","").addClass(this.target + "_act").addClass("dimmedOpen");
				scrollY = parseInt( sessionStorage.getItem( 'scrollY' ) ) ; 
				this.dimmedFn();
			}
			if(this.popType == 'F'){ /*'F': 전체화면,N': 일부화면 */
				main_popup.addClass("full");
			}
			if(this.target == 'search'){
				setTimeout(function(){
					$(".srh_layer input#searchKeyword").focus();
				},300);
				$(".srh_layer input#searchKeyword").focus();
			}
		}
	};				
	var settingOpen = $.extend({}, defaultOpen, instances || {});	
	settingOpen.init();
}

/*공통 dimmedClose 처리*/
function dimmedClose(arg){
	if($("html").hasClass("search_act")){
		if(isApp && isIos){ /*ios 액션바 보이기*/
			location.href= 'lottebridge://lotteapps/show';
		}else if(isApp && isAndroid){ /*android 액션바 보이기*/
			window.lottebridge.callAndroid("lottebridge://lotteapps/show");
		}
	}
	$("html").attr("class","");
	$("#cover").attr("style","").attr("class","");
    $("#wrapper").attr("style","");
	$(window).scrollTop(beforeScrollTop);
	//window.scrollTo( 0 , scrollY ) ;
};

/*transition 지원 되는 단말기만 넣을 클래스*/
$(function(){
	if(!(/SHV-E210|SHV-E250/i.test(navigator.userAgent.toLowerCase()))){
		$(".side_mylotte,.side_cate").addClass("transition");
	}
	/*app 일경우 마이레이어 간격 잡기*/
	if(isApp){		
		$(".side_mylotte").addClass("isApp");
	}
});

/*설정(native call)*/
showAppConfig = function(){
	if ((/android/gi).test(navigator.appVersion)) {  /*Android*/
		window.lottebridge.opensetting("on");  //안드로이드 앱 롯데멤버스 앱버튼 숨김
	} else if ((/iphone|ipad/gi).test(navigator.appVersion)) { /*iOS*/
		location.href="lottebridge://opensetting/on";
	};
}
/*최근본상품 전체삭제(native call)*/
removeLatestItems = function(){
	localStorage.removeItem("viewGoods");
	if (isIos){
		window.location='lottebridge://viewlatestitems/viewGoods=';
	}else if(isAndroid){
		window.JsObject.callAndroid('viewGoods=');
	}
    setTimeout(function(){
    	alert("삭제되었습니다.");
        //location.href = __defaultDomain + "/main.do?" + __commonParam
    }, 1000);
}
$(function(){
	/*카테고리 레이어***************************************************/
	if(hiddenFlag){
		//$("#sideMylotte").remove(); /* 아이패드는 주문,상세 액션바 뜸  */
	}
	/*카테고리열기 : 인자로 대대카,대카선택(?)*/
	openCategory = function(id){
		dimmedOpen({target:"category"});
		$(".brandList").hide();
	    setDcate(id, false, curDispNo[id]); /*category_*_v*.js*/ 
	    /*백버튼 사용시 사이드 메뉴 닫기 처리 (history 추가)*/
	    /*history.pushState("", "sidemenu"); */
	}	
	/*카테고리열기*/
	showSideCtg = function(id) {/*카테고리 열기(native call)*/	
		openCategory(id);
	}
	/*카테고리 닫기*/
	$('.side_cate .close').click(function(){
		closeSideCtg();
	});	
	closeSideCtg = function(){ /*카테고리 닫기 체크*/		
		closeCategory();
	}
	closeCategory = function(){
		dimmedClose({target:"category"});
	}
	
	window.addEventListener( 'scroll' , function(){
	    sessionStorage.setItem( 'scrollY' , document.body.scrollTop ) ; 
	})
	
	/*마이레이어******************************************************/	
	myBtn = $('#lotteActionbar li.my'),			 /*하단 마이레이어 버튼*/
	myLotteLayer = $('#sideMylotte'),			 /*마이레이어*/
	myLotteClose = $('#sideMylotte .my_close'),	 /*마이레이어 닫기*/
	detailOptLayer = $('.detail_option_layer'),	 /*상품상세 옵션 레이어*/
	cover = $("#cover"),
	smartBtn = $(".smart_alarm > ul.tab li a"),	 /*스마트 알림 버튼*/
	isMyLotte = ($(window).height() >= 460); 	/*myLotte 레이어 사용여부 조건 (460 = 세로 모바일 최소 height 값) */
	
	cover.click(function(){ /*dimmed 영역(cover) 를 눌렀을 경우*/
		dimmedClose({target : "cover"}); /* top_search.js 에서 이중 dimmed 처리 수정 */
	});
	
	/*마이롯데레이어 사용여부 체크*/
    myLotteChk = function(){
        if($(window).height() >= 460){
            isMyLotte = true;
        }else{
            isMyLotte = false;
            if($("html").hasClass("mylotte_act")){ /*검색과 좌측 카테고리는 높이값 상관없이 띄운다.*/
                dimmedClose({target : "minHeight"});
            }
        }
    }
    $(window).resize(function(){ /*resize*/
    	myLotteChk();
    });
    $(window).on('orientationchange',function(event){ /*orientationchange*/
    	myLotteChk();
    });
    
	/* 로그인 인풋 포커스시 액션바 사라짐*/
	$("input#userId,input#password").focus(function(){
		$("#lotteActionbar").hide();
	});
	$("input#userId,input#password").focusout(function(){
		$("#lotteActionbar").show();
	});	
	
	/*마이롯데 레이어*/
	openSideMylotte = function() { /*native call*/
		if(! isMyLotte){
			location.href = "/mylotte/mylotte.do" + "?" + baseParam + "&tclick=m_q_mylotte";
		}else{
		    dimmedOpen({target:"mylotte"});    
		    showMyLayer(); /*footer_2014.jsp 에 함수호출*/    
		    if (isApp){		    	
		    	setTclick('m_app_actionbar_my');
			} else {
				setTclick('m_actionbar_my');
			}
		}
	}
	/*마이롯데 레이어 열기*/
	myBtn.click(function(){
		openSideMylotte(); /*native call*/
	});
	
	/*마이롯데 레이어 닫기*/
	myLotteClose.click(function(){
		closeSideMylotte();
	});	
	
	/*마이롯데 레이어 닫기*/
	closeSideMylotte = function(){
        dimmedClose({target:"mylotte"});		
		if(detailOptLayer.length > 0){ /*상세 페이지에서 바로주문 레이어*/
			detailOptLayer.show();
		}
	}
	
	smartBtn.click(function () { /* 20141205 스마트 알림 S */
		smartBtn.parent().removeClass("on");
		$(this).parent().addClass("on");
		smartAlarmTabIndex = smartBtn.index(this);
	    $(".smart_alarm > .product_list01").hide();
	    $(".smart_alarm > .product_list01:eq(" + smartAlarmTabIndex + ")").show();
	});	
	
	/*검색레이어******************************************************/
	searchBtn = $('#head .glSearchL li.search a');
	searchFooterBtn = $('#lotteActionbar .glSearchL li.search a');
	/*검색창 열기*/
	searchBtn.click(function(){ /*native call*/
		setTclick('m_header_new_search');
		var tg = "header";
		openSrhLayer(tg);
	});
	searchFooterBtn.click(function(){ /*native call*/
		setTclick('m_actionbar_search');
		var tg = "footer";
		openSrhLayer(tg);
	});
	
});

/*
* 액션바 관련 수정 2015-07-22 추가 및 수정(jhchoi) END 
******************************************************
*/

/*
* lotte.com moblie
* 2014.03.26 김동욱
*/

/***********************************
 * 검색관련 : S
 ***********************************/
var doSearchRenew = function () {
	
	var searchURL = __defaultDomain + "/search/m/search_keyword.do";		// WEB 
	//var searchURL = __defaultDomain + "/search/m/search_keyword_app.do";	// APP
	var _$btn = $( '.glSearchL' ).find( 'li.search a' ),
		_$mainCategory = $( '#main_category' ),
		_$form = $('#searchForm'),
		_$target = $('#feSrhLayer'),
		_$recent = _$target.find('.srh_recent'),
		_$recentList = _$target.find('.srh_recent ol'),
		_$auto = _$target.find('.srh_auto'),
		//_$cover = _$target.find('.srh_cover'),
		_$recentDel = _$target.find('.srh_bar .del'),
		_$btnClose = _$target.find('.srh_bar .close'),
		_$searchKeyword = _$target.find('#searchKeyword'),
		_$searchKeywordDel = _$target.find('.srh_ipt .btn_del'),
		_$searchBrandButton = $('#searchBrandButton'),
		_$searchBrandWord = $('ul.category_search02'),
		isResearchBtn = _$target.find('.srh_bar .close'),
		myScroll1 = null,
		myScroll2 = null;
	
	//====================== initialize ==========================//
	//_$btn.on('click', mainSearchHandler);
	_$recentDel.on('click', delRecentKeyword);
	_$recent.on('click', '.del', delRecentKeyword2);
	_$form.on('submit', record);
	//_$cover.on('click', close);
	_$btnClose.on('click', close);
	_$searchKeywordDel.on('click', delKeyword);
	_$searchKeyword.on('keyup', keyCheck);
	
	_$mainCategory.on('click', '#searchBrandButton', {type:'Q'}, searchBrand);	
	_$mainCategory.on('click', 'ul.category_search02 a', {type:'I'}, searchBrand);
	_$mainCategory.on( 'keypress', '#search-input', {type:'Q'}, searchBrandEnter );
	_$mainCategory.on('click','#brand-search-clear', function() {
		$('#search-input').val('');
		$('#search-input').focus();
	});
	
	/* 초기화  */
	init();
	
	//====================== private methods ==========================//
	/** 검색창 클릭 이벤트 **/
	openSrhLayer = function(tg){
		if(tg == undefined){
			setTclick('m_actionbar_search');
		}
		openSrhLayerBody();
	}
	openSrhLayerBody = function(tg){ /*native call*/		
		if(isApp && !isIpad){ /* App인 경우*/
			if (isIos){
				location.href="lottesearch://newsearch";	
			}else{
				window.lottesearch.callAndroid("lottesearch://newsearch");
			}
			close();
		}else{ // WEB인 경우
			/* 최근 검색어 보기 */
			showRecentKeyword();
			/* IScroll 새로고침 */
			refreshIScroll();
			/* cover update */
			//coverUpdate();			
            dimmedOpen({target:"search"});
		}
	}
	
	/** 검색창 키 입력 **/
	function keyCheck(e){
		if (e.keyCode == 13){
			_$form.trigger('submit');
			return false;
		}else{
			if($.trim(_$searchKeyword.val()).length > 0){
				_$searchKeywordDel.show();
				
				/* 자동완성 키워드 조회 */
				autoKeyword();
			}else{
				_$searchKeywordDel.hide();
				
				/* 최근 검색어 보기 */
				showRecentKeyword();
			}
		}
	}
	
	/** 자동완성 키워드 조회 **/ 
	function autoKeyword(){
		
		var param = $("#searchForm").serialize();
			
		var temp = null;
		$.ajax({
			type: 'POST'
			, async: true
			, url: searchURL
			, data: param
			, contentType : 'application/x-www-form-urlencoded'
			, success: function(response) {
				
				setTimeout(function(){ // 시간차가 없으면 휴대폰에서 정상동작안함
					_$auto.find('ol').html(response);
					_$auto.css('display','block');
					_$recent.css('display','none');
					_$recentDel.css('display','none');
					
					/* IScroll 새로고침 */
					refreshIScroll();
					
					if($.trim(_$searchKeyword.val()).length == 0){
						_$auto.css('display','none');
					}
					
				},500);
				
			}
		});
	}
	
	/** 검색창 닫기 **/
	closeSrhLayor = function(){
		//_$target.css('display','none');
		//_$searchKeywordDel.hide();
		dimmedClose({target:"search"});
	}
	function close(){
		/*검색창 레이어 닫기*/
		closeSrhLayor();
		return false;
	}
	
	/** 검색창 입력값 삭제 **/
	function delKeyword(){
		_$auto.hide();
		_$recent.show();
		_$searchKeyword.val('');
		_$searchKeywordDel.hide();

		/* 최근 검색어 보기 */
		showRecentKeyword();
		
		return false;
	}
	
	/** 최근검색어 저장 **/
	function record(){
		_$searchKeyword.val($.trim(_$searchKeyword.val()));
		if(_$searchKeyword.val().length == 0){
			
			alert('검색어를 입력해주세요');
			return false;
		
		}else{
			if (localStorage.getItem('myWord') == null || localStorage.getItem('myWord').length == 0){
				localStorage.setItem('myWord', $.trim(_$searchKeyword.val()));
			}else{
				var recentKeyList = localStorage.getItem('myWord');
				var recentKeyArray = recentKeyList.split("|");
				var recentKeyMatch = false;
				for ( var i=0; i < recentKeyArray.length; ++i ){
					if(recentKeyArray[i] == _$searchKeyword.val()){
						recentKeyMatch = true;
					}
				}
				
				if(!(recentKeyMatch)){
					/* 검색어 저장 */
					addSearchKeyword(_$searchKeyword.val());
				}
			}
		}

		// 세션스토리지 삭제
		sessionStorage.removeItem("srhLstItems");
	}
	
	/** 초기화 **/
	function init(){
		/* IScroll 셋팅 */
		setIScroll();
		/* cover update */
		coverUpdate();
	}
	
	/** 검색창 열기 **/
	function mainSearchHandler(){
    	
		//티클릭 설정 메인 헤더배너 오픈 유무 확인
		if($("#wrapper").hasClass("headBann")){
			setTclick('m_header_open_search');
		}else{
			setTclick('m_header_new_search');
		}
		
		// App인 경우
		if(appYnChk() && isAppVerChk()){

			// 디바이스 별 함수 호출
			if (chk_device()=="iOS"){
				location.href="lottesearch://newsearch";	
			}else{
				window.lottesearch.callAndroid("lottesearch://newsearch");
			}
			
			/** 검색창 닫기 **/
			close();
			
		// App-WEB인 경우
		}else{
			_$target.css('display','block');
			showRecentKeyword(); // 최근 검색어 보기
			refreshIScroll(); // IScroll 새로고침
			coverUpdate(); // cover update
			$('#searchKeyword').focus(); // 포커스 셋팅
		}
	}
	// WEB 검색창 호출 Interface (iPad에서 사용)
	window.openWebSrhLayer = function () {
		_$target.css('display','block');
		showRecentKeyword(); // 최근 검색어 보기
		refreshIScroll(); // IScroll 새로고침
		coverUpdate(); // cover update
		$('#searchKeyword').focus(); // 포커스 셋팅
	};
	
	/** 최근 검색어 보기 **/
	function showRecentKeyword(){
		
		var viewCnt = 20;	// 노출갯수
		var recentKeyList = localStorage.getItem('myWord'), // localStorage
			appendHtml = '';
		
		if(!(recentKeyList)){
			appendHtml = '<li class="none">최근 검색한 기록이 없습니다.</li>';
		}else{
			var recentKeyArray = recentKeyList.split("|");
			
			for ( var i=0; i < recentKeyArray.length; ++i ) {
				if(recentKeyArray[i] != ""){
					var searchParam  = "'" + recentKeyArray[i] + "', '&tclick=" + getTrakingCd("MBL_TRK_CD_RECENT") + "'";
					appendHtml += '<li><a href="javascript:fn_goSearch(' + searchParam + ');" class="word">' + recentKeyArray[i] + '</a><a href="#none" class="del">최근 검색어 삭제</a></li>';
				}
			}
		}
		_$recentList.html(appendHtml);
		_$auto.css('display','none');
		_$recent.css('display','block');
		_$recentDel.css('display','block');
		
		if(!(recentKeyList)){
			_$recentDel.hide();
		}else{
			_$recentDel.show();
		}
		
		myScroll1.options.click = true;
		myScroll2.options.click = true;
		
		/* IScroll 새로고침 */
		refreshIScroll();
	}
	
	/** 최근 검색어 전체 삭제 **/
	function delRecentKeyword(){
		if (confirm('최근 검색어를 모두 삭제 하시겠습니까?') == true){
			localStorage.removeItem('myWord'); // localStorage
			
			/* 최근 검색어 보기 */
			showRecentKeyword();
		}
		return false;
	}
	
	/** 최근 검색어 개별삭제 **/
	function delRecentKeyword2(e){
		e.stopPropagation();
		var keyword = $(e.target).parent().find('a').eq(0).html();
		$(e.target).parent().animate({'opacity' : '0'}, 500, function(){ // 바로 지우면 밑에이떤 항목이 이벤트를 이어받는 문제가 있음
			$(e.target).parent().remove();
			var recentKeyArray = localStorage.getItem('myWord');
			recentKeyArray = (recentKeyArray.indexOf(keyword+'|') > -1) ? recentKeyArray.replace(keyword+'|', '') : recentKeyArray.replace(keyword, '');
			localStorage.setItem('myWord',recentKeyArray);
			if (localStorage.getItem('myWord') == null || localStorage.getItem('myWord').length == 0){
				_$recentList.html('<li class="none">최근 검색한 기록이 없습니다.</li>');
				_$recentDel.hide();
			}
			/* IScroll 새로고침 */
			refreshIScroll();
		});
		return false;
	}
	
	/** IScroll 셋팅 **/
	function setIScroll(){
		if($(".srh_recent").length > 0) {			
			myScroll1 = new IScroll('.srh_recent',{scrollbars:true,mouseWheel:true,interactiveScrollbars:true,shrinkScrollbars:'scale',fadeScrollbars:false,click:false});
		}
		if($(".srh_auto").length > 0) {	
			myScroll2 = new IScroll('.srh_auto',{scrollbars:true,mouseWheel:true,interactiveScrollbars:true,shrinkScrollbars:'scale',fadeScrollbars:false,click:false});
		}
	}
	
	/** IScroll 새로고침 **/
	function refreshIScroll(){
		myScroll1.refresh();
		myScroll2.refresh();
	}
	
	/** cover update **/
	function coverUpdate(){
		//_$cover.css('height', $(document).height());
	}
	
	//브랜드 검색
	function searchBrandEnter (e) {
		var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
		
		if ( key == 13) {
			$('#search-input').blur();
			$('#searchBrandButton').trigger( 'click' );
		}
	}
	//브랜드 검색
	function searchBrand(e){
		
		var searchBText = "",
			params = e.data.type;
		
		if(params == 'I'){					
			searchBText = $(this).text();

			//20140826 수정 _$searchBrandWord.removeClass('on');
            $('.category_search02 > li > a').removeClass('on');
			
			$(this).addClass('on');
			$("#search-input").val('');
		}else{						
			searchBText = $("#search-input").val();
			if(searchBText == ''){
				alert("검색어를 입력해 주세요");
				return;
			}
			//20140826 수정 _$searchBrandWord.removeClass('on');
            $('.category_search02 > li > a').removeClass('on');
		}
		
		$('nav.category_menu02-2>ul.smenu01').html('');
		
		$.ajax({
			type: 'post'
			, cache: false
			, url: "/brand/search_brand.do"
			, async : true
			, data: {
				keyword : searchBText,
				searchType : params //'Q':키워드검색
				//sort : params.data.sort
			}
			, beforeSend : function(xhr){
				_$searchBrandWord.closest( 'nav.category_menu02-2' ).find( 'ul.smenu01' ).append( '<div id="loading" style="display:block;padding-top:50px;"><img src="http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif" style="position:relative;left:-13px;" /></div>' );
				$('#brand_no_result').hide();
			}
			, complete : function(xhr, textStatus){
				$( '#loading' ).remove();
				//category.setting();
			}
			, success: function(html) {

				if($B.string.trim(html) == ''){							//결과가 없으면
					$('#brand_no_result').show().html('<strong>' + searchBText+ '</strong>(으)로 브랜드 검색결과가 없습니다.');
				}else{
					$('#brand_no_result').hide();
					$('nav.category_menu02-2>ul.smenu01').html(html);
				}

			}
			, error: function(xhr, status, error){
				$('#brand_no_result').show().html("검색이 실패했습니다.\n다시 시도해주세요.");	
			}
		});
		
		return false;
	};
};
/***********************************
 * 검색관련 : E
 ***********************************/

function fn_goSearch(p_keyword, p_params) {
	
	// 세션스토리지 삭제
    sessionStorage.removeItem("srhLstItems");
	
	location.href = __defaultDomain + "/search/m/mobile_search_list.do?" + __commonParam + "&keyword=" + encodeURIComponent(p_keyword) + p_params;
}


/*
* 카테고리 브랜드 동작
*/
var initBrand = function(){
	
	var _$bestBrd = $( 'nav.category_menu02-1' );
	var _$recentBrdList = $( 'nav.category_menu02-3' ).find('ul.smenu01');
	var _$searchBrdList = $( 'nav.category_menu02-2' ).find('ul.smenu01');
	
	//====================== initialize ==========================//
	
	_$bestBrd.on( 'click', 'a.brand_btn', goBrandCategory);
	_$recentBrdList.on( 'click', 'a.brand_btn',goBrandCategory);
	_$searchBrdList.on( 'click', 'a.brand_btn',goBrandCategory);
	
	initRecentBrand();
	initBestBrand();
	
	//====================== private methods ==========================//
	
	//최근 검색어 보기
	function initRecentBrand(){
		var recentBrandList = localStorage.getItem('recentBrandList'); //로컬스토리지
		
		if(recentBrandList == null){
			_$recentBrdList.html( '<div class="no_message">최근 본 브랜드가 없습니다.</div>' );
			return false;
		}
		
		
		var brdArray = JSON.parse(recentBrandList);
		var html = '';
		$.each(brdArray, function(i, v){
			var url = '';
			var type = '';
			
			if(v.lnkType == 'b'){
				type = ' data-type="b"';
			}
			
			html += '<li data-brand="' + v.brandNo +'" '+ type +'>'
					+'<div><span class="bookmark_check"><a href="#" class="favor-br off">즐겨찾기</a></span>'
					+'<a href="#go" class="brand_btn" >'+ v.brandNm + '</a>'
					+'</div></li>';
		});
		
		_$recentBrdList.html(html);
		//category.setting();
	
	}
	
	//베스트 검색어
	function initBestBrand(){
		_$bestBrd.find(".smenu02>li").attr('data-type', 'b');
		
	}
	
	//브랜드 카테고리 이동
	function goBrandCategory(){
		var $this = $(this),
			code = $this.closest( 'li' ).data( 'brand' ),
			type = $this.closest( 'li' ).data( 'type' ),
			txt = $this.text();
	
		if(type == 'b'){
			location.href = __defaultDomain + '/brand/m/bestmall_category_list.do?' + __commonParam + '&titleDispNo=' + code + '&title=' + encodeURIComponent( txt ) + '&sort=11&dispCnt=6';
		}
		else{
			location.href = __defaultDomain + '/brand/m/category_list.do?' + __commonParam + '&brdNo=' + code + '&brdNm=' + encodeURIComponent( txt );
		}
	}
	
};


/*
* 프로모션 동작
*/
var doPromotion = {};
$(document).ready(function(){
doPromotion.init = (function(){
	var promotion_tail;	//띠배너 데이터 json
	var promotion_plat; //사이드배너 데이터 json
	//====================== initialize ==========================//
	$(document).on('tabclick', clickTab);

	
	//====================== private methods ==========================//
	function clickTab(e, idx){
		chkPromotionPlat(idx);
		chkPromotionTail(idx);
	}
	
	
	//프로모션 인트로
	function showPromotionIntro(){
	
		var idx = idx;
		var bnr_sct_cd = "HPM1";//프로모션 인트로
		var bnr_tgt_cd = "";
		
		$.ajax({
			url: "/popup/promotion_banner.do?" + __commonParam
			, async : false
			, data: {
				bnr_sct_cd : bnr_sct_cd,
				bnr_tgt_cd : bnr_tgt_cd 
			}
			, dataType : "json"
			, success: function(data) {
				//console.log(data);
				if($.isEmptyObject(data)){
					$('div.promotion_a').css("display", "none");
					return false;
				}
				
				var introNo = localStorage.getItem("introNo");
				if(introNo == data[0].seqNo){
					return false;
				}
				
				introNo = sessionStorage.getItem("introNo");
				if(introNo == data[0].seqNo){
					return false;
				}
				
				var html = "";
				if(data[0].imgLink != ""){
					html = "<a href='" + data[0].imgLink + "'><img src='" + data[0].imgUrl + "' alt='프로모션' style='width:100%; height:100%'></a>";
					
					$('div.promotion_a').css( 'display', 'block');
					$('div.promotion_a').find('div.cont').html(html);
					
					promotionFull(data[0].seqNo);
				}
				else if(data[0].imgLink == "" && data[0].htmlCont != ""){
					html = unescape(data[0].htmlCont);
					var chg_html = $(html).find('a');
					$(chg_html).each(function(){
						var href = $(this).attr("href");
						if(href != "" && href.indexOf("javascript") < 0){
							$(this).attr("href", href+ ((href.indexOf("?") > -1) ? "&" : "?") +__commonParam);
						}
					});
					$('div.promotion_a').css( 'display', 'block');
					$('div.promotion_a').find('div.cont').html(chg_html);
					
					promotionFull(data[0].seqNo);
				}
			}
			, error: function(xhr, status, error){
				$('div.promotion_a').css( 'display', 'none');
			}
		});
	}

	function promotionFull(sn) {
		var _$cont = $( 'div.promotion_a' ),
			_$chk = $( '#choice01' ),
			_$close = _$cont.find( 'span.close a' );
		
		_$close.off( 'click' );
		_$chk.off( 'click' );
		_$close.on( 'click', closeHandler );
		_$chk.on( 'click', chkHandler );

		function chkHandler () {
			$(this).attr( 'checked', 'checked' );
			closeHandler();
			localStorage.setItem('introNo', sn);
		}

		function closeHandler () {
			_$cont.css( 'display', 'none' );
			sessionStorage.setItem("introNo", sn);
		}
	}
	
	
	//프로모션 플랫폼
	function showPromotionPlat(idx){
		var idx = idx;
		var bnr_sct_cd = "HPM2";//프로모션 플랫폼
		var bnr_tgt_cd = "";
		
		if(idx == 0){
			bnr_tgt_cd = "HM";
		}else if(idx == 1){
			bnr_tgt_cd = "HI";
		}else if(idx == 2){
			bnr_tgt_cd = "HS";
		}else if(idx == 3){
			bnr_tgt_cd = "SP";
		}else if(idx == 4){
			bnr_tgt_cd = "IM";
		}else if(idx == 5){
			bnr_tgt_cd = "EC";
		}else {
			return false;
		}
		
		$.ajax({
			url: "/popup/promotion_banner.do?" + __commonParam
			, async : false
			, data: {
				bnr_sct_cd : bnr_sct_cd,
				bnr_tgt_cd : "" 
			}
			, dataType : "json"
			, success: function(data) {
				promotion_plat = data;
				//console.log(data);
				for(i=0; i<data.length ; i++){
					if(data[i].aplyExpTgtCd == bnr_tgt_cd){
						if($.isEmptyObject(data)){
							$('div.promotion_b').css("display", "none");
							return false;
						}
						
						var html = "";
						if(data[i].imgLink != ""){
							html = "<a href='" + data[i].imgLink + "'><img src='" + data[i].imgUrl + "' alt='프로모션'></a>";
							
							$('div.promotion_b').css( 'display', 'block');
							$('div.promotion_b').find('div.cont').html(html);
							
							promotionPlatSide(214);
						}
						else if(data[i].imgLink == "" && data[i].htmlCont != ""){
							html = unescape(data[i].htmlCont);
							var chg_html = $(html).find('a');
							$(chg_html).each(function(){
								var href = $(this).attr("href");
								if(href != "" && href.indexOf("javascript") < 0){
									$(this).attr("href", href+ ((href.indexOf("?") > -1) ? "&" : "?") +__commonParam);
								}
							});
							$('div.promotion_b').css( 'display', 'block');
							$('div.promotion_b').find('div.cont').html(chg_html);
							
							promotionPlatSide(214);
						}
						break;
					}
				}
			}
			, error: function(xhr, status, error){
				$('div.promotion_b').css( 'display', 'none');
			}
		});
	}
	
	function promotionPlatSide(width) {
		var _$cont = $( 'div.promotion_b' ),
			_$img = _$cont.find( 'div.cont' ),
			_$open = _$cont.find( 'a.open' ),
			_$close = _$cont.find( 'a.close' );

		var _width = width;

		_$cont.css( 'display', 'block');
		
		//한번 닫았을때.
		
		if($B.utils.cookie('promotion_close') == 'y'){
			_$cont.css( 'right', -_width + 'px' );
			_$close.css( 'display', 'none' );
		}
		else{
			_$open.css( 'display', 'none' );
		}

		_$open.off( 'click' );
		_$close.off( 'click' );
		
		_$open.on( 'click', openHandler );
		_$close.on( 'click', closeHandler );

		function openHandler (e) {
			_$open.css( 'display', 'none' );
			_$close.css( 'display', 'block' );

			_$cont.animate({ 'right' : 0 });
		}

		function closeHandler (e) {
			$B.utils.cookie('promotion_close','y', 24*60);
			
			_$open.css( 'display', 'block' );
			_$close.css( 'display', 'none' );

			_$cont.animate({ 'right' : -_width + 'px' });
		}
	}
	
	//프로모션 띠배너
	function showPromotionTail(idx){
		var idx = idx;
		var bnr_sct_cd = "HPM3";//프로모션 띠배너
		var bnr_tgt_cd = "";
		
		if(idx == 0){
			bnr_tgt_cd = "HM";		//홈
		}else if(idx == 1){
			bnr_tgt_cd = "HI";		//핫이슈
		}else if(idx == 2){
			bnr_tgt_cd = "HS";		//백화점
		}else if(idx == 3){
			bnr_tgt_cd = "SP";		//MD추천
		}else if(idx == 4){
			bnr_tgt_cd = "IM";		//홈쇼핑
		}else if(idx == 5){			
			bnr_tgt_cd = "EC";		//이벤트 쿠폰
		}else if(idx == 6){
			bnr_tgt_cd = "PL";		//상품목록 
		}else if(idx == 7){
			bnr_tgt_cd = "PD";		//상품상세 
		}else {
			return false;
		}
		
		$.ajax({
			url: "/popup/promotion_banner.do?" + __commonParam
			, async : false
			, data: {
				bnr_sct_cd : bnr_sct_cd,
				bnr_tgt_cd : ""
			}
			, dataType : "json"
			, success: function(data) {
				promotion_tail = data;
				//console.log(data);
				for(i=0; i<data.length ; i++){
					if(data[i].aplyExpTgtCd == bnr_tgt_cd){
						if($.isEmptyObject(data)){
							$('#promotion_c').css("display", "none");
							if(idx == 6){
								//$(document).scrollTop($('#head').height() + $('#promotion_c').height());
								$(document).scrollTop(0);
							}
							
							return false;
						}
						
						if(data[i].imgLink != ""){
							var img = "<a href='#go'><img src='" + data[i].imgUrl + "' alt='프로모션' ></a>";
							$('#promotion_c').css( 'display', 'block');
							$('div.promotion_c_close').html(img);
							promotionTop (data[i].imgLink);
						}
						else if(data[i].imgLink == "" && data[i].htmlCont != ""){
							var html = unescape(data[i].htmlCont);
							var chg_html = $(html).find('a');
							$(chg_html).each(function(){
								var href = $(this).attr("href");
								if(href != "" && href.indexOf("javascript") < 0){
									$(this).attr("href", href+ ((href.indexOf("?") > -1) ? "&" : "?") +__commonParam);
								}
							});
							var img = "<a href='#go'><img src='" + data[i].imgUrl + "' alt='프로모션' ><span class='open'>열기</span></a>";
							var img2 = "<a href='#go'><img src='" + data[i].imgUrl + "' alt='프로모션'><span class='close'>닫기</span></a>";
							$('#promotion_c').css( 'display', 'block');
							$('div.promotion_c_close').html(img);
							$('div.promotion_c_open').html(img2);
							$('div.promotion_c_img').find('div.cont').html(chg_html);
							
							promotionTop ();
						}
						
						if(idx == 6){
							//$(document).scrollTop($('#head').height() + $('#promotion_c').height());
							$(document).scrollTop(0);
						}

						// 2014.12.08 iylee 상품상세일때만, 위로 스크롤을 할 때 상단에 띠배너가 보여짐.
						if(idx == 7){
							setPromotionPlan();
						}
						
						if($('div.first_page').css('display') != 'none'){
							$('div.first_page').find('span.lft, span.rgt').css('top','55px');
						}
						break;
					}
				}	
				
				
			}
			
			, error: function(xhr, status, error){
				$('#promotion_c').css( 'display', 'none');
			}
		});
	}
	
	function setPromotionPlan(){
		$("#promotion_c").css("display", "none");
	    $("#promotion_c").find("img").load(function(){
	        setTimeout(function(){
	            $("#promotion_c").show();
	            $(window).scrollTop($("#head").offset().top);
	        },2000);
	    })
	}
	
	function promotionTop (link) {
		var _$top = $( 'div.promotion_c_close' ),
			_$img = $( 'div.promotion_c_img' );

		_$top.off( 'click', 'a');
		_$img.off( 'click', 'a');
		
		if ( link ) {
			_$top.on( 'click', 'a', function () {
				location.href = link;
			});
		} else {
			_$top.on( 'click', 'a', function () {
				_$img.css( 'display', 'block' );
			});
			_$img.on( 'click', 'a', function () {
				_$img.css( 'display', 'none' );
			});
		}
		
		/*20141209*/
        $('#promotion_c').css("height", Math.floor($(window).width()*0.156) + "px");       
	}
	
	function chkPromotionPlat(idx){
		$('div.promotion_b').css("display", "none");
		if(idx == 0){
			bnr_tgt_cd = "HM";
		}else if(idx == 1){
			bnr_tgt_cd = "HI";
		}else if(idx == 2){
			bnr_tgt_cd = "HS";
		}else if(idx == 3){
			bnr_tgt_cd = "SP";
		}else if(idx == 4){
			bnr_tgt_cd = "IM";
		}else if(idx == 5){
			bnr_tgt_cd = "EC";
		}else{
			bnr_tgt_cd = "";
		}
		
		for(i=0; i < promotion_plat.length ; i++){
			if(promotion_plat[i].aplyExpTgtCd == bnr_tgt_cd){
				if($.isEmptyObject(promotion_plat)){
					$('div.promotion_b').css("display", "none");
					return false;
				}
				
				var html = "";
				if(promotion_plat[i].imgLink != ""){
					html = "<a href='" + promotion_plat[i].imgLink + "'><img src='" + promotion_plat[i].imgUrl + "' alt='프로모션'></a>";
					
					$('div.promotion_b').css( 'display', 'block');
					$('div.promotion_b').find('div.cont').html(html);
					
					promotionPlatSide(214);
				}
				else if(promotion_plat[i].imgLink == "" && promotion_plat[i].htmlCont != ""){
					html = unescape(promotion_plat[i].htmlCont);
					var chg_html = $(html).find('a');
					$(chg_html).each(function(){
						var href = $(this).attr("href");
						if(href != "" && href.indexOf("javascript") < 0){
							$(this).attr("href", href+ ((href.indexOf("?") > -1) ? "&" : "?") +__commonParam);
						}
					});
					$('div.promotion_b').css( 'display', 'block');
					$('div.promotion_b').find('div.cont').html(chg_html);
					
					promotionPlatSide(214);
				}
				break;
			}
		}
	}
	
	function chkPromotionTail(idx){
		$('#promotion_c').css("display", "none");
		var tclick = "";
		if(idx == 0){
			bnr_tgt_cd = "HM";		//홈
			tclick = "&tclick=m_header_banner1" ;
		}else if(idx == 1){
			bnr_tgt_cd = "HI";		//핫이슈
			tclick = "&tclick=m_header_banner2" ;
		}else if(idx == 2){
			bnr_tgt_cd = "HS";		//백화점
			tclick = "&tclick=m_header_banner3" ;
		}else if(idx == 3){
			bnr_tgt_cd = "SP";		//MD추천
			tclick = "&tclick=m_header_banner4" ;
		}else if(idx == 4){			
			bnr_tgt_cd = "IM";		//홈쇼핑
			tclick = "&tclick=m_header_banner5" ;
		}else if(idx == 5){			
			bnr_tgt_cd = "EC";		//이벤트 쿠폰
			tclick = "&tclick=m_header_banner6" ;
		}else if(idx == 5){
			bnr_tgt_cd = "PL";
		}else if(idx == 6){
			bnr_tgt_cd = "PD";
		}else{
			bnr_tgt_cd = "";
		}
		for(i=0; i < promotion_tail.length ; i++){
			if(promotion_tail[i].aplyExpTgtCd == bnr_tgt_cd){
				if($.isEmptyObject(promotion_tail)){
					$('#promotion_c').css("display", "none");
					return false;
				}
				
				if(promotion_tail[i].imgLink != ""){
					var img = "<a href='#go'><img src='" + promotion_tail[i].imgUrl + "' alt='프로모션' ></a>";
					$('#promotion_c').css( 'display', 'block');
					$('div.promotion_c_close').html(img);
					promotionTop (promotion_tail[i].imgLink+tclick);
				}
				else if(promotion_tail[i].imgLink == "" && promotion_tail[i].htmlCont != ""){
					var html = unescape(promotion_tail[i].htmlCont);
					var chg_html = $(html).find('a');
					$(chg_html).each(function(){
						var href = $(this).attr("href");
						if(href != "" && href.indexOf("javascript") < 0){
							$(this).attr("href", href+ ((href.indexOf("?") > -1) ? "&" : "?") +__commonParam);
						}
					});
					var img = "<a href='#go'><img src='" + promotion_tail[i].imgUrl + "' alt='프로모션' ><span class='open'>열기</span></a>";
					var img2 = "<a href='#go'><img src='" + promotion_tail[i].imgUrl + "' alt='프로모션'><span class='close'>닫기</span></a>";
					$('#promotion_c').css( 'display', 'block');
					$('div.promotion_c_close').html(img);
					$('div.promotion_c_open').html(img2);
					$('div.promotion_c_img').find('div.cont').html(chg_html);
					
					promotionTop ();
				}
				break;
			}
		}	
	}
	
	return {
		showPromotionIntro : function () {
			showPromotionIntro();
		},
		showPromotionPlat : function (idx) {
			showPromotionPlat(idx);
		},
		showPromotionTail : function (idx) {
			showPromotionTail(idx);
		},
		chkPromotionPlat : function (idx) {
			chkPromotionPlat(idx);
		},
		chkPromotionTail : function (idx) {
			chkPromotionTail(idx);
		}
	}

}());
});

/** 검색 이동 */
function topSearch(keyword) {
	location.href = __defaultDomain + "/search/m/mobile_search_list.do?" + __commonParam + "&keyword=" + encodeURIComponent(keyword);
}

/** 베스트 브랜드 - 상품리스트 이동 */
var goBestMallProdList = function(dispNo, uprDispNo, dispTpCd, title, titleDispNo){
	location.href = __defaultDomain + "/brand/m/bestmall_product_list.do?" + __commonParam + "&curDispNo="+dispNo+"&uprDispNo="+uprDispNo+"&dispTpCd="+dispTpCd+"&title="+encodeURIComponent(title)+"&titleDispNo="+titleDispNo;
};

//최근 본 브랜드 저장
function addRecentBrand(brandNo, brandNm, lnkType){ 
	//lnkType(b:베스트,s:검색)
	if(brandNo == '' || brandNm == ''){
		return;
	}
	var brandList = [];
	var recentBrandList = localStorage.getItem('recentBrandList');
	
	if(recentBrandList != null){
		brandList = JSON.parse(recentBrandList);
	}
	
	var exit = false;
	$.each(brandList, function(index, value){
		if(value.brandNo === brandNo){
			exit = true;
			return false;
		}
	});
	
	if(exit) return false;
	
	//10개 까지 저장
	if(brandList.length >= 10){
		brandList.splice(9, brandList.length - 9);
	}
	
	brandList.unshift({brandNo:brandNo, brandNm:brandNm, lnkType:lnkType});
	
	localStorage.setItem('recentBrandList', JSON.stringify(brandList));
}

//검색어 저장
function addSearchKeyword(keyword){ 
	var myWordList = localStorage.getItem('myWord');
	if(myWordList == null){
		localStorage.setItem('myWord','');
		myWordList = localStorage.getItem('myWord');
	}
	
	keyword = keyword.replace(/(<|>)/g, "");
	if(keyword == '' || myWordList.indexOf(keyword) >= 0){
		return false;
	}
	
	var keyArray = new Array();
	if(myWordList != null){keyArray = myWordList.split("|");}
	
	if(keyArray.length >= 20){
		keyArray.splice(19, keyArray.length - 19);
	}
	
	keyArray.unshift(keyword);
	
	localStorage.myWord = keyArray.join('|');
}


//리뉴얼  이벤트 - 2014
function renewalLPEvent(){
	if(typeof regIcisEntry == 'undefined') return;
	
	regIcisEntry();
}



//최초 시작 안내 페이지 노출
function viewFirstNotify(){
	var isFirst = localStorage.getItem('firstStartLotteM');
	if(isFirst != null && isFirst == 'y'){
		return;
	}
	
	//우선 제거
	//$('div.first_page').css('display', 'block');
	$('div.first_page span.btn').on('click', 'a', function(){
		localStorage.setItem('firstStartLotteM', 'y');
		$('div.first_page').css('display', 'none');
	});
}

//홈-스크롤 위치 저장
function setNowScrollY(){
	var nowScrollY= $(window).scrollTop();
	if(nowScrollY == 0) {
		nowScrollY = 1;
	}
	
	try {
		sessionStorage.setItem("nowScrollY", nowScrollY);

	} catch(e) {
	}	
}


$(window).load( function () {
	var currentUrl = document.URL;
	var isSmp = $.getUrlVar("smp_yn");
	if(isSmp && isSmp.toLowerCase() == 'y'){
		return;
	}
	
	$('#head').find('li.category a').on('click', initBrand);
	
	//doPromotion.init();
	//moveLastTab();
	
	if(currentUrl.indexOf('category/m/prod_list') > -1){
		doPromotion.init.showPromotionTail(6);
	}
	else if(currentUrl.indexOf('product/m/product_view') > -1){
		doPromotion.init.showPromotionTail(7);
	}
	
	$(document).on('tabclick', function(e,idx){
		sessionStorage.setItem("mainTabIdx", idx);
		
	});
	
	
});

$(document).ready(function(){
	//doSearch();
	doSearchRenew();
		
	var currentUrl = document.URL;
	var isSmp = $.getUrlVar("smp_yn");
	if(isSmp && isSmp.toLowerCase() == 'y'){
		return;
	}
	
	if(currentUrl.indexOf('search/m/mobile_search_list') > -1){
		$(document).scrollTop($('#head').height());
	}
	
	//viewFirstNotify();
});

/***********************************
 * 상품상세 링크
 ***********************************/
function productViewNew(goodsNo, byrAgelmtCd) {	
	if(byrAgelmtCd=='19' && __adultYn =='N') {
		alert('이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.');
	} else if(byrAgelmtCd=='19' && __adultYn ==''){
		if(__loginYn=='N'){
			goAdultLogin();
		} else {
			goAdultSci();
		}
	} else if ((byrAgelmtCd=='19' && __adultYn=='Y') || byrAgelmtCd!='19' ) {
		window.location.href = "/product/product_view.do?" + __commonParam + "&goods_no=" + goodsNo;
	}
}

