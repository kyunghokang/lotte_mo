(function(window, angular, undefined) {
	//'use strict';
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg', 
		// 'lotteSideMylotte', 
		'lotteCommFooter'
	]);
	
	app.controller('OrderCompleteCtrl', ['$scope', '$filter', '$sce', '$http', '$window', '$log', 'LotteCommon', 'LotteUtil', 
		function ($scope, $filter, $sce, $http, $window, $log, LotteCommon, LotteUtil) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = ""; // 서브헤더 타이틀
		$scope.actionBar = true; // 액션바
		$scope.isShowThisSns = false; // 공유버튼
		$scope.hideHeaderBack = true;
		
		if (typeof orderSubTitle != "undefined") {
			$scope.subTitle = orderSubTitle; // 서브헤더 타이틀
		}
		
		// history.pushState(true, "", "");
		// $window.onpopstate = function (event) {
		// 	$window.location.href = LotteCommon.mainUrl + "?" + $scope.baseParam;
		// };
		var $adbrixGoodsNo = angular.element("#rt_arr_goods_no"),
			$adbrixGoodsNm = angular.element("#order_list li .tl"),
			$adbrixGoodsPrice = angular.element("#rt_arr_goods_prc"),
			$adbrixGoodsQty = angular.element("#rt_arr_goods_qty");

		if ($adbrixGoodsNo.length > 0 && $adbrixGoodsNm.length > 0 && $adbrixGoodsPrice.length > 0 && $adbrixGoodsQty.length > 0) {
			if ($scope.appObj.isApp) {
				if (($scope.appObj.isIOS && $scope.appObj.verNumber >= 4050) ||
					($scope.appObj.isAndroid && $scope.appObj.verNumber >= 408)) {
					var adbrixGoodsNoArr = ($adbrixGoodsNo.val() + "").split(","),
						adbrixGoodsNmArr = [],
						adbrixGoodsPriceArr = ($adbrixGoodsPrice.val() + "").split(","),
						adbrixGoodsQtyArr = ($adbrixGoodsQty.val() + "").split(","),
						i = 0;

					if ($adbrixGoodsNm.length > 0) {
						for (i = 0; i < $adbrixGoodsNm.length; i++) {
							adbrixGoodsNmArr.push(($adbrixGoodsNm.eq(i).text() + "").replace(/[\t\n]+/g, ''));
						}
					}
						
					var adbrixCartInfo = {},
						minLength = Math.min(adbrixGoodsNoArr.length, adbrixGoodsNmArr.length, adbrixGoodsPriceArr.length, adbrixGoodsQtyArr.length);
		
					adbrixCartInfo.prodList = [];

					for (i = 0; i < minLength; i++) {
						adbrixCartInfo.prodList.push({
							productId: adbrixGoodsNoArr[i],
							productName: adbrixGoodsNmArr[i],
							price: parseInt(adbrixGoodsPriceArr[i] ? adbrixGoodsPriceArr[i] : 0),
							quantity: parseInt(adbrixGoodsQtyArr[i] ? adbrixGoodsQtyArr[i] : 0)
						});
					}
					
					if (adbrixCartInfo.prodList.length > 0) {
						console.log("callAdbrix://order?" + JSON.stringify(adbrixCartInfo));
						window.location.href = "callAdbrix://order?" + JSON.stringify(adbrixCartInfo);
					}
				}
			}
		}
	}]);
})(window, window.angular);