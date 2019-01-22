// ios 인지 여부
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// 네이버 앱 내 브라우저인지 여부를 userAgent 로 확인함. - 네이버 사정에 따라 변경될수 있습니다.
var naverApp = navigator.userAgent.indexOf("NAVER") < 0 ? false : true;

var screenHeight;
var keyboardHeight = 298;

if(screen.height == 568){// iphone4-5
	keyboardHeight = 298;
}

if(screen.height == 667){// iphone6
	keyboardHeight = 298;
}

if(screen.height == 736){// iphone6+
	keyboardHeight = 355;
}

$(document).ready(function(){

	var isFocusInput = false;

	var _version = 2.0;

	var _isDev = false;

	if(_isDev){
		$("#wrapper").append("<div class='console' style='position:fixed; left:0; top:0; z-index:9999; height:200px; overflow:hidden'></div>");
	}

	addConsole( iOS + " " + naverApp + " screen " + screen.height);

	if(naverApp && iOS){

		screenHeight = screen.height;
	}

	var _$head = $("#head"),
		  _$headTitleA = _$head.find("> h1 > a"),
		  _$headLayerInfo = _$head.find("> .layer_info"), 
		  _$headOutbtn = _$head.find("> ul > li.out"), 
		  _$headOutLayer = _$headOutbtn.find(".decorations"), 
		  _$chatInput = $("#chatInput"),
		  _$chat = $("#chat"),
		  _$chatInputNowMsg = _$chatInput.find("> .now_message"),
		  _$chatInputEmtMsg = _$chatInput.find("> .emoticon_message"),
		  _$chatInputEmtMsgView = _$chatInputEmtMsg.find("> a.view"),
		  _$chatInputKeypad = _$chatInput.find("> .keypad_input"),
		  _$chatInputAttachBtn = _$chatInputKeypad.find("> a.attach_btn"),
		  _$chatInputEmtBtn = _$chatInputKeypad.find("> a.emoticon_btn"),
		  _$chatInputTextarea = _$chatInputKeypad.find("> .keypad > textarea"),
		  _$chatInputSendBtn = _$chatInputKeypad.find("> .send > button"),
		  _$chatInputLayer = _$chatInput.find("> .layer_input"),
		  _$chatInputLayerAttach = _$chatInputLayer.find("> .attach"),
		  _$chatInputLayerEmt = _$chatInputLayer.find("> .emoticon"),
		  _$chatInputLayerEmtBtn = _$chatInputLayerEmt.find("ul li a"),
		  _$imgPopThumb = $(".img_pop .thumbnail"),
		  _$prdList = $(".prd_list ul li");

	// 채팅상담 레이어 실행
	function headLayerInfoOn() { 
		_$headTitleA.addClass("on");
		_$headLayerInfo.show();
	}
	function headLayerInfoOff() {
		_$headTitleA.removeClass("on");
		_$headLayerInfo.hide();
	}

	// 채팅상담 타이틀 버튼
	_$headTitleA.on("click", function () {
		if ( $(this).hasClass("on") )
		{ 
			headLayerInfoOff();
			return false;
		} else { 
			headLayerInfoOn();
			return false;
		}
	});

	// 채팅상담 레이어 닫기 버튼
	  _$headLayerInfo.find("> a.close").on("click", function () {
		headLayerInfoOff();
	});

	// 채팅방 나가기
	function headOutLayerClose() {
		_$headOutbtn.removeClass("on");
	}

	// 채팅방 나가기 레이어 닫기
	 _$headOutLayer.find("a.close").on("click", function () {
		headOutLayerClose();
	});

	// 채팅시작
	/*
	function onLineStart() {emoticonLayerOn
	  setTimeout( headOutLayerClose, 3000); 
	}onLineStart();
	*/

	// 첨부파일 레이어 실행
	function attachLayerOn() {
		_$chatInputAttachBtn.addClass("on");
		_$chatInputLayerAttach.show();
		_$chat.css( "bottom" ,  _$chatInputLayer.height() ); // 20151116 추가
	}
	function attachLayerOff() {
		_$chatInputAttachBtn.removeClass("on");
		_$chatInputLayerAttach.hide();
		_$chat.css( "bottom" ,  "" ); // 20151116 추가
	}

	// 이모티콘 레이어 실행
	function emoticonLayerOn() {
		_$chatInputEmtBtn.addClass("on");
		_$chatInputLayerEmt.show();
		_$chat.css( "bottom" ,  _$chatInputLayer.height() ); // 20151116 추가
	}
	function emoticonLayerOff() {
		_$chatInputEmtBtn.removeClass("on");
		_$chatInputLayerEmt.hide();
		_$chat.css( "bottom" ,  "" ); // 20151116 추가
	}

	// 첨부파일 클릭
	_$chatInputAttachBtn.on("click", function () {
		emoticonLayerOff();
		_$chatInputEmtMsg.find("> a.close").trigger("click"); // 20151120 추가
		if ( $(this).hasClass("on") )
		{
			attachLayerOff();
			return false;
		} else {
			attachLayerOn();
			return false;
		}
	});

	// 이모티콘 버튼 클릭
	_$chatInputEmtBtn.on("click", function () {
		attachLayerOff();
		if ( $(this).hasClass("on") )
		{
			emoticonLayerOff();
			_$chatInputEmtMsg.find("> a.close").trigger("click"); // 20151124 추가
			return false;
		} else {
			emoticonLayerOn();
			return false;
		}
	});

	// 이모티콘 리스트 선택
	_$chatInputLayerEmtBtn.on("click", function () {
		_$chatInputEmtMsg.show();
		_$chatInputEmtMsgView.empty();
		$(this).find("img").clone().appendTo( _$chatInputEmtMsgView );
		sendBtnActive();
		nowMsgPosition();
	});

	// 이모티콘 레이어 닫기
	_$chatInputEmtMsg.find("> a.close").on("click", function () {
		_$chatInputEmtMsg.hide();
		_$chatInputEmtMsgView.empty();
		sendBtnActive();
		nowMsgPosition();
	});

	
	// 이모티콘 레이어 롤링
	if ( _$chatInputEmtMsg.length > 0)
	{
		//$("#emoticonSlider ul").css("width" , $("#emoticonSlider").parent().width() );
		//$bannerSlide = setEGSlide("#emoticonSlider", function(index){  
		//   $("#emoticonSlider").parent().find("> .page span").removeClass("on").eq(index).addClass("on");  
	//	}, false);
		// resize 페이징 리셋 20151021 추가
		$(window).resize(function(){
			$("#emoticonSlider").parent().find("> .page span").removeClass("on").eq(0).addClass("on"); 
		});
	}
	
	// 20151119 추가 : 새로운글 포지션값 제어 
	function nowMsgPosition() {
		if ( $('#emoticonInfo').val() != "" )
		{
			_$chatInputNowMsg.css( "top" , _$chatInputNowMsg.height() );
		} else {
			_$chatInputNowMsg.css( "top" , "" );

		}
	}

	// 새로운 글
	/*_$chatInputNowMsg.on("click", function () {
		document.body.scrollTop = document.body.scrollHeight;  // 20151120 수정
		$(this).hide();
		nowMsgPosition(); // 20151119 추가
	});*/

	/*_$chatInputTextarea.focusin(function() {
		document.body.scrollTop = document.body.scrollHeight;  
		attachLayerOff();
		emoticonLayerOff();
	});*/
	
	_$chatInputTextarea.focusin(function() {

		isFocusInput = true;

		if(ua_script > -1 && (isAppForTalk_script > -1 || isAppForTalk2_script > -1)){ //앱 && 안드로이드
			//_$chatInput.css( "bottom" ,  "48px" );
			//_$chatInput.css( "margin-bottom" ,  "48px" );
		//	_$chatInput.css( "z-index" ,  "100000000000" );
		}
		addConsole("focusin " + document.body.scrollTop + ", " + document.body.scrollHeight);

		if(naverApp && iOS){
			setTimeout(function(){

				setKeyboardMode();
			}, 200);
		}else{
			setTimeout("$(\"html, body\").animate({scrollTop: 60000}, \"slow\" );",200);
		}

		attachLayerOff();
		emoticonLayerOff();
		//return false;
	});
	
	_$chatInputTextarea.focusout(function() {
		if(ua_script > -1 && (isAppForTalk_script > -1 || isAppForTalk2_script > -1)){ //앱 && 안드로이드
			//_$chatInput.css( "bottom" ,  "0" );
			//_$chatInput.css( "margin-bottom" ,  "0" );
			//return false;
		}
	});
	
	// 키패드 입력에 따른 전송버튼 활성화
	function sendBtnActive() {
		//if ( _$chatInputTextarea.val().trim() != ""  ||  _$chatInputEmtMsgView.find("> img").length > 0 ) {
		if ( _$chatInputTextarea.val().trim() != ""  ||  $('#emoticonInfo').val() != "" ) {
			_$chatInputSendBtn.attr("disabled",false);
		} else {
			if(onceAction){
				_$chatInputSendBtn.attr("disabled",true);
			}else{
				if($("#sendBtn").html() == "전송"){
					_$chatInputSendBtn.attr("disabled",true);
				}
			}
		}
	}

	// 키패드 키업 3줄까지만 처리
	_$chatInputTextarea.css("max-height" , _$chatInputTextarea.height()*3 );

	if(naverApp && iOS){
		_$chatInputTextarea.on("keyup", function (e) { 
			sendBtnActive();
	       		_$chatInputTextarea.css("height" , "auto" );
	       		_$chatInputTextarea.height(this.scrollHeight);
		});
		_$chatInputTextarea.on("blur", function (e) { 
			addConsole("blur");
			isFocusInput = false;
			$("#chatInput").css( { position:"fixed", bottom : 0 } ).show();
			$("#head").css( { position:"fixed", top : 0 } ).show();
		});

		_$chatInputTextarea.keyup();
		
		// 최초로딩시 들어가 있는 포커스 빼기
		setTimeout(function(){ 
			isFocusInput = false;
			$("#chatInput").css( { position:"fixed", bottom : 0 } ).show();
			$("#head").css( { position:"fixed", top : 0 } ).show();
			_$chatInputTextarea.trigger("focusin");
		}, 500);

		setTimeout(function(){ 
			_$chatInputTextarea.trigger("blur");
		}, 1000);

	}else{
		_$chatInputTextarea.on("keyup blur", function (e) { 
			sendBtnActive();
	        		_$chatInputTextarea.css("height" , "auto" );
	        		_$chatInputTextarea.height(this.scrollHeight);
		});

		_$chatInputTextarea.keyup();
	}
	
	$(window).resize(function(){
        _$chatInputTextarea.trigger("keyup blur");
		_$chatInputTextarea.keyup();
		// 20151209 추가 S
		if ( _$chatInputLayerAttach.css("display") == "block" ||  _$chatInputLayerEmt.css("display") == "block" )
		{
			_$chat.css( "bottom" ,  _$chatInputLayer.height() ); 
		}
		// 20151209 추가 E
	});

	// 채팅창 클릭시 키패드 포커스 아웃
	/* 20151203 수정 S */
	_$chat.on("click", function () { 
		_$chatInputTextarea.blur();
		attachLayerOff(); 
		emoticonLayerOff();
		_$chatInputEmtMsg.find("> a.close").trigger("click");
	});
	
	/* 20151203 수정 E */


	// 레이어 닫기 실행
	function layerPopClose() {
		$("#cover, .layer_pop").hide();
	}
	
	// 이미지 팝업 열기
	/*_$chat.find("> .message > .thumbnail img").on("click", function () {
		// 20151120 수정 S 
		_$imgPopThumb.empty();
		$(this).clone().appendTo( _$imgPopThumb );
		$("#cover, .img_pop").show();
		_$imgPopThumb.css( "max-height" , $("body").height() );
		_$imgPopThumb.animate({ scrollTop: 0 }, 0 ); 
		_scrolled = $(window).scrollTop();
		$("body").css({'top':-_scrolled, 'position':'fixed'});
		// 20151120 수정 E 
	});*/
	/*var scrolled = "";
	// 이미지 팝업 닫기
	$(".img_pop a.close").on("click", function () { 
		// 20151120 수정 S 
		layerPopClose();
		$("body").css({'position':'','top':''}); 
		$(document).scrollTop( scrolled ); 
		// 20151120 수정 E
	});*/

	// 팝업 열기
	function layerPopOpen(pop) {
		$(pop).show();
		$(pop).css( "marginTop",  - ( $(pop).height() / 2 ) );

	}

	// 팝업 닫기
	$(".layer_pop > .btn a.cancle").on("click", function () {
		layerPopClose();
	});


	// 상담만족도평가 팝업 열기
	_$chat.find("> .message .satisfaction_btn").on("click", function () {
		$('#cover').show();
		layerPopOpen('.satisfaction_pop');
		satisfactionStar('.satisfaction_pop .satisfaction_score');
	});

	// 추천상품 만족도 팝업
	_$chat.find("> .message .recommand_btn").on("click", function () {
		$('#cover').show();
		layerPopOpen('.recommand_pop');
		satisfactionStar('.recommand_pop .satisfaction_score');
	});


	// 별점주기
	function satisfactionStar(el){
		var _$cont = $(el);

		_$cont.on( "click", "span.score a", function () {
			var idx = $(this).index(),
				target = $(this).closest( "span.score" ).find( "a" );

			target.removeClass( "on" );

			var i;
			for( i = 0; i <= idx; ++i ) {
				target.eq(i).addClass( "on" );
			}

			return false;
		});
	}

	// 장바구니 선택
	/*function prdListReset() {
		_$prdList.removeClass("on");
		_$prdList.find(".blind").remove();
	}
	_$prdList.find("> a").on("click", function () {
		if ( $(this).parent().hasClass("on") == true)
		{
			prdListReset();
			$(".prd_list_btn").html( '<span>선택완료</span>' );
			return false;
		} else {
			prdListReset();
			$(this).parent().addClass("on");
			$(this).append('<div class="blind"></div>');
			$(".prd_list_btn").html( '<a href="#none" onclick="goCartRes();">선택완료</a>' );
			return false;
		}
	});*/
	
	// 채팅서비스 배경처리 - 20151021 추가
	if ( _$chat.length > 0)
	{
		$("body").css( "background" , "#c3def3");
	}

	if(naverApp && iOS){

		$("#chat").on("touchstart", function(){
			console.log("touchstart ");
			if(isFocusInput){

				console.log("2 touchstart ");

				$("#chatInput, #head").hide();
			}else{
				setNormalMode();
			}
		});

		$("#chat").on("touchend", function(){
			console.log("touchend");
			if(isFocusInput){

				setTimeout(function(){ 
					setKeyboardMode();
				}, 200);
			}else{
				setNormalMode();
			}
		});

		setInterval(function(){
			if(isFocusInput){

				setKeyboardMode();
			}else{
				setNormalMode();
			}
		}, 5000);
	}

	function setKeyboardMode(){

		// 1. 하단 네이티브 메뉴 유무에 따른 높이값
		var bottomNative = 0;

		if(screenHeight - $(window).height() > 30){
			bottomNative = 42;// 네이버 앱 하단바 높이 - 네이버 사정으로 변할 수 있음.
		}

		addConsole($(document).height() + ", " + $(document).scrollTop() + ", " + screenHeight + ", " + $(window).height() + ", " + bottomNative);

		// 2. input area 의 document 상에서의 하단 margin
		var bottomMargin = $(document).height()  - ( $(document).scrollTop() + screenHeight  ) + ( keyboardHeight  - bottomNative );
		
		// 3. bottom css를  적용하게될 맨 끝 위치 : document 높이 - window 높이
		var startY = $(document).height() - screenHeight;

		$("#chatInput").css( { position:"absolute", bottom : -1 * ( startY  - bottomMargin )+ "px" } ).show();
		$("#head").css( { position:"absolute", top : 0 } ).show();
	}

	function setNormalMode(){
		$("#chatInput").css( { position:"fixed", bottom : 0 } );
		$("#head").css( { position:"fixed", top : 0 } );
	}

	function addConsole(str){
		if(_isDev){
			$("#wrapper .console").append("<span style='display:block'>v" + _version + " " + str + "</span>");
		}
		console.log(str);
	}


	/*
	* 티클릭 수집을 위한 와이즈로그 스크립트 추가(작업자 : 김낙운)
	* 해당스크립트는 html_meta_angular.jsp 에 있는 스크립트로 현재 페이지는 angular가 아니여서 수동 호출
	* 추후 ga스크립트로 변환시에는 삭제 필요
	*/
	var nl = document.createElement('script'); nl.type = 'text/javascript';
	nl.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'm.lotte.com/common4/js/lib/wl6.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(nl, s);
	var done = false;
	nl.onload = nl.onreadystatechange = function() {
		if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
			done = true;
			_n_sid = "m.lotte.com";
			_n_uid_cookie = "MBRNO";
			n_logging();
			nl.onload = nl.onreadystatechange = null;
		}
    }
    
    // 2018-02-05 닷컴/슈퍼 앱통합 앱 권한 체크를 위한 추가
    function setAppPermission() {
        var appUA = navigator.userAgent.match(/mlotte00[\d]\/[\d\.]*/);
        var appVerNum = appUA != null ? parseInt((appUA[0] + "").replace(/(mlotte00[\d]\/)|(\.)/g, "")): 0;

        if (iOS && appVerNum >= 4000) {
            window.iosAppPermissionMediaChk = false;
            window.iosAppPermissionCameraChk = false; // 카메라 접근 권한
            window.iosAppPermissionType = null;

            // iOS 권한체크 이후 Callback App -> Web
            window.responsePermision = function (result) {
                console.log("iOS 권한체크 완료");

                if (result) {
                    if (window.iosAppPermissionType == "camera") {
                        window.iosAppPermissionCameraChk = result;
                    } else {
                        window.iosAppPermissionMediaChk = result;
                    }

                    if (window.iosAppPermissionType == "photo") {
                        $("#fileAttach").click();
                    } else if (window.iosAppPermissionType == "media") {
                        $("#fileAttach2").click();
                    } else if (window.iosAppPermissionType == "camera") {
                        $("#fileAttach3").click();
                    }
                }

                window.iosAppPermissionType = null;
            };

            // 사진 버튼 선택
            $("#fileAttach").on("click", function (event) {
                if (!window.iosAppPermissionMediaChk) {
                    event.preventDefault(); // iOS 권한체크 선행을 위한 이벤트 중지
                    event.stopPropagation();
    
                    window.iosAppPermissionType = "photo";
                    location.href = "lottebridge://queryPermission?action=media";
                }
            });

            // 동영상 버튼 선택
            $("#fileAttach2").on("click", function (event) {
                if (!window.iosAppPermissionMediaChk) {
                    event.preventDefault(); // iOS 권한체크 선행을 위한 이벤트 중지
                    event.stopPropagation();
    
                    window.iosAppPermissionType = "media";
                    location.href = "lottebridge://queryPermission?action=media";
                }
            });

            // 카메라 버튼 선택
            $("#fileAttach3").on("click", function (event) {
                if (!window.iosAppPermissionCameraChk) {
                    event.preventDefault(); // iOS 권한체크 선행을 위한 이벤트 중지
                    event.stopPropagation();
    
                    window.iosAppPermissionType = "camera";
                    location.href = "lottebridge://queryPermission?action=camera";
                }
            });
        }
    }

    setAppPermission(); // 앱 버전 체크하여 iOS 권한 요청 추가
});

