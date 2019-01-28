var commProduct = {};

(function(window, angular, undefined) {
	'use strict';

	/**
     * @ngdoc overview
     * @name lotteProduct
     * @description 
     * lotte_product.js<br/>
     * 상품 공통 모듈
     */	
	commProduct = angular.module('lotteProduct', []);
	commProduct.filter('titleToHtml', function() {
		return function(title) {
			if (title == null){return '';}
			var newTitle = "";

			newTitle = title.split('<!HS>').join('<STRONG>');
			newTitle = newTitle.split('<!HE>').join('</STRONG>');
			return newTitle;
		}
	});
	/**
     * @ngdoc object
     * @name lotteProduct.controller:productCtrl
     * @requires 
     * $rootScope, $scope, $http, LotteCommon
     * @description
     * 공통 컨트롤러 
     */
	commProduct.controller('productCtrl', ['$rootScope','$scope', '$http', 'LotteCommon', function($rootScope,$scope, $http, LotteCommon) {
		// 초기화
		$rootScope.resetProductList = function(pData,bData) {
			// 총 상품 겟수
			$scope.totalDisp = 0;
			// 베너와 상품의 갯수
			$scope.totalMixDisp = 0;
			// 상품리스트 로딩
			if(!$scope.productListLoading) {
				$scope.productListLoading = false;
			}
			if(!$scope.productMoreScroll) {
				$scope.productMoreScroll = false;
			}
		}

		$scope.resetProductList();

		/**
         * @ngdoc function
         * @name productCtrl.function:changeTemplate
         * @description
         * 템플릿 변경
         * @example
         * $scope.changeTemplate('image');
         * @param {String} tp 템플릿 타입 : list/image/swipe
		 * @function 
		 * loadTemplate(url)
         */
		$scope.changeTemplate = function(tp) {
			//console.log(tp);
			$scope.sendTclick($scope.tClickBase+$scope.screenID+'_Clk_Pcto_'+tp);
			$scope.templateType = tp;
		}

		// 로딩중인지에 대한 플레그 값
		$scope.setProductListLoading = function(st) {
			$scope.productListLoading = st;
		}

	}]);

	/**
     * @ngdoc directive
     * @name lotteProduct.directive:productContainer
	 * @function
	 * 
     * @description
     * 상품 리스트 동적 디렉티브 (고립형 스코프)
     * @restrict AEC
     * @scope 
     * products, banners, templatetype, sktApp, templateType, productListLoading, totalCount, rankKeyword, winWidth
     * @example
     * <product-container></product-container>
     */
	commProduct.directive('productContainer',['$rootScope', '$window', "$compile", '$http', '$templateCache', '$parse','$sce', 'LotteCommon','LotteLink' , 'LotteUtil', 'LotteCookie', 'commInitData', 'LotteStorage', function($rootScope, $window, $compile,$http,$templateCache,$parse, $sce, LotteCommon, LotteLink, LotteUtil, LotteCookie, commInitData, LotteStorage) {
		return {
			restrict: 'AEC',
			replace: true,
			scope: { products: "=", banners: '=', templatetype: "=", sktApp: "=", templateType: "&", productListLoading: "&", totalCount:'=', rankKeyword: "=", winWidth: "=", srhKeyword: "=", srhReatedKeyword: "=", cameraImg: "=", holidayFlag: "=", mainTemplateType: "="},
			link : function(scope, el, attrs) {
				function getTemplateFromType(tp) {
					var url = "";
					switch(tp) {
					default:
					case "list":
					case "listrank":
						url = "/lotte/resources_dev/product_unit/product_unit_list_list.html";
						break;
					case "list2":
						url = "/lotte/resources_dev/product_unit/product_unit_list_list2.html";
						break;
					case "best10":
						url = "/lotte/resources_dev/product_unit/product_unit_list_best10.html";
						break;
					case "image":
					case "imagerank":
						url = "/lotte/resources_dev/product_unit/product_unit_list_image.html";
						break;
					case "swipe":
						url = "/lotte/resources_dev/product_unit/product_unit_list_swipe.html";
						break;
					case "swipe_deal":
						url = "/lotte/resources_dev/product_unit/product_unit_list_swipe_deal.html";
						break;
					case "simple":
						url = "/lotte/resources_dev/product_unit/product_unit_list_simple.html";
						break;
					case "rank":
						url = "/lotte/resources_dev/product_unit/product_unit_list_rank.html";
						break;
					case "deal":
						url = "/lotte/resources_dev/product_unit/product_unit_list_deal.html";
						break;
					case "mixdeal":
						url = "/lotte/resources_dev/product_unit/product_unit_list_mixdeal.html";
						break;
					case "mixetv":
						url = "/lotte/resources_dev/product_unit/product_unit_list_mixetv.html";
						break;
					case "planshop":
						url = "/lotte/resources_dev/product_unit/product_unit_list_planshop.html";
						break;
					case "recommend":
						url = "/lotte/resources_dev/product_unit/product_unit_list_recommend.html";
						break;
					case "stylepush":
						url = "/lotte/resources_dev/product_unit/product_unit_list_stylepush.html";
						break;
					case "search_list_2017"://search 2017 list type
						url = "/lotte/resources_dev/product_unit/product_unit_search_list_2017.html";
						break;
					case "search_image_2017":// search 2017 image type
						url = "/lotte/resources_dev/product_unit/product_unit_search_image_2017.html";
						break;
					case "search_image6_2017":// search 2017 image top6 type
						url = "/lotte/resources_dev/product_unit/product_unit_search_image6_2017.html";
						break;
					case "cate_prod_normal":// 중카리스트 기본형
						url = "/lotte/resources_dev/product_unit/product_unit_cate_prod_normal.html";
						break;
					case "cate_prod_double":// 중카리스트 세로2단형
						url = "/lotte/resources_dev/product_unit/product_unit_cate_prod_double.html";
						break;
					case "cate_prod_image":// 중카리스트 이미지 강조형
						url = "/lotte/resources_dev/product_unit/product_unit_cate_prod_image.html";
						break;
					case "cate_prod_single":// 중카리스트 한개보기형
						url = "/lotte/resources_dev/product_unit/product_unit_cate_prod_single.html";
						break;
					}
					return url;
				}
				scope.rScope = LotteUtil.getAbsScope(scope);
				scope.showDscLayer = false; //#kyungho
				var isSwipe = attrs.isSwipe ? true:false;
				var idxParam = attrs.idxParam ? attrs.idxParam:'idx';
				var specialKeyParam = attrs.specialKeyParam ? attrs.specialKeyParam : '';
				var prevScope, nowTemplate;
				scope.Math = Math;
				/**
			     * @ngdoc function
			     * @name productContainer.function:loadTemplate
			     * @description
			     * 상품 리스트 동적 로딩
			     * @example
			     * loadTemplate(url)
			     * @param {String} url 주소
			     */
				function loadTemplate(url) {
					$http.get(url, { cache: $templateCache })
					.success(function(templateContent) {
						if (prevScope) {
							prevScope.$destroy();
							prevScope = null;
						}

						// el.empty(); // 하단에서 html을 바꿔치기 하기때문에 궂이 비울필요가 없음 (비울 경우 layout 변경이 2번 일어나 성능에 약간의 영향이 있음)

						try {
							prevScope = scope.$new();
							angular.element(el).html($compile(templateContent)(prevScope));
						} catch (e) {}
					});
				}

				if(attrs.template != undefined) {
					loadTemplate(attrs.template);
				} else if(attrs.templateType != undefined) {
					// 템플릿타입을 로컬스토리지로부터 가져오기
					if(attrs.templateType == 'local'){
						var template = LotteStorage.getLocalStorage(scope.rScope.screenID+'TemplateTypeDC');
	                	if(!(template == "cate_prod_image" || template == "cate_prod_single" || template == "cate_prod_double")){
	                		template = "cate_prod_normal";
	                	}
	                	attrs.templateType = template;
					}
					scope.templateType = attrs.templateType;
					loadTemplate(getTemplateFromType(attrs.templateType));
					scope.$watch('templatetype', function(newValue,oldValue) {
						if(newValue === oldValue) {
							return;
						}
						loadTemplate(getTemplateFromType(newValue));
					});
				}

				/* 상품기타정보 show/hide #kkh*/
				scope.infoDscAdd = function() {
					scope.showDscLayer = !scope.showDscLayer;
				};

				/**
			     * @ngdoc function
			     * @name productContainer.function:getProductImage
			     * @description
			     * 상품 이미지 주소 가저 오기(성인 상품의 경우 성인 인증 안하였을 경우 19금 이미지 노출)
			     * @example
			     * $scope.getProductImage(item)
			     * @param {Object} item 상품 json data
			     * @param {String} item.img_url 상품 이미지 주소
			     * @param {String} item.limit_age_yn 성인 상품 여부 Y/N
			     */
				scope.getProductImage = function(item, index) {
					var newUrl = "";
					if(item.img_url == null) {
						return "";
					}
					
					var imgurl = item.img_url;
					if(scope.templateType != 'deal' && scope.templateType != 'mixdeal' && scope.templateType != 'mixetv') {
						imgurl = item.img_url.replace("60.jpg","280.jpg");
					}

					if(scope.templatetype == 'swipe' || scope.templateType == 'swipe' || scope.templatetype == 'search_image6_2017' || scope.templateType == 'search_image6_2017'
						|| scope.templatetype == 'cate_prod_single' || scope.templateType == 'cate_prod_single' 
						|| (scope.rScope.screenType > 1 && (scope.templatetype == 'cate_prod_image' || scope.templateType == 'cate_prod_image'))) {
						imgurl = imgurl.replace("280.jpg","550.jpg");
					}

					if(commInitData.query['adultChk'] == "Y") {
						return imgurl;
					}

					if(item.limit_age_yn == 'N' || item.limit_age_yn == undefined) {
						if(item.img_url != "") {
							newUrl = imgurl;
						}
					} else {
						if (!scope.rScope.loginInfo.isAdult) { /*로그인 안한 경우*/
							newUrl = "http://image.lotte.com/lotte/mo2017/common/img_19_280x280.png";
//									 "http://image.lotte.com/lotte/mobile/sub/img_19_280x280.png";
						} else {
							if(item.img_url != "") {
								newUrl = imgurl;
							}
						}
					}

					if (index == 0) { // sns공유하기 이미지 첫번째 생성
						scope.rScope.share_img = imgurl;
					}
					return newUrl;
				}
				/**
			     * @ngdoc function
			     * @name productContainer.function:getProductImage2
			     * @description
			     * 상품 이미지 주소 가저 오기(성인 상품의 경우 성인 인증 안하였을 경우 19금 이미지 노출)
			     * @example
			     * $scope.getProductImage2(item)
			     * @param {Object} item 상품 json data
			     * @param {String} item.img_url 상품 이미지 주소
			     * @param {Number} item.pmg_byr_age_lmt_cd 성인 상품 여부 값이 19 이면 성인 상품
			     */
				scope.getProductImage2 = function(item) {
					var newUrl = "";
					if(item.img_url == null) {
						return "";
					}

					var imgurl = item.img_url;
					if(scope.templateType != 'deal' && scope.templateType != 'mixdeal' && scope.templateType != 'mixetv' && scope.templateType != 'swipe_deal') {
						imgurl = item.img_url.replace("60.jpg","280.jpg");
					}
					if(scope.templatetype == 'swipe' || scope.templateType == 'swipe') {
						imgurl = imgurl.replace("280.jpg","550.jpg");
					}
					
					if(commInitData.query['adultChk'] == "Y") {
						return imgurl;
					}
					
					if(item.pmg_byr_age_lmt_cd != '19' || item.pmg_byr_age_lmt_cd == undefined) {
						if(item.img_url != "") {
							newUrl = imgurl;
						}
					} else {
						if (!scope.rScope.loginInfo.isAdult) { /*로그인 안한 경우*/
							newUrl = "http://image.lotte.com/lotte/mobile/sub/img_19_280x280.png";
						} else {
							if(item.img_url != "") {
								newUrl = imgurl;
							}
						}
					}
					return newUrl;
				}
				/**
			     * @ngdoc function
			     * @name productContainer.function:addWishClick
			     * @description
			     * 위시 리스트에 담기 클릭
			     * @example
			     * $scope.addWishClick(idx, item)
			     * @param {Number} idx 상품 리스트 인덱스
			     * @param {Object} item 상품 json data
			     * 
			     * @param {Number} item.outlnkMall 외부 상품 구분값
			     * @param {Boolean} item.has_wish 위시에 담긴 상품인지에 대한 구분값
			     * @param {String} item.limit_age_yn 성인 상품 여부 Y/N
			     * @param {String} item.goods_no 상품 번호

			     * @returns {String} 
			        1. 이미 등록된 상품입니다.
				    2. 선택하신 상품은 \n상품정보화면에서 담아주세요.
				    3. 죄송합니다. 품절된 상품입니다.
					4. 죄송합니다. 판매종료된 상품입니다.
					5. 위시리스트에 저장되었습니다.
					6. 죄송합니다. 잠시 후 다시 이용해 주세요.
					7. 죄송합니다. 품절된 상품입니다.
					8. 죄송합니다. 잠시 후 다시 이용해 주세요.
					9. 로그인 후 이용하실 수 있습니다.
			     */
				scope.addWishClick = function(idx, item) {
					if (item.outlnkMall == "LECS") { /*LECS 상품*/
						if (confirm("공식온라인 몰로 이동후 담을 수 있습니다.")) {
							LotteLink.goOutLink(item.outlnk, item.outlnkMall);
						}
						return false;
					} else if (item.outlnkMall == "SP") { /*롯데슈퍼 상품*/
						if (confirm("롯데슈퍼로 이동후 담을 수 있습니다.")) {
							LotteLink.goOutLink(item.outlnk, item.outlnkMall);
						}
						return false;
					}

					 if (item.has_wish) {
						scope.rScope.openSystemAlert({msg:"이미 등록된 상품입니다."});
						return false;
					}

					if (!scope.rScope.loginInfo.isLogin) { /*로그인 안한 경우*/
						alert('로그인 후 이용하실 수 있습니다.');
						scope.rScope.loginProc(); /*go Login*/
						return false;
					} else {
						if (item.limit_age_yn == 'Y') {
							if (scope.rScope.loginInfo.isAdult == "") { /*19금 상품이고 본인인증 안한 경우*/
								alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
								scope.rScope.goAdultSci();
								return false;
							} else if (!scope.rScope.loginInfo.isAdult) {
								alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
								return false;
							}
						}
					};

					scope.rScope.sendProductWish(item.goods_no, function (res) {
						if (res) {
							scope.products[idx].has_wish = true;
						} else {
							scope.products[idx].has_wish = false;
						}
					});

					var tClickCode = "";

					if (attrs.tclickWish) {
						tClickCode = attrs.tclickWish + (idx + 1);
					} else {
						tClickCode = scope.rScope.tClickBase + scope.rScope.screenID;

						if (isSwipe) {
//							tClickCode += "_Swp_Wsh_"+idxParam + (idx + 1);
							tClickCode += "_Swp_Wsh";
						} else {
//							tClickCode += "_Clk_Wsh_"+idxParam + (idx + 1);
							tClickCode += "_Clk_Wsh";
						}
					}

					scope.rScope.sendTclick(tClickCode); // AJAX 링크 tclick 수집
				};
				/**
			     * @ngdoc function
			     * @name productContainer.function:addCartClick
			     * @description
			     * 장바구니에 담기 클릭
			     * @example
			     * $scope.addCartClick(idx, item)
			     * @param {Number} idx 상품 리스트 인덱스
			     * @param {Object} item 상품 json data
			     */
				scope.addCartClick = function(idx, item){
					
					var jsonUrl = "/json/mylotte/direct_cart_ins.json?goods_no="+item.goods_no+"&ord_qty=1";					
					var httpConfig = {
						method: "get",
						url: jsonUrl
					};
					$http(httpConfig) 
					.success(function (data) {
						if(data){
							if(data.data.resultCode == "0000"){  // 성공 : 0000 , 실패 : 9999
								//console.log(data.data.resultMsg);
								scope.products[idx].has_cart = true;
								scope.rScope.openCireleSystemAlert({type:"cartPop"}); 
								try {
									angular.element($window).trigger("refreshCartCount");
								} catch (e) {}
							} else if(data.data.resultCode == "9999"){
								alert(data.data.resultMsg);

							} else if(data.data.resultCode == "1000"){							
								if(confirm(data.data.resultMsg)){
									scope.productInfoProc(item, 'normal', idx + 1);
								}
								//alert("옵션이 있는 상품입니다. \n상품상세에서 선택후 장바구니에 담아주세요!!");
							}else {
								alert(data.data.resultMsg); //기타
							}
						} else {
							alert(data.error.response_msg);
						}
					})
					.finally(function () {
					});
					var tClickCode = scope.rScope.tClickBase + scope.rScope.screenID + "_Clk_CART";
					scope.rScope.sendTclick(tClickCode);
				};
				/**
			     * @ngdoc function
			     * @name productContainer.function:zoomImageClick
			     * @description
			     * 상품 줌 클릭
			     * @param {String} url 상품 이미지 주소
			     * @example
			     * $scope.zoomImageClick(url)
			     */
				scope.zoomImageClick = function(url) {
					scope.rScope.zoomImageClick(url);
				}
				//상품리스트 리스트형, 작은 박스형 유닛일때 확대보기 스와이프
				scope.zoomImageSwipeClick = function(item) {
					scope.rScope.zoomImageSwipeClick(item);
				}

				/**
			     * @ngdoc function
			     * @name productContainer.function:getTclicCurrentCode
			     * @description
			     * 티클릭 유입코드 세팅
			     * @example
			     * $scope.getTclicCurrentCode()
			     */
				scope.getTclicCurrentCode = function() {
					var curDispNo = "";
					if(scope.rScope.curDispNo) {
						curDispNo = "&curDispNo=" + scope.rScope.curDispNo;
					}

					var curDispNoSctCd = "";
					if(scope.rScope.curDispNoSctCd) {
						curDispNoSctCd = "&curDispNoSctCd=" + scope.rScope.curDispNoSctCd;
					}
					return curDispNo+curDispNoSctCd;
				}
				
				/**
			     * @ngdoc function
			     * @name productContainer.function:productInfoProc
			     * @description
			     * 상품 클릭 이벤트 처리
			     * @example
			     * $scope.productInfoProc(item, type, idx)
			     * @param {Object} item 상품 json data
			     * @param {Object} type 상품 Tyep 딜상품인지 아닌지에 대한 처리 
			     * @param {Number} idx 상품 리스트 인덱스
			     * 
			     * @param {Number} item.outlnkMall 외부 상품 구분값
			     * @param {Boolean} item.has_wish 위시에 담긴 상품인지에 대한 구분값
			     * @param {String} item.limit_age_yn 성인 상품 여부 Y/N
			     * @param {Number} item.pmg_byr_age_lmt_cd 성인 상품 여부 19 이면 19금 
			     * @param {String} item.goods_no 상품 번호
			     * @param {String} item.outlnk 외부링크 주소
			     */
				scope.productInfoProc = function(item, type, idx) {
					if(item.limit_age_yn == 'Y' || item.pmg_byr_age_lmt_cd == '19') {
						if (!scope.rScope.loginInfo.isAdult && scope.rScope.loginInfo.isLogin) { /*19금 상품이고 본인인증 안한 경우*/
							// alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
							scope.rScope.goAdultSci();
							return false;
						} else if(!scope.rScope.loginInfo.isLogin) {
							window.location.href = LotteCommon.loginUrl + '?'+scope.rScope.baseParam + '&adultChk=Y'+"&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
							return false;
						} else if (!scope.rScope.loginInfo.isAdult) {
							alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
							return false;
						}
					}

					if (item.outlnk != "" && item.outlnk != undefined) {
						if (item.outlnkMall == "SP") {
							if (confirm("롯데슈퍼로 이동합니다.")) {
								if (scope.rScope.appObj.isApp) {
									openNativePopup("롯데슈퍼", item.outlnk);
								} else {
									//window.open(item.outlnk); // 닷컴/슈퍼 오픈시 새창에서->자체창으로 변경
									scope.rScope.gotoLotteSuperUrl(item.outlnk);
								}
							}
						} else {
							if (confirm("공식 온라인 몰로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if (scope.rScope.appObj.isApp) {
									openNativePopup("공식온라인몰", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}

						}
						return false;
					}

					var curDispNo = "";
					if(scope.rScope.curDispNo) {
						curDispNo = "&curDispNo=" + scope.rScope.curDispNo;
					} else if (item.curDispNo) {
						curDispNo = "&curDispNo=" + item.curDispNo;
					}

					var curDispNoSctCd = "";
					if (scope.rScope.curDispNoSctCd) {
						curDispNoSctCd = "&curDispNoSctCd=" + scope.rScope.curDispNoSctCd;
					} else if (item.curDispNoSctCd) {
						curDispNoSctCd = "&curDispNoSctCd=" + item.curDispNoSctCd;
					}

					var dealProd = "";
					if (type == "deal" || item.genie_yn ||
							scope.templateType == "deal" || scope.templateType == "mixdeal") {
						dealProd = "&genie_yn=Y";
					}

					var tClickCode = "";
                    var tClickCode_ad = ""; //광고솔루션 전용 
					if (type == "review") {
						if (attrs.tclickReview) {
							tClickCode = attrs.tclickReview + idx;
						} else {
							tClickCode = scope.rScope.tClickBase + scope.rScope.screenID;

							if (isSwipe) {
//								tClickCode += "_Swp_Rvw_"+idxParam + idx;
								tClickCode += "_Swp_Rvw";
							} else {
//								tClickCode += "_Clk_Rvw_"+idxParam + idx;
								tClickCode += "_Clk_Rvw";
							}
						}
					} else {
						if (attrs.tclick) { // tclick 예외 케이스일때 tclick 지정 (배너, 상품 공통 tclick일때)
							tClickCode = attrs.tclick + (attrs.tclickStartIdx ? parseInt(attrs.tclickStartIdx) + (idx - 1) : idx);
						} else if (attrs.tclickMovProd && item.goods_conts_vod) { // 동영상 Tclick과 동영상 상품이 있을 경우
							tClickCode = attrs.tclickMovProd;
						} else if (attrs.tclickTvProd && type=="tvunit") {
							tClickCode = attrs.tclickTvProd;
						} else if (attrs.tclickProd) { // tclick 예외 케이스일때 상품 tclick 지정
							tClickCode = attrs.tclickProd;

							if (item.pIdx || item.pIdx === 0) { // 상품에 대한 별개 Index가 있을 경우 (0일때 false로 인식되기 때문에 0과 완전 일치할 경우에도 적용)
								tClickCode += attrs.tclickProdStartIdx ? parseInt(attrs.tclickProdStartIdx) + item.pIdx : item.pIdx + 1;
							} else {
								tClickCode += attrs.tclickProdStartIdx ? parseInt(attrs.tclickProdStartIdx) + (idx - 1) : idx;
							}
						} else {
							tClickCode = scope.rScope.tClickBase + scope.rScope.screenID;
							
							// 브랜드상품리스트 페이지인 경우 카테고리 파라미터 추가 
							var tClickCtg = "";
							if(attrs.ctgIdx && scope.rScope.ctgIdx != null){
								tClickCtg = scope.rScope.ctgIdx + "_";
							}
							
							if (isSwipe) {
								tClickCode += "_Swp_Prd_"+idxParam + idx;
							} else {
								
								if(scope.templatetype == "cate_prod_normal"
									|| scope.templatetype == "cate_prod_double"
									|| scope.templatetype == "cate_prod_image" 
									|| scope.templatetype == "cate_prod_single"){
									
									tClickCode += "_" + commInitData.query.curDispNo;
								}
								tClickCode_ad = tClickCode + "_Clk_Prd_ad_" + idxParam + idx;

								// 20180612 kshop 템플릿 티클릭 분기
								if(scope.rScope.kShopUI && scope.rScope.kShopUI.dispNo == '5617246'){
									tClickCode += commInitData.query.cate2 +"_Prod_" + idx;
								}else{
									tClickCode += "_Clk_Prd_"+ tClickCtg + idxParam + idx;
								}
                                
							}
						}


					}
					
					if(scope.templatetype == "search_image6_2017"){
						tClickCode += "_CU";// 검색 큐레이션 타입
					}
					
					// 맞춤상품탭&맞춤상품인 경우 레코벨 파라미터 적용(yubu)
					if(specialKeyParam=="reco") {
						tClickCode += "&_reco=M_main";
					}
                    //console.log(tClickCode, scope.templatetype); return;
                    //201804 광고솔루션 ============================ 
                    if(item.click_url){
                       tClickCode = tClickCode_ad; 
                    }
                    var result_url = LotteCommon.prdviewUrl + "?" + scope.rScope.baseParam + "&goods_no=" + item.goods_no+ curDispNo + curDispNoSctCd + dealProd + "&tclick="+tClickCode;
                    if(item.click_url){ //광고솔루션 링크가 있으면
                        result_url = decodeURIComponent(item.click_url) + "&fwurl=" + encodeURIComponent(result_url);
                    } 
                    //alert(item.click_url);
					window.location.href = result_url;
				}

				/**
				 * 상품상세 링크 구하기
				 */
				scope.getProductInfoUrl = function(item, type, idx) {
					/*if(item.limit_age_yn == 'Y' || item.pmg_byr_age_lmt_cd == '19') {
						if (!scope.rScope.loginInfo.isAdult && scope.rScope.loginInfo.isLogin) { 19금 상품이고 본인인증 안한 경우
							// alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
							scope.rScope.goAdultSci();
							return false;
						} else if(!scope.rScope.loginInfo.isLogin) {
							window.location.href = LotteCommon.loginUrl + '?'+scope.rScope.baseParam + '&adultChk=Y'+"&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
							return false;
						} else if (!scope.rScope.loginInfo.isAdult) {
							alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
							return false;
						}
					}*/

					if (item.outlnk != "" && item.outlnk != undefined) {
						/*if (item.outlnkMall == "SP") {
							if (confirm("롯데슈퍼로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if (scope.rScope.appObj.isApp) {
									openNativePopup("롯데슈퍼", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}
						} else {
							if (confirm("공식 온라인 몰로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
								if (scope.rScope.appObj.isApp) {
									openNativePopup("공식온라인몰", item.outlnk);
								} else {
									window.open(item.outlnk);
								}
							}

						}
						return false;*/
						return item.outlnk;
					}

					var curDispNo = "";
					if(scope.rScope.curDispNo) {
						curDispNo = "&curDispNo=" + scope.rScope.curDispNo;
					} else if (item.curDispNo) {
						curDispNo = "&curDispNo=" + item.curDispNo;
					}

					var curDispNoSctCd = "";
					if (scope.rScope.curDispNoSctCd) {
						curDispNoSctCd = "&curDispNoSctCd=" + scope.rScope.curDispNoSctCd;
					} else if (item.curDispNoSctCd) {
						curDispNoSctCd = "&curDispNoSctCd=" + item.curDispNoSctCd;
					}

					var dealProd = "";
					if (type == "deal" || item.genie_yn ||
							scope.templateType == "deal" || scope.templateType == "mixdeal") {
						dealProd = "&genie_yn=Y";
					}

					var tClickCode = "";
                    var tClickCode_ad = "";
					if (type == "review") {
						if (attrs.tclickReview) {
							tClickCode = attrs.tclickReview + idx;
						} else {
							tClickCode = scope.rScope.tClickBase + scope.rScope.screenID;

							if (isSwipe) {
//								tClickCode += "_Swp_Rvw_"+idxParam + idx;
								tClickCode += "_Swp_Rvw";
							} else {
//								tClickCode += "_Clk_Rvw_"+idxParam + idx;
								tClickCode += "_Clk_Rvw";
							}
						}
					} else {
						if (attrs.tclick) { // tclick 예외 케이스일때 tclick 지정 (배너, 상품 공통 tclick일때)
							tClickCode = attrs.tclick + (attrs.tclickStartIdx ? parseInt(attrs.tclickStartIdx) + (idx - 1) : idx);
						} else if (attrs.tclickMovProd && item.goods_conts_vod) { // 동영상 Tclick과 동영상 상품이 있을 경우
							tClickCode = attrs.tclickMovProd;
						} else if (attrs.tclickTvProd && type=="tvunit") {
							tClickCode = attrs.tclickTvProd;
						} else if (attrs.tclickProd) { // tclick 예외 케이스일때 상품 tclick 지정
							tClickCode = attrs.tclickProd;

							if (item.pIdx || item.pIdx === 0) { // 상품에 대한 별개 Index가 있을 경우 (0일때 false로 인식되기 때문에 0과 완전 일치할 경우에도 적용)
								tClickCode += attrs.tclickProdStartIdx ? parseInt(attrs.tclickProdStartIdx) + item.pIdx : item.pIdx + 1;
							} else {
								tClickCode += attrs.tclickProdStartIdx ? parseInt(attrs.tclickProdStartIdx) + (idx - 1) : idx;
							}
						} else {
							tClickCode = scope.rScope.tClickBase + scope.rScope.screenID;

							if (isSwipe) {
								tClickCode += "_Swp_Prd_"+idxParam + idx;
							} else { // 중카내 유닛
								if(scope.templatetype == "cate_prod_normal"
									|| scope.templatetype == "cate_prod_double"
									|| scope.templatetype == "cate_prod_image" 
									|| scope.templatetype == "cate_prod_single"){
									tClickCode += "_" + scope.rScope.curDispNo;
								}
                                tClickCode_ad = tClickCode + "_Clk_Prd_ad_"+idxParam + idx;
								tClickCode += "_Clk_Prd_"+idxParam + idx;
							}
						}


					}
					
					if(scope.templatetype == "search_image6_2017"){
						tClickCode += "_CU";// 검색 큐레이션 타입
					}
					
					// 맞춤상품탭&맞춤상품인 경우 레코벨 파라미터 적용(yubu)
					if(specialKeyParam=="reco") {
						tClickCode += "&_reco=M_main";
					}
                    //console.log(tClickCode, scope.templatetype); return;
					//window.location.href = LotteCommon.prdviewUrl + "?" + scope.rScope.baseParam + "&goods_no=" + item.goods_no+ curDispNo + curDispNoSctCd + dealProd + "&tclick="+tClickCode;
					
                    //201804 광고솔루션 ============================ 
                    if(item.click_url){
                       tClickCode = tClickCode_ad; 
                    }                    
                    var result_url = LotteCommon.prdviewUrl + "?" + scope.rScope.getBaseParam(true) + "&goods_no=" + item.goods_no+ curDispNo + curDispNoSctCd + dealProd + "&tclick="+tClickCode;
                    if(item.click_url){ //광고솔루션 링크가 있으면
                        result_url = item.click_url + "&fwurl=" + encodeURIComponent(result_url);
                    }
                    //result_url = "#";
                    return result_url;
				}
				
				/**
			     * @ngdoc function
			     * @name productContainer.function:productReviewClick
			     * @description
			     * 상품 리뷰 클릭
			     * @example
			     * $scope.productReviewClick(item)
			     * @param {Object} item 상품 json data
			     */
				scope.productReviewClick = function (item) {
					scope.productInfoProc(item, 'review', this.$index + 1);
				}
				/**
			     * @ngdoc function
			     * @name productContainer.function:productInfoClick
			     * @description
			     * 상품 클릭
			     * @example
			     * $scope.productInfoClick(item, type)
			     * @param {Object} item 상품 json data
			     * @param {Object} type 상품 Tyep 딜상품인지 아닌지에 대한 처리 
			     */
				scope.productInfoClick = function (item, type, index) {
					var idx = (index != undefined || index != null) ? index : this.$index;
                    
                    //201804 광고솔루션 하면서 추가로 수정 : 검색결과 리스트에 인덱스 추가 
                    if(item.nIdx){
                        idx = item.nIdx;
                    }
                    
					if (type) {
						scope.productInfoProc(item, type, idx + 1);
					} else {
						scope.productInfoProc(item, 'normal', idx + 1);
					}
				};

				/**
			     * @ngdoc function
			     * @name productContainer.function:productDealClick
			     * @description
			     * 딜 상품 클릭
			     * @example
			     * $scope.productDealClick(item)
			     * @param {Object} item 상품 json data
			     */
				scope.productDealClick = function (item) { // 딜상품 클릭
					scope.productInfoProc(item, 'deal', this.$index + 1);
				};
				/**
			     * @ngdoc function
			     * @name productContainer.function:setBaseParams
			     * @description
			     * 링크 URL을 판단하여 ?, & 파라메타 처리 후 Base Parameter 추가
			     * @example
			     * $scope.setBaseParams(url)
			     * @param {String} url 링크 url
			     */
				function setBaseParams(url) {
					var rtnUrl = "" + url;

					if (rtnUrl.indexOf("?") > -1) {
						rtnUrl = rtnUrl + "&";
					} else {
						rtnUrl = rtnUrl + "?";
					}

					return rtnUrl + scope.rScope.baseParam;
				}

				// 배너 클릭시
				scope.bannerClick = function (item) {
					var tClickCode = "";

					if (attrs.tclick) { // tclick 예외 케이스일때 공통 tclick
						tClickCode = attrs.tclick + (attrs.tclickStartIdx ? parseInt(attrs.tclickStartIdx) + this.$index : this.$index + 1);
					} else if (attrs.tclickBanner) { // tclick 예외 케이스일때 배너에 대한 tclick
						/* 기획 변경 배너 우선순위가 아닌 순번으로 해달라고 변경됨
						if  (item.bannerPrioriry || item.bannerPrioriry === 0) { // 배너 우선순위가 있는 경우
							tClickCode = attrs.tclickBanner + item.bannerPrioriry; // 배너 우선순위는 순번이 아니기 때문에 1을 더하지 않는다
						} else {
							tClickCode = attrs.tclickBanner + (attrs.tclickBannerStartIdx ? parseInt(attrs.tclickBannerStartIdx) + this.$index : this.$index + 1);
						}
						*/
						if (attrs.tclickBannerIdxKey) {
							tClickCode = attrs.tclickBanner + (attrs.tclickBannerStartIdx ? parseInt(attrs.tclickBannerStartIdx) + item[attrs.tclickBannerIdxKey] : item[attrs.tclickBannerIdxKey] + 1);
							console.log("tclickBannerIdxKey", attrs.tclickBannerIdxKey);
						} else {
							tClickCode = attrs.tclickBanner + (attrs.tclickBannerStartIdx ? parseInt(attrs.tclickBannerStartIdx) + this.$index : this.$index + 1);
						}
					} else {
						tClickCode = scope.rScope.tClickBase + scope.rScope.screenID + "_Clk_Ban_"+idxParam + (this.$index + 1);
					}

					if (item.link_url != "") {
						if (item.mov_frme_cd) { // 외부 링크 확인
							LotteLink.goOutLink(item.img_link);
							scope.rScope.sendTclick(tClickCode); // 외부 링크 tclick 수집
						} else {
							if(scope.rScope.curDispNoSctCd) {
								tClickCode += "&curDispNoSctCd=" + scope.rScope.curDispNoSctCd;
							}
							window.location.href = setBaseParams(item.img_link) + "&tclick=" + tClickCode;
						}
					}
				};

				scope.onAirClick = function (item) { // 닷컴 홈쇼핑 방송편성표
					var tClickCode = "m_DC_TV_schedule"; // 방송편성표는 Tclick 고정

					if (item.sched_link_url != "") {
						window.location.href = setBaseParams(item.sched_link_url) + scope.getTclicCurrentCode() + "&tclick=" + tClickCode;
					}
				};

				scope.best10ProductInfoClick = function (item) {
					var tClickCode = "";

					if (attrs.tclick) {
						tClickCode = attrs.tclick + (attrs.tclickStartIdx ? parseInt(attrs.tclickStartIdx) + this.$index : this.$index + 1);
					} else if (attrs.tclickProd) {
						tClickCode = attrs.tclickProd + (attrs.tclickProdStartIdx ? parseInt(attrs.tclickProdStartIdx) + this.$index : this.$index + 1);
					} else {
						tClickCode = scope.rScope.tClickBase + scope.rScope.screenID + "_Clk_Prd_"+idxParam + (this.$index + 1);
					}

					if (item.goodsNo != "") {
						window.location.href = LotteCommon.prdviewUrl + "?" + scope.rScope.baseParam + "&goods_no=" + item.goodsNo + scope.getTclicCurrentCode() + "&tclick=" + tClickCode;
					}
				};

				scope.trustSrc = function (src) { // YOUTUBE
					return $sce.trustAsResourceUrl(src);
				};

				scope.rankKeywordOpenFlag = false;

				scope.openRankKeyword = function () {
					scope.rankKeywordOpenFlag = !scope.rankKeywordOpenFlag;
				};

				scope.rankKeywordClick = function (item) { // 급상승 검색어 Item 클릭
					var tClickCode = "";

					if (attrs.tclickRank) {
						tClickCode = attrs.tclickRank + (this.$index + 1);
					} else {
						tClickCode = scope.rScope.tClickBase + scope.rScope.screenID + "_Clk_Ban_"+idxParam + (this.$index + 1);
					}

					if (item.kwd_nm != '') {
						window.location.href = LotteCommon.searchUrl + "?" + scope.rScope.baseParam + "&keyword=" + item.kwd_nm + scope.getTclicCurrentCode() + "&tclick=" + tClickCode;
					}
				};

				scope.etvMovSktDescClose = function (event, item) { // TV쇼핑 동영상 SKT 데이터 프리 레이어 감춤
					item.sktDescLayerCloseFlag = true;
					event.stopPropagation();
					return false;
				};

				scope.goSearch = function (keyword, tclick) { /*새 키워드 검색*/
		            /*tclick 있을 경우 tclick 수집을 위한 url parameter 추가*/
		            var tClickCode = "";

		            if (tclick) {
		                tClickCode = "&tclick=" + tclick;
		            }

		            /*URL 이동*/
		            window.location = LotteCommon.searchUrl + "?" + scope.rScope.baseParam + '&keyword=' + keyword + tClickCode;
		        };
		        
				scope.getSearch = function (keyword, tclick) { /*새 키워드 검색*/
		            /*tclick 있을 경우 tclick 수집을 위한 url parameter 추가*/
		            var tClickCode = "";

		            if (tclick) {
		                tClickCode = "&tclick=" + tclick;
		            }

		            /*URL 이동*/
		            //window.location = LotteCommon.searchUrl + "?" + scope.rScope.baseParam + '&keyword=' + keyword + tClickCode;
		            return LotteCommon.searchUrl + "?" + scope.rScope.getBaseParam(true) + '&keyword=' + keyword + tClickCode;
		        };

				scope.hashTagInfo = false;

		        scope.hashToday = function () { /* 해시태그 오늘 하루 안보기 */
	                LotteCookie.setCookie('hashTagInfo', 'Y', 1);
	                scope.hashTagInfo = false;
				};

				if (LotteCookie.getCookie('hashTagInfo') != 'Y') {
					scope.hashTagInfo = true;
				}
				
				scope.showStyleRecomm = commInitData.query.curDispNo == '5407118' ? true : false;
				scope.goStyleRecomm = function(imgUrl, tclick){
					var imgUrl2 = imgUrl.replace("280.jpg","550.jpg");
					window.location.href = LotteCommon.styleRecomUrl + "?img=" + imgUrl2 + "&"+ scope.rScope.getBaseParam(true) + "&cate=1&tclick=" + tclick;
				};
				
				scope.productDetailInfo = function(item, zIndex) {
					scope.rScope.getProductDetailInfo(item, this.$index, zIndex);
				}

				scope.setAgeGender = function(item, idx, flag) {
					var newItem = {age:item.find_age, gender:item.find_gender}
					scope.rScope.setAgeGender(newItem, idx, flag);
				}
			}
		};
	}]);

	// 상품 더보기 자동 스크롤
	commProduct.directive("moreProductContiner",['$rootScope','$window', '$parse', '$http' , '$log', 'LotteCommon', 'LotteUtil', function ($rootScope , $window, $parse,$http,$log,LotteCommon, LotteUtil) {
		return {
			link : function($scope, el, attrs) {
				var loadMoreHandler = $parse(attrs.moreProductContiner);
                
				$scope.rScope = LotteUtil.getAbsScope($scope);

				$scope.moreProductListCheck = function(e) {
					//console.log("e", e);
                    //20170309 추가 
                    var movfnc = $parse(attrs.swipeMove);
                    if(movfnc != undefined){
                        movfnc($scope);
                    }                                        
					if(e.max-3 == e.idx) {                        
						loadMoreHandler($scope);
					}
				}

				if ($scope.rScope.productMoreScroll) {
					var $win = angular.element($window),
						$body = angular.element("body"),
						winH = $win.height(),
						bodyH = $body[0].scrollHeight,
						scrollRatio = 4.0, // 윈도우 높이의 4배
						moreLoadTime = 0;

					$win.on("scroll" , function (e) {
						if (!$scope.rScope.scrollFlag) {
							e.preventDefault();
							return ;
						}

						if (!$scope.rScope.productMoreScroll || $scope.rScope.productListLoading || $scope.rScope.pageLoading) {
							return ;
						}

						if($scope.templateType == 'swipe') {
							return ;
						}

						bodyH = $body[0].scrollHeight;

						if ($win.width() >= 640) { // 그리드가 2단 이상일 경우 로드 비율을 낮춘다
							scrollRatio = 2; // 윈도우 높이의 2배
						} else {
							scrollRatio = 4.0; // 윈도우 높이의 4배
						}

						if ($win.scrollTop() + winH >= bodyH - (winH * scrollRatio)) {
							$scope.$apply(attrs.moreProductContiner);
						}
					});
				}
			}
		}
	}]);

	commProduct.directive("zoomProductContiner",['$rootScope', '$parse', '$compile', '$http' , '$timeout', 'LotteCommon' , 'LotteScroll', 'LotteUtil', function($rootScope,$parse,$compile,$http,$timeout,LotteCommon,LotteScroll, LotteUtil) {
		return {
			template: '<div class="zoomImageWrap"><div class="unit_zoomImage" ng-show="zoomImageFalg"><span class="btn_close" ng-click="zoomImageClose()"></span><p class="img"><img ng-src="{{zoomImageSrc|| \'//:0\'}}" alt="{{zoomImageTitle}}" /></p></div><div class="unit_zoomImage zoomSwipe" ng-show="zoomSwipeFalg"><span class="btn_close" ng-click="zoomImageClose()"></span><div class="mask"></div><div class="swipeArr" ng-if="zoomSwipeList.length > 0"><a ng-click="beforeSlide()" ng-show="swipeIdx > 0" class="arrPrev">이전</a><a ng-click="nextSlide()" ng-show="swipeIdx <=(zoomSwipeList.length-2)" class="arrNext">다음</a></div><div class="swipeNum" ng-show="zoomSwipeList.length > 1"><span class="numWrap"><span class="currentNum">{{swipeIdx+1}}</span>/<span class="totalNum">{{zoomSwipeList.length}}</span></span></div></div></div>',
			replace: true,
			link : function($scope, el, attrs) {
				$scope.zoomImageFalg = false;
				$scope.zoomSwipeFalg = false;
				$scope.zoomImageSrc = "";
				$scope.zoomImageTitle = "";

				$scope.zoomImageClose = function() {
					if($scope.zoomImageFalg) {
						$scope.dimmedClose();
						$scope.zoomImageFalg = false;
						$scope.scrollFlag = true;
						LotteScroll.enableScroll();
					}else if($scope.zoomSwipeFalg) {
						$scope.dimmedClose();
						$scope.zoomSwipeFalg = false;
						$scope.scrollFlag = true;
						LotteScroll.enableScroll();
					}
				}

				$scope.zoomImageClick = function(url) {
					if(url != null) {
						url = url.replace("60.jpg","550.jpg");
						url = url.replace("280.jpg","550.jpg");
					}

					$scope.dimmedOpen({
						target: "imageZoom",
						callback: this.zoomImageClose,
						scrollEventFlag: true
					});
					$scope.scrollFlag = false;
					LotteScroll.disableScroll();
					$scope.sendTclick($scope.tClickBase+$scope.$$childHead.screenID+'_Clk_Elg');
					$timeout(function() {
						$scope.$apply(function() {
							$scope.zoomImageSrc = url;
							$scope.zoomImageFalg = true;
						});
					});
				}
				$scope.zoomImageSwipeClick = function(item) {
					if(item.goods_no == undefined) return false;
					var goodsNo = item.goods_no + '';

					$('.zoomSwipe .mask').html('');
					if(item.limit_age_yn == 'Y' && !$scope.loginInfo.isAdult) {// 로그인 안한 경우 성인상품
						$scope.zoomSwipeList = null;
						$('.zoomSwipe .mask').html($compile('<ol class="swipeImg noImg"><li><img ng-src="http://image.lotte.com/lotte/mobile/sub/img_19_280x280.png" alt="" /></li></ol>')($scope));
						$scope.sendTclick($scope.tClickBase+$scope.$$childHead.screenID+'_Clk_1_Elg');
					}else{
						$http.get(LotteCommon.listGoodsImgData, {params : {goods_no : goodsNo}})
						.success(function(data) {
							$scope.zoomSwipeList = data.contents.imgList.items;
							$('.zoomSwipe .mask').html($compile('<ol class="swipeImg" lotte-ng-list-swipe swipe-list-model="zoomSwipeList" swipe-slide-item="false" swipe-end-exec="zoomSwipeEnd($event)"><li ng-repeat="item in zoomSwipeList"><img ng-src="{{item.img_url}}" alt="" err-src /></li></ol>')($scope));
							$scope.sendTclick($scope.tClickBase+$scope.$$childHead.screenID+'_Clk_1_Elg');
						})
						.error(function () {
							console.log('Data Error : 상품기본정보 로드 실패');
						});
					}

					$scope.dimmedOpen({
						target: "imageZoom",
						callback: this.zoomImageClose,
						scrollEventFlag: true
					});
					$scope.zoomSwipeFalg = false;
					LotteScroll.disableScroll();
					$timeout(function() {
						$scope.$apply(function() {
							$scope.zoomSwipeFalg = true;
						});
					});
				}
				$rootScope.zoomSwipeEnd = function(evt){
					$scope.sendTclick($scope.tClickBase+$scope.$$childHead.screenID+'_Swp_'+eval(evt.idx+1)+'_Elg');
				}
			}
		}
	}]);

})(window, window.angular);