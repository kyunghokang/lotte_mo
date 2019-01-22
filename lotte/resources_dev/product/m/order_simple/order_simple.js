(function(window, angular, undefined) {
	//'use strict';
	
	// 상품상세 L.pay 간편 주문서
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		'lotteCommFooter'
	]);
	app.controller('orderSimpleCtrl', ['$scope', '$window', 'LotteCommon', '$timeout', 'LotteUtil', 'LotteGA', function($scope, $window, LotteCommon, $timeout, LotteUtil, LotteGA) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "간편주문서";//서브헤더 타이틀
		$scope.showDetailLayer = false; //할인금액팝업 보이기
		$scope.showAgreeLayer = false; //약관동의팝업 보이기
		$scope.assentInShow = false; // 결제서비스 이용약관 보이기
		$scope.wid = $window.innerWidth;
		$scope.hei = 0;
		var $win = angular.element($window);
		$win.on('resize', function () { // 윈도우 창 변화 감지(옵션레이어 높이값 키패드 대응)
		
			
			if($window.orientation == 0){
				$scope.wid = ($scope.wid == window.innerWidth) ? $scope.hei : window.innerWidth;
			}else{
				$scope.wid = window.innerWidth;
				$scope.hei = window.innerHeight + 48;
			}
			
			//화면전환시 엘페이 닫기
			//angular.element("#X_ANSIM_FRAME").css("display","none");
			//angular.element("#ANSIM_LAYER").css("display","none");

			angular.element(".slide_wrap").width($scope.wid);
			$("html,body").width($scope.wid);
		});
		/**
		 * @ngdoc function
		 * @name  popCtl
		 * @description
		 * 팝업 레이어 보기/닫기
		*/
		$scope.popCtl = function(type){
			switch(type){
				case "detail":
					$scope.showDetailLayer = (!$scope.showDetailLayer) ? true : false;
					if($scope.showDetailLayer){
						//20180830 GA태깅 추가
						LotteGA.evtTag('MO_상품상세', '엘페이 간편결제','할인안내');
					}
				break;
				case "agree":
					$scope.showAgreeLayer = (!$scope.showAgreeLayer) ? true : false;	
					if($scope.showAgreeLayer){
						//20180830 GA태깅 추가
						LotteGA.evtTag('MO_상품상세', '엘페이 간편결제','이용약관보기');
					}
				break;
				default:
					$scope.showAgreeLayer = $scope.showDetailLayer = false;
				break;
			}
			$scope.assentInShow = false;	// 결제서비스 이용약관 show/hide
		}
		
		/**
		 * 결제서비스 이용약관 tab/show
		*/
		$scope.assentPop = function(flag){
		   $scope.index = flag;
		   
		   var path = "";
		   switch(flag){
		   case 0:
				 path = LotteCommon.clauseECommerce;
				 break;
		   case 1:
				 path = LotteCommon.clausePIUse;
				 break;
		   case 2:
				 path = LotteCommon.clausePIConsign;
				 break;
		   default:
				 return;
				 break;
		   }
		   angular.element("#clauseHolder").scrollTop(0);
		   angular.element("#clauseHolder").load(path + " .clause_wrap");

		   if(!$scope.assentInShow){
			   $scope.assentInShow = true;
		   }
		};

		/**
		 * 결제서비스 이용약관 닫기
		*/

		$scope.assentClose = function(){
			$scope.assentInShow = false;
		}
		
	}]);
	
})(window, window.angular);