/*var sideCategory ;*/
var grid;
var colorCode = function(){
  return "#"+((1<<24)*Math.random()|0).toString(16);
};
//Date Function
var	getFirstDay = function(year, month){
	return new Date(year, month, 1).getDay();
}
var	getLastDay = function(year, month){
	return new Date(year, month, 0).getDate();
}
var	getAddZero = function(n){
	return n < 10 ? "0" + n : n;
}
//Date formatter		
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.subFormat = function(len){return "0".string(len - this.length) + this;};
Number.prototype.subFormat = function(len){return this.toString().subFormat(len);};
Date.prototype.format = function(f) {
    if (!this.valueOf()) return "";
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).subFormat(2);
            case "MM": return (d.getMonth() + 1).subFormat(2);
            case "dd": return d.getDate().subFormat(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().subFormat(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).subFormat(2);
            case "mm": return d.getMinutes().subFormat(2);
            case "ss": return d.getSeconds().subFormat(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
/*
 * Util - sessionStorage get / set
 * 20150702
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
function removeSessionStorage ( key ) {
    if ( sessionStorage.getItem( key ) != null ) {
        sessionStorage.removeItem( key );
    }
}
function domainName(){
    return location.hostname.substring(location.hostname.indexOf('.'),location.hostname.length);
}
function searchToJson() {
  return location.search.substring(1).split("&").reduce(function(result, value) {
    var parts = value.split('=');
    if (parts[0]) result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    return result;
  }, {})
}
/* jsp 와 겹치는 문제로 인해 주석처리합니다
function sendTclick(code) {
	console.log("tclick(pub) : " + code);
};
*/
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
} /*end of findChildren*/

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
                loadComplete() ; 
            }
        } , 100 ) ; 
    } 
    loadStart() ; 
} /*end of domLoad*/

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
        if( document.querySelectorAll( '#lotteActionbar' ).length != 0 ){
            opt.actionBarH = tag.actionbar.offsetHeight ;
        };
        opt.mainTopH = tag.mainTop.offsetHeight ; 
        opt.arr_ddsH = [] ; 
        opt.cIdx = null ; 
        opt.hiddenClass = 'hiding' ;
        opt.activeClass = 'active' ;
    }()) ;
    (function prepareSet(){
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
                dd.parentNode.classList.remove( opt.activeClass ) ;
                dd.style.height = 0 + 'px' ; 
            }
        }) ; 
    }
}
SideCategory.prototype = {
    /*testFunc : function () {
        console.log( 'aaasdasdasd' ) ; 
    }*/
} ; 

/*2015.06.30 세로 스와이프 기능 start*/
var scrollHandler = function (e) {
    var tag = {} , opt = {} ; 

    if ( document.querySelectorAll( 'section.product_view03' ).length != 0 && document.body.scrollTop == 0 ) {
        var btn = document.querySelector( 'section.product_view03 div.btn' ) ; 
        btn.setAttribute( 'style' , '' ) ; 
    }
    
    tag.mainHeader = document.querySelector( 'header#head' ) ;
    tag.mainNavOne = document.querySelector( 'nav.main_one' ) ; 
    tag.mainNavTwo = document.querySelector( 'nav.main_two' ) ;
    tag.mainNavTwo = document.querySelector( 'nav.main_two' ) ;
    tag.subHeader = document.querySelector( '#head_sub' ) ;
    
    if($('header#head').length > 0){
        opt.mainHeaderHeight = tag.mainHeader.offsetHeight ;
    }
    
    opt.scrollTop = document.body.scrollTop ;
    opt.zIdx = 90 ;
    
    if ( tag.mainNavOne && tag.mainNavTwo ) {
        /*메인 페이지의 경우*/
        tag.subCD = tag.mainNavTwo.querySelector( 'div.subCD' ) ; 
        
        opt.mainNavOneHeight = tag.mainNavOne.offsetHeight ;
        opt.mainNavTwoHeight = tag.mainNavTwo.offsetHeight ;
        
        /*console.log( opt.scrollTop , opt.mainNavOneHeight , opt.mainNavTwoHeight ) ;*/ 

        if ( opt.scrollTop >= opt.mainHeaderHeight ) {
            tag.mainHeader.style.marginBottom = opt.mainNavOneHeight + opt.mainNavTwoHeight + 'px' ; 
            tag.mainNavOne.style.cssText = 'position: fixed; left: 0px; top: 0px; z-index: ' + opt.zIdx + '; width: 100%;' ; 
            tag.mainNavTwo.style.cssText = 'position: fixed; left: 0px; top: ' + opt.mainNavOneHeight + 'px; z-index: ' + opt.zIdx + '; width: 100%;' ;
            
            var ua = navigator.userAgent ;
            if ( ua.match( 'iPhone' ) != null ) {
                tag.mainNavTwo.style.cssText = 'position: fixed; left: 0px; top: ' + opt.mainNavOneHeight + 'px; z-index: ' + opt.zIdx + '; width: ' + (window.innerWidth) + 'px; ' ;
                tag.subCD.style.cssText = 'position: fixed' ;
            }
            /*
            tag.mainNavTwo.style.cssText = 'position: fixed; top: ' + opt.mainNavOneHeight + 'px; z-index: ' + opt.zIdx + '; width: ' + (window.innerWidth) + 'px; ' ;
            tag.subCD.style.cssText = 'position: fixed' ;
            */ 
        } else {
            tag.mainHeader.setAttribute( 'style' , '' ) ; 
            tag.mainNavOne.setAttribute( 'style' , '' ) ; 
            tag.mainNavTwo.setAttribute( 'style' , '' ) ;
            tag.subCD.setAttribute( 'style' , '' ) ;
            tag.mainNavTwo.classList.remove( 'open' ) ; 
        }
    } else if ( tag.subHeader ) {
 
        if ( document.querySelectorAll( '.scrollFixHead' ).length != 0 ) {
            tag.fixHead = document.querySelector( '.scrollFixHead' ) ;
            
            opt.subHeaderHeight = tag.subHeader.offsetHeight ;
            opt.fixHeadHeight = tag.fixHead.offsetHeight ;
            opt.zIdx = 90 ; 
            
            if ( opt.scrollTop >= opt.mainHeaderHeight + 44 ) {
            	//alert(opt.subHeaderHeight);
                tag.mainHeader.style.marginBottom = ( opt.fixHeadHeight ) + 'px' ;
                tag.fixHead.style.cssText = 'position: fixed; left: 0px; top: 0px; z-index: ' + opt.zIdx + '; width: 100%;' ;
            } else {
                tag.mainHeader.setAttribute( 'style' , '' ) ;   
                tag.subHeader.setAttribute( 'style' , '' ) ;
                tag.fixHead.setAttribute( 'style' , '' ) ;
            }
        }
        
        if ( document.querySelectorAll( 'div.reated_keyword' ).length != 0 ) {
            /*검색 페이지의 경우*/
            
            tag.reated_keyword = document.querySelector( 'div.reated_keyword' ) ; 
            tag.srh_terms_wrap = document.querySelector( 'section.srh_terms_wrap' ) ;
            
            opt.subHeaderHeight = tag.subHeader.offsetHeight ;
            opt.reated_keywordHeight = tag.reated_keyword.offsetHeight ; 
            opt.srh_terms_wrapHeight = tag.srh_terms_wrap.offsetHeight ; 
            opt.zIdx = 90 ; 
            
            if ( opt.scrollTop >= opt.mainHeaderHeight ) {
                tag.mainHeader.style.marginBottom = ( opt.subHeaderHeight ) + 'px' ;
                tag.subHeader.style.cssText = 'position: fixed; left: 0px; top: 0px; z-index: ' + opt.zIdx + '; width: 100%;' ;
                /*tag.reated_keyword.style.cssText = 'background-color: #eee; position: fixed; top: ' + opt.subHeaderHeight + 'px; z-index: ' + opt.zIdx + '; width: 100%;' ;*/
                //tag.reated_keyword.style.cssText = 'display:none' ;
                //tag.srh_terms_wrap.style.cssText = 'display:none' ;
                /*tag.srh_terms_wrap.style.cssText = 'background-color: #eee; position: fixed; top: ' + ( opt.subHeaderHeight + opt.srh_terms_wrapHeight ) + 'px; z-index: ' + opt.zIdx + '; width: 100%;' ;*/
                //tag.srh_terms_wrap.style.cssText = 'background-color: #eee; position: fixed; left: 0px; top: ' + ( opt.subHeaderHeight ) + 'px; z-index: ' + opt.zIdx + '; width: 100%;' ;
            } else {
                tag.mainHeader.setAttribute( 'style' , '' ) ;   
                tag.subHeader.setAttribute( 'style' , '' ) ; 
                /*tag.reated_keyword.setAttribute( 'style' , '' ) ;*/
                tag.reated_keyword.style.cssText = 'display:' ;
                tag.srh_terms_wrap.setAttribute( 'style' , '' ) ; 
            }
        }
        
        if ( document.querySelectorAll( 'section.product_view03' ).length != 0 ) {
            /*서브 상세 페이지의 경우*/
            tag.product_view03 = document.querySelector( 'section.product_view03' ) ;
            tag.product_view03Menu = tag.product_view03.querySelector( 'ul.menu' ) ;
            tag.product_view03Btn = tag.product_view03.querySelector( 'div.btn' ) ;
            tag.container = document.querySelector( '#container' ) ;
            tag.subTabs = document.querySelectorAll( 'div.sub-tab' ) ; 
            
            opt.product_view03Height = tag.product_view03.offsetHeight ;
            opt.subHeaderHeight = tag.subHeader.offsetHeight ;
            opt.subTabsPaddingTop = 10 ;
            opt.product_view03BtnHeight = tag.product_view03Btn.offsetHeight ;
            opt.zIdx = 90 ; 
            
            tag.product_view03Menu.style.position = 'static' ;
            //tag.product_view03.style.cssText = 'padding-top:0px' ;
            tag.product_view03Menu.style.cssText = 'martin-top:0px' ;
            //alert(opt.product_view03BtnHeight);

            if ( opt.scrollTop >= opt.mainHeaderHeight ) {
                
                tag.mainHeader.style.marginBottom = opt.subHeaderHeight + 'px' ;
                tag.subHeader.style.cssText = 'position: fixed; left: 0px; top: 0px; z-index: ' + opt.zIdx + '; width: 100%;' ;
                
                
                opt.product_view03MenuTop = tag.product_view03Menu.getBoundingClientRect().top ;
                opt.product_view03MenuHeight = tag.product_view03Menu.offsetHeight ;
                
                if ( opt.product_view03MenuTop <= opt.subHeaderHeight ) {
                    tag.subHeader.style.top = (opt.product_view03MenuTop - opt.subHeaderHeight) + 'px' ;
                    tag.product_view03Btn.style.cssText = 'position: fixed; left: 0px; top: ' + (opt.product_view03MenuTop - opt.subHeaderHeight + opt.product_view03BtnHeight + opt.subHeaderHeight + opt.subTabsPaddingTop ) + 'px; z-index: ' + opt.zIdx + '; width: 100%;' ;
                    if ( opt.product_view03MenuTop <= 0 ) {
                        [].forEach.call( tag.subTabs , function( subTab , idx ){
                            subTab.style.paddingTop = ( opt.product_view03MenuHeight + opt.subTabsPaddingTop ) + 'px' ; 
                        }) ;
                        tag.product_view03Menu.style.cssText = 'position: fixed; left: 0px; top: 0px; z-index: ' + opt.zIdx + '; width: 100%;' ;
                        tag.product_view03Btn.style.cssText = 'position: fixed; left: 0px; top: ' + ( opt.subHeaderHeight + opt.subTabsPaddingTop ) + 'px; z-index: ' + opt.zIdx + '; width: 100%;' ;
                    } else {
                        [].forEach.call( tag.subTabs , function( subTab , idx ){
                            subTab.style.paddingTop = opt.subTabsPaddingTop + 'px' ; 
                            console.log(subTab.style.paddingTop);
                        }) ;
                        /*tag.product_view03Btn.removeAttribute( 'style' ) ;*/
                        tag.product_view03Btn.setAttribute( 'style' , '' ) ;
                    }
                }
            } else {
                tag.mainHeader.setAttribute( 'style' , '' ) ;  
                tag.subHeader.setAttribute( 'style' , '' ) ;
            }
        } else {
            /*기획전 상세 페이지*/
            if ( document.querySelectorAll( 'div.plan_list' ).length != 0 && document.querySelectorAll( 'div.list_header' ).length != 0 ) {
                tag.planList = document.querySelector( 'div.plan_list' ) ; 
                tag.listHeader = document.querySelector( 'div.list_header' ) ; 
                
                opt.planListTop = tag.planList.getBoundingClientRect().top ;
                opt.listHeaderTop = tag.listHeader.getBoundingClientRect().top ;

                opt.subHeaderHeight = tag.subHeader.offsetHeight ;
                opt.zIdx = 90;
                
                if ( opt.scrollTop >= opt.mainHeaderHeight ) { 
                    tag.mainHeader.style.marginBottom = opt.subHeaderHeight + 'px' ;
                    tag.subHeader.style.cssText = 'position: fixed; left: 0px; top: 0px; z-index: ' + opt.zIdx + '; width: 100%;' ;
                     
                    if ( opt.planListTop <= opt.subHeaderHeight ) {
                        tag.subHeader.style.top = (opt.planListTop - opt.subHeaderHeight) + 'px' ;
                        if ( opt.planListTop <= 0 ) {
                            tag.listHeader.style.cssText = 'position: fixed; left: 0px; top: 0px; z-index: ' + opt.zIdx + '; width: 100%;' ; 
                        } else {
                            tag.listHeader.setAttribute( 'style' , '' ) ;
                        }
                    } else {
                        tag.listHeader.setAttribute( 'style' , '' ) ;
                    }
                } else {
                    tag.mainHeader.setAttribute( 'style' , '' ) ;  
                    tag.subHeader.setAttribute( 'style' , '' ) ;
                    tag.listHeader.setAttribute( 'style' , '' ) ; // 20150721 박형윤 - 리스트 타입 선택바 스타일 초기화
                }            
            }
        }
    }
} /*end of scrollHandler*/
/*2015.06.30 세로 스와이프 기능 start*/
function getCookieValue(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
         start += cName.length;
         var end = cookieData.indexOf(';', start);
         if(end == -1)end = cookieData.length;
         cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}
function setCookieValue (name, value, expiredays) { 
    /*내일 00:00 시 구하기*/
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays);
    /*쿠키 expire 날짜 세팅*/
    var expireDate = new Date(todayDate.getFullYear(), todayDate.getDate());
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + expireDate.toGMTString() + ";";
}
function appIntroFunc () {
    
    var uagent = navigator.userAgent.toLowerCase(); /*디바이스 구분을 위해*/
    var cookies = document.cookie;
    
    if ( !getCookieValue( 'firstAppNoti' ) &&
            ((uagent.indexOf("android") > -1 && (uagent.indexOf("2.24") > -1 || uagent.indexOf("1.08") > -1)) // android
            || (uagent.indexOf("android") < 0 && (uagent.indexOf("2.15") > -1 || uagent.indexOf("2.14") > -1 || uagent.indexOf("1.34") > -1 || uagent.indexOf("1.35") > -1))) ){ // IOS

        if ( document.querySelectorAll( 'div.appIntro' ).length == 0 ){
            return ;
        }
        var wrapper = document.querySelector( 'div#wrapper' ) , 
            bodySc = document.querySelector( 'body' ) , 
            appIntro = document.querySelector( 'div.appIntro' ) , 
            btnNext = appIntro.querySelector( 'img.next' ) ,
            btnStart = appIntro.querySelector( 'img.start' ) ,
            btnSkip = appIntro.querySelector( '.skip' ) ,
            ulBox = appIntro.querySelector( 'ul' ) ,
            liFirst = appIntro.querySelector( 'ul li:first-child' ) ,
            bullets = appIntro.querySelectorAll( 'span.bullet' ) ;
            
        appIntro.style.visibility = 'visible' ;
        appIntro.style.marginTop = '0px' ;
        wrapper.classList.add( 'blur' ) ;
        bodySc.classList.add( 'noneScroll' ) ;

        if(isIOS){ /*ios 액션바*/
        	location.href="lottebridge://lotteapps/hide"
        }else if(isAndroid){ /*android 액션바*/
        	window.lottebridge.callAndroid("lottebridge://lotteapps/hide");
        }

        //document.body.style.height = window.innerHeight + 'px' ; 
        //document.body.style.overflow = 'hidden' ;
        //webview.setHorizontalScrollBarEnabled(false);
        //webview.setHorizontalScrollBarEnabled(false);
        
        btnNext.addEventListener( 'click' , function (){
            btnNext.style.visibility = 'hidden' ;
            btnSkip.style.visibility = 'hidden' ;
            btnStart.style.visibility = 'visible' ;
            bullets[0].classList.remove( 'active' ) ;
            bullets[1].classList.add( 'active' ) ;
            
            setTimeout(function(){
                ulBox.classList.add( 'move' ) ;
            } , 0 ) ; 
        }) ;
        
        btnStart.addEventListener( 'click' , skipHandler ) ;
        btnSkip.addEventListener( 'click' , skipHandler ) ; 
        function skipHandler () {
            wrapper.classList.remove( 'blur' ) ;
            bodySc.classList.remove( 'noneScroll' ) ;
            appIntro.style.display = 'none' ;
            if(isIOS){ /*ios 액션바*/
            	location.href="lottebridge://lotteapps/show";
            }else if(isAndroid){ /*android 액션바*/
            	window.lottebridge.callAndroid("lottebridge://lotteapps/show");
            }
            document.body.setAttribute( 'style' , '' ) ;
            /*console.log( 'aaaa' ) ; 
            getScope().loadMainPopup(); 팝업 닫힘(?)*/
        }
        
        /*cookie set*/
        setCookieValue( 'firstAppNoti', 'already', 999);
    }
}

window.addEventListener( 'load' , function () {
    var list = document.querySelectorAll(".view ul li");
    Array.prototype.forEach.call(list , function(element, index){
        element.style.background = colorCode(); 
    });
    
    window.onscroll = function (e){ 
        /*console.log( 'chk : ' , document.body.scrollTop ) ;*/
        /*e.preventDefault() ;*/ 
        scrollHandler(e) ;
    } ;
    
    //appIntroFunc(); 앱 처음 떴을 때, 안내페이지 삭제 

    window.addEventListener( 'scroll' , function(e){
        /*scrollHandler(e) ;*/
    }) ;
    /*domLoad() ;*/ 
}) ; 

function whichTransitionEvent() {
    var t , 
        el = document.createElement( 'fakeelement' ) , 
        retVal ; 
    
    var transitions = {
        'transition' : 'transitionend' ,  
        'OTransition' : 'oTransitionEnd' , 
        'MOZTransition' : 'transitionend' , 
        'WebkitTransition' : 'webkitTransitionEnd' 
    } ; 
    
    for ( t in transitions ) {
        if ( el.style[t] !== undefined ) {
            
            var ua = navigator.userAgent ;
            
            if ( ua.match( 'Android' ) != null ) {
                var device_android = ua.match( 'Android' )['input'] ; 
                var galaxyS3 = device_android.match( 'SHV-E210' ) != null || device_android.match( 'SHW-M440' ) != null || device_android.match( 'SHW-M500' ) != null ? true : false ; /* KCC-CMM-SEC-SHVE210 */
                var galaxyNote2 = device_android.match( 'SHV-E250' ) != null ? true : false ; /* KCC-CMM-SEC-SHVE250 */
                if ( galaxyS3 ) {
                    retVal = transitions['WebkitTransition'] ;
                    return retVal ;
                }
                if ( galaxyNote2 ) {
                    retVal = transitions['WebkitTransition'] ;
                    return retVal ;
                }
                if ( !galaxyS3 && !galaxyNote2 ) {
                    retVal = transitions[t] ;
                    return retVal ;
                }
            } else {
                retVal = transitions[t] ;
                return retVal ;
            } 
        }
    }
}

function whichTransformCss () {
    var t , 
        el = document.createElement( 'fakeelement' ) , 
        retVal ; 
    
    var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split( ' ' ) ; 
    [].forEach.call( prefixes , function( trans , idx ){
        if ( el.style[trans] !== undefined ) {
            retVal = trans ; 
        } 
    }) ; 
    return retVal ;
}

var transitionEvent = whichTransitionEvent() ; /* 기기별 transitionend event 대입 */
var transformCss = whichTransformCss() ; /* 기기별 transform css3 대입 */

/*최근본상품 전체삭제(native call)*/
function removeLatestItems(){
	localStorage.removeItem("viewGoods");
	if (isIOS){
		window.location='lottebridge://viewlatestitems/viewGoods=';
	}else if(isAndroid){
		window.JsObject.callAndroid('viewGoods=');
	}
    setTimeout(function(){
    	alert("삭제되었습니다.");
    }, 1000);
}
