(function(window, angular, undefined) {
	'use strict';
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteUtil'
	]);
	app.controller('productQuestWriteCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'LotteCookie', 'LotteUtil', function($scope, $http, $window, LotteCommon, LotteCookie, LotteUtil){
		$scope.showWrap = true;		/*컨텐츠 보기여부*/
		$scope.contVisible = true; 	/*컨텐츠 보기여부*/
		$scope.subTitle = '상품 문의하기';	/*서브헤더 타이틀*/
		$scope.actionBar = true; 	/*액션바*/
		$scope.gucci = $window.location.pathname.indexOf('gucci') > -1 ? true : false; // 구찌 여부

		var now = new Date();
		$scope.now = now;

		$scope.fail = false; 			/*잘못된 접근*/
		$scope.write_box = true;		/*textarea (inq_ans_cont) 사진첨부 입력바 */
		/*model*/
		$scope.inq_ans_cont = ''; 	/*문의 내용*/

		//파라메터 get
		$scope.goods_no = LotteUtil.getParameter('goods_no'); /*상품번호 */
		$scope.usm_goods_no = LotteUtil.getParameter('usm_goods_no'); // 통합판매관리상품번호

		// 상품 정보 가져오기
		if ($scope.goods_no) {
			// 구찌 메인에서 유입된 상품문의(URL에 gucci를 포함하고 상품번호가 없다)는 상품을 조회하지 않는다.
			$http.get(LotteCommon.productQuestGoodsDetail + '?goods_no=' + $scope.goods_no)
			.success(function(data) {
				$scope.productInfo = data.product_quest_goods_detail;
			}).error(function(ex) {
				ajaxResponseErrorHandler(ex);
			});
		}

		$scope.linkToProductView = function() {
			$window.location.href = LotteCommon.productviewUrl + '?' + $scope.baseParam + '&curDispNo='
					+ LotteUtil.getParameter('curDispNo') + '&goods_no=' + $scope.goods_no + '&usm_goods_no=' + $scope.usm_goods_no;
		}

		$scope.goLogin = function() {
			var targUrl = '&targetUrl='+encodeURIComponent($window.location.href, 'UTF-8');
			$window.location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+targUrl
		};

		$scope.questionUrl=LotteCommon.questionUrl + "?" + $scope.baseParam; //1:1문의 url
	}]);
	app.directive('lotteContainer',[function(){
		return {
			templateUrl: '/lotte/resources_dev/product/product_quest_write_container.html',
			replace:true,
			link:function($scope, el, attrs){
			}
		};
	}]);
	app.directive('writeBox',['$http', '$window', 'LotteCommon',function($http, $window, LotteCommon){
		return {
			templateUrl: '/lotte/resources_dev/product/write_box.html',
			replace:true,
			link:function($scope, el, attrs){
				document.querySelector('#inq_ans_cont').focus();

				$scope.byteCheck = function() {
					var text = $scope.inq_ans_cont || ($scope.inq_ans_cont = '');
					$scope.bytes = getByteLength(text);
					if ($scope.bytes >= 2001) {
						alert('최대 2000byte까지 작성하실 수 있습니다.');
						var length = 0;
						while (true) {
							length = getByteLength(text = text.substring(0, text.length -1));
							if (length < 2001) {
								$scope.inq_ans_cont = text;
								$scope.bytes = length;
								break;
							}
						}
					}
				};

				$scope.questionSubmit = function(){
					if ($scope.inq_ans_cont.length == 0) {
						alert('문의 내용을 입력해주세요');
						return false;
					}
					if ($scope.inq_ans_cont.length < 10) {
						alert('10자 이상 내용을 입력해주세요');
						return false;
					}
					var postParams = {
						goods_no		: $scope.goods_no,  //상품번호
						usm_goods_no	: $scope.usm_goods_no,  //통합판매관리상품번호
						inq_ans_cont	: $scope.inq_ans_cont  //문의 내용
					};
					$http({
						url : LotteCommon.productQuestSave + '?' + $scope.baseParam,
						data : $.param(postParams),
						method : 'POST',
						headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
					}).success(function (data, status, headers, config) { // 호출 성공시
						if ($scope.gucci) {
							$scope.$parent.order_submit_end = true;
							$scope.$parent.inq_ans_cont = $scope.inq_ans_cont;
						} else {
							location.replace(LotteCommon.mylotteReinquiryDetailUrl + '?' + $scope.baseParam + '&inq_no=' + data.product_quest_save.inq_no);
						}
					}).error(function(ex) {
						ajaxResponseErrorHandler(ex);
					});
				}
			}
		};
	}]);

})(window, window.angular);

/**
 * 비동기 서비스 요청 후 실패 시 핸들러
 * 		- 응답을 정상(500)으로 받은 후
 * 		  리턴된 결과로 호출됨
 */
// TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseFailHandler = function(errorCallback) {
	alert('처리중 오류가 발생하였습니다.');
	if (errorCallback) errorCallback();
};

/**
 * 비동기 서비스 요청 후 에러 시 핸들러
 * 		- 응답을 서버수행에러(500)으로 받은 후 호출 됨
 */
// TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseErrorHandler = function(ex, errorCallback) {
	if (ex.error) {
		var errorCode = ex.error.response_code;
		var errorMsg = ex.error.response_msg;
		if ('9004' == errorCode) {
			// TODO ywkang2 : lotte_svc.js 를 참조해야함
			var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
//    		$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl
			location.href = '/login/m/loginForm.do?' + targUrl;
		} else {
			alert('[' + errorCode + '] ' + errorMsg);
		}
	} else {
		alert('처리중 오류가 발생하였습니다.');
	}
	if (errorCallback) errorCallback();
};

function getByteLength(s, b, i, c) {
	for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 2 : 1);
	return b;
}