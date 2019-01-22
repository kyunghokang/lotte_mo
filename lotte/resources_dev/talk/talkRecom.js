(function(window, angular, undefined) {
	'use strict';
	
	var app = angular.module('app', [
		'lotteComm',
		'lotteNgSwipe',
		'lotteSlider'
	]);

	app.controller('TalkRecomCtrl', ['$scope', 'LotteCommon', 'commInitData', '$window', 
	                         function($scope,   LotteCommon,   commInitData, $window) {

		$scope.DEV_MODE = commInitData.query.dev_mode == "Y";
		if(location.host == "m.lotte.com"){ $scope.DEV_MODE = false; }
		
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "스마트 톡추천"; //서브헤더 타이틀
		
		$scope.isAutoScrollEnabled	= true; // 화면 하단으로 자동스크롤 여부
		$scope.isWaitingResponse	= false; // 응답 대기중
		$scope.isLoadingData		= false;
		$scope.isLoadingProd		= false;
		$scope.waitingTO;
		
		$scope.isReasonVisible		= false; // 추천이유
		$scope.isInformVisible		= false; // 인포메이션
		$scope.isProfileVisible		= false; // 프로필
		
		$scope.TEMP_OPTION = null;
		
		$scope.WEEK = ["일", "월", "화", "수", "목", "금", "토"];
		$scope.CHAT_QUE = []; // 데이터 순차 로드
		$scope.PROD_QUE = []; // 상품 순차 로드
		$scope.GROUPS = []; // 그룹 리스트
		$scope.GROUP_MAP = {}; // group_id로 그룹 매핑
		$scope.PRODUCT_MAP = {}; // talk_id로 상품 리스트 매핑
		$scope.PROD_GROUP_SIZE = 5;
		$scope.TALK_BUFFER = [];
		$scope.PROD_BUFFER = {};
		
		$scope.userInputText = "";
		$scope.recomReason = null; // 추천이유
		$scope.currentChatQue = null; // 현재 처리중 데이터
		$scope.currentCartOption = null; // 현재 처리중 장바구니 옵션
		$scope.currentTalkOption = null; // 현재 처리중 대화 옵션
		$scope.currentOptionPre = null; // 현재 처리중 대화 옵션
		$scope.currentCateOption = null; // 현재 처리중 카테고리 옵션
		
		$scope.timeDifference = 0;

		/**
		 * 문자열을 Date 객체로 변환
		 * @param {String} str - yyyymmddhhmmss 형식
		 * @return {Object} Date 객체
		 */
		$scope.getDateTime = function(str){
			if(str == undefined || str == ""){
				var now = new Date();
				now.setTime( now.getTime() + $scope.timeDifference );
				return now;
				//return new Date();
			}
			
			var Y	= parseInt(str.substr(0, 4), 10);
			var M	= parseInt(str.substr(4, 2), 10) - 1;
			var D	= parseInt(str.substr(6, 2), 10);
			var h	= parseInt(str.substr(8, 2), 10);
			var m	= parseInt(str.substr(10, 2), 10);
			var s	= parseInt(str.substr(12, 2), 10);
			return new Date(Y, M, D, h, m, s);
		};
		
		$scope.getDateTimeString = function(){
			//var now = new Date();
			var now = $scope.getDateTime();
			var Y = now.getFullYear();
			var M = now.getMonth() + 1;
			if(M < 10){
				M = "0" + M;
			}
			var D = now.getDate();
			if(D < 10){
				D = "0" + D;
			}
			var h = now.getHours();
			if(h < 10){
				h = "0" + h;
			}
			var m = now.getMinutes();
			if(m < 10){
				m = "0" + m;
			}
			var s = now.getSeconds();
			if(s < 10){
				s = "0" + s;
			}
			
			return ("" + Y + M + D + h + m + s);
		}
	}]);
	
	app.directive('lotteContainer', ['LotteCommon', '$window', '$timeout', '$interval', '$http', 'LotteStorage', 'LotteUserService', 'LotteUtil', 
	                         function(LotteCommon,   $window,   $timeout,   $interval,   $http,   LotteStorage,   LotteUserService, LotteUtil) {
		return {
			templateUrl : '/lotte/resources_dev/talk/talkRecom_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				

				///////////////////////////////////////////////////////////// DEV MODE
				$scope.DO_NOT_SAVE_LOCAL = false;
				
				$scope.clearTempOption = function(){
					$scope.TEMP_OPTION = null;
				}
				
				$scope.clearLocalStorage = function(){
					LotteStorage.delLocalStorage("TALK_RECOM_LCST");
					$scope.DO_NOT_SAVE_LOCAL = true;
					location.href = LotteCommon.talkRecomUrl + "?" + $scope.baseParam + "&dev_mode=Y&a=" + Math.round(Math.random() * 100);
				}
				
				$scope.userInputMsg = function(){
					var str = window.prompt();
					if(str == undefined || str == ""){ return; }
					$scope.talkRecomDelegate('sendTalk', str, 'T');
				};
				
				window.changeServer = function(url){
					if(url == undefined || url == ""){
						CHAT_URL = LotteCommon.talkRecomChatbot;
					}else{
						CHAT_URL = url;
					}
					console.log("server changed to: " + CHAT_URL);
				};
				///////////////////////////////////////////////////////////// DEV MODE
				

				var MBRNO = "";
				var MBRNM = "";
				
				var OPT_SKIP = "건너뛰기";
				var OPT_NEW_RECO = "새 추천 시작하기";
				var OPT_PREV = "이전으로 돌아가기";
				var SYMBOL_PIPE = "|";
				var SYMBOL_SEMICOLON = ";";
				var SYMBOL_X = " x ";
				var TALK_GROUP_SIZE = 3;
				var CHAT_URL = LotteCommon.talkRecomChatbot;
				var PROD_URL = LotteCommon.talkRecomProdlist;
				var MENU_URL = LotteCommon.talkRecomAppMenu;
				var COLOR_CODE_MAP = {
					"010" : "ddbd97",
					"020" : "ff6600",
					"030" : "ff0000",
					"040" : "ffff00",
					"050" : "90ee90",
					"060" : "009933",
					"070" : "87cdfa",
					"080" : "191970",
					"090" : "0000ff",
					"100" : "706c3d",
					"110" : "783c24",
					"120" : "9932cc",
					"130" : "ff80ff",
					"140" : "ff88ae",
					"150" : "ffffff",
					"160" : "d3d3d3",
					"170" : "666666",
					"180" : "000000",
					"ddbd97" : "010",
					"ff6600" : "020",
					"ff0000" : "030",
					"ffff00" : "040",
					"90ee90" : "050",
					"009933" : "060",
					"87cdfa" : "070",
					"191970" : "080",
					"0000ff" : "090",
					"706c3d" : "100",
					"783c24" : "110",
					"9932cc" : "120",
					"ff80ff" : "130",
					"ff88ae" : "140",
					"ffffff" : "150",
					"d3d3d3" : "160",
					"666666" : "170",
					"000000" : "180"
				};
				COLOR_CODE_MAP[OPT_SKIP]		= OPT_SKIP;
				COLOR_CODE_MAP[OPT_PREV]		= OPT_PREV;
				COLOR_CODE_MAP[OPT_NEW_RECO]	= OPT_NEW_RECO;
				
				/**
				 * 옵션 타이틀 매핑
				 * @param {String} title - 옵션 타이틀
				 */
				function mapOptionTitle(title){
					switch(title){
					case "reatedKeyword"	: title = "연관검색어";				break;
					case "colors"			: title = "색상";					break;
					case "price"			: title = "가격대";					break;
					case "smpDept"			: title = "백화점 스마트픽";		break;
					case "smpickBranch"		: title = "백화점 스마트픽";		break;
					case "smpSeven"			: title = "세븐일레븐 스마트픽";	break;
					case "tdar"				: title = "오늘도착";				break;
					case "quick"			: title = "퀵배송";					break;
					case "freediv"			: title = "무료배송";				break;
					case "noint"			: title = "무이자";					break;
					case "point"			: title = "포인트";					break;
					case "freepack"			: title = "무료포장";				break;
					case "deliver"			: title = "배송";					break;
					// no default
					}
					return title;
				};
				
				
				/**
				 * 디렉티브 시작하기
				 */
				function startOver(){
					MBRNO = $scope.loginInfo.mbrNo;
					MBRNM = $scope.loginInfo.name;

					if(MBRNO == undefined || MBRNO == ""){
						var path = encodeURIComponent( LotteCommon.talkRecomUrl + "?" + $scope.baseParam );
						$scope.gotoService("loginUrl", {targetUrl : path});
						return;
					}
					
					
					bindEvents();
					
					$scope.callAppAPI("startTalk?" + MENU_URL);
					
					
					var lcst = LotteStorage.getLocalStorage("TALK_RECOM_LCST", "json");
					if(lcst == undefined || lcst.groups == undefined){
						//console.log("NO LOCAL STORAGE");
						addToQue({
							"command"	: "getGroups"
						});
					}else{
						//console.log("USE LOCAL STORAGE");
						
						if(MBRNO != lcst.memberno){
							//console.log("MEMBER_NO NOT MATCH");
							addToQue({
								"command"	: "getGroups"
							});
							return;
						}
						
						$scope.GROUPS = lcst.groups;
						
						var GMAP = $scope.GROUP_MAP;
						var GRPS = $scope.GROUPS;
						var grp;
						var len = GRPS.length;
						for(var i=0; i<len; i++){
							grp = GRPS[i];
							GMAP[grp.group_id] = grp;
						}
						
						//var gr, sc, tk;
						var sl, tl;
						GRPS.forEach(function(gr, i){// group list
							sl = gr.section_list;
							if(sl != undefined){
								sl.forEach(function(sc, k){// section list
									tl = sc.list;
									if(tl != undefined){
										tl.forEach(function(tk, m){// talk list
											if(tk.goods_no != undefined && tk.goods_no.length > 0){
												tk.prodChecked = false;
												$scope.PROD_BUFFER[tk.gr_tk_id] = tk;
											}
										});// talk list
									}
								});// section list
							}
						});// group list
						
						
						addToQue({
							"command"	: "getGroups"
						});
						
						
						$timeout(function(){
							if(history.state == null || history.state.name != "talkrecom"){
								//console.log("NEW VISIT: scroll to bottom");
								history.replaceState({name:"talkrecom"}, "talkrecom");
								scrollToBottomDelay(true);
							}else{
								//console.log("REVISIT: scroll to ", lcst.scrollTop);
								if(!isNaN(lcst.scrollTop)){
									scrollTo(0, lcst.scrollTop);
								}else{
									scrollToBottomDelay(true);
								}
							}
						}, 1);
					}
					
					
					$interval(processTalkBuffer, 1000);
				};
				
				/**
				 * 위시리스트 담기
				 */
				$scope.addToWishList = function(item){
					$scope.isAutoScrollEnabled = true;
					addToQue({
						"command"	: "addWish",
						"goods_no"	: item.goodsNo
					}, item);
					sendTclick("addwish");
				};
				
				/**
				 * 장바구니 담기
				 */
				$scope.addToCart = function(item, opt_item_no){
					$scope.isAutoScrollEnabled = true;
					addToQue({
						"command"	: "addCart",
						"goods_no"	: item.goodsNo,
						"goods_cmps_cd" : item.goodsCmpsCd,
						"item_no"	: opt_item_no
					}, item);
					sendTclick("addcart");
				};
				
				/**
				 * 상품상세 이동
				 */
				$scope.gotoDetailView = function(item, flag){
					item.curDispNoSctCd = 96;
					var tc = $scope.tClickBase + "Samanda_Clk_Lnk_goods" + (flag=="t" ? "" : "_detail");
					gotoURL("P", item, tc);
				};
				
				/**
				 * 팝업 열기/닫기
				 */
				$scope.showTrPopup = function(flag, item){
					$scope.callAppAPI("hideInput");
					
					$timeout(function(){
						showTrPopupDelay(flag, item);
					}, 250);
				};
				
				function showTrPopupDelay(flag, item){
					sendTclick(flag);
					
					switch(flag){
					case "reason":
						$scope.recomReason = item;
						$scope.isReasonVisible = true;
						$scope.setPopupPosition(".tr_popup_reason");
						break;
					case "inform":
						$scope.isInformVisible = true;
						$scope.setPopupPosition(".tr_popup_inform");
						break;
					case "profile":
						$scope.isProfileVisible = true;
						$scope.setPopupPosition(".tr_popup_profile");
						break;
					// no default
					}
					
					$timeout(function(){
						angular.element(".tr_popup").unbind("touchmove").bind("touchmove", function(e){ e.preventDefault(); });
					}, 10);
				};
				
				$scope.hideTrPopup = function(flag){
					switch(flag){
					case "reason":
						$scope.recomReason = null;
						$scope.isReasonVisible = false;
						break;
					case "inform":
						$scope.isInformVisible = false;
						break;
					case "profile":
						$scope.isProfileVisible = false;
						break;
					// no default
					}
					
					$scope.callAppAPI("showInput");
				};
				
				/**
				 * 팝업 좌표 제어
				 * @param {string} query - 팝업 레이어 클래스
				 */
				$scope.setPopupPosition = function(query){
					$timeout(function(){
						var wrap, y;
						var wh = $window.outerHeight ? $window.outerHeight : $window.innerHeight;
						var pop = angular.element(".tr_popup" + query);
						// 추천 이유 레이어 별도 처리
						if(query == ".tr_popup_reason"){
							pop.find(".tr_pop_body .mdtip .cont").css("max-height", wh - 450);
						}
						
						wrap = pop.find(".tr_pop_wrap");
						y = Math.round((wh - wrap.height()) / 2);
						wrap.css("top", y);
						pop.css("opacity", 1);
					}, 1);
				};
				
				
				/**
				 * 대기 상태 변경
				 */
				$scope.setWaitingResponse = function(waiting){
					$timeout(function(){
						$scope.isWaitingResponse = waiting;
						if(waiting){
							$scope.scrollToBottom(true);
						}
					}, 0);
				};
				
				function showWaiting(){
					cancelWaiting();
					$scope.setWaitingResponse(true);
				};
				
				function hideWaiting(){
					cancelWaiting();
					$scope.waitingTO = $timeout(function(){
						$scope.setWaitingResponse(false);
					}, 10);
				};
				
				function cancelWaiting(){
					if($scope.waitingTO != undefined){
						$timeout.cancel( $scope.waitingTO );
					}
				};
				
				/**
				 * 최하단으로 스크롤
				 */
				$scope.scrollToBottom = function(forceToScroll){
					if($scope.isAutoScrollEnabled || forceToScroll === true){
						$timeout(scrollToBottomDelay, 10);
					}
				};
				function scrollToBottomDelay(noani){
					if(noani === true){
						scrollTo(0, document.body.scrollHeight);
					}else{
						$("html, body").stop(true);
						$("html, body").animate({ scrollTop: document.body.scrollHeight }, 400);
					}
				};
				
				

				
				/**
				 * 상품 더보기
				 * @param {Object} prod - 상품 오브젝트
				 * @param {Object} slScope - 슬라이드 스코프
				 */
				$scope.showMoreProduct = function(prod, slScope){
					if(prod == undefined || prod.goods_no == undefined || prod.goods_no.length == 0){ return; }
					
					addNewProdTalk(prod);
					
					prod.goods_no.length = $scope.PROD_GROUP_SIZE;
					prod.goods_data.length = 0;
					prod.talk.goods_no.length = $scope.PROD_GROUP_SIZE;
					
					$timeout(function(){
						slScope.reset();
						slScope.lotteSliderMoveXPos(-1500);
					}, 0);
					
					sendTclick("showmore");
				};
				
				/**
				 * 상품 더보기 새 대화 추가하기
				 * @param {Array} goods_no - 상품 번호 배열
				 */
				function addNewProdTalk(prod){
					if(prod == undefined){ return; }
					
					var goods_no = [].concat(prod.goods_no);
					goods_no.splice(0, $scope.PROD_GROUP_SIZE);
					
					var grp;
					var len = $scope.GROUPS.length;
					if(len > 0){
						grp = $scope.GROUPS[len - 1];
					}
					if(grp == undefined){ return; }
					
					var date = $scope.getDateTimeString();
					var tkid = date.substr(8);
					
					// get last talk
					var list = grp.section_list;
					len = list.length;
					var sect, talk;
					
					if(len > 0){
						sect = list[len - 1];
						len = sect.list.length;
						if(len > 0){
							talk = sect.list[len - 1];
							if(date < talk.date){
								date = talk.date;
							}
							tkid = talk.talk_id;
						}
					}
					
					var data = {
						"talk_list" : [
							{
								"auth"		: "U",
								"date"		: date,
								"group_id"	: grp.group_id,
								"talk_id"	: tkid + "_" + 0,
								"text"		: "더보기"
							},{
								"auth"		: "A",
								"date"		: date,
								"group_id"	: grp.group_id,
								"talk_id"	: tkid + "_" + 1,
								"text"		: "더 보여 드릴게요."
							},{
								"auth"		: "A",
								"date"		: date,
								"group_id"	: grp.group_id,
								"talk_id"	: tkid + "_" + 3,
								"text"		: "",
								"goods_no"	: goods_no,
								"goods_data"	: prod.goods_data
							}
						],
						"local" : "Y"
					};
					
					processTalks(data);

					$scope.isAutoScrollEnabled = true;
					$scope.scrollToBottom();
				};
				/*function addNewProdTalk(goods_no){
					if(goods_no == undefined || !angular.isArray(goods_no) || goods_no.length == 0){ return; }
					
					var grp;
					var len = $scope.GROUPS.length;
					if(len > 0){
						grp = $scope.GROUPS[len - 1];
					}
					if(grp == undefined){ return; }
					
					var date = $scope.getDateTimeString();
					var tkid = date.substr(8);
					
					// get last talk
					var list = grp.section_list;
					len = list.length;
					var sect, talk;
					
					if(len > 0){
						sect = list[len - 1];
						len = sect.list.length;
						if(len > 0){
							talk = sect.list[len - 1];
							if(date < talk.date){
								date = talk.date;
							}
							tkid = talk.talk_id;
						}
					}
					
					var data = {
						"talk_list" : [
							{
								"auth"		: "U",
								"date"		: date,
								"group_id"	: grp.group_id,
								"talk_id"	: tkid + "_" + 0,
								"text"		: "더보기"
							},{
								"auth"		: "A",
								"date"		: date,
								"group_id"	: grp.group_id,
								"talk_id"	: tkid + "_" + 1,
								"text"		: "더 보여 드릴게요."
							},{
								"auth"		: "A",
								"date"		: date,
								"group_id"	: grp.group_id,
								"talk_id"	: tkid + "_" + 3,
								"text"		: "",
								"goods_no"	: goods_no
							}
						],
						"local" : "Y"
					};
					
					processTalks(data);

					$scope.isAutoScrollEnabled = true;
					$timeout($scope.scrollToBottom, 10);
					//$scope.scrollToBottom();
				};*/
				
				/**
				 * 새 대화 추가하기
				 * @param {Array} msgs - 메시지 배열
				 */
				function addNewTextTalk(msgs){
					if(msgs == undefined || !angular.isArray(msgs) || msgs.length == 0){ return; }
					
					var i, len, grp;
					len = $scope.GROUPS.length;
					if(len > 0){
						grp = $scope.GROUPS[len - 1];
					}
					if(grp == undefined){ return; }
					
					var date = $scope.getDateTimeString();
					var tkid = date.substr(8);
					var data = {
						"talk_list" : [],
						"local"		: "Y"
					}
					
					// get last talk
					var list = grp.section_list;
					len = list.length;
					var sect, talk;
					
					if(len > 0){
						sect = list[len - 1];
						len = sect.list.length;
						if(len > 0){
							talk = sect.list[len - 1];
							if(date < talk.date){
								date = talk.date;
							}
							tkid = talk.talk_id;
						}
					}
					
					var msg, obj, auth;
					len = msgs.length;
					for(i=0; i<len; i++){
						msg = msgs[i];
						if(msg.text == undefined){ continue; }
						
						auth = msg.auth == "U" ? "U" : "A";
						data.talk_list.push({
							"auth"		: auth,
							"date"		: date,
							"group_id"	: grp.group_id,
							"talk_id"	: tkid + "_" + i,
							"text"		: msg.text
						});
					}
					
					processTalks(data);

					$scope.isAutoScrollEnabled = true;
					$scope.scrollToBottom();
				};
				

				/**
				 * 상품 리스트 초기화
				 * @param {Object} prod - 상품 오브젝트
				 */
				function initProductList(prod){
					if(prod == undefined || prod.goods_no == undefined || prod.goods_no.length == 0){ return; }
					if(!angular.isArray(prod.goods_no)){
						prod.goods_no = [prod.goods_no];
					}
					
					/////////////////////////////////////////////////////////////
					/*if(prod.gr_tk_id == undefined){
						prod.gr_tk_id = prod.group_id + "_" + prod.talk_id;
					}*/
					/////////////////////////////////////////////////////////////

					var param = {
						"goods_no"	: prod.goods_no.join(),
						"gr_tk_id"	: prod.gr_tk_id
					};
					
					// 이미 데이터가 있는 경우
					if(prod.goods_data != undefined && prod.goods_data.length > 0){
						var data = {
							"result" : {
								"response_code" : "00000",
								"response_msg" : "",
								"response_msgtxt" : ""
							},
							"prdLst" : {
								"items" : prod.goods_data,
								"total_count" : prod.goods_data.length
							}
						};
						var config = {
							"params" : param
						};
						
						prodListSuccess(data, "", "", config);
						return;
					}
					
					$scope.PROD_QUE.push(param);
					loadProductList();
				};
				
				/**
				 * 상품 목록 로드하기
				 */
				function loadProductList(){
					if($scope.PROD_QUE.length == 0){ return; }
					if($scope.isLoadingProd){ return; }

					$scope.isLoadingProd = true;
					var param = $scope.PROD_QUE.shift();
					
					$http.get(PROD_URL, {params:param})
						.success(prodListSuccess)
						.error(prodListError);
				};
				
				/**
				 * 상품리스트 로드 실패
				 */
				function prodListError(data, status, headers, config){
					if(data && data.result && data.result.response_msg && data.result.response_msg != ""){
						console.warn(data.err_msg);
					}else{
						console.warn("상품 데이터 전송 에러");
					}
					
					$scope.isLoadingProd = false;
					loadProductList();
				};
				
				/**
				 * 상품리스트 로드 성공
				 */
				function prodListSuccess(data, status, headers, config){
					if(data == undefined || data.result == undefined || data.result.response_code != "00000" || data.prdLst == undefined){
						// error
						prodListError(data);
					}else{
						// success
						var q = config.params;
						var r = data.prdLst;
						
						var prod = $scope.PRODUCT_MAP[q.gr_tk_id];
						if(prod != undefined && r.items != undefined){
							var items = [].concat(r.items);
							
							// 품절 제거 상품번호 재설정
							var arr = [];
							var len = r.items.length;
							for(var i=0; i<len; i++){
								arr.push(r.items[i].goodsNo);
							}
							
							if(arr.length > 0){
								prod.goods_no = arr;
								prod.talk.goods_no = arr;
							}else{
								// 모두 품절
								var talk = prod.talk;
								talk.isPrd = false;
								talk.goods_no = [];
								talk.text = "힝... 추천해드린 상품이 모두 품절됐어요...T.T";
								
								delete $scope.PRODUCT_MAP[q.gr_tk_id];
							}
							
							prod.data = items.splice(0, $scope.PROD_GROUP_SIZE);
							prod.goods_data = items;
						}
						
						$scope.isLoadingProd = false;
						loadProductList();
					}
				};
				
				function checkProductToLoad(){
					var prod = angular.element(".tr_talk.tr_prod:not(.pord_load)");
					if(prod.length == 0){ return; }
					
					var div, dif, gtid, talk;
					var $win = angular.element($window);
					var WH = $win.height();
					var ST = $win.scrollTop();
					prod.each(function(idx, itm){
						div = angular.element(itm);
						dif = Math.abs(div.offset().top - ST);
						if(dif < WH * 2){
							gtid = div.data("gr_tk_id");
							talk = $scope.PROD_BUFFER[gtid];
							if(talk != undefined){
								processProductList(talk);
								delete $scope.PROD_BUFFER[gtid];
							}
						}
					});
				}
				
				
				
				/**
				 * 큐에 추가
				 * @param {Object} param - 큐에 추가할 파라메터 오브젝트
				 * @param {Object} [data] - 큐에 연결된 로컬 데이터
				 */
				function addToQue(param, data){
					param.member_no = MBRNO;
					param.member_nm = MBRNM;
					
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
					if($scope.isLoadingData){ return; }
					
					var que = $scope.CHAT_QUE.shift();
					$scope.currentChatQue = que;
					
					switch(que.param.command){
					case "sendTalk":
						$scope.userInputText = que.param.text;
						break;
					case "selectOption":
						if(que.param.option_value_han != undefined){
							$scope.userInputText = que.param.option_value_han;
						}
						break;
					// no default
					}
					
					switch(que.param.command){
					case "getGroups":
					case "getTalks":
						// do nothing
						break;
					default:
						showWaiting();
					}

					$scope.isLoadingData = true;
					$http.get(CHAT_URL, {params:que.param})
						.success(callChatBotSuccess)
						.error(callChatBotError);
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
					hideWaiting();
					$scope.userInputText = "";
					$scope.isLoadingData = false;
					
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
					}else{
						// success
						var q = config.params; // 전송한 파람 오브젝트
						var r = data.data; // 리턴된 JSON 데이터
						
						switch(q.command){
						
						case "getGroups":
							processGroups(r);
							break;
							
						case "getTalks":
							processTalks(r, true);
							break;
						
						case "startGroup":
							processTalks(r);
							break;
							
						case "sendTalk":
							processTalks(r);
							processTalkOptions(r);
							break;
						
						case "addWish":
							processTalks(r);
							$scope.currentChatQue.data.wishAdded = true;
							console.warn($scope.currentChatQue.data)
							////////////////////////////////////////////////////////////
							////////////////////////////////////////////////////////////
							////////////////////////////////////////////////////////////
							////////////////////////////////////////////////////////////
							////////////////////////////////////////////////////////////
							////////////////////////////////////////////////////////////
							break;
							
						case "addCart":
							processTalks(r);
							processCartOptions(r);
							break;
							
						case "selectOption":
							processTalks(r);
							processTalkOptions(r);
							break;
						
						// no default
						}
					}
					
					hideWaiting();
					$scope.userInputText = "";
					$scope.isLoadingData = false;

					// 다음 큐 실행
					callChatBot();
				};
				
				
				/**
				 * 그룹 더 불러오기
				 */
				function loadMoreGroups(){
					var n = 0;
					var grp;
					var len = $scope.GROUPS.length;
					for(i=len-1; i>=0; i--){
						grp = $scope.GROUPS[i];
						if(grp.errorCount >= 3){ continue; }
						
						if(grp.count == 0){
							addToQue({
								"command"	: "getTalks",
								"group_id"	: grp.group_id
							});
							
							n++;
							if(n >= TALK_GROUP_SIZE){
								break;
							}
						}
					}
				};
				
				/**
				 * 그룹 리스트 처리
				 */
				function processGroups(data){
					if(data == undefined || data.group_list == undefined){
						$scope.talkRecomDelegate('newRecomTalk', false);
						return;
					}
					
					// 로컬-서버 시간차 계산
					var svtime = $scope.getDateTime(data.time);
					var lctime = $scope.getDateTime();
					$scope.timeDifference = svtime - lctime;

					var GMAP = $scope.GROUP_MAP;
					var GRPS = $scope.GROUPS;
					
					var n = 0;
					var grp, gid;
					var list = data.group_list;
					var len = list.length;
					
					if(len == 0){
						// 그룹이 없으면 새추천 시작
						$scope.GROUP_MAP = {};
						$scope.GROUPS.length = 0;
						
						$scope.talkRecomDelegate('newRecomTalk', false);
						return;
					}
					
					// 첫 그룹보다 이전 그룹 삭제하기
					var first_id = list[0].group_id;
					var NEW_GRPS = [];
					GRPS.forEach(function(itm, idx){
						if(itm.group_id < first_id){
							// obsolete
							delete GMAP[itm.group_id];
							
						}else{
							// current
							NEW_GRPS.push(itm);
						}
					});
					$scope.GROUPS = NEW_GRPS;
					
					// 그룹목록에 없는 그룹은 삭제
					/*var gid_arr = [];
					list.forEach(function(itm, idx){
						gid_arr.push(itm.group_id);
					})
					var NEW_GRPS = [];
					GRPS.forEach(function(itm, idx){
						if(gid_arr.indexOf(itm.group_id) >= 0){
							// exist
							NEW_GRPS.push(itm);
						}else{
							// no exist
							delete GMAP[itm.group_id];
						}
					});
					$scope.GROUPS = NEW_GRPS;*/
					
					for(var i=len-1; i>=0; i--){
						grp = list[i];
						gid = getExistingGroup(grp);
						gid.date = grp.date;
						
						n++;
						if(n <= TALK_GROUP_SIZE && grp.count != gid.count){
							// count changed
							addToQue({
								"command"	: "getTalks",
								"group_id"	: grp.group_id
							});
						}
					}
					
					$scope.GROUPS.sort(sortByDate);
					
					try{
						// 일정시간 이상이면 새추천 시작
						var now = $scope.getDateTime();
						var gtm = $scope.getDateTime(GRPS[GRPS.length - 1].date);
						var dif = now - gtm;
						if((dif / 1000 / 60) > 60){
							/*var str = '';
							str += "----- 5분 이상 지나면 새추천 시작";
							str += "\n시간보정치 : " + $scope.getDateTimeString();
							str += "\n마지막그룹 : " + GRPS[GRPS.length - 1].date;
							window.alert(str);*/
							$scope.talkRecomDelegate("newRecomTalk", false);
						}
					}catch(e){}
				};
				
				/**
				 * 그룹 구하기
				 * @param {Object} group - 그룹 오브젝트
				 */
				function getExistingGroup(group){
					var id = group.group_id;
					var GMAP = $scope.GROUP_MAP;
					var GRPS = $scope.GROUPS;
					
					// search by id
					var grp = GMAP[id];
					if(grp != undefined){ return grp; }
					
					// search in array
					var len = GRPS.length;
					for(var i=0; i<len; i++){
						grp = GRPS[i];
						if(grp.group_id == id){
							GMAP[id] = grp;
							return grp;
							break;
						}
					}
					
					// add new group
					var g = angular.copy(group);
					g.errorCount = 0;
					g.count = 0;
					g.section_list = [];
					GRPS.push(g);
					GMAP[id] = g;
					return g;
				};
				
				function processTalkBuffer(){
					if($scope.TALK_BUFFER.length == 0){ return; }
					
					
					var GMAP = $scope.GROUP_MAP;
					var GRPS = $scope.GROUPS;
					
					var key, grp, tk, gid, tid;
					//var list = data.talk_list;
					//var len = list.length;

					tk = $scope.TALK_BUFFER.shift();
					var s, slen, sect, sects, g, glen, garr, exist, x, xlen, arr;
					//for(var i=0; i<len; i++){
						//tk = list[i];
						if(tk == undefined || tk.group_id == undefined){ return; }
						
						tid = tk.talk_id;
						gid = tk.group_id;
						grp = GMAP[gid];
						
						//if(data.local != "Y"){// 로컬 대화가 아닌 경우만
							// 그룹에 마지막 대화ID 저장하여, 이전 대화는 추가하지 않음
							if(grp != undefined){
								if(grp.last_talk_id == undefined){
									grp.last_talk_id = -1;
								}
								
								if(tk.talk_id <= grp.last_talk_id){
									return;
								}
								grp.last_talk_id = tk.talk_id;
							}
						//}
						
						if(tk.date == undefined || tk.date == ""){
							tk.date = $scope.getDateTimeString();
						}
						
						tk.gr_tk_id = gid + "_" + tid;
						if(tk.auth == "C"){ tk.auth = "A"; }
						
						sect = getSection(tk);
						if(sect == undefined){ return; }
						if(sect.list == undefined){
							sect.list = [];
						}
						
						sect.list.push(tk);
					//}
					
					if(gid != undefined){
						refineTalks(gid);
					}
					
					$scope.scrollToBottom();
					
					saveLocalStorage();
				};
				
				/**
				 * 대확 목록 처리
				 * @param {Object} data - 대화 목록 오브젝트
				 * @param {Boolean} nointerval - 인터벌 없이 즉시 처리
				 */
				function processTalks(data, nointerval){
					if(data == undefined || data.talk_list == undefined){ return; }
					
					if(nointerval === true){
						// 즉시 처리
						processTalksInterval(data);
						
						// 대화 목록 모두 로드한 뒤에 스크롤 발생 - 가까운 상품 불러오기
						var pr;
						var cnt = 0;
						var len = $scope.CHAT_QUE.length;
						for(var i=0; i<len; i++){
							pr = $scope.CHAT_QUE[i].param;
							if(pr.command == "getTalks"){
								cnt++;
							}
						}
						if(cnt == 0){
							$timeout(windowScrollListener, 500);
						}
						
						saveLocalStorage();
						
					}else{
						// 인터벌로 처리
						var list = data.talk_list;
						if(list.length > 0){
							$scope.TALK_BUFFER = $scope.TALK_BUFFER.concat(list);
							processTalkBuffer();
						}
					}
				};
				
				/**
				 * 대화 리스트 인터벌 없이 즉시 처리
				 * @param {Object} data - 대화 목록 오브젝트
				 */
				function processTalksInterval(data){
					if(data == undefined || data.talk_list == undefined){ return; }
					
					var GMAP = $scope.GROUP_MAP;
					var GRPS = $scope.GROUPS;
					
					var key, grp, tk, gid, tid;
					var list = data.talk_list;
					var len = list.length;
					
					var s, slen, sect, sects, g, glen, garr, exist, x, xlen, arr;
					for(var i=0; i<len; i++){
						tk = list[i];
						if(tk == undefined || tk.group_id == undefined){ continue; }
						
						tid = tk.talk_id;
						gid = tk.group_id;
						grp = GMAP[gid];
						
						if(data.local != "Y"){// 로컬 대화가 아닌 경우만
							// 그룹에 마지막 대화ID 저장하여, 이전 대화는 추가하지 않음
							if(grp != undefined){
								if(grp.last_talk_id == undefined){
									grp.last_talk_id = -1;
								}
								
								if(tk.talk_id <= grp.last_talk_id){
									continue;
								}
								grp.last_talk_id = tk.talk_id;
							}
						}
						
						if(tk.date == undefined || tk.date == ""){
							tk.date = $scope.getDateTimeString();
						}
						
						tk.gr_tk_id = gid + "_" + tid;
						if(tk.auth == "C"){ tk.auth = "A"; }
						
						sect = getSection(tk);
						if(sect == undefined){ continue; }
						if(sect.list == undefined){
							sect.list = [];
						}
						
						sect.list.push(tk);
						
						// if talk is exist, do not add to list
						/*exist = false;
						xlen = sect.list.length;
						for(x=0; x < xlen; x++){
							if(sect.list[x].talk_id == tk.talk_id){
								exist = true;
								break;
							}
						}
						if(!exist){
							sect.list.push(tk);
						}*/
					}
					
					if(gid != undefined){
						refineTalks(gid);
					}
					
					$scope.scrollToBottom();
				};
				
				/**
				 * 대화 리스트 정제
				 * @param {String} gid - 대화 리스트 가공할 그룹 ID
				 */
				function refineTalks(gid){
					var group = $scope.GROUP_MAP[gid];
					if(group == undefined){ return; }
					
					var sect;
					var i, k, len, klen;
					var t, p, c, f, hasProfile;
					var arr;
					var cnt = 0;
					len = group.section_list.length;
					for(i=0; i<len; i++){
						sect = group.section_list[i];
						klen = sect.list.length;
						cnt += klen;
						p = {};
						hasProfile = false;
						
						for(k=0; k<klen; k++){
							t = sect.list[k];
							t.isImg = t.img_url != undefined && t.img_url.length > 0;
							t.isPrd = t.goods_no != undefined && angular.isArray(t.goods_no) && t.goods_no.length > 0;
							
							c = (p.auth != t.auth);
							if(c){
								hasProfile = false;
							}
							
							// 첫 대화에 프로필 표시
							f = false;
							if(hasProfile || t.isImg || t.isPrd){
							}else{
								f = true;
								hasProfile = true;
							}
							t.first = f;
							
							// 마지막 대화에 시간 표시
							p.last = c;
							t.last = k==klen-1;
							
							p = t;
							
							// 상품 리스트 매핑
							//processProductList(t);
							$scope.PROD_BUFFER[t.gr_tk_id] = t;
						}
					}
					
					group.count = cnt;
					
					updateGroupDate();
				};
				
				
				function updateGroupDate(){
					var GRPS = $scope.GROUPS;
					var len = GRPS.length;
					var pd = "";
					var g, d;
					for(var i=0; i<len; i++){
						g = GRPS[i];
						d = g.date.substr(0, 8);
						g.first = (pd != d);
						pd = d;
					}
				};
				
				/**
				 * 섹션 리스트 구하기
				 * @param {Object} talk - 섹션 데이터를 구할 대화 오브젝트
				 */
				function getSection(talk){
					var GMAP = $scope.GROUP_MAP;
					if(talk.date == undefined){ return; }
					var key = talk.auth + talk.date.substr(0, 12);
					var group = GMAP[talk.group_id];
					if(group == undefined){
						// 그룹이 없으면 새로 생성
						group = getExistingGroup({
							"date"		: talk.date,
							"group_id"	: talk.group_id,
							"count"		: 0
						});
					}
					
					var list = group.section_list;
					var len = list.length;
					var sect;
					
					if(len > 0){
						sect = list[len - 1];
						if(sect.key == key){
							return sect;
						}
					}
					/*for(var i=0; i<len; i++){
						sect = list[i];
						if(sect.key == key){
							return sect;
							break;
						}
					}*/
					
					// 섹션이 없으면 새로 생성
					sect = {
						"key"	: key,
						"list"	: []
					};
					list.push(sect);
					return sect;
				};
				
				
				/**
				 * 그룹/대화 날자순 정렬
				 */
				function sortByDate(a, b){
					var d1 = a.group_id;//a.date;
					var d2 = b.group_id;//b.date;
					if(d1 < d2){
						return -1;
					}else if(d1 > d2){
						return 1;
					}

					return 0;
				};
				
				
				/**
				 * 상품 그룹 매핑
				 * @param {Object} t - 대화 오브젝트
				 */
				function processProductList(t){
					/*if(t.prodChecked == undefined){
						t.prodChecked = false;
					}*/
					if(t.isPrd && !t.prodChecked){
						t.prodChecked = true;
						var prod = {
							"goods_no"	: t.goods_no,
							"goods_data"	: t.goods_data,
							//"groups"	: [],
							//"group_cnt"	: Math.ceil(t.goods_no.length / 5),
							"talk_id"	: t.talk_id,
							"group_id"	: t.group_id,
							"gr_tk_id"	: t.gr_tk_id,
							"talk"		: t
						};
						$scope.PRODUCT_MAP[t.gr_tk_id] = prod;
						initProductList(prod);
					}
				};
				
				
				/**
				 * 임시 옵션 오브젝트 제거
				 * @param {String} [flag] - 제거하지 않을 임시 옵션 오브젝트 구분
				 */
				function clearOptions(flag){
					$scope.TEMP_OPTION = null;
					if(flag != "cart"){
						$scope.currentCartOption = null;
					}
					if(flag != "talk"){
						$scope.currentTalkOption = null;
					}
				};
				
				
				/**
				 * 대화 옵션 처리
				 * @param {Object} data - 대화 목록 오브젝트
				 */
				function processTalkOptions(data){
					if(data == undefined || data.talk_list == undefined){ return; }
					
					var tk, opt, ctg, i, o;
					var list = data.talk_list;
					var len = list.length;
					for(i=0; i<len; i++){
						tk = list[i];
						ctg = tk.subCtgLst;
						opt = tk.option_list;
						if(ctg != undefined || opt != undefined){
							break;
						}
					}
					
					if(ctg != undefined && ctg.items != undefined && ctg.items.length > 0){
						// if category exists
						prepareTalkCategory(ctg, tk);
						
					}else if(opt != undefined && opt.items != undefined && opt.items.length > 0){
						// if option exist, go on
						prepareTalkOption(opt, tk);
					}else{
						// no cate, no option
						$scope.callAppAPI("noOption");
					}
					
				};
				
				/**
				 * 대화 카테고리 처리
				 * @param {Object} ctg - 카테고리 오브젝트
				 * @param {Object} tk - 대화 오브젝트
				 */
				function prepareTalkCategory(ctg, tk){
					if(ctg == undefined || ctg.items == undefined){ return; }
					var len, i, c;//, last;
					
					// 옵션 포멧에 맞게 변형
					len = ctg.items.length;
					for(i=0; i<len; i++){
						c = ctg.items[i];
						c.opt_tval = c.ctgName;
						/*if(c.mall != undefined && c.mall != ""){
							c.opt_tval += " (" + c.mall + ")";
						}*/
						c.opt_tval_cd = c.ctgNo;
					}
					
					// 건너뛰기
					var skipOption = null;
					var ol = tk.option_list;
					if(ol != undefined && ol.items != undefined && ol.items.length > 0){
						skipOption = [].concat(ol.items);
					}
					
					clearOptions("talk");
					var request_cnt = tk.request_cnt;
					if(request_cnt == undefined || request_cnt == ""){
						request_cnt = 0;
					}
					$scope.currentOptionPre = {
						"pre_request_url"	: tk.pre_request_url,
						"pre_parameter" 	: tk.pre_parameter,
						"request_cnt"		: request_cnt
					}
					$scope.currentTalkOption = {
						"options"	: [
							{
								"opt_title" : "subCtgLst",
								"opt_value" : ctg.items
							}
						]
					}
					if(skipOption != null){
						$scope.currentTalkOption.skip = skipOption;
					}

					askTalkOption();
				}
				
				/**
				 * 대화 옵션 처리
				 * @param {Object} opt - 옵션 오브젝트
				 * @param {Object} tk - 대화 오브젝트
				 */
				function prepareTalkOption(opt, tk){
					if(opt == undefined || opt.items == undefined){ return; }
					
					var len, i, o;//, last;
					var skipOption = null;
					len = opt.items.length;
					for(i=0; i<len; i++){
						o = opt.items[i];
						if(o.opt_title == "reatedKeyword"){
							// 연관검색어 처리
							if(o.opt_value != undefined && o.opt_value.length > 0){
								// 연관검색어만 표시
								opt.items.splice(i, 1);
								skipOption = [].concat(opt.items);
								opt.items = [o];
							}else{
								// 연관검색어 제거
								opt.items.splice(i, 1);
							}
							break;
						}
					}
					
					clearOptions("talk");
					$scope.currentTalkOption = {
						"options"	: opt.items
					}
					if(skipOption != null){
						$scope.currentTalkOption.skip = skipOption;
					}
					var request_cnt = tk.request_cnt;
					if(request_cnt == undefined || request_cnt == ""){
						request_cnt = 0;
					}
					$scope.currentOptionPre = {
						"pre_request_url"	: tk.pre_request_url,
						"pre_parameter" 	: tk.pre_parameter,
						"request_cnt"		: request_cnt
					}
					
					askTalkOption();
				}
				
				/**
				 * 대화 옵션 앱에 물어보기
				 */
				function askTalkOption(){
					var copt = $scope.currentTalkOption;
					if(copt == undefined || copt.options == undefined || copt.options.length == 0){
						return;
					}
					
					var i, v, len, o;
					var opt = {};
					if(copt.options.length == 1 && (copt.showsub || copt.options[0].opt_title == "subCtgLst" || copt.options[0].opt_title == "reatedKeyword")){
						opt = copt.options[0];
						
						var isdeliver = (opt.opt_title == "deliver");
						if(opt.opt_value != undefined){
							len = opt.opt_value.length;
							for(i=0; i<len; i++){
								o = opt.opt_value[i];
								if(isdeliver){
									o.opt_tval_cd = o.opt_tval;
								}
								o.opt_tval = mapOptionTitle(o.opt_tval);
							}
						}
						
					}else{
						opt = {
							"opt_title" : "옵션선택",
							"opt_value" : []
						};
						
						len = copt.options.length;
						for(i=0; i<len; i++){
							o = copt.options[i];
							opt.opt_value.push({
								"opt_tval" : mapOptionTitle(o.opt_title),
								"opt_tval_cd" : o.opt_title
							});
						}
					}
					
					if(opt.opt_value.length == 0){
						// no option
						return;
					}
					
					
					appendOptionSRP(opt.opt_value);
					
					var isColor = opt.opt_title == "colors";
					var val = opt.opt_value;
					len = val.length;
					var arr = [];
					for(i=0; i<len; i++){
						v = val[i];
						if(v.opt_tval == undefined){ continue; }
						if(isColor){
							arr.push(v.opt_tval + SYMBOL_PIPE + COLOR_CODE_MAP[v.opt_tval] + SYMBOL_PIPE + 1);
						}else{
							arr.push(v.opt_tval + SYMBOL_PIPE + v.opt_tval_cd + SYMBOL_PIPE + 1);
						}
					}
					
					var param = {
						"title"		: opt.opt_title,
						"option"	: arr.join(SYMBOL_SEMICOLON)
					};
					//param.option = param.option.replace(new RegExp("&", "g"), "%26");
					
					$scope.callAppAPI("selectOption", param);
				};
				
				/**
				 * 옵션에 건너뛰기, 새추천, 이전으로 추가
				 * @param {Array} ov - 옵션밸류 배열
				 */
				function appendOptionSRP(ov){
					var copt = $scope.currentTalkOption;
					
					var skip = false;
					var prev = false;
					if(copt.skip != undefined){
						skip = true;
					}
					if(copt.previous != undefined){
						prev = true;
					}
					
					var addSkip = true;
					var addPrev = true;
					var addReco = true;
					
					var opt;
					var len = ov.length;
					for(var i=len-1; i>=0; i--){
						opt = ov[i];
						// skip
						if(ov[i].opt_tval == OPT_SKIP){
							addSkip = false;
							if(!skip){
								ov.splice(i, 1);
							}
						}
						// previous
						if(ov[i].opt_tval == OPT_PREV){
							addPrev = false;
							if(!prev){
								ov.splice(i, 1);
							}
						}
						// new recommend
						if(ov[i].opt_tval == OPT_NEW_RECO){
							addReco = false;
						}
					}
					
					if(skip && addSkip){
						ov.push({
							"opt_tval"		: OPT_SKIP,
							"opt_tval_cd"	: OPT_SKIP
						});
					}
					if(prev && addReco){
						ov.push({
							"opt_tval"		: OPT_PREV,
							"opt_tval_cd"	: OPT_PREV
						});
					}
					if(addReco){
						ov.push({
							"opt_tval"		: OPT_NEW_RECO,
							"opt_tval_cd"	: OPT_NEW_RECO
						});
					}
				};
				
				
				/**
				 * 장바구니 옵션 처리
				 */
				function processCartOptions(data){
					if(data == undefined || data.talk_list == undefined){ return; }
					
					var tk, opt, cmp;
					var list = data.talk_list;
					var len = list.length;
					for(var i=0; i<len; i++){
						tk = list[i];
						opt = tk.option_list;
						cmp = tk.complex_option_list;
						if(opt != undefined && cmp != undefined){
							break;
						}
					}
					
					if(opt == undefined || opt.items == undefined || cmp == undefined || cmp.items == undefined){
						// no cart option
						$scope.callAppAPI("noOption");
						return;
					}

					clearOptions("cart");
					$scope.currentCartOption = {
						"product"	: $scope.currentChatQue.data,
						"options"	: opt.items,
						"complex"	: cmp.items,
						"choosed"	: []
					};
					
					askCartOption();
				};
				
				/**
				 * 장바구니 옵션 앱에 물어보기
				 */
				function askCartOption(){
					var copt = $scope.currentCartOption;
					if(copt == undefined){ return; }
					
					var cho = copt.choosed.join(SYMBOL_X);
					if(cho != ""){ cho += SYMBOL_X; }
					var idx = copt.choosed.length;
					var opt = copt.options[idx];
					var val = opt.opt_value;
					var len = val.length;
					var i, v;
					var arr = [];
					for(i=0; i<len; i++){
						v = val[i];
						arr.push(v.opt_tval + SYMBOL_PIPE + v.opt_tval_cd + SYMBOL_PIPE + getOptionAvail(cho + v.opt_tval_cd));
					}
					arr.push("담기 취소" + SYMBOL_PIPE + "담기 취소" + SYMBOL_PIPE + 1)
					
					var param = {
						"title"		: opt.opt_title,
						"option"	: arr.join(SYMBOL_SEMICOLON)
					};
					//param.option = param.option.replace(new RegExp("&", "g"), "%26");
					
					$scope.callAppAPI("selectOption", param);
				};
				
				/**
				 * 앱에서 옵션 선택
				 * @param {String} title - 옵션명
				 * @param {String} optcd - 옵션값
				 */
				function optionSelected(title, optcd){
					if($scope.currentTalkOption != null){
						// 대화 옵션 선택
						talkOptionSelected(title, optcd);
						
					}else if($scope.currentCartOption != null){
						// 장바구니 옵션 선택
						cartOptionSelected(title, optcd);
					}
				};
				
				/**
				 * 대화 옵션 선택됨
				 * @param {String} title - 옵션명
				 * @param {String} optcd - 옵션값
				 */
				function talkOptionSelected(title, optcd){
					var cur = $scope.currentTalkOption.options;
					var i, len, opt;
					
					// 새 추천
					if(optcd == OPT_NEW_RECO){
						//$scope.callAppAPI("resetInput");
						$scope.talkRecomDelegate('newRecomTalk');
						return;
					}
					
					// 건너뛰기
					if(optcd == OPT_SKIP && $scope.currentTalkOption.skip != undefined){
						$scope.currentTalkOption = {
							"options" : $scope.currentTalkOption.skip,
							"previous" : cur
						}
						
						addNewTextTalk( [{"auth":"U", "text":OPT_SKIP}] );
						sendTclick("skip");
						askTalkOption();
						return;
					}
					
					// 이전 돌아가기
					var prev = $scope.currentTalkOption.previous;
					if(optcd == OPT_PREV && prev != undefined){
						$scope.currentTalkOption = {
							"options" : prev
						}
						
						addNewTextTalk( [{"auth":"U", "text":OPT_PREV}] );
						
						try{
							switch(prev[0].opt_title){
							case "reatedKeyword":
							case "subCtgLst":
								$scope.currentTalkOption.skip = cur;
								sendTclick("goback");
								askTalkOption();
								return;
								break;
							}
						}catch(e){}
						
						sendTclick("goback");
						askTalkOption();
						return;
					}
					
					// 카테고리 탐색
					var cate, c;
					if(title == "subCtgLst"){
						try{
							opt = cur[0].opt_value;
							len = opt.length;
							for(i=0; i<len; i++){
								c = opt[i];
								if(c.ctgNo == optcd){
									cate = c;
									break;
								}
							}
						}catch(e){ return; }
						
						if(cate != undefined){
							var param = {
								"command"		: "selectOption",
								"option_title"	: title,
								"mGrpNo"		: cate.mGrpNo,
								"ctgNo"			: cate.ctgNo,
								"dsCtgDepth"	: cate.dsCtgDepth,
								"option_value_han" : cate.ctgName
							}
							if($scope.currentOptionPre != undefined && $scope.currentOptionPre.pre_request_url != undefined && $scope.currentOptionPre.pre_parameter != undefined){
								param.pre_request_url = $scope.currentOptionPre.pre_request_url;
								param.pre_parameter = $scope.currentOptionPre.pre_parameter;
								param.request_cnt = $scope.currentOptionPre.request_cnt;
							}
							addToQue(param);
							$scope.TEMP_OPTION = null;
							sendTclick("cate", optcd);
						}
						return;
					}
					
					// 서브 옵션있으면 서브 다시 선택
					len = cur.length;
					for(i=0; i<len; i++){
						opt = cur[i];
						if(opt.opt_title == optcd && opt.opt_value.length > 0){
							$scope.currentTalkOption = {
								"options" : [ opt ],
								"showsub" : true,
								"previous" : cur
							};
							if(title == "옵션선택"){
								switch(optcd){
								case "price":
									addNewTextTalk([
										 {"auth" : "U", "text" : mapOptionTitle(optcd)},
										 {"auth" : "A", "text" : MBRNM + "님, 생각해둔 가격대는 있어요?"}
									]); 
									break;
								case "colors":
									addNewTextTalk([
										 {"auth" : "U", "text" : mapOptionTitle(optcd)},
										 {"auth" : "A", "text" : MBRNM + "님, 원하시는 색상을 선택해주세요."}
									]);
									break;
								case "smpDept":
									addNewTextTalk([
										 {"auth" : "U", "text" : mapOptionTitle(optcd)},
										 {"auth" : "A", "text" : "상품을 픽업할 지점을 선택해주세요."}
									]);
									break;
								// no default
								}
							}
							askTalkOption();
							return;
						}
					}
					

					var opthan = optcd;
					len = cur.length;
					var klen, k;
					for(i=0; i<len; i++){
						opt = cur[i];
						if(opt.opt_title == title && opt.opt_value != undefined){
							klen = opt.opt_value.length;
							for(k=0; k<klen; k++){
								if(opt.opt_value[k].opt_tval_cd == optcd){
									opthan = opt.opt_value[k].opt_tval;
									break;
								}
							}
							break;
						}
					}
					
					if(title == "colors"){
						optcd = COLOR_CODE_MAP[optcd];
						opthan = "선택완료";
					}else if(title == "옵션선택"){
						title = optcd;
						optcd = "1";
						opthan = mapOptionTitle(title);
					}

					var param = {
						"command"	: "selectOption",
						"option_title"	: title,
						"option_value"	: optcd,
						"option_value_han" : opthan
					}
					if($scope.currentOptionPre != undefined && $scope.currentOptionPre.pre_request_url != undefined && $scope.currentOptionPre.pre_parameter != undefined){
						param.pre_request_url = $scope.currentOptionPre.pre_request_url;
						param.pre_parameter = $scope.currentOptionPre.pre_parameter;
						param.request_cnt = $scope.currentOptionPre.request_cnt;
					}
					addToQue(param);
					$scope.TEMP_OPTION = null;
				};

				/**
				 * 장바구니 옵션 선택됨
				 * @param {String} title - 옵션명
				 * @param {String} optcd - 옵션값
				 */
				function cartOptionSelected(title, optcd){
					if(optcd == "담기 취소"){
						$scope.addToCart({goodsNo:0, goodsCmpsCd:0}, 0);
						$scope.TEMP_OPTION = null;
						return;
					}
					
					var copt = $scope.currentCartOption;
					copt.choosed.push(optcd);
					
					if(copt.choosed.length < copt.options.length){
						// select another
						askCartOption();
					}else{
						// select done
						var key = copt.choosed.join(SYMBOL_X);
						var comp = copt.complex;
						var len = comp.length;
						var opt;
						for(var i=0; i<len; i++){
							opt = comp[i];
							if(opt.opt_val_cd == key){
								$scope.addToCart($scope.currentCartOption.product, opt.item_no);
								break;
							}
						}
						
						$scope.TEMP_OPTION = null;
						//clearOptions();
					}
				};
				
				/**
				 * 옵션 유효성 구하기
				 * @param {String} key - 옵션 조회 키값
				 */
				function getOptionAvail(key){
					var copt = $scope.currentCartOption;
					var comp = copt.complex;
					var len = comp.length;
					var opt;
					for(var i=0; i<len; i++){
						opt = comp[i];
						if(opt.opt_val_cd.indexOf(key) == 0){
							if(opt.inv_qty > 0){
								return 1;
								break;
							}
						}
					}
					
					return 0;
				};
				
				
				/**
				 * 티클릭 전송
				 * @param {String} cmd - 티클릭 구분자
				 * @param {String} [opt1] - 추가 구분자
				 * @param {String} [opt2]  -추가 구분자
				 */
				function sendTclick(cmd, opt1, opt2){
					var tc = $scope.tClickBase + "Samanda_Clk_";
					switch(cmd){
					case "reason":
						tc += "Lnk_goods_recommend";
						break;
					case "inform":
						tc += "Lnk_information";
						break;
					case "profile":
						tc += "Lnk_profile";
						break;
					case "showmore":
						tc += "Lnk_goods_showmore";
						break;
					case "addcart":
						tc += "Lnk_goods_cart";
						break;
					case "addwish":
						tc += "Lnk_goods_wish";
						break;
					case "newRecomTalk":
						tc += "Lnk_newreco";
						break;
					case "reatedKeyword":
						tc += "btn_searchworld";
						break;
					case "colors":
						tc += "btn_color";
						break;
					case "price":
						tc += "btn_price";
						break;
					case "smpDept":
						tc += "btn_deppick";
						break;
					case "smpSeven":
						tc += "btn_sevenpick";
						break;
					case "quick":
						tc += "btn_quick";
						break;
					case "tdar":
						tc += "btn_tdar";
						break;
					case "freediv":
						tc += "btn_freeship";
						break;
					case "noint":
						tc += "btn_nointerest";
						break;
					case "point":
						tc += "btn_point";
						break;
					case "freepack":
						tc += "btn_freegiftwrap";
						break;
					case "goback":
						tc += "btn_gotoback";
						break;
					case "skip":
						tc += "btn_skip";
						break;
					case "cate":
						tc += "btn_cate_" + opt1;
						break;
					case "selectOption":
						if(opt1 == "reatedKeyword"){
							sendTclick(opt1);
						}else{
							sendTclick(opt2);
						}
						return;
						break;
					default:
						// no tclick
						return;
					}
					
					$scope.sendTclick(tc);
				};
				
				/**
				 * 로컬 저장 후 URL 이동하기
				 */
				function gotoURL(flag, url, obj){
					/* 20171019 IOS exitpage 수정 */
					if($scope.appObj.isApp && $scope.appObj.isIOS && flag != "P"){
						$scope.callAppAPI("exitpage");
					}
					
					$timeout(function(){
						switch(flag){
						case "S":
							// 서비스이동
							$scope.gotoService(url, obj);
							break;
						case "P":
							// 상품상세
							$scope.productView(url, "", "", obj);
							break;
							// no default
						}
					}, 100);
				};
				

				/******************************************* APP INTERFACE *******************************************/
				
				/**
				 * 앱에서 웹호출 인터페이스
				 */
				$scope.talkRecomDelegate = function(){
					if(arguments.length == 0){ return; }
					
					// convert to array
					var arr = [].slice.call(arguments);
					var cmd = arr.shift();
					var param = {
						"command"	: cmd
					};
					
					switch(cmd){
					case "newRecomTalk":
					case "newRecomStyle":
					case "sendTalk":
					case "selectOption":
					case "addCart":
					case "addWish":
						$scope.isAutoScrollEnabled = true;
						break;
					}
					
					switch(cmd){
					
					case "newRecomTalk":// 새 대화추천 시작
						if(arr[0] !== false){
							$scope.callAppAPI("resetInput");
						}else{
							param.timeout = "Y";
						}
						param.command = "startGroup";
						param.type = "T";
						addToQue(param);
						break;
					
					case "newRecomStyle":// 새 스타일추천 시작
						param.command = "startGroup";
						param.type = "S";
						addToQue(param);
						break;
						
					case "sendTalk":// 메시지 전송
						//$scope.userInputText = arr[0];
						param.text = arr[0];
						param.type = (arr[1] == "S" ? "S" : "T");
						addToQue(param);
						break;
					
					case "selectOption":// 옵션 선택
						optionSelected(arr[0], arr[1]);
						break;
						
					/*case "sendFile":// 파일 전송
						break;*/
						
					case "showCart":// 카트 보기
						//$scope.gotoService("cartLstUrl", {"tclick":$scope.tClickBase + "Samanda_Clk_Lnk_profile_showcart"});
						gotoURL("S", "cartLstUrl", {"tclick":$scope.tClickBase + "Samanda_Clk_Lnk_profile_showcart"});
						break;
						
					case "showWish":// 위시리스트 보기
						//$scope.gotoService("wishLstUrl", {"tclick":$scope.tClickBase + "Samanda_Clk_Lnk_profile_showwish"});
						gotoURL("S", "wishLstUrl", {"tclick":$scope.tClickBase + "Samanda_Clk_Lnk_profile_showwish"});
						break;
					
					case "scrollBy":// 스크롤
						try{
							$("html, body").stop(true);
							$("html, body").animate({ scrollTop: $("body").scrollTop() + arr[0] }, 400);
							//$("window, body").scrollTop( $("window, body").scrollTop() + arr[0] )
						}catch(e){}
						break;
						
					// no default
					}
					
					switch(cmd){
					case "selectOption":
					case "scrollBy":
						// no action
						break;
					default:
						clearOptions();
						break;
					}
					
					sendTclick(cmd, arr[0], arr[1]);
				};
				window.talkRecomDelegate = $scope.talkRecomDelegate;
				
				/**
				 * 앱 호출
				 */
				$scope.callAppAPI = function(command, param){
					var query = "talkrecom://" + command;
					var div = "?";
					var p;
					for(p in param){
						query += div + p + "=" + param[p];
						div = "&";
					}
					//console.log("▷▷▷▷▷ ", query);
					
					/////////////////////// for local test
					switch(command){
					case "selectOption":
						var arr = param.option.split(SYMBOL_SEMICOLON);
						var len = arr.length;
						for(var i=0; i<len; i++){
							arr[i] = arr[i].split(SYMBOL_PIPE);
						}
						$scope.TEMP_OPTION = {
							"title" : param.title,
							"option" : arr
						}
						break;
					// no default
					}
					/////////////////////// for local test
					
					if($scope.appObj.isApp){
						$window.location.href = query;
					}
				}
				
				
				/******************************************* EVENT *******************************************/
				
				/**
				 * 이벤트 바인딩
				 */
				function bindEvents(){
					angular.element($window).bind("touchstart", touchStartListener);
					angular.element($window).bind("scroll", windowScrollListener);
					//angular.element($window).on("unload", saveLocalStorage);
				};
				
				/**
				 * 터치 후 하단 자동스크롤 중지
				 */
				function touchStartListener(e){
					$scope.isAutoScrollEnabled = false;
				};
				
				/**
				 * 스크롤 이벤트
				 */
				function windowScrollListener(e){
					if($scope.isLoadingData){ return; }
					
					checkProductToLoad();
					
					var $win = angular.element($window);
					var $body = angular.element("body")[0];
					var WH = $win.height();
					var BH = $body.scrollHeight;
					var ST = $win.scrollTop();
					var scrollRatio = 4.0;// 윈도우 높이의 4배
					var moreLoadTime = 0;
					
					if(ST < WH * scrollRatio){
						loadMoreGroups();
					}
				};
				
				/**
				 * 언로드 이벤트 - Local Storage에 데이터 저장
				 */
				function saveLocalStorage(){
					if($scope.GROUPS.length == 0){ return; }
					if($scope.DO_NOT_SAVE_LOCAL){ return; }
					
					var len = $scope.GROUPS.length;
					for(var i=0; i<len; i++){
						$scope.GROUPS[i].errorCount = 0;
					}
					
					/*var sl, tl;
					$scope.GROUPS.forEach(function(gr, i){// group list
						sl = gr.section_list;
						if(sl != undefined){
							sl.forEach(function(sc, k){// section list
								tl = sc.list;
								if(tl != undefined){
									tl.forEach(function(tk, m){// talk list
										if(tk.goods_no != undefined && tk.goods_no.length > 0){
											tk.prodChecked = false;
										}
									});// talk list
								}
							});// section list
						}
					});// group list
*/					
					var lcst = {
						"memberno"	: MBRNO,
						"scrollTop" : angular.element($window).scrollTop(),
						"groups"	: $scope.GROUPS
					};
					
					LotteStorage.setLocalStorage("TALK_RECOM_LCST", lcst, "json");
				};

				if ($scope.appObj.isApp) {
					var msg = "말로 쉽고 빠르게<br/>상품추천부터 결제까지!<br/>지금 바로 말로 하는 쇼핑을<br/>경험해 보세요!<br/><br/>지금 업데이트 하시겠어요?";
					
					// Android 4.0.2
					if ($scope.appObj.isAndroid) {
						var tmpUA = navigator.userAgent;
                		var tmpIndex = tmpUA.indexOf('Android');
						var tmpUAAOSVer = Number(tmpUA.substr(tmpIndex+8,3));

						if (tmpUAAOSVer < 4.5) {
							msg = "죄송합니다. 말로 하는 쇼핑은 안드로이드 OS 4.4 이하 버전에서는 이용이 불가합니다.";

							alert(msg);
							
							try {
								appSendBack();
							} catch(e) {
								var linkUrl = LotteCommon.mainUrl + "?" + LotteUtil.getBaseParam();
								$window.location.href = linkUrl;
							}

							return false;
						}
					}

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
					LotteUserService.promiseLoginInfo().finally(function(loginInfo){
						//startOver();
						$timeout(startOver, 500);
					});
				}
				
			}// end of lotteContainer directive
		};
	}]);
    
	
    /**
     * 이미지 로딩 디렉티브
     */
	app.directive('talkRecomImageLoad', ["$timeout", function($timeout){
		return {
			restrict: 'A',
			link: function($scope, element, attrs) {
				function talkRecomImageLoaded(e){
					var img = angular.element(e.currentTarget);
					
					// 최대높이 320 제한
					var h = img.height();
					if(h > 320){
						img.addClass("vertical");
					}
					
					$scope.scrollToBottom();
				};
				/*function talkRecomImageError(){
					//$timeout(function(){ $scope.alert_2016("유효하지 않은 이미지입니다."); }, 1);
				};*/
				
				element.bind("load", talkRecomImageLoaded);
				//element.bind("error", talkRecomImageError);
				
				
			}// end of talkRecomImageLoad directive
		};
	}]);
	
	
	app.directive("talkRecomDateFormat", function(){
		return {
			restrict: "A",
			link: function($scope, element, attrs){
				
				
				/**
				 * 문자열로 날자 구하기
				 * @param {String} time - yyyymmddhhmmss 형식
				 * @return {String} m.dd (w) 형식의 문자열
				 */
				$scope.getTalkDate = function(time){
					var dt = $scope.getDateTime(time);
					var d = dt.getDate();
					return (dt.getMonth() + 1) + "." + (d < 10 ? "0" : "") + d + " (" + $scope.WEEK[dt.getDay()] + ")";
				};
				
				/**
				 * 문자열로 시간 구하기
				 * @param {String} time - yyyymmddhhmmss 형식
				 * @return {String} m.dd (w) 형식의 문자열
				 */
				$scope.getTalkTime = function(time){
					var dt = $scope.getDateTime(time);
					var h = dt.getHours();
					var m = dt.getMinutes();
					return (h < 12 ? "오전 " : "오후 ") + (h % 12) + ":" + (m < 10 ? "0" : "") + m;
				};
				
				
			}// end of talkRecomDateFormat directive
		};
	});

})(window, window.angular);