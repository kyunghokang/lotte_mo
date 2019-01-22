(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);
    
    app.controller('purchaseCtrl', ['$scope', '$http', '$filter', '$window', function($scope, $http, $filter, $window) {
    	//----------------------------------------------------------------------------------------------------
        // 변수 선언
        //----------------------------------------------------------------------------------------------------
    	$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)
    	
    	$scope.isWishDebug = false; // UI 디버깅용
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.datePickerYn = false;
        $scope.datePickerState = '';
		$scope.wScroll = 0; // 윈도우 스크롤 높이
		
        // 로딩 후 컨텐츠 보이기
        angular.element($window).on('load', function() {
			$('#content_wrapper').show();
			var pop = $(".lg_deli_pop");
			
			//희망일배송 안내 팝업 열기
			$(".lg_delivery a:nth-child(2)").on("click",function(){
				
				pop.css("display","block");
				$(".lgpop_dim").css("display","block");
				$scope.wScroll = angular.element($window).scrollTop();
		
				angular.element("body, html").css({"height":"100%","overflow":"hidden"});
				return false;
			});
			//희망일배송 안내 팝업 닫기
			$(".lg_deli_pop a").on("click",function(){
				pop.css("display","none");
				$(".lgpop_dim").css("display","none");
				angular.element("body, html").css({"height":"auto","overflow":"auto"});
				angular.element($window).scrollTop($scope.wScroll);
				return false;
			});

        });
		
        // URL 파라미터 파싱
        var queries = $window.location.search.replace(/^\?/, '').split('&');
        var ordListCase = '1';
        
        // "ordListCase" 파라미티 찾기
		angular.forEach(queries, function(value) {
			if (value) {
				var paramInfo = value.split('=');
				
				if (paramInfo.length > 0) {
					if ('ordListCase' == paramInfo[0]) {
						ordListCase = paramInfo[1];
					}
				}
			}
		});
		
		// 서브헤더 타이틀
        if ('' == ordListCase || '1' == ordListCase) {
        	$scope.subTitle = '주문배송조회'; 
        } else {
        	$scope.subTitle = '취소/교환/반품내역';
        }
        
        /**
         * 데이터피커 보이기
         */
        $scope.datePickerOpen = function(datePickerState) {
        	$scope.datePickerYn = true;
        	$scope.datePickerState = datePickerState;
        };
        
        /**
         * 데이터피커 숨기기
         */
        $scope.datePickerClose = function(currentDatePicker) {
        	$scope.datePickerYn = false;
        	$scope.datePickerState = '';
		};
	
    }]);	
    
    // datePicker 
    app.directive('datePicker', ['$timeout','$window',function($timeout,$window) {
        return {
            replace:true,
            link : function(scope, el, attrs){
            	scope.getFirstDay = function(year, month) { //첫째요일
            		return new Date(year, month, 1).getDay();
            	}
            	scope.getLastDay = function(year, month) { //마지막날짜
            		return new Date(year, month + 1, 0).getDate();
             	}
             	scope.addZero = function(n) {return n < 10 ? "0" + n : n;};
             	scope.date = new Date();   	
             	scope.now = new Date();
             	scope.cdate = new Date(); //input current date
             	scope.today = scope.now.getDate();
             	scope.month = scope.now.getMonth();
             	scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
             	scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
             	scope.dateHead = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
             	
             	scope.datePrev = function(obj){
             		scope.date.setMonth(scope.date.getMonth() - 1);        		        		
             		scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
             		scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
             		scope.makeDays();
             	}
             	scope.dateNext = function(e){
             		scope.date.setMonth(scope.date.getMonth() + 1);
             		scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
             		scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
             		scope.makeDays();
             	}        	
             	scope.makeDays = function(){
             		scope.day = [];
             		for (var i = 0 ; i < scope.firstDay ; i++) {
         				scope.day.push(0-i);
             		}        		
             		for (var i = 0 ; i < scope.lastDay ; i++) {
         				scope.day.push(i + 1);
             		}
             	}
             	
             	// 활성화된 날짜
             	scope.isActiveDate = function(day) {
             		var result = false;
             		var date = new Date(scope.date.getFullYear() + "-" + scope.addZero(scope.date.getMonth() + 1) + "-" + scope.addZero(day));
             		var currentDate = scope.cdate;
  
             		if (currentDate) {
	             		result = date.getFullYear() == currentDate.getFullYear() && date.getMonth() == currentDate.getMonth() && date.getDate() == currentDate.getDate();
             		}
             		
             		return result;
             	};
             	
             	scope.pick = function(i){        		
             		scope.cdate.setDate(i);        		
             		var ymd = scope.date.getFullYear() + "-" + scope.addZero(scope.date.getMonth() + 1) + "-" + scope.addZero(i);
             		$("#" + scope.datePickerState).val(ymd);
             		scope.datePickerClose();
             	}
             	scope.makeDays();
        	}
        };
    }]);
})(window, window.angular);