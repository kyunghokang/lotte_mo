/**
 * 상품상세 서브페이지: 추가 혜택가
 */

(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'product-sub-header'
	]);

    app.controller('ProductCollectBenefitsCtrl', ['$http', '$scope', 'LotteCommon', 'commInitData', function($http, $scope, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "추가 혜택가"; // 서브헤더 타이틀
        $scope.screenID = "product_collect_benefits"; // 스크린 아이디 
        $scope.goodsNo = commInitData.query['goods_no']; // 상품번호
		$scope.jsonLoading = false;

        $scope.pageUI = {
	       	baseParam: $scope.baseParam,
	       	loadData: null
		}
        $scope.pageUI.pointGuideOpen = false;
		$scope.pageUI.benefitOpen = false;
    }]);

    app.directive('lotteContainer', ['$http', 'LotteCommon', 'LotteUtil', '$window','LotteGA',
    	function ($http, LotteCommon, LotteUtil, $window, LotteGA) {
	        return {
	        	templateUrl : '/lotte/resources_dev/product/m/sub/product_collect_benefits_container.html',
	            replace : true,
	            link : function($scope, el, attrs) {	    
					$scope.isShowBtnTalk = false; // 톡상담 버튼 감추기
						var url = LotteCommon.isTestFlag ? LotteCommon.productCollectBenefits +"?"+ $scope.baseParam : LotteCommon.productCollectBenefits + "?goods_no="+$scope.goodsNo + "&"+ $scope.baseParam;
						var _ts = '&_ts=' + Date.now(); // 20190110 로그인 후 뒤로가기 정책 수정건 afterjob
	    			$scope.jsonLoading = true;
	    			$http.get(url + _ts) // 20190110 로그인 후 뒤로가기 정책 수정건 afterjob
					.success(function (data) {
						if(data.data) {
							$scope.pageUI.loadData = data.data;
							$scope.adResult = ''; //AD 유무
							$scope.adTxt = '';

							//20171130 카드즉시할인 텍스트 길이 체크
							var cardtxt = $scope.pageUI.loadData.immedDscntCardInfo;

							if(cardtxt){
								$scope.pageUI.loadData.cardtxtlen = (cardtxt.length > 21) ? true : false;
							}
							
							//20180130 AD 유무 체크
							if($scope.pageUI.loadData.adFlagYn == true){
								$scope.adResult = 'AD';
							}
							
							$scope.adTxt = $scope.pageUI.loadData.adTxt;

							// 20181127 구매사은 코드 재조립
							if($scope.pageUI.loadData.saunList){
								$scope.pageUI.loadData.saunListData = {
									lpoint: [],
									lmoney: []
									// saun: []
								};
								for(var i = 0; i < $scope.pageUI.loadData.saunList.items.length; i++){
									switch($scope.pageUI.loadData.saunList.items[i].fvrTpCd){
										case "10":
											$scope.pageUI.loadData.saunListData.lpoint.push($scope.pageUI.loadData.saunList.items[i]);
										break;
										
										case "20":
											$scope.pageUI.loadData.saunListData.lmoney.push($scope.pageUI.loadData.saunList.items[i]);
										break;

										// 20181127 사은품 삭제 처리
										// case "99":
										// 	$scope.pageUI.loadData.saunListData.saun.push($scope.pageUI.loadData.saunList.items[i]);
										// break;
									}
								}

								// 재조립된 구매사은 GA Index 값 부여
								var gaIdx = 0;
								for(var key in $scope.pageUI.loadData.saunListData){
									for(var i = 0; i < $scope.pageUI.loadData.saunListData[key].length; i++){
										if(key === "lpoint"){
											$scope.pageUI.loadData.saunListData[key][i].gaIdx = gaIdx;
										} else if(key === "lmoney"){
											$scope.pageUI.loadData.saunListData[key][i].gaIdx = gaIdx;
										} 
										// 20181127 사은품 삭제 처리
										// else if(key === "saun"){
										// 	$scope.pageUI.loadData.saunListData[key][i].index = gaIdx;
										// }
										gaIdx++;
									}
								}
							}
						}
					})
					.error(function () {
						console.log('Data Error : 추가 혜택가 데이터 로드 실패');
					})
					.finally(function () {
						$scope.jsonLoading = false; // 로딩커버
					});
					
					$scope.linkClick = function (linkUrl, tclick, GAtxt) {
						//20180830 GA태깅 추가
						LotteGA.evtTag('MO_상품상세', '혜택모두보기', GAtxt);
						$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.pageUI.baseParam + "&tclick=" + tclick);
					}
					
					$scope.goEventSaun = function(evtNo, tclick, GAtxt) {
						//20180830 GA태깅 추가
						LotteGA.evtTag('MO_상품상세', '혜택모두보기', GAtxt);
						$window.location.href = LotteUtil.setUrlAddBaseParam(LotteCommon.eventSaunMain, $scope.pageUI.baseParam + "&evt_no="+evtNo+"&tclick=" + tclick);
					}

					$scope.goEventCoupon = function(linkUrl) {
						//20180830 GA태깅 추가
						LotteGA.evtTag('MO_상품상세', '혜택모두보기', '쿠폰더받기');
						$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.pageUI.baseParam);
					}

					$scope.numberFill = function(idx, length, evtNo) {
						var strIdx = "" + idx;
						var fillData = "00000000000000000";
						return fillData.substring(0,length - strIdx.length) + strIdx + "~" + evtNo;
					}
	            }
	        };
    	}
    ]);

})(window, window.angular);