(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		 'lotteComm',
		 'lotteSrh',
		 'lotteSideCtg',
		//  'lotteSideMylotte',
		 'lotteCommFooter'
	]);

	app.controller('soGoodBenefitCtrl', ['$scope', '$window', '$http', 'LotteCommon', 'commInitData', 
		function ($scope, $window, $http, LotteCommon, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "멤버십"; //서브헤더 타이틀
		$scope.pageLoading = true;
		$scope.schema = commInitData.query['schema']!= null?commInitData.query['schema']:"";
		$scope.currTime;
		$scope.currMonth;
		$scope.todayDate = new Date();
        $scope.data_param = "";
		// TEST Date
		if (commInitData.query["toDate"]) {
			var todayDate = commInitData.query["toDate"]; // 년월일
			var todayTime = new Date(
				todayDate.substring(0, 4), // 년
				parseInt(todayDate.substring(4, 6)) - 1, // 월
				todayDate.substring(6, 8), // 일
				todayDate.substring(8, 10), // 시간
				todayDate.substring(10, 12), // 분
				todayDate.substring(12, 14)); // 초
        $scope.data_param = "toDate=" +todayDate; //20180125
			$scope.todayDate = todayTime;
		}
            
        //20171201 ------------------------------------   
        $scope.gradView = false; //로컬 테스트용 : 등급 및 케이스별 내용 전체 보기 (20171201)
        //$scope.loginInfo = {name: "", mbrNo: "30", gradeCd: "", mbrAge: "", genSctCd: "", isLogin:true}
        $scope.gpop_type = 0;
        $scope.gpop_item = null;                
        //안내팝업 닫기    
        $scope.pop_close = function(){
            $scope.gpop_type = 0;    
        }    
        $scope.pop_open = function(id, item){
            $scope.gpop_type = id; 
            if(item){
                $scope.gpop_item = item;
            }
        }

        function getAddZero(num) { 
					return num < 10 ? "0" + num : num + "";
				} 
				var todayDateTime2 = new Date();
      	var todayDate2 = todayDateTime2.getFullYear() + getAddZero(todayDateTime2.getMonth() + 1) + getAddZero(todayDateTime2.getDate()) + getAddZero(todayDateTime2.getHours());

      	var testDate = commInitData.query["testDate"] || "";
      	if(testDate){
      		todayDate2 = testDate;
      	}
      	if(parseInt(todayDate2, 10) >= parseInt('2018081710', 10)){
      		$scope.validDate = true;
      	}


        //매일매일 차곡차곡 링크 
        $scope.everyday_link = function(type){
            var add_param = $scope.baseParam + "&tclick=m_DC_MemCouponZone_Clk_Btn_";
            var link = "/event/m/directAttend.do?" + add_param + "3"; 
            if(type == 2){
            	/*20180718 변경*/
            	if($scope.luckyboxNo == false){
            		link = "/event/appPush.do?" + add_param +"4";
            	}else{
            		link = "/event/luckyBox.do?" + add_param + "4";
            	}
						}else if(type == 3){
								link = "/event/clover.do?" + add_param + "5";
						}else if(type == 4){
								link = "/event/shoppingMail.do?" + add_param + "6";	
            }else if(type == 5){
                link = "/event/shoppingMail.do?" + add_param + "6";
            }else if(type == 6){
            	link = "/product/m/product_list.do?curDispNo=5443685&" + add_param + "7";
            }
            window.location.href = link;
        }  

        $scope.luckyboxNo = true;
        $scope.eventSubTxt = '금요일의 대박찬스';
        $scope.eventSubTxt2 = '럭키박스'; 

        var todayYear = $scope.todayDate.getFullYear(),    
            todayMonth = $scope.todayDate.getMonth(),
            todayDate = $scope.todayDate.getDate(),
            firstDate = new Date($scope.todayDate.getFullYear(), $scope.todayDate.getMonth(), 1).getDay(), //1일의 요일   
            todayDay = $scope.todayDate.getDay(),
            lastDayDate =  new Date(todayYear, todayMonth + 1, 0),
            lastDate = lastDayDate.getDate();

        $scope.eventTimes = function(Year, Month, Day, Hour, Min, Sec){
        	var date = new Date(Year, Month, Day, Hour, Min, Sec);

        	if (Year && Month && Day) {
				date.setFullYear(Year);
				date.setMonth(Month - 1);
				date.setDate(Day);

				if (Hour) {
					date.setHours(Hour);
				}

				if (Min) {
					date.setMinutes(Min);
				}

				if (Sec) {
					date.setSeconds(Sec);
				}
			}
			
			return date.getTime();
        }

        var nowDateTime = $scope.todayDate.getTime();

		if(location.search.indexOf('dt_test') != -1){ //20180423 럭키박스 분기처리 테스트용
			var dt_test = location.search.indexOf('dt_test');

			if(nowDateTime >= $scope.eventTimes(Number(location.search.slice(dt_test+8, dt_test+12)), Number(location.search.slice(dt_test+12, dt_test+14)), Number(location.search.slice(dt_test+14, dt_test+16)))){
				$scope.luckyboxNo = false;
				$scope.eventSubTxt = '매일 앱푸시 오픈';
				$scope.eventSubTxt2 = '깜짝알림';
			}
		}

		if(nowDateTime >= $scope.eventTimes(2018, 4, 28) && location.search.indexOf('dt_test') == -1){ //20180423 럭키박스/앱푸시 분기처리
			$scope.luckyboxNo = false;
			$scope.eventSubTxt = '매일 앱푸시 오픈';
			$scope.eventSubTxt2 = '깜짝알림';
		}

        //쿠폰존 쿠폰다운로드
        $scope.getCoupon = function(key){
            if(!$scope.loginInfo.isLogin){
                $scope.goLogin();
            }else{
                $scope.sendTclick('m_DC_MemCouponZone_Clk_Btn_2');
                $http.get("/json/coupon/regCoupon2.json?cpn_issu_no=" + key + "&"+ $scope.data_param)
                .success(function(data) {
                    if(data.result == "0"){
                        location.reload();
                    }else{
                        if(data.message){
                            alert(data.message);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log(status);
                });                            
            }
        }

        $scope.noti_msg = function(type){
            if(type == 1){
                alert("이미 쿠폰을 다운받으셨습니다.");
            }else if(type == 2){
                alert("쿠폰 발급 대상이 아닙니다.");
            }
        }
        
        
        
		/*****************************
		 * 맴버 등급
		 * 10 : 플래티넘+
		 * 20 : 플래티넘
		 * 30 : 플래티넘#
		 * 40 : 골드
		 * 50 : 실버
		 * 70 : 프렌드
		 * 80 : 웰컴
		 *****************************/



		// 20151227 MITFT 요청(박미영) 참좋은 혜택 진입 불가 처리 (2016.1.1 00:00 ~ 2016.1.7 13:00)
		if ($scope.todayDate.getTime() >= (new Date(2016, 1 - 1,1)).getTime() &&
			$scope.todayDate.getTime() < (new Date(2016, 1 - 1, 7, 13)).getTime()) {
			alert("죄송합니다. 일시적으로 참좋은 혜택 모바일 사용이 원활하지 않습니다.PC에서 확인 부탁드립니다.\n(1월 7일 이후 모바일 확인 가능)");
			$window.location.href = LotteCommon.mainUrl + "?" + $scope.baseParam; // 메인으로 이동
		}

		var now = $scope.todayDate;
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var day = now.getDate();
		var yoil = now.getDay();
		var hour = now.getHours();
		var min = now.getMinutes();
		var lastDate = new Date(year, month, 0);
		var lastDay = lastDate.getDate();
		var remainMonth = now.getMonth() + 4;

		$scope.lastDayOfMonInt = (new Date(year, month, 0)).getDate();
		$scope.currYear = year;
		$scope.currMonth = month;
		// $scope.lastDay = lastDay;
		$scope.day = day;
		$scope.hour = hour;
		// $scope.loginInfo.isLogin = true;

		if (month < 10) {
			month = "0" + month;
		}

		if (day < 10) {
			day = "0" + day;
		}

		if (hour < 10) {
			hour = "0" + hour;
		}
		if(min < 10){
			min ="0" + min;
		}

		$scope.currTime = "" + year + month + day + hour;
		$scope.remainDate = year + "." + remainMonth + ".01"; 
		
		/* 2017.12.1 00:00 ~ 09:00 페이지 off */
		$scope.shutDownTime = false;
		if($scope.todayDate.getTime() >= (new Date(2017, 12 - 1,1)).getTime() && $scope.todayDate.getTime() < (new Date(2017, 12 - 1, 1, 10)).getTime()){
			$scope.shutDownTime = true;
		}	
        $scope.newVer = true;
         
		// URL PARAM GET
		// function getParameterByName(name) {
		// 	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		//
		// 	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		// 		results = regex.exec(location.search);
		//
		// 	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		// }

		// $scope.ordnoParam = getParameterByName('ord_no');
		// $scope.entrnoParam = getParameterByName('entr_no');
		
		// 참좋은혜택 DATA
		var soGoodBenefitData = LotteCommon.gdBenefitData + "?"+$scope.data_param;
		
		// Data Load
		$http.get(soGoodBenefitData)
		.success(function(data) {
			// console.log(data.goodBenefit.banner.banner.items);
            if($scope.newVer && data.goodBenefit.attributes){
                //데이타 갯수 쿠폰존 15개 까지, 배너 8개까지             
                if(data.goodBenefit.attributes.banner_top.items.length > 8){
                    data.goodBenefit.attributes.banner_top.items = data.goodBenefit.attributes.banner_top.items.slice(0, 8);
                }
                if(data.goodBenefit.attributes.banner_bottom.items.length > 8){
                    data.goodBenefit.attributes.banner_bottom.items = data.goodBenefit.attributes.banner_bottom.items.slice(0, 8);
                }
                if(data.goodBenefit.attributes.couponList.items.length > 15){
                    data.goodBenefit.attributes.couponList.items = data.goodBenefit.attributes.couponList.items.slice(0, 15);
                }
            }
			// totalData            
			$scope.goodBenefit = data.goodBenefit;
			// 쿠폰
			$scope.couponData = data.goodBenefit.couponInfo;

			// 배너
			if (data.goodBenefit.banner.banner != null) {
				$scope.bannerData = data.goodBenefit.banner.banner.items;
			}
            
            
            
            
            
            
			//webSchema
			$scope.webSchema = data.goodBenefit.webSchema;
			$scope.gradeYear = "2015년";
			$scope.gradeMonth = "9월";
			$scope.gradehalf = "하반기";
			
			$scope.gradeNm;
			$scope.nextGradeNm;

			switch (data.goodBenefit.mbrGradeCd) {
				case '10':
					$scope.gradeNm = "플래티넘+";
					$scope.nextGradeNm = "플래티넘+";
					break;
				case '20':
					$scope.gradeNm = "플래티넘";
					$scope.nextGradeNm = "플래티넘+";
					break;
				case '30':
					$scope.gradeNm = "플래티넘#";
					$scope.nextGradeNm = "플래티넘";
					break;
				case '40':
					$scope.gradeNm = "골드";
					$scope.nextGradeNm = "플래티넘#";
					break;
				case '50':
					$scope.gradeNm = "실버";
					$scope.nextGradeNm = "골드";
					break;
				case '70':
					$scope.gradeNm = "프렌드";
					$scope.nextGradeNm = "실버";
					break;
				case '80':
					$scope.gradeNm = "웰컴";
					$scope.nextGradeNm = "실버";
					break;
			}

			if ($scope.mbrGradeCd == '10') {
				$scope.couponDownYn = false;

				if (Number($scope.day) == 1 && Number($scope.hour) < 9) { // 매월 첫째날 오전 9시 이전엔 쿠폰받기 불가	
					$scope.couponDownYn = true;
				}
			}

			$scope.pageLoading = false;
		})
		.error(function (data, status, headers, config) {
			//console.log('Error Data : ', status, headers, config);
			$scope.pageLoading = false;
		});
		
		// goLogin
		$scope.goLogin = function () {
			$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&targetUrl=" + encodeURIComponent($window.location.href, "UTF-8");
		};
	}]);
    
    //20171201
	app.filter('dayinfo', [function () {
		return function (str) {            
			return str.substr(0, 10);;
		}
	}]);
    
	app.directive('lotteContainer',['$http', '$location', '$window', 'LotteCommon', 'LotteUtil', 
		function ($http, $location, $window, LotteCommon, LotteUtil) {
		return {
			templateUrl: '/lotte/resources_dev/mylotte/sub/so_good_benefit_container.html',
			replace: true,
			link: function ($scope, el, attrs) {
                
				var yoil = "N";
				var d = $scope.todayDate; //Date 선언
				var theDay = ""; //날짜 추출
				var hour = ""; //시간 추출
				
				$scope.cpn_cnt = 0; // 발급 받을 쿠폰 수
				$scope.issue_cnt = 0; // 쿠폰 발급 수

				$scope.regGradeCoupon = function (coupon_type, cpn_div) {
					var postParams = angular.extend({
						coupon_type : coupon_type
					}, $scope.baseParam);

					$http({
						url : '/json/mylotte/reg_grade_coupon.json?' + $scope.data_param,
						data : $.param(postParams),
						method : 'POST',
						headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
					}) // AJAX 호출
					.success(function (data, status, headers, config) { // 호출 성공시
						// console.log(data.data_set.response_msg);
						if (data.data_set.response_msg == "CS") {
							alert(cpn_div+"이 발급되었습니다.");
							//location.href = "<%=sslDomain %>/mylotte/pointcoupon/point_info.do?<%=commonParam %>&point_div=coupon";
							$scope.goPointCoupon();
						} else if (data.data_set.response_msg == "CD") {
							if (cpn_div.indexOf("모바일APP") > -1) {
								alert("이미 발급된 쿠폰입니다.");
							} else {
								alert("이미 발급된 쿠폰입니다. 다음달에 또 발급받으세요^^");
							}

							//location.href = "<%=sslDomain %>/mylotte/pointcoupon/point_info.do?<%=commonParam %>&point_div=coupon";
							$scope.goPointCoupon();
						} else if (data.data_set.response_msg == "CF") {
							alert("쿠폰 발급이 실패했습니다.");
							//$('#msg').html(data.data_set.response_msg).show();
						}else if (data.data_set.response_msg == "CX") {
							alert("쿠폰 발급이 실패했습니다.");
							//$('#msg').html(data.data_set.response_msg).show();
						} else {
							alert("로그인 해 주세요.");
						}

						$scope.issue_cnt++;

						if ($scope.cpn_cnt==$scope.issue_cnt) {
							$location.path('/this');
							//location.reload();
						}
					})
					.error(function (data, status, headers, config) { // 호출 실패시
					   alert("error");
					});
				};
				
				//플래티넘 고객 전월 구매자 쿠폰 발급
				$scope.regPlatinumCoupon = function (coupon_type) {
					var last_month_order_cnt = $scope.goodBenefit.lastMonthOrderCnt;

					if (last_month_order_cnt == '') last_month_order_cnt = '0';
					
					if (Number(last_month_order_cnt) > 0) {
						var postParams = angular.extend({
							coupon_type : coupon_type
						}, $scope.baseParam);

						$http({
							url : '/json/mylotte/reg_grade_coupon.json?' + $scope.data_param,
							data : $.param(postParams),
							method : 'POST',
							headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
						}) // AJAX 호출
						.success(function (data, status, headers, config) { // 호출 성공시
							// console.log(data.data_set.response_msg);
							if (data.data_set.response_msg == "CS") {
								alert("구매감사 추가 혜택 쿠폰이 발급되었습니다.");
							} else if (data.data_set.response_msg == "CD") {
								alert("이미 발급된 쿠폰입니다.");
							}

							//location.href = "<%=sslDomain %>/mylotte/pointcoupon/point_info.do?<%=commonParam %>&point_div=coupon";
							$scope.goPointCoupon();
						})
						.error(function (data, status, headers, config) { // 호출 실패시
						   alert("error");
						});	
					} else {

						alert("해당 쿠폰은 전월 구매해주신 고객님만 받으실 수 있습니다. 이번달에 구매하시고 다음 달에 발급받으세요^^");
					}
				};
				
				$scope.regCoupon = function(coupon_type, member_grade){
					//if(coupon_type == "memberCpn"){
					//	$(".downAll").text("등급쿠폰 전체 다운로드 완료");
					//	$(".downAll").unbind("click");
					//}
					$scope.goodBenefit.couponInfo.mbl_down_yn = "Y";
					
					var postParams = {
						coupon_type : coupon_type,
						member_grade : member_grade
					};

					$http({
						url: '/json/mylotte/reg_grade_coupon.json?' + $scope.baseParam + "&"+$scope.data_param,
						data: $.param(postParams),
						method: 'POST',
						headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
					}) // AJAX 호출
					.success(function (data, status, headers, config) { // 호출 성공시
						// console.log(data.data_set.response_msg);
						if (data.data_set.response_msg == "CS") {
							var msg = "이달의 참좋은 쿠폰이 발급되었습니다. 쿠폰내역을 확인하시겠습니까?";

							if (confirm(msg)) {
								$scope.goPointCoupon();
							}

							//alert("쿠폰이 발급되었습니다.");
							//location.href = "<%=sslDomain %>/mylotte/pointcoupon/point_info.do?<%=commonParam %>&point_div=coupon";
							if (coupon_type == "memberCpn") {
								//$(".downAll").text("등급쿠폰 전체 다운로드 완료");
								//$(".downAll").unbind("click");
								$scope.goodBenefit.couponInfo.mbr_down_yn = "Y";
							} else {
								//$(".downAll").text("등급쿠폰 전체 다운로드 완료");
								//$(".downAll").unbind("click");
								$scope.goodBenefit.couponInfo.mbl_down_yn = "Y";
							}
						} else if (data.data_set.response_msg == "CD") {
							//if(cpn_div.indexOf("모바일APP") > -1){
								alert("이미 발급된 쿠폰입니다.");
							//}else{
							//	alert("이미 발급된 쿠폰입니다. 다음달에 또 발급받으세요^^");
							//}
							//location.href = "<%=sslDomain %>/mylotte/pointcoupon/point_info.do?<%=commonParam %>&point_div=coupon";
							$scope.goPointCoupon();
						} else if (data.data_set.response_msg == "CF") {
							alert("쿠폰 발급이 실패했습니다.");
							//$('#msg').html(data.data_set.response_msg).show();
						} else if (data.data_set.response_msg == "CX") {
							alert("쿠폰 발급이 실패했습니다.");
							//$('#msg').html(data.data_set.response_msg).show();
						} else {
							alert("로그인 해 주세요.");
						}
						//$scope.issue_cnt++;

						//if ($scope.cpn_cnt==$scope.issue_cnt){
						//	$location.path('/this');
							//location.reload();
						//}
					})
					.error(function (data, status, headers, config) { // 호출 실패시
					   alert("error");
					});
				}
				
				$scope.goPointCoupon = function () {
					var baseUrl = $location.protocol() + "://" + $location.host();
					//$scope.closeInfoPop();
					$window.location.href = baseUrl + "/mylotte/pointcoupon/point_info.do" + "?" + $scope.baseParam + "&point_div=coupon";
				};
				
				$scope.goLotteSuper = function () {
					//var url = "m.lottesuper.co.kr/handler/event/Event-EventViewDetail?evt_no=00000000832255&CHL_no=M385068";
					var url = "m.lottesuper.co.kr/handler/event/Event-EventViewDetail?evt_no=00000000889225&CHL_no=M385068&AFCR_NO=110682";
					var isApp = $scope.appObj.isApp; // lib/jquery/cnt_interface.js
					var isIOS = $scope.appObj.isIOS; // lib/jquery/cnt_interface.js
					var isAndroid = $scope.appObj.isAndroid; // lib/jquery/cnt_interface.js

					if (isApp) {
						if (isIOS) {
							window.location = "lecsplatform://"+encodeURIComponent(url);
						} else if (isAndroid) {
							window.lecsplatform.callAndroid("http://"+encodeURIComponent(url));
						}
					} else {
						window.open("http://"+url);
					}
				};

				// 패밀리 팝업
				$scope.goFamilySite = function () {
					var family_url = "member.lpoint.com/door/user/mobile/";
					var main_url = encodeURIComponent(
						   ($scope.schema == ""? LOTTE_CONSTANTS['M_HOST_MOBILE'] : ($scope.schema + LOTTE_CONSTANTS['M_HOST_MOBILE'].replace("http", ""))) + "/" 
						   + (LotteUtil.isSmp() ? "main_smp.do" : "main.do") 
						   + $scope.baseParam, "UTF-8");
					var target_url = "login_common.jsp";
					var return_url = '';
					var isApp = $scope.appObj.isApp; // lib/jquery/cnt_interface.js
					var isIOS = $scope.appObj.isIOS; // lib/jquery/cnt_interface.js
					var isAndroid = $scope.appObj.isAndroid; // lib/jquery/cnt_interface.js

					// 앱/웹 분기처리
					if($scope.schema == "") {
					 	return_url = encodeURIComponent(window.location.href, "UTF-8");
					}else{
						return_url = window.location.href.replace(/^http(s)?/,$scope.schema);
					}

					family_url += (target_url + "?sid=" + LotteUtil.getLoginSeed() + "&returnurl=" + return_url + "&main_url=" + main_url);
					family_url += "&sch=" + $scope.schema;
					
					if (isApp) { // 앱일경우
						if (isIOS) {
							window.location = "family://" + family_url;    					
						} else if (isAndroid) {
							window.myJs.callAndroid("https://" + family_url);
						}
					} else {
						window.open("https://" + family_url, "family");    				
					}
				};
				
				$scope.closeChk = function (theDay) { // 휴무  체크
					theDay = d.getDay(); // 날짜 추출
					hour = d.getHours(); // 시간 추출

					if (theDay == 0) { // 일요일
						$scope.close();
					} else if (theDay == 6) { // 토요일
						$scope.timeChk("Y");
					} else {
						$scope.timeChk("N");
					}
				};
				
				$scope.timeChk = function (yoil) { // 시간 체크
					// 전화번호
					var telNo;

					if (isEllotteApp) {
						telNo = "1899-2500"
					} else {
						telNo = "1577-1110"
					}

					var isEllotteApp = $scope.appObj.isEllotteApp;

					if (yoil == "Y") { // 토요일경우
						if (parseInt(hour) >= 9 && parseInt(hour) <= 13) {
							location.href = "tel:"+telNo;
						} else {
							close();
						}
					} else { // 평일
						if (parseInt(hour) >= 9 && parseInt(hour) <= 20) {
							location.href = "tel:"+telNo;
						} else {
							close();
						}
					}
				};
				
				$scope.close = function () { // 휴무
					alert("죄송합니다. 고객님,\n전화 문의는 평일(월~금) : 9:00~20:00\n토요일 : 9:00~13:00 까지 입니다.");
				};
				
				$scope.goBanner = function (imgLink) {
					// console.log($scope.bannerData[0].img_link);
					var imgLink = $scope.bannerData[0].img_link;
					var baseUrl = $location.protocol() + "://" + $location.host();

					if (imgLink.indexOf('?') != -1) {
						$window.location.href = baseUrl + imgLink + "&" + $scope.baseParam;
					} else {
						$window.location.href = baseUrl + imgLink + "?" + $scope.baseParam;
					}
				};
				
				$scope.showBenefit = function () {
					$('.benefit').toggleClass("on");
					$('.bnelist').toggle();

					var bH = $(".grade_guide").height();

					if ($('.benefit').hasClass('on')) {
						$('.benefit').css({"height":bH+50});
					} else {
						$('.benefit').css({"height":"auto"});
					};
				};

				$scope.closeGuide = function () {
					$('.bnelist').hide();
					$('.benefit').removeClass('on').css({"height":"auto"});
				};
                
                // 20180807 멤버십/쿠폰존 인디케이터 수정, 티클릭 위치변경
    
                // banner_top 영역
                $scope.getRolling1 = function(control){
                    $scope.controlIdx1 = control.getIndex() + 1;
                }
                
                $scope.setInfo1 = function(idx){
                    $scope.controlIdx1 = idx + 1;
                    $scope.sendTclick('m_DC_MemCouponZone_Swf_Ban_1');
                }     
                // banner_bottom 영역
                $scope.getRolling2 = function(control){
                    $scope.controlIdx2 = control.getIndex() + 1;
                }
                
                $scope.setInfo2 = function(idx){
                    $scope.controlIdx2 = idx + 1;
                    $scope.sendTclick('m_DC_MemCouponZone_Swf_Ban_2');
                }
                
                // banner_ad 영역
                $scope.getRolling3 = function(control){
                    $scope.controlIdx3 = control.getIndex() + 1;
                }
                
                $scope.setInfo3 = function(idx){
                    $scope.controlIdx3 = idx + 1;
                    $scope.sendTclick('m_DC_MemCouponZone_Swf_Ban_3');
                } 

			}
		};
	}]);
})(window, window.angular);