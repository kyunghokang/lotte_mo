//M26 3+4형..
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2026Container', ['$rootScope', '$timeout', '$window', '$location', 'LotteUtil', 'LotteCommon', 'LotteCookie', 'LotteStorage',
	function ($rootScope, $timeout, $window, $location, LotteUtil, LotteCommon, LotteCookie, LotteStorage) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2026.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				
				// 탭 클릭
				$scope.selectIdx = 0;

				$scope.tabClick = function(e, index) {
					$scope.selectIdx = index;
					$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_Btn'+$scope.numberFill((index+1),2));
					// $scope.$apply(); // 갱신

					// var tg_elem = $(e.target);
					/*var tElem = $(e.currentTarget);
					var li = tElem;
					console.log('li',li);
					// if(li.hasClass('on')){ return; }
					li.addClass('on').siblings().removeClass('on');*/


					/*
						$scope.tpmlData.uiOpt.isLastPage=false;
						$scope.productListLoading = true;
						var a = $(e.target);
						var li = a.parent();
						if(li.hasClass("on")){ return; }
						//li.addClass("on").siblings().removeClass("on");
						//첫번째 카테고리를 디폴트로 설정
						//if($scope.tpmlData.uiOpt.ctgDispNo != "5537338"){
						//	$scope.tpmlData.uiOpt.subCtgDispNo = $scope.tpmlData.contData.ctgList.items[0].divObjNo;
						//}
						//추천이외의 카테고리시 백화점 선택 해제
						//$scope.tpmlData.uiOpt.subCtgDispNo = null;
						console.log($scope.subctgDispNoIdx[$scope.tpmlData.uiOpt.ctgDispNo]);
						$scope.tpmlData.uiOpt.ctgDispNo = li.data("ctgDispNo");
						if($scope.tpmlData.uiOpt.ctgDispNo != "5537338"){
						$scope.tpmlData.uiOpt.deptChkFlag = false;
						}


						$scope.tpmlData.uiOpt.subCtgDispNo = $scope.subctgDispNoIdx[$scope.tpmlData.uiOpt.ctgDispNo];

						$scope.loadData(1);

						setCurDispNo(); // 전시 유입코드 세팅

						// TCLICK
						var tclick = $scope.getDealBaseTclick2() + "Clk_Btn01";
						$scope.sendTclick(tclick);
						*/
				};

				// 유닛 숨김 처리
				$scope.unitShow = true;

				for (var i = 0; i < $scope.moduleData.items.length; i++) {
					var prdList = $scope.moduleData.items[i].prdList;

					if(prdList.items.length < 2){ // 탭중 1개라도 상품이 1개이면 유닛 미노출(3개탭 중 한개라도 미노출탭이 있을 경우 유닛 미노출)
						$scope.unitShow = false;
					}
				}

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt,subIdx) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";
					if (idx != "-") {
						index = (!subIdx) ? "탭_" +  LotteUtil.setDigit(idx) : "탭_" + LotteUtil.setDigit(idx) + "_상품_" + LotteUtil.setDigit(subIdx) ;
					}
	
					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label, tabNm
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);

})(window, window.angular);