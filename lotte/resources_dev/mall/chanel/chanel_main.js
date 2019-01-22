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

    app.controller('ChanelMainCtrl', ['$http','$scope', '$window', 'LotteCommon', function($http, $scope, $window, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "chanel main"; //서브헤더 타이틀
        $scope.pageLoading = false;
        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
        	$scope.screenData = {
        		page: 0,
        		disp_name: "chanel 공식 스토어",
        		dispNo: 5564050,
        		showAllCategory: false,
        		selectCate1: 0,
        		selectCate2: 0,
        		selectCate3: 0,
        		selectedCategory: 0,
        		cate_list: [],
        		banner_list: [],
        		whats_new_prod_list: [],
        		best_seller_prod_list: [],
        		gift_prod_list: [],
        		cate_banner_list_01: [],
        		cate_banner_list_02: []
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
            $scope.screenData.page++;
            $scope.pageLoading = true;
            $scope.productListLoading = true;
            $http.get(LotteCommon.chanelMall+'?'+$scope.baseParam+'&dispNo='+$scope.screenData.dispNo)
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
                    //console.log($scope.screenData.cate_list );
                   $scope.screenData.cate_list = contents.cate_list.items;
        			$scope.screenData.banner_list = contents.banner_list.items;
        			$scope.screenData.whats_new_prod_list = contents.whats_new_prod_list;
        			$scope.screenData.best_seller_prod_list = contents.best_seller_prod_list;
        			$scope.screenData.gift_love_prod_list = contents.gift_love_prod_list;
        			$scope.screenData.whats_new_prod_listView = contents.whats_new_prod_list.prod_list.items;
        			$scope.screenData.best_seller_prod_listView = contents.best_seller_prod_list.prod_list.items;
        			$scope.screenData.gift_love_prod_listView = contents.gift_love_prod_list.prod_list.items;
        			$scope.screenData.cate_banner = contents.cate_banner;
        			$scope.screenData.cate_banner.list_bnr = contents.cate_banner.list_bnr.items;
        			$scope.screenData.event_banner = contents.event_banner;
        			$scope.screenData.event_banner.list_bnr = contents.event_banner.list_bnr.items;        			
        			
        			$scope.productListLoading = false;
                    $scope.pageLoading = false;
                }
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

    app.directive('lotteContainer',['$window','LotteCommon', function($window, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/chanel/chanel_main_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	/*
				 * 메뉴 카테고리 클릭
				 */
				$scope.menuCategoryClick = function(item) {
					$scope.menuCategory1Click(item);
				}
				
				$scope.menuCategory1Click = function(item,index) {
            		$scope.menuCategory1Index = 0;
            		if(item.link_url != "") {
						//window.location.href = item.link_url; 
						window.location.href = LotteCommon.chanelMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+(item.sort ? "&sortQuery="+item.sort : '');
					} else {
						if($scope.screenData.selectCate1 == item.disp_no) {
							$scope.screenData.selectCate1 = 0;
							angular.element('.navi_area').removeClass("on"); //레이어 닫기
							angular.element('nav').removeClass("on"); //레이어 닫기
						} else {
							$scope.screenData.selectCate1 = item.disp_no;
							angular.element('.navi_area').addClass("on"); //레이어 열기
							angular.element('nav').addClass("on"); //레이어 닫기
						}
					}
            		$scope.menuCategory1Index = index; //순서
                    $scope.sendTclick("m_DC_specialshop_Chanel_category_" + item.disp_no);
				}
				$scope.menuCategory2Click = function(item, item2, index) {
					$scope.menuCategory2Index = 0;
					if(!item2){
						item2 = ""; //temp
					}
					if(item.link_url != "") {
						var url = LotteCommon.chanelMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+(item.sort ? "&sortQuery="+item.sort : '');
						url += "&tclick=" + 'm_DC_specialshop_Chanel_category_'+ item.disp_no;
						$window.location.href = url;
					} else {
						if($scope.screenData.selectCate2 == item.disp_no) {
							$scope.screenData.selectCate2 = 0;							
						} else {
							$scope.screenData.selectCate2 = item.disp_no;
							$scope.menuCategory2Index = index; //순서
							$scope.sendTclick("m_DC_specialshop_Chanel_category_" + item.disp_no);
						}
					}					
				}
				$scope.menuCategory3Click = function(item, item2, index) {
					if(item.link_url != "") {
						var url = LotteCommon.chanelMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+(item.sort ? "&sortQuery="+item.sort : '');
						url += "&tclick=" + 'm_DC_specialshop_Chanel_category_' + item.disp_no;
						$window.location.href = url;
					} else {
						if($scope.screenData.selectCate3 == item.disp_no) {
							$scope.screenData.selectCate3 = 0;
						} else {
							$scope.screenData.selectCate3 = item.disp_no;
						}
					}					
				}
            	
            	$scope.goSubCategory = function (linkUrl, tclick) { 
            		if (linkUrl) {
                		window.location.href = linkUrl +"&"+$scope.baseParam + (tclick ? "&tclick=" + tclick : "");
                	}
				};
				
				
            	
            	// 레이어 닫기
                $scope.hideCate = function() {
					$scope.screenData.selectCate1 = false;
					angular.element('.navi_area').removeClass("on");
					angular.element('nav').removeClass("on"); //레이어 닫기
                };
                
                $scope.BannerClick = function(linkUrl, tclick) {
                	if (linkUrl) {
                		window.location.href = linkUrl+"&"+$scope.baseParam + (tclick ? "&tclick=" + tclick : "");
                	}
                }
                
                $scope.mallProductClick = function(item, tclick) {
                	var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNoSctCd=46";
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }
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