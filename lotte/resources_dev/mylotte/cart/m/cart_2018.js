// TODO ywkang2 : 공통코드 프레임웍 필요
var ST_STD_CD_GOODS_TP_CD_E_COUPON = '20';  //E-COUPON상품
var GOODS_SMP_EXCHANGE_DEP = '0101DEP';  //백화점 실물
var GOODS_SMP_EXCHANGE_ETC = '0101ETC';  //로드샵 실물

var GOODS_SMP_STATUS_EXCHANGE_EXP    = '02';  //예약일경과

var CART_UPDATE_FLAG_SMP = 'update_smp'; //스마트픽 수정(방문예정일자)
var CART_UPDATE_FLAG_SMP_LOC = "update_smp_loc"; //스마트픽 픽업위치 수정

var GOODS_SMP_NORMAL_ETC = "0102ETC";  //로드샵 일반(e쿠폰)

//201607크로스픽 편의점 지도 연동
var martIndex = 0;
function searchMartClose(){
    $("#searchMartPop").hide();
}
var crosspickParams = {};
function searchMartResult(paramObj){
    crosspickParams = {
        "crspk_yn" : "Y",
        "crspk_corp_cd" : paramObj.crspk_corp_cd,
        "crspk_corp_str_sct_cd" : paramObj.crspk_corp_str_sct_cd,
        "crspk_str_no" : paramObj.crspk_str_no
    }
    $("#crspk_corp_cd_" + martIndex).trigger("click");
}

var holiday = false; //퀵배송 백화점 휴무일(영업일일 경우 true)
var quick_dlv_msg = false ;// 퀵배송 메세지
(function(window, angular, undefined) {
	'use strict';

	/**
	 * @ngdoc overview
	 * @name app
	 * @description
	 * 장바구니 모듈
	 */
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteUtil'
	]);
	/**
	 * @ngdoc service
	 * @name cartGaEvtTag
	 * @description
	 * 장바구니 GA 태깅 공통 service
	 * 작성자 : 김지호
	 */
	app.service('cartGaEvtTag', ['LotteUtil','LotteGA',function (LotteUtil, LotteGA) {
		this.ga = function(action,label,goodsNo){
			var gaCtg = 'MO_장바구니',
			gaAction = (action) ? action : '-',
			gaLabel = (label) ? label : '-',
			gaGoodsNo = (goodsNo) ? goodsNo : '-'; 

		// eventCategory, eventAction, eventLabel, dimension53, dimension54
		LotteGA.evtTag(gaCtg, gaAction, gaLabel, gaGoodsNo);
		}
	}]);

	/**
	 * @ngdoc controller
	 * @name cartCtrl
	 * @description
	 * 장바구니 메인 컨트롤러
	 */
	app.controller('cartCtrl', ['$scope', 'LotteCommon', '$http', 'LotteCookie', '$filter', 'LotteUtil', '$timeout', '$window', 'LotteUserService', 'LotteStorage', 'cartGaEvtTag',
		function($scope, LotteCommon, $http, LotteCookie, $filter, LotteUtil, $timeout, $window, LotteUserService, LotteStorage, cartGaEvtTag) {
		//----------------------------------------------------------------------------------------------------
		// 변수 선언
		//----------------------------------------------------------------------------------------------------
		$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)

		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = '장바구니'; // 서브헤더 타이틀
		
		// TODO ywkang2 : 디폴트 수량으로 변경 필요
		$scope.itemCountPerPage = 10; // 페이지당 상품 출력 개수(디폴트:20)

		$scope.loadedProductList = []; // 로드된 유효 상품 전체 목록

		$scope.groupInfos = {}; // 상품 그룹 정보(그룹키:{그룹명, 그룹아이템})

		$scope.GROUP_KEY_NORMAL = 'normal';
		$scope.GROUP_KEY_BOOK = 'book';
		$scope.GROUP_KEY_MANGGO = 'manggo';
		$scope.GROUP_KEY_SMARTPIC = 'smartpic';
		$scope.GROUP_KEY_HOMESHOPPING = 'homeshopping';
		$scope.GROUP_KEY_SOLDOUT = 'soldout';

		$scope.initLoadingProductList = false; // 유효상품 목록 초기로딩(비동기) 완료 여부

		$scope.cartItemTotalCount = 0; // 품절상품을 제외한 총 개수
		$scope.wishTotalCount = 0; // 위시 총 개수
		$scope.recentViewTotalCount = 0; // 최근본상품 총 개수

		$scope.selectedProductCount = 0; // 그룹 전체에서 선택된 상품 수
		$scope.selectedProductFinalPriceSum = 0; // 그룹 전체에서 선택된 상품의 가격 합계
		$scope.selectedDeliveryFinalPriceSum = 0; // 그룹 전체에서 선택된 상품의 배송비 합계

		$scope.isOpenedSoldoutSection = false; // 품절/판매종료 상품 섹션이 오픈 여부

		$scope.isOpenedShopping = false; // 장보기몰 상품목록 섹션 오픈 여부
		//$scope.isItemShopping = ; // 장보기몰 담은상품 존재여부

		$scope.isOpenedSmartpicLocation = false; // 스마트픽 위치보기 팝업 오픈 여부

		$scope.smpLocationInfo = {}; // 스마트픽 위치보기 팝업에 출력될 정보

		$scope.instantDelay = 2000; // 인스턴트 메시지 딜레이 타임(밀리쎄컨드)

		$scope.alidoCartData = {}; // 알리도 수집스크립트 전달용 카트 데이터

		// 공통 인스턴트메시지 정보
		$scope.commonAlramInfo = {
			is_block: false, // 중복으로 메시지 보이는 것을 방지
			is_show: false, // 인스턴트메시지 보이기/숨기기
			message: '' // 메시지
		};

		// 쿠폰 팝업 정보
		$scope.couponPopupInfo = {
			isShow: false,
			couponNo: 0,
			cookieName: ''
		};

		// 20180315 버버리 팝업 추가
		$scope.burberryOpenPop = false;
		$scope.burberryOrder = false;
		// 선택되도록 요청되어진 상품번호 배열
		$scope.requestedSelectGoodsNos = [];
		//20180323 lg희망일배송 윈도우스크롤 높이
		$scope.wScroll = 0; // 윈도우 스크롤 높이

		$scope.isQuick = false; //퀵배송 상품 포함 여부
		$scope.openHopePop = false; //lg전자 희망일배송 레이어 팝업 보이기 : boolen

        // 20180710 소득공제
        $scope.idneYnChkArray = [];  //소득공제 체크 값 배열
        $scope.idneObj = {
            allChk : false,
            idneChkY :true
        };
		//----------------------------------------------------------------------------------------------------
		// 유틸 - 공통
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name getTclickCode
		 * @description
		 * 티클릭 코드 생성
		 * @param {boolean} isPrd 상품 여부
		 * @param {boolean} isBtn 버튼 여부
		 * @param {boolean} isLnk 링크 여부
		 * @param {number} no 버튼 또는 링크 순번
		 * @param {number} idx 상품 목록 순번
		 */
		$scope.getTclickCode = function (isPrd, isBtn, isLnk, no, idx) {
			var screenID = 'cart'; // 티클릭용 스크린ID

			var result = $scope.tClickBase + screenID + '_Clk';

			result += isPrd ? '_Prd' : '';
			result += isBtn ? '_Btn' : '';
			result += isLnk ? '_Lnk' : '';
			result += no ? '_' + no : '';
			result += idx ? '_idx' + idx : '';

			return result;
		};

		/**
		 * @ngdoc function
		 * @name getTclickParam
		 * @description
		 * 티클릭 파라미터 생성
		 * @param {boolean} isPrd 상품 여부
		 * @param {boolean} isBtn 버튼 여부
		 * @param {boolean} isLnk 링크 여부
		 * @param {number} no 버튼 또는 링크 순번
		 * @param {number} idx 상품 목록 순번
		 */
		$scope.getTclickParam = function (isPrd, isBtn, isLnk, no, idx) {
			return '&tclick=' + $scope.getTclickCode(isPrd, isBtn, isLnk, no, idx);
		};

		/**
		 * @ngdoc function
		 * @name isAdultUser
		 * @description
		 * 성인여부 확인
		 */
		$scope.isAdultUser = function() {
			return 'Y' == LotteCookie.getCookie('ADULTYN');
		};

		/**
		 * @ngdoc function
		 * @name getUrlParam
		 * @description
		 * url에서 파라미터 값 조회
		 * @param {string} 파라미터 키
		 */
		$scope.getUrlParam = function(key) {
			var result = '';

			// URL 파라미터 파싱
			var queries = $window.location.search.replace(/^\?/, '').split('&');

			// 파라미티 찾기
			angular.forEach(queries, function(value) {
				if (value) {
					var paramInfo = value.split('=');

					if (paramInfo.length > 0) {
						if (key == paramInfo[0]) {
							result = paramInfo[1];
						}
					}
				}
			});
			return result;
		};

		/**
		 * @ngdoc function
		 * @name getUrlGoodsNosParam
		 * @description
		 * url에서 상품번호 파라미터 조회해서 상품번호 배열 반환
		 */
		$scope.getUrlGoodsNosParam = function() {
			return $scope.getUrlParam('goods_nos').split(',');
		};

		/**
		 * @ngdoc function
		 * @name hasRequestSelectGoodsNo
		 * @description
		 * 선택되도록 요청된 상품번호가 존재하는지 확인
		 * @param {string} goodsNo 상품번호
		 */
		$scope.hasRequestSelectGoodsNo = function(goodsNo) {
			var result = false;

			for (var i = 0; i < $scope.requestedSelectGoodsNos.length; i++) {
				if (goodsNo == $scope.requestedSelectGoodsNos[i]) {
					result = true;
					break;
				}
			}

			return result;
		}

		/**
		 * @ngdoc function
		 * @name showInstantMessage
		 * @description
		 * 인스턴트 메시지 오픈(자동 닫힘)
		 * @param {string} message 메세지
		 */
		$scope.showInstantMessage = function(message) {
			if (!$scope.commonAlramInfo.is_block) {
				// 인스턴트 메시지 오픈
				$scope.commonAlramInfo.is_block = true;
				$scope.commonAlramInfo.message = message;
				$scope.commonAlramInfo.is_show = true;

				// 2초후 인스턴트 메시지 닫음
				$timeout(function() {
					$scope.commonAlramInfo.is_show = false;
					$scope.commonAlramInfo.is_block = false;
				}, $scope.instantDelay);
			}
		};

		/**
		 * @ngdoc function
		 * @name closeCouponPopup
		 * @description
		 * 쿠폰 팝업 닫기
		 */
		$scope.closeCouponPopup = function() {
			$scope.dimmedClose();
			$scope.couponPopupInfo.isShow = false;
		};

		/**
		 * @ngdoc function
		 * @name stopShowingCouponPopup
		 * @description
		 * 쿠폰 보이지 않기 - 몇일동안
		 * @param {number} somDay 보이지 않을 일 수
		 */
		$scope.stopShowingCouponPopup = function(somDay) {
			var day = somDay || 1;
			var cookieValue = 'no';

			// 쿠키에 저장
			LotteCookie.setCookie($scope.couponPopupInfo.cookieName, cookieValue, day);

			$scope.closeCouponPopup();
		};

		/**
		 * @ngdoc function
		 * @name downloadCoupon
		 * @description
		 * 중복쿠폰 다운로드 서비스 요청
		 */
		$scope.downloadCoupon = function() {
			// 로그인 안된 경우
			if (!$scope.loginInfo.isLogin) {
				$scope.loginProc('N');
				return;
			}

			// 서비스 요청
			$http({
				method: 'POST',
				url: LotteCommon.cartRegCouponData + '?' + $scope.baseParam,
				data: {
					cpn_issu_no: $scope.couponPopupInfo.couponNo,
					dup_cpn_yn: 'Y'
				},
				transformRequest: transformJsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				//console.log(data);

				var isIssued = data.data_set.is_issued;
				var msg = data.data_set.result;

				alert(msg.replace('\\n', '\n'));

				if (isIssued) {
					$scope.stopShowingCouponPopup();
				}

				$scope.closeCouponPopup();
			})
			.error(function(ex) {
				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;

					alert(errorMsg);

					if ('9003' == errorCode) {
						var targUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
						location.href = LotteCommon.loginForm + '?' + targUrl;
					}
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}

				$scope.closeCouponPopup();
			});
		};

		//----------------------------------------------------------------------------------------------------
		// 유틸
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name getProductSortNo
		 * @description
		 * 상품 출력 순서(그룹에 상관없이 품절/판매종료를 제외한 전체)
		 * @param {Object} selectedProduct 선택된 상품
		 */
		$scope.getProductSortNo = function(selectedProduct) {
			var result = 0;
			var no = 1;

			angular.forEach($scope.groupInfos, function(groupInfo, groupKey) {
				// 품절 그룹 제외
				if ($scope.GROUP_KEY_SOLDOUT !== groupInfo.key) {
					angular.forEach(groupInfo.products, function(product, idx) {
						// 상품번호, 단품번호 비교
						if (product.goodsNo == selectedProduct.goodsNo && product.itemNo == selectedProduct.itemNo) {
							result = no;
						} else {
							++no;
						}
					});
				}
			});

			return result;
		};

		/**
		 * @ngdoc function
		 * @name isNotPrintGroup
		 * @description
		 * 그룹 출력하지 않는지 여부
		 */
		$scope.isNotPrintGroup = function() {
			return $scope.isEllotteWeb();
		};

		/**
		 * @ngdoc function
		 * @name isEllotteWeb
		 * @description
		 * 엘롯데 웹사이트 여부
		 */
		$scope.isEllotteWeb = function() {
			return LotteUtil.isEllotte();
		};

		/**
		 * @ngdoc function
		 * @name initGroupInfos
		 * @description
		 * 그룹 정보 초기화
		 */
		$scope.initGroupInfos = function() {
			$scope.addGroupInfo($scope.GROUP_KEY_NORMAL, '일반');
			$scope.addGroupInfo($scope.GROUP_KEY_BOOK, '도서');
			$scope.addGroupInfo($scope.GROUP_KEY_MANGGO, '망고');
			$scope.addGroupInfo($scope.GROUP_KEY_SMARTPIC, '스마트픽');
			$scope.addGroupInfo($scope.GROUP_KEY_HOMESHOPPING, '홈쇼핑');
			$scope.addGroupInfo($scope.GROUP_KEY_SOLDOUT, '품절/판매종료');
		};

		/**
		 * @ngdoc function
		 * @name addGroupInfo
		 * @description
		 * 그룹 정보 생성
		 * @param {string} key 그룹키
		 * @param {string} name 그룹명
		 */
		$scope.addGroupInfo = function(key, name) {
			$scope.groupInfos[key] = {
				key: key, // 그룹키
				name: name, // 그룹명
				isSmpartpic: key == $scope.GROUP_KEY_SMARTPIC, // 스마트픽여부
				isHomeShopping: key == $scope.GROUP_KEY_HOMESHOPPING, // 홈쇼핑여부
				products: [], // 상품목록
				isSelectedAll: false, // 그룹의 상품들 모두 선택여부
				checkedProductCount: 0, // 그룹 내 선택된 상품 개수
				checkedProductQtySum: 0, // 그룹 내 선택된 상품의 수량 합계
				productFinalPriceTotal: 0, // 그룹 내 상품 최종 가격 소계
				deliveryFinalPriceTotal: 0, // 그룹 내 배송 최종 가격 소계
				lpointFinalPriceTotal: 0, // 그룹 내 엘포인트 최종 가격 소계
				isQuick: false //퀵배송 상품 여부
			};
		};

		/**
		 * @ngdoc function
		 * @name getGroupInfo
		 * @description
		 * 그룹 정보 조회
		 * @param {string} key 그룹키
		 */
		$scope.getGroupInfo = function(key) {
			return $scope.groupInfos[key];
		};

		/**
		 * @ngdoc function
		 * @name getNormalGroupInfo
		 * @description
		 * 일반 상품 그룹 정보 조회
		 */
		$scope.getNormalGroupInfo = function() {
			return $scope.getGroupInfo($scope.GROUP_KEY_NORMAL);
		};
		/**
		 * @ngdoc function
		 * @name getBookGroupInfo
		 * @description
		 * 도서 상품 그룹 정보 조회
		 */
		$scope.getBookGroupInfo = function() {
			return $scope.getGroupInfo($scope.GROUP_KEY_BOOK);
		};

		/**
		 * @ngdoc function
		 * @name getManggoGroupInfo
		 * @description
		 * 망고 상품 그룹 정보 조회
		 */
		$scope.getManggoGroupInfo = function() {
			return $scope.getGroupInfo($scope.GROUP_KEY_MANGGO);
		};

		/**
		 * @ngdoc function
		 * @name getSmartpicGroupInfo
		 * @description
		 * 스마트픽 상품 그룹 정보 조회
		 */
		$scope.getSmartpicGroupInfo = function() {
			return $scope.getGroupInfo($scope.GROUP_KEY_SMARTPIC);
		};

		/**
		 * @ngdoc function
		 * @name getHomeshoppingGroupInfo
		 * @description
		 * 홈쇼핑 상품 그룹 정보 조회
		 */
		$scope.getHomeshoppingGroupInfo = function() {
			return $scope.getGroupInfo($scope.GROUP_KEY_HOMESHOPPING);
		};

		/**
		 * @ngdoc function
		 * @name getSoldoutGroupInfo
		 * @description
		 * 품절/판매종료 상품 그룹 정보 조회
		 */
		$scope.getSoldoutGroupInfo = function() {
			return $scope.getGroupInfo($scope.GROUP_KEY_SOLDOUT);
		};

		/**
		 * @ngdoc function
		 * @name getGroupProducts
		 * @description
		 * 그룹의 상품들 조회
		 * @param {string} key 그룹 키
		 */
		$scope.getGroupProducts = function(key) {
			return $scope.getGroupInfo(key).products;
		};

		/**
		 * @ngdoc function
		 * @name addProductInGroup
		 * @description
		 * 그룹에 상품 추가
		 * @param {string} key 그룹 키
		 * @param {Object} item 상품
		 */
		$scope.addProductInGroup = function(key, item) {
			return $scope.getGroupProducts(key).push(item);
		};

		/**
		 * @ngdoc function
		 * @name getGroupName
		 * @description
		 * 그룹명 조회
		 * @param {string} key 그룹 키
		 */
		$scope.getGroupName = function(key) {
			return $scope.getGroupInfo(key).name;
		};

		/**
		 * @ngdoc function
		 * @name notExistCartItem
		 * @description
		 * 카트에 유효상품이 하나도 없는지 확인
		 */
		$scope.notExistCartItem = function() {
			return $scope.initLoadingProductList && 0 == $scope.cartItemTotalCount;
		};

		/**
		 * @ngdoc function
		 * @name notExistSoldoutCartItem
		 * @description
		 * 카트에 품절상품이 하나도 없는지 확인
		 */
		$scope.notExistSoldoutCartItem = function() {
			return 0 == $scope.getSoldoutTotalCount();
		};

		/**
		 * @ngdoc function
		 * @name getSoldoutTotalCount
		 * @description
		 * 카트에 품절상품 개수
		 */
		$scope.getSoldoutTotalCount = function() {
			var soldoutProducts = $scope.getSoldoutGroupInfo().products;

			return !soldoutProducts ? 0 : soldoutProducts.length;
		};

		/**
		 * @ngdoc function
		 * @name notExistAnyCartItem
		 * @description
		 * 카트에 어떠한 상품도 없는지 확인
		 */
		$scope.notExistAnyCartItem = function() {
			return $scope.notExistCartItem();
		};

		/**
		 * @ngdoc function
		 * @name getFormattedGoodsNm
		 * @description
		 * 상품명 포맷</br>
		 *      [브랜드명] 상품명
		 * @param {Object} product 상품
		 */
		$scope.getFormattedGoodsNm = function(product) {
			var result = '';

			if (product.brand) {
				result += '[' + product.brand + '] ';
			}

			return result + product.goodsNm;
		};

		/**
		 * @ngdoc function
		 * @name getResultEmptyMessage
		 * @description
		 * 장바구니가 비어있을 경우 메세지
		 *      CASE-1 : 유효상품은 없고 품절/판매종료 상품이 존재
		 *      CASE-2 : 유효상품, 품절/판매종료 모두 없음
		 */
		$scope.getResultEmptyMessage = function() {
			var result = '';

			// 유효상품은 없고 품절/판매종료 상품이 존재
			if ($scope.notExistAnyCartItem() && !$scope.notExistSoldoutCartItem()) {
				result = '판매중인 상품이 없습니다.';

			// 유효상품, 품절/판매종료 모두 없음
			} else if ($scope.notExistAnyCartItem() && $scope.notExistSoldoutCartItem()) {
				result = '장바구니에 저장된 상품이 없습니다.';
			}

			return result;
		};

		//----------------------------------------------------------------------------------------------------
		// 화면 컨트롤 - 체크박스, 소계 계산
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name toggleCheckAllItems
		 * @description
		 * 전체선택/전체해제 토글
		 * @param {Object} groupInfo 그룹 정보
		 * @param {boolean} isDeselectAll 전체 선택 해제 여부
		 */
		$scope.toggleCheckAllItems = function(groupInfo, isDeselectAll) {
			// console.log('toggleCheckAllItems')
			groupInfo.isSelectedAll = isDeselectAll ? false : !groupInfo.isSelectedAll;
			// var isRentalPdt = false;
			angular.forEach(groupInfo.products, function(product, idx) {
				if(product.has_smartpic_stock && !product.is_not_sell_for_tworld && !product.is_not_sell_on_mobile) {
					product.is_checked = groupInfo.isSelectedAll;
                    //크로스픽
                    if(product.crspk_yn =='Y' && product.crspk_psb_yn !='Y'){
                        product.is_checked = false;
                    }
				}
			});

			$scope.calcGroupSummary(groupInfo);
		};

		/**
		 * @ngdoc function
		 * @name changeEachCheckbox
		 * @description
		 * 개별체크박스 체크 변경
		 * @param {Object} product 상품 정보
		 * @param {Object} groupInfo 그룹 정보
		 * @param {boolean} isNotCalc 합계 재계산 여부
		 */
        $scope.prdHistory = null; //상품 정보 체크
		$scope.changeEachCheckbox = function (product, groupInfo, isNotCalc) {

            var qp = product.quick_deli_yn ,fp = product.cpcg_dlv_yn,
                prdChk = qp == 'Y' ? 'Q' : fp == 'Y' ? 'F' : 'N';

			if (!product.is_checked) {
				groupInfo.isSelectedAll = false;
                if($scope.prdHistory == prdChk) $scope.prdHistory = ''; // 상품 정보 초기화
			} else {
				var selectAll = true, confirmSelPrd = '',
					quick_yn = product.quick_deli_yn,
                    fish_yn = product.cpcg_dlv_yn;

                if(!$scope.prdHistory && groupInfo.key == 'normal') $scope.prdHistory = quick_yn == 'Y' ? 'Q' : fish_yn == 'Y' ? 'F' : 'N'; // 상품 정보 저장

                angular.forEach(groupInfo.products, function(product, idx) {
					if (!product.is_checked) {
						if (product.has_smartpic_stock && !product.is_not_sell_for_tworld && !product.is_not_sell_on_mobile) {
							selectAll = false;
						}
					}else{
						confirmSelPrd += product.quick_deli_yn == quick_yn ? '':'N';//선택되어있는 상품이 퀵배송상품인지 일반상품인지 체크
						confirmSelPrd += product.cpcg_dlv_yn == fish_yn ? '':'F';//선택되어있는 상품이 런닝피쉬인지 일반상품인지 체크
					}
				});
				if(confirmSelPrd.indexOf('N') > -1 || confirmSelPrd.indexOf('F') > -1 ){
                    if(($scope.prdHistory == "N" && quick_yn == 'Y' ) || $scope.prdHistory == "Q") alert('퀵배송 상품은 다른 배송상품과\n함께 주문하실 수 없습니다.');
                    else alert('런닝피쉬 상품은 다른 배송상품과\n함께 주문하실 수 없습니다.');
                    product.is_checked = false;
					return false;
				}
				groupInfo.isSelectedAll = selectAll;
			}
			if (!isNotCalc) {
				$scope.calcGroupSummary(groupInfo);
			}
		};

		/**
		 * @ngdoc function
		 * @name calcGroupSummary
		 * @description
		 * 체크 변경에 따른 그룹내 소계 계산
		 * @param {Object} groupInfo 그룹 정보
		 */
		$scope.calcGroupSummary = function(groupInfo) {
			var checkedCount = 0; // 그룹 내 선택된 상품 수
			var deliDivPolcNoList = []; // 계산된 배송비 그룹코드 배열
			var isQuickPrd = false;

			groupInfo.productFinalPriceTotal = 0;
			groupInfo.deliveryFinalPriceTotal = 0;
			groupInfo.lpointFinalPriceTotal = 0;

			angular.forEach(groupInfo.products, function(product, index) {
				if (product.is_checked) {
					//퀵배송 장바구니일때
					if(product.quick_deli_yn == 'Y' && !isQuickPrd) isQuickPrd = true;
					// 상품가 * 수량
					groupInfo.productFinalPriceTotal += product.basic_price * product.qty;

					// 배송비 - 스마트픽
					if (groupInfo.key == $scope.GROUP_KEY_SMARTPIC) {
						groupInfo.deliveryFinalPriceTotal += product.deli;

					// 배송비 - 스마트픽 외
					} else {
						var deliNo = product.deli_div_polc_no;

						// 배송비코드가 같으면 한 번만 계산
						if (deliDivPolcNoList.indexOf(deliNo) == -1) {
							groupInfo.deliveryFinalPriceTotal += product.deli;
							deliDivPolcNoList.push(deliNo);
						}
					}

					// 엘포인트
					groupInfo.lpointFinalPriceTotal += product.lotte_point * product.qty;

					// 그룹 내 선택된 상품의 수량 합계
					groupInfo.checkedProductQtySum += product.qty;

					++checkedCount;
				}
			});

			if(isQuickPrd){
				groupInfo.deliveryFinalPriceTotal = groupInfo.productFinalPriceTotal >= 100000 ? 5000 : 10000;
				$scope.getGroupInfo($scope.GROUP_KEY_NORMAL).isQuick = true;
			}else{
				$scope.getGroupInfo($scope.GROUP_KEY_NORMAL).isQuick = false;
			}

			groupInfo.checkedProductCount = checkedCount;

			$scope.calcTotalSummary();
		};

		/**
		 * @ngdoc function
		 * @name calcTotalSummary
		 * @description
		 * 체크 변경에 따른 그룹 전체 합계 계산
		 */
		$scope.calcTotalSummary = function() {
			$scope.isQuickTotal = false;
			$scope.selectedProductCount = 0; // 그룹 전체에서 선택된 상품 수
			$scope.selectedProductFinalPriceSum = 0; // 그룹 전체에서 선택된 상품의 가격 합계
			$scope.selectedDeliveryFinalPriceSum = 0; // 그룹 전체에서 선택된 상품의 배송비 합계
            //console.log($scope.groupInfos);
			angular.forEach($scope.groupInfos, function(groupInfo, groupKey) {
				// 품절 그룹 제외
				if ($scope.GROUP_KEY_SOLDOUT !== groupInfo.key) {
					$scope.selectedProductCount += groupInfo.checkedProductCount;
					$scope.selectedProductFinalPriceSum += groupInfo.productFinalPriceTotal;
					$scope.selectedDeliveryFinalPriceSum += groupInfo.deliveryFinalPriceTotal;
					if($scope.getGroupInfo($scope.GROUP_KEY_NORMAL).isQuick) $scope.isQuickTotal = true;
				}
			});
		};

		/**
		 * @ngdoc function
		 * @name reCalcGroupSummary
		 * @description
		 * 전체 그룹 소계 및 합계 재계산
		 */
		$scope.reCalcGroupSummary = function() {
			angular.forEach($scope.groupInfos, function(groupInfo, groupKey) {
				// 품절 그룹 제외
				if ($scope.GROUP_KEY_SOLDOUT !== groupInfo.key) {
					$scope.calcGroupSummary(groupInfo);
				}
			});
		};

        //크로스픽 -----------------------------------------------------
        $scope.google_map_url = LotteCommon.pickMapUrl;
		//----------------------------------------------------------------------------------------------------
		// 화면 컨트롤 - 상품 옵션
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name toggleGoodsOption
		 * @description
		 * 상품 옵션 토글
		 * @param {Object} product 상품 정보
		 */
		$scope.toggleGoodsOption = function(product) {
			var openStatus = !product.is_opened_option;

			//---------------------------------------------------
			// 선택형 옵션 로드
			//---------------------------------------------------
			// 선택형 옵션을 처음 불러오는 경우
			if (!product.is_loaded_select_option) {
				var selectOptions = product.select_options;

				$scope.requestGetGoodsOptions(product, function(product, selectOptions) {
					if (!selectOptions || (selectOptions && selectOptions.length < 2)) {
						product.is_opened_option = openStatus;

					} else {
						// 옵션정보를 모두 불러온 후
						// 마지막 옵션 정보 교체
						$scope.requestLastOptionItemListAndReplace(product, null, function(product, lastOption) {
							product.is_opened_option = openStatus;
							product.is_loaded_select_option = true;
							lastOption.selected_item_no = product.itemNo;
						});
					}
				});

			} else {
				product.is_opened_option = openStatus;
			}
		};

		/**
		 * @ngdoc function
		 * @name requestGetGoodsOptions
		 * @description
		 * 상품옵션 서버서비스 요청
		 * @param {Object} product 상품 정보
		 * @param {function} successCallback 성공 시 콜백 함수
		 * @param {function} errorCallback 에러 시 콜백 함수
		 */
		$scope.requestGetGoodsOptions = function(product, successCallback, errorCallback) {

			$http.get(
					LotteCommon.cartOptionData + '?' + $scope.baseParam + $scope.getTclickParam(true, true, null, 3, null),
					{params: {
						cart_sn: product.seq,
						curDispNo: product.infwDispNoSctCd,
						goods_no: product.goodsNo,
						item_no: product.itemNo,
						qs_yn: product.quick_deli_yn
					}}
			)
			.success(function(data) {
				if (data.productItemDtl) {
					var selectOptions = data.productItemDtl.items;

					product.select_options = selectOptions;
				}

				if (data.productItemOpt) {
					product.input_options = data.productItemOpt.items;
				}

				if (successCallback) successCallback(product, product.select_options);
			})
			.error(function(ex) {
				// ajaxResponseErrorHandler(ex, function() {
				// 	if (errorCallback) errorCallback(product, product.select_options);
				// });

				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;

					alert(errorMsg);

					if ('9003' == errorCode) {
						var targUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
						location.href = LotteCommon.loginForm + '?' + targUrl;
					}
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}

				if (errorCallback) errorCallback(product, product.select_options);
			});
		};

		/**
		 * @ngdoc function
		 * @name changeSelectOptionItem
		 * @description
		 * 각 옵션의 아이템 변경 이벤트
		 * @param {Object} product 상품 정보
		 * @param {number} changedOptionIdx 변경 옵션 번호
		 */
		$scope.changeSelectOptionItem = function(product, changedOptionIdx) {
			var options = product.select_options;
			var changedOption = options[changedOptionIdx];
			var optionNo = changedOptionIdx + 1;

			// 상품의 변경된 단품번호 초기화
			product.changedSelectOptionItemNo = '';
			product.inv_qty = '';

			// 첫번째를 제외한 옵션 초기화
			angular.forEach(options, function(option, optionIdx) {
				if (optionIdx > changedOptionIdx) {
					option.selected_item_no = '';
				}
			});

			// 마지막 옵션 변경 시
			if (optionNo == options.length) {
				var selectedItemNo = changedOption.selected_item_no;

				// 상품의 단품번호(itemNo) 셋팅
				product.changedSelectOptionItemNo = selectedItemNo;

				// 단품 재고수량 셋팅
				angular.forEach(changedOption.item.items, function(optionItem, idx) {
					if (selectedItemNo == optionItem.item_no) {
						product.inv_qty = optionItem.opt_cnt;
					}
				});

				// 사용자 주문 수량이 재고보다 클 경우 재고수량으로 셋팅
				if (Number(product.qty) > Number(product.inv_qty)) {
					product.qty = Number(product.inv_qty);
				}

			// 마지막에서 두번째 옵션 변경 시
			} else if (optionNo == (options.length - 1)) {
				// 마지막 옵션 정보 요청 후 교체
				$scope.requestLastOptionItemListAndReplace(product, optionNo);
			}
		};

		/**
		 * @ngdoc function
		 * @name requestLastOptionItemListAndReplace
		 * @description
		 * 마지막 상품 옵션 정보 조회 서버서비스 요청
		 *  전달받은 데이터로 마지막 옵션정보 교체
		 * @param {Object} product 상품 정보
		 * @param {number} optionNo 옵션 번호
		 * @param {function} successCallback 성공 시 콜백 함수
		 * @param {function} errorCallback 에러 시 콜백 함수
		 */
		$scope.requestLastOptionItemListAndReplace = function(product, optionNo, successCallback, errorCallback) {
			var options = product.select_options;
			var lastOption = options[options.length - 1];
			var optValArr = [];

			// 옵션번호가 널인 경우는 옵션이 처음으로 펼쳐지는 경우
			// 옵션정보를 초기에 가져올때는 마지막옵션에 단품번호가 셋팅되어 있지 않고 옵션아이템의 순번이 셋팅되어있다.
			// 마지막 옵션의 단품번호를 셋팅하기 위함이다
			if (!optionNo) {
				lastOption.selected_item_no = '';
				optionNo = optionNo || (options.length - 1);
			}

			// 서버의 요구되는대로 옵션의 아이템번호를 조합한다(1 x 8 x ...)
			angular.forEach(options, function(option, idx) {
				var selectedItemNo = option.selected_item_no;

				if (selectedItemNo) {
					optValArr.push(selectedItemNo);
				}
			});

			// 마지막 옵션 정보 조회 요청
			$http({
				method: 'POST',
				url: LotteCommon.cartLastOptionData + '?' + $scope.baseParam,
				data: {
					goods_no: product.goodsNo,
					opt_val_cd: optValArr.join(' x '), // TODO ywkang2 : " x " 코드성으로 리팩토링 필요
					optcnt: options.length,
					optnum: optionNo,
					qs_yn:product.quick_deli_yn
				},
				transformRequest: transformJsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				// 마지막 옵션 정보(셀렉트박스)를 교체한다.
				lastOption.item.items = data.item;

				if (successCallback) successCallback(product, lastOption);
			})
			.error(function(ex) {
				// ajaxResponseErrorHandler(ex, function() {
				// 	if (errorCallback) errorCallback();
				// });

				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;

					alert(errorMsg);

					if ('9003' == errorCode) {
						var targUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
						location.href = LotteCommon.loginForm + '?' + targUrl;
					}
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}

				if (errorCallback) errorCallback();
			});
		};

		//----------------------------------------------------------------------------------------------------
		// 화면 컨트롤 - 품절 상품
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name toggleSoldoutSection
		 * @description
		 * 품절/판매종료 상품 섹션 토글
		 */
		$scope.toggleSoldoutSection = function() {
			$scope.isOpenedSoldoutSection = !$scope.isOpenedSoldoutSection;
			//20181008 GA태깅
			cartGaEvtTag.ga('품절상품리스트','열기/닫기');

			$scope.sendTclick($scope.getTclickCode(true, true, false, 6, null));
		};



		//----------------------------------------------------------------------------------------------------
		// 화면 컨트롤 - 출력 여부
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name isShowCartHeaderSectionForUser
		 * @description
		 * 로그인 회원을 위한 장바구니 헤더 출력 여부
		 */
		$scope.isShowCartHeaderSectionForUser = function() {
			return $scope.loginInfo.isLogin && $scope.initLoadingProductList;
		};

		/**
		 * @ngdoc function
		 * @name isShowCartHeaderSectionForGuest
		 * @description
		 * 비로그인 회원을 위한 장바구니 헤더 출력 여부
		 */
		$scope.isShowCartHeaderSectionForGuest = function() {
			return !$scope.loginInfo.isLogin && $scope.initLoadingProductList;
		};

		/**
		 * @ngdoc function
		 * @name isShowLoadingWrapSection
		 * @description
		 * 본문 로딩 이미지 출력 여부
		 */
		$scope.isShowLoadingWrapSection = function() {
			return !$scope.initLoadingProductList;
		};

		/**
		 * @ngdoc function
		 * @name isShowResultEmptySection
		 * @description
		 * 장바구니 상품 없을 시 영영 출력 여부
		 */
		$scope.isShowResultEmptySection = function() {
			return $scope.notExistAnyCartItem() || ($scope.notExistAnyCartItem() && $scope.notExistSoldoutCartItem());
		};

		/**
		 * @ngdoc function
		 * @name isShowCartInfoSection
		 * @description
		 * 장바구니 안내영역 및 합계 영역 출력 여부
		 */
		$scope.isShowCartInfoSection = function() {
			return $scope.initLoadingProductList && (!$scope.notExistCartItem() || !$scope.notExistSoldoutCartItem());
		};



		//----------------------------------------------------------------------------------------------------
		// 액션 - 위시
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name addWish
		 * @description
		 * 위시 담기
		 * @param {Object} groupInfo 그룹 정보
		 */
		$scope.addWish = function(groupInfo) {
			// 로그인 안된 경우
			if (!$scope.loginInfo.isLogin) {
				$scope.loginProc('N');
				return;
			}

			var goodsNos = $scope.getCheckedProductGoodsNos(groupInfo);

			// Validation - 상품이 선택되었는지 확인
			if (0 == goodsNos.length) {
				$scope.showInstantMessage('상품을 선택해 주세요.');
				return;
			}

			
			//20181008 GA태깅
			cartGaEvtTag.ga('장바구니리스트','위시담기');

			$http({
				method: 'POST',
				url: LotteCommon.wishAddData + '?' +  + $scope.baseParam + $scope.getTclickParam(null, true, null, 1, null),
				data: {
					goods_nos: goodsNos.join(':^:')
				},
				transformRequest: transformJsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				if (true) {
					$scope.openCireleSystemAlert({type:"wishPop"});
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}

			})
			.error(function(ex) {
				// ajaxResponseErrorHandler(ex);

				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;

					alert(errorMsg);

					if ('9003' == errorCode) {
						var targUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
						location.href = LotteCommon.loginForm + '?' + targUrl;
					}
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}
			});
		};

		//----------------------------------------------------------------------------------------------------
		// 액션 - 네비게이션
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name goGoodsDetail
		 * @description
		 * 상품 상세 화면으로 이동
		 * @param {Object} product 상품 정보
		 * @param {boolean} isSoldout 품절/판매종료 여부
		 * @param {string} idx 리스트 인덱스 넘버
		 */
		$scope.goGoodsDetail = function(product, isSoldout, idx) {
			var wish_lst_sn = '';
			var item_no = '';

			//20181008 GA태깅 
			var actionNm = (!isSoldout) ? '상품리스트' : '품절상품리스트',
				labelNm = ((''+idx).length == 1) ? '0'+idx : ''+idx;
			cartGaEvtTag.ga(actionNm,labelNm,product.goodsNo);

			// 인터파크 티켓이 아닐 경우
			if (!product.is_interpark_ticket) {

				// 단품 정보가 존재 하지 않는 경우
				if ('-23' == product.resultCd) {

				} else {
					// 판매종료 상태인 경우
					if ('30' == product.saleStatCd) {
						alert('상품 판매가 종료되었습니다.');
						return;

					} else {
						wish_lst_sn = product.seq;
						item_no = product.itemNo;
					}
				}

			} else {
				return;
			}
			// 성인인증이 필요한 상품인지 확인
			if ('Y' == product.minority_limit_yn) {
				if ($scope.isAdultUser()) {
					// TODO ywkang2 : 성인인증이 필요한 상품이고 성인일 경우 이동되는 프로세스 확인 필요함
					$scope.goAdultSci();
					return;

				} else {
					alert('이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.');
					return;
				}
			}

			var params = [];
			params.push('curDispNo=' + product.infwDispNo);
			params.push('curDispNoSctCd=' + product.infwDispNoSctCd);
			params.push('goods_no=' + product.goodsNo);
			params.push('cart_sn=' + product.seq);
			params.push('item_no=' + item_no);

			var tclickParam = '';
			
			if (!isSoldout) {
				tclickParam = $scope.getTclickParam(true, null, null, null, $scope.getProductSortNo(product));
			}

			location.href = "/product/m/product_view.do?" + $scope.baseParam + '&' + params.join('&') + tclickParam;
		};

		/**
		 * @ngdoc function
		 * @name isValidOrderInfo
		 * @description
		 * 주문 정보 유효성 체크
		 * @param {Object} products 상품 배열
		 */
		$scope.isValidOrderInfo = function(products) {
			var resultOk = {result: true, is_show_confirm: true};
			var resultNotOk = {result: false, is_show_confirm: true};
			var groupInfo = $scope.getGroupInfo(products[0].group_nm); // 하나의 그룹에 해당하는 상품들만 파라미터로 들어온다
			var hasMobileCardTiketInSmartpic = false; // <스마트픽> 모바일 롯데상품권 카드 존재 여부
			var hasGiftInSmartpic = false; // <스마트픽> 상품권 여부
			var hasInterparkTiketInSmartpic = false; // <스마트픽> 인터파크 티켓 존재 여부
			var selectedOverDateProducts = []; // <스마트픽> 방문예정일이 지난 상품들
            var gift_card_count = 0;
            $scope.idneYnChkArray = []; //20180710 소득공제 체크 값 배열
			for (var i in products) {
				var product = products[i];

				// 스마트픽 상품
                //20160930 일반상품에서도 비교하게끔 추가함 eung
				if (groupInfo.key == $scope.GROUP_KEY_SMARTPIC) {
					// 모바일 롯데상품권 카드 존재 여부 확인
					if (
							product.goodsNo == 105095077 ||
							product.goodsNo == 105095654 ||
							product.goodsNo == 105095772 ||
							product.goodsNo == 105095898
					) {
						hasMobileCardTiketInSmartpic = true;
					}

					// 상품권 존재 여부 확인
					if (product.gift_card && 'Y' == product.gift_card) {
						hasGiftInSmartpic = true;
					}

					// 인터파크 티켓 존재 여부 확인
					if (product.is_interpark_ticket) {
						hasInterparkTiketInSmartpic = true;
					}

					// 방문예정일이 지났는지 확인
					if (product.is_overed_date_smartpic) {
						selectedOverDateProducts.push(product);
					}
				}else if(groupInfo.key == $scope.GROUP_KEY_NORMAL){
					// 상품권 존재 여부 확인
					if (product.gift_card && 'Y' == product.gift_card) {
						hasGiftInSmartpic = true;
                        gift_card_count += 1;
					}
                }

				// LG 패션 재고 확인(홈쇼핑 제외)
				if (
						groupInfo.key != $scope.GROUP_KEY_HOMESHOPPING
						&&
						'Y' == product.lgf_tgt_yn
				) {
					var resultInfo = $scope.requestCheckLgFashionStockMng(product);

					if (!resultInfo.isOk) {
						alert(resultInfo.message);
						return resultNotOk;
					}
				}
                // 20180710 소득공제 체크
                $scope.idneYnChkArray.push(product.idne_yn);
			}
            //20160930 일반상품에서도 비교하게끔 추가함 eung
			// 스마트픽 상품 유효성 검사
			if (groupInfo.key == $scope.GROUP_KEY_SMARTPIC) {
				// 모바일 롯데상품권 카드가 썩여 있는 경우
				if(hasMobileCardTiketInSmartpic && products.length > 1) {
					alert("죄송합니다. 모바일 롯데상품권 카드는 다른 상품과 동시구매가 어렵습니다. 해당 상품 개별적으로 선택하신 후 구매해 주시기 바랍니다.");
					return resultNotOk;
				}

				// 상품권과 비상품권을 같이 주문할 경우
				if(hasGiftInSmartpic && products.length > 1) {
					alert('죄송합니다.\n상품권과 일반상품은 함께 주문하실 수 없습니다.');
					return resultNotOk;
				}

				// 인터파크 티켓 상품이 존재할 경우
				if (hasInterparkTiketInSmartpic) {
					alert('죄송합니다.\n인터파크 티켓 상품은 모바일에서 주문하실 수 없습니다.');
					return resultNotOk;
				}

				// 주문 수량 제한
				if(groupInfo.checkedProductQtySum > 50){
					alert("스마트픽은 주문시 수량 합계 50개까지 주문가능합니다. 확인후 다시 시도해주세요.");
					return resultNotOk;
				}

				// 예약일이 경과된 상품 포함 체크
				if (selectedOverDateProducts.length > 0) {
					// 선택 상품이 1개일 경우
					if (1 == products.length) {
						// 예약일이 경과된 상품 선택 해제
						angular.forEach(selectedOverDateProducts, function(product, idx) {
							$scope.changeEachCheckbox(product, $scope.getGroupInfo(product.group_nm));
						});

						alert('방문예정일이 지난 상품은 제외되었습니다.\n주문하실 상품을 선택해 주세요.');

						return resultNotOk;

					// 선택 상품이 다수일 경우
					} else {
						if (!confirm("방문예정일이 지난 상품이 있습니다.\n해당 상품을 제외하고 주문하시겠습니까?")) {
							return resultNotOk;
						} else {
							// 예약일이 경과된 상품 선택 해제
							angular.forEach(selectedOverDateProducts, function(product, idx) {
								$scope.changeEachCheckbox(product, $scope.getGroupInfo(product.group_nm));
							});

							resultOk.is_show_confirm = false;
						}
					}
				}
			}else if(groupInfo.key == $scope.GROUP_KEY_NORMAL){
				// 상품권과 비상품권을 같이 주문할 경우
				if(hasGiftInSmartpic && products.length > 1 && (gift_card_count != products.length)) {
					alert('죄송합니다.\n상품권과 일반상품은 함께 주문하실 수 없습니다.');
					return resultNotOk;
				}
            }

			// 망고상품 - 주문수량, 총판매금액 제한
			if(groupInfo.key == $scope.GROUP_KEY_MANGGO) {
				// 수량 30개 이상, 금액 150만원 이상 체크
				if (
						groupInfo.checkedProductCount > 30
						||
						groupInfo.productFinalPriceTotal > 1500000
				) {
					alert("망고 상품의 경우 구매수량이 30개 이상 혹은 판매금액이 150만원 이상인 경우 구매가 제한되오니 구매를 원하시면 나눠서 구매해주세요!");
					return resultNotOk;
				}

				// 망고상품 실시간 재고 체크
				if (!$scope.requestCheckMangoStockMng(products)) {
					resultNotOk.is_show_confirm = false;
					return resultNotOk;
				}

			}

            if($scope.idneObj.allChk && $scope.idneObj.idneChkY) { // 20180710 소득공제
                var resultIdne = $scope.idneYnChk(resultOk);
                return resultIdne;
            }

			return resultOk;
		};
        /**
		 * @ngdox function
		 * @name idneYnChk
		 * @decription
		 * 20180710 소득공제 배열 값 체크
		 * @param
		 * @param
	    **/
        $scope.idneYnChk = function(resultObj){
            var strYn = $scope.idneYnChkArray.toString(),
                chkY = strYn.match(/Y/g),
                chkN = strYn.match(/N/g);
            var chkObjV = {result: true, is_show_confirm:true, idneChk : true};

            if(!resultObj.is_show_confirm)  chkObjV.is_show_confirm = false;

            if(chkY && chkN && chkN.length > 0 && chkY.length > 0){ // 일반 상품 , 도서.문화 소득 상품 있을시
                var r = confirm('도서∙공연비 소득 공제 적용은 대상상품 주문시에만 적용 가능합니다.\n도서∙공연비 소득공제 적용 없이 선택하신 전체 상품을 주문하시겠습니까?');
                    if(r == true){//소득공제 없이 주문시
                        chkObjV.is_show_confirm = false;
                        chkObjV.idneChk = false;
                    }
                    else{//재선택시 도서상품 재설정
                        $scope.idneYnChkEvent();
                    }
            }else{// 소득공제 유효성 체크 해당 없을시
                chkObjV.idneChk = false;
            }
            return chkObjV;
        }
        /**
         * @ngdox function
         * @name idneYnChkEvent
         * @decription
         * 20180710 소득공제 주문 재설정시 해제
         * @param
         * @param
        **/
        $scope.idneYnChkEvent = function (){
            angular.forEach($scope.groupInfos, function(groupInfo, groupKey) {

                // 품절 그룹 제외
                if ($scope.GROUP_KEY_SOLDOUT !== groupInfo.key) {
                    angular.forEach(groupInfo.products, function(product, idx) {
                        if(product.idne_yn == 'N' && product.is_checked) {
                            product.is_checked = false;
                            $scope.changeEachCheckbox(product, $scope.getGroupInfo(product.group_nm));
                        }
                    });
                }
            });
        }
		/**
		 * @ngdox function
		 * @name invQtyCheak
		 * @decription
		 * 20180411 재고수량 체크
		 * @param p_val data crr_cart_sn 파라미터
		 * @param callFnc 콜백 함수
		 * */
        $scope.invQtyCheak = function (p_val,callFnc){

            $.ajax({
                type: "POST",
                dataType:"json",
                url: "/json/mylotte/cart/searchInvQtyCheckAjax.json",
                data: {arr_cart_sn : p_val},
                async:false,
                success:function(data) {
                    if(data.resultCd == "S"){
                        callFnc();
                    }else{
                        if(data.resultCd == "P"){
                            alert("선택하신 상품 중 일부 상품이 품절되었습니다.\n상품상세 페이지에서 재입고\n알람을 이용해주세요.");
                        }else{
                            alert("선택하신 상품이 모두 품절되어 주문이\n불가합니다. 상품상세 페이지에서 재입고\n알람을 이용해주세요.");
                        }
                        window.location.reload();
                    }
                },
                error:function(request, status) {
                    alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
                }
            });
		}

		/**
		 * @ngdoc function
		 * @name goOrder
		 * @description
		 * 주문서 화면으로 이동
		 * @param {Object} product 상품 정보
		 * @param {Object} groupInfo 그룹 정보
		 */
		$scope.goOrder = function(product, groupInfo) {
            $scope.idneObj.allChk = false; // 20180710 소득공제 선택 상품 여부
			// 주문 정보 유효성 검사 공통
			if (!$scope.isValidOrderInfo([product]).result) {
				return;
			}

			var hasMinorityLimit = 'Y' == product.minority_limit_yn;

			// 로그인된 경우
			if ($scope.loginInfo.isLogin) {
				$scope.checkMinorityLimit(hasMinorityLimit);

				var url = '';
				var params = [];

				// 홈쇼핑인 경우
				// if ($scope.GROUP_KEY_HOMESHOPPING == groupInfo.key) {
				// 	url = '/imall/cart/m/select_present.do';
				// }else{
				// 	url = '/mylotte/cart/m/select_present.do';
				// }
                $scope.invQtyCheak(product.seq,function(){
                    params.push('cartSn=' + product.seq);
                    params.push('smartOrd=' + ($scope.GROUP_KEY_SMARTPIC == groupInfo.key ? 'Y' : 'N'));
                    params.push('imallYN=' + ($scope.GROUP_KEY_HOMESHOPPING == groupInfo.key ? 'Y' : 'N'));

                    location.href = LotteCommon.orderFormUrl + "?" + $scope.baseParam + '&' + params.join('&') + $scope.getTclickParam(true, true, null, 4, null);
				});

			// 로그인되지 않은 경우
			} else {
                $scope.invQtyCheak(product.seq,function(){
                    $scope.goLoginFormForOrder([product.seq], groupInfo, hasMinorityLimit);
				});
				return;
			}
		};

		/**
		 * @ngdoc function
		 * @name checkMinorityLimit
		 * @description
		 * 19금 확인
		 * @param {boolean} hasMinorityLimit 19금 확인 필요여부
		 */
		$scope.checkMinorityLimit = function(hasMinorityLimit) {
			if (hasMinorityLimit) {
				if (!$scope.isAdultUser()) {
					alert('이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.');
					return;

				}else{
					$scope.goAdultSci('N');
					return;
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name goLoginFormForOrder
		 * @description
		 * 주문 시 로그인이 되지 않은 경우 로그인페이지로 이동
		 * @param {Object} cartSeqs 카트 시퀀스 배열
		 * @param {Object} groupInfo 그룹 정보
		 * @param {boolean} hasMinorityLimit 19금 확인 필요여부
		 */
		$scope.goLoginFormForOrder = function(cartSeqs, groupInfo, hasMinorityLimit) {
			var params = [];
			var imallYn = 'N';
			var fromPg = '';

			// 홈쇼핑인 경우
			if ($scope.GROUP_KEY_HOMESHOPPING == groupInfo.key) {
				// TODO ywkang2 : 공통코드 관련 프레임웍 처리 필요
				//                          - com.lotte.mobile.common.util.LotteUtil.IMALL_CART_BUY_LOGIN
				fromPg = 5;
				imallYn = 'Y';
			} else {
				// TODO ywkang2 : 공통코드 관련 프레임웍 처리 필요
				//                          - com.lotte.mobile.common.util.LotteUtil.CART_BUY_LOGIN
				fromPg = 2;
			}

			// 19금 상품 존재 여부
			if (hasMinorityLimit) {
				params.push('adultChk=Y');
			}

			params.push('fromPg=' + fromPg);
			params.push('imallYN=' + imallYn);
			params.push('cartSn=' + cartSeqs.join(':^:'));

			// 20170802 박형윤 (비로그인 상태) 장바구니 -> 로그인 -> 비회원 구매하기 -> 인증 -> 인증 실패 수정
			var goodsNoArr = [], goodsNoStr = "", i = 0;
			if (groupInfo && groupInfo.products && groupInfo.products.length > 0) {
				for (i; i < groupInfo.products.length; i++) {
					goodsNoArr.push(groupInfo.products[i].goodsNo);
					// console.log(groupInfo.products[i]);
				}

				goodsNoStr = goodsNoArr.join(":^:");
			}

			params.push('goods_no=' + goodsNoStr);

			params.push('minority_yn=' + (hasMinorityLimit ? 'Y' : 'N'));
			params.push('smp_buy_yn=N');
			params.push('smartOrd=' + ($scope.GROUP_KEY_SMARTPIC == groupInfo.key ? 'Y' : 'N'));
			params.push('targetUrl=' + encodeURIComponent(window.location.href,'UTF-8'));

			location.href = LotteCommon.loginForm + '?' + $scope.baseParam + '&' + params.join('&');
		};

		/**
		 * @ngdoc function
		 * @name goOrderAllChk
		 * @description
		 * 버버리 상품/일반 상품 동시 선택 체크
		 * 구찌,L.POINT,L-money 우선 순위 체크 후 goOrderAll() 로 리턴,
		 * 버버리 상품/일반 상품 동시 선택시 상품 유형 선택 레이어 팝업 띄우기
		 * 작성자 :김지호
		*/

		$scope.goOrderAllChk = function(){
			var selectedProducts = []; // 선택된 상품들
			var selectedGucciProducts = []; // 선택된 구찌 상품들
			var selectedLpointPrd = []; // 선택된 L.POINT 상품
			var selectedLmoneyPrd = []; // 선택된 L-money 상품
			$scope.selectedNotOnlyProducts = []; // 선택된 일반 상품들
			$scope.selectedBurberryProducts = []; // 선택된 버버리 상품들

			//20181008 GA태깅
			cartGaEvtTag.ga('장바구니주문','선택상품주문');

			angular.forEach($scope.groupInfos, function(groupInfo, groupKey) {
				if ($scope.GROUP_KEY_SOLDOUT !== groupInfo.key) {
					angular.forEach(groupInfo.products, function(product, idx) {
						// 선택된 상품
						if (product.is_checked) {
							selectedProducts.push(product);

							if(product.pnt_only_pay == '19'){//L.POINT 전용상품
								selectedLpointPrd.push(product);
							}else if(product.pnt_only_pay == '21'){//L-money 전용상품
								selectedLmoneyPrd.push(product);
							// 구찌상품 리스트에 담음
							} else if (product.is_gucci) {
								selectedGucciProducts.push(product);
							 //  버버리상품 리스트에 담음
							} else if(product.is_burberry){
								$scope.selectedBurberryProducts.push(product);
							// 일반상품 리스트에 담음
							} else {
								$scope.selectedNotOnlyProducts.push(product);
							}
						}
					});
				}
			});

			var conf, sltPrdIdx = selectedProducts.length; //선택된 상품 개수

			if((selectedLpointPrd.length > 0 && selectedLpointPrd.length != sltPrdIdx) ||(selectedLmoneyPrd.length > 0 && selectedLmoneyPrd.length != sltPrdIdx) || (selectedGucciProducts.length > 0 && selectedGucciProducts.length != sltPrdIdx)){
                $scope.goOrderAll();
			}else if($scope.selectedBurberryProducts.length > 0 && $scope.selectedBurberryProducts.length != sltPrdIdx){

				// 버버리 상품 섞여있는 경우 팝업 노출
				$scope.burberryOpenPop = true;
				$scope.dimmedOpen({
					target: 'BurberryPopup',
					callback: $scope.burberryPopClose
				});

			}else{
				$scope.goOrderAll();
			}

		}

		/**
		 * @ngdoc function
		 * @name burberryOrder
		 * @description
		 * 버버리상품 or 일반상품 선택 주문
		 * @param {string} type 선택 상품 타입
		*/
		$scope.burberryOrderFnc = function(type){
			switch(type){
				case "normal":
					// 일반상품을 제외한 버버리상품 선택 해제
					angular.forEach($scope.selectedBurberryProducts, function(product, idx) {
						product.is_checked = false;
						$scope.changeEachCheckbox(product, $scope.getGroupInfo(product.group_nm));
					});
					//$scope.selectedBurberryProducts(버버리상품 목록) 비우기
					$scope.selectedBurberryProducts = [];
				break;
				case "burberry":
						// 버버리상품을 제외한 일반상품 선택 해제
					angular.forEach($scope.selectedNotOnlyProducts, function(product, idx) {
						product.is_checked = false;
						$scope.changeEachCheckbox(product, $scope.getGroupInfo(product.group_nm));
					});
					//$scope.selectedNotOnlyProducts(일반상품 목록) 비우기
					$scope.selectedNotOnlyProducts = [];
				break;
			}

			$scope.dimmedClose();
			$scope.burberryOpenPop = false;

			//선택상품 구매 팝업 비노출을 위한 값
			$scope.burberryOrder = true;
			$timeout(function () {
				$scope.goOrderAll();
			}, 50);

		}

		/**
		 * @ngdoc function
		 * @name burberryPopClose
		 * @description
		 * 버버리/일반상품 동시 구매시 팝업 닫기
		*/
		$scope.burberryPopClose = function(){
			$scope.dimmedClose();
			$scope.burberryOpenPop = false;
		}

		/**
		 * @ngdoc function
		 * @name goOrderAll
		 * @description
		 * 선택된 상품 전체 주문
		 */
		$scope.goOrderAll = function() {
			var isNotVailedSelections = false; // 다른 그룹 선택 여부
			var selectedProducts = []; // 선택된 상품들
			var selectedProductSeqs = []; // 선택된 상품의 시퀀스들
			var selectedNotOnlyProducts = []; // 선택된 일반 상품들
			var selectedGucciProducts = []; // 선택된 구찌 상품들
			var selectedBurberryProducts = []; // 선택된 버버리 상품들
			var selectedLpointPrd = []; // 선택된 L.POINT 상품
			var selectedLmoneyPrd = []; // 선택된 L-money 상품
			var selectedGroupKey = ''; // 선택된 그룹키
			var hasMinorityLimit = false; // 19금 상품 존재 여부
			var isShowConfirm = true; // "선택된 상품을 주문하시겠습니까?" 컨펌 출력 여부
			var isQuickPrd = false;//퀵배송 상품 여부
            var goods_no_unit = ""; //선택된 상품번호만 조합
			var goods_no_flag = true;
            $scope.idneObj.allChk = true; // 20180710 소득공제 선택 상품 여부
			angular.forEach($scope.groupInfos, function(groupInfo, groupKey) {
				// 품절 그룹 제외
				if ($scope.GROUP_KEY_SOLDOUT !== groupInfo.key) {
					angular.forEach(groupInfo.products, function(product, idx) {
						// 선택된 상품
						if (product.is_checked) {
                            if(goods_no_flag){//20170223
                                goods_no_unit = product.goodsNo;
                                goods_no_flag = false;
                            }else{
                                goods_no_unit = goods_no_unit + ":" + product.goodsNo;
                            }

							selectedProducts.push(product);
							selectedProductSeqs.push(product.seq);

							if(product.pnt_only_pay == '19'){//L.POINT 전용상품
								selectedLpointPrd.push(product);
							}else if(product.pnt_only_pay == '21'){//L-money 전용상품
								selectedLmoneyPrd.push(product);
							// 구찌상품 리스트에 담음
							} else if (product.is_gucci) {
								selectedGucciProducts.push(product);
							// 일반상품 리스트에 담음
							} else {
								selectedNotOnlyProducts.push(product);
							}

							// 다른 그룹이 체크되었는지 확인하기 위함
							if (!isNotVailedSelections) {
								if (!selectedGroupKey) {
									selectedGroupKey = groupInfo.key;
								} else {
									if (selectedGroupKey != groupInfo.key) {
										// 다른 그룹이 선택되었음
										isNotVailedSelections = true;
									}
								}
							}

							// 19금 상품 조회 여부
							if ('Y' == product.minority_limit_yn) {
								hasMinorityLimit = true;
							}
							//퀵배송 상품일 경우
							if(product.quick_deli_yn == 'Y' && !isQuickPrd) isQuickPrd = true;
						}
					});
				}
			});

			var conf, sltPrdIdx = selectedProducts.length; //선택된 상품 개수

			// 선택된 상품이 없는 경우(일반상품, 구찌상품)
			if (0 == sltPrdIdx) {
				alert('상품을 선택하세요.');
				return;
			}

			// 다른 그룹이 선택되었는지 확인
			if (isNotVailedSelections) {
				// TODO ywkang2 : 레이어팝업으로 변경
				alert('고객님께서 선택하신 상품은\n한꺼번에 주문하실 수 없습니다.');
				return;
			}

			// 전용상품과 일반상품이 섞여있는 경우
			if(selectedLpointPrd.length > 0 && selectedLpointPrd.length != sltPrdIdx){
				conf = confirm('L.POINT 전용 상품은 일반상품과 함께 주문서작성/결제를 하실 수 없습니다.\nL.POINT 상품만 주문하시겠습니까?');
				selectedNotOnlyProducts = selectedNotOnlyProducts.concat(selectedLmoneyPrd);
				selectedNotOnlyProducts = selectedNotOnlyProducts.concat(selectedGucciProducts);
				selectedNotOnlyProducts = selectedNotOnlyProducts.concat(selectedBurberryProducts);
			}else if(selectedLmoneyPrd.length > 0 && selectedLmoneyPrd.length != sltPrdIdx){
				conf = confirm('L-money 전용 상품은 일반상품과 함께 주문서작성/결제를 하실 수 없습니다.\nL-money 상품만 주문하시겠습니까?');
				selectedNotOnlyProducts = selectedNotOnlyProducts.concat(selectedLpointPrd);
				selectedNotOnlyProducts = selectedNotOnlyProducts.concat(selectedGucciProducts);
				selectedNotOnlyProducts = selectedNotOnlyProducts.concat(selectedBurberryProducts);
			}else if (selectedGucciProducts.length > 0 && selectedGucciProducts.length != sltPrdIdx) {
				// TODO ywkang2 : 레이어팝업으로 변경
				conf = confirm('GUCCI 전문관 상품은  일반상품과 함께 주문서작성/결제를 하실 수 없습니다.\nGUCCI 상품만 주문하시겠습니까?');
				selectedNotOnlyProducts = selectedNotOnlyProducts.concat(selectedLpointPrd);
				selectedNotOnlyProducts = selectedNotOnlyProducts.concat(selectedLmoneyPrd);
				selectedNotOnlyProducts = selectedNotOnlyProducts.concat(selectedBurberryProducts);
			}

			if (conf) {
				// 전용 상품을 제외한 일반상품 선택 해제
				angular.forEach(selectedNotOnlyProducts, function(product, idx) {
					product.is_checked = false;
					$scope.changeEachCheckbox(product, $scope.getGroupInfo(product.group_nm));
				});

				// 선택된 시퀀스 재 조립
				selectedProductSeqs = [];
				angular.forEach(selectedGucciProducts, function(product, idx) {
					selectedProductSeqs.push(product.seq);
				});

				isShowConfirm = false;
                $scope.idneObj.idneChkY = false;
			} else if(conf==false) {
                $scope.idneObj.idneChkY = true;
				return;
			}


			// 주문 정보 유효성 검사 공통
			// 공통으로 유효성 검사를 할 시에는 같은 그룹이 상품이 선택된 것이 보장되어야 함
			// 현재 로직에서는 상위에서 기술된 로직으로 보장되고 있음
			var validationResult = $scope.isValidOrderInfo(selectedProducts);


			if (!validationResult.result) {
				return;
			} else {
				// 리턴으로 false를 받을 때만 대입함
				// true 일 경우도 대입한다면 현재 함수에서 받고있는 파라미터를 오버라이드 하게됨으로 주의
				if (!validationResult.is_show_confirm) {
					isShowConfirm = false;
				}

                if(validationResult.idneChk){
                    return;
                }
				// 시퀀스 재조립
				selectedProductSeqs = [];

				angular.forEach($scope.groupInfos, function(groupInfo, groupKey) {
					// 품절 그룹 제외
					if ($scope.GROUP_KEY_SOLDOUT !== groupInfo.key) {
						angular.forEach(groupInfo.products, function(product, idx) {

							// 선택된 상품
							if (product.is_checked) {
								selectedProductSeqs.push(product.seq);
							}
						});
					}
				});
			}
			// 선택된 상품이 없는 경우
			if (0 == selectedProductSeqs.length) {
				alert('상품을 선택하세요.');
				return;
			}

			//20180315 버버리 상품 레이어 팝업 노출시 "선택된 상품을 주문하시겠습니까?" 컨펌 미출력
			if($scope.burberryOrder){
				isShowConfirm = $scope.burberryOrder = false;
			}

			if(isQuickPrd && !checkQuick(selectedProducts)) return false;//퀵배송 체크

            //20170223
            pticketCheck(0, goods_no_unit, function(flag){
               if(flag){
                   return;
               }else{
                    // 유효한 경우 선택된 상품 전체 주문
                    $scope.goOrderAllIfValid(
                            $scope.getGroupInfo(selectedProducts[0].group_nm),
                            selectedProductSeqs,
                            hasMinorityLimit,
                            isShowConfirm
                    );
               }
            });
		};

		/**
		 * @ngdoc function
		 * @name goOrderAll
		 * @description
		 * 유효할 경우 선택된 상품 전체 주문
		 * @param {Object} groupInfo 그룹 정보
		 * @param {Object} cartSeqs 카트 시퀀스 배열
		 * @param {boolean} hasMinorityLimit 19금 확인 필요여부
		 * @param {boolean} isShowConfirm 컨펌창 출력 여부
		 */
		$scope.goOrderAllIfValid = function (groupInfo, cartSeqs, hasMinorityLimit, isShowConfirm) {
			// 로그인된 경우
			if ($scope.loginInfo.isLogin) {

				$scope.checkMinorityLimit(hasMinorityLimit);

				var params = [];
				var imallYN = 'N';

				if ($scope.GROUP_KEY_HOMESHOPPING == groupInfo.key) {
					imallYN = 'Y';
				}
				if (isShowConfirm && !confirm("선택된 상품을 주문하시겠습니까?")) {
					return;

				} else {
					$scope.invQtyCheak(cartSeqs.join(':^:'),function(){
                        params.push('imallYN=' + imallYN);
                        params.push('cartSn=' + cartSeqs.join(':^:'));

                        //eung
                        location.href = LotteCommon.orderFormUrl + "?" + $scope.baseParam + '&' + params.join('&') + $scope.getTclickParam(true, true, null, 5, null);
					});
				}

			// 로그인되지 않은 경우
			} else {
                $scope.invQtyCheak(cartSeqs.join(':^:'),function(){
                    $scope.goLoginFormForOrder(cartSeqs, groupInfo, hasMinorityLimit);
				});
				return;
			}
		};

		/**
		 * @ngdoc function
		 * @name goOrderAll
		 * @description
		 * 재 입고 알림 등록 요청
		 * @param {Object} product 상품 정보
		 */
		$scope.registRestockAlram = function(product) {
			//---------------------------------------------------
			// 재입고 알림 등록 서비스 요청
			//---------------------------------------------------

			//20181008 GA태깅
			cartGaEvtTag.ga('품절상품리스트','재입고알림',product.goodsNo);

			$http({
				method: 'POST',
				url: LotteCommon.systemRestockAlramData + '?' + $scope.baseParam + $scope.getTclickParam(true, true, null, 8, null),
				data: {
					mbr_no: $scope.loginInfo.mbrNo, // 회원번호
					spdp_goods_no: '', // 기획전 상품번호
					goods_no: product.goodsNo, // 상품번호
					item_no: product.itemNo, // 단품번호
					channel: '2' // (1:상품상세, 2:장바구니, 3:위시리스트)
				},
				transformRequest: transformJsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				var result_code = data.RESPONSE_CODE;
				var result_message = data.RESPONSE_MSG;
				var app_push_yn = data.APP_PUSH_YN;
				var result_phone_no = data.PHONE;

				if ('0000' == result_code) {
					$scope.openCireleSystemAlert(
						{type: 'alarmPop', app_push_yn: app_push_yn, phone: result_phone_no}
					);

				} else {
					alert(result_message);
				}
			})
			.error(function(ex) {
				alert('처리중 오류가 발생하였습니다.');
			});
		};

		/**
		 * @ngdoc function
		 * @name openSmartpicLocation
		 * @description
		 * 스마트픽 위치 팝업 띄우기
		 * @param {boolean} isNaverShow 네이버 지도 여부
		 * @param {Object} product 상품 정보
		 * @param {Object} event 클릭이벤트 정보
		 */
		$scope.openSmartpicLocation = function(isNaverShow, product, event) {
			var popupHeight = angular.element('#smartpicLocationPopupLayer').outerHeight();

			if (isNaverShow) {
				$scope.$broadcast('showNaverStoreMap', {
					goods_no: product.goodsNo,
					entr_no: product.pmg_entr_no,
					entr_contr_no: product.entr_contr_no,
					smp_ecoupon_yn: GOODS_SMP_NORMAL_ETC == product.smp_goods_type ? 'Y' : 'N'
				});

			} else {
				// 백화점 실물
				if (product.smp_goods_type ==  GOODS_SMP_EXCHANGE_DEP) {
					// 백화점 실물 AND 픽업유형이 '2' 또는 '3'
					if (product.smp_tp_cd == '2' || product.smp_tp_cd == '3') {
						isNaverShow = false;

					// 백화점 실물 AND 픽업유형ㄴ이 '2', '3' 외
					} else {
						isNaverShow = true;
					}

				// 로드샵 실물
				} else if (product.smp_goods_type ==  GOODS_SMP_EXCHANGE_ETC) {
					isNaverShow = true;
				}

				if (isNaverShow) {
					$scope.$broadcast('showNaverStoreMap', {
						goods_no: product.goodsNo,
						entr_no: product.pmg_entr_no,
						entr_contr_no: product.entr_contr_no,
						//entr_no: '10591',
						//entr_contr_no: '',
						smp_ecoupon_yn: GOODS_SMP_NORMAL_ETC == product.smp_goods_type ? 'Y' : 'N'
					});

				} else {
					var smp_deli_loc_info_array = product.smp_deli_loc_info.split(':^:');

					$scope.smpLocationInfo = getSmpLocationInfo(
							product.smp_tp_cd,
							product.smp_deli_loc_sn,
							product.smp_working_time,
							product.smp_deli_loc_nm,
							//product.smp_tp_cd == '2' ? smp_deli_loc_info_array[5] : smp_deli_loc_info_array[6],
							smp_deli_loc_info_array[6],
							event.pageY - (popupHeight / 2)
					);

					$scope.showSmartpicLocation(event, popupHeight);
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name showSmartpicLocation
		 * @description
		 * 스마트픽 위치 팝업 보이기
		 * @param {Object} event 클릭이벤트 정보
		 * @param {number} popupHeight 팝업 높이
		 */
		$scope.showSmartpicLocation = function(event, popupHeight) {
			// window.scrollTo(0, event.pageY - popupHeight - ((screen.height - popupHeight) / 2));
			$scope.isOpenedSmartpicLocation = !$scope.isOpenedSmartpicLocation;
			$scope.dimmedOpen({
				target: 'SmartpicLocation',
				callback: this.hideSmartpicLocation
			});
		};

		/**
		 * @ngdoc function
		 * @name hideSmartpicLocation
		 * @description
		 * 스마트픽 위치 팝업 숨기기
		 */
		$scope.hideSmartpicLocation = function() {
			$scope.dimmedClose();
			$scope.isOpenedSmartpicLocation = false;
		};

		/**
		 * @ngdoc function
		 * @name goWishList
		 * @description
		 * 위시리스트 화면으로 이동
		 */
		$scope.goWishList = function() {
			//20181008 GA태깅
			cartGaEvtTag.ga('위시리스트','위시리스트이동');

			location.href = '/mylotte/wish/m/wish_list.do?' + $scope.baseParam + $scope.getTclickParam(null, null, true, 1, null);
		};

		/**
		 * @ngdoc function
		 * @name goLateViewList
		 * @description
		 * 최근 본 상품 화면으로 이동
		 */
		$scope.goLateViewList = function() {
			//20181008 GA태깅
			cartGaEvtTag.ga('최근본상품','최근본상품이동');

			location.href = '/product/m/late_view_product_list.do?' + $scope.baseParam + $scope.getTclickParam(null, null, true, 2, null);
		};


		//----------------------------------------------------------------------------------------------------
		// 액션 - 공통
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name requestCheckLgFashionStockMng
		 * @description
		 * LG 패션 재고 체크
		 * @param {Object} product 상품정보
		 */
		$scope.requestCheckLgFashionStockMng = function(product) {
			var result = {
					isOk: false,
					message: ''
			};

        //  $http({
        //      method: 'POST',
        //      async: false,
        //      url: LotteCommon.baseUrl + '/popup/lg_fashion_stock_mng.do?' + $scope.baseParam,
        //      data: {
        //          goods_no: product.goodsNo,
        //          item_no: product.itemNo,
        //          entr_no: product.entr_no,
        //          ord_qty: product.qty
        //      },
        //      transformRequest: transformJsonToParam,
        //      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        //  })
        //  .success(function(data) {
        //      result = data;
        //    })
        //    .error(function(ex) {
        //      ajaxResponseErrorHandler(ex, function() {
        //          if (errorCallback) errorCallback();
        //      });
        //    });

			$.ajax({
				type: 'post'
				, async: false
				, url: '/popup/lg_fashion_stock_mng.do?' + $scope.baseParam
				, data: 'goods_no='+product.goodsNo+'&item_no='+product.itemNo+'&entr_no='+product.entr_no+'&ord_qty='+product.qty
				, success: function(response) {
					result.message = response;
					result.isOk = '' == response ? true : false;
				}
			});

			return result;
		};

		/**
		 * @ngdoc function
		 * @name requestCheckMangoStockMng
		 * @description
		 * 망고 실시간 재고 체크
		 * @param {Object} product 상품정보
		 */
        $scope.requestCheckMangoStockMng = function(product) {
        	var result = true;
        	var v_goods_no = '';
        	var v_item_no  = '';
        	var v_real_qty = '';
        	var cartObj    = {};

        	for (var i=0; i<product.length; i++) {
        		var sComma = "";

    			if (i != 0) {
    				sComma = "[!AND!]";
    			}

        		v_goods_no 		+= sComma + product[i].goodsNo;
        		v_item_no  		+= sComma + product[i].itemNo;
        		v_real_qty 		+= sComma + product[i].qty;

        		cartObj[product[i].goodsNo+product[i].itemNo] = product[i].seq;
        	}

        	$.ajax({
    			async: false,
    			type: "POST",
    			dataType:"json",
    			url: "/product/searchMangoRealtimeCheck.do?" + $scope.baseParam,
    			data: {
    				goods_no_list : v_goods_no,
    	 			item_no_list  : v_item_no,
    	 			real_qty_list : v_real_qty
    			},
    			success:function(data) {
    				if (data.count > 0) {
    					if( data.count == product.length ){
    						alert('선택하신 상품이 모두 품절되어 주문이\n불가합니다.');
    						angular.forEach(product, function(product, idx) {
    							if (product.is_checked) {
    									product.is_checked = false;//20180802 체크해제
    								$scope.changeEachCheckbox(product, $scope.getGroupInfo(product.group_nm));
    							}
    						});
    					} else {
    						alert('선택하신 상품 중 일부 상품이 품절되었습니다.\n품절 상품을 제외하고 선택됩니다.');
    						//var soldoutArr = data.list.match(/[0-9]+/g);
    						var soldoutArr = data.list;
        		    		var cartsnArr = [];

        		    		for ( var i=0; i < soldoutArr.length; i++ ) {
        		    			for ( var key in cartObj ) {
        		    				if ( soldoutArr[i] == key ) {
        		    					cartsnArr.push(cartObj[key]);
        		    				}
        		    			}
        		    		}

    						angular.forEach(product, function(product, idx) {
    							for ( var i=0; soldoutArr != null && i < cartsnArr.length; i++ ) {
    								if ( typeof cartsnArr[i] != 'undefined' && product.seq == cartsnArr[i] && product.is_checked ) {
    									product.is_checked = false;//20180802 체크해제
    									$scope.changeEachCheckbox(product, $scope.getGroupInfo(product.group_nm));
    								}
    							}
    						});
    					}

    					result = false;
    				}
    			},
    			error:function(request, status) {
    				//console.log('<<< 망고 실시간 재고체크 실패 >>>');
    			}
    		});

        	return result;
        };

		//----------------------------------------------------------------------------------------------------
		// 액션 - 카트상품 삭제
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name getCheckedProducts
		 * @description
		 * 선택된 상품
		 * @param {Object} groupInfo 그룹 정보
		 */
		$scope.getCheckedProducts = function(groupInfo) {
			return $filter('filter')(groupInfo.products, {is_checked: true});
		};

		/**
		 * @ngdoc function
		 * @name getCheckedProductSeqs
		 * @description
		 * 선택된 상품 시퀀스 목록
		 * @param {Object} groupInfo 그룹 정보
		 */
		$scope.getCheckedProductSeqs = function(groupInfo) {
			var result = [];
			angular.forEach($scope.getCheckedProducts(groupInfo), function(product, idx) {
				result.push(product.seq);
			});

			return result;
		};

		/**
		 * @ngdoc function
		 * @name getCheckedProductGoodsNos
		 * @description
		 * 선택된 상품 상품번호 목록
		 * @param {Object} groupInfo 그룹 정보
		 */
		$scope.getCheckedProductGoodsNos = function(groupInfo) {
			var result = [];

			angular.forEach($scope.getCheckedProducts(groupInfo), function(product, idx) {
				result.push(product.goodsNo);
			});

			return result;
		};

		/**
		 * @ngdoc function
		 * @name deleteMultiProduct
		 * @description
		 * 카트상품 다수 삭제
		 * @param {Object} groupInfo 그룹 정보
		 */
		$scope.deleteMultiProduct = function(groupInfo) {
			//20181008 GA태깅
			cartGaEvtTag.ga('장바구니리스트','선택삭제');	
			
			var seqs = $scope.getCheckedProductSeqs(groupInfo);

			$scope.deleteProduct(seqs, false, 'multi');
		}

		/**
		 * @ngdoc function
		 * @name deleteOneProduct
		 * @description
		 * 상품 한 개 삭제
		 * @param {number} seq 카트 시퀀스
		 */
		$scope.deleteOneProduct = function(seq) {
			$scope.deleteProduct([seq], false, 'one');
		};

		/**
		 * @ngdoc function
		 * @name deleteOneSoldoutProduct
		 * @description
		 * 품절/판매종료 상품 한 개 삭제
		 * @param {number} seq 카트 시퀀스
		 */
		$scope.deleteOneSoldoutProduct = function(seq) {
			//20181008 GA태깅
			cartGaEvtTag.ga('품절상품리스트','삭제');	

			$scope.deleteProduct([seq], true, 'soldout-one');
		};

		/**
		 * @ngdoc function
		 * @name deleteProduct
		 * @description
		 * 카트상품 삭제
		 * @param {number} seqs 카트 시퀀스 배열
		 * @param {boolean} isSoldout 품절/판매종료 여부
		 * @param {string} tclickFlag 티클릭 구분
		 */
		$scope.deleteProduct = function(seqs, isSoldout, tclickFlag) {
			// Validation - 상품이 선택되었는지 확인
			if (0 == seqs.length) {
				$scope.showInstantMessage('상품을 선택해 주세요.');
				return false;

			} else {
				var conf = confirm("상품을 삭제하시겠습니까?");
				if (!conf) return false;
			}
			$scope.requestDeleteProductBySeqs(seqs, tclickFlag, function(seqs) {

				// 그룹내에 해당 시퀀스 상품 삭제
				angular.forEach($scope.groupInfos, function(groupInfo, groupKey) {
					var groupProducts = groupInfo.products;

					for (var j = 0; j < groupProducts.length; j++) {
						var product = groupProducts[j];

						for (var k = 0; k < seqs.length; k++) {
							if (product.seq === seqs[k]) {
								groupProducts.splice(j, 1);
								j--;
								break;
							}
						}
					}
				});

				// 품절/판매종료 상품이 아닐 경우
				if (!isSoldout) {
					// 상품 전체 카운트 재계산
					$scope.cartItemTotalCount -= seqs.length;

					// 합계 재계산
					$scope.reCalcGroupSummary();
				}

				// //20171124 pnutAdCart remove 2017.11.28 ~ 2018.05.30 6개월간
				 pnutCollect("remove",seqs);
				$scope.alidoCollectLog('cartDel', $scope.alidoCartData, seqs); // ALIDO 수집스크립트 호출 시점 상품 삭제 서버 완료 후
			});
		};

		/**
		 * @ngdoc function
		 * @name deleteAllSoldoutProduct
		 * @description
		 * 품절 상품 전체 삭제
		 */
		$scope.deleteAllSoldoutProduct = function() {
			var conf = confirm("상품을 전체 삭제하시겠습니까?");
			if (!conf) return false;
			
			//20181008 GA태깅
			cartGaEvtTag.ga('품절상품리스트','전체삭제');

			var seqs = [];

			angular.forEach($scope.getSoldoutGroupInfo().products, function(product, idx) {
				seqs.push(product.seq);
			});

			$scope.requestDeleteProductBySeqs(seqs, 'soldout-all', function() {
				$scope.getSoldoutGroupInfo().products = [];
			});
		};

		/**
		 * @ngdoc function
		 * @name deleteAllSoldoutProduct
		 * @description
		 * 위시 시퀀스별 상품 삭제 서버서비스 요청
		 * @param {number} seqs 카트 시퀀스 배열
		 * @param {string} tclickFlag 티클릭 구분
		 * @param {function} successCallback 성공 시 콜백 함수
		 * @param {function} errorCallback 에러 시 콜백 함수
		 */
		$scope.requestDeleteProductBySeqs = function(seqs, tclickFlag, successCallback, errorCallback) {
			var tclickParam = '';

			// 유효상품 다수 삭제
			if ('multi' == tclickFlag) {
				tclickParam = $scope.getTclickParam(null, true, null, 2, null);

			// 품절/판매종료 상품 전체 삭제
			} else if ('soldout-all' == tclickFlag) {
				tclickParam = $scope.getTclickParam(true, true, null, 7, null);
			}

			$http({
				method: 'POST',
				url: LotteCommon.cartDeleteData + '?' + $scope.baseParam + tclickParam,
				data: {
					seqs: seqs.join(':^:')
				},
				transformRequest: transformJsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				$scope.showInstantMessage('삭제 되었습니다.');

				if (successCallback)
					successCallback(seqs);

				try {
					angular.element($window).trigger("refreshCartCount");
				} catch (e) {}
			})
			.error(function(ex) {
				// ajaxResponseErrorHandler(ex, function() {
				// 	if (errorCallback) errorCallback(seqs);
				// });

				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;

					alert(errorMsg);

					if ('9003' == errorCode) {
						var targUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
						location.href = LotteCommon.loginForm + '?' + targUrl;
					}
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}

				if (errorCallback) errorCallback(seqs);
			});
		};

		//----------------------------------------------------------------------------------------------------
		// 상품 유닛 셋팅(유효 상품)
		//----------------------------------------------------------------------------------------------------
		$scope.dispBanner = false;
		$scope.productListLoading = true;
		// Swipe List
		$scope.swipeList = false;

		/**
		 * @ngdoc function
		 * @name makeProductListUrl
		 * @description
		 * 상품 목록 요청 URL 생성
		 */
		$scope.makeProductListUrl = function() {
			++$scope.currentPageNo;

			var productListUrlParams = [];
			productListUrlParams.push('viewGoods=' + LotteStorage.getLocalStorage('latelyGoods'));
			productListUrlParams.push('amlist=' + LotteStorage.getLocalStorage('amlist'));

			var url = '';

			if ($scope.useTestData) {
				url = '/lotte/resources_dev/data/mylotte/cart/m/cart_data.json';
			} else {
				var _ts = '&_ts=' + Date.now(); // 20190110 로그인 후 뒤로가기 정책 수정건 afterjob
				url = LotteCommon.cartListData + '?' + $scope.baseParam + '&' + productListUrlParams.join('&') + _ts;
			}

			return url;
		};

		/**
		 * @ngdoc function
		 * @name cosemConvert
		 * @description
		 * cosem 수집 이미지 호출 스크립트
		 * @param {string} rn 장바구니번호_회원번호_디바이스구분
		 * @param {number} amt 전체금액 (숫자)
		 * @param {string} pc 상품코드_상품명
		 * @param {number} pa 상품수량 (숫자)
		 * @param {number} pp 상품단가 (숫자)
		 * @param {string} pg "장바구니" - 고정 텍스트
		 * @param {string} etc 기타
		 */
		function cosemConvert(rn, amt, pc, pa, pp, pg, etc) {
			var cosemProtocol = (location.protocol == "https:") ? "https:" : "http:";
			var image = new Image();
			var accountCode = "19"; // 닷컴 : 19, 엘롯데 : 320
			var imageURL = cosemProtocol + "//tracking.icomas.co.kr";
			imageURL += "/Script/action3.php?aid=" + accountCode + "&rn=" + encodeURI(rn);
			imageURL += "&amt=" + amt + "&pc=" + encodeURI(pc) + "&pa=" + pa + "&pp=" + pp + "&pg=" + encodeURI(pg) + "&etc=" + encodeURI(etc);
			image.src = imageURL;
		}

		/**
		 * @ngdoc function
		 * @name callCosm
		 * @description
		 * cosem 수집 스크립트
		 * @param {} prdLst 장바구니에 담긴 상품 리스트
		 */
		function callCosm(prdLst) { // 수집
			if (prdLst && prdLst.length > 0) {
				var i = 0;

				for (i = 0; i < prdLst.length; i++) {
					cosemConvert(
						prdLst[i].seq + "_" + ($scope.loginInfo.mbrNo ? $scope.loginInfo.mbrNo : "") + "_MO", // 장바구니번호_회원번호_디바이스구분
						prdLst[i].salePr * prdLst[i].qty, // 전체금액 (숫자)
						prdLst[i].goodsNo + "_" + prdLst[i].goodsNm, // 상품코드_상품명
						prdLst[i].qty, // 상품수량 (숫자)
						prdLst[i].salePr, // 상품단가 (숫자)
						"장바구니", // "장바구니" - 고정 텍스트
						i // etc 기타
					);
				}
			}
		}

		/**
		 * @ngdoc function
		 * @name pnutCollect
		 * @description
		 * pnutAdCart 수집 스크립트 2017.11.28 ~ 2018.05.30 6개월간
		 * @param type 실행 옵션 값
		 * @param seqs seq 값
		 */
		function pnutCollect(type,seqs) {

			// 피넛상품 초기화
			pnutAdCart.goods= {};
			pnutAdCart.goodsInfo = "";
			var products = [];

			angular.forEach($scope.loadedProductList, function (product, index) {
				for(var k = 0; k < seqs.length; k++ ){
					if(product.seq === seqs[k]){
						products.push([product.goodsNo, product.qty, product.speSaleAmt]);
						break;
					}
				}
			});


			pnutAdCart.setGoods(products);
			pnutAdCart.setAct(type);
			pnutAdCart.collect();
		}

		/**
		 * @ngdoc function
		 * @name loadMoreProduct
		 * @description
		 * 카트 상품 조회
		 */
		$scope.loadMoreProduct = function () {
			var win = $window;

			$http.get($scope.makeProductListUrl())
			.success(function (data) {
				$scope.alidoCartData = data // 알리도 수집 데이터 전달용 카트데이터 담기
				$scope.wishTotalCount = data.wish_total_count;
				$scope.recentViewTotalCount = data.recent_view_total_count;
				quick_dlv_msg = data.quick_dlv_msg; //퀵배송 메세지
				holiday = data.quick_dlv_holiday;//퀵배송(백화점 휴일 영업일:false)

				if (data.result) {
					Array.prototype.push.apply($scope.loadedProductList, data.result);

					angular.forEach($scope.loadedProductList, function (product, index) {
						var check = false;

						// GET방식으로 선택되도록 요청받은 상품을 선택
						if ($scope.hasRequestSelectGoodsNo(product.goodsNo)) {
							check = true;
						}

						// 일반 상품 목록
						if ($scope.GROUP_KEY_NORMAL == product.group_nm) {
							$scope.addProductInGroup($scope.GROUP_KEY_NORMAL, product);

							if (check) {
								$scope.changeEachCheckbox(product, $scope.getGroupInfo($scope.GROUP_KEY_NORMAL), true);
							}

						// 도서 상품 목록
						} else if ($scope.GROUP_KEY_BOOK == product.group_nm) {
							$scope.addProductInGroup($scope.GROUP_KEY_BOOK, product);

							if (check) {
								$scope.changeEachCheckbox(product, $scope.getGroupInfo($scope.GROUP_KEY_BOOK), true);
							}

						// 망고 상품 목록
						} else if ($scope.GROUP_KEY_MANGGO == product.group_nm) {
							$scope.addProductInGroup($scope.GROUP_KEY_MANGGO, product);

							if (check) {
								$scope.changeEachCheckbox(product, $scope.getGroupInfo($scope.GROUP_KEY_MANGGO), true);
							}

						// 스마트픽 상품 목록
						} else if ($scope.GROUP_KEY_SMARTPIC == product.group_nm) {
							$scope.addProductInGroup($scope.GROUP_KEY_SMARTPIC, product);

							if (check) {
								$scope.changeEachCheckbox(product, $scope.getGroupInfo($scope.GROUP_KEY_SMARTPIC), true);
							}

						// 홈쇼핑 상품 목록
						} else if ($scope.GROUP_KEY_HOMESHOPPING == product.group_nm) {
							$scope.addProductInGroup($scope.GROUP_KEY_HOMESHOPPING, product);

							if (check) {
								$scope.changeEachCheckbox(product, $scope.getGroupInfo($scope.GROUP_KEY_HOMESHOPPING), true);
							}

						// 품절 상품 목록
						} else if ($scope.GROUP_KEY_SOLDOUT == product.group_nm) {
							$scope.addProductInGroup($scope.GROUP_KEY_SOLDOUT, product);
						}

						if ($scope.GROUP_KEY_SOLDOUT != product.group_nm) {
							++$scope.cartItemTotalCount;
						}
					});

					// GET방식으로 선택되도록 요청받은 상품이 존재할 때 선택된 상품 재계산
					if ($scope.requestedSelectGoodsNos.length > 0) {
						$scope.reCalcGroupSummary();
					}


					// 쿠폰 정보
					$scope.couponPopupInfo.isShow = 'Y' == data.popup_view_yn;
					$scope.couponPopupInfo.couponNo = data.cpn_issu_no ? data.cpn_issu_no : '';
					$scope.couponPopupInfo.cookieName = data.cookie_name ? data.cookie_name.toUpperCase() : '';

					if ($scope.couponPopupInfo.isShow) {
						$scope.dimmedOpen({
							target: 'CouponPopup',
							callback: $scope.closeCouponPopup
						});
					}

					callAdbrix(); // adbrix 호출 추가
				}

				$scope.initLoadingProductList = true;

				// 크리테오
				// console.log(data.criteo_str);
				try {
					var criteo_str_arr = [],
						i = 0;

					if (data.result && data.result.length > 0) {
						for (i = 0; i < data.result.length; i++) {
							criteo_str_arr.push({
								id: data.result[i].goodsNo,
								price:data.result[i].salePr,
								quantity: data.result[i].qty
							});
						}
					}

					window.criteo_q.push(
						{ event: "setAccount", account: $scope.isEllotteWeb() ? '8586' : '2975' },
						{ event: "setSiteType", type: "m" },
						{ event: "viewBasket" , item: criteo_str_arr}
					);
				} catch (e) {}

				// ChlNo 값 (닷컴 - 모바일)
				var cosemChlNo = [
					"155032",
					"155033",
					"155034",
					"106832",
					"155430",
					"150827",
					"150828",
					"150829",
					"150924",
					"150925",
					"150926",
					"151327",
					"162524",
					"116924"
				];

				var chlNo = LotteCookie.getCookie("CHLNO");

				// Cosm 수집
				if (data.result && data.result.length > 0 && chlNo && cosemChlNo.indexOf(chlNo) > -1) {
					$timeout(function () {
						callCosm(data.result);
					}, 10);
				}

        		/**
        		 * 애드베이 데이터 전송
        		 */
        		function sendAdbayCart(){
        			if(window["adbayCartClass"] != undefined){

						/* 20180830  주영남
						* 404 에러 페이지 해결위해 장바구니에 상품 있는경우만 전송
						*/
						//console.log("loadedProductList %o",$scope.loadedProductList);
						if($scope.loadedProductList.length > 0) {
							var adbay = new adbayCartClass("lottecom");
							angular.forEach($scope.loadedProductList, function(product, index){
								adbay.setGoods(product.goodsNo, product.qty, product.speSaleAmt);
							});

							 adbay.setMethod("add");
							 adbay.send();
						}
        			}else{
        				$timeout(sendAdbayCart, 1000);
        			}
        		};

        		/**
        		 * 와이더플래닛 & 애드베이 모바일 스크립트
        		 */
        		$timeout(function(){
        			// wider planet
        			var items = [];
        			angular.forEach($scope.loadedProductList, function(product, index){
        				items.push({i:product.goodsNo, t:product.goodsNm});
        			});
        			$scope.addWiderPlanetLog("Cart", items);

        			// adbay
        			var body = document.getElementsByTagName("body")[0];
        			var scr = document.createElement("script");
        			scr.type = "text/javascript";
        			scr.src = "//script.about.co.kr/templates/script/cm/adbay.cart.controller.js";
        			body.appendChild(scr);
        			$("body").append('<div id="adbay_cart" style="display:none"></div>');

        			sendAdbayCart();
        		}, 3000);

        		/**
				 * BUZZNI 리타겟팅 스크립트 (Cart)
				 * 2017.03.24
				 */
				var arrGoodsNo = [];
				for(var i = 0; i<$scope.loadedProductList.length; i++){
					if(arrGoodsNo.length < 3){
						arrGoodsNo.push($scope.loadedProductList[i].goodsNo + '' || '');
					}else{
						break;
					}
				}
			    if($scope.sendBuzzni && !window.buzzni_rt_cart){
			    	$scope.sendBuzzni("cart", arrGoodsNo);
			    	window.buzzni_rt_cart = true;
			    }

			    /**
 				 * ACE 리타케팅 스크립트 (cart)
 				 * 적용 기간 : 2017.08.01 ~ 2018.01.31
 				 * 2017.07.28 고영우
 				 */
 				function aceRetargetingCart(){
 					if($('#aceRetargetingCart').length == 0){
 						var arrItems = [];
 						angular.forEach($scope.loadedProductList, function(product, index){
        					arrItems.push({
 								id: product.goodsNo/*ID값입력*/,
							    price:product.speSaleAmt/*가격정보입력*/,
							    quantity:product.qty/*갯수정보입력*/,
							    category:""/*카테고리 대|중|소*/,
							    imgUrl:product.imgUrl/*img링크값입력 ex)http://example.com/img/img.jpg*/,
							    name:product.goodsNm/*제품명또는 전환메뉴명입력*/,
							    desc:""/*상품상세 설명 text*/,
							    link:"http://m.lotte.com/product/m/product_view.do?goods_no=" + product.goodsNo/*상품상세페이지 URL ex)http://example.com/detail/product.html*/
 							});
        				});

 						var body = document.getElementsByTagName("body")[0];
 						var scr = document.createElement("script");
 						scr.type = "text/javascript";
 						scr.id = "aceRetargetingCart";
 						scr.src = "//static.tagmanager.toast.com/tag/view/830";
 						scr.onload = function(){
 							window.ne_tgm_q = window.ne_tgm_q || [];
 							window.ne_tgm_q.push({
 								tagType: 'cart',
 								device:'mobile'/*web, mobile, tablet*/,
 								uniqValue:'',
 								pageEncoding:'utf-8',
 								items : arrItems
 							});
 						}
 						body.appendChild(scr);
 					}
 				}
 				aceRetargetingCart();


				/**
				 * pnutAdCart 스크립트 처음 로드된 장바구니 상품 수집
				 * 적용 기간 : 2017.11.28 ~ 2018.05.30
				 * 2017.11.22 김지호
				 */

				 function adPnut(){
					var body = document.getElementsByTagName("body")[0];
 						var scr = document.createElement("script");
 						scr.type = "text/javascript";
 						scr.id = "adPnut";
 						scr.src = "//img.adpnut.com/script/pnut_cart_collector.js";
 						scr.onload = function(){
							pnutAdCart =  new pnutAdCart('lotte17');

							var adpProduct = [];
							angular.forEach($scope.loadedProductList, function(product, index){
								adpProduct.push([product.goodsNo, product.qty, product.speSaleAmt]);
        					});
							pnutAdCart.setGoods(adpProduct);
							pnutAdCart.collect();
 						}
						body.appendChild(scr);
						$("body").append('<div id="pnut_cart_collector_div" style="display:none"></div>');
				 }

				adPnut();
				
				/**
				 * groobee 스크립트 장바구니 로그수집
				 * 적용 기간 : 2018.12.26 ~ 2019.06.26
				 * 2018.12.19 고영우
				 */
				 function sendGroobee(){
					 try{
						 var arrProduct = [];
						 angular.forEach($scope.loadedProductList, function(product, index){
							 if(product.saleStatCd == '10'){
								arrProduct.push({
									name: product.goodsNm,
									code: product.goodsNo,
									cat: product.pmg_md_gsgr_no,
									amt: product.salePr * product.qty,
									cnt: product.qty
								});
							 }
     					 });
						 if(arrProduct.length){
							 groobee( "viewCart", { goods : arrProduct });
							// console.log(arrProduct );
						 }
					 }catch(e){}
				 }
				 sendGroobee();
			})
			.error(function (ex) {
				// ajaxResponseErrorHandler(ex, function() {});

				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;

					alert(errorMsg);

					if ('9003' == errorCode) {
						var targUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
						location.href = LotteCommon.loginForm + '?' + targUrl;
					}
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}
			});
		};


		//----------------------------------------------------------------------------------------------------
		// 초기화
		//----------------------------------------------------------------------------------------------------
		$scope.initGroupInfos();
		$scope.loadMoreProduct();
		$scope.requestedSelectGoodsNos = $scope.getUrlGoodsNosParam();

        //크로스픽 용 데이타 재로딩
        $scope.reloadProduct = function(){
            //console.log("reload--------------");
			$scope.initLoadingProductList = false;
            $scope.loadedProductList = []; // 로드된 유효 상품 전체 목록
            $scope.groupInfos = {}; // 상품 그룹 정보(그룹키:{그룹명, 그룹아이템})
            $scope.cartItemTotalCount = 0; // 품절상품을 제외한 총 개수
            $scope.wishTotalCount = 0; // 위시 총 개수
            $scope.recentViewTotalCount = 0; // 최근본상품 총 개수
            $scope.selectedProductCount = 0; // 그룹 전체에서 선택된 상품 수
            $scope.selectedProductFinalPriceSum = 0; // 그룹 전체에서 선택된 상품의 가격 합계
            $scope.selectedDeliveryFinalPriceSum = 0; // 그룹 전체에서 선택된 상품의 배송비 합계
            $scope.isOpenedSoldoutSection = false; // 품절/판매종료 상품 섹션이 오픈 여부
            $scope.isOpenedSmartpicLocation = false; // 스마트픽 위치보기 팝업 오픈 여부
            $scope.smpLocationInfo = {}; // 스마트픽 위치보기 팝업에 출력될 정보

            //$scope.groupInfo = {};
            $scope.initGroupInfos();
            $scope.loadMoreProduct();
            $scope.requestedSelectGoodsNos = $scope.getUrlGoodsNosParam();
		};

		// 닷컴/슈퍼 폴더앱
		// 슈퍼 장바구니 리스트 초기화
		$scope.superCartListInfo = {
			totalCnt: 0,
			goodsNm: "",
			goodsImgUrl: "",
			sumPrice: 0,
			cartGoodsList: []
		};

		//----------------------------------------------------------------------------------------------------
		// 화면 컨트롤 - 장보기몰 상품
		//----------------------------------------------------------------------------------------------------
		/**
		 * @ngdoc function
		 * @name toggleShoppingSection
		 * @description
		 * 장보기몰 상품 섹션 보이기
		 */
		$scope.viewShoppingSection = function() {
			$scope.isOpenedShopping = !$scope.isOpenedShopping;
			// $scope.isOpenedShopping = true;

			//20181008 GA태깅
			cartGaEvtTag.ga('장보기 장바구니','오늘장보기장바구니');
			$scope.getSuperCartList();
		};

		// 슈퍼 장보기몰 장바구니 연동
		$scope.getSuperCartList = function () {
			console.log("슈퍼 장바구니 리스트 가져오기");

			var paramsObj = {};

			$scope.getDeferLotteSuperPostParam(paramsObj).then(function (postParam) {
				var superCartListApiUrl = LotteCommon.SuperCartListData + '&_ts=' + Date.now(); // 20190110 로그인 후 뒤로가기 정책 수정건 afterjob
				var method = "post";

				// 로컬 테스트
				if (window.location.host.indexOf("localhost") > -1) {
					superCartListApiUrl = "/json/lottesuper/cart_list.json";
					method = "get";
				}

				$.ajax({
					url: superCartListApiUrl,
					method: method,
					data: postParam
				}).success(function (data) {
					if (typeof data == "string") {
						data = JSON.parse(data);
					}

					if (data.resultCode == "1" && data.cartGoodsList) {
						$scope.superCartListInfo.cartGoodsList = [];

						angular.forEach(data.cartGoodsList, function (value, key) {
							if (value.ADULT_GOODS_YN == "N" && // 성인상품 제외
								value.STOCK_QTY > 0  // 품절상품 제외
								// true // 판매종료 상품 제외
							) {
								$scope.superCartListInfo.cartGoodsList.push(value);

								if (!$scope.superCartListInfo.goodsNm) {
									$scope.superCartListInfo.goodsNm = (decodeURIComponent(value.GOODS_NM) + "").replace(/\+/gi, " ");
									$scope.superCartListInfo.goodsImgUrl = decodeURIComponent(value.PRODIMG_PATH);
								}

								$scope.superCartListInfo.sumPrice += (value.SALE_PRC * value.ORD_QTY);
							}
						});

						$scope.superCartListInfo.totalCnt = $scope.superCartListInfo.cartGoodsList.length;
					} else if (data.dotComAcceptCode == "-999") {
						alert("현재 오늘 장보기 서비스가 시스템 점검 중입니다. 이용에 불편을 드려 죄송합니다.");
					}
				});
			});
		};

		$scope.superCartUrlLink = function() {
			// 슈퍼로 이동하는 경로는 트래킹 코드가 아닌 채널코드로 해야함
			var superCartCHLNO = ($scope.appObj.isSuperApp) ? "M389209" : "M389189"; // 슈퍼 base : 닷컴 base
			if(!$scope.appObj.isApp){ superCartCHLNO = "M389473"; }
			$scope.gotoLotteSuperUrl(LotteCommon.SuperCartUrl, superCartCHLNO); // param (url, 채널)
		};

		// Adbrix Native APP 수집 추가 20180404
		function callAdbrix() {
			if ($scope.appObj.isApp) {
				if (($scope.appObj.isIOS && $scope.appObj.verNumber >= 4050) ||
					($scope.appObj.isAndroid && $scope.appObj.verNumber >= 408)) {
					var adbrixCartInfo = {},
						i = 0;

					adbrixCartInfo.prodList = [];

					// 일반상품 상위 10개 상품
					for (i = 0; i < $scope.getNormalGroupInfo().products.length; i++) {
						if (i < 10) {
							adbrixCartInfo.prodList.push({
								productId: $scope.getNormalGroupInfo().products[i].goodsNo,
								// $scope.getFormattedGoodsNmFromGroup(product)
								productName: $scope.getFormattedGoodsNm($scope.getNormalGroupInfo().products[i]),
								price: parseInt($scope.getNormalGroupInfo().products[i].basic_price),
								quantity: parseInt($scope.getNormalGroupInfo().products[i].qty)
							});
						} else {
							break;
						}
					}

					// 홈쇼핑 상품 상위 5개 상품 (getHomeshoppingGroupInfo().products)
					for (i = 0; i < $scope.getHomeshoppingGroupInfo().products.length; i++) {
						if (i < 5) {
							adbrixCartInfo.prodList.push({
								productId: $scope.getHomeshoppingGroupInfo().products[i].goodsNo,
								// $scope.getFormattedGoodsNmFromGroup(product)
								productName: $scope.getFormattedGoodsNm($scope.getHomeshoppingGroupInfo().products[i]),
								price: parseInt($scope.getHomeshoppingGroupInfo().products[i].basic_price),
								quantity: parseInt($scope.getHomeshoppingGroupInfo().products[i].qty)
							});
						} else {
							break;
						}
					}

					if (adbrixCartInfo.prodList.length > 0) {
						console.log("callAdbrix://cart?" + JSON.stringify(adbrixCartInfo));
						window.location.href = "callAdbrix://cart?" + JSON.stringify(adbrixCartInfo);
					}
				}
			}
		}
	}]);

	/**
	 * @ngdoc directive
	 * @name lotteContainer
	 * @description
	 * 본문 컨테이너 디렉티브
	 * @example
	 * <lotte-container></lotte-container>
	 */
	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/mylotte/cart/m/cart_container_2018.html',
			replace : true,
			link : function($scope, el, attrs) {

			}
		};
	});

	/**
	 * @ngdoc directive
	 * @name cartList
	 * @description
	 * 카트 그룹 목록 컨테이너 디렉티브
	 * @example
	 * <cart-list></cart-list>
	 */
	app.directive('cartList', function() {
		return {
			restrict: 'E',
			templateUrl: '/lotte/resources_dev/mylotte/cart/m/cart_list_container.html',
			replace: true,
			link: function($scope, el, attrs) {
				$scope.close_quickPop = function(){
					$('.commonPop.quick_layer').removeClass('on');
				}
			}
		};
	});

	/**
	 * @ngdoc directive
	 * @name cartGroup
	 * @description
	 * 카트 그룹 컨테이너 디렉티브
	 * @example
	 * <cart-group></cart-group>
	 */

	app.directive('cartGroup', ['$http', 'LotteCommon', 'LotteUtil','LotteCookie', 'LotteUserService', '$window', 'cartGaEvtTag', function($http, LotteCommon, LotteUtil, LotteCookie, LotteUserService, $window, cartGaEvtTag) {
		return {
			templateUrl : '/lotte/resources_dev/mylotte/cart/m/cart_group_container.html',
			replace : true,
			scope: {
				groupInfo: '=',
				toggleCheckAllItems: '&',
				changeEachCheckbox: '&',
				goGoodsDetail: '&',
				goOrder: '&',
				toggleGoodsOption: '&',
				deleteMultiProduct: '&',
				addWish: '&',
				changeSelectOptionItem: '&',
				openSmartpicLocation: '&',
				getFormattedGoodsNm: '&',
				isNotPrintGroup: '=',
				isSmartpic: '=',
				deleteOneProduct: '&',
				reloadFnc : '&',
				openHopePop: '=',
				isClass:'=' // 20180710 소득공제
				
			},
			link : function($scope, el, attrs) {
				
                //크로스픽 -----------------------------------------------------
                $scope.toggleGoodsPick = function(product, idx){
					if(idx >= 0){ //스마트픽찾기
						//20181008 GA태깅
						cartGaEvtTag.ga('일반상품리스트','스마트픽찾기');

                        //스마트픽찾기 창을 띄움
                        martIndex = idx;
                        $scope.google_map_url = LotteCommon.pickMapUrl;
                        $("#searchMartPop > iframe").attr("src", $scope.google_map_url);
                        $("#searchMartPop").show();
					}else{ //택배로 받기
						//20181008 GA태깅
						cartGaEvtTag.ga('스마트픽상품리스트','택배로찾기');

                        $scope.changeToDeliev(product);
                    }

				};

                //크로스픽지점 위치보기
                $scope.showPick = function(product){
					//20181008 GA태깅
					cartGaEvtTag.ga('스마트픽상품리스트','픽업위치');
					
                    var param = "crspk_yn=Y&crspk_corp_cd=" + product.crspk_corp_cd +
                        "&crspk_corp_str_sct_cd=" + product.crspk_corp_str_sct_cd +
                        "&crspk_str_no=" + product.crspk_str_no;
                    $scope.google_map_url = LotteCommon.pickMapUrl + "?" + param;
                    $("#searchMartPop > iframe").attr("src", $scope.google_map_url);
                    $("#searchMartPop").show();
                };


                //스마트픽 찾기 (지도 검색후)
				var crosspick_link = LotteCommon.pickCartUpdate;
				$scope.changeToSmp = function(product){
					crosspickParams.cart_sn = product.seq;
					//console.log(crosspickParams);
					//데이타 전송
					$http.get(
						crosspick_link,
						{params: crosspickParams}
					).success(function (data) {
						if(data.result.response_code == "0000"){
							//성공
							//alert("장바구니 스마트픽 탭으로 변경되었습니다.");
							$scope.reloadFnc();
						}else{
							alert(data.result.response_msg);
						}
					})
				}
				//택배로 찾기
				$scope.changeToDeliev = function(product){
					if (confirm("일반 택배 장바구니로 옮겨 담으시겠습니까?")) {
						crosspickParams = {
							"cart_sn" : product.seq,
							"crspk_yn" : "N",
							"crspk_corp_cd" : "",
							"crspk_corp_str_sct_cd" : "",
							"crspk_str_no" : ""
						}
						//데이타 전송
						$http.get(
							crosspick_link,
							{params: crosspickParams}
						).success(function (data) {
							if(data.result.response_code == "0000"){
								//성공
								//alert("장바구니 일반 탭으로 변경되었습니다.");
								$scope.reloadFnc();
							}else{
								alert(data.result.response_msg);
							}
						});
					}
				}

					/**
			         * @ngdoc function
			         * @name hopePop
			         * @description
			         * lg 희망일배송 안내 팝업 레이어 열고 닫기
			         * @example
			         * $scope.hopePop(openHopePop)
			         * @param {boolen} openHopePop 레이어 열기
			        */
				    $scope.hopePop = function(openHopePop){

						if(openHopePop){
							angular.element("body, html").css({"height":"auto","overflow":"auto"});
							angular.element($window).scrollTop($scope.wScroll);
						}else{
							$scope.wScroll = angular.element($window).scrollTop();
							angular.element("body, html").css({"height":"100%","overflow":"hidden"});
						}
						  $scope.openHopePop = (!openHopePop) ? true : false;

			  		}

				// 20170803 박형윤 장바구니 계속 보관하기 로그인 체크 오류로 수정
                // LotteUserService.loadLoginInfoComplete.then(function () {
				// 	$scope.loginInfo = LotteUserService.getLoginInfo();
				// });
				LotteUserService.promiseLoginInfo().finally(function (loginInfo) {
					$scope.loginInfo = LotteUserService.getLoginInfo();
                });

				/*20160303 장바구니 보관하기*/
				$scope.changeCartSave = function(item, flag) {
                	// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = LotteCommon.loginForm + '?' + targUrl;
        				return;
					}

					var link = LotteCommon.cartSave;

                    if (flag) { // 저장한다.
                        item.cart_save_flag  = "Y";
					}

                    //데이타 전송
                    $http.get(
                        link,
                        {params: {
                        	cartSn: item.seq
                        }}
                    ).success(function (data) {
                    	if(data.message.response_code == "Y"){
							//20181008 GA태깅
							cartGaEvtTag.ga('상품리스트','보관하기');

                    		alert( "결제하신 뒤에도 상품이 장바구니에 계속 보관됩니다");
                        }
					})
                };

                $scope.changeCartSaveCancel = function(item, flag){
                	//console.log(item);
                	var link = LotteCommon.cartCancel;
                    if(flag){
                        // 취소한다.
                        item.cart_save_flag  = "N";
                    }
                    //데이타 전송
                    $http.get(
                        link,
                        {params: {
                        	cartSn: item.seq
                        }}
                    ).success(function (data) {
                    	if(data.message.response_code == "Y"){
							//20181008 GA태깅
							cartGaEvtTag.ga('상품리스트','보관취소');

                    		alert( "계속 보관하지 않도록 상태를 변경하였습니다. 30일 후 장바구니에서 삭제됩니다");
                        }
					})
                };

                $scope.showCartsave = false;

				if (!LotteCookie.getCookie("CartsavePushDesc")) {
					$scope.showCartsaveDesc = true;
				}

				// 스타일 푸시 안내 레이어 감추기
				$scope.hideCartsavePushDesc = function () {
					$scope.showCartsaveDesc = false;
					LotteCookie.setCookie("CartsavePushDesc", "hide", 365);
				};
				//퀵배송 안내 팝업
				$scope.quickPopClk = function(){
					$('.commonPop.quick_layer').addClass('on');
				};
				//퀵배송 메세지
				$scope.quick_dlv_msg = quick_dlv_msg;
			},
			controller: 'CartGroupCtrl'
		};
	}]);

	app.controller('CartGroupCtrl', ['$scope', '$http', 'LotteCommon','cartGaEvtTag', function ($scope, $http, LotteCommon, cartGaEvtTag) {
		$scope.isCartDebug = false; // UI 디버깅용
		$scope.datePickerYn = false;
		$scope.datePickerInputOption = {};
		
		//----------------------------------------------------------------------------------------------------
		// 유틸
		//----------------------------------------------------------------------------------------------------
		/**
		 * 스마트픽 재고 유무
		 * E-COUPON상품이거나 매장재고 2개 이상(안전재고)
		 */
		$scope.hasSmartpicStock = function(product) {
            //@@크로스픽
            //크로스픽인경우 (false : 비활성화)
            if(product.crspk_yn =='Y'){
                return true;
            }

			if (!$scope.groupInfo.isSmpartpic) {
				return true;
			}

			var result = false;

			// E-COUPON상품
			if (product.goods_tp_cd == ST_STD_CD_GOODS_TP_CD_E_COUPON) {
				result = true;
			}

			// 매장재고 2개 이상(안전재고)
			if (product.smp_inv_qty > 0 && 'Y' == product.smp_psb_yn) {
				result = true;
			}

			return result;
		};


		/**
		 * 스마트픽상품 주문가능 여부
		 */
		$scope.isValidSmartpicOrder = function(product) {
			var result = true;

			if ($scope.isSmartpic) {
				if (product.is_overed_date_smartpic) {
					result = false;
				}

				if (!$scope.hasSmartpicStock(product)) {
					result = false;
				}
			}

			return result;
		}

		/**
		 * 티월드 구매 불가 상품인지 확인
		 */
		$scope.isNotSellForTworld = function(product) {
			return 'N' == product.tworld_sell_yn;
		};

		/**
		 * 모바일 구매 불가 상품인지 확인
		 */
		$scope.isNotSellOnMobile = function(product) {
			return !$scope.isNotSellForTworld(product) && 'Y' != product.sale_possible_yn;
		};

		/**
		 * 각각 상품의 주문가능 여부
		 */
		$scope.isValidEachOrder = function(product,opt) {
			var result = true;

			if (!$scope.isValidSmartpicOrder(product)) {
				result = false;
			}
			if(opt){
				if(product.quick_deli_yn == 'Y' && product.dept_main_inv_qty == 0) result = false;
			}

			return result;
		}

		/**
		 * 실물상품 여부(이쿠폰 아님)
		 *      - 백화점실물 OR 로드샵실물
		 */
		$scope.isNotECoupon = function(product) {
			if (!$scope.groupInfo.isSmpartpic) {
				return false;
			}

			var result = false;

			// 백화점실물
			if (product.smp_goods_type == GOODS_SMP_EXCHANGE_DEP) {
				result = true;
			}

			// 로드샵실물
			if (product.smp_goods_type == GOODS_SMP_EXCHANGE_ETC) {
				result = true;
			}

			return result;
		};

		/**
		 * 데이터피커 보이기
		 */
		$scope.datePickerOpen = function(inputOption) {
			$scope.datePickerYn = true;
			$scope.datePickerInputOption = inputOption;

//          if (inputOption.item_opt_value) {
//              $scope.datePickerInputOption.cdate = new Date(inputOption.item_opt_value);
//          } else {
//              $scope.datePickerInputOption.cdate = new Date();
//          }
		};

		/**
		 * 데이터피커 숨기기
		 */
		$scope.datePickerClose = function(currentDatePicker) {
			$scope.datePickerYn = false;
//          $scope.datePickerInputOption = {};
		};

		/**
		 * 상품명 포맷
		 *      - [브랜드명] 상품명
		 */
		$scope.getFormattedGoodsNmFromGroup = function(product) {
			return $scope.getFormattedGoodsNm({
				product: product
			});
		};

		/**
		 * 유효한 방문일자 여부
		 */
		$scope.invalidVisitDate = function(smpVisitDate, smpTdyEdtime) {
			var result = false;

			var today = new Date();
			var todayYmd = Number(today.toISOString().slice(0, 10).replace(/-/g, ''));
			var currentH = today.getHours();
			var currentM = today.getMinutes();
			var currentHM = (currentH < 10 ? '0' + currentH : currentH) + '' + (currentM < 10 ? '0' + currentM : currentM);

			var changedVisitYmd = Number(smpVisitDate);

			// 현재일자보다 전일자인 경우
			if (Number(smpVisitDate) < Number(todayYmd)) {
				result = true;

			// 현재일자와 같은 일자인 경우
			} else if (Number(smpVisitDate) == Number(todayYmd)) {
				// 방문가능시간이 현재시간보다 작거나 같은 경우
				if (Number(smpTdyEdtime) <= Number(currentHM)) {
					result = true;
				}
			}

			return result;
		};

		var dateFormatString = function(d) {

		}

		//----------------------------------------------------------------------------------------------------
		// 화면 컨트롤 - 체크박스
		//----------------------------------------------------------------------------------------------------
		/**
		 * 전체선택/전체해제 토
		 *      - 그룹 내 체크박스 컨트롤
		 */
		$scope.toggleCheckAllItemsFromGroup = function(e) {
			//20181008 GA태깅
			cartGaEvtTag.ga('장바구니리스트','전체선택');

			var isRentalPdt = false, quickPrdNum = 0, fishPrdNum = 0;
			angular.forEach($scope.groupInfo.products, function(product, key){
				if(!isRentalPdt && (product.ec_goods_artc_cd==30 || product.ec_goods_artc_cd==31)){
					isRentalPdt = true;
				}
				if(product.quick_deli_yn == 'Y') quickPrdNum++;
				if(product.cpcg_dlv_yn == 'Y') fishPrdNum++;
			});

			if(!isRentalPdt) {
				if((quickPrdNum && $scope.groupInfo.products.length != quickPrdNum) || (fishPrdNum && $scope.groupInfo.products.length != fishPrdNum)){
                    if(quickPrdNum && fishPrdNum) alert('런닝피쉬 상품 또는 퀵배송 상품은 일반상품과\n함께 주문하실 수 없습니다.');
                    if(quickPrdNum && !fishPrdNum) alert('퀵배송 상품은 다른 배송상품과\n함께 주문하실 수 없습니다.');
					if(!quickPrdNum && fishPrdNum) alert('런닝피쉬 상품은 다른 배송상품과\n함께 주문하실 수 없습니다.');
					e.target.checked = false;
				}else{
					$scope.toggleCheckAllItems({
						groupInfo: $scope.groupInfo,
						isDeselectAll: false
					});
				}
			}else{
				alert("렌탈 상품은 상담상품으로 구매가능한 상품이 아닙니다.\n구매하시는 상품에 렌탈상품이 포함되어 있는지 확인해주세요.");
				e.target.checked = false;
			}
		};

		/**
		 * 개별체크박스 클릭
		 *      - 그룹 내 체크박스 컨트롤
		 */
		$scope.chkRentProduct = function (product, e) {
			if (product.ec_goods_artc_cd == 30 || product.ec_goods_artc_cd == 31) {
				alert("렌탈상품은 상담상품으로 구매 가능한 상품이 아닙니다.\n상세보기 클릭하여 상품상세페이지에서 상담신청해주세요.");
				//e.target.checked = false;
				product.is_checked = false;
				e.preventDefault();
				return false;
			}
		};
		/**
		 * 개별체크박스 체크 변경
		 *    - 그룹 내 체크박스 컨트롤
		 */
		$scope.changeEachCheckboxFromGroup = function (product) {
			$scope.changeEachCheckbox({
				product: product,
				groupInfo: $scope.groupInfo
			});
		};

		/**
		 * 선택된 상품 삭제
		 *      - 그룹 내 상품만 대상
		 */
		$scope.deleteMultiProductFromGroup = function() {
			$scope.deleteMultiProduct({
				groupInfo: $scope.groupInfo
			});
		};

		//----------------------------------------------------------------------------------------------------
		// 화면 컨트롤 - 상품 옵션
		//----------------------------------------------------------------------------------------------------
		/**
		 * 상품 옵션 열기/닫기 토글
		 */
		$scope.toggleGoodsOptionFromGroup = function(product) {
			// 상품 주문 가능하지 않을 경우
			if (!$scope.isValidEachOrder(product)) {
				return;
			}

			//20181008 GA태깅
			cartGaEvtTag.ga('상품리스트','옵션/수량');

			$scope.toggleGoodsOption({
				product: product
			});
		};

		/**
		 * 상품 개수 1 감소
		 */
		$scope.minusQuantity = function(product) {
			if (!$scope.validUserOrderQuantity(product.qty_user - 1, product)) {
				return;
			}

			if (product.qty_user > 1) {
				product.qty_user -= 1;
			}
		};

		/**
		 * 상품 개수 1 증가
		 */
		$scope.plusQuantity = function(product) {
			if (!$scope.validUserOrderQuantity(product.qty_user + 1, product)) {
				return;
			}
			product.qty_user += 1;
			//20171124 pnutAdCart add 2017.11.28 ~ 2018.05.30 6개월간
			$scope.pnutCollect("add",product);
		};

		/**
		 * 재고수량, 최소수량, 최대수량 체크
		 */
		$scope.validUserOrderQuantity = function(userOrderQty, product) {
			var invQty = product.inv_qty ? Number(product.inv_qty) : 0;
			var minimumOrderQty = product.min_lmt_qty ? Number(product.min_lmt_qty) : 0;
			var maximumOrderQty = product.max_lmt_qty ? Number(product.max_lmt_qty) : 0;
			var isQuickPrd = product.quick_deli_yn=='Y'?true:false;
			invQty = isQuickPrd ? product.dept_main_inv_qty : invQty;

			// 재고 수량 체크
			if (invQty> 0 && userOrderQty > invQty) {
//                  $scope.showInstantMessage('재고가 부족합니다.');
				product.qty_user = invQty;
				if(isQuickPrd) alert('퀵배송 가능한 최대 구매 수량은 '+invQty+'개입니다');
				else alert('재고가 부족합니다.');
				return false;
			}

			// 단품 1일 최대 수량 체크
			if (maximumOrderQty > 0 && userOrderQty > maximumOrderQty) {
//                  $scope.showInstantMessage('1일 최대 ' + maximumOrderQty + '개 구매 가능한 상품입니다.');
				product.qty_user = maximumOrderQty;
				alert('1일 최대 ' + maximumOrderQty + '개 구매 가능한 상품입니다.');
				return false;
			}

			// 단품 1일 최소 수량 체크
			if (minimumOrderQty > 0 && userOrderQty < minimumOrderQty) {
//                  $scope.showInstantMessage('최소 ' + minimumOrderQty + '개 구매 가능한 상품입니다.');
				product.qty_user = minimumOrderQty;
				alert('최소 ' + minimumOrderQty + '개 구매 가능한 상품입니다.');
				return false;
			}

			return true;
		};

		/**
		 * 옵션 품절 여부,퀵배송일 경우 추가
		 */
		$scope.isSoldOption = function(optionItem,quick) {
			var isSoldOut = 0;
			//opt_stk_yn 품절,수량없음 > Y, 하위옵션없음 > N
			if(optionItem.opt_stk_yn != ''){
				if ((optionItem.opt_cnt && Number(optionItem.opt_cnt) == 0) || optionItem.opt_stk_yn == 'Y') {
					isSoldOut = 1;
				}else if(quick=='Y' && optionItem.cart_dept_main_inv_qty==0) isSoldOut = 2;//퀵배송일경우 재고없을 시
			}

			return isSoldOut;
		};

		/**
		 * 선택형 옵션이 품절일 경우의 텍스트
		 */
		$scope.getSoldOptionText = function(optionItem,quick) {
			var soldoutTxt = $scope.isSoldOption(optionItem,quick);
			if(soldoutTxt == 1) soldoutTxt = '(품절)';
			else if(soldoutTxt == 2) soldoutTxt = '(퀵불가)';
			else soldoutTxt = '';
			return soldoutTxt;
		};

		/**
		 * 선택형 옵션의 아이템 변경 이벤트
		 */
		$scope.changeSelectOptionItemFromGroup = function(product, changedOptionIdx) {
			$scope.changeSelectOptionItem({
				product: product,
				changedOptionIdx: changedOptionIdx
			});
		};

		/**
		 * 카트 옵션 변경
		 */
		$scope.updateCartGoodsOption = function(product, successCallback, errorCallback) {
			var changedItemNo = product.changedSelectOptionItemNo || product.itemNo; // 선택된 단품번호
			var selectOptions = product.select_options; // 선택형 옵션 리스트
			var inputOptions = product.input_options; // 입력형 옵션 리스트
			var availableOptionQty = -1; // 옵션 수량
			var isChangedOption = false; // 입력형옵션이나 선택형 옵션의 값이 변경되었는지 확인
			var changedInputOptionValArr = []; // 입력형옵션의 변경된 값 서버파라미터용으로 준비

			// TODO ywkang2 : 공통으로 분리 필요
			var SPLIT_GUBUN_3 = ";;;;;";

			//---------------------------------------------------
			// 구매수량 확인
			//---------------------------------------------------
			if(!$scope.validUserOrderQuantity(product.qty_user, product)) {
				return false;
			}

			//---------------------------------------------------
			// 선택형 옵션이 모두 선택되었는지 확인
			//  선택된 옵션의 구매가능수량 확인
			//---------------------------------------------------
			for (var i in selectOptions) {
				var option = selectOptions[i];

				// 선택형 옵션이 모두 선택되었는지 확인
				if(!option.selected_item_no) {
					alert(option.name + ' 옵션을 선택해주세요.');
					return;
				}

				// 선택된 옵션의 구매가능수량 확인
				if (option.item_no == changedItemNo) {
					availableOptionQty = option.opt_cnt;
				}
			}

			//---------------------------------------------------
			// 입력형 옵션이 입력되었는지 확인
			// 입력형 옵션이 변경되었는지 확인
			// 입력형 옵션 변경 값 조립
			//---------------------------------------------------
			for (var i in inputOptions) {
				var option = inputOptions[i];
				var optionVals = [];

				// 입력형 옵션이 입력되었는지 확인
				if (!option.item_opt_value) {
					alert(option.item_opt_name + ' 옵션을 입력해주세요.');
					return;
				}

				// 입력형 옵션이 변경되었는지 확인
				if (option.item_opt_value != option.ori_item_opt_value) {
					isChangedOption = true;
				}

				// 입력형 옵션 변경 값 조립
				optionVals.push(option.item_opt_type);
				optionVals.push(option.item_opt_name);
				optionVals.push(option.item_opt_value);
				changedInputOptionValArr.push(optionVals.join(':'));
			}


			//---------------------------------------------------
			// 선택형 옵션 품절 확인
			//---------------------------------------------------
			if (0 == availableOptionQty) {
				alert("선택하신 제품은 품절되었습니다.");
				return;
			}

			//---------------------------------------------------
			// 홈쇼핑인 경우 서버에 재고확인 요청
			//---------------------------------------------------
			if ($scope.groupInfo.isHomeShopping) {

			}

			//---------------------------------------------------
			// 선택형 옵션이 변경되었는지 확인
			//---------------------------------------------------
			if (product.changedSelectOptionItemNo && product.itemNo != product.changedSelectOptionItemNo) {
				isChangedOption = true;
			}

			//---------------------------------------------------
			// 옵션 업데이트
			//---------------------------------------------------

            var httpData = {
					goods_no: product.goodsNo,
					item_no: product.changedSelectOptionItemNo || product.itemNo,
					goods_cmps_cd: product.goods_cmps_cd,
					goods_choc_desc: changedInputOptionValArr.join(SPLIT_GUBUN_3),
					ord_qty: product.qty_user,
					master_goods_yn: '',
					cart_sn: product.seq,
					cmps_qty: "0",
					update_ck: isChangedOption
				}
            if(product.crspk_yn != undefined){
                    httpData.crspk_yn = product.crspk_yn;
                    httpData.crspk_corp_cd = product.crspk_corp_cd;
                    httpData.crspk_corp_str_sct_cd = product.crspk_corp_str_sct_cd;
                    httpData.crspk_str_no =  product.crspk_str_no;
            }

			$http({
				method: 'POST',
				url: LotteCommon.cartUpdateOptionData + '?' + $scope.baseParam,
				data: httpData,
				transformRequest: transformJsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				if (true) {
					// $scope.showInstantMessage('변경 되었습니다.');
					alert('변경 되었습니다.');

					// 선택된 옵션 텍스트 변경
					$scope.modifyGoodsOptionsDescription(product);

					//20171124 pnutAdCart update 2017.11.28 ~ 2018.05.30 6개월간
					 $scope.pnutCollect("update",product);
					if (successCallback) successCallback();
				} else {
					alert('처리중 오류가 발생하였습니다.');
					if (errorCallback) errorCallback();
				}
			})
			.error(function(ex) {
				// ajaxResponseErrorHandler(ex, function() {
				// 	if (errorCallback) errorCallback();
				// });

				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;

					alert(errorMsg);

					if ('9003' == errorCode) {
						var targUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
						location.href = LotteCommon.loginForm + '?' + targUrl;
					}
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}

				if (errorCallback) errorCallback();
			});
		};

		/**
		 * 선택된 옵션 요약 텍스트 교체
		 */
		$scope.modifyGoodsOptionsDescription = function(product) {
			var selectOptions = product.select_options;
			var inputOptions = product.input_options;
			var selectDescriptions = [];
			var inputDescriptions = [];

			// 선택형 옵션 요약
			angular.forEach(selectOptions, function(option, idx) {
				angular.forEach(option.item.items, function(item, idx) {
					if (option.selected_item_no == item.item_no) {
						selectDescriptions.push(option.name + ' : ' + item.opt_value);
						product.dept_main_inv_qty = item.cart_dept_main_inv_qty;
					}
				});
			});
			product.goodsOption = selectDescriptions.join(', ');

			// 입력형 옵션 요약
			angular.forEach(inputOptions, function(option, idx) {
				inputDescriptions.push(option.item_opt_name + ' : ' + option.item_opt_value);
			});
			product.goodsInputOption = inputDescriptions.join('<br/>');

			// 상품 수량
			product.qty = product.qty_user;

			// 합계 재계산
			$scope.changeEachCheckboxFromGroup(product);
			$scope.changeEachCheckboxFromGroup(product);
		};

		/**
		 * 스마트픽 픽업장소(매장위치) 변경 시 스마트픽 타입 변경
		 */
		$scope.changeSmpDeliLoc = function(product) {
			angular.forEach(product.smp_loc_list, function(option, idx) {
				if (Number(product.smp_deli_loc_sn) == option.smp_deli_loc_sn) {
					product.smp_tp_cd = option.smp_tp_cd;
				}
			});
		};

		//----------------------------------------------------------------------------------------------------
		// 액션 - 상품삭제
		//----------------------------------------------------------------------------------------------------
		/**
		 * 상품 한 개 삭제
		 */
		$scope.deleteOneProductFromGroup = function(seq) {
			$scope.deleteOneProduct({
				seq: seq
			});
		};

		//----------------------------------------------------------------------------------------------------
		// 액션 - 위시
		//----------------------------------------------------------------------------------------------------
		/**
		 * 위시 담기
		 */
		$scope.addWishFromGroup = function() {
			$scope.addWish({
				groupInfo: $scope.groupInfo
			});
		};

		//----------------------------------------------------------------------------------------------------
		// 액션 - 스마트픽 옵션변경(픽업장소, 방문예정일)
		//----------------------------------------------------------------------------------------------------
		/**
		 * 스마트픽 옵션 변경(픽업장소, 방문예정일)
		 */
		$scope.updateSmartpicOption = function(product) {
			if (!$scope.groupInfo.isSmpartpic) {
				return false;
			}

			if ($scope.invalidVisitDate(product.smp_visit_date_changed, product.smp_tdy_edtime)) {
				alert('유효한 방문예정일을 선택하세요.');
				return false;
			}

			// 장소변경
			$scope.requestUpdateSmartpicOption(product);
		};

		/**
		 * 스마트픽 옵션(픽업장소, 방문예정일) 변경 서버서비스 요청
		 */
		$scope.requestUpdateSmartpicOption = function(product, successCallback, errorCallback) {
			// console.log('cart_sn : ' + product.seq);
			// console.log('smp_tp_cd : ' + product.smp_tp_cd);
			// console.log('smp_deli_loc_sn : ' + product.smp_deli_loc_sn);
			// console.log('goods_no : ' + product.goodsNo);
			// console.log('item_no : ' + product.itemNo);
			// console.log('ord_qty : ' + product.qty);
			// console.log('smp_vst_shop_dt : ' + product.smp_visit_date);
			// console.log('smp_visit_date_changed : ' + product.smp_visit_date_changed);
			// return;

			$http({
				method: 'POST',
				url: LotteCommon.cartUpdateSmartpickOptionData + '?' + $scope.baseParam,
				data: {
					cart_sn: product.seq, // 카트번호
					smp_tp_cd: product.smp_tp_cd, // 스마트픽타입
					smp_deli_loc_sn: product.smp_deli_loc_sn, // 픽업장소
					goods_no: product.goodsNo, // 상품번호
					item_no: product.itemNo, // 단품번호
					ord_qty: product.qty, // 수량
					smp_vst_shop_dt: product.smp_visit_date_changed // 방문예정일
				},
				transformRequest: transformJsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				// $scope.showInstantMessage('변경 되었습니다.');
				alert('변경 되었습니다.');

				product.smp_visit_date = product.smp_visit_date_changed;

				if (!$scope.invalidVisitDate(product.smp_visit_date, product.smp_tdy_edtime)) {
					product.is_overed_date_smartpic = false;
				}

				if (successCallback) successCallback();
			})
			.error(function(ex) {
				// ajaxResponseErrorHandler(ex, function() {
				// 	if (errorCallback) errorCallback();
				// });

				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;

					alert(errorMsg);

					if ('9003' == errorCode) {
						var targUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
						location.href = LotteCommon.loginForm + '?' + targUrl;
					}
				} else {
					alert('처리중 오류가 발생하였습니다.');
				}

				if (errorCallback) errorCallback();
			});
		};

		//----------------------------------------------------------------------------------------------------
		// 액션 - 네비게이션
		//----------------------------------------------------------------------------------------------------
		/**
		 * 상품 상세 화면으로 이동
		 */
		$scope.goGoodsDetailFromGroup = function(product,idx) {
		
			$scope.goGoodsDetail({
				product: product,
				isSoldout: false,
				idx: idx
			});
		};

		/**
		 * 주문서 화면으로 이동
		 */
		$scope.goOrderFromGroup = function(product) {

            //모바일상품권 구매 대상 제어 20170223
            pticketCheck(0, product.goodsNo, function(flag){
               if(flag){
                   return;
               }else{
                    // 상품 주문 가능하지 않을 경우
                    if (!$scope.isValidEachOrder(product)) {
                        return;
                    }
                    if(product.quick_deli_yn == 'Y' && !checkQuick(product)) return false;//퀵배송 체크
					
					//20181008 GA태깅
					cartGaEvtTag.ga('상품리스트','바로구매');
					
                    $scope.goOrder({
                        product: product,
                        groupInfo: $scope.groupInfo
                    });
               }
            });
		};

		/**
		 * 스마트픽 위치 보기
		 */
		$scope.openSmartpicLocationFromGroup = function(isNaverShow, product, event) {
			//20181008 GA태깅
			cartGaEvtTag.ga('스마트픽상품리스트','픽업위치');

			$scope.openSmartpicLocation({
				isNaverShow: isNaverShow,
				product: product,
				event: event
			});
		};
		//퀵배송 상품 일반택배로 받기
		$scope.quickToDeli = function(product){
			if (confirm("일반 택배 장바구니로 옮겨 담으시겠습니까?")){
				var param = {
					goods_no: product.goodsNo,
					item_no: product.itemNo,
					goods_cmps_cd: product.goods_cmps_cd,
					ord_qty: product.qty_user,
					cart_sn: product.seq,
					qs_yn: 'N'
				}
				$http.get(LotteCommon.quickCartUpdate,{params: param})
				.success(function(data){
					if(data.result.response_msg=='success') $scope.reloadFnc();
					else alert(data.result.response_msg);
				});
			}
		}



	/**
		 * @ngdoc function
		 * @name pnutCollect
		 * @description
		 * pnutAdCart 수집 스크립트 2017.11.28 ~ 2018.05.30 6개월간
		 * @param type 실행 옵션 값
		 * @param seqs seq 값
		 */
		$scope.pnutCollect = function(type,product) {

			// 피넛상품 초기화
			pnutAdCart.goods= {};
			pnutAdCart.goodsInfo = "";
			var products = [];
			var qty = (type == "add") ? product.qty_user : product.qty;

			products.push([product.goodsNo, qty, product.speSaleAmt]);

			pnutAdCart.setGoods(products);
			pnutAdCart.setAct(type);
			pnutAdCart.collect();
		}

	}]);

	// datePicker
	app.directive('datePicker', ['$timeout','$window',function($timeout,$window) {
		return {
			replace:true,
			link : function(scope, el, attrs){
				scope.getFirstDay = function(year, month) { //첫째요일
					return new Date(year, month, 1).getDay();
				}
				scope.getLastDay = function(year, month) { //마지막날짜
					return new Date(year, month + 1, 0).getDate();
				}
				scope.addZero = function(n) {return n < 10 ? "0" + n : n;};
				scope.date = new Date();
				scope.now = new Date();
				scope.cdate = new Date(); //input current date
				scope.today = scope.now.getDate();
				scope.month = scope.now.getMonth();
				scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
				scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
				scope.dateHead = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

				scope.datePrev = function(obj){
					scope.date.setMonth(scope.date.getMonth() - 1);
					scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
					scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
					scope.makeDays();
				}
				scope.dateNext = function(e){
					scope.date.setMonth(scope.date.getMonth() + 1);
					scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
					scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
					scope.makeDays();
				}
				scope.makeDays = function(){
					scope.day = [];
					for (var i = 0 ; i < scope.firstDay ; i++) {
						scope.day.push(0-i);
					}
					for (var i = 0 ; i < scope.lastDay ; i++) {
						scope.day.push(i + 1);
					}
				}

				// 활성화된 날짜
				scope.isActiveDate = function(day) {
					var result = false;
					var calendarDate = new Date(scope.date.getFullYear() + "-" + scope.addZero(scope.date.getMonth() + 1) + "-" + scope.addZero(day));
					var inputOptionCdate = new Date(scope.datePickerInputOption.item_opt_formatted_value);

					if (inputOptionCdate) {
						result = calendarDate.getFullYear() == inputOptionCdate.getFullYear() && calendarDate.getMonth() == inputOptionCdate.getMonth() && calendarDate.getDate() == inputOptionCdate.getDate();
					}

					return result;
				};

				// 현재일자보다 이전일자 여부
				scope.isPastDate = function(day) {
					var result = false;
					var calendarDate = new Date(scope.date.getFullYear() + "-" + scope.addZero(scope.date.getMonth() + 1) + "-" + scope.addZero(day));
					var onDayMilli = 1000 * 60 * 60 * 24;

					return Math.round(calendarDate.getTime() / onDayMilli) < Math.round(scope.now.getTime() / onDayMilli);
				};

				scope.pick = function(i){
					// 이전일자 선택 방지
					if (scope.isPastDate(i)) {
						return;
					}

					scope.cdate.setDate(i);
					var ymd = scope.date.getFullYear() + "-" + scope.addZero(scope.date.getMonth() + 1) + "-" + scope.addZero(i);
					// $("#" + scope.datePickerState).val(ymd);
					scope.datePickerInputOption.item_opt_value = ymd.split('-').join('');
					scope.datePickerInputOption.item_opt_formatted_value = ymd;
					scope.datePickerClose();
				}
				scope.makeDays();
			}
		};
	}]);
})(window, window.angular);

/**
 * javascript form object를 url query string으로 변환
 * @param {Object} obj - {key1: value, key:[value, value]}
 */
// TODO ywkang2 : Angular 공통 처리 필요
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

/**
 * 스마트픽 장소정보 보기
 *      - 백화점 실물이고 픽업유형이 '2' 또는 '3' 인 경우
 * @param smp_tp_cd 픽업 구분
 * @param smp_deli_loc_sn 스마트픽 인도장소 일련번호
 * @param smp_shop_working_time 픽업 시간
 * @param smp_deli_loc_nm 스마트픽 인수장소명
 * @param smp_deli_loc_desc 스마트픽 인수장소 설명
 */
// TODO ywkang2 : Angular 공통 처리 필요
// 원본위치 : MO - /webapp/common3/smp_notice.jsp
//function show_smp_notice(smp_tp_cd, smp_deli_loc_sn, smp_shop_working_time, smp_deli_loc_nm, smp_deli_loc_desc) {
function getSmpLocationInfo(smp_tp_cd, smp_deli_loc_sn, smp_shop_working_time, smp_deli_loc_nm, smp_deli_loc_desc, page_top_location) {
	var sketch_img = 'http://image.lotte.com/lotte/mobile/mobile_new/common/new_'+smp_deli_loc_sn+'_deli_loc_map.jpg';

	var result = {
			smp_title: '',
			smp_shop_working_time: '',
			smp_deli_loc_nm: '',
			smp_deli_loc_desc: '',
			sketch_img_url: '',
			sketch_img_link: '',
			page_top_location: 0
	};

	result.sketch_img_url = sketch_img;
	result.sketch_img_link = sketch_img;
	result.smp_shop_working_time = smp_shop_working_time;
	result.smp_deli_loc_nm = smp_deli_loc_nm;
	result.smp_deli_loc_desc = smp_deli_loc_desc;
	result.page_top_location = page_top_location;

	if (smp_tp_cd == '2') {
		result.smp_title = '스마트픽 픽업 데스크 위치';
	}else if (smp_tp_cd == '3') {
		result.smp_title = '스마트픽 픽업 라커 위치';
	} else {
		result.smp_title = '스마트픽 픽업 데스크 위치';
	}

	return result;


//  var sketch_img = "http://image.lotte.com/lotte/mobile/mobile_new/common/new_"+smp_deli_loc_sn+"_deli_loc_map.jpg";
//
//  if (smp_tp_cd=='2'){
//      $('#smp_title').text('스마트픽 픽업 데스크 위치'); // 타이틀
//      $('#smp_shop_working_time').text(smp_shop_working_time); // 픽업가능시간
//  }else if (smp_tp_cd=='3'){
//      $('#smp_title').text('스마트픽 픽업 라커 위치'); // 타이틀
//      $('#smp_shop_working_time').text(smp_shop_working_time); // 픽업가능시간
//  }
//
//  $('#smp_deli_loc_nm').text(smp_deli_loc_nm); // 픽업위치안내
//
//  try{
//      $('.map_img a').find('a').prop("href", sketch_img); // 약도 이미지 링크
//      $('.map_img a img').prop("src", sketch_img); // 약도 이미지
//  }catch(err){
//      $('.map_img a').find('a').attr("href", sketch_img); // 약도 이미지 링크
//      $('.map_img a img').attr("src", sketch_img); // 약도 이미지
//  }
//
//  // 약도 정보
//  var map_info = smp_deli_loc_desc;
//  $('#map_info').html(map_info);
//
//
//  if (${is_mobile }){
//      dimmedOpen({target:"pickup_desk"});
//  }else{
//      dimmedOpen({target:"brch_location"});
//  }
//
//  $(".map_img").find("img").load(function(){
//      var tg = null;
//      var th = 300;
//      try{
//          th = $(".pickup_map").height();
//      }catch(e){}
//      if (${is_mobile}){
//          tg = $('#pickup_desk');
//      }else{
//          tg = $('#brch_location');
//      }
//      tg.css({"margin-top": -((parseInt(th)/2)) + "px"});
//  });

	/*
	if (${is_mobile }){ // 모바일이면
		$('#pickup_desk').css("top", Math.max(0, (($(window).height() - $('#pickup_desk').outerHeight()) / 2) + $(window).scrollTop()) + "px");
		$('#pickup_desk, #wrap_dimBg, #cover').show();
	}else{
		$('#brch_location').css("top", Math.max(0, (($(window).height() - $('#brch_location').outerHeight()) / 2) + $(window).scrollTop()) + "px");
		$('#brch_location, #wrap_dimBg').show();
	}

	$("#wrap_dimBg").css("position", "fixed");
	*/
}

//퀵 배송 체크
var checkQuick = function(product){
	var nowT = new Date();
	var hour = nowT.getHours(), min = nowT.getMinutes(), sec = nowT.getSeconds(), str = '';
	nowT = '' + (hour<10 ? '0'+hour:hour) + (min<10 ? '0'+min:min) + (sec<10 ? '0'+sec:sec);

	if(holiday){//백화점 휴무일일때
		str = 'holi';
	}else if(nowT < 090000 || 163000 < nowT){//09:00~16:30 에만 주문가능
		str = 'time';
	}
	var prdNum=0;
	if(product.length){//전체주문
		for(var i=0;i<product.length;i++){
			if(product[i].dept_main_inv_qty<product[i].qty){
				prdNum++;
			}
		}
		if(prdNum) str = 'qty';
	}else{//선택상품 주문
		if(product.dept_main_inv_qty<product.qty){
			str = product.dept_main_inv_qty+'';
		}
	}

	if(str.length){
		switch(str){
			case 'holi' : str = '공휴일 및 롯데백화점 본점 휴무일,\n배송마감일에는\n퀵 배송 주문이 불가합니다.';break;
			case 'time' : str = '퀵 배송 주문은 09:00 ~ 16:30에만 가능합니다.';break;
			case 'qty' : str = '퀵 배송 가능한 최대 구매 수량을\n초과하였습니다.';break;
			default : str = '퀵배송 가능한 최대 구매 수량은 '+str+'개입니다.';break;
		}
		alert(str);
		return false;
	}
	return true;
};
