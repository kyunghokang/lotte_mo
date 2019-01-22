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
	app.controller('questionCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'LotteCookie', 'LotteUtil', function($scope, $http, $window, LotteCommon, LotteCookie, LotteUtil) {
		$scope.showWrap = true;		/*컨텐츠 보기여부*/
		$scope.contVisible = true; 	/*컨텐츠 보기여부*/
		$scope.subTitle = '1:1 문의하기';	/*서브헤더 타이틀*/
		$scope.actionBar = true; 	/*액션바*/

		LotteCommon.cscenterOrderData; 	/*1:1문의하기 주문이력 보기 */
		LotteCommon.questionSave; 	/*1:1문의하기 등록 */

		var now = new Date();
		$scope.now = now;

		$scope.fail = false; 			/*잘못된 접근*/
		$scope.write_box = false;		/*textarea (accp_cont) 사진첨부 입력바 */
		$scope.order_pop = false; 		/*주문이력 검색 팝업*/
		$scope.order_list_no = false;	/*주문이력없음*/
		$scope.order_list_wrap = false;	/*주문이력 있을때*/
		$scope.order_list_img = false;	/*이미지만 띄울때*/
		$scope.order_submit_end = false;/*문의내용 등록 성공시*/
		$scope.ord_no = '';
		$scope.order_select_end = false; /*팝업 선택여부*/
		$scope.orderListData;
		$scope.orderDisable = false; // 주문이력 팝업 비활성화

		$scope.listSelect = function(viewOrdNo, ordNo, idx) {
			var $productOn = angular.element('div.product.on');
			if ($productOn.length > 0) {
				if ($scope.ord_no != ordNo) {
					// $scope.ord_no: 마지막으로 클릭한 주문번호
					if (confirm('상품 선택은 단 한 개의 주문번호 선택에서만 가능합니다. 선택하신 상품이 모두 해제됩니다. 계속 하시겠습니까?')) {
						angular.element('[data-ordno=' + $scope.ord_no + ']').removeClass('on');
					} else {
						return;
					}
				}
			}
			$scope.view_ord_no = viewOrdNo;
			$scope.ord_no = ordNo;
			$scope.depth1 = [].indexOf.call(angular.element('div.scroll').find('section'), window.event.currentTarget.parentNode);
			angular.element('[data-ordno=' + ordNo + '][data-idx=' + idx + ']').toggleClass('on');
		};

		$scope.select_obj = [];
		$scope.listSelectEnd = function() {
			$scope.select_obj = [];
			var $productOn = angular.element('div.product.on');
			if ($productOn.length == 0) {
				alert('문의하실 상품을 선택해주세요.');
				return;
			}
			$productOn.each(function() {
				$scope.select_obj.push($scope.orderListData[$scope.depth1].goods_list.items[$(this).index() - 1]);
			});
			if ($productOn.length == 0) {
				$scope.order_select_end = false;
			} else {
				$scope.order_select_end = true;
			}
			$('.order_pop').removeClass('dimmedOpen');
			$scope.order_pop = false;
			$scope.dimmedClose({target : 'order_pop'});
			$scope.depth1 = undefined;
		}

		$scope.orderPopClose = function() {
			$scope.order_pop = false;
			$scope.dimmedClose({target : 'order_pop'});
			if ($scope.order_list_no) {
				$scope.selectFs(1);
			}
			$scope.depth1 = undefined;
			if ($scope.appObj.isApp && $scope.appObj.isAndroid) {
				window.lottebridge.question('show'); // 앱일 때 사진첨부 영역 보임
			} else if ($scope.appObj.isApp && $scope.appObj.isIOS) {
				location.href = 'lottebridge://question/show'; // 앱일 때 사진첨부 영역 보임
			}
		}

		/*상품 선택*/
		// $scope.selectCs = 0;
		$scope.selectFs = function(idx) {
			angular.element($window).scrollTop(1500);
			$scope.selectCs = idx;
			if (idx == 1) {
				$scope.write_box = true;
				$scope.order_pop = false;
				$scope.order_select_end = false;
				$scope.ord_no_yn = 'Y'; // ord_no_yn: 주문상품 없음 여부(주문상품이 없으면 'Y')
				$('.order_pop,#cover,body').removeClass('dimmedOpen');
			} else {
				$scope.write_box = false;
				$scope.order_pop = true;
				$scope.order_select_end = false;
				$scope.ord_no_yn = 'N';
				$('.order_pop,#cover,body').addClass('dimmedOpen');
				$scope.dimmedOpen({
					target : 'order_pop',
					callback: this.orderPopClose
				});
				if ($scope.appObj.isApp && $scope.appObj.isAndroid) {
					window.lottebridge.question('hide'); // 앱일 때 사진첨부 영역 숨김
				} else if ($scope.appObj.isApp && $scope.appObj.isIOS) {
					location.href = 'lottebridge://question/hide'; // 앱일 때 사진첨부 영역 숨김
				}
			}
			document.querySelector('#accp_cont') && document.querySelector('#accp_cont').focus();
		}

		// 파라미터로 넘어온 주문번호(ord_no)가 있을 때 해당 주문상품 정보 화면노출
		if (LotteUtil.getParameter('ord_no').length > 0) {
			$scope.ord_no = LotteUtil.getParameter('ord_no');
			var params = 'ord_no=' + $scope.ord_no // 주문번호는 무조건 하나
			var ordDtlSnArry = LotteUtil.getParametersByName('ord_dtl_sn'); // 주문상세일련번호는 하나 이상일 수 있다.
			ordDtlSnArry.forEach(function(element, index, array) {
				params += '&ord_dtl_sn=';
				params += element;
			});

			try {
				$http.get(
					LotteCommon.cscenterOrderDetailData + '?' + $scope.baseParam + '&' + params
				).success(function(data){
					$scope.order_select_end = true;
					$scope.view_ord_no = data.inquiry_order.view_ord_no;
					data.inquiry_order.goods_list.items.forEach(function(ele) {
						$scope.select_obj.push(ele);
					});
					$scope.selectCs = 0;
					$scope.orderDisable = true;
				}).error(function(ex) {
					ajaxResponseErrorHandler(ex);
				});
			} catch (e) {
				console.error(e);
			}
		} // if end

		// goLogin(): 로그인 페이지 이동
		$scope.goLogin = function(){
			var targUrl = '&targetUrl='+encodeURIComponent($window.location.href, 'UTF-8');
			$window.location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+targUrl
		}

		// 주문/배송조회 상세로 이동
		$scope.linkToPuchaseView = function () {
			var ord_no = ($scope.view_ord_no + "").replace(/-/g, "");
			location.href = LotteCommon.purchaseViewUrl + '?' + $scope.baseParam + '&orderNo=' + ord_no;
		};
	}]); // controller end
	app.directive('lotteContainer',[function(){
		return {
			templateUrl: '/lotte/resources_dev/custcenter/m/question_container.html',
			replace:true,
			link:function($scope, el, attrs){
			}
		};
	}]);
	app.directive('writeBox',['$http', '$window', 'LotteCommon', 'LotteUtil', function($http, $window, LotteCommon, LotteUtil){
		return {
			templateUrl: '/lotte/resources_dev/custcenter/m/write_box.html',
			replace:true,
			link:function($scope, el, attrs){
				document.querySelector('#accp_cont').focus();

				// byteCheck(): 문의내용 크기 체크
				$scope.byteCheck = function() {
					var text = $scope.accp_cont || ($scope.accp_cont = '');
					$scope.bytes = getByteLength(text);
					if ($scope.bytes >= 4001) {
						alert('최대 4000byte까지 작성하실 수 있습니다.');
						var length = 0;
						while (true) {
							length = getByteLength(text = text.substring(0, text.length -1));
							if (length < 4001) {
								$scope.accp_cont = text;
								$scope.bytes = length;
								break;
							}
						}
					}
				};

				// save(): 1:1 문의 등록
				$scope.save = function(appx_file,appx_file_2,appx_file_3) {
					if (typeof $scope.accp_cont == 'undefined' || $scope.accp_cont == '') {
						alert('문의 내용을 입력해주세요');
						return false;
					}

					if (!confirm('1:1 문의를 등록 하시겠습니까?')) {
						return false;
					}

					$scope.ord_dtl_sn = ''; // ord_dtl_sn: 선택한 주문상품의 주문상세일련번호
					$scope.goods_no = ''; // goods_no: 선택한 주문상품의 상품번호
					$scope.select_obj.forEach(function(ele) {
						// 주문내역 일련번호는 하나 이상일 수 있으므로 구분자를 사용하여 연결한다.
						$scope.ord_dtl_sn += ele.ord_dtl_sn;
						$scope.ord_dtl_sn += '^';
					});
					$scope.ord_dtl_sn = $scope.ord_dtl_sn.substring(0, $scope.ord_dtl_sn.lastIndexOf('^'));
					$scope.select_obj.forEach(function(ele) {
						// 주문내역 일련번호는 하나 이상일 수 있으므로 구분자를 사용하여 연결한다.
						$scope.goods_no += ele.goods_no;
						$scope.goods_no += '^';
					});
					$scope.goods_no = $scope.goods_no.substring(0, $scope.goods_no.lastIndexOf('^'));

					if ($scope.appObj.isApp && isNewestApp()) { // 앱
						var url = 'ghost://SubmitPhotoQuestion/write?';
						// angular.element('#write_box_form').serialize();
						// serialize()는 scope에 접근할 수 없고 앱은 JSON 객체를 받을 수 없으므로 일일이 문자열로 설정해야함
						url += '&ord_no_yn=' + $scope.ord_no_yn;
						url += '&accp_cont=' + encodeURI($scope.accp_cont); // 앱은 url 파라메터로 전달이여서, 문자개행이 이루어지지 않아 인코딩 처리 후 넘김
						url += '&ord_no=' + $scope.ord_no;
						url += '&ord_dtl_sn=' + $scope.ord_dtl_sn;
						url += '&goods_no=' + $scope.goods_no;
						url += '&mbr_no=' + $scope.loginInfo.mbrNo;
						url += '&mbr_nm=' + $scope.loginInfo.name;
						url += '&site_no=' + 1;
						location.href = url;
						return;
					} else { // 웹
						var postParams = {
							ord_no_yn	: $scope.ord_no_yn,//주문상품 없음 여부(Y|N)
							accp_cont	: $scope.accp_cont,//문의 내용
							ord_no		: $scope.ord_no,//주문번호
							ord_dtl_sn	: $scope.ord_dtl_sn,//주문내역일련번호
							goods_no	: $scope.goods_no//상품번호
						};
						$http({
							url : LotteCommon.questionSave + '?' + $scope.baseParam,
							data : $.param(postParams),
							method : 'POST',
							headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
						}).success(function (data, status, headers, config) { // 호출 성공시
							$window.location.replace(LotteCommon.cscenterAnswerDetaileUrl + '?' + $scope.baseParam + '&ccn_no=' + data.inquiry_save.ccn_no);
						}).error(function(ex) {
							ajaxResponseErrorHandler(ex);
						});
					}
				};

				// attachImage(): 사진첨부
				$scope.attachImage = function() {
					if ($scope.appObj.isApp && isNewestApp()) { // 앱
						location.href = 'ghost://QuestionWithPhoto';
					} else if ($scope.appObj.isApp && !isNewestApp()) {
						alert('사진 첨부기능은 앱 최신버전에서 이용 가능합니다.');
					} else {
						if (confirm('롯데닷컴 앱에서 이용 가능합니다. 지금 설치하시겠습니까?')) {
							location.href = LotteCommon.appDown + '?' + $scope.baseParam;
						}
					}
				};
			}
		};
	}]);
	app.directive('orderPop', ['$http', 'LotteCommon', function($http, LotteCommon) {
		return {
			templateUrl: '/lotte/resources_dev/custcenter/m/order_pop.html',
			replace: true,
			link: function($scope, el, attrs) {
				console.log('#', LotteCommon.cscenterOrderData)
				$http.get(LotteCommon.cscenterOrderData).success(function(data) {
					$scope.$parent.orderListData = data.inquiry_order_list.items;
					if($scope.$parent.orderListData.length == 0){
						$scope.$parent.order_list_no = true;
					}else{
						$scope.order_list_wrap = true;
					}
				}).error(function(ex) {
					ajaxResponseErrorHandler(ex);
				});
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
			var targUrl = 'targetUrl='+encodeURIComponent(location.href, 'UTF-8');
//    		$window.location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+targUrl
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

/**
 * 사진첨부 버튼 클릭 시 앱에서 호출하는 함수
 */
function inputBlur() {
	angular.element('#accp_cont').blur();
}

/**
 * 1:1 문의 등록 후 앱에서 호출하는 함수
 */
function locationReplace(url) {
	location.replace(url);
}