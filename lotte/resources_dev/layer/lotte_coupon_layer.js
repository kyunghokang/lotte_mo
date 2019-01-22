(function(window, angular, undefined) {
    'use strict';

    var couponModule = angular.module('lotteDoubleCoupon', []);

    couponModule.controller('lotteCouponLayerCtrl', ['$scope', '$http', '$window', 'LotteCommon', function($scope, $http, $window, LotteCommon) {
        $scope.procDownDoubleCoupon = function() {
            var params = {
                cn : $scope.srhObj.cn,
                cpn_issu_no : $scope.couponLayer.cpnNo,
                dup_cpn_yn : ($scope.couponLayer.cpnType == 'double_coupon') ? 'Y' : 'N',
                mbrNo : $scope.loginInfo.mbrNo,
                gradeCd : $scope.loginInfo.gradeCd
            };
            $http.get(LotteCommon.downDoubleCoupon, {params:params})
            .success( function(data) {
                if(data.message) {
                    alert(data.message);
                } 
                if(data.gopage) {
                    $window.location.href = data.gopage;
                }
            })
            .error( function() {
                console.log('Error 중복쿠폰 다운로드');
            });
        };
        
    }]);

    couponModule.directive('lotteCouponLayer', ['$window', '$timeout', 'LotteCookie', function($window, $timeout, LotteCookie){
        return {
            templateUrl:'/lotte/resources_dev/layer/layer_coupon.html',
            controller:'lotteCouponLayerCtrl',
            replace:true,
            link:function($scope, $el) {
                var couponWatcher = $scope.$watch('couponLayer', function(){
                    if($scope.couponLayer != undefined){
                        var $targ = angular.element('.coupon_layer_s');
                        if(LotteCookie.getCookie($scope.couponLayer.cookieNm)=='no') {
                            $targ.remove();
                        } else {
                            if($scope.couponLayer.cpnType == "double_coupon") {
                                $timeout( function() {
                                    $targ.css({ 'top' : $window.innerHeight/2 - $targ.outerHeight()/2 + 'px' });
                                }, 500);
                            }
                        }
                        couponWatcher(); /*clear $watch*/
                    }
                });

                /*오늘하루 그만보기*/
                $scope.setToDayNotView = function() {
                    LotteCookie.setCookie($scope.couponLayer.cookieNm, 'no', 1);
                    $scope.closeDoubleCouponLayer();
                };

                /*쿠폰 레이어 닫기*/
                $scope.closeDoubleCouponLayer = function() {
                    angular.element('.coupon_layer_s').remove();
                };

                /*중복 쿠폰 다운로드*/
                $scope.downDoubleCoupon = function() {
                    /*console.log('downDoubleCoupon', $scope.loginInfo.isLogin, $scope.couponLayer.cpnNo);*/
                    if(!$scope.loginInfo.isLogin) {
                        $scope.loginProc();
                        return false;
                    }

                    if($scope.couponLayer.cpnNo != "" && $scope.couponLayer.cpnNo != undefined) {
                        $scope.procDownDoubleCoupon();
                    }

                };

                /*go app store*/
                $scope.goAppStore = function() {
                    var loc_url = "";
                    if($scope.appObj.isAndroid) { /*android*/
                        loc_url = "market://details?id=com.lotte&referrer=000001";
                    } else if ($scope.appObj.isIOS) { /*ios*/
                        if($scope.appObj.iOsType == "iPhone") { /*iphone*/
                            loc_url = "http://itunes.apple.com/app/id376622474";
                        } else if ($scope.appObj.iOsType == "iPad") { /*ipad*/
                            loc_url = "http://itunes.apple.com/app/id447799601";
                        }
                    }
                    if(loc_url!="") $window.location.href = loc_url;
                };
            }
        };
    }]);

})(window, window.angular);