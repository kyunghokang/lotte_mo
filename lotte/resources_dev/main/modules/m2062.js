(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2062Container', ['$timeout', '$window', '$document', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 'LotteUserService', '$http',
	function ($timeout, $window, $document, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil, LotteUserService, $http) {
		return {
			restrict: 'AEC',
			scope: { moduleData : "="},
			templateUrl : "/lotte/resources_dev/main/modules/m2062.html",
            replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.loginInfo = LotteUserService.getLoginInfo();

                if ($scope.loginInfo.isLogin) {
                    //메인 홈 탭 개인 특성화배너 20180329
                    $scope.pbanner = 0;//개인화배너 노출 여부 0 전체 비노출, 1 개인화배너 노출, 2 기존배너 노출 
                    $scope.pbann = {};
                    $http.get("/json/main_new/specificmbr_banner.json")
                    .success(function (data) {
						$scope.pbann = data.data;
						
                        if ($scope.pbann && $scope.pbann.imgUrl) {
                            $scope.pbanner = 1;
                        } else {
                            $scope.pbanner = 2;
                        }
                    })
                    .error(function (e) {
                        console.log("개인화배너 에러");
                        $scope.pbanner = 2;
                    }); 
                }

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (type, grade) {
					var idx = "-",
						label = "";

					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					/**
					 * 10 : 플래티넘+
					 * 20 : 플래티넘
					 * 30 : 플래티넘#
					 * 40 : 골드
					 * 50 : 실버
					 * 60 : 일반
					 * 99 : VIP
					 */
					if (type == "normal") {
						switch(grade) {
							case "10": idx = "01"; label = "플래티넘+"; break;
							case "20": idx = "02"; label = "플래티넘"; break;
							case "30": idx = "03"; label = "플래티넘#"; break;
							case "40": idx = "04"; label = "골드"; break;
							case "50": idx = "05"; label = "실버"; break;
							case "60": idx = "06"; label = "일반"; break;
							case "99": idx = "99"; label = "VIP"; break;
						}
					} else if (type == "notLogin") {
						idx = "07";
						label = "비로그인";
					} else if (type == "staff") {
						switch(grade) {
							case "10": idx = "08"; label = "플래티넘+"; break;
							case "20": idx = "09"; label = "플래티넘"; break;
							case "30": idx = "10"; label = "플래티넘#"; break;
							case "40": idx = "11"; label = "골드"; break;
							case "50": idx = "12"; label = "실버"; break;
							case "60": idx = "13"; label = "일반"; break;
							case "99": idx = "99"; label = "VIP_STAFF"; break;
						}
					} else if (type == "special") {
						idx = "99";
						label = "특정회원";
					}

					$scope.logGAEvtModule($scope.moduleData.moduleNm, idx, label);
				};
			}
		}
	}]);
})(window, window.angular);