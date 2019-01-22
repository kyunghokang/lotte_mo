(function(window, angular, undefined) {
    'use strict';
    
    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg', 
        // 'lotteSideMylotte', 
        'lotteCommFooter'
    ]);

    app.controller('cscenterFaqCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'commInitData', function($scope, $http, $window, LotteCommon, commInitData) {
    	$scope.faqDeatailView = [];
    	
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "자주 찾는 질문"; // 서브헤더 타이틀
        $scope.gucci = $window.location.pathname.indexOf('gucci') > -1 ? true : false; // 구찌 여부

		if (commInitData.query['gucci'] == "Y") {
			$scope.gucci = true;
		}
		
        $scope.gucciLoading = true;
        
        $scope.faqDeatailView[$scope.faqList] = false; //FAQ

        $scope.faqList = [];
        $scope.faq_tot_cnt= 0;
        
        if($scope.gucci) {
	        //gucci
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
	        			$scope.gucciLoading = false;
	        		}
	        	});
	        }
	        
	        /*
	         * TODO: 화면 나갈때 세션에 데이터 저장 및 세선 체크후 데이터 세팅 부분 공통화 개발 필요
	         */
	        $scope.loadScreenData();
        }

        // Data Load
        $scope.getFaqDataLoad = function() {
        	$scope.thisPage++;
        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
        		return;
        	}
        	if($scope.gucci) {
        		$scope.faqDataParam = LotteCommon.cscenterFaqData + "?cust_inq_sml_tp_cd=1578" + "&page_num=" + $scope.thisPage;
        	} else {
        		$scope.faqDataParam = LotteCommon.cscenterFaqData + "?page_num=" + $scope.thisPage;
        	}
	        $http.get($scope.faqDataParam)
	        .success(function(data) {
	       		// 공지사항 리스트
	        	$scope.page_end = parseInt(data.page_end);
	        	console.log('page end ; ' + $scope.page_end)
	       		angular.forEach(data.faq_list.list.items, function(val, key) {
	       			$scope.faqList.push(val);
	       		});
	            $scope.faq_tot_cnt= data.faq_list.total_rows;
	        })
	        .error(function(data, status, headers, config){
	            console.log('Error Data : ', status, headers, config);
	        });
        }
        
        $scope.page_end = 0;
        $scope.thisPage = 0;
        $scope.getFaqDataLoad();
        
        // 더보기 클릭
    	$scope.moreListClick = function() {
    		$scope.getFaqDataLoad();
    	}
        
        // FAQ  개별보기
        $scope.faqDetail = function (item) {
        	if($scope.faqDeatailView[item.bbc_no] == true){
	       		angular.forEach($scope.faqList, function(val, key) {
	       			$scope.faqDeatailView[$scope.faqList[key].bbc_no] = false;
	       		});
        	} else {
        		angular.forEach($scope.faqList, function(val, key) {
        			$scope.faqDeatailView[$scope.faqList[key].bbc_no] = false;
	       		});
        		$scope.faqDeatailView[item.bbc_no] = true;        		
        	}
        };
        
        if($scope.gucci) {
	        //gucci
	        /*
	    	 * 메뉴 카테고리 클릭
	    	 */
	    	$scope.menuCategoryClick = function(item) {
	    		$scope.menuCategory1Click(item);
	    		$scope.screenData.showAllCategory = false;
	    	}
	    	
	    	$scope.menuCategory1Click = function(item) {
	    		if(item.link_url != "") {
	    			window.location.href = item.link_url+$scope.baseParam+"&curDispNo="+item.disp_no;
	    		} else {
	    			if($scope.screenData.selectCate1 == item.disp_no) {
	    				$scope.screenData.selectCate1 = 0;
	    			} else {
	        			$scope.screenData.selectCate1 = item.disp_no;
	    			}
	    		}
	    	}
	    	$scope.menuCategory2Click = function(item) {
	    		if(item.link_url != "") {
	    			window.location.href = item.link_url+$scope.baseParam+"&curDispNo="+item.disp_no;
	    		} else {
	    			if($scope.screenData.selectCate2 == item.disp_no) {
	    				$scope.screenData.selectCate2 = 0;
	    			} else {
	        			$scope.screenData.selectCate2 = item.disp_no;
	    			}
	    		}
	    	}
	    	$scope.menuCategory3Click = function(item) {
	    		if(item.link_url != "") {
	    			window.location.href = item.link_url+$scope.baseParam+"&curDispNo="+item.disp_no;
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
	        
	        $scope.gotoPrepage = function() {
	        	// console.log("----back;");
	            $scope.sendTclick("m_RDC_header_new_pre");
	            history.go(-1);
	        };
        }
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
						$el.attr("style", "z-index:10;position:fixed;top:" + headerHeight +"px;width:100%");
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
    
    app.directive('lotteContainer',[function(){
        return {
            templateUrl: '/lotte/resources_dev/custcenter/faq_container.html',
            replace:true,
            link:function($scope, el, attrs){
            }
        };
    }]);
    
})(window, window.angular);
