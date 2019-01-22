(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2160Container', ['$timeout', '$window', '$document', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 'LotteUserService', '$http',
	function ($timeout, $window, $document, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil, LotteUserService, $http) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "="},
			templateUrl : "/lotte/resources_dev/main/modules/m2160.html",
            replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
                $scope.copyBgColor = "#9459d9";
                $scope.item = $scope.moduleData.prdInfo;
           
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
                
                //경우 타이머 세팅
                function startSetTimer(){
					var tmpStr = $scope.item.prdEndTime;		   
					tmpStr = tmpStr.substr(0,4) +"/"+ tmpStr.substr(4,2) +"/"+ tmpStr.substr(6,2) +" "+ tmpStr.substr(8,2) +":"+ tmpStr.substr(10,2) +":"+ tmpStr.substr(12,2);
					var endTime = new Date(Date.parse(tmpStr)).getTime();		                
                    //var nowTime = new Date().getTime();
                    //preview 대응 
                    /*
                    if($scope.rScope.previewDate != undefined){
                        tmpStr = $scope.rScope.previewDate;		   
					    tmpStr = tmpStr.substr(0,4) +"/"+ tmpStr.substr(4,2) +"/"+ tmpStr.substr(6,2) +" "+ tmpStr.substr(8,2) +":"+ tmpStr.substr(10,2) +":"+ tmpStr.substr(12,2);
					    nowTime = new Date(Date.parse(tmpStr)).getTime();		                                    
                    }*/                                       
                    
					if ($scope.todayTimer != null && $scope.todayTimer != undefined) {
						clearInterval($scope.todayTimer);
					}
					$scope.todayTimer = setInterval(function() {
						tvRemainTimer();
					}, 1000);		                					
					var tvRemainTimer = function() {
						var remainTime = endTime - new Date().getTime();
                        var hour,min,sec;
						if (remainTime < 10) {
							clearInterval($scope.todayTimer);
                            angular.element(el).hide();
						} else {
							hour = Math.floor((remainTime / 60 / 60 ) / 1000);
							min = Math.floor((remainTime / 60) / 1000) % 60;
							sec = Math.floor(remainTime / 1000) % 60;                                                            
                            if(hour > 99){
                                hour = "99";
                                min = "59";
                                sec = "59";                                
                            }else{
                                (hour < 10) ? hour = "0" + hour : hour += "";
                                (min < 10 ) ? min = "0" + min : min += "";
                                (sec < 10 ) ? sec = "0" + sec: sec += "";                                                
                            }                             
                            var timestr = "<span>"+hour.substr(0,1)+"</span><span>"+hour.substr(1,1)+"</span><span></span><span>"+min.substr(0,1)+"</span><span>"+min.substr(1,1)+"</span><span></span><span>"+sec.substr(0,1)+"</span><span>"+sec.substr(1,1)+"</span>";
                            angular.element(el).find(".centercon.timer").html(timestr);						                            
						}
					}                      
                }
                if($scope.item.prdEndTime == undefined){ //A,B 이더라도 timePrdInfo 값이 없으면 C 처리함
                    angular.element(el).hide();
                }else{
                    startSetTimer();      
                }                
			}
		}
	}]);
})(window, window.angular);