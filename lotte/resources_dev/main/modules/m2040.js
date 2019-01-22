// M40 브랜드 즐겨찾기..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2040Container', ['$rootScope', '$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($rootScope, $http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2040.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.loginInfo = $scope.rScope.loginInfo;
				$scope.pageDispNo = attrs.pageDispNo;
			
				/** 테스트 ** /
				$scope.loginInfo = false;
				/** */

				$scope.callBackData = {};

				// Data Load
				$scope.loadData = function (params) {
					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2040.json" : $scope.moduleData.jsonCallUrl;
					var httpConfig = {
						method: "get",
						url: jsonUrl,
						params: params
					};

					$http(httpConfig)
					.success(function (data) {
						$scope.callBackData = data.data;

						/**
						 * 슬라이드 DOM이 늦게 로드되어 슬라이드 영역이 완전히 다 잡히지 않는 현상때문에 포지션 잡아줌으로 다시 그림
						 */
						var slider = el.find('div[lotte-slider]');
						console.log('slider.scope()', slider.scope());
						setTimeout(function () {
							slider.scope().reset();
						},300);
					})
					.finally(function () {
					});
				};
				
				$scope.loadData();

				// 브랜드 검색/추가
				$scope.goBrandSearch = function (tclick) {
					var url = LotteCommon.brandSearchUrl+"?"+$rootScope.$$childHead.baseParam+"&tclick="+tclick;
					$window.location.href = url;
				};

				$scope.brandClick = function(linkUrl, brandNo){
					var tclick = "";
					if($scope.isMyBrandPopOpen) {
						tclick = $scope.moduleData.tclick + '_ALL_Clk_Brd'+$scope.numberFill((this.$index+1),2);
					} else {
						if(!$scope.loginInfo.isLogin || $scope.callBackData.isBestBrand){
							tclick = $scope.moduleData.tclick + '_2_Swp_Brd'+$scope.numberFill((this.$index+1),2);
						} else {
							tclick = $scope.moduleData.tclick + '_1_Swp_Brd'+$scope.numberFill((this.$index+1),2);
						}
					}
					
					$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick);
				};

				$scope.delBrand = function (brandNo) {
					var params = {flag:'d', brnd_no:brandNo};
					$scope.loadData(params);
				};

				$scope.addBrand = function (brandNo) {
					var tclick = $scope.moduleData.tclick + '_2_Clk_Btn01';
					if(!$scope.loginInfo.isLogin){
						$scope.loginFromThis(tclick);
						return;
					}

					$scope.rScope.sendTclick(tclick);
					var params = {flag:'i', brnd_no:brandNo};
					$scope.loadData(params);
				};

				$scope.loginFromThis = function(tclick){
					// $window.location.href = LotteCommon.loginUrl + "?" + $rootScope.$$childHead.baseParam + "&dispNo="+$rootScope.pageUI.curDispNo+"&tclick=" + tclick;
					var loginFormTargetUrl = LotteCommon.loginUrl + "?";
					loginFormTargetUrl += $rootScope.$$childHead.baseParam;
					loginFormTargetUrl += "&tclick=" + tclick;
					loginFormTargetUrl += "&targetUrl=";
					loginFormTargetUrl += encodeURIComponent(LotteCommon.mainUrl + "?" + $rootScope.$$childHead.baseParam + "&dispNo=" + $scope.pageDispNo);

					$window.location.href = loginFormTargetUrl;
				};

				$scope.myBrandPopOpen = function () {
					// $scope.sendTclick($scope.tClickBase + 'footer_Clk_Btn_' + "13");
					$scope.rScope.dimmedOpen({
						target : "popup",
						callback : this.myBrandPopClose
					});

					$scope.rScope.sendTclick($scope.moduleData.tclick + '_Swp_more');
					$scope.isMyBrandPopOpen = true;
				};

				$scope.myBrandPopClose = function () {
					$scope.rScope.dimmedClose({
						target : "popup"
					});
					$scope.isMyBrandPopOpen = false;
				};

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabNm) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";
					var tabNm = (tabNm) ? tabNm : "";
					var moduleNm = (tabNm) ? $scope.moduleData.moduleNm + "_" + tabNm : $scope.moduleData.moduleNm;
					
					if (idx != "-") {
						console.log(idx)
						index = (typeof(idx) == "number") ? "브랜드_"+ LotteUtil.setDigit(idx) : idx;
					}

					label = (label + "").replace(/\n/gi, " ");
					
					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label, tabNm);
				};
			}
		}
	}]);

})(window, window.angular);