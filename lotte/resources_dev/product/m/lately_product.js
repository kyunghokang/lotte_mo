(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteNgSwipe',
		'lotteSaleBestList'
	]);

	app.controller('LatelyProductCtrl', ['$scope', '$http', '$window', '$filter', '$timeout', 'getLocalStorage', 'LotteCommon', 'LotteUtil','SaleBestListSvc', function($scope, $http, $window, $filter, $timeout, getLocalStorage, LotteCommon, LotteUtil,SaleBestListSvc) {
		$scope.otherViewFlag = [];

		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "최근 본 상품"; //서브헤더 타이틀
		$scope.otherViewFlag[$scope.itemListData] = false; // 남들은 뭐봤지
		$scope.isLatelyLoading = true;
		$scope.screenID = "RctView";

		$scope.othersLoadingFlag = false;

		// 로컬 데이터 없을 시
		if(getLocalStorage.getItems() == ''){
			$scope.goodsItems = "";
		} else {
//        	$scope.goodsItems = $filter('filter')(getLocalStorage.getItems().split('|'), $scope.loginInfo.mbrNo);
			$scope.goodsItems = getLocalStorage.getItems('latelyGoods');
		}

		$scope.otersItemData = [];
		// data URL
		var latelyViewData = LotteCommon.lateProdData +"?goods_no=" + $scope.goodsItems;
		// Data Load
		$http.get(latelyViewData)
		.success(function(data) {
			if(data.max.prod_late_view_list != null) {
				if(data.max.prod_late_view_list.total_count != '0') {
					$scope.itemListData = data.max.prod_late_view_list.items;
				} else {
					$scope.itemListData = [];
					$scope.noDataFlag = true;
				}
			} else {
				$scope.itemListData = [];
				$scope.noDataFlag = true;
			}
			if(data.max.prod_late_view_list != null) {
				$scope.totalCount = data.max.prod_late_view_list.total_count;
			} else {
				$scope.totalCount = 0;
			}
			$scope.otersItemData = [$scope.totalCount];
			$scope.isLatelyLoading = false;
		})
		.error(function(data, status, headers, config){
			$scope.isLatelyLoading = false;
			console.log('Error Data : ', status, headers, config);
		});

		// 남들은 뭐봤지 열기/닫기
		$scope.otherView = function (idx,goods_no,disp_no) {
			$scope.sendTclick($scope.tClickBase + $scope.screenID + '_Clk_Rel');

			SaleBestListSvc.func_SaleBestData(goods_no,disp_no,function(data){
				// itemList
				if(data == null){
					alert('남들은 뭘 봤지? 추천상품이 없습니다.');
					$scope.otherViewFlag[goods_no] = false;
				} else {
					if (data.max.relation != null && data.max.relation.total_count > 0){
						var buybestList = [];
						for(var i=0; i<data.max.relation.total_count; i++){
							var item = data.max.relation.items[i];
							item.img_url0 = item.img_url0.replace('280.','220.');
							buybestList.push(item);
						}
						$scope.otersItemData[idx] = buybestList;

						if($scope.otherViewFlag[goods_no] == true){
							angular.forEach($scope.itemListData, function(val, key) {
								$scope.otherViewFlag[$scope.itemListData[key].goods_no] = false;
							});
						} else {
							angular.forEach($scope.itemListData, function(val, key) {
								$scope.otherViewFlag[$scope.itemListData[key].goods_no] = false;
							});
							$scope.otherViewFlag[goods_no] = true;
							$scope.thisItemNo = goods_no;
						}
					} else {
						alert('남들은 뭘 봤지? 추천상품이 없습니다.');
						$scope.otherViewFlag[goods_no] = false;
					}
				}
			});

			/*
			var lateOthersData = LotteCommon.lateOthersData +"?goods_no=" + goods_no + "&disp_no=" + disp_no + "&" + $scope.baseParam;

			$http.get(lateOthersData)
			.success(function(data) {
				// itemList
				if (data.max.buybest != null && data.max.buybest.total_count > 0){
					var buybestList = [];
					for(var i=0; i<data.max.buybest.total_count; i++){
						var item = data.max.buybest.items[i];
						item.img_url0 = item.img_url0.replace('280.','220.');
						buybestList.push(item);
					}
					$scope.otersItemData[idx] = buybestList;

					if($scope.otherViewFlag[goods_no] == true){
						angular.forEach($scope.itemListData, function(val, key) {
							$scope.otherViewFlag[$scope.itemListData[key].goods_no] = false;
						});
					} else {
						angular.forEach($scope.itemListData, function(val, key) {
							$scope.otherViewFlag[$scope.itemListData[key].goods_no] = false;
						});
						$scope.otherViewFlag[goods_no] = true;
						$scope.thisItemNo = goods_no;
					}
				} else {
					alert('남들은 뭘 봤지? 추천상품이 없습니다.');
					$scope.otherViewFlag[goods_no] = false;
				}
			})
			.error(function(data, status, headers, config){
				console.log('Error Data : ', status, headers, config);
				$scope.otherViewFlag[goods_no] = false;
			});
			*/
		};

		$scope.otherViewClose = function (goods_no){
			$scope.otherViewFlag[goods_no] = !$scope.otherViewFlag[goods_no];
		}

		// 상품클릭
		$scope.goGoodsDetail = function(goods_no, idx, type) {
			var idxNo = idx +1;

			if(type == 'late') {
				$window.location.href = LotteCommon.baseUrl + "/product/m/product_view.do?goods_no=" + goods_no + "&curDispNo=5548115&curDispNoSctCd=79&" + $scope.baseParam + "&tclick=" + $scope.tClickBase + $scope.screenID + '_Clk_Prd_idx' + idxNo;
			} else if(type == 'other') {
				$window.location.href = LotteCommon.baseUrl + "/product/m/product_view.do?goods_no=" + goods_no + "&curDispNo=5548115&curDispNoSctCd=79&" + $scope.baseParam + "&tclick=" + $scope.tClickBase + $scope.screenID + '_Swp_Rel_prd' + '&_reco=M_detail_recent';
			}
		}

		/* 위시리스트 더보기 링크 (IOS에서 historyback 캐시오류) */
		$scope.myLotteLateProd = function(){
			// $scope.closeSideMylotte();
			setTimeout(function(){
				$window.location.href  = LotteCommon.wishLstUrl + "?" + $scope.baseParam + "&tclick=m_DC_RctView_Clk_Ban_1&viewGoods="+localStorage.getItem("latelyGoods");
			});
		}
		/*자주 구매 상품 더보기 링크*/
		$scope.myLotteOftenProd = function(){
			// $scope.closeSideMylotte();
			setTimeout(function(){
				$window.location.href  = LotteCommon.oftenProdUrl + "?" + $scope.baseParam + "&tclick=m_DC_RctView_Clk_Ban_2&viewGoods="+localStorage.getItem("latelyGoods");
			});
		}
		// 최근본상품 삭제
		$scope.deleteItems = function () {
			$scope.sendTclick($scope.tClickBase + $scope.screenID + '_Clk_Btn_1');
			// 삭제 동의
			if (confirm('삭제 하시겠습니까?')) {
//        		$scope.sendTclick($scope.tClickBase + $scope.screenID + '_Clk_Btn_' + "1");
				// 로컬 데이터 삭제
				getLocalStorage.deleteItems($scope.goodsItems);

				// 안드로이드 앱에서만 최근본상품 데이터 삭제 스킴, IOS는 돌면 안됨
				if($scope.appObj.isApp) {
					if($scope.appObj.isAndroid) {
						try {
							window.JsObject.callAndroid('viewGoods=');
						} catch (e) {}
					}
				}
				$window.location.href = LotteCommon.lateProdUrl+"?"+$scope.baseParam;
			} else {
				return false;
			}
		};

	}]);

	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/product/m/lately_product_container.html',
			replace : true,
			link : function($scope, el, attrs) {
			}
		};
	});

	// 로컬데이터 가져오기
	app.factory('getLocalStorage', function () {
		var itemList = {};
		return {
			list: itemList,

			deleteItems : function (ItemsArr) {
				if (window.localStorage && ItemsArr) {
					//Local Storage to add Data
					localStorage.setItem("latelyGoods", (""));
				}
				itemList = ItemsArr;

			},

			getItems : function () {
				itemList = localStorage.getItem("latelyGoods");
				return itemList ? itemList : [];
			}
		};

	});
})(window, window.angular);

//TODO ywkang2 : Angular 공통 처리 필요
var transformJsonToParam = function(obj) {
	var str = [];

	for (var p in obj) {
		if (Array.isArray(obj[p])) {
			for(var i=0; i<obj[p].length; i++) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p][i]));
			}
		} else {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	}

	return str.join("&");
};
