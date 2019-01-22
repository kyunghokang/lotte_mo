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

    app.controller('GucciMainCtrl', ['$http','$scope', '$window', 'LotteCommon', function($http, $scope, $window, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "gucci_main"; //서브헤더 타이틀


        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
        	$scope.screenData = {
        		page: 0,
        		disp_name: "구찌 공식 스토어",
        		dispNo: 5522717,
        		showAllCategory: false,
        		selectCate1: 0,
        		selectCate2: 0,
        		selectCate3: 0,
        		selectedCategory: 0,
        		cate_list: [],
        		planshop_banner_list: [],
        		new_arrival_prod_list: []
        	}
        })();

        // New Arrivals Click
        $scope.newArrival = function() {
        	//curDispNo=5522717 에서 5522740 로 변경
        	$window.location.href = "/category/m/prod_list.do?c=mlotte&udid=&v=&cn=&cdn=&curDispNo=5522740&tclick=G_NEW_PRD";
        }

        // gucci FAQ
        $scope.gucciFAQClick = function() {
        	$window.location.href = "/custcenter/m/submain_gucci.do"+"?"+$scope.baseParam+"&tclick=G_FAQ";
        }

        // gucci QNA
        $scope.gucciQNAClick = function() {
        	$window.location.href = "/product/product_quest_write_gucci.do"+"?"+$scope.baseParam+"&tclick=G_QnA";
        }

        // 상품클릭
        $scope.goProduct = function(goods_no) {
       		$window.location.href = LotteCommon.baseUrl + "/product/m/product_view_gucci.do?goods_no=" + goods_no + "&" + $scope.baseParam ;
        }

        $scope.subTitle = $scope.screenData.disp_name;

        // dispNo = 5522717 구찌
        $scope.checkHasSub = function(item) {
        	angular.forEach(item.sub_cate_list, function(val) {
        		if(val.sub_cate_list != null) {
        			val.hasSub = true;
					val = $scope.checkHasSub(val.sub_cate_list);
        		} else {
        			val.hasSub = false;
        		}
        	});
        }

        /*
         * 스크린 데이터 로드
         */
        $scope.loadScreenData = function() {
        	console.log("스크린 데이터 로드...");
        	$scope.screenData.page++;
        	$scope.productListLoading = true;
        	$http.get(LotteCommon.specialMall+'?dispNo='+$scope.screenData.dispNo)
        	.success(function(data) {
        		var contents = [];
        		var newVal = [];
        		if(data['max'] != undefined) {
        			contents = data['max'];
        			console.log(contents.cate_list.items );
        			angular.forEach(contents.cate_list.items, function(val, key) {
        				if(val.sub_cate_list != null) {
        					val.hasSub = true;
        					$scope.checkHasSub(val.sub_cate_list);
        				} else {
        					val.hasSub = false;
        				}
    				});
        			$scope.screenData.cate_list = contents.cate_list.items;
        			$scope.screenData.planshop_banner_list = contents.planshop_banner_list.items;
        			$scope.screenData.new_arrival_prod_list = contents.new_arrival_prod_list.items;
        			$scope.productListLoading = false;
        		}
        	});
        }

        /*
         * TODO: 화면 나갈때 세션에 데이터 저장 및 세선 체크후 데이터 세팅 부분 공통화 개발 필요
         */
        $scope.loadScreenData();
    }]);

    app.directive('lotteContainer', ['LotteCommon', function(LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/gucci/gucci_main_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	/*
            	 * 메뉴 카테고리 클릭
            	 */
            	$scope.menuCategoryClick = function(item) {
            		$scope.menuCategory1Click(item);
            		$scope.screenData.showAllCategory = false;
            	}

            	$scope.menuCategory1Click = function(item) {
            		if(item.link_url != "") {
            			window.location.href = item.link_url;
            		} else {
            			if($scope.screenData.selectCate1 == item.disp_no) {
            				$scope.screenData.selectCate1 = 0;
            			} else {
                			$scope.screenData.selectCate1 = item.disp_no;
            			}
            		}
            	}
            	$scope.menuCategory2Click = function(item, item2) {
            		if(item.link_url != "") {
            			window.location.href = item.link_url;
            		} else {
            			if($scope.screenData.selectCate2 == item.disp_no) {
            				$scope.screenData.selectCate2 = 0;
            			} else {
                			$scope.screenData.selectCate2 = item.disp_no;
            			}
            		}
            	}
            	$scope.menuCategory3Click = function(item, item2) {
            		if(item.link_url != "") {
            			window.location.href = item.link_url;
            		} else {
            			if($scope.screenData.selectCate3 == item.disp_no) {
            				$scope.screenData.selectCate3 = 0;
            			} else {
                			$scope.screenData.selectCate3 = item.disp_no;
            			}
            		}
            	}
            	/*
            	 * 모든 매뉴 보기 클릭
            	 */
            	$scope.showAllCategoryClick = function() {
            		if($scope.screenData.showAllCategory) {
            			$scope.screenData.showAllCategory = false;
            		} else {
            			$scope.screenData.showAllCategory = true;
            		}
            	}
            	/*
            	 * 플렌샵 배너 클릭
            	 */
            	$scope.planshopBannerClick = function(item) {
            		window.location.href = item.link_url;
            	}
            	/*
            	 * 배너 클릭
            	 */
            	$scope.gucciBannerClick = function(item) {
            		window.location.href = item.img.link_url+"&"+$scope.baseParam;
            	}

            	// 20160718 대카 레이어 닫기
                $scope.hideCate = function() {
					$scope.screenData.selectCate1 = false
                };
            }
        };
    }]);
    /* header each */
    app.directive('subHeaderEach', [ '$window', function($window) {
        return {
            replace : true,
            link : function($scope, el, attrs) {
                /*이전 페이지 링크*/
                $scope.gotoPrepage = function() {
                    $scope.sendTclick("m_RDC_header_new_pre");
                    history.go(-1);
                };

                var $el = angular.element(el),
                    $win = angular.element($window),
                    headerHeight = $scope.subHeaderHeight;

                $win = angular.element($window),
                headerHeight = $scope.subHeaderHeight;

                function setHeaderFixed() {
                    if ($scope.appObj.isNativeHeader) {
                        headerHeight = 0;
                    }

                    if ($win.scrollTop() >= 0) {
                        $el.attr("style", "z-index:100;position:fixed;top:" + headerHeight +"px;width:100%");
                    } else {
                        $el.removeAttr("style");
                    }
                }

                $win.on('scroll', function (evt) {
                    setHeaderFixed();
                    setTimeout(setHeaderFixed, 300);
                });
            }
        }
    }]);
})(window, window.angular);
