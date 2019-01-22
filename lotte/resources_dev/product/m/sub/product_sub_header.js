(function(window, angular, undefined) {
    'use strict';
    
    var productSubHeader = angular.module('product-sub-header', []);
    
    productSubHeader.directive('productSubHeader', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
		function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/sub/product_sub_header.html",
				replace : true,
				link : function ($scope, el, attrs) {
					$scope.gotoPrepage = function () {
						$scope.jsonLoading = true;
						$scope.sendTclick("m_RDC_header_new_pre");
						if($scope.appObj.isNativeHeader) {
							appSendBack();
						} else {
							history.go(-1);
						}
					};
				}
			}
	}]);
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = productSubHeader.name;
    }
})(window, window.angular);