(function (window, angular, undefined) {
	'use strict';

	var sideCtgModule = angular.module('lotteSideCtg', []);

	sideCtgModule.controller('SideCtgCtrl', 
						['$scope', '$http', 'LotteCommon', '$window', 'LotteStorage', 'commInitData', '$timeout', 
				function ($scope ,  $http ,  LotteCommon ,  $window ,  LotteStorage ,  commInitData ,  $timeout) {
		var self = this;

		$scope.sideCtgData = {}; // 카테고리 데이터

		this.isLoadSideCtgData = false;
		
		this.gaCtgName = "MO_카테고리레이어";
		
		this.loadSideCtgData = function () {
			self.isLoadSideCtgData = true;
			// 카테고리 데이터 로드 20180322 경로 수정
			$http.get(LotteCommon.sideCtgData2018)
			.success(function (data) {
				var objTemp = data;
				var sliceData = [];
                var i;
				for(i = 0; i<objTemp.ctgAll.length; i++){
					if(objTemp.ctgAll[i].lctgs && objTemp.ctgAll[i].lctgs.length % 2 != 0){
						objTemp.ctgAll[i].lctgs.push({name:""});
					}
				}
                //브랜드에서 네임값이 없는 것 제거 
                var newBrand = [];
                if(objTemp.bestBrand){
                    for(i = 0; i < objTemp.bestBrand.length;i++){                    
                        if(!(objTemp.bestBrand[i].name == null || objTemp.bestBrand[i].name == '')){
                           newBrand.push(objTemp.bestBrand[i]);
                        }
                    }
                }
                objTemp.bestBrand = newBrand;
				$scope.sideCtgData = objTemp;
				LotteStorage.setSessionStorage("lotteSideCtgData_2017", data, "json");
			}).error(function (data) {
				console.log("탐색 데이터 로드 실패");
			});
		};

		this.getAddZero = function(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
			return num < 10 ? "0" + num : num + "";
		};

		var todayDateTime = new Date();
		$scope.intLastCtgFlagDate = 20170601;
        $scope.intTodayDate = parseInt(todayDateTime.getFullYear() + this.getAddZero(todayDateTime.getMonth() + 1) + this.getAddZero(todayDateTime.getDate()), 10); // 년월일
        
        var sessCtgData = LotteStorage.getSessionStorage("lotteSideCtgData_2017", "json");

        if (sessCtgData && sessCtgData != -1 && !commInitData.query.localtest) {
			$scope.sideCtgData = sessCtgData;
			this.isLoadSideCtgData = true;
		} else {
			$timeout(function(){
				if (!self.isLoadSideCtgData) {
					self.loadSideCtgData();
				}
			}, 400);
		}
	}]);

	sideCtgModule.directive('lotteSideCategory', ['$window', '$timeout', 'LotteCommon', 'LotteStorage', 'LotteGA', function ($window, $timeout, LotteCommon, LotteStorage, LotteGA) {
		return {
			templateUrl: '/lotte/resources_dev/layout/lotte_sidectg_2017_1.html',
			replace: true,
			controller: 'SideCtgCtrl',
			link: function ($scope, el, attrs, ctrl) {

				$scope.pageOpt = {
					curCtgDepth1Idx: -1,
					subListHeight : 0
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
					var obj = LotteStorage.getSessionStorage("lotteSideCtgUIData_1", "json");
					if(obj && obj.href2){
						obj.href2 = "";
					}
					LotteStorage.setSessionStorage("lotteSideCtgUIData_1", obj, "json");
					if ($scope.LotteDimm.target == "category") {
						$scope.dimmedClose();
					} else {
						//var tclick = "m_RDC_side_cate_Clk_close_Btn";
						$scope.actionbarHideFlag = false;
						//$scope.sendTclick(tclick);
						$scope.isShowSideCtg = false;
						LotteGA.evtTag(ctrl.gaCtgName, "설정", "닫기");
					}
				};

				// 탐색 펼침/닫힘
				$scope.showSideCategory = function () {

					if (!ctrl.isLoadSideCtgData) {
						ctrl.loadSideCtgData();
					}

					if ($scope.isShowSideCtg) {
						$scope.closeSideCtg();
						$scope.actionbarHideFlag = false;
					} else {
						$scope.isShowSideCtg = true;
						$scope.actionbarHideFlag = true;
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

				// 브랜드 검색
				$scope.goBrandSearch = function () {
					var tclick = "m_RDC_side_cate_tab_brand";
					var url = LotteCommon.brandSearchUrl+"?"+$scope.baseParam+"&tclick="+tclick;
					LotteGA.evtTag(ctrl.gaCtgName, "브랜드검색", "브랜드검색");
					$timeout(function(){
						$window.location.href = url;
					}, 200);
				};

				// 열렸던 카테고리 적용
				var objUI = LotteStorage.getSessionStorage("lotteSideCtgUIData_1", "json");
				if(objUI && objUI.curCtgDepth1Idx != null && objUI.curCtgDepth1Idx != undefined && objUI.subListHeight){
					$scope.pageOpt.curCtgDepth1Idx = objUI.curCtgDepth1Idx;
					$scope.pageOpt.subListHeight = objUI.subListHeight;
					//console.log('get subListHeight ' + objUI.subListHeight);
				}

				// 히스토리백시 카테고리 최초에 열리기
				if($scope.locationHistoryBack){
					//console.log('locationHistoryBack');
					if(objUI && objUI.href2 && objUI.href2 == location.href){
						$scope.isShowSideCtg = true;
						if (!ctrl.isLoadSideCtgData) {
							ctrl.loadSideCtgData();
						}
						$scope.dimmedOpen({
							target: "category",
							callback: $scope.closeSideCtg,
							scrollEventFlag: false
						});
						$scope.pageOpt.curCtgDepth1Idx = objUI.curCtgDepth1Idx;
						var sessCtgData = LotteStorage.getSessionStorage("lotteSideCtgData_2017", "json");
						var len = sessCtgData.ctgAll[$scope.pageOpt.curCtgDepth1Idx].lctgs.length;
						
						//201810 전문관 영역높이
						if($scope.pageOpt.curCtgDepth1Idx == 10){
							$scope.pageOpt.subListHeight = Math.ceil($targetSub.find(">li").length / 2) * ($(window).width() >= 1000 ? 108 : 78);
						}else {
							$scope.pageOpt.subListHeight = Math.ceil($targetSub.find(">li").length / 2) * ($(window).width() >= 1000 ? 66 : 45);
						}

						$timeout(function(){
							$scope.actionbarHideFlag = true;
						}, 500);
					}
				}
				// 페이지 벗어날때에 좌측카테고리 열려있는 경우 UI정보 저장
				angular.element($window).on("unload", function(e) {
                    $scope.unloadFnc();
		        });
                $scope.unloadFnc = function(){
                    console.log("unload");
					var objSess = LotteStorage.getSessionStorage("lotteSideCtgUIData_1", "json");
					var obj = {};
					obj.href = location.href;
					obj.curCtgDepth1Idx	= $scope.pageOpt.curCtgDepth1Idx;
					obj.subListHeight = $('.ctg_list_wrap .ctg_list li.on .sub_list').height();

					if($scope.isShowSideCtg){
						obj.href2 = location.href;
					}else{
						if(objSess && objSess.href2){
							obj.href2 = objSess.href2;
						}else{
							obj.href2 = '';
						}
					}
					LotteStorage.setSessionStorage("lotteSideCtgUIData_1", obj, "json"); 
                }
			}
		}
	}]);
    //추천브랜드 너비 
	sideCtgModule.filter('setSize', function() {
		return function(len) {    
            var wid = len*109+6;
            if($("#wrapper").width() >= 1024){
                wid = len*166+11;
            }
			return wid;
		}
	});
	sideCtgModule.filter('setSize2', function() {
		return function(len) {    
            var wid = len*108+2;
            if($("#wrapper").width() >= 1024){
                wid = len*162+4;
            }
			return wid;
		}
	});
	sideCtgModule.filter('substr', function() {
		return function(str) {                
            if(str.length > 8){
                str = str.substr(0, 8);
            }
			return str;
		}
	});
    
    
	// 카테고리 탭
	sideCtgModule.directive('lnbCategory', ['$window', '$timeout', 'LotteCommon', 'LotteLink', 'LotteGA', function ($window, $timeout, LotteCommon, LotteLink, LotteGA) {
		return {
			restrict: 'A',
			replace: true,
			controller: 'SideCtgCtrl',
			link: function ($scope, el, attrs, ctrl) {
				var $ctgWrap = angular.element(el),
					$ctg = angular.element(el).find(".ctg_list");
				
				// 카테고리 1Depth 선택
				$scope.ctgSelect = function (ctgDepth1Idx, name) {
					var $target = $ctg.find("li.depth1"),
						$targetSub = $target.find(">.sub_list").eq(ctgDepth1Idx);

					if ($scope.pageOpt.curCtgDepth1Idx == ctgDepth1Idx) {
						$scope.pageOpt.curCtgDepth1Idx = -1;
						$targetSub.height(0);
					} else {
						$scope.pageOpt.curCtgDepth1Idx = ctgDepth1Idx;
						$ctg.find(".sub_list").height(0);
						//201810 전문관 영역높이
						if($scope.pageOpt.curCtgDepth1Idx == 10){
							$scope.pageOpt.subListHeight = Math.ceil($targetSub.find(">li").length / 2) * ($(window).width() >= 1000 ? 108 : 78);
						}else {
							$scope.pageOpt.subListHeight = Math.ceil($targetSub.find(">li").length / 2) * ($(window).width() >= 1000 ? 66 : 45);
						}
					}
					//var tclick = 'm_RDC_side_cate_catebig_' + ctgDepth1Idx;
					//$scope.sendTclick(tclick);
					LotteGA.evtTag(ctrl.gaCtgName, name, ctrl.getAddZero(ctgDepth1Idx + 1));
				};

				/**
				 * 카테고리 링크
				 * @params {string} cateDepth 대카명
				 * @params {object} item 중카정보
				 * @params {number} index 중카순서
				 */
				$scope.goCategory = function (cateDepth, item, index) {
				
					LotteGA.evtTag(ctrl.gaCtgName, cateDepth + "_" + item.name, ctrl.getAddZero(index + 1));
					
					$timeout(function () {
						if (item.type == "mall") { // 몰 타입은 외부링크가 있을 수도 있어 (kokdeal 보험) outlink 체크

							if (item.outlink) {
								$scope.sendTclick(item.appTclick);
								LotteLink.goOutLink(item.link);
							} else {
								LotteLink.goLink(item.link, $scope.baseParam, { tclick: item.appTclick});
							}
						} else if (item.type == "ctg") { // 카테고리는 외부 링크 없음
                            
                            $scope.unloadFnc();//201804
                            
                            $window.location.href = item.appLinkUrl + "&" + $scope.baseParam + "&tclick=" + item.appTclick;
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
					exec: function (item) {
                        
                        //롯데슈퍼일경우에만 예외처리 추가 : 무조건 스토어로 이동 
                        /* 20180411 다시 제거 
                        if(item.appName == 'lottesuper'){
                            if (this.isANDROID) { // 안드로이드
                                var runMarketTimer = setTimeout(function () {
                                    $window.location.href = "https://play.google.com/store/apps/details?id=com.lottesuper.mobile";
                                }, 3000);
                                // 딥링크를 받아주는 앱이 있다면 마켓이동 타이머 클리어
                                angular.element($window).on("pagehide", function () {
                                    clearTimeout(runMarketTimer); 
                                    runMarketTimer = null;
                                    angular.element($window).off("pagehide"); 
                                });                                
                                $window.location.href = item.androidStoreUrl;
                            } else if (this.isIPHONE || this.isIPAD) { 
                                $window.location.href = item.iphoneStoreUrl;
                            } 
                        }else 
                        */
                        if(item.launchAppYn){//앱이 있는 경우
                            if (this.isANDROID) { // 안드로이드
                                $window.location.href = item.androidScheme;
                            } else if (this.isIPHONE || this.isIPAD) { // IOS                                
                                var runMarketTimer = setTimeout(function () {
                                    //앱이 없으면 마켓으로 이동 
                                    //LotteLink.goOutLink(item.iphoneStoreUrl); 
                                    $window.location.href = item.iphoneStoreUrl;
                                }, 3000);
                                // 딥링크를 받아주는 앱이 있다면 마켓이동 타이머 클리어
                                angular.element($window).on("pagehide", function () {
                                    clearTimeout(runMarketTimer); 
                                    runMarketTimer = null;
                                    angular.element($window).off("pagehide"); 
                                });                                
                                $window.location.href = item.iosAppExecUrl;
                            } else { // 그 외 단말기
                                $window.location.href = item.linkUrl;
                            }
                        }else{ //앱이 없는 경우 
                            $window.location.href = item.linkUrl;
                        }
					}
				};

				// 계열사 앱 링크
				$scope.appLink = function (item) {
					LotteGA.evtTag(ctrl.gaCtgName, "롯데패밀리앱", item.name);
					$timeout(function(){
						$scope.lotteApp.exec(item);
					}, 200);
				};

				// 브랜드 스토어 링크
				$scope.goBrandStore = function(link, tclick, index, alt){
                    LotteGA.evtTag(ctrl.gaCtgName, "추천브랜드", ctrl.getAddZero(index + 1), alt || "");
                    $timeout(function(){
                    	LotteLink.goLink(link, $scope.baseParam, { tclick: tclick});
                    }, 200);
				};
				
				// 스페셜 스토어 링크
				$scope.goSpecialStore = function(link, tclick, index, alt){
                    LotteGA.evtTag(ctrl.gaCtgName, "추천전문관", ctrl.getAddZero(index + 1), alt || "");
                    $timeout(function(){
                    	LotteLink.goLink(link, $scope.baseParam, { tclick: tclick});
                    }, 200);
				};
			}
		}
	}]);
})(window, window.angular);
