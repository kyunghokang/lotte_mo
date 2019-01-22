(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteNgSwipe'
    ]);

    app.controller('MallMainCtrl', ['$http','$scope', '$window', 'LotteCommon', function($http, $scope, $window, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "10X10"; //서브헤더 타이틀
        $scope.pageLoading = false;
        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
            $scope.screenData = {
                page: 0,
                disp_name: "10X10",
                dispNo: 5293948,
                showAllCategory: false,
                selectCate1: 0,
                selectCate2: 0,
                selectCate3: 0,
                selectedCategory: 0,
                cate_list: [],
                top_banner_list:[],
                best_seller_prod_list: [],
                focus_on_prod_list: [],
                new_arrival_prod_list: []
            }
        })();

        $scope.subTitle = $scope.screenData.disp_name;

        // dispNo = 5522717 구찌
        $scope.checkHasSub = function(item) {
            angular.forEach(item, function(val) {
                if(val.sub_cate_list != null) {
                    if(val.sub_cate_list.length) {
                        val.hasSub = true;
                        val.sub_cate_list = $scope.checkHasSub(val.sub_cate_list);
                    } else {
                        val.hasSub = false;
                    }
                } else {
                    val.hasSub = false;
                }
            });
            return item;
        }

        /*
         * 스크린 데이터 로드
         */
        $scope.loadScreenData = function() {
            console.log("스크린 데이터 로드...");
            $scope.pageLoading = true;
            $scope.screenData.page++;
            $scope.productListLoading = true;
            $http.get(LotteCommon.specialMallMain+'?dispNo='+$scope.screenData.dispNo)
            .success(function(data) {
                var contents = [];
                var newVal = [];
                if(data['max'] != undefined) {
                    contents = data['max'];
                    $scope.screenData.cate_list = contents.cate_list.items;
                    angular.forEach($scope.screenData.cate_list, function(val, key) {
                        if(val.sub_cate_list != null) {
                            if(val.sub_cate_list.length) {
                                val.hasSub = true;
                                val.sub_cate_list = $scope.checkHasSub(val.sub_cate_list);
                            } else {
                                val.hasSub = false;
                            }
                        } else {
                            val.hasSub = false;
                        }
                    });
                    $scope.screenData.top_banner_list = contents.top_banner_list.items;
                    $scope.screenData.best_seller_prod_list = contents.best_seller_prod_list.items;
                    $scope.screenData.focus_on_prod_list = contents.focus_on_prod_list.items;
                    $scope.screenData.new_arrival_prod_list = contents.new_arrival_prod_list.items;
                    $scope.productListLoading = false;
                }
                $scope.pageLoading = false;
            }).error(function(data){
                console.log('Error Data : 데이터 로딩 에러');
                $scope.productListLoading = false;
                $scope.pageLoading = false;
            });
        }

        /*
         * TODO: 화면 나갈때 세션에 데이터 저장 및 세선 체크후 데이터 세팅 부분 공통화 개발 필요
         */
        $scope.loadScreenData();
    }]);

    app.directive('lotteContainer', ['LotteCommon', function(LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/tenbyten/m/mall_main_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                /*
                 * 메뉴 카테고리 클릭
                 */

                 //외부에서 호출하는 함수
                $scope.banner_ct = function(control){
                    $scope.control = control;
                    var next2 = control.getIndex();
                }
                $scope.banner_move = function(dir){
                    var next = $scope.control.getIndex() + dir;
                    $scope.control.moveIndex(next);
                }
                $scope.menuCategoryClick = function(idx) {
                    $scope.menuCategory1Click(item);
                    $scope.screenData.showAllCategory = false;
                }

                $scope.menuCategory1Click = function(item) {
                    if($scope.screenData.selectCate1 == item.disp_no) {
                        $scope.screenData.selectCate1 = 0;
                    } else {
                        $scope.screenData.selectCate1 = item.disp_no;
                        $scope.moveMenuSwipe(this.$index);
                    }
                    $scope.screenData.showAllCategory = false;
                }
                $scope.menuCategory2Click = function(item) {
                    if(!item.hasSub) {
                        window.location.href = LotteCommon.mallSubUrl+"?"+$scope.baseParam+"&cateNo="+item.disp_no+"&cateDepth="+item.cate_depth+"&title="+$scope.subTitle;
                    } else {
                        if($scope.screenData.selectCate2 == item.disp_no) {
                            $scope.screenData.selectCate2 = 0;
                        } else {
                            $scope.screenData.selectCate2 = item.disp_no;
                        }
                        $scope.screenData.showAllCategory = false;
                    }
                }
                $scope.menuCategory3Click = function(item) {
                    if(!item.hasSub) {
                        window.location.href = LotteCommon.mallSubUrl+"?"+$scope.baseParam+"&cateNo="+item.disp_no+"&cateDepth="+item.cate_depth+"&title="+$scope.subTitle;
                    } else {
                        if($scope.screenData.selectCate3 == item.disp_no) {
                            $scope.screenData.selectCate3 = 0;
                        } else {
                            $scope.screenData.selectCate3 = item.disp_no;
                        }
                        $scope.screenData.showAllCategory = false;
                    }
                }
                /*
                 * 모든 매뉴 보기 클릭
                 */
                $scope.showAllCategoryClick = function() {
                    $scope.screenData.selectCate1 = 0;
                    $scope.screenData.selectCate2 = 0;
                    if($scope.screenData.showAllCategory) {
                        $scope.screenData.showAllCategory = false;
                    } else {
                        $scope.screenData.showAllCategory = true;
                    }
                }
                /*
                 * 탑 배너 클릭
                 */
                $scope.planshopBannerClick = function(item) {
                    window.location.href = item.img_link;
                }

                $scope.mallProductClick = function(item) {
                    window.location.href = LotteCommon.prdviewUrl+"?"+$scope.baseParam+"&goods_no="+item.goods_no;
                }

                // 20160718 대카 레이어 닫기
                $scope.hideCate = function() {
					$scope.screenData.showAllCategory = false
                };

                // 20160718 중카레이어 닫기
				$scope.hideSubCate = function() {
					$scope.screenData.selectCate1 = false;
                };
            }
        };
    }]);

})(window, window.angular);