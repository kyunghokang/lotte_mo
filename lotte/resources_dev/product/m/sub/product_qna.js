(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'product-sub-header'
    ]);

    app.controller('ProductQnaCtrl', ['$http', '$scope', 'LotteCommon', 'commInitData', function($http, $scope, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "Q&A 전체보기"; // 서브헤더 타이틀
        $scope.screenID = "product_qna"; // 스크린 아이디 
        $scope.goodsNo = commInitData.query['goods_no']; // 상품번호
        $scope.usm_goods_no = commInitData.query['usm_goods_no']; // 상품번호
        $scope.ajaxLoadFlag = false; // 페이지 로딩중 여부 Flag
		$scope.jsonLoading = false; // 로딩커버
        
		$scope.pageUI = {
			page: 1,
			isLastPage: false,
			pageCurRowCnt: 10,
	       	baseParam: $scope.baseParam,
	       	loadData: null
		}
    }]);

    app.directive('lotteContainer', ['$http', 'LotteCommon', 'LotteUtil', '$window', '$timeout',
    	function ($http, LotteCommon, LotteUtil, $window, $timeout) {
	        return {
	            templateUrl : '/lotte/resources_dev/product/m/sub/product_qna_container.html',
	            replace : true,
	            link : function($scope, el, attrs) {
					$scope.isShowBtnTalk = false; // 톡상담 버튼 감추기
					
	            	$scope.loadQnA = function() {
	            		var url = LotteCommon.isTestFlag ? LotteCommon.productQnAData : LotteCommon.productQnAData + "?goods_no="+$scope.goodsNo+"&usm_goods_no=" +$scope.usm_goods_no + "&all_view_yn=Y"+"&page="+ $scope.pageUI.page + "&pageCurRowCnt=" + $scope.pageUI.pageCurRowCnt;
	            		$scope.ajaxLoadFlag = true;
						$scope.jsonLoading = true; // 로딩커버

						$http.get(url)
						.success(function (data) {
							if(data) {
								if($scope.pageUI.page == 1) { // 처음 loading
									$scope.pageUI.loadData = data.data;
									$scope.pageUI.page++
								}else{ // 추가 loading
									if(data.data.qnaList) { // 리스트 데이터 체크
										for (var i=0;i<data.data.qnaList.items.length;i++) {
											$scope.pageUI.loadData.qnaList.items.push(data.data.qnaList.items[i]);
										}
										$scope.pageUI.page++
									}else{
										$scope.pageUI.isLastPage = true;
									}
								}
							}
						})
						.error(function () {
							console.log('Data Error : Q&A 전체보기 데이터 로드 실패');
						})
						.finally(function () {
							$scope.ajaxLoadFlag = false;
							$scope.jsonLoading = false; // 로딩커버
						});
					};

					$scope.loadQnA();
					
					$scope.linkClick = function (linkUrl, tclick) {
						console.log('linkUrl', linkUrl);
						$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.pageUI.baseParam + "&tclick=" + tclick);
					}

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLastPage===true){ return; }
						if (!$scope.ajaxLoadFlag && angular.element("body")[0].scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
							$scope.loadQnA();
						}
					});
					
	            }
	        };
    	}
    ]);

})(window, window.angular);