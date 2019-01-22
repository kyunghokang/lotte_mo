/**
 * 상품상세 서브페이지: 전체 상품평 보기
 */
(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'product-sub-header',
		'lotteVideo'
    ]);

    app.controller('ProductCommentCtrl', ['$http', '$window', '$scope', '$timeout', '$compile', 'LotteCommon', 'orderByFilter', 'commInitData', 'LotteUtil', 'LotteGA', function($http, $window, $scope, $timeout, $compile, LotteCommon, orderByFilter, commInitData, LotteUtil, LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "전체 상품평보기"; // 서브헤더 타이틀
        $scope.screenID = "product_comment"; // 스크린 아이디 
        $scope.goodsNo = commInitData.query['goods_no']; // 상품번호
		$scope.jsonLoading = false; // 로딩커버
		$scope.gaCtgName = "MO_상품상세_전체상품평보기";
		
		$scope.alert = function(text){ // alert 메시지 용
			$window.alert(text);
		};
		$scope.consolelog = function(obj){ // alert 메시지 용
			console.log(obj);
		};
		
		$scope.rScope = getScope();
		
		//console.log("++++++", $scope.showSharePop);
        
		$scope.pageUI = {
			page: 1,
			isLastPage: false,
    		starScoreOpen: false,
			customerSatisOpen: true,
			filterOption: {
    			sliderOpen: false,
				filter1Open: true,
				filter1SelVal: 0,
				filter1Names: ['고객추천순', '리뷰어랭킹순', '최근상품평순','높은평점순','낮은평점순'],
				filter2Open: true,
				filter2SelVal: 6,
				filter2Names: ['전체','5점','4점','3점','2점','1점'],
				media_yn: 'N'
			},
			reqParam: {},
			loadData: null,
			filteredItems: []
		} // 페이지 정보저장
		
		$scope.dummyUrl = "http://image.lotte.com/lotte/mo2018/reviews/default_profile.png";

		// usm_goods_no, page, all_view_yn, sort(정렬조건 default R), star(별점 필터링시 추가)
		// all_view_yn:전체보기, page:페이지번호, sort:정렬조건 default(R:고객추천순, RK:리뷰어랭킹순, L:최근상품평순, G:높은평점순, B:낮은평점순), star:별점
		$scope.pageUI.reqParam.goods_no = commInitData.query['goods_no'] ? commInitData.query['goods_no']:''; // 상품번호
		$scope.pageUI.reqParam.usm_goods_no = commInitData.query['usm_goods_no'] ? commInitData.query['usm_goods_no']:''; // usm_goods_no
		$scope.pageUI.reqParam.page = commInitData.query['page'] ? commInitData.query['page']:1;
		$scope.pageUI.reqParam.all_view_yn = 'Y';
		$scope.pageUI.reqParam.sort = 'R';
		$scope.pageUI.reqParam.star = '';
		
		function replaceAll(str, searchStr, replaceStr) {
            if (str != undefined && str != null && str != "") {
                str = str.split(searchStr).join(replaceStr);
            }
            return str;
        }
		
		$scope.loadData = function() {
			$scope.pageUI.reqParam.page = $scope.pageUI.page;

			var url = LotteCommon.isTestFlag ? '/json/product/comment_all_' + $scope.pageUI.reqParam.goods_no + '.json' : LotteCommon.productCommentDataNew;

			$scope.ajaxLoadFlag = true;
			$scope.jsonLoading = true;

			$http.get(url, {
				params: $scope.pageUI.reqParam
			})
			.success(function (data) {
				if(data.data) {
					//console.log("전체 상품평보기 데이터 로드 page:" + $scope.pageUI.reqParam.page);
					if($scope.pageUI.reqParam.page > 1) {
						if(data.data.critList.total_count > 0) {
							for(var i=0;i < data.data.critList.items.length;i++) {
								if(data.data.critList.items[i].critCont){
									data.data.critList.items[i].critContHtml = replaceAll(data.data.critList.items[i].critCont,"\r\n", "<br />");
								}
								$scope.pageUI.loadData.critList.items.push(data.data.critList.items[i]);
							}
						} else {
							$scope.pageUI.isLastPage = true;
						}
					} else {
						if(data.data.critList && data.data.critList.items && data.data.critList.items.length){
							for(var i=0;i < data.data.critList.items.length;i++) {
								if(data.data.critList.items[i].critCont){
									data.data.critList.items[i].critContHtml = replaceAll(data.data.critList.items[i].critCont,"\r\n", "<br />");
								}
							}
						}
						$scope.pageUI.loadData = data.data;
						// 상품평 요약데이타 만들기
						if(data.data.easnGdasSummaryList && data.data.easnGdasSummaryList.items && data.data.easnGdasSummaryList.items.length){
							$scope.pageUI.loadData.reviewDetail = {};
							$scope.pageUI.loadData.reviewList = [];
							for(var i = 0; i<data.data.easnGdasSummaryList.items.length; i++){
								var item = data.data.easnGdasSummaryList.items[i];
								if($scope.pageUI.loadData.reviewDetail[item.gdas_item_no]){
									$scope.pageUI.loadData.reviewDetail[item.gdas_item_no].list.push(item);
								}else{
									$scope.pageUI.loadData.reviewDetail[item.gdas_item_no] = {};
									$scope.pageUI.loadData.reviewDetail[item.gdas_item_no].title = item.gdas_item_nm;
									$scope.pageUI.loadData.reviewDetail[item.gdas_item_no].list = [];
									$scope.pageUI.loadData.reviewDetail[item.gdas_item_no].list.push(item);
									
									$scope.pageUI.loadData.reviewList.push(item);
								}
							}
						}
					}
					$scope.pageUI.healthfoodYn = data.data.healthfoodYn || false; // 건강기능 식품인 경우
				}
			})
			.error(function () {
				console.log('Data Error : 전체 상품평보기 데이터 로드 실패');
				$scope.ajaxLoadFlag = false;
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;
				// $timeout(function () { $scope.jsonLoading = false; },3000);
				$scope.jsonLoading = false;
			});
		}

		$scope.loadData();
		
		function addZero( n ) {
            return n<10?'0'+n:n;
        }

		$scope.linkThumbClick = function (linkUrl, tclick, isAll, idx) {
			//console.log('linkUrl', linkUrl);
			if(isAll){
				LotteGA.evtTag($scope.gaCtgName, "고객등록 사진/영상 더보기", "더보기");
			}else{
				LotteGA.evtTag($scope.gaCtgName, "고객등록 사진/영상", addZero(idx + 1));
			}
			$timeout(function(){
				if(isAll){
					$window.location.href = LotteCommon.productSubCommentImage + '?goods_no=' + $scope.goodsNo + '&usm_goods_no=' + ( $scope.pageUI.reqParam.usm_goods_no || "") + '&' + $scope.baseParam + "&tclick=" + tclick;
					return;
				}
				$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.baseParam + "&tclick=" + tclick);
			}, 300);
		};
		
		// 필터 - 정렬
		$scope.sortBy = function (tclick) {
			$scope.sendTclick(tclick);
			//console.log('$scope.pageUI.filterOption.filter1SelVal', $scope.pageUI.filterOption.filter1SelVal);
			// all_view_yn:전체보기, page:페이지번호, sort:정렬조건 default(R:고객추천순, RK:리뷰어랭킹순, L:최근상품평순, G:높은평점순, B:낮은평점순), star:별점
			switch ($scope.pageUI.filterOption.filter1SelVal){
				case 0: // 고객추천순
					$scope.pageUI.reqParam.sort = 'R';
					break;
				case 1: // 리뷰어랭킹순
					$scope.pageUI.reqParam.sort = 'RK';
					break;
				case 2: // 최신상품평순
					$scope.pageUI.reqParam.sort = 'L';
					break;
				case 3: // 높은평점순
					$scope.pageUI.reqParam.sort = 'G';
					break;
				case 4: // 낮은평점순
					$scope.pageUI.reqParam.sort = 'B';
					break;
			}
			$scope.pageUI.page = 1;
			$scope.pageUI.isLastPage = false;
			$scope.loadData();
		}
		$scope.sortByOpen = function (tclick) {
			$scope.sendTclick(tclick);
			$scope.pageUI.filterOption.filter1Open = !$scope.pageUI.filterOption.filter1Open;
		}
		
		// 필터 - 사진/영상 상품평만 보기
		$scope.mediaOnly = function () {
			//$scope.sendTclick(tclick);
			$scope.pageUI.reqParam.media_yn = $scope.pageUI.filterOption.media_yn;
			$scope.pageUI.page = 1;
			$scope.pageUI.isLastPage = false;
			$scope.loadData();
		};
		
		// 필터 - 별점순
		$scope.filterBy = function (tclick) {
			$scope.sendTclick(tclick);
			//console.log('$scope.pageUI.filterOption.filter2SelVal', $scope.pageUI.filterOption.filter2SelVal);
			$scope.pageUI.reqParam.star = $scope.pageUI.filterOption.filter2SelVal;
			if($scope.pageUI.reqParam.star > 5) {
				$scope.pageUI.reqParam.star = '';
			}
			$scope.pageUI.page = 1;
			$scope.pageUI.isLastPage = false;
			$scope.loadData();
		}
		$scope.filterByOpen = function (tclick) {
			$scope.pageUI.filterOption.filter2Open = !$scope.pageUI.filterOption.filter2Open
		}

		$scope.showHideFilterSlider = function (tclick) {
			LotteGA.evtTag($scope.gaCtgName, "필터", "필터");
			$scope.pageUI.filterOption.sliderOpen = !$scope.pageUI.filterOption.sliderOpen;
			if($scope.pageUI.filterOption.sliderOpen){
				var scrollFlag = false;
				if($scope.supportPassive){
					document.addEventListener('touchmove', preventScrollEvent, { passive: false });
					scrollFlag = true;
				}
				$scope.dimmedOpen({
					callback: this.showHideFilterSlider,
					scrollEventFlag: scrollFlag
				});
			}else{
				$scope.dimmedClose();
				if($scope.supportPassive)	document.removeEventListener('touchmove', preventScrollEvent, false);
			}
		}
		$scope.hideFilterSlider = function (tclick) {
			$scope.dimmedClose();
		}
		
		var $cont = angular.element("body")[0];
		$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
			if($scope.pageUI.isLastPage===true){ return; }
			if($scope.arrReviewOne && $scope.arrReviewOne.length)	return;
			if($scope.pageUI.loadData && $scope.pageUI.loadData.reportList)	return;
			if (!$scope.ajaxLoadFlag && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
				//console.log("more scroll;;;;;");
				$scope.pageUI.page++;
				$scope.loadData();
			}
		});
		
		// 상품평추천
		$scope.recommClick = function (item) {
			LotteGA.evtTag($scope.gaCtgName, "리뷰내용", "추천하기");
			if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
				alert("로그인을 해주세요.");
				var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targetUrl;
			} else {
				if (item.regRecommUrl) {
                    item.myRecomm = true;
                    
					$http.get(item.regRecommUrl)
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
                                    case "04": // 04: 본인이 작성한 상품평에는 추천하실 수 없습니다.
                                        break;
                                    case "05": // 05: 다시한번 시도해주시기 바랍니다.
                                        break;
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

		function preventScrollEvent(e){
			e.preventDefault();
		}

		$timeout(function(){
			$scope.supportPassive = LotteUtil.supportPassive();
		}, 300);
		
		$scope.showReportPop = function(item){
			
			LotteGA.evtTag($scope.gaCtgName, "리뷰내용", "신고하기");
			if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
                alert("로그인을 해주세요.");
				var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targetUrl;
			}else{
				
				if(!$scope.pageUI.loadData.badList.items)	return;
				
				$http.get(LotteCommon.checkCommentReport, {
    				params : {
    					goods_no : $scope.goodsNo,
    					gdas_no : item.gdasNo
    				}
    			})
                .success(function (data) {
                    //console.log(data);
                    if(!data || !data.data){
                    	alert("다시 한번 시도해주시기 바랍니다.");
                    	return;
                    }
                    if(data.data.resultCode == '02' || data.data.resultCode == '03'){
                    	if(data.data.resultMsg){
                        	alert(data.data.resultMsg);
                        }
                    }else if(data.data.resultCode == '01'){
						var scrollFlag = false;
						if($scope.supportPassive){
							document.addEventListener('touchmove', preventScrollEvent, { passive: false });
							scrollFlag = true;
						}
                    	$scope.dimmedOpen({
        					target : "pop_report",
        					callback: $scope.hideReportPop,
        					scrollEventFlag: scrollFlag
        				});
        				$scope.pageUI.gdasItem = item;
        				$scope.pageUI.loadData.reportList = $scope.pageUI.loadData.badList.items;
                    }
                })
                .error(function(){
                	alert("다시 한번 시도해주시기 바랍니다.");
                });
			}
		};
		
		$scope.hideReportPop = function(){
			$scope.dimmedClose();
			$scope.pageUI.loadData.reportList = null;
			if($scope.supportPassive)	document.removeEventListener('touchmove', preventScrollEvent, false);
		};
		
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
			LotteGA.evtTag($scope.gaCtgName, "리뷰내용", "상품평 사진/영상 크게보기");
		};
		$scope.hideReviewOne = function(){
			$scope.dimmedClose();
			$scope.arrReviewOne = [];
			if($scope.supportPassive)	document.removeEventListener('touchmove', preventScrollEvent, false);
		};
		
		/* video controls */
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
    }]);
    
    // 사진레이어에서 첫번째 이미지가 작게 나오는 현상 수정 위해 사용
   	// 무한 롤링이 아니면 다른 방법으로도 되지만 무한인 경우 초기에 정보를 줘야 해서 사용함.
   	app.directive('onImgLoaded', function() {
   	    return {
   	        link: function(scope, element, attrs) {
   	        	angular.element(element).on('load', function() {
   	        		var $this = this;
   	        		var idx = attrs.curIdx;
   	        		//console.log('load  '+ idx);
   	        		setTimeout(function(){
   	        			if(!$this.clientWidth || !$this.clientHeight)	return;
   	        			
   	        			if($this.clientWidth >= $this.clientHeight){
   	        				scope.pageUI.loadData.critList.items[idx].photoList.items[0].typeClass = 'wid';
   	        			}else{
   	        				scope.pageUI.loadData.critList.items[idx].photoList.items[0].typeClass = 'hei';
   	        			}
   	        		}, 300);
				}).each(function() {
					if(this.complete){
						angular.element(this).trigger('load');
					}
				});
   	        }
   	    }
   	});

    app.directive('lotteContainer', ['$window', '$timeout', 'LotteCommon', 'LotteGA', 'commInitData', function($window, $timeout, LotteCommon, LotteGA, commInitData) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/sub/product_comment_container.html',
            replace : true,
            link : function($scope, el, attrs) {
				$scope.isShowBtnTalk = false; // 톡상담 버튼 감추기
				
				$scope.productCommentDetailView = function (idx) {
					//console.log("상품평 사진 클릭");
					$window.location.href = LotteCommon.productSubCommentImageDetail + "?" + $scope.baseParam + "&goods_no=" + commInitData.query['goods_no'] + "&idx=" + idx + "&tclick="; // to-do 티클릭 작업 필요
				};
				// 리뷰어홈 또는 내 상품평관리 가기
				$scope.goReviewerHome = function(item){
					if(!item.reviewerHomeUrl){
						return;
					}
					if(item.reviewerHomeUrl.indexOf('revr_mbr_no=') > -1){
						var arr = item.reviewerHomeUrl.split('revr_mbr_no=');
						try{
							LotteGA.evtTag($scope.gaCtgName, "리뷰어", "리뷰어홈가기", arr[1].split('&')[0]);
						}catch(e){}
					}else if(item.reviewerHomeUrl.indexOf('/mylotte_crit_view.do') > -1){
						LotteGA.evtTag($scope.gaCtgName, "리뷰어", "리뷰어홈가기", $scope.loginInfo.mbrNo);
					}
					$timeout(function(){
						location.href = item.reviewerHomeUrl.indexOf('?') > -1 ? item.reviewerHomeUrl + "&" + $scope.baseParam : item.reviewerHomeUrl + "?" + $scope.baseParam
					}, 300);
				};
				
				$scope.toggleDetail = function(){
					if($scope.pageUI.starScoreOpen){
						LotteGA.evtTag($scope.gaCtgName, "Summary 자세히보기", "접기");
					}else{
						LotteGA.evtTag($scope.gaCtgName, "Summary 자세히보기", "펼치기");
					}
					$scope.pageUI.starScoreOpen = !$scope.pageUI.starScoreOpen;
				};
            }
        };
    }]);

	/**
	 * ng-model 값 integer로 변경
	 */
	app.directive('integer', function(){
		return {
			require: 'ngModel',
			link: function(scope, ele, attr, ctrl){
				ctrl.$parsers.unshift(function(viewValue){
					return parseInt(viewValue, 10);
				});
			}
		};
	});

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
	
	app.filter('trusted', ['$sce', function ($sce) {
		return function(url) { 
			return $sce.trustAsResourceUrl(url); 
		};
	}]);
	
	app.directive('onErrorSrc2', function() {
 	    return {
 	        link: function(scope, element, attrs) {
 	          element.bind('error', function() {
 	        	  //console.log('attrs.curIndex ' + attrs.curIndex);
 	        	  if(!attrs.curIndex)	return;
 	        	  if(scope.pageUI.loadData.critList.items[attrs.curIndex - 1].reviewerImgUrl != scope.dummyUrl){
 	        		 scope.pageUI.loadData.critList.items[attrs.curIndex - 1].reviewerImgUrl = scope.dummyUrl;
 	        	  }
 	          });
 	        }
 	    }
 	});
	
	/**
	 * @ngdoc directive
	 * @name app.directive:reportPop
	 * @description
	 * reportPop directive
	 * @example
	 * <report-pop></report-pop>
	 */
	app.directive('reportPop', ['$window', '$location', 'LotteCommon', '$timeout', '$parse', '$http', 'LotteGA', function ($window, $location, LotteCommon, $timeout, $parse, $http, LotteGA) {
		return {
			link: function (scope, el, attrs) {
				
				scope.sendReport = function(){
					
					if(!el.find('input[type=radio]:checked').length){
						return;
					}
					
					if (!scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
		                alert("로그인을 해주세요.");
						var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
						$window.location.href = LotteCommon.loginUrl + "?" + scope.baseParam + targetUrl;
		            } else {
		            	
	                    $http.get(LotteCommon.commentReport, {
	        				params : {
	        					site_no : 1,
	        					goods_no : scope.pageUI.reqParam.goods_no,
	        					gdas_no : scope.pageUI.gdasItem.gdasNo,
	        					dcl_accp_tp_cd : el.find('input[type=radio]:checked').val()
	        				}
	        			})
	                    .success(function (data) {
	                        //console.log(data);
	                        if(!data || !data.data){
	                        	alert("다시 한번 시도해주시기 바랍니다.");
	                        	return;
	                        }
	                        if(data.data.resultMsg){
	                        	alert(data.data.resultMsg);
	                        	scope.hideReportPop();
	                        }
	                    })
	                    .error(function(){
	                    	alert("다시 한번 시도해주시기 바랍니다.");
	                    });
		            }
				};
			}
		};
	}]);

})(window, window.angular);