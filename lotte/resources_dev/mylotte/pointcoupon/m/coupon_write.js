(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('CouponWriteCtrl', ['$scope', '$http', '$window', '$timeout', 'LotteCommon','LotteForm', function($scope, $http, $window, $timeout, LotteCommon,LotteForm) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "페이퍼 쿠폰 등록"; //서브헤더 타이틀
        $scope.regist = false;
		$scope.clickLimitI = 0; //클릭수        
    	// 등록하기
        $scope.couponWrite = function(couponNumber) {
        	
			$scope.clickLimitI ++ ;
        	$scope.regist = true;
        	
        	if ($scope.clickLimitI < 2 ){
				$timeout(function() {    	
					if (!angular.isDefined(couponNumber)) {
						alert("쿠폰 번호를 입력 해 주세요.");
						$scope.regist = false;
						$scope.clickLimitI = 0;
						return false;
					} else {
						LotteForm.FormSubmitForAjax(LotteCommon.paperCouponSaveUrl,{paper_no:couponNumber})
						.success(function(data) {
							if(data.resultMsg == '-9'){
								alert("로그인 후 응모가능합니다.");
								$scope.regist = false;
								var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
								$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
							} else {
								if(data.resultMsg == '-1'){
									alert("쿠폰 번호 확인 후 다시 입력해 주세요.");
									$scope.regist = false;
									$window.location.href = LotteCommon.paperCouponUrl + "?" + $scope.baseParam + "&point_div=coupon&tclick=m_mylayer_coupon";
								} else {
									if(data.resultMsg == '-2'){
										alert("이미 발급된 페이퍼 쿠폰입니다..");
										$scope.regist = false;
										$window.location.href = LotteCommon.paperCouponUrl + "?" + $scope.baseParam + "&point_div=coupon&tclick=m_mylayer_coupon";
									} else {
										alert("페이퍼 쿠폰이 등록되었습니다.");
										$scope.regist = false;
										$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=coupon&tclick=m_mylayer_coupon";
									}// e: result -2
								} // e: result -1         			
							} //e: result -9
							$scope.clickLimitI = 0;
						})
						.error(function(ex) {
							console.log('Error Data : ', status, headers, config);
						});
						$scope.regist = false;

					} // e:isdefined
				}, 200);
			}
        } // e:scope

        
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/pointcoupon/m/coupon_write_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

    app.directive('numericOnly', function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {
                    var transformedInput = inputValue ? zue.replace(/[^\d.-]/g,'') : null;

                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
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