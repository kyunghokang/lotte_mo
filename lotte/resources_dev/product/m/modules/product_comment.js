/**
 * product module: product-comment
 * [상품상세] 상품평
 */

(function(window, angular, undefined) {
	var app = angular.module('app');
	app.directive('productComment', ['$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil', 'Fnproductview',
		function ($http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil, Fnproductview) {
			return {
				templateUrl : "/lotte/resources_dev/product/m/modules/product_comment.html",
				replace : true,
				link : function ($scope, el, attrs) {
					
					$scope.dummyUrl = "http://image.lotte.com/lotte/mo2018/reviews/default_profile.png";

					$scope.loadProductComment = function() {
						if(!$scope.pageUI.isLoad.product_comment) {
							if($scope.pageUI.data.callUrlInfo.commentInfoUrl) {
								$scope.pageUI.isLoad.product_comment = true;
								var url = LotteCommon.productCommentDataNew;
								$http.get(url, {
			        				params : {
			        					goods_no : $scope.pageUI.data.commonInfo.goodsNo,
			        					usm_goods_no : $scope.pageUI.data.commonInfo.usmGoodsNo
			        				}
			        			})
								.success(function (data) {
									if(data.data) {
										$scope.pageUI.loadData.product_comment = data.data;
										if(data.data.easnGdasSummaryList && data.data.easnGdasSummaryList.items && data.data.easnGdasSummaryList.items.length){
											$scope.pageUI.loadData.product_comment.easnGdasSummary = formatSummary(data.data.easnGdasSummaryList.items);
										}
									}
								});
							}
						}
					};
					
					function formatSummary(list){
						var obj = {};
						var arr = [];
						for(var i = 0; i< list.length; i++){
							if(!obj[list[i].gdas_item_no]){
								obj[list[i].gdas_item_no] = list[i];
								arr.push(list[i]);
							}
						}
						return arr;
					}
					
					$scope.productInfoDetailMore = function() {
						$scope.pageUI.productInfoMoreBtn = false;
					};
					
					// 상품평추천
			        $scope.recommClick = function (item) {
			            if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
			            	alert("로그인을 해주세요.");
			            	Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
					    } else {
							if (item.regRecommUrl) {
								item.myRecomm = true;
								//item.recommYn = true;
								
								$http.get(LotteCommon.isTestFlag ? LotteCommon.regRecomUrl : item.regRecommUrl)
								.success(function (data) {
									if (data.data) {
										alert(data.data.resultMsg);
			
										if (data.data.resultCode) {
											switch (data.data.resultCode) {
												case "01": // 01: 추천하셨습니다.
												case "02": // 02: 추천하셨습니다. 클로버 20개 적립되었습니다. ID당 1일 3회까지 지급됩니다.
													item.recommCnt = item.recommCnt + 1;
												case "03": // 03: 이미 추천하셨습니다.
													item.recommYn = true;
													break;
												case "04": // 04: 본인이 작성한 상품평에는 추천하실 수 없습니다.
												case "05": // 05: 다시한번 시도해주시기 바랍니다.
												case "06": // 06: 추천 가능한 횟수는 1일 10회입니다.
													item.recommYn = false;
													break;
											}
										}
									} else {
										alert("다시 한번 시도해주시기 바랍니다.");
										item.recommYn = false;
									}
								});
							}
			            }
			        };
					
					$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
						if($scope.pageUI.isLoad.product_comment===true){ return; }
						if (args.winHeight * 1.6 <= args.scrollPos + args.winHeight) {
							//console.log("product comment load");
							$scope.loadProductComment();
						}
					});
					
					$scope.moreCmt = function(){
						angular.element('.cmt_list_wrap .cmt_list li .cmtLongTxt').eq(this.$index).show();
						angular.element('.cmt_list_wrap .cmt_list li .cmtShortTxt').eq(this.$index).hide();
					};

					// $scope.cmtSpread = function (event) { // 해당 상품평 펼쳐보기
					// 	$(event.target).addClass('spread');
					// };

					function preventScrollEvent(e){
						e.preventDefault();
					}

					$timeout(function(){
						$scope.supportPassive = LotteUtil.supportPassive();
					}, 300);

					$scope.showReviewOne = function(items){
						var scrollFlag = false;
						if($scope.supportPassive){
							document.addEventListener('touchmove', preventScrollEvent, { passive: false });
							scrollFlag = true;
						}
	            		$('#lotteDimm').css('z-index', '115');
						$scope.dimmedOpen({
							callback: $scope.hideReviewOne,
							scrollEventFlag: scrollFlag
						});
						$timeout(function(){
							$scope.sb_review_index = 1;
							$scope.arrReviewOne = items;
						}, 200);
					};
					$scope.hideReviewOne = function(){
						$scope.arrReviewOne = [];
						$('#lotteDimm').css('z-index', '100');
						if($scope.supportPassive)	document.removeEventListener('touchmove', preventScrollEvent, false);
					};
					
					/* video controls */
					$scope.reviewSwipeCurIdx = 0;
					$scope.sb_review_index = 1;
					
					$scope.swipeReviewEnd = function(idx) {
						if (idx == $scope.reviewSwipeCurIdx) {
	        				return;
	        			}
						$scope.swipeReviewVideoStop(); // 동영상 정지
						$scope.sb_review_index = idx + 1;
						$scope.reviewSwipeCurIdx = idx;
					};
					
					// 동영상 정지
					$scope.swipeReviewVideoStop = function(){
						$(".lv_wrap video").each(function(idx, item){
							if ($(item).siblings(".stop_cover:visible, .click_cover:visible").length>=1){
								$timeout(function(){
									$(item).siblings(".btn_stop").trigger("click");
								}, 10);
							}
						});
					};
					
			        $scope.getReviewSwipeControl = function(control){
			            $scope.swipeReviewControl = control;
			            $scope.reviewSwipeCurIdx = $scope.swipeReviewControl.getIndex();
			        };

					$scope.swipeBeforeReview = function() {
						if($scope.reviewSwipeCurIdx === 0){
							$scope.reviewSwipeCurIdx = $scope.arrReviewOne.length;
						}else{
							$scope.reviewSwipeCurIdx--;
						}
						$scope.swipeReviewControl.moveIndex($scope.reviewSwipeCurIdx);
						
						if($scope.sb_review_index == 1) {
						 	$scope.sb_review_index = $scope.arrReviewOne.length;
						}else{
							$scope.sb_review_index--;
						}
					};
					
					$scope.swipeNextReview = function() {
						if($scope.reviewSwipeCurIdx === $scope.arrReviewOne.length -1){
							$scope.reviewSwipeCurIdx = 0;
						}else{
							$scope.reviewSwipeCurIdx++;
						}
						$scope.swipeReviewControl.moveIndex($scope.reviewSwipeCurIdx);
						
						if($scope.sb_review_index == $scope.arrReviewOne.length) {
						 	$scope.sb_review_index = 1;
						}else{
							$scope.sb_review_index++;
						}
					};
					
					$scope.linkThumbClick = function (linkUrl, tclick, isAll, idx) {
						//console.log('linkUrl', linkUrl);

						//20180830 GA태깅 추가
						if(idx < 4){
							$scope.logGAEvtPrdView('상품평','사진/영상_0' + (idx + 1));
						}

						if(isAll){
							
							//20180830 GA태깅 추가
							$scope.logGAEvtPrdView('상품평','사진/영상더보기');

							$window.location.href = LotteCommon.productSubCommentImage + '?goods_no=' + $scope.pageUI.data.commonInfo.goodsNo + '&usm_goods_no=' + ( $scope.pageUI.data.commonInfo.usmGoodsNo || "") + '&' + $scope.pageUI.baseParam + "&tclick=" + tclick;
							return;
						}
						$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.pageUI.baseParam + "&tclick=" + tclick);
					};
					// 해당 상품평 상세
					$scope.productCommentOne = function(gdasNo) {
						location.href = LotteCommon.productSubCommentEach + "?" + $scope.pageUI.baseParam + "&goods_no=" + $scope.pageUI.data.commonInfo.goodsNo + "&gdas_no=" + gdasNo + "&usm_goods_no=" + ( $scope.pageUI.data.commonInfo.usmGoodsNo || "");
					};
					// 리뷰어홈 또는 내 상품평관리 가기
					$scope.goReviewerHome = function(item){
						if(!item.reviewerHomeUrl)	return;
						location.href = item.reviewerHomeUrl.indexOf('?') > -1 ? item.reviewerHomeUrl + "&" + $scope.baseParam : item.reviewerHomeUrl + "?" + $scope.baseParam
					};
				}
			}
	}]);

	app.filter('cmtShortTxt', function(){
		return function (txt) {
			return txt.substring(0, 73);
		}
	});
	
	app.directive('onErrorSrc2', function() {
 	    return {
 	        link: function(scope, element, attrs) {
 	          element.bind('error', function() {
 	        	  //console.log('attrs.curIndex ' + attrs.curIndex);
 	        	  if(!attrs.curIndex)	return;
 	        	  if(scope.pageUI.loadData.product_comment.critList.items[attrs.curIndex - 1].reviewerImgUrl != scope.dummyUrl){
 	        		 scope.pageUI.loadData.product_comment.critList.items[attrs.curIndex - 1].reviewerImgUrl = scope.dummyUrl;
 	        	  }
 	          });
 	        }
 	    }
	 });
	 
	// 사진레이어에서 첫번째 이미지가 작게 나오는 현상 수정 위해 사용
   	// 무한스와이프인 경우 초기에 정보를 줘야 해서 사용함.
   	app.directive('onImgLoaded', function() {
   	    return {
   	        link: function(scope, element, attrs) {
   	        	angular.element(element).on('load', function() {
   	        		var $this = this;
   	        		var idx = attrs.curIdx;
   	        		//console.log('load  '+ idx);
   	        		
   	        		setTimeout(function(){
   	        			//console.log($this.clientWidth, $this.clientHeight);
   	        			if(!$this.clientWidth || !$this.clientHeight)	return;
   	        			
   	        			if($this.clientWidth >= $this.clientHeight){
   	        				scope.pageUI.loadData.product_comment.critList.items[idx].photoList.items[0].typeClass = 'wid';
   	        			}else{
   	        				scope.pageUI.loadData.product_comment.critList.items[idx].photoList.items[0].typeClass = 'hei';
   	        			}
   	        		}, 500);
				}).each(function() {
					if(this.complete){
						angular.element(this).trigger('load');
					}
				});
   	        }
   	    }
   	});
	
})(window, window.angular);