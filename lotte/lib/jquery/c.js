/**
 * 앱으로 로그인아이디전송
 * 
 * 변경이력: 2015-10-27, 이형근(hglee63)
 *  - app_frame은 리뉴얼 이 후 존재하지 않아 스크립트 에러가 발생하므로 iframe을 이용하던 방식에서 location 주소를 바꾸는 방식으로 변경하였다.
 *  - IOS의 경우 스크립트의 타이밍 문제로 인해 스킴이 완전히 호출되기 전 submit이 되어버리는 현상이 있다.
 *   따라서 아이폰은 returnUrl을 파라미터로 전달하여 앱에서 페이지를 이동시키도록 한다.
 *  
 */
function transLoginIdToApp(div, login_id, url) {
    // 디바이스 별 함수 호출
    if (chkDevice() == "iOS") {
        if (div=='login') {
            location.href = 'loginCheck://loginId/' + login_id + '?returnUrl=' + (typeof url == 'undefined' ? '' : encodeURIComponent(url) );
            
        } else {
            location.href = 'loginCheck://logout';
        }
    } else { // android
        if (div=='login') {
            if (window.loginCheck)
                window.loginCheck.callAndroid("loginId/"+login_id);
        } else {
            if (window.loginCheck)
                window.loginCheck.callAndroid("logout");
        }
    }
}

// 로그인체크
function chkLoginByApp(){
    // 디바이스 별 함수 호출
    if (chk_device()=="iOS"){
        top.document.getElementById('storage_frame').src = 'loginCheck://isUserLogged/'+loginChk();
    } else { // android
        window.loginCheck.callAndroid(loginChk());
    }
}

// 앱 하단 메뉴 채널, 채널상세 번호 변경
function callChangeParamUrl(app_url){
    // app_url 마지막에 '&' 가 있으면 삭제
    app_url = (app_url.substring(app_url.length - 1)=="&"?app_url.substring(0, app_url.length - 2):app_url);
    // 현재 페이지의 파라메터 읽기
    var curr_url = location.href; // 현재 url 주소
    var chk_para = ["cn", "cdn"]; // 치환 파라메터 명
    var chk_idx = -1;
    var tmp_str = "";
    var param_cn = "23";

    if(curr_url.indexOf(".ellotte.com") > -1){  //엘롯데 채널셋팅
        param_cn = "152726";
    }else if(curr_url.toLowerCase().indexOf("smp_yn=y") > -1){  //스마트픽 채널셋팅
        param_cn = "116824";
    }
    getUrlParameter(curr_url);

    for (var i=0; i<chk_para.length; i++){
        chk_idx = app_url.indexOf(chk_para[i]+"=");

        if (chk_idx > -1){
            continue;
        }else{

            if (sessionStorage.getItem(chk_para[i])!=null && sessionStorage.getItem(chk_para[i])!="" ){
                app_url = (app_url + (app_url.indexOf("?")>-1?"&":"?") + chk_para[i]+"="+sessionStorage.getItem(chk_para[i]));
            }else{
                if (chk_para[i]=="cn"){
                    app_url = (app_url + (app_url.indexOf("?")>-1?"&":"?") + "cn="+param_cn);
                }else if (chk_para[i]=="cdn"){
                    app_url = (app_url + (app_url.indexOf("?")>-1?"&":"?") + "cdn=");
                }
            }
        }
    }

    location.href = (app_url.split("@").join("&"));
}

// url 파라메터 반환
function getUrlParameter(req_url){
    var url_param = "";
    var tmp_1_arr, tmp_2_arr; // 파라메터1차구분, 파라메터2차구분, 반환값
    try{
        var mainTabIdx = sessionStorage.getItem("mainTabIdx") != null ? sessionStorage.getItem("mainTabIdx") : 1;   //모바일 메인 탭
        var myHomeType = sessionStorage.getItem("myHomeType") != null ? sessionStorage.getItem("myHomeType") : "all";   //모바일 지니딜 탭
        sessionStorage.clear();

        sessionStorage.setItem("mainTabIdx" , mainTabIdx);
        sessionStorage.setItem("myHomeType" , myHomeType);
    }catch(e){}

    if (req_url.indexOf("?") > -1){ // 사이트 주소와 파라메터가 같이 있는 경우
        url_param = req_url.substring(req_url.indexOf("?") + 1);
    } else { // 사이트 주소와 파라메터가 같이 있지 않은 경우
        url_param = req_url;
    }

    // 파라메터 명과 값이 존재할 때
    if (url_param.indexOf("=") > -1){
        tmp_1_arr = url_param.split("&");

        for(var i=0; i<tmp_1_arr.length; i++){
            tmp_2_arr = tmp_1_arr[i].split("=");

            if(tmp_2_arr[0] == "cn" || tmp_2_arr[0] == "cdn"){
                sessionStorage.setItem(tmp_2_arr[0], tmp_2_arr[1]);
            }
        }
    }
}

//앱 최신버전 비교 ver1:현재앱 compareVer:비교버전
function appVerChk(ver1,compareVer){
    // ellotte_jklee16
    if ( window.location.href.indexOf(".ellotte.com") >= 0 ) {
        return true;
    }
    var appVer = ver1.replace(/\./gi,"");
    if(parseInt(appVer) > parseInt(compareVer)){
        return true;
    }else{
        return false;
    }
}

//앱 최신버전 비교 ver1:현재앱 compareVer:비교버전
function appChkVer(ver1,compareVer){
    var appVer = ver1.replace(/\./gi,"");
    if(parseInt(appVer) > parseInt(compareVer)){
        return true;
    }else{
        return false;
    }
}
/*
===== EG Slider =======
eung kim 
2012.12 : 생성
2014.02 : getIndex 추가, rotateWindow(fnc) 추가
2014.11.13 : off 추가 
*/
//common ----------------------------------------------------
var isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
    isPlaybook = (/playbook/gi).test(navigator.appVersion),
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
    hasTouch = 'ontouchstart' in window && !isTouchPad,	
    DOWN_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    UP_EV = hasTouch ? 'touchend' : 'mouseup',
    android2 = false;
if(navigator.userAgent.indexOf("Android 2") > 0){android2 = true;}

(function($){
	$.fn.simpleDrag = function(upFnc){
		var prvx = -1,
            DOWNPOS,
            OPOS = 0,
            target = document.getElementById($(this).attr("id")),
            DOWNY,
            DOWNX,
            dragDist = 0,
            dragDir = 2, //드래그방향 : 0 - 왼쪽 , 1 - 오른쪽, 2 - 제자리	
            dragFlag = true, //드래그 기능 작동 여부
            tx = 0,
            downTime;
        if(arguments[1] != null){var moveFnc = arguments[1];
		}else{function moveFnc(){};}		
		$(document.body).attr("ondragstart","return false");
		$(document.body).attr("onselectstart","return false"); 				
		var mUp = function(e){
            if(Math.abs(dragDist) > 20){
				if(dragDist > 0){
					dragDir = 1;
				}else{
					dragDir = 0;
				}
			}else{
				dragDir = 2;
			}

			upFnc();

			document.body.removeEventListener(MOVE_EV, mMove);
			document.body.removeEventListener(UP_EV, mUp);
		}		
		function mDown(e){
            //debug(dragDist + " down:" + dragFlag);
			if(dragFlag){                
				downTime = new Date().getMilliseconds();
                dragDist = 0;
				var point = hasTouch ? e.touches[0] : e;		
				OPOS = tx;
                DOWNPOS = point.clientX - OPOS;
				DOWNY = point.clientY;
				DOWNX = point.clientX;
				prvx = 0;
				document.body.addEventListener(MOVE_EV, mMove);
				document.body.addEventListener(UP_EV, mUp);		
			}
		}
		function mMove(e){            
            if(dragFlag){
                var point = hasTouch ? e.touches[0] : e;
                if(Math.abs(point.clientY - DOWNY) < Math.abs(point.clientX - DOWNX)){
                    e.preventDefault();	
                    dragDist = point.clientX - DOWNX;
                    prvx = OPOS - tx;
                    tx = point.clientX - DOWNPOS;
                    setTx(tx);
                    moveFnc();
                }else{
                    mUp(null);
                }
            }
		}
        function setTx(val){            
            if(android2){
                $(target).css("margin-left", val + "px");                
            }else{
                $(target).css("-webkit-transform","translate3d(" + val + "px, 0, 0)");
                $(target).css("transform","translate3d(" + val + "px, 0, 0)");
            }
            
            tx = val;
        }
		target.addEventListener(DOWN_EV, mDown);
        if(!android2){
            $(target).css("-webkit-transition-property","transform");
            $(target).css("transition-property","transform");                        
        }           
		return {
			setX:function(value){
                setTx(value);
			},
			setMoveX:function(value, time, endFnc){                
                if(android2){
                    $(target).animate({"margin-left":value + "px"}, time, "linear", endFnc);
                }else{
                    //#20150306 pointer-events 속성 적용
                	//20150324 제자리 클릭인 경우에는 적용하지 않도록 처리  
                    if(dragDir < 2){
                    	$(document.body).css("pointer-events", "none");   
                    }
                    
                    $(target).css("-webkit-transition-duration", time + "ms");
                    $(target).css("transition-duration", time + "ms");
                    setTx(value);
                    setTimeout(function(){                        
                        //#20150306 pointer-events 속성 적용
                        $(document.body).css("pointer-events", "auto");            

                        $(target).css("-webkit-transition-duration", "0ms");
                        $(target).css("transition-duration", "0ms");
                        endFnc();
                    }, time);
                }                
			},
			setDragFlag:function(flag){
				dragFlag = flag;
			},
			_x:function(){
				return tx;
    		},
			_width:function(value){
				return parseInt($(target).width());
			},
			_dir:function(value){
				return dragDir;
			},
            _dragDist:function(){ //20150316 드래그한 거리 
                return Math.abs(dragDist);    
            },			
            getIndex:function(totalNum, partWidth){
   		  	    //var xvalue = parseInt(-parseInt($(target).css("margin-left"))/partWidth);
                var xvalue = parseInt(-parseInt(tx)/partWidth);
                if(dragDir == 0){
                    xvalue += 1;  
                }
                if(xvalue<0){
                    xvalue = 0;
                }else if(xvalue >= totalNum){
                    xvalue = totalNum-1;
                }
                return xvalue;                
            },
            off:function(){
                target.removeEventListener(DOWN_EV, mDown);
            },
            getFlickDist:function(){
                //플리킹처리
                var timeGap = new Date().getMilliseconds() - downTime;
                var tmpx = 0;
                //20150108 80 -> 40 수치조정
                if(timeGap > 0 && timeGap < 200 && Math.abs(dragDist) > 40){
                    tmpx = dragDist*2 + tx;
                }
                return tmpx;
            }
		};		
	}
})(jQuery); 

/*resize 이벤트용*/
function rotateWindow(fnc){    
    var winW = $(window).width();
	$(window).resize(function(){        
		if(winW != $(window).width()){
            winW = $(window).width();
            fnc();
        }
	});
}
//EG Slider 확장 기본 슬라이딩 (회전형) 
/*
인자 1 : 움직일 리스트 객체의 아이디값
인자 2 : 애니메이션이 끝난 후 동작할 함수
인자 3 : 배너를 회전시킬지 여부 true, false
//이지슬라이더 배너 샘플 : 배너객체, 애니메이션이 끝난 후 호출할 함수, 배너의 회전여부
//index 는 현재 위치 : rolling이 true이면(배너회전시) 1 부터시작하고  false 이면 0부터 시작함. 
var $bannerSlide = setEGSlide("#deptBann", function(index){  
    //alert(index);
}, true);
*/    
function setEGSlide(banner, endFnc, rolling){
    
    var $banner = $(banner),
        $wrapper = $banner.parent(),    
        $bannerChild = $banner.children(),    
        wd = $wrapper.width(),
        len = $bannerChild.length,    
        index = 0,    
        rollFlag = true, //회전형 배너를 쓸경우
        startIndex = 0,
        lastIndex = len - 1;
    if(rolling != undefined){
        rollFlag = rolling;
    }
    if(rollFlag){/*회전용*/        
        var $lbann = $bannerChild.eq(lastIndex).clone();
        $banner.append($bannerChild.eq(startIndex).clone());
        $bannerChild.eq(startIndex).before($lbann);
        $banner = $(banner);
        $bannerChild = $banner.children();
        len += 2;
        lastIndex += 2;
        //20150211 수정 
        index = startIndex = 1;
    }    
    $banner.width(wd*len + "px");
    $bannerChild.width(wd + "px");
    
    //###20150312 스크립트 개선 
    var $deptdrag = $(banner).simpleDrag(function(){
        var dir = $deptdrag._dir();
        //20150311 클릭시에는 처리하지 않도록 예외처리 추가 
        if(dir < 2){
            //#20150312 인덱스를 구함 (외부에서 이동시킬 경우 대비)
            index = $deptdrag.getIndex(len, wd);                        
            wd = $wrapper.width(); //20150210 추가         
            $deptdrag.setMoveX(-index*wd, 300, function(){
                /*회전용*/
                if(rollFlag){
                    if(index == 0){ 
                        $deptdrag.setX(-(lastIndex-1)*wd);
                        index = lastIndex - 1;
                    }else if(index == lastIndex){
                        $deptdrag.setX(-startIndex*wd);
                        index = startIndex;
                    }
                }
                if(endFnc != undefined){
                    endFnc(index); //움직임이 끝난 후 
                }
            });
        }
    });
    $deptdrag.setX(-startIndex*wd);
    //20150309 수정 
    rotateWindow(function(){
        setTimeout(function(){
			wd = $wrapper.width();     
			$banner.width(wd*len + "px");
			$bannerChild.width(wd + "px");
			$deptdrag.setX(-startIndex*wd);
			index = startIndex;
        },50);        
    });
    return $deptdrag;
}


/*
===== EG Scroll =======
eung kim 
2014.11 : 생성

@@@@@@ 사용예 @@@@@@@

1. 생성하기
var mcScroll = $("#mlist").egScroll(true, true); 
//인자 1.: true 스크롤바 보임, false 스크롤바 가림
//인자 2 : 러버밴드(끝에 다다랐을때 빈공간을 보여주는 것) true, false

태그구조
<!-- 스크롤을 감싸는 wrapper : overflow:hidden 처리-->
<div class="wrapper">
    <!--스크롤시킬 객체 : 생성할때 아이디를 전달-->
    <div id="mlist"></div>
</div>

2. 스크롤바의 스타일을 바꾸고자 할 때에 class 명을 인자로 전달한다.

mcScroll.changeScrollBarStyle("newScrollStyle");
*/

(function($){    
	$.fn.egScroll = function(scrollBarFlag){ 
        var $wrapper = $(this).parent(),
            $this = $(this),
            PH = $wrapper.height(),
            END =  PH - $this.height(),
            PER =  PH/$this.height(),
            loverBand = true,
            DOWNPOS,
            OPOS = 0,
            target = document.getElementById($this.attr("id")),
            DOWNY,
            dragDist = 0,
            dragDir = 2, //드래그방향 : 0 - 위쪽 , 1 - 아래쪽, 2 - 제자리	
            dragFlag = true, //드래그 기능 작동 여부
            ty = 0,
            downTime,
            scrollBar,
            scPER;
        if(arguments[1] != null){
            loverBand = arguments[1];   
		}        
		$(document.body).attr("ondragstart","return false");
		$(document.body).attr("onselectstart","return false"); 				
        var mUp = function(){
            if(END < 0){  //리스트가 wrapper 보다 큰경우           
                if(Math.abs(dragDist) > 20){
                    if(dragDist > 0){
                        dragDir = 1;
                    }else{
                        dragDir = 0;
                    }
                }else{
                    dragDir = 2;
                }

                //플리킹처리
                var timeGap = new Date().getMilliseconds() - downTime;
                if(timeGap > 0 && timeGap < 200 && Math.abs(dragDist) > 80){
                    var tmpy = dragDist*2 + ty;
                    if(tmpy > 0){
                        tmpy = 0;
                    }else if(tmpy < END){
                        tmpy = END;
                    }

                    if(scrollBarFlag){
                        scrollBar.hide();
                        setTimeout(function(){
                            scrollBar.fadeIn(200);
                        }, 500);
                    }                    
                    setMoveY(tmpy, 500);

                }else{            
                    //일반 드래그 끝에서 벗어나지 않게 위치찾아가기
                    if(ty > 0){
                        setMoveY(0, 100);
                    }else if(ty < END){
                        setMoveY(END, 100);
                    }
                }
            }
			document.body.removeEventListener(MOVE_EV, mMove);
			document.body.removeEventListener(UP_EV, mUp);
		}		
		function mDown(e){
            if(dragFlag){
				downTime = new Date().getMilliseconds();
                dragDist = 0;
				var point = hasTouch ? e.touches[0] : e;		
				OPOS = ty;
                DOWNPOS = point.clientY - OPOS;
				DOWNY = point.clientY;
				document.body.addEventListener(MOVE_EV, mMove);
				document.body.addEventListener(UP_EV, mUp);		
			}
		}
		function mMove(e){
            if(dragFlag){                	
                var point = hasTouch ? e.touches[0] : e;  
                e.preventDefault();
                if(END < 0){    //리스트가 wrapper 보다 큰경우           
                    dragDist = point.clientY - DOWNY;
                    ty = point.clientY - DOWNPOS;

                    if(ty > 0){
                        if(loverBand){
                            ty = ty - ty/2;
                        }else{
                            ty = 0;
                        }
                    }else if(ty < END){                    
                        if(loverBand){
                            ty = ty + (END-ty)/2;
                        }else{
                            ty = END;
                        }                    
                    }                
                    setTy(ty);
                }
            }
		}
        function setTy(val){            
            if(android2){
                $(target).css("margin-top", val + "px");                
            }else{
                $(target).css("-webkit-transform","translateY(" + val + "px)");
                $(target).css("transform","translateY(" + val + "px)");
            }
            ty = val;
                        
            //스크롤바처리
            if(scrollBarFlag){
                scrollBar.css("top", (val*scPER)+"px");                    
            }            
        }
        function setMoveY(value, time){                
            if(android2){
                $(target).animate({"margin-top":value + "px"}, time, "linear");
            }else{
                $(target).css("-webkit-transition-duration", time + "ms");
                $(target).css("transition-duration", time + "ms");
                setTy(value);
                setTimeout(function(){
                    $(target).css("-webkit-transition-duration", "0ms");
                    $(target).css("transition-duration", "0ms");                                        
                }, time);
            }                

        }
                
		target.addEventListener(DOWN_EV, mDown);
        //페이지 끝단에서 이벤트 안먹히는 버그 때문에 추가함.
        document.body.addEventListener(DOWN_EV, function(){
            //console.log("doc down");
        });        
        if(!android2){
            $(target).css("-webkit-transition-property","transform");
            $(target).css("transition-property","transform");                        
        }           
        if(scrollBarFlag){            
            if($wrapper.find(".scbar").css("width") == undefined){/*20141209 스크롤바가 없을경우*/
                var scobj =  "<div class='scbar' style='position:absolute;top:0;right:2px;width:3px;background:#000;opacity:0.4'></div>";            
                $wrapper.append(scobj);    
            }
            scrollBar = $wrapper.find(".scbar");                
            var scbarH = parseInt(PER*PH);
            scPER = (PH - scbarH)/END;
            scrollBar.height(scbarH  + "px");
            if(END >= 0){scrollBar.hide()}
        } 
		return {
            setY:function(value){ //특정 위치로 y 좌표를 이동 
                setTy(value);
            },
            setDragFlag:function(flag){ //동작을 잠시 멈춤,가동 할때 호출
                dragFlag = flag;
            },
            _y:function(){ //현재의 y 좌표값
                return ty;
            },
            _dir:function(value){ //드래그방향 : 0 - 위쪽 , 1 - 아래쪽, 2 - 제자리
                return dragDir;
            },
            off:function(){ //동작을 멈추고 이벤트를 제거할 때에 호출
                target.removeEventListener(DOWN_EV, mDown);
            },
            changeScrollBarStyle:function(className){ //스크롤바의 스타일을 변경할때 호출 
                scrollBar.removeAttr("style");
                scrollBar.addClass(className);
            },
            refresh:function(){
                PH = $wrapper.height();
                END =  PH - $this.height();
                PER =  PH/$this.height();
                if(scrollBarFlag){
                    scbarH = parseInt(PER*PH);
                    scPER = (PH - scbarH)/END;
                    scrollBar.height(scbarH  + "px");
                    if(END >= 0){
                        scrollBar.hide();
                    }else{
                        scrollBar.show();
                    }
                } 
                if(END >= 0){ //리스트가 작으면 상단에 맞추고
                    setTy(0);
                }else if(ty < END){ //큰데 하단에서 벌어져있으면 하단에 맞춤
                   setTy(END); 
                }
            }
		};		
	}
})(jQuery);



//페이지 스크롤 되는 것을 막고자 할때 영역의 ID 값을 전달한다.
function lockScroll(wrapperID){
    var target = document.getElementById(wrapperID);
    target.addEventListener(MOVE_EV, function(e){
        e.preventDefault();
    });
}

/* EG Swipe : Swipe 체킹
만든이 : eung kim 
생성일 : 2014.11.19
사용예 : 
var scheck = $("#lMenu").egSwipe(function(dir){
    if(!dir){ //true:오른쪽방향, false:왼쪽방향
            
    }
});
*/

(function($){
	$.fn.egSwipe = function(upFnc){
        var target = document.getElementById($(this).attr("id")),
            check = false,
            dragDir = 2, //드래그방향 : 0 - 왼쪽 , 1 - 오른쪽, 2 - 제자리
            DOWNY,
            DOWNX,
            dragDist = 0;
        target.addEventListener(DOWN_EV, mDown);
        target.addEventListener(MOVE_EV, mMove);
        target.addEventListener(UP_EV, mUp);
        
		function mDown(e){
            check = true;
            dragDist = 0;
            var point = hasTouch ? e.touches[0] : e;		
            DOWNY = point.clientY;
            DOWNX = point.clientX;            
		}
        
		function mMove(e){
            if(check){
                var point = hasTouch ? e.touches[0] : e;
                if(Math.abs(point.clientY - DOWNY) < Math.abs(point.clientX - DOWNX)){
                    dragDist = point.clientX - DOWNX;
                }
            }
		}        
		function mUp(e){
			check = false;            
            if(Math.abs(dragDist) > 50){
				if(dragDist > 0){
					dragDir = 1;
				}else{
					dragDir = 0;
				}
                upFnc(dragDir); //0왼쪽, 1 오른쪽 
			}else{
				dragDir = 2;
			}		
		}		
        
		return {
            off:function(){ //이벤트 제거 
                target.removeEventListener(DOWN_EV, mDown);
                target.removeEventListener(MOVE_EV, mMove);
                target.removeEventListener(UP_EV, mUp);
            }            
		};		
	}
})(jQuery)     
