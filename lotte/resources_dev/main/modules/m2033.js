// M33 TV쇼핑
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2033Container', ['$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 
	function ($timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2033.html",
			replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				
				$scope.unitShow = true;

				// tv상품 남은 시간 표시 
				if ($scope.moduleData.bdEndTime == "") {
					// $("#tvTime").text("00:00:00");
				} else {
					var tmpStr = $scope.moduleData.bdEndTime;		   

					tmpStr = tmpStr.substr(0,4) +"/"+ tmpStr.substr(4,2) +"/"+ tmpStr.substr(6,2) +" "+ tmpStr.substr(8,2) +":"+ tmpStr.substr(10,2) +":"+ tmpStr.substr(12,2);

					var endTime = new Date(Date.parse(tmpStr)).getTime();		                

					if ($scope.tvtimer != null && $scope.tvtimer != undefined) {
						clearInterval($scope.tvtimer);
					}

					$scope.tvtimer = setInterval(function() {
						tvRemainTimer();
					}, 1000);		                
					
					var tvRemainTimer = function() {
						var remainTime = endTime - new Date().getTime();
						var remainStr = "";

						//alert(remainTime);
						if (remainTime < 10) {
							clearInterval($scope.tvtimer);
							remainStr = "00:00:00";
							//세션에서 불러왔는데 시간이 지났다면
							/* if(sessionFlag){
								console.log("timeover reload");
								$scope.loadData();     
							}*/
							// 유닛 숨김 처리
							$scope.unitShow = false;
						} else {
							var hour = Math.floor((remainTime / 60 / 60 ) / 1000);
							var min = Math.floor((remainTime / 60) / 1000) % 60;
							var sec = Math.floor(remainTime / 1000) % 60;                                
							(hour < 10 ? remainStr += "0" + hour + ":" : remainStr += hour + ":");
							(min < 10 ? remainStr += "0" + min + ":" : remainStr += min + ":");
							(sec < 10 ? remainStr += "0" + sec : remainStr += sec);                    
						}

						$("#tvTime").text(remainStr);
					}                
				}

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";

					if (idx != "-") {
						index = LotteUtil.setDigit(idx);
					}

					label = (label + "").replace(/\n/gi, " ");

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
			}
		}
	}]);
})(window, window.angular);