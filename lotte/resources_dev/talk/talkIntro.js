(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('talkCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "스마트톡"; //서브헤더 타이틀

		$scope.pageLoading = true; //페이지 첫 로딩

	}]);

	app.directive('lotteContainer', ['$window', 'LotteCommon', 'commInitData', '$interval', 'LotteUserService', function($window, LotteCommon, commInitData, $interval, LotteUserService) {
        return {
            templateUrl : '/lotte/resources_dev/talk/talkIntro_container.html',
            replace : true,
            link : function($scope, el, attrs) {

        		$scope.DEV_MODE = commInitData.query.dev_mode == "Y";
        		if(location.host == "m.lotte.com"){ $scope.DEV_MODE = false; }
        		
				$scope.pageLoading = false;

				// 톡상담
				$scope.talkNormalClick = function(idx){
					location.href=LotteCommon.talkUrl + '?' + $scope.baseParam + '&tclick=' + $scope.tClickRenewalBase + 'Smarttalk_intro_counsel_Btn_' + idx;
				};

				// 톡추천
				$scope.talkRecommandClick = function(){
					if($scope.appObj.isApp){
						location.href=LotteCommon.talkUrl + '?' + $scope.baseParam + '&tclick=' + $scope.tClickBase + 'm_DC_Custom01_Clk_Btn_2' + '&chatDiv=ROP';
					} else {
						$scope.sendTclick("m_DC_Custom01_Clk_Btn_2");
						alert('스마트 톡추천은 앱에서만 이용가능 합니다.');
					}
				}
				
				// 스마트 톡추천
				$scope.smartTalkRecomClick = function () {
					if ($scope.appObj.isApp) {
						LotteUserService.promiseLoginInfo().finally(function(loginInfo){
							if($scope.loginInfo.mbrNo != undefined && $scope.loginInfo.mbrNo != ""){
								// loged in
								var path = LotteCommon.talkRecomUrl + "?" + $scope.baseParam + '&tclick=' + $scope.tClickRenewalBase + 'Smarttalk_intro_recommand_Btn_1';
								
								if (($scope.appObj.isIOS && $scope.appObj.verNumber < 2830) ||
									($scope.appObj.isAndroid && $scope.appObj.verNumber < 294)) {
									var msg = "톡추천이 더욱 새로워졌어요!<br/>24시간 이용가능한 톡추천을<br/>앱 업데이트를 통해 만나보세요.";
									var obj = {
										"label" : {
											"ok" : "승인",
											"cancel" : "취소"
										},
										"callback" : function(rtn){
											if(rtn){
												if($scope.appObj.isIOS){
													location.href = "http://itunes.apple.com/app/id376622474?mt=8";
												}else{
													location.href = "market://details?id=com.lotte";
												}
											}
										}
									}
									$scope.confirm_2016(msg, obj);
								} else {
									location.href = path;
								}
							}else{
								// not loged in
								var path = encodeURIComponent( LotteCommon.talkRecomUrl + "?" + $scope.baseParam );
								$scope.gotoService("loginUrl", {targetUrl : path});
							}
		                });
						
						/*LotteUserService.promiseLoginInfo()
						.then(function (loginInfo) { // 로그인 상태
							// alert("로그인 상태");
							var path = LotteCommon.talkRecomUrl + "?" + $scope.baseParam + '&tclick=' + $scope.tClickRenewalBase + 'Smarttalk_intro_recommand_Btn_1';
							
							if (($scope.appObj.isIOS && $scope.appObj.verNumber < 2830) ||
								($scope.appObj.isAndroid && $scope.appObj.verNumber < 294)) {
								var msg = "톡추천이 더욱 새로워졌어요!<br/>24시간 이용가능한 톡추천을<br/>앱 업데이트를 통해 만나보세요.";
								var obj = {
									"label" : {
										"ok" : "승인",
										"cancel" : "취소"
									},
									"callback" : function(rtn){
										if(rtn){
											if($scope.appObj.isIOS){
												location.href = "http://itunes.apple.com/app/id376622474?mt=8";
											}else{
												location.href = "market://details?id=com.lotte";
											}
										}
									}
								}
								$scope.confirm_2016(msg, obj);
							} else {
								location.href = path;
							}
						})
						.catch(function (loginInfo) { // 비로그인 상태
							// alert("비로그인 상태");
							var path = encodeURIComponent( LotteCommon.talkRecomUrl + "?" + $scope.baseParam );
							$scope.gotoService("loginUrl", {targetUrl : path});
						});*/
					} else {
						// web
						if($scope.DEV_MODE){
							$scope.alert_2016("스마트 톡추천은<br/>앱에서만 이용가능 합니다.<br/><br/>개발자 모드로 이동", {callback:function(){
								var path = LotteCommon.talkRecomUrl + "?" + $scope.baseParam + '&tclick=' + $scope.tClickRenewalBase + 'Smarttalk_intro_recommand_Btn_1';
								location.href = path + "&dev_mode=Y";
							}});
						}else{
							$scope.alert_2016("스마트 톡추천은<br/>앱에서만 이용가능 합니다.");
						}
					}
				};

				// IOS에서 history.back 체크
				if($scope.appObj.isApp && $scope.appObj.isIOS){
					var then = 0;
					$interval(function(){
						var now = (new Date()).getTime();
						var dif = now - then;
						if(dif > 1500){
	
							if($scope.appObj.isApp && $scope.appObj.isIOS){
								$window.location.href = "talkrecom://exitpage";
							}
						}
						then = now;
					}, 1000);
				}
				
			}
        };
    }]);

})(window, window.angular);