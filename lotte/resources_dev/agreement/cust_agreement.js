( function ( window, angular, undefined ) {
    'use strict';
    var app = angular.module( 'app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ] );
    app.controller( 'CustAgreementCtrl', ['$sce','$scope', '$http', 'LotteCommon', function ($sce, $scope, $http, LotteCommon ) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "이용약관"; /*서브헤더 타이틀*/
		$scope.agreementIdx = -1;
        /* main data */
        $http.get(LotteCommon.footerProvisionData + "?" + $scope.baseParam + "&pv=D")
        .success(function(data){
            $scope.agreementData = data.provision.items[0].detail; //현재 내용 (배열의 0번지)
        	$scope.agreementList = data.provision.items.slice(1, data.provision.items.length);
		})
        .error(function(data){
            console.log('Error Data :  cscenterMainData 고객센터 메인 에러');
        });
		
    }] );
    app.directive( 'lotteContainer', function () {
        return {
            templateUrl: '/lotte/resources_dev/agreement/cust_agreement_container.html',
            replace:true,
            link:function ( $scope, el, attrs ) {
				$scope.openPop = function () {
					//console.log($scope.agreementIdx);
					$scope.popContTit = $scope.agreementList[$scope.agreementIdx].title;
					$scope.popContDetail = $scope.agreementList[$scope.agreementIdx].detail;
				};
				$scope.closePop = function () {
					$scope.agreementIdx = -1;
					$scope.popContDetail = "";
				}
            }
        };
    } );
} )( window, window.angular );