(function(window, angular, undefined) {
	'use strict';
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter'
	]);

	app.controller('MyLotteMainCtrl', ['$scope', '$http', '$window', '$timeout', 'commInitData', 'LotteCommon', 'LotteCookie', 'LotteUtil', 'LotteGA', 'LotteStorage', 'LotteUserService', function($scope, $http, $window, $timeout, commInitData, LotteCommon, LotteCookie, LotteUtil, LotteGA, LotteStorage, LotteUserService) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "마이롯데"; //서브헤더 타이틀
		$scope.isShowThisSns = false; //공유하기

		$scope.memberLoginPopup = false; //회원정보변경 팝업
		$scope.welcomeFlag = false;
		$scope.isShowLoadingImage = true; // 로딩이미지 출력 여부
		$scope.gaCtgName = "MO_마이롯데";

		$scope.grockle_yn = false;
		var strGrockle_yn = commInitData.query['grockle_yn']!= null?commInitData.query['grockle_yn']:"N";
		$scope.grockle_yn =  strGrockle_yn == 'Y'?true:false;
		$scope.schema = "";
		$scope.schema = commInitData.query['schema']!= null?commInitData.query['schema']:"";

		$scope.dummyProfileUrl = "http://image.lotte.com/lotte/mo2018/reviews/default_profile.png";

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
		// 상품평 미작성 알림 팝업
    	$scope.reviewPopHide = LotteCookie.getCookie('reviewNotice') || 'N';
    	if($scope.reviewPopHide != 'Y')	$scope.reviewPopFlag = true;

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
		var mylotteMainData = LotteCommon.mylotteMainData + "?smartAlarmViewTime="+LotteStorage.getLocalStorage("smart_alarm_view_time")+"&viewGoods="+LotteStorage.getLocalStorage("latelyGoods");
		// data get
		var getMyLotteDataUrl = mylotteMainData + "&" + $scope.baseParam + "&_ts=" + Date.now(); // 20190110 로그인 후 뒤로가기 정책 수정건 afterjob
		$http.get(getMyLotteDataUrl)
		.success(function(data) {
			if(data.resultCode==1000){
				$scope.contents = {};
				$scope.subTitle = "마이롯데";
				$scope.noData = true;
				$scope.contVisible = false;
			} else {
				// 마이롯데 데이터
				$scope.myLotteMainInfo = data.mylotte;

				// 20181127 클로버 / 쿠폰개수 최대수 표시방법  
				if($scope.myLotteMainInfo.clover >= 100000){
					$scope.myLotteMainInfo.clover = "99,999+";
				}

				if($scope.myLotteMainInfo.couponCnt >= 1000){
					$scope.myLotteMainInfo.couponCnt = "999+";
				}

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
				'ordLstUrl' : {'key':LotteCommon.ordLstUrl + "?" + $scope.baseParam+"&searchFlag=D15&ordDtlStatCd=10&tclick=m_DC_MyPage_Clk_Btn_9",'act':'주문배송조회','lab':'주문배송조회'}, // 주문/배송조회
				'ordLstM1Url' : LotteCommon.ordLstUrl + "?" + $scope.baseParam+"&searchFlag=M1&ordDtlStatCd=10&tclick=m_DC_MyPage_Clk_Btn_9", // 주문/배송조회
				'ordCancelUrl' : {'key':LotteCommon.ordCancelUrl + "?" + $scope.baseParam+"&fromPg=3&ordListCase=3&tclick=m_DC_MyPage_Clk_Btn_10",'act':'문의하기','lab':'취소/교환/반품조회'}, // 취소/교환/반품내역
				'ecouponListUrl' : LotteCommon.baseUrl + "/smartpick/smp_cpn_rfd_list.do?c=mlotte&udid=&v=&cn=&cdn=&tclick=m_DC_MyPage_Clk_Btn_11",// e-쿠폰 환불신청
				// 'receiptEventUrl' : LotteCommon.baseUrl + "/event/receipt.do?" + $scope.baseParam + "&tclick=m_dc_MyPage_Clk_Btn_receiptevent",// 영수증이벤트
				'attendEventUrl' : {'key':LotteCommon.baseUrl + "/event/m/directAttend.do?" + $scope.baseParam + "&tclick=m_dc_MyPage_Clk_Btn_attendcheck",'act':'이벤트','lab':'출석체크이벤트'},// 출석체크이벤트
				'critViewUrl' : LotteCommon.critViewUrl + "?" + $scope.baseParam +"&tclick=m_DC_MyPage_Clk_Btn_12",// 상품평작성
				'eventGumeUrl' : {'key':LotteCommon.eventGumeUrl + "?" + $scope.baseParam + "&search_div=event_list&tclick=m_DC_MyPage_Clk_Btn_13",'act':'이벤트','lab':'이벤트응모내역'}, // 이벤트 응모/당첨
				'mylotteReinquiryListUrl' : LotteCommon.mylotteReinquiryListUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_14", // 상품문의 답변확인
				'lPayEasyUrl' : {'key':LotteCommon.lPayEasyUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_14",'act':'간편결제','lab':'L.pay간편결제신청'}, // L.pay 간편결제
				'orderAlarmYnUrl' : LotteCommon.orderAlarmYnUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_17", // 주문정보 수신설정
				'smartpayUrl' : {'key':LotteCommon.smartpayUrl + "?" + $scope.baseParam+"&tclick=m_DC_MyPage_Clk_Btn_15",'act':'간편결제','lab':'스마트페이관리'}, // 스마트페이관리
				'questionUrl' : LotteCommon.questionUrl + "?" + $scope.baseParam+"&tclick=m_DC_MyPage_Clk_Btn_16", // 1:1 문의하기
				'cscenterAnswerUrl' : LotteCommon.cscenterAnswerUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_19", // 1:1 문의답변확인
				'friendCouponUrl' : LotteCommon.baseUrl + "/event/couponBook.do?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_1", // 절친쿠폰북
				'gdBenefitUrl' : {'key':LotteCommon.gdBenefitUrl + "?" +  $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_29",'act':'회원보유자산','lab':'멤버십/쿠폰존'},// 참좋은혜택
				// 'talkUrl': LotteCommon.talkUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_22", // 채팅상담 : 채팅 이동
				// 'talkIntroUrl': LotteCommon.talkIntroUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_28", // 스마트채팅 : 소개페이지 이동
				'talkUrl': {'key':LotteCommon.talkUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_28",'act':'문의하기','lab':'실시간채팅상담'}, // 스마트채팅 : 소개페이지 이동
				'smartAlarmUrl' : {'key':LotteCommon.smartAlarmUrl + "?" + $scope.baseParam+"&curDispNoSctCd=22&tclick=m_DC_MyPage_Clk_Btn_23",'act':'알림','lab':'알림내역보기'}, //알림
				'wishLstUrl' : {'key':LotteCommon.wishLstUrl + "?" + $scope.baseParam+"&tclick=m_DC_MyPage_Clk_Btn_25",'act':'관심상품','lab':'위시리스트'}, //위시리스트
				'cscenterMain' : {'key':"/custcenter/cscenter_main.do?"+ $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_18",'act':'문의하기','lab':'1:1문의/답변'}, // 1:1 상담/채팅/답변
				'QandA' : {'key':"/mylotte/product/m/mylotte_reinquiry_list.do?"+ $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_16",'act':'문의하기','lab':'나의상품Q&A'}, // Q&A
				'ordLst2Url' : LotteCommon.ordLstUrl + "?" + $scope.baseParam+"&fromPg=3&tclick=m_DC_MyPage_Clk_Btn_10", //비로그인시 주문배송조회
				'presentList' : {'key':LotteCommon.presentListUrl + "?" + $scope.baseParam,'act':'선물함','lab':'선물함'}
		};
		
		$scope.myLotteMainPopLinkObj = {'gdBenefitUrl':LotteCommon.gdBenefitUrl + "?" +  $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_29"};
		
		/* 20181107 ga + link fnc */
		$scope.hybLink = function(e){
			var s = $scope.myLotteMainLinkObj[e];
			LotteGA.evtTag($scope.gaCtgName, s['act'], s['lab']);
			$window.location.href = $scope.myLotteMainLinkObj[e].key;
		};

		/* 최근상품 더보기 링크 (IOS에서 historyback 캐시오류) */
		$scope.myLotteLateProd = function(){
			LotteGA.evtTag($scope.gaCtgName, "관심상품", "최근본상품");
			// $scope.closeSideMylotte();
			setTimeout(function(){
				$window.location.href  = LotteCommon.lateProdUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_26&viewGoods="+LotteStorage.getLocalStorage("latelyGoods");
			});
		}
		/*자주 구매 상품 더보기 링크*/
		$scope.myLotteOftenProd = function(){
			LotteGA.evtTag($scope.gaCtgName, "관심상품", "자주구매");
			// $scope.closeSideMylotte();
			setTimeout(function(){
				$window.location.href  = LotteCommon.oftenProdUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_29&viewGoods="+LotteStorage.getLocalStorage("latelyGoods");
			});
		}

		// L-point click
		$scope.lPointClick = function(){
			LotteGA.evtTag($scope.gaCtgName, "회원보유자산", "엘포인트");
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=lt_point&tclick=m_DC_MyPage_Clk_Btn_3";
		}

		// L-money click
		$scope.lMoneyClick = function(){
			LotteGA.evtTag($scope.gaCtgName, "회원보유자산", "엘머니");
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=l_point&tclick=m_DC_MyPage_Clk_Btn_4";
		}

		// 보관금 click
		$scope.depositClick = function(){
			LotteGA.evtTag($scope.gaCtgName, "회원보유자산", "보관금");
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=deposit&tclick=m_DC_MyPage_Clk_Btn_5";
		}

		// 쿠폰 click
		$scope.couponClick = function(){
			LotteGA.evtTag($scope.gaCtgName, "회원보유자산", "쿠폰");
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=coupon&tclick=m_DC_MyPage_Clk_Btn_6";
		}

		// 클로버 click
		$scope.cloverClick = function(){
			LotteGA.evtTag($scope.gaCtgName, "회원보유자산", "클로버");
			$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=clover&tclick=m_DC_MyPage_Clk_Btn_7";
		}

		// 스마트픽 교환권 click
		$scope.smartPickClick = function(){
			LotteGA.evtTag($scope.gaCtgName, "교환권", "스마트픽/e-쿠폰교환권");
			$window.location.href = LotteCommon.smartPickListUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_8";
		}

		// 주문배송조회 건별 조회
		$scope.ordDetailClick = function(type){
			var cnt = type.toString().substr(1,1);
			var _a = ["주문접수","주문완료","출고지시","상품준비","발송완료"];
			LotteGA.evtTag($scope.gaCtgName, "주문배송조회", _a[cnt-1]);

			$window.location.href = LotteCommon.ordLstUrl + "?" + $scope.baseParam + "&searchFlag=D15&ordDtlStatCd=10&orderListType=" + type + "&tclick=m_DC_MyPage_Clk_Lnk_" + cnt;
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
			LotteGA.evtTag($scope.gaCtgName, "회원정보", "회원정보수정");
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
					if($scope.aliveSso && LotteCookie.getCookie('SSO_ACES_TKN')){
						LotteUserService.callSsoScreen('/view/manage/mbrManage_01_000',window.location.href);
					}else{
						alert("L.POINT 로그인 오류로 인해 일시적으로 회원정보수정/회원탈퇴가 불가합니다.\n잠시 후 다시 시도해주세요.");
						return false;
					}
					
					//outLink(family_url);
				}
			}else{
				alert("로그인 후 이용 가능합니다.");
			}
		}

		// 회원탈퇴
		$scope.memberOut = function() {
			LotteGA.evtTag($scope.gaCtgName, "회원정보", "회원 탈퇴");
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
					if($scope.aliveSso && LotteCookie.getCookie('SSO_ACES_TKN')){
						var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');

						LotteUserService.callSsoScreen('/view/manage/mbrSes_01_001', LotteCommon.ssoDropGate + "?" + $scope.baseParam + targUrl);
					}else{
						alert("L.POINT 로그인 오류로 인해 일시적으로 회원정보수정/회원탈퇴가 불가합니다.\n잠시 후 다시 시도해주세요");
						return false;
					}
					//outLink(memeberOut_url);
				}
			}else{
				alert("로그인 후 이용 가능합니다.");
			}
		}

		// 로그인
		$scope.goLoginClick = function() {
			//$window.location.href = LotteCommon.logoutUrl;
			//var currentLoc = $window.location.href.split("tclick");
			LotteGA.evtTag($scope.gaCtgName, "로그인", "로그인");
			var targUrl = "&tclick=m_DC_MyPage_Clk_Btn_27&targetUrl=" + encodeURIComponent(LotteCommon.mylotteUrl + "?" + $scope.baseParam, 'UTF-8');
			$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
		}

		//회원가입

		$scope.goFamilySite = function (div) {
				LotteGA.evtTag($scope.gaCtgName, "회원가입", "회원가입");

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
										/**
										 * 20181119 SSO 통합회원제 API : 멤버스 호출 방식 변경
										*/
						  				var ssoTarget_url = "";
	 									var return_url = window.location.href;
										 if (div == "id") { // 아이디찾기
											ssoTarget_url = "/exView/manage/fdId_01_001";
										} else if (div == "passwd") { // 비밀번호 찾기
											ssoTarget_url = "/exView/manage/fdPassword_01_001";
										} else if (div == "mem_reg") { // 회원가입
											ssoTarget_url ="/exView/join/mbrJoin_01_001";
										}

										LotteUserService.callSsoScreen(ssoTarget_url,window.location.href);
										
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

			/**
			 * 20181119 SSO 통합회원제 API : 멤버스 호출 방식 변경
			*/

			var ssoTarget_url = "";
			var return_url = window.location.href;

			if (div == "id") {// 아이디찾기
				$scope.sendTclick("m_DC_login_clk_Lnk_1");
				ssoTarget_url = "/exView/manage/fdId_01_001";
			} else if (div == "passwd") { // 비밀번호 찾기
				$scope.sendTclick("m_DC_login_clk_Lnk_2");
				ssoTarget_url = "/exView/manage/fdPassword_01_001";
			} else if (div == "mem_reg") { // 회원가입
				$scope.sendTclick("m_DC_Mypage_Clk_Btn_28");
				ssoTarget_url ="/exView/join/mbrJoin_01_001";
			}

		   LotteUserService.callSsoScreen(ssoTarget_url,window.location.href);
		};


		// 닫기
		$scope.closePopup = function(){
			$scope.memberLoginPopup = false;
			$scope.dimmedClose();
		}

		// 장보기몰 - 장보기#자주구매 click
		$scope.lsOftenBuyClick = function() {
			LotteGA.evtTag($scope.gaCtgName, "오늘장보기", "오늘장보기#자주구매");
			var lsOftenBuyCHLNO = ($scope.appObj.isSuperApp) ? "M389197" : "M389184";// 슈퍼 base : 닷컴 base
			if(!$scope.appObj.isApp){ lsOftenBuyCHLNO = "M389469"; }
			$scope.gotoLotteSuperUrl(LotteCommon.SuperQuickBuyUrl, lsOftenBuyCHLNO); // param (url, 채널)
		};

		// 장보기몰 - 장보기몰 주문내역 click
		$scope.lsOrderClick = function() {
			LotteGA.evtTag($scope.gaCtgName, "오늘장보기", "오늘장보기주문내역");
			var lsOrderCHLNO = ($scope.appObj.isSuperApp) ? "M389199" : "M389186";// 슈퍼 base : 닷컴 base
			if(!$scope.appObj.isApp){ lsOrderCHLNO = "M389470"; }
			$scope.gotoLotteSuperUrl(LotteCommon.SuperOrderListUrl, lsOrderCHLNO); // param (url, 채널)
		};

		// 장보기몰 - 장보기 위시리스트 click
		$scope.lsWishlistClick = function() {
			LotteGA.evtTag($scope.gaCtgName, "오늘장보기", "오늘장보기위시리스트");
			var lsWishlistCHLNO = ($scope.appObj.isSuperApp) ? "M389202" : "M389187";// 슈퍼 base : 닷컴 base
			if(!$scope.appObj.isApp){ lsWishlistCHLNO = "M389471"; }
			$scope.gotoLotteSuperUrl(LotteCommon.SuperWishListUrl, lsWishlistCHLNO); // param (url, 채널)
		};

		// 장보기몰 - 장보기 GO click
		$scope.lsMainClick = function() {
			LotteGA.evtTag($scope.gaCtgName, "오늘장보기", "오늘장보기로이동");
			var lsMainCHLNO = ($scope.appObj.isSuperApp) ? "M389204" : "M389188";// 슈퍼 base : 닷컴 base
			if(!$scope.appObj.isApp){ lsMainCHLNO = "M389472"; }
			$scope.gotoLotteSuperUrl(LotteCommon.SuperMainUrl, lsMainCHLNO); // param (url, 채널)
		};

		$scope.goProfile = function(){
			LotteGA.evtTag($scope.gaCtgName, "회원정보", "프로필수정");
			$timeout(function(){
				location.href = $scope.myLotteMainInfo.prfSetUrl + "?" + $scope.baseParam;
			}, 300);
		};

		$scope.goMyReview = function(){
			LotteGA.evtTag($scope.gaCtgName, "관심상품", "내상품평");
			$timeout(function(){
				location.href = $scope.myLotteMainLinkObj.critViewUrl + "?" + $scope.baseParam;
			}, 300);
		};
	}]);

	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/mylotte/m/mylotte_main_container_2018.html',
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

	// 상품평 팝업
	app.directive('reviewPopup', ['$window', '$location', '$timeout', 'LotteCookie', 'LotteGA', function($window, $location, $timeout, LotteCookie, LotteGA) {
		return {
			templateUrl:'/lotte/resources_dev/mylotte/m/popup_review.html',
			replace:true,
			link:function($scope, el, attrs) {
				$scope.saveReviewPop = function(){
					LotteGA.evtTag($scope.gaCtgName, "미작성 고객대상 레이어팝업", "7일간 다시보지않기 체크");
		    		//console.log('saveReviewPop' + $scope.reviewPopHide);
		    		if($scope.reviewPopHide == 'Y'){
		    			LotteCookie.setCookie('reviewNotice', $scope.reviewPopHide, 7);
		    		}else{
		    			LotteCookie.delCookie('reviewNotice');
		    		}
				};

				function addZero( n ) {
		            return n<10?'0'+n:n;
		        }

				$scope.goRegComment = function(item, idx){
					LotteGA.evtTag($scope.gaCtgName, "미작성 고객대상 레이어팝업", "상품평_" + addZero(idx), item.goodsNo);
					$timeout(function(){
						location.href = item.regCommentUrl + "&" + $scope.baseParam;
					}, 300);
				};

				$scope.closeReviewPop = function(){
					$scope.reviewPopFlag = false;
					LotteGA.evtTag($scope.gaCtgName, "미작성 고객대상 레이어팝업", "닫기 버튼");
				};
			}
		};
	}]);

	// 이미지 에러시 처리
	app.directive('onErrorSrc', function() {
	    return {
	        link: function(scope, element, attrs) {
	          element.bind('error', function() {
	        	  if(scope.myLotteMainInfo.prfImgUrl != scope.dummyProfileUrl)
	        		  scope.myLotteMainInfo.prfImgUrl = scope.dummyProfileUrl;
	          });
	        }
	    }
	});

})(window, window.angular);
