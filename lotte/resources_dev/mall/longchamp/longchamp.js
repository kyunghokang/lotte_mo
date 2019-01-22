(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        //'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('LongchampMainCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "롱샴"; //서브헤더 타이틀
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mall/longchamp/longchamp_container.html',
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

               $( window ).on( "orientationchange", function( event ) { 
               			sendMessage();

               })

                function sendMessage(){
                    frmWindow.postMessage(host,'*');
                }
                    
                scope.iframeOnLoaded = function() {
                    sendMessage();
                }

                var pageCheck = '';

                function onmessage(e){
                    if (e.data.type==="longchamp") {
                        frmPage.height  = "auto";

                        setTimeout(function(){frmPage.height  = e.data.height+"px";},300);
                        clearTimeout(scrollTopInterval);

                        scrollTopInterval = setTimeout(function(){
                            if(pageCheck == '' || !e.data.page){
                                window.scrollTo(0,0);
                            }

                            if(e.data.page){
                                pageCheck = e.data.page;
                            }else{
                                pageCheck = '';
                            }

                        },300);
                  
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