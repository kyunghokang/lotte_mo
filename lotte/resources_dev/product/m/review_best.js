(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSlider',
        'lotteCommFooter',
        'lotteVideo'
    ]);

    app.controller('ReviewBestCtrl', ['$scope', '$http', '$window', '$location', '$timeout', 'LotteCommon', 'LotteStorage', 'LotteGA', function($scope, $http, $window, $location, $timeout, LotteCommon, LotteStorage, LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.screenID = "ReviewBest";
        $scope.subTitle = "베스트 상품평"; //서브헤더 타이틀
        $scope.jsonLoading = false; // 로딩커버
        $scope.dummyUrl = "http://image.lotte.com/lotte/mo2018/reviews/default_profile.png";
        $scope.gaCtgName = "MO_베스트 상품평";
        
        $scope.pageUI = {
        	tabControl: 'first',
        	curCtg : -1,
        	curCtgName : '',
        	loadData : {
        		bestReviewerList :null,
        		bestCtgList : null,
        		categoryList : null
			},
			reqParam : {},
			rekeyword : '',
			bestBannerInfo : null,
			bestReviewerBannerInfo : null,
			
			bestCtgListRows : 0,
			completeCtgList : false,
			
			bestReviewerPageNum : 1,
			bestReviewerListRows : 0,
			completeReviewerList : false
        };
        
		$scope.loadCtgData = function() {
			$scope.jsonLoading = true; // 로딩커버

			$http.get(LotteCommon.reviewCategory)
			.success(function (data) {
				if (data.data && data.data.categoryList && data.data.categoryList.items) {
					if($scope.pageUI.curCtg === -1){
						var len = data.data.categoryList.items.length;
						$scope.pageUI.curCtg = getRandomInt(0, len);
						$scope.pageUI.curCtgName = data.data.categoryList.items[$scope.pageUI.curCtg].rnk_sct_cd_nm;
						moveSlider();
					}
					$scope.pageUI.loadData.categoryList = data.data.categoryList;
					$scope.pageUI.reqParam.rnk_sct_cd = data.data.categoryList.items[$scope.pageUI.curCtg].rnk_sct_cd;
					$scope.pageUI.reqParam.page = 1;
					$scope.loadCtgReviewData();
				}
			})
			.error(function () {
				console.log('Data Error : 카테고리 데이터 로드 실패');
			})
			.finally(function () {
				//$scope.jsonLoading = false; // 로딩커버
			});
        };
        
        function moveSlider(){
        	$timeout(function(){
				var left = $('.nav_slider_wrap nav ul li.on').offset().left + $('.nav_slider_wrap nav ul li.on').width();
				var wid = $(document).width();
				if(left > wid){
					$('.ctg_nav ul').css('transform', 'translateX(' + (wid - left) + 'px)');
				}
			}, 300);
        }
        
        $scope.loadCtgReviewData = function(isMore) {
			$scope.jsonLoading = true; // 로딩커버

			$http.get(LotteCommon.reviewBestCtg, {
                params:$scope.pageUI.reqParam
            })
			.success(function (data) {
				if (data.data) {
					
					if(!$scope.bgHeight)	$scope.bgHeight = parseInt(angular.element(document).width() / ($scope.screenType + 1) - 15, 10) + 'px';
					
					if(isMore){
                    	if(data.data.review_list){
	                    	$scope.pageUI.loadData.bestCtgList.items = $scope.pageUI.loadData.bestCtgList.items.concat(data.data.review_list.items);
                    	}
                    }else{
                    	$scope.pageUI.bestCtgListRows = 0;
                    	$scope.pageUI.loadData.bestCtgList = null;
                    	$scope.pageUI.loadData.totalCnt = data.data.totalCnt;
                    	$scope.pageUI.bestBannerInfo = null;
                    	if(data.data.review_list)	$scope.pageUI.loadData.bestCtgList = data.data.review_list;
                    }
                    
            		if(data.data.review_list)	$scope.pageUI.bestCtgListRows += data.data.review_list.total_count;
            		$scope.pageUI.completeCtgList = true;
            		
            		if (!$scope.pageUI.reqParam.query && data.data.bestBannerInfo && data.data.bestBannerInfo.items && data.data.bestBannerInfo.items.length){
    					$scope.pageUI.bestBannerInfo = data.data.bestBannerInfo;
    				}
				}
				
			})
			.error(function () {
				console.log('Data Error : 카테고리별 데이터 로드 실패');
			})
			.finally(function () {
				$scope.jsonLoading = false; // 로딩커버
			});
        };
        
        $scope.loadReviewerData = function(isMore) {
			$scope.jsonLoading = true; // 로딩커버

			$http.get(LotteCommon.isTestFlag ? "/json/comment/best_reviewer.json" : LotteCommon.reviewBestCtg,{
				params:{
					rnk_sct_cd : "R",
                    page : $scope.pageUI.bestReviewerPageNum
                }
			})
			.success(function (data) {
				if (data.data && data.data.review_list) {
					if(isMore){
						$scope.pageUI.loadData.bestReviewerList.items = $scope.pageUI.loadData.bestReviewerList.items.concat(data.data.review_list.items);
					}else{
						$scope.pageUI.loadData.bestReviewerList = data.data.review_list;
						$scope.pageUI.loadData.totalReviewerCnt = data.data.totalCnt;
						$scope.pageUI.bestReviewerBannerInfo = null;
					}
					
            		$scope.pageUI.bestReviewerListRows += data.data.review_list.total_count;
            		$scope.pageUI.completeReviewerList = true;
            		
            		if (data.data.bestBannerInfo && data.data.bestBannerInfo.items && data.data.bestBannerInfo.items.length){
    					$scope.pageUI.bestReviewerBannerInfo = data.data.bestBannerInfo;
    				}
				}
			})
			.error(function () {
				console.log('Data Error : 리뷰어 데이터 로드 실패');
			})
			.finally(function () {
				$scope.jsonLoading = false; // 로딩커버
			});
        };
		
		$scope.menuClick = function(code, idx, name){
			$scope.pageUI.rekeyword = '';
			$scope.pageUI.reqParam.query = '';
			$scope.pageUI.reqParam.rnk_sct_cd = code;
			$scope.pageUI.reqParam.page = 1;
			$scope.pageUI.curCtg = idx;
			$scope.pageUI.curCtgName = name;
			$scope.loadCtgReviewData();
			LotteGA.evtTag($scope.gaCtgName, "카테고리별_탭클릭", name);
		};

		$scope.searchClick = function(){
			$scope.pageUI.reqParam.query = $scope.pageUI.rekeyword;
			$scope.pageUI.reqParam.page = 1;
			$scope.loadCtgReviewData();
			LotteGA.evtTag($scope.gaCtgName, "카테고리별_검색하기", $scope.pageUI.curCtgName, $scope.pageUI.rekeyword);
		};

		$scope.searchKeypress = function (e) {
			if (e.which === 13) {
				$scope.searchClick();
				e.preventDefault();
			}
		};

		$scope.resetSearch = function(){
			$scope.pageUI.rekeyword = '';
			$scope.pageUI.reqParam.query = '';
			$scope.pageUI.reqParam.page = 1;
			$scope.loadCtgReviewData();
		};

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}
		
		$scope.addZero = function(v, len){
        	var str = v + '';
        	var count = len || 2;
        	while(str.length < count){
        		str = '0' + str;
        	}
            return str;
        };
		
		if(history.state == null || history.state.name != "reviewbest"){
			//console.warn("NEW VISIT");
			if(location.host.indexOf("localhost")>=0){
				// local
			}else{
				history.replaceState({name:"reviewbest"}, "reviewbest");
			}
			if($scope.pageUI.tabControl == 'second'){
	        	$scope.loadReviewerData();
			}else{
	        	$scope.loadCtgData();
	        }
		}else{
			//console.warn("REVISIT");
			var sessionScopeData = LotteStorage.getSessionStorage($scope.screenID + "Data", 'json') || "";

			if (!sessionScopeData || !sessionScopeData.pageUI) {
				if($scope.pageUI.tabControl == 'second'){
		        	$scope.loadReviewerData();
				}else{
		        	$scope.loadCtgData();
		        }
			} else { // 세션 스토리지에 담긴 값이 정상이라면 세션 데이터 활용
				$scope.revisit = true;
				if(!$scope.bgHeight)	$scope.bgHeight = parseInt(angular.element(document).width() / ($scope.screenType + 1) - 15, 10) + 'px';
				
				$timeout(function(){
					
					$scope.pageUI = sessionScopeData.pageUI; // UI 상태값 세팅
					
					// 이전 스크롤 위치로 스크롤 이동
    				var m_nowScrollY = LotteStorage.getSessionStorage($scope.screenID + "ScrollY");

    				$timeout(function () {
    					angular.element($window).scrollTop(m_nowScrollY);
    					$scope.revisit = false;
    				}, 500);
    				
    				moveSlider();
				}, 800);
			}
		}
		
		/**
		 * unload시 관련 데이터를 sessionStorage에 저장
		 */
		angular.element($window).on("unload", function(e) {
			var sess = {};
			if($scope.pageUI.tabControl == 'second'){
				$scope.pageUI.loadData.bestCtgList = null;// except category data list
			}
			sess.pageUI = $scope.pageUI;
			LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
			LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
			LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
		});
    }]);

    app.directive('lotteContainer', ['$window', '$timeout', 'LotteCommon', 'LotteStorage', 'LotteGA', 'LotteUtil', function($window, $timeout, LotteCommon, LotteStorage, LotteGA, LotteUtil) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/review_best_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
            	$scope.tabClick = function(str){
            		$scope.pageUI.tabControl = str;
            		if(str == 'first'){
            			LotteGA.evtTag($scope.gaCtgName, "탭 클릭", "카테고리별");
            			if(!$scope.pageUI.reqParam.query && $scope.pageUI.loadData.bestCtgList){
            				return;
            			}
            			$scope.pageUI.rekeyword = '';
            			$scope.pageUI.reqParam.query = '';
            			$scope.loadCtgData();
            		}else{
            			LotteGA.evtTag($scope.gaCtgName, "탭 클릭", "리뷰어랭킹별");
            			if($scope.pageUI.loadData.bestReviewerList){
            				return;
            			}
            			$scope.loadReviewerData();
            		}
            	};
            	
            	$scope.goReviewerHome = function(url, idx, mbrNo){
            		if($scope.pageUI.tabControl == 'first'){
            			LotteGA.evtTag($scope.gaCtgName, "카테고리별_" + $scope.pageUI.curCtgName, "리뷰어 클릭_" + $scope.addZero(idx, 3), mbrNo);
            		}else{
            			LotteGA.evtTag($scope.gaCtgName, "리뷰어랭킹별", "리뷰어 클릭", mbrNo);
            		}
            		if(!url)	return;
            		$timeout(function(){
            			location.href = url.indexOf('?') > -1 ? url + '&' + $scope.baseParam : '?' + $scope.baseParam;
            		}, 300);
            	};
            	
            	$scope.commentDetail = function(gdasNo, goodsNo, idx){
            		if($scope.pageUI.tabControl == 'first'){
            			LotteGA.evtTag($scope.gaCtgName, "카테고리별_" + $scope.pageUI.curCtgName, "상품평 클릭_" + $scope.addZero(idx, 3), gdasNo);
            		}else{
            			LotteGA.evtTag($scope.gaCtgName, "상품평정보", "상품평 상세보기", gdasNo);
            		}
            		$timeout(function(){
            			location.href = LotteCommon.productSubCommentEach + "?goods_no=" + goodsNo + "&gdas_no=" + gdasNo + "&" + $scope.baseParam;
            		}, 300);
            	};
            	
            	$scope.goBannerLink = function(url){
            		if(!url)	return;
            		$window.location.href = url + (url.indexOf('?') > -1 ? '&' : '?') + $scope.baseParam;
            	};
            	
				var $cont = angular.element("body")[0];
        		$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
        			if(!$scope.pageUI || !$scope.pageUI.loadData)	return;
        			
        			if($scope.revisit)	return;
        			
        			if($scope.pageUI.tabControl == 'first'){
        				if(!$scope.pageUI.loadData.bestCtgList || $scope.pageUI.bestCtgListRows >= $scope.pageUI.loadData.totalCnt)	return;
        			}
        			if($scope.pageUI.tabControl == 'second'){
        				if(!$scope.pageUI.loadData.bestReviewerList || $scope.pageUI.bestReviewerListRows >= $scope.pageUI.loadData.totalReviewerCnt)	return;
        			}
        			
        			if (!$scope.jsonLoading && $(window).scrollTop() + $(window).height() >= $(document).height() - parseInt($('#footer').height() / 2)) {
        				
        				if($scope.pageUI.tabControl == 'first'){
        					//console.log("more scroll;;;;; first");
        					$scope.pageUI.reqParam.page++;
        					$scope.loadCtgReviewData(true);
        				}else if($scope.pageUI.tabControl == 'second'){
        					//console.log("more scroll;;;;; second");
        					$scope.pageUI.bestReviewerPageNum++;
        					$scope.loadReviewerData(true);
        				}
        			}
				});
				
				function preventScrollEvent(e){
					e.preventDefault();
				}

				$timeout(function(){
					$scope.supportPassive = LotteUtil.supportPassive();
				}, 300);
        		
        		$scope.showReviewOne = function(items, videoUrl, index){
        			LotteGA.evtTag($scope.gaCtgName, "상품평정보", "해당상품평 사진/영상 크게보기");
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
						for(var i = 0; i<items.length; i++){
							items[i].videoUrl = videoUrl;
						}
						$scope.arrReviewOne = items;
						$timeout(function(){
							$scope.reviewSwipeCurIdx = parseInt(index, 10);
							$scope.sb_review_index = parseInt(index, 10) + 1;
							$scope.swipeReviewControl.moveIndex($scope.reviewSwipeCurIdx);
						}, 300);
					}, 200);
				};
				
				$scope.hideReviewOne = function(){
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
				
				$scope.getRankColor = function(idx){
					if(idx >= 10)	return {};
					if(idx >= 3)	return {'color': '#7a9fea'};
					return {'color': '#fa7257'};
				};

				$scope.goProduct = function(item){
					location.href = "/product/product_view.do?" + $scope.baseParam + "&goods_no=" + item.goodsNo;
		        };
            }
        };
    }]);
    
    app.filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);
    
    // 카테고리별 탭에서 이미지 로드후 처리
   	app.directive('onImgLoadComplete', function() {
   	    return {
   	        link: function(scope, element, attrs) {
   	        	angular.element(element).find('img').on('load', function() {
   	        		//console.log(this.clientWidth, this.clientHeight);
   	        		if(this.clientWidth >= this.clientHeight){
   	        			//console.log('load');
   	        			var paddingTop = parseInt(this.clientHeight * 100 / this.clientWidth, 10);
   	        			angular.element(element).css('padding-top', paddingTop + '%');
   	        			angular.element(this).css('border', '1px solid #e9e8e8');
   	        		}else{
   	        			angular.element(element).css('border', '1px solid #e9e8e8');
   	        		}
				}).each(function() {
					if(this.complete){
						//console.log('complete');
						angular.element(this).trigger('load');
					}
				});
   	        }
   	    }
   	});
   	
   	// 사진레이어에서 첫번째 이미지가 작게 나오는 현상 수정 위해 사용
   	// 무한 롤링이 아니면 다른 방법으로도 되지만 무한인 경우 초기에 정보를 줘야 해서 사용함.
   	app.directive('onImgLoaded', function() {
   	    return {
   	        link: function(scope, element, attrs) {
   	        	angular.element(element).on('load', function() {
   	        		var $this = this;
					var idx = attrs.curIdx;
					var pidx = attrs.curPidx;
   	        		//console.log('load  '+ idx);
   	        		setTimeout(function(){
   	        			if(!$this.clientWidth || !$this.clientHeight)	return;
   	        			
   	        			if($this.clientWidth >= $this.clientHeight){
   	        				scope.pageUI.loadData.bestReviewerList.items[pidx].photoList.items[idx].typeClass = 'wid';
   	        			}else{
   	        				scope.pageUI.loadData.bestReviewerList.items[pidx].photoList.items[idx].typeClass = 'hei';
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
})(window, window.angular);