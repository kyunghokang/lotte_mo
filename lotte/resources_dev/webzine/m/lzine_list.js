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

    app.controller('lzineListCtrl', ['$http','$scope', 'LotteCommon', function($http, $scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.screenID = "wine";
        $scope.subTitle = "와인&스토리 Vine"; //서브헤더 타이틀
        
        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
        	$scope.screenData = {
        		page: 0,
        		disp_name: "와인&스토리 Vine",
        		dispNo: 5520976,
        		showAllCategory: false,
        		selectCate1: 0,
        		selectCate2: 0,
        		selectCate3: 0,
        		selectedCategory: 0,
        		cate_list: [],
        		planshop_banner_list: [],
        		new_arrival_prod_list: [],
        		webzine_conts_list: []
        	}
        })();
        
        $scope.subTitle = $scope.screenData.disp_name;

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
        	$scope.productListLoading = true;
        	$http.get(LotteCommon.specialMall+'?dispNo='+$scope.screenData.dispNo)
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
        			$scope.webzine_conts_list = contents.webzine_conts_list.items;
        			$scope.productListLoading = false;
        		}
        	}).error(function(data){
                console.log('Error Data : 데이터 로딩 에러');
                $scope.productListLoading = false;
            });
        }
        
        /*
         * TODO: 화면 나갈때 세션에 데이터 저장 및 세선 체크후 데이터 세팅 부분 공통화 개발 필요
         */
        $scope.loadScreenData();
    }]);

    app.directive('lotteContainer', ['LotteCommon', function(LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/webzine/m/lzine_list_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	/*
            	 * 메뉴 카테고리 클릭
            	 */
            	$scope.menuCategory1Click = function(item) {
            		if(!item.hasSub) {
            			window.location.href = LotteCommon.specialMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+"&isWine=Y";
            		} else {
            			if($scope.screenData.selectCate1 == item.disp_no) {
            				$scope.screenData.selectCate1 = 0;
            			} else {
                			$scope.screenData.selectCate1 = item.disp_no;
            			}
            			$scope.screenData.showAllCategory = false;
            		}
            	}
            	$scope.menuCategory2Click = function(item, item2) {
            		if(!item.hasSub) {
            			window.location.href = LotteCommon.specialMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+"&isWine=Y";
            		} else {
            			if($scope.screenData.selectCate2 == item.disp_no) {
            				$scope.screenData.selectCate2 = 0;
            			} else {
                			$scope.screenData.selectCate2 = item.disp_no;
            			}
            			$scope.screenData.showAllCategory = false;
            		}
            	}
            	$scope.menuCategory3Click = function(item, item2) {
            		if(!item.hasSub) {
            			window.location.href = LotteCommon.specialMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+"&isWine=Y";
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
            		
            	}
            	/*
            	 * 와인 배너 클릭
            	 */
            	$scope.wineContentClick = function(item) {
            		window.location.href = item.link_url + ((item.link_url.indexOf('?')!=-1)?'&':'?') + $scope.baseParam;
            	}
            	
            	// 20160718 중카레이어 닫기
				$scope.hideSubCate = function() {
					$scope.screenData.selectCate1 = false;
                };
            }
        };
    }]);

})(window, window.angular);