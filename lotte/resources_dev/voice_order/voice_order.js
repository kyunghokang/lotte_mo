(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteUtil',
        'lotteSideCtg',
        'lotteSns',
        'lotteCommFooter'
    ]);

	app.controller('voiceOrderCtrl', [
					'$http', '$scope', 'LotteCommon', '$timeout', 'LotteLink', 'LotteGA',
			function($http,   $scope,   LotteCommon,   $timeout,   LotteLink,   LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "말로 하는 쇼핑 소개"; // 서브헤더 타이틀
        $scope.screenID = "음성주문 소개"; // 스크린 아이디 
         
        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
        	}
        	$scope.screenData = {
        		page: 0,
        		pageSize: 20,
        		pageEnd: false,
                slideNum: 0,
                mpOs: '',
                mpMsg: '' 
        	}
        })();

        //자동 이미지 슬라이더
        $scope.voiceSlider = function() {

            $scope.prodName = ['"립스틱"','"생수"','"쿠폰"'];

            setInterval(function(){
                $scope.voImg = angular.element('.voice_top_prod_img').find('li');

                $scope.voImg.eq($scope.screenData.slideNum-1).fadeOut(500);
                $scope.voImg.eq($scope.screenData.slideNum).fadeIn(500);
                angular.element('#prod_name').text($scope.prodName[$scope.screenData.slideNum]);
                $scope.screenData.slideNum++;

                if($scope.screenData.slideNum == $scope.voImg.length){
                    $scope.screenData.slideNum = 0;
                }
            },3000);
        }();

        //이미지 슬라이더 가변사이즈 조절
        $scope.slideSize = function() {
            $scope.slWidth = angular.element('.voice_top_prod_img').width();

            return Math.round($scope.slWidth);
        }

        //앱 || 웹 구분(각각 이미지 리턴) 
        $scope.mpBtnCheck = function() {
            if($scope.appObj.isApp){
                return 'http://image.lotte.com/lotte/images/voice_btn_02.png'
            }else{
                return 'http://image.lotte.com/lotte/images/voice_btn_01.png'
            }
        }

        //음성주문 플로팅버튼기능
        $scope.mpVoiceStart = function() {
            //var nav_chk = 'Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Mobile Safari/537.36'
            var nav_chk = navigator.userAgent;

            if(nav_chk.match(/Android/)){
                var index = nav_chk.indexOf('Android');

                if(Number(nav_chk.substr(index+8,3)) < 4.5){
                    alert('안드로이드 4.4.0 이하 버전은 음성주문 이용이 불가합니다.');
                    return false;
                }else{
                    $scope.mpVoiceCheck();
                }
            }else{
                $scope.mpVoiceCheck()
            }
        };
        
        $scope.aniScrollTo = function(el, id, duration){
        	
        	var element = el || document.documentElement;
        	var to  = document.getElementById(id).offsetTop - 20;
        	var body = $("html, body");
        	body.stop().animate({scrollTop:to}, 500, 'swing', function() { 
        	 // console.log(to);
        	});
        };
        
		function getAndroidVersion(ua) {
		    ua = (ua || navigator.userAgent).toLowerCase(); 
		    var match = ua.match(/android\s([0-9\.]*)/);
		    return match ? match[1] : false;
		}

		$scope.mpVoiceCheck = function(){
			//이벤트 카테고리 : APP_샬롯_소개페이지, 이벤트 액션 : 이동버튼, 이벤트 라벨 : 이동버튼
			var ctg = "MO_샬롯_소개페이지";
			if($scope.appObj.isApp){
				ctg = "APP_샬롯_소개페이지";
			}
			LotteGA.evtTag(ctg, "이동버튼", "이동버튼");
			
			var needUpdate = false;
			var ao = $scope.appObj;
			
			if(ao.isApp){
				// os 제한
				var isOldAndroid = false;
				if(ao.isAndroid){
					try{
						var num = parseFloat(getAndroidVersion()); //4.4
						if(num <= 4.4){
							isOldAndroid = true;
						}
					}catch(e){}
					
					if(isOldAndroid){
						alert('안드로이드 4.4이하 버전은\n이용이 불가합니다.');
						return;
					}
				}
				
				// app
				/*var MBRNO = $scope.loginInfo.mbrNo;
				if(!$scope.isValidString(MBRNO)){
					var path = encodeURIComponent( LotteCommon.talkShopUrl + "?" + $scope.baseParam );
					$scope.gotoService("loginUrl", {targetUrl : path});
					return;
				}*/
					
				if(ao.isIOS){
					if(ao.verNumber < 4090){
						needUpdate = true;
					}
				}else{
					if(ao.verNumber < 412){
						needUpdate = true;
					}
				}
				
				if(needUpdate){
					// 음성주문 이전 구버전
					var msg = "앱 업데이트를 통해서<br/>24시간 다양한 상품을 추천받고<br/>말로 쉽고 빠르게 주문해보세요.";
					var obj = {
						"label" : {
							"ok" : "확인",
							"cancel" : "취소"
						},
						"callback" : function(rtn){
							if(rtn){
								if(ao.isIOS){
									location.href = "http://itunes.apple.com/app/id376622474?mt=8";
								}else{
									location.href = "market://details?id=com.lotte";
								}
							}
						}
					}
					$scope.confirm_2016(msg, obj);
				}else{
					try{
						if(ao.isIOS){
							location.href = "talkshop://voiceChat_Permission";
						}else{
							window.lottebridge.voiceChat_Permission();
						}
					}catch(e){}
				}
				
			}else{
				// web
				var path = LotteCommon["mainUrl"];
				LotteLink.appDeepLink("lotte", path, "", "");//, tc, null);
			}
        };
    }]);

    app.directive('lotteContainer', ['$window', '$timeout', function($window, $timeout) {
        return {
            templateUrl : '/lotte/resources_dev/voice_order/voice_order_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
            	var arrEl = [
        			{
        				el: '.section_wrap.recomm .ani_wrap .balloon',
        				top: 300,
        				show: false
        			},
        			{
        				el: '.section_wrap.voice .ani_wrap .balloon',
        				top: 1050,
        				show: false
        			},
        			{
        				el: '.section_wrap.page .ani_wrap .balloon',
        				top: 1600,
        				show: false
        			},
        			{
        				el: '.section_wrap.page2 .ani_wrap .balloon',
        				top: 2000,
        				show: false
        			}
        		];
            	
          	$timeout(function(){
            		$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
                		
                		//console.log('top ' + $(arrEl[1].el).offset().top);
                		//console.log('args.scrollPos ' + args.scrollPos);
                		for(var i = 0; i<arrEl.length; i++){
                			if (args.scrollPos > arrEl[i].top && !arrEl[i].show) {
                				arrEl[i].show = true;
                				startAni(i);
        					}
                		}
    				});3
          		window.scrollBy(0, 2);
          	}, 500);


            	function startAni(idx){
            		if(idx === 0){
            			//console.log('ani1');
            			$(arrEl[idx].el).fadeIn();
            			$('.section_wrap.recomm .ani_wrap .sub_text').fadeIn();
                		$timeout(function(){
                			$(arrEl[idx].el).fadeOut('slow');
                			$('.section_wrap.recomm .ani_wrap .balloon2').fadeIn();
                			$timeout(function(){
                				$('.section_wrap.recomm .ani_wrap .sub_text').fadeOut();
                				$('.section_wrap.recomm .ani_wrap .balloon2').fadeOut();
                				$timeout(function(){
                						$('.section_wrap.recomm .ani_wrap .sub_text2').fadeIn('slow');
                						$(".section_wrap.recomm .ani_wrap .slide").show().animate({ 'margin-left': '-110px'}, 300);
                    				$(".section_wrap.recomm .ani_wrap .slide2").show().animate({ 'margin-left': '50px'}, 500);
                    			}, 300);
                			}, 600);
                		}, 900);
            		}else if(idx === 1){
            			//console.log('ani2');
            			$(arrEl[idx].el).fadeIn();
            			$('.section_wrap.voice .indicator.prev').fadeOut();
            			$('.section_wrap.voice .indicator.curr').fadeIn();
                		$timeout(function(){
                			$(arrEl[idx].el).fadeOut('slow');
                			$('.section_wrap.voice .ani_wrap .sub_img').fadeOut();
                			$timeout(function(){
                				$('.section_wrap.voice .ani_wrap .sub_text').fadeIn('slow');	
		                		$(".section_wrap.voice .ani_wrap .slide").show().animate({ 'margin-left': '-110px'}, 300);
			                	$(".section_wrap.voice .ani_wrap .slide2").show().animate({ 'margin-left': '50px'}, 500);	
                			}, 400);
                		}, 900);
            		}else if(idx === 2){
            			//console.log('ani3');
            			$(arrEl[idx].el).fadeIn();
            			$('.section_wrap.page .indicator.prev').fadeOut();
            			$('.section_wrap.page .indicator.curr').fadeIn();
                		$timeout(function(){
                			$('.section_wrap.page .ani_wrap .sub_text').fadeIn();	
                			$timeout(function(){
                				$('.section_wrap.page .ani_wrap .slide').show().animate({ 'margin-left': '-106px', 'opacity': '1' },300);
                				$('.section_wrap.page .ani_wrap .slide2').show().animate({ 'margin-left': '-106px', 'opacity': '1' },500);
                			}, 400);
                		}, 800);
            		}else if (idx === 3) {
            			$(arrEl[idx].el).fadeIn();
            			$('.section_wrap.page2 .indicator.prev').fadeOut();
            			$('.section_wrap.page2 .indicator.curr').fadeIn();
                		$timeout(function(){
                			$('.section_wrap.page2 .ani_wrap .sub_text').fadeIn();	
                			$timeout(function(){
                				$('.section_wrap.page2 .ani_wrap .slide').show().animate({ 'margin-left': '-106px', 'opacity': '1' },300);
                				$('.section_wrap.page2 .ani_wrap .slide2').show().animate({ 'margin-left': '-106px', 'opacity': '1' },500);
                			}, 400);
                		}, 800);
            		}
            	}
            }
        };
    }]);

})(window, window.angular);