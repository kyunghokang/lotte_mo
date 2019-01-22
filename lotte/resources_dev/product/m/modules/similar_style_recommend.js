/**
 * [상품상세] 비슷한 스타일 추천
 * product module: similar-style-recommend
 */
(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('similarStyleRecommend', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 'StyleRecom', 'LotteUserService', 'commInitData', 
		function ($http,$timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil, StyleRecom, LotteUserService, commInitData) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/similar_style_recommend.html",
				replace : true,
				link : function ($scope, el, attrs) {
					$scope.similarSwipeIdx = 0;
					$scope.similarSwipeContCnt = 0;
					$scope.similarStyleRecomMoreUrl = "";

					$scope.similarStyleSwipeEndHandler = function (idx) {
						$scope.similarSwipeIdx = idx;
					};
					
					$scope.loadProductSimilarStyle = function() {
						if(!$scope.pageUI.isLoad.product_similarStyle) {
							if ($scope.pageUI.data.callUrlInfo.styleRecommInfoUrl) {
								$scope.pageUI.isLoad.product_similarStyle = true;

								var detectImgUrl = ($scope.pageUI.data.imgInfo.imgList[0] + "").replace("_280", "_550"); // 550 사이즈 이미지로 변경

								StyleRecom.setTclickBase = $scope.tClickRenewalBase; // Error Tclick 리뉴얼용으로 변경

								var obj = {
									"image"		: detectImgUrl,
									"goodsNo"	: commInitData.query["goods_no"],
									"screen"	: "detail"
								}
								//StyleRecom.detect(detectImgUrl, function (list) {
								StyleRecom.detect(obj, function (list) {
									if (list.length > 0) { // 리턴 결과가 있을 경우 스타일 추천 데이터 사용 (없을 경우 비노출)
										var cate = list[0].category; // 1, 2, 4, 8, 16, 32
										$scope.pageUI.StyleRecomSortCate = cate;
										//var selectedSex = "A"; // A: 전체, M: 남성, F: 여성
										//var item = list[0];
										//var genCd = item.genCd;
										
										LotteUserService.loadLoginInfoComplete.then(function () { // 로그인 정보 보장
											/*if (cate == 1 || cate == 8) { // 1, 8 일 경우 여성 카테고리
												selectedSex = "F"; // 여성으로 고정
											}else if(genCd == "M" || genCd == "F"){
												selectedSex = genCd; // 여성으로 고정
											} else { // 1, 8이 아닐 경우에는 현재 로그인 정보의 성별 이용
												if ($scope.loginInfo.isLogin && $scope.loginInfo.genSctCd){
													selectedSex = $scope.loginInfo.genSctCd; // 현재 로그인정보의 성별 정보로 세팅
												}
											}*/
											var imgInfo = $scope.pageUI.data.imgInfo;
											var sex = StyleRecom.determineSex(list[0], imgInfo.genCd, imgInfo.styleRecommCatGrpCd, $scope.loginInfo.genSctCd);
											
											/*var prdGen = $scope.pageUI.data.imgInfo.genCd;
											var prdCtg = "" + $scope.pageUI.data.imgInfo.styleRecommCatGrpCd;
											var memSex = $scope.loginInfo.genSctCd;
											if(item.genOnly != ""){
												// 전용 성별 카테고리
												selectedSex = item.genOnly;
											}else if(prdGen == "F" || prdGen == "M"){
												// 상품 성별
												selectedSex = prdGen;
											}else{
												if(prdCtg == "5"){
													// 아동복
													selectedSex = genCd;
												}else{
													// 기타
													if(memSex == "F" || memSex == "M"){
														// 현재 로그인정보의 성별 정보로 세팅
														selectedSex = memSex;
													}else{
														selectedSex = genCd;
													}
												}
											}*/

											var styleCat = undefined;

											if ($scope.pageUI.data.imgInfo.styleRecommCatGrpCd != undefined) {
												styleCat = $scope.pageUI.data.imgInfo.styleRecommCatGrpCd;
											}

											// 스타일샵 API URL 세팅
											//StyleRecom.setDotAPIUrl($scope.pageUI.data.callUrlInfo.styleRecommInfoUrl);
											//StyleRecom.setSearchItemLimit(50); // 검색 상품 개수 제한 추가

											//id, sex, cate, subcate, cb, limitCnt
											//StyleRecom.search(list[0].id, sex, cate, styleCat, function (data, styleShopUrl) {
											var obj = {
												"id"		: list[0].id,
												"sex"		: sex,
												"cate"		: cate,
												"subcate"	: styleCat,
												"count"		: 50,
												"goodsNo"	: commInitData.query["goods_no"],
												"screen"	: "detail"
											};
						            		if(list[0].sub_category.score > 0.2){
						            			obj.sub_cate = list[0].sub_category.code;
						            		}
											//data.goods_no, data.productViewYn, data.isApp
											//commInitData.query["goods_no"], 'detail', $scope.appObj.isApp, 100);
											//StyleRecom.search(obj, function (data, styleShopUrl) {
											StyleRecom.search(obj, function (data) {
												//$scope.similarStyleRecomMoreUrl = LotteCommon.isTestFlag ? LotteCommon.styleRecomUrl + "?img=http://image.lotte.com/goods/81/72/32/17/17327281_1_550.jpg&cate=1" : styleShopUrl;

												var tempData = data.slice(0, 12), // 최대 12개 데이터만 사용
													slice3multiple = Math.floor(tempData.length / 3);
													style_list = tempData.slice(0, slice3multiple * 3); // 데이터를 3의 배수 개수로 노출 되도록 가공

												var similarStyleProdArr = [],
													i = 0,
													j = 0;
												
												// console.log("slice3multiple", slice3multiple);
												// console.log("style_list.length", style_list.length);

												for (i; i < style_list.length; i++) { // 6개씩 끊어서 담기
													if (i % 6 == 0 && i != 0) {
														j++;
													}

													if (typeof similarStyleProdArr[j] == "undefined") {
														similarStyleProdArr[j] = [];
													}

													similarStyleProdArr[j].push(style_list[i]);
												}

												$scope.similarSwipeContCnt = j + 1;
												$scope.pageUI.loadData.product_similarStyle = similarStyleProdArr;
											}, 100);//, commInitData.query["goods_no"], 'detail', $scope.appObj.isApp, 100);
										});
									}
								});//, commInitData.query["goods_no"], 'detail', $scope.appObj.isApp);
							}
						}
					};

					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						/*if ($scope.pageUI.isLoad.product_similarStyle === true || !$scope.pageUI.data || !$scope.pageUI.data.imgInfo || !$scope.pageUI.data.imgInfo.styleIconYn) { // 이미 로드 되었거나, 스타일 추천 대상 상품이 아닌 경우 로드하지 않음
							return;
						}*/
						if($scope.pageUI.isLoad.product_similarStyle === true){ return; }
						if(typeof($scope.pageUI.data) == "undefined" || typeof($scope.pageUI.data.imgInfo) == "undefined"){ return; }
						if($scope.pageUI.data.imgInfo.styleRecomYn === false){ return; }
						
						try{
							switch($scope.pageUI.data.imgInfo.styleDispCd){
							case 1:// 상품상세 아이콘만 노출
								$scope.pageUI.data.imgInfo.styleIconYn	= true;
								$scope.pageUI.data.imgInfo.styleRecomYn	= false;
								break;
							case 2:// 상품상세 아이콘 + 하단 상품 함께 노출
								$scope.pageUI.data.imgInfo.styleIconYn	= true;
								$scope.pageUI.data.imgInfo.styleRecomYn	= true;
								break;
							case 3:// 상품상세 하단 상품만 노출
								$scope.pageUI.data.imgInfo.styleIconYn	= false;
								$scope.pageUI.data.imgInfo.styleRecomYn	= true;
								break;
								
							default:// 상품상세 아이콘 + 하단 상품 모두 비노출
								$scope.pageUI.data.imgInfo.styleIconYn	= false;
								$scope.pageUI.data.imgInfo.styleRecomYn	= false;
								break;
							}
						}catch(e){
							return;
						}

						if ($scope.pageUI.data.imgInfo.styleRecomYn === true && args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							console.log("product similarStyle load");
							$scope.loadProductSimilarStyle();
							//$scope.rScope.sendTclick($scope.moduleData.tclick + '_'+ $scope.moduleData.uiData.tabDispNo +'_Clk_load'+$scope.numberFill(($scope.moduleData.uiData.page+1),2));
						}
					});

					// 비슷한 스타일 추천 더보기
					$scope.goStyleRecomMore = function () {
						
						//20180830 GA태깅 추가
						$scope.logGAEvtPrdView('비슷한스타일추천','더보기');

						var obj = {
			    			"tclick"	: "m_RDC_ProdDetail_Clk_RelSty_more",
			    			"img"		: $scope.pageUI.data.imglist[$scope.sb_index - 1].img,
			    			"goods_no"	: commInitData.query["goods_no"],
			    			//"cate"		: $scope.CATE_NO,
			    			"prdGen"	: $scope.pageUI.data.imgInfo.genCd,
			    			"sortCate"	: $scope.pageUI.StyleRecomSortCate
			    		}
						location.href = $scope.pageUI.data.imgInfo.styleShopUrl + "&" + $scope.getBaseParam(true) + "&" + $.param(obj);

						//var url = $scope.pageUI.data.imgInfo.styleShopUrl;
						//var img = $scope.pageUI.data.imglist[$scope.sb_index - 1].img;
						//location.href = $scope.baseLink(url) + "&img=" + img + tclick + "&goods_no=" + commInitData.query["goods_no"] + "&prdGen=" + $scope.pageUI.data.imgInfo.genCd;
						
						
						/*var tclick = "m_RDC_ProdDetail_Clk_RelSty_more";
						 * 
						if ($scope.similarStyleRecomMoreUrl) {
							$window.location.href = $scope.baseLink($scope.similarStyleRecomMoreUrl) + "&tclick=" + tclick + "&goods_no=" + commInitData.query["goods_no"];
						} else {
							$scope.goStyleRecom(0, tclick);
						}*/
					};
				}
			}
	}]);
})(window, window.angular);