(function (window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter'
	]);

	app.controller('loginFormCtrl', ['$scope', '$http', '$window', '$location', '$sce', '$timeout', 'LotteCommon', "LotteCookie", 'commInitData', 'LotteUtil', '$sessionStorage', 'LotteUserService',
		function ($scope, $http, $window, $location, $sce, $timeout, LotteCommon, LotteCookie, commInitData, LotteUtil, $sessionStorage, LotteUserService) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.actionBar = true; // 액션바
		$scope.screenID = "Login";
        //20171019 회원 강제 비밀번호변경 프로세스 적용        
        $scope.alpass = false; 
        $scope.alpass_case1 = false;
        $scope.alpass_case2 = false;
		// 초기화 시작
		$scope.mbrNo = "";
		$scope.fromPg = "";
		$scope.grockle_yn = false;
		$scope.regStatus = "";
		$scope.adultChk = false;
		$scope.tmpOnlCno = "";
		$scope.schema = "";
		$scope.normalLogin = "";
		$scope.v = "";
		$scope.ImagePath = "";
		$scope.isEllotte = "";
		$scope.defaultDomain = "";
		$scope.targetUrl = "";
		$scope.saveId = "";
		$scope.saveIdEasy = "";
		$scope.saveIdEasy2 = "";
		$scope.loginId = "";
		$scope.minority_yn = false;
		$scope.smp_buy_yn = false;
		$scope.gubun = "";
		$scope.joinBtnViewInfo = "";
		$scope.curr_time = "";
		$scope.web_scheme = "";
		$scope.requestContextPath = "";
		$scope.requestUri = "";
		$scope.requestSecure = "";
		$scope.requestReferer = "";
		$scope.requestUserAgent = "";
		$scope.action = "";
		$scope.udid = "";
		$scope.drmcCust_id = ""; //20160113
		$scope.smp_yn = false;
		$scope.smp_end_yn = false; //2017-12-26 추가
		$scope.mbrIP = "";
		$scope.socialMapping = false; // 소셜채널 멤버스 미맵핑시 처리 레이어가리기 Flag
		$scope.mbRestoreLoadingFlag = false; // 20160530 휴면회원 복원 로딩바 노출 여부
		
		// 20181123 SSO 통합회원제 로그인 추가

		$scope.sso_aces_tkn = ""; // sso 접근토큰
		$scope.sso_rnw_tkn = ""; // sso 갱신토큰
		$scope.socialChannel = ""; // 소셜로그인 구분값

		// 운영에서 로그인 페이지에 http로 접근시 https로 리다이렉팅
		if (location.host == "m.lotte.com" && $location.protocol() == "http") {
			location.replace($location.absUrl().replace(/^http/i, "https"));
		}
		/**
		 * 지문 로그인 가능 여부 확인
		 */
		$scope.isAvailFingerprintLogin = function(){
			var ver = $scope.appObj.verNumber;
			if($scope.appObj.isApp){
				if($scope.appObj.isIOS){// ios
					if( ($scope.appObj.iOsType == "iPhone" && ver >= 254)//iphone
						|| ($scope.appObj.iOsType == "iPad" && ver >= 221) ){//ipad
						return true;
					}
				}else if($scope.appObj.isAndroid && ver >= 278){// android
					return true;
				}
			}
			return false;
		};

		// 로그인시 Client ID 추가
		if (angular.element("#frm_send input[name='mbrIP']").length > 0) {
			$scope.mbrIP = angular.element("#frm_send input[name='mbrIP']").val();
		}

		$scope.socialLoginFlag = true; // 소셜 로그인 사용 여부

		// if (commInitData.query["socialLogin"] == "true" || $location.host() == "mo.lotte.com") { // 파라메타에 socialLogin Flag가 있거나 스테이지일 경우에만
		// 	$scope.socialLoginFlag = true;
		// }

		// console.log("::::", commInitData.query["smp_yn"], $scope.smp_yn);
		if (commInitData.query["smp_yn"] == "Y") {
			$scope.smp_yn = true;

			$scope.promotionUrl = function () {
				$window.location.href = LotteCommon.baseUrl + "/smartpick/smartpick_promotion.do?" + $scope.baseParam + "&smp_yn=Y&tab_click_yn=Y";
			};

			$scope.pickListUrl = function () {
				$window.location.href = LotteCommon.baseUrl + "/smartpick/pick_list.do?" + $scope.baseParam + "&smp_yn=Y";
			};

			$scope.setupUrl = function () {
				$window.location.href = LotteCommon.baseUrl + "/smartpick/smp_cpn_setup.do?" + $scope.baseParam + "&smp_yn=Y";
			};

			$scope.smpParam = "&smp_yn=Y";
		} else {
			$scope.smpParam = "";
		}

		$scope.udid = LotteCookie.getCookie("UDID"); // UDID
		$scope.mbrNo = LotteCookie.getCookie("mbrNo_M");
		$scope.fromPg = commInitData.query["fromPg"] != null ? commInitData.query["fromPg"] : "0";
        //20160719 상품상세 선물하기 에서 왔으면 비회원 구매를 막기 위해 추가
        $scope.fromGift = commInitData.query["fromGift"] != null ? commInitData.query["fromGift"] : "0";

		var strGrockle_yn = commInitData.query["grockle_yn"] != null ? commInitData.query["grockle_yn"] : "N";
		$scope.grockle_yn =  strGrockle_yn == "Y" ? true : false;

		var strMinority_yn = commInitData.query["minority_yn"] != null ? commInitData.query["minority_yn"] : "N";
		$scope.minority_yn = strMinority_yn == "Y" ? true : false;

		$scope.simpleSignMember = commInitData.query["simpleSignMember"] != null ? commInitData.query["simpleSignMember"] : "N"; // 간편회원여부
		$scope.regStatus = commInitData.query["regStatus"] != null ? commInitData.query["regStatus"] : "N"; // 간편회원 여부

		var strAdultChk = commInitData.query["adultChk"] != null ? commInitData.query["adultChk"] : "N";
		$scope.adultChk = strAdultChk == "Y" ? true : false;

		$scope.schema = commInitData.query["schema"] != null ? commInitData.query["schema"] : "";
		
		//20180308 버버리 상품 비회원 체크 
		if(commInitData.query["prdbbr"]){
			$scope.prdbbr = commInitData.query["prdbbr"];
		}

		$scope.normalLogin = LOTTE_CONSTANTS["NORMAL_LOGIN"];
		$scope.v = LotteUtil.getParameter("v");

		$scope.ImagePath = LotteUtil.getImagePath();
		$scope.isEllotte = LotteUtil.isEllotte();

		$scope.defaultDomain = LotteUtil.defaultDomain();

		$scope.targetUrl = ""; // login 이후 찾아갈 페이지
		$scope.goOrderFormYn = "N"; // 로그인 후 주문서 이동 여부
	
		if (LotteUtil.getDecodeParameter("targetUrl") != null) {
			$scope.targetUrl = LotteUtil.getDecodeParameter("targetUrl");
			// if($scope.targetUrl.indexOf("http://m.lotte.com") == 0){
			// }else if($scope.targetUrl.indexOf("https://m.lotte.com") == 0){
			// }else if($scope.targetUrl.indexOf("http://mo.lotte.com") == 0){
			// }else if($scope.targetUrl.indexOf("https://mo.lotte.com") == 0){
			// }else{
			// 	$scope.targetUrl = LotteCommon.mainUrl + "?" + $scope.baseParam;
			// }
				
			if (!($scope.targetUrl + "").match(/http(s)?\:\/\/(m|mo|mo2|mprj|mprj1|mprj2|mprj5).lotte.com/gi)) {
				
				$scope.targetUrl = LotteCommon.mainUrl + "?" + $scope.baseParam;
			}
			
			if ($scope.fromPg == LOTTE_CONSTANTS["ONENONE_BUY_LOGIN"]
				|| $scope.fromPg == LOTTE_CONSTANTS["CART_BUY_LOGIN"]
				|| $scope.fromPg == LOTTE_CONSTANTS["IMALL_BUY_LOGIN"]
				|| $scope.fromPg == LOTTE_CONSTANTS["IMALL_CART_BUY_LOGIN"]) { // 상품상세 페이지 또는 장바구니에서 왔으면
				$scope.goOrderFormYn = "Y";
			}
		} else {
			$scope.targetUrl = LotteCommon.mainUrl + "?" + $scope.baseParam;
			
		}

		// 자동로그인 로그아웃처리 20151224
		var logout_fg = commInitData.query['logout_fg'] ? commInitData.query['logout_fg'] : "0000"; // 로그아웃플래그

		switch (logout_fg) {
			case "9103":
				//alert("다른 기기에서 비밀번호를 10회 연속 잘못 입력하셨습니다.\n개인정보 보호를 위해 다시 로그인해주세요.");
				alert("비밀번호를 10회 연속 잘못 입력하셨습니다.\n개인정보 보호를 위해 다시 로그인해주세요.");
				break;
			case "9105":
				alert("자동 로그인을 이용하실 수 없습니다.\n다시 로그인해주세요.");
				break;
			case "9106":
				alert("자동 로그인을 이용하실 수 없습니다.\n다시 로그인해주세요.");
				break;
			case "9107":
				alert("롯데닷컴을 탈퇴하셨네요.\n다시 방문하신 것을 환영하며,\n편리한 롯데닷컴 이용을 위해 회원가입 부탁드립니다.");
				break;
			case "9109":
				alert("자동 로그인을 이용하실 수 없습니다.\n다시 로그인해주세요.");
				break;
			case "9130":
				alert("롯데닷컴에 오랜만에 방문하셨네요!\n개인정보 보호를 위해 다시 로그인해주세요.");
				break;
            case "9131":
                //20171019 회원 강제 비밀번호변경 프로세스 적용 
                $scope.alpass = true;
                $scope.alpass_case1 = true; 
                $scope.alpass_case2 = false;                            
                break;
			case "9192":
				var pass_time = LotteUtil.getParameter("lcreatetime");
				if(pass_time == ""){
					alert("비밀번호를 변경하셨네요!\n다시 로그인해 주세요.");
				}else{
					var pass_mon = pass_time.substr(4,2);
					var pass_day = pass_time.substr(6,2);
					//alert("다른 기기에서" + pass_mon +"월 " + pass_day+"일에 비밀번호를 변경하셨네요!\n다시 로그인해 주세요.");
					alert(pass_mon +"월 " + pass_day+"일에 비밀번호를 변경하셨네요!\n다시 로그인해 주세요.");
				}
				break;
		}

		$.ajax({ // 로그인 페이지 초기정보 로드
			type: 'post'
			, async: false
			, url: LotteCommon.loginInitUrl
			, data: $('#frm').serialize()
			, success: function (data) {
				$scope.saveId = data.saveId;
				$scope.saveIdEasy = data.saveIdEasy.split('@')[0];
				$scope.saveIdEasy2 = data.saveIdEasy.split('@')[1];
				$scope.loginId = data.loginId;
				$scope.minority_yn = data.minority_yn == "Y" ? true : false;
				$scope.smp_buy_yn = data.smp_buy_yn == "Y" ? true : false;
				$scope.gubun = data.gubun;
				$scope.joinBtnViewInfo = data.joinBtnViewInfo;

				$scope.curr_time = data.curr_time;
				$scope.web_scheme = data.requestScheme;

				$scope.requestContextPath = data.requestContextPath;
				$scope.requestUri = data.requestUri;
				$scope.requestSecure = data.reqeustSecure;
				$scope.requestReferer = data.requestReferer;
				$scope.requestUserAgent = data.requestUserAgent;
			}
			, error: function (data) {
				//alert(data);
			}
		});

		var uagent = $scope.requestUserAgent;

		// console.log("fromPg : " + $scope.fromPg);
		// console.log("loginId : " + $scope.loginId);
		// console.log("mbr_no : " + $scope.mbrNo);

		// 로그인상태
		if ($scope.fromPg != "9" && $scope.loginId != "" && $scope.mbrNo != "") {
			location.href = LotteCommon.mainUrl + "?" + $scope.baseParam;
		}

		// 임시 회원가입 막기
		$scope.lotte_app = $scope.schema.indexOf("mlotte") < 0 ? "N" : "Y";  // 롯데닷컴앱
		$scope.smart_pic_app = LotteUtil.isSmpApp() == true ? "Y" : "N"; // 스마트픽앱
		$scope.ellotte_app_yn = LotteUtil.isEllotteApp() == true ? "Y" : "N"; // 엘롯데앱
		$scope.skt_app_yn = LotteUtil.getParameter("schema") == "sklotte001" ? "Y" : "N"; // T롯데닷컴앱

		// 모바일 기기
		$scope.mach_knd_cd = LotteUtil.boolAndroid(uagent) ? "android" : (LotteUtil.boolipad(uagent) ? "ipad" : "iphone");

		// 웹페이지 스키마
		// 상단 init에서 초기화($scope.web_scheme)

		// 회원가입 버튼 노출여부 확인
		// 상단 init에서 초기화($scope.joinBtnViewInfo)
		$scope.joinBtnViewYn = '';
		$scope.startDateTime = '';
		$scope.endDateTime = '';

		if ($scope.appObj.isIOS && ($scope.lotte_app == "Y" || $scope.ellotte_app_yn == "Y" || $scope.smart_pic_app == "Y")) {
			// 롯데닷컴앱, 엘롯데앱일때
			if ($scope.joinBtnViewInfo != "") {
				var joinBtnViewInfoListArr = $scope.joinBtnViewInfo.split('\\^');

				if (joinBtnViewInfoListArr[0] != "") {
					var joinBtnViewInfoArr = joinBtnViewInfoListArr[0].split(',');

					$scope.startDateTime = joinBtnViewInfoArr[1];
					$scope.endDateTime = joinBtnViewInfoArr[2];

					if ($scope.startDateTime != "" && $scope.endDateTime != "") {
						if ($scope.startDateTime.length > 9 && $scope.endDateTime.length > 9) {
							if (parseInt($scope.curr_time) >= parseInt($scope.startDateTime.substring(0,10))
								&& parseInt($scope.curr_time) <= parseInt($scope.endDateTime.substring(0,10))) {
								$scope.joinBtnViewYn = 'N';
							}
						}
					}
				}
			}
		}

		// 점검기간
		// $scope.normalLogin =
		$scope.sysChkYn = LotteUtil.getCurrSysTimeChk(2013, 5, 12, 2, 0, 2013, 5, 12, 5, 29) ? "Y" : "N";
		$scope.isSmartpick = LotteUtil.isSmp() ? "Y" : "N";

		if ($scope.isSmartpick == "Y") {
			$scope.body_class = " class='smp_coupon'";
		}

		// 로그인 page Tab
		$scope.id = $scope.saveId == "" ? "" : $scope.saveId ;
		$scope.lPointId = $scope.saveId == "" ? "" : $scope.saveId ;
		$scope.userIdEasy = $scope.saveIdEasy == "" ? "" : $scope.saveIdEasy;
		$scope.userIdEasy2 = $scope.saveIdEasy2 == "" ? "" : $scope.saveIdEasy2;
		$scope.pw = "";
		$scope.subTitleTxt = ['로그인', '비회원 주문조회', '비회원 구매하기'];
		$scope.subTitle = "로그인";  // 서브헤더 타이틀
		$scope.simpleSignYn = "N"; // 간편 로그인 여부

		// 
		$scope.getFrmSend = function () {
			if ($scope.fromPg == LotteCommon.ONENONE_BUY_LOGIN
				|| $scope.fromPg == LotteCommon.CART_BUY_LOGIN
				|| $scope.fromPg == LotteCommon.IMALL_BUY_LOGIN
				|| $scope.fromPg == LotteCommon.IMALL_CART_BUY_LOGIN) {
				var param_name = "";

				// var smp_prod_yn = LotteUtil.getParameter("smp_prod_yn", "N");  //2015.11.06 신홍균 변수명 변경
				var smp_buy_yn = LotteUtil.getParameter("smp_buy_yn", "N");
				var smp_select_prod_yn = LotteUtil.getParameter("smp_select_prod_yn");

				var targetUrl = decodeURIComponent(LotteUtil.getParameter("targetUrl"));
				targetUrl = targetUrl.replace(/#/g, "&");
				// console.log("targetUrl : " + targetUrl);
				var goodsNo = decodeURIComponent(LotteUtil.getUrlParameter(targetUrl, "goods_no"));

				var dispNo = "";
				var disp_no = LotteUtil.getUrlParameter(targetUrl, "disp_no");
				var dispno = LotteUtil.getUrlParameter(targetUrl, "dispno");
				var curDispNo = LotteUtil.getUrlParameter(targetUrl, "curDispNo");
				var isRental = LotteUtil.getParameter("isRental", "N"); // 렌탈상담예약인경우

				if (disp_no != undefined && disp_no != "") {
					dispNo = disp_no;
				} else if (dispno != undefined && dispno != "") {
					dispNo = dispno;
				} else if (curDispNo != undefined && curDispNo != "") {
					dispNo = curDispNo;
				}

				var formAction = "";

				if ($scope.fromPg == LotteCommon.ONENONE_BUY_LOGIN) {
					if (smp_buy_yn == "Y" || smp_select_prod_yn == "Y") { // 스마트픽 예약 정보
						formAction = LotteCommon.baseUrl + "/smartpick/smartpick_booking.do?"+ $scope.baseParam+"&curDispNo="+dispNo +"&gno=" + goodsNo;
						angular.element("#frm_send").attr("action", formAction);
					} else if (isRental == "Y") { // 렌탈상담예약 추가
						formAction = LotteCommon.secureUrl + "/product/m/product_rent.do?"+ $scope.baseParam;
						angular.element("#frm_send").attr("action", formAction);
					} else { // 주문서 이동
						formAction = LotteCommon.secureUrl + "/order/m/order_form.do?"+$scope.baseParam;

						if (commInitData.query["orderTclick"]) {
							formAction += "&tclick=" + commInitData.query["orderTclick"];
						}

						angular.element("#frm_send").attr("action", formAction);
					}
				} else if ($scope.fromPg == LotteCommon.CART_BUY_LOGIN) {
					formAction = LotteCommon.secureUrl + "/order/m/order_form.do?"+$scope.baseParam;
					angular.element("#frm_send").attr("action", formAction);
				} else if ($scope.fromPg == LotteCommon.IMALL_BUY_LOGIN) { // 홈쇼핑상품 상세에서 바로구매 요청 시 로그인 페이지로 올때
					formAction = LotteCommon.secureUrl + "/order/m/order_form.do?"+$scope.baseParam;
					
					if (commInitData.query["orderTclick"]) {
						formAction += "&tclick=" + commInitData.query["orderTclick"];
					}
					
					angular.element("#frm_send").attr("action", formAction);
				} else if ($scope.fromPg == LotteCommon.IMALL_CART_BUY_LOGIN) { // 홈쇼핑상품 장바구니에서 바로구매 요청 시 로그인 페이지로 올때
					formAction = LotteCommon.secureUrl + "/order/m/order_form.do?"+$scope.baseParam;
					angular.element("#frm_send").attr("action", formAction);
				}
			}
		};

		$scope.getFrmSend();
	}]);

	app.directive('lotteContainer', ['LotteUtil', 'LotteCookie', 'LotteCommon', '$sessionStorage', 'commInitData', '$location', '$window', 'LotteStorage', '$http', "$timeout", "LotteLink", "LotteUserService",
		function (LotteUtil, LotteCookie, LotteCommon, $sessionStorage, commInitData, $location, $window, LotteStorage, $http, $timeout, LotteLink, LotteUserService) {
		return {
			templateUrl: '/lotte/resources_dev/login/login_form_container.html',
			replace: true,
			link: function ($scope, el, attrs) {
				// 에이전트 String
				var uagent = $scope.requestUserAgent;

				var isLoginProgressFlag = false; // 로그인 시도중 Flag 20160829 박형윤 추가

				// 20121004 키보드 화면이 처음보이도록 스크롤링
				// $('html, body').animate({'scrollTop':'83px'}, 500);
				$scope.isOnTab = 0; // 탭 on/off 유무

				$scope.tabFunc = function (tabIdx) {
					var _$tab = angular.element( '.list-tab' ),
						_$list = angular.element( '.sub-tab' ),
						cIdx = tabIdx;

					$scope.isOnTab = cIdx;

					[].forEach.call( _$list , function (li, idx) {
						if (cIdx == 3) {
							_$list[0].style.display = 'block';
						} else {
							li.style.display = 'none';
						}
						if (cIdx == 0) {
							_$list[0].style.display = 'block';
						} else {
							li.style.display = 'none';
						}
						if (cIdx == 1) {
							_$list[1].style.display = 'block';
						} else {
							li.style.display = 'none';
						}
						if (cIdx == 2) {
							_$list[2].style.display = 'block';
						} else {
							li.style.display = 'none';
						}
					});

					if (cIdx == 0) {
						// rudolph:151112 tclick
						$scope.sendTclick("m_DC_Login_Clk_tap_1");
						$scope.simpleSignYn = 'N';

						if ('' != $('#userId').val()) {
							$('#frm input[name=lPointPw]').focus();
						} else {
							$('#frm input[name=userId]').focus();
						}

						// $("#simpleSignMember").val("Y");
						// console.log("simpleSignYn: " + $scope.simpleSignYn);
						$scope.screenID = "LoginSpl";
					} else if (cIdx == 1) {
						// rudolph:151112 tclick
						$scope.sendTclick("m_DC_Login_Clk_Btn_3");
						$scope.simpleSignYn = 'Y';

						if ('' != $('#userIdEasy').val()) {
							$('#frm input[name=userPwEasy]').focus();
						} else {
							$('#frm input[name=userIdEasy]').focus();
						}

						// $("#simpleSignMember").val("Y");
						// console.log("simpleSignYn: " + $scope.simpleSignYn);
						$scope.screenID = "LoginSpl";
					} else if (cIdx == 2) {
						// rudolph:151112 tclick
						$scope.sendTclick("m_DC_Login_Clk_tap_2");
						$scope.simpleSignYn = 'N';

						// $("#simpleSignMember").val("Y");
						// console.log("simpleSignYn: " + $scope.simpleSignYn);
						$scope.screenID = "LoginSpl";
					} else if (cIdx == 3) {
						// rudolph:151112 tclick
						$scope.sendTclick("m_DC_Login_Clk_Btn_2");
						$scope.simpleSignYn = 'N';

						if ('' != $('#userId').val()) {
							$('#frm input[name=lPointPw]').focus();
						} else {
							$('#frm input[name=userId]').focus();
						}

						// $("#simpleSignMember").val("Y");
						// console.log("simpleSignYn: " + $scope.simpleSignYn);
						$scope.screenID = "LoginSpl";
					}else {
						// rudolph:151112 tclick
						$scope.sendTclick("m_DC_Login_Clk_Btn_2");
						$scope.simpleSignYn = 'N';

						if ('' != $('#userId').val()) {
							$('#frm input[name=lPointPw]').focus();
						} else {
							$('#frm input[name=userId]').focus();
						}

						// $("#simpleSignMember").val("Y");
						// console.log("simpleSignYn: " + $scope.simpleSignYn);
						$scope.screenID = "LoginSpl";
					}
				};

				// 키보드 열고 닫기--rudolph동작안해 수정
				$scope.keyboardToggle = function (idx) {
					var objCtrl = $(".keyboard").children("a");

					if (objCtrl.eq(idx).hasClass("on")) {
						objCtrl.eq(idx).removeClass("on");
						objCtrl.eq(idx).text( '한글자판닫기' );
						$(".keyboard_layer").eq(idx).css('display', 'block');
					} else {
						objCtrl.eq(idx).addClass("on");
						objCtrl.eq(idx).text( '한글자판열기' );
						$(".keyboard_layer").eq(idx).css('display', 'none');
					}
				};

				
				/**
				 * 로그인 확인 버튼 딜레이
				 * 페이지 이동 후 키보드 영역 남는 문제 수정
				 */
				$scope.checkLoginDelay = function(chk){
					$timeout(function(){
						$scope.checkLogin(chk);
					}, 200);
				};


				/* 간편회원 아이디 입력창 개선 20181220 */ 
				$scope.register = {};
				$scope.register.val = '0';
				$scope.textType = true;
				$scope.textResult = '';
				$scope.saveIdEasyNum = 0;
				$scope.saveIdEasyNum2 = 0;

				$scope.userIdEasySelFn = function(num){
					if($scope.register.val == '99'){
						$scope.textType = false;
						$timeout(function() {
							$('#userIdEasyTxt').focus();
						}, 10);
					}
				}

				$scope.loginTxtVal = function(){
					if($('#userIdEasyTxt').val() == ''){
						$scope.textType = true;
						$scope.register.val = '0';
						$timeout(function() {
							$('#userIdEasySel option:eq(0)').prop('selected', true);
							$('#userIdEasySel').val('0');
						}, 10);
					}
				}

				/* 이메일 리스트 데이터 임시 20181221 */
        		/*$scope.emailIdSel = [
        		{cd:'0',cd_nm:'선택하세요.'},
        		{cd:'10',cd_nm:'naver.com'},
        		{cd:'11',cd_nm:'hanmail.net'},
        		{cd:'12',cd_nm:'nate.com'},
        		{cd:'18',cd_nm:'gmail.com'},
        		{cd:'13',cd_nm:'yahoo.co.kr'},
        		{cd:'14',cd_nm:'hotmail.com'},
        		{cd:'15',cd_nm:'empal.com'},
        		{cd:'16',cd_nm:'paran.com'},
        		{cd:'17',cd_nm:'lycos.co.kr'},
        		{cd:'99',cd_nm:'직접입력'}];*/

        		/* 아이디 저장 불러오기(이메일리스트 영역) 20181221*/
        		$timeout(function() {
        			if($scope.saveIdEasy2){
						for (var j = 0; j < $scope.emailIdSel.length; j++) {

		        			if($scope.emailIdSel[j].cd_nm == $scope.saveIdEasy2){
		        				$scope.textType = true;
		        				$scope.saveIdEasyNum = j;
								$scope.saveIdEasyNum2 ++;
								$scope.register.val = $scope.emailIdSel[j].cd;
								$('#userIdEasySel option:eq('+j+')').prop('selected', true);
		        			}else{
								$scope.register.val = '99'; 
							}
		        		}
					}else{
						// 20181224 저장된 간편로그인아이디가 없을때
						$scope.saveIdEasyNum2 ++;
						$('#userIdEasySel option:eq(0)').prop('selected', true);
					}

					if($scope.saveIdEasyNum2 == 0){
						$scope.textType = false;
					}

        		}, 10);

				// Data url
				var getEmailKind = LotteCommon.email_kind;
				
				// Data Load
		        $http.get(getEmailKind)
		        .success(function(data) {
		        	$scope.emailIdSel = data.cellList;
		        	$scope.emailIdSel.unshift({cd:'0',cd_nm:'선택하세요.'});
		        })
		        .error(function(data, status, headers, config){
		            console.log('Error Data : ', status, headers, config);
		        });
		        
		        /* 간편회원 아이디 입력창 개선 20181220 END*/ 
				
				// 로그인 확인
				$scope.checkLogin = function (chk) {
					// 간편회원 아이디
					/* 간편회원 아이디 입력창 개선 수정 20181220 */ 
					if ($scope.simpleSignYn == 'Y') {
						$scope.textResult = $('#userIdEasySel').val();

						$('#userId').val($('#userIdEasy').val() + '@' + ($scope.register.val == '99' ? $('#userIdEasyTxt').val() : $scope.emailIdSel[$scope.textResult].cd_nm));
						$('#user_id_easy').val($('#userIdEasy').val() + '@' + ($scope.register.val == '99' ? $('#userIdEasyTxt').val() : $scope.emailIdSel[$scope.textResult].cd_nm));
						$('#lPointPw').val($('#userPwEasy').val());
					}
					/* 간편회원 아이디 입력창 개선 수정 20181220 END*/ 
					// 회원 비회원 경우 form 확인

					// 회원
					if ($scope.simpleSignYn == 'Y') {
						// 간편 로그인
	
						/* 간편회원 아이디 입력창 개선 추가 20181220 */ 
						if($scope.register.val == '0'){
							alert('메일주소를 선택해 주세요.');
							return;
						}

						if($scope.register.val == '99' && $scope.textResult == ''){
							alert('메일주소를 입력해 주세요.');
							$('#userIdEasyTxt').focus();
							return;
						}
						/* 간편회원 아이디 입력창 개선 20181220 END*/ 
						if ($.trim($('#frm input[name=userIdEasy]').val()) == '') {
							alert('아이디를 입력해 주세요.');
							$('#frm input[name=userIdEasy]').focus();
							return;
						}

						if ($.trim($('#frm input[name=userPwEasy]').val()) == '') {
							alert('비밀번호를 입력해 주세요.');
							$('#frm input[name=userPwEasy]').focus();
							return;
						}
					} else {
						// LPoint 로그인
						if ($.trim($('#frm input[name=userId]').val()) == '') {
							alert('아이디를 입력해 주세요.');
							$('#frm input[name=userId]').focus();
							return;
						}

						if ($.trim($('#frm input[name=lPointPw]').val()) == '') {
							alert('비밀번호를 입력해 주세요.');
							$('#frm input[name=userPw]').focus();
							return;
						}
					}

					// rudolph:151112 tclick
					if ($scope.simpleSignYn == 'N') {
						$scope.sendTclick("m_DC_Login_clk_btn_1");
					} else if ($scope.simpleSignYn == 'N') {
						$scope.sendTclick("m_DC_LoginSpl_clk_btn_1");
					} else if ($scope.simpleSignYn == 'Y') {
						$scope.sendTclick("m_DC_LoginSpl_Clk_Btn_1");
					}

					angular.element("#lPointPw").blur();
					angular.element("#userPwEasy").blur();

					// 로그인
					$scope.callLogin('normal');
					//$scope.login();
				};

				// 로그인 성공 이후
				function loginResultChk(data, fingerPrintFlag) { // 20160217 박형윤 지문로그인 Flag 추가
					//console.log("로그인 후 데이터 %o",data);
					if (data.loginInfo != undefined) {
						$sessionStorage.LotteUserService_loginCheck = data.loginInfo;
					}

					if ($scope.adultChk == true) {
						if (data.loginResult == "0" && data.app_login_form == "N") {
							var mbrNo = LotteCookie.getCookie("MBRNO");

							// 앱 로그인 갱신을 위해 PMS 호출 추가
							$scope.callLoginPMSInfo(data.loginId != null ? data.loginId : "", data.mbr_no != null ? data.mbr_no : mbrNo);

							$scope.goAdultSci('Y');
						} else {
							// console.log("data : " + data);
							// console.log("loginResult : " + data.loginResult);
							// console.log("grockle_yn : " + data.grockle_yn);
							// console.log("grock_mbr_no : " + data.grockle_mbr_no);
							// console.log("loginId : " + data.loginId);

							$scope.loginId = data.loginId != null ? data.loginId : "";
							var result = data.loginResult;
							$scope.grockle_yn = data.grockle_yn;
							$scope.grockle_mbr_no = data.grockle_mbr_no != null ? data.grockle_mbr_no : "";

							$scope.loginResult(data.loginResult
								, data.grockle_yn
								, data.grockle_mbr_no != null ? data.grockle_mbr_no : ""
								, data.loginId != null ? data.loginId : ""
								, data.Ord_no != null ? data.Ord_no : ""
								, data.Email != null ? data.Email : ""
								, data.mbr_no!= null ? data.mbr_no : ""
								, fingerPrintFlag // 20160217 박형윤 fingerprint
							);
						}
					} else {
						// console.log("data : " + data);
						// console.log("loginResult : " + data.loginResult);
						// console.log("grockle_yn : " + data.grockle_yn);
						// console.log("grock_mbr_no : " + data.grockle_mbr_no);
						// console.log("loginId : " + data.loginId);
						$scope.loginId = data.loginId != null ? data.loginId : "";

						var result = data.loginResult;

						$scope.grockle_yn = data.grockle_yn;
						$scope.grockle_mbr_no = data.grockle_mbr_no != null ? data.grockle_mbr_no : "";

						$scope.loginResult(data.loginResult
							, data.grockle_yn
							, data.grockle_mbr_no != null ? data.grockle_mbr_no : ""
							, data.loginId != null ? data.loginId : ""
							, data.Ord_no!= null ? data.Ord_no : ""
							, data.Email != null ? data.Email : ""
							, data.mbr_no != null ? data.mbr_no : ""
							, fingerPrintFlag // 20160217 박형윤 fingerprint
						);
					}
				};

				$scope.login = function () { // 로그인 // 20181230_1 수정 (Lpoint 회원 onlCno 파라미터 추가)
					if ($scope.simpleSignYn == 'Y' || $scope.grockle_yn) { // 간편회원 / 비회원
						if (!isLoginProgressFlag) {
							isLoginProgressFlag = true;

							$.ajax({
								type: 'post'
								, async: false
								, url: LotteCommon.loginProcUrl
								, data: $('#frm').serialize()
								, success: function (data) {
									console.log("로그인 처리 성공");
									loginResultChk(data, false);
									isLoginProgressFlag = false;
								}
								, error: function (data) {
									alert("로그인 실패했습니다");
									isLoginProgressFlag = false;
								}
							});
						}
					} else { // Lpoint 회원
						if (!isLoginProgressFlag) {
							isLoginProgressFlag = true;

							sso.callApi({
								akUrl: '/biz/login/urInfInq_01_001',    // 요청URL
								callback: function(rspDta) {
									if (rspDta.onlCno) {
										$scope.tmpOnlCno = rspDta.onlCno;
										$('#tmpOnlCno').val(rspDta.onlCno);
									}

									$.ajax({
										type: 'post'
										, async: false
										, url: LotteCommon.loginProcUrl
										, data: $('#frm').serialize()
										, success: function (data) {
											console.log("로그인 처리 성공");
											loginResultChk(data, false);
											isLoginProgressFlag = false;
										}
										, error: function (data) {
											alert("로그인 실패했습니다");
											isLoginProgressFlag = false;
										}
									});
								}
							});
						}
					}
				};

				$scope.socialLogin = function (copToken, copCls, targetUrl) { // 소셜로그인 // 20181230_1 수정 (Lpoint 회원 onlCno 파라미터 추가)
					if (!isLoginProgressFlag && copToken && copCls) {
						isLoginProgressFlag = true;

						// 20180402 박형윤 form 값 전송이 되지 않아 실제 넘어온 값으로 로그인 값 전달하도록 변경
						// var data = {
						// 	copToken: copToken,
						// 	copCls: copCls,
						// 	targetUrl: targetUrl
						// };

						var data = angular.element("#frm_send").serialize();
						//	data += "&copToken=" + copToken;
						data += "&copCls=" + copCls;
						data += "&targetUrl=" + targetUrl;

						// 20181213 form 값에 sso 토큰값이 있으면 함께 전송
						if($scope.sso_aces_tkn && $scope.sso_rnw_tkn){ 
							data += "&sso_aces_tkn=" +  $scope.sso_aces_tkn;
							data += "&sso_rnw_tkn=" + $scope.sso_rnw_tkn;
							data += "&socialChannel=" + $scope.socialChannel;
						}else{
							data += "&socialChannel=00";
						}

						sso.callApi({
							akUrl: '/biz/login/urInfInq_01_001',    // 요청URL
							callback: function(rspDta) {
								isLoginProgressFlag = true;

								if (rspDta.onlCno) {
									$scope.tmpOnlCno = rspDta.onlCno;
									data += "&tmpOnlCno=" + rspDta.onlCno;
									
								}
						
								$.ajax({
									type: 'post'
									, async: false
									, url: LotteCommon.loginProcUrl
									, data: data //$('#sociallogin_frm').serialize()
									, success: function (data) {
										loginResultChk(data, false);
										isLoginProgressFlag = false;
									}
									, error: function (data) {
										alert("로그인 실패했습니다");
										isLoginProgressFlag = false;
									}
								});
							}
						});

					}
				};

				// 20160217 박형윤 fingerprint
				if( $scope.isAvailFingerprintLogin() ){
				//if ($scope.appObj.isApp && $scope.appObj.isIOS) {
					//if (($scope.appObj.iOsType == "iPhone" && $scope.appObj.verNumber >= 254) ||
					//	($scope.appObj.iOsType == "iPad" && $scope.appObj.verNumber >= 221)) { // iPhone 2.5.4 이상, iPad 2.2.1 이상
						try {
							var fingerPrintInfo = LotteStorage.getLocalStorage("fingerPrint"),
								fingerPrintTmp = [];

							if (fingerPrintInfo) {
								fingerPrintTmp = fingerPrintInfo.split("|");
							}

							if (fingerPrintTmp.length == 2 && fingerPrintTmp[0] && fingerPrintTmp[0] != "" && fingerPrintTmp[1]) { // fingerPrintTmp[1] : loginId
								if (!isLoginProgressFlag) {
									isLoginProgressFlag = true;

									$.ajax({ // 로그인 페이지 초기정보 로드
										type: 'post'
										, async: false
										, url: LotteCommon.fingerLoginChkUrl
										, data: {mbrNo : fingerPrintTmp[0]}
										, success: function (data) {
											if (data.result === "true") {
												if($scope.appObj.isIOS){
													//console.log("IOS FINGERPRINT LOGIN");
													location.href = "logincheck://touchID/" + fingerPrintTmp[1]; // 앱 지문로그인 호출
												}else if($scope.appObj.isAndroid){
													$timeout(function(){
														try{
															//console.log("ANDROID FINGERPRINT LOGIN");
															window.fingerPrintCheck.callAndroid("touchId", fingerPrintTmp[1]);
														}catch(e){ }
													}, 2000);
												}
											}

											isLoginProgressFlag = false;
										}
										, error: function (data) {
											isLoginProgressFlag = false;
										}
									});
								}
							}
						} catch (e) {}
					//}
				//}
				}

				/**
		 		* @ngdoc function
		 		* @name $scope.fingerPrintLogin
		 		* @description
		 		* 앱 지문 인식 후 SSO 로그인 프로세스로 변경 
				 */
				 
				$scope.fingerPrintLogin = function () {

					var fingerPrintInfo = LotteStorage.getLocalStorage("fingerPrint") ,
						fingerPrintTmp = [],
						ssoAuto = true; // 지문로그인시 SSO 자동로그인 로직 사용 체크값

					if (fingerPrintInfo) {
						fingerPrintTmp = fingerPrintInfo.split("|");
					}
					// 멤버스 서버가 활성화 일때
					if($scope.aliveSso && fingerPrintTmp[0] && fingerPrintTmp[0] != ""){
						var data ={
							mbr_no : fingerPrintTmp[0]
						}
						$.ajax({
							type: 'post'
							, async: false
							, url: LotteCommon.getSsoRnwTkn
							, data: data
							, success: function (data) {

								// 성공시 쿠키에 세팅된 갱신토큰 사용
								var rnwTknfinger = LotteCookie.getCookie("SSO_RNW_TKN"),
									rnwTknTime = LotteCookie.getCookie("SSO_RNW_TKN_TIME");
								if(rnwTknfinger && rnwTknTime){
									LotteUserService.callAutoSsoLogin(ssoAuto).then(function(autoRes){ // SSO 자동로그인 성공
										// SSO 자동로그인 성공시 접근/갱신 토큰 값 기존 지문 로그인함수에 전달 
										$scope.fingerPrintLoginOrigin(autoRes);
	
									}).catch(function(){ // SSO 자동로그인 실패시
										console.log("[SSO 로그인 실패, 지문로그인 실패]");
									}); 
								}else{ // SSO 갱신토큰 및 저장날짜 없음
									console.log("[SSO 갱신토큰 없음 지문 로그인 실패]");
								}
	
							}
							, error: function (data) {
								console.log("갱신토큰값 호출실패");
							}
						});

						
					}else{ //멤버스 서버 비활성화
						console.log("[SSO 비활성화 기존 지문로그인 호출]");
						//$scope.fingerPrintLoginOrigin();
					}

				}

				// sso 로그인 추가로 기존 함수명 변경 
				$scope.fingerPrintLoginOrigin = function (ssoLoginTkn) { // iOS 지문인식 로그인

					var fingerPrintInfo = LotteStorage.getLocalStorage("fingerPrint") ,
						fingerPrintTmp = [];

					if (fingerPrintInfo) {
						fingerPrintTmp = fingerPrintInfo.split("|");
					}

					if (fingerPrintTmp[0] && fingerPrintTmp[0] != "") {
						var autologinFlag = false,
							mbrIP = "",
							data = {
								mbrNo: fingerPrintTmp[0],
								auto: autologinFlag
							};
						
							if(ssoLoginTkn){
								data.sso_aces_tkn = (ssoLoginTkn.acesTkn) ? ssoLoginTkn.acesTkn : "";
								data.sso_rwn_tkn = (ssoLoginTkn.rnwTkn) ? ssoLoginTkn.rnwTkn : "";
							
							}
						
						// 자동로그인 여부 Flag
						if ($scope.isOnTab == 0 && angular.element("input[name='auto']").length > 0) { // 통합회원
							autologinFlag = angular.element("input[name='auto']").val();
						} else if ($scope.isOnTab == 1 && angular.element("input[name='autoEasy']").length > 0) { // 간편가입 계정
							autologinFlag = angular.element("input[name='autoEasy']").val();
						}

						data.auto = autologinFlag;

						if ($scope.mbrIP) { // 사용자 Client IP
							mbrIP = $scope.mbrIP;
						}
						data.mbrIP = mbrIP;
						data.save = $("#save").val(); // 아이디 저장여부
						
						$.ajax({
							type: 'post'
							, async: false
							, url: LotteCommon.fingerLoginProcUrl
							, data: data
							, success: function (data) {

								loginResultChk(data, true);
							}
							, error: function (data) {
								alert("로그인 실패했습니다");
							}
						});
					}
				};

				$scope.loginInfoSetLocalStorage = function (loginId) { // 로그인 성공시 지문 로그인을 위하여 LocalStorage에 mbrNo 저장
					var mbrNo = LotteCookie.getCookie("MBRNO_M");
					if( mbrNo && loginId && $scope.isAvailFingerprintLogin() ){
						LotteStorage.setLocalStorage("fingerPrint", mbrNo + "|" + loginId);
					}

					/*if ($scope.appObj.isApp && $scope.appObj.isIOS && mbrNo && loginId) {
						LotteStorage.setLocalStorage("fingerPrint", mbrNo + "|" + loginId);
					}*/
				};

				$scope.none_member_buy = function () { // 비회원 구매하기 버튼 클릭
					$('.easy_login_wrap').hide();
					$('#view_order_wrap2').show();
					$scope.subTitle = '비회원 구매하기';
				};

				$scope.none_member_search = function () { // 비회원 주문조회 버튼 클릭
					// console.log("호출됨");
					$('.easy_login_wrap').hide();
					$('#view_order_wrap').show();
					$scope.subTitle = '비회원 주문조회';
				};

				/**
				 * 비회원 주문조회 버튼 딜레이
				 * 페이지 이동 후 키보드 영역 남는 문제 수정
				 */
				$scope.searchOrderNumDelay = function(){
					$timeout($scope.searchOrderNum, 200);
				};
				
				$scope.searchOrderNum = function () { // 비회원 주문 조회
					// console.log("호출됨");
					// 비회원
					$scope.sendTclick("m_DC_loginNMB_clk_Btn_1");
					if ($.trim($('#frm input[name=ord_no]').val()) == '') {
						alert('주문번호를 입력해 주세요.');
						$('#frm input[name=ord_no]').focus();
						return;
					}

					if ($.trim($('#frm input[name=grockle_mail]').val()) == '') {
						alert('이메일을 입력해 주세요.');
						$('#frm input[name=grockle_mail]').focus();
						return;
					}

					$('#frm input[name=ord_no]').val(($('#frm input[name=ord_no]').val()).replace(/-/gi, ''));
					$("#frm input[name=grockle_yn]").val("Y");
					$("#frm input[name=simpleSignMember]").val("N");

					$scope.grockle_yn = "Y";
					$scope.simpleSignMember = "N";
					$scope.ord_no = ($('#frm input[name=ord_no]').val()).replace(/-/gi, '');
					$scope.login();
				};

				$scope.buy = function () { // 비회원구매
					if ($scope.fromPg == LotteCommon.NORMAL_LOGIN)
						return;

					var json_str = '';
					var goodsno_chk = false;

					var parameters = LotteUtil.getParameters();

					for (var i = 0; i < parameters.length; i++) {
						var param_name = parameters[i].name;

						json_str += (json_str == '' ? '' : ',') + '"' + param_name + '":"' + parameters[i].value + '"';

						if ((param_name == 'goodsno' || param_name == 'cartSn') && (parameters[i].value != ''))
							goodsno_chk = true;

						if (param_name == 'targetUrl') {
							var goods_no = decodeURIComponent(LotteUtil.getUrlParameter(parameters[i].value, 'goods_no'));

							if (goods_no != '')
								goodsno_chk = true;

							json_str += (json_str == '' ? '' : ',') + '"goodsno":"' + goods_no + '"';
						}
					}

					json_str += (json_str == '' ? '' : ',') + '"grockle_yn":"Y"';
					json_str = '{' + json_str + '}';

					var sci_call_str = '';
					var sci_url = LotteCommon.sci_url + '?' + $scope.baseParam; // "/sci/pcc_v3_seed.jsp?" +

					// 엘롯데 처리를 위한 파라메터 추가하고 호출 URL은 롯데닷컴으로 한다
					var returnDomain = window.location.href;
					sci_url += "&returnDomain=" + returnDomain;
					sci_call_str = 'window.location = "' + sci_url+'";';

					if (goodsno_chk) {
						var frmData = $('#frm_send').serializeArray();
						var newJsonData = new Object;

						for (var i = 0; i < frmData.length; i++) {
							if (frmData[i].name == 'grockle_yn') {
								newJsonData[frmData[i].name] = "Y";
							} else {
								newJsonData[frmData[i].name] = encodeURIComponent(frmData[i].value);
							}
						}

						var newJsonString = JSON.stringify(newJsonData);
						LotteStorage.setLocalStorage("sci_param", newJsonString); // 주문서로 전달하기 위한 파리메터
						LotteStorage.setLocalStorage("sci_action", $('#frm_send').attr('action')); // 주문서 이전 사은품 선택 페이지 url
						LotteStorage.setLocalStorage("sci_login_href", location.href); // 로그인 폼 url
						// document.write(sci_call_str);
						$('body').append('<script>' + sci_call_str + "</script>");
					} else {
						alert("상품 정보가 전달되지 않았습니다. 다시 시도해 주세요.");
					}
				};

				$scope.buyLoadingClose = function () {
					angular.element("#buyLoading").hide();
				};

				// 20160530 휴면회원 복원 로딩 레이어 닫기
				$scope.mbRestoreClose = function () {
					$scope.mbRestoreLoadingFlag = false;
				};

				// 20160418 박형윤 PMS 오류로 인하여 MBRNO APP 전달 API 추가
				$scope.callLoginPMSInfo = function (loginId, mbrNo) {
					if ($scope.appObj.isApp && loginId && mbrNo) { // 앱일 경우에만 호출
						var appLoginInfo = loginId;

						/*
						 * 엘롯데 iOS Ver. 1.5.6 이상
						 * 엘롯데 Android Ver. 1.5.9 이상
						 * 닷컴 iPad Ver 2.2.3 이상
						 * 닷컴 iPhone Ver. 2.56.0 이상
						 * 닷컴 Android Ver 2.6.0 이상
						 * 닷컴 SKT Android Ver. 2.0.3 이상
						 */
						if (
							(
								$location.host().indexOf(".ellotte.com") > -1 && // 엘롯데
								(
									($scope.appObj.isIOS && $scope.appObj.verNumber >= 156)  || // 엘롯데 iOS
									($scope.appObj.isAndroid && $scope.appObj.verNumber >= 159) // 엘롯데 Android
								)
							) ||
							(
								$location.host().indexOf(".lotte.com") > -1 && // 롯데닷컴
								(
									($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.verNumber >= 223) || // 닷컴 iPad
									($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.verNumber >= 2560) || // 닷컴 iPhone
									($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 260) || // 닷컴 Android
									($scope.appObj.isAndroid && $scope.appObj.isSktApp && $scope.appObj.verNumber >= 203) // 닷컴 SKT Android
								)
							)
						) { // APP version 분기
							appLoginInfo = mbrNo + "|" + loginId;
						}

						if ($scope.appObj.isIOS) { // iOS
							var iframe = document.createElement("iframe");
							iframe.style.visibility = "hidden";
							iframe.style.display = "none";
							iframe.src = "loginCheck://loginId/" + appLoginInfo;
							document.body.appendChild(iframe);
						} else { // Android
							if (window.loginCheck) {
								try {
									window.loginCheck.callAndroid("loginId/" + appLoginInfo);
								} catch (e) {}
							}
							// console.log("Login Info : " + "loginId/" + appLoginInfo);
						}
					}
				};

				// 로그인 결과
				$scope.loginResult = function (loginResult, grockle_yn, grockle_mbr_no, login_id, ord_no, email, mbr_no, fingerPrintFlag) { // 20160217 박형윤 fingerprint 지문로그인
					var msg = "";

					//console.log("loginResult %o grockle_yn %o grockle_mbr_no %o login_id %o mbr_no %o fingerPrintFlag %o",loginResult, grockle_yn, grockle_mbr_no, login_id,mbr_no, fingerPrintFlag);
					if (grockle_yn != "Y") { // 회원일경우
						// 통합회원 / 간편회원 tab
						var simpleSignYn = $scope.simpleSignYn;
                        
                        //20171019 회원 강제 비밀번호변경 프로세스 적용
                        //alert("loginResult :" + loginResult);
                        if(loginResult == "31" || loginResult == "310" || loginResult == "311"){
                            if(loginResult == "310"){//지문로그인 엘포인트
                                //$scope.isOnTab = 0;
                            }else if(loginResult == "311"){//지문로그인 간편
                                $scope.isOnTab = 1;
                            }
                            $scope.alpass = true;
                            $scope.alpass_case1 = false; 
                            $scope.alpass_case2 = true;
                            $(window).scrollTop(0);
                            return;
                        }else if(loginResult == "9131"){ //자동로그인인경우
                            $scope.alpass = true;
                            $scope.alpass_case1 = true; 
                            $scope.alpass_case2 = false;                                   
                            $(window).scrollTop(0);
                            return;
                        }
                        
						if (fingerPrintFlag) { // 20160217 박형윤 fingerprint 지문로그인
							switch (loginResult) {
								case "01": msg = "롯데닷컴 회원에 가입되어 있지 않습니다. 다시 입력해주세요.";
									break;
								case "02": msg = "로그인이 30일 이상 지난 아이디입니다.\n 개인정보 보호를 위해 다시 로그인해주세요."; // 지문로그인 30일 지남 추가
									break;
								case "14": msg = "로그인 실패(10회)로 인해 차단되었습니다.\n롯데닷컴 웹사이트>마이롯데에서 비밀번호를 새로 발급받으시기 바랍니다.";
									break;
								case "16": msg = "로그인이 1년이상 지난 휴면회원 아이디입니다.\n아이디와 비밀번호를 재입력하여 로그인해주세요.";
									break;
								case "9103": msg = "다른 기기에서 비밀번호를 10회 연속 잘못 입력하셨습니다.\n개인정보 보호를 위해 다시 로그인해주세요.";
									break;
								case "9105": msg = "자동 로그인을 이용하실 수 없습니다.\n다시 로그인해주세요.";
									break;
								case "9106": msg = "자동 로그인을 이용하실 수 없습니다.\n다시 로그인해주세요.";
									break;
								case "9107": msg = "롯데닷컴을 탈퇴하셨네요.\n다시 방문하신 것을 환영하며,\n편리한 롯데닷컴 이용을 위해 회원가입 부탁드립니다.";
									break;
								case "9109": msg = "자동 로그인을 이용하실 수 없습니다.\n다시 로그인해주세요.";
									break;
								case "9130": msg = "롯데닷컴에 오랜만에 방문하셨네요!\n개인정보 보호를 위해 다시 로그인해주세요.";
									break;
							}
						} else {
							switch (loginResult) {
								case "01": msg = "아이디 또는 비밀번호가 일치하지 않습니다.";
									break;
								case "02": msg = "아이디 또는 비밀번호가 일치하지 않습니다.";
									break;
								case "03": msg = "로그인정보가 일치하지 않습니다.(실패5회)\n로그인 실패 10회가 되면 로그인이 차단되오니 확인 바랍니다.";
									break;
								case "04": msg = "서비스를 이용하실려면 약관동의가 필요합니다.";
									break;
								case "05": msg = "비정상계정 사용 중이십니다.\n고객센터 1899-8900로 문의 하세요.";
									break;
								case "06": msg = "비정상계정 사용 중이십니다.\n고객센터 1899-8900로 문의 하세요.";
									break;
								case "07": msg = "회원님의 사이트 이용 권한이 L.POINT회원 관리자에 의하여 일시 정지 되었습니다.\n일시정지 사유는 고객센터 1899-8900로 문의 바랍니다.";
									break;
								case "08": msg = "비정상계정 사용 중이십니다.\n고객센터 1899-8900로 문의 하세요.";
									break;
								case "09": msg = "비정상계정 사용 중이십니다.\n고객센터 1899-8900로 문의 하세요.";
									break;
								case "10": msg = "회원님의 사이트 이용 권한이 L.POINT회원 관리자에 의하여 일시 정지 되었습니다.\n일시정지 사유는 고객센터 1899-8900로 문의 바랍니다.";
									break;
								case "11": msg = "비밀번호가 보안상 취약합니다.\n비밀번호를 변경해주세요.";
									break;
								case "12": msg = "로그인정보가 올바르지 않습니다.\n다시 입력해 주세요.";
									break;
								case "13": msg = "로그인정보가 올바르지 않습니다.\n다시 입력해 주세요.";
									break;
								case "14": msg = "로그인 실패(10회)로 인해 차단되었습니다.\n롯데닷컴 웹사이트>마이롯데에서 비밀번호를 새로 발급받으시기 바랍니다.";
									break;
								case "15": msg = "이메일 인증이 필요합니다.\n이메일 인증 완료 후 로그인 해주세요.";
									break;
							}
						} 

						// 스마트픽앱이면 로그인이 9 - rudolph:151202
						if (loginResult == "0" ||  // 정상 로그인
							loginResult == "9" || // 스마트픽앱 로그인
							loginResult == "21" || // 임직원 로그인
							loginResult == "11") { // 비밀번호 취약 알림
							$scope.loginInfoSetLocalStorage(login_id); // 20160217 박형윤 fingerprint // 로그인 성공시 회원정보 저장

							if (loginResult == "11") {
								alert(msg);
							}

							if (loginResult == "21") { // 임직원 로그인 시 팝업 띄우기
								$("#pageCover").show();
								$("#lotteStaffGuide").show();
								return;
							}

							var APP_MBR_NO = LotteCookie.getCookie("MBRNO");

							if (LotteUtil.isSmpApp()) {
								//transLoginIdToApp('login', login_id);
								$scope.callLoginPMSInfo(login_id, APP_MBR_NO);
							} else {
								if ($scope.appObj.isApp) { // 앱이면
									if (($scope.mach_knd_cd == 'android' || $scope.mach_knd_cd == 'iphone'
										|| $scope.mach_knd_cd == 'ipad') && isNewestApp()) {  
										//transLoginIdToApp('login', login_id);
										$scope.callLoginPMSInfo(login_id, APP_MBR_NO);
									}
								}
							}

							// 로그인 상태 변경시 장바구니 카운트 삭제
							LotteCookie.delCookie("cartCount"); // 장바구니 갯수 제거 (로그인/로그아웃 시 장바구니 개수는 따로 체크되어야해서 세션에서 삭제);

							if ($scope.goOrderFormYn == "N") { // 로그인 성공 이후 페이지 이동
								
								// 2014.09.30 23까지 노출
								if (parseInt($scope.curr_time) > 2014093022) {
									// console.log("TARGET_URL " + $scope.targetUrl);
									var loginCompleteTargetUrl = "";

									if ($scope.targetUrl == "") {
										//20181130 로그인 후 페이지 이동 replace 처리
										loginCompleteTargetUrl = LotteCommon.mainUrl + "?" + $scope.baseParam;
										// console.log("1");
									} else {
										if ($scope.targetUrl.toLowerCase().indexOf('loginform.do') >= 0) {
											
											//20181130 로그인 후 페이지 이동 replace 처리
											loginCompleteTargetUrl = LotteCommon.mainUrl + "?" + $scope.baseParam;
										} else {
											
											//20181130 로그인 후 페이지 이동 replace 처리
											loginCompleteTargetUrl = $scope.targetUrl;
										}
										// console.log("2");
									}

									if (loginCompleteTargetUrl) {
										window.location.replace(loginCompleteTargetUrl);
									}
								} else {
									$scope.getGradeUp();
								}
							} else { // 로그인 이후 주문서 이동시
								angular.element("#buyLoading").show();
								$("#frm_send input[name=grockle_yn]:hidden").val("N"); // 비회원여부
								// 20190103 로그인 뒤로가기 개선
								LotteStorage.setSessionStorage('fromLogin', 'Y');
								document.frm_send.submit();
							}
							
						} else if (loginResult == "04") { // 서비스 약관 미동의 (서비스를 이용하실려면 약관동의가 필요합니다)
							alert(msg);

							var family_url = "member.lpoint.com/door/user/mobile/";
							var target_url = "/auth_agree.jsp";
							var return_url = '';

							// 앱/웹 분기처리
							if($scope.schema == "") {
							 	return_url = encodeURIComponent(window.location.href, "UTF-8");
							}else{
								return_url = window.location.href.replace(/^http(s)?/,$scope.schema);
							}

							var side_small = LotteUtil.getLoginSeed().toLowerCase();
							var side_big = LotteUtil.getLoginSeed().toUpperCase();

							family_url += side_small + target_url + "?sid=" + side_big + "&custid=" + $scope.grockle_yn + "&sch=" + $scope.schema;
							family_url += "&returnurl=" + return_url;

							if ($scope.schema != "") { // 앱일경우
								if (LotteUtil.boolAppInstall(uagent)) {
									window.location = "family://" + family_url;
								} else if (LotteUtil.boolAndroid(uagent)) {
									window.myJs.callAndroid("https://" + family_url);
								}
							} else {
								window.open("https://" + family_url, "family");
							}
						} else if (loginResult == "14") { // 로그인 실패(10회)로 인해 차단
							if ($scope.simpleSignYn == "Y") {
								location.href = LotteCommon.loginBlock;
							} else {
								alert(msg);
							}
						} else if (loginResult == "30") { // 엘포인트 휴면회원인 경우
							var family_url = "member.lpoint.com/view/door/";
							var target_url = "updateDmcyMbl.jsp";
							var return_url = '';

							// 앱/웹 분기처리
							if($scope.schema == "") {
							 	return_url = encodeURIComponent(window.location.href, "UTF-8");
							}else{
								return_url = window.location.href.replace(/^http(s)?/,$scope.schema);
							}

							var sid_small = LotteUtil.getLoginSeed().toLowerCase();
							var sid_big   = LotteUtil.getLoginSeed().toUpperCase();

							family_url += target_url + "?sid=" + sid_big + "&custid=" + grockle_yn + "&sch=" + $scope.schema;
							family_url += "&returnurl=" + return_url;

							if (!$scope.schema == "") { // app일경우
								if (LotteUtil.boolAppInstall(uagent)) { // 아이폰일경우
									window.location = "family://" + family_url;
								} else if (LotteUtil.boolAndroid(uagent)) { // 안드로이드일경우
									window.myJs.callAndroid("https://" + family_url);
								}
							} else {
								window.location = "https://" + family_url;
							}
						} else if (loginResult == "90") { // 비회원 주문 조회
							$("#frm_send input[name=grockle_yn]:hidden").val("Y"); // 비회원여부
							$("#frm_send input[name=grockle_mbr_no]:hidden").val(mbr_no);

							document.frm_send.action = "/mylotte/purchase/m/purchase_list.do?" + $scope.baseParam + "&ordListCase=1";
							document.frm_send.submit();
						} else if (loginResult == "91") { // 휴면 회원 복원
							// 20160530 휴면회원 복원 개선
							// $("#frm input[name=drmcCust_id]:hidden").val(grockle_yn);
							// document.frm.action = '/login/dormancyInfo.do';
							// document.frm.submit();
							$scope.mbRestoreLoadingFlag = true;
							$.ajax({
								type: "post",
								async: false,
								url: LotteCommon.dormancyRestoreAjaxUrl + "?" + $scope.baseParam,
								data: {
									login_id: login_id,
									simpleMember: $scope.simpleSignYn
								},
								success: function (data) {
									var resultCode = data.result;
									$scope.mbRestoreLoadingFlag = false;

									if (resultCode == "000") { // 복원 성공

										if(isLoginProgressFlag && !fingerPrintFlag) isLoginProgressFlag = false;

											$scope.login(); // 재로그인
									} else {
										location.href = LotteCommon.dormancyRestoreFail + "?" + $scope.baseParam;
									}
								},
								error: function (error) {
									$scope.mbRestoreLoadingFlag = false;
									alert(error.message);
									location.href = LotteCommon.dormancyRestoreFail + "?" + $scope.baseParam;
								}
							});
						} else if (loginResult == "20") { // 제휴 로그인 아이디 미맵핑 (소셜 로그인 매핑이 안되어 있는 경우)
							if (login_id && grockle_yn) {
								$scope.socialMapping = true;

								var family_url = "member.lpoint.com/app/login/";
								var target_url = "LSLA200910.do";
								//var return_url = window.location.href;
								var return_url = LotteCommon.loginForm + "?" 
									+ $scope.baseParam 
									+ "&remapping=" + angular.element(el).find("#sociallogin_frm >input[name='copCls']").val();

								// 멤버스에 파라미터로 날리면 특수문자를 멋데로 치환하여 값이 제대로 리턴되지 않음
								LotteStorage.setSessionStorage("socialCopToken", login_id);

								if (angular.element("#frm_send").length > 0) {
									var i = 0,
										formData = $("#frm_send").serializeArray();

									for (i = 0; i < formData.length; i ++) {
										if (formData[i].value != "" && formData[i].name != "c" && formData[i].name != "udid" && formData[i].name != "v" && formData[i].name != "v" && formData[i].name != "cn" && formData[i].name != "cdn" && formData[i].name != "schema" && formData[i].name != "targetUrl" && formData[i].name != "back_url") {
											return_url += "&" + formData[i].name + "=" + encodeURIComponent(formData[i].value);}
									}
								}

								return_url += "&targetUrl=" + encodeURIComponent($scope.targetUrl);

								var sid_small = LotteUtil.getLoginSeed().toLowerCase();
								var sid_big   = LotteUtil.getLoginSeed().toUpperCase();

								// 앱/웹 분기처리
								/*
								if($scope.schema == "") {
								 	return_url = encodeURIComponent(return_url, "UTF-8");
								}else{
									return_url = return_url.replace(/^http(s)?/,$scope.schema);
								}
								*/
								// 20170808 박형윤 새창 처리 필요없어 앱/웹 분기 처리 안함
								return_url = encodeURIComponent(return_url, "UTF-8");

								family_url += target_url + "?sid=" + sid_big + "&sch=" + $scope.schema + "&copToken=" + login_id + "&copCls=" + angular.element(el).find("#sociallogin_frm >input[name='copCls']").val();
								family_url += "&returnurl=" + return_url;

								/*
								if (!$scope.schema == "") { // app일경우
									if (LotteUtil.boolAppInstall(uagent)) { // 아이폰일경우
										window.location = "family://" + family_url;
									} else if (LotteUtil.boolAndroid(uagent)) { // 안드로이드일경우
										window.myJs.callAndroid("https://" + family_url);
									}
								} else {
									window.location = "https://" + family_url;
								}
								*/
								// 20170808 박형윤 앱/웹 분기 필요없음
								window.location = "https://" + family_url;
							} else {
								alert("죄송합니다. 로그인 정보가 정확하지 않습니다.");
							}
						}else if (angular.element(el).find("#sociallogin_frm >input[name='copCls']").val() == '02' && loginResult == "12"){ //20181122 김응 네이버 로그인시 얼럿만 나오고 멈추어 있는 현상 
                            alert("네이버 로그인 오류입니다.\nL.POINT 통합회원 또는 간편회원 로그인을 이용해주세요.");
                            location.href = LotteCommon.loginForm + "?" + $scope.baseParam + "&targetUrl=" + encodeURIComponent($scope.targetUrl);
                        } else {
							alert(msg);
							$scope.socialMapping = false;
						}
					} else {
						switch (loginResult) {
							case "1": msg = "주문번호 또는 이메일 주소에 맞는 주문내역이 없습니다.";
								break;
							default : msg = "정보가 올바르지 않습니다.\n다시 입력해 주세요.";
								break;
						}

						if (loginResult == "0") {
							$("#grockle_frm input[name=grockle_yn]").val(grockle_yn);
							$("#grockle_frm input[name=grockle_mbr_no]").val(grockle_mbr_no);
							$("#grockle_frm input[name=orderNo]").val($("#frm input[name=ord_no]").val());

							var purchase_url = $scope.targetUrl;

							if (purchase_url == '' || purchase_url == null) {
								purchase_url = LotteCommon.mainUrl + "?" + $scope.baseParam;
							} else {
								purchase_url = purchase_url.replaceAll('purchase_list', 'purchase_view');
							}

							angular.element("#grockle_frm").attr("action",purchase_url);
							$("#grockle_frm").submit();
						} else {
							alert(msg);
						}
					}
				};

				// 임직원 등록하기
				$scope.RegLotteStaff = function () {
					var requestData = "";
					requestData += "staff_mbr_no=";
					$.ajax( {
						type: 'post',
	                    async: false,
	                    url: LotteCommon.updateStaffInfoAjaxUrl,
	                    data:requestData,
	                    success: function(data) {
	                       data = data.result.trim();
	                         if ( data == "OK" ){
	                           alert("임직원으로 등록되었습니다.");
	                           $("#pageCover").hide();
		         			   $("#lotteStaffGuide").hide();
		         				if ($scope.targetUrl == "") {
		         					window.location.href = LotteCommon.mainUrl + "?" + $scope.baseParam;
		         					// console.log("1");
		         				} else {
		         					if ($scope.targetUrl.toLowerCase().indexOf('loginform.do') >= 0) {
		         						window.location.href = LotteCommon.mainUrl + "?" + $scope.baseParam;
		         					} else {
		         						window.location.href = $scope.targetUrl;
		         					}
		         					// console.log("2");
		         				}
	                         }else{
	                             alert("임직원 등록에 실패했습니다.");
	                         }
	                    },
	                    error:function(r){
	                        alert(r.message);
	                    }
	                    //$("#pageCover").hide();
						//$("#lotteStaffGuide").hide();
					} );
				};

				// 임직원 등록하기 레이어팝업 닫기
				$scope.closeLotteStaffPopup = function () {
					if ($scope.goOrderFormYn == "N") { // 로그인 성공 이후 페이지 이동
						// 2014.09.30 23까지 노출
						if (parseInt($scope.curr_time) > 2014093022) {
							// console.log("TARGET_URL " + $scope.targetUrl);
							if ($scope.targetUrl == "") {
								window.location.href = LotteCommon.mainUrl + "?" + $scope.baseParam;
								// console.log("1");
							} else {
								if ($scope.targetUrl.toLowerCase().indexOf('loginform.do') >= 0) {
									window.location.href = LotteCommon.mainUrl + "?" + $scope.baseParam;
								} else {
									window.location.href = $scope.targetUrl;
								}
								// console.log("2");
							}
						} else {
							$scope.getGradeUp();
						}
					} else { // 로그인 이후 주문서 이동시
						angular.element("#buyLoading").show();
						$("#frm_send input[name=grockle_yn]:hidden").val("N"); // 비회원여부
						document.frm_send.submit();
					}

					$("#pageCover").hide();
					$("#lotteStaffGuide").hide();
				};
                //20171019 회원 강제 비밀번호변경 프로세스 적용
                    /*
                    간편회원계정 - 비밀번호찾기 페이지로 이동
                    L포인트회원 - 엘포인트 회원비밀번호 찾기                     
                    자동로그인 -----------
                    간편회원계정,L포인트회원 - (로그아웃되었습니다 메시지 ) - 메인페이지로 이동
                    */      
                $scope.alpass_close = function(){
                    $scope.alpass = false;
                    $scope.alpass_case1 = false; 
                    $scope.alpass_case2 = false;                      
                }
                $scope.alpass_ok = function(){
                    if($scope.alpass_case1){//자동로그아웃
                        location.href = LotteCommon.mainUrl + "?" + $scope.baseParam;
                    }else{
                        if($scope.isOnTab == 1){//간편계정
                            $scope.goSimpleMemberPw();
                        }else{
                            $scope.goFamilySite('passwd'); //L포인트 회원
                        }
                    }
				}

				/**
				 * SSO 통합회원제 화면호출 처리로 변경
				 * 2018-11-16 김지호
				 * 회원가입게이트페이지 추가로 type 추가 0 : lpoint 회원가입 || 1 : 간편회원가입
				*/ 
				 $scope.goFamilySite = function (div) {
					// rudolph:151112 tclick
					
					if ($scope.joinBtnViewYn == "N") {
						// 2015.05.29 iOS 닷컴, 엘롯데 APP 회원가입 pro 공통코드로 제어
						var isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);

						if ((div == "id" || div == "passwd" || div == "mem_reg") && isIDevice) {
							alert("[아이디/비밀번호 찾기, 회원가입] 서비스는 일시적으로 롯데닷컴/엘롯데 PC를 통해 이용가능합니다. 이용에 불편을 드려 죄송합니다.");
							return;
						}
					}
					
					var ssoTarget_url = ""; // SSO 화면 호출 URL
					var return_url = window.location.href; // encodeURIComponent(window.location.href, "UTF-8"); //URI 형태 인코딩시 SSO 리턴 URL 오류 발생 
					
					if (div == "id") { // 아이디찾기

						$scope.sendTclick("m_DC_login_clk_Lnk_1");
						ssoTarget_url = "/exView/manage/fdId_01_001";

					} else if (div == "passwd") { // 비밀번호 찾기

						$scope.sendTclick("m_DC_login_clk_Lnk_2");
						ssoTarget_url = "/exView/manage/fdPassword_01_001";

					} else if (div == "mem_reg") { // 회원가입
					
						$scope.sendTclick("m_DC_login_clk_Lnk_3");
						ssoTarget_url ="/exView/join/mbrJoin_01_001";
					}
					
					
					if($scope.aliveSso){
						// 통합회원제 화면 호출
						LotteUserService.callSsoScreen(ssoTarget_url,return_url);
					}else{
						alert("불편을 드려서 죄송합니다. 잠시 후, 다시 시도해 주세요.");
					}

					/**
					 * sso 통합회원제 화면호출 처리로 기존로직 주석처리 START
					 * 2018-11-16 김지호
					 */ 

					/*
					if (div == "id") {
						$scope.sendTclick("m_DC_login_clk_Lnk_1");
					} else if (div == "passwd") {
						$scope.sendTclick("m_DC_login_clk_Lnk_2");
					} else if (div == "mem_reg") {
						$scope.sendTclick("m_DC_login_clk_Lnk_3");
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
					var return_url = '';

					// 앱/웹 분기처리
					if($scope.schema == "") {
						 return_url = encodeURIComponent(window.location.href, "UTF-8");
					}else{
						return_url = window.location.href.replace(/^http(s)?/,$scope.schema);
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
					}*/

					
					/**
					 * sso 통합회원제 화면호출 처리로 기존로직 주석처리 END
					 * 2018-11-16 김지호
					 */ 
				}; 

				// 패밀리 안내 팝업 닫기
				$scope.family_pop_close = function () {
					LotteStorage.setLocalStorage("family_chk", "Y");
					$("#family_popup").hide();
				};

				// Password / email입력 후 Enter
				$scope.fn_enterKeyUp = function (elName, e) {
					if (e.keyCode != 13)
						return;

					// 20160201 박형윤 포커스가 빠지지 않아 키보드가 내려가지 않는 문제 수정
					if ("password" == elName) {
						$scope.checkLogin("N");
					} else {
						$scope.checkLogin("Y");
					}
				};

				// 레이어팝업 닫기
				$scope.closeMemPopup = function () {
					$(".benefit_layer").hide();
					window.location.href = $scope.targetUrl;
				};

				// 등급업 확인
				$scope.getGradeUp = function () {
					$.ajax({
						type: 'post'
						, async: false
						, url: LotteCommon.gradeUpUrl + '?' + $scope.baseParam
						, success: function (data) {
							if (data == "Y") {
								if (!$scope.getAppEventPopCookie("ellotteMemPopYn")) {
									$(".benefit_layer").show();
								} else {
									
									//20181130 로그인 후 페이지 이동 replace 처리
									window.location.replace($scope.targetUrl);
								}
							} else {
								//20181130 로그인 후 페이지 이동 replace 처리
								window.location.replace($scope.targetUrl);
							}
						}
					});
				};

				$scope.getAppEventPopCookie = function (cName) {
					cName = cName + "=";

					var cookieData = document.cookie;
					var start = cookieData.indexOf(cName);
					var cValue = '';

					if (start != -1) {
						start += cName.length;

						var end = cookieData.indexOf(';', start);

						if (end == -1)
							end = cookieData.length;

						cValue = cookieData.substring(start, end);
					}

					return unescape(cValue);
				};

				// 레이어팝업 오늘은 그만보기
				$scope.setTodayNotView = function (cookieNm) {
					var paramCookieNm = ('${fn:trim(cookie_name)}' == '' ? 'ptnCpnDispYn' : '${fn:trim(cookie_name)}');

					if (null == cookieNm || undefined == cookieNm) {
						setCookieToday(paramCookieNm, 'no', 1);
					} else if (cookieNm.length > 0) {
						setCookieToday(cookieNm, 'no', 1);
					}

					$scope.closeMemPopup();
				};

				// 오늘까지만 안보이게 쿠키 설정
				$scope.setCookieToday = function (name, value, expiredays) {
					// 내일 00:00 시 구하기
					var todayDate = new Date();

					todayDate.setDate(todayDate.getDate() + expiredays );

					// 쿠키 expire 날짜 세팅
					var expireDate = new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate());
					document.cookie = name + '=' + escape( value ) + '; path=/; expires=' + expireDate.toGMTString() + ';'
				};

				$scope.goSimpleMemberId = function () {
					// rudolph:151112 tclick
					$scope.sendTclick("m_DC_LoginSpl_clk_Lnk_1");
					location.href = LotteCommon.simpleSignMemberIdFind + (location.href.indexOf("?") > -1 ? location.href.substring(location.href.indexOf("?")) : "");
				};

				$scope.goSimpleMemberPw = function () {
					// rudolph:151112 tclick
					$scope.sendTclick("m_DC_LoginSpl_clk_Lnk_2");
					location.href = LotteCommon.simpleSignMemberPWFind + (location.href.indexOf("?") > -1 ? location.href.substring(location.href.indexOf("?")) : "");
				};

				// SocialLogin
				// 네이버 제휴 로그인 (Open ID)
				var redirect_uri = $location.protocol() + "://" + $location.host() + "/login/m/loginForm.do?" + $scope.baseParam;
				//var redirect_uri = LotteCommon.loginForm + "?" + $scope.baseParam;

				// <input type="hidden" name="fromPg" value="1">
				// <input type="hidden" name="smp_buy_yn" value="N">
				// <input type="hidden" name="minority_yn" value="N">
				// <input type="hidden" name="targetUrl" value="http://mo.lotte.com/product/m/product_view.do?c=mlotte&udid=&v=&cn=&cdn=&schema=&goods_no=178546006&curDispNo=5537338&curDispNoSctCd=12&genie_yn=Y&tclick=m_menu_5537338_unit1">
				// <input type="hidden" name="tclick" value="m_DC_ProdDetail_Clk_Btn_2">
				// <input type="hidden" name="goods_no" value="176647859">
				// <input type="hidden" name="item_no" value="0">
				// <input type="hidden" name="goods_cmps_cd" value="50">
				// <input type="hidden" name="goods_choc_desc" value="">
				// <input type="hidden" name="ord_qty" value="1">
				// <input type="hidden" name="infw_disp_no" value="5537338">
				// <input type="hidden" name="infw_disp_no_sct_cd" value="12">
				// <input type="hidden" name="master_goods_yn" value="N">
				// <input type="hidden" name="cart_sn" value="">
				// <input type="hidden" name="cmps_qty" value="0">
				// <input type="hidden" name="mast_disp_no" value="5408344">
				// <input type="hidden" name="shop_memo_tp_cd" value="">
				// <input type="hidden" name="shop_memo_cont" value="">
				// <input type="hidden" name="smpVstShopNo" value="">
				// <input type="hidden" name="smartpickdate" value="">
				// <input type="hidden" name="conr_no" value="">
				// <input type="hidden" name="std_goods_no" value="176647859">
				// <input type="hidden" name="smp_tp_cd" value="">
				// <input type="hidden" name="smp_deli_loc_sn" value="">
				// <input type="hidden" name="cartcatcode" value="5537338">
				// <input type="hidden" name="carttype" value="GOODS">
				// <input type="hidden" name="cartuseyn" value="N">
				// <input type="hidden" name="dir_delv_yn" value="1">
				// <input type="hidden" name="dispno" value="5537338">
				// <input type="hidden" name="goodsnm" value="[스텝2][바로배송] STEP2 리틀쉐프키친 주방놀이[핑크/네추럴]">
				// <input type="hidden" name="goods_sort_cd" value="1387">
				// <input type="hidden" name="goodsdtlcd" value="">
				// <input type="hidden" name="lmt_cnt_max" value="99999">
				// <input type="hidden" name="lmt_cnt_min" value="1">
				// <input type="hidden" name="myshop" value="">
				// <input type="hidden" name="ordertype" value="ORD_TP_NOCART">
				// <input type="hidden" name="tdfSctCd" value="1">
				// <input type="hidden" name="smpVstShopNm" value="">
				// <input type="hidden" name="smartpicktime" value="">
				// <input type="hidden" name="wishlistyn" value="">
				// <input type="hidden" name="opt_name1" value="">
				// <input type="hidden" name="opt_name2" value="">
				// <input type="hidden" name="opt_name3" value="">
				// <input type="hidden" name="opt_name4" value="">
				// <input type="hidden" name="opt_name5" value="">
				// <input type="hidden" name="opt_value1" value="">
				// <input type="hidden" name="opt_value2" value="">
				// <input type="hidden" name="opt_value3" value="">
				// <input type="hidden" name="opt_value4" value="">
				// <input type="hidden" name="opt_value5" value="">
				// <input type="hidden" name="imgUrl0" value="http://image.lotte.com/goods/06/60/54/78/1/178546006_1_280.jpg">
				// <input type="hidden" name="imgUrl" value="http://image.lotte.com/goods/06/60/54/78/1/178546006_1_220.jpg">
				// <input type="hidden" name="mfcpNm" value="THESTEP2COMPANY,LLC.">
				// <input type="hidden" name="brndNm" value="스텝2">
				// <input type="hidden" name="deliverydate" value="">
				// <input type="hidden" name="smartOrd" value="N">
				// <input type="hidden" name="gift_goods_no" value="">
				// <input type="hidden" name="girtGoodsChoice" value="">
				// <input type="hidden" name="smp_prod_yn" value="N">
				// <input type="hidden" name="smp_entr_no" value="">
				// <input type="hidden" name="smp_shop_no" value="">
				// <input type="hidden" name="back_url" value="http%3A%2F%2Fmo.lotte.com%2Fproduct%2Fm%2Fproduct_view.do%3Fc%3Dmlotte%26udid%3D%26v%3D%26cn%3D%26cdn%3D%26schema%3D%26goods_no%3D178546006%26curDispNo%3D5537338%26curDispNoSctCd%3D12%26genie_yn%3DY%26tclick%3Dm_menu_5537338_unit1">
				// <input type="hidden" name="grockle_yn" value="N" ng-if="grockle_yn==false" ng-show="grockle_yn==true"><!-- 비회원여부 -->
				// <input type="hidden" name="grockle_yn" value="Y" ng-if="grockle_yn==true" ng-show="grockle_yn==false"><!-- 비회원여부 -->
				// <input type="hidden" name="grockle_mbr_no" value="">

				if (angular.element("#frm_send").length > 0) {
					var i = 0,
						formData = $("#frm_send").serializeArray();

					for (i = 0; i < formData.length; i ++) {
						if (formData[i].name != "c" && formData[i].name != "udid" && formData[i].name != "v" && formData[i].name != "v" && formData[i].name != "cn" && formData[i].name != "cdn" && formData[i].name != "schema" && formData[i].name != "remapping") {
							// console.log(formData[i].name, formData[i].value);
							redirect_uri += "&" + formData[i].name + "=" + encodeURIComponent(formData[i].value);
						}
					}
				}

				// 닷컴
				var naver = NaverAuthorize({
					client_id: "8qyO2B0Dcxe0fHbqCrUq",
					client_secret: "C1hTCuIeDI",
					redirect_uri: redirect_uri
				});

				// // 엘롯데
				// var naver = NaverAuthorize({
				// 	client_id: "ybi0adwXC3VEWfOuP32w",
				// 	client_secret: "khhSv5ILeQ",
				// 	redirect_uri: redirect_uri
				// });

				function generateState() { // State 값 생성 (네이버용)
					var oDate = new Date();
					return oDate.getTime();
				}

				function saveState(state) { // State 값 저장 (네이버용)
					LotteCookie.delCookie("state_token");
					LotteCookie.setCookie("state_token", state);
				}

				$scope.naverLogin = function () { // 네이버 로그인
					$scope.sendTclick("m_DC_Login_Clk_btn_naver");
					var state = generateState();
					saveState(state);
					$timeout(function () {
						naver.login(state);
					}, 300);
				};

				$scope.fbLogin = function () { // 페이스북 로그인
					$scope.sendTclick("m_DC_Login_Clk_Lnk_4");
					var token;

					try {
						// 닷컴
						FB.init({
							appId: "959491840761275",
							status: true,
							cookie: true,
							xfbml: true
						});

						// 엘롯데
						// FB.init({
						// 	appId: "1682013335354950",
						// 	status: true,
						// 	cookie: true,
						// 	xfbml: true
						// });

						FB.login(function (response) {
							if (response.status === "connected") { // 페이스북 로그인 성공
								var copToken = response.authResponse.accessToken;
								//socialLogin(copToken, "01");
							} else if (response.status === "not_authorized") {
								// 사용자가 페이스북 APP 사용 동의를 안했을때 처리
								alert("Facebook 정보 제공에 동의해 주셔야 Facebook ID로 로그인하실 수 있습니다.");
							} else {
								// 기타 다른 이유로 로그인 실패
							}
						}, {scope: "email, public_profile", auth_type: "rerequest", return_scopes: true});

						// 아이몰 방식
						// var uri = encodeURI(redirect_uri);

						// FB.getLoginStatus(function (response) {
						// 	if (response.status === "connected") {
						// 		// window.location.href = uri;
						//		// Submit 필요
						// 	} else {
						// 		window.location.href = encodeURI("https://m.facebook.com/dialog/oauth?client_id=959491840761275&redirect_uri=" + uri + "&response_type=token");
						// 	}
						// });

						//document.getElementById("iFrmSocialLogin").contentWindow.callFBLogin(redirect_uri);
					} catch (e) {}
				};

				function socialLogin(copToken, copCls) {// copCls - 01 : 페이스북, 02 : 네이버 ### 20181213 SSO 소셜 로그인 데이터 추가 
					
					if (!copToken || !copCls)
						return false;
					
					angular.element(el).find("#sociallogin_frm >input[name='targetUrl']").val($scope.targetUrl);
					angular.element(el).find("#sociallogin_frm >input[name='copToken']").val(copToken);
					angular.element(el).find("#sociallogin_frm >input[name='copCls']").val(copCls);
					angular.element(el).find("#sociallogin_frm >input[name='socialChannel']").val(copCls);
					$scope.socialLogin(copToken, copCls, $scope.targetUrl);
				}

				// angular.element("#buyLoading").show();
					
			/*****************************************************************************
			 * 2018-11-08 작성자:김지호   description : SSO 통합회원제 로그인 변경 - START 
			****************************************************************************/
				/**
					* @ngdoc function  
		 			* @name $scope.callLogin
		 			* @description
					* 통합회원제 일반 로그인 - SSO통합회원제 라이브러리 sso.callLogin 호출을 통해 접근토큰과 갱신토근을 받는다
					* SSO 일반 로그인 완료 || 로그인오류 시 코드값 및 메세지 리턴 
					* 소셜로그인, 일반로그인 같이 처리하는 함수
		 			* @example
					* $scope.callLogin(type,copTkn,copCls);	
					* @param {String} type 로그인 타입 (일반 : normal || 소셜 : social)
		 			* @param {String} copTkn 소셜 로그인시 토큰값
		 			* @param {String} copCls 소셜 로그인시 타입 구분값 전달( 01 : 페이스북, 02 : 네이버)
		 		*/
				 $scope.callLogin = function(type, copTkn, copCls){
					if($scope.aliveSso){

						// 간편회원일 경우 기존 login 함수 바로 호출
						if($scope.simpleSignYn == 'Y'){
							$scope.login();
							return false;
						}

						var akUrl = null, //sso 일반 로그인 호출 URL
							akDta = {}, // sso 일반 로그인 요청 데이터
							resDta = {}; // sso 로그인 후처리시 요청 데이터

						switch(type){
							case "social" : // 소셜로그인 
								akUrl = '/exBiz/login/sociLogin_01_001';
								akDta = {
									copAccDc : copCls, //제휴계정구분코드 (01 : 페이스북 / 02 : 네이버 / 03 : 알리페이 / 04 : 웨이신)
									copTkn : copTkn //제휴 토큰
								}
								// 소셜로그인 후처리 화면 호출시 소셜로그인 토큰값 및 구분 값 필수 데이터인 후처리 case에 사용을 위함
								resDta = akDta;
							break;
							case "normal" : //일반 로그인
							default :
								akUrl = '/exBiz/login/login_01_001';
								akDta = {
									onlId: $('#userId').val(),
									cstPswd: $('#lPointPw').val()
								}
							break;
						}
					
						try{
							$scope.sso.callLogin({
								akUrl: akUrl,
								akDta: akDta,
								aftPcMd: "1",							 // 후처리모드(0 : 통합회원제 화면 호출 / 1 : 자체 후처리)
								rturUrlCaloMethd : "GET",				
								callback : function(rspDta) {
								
									if (rspDta.rspC == '00'){
										// sso 토큰값 바인딩
										$scope.sso_aces_tkn = rspDta.acesTkn; //접근토큰
										$scope.sso_rnw_tkn = rspDta.rnwTkn; // 갱신토큰
										// SSO 로그인 후처리를 front에서 처리함에 따라 서버에 log를 남기위한 로그인 상태 구분값도 form data에 함께 전송
										$scope.socialChannel = (type == "social") ? copCls : "00"; // 소셜로그인 구분값
										$scope.$apply(); 
									}

									// SSO 로그인 후처리
									LotteUserService.ssoLoginResult(rspDta,type,resDta).then(function (res) {

										// 기존 로그인 로직 호출
										if(type == "social"){
											//소셜 로그인
											socialLogin(copTkn, copCls);
										}else{
											//일반로그인
											$scope.login();
										}	

									}).catch(function(){
										console.log("[SSO 일반 로그인 실패 ]");
									});	
								}
							});

						}catch(er){
							// 기존 로그인 로직 호출
							alert("불편을 드려서 죄송합니다. 잠시 후, 다시 시도해 주세요.");
								if(type == "social"){
									//소셜 로그인 실패시 파라미터 초기화 후 로그인페이지 리턴
									window.location.replace(LotteCommon.loginForm + "?" + scope.baseParam );
								}
								
							console.log("[SSO 통합회원제 API sso.callLogin 호출 불가]");
						}

					}else{
						if(type == "social"){
							//소셜 로그인
							alert("불편을 드려서 죄송합니다. 잠시 후, 다시 시도해 주세요.");
							//소셜 로그인 실패시 파라미터 초기화 후 로그인페이지 리턴
							window.location.replace(LotteCommon.loginForm + "?" + scope.baseParam );
						}else{
							//일반로그인
							$scope.login();
						}
						console.log('[SSO callLogin 호출 실패]');
					}
				}

			/*****************************************************************************
			* 2018-11-08 작성자:김지호   description : SSO 통합회원제 로그인 변경 - END 
			****************************************************************************/
			
					if (commInitData.query["code"] && !commInitData.query["remapping"]) {
						$scope.socialMapping = true;
						var state = LotteCookie.getCookie("state_token");
	
						if (naver.checkAuthorizeState(state) === "connected") {
							naver.getAccessToken(function (data) {
								if (data.error === "fail") {
									// access token 생성 요청이 실패하였을 경우에 대한 처리
									alert("네이버 로그인이 실패 하였습니다.");
									return;
								}
	
								var copToken = data._response.responseJSON.access_token;
								$scope.sendTclick("m_DC_Login_Clk_btn_naver_ALR");
									//소셜 로그인 - sso 일반로그인 우선 조회 
									$scope.callLogin('social', copToken, "02");
									//socialLogin(copToken, "02");
								
							});
						}else{
							alert("네이버 로그인이 실패하였습니다.\n다시 로그인해주세요.");
							$window.location.href = LotteCommon.loginForm + "?" + $scope.baseParam;
						}

					} else {
						// 멤버스 소셜로그인 리매핑 후 전달시 제휴채널에 따른 자동로그인 처리
						if ($window.location.href.indexOf("&amp;") > -1 && $window.location.href.indexOf("remapping") > -1 && $window.location.href.indexOf("ampReplace=Y") == -1) {
							$scope.socialMapping = true;
	
							var replaceUrlTemp = $window.location.href.replace(/\&amp\;/gi, "&");
							var replaceTargetUrlTemp = replaceUrlTemp.match(/targetUrl=(.)+/i);
							var replaceTargetUrl = "";
							var replaceUrlResult = "";
	
							replaceUrlTemp = replaceUrlTemp.replace(/targetUrl=(.)+/i, "");
							replaceUrlResult = replaceUrlTemp;
	
							if (replaceTargetUrlTemp && replaceTargetUrlTemp.length > 0) {
								replaceTargetUrl = (replaceTargetUrlTemp[0] + "").replace(/targetUrl=/i, "");
	
								replaceUrlResult += "&targetUrl=" + encodeURIComponent(replaceTargetUrl);
							}
							$window.location.href = replaceUrlResult + "&ampReplace=Y";
						} else if (commInitData.query["remapping"]) {
							$scope.socialMapping = true;
							var remappingVal = commInitData.query["remapping"];
							var socialLoginId = LotteStorage.getSessionStorage("socialCopToken");
							LotteStorage.delSessionStorage("socialCopToken");
							
							$scope.sendTclick("m_DC_Login_Clk_btn_naver_FIR");
									
							//소셜 로그인 - sso 일반로그인 우선 조회
							$timeout(function(){	
								$scope.callLogin('social', socialLoginId, remappingVal);
							},2000);		
							//socialLogin(socialLoginId, remappingVal);
							
						}
					}
		
				//  2017-12-26 스마트픽 앱 종료 팝업 추가
				// 날짜 설정으로 운영되는 요소에 대한 테스트 코드
				var todayYear = new Date().getFullYear();
				if (commInitData.query["testDate"]) {
					var todayDate = commInitData.query["testDate"]; // 년월일
					todayYear = todayDate.substring(0, 4); // 년
				}
				if (todayYear > 2017) {
					$scope.smp_end_yn = true;
					if($scope.smp_yn == 'Y') $("body").css("overflow" , "hidden");
				}

				$scope.smpEndAppCall = function (appService) {
					if (appService != '') {
						LotteLink.appDeepLink(appService);
					}
				}

			}
		};
	}]);
})(window, window.angular);