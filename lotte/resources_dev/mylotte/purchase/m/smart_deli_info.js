(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'        
    ]);

    app.controller('smart_deli_infoCtrl', ['$http', '$scope', 'LotteCommon','commInitData', function($http, $scope, LotteCommon,commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "배송조회"; // 서브헤더 타이틀
        $scope.screenID = "배송조회"; // 스크린 아이디 
        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
        	}
        	$scope.screenData = {
        		page: 0,
        		pageSize: 20,
        		pageEnd: false
        	}
        })();
        $http({
            url: "/json/mylotte/delivery_info.json",
            method:  'GET',
            async:   false,
            cache:   false,
            headers: {'Accept': 'application/json', 'Pragma': 'no-cache'},
            params:  {
                ord_no : commInitData.query['ord_no'],
                dlv_unit_sn : commInitData.query['dlv_unit_sn'],
                inv_no : commInitData.query['inv_no']
            }                            
        }).success(function (data) {
            $scope.cont = data.content;

            /* 20181211 휴대폰번호 체크*/
            $scope.phoneResult = {};
            $scope.phoneLength = {
                0:$scope.cont.delivery_info_main.hdc_tel_no,
                1:$scope.cont.delivery_info_main.enfc_phon,
                2:$scope.cont.delivery_info_main.dlv_arcl_cell_no
            }

            for (var i = 0; i < 3; i++) {
                if($scope.phoneLength[i].replace(/\-/g,'').length > 9 && $scope.phoneLength[i].replace(/\-/g,'').slice(0,2) == '01'){
                    $scope.phoneResult[i] = true;
                }else{
                    $scope.phoneResult[i] = false;
                }
            }
        });                                
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/purchase/m/smart_deli_info_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                
            }
        };
    });
	app.filter('insertTimeBr', function() {
		return function(str) {            
			return str.substr(0, 10) + "<br>" + str.substr(11, 8);
		}
	});
    
})(window, window.angular);