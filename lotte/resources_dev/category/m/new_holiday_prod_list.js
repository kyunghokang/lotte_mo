(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteUtil',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteProduct',
		'lotteNgSwipe'
	]);
	
	app.filter('pageRange', [function() {
		return function(items, page, pgsize) {
			var newItem = [];
			for(var i =0;i < items.length;i++) {
				if(page*pgsize <= i && (page+1)*pgsize > i) {
					newItem.push(items[i]);
				}
			}
			return newItem;
		}
	}]);

	app.controller('CateHolidayProdListCtrl', ['$window', '$location' ,'$http', '$scope', '$timeout', '$filter', 'LotteStorage', 'LotteCommon','commInitData', function($window, $location ,$http, $scope, $timeout, $filter, LotteStorage, LotteCommon, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.productMoreScroll = true;
		$scope.screenID = "HolidayCateTpl";
		$scope.subTitle = "";
		$scope.templateType = "list";
		$scope.pageLoading = true; // 페이지 첫 로딩
		/*
		 * 스크린 데이터 초기화
		 */
		($scope.screenDataReset = function() {
			$scope.pageOptions = {
				initPageParam: false,
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
				selectBrand: [],
				brandSort: 1,
				brandOrder: '-brnd_cnt',
				checkShipFree: false,
				checkPoint: false,
				checkDividFree: false,
				checkSmartPic: false,
				selectSmartPic: 0,
				selectSmartPicText: '전체',
				smartPicBox: false,
				detailOption1: null,
				detailOption2: null,
				detailOption3: null,
				sort: [
					{sortText:'판매순',sortClass:'updown',searchKey:'11'}, 
					{sortText:'상품평',sortClass:'updown',searchKey:'14'}, 
					{sortText:'신상품',sortClass:'updown',searchKey:'10'}, 
					{sortText:'가격',sortClass:'down',searchKey:'12'}, 
					{sortText:'가격',sortClass:'up',searchKey:'13'}, 
				 ]
			};

			$scope.screenData = {
				page: 0,
				pageSize: 20,
				pageEnd: false,
				disp_name: null,
				disp_no: null,
				idx: "",
				mGrpNo: '',
				goodsTotal: 0,
				maxGoodsTotal:0,
				hasDept: false,
				goodsList: [],
				D_CATE: [], // 백화점
				L_CATE: [], // 롯데닷컴 
				CATE: [],
				ParentCateInfo: [], // 상위카테고리 정보
				BrandList: [], // 브랜드 리스트
				StoreList: [], // 상점리스트
				DetailDepth1: [],
				DetailDepth2: [],
				DetailDepth3: []
			};
		})();

		/*
		 * 화면에 필요한 인자값 세팅
		 */
		if(commInitData.query['mGrpNo'] != undefined) {
			$scope.screenData.mGrpNo = commInitData.query['mGrpNo'];
		}
		if(commInitData.query['title'] != undefined) {
			$scope.screenData.disp_name = decodeURIComponent(commInitData.query['title']);
			$scope.subTitle = $scope.screenData.disp_name;
		}
		if(commInitData.query['curDispNo'] != undefined) {
			$scope.screenData.disp_no = commInitData.query['curDispNo'];
			$scope.pageOptions.selectCategory = $scope.screenData.disp_no;
		}
		if(commInitData.query['disp_no'] != undefined) {
			$scope.screenData.disp_no = commInitData.query['disp_no'];
			$scope.pageOptions.selectCategory = $scope.screenData.disp_no;
		}
		if(commInitData.query['idx'] != undefined) {
			$scope.screenData.idx = commInitData.query['idx'];
		}
		
		$scope.curDispNo = $scope.screenData.disp_no;		
		
		var qsort = parseInt(commInitData.query['sort']);//정렬 기본값
		if(isNaN(qsort)){ qsort = 0; }
		if(qsort < 0 || qsort > 4){ qsort = 0; }
		$scope.pageOptions.sortIdx = qsort;
		
		if ($scope.curDispNo == '5560947') {		
			$scope.pageOptions.sortIdx = 3;
		}
		
		$scope.curDispNoSctCd = 73;
		
		$scope.tabResetCore = function(tabIndex) {
			switch(tabIndex) {
			case 1:
				$scope.pageOptions.selectStore = 'A';
				$scope.pageOptions.selectCategoryCode = '';
				$scope.pageOptions.selectCategory = $scope.screenData.disp_no;
				$scope.pageOptions.selectCategoryDepth = 1;
				$scope.tabResetCore(2);
				$scope.tabResetCore(3);
				$scope.tabResetCore(4);
				$scope.screenData.DetailDepth1 = [];
				$scope.getSearchOptionData(null,{disp_no:$scope.screenData.disp_no,cate_depth:$scope.pageOptions.selectCategoryDepth});
				break;
			case 4:
				$scope.pageOptions.sortIdx = 0;
				$scope.pageOptions.tipShow = false;
				break;
			}
		}
		
		$scope.tabReset = function() {
			$scope.tabResetCore($scope.pageOptions.tabIndex);
			$scope.reSearch();
		}
		
		$scope.buildSearchUrl = function() {
			// http://molocal.lotte.com/json/category/new_product_list.json?c=mlotte&udid=&v=&cn=&cdn=&schema=&disp_no=5537428&title=바디/헤어케어&tclick=m_side_cate_catesmall_5537428&depth=2&idx=1
			var url = LotteCommon.cateHolidayProdListData+"?"+$scope.baseParam;
			if(location.href.indexOf(".ellotte.com") == -1) {
				if($scope.screenData.mGrpNo != '') {
					url += "&mGrpNo="+$scope.screenData.mGrpNo;
				}
			}
			if($scope.pageOptions.selectDept) {
				url += "&grpTp=D";
			}
			if($scope.pageOptions.detailOption3 != null) {
				url += "&curDispNo="+$scope.pageOptions.detailOption3.disp_no;
				url += "&cateDepth="+$scope.pageOptions.detailOption3.cate_depth;
			} else if($scope.pageOptions.detailOption2 != null) {
				url += "&curDispNo="+$scope.pageOptions.detailOption2.disp_no;
				url += "&cateDepth="+$scope.pageOptions.detailOption2.cate_depth;
			} else if($scope.pageOptions.detailOption1 != null) {
				url += "&curDispNo="+$scope.pageOptions.detailOption1.disp_no;
				url += "&cateDepth="+$scope.pageOptions.detailOption1.cate_depth;
			} else {
				if($scope.pageOptions.selectCategory != 0) {
					url += "&curDispNo="+$scope.pageOptions.selectCategory;
				}
				if($scope.pageOptions.selectCategoryDepth != 0) {
					url += "&cateDepth="+$scope.pageOptions.selectCategoryDepth;
				}
			}
			//if($scope.pageOptions.sortIdx) { // 20160215 박형윤 리스트 소팅값 default 세팅 변경으로 sort 파라메타 추가
				url += "&sort="+$scope.pageOptions.sort[$scope.pageOptions.sortIdx].searchKey;
			//}

			if($scope.screenData.page) {
				url += "&page="+$scope.screenData.page;
			}
			if($scope.screenData.pageSize) {
				url += "&dispCount="+$scope.screenData.pageSize;
			}
			return url;
		}
		
		$scope.buildSearchOption = function(item) {
			var url = LotteCommon.mallCateAttrData+'?';
			if(location.href.indexOf(".ellotte.com") == -1) {
				if($scope.screenData.mGrpNo != '') {
					url += "&mGrpNo="+$scope.screenData.mGrpNo;
				}
			}
			url += "&cateNo="+item.disp_no;
			url += "&cateDepth="+item.cate_depth;
			return url;
		}
		
		$scope.getSearchOptionData = function(node, item) {
			try {
				$http.get($scope.buildSearchOption(item))
				.success(function(data) {
					if(node == 1) {
						$scope.screenData.DetailDepth1 = data;
					} else if(node == 2) {
						$scope.screenData.DetailDepth2 = data;
					} else if(node == 3) {
						$scope.screenData.DetailDepth3 = data;
					}
				});
			} catch(e) {
				console.log(e);
			}
		}
		
		$scope.lrange = [];
		
		$scope.getProductData = function() {
			if($scope.screenData.pageEnd) {
				return;
			}
			$scope.screenData.page++;
			if($scope.screenData.page > 1) {
				$scope.sendTclick($scope.tClickBase+$scope.screenID+'_Scl_Prd_page'+$scope.screenData.page);
				$scope.productListLoading = true;
			} else {
				$scope.pageLoading = true;
			}
			$scope.$parent.LotteSuperBlockStatus = true;
			try {
				$http.get($scope.buildSearchUrl())
				.success(function(data) {
					if(!$scope.screenData.L_CATE.length) {

						$scope.pageOptions.initPageParam = true;
						$scope.screenData.L_CATE = data.CateList.L_CATE;
						$scope.screenData.ParentCateInfo = data.cateInfo;
						$scope.pageOptions.minLimitPrice = data.goodsList.price_min ? data.goodsList.price_min:0;
						$scope.pageOptions.maxLimitPrice = data.goodsList.price_max ? data.goodsList.price_max:0;
						$scope.screenData.maxGoodsTotal = data.goodsList.rs_total_cnt;
						
						$scope.screenData.StoreList = data.StoreInfo;
						for(var i=0;i < $scope.screenData.StoreList.length;i++) {
							if($scope.screenData.StoreList[i].mall_nm == 'D_CATE' &&
									$scope.screenData.StoreList[i].cate_cnt != '0') {
								$scope.screenData.hasDept = true;
							}
						}
					}

					$scope.screenData.goodsTotal = data.goodsList.rs_total_cnt;

					if($scope.screenData.page > 1) {
						angular.forEach(data.goodsList.items, function(val, key) {
							$scope.screenData.goodsList.push(val);
						});
					} else {
						$scope.screenData.goodsList = data.goodsList.items;
					}
					
					if($scope.screenData.goodsTotal < $scope.screenData.page*$scope.screenData.pageSize) {
						$scope.screenData.pageEnd = true;
						$scope.productMoreScroll = false;
					}
					
					$scope.productListLoading = false;
					$scope.$parent.LotteSuperBlockStatus = false;
					$scope.pageLoading = false;
				})
				.error(function() {
					$scope.productListLoading = false;
					$scope.$parent.LotteSuperBlockStatus = false;
					$scope.pageLoading = false;
				});
			} catch(e) {}
		}
		
		$scope.reSearch = function() {
			$scope.productMoreScroll = true;
			$scope.screenData.pageEnd = false;
			$scope.screenData.page = 0;
			$scope.screenData.goodsTotal = 0;
			$scope.screenData.goodsList = [];
			angular.element($window).scrollTop(0);
			$scope.getProductData();
		}
		
		$scope.getBrandSwipeSize = function() {
			if($scope.screenData.BrandList.length) {
				var bNode = parseInt($scope.screenData.BrandList.length/8);
				if($scope.screenData.BrandList.length%8 != 0) {
					bNode++;
				}
				return new Array(bNode);
			}
			return new Array();
		}
		
		// 세션에서 가저올 부분 선언 
		var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
		var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
		var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');

		if(StoredLoc == window.location.href && $scope.locationHistoryBack) {
			var StoredData = JSON.parse(StoredDataStr);
			$scope.pageLoading = false;
			
			$scope.templateType = StoredData.templateType;
			$scope.pageOptions = StoredData.pageOptions;
			$scope.screenData = StoredData.screenData;
			$scope.subTitle = $scope.screenData.ParentCateInfo.DISP_NM;
			$timeout(function() {
				angular.element($window).scrollTop(StoredScrollY);
			},800);
		} else {
			$scope.getSearchOptionData(null,{disp_no:$scope.screenData.disp_no,cate_depth:$scope.pageOptions.selectCategoryDepth});
			$scope.getProductData();
		}
		
		/**
		 * unload시 관련 데이터를 sessionStorage에 저장
		 */
		angular.element($window).on("unload", function(e) {
			var sess = {};
			sess.templateType = $scope.templateType;
			sess.pageOptions = $scope.pageOptions;
			sess.screenData = $scope.screenData;
			if (!commInitData.query.localtest && $scope.leavePageStroage) {
				LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
				LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
				LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
			}
		});
		
		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.getParameterByName
		 * @description
		 * 파라메터 값 가져오기
		 * @example
		 * getParameterByName(name)
		 */
		function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		
		$scope.cateViewFlag = false; // 서브헤더 카테고리 여부
		$scope.cateView = function () {
			$scope.sendTclick('m_DC_new_prod_list_Clk_Ttl');
			$scope.cateViewFlag = !$scope.cateViewFlag;
		};
		/* 중카에서 가져오는 중카테고리 값*/
		$scope.cateDepth1 = {};
		$scope.cateDepth2 = {}; 
		$scope.depthCurDispNo = {}; 
		
		$scope.paramTitle = getParameterByName('cateDepth1');
		$scope.paramSubTitle = getParameterByName('cateDepth2');		
		$scope.paramCurDispNo = getParameterByName('curDispNo');
		$scope.paramCurDispNo2 = getParameterByName('curDispNo2');
		
		if (getParameterByName('cateDepth1') == ""){
        	$scope.cateDepth1 = ""; 
        } else if($scope.paramTitle.length >= 1) {
        	$scope.cateDepth1 = $scope.paramTitle; 
        }        
        if (getParameterByName('paramCurDispNo') == ""){
        	$scope.depthCurDispNo = ""; 
        } else if($scope.paramCurDispNo.length >= 1) {
        	$scope.depthCurDispNo = $scope.paramCurDispNo; 
        }
		if($scope.paramSubTitle.length >= 1){
			$scope.cateDepth2 = $scope.paramSubTitle; 
		}
		if($scope.paramCurDispNo2.length >= 1){
			$scope.curDispNo = $scope.paramCurDispNo2; 
		}
	}]);
	
	app.directive('lotteContainer', ['$window', 'LotteCommon', function($window,LotteCommon) {
		return {
			templateUrl : '/lotte/resources_dev/category/m/new_holiday_prod_list_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				/*
				 * 탭클릭 
				 */
				$scope.tabClick = function(idx) {
					$scope.sendTclick($scope.tClickBase+$scope.screenID+'_Clk_Flt'+idx);
					if($scope.pageOptions.tabIndex == idx) {
						$scope.pageOptions.tabIndex = 0;
						$scope.pageOptions.tabShow = false;
						$scope.pageOptions.tipShow = false;
					} else {
						$scope.pageOptions.tabIndex = idx;
						$scope.pageOptions.tabShow = true;
					}
				}
				
				/*
				 * 정렬 클릭
				 */
				$scope.sortClick = function(order) {
					if($scope.pageOptions.sortIdx != order) {
						$scope.sendTclick($scope.tClickBase+$scope.screenID+'_Clk_Flt4_idx0'+order);
						$scope.pageOptions.sortIdx = order;
						$scope.reSearch();
					}
				}
				
				$scope.tipShowClick = function() {
					$scope.pageOptions.tipShow = !$scope.pageOptions.tipShow;
				}
				
				/*
				 * 서브 카테고리 클릭
				 */
				$scope.subCateClick = function(item,code,parent) {
					if(code == '' && parent == null) {
						$scope.sendTclick($scope.tClickBase+$scope.screenID+'_Clk_Cat_A');
					} else if(parent == null) {
						$scope.sendTclick($scope.tClickBase+$scope.screenID+'_Clk_Cat_B');
					} else {
						$scope.sendTclick($scope.tClickBase+$scope.screenID+'_Clk_Cat_C');
					}
					if($scope.pageOptions.selectCategory == item.disp_no) {
						$scope.pageOptions.selectCategory = $scope.screenData.disp_no;
						$scope.pageOptions.selectCategoryDepth = 1;
						$scope.pageOptions.selectCategoryCode = '';
						$scope.pageOptions.detailOption1 = null;
						$scope.pageOptions.detailOption2 = null;
						$scope.pageOptions.detailOption3 = null;
						$scope.screenData.DetailDepth1 = [];
						$scope.screenData.DetailDepth2 = [];
						$scope.screenData.DetailDepth3 = [];
						$scope.pageOptions.cateRadioDep1 = '';
						$scope.pageOptions.cateRadioDep2 = '';
						$scope.pageOptions.cateRadioDep3 = '';
						$scope.getSearchOptionData(null,item);
					} else {
						$scope.pageOptions.selectCategoryCode = code;
						$scope.pageOptions.selectCategory = item.disp_no;
						$scope.pageOptions.selectCategoryDepth = item.cate_depth;
						if(parent != null) {
							$scope.pageOptions.selectCategoryParentNo = parent.disp_no;
							$scope.getSearchOptionData(1,item);
						} else {
							$scope.pageOptions.selectCategoryParentNo = item.disp_no;
						}
					}
					$scope.tabResetCore(2);
					$scope.tabResetCore(3);
					$scope.tabResetCore(4);
					$scope.reSearch();
				}
				
				/*
				 * 상점 선택 
				 */
				$scope.storeClick = function() {
					$scope.reSearch();
				}
				
				/*
				 * 탭 닫기 
				 */
				$scope.tabClose = function() {
					$scope.pageOptions.tabShow = false;
					$scope.pageOptions.tabIndex = 0;
					angular.element('#headerSpace').css("height",0);
				}
								
				$scope.selectSmartPicClick = function(item) {
					if(item == null) {
						$scope.pageOptions.selectSmartPic = 0;
						$scope.pageOptions.selectSmartPicText = '전체';
					} else {
						$scope.pageOptions.selectSmartPic = item.disp_no;
						$scope.pageOptions.selectSmartPicText = item.disp_nm;
					}
					$scope.closeSamrtPicClick();
					$scope.reSearch();
				}
				
				$scope.closeSamrtPicClick = function() {
					if( $scope.pageOptions.smartPicBox ) {
						$scope.dimmedClose();
						$scope.pageOptions.smartPicBox = false;
					}
				}
			}
		};
	} ]);

})(window, window.angular);