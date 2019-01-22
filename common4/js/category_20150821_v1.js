/*
*****************************************************
* 액션바 관련(카테고리레이어)는 App 연동 함수들은 중복 오류 방지를 위해 dev_common_*_v*.js 파일로 이동했습니다.(jschoi)

categoryIndex : 카테고리 오픈시 보일 화면 인덱스 
0 : 메인 
1~10 : 뷰티 ~ 롯데홈쇼핑, 12 전문몰  
*/
var categoryIndex = 0;  //사이드 메뉴 열릴때 세팅될 화면을 정함.

var curDispNo = [0, 5521401, 5522383, 5521402, 5522384, 5522385, 5522386, 5521782, 5522387, 2, 11];

var test = false; //ajax 로컬 테스트할 경우 true

var api_domain = MAPI_HOST_API;

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

/*
if(location.href.indexOf("molocal.lotte.com") > 0)
	api_domain = "http://mapi.lotte.com";
else if(location.href.indexOf("mrenewdev.lotte.com") > 0)
	api_domain = "http://mapidev.lotte.com";
else
	api_domain = "http://mapi.lotte.com";
*/

var brandURL = api_domain + "/json/cate_brand_list.json?"+__commonParam; //실제 경로
var brandURLKeyword = api_domain + "/json/cate_brand_keyword.json?" + __commonParam;
var planShopURLKeyword = api_domain + "/json/searchPlanShopKeyword.json?" + __commonParam;
var planShopURL = api_domain + "/json/category/cate_plan_list.json?" + __commonParam;

if(test){
    brandURL = "/category/m/cate_brand_list.do?"+__commonParam;
}
//=======================================================

var cateIndex = 1; //선택한 카테고리 : ㄱ~Z 초성검색시 구분자로 사용
var screenMode = 0; //0:카테고리, 1:브랜드, 2:서브 대카카테고리 :ㄱ~Z 초성검색시 구분자로 사용

var _tabIndex = 0,
_btnIndex = 0,
_dispNo = 0,
_cateDiv,
_dpmlNo = 1;



//앱에서 카테고리 열기 시 롯데그룹 앱 버튼 비노출 처리를 위한 처리
var _splitUrl = location.href.split("&");
var _appVer = "";
var _appUdid = "";
var _appSchema = "";
var _appBtAndroidDispYn = false;
var _appBtIosDispYn = false;
var _userAgent = navigator.userAgent.toLowerCase();
for(i=0; i < _splitUrl.length; i++){
    if(_splitUrl[i].indexOf("v=") > -1 && _splitUrl[i].indexOf("cateDiv=") == -1){
        _appVer = _splitUrl[i].replace("v=",""); 
    }else if(_splitUrl[i].indexOf("udid=") > -1){
        _appUdid = _splitUrl[i].replace("udid=","");
    }else if(_splitUrl[i].indexOf("schema=") > -1){
        _appSchema = _splitUrl[i].replace("schema=","");
    }
}

if(_appVer != "" && _userAgent.indexOf("android") > -1 && (_appUdid != "" || _appSchema != "") ){
    if(_appSchema == 'sklotte001'){ //sk 앱
        if(parseInt(_appVer.replace(/\./g,"")) >= 103){ //103이상이면 모든페이지
            _appBtAndroidDispYn = true;
        }else{
            if(location.href.indexOf("/main_phone") > -1){ //103 미만이면 메인만
                _appBtAndroidDispYn = true;
            }
        }
    }else{ //롯데닷컴
        if(_appSchema == 'mlotte001' && parseInt(_appVer.replace(/\./g,"")) >= 217){
            _appBtAndroidDispYn = true;
        }else if (_appSchema == 'mlotte001' && parseInt(_appVer.replace(/\./g,"")) >= 212){
            if(location.href.indexOf("/main_phone") > -1){
                _appBtAndroidDispYn = true;
            }
        }
    } 
}else if(_appVer != "" && (_userAgent.indexOf("iphone") > -1 || _userAgent.indexOf("ipod") > -1)&& (_appUdid != "" || _appSchema != "") ){
    if(parseInt(_appVer.replace(/\./g,"")) >= 210){ //210이상이면 모든페이지
        _appBtIosDispYn = true;
    }else if (parseInt(_appVer.replace(/\./g,"")) == 209 && location.href.indexOf("/main_phone") > -1){ //209면 메인만
        _appBtIosDispYn = true;
    }
}


function setMyLayerParam(){
	/*
	var param = "&viewGoods="+localStorage.getItem("viewGoods")+"&amlist="+localStorage.getItem("amlist");
	if ((/android/gi).test(navigator.appVersion)) { // Android
		window.lottebridge.callAndroid("lottebridge://mylayerparam/" + param);
	} else if ((/iphone|ipad/gi).test(navigator.appVersion)) { // iOS
		location.href= 'lottebridge://mylayerparam/' + param;
	}
	*/
}

//ㄱㄴㄷ, ABC 탭 선택
function cateTab(tab){
    //초기화
    $(".brandSet").find(".tab > a").removeClass("on");
    $("nav.tabSub").hide();
    $(".brandSet").find(".tab > a:nth-child(" + tab + ")").addClass("on");
    $(".tabSub > a").removeClass("on"); 
    $("#searchUL").html("");   
    $(".noList.result").hide();
    if(tab == 1){
        $("nav.tabSub.kor").show();
    }else{
        $("nav.tabSub.eng").show();
    }
    setBrandTitle(cateIndex, 0); 
    if(screenMode == 1){ //브랜드 일때에는 기본으로 검색함.
        if(tab == 1){
            $(".tabSub.kor > a:first-child").trigger("click");
        }else{
            $(".tabSub.eng > a:first-child").trigger("click");
        }        
    }
}
var cateDrag;

function setCategory(){
    //ㄱ ~ Z 클릭시 
    $(".tabSub > a").click(function(){
        if(!$(this).hasClass("on")){ //선택되지 않은 상태일때만 클릭 처리
            $(".tabSub > a").removeClass("on");        
            $(this).addClass("on");
            //var did = ($(this).parent().index()-2)*15 + $(this).index();
            _tabIndex = $(this).parent().index()-2;
            _btnIndex = $(this).index();
            _cateDiv = "LARGE";
            loadBrandList();
            if( $(this).parent().hasClass("kor") ){
            	setTclick('m_side_brand_kor_idx' + $(this).index());
            }
            else {
            	setTclick('m_side_brand_eng_idx' + $(this).index());
            }
        }
    });
//    cateDrag = $("#ddcate").simpleDrag(function(){
//        var flickX = cateDrag.getFlickDist(); //플리킹여부 판단 및 구한 값
//        if(flickX == 0){
//            //setEndCate(cateDrag._x());
//        }else{
//            //setEndCate(flickX);
//        }
//    });   
    rotateWindow(function(){
        //20150319 회전시 아이콘의 위치 버그 수정 
        if($(".side_cate.on").hasClass("sub")){
            //setEndCate(cateDrag._x());
        }
    });
    //cateDrag.setDragFlag(false);
}
//카테고리 양끝 위치잡기
//function setEndCate(px){
//    var end =  $(window).width() - $("#ddcate").width();
//    if(px > 0){
//        px = 0;            
//    }else if(px < end){
//        px = end;
//    }
//    cateDrag.setMoveX(px, 300, function(){});    
//}
//ㄱ ~ Z 클릭시 데이타 로드 
function loadBrandList(){    
        /*
        screenMode = 0; //0:카테고리, 1:브랜드, 2:서브 대카카테고리 화면 screenMode 의 값으로 현재 화면을 구분함.        
        cateIndex = 1; //선택한 카테고리 1 ~ 12
        param : ㄱ ~ Z 까지 선택한 인덱스
                ㄱ ~ 기타 : 0 ~ 14
                 A ~ Z : 15 ~ 40 
        */
        //alert("screenMode : " + screenMode + ", category : " + cateIndex);
    $(".noList.result").hide();
    
    var loadAjaxData = function($loading){
        $.ajax({
            url: brandURL
            //, async : true
            , cache : true
            , data : {
                tabIndex : _tabIndex,
                btnIndex : _btnIndex,
            }
            , success: function(data) {
                $loading.remove();
                $("#searchUL").empty();
                
                var resultCnt = "<span class=\"cnt\">총 <strong>" + setComma(data.brandList.items.length) + "</strong> 건</span>\n";
                var resultHtml = resultCnt + "<ul>\n"
    			for(var i = 0; i < data.brandList.items.length; i++) {
    				var bUrl = "/category/m/cate_brand_main.do?" + __commonParam
    				bUrl += "&curDispNo=" + data.brandList.items[i].disp_no + "&dispLrgNm=" + data.brandList.items[i].disp_lrg_nm
    				if(_tabIndex == 0)
    					bUrl += "&idx=1&tclick=m_side_brand_kor_idx"+ i;
    				else
    					bUrl += "&idx=1&tclick=m_side_brand_eng_idx"+ i;
    				
    				resultHtml += "<li>"    				
    				var bText = data.brandList.items[i].brnd_nm;
    				if(data.brandList.items[i].dpts_yn == "Y") {
    					bText += " <span class=\"icon\">" + data.brandList.items[i].dpts_nm + "</span>";
    				}    				
    				bText += "<p class=\"cate\">" + data.brandList.items[i].disp_lrg_nm + "</p>";    					
    				resultHtml += "<a href=\"" + bUrl + "\">" + bText + "</a>"    				
    				resultHtml += "</li>\n";
    			}                
                resultHtml += "</ul>\n";                
                $("#searchUL").html(resultHtml);
                
                //검색결과가 없는 경우        
                if(data.brandList.items.length == 0) {
                	$("#bNullResult").show();
                } else {
                	$("#bNullResult").hide();
                }
                
                //20141226 추가 : 초성검색 후 에니메이션 추가
                /*
                setTimeout(function(){
                    var ytarget_pos = 337;
                    if(screenMode == 2){
                        ytarget_pos = 155 + $(".categoryList").height();
                    }
                    $('html, body').animate({scrollTop:ytarget_pos});
                },300);   
                */                                                
            }
            , error: function(xhr, status, error){
            	$loading.remove();
                $("#bNullResult").show();               
            }
        });  
    }
        appendLoading( $("#searchUL"), true, loadAjaxData, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif', 0 );
}
//대카 세팅 id : 1~10, 12, 대대카 세팅 : 0
setDcate = function(id, motion, dispNo){ 
	
	id = 0; //정책 수정 - 첫번째 텝만 활성화시킨다.		
	cateIndex = id;
	
    if(id == 0){
        screenMode = 0;
        $(".smenu").hide(0);
        $(".iconset > a").removeClass("on");
        $(".side_cate").removeClass("sub");
        //cateDrag.setX(0);
        //cateDrag.setDragFlag(false);
        //cbChange(true);
        
    //20150210 설매장 제거
    } else {
    	cbChange(id);
        
        screenMode = 2;
        var content = id - 1;
        if( id == 12){ //12가 11 로 밀렸기에 예외처리
            content = 10;
        }
        $(".specialShop").hide();
        $(".brandSet").show();
        
        if(!$(".iconset > a").eq(id-1).hasClass("on")){ //선택되지 않은 상태일때만 클릭 처리             
            if(motion){
                $(".smenu").slideUp(300);
                $(".side_cate").addClass("sub");
                $(".smenu").eq(content).slideDown(500);                
            }else{
                $(".smenu").hide();
                $(".side_cate").addClass("sub");                                
                $(".smenu").eq(content).show();
            }
            $(".iconset > a").removeClass("on");                   
            $(".iconset > a").eq(id-1).addClass("on");
            var cpx =  $(window).width()/2 - id*88 + 45;
            //setEndCate(cpx);//일단 가운데 세팅, 양끝 벗어나면 양끝에 맞춤
            //cateDrag.setDragFlag(true);
            if( id <= 9){  //전문몰이 아닐때에만 처리  
                $(".brandIconSet").hide();
                //브랜드 검색 리스트
                $(".tabSub > a").removeClass("on"); 
                $("#searchUL").html("");
                setBrandTitle(cateIndex, 0);
            }else{
                $(".brandSet").hide();
                if(id == 12){ 
                    $(".smenu").hide();
                    $(".specialShop").show();                    
                }
            }
        }
    }
    if(dispNo == 2){
        _dpmlNo = dispNo;
    } else if (dispNo == 11) {
        _dpmlNo = dispNo;
    } else {
        _dpmlNo = 1;
    }
    _dispNo = dispNo;
}
//카테고리, 브랜드 변경 버튼 
function cbChange(tab){ //
    $(".tab.mainTop > a").removeClass("on");
    if(tab==1){ //카테고리
        screenMode = 0;        
        $(".tab.mainTop > a:nth-child(1)").addClass("on");
        $(".tab.mainTop > a:nth-child(2)").removeClass("on");
        $(".tab.mainTop > a:nth-child(3)").removeClass("on");
        $(".categorySet").show();
        $(".brandSet").hide();
        $(".specialSet").hide();
        
        setTclick('m_side_cate_tab_category');
        
    }else if(tab==2){ //브랜드
        screenMode = 1;        
        $(".tab.mainTop > a:nth-child(1)").removeClass("on");
        $(".tab.mainTop > a:nth-child(2)").addClass("on");
        $(".tab.mainTop > a:nth-child(3)").removeClass("on");
        $(".categorySet").hide();
        $(".brandSet").show();
        $(".specialSet").hide();
        
        setTclick('m_side_cate_tab_brand');
    }else if(tab==3){ //기획전
        screenMode = 1;        
        $(".tab.mainTop > a:nth-child(1)").removeClass("on");
        $(".tab.mainTop > a:nth-child(2)").removeClass("on");
        $(".tab.mainTop > a:nth-child(3)").addClass("on");
        $(".categorySet").hide();
        $(".brandSet").hide();
        $(".specialSet").show();        
                
		//데이터로딩
		loadPlanShop(1, 5537345);
        
        setTclick('m_side_cate_tab_planshop');
    }    
}

var sideCategory ;
var grid ; 

var colorCode = function(){
  return "#"+((1<<24)*Math.random()|0).toString(16);
}

function findChildren(motherDom, findStr) {
  var findStr = findStr.replace(/((^|,)\s*):scope > /g, ''), 
  firstChk = false, 
  lastChk = false, 
  resArr = [], 
  findDom;
  
  if (findStr.indexOf(':first-child') != -1) {
    firstChk = true;
    findStr = findStr.replace(':first-child', '');
  } else if (findStr.indexOf(':last-child') != -1) {
    lastChk = true;
    findStr = findStr.replace(':last-child', '');
  }
  
  findDom = motherDom.querySelectorAll(findStr);
  [].forEach.call(findDom, function(el, idx) {
    if (el.parentNode == motherDom) {
      resArr.push(el);
    }
  });
  
  if (firstChk) resArr = resArr[0];
  if (lastChk) resArr = resArr[resArr.length - 1];
  return resArr;
} // end of findChildren

function domLoad () {
	var mother = document.querySelector( '#wrapper' ) , 
		loadTimer ;	
	clearTimeout( loadTimer ) ;
	function loadStart () {
		var lenOld = mother.getElementsByTagName( '*' ).length ; 
		loadTimer = setTimeout(function (){
			var lenNew = mother.getElementsByTagName( '*' ).length ;
			if ( lenOld != lenNew ) {
				loadStart() ; 
			} else {
				// console.log( document.querySelector( 'div.categorySet' ) ) ;
				loadComplete() ; 
			}
		} , 100 ) ; 
	} // end of testStart
	loadStart() ; 
} // end of domLoad
$(function(){
	/*전체상품,롯데백화점 고정 및 클릭시 scrollTop 변경*/
	var s_category = $("section#s_category"),
		categorySet = s_category.find(".categorySet"),
		brandSet = s_category.find(".brandSet"),
		specialSet = s_category.find(".specialSet"),
		scroll_wrap = categorySet.find(".scroll_wrap"),
		dl = categorySet.find("dl"),
		dd = categorySet.find("dl.menu dd"),
		dt = categorySet.find("dl.menu dt"),
		dh = dt.height() + 1,
		spShop = categorySet.find(".spShop"),
		lotteApp = categorySet.find(".lotteApp");
	if(isApp){ /*app 일경우 간격이 다름*/
		s_category.addClass("isApp");
    }
	s_category.find("nav.tab a").click(function(){
		var ix = $(this).index();
		if($(this).hasClass("on")){
			if(ix == 0){
				categorySet.scrollTop(0);
			}else if(ix == 1){
				brandSet.scrollTop(0);
			}else if(ix == 2){
				specialSet.scrollTop(0);
			}
		}
	});
	dd.each(function(){
		$(this).addClass("hiding").attr("role",$(this).find("li").length);
    });
	dt.click(function(){                    		
		var otHt = ($(this).parent().parent().find("dl").length * dh) + spShop.height() + lotteApp.height(),
		liHt = ($(this).parent().find("dd").attr("role") * dh);
		if($(this).parent().hasClass("active")){
			scroll_wrap.css("height","");
			$(this).parent().removeClass("active");
			$(this).parent().find("dd").css({height:0});
		}else{
			scroll_wrap.css("height",otHt + liHt + 70); /* 30 = 여유여백 */
			dl.removeClass("active");
			categorySet.scrollTop(($(this).parent().index() * dh));
			dd.css({height:0});
			$(this).parent().addClass("active");
			$(this).parent().find("dd").css({height:liHt});
		}
		//setTclick('m_side_cate_categroup_' + $(this).attr("ctno")); 정책 삭제
	});
	//brand
	brandSet.find("nav.eng").hide();
	
	//special
	s_category.find(".result .btn_close").click(function(){
		$(this).parent().hide();
	});
	brandSet.find("fieldset button").click(function(){
		$(this).parent().parent().find(".searchList.result").show();
	});
	specialSet.find("fieldset button").click(function(){
		$(this).parent().parent().parent().find(".searchList.result").show();
	});
	specialSet.find("nav a").click(function(e){
		e.preventDefault();		
		var idx = $(this).index() + 1;
		specialSet.find(".cateWrap").hide();
		specialSet.find(".cate"+idx).show();
		specialSet.find("nav a").removeClass("on");
		$(this).addClass("on");
		
		var cate_no = "";
		if(idx == 1) 
			cate_no = "5537345";
		else if(idx == 2)
			cate_no = "5537346";
		else if(idx == 3)
			cate_no = "5537347";
		else if(idx == 4)
			cate_no = "5537348";		
		else if(idx == 5)
			cate_no = "5537349";		
		//데이터로딩
		loadPlanShop(idx, cate_no);
		
		setTclick('m_side_planshop_cate_' + idx);
	});
});
/*
function SideCategory () {
	var tag = {} , opt = {} ; 
	(function domSet(){
		tag.wrraper = document.querySelector( '#wrapper' ) ;
		tag.mother = document.querySelector( '#s_category' ) ;
		tag.mainTop = tag.mother.querySelector( '.mainTop' ) ;
		tag.categorySet = tag.mother.querySelector( 'div.categoryBox' ) ;
		tag.dls = tag.categorySet.querySelectorAll( 'dl.menu' ) ;
		tag.dts = tag.categorySet.querySelectorAll( 'dl.menu dt' ) ;
		tag.dds = tag.categorySet.querySelectorAll( 'dl.menu dd' ) ;
		tag.actionbar = document.querySelector( '#lotteActionbar' ) ;
	}()) ; 
	(function objSet(){
		opt.winH = window.innerHeight ;
		opt.actionBarH = tag.actionbar.offsetHeight ;
		opt.mainTopH = tag.mainTop.offsetHeight ; 
		opt.arr_ddsH = [] ; 
		opt.cIdx = null ; 
		opt.hiddenClass = 'hiding' ;
		opt.activeClass = 'active' ;
	}()) ;
	(function prepareSet(){
		tag.categorySet.style.height = ( opt.winH - opt.actionBarH - opt.mainTopH - 30) + 'px' ;
		tag.mother.style.height = ( opt.winH - opt.actionBarH - 30 ) + 'px' ;
		
		[].forEach.call( tag.dds , function ( dd , idx ) {
			opt.arr_ddsH[idx] = dd.offsetHeight ; 
			dd.classList.add( opt.hiddenClass ) ; 
		}) ; 
	}()) ; 
	(function evtSet(){
		[].forEach.call( tag.dts , function ( dt , idx ){
			dt.addEventListener( 'click' , clickHandler ) ; 
		}) ; 
	}()) ;
	
	function clickHandler (e) {
		var idx = [].indexOf.call( tag.dts , this  ) ;
		console.log( 'idx : ' , idx ) ; 
		
		if ( opt.cIdx != idx ) {
			tag.dds[idx].classList.remove( opt.hiddenClass ) ;
			tag.dds[idx].parentNode.classList.add( opt.activeClass ) ;
			tag.dds[idx].style.height = opt.arr_ddsH[idx] + 'px' ;
			opt.cIdx = idx ;
		} else {
			tag.dds[idx].classList.add( opt.hiddenClass ) ;
			tag.dds[idx].parentNode.classList.remove( opt.activeClass ) ;
			tag.dds[idx].style.height = 0 + 'px' ;
			opt.cIdx = null ; 
		}
		
		[].forEach.call( tag.dds , function ( dd , i ) {
			if ( i != idx ) {
				dd.classList.add( opt.hiddenClass ) ;
				dd.style.height = 0 + 'px' ; 
			}
		}) ; 
	}
}
SideCategory.prototype = {
	testFunc : function () {
		console.log( 'aaasdasdasd' ) ; 
	}
} ; 
*/

// 페이지 내의 DOM들의 로딩 완료시점이 끝난 후 실행됩니다.
function loadComplete () {
	sideCategory = new SideCategory ;
} // end of loadComplete

function sideCateTab(tab){
	$(".categorySet .scroll_wrap").css("height","");
	$(".categorySet").scrollTop(0);
    if(tab==1){ //전체상품
        $(".categorySet > nav.navi > a:nth-of-type(1)").addClass("on");
        $(".categorySet > nav.navi > a:nth-of-type(2)").removeClass("on");
        $(".menu.all").show();
        $(".menu.depart").hide();
        $(".categorySet dl.menu").removeClass("active");
        $(".categorySet dl.menu dd").css("height","0px");
        sendTclick('m_side_cate_subtab_allproduct');
    }else{ //백화점
        $(".categorySet > nav.navi > a:nth-of-type(1)").removeClass("on");
        $(".categorySet > nav.navi > a:nth-of-type(2)").addClass("on");
        $(".menu.all").hide();
        $(".menu.depart").show();
        $(".menu.depart").css({ visibility : "visible" , position : "static" });
        $(".categorySet dl.menu").removeClass("active");
        $(".categorySet dl.menu dd").css("height","0px");
        sendTclick('m_side_cate_subtab_lottedept');
    }
}
//브랜드 아이콘 클릭해서 하단 검색화면 열기
function openBrandSearch(id, dispNo){
    cateIndex = id;
    $(".brandIconSet").find("a").removeClass("on");
    $(".brandIconSet").find("a").eq(id-1).addClass("on");
    $(".brandList").hide();    
    _dispNo = dispNo;
    cateTab(1);
    //$(".brandSet").hide(0);
    $(".brandSet").slideDown(0);
    setTimeout(function(){
        //$("#s_category").scrollTop(300);
        $('html, body').animate({scrollTop:337});
    },300);
}
//브랜드 초성검색 결과 타이틀의 내용 세팅 : 아이콘인덱스, 인자로 검색결과 갯수
function setBrandTitle(id, num){
    var iconName = ["","뷰티", "패션잡화","여성의류","남성의류","스포츠","유아동","가전/가구","생활/식품", "롯데백화점", "롯데홈쇼핑","스마트픽","전문몰"];
    var str = iconName[id];
    if(screenMode == 2){
        str = "[" + str + "] 브랜드";
    }else{
        str = "[" + str +"] 브랜드";
    }
    $(".setTitle2").html(str);

}

//#20141229  신규 생성 : 사이드메뉴 내에서 링크 걸때에 사용
function goMPage(link){
    if($(".side_cate").hasClass("on")){ //사이드메뉴가 열려있으면
        history.pushState({menu:cateIndex}, "menuLink");  
    }
    location.href= link;
}

//======================= setting ============================
$( document ).ready( function () {        
    if(location.href.indexOf("/search/m/mobile_search_list") == -1 && $("#s_category").length > 0) { //검색페이지 제외
        setCategory();
        //카테고리 오픈 
        $(".category").find("a").removeAttr("href");
        
        setTimeout(function(){
            $(".category").find("a").click(function(){
                if($('#idx').val() != null){
                    categoryIndex = $('#idx').val();  
                } 
                
                categoryIndex = (categoryIndex == 'null') ? 0 : categoryIndex;
                // 2005.02.05 트래킹위해 ajax로 구현된었던것을 수정함
                //티클릭 설정 메인 헤더배너 오픈 유무 확인
                if($("#wrapper").hasClass("headBann")){
                    setTclick('m_header_open_cate');
                }else{
                	if( $(this).parent().index() > 0 ){
                		// 액션바
                		setTclick('m_actionbar_category');
                	}
                	else {
                		// 좌측상단
                		setTclick('m_header_new_cate');
                	}
                }
                showSideCtg(categoryIndex);
                
            });       
        }, 1000);
        
        //백버튼 사용시 사이드 메뉴 닫기 처리 
        window.addEventListener( "popstate", function(event){        
            if($(".side_cate").hasClass("on")){ //사이드메뉴가 열려있으면
                closeCategory(1);            
            }else if(event.state) { //다음페이지에서 백키로 돌아온 경우
                if(event.state.menu != undefined){
                    $(".side_cate").css("-webkit-transition-duration", "0ms");
                    $(".side_cate").css("transition-duration", "0ms");
                    openCategory(event.state.menu);
                    setTimeout(function(){
                        $(".side_cate").css("-webkit-transition-duration", "300ms");
                        $(".side_cate").css("transition-duration", "300ms");                                            
                    }, 1000);
                }
            }                    
        }, false );
    }
    if(location.href.indexOf("select_present.do") == -1){ //사은품 선택 페이지에선 호출 X
        if($(".side_cate").hasClass("on")){
            if(_appBtAndroidDispYn) window.lottebridge.callAndroid("lottebridge://lotteapps/hide"); //안드로이드 앱 롯데멤버스 앱버튼 숨김
            if(_appBtIosDispYn) location.href="lottebridge://lotteapps/hide";                               //iOS 액션바 숨김
        } else {
            if(_appBtAndroidDispYn) window.lottebridge.callAndroid("lottebridge://lotteapps/show"); //안드로이드 앱 롯데멤버스 앱버튼 노출
            if(_appBtIosDispYn) location.href="lottebridge://lotteapps/show";                                   //iOS 액션바 노출
        }
    }
    
});

//===============================================================
//20141226
//컨텐츠 내의 스크롤 이벤트 등이 동작하지 않도록 예외 처리 하기 위해 카테고리가 열려 있는지 판별함
function categoryScrollFlag(){
  var flag = true;
  if($("#wrapper").css("display") == 'none'){
      flag = false;
  }
  return flag;
}

//20141224 로딩바 추가
/*20150726 - jhchoi - category_*_v*.js //pub_brandshop_gucci.js // pub_category_*_v*.js 3군데에서 로딩바처리(?) ----- */
function appendLoading ( $parent, isEmpty, completeLoadingFunc, src, top ) {        
	var $loading = $( '<div class="loading_wrap"><p class="loading half"></p></div><img style="display:none;" class="loading" src=' + src + ' alt="loading..."><br />' );
    $loading.on( 'load', function () {
        if ( isEmpty ) {
            $parent.empty();
        }
        $parent.append( $loading );
   	  	//$loading.css( { 'position': 'relative', 'width': 'auto', 'top': top } );
		//$loading.css( { 'width': $loading.width() / 2 }  );
		//$loading.css( { 'left': parseInt( ( $parent.width() - $loading.width() ) /2 ) } );
        completeLoadingFunc( $loading );
    } );
}


//브랜드 검색 : 모바일 리뉴얼 - rudolph
var searchBrandKeyword = function($loading) {
	if(event.keyCode != 13) return;
	loadBarndKeyword();	
}


//브랜드 검색 : 모바일 리뉴얼 - rudolph
function loadBarndKeyword() {

	var brandKeywordSearch = function($loading) {
		if($("#brandKeyword").val().length < 2) {
			$loading.remove();
			$("#bkResult").hide();
			alert("검색을 위해서는 2글자 이상의 단어를 입력하여 주시기 바랍니다.");		
			return;
		}
		
		
		if($("#brandKeyword").val() == "") {
			$loading.remove();
			$("#bkResult").empty();
			var resultHtml = "<ul>\n"
			resultHtml += "</ul>\n";
			resultHtml += "<p class=\"noList\" style=\"display:none;\" id=\"bkNullResult\">검색된 브랜드가 없습니다.</p>";
			resultHtml += "<a class=\"btn_close\">닫기</a>";
			$("#bkResult").html(resultHtml);
			$("#bkResult").show();
			$("#bkNullResult").show();    
			
		    $(".result .btn_close").click(function(){
	      		$(this).parent().hide();
	      	});		
			return;
		}
		
		$.ajax({
			url: brandURLKeyword
			, type: "GET"
			, dataType : "json"
			, data : {
				sch_nm : $("#brandKeyword").val()
			}
			, success: function(data) {
				$loading.remove();
				$("#bkResult").empty();
				
				var resultCnt = "<span class=\"cnt\">총 <strong>" + setComma(data.brandList.items.length) + "</strong> 건</span>\n";
	            var resultHtml = resultCnt + "<ul>\n"
	            
				for(var i = 0; i < data.brandList.items.length; i++) {
					var bUrl = "/category/m/cate_brand_main.do?" + __commonParam
					bUrl += "&curDispNo=" + data.brandList.items[i].disp_no + "&dispLrgNm=" + data.brandList.items[i].disp_lrg_nm
					bUrl += "&idx=1&tclick=m_side_brand_brandsearch_list" + i;
					
					resultHtml += "<li>"    				
					var bText = data.brandList.items[i].brnd_nm;
					if(data.brandList.items[i].dpts_yn == "Y") {
						bText += " <span class=\"icon\">" + data.brandList.items[i].dpts_nm + "</span>";
					}    				
					bText += "<p class=\"cate\">" + data.brandList.items[i].disp_lrg_nm + "</p>";    					
					resultHtml += "<a href=\"" + bUrl + "\">" + bText + "</a>"    				
					resultHtml += "</li>\n";
				}   
	            
	            resultHtml += "</ul>\n";
	            resultHtml += "<div class=\"noList result\" style=\"display:none;\" id=\"bkNullResult\">검색된 브랜드가 없습니다.</div>";
	            resultHtml += "<a class=\"btn_close\">닫기</a>";
				
	            $("#bkResult").html(resultHtml);
	
	
	            $(".result .btn_close").click(function(){
	        		$(this).parent().hide();
	        	});
				
				if(data.brandList.items.length == 0) {
					$("#bkResult").show();
					$("#bkNullResult").show();
				} else {				
					$("#bkResult").show();
					$("#bkNullResult").hide();
				}
				
	          //20141226 추가 : 초성검색 후 에니메이션 추가
	/*          setTimeout(function(){
	              var ytarget_pos = 337;
	              if(screenMode == 2){
	                  ytarget_pos = 155 + $(".categoryList").height();
	              }
	              $('html, body').animate({scrollTop:ytarget_pos});
	          },300);*/
			}
			, error: function(xhr, status, error){
				$loading.remove();
				$("#bkResult").show();
				$("#bkNullResult").show();			
			}
		});		
			
	}
	
	appendLoading( $("#bkResult"), true, brandKeywordSearch, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif', 0 );
	setTclick('m_side_brand_brandsearch');
}

//기획전검색 : 모바일 리뉴얼 - rudolph
var searchPlanShopKeyword = function($loading) {
	if(event.keyCode != 13) return;
	loadPlanShopKeyword();	
}
/* 천단위 콤마 처리 */
function setComma(n){
	var reg = /(^[+-]?\d+)(\d{3})/;
	n += '';
	while(reg.test(n)){
		n = n.replace(reg, '$1' + ',' + '$2');
	}
	return n;
}
//기획전검색 : 모바일 리뉴얼 - rudolph
function loadPlanShopKeyword() {

	var pskSearch = function($loading) {
		if($("#planshopKeyword").val().length < 2) {
			$loading.remove();
			$("#pskSearchResult").hide();
			alert("검색을 위해서는 2글자 이상의 단어를 입력하여 주시기 바랍니다.");		
			return;
		}
		
		if($("#planshopKeyword").val() == "") {
			$loading.remove();
			$("#pskSearchResult").empty();
			var resultHtml = "<ul>\n"
			resultHtml += "</ul>\n";
			resultHtml += "<p class=\"noList\" style=\"display:none;\" id=\"pskNullResult\">검색된 기획전이 없습니다.</p>";
			resultHtml += "<a class=\"btn_close\">닫기</a>";
			$("#pskSearchResult").html(resultHtml);
			$("#pskSearchResult").show();
			$("#pskNullResult").show();    
			
		    $(".result .btn_close").click(function(){
	      		$(this).parent().hide();
	      	});		
			return;
		}
		
		$.ajax({
			url: planShopURLKeyword
			, type: "GET"
			, dataType : "json"
			, data : {
				keyword : $("#planshopKeyword").val()
			}
			, success: function(data) {
				$loading.remove();
				$("#pskSearchResult").empty();
				
				var resultCnt = "<span class=\"cnt\">총 <strong>" + setComma(data.planshop.items.length) + "</strong> 건</span>\n";
	            var resultHtml = resultCnt + "<ul>\n"
	            var dispNm = "";
	            
				for(var i = 0; i < data.planshop.items.length; i++) {
					var bUrl = "/product/m/product_list.do?" + __commonParam
					bUrl += "&curDispNo=" + data.planshop.items[i].spdp_no
					bUrl += "&tclick=m_side_planshop_search_list" + i;
					dispNm = (data.planshop.items[i].disp_nm == null)?"":data.planshop.items[i].disp_nm;
					
					resultHtml += "<li>"					
					resultHtml += "<a href=\"" + bUrl + "\"><span class='name'>" + data.planshop.items[i].spdp_nm + "</span><p class='cate'>" + dispNm + "</p></a>"    				
					resultHtml += "</li>\n";
				}   
	            
	            resultHtml += "</ul>\n";
	            resultHtml += "<div class=\"noList result\" style=\"display:none;\" id=\"pskNullResult\">검색된 기획전이 없습니다.</div>";
	            resultHtml += "<a class=\"btn_close\">닫기</a>";
				
	            $("#pskSearchResult").html(resultHtml);	
	
	            $(".result .btn_close").click(function(){
	        		$(this).parent().hide();
	        	});
				
				if(data.planshop.items.length == 0) {
					$("#pskSearchResult").show();
					$("#pskNullResult").show();
				} else {				
					$("#pskSearchResult").show();
					$("#pskNullResult").hide();
				}
				
	          //20141226 추가 : 초성검색 후 에니메이션 추가
	/*          setTimeout(function(){
	              var ytarget_pos = 337;
	              if(screenMode == 2){
	                  ytarget_pos = 155 + $(".categoryList").height();
	              }
	              $('html, body').animate({scrollTop:ytarget_pos});
	          },300);*/
			}
			, error: function(xhr, status, error){
				$loading.remove();
				$("#pskSearchResult").show();
				$("#pskNullResult").show();			
			}
		});		
			
	}
	
	appendLoading( $("#pskSearchResult"), true, pskSearch, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif', 0 );
	setTclick('m_side_planshop_search');
}


//기획전 : 모바일 리뉴얼 - rudolph
function loadPlanShop(tabIndex, cateNo) {
	
	var selectPlanShop = function($loading) {
		var objCtrl = "#planShopCate" + tabIndex;		
		
		$.ajax({
			url: planShopURL
			, type: "GET"
			, dataType : "json"
			, data : {
				curDispNo : cateNo
			}
			, success: function(data) {
				$loading.remove();				
				$(objCtrl).empty();

				var resultHtml = "";				
				if(data.specialList.plan_banner_list != null) {
					if(data.specialList.plan_banner_list.items.length > 0) {
						resultHtml += "<div class=\"wrap\"><div class=\"specialList\">";
					}
					for(var i = 0; i < data.specialList.plan_banner_list.items.length; i++ ) {
						var bUrl = data.specialList.plan_banner_list.items[i].lnk_url_addr;
						bUrl += (bUrl.indexOf("?") > 0?"&":"?") + "tclick=m_side_planshop_cate_" + data.specialList.plan_banner_list.items[i].disp_no + "_banner" + i;
						
						resultHtml += "<dl>";
						resultHtml += "<dt><a href=\"" + bUrl + "\"><img src=\"" + data.specialList.plan_banner_list.items[i].conts_file + "\" ></a></dt>";
						resultHtml += "<dd>" + data.specialList.plan_banner_list.items[i].conts_desc_cont + "</dd>";
						resultHtml += "</dl>";					
					}
					if(data.specialList.plan_banner_list.items.length > 0) {
						resultHtml += "</div></div>";
					}
				}
				
				
				resultHtml += "<div class=\"searchList\"><ul>";
				if(data.specialList.plan_shop_list != null) {
					for(var i = 0; i < data.specialList.plan_shop_list.items.length; i++) {
						/* MOBILE2 이형근(hglee63): 기획전링크수정 */
						var bUrl = "/product/m/product_list.do?" + __commonParam 
						bUrl += "&curDispNo=" + data.specialList.plan_shop_list.items[i].curDisp_no;
						bUrl += "&tclick=m_side_planshop_cate_" + data.specialList.plan_shop_list.items[i].disp_no + "_list" + i;
						//<li><a href="#"><span>남성정장/셔츠</span> 시원한 여름슈즈가 핫딜에서</a></li>
						resultHtml += "<li><a href=\"" + bUrl + "\"><span class='name'>" + data.specialList.plan_shop_list.items[i].spdp_nm +  "</span><p class='cate'>" + 
							data.specialList.plan_shop_list.items[i].disp_nm + "</p></a></li>";
						/* 링크수정 끝 */
					}
				}
				resultHtml += "</ul></div>";
				
				$(objCtrl).html(resultHtml);
			
	          //20141226 추가 : 초성검색 후 에니메이션 추가
	/*          setTimeout(function(){
	              var ytarget_pos = 337;
	              if(screenMode == 2){
	                  ytarget_pos = 155 + $(".categoryList").height();
	              }
	              $('html, body').animate({scrollTop:ytarget_pos});
	          },300);*/
			}
			, error: function(xhr, status, error){
				$loading.remove();
				$(objCtrl).html("");	
			}
		});				
		
	}
	
	appendLoading( $("#planShopCate" + tabIndex), true, selectPlanShop, 'http://image.lotte.com/lotte/mobile/mobile_new/common/loading_ctgw.gif', 0 );
	//setTclick('planShopCate' + tabIndex);	
}

$(document).ready(function () {
	$("#s_category .spShop dd >ol").append('<li class="oneline"><a href="#none" onclick="outLink(\'https://www.kokdeal.com/luser/land/Landing.do?landing_code=203c24720fc42eb7d65073da58cf6abc0460860c3dbc07922e432d06fa1b57c8\');setTclick(\'m_side_cate_specialshop_kokdeal\');"><span class="iconInsu">kokdeal 보험비교몰</span></a></li>');
});