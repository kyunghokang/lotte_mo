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

    app.controller('WineDetailCtrl', ['$http', '$scope', '$filter', '$sce', 'LotteCommon','commInitData', function($http, $scope, $filter,$sce, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.screenID = "wineDetail";
        $scope.subTitle = "와인&스토리 Vine"; //서브헤더 타이틀
        
        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
       			conts_no: 0
        	}
        	$scope.screenData = {
        		lzine_detail: [],
        		dispNo: 5520976,
        		showAllCategory: false,
        		selectCate1: 0,
        		selectCate2: 0,
        		selectCate3: 0,
        		selectedCategory: 0,
        		cate_list: [],
        		html_data: ''
        	}
        })();
        
        /*
         * 화면에 필요한 인자값 세팅
         */
        if(commInitData.query['conts_no'] != undefined) {
        	$scope.pageOptions.conts_no = commInitData.query['conts_no'];
        }
        
        $scope.buildSearchUrl = function() {
        	// http://molocal.lotte.com/json/webzine/lzine_detail.json?conts_no=40918
        	var url = LotteCommon.vineDetailData+"?"+$scope.baseParam;
        	if($scope.pageOptions.conts_no != '') {
        		url += "&conts_no="+$scope.pageOptions.conts_no;
        	}
        	return url;
        }
        
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
        
        $scope.getProductData = function() {
        	$scope.productListLoading = true;
        	$scope.$parent.LotteSuperBlockStatus = true;
        	try {
	        	$http.get($scope.buildSearchUrl())
	        	.success(function(data) {
	        		$scope.screenData.lzine_detail = data.lzine_detail;
	        		
	        		if($scope.screenData.lzine_detail.conts_html_fcont != "") {
	        			$scope.screenData.lzine_detail.conts_html_fcont = $scope.screenData.lzine_detail.conts_html_fcont.replace(/product\/m\/product_wine_view\.do\?/g,"product/m/product_wine_view.do?"+$scope.baseParam+"&");
	        			$scope.screenData.lzine_detail.conts_html_fcont = $scope.screenData.lzine_detail.conts_html_fcont.replace(/product\/product_wine_view\.do\?/g,"product/product_wine_view.do?"+$scope.baseParam+"&");
	        		}
	        		$scope.screenData.html_data = $sce.trustAsHtml($scope.screenData.lzine_detail.conts_html_fcont);
	        		
	        		$scope.productListLoading = false;
	            	$scope.$parent.LotteSuperBlockStatus = false;
	            	
	            	$scope.screenData.cate_list = data.lzine_detail.cate_list.items;
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
	        	})
	        	.error(function() {
	        		$scope.productListLoading = false;
	            	$scope.$parent.LotteSuperBlockStatus = false;
	        	});
        	} catch(e) {}
        }

        $scope.getProductData();
    }]);

    app.directive('lotteContainer', ['LotteCommon', function(LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/webzine/m/lzine_detail_container.html',
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
	        	// 20160718 중카레이어 닫기
				$scope.hideSubCate = function() {
					$scope.screenData.selectCate1 = false;
                };
                    
            }
        };
    }]);

})(window, window.angular);