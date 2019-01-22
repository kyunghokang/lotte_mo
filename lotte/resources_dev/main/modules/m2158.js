(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('m2158Container', ['$rootScope', '$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil','commInitData', 
	function ($rootScope, $http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil,commInitData) {
		return {
			restrict: 'AEC',
			scope: { moduleData:"=" },
			templateUrl : "/lotte/resources_dev/main/modules/m2158.html",
            replace : true,
			controller: 'lotteModulesCtrl',
			link : function ($scope, el, attrs) {
                $scope.rScope = LotteUtil.getAbsScope($scope);
                $scope.loginInfo = $scope.rScope.loginInfo;
                $scope.pageDispNo = attrs.pageDispNo;
                
			    // $scope.loginInfo = false;

                // TEST Date
				$scope.todayDate = new Date();
				if (commInitData.query["testDate"]) {
					var todayDate = commInitData.query["testDate"]; // 년월일
					var todayTime = new Date(
						todayDate.substring(0, 4), // 년
						parseInt(todayDate.substring(4, 6)) - 1, // 월
						todayDate.substring(6, 8), // 일
						todayDate.substring(8, 10), // 시간
						todayDate.substring(10, 12), // 분
                        todayDate.substring(12, 14)  // 초
                    );
					$scope.todayDate = todayTime;
				}

				$scope.newVer = false;
				if ($scope.todayDate.getTime() >= (new Date(2017, 12 - 1,1)).getTime()) {
					$scope.newVer = true;
				}

				$scope.callBackData = {};
                var jsonCallUrl = $scope.moduleData.items[0].couponUrl;
				$scope.loadData = function(params) {
                    var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2158.json" : jsonCallUrl;
					var httpConfig = {
						method: "get",
						url: jsonUrl,
						params: params
					};
					$http(httpConfig)
					.success(function (data) {
						$scope.callBackData = data.data;
					})
					.finally(function () {

					});
				};
                $scope.loadData();

                $scope.linkClick = function(linkUrl, tclick) {
					console.log('linkClick', linkUrl);
					$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , "tclick=" + tclick + "&" + getScope().baseParam);
                };

                $scope.couponDown = function(tclick) {
					console.log('couponDown', tclick);
					$scope.rScope.sendTclick($scope.moduleData.tclick);

					var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2158_cpnDown.json" : $scope.callBackData.cpnDownUrl;
					var httpConfig = {
						method: "get",
						url: jsonUrl
						// params: params
					};

					$http(httpConfig)
                    .success(function (data) {
                        var code = data.data_set.response_code;

                        // CS : 성공, CD : 이미 발급받은 케이스, CF : 실패, X : 비로그인
                        switch (code){
                            case 'CS': // 성공
                                break;
                            case 'CD': // 기발급
                                break;
                            case 'CF': // 실패
                                break;
                        }

                        alert(data.data_set.response_msgtxt);
                    })
                    .finally(function () {
                        $scope.loadData();
                    });
				};
                
                $scope.loginFromThis = function(tclick) {
					var targetUrl = "&targetUrl=" + encodeURIComponent(LotteCommon.mainUrl + '?' + $rootScope.$$childHead.baseParam + '&dispNo=' + $scope.pageDispNo,'UTF-8');
					$window.location.href = LotteCommon.loginUrl + "?" + $rootScope.$$childHead.baseParam + "&dispNo=" + $scope.pageDispNo + "&tclick=" + tclick + targetUrl;
                };
                
                // Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabNm) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";
					if (idx != "-") {
						index = LotteUtil.setDigit(idx);
					}
					label = (label + "").replace(/\n/gi, " ");
					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label, tabNm);
				};
			}
		}
	}]);
})(window, window.angular);