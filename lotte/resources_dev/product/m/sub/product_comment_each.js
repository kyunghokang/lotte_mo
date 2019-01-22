/**
 * 상품상세 서브페이지: 상품평 상세보기
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

	app.controller('ProductCommentEachCtrl', ['$window', '$http', '$scope', '$timeout', '$compile', 'LotteCommon', 'commInitData', 'LotteGA', 'LotteUtil', 
									  function($window ,  $http ,  $scope ,  $timeout ,  $compile ,  LotteCommon ,  commInitData ,  LotteGA ,  LotteUtil) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "상품평 상세보기"; // 서브헤더 타이틀
        $scope.screenID = "product_comment_each"; // 스크린 아이디
		$scope.jsonLoading = false; // 로딩커버
		$scope.gaCtgName = "MO_상품상세_상품평 상세보기";

		$scope.pageUI = {
            gdasNo: null,
            goodsNo: null,
            usmGoodsNo: '',
	       	loadData: null
        };
		
		$scope.dummyUrl = "http://image.lotte.com/lotte/mo2018/reviews/default_profile.png";

        $scope.pageUI.goodsNo = commInitData.query['goods_no'] ? commInitData.query['goods_no'] : '';
        $scope.pageUI.gdasNo = commInitData.query['gdas_no'] ? commInitData.query['gdas_no'] : null;
        $scope.pageUI.usmGoodsNo = commInitData.query['usm_goods_no'] || '';
        
        function replaceAll(str, searchStr, replaceStr) {
            if (str != undefined && str != null && str != "") {
                str = str.split(searchStr).join(replaceStr);
            }
            return str;
        }
        
        $scope.addZero = function(v, len){
        	var str = v + '';
        	var count = len || 2;
        	while(str.length < count){
        		str = '0' + str;
        	}
            return str;
        };
        
		$scope.loadData = function() {
			$scope.jsonLoading = true; // 로딩커버

			$http.get(LotteCommon.isTestFlag ? '/json/product/comment_each_' + $scope.pageUI.goodsNo + '.json' : '/json/product_new/comment_each.json' , {
                params:{
                	goods_no: $scope.pageUI.goodsNo,
                	gdas_no: $scope.pageUI.gdasNo,
                	usm_goods_no: $scope.pageUI.usmGoodsNo
                }
            })
			.success(function (data) {
				if (data.data) {
					//console.log("상품평 상세보기 데이터 로드");
                    $scope.pageUI.loadData = data.data;
                    if(data.data.critList && data.data.critList.items && data.data.critList.items[0]){
                    	$scope.pageUI.loadData.item = data.data.critList.items[0];
                    	if($scope.pageUI.loadData.item.critCont){
                    		$scope.pageUI.loadData.item.critContHtml = replaceAll($scope.pageUI.loadData.item.critCont,"\r\n", "<br />");
                    	}
                    }
				}
			})
			.error(function () {
				console.log('Data Error : 상품평 상세보기 데이터 로드 실패');
			})
			.finally(function () {
				$scope.jsonLoading = false; // 로딩커버
			});
        }

        $scope.loadData();

		// 상품평추천
        $scope.recommClick = function (item) {
        	LotteGA.evtTag($scope.gaCtgName, "개별상품평", "추천하기");
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
                                    case "02": // 02: 추천하셨습니다. 클로버 20개 적립되었습니다. ID당 1일 10회까지 지급됩니다.
                                        item.recommCnt = item.recommCnt + 1;
                                    case "03": // 03: 이미 추천하셨습니다.
                                        item.recommYn = true;
                                    case "04": // 04: 본인이 작성한 상품평에는 추천하실 수 없습니다.
                                        break;
                                    case "05": // 05: 다시한번 시도해주시기 바랍니다.
                                        break;
                                    case "06": // 06: 추천 가능한 횟수는 1일 10회 입니다. 내일 다시 추천해주세요!
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
			LotteGA.evtTag($scope.gaCtgName, "개별상품평", "신고하기");
			if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
                alert("로그인을 해주세요.");
				var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targetUrl;
			}else{
				
				if(!$scope.pageUI.loadData.badList.items)	return;
				
				$http.get(LotteCommon.checkCommentReport, {
    				params : {
    					goods_no : $scope.pageUI.goodsNo,
    					gdas_no : $scope.pageUI.gdasNo
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
		
		$scope.productClick = function() {
			if($scope.pageUI.goodsNo) {
				LotteGA.evtTag($scope.gaCtgName, "리뷰 상품", "상품상세로 이동", $scope.pageUI.goodsNo);
				var url = LotteCommon.productviewUrl + "?" + $scope.baseParam + "&goods_no=" + $scope.pageUI.goodsNo;
				$timeout(function(){
					$window.location.href = url;
				}, 300);
			}
		};
		
		$scope.showReviewOne = function(items, videoUrl, index){
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
			
			LotteGA.evtTag($scope.gaCtgName, "개별상품평", "사진", $scope.addZero(index + 1));
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

	}]);
	
	// 사진레이어에서 이미지가 작게 나오는 현상 수정 위해 사용
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
   	        				scope.pageUI.loadData.item.photoList.items[idx].typeClass = 'wid';
   	        			}else{
   	        				scope.pageUI.loadData.item.photoList.items[idx].typeClass = 'hei';
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

    app.directive('lotteContainer', ['LotteGA', '$timeout', function(LotteGA, $timeout) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/sub/product_comment_each_container.html',
            replace : true,
            link : function($scope, el, attrs) {
				$scope.isShowBtnTalk = false; // 톡상담 버튼 감추기

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
						location.href = item.reviewerHomeUrl.indexOf('?') > -1 ? item.reviewerHomeUrl + "&" + $scope.baseParam : item.reviewerHomeUrl + "?" + $scope.baseParam;
					}, 300);
				};
            }
        };
    }]);

    app.filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
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
	
	// 이미지 에러시 처리
 	app.directive('onErrorSrc', function() {
 	    return {
 	        link: function(scope, element, attrs) {
 	          element.bind('error', function() {
 	        	  if(scope.pageUI.loadData.item.reviewerImgUrl != scope.dummyUrl){
 	        		 scope.pageUI.loadData.item.reviewerImgUrl = scope.dummyUrl;
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
			scope: true,
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
	        					goods_no : scope.pageUI.goodsNo,
	        					gdas_no : scope.pageUI.gdasNo,
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
