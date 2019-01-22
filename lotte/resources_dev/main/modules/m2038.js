// M38 빅딜 전체..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2038Container', ['$rootScope', '$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($rootScope, $http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2038.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.loginInfo = $scope.rScope.loginInfo;
				$scope.matchDispNo = true; // 20180731 현재 페이지 DispNo 와 로드 DispNo 비교값

				if (!$scope.moduleData.uiData) {
                    var moduleIndex = 0;
                    //빅딜  외부에서 카테고리를 지정한 경우 
                    if($scope.moduleData.ctgDispNo){
                        for(var k=0; k<$scope.moduleData.ctgList.items.length; k++){
                            if($scope.moduleData.ctgList.items[k].dispNo == $scope.moduleData.ctgDispNo){
                                moduleIndex = k;   
                            }
                        }
                    }                    
					$scope.moduleData.uiData = {
						page: 1,
						tabIdx : moduleIndex,		// 메인 카테고리 선택값
						selectSubIdx : 0,	// 서브 카테고리 선택값
						isRecomChk: false,	// 회원님 추천순
						isLastPage: false,
						tabDispNo: $scope.moduleData.ctgList.items[moduleIndex].dispNo,
						pageDispNo: attrs.pageDispNo,
						lastCallUrl: $scope.moduleData.ctgList.items[moduleIndex].linkUrl
					}                                        
				}
				
				$timeout(function() {
					$scope.setSliderIdxPos($scope.moduleData.uiData.tabIdx, true);
				},100);
				
				// 탭 클릭
				$scope.tabClick = function (e, index, linkUrl) {
					console.log("1");
					$scope.moduleData.uiData.tabIdx = index;
					$scope.moduleData.uiData.tabDispNo = this.item.dispNo;
					$scope.rScope.sendTclick($scope.moduleData.tclick + '_' + this.item.dispNo + '_Clk_Bigcate');
					
					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2038.json" : linkUrl;
					$scope.loadData(jsonUrl);
					$scope.moduleData.uiData.selectSubIdx = 0; // 서브 카테고리 초기화

					$scope.rScope.pageUI.curDispNoSctCd = this.item.curDispNoSctCd;
					$scope.rScope.pageUI.curDispNo = this.item.dispNo;

					$scope.setSliderIdxPos(index, false); // 200 animateTime
				};

				$scope.subTabClick = function(e, index, linkUrl) {
					console.log('subTabClick', e, index);

					$scope.moduleData.uiData.selectSubIdx = index;
					$scope.moduleData.uiData.tabDispNo = this.item.dispNo;

					$scope.rScope.sendTclick($scope.moduleData.tclick + '_' + this.item.dispNo + '_Clk_Midcate');
					
					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2038_2.json" : linkUrl;
					$scope.loadData(jsonUrl);

					$scope.rScope.pageUI.curDispNoSctCd = this.item.curDispNoSctCd;
					$scope.rScope.pageUI.curDispNo = this.item.dispNo;
				};

				function recomData() {
					var rtnObj = {};

					rtnObj.bigdata = "Y";
					rtnObj.dispNo = $rootScope.pageUI.curDispNo;
					rtnObj.mbrNo = $scope.rScope.loginInfo.mbrNo;

					if ($scope.rScope.loginInfo.privateBigDeal) {
						rtnObj.privateBigDeal = $scope.rScope.loginInfo.privateBigDeal;
					}

					return rtnObj;
				}

				$scope.recomCheck = function() {
					$scope.moduleData.uiData.isRecomChk = !$scope.moduleData.uiData.isRecomChk;

					var jsonUrl = $scope.moduleData.ctgList.items[0].linkUrl;
					var tclick;
					var url;
					var dataObj = null;
					var type = "get";

					console.log('$scope.isRecomChk', $scope.moduleData.uiData.isRecomChk);

					$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_personalization');
					
					if ($scope.moduleData.uiData.isRecomChk) {
						// jsonUrl += '&bigdata=Y&dispNo='+$scope.moduleData.uiData.pageDispNo+'&mbrNo='+$scope.rScope.loginInfo.mbrNo; // 회원님 추천순
						jsonUrl += '&bigdata=Y';
						type = "post";

						dataObj = recomData();
						
						url = LotteCommon.isTestFlag ? "/json/main/main_m2038_3.json" : jsonUrl;
					} else {
						url = LotteCommon.isTestFlag ? "/json/main/main_m2038.json" : jsonUrl;
					}

					$scope.loadData(url, type, dataObj);
				};

				$scope.loadMoreData = function() {
					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2038.json" : $scope.moduleData.uiData.lastCallUrl + "&page=" + $scope.moduleData.uiData.page;
			
					var httpConfig = {
						method: "get",
						url: jsonUrl
					};

					// 개인화 More 페이지 적용
					if ($scope.moduleData.uiData.isRecomChk) {
						jsonUrl += '&bigdata=Y';

						httpConfig.method = "post";
						dataObj = recomData();

						httpConfig.data = dataObj;
					}

					httpConfig.url = jsonUrl;
					
					$scope.ajaxLoadFlag = true;						
					
					$http(httpConfig) 
					.success(function (data) {
						console.log("data", data);
						if (data.moduleData[0]) {
							if (data.moduleData[0].dealList) {
								for (var i = 0; i < data.moduleData[0].dealList.items.length; i++) {
									$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].dealList.items.push(data.moduleData[0].dealList.items[i]);
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
				
				// Data Load
				$scope.loadData = function (jsonUrl, type, data) {
					$scope.moduleData.uiData.page = 1;
					$scope.moduleData.uiData.isLastPage = false;
					$scope.moduleData.uiData.lastCallUrl = jsonUrl;

					//console.log('loadData', jsonUrl);
                    if(location.host == "mo.lotte.com"){
                        jsonUrl += "&flag=stage";
                    }
					
                    var httpConfig = {
						method: "get",
						url: jsonUrl
					};

					if (type) {
						httpConfig.method = type;
					}

					if (data) {
						httpConfig.data = data;
					}
					
					$scope.ajaxLoadFlag = true;

					$http(httpConfig)
					.success(function (data) {
//							$scope.moduleData.blankCd = data.moduleData[0].blankCd;
//							$scope.moduleData.dealList = data.moduleData[0].dealList;
//							$scope.moduleData.tclick = data.moduleData[0].tclick;
//							$scope.moduleData.subCtgList = data.moduleData[0].subCtgList;                        
						$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].blankCd = data.moduleData[0].blankCd;
						$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].dealList = data.moduleData[0].dealList;
						$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].tclick = data.moduleData[0].tclick;
						$rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].subCtgList = data.moduleData[0].subCtgList;
						//console.log("data", data);
					})
                    .error(function(e) {
                        //alert("error:" + e);
                        $rootScope.pageUI.storedData[$scope.moduleData.uiData.pageDispNo].moduleData[0].dealList.items = [];
				    })
					.finally(function () {
						$scope.ajaxLoadFlag = false;
					});
				};

				var $cont = angular.element("body")[0];

				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					if($scope.moduleData.uiData.isLastPage===true){ return; }
						// 20180731 데이터 호출 URL 에서 페이지 DispNo 비교
						var matchDp = $scope.moduleData.uiData.lastCallUrl.split("?")[1];
						matchDp = matchDp.split('&')[0];
						
						$scope.matchDispNo = (matchDp.indexOf($scope.rScope.pageUI.curTabMenuDispNo) > 0) ? true : false;

					if (!$scope.ajaxLoadFlag && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight && args.scrollPos != 0 && $scope.matchDispNo) {
						console.log("more scroll;;;;;");
						$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo + '_Clk_load' + $scope.numberFill(($scope.moduleData.uiData.page + 1), 2));

						var gaMoreLoadTagging = "";

						// 빅딜 대카
						if ($scope.moduleData.ctgList && $scope.moduleData.ctgList.items) {
							gaMoreLoadTagging = $scope.moduleData.ctgList.items[$scope.moduleData.uiData.tabIdx].dispNm;
						}

						// 빅딜 중카
						if ($scope.moduleData.subCtgList && $scope.moduleData.subCtgList.items && $scope.moduleData.subCtgList.items[$scope.moduleData.uiData.selectSubIdx]) {
							gaMoreLoadTagging += "_" + $scope.moduleData.subCtgList.items[$scope.moduleData.uiData.selectSubIdx].dispNm;
						}

						$scope.logGAEvtModuleEach($scope.moduleData.uiData.page + 1, '추가로드', gaMoreLoadTagging,'추가로드');
						
						$scope.moduleData.uiData.page++;
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
				$scope.setSliderIdxPos = function(sliderIdx, disableAnimation){
					console.log('sliderIdx', sliderIdx);
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

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabName, type) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";
					var tabNm = tabName ? tabName : "";
					var tit = type ;
					// if (labelTxt == "추천" && $scope.moduleData.uiData.isRecomChk) {
					// 	tabNm += "(개인화)";
					// }
					console.log("로드 회수 %o 라벨 %o 그룹명 %o 타입 %o",idx, labelTxt, tabName, type);
					if (idx != "-") {
					
						index = (type != "개인화") ? tit + "_"+ LotteUtil.setDigit(idx) :idx + "_" + tit;
					}

					label = (label + "").replace(/\n/gi, " ");
					
					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule(tabNm + "|빅딜", index, label);
				};
			}
		}
	}]);
    app.filter('cutStrLen', [function(){
        return function(str, len) {
            var reStr = "";
            if(str.len <= len) reStr = str;
            else reStr = str.substring(0, len);

            return reStr;
        }
    }]); 
	app.filter('dealFlagName', function () {
		return function (flag) {
			var flagName;
			// "flag": [ "dept", "himart", "tvhome", "freeDlv", "present", "smartpick"]
			// 롯데백화점, 하이마트, 롯데홈쇼핑, 무료배송, 선물포장, 스마트픽
			switch(flag){
				case 'dept': flagName = '롯데백화점'; break;
				case 'himart': flagName = '하이마트'; break;
				case 'tvhome': flagName = '롯데홈쇼핑'; break;
				case 'freeDlv': flagName = '무료배송'; break;
				case 'present': flagName = '선물포장'; break;
				case 'smartpick': flagName = '스마트픽'; break;
			}
			return flagName;
		}
	});
})(window, window.angular);