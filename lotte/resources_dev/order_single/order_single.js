(function(window, angular, undefined) {
    'use strict';

	// 간편 주문서
    var app = angular.module('app', [
         'lotteComm',
         'lotteSrh',
         'lotteSideCtg',
         'lotteSideMylotte',
         'lotteCommFooter'
     ]);

	 app.controller('OrderCtrl', ['$scope','$filter','$sce','$http','$window','$log','LotteCommon', 'LotteUtil', 'LotteCookie',
	 function($scope , $filter , $sce , $http , $window , $log, LotteCommon, LotteUtil, LotteCookie){
         $scope.showWrap = true;
         $scope.contVisible = true;
         $scope.subTitle = orderSubTitle; /*서브헤더 타이틀*/
         $scope.actionBar = true; /*액션바*/
         $scope.isShowThisSns = false; /*공유버튼*/
		 $scope.orderSgl = true;
		 $scope.datePickerYn = false;
		 $scope.enableDate ="";
		 $scope.selectDay = true// 안내 문구
		 $scope.wScroll = 0;
		 $scope.selDay=[];

		// iOS12에서 기존 주문번호 삭제가 안되는 현상 방어코딩 추가 2018.09.17 박형윤
		console.log("페이지 인입 주문번호 초기화");
		var del_date = new Date(0);
		document.cookie = 'ORD_NO=; path=/; domain=lotte.com; expires=' + del_date + ';';

		// iOS12에서 기존 주문번호 삭제가 안되는 현상 IOS앱 쿠키삭제 스키마 추가 2018.09.17 김낙운
		if(cp_schema != ""){  //app일경우
			if(isIOS){ //아이폰일경우
				angular.element("#app_del_cookie_iframe").remove();
				setTimeout(function () {
					var iframe = document.createElement('iframe');
					iframe.id = 'app_del_cookie_iframe';
					iframe.style.visibility = 'hidden';
					iframe.style.display = "none";
					iframe.src = 'lottebridge://deletecookie?' + 'ord_no'; // 삭제 쿠키명 파라메터 형태로 다중 처리 가능(ex) abc,def,ghi)
					document.body.appendChild(iframe);
				}, 100);
			}
		}
		


		 /**
        		 * 데이터피커 보이기
        		 */
        		$scope.datePickerOpen = function(datePickerState) {
        			$scope.datePickerYn = true;
					$scope.datePickerState = datePickerState;
					var input_date = $("#" + $scope.datePickerState).val().toString();
					if(input_date){
						$scope.selDay = input_date.split("-");
					}
					$scope.setCalender();
					$scope.wScroll = angular.element($window).scrollTop();
					angular.element("#cover").css("display","block");
					angular.element("body, html").css({"height":"100%","overflow":"hidden"});
        		};
		
        		/**
        		 * 데이터피커 숨기기
        		 */
        		$scope.datePickerClose = function(currentDatePicker) {
        			$scope.datePickerYn = false;
					$scope.datePickerState = '';
					angular.element("#cover").css("display","none");
					angular.element("body, html").css({"height":"auto","overflow":"auto"});
					angular.element($window).scrollTop($scope.wScroll);
        		};

				$scope.calendar = {
					date: [],
					year: '2018',
					month: '01',
					dispDate: new Date(),
					today: new Date()
				};

				$scope.getLastDay = function(year, month) { //마지막날짜
						return new Date(year, month + 1, 0).getDate();
				};

				$scope.addZero = function(n) {return n < 10 ? "0" + n : n;};
				$scope.setCalender = function(year, month) {  // 옵션 달력 
					
					var enableDays = $("#"+$scope.datePickerState).attr("enable-date") + ","; // 선택 가능 날짜 : string
					
					var d = null;
					if(!year) {
						d = new Date();
					} else {
						d = new Date(year, month, 1);
					}
					
					$scope.calendar.date = [];
					$scope.calendar.dispDate = d;
					var lastDay = $scope.getLastDay(d.getFullYear(), d.getMonth());
					
					$scope.calendar.year = d.getFullYear();
					$scope.calendar.month = $scope.addZero(d.getMonth()+1);
					
					for(var i=0;i < lastDay;i++) {
						var new_d = new Date(d.getFullYear(), d.getMonth(), i+1);
						var enableDate = $scope.calendar.year+ "" + $scope.calendar.month + $scope.addZero(i+1)+","; 
						var selday = false; // 오늘 날짜 체크
						var isOld = false; // 지난 날짜 체크
						var enable = false; // 선택 가능 체크
						
						if($scope.selDay !="" && 
							new_d.getFullYear() == $scope.selDay[0] &&
							$scope.addZero(new_d.getMonth()+1) == $scope.selDay[1] &&	
							$scope.addZero(new_d.getDate()) == $scope.selDay[2]
						) {
							selday = true;
						}
						//선택 가능 날짜 세팅 
						if(enableDays.indexOf(enableDate) != -1){
							enable = true;
						}

						if(new_d < $scope.calendar.today && !selday) {
							isOld = true;
						}
						$scope.calendar.date.push({d:$scope.addZero(i+1)+"", isToday: selday, isOld: isOld, enable: enable});
					}

					//현재 달력의 지나간 날짜
					var weekFirst = new Date(d.getFullYear(), d.getMonth(), 1);
					var beforeMonthLastDay = $scope.getLastDay(d.getFullYear(), d.getMonth()-1);
				
					for(var i=0;i < weekFirst.getDay();i++) {
						
						$scope.calendar.date.splice(0, 0, {d:$scope.addZero(beforeMonthLastDay-i)+"", isToday: false, isOld: true, enable: false});

					}
				};

				$scope.datePrev = function() { // 이전달
					$scope.setCalender($scope.calendar.dispDate.getFullYear() ,$scope.calendar.dispDate.getMonth()-1);
				};

				$scope.dateNext = function() { // 다음달
					$scope.setCalender($scope.calendar.dispDate.getFullYear() ,$scope.calendar.dispDate.getMonth()+1);
				};
				

				$scope.selectDate = function() { // 날짜 선택
					if(this.item.isOld || !this.item.enable) {
						return false;
					}

					$("#" + $scope.datePickerState).val($scope.calendar.year+"-"+ $scope.calendar.month+"-"+this.item.d);
					$scope.selectDay =  ($("#" + $scope.datePickerState).val()) ? false : true;
					$scope.datePickerClose();
				};

				setTimeout(function(){$("#datepicker").removeAttr("style")},1000);		
     }]);

     app.controller('ordersimpleCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
         $scope.showWrap = true;
         $scope.contVisible = true;
		 $scope.subTitle = "간단 주문서 작성";//서브헤더 타이틀
		
     }]);

     
})(window, window.angular);
