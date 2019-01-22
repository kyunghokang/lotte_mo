(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteNgSwipe',
        'lotteVideo',
        'lotteSlider'
    ]).config([
        '$compileProvider',
        function($compileProvider) {
        	$compileProvider.aHrefSanitizationWhitelist(/^\s*(http|https|javascript):/);
        }
    ]);
    
    app.controller('mylotteCritViewCtrl', ['$scope', '$rootScope', 'LotteCommon', '$http', '$filter', '$window', '$timeout', 'LotteUtil', 'LotteForm', 'LotteUserService', 'LotteGA', function($scope, $rootScope, LotteCommon, $http, $filter, $window, $timeout, LotteUtil, LotteForm, LotteUserService, LotteGA) {
    	$scope.showWrap = true;
    	$scope.contVisible = true;
    	$scope.subTitle = "내 상품평"; /* 서브헤더 타이틀 */
    	
    	$scope.isShowThisSns = false; /*공유버튼*/
    	$scope.tabControl = LotteUtil.getParameter('mode') || 'first'; // 상단 탭 컨트롤, 페이지 진입 시 보여줄 탭 ('first':'작성 가능한 상품평', 'second':'내가 작성한 상품평')
    	$scope.jsonLoading = false; // 로딩커버
    	$scope.gaCtgName = "MO_내 상품평";
    	
    	$scope.pageUI = {};
    	
		// 조회
    	var displayCnt = 20;
    	
    	$scope.unwrittenCommentList = {};
    	$scope.unwrittenPageNum = 1;
    	$scope.unwrittenCurrentRows = 0;
    	$scope.completeGetUnwrittenComment = false;
    	$scope.completeGetWrittenComment = false;
    	
    	$scope.writtenCommentList = {};
    	$scope.writtenPageNum = 1;
    	$scope.writtenCurrentRows = 0;
    	
    	$scope.dummyUrl = 'http://image.lotte.com/lotte/mo2018/reviews/default_profile.png';
    	
		/*($scope.getCritEvent = function () {
			$http.get(LotteCommon.critEventData).success(function(data){
				$scope.critEvent = data.critEventBanner;
			}).error(function(ex){
				alert('처리중 오류가 발생하였습니다.');
				if (ex) ex();
			});
		})();*/

 		try {
 			// getUnwrittenCommentListData(): 작성 가능한 상품평 목록 가져오기
 			($scope.getUnwrittenCommentListData = function() {
 				$scope.ajaxLoadFlag = true;
	 			$http.get(
	 				LotteCommon.unwrittenCommentListData + '?' + $scope.baseParam + '&display_cnt=' + displayCnt + '&page_num=' + $scope.unwrittenPageNum
	 			).success(function(data) {
	 				if ($scope.unwrittenPageNum == 1) {
	 					$scope.unwrittenCommentList = data.unwritten_comment_list;
	 				} else {
	 					$scope.unwrittenCommentList.list.items = $scope.unwrittenCommentList.list.items.concat(data.unwritten_comment_list.list.items);
	 				}
	 				$scope.unwrittenPageNum++;
	 				$scope.unwrittenCurrentRows += data.unwritten_comment_list.list.total_count;
	 				$scope.completeGetUnwrittenComment = true;
		    	}).error(function(ex) {
					// ajaxResponseErrorHandler(ex);
					if (ex.error) {
						var errorCode = ex.error.response_code;
						var errorMsg = ex.error.response_msg;

						if (errorCode == "9004") {
							var targetUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
							location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&" + targetUrl;
						} else {
							alert("[" + errorCode + "] " + errorMsg);
						}
					} else {
						alert("처리중 오류가 발생하였습니다.");
					}
		        }).finally(function() {
		        	$scope.ajaxLoadFlag = false;
		        });
 			})();
 			
 			// getWrittenCommentListData(): 작성한 상품평 목록 가져오기
 			($scope.getWrittenCommentListData = function() {
 				$scope.ajaxLoadFlag = true;
 				$http.get(
	 				LotteCommon.writtenCommentListData + '?' + $scope.baseParam + '&display_cnt=' + displayCnt + '&page_num=' + $scope.writtenPageNum
	 			).success(function(data) {
	 				if ($scope.writtenPageNum == 1) {
	 					$scope.writtenCommentList = data.written_comment_list;
	 				} else {
	 					$scope.writtenCommentList.list.items = $scope.writtenCommentList.list.items.concat(data.written_comment_list.list.items);
	 				}
	 				$scope.writtenPageNum++;
	 				$scope.writtenCurrentRows += data.written_comment_list.list.total_count;
	 				$scope.completeGetWrittenComment = true;
		    	}).error(function(ex) {
					// ajaxResponseErrorHandler(ex);
					if (ex.error) {
						var errorCode = ex.error.response_code;
						var errorMsg = ex.error.response_msg;

						if (errorCode == "9004") {
							var targetUrl = "targetUrl=" + encodeURIComponent(location.href, 'UTF-8');
							location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&" + targetUrl;
						} else {
							alert("[" + errorCode + "] " + errorMsg);
						}
					} else {
						alert("처리중 오류가 발생하였습니다.");
					}
		        }).finally(function() {
		        	$scope.ajaxLoadFlag = false;
		        });
 			})();
 		} catch (e) {
 			console.error(e);
 			$scope.ajaxLoadFlag = false;
 		}
 		
 		$scope.getReviewData = function() {
			$scope.ajaxLoadFlag = true;
 			$http.get(LotteCommon.favoriteReviewerList).success(function(data) {
 				if(data.favoriteReviewer){
 					if(data.favoriteReviewer.profile){
 						$scope.pageUI.profile = data.favoriteReviewer.profile;
 					}
 					if(data.favoriteReviewer.reviewerList && data.favoriteReviewer.reviewerList.items && data.favoriteReviewer.reviewerList.items.length){
 						$scope.pageUI.favorite_reviewer = data.favoriteReviewer.reviewerList;
 					}
 					if(data.favoriteReviewer.commentTipInfo && data.favoriteReviewer.commentTipInfo.items && data.favoriteReviewer.commentTipInfo.items.length){
 						$scope.pageUI.commentTipInfo = data.favoriteReviewer.commentTipInfo;
 					}
 				}
	    	}).error(function(ex) {
				console.log("처리중 오류가 발생하였습니다.");
	        }).finally(function() {
	        	$scope.ajaxLoadFlag = false;
	        });
		};
 		
 		LotteUserService.promiseLoginInfo().then(function(loginInfo){
			$scope.loginInfo = loginInfo;
			$scope.getReviewData();
		}).catch(function(loginInfo){
			$scope.loginInfo = loginInfo;
			$scope.getReviewData();
		});
 		
 		$scope.addZero = function( n ) {
            return n<10?'0'+n:n;
        };
    	
 		// getCommentWriteUrl(): 상품평 쓰기 URL 생성
    	$scope.getCommentWriteUrl = function(index) {
    		var url = '#';
    		// 작성제한 확인 
    		if (!$scope.unwrittenCommentList.no_write_user) { 
    			alert($scope.unwrittenCommentList.rs_no_write_msg);
    			return;
    		}
			var comment = $scope.unwrittenCommentList.list.items[index];
			var params = $scope.baseParam + '&curDispNo=' + LotteUtil.getParameter('curDispNo');
			params += '&goods_no=' + comment.goods_no;
			if (comment.goods_tp_cd == "20") {
				// FIXME '20' -> 상수로 수정 (ConstCode.ST_STD_CD_GOODS_TP_CD_E_COUPON)
				params + '&smp_psb_yn=Y';
			}
			if (comment.smp_cpn_goods_tp_cd == '01' && comment.smp_cpn_goods_tp_dtl_cd == '01') { 
				// FIXME '01' -> 상수로 수정 (ConstCode.ST_STD_CD_SMP_CPN_GOODS_TP_CD_EXCHANGE, ConstCode.ST_STD_CD_SMP_CPN_GOODS_TP_DTL_CD_EXCHANGE)
				params += "&smp_dept_yn=Y&smp_cpn_entr_no=" + comment.smp_cpn_entr_no;
			}
			
			LotteGA.evtTag($scope.gaCtgName, "상품평 쓰기", $scope.addZero(index + 1), comment.goods_no);
			
			$timeout(function(){
				location.href = LotteCommon.commentWriteNewUrl + "?" + params;
			}, 300)
    	};
    	
    	$scope.goCommentRewrite = function(index){
    		LotteGA.evtTag($scope.gaCtgName, "내가 쓴 상품평", "수정하기");
    		if(confirm("작성한 상품평을 수정하시겠습니까?")){
    			var comment = $scope.writtenCommentList.list.items[index];
    			var params = $scope.baseParam + '&curDispNo=' + LotteUtil.getParameter('curDispNo');
    			params += '&gdas_no=' + comment.gdas_no + '&goods_no=' + comment.goods_no;
    			if (comment.goods_tp_cd == "20") {
    				// FIXME '20' -> 상수로 수정 (ConstCode.ST_STD_CD_GOODS_TP_CD_E_COUPON)
    				params + '&smp_psb_yn=Y';
    			}
    			if (comment.smp_cpn_goods_tp_cd == '01' && comment.smp_cpn_goods_tp_dtl_cd == '01') { 
    				// FIXME '01' -> 상수로 수정 (ConstCode.ST_STD_CD_SMP_CPN_GOODS_TP_CD_EXCHANGE, ConstCode.ST_STD_CD_SMP_CPN_GOODS_TP_DTL_CD_EXCHANGE)
    				params += "&smp_dept_yn=Y&smp_cpn_entr_no=" + comment.smp_cpn_entr_no;
    			}
        		var url = LotteCommon.commentRewriteNewUrl + "?" + params;
    			if(url){
    				$timeout(function(){
    					location.href = url;
    				}, 300);
    			}
    		}
    	};
    	
    	// 해당 상품평 상세
		$scope.commentDetail = function(gdasNo, goodsNo) {
			LotteGA.evtTag($scope.gaCtgName, "내가 쓴 상품평", "상세보기로이동");
			$timeout(function(){
				location.href = LotteCommon.productSubCommentEach + "?" + $scope.baseParam + "&goods_no=" + goodsNo + "&gdas_no=" + gdasNo;
			}, 300);
		};
		
		$scope.moreCmt = function(el){
			angular.element('.prod_eval .list.written .cmtLongTxt').eq(this.$index).show();
			angular.element('.prod_eval .list.written .cmtShortTxt').eq(this.$index).hide();
		};
		
		// deleteComment(): 상품평 삭제
    	$scope.deleteComment = function(gdas_no) {
    		LotteGA.evtTag($scope.gaCtgName, "내가 쓴 상품평", "삭제하기");
    		
    		$http.get(
    			LotteCommon.commentCountDeletedData + '?' + $scope.baseParam + '&gdas_no=' + gdas_no
    		).success(function(data) {
    			// 최근 1개월 동안 삭제한 상품평 수
    			var count = data.comment_count_deleted.deleted_count;
    			if (count == 2) {
    				if (!confirm('고객님께서는 최근 1개월 동안 총 2회 상품평을 삭제하셨습니다.\n지금 삭제하시면 앞으로 3개월간 상품평 작성 권한이 제한됩니다.\n삭제하시겠습니까?')) {
    					return;
    				}
    			} else {
    				if (!confirm('상품평을 삭제하시겠습니까? 삭제된 상품평은 다시 작성할수 없습니다.')) {
    					return;
    				}
    			}
    			// 삭제
	    		LotteForm.FormSubmitForAjax(
	    			LotteCommon.commentDeleteData + '?' + $scope.baseParam, { 'gdas_no': gdas_no }
        		).success(function(data) {
        			//alert('상품평을 삭제하였습니다.');
        			location.replace(LotteCommon.critViewUrl + "?" + $scope.baseParam);
        		}).error(function(ex) {
                });
	    	}).error(function(ex) {
	        });
    	};
    }]);
    
    /**
	 * 별점 정책 filter
	 * input: 입력값 5이하 값으로 소수점 있음
	 * convertPerfectScore: [옵션] 변환 만점 기준
	 */
	app.filter('starScorePolicy', function () {
		return function (input, convertPerfectScore) {
			if(!input) {return 0;}

			var originPerfectScore = 5;
			var newScore = Math.ceil(input * 2) / 2;

			if(convertPerfectScore != undefined){
				newScore = newScore / originPerfectScore * convertPerfectScore;
			}

			return newScore;
		}
	});
	
	app.filter('cmtShortTxt', function(){
		return function (txt) {
			return txt.substring(0, 73);
		}
	});
	
	app.filter('trusted', ['$sce', function ($sce) {
		return function(url) { 
			return $sce.trustAsResourceUrl(url); 
		};
	}]);
	
	// 이미지 에러시 처리
 	app.directive('onErrorSrc', function() {
 	    return {
 	        link: function(scope, element, attrs) {
 	          element.bind('error', function() {
 	        	  if(scope.pageUI.profile.imgUrl != scope.dummyUrl){
 	        		  scope.pageUI.profile.imgUrl = scope.dummyUrl;
 	        	  }
 	          });
 	        }
 	    }
 	});
 	
 	app.directive('onErrorSrc2', function() {
 	    return {
 	        link: function(scope, element, attrs) {
 	          element.bind('error', function() {
 	        	  //console.log('attrs.curIndex ' + attrs.curIndex);
 	        	  if(!attrs.curIndex)	return;
 	        	  if(scope.pageUI.favorite_reviewer.items[attrs.curIndex - 1].reviewerImgUrl != scope.dummyUrl){
 	        		 scope.pageUI.favorite_reviewer.items[attrs.curIndex - 1].reviewerImgUrl = scope.dummyUrl;
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
   	        				scope.writtenCommentList.list.items[idx].img_list.items[0].typeClass = 'wid';
   	        			}else{
   	        				scope.writtenCommentList.list.items[idx].img_list.items[0].typeClass = 'hei';
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

    app.directive('lotteContainer', ['$timeout', '$http', 'LotteCommon', 'LotteGA', 'LotteUtil', function($timeout, $http, LotteCommon, LotteGA, LotteUtil) {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/product/m/mylotte_crit_view_container.html',
            replace : true,
            link : function($scope, el, attrs) {
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
					$scope.dimmedOpen({
						callback: $scope.hideReviewOne,
						scrollEventFlag: scrollFlag
					});
        			$timeout(function(){
        				$scope.sb_review_index = 1;
        				$scope.arrReviewOne = items;
        			}, 200);
        			LotteGA.evtTag($scope.gaCtgName, "내가 쓴 상품평", "해당 상품평 사진/영상 크게보기");
        		};
        		$scope.hideReviewOne = function(){
					$scope.arrReviewOne = [];
					if($scope.supportPassive)	document.removeEventListener('touchmove', preventScrollEvent, false);
        		};
        		
        		/* swiper controls */
        		$scope.reviewSwipeCurIdx = 0;
        		$scope.sb_review_index = 1;
        		
        		$scope.swipeReviewEnd = function(idx) {
        			$scope.swipeReviewVideoStop(); // 동영상 정지
        			if (idx == $scope.reviewSwipeCurIdx) {
        				return;
        			}
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
        		
        		var $cont = angular.element("body")[0];
        		$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
        			if($scope.tabControl == 'first' && $scope.unwrittenCurrentRows >= $scope.unwrittenCommentList.total_rows)	return;
        			if($scope.tabControl == 'second' && $scope.writtenCurrentRows >= $scope.writtenCommentList.total_rows)	return;
        			
        			if (!$scope.ajaxLoadFlag && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
        				
        				if($scope.tabControl == 'first'){
        					//console.log("more scroll;;;;; first");
        					$scope.getUnwrittenCommentListData();
        				}else if($scope.tabControl == 'second'){
        					//console.log("more scroll;;;;; second");
        					$scope.getWrittenCommentListData();
        				}
        			}
        		});
        		
        		$scope.tipSwipeIndex = 0;
				$scope.tipSwipeEnd = function(idx){
					$scope.tipSwipeIndex = idx;
				};

				$scope.showTipLayer = function(items){
					if(!$scope.pageUI.commentTipInfo || !$scope.pageUI.commentTipInfo.items || !$scope.pageUI.commentTipInfo.items.length)	return;
					
					$scope.tipSwipeIndex = 0;
					
					$scope.dimmedOpen({
						callback: $scope.hideTipLayer,
						scrollEventFlag: false
					});
					$timeout(function(){
						$scope.arrTip = $scope.pageUI.commentTipInfo.items;
						//console.log(items);
						$('#lotteDimm').css('z-index', '115');
					}, 200);
				};
				$scope.hideTipLayer = function(){
					$scope.arrTip = null;
				};
				
				$scope.getNickMaxWidth = function(){
					return {
						'max-width' : ( angular.element(document.body).width() - 200 ) + 'px'
					}
				};
				
				$scope.goProfile = function(){
					LotteGA.evtTag($scope.gaCtgName, "프로필 수정");
					$timeout(function(){
						location.href = $scope.pageUI.profile.prfSetUrl + "?" + $scope.baseParam;
					}, 300);
				};
				
				$scope.goReviewerHome = function(item, idx){
					LotteGA.evtTag($scope.gaCtgName, "즐겨찾는리뷰어", $scope.addZero(idx + 1), item.reviewerMbrNo);
					if(!item.reviewerHomeUrl){
						return;
					}
					$timeout(function(){
						location.href = item.reviewerHomeUrl + "&" + $scope.baseParam;
					}, 300);
				};
				
				$scope.goFavReviewer = function(){
					LotteGA.evtTag($scope.gaCtgName, "즐겨찾는리뷰어", "더보기");
					$timeout(function(){
						location.href = LotteCommon.favoriteReviewer + "?" + $scope.baseParam;
					}, 300);
				};
				
				$scope.goBestReview = function(){
					LotteGA.evtTag($scope.gaCtgName, "베스트 상품평 이동");
					$timeout(function(){
						location.href = LotteCommon.reviewBest + "?" + $scope.baseParam;
					}, 300);
				};
				
				$scope.changeTab = function(str){
					LotteGA.evtTag($scope.gaCtgName, "탭 클릭", str == "second" ? "내가 쓴 상품평" : "상품평 쓰기");
					$scope.tabControl = str;
				};
				
				$scope.goProduct = function(item){
					LotteGA.evtTag($scope.gaCtgName, "내가 쓴 상품평", "상세페이지로이동");
					$timeout(function(){
						location.href = "/product/product_view.do?" + $scope.baseParam + "&goods_no=" + item.goods_no;
					}, 300);
				};
				
				$scope.closeLayer = function(){
					$scope.dimmedClose();
				};
				
				$scope.showSettingLayer = function(){
					if($scope.pageUI.profile.gdasOppbYn){
						var scrollFlag = false;
						if($scope.supportPassive){
							document.addEventListener('touchmove', preventScrollEvent, { passive: false });
							scrollFlag = true;
						}
						$scope.dimmedOpen({
							callback: $scope.hideSettingLayer,
							scrollEventFlag: scrollFlag
						});
						$timeout(function(){
							$scope.pageUI.privateClick = true;
						}, 200);
					}else{
						$scope.setReviewHome();
					}
				};
				$scope.hideSettingLayer = function(){
					$scope.dimmedClose();
					$scope.pageUI.privateClick = false;
					if($scope.supportPassive)	document.removeEventListener('touchmove', preventScrollEvent, false);
				};
				$scope.setReviewHome = function(str){
					if(str == 'private'){
						$http.get("/json/comment/comment_open_yn_save.json?gdas_oppb_yn=false").success(function(data) {
							$scope.pageUI.profile.gdasOppbYn = false;
							$scope.hideSettingLayer();
						}).error(function(ex) {
							$scope.hideSettingLayer();
						});
					}else{
						$http.get("/json/comment/comment_open_yn_save.json?gdas_oppb_yn=true").success(function(data) {
							$scope.pageUI.profile.gdasOppbYn = true;
							$scope.hideSettingLayer();
						}).error(function(ex) {
							$scope.hideSettingLayer();
						});
					}
				};
            }
        };
    }]);
})(window, window.angular);