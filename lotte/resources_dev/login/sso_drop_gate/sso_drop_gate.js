(function(window, angular, undefined) {
	'use strict';
	
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		'lotteCommFooter'
	]);
	
	
	app.controller('ssoDropGateCtrl', ['$scope', '$timeout', 'LotteCommon', 'commInitData', 'LotteUtil', 'LotteUserService',function($scope, $timeout, LotteCommon, commInitData, LotteUtil, LotteUserService) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "";//서브헤더 타이틀

		// 타겟URL
		$scope.targetUrl = (LotteUtil.getDecodeParameter("targetUrl") != null) ? LotteUtil.getDecodeParameter("targetUrl") : LotteCommon.mainUrl + "?" + $scope.baseParam;
			

		//SSO 회원정보 조회 
		$scope.callApi = function(){

			try{
				$scope.sso.callApi({
					akUrl:'/biz/login/urInfInq_01_002',
					callback: function(rspDta){
						// 회원정보 조회가 비정상이고, 닷컴 로그인이 되어있다면 SSO 및 
						if(rspDta.rspC != "00" && LotteUserService.getLoginInfo().isLogin){
							//SSO 로그아웃 시도 후
							LotteUserService.callSsoLogout().then(function(){
	
								if ($scope.appObj.isApp) {
									if ($scope.appObj.isIOS) { //IOS 일때 
										window.location.href = "logincheck://logout";
										setTimeout(function () { // iOS 스키마 호출 보장을 위한 500ms 딜레이 후 로그아웃 처리
											window.location.replace(LotteCommon.logoutUrl + "?" + $scope.baseParam);
										}, 500);
									} else { // Android
										//20160115 로그아웃시 PMS 호출 , 안드로이드일때 
										try {
										window.loginCheck.callAndroid("logout");
										} catch (e) {}
									
										window.location.replace(LotteCommon.logoutUrl + "?" + $scope.baseParam);
									}
								} else {
									window.location.replace(LotteCommon.logoutUrl + "?" + $scope.baseParam);
								}
	
							});
						}else{
							window.location.replace($scope.targetUrl);
						}
					}
				});

			}catch(er){ // 호출 실패시 메인으로
				window.location.replace( LotteCommon.mainUrl + "?" + $scope.baseParam);
			}
			
		}
		
		angular.element(document).ready(function () {
			$timeout(function(){
				$scope.callApi();
			},500);
		});

	}]);
	
	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/login/sso_drop_gate/sso_drop_gate_container.html',
			replace : true,
			link : function($scope, el, attrs) {
			}
		};
	});

})(window, window.angular);