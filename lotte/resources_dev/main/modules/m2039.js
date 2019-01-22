// M39 판매베스트(베스트)..
(function(window, angular, undefined) {
	'use strict';
	
	var app = angular.module('app');
	app.directive('m2039Container', ['$http', '$rootScope', '$timeout', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteCookie', 'LotteStorage', 'LotteUtil', 'LotteUserService',
	function ($http, $rootScope, $timeout, $window, $location, LotteCommon, commInitData, LotteCookie,   LotteStorage, LotteUtil, LotteUserService) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2039.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.loginInfo = $scope.rScope.loginInfo;

				$scope.categoryPageing = function(catData, depth) {
					var pageData = [];
					var j = 0;
					pageData[j] = [];

					for (var i = 0; i < catData.length; i++) {
						pageData[j].push(catData[i]);

						if (((i + 1) % 6) == 0) {
							j++;

							if (i + 1 != catData.length) {
								pageData[j] = [];
							}
						}

						if (catData[i].isSelect) {
							$scope.moduleData.uiData.selectbox_idx[depth] = i;
						}
					}

					if (catData.length % 6 != 0) {
						for (var i = 0; i < 6 - (catData.length % 6); i++) {
							pageData[j].push({});
						}
					}

					return pageData;
				};
				
				$scope.categoryRepack = function(dep) {
					var catData = {};

					switch(dep) {
						case 0:
							catData = $scope.categoryPageing($scope.moduleData.dep1CtgList.items, 0);
							$scope.moduleData.cateData[0] = catData;
							break;
						case 1:
							catData = $scope.categoryPageing($scope.moduleData.dep2CtgList.items, 1);
							$scope.moduleData.cateData[1] = catData;
							break;
						case 2:
							catData = $scope.categoryPageing($scope.moduleData.dep3CtgList.items, 2);
							$scope.moduleData.cateData[2] = catData;
							break;
					}
				};
				
				if (!$scope.moduleData.uiData) {
					$scope.moduleData.uiData = {
						tabIdx: 0,
						depth_idx : 0, // 카테고리 depth
						selectbox_select_idx : 0,
						selectbox_idx: [],
						page: 1,
						userSex: "A",
						userSexIdx: 1,
						userAge: "A",
						userAgeIdx: 1,
						dispNo: $scope.moduleData.dep1CtgList.items[0].dispNo,
						rankingCtgOpenFlag: true,
						rankingCtgBoxShow: false,
						isLastPage: false,
						pageDispNo: attrs.pageDispNo,
						lastCallUrl: $scope.moduleData.dep1CtgList.items[0].linkUrl,
						showAlert: false
					};

					// 마이추천에서 성별나이 파라미터 달고 온 경우
					if (commInitData.query["dispNo"] == "5572537" && (commInitData.query["age"] || commInitData.query["gender"]) && !angular.element(document.body).data('open5572537')) {
						angular.element(document.body).data('open5572537', true);
						$scope.moduleData.uiData.userSex = commInitData.query["gender"] || "F";
						$scope.moduleData.uiData.userSexIdx = getGenderIndex($scope.moduleData.uiData.userSex);
						$scope.moduleData.uiData.userAge = commInitData.query["age"] || "A";
						$scope.moduleData.uiData.userAgeIdx = getAgeIndex($scope.moduleData.uiData.userAge);
					}

					$scope.moduleData.cateData = [];
					$scope.categoryRepack(0);
				}
				
				function getGenderIndex(str){
					if (str == "F") {
						return 2;
					} else if (str == "M") {
						return 3;
					}

					return 1;
				}
				
				function getAgeIndex(str) {
					var _str = str;
					if(str != "A") _str = parseInt(str);
					if (_str == "A") {
						return 1;
					} else if (_str >= 5 && _str < 30) {
						return 2;
					} else if (_str >= 30 && _str < 40) {
						return 3;
					} else if(_str >= 40 && _str < 50) {
						return 4;
					} else if(_str >= 50 && _str < 99) {
						return 5;
					}
				}

				function getAge(age){
					if(age == "A"){
						return "A";
					}else if(age >= 5 && age < 30){
						return "20";
					} else if(age >= 30 && age < 40){
						return "30";
					} else if(age >= 40 && age < 50){
						return "40";
					} else if(age >= 50 && age < 60){
						return "50";
					}
				};

				$timeout(function() {
					$scope.setSliderIdxPos($scope.moduleData.uiData.tabIdx, true);
				}, 100);

				/*$scope.rankOptionChange = function() {
					$scope.loadCategoryData($scope.moduleData.uiData.lastCallUrl);
				}*/

				// 커스텀 Select UI
				$scope.genderOpened = false;
				$scope.genderNames = [
					{txt:'성별'},
					{txt:'성별 전체', code:'A'},
					{txt:'여성', code:'F'},
					{txt:'남성', code:'M'}
				];

				$scope.ageOpened = false;
				$scope.ageNames = [
					{txt:'연령'},
					{txt:'연령 전체', code:'A'},
					{txt:'20대', code:'20'},
					{txt:'30대', code:'30'},
					{txt:'40대', code:'40'},
					{txt:'50대', code:'50'}
				];

				$scope.genderClick = function() {
					$scope.genderOpened = true;
					$scope.ageOpened = false;
				};
				
				$scope.genderItemClick = function (index, $event) {
					$scope.genderOpened = $scope.ageOpened = false;
					if (index == 0) {
						return;
					} // 제목 선택시 리턴
					$scope.moduleData.uiData.userSexIdx = index;

					switch (index) {
						case 1: // 성별 전체
							$scope.moduleData.uiData.userSex = 'A';
							break;
						case 2: // 여성
							$scope.moduleData.uiData.userSex = 'F';
							break;
						case 3: // 남성
							$scope.moduleData.uiData.userSex = 'M';
							break;
					}

					$event.stopPropagation();
					$scope.rScope.sendTclick($scope.moduleData.tclick +"_"+ $scope.moduleData.uiData.dispNo + '_sort'+$scope.moduleData.uiData.userSex+"_"+$scope.moduleData.uiData.userAge);
					$scope.loadCategoryData($scope.moduleData.uiData.lastCallUrl);
				};

				$scope.ageClick = function() {
					$scope.ageOpened = true;
					$scope.genderOpened = false;
				};

				$scope.ageItemClick = function (index, $event) {
					$scope.genderOpened = $scope.ageOpened = false;
					if (index == 0) {
						return;
					} // 제목 선택시 리턴

					$scope.moduleData.uiData.userAgeIdx = index;

					switch (index) {
						case 1: // 연령 전체
							$scope.moduleData.uiData.userAge = 'A';
							break;
						case 2: // 20대
							$scope.moduleData.uiData.userAge = '20';
							break;
						case 3: // 30대
							$scope.moduleData.uiData.userAge = '30';
							break;
						case 4: // 40대
							$scope.moduleData.uiData.userAge = '40';
							break;
						case 5: // 50대
							$scope.moduleData.uiData.userAge = '50';
							break;
					}

					$event.preventDefault();
					$scope.rScope.sendTclick($scope.moduleData.tclick + "_" + $scope.moduleData.uiData.dispNo + '_sort' + $scope.moduleData.uiData.userSex+"_" + $scope.moduleData.uiData.userAge);
					$scope.loadCategoryData($scope.moduleData.uiData.lastCallUrl);
				};

				$scope.ctgSelectBoxClick = function(depth) {
					if ($scope.moduleData.uiData.rankingCtgOpenFlag) {
						if ($scope.moduleData.uiData.selectbox_select_idx == depth) {
							$scope.moduleData.uiData.rankingCtgOpenFlag = false;
							return;
						}
					}

					/**
					 * DOM 보이기전 슬라이드 영역 잡혀 좌측 셀이 커지는 현상때문에 슬라이드 영역 다시 그리기
					 */
					var swiper = el.find('#rankSwipeCtg2 ul');

					$timeout(function () {
						// console.log(swiper, swiper.scope());
						swiper.scope().resetSwipePos();
					});

					$scope.moduleData.uiData.rankingCtgOpenFlag = true;
					$scope.moduleData.uiData.selectbox_select_idx = depth;
				};
				
				$scope.loadMoreData = function() {
					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_bestcategory.json" : $scope.moduleData.uiData.lastCallUrl + "&gender=" + $scope.moduleData.uiData.userSex + "&age=" + $scope.moduleData.uiData.userAge + "&page=" + $scope.moduleData.uiData.page;

					var httpConfig = {
						method: "get",
						url: jsonUrl
					};
					
					$scope.ajaxLoadFlag = true;
					
					$http(httpConfig) 
					.success(function (data) {
						if (data.moduleData[0]) {
							if (data.moduleData[0].prdList) {
								for (var i = 0; i < data.moduleData[0].prdList.items.length; i++) {
									$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].prdList.items.push(data.moduleData[0].prdList.items[i]);
								}
							} else {
								$scope.moduleData.uiData.isLastPage = true;
							}
						}
					})
					.finally(function () {
						$scope.ajaxLoadFlag = false;
					});
				};
				
				$scope.loadCategoryData = function(url) {
					$scope.moduleData.uiData.page = 1;
					$scope.moduleData.uiData.isLastPage = false;
					$scope.moduleData.uiData.lastCallUrl = url;

					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_bestcategory.json" : url + "&gender=" + $scope.moduleData.uiData.userSex + "&age=" + $scope.moduleData.uiData.userAge + "&page=" + $scope.moduleData.uiData.page;

					var httpConfig = {
						method: "get",
						url: jsonUrl
					};

					$scope.ajaxLoadFlag = true;
					
					$http(httpConfig) 
					.success(function (data) {
						if (data.moduleData) {
							$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].prdList = data.moduleData[0].prdList;

							// firstRank 데이터 저장
							if (data.moduleData[0].firstRank) {
								$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].firstRank = data.moduleData[0].firstRank;
							}

							if (data.moduleData[0].dep1CtgList) {
								$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].dep1CtgList = {};
								$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].dep1CtgList = data.moduleData[0].dep1CtgList;
								$scope.categoryRepack(0);
								$scope.moduleData.uiData.depth_idx = 0;
							}

							if (data.moduleData[0].dep2CtgList) {
								$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].dep2CtgList = {};
								$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].dep2CtgList = data.moduleData[0].dep2CtgList;
								$scope.categoryRepack(1);
								$scope.moduleData.uiData.depth_idx = 1;
								$scope.moduleData.uiData.selectbox_select_idx = 1;
							}

							if (data.moduleData[0].dep3CtgList) {
								$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].dep3CtgList = {};
								$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].dep3CtgList = data.moduleData[0].dep3CtgList;
								$scope.categoryRepack(2);
								$scope.moduleData.uiData.depth_idx = 2;
								$scope.moduleData.uiData.selectbox_select_idx = 2;
							}

							if ($scope.moduleData.uiData.depth_idx != 0) {
								$timeout(function(){
									var scope = angular.element('#rankSwipeCtg' + ($scope.moduleData.uiData.depth_idx + 1)).scope();
									scope.resetSwipePos();
									$timeout(function(){
										$scope.$apply();
									});
								}, 10);
							}
						}
					})
					.finally(function () {
						$scope.ajaxLoadFlag = false;
					});
				};
				
				$scope.ctgChange = function(item, depth) {
					if (depth == 0 && this.$index == 0) {
						$scope.moduleData.uiData.rankingCtgBoxShow = false;
					} else {
						$scope.moduleData.uiData.rankingCtgBoxShow = true;
						if(depth === 0){
							$scope.moduleData.uiData.rankingCtgOpenFlag = true;
						} else{
							$scope.moduleData.uiData.rankingCtgOpenFlag = false;
						}
					}

					$scope.moduleData.uiData.tabIdx = this.$index;
					
					if (depth == 1) {
						$scope.rScope.sendTclick($scope.moduleData.tclick + '_' + item.dispNo + '_Midcate');
					} else {
						$scope.rScope.sendTclick($scope.moduleData.tclick + '_' + item.dispNo + '_Bigcate');
					}

					$scope.moduleData.uiData.dispNo = item.dispNo;
					//$scope.moduleData.uiData.depth_idx = depth;
					// $scope.moduleData.uiData.rankingCtgOpenFlag = false;
					$scope.moduleData.uiData.page = 1;
					$scope.loadCategoryData(item.linkUrl);

					if (depth == 0){
						$scope.setSliderIdxPos(this.$index, false); // 200 animateTime
					}
				};
				
				$scope.bestTipClick = function() {
					$scope.moduleData.uiData.showAlert = !$scope.moduleData.uiData.showAlert;
					$scope.rScope.sendTclick($scope.moduleData.tclick + '_help');
				};

				var $cont = angular.element("body")[0];

				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					if ($scope.moduleData.uiData.isLastPage === true) {
						return;
					}

					if (!$scope.ajaxLoadFlag && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
						$scope.moduleData.uiData.page++;
						$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.dispNo + '_load'+$scope.numberFill($scope.moduleData.uiData.page,2));
						$scope.loadMoreData();
						// $scope.loadData(++$scope.tpmlData.uiOpt.page);
						// TCLICK
						//var tclick = $scope.getDealBaseTclick() + "load";
						//if($scope.tpmlData.uiOpt.page < 10){
						//	tclick = tclick + "0" + $scope.tpmlData.uiOpt.page;
						//}else{
						//	tclick = tclick + $scope.tpmlData.uiOpt.page;
						//}
						//$scope.sendTclick(tclick);
					}
				});

				// slider를 현재 선택된 Idx 위치로 이동함
				$scope.setSliderIdxPos = function(sliderIdx, disableAnimation) {
					// $scope.setHeaderMenuIdxPos = function (dispNo, disableAnimation) {
					$timeout(function () { // timeout을 주지 않으면 DOM 렌더링이 끝나지 않아 탭의 넓이 계산에서 오류가 나 제대로 찾아가지 못한다.
						var slider = el.find('div[lotte-slider]'),
							listWrap = slider.find('>ul'),
							list = listWrap.find('>li'),
							target = list.eq(sliderIdx),
							targetPosX = 0,
							animateTime = disableAnimation ? 0 : 200;

						if (slider.length > 0 && listWrap.length > 0 && target.length > 0 && slider.width() < listWrap.width()) {
							targetPosX = (slider.width() / 2) + listWrap.offset().left - (target.offset().left + (target.outerWidth() / 2));

							slider.scope().lotteSliderMoveXPos(targetPosX, animateTime);
						}
					}, 300);
				};

				//남성회원 일때 성별 filter 남성으로 바꾸고 데이터 불러오기
				if (LotteUserService.getLoginInfo().isLogin) {
					// 마이추천에서 성별나이 파라미터 달고 온 경우
					if (commInitData.query["dispNo"] == "5572537" && (commInitData.query["age"] || commInitData.query["gender"]) && !angular.element(document.body).data('open5572537')) {
						angular.element(document.body).data('open5572537', true);
						$scope.moduleData.uiData.userSex = commInitData.query["gender"] || "F";
						$scope.moduleData.uiData.userSexIdx = getGenderIndex($scope.moduleData.uiData.userSex);
						$scope.moduleData.uiData.userAge = commInitData.query["age"] || "A";
						$scope.moduleData.uiData.userAgeIdx = getAgeIndex($scope.moduleData.uiData.userAge);
					} else {
						// 메인2차개선 로그인 정보에 따라 데이터 로드
						if ($scope.loginInfo.genSctCd == 'M' || $scope.loginInfo.genSctCd == 'F') {
							$scope.moduleData.uiData.userSexIdx = getGenderIndex($scope.loginInfo.genSctCd); // 남성
							$scope.moduleData.uiData.userSex = $scope.loginInfo.genSctCd;
							$scope.moduleData.uiData.userAgeIdx = getAgeIndex($scope.loginInfo.mbrAge);
							$scope.moduleData.uiData.userAge = getAge($scope.loginInfo.mbrAge);
							$scope.loadCategoryData($scope.moduleData.uiData.lastCallUrl);
						}
					}
				}

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabName, type, cateNm) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";
					var tabNm = tabName ? ((cateNm) ? cateNm : tabName) : "전체";
					var tit = type ;
					if (idx != "-") {
						index = (tabName == "카테고리탭") ? type +"_"+ LotteUtil.setDigit(idx) : type + ((tabName && tabName != "전체") ? "_" + tabName : "") + ((typeof(idx) == "string") ?  "" :  '_' + LotteUtil.setDigit(idx));
					}
					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule(tabNm + "|판매베스트", index, label);
				};
			}
		}
	}]);

	/**
	 * 순위 플래그 표시 필터
	 */
	app.filter('rateTypeTxt', function () {
		return function (rateType, rate) {
			var value;

			switch(rateType) {
				case 'n': value = 'NEW';
					break;
				case 'c': value = '-';
					break;
				case 'u':
				case 'd': value = Math.abs(rate);
					break;
			}

			return value;
		}
	});
})(window, window.angular);