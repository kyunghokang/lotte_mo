(function(window, angular, undefined){
	"use strict";
	
	var app = angular.module("app", [
		"lotteComm",
		"lotteSrh",
		"lotteSideCtg",
		"lotteCommFooter"
	]);
	
	
	/**
	 * TalkShopping 콘트롤러
	 */
	app.controller("TalkShoppingCtrl",
					["$scope", "LotteCommon", "commInitData",
			 function($scope,   LotteCommon,   commInitData){
		
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "음성 쇼핑";

		$scope.DEV_MODE = "";

		$scope.ts_clause = {
			"toggle"	: false,
			"visible"	: false,
			"index"		: 0
		};
		
		$scope.ts_showIntroPop	= false;
		$scope.ts_basicInfo = {
			"initiated"			: false,
			"showBasicInfo"		: false,
			"showGuideInfo"		: false,
			"prior_info_chk"	: false,
			"et_mbr_dlvp_chk"	: false,
			"base_op_pay_chk"	: false
		};
		$scope.showExitConfirm = false;
		
		$scope.ts_micStat = {
			"init"		: false,
			"inited"	: false,
			"open"		: false,
			"listening"	: false,
			"sending"	: false,
			"warning"	: false
		};
		
		$scope.ts_stt = {
			"text"		: "",
			"strength"	: 0
		};
		
		$scope.ts_loadingData		= false;
		$scope.ts_currentStep		= 0;
		$scope.ts_currentGroup		= null;
		$scope.ts_currentProduct	= null;
		$scope.ts_currentGoodsNo	= null;
		$scope.ts_currentOrderNo	= null;
		$scope.ts_currentQue		= null;// 현재 처리중 데이터
		
		$scope.ts_groupList	= [];
		$scope.ts_prodGroup	= [];
		$scope.ts_groupMap	= {};
		$scope.ts_prodList	= [];
		$scope.ts_goodsList	= null;
		$scope.ts_talkList	= [{}, {}, {}, {}, {}, {}];
		$scope.ts_toastList	= [];
		$scope.TOAST_LIST = {
			"step1"		: ['"생수"라고 말해보세요'],
			"step2"		: ['"1번 주문해줘"라고 말해보세요', '"1번 자세히"라고 말해보세요'],
			"step3"		: ['"응, 아니"라고 말해보세요'],
			"step5"		: ['"처음으로"라고 말해보세요'],
			"nospeak"	: ['듣고 있어요']
		};
		$scope.ts_toastCnt		= 0;
		$scope.ts_toastIdx		= 0;
		$scope.ts_orderReview	= null;
		$scope.ts_orderPaying	= null;
		$scope.ts_orderResult	= null;
		$scope.ts_notRecogCnt	= 0;
		$scope.ts_currentTTS	= "";
		
		$scope.CHAT_QUE = []; // 데이터 순차 로드
		
	}]);//controller
	
	
	/**
	 * LotteContainer 디렉티브
	 */
	app.directive("lotteContainer",
					["LotteCommon", "LotteUserService", "LotteStorage", "commInitData", "$http", "$timeout", "$interval", 'LotteUtil', '$window',
			 function(LotteCommon,   LotteUserService,   LotteStorage,   commInitData,   $http,   $timeout,   $interval, LotteUtil, $window){
		return {
			templateUrl : "/lotte/resources_dev/talk/talkShopping_container.html",
			replace : true,
			link : function($scope, el, attrs){

				$scope.DEV_MODE = (location.host != "m.lotte.com") && (commInitData.query.dev_mode == "Y");
				
				var CSS1 = { "top" : 0, "opacity" : 1 };// dot 1
				var CSS2 = { "top" : 0, "opacity" : 1 };// dot 2
				var CSS3 = { "top" : 0, "opacity" : 1 };// dot 3
				var CSS4 = { "top" : 0, "bottom" : 0 };//  dot 1,3 bar
				var CSS5 = { "top" : 0, "bottom" : 0 };//  dot 2 bar
				var CSS6 = {"opacity" : 0}// circle

				var activateMicOnEnd	= false;
				
				var ts_promise = {
					"activateMic" 		: null,
					"quitRecognition"	: null,
					"noSpeaking"		: null,
					"rotateToast"		: null,
					"returnFirst"		: null
				}
				
				var ts_delay = {
					"activateMic"		: 500,
					"quitRecognition"	: 12000,
					"noSpeaking"		: 4000,
					"rotateToast"		: 2000
				}
				
				var ts_dot = {
					"angle"		: 0,
					"top"		: 0
				};
				
				var ttsRunning	= false;
				var sttRunning	= false;

				
				var USE_SESSION_STORAGE = true;
				
				var BASIC_PARAM = {};
				var URL_TALK_SHOP	= LotteCommon.talkShopUrl;
				var URL_BASIC_INFO	= LotteCommon.talkShopPriorInfo;
				var URL_CHATBOT		= LotteCommon.talkShopChatbot;
				var URL_ORDER_FRAME	= LotteCommon.talkShopOrderFrame;
				
				var LPAY_URL			= "https://web.lpay.com:1452";
				var LPAY_SIGN_KEY		= "e30f88c2c39f2a82af5d08f4691ba6b6";
				var LPAY_MCHT_AUTH_KEY	= "00076790";
				var LPAY_ONLINE_CUSTNO	= "";
				var lpayAuthSuccess;

				

				/******************************************* DEV MODE *******************************************/
				if(location.host === "localhost:8082" || location.host === "10.149.132.91:8082"){
					LotteCommon.loginUrl = "/login/m/loginForm_dev.html";
					setCookie("LOGINCHK",	"9nXuTbHiBiw=");
					setCookie("LOGINID",	"zE7jB5V8+oLdIjKcRj1zmA==");
					setCookie("CUSTNO",		"XLbE+wLdXZE=");
				}
				
				function simulateSpeechRecog(){
					if(!$scope.ts_micStat.listening){ return; }
					
					var str = "";
					switch($scope.ts_currentStep){
					case 1:
						str = "생수 주문해줘";
						break;
					case 2:
						str = "1번 주문해줘";
						break;
					case 3:
						str = "결제해줘";
						break;
					default:
						return;
						break;
					}
					$scope.setSTTText(str);
				};
				
				if(false && $scope.DEV_MODE && ! $scope.appObj.isApp){
					$interval(simulateSpeechRecog, 200);
				}
				
				$scope.delLS = function(){
					LotteStorage.delLocalStorage("TALK_SHOP_basicInitiated");
					LotteStorage.delLocalStorage("TALK_SHOP_noMoreIntro");
					LotteStorage.delLocalStorage("TALK_SHOP_closeIntro");
					LotteStorage.delSessionStorage("TALK_SHOP_SSST");
					LotteStorage.delSessionStorage("TALK_SHOP_ISP");
					$scope.reloadTS();
				};
				
				$scope.reloadTS = function(){
					location.href = LotteCommon.talkShopUrl + "?" + $scope.baseParam + "&dev_mode=Y&tracable=Y&a=" + (Math.round(Math.random() * 100));
				};
				
				$scope.endTTSCB = function(){
					ttsEndCallback();
				};
				
				$scope.notUnderstand = function(){
					switch($scope.ts_currentStep){
					case 1:
						$scope.setSTTText("생수");
						break;
					case 2:
						$scope.setSTTText("1번");
						break;
					default:
						$scope.setSTTText("이해못함");
						break;
					}
				};
				
				$scope.stopSpeechRecogDV = function(){
					stopTTS();
					setMicClose();
				};
				
				$scope.toggleDevSidebar = function(){
					angular.element(".dev_sidebar").toggleClass("minimize");
				};
				
				$scope.talkUserInput = function(){
					var str = window.prompt();
					if($scope.isValidString(str)){
						$scope.talkRecomDelegate('sendSpeech', str);
					}
				};
				
				function changeServer(url){
					URL_CHATBOT = url;
					console.log("chat server changed: " + URL_CHATBOT);
				};
				window.changeServer = changeServer;
				
				
				$scope.ispCBSimulate = function(flag){
					var path = LotteCommon.talkShopUrl + "?" + $scope.baseParam + "&dev_mode=Y&tracable=Y&isp=Y&a=" + (Math.round(Math.random() * 100));
					if(flag === true){
						path += "&resCode=0000&resMsg=ISP 성공&ord_no=201711156267017";
					}else{
						path += "&resCode=1111&resMsg=ISP 실패";
					}
					location.href = path;
				};
				
				
				/*$scope.alertObject = function(obj){
					var str = "";
					for(var xxx in obj){
						str += (xxx + " : " + obj[xxx] + "\n");
					}
					alert(str);
				};*/
				/******************************************* DEV MODE *******************************************/

				
				// screen ratio check
				try{
					var wn = angular.element(window);
					var ww = wn.width();
					var wh = wn.height();
					var rt = ww / wh * 100;
					if(ww <= 360 && rt >= 65){
						angular.element("body").addClass("ts_fatty");
					}
				}catch(e){}
				// screen ratio check
				

				/**
				 * 디렉티브 시작하기
				 */
				function startOver(){
					// ISP 포워딩 체크
					var q = commInitData.query;
					if(q.isp === "Y"){
						var rm = q.resMsg;
						try{
							rm = decodeURIComponent(rm);
						}catch(e){}
						
						var isp = {
							"resCode"	: q.resCode,
							"resMsg"	: rm,
							"ord_no"	: q.ord_no
						};
						LotteStorage.setSessionStorage("TALK_SHOP_ISP", isp, "json");
						history.replaceState({name:"talkshopping"}, "talkshopping");
					}
					// ISP 포워딩 체크
					
					
					// login check
					BASIC_PARAM.member_no	= $scope.loginInfo.mbrNo;
					BASIC_PARAM.member_nm	= $scope.loginInfo.name;
					//BASIC_PARAM.grade_cd	= $scope.loginInfo.gradeCd;
					//BASIC_PARAM.customer_no	= getCookie("CUSTNO");
					BASIC_PARAM.uagent		= $scope.appObj.isAndroid ? "Y" : "N";
					BASIC_PARAM.cp_schema	= q.schema;
					BASIC_PARAM.cp_v		= q.v;
					BASIC_PARAM.cp_udid		= q.udid;
					BASIC_PARAM.chl_no		= q.cn;
					BASIC_PARAM.voice		= "Y";
					
					
					
					if( !($scope.isValidString(BASIC_PARAM.member_no) )){// && $scope.isValidString(BASIC_PARAM.customer_no)) ){
						var path = encodeURIComponent( URL_TALK_SHOP + "?" + $scope.baseParam );
						$scope.gotoService("loginUrl", {targetUrl : path});
						return;
					}
					
					if(LotteStorage.getLocalStorage("TALK_SHOP_closeIntro") === $scope.getTodayDate() || LotteStorage.getLocalStorage("TALK_SHOP_noMoreIntro") === "Y"){
						$scope.ts_showIntroPop = false;
						initTalkShopping();
					}else{
						$scope.ts_showIntroPop = true;
					}
				};
				
				/**
				 * 음성쇼핑 초기화
				 */
				function initTalkShopping(){
					$scope.ts_showIntroPop = false;
					initLpay();
					
					$scope.$watch("ts_currentStep", watchCurrentStep);
					
					if(history.state == null || history.state.name != "talkshopping"){
						//$scope.trace("NEW VISIT");//: scroll to bottom");
						history.replaceState({name:"talkshopping"}, "talkshopping");
						loadBasicInfo();
					}else{
						//$scope.trace("REVISIT");//: scroll to ", lcst.scrollTop);
						if(restoreSessionStorage()){
							//$scope.trace("HAS SESSION");
							//loadBasicInfo();////////////////////////////
							//startTalkShopMain();
							$timeout(initMic, 100);
						}else{
							//$scope.trace("NO SESSION");
							loadBasicInfo();
						}
					}
					
					
					angular.element(window).on("unload", saveSessionStorage);
				};
				
				
				/******************************************* SESSION STORAGE *******************************************/
				/**
				 * 데이터 세션에 저장하기
				 */
				function saveSessionStorage(){
					if(USE_SESSION_STORAGE !== true){ return; }
					
					var ss = {};
					ss.scrollTop		= angular.element(window).scrollTop(),
					ss.currentStep		= $scope.ts_currentStep;
					//ss.micStat		= $scope.ts_micStat;
					ss.basicInfo		= $scope.ts_basicInfo;
					ss.talkList			= $scope.ts_talkList;
					ss.toastList		= $scope.ts_toastList;
					ss.groupList		= $scope.ts_groupList;
					ss.prodList			= $scope.ts_prodList;
					ss.currentGroup		= $scope.ts_currentGroup;
					ss.currentProduct	= $scope.ts_currentProduct;
					ss.currentGoodsNo	= $scope.ts_currentGoodsNo;
					ss.currentOrderNo	= $scope.ts_currentOrderNo;
					ss.goodsNoList		= $scope.ts_goodsList;
					ss.orderReview		= $scope.ts_orderReview;
					ss.orderPaying		= $scope.ts_orderPaying;
					ss.orderResult		= $scope.ts_orderResult;
					
					//console.log("SAVE SESSION")
					//console.log(ss)
					
					LotteStorage.setSessionStorage("TALK_SHOP_SSST", ss, "json");
				};
				
				/**
				 * 세션스토리지 데이터 복원하기
				 */
				function restoreSessionStorage(){
					if(USE_SESSION_STORAGE !== true){ return false; }
					
					var ss = LotteStorage.getSessionStorage("TALK_SHOP_SSST", "json");
					if(ss == undefined){ return false; }
					
					try{
						//console.log(ss);
						$scope.ts_micStat = {
							"init"		: true,
							"inited"	: true,
							"open"		: false,
							"listening"	: false,
							"sending"	: false,
							"warning"	: false
						};
						
						if(!$scope.isValidArray(ss.groupList)){ return false; }
						
						$scope.ts_currentStep		= ss.currentStep;
						//$scope.ts_micStat			= ss.micStat;
						$scope.ts_basicInfo			= ss.basicInfo;
						$scope.ts_basicInfo.showBasicInfo = false;
						$scope.ts_talkList			= ss.talkList;
						$scope.ts_toastList			= ss.toastList;
						$scope.ts_groupList			= ss.groupList;
						prepareGroupData();
						$scope.ts_prodList			= ss.prodList;
						$scope.ts_currentGroup		= ss.currentGroup;
						$scope.ts_currentProduct	= ss.currentProduct;
						$scope.ts_currentGoodsNo	= ss.currentGoodsNo;
						$scope.ts_currentOrderNo	= ss.currentOrderNo;
						$scope.ts_goodsList			= ss.goodsNoList;
						$scope.ts_orderReview		= ss.orderReview;
						$scope.ts_orderPaying		= ss.orderPaying;
						$scope.ts_orderResult		= ss.orderResult;
						
						
						
						// ISP 세션 체크
						checkISPSession();
						
						
						/*if($scope.ts_basicInfo.showBasicInfo === true){
							angular.element("body").addClass("ts_basic_pop");
						}*/
						
						$timeout(function(){animateChatCont(true);}, 500);
						

						if(!isNaN(ss.scrollTop)){
							scrollTo(0, ss.scrollTop);
						}
						
					}catch(e){
						return false;
					}
					
					return true;
				};
				
				/**
				 * ISP 세션 체크
				 */
				function checkISPSession(){
					var isp = LotteStorage.getSessionStorage("TALK_SHOP_ISP", "json");
					if(isp != null){
						LotteStorage.delSessionStorage("TALK_SHOP_ISP");
						talkOrderCallBack(isp.resCode, isp.resMsg, isp.ord_no);
					}
				};
				/******************************************* SESSION STORAGE *******************************************/
				
				
				/******************************************* BASIC INFO *******************************************/
				/**
				 * 배송지/결제수단 정보 로드
				 */
				function loadBasicInfo(){
					var param = { "member_no" : BASIC_PARAM.member_no };
					$http.get(URL_BASIC_INFO, { "params" : param })
						.success(loadBasicInfoSuccess)
						.error(loadBasicInfoError);
				};
				
				function loadBasicInfoSuccess(data){
					if(data == undefined || data.data == undefined){
						$scope.showHideBIPop(true);
						loadBasicInfoError();
						return;
					}
					
					$scope.ts_basicInfo = data.data;
					
					var bi = $scope.ts_basicInfo;
					bi.initiated		= LotteStorage.getLocalStorage("TALK_SHOP_basicInitiated") === "Y";
					$scope.showHideBIPop( (bi.prior_info_chk !== true) || (bi.initiated === false) );
					
					if(bi.pay_mean_cd == "40"){
						// Lpay이면 가맹점 사용자 인증/결제수단 조회 
						LPAY_ONLINE_CUSTNO = bi.onlCno;
						merchantAuth();
					}else{
						startTalkShopMain();
					}
				};
				
				function loadBasicInfoError(){
					//
				};
				
				/**
				 * 배송지/결제수단 수정
				 */
				$scope.changeBasicInfo = function(n, tc){
					var param = {
						"tclick" : tsTclick(tc)
					}
					
					switch(n){
					case 1:// 배송지
						$scope.gotoService("talkShopDelevery", param);
						break;
					case 2:// 결제수단
						$scope.gotoService("talkShopPayment", param);
						break;
					// no default
					}
				};
				
				/**
				 * 배송지/결제수단 종료하기
				 */
				$scope.closeBasicInfo = function(n, tc){
					var bi = $scope.ts_basicInfo;
					
					switch(n){
					
					case 0:// 나중에 하기
						exitTalkShopping(true, tc);
						break;
					
					case 1:// 시작하기
					case 2:// 확인
						if(bi.prior_info_chk !== true){ return; }
						
						LotteStorage.setLocalStorage("TALK_SHOP_basicInitiated", "Y");
						bi.initiated = true;
						$scope.showHideBIPop(false);
						getProdGroup();
						
						tsTclick(tc);
						break;
					
					// no default
					}
				};
				
				/**
				 * 배송지/결제수단 열기/닫기
				 */
				$scope.showHideBIPop = function(visible, tc){
					$scope.ts_basicInfo.showGuideInfo = false;
					//angular.element("body").removeClass("ts_guide_pop");
					
					if(visible === true){
						$scope.ts_basicInfo.showBasicInfo = true;
						angular.element("body").addClass("ts_basic_pop");
						
						stopSpeechRecog();
						stopTTS();
						//stopSTT();
					}else{
						$scope.ts_basicInfo.showBasicInfo = false;
						angular.element("body").removeClass("ts_basic_pop");
						$timeout(function(){animateChatCont(true);}, 10);
					}
					
					tsTclick(tc);
				};
				
				/**
				 * 가이드 열기/닫기
				 */
				$scope.showHideGuidePop = function(visible){
					$scope.ts_basicInfo.showBasicInfo = false;
					angular.element("body").removeClass("ts_basic_pop");
					
					if(visible === true){
						tsTclick(9);
						$scope.ts_basicInfo.showGuideInfo = true;
						//angular.element("body").addClass("ts_guide_pop");
						
						stopSpeechRecog();
						stopTTS();
					}else{
						$scope.ts_basicInfo.showGuideInfo = false;
						//angular.element("body").removeClass("ts_guide_pop");
					}
				};
				
				/**
				 * 이전 페이지로 이동
				 */
				$scope.goHistoryBack = function(){
					tsTclick(8);
					$scope.showExitConfirm = true;
					$scope.confirm_2016("음성주문 서비스를 종료하시겠습니까?", {"callback" : exitTalkShopping});
					
					stopSpeechRecog();
					stopTTS();
				};
				
				/**
				 * 음성쇼핑 종료
				 */
				function exitTalkShopping(rtn, tc){
					$scope.showExitConfirm = false;
					if(rtn === true){
						stopTTS();
						
						$timeout(function(){
							$scope.callAppAPI("exitTalkShop");
						}, 150);
						
						$timeout(function(){
							//$scope.gotoMain();
							//var tclick = "&tclick=" + tsTclick(tc);
							//location.href = LotteCommon.mainUrl + "?" + $scope.baseParam + tclick;
							$scope.gotoService("mainUrl", {tclick : tsTclick(tc)});
						}, 300);
					}
				};
				/******************************************* BASIC INFO *******************************************/
				

				/******************************************* LPAY *******************************************/
				/**
				 * Lpay 초기화
				 */
				function initLpay(){
					window.lpay = new Lpay({
						"name"				: "lpay",
						"url"				: LPAY_URL,
						"merchantSignKey"	: LPAY_SIGN_KEY,
						"reqTypeCd"			: "6000002",
						"style"				: "1",
						"openMode"			: "0",
						"closeCallback"		: lpayCloseCB,
						"__iframe"			: {},
						"popupReturnUrl"	: ""
					});
				};
				
				/**
				 * Lpay 닫기 콜백
				 */
				function lpayCloseCB(){
					console.warn("lpayCloseCB");
				};
				
				/**
				 * Lpay 가맹점 사용자 인증
				 */
				function merchantAuth(){
					var obj = {
						"mchtAuthKey"	: LPAY_MCHT_AUTH_KEY,
						"onlCno"		: LPAY_ONLINE_CUSTNO,
						"callback"		: merchantAuthCB
					};
					lpay.merchantAuth(obj);
				};
				
				/**
				 * Lpay 가맹점 사용자 인증 콜백
				 */
				function merchantAuthCB(data){
					if(data == undefined || data.resClac != "S"){
						// error
						lpayCheckFail();
					}else{
						// success
						getPaymentMethod();
					}
				};
				
				/**
				 * Lpay 결제수단 조회
				 */
				function getPaymentMethod(){
					var obj = {
							"onlCno"		: LPAY_ONLINE_CUSTNO,
							"callback"		: getPaymentMethodCB
						};
						lpay.getPaymentMethod(obj);
				};
				
				/**
				 * Lpay 결제수단 조회 콜백
				 */
				function getPaymentMethodCB(data){
					if(data == undefined || data.resClac != "S"){
						// error
						lpayCheckFail();
					}else{
						// success
						try{
							$scope.ts_basicInfo.fnCoNm = "";
							$scope.ts_basicInfo.pmtMthdAlias = "";
							angular.forEach(data.pmtMthdList, function(itm, idx){
								if(itm.pmtMthdId == $scope.ts_basicInfo.pay_card_rcgn_id){
									$scope.ts_basicInfo.fnCoNm			= itm.fnCoNm;
									$scope.ts_basicInfo.pmtMthdAlias	= itm.pmtMthdAlias;
								}
							});
							if(!$scope.isValidString($scope.ts_basicInfo.pmtMthdAlias)){
								lpayCheckFail();
							}
						}catch(e){
							lpayCheckFail();
						}
						
						if(typeof(lpayAuthSuccess) == "function"){
							lpayAuthSuccess();
						}else{
							startTalkShopMain();
						}
					}
				};
				
				/**
				 * Lpay 인증 실패
				 */
				function lpayCheckFail(){
					$scope.ts_basicInfo.prior_info_chk	= false;
					$scope.ts_basicInfo.base_op_pay_chk	= false;
					$scope.showHideBIPop(true);
					$scope.alert_2016("Lpay 결제수단 인증을 하지 못했습니다. 결제수단을 변경해 주세요.");
				};
				/******************************************* LPAY *******************************************/
				

				/******************************************* CHAT SERVER *******************************************/
				/**
				 * 음성주문 메인화면 시작
				 */
				function startTalkShopMain(){
					$scope.ts_currentStep	= 1;
					
					// load prod_group
					getProdGroup();
					
					//$timeout(initMic, 100);
				};
				
				/**
				 * 상품군 데이터 로드
				 */
				function getProdGroup(){
					var bi = $scope.ts_basicInfo;
					if(bi.showBasicInfo == false && $scope.ts_prodGroup.length == 0){
						$scope.talkRecomDelegate("getProdGroup");
					}
				};
				
				/**
				 * 의미분석 인터페이스
				 */
				$scope.talkRecomDelegate = function(){
					if(arguments.length == 0){ return; }
					
					// convert to array
					var arr = [].slice.call(arguments);
					var cmd = arr.shift();
					var p = {
						"command"		: cmd,
						"step"			: $scope.ts_currentStep,
						"text"			: arr[0],
						"prod_grp_id"	: $scope.ts_currentGroup,
						"goods_no"		: $scope.ts_currentGoodsNo,
						"order_no"		: $scope.ts_currentOrderNo
					}
					if($scope.isValidArray($scope.ts_goodsList)){
						p.goods_no_list = $scope.ts_goodsList.join(",");
					}
					var param = angular.extend(BASIC_PARAM, p);
					
					//setMicClose();
					addToQue(param);
					
					//console.log(cmd, arr);
				};
				//window.talkRecomDelegate = $scope.talkRecomDelegate;
				
				
				/**
				 * 큐에 추가
				 * @param {Object} param - 큐에 추가할 파라메터 오브젝트
				 * @param {Object} [data] - 큐에 연결된 로컬 데이터
				 */
				function addToQue(param, data){
					$scope.CHAT_QUE.push({
						"param"	: param,
						"data"	: data
					});
					callChatBot();
				};
				
				/**
				 * 챗봇 전송하기
				 */
				function callChatBot(){
					if($scope.CHAT_QUE.length == 0){ return; }
					if($scope.ts_loadingData){ return; }
					
					//setMicClose();
					stopTTS();
					
					var que = $scope.CHAT_QUE.shift();
					$scope.ts_currentQue = que;
					
					$scope.ts_loadingData = true;
					$scope.ts_micStat.sending = true;
					//if(location.host.indexOf("localhost")>=0){
						$http.get(URL_CHATBOT, {params:que.param})
						.success(callChatBotSuccess)
						.error(callChatBotError);
					/*}else{
						$http.post(URL_CHATBOT, {params:que.param})
						.success(callChatBotSuccess)
						.error(callChatBotError);
					}*/
				};
				
				/**
				 * 챗봇 전송 실패
				 */
				function callChatBotError(data, status, headers, config){
					if(data && data.err_msg && data.err_msg != ""){
						$scope.alert_2016(data.err_msg);
					}else{
						var skip = false;
						if($scope.modalPopList2016 != undefined && $scope.modalPopList2016.length > 0){
							if($scope.modalPopList2016[0].message == "채팅 데이터 전송 에러"){
								skip = true;
							}
						}
						
						if(!skip){
							$scope.alert_2016("채팅 데이터 전송 에러");
						}
					}
					$scope.ts_micStat.sending = false;
					setMicClose();
					$scope.ts_loadingData = false;
					
					if($scope.ts_currentStep == 4){
						goPrevStep();
					}
					
					// 다음 큐 실행
					callChatBot();
				};
				
				/**
				 * 챗봇 전송 성공
				 */
				function callChatBotSuccess(data, status, headers, config){
					if(data == undefined || data.err_cd != "0000" || data.data == undefined){
						// error
						callChatBotError(data, status, headers, config);
						
						// 다음 큐 실행
						callChatBot();
						
					}else{
						// success
						$scope.ts_micStat.sending = false;
						setMicClose();
						
						
						$timeout(function(){
							var q = config.params; // 전송한 파람 오브젝트
							var r = data.data; // 리턴된 JSON 데이터
							callChatBotSuccessDelay(r, q);
						}, 200);
						
						/*return;
						var q = config.params; // 전송한 파람 오브젝트
						var r = data.data; // 리턴된 JSON 데이터
						
						processTtsData(r, q);
						
						if($scope.isValidArray(r.error_list)){
							// 에러 메시지 처리
							processErrorData(r, q);
							
						}else if(q.command == "getProdGroup"){
							// 상품군 그룹 데이터 처리
							processGroupData(r, q);
							
						}else{
							// 의미분석 데이터 처리
							processTalkData(r, q);
						}

						$scope.ts_micStat.sending = false;
						setMicClose();
						$scope.ts_loadingData = false;
						saveSessionStorage();*/
					}

					// 다음 큐 실행
					//callChatBot();
				};
				
				function callChatBotSuccessDelay(r, q){
					processTtsData(r, q);
					
					if($scope.isValidArray(r.error_list)){
						// 에러 메시지 처리
						processErrorData(r, q);
						
					}else if(q.command == "getProdGroup"){
						// 상품군 그룹 데이터 처리
						processGroupData(r, q);
						
					}else{
						// 의미분석 데이터 처리
						processTalkData(r, q);
					}

					$scope.ts_loadingData = false;
					saveSessionStorage();
				};
				
				/**
				 * 에러 메시지 처리
				 */
				function processErrorData(r, q){
					if(r == undefined || !$scope.isValidArray(r.tts_text)){
						activateMicOnEnd = false;
						console.warn(r.error_list.join("<br/>"));
					}
				};
				
				/**
				 * 상품군 그룹 데이터 처리
				 */
				function processGroupData(r, q){
					var tk = $scope.ts_talkList[1];
					tk.talk_list	= r.talk_list;
					tk.tts_text		= r.tts_text;
					
					$scope.ts_groupList = r.group_list;
					prepareGroupData();
					
					$timeout(initMic, 1000);
					activateMicOnEnd = true;
					setToastList("step");
				};
				
				/**
				 * 상품군 그룹 배열로 구조화
				 */
				function prepareGroupData(){
					$scope.ts_prodGroup.length = 0;
					var gl = $scope.ts_groupList;
					if($scope.isValidArray(gl)){
						var i, len, g, n;
						len = gl.length;
						for(i=0; i<len; i++){
							g = gl[i];
							n = Math.floor(i / 4);
							if($scope.ts_prodGroup[n] == undefined){
								$scope.ts_prodGroup[n] = [];
							}
							
							$scope.ts_prodGroup[n].push(g);
							$scope.ts_groupMap[g.prod_grp_id] = g;
						}
					}
				};
				
				/**
				 * TTS 데이터 처리
				 */
				function processTtsData(r, q){
					activateMicOnEnd = false;
					if($scope.isValidArray(r.tts_text)){
						activateMicOnEnd = true;
						var tts = r.tts_text.join("\n");
						
						$timeout(function(){
							startTTS(tts);
						}, 100);
					}
				};
				
				/**
				 * 의미분석 데이터 처리
				 */
				function processTalkData(r, q){
					switch(r.command){
					case "goFirst":
						gotoStep(1);
						return;
						break;
					case "goBack":
						goPrevStep();
						return;
						break;
					case "gotoCart":
						gotoCart();
						break;
					case "scrollDown":
						$("html, body").stop(true);
						$("html, body").animate({ scrollTop: $(window).scrollTop() + window.innerHeight }, 500);
						return;
						break;
					case "scrollTop":
						$("html, body").stop(true);
						$("html, body").animate({ scrollTop: 0 }, 500);
						return;
						break;
					// no default
					}
					
					replaceTags(r.talk_list);
					
					switch($scope.ts_currentStep){
					case 1:
						processTalkData1(r, q);
						break;
					case 2:
						processTalkData2(r, q);
						break;
					case 3:
						processTalkData3(r, q);
						break;
					case 4:
						processTalkData4(r, q);
						break;
					case 5:
						processTalkData5(r, q);
						break;
					// no default
					}

					activateMicOnEnd = true;
					setToastList("step");
				};
				
				/**
				 * 상황에 맞지 않는 리턴이면 에러처리
				 */
				function throwTalkError(r){
					r.error_list = ["이해하지 못했어요."];
					processErrorData( r );
				};
				
				/**
				 * 현재 스텝 와치
				 * @param {Number} nv - 새 값
				 * @param {Number} ov - 이전 값
				 */
				function watchCurrentStep(nv, ov){
					if(nv == ov){ return; }
					
					$timeout(animateChatCont, 500);
				};
				
				/**
				 * 대화 내용 애니메이트
				 * @param {Boolean} noani - 애니메이션 없음
				 */
				function animateChatCont(noani){
					scrollToTop();
					
					var divs = $(".ts_step_cont > div");
					var childs = divs.children();
					var user = divs.find(".user_text");
					if(divs.length == 0 && $scope.ts_currentStep != 4){
						$timeout(animateChatCont, 100);
						return;
					}
					
					divs.stop(true);
					childs.stop(true);
					user.stop(true);
					divs.css({
						"top"		: angular.element(window).height() * 1.02,
						"opacity"	: 1
					});
					childs.css({
						"opacity"	: 0
					});
					
					var css = {
						"top"		: 0
					};
					var opt = {
						"easing"	: $scope.checkJQueryEasing("easeInOutCubic"),
						"duration"	: 400
					};
					var css2 = {
							"opacity"	: 1
					};
					var opt2 = {
							"easing"	: $scope.checkJQueryEasing("easeInOutCubic"),
							"duration"	: 400
					};
					
					if(noani === true){
						// no animation
						divs.css(css);
						childs.css(css2);
					}else{
						// animation
						var div, div2, o;
						var delay = 0;
						divs.each(function(idx, itm){
							div = $(itm);
							div2 = div.children();
							if(idx == 0){
								delay = delay + 250;
							}else{
								delay = delay + 250 / (idx+1);
							}
							div.delay(delay).animate(css, opt);
							div2.delay(delay+200).animate(css2, opt2);
						});
					}
					
				};
				
				/**
				 * 이전 단계로 이동
				 */
				function goPrevStep(){
					if($scope.ts_currentStep > 1){
						if($scope.ts_currentStep == 5){
							//gotoStep(1);
							$scope.goHistoryBack();
						}else{
							gotoStep($scope.ts_currentStep - 1);
						}
					}
				};
				//$scope.goPrevStep = goPrevStep;
				
				/**
				 * 이전 단계로 이동 발화
				 */
				$scope.goPrevStepCall = function(tc){
					if($scope.ts_currentStep > 1){
						if($scope.ts_currentStep == 5){
							$scope.goHistoryBack();
						}else{
							$scope.talkRecomDelegate('sendSpeech', '이전으로');
							//gotoStep($scope.ts_currentStep - 1);
						}
						
						tsTclick(tc);
					}
				};
				
				/**
				 * 특정 단계로 이동
				 * @param {Number} step - 이동할 단계
				 */
				function gotoStep(step){
					if( !angular.isNumber(step) || step < 1 || step > 5){ return; }

					scrollToTop();
					$scope.ts_currentStep = step;
					clearStepData();
					setToastList("step");
				};
				//$scope.gotoStep = gotoStep;
				
				/**
				 * 단계별 데이터 초기화
				 */
				function clearStepData(){
					for(var i=5; i>=1; i--){
						if(i > $scope.ts_currentStep){
							$scope.ts_talkList[i] = {};
						}
					}
					
					if($scope.ts_currentStep == 1){
						$scope.ts_currentGroup		= null;
						$scope.ts_currentGoodsNo	= null;
						$scope.ts_goodsList			= null;
					}else if($scope.ts_currentStep == 2){
						$scope.ts_currentGoodsNo	= null;
						$scope.ts_currentProduct	= null;
					}
					
					if($scope.ts_currentStep < 3){
						$scope.ts_orderReview = null;
					}
					if($scope.ts_currentStep < 4){
						$scope.ts_orderPaying		= null;
						$scope.ts_currentOrderNo	= null;
					}
					if($scope.ts_currentStep < 5){
						$scope.ts_orderResult = null;
					}
				};

				/**
				 * 의미분석 데이터 처리 - step 1
				 */
				function processTalkData1(r, q){
					switch(r.command){
					case "selectGroup":// 그룹 선택
						if($scope.ts_groupMap[r.prod_grp_id] == undefined){
							$scope.alert_2016("잘못된 그룹입니다.");
							return;
						}
						
						//scrollToTop();
						
						$scope.ts_currentGroup		= r.prod_grp_id;
						$scope.ts_goodsList			= r.goods_no_list;
						$scope.ts_prodList.length	= 0;
						var arr		= $scope.ts_groupMap[$scope.ts_currentGroup].prod_list;
						var len		= arr.length
						var i, p;
						if($scope.isValidArray(r.goods_no_list)){
							for(i=0; i<len; i++){
								p = arr[i];
								if(r.goods_no_list.indexOf(p.goods_no) >= 0){
									$scope.ts_prodList.push(arr[i]);
								}
							}
						}else{
							$scope.ts_prodList = [].concat(arr);
						}
						$scope.ts_currentStep = 2;
						var tk = $scope.ts_talkList[$scope.ts_currentStep];
						tk.user_text	= q.text;
						tk.talk_list	= r.talk_list;
						tk.tts_text		= r.tts_text;
						if($scope.isValidString(r.user_text)){
							tk.user_text = r.user_text;
						}
						break;
						
					default:
						throwTalkError(r);
						break;
					}
				};
				
				/**
				 * 의미분석 데이터 처리 - step 2
				 */
				function processTalkData2(r, q){
					switch(r.command){
					case "productDetail":// 상품 상세
						gotoDetailView(r.goods_no);
						break;
					case "selectProduct":// 상품 선택
						if(!$scope.isValidString(r.goods_no)){
							$scope.alert_2016("유효하지 않은 상품입니다.");
							return;
						}
						
						//scrollToTop();
						
						$scope.ts_currentStep = 3;
						$scope.ts_currentGoodsNo = r.goods_no;
						
						var grp = $scope.ts_groupMap[ $scope.ts_currentGroup ];
						if(grp != undefined && $scope.isValidArray(grp.prod_list)){
							grp.prod_list.forEach(function(itm, idx){
								if(itm.goods_no == r.goods_no){
									$scope.ts_currentProduct = itm;
								}
							});
						}
						
						var tk = $scope.ts_talkList[$scope.ts_currentStep];
						tk.user_text	= q.text;
						tk.talk_list	= r.talk_list;
						tk.tts_text		= r.tts_text;
						if($scope.isValidString(r.user_text)){
							tk.user_text = r.user_text;
						}
						$scope.ts_orderReview = r.ret_object;
						//$scope.ts_orderReview.hasDiscount = $scope.isValidNumber($scope.ts_orderReview.discount_amt);
						break;
					case "selectGroup":// 그룹 선택
						if($scope.ts_groupMap[r.prod_grp_id] == undefined){
							$scope.alert_2016("잘못된 그룹입니다.");
							return;
						}
						
						//scrollToTop();
						
						$scope.ts_currentGroup		= r.prod_grp_id;
						$scope.ts_goodsList			= r.goods_no_list;
						$scope.ts_prodList.length	= 0;
						var arr		= $scope.ts_groupMap[$scope.ts_currentGroup].prod_list;
						var len		= arr.length
						var i, p;
						if($scope.isValidArray(r.goods_no_list)){
							for(i=0; i<len; i++){
								p = arr[i];
								if(r.goods_no_list.indexOf(p.goods_no) >= 0){
									$scope.ts_prodList.push(arr[i]);
								}
							}
						}else{
							$scope.ts_prodList = [].concat(arr);
						}
						$scope.ts_currentStep = 2;
						var tk = $scope.ts_talkList[$scope.ts_currentStep];
						tk.user_text	= q.text;
						tk.talk_list	= r.talk_list;
						tk.tts_text		= r.tts_text;
						if($scope.isValidString(r.user_text)){
							tk.user_text = r.user_text;
						}
						
						$(".ts_step_cont > div").css("opacity", 0);
						$timeout(animateChatCont, 500);
						break;
					default:
						throwTalkError(r);
						break;
					}
				};
				
				/**
				 * 의미분석 데이터 처리 - step 3
				 */
				function processTalkData3(r, q){
					switch(r.command){
					case "payRequest":// 결제하기
						//scrollToTop();
						
						$scope.ts_orderPaying = {r:r, q:q};
						if($scope.ts_basicInfo.pay_mean_cd == "40"){
							// Lpay이면 가맹점 사용자 인증/결제수단 조회
							LPAY_ONLINE_CUSTNO = $scope.ts_basicInfo.onlCno;
							lpayAuthSuccess = prodeedPayment;
							merchantAuth();
						}else{
							prodeedPayment();
						}
						
						break;
					default:
						throwTalkError(r);
						break;
					}
				};
				
				/**
				 * 결제 프레임으로 진행
				 */
				function prodeedPayment(){
					//scrollToTop();
					
					var r = $scope.ts_orderPaying.r;
					var q = $scope.ts_orderPaying.q;
					$scope.ts_currentStep = 4;
					var tk = $scope.ts_talkList[$scope.ts_currentStep];
					tk.user_text	= q.text;
					tk.talk_list	= r.talk_list;
					tk.tts_text		= r.tts_text;
					if($scope.isValidString(r.user_text)){
						tk.user_text = r.user_text;
					}
					
					$timeout(gotoOrderFrame, 10);
				};
				
				/**
				 * 의미분석 데이터 처리 - step 4
				 */
				function processTalkData4(r, q){
					switch(r.command){
					case "payComplete":// 결제완료
						//scrollToTop();
						
						$scope.ts_currentStep = 5;
						var tk = $scope.ts_talkList[$scope.ts_currentStep];
						tk.talk_list	= r.talk_list;
						tk.tts_text		= r.tts_text;
						if($scope.isValidString(r.user_text)){
							tk.user_text = r.user_text;
						}
						$scope.ts_orderResult = r.ret_object;
						
						//$timeout(function(){ gotoStep(1); }, 3000);
						break;
					default:
						throwTalkError(r);
						break;
					}
				};
				
				/**
				 * 의미분석 데이터 처리 - step 5
				 */
				function processTalkData5(r, q){
					switch(r.command){
					case "gotoPurchaseList":// 주문배송조회
						$scope.gotoPurchaseView();
						break;
					default:
						throwTalkError(r);
						break;
					}
				};
				
				/**
				 * 텍스트 태그 리플레이스
				 */
				var replaceMap = {"&lt;":"<", "&gt;":">"};
				var repRegExp = new RegExp(Object.keys(replaceMap).join("|"), "gi");
				function replaceFunc(str){ return replaceMap[str]; }
				function replaceTags(arr){
					if(! $scope.isValidArray(arr)){ return; }
					
					var str;
					var len = arr.length;
					for(var i=0; i<len; i++){
						arr[i] = arr[i].replace(repRegExp, replaceFunc);
					}
				};
				/******************************************* CHAT SERVER *******************************************/
				
				
				/******************************************* PAYMENT *******************************************/
				/**
				 * 결제 아이프레임 열기
				 */
				function gotoOrderFrame(){
					var cn, gn;
					try{
						cn = $scope.ts_orderReview.cart_sn;
						gn = $scope.ts_orderReview.goods_list.items[0].goods_no;
					}catch(e){}
					
					if(cn == undefined || gn == undefined){
						$scope.alert_2016("유효하지 않은 상품입니다.");
						return;
					}
					
					var path = URL_ORDER_FRAME + "?talkYN=Y&" + $scope.baseParam + "&cart_sn=" + cn + "&goods_no=" + gn;
					angular.element("#tsol_iframe").prop("src", path);
				};
				
				/**
				 * 결제 아이프레임 콜백
				 * @param {String} resCode - 응답코드 ("0000" 정상)
				 * @param {String} resMsg - 응답메시지
				 * @param {String} ord_no - 주문번호
				 */
				$scope.talkOrderCallBack = function(resCode, resMsg, ord_no){
					if(resCode == "0000"){
						$scope.paymentSuccess(ord_no);
					}else{
						$scope.paymentFail(resCode, resMsg);
					}
					
					hideHeaderIOS();
				};
				window.talkOrderCallBack = $scope.talkOrderCallBack;
				
				/**
				 * 결제 성공
				 * @param {String} ord_no - 주문번호
				 */
				$scope.paymentSuccess = function(ord_no){
					$scope.ts_currentOrderNo = ord_no;
					$scope.talkRecomDelegate("sendSpeech", "결제완료");
				};
				
				/**
				 * 결제 실패
				 * @param {String} resCode - 응답코드 ("0000" 정상)
				 * @param {String} resMsg - 응답메시지
				 */
				$scope.paymentFail = function(resCode, resMsg){
					$scope.alert_2016("[" + resCode + "] " + resMsg);
					goPrevStep();
				};
				/******************************************* PAYMENT *******************************************/

				
				/******************************************* UI CONTROL *******************************************/
				/**
				 * 페이지 상단으로 스크롤
				 */
				function scrollToTop(){
					window.scrollTo(0, 0);
				};
				
				/**
				 * 그룹 선택하기
				 * @param {Object} group - 상품군 오브젝트
				 */
				$scope.selectProdGroup = function(group, idx){
					$scope.talkRecomDelegate("sendSpeech", group.title + " 주문해줘");
					tsTclick(12, idx);
				};
				
				/**
				 * 상품 선택하기
				 * @param {Number} idx - 상품 인덱스
				 * @param {String} goods_no - 상품번호
				 */
				$scope.selectProduct = function(idx, goods_no){
					$scope.talkRecomDelegate("sendSpeech", idx + "번 주문해줘");
					tsTclick(13, goods_no);
				};
				
				/**
				 * 결제모듈 레이어 닫기
				 */
				$scope.closeOrderLayer = function(){
					angular.element("#tsol_iframe").prop("src", "about:blank");
					hideHeaderIOS()
					goPrevStep();
				};
				
				/**
				 * 인트로 팝업 닫기
				 * @param {Boolean} nomore - 다시 보지 않기
				 */
				$scope.closeIntroPop = function(nomore){
					document.getElementById("tsi_mov").pause();
					if(nomore === true){
						LotteStorage.setLocalStorage("TALK_SHOP_noMoreIntro", "Y");
					}
					LotteStorage.setLocalStorage("TALK_SHOP_closeIntro", $scope.getTodayDate());
					initTalkShopping();
				};
				
				
				var introVideoTimer;
				/**
				 * 인트로 비디오 재생
				 */
				$scope.ts_playVideo = function(){
					angular.element("#tsi_mov").unbind("play pause ended").bind("play pause ended", videoEventListener);
					
					angular.element(".ts_intro .tsi_mov").addClass("playing");
					angular.element("#tsi_mov").prop("src", "http://api.wecandeo.com/video/default/BOKNS9AQWrGGJyzEE7SMpSYWRC40kWDcnjDqgsTbYwRZ2kWreJmsLwieie");
					document.getElementById("tsi_mov").load();
					document.getElementById("tsi_mov").play();
					showVideoControl();
				};
				
				/**
				 * 비디오 콘트롤 보기
				 */
				function showVideoControl(){
					angular.element(".tsi_mov").removeClass("hide");
					$timeout.cancel(introVideoTimer);
					introVideoTimer = $timeout(hideVideoControl, 3000);
				};
				
				/**
				 * 비디오 콘트롤 가리기
				 */
				function hideVideoControl(){
					angular.element(".tsi_mov").addClass("hide");
				};
				
				/**
				 * 인트로 비디오 재생/정지
				 */
				$scope.playPauseIntro = function(){
					var div = angular.element(".tsi_mov");
					
					if(div.hasClass("hide")){
						showVideoControl();
					}else{
						showVideoControl();
						if(div.hasClass("onplay")){
							document.getElementById("tsi_mov").pause();
						}else{
							document.getElementById("tsi_mov").play();
						}
					}
				};
				
				/**
				 * 비디오 객체 이벤트 리스너
				 */
				function videoEventListener(e){
					switch(e.type){
					case "play":
						angular.element(".tsi_mov").addClass("onplay");
						break;
					case "pause":
						angular.element(".tsi_mov").removeClass("onplay");
						break;
					case "ended":
						angular.element(".tsi_mov").removeClass("onplay");
						$scope.closeIntroPop();
						break;
					// no default
					}
				};
				
				/**
				 * 약관보기 토글
				 */
				$scope.toggleClause = function(){
					$scope.ts_clause.toggle = ! $scope.ts_clause.toggle;
				};
				
				/**
				 * 약관 팝업 보기
				 */
				$scope.showHideClause = function(visible){
					$scope.ts_clause.visible = visible;
					
					if(visible){
						if($scope.ts_clause.index == 0){
							$timeout(function(){ $scope.loadClause(1); }, 10);
						}else{
							$timeout(function(){ $scope.loadClause($scope.ts_clause.index); }, 10);
						}
					}else{
						$timeout(function(){animateChatCont(true);}, 10);
					}
				};
				
				/**
				 * 약관 로드하기
				 */
				$scope.loadClause = function(flag){
					$scope.ts_clause.index = flag;
					var path = "";
					switch(flag){
					case 1:
						path = LotteCommon.clauseECommerce;
						break;
					case 2:
						path = LotteCommon.clausePIUse;
						break;
					case 3:
						path = LotteCommon.clausePIConsign;
						break;
					default:
						return;
						break;
					}
					angular.element(".ts_clause_cont > div").scrollTop(0);
					angular.element(".ts_clause_cont > div").scrollLeft(0);
					angular.element("#clauseHolder").load(path + " .clause_wrap");
				};
				/******************************************* UI CONTROL *******************************************/
				
				
				/******************************************* MIC CONTROL *******************************************/
				/**
				 * 마이크 초기화
				 */
				function initMic(){
					$scope.ts_micStat.init = true;
					
					$timeout(function(){
						$scope.ts_micStat.inited = true;
					}, 300);
					$timeout(initAnimation, 1000);
				};
				
				/**
				 * 마이크 클릭 이벤트
				 */
				$scope.micClick = function(){
					if($scope.ts_micStat.inited == false){ return; }
					
					if($scope.ts_micStat.open){
						//setMicClose();
						stopSpeechRecog();
					}else{
						setMicOpen();
					}
					tsTclick(14);
				};
				
				/**
				 * 마이크 펼치기
				 */
				function setMicOpen(){
					$timeout.cancel(ts_promise.activateMic);
					$timeout.cancel(ts_promise.returnFirst);
					$scope.ts_stt.text = "";
					setToastList("step");
					
					stopTTS();
					$scope.ts_micStat.open = true;
					
					ts_promise.activateMic = $timeout(startSpeechRecog, ts_delay.activateMic);
				};
				
				/**
				 * 마이크 닫기
				 */
				function setMicClose(){
					//stopSpeechRecog();
					stopSTT();
					
					
					$timeout.cancel(ts_promise.activateMic);
					$timeout.cancel(ts_promise.noSpeaking);
					$timeout.cancel(ts_promise.quitRecognition);
					
					angular.element(".tsm_box .tsmc_ripple div").stop().remove();
					$scope.ts_micStat.open		= false;
					$scope.ts_micStat.listening	= false;
					$scope.ts_micStat.sending	= false;
					$scope.ts_micStat.warning	= false;
					$scope.ts_stt.text			= "";
					$scope.ts_stt.strength		= 0;
					ts_dot.angle	= 0;
					ts_dot.top		= 0;
					setToastList("none");
					//setToastList("step");
				};
				
				/**
				 * 음성인식 시작
				 */
				function startSpeechRecog(){
					$scope.ts_micStat.listening	= true;
					
					$timeout.cancel(ts_promise.noSpeaking);
					$timeout.cancel(ts_promise.quitRecognition);
					ts_promise.noSpeaking = $timeout(recogNoSpeech, ts_delay.noSpeaking);
					ts_promise.quitRecognition = $timeout(stopSpeechRecog, ts_delay.quitRecognition);
					
					startStt();
				};
				
				/**
				 * 음성인식 종료
				 */
				function stopSpeechRecog(){
					/*$timeout.cancel(ts_promise.activateMic);
					$timeout.cancel(ts_promise.noSpeaking);
					$timeout.cancel(ts_promise.quitRecognition);
					
					$scope.ts_micStat.listening	= false;
					$scope.ts_stt.text			= "";
					$scope.ts_stt.strength		= 0;
					ts_dot.angle	= 0;
					ts_dot.top		= 0;
					setToastList("step");*/
					
					if($scope.isValidString($scope.ts_stt.text)){
						$scope.talkRecomDelegate("sendSpeech", $scope.ts_stt.text);
					}else{
						setMicClose();
					}
					
					//setMicClose();
				};
				
				/**
				 * 음성인식 텍스트 없음
				 */
				function recogNoSpeech(){
					if($scope.ts_stt.text == ""){
						setToastList("nospeak");
					}
				};
				
				
				/**
				 * 토스트 메시지 리스트 관리
				 */
				function setToastList(flag){
					$interval.cancel(ts_promise.rotateToast);
					
					if(flag == "step"){
						flag += $scope.ts_currentStep;
					}
					
					switch(flag){
					case "step1":
						$scope.ts_toastList	= $scope.TOAST_LIST.step1;
						break;
					case "step2":
						$scope.ts_toastList	= $scope.TOAST_LIST.step2;
						break;
					case "step3":
						$scope.ts_toastList	= $scope.TOAST_LIST.step3;
						break;
					case "step5":
						$scope.ts_toastList	= $scope.TOAST_LIST.step5;
						break;
					case "nospeak":
						$scope.ts_toastList	= $scope.TOAST_LIST.nospeak;
						break;
					default:
						$scope.ts_toastList	= [];
						break;
					}

					$scope.ts_toastCnt	= $scope.ts_toastList.length;
					$scope.ts_toastIdx	= Math.floor(Math.random() * $scope.ts_toastCnt);
					
					if($scope.ts_toastCnt > 1){
						ts_promise.rotateToast = $interval(rollToastMessage, ts_delay.rotateToast);
					}
				};
				
				/**
				 * 토스트 메시지 롤링
				 */
				function rollToastMessage(){
					if($scope.ts_toastCnt <= 1 || ! $scope.ts_micStat.open){ return; }
					$scope.ts_toastIdx = ($scope.ts_toastIdx + 1) % $scope.ts_toastCnt;
				};
				/******************************************* MIC CONTROL *******************************************/
				

				/******************************************* APP INTERFACE *******************************************/
				/**
				 * 앱 호출
				 * @param {String} command - 명령어
				 * @param {String} param - 추가 파라미터
				 */
				$scope.callAppAPI = function(command, param){
					var query = "talkshop://" + command;
					var div = "?";
					var p;
					for(p in param){
						query += div + p + "=" + param[p];
						div = "&";
					}
					
					if($scope.appObj.isApp){
						window.location.href = query;
					}else{
						console.log("▷▷▷▷▷ ", query);
					}
				}

				/**
				 * 결제 종료 시 아이폰 헤더 가리기
				 */
				function hideHeaderIOS(){
					if($scope.appObj.isIOS){
						$scope.callAppAPI("hideHeader");
					}
				}
				
				
				/**
				 * TTS 시작
				 * @param {String} tts - TTS 읽을 텍스트
				 */
				function startTTS(tts){
					if($scope.ts_basicInfo.showBasicInfo || $scope.ts_basicInfo.showGuideInfo || $scope.showExitConfirm){ return; }
					
					if(tts.indexOf("이해하지 못했어요") >= 0 || tts.indexOf("2해하지 못했어요") >= 0){
						$scope.ts_notRecogCnt ++;
					}else{
						$scope.ts_notRecogCnt = 0;
					}
					
					if($scope.ts_notRecogCnt >= 2){
						activateMicOnEnd = false;
					}
					
					ttsRunning = true;
					$scope.ts_currentTTS = tts;
					$scope.callAppAPI("startTTS", {"text":tts});
				};
				
				/**
				 * TTS 정지
				 */
				function stopTTS(){
					if(ttsRunning !== true){ return; }
					
					ttsRunning = false;
					$scope.callAppAPI("stopTTS");
				};
				
				/**
				 * TTS 종료 콜백
				 */
				function ttsEndCallback(){
					console.warn("TTS END", activateMicOnEnd, $scope.ts_currentStep);
					ttsRunning = false;
					if(activateMicOnEnd && $scope.ts_currentStep == 3){
						setMicOpen();
					}
					
					/*if($scope.ts_currentStep == 5){
						ts_promise.returnFirst = $timeout(function(){ gotoStep(1); }, 7000);
					}*/
				};
				window.ttsEndCallback = ttsEndCallback;

				
				/**
				 * 음성인식 텍스트 전달
				 * @param String str - 음성인식 텍스트
				 */
				$scope.setSTTText = function(str){
					if( ! $scope.ts_micStat.listening){ return; }
					if( ! angular.isString(str) ){ return; }
					$scope.ts_stt.text		= str;
				};
				window.setSTTText = $scope.setSTTText;
				
				/**
				 * 음성인식 종료하기
				 */
				function sttEndCallback(){
					sttRunning = false;
					stopSpeechRecog();
				};
				window.sttEndCallback = sttEndCallback;
				
				/**
				 * STT 시작
				 */
				function startStt(){
					if($scope.ts_basicInfo.showBasicInfo || $scope.ts_basicInfo.showGuideInfo || $scope.showExitConfirm){ return; }
					
					sttRunning = true;
					$scope.callAppAPI("startSTT");
				};
				
				/**
				 * STT 정지
				 */
				function stopSTT(){
					if(sttRunning !== true){ return; }
					
					sttRunning = false;
					$scope.callAppAPI("stopSTT");
				};
				
				/**
				 * 안드로이드 하드웨어 백키 대응
				 */
				function backKeyClicked(){
					if($scope.ts_currentStep <= 1){
						// exit
						$scope.goHistoryBack();
					}else{
						// prev step
						goPrevStep();
					}
				};
				window.backKeyClicked = backKeyClicked;
				/******************************************* APP INTERFACE *******************************************/

				
				/******************************************* ANIMATION *******************************************/
				
				/**
				 * 애니메이션 초기화
				 */
				function initAnimation(){
					$interval(animateDotFunc, 20);
					$interval(setSpeechStrength, 500);
				};
				
				function setSpeechStrength(){
					if(!$scope.ts_micStat.listening){ return; }
					
					$scope.ts_stt.strength = Math.round(Math.random() * 60) + 40;
				};
				
				/**
				 * 점 애니메이션 실행함수
				 */
				function animateDotFunc(){
					if(! ($scope.ts_micStat.listening || $scope.ts_micStat.sending || $scope.ts_micStat.warning)){ return; }
					
					ts_dot.angle += 10;

					var d1 = angular.element(".tsmc_dot span.a1");
					var d2 = angular.element(".tsmc_dot span.a2");
					var d3 = angular.element(".tsmc_dot span.a3");
					var c0 = angular.element(".tsm_circle .tsmc_disc > div");
					var s1 = d1.find("span");
					var s2 = d2.find("span");
					var s3 = d3.find("span");
					if(d1.length == 0){ return; }
					
					if($scope.ts_micStat.sending){
						animateDotOpacity();
					}else if($scope.ts_micStat.listening){
						animateRipple();
						animateDotWave();
					}else if($scope.ts_micStat.warning){
						animateDotWarn();
					}
					
					d1.css(CSS1);
					d2.css(CSS2);
					d3.css(CSS3);
					
					CSS4.top		= - ts_dot.top;
					CSS4.bottom		= - ts_dot.top;
					CSS5.top		= - ts_dot.top * 0.6;
					CSS5.bottom		= - ts_dot.top * 0.6;
					CSS6.opacity	= animateConverge(CSS6.opacity, 0);
					
					s1.css(CSS4);
					s2.css(CSS5);
					s3.css(CSS4);
					c0.css(CSS6);
				};
				
				/**
				 * 음성인식 중 파문 애니메이션
				 */
				function animateRipple(){
					if( ! $scope.isValidString($scope.ts_stt.text)){ return; }
					//if(ts_dot.angle < 720){ return; }
					
					var s = $scope.ts_stt.strength;
					if( ! $scope.isValidNumber(s)){ return; }
					$scope.ts_stt.strength = 0;
					
					CSS6.opacity = s / 100;
					
					var h = s / 6;
					if(ts_dot.top < h){
						ts_dot.top = h;
					}
					s = s / 5;
					
					var r = $(".tsm_box .tsmc_ripple");
					var d = $("<div />");
					r.append(d);
					
					var css = {
						"left"		: -(33 + s),
						"right"		: -(33 + s),
						"top"		: -(33 + s),
						"bottom"	: -(33 + s),
						"opacity"	: 0
					};
					var opt = {
						"duration"	: 1200,
						"easing"	: $scope.checkJQueryEasing("easeOutBack"),
						"complete"	: function(){
							d.remove();
						}
					};
					d.animate(css, opt);
				};
				
				/**
				 * 음성인식 중 점 상하 애니메이션
				 */
				function animateDotWave(){
					// top
					var AMP = 2;
					
					var a1 = ts_dot.angle;
					var a2 = a1 - 120;
					var a3 = a1 - 240;
					if(a2 < 0){ a2 = 0; }
					if(a3 < 0){ a3 = 0; }
					
					var r1 = a1 / 180 * Math.PI;
					var r2 = a2 / 180 * Math.PI;
					var r3 = a3 / 180 * Math.PI;
					
					var x1 = Math.sin(r1) * AMP;
					var x2 = Math.sin(r2) * AMP;
					var x3 = Math.sin(r3) * AMP;
					
					CSS1.top = x1;
					CSS2.top = x2;
					CSS3.top = x3;
					
					// height
					ts_dot.top = animateConverge(ts_dot.top, 0);
					
					// opacity
					CSS1.opacity = animateConverge(CSS1.opacity, 1);
					CSS2.opacity = animateConverge(CSS2.opacity, 1);
					CSS3.opacity = animateConverge(CSS3.opacity, 1);
				};
				
				/**
				 * 채팅서버 연결 중 투명도 애니메이션
				 */
				function animateDotOpacity(){
					// opacity
					var AMP = 0.4;
					var OFF = 0.6;
					
					var a1 = ts_dot.angle;
					var a2 = a1 - 60;
					var a3 = a1 - 120;
					if(a2 < 0){ a2 = 0; }
					if(a3 < 0){ a3 = 0; }
					
					var r1 = a1 / 180 * Math.PI;
					var r2 = a2 / 180 * Math.PI;
					var r3 = a3 / 180 * Math.PI;
					
					var t1 = Math.sin(r1) * AMP + OFF;
					var t2 = Math.sin(r2) * AMP + OFF;
					var t3 = Math.sin(r3) * AMP + OFF;
					
					CSS1.opacity = t1;
					CSS2.opacity = t2;
					CSS3.opacity = t3;
					
					// height
					ts_dot.top = animateConverge(ts_dot.top, 0);
					
					// top
					CSS1.top = animateConverge(CSS1.top, 0);
					CSS2.top = animateConverge(CSS2.top, 0);
					CSS3.top = animateConverge(CSS3.top, 0);
				};
				
				/**
				 * 의미분석 실패 시 애니메이션
				 */
				function animateDotWarn(){
					// top
					CSS1.top = animateConverge(CSS1.top, 0);
					CSS2.top = animateConverge(CSS2.top, 0);
					CSS3.top = animateConverge(CSS3.top, 0);
					
					// height
					ts_dot.top = animateConverge(ts_dot.top, 0);

					// opacity
					CSS1.opacity = animateConverge(CSS1.opacity, 1);
					CSS2.opacity = animateConverge(CSS2.opacity, 1);
					CSS3.opacity = animateConverge(CSS3.opacity, 1);
				};
				
				/**
				 * 애니메이션 수치 수렴시키기
				 * @param {Number} n - 제어할 값
				 * @param {Number} c - 수렴할 값
				 */
				function animateConverge(n, c){
					var d = c - n;
					
					if(Math.abs(d) < 0.05){
						return c;
					}
					
					return n + d / 20;
				};
				/******************************************* ANIMATION *******************************************/
				
				
				/******************************************* UTIL *******************************************/
				/**
				 * 상품상세 이동
				 */
				function gotoDetailView(goodsNo){
					var item = {
						"curDispNoSctCd"	: 94,
						"goodsNo"			: goodsNo
					}
					var tc = "";//$scope.tClickBase + "TALKSHOPPING_";// + (flag=="t" ? "" : "_detail");
					$timeout(function(){
						$scope.productView(item, "", "", tc);
					}, 200);
				};
				
				/**
				 * 장바구니 이동
				 */
				function gotoCart(){
					$timeout(function(){
						$scope.gotoService("cartLstUrl");//, {"tclick":$scope.tClickBase + "Samanda_Clk_Lnk_profile_showcart"});
					}, 200);
				};
				
				/**
				 * 주문배송조회 이동
				 */
				$scope.gotoPurchaseView = function(){
					$timeout(function(){
						$scope.gotoService("purchaseViewUrl", {"orderNo" : $scope.ts_currentOrderNo});
					}, 200);
				};
				
				/**
				 * 티클릭 전달
				 */
				function tsTclick(tc, affix){
					var send = true;
					var tclick = $scope.tClickRenewalBase + "VoiceOrder_Clk_";
					
					switch(tc){
					case 1:
						tclick += "btn_inputaddress";
						send = false;
						break;
					case 2:
						tclick += "btn_inputPayment";
						send = false;
						break;
					case 3:
						tclick += "btn_closeadvancerg";
						send = false;
						break;
					case 4:
						tclick += "btn_changeaddress";
						send = false;
						break;
					case 5:
						tclick += "btn_changePayment";
						send = false;
						break;
					case 6:
						tclick += "btn_StartVorceOrder";
						break;
					case 7:
						tclick += "apply";
						break;
					case 8:
						tclick += "btn_back";
						break;
					case 9:
						tclick += "btn_info";
						break;
					case 10:
						tclick += "btn_setting";
						break;
					case 11:
						tclick += "btn_prevStep";
						break;
					case 12:
						tclick += "btn_category_" + affix;
						break;
					case 13:
						tclick += "btn_product_" + affix;
						break;
					case 14:
						tclick += "btn_mic";
						break;
					default:
						return "";
						break;
					}
					
					if(send){
						$scope.sendTclick(tclick);
					}else{
						return tclick;
					}
				}
				/******************************************* UTIL *******************************************/

				console.log("앱 버전 체크");
				if ($scope.appObj.isApp) {
					var msg = "말로 쉽고 빠르게<br/>상품추천부터 결제까지!<br/>지금 바로 말로 하는 쇼핑을<br/>경험해 보세요!<br/><br/>지금 업데이트 하시겠어요?";

					var obj = {
						"label" : {
							"ok" : "승인",
							"cancel" : "취소"
						},
						"callback" : function(rtn) {
							if (rtn) {
								if ($scope.appObj.isIOS) {
									location.href = "http://itunes.apple.com/app/id376622474?mt=8";
								} else {
									location.href = "market://details?id=com.lotte";
								}
							} else {
								try {
									appSendBack();
								} catch(e) {
									var linkUrl = LotteCommon.mainUrl + "?" + LotteUtil.getBaseParam();
									$window.location.href = linkUrl;
								}
							}
						}
					}

					$scope.confirm_2016(msg, obj);
				} else { // 웹일때는 앞으로 이쪽으로 탈 일이 없음
					LotteUserService.promiseLoginInfo().finally(function (loginInfo){
						$timeout(startOver, 200);
						//startOver();
					});
				}
				
			}//link
		};
	}]);//directive
	
})(window, window.angular);