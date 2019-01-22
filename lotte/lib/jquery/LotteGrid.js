/*var grid = {};*/
function Grid(option) { 
  var tag = {}, obj = {}, opt = {};
  if ( mainApp.resizeBool == false ) return ; // main.js 에서 리사이징을 제어 중이라면 진입을 막는다. 
  
  /*(function init (){
	console.log( 'init' ) ;
	  
	tag.ulBox = document.querySelector( 'div.wrapBox ul.container ol.list' ) ;
	tag.lis = findChildren(tag.ulBox, ':scope > li');
	
	function chkStart () {
		[].forEach.call( tag.lis , function ( li , idx ){
			if ( idx == 0 ) {
				var img = li.querySelector( 'img' ) ;
				var _src = img.getAttribute( 'src' ) + '테스트'  ;
				img.setAttribute( 'src' , _src ) ;				
			}
		}) ;
	}
	chkStart() ; 
	  
  }()) ;*/
  
  (function domSet() {
    // tag 프로퍼티에 element 들을 담아둔다.
    tag.ulBox = document.querySelector( 'div.wrapBox ul.container ol.list' ) ;
 
    if ( tag.ulBox == null || tag.ulBox == undefined ) {
        tag.ulBox = document.querySelector( 'div.bestList ol.list' ) ; 
    }
    tag.lis = findChildren(tag.ulBox, ':scope > li'); 
    
    [].forEach.call( tag.lis , function ( li ){
    	if ( li.dataset.load != "true" ) {
    		li.style.visibility = 'hidden' ; 
    	}
    }) ; 
    
     /*console.log( tag.ulBox , tag.lis ) ;*/ 

    tag.addLi = null ; 
    tag.addBtn = document.querySelector( 'button.add' ) ; 
    tag.load_lis = [] ; 
  }());
  
  (function objSet() {
    // obj 프로퍼티에 필요한 정보들을 삽입한다.
    obj.posArr = [];
    obj.posArrCompare = [];
    opt.load_lisLen = 0 ; 
    
    opt.sortLen = 1; // 현재 브라우저의 그리드 ( 반응형 ) 개수 ex: 1 = 1줄 , 2 = 2줄
    opt.winW = window.innerWidth; // 브라주어 가로 사이즈  
    opt.gap = option.gap ? option.gap : 10; // 엘레멘트 들간의 갭 ( 단위 : px )  
    opt.lisLen = tag.lis.length; // 현재 화면상에 뿌려진 li 태그 개수
    opt.ulBoxW = tag.ulBox.offsetWidth; // li 부모태그의 가로 길이
    opt.liW = null; // li 의 가로 길이
    opt.moveClass = 'move'; // css3 움직임이 적용될 css className
    opt.idxNum = 0;
    opt.totalH = 0 ; // li 가 모두 뿌려진 화면상의 세로 길이 
    opt.durationSpeed = (option.duration != 0 ) ? (option.duration ? option.duration : .3) : 0 ; // css3 움직임을 제어할 수 있는 속도 ex: 0 = 0초 , .3 = 0.3초 
    opt.durationSpeedOri = opt.durationSpeed ; // opt.durationSpeed 변경전 오리지널 값  
    opt.durationBool = false ; 
    opt.clearTimer ; // setTimeout 
    opt.topHeight = option.topHeight ? option.topHeight : 0 ; // 부모태그가 가지고 있는 현재의 최상위 위치값 
    opt.loadChk = false ; // 그리드 조립의 완료 유무

    opt.minWArrOrl = [640, 1024]; // 그리드 되야할 브라우저 가로 값 배열 기본값
    opt.minWArr = option.minWArr ? option.minWArr : opt.minWArrOrl; // extend 될 경우 그리드 되야할 브라우저 가로 값 배열 
    opt.minW = opt.minWArr[0]; // 그리드에 사용할 가로 길이 값
    
    /*console.log( 'opt.topHeight : ' , opt.topHeight ) ;*/
  }());
  
  (function imgsLoadSet() {
    var loadLen = 0 ; 
    var load_lis = [] ; 
    var tempNum = 0 ;
    
    [].forEach.call(tag.lis, function(li, idx) {
        if ( li.dataset.load != 'true' ) {
            load_lis[idx] = li ;
            tempNum += 1 ; 
        }
    }) ; 
    
    var load_lisLen = load_lis.length ;
    
    tag.load_lis = load_lis ; 
    opt.load_lisLen = tempNum ;
    
    /*
     * 현재 페이지 내의 로딩을 이미지 다운로드 기준으로 삼는다.
     * 만약 url의 경우 잘못된 경로거나 없는 이미지인 견우 로딩이 완료 되지 못하는 것을
     * 방지 하기 위해 No Image url 로 대체한다.
     */
    [].forEach.call(load_lis, function(li, idx) {
      var img = new Image() ;
      var imgSrc ; 
      var oImg ;  
 
      if ( li.querySelector('img') == null ) { /* 로딩해야할 것이 동영상인 경우 ( 이미지가 현재 없는 경우 ) */
          imgSrc = 'http://image.lotte.com/lotte/images/common/product/no_280.gif' ;
          oImg = new Image() ;
          oImg.src = 'http://image.lotte.com/lotte/images/common/product/no_280.gif' ;
      } else { /* 로딩해야할 것이 Image 인경우 */
          imgSrc = li.querySelector('img').getAttribute('src');
          oImg = li.querySelector('img') ;
      }
      
      img.onload = function() { // 이미지가 하나 로드될떄마다 로딩수를 추가
        loadLen += 1;
        loadEndChkFun() ;
      }
      
      img.onerror = function(){ // 이미지가 잘못된 경우 수정한 뒤 로딩수를 추가
    	  loadLen += 1;
    	  oImg.src = 'http://image.lotte.com/lotte/images/common/product/no_280.gif' ;
    	  loadEndChkFun() ;
      }
      
      img.src = oImg.src;
    });
    
    function loadEndChkFun () {
    	if (loadLen == opt.load_lisLen) {
    		/*console.log( 'images load complete' ) ;*/
            loadComplete(); // 로드가 완료되는 시점을 만들어서 실행
          }
    }
    
    /*loadComplete();*/
    
    function loadComplete() {
      /*console.log( 'window.innerWidth : ' , window.innerWidth , 'opt.minW : ' , opt.minW ) ;*/
      prepareSet();
      gridResize() ; 
    }
  }());
  
  (function evtSet() {
      var resizeTemp = false ; 
      window.addEventListener( 'resize' , function (){
          [].forEach.call( tag.lis , function ( li ){
              li.style.height = '' ; 
          }) ; 
          
          if ( resizeTemp !== false ) {
              clearTimeout( resizeTemp ) ; 
          }
          resizeTemp = setTimeout( resizeChk , 200 ) ; 
      }) ; 
      
 
    /*window.addEventListener( 'resize', resizeChk);*/
    window.addEventListener( 'orientationchange' , gridResize ) ;
    
   
    tag.ulBox.parentNode.parentNode.classList.remove( 'mainView' ) ; 
  }());

  function clickHandler () {
    var i = 0 , lis = findChildren( tag.addLi , ':scope > li') , len = lis.length ; 
    for ( ; i < len ; i += 1 ) {
      var li = lis[i].cloneNode(true) ; 
      /*li.style.webkitTransform = '' ; */
      /*li.style.transform = '' ; */
      
      li.style[transformCss] = "" ; 
      tag.ulBox.appendChild( li ) ; 
    }
    tag.lis = findChildren(tag.ulBox, ':scope > li');
    gridResize() ; 
  }

  function makeCssText () {
    
  }
  
  function prepareSet() { // DOM 제어에 필요한 작업을 선행
    makeCssText() ;

    tag.ulBox.style.marginLeft = opt.gap + 'px'; 
    tag.ulBox.style[transformCss] = "translateY(" + opt.gap + "px) translateZ(0px)";
    
    [].forEach.call(tag.lis, function(li, idx) {
      if ( !li.querySelector( 'div' ).classList.contains( 'banner' ) ) {
           /*li.style.paddingRight = opt.gap + 'px';
           li.style.paddingTop = opt.gap + 'px'*/;    	  
      }
      li.style.boxSizing = 'border-box' ; 
    });

    /*temp*/
    tag.addLi = tag.ulBox.cloneNode(true) ; 
  }

  function resizeChk() {
      
	  /*console.log( 'resize' ) ;*/ 
    var winW_old = window.innerWidth ; 
    clearTimeout( opt.clearTimer ) ; 
    opt.clearTimer = setTimeout(function(){
      var winW_new = window.innerWidth
      if ( winW_old == winW_new ) {
        gridResize() ; 
      }
    } , 300 ) ; 
  }
  
  function gridResize() { // 리사이징을 시작
    opt.winW = window.innerWidth;
    opt.ulBoxW = opt.winW - opt.gap ; 
    
    /*
     * 현재 브라우저의 크기와 브라우저 가로 값 배열값을 비교 하여 
     * 현재 크기에 맞는 그리드 소팅을 개수를 찾는다.  
    */
    var i = 0, len = opt.minWArr.length;
    for (; i < len; i += 1) {
      if (opt.winW < opt.minWArr[i]) {
        opt.sortLen = i + 1;
        opt.minW = opt.minWArr[i];
        break;
      } else {
        opt.sortLen = len + 1;
        opt.minW = opt.minWArr[len - 1];
      }
    }
    
    opt.liW = opt.ulBoxW / opt.sortLen;
    
    tag.lis = findChildren(tag.ulBox, ':scope > li');
    /*tag.lis = document.querySelectorAll( 'div.wrapBox ul.container ol.list li' ) ;*/ 
    /*console.log( 'tag.lis : ' , tag.lis ) ;*/
    lisSort();
  } /*gridResize*/
    
  function lisSort() {
    obj.posArr = [] ; 
    obj.posArrCompare = [] ; 
    opt.idxNum = 0 ; 
    tag.lis = findChildren(tag.ulBox, ':scope > li') ; 
    
    [].forEach.call(tag.lis, function(li, idx, liArr) {
        
	  if ( window.innerWidth >= opt.minW ) {
        /*li.classList.add(opt.moveClass);*/
      }
      /*li.classList.add(opt.moveClass);*/      
	  /*li.style.width = opt.liW - opt.gap + 'px' ;*/ 
      li.style.width = opt.liW - opt.gap + 'px'; 
      //li.style.visibility = 'visible' ;
      li.setAttribute( 'data-load' , true ) ; // 한번 로드된 목록은 로드시키지 않기 위한 값을 추가
      obj.posArr[idx] = {w: li.offsetWidth,h: li.offsetHeight}; // 로드된 각각의 크기를 opt 배열에 저장한다
    });
    
    /*
     * 각 담겨진 좌표값들을 비교하여 현 위치의 값을 대입해준다.
     * n 번째 다음에 오는 위치값을 비교하여 작다면 위치값을 저장 하고
     * 위치값이 크다면 다음 개수를 대입 ( chkPosition( pos , idx ) ) 하여 다시 비교될 목록을 가져온다.  
    */
    [].forEach.call(obj.posArr, function(pos, idx, posArr) {
      if (idx < opt.sortLen) {
        pos.x = idx * opt.liW;
        pos.y = 0;
        obj.posArrCompare.push(pos);
        opt.idxNum = idx;
      } else {
        chkPosition(pos, idx);
      }
    }); 
    sortEnd();
  } /*end of lisSort*/
  
  function chkPosition(pos, idx) {
    var i = 0, len = obj.posArrCompare.length, 
    _x = null, _y = null;
    
    /*
     * 항상 len 는 두개씩 저장되며 두개의 값을 찾아 둘중 화면에 위치될 목록 하나를
     * 선택하여 화면상에 뿌려줄 준비를 한다.
    */
    
    for (; i < len; i += 1) {
      if (_y == null) {
        _y = obj.posArrCompare[i].y + obj.posArrCompare[i].h;
        _x = obj.posArrCompare[i].x;
      } else if (_y > obj.posArrCompare[i].y + obj.posArrCompare[i].h) {
        _y = obj.posArrCompare[i].y + obj.posArrCompare[i].h;
        _x = obj.posArrCompare[i].x;
      }
      
      pos.x = _x;
      pos.y = _y + opt.gap;
    }
    
    /*
     * 비교된 배열에서 맞는것이 발견되면
     * 하나를 삭제하고 그 다음 목록을 추가한다.
     * 추가된 목록은 다시 비교대상으로 배열의 목록 개수가 끝날때 까지 반복된다.
    */
    for (i = 0; i < len; i += 1) {
      if (_y == obj.posArrCompare[i].y + obj.posArrCompare[i].h && _x == obj.posArrCompare[i].x) {
        obj.posArrCompare.splice(i, 1);
        opt.idxNum += 1;
        obj.posArrCompare.push(obj.posArr[opt.idxNum]);
       
        return;
      }
    }
  } /*end of chkPosition*/
  
  function sortEnd() { 
      if ( opt.minW <= opt.minWArrOrl[0] ) {
      /* 1단일 경우는 그리드를 만들지 않는다. */ 
        [].forEach.call(tag.lis, function(li, idx) {
            tag.ulBox.style.height = 'auto' ; 
            li.setAttribute( 'style' , '' ) ;
            li.style.position = 'relative' ; 
            li.style.marginBottom = opt.gap + 'px' ;
            li.style.marginRight = opt.gap + 'px' ;
            li.style.height = li.offsetHeight + 'px' ;
            if ( idx < 3 ) {
                li.classList.add( 'highlight' );
            }
          if ( idx == tag.lis.length - 1) {
              setTimeout(function(){
                  /*console.log( 'grid end 1' ) ;*/ 
                  /* main.js 에 로딩이 끝났음을 전달 */
                  mainApp.isShowListLoadingFunc( false ) ;
                  mainApp.scrollBool = true ;
                  [].forEach.call(tag.lis, function(li) {
                      li.style.visibility= 'visible';
                  })
              } , 500 ) ; 
          }
        }) ; 
      } else {
          /* 2단이상일 경우는 그리드를 만들지 않는다. */
          [].forEach.call(tag.lis, function(li, idx) {
              li.style.position = 'absolute';
              li.style.left = 0 + 'px';
              li.style.top = 0 + 'px';
              li.style.height = li.offsetHeight + 'px' ;
              if ( idx < 3 ) {
                  li.classList.add( 'highlight' );
              }
              
              
              //console.log( idx , obj.posArr[idx] ) ;
              
              li.style[transformCss] = "translateX(" + (obj.posArr[idx].x) + "px) translateY(" + obj.posArr[idx].y + "px) translateZ(0px)";

              li.style.removeProperty( 'left' ) ;
              li.style.removeProperty( 'top' ) ;
              
              if ( idx == tag.lis.length - 1) {
                  setTimeout(function(){
                      /*console.log( 'grid end 2' ) ;*/ 
                      /* main.js 에 로딩이 끝났음을 전달 */
                      mainApp.isShowListLoadingFunc( false ) ;
                      [].forEach.call(tag.lis, function(li) {
                          li.style.visibility= 'visible';
                      })
                  } , 500 ) ; 
              }
            });
            
            var _h1, _h2 ; 
            _h2 = obj.posArr[0].y + obj.posArr[0].h;
            [].forEach.call(obj.posArr, function(pos, idx) {
              if (opt.lisLen - 1 == idx) { 
                _h1 = pos.y + pos.h;
              }
              if (_h2 <= pos.y + pos.h) {
                _h2 = pos.y + pos.h;
              }
            });
            
            // 좌표값 찾기와 DOM 위치 선정이 끝난 후 
            // 현재 마무리된 부모의 세로 값을 찾아내어 대입해준다.
            opt.totalH = (_h1 >= _h2) ? _h1 : _h2;
            tag.ulBox.style.height = ( opt.totalH + opt.gap * 2 ) + 'px'; 

          obj.posArr = [];
          obj.posArrCompare = [];

          setTimeout(function(){
              
            // 실행이 완료되면 main.js 에 실행이 완료됨을 알려준다.
            opt.durationSpeed = opt.durationSpeedOri ; 
            opt.loadChk = true ; 
            mainApp.scrollBool = true ;
          } , (opt.durationSpeedOri * 1000) + 1000 ) ;
      }
      

      
    } /*end of sortEnd*/
  
  function sortEndOld() {

    if ( !opt.durationBool ) {
    	
    }
    
    //tag.load_lis = load_lis ; 
    //opt.load_lisLen = load_lisLen ;
    
    //console.log( 'tag.load_lis : ' , tag.load_lis ) ;
    //console.log( obj.posArr ) ;
    //console.log( tag.load_lis.length ) ;
    /* 그리드 로딩이 페이지가 변경되면 초기화 되야한다. */

//    opt.minWArrOrl = [640, 1024]; 
//    opt.minWArr = option.minWArr ? option.minWArr : opt.minWArrOrl;
//    opt.minW = opt.minWArr[0];
    //console.log( opt.minW , opt.minWArrOrl[0] ) ; 

    [].forEach.call(tag.load_lis, function(li, idx) {
         
        li.style.position = 'absolute';
        li.style.left = 0 + 'px';
        li.style.top = 0 + 'px';
        
        //console.log( idx , obj.posArr[idx] ) ;
        
        li.style[transformCss] = "translateX(" + (obj.posArr[idx].x) + "px) translateY(" + obj.posArr[idx].y + "px) translateZ(0px)";

        li.style.removeProperty( 'left' ) ;
        li.style.removeProperty( 'top' ) ;
        
        if ( idx == tag.load_lis.length - 1) {
            setTimeout(function(){
                /* main.js 에 로딩이 끝났음을 전달 */
                //mainApp.isShowListLoadingFunc( false ) ; 
            } , 500 ) ; 
        }
      });
      
      var _h1, _h2 ; 
      _h2 = obj.posArr[0].y + obj.posArr[0].h;
      [].forEach.call(obj.posArr, function(pos, idx) {
        if (opt.lisLen - 1 == idx) { 
          _h1 = pos.y + pos.h;
        }
        if (_h2 <= pos.y + pos.h) {
          _h2 = pos.y + pos.h;
        }
      });
      
      opt.totalH = (_h1 >= _h2) ? _h1 : _h2;
      tag.ulBox.style.height = ( opt.totalH + opt.gap * 2 ) + 'px'; 

    obj.posArr = [];
    obj.posArrCompare = [];

    setTimeout(function(){
      opt.durationSpeed = opt.durationSpeedOri ; 
      opt.loadChk = true ; 
      mainApp.scrollBool = true ;
    } , (opt.durationSpeedOri * 1000) + 1000 ) ;
    
  } /*end of sortEndOld*/
  
  function chk () {
      if ( mainApp.resizeBool == false ) return ;
      /*console.log( 'mainApp.resizeBool : ' , mainApp.resizeBool ) ;*/
	  gridResize() ;
	  //lisSort() ;
  }
  
  function getLoadChk () {
      return opt.loadChk ; 
  }
  
  function setLoadChk () {
      opt.loadChk  = false ;  
  }
  
  return {
	  chk2 : chk , // main.js 에서 리사이징이 필요한 시점에서 접근
	  getLoadChk : getLoadChk , // main.js 에서 로드중인지 아닌지를 확인하기 위한 접근
	  setLoadChk : setLoadChk // main.js 에서 로드완료를 전달해주기 위한 접근
  }
} /*end of Grid*/ 

/*Grid.prototype = {
	chk : function () {
		console.log( '???' ) ; 
	}	
} ; */

window.addEventListener('load', function() {
    
    /*
     * new 생성자로 사용가능
     * 옵션 : 
     * minWArr -> 배열 개수만큼 반응형으로 움직임.
     * gap -> 목록간의 간격 ( 단위 : px )
     * duration -> css3 transition 속도 ( 단위 : 밀리언세컨 )
    */
    
	/*
	  grid = new Grid({
	    minWArr: [500 , 700 , 900] ,  
	    gap: 10 , 
	    duration : .3
	  });
	  */
}); 