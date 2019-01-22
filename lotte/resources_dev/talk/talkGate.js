(function(window, angular, undefined){
"use strict";

var app = angular.module("app", [
	"lotteComm",
	"lotteSrh",
	"lotteSideCtg",
	"lotteCommFooter"
]);

app.controller("TalkGateCtrl",
				["$scope", "LotteCommon",
		 function($scope,   LotteCommon){
	$scope.showWrap = true;
	$scope.contVisible = true;
	$scope.subTitle = "TalkGate";//서브헤더 타이틀
	
}]);//controller

app.directive("lotteContainer",
				["LotteCommon", "LotteStorage",
		 function(LotteCommon,   LotteStorage){
	return {
		templateUrl : "/lotte/resources_dev/talk/talkGate_container.html",
		replace : true,
		link : function($scope, el, attrs) {
			
			$scope.deleteTalkGateSession = function(){
				LotteStorage.delSessionStorage("TALK_GATE_hideTicker");
				location.reload();
			};
			
			$scope.trace("");
			
		}//link
	};
}]);//directive

})(window, window.angular);