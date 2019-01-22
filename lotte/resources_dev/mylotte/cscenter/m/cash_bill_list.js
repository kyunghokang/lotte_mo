(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
	     'lotteComm',
	     'lotteSrh',
	     'lotteSideCtg',
	    //  'lotteSideMylotte',
	     'lotteCommFooter'
    ]);

    app.controller('CashBillCtrl', ['$scope', '$window', '$http', 'LotteCommon', function($scope, $window, $http, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "영수증내역"; //서브헤더 타이틀
        $scope.isShowThisSns = false; /*공유버튼*/

        $scope.cashbillNoticeFlag = false; /* 영수증발급안내 공지 */
        
//        // 로그인 정보 체크 후 로그인 페이지로 리턴
//        var init = function() {
//        	if(!$scope.loginInfo.isLogin){
//        		alert("로그인 후 이용가능합니다.");
//        		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
//            	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
//        	}
//        }
//        init();
        
        // URL PARAM GET
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

    	$scope.ordnoParam = getParameterByName('ord_no').replace('-', '').replace('-', '');
    	$scope.entrnoParam = getParameterByName('entr_no');
        
        // 영수증 발급내역 DATA
        var receiptListData = LotteCommon.receiptListData + "?ord_no=" + $scope.ordnoParam + "&entr_no=" + $scope.entrnoParam + "&grockle_yn=" + getParameterByName('grockle_yn') + "&grockle_mbr_no=" + getParameterByName('grockle_mbr_no'); 
        
        // Data Load
        $http.get(receiptListData)
        .success(function(data) {

        	// totalData
        	$scope.cashbillData = data.receiptIssueInfo;
       		// 결제수단별영수증목록
       		$scope.payKindData = data.receiptIssueInfo.payKind_list;
       		// 거래상세내역
       		$scope.orderDetailData = data.receiptIssueInfo.orderDetail_list.items;

            // 법인명 변경 이슈(홍성욱 차장님 요청) 데이터 조정 롯데닷컴 -> 롯데쇼핑㈜ e커머스 사업본부
            if ($scope.orderDetailData[0].entr_nm == '롯데닷컴') {
                $scope.orderDetailData[0].entr_nm = '롯데쇼핑㈜ e커머스 사업본부';
            }

       		// 주문번호
       		$scope.orderNumebr = $scope.cashbillData.orderNo.substr(0,4) + "-" +$scope.cashbillData.orderNo.substr(4,2) + "-" + $scope.cashbillData.orderNo.substr(6,2) + "-" + $scope.cashbillData.orderNo.substr(8,7);
       		console.log('104-81-26067 : ' + $scope.orderNumebr);
       		// 사업자등록번호
       		$scope.coprNumber = $scope.orderDetailData[0].bman_reg_no.substr(0,3) + "-" + $scope.orderDetailData[0].bman_reg_no.substr(3,2) + "-" + $scope.orderDetailData[0].bman_reg_no.substr(5,5);
       		
        })
        .error(function(data, status, headers, config){
            console.log('Error Data : ', status, headers, config);
        });
        
        // 영수증발급안내 공지 보기 Click
        $scope.billNoticeClick = function(){
        	$scope.cashbillNoticeFlag = !$scope.cashbillNoticeFlag;
        }
        
        // 영수증내역 닫기
        $scope.receiptClose = function(){
        	parent.closePopup();
        }

        // 뒤로가기 버튼 누르면 영수증내역 닫기
        angular.element($window).on('unload',function(){
           parent.closePopup();
        });
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/cscenter/m/cash_bill_list_container.html',
            replace : true,
            link : function($scope, el, attrs) {
				$scope.popSelect_a = false;
				$scope.popSelect_b = false;
				
				$scope.receipt_LawsPop = function(type){
					//console.log(type, $scope.popSelect_a);
					if(type == 'typeA'){
						$scope.popSelect_a = true;
						//console.log(type, $scope.popSelect_a);
					}else{
						$scope.popSelect_b = true;
					}
				}
				$scope.lawsClosePop = function(){
					$scope.popSelect_a = false;
					$scope.popSelect_b = false;
				}
            }
			
        };
    });

})(window, window.angular);