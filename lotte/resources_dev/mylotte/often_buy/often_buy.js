(function(window, angular, undefined) {
	'use strict';
	
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		'lotteCommFooter',
		'lotteUtil',
		'lotteSlider'
	]);
	
	app.controller('OftenBuyCtrl', ['$scope', 'LotteCommon', '$http', 'LotteCookie', '$filter', 'LotteUtil', 'LotteStorage', '$timeout', '$window', 'commInitData', function($scope, LotteCommon, $http, LotteCookie, $filter, LotteUtil, LotteStorage, $timeout, $window, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "자주 구매";//서브헤더 타이틀
		$scope.initLoadingProductList = false; // 유효상품 목록 초기로딩(비동기) 완료 여부
		$scope.oftenBuyProductList = []; // 로드된 상품 전체 목록
		$scope.oftenItemTotalCount = 0; // 품절상품을 제외한 총 개수
		$scope.testMode = false;
		$scope.isOpenedSoldoutSection = false;  // 품절/판매종료 상품 섹션이 오픈 여부
		$scope.oftenSoldoutProductList = []; // 로드된 품절 상품 목록
		$scope.soldOutProductTotalCount = 0; // 품절 상품 총 개수
		$scope.noListView = false; //리스트 없을때
		$scope.pageLoad = true; //로드 dimm

		/**
		 * @ngdoc function
		 * @name getTclickCode
		 * @description
		 * 티클릭 코드 생성
		 * 
		*/
		$scope.getTclickCode = function(isPrd,isBtn,mdRecom,page,idx,no){
		
			var screenID = 'favorites';
			var recom = mdRecom ? '_M2030' : '';
			var result = $scope.tClickBase + screenID + recom + '_Clk';
			result += isPrd ? '_Prd' : '';
			result += isBtn ? '_Btn' : '';
			result += page ? '_page' + page : '';
			result += (no && idx) ? '_idx' + no : '';
			result += (no && mdRecom) ? no : '';
			return result;
		}

		/**
		 * @ngdoc function
		 * @name makeProductListUrl
		 * @description
		 * 상품 목록 요청 URL 생성
		 */
		$scope.makeProductListUrl = function(type) {
	
			var productListUrlParams = [];
			var loadURL={};
		
			switch(type){
				case "prdList":
					loadURL.testJson = "/json/product_new/often_product_info.json";

					var productListUrlParams = [];
					productListUrlParams.push('viewGoods=' + LotteStorage.getLocalStorage('latelyGoods'));
					productListUrlParams.push('amlist=' + LotteStorage.getLocalStorage('amlist'));

					loadURL.URL = LotteCommon.oftenBuyList + '?' + $scope.baseParam + '&' + productListUrlParams.join('&');
				break;
				case "optBasic":
					loadURL.testJson ="/json/product_new/often_product_optionList.json";
					loadURL.URL = LotteCommon.oftenBuyOption + '?' + $scope.baseParam ;
				break;
			}

			var url = ($scope.testMode) ?  loadURL.testJson : loadURL.URL ;
			return url;
		};

	
		
		/**
		 * @ngdoc function
		 * @name goProductDetail
		 * @description
		 * 상품 상세보기
		 * @param {object} item 상품정보
		 * @param {function} tclick 티클릭
		*/
		$scope.goProductDetail = function(item,tclick){
			
			if ('30' == item.saleStatCd) {
				alert('상품 판매가 종료되었습니다.');
				return;
			}
			
			// 성인인증이 필요한 상품인지 확인
			if ('Y' == item.minority_limit_yn) {
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
			if(item.infwDispNoSctCd) params.push('curDispNoSctCd=' + item.infwDispNoSctCd);
			if(item.goodsNo) params.push('goods_no=' + item.goodsNo);
			if(item.itemNo) params.push('item_no=' + item.itemNo);

			var tclickParam = (tclick) ? tclick : "" ;
			
			location.href = '/product/m/product_view.do?' + $scope.baseParam + '&' + params.join('&') + "&tclick=" + tclickParam;
		}

		/**
		 * @ngdoc function
		 * @name goSoldOutDetail
		 * @description
		 * 상품 상세보기
		 * @param {object} item 상품정보
		*/
		$scope.goSoldOutDetail = function(item){
			
			if ('30' == item.saleStatCd) {
				alert('상품 판매가 종료되었습니다.');
				return;
			}
			
			// 성인인증이 필요한 상품인지 확인
			if ('Y' == item.minority_limit_yn) {
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
			if(item.infwDispNoSctCd) params.push('curDispNoSctCd=' + item.infwDispNoSctCd);
			if(item.goodsNo) params.push('goods_no=' + item.goodsNo);
			if(item.itemNo) params.push('item_no=' + item.itemNo);

			location.href = '/product/m/product_view.do?' + $scope.baseParam + '&' + params.join('&') + "&tclick=m_DC_favorites_Clk_Btn_4";
		}

		/**
		 * @ngdoc function
		 * @name getFormattedGoodsNm
		 * 상품명 포맷
		 * 	[브랜드명] 상품명
		 */
		$scope.getFormattedGoodsNm = function(item){
			var itemName = (item.brand) ? "["+ item.brand +"] " + item.goodsNm : item.goodsNm;
			return itemName;
		}

		
		/**
		 * 
		 * 자주 구매 상품 로드
		 */

		$scope.getOftenBuyProductList = function(){
			
			$http.get($scope.makeProductListUrl("prdList"))
			.success(function (data) {

				if(data.often_buy_count > 0 ){

					//자주 구매 일반 상품 
					$scope.oftenBuyProductList = data.normal_result; //상품리스트
					$scope.oftenItemTotalCount = data.often_buy_count; //전체 개수
					
				}else{
					$scope.noListView = true;
				}

				// 자주 구매 품절 상품
				$scope.oftenSoldoutProductList = data.soldout_result; //품절상품 리스트
				$scope.soldOutProductTotalCount = data.soldout_count;

				$scope.pageLoad = false; //로드 dimm 종료
			})
			.error(function(ex){
				$scope.pageLoad = false;
				$scope.noListView = true;
				console.log("상품 리스트 조회 실패");
			});
		}

		//초기 데이터 init
		$scope.getOftenBuyProductList();
	}]);
	
	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/mylotte/often_buy/often_buy_container.html',
			replace : true,
			link : function($scope, el, attrs) {
			}
		};
	});
	
	/**
	 * @ngdoc directive
	 * @name oftenBuyList
	 * @description
	 * 자주 구매한 상품 목록(구매가능 상품)
	 * @example
	 * <often-buy-list></often-buy-list>
	 */
	app.directive('oftenBuyList',['$http','LotteCommon', 'LotteCookie', function( $http, LotteCommon, LotteCookie){
		return{

			templateUrl: '/lotte/resources_dev/mylotte/often_buy/often_list_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				$scope.currentCnt = 10; // 보여줄 리스트 개수 (defult:10);
				$scope.datePickerYn = false; // 달력 레이어 보이기
				$scope.datePickerInputOption = {}; //달력 입력값
				var SPLIT_GUBUN_3 = ";;;;;"; //입력값 구분자
				/**
				 * @ngdoc function
				 * @name getOftenItemOpt
				 * 상품 옵션로드 / 상태 변경
				 * @param {Object} item 상품 정보
				 */
				$scope.getOftenItemOpt = function(item){
					var openOpt = !item.openOption; // 상품 옵션 오픈 상태 
					
					if(!item.openStatus){
						// 상품 옵션 로드
						$scope.getBasicOpt(item); 	
					}else{
						
						item.openOption = openOpt ; 
					}
					item.openStatus = true; //한번이라도 로드시 true로 값 변경(json 두번호출 방지)

					//옵션/수량 티클릭
					console.log($scope.getTclickCode(null,true,null,null,null) +'_1');
				}	

				/**
				 * @ngdoc function
				 * @name getBasiOpt
				 * 상품 기본 옵션 로드
				 * @param {Object} product 개별 상품 정보
				*/
				$scope.getBasicOpt = function(product){
					
					$http.get($scope.makeProductListUrl("optBasic"),{
						params: {
							goods_no: product.goodsNo, //상품번호
							item_no: product.itemNo, //옵션번호
							qs_yn: product.quick_deli_yn //퀵배송가능여부
						}
					})
					.success(function(data){
						
						//선택형 옵션 데이터 담기
						if (data.productItemDtl){
							product.itemSelectOpt = data.productItemDtl.items;
							
							// 마지막 상품 넘버 세팅
							if(product.itemSelectOpt.length >= 2){
								var lastidx = product.itemSelectOpt.length -1;
								var lastItem = product.itemSelectOpt[lastidx]; //마지막 선택형 옵션
								lastItem['last_item_no'] = product.itemNo;
								$scope.lastOptionListInit(product,product.itemSelectOpt,lastidx);
							}
						}
						//입력형 옵션 데이터 담기
						if (data.productItemOpt) product.itemInputOpt = data.productItemOpt.items;
						

					})
					.error(function(ex){

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
		
					})
					.finally(function() {
						//데이터 로드 완류 후 레이어 열기
						product.openOption = true;
						
					  });
					;
				}

				/**
				 * @ngdoc function
				 * @name changeSelectOpt
				 * 옵션 변경 이벤트
				 * @param {object} product 상품정보
				 * @param {object} itemOpt 상품옵션정보
				 * @param {number} changeOptIdx 변경 옵션 인덱스
				*/
				$scope.changeSelectOpt = function(product,itemOpt, changeOptIdx){
					var options = itemOpt ;
					var changedOption = itemOpt[changeOptIdx];
					var optionNo = changeOptIdx + 1;
					// 상품의 변경된 단품번호 초기화
					options.changedSelectOptionItemNo = '';
					options.inv_qty = '';

					// 첫번째를 제외한 옵션 초기화
					angular.forEach(options, function(option, optionIdx) {
						if (optionIdx > changeOptIdx) {
							option.selected_item_no = '';
						}
					});

					// 마지막 옵션 변경 시
					if (optionNo == options.length) {
						var selectedItemNo = changedOption.selected_item_no;
						
						// 상품의 단품번호(itemNo) 셋팅
						options.changedSelectOptionItemNo = selectedItemNo;
						// 단품 재고수량 셋팅
						angular.forEach(changedOption.item.items, function(optionItem, idx) {
							if (selectedItemNo == optionItem.item_no) {
								options.inv_qty = optionItem.opt_cnt;
							}
						});

						// 사용자 주문 수량이 재고보다 클 경우 재고수량으로 셋팅
						if (Number(options.qty) > Number(options.inv_qty)) {
							options.qty = Number(options.inv_qty);
						}

					// 마지막에서 두번째 옵션 변경 시
					} else if (optionNo == (options.length - 1)) {
						// 마지막 옵션 정보 요청 후 교체
						$scope.lastOptionListInit(product,itemOpt,optionNo);
					}
				}

				/** 
				 * @ngdoc function
				 * @name lastOptionListInit
				 * 전달 받은 마지막 데이터로 옵션정보 교체
				 * @param {object} product 상품 정보
				 * @param {object} itemOpt 상품 옵션 정보
				 * @param {number} optionNo 옵션 번호
				*/
				$scope.lastOptionListInit = function(product,itemOpt,optionNo){
					
					var options = itemOpt ;
					var lastOption = options[options.length -1];
					var optValArr = [];
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
					
						//if (successCallback) successCallback(product, lastOption);
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
					
					}).finally(function(){
						lastOption.selected_item_no = lastOption.last_item_no;
						lastOption.last_item_no = ''; //초기 세팅 마지막 옵션 넘버 비우기
					});
				}

				/**
				 * @ngdoc function
				 * @name buyOptionUpdate
				 * 구매옵션 변경 값 세팅
				 * @param item 상품 정보
				 * @param itemSelectOpt 선택형 옵션
				 * @param itemInputOpt 입력형 옵션
				*/
				$scope.buyOptionUpdate = function(item,itemSelectOpt,itemInputOpt){
					var availableOptionQty = -1; // 옵션 수량
					var changedInputOptionValArr = []; // 입력형옵션의 변경된 값 서버파라미터용으로 준비

					if(itemSelectOpt){
						var changedItemNo = (itemSelectOpt.changedSelectOptionItemNo) ? itemSelectOpt.changedSelectOptionItemNo : item.itemNo; // 선택된 단품번호
						//---------------------------------------------------
						// 구매수량 확인
						//---------------------------------------------------
						if(!$scope.validUserOrderQuantity(item.qty_user, item)) {
							return false;
						}
					
						var lastIndx = itemSelectOpt.length - 1 ;
						//선택형 옵션 체크
						for(var i in itemSelectOpt){
							var option = itemSelectOpt[i];

							//input 값만 체크
							if(typeof option == 'object'){

								// 선택형 옵션이 모두 선택되었는지 확인
								if(!option.selected_item_no) {
									alert(option.name + ' 옵션을 선택해주세요.');
									return;
								}
							
								// 선택된 옵션의 구매가능수량 확인
								if (option.item_no == changedItemNo) {
									availableOptionQty = option.opt_cnt;
								}

								if(i == lastIndx){
									item.ori_itemNo = item.itemNo ;
									item.itemNo = option.selected_item_no;
								}

							}
						}
					}	
					//---------------------------------------------------
					// 입력형 옵션이 입력되었는지 확인
					// 입력형 옵션이 변경되었는지 확인
					// 입력형 옵션 변경 값 조립
					//---------------------------------------------------
					if(itemInputOpt){

						for (var i in itemInputOpt) {
							var option = itemInputOpt[i];
							var optionVals = [];
						
							// 입력형 옵션이 입력되었는지 확인
							if (!option.item_opt_value) {
								alert(option.item_opt_name + ' 옵션을 입력해주세요.');
								return;
							}
		
							// 입력형 옵션 변경 값 조립
							optionVals.push(option.item_opt_type);
							optionVals.push(option.item_opt_name);
							optionVals.push(option.item_opt_value);
							changedInputOptionValArr.push(optionVals.join(':'));
						}
					}
					
					//---------------------------------------------------
					// 선택형 옵션 품절 확인
					//---------------------------------------------------
					if (0 == availableOptionQty) {
						alert("선택하신 제품은 품절되었습니다.");
						return;
					}
					item.goodsChocDesc = changedInputOptionValArr.join(SPLIT_GUBUN_3);
					$scope.modifyGoodsOptionsDescription(item,itemSelectOpt,itemInputOpt);
					item.openOption = false;
				}

				/**
				 * @ngdoc function
				 * @name orderBuy
				 * 바로 주문 하기
				 * @param product 상품 정보
				 * 
				*/
				$scope.orderBuy = function(product){
					//console.log($scope.loginInfo.isLogin);
					// 주문 정보 유효성 검사 공통
					if (!$scope.isValidOrderInfo(product).result) {
						return;
					}

					// 로그인된 경우
					if ($scope.loginInfo.isLogin) {

						if(product.minority_limit_yn == 'Y'){
							$scope.checkMinorityLimit(true);
						}
						
						
						//파라미터 재정리
						if(product.goodsChocDesc){
							var goodsChocDesc = product.goodsChocDesc;
						}
					
						var params = [];
						params.push('goodsno=' + product.goodsNo);
						params.push('itemno=' + product.itemNo);
						params.push('qty=' + product.qty);
						if(goodsChocDesc){ params.push('goodsChocDesc=' + goodsChocDesc)};
						params.push('goodsCmpsCd=' + product.goods_cmps_cd);
						params.push('infwDispNoSctCd=' + product.infwDispNoSctCd);
						params.push('mastDispNo=' + product.dispNo); 
						params.push('imallYN=' + product.imall_yn);
						
						location.href = LotteCommon.orderFormUrl + "?" + $scope.baseParam + '&' + params.join('&') + '&tclick=' + $scope.getTclickCode(null,true,null,null,null) +'_3' ;

					}else{	
						
						location.href = LotteCommon.loginForm + '?' + $scope.baseParam + '&targetUrl=' + encodeURIComponent(window.location.href,'UTF-8');
					}

				}

				/**
				 * @ngdoc function
				 * @name orderCart
				 * 장바구니 담기 
				 * @param product 상품 정보
				 * 
				*/
				$scope.orderCart = function(product){
					$http({
						method: 'POST',
						url: LotteCommon.cartAddFromWishData + '?' + $scope.baseParam + "&tcilck=" + $scope.getTclickCode(null,true,null,null,null) +'_2',
						data: {
							goods_no: product.goodsNo,
							item_no: product.itemNo,
							goods_choc_desc: product.goodsChocDesc,
							goods_cmps_cd: product.goods_cmps_cd,
							ord_qty: product.qty,
							infw_disp_no_sct_cd: product.infwDispNoSctCd,
							cart_sct_cd: 10
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
						
						} else {
							ajaxResponseFailHandler(function() {
								if (errorCallback) errorCallback(index);
							});
						}
						console.log($scope.getTclickCode(null,true,null,null,null) +'_2');
						try {
							angular.element($window).trigger("refreshCartCount");
						} catch (e) {}
					})
					.error(function(ex) {
						ajaxResponseErrorHandler(ex, product);
					});
				}
				
				/**
				 * @ngdoc function
				 * @name isValidOrderInfo
				 * @description
				 * 주문 정보 유효성 체크
				 * @param {Object} product 상품 
				 */
				$scope.isValidOrderInfo = function(product){
					var resultOk = {result: true, is_show_confirm: true};
					var resultNotOk = {result: false, is_show_confirm: true};
					var hasMobileCardTiketInSmartpic = false; // <스마트픽> 모바일 롯데상품권 카드 존재 여부
					var hasGiftInSmartpic = false; // <스마트픽> 상품권 여부
					var hasInterparkTiketInSmartpic = false; // <스마트픽> 인터파크 티켓 존재 여부	
					var gift_card_count = 0;

					if(product.smp_only_yn == "Y"){

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

					}else{
						// 상품권 존재 여부 확인
						if (product.gift_card && 'Y' == product.gift_card) {
							hasGiftInSmartpic = true;
                   	   		 gift_card_count = 1;
						}                  

					}

					// LG 패션 재고 확인(홈쇼핑 제외)
					if (product.lgf_tgt_yn == 'Y') {
						var resultInfo = $scope.requestCheckLgFashionStockMng(product);
						if (!resultInfo.isOk) {
							alert(resultInfo.message);
							return resultNotOk;
						}
					}

					if(product.smp_only_yn == "Y"){

						// 인터파크 티켓 상품이 존재할 경우 
						if (hasInterparkTiketInSmartpic) {
							alert('죄송합니다.\n인터파크 티켓 상품은 모바일에서 주문하실 수 없습니다.');
							return resultNotOk;
						}

						// 주문 수량 제한 
						if(product.qty_user > 50){
							alert("스마트픽은 주문시 수량 합계 50개까지 주문가능합니다. 확인후 다시 시도해주세요.");
							return resultNotOk;
						}

					}
					
					// 망고상품 - 주문수량, 총판매금액 제한
					if(product.brand.indexOf('망고') > -1) {
						// 수량 30개 이상, 금액 150만원 이상 체크

						var total = product.basic_price * parseInt(product.qty_user);
						
						if (product.qty_user > 30 || total > 1500000) {
							alert("망고 상품의 경우 구매수량이 30개 이상 혹은 판매금액이 150만원 이상인 경우 구매가 제한되오니 구매를 원하시면 나눠서 구매해주세요!");
							return resultNotOk;
						}
					}

					return resultOk;
				}

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
				 * @name isAdultUser
				 * @description
				 * 성인여부 확인
				 */
				$scope.isAdultUser = function() {
					return 'Y' == LotteCookie.getCookie('ADULTYN');
				};

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
				 * 선택된 옵션 요약 텍스트 교체
				 */
				$scope.modifyGoodsOptionsDescription = function(item,selectOpt,inputOpt) {
				
					var selectDescriptions = [];
					var inputDescriptions = [];
					// 선택형 옵션 요약
					angular.forEach(selectOpt, function(option, idx) {
						
						angular.forEach(option.item.items, function(item, idx) {
						
							if (option.selected_item_no == item.item_no) {
								selectDescriptions.push(option.name + ' : ' + item.opt_value);
								//item.dept_main_inv_qty = item.cart_dept_main_inv_qty;
							}

						});
					});
					item.goodsOption = selectDescriptions.join(', ');

					// 입력형 옵션 요약
					angular.forEach(inputOpt, function(option, idx) {
						inputDescriptions.push(option.item_opt_name + ' : ' + option.item_opt_value);
					});
					item.goodsInputOption = inputDescriptions.join('<br/>');
					// 상품 수량
					item.qty = item.qty_user;
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
				 * 데이터피커 보이기
				 */
				$scope.datePickerOpen = function(inputOption) {
					$scope.datePickerYn = true;
					$scope.datePickerInputOption = inputOption;
				};

				/**
				 * 데이터피커 숨기기
				 */
				$scope.datePickerClose = function(currentDatePicker) {
					$scope.datePickerYn = false;
				};
				
				/**
				 * 상품 개수 1 감소
				 */
				$scope.minusQuantity = function(item) {
					if (!$scope.validUserOrderQuantity(item.qty_user - 1, item)) {
						return;
					}
				
					if (item.qty_user > 1) {
						item.qty_user -= 1;
					}
				};
			
				/**
				 * 상품 개수 1 증가
				 */
				$scope.plusQuantity = function(item) {
					if (!$scope.validUserOrderQuantity(item.qty_user + 1, item)) {
						return;
					}
					item.qty_user += 1;
				};

				/**
				 * 재고수량, 최소수량, 최대수량 체크
				 */
				$scope.validUserOrderQuantity = function(userOrderQty, item) {
					var invQty = item.inv_qty ? Number(item.inv_qty) : 0;
					var minimumOrderQty = item.min_lmt_qty ? Number(item.min_lmt_qty) : 0;
					var maximumOrderQty = item.max_lmt_qty ? Number(item.max_lmt_qty) : 0;
					var isQuickPrd = item.quick_deli_yn=='Y'?true:false;
					invQty = isQuickPrd ? item.dept_main_inv_qty : invQty;
					if (invQty> 0 && userOrderQty > invQty) {
						item.qty_user = invQty;
						if(isQuickPrd) alert('퀵배송 가능한 최대 구매 수량은 '+invQty+'개입니다');
						else alert('재고가 부족합니다.');
						return false;
					}
				
					// 단품 1일 최대 수량 체크
					if (maximumOrderQty > 0 && userOrderQty > maximumOrderQty) {
						item.qty_user = maximumOrderQty;
						alert('1일 최대 ' + maximumOrderQty + '개 구매 가능한 상품입니다.');
						return false;
					}
				
					// 단품 1일 최소 수량 체크
					if (minimumOrderQty > 0 && userOrderQty < minimumOrderQty) {
						item.qty_user = minimumOrderQty;
						alert('최소 ' + minimumOrderQty + '개 구매 가능한 상품입니다.');
						return false;
					}
				
					return true;
				};
				/**
				 * @ngdoc function
				 * @name moreShowOftenItem
				 * 자주 구매 상품 더보기
				 */
				$scope.moreShowOftenItem = function(){
					$scope.currentCnt = $scope.oftenItemTotalCount;
					console.log($scope.getTclickCode(null,true,null,'02',null));
				}
				
			}
		}
	}]);
	
	/**
	 * @ngdoc directive
	 * @name soldOutList
	 * @description
	 * 자주 구매한 상품 목록(구매불가능 상품)
	 * @example
	 * <sold-out-list></sold-out-list>
	 */
	app.directive('soldOutList',['$http','LotteCommon',  function( $http, LotteCommon){
		return{
			templateUrl: '/lotte/resources_dev/mylotte/often_buy/soldOut_list_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				$scope.soldOutshow = false;
				/**
				 * @ngdoc function
				 * @name showSoldOutList
				 * 품절 상품 목록 열기/닫기
				*/
				 $scope.showSoldOutList = function(){

					if($scope.soldOutProductTotalCount <= 0){
						return;
					}

					$scope.soldOutshow = (!$scope.soldOutshow) ? true: false;
					console.log($scope.getTclickCode(null,true,null,null,null) + "_4");
				 }
				
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
					$http({
						method: 'POST',
						url: LotteCommon.systemRestockAlramData + '?' + $scope.baseParam + "&tclick="+$scope.getTclickCode(true, true, null, 8, null),
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
				}
			}
		}
	}]);

	/**
	 * @ngdoc directive
	 * @name recommProduct
	 * @description
	 * 추천 상품
	 * @example
	 * <recomm-product></recomm-product>
	 */
	app.directive('recommProduct', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
	function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
		return {
			templateUrl : "/lotte/resources_dev/mylotte/often_buy/recomm_product.html",
			replace : true,
			link : function ($scope, el, attrs) {
				$scope.rScope = LotteUtil.getAbsScope($scope);
				$scope.loginInfo = $scope.rScope.loginInfo;
				
				$scope.prdData = {};
				
				// Recomm Data Load
				$scope.loadRecommData = function () {
			if(LotteCommon.isTestFlag){

				$scope.loginInfo.isLogin = (LotteCommon.isTestFlag) ? true : $scope.loginInfo.isLogin;
				$scope.loginInfo.name = (LotteCommon.isTestFlag) ? "이가현" : $scope.loginInfo.name;

					var jsonUrl = "/json/main/main_m2030.json" ;
					
					var httpConfig = {
						method: "GET",
						url: jsonUrl
					};
					
					$http(httpConfig)
					.success(function (data) {
						if(data){
							$scope.prdData = data.data;
							return;
						}
						
					});
					
			}else{
					var goodsItems = LotteStorage.getLocalStorage('latelyGoods');
					if(goodsItems == null || goodsItems == undefined) {
						return;
					}

					goodsItems = goodsItems.replace(/\|/ig,",");
					
					var goodsItemArr = goodsItems.split(",");
					goodsItemArr.reverse();
					goodsItems = goodsItemArr.slice(0, 6).toString();
					var jsonUrl = LotteCommon.salebestlist_url + "&iids="+ goodsItems;
					
					//var jsonUrl = LotteCommon.isTestFlag ?  "/json/main/main_m2030.json" : $scope.moduleData.jsonCallUrl;

					$.ajax({
						type: 'post'
						, async: true
						, url: jsonUrl
						, dataType  : "jsonp"
						, jsonp  : "callback"
						, success: function(data) {
							var result = [];

							if (data.results != null) {
								$(data.results).each(function (i, val) {
									result.push(val.itemId);
								});

								if (result.length > 0) {
									var jsonUrl = LotteCommon.isTestFlag ? "/json/main/main_m2030.json" : "/json/main_new/latest_product.json?dispNo=5570109&type=R&latest_prod=" + result.join(",");

									var httpConfig = {
										method: "GET",
										url: jsonUrl
									};

									$http(httpConfig)
									.success(function (data) {
										$scope.prdData = data.data;
									});
								}
							}
						}
						, error: function(data, status, err) {
							console.log('Data Error : 실시간 맞춤 추천 Data로드 실패');
						}
					});
				};
			}
				$scope.loadRecommData();
			}
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
var ajaxResponseErrorHandler = function(ex, product) {
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

};