/**
 * M64 TV쇼핑 v2
 * Autor : 박해원
 * Date : 20171113
 *
 * M2033에 추가사항 적용 버전
 * 1. 방송상품 목록
 * 2. 방송대체상품 목록
 * 3. 라이브방송보기
 */
(function(window, angular, undefined) {
    var app = angular.module('app');
    app.directive('m2064Container', ['$http','$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage','commInitData', 'LotteUtil', 
    function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, commInitData, LotteUtil) {
        return {
            restrict: 'AEC',
            scope: { moduleData : "=" },
            templateUrl : "/lotte/resources_dev/main/modules/m2064.html",
            replace : true,
            controller: 'lotteModulesCtrl',
            link : function ($scope, el) {

                $timeout(function() {
                    if(!getMobileIs()) return;
                    if( nativeAppInfo.isIOS ) { console.log('ios'); el.addClass('m2064_ios'); }
                    if( nativeAppInfo.isAndroid ) el.addClass('m2064_android');
                }, 1000);

                $scope.onAir = false; // 방송
                $scope.liveTime; // 방송시간

                // Tv쇼핑 Live URL
                $scope.tvShoppingStreamURL = "http://mohlslive.lotteimall.com/live/livestream/lotteimalllive_mp4.m3u8";
               
                // 로컬테스트
                var host = location.host;

                if (host.indexOf('localhost') != -1 || host.indexOf('10.149.132.') != -1 || commInitData.query.module == "M2064") {
                    $scope.tvShoppingStreamURL = "http://uxplanning1.fms.wecandeo.com/100/1812/2017/10/31/11/V5268405.mp4?key=x4t%2BpcFFyYirWASpFX5RSaPjC0vwxgD8ctNoszuSFC64bNzPOY4jCB08GNkmED6eW36RPZJuy6FpPyWIqjdWYqctKrcbi32KHXaMq0WcxmY%3D&packageId=1006521&videoId=6789485";
                }
                console.log($scope.tvShoppingStreamUR);
                /**
                 * unitShow 변경시
                 * 방송중 Flag변경
                 */
                $scope.$watch('unitShow',function(n) {
                    if( typeof n == "boolean" && !n ) $scope.onAir = false;
                });

                /**
                 * 방송보기 상태변경
                 */
                $scope.onLivePlay = function() {
                    if(confirm("3G/LTE에서 재생시 데이터 요금이 부과할 수 있으니 유의하세요~")) {
                        $scope.onAir = !$scope.onAir;
                        getScope().sendTclick( $scope.moduleData.tclick+"_Clk_video01");
                        el.find('.M2064_video video')[0].play();
                    }
                };

                /**
                 * TV쇼핑 링크
                 * 편성표보기 링크
                 *
                 * @param str : String
                 * @param tclick : String
                 */
                $scope.goTvShopping = function(str, tclick) {
                    var linkURL;
                    switch (str) {
                        // TV쇼핑메인
                        case "tvhome":
                            linkURL = $scope.moduleData.moreBtnUrl+"?curDispNo=5553631&tclick="+tclick;
                            break;
                        // 편성표보기
                        case "schedule": // 20171114 기준 svc에 링크값이 없음으로 하드코딩
                            linkURL = $scope.moduleData.moreBtnUrl2+"&tclick="+tclick;
                            break;
                    }

                    linkURL += "&" + $scope.baseParam;
                    if (linkURL) location.href = linkURL;
                };

                /**
                 * 스크린영역 안에 있는지 체크
                 * 화면에 들어오면 애니메이션
                 *
                 * @param y : number
                 */
                function view (y) {
                    var scrollY = y,
                        top = el.offset().top,
                        screenH = window.innerHeight;
                    if( (scrollY+screenH) > top && (scrollY-screenH) < top  ) {
                        if( !el.hasClass('showToM2064') ) el.addClass('showToM2064');
                    } else {
                        if( el.hasClass('showToM2064') ) el.removeClass('showToM2064');
                    }
                }

                /**
                 * 타이틀 애니메이션
                 * "TV쇼핑" animation 적용
                 */
                function textAnimation() {
                    el.find('.in_title').addClass('spintxt');

                    $timeout(function() {
                        el.find('.in_title').removeClass('spintxt');

                        $timeout(function() {
                            if(!$scope.unitShow) return; // 방종이면 종료
                            textAnimation();
                        }, 200);
                    }, 5000);
                }

                /**
                 * 스크롤이벤트
                 * 화면에 있는지 체크용
                 */
                angular.element(window).bind('scroll',function(e) {
                    view( e.currentTarget.scrollY );
                });

                function getMobileIs() {
                    var filter = "win16|win32|win64|mac", r = false;

                    if (navigator.platform) {
                        if (0 > filter.indexOf(navigator.platform.toLowerCase())) {
                            r = true;
                        }
                    }

                    return r;
                }

                /**
                 * 초기실행
                 */
                function loadInit() {
                    var prdLoadUrl = $scope.moduleData.jsonCallUrl;

                    if (!prdLoadUrl) return;

                    $http({url:prdLoadUrl})
                    .success(function(res) {
                        try { $scope.moduleData.onAirProd = res.tvshopping.onAirProd } catch(e) {}
                        try { $scope.moduleData.recommProd = res.tvshopping.recommProd } catch(e) {}

                        $timeout(function() {
                            try {
                                if (!scope.moduleData.onAirProd.items)
                                    scope.moduleData.onAirProd.items = [];
                            } catch(e) {};

                            try {
                                if (!scope.moduleData.recommProd.items)
                                    scope.moduleData.recommProd.items = [];
                            } catch(e) {};

                            if ($scope.unitShow && !$scope.moduleData.onAirProd.items.length && $scope.moduleData.recommProd.items.length) {
                                $scope.unitShow = false;
                            }
                        }, 2000);
                    });

                    textAnimation();
                }

                loadInit();

                $timeout(function() { view( window.scrollY ) }, 500);

                /**
                 * 방종 테스트
                 *
                $timeout(function(){
                    //return;
                    $scope.unitShow = false;
                    $scope.swpIndex = 0;
                },5000); */

                /**
                 ====================================================
                #### M2033 TV쇼핑 모듈 스크립트 ####################
                ====================================================
                */
                $scope.unitShow = true;

                // tv상품 남은 시간 표시
                if (!$scope.moduleData.bdEndTime || $scope.moduleData.bdEndTime == undefined || $scope.moduleData.bdEndTime == "") {
                    //$("#tv2Time").text("00:00:00");
                    $scope.unitShow = false;
                } else {
                    var tmpStr = $scope.moduleData.bdEndTime;

                    tmpStr = tmpStr.substr(0, 4) + "/" + tmpStr.substr(4, 2) + "/" + tmpStr.substr(6, 2) + " " + tmpStr.substr(8, 2) + ":" + tmpStr.substr(10, 2) + ":" + tmpStr.substr(12, 2);

                    var endTime = new Date(Date.parse(tmpStr)).getTime();

                    if ($scope.tvtimer != null && $scope.tvtimer != undefined) {
                        clearInterval($scope.tvtimer);
                    }

                    $scope.tvtimer = setInterval(function() {
                        if (!$scope.unitShow) {
                            clearInterval($scope.tvtimer);
                            return;
                        }

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

                        //$("#tv2Time").text(remainStr);
                        $scope.liveTime = remainStr;
                    }
                }

				// Google Analytics Event Tagging
				$scope.logGAEvtModuleEach = function (idx, labelTxt, tabNm) {
					var index = idx;
					var label = labelTxt ? labelTxt : "";

					if (idx != "-") {
						index = (tabNm) ? tabNm + LotteUtil.setDigit(idx) : LotteUtil.setDigit(idx);
					}

					label = (label + "").replace(/\n/gi, " ");
                  
					// groupModuleNm : 모듈데이터의 modleNm, idx, label
					$scope.logGAEvtModule($scope.moduleData.moduleNm, index, label);
				};
            }
        }
    }]);
})(window, window.angular);