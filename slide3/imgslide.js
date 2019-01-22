var ImgSlide = (function ImgSlideF () {
  var pu = {} ; 
  pu.doms = [] ; 

  function ImgSlide ( dom , info ) {
    var pr = {} , obj = {} , opt = {} , tag = {} , self = this ; 
    this.dom = dom ; 
    this.btnsShow = true ; 
    this.bulletShow = true ; 

    (function domSet (){
      tag.mother = dom ; 
      tag.btns = tag.mother.querySelectorAll( 'button' ) ; 
      tag.mask = tag.mother.querySelector( 'div.mask' ) ; 
      tag.list = tag.mother.querySelector( 'ul.list' ) ; 
      tag.listClone = null ; 
      tag.listLi = tag.list.querySelectorAll( 'li' ) ; 
      tag.bullet = document.createElement( 'ol' ) ; 
      tag.bullet.className = 'bullet' ; 
    }()) ; 

    (function objSet (){
      pr.minW = 639 ; 
      pr.bulletIdx = 1 ; 
      
      opt.winW = window.innerWidth ; 
      opt.motherW = tag.mother.offsetWidth ; 
      opt.remainedW = opt.winW - opt.motherW ; 
      opt.winW = opt.winW - opt.remainedW ; 

      // console.log( 'opt.winW : ' , opt.winW , 'tag.mother.offsetWidth : ' , tag.mother.offsetWidth , 'opt.remainedW : ' , opt.remainedW ) ; 

      opt.listLiLen = tag.listLi.length ; 
      opt.boxW = null ; 
      opt.boxH = null ; 
      opt.cIdxArr = [0] ; 
      opt.cIdx = 0 ; 
      opt.cIdxStr = 'cIdx' ; 
      opt.downBool = false ; 
      opt.clickBool = false ; 
      opt.startX = null ; 
      opt.startY = null ; 
      opt.endX = null ; 
      opt.moveX = null ; 
      opt.dirX = null ; 
      opt.moveClass = 'move' ; 
      opt.hideClass = 'hide' ; 
      opt.activeClass = 'active' ; 
      opt.startTime = null ; 
      opt.endTime = null ; 
      opt.appendBool = true ; 
      // opt.scrollable = true ; 
    }()) ; 

    (function prepareSet (){
      var i = 0 , len = opt.listLiLen , loadNum = 0 , img , _src ; 

      // 슬라이드의 이미지 랭스를 체크하여 현재 크기를 알아냅니다. 
      for ( ; i < len ; i += 1 ) {
        img = new Image() ; 

        img.onload = function () {
          opt.boxW = tag.listLi[loadNum].querySelector( 'img' ).offsetWidth ; 
          opt.boxH = tag.listLi[loadNum].querySelector( 'img' ).offsetHeight ; 

          tag.mother.style.height = opt.boxH + 'px' ; 
          tag.mask.style.width = opt.boxW + 'px' ; 
          tag.mask.style.height = opt.boxH + 'px' ; 
          tag.listLi[loadNum].classList.add( 'cIdx' + loadNum ) ; 
          tag.listLi[loadNum].style.width = opt.boxW + 'px' ; 
          tag.listLi[loadNum].style.height = opt.boxH + 'px' ;

          loadNum += 1 ; 
          if ( loadNum == len ) {
            // 이미지 로딩이 완료 되었다면 loadComplete를 호출합니다.
            loadComplete () ; 
          }
        }
        _src = tag.listLi[i].querySelector( 'img' ).src ; 
        img.src = _src ;
      }

      // image load Complete
      function loadComplete () {
        tag.listClone = tag.list.cloneNode(true) ; 

        pr.bulletIdx = pr.minW <= opt.winW ? 2 : 1 ; 

        bullet_show_hide() ; 
        btns_show_hide() ; 
        makeBullet() ; 
        resizeHandler() ; 

        [].forEach.call( tag.listLi , function ( el , idx ) {
          if ( idx >= pr.bulletIdx ) {
            el.parentNode.removeChild( el ) ; 
          }
        }) ; 
      }
    }()) ; 

    (function evtSet () {
      [].forEach.call( tag.btns , function ( btn ) {
        btn.addEventListener( 'click' , clickHandler ) ; 
        btn.addEventListener( 'touchstart' , clickHandler ) ; 
      }) ; 

      tag.list.addEventListener( 'mousedown' , dragHandler ) ; 
      tag.list.addEventListener( 'touchstart' , dragHandler ) ; 
      // window.addEventListener( 'mousemove' , dragHandler ) ; 
      // window.addEventListener( 'mouseup' , dragHandler ) ; 
      // window.addEventListener( 'touchmove' , dragHandler ) ; 
      // window.addEventListener( 'touchend' , dragHandler ) ; 
      window.addEventListener( 'resize' , resizeHandler ) ; 
      
    }()) ; 

    function cancelHandler (e) {
      console.log( '???' )
    }

    function makeBullet () {
      var li = tag.list.querySelectorAll( 'li' )[0] , 
        cNum = find_cIdx( li.classList[0] ) , 
        len = opt.listLiLen / pr.bulletIdx , 
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
     
      cNum = Math.floor(cNum / pr.bulletIdx) ; 
      li = tag.bullet.querySelectorAll('li')[cNum] ; 
      li.classList.add( opt.activeClass )

    } // end of makeBullet 

    function btns_show_hide () {
      // console.log( arguments.callee.name , 'self.btnsShow : ' , self.btnsShow ) ; 

      if ( self.btnsShow == 'hide' ) {
        [].forEach.call( tag.btns , function ( btn , idx ) {
          btn.classList.add( opt.hideClass ) ; 
        }) ; 
      } else {
        [].forEach.call( tag.btns , function ( btn , idx ) {
          if ( opt.cIdxArr[0] == 0 ) {
            tag.btns[0].classList.add( opt.hideClass ) ; 
          } else {
            tag.btns[0].classList.remove( opt.hideClass ) ; 
          }

          if ( opt.cIdxArr[opt.cIdxArr.length-1] == opt.listLiLen - 1 ) {
            tag.btns[1].classList.add( opt.hideClass ) ; 
          } else {
            tag.btns[1].classList.remove( opt.hideClass ) ; 
          }
        }) ; 
      }
    } // end of btns_show_hide

    function bullet_show_hide () {
      if ( self.bulletShow == 'hide' ) {
        tag.bullet.classList.add( opt.hideClass ) ; 
      } else {
        tag.bullet.classList.remove( opt.hideClass ) ; 
      }
    }

    function clickHandler (e) {
      if ( opt.clickBool ) return ; 
      opt.clickBool = true ; 

      // console.log( arguments.callee.name , this )
      var btn = this ; 

      if ( btn.classList.contains( 'next' ) ) {
        opt.dirX = -1 ; 
      } else {
        opt.dirX = 1 ; 
      }

      opt.startX = 0 ; 
      opt.endX = 1 ; 
      
      append() ; 
      done() ; 
    }

    function find_cIdx ( className ) {
      var returnName = parseInt( className.substr( opt.cIdxStr.length , className.length ) ) ; 
      return returnName ; 
    }

    function dragHandler (e) {
      var m , pageX ; 
      e.preventDefault() ; 
      e.stopPropagation() ; 
      
      if ( e.type == 'mousedown' || e.type == 'mousemove' || e.type == 'mouseup' ) {
        m = e ; 
      }
      if ( e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' ) {
        m = e.changedTouches[0] ; 
      }

      pageX = m.pageX ; 
      pageY = m.pageY ; 
      
      if ( e.type == 'mousedown' || e.type == 'touchstart' ) {
        opt.startX = pageX ; 
        opt.startY = pageY ; 
      }
      if ( e.type == 'mousemove' || e.type == 'touchmove' ) {
        var compareX = Math.abs( opt.startX - m.pageX ) ; 
        var compareY = Math.abs( opt.startY - m.pageY ) ; 
        if ( compareY > compareX ) {
          // opt.scrollable = true ; 
        } else {
          // opt.scrollable = false ; 
        }
      }

      //if ( opt.scrollable ) return ; 
      

      switch( e.type ) {
        case 'mousedown' : 
        case 'touchstart' : 
          if ( opt.clickBool ) return ; 
          // console.log( 'e.type : ' , e.type ) ; 

          window.addEventListener( 'mousemove' , dragHandler ) ; 
          window.addEventListener( 'mouseup' , dragHandler ) ; 
          window.addEventListener( 'touchmove' , dragHandler ) ; 
          window.addEventListener( 'touchend' , dragHandler ) ; 

          opt.startX = pageX ; 
          opt.startY = pageY ; 
          opt.downBool = true ; 
          opt.clickBool = true ; 
          opt.startTime = new Date().getTime() ; 

          break ; 
        case 'mousemove' : 
        case 'touchmove' : 
          if ( !opt.downBool ) return ; 
          // console.log( 'e.type : ' , e.type ) ; 

          opt.moveX = pageX - opt.startX ; 
          opt.dirX = opt.moveX < 0 ? -1 : 1 ; 
          append() ; 
          move() ; 
          break ; 
        case 'mouseup' : 
        case 'touchend' : 
          if ( !opt.downBool ) return ; 
          // console.log( 'e.type : ' , e.type ) ; 
          // opt.scrollable = false ; 

          window.removeEventListener( 'mousemove' , dragHandler ) ; 
          window.removeEventListener( 'mouseup' , dragHandler ) ; 
          window.removeEventListener( 'touchmove' , dragHandler ) ; 
          window.removeEventListener( 'touchend' , dragHandler ) ; 

          opt.endTime = new Date().getTime() ; 
          opt.endX = pageX ; 
          done() ; 
          opt.downBool = !opt.downBool ; 
          break ; 
      }
    } // end of dragHandler

    function append () {
      // console.log( arguments.callee.name ) ; 
      var lis = tag.list.querySelectorAll( 'li' ) , 
        liLen = lis.length , 
        i = 0 ; 
      // console.log( 'liLen : ' , liLen , 'pr.bulletIdx : ' , pr.bulletIdx , 'opt.dirX : ' , opt.dirX ) ; 

      // append list
      if ( liLen <= pr.bulletIdx ) {
        // 왼쪽으로 드래그
        if ( opt.dirX < 0 ) {
          opt.cIdx = opt.cIdxArr[opt.cIdxArr.length-1] ;
          // console.log( 'opt.cIdx : ' , opt.cIdx , 'opt.listLiLen -1 : ' , opt.listLiLen - 1 ) ; 
          for( ; i < pr.bulletIdx ; i += 1 ) {
            if ( opt.cIdx < opt.listLiLen - 1 ) {
              // console.log( 'i : ' , i , 'opt.cIdx : ' , opt.cIdx , 'opt.listLiLen : ' , opt.listLiLen ) ; 
              opt.cIdx += 1 ; 
              var li = tag.listClone.querySelectorAll( 'li' )[opt.cIdx] ; 
              li.style.width = opt.winW / pr.bulletIdx + 'px' ; 
              tag.list.style.width = opt.winW * 2 + 'px' ; 
              tag.list.appendChild( li.cloneNode(true) ) ; 
              opt.addMoveX = 0 ; 
            }
          }

        // 오른쪽으로 드래그 
        } else if ( opt.dirX > 0 ) {
          opt.cIdx = opt.cIdxArr[0] ; 
          // console.log( 'right - opt.cIdx : ' , opt.cIdx ) ; 
          for( ; i < pr.bulletIdx ; i += 1 ) {
            // 현재 이미지가 최초가 아닌 경우               
            if ( opt.cIdx != 0 ) {
              opt.cIdx -= 1 ; 
              var li = tag.listClone.querySelectorAll( 'li' )[opt.cIdx] ; 
              li.style.width = opt.winW / pr.bulletIdx + 'px' ; 
              tag.list.style.width = opt.winW * 2 + 'px' ; 
              // tag.list.style.left = -opt.winW + 'px' ; 
              tag.list.style.webkitTransform  = "translateX(" + (-opt.winW) + "px) translateZ(0px)";
              tag.list.insertBefore( li.cloneNode(true) , tag.list.querySelector( 'li:first-child' ) ) ; 
              opt.addMoveX = -opt.winW ; 
            // 현재 이미지가 최초인 경우 
            } else {
              opt.cIdx = opt.cIdxArr[0] ; 
              tag.list.style.width = opt.winW + 'px' ; 
              // tag.list.style.left = 0 + 'px' ; 
              tag.list.style.webkitTransform  = "translateX(" + (0) + "px) translateZ(0px)"; 
              opt.addMoveX = 0 ; 
            }
            // console.log( i )  
          }
        }
      // remove list
      } else {
        // 오른쪽으로 드래그시
        if ( opt.addMoveX == 0 && opt.dirX > 0 && opt.moveX >= 0 ) {
          var i = 0 ; 
          for ( ; i < liLen ; i += 1 ) {
            // 화면상에 뿌려져있던 기본이 아닌 리스트를 찾아 true false 를 반환해줍니다.
            // 반환받은 값이 false 라면 해당 리스트를 삭제 합니다.
            if ( !removeLi( lis[i] ) ) {
              lis[i].parentNode.removeChild( lis[i] ) ; 
            }
          }

        // 왼쪽으로 드래그시
        } else if ( Math.abs(opt.addMoveX) == opt.winW && opt.dirX < 0 && opt.moveX <= 0 ) {
          // console.log( 'bbb' ) ; 
          var i = 0 ; 
          tag.list.style.width = opt.winW + 'px' ; 
          opt.addMoveX = 0 ; 
          for ( ; i < liLen ; i += 1 ) {
            // 화면상에 뿌려져있던 기본이 아닌 리스트를 찾아 true false 를 반환해줍니다.
            // 반환받은 값이 false 라면 해당 리스트를 삭제 합니다.
            if ( !removeLi( lis[i] ) ) {
              lis[i].parentNode.removeChild( lis[i] ) ; 
            }
          }
        }

      }
    } // end of append

    function done () {
      // console.log( arguments.callee.name ) ;  
      var arrivalX = Math.abs(opt.moveX) , 
        arrivalTime = opt.endTime - opt.startTime ; 

      // console.log( 'opt.startX : ' , opt.startX , 'opt.endX : ' , opt.endX ) ; 
      
      // 리스트를 움직이지 않았을 경우 
      if ( opt.startX == opt.endX ) {
        // console.log( 'done chkchk' ) ; 
        removeDom() ; 

      // 리스트가 움직였을 경우
      } else {
        // 왼쪽으로 드래그시
        if ( opt.dirX < 0 ) {
          // console.log( 'left' ) ; 
          if ( arrivalX >= opt.winW/2 || arrivalTime <= 200 ) {
            // console.log( 'a' )
            if ( tag.list.offsetWidth <= opt.winW ) {
              // console.log( 'a-1' ) 
              // 드래그 리스트가 맨 마지막일 경우
              setTimeout(function(){
                tag.list.classList.add( opt.moveClass ) ; 
                // tag.list.style.left = 0 + 'px';
                tag.list.style.webkitTransform  = "translateX(" + (0) + "px) translateZ(0px)";
              } , 10 ) ; 

            } else {
              // 드래그가 화면의 절반을 넘어갔을 경우
              // console.log( 'a-2' ) 
              // console.log( 'opt.cIdx : ' , opt.cIdx ) ; 
              setTimeout(function(){
                tag.list.classList.add( opt.moveClass ) ; 
                // tag.list.style.left = -opt.winW + 'px';
                tag.list.style.webkitTransform  = "translateX(" + (-opt.winW) + "px) translateZ(0px)";
              } , 10 ) ; 
            }
          } else {

            // 드래그가 화면의 절반을 넘기지 못하였을 경우
            // console.log( 'b' ) ; 
            setTimeout(function(){
              tag.list.classList.add( opt.moveClass ) ; 
              // tag.list.style.left = 0 + 'px';
              tag.list.style.webkitTransform  = "translateX(" + (0) + "px) translateZ(0px)";
            } , 10 ) ; 
          }

        // 오른쪽으로 드래그시
        } else if ( opt.dirX > 0 ) {
          // console.log( 'right' ) ; 
          if ( arrivalX >= opt.winW/2 || arrivalTime <= 200 ) {
            // 드래그가 화면의 절반을 넘어갔을 경우
            // console.log( 'c' ) ; 
            setTimeout(function(){
              // console.log( 'chkchk' ) ; 
              tag.list.classList.add( opt.moveClass ) ; 
              // tag.list.style.left = 0 + 'px';
              tag.list.style.webkitTransform  = "translateX(" + (0) + "px) translateZ(0px)";
            } , 10 ) ; 

          } else {
            // console.log( 'd' ) ; 
            if ( tag.list.offsetWidth <= opt.winW ) {
              // console.log( 'd-1' ) ; 
              // 드래그시 리르스가 0번일 경우 
              setTimeout(function(){
                tag.list.classList.add( opt.moveClass ) ; 
                // tag.list.style.left = 0 + 'px';
                tag.list.style.webkitTransform  = "translateX(" + (0) + "px) translateZ(0px)";
              } , 10 ) ; 
            } else {
              // 드래그가 화면의 절반을 넘기지 못하였을 경우
              // console.log( 'd-2' ) ; 
              setTimeout(function(){
                tag. list.classList.add( opt.moveClass ) ; 
                // tag.list.style.left = -opt.winW + 'px'; 
                tag.list.style.webkitTransform  = "translateX(" + (-opt.winW) + "px) translateZ(0px)";
              } , 10 ) ; 

            }
          }

        }
        transitionendFunc( tag.list ) ; 
      }
    } // end of done

    function transitionendFunc ( tag ) {
      tag.addEventListener( 'webkitTransitionEnd' , function chkF () {
        tag.classList.remove( opt.moveClass ) ; 
        tag.removeEventListener( 'webkitTransitionEnd' , chkF ) ; 
        removeDom() ; 
      }) ; 

      tag.addEventListener( 'transitionend' , function chkF () {
        tag.classList.remove( opt.moveClass ) ; 
        tag.removeEventListener( 'transitionend' , chkF ) ; 
        removeDom() ; 
      }) ; 
    }

    function whichTransitionEvent ( tag ) {
      // console.log( arguments.callee.name ) ; 
      var t , 
        el = tag , 
        transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      } ; 

      for ( t in transitions ) {
        if ( el.style[t] !== undefined ) {
          return transitions[t] ; 
        }
      }

    } // end of whichTransitionEvent

    function removeDom () {
      // console.log( arguments.callee.name ) ; 
      
      // 만약 tag.list.offsetLeft이 0 일 경우 화면에 0번째 리스트가 존재 한다는 것이고 ( opt.cIdxArr 와 동일한 값을 가진것)
      // tag.list.offsetLeft이 음수일 경우 좌측 화면상에 보이지 않는 리스트가 존재한다는것입니다. ( opt.cIdxArr 에 포함되지 않은 리스트 값이 있는것 )
      var lis = tag.list.querySelectorAll( 'li' ) , len = lis.length , i = 0 ; 
      // console.log( 'opt.dirX : ' , opt.dirX , 'tag.list.offsetLeft : ', tag.list.offsetLeft , 'opt.winW : ' , opt.winW , 'len : ' , len ) ; 

      // tag.list.getBoundingClientRect().left
      var rect = tag.list.getBoundingClientRect() ; 
      var gapLeft = 0 ; 
      if ( opt.dirX > 0 ) {
        gapLeft = tag.mother.offsetLeft ; 
      }

      for ( ; i < len ; i += 1 ) {
        if ( rect.left - gapLeft == 0 && opt.dirX < 0 ) {
          if ( !removeLi( lis[i] ) ) {
            lis[i].parentNode.removeChild( lis[i] ) ;             
          }
        } else if ( rect.left - gapLeft == 0 && opt.dirX > 0 ) {

          if ( removeLi( lis[i] ) && len > pr.bulletIdx ) {
            lis[i].parentNode.removeChild( lis[i] ) ;             
          }
        }

        if ( rect.left - gapLeft < 0 && opt.dirX < 0 ) {
          if ( removeLi( lis[i] ) ) {
            lis[i].parentNode.removeChild( lis[i] ) ;             
          }
        } else if ( rect.left - gapLeft < 0 && opt.dirX > 0 ) {          
          if ( !removeLi( lis[i] ) ) {
            lis[i].parentNode.removeChild( lis[i] ) ;             
          }
        }
      }

      // 리스트 삭제 후 슬라이드 초기화
      tag.list.style.width = opt.winW + 'px' ; 
      tag.list.style.webkitTransform  = "translateX(" + (0) + "px) translateZ(0px)" ; 
      tag.list.classList.add( 'chkchk' ) ; 
      var rect = tag.list.getBoundingClientRect() ; 

      lis = tag.list.querySelectorAll( 'li' ) ; 
      [].forEach.call( lis , function ( el ) {
        // el.style.height = 100 + 'px' ; 
        // jj.trace( rect.left , lis.length , el.style.width , el.style.height , el.querySelector( 'img' ).offsetWidth , el.querySelector( 'img' ).offsetHeight ) ; 
      }) ; 

      setTimeout(function(){
        document.getElementsByTagName('body')[0].style.height = document.body.offsetHeight + 1 + 'px' ; 
        document.getElementsByTagName('body')[0].style.height = document.body.offsetHeight - 1 + 'px' ; 
      }, 0 ) ; 

      opt.addMoveX = 0 ; 
      opt.cIdxArr = [] ; 

      var i = 0 , 
      lis = tag.list.querySelectorAll( 'li' ) , 
      len = lis.length ; 
      // for ( ; i < pr.bulletIdx ; i += 1 ) {
      for ( ; i < len ; i += 1 ) {
        var li = tag.list.querySelectorAll( 'li' )[i] ; 
        opt.cIdxArr.push( find_cIdx( li.classList[0] ) ) ; 
      }

      //console.log( 'opt.cIdxArr : ' , opt.cIdxArr ) ; 

      btns_show_hide() ; 
      makeBullet() ; 

      setTimeout(function(){
        tag.list.style.width = opt.winW + 'px' ; 
        tag.list.style.webkitTransform  = "translateX(" + (0) + "px) translateZ(0px)";
        opt.clickBool = false ; 
      } , 10 ) ; 
      
    }

    function removeLi ( li ) {
      var i = 0 , len = opt.cIdxArr.length , findIdxs = false ; 
      for ( ; i < len ; i += 1 ) {
        if ( opt.cIdxArr[i] == find_cIdx( li.classList[0] ) ) {
          findIdxs = true ; 
        }
      }
      return findIdxs ; 
    }

    function move () {
      // tag.list.style.position = 'absolute' ; 
      // tag.list.style.left = (opt.addMoveX + opt.moveX) + 'px' ; 

      tag.list.style.webkitTransform  = "translateX(" + (opt.addMoveX + opt.moveX) + "px) translateZ(0px)";

      // console.log( tag.list.getBoundingClientRect().left ) ; 

      // var curTransform = new WebKitCSSMatrix(window.getComputedStyle( tag.list ).webkitTransform);
      // console.log( curTransform.m41 ); //real offset left
      // console.log(node.offsetLeft + curTransform.m41); //real offset left
      // console.log(node.offsetTop + curTransform.m42); //real offset top

    }



    function resizeHandler () {
      var winWOld = window.innerWidth ; 

      (function chkResize () {
        var func = arguments.callee ; 
        
        setTimeout(function(){
          document.getElementsByTagName('body')[0].style.height = document.body.offsetHeight + 1 + 'px' ; 
          document.getElementsByTagName('body')[0].style.height = document.body.offsetHeight - 1 + 'px' ; 
        }, 0 ) ; 

        setTimeout(function(){
          var winWNew = window.innerWidth ; 

          opt.winW = window.innerWidth ; 
          opt.motherW = tag.mother.offsetWidth ; 
          opt.remainedW = opt.winW - opt.motherW ; 
          opt.winW = opt.winW - opt.remainedW ; 
         
          if ( winWOld != winWNew ) {
            winWOld = winWNew ; 
            func() ; 
          } else {
            var len = tag.list.querySelectorAll( 'li' ).length , 
              i = 0 ; 

            pr.bulletIdx = pr.minW <= opt.winW ? 2 : 1 ; 
            makeBullet() ; 

            /*
            console.log( 
              'opt.cIdxArr : ' , opt.cIdxArr , 
              'opt.listLiLen : ' , opt.listLiLen , 
              'pr.bulletIdx : ' , pr.bulletIdx , 
              'len : ' , len 
            ) ; 
            */

            if ( pr.bulletIdx > len ) {
              // 현재 화면개수보다 리스트 개수가 적을 경우
              var cIdx = opt.cIdxArr[opt.cIdxArr.length-1] , 
                cIdxChk = cIdx % 2 , 
                addNum ; 
                i = 0 , 
                li ; 
              

              // cIdxChk 가 0 이면 좌측 1이면 우측
              
              addNum = cIdxChk == 0 ? 1 : -1 ; 
              console.log( 'cIdx : ' , cIdx , 'cIdxChk : ' , cIdxChk , 'addNum : ' , addNum ) ; 

              if ( cIdx < opt.listLiLen ) {
                for ( ; i < len ; i += 1 ) {
                  // console.log( 'cIdx+addNum : ' , cIdx+addNum , opt.listLiLen ) ; 
                  if ( cIdx + addNum < opt.listLiLen ) {
                    li = tag.listClone.querySelectorAll( 'li' )[cIdx+addNum] ; 
                    if ( addNum > 0 ) { 
                      tag.list.appendChild( li.cloneNode(true) ) ; 
                    } else {
                      tag.list.insertBefore( li.cloneNode(true) , tag.list.querySelector( 'li:first-child' ) ) ; 
                    }
                  }
                }
              }
            }

            //  화면상의 이미지 개수에 따라 현재 번호를 저장합니다.
            opt.cIdxArr = [] ; 
            len = tag.list.querySelectorAll( 'li' ).length ; 

            for ( i = 0 ; i < len ; i += 1 ) {
              var li = tag.list.querySelectorAll( 'li' )[i] ; 
              opt.cIdxArr.push( find_cIdx( li.classList[0] ) ) ; 
            }
            // console.log( 'opt.cIdxArr : ' , opt.cIdxArr ) ; 
            // console.log( 'opt.cIdxArr : ' , opt.cIdxArr , 'len : ' , len , 'pr.bulletIdx : ' , pr.bulletIdx ) ; 
            // 화면상에 리스트를 0번째만을 남겨둡니다.

            if ( len > pr.bulletIdx ) {
              [].forEach.call( tag.list.querySelectorAll( 'li' ) , function ( el , idx ) {
                if ( idx >= pr.bulletIdx ) {
                  el.parentNode.removeChild( el ) ; 
                }
              }) ; 
            } 
              
            // 현재 화면에 보이는 리스트의 크기를 변화합니다.
            [].forEach.call( tag.list.querySelectorAll( 'li' ) , function ( el ) {
              opt.boxW = opt.winW ; 
              el.style.width = (opt.boxW / pr.bulletIdx) + 'px' ; 
              opt.boxH = el.querySelector( 'img' ).offsetHeight ; 

              tag.list.style.width = opt.boxW + 'px' ; 
              tag.mother.style.height = opt.boxH + 'px' ; 
              tag.mask.style.width = opt.boxW + 'px' ; 
              tag.mask.style.height = opt.boxH + 'px' ; 
              // el.style.width = opt.boxW + 'px' ; 
              el.style.height = opt.boxH + 'px' ; 
            }) ; 

            // 리스트 복제의 크기를 변화합니다.
            [].forEach.call( tag.listClone.querySelectorAll( 'li' ) , function ( el ) {
              el.style.width = opt.boxW + 'px' ; 
              el.style.height = opt.boxH + 'px' ; 
            }) ; 

            tag.mother.style.visibility = 'visible' ; 
          }
        } , 10 ) ; 
      }()) ; 
    } // end of resizeHandler














    function resizeHandlerOld () {
      var winWOld = window.innerWidth ; 

      (function chkResize () {
        var func = arguments.callee ; 
        
        setTimeout(function(){
          document.getElementsByTagName('body')[0].style.height = document.body.offsetHeight + 1 + 'px' ; 
          document.getElementsByTagName('body')[0].style.height = document.body.offsetHeight - 1 + 'px' ; 
        }, 0 ) ; 

        setTimeout(function(){
          var winWNew = window.innerWidth ; 
          opt.winW = window.innerWidth - opt.remainedW ; 
         
          if ( winWOld != winWNew ) {
            winWOld = winWNew ; 
            func() ; 
          } else {
            var len = tag.list.querySelectorAll( 'li' ).length , 
              i = 0 ; 

            pr.bulletIdx = pr.minW <= opt.winW ? 2 : 1 ; 
            makeBullet() ; 

            // console.log( 'opt.cIdxArr[0] : ' , opt.cIdxArr[0] , opt.listLiLen )

            if ( opt.listLiLen - 1 - opt.cIdxArr[0] == 1 ) {
              // console.log( '---- chk1' ) ; 
              var liAfter = tag.listClone.querySelectorAll( 'li' )[opt.listLiLen-1] , 
                liBefore = tag.list.querySelector( 'li:first-child') ; 
              tag.list.appendChild( liAfter.cloneNode(true) ) ; 

              liBefore.parentNode.removeChild( liBefore ) ; 
              

            } else {
              // console.log( '---- chk2' ) ; 
              // 리사이즈 도중 이미지 슬라이드 개수가 적을 경우 추가 해줍니다.
              if ( len < pr.bulletIdx ) {
                for ( i = 0 ; i < len ; i += 1 ) {
                  if ( opt.cIdxArr[0] + 1 != opt.listLiLen ) {
                    var li = tag.listClone.querySelectorAll( 'li' )[opt.cIdxArr[0]+1] ; 
                    tag.list.appendChild( li.cloneNode(true) ) ; 
                  }
                }
              }
            }

            //  화면상의 이미지 개수에 따라 현재 번호를 저장합니다.
            opt.cIdxArr = [] ; 
            len = tag.list.querySelectorAll( 'li' ).length ; 

            for ( i = 0 ; i < len ; i += 1 ) {
              var li = tag.list.querySelectorAll( 'li' )[i] ; 
              opt.cIdxArr.push( find_cIdx( li.classList[0] ) ) ; 
            }
            // console.log( 'opt.cIdxArr : ' , opt.cIdxArr ) ; 

            // console.log( 'opt.cIdxArr : ' , opt.cIdxArr , 'len : ' , len , 'pr.bulletIdx : ' , pr.bulletIdx ) ; 

            // 화면상에 리스트를 0번째만을 남겨둡니다.
            if ( len > pr.bulletIdx ) {
              [].forEach.call( tag.list.querySelectorAll( 'li' ) , function ( el , idx ) {
                if ( idx >= pr.bulletIdx ) {
                  el.parentNode.removeChild( el ) ; 
                }
              }) ; 
            } 
              
            // 현재 화면에 보이는 리스트의 크기를 변화합니다.
            [].forEach.call( tag.list.querySelectorAll( 'li' ) , function ( el ) {
              opt.boxW = opt.winW ;             
              el.style.width = (opt.boxW / pr.bulletIdx) + 'px' ; 
              opt.boxH = el.querySelector( 'img' ).offsetHeight ; 

              tag.list.style.width = opt.boxW + 'px' ; 
              tag.mother.style.height = opt.boxH + 'px' ; 
              tag.mask.style.width = opt.boxW + 'px' ; 
              tag.mask.style.height = opt.boxH + 'px' ; 
              // el.style.width = opt.boxW + 'px' ; 
              el.style.height = opt.boxH + 'px' ; 
            }) ; 

            // 리스트 복제의 크기를 변화합니다.
            [].forEach.call( tag.listClone.querySelectorAll( 'li' ) , function ( el ) {
              el.style.width = opt.boxW + 'px' ; 
              el.style.height = opt.boxH + 'px' ; 
            }) ; 

            tag.mother.style.visibility = 'visible' ; 
          }
        } , 10 ) ; 
      }()) ; 
    } // end of resizeHandler

 
  } // end of ImgSlide

  ImgSlide.prototype = {
    reInit : function ( opt ) {
      // console.log( opt.btns )
      // console.log( opt.bullet )
      if ( opt.btns != undefined ) {
        // this.btns_show_hide( opt.btns ) ; 
      }
    } , 
    btns_show_hide2 : function ( opt ) {
      this.btns_show_hide( opt ) ; 
    }
  } ; 

  return function ( dom , opt ) {    
    var dom = document.querySelectorAll( dom ) , 
      slider , 
      anotherSlider ; 

    [].forEach.call( dom , function ( el ) {
      var chk = findDom( el ) ; 

      if ( chk.returnVal ) {
        slider = new ImgSlide( el ) ; 
        pu.doms.push( slider ) ; 
      } else {
        anotherSlider = pu.doms[chk.chkIdx] ; 
        anotherSlider.btnsShow = opt.btns ; 
        anotherSlider.bulletShow = opt.bullet ; 
      }
    }) ; 

    function findDom ( el ) {
      var i = 0 , returnVal = true , arr = {} ,  chkIdx ; 
      if ( pu.doms.length == 0 ) {
        returnVal = true ; 
      } else {
        for ( ; i < pu.doms.length ; i += 1 ) {
          if ( el == pu.doms[i].dom ) {
            returnVal = false ; 
            chkIdx = i ; 
          }
        }
      }

      arr = { returnVal : returnVal , chkIdx : chkIdx } ; 
      return arr ; 
    } // end of findDom ; 

    /*
    if ( opt != undefined ) {
      [].forEach.call( dom , function ( el ) {
        var chk = findDom( el ) , slider ; 
        if ( !chk.returnVal ) {
          console.log( '????' ) ; 
          var anotherSlider = pu.doms[chk.chkIdx] ; 
          anotherSlider.reInit( opt ) ; 
        }
      }) ; 
    }
    */
  } // end of return

}()) ; // end of ImgSlide

window.addEventListener( 'load' , function () {
  ImgSlide( 'div.imgSlide' ) ; 
  ImgSlide( 'div.imgSlide.ver2' , { btns: 'hide' , bullet: 'hide' }) ; 
  ImgSlide( 'div.imgSlide.ver3' , { btns: 'show' , bullet: 'hide' }) ; 

/*
  btn(arr) show, hide 
  bullet 
  unlimit roop 
  finger Speee Type 
*/
}) ; 