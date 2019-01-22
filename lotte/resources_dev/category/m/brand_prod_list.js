(function(window, angular, undefined) {
    'use strict';
    
    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteUtil',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteSns',
        'lotteProduct',
        'lotteNgSwipe',
		'cateSideSearch'
    ]);
    
    app.controller('BrandSubCtrl', ['$window', '$location' ,'$http', '$scope', '$timeout', '$filter', 'LotteStorage', 'LotteCommon','commInitData', function($window, $location ,$http, $scope, $timeout, $filter, LotteStorage, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productMoreScroll = true;
        $scope.screenID = "BrandShop";
        $scope.subTitle = "";
        $scope.templateType = "list";
        $scope.isShowThisSns = true; /*공유버튼*/
        
        $scope.brandInfo = [];
        $scope.BrandCateList = [];
        $scope.productList = [];
        $scope.BannerList = [];
        $scope.BannerList2 = [];
        
        $scope.upBrdNo = "";
        $scope.brdNo = "";
        
        $scope.ctgIdx = 0;
        
        if(commInitData.query['upBrdNo'] != undefined) {
        	$scope.upBrdNo = commInitData.query['upBrdNo'];
        }
        if(commInitData.query['brdNo'] != undefined) {
        	$scope.brdNo = commInitData.query['brdNo'];
        }
        
        $scope.curDispNo = $scope.brdNo!="" ? $scope.brdNo : $scope.upBrdNo;
        
        $scope.prdListLayerY = 471;
        $scope.cateSelectIndex = -1;
        
        $scope.doAnchor = false;
        $scope.isBrandProdList = true;
        $scope.isFirstLoad = true;
        $scope.isChrome = (navigator.userAgent.match('Chrome') != null ? true : false);
        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
        	/*$scope.pageOptions = {
        		tabShow:false,
        		tabIndex: 0,
        		sortIdx: 0,
        		tipShow: false,
        		selectStore: 'A',
        		selectDept: false,
        		selectCategory: 0,
        		selectCategoryCode: '',
        		selectCategoryParentNo:0,
        		selectCategoryDepth: 1,
        		selectBrand: 0,
        		brandSort: 1,
        		brandOrder: '-brnd_cnt',
        		checkShipFree: false,
        		checkPoint: false,
        		checkDividFree: false,
        		checkSmartPic: false,
        		selectSmartPic: 0,
        		selectSmartPicText: '전체',
        		smartPicBox: false,
        		disableSmartPic: true,
        		keyword: '',
        		minPrice: '',
        		maxPrice: '',
        		minLimitPrice: 0,
        		maxLimitPrice: 0,
        		cateRadioDep1:'',
        		cateRadioDep2:'',
        		cateRadioDep3:'',
        		detailOption1: null,
        		detailOption2: null,
        		detailOption3: null,
        		sort: [
           			{sortText:'신상품',sortClass:'updown',searchKey:'DATE,1'}, 
        			{sortText:'판매순',sortClass:'updown',searchKey:'TOT_ORD_CNT,1'}, 
        			{sortText:'상품평',sortClass:'updown',searchKey:'TOT_REVIEW_CNT,1'}, 
        			{sortText:'신상품',sortClass:'updown',searchKey:'DATE,1'}, 
        			{sortText:'가격',sortClass:'down',searchKey:'DISP_PRICE,0'}, 
        			{sortText:'가격',sortClass:'up',searchKey:'DISP_PRICE,1'}, 
        		 ]
        	}*/
        	$scope.screenData = {
        		//page: 0,
        		//pageSize: 20,
        		//pageEnd: false,
        		//disp_name: null,
        		//disp_no: null,
        		//idx: "",
        		mGrpNo: "",
        		upBrdNo: ""
        		//goodsTotal: 0,
        		//maxGoodsTotal:0,
        		//productList: [],
        		//hasDept: false,
        		//D_CATE: [], // 백화점
        		//C_CATE: [], // 유아동관
        		//Y_CATE: [], // 영플라자
        		//L_CATE: [], // 롯데닷컴
        		//E_CATE: [], // 기타
        		//F_CATE: [], // 식품
        		//M_CATE: [], // 롯데맨즈
        		//H_CATE: [], // 홈쇼핑
        		//S_CATE: [], // 전문몰
        		//CATE: [],
        		//brandInfo: [], // 
        		//StoreList: [],
        		//categoryList: [],
        		//DetailDepth1: [],
        		//DetailDepth2: [],
        		//DetailDepth3: []
        	}
        })();
        
        /*
         * 화면에 필요한 인자값 세팅
         */
        if(commInitData.query['upBrdNo'] != undefined) {
        	$scope.screenData.upBrdNo = commInitData.query['upBrdNo'];
        }
        if(commInitData.query['mGrpNo'] != undefined) {
        	$scope.screenData.mGrpNo = commInitData.query['mGrpNo'];
        }
        if(commInitData.query['title'] != undefined) {
        	//$scope.screenData.disp_name = decodeURIComponent(commInitData.query['title']);
        	//$scope.subTitle = $scope.screenData.disp_name;
        	$scope.subTitle = decodeURIComponent(commInitData.query['title']);
        }
        
        $scope.curDispNoSctCd = 74;
        
	    $scope.setBrandMainData = function(data) {
	    	
	    	try{
	        	$scope.brandInfo = data.brndInfo;
	        	$scope.subTitle = $scope.brandInfo.brnd_nm;
	        	
	        	if(data.BrandCateList && $scope.BrandCateList.length < 1) {
	        		
	        		for(var i = 0; i<data.BrandCateList.length; i++){
	        			var objTemp = data.BrandCateList[i];
	        			objTemp['cate_cnt'] = parseInt(objTemp['cate_cnt'], 10);
	        			if($scope.isFirstLoad && $scope.screenData.mGrpNo && $scope.screenData.mGrpNo == objTemp['disp_no']){
	        				$scope.cateSelectIndex = i;
	        				$scope.doAnchor = true;
	        				$scope.isFirstLoad = false;
	        			}
	        			$scope.BrandCateList.push(objTemp);
	        		}
	        		$scope.BrandCateList = $filter('orderBy')($scope.BrandCateList, '-cate_cnt');
	        	}
	        	if(data.Banner && $scope.BannerList.length < 1) {
		        		
	        		var dataTotal = data.Banner.items != null ? data.Banner.items.length : 0;
	        		var sliceData = [];
	        		var normalData = [];
	        		
	        		if (data.Banner.items && dataTotal > 0) {
	        			
	        			for (var k = 0; k < dataTotal; k++) {
	        				
	        				if(data.Banner.items[k]['img_url_addr']){
								normalData.push(data.Banner.items[k]);
							}
	        			}
	        			$scope.BannerList = normalData;
	        		}
	        		
	        		if (normalData.length > 0) {
						var i = 0,
							j = -1;

						for (i; i < normalData.length; i++) {
							if (i % 3 == 0) {
								j++;
								sliceData[j] = [];
							}
							normalData[i]['itemIdx'] = i;
							sliceData[j].push(normalData[i]);
						}
						$scope.BannerList2 = sliceData;
	        		}
	        	}
	        	if(data.RecGoodsList && $scope.productList.length < 1) {
	        		
	        		var dataTotal = data.RecGoodsList.items != null ? data.RecGoodsList.items.length : 0;
	        		var sliceData = [];
	        		
	        		if (data.RecGoodsList.items && dataTotal > 0) {
						var i = 0,
							j = -1;

						for (i; i < dataTotal; i++) {
							if (i % 3 == 0) {
								j++;
								sliceData[j] = [];
							}
							data.RecGoodsList.items[i]['itemIdx'] = i;
							sliceData[j].push(data.RecGoodsList.items[i]);
						}
						$scope.productList = sliceData;
	        		}
	        	}
	        	$timeout(function(){
	        		$scope.prdListLayerY = $(".result_wrap").offset().top - ( $scope.appObj.isAndroid && !$scope.isChrome ? 0 : 45 );
	        		if($scope.doAnchor){
	        			$scope.doAnchor = false;
	        			angular.element($window).scrollTop($scope.prdListLayerY - 52);
	        		}
	        	}, 1000);
	        	
	        	//$scope.$apply();
        	} catch(e) {
        		console.log('Error Data : 브랜드 데이터 로딩 실패');
        	}
	    };
	    
	    // 세션에서 가저올 부분 선언 
        //
        //
        var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
        //var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
        var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');
        
        if(StoredLoc == window.location.href && $scope.locationHistoryBack && !$scope.screenData.mGrpNo) {
        	/*var StoredData = JSON.parse(StoredDataStr);
    		$scope.pageLoading = false;

        	$scope.brandInfo = StoredData.brandInfo;
        	$scope.BrandCateList = StoredData.BrandCateList;
        	$scope.BannerList = StoredData.BannerList;
        	$scope.productList = StoredData.productList;
        	
        	$scope.subTitle = $scope.brandInfo.brnd_nm;*/
        	$timeout(function() {
        		angular.element($window).scrollTop(StoredScrollY);
        	},800);
        }
        
        /**
         * unload시 관련 데이터를 sessionStorage에 저장
         */
        angular.element($window).on("unload", function(e) {
            /*var sess = {};
            sess.brandInfo = $scope.brandInfo;
        	sess.BrandCateList = $scope.BrandCateList;
        	sess.BannerList = $scope.BannerList;
        	sess.productList = $scope.productList;*/
            if (!commInitData.query.localtest && $scope.leavePageStroage) {
	            LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
	            //LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
	            LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
            }
        });
        
    }]);

    app.directive('lotteContainer',['LotteCommon', '$window', function(LotteCommon, $window) {
        return {
            templateUrl : '/lotte/resources_dev/category/m/brand_prod_list_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	$scope.brandSubClick = function(item) {
            		/*var brandNm = $scope.brandInfo ? $scope.brandInfo.brnd_nm:"";
            		var tclick = "&tclick="+$scope.tClickBase+$scope.screenID+"_Clk_Lnk_"+(this.$index+1);
            		location.href = LotteCommon.brandShopSubUrl+((LotteCommon.brandShopSubUrl.indexOf('?')!=-1)?"&":"?")+$scope.baseParam+"&upBrdNo="+$scope.upBrdNo+"&mGrpNo="+item.disp_no+"&title="+brandNm+"&curDispNoSctCd="+$scope.curDispNoSctCd+tclick;*/
            		$scope.postParams.mGrpNo = item.disp_no;
            		$scope.resetAllSearchTerm();
            		$scope.cateSelectIndex = this.$index;
            		
            		$scope.doAnchor = true;
            		$scope.ctgIdx = this.$index + 1;
            		var tclick = $scope.tClickBase+$scope.screenID+'_Clk_Lnk_' + $scope.ctgIdx;
					$scope.sendTclick(tclick);
            	};
            	
            	$scope.brandShopBannerClick = function(item) {
            		var tclick = "&tclick="+$scope.tClickBase+$scope.screenID+"_Swp_Ban_"+(item.itemIdx+1);
            		window.location.href = LotteCommon.prdlstUrl+((LotteCommon.prdlstUrl.indexOf('?')!=-1)?"&":"?")+$scope.baseParam+"&curDispNo="+item.spdp_no+"&curDispNoSctCd="+$scope.curDispNoSctCd+tclick;
            	};
            	
            	$scope.brandSelectAll = function(){
                	
            		$scope.postParams.mGrpNo = "";
            		$scope.resetAllSearchTerm();
            		$scope.cateSelectIndex = -1;
            		$scope.doAnchor = false;
            		
            		$scope.ctgIdx = 0;
            		
            		var tclick = $scope.tClickBase+$scope.screenID+'_Clk_Ttl';
					$scope.sendTclick(tclick);
                };
                
                $scope.newArrivalPrdClick = function(item) {
                	var tclick = "&tclick="+$scope.tClickBase+$scope.screenID+"_Clk_Prd_"+(item.itemIdx+1);
                    window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + tclick;
                };
            }
        };
    }]);
    
    app.directive('prodListLayer', ['$window', function($window) {
        return {
            replace : true,
            link : function($scope, el, attrs) {          
                var $body = angular.element('body'),
                    $headerSpace = angular.element('#headerSpace');
                
                var subHeaderHeight = 47;
                var topHeight = $scope.appObj.isApp ? subHeaderHeight : $scope.headerHeight + subHeaderHeight;
                angular.element($window).on('scroll', function(evt) {
                	var top = $scope.prdListLayerY;
                	if(!$scope.appObj.isApp){
                		top -= 52;
                	}
                	//console.log(this.pageYOffset, top);
                    if (this.pageYOffset > top){
                        $headerSpace.css("height",el[0].offsetHeight+"px");
                        el[0].style.cssText = 'z-index:49;position:fixed;top:'+ topHeight +'px;width:100%;border-bottom:1px solid #ddd;';
                    }else{
                        $headerSpace.css("height","0px");
                        el[0].style.cssText = 'border-bottom:none';
                	}
                });
            }
        }
    }]);
})(window, window.angular);