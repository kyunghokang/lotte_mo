(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter'
	]);

	app.controller('DepositRefundCtrl', ['$scope', '$http', '$window', '$timeout', 'LotteCommon', function($scope, $http, $window, $timeout, LotteCommon) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "보관금 환불 요청"; //서브헤더 타이틀

		$scope.isLoading = true;
		$scope.changBankFlag = false;
		$scope.disDouble = true;
		$scope.disCheckDouble = true;

		var pointInfoMainData = LotteCommon.pointInfoData +"?" + $scope.baseParam + "&point_div=deposit&tclick=m_mylayer_deposit";

		// Data Load
		$http.get(pointInfoMainData)
		.success(function(data) {
			// maxData
			$scope.maxData = data;
			// 포인트 리스트
			$scope.pointListData = data.max.pointList;
			// 삭제예정 포인트 리스트
			$scope.pointDelData = data.max.tobeDelLPointList;
			// 적립예정 포인트 리스트
			$scope.pointSaveData = data.max.saveLtPointList;
			// 보관금 은행 리스트
			$scope.bankListData = data.max.bankList.items[0];
			$scope.bankSelectData = data.max.bankList;
			$scope.bankHasYn = data.max.refund_acct_yn;
			if(data.max.refund_acct_yn == 'Y') {
				$scope.changBankFlag = false;
			} else {
				$scope.changBankFlag = true;
			}

			$scope.bankName = data.max.refund_acct_bank_cd;
			$scope.bankNo = data.max.refund_acct_no;
			$scope.bankOwner = data.max.refund_acct_holder;

			$scope.isLoading = false;
		})
		.error(function(data, status, headers, config){
			console.log('Error Data : ', status, headers, config);
		});

		// 계좌확인
//        $scope.checkBank = function(bankName, bankNo) {
//        	$scope.bankName = bankName;
//        	$scope.bankNo = bankNo;
//
//        	console.log('checkBank bank : ' + $scope.bankName);
//        	console.log('checkBank no : ' + $scope.bankNo);
//
//        	if (!angular.isDefined($scope.bankName) || $scope.bankName == null || $scope.bankName == "") {
//        		alert("은행을 선택해 주세요.");
//        		return false;
//        	}
//
//        	if (!angular.isDefined($scope.bankNo) || $scope.bankNo == null || $scope.bankNo == "") {
//        		alert("계좌번호를 입력해주세요.");
//        		return false;
//        	}
//
//    		$http({
//        		method: 'POST',
//        		url: '/json/mylotte/pointcoupon/refund_acct_holder.json',
//        		data: {
//	    			bnk_cd		: $scope.bankName,
//	    			actn		: $scope.bankNo
//        		},
//        		transformRequest: transformJsonToParam,
//        		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//        	})
//        	.success(function(data) {
//        		if(data.resultCode == '0') { // 가능할 경우
//        			$scope.isPossibleCommit = 'Y';
//        			$scope.bankOwner =  data.ooa_nm;
//            		$scope.bankName = bankName;
//                	$scope.bankNo = bankNo;
//        		}
//    			console.log(data.resultMsg);
//    			alert(data.resultMsg);
//            })
//            .error(function(ex) {
//            	console.log('환불계좌 등록 실패');
//            });
//        }

		// 보관금 환불 신청하기 C:등록, U:수정, D:삭제, R:환불요청  TODO 은행선택 리셋, change type
		$scope.refundDeposit = function(bankName, bankNo, bankOwner, type) {
			console.log("refundDeposit", bankName, bankNo, bankOwner, type);
			$scope.disDouble = false;
			$scope.disCheckDouble = false;

			$scope.refundType = type;
			$scope.bankName = bankName;
			$scope.bankNo = bankNo;

			console.log($scope.refundType);

			if($scope.refundType == 'CHANGE'){ //계좌확인 (신규일 경우 C , 변경일 경우 U로 리턴)
				if($scope.bankHasYn == 'Y') { // 신규
					$scope.refundType = "U";
				} else if($scope.bankHasYn == 'N') {
					$scope.refundType = "C";
					$scope.bankOwner = $scope.loginInfo.name;
					console.log('changed type : ' + $scope.refundType);
				} else {
					alert("잘못된 신청입니다.(system)");
					$scope.disDouble = true;
					$scope.disCheckDouble = true;

					return false;
				}
			} else {
				if($scope.refundType != "R") {
					$scope.refundType = 'D';
				} else {
					$scope.refundType = 'R';
				}
			}

			$timeout(function() {
				console.log('refundDeposit bank : ' + $scope.bankName);
				console.log('refundDeposit no   : ' + $scope.bankNo);
				console.log('refundDeposit name : ' + $scope.bankOwner);
				console.log('refundDeposit type : ' + $scope.refundType);
				console.log('refundDeposit posi : ' + $scope.isPossibleCommit);
				console.log('refundDeposit mony : ' + $scope.maxData.max.deposit);

				if($scope.refundType == 'R') { // 등록하기
					if ($scope.bankName == null || $scope.bankName == "" || $scope.bankNo == null || $scope.bankNo == "") {
						alert("은행정보가 없습니다.");
						$scope.disDouble = true;
						$scope.disCheckDouble = true;
						return false;
					}
					if(!angular.isDefined(type) || $scope.refundType == "" || $scope.refundType == null) {
						alert("신청정보 오류(system)");
						$scope.disDouble = true;
						$scope.disCheckDouble = true;
						return false;
					}
				} else if($scope.refundType == 'D'){
					$timeout(function() {
						$http({
							method: 'POST',
							url: '/json/mylotte/pointcoupon/refund_acct_mng.json',
							data: {
								ooa_nm		: $scope.bankOwner,
								proc_div	: $scope.refundType,
								bnk_cd		: $scope.bankName,
								actn		: $scope.bankNo,
								occr_amt	: $scope.maxData.max.deposit
							},
							transformRequest: transformJsonToParam,
							headers: {'Content-Type': 'application/x-www-form-urlencoded'}
						})
						.success(function(data) {
							console.log(data.resultMsg);
							alert(data.resultMsg.RESPONSE_MSG);
							if(data.resultMsg.RESPONSE_CODE == '0000'){
								$window.location.href = LotteCommon.depositDetailUrl + "?" + $scope.baseParam + "&point_div=coupon&tclick=m_mylayer_deposit";
							} else {
								$scope.disDouble = true;
								$scope.disCheckDouble = true;
								return false;
							}
						})
						.error(function(ex) {
							$scope.disDouble = true;
							$scope.disCheckDouble = true;
							console.log('환불 신청 실패');
						});
						$scope.disDouble = true;
						$scope.disCheckDouble = true;
					},500);
					return false;
				} else {
					if (!angular.isDefined($scope.bankName) || $scope.bankName == null || $scope.bankName == "") {
						alert("은행을 선택해 주세요.");
						$scope.disDouble = true;
						$scope.disCheckDouble = true;
						return false;
					}
					if (!angular.isDefined($scope.bankNo) || $scope.bankNo == null || $scope.bankNo == "") {
						alert("계좌번호를 입력해주세요.");
						$scope.disDouble = true;
						$scope.disCheckDouble = true;
						return false;
					}
					if(!angular.isDefined(type) || $scope.refundType == "" || $scope.refundType == null) {
						alert("신청정보 오류(system)");
						$scope.disDouble = true;
						$scope.disCheckDouble = true;
						return false;
					}
				}

				$timeout(function() {
					$http({
						method: 'POST',
						url: '/json/mylotte/pointcoupon/refund_acct_mng.json',
						data: {
							ooa_nm		: $scope.bankOwner,
							proc_div	: $scope.refundType,
							bnk_cd		: $scope.bankName,
							actn		: $scope.bankNo,
							occr_amt	: $scope.maxData.max.deposit
						},
						transformRequest: transformJsonToParam,
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					})
					.success(function(data) {
						console.log(data.resultMsg);
						alert(data.resultMsg.RESPONSE_MSG);
						if(data.resultMsg.RESPONSE_CODE == '0000'){
							$window.location.href = LotteCommon.depositDetailUrl + "?" + $scope.baseParam + "&point_div=coupon&tclick=m_mylayer_deposit";
						} else {
							return false;
						}
					})
					.error(function(ex) {
						console.log('환불 신청 실패');
					});
					$scope.disDouble = true;
					$scope.disCheckDouble = true;
				},500);
			},500);

		}

		// 취소하기
		$scope.depositClick = function(){
			$window.location.href = LotteCommon.pointInfoUrl +"?" + $scope.baseParam + "&point_div=deposit&tclick=m_mylayer_deposit";
		}

		// 취소하기 (변경 중)
		$scope.changingClick = function(){
			$scope.disDouble = false;
			$scope.disDouble = true;
			$scope.disCheckDouble = true;
			history.go(-1);
//			$window.location.href = LotteCommon.depositDetailUrl + "?" + $scope.baseParam + "&point_div=coupon&tclick=m_mylayer_deposit";
		}

		$scope.refunding = function() {
			alert("환불계좌를 등록해주세요.");
		}

		$scope.goChangbank = function(){
			$scope.bankName = "";
			$scope.bankNo = "";

			$scope.changBankFlag = true;
			$scope.disDouble = true;
			$scope.disCheckDouble = true;
		}

	}]);

	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/mylotte/pointcoupon/m/deposit_refund_container.html',
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
					var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : null;

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