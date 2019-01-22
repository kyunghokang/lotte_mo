( function ( window, angular, undefined ) {
    'use strict';

    var app = angular.module( 'app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ] );

    app.controller( 'ProtectYouthCtrl', ['$sce','$scope', '$http', 'LotteCommon', function ($sce, $scope, $http, LotteCommon ) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "청소년보호방침"; /*서브헤더 타이틀*/

        /* main data */
        $http.get(LotteCommon.footerProvisionData + "?" + $scope.baseParam + "&pv=T")
        .success(function(data){
            $scope.agreementData = data.provision.items[0].detail;
        })
        .error(function(data){
            console.log('Error Data :  cscenterMainData 고객센터 메인 에러');
        });
    }] );

    app.directive( 'lotteContainer', function () {
        return {
            templateUrl: '/lotte/resources_dev/agreement/protect_youth_container.html',
            replace:true,
            link:function ( $scope, el, attrs ) {
            }
        };
    } );

} )( window, window.angular );