(function(window, angular, undefined) {
    'use strict';

    var unitModule = angular.module('lotteUnit', []);

    /* 일반 유닛 directive */
    unitModule.directive('commUnit', [function(){
        return {
            templateUrl: '/lotte/resources_dev/tpl/unit/comm_unit.html',
            replace: true,
            link:function($scope, el, attrs){
                $scope.clickUnit = function() {
                    $scope.productView($scope.item);
                };
            }
        };
    }]);

    /* 기획전 전용 유닛(서프라이즈, 슈퍼찬스) */
    unitModule.directive('planUnit', function(){
        return {
            templateUrl: '/lotte/resources_dev/tpl/unit/plan_unit.html',
            replace: true,
            link:function($scope, el, attrs){
                $scope.clickUnit = function(){
                    $scope.productView($scope.item);
                };
            }
        };
    });

    /* 딜형 유닛 type01 directive */
    unitModule.directive('commUnitDeal01', [function() {
        return {
            templateUrl: '/lotte/resources_dev/tpl/unit/comm_unit_deal01.html',
            replace: true,
            link:function($scope, el, attrs) {
                $scope.clickUnit = function() {
                    $scope.productView($scope.item);
                };
            }
        };
    }]);

    /* 공통 유닛 type01 directive */
    unitModule.directive('commUnitType01', ['$http', 'LotteUtil', 'LotteCommon', function ($http, LotteUtil, LotteCommon) {
        return {
            templateUrl: '/lotte/resources_dev/tpl/unit/comm_unit_type01.html',
            replace: true,
            link: function ($scope, el, attrs) {
                $scope.addWishFlag = false;

                $scope.clickUnit = function () {
                    $scope.productView($scope.item);
                };

                $scope.addWish = function () {
                    if ($scope.addWishFlag) {
                        alert("이미 등록된 상품입니다.");
                        return false;
                    }

                    if ($scope.loginInfo.isLogin) {
                        $http.post(LotteUtil.setUrlAddBaseParam(LotteCommon.prdAddWish, $scope.baseParam), {goods_no : $scope.item.goods_no})
                            .success(function (data, status, headers, config) {
                                if (data.success) {
                                    alert("위시리스트에 저장되었습니다.");
                                    $scope.addWishFlag = true;
                                } else {
                                    alert("죄송합니다. 위시리스트 담기에 실패하였습니다.");
                                    $scope.addWishFlag = false;
                                }
                            })
                            .error(function (data, status, headers, config) {
                                console.log("error");
                            });
                        
                    } else {
                        alert('로그인 후 이용하실 수 있습니다.');
                        $scope.loginProc(); /*go Login*/
                    }
                };
            }
        };
    }]);
})(window, window.angular);