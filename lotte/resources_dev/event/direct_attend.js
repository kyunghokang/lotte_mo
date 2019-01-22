(function(window, angular, undefined) {
	'use strict';
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg', 
		// 'lotteSideMylotte', 
		'lotteCommFooter'
	]);

	app.controller('directAttendCtrl', ['$scope', '$http', '$window', '$interval', 'LotteCommon', 'commInitData',
		function ($scope, $http, $window, $interval, LotteCommon, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "하루 한 번 롯데닷컴"; // 서브헤더 타이틀
        $scope.wwd = $(window).width();    
		$scope.todayDate = new Date();
		// TEST Date
		if (commInitData.query["testDate"]) {
			var todayDate = commInitData.query["testDate"]; // 년월일
			var todayTime = new Date(
				todayDate.substring(0, 4), // 년
				parseInt(todayDate.substring(4, 6)) - 1, // 월
				todayDate.substring(6, 8), // 일
				todayDate.substring(8, 10), // 시간
				todayDate.substring(10, 12), // 분
				todayDate.substring(12, 14)); // 초

			$scope.todayDate = todayTime;
		}        
		$scope.getWeekToday = function (date) { // 월요일 기준 몇주차 인지 구하기
			var today = todayTime || new Date();
			var	lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0),
				firstDate = new Date(today.getFullYear(), today.getMonth(), 1),
				lastDateDay = lastDate.getDate(),
				firstDateDay = firstDate.getDay() ;
			return Math.ceil((lastDateDay + firstDateDay) / 7);
		};
        
        var todayYear = $scope.todayDate.getFullYear(),    
            todayMonth = $scope.todayDate.getMonth(),
            todayDate = $scope.todayDate.getDate(),
            firstDate = new Date($scope.todayDate.getFullYear(), $scope.todayDate.getMonth(), 1).getDay(), //1일의 요일   
            todayDay = $scope.todayDate.getDay(),
            lastDayDate =  new Date(todayYear, todayMonth + 1, 0),
            lastDate = lastDayDate.getDate(); // 이번달의 마지막 날
        $scope.thisMonth = todayMonth + 1;    
        $scope.lastWeek = $scope.getWeekToday(); // 마지막 날짜의 이번달 주차
        $scope.yoil = $scope.todayDate.getDay();
		$scope.hour = $scope.todayDate.getHours();
        $scope.attend_layer_flag = false;
        $scope.hide_attend_layer = function(){
            $scope.attend_layer_flag = false;
        }    
        
      
        
        
		function getTime(Year, Month, Day, Hour, Min, Sec) { // Timestemp 구하기
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
            
		$http.get(LotteCommon.directAttendData)
		.success(function (data) {
			$scope.mbrGradeCd = data.direct_attend.mbrGradeCd;
			$scope.intClover = data.direct_attend.intClover;
			$scope.chilCouponCnt = data.direct_attend.chilCouponCnt;
			$scope.chilTotalCouponCnt = data.direct_attend.chilTotalCouponCnt;
			$scope.sibECouponCnt = data.direct_attend.sibECouponCnt;
			$scope.sibETotalCouponCnt = data.direct_attend.sibETotalCouponCnt;
			$scope.lPointCnt = data.direct_attend.lPointCnt;
			$scope.lPointTotalCnt = data.direct_attend.lPointTotalCnt;
			$scope.freeDelivCnt = data.direct_attend.freeDelivCnt;
			$scope.freeDelivTotalCnt = data.direct_attend.freeDelivTotalCnt;
			$scope.ilManCouponCnt = data.direct_attend.ilManCouponCnt;
			$scope.ilManTotalCouponCnt = data.direct_attend.ilManTotalCouponCnt;
			$scope.evtNo = data.direct_attend.evt_no;
			$scope.lpEntryDailCnt = data.direct_attend.lpEntryDailCnt;
			$scope.lpEntryWinCnt = data.direct_attend.lpEntryWinCnt;
			$scope.lpEntryWinCntDailyCnt = data.direct_attend.lpEntryWinCntDailyCnt;
            $scope.lpEntryAstCnt = -1;
            if(data.direct_attend.lpEntryAstCnt != undefined){
                $scope.lpEntryAstCnt = data.direct_attend.lpEntryAstCnt; //L 머니 지급받은 건수 20180226
            }
                
			$scope.platinumMember = false;
			$scope.chgImgCpn = "0501"; // 쿠폰이미지
			$scope.freeDelivCloverCnt = "1000";

			$scope.cloverNewCount = 200; // 나머지 교환 (무료 배송권 교한 제한 카운트)
			$scope.cloverNewCount2 = 96; // L포인트 교환
			$scope.cloverNewCount3 = 200; // U00024 ♣ 클로버 전용 7%,  U00025 ♣ 클로버 전용 10% 
			
			//8월(하드코딩)
			$scope.freeDelivCpnNo = data.direct_attend.freeDelivCpnNo;  // 클로버 1000개 무료배송권
			$scope.lPointNo = ""; // 엘포인트는 값 없음

			$scope.cpnNo1 = ""; // 클로버 전용 2천원할인쿠폰
			$scope.cpnNo2 = data.direct_attend.cpnNo2; // 클로버 1000개 3% 추가할인 쿠폰(백화점)
			$scope.cpnNo3 = ""; // 클로버 전용 1만점 적립쿠폰
			$scope.luckyboxNo = false;
            
			// 쿠폰번호 월별 세팅 (SERVER_TIME)
            $scope.screen1101 = true; //11월1일 구분
			var nowDateTime = $scope.todayDate.getTime();
  /*			 
            if (nowDateTime >= getTime(2016, 9, 1) && nowDateTime < getTime(2016, 10, 1)) {
				$scope.freeDelivCpnNo = "1169489"; // 클로버 1000개 무료배송권
				$scope.cpnNo2 = "1169488"; // 클로버 1000개 3% 추가할인 쿠폰(백화점)
			} else if (nowDateTime >= getTime(2016, 10, 1) && nowDateTime < getTime(2016, 11, 1)) {
				$scope.freeDelivCpnNo = "1170506"; // 클로버 1000개 무료배송권
				$scope.cpnNo2 = "1170505"; // 클로버 1000개 3% 추가할인 쿠폰(백화점)
                $scope.screen1101 = false;
                $scope.subTitle = "올 때마다 출석도짱"; // 서브헤더 타이틀
			}else if(nowDateTime >= getTime(2018, 4, 28) && location.search.indexOf('dt_test') == -1){ //20180423 탭 분기처리
				$scope.luckyboxNo = false;
			}
            
			if(location.search.indexOf('dt_test') != -1){ //20180423 럭키박스 분기처리 테스트용
				var dt_test = location.search.indexOf('dt_test');
				if(nowDateTime >= getTime(Number(location.search.slice(dt_test+8, dt_test+12)), Number(location.search.slice(dt_test+12, dt_test+14)), Number(location.search.slice(dt_test+14, dt_test+16)))){
					$scope.luckyboxNo = false;
				}
			}
*/
			// 날짜 비교 
			$scope.bannerShow = function(sy, sm, sd, ey, em, ed){
				var flag = false;
				if (nowDateTime >= getTime(sy, sm, sd) && nowDateTime < getTime(ey, em, ed)) { 
					flag = true;   
				}			
				return flag;
			}

			$scope.totalClover = data.direct_attend.totalClover;
			if ($scope.mbrGradeCd == "10") {
				$scope.platinumMember = true;
			}
			// 출석 도장 세팅
			if (data.direct_attend.attend_tgtr_list != null) {
				$scope.attendTgtrListData = data.direct_attend.attend_tgtr_list.items;
			} else {
				$scope.attendTgtrListData = null;
			}
			// 20160907 앱푸시 엘머니 증정 배너 추가
			function getParameterByName(name) {
				name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
				var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
					results = regex.exec(location.search);
				return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
			}

			 $scope.appPushFlag = false;
            /*
			if(nowDateTime >= getTime(2016, 9, 14) && nowDateTime < getTime(2016, 9, 19)){
				$scope.appPushFlag = true;
			}
            */            

			$scope.param_cn = getParameterByName('cn');

			/* 이벤트 응모 */
			$scope.goApppush_Event = function(event_no){
				/* 간편회원 확인*/
				if(getCookie('MBRSCTCD') == "pnhZkYs9a5U="){
					 alert("간편계정 회원의 경우 응모가 불가합니다.\nL.POINT 통합회원 가입 후 신청해주세요.");
				}else{
					if($scope.loginInfo.isLogin){
						 $.ajax({
							type: 'post'
							, async: false                                      
							, url: '/event/regEvent.do?'+ $scope.baseParam
							, data: ({evt_no : event_no}) 
							, success: function(data) {
								  if(data.indexOf('0000')>-1){
										 alert("L.money 10점 적립 응모 완료! 월~일 모두 적립시 보너스 30점 추가! (매주 화요일 일괄 지급)");
								  }else if(data.indexOf('dup.err')>-1){
										 alert("오늘은 이미 적립하셨네요. 내일 또 만나요^^");
								  }
							}
						 });
					}else{
						 if(confirm('로그인 후 적립하실 수 있습니다.')){
							var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
							location.href = '/login/m/loginForm.do?' + targUrl;
						 }
					}                
				}
			}
			// 20160907 앱푸시 엘머니 증정 배너 추가
            
            $scope.todayCheckFlag = false; //출석체크 이전
            //달력그리기
            var calendarArr =  new Array(42);
            var liobj, cindex = 1;
            setTimeout(function(){
                /*0 : 안보임, 1 과거, 2 출석도장 , 3 오늘, 4 미래 평일, 5 미래 토요일, 6 미래 일요일 */            
                for(var i=0; i<42; i++){
                    calendarArr[i] = 0;            
                    if(i >= firstDate && cindex <= lastDate){
                        liobj = $(".calendar").find("li").eq(i);                    
                        liobj.find("span").text(cindex);
                        liobj.addClass("on");
                        if(cindex == todayDate){
                            liobj.addClass("today");
                        }else if(cindex > todayDate){
                            liobj.addClass("after");
                            if(i%7 == 0){
                                liobj.addClass("sun");
                            }else if(i%7 == 6){
                                liobj.addClass("sat");
                            }
                        }
                        cindex ++;
                    }            
                }
                //도장찍기 
                if($scope.attendTgtrListData != null){
                    for(i=0; i<$scope.attendTgtrListData.length; i++){
                        cindex = parseInt($scope.attendTgtrListData[i].sbscSgt_Dtime);
                        $(".calendar").find("li.on").eq(cindex - 1).addClass("check");
                        if(cindex == todayDate){
                            $scope.todayCheckFlag = true; //오늘 출석체크함  
                        }
                    }    
                }
                
                $scope.calendarArrInfo =  calendarArr;               
            }, 200);              

		})
		.error(function (data) {
			console.log("Error Data :  directAttendData 출석도장 에러");
		});
		
		// goLogin
		$scope.goLogin = function () {
			$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&targetUrl=" + encodeURIComponent($window.location.href, "UTF-8");
		};
		// banner link
		$scope.goLink = function () {
			$window.location.href = LotteCommon.prdlstUrl + "?" + $scope.baseParam + "&curDispNo=5400483&tclick=m_ck_08";
		};
		// 20161017 banner link 2
		$scope.goLinkTwo = function () {
			$window.location.href = "/event/luckyBox.do" + "?" +  $scope.baseParam + "&tclick=m_luckybox_ck_20161022";
		};

		// banner link 10월 5차
		$scope.goLinkLatte = function () {
			$window.location.href = "/event/luckyBox.do" + "?" + $scope.baseParam + "tclick=m_luckybox_ck_20161029";
		};

	}]);
	
	app.directive('lotteContainer', ['$http', '$location', '$window', 'LotteCommon' , 'commInitData', 'LotteForm','LotteUtil', 
		function ($http, $location, $window, LotteCommon, commInitData, LotteForm, LotteUtil) {
		return {
			templateUrl: '/lotte/resources_dev/event/direct_attend_container.html',
			replace: true,
			link: function ($scope, el, attrs) {
				var evtEntryYn = 2,
					chlNo = commInitData.query['cn'] ? commInitData.query['cn'] : "1";
                $scope.simple_msg = "고객님! 간편회원 고객님은 이벤트 참여가 제한됩니다.";  

				// 이벤트 대상 채널 세팅 응모대상  바로방문으로 접속한 모든 회원
				if (chlNo == "0" ||  // 미집계
					chlNo == "1" || // 모바일웹 롯데닷컴
					chlNo == "23" || // 모바일 롯데닷컴 (모바일앱)
					chlNo == "146" || // 롯데닷컴 메일
					chlNo == "510" || // 직접URL(롯데(lotte))
					chlNo == "109329" || // 이메일 모바일
					chlNo == "117124" || // SMART 바콘1
					chlNo == "117125" || // SMART 바콘 2
					chlNo == "120024" || // 모바일 미분류
					chlNo == "120724" || // SMART 바콘3
					chlNo == "125525" || // SMART 바콘4
					chlNo == "125526" || // SMART 바콘 5
					chlNo == "126124" || // SMART 바콘 교차 배포
					chlNo == "153527" || // 이메일 모바일 브릿지
					chlNo == "156027" || // SKT 이메일 쇼핑
					chlNo == "156025" || // SKT 모바일 앱
					chlNo == "132224" || // 앱 이메일 특가
					chlNo == "133025" || // 이메일 SMS
					chlNo == "140024" || // SMART 바콘 플래티넘
					chlNo == "133224" || // APP PUSH
					chlNo == "141224" || // 이거어때 앱
					chlNo == "140924" || // PC 제휴채널, 앱전환
					chlNo == "146724" || // 스마트픽 웹
					chlNo == "116824" || // 스마트픽 앱
					chlNo == "145524" || // 롯데닷컴 앱 (아이패드)
					chlNo == "123624" || // [모바일] 이거어때
					chlNo == "126824" || // 모바일 LMS
					chlNo == "156624" || // SKT 이거어때
					chlNo == "156026" || // T롯데닷컴 APP PUSH
					chlNo == "151224" || // 바탕화면 아이콘1
					chlNo == "171624" || // 롯데닷컴메일 개인화
					chlNo == "171625" || // 롯데닷컴메일 개인화 모바일
					chlNo == "171525" || // APP PUSH 개인화
					chlNo == "172324" || // T롯데닷컴 APP PUSH 개인화
					chlNo == "188026" || // 딥링크
					chlNo == "206525" || // 닷컴 -> 슈퍼 -> 닷컴 유입시 이벤트 참여
					chlNo == "206527" || // 닷컴 -> 슈퍼 -> 닷컴 유입시 이벤트 참여
					chlNo == "206529" // 닷컴 -> 슈퍼 -> 닷컴 유입시 이벤트 참여
					) {
					evtEntryYn = 1;
				}
/*
				var chlAddDate12 = new Date(2016, 1 - 1, 1); // 월은 -1 해주어야 함 (1월)
				if ($scope.todayDate.getTime() >= chlAddDate12.getTime()) { // 2016년 1월 1일 부터 채널값 4개 추가
					if (chlNo == "171624" || // 롯데닷컴 메일 개인화
						chlNo == "171625" || // 롯데닷컴 메일 개인화 모바일
						chlNo == "171525" || // APP PUSH (개인화)
						chlNo == "172324"// T롯데닷컴 APP PUSH (개인화)
						) {
						evtEntryYn = 1;
					}
				}
*/
				$scope.evtEntryYn = evtEntryYn;
				
				$scope.regAttend = function () {
                    if($scope.loginInfo.isLogin){
                        if($scope.loginInfo.isSimple){ //간편회원이면
                            alert($scope.simple_msg);
                            go_member_edit();
                        }else{
                            if ($scope.evtEntryYn == 1) {
                                var postParams = [];
                                postParams.evt_no = $scope.evtNo;
                                postParams.evt_type = "at";

                                LotteForm.FormSubmitForAjax(LotteCommon.registAttendData,postParams)
                                .success(function (data) {
                                    if (data.data_set.response_msg.indexOf("0000") > -1) {
                                        if($scope.screen1101){
                                            alert("출석체크 완료!!")
                                        }else{
                                            alert("출석도짱이 발급되었습니다.");
                                        }
                                        sessionStorage.clear(); //20160408
                                        if ($scope.yoil == 0 || $scope.yoil == 6) {
                                            $scope.totalClover = $scope.totalClover + 200;
                                        } else {
                                            $scope.totalClover = $scope.totalClover + 100;
                                        }
                                        //오늘날짜 도장 찍기                                    
                                        location.reload();
                                    } else {
                                        alert(data.data_set.response_msg);
                                    }
                                })
                                .error(function (ex) {
                                    if (ex.error.response_code == LOGIN_EXCEPTION) {
                                        alert(ex.error.response_msg);

                                        Fnproductview.goToLogin($window, $scope, LotteCommon.loginUrl);
                                    } else if (ex.error.response_code == 'M000200') {
                                        alert(ex.error.response_msg);
                                    } else {
                                        alert("프로그램 오류로 인해 처리되지 않았습니다.");
                                    }
                                });
                            } else {
                                if($scope.screen1101){
                                    $scope.attend_layer_flag = true;    
                                }else{
                                  alert("출석도짱은 바로방문on으로 접속하셔야만 찍을  수 있습니다.");  
                                }
                            }                           
                        }

                        
                    }else{
                        $scope.goLogin();
                    }
				};

				var cloverClickCheck = true; // 더블클릭방지
				var prom_no;
				var clvr_tp_cd;

				// var intClover = $scope.intClover;
				$scope.goExchangeClover = function (changeType) {
					if ($scope.loginInfo.isLogin) {
                        if($scope.loginInfo.isSimple){ //간편회원이면
                            alert($scope.simple_msg);
                            go_member_edit();
                        }else{
						  if (changeType == "freeDeliv") { // 클로버 1000개 무료배송권
							if ($scope.platinumMember) {
								alert("이미 플래티넘플러스 무료배송 혜택을 받고 계십니다.");
								return;
							} else if ($scope.freeDelivCnt < 1 && $scope.hour < 10) {
								alert("지금은 교환시간이 아닙니다\n오전 10시에  교환해 주세요.");
								return;
							} else if ($scope.freeDelivCnt >= 1) {
								alert("이미 교환 지급 되었습니다. 일주일 후에 다시 교환 해 주세요.");
								return;
							}else if ($scope.intClover < $scope.freeDelivCloverCnt) {
								alert("적립된 클로버가 부족합니다.\n나의 총 누적 클로버를 확인하세요.");
								return;
							} else if ($scope.freeDelivTotalCnt >= $scope.cloverNewCount) {
								alert("선착순 마감되었습니다.\n내일 오전10시에 다시 도전하세요.");
								return;
							} else {
								prom_no = $scope.freeDelivCpnNo;
								clvr_tp_cd = "U00002"; // 무료배송권
							}
						} else if (changeType == "LPoint") { // 매월 25,000명만! L-money 1천점 교환!
							if ($scope.lpEntryWinCnt >= 1 && $scope.lpEntryAstCnt == -1) {
								alert("이미 당첨, 교환 지급 되었습니다. 다음 이벤트에 다시 응모해 주세요.");
								return;
							}else if($scope.lpEntryWinCnt >= 1 && $scope.lpEntryAstCnt == 0){
                                alert("고객님의 소중한 L-money 1천점은 내일 자동지급 예정입니다!");
                                return;
                            }else if($scope.lpEntryWinCnt >= 1 && $scope.lpEntryAstCnt >= 1){
                                alert("이미 참여하셨습니다. \n다음 이벤트에 다시 응모해주세요!");
                                return;
                            } else if ($scope.lpEntryDailCnt >= 1) {
								alert("이미 응모했습니다. 내일 다시 응모해 주세요.");
								return;         
							} else if ($scope.intClover < 10000) {
								alert("적립된 클로버가 부족합니다.\n나의 총 누적 클로버를 확인하세요.");
								return;     
							} else {
								prom_no = $scope.lPointNo;
								clvr_tp_cd = "U00035"; // L-money
							}
						} else if (changeType == "cloverLayer1000") { // 클로버 1000개 3% 추가할인 쿠폰(백화점)
							if ($scope.sibECouponCnt < 1 && $scope.hour < 10) {
								alert("지금은 교환시간이 아닙니다\n오전 10시에  교환해 주세요.");
								return;
							} else if ($scope.sibECouponCnt >= 1) {
								alert("이미 교환 지급 되었습니다. 일주일 후에 다시 교환 해 주세요.");
								return;
							} else if ($scope.intClover < $scope.freeDelivCloverCnt) {
								alert("적립된 클로버가 부족합니다.\n나의 총 누적 클로버를 확인하세요.");
								return;
							} else if ($scope.sibETotalCouponCnt >= 100) {
								alert("선착순 마감되었습니다.\n내일 오전10시에 다시 도전하세요.");
								return; 
							} else {
								prom_no = $scope.cpnNo2;
								clvr_tp_cd = "U00043"; // 클로버 1000개 3% 추가할인 쿠폰(백화점)
							}
						} else if (changeType == "cloverLayer2000") { // 클로버 전용 2천원할인쿠폰
							if ($scope.chilCouponCnt < 1 && $scope.hour < 10) {
								alert("지금은 교환시간이 아닙니다\n오전 10시에  교환해 주세요.");
								return;     
							} else if ($scope.chilCouponCnt >= 1) {
								alert("이미 교환 지급 되었습니다. 일주일 후에 다시 교환 해 주세요.");
								return;
							} else if ($scope.intClover < $scope.cloverNewCount3) {
								alert("적립된 클로버가 부족합니다.\n나의 총 누적 클로버를 확인하세요.");
								return;
							} else if ($scope.chilTotalCouponCnt >= 300) {
								alert("선착순 마감되었습니다.\n내일 오전10시에 다시 도전하세요.");
								return;             
							} else {
								prom_no = $scope.cpnNo1;
								clvr_tp_cd = "U00042"; // 클로버 전용 2천원할인쿠폰
							}
						} else if (changeType == "cloverLayer3000") { // 클로버 전용 10% 할인쿠폰
							if ($scope.sibECouponCnt < 1 && $scope.hour < 10) {
								alert("지금은 교환시간이 아닙니다\n오전 10시에  교환해 주세요.");
								return;     
							} else if ($scope.sibECouponCnt >= 1) {
								alert("이미 교환 지급 되었습니다. 일주일 후에 다시 교환 해 주세요.");
								return;
							} else if ($scope.intClover < $scope.freeDelivCloverCnt) {
								alert("적립된 클로버가 부족합니다.\n나의 총 누적 클로버를 확인하세요.");
								return;
							} else if ($scope.sibETotalCouponCnt >= 400) {
								alert("선착순 마감되었습니다.\n내일 오전10시에 다시 도전하세요.");
								return; 
							} else {
								prom_no = $scope.cpnNo2;
								clvr_tp_cd = "U00041"; // 클로버 전용 10% 할인쿠폰
							}
						} else { // 클로버 전용 1만점 적립쿠폰
							if ($scope.ilManCouponCnt < 1 && $scope.hour < 10) {
								alert("지금은 교환시간이 아닙니다\n오전 10시에  교환해 주세요.");
								return;
							}else if ($scope.ilManCouponCnt >= 1) {
								alert("이미 교환 지급 되었습니다. \n일주일 후에 다시 교환 해 주세요.");
								return;
							} else if ($scope.intClover < 3000) {
								alert("적립된 클로버가 부족합니다.\n나의 총 누적 클로버를 확인하세요.");
								return;
							} else if ($scope.ilManTotalCouponCnt >= $scope.cloverNewCount) {
								alert("선착순 마감되었습니다.\n내일 오전10시에 다시 도전하세요.");
								return;
							} else {
								prom_no = $scope.cpnNo3;
								clvr_tp_cd = "U00027"; // 클로버 전용 1만점 적립쿠폰
							}
						}
						  if (cloverClickCheck) {
							cloverClickCheck = false;
							var evt_type;

							if (changeType == "LPoint") {
								// var postParams = $scope.baseParam;
								var postParams = [],
									postURL = LotteCommon.registAttendData;

								postParams.evt_no = $scope.evtNo;
								postParams.evt_type = "lw";
								postParams.prom_no = prom_no;
								postParams.clvr_tp_cd = clvr_tp_cd;

								postURL += "?evt_no=" + $scope.evtNo;
								postURL += "&evt_type=lw";
								postURL += "&prom_no=" + prom_no;
								postURL += "&clvr_tp_cd=" + clvr_tp_cd;
								
								// loadURL = '/event/regDirectAttend.do';
								$http({
									// url : '/event/regDirectAttend.do',
									url: postURL,
									data: $.param(postParams),
									method: "post",
									headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
								}) // AJAX 호출
								.success(function (data, status, headers, config) { // 호출 성공시
									if (data.data_set.response_msg.indexOf("8888") > -1) {
										//alert("L-money 1000점이 지급 되었습니다.");
                                        alert("축하합니다!\n고객님의 소중한 L-money 1천점은 내일 자동지급 예정입니다!");//20180208
									} else if (data.data_set.response_msg.indexOf("0000") > -1) {
										alert("오늘은 아쉽게도 꽝. 내일 다시 도전해 주세요!");
									} else {
										alert(data.data_set.response_msg);
									}

									$scope.lpEntryDailCnt = 1;

									//리로드 처리 필요
									window.location.reload(); 
									//$window.location.href = baseUrl + "/event/direct_attend_dev.html" + "?" + $scope.baseParam;
								})
								.error(function (data, status, headers, config) { // 호출 실패시
									alert("error");
								});
							} else {
								evt_type = "cl";
								// var postParams = $scope.baseParam;

								var postParams = [];
								postParams.evt_no = $scope.evtNo;
								postParams.evt_type = "cl";
								postParams.prom_no = prom_no;
								postParams.clvr_tp_cd = clvr_tp_cd;

								var evtUrl = LotteCommon.registAttendData;
								evtUrl += "?evt_no=" + $scope.evtNo;
								evtUrl += "&evt_type=" + "cl";
								evtUrl += "&prom_no=" + prom_no;
								evtUrl += "&clvr_tp_cd=" + clvr_tp_cd;
								
								$http({
									// url : '/event/regDirectAttend.do',
									url : evtUrl,
									method : "POST",
									headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
								}) // AJAX 호출
								.success(function (data, status, headers, config) { // 호출 성공시
									//20161027 스탬프 레이어 띄우는 부분
                                    if($scope.screen1101){
                                        alert("쿠폰이 발급 되었습니다.");
                                        location.reload();
                                    }else{
                                        openCloverLayer(changeType);    
                                    }
                                    
								})
								.error(function (data, status, headers, config) { // 호출 실패시
									alert("error");
								});
							}
						}
                        }
					} else {
						$scope.goLogin();
					}
				};
				
				var openCloverLayer = function (layerClover) {
					if (layerClover == "freeDeliv") {
						$('.stamp_layer > .cont').addClass("typeb");
					} else if (layerClover == "cloverLayer3000") {
						$('.stamp_layer > .cont').addClass("typea");
					} else if (layerClover == "cloverLayer1000") {
						$('.stamp_layer > .cont').addClass("typea");        
					} else if (layerClover == "cloverLayer2000") {
						// $('.stamp_layer > .cont').addClass("");
					}

					$('.stamp_layer').show();
				};
				
				$scope.closePop = function () {
					$('.stamp_layer').hide();
				};

				$scope.closeInfoPop = function () {
					if(!$scope.screen1101){
                        $("#visitPop").hide();
                    }
					$("#cpType").removeClass("btype");
					$("#cpType").removeClass("ctype");
					$("#cpType").removeClass("dtype");  
				};
				
				$scope.goPointCoupon = function () {
					var baseUrl = $location.protocol() + "://" + $location.host();

					$scope.closeInfoPop();
					$window.location.href = baseUrl + "/mylotte/pointcoupon/point_info.do" + "?" + $scope.baseParam + "&point_div=clover";
					// document.location.href = "/mylotte/pointcoupon/point_info.do?<%=commonParam %>&point_div=clover";
				};
                                
                //회원가입페이지로 이동하기 위해서 가져온 소스 
                //회원 정보 수정 페이지
                function go_member_edit(){   
                    var link = "https://member.lpoint.com/door/user/login_common.jsp?sid=DOTCOM&mallcode=510&tracking=COMMON_UTIL_04";
                    if($scope.appObj.isApp){
                        openNativePopup('회원가입', link);
                    }else{
                        window.open(link, "family");    
                    }                    
                }                                
			}
		};
	}]);
})(window, window.angular);