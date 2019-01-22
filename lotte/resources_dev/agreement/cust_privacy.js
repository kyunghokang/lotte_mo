( function ( window, angular, undefined ) {
    'use strict';

    var app = angular.module( 'app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ] );

    app.controller( 'CustPrivacyCtrl', ['$sce','$scope', '$http', 'LotteCommon', function ($sce, $scope, $http, LotteCommon ) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "개인정보처리방침"; /*서브헤더 타이틀*/
        $scope.selectPrvIndex = -1; //-1일때에는 아무것도 안보여짐, 0부터 팝업처리 
        /* main data */
        $http.get(LotteCommon.footerProvisionData + "?" + $scope.baseParam + "&pv=I")
        .success(function(data){
            //데이타 분리 (현재, 이전 버전)
            $scope.agreementData = data.provision.items[0].detail; //현재 내용 (배열의 0번지)
            $scope.prvList = data.provision.items.slice(1, data.provision.items.length); //이전 리스트 (배열의 1번지부터)
            //console.log($scope.prvList);
            
        })
        .error(function(data){
            console.log('Error Data :  cscenterMainData 고객센터 메인 에러');
        });
    }] );

    app.directive( 'lotteContainer', function () {
        return {
            templateUrl: '/lotte/resources_dev/agreement/cust_privacy_container.html',
            replace:true,
            link:function ( $scope, el, attrs ) {
                $scope.selectPrv = function(){
                    //console.log($scope.selectPrvIndex);
                }
                $scope.closePop = function(){
                     $scope.selectPrvIndex = -1;
                     $scope.pop_detail = "";
					 $("#pop_cont").scrollTop(0);
                }
				$scope.selectPop = function(){
					//console.log($scope.selectPrvIndex);
					if($scope.selectPrvIndex >= 0){
						$scope.pop_title = $scope.prvList[$scope.selectPrvIndex].title;
						$scope.pop_detail = $scope.prvList[$scope.selectPrvIndex].detail;
						$("#pop_cont").scrollTop(0);
					}
				}
            }
        };
    } );

} )( window, window.angular );