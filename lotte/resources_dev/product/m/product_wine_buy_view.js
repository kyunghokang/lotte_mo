(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);
    
    app.filter('strToDate', [function() {
    	return function(item) {
    		return item.substr(0,4)+"년 "+item.substr(4,2)+"월 "+item.substr(6,2)+"일";
    	}
    }]);

    app.controller('ProductWindSmartpicCtrl', ['$scope', '$http', '$window', '$timeout', 'LotteCommon', 'commInitData', function($scope, $http , $window, $timeout, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "스마트픽 예약 정보"; //서브헤더 타이틀
        
        $scope.screenDataReset = function() {
        	$scope.screenData = {
       			orderCount: 1,
       			mastDispNo: 0,
       			smp_goods_no: 0,
       			smpStoreIdx: '',
       			smpStorePickupDate: '',
       			smpPickerPhone: [],
       			smpPickerName: '',
       			smpPickerMyself: true,
       			smpRegComplete: false,
       			storeList: [],
       			wine: [],
       			WorkDay:[]
        	}
        };
        $scope.screenDataReset();
        /*
         * 화면에 필요한 인자값 세팅
         */
        if(commInitData.query['mastDispNo'] != undefined) {
        	$scope.screenData.mastDispNo = commInitData.query['mastDispNo'];
        }
        if(commInitData.query['goods_no'] != undefined) {
        	$scope.screenData.smp_goods_no = commInitData.query['goods_no'];
        }
        

        $scope.getProductData = function() {
        	$scope.productListLoading = true;
        	$scope.$parent.LotteSuperBlockStatus = true;
        	try {
	        	$http.get("/json/product/product_wine_buy_view.json"+"?"+$scope.baseParam+"&curDispNo="+$scope.screenData.mastDispNo+"&goods_no="+$scope.screenData.smp_goods_no)
	        	.success(function(data) {
	        		$scope.screenData.storeList = data.storeList.items;
	        		$scope.screenData.wine = data.wine;
	        		$scope.screenData.smpPickerName = $scope.screenData.wine.mbr_name;
	        		$scope.screenData.smpPickerPhone[0] = $scope.screenData.wine.cell_sct_no;
	        		$scope.screenData.smpPickerPhone[1] = $scope.screenData.wine.cell_txno_no;
	        		$scope.screenData.smpPickerPhone[2] = $scope.screenData.wine.cell_end_no;
	        		if($scope.postdata && (!$scope.postdata.ord_qty || $scope.postdata.ord_qty =='')){
	                	$scope.postdata.ord_qty = "1";
	                }
	                $scope.screenData.orderCount = $scope.postdata.ord_qty;
	                console.log($scope.postdata.ord_qty);
	        		$scope.productListLoading = false;
	            	$scope.$parent.LotteSuperBlockStatus = false;
	        	})
	        	.error(function() {
	        		$scope.productListLoading = false;
	            	$scope.$parent.LotteSuperBlockStatus = false;
	        	});
        	} catch(e) {}
        }
        
        $scope.getStoreInfo = function() {
        	try {
	        	$http.get("/json/product_wine_date_ajax.json"+"?"+"&shopNo="+$scope.screenData.storeList[$scope.screenData.smpStoreIdx].pitem_no+"&goods_no="+$scope.screenData.smp_goods_no+"&mbrNo="+$scope.loginInfo.mbrNo+"&cutDay=7")
	        	.success(function(data) {
	        		$scope.screenData.WorkDay = data.WorkDay.items;
	        		$scope.productListLoading = false;
	            	$scope.$parent.LotteSuperBlockStatus = false;
	        	})
	        	.error(function() {
	        		$scope.productListLoading = false;
	            	$scope.$parent.LotteSuperBlockStatus = false;
	        	});
        	} catch(e) {}
        }
        
        $scope.reSearch = function() {
        	$scope.screenData.page = 0;
        	$scope.screenData.goodsTotal = 0;
    		$scope.screenData.goodsList = [];
    		$scope.getProductData();
        }
        
        $scope.getProductData();
    }]);

    app.directive('lotteContainer', ['$timeout', 'LotteForm','$window','LotteCommon', function($timeout,LotteForm,$window,LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/product_wine_buy_view_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	$scope.orderCountChange = function(m) {
            		if(m == '-') {
            			if($scope.screenData.orderCount > 1) {
            				$scope.screenData.orderCount--;
            			}
            		} else {
            			$scope.screenData.orderCount++;
            		}
            	}
            	
            	$scope.changeSmpStore = function() {
            		if($scope.screenData.smpStoreIdx != '') {
            			$scope.getStoreInfo();
            		}
            		$scope.screenData.smpStorePickupDate = '';
            	}
            	
            	$scope.smpRegCompleteClose = function() {
            		if($scope.screenData.smpRegComplete) {
                		$scope.screenData.smpRegComplete = false;
            			$scope.dimmedClose();
            		}
            		// 스마트픽 리스트 화면으로 이동
            		$window.location.href = LotteCommon.smartPickListUrl + "?" + $scope.baseParam + "&tclick=m_my_smartpick"; 
            	}
            	
            	$scope.submitClick = function() {
                    var split_str = ":^:";
                    var storeList = [];
                    var pickupDateList = [];
                    var locationSn = [];
                    var smpTpCd = [];
					if($scope.screenData.smpStoreIdx == '' ||
						$scope.screenData.smpStoreIdx == undefined) {
						alert("지점을 선택해 주세요.");
						return false;
					}
					if($scope.screenData.smpStorePickupDate == '' || $scope.screenData.smpStorePickupDate == undefined) {
						alert("방문 예정일을 선택해 주세요.");
						return false;
					}
					if($scope.screenData.smpPickerName == '' || $scope.screenData.smpPickerName == undefined) {
						alert("방문자를 입력해 해 주세요.");
						return false;
					}
					if(!$scope.screenData.smpPickerPhone[0] ||
							!$scope.screenData.smpPickerPhone[1] ||
                            !$scope.screenData.smpPickerPhone[2]) {
						alert("방문자를 전화번호를 입력해 해 주세요.");
						return false;
					}
					
					storeList.push($scope.screenData.storeList[$scope.screenData.smpStoreIdx].pitem_no);
					pickupDateList.push($scope.screenData.smpStorePickupDate);
					locationSn.push($scope.screenData.storeList[$scope.screenData.smpStoreIdx].pitem_no);
										
					// 주문수량 order_qty
	            	// 픽업일 smartpickdate
	            	// 매장명 smpVstShopNm
	            	// 매장명 VstShopNm
	            	// 주문자 이름  vstrNm
	            	// 주문자 전화번호 vstrCellNo
	        		// 매장 방문 시간 smartpicktime
        	
					$scope.postdata.order_qty = $scope.screenData.orderCount;
					$scope.postdata.ord_qty = $scope.screenData.orderCount;
					$scope.postdata.smpVstShopNm = $scope.screenData.storeList[$scope.screenData.smpStoreIdx].pitem_nm;
					$scope.postdata.vstShopNm = $scope.screenData.storeList[$scope.screenData.smpStoreIdx].pitem_nm;
					$scope.postdata.vstrNm = $scope.screenData.smpPickerName;
					$scope.postdata.vstrCellNo = $scope.screenData.smpPickerPhone.join('');
					$scope.postdata.smartpicktime = '13';
					$scope.postdata.smpVstShopNo = storeList.join(split_str);
					$scope.postdata.smartpickdate = pickupDateList.join(split_str);
					
					$scope.postdata.entrNo = $scope.screenData.storeList[$scope.screenData.smpStoreIdx].entr_no;
					$scope.postdata.entrContrNo = $scope.screenData.storeList[$scope.screenData.smpStoreIdx].entr_contr_no;
					$scope.postdata.lwstEntrNo = $scope.screenData.storeList[$scope.screenData.smpStoreIdx].lwst_entr_no;
					$scope.postdata.salePrc = $scope.screenData.wine.org_sale_prc;
					$scope.postdata.mdlNo = $scope.screenData.wine.mdlNo;
					
					if($scope.screenData.isCart) {
//							$scope.cartAddProc();
					} else {
						var url = "/product/m/order_wine_buy.do?"+$scope.baseParam+"&curDispNo="+$scope.screenData.mastDispNo+"&goods_no="+$scope.screenData.smp_goods_no;
						LotteForm.FormSubmitForAjax(url,$scope.postdata)
						.success(function(data) {
							$scope.dimmedOpen({target:"smpRegist", callback:$scope.smpRegCompleteClose});
							$scope.screenData.smpRegComplete = true;
						})
						.error(function() {
							
						});
					}
            	}
            }
        };
    }]);

})(window, window.angular);