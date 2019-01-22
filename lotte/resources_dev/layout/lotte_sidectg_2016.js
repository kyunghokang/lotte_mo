(function (window, angular, undefined) {
	'use strict';

	var sideCtgModule = angular.module('lotteSideCtg', []);

	sideCtgModule.controller('SideCtgCtrl', ['$scope', '$http', 'LotteCommon', '$window', 'LotteStorage', 'commInitData',
		function ($scope, $http, LotteCommon, $window, LotteStorage, commInitData) {
		var self = this;

		$scope.sideCtgData = {}; // 카테고리 데이터

		this.isLoadSideCtgData = false;

		this.loadSideCtgData = function () {
			this.isLoadSideCtgData = true;
			var sessCtgData = LotteStorage.getSessionStorage("lotteSideCtgData", "json");

			if (sessCtgData && !commInitData.query.localtest) {
				$scope.sideCtgData = sessCtgData;
			} else {
				// 카테고리 데이터 로드
				$http.get(LotteCommon.sideCtgData2016)
				.success(function (data) {
					$scope.sideCtgData = data;
					LotteStorage.setSessionStorage("lotteSideCtgData", data, "json");
				}).error(function (data) {
					console.log("탐색 데이터 로드 실패");
				});
			}

		};
		
		function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
			return num < 10 ? "0" + num : num + "";
		}
		
		var todayDateTime = new Date();
		$scope.intLastCtgFlagDate = 20170601;
        $scope.intTodayDate = parseInt(todayDateTime.getFullYear() + getAddZero(todayDateTime.getMonth() + 1) + getAddZero(todayDateTime.getDate()), 10); // 년월일

		angular.element($window).on("load", function () {
			if (!self.isLoadSideCtgData) {
				self.loadSideCtgData();
			}
		});
	}]);

	sideCtgModule.directive('lotteSideCategory', ['$window', function ($window) {
		return {
			templateUrl: '/lotte/resources_dev/layout/lotte_sidectg_2016.html',
			replace: true,
			controller: 'SideCtgCtrl',
			link: function ($scope, el, attrs, ctrl) {
				$scope.pageOpt = {
					curTabIdx: 0,
					curCtgIdx: -1,
					curCtgDepth1Idx: -1
				};

				// Native App 탐색 메뉴 열기
				function nativeAppOpenCtg() {
					if ($scope.appObj.isAndroid) { // 안드로이드
						try {
							$window.lottebridge.showleftmenu("category");
						} catch (e) {}
					} else if ($scope.appObj.isIOS) { // 아이폰
						$window.location.href = "lottebridge://showleftmenu/category";
					}
				}

				// 탐색 닫기
				$scope.closeSideCtg = function () {
					if ($scope.LotteDimm.target == "category") {
						$scope.dimmedClose();
					} else {
						var tclick = "m_DC_side_cate_Clk_close_Btn";

						// if ($scope.appObj.isSktApp) {
						// 	tclick += "tlotte";
						// } else if ($scope.appObj.isIOS) {
						// 	tclick += "ios";
						// } else {
						// 	tclick += "and";
						// }

						$scope.sendTclick(tclick);
						$scope.isShowSideCtg = false;
					}
				};

				// 탐색 펼침/닫힘
				$scope.showSideCategory = function (tab) {
                    //20170508
                    if(tab){
                        $scope.pageOpt.curTabIdx = tab;
                    }else{
                        $scope.pageOpt.curTabIdx = 0;
                    }
                    
                    
                    
					if (!ctrl.isLoadSideCtgData) {
						ctrl.loadSideCtgData();
					}

					if ($scope.isShowSideCtg) {
						$scope.closeSideCtg();
					} else {
						$scope.isShowSideCtg = true;

						$scope.dimmedOpen({
							target: "category",
							callback: this.closeSideCtg,
							scrollEventFlag: false
						});
					}
				};

				// 탐색 펼침/닫힘 - 헤더
				$scope.showSideCtgHeader = function () {
					if ($scope.appObj.isApp) { // 앱일 경우
						nativeAppOpenCtg();
					} else { // 웹일 경우
						$scope.sendTclick($scope.getHeadTclick("new_cate"));
						//$scope.sendTclick($scope.tClickBase + "header_new_cate");
						$scope.showSideCategory(); // 탐색 Toggle
					}
				};

				// 카테고리/브랜드 탭 변경
				$scope.tabChange = function (type) {
					var tclick = "m_DC_side_cate_tab_";

					tclick += type == "brd" ? "brand" : "category";

					// if ($scope.appObj.isSktApp) {
					// 	tclick += "tlotte";
					// } else if ($scope.appObj.isIOS) {
					// 	tclick += "ios";
					// } else {
					// 	tclick += "and";
					// }

					$scope.sendTclick(tclick);
					$scope.pageOpt.curTabIdx = type == 'brd' ? 1 : 0;
				};
			}
		}
	}]);

	// 카테고리 탭
	sideCtgModule.directive('lnbTabCategory', ['$window', '$timeout', 'LotteCommon', 'LotteLink', function ($window, $timeout, LotteCommon, LotteLink) {
		return {
			restrict: 'A',
			replace: true,
			link: function ($scope, el, attrs) {
				var $ctgWrap = angular.element(el),
					$ctg = angular.element(el).find(".ctg_list");

				// 카테고리 1Depth 선택
				$scope.ctgSelect = function (ctgIdx, ctgDepth1Idx) {
					var $target = $ctg.eq(ctgIdx).find("li.depth1"),
						$targetSub = $target.find(">.sub_list").eq(ctgDepth1Idx);

					if ($scope.pageOpt.curCtgIdx == ctgIdx && $scope.pageOpt.curCtgDepth1Idx == ctgDepth1Idx) {
						$scope.pageOpt.curCtgIdx = -1;
						$scope.pageOpt.curCtgDepth1Idx = -1;
						$targetSub.height(0);
					} else {
						$scope.pageOpt.curCtgIdx = ctgIdx;
						$scope.pageOpt.curCtgDepth1Idx = ctgDepth1Idx;
						$ctg.find(".sub_list").height(0);
						$targetSub.height($targetSub.find(">li").length * 43);

						// console.log($target.eq(ctgDepth1Idx).offset().top - $ctgWrap.offset().top, $ctgWrap.scrollTop() + $target.eq(ctgDepth1Idx).offset().top);
						// var targetPosY = $ctgWrap.scrollTop() - ($target.eq(ctgDepth1Idx).offset().top - $ctgWrap.offset().top);

						// $timeout(function () {
						// 	$ctgWrap.scrollTop(targetPosY);
						// }, 500);
					}
				};

				/**
				 * 카테고리 링크
				 * @params {string} type 링크타입 (ctg/mall)
				 * @params {string} name 링크카테고리명
				 * @params {string} link cth : 연결 카테고리 번호, mall : 연결 링크
				 * @params {boolean} outlinkFlag 외부링크 여부
				 */
				$scope.goCategory = function (type, ctgType, cateDepth,name,link, outlinkFlag) {
					$scope.closeSideCtg();

					$timeout(function () {
						if (type == "mall") { // 몰 타입은 외부링크가 있을 수도 있어 (kokdeal 보험) outlink 체크
							var tclick = "m_DC_side_cate_specialshop_";

							switch (name) {
								case "롯데 브랜드관": tclick += "LotteBrand"; break;
								case "특별한 맛남": tclick += "Specialfood"; break;
								case "LEGO": tclick += "LEGO"; break;
								case "도서": tclick += "Book"; break;
								case "K.shop": tclick += "Kshop"; break;
								case "GUCCI": tclick += "Gucci"; break;
								case "텐바이텐": tclick += "10x10"; break;
								case "1200m": tclick += "1200m"; break;
								case "1300k": tclick += "1300k"; break;
								case "Vine": tclick += "Vine"; break;
								case "kokdeal": tclick += "Kokdeal"; break;
                                case "Dear Pet": tclick += "Petshop"; break;
                                case "맞춤셔츠": tclick += "customshirts"; break; //20160629 추가
                                //case "하이마트": tclick += "Himart_tlotte"; break; //20160927 추가
                                case "위즈위드": tclick += "WIZWID"; break; //20160927 추가
                                case "TV아울렛": tclick += "Loutlets"; break; //20170103 추가
                                case "두피전문관": tclick += "scalpcare"; break; //20170317 추가
                                case "쌤소나이트": tclick += "samsonite"; break; //20170418 추가
                                case "아모레퍼시픽": tclick += "amorepacific"; break; //20170518 추가
							}

							if (outlinkFlag) {
								$scope.sendTclick(tclick);
								LotteLink.goOutLink(link);
							} else {
								LotteLink.goLink(link, $scope.baseParam, { tclick: tclick});
							}
						} else if (type == "ctg") { // 카테고리는 외부 링크 없음
							var tclick = "m_DC_side_cate_catebig_";

							if (ctgType == "dept") {
								tclick += "dept_";
							}

							//명품화장품 링크 수정
							if (link == '5537279' || link == '5537965') {
								var cateMid = LotteCommon.cateMidBeauty;
							} else {
								var cateMid = LotteCommon.cateMidAngul;
							}
							// 애완용품인 경우 디어펫으로 이동
							if(link == '5548848'){
								LotteLink.goLink(LotteCommon.petMallMainUrl , $scope.baseParam, {
									dispNo: '5553935',
									tclick: tclick + link
								});
							}else{
								LotteLink.goLink(cateMid, $scope.baseParam, {
									curDispNo: link,
									cateDepth1: encodeURI(cateDepth), //20160627 대카추가
									title: encodeURI(name), //중카
									cateDiv: "MIDDLE",
									idx: "1",
									tclick: tclick + link
								});
							}
						}
					}, 100);
				};

				/**
				 * APP 링크 (APP이 없을 경우 마켓으로 이동)
				 */
				$scope.lotteApp = {
					/* isApp: false, //브라우저가 아닌 앱으로 접속했는지 여부. 현재 사용안함 */ 
					isIPHONE: $scope.appObj.isIOS && !$scope.appObj.isIpad,
					isIPAD: $scope.appObj.isIOS && $scope.appObj.isIpad,
					isANDROID: $scope.appObj.isAndroid,
					scheme: '',
					appStoreUrl: '',
					init : function (who) {
						switch (who) {
							case 'lotte':
								if (this.isANDROID) {
									this.scheme = 'intent://m.lotte.com/main.do?cn=23&cdn=537217#Intent;scheme=mlotte001;action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;category=android.intent.category.BROWSABLE;package=com.lotte;end';
								} else if (this.isIPHONE) {
									this.scheme = 'mlotte001://m.lotte.com/main.do?cn=23&cdn=537217';
									this.appStoreUrl = 'http://itunes.apple.com/app/id376622474?mt=8';
								} else if (this.isIPAD) {
									this.scheme = 'mlotte003://m.lotte.com/main.do?cn=145524&cdn=2911590';
									this.appStoreUrl = 'http://itunes.apple.com/app/id447799601?&mt=8';
								} 
								break;
							case 'ellotte':
								if (this.isANDROID) {
									this.scheme = 'intent://m.ellotte.com/main.do?cn=152726&cdn=3112669#Intent;scheme=ellotte002;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.ellotte;end';
								} else if (this.isIPHONE || this.isIPAD) {
									this.scheme = 'ellotte001://m.ellotte.com/main.do?cn=152726&cdn=3112669';
									this.appStoreUrl = 'http://itunes.apple.com/kr/app/id902962633?mt=8';
								} 
								break;
							case 'smp':
								if (this.isANDROID) {
									this.scheme = 'intent://m.lotte.com/main_smp.do?cn=116824&cdn=601848&smp_yn=Y#Intent;scheme=splotte002a;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.smartpick2a;end'
								} else if (this.isIPHONE || this.isIPAD) {
									this.scheme = 'splotte001://m.lotte.com/main_smp.do?cn=116824&cdn=601848&smp_yn=Y';
									this.appStoreUrl = 'https://itunes.apple.com/app/id483508898'; 
								} 
								break;
							case 'lottedfs':
								if (this.isANDROID) {
									this.scheme = 'intent://chindex#Intent;scheme=lottedutyfree;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.lottedutyfree;end';
								} else if (this.isIPHONE || this.isIPAD) {
									this.scheme = 'lottedfs://m.lottedfs.com/handler/Index?CHANNEL_CD=303396';
									this.appStoreUrl = 'https://itunes.apple.com/app/losdemyeonsejeom/id492083651?mt=8';
								}
								break;
							case 'lottesuper':
								if (this.isANDROID) {
									this.scheme = 'intent://order?redirect=http://m.lottesuper.co.kr/handler/Index-Start?CHL_NO=M385701&AFCR_NO=110682#Intent;scheme=lottesuper;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lottesuper.mobile;end';
								} else if (this.isIPHONE || this.isIPAD) {
									this.scheme = 'lottesuper://order?redirect=http://m.lottesuper.co.kr/handler/Index-Start?CHL_NO=M385701&AFCR_NO=110682';
									this.appStoreUrl = 'https://itunes.apple.com/app/losdemobailsyupeo/id618095243?mt=8'; 
								}
							break;
						}
					},
					getIframe: function (id, url) {
						var iframe = document.getElementById(id);

						if (iframe !== null) {
							iframe.parentNode.removeChild(iframe);
						}

						iframe = document.createElement('iframe');
						iframe.id = id;
						iframe.style.visibility = 'hidden';
						iframe.style.display = 'none';
						iframe.src = url;

						return iframe;
					},
					exec: function (who, url) {
						this.init(who);

						if (who == "uniqlo") { // 유니클로일 경우 예외처리
							LotteLink.goOutLink(url); // 웹으로 연결 (새창)
							return false;
						}

						if (this.isANDROID) { // 안드로이드
							$window.location.href = this.scheme;
						} else if (this.isIPHONE || this.isIPAD) { // IOS
							var url = this.appStoreUrl;

							setTimeout(function () {
								window.location = url;
							}, 500);

							var iframe = this.getIframe("lotteAppIframe", this.scheme);
							document.body.appendChild(iframe);
						} else { // 그 외 단말기
							//outLink(url); // 웹으로 연결
							LotteLink.goOutLink(url); // 웹으로 연결 (새창)
						}
					}
				};

				// 계열사 앱 링크
				$scope.appLink = function (appName, linkUrl, tclick) {
					$scope.sendTclick(tclick);
					$scope.lotteApp.exec(appName, linkUrl);
				};
			}
		}
	}]);

	// 브랜드 탭
	sideCtgModule.directive('lnbTabBrand', ['$http', 'LotteCommon', 'LotteLink', function ($http, LotteCommon, LotteLink) {
		return {
			restrict: 'A',
			replace: true,
			link: function ($scope, el, attrs) {
				var $srhBrdKeyword = angular.element(el).find("#srhBrdKeyword");

				$scope.srhBrdKeyword = "";
				$scope.srhKey = {
					type: "kor",
					resultType: "",
					btnSelectIdx: -1,
					kor: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
					eng: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
				};
				$scope.resultShow = false; // 검색 결과 영역 노출 여부
				$scope.srhResultKeyword = "";
				$scope.srhResultList = [];
				$scope.srhResultCnt = 0;
				$scope.srhListLoading = false; // AJAX Load Flag

				// 브랜드 검색 키 버튼 한글자음/알파벳 변경
				$scope.srhKeyChange = function (lang) {
					$scope.srhKey.type = lang;
				};

				// 버튼 검색 : LotteCommon.sideCtgBrandData
				// 키워드 검색 : LotteCommon.sideCtgBrandSearch

				// 브랜드 검색
				$scope.srhBrand = function () {
					var keyword = $srhBrdKeyword.val(), keyBlank = keyword.match(/\s/g);
					if(keyBlank != null && keyBlank.length == keyword.length){//공백만 있는경우
						alert('검색어를 입력해주세요.');
						$srhBrdKeyword.val('').trigger("focus");
					}else if ($scope.srhBrdKeyword.length < 1 ) {
						alert('검색을 위해서는 1글자 이상의 단어를 입력하여 주시기 바랍니다.');
						$srhBrdKeyword.trigger("focus");
					} else {
						$srhBrdKeyword.trigger("blur"); // 소프트 키보드를 내리기 위하여 focus 해제
						$scope.srhKey.btnSelectIdx = -1; // 버튼 검색 인덱스 초기화
						$scope.srhKey.resultType = ""; // 버튼 검색 언어 타입 초기화
						$scope.srhResultList = []; // 검색결과 리스트 초기화
						$scope.srhResultCnt = 0; // 검색결과 개수 초기화

						$scope.srhListLoading = true; // AJAX Load Flag
						$scope.sendTclick("m_DC_side_brand_brandsearch"); // Tclick

						$http.get(LotteCommon.sideCtgBrandSearch, {params: {sch_nm : $scope.srhBrdKeyword}})
						.success(function (data) {
							$scope.srhListLoading = false; // AJAX Load Flag

							if (data.brandList && data.brandList.items) {
								$scope.resultShow = true; // 결과 영역 노출
								$scope.srhResultKeyword = $scope.srhBrdKeyword; // 검색결과 키워드
								$scope.srhResultList = data.brandList.items; // 검색결과 리스트

								if (data.brandList.total_count) {
									$scope.srhResultCnt = data.brandList.total_count; // 검색결과 총 개수
								} else {
									$scope.srhResultCnt = $scope.srhResultList.length; // 검색결과 총 개수
								}
							}
						})
						.error(function (data) {
							$scope.resultShow = false; // 결과 영역 감추기
							$scope.srhResultKeyword = ""; // 검색결과 키워드
							$scope.srhResultList = []; // 검색결과 리스트
						})
						.finally(function () {
							$scope.srhListLoading = false; // AJAX Load Flag
						});
					}
				};

				// 브랜드 자음/알파벳 검색
				$scope.srhBrandKey = function (lang, idx) {
					$scope.srhKey.btnSelectIdx = idx; // 검색 키워드 버튼 인덱스 활성화
					$scope.srhResultList = []; // 검색결과 리스트 초기화
					$scope.srhResultCnt = 0; // 검색결과 개수 초기화

					$scope.srhListLoading = true; // AJAX Load Flag
					$scope.resultShow = false; // 결과 영역 비노출

					var params = {
						tabIndex: lang == 'kor' ? 0 : 1,
						btnIndex: idx
					};

					var tclick = "m_DC_side_brand_";
					tclick += lang == "eng" ? "eng" : "kor";

					$scope.sendTclick(tclick + (idx + 1)); // Tclick

					$http.get(LotteCommon.sideCtgBrandData, {params: params})
					.success(function (data) {
						if (data.brandList && data.brandList.items) {
							$scope.resultShow = true; // 결과 영역 노출
							$scope.srhKey.resultType = lang;
							$scope.srhResultKeyword = $scope.srhKey.type == "kor" ? $scope.srhKey.kor[idx] : $scope.srhKey.eng[idx]; // 검색결과 키워드
							$scope.srhResultList = data.brandList.items; // 검색결과 리스트

							if (data.brandList.total_count) {
								$scope.srhResultCnt = data.brandList.total_count; // 검색결과 총 개수
							} else {
								$scope.srhResultCnt = $scope.srhResultList.length; // 검색결과 총 개수
							}
						}
					})
					.error(function (data) {
						$scope.resultShow = false; // 결과 영역 감추기
						$scope.srhResultKeyword = ""; // 검색결과 키워드
						$scope.srhResultList = []; // 검색결과 리스트
					})
					.finally(function () {
						$scope.srhListLoading = false; // AJAX Load Flag
					});
				};

				// 브랜드 링크 연결
				$scope.goBrand = function (brandNo, idx) {
					//LotteCommon.brandShopUrl + "?" + $scope.baseParam+"&upBrdNo="+brnd_no+"&idx=1&tclick=m_side_brand_"+$scope.lang+"_idx"+(idx+1)
					//brandsearch_list
					var tclick = "";

					if ($scope.srhKey.btnSelectIdx == -1 || $scope.srhKey.resultType == "") {
						tclick = "m_DC_side_brand_brandsearch_list" + (idx + 1);
					} else {
						tclick = "m_DC_side_brand_" + $scope.srhKey.resultType + "_idx" + (idx + 1);
					}

					LotteLink.goLink(LotteCommon.brandShopSubUrl, $scope.baseParam, {
						upBrdNo: brandNo,
						idx: 1,
						tclick: tclick
					});
				};
			}
		}
	}]);

})(window, window.angular);