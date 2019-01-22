(function(window, angular, undefined) {
    'use strict';
    var mainNewsModule = angular.module('lotteMainNewsLayer', []);
    
    mainNewsModule.controller('lotteMainNewsCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'LotteCookie', 'LotteUserService', function($scope, $http, $window, LotteCommon, LotteCookie, LotteUserService) {
    	/*로그인 데이터 get*/
        $scope.loadNewsData = function() {
            $http.get(LotteCommon.mainNewAlarmData)
            .success(function(data){
                $scope.alarmInfo = data.alarm_info.items;
                $scope.alarmInfoNo = data.alarm_info.total_count;

                
                
	            $scope.setCookieToday = function() {
	            	$('.mycart_news_layer').hide();
	            	setCookieToday('smartAlarmYn', 'false', 1);
	            };
                
                /*쿠키명으로 값 가져오기*/
                function getCookieValue(cName) {
                    cName = cName + '=';
                    var cookieData = document.cookie;
                    var start = cookieData.indexOf(cName);
                    var cValue = '';
                    if(start != -1){
                         start += cName.length;
                         var end = cookieData.indexOf(';', start);
                         if(end == -1)end = cookieData.length;
                         cValue = cookieData.substring(start, end);
                    }
                    return unescape(cValue);
                }
                function setCookieToday (name, value, expiredays) { 
                    /*내일 00:00 시 구하기*/
                    var todayDate = new Date();
                    todayDate.setDate(todayDate.getDate() + expiredays);
                    /*쿠키 expire 날짜 세팅*/
                    var expireDate = new Date(todayDate.getFullYear(), todayDate.getDate());
                    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + expireDate.toGMTString() + ";";
                };
                
                var smratAlrmCookie = getCookieValue( 'smartAlarmYn' ) ;
                /*console.log( 'smratAlrmCookie : ' , smratAlrmCookie ) ;*/ 
                
                if(LotteUserService.getLoginInfo().isLogin && $scope.alarmInfoNo > 0 && !smratAlrmCookie ) {
                	setTimeout(function () {
                        $('.mycart_news_layer').addClass('on').show();
                    }, 2000);
                    $('.mycart_news_layer a.btn').bind('click', function () {
                        $( '.mycart_news_layer' ).removeClass('on');
                    });

                };

            })
            .error(function(data){ console.log('Error Data :  알람'); });
        };
        $scope.loadNewsData();
    }]);
    
    /* sub header directive */
    mainNewsModule.directive('mycartNewsLayer',[function(){
        return {
            templateUrl:'/lotte/resources_dev/main/mycart_news_layer.html',
            controller:'lotteMainNewsCtrl',
            replace:true,
            link:function($scope, el, attrs){
	        	
            }
        }
    }]);
})(window, window.angular);