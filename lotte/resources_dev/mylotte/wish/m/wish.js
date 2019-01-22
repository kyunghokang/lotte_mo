(function(window, angular, undefined) {
		'use strict';

		var app = angular.module('app', [
				'lotteComm',
				'lotteSrh',
				'lotteSideCtg',
				// 'lotteSideMylotte',
				'lotteCommFooter',
				'lotteUtil',
				'lotteNgSwipe'
		]);

		app.controller('wishCtrl', ['$scope', '$http', '$filter', 'LotteCommon', 'LotteCookie', 'LotteUtil', '$timeout', '$window', 'LotteStorage', 'commInitData', 'lotteNgSwipe', function($scope, $http, $filter, LotteCommon, LotteCookie, LotteUtil, $timeout, $window, LotteStorage, commInitData, lotteNgSwipe) {
			//----------------------------------------------------------------------------------------------------
				// 변수 선언
				//----------------------------------------------------------------------------------------------------
			$scope.useTestData = false; // 테스트용 데이터 사용여부(개발용)

			$scope.isWishDebug = false; // UI 디버깅용
			$scope.showWrap = true;
			$scope.contVisible = true;
			$scope.subTitle = '위시리스트'; // 서브헤더 타이틀
			$scope.screenId = 'wish'; // 화면ID

			$scope.itemCountPerPage = 20; // 페이지당 상품 출력 개수(디폴트:20)
			$scope.currentPageNo = 0; // 현재 페이지 번호(최초 상품 로딩 시 1로 셋팅되어서 호출됨)

			$scope.initLoadingProductList = false; // 유효상품 목록 초기로딩(비동기) 완료 여부

			$scope.loadedProductList = []; // 로드된 유효 상품 목록
			$scope.loadedSoldoutProductList = []; // 로드된 품절 상품 목록
			$scope.currentCategory = "";// 현재 카테고리
			$scope.currentCategoryName = "카테고리 전체";
			$scope.categoryList = [
				[
					{"ctg_nm":"전체보기",		"curDispNo":""},
					{"ctg_nm":"화장품",			"curDispNo":"5537261"},
					{"ctg_nm":"잡화/슈즈/명품",	"curDispNo":"5537262"},
					{"ctg_nm":"패션의류",		"curDispNo":"5537263"},
					{"ctg_nm":"스포츠/레저",	"curDispNo":"5537264"},
					{"ctg_nm":"유아동",			"curDispNo":"5537265"}
				],
				[
					{"ctg_nm":"가전/가구",		"curDispNo":"5537266"},
					{"ctg_nm":"생활/식품",		"curDispNo":"5537267"}
				]
			];
			$scope.categoryOpenState = false;
			$scope.categorySwipeIdx = 0;

			$scope.productTotalCount = 0; // 상품 총 개수
			$scope.soldOutProductTotalCount = 0; // 품절 상품 총 개수

			$scope.checkedGettingSmartPic = false; // 스마트픽찾기 선택 여부

			$scope.isSelectedAll = false; // 전체 선택 여부

			$scope.isOpenSoldoutSection = false; // 품절/판매종료 상품 섹션이 오픈 여부

			$scope.instantDelay = 2000; // 인스턴트 메시지 딜레이 타임(밀리쎄컨드)

			$scope.isShowNormalListLoadingBar = false; // 정상상품 로딩바 출력여부
			$scope.isShowSoldoutListLoadingBar = false; // 품절/판매종료상품 로딩바 출력여부

			$scope.historyBackFlag = 'HISTORY_BACK'; // 히스토리백인지 확인용
			$scope.quickDay = true; //퀵배송 날짜,시간

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

			// 쿠폰팝업 오픈할지 여부
			$scope.showCouponPopup = true;

			//----------------------------------------------------------------------------------------------------
			// 유틸 - 공통
			//----------------------------------------------------------------------------------------------------
			/**
			 * 티클릭 코드
			 */
			$scope.getTclickCode = function (isPrd, isBtn, isLnk, no, idx, page) {
				var screenID = 'wish'; // 티클릭용 스크린ID

				var result = $scope.tClickBase + screenID + '_Clk';

				result += isPrd ? '_Prd' : '';
				result += isBtn ? '_Btn' : '';
				result += isLnk ? '_Lnk' : '';
				result += no ? '_' + no : '';
				result += idx ? '_idx' + idx : '';
				result += page ? '_page' + page : '';

				return result;
			};

			/**
			 * 티클릭 파라미터
			 */
			$scope.getTclickParam = function (isPrd, isBtn, isLnk, no, idx, page) {
				return '&tclick=' + $scope.getTclickCode(isPrd, isBtn, isLnk, no, idx, page);
			};

			/**
			 * 로그인된 사용자가 성인인지 여부
			 */
			// TODO ywkang2 : 공통으로 빠져야 함
			$scope.isAdultUser = function() {
				return 'Y' == LotteCookie.getCookie('ADULTYN');
			};

			/**
			 * 공통 인스턴트 메시지 오픈(자동 닫힘)
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
			 * 쿠폰 팝업 닫기
			 */
			$scope.closeCouponPopup = function() {
				$scope.dimmedClose();
				$scope.couponPopupInfo.isShow = false;
			};

			/**
			 * 쿠폰 보이지 않기 - 몇일동안
			 */
			$scope.stopShowingCouponPopup = function(somDay) {
				var day = somDay || 1;
				var cookieValue = 'no';

				// 쿠키에 저장
				LotteCookie.setCookie($scope.couponPopupInfo.cookieName, cookieValue, day);

				$scope.closeCouponPopup();
			};

			/**
			 * 중복쿠폰 다운로드
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
				console.log(data);

				var isIssued = data.data_set.is_issued;
				var msg = data.data_set.result;

					alert(msg.replace('\\n', '\n'));

					if (isIssued) {
						$scope.stopShowingCouponPopup();
					}

						$scope.closeCouponPopup();
					})
					.error(function(ex) {
						ajaxResponseErrorHandler(ex, function() {});
						$scope.closeCouponPopup();
					});
			};



			//----------------------------------------------------------------------------------------------------
			// 유틸
			//----------------------------------------------------------------------------------------------------
			/**
			 * 상품 출력 순서(그룹에 상관없이 품절/판매종료를 제외한 전체)
			 */
			$scope.getProductSortNo = function(selectedProduct) {
				var result = 0;
				var no = 1;

				angular.forEach($scope.loadedProductList, function(product, idx) {
				// 상품번호, 단품번호 비교
					if (product.goodsNo == selectedProduct.goodsNo && product.itemNo == selectedProduct.itemNo) {
						result = no;
					} else {
						++no;
					}
				});

				return result;
			};

			/**
			 * 엘롯데 웹사이트 여부
			 */
			$scope.isEllotteWeb = function() {
				return LotteUtil.isEllotte();
			};

			/**
			 * 상품명 포맷
			 * 		- 롯데 : [브랜드명] 상품명
			 * 		- 엘롯데 : 상품명
			 */
			$scope.getFormattedGoodsNm = function(product) {
				var result = '';

				if (product.brand) {
					// 롯데
					if (!$scope.isEllotteWeb()) {
						result = '[' + product.brand + '] ';
					}
				}

				result += product.goodsNm;

				return result;
			};

			/**
			 * 엘롯데 브랜드 출력 여부
			 */
			$scope.isShowEllotteBrandNm = function(product) {
				return $scope.isEllotteWeb() && product.brand;
			};

			/**
			 * 인덱스로 상품 정보 리턴
			 */
			$scope.getProductByIndex = function(index) {
				return $scope.loadedProductList[index];
			}

			/**
			 * 옵션이 필요한 상품 여부
			 */
			$scope.isNeededOption = function(product) {
				var result = false;

				if (
						'Y' === product.item_mgmt_yn // 옵션상품
						||
					product.is_sale_promotion // 기획전형상품
				) {
					result = true;
				}

				return result;
			};

			/**
			 * 스마트픽찾기 선택 여부
			 */
			$scope.isCheckedSmartPic = function(product) {
				/*
				var result = false;

				if (
					('Y' === product.smp_psb_yn && product.is_checked_smartpic) // 스마트픽가능상품이고 스마트픽이 선택된 경우
					||
					'Y' === product.smp_only_yn // 스마트픽으로만 가능한 경우
				) {
					result = true;
				}

				return result;
				*/
				return product.is_checked_ship;
			};

			/**
			 * 추가로드할 유효상품이 있는지 확인
			 */
			$scope.existMoreItem = function() {
				return $scope.loadedProductList.length < $scope.productTotalCount;
			};

			/**
			 * 위시리스트 유효상품이 하나도 없는지 확인
			 */
			$scope.notExistWishItem = function() {
				return $scope.initLoadingProductList && $scope.loadedProductList.length == 0;
			};

			/**
			 * 위시리스트 품절상품이 하나도 없는지 확인
			 */
			$scope.notExistSoldoutWishItem = function() {
				return $scope.soldOutProductTotalCount == 0;
			};

			/**
			 * 위시리스트에 어떠한 상품도 없는지 확인
			 */
			$scope.notExistAnyWishItem = function() {
				return $scope.notExistWishItem() && $scope.notExistSoldoutWishItem();
			};

			/**
			 * 할인전가격, 할인후가격, 할인률 정보
			 */
			$scope.getPriceInfo = function(product) {
				var orignalPrice = 0;
				var discountedPrice = 0;
				var saleRate = 0;

				// 할인전가격, 할인후가격
				if (product.instCpnSalePrc) {
					discountedPrice = product.instCpnSalePrc;
					orignalPrice = product.speSaleAmt;

				} else {
					discountedPrice = product.speSaleAmt;

			if ('Y' == product.prcDifViewYn)	{
				orignalPrice = product.salePr;
			}
				}

				// 할인률
				if (0 != orignalPrice && 0 != discountedPrice && orignalPrice != discountedPrice) {
					saleRate = parseInt(
							((orignalPrice - discountedPrice) / orignalPrice) * 100
			);
				}

				return {
					original: orignalPrice,
				discounted: discountedPrice,
				sale_rate: saleRate
				};
			};

			$scope.getValidOrderQuantity = function(product) {
				var result = 1;

				// 구매수량 제한 여부
				if ('Y' == product.pur_qty_lmt_yn) {
					var msg = '';

					if (product.brand) {
						msg += '[' + product.brand + ']';
					}

					msg += product.goodsNm;

					// 최소 구매 수량
					if (product.min_lmt_qty > 1) {
						result = product.min_lmt_qty;
						alert(msg + ' 상품은 최소 ' + result + '개 이상 주문이 가능합니다.');
					}

//        		// 최대 구매 수량
//        		if (product.max_lmt_qty > 1) {
//        			result = product.max_lmt_qty;
//        			alert(msg + ' 상품은 최대 ' + qty + '개 이하 주문이 가능합니다.');
//        		}
				}

				return result;
			};



			//----------------------------------------------------------------------------------------------------
			// 화면 컨트롤 - 일반
			//------------------------ ---------------------------------------------------------------------------



			//----------------------------------------------------------------------------------------------------
			// 화면 컨트롤 - 유효상품 체크박스
			//----------------------------------------------------------------------------------------------------
			/**
			 * 전체선택/전체해제 토글
			 */
			$scope.toggleCheckAllItem = function(isDeselectAll) {
				$scope.isSelectedAll = isDeselectAll ? false : !$scope.isSelectedAll;

				angular.forEach($scope.loadedProductList, function(product, idx) {
					product.is_checked = $scope.isSelectedAll;
				});
			};

			/**
			 * 개별체크박스 체크 변경
			 */
			$scope.changeEachCheckbox = function(productIndex) {
				var isCheck = !$scope.getProductByIndex(productIndex).is_checked;

				$scope.getProductByIndex(productIndex).is_checked = isCheck;

				if (!isCheck) {
					$scope.isSelectedAll = isCheck;
				} else {
					var selectAll = true;

					angular.forEach($scope.loadedProductList, function(product, idx) {
						if (!product.is_checked) {
							selectAll = false;
						}
						});

					$scope.isSelectedAll = selectAll;
				}
			};



			//----------------------------------------------------------------------------------------------------
			// 액션 - 위시상품 삭제
			//----------------------------------------------------------------------------------------------------
			/**
			 * 선택된 유효 상품
			 */
			$scope.getCheckedProducts = function() {
				return $filter('filter')($scope.loadedProductList, {is_checked: true});
			};

			/**
			 * 선택된 유효 상품 시퀀스 목록
			 */
			$scope.getCheckedProductSeqs = function() {
				var result = [];

				angular.forEach($scope.getCheckedProducts(), function(product, idx) {
					result.push(product.seq);
				});

				return result;
			};

			/**
			 * 품절 상품 시퀀스 목록
			 */
			$scope.getSoldoutProductSeqs = function() {
				var result = [];

				angular.forEach($scope.loadedSoldoutProductList, function(product, idx) {
					result.push(product.seq);
				});

				return result;
			};

			/**
			 * 유효 위시상품 한 개 이외의 모든 상품 선택 해제
			 */
			$scope.uncheckAllExceptMe = function(meIndex) {
				$scope.toggleCheckAllItem(true);

				$scope.getProductByIndex(meIndex).is_checked = true;
			};

			/**
			 * 유효 위시상품 한 개 삭제
			 */
			$scope.deleteOneProduct = function(index, seq) {
				$scope.uncheckAllExceptMe(index);

				$scope.deleteProduct([seq], 'one');
			}

			/**
			 * 유효 위시상품 전체 삭제
			 */
			$scope.deleteAllProduct = function() {
				var conf = confirm("위시리스트 상품을 전체 삭제하시겠습니까?");
				if (!conf) return false;

				// 일반상품 전체 삭제
				$scope.requestDeleteProductByStat(false, 'all', function() {
					$scope.loadedProductList = [];
					$scope.productTotalCount = 0;
				});

				// 품절/판매종료 상품 전체 삭제
				// 품절/판매종료 상품이 있을 경우
				if ($scope.soldOutProductTotalCount > 0) {
					$scope.deleteAllSoldoutProduct(true);
				}
			}

			/**
			 * 유효 위시상품 다수 삭제
			 */
			$scope.deleteMultiProduct = function() {
				var itemSeqs = $scope.getCheckedProductSeqs();

				$scope.deleteProduct(itemSeqs, 'multi');
			}

			/**
			 * 유효 위시상품 삭제
			 */
			$scope.deleteProduct = function(itemSeqs, tclickFlag) {
				// Validation - 상품이 선택되었는지 확인
				if (0 == $scope.getCheckedProducts().length) {
					$scope.showInstantMessage('상품을 선택해 주세요.');
					return false;

				} else {
					var conf = confirm("상품을 삭제하시겠습니까?");
					if (!conf) return false;
				}

				$scope.requestDeleteProductBySeqs(itemSeqs, tclickFlag, function(seqs) {
					for (var i = 0; i < $scope.loadedProductList.length; i++) {
						var product = $scope.loadedProductList[i];

						for (var j = 0; j < seqs.length; j++) {
							if (product.seq === seqs[j]) {
								$scope.loadedProductList.splice(i, 1);
								i--;
								break;
							}
						}
					}

					$scope.productTotalCount -= seqs.length;
				});
			};


			/**
			 * 품절 위시상품 한 개 삭제
			 */
			$scope.deleteOneSoldoutProduct = function(index, seq) {
				var conf = confirm("상품을 삭제하시겠습니까?");
				if (!conf) return false;

				$scope.requestDeleteProductBySeqs([seq], 'soldout-one', function() {
					$scope.loadedSoldoutProductList.splice(index, 1);
				});
			};

			/**
			 * 품절 위시상품 전체 삭제
			 */
			$scope.deleteAllSoldoutProduct = function(isNotShowConfirm) {
				if (!isNotShowConfirm) {
					var conf = confirm("상품을 전체 삭제하시겠습니까?");
					if (!conf) return false;
				}

				$scope.requestDeleteProductByStat(true, 'soldout-all', function() {
					$scope.loadedSoldoutProductList = [];
					$scope.soldOutProductTotalCount = 0;
				});
			};

			/**
			 * 위시 시퀀스별 상품 삭제 서버서비스 요청
			 */
			$scope.requestDeleteProductBySeqs = function(seqs, tclickFlag, successCallback, errorCallback) {
				var seqParams = seqs.join(',');
				var tclickParam = '';

				// 유효상품 선택 삭제
				if ('multi' == tclickFlag) {
					tclickParam = $scope.getTclickParam(null, true, null, 1, null);
					$scope.sendTclick($scope.getTclickCode(null, true, null, 1, null));

				// 유효상품 1개 삭제
				} else if ('one' == tclickFlag) {
					tclickParam = $scope.getTclickParam(null, true, null, 3, null);
					$scope.sendTclick($scope.getTclickCode(null, true, null, 3, null));
				}

				$http({
					method: 'POST',
					url: LotteCommon.wishDeleteData + '?' + $scope.baseParam + tclickParam,
					data: {
						goods_seqs: seqParams
					},
					transformRequest: transformJsonToParam,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.success(function(data) {
					var deleteCount = data.result_count || 0;

					if (deleteCount > 0) {
						$scope.showInstantMessage('삭제 되었습니다.');

						if (successCallback) successCallback(seqs);

					} else {
						ajaxResponseFailHandler(function() {
							if (errorCallback) errorCallback(seqs);
						});
					}
				})
				.error(function(ex) {
					ajaxResponseErrorHandler(ex, function() {
						if (errorCallback) errorCallback(seqs);
					});
				});
			};

			/**
			 * 위시 상태별 전체 상품 삭제 서버서비스 요청
			 */
			$scope.requestDeleteProductByStat = function(isSoldout, tclickFlag, successCallback, errorCallback) {
				var tclickParam = '';

				// 유효상품 전체 삭제
				if ('all' == tclickFlag) {
					tclickParam = $scope.getTclickParam(null, true, null, 2, null);
					$scope.sendTclick($scope.getTclickCode(null, true, null, 2, null));
				}

				$http({
					method: 'POST',
					url: LotteCommon.wishDeleteAllByStatData + '?' + $scope.baseParam + tclickParam,
					data: {
						soldout_yn: isSoldout ? 'Y' : 'N'
					},
					transformRequest: transformJsonToParam,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.success(function(data) {
					var deleteCount = data.result_count || 0;

					if (deleteCount > 0) {
						$scope.showInstantMessage('삭제 되었습니다.');

						if (successCallback) successCallback(isSoldout);

					} else {
						ajaxResponseFailHandler(function() {
							if (errorCallback) errorCallback(isSoldout);
						});
					}
				})
				.error(function(ex) {
					ajaxResponseErrorHandler(ex, function() {
						if (errorCallback) errorCallback(isSoldout);
					});
				});
			};



			//----------------------------------------------------------------------------------------------------
			// 액션 - 장바구니
			//----------------------------------------------------------------------------------------------------
			/**
			 * 옵션이 필요한 상품인지 확인하여 그렇다면 상품 상세 화면으로 이동
			 */
			$scope.isNeededOptionIfSoGoGoodsDetailView = function(product, tclickFlag) {
				if ($scope.isNeededOption(product)) {
					alert('이 상품은 옵션이 있는 상품입니다.\n상품상세에서 옵션을 선택해 주세요.');
					$scope.goGoodsDetail(product, false, tclickFlag);
					return true;
				}

				return false;
			};

			/**
			 * 스마트픽찾기가 선택되었는지 확인하여 그렇다면 상품 상세 페이지로 이동
			 */
			$scope.checkedGettingSmartPicIfSoGoGoodsDetailView = function(product, tclickFlag) {
				if ($scope.isCheckedSmartPic(product) == 1) {
					alert('스마트픽 찾기를 선택하셨습니다.\n상품상세에서 옵션(예약정보)을 선택해 주세요.');
					$scope.goGoodsDetail(product, false, tclickFlag);
					return true;
				}

				return false;
			};


			/**
			 * 장바구니 추가 가능 여부 확인
			 */
			$scope.avaliableAddCart = function(product) {
				// TOBE 로직 적용
				// 		ㄱ. TOBE에서는 위시리스트에는 옵션이 없음
				//		ㄴ. 옵션이 필요한 상품은 상품 상세화면으로 이동시켜야 함
				//			- 옵션상품, 기획전형상품, 스마트픽상품

				// 옵션이 필요한 상품인지 확인
				if ($scope.isNeededOptionIfSoGoGoodsDetailView(product, 'cart')) {
					return false;
				}

				// "스마트픽찾기"가 선택되었는지 확인
				if ($scope.checkedGettingSmartPicIfSoGoGoodsDetailView(product, 'cart')) {
					return false;
				}

				return true;
			};

			/**
			 * 장바구니 추가 서버서비스 요청
			 */
            $scope.addCart = function(index, successCallback, errorCallback){
                var product = $scope.getProductByIndex(index);
                //모바일상품권 구매 대상 제어 20170223
                pticketCheck(0, product.goodsNo, function(flag){
                   if(flag){
                       return;
                   }else{                
                       $scope.addCart2(index, successCallback, errorCallback);
                   } 
                });                            
            }
			$scope.addCart2 = function(index, successCallback, errorCallback) {
				$scope.uncheckAllExceptMe(index);

				var product = $scope.getProductByIndex(index);

				if (!$scope.avaliableAddCart(product)) {
					return;
				}

				var quickSlt = 'N';
				if(product.is_checked_ship==2 && $scope.artQuick(product,index)) quickSlt = 'Y';

				var qty = 1;
//        	qty = $scope.getValidOrderQuantity(product);
				$scope.sendTclick($scope.getTclickCode(null, true, null, 4, null));
				
				$http({
					method: 'POST',
					url: LotteCommon.cartAddFromWishData + '?' + $scope.baseParam + $scope.getTclickParam(null, true, null, 4, null),
					data: {
						goods_no: product.goodsNo,
						item_no: product.itemNo,
						goods_choc_desc: product.goodsChocDesc,
						goods_cmps_cd: product.goodsCmpsCd,
						ord_qty: qty,
						infw_disp_no: product.infwDispNo,
	//					mast_disp_no: '',
						infw_disp_no_sct_cd: product.infwDispNoSctCd,
						conr_no: product.conrNo,
	//					shop_memo_tp_cd: '',
	//					shop_memo_cont: '',
						smp_vst_shop_no: product.smpVstShopNo,
						smp_vst_rsv_dtime: product.smpVstRsvDtime,
						smp_tp_cd: product.smp_tp_cd,
						smp_deli_loc_sn: product.smp_deli_loc_sn,
						smp_prod_yn: product.smp_only_yn,
						cart_sct_cd: 10,
						master_goods_yn: 'Y',
						qs_yn : quickSlt
	//					cmps_qty: '',
	//					cart_sn: '',
	//					cart_no: ''
					},
					transformRequest: transformJsonToParam,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.success(function(data) {
					var result = data.result;

					if (result) {
						// TODO ywkang2 : 장바구니 담긴 후 푸터의 카트 뱃지 카운트 업데이트 확인
						$scope.openCireleSystemAlert(
								{type: 'cartPop'}
						);

					if (successCallback) successCallback(index);

					} else {
						ajaxResponseFailHandler(function() {
							if (errorCallback) errorCallback(index);
						});
					}

					try {
						angular.element($window).trigger("refreshCartCount");
					} catch (e) {}
				})
				.error(function(ex) {
					ajaxResponseErrorHandler(ex, function() {
						if (errorCallback) errorCallback(index);
					}, product);
				});
			};



			//----------------------------------------------------------------------------------------------------
			// 액션 - 네비게이션
			//----------------------------------------------------------------------------------------------------
			// TODO ywkang2 : 상품유닛 공통모듈에서 처리될 예정
			/**
			 * 상품 상세 화면으로 이동
			 */
			$scope.goGoodsDetail = function(product, isSoldout, tclickFlag) {
				var wish_lst_sn = '';
				var item_no = '';

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
//        			goAdultSci();
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
				params.push('wish_lst_sn=' + wish_lst_sn);
				params.push('item_no=' + item_no);

				var tclickParam = '';

				if (!isSoldout) {
					// 상품상세 클릭
					if ('goods' == tclickFlag) {
						tclickParam = $scope.getTclickParam(true, null, null, null, $scope.getProductSortNo(product));

					// 장바구니 버튼 클릭
					} else if ('cart' == tclickFlag) {
						tclickParam = $scope.getTclickParam(null, true, null, 4, null);
						$scope.sendTclick($scope.getTclickCode(null, true, null, 4, null));

				// 바로주문 버튼 클릭
					} else if ('order' == tclickFlag) {
						tclickParam = $scope.getTclickParam(null, true, null, 5, null);
						$scope.sendTclick($scope.getTclickCode(null, true, null, 5, null));
					}
				}

				// 히스토리 백으로 들어온 것인지 확인하기 위함
				window.location.hash = $scope.historyBackFlag;
				$timeout(function() {
					location.href = '/product/m/product_view.do?' + $scope.baseParam + '&' + params.join('&') + tclickParam;
				}, 1000);
			};

			/**
			 * 주문서 화면으로 이동
			 */
			$scope.goOrder = function(index) {
				var product = $scope.getProductByIndex(index);

				// 옵션이 필요한 상품인지 확인
				if ($scope.isNeededOptionIfSoGoGoodsDetailView(product, 'order')) {
					return;
				}

				// "스마트픽찾기"가 선택되었는지 확인
				if ($scope.checkedGettingSmartPicIfSoGoGoodsDetailView(product, 'order')) {
					return;
				}

				var quickSlt = 'N';
				if(product.is_checked_ship==2 && $scope.artQuick(product,index)) quickSlt = 'Y';

				// T월드 구매불가 상품인지 확인
				if ('N' == product.tworld_sell_yn) {
					alert('T월드 모바일 구매불가 상품입니다.');
					return;
				}

				// 모바일 구매불가 상품인지 확인
				if ('N' == product.sale_possible_yn) {
					alert('모바일 구매 불가상품 입니다.');
					return;
				}

				var qty = $scope.getValidOrderQuantity(product);

				var params = [];
				params.push('goodsno=' + product.goodsNo);
				params.push('goodsCmpsCd=' + product.goodsCmpsCd);
				params.push('infwDispNo=' + product.infwDispNo);
				params.push('infwDispNoSctCd=' + product.infwDispNoSctCd);
				params.push('mastDispNo=' + product.dispNo);
				params.push('qty=' + qty);
				params.push('qs_yn=' + quickSlt);

                //모바일상품권 구매 대상 제어 20170223
                pticketCheck(0, product.goodsNo, function(flag){
                   if(flag){
                       return;
                   }else{                
                       location.href = LotteCommon.orderFormUrl + "?" + $scope.baseParam + '&' + params.join('&');                   
                   } 
                });
			};

			/**
			 * 재 입고 알림 등록 요청
			 */
			$scope.registRestockAlram = function(product) {
				//---------------------------------------------------
				// 재입고 알림 등록 서비스 요청
				//---------------------------------------------------
				$http({
					method: 'POST',
					url: LotteCommon.systemRestockAlramData + '?' + $scope.baseParam + $scope.getTclickParam(null, true, null, 7, null),
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



			//----------------------------------------------------------------------------------------------------
			// 상품 목록 조회(품절/재고없음 상품)
			//----------------------------------------------------------------------------------------------------
			$scope.loadSoldoutProduct = function() {
				if (0 == $scope.loadedSoldoutProductList.length) {
					var url = '';

					if ($scope.useTestData) {
						url = '/lotte/resources_dev/data/mylotte/wish/m/wish_soldout_list_data.html?';
					} else {
						url = LotteCommon.wishSoldoutListData + '?';
					}

					url += $scope.baseParam + $scope.getTclickParam(null, true, null, 6, null);

					// TODO ywkang2 : 로딩 기준 가이드 적용
					$http.get(url)
						.success(function(data) {
							$scope.loadedSoldoutProductList = data.result;
							$scope.isShowSoldoutListLoadingBar = false;
						})
						.error(function(ex) {
							$scope.isShowSoldoutListLoadingBar = false;
							ajaxResponseErrorHandler(ex, function() {});
						});
				}
			};

			// 품절/판매종료 상품 섹션 토글
			$scope.toggleSoldoutSection = function() {
				// 로딩바
				if (!$scope.isOpenSoldoutSection) {
					if (0 == $scope.loadedSoldoutProductList.length) {
						$scope.isShowSoldoutListLoadingBar = true;
					} else {
						$scope.isShowSoldoutListLoadingBar = false;
					}
				} else {
					$scope.isShowSoldoutListLoadingBar = false;
				}

				// 오픈여부
				$scope.isOpenSoldoutSection = !$scope.isOpenSoldoutSection;

				// 데이터로딩
				$scope.loadSoldoutProduct();
				
				$scope.sendTclick($scope.getTclickCode(null, true, null, 6, null));
			};



			//----------------------------------------------------------------------------------------------------
			// 상품 유닛 셋팅(유효 상품)
			//----------------------------------------------------------------------------------------------------
			$scope.dispBanner = false;
			$scope.productListLoading = true;
			// Swipe List
			$scope.swipeList = false;


			// 상품 목록 요청 URL 생성
			$scope.makeProductListUrl = function() {
				++$scope.currentPageNo;

				var productListUrlParams = [];
				productListUrlParams.push('sale_stat_cd=10');
				productListUrlParams.push('display_cnt=' + $scope.itemCountPerPage);
				productListUrlParams.push('page_num=' + $scope.currentPageNo);
				productListUrlParams.push('category=' + $scope.currentCategory);

				var url = '';

			if ($scope.useTestData) {
				url = '/lotte/resources_dev/data/mylotte/wish/m/wish_normal_list_data.html?';
			} else {
				url = LotteCommon.wishListData + '?' + productListUrlParams.join('&') + '&';
			}

			url += $scope.baseParam;

			if ($scope.currentPageNo > 1) {
				url += $scope.getTclickParam(null, true, null, null, null, $scope.currentPageNo);
				$scope.sendTclick($scope.getTclickCode(null, true, null, null, null, $scope.currentPageNo));
			}

				return url;
			};
			
			// 카테고리 열기/닫기
			$scope.showHideCategory = function(){
				$scope.categoryOpenState = ! $scope.categoryOpenState;
				
				$scope.sendTclick($scope.getTclickCode(null, true, null, "Cate", null));
			}
			
			// 카테고리 클릭 이벤트
			$scope.wishCateClick = function(cate){
				$scope.currentPageNo = 0;
				$scope.currentCategory = cate.curDispNo;
				if(cate.ctg_nm == "전체보기"){
					$scope.currentCategoryName = "카테고리 전체";
				}else{
					$scope.currentCategoryName = cate.ctg_nm;
				}
				$scope.loadMoreProduct();
				
				$scope.sendTclick($scope.getTclickCode(null, true, null, "Catesub" + cate.curDispNo, null));
			}

			/**
			 * 일반 상품 로드
			 */
			$scope.loadMoreProduct = function() {
				// 목록이 로딩완료된 경우
				if ($scope.initLoadingProductList) {
					$scope.isShowNormalListLoadingBar = true;
				}

				// TODO ywkang2 : 로딩 기준 가이드 적용
				$http.get($scope.makeProductListUrl())
				.success(function(data) {
					if (data.result) {
						if($scope.currentPageNo <= 1){// 1페이지이면 리스트 초기화
							$scope.loadedProductList.length = 0;
						}
						Array.prototype.push.apply($scope.loadedProductList, data.result);
					}else{
						$scope.loadedProductList.length = 0;
					}

					// 전체 개수 셋팅(최초 로딩 시 한 번)
					if (1 == $scope.currentPageNo) {
						// 유효상품 개수
						$scope.productTotalCount = data.resultCnt;

						// 품절/재고없음 상품 총 개수
						// 최초 화면에서는 카운트만 가져오고
						// 이후 비동기적으로 사용자 액션에 의해 목록을 가져온다
						$scope.soldOutProductTotalCount = data.resultSoldoutCnt;

						// 쿠폰 정보
						$scope.couponPopupInfo.isShow = ( 'Y' == data.popup_view_yn && $scope.showCouponPopup );
						$scope.couponPopupInfo.couponNo = data.cpn_issu_no ? data.cpn_issu_no : '';
						$scope.couponPopupInfo.cookieName = data.cookie_name ? data.cookie_name.toUpperCase() : '';

						if ($scope.couponPopupInfo.isShow && $scope.showCouponPopup) {
							$scope.dimmedOpen({
									target: 'CouponPopup',
									callback: $scope.closeCouponPopup
								});
							$scope.showCouponPopup = false;
						}
					}

					$scope.holiday = data.quick_dlv_holiday;//퀵배송(백화점 휴일 영업일:false)
					//퀵배송 재고 체크
					if(checkQuickDay()==true){
						angular.forEach($scope.loadedProductList,function(product){
							if(product.dept_main_inv_qty > 0) product.isQuickPrd = true;
						});
					}

					$scope.initLoadingProductList = true;
					$scope.isShowNormalListLoadingBar = false;
				})
				.error(function(ex) {
					$scope.isShowNormalListLoadingBar = false;
					ajaxResponseErrorHandler(ex, function() {});
				});
			};



			//----------------------------------------------------------------------------------------------------
			// 초기화
			//----------------------------------------------------------------------------------------------------
			// 페이지를 벗어날 시 이벤트
			angular.element($window).on('unload', function() {
				// 스크롤 탑위치 저장
				LotteStorage.setSessionStorage(
						$scope.screenId + 'ScrollY',
						angular.element($window).scrollTop()
				);

				//alert($scope.productTotalCount);
				//alert($scope.soldOutProductTotalCount);

				LotteStorage.setSessionStorage(
						$scope.screenId + 'Data',
						{
								loadedProductList: $scope.loadedProductList,
								productTotalCount: $scope.productTotalCount,
								loadedSoldoutProductList: $scope.loadedSoldoutProductList,

								currentPageNo: $scope.currentPageNo,
								soldOutProductTotalCount: $scope.soldOutProductTotalCount,
								isOpenSoldoutSection: $scope.isOpenSoldoutSection,
								currentCategory: $scope.currentCategory,
								currentCategoryName: $scope.currentCategoryName,
								categoryOpenState: $scope.categoryOpenState,
								categorySwipeIdx: $("#cateSwipeCurPage").data("curPage"),
								holiday:$scope.holiday
						},
						'json'
				);
			});

			// 히스토리 백으로 들어올 경우
			if (window.location.hash == ('#/' + $scope.historyBackFlag)) {
				var storedScrollTop = LotteStorage.getSessionStorage($scope.screenId + 'ScrollY');
				var storedData = JSON.parse(LotteStorage.getSessionStorage($scope.screenId + 'Data'));

				// 스크롤 이동
				$timeout(function() {
					angular.element($window).scrollTop(storedScrollTop);
					checkQuickDay();
				}, 1000);

				// 저장된 데이터 셋팅 - 일반상품
				$scope.loadedProductList = storedData.loadedProductList;
				$scope.productTotalCount = storedData.productTotalCount;
				$scope.currentPageNo = storedData.currentPageNo;
				$scope.currentCategory = storedData.currentCategory;
				$scope.currentCategoryName = storedData.currentCategoryName;
				$scope.categoryOpenState = storedData.categoryOpenState;
				$scope.categorySwipeIdx = storedData.categorySwipeIdx;
				$scope.holiday = storedData.holiday;

				// 저장된 데이터 셋팅 - 품절/판매종료
				$scope.loadedSoldoutProductList = storedData.loadedSoldoutProductList;
				$scope.soldOutProductTotalCount = storedData.soldOutProductTotalCount;
				$scope.isOpenSoldoutSection = storedData.isOpenSoldoutSection;

				// 로딩바 숨김
				$scope.initLoadingProductList = true;
				$scope.isShowNormalListLoadingBar = false;

			} else {
				$scope.loadMoreProduct();
			}
			//퀵배송 안내 팝업
			$scope.quickPopClk = function(){
				$('.commonPop.quick_layer').addClass('on');
			}
			$scope.close_quickPop = function(){
				$('.commonPop.quick_layer').removeClass('on');
			}
			//퀵배송 체크
			var checkQuickDay = function(){
				var nowT = new Date();
				var hour = nowT.getHours(), min = nowT.getMinutes(), sec = nowT.getSeconds(), str = '';
				nowT = '' + (hour<10 ? '0'+hour:hour) + (min<10 ? '0'+min:min) + (sec<10 ? '0'+sec:sec);
				if($scope.holiday){//백화점 휴무일일때
					$scope.quickDay = false;
					return 'holi';
				}else if(nowT < "090000" || "163000" < nowT){//09:00~16:30 에만 주문가능
					$scope.quickDay = false;
					return 'time';
				}
				return true;
			}
			$scope.artQuick = function(v,idx){
				var str = checkQuickDay(), aTxt='';
				str = v.dept_main_inv_qty==0?'main':str;
				switch(str){
					case 'holi' : aTxt = '공휴일 및 롯데백화점 본점 휴무일,\n배송마감일에는\n퀵 배송 주문이 불가합니다.';break;
					case 'time' : aTxt = '퀵 배송 주문은 09:00 ~ 16:30에만 가능합니다.';break;
					case 'main' : aTxt = '롯데백화점 본점 스마트픽 상품만\n퀵 배송 받을 수 있습니다.';break;
				}
				if(str == true) return true;
				$scope.loadedProductList[idx].isQuickPrd = false;
				alert(aTxt);
			}
		}]);

		app.directive('lotteContainer', function() {
				return {
					templateUrl: '/lotte/resources_dev/mylotte/wish/m/wish_container.html',
						replace: true,
						link: function($scope, el, attrs) {}
				};
		});

		app.directive('wishlistNormalProductList', function() {
			return {
				restrict: 'E',
				templateUrl: '/lotte/resources_dev/mylotte/wish/m/wish_normal_list_container.html',
				replace: true,
				link: function($scope, el, attrs) {}
			};
		});

		app.directive('wishlistSoldoutProductList', function() {
				return {
					restrict: 'E',
					templateUrl: '/lotte/resources_dev/mylotte/wish/m/wish_soldout_list_container.html',
						replace: true,
						link: function($scope, el, attrs) {}
				};
		});
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
var ajaxCount = 0;
var ajaxResponseErrorHandler = function(ex, errorCallback, product) {
	if (ex.error) {
		var errorCode = ex.error.response_code;
		var errorMsg = ex.error.response_msg;

		// 최소, 최대 제한
		if ('5000' == errorCode) {
			var msg = '';

			if (product.brand) {
				msg += '[' + product.brand + ']';
			}

			msg += errorMsg;

			alert(msg);

			return;

		// 로그인 필요
		} else if ('9003' == errorCode) {
//			alert('[' + errorCode + '] ' + errorMsg);
			if (0 == ajaxCount) {
				alert(errorMsg);
				++ajaxCount;
			}

			// TODO ywkang2 : lotte_svc.js 를 참조해야함
			var targUrl = "&targetUrl="+encodeURIComponent(location.href, 'UTF-8');
			location.href = '/login/m/loginForm.do?' + targUrl;
		}

	} else {
		alert('처리중 오류가 발생하였습니다.');
	}

	if (errorCallback) errorCallback();
};