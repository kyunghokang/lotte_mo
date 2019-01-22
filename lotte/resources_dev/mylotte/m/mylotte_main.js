(function(window, angular, undefined) {
	'use strict';
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter'
	]);

	app.controller('MyLotteMainCtrl', ['$scope', '$http', '$window', 'commInitData', 'LotteCommon', 'LotteCookie', 'LotteUtil',  function($scope, $http, $window, commInitData, LotteCommon, LotteCookie, LotteUtil) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "마이롯데"; //서브헤더 타이틀
		$scope.isShowThisSns = false; //공유하기

		$scope.memberLoginPopup = false; //회원정보변경 팝업
		$scope.welcomeFlag = false;
		$scope.isShowLoadingImage = true; // 로딩이미지 출력 여부

		$scope.grockle_yn = false;
		var strGrockle_yn = commInitData.query['grockle_yn']!= null?commInitData.query['grockle_yn']:"N";
		$scope.grockle_yn =  strGrockle_yn == 'Y'?true:false;

		$scope.schema = "";
		$scope.schema = commInitData.query['schema']!= null?commInitData.query['schema']:"";

        // TEST Date 20171201
        $scope.todayDate = new Date();
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
        $scope.newVer = false;
        if($scope.todayDate.getTime() >= (new Date(2017, 12 - 1,1)).getTime()){
            $scope.newVer = true;
        }	
        
		// 간편회원 쿠키값 체크
		this.getCookie = function(cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
			}
			return "";
		};


		var custIdData = "";
		if(typeof(SEED_DATA) != undefined) {
			custIdData = SEED_DATA;
		}

		var easyJoinCookie = this.getCookie("SIMPLESIGNYN");
		var side_big = LotteUtil.getLoginSeed().toUpperCase();
		var main_url = encodeURIComponent(
			   ($scope.schema == ""? LotteCommon.baseUrl:($scope.schema + LotteCommon.baseUrl.replace("http", ""))) + "/"
			   + (LotteUtil.isSmp() ? "main_smp.do" : "main.do")
			   + $scope.baseParam, "UTF-8");

		var return_url = '';

		// 앱/웹 분기처리
		if($scope.schema == "") {
		 	return_url = encodeURIComponent(window.location.href, "UTF-8");
		}else{
			return_url = window.location.href.replace(/^http(s)?/,$scope.schema);
		}

		var family_url = LotteCommon.changeMyInfoUrl +
						"?sid=" + side_big +
						"&returnurl=" + return_url +
						"&main_url=" + main_url +
						"&custid=" + custIdData +
						"&loginid=" + LotteCookie.getCookie('LOGINID') +
						"&pageflag=I" +
						"&opentype=P" +
						"&sch=" + $scope.schema;

		var memeberOut_url = LotteCommon.memberOutUrl  +
			"?sid=" + side_big +
			"&returnurl=" + return_url +
			"&main_url=" + main_url +
			"&custid=" + custIdData+
			"&loginid=" + LotteCookie.getCookie('LOGINID') +
			"&opentype=P" +
			"&sch=" + $scope.schema;

			// $.ajax({ // 로그인 페이지 초기정보 로드
			// 	type: 'post'
			// 	, async: false
			// 	, url: LotteCommon.loginInitUrl
			// 	, data: $('#frm').serialize()
			// 	, success: function (data) {
			// 		// $scope.saveId = data.saveId;
			// 		// $scope.saveIdEasy = data.saveIdEasy;
			// 		// $scope.loginId = data.loginId;
			// 		// $scope.minority_yn = data.minority_yn == "Y" ? true : false;
			// 		// $scope.smp_buy_yn = data.smp_buy_yn == "Y" ? true : false;
			// 		// $scope.gubun = data.gubun;
			// 		// $scope.joinBtnViewInfo = data.joinBtnViewInfo;
			// 		//
			// 		// $scope.curr_time = data.curr_time;
			// 		// $scope.web_scheme = data.requestScheme;
			// 		//
			// 		// $scope.requestContextPath = data.requestContextPath;
			// 		// $scope.requestUri = data.requestUri;
			// 		// $scope.requestSecure = data.reqeustSecure;
			// 		// $scope.requestReferer = data.requestReferer;
			// 		$scope.requestUserAgent = data.requestUserAgent;
			// 		console.log($scope.requestUserAgent);
			// 	}
			// 	, error: function (data) {
			// 		//alert(data);
			// 	}
			// });
			//
			var uagent = navigator.userAgent;
			// console.log(navigator.userAgent)
		// 로그인 정보 체크 후 로그인 페이지로 리턴
		//    	if(!$scope.loginInfo.isLogin){
		//    		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
		//        	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
		//    	}

		// data url 20160315
		var mylotteMainData = LotteCommon.mylotteMainData + "?smartAlarmViewTime="+localStorage.getItem("smart_alarm_view_time")+"&viewGoods="+localStorage.getItem("latelyGoods");
		// data get
		$http.get(mylotteMainData + "&" + $scope.baseParam)
		.success(function(data) {
			if(data.resultCode==1000){
				$scope.contents = {};
				$scope.subTitle = "마이롯데";
				$scope.noData = true;
				$scope.contVisible = false;
			} else {
				// 마이롯데 데이터
				$scope.myLotteMainInfo = data.mylotte;
				$scope.myGradeType = data.mylotte.mbrGradeCd;
				// 웰컴회원 확인
				if(data.mylotte.mbrGradeCd == '80'){
					if(data.mylotte.couponInfo.mbr_down_yn != 'Y') {
						$scope.welcomeFlag = true;
					}
				}

				//2016.03.22 알람 New
				$scope.alarmFlag = false;
				if($scope.myLotteMainInfo.newAlarmYn == 'Y'){
				   $scope.alarmFlag = true;
				}

				family_url = LotteCommon.changeMyInfoUrl +
					"?sid=" + side_big +
					"&returnurl=" + return_url +
					"&main_url=" + main_url +
					"&custid=" + $scope.myLotteMainInfo.seedCustId +
					"&loginid=" + LotteCookie.getCookie('LOGINID') +
					"&pageflag=I" +
					"&opentype=P" +
					"&sch=" + $scope.schema;

				memeberOut_url = LotteCommon.memberOutUrl  +
					"?sid=" + side_big +
					"&returnurl=" + return_url +
					"&main_url=" + main_url +
					"&custid=" + $scope.myLotteMainInfo.seedCustId +
					"&loginid=" + LotteCookie.getCookie('LOGINID') +
					"&opentype=P" +
					"&sch=" + $scope.schema;
			}

			$scope.isShowLoadingImage = false;
		})
		.error(function(data, status, headers, config){
			console.log('Error Data : ', status, headers, config);
			$scope.isShowLoadingImage = false;
		});

//        // Code value change
//        $scope.changeCode = function() {
//        	var myGradeType =
//        		if($scope.myGradeTyep = )
//        }

		// link urls
		$scope.myLotteMainLinkObj = {
				'ordLstUrl' : LotteCommon.ordLstUrl + "?" + $scope.baseParam+"&searchFlag=D15&ordDtlStatCd=10&tclick=m_DC_MyPage_Clk_Btn_9", // 주문/배송조회
				'ordLstM1Url' : LotteCommon.ordLstUrl + "?" + $scope.baseParam+"&searchFlag=M1&ordDtlStatCd=10&tclick=m_DC_MyPage_Clk_Btn_9", // 주문/배송조회
				'ordCancelUrl' : LotteCommon.ordCancelUrl + "?" + $scope.baseParam+"&fromPg=3&ordListCase=3&tclick=m_DC_MyPage_Clk_Btn_10", // 취소/교환/반품내역
				'ecouponListUrl' : LotteCommon.baseUrl + "/smartpick/smp_cpn_rfd_list.do?c=mlotte&udid=&v=&cn=&cdn=&tclick=m_DC_MyPage_Clk_Btn_11",// e-쿠폰 환불신청
				// 'receiptEventUrl' : LotteCommon.baseUrl + "/event/receipt.do?" + $scope.baseParam + "&tclick=m_dc_MyPage_Clk_Btn_receiptevent",// 영수증이벤트
				'attendEventUrl' : LotteCommon.baseUrl + "/event/m/directAttend.do?" + $scope.baseParam + "&tclick=m_dc_MyPage_Clk_Btn_attendcheck",// 출석체크이벤트
				'critViewUrl' : LotteCommon.critViewUrl + "?" + $scope.baseParam +"&tclick=m_DC_MyPage_Clk_Btn_12",// 상품평작성
				'eventGumeUrl' : LotteCommon.eventGumeUrl + "?" + $scope.baseParam + "&search_div=event_list&tclick=m_DC_MyPage_Clk_Btn_13", // 이벤트 응모/당첨
				'mylotteReinquiryListUrl' : LotteCommon.mylotteReinquiryListUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_14", // 상품문의 답변확인
				'lPayEasyUrl' : LotteCommon.lPayEasyUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_14", // L.pay 간편결제
				'orderAlarmYnUrl' : LotteCommon.orderAlarmYnUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_17", // 주문정보 수신설정
				'smartpayUrl' : LotteCommon.smartpayUrl + "?" + $scope.baseParam+"&tclick=m_DC_MyPage_Clk_Btn_15", // 스마트페이관리
				'questionUrl' : LotteCommon.questionUrl + "?" + $scope.baseParam+"&tclick=m_DC_MyPage_Clk_Btn_16", // 1:1 문의하기
				'cscenterAnswerUrl' : LotteCommon.cscenterAnswerUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_19", // 1:1 문의답변확인
				'friendCouponUrl' : LotteCommon.baseUrl + "/event/couponBook.do?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_1", // 절친쿠폰북
				'gdBenefitUrl' : LotteCommon.gdBenefitUrl + "?" +  $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_29",// 참좋은혜택
				'talkUrl': LotteCommon.talkUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_22", // 채팅상담 : 채팅 이동
				'talkIntroUrl': LotteCommon.talkIntroUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_28", // 스마트채팅 : 소개페이지 이동
				'smartAlarmUrl' : LotteCommon.smartAlarmUrl + "?" + $scope.baseParam+"&curDispNoSctCd=22&tclick=m_DC_MyPage_Clk_Btn_23", //알림
				'wishLstUrl' : LotteCommon.wishLstUrl + "?" + $scope.baseParam+"&tclick=m_DC_MyPage_Clk_Btn_25", //위시리스트
				'cscenterMain' : "/custcenter/cscenter_main.do?"+ $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_18", // 1:1 상담/채팅/답변
				'QandA' : "/mylotte/product/m/mylotte_reinquiry_list.do?"+ $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_16", // Q&A
				'ordLst2Url' : LotteCommon.ordLstUrl + "?" + $scope.baseParam+"&fromPg=3&tclick=m_DC_MyPage_Clk_Btn_10", //비로그인시 주문배송조회
				'presentList' : LotteCommon.presentListUrl + "?" + $scope.baseParam
		};
		/* 최근상품 더보기 링크 (IOS에서 historyback 캐시오류) */
		$scope.myLotteLateProd = function(){
			// $scope.closeSideMylotte();
			setTimeout(function(){
				$window.location.href  = LotteCommon.lateProdUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_26&viewGoods="+localStorage.getItem("latelyGoods");
			});
		}
		/*자주 구매 상품 더보기 링크*/
		$scope.myLotteOftenProd = function(){
			// $scope.closeSideMylotte();
			setTimeout(function(){
				$window.location.href  = LotteCommon.oftenProdUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_29&viewGoods="+localStorage.getItem("latelyGoods");
			});
		}

		// L-point click
		$scope.lPointClick = function(){
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=lt_point&tclick=m_DC_MyPage_Clk_Btn_3";
		}

		// L-money click
		$scope.lMoneyClick = function(){
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=l_point&tclick=m_DC_MyPage_Clk_Btn_4";
		}

		// 보관금 click
		$scope.depositClick = function(){
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=deposit&tclick=m_DC_MyPage_Clk_Btn_5";
		}

		// 쿠폰 click
		$scope.couponClick = function(){
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=coupon&tclick=m_DC_MyPage_Clk_Btn_6";
		}

		// 클로버 click
		$scope.cloverClick = function(){
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=clover&tclick=m_DC_MyPage_Clk_Btn_7";
		}

		// 스마트픽 교환권 click
		$scope.smartPickClick = function(){
			$window.location.href = LotteCommon.smartPickListUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_8";
		}

		// 주문배송조회 건별 조회
		$scope.ordDetailClick = function(type){
			var clickType = type.toString().substr(1,1);
			$window.location.href = LotteCommon.ordLstUrl + "?" + $scope.baseParam + "&searchFlag=D15&ordDtlStatCd=10&orderListType=" + type + "&tclick=m_DC_MyPage_Clk_Lnk_" + clickType;
		}

		// 웰컴회원 닫기
		$scope.welcomeClose = function() {
			$scope.welcomeFlag = false;
		}

		$scope.goPointCoupon = function(){
			var baseUrl = $location.protocol() + "://" + $location.host();
			//$scope.closeInfoPop();
			$window.location.href = baseUrl + "/mylotte/pointcoupon/point_info.do" + "?" + $scope.baseParam + "&point_div=coupon";
		}

		// 회원정보 수정
		$scope.memeberChagne = function() {
			if($scope.loginInfo.isLogin){
				//4월 20일 로그인정보 체크
				if($scope.myLotteMainInfo.valid_login == false){
					console.log('2015년4월20일 이전 로그인 유저');
					$scope.memberLoginPopup = true;
					$scope.dimmedOpen({
						target : "memberPopup",
						callback: $scope.closePopup
					});
				} else if(easyJoinCookie == "Y"){
					alert("간편회원의 정보변경/탈퇴는 PC에서만 가능합니다.");
					return false;
				} else {
					// 회원정보 수정
					$scope.sendTclick("m_DC_MyPage_Clk_Btn_20");
					outLink(family_url);
				}
			}else{
				alert("로그인 후 이용 가능합니다.");
			}
		}

		// 회원탈퇴
		$scope.memberOut = function() {
			if($scope.loginInfo.isLogin){
				//4월 20일 로그인정보 체크
				if($scope.myLotteMainInfo.valid_login == false){
					console.log('2015년4월20일 이전 로그인 유저');
					// 안내팝업
					$scope.memberLoginPopup = true;
					$scope.dimmedOpen({
						target : "memberPopup",
						callback: $scope.closePopup
					});
				} else if(easyJoinCookie == "Y"){
					alert("간편회원의 정보변경/탈퇴는 PC에서만 가능합니다.");
					return false;
				} else {
					$scope.sendTclick("m_DC_MyPage_Clk_Btn_21");
					outLink(memeberOut_url);
				}
			}else{
				alert("로그인 후 이용 가능합니다.");
			}
		}

		// 로그인
		$scope.goLoginClick = function() {
			//$window.location.href = LotteCommon.logoutUrl;
			//var currentLoc = $window.location.href.split("tclick");
			var targUrl = "&tclick=m_DC_MyPage_Clk_Btn_27&targetUrl=" + encodeURIComponent(LotteCommon.mylotteUrl + "?" + $scope.baseParam, 'UTF-8');
			$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
		}

		//회원가입

		$scope.goFamilySite = function (div) {
				if($scope.appObj.isIOS && $scope.appObj.isApp){
					$scope.sendTclick("m_DC_Mypage_Clk_Btn_28");
					// alert('ios 이고 앱 입니다')
					var requestData = "smp_yn=";
			    $.ajax( {
			        type: 'post',
			        async: false,
			        url: LotteCommon.getJoinBtnViewAjaxUrl,
							// url : "http://mt.lotte.com/json/login/getJoinBtnViewAjax.json",
			        success: function(data) {
			           data = data.result.trim();
			             if ( data == "Y" ){
			               alert("[아이디/비밀번호 찾기, 회원가입] 서비스는 일시적으로 롯데닷컴/엘롯데 PC를 통해 이용가능합니다. 이용에 불편을 드려 죄송합니다."); //링크를 막고 알럿을 띄움
			             }else{
			              //  alert("데이터 넘어오고 링크"); //아무것도 안하고 링크 연결해줌.
										 var family_url = "member.lpoint.com/door/user/mobile/";
	 									var main_url = encodeURIComponent(
	 										($scope.schema == ""? LotteCommon.baseUrl:($scope.schema + LotteCommon.baseUrl.replace("http", ""))) + "/"
	 										+ (LotteUtil.isSmp() ? "main_smp.do" : "main.do")
	 										+ $scope.baseParam, "UTF-8");
	 									var target_url = "";
	 									var return_url = window.location.href;

	 									if ($scope.schema == "") {
	 										return_url = encodeURIComponent(window.location.href, "UTF-8");
	 									} else {
	 										return_url = encodeURIComponent(return_url.replace($scope.web_scheme, $scope.schema), "UTF-8");
	 									}

	 									if (div == "id") { // 아이디찾기
	 										target_url = "requestId.jsp";
	 									} else if (div == "passwd") { // 비밀번호 찾기
	 										target_url = "requestPasswd.jsp";
	 									} else if (div == "mem_reg") { // 회원가입
	 										target_url = "login_common.jsp";
	 									}

	 									family_url += (target_url + "?sid=" + LotteUtil.getLoginSeed() + "&returnurl=" + return_url + "&main_url=" + main_url);
	 									family_url += "&sch=" + $scope.schema;
										$scope.sendOutLink("https://" + family_url, "family");
										// 	window.open("https://" + family_url, "family");
			             }
			        },
							error:function(r){
			            alert(r.message);
			        }
			        // error:function(r){
			        //     alert("데이터 안넘어옴");
							// 		var family_url = "member.lpoint.com/door/user/mobile/";
							// 		var main_url = encodeURIComponent(
							// 			($scope.schema == ""? LotteCommon.baseUrl:($scope.schema + LotteCommon.baseUrl.replace("http", ""))) + "/"
							// 			+ (LotteUtil.isSmp() ? "main_smp.do" : "main.do")
							// 			+ $scope.baseParam, "UTF-8");
							// 		var target_url = "";
							// 		var return_url = window.location.href;
							//
							// 		if ($scope.schema == "") {
							// 			return_url = encodeURIComponent(window.location.href, "UTF-8");
							// 		} else {
							// 			return_url = encodeURIComponent(return_url.replace($scope.web_scheme, $scope.schema), "UTF-8");
							// 		}
							//
							// 		if (div == "id") { // 아이디찾기
							// 			target_url = "requestId.jsp";
							// 		} else if (div == "passwd") { // 비밀번호 찾기
							// 			target_url = "requestPasswd.jsp";
							// 		} else if (div == "mem_reg") { // 회원가입
							// 			target_url = "login_common.jsp";
							// 		}
							//
							// 		family_url += (target_url + "?sid=" + LotteUtil.getLoginSeed() + "&returnurl=" + return_url + "&main_url=" + main_url);
							// 		family_url += "&sch=" + $scope.schema;
							// 		window.open("https://" + family_url, "family");
			        // }
			    } );

				}else{
					// alert('그냥 웹입니다')
					$scope.goFamilySite2(div);
				}
		}

		$scope.goFamilySite2 = function (div) {
			// rudolph:151112 tclick
			if (div == "id") {
				$scope.sendTclick("m_DC_login_clk_Lnk_1");
			} else if (div == "passwd") {
				$scope.sendTclick("m_DC_login_clk_Lnk_2");
			} else if (div == "mem_reg") {
				$scope.sendTclick("m_DC_Mypage_Clk_Btn_28");
			}

			if ($scope.joinBtnViewYn == "N") {
				// 2015.05.29 iOS 닷컴, 엘롯데 APP 회원가입 pro 공통코드로 제어
				var isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);

				if ((div == "id" || div == "passwd" || div == "mem_reg") && isIDevice) {
					alert("[아이디/비밀번호 찾기, 회원가입] 서비스는 일시적으로 롯데닷컴/엘롯데 PC를 통해 이용가능합니다. 이용에 불편을 드려 죄송합니다.");
					return;
				}
			}

			var family_url = "member.lpoint.com/door/user/mobile/";
			var main_url = encodeURIComponent(
				($scope.schema == ""? LotteCommon.baseUrl:($scope.schema + LotteCommon.baseUrl.replace("http", ""))) + "/"
				+ (LotteUtil.isSmp() ? "main_smp.do" : "main.do")
				+ $scope.baseParam, "UTF-8");
			var target_url = "";
			var return_url = window.location.href;

			if ($scope.schema == "") {
				return_url = encodeURIComponent(window.location.href, "UTF-8");
			} else {
				return_url = encodeURIComponent(return_url.replace($scope.web_scheme, $scope.schema), "UTF-8");
			}

			if (div == "id") { // 아이디찾기
				target_url = "requestId.jsp";
			} else if (div == "passwd") { // 비밀번호 찾기
				target_url = "requestPasswd.jsp";
			} else if (div == "mem_reg") { // 회원가입
				target_url = "login_common.jsp";
			}

			family_url += (target_url + "?sid=" + LotteUtil.getLoginSeed() + "&returnurl=" + return_url + "&main_url=" + main_url);
			family_url += "&sch=" + $scope.schema;

			if ($scope.schema != "") { // 앱일경우
				if (LotteUtil.boolAppInstall(uagent)) {
					window.location = "family://" + family_url;
				} else if (LotteUtil.boolAndroid(uagent)) {
					window.myJs.callAndroid("https://" + family_url);
				}
			} else {
				window.open("https://" + family_url, "family");
			}
		};


		// 닫기
		$scope.closePopup = function(){
			$scope.memberLoginPopup = false;
			$scope.dimmedClose();
		}

	}]);

	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/mylotte/m/mylotte_main_container.html',
			replace : true,
			link : function($scope, el, attrs) {
			}
		};
	});

	app.filter('textOrNumber', ['$filter', function ($filter) {
		return function (input, fractionSize) {
			if (isNaN(input)) {
				return input;
			} else {
				return $filter('number')(input, fractionSize);
			};
		};
	}]);

	// 회원탈퇴팝업
	app.directive('memberPopup', ['$window', '$location', function($window, $location) {
		return {
			templateUrl:'/lotte/resources_dev/mylotte/m/popup_mem.html',
			replace:true,
			link:function($scope, el, attrs) {

			}
		};
	}]);

	// 웰컴회원
	app.directive('welcomePopup', ['$window', '$location', function($window, $location) {
		return {
			templateUrl:'/lotte/resources_dev/mylotte/m/popup_welcomePop.html',
			replace:true,
			link:function($scope, el, attrs) {

			}
		};
	}]);

})(window, window.angular);
