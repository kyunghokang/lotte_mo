
(function(window, angular, undefined) {
	'use strict';

	/**
	 * @ngdoc overview
	 * @name lotteSns
	 * @description
	 * lotte_sns.js<br/>
	 * 공유하기 모듈
	 */
	var snsModule = angular.module('lotteSns', []),
		 shareAddTitle = "[롯데닷컴 이거어때?]\n",
		 newShareAddTitle = "[롯데닷컴]"; // 카카오링크 V2 API 타이틀

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

				/*****************************************
				 * 날짜 세팅
				 *****************************************/

				function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
					return num < 10 ? "0" + num : num + "";
				}

				function getTime(Year, Month, Day, Hour, Min, Sec) {
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

				var todayDateTime = new Date(),
					todayDate = todayDateTime.getFullYear() + getAddZero(todayDateTime.getMonth() + 1) + getAddZero(todayDateTime.getDate()) , // 년월일
					todayTime = todayDateTime.getTime(); // Time

				/********************************************
				 * TEST Func. - 테스트를 위한 코드 추가
				 ********************************************/
				// 날짜 설정으로 운영되는 요소에 대한 테스트 코드
				if (commInitData.query["testDate"]) {
					var testDateStr = commInitData.query["testDate"];
					todayDate = commInitData.query["testDate"]; // 년월일
					todayTime = getTime(
						todayDate.substring(0, 4), // 년
						todayDate.substring(4, 6), // 월
						todayDate.substring(6, 8), // 일
						todayDate.substring(8, 10), // 시간
						todayDate.substring(10, 12), // 분
						todayDate.substring(12, 14)); // 초
				}
				//console.log('tmpDate',tmpDate,'sum_dt',sum_dt,'todayTime',todayTime);

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
							$scope.urlCopyClick($scope.cnShareUrl);

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
				$scope.urlCopyClick = function(shareUrl) {
					$scope.sendTclick($scope.tClickBase +'share_Clk_Pop_' + "5");
					$scope.urlCopyFlag = !$scope.urlCopyFlag;
					/*if($scope.urlCopyFlag){
						//window.clipboardData.setData('Text', shareUrl);
						alert("주소가 복사되었습니다.");
					}*/

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
					$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "6");

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
						$scope.smsTxt = $scope.getDearPetShareTitle($scope.subTitle) + $scope.prdComment + " "+ $scope.cnShareUrl;

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
							$scope.smsTxt = $scope.getDearPetShareTitle($scope.subTitle) + $scope.prdComment + " "+ $scope.cnShareUrl;
						} else {
							var smsData = encodeURIComponent( $scope.getDearPetShareTitle($scope.subTitle).replace(/(&)/g, "%26") + $scope.prdComment.replace(/(&)/g, "%26") + " " + $scope.cnShareUrl.replace(/(&)/g, "%26"));
						    //var smsData = encodeURIComponent("[롯데닷컴 이거어때?] \n" + $scope.subTitle + "\n" + $scope.cnShareUrl);
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
						$scope.smsTxt = $scope.getDearPetShareTitle($scope.subTitle) + $scope.prdComment + " "+ $scope.cnShareUrl;
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
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "6");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.smsCdn;
					}
					if(type == "kakaotalk") {
						if($scope.appObj.isOldApp) {
							$scope.kakaoType = "";//[롯데닷컴 이거어때?]" + "\n";
						} else {
							$scope.kakaoType = "";
						}
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "1");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = location.protocol + "//" + location.hostname + $scope.share_path + $scope.param + "cn=123624" + "&cdn=" + $scope.talkCdn;
					}
					if(type == "kakaostory") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "4");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.stotyCdn;
					}
					if(type == "facebook") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "2");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.faceCdn;
					}
					if(type == "twitter") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "3");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.twitCdn;
					}
					if(type == "url_copy") {
						$scope.kakaoType = "";
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "5");
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
						$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "7");
						$scope.cnShareUrl = "";
						$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.mailCdn;
					}

					/* kakao link V1, V2 API 버젼 따라 params 형태 달라지므로 분기 처리 */
					if ((($scope.appObj.isAndroid && $scope.appObj.verNumber < 408) || ($scope.appObj.isIOS && $scope.appObj.verNumber < 4050)) || type != "kakaotalk") {
						var params = {
							url : $scope.cnShareUrl,
							title : $scope.kakaoType + $scope.getDearPetShareTitle( $scope.subTitle ).replace(/#/gi, "") + $scope.prdComment.replace(/#/gi, ""),
							imageUrl : $scope.share_img
						};
					}else {
						var params = {
							type : "default",
							title : $scope.kakaoTitle,
							imageUrl : $scope.share_img,
							url : $scope.cnShareUrl,
							buttons : [
								{
									title : "바로가기",
									url : $scope.cnShareUrl
								}
							]
						};

						if (type == "kakaotalk") { // 카카오일 경우 타이틀 처리 안함
							params.desc = $scope.kakaoType + $scope.subTitle.replace(/#/gi, "") + $scope.prdComment.replace(/#/gi, "");
						} else {
							params.desc = $scope.kakaoType + $scope.getDearPetShareTitle( $scope.subTitle ).replace(/#/gi, "") + $scope.prdComment.replace(/#/gi, "");
						}
					}

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
					$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "4");

					if($scope.share_img && $scope.share_img != "") {
						$scope.share_img = $scope.share_img;
					} else {
						if (todayTime < getTime(2017, 4, 24, 0, 0)) {
							$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img_50th.jpg";
						}else {
							$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png"
						}
					}

					Kakao.Story.open({
						url: $scope.cnShareUrl,
						text: $scope.getDearPetShareTitle($scope.subTitle) + $scope.prdComment + "\n",
						urlInfo: {
							title: '[롯데닷컴]',
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
                      //중고매장 예외처리 추가
                      var title = $scope.subTitle;
                      if(title.indexOf("중고라운지") > 0){
                          title = "[중고라운지]";
                      }

					  // V2
					  Kakao.Link.sendDefault({
						  objectType: 'feed',
						  content: {
							  title: $scope.kakaoTitle,
							  description: title + $scope.prdComment,
							  imageUrl: $scope.share_img,
							  link: {
								  mobileWebUrl: $scope.cnShareUrl
							  }
						  },
						  buttons: [
							  {
								  title: '바로가기',
								  link: {
									  mobileWebUrl: $scope.cnShareUrl
								  }
							  }
						  ]
					  });

					  // V1 서비스 지원 중단
					  // Kakao.Link.sendTalkLink({
						 //  label: $scope.getDearPetShareTitle($scope.subTitle) + $scope.prdComment + "\n" + $scope.cnShareUrl,
							// image: {
							// src: $scope.img_url,
							// width: "280",
							// height: "280"
							// },
							// appButton: {
							// 	text: "롯데닷컴",
							// 	execParams : {
							// 		iphone : {
							// 			executeurl : $scope.appShareUrl
							// 		},
							// 		android : {
							// 			executeurl : $scope.appShareUrl
							// 		}
							// 	}
							// },
							// installTalk : true,
					  // });
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
					$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "2");

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
						if (todayTime < getTime(2017, 4, 24, 0, 0)) {
							var share_img = "http://image.lotte.com/lotte/mobile/common/share_img_50th.jpg";
						}else {
							var share_img = "http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png";
						}
					}
					$scope.cnShareUrl = $scope.cnShareUrl.replace(/(&)/g, "%26");
					var FBTitle = $scope.getDearPetShareTitle($scope.subTitle).replace(/(&)/g, "") + $scope.prdComment.replace(/(&)/g, ""); //20180413 페이스북 타이틀 shareAddTitle 중복 수정

					//var url = "http://m.facebook.com/sharer.php?";
					//var f_shareTitle = $scope.subTitle.replace(/([&])/g, "").replace(/\n/g, " ");
					//var param = "";
					//    param += "u=http://m.lotte.com/exevent/facebook_landing.jsp?fb_yn=Y";
					//    param += "u=" + LotteCommon.facebookUrl + "?fb_yn=Y";
					//    param += encodeURIComponent("&shareTitle=" + f_shareTitle + $scope.prdComment);
					//    param += encodeURIComponent("&shareImg=" + share_img);
					//    param += encodeURIComponent("&shareUrl=" + $scope.cnShareUrl.replace(/(&)/g, ""));
					//    url += param;

					var url = "http://m.facebook.com/sharer.php?s=100&u=" + encodeURIComponent(LotteCommon.facebookUrl + "?fb_yn=Y&shareUrl=" + $scope.cnShareUrl + "&shareTitle=" + FBTitle + "&shareImg=" + share_img); //20180413 페이스북 타이틀 shareAddTitle 중복 수정
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
					$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "3");
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
					var url = "https://twitter.com/share?text=" + encodeURIComponent( $scope.getDearPetShareTitle($scope.subTitle) + $scope.prdComment + " ") + "&url=" + encodeURIComponent($scope.cnShareUrl);

					$window.open(url);
				}
			}
		};
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteSns.directive:smsBox
	 * @description
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
	snsModule.directive('sharePop', ['$window', '$location', 'LotteCommon', '$timeout', function ($window, $location, LotteCommon, $timeout) {
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

				// 20170412 likearts 디어펫 구분코드 추가
				$scope.getDearPetShareTitle = function( title )
				{
					//console.log("%o title %o shareCodeis %o subTitle",title, $scope.shareCodeis, $scope.subTitle);
					try {
						if( $scope.shareCodeis ) {
							title = "["+$scope.shareCodeis + " " + $scope.subTitle+"]\n";
							shareAddTitle = "";
						}
					} catch(e){};

					// 20170414 likearts 추가 디어펫이 아닐경우 타이틀에 문구추가
					try { if( $scope.screenID != "DearpetGallary" && $scope.screenID != "Mombaby" && !$scope.shareNoFixMessage ) title = shareAddTitle + title;
					} catch(e){ title = shareAddTitle + title; }

					try {
						title = title.replace("[[","[");
						title = title.replace("]]","]");
					} catch(e) { console.log( 'shareTitle replace err'); }
					try {
                        if(title.indexOf("중고라운지") > 0){
                            title = "[중고라운지]";
                        }
					} catch(e) { }


					return title;
				};

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
				 * @param {String} obj.tclick 별도 tclick이 있을 경우
				 * @param {String} opt 공유하기 구분 FLAG (crit : 상품평관련)
				 */
				$scope.showSharePop = function (obj, opt) {
					// SKlotte 카카오톡 ID 분기
					try{
						Kakao.cleanup();
						if ($scope.appObj.isSktApp == true) {
							Kakao.init("7a460fb5cdebe4589041db57d906ddda");
						} else {
							Kakao.init("574659987ca46095c123d71f72abac14");
						}
					} catch(e) {
						console.log('PC-MODE'); /*return;*/
						if(location.host.indexOf("localhost") < 0){ return; }
					}
					if(!obj) obj = {}; // 서브헤더 공유 에러 예외처리 [ 20171215 박해원 ]

					$scope.prdComment = ""; // 상품평 공유 기본값 정의
					$scope.share_path = location.pathname;
					$scope.share_search = location.search;
					$scope.testParam = getUrlParams();
					$scope.snsTitle = "친구에게 공유하기";
				  	$scope.kakaoTitle = newShareAddTitle; // 카카오톡 링크 타이틀 기본값 정의

					// 20170412 likearts 줄바꿈 처리
					try{ obj.prdComment = obj.prdComment.replace(/[<]br[/][>]/gi, "\n"); } catch(e) {};

					var newDate = new Date();
					var yyyy = newDate.getFullYear().toString();
					var mm = (newDate.getMonth() + 1).toString();
					var dd = newDate.getDate().toString();

					$scope.nowDate = yyyy + (mm[1] ? mm : '0'+mm[0]) + (dd[1] ? dd : '0'+dd[0]);

					/* [공유 이미지 기본값 정의]넘어온 공유하기 이미지 있을 경우 처리 */
					if (angular.isDefined(obj.shareImg)) {
						$scope.share_img = obj.shareImg;
					}

					// 이벤트 번호 호출 2019 01,02,03월 이벤트 등록
					if ($scope.nowDate >= 20181201 && $scope.nowDate < 20190104) { // 2018년 12월의 이벤트 코드
						$scope.share_evt_no = "367442";
					} else if ($scope.nowDate >= 20190104 && $scope.nowDate < 20190201) { // 2019년 01월의 이벤트 코드
						$scope.share_evt_no = "382951";
					} else if ($scope.nowDate >= 20190201 && $scope.nowDate < 20190301) { // 2019년 02월의 이벤트 코드
						$scope.share_evt_no = "382955";
					} else if ($scope.nowDate >= 20190301 && $scope.nowDate < 20190401) { // 2019년 03월의 이벤트 코드
						$scope.share_evt_no = "382957";
					} else {
						$scope.share_evt_no = "302853";
				    }

					if ($scope.share_path == "/mylotte/product/m/mylotte_crit_view.do"){

						$scope.subTitle = "[상품평]";
						$scope.prdComment = obj.prdComment.replace(/\<br[\/]*\>/g, " ").replace('\n',' ');	//상품명(mgoods_nm)
						$scope.goodsNm = obj.goodsNm;
				  		$scope.kakaoTitle = newShareAddTitle + $scope.goodsNm;

						if(angular.isDefined(obj.goodsNo)){
							$scope.goodsNo = obj.goodsNo;
						}else{
							$scope.goodsNo = "";
						}

					} else if ($scope.share_path == "/product/m/product_view.do" || $scope.share_path == "/product/m/sub/product_comment.do" || $scope.share_path == "/product/m/sub/product_comment_detail.do" || $scope.share_path == "/product/m/product_view_burberry.do") {
						$scope.share_path = "/product/m/product_view.do";

						if (!angular.isDefined(obj.prdComment)) {
							$scope.goodsNo = obj.goodsNo;

							/* 기본 상품상세 중 분기가 필요한 페이지들(구찌, 샤넬, 렌탈) share_path로 분기 되지 않음. 동일한 페이지명을 씀 */
							if ($scope.subTitle == 'GUCCI') { // 구찌 상품 상품명 분기 처리
								$scope.subTitle = $scope.$$childHead.BasicData.product.mgoods_nm;
								$scope.param = "?goods_no=" + $scope.testParam.goods_no;
							}else if ($scope.pageUI && $scope.pageUI.data.commonInfo.chanelYn) {
								$scope.subTitle = '[CHANEL]' + obj.goodsNm; // 샤넬 상품 상품명 추가 처리
							}else if($scope.screenID == "BURBERRY"){ // 20180418 버버리 상품 수정
								shareAddTitle = "";
								$scope.subTitle = "[BURBERRY]\n" + obj.goodsNm;
							} else{
								$scope.subTitle = obj.goodsNm;
							}

						} else {
							if (obj.healthfood_yn == 'Y') {  //신선식품 혹은 의료상품
								$scope.goodsNo = obj.goodsNo;
								$scope.subTitle = obj.goodsNm;
				  				$scope.kakaoTitle = newShareAddTitle + $scope.goodsNm;
							} else {
								$scope.goodsNo = obj.goodsNo;
								$scope.subTitle = "[상품평]";
								$scope.prdComment = obj.prdComment.replace(/\<br[\/]*\>/g, " ").replace('\n',' ');	//상품명(mgoods_nm)
								$scope.goodsNm = obj.goodsNm;
				  				$scope.kakaoTitle = newShareAddTitle + $scope.goodsNm;
							}
						}
					}else if($scope.share_path == "/product/m/photoreview.do"){ //상품평 고객등록사진
                        if (obj.healthfood_yn == 'Y') {  //신선식품 혹은 의료상품
                            $scope.goodsNo = obj.goodsNo;
                            $scope.subTitle = obj.mgoods_nm;
                        } else {
                            $scope.goodsNo = obj.goodsNo;
                            $scope.subTitle = "[상품평] ";
                            $scope.prdComment = obj.prdComment.replace(/\<br[\/]*\>/g, " ").replace('\n',' ');	//상품명(mgoods_nm)
                        }

					} else if ($scope.share_path == "/mall/spec_mall.do") { // 전문관 분기 처리
						if ($scope.share_search.indexOf('dispNo=5535841') != -1) { // K.SHOP 분기
							$scope.share_img = 'http://image.lotte.com/lotte/mobile/common/share_img_pro_kshop.jpg';
							$scope.kakaoTitle = newShareAddTitle + '[K.SHOP]';
				  			$scope.subTitle = '대한민국 창조의 힘! 중소기업을 응원합니다.';
						} else if ($scope.share_search.indexOf('dispNo=5553048') != -1) { // 롯데브랜드관 분기
							$scope.share_img = 'http://image.lotte.com/lotte/mobile/common/share_img_pro_lotte_brand.jpg';
							$scope.kakaoTitle = newShareAddTitle + '[롯데브랜드관]';
				  			$scope.subTitle = '롯데의 모든것, 다양한 롯데 스토어를 한 눈에!';
						} else if ($scope.share_search.indexOf('dispNo=5569995') != -1) { // 두피전문관 분기
							$scope.share_img = 'http://image.lotte.com/lotte/mobile/common/share_img_pro_scalp.jpg';
							$scope.kakaoTitle = newShareAddTitle + '[두피전문관]';
				  			$scope.subTitle = '최적의 두피 솔루션!당신을 위한 롯데닷컴의 브랜드를 소개합니다.';
						} else if ($scope.share_search.indexOf('dispNo=5565610') != -1) { // TV아울렛 분기
							$scope.share_img = 'http://image.lotte.com/lotte/mobile/common/share_img_pro_tv_outlet.jpg';
							$scope.kakaoTitle = newShareAddTitle + '[TV아울렛]';
				  			$scope.subTitle = '홈쇼핑 방송을 놓치셨다면! 홈쇼핑에서 봤던 바로 그 상품!';
						} else if ($scope.share_search.indexOf('dispNo=5578740') != -1) { // 브라이튼몰 분기
							$scope.share_img = 'http://image.lotte.com/lotte/mobile/common/share_img_pro_brighton_mall.jpg';
							$scope.kakaoTitle = newShareAddTitle + '[브라이튼몰]';
				  			$scope.subTitle = '복잡한 여행준비를 한번에~ 캐리어부터 파우치까지';
						} else if ($scope.share_search.indexOf('dispNo=5593416') != -1) { // 미펠스토어 분기
							$scope.share_img = 'http://image.lotte.com/lotte/mobile/common/share_img_pro_mipel_store.jpg';
							$scope.kakaoTitle = newShareAddTitle + '[미펠스토어]';
				  			$scope.subTitle = '이태리 장인의 하이퀄리티 핸드백 만나기';
						} else if ($scope.share_search.indexOf('dispNo=5558814') != -1) { // 특별한 맛남 분기
							$scope.share_img = 'http://image.lotte.com/lotte/mobile/common/share_img_pro_special_flavor.jpg';
							$scope.kakaoTitle = newShareAddTitle + '[특별한 맛남]';
				  			$scope.subTitle = '식탁위에 신선한 재료 스타일리쉬한 키친을 만드는 프리미엄 식품관';
						}else{ //기타 전문관
							$scope.kakaoTitle = newShareAddTitle;
				  			$scope.subTitle = '[' + $scope.subTitle + ']';
						}
					} else if($scope.share_path == "/event/m/eventSaunMain.do"){ // 구매사은 분기
				  		$scope.share_img = 'http://image.lotte.com/lotte/mobile/common/share_img_common.jpg';
					} else if($scope.share_path == "/mall/tvShopping.do"){ // TV쇼핑 분기
				  		$scope.kakaoTitle = newShareAddTitle + '[TV쇼핑]';
				  		$scope.subTitle = '드라마보다 더 재미있는 홈쇼핑상품을 이젠 닷컴에서도!';
						$scope.share_img = $scope.smp.today_product.product.items[0].img_url;
					} else if ($scope.share_path == "/mall/pet/mitou_main.do") { // 미미뚜뚜 메인 분기
				  		$scope.kakaoTitle = newShareAddTitle + '[MIMI TOUTOU]';
				  		$scope.subTitle = '미미뚜뚜 우리멍냥이 365일 행복하~개 반려동물 감성 놀이터♥';
					} else if ($scope.share_path == "/mall/pet/mitou_gallery.do") { // 미미뚜뚜 갤러리 분기
						$scope.bbsNo = obj.bbsNo;
						$scope.prdComment = obj.prdComment.replace(/\<br[\/]*\>/g, " ").replace('\n',' ');
					} else if ($scope.share_path == "/mall/baby/baby_main.do") { // 유아동관 메인 분기
						$scope.prdComment = obj.prdComment.replace(/\<br[\/]*\>/g, " ").replace('\n',' ');
					} else if($scope.share_path == "/event/m/kids/experience_main.do"){ // 유아동 체험단 분기
				  		$scope.subTitle = '[유아동 체험단]';
						$scope.share_img = $scope.ingEventList[0].img_url;
					} else if($scope.share_path == "/event/m/kids/experience_view.do"){ // 유아동 체험단 분기
				  		$scope.subTitle = '[유아동 체험단]';
						$scope.share_img = $scope.screenData.ProdInfo.img_url;
					} else if($scope.share_path == "/search/m/style_push_intro.do"){ // 스타일 추천 인트로 분기
				  		$scope.subTitle = '[스타일 추천]';
						$scope.share_img = 'http://image.lotte.com/lotte/mobile/common/share_img_stylerecom.jpg';
					} else if($scope.share_path == "/product/m/style_recom.do"){ // 스타일 추천 업로드/상품추천 분기
				  		$scope.subTitle = '[스타일 추천]';
					} else if($scope.share_path == "/mall/board/board_main.do" || $scope.share_path == "/mall/used_main_dev.html"){ // 중고매장
                        //$scope.subTitle = '[중고라운지]';
                        $scope.prdComment = " " + obj.prdComment;
						$scope.share_img = obj.shareImg;
                    }

					// 지정된 이미지 없을 경우 기본 이미지
					if($scope.share_img == "" || $scope.share_img == undefined) {
						$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img_common.jpg"
					}

					$scope.param = "";

					// 파라메터 정보
					if($scope.share_path == "/product/m/product_view.do") {
						$scope.param = "?goods_no=" + $scope.goodsNo;
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
                     if($scope.share_path == "/mall/baby/baby_main.do"){ //육아매장
                         $scope.param = "?dispNo=" + $scope.testParam.dispNo +"&dcate="+$scope.testParam.dcate +"&mcate="+$scope.testParam.mcate;
                     }

					 if ($scope.share_path == "/event/m/kids/experience_view.do") { // 유아동 체험단 상세 추가
							$scope.param = "?evt_no=" + $scope.testParam.evt_no;
					 }

					 if ($scope.share_path == "/category/m/brand_prod_list.do"){
							$scope.param = "?upBrdNo=" + ( $scope.testParam.upBrdNo || '' );
					 }

					 if ($scope.share_path == "/brand/bestbrandMain.do"){
							$scope.param = "?curDispNo=" + ( $scope.testParam.curDispNo || '' );
					 }

					 if ($scope.share_path == "/brand/bestbrandSub.do"){
						 $scope.param = "?curDispNo=" + ( $scope.testParam.curDispNo || '' );
					 }

					 if($scope.share_path == "/mall/samsung/bestsamsung_main.do"){
						 $scope.param = "?curDispNo=" + ( $scope.testParam.curDispNo || '' );
					 }

					 if($scope.share_path == "/mall/samsung/bestsamsung_sub.do"){

						$scope.param = "?curDispNo=" + ( $scope.testParam.curDispNo || '' );

					 }


					switch($scope.share_path){
						// 스타일추천
						case LotteCommon.styleRecomUrl:
						// K샵형
						case LotteCommon.specialMallUrl:
						case LotteCommon.specialSubUrl:
							if(obj != undefined && obj.shareImg != undefined){
								$scope.share_img = obj.shareImg;
							}
							$scope.param = "?" + getParamString();
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
					} else if ($scope.share_path == "/category/m/brand_prod_list.do"){
						$scope.noCdnUrl = location.protocol + "//" + location.hostname + "/category/m/brand_prod_list.do" + $scope.param + "curDispNoSctCd=" + ( $scope.testParam.curDispNoSctCd || '' ) + "&cn=123624";
					} else if ($scope.share_path == "/brand/bestbrandMain.do"){
						$scope.noCdnUrl = location.protocol + "//" + location.hostname + "/brand/bestbrandMain.do" + $scope.param + "curDispNo=" + ( $scope.testParam.curDispNo || '' ) + "&cn=123624";
					} else if ($scope.share_path == "/brand/bestbrandSub.do"){
						$scope.noCdnUrl = location.protocol + "//" + location.hostname + "/brand/bestbrandSub.do" + $scope.param + "curDispNo=" + ( $scope.testParam.curDispNo || '' ) + "&cateSelected=" + ($scope.testParam.cateSelected || '' ) + "&cn=123624";
					} else if($scope.share_path == "/mall/samsung/bestsamsung_sub.do"){
						$scope.noCdnUrl = location.protocol + "//" + location.hostname + $scope.share_path + $scope.param + "&cateSelected=" + ($scope.testParam.cateSelected || '' ) + "&cn=123624";
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

					// Tclick 처리
					if (obj.tclick) {
						$scope.sendTclick(obj.tclick);
					} else {
						if ($scope.share_path == "/mall/pet/dearpet_gallery.do") {
							$scope.sendTclick( 'm_DC_SpeDisp_Dearpet_Clk_Shr' + $scope.testParam.curDispNo );
						} else if ($scope.share_path == "/brand/bestBrandMain.do" || $scope.share_path == "/brand/bestBrandSub.do") {
							$scope.sendTclick( 'm_DC_' + $scope.screenID + '_' + $scope.mallID + '_share' );
						}else if($scope.share_path =="/mall/samsung/bestsamsung_main.do" || $scope.share_path == "/mall/samsung/bestsamsung_sub.do"){
							$scope.sendTclick( 'm_DC_SpeMall_Samsung_share' );
						} else { // 그 외 모두
							//$scope.sendTclick( 'm_header_new_SNS' );
							$scope.sendTclick( 'm_RDC_ProdDetail_Clk_SNS' );
						}
					}


					$scope.dimmedOpen({
						target : "pop_sns",
						callback: this.hideSharePop
					});
					$scope.LotteDimm.dimmedOpacity = "0.6";
					$timeout(function() {
						angular.element("#lotteDimm").css("z-index", "110");
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


				/**
				 * 파라메터 생성하기
				 */
				function getParamString(){
					var param = getUrlParams();
					var strip = ["c", "cdn", "cn", "schema", "tclick", "udid", "v"];
					var str = "";
					var div = "";
					for(var key in param){
						if(strip.indexOf(key) >= 0){ continue; }
						str += div + key + "=" + param[key];
						div = "&";
					}
					return str;
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
