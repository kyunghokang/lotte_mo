(function(window, angular, undefined) {
	'use strict';

	/**
	 * @ngdoc overview
	 * @name lotteSns
	 * @description
	 * lotte_sns.js<br/>
	 * 공유하기 모듈
	 */
	var snsModule = angular.module('lotteSns', []);

	/**
	 * @ngdoc object
	 * @name lotteSns.controller:smsBoxCtrl
	 * @requires
	 * $scope, $http, LotteCommon
	 * @description
	 * 공유하기 SMS 발송 컨트롤러
	 */
	snsModule.controller('smsBoxCtrl', ['$scope', '$http', 'LotteCommon', function($scope, $http, LotteCommon){

		/**
		 * @ngdoc function
		 * @name smsBoxCtrl.sendSMSData
		 * @description
		 * IOS 팝업창에서 문자 발송하기
		 * @example
		 * $scope.sendSMSData();
		 */
		$scope.sendSMSData = function(){
			var postData = {
				msg:$scope.smsTxt,
				phone_no:$scope.sms_phoneNo
			};
			$http({
				url:LotteCommon.sendEventSms,
				data:$.param(postData),
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(data){
				if(data.indexOf("정상적으로 처리되었습니다") > -1){
					alert("문자가 발송되었습니다.");
				}else{
					alert(data);
				}
				$scope.hideSharePop();
			}).error(function(data){
				console.log('Error Data : 데이터 로딩 에러');
			});
		};

	}]);

	/**
	 * @ngdoc directive
	 * @name lotteSns.directive:shareBox
	 * @description
	 * shareBox directive
	 */
	snsModule.directive('shareBox', ['$window', '$location', 'LotteCommon', 'commInitData', '$http' , '$timeout', function($window, $location, LotteCommon, commInitData, $http, $timeout){
		return {
			templateUrl: '/lotte/resources_dev/sns/share_box.html',
			replace:true,
			link: function($scope, el, attrs) {
				var tmpDate = new Date(),
					tmpDateYear = tmpDate.getFullYear() + "",
					tmpDateMonth = tmpDate.getMonth() + 1 + "",
					tmpDateDate = tmpDate.getDate() + "",
					sum_dt = tmpDateYear + rtnTwoChar(tmpDateMonth) + rtnTwoChar(tmpDateDate);

				
				function rtnTwoChar(str) {
					return (str + "").length > 1 ? str : "0" + str;
				}

				// Recobell Data 수집
				function regBestPord() {
					if (!commInitData.query["goods_no"]) {
						return false;
					}

					//LotteCommon.prdviewRecobellShareData
					$http.get("/product/regBestProd.do", {params:{
						goods_no: commInitData.query["goods_no"],
						sum_dt: sum_dt
					}})
					.success(function(data) {
					})
					.error(function() {
					});
				}

				var doFocus = function () {
					$timeout(function() {
						angular.element(document.querySelector("#sms_phoneNo")).focus();
					});
				};

				/**
				 * @ngdoc function
				 * @name shareBox.function:shareSNS
				 * @description
				 * 공유하기 선택 박스
				 * @example
				 * $scope.shareSNS(type, evtNo);
				 * @param {String} 공유하기 Flag
				 * @param {number} 이벤트 번호
				 */
				$scope.shareSNS = function(type, evtNo) {
					// 상품상세에서 공유하기시 Recobell 공유하기 데이터 수집
					if ($window.location.pathname == "/product/m/product_view.do" || // 운영
						$window.location.pathname == "/product/m/product_view_dev.html") { // 로컬
						regBestPord();
					}

					if($scope.loginInfo.isLogin){
						var regEventUrl = LotteCommon.baseUrl + "/event/regEvent.do?" + $scope.baseParam;
						var saveCloverUrl = LotteCommon.baseUrl + "/event/saveClover.do?" + $scope.baseParam;
						var evt_no = $scope.share_evt_no;
						if(evtNo != undefined && evtNo != "") {
							evt_no = evtNo;
						}
						var params = "evt_no=" + evt_no;

						$http({
							method: 'POST',
							url: regEventUrl,
							data: {
								evt_no: evt_no
							},
							transformRequest: transformJsonToParam,
							headers: {'Content-Type': 'application/x-www-form-urlencoded'}
						})

						$http({
							method: 'POST',
							url: saveCloverUrl,
							data: {
								evt_no: evt_no
							},
							transformRequest: transformJsonToParam,
							headers: {'Content-Type': 'application/x-www-form-urlencoded'}
						})
					}

					if ($scope.appObj.isApp) {
						$scope.sendAppShare(type);
						return false;
					}

					switch(type) {
						case "sms":
							$scope.cnShareUrl = "";
							$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.smsCdn;
							$scope.showSmsBox();
						break;

						case "kakaotalk":
							$scope.cnShareUrl = "";
							$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.talkCdn;
							$scope.sendKakaoTalk();
						break;

						case "kakaostory":
							$scope.cnShareUrl = "";
							$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.stotyCdn;
							$scope.sendKakaoStory();
						break;

						case "facebook":
							$scope.cnShareUrl = "";
							$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.faceCdn;
							$scope.sendFacebook();
						break;

						case "twitter":
							$scope.cnShareUrl = "";
							$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.twitCdn;
							$scope.sendTwitter();
						break;

						case "url_copy":
							$scope.cnShareUrl = "";
							$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.urlCdn;
							$scope.urlCopyClick();

						break;

						default:
						break;
					}
				};

				/**
				 * @ngdoc function
				 * @name shareBox.function:urlCopyClick
				 * @description
				 * URL COPY Flag
				 * @example
				 * $scope.urlCopyClick();
				 */
				$scope.urlCopyClick = function() {
					$scope.sendTclick($scope.tClickBase +'share_Clk_Pop_' + "7");
					$scope.urlCopyFlag = !$scope.urlCopyFlag;
				}

				/**
				 * @ngdoc function
				 * @name shareBox.function:showSmsBox
				 * @description
				 * IOS 문자보내기 박스
				 * @example
				 * $scope.showSmsBox();
				 */
				$scope.showSmsBox = function() {
					$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "4");

					if($scope.appObj.isTablet) {
						if ($scope.sharePopVisible) { //share pop이 열린 상태이면
							$scope.isBeforeShareBox = true;
						} else {
							$scope.sharePopVisible = true;
						}

						$scope.contVisible = false;
						$scope.shareBoxVisible = false;
						$scope.smsBoxVisible = true;
						$scope.sharePopTl = "문자 보내기";
						$scope.smsTxt = "[" + $scope.subTitle + "]\n" + $scope.prdComment + " "+ $scope.cnShareUrl;

						angular.element(document).on('focus', 'input, textarea', function(evt) {
							el[0].style.cssText = '';
						});
					} else if($scope.appObj.isAndroid) { /* tablet */
						if($scope.appObj.isTablet) {
							if ($scope.sharePopVisible) { //share pop이 열린 상태이면
								$scope.isBeforeShareBox = true;
							} else {
								$scope.sharePopVisible = true;
							}

							$scope.contVisible = false;
							$scope.shareBoxVisible = false;
							$scope.smsBoxVisible = true;
							$scope.sharePopTl = "문자 보내기";
							$scope.smsTxt = "[롯데닷컴 이거어때?]" + "\n" + $scope.subTitle + $scope.prdComment + " "+ $scope.cnShareUrl;
						} else {
							var smsData = "[롯데닷컴 이거어때?] " + "\n" + encodeURIComponent($scope.subTitle.replace(/(&)/g, "%26") + "\n" + $scope.prdComment.replace(/(&)/g, "%26") + " " + $scope.cnShareUrl.replace(/(&)/g, "%26"));
//                    		var smsData = encodeURIComponent("[롯데닷컴 이거어때?] \n" + $scope.subTitle + "\n" + $scope.cnShareUrl);
							window.open("sms:?body=" + smsData);
						}
					} else { /* IOS & WEB */
						if ($scope.sharePopVisible) { //share pop이 열린 상태이면
							$scope.isBeforeShareBox = true;
						} else {
							$scope.sharePopVisible = true;
						}

						$scope.contVisible = false;
						$scope.shareBoxVisible = false;
						$scope.smsBoxVisible = true;
						$scope.sharePopTl = "문자 보내기";
						$scope.smsTxt = "[롯데닷컴 이거어때?]" + "\n" + $scope.subTitle + $scope.prdComment + " "+ $scope.cnShareUrl;
						doFocus();
					}
				};

				/**
				 * @ngdoc function
				 * @name shareBox.function:sendAppShare
				 * @description
				 * APP 일경우 공유하기 분기처리
				 * @example
				 * $scope.sendAppShare(type);
				 * @param {string} 공유하기 Flag
				 */
				$scope.sendAppShare = function(type) {
					if(type == "sms") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "4");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.smsCdn;
					}
					if(type == "kakaotalk") {
						if($scope.appObj.isOldApp) {
							$scope.kakaoType = "[롯데닷컴 이거어때?]" + "\n";
						} else {
							$scope.kakaoType = "";
						}
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "1");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.talkCdn;
					}
					if(type == "kakaostory") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "3");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.stotyCdn;
					}
					if(type == "facebook") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "6");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.faceCdn;
					}
					if(type == "twitter") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "2");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.twitCdn;
					}
					if(type == "url_copy") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "7");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.urlCdn;
					}
					if(type == "moreapp") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "8");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.appCdn;
					}
					if(type == "mail") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "5");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.mailCdn;
					}

					if($scope.share_img && $scope.share_img != "") {
						$scope.share_img = $scope.share_img;
					} else {
						$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img_50th.jpg";
						/*http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png*/
					}

					var params = {
						url : $scope.cnShareUrl,
						title : $scope.kakaoType +  $scope.subTitle.replace(/#/gi, "") + $scope.prdComment.replace(/#/gi, ""),
						imageUrl : $scope.share_img
					};

					if($scope.appObj.isAndroid) {
						//console.log('eeeeeeeeeeeeeeeeeee : ' + type)
						$window.lotteshare.callAndroid("lotteshare://" + type + "/query?" + JSON.stringify(params));
					} else if($scope.appObj.isIOS) {
						$window.location = "lotteshare://" + type + "/query?" + JSON.stringify(params);
					}
				};

				/**
				 * @ngdoc function
				 * @name shareBox.function:sendKakaoStory
				 * @description
				 * 카카오스토리 공유하기
				 * @example
				 * $scope.sendKakaoStory();
				 */
				$scope.sendKakaoStory = function(){
					$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "3");

					if($scope.share_img && $scope.share_img != "") {
						$scope.share_img = $scope.share_img;
					} else {
						$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img_50th.jpg";
						/*http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png*/
					}

					Kakao.Story.open({
						url: $scope.cnShareUrl,
						text: "["+ $scope.subTitle + "]\n" + $scope.prdComment + "\n",
						urlInfo: {
							images: [$scope.share_img]
						}
					});
				};

				/**
				 * @ngdoc function
				 * @name shareBox.function:sendKakaoStory
				 * @description
				 * 카카오톡 공유하기
				 * @example
				 * $scope.sendKakaoStory();
				 */
			  $scope.sendKakaoTalk = function(){
				  $scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "1");

				  if($scope.share_img && $scope.share_img != "") {
					  $scope.img_url = $scope.share_img;
				  } else {
					  $scope.img_url = "http://image.lotte.com/lotte/mobile/common/share_img_50th.jpg";
					  /*http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png*/
				  }
				  
				  $scope.appShareUrl = $scope.cnShareUrl.replace('http', 'mlotte001'); // 웹 공유버튼 위한 변환
				  //console.log($scope.prdComment);
					
				  // label: "[롯데닷컴 이거어때?]\n["+$scope.subTitle+"]\n" + $scope.prdComment + "\n" + $scope.cnShareUrl,
				  Kakao.Link.sendTalkLink({
						label: "["+$scope.subTitle+"]\n" + $scope.prdComment + "\n" + $scope.cnShareUrl,
						image: {
							src: $scope.img_url,
							width: "280",
							height: "280"
						},
						appButton: {
							text: "롯데닷컴",
							execParams : {
								iphone : {
									executeurl : $scope.appShareUrl
								},
								android : {
									executeurl : $scope.appShareUrl
								}
							}
						},
						installTalk : true,
				  });
			  };

				/**
				 * @ngdoc function
				 * @name shareBox.function:sendFacebook
				 * @description
				 * 페이스북 공유하기
				 * @example
				 * $scope.sendFacebook();
				 */
				$scope.sendFacebook = function(){
					$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "6");
					startFB();
				};

				/**
				 * @ngdoc function
				 * @name shareBox.function:startFB
				 * @description
				 * 페이스북 공유하기
				 * @example
				 * startFB();
				 */
				function startFB(){
					if($scope.share_img && $scope.share_img != "") {
						var share_img = $scope.share_img;
					} else {
						var share_img = "http://image.lotte.com/lotte/mobile/common/share_img_50th.jpg";
						/*http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png*/
					}

					$scope.cnShareUrl = $scope.cnShareUrl.replace(/(&)/g, "%26");
					$scope.subTitle = $scope.subTitle.replace(/(&)/g, "") + $scope.prdComment.replace(/(&)/g, "");

//                    var url = "http://m.facebook.com/sharer.php?";
//                    var f_shareTitle = $scope.subTitle.replace(/([&])/g, "").replace(/\n/g, " ");
//                    var param = "";
////                    param += "u=http://m.lotte.com/exevent/facebook_landing.jsp?fb_yn=Y";
//                    param += "u=" + LotteCommon.facebookUrl + "?fb_yn=Y";
//                    param += encodeURIComponent("&shareTitle=" + f_shareTitle + $scope.prdComment);
//                    param += encodeURIComponent("&shareImg=" + share_img);
//                    param += encodeURIComponent("&shareUrl=" + $scope.cnShareUrl.replace(/(&)/g, ""));
//                    url += param;

					var url = "http://m.facebook.com/sharer.php?s=100&u=" + encodeURIComponent(LotteCommon.facebookUrl + "?fb_yn=Y&shareUrl=" + $scope.cnShareUrl + "&shareTitle=" + $scope.subTitle + "&shareImg=" + share_img);
					$window.open(url);
				}

				/**
				 * @ngdoc function
				 * @name shareBox.function:sendTwitter
				 * @description
				 * 트위터 공유하기
				 * @example
				 * $scope.sendTwitter();
				 */
				$scope.sendTwitter = function(){
					$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "2");
					startTW();
				};

				/**
				 * @ngdoc function
				 * @name shareBox.function:startTW
				 * @description
				 * 트위터 공유하기
				 * @example
				 * startTW();
				 */
				function startTW(){
					var f_shareTitle = $scope.subTitle + $scope.prdComment;

					// 앱 & 웹 공통
					var url = "https://twitter.com/share?text=" + encodeURIComponent("[롯데닷컴 이거어때?] " + f_shareTitle + $scope.prdComment + " ") + "&url=" + encodeURIComponent($scope.cnShareUrl);

					$window.open(url);
				}

				function getCommentEncoding( str ) {
					return encodeURIComponent( str.replace(/(&)/g, "%26") );
				}
			}
		};
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteSns.directive:smsBox
	 * @descriptiot
	 * smsBox directive
	 */
	snsModule.directive('smsBox', ['$window', function($window){
		return {
			templateUrl:'/lotte/resources_dev/sns/sms_box.html',
			controller:'smsBoxCtrl',
			link:function($scope, el, attrs){
				$scope.focusInput = true;

				/**
				 * @ngdoc function
				 * @name smsBox.function:sendShareSMS
				 * @description
				 * 문자발송
				 * @example
				 * $scope.sendShareSMS();
				 */
				$scope.sendShareSMS = function(){
					if($.isNumeric($scope.sms_phoneNo) && $scope.sms_phoneNo.length <= 11 && $scope.sms_phoneNo.length >= 10){
						$scope.sendSMSData();
					}else{
						alert("휴대폰 번호를 정상적으로 입력해주세요.");
					}
				};
				if($scope.appObj.isIOS) {
					angular.element(document).on('focus', 'input, textarea', function(evt) {
						el[0].style.cssText = '';
					});
				}
			}
		};
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteSns.directive:numericOnly
	 * @description
	 * 숫자입력 체크
	 */
	snsModule.directive('numericOnly', function(){
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, modelCtrl) {

				modelCtrl.$parsers.push(function (inputValue) {
					var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : null;

					if (transformedInput!=inputValue) {
						modelCtrl.$setViewValue(transformedInput);
						modelCtrl.$render();
					}

					return transformedInput;
				});
			}
		};
	});

	/**
	 * @ngdoc directive
	 * @name lotteSns.directive:sharePop
	 * @description
	 * sharePop directive
	 * @example
	 * <share-pop></share-pop>
	 */
	snsModule.directive('sharePop', ['$window', '$location', function ($window) {
		return {
			templateUrl: '/lotte/resources_dev/sns/share_pop.html',
			replace: true,
			link: function ($scope, el, attrs) {
				function getUrlParams() {
					var params = {};
					window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
					return params;
				}

				$scope.isBeforeShareBox = false; // share box open before?
				$scope.sharePopVisible = false;
				$scope.shareBoxVisible = false;
				$scope.snsTitle = "친구에게 공유하기";

				//$scope.cnShareUrl = "http://m.lotte.com" + $scope.share_path + $scope.param + "&cn=123624";
				//$scope.share_img = ""; //img

				/* @param : obj =
				* {
				*    prdComment : "평이 좋아서 신행가서 쓰려고 샀어요",
				*    shareImg : "http://image.lotte.com/goods/89/31/79/42/42793189_1_550.jpg"
				* }
				*/

				/**
				 * @ngdoc function
				 * @name sharePop.function:showSharePop
				 * @description
				 * 공유하기 팝업
				 * @example
				 * $scope.showSharePop(obj, opt);
				 * @param {Object} obj 공유하기 Object
				 * @param {String} obj.prdComment 상품평
				 * @param {number} obj.goodsNo 상품번호
				 * @param {String} obj.shareImg Image Url
				 * @param {String} opt 공유하기 구분 FLAG (crit : 상품평관련)
				 */
				$scope.showSharePop = function (obj, opt) {  

					// 20170412 내용 줄바꿈 관련 추가 likearts
					obj.prdComment = obj.prdComment.replace(/[<]br[/][>]/gi, "\n");
					//console.log( obj );
					// SKlotte 카카오톡 ID 분기
					try{ // 20170411 liearts try catch 추가
						Kakao.cleanup();

						if ($scope.appObj.isSktApp == true) {
							Kakao.init("7a460fb5cdebe4589041db57d906ddda");
						} else {
							Kakao.init("574659987ca46095c123d71f72abac14");
						}
					} catch (e) {
						//alert( 'PC버전입니다. 모바일로 접속해주세요.' );
						//return;
					}
					
					$scope.prdComment = ""; //상품평 공유
					$scope.share_path = location.pathname;
					$scope.testParam = getUrlParams();
                    
					var newDate = new Date();
					var yyyy = newDate.getFullYear().toString();
					var mm = (newDate.getMonth() + 1).toString();
					var dd = newDate.getDate().toString();

					$scope.nowDate = yyyy + (mm[1] ? mm : '0'+mm[0]) + (dd[1] ? dd : '0'+dd[0]);
				
					
					// 이벤트 번호 호출 20170330 4월 이벤트 등록                // 이벤트 번호 호출 20170227 3월 이벤트 등록   
					if ($scope.nowDate >= 20170401 && $scope.nowDate < 20170501) { // 2017년 4월의 이벤트 코드
						$scope.share_evt_no = "315361";
					} else if ($scope.nowDate >= 20170301 && $scope.nowDate < 20170401) { // 2017년 3월의 이벤트 코드
						$scope.share_evt_no = "314863";
					} else {
						$scope.share_evt_no = "302853";
					}

					if ($scope.share_path == "/mylotte/product/m/mylotte_crit_view.do"){

						$scope.snsTitle = "친구에게 공유하기";
						$scope.subTitle = " [상품평] ";
						$scope.prdComment = obj.prdComment.replace(/\<br[\/]*\>/g, " ");	//상품명(mgoods_nm)

						if(angular.isDefined(obj.goodsNo)){
							$scope.goodsNo = obj.goodsNo;
						}else{
							$scope.goodsNo = "";
						}

						if(angular.isDefined(obj.shareImg)){
							$scope.share_img = obj.shareImg;
						}else{
							$scope.share_img = "";
						}

					} else if ($scope.share_path == "/product/m/product_view.do") {
						if (!angular.isDefined(obj.prdComment)) {
							$scope.snsTitle = "친구에게 공유하기";
							$scope.share_img = obj.shareImg;
							$scope.goodsNo = obj.goodsNo;
							$scope.subTitle = $scope.$$childHead.BasicData.product.mgoods_nm;
							$scope.prdComment = "";
						} else {
							if (obj.healthfood_yn == 'Y') {  //신선식품 혹은 의료상품
								$scope.snsTitle = "친구에게 공유하기";
								$scope.share_img = obj.shareImg;
								$scope.goodsNo = obj.goodsNo;
								$scope.subTitle = $scope.$$childHead.BasicData.product.mgoods_nm;
								$scope.prdComment = "";
							} else {
								$scope.snsTitle = "친구에게 공유하기";
								$scope.share_img = obj.shareImg;
								$scope.goodsNo = obj.goodsNo;
								$scope.subTitle = " [상품평] ";
								$scope.prdComment = obj.prdComment.replace(/\<br[\/]*\>/g, " ");	//상품명(mgoods_nm)
							}
						}
					}else if($scope.share_path == "/product/m/photoreview.do"){ //상품평 고객등록사진
                        if (obj.healthfood_yn == 'Y') {  //신선식품 혹은 의료상품
                            $scope.snsTitle = "친구에게 공유하기";
                            $scope.share_img = obj.shareImg;
                            $scope.goodsNo = obj.goodsNo;
                            $scope.subTitle = obj.mgoods_nm;
                            $scope.prdComment = "";								
                        } else {
                            $scope.snsTitle = "친구에게 공유하기";
                            $scope.share_img = obj.shareImg;
                            $scope.goodsNo = obj.goodsNo;
                            $scope.subTitle = " [상품평] ";
                            $scope.prdComment = obj.prdComment.replace(/\<br[\/]*\>/g, " ");	//상품명(mgoods_nm)
                        }
                        
					} else if ($scope.share_path == "/mall/pet/dearpet_gallery.do") {
						$scope.snsTitle = "친구에게 공유하기";
						$scope.share_img = obj.shareImg;
						$scope.bbsNo = obj.bbsNo;
						$scope.prdComment = obj.prdComment.replace(/\<br[\/]*\>/g, " ");
					} else if($scope.share_path == "/product/m/product_list.do" ){
						// 2017.01.20 기획전 이미지 공유하기 
						$scope.snsTitle = "친구에게 공유하기";
						$scope.share_img = obj.shareImg;
					} else if($scope.share_path == "/planshop/m/planshop_view.do"){
						$scope.snsTitle = "친구에게 공유하기";
						$scope.share_img = obj.shareImg;						
					} else if($scope.share_path == "/product/m/product_view_gucci.do"){
						$scope.snsTitle = "친구에게 공유하기";
						$scope.share_img = obj.shareImg;
						$scope.goodsNo = obj.goodsNo;
						$scope.subTitle = $scope.$$childHead.BasicData.product.mgoods_nm;
					} else {
						$scope.snsTitle = "친구에게 공유하기";
						$scope.prdComment = ""
						$scope.share_img = "";
					}

					$scope.param = "";

					// 파라메터 정보
					if($scope.share_path == "/product/m/product_view.do") {
						$scope.param = "?goods_no=" + $scope.testParam.goods_no;
					}
                    if($scope.share_path == "/product/m/photoreview.do"){//상품평 - 고객등록사진
                        $scope.param = "?goods_no=" + $scope.goodsNo;
                        $scope.share_path = "/product/m/product_view.do";
                    }
					if($scope.share_path == "/mylotte/product/m/mylotte_crit_view.do") {
						$scope.param = "?goods_no=" + $scope.goodsNo;
					}
					if($scope.share_path == "/product/m/comment_rewrite.do" || $scope.share_path == "/product/m/comment_write.do") {
						$scope.param = "?goods_no=" + $scope.testParam.goods_no;
					}
					if($scope.share_path == "/product/m/product_list.do") {
						if(!angular.isDefined($scope.testParam.ss_yn)) {
							$scope.testParam.ss_yn = "";
						} else {
							$scope.testParam.ss_yn = "&ss_yn=" + $scope.testParam.ss_yn;
						}
						if(!angular.isDefined($scope.testParam.shoppingholicYn)) {
							$scope.testParam.shoppingholicYn = "";
						} else {
							$scope.testParam.shoppingholicYn = "&shoppingholicYn=" + $scope.testParam.shoppingholicYn;
						}
						if(!angular.isDefined($scope.testParam.planShopGubun)) {
							$scope.testParam.planShopGubun = "";
						} else {
							$scope.testParam.planShopGubun = "&planShopGubun=" + $scope.testParam.planShopGubun;
						}
						$scope.param = "?curDispNo=" + $scope.testParam.curDispNo + $scope.testParam.ss_yn + $scope.testParam.shoppingholicYn + $scope.testParam.planShopGubun;
					}
					if($scope.share_path == "/planshop/m/planshop_view.do") {
						$scope.param = "?spdp_no=" + $scope.testParam.spdp_no;
					}
					if($scope.share_path == "/event/m/eventSaunMain.do") {
						$scope.param = "?evt_no=" + $scope.testParam.evt_no;
					 }

					 if ($scope.share_path == "/styleshop/styleshop.do") { // 스타일샵 추가
						$scope.param = "?disp_no=" + $scope.testParam.disp_no;
					 }

					 if ($scope.share_path == "/styleshop/styleshopmen.do") { // 스타일샵맨 추가
						$scope.param = "?keyword=" + $scope.testParam.keyword;
					 }

					 if ($scope.share_path == "/mall/pet/dearpet_gallery.do") { // 펫 갤러리 추가
							$scope.param = "?curDispNo=" + $scope.testParam.curDispNo + "&beforeNo=" + $scope.testParam.beforeNo + "&cateDepth=" + $scope.testParam.cateDepth;
					 }

					 if ($scope.share_path == "/event/m/kids/experience_view.do") { // 유아동 체험단 상세 추가
							$scope.param = "?evt_no=" + $scope.testParam.evt_no;
					 }

					 if ($scope.share_path == "/product/m/product_view_gucci.do"){ //구찌 상세 추가
							$scope.param = "?goods_no=" + $scope.testParam.goods_no;
					 }
					 
						
					switch($scope.share_path){
						// 스타일추천
						case "/product/m/style_recom.do":
						case "/search/style_recom_dev.html":
							$scope.snsTitle = "친구에게 공유하기";
							$scope.share_img = obj.shareImg;
							$scope.param = "?img=" + $scope.testParam.img;
							break;
					}
					

					// scope param 에 따른 처리
					if (($scope.param + "").length > 0) {
						$scope.param += "&";
					}

					if (($scope.param + "").indexOf("?") == -1) {
						$scope.param = "?" + $scope.param;
					}

					// 기본 URL 생성
					if ($scope.appObj.isSktApp == true) {
						$scope.noCdnUrl = location.protocol + "//" + location.hostname + $scope.share_path + $scope.param + "cn=171127";
					} else if ($scope.share_path == "/mylotte/product/m/mylotte_crit_view.do" || $scope.share_path == "/product/m/comment_rewrite.do" || $scope.share_path == "/product/m/comment_write.do") {
						$scope.noCdnUrl = location.protocol + "//" + location.hostname + "/product/m/product_view.do" + $scope.param + "&cn=123624";
					} else if ($scope.share_path == "/mall/pet/dearpet_gallery.do") {
						$scope.noCdnUrl = location.protocol + "//" + location.hostname + "/mall/pet/dearpet_gallery.do" + $scope.param;
					} else { // 기타인 경우

						$scope.noCdnUrl = location.protocol + "//" + location.hostname + $scope.share_path + $scope.param + "cn=123624";
					}
                    

					// 채널 코드 생성
					if($scope.appObj.isSktApp == true) {
						$scope.talkCdn = "3093671";
						$scope.twitCdn = "3093668";
						$scope.stotyCdn = "3093670";
						$scope.smsCdn = "3093672";
						$scope.mailCdn = "3158697";
						$scope.faceCdn = "3093669";
						$scope.urlCdn = "3158696";
						$scope.appCdn = "3158696";
					} else {
						$scope.talkCdn = "2929723";
						$scope.twitCdn = "2929720";
						$scope.stotyCdn = "2929722";
						$scope.smsCdn = "2929725";
						$scope.mailCdn = "2929724";
						$scope.faceCdn = "2929721";
						$scope.urlCdn = "2929719";
						$scope.appCdn = "2929719";
					}

					if(!angular.isDefined(opt)) {
						//console.log('no')
						$scope.talkFlag = true;
						$scope.twitFlag = true;
						$scope.stotyFlag = true;
						$scope.smsFlag = true;
						$scope.mailFlag = true;
						$scope.faceFlag = true;
						if($scope.appObj.isAndroid) {
							$scope.urlFlag = true;
							$scope.urlCopyFlag = false;
						} else if ($scope.appObj.isIOS) {
							if($scope.appObj.isOldApp) {
								$scope.urlFlag = false;
								$scope.urlCopyFlag = false;
							} else {
								$scope.urlFlag = true;
								$scope.urlCopyFlag = false;
							}
						} else {
							$scope.urlFlag = false;
							$scope.urlCopyFlag = false;
						}
						if($scope.appObj.isApp){
							if($scope.appObj.isAndroid) {
								$scope.appFlag = true;
							} else {
								$scope.appFlag = false;
							}
						}
					}
					if(opt == 'crit') {
						//console.log('crit')
						$scope.talkFlag = true;
						$scope.twitFlag = false;
						$scope.stotyFlag = true;
						$scope.smsFlag = true;
						$scope.mailFlag = true;
						$scope.faceFlag = true;
						$scope.urlFlag = false;
						$scope.urlCopyFlag = false;
						$scope.appFlag = false;
					}

					$scope.sharePopVisible = true;
					$scope.shareBoxVisible = true;
					$scope.sharePopTl = "이거어때?";
					//$scope.sendTclick($scope.tClickBase + "subheader_Clk_Btn_2");

					if ($scope.share_path == "/mall/pet/dearpet_gallery.do") {
						$scope.sendTclick( 'm_DC_SpeDisp_Dearpet_Clk_Shr' + $scope.testParam.curDispNo );
					} else { // 그 외 모두
						//$scope.sendTclick( 'm_header_new_SNS' );
						$scope.sendTclick( 'm_RDC_ProdDetail_Clk_SNS' );
					}

					$scope.dimmedOpen({
						target : "pop_sns",
						callback: this.hideSharePop
					});
				};

				/**
				 * @ngdoc function
				 * @name sharePop.function:hideSharePop
				 * @description
				 * 공유하기 팝업 Close
				 * @example
				 * $scope.hideSharePop();
				 */
				//hide show box
				$scope.hideSharePop = function(){
					if($scope.isBeforeShareBox){ // share box -> sms box
						$scope.shareBoxVisible = true;
						$scope.smsBoxVisible = false;
						$scope.sharePopTl = "이거어때?";
						$scope.isBeforeShareBox = false;
						$scope.dimmedClose({target : "pop_sns"});

					}else{
						$scope.contVisible = true;
						$scope.sharePopVisible = false;
						$scope.shareBoxVisible = false;
						$scope.smsBoxVisible = false;
						$scope.sharePopTl = "";
						$scope.smsTxt = "";
						$scope.sms_phoneNo = "";
						$scope.dimmedClose({target : "pop_sns"});
					}
				}
			}
		}
	}]);

})(window, window.angular);
var transformJsonToParam = function(obj) {
	var str = [];

	for (var p in obj) {
		if (Array.isArray(obj[p])) {
			for(var i=0; i<obj[p].length; i++) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p][i]));
			}
		} else {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	}

	return str.join("&");
};
