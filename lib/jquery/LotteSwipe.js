/*var swipe = {} ;*/ 
function Swipe ( target , slider , option ) {
    
  /*
   * 플러긴 안에서 사용될 각각의 전역 프로퍼티
   * tag -> dom을 담아둔다.
   * opt -> 여러 정보를 담는다.
   * pu -> 외부에 사용될 public 을 설정
  */  
  var tag = {} , opt = {} , pu = {} ;
  
  var startScrTime ; 

  (function domSet () {
    tag.mother = target ; // 최상위 돔
    /*console.log( tag.mother ) ;*/ 
    
    tag.ulBox = tag.mother.querySelector( slider ) ; // 스와이프 될 리스트 부모 박스
    tag.li = tag.ulBox.children[0] ; // 리스트
    tag.nav = option.navigation ; // 연동될 내비게이션
    tag.navList = findChildren( tag.nav , ':scope > li') ; // 내비게이션 목록 
    //tag.loadWrap = findChildren( document.querySelector( 'div.wrapBox' ) , ':scope > div.loadWrap' )[0] ;
    tag.loadWrap = findChildren( document.querySelector( 'section[ng-show=contVisible]' ) , ':scope > div.loadWrap' )[0] ; // 스와이프시 사용될 로딩
  }()) ; 

  (function objSet () { 
    opt.navListLen = tag.navList.length ; // 내비게이션 개수
    opt.startX = 0 ; // 시작점  x
    opt.startY = 0 ; // 시작점 y
    opt.moveX = 0 ; // 움직인 거리 x
    opt.addMoveX = 0 ;  // 움직인 거리에 더해질 거리
    opt.moveY = 0 ; // 움직인거리 y
    opt.dirX = null ; // 움직이는 방향 
    opt.moveClass = 'stop' ; // 움직임을 관장할 css3 className
    opt.activeClass= 'active' ; // 활성화 className
    
    opt.scrTop = document.body.scrollTop ; // 스크롤 최상위
    opt.c_scrTop = document.body.scrollTop ; // 현재 스크롤 최상위
    opt.endScrTime = Date.now() ; // 스크롤이 멈춘 시각
    
    ///
    opt.startScrollY = 0 ;
    opt.moveScrollY = 0 ; 
    ///

    opt.ratio = option.dragRatio ? option.dragRatio : 2 ; // 화면 드래그 비율 
    opt.durationSpeed = option.duration ? option.duration : .3 ; // 화면 드래그 속도
    opt.loopBool = option.loop ? option.loop : false ; // 루프가능 한가의 여부
    
    opt.verticalBool = false ; // 세로 스와이프 확인 여부
    opt.horizontalBool = false ; // 가로 스와이프 확인 여부
    opt.clickBool = true ; // 클릭 확인 여부
    opt.dragChkBool = true ; /*드래그 방향이 잡협는가에 대한 참,거짓을 반환 합니다.*/
    opt.moveBool = true ; // 움직임 가능 여부 

    opt.motherW = tag.mother.offsetWidth ; // 부모박스의 가로길이
    opt.liW = opt.motherW ; // 움직일 목록(child) 가로길이
    opt.ulBoxW = opt.liW ; // 박스의(parent) 가로길이

    opt.cNum = 0 ; /*현재 페이지에 들어올 값*/ 
    opt.oldCNum = 0 ; 
  }()) ; 

  (function prepareSet () {
    var lis ;  
    /*
      css = '-webkit-transition: all ' + opt.durationSpeed + 's; ' ; 
    css += '-moz-transition: all ' + opt.durationSpeed + 's; ' ; 
    css += '-o-transition: all ' + opt.durationSpeed + 's; ' ; 
    css += 'transition: all ' + opt.durationSpeed + 's; ' ;
    */

    /*document.styleSheets[0].insertRule('.stop { ' + css + ' }');*/

     /*tag.li.style.width = opt.liW + 'px' ;*/ 
     /*tag.ulBox.style.width = opt.ulBoxW + 'px' ;*/
    
    /*새로 들어오는 네비게이션의 순번을 추가해준다.*/ 
    [].forEach.call( tag.navList , function ( li , idx ){
        li.setAttribute( 'data-idx' , idx ) ; 
    }) ;
    
    /*tag.ulBox.style.height = '4000px' ;*/
    /*tag.ulBox.style.width = '644px' ;*/
    /*tag.ulBox.style.backgroundColor = 'red' ;*/ 
    
    /*addBox () ;*/ 
    
  }()) ; 

  (function evtSet () {
    /*addEvents( tag.ulBox , 'touchstart touchmove touchend' , swipeHandler ) ;*/

    addEvents( tag.ulBox , 'touchstart' , swipeStartHandler ) ;  
    addEvents( tag.ulBox , 'touchmove' , swipeMoveHandler ) ; 
    addEvents( tag.ulBox , 'touchend' , swipeEndHandler ) ; 

    /*addEvents( window , 'touchstart' , swipeStartHandler ) ;*/ 
    /*addEvents( window , 'touchmove' , swipeMoveHandler ) ;*/ 
    /*addEvents( window , 'touchend' , swipeEndHandler ) ;*/

    [].forEach.call( tag.navList , function ( el , idx ) {
      el.addEventListener( 'click' , clickHandler ) ; 
    }) ;

    window.addEventListener( 'resize' , resizeHandler ) ;
    
    var timer = null ;
    window.addEventListener( 'scroll' , function(e){
        if ( timer !== null ) {
            clearTimeout( timer ) ; 
        }
        
        timer = setTimeout(function(){ 
            opt.startScrollY = document.body.scrollTop ;
        } , 150 ) ; 
    }) ;
  }()) ; 

  function resizeHandler () {
      opt.liW = window.innerWidth ;
      /*opt.liW = opt.motherW ;*/
      
  } /*end of resizeHandler*/

  function clickHandler (e) {
    var btn = this , 
      addIdx = parseInt(btn.dataset.idx) , 
      box , 
      li ;
  } /*end of clickHandler*/

  function addBox () {
    var box = tag.descBoxs[opt.cNum] , 
    li = findChildren( tag.ulBox , 'li:first-child' ) ; 

    li.setAttribute( 'data-cnum' , opt.cNum ) ; 
    li.appendChild( box.cloneNode(true) ) ; 
    /*tag.ulBox.querySelector( 'li:first-child' ).appendChild( box.cloneNode(true) ) ;*/   
  }

  function swipeStartHandler (e) {
      //opt.startScrollY = document.body.scrollTop ;
      
      //if ( startScrTime < 400 ) {
          opt.moveBool = true ; 
      //}
    
    if ( e.targetTouches.length == 1 ) { // 화면상에 스와이드 대상이 1개일 경우에만 시작할 수 있다. 
        if ( !opt.moveBool ) return
                
        if ( tag.ulBox.classList.contains( 'stop' ) ) { // 직접 드래그 이므로 움직임 클래스명이 있다면 삭제해준다.
            tag.ulBox.classList.remove( 'stop' ) ; 
        }
        //opt.moveBool = true ;
        
        startScrTime = Date.now() ; // 움직임을 시작한 시간을 저장
        startScrTime = Math.abs( opt.endScrTime - startScrTime ) ; // 움직임을 제어한 시간을 확인 
        
        /*
         * 움직임 시간을 확인하여 
         * 만약 너무 빠르게 움직이고 있다면 (ios 을 위한 장치)
         * 움직임을 다시 시작하지 못하도록 하며, 
         * 준수한 속도라면 접근이 가는 하도록 움직임 유무를 저장해준다. 
        */
        if ( startScrTime  > 200 ) { 
            opt.moveBool = true ;
        } else {
            opt.moveBool = false ;
        }
        
        // 시작에 필요한 참거짓을 초기화한다.
        if ( opt.dragChkBool != true ) {
          opt.dragChkBool = true ; 
        }
        if ( opt.verticalBool != false ) {
          opt.verticalBool = false ; 
        }
        if ( opt.horizontalBool != false ) {
          opt.horizontalBool = false ;
        } 
        
        if ( tag.mother.hasAttribute( 'style' ) ) {
          tag.mother.removeAttribute( 'style' ) ;
        }

        if ( opt.startScrollY < document.body.scrollTop + 30 && opt.startScrollY > document.body.scrollTop - 30 ) {
            opt.inAccsess = true ;
            //opt.verticalBool = false ;
        } else {
            opt.inAccsess = false ;
            opt.verticalBool = true ;
        }
        
        opt.touchTop = document.body.scrollTop ;
        /*console.log( 'start touchTop : ' , opt.scrTop , opt.touchTop ) ;*/ 
          
        // 현재 움직임이 시작된 좌료들을 저장한다.
        var m = e.touches[0] ;
        opt.startX = m.pageX ; 
        opt.startY = m.pageY ; 
        rect = tag.ulBox.getBoundingClientRect() ; 
        opt.oldCNum = opt.cNum ;
    }
  }
  
  
  var _top = 100 ; 

  function swipeMoveHandler (e) {
    if ( !opt.inAccsess ) return ; 
    //console.log( 'opt.verticalBool : ' , opt.verticalBool , 'opt.dragChkBool : ' , opt.dragChkBool , 'opt.horizontalBool : ' , opt.horizontalBool ) ;
      
    opt.moveScrollY = document.body.scrollTop ;
      
    var m_scrollY = parseInt( getSessionStorage( 'm_nowScrollY' ) ) ;

    if ( e.targetTouches.length == 1 ) {
        tag.loadWrap.classList.remove( opt.moveClass ); 
        if ( !opt.moveBool ) return ; // 움직임 유무가 거짓이라면 사용을 제외
        mainApp.swipeInfo.swipeBool = true ; // main.js 에 현재 스와이프 중임을 전달
         
        var m = e.touches[0] ; 
        opt.pageX = m.pageX ; 
        opt.pageY = m.pageY ; 
    
        opt.moveX = Math.abs(m.pageX - opt.startX) ; 
        opt.moveY = Math.abs(m.pageY - opt.startY) ; 
    
        if ( opt.verticalBool ) { // 새로로 스와이프 중인 경우 이벤트를 끝내고 현재 페이지의 가로 값을 부모박스에 대입
          tag.ulBox.style[transformCss]  = "translateX(" + 0 + "px) translateZ(0px)";
          /*tag.ulBox.style.webkitTransform  = "translateX(" + 0 + "px) translateZ(0px)";*/
          /*tag.ulBox.style.width = opt.liW + 'px' ;*/ 
          tag.mother.style.width = opt.liW + 'px' ; 
          return ; 
        }
        
        /*
         * 드래그 가능여부를 확인
         * 가로 움직임이 세로보다 크다면 -> 가로 스와이프를 참으로 반환 , 세로 스와이프를 거짓으로 반환
         * 세로 움직임이 세로보다 크다면 -> 가로 반환의 반대값을 반환
        */
        if ( opt.dragChkBool ) { 
          if ( opt.moveX > opt.moveY ) {
            opt.horizontalBool = true ; 
            opt.verticalBool = false ;
          } else if ( opt.moveY > opt.moveX ) {
            opt.horizontalBool = false ; 
            opt.verticalBool = true ;
          }
        }
    
        opt.dragChkBool = false ; // 드래그가 실행 되고있으므로 드래그 유무를 거짓으로 반환 
    
         /*console.log( 
           'opt.moveX : ' , opt.moveX , 
           'opt.moveY : ' , opt.moveY , 
           'opt.horizontalBool : ' , opt.horizontalBool , 
           'opt.verticalBool : ' , opt.verticalBool 
         )*/
        
        /*console.log( 'opt.horizontalBool : ' , opt.horizontalBool , opt.scrTop + 30 >= opt.touchTop , opt.scrTop - 30 <= opt.touchTop , 'opt.scrTop : ' , opt.scrTop , 'opt.touchTop : ' , opt.touchTop ) ;*/ 
    
        /*if ( opt.horizontalBool && opt.scrTop + 30 >= opt.touchTop && opt.scrTop - 30 <= opt.touchTop ) {*/
        if ( opt.horizontalBool ) {
            // 가로로 움직임 경우 이벤트 기본설정을 꺼둔다.
            e.preventDefault() ; 
            e.stopPropagation() ;
            
            opt.moveX = opt.startX - m.pageX ; 
            opt.dirX = opt.moveX < 0 ? -1 : 1 ; // 움직임에 따라 방향성을 반환 ( -1 : left , 1 : right ) 
            
            mainApp.swipeInfo.transBool = true ; // main.js 에 트랜지션중임을 알려준다.
            appendList() ; // 방향에 맞는 목록(LI) 를 추가 한다.
            
             /*horizontalMove( -(opt.moveX - rect.left ) + opt.addMoveX ) ;*/ 
            horizontalMove( -(opt.moveX - rect.left ) ) ;
        }
    }
  } /*end of swipeMoveHandler*/

  function swipeEndHandler (e) {
      if ( !opt.moveBool ) return
    var m = e.touches[0] ;
    
    if ( opt.horizontalBool ) { 
      horizontalEnd() ; // 가로 스와이프가 끝났다면 움직임 제어를 마무리 한다.
    } else {
        //document.querySelector( 'body' ).setAttribute( 'style' , '' ) ;
        //document.querySelector( 'html' ).setAttribute( 'style' , '' ) ;
    }
    
    // 스와이프에 필요한 조건들을 초기화 한다.
    opt.dragChkBool = true ; 
    opt.verticalBool = false ; 
    opt.horizontalBool = false ; 
    
    /*
     * 현재의 스크롤 최상위값과 시간을 저장하여
     * 스와이프 시작시에 현재 스와이프 발동이 빠른지 짧은지의 여부를 확인한다.
    */
    opt.c_scrTop = document.body.scrollTop ; // 현재의 스크롤 최상위값을 저장한다. 
    opt.endScrTime = Date.now() ; // 현재 끝난 부분의 시각을 저장한다.
    
    /*tag.mother.style.width = opt.liW + 'px' ;*/
    //tag.mother.removeAttribute( 'style' ) ; 
    tag.mother.setAttribute( 'style' , '' ) ; // 스와이프가 끝나면 추가된 스타일을 삭제하여 초기화 한다.
    
    opt.scrTop = document.body.scrollTop ;
    opt.startScrollY = document.body.scrollTop ;
    
/*    console.log( 'end chk' ) ; 
    console.log( document.querySelector( 'nav.main_one' ) ) ;
    console.log( document.querySelector( 'nav.main_two' ) ) ;

    tag.nav = document.querySelector( 'nav.main_two > ul.menu' ) ;  
    tag.navList = findChildren( tag.nav , ':scope > li') ;
    opt.navListLen = tag.navList.length ;*/
    
  }
  
  function loadWrapMakeFun () { // 스와이프중 보여질 로딩바 제어
    var subCC_h = 0 ;
    var actionbar_h = 0 ;
    var contentH = 0 ;
    var contentT = 0 ; 
 
    if ( indexA != 0 ) { 
      subCC_h = 39 ; // 메인이 아닌 페이지라면 기본으로 39의 높이를 갖는다.
    }

    if ( document.querySelectorAll( 'section#lotteActionbar' ).length != 0 ) { // 액션바가 존재한다면 액션바의 세로값을 갖는다 ( 앱의 경우 추가 ) 
      actionbar_h = document.querySelector( 'section#lotteActionbar' ).offsetHeight ; 
    }
      
    contentH = window.innerHeight - document.querySelector( 'header#head' ).offsetHeight - document.querySelector( 'nav.main_one' ).offsetHeight - document.querySelector( 'nav.main_two' ).offsetHeight - actionbar_h - subCC_h ;
    contentT = document.querySelector( 'header#head' ).offsetHeight + document.querySelector( 'nav.main_one' ).offsetHeight + document.querySelector( 'nav.main_two' ).offsetHeight + subCC_h ; 
    
    opt.contentT = contentT ;
    opt.contentH = contentH ; 
//    opt.contentH = contentH + parseInt(sessionStorage.getItem( 'm_nowScrollY' )) ;
//    console.log( parseInt(sessionStorage.getItem( 'm_nowScrollY' )) ) ; 
    
    if ( parseInt(sessionStorage.getItem( 'm_nowScrollY' )) >= 47 ) {
        contentT = contentT + parseInt(sessionStorage.getItem( 'm_nowScrollY' )) - 47 ;
        contentH = contentH + 47 ;
        
        if ( document.querySelector( 'div.subCC' ).offsetHeight != 0 ) {
            //contentT = contentT 
        }
    } else {
        if ( !isNaN( parseInt(sessionStorage.getItem( 'm_nowScrollY' )) ) ) {
            contentH = contentH + parseInt(sessionStorage.getItem( 'm_nowScrollY' )) ;
        }
    }
    
    
    var m_scrollY = parseInt( getSessionStorage( 'm_nowScrollY' ) ) ; 
    /* 스크롤링이 헤더 세로값보다 크면 로딩바에 세로값을 적용 */ 
    if ( m_scrollY >= 47 ) {
        contentT = contentT - m_scrollY ;
    } else {
        if ( !isNaN(m_scrollY) ) {
            contentT = contentT - m_scrollY ;
        }
    }
    
    /*tag.loadWrap.style.border = '1px solid red' ;
    tag.loadWrap.style.boxSizing = 'border-box' ;*/
    
    //tag.loadWrap.style.position = 'absolute' ;
    tag.loadWrap.style.position = 'fixed' ; 
    tag.loadWrap.style.zIndex = 50 ; 
    tag.loadWrap.style.width = '100%' ; 
    tag.loadWrap.style.height = contentH + 'px' ; 
    tag.loadWrap.style.top = contentT + 'px' ; 
    tag.loadWrap.classList.remove( 'none' ) ; 
    
     
  }

  function appendList () {
    var lis = findChildren( tag.ulBox , ':scope > li' ) , 
      li = document.createElement( 'li' ) ,  
      box ; 

     /*console.log( 'opt.cNum : ' , opt.cNum , 'opt.dirX : ' , opt.dirX , 'lis.length : ' , lis.length , 'opt.addMoveX : ' , opt.addMoveX , 'opt.moveX : ' , opt.moveX ) ;*/
     /*console.log( 'lis.length : ' , lis.length , 'opt.dirX : ' , opt.dirX , 'opt.addMoveX : ' , opt.addMoveX , 'opt.moveX : ' , opt.moveX ) ; */
 
    li.style.position = 'absolute' ;
    li.style.top = 0 + 'px' ; 
    li.style.width = opt.liW + 'px' ;
    /*li.style.minHeight = window.innerHeight + 'px' ;*/
    li.setAttribute( 'data-clone' , 'added' ) ;

    if ( lis.length == 1 && opt.dirX == 1 ) {
      //console.log( '리스트가 하나 이며 좌측 드래그인 경우' ) ; 
      li.style.right = - opt.liW + 'px' ;
      
      tag.loadWrap.style.right= - opt.liW + 'px' ;
      tag.loadWrap.style.left = 'auto' ; 
      loadWrapMakeFun() ; 

      li.style.height = findContentH() + 'px' ;
      /*li.appendChild( loadWrap ) ; */
      /*tag.ulBox.appendChild( li ) ;*/
      
      /*console.log( 'mainApp.swipeInfo.subNumCurrent : ' , mainApp.swipeInfo.subNumCurrent , 'opt.dirX : ' , opt.dirX ) ;*/
      var ollis = document.querySelectorAll( '[dom-load-directive2]' ) ;
      [].forEach.call( ollis , function ( el , idx , arr ){
          el.removeAttribute( 'dom-load-directive2' ) ;
          
          if ( idx == arr.length -1) {
              /*console.log( 'nav : ' , mainApp.swipeInfo.subNumCurrent , opt.navListLen - 1 ) ;*/ 
              if ( mainApp.swipeInfo.subNumCurrent != opt.navListLen - 1 ) {
                  mainApp.swipeInfo.subNumNew = mainApp.swipeInfo.subNumCurrent + 1 ;
                  mainApp.swipeInfo.swipeBool = true ;                
              }
          }
      }) ;
      
      opt.cNum = opt.cNum + 1 >= opt.navListLen ? 0 : opt.cNum + 1 ; 
      opt.addMoveX = 0 ;
    } else if ( lis.length > 1 && opt.dirX == -1 && opt.addMoveX == 0 && opt.moveX < 0 ) {
        //console.log( '리스트가 두개 이며 하나를 삭제해야하며 우측 드래그인 경우' ) ;
        [].forEach.call( lis , function ( li , idx ) { 
            if( li.dataset.clone == "added" ) {
                li.parentNode.removeChild( li ) ; 
            }
        }) ; 
      /*opt.cNum = parseInt(findChildren( tag.ulBox , ':scope > li:first-child').dataset.cnum) ;*/
    }

    if ( lis.length == 1 && opt.dirX == -1 ) {
        //console.log( '리스트가 하나 이며 우축 드래그인 경우' ) ;
        li.style.left= - opt.liW + 'px' ;
        
        tag.loadWrap.style.left = - opt.liW + 'px' ;
        tag.loadWrap.style.right = 'auto' ; 
        loadWrapMakeFun() ;
        
        /*var loadWrap = findChildren( document.querySelector( 'div.wrapBox' ) , ':scope > div.loadWrap' )[0].cloneNode( true ) ;*/ 
        /*loadWrap.classList.remove( 'none' ) ; */

        li.style.height = findContentH() + 'px' ;
        /*li.appendChild( loadWrap ) ;*/
        /*tag.ulBox.appendChild( li ) ; */
        
        opt.addMoveX = -opt.liW ;

        if ( mainApp.swipeInfo.subNumCurrent != 0 ) {
            mainApp.swipeInfo.subNumNew = mainApp.swipeInfo.subNumCurrent - 1 ;
            mainApp.swipeInfo.swipeBool = true ; 
        }
        
    } else if ( opt.dirX > 0 && lis.length > 1 && opt.addMoveX < 0 && opt.moveX >= 0 ) {
        //console.log( '리스트가 두개 이며 좌측 드래그인 경우' ) ;
        [].forEach.call( lis , function ( li , idx ) { 
            if( li.dataset.clone == "added" ) {
                li.parentNode.removeChild( li ) ; 
            }
        }) ;
    }
  } /*end of appendList*/
  
  function findContentH () {
    var container = document.querySelector( 'ul.container' ) , 
      header = document.querySelector( 'header#head' ) , 
      menuOne = document.querySelector( 'nav.main_one' ) ,
      menuTwo= document.querySelector( 'nav.main_two' ) , 
      footer = document.querySelector( 'footer#footer' ) , 
      olList = document.querySelector( 'ol.list' ) ,
      contentH = 0 , 
      footerNoti ;
 
    if ( container.offsetHeight + header.offsetHeight + menuOne.offsetHeight + menuTwo.offsetHeight + footer.offsetHeight < window.innerHeight ) {
        /*console.log( 'aaa' ) ;*/ 
        /* 리스트길이가 브라우저보다 작을 경우 */
        contentH = window.innerHeight - header.offsetHeight - menuOne.offsetHeight - menuTwo.offsetHeight - footer.offsetHeight ;
    } else {
        /*console.log( 'bbb' ) ;*/  
        contentH = window.innerHeight - header.offsetHeight - menuOne.offsetHeight - menuTwo.offsetHeight ; 
        if ( document.querySelectorAll( 'div.footerNoti' ).length != 0 ) {
          footerNoti = document.querySelector( 'div.footerNoti' ) ;
          /*console.log( 'footerNoti : ' , footerNoti ) ;*/ 
          contentH = contentH - footerNoti.offsetHeight ;
          /*console.log( 'bbb4' ) ;*/
        }
    }
    return contentH ; 
  }
  
  function horizontalMove ( moveX ) { 
    /*console.log( 'moveX : ' ,  opt.moveX , rect.left , opt.addMoveX ) ;*/
    /*console.log( 'tag.ulBox : ' , tag.ulBox ) ;*/ 
        
    tag.ulBox.style[transformCss]  = "translateX(" + moveX + "px) translateZ(0px)";
    tag.loadWrap.style[transformCss]  = "translateX(" + moveX + "px) translateZ(0px)";
  } /*end of horizontalMove*/ 

  function horizontalEnd () {
    var evts = [ 'webkitTransitionEnd' , 'transitionend' ] , 
      lis = findChildren( tag.ulBox , ':scope > li' ) , 
      dep = 0 , cIdx ; 
    
    opt.moveBool = false ; 
     /*console.log( 'opt.dirX : ' , opt.dirX , 'opt.moveX : ' , opt.moveX , 'opt.liW / opt.ratio : ' , opt.liW / opt.ratio ) ;*/

    if ( opt.liW / opt.ratio <= opt.moveX && opt.dirX > 0 ) {
      /*console.log( '왼쪽 드래그시 브라우저 반이 넘어갔을 경우' ) ;*/
      
      mainApp.swipeInfo.subNumNew = mainApp.swipeInfo.subNumCurrent + 1 ;
      /*console.log( 'mainApp.swipeInfo.subNumNew : ' , mainApp.swipeInfo.subNumNew , opt.navListLen - 1 ) ;*/
      
      /* case 1 : loop false */
//      if ( mainApp.swipeInfo.subNumNew > opt.navListLen - 1 ) mainApp.swipeInfo.subNumNew = opt.navListLen - 1 ; 
//      if ( mainApp.swipeInfo.subNumCurrent == opt.navListLen - 1 ) {
//          dep = 0 ;
//      } else {
//          dep = 1 ;
//      }
      
      /* case 1 : loop true*/
      dep = 1 ;
      
    } else if ( opt.liW / opt.ratio > opt.moveX && opt.dirX > 0 ) {
      /*console.log( '왼쪽 드래그시 브라우저 반이 안넘어갔을 경우' ) ;*/
      
      mainApp.swipeInfo.subNumNew = mainApp.swipeInfo.subNumCurrent ;
      dep = 0 ; 
      opt.cNum -= 1 ; 
    }
    
    if ( opt.liW / opt.ratio <= Math.abs( opt.moveX ) && opt.dirX < 0 ) {
      /*console.log( '오른쪽 드래그시 브라우저 반이 넘어갔을 경우' , mainApp.swipeInfo.subNumCurrent ) ;*/
      mainApp.swipeInfo.subNumNew = mainApp.swipeInfo.subNumCurrent - 1 ;
      
      /*console.log( 'mainApp.swipeInfo.subNumNew : ' , mainApp.swipeInfo.subNumNew ) ;*/
      
      /* case 1 : loop false */
      //가로로 스와이프될 페이지가 0보다 작다면 0을 반환
      //if ( mainApp.swipeInfo.subNumNew < 0 ) mainApp.swipeInfo.subNumNew = 0 ;
      
//      if ( mainApp.swipeInfo.subNumCurrent == 0 ) {
//          dep = 0 ;
//      } else {
//          dep = -1 ;
//      }
      
      /* case 2 : loop true*/
      dep = -1 ;
       
    } else if ( opt.liW / opt.ratio > Math.abs( opt.moveX ) && opt.dirX < 0 ) {
      /*console.log( '오른쪽 드래그시 브라우저 반이 안넘어갔을 경우' ) ;*/ 
      mainApp.swipeInfo.subNumNew = mainApp.swipeInfo.subNumCurrent ;
      dep = 0 ; 
    }

    /*if ( lis.length <= 1 ) {
      dep = 0 ; 
    }*/

    /*console.log( 'opt.dirX : ' , opt.dirX , 'dep : ' , dep ) ;*/ 

    setTimeout(function(){
      tag.ulBox.classList.add( opt.moveClass );
      tag.loadWrap.classList.add( opt.moveClass );
      /*console.log( dep , opt.liW )*/ 
      
      horizontalMove( -dep * opt.liW ) ; 
      
      /*console.log( 'transitionEvent : ' + transitionEvent ) ;*/ 
      
//      var box ; 
//      if ( document.querySelectorAll( 'div.yahoBox' ).length == 0 ) {
//          var css = 'position: fixed; z-index: 9999; left: 10px; top: 10px;  border: 1px solid black; background-color: #fff;' ; 
//          box = document.createElement( 'div' ) ;
//          box.className = 'yahoBox' ; 
//          box.style.cssText = css ; 
//          document.body.appendChild( box ) ; 
//      } else {
//          box = document.querySelector( 'div.yahoBox' ) ; 
//      }
//      
//      box.innerHTML = transitionEvent ;
      
      tag.ulBox.addEventListener( transitionEvent , function chkF () { // 트랜지션이 끝나면 사용한 클래스를 삭제하낟. 
          tag.ulBox.classList.remove( opt.moveClass ) ; 
          tag.loadWrap.classList.remove( opt.moveClass ) ; 
          tag.ulBox.removeEventListener( transitionEvent , chkF ) ; 
          setTimeout(function(){
              transFuncNew() ;
          }) ; 
      }) ; 

      /*var evts = [ 'webkitTransitionEnd' , 'transitionend' ] ;*/
      /*var evts = [ 'transitionend' ] ; 
      [].forEach.call( evts , function ( evt , idx ){
        tag.ulBox.addEventListener( evt , function chkF () {
          transFunc() ;
          transFuncNew() ;
          tag.ulBox.classList.remove( opt.moveClass ) ;
          tag.ulBox.removeEventListener( evt , chkF ) ;
        }) ; 
      }) ; */
    } , 10 ) ; 
 
    function transFuncNew () {
        var li , 
            lis = findChildren( tag.ulBox , ':scope > li' ) , 
            rect = tag.ulBox.getBoundingClientRect() ;
        
        mainApp.swipeInfo.addBool = true ;
        
        //tag.ulBox.style[transformCss]  = "translateX(" + 0 + "px) translateZ(0px)";
        /*tag.ulBox.style.webkitTransform  = "translateX(" + 0 + "px) translateZ(0px)";*/
        
        tag.ulBox.style[transformCss]  = "translateX(" + 0 + "px) translateZ(0px)";
        tag.mother.style.width = 'auto' ;
        opt.moveBool = true ;
        opt.scrTop = 0 ; 
 
        var m_scrollY = parseInt( getSessionStorage( 'm_nowScrollY' ) ) ; 
        /* 스크롤링이 헤더 세로값보다 크면 로딩바에 세로값을 적용 */
        if ( m_scrollY >= 47 ) {
            var offsetTop = tag.loadWrap.offsetTop ;
            tag.loadWrap.style.top =  ( offsetTop ) + 'px' ;
            //tag.loadWrap.style.border = '1px solid red' ;
        }
        
            //console.log( 'mainApp.swipeInfo.subNumCurrent : ' , mainApp.swipeInfo.subNumCurrent , 'mainApp.swipeInfo.subNumNew : ' , mainApp.swipeInfo.subNumNew ) ; 
            if ( mainApp.swipeInfo.subNumCurrent != mainApp.swipeInfo.subNumNew ) {
                [].forEach.call( lis , function ( el , idx ){
                    /*console.log( el , el.dataset.clone ) ;*/
                    if ( el.dataset.clone == 'added' ) {
                        el.parentNode.removeChild( el ) ;
                    } else {
                        
                    }
                }) ;
                
                /*lis = findChildren( tag.ulBox , ':scope > li:first-child' ) ;*/
                /*mainView = lis.querySelector( 'div[ng-include=currentTab]' ) ;*/
                /*console.log( 'lis : ' , lis ) ;*/
                /*console.log( 'mainView : ' , mainView) ;*/
                /*mainView.innerHTML = "" ;*/ 
 
                mainApp.swipeBool = true ;
                
                mainApp.swipeInfo.subNumCurrent = mainApp.swipeInfo.subNumNew ;
                //console.log( 'tag.navList.length : ' , tag.navList.length , mainApp.swipeInfo.subNumCurrent ) ;
                /* loop true - start */
                if ( mainApp.swipeInfo.subNumCurrent < 0 ) {
                    mainApp.swipeInfo.subNumCurrent = tag.navList.length - 1 ; 
                }
                
                if ( mainApp.swipeInfo.subNumCurrent > tag.navList.length - 1 ) {
                    mainApp.swipeInfo.subNumCurrent = 0 ;  
                } 
                /* loop true - end */
                
                mainApp.swipeInfo.triggerClick() ;
            } else {
                [].forEach.call( lis , function ( el , idx ){
                    if ( el.dataset.clone == 'added' ) { 
                        el.parentNode.removeChild( el ) ; 
                    } else {
                        tag.loadWrap.setAttribute( 'style' , '' ) ;
                        /*el.style.visibility = 'hidden' ;*/  
                    }
                }) ;
            }
         
    } /*end of transFuncNew*/

    function transFunc () {
      var li , 
        lis = findChildren( tag.ulBox , ':scope > li' ) , 
        rect = tag.ulBox.getBoundingClientRect() ;
      
      mainApp.swipeInfo.addBool = true ;

      [].forEach.call( lis , function ( el , idx ){
        if ( rect.left == 0 ) {
            /*console.log( '화면 변화가 없을 경우' ) ;*/ 
            mainApp.swipeInfo.subNumCurrent = mainApp.swipeInfo.subNumCurrent ;
            /*console.log( 'mainApp.swipeInfo.subNumCurrent : ' , mainApp.swipeInfo.subNumCurrent ) ;*/
            if( el.dataset.clone == "added" ) {
                
                el.parentNode.removeChild( el ) ; 
            }
            tag.ulBox.style[transformCss]  = "translateX(" + 0 + "px) translateZ(0px)";
            /*tag.ulBox.style.webkitTransform  = "translateX(" + 0 + "px) translateZ(0px)";*/ 
             /*mainApp.swipeInfo.swipeBool = false ;*/
        } else {
            /*화면 변화가 있을 경우*/
            
            /*console.log( 'chkchk????' , lis ) ;*/
            function domChkFunc () {
              if ( lis.length == 2 && lis[1].dataset.clone == 'added' ) {
                
                mainApp.swipeInfo.subNumCurrent = mainApp.swipeInfo.subNumNew ;
                if( el.dataset.clone != "added" ) {
                    el.parentNode.removeChild( el ) ;
                } else { 
                    el.removeAttribute( 'style' ) ;
                    el.removeAttribute( 'data-clone' ) ;
                }
    
                tag.ulBox.style[transformCss]  = "translateX(" + 0 + "px) translateZ(0px)";
                /*tag.ulBox.style.webkitTransform  = "translateX(" + 0 + "px) translateZ(0px)";*/
                mainApp.swipeInfo.swipeBool = false ;                
              } else {
                  setTimeout(function(){ 
                      domChkFunc() ; 
                  }) ; 
              }
            }
            domChkFunc() ; 
        }
      }) ;
      


      if ( opt.oldCNum != opt.cNum ) {
        tag.mother.scrollTop = 0 ; 
      }
      
      opt.moveBool = true ; // 스와이프의 모든 행동이 끝나면 움직임 유무를 참으로 반환
      
      if ( mainApp.swipeInfo.subNumCurrent >= opt.navListLen - 1 ) return ; // 스와이프할 페이지가 더이상 없다면 마무리한다.
       /*console.log( 'mainApp.swipeInfo.subNumCurrent : ' , mainApp.swipeInfo.subNumCurrent ) ;*/

      var chkWidth = 0 ;
      [].forEach.call( tag.navList , function ( list , idx ) {
          if ( list.classList.contains( opt.activeClass ) ) {
              var i = 0 , len = idx + 1 ;
              for ( ; i <= len ; i += 1 ) {
                  chkWidth += tag.navList[i].offsetWidth ;
              }
          }
      }) ; 
      
      if ( chkWidth >= window.innerWidth ) {
        var _w = chkWidth - window.innerWidth ; 
        tag.navList[0].style.marginLeft = -_w + 'px' ;
      } else {
          tag.navList[0].style.marginLeft = 0 + 'px' ;
      }
    }
  } /*end of horizontalEnd*/

  function addEvents ( el , evts , handler ) {
    var evts = evts.split( ' ' ) ;
    evts.forEach( function ( evt ){
      el.addEventListener( evt , handler , false ) ; 
    }) ; 
  } /*end of addEvents*/

  function removeEvents ( el , evts , handler ) {
    var evts = evts.split( ' ' ) ; 
    evts.forEach( function ( evt ){
      el.removeEventListener( evt , handler , false ) ; 
    }) ; 
  }
  
  pu.opt = opt ;
  pu.setNav = function ( nav ) {
    tag.nav = document.querySelector( 'nav.main_two > ul.menu' ) ;  
    tag.navList = findChildren( tag.nav , ':scope > li') ;
    opt.navListLen = tag.navList.length ;
    
    /*console.log( 'tag.nav : ' , tag.nav ) ;
    console.log( 'tag.navList : ' , tag.navList ) ;
    console.log( 'opt.navListLen : ' , opt.navListLen ) ;*/
  }
  this.pu = pu ; 
  
} /*end of Swipe*/ 
Swipe.prototype = {
  chk : function () {
    
  } , 
  getMoveBool : function () {
      return this.pu.opt.moveBool ; 
  } , 
  getDragChkBool : function () {
      return this.pu.opt.dragChkBool ; 
  }
  
} ; 













function findChildren ( motherDom , findStr ) {
  /*alert( motherDom + ' . ' + findStr ) ;*/ 
  var findStr = findStr.replace(/((^|,)\s*):scope > /g, '' ) , 
    firstChk = false , 
    lastChk = false , 
    resArr = [] , 
    findDom ; 

  if ( findStr.indexOf( ':first-child' ) != -1 ) {

    firstChk = true ; 
    findStr = findStr.replace(':first-child', '' ) ; 
  } else if ( findStr.indexOf( ':last-child' ) != -1 ) {
    lastChk = true ; 
    findStr = findStr.replace(':last-child', '' ) ; 
  }

  findDom = motherDom.querySelectorAll( findStr ) ; 
  [].forEach.call( findDom , function ( el , idx ) {
    if ( el.parentNode == motherDom ) {
      resArr.push( el ) ; 
    }
  }) ; 

  if ( firstChk ) resArr = resArr[0] ; 
  if ( lastChk ) resArr = resArr[resArr.length-1] ; 
  return resArr ; 
} /*end of findChildren*/

window.addEventListener( 'load' , function () {
/*  swipe = new Swipe( document.querySelector( 'div.wrapBox' ) , '.container' , {
    navigation : document.querySelector( 'ul.nav' ) , 
    loop : true , 
    dragRatio : 5 , 
    duration : .3
  }) ; */
}) ;

var colorCode = function () {
    return '#' + ((1<<24)*Math.random()|0).toString(16);
}