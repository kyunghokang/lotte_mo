  //lnb
$(function(){
  $('.lnb_open').click(function(){
    $('.left_nav_wrap').addClass('on')
    $('.dim').addClass('on')
  });
    $('.depth1_link').click(function(){
      var tab_id = $(this).attr('data-tab');
      if($(this).hasClass('on')){
        $(this).removeClass('on');
        $('#' + tab_id).hide('fast');
      }else{
        $(this).addClass('on')
        $('#' + tab_id).show('fast');
      };
    });

    $('.history_tab li').click(function(){
      var tab_id = $(this).attr('data-tab');
      if($(this).hasClass('on')){
        // $(this).removeClass('on');
        // $('#' + tab_id).hide('fast');
      }else{
        $('.history_tab li').removeClass('on')
        $('.history_wrap').hide();
        $(this).addClass('on')
        $('#' + tab_id).show();
      };
    });

  $('.btn_close').click(function(){
    $('.left_nav_wrap').removeClass('on')
    $('.dim').removeClass('on')
  })
})

/* 동영상재생 */
    function autoVideoPlay(videoById){
    var videoJavaId = document.getElementById(videoById),
      videoId = $('#'+videoById);

     var videoPlayBtn = videoId.siblings('.btn_move_start'),
      videoStopBtn = videoId.siblings('.btn_move_stop'),
      stopCover = videoId.siblings('.stop_cover'),
      startCover = videoId.siblings('.play_cover'),
      clickCover = videoId.siblings('.click_cover'),
      btnHideTime = 2000,
      autoIngFlag = false,
      firstSetupFlag = true,
      confirmCheckFlag =false,
      videoCurrentSrc = videoId.get(0).currentSrc;

    videoJavaId.addEventListener("ended", resetVideo, false);

    function resetVideo() {
      videoJavaId.src='';
      videoJavaId.src = videoCurrentSrc;

      clickCover.hide();
      startCover.show();
      videoPlayBtn.show();
    }
    videoPlayBtn.bind('click',function(e) {
      if (confirm("3G/LTE에서 재생시 데이터 요금이 부과할 수 있으니 유의하세요~")) {
        confirmCheckFlag = true;
        startCover.hide();
        stopCover.show();
        videoJavaId.play();
        videoPlayBtn.hide();
        videoStopBtn.show();
        setTimeout(function() {
          videoStopBtn.stop().fadeOut();
          stopCover.stop().fadeOut();
          clickCover.show();
          },btnHideTime);
      }
      return false;
    });
    videoStopBtn.bind('click',function(e) {
      videoJavaId.pause();
      videoStopBtn.hide();
      videoPlayBtn.show();
      stopCover.hide();
      startCover.show();
      clickCover.hide();
      return false;
    });

    clickCover.bind('click', function(e) {
      clickCover.show();
      stopCover.show();
      videoStopBtn.show();
      setTimeout(function() {
        videoStopBtn.stop().fadeOut();
        stopCover.stop().fadeOut();
      },btnHideTime);
      return false;
    });
    videoPlayBtn.stop().show();
  }

//앱링크
// var userInfo = window.navigator.userAgent;
// var isIphone = userInfo.indexOf('iPhone');
// var isIpad = userInfo.indexOf('iPad');
// var isAndroid = userInfo.indexOf('android');
/**
 * APP 링크 (APP이 없을 경우 마켓으로 이동)
 */
var lotteApp = {
  /* isApp: false, //브라우저가 아닌 앱으로 접속했는지 여부. 현재 사용안함 */

  scheme: '',
  appStoreUrl: '',
  init : function (who) {
    console.log(isIphone)
    switch (who) {
      case 'lotte':
        if (isAndroid) {
          this.scheme = 'intent://m.lotte.com/main.do?cn=23&cdn=537217#Intent;scheme=mlotte001;action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;category=android.intent.category.BROWSABLE;package=com.lotte;end';
        } else if (isIphone) {
          this.scheme = 'mlotte001://m.lotte.com/main.do?cn=23&cdn=537217';
          this.appStoreUrl = 'http://itunes.apple.com/app/id376622474?mt=8';
        } else if (isIpad) {
          this.scheme = 'mlotte003://m.lotte.com/main.do?cn=145524&cdn=2911590';
          this.appStoreUrl = 'http://itunes.apple.com/app/id447799601?&mt=8';
        }
        break;
      case 'ellotte':
        if (isAndroid) {
          this.scheme = 'intent://m.ellotte.com/main.do?cn=152726&cdn=3112669#Intent;scheme=ellotte002;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.ellotte;end';
        } else if (isIphone || isIpad) {
          this.scheme = 'ellotte001://m.ellotte.com/main.do?cn=152726&cdn=3112669';
          this.appStoreUrl = 'http://itunes.apple.com/kr/app/id902962633?mt=8';
        }
        break;
      case 'smp':
        if (isAndroid) {
          this.scheme = 'intent://m.lotte.com/main_smp.do?cn=116824&cdn=601848&smp_yn=Y#Intent;scheme=splotte002a;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.smartpick2a;end'
        } else if (isIphone || isIpad) {
          this.scheme = 'splotte001://m.lotte.com/main_smp.do?cn=116824&cdn=601848&smp_yn=Y';
          this.appStoreUrl = 'https://itunes.apple.com/app/id483508898';
        }
        break;
      case 'lottedfs':
        if (isAndroid) {
          this.scheme = 'intent://chindex#Intent;scheme=lottedutyfree;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.lottedutyfree;end';
        } else if (isIphone || isIpad) {
          this.scheme = 'lottedfs://m.lottedfs.com/handler/Index?CHANNEL_CD=303396';
          this.appStoreUrl = 'https://itunes.apple.com/app/losdemyeonsejeom/id492083651?mt=8';
        }
        break;
      case 'lottesuper':
        if (isAndroid) {
          this.scheme = 'intent://order?redirect=http://m.lottesuper.co.kr/handler/Index-Start?CHL_NO=M385701&AFCR_NO=110682#Intent;scheme=lottesuper;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lottesuper.mobile;end';
        } else if (isIphone || isIpad) {
          this.scheme = 'lottesuper://order?redirect=http://m.lottesuper.co.kr/handler/Index-Start?CHL_NO=M385701&AFCR_NO=110682';
          this.appStoreUrl = 'https://itunes.apple.com/app/losdemobailsyupeo/id618095243?mt=8';
        }
      break;
    }
  },
  getIframe: function (id, url) {
    var iframe = document.getElementById(id);

    if (iframe !== null) {
      iframe.parentNode.removeChild(iframe);
    }

    iframe = document.createElement('iframe');
    iframe.id = id;
    iframe.style.visibility = 'hidden';
    iframe.style.display = 'none';
    iframe.src = url;

    return iframe;
  },
  exec: function (who, url) {
    this.init(who);

    if (who == "uniqlo") { // 유니클로일 경우 예외처리
      goOutLink(url); // 웹으로 연결 (새창)
      return false;
    }

    if (isAndroid) { // 안드로이드
      window.location.href = this.scheme;
    } else if (isIphone || isIpad) { // IOS
      var url = this.appStoreUrl;

      setTimeout(function () {
        window.location = url;
      }, 500);

      var iframe = this.getIframe("lotteAppIframe", this.scheme);
      document.body.appendChild(iframe);
    } else { // 그 외 단말기
      //outLink(url); // 웹으로 연결
      goOutLink(url); // 웹으로 연결 (새창)
    }
  }
};

// 계열사 앱 링크
var appLink = function (appName, linkUrl) {
  lotteApp.exec(appName, linkUrl);
};

/*Device check*/
var isIOS = (/ipad|iphone/i.test(navigator.userAgent.toLowerCase())),
	isIphone = (navigator.userAgent.match('iPhone') != null),
	isIpad = (navigator.userAgent.match('iPad') != null),
	isAndroid = (navigator.userAgent.match('Android') != null)
// 외부 링크일 경우 APP일 경우에는 앱 스키마 호출, 웹일 경우 window open으로 새창을 띄워준다.
var goOutLink = function(url, mallType) {

    var linkURL = url + "";

    if (!linkURL.match(/http|https/gi)) {
      linkURL = "http://" + linkURL;
    }
    window.open(linkURL);

};


function payScrollView(index){
    var li_num3 = [0];
    var li_num5 = 0;
    $('.slide_ul li').each(function(index){
      li_num3.push($(this).outerWidth());
      var li_num4 = li_num5 += $(this).outerWidth();
    })
   var idx = index;
   var idx2 = (index + 1);
   var ctg3 = li_num3;
   var windowwidth = $(window).width();
   var windowwidthhalf = windowwidth / 2;
   var elwidth = ctg3[idx2];
   var elwidthHalf = elwidth / 2;
   var leftTotal = 15;
   for (var i = 0; i <= idx; i++) {
     leftTotal += (ctg3[i] + 5);
   }
   var offset = leftTotal - (windowwidthhalf - elwidthHalf);
   // console.log(windowwidthhalf)
   // console.log(elwidthHalf)
   $(".menu_list").animate({scrollLeft: offset}, 'slow')

 }

// navi
// $(function(){
//   $('.slide_li_a').click(function(){
//     $('.navi_cont')hide();
//     var tab_id = $(this).attr('data-tab');
//     if($(this).hasClass('on')){
//       $(this).removeClass('on');
//       $('#' + tab_id).hide('fast');
//     }else{
//       $(this).addClass('on')
//       $('#' + tab_id).show('fast');
//     };
//   });

    // $('.history_tab li').click(function(){
    //   var tab_id = $(this).attr('data-tab');
    //   if($(this).hasClass('on')){
    //     // $(this).removeClass('on');
    //     // $('#' + tab_id).hide('fast');
    //   }else{
    //     $('.history_tab li').removeClass('on')
    //     $('.history_wrap').hide();
    //     $(this).addClass('on')
    //     $('#' + tab_id).show();
    //   };
    // });

// })
// byte 체크
var fnChkByte = function(obj, maxByte){
	var str = obj.value;
	var str_len = str.length;

	var rbyte = 0;
	var rlen = 0;
	var one_char = "";
	var str2 = "";

	for(var i=0; i<str_len; i++){
		one_char = str.charAt(i);
		if(escape(one_char).length > 4){
		    rbyte += 3;                                         //한글3Byte
		}else{
		    rbyte++;                                            //영문 등 나머지 1Byte
		}

		if(rbyte <= maxByte){
		    rlen = i+1;                                          //return할 문자열 갯수
		}
	}

	if(rbyte > maxByte){
	    alert("한글 "+(Math.floor(maxByte/3))+"자 / 영문 "+maxByte+"자를 초과 입력할 수 없습니다.");
	    str2 = str.substr(0,rlen);                                  //문자열 자르기
	    obj.value = str2;
	    fnChkByte(obj, maxByte);
	}else{
	    document.getElementById('byteInfo').innerText = '※' + rbyte + '/2000byte 작성가능';
	}
};

$(document).ready(function(){
  //파일첨부
  $('.file_type1').change(function(){
  	var file = $(this)[0].files[0].name;
  	$(this).closest('.addfile_wrap').find('.preview_file_info').append(file);
  });

  //비밀번호
  $('#this_password').focusout(function(e){
    var this_length = e.currentTarget.value.length;
    if(this_length < 1){return false;}
    if(this_length < 4){alert('비밀번호를 4글자 이상 10글자 이하로 입력해주세요.')}
  });
  $('#this_password').keyup(function(e){
    var this_length = e.currentTarget.value.length;
    if(this_length > 10){alert('비밀번호를 4글자 이상 10글자 이하로 입력해주세요.')}
  });

  //팝업 닫기
  $('.close_pop').click(function(){
    $('.popup_line').hide();
    $('.bg_dim').hide();
    $('html, body').css('overflow', 'visible');
  })
})

//팝업
var open_pop1 = function(e){
  var match_id = 'pop_type' + e;
    $('#'+ match_id).show();
    $('.bg_dim').show();
    // if(e == 2){
    //   $('html, body').css('overflow', 'hidden');
    // }

};

//메인 헤더 메인슬라이드
$(document).ready(function(){
	var li_num3 = [];
	var li_num5 = 0;
	$('.slide_ul li').each(function(index){
		li_num3.push($(this).outerWidth());
		var li_num4 = li_num5 += $(this).outerWidth();
		$('.slide_ul').width(li_num4 + 40);
	})

	$('.slide_ul li a').click(function(){
		var tab_id = $(this).attr('data-tab');
		if($(this).closest('li').hasClass('on')){
			$('.slide_ul li').removeClass('on');
			$('.navi_cont').hide();
		}
		else{
			$('.slide_ul li').removeClass('on');
			$('.navi_cont').hide();
			$(this).closest('li').addClass('on');
			$('#' + tab_id).show();
		}
	});
	$('.close_navi').click(function(){
		$('.navi_cont').hide();
		$('.slide_li').removeClass('on');
	});
});
