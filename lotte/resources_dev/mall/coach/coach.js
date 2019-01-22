(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        //'lotteSideMylotte',
       	'lotteCommFooter'
    ]);

    app.controller('CoachMainCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "코치전문몰"; //서브헤더 타이틀
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mall/coach/coach_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

    app.directive( 'iframeAutoHeight', [ '$timeout', function($timeout){
		return {
			link : function( scope, el ) {
					
					var frmPage, 
							frmWindow, 
							frmReload = false, 
							frameWidth, 
							host = location.hostname,
							frameh = 0,
							initFlag = false,
							intFrameInterval,
							scrollTopInterval = 0;
						
					function iframeInit(){
						frmPage = el[0];
						frmWindow = frmPage.contentWindow;
						frmPage.height = "auto";
						
						el.attr('onLoad', 'angular.element(this).scope().iframeOnLoaded()');
						
						window.onmessage = onmessage;
						sendMessage();
						window.onload = sendMessage;
						frameWidth = window.innerWidth;
					}
					function sendMessage(){
						frmWindow.postMessage(host,'*');
					}
						
					scope.iframeOnLoaded = function() {
						sendMessage();
					}
					function onmessage(e){
						if (e.data.type==="coach") {
							frmPage.height  = "auto";
							setTimeout(function(){frmPage.height  = e.data.height+"px"; },1000);
							clearTimeout(scrollTopInterval);
							scrollTopInterval = setTimeout(function(){
								window.scrollTo(0,0);
							},1000);
							frameh = e.data.height;
						}
					}
					
					el.attr('scrolling', 'no');
					el.attr('frameborder', '0');
					$timeout(iframeInit);
			}
		}
	}]);

})(window, window.angular);