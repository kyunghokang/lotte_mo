(function(window, angular, undefined) {
	'use strict';

	var videoModule = angular.module('lotteVideo', []);

	videoModule.controller('LotteVideoCtrl', ["$scope", function ($scope) {
	}]);

	videoModule.directive('lotteVideo', ['$window', '$timeout', 'LotteUtil', function ($window, $timeout, LotteUtil) {
		return {
			controller: "LotteVideoCtrl",
			link: function ($scope, el, attrs, ctrl) {
				$scope.movMode = 0; // 비디오 컨트롤 모드 {0: 재생전, 1: 재생중-컨트롤보임, 2: 재생중-컨트롤가림}
				$scope.mute = false; // 음소거 여부
				var src = attrs.lvSrc; // 동영상 경로
				var url = attrs.lvDetailUrl; // 상세화면 링크 경로
				var noAlert = attrs.lvNoAlert; // 상세화면 링크 경로
				var poster = attrs.lvPoster; // 포스터 경로
				var elVideo = angular.element(el).find('video')[0]; // video tag element
				var btnHideTime = attrs.lvTime || 2000; // 페이드아웃 애니메이션 타임
						
				elVideo.setAttribute('poster', poster); // 포스터 적용
				elVideo.addEventListener("ended", resetVideo, false); // 동영상 end 이벤트
					
                /**
                 * 박해원 20171121 [이탈방지팝업]
                 * 비디오 재생,정지 상태값 이탈방지 팝업 서비스에 전달
                 */
                var videoEvent = {
                    play:function(){
                        // 2번째 인자값을 넘기면 hwVideo정지
                        window.videoStateModel.setPlay(true,String(Math.random()*9999999));
                    },
                    pause:function(){
                        window.videoStateModel.setPlay(false);
                    }
                };
                elVideo.addEventListener("play", videoEvent.play, false);
                elVideo.addEventListener("pause", videoEvent.pause, false);
				/* [end] 20171121 [이탈방지팝업] */
                
				var rScope = LotteUtil.getAbsScope($scope);
				
				function resetVideo(){
					elVideo.src=''; // 비디오 src 비우기
					$timeout(function(){ 
							elVideo.src = src; // 비디오 src 가져와서 셋팅하기 
						},300);
					if(!rScope.appObj.isIOS) elVideo.removeAttribute("controls");
					$scope.movMode = 0;
					$scope.$apply();
				}
				$scope.playVideo = function (){
					if (noAlert || confirm("3G/LTE에서 재생시 데이터 요금이 부과할 수 있으니 유의하세요~")) {
						var prevId = angular.element(document.body).data('play_video') || '';
						if(prevId){
							var prevEl = angular.element('#'+prevId);
							if(prevEl && prevEl.length > 0){
								prevEl[0].pause();
								var scope = prevEl.scope();
								scope.movMode = 0;
							}
						}
						$scope.movMode = 1;
						if(!elVideo.src)	elVideo.src = src;
						elVideo.play(); // 재생 시작
						angular.element(document.body).data('play_video', angular.element(elVideo).attr('id'));

						$timeout(function() {
							if($scope.movMode == 1){
								$(el).find('.btns').fadeOut(600, function(){
									$scope.movMode = 2;
									$(this).attr('style', '');
									$scope.$apply();
								});
							}
						},btnHideTime);
					}
				};
				$scope.clickCover = function(){
					$scope.movMode = 1;
					$timeout(function() {
						if($scope.movMode == 1){
							$(el).find('.btns').fadeOut(600, function(){
								$scope.movMode = 2;
								$(this).attr('style', '');
								$scope.$apply();
							});
						}
					},btnHideTime);
				};
				$scope.stopVideo = function(){
					elVideo.pause();
					$scope.movMode = 0;
				};
				$scope.muteVideo = function(){
					if (elVideo.muted){
						$scope.mute = false;
						elVideo.muted=false; // 비음소거
					}else{
						$scope.mute = true;
						elVideo.muted=true; // 음소거
					}
				};
				$scope.fullVideo = function(){
		        	if(elVideo.requestFullscreen){
		        		elVideo.requestFullscreen();
					}else if(elVideo.mozRequestFullScreen){
						elVideo.mozRequestFullScreen();
					}else if(elVideo.webkitRequestFullscreen){
						elVideo.webkitRequestFullscreen();
					}else if(elVideo.webkitEnterFullscreen){
						elVideo.webkitEnterFullscreen();
					}
		        	if(!rScope.appObj.isIOS)	elVideo.setAttribute("controls","controls");
				};
				$scope.goDetailPage = function(){
					location.href = url;
				};
				
				angular.element(el).find('video').bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
			        var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
			        var event = state ? 'FullscreenOn' : 'FullscreenOff';
					//console.log('Event: ' + event);    
			        if(event == 'FullscreenOff'){
			        	$scope.stopVideo();
			        	if(!rScope.appObj.isIOS)	elVideo.removeAttribute("controls");
						$scope.$apply();
			        }
			    });
			}
		};
	}]);

})(window, window.angular);