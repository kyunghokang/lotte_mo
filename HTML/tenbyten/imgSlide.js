var ImgSlide = (function ImgSlideF () {
  var pu = {} ; 
  pu.doms = [] ; 

  function ImgSlide ( dom , option ) {
  
    var pr = {} , obj = {} , opt = {} , tag = {} , self = this ; 
    pr = this ; 
    pr.dom = dom ; 
    pr.btnsShow = true ; 
    pr.bulletShow = true ;
    pr.opt = opt ; 

    (function domSet () {
      tag.mother = dom ; 
      tag.btns = tag.mother.querySelectorAll( 'button' ) ; 
      tag.mask = tag.mother.querySelector( 'div.mask' ) ; 
      tag.ulBox = tag.mother.querySelector( 'ul.list' ) ; 
      tag.lis = findChildren( tag.ulBox  , ':scope > li' ) ; 
      tag.ulBoxClone = null ; 
      tag.lisClone = null ; 
      tag.bullet = document.createElement( 'ol' ) ; 
      tag.bullet.className = 'bullet' ;
      tag.thumb = tag.mother.querySelector( 'div.thumb' ) ; 
    }()) ;

    (function objSet ( reOpt ) {
      if ( reOpt == undefined ) {
        opt.bulletIdx = 1 ; 
        opt.winW = window.innerWidth ; 
        opt.oWinW = window.innerWidth ; 
        opt.slideW = tag.mother.offsetWidth ; 
        opt.lisLen = tag.lis.length ; 
        /*opt.minWArrOri = [ 640 , 1024 ] ;*/
        opt.minWArrOri = [ 640 ] ;  

        opt.sortLen = 1 ; 
        opt.liW = opt.slideW / opt.sortLen ; 
        opt.liH = null ; 
        opt.oldCNum = 0 ; 
        opt.cNum = 0 ; 
        opt.dirX = null ; 
        opt.moveClass = 'move' ; 
        opt.hideClass = 'hide' ; 
        opt.activeClass = 'active' ; 
        opt.boxGap = tag.ulBox.getBoundingClientRect().left ;
        /*opt.boxGap = 0 ;*/
        opt.startX = 0 ; 
        opt.startY = 0 ; 
        opt.pageX = 0 ; 
        opt.pageY = 0 ; 
        opt.addMoveX = 0 ; 
        opt.moveX = 0 ; 
        opt.moveY = 0 ; 
        
        opt.durationSpeed = option.duration ? option.duration : .3 ; 

        opt.verticalBool = false ; 
        opt.horizontalBool = false ; 
        opt.clickBool = false ; 
        opt.dragChkBool = true ; /*드래그 방향이 잡협는가에 대한 참,거짓을 반환 합니다.*/
        opt.moveBool = true ; 
        opt.addBool = true ; 
        opt.optReChk = null ; 
        
        opt.thumbH = ( tag.thumb == null ) ? 0 : tag.thumb.offsetHeight ;   
       
        pr.objSet = arguments.callee ;       
      } else {
        option = reOpt ; 
        opt.optReChk = true ; 
      }

      opt.btnsShowBool = option.btns != undefined ? option.btns : true ; 
      opt.loopBool = option.loop ? option.loop : false ; 
      opt.minWArr = option.minWArr ? option.minWArr : opt.minWArrOri ; 
      opt.ratio = option.dragRatio ? option.dragRatio : 5 ; 
      opt.minW = opt.minWArr[0] ; 
     

      objShowHide() ; 
    }()) ; 

    (function makeDom () {
      [].forEach.call( tag.lis , function ( li , idx , arr ) {
        li.setAttribute( 'data-cnum' , idx ) ; 
      }) ; 

      tag.ulBox = tag.mother.querySelector( 'ul.list' ) ; 
      tag.ulBoxClone = tag.ulBox.cloneNode(true) ; 
      tag.lisClone = findChildren( tag.ulBoxClone  , ':scope > li' ) ;
    }()) ; 

    (function prepareSet () {
/*      var css = '-webkit-transition: all ' + opt.durationSpeed + 's; ' ; 
      css += '-moz-transition: all ' + opt.durationSpeed + 's; ' ; 
      css += '-o-transition: all ' + opt.durationSpeed + 's; ' ; 
      css += 'transition: all ' + opt.durationSpeed + 's; ' ; 

      document.styleSheets[0].insertRule('.move { ' + css + ' }');*/

      slideResize() ; 
      /*makeDomSlide() ; 
      makeBullet() ; 
      btns_show_hide() ;*/ 

      pr.prepareSet = arguments.callee ; 
    }()) ; 

    (function evtSet () {
      var resizeTemp = false ; 
      window.addEventListener( 'resize' , function (){
          if ( resizeTemp !== false ) {
              clearTimeout( resizeTemp ) ; 
          }
          resizeTemp = setTimeout( resizeChk , 200 ) ; 
      }) ;
      window.addEventListener( 'orientationchange' , slideOrientationChangeHandler ) ;
      
      addEvents( tag.ulBox , 'touchstart' , slideStartHandler ) ; 
      addEvents( tag.ulBox , 'touchmove' , slideMoveHandler ) ; 
      addEvents( tag.ulBox , 'touchend' , slideEndHandler ) ; 

      [].forEach.call( tag.btns , function ( btn , idx ) {
        /*addEvents( btn , 'click touchstart' , clickHandler ) ;*/
        addEvents( btn , 'click' , clickHandler ) ;
      }) ; 
    }()) ; 

    function objShowHide () {
      if ( opt.loopBool ) {
        tag.bullet.classList.add( opt.hideClass ) ; 
      }
      if ( !opt.btnsShowBool ) {
        [].forEach.call( tag.btns , function ( btn , idx ) {
          btn.classList.add( opt.hideClass ) ; 
        }) ; 
      }
    } /*end of objShowHide*/

    function makeBullet () {
      if ( opt.loopBool ) return ; 
      var li = findChildren( tag.ulBox , ':scope > li:first-child') , 
        cNum = parseInt(li.dataset.cnum) , 
        len = opt.lisLen / opt.sortLen , 
        i = 0 , 
        li , span ; 

      if ( tag.mother.querySelectorAll( 'ol.bullet' ).length == 0 ) {
        tag.mother.appendChild( tag.bullet ) ; 
      }

      [].forEach.call( tag.bullet.querySelectorAll( 'li' ) , function ( el ) {
        el.parentNode.removeChild( el ) ; 
      }) ; 

      for( ; i < len ; i += 1 ) {
        li = document.createElement( 'li' ) ; 
        span = document.createElement( 'span' ) ; 
        
        span.innerHTML = i ; 
        li.appendChild( span ) ; 
        tag.bullet.appendChild( li ) ; 
      }

      cNum = Math.floor(cNum / opt.sortLen) ; 
      li = tag.bullet.querySelectorAll('li')[cNum] ; 
      li.classList.add( opt.activeClass )

    } /*end of makeBullet*/

    function clickHandler (e) {
      if ( opt.clickBool ) return ; 
      opt.clickBool = true ; 

      var btn = this ; 

      if ( btn.classList.contains( 'next' ) ) {
        opt.dirX = 1 ; 
      } else {
        opt.dirX = -1 ; 
      }

      opt.startX = 0 ; 
      /*opt.endX = 1 ;*/ 
      opt.moveX = opt.liW * opt.sortLen / 2 ; 
      
      appendList() ; 
      horizontalEnd() ; 

    } /*end of clickHandler*/
    
    var testNum = 0 ; 

    function slideStartHandler (e) {
      if ( opt.dragChkBool != true ) {
        opt.dragChkBool = true ; 
      }
      if ( opt.verticalBool != false ) {
        opt.verticalBool = false ; 
      }
      if ( opt.horizontalBool != false ) {
        opt.horizontalBool = false ;
      }
 
      mainApp.imgSlideBool = true ; 
      var m = e.touches[0] ;
      opt.startX = m.pageX + opt.boxGap ; 
      opt.startY = m.pageY ; 
      rect = tag.ulBox.getBoundingClientRect() ; 
      opt.oldCNum = opt.cNum ; 
    } /*end of slideStartHandler*/
    
    function slideMoveHandler (e) {
      opt.moveBool = true ;
        
      /*console.log( arguments.callee.name , opt.moveBool )*/
      if ( !opt.moveBool ) return ; 
      var m = e.touches[0] ; 
      opt.pageX = m.pageX ; 
      opt.pageY = m.pageY ; 

      opt.moveX = Math.abs(m.pageX - opt.startX) ; 
      opt.moveY = Math.abs(m.pageY - opt.startY) ;

      if ( opt.verticalBool ) {
        tag.ulBox.style[transformCss]  = "translateX(" + 0 + "px) translateZ(0px)"; 
        /*tag.ulBox.style.webkitTransform  = "translateX(" + 0 + "px) translateZ(0px)";*/
        /*tag.ulBox.style.width = opt.liW + 'px' ;*/ 
        tag.mother.style.width = opt.liW * opt.sortLen + 'px' ;
        return ; 
      }

      if ( opt.dragChkBool ) {
        if ( opt.moveX > opt.moveY ) {
          opt.horizontalBool = true ; 
          opt.verticalBool = false ; 
        } else if ( opt.moveY > opt.moveX ) {
          opt.horizontalBool = false ; 
          opt.verticalBool = true ; 
        }
      }

      opt.dragChkBool = false ; 

      if ( opt.horizontalBool ) {
        e.preventDefault() ; 
        e.stopPropagation() ; 
        opt.moveX = opt.startX - m.pageX ; 
        opt.dirX = opt.moveX < 0 ? -1 : 1 ; 

        appendList() ; 
        horizontalMove( -(opt.moveX - rect.left ) + opt.addMoveX ) ; 
      }
    } /*end of slideMoveHandler*/

    function slideEndHandler (e) {
      if ( opt.horizontalBool ) {
        horizontalEnd() ; 
      }

      opt.dragChkBool = true ; 
      opt.verticalBool = false ; 
      opt.horizontalBool = false ; 
    }

    function horizontalEnd () {
      var lis = findChildren( tag.ulBox , ':scope > li' ) , 
        dep = 0 , lisNew = [] ,  cIdx ; 
      
      [].forEach.call( lis , function ( li , idx ) {
        if ( !li.dataset.invisible ) {
          lisNew.push( li ) ; 
        }
      }) ; 

      opt.moveBool = false ; 
      if ( opt.liW * opt.sortLen / opt.ratio <= opt.moveX && opt.dirX > 0 ) {
        /*console.log( '왼쪽 드래그시 브라우저 반이 넘어갔을 경우' ) ;*/ 
        dep = 1 ; 
        /*console.log( parseInt(lisNew[lisNew.length - 1].dataset.cnum) )*/

        if ( opt.loopBool ) {
          dep = 1 ; 
        } else if ( !opt.loopBool && parseInt(lisNew[lisNew.length - 1].dataset.cnum) == opt.lisLen - 1 ) {
          dep = 0 ; 
        } else {
          dep = 1 ; 
        }
      } else if ( opt.liW * opt.sortLen / opt.ratio > opt.moveX && opt.dirX > 0 ) {
        /*console.log( '왼쪽 드래그시 브라우저 반이 안넘어갔을 경우' ) ;*/ 
        dep = 0 ; 
      }

      if ( opt.liW * opt.sortLen / opt.ratio <= Math.abs( opt.moveX ) && opt.dirX < 0 ) {
        /*console.log( '오른쪽 드래그시 브라우저 반이 넘어갔을 경우' ) ;*/ 
        if ( opt.loopBool ) {
          dep = -1 ; 
        } else if ( !opt.loopBool && parseInt(lisNew[0].dataset.cnum) == 0 ) {
          dep = 0 ; 
        } else {
          dep = -1 ; 
        }
        
      } else if ( opt.liW * opt.sortLen / opt.ratio > Math.abs( opt.moveX ) && opt.dirX < 0 ) {
        /*console.log( '오른쪽 드래그시 브라우저 반이 안넘어갔을 경우' ) ;*/ 
        dep = 0 ; 
      }

      if ( lis.length <= 1 ) {
        dep = 0 ; 
      }

      tag.ulBox.classList.add( opt.moveClass );
      setTimeout(function(){
        
        horizontalMove( -dep * opt.liW * opt.sortLen ) ; 
        tag.ulBox.addEventListener( transitionEvent , function chkF () {
          transFunc() ; 
          tag.ulBox.classList.remove( opt.moveClass ) ;
          tag.ulBox.removeEventListener( transitionEvent , chkF ) ; 
        }) ; 

        /*var evts = [ 'webkitTransitionEnd' , 'transitionend' ] ;
        [].forEach.call( evts , function ( evt , idx ){
          tag.ulBox.addEventListener( evt , function chkF () {
              console.log( 'transition yahoyaho' ) ; 
            transFunc() ; 
            tag.ulBox.classList.remove( opt.moveClass ) ;
            tag.ulBox.removeEventListener( evt , chkF ) ; 
          }) ; 
        }) ; */
      } , 10 ) ; 

      function transFunc () {        
        setTimeout(function(){
          var rect = tag.ulBox.getBoundingClientRect() ; 
          var lis = findChildren( tag.ulBox , ':scope > li' ) , 
            lisNew = [] , firstNum , lastNum ; 
          [].forEach.call( lis , function ( li , idx ) {
            if ( !li.dataset.invisible ) {
              /*console.log( 'li.dataset.invisible : ' , li.dataset.invisible , idx  ) ;*/             
              lisNew.push( li ) ; 
            } else {
              li.parentNode.removeChild( li ) ; 
            }
          }) ; 

          /*console.log( 'lisNew : ' , lisNew ) ;*/ 
          firstNum = parseInt(lisNew[0].dataset.cnum) ; 
          lastNum = parseInt(lisNew[lisNew.length - 1].dataset.cnum) ; 

          /*console.log( 'tag.ulBox : ' , tag.ulBox ) ;*/ 
          /*console.log( 'firstNum : ' , firstNum , 'lastNum : ' , lastNum , 'opt.dirX : ' , opt.dirX , 'rect.left : ' , rect.left ) ;*/ 
          if ( rect.left - opt.boxGap > 0 ) {
            /*console.log( '우측으로 드래그 된 경우' ) ;*/ 

            [].forEach.call( lisNew , function ( li , idx ) {
              li.parentNode.removeChild( li ) ; 
            }) ; 

            (function addFront () {
              var idx = 0 ; 
              function add () {
                firstNum = firstNum == 0 ? opt.lisLen - 1 : firstNum - 1 ; 
                idx += 1 ; 

                li = tag.lisClone[firstNum].cloneNode(true) ; 
                li.style.width = opt.liW + 'px' ; 
                li.setAttribute( 'data-cnum' , firstNum ) ; 
                tag.ulBox.insertBefore( li , findChildren( tag.ulBox , ':scope > li:first-child') ) ;

                /*console.log( 'add firstNum : ' , firstNum , 'idx : ' , idx , 'opt.sortLen : ' , opt.sortLen ) ;*/ 
                if ( idx < opt.sortLen ) {
                  add () ; 
                }
              }
              add() ; 
            }()) ; 

          } else if ( rect.left + opt.boxGap < 0 ) {
            /*console.log( '좌측으로 드래그 된 경우' ) ;*/ 
            [].forEach.call( lisNew , function ( li , idx ) {
              li.parentNode.removeChild( li ) ; 
            }) ; 

            (function addBack () {
              var idx = 0 ; 
              function add () {
                lastNum = lastNum + 1 >= opt.lisLen ? 0 : lastNum + 1 ; 
                idx += 1 ; 

                if ( lastNum == 0 && !opt.loopBool ) return ; 

                li = tag.lisClone[lastNum].cloneNode(true) ; 
                li.style.width = opt.liW + 'px' ; 
                li.setAttribute( 'data-cnum' , lastNum ) ; 
                tag.ulBox.appendChild( li ) ; 

                /*console.log( 'add lastNum : ' , lastNum , 'idx : ' , idx , 'opt.sortLen : ' , opt.sortLen ) ;*/ 
                if ( idx < opt.sortLen ) {
                  add () ; 
                }
              }
              add() ; 
            }()) ; 

          }

          makeBullet() ; 
          horizontalMove( 0 ) ;         
          btns_show_hide() ; 
          
          opt.moveBool = true ; 
          opt.addBool = true ; 
          opt.clickBool = false ; 
        } , 10 ) ; 

      } /*end of testFunc*/

    } /*end of horizontalEnd*/

    function appendList () {
      if ( !opt.addBool ) return ; 
      opt.addBool = false ; 
      var lis = findChildren( tag.ulBox , ':scope > li' ) , 
        firstNum = parseInt(lis[0].dataset.cnum) , 
        lastNum = parseInt(lis[lis.length-1].dataset.cnum) ; 
      

      /*console.log( 'firstNum : ' , firstNum , 'opt.loopBool : ' , opt.loopBool ) ;*/ 
      /*console.log( 'lastNum : ' , firstNum , 'opt.loopBool : ' , opt.loopBool ) ;*/ 

      (function addFront () {
        var idx = 0 ; 
        if ( firstNum == 0 && !opt.loopBool ) return ; 
        function add () {
          firstNum = firstNum == 0 ? opt.lisLen - 1 : firstNum - 1 ; 
          idx += 1 ; 

          li = tag.lisClone[firstNum].cloneNode(true) ; 
          li.style.width = opt.liW + 'px' ; 
          li.style.position = 'absolute' ;
          li.style.left = -(opt.liW * idx) + 'px' ; 
          li.setAttribute( 'data-cnum' , firstNum ) ; 
          li.setAttribute( 'data-invisible' , true ) ; 
          tag.ulBox.insertBefore( li , findChildren( tag.ulBox , ':scope > li:first-child') ) ;

          /*console.log( 'add firstNum : ' , firstNum , 'idx : ' , idx , 'opt.sortLen : ' , opt.sortLen ) ;*/ 
          if ( idx < opt.sortLen ) {
            add () ; 
          }
        }
        add() ; 
      }()) ; 

      (function addBack () {
        var idx = 0 ; 
        function add () {
          lastNum = lastNum + 1 >= opt.lisLen ? 0 : lastNum + 1 ; 
          idx += 1 ; 

          /*console.log( 'lastNum : ' ,  lastNum ) ;*/ 
          if ( lastNum == 0 && !opt.loopBool ) return ; 

          li = tag.lisClone[lastNum].cloneNode(true) ; 
          li.style.width = opt.liW + 'px' ; 
          li.style.position = 'absolute' ;
          li.style.right = -(opt.liW * idx) + 'px' ; 
          li.setAttribute( 'data-cnum' , lastNum ) ; 
          li.setAttribute( 'data-invisible' , true ) ; 
          tag.ulBox.appendChild( li ) ; 

          /*console.log( 'add lastNum : ' , lastNum , 'idx : ' , idx , 'opt.sortLen : ' , opt.sortLen ) ;*/ 
          if ( idx < opt.sortLen ) {
            add () ; 
          }
        }
        add() ; 
      }()) ; 

      /*opt.cNum = opt.cNum + 1 >= opt.lisLen ? 0 : parseInt(lis[lis.length-1].dataset.cnum) ;*/ 
    } /*end of appendList*/

    function horizontalMove ( moveX ) {
      /*console.log( 'horizontalMove : ' , moveX )*/
      /*console.log( 'opt.dirX : ' , opt.dirX )*/ 
        tag.ulBox.style[transformCss] = "translateX(" + moveX + "px) translateZ(0px)";
      /*tag.ulBox.style.webkitTransform  = "translateX(" + moveX + "px) translateZ(0px)";*/
    } /*end of horizontalMove*/
    
    function slideOrientationChangeHandler () {
        var elem = (document.compatMode === "CSS1Compat" ) ? document.documentElement : document.body ; 

        switch( window.orientation ) {
            case -90 :
            case 90 :
                setTimeout(function(){
                    slideResize() ; 
                    /*makeDomSlide() ; 
                    makeBullet() ;*/
                } , 500 ) ; 
                break ; 
            default :
                setTimeout(function(){
                    slideResize() ; 
                    /*makeDomSlide() ; 
                    makeBullet() ;*/
                } , 500 ) ;
                break ; 
        }
    }
  
    function resizeChk () { 
      slideResize() ; 
      /*makeDomSlide() ; 
      makeBullet() ;*/ 
    } /*end of resizeChk*/

    function btns_show_hide () {
      var lis = findChildren( tag.ulBox , ':scope > li' ) ; 

    /*console.log( 'parseInt(lis[0].dataset.cnum : ' , parseInt(lis[0].dataset.cnum) ) ;*/ 
      

      if ( opt.loopBool && opt.btnsShowBool ) {
        [].forEach.call( tag.btns , function ( btn , idx , arr ) {
          btn.classList.remove( opt.hideClass ) ; 
        }) ; 
      } else if ( !opt.btnsShowBool ) {
        [].forEach.call( tag.btns , function ( btn , idx , arr ) {
          btn.classList.remove( opt.hideClass ) ; 
        }) ; 
      } else {
        [].forEach.call( tag.btns , function ( btn , idx , arr ) {
          if ( parseInt(lis[0].dataset.cnum) == 0 ) {
            arr[0].classList.add( opt.hideClass ) ; 
          } else {
            arr[0].classList.remove( opt.hideClass ) ; 
          }

          if ( parseInt(lis[lis.length - 1].dataset.cnum) == opt.lisLen - 1 ) {
            arr[1].classList.add( opt.hideClass ) ; 
          } else {
            arr[1].classList.remove( opt.hideClass ) ; 
          }
        }) ; 
      }
    } /*end of btns_show_hide*/

    function slideResize () { 
      /*opt.winW = window.innerWidth ; 
      opt.slideW = window.innerWidth ;
      tag.mother.style.width = opt.winW + 'px' ; 
      tag.bullet.style.width = opt.winW + 'px' ;*/
      
      var elem = (document.compatMode === "CSS1Compat" ) ? document.documentElement : document.body ;
      opt.winW = elem.clientWidth ;  
      opt.slideW = elem.clientWidth ; 
      tag.mother.style.width = opt.winW + 'px' ; 
      tag.bullet.style.width = opt.winW + 'px' ;
      document.querySelector( 'div.wrapBox' ).style.width = opt.winW + 'px' ;  

      var i = 0 , len = opt.minWArr.length ; 
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

      opt.liW = opt.slideW / opt.sortLen ;
      opt.moveBool = true ; 
      
      makeDomSlide() ; 
      /*makeBullet() ; 
      btns_show_hide() ;*/
    } /*end of slideResize*/ 

    function makeDomSlide () {
      var lis = findChildren( tag.ulBox , ':scope > li' ) , len = lis.length ; 
      /*console.log( len , 'opt.optReChk : ' , opt.optReChk , 'len : ' , len , 'opt.sortLen : ' , opt.sortLen ) ;*/ 

      if ( opt.optReChk ) {
        [].forEach.call( lis , function ( li , idx ) {
          li.parentNode.removeChild( li ) ; 
        }) ; 

        lis = tag.lisClone ; 
        var i = 0 , len = opt.lisLen ; 
        for ( ; i < len ; i += 1 ) {
          tag.ulBox.appendChild( lis[i].cloneNode(true) ) ; 
        }

        lis = findChildren( tag.ulBox , ':scope > li' ) ; 
        len = lis.length ; 
        opt.optReChk = null ; 
      }

      if ( len > opt.sortLen - 1 ) {
        [].forEach.call( lis , function ( li , idx ) {
          if ( idx < opt.sortLen ) {
            /*console.log( 'opt.sortLen : ' , opt.sortLen , 'opt.liW : ' , opt.liW ) ;*/ 
            li.style.width = opt.liW + 'px' ; 

            /*console.log( li.querySelector( 'img' ).offsetWidth ) ;*/ 
            /*console.log( li.querySelector( 'img' ).offsetHeight ) ;*/ 
            opt.liH = li.querySelector( 'img' ).offsetHeight ; 
          } else {
            li.parentNode.removeChild( li ) ; 
          }
        }) ;         
      } else if ( len < opt.sortLen ) {

        /*console.log( 'result : ' , opt.sortLen - len ) ;*/ 

        var lastNum = parseInt(lis[lis.length-1].dataset.cnum) ; 
        var firstNum = parseInt(lis[lis.length-1].dataset.cnum) ; 
        
        /*console.log( 'lastNum : ' , lastNum , ' opt.sortLen : '  , opt.sortLen , ' :: ' , lastNum % opt.sortLen ) ;*/
        
        if ( lastNum % opt.sortLen != 0 ) {
          /*console.log( 'add front' ) ;*/
            (function addFront () {
                var idx = 0 ; 
                function add () {
                  firstNum = firstNum == 0 ? 0 : firstNum - 1 ; 
                  idx += 1 ; 

                  li = tag.lisClone[firstNum].cloneNode(true) ; 
                  li.style.width = opt.liW + 'px' ; 
                  li.setAttribute( 'data-cnum' , firstNum ) ; 
                  tag.ulBox.insertBefore( li , findChildren( tag.ulBox , ':scope > li:first-child') ) ;

                  /*console.log( 'add firstNum : ' , firstNum , 'idx : ' , idx , 'opt.sortLen : ' , opt.sortLen ) ;*/ 
                  if ( idx < opt.sortLen - 1 ) {
                    add () ; 
                  }
                }
                add() ; 
              }()) ;
        } else {
          /*console.log( 'add back' ) ;*/
            (function addBack () {
                var idx = 0 ; 
                function add () {
                  lastNum = lastNum + 1 >= opt.lisLen ? 0 : lastNum + 1 ; 
                  idx += 1 ; 

                  if ( lastNum == 0 && !opt.loopBool ) return ; 

                  li = tag.lisClone[lastNum].cloneNode(true) ; 
                  li.style.width = opt.liW + 'px' ; 
                  li.setAttribute( 'data-cnum' , lastNum ) ; 
                  tag.ulBox.appendChild( li ) ; 
                  opt.liH = li.querySelector( 'img' ).offsetHeight ; 
                  if ( idx < opt.sortLen - 1 ) {
                    add () ; 
                  }
                }
                add() ; 
              }()) ;
        }

        lis = findChildren( tag.ulBox , ':scope > li' ) ; 

        [].forEach.call( lis , function ( li , idx ) {
          li.style.width = opt.liW + 'px' ; 
          opt.liH = li.querySelector( 'img' ).offsetHeight ; 
        }) ; 
      }
      

      opt.thumbH = ( tag.thumb == null ) ? 0 : tag.thumb.offsetHeight ;

      tag.mask.style.height = opt.liH + opt.thumbH + 'px' ;
      tag.ulBox.style.height = opt.liH + opt.thumbH + 'px' ; 
            
      makeBullet() ; 
      btns_show_hide() ;
    } /*end of makeDomSlide*/ 

    function addEvents ( el , evts , handler ) {
      var evts = evts.split( ' ' ) ; 
      evts.forEach( function ( evt ){
        el.addEventListener( evt , handler , false ) ; 
      }) ; 
    } /*end of addEvents*/

  } /*end of ImgSlide*/

  ImgSlide.prototype = {
    reInit : function ( opt ) {
      if ( opt.btns != undefined ) {
        /*this.btns_show_hide( opt.btns ) ;*/ 
      }
    } , 
    btns_show_hide2 : function ( opt ) {
      this.btns_show_hide( opt ) ; 
    } , 
    optionSet : function ( option ) {
      this.objSet( option ) ; 
      this.prepareSet() ; 
    }
  } ;  

  return function ( dom , opt ) {
    var doms = typeof dom == 'string' ? document.querySelectorAll( dom ) : dom , 
      slide , anotherSlide , option ;
    
    option = opt == undefined ? {} : opt ; 
    [].forEach.call( doms , function ( el , idx ) {
      var chk = chkDom( el ) ; 
      
      if ( chk.returnVal ) {
        slide = new ImgSlide( el , option ) ; 
        pu.doms.push( slide ) ; 
      } else {
        anotherSlide = pu.doms[ chk.chkIdx ] ; 
        anotherSlide.optionSet( option ) ; 
      }
    }) ; 

    function chkDom ( el ) {
      var i = 0 , returnVal = true , arr = {} , chkIdx ; 
      if ( pu.doms.length == 0 ) {
        returnVal = true ; 
        chkIdx = 0 ; 
      } else {
        for ( ; i < pu.doms.length ; i += 1 ) {
          if ( el == pu.doms[i].dom ) {
            returnVal = false ; 
            chkIdx = i ; 
          }
        }
      }

      return arr = { returnVal : returnVal , chkIdx : chkIdx } ; 
    } /*end of chkDom*/
  } /*end of return*/ 
}()) ; /*end of ImgSlide*/

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

  /*ImgSlide( 'div.imgSlide.ver2' , { btns: 'hide' , bullet: 'hide' }) ;*/ 

window.addEventListener( 'load' , function () {
  /*ImgSlide( 'div.imgSlide' ) ;*/ 
  /*ImgSlide( 'div.imgSlide.type2' , { minWArr: [ 200 , 300 , 400 ] }) ;*/ 
   /*ImgSlide( 'div.imgSlide' , { minWArr: [600 , 800] , loop : false , dragRatio : 5 }) ;*/ 
   /*ImgSlide( 'div.imgSlide.type2' , { minWArr: [200 , 400 , 500 ] , loop : true , btns : false }) ;*/ 
}) ; 