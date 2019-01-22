(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteCommFooter',
        'lotteVideo'
    ]);

    app.controller('ReviewerHomeCtrl', ['$scope', 'LotteCommon', function($scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "리뷰어 홈"; //서브헤더 타이틀
        $scope.gaCtgName = "MO_리뷰어홈";
        
        $scope.pageUI = {
            gdasNo: null,
            goodsNo: null,
	       	loadData: null
		};
				
		$scope.dataLoaded = false;
		$scope.reportList = [];
		
		$scope.objLink = {
			reviewBest : LotteCommon.reviewBest,
			critViewUrl : LotteCommon.critViewUrl
		};
		
		$scope.dummyUrl = "http://image.lotte.com/lotte/mo2018/reviews/default_profile.png";
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
   	
   	app.filter('trusted', ['$sce', function ($sce) {
		return function(url) { 
			return $sce.trustAsResourceUrl(url); 
		};
	}]);

	// 사진레이어에서 첫번째 이미지가 작게 나오는 현상 수정 위해 사용
   	// 무한스와이프인 경우 초기에 정보를 줘야 해서 사용함.
   	app.directive('onImgLoaded', function() {
   	    return {
   	        link: function(scope, element, attrs) {
   	        	angular.element(element).on('load', function() {
   	        		var $this = this;
   	        		var idx = attrs.curIdx;
   	        		console.log('load  '+ idx);
   	        		
   	        		setTimeout(function(){
   	        			console.log($this.clientWidth, $this.clientHeight);
   	        			if(!$this.clientWidth || !$this.clientHeight)	return;
   	        			
   	        			if($this.clientWidth >= $this.clientHeight){
   	        				scope.pageUI.loadData.review_list.items[idx].photoList.items[0].typeClass = 'wid';
   	        			}else{
   	        				scope.pageUI.loadData.review_list.items[idx].photoList.items[0].typeClass = 'hei';
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

    app.directive('lotteContainer', ['$timeout', '$http', '$window', 'LotteCommon', 'commInitData', 'LotteGA', 'LotteUtil', 'LotteForm', function($timeout, $http, $window, LotteCommon, commInitData, LotteGA, LotteUtil, LotteForm) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/reviewer_home_container.html',
            replace : true,
            link : function($scope, el, attrs) {

				$scope.currentRows = 0;
				$scope.pageNum = 1;

				($scope.loadData = function() {
						
					if(!commInitData.query.revr_mbr_no){
						return;
					}
					$scope.jsonLoading = true; // 로딩커버

					LotteForm.FormSubmitForAjax(
						LotteCommon.reviewerHomeInfo, {
							revr_mbr_no : commInitData.query.revr_mbr_no,
							page : $scope.pageNum
						})
					.success(function (data) {
						if (data.data) {
							if($scope.pageNum == 1){
								$scope.pageUI.loadData = data.data;
							}else{
								$scope.pageUI.loadData.review_list.items = $scope.pageUI.loadData.review_list.items.concat(data.data.review_list.items);
							}
							$scope.pageNum++;
							if(data.data.review_list && data.data.review_list.total_count){
								$scope.currentRows += data.data.review_list.total_count;
							}
						}
					})
					.error(function () {
						console.log('Data Error : 리뷰어 홈 데이터 로드 실패');
					})
					.finally(function () {
						$scope.jsonLoading = false; // 로딩커버
						$scope.dataLoaded = true;
					});
				})();

				/**
				 * 즐겨찾기 등록
				 */
				$scope.addFav = function(){
					LotteGA.evtTag($scope.gaCtgName, "프로필영역", "즐겨찾기");
					if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
                        alert("로그인을 해주세요.");
        				var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
        				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targetUrl;
        				return;
					}
					LotteForm.FormSubmitForAjax(LotteCommon.addFavReviewer, {revr_mbr_no : commInitData.query.revr_mbr_no})
					.success(function (data) {
						//console.log(data);
						if(!data || !data.data){
							alert("다시 한번 시도해주시기 바랍니다.");
							return;
						}
						if(data.data.resultCode == '01'){
							$scope.pageUI.loadData.profile.favoriteYn = true;
						}else{
							if(data.data.resultMsg){
								alert(data.data.resultMsg);
							}
						}
					})
					.error(function(){
						alert("다시 한번 시도해주시기 바랍니다.");
					});
				};

				/**
				 * 즐겨찾기 삭제
				 */
				$scope.delFav = function(){
					LotteGA.evtTag($scope.gaCtgName, "프로필영역", "즐겨찾기 취소");
					if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
                        alert("로그인을 해주세요.");
        				var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
        				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targetUrl;
        				return;
					}
					LotteForm.FormSubmitForAjax(LotteCommon.delFavReviewer, {revr_mbr_no_list : commInitData.query.revr_mbr_no})
					.success(function (data) {
						//console.log(data);
						if(!data || !data.data){
							alert("다시 한번 시도해주시기 바랍니다.");
							return;
						}
						if(data.data.resultCode == '01'){
							$scope.pageUI.loadData.profile.favoriteYn = false;
						}else{
							if(data.data.resultMsg){
								alert(data.data.resultMsg);
							}
						}
					})
					.error(function(){
						alert("다시 한번 시도해주시기 바랍니다.");
					});
				};

				function preventScrollEvent(e){
					e.preventDefault();
				}

				$timeout(function(){
					$scope.supportPassive = LotteUtil.supportPassive();
				}, 300);

            	$scope.showReviewOne = function(items, gdasNo){
            		LotteGA.evtTag($scope.gaCtgName, "리뷰내용", "해당 상품평 사진/영상 크게보기", gdasNo);
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
        		};
        		$scope.hideReviewOne = function(){
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
        		
        		$scope.showReportPop = function(item){
        			
        			LotteGA.evtTag($scope.gaCtgName, "리뷰내용", "상품평 신고", item.gdasNo);
        			
        			if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
                        alert("로그인을 해주세요.");
        				var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
        				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targetUrl;
        			}else{
        				
        				if(!$scope.pageUI.loadData.badList || !$scope.pageUI.loadData.badList.items)	return;
        				
        				$scope.pageUI.goodsNo = item.goodsNo;
        				$scope.pageUI.gdasNo = item.gdasNo;
						
						LotteForm.FormSubmitForAjax(LotteCommon.checkCommentReport, {
            					goods_no : item.goodsNo,
            					gdas_no : item.gdasNo
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
                					callback: $scope.hideReportPop,
                					scrollEventFlag: scrollFlag
                				});
                				$scope.pageUI.gdasItem = item;
                				$scope.badList = $scope.pageUI.loadData.badList.items;
                				
                				$timeout(function(){
                					angular.element('#reportPop').css({'margin-top' : -1 * angular.element('#reportPop').height() / 2 + 'px'});
                				}, 500);
                            }
                        })
                        .error(function(){
                        	alert("다시 한번 시도해주시기 바랍니다.");
                        });
        			}
				};
				
				$scope.showReportHomePop = function(item){
					
					LotteGA.evtTag($scope.gaCtgName, "프로필영역", "프로필 신고");
        			
        			if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
                        alert("로그인을 해주세요.");
        				var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
        				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targetUrl;
        			}else{
        				
        				if(!$scope.pageUI.loadData.reportList || !$scope.pageUI.loadData.reportList.items)	return;
        				
        				if($scope.pageUI.loadData.profile.badYn){
        					alert('동일 리뷰어는 일주일에 한 번 신고 가능합니다.');
        					return;
        				}
        				$scope.stopScroll = true;
						var scrollFlag = false;
						if($scope.supportPassive){
							document.addEventListener('touchmove', preventScrollEvent, { passive: false });
							scrollFlag = true;
						}
                    	$scope.dimmedOpen({
        					callback: $scope.hideReportHomePop,
        					scrollEventFlag: scrollFlag
        				});
        				$scope.pageUI.gdasItem = item;
        				$scope.reportList = $scope.pageUI.loadData.reportList.items;
        				$scope.inputData = "";
        				
        				$timeout(function(){
        					angular.element('#reportHomePop').css({'margin-top' : -1 * angular.element('#reportHomePop').height() / 2 + 'px'});
        				}, 500);
        			}
        		};
        		
        		$scope.hideReportPop = function(){
        			$scope.dimmedClose();
        			$scope.badList = [];
        			if($scope.supportPassive)	document.removeEventListener('touchmove', preventScrollEvent, false);
				};
						
				$scope.hideReportHomePop = function(){
					$scope.dimmedClose();
					$scope.stopScroll = false;
					$scope.reportList = [];
					if($scope.supportPassive)	document.removeEventListener('touchmove', preventScrollEvent, false);
				};
				
				// 상품평추천
		        $scope.recommClick = function (item) {
		        	LotteGA.evtTag($scope.gaCtgName, "리뷰내용", "상품평 추천", item.gdasNo);
		        	
		            if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
		            	alert("로그인을 해주세요.");
		            	var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
        				$window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + targetUrl;
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
		        
		        $scope.goProduct = function(item){
		        	LotteGA.evtTag($scope.gaCtgName, "리뷰내용", "상품 상세 가기", item.goodsNo);
					
					$timeout(function(){
						location.href = "/product/product_view.do?" + $scope.baseParam + "&goods_no=" + item.goodsNo;
					}, 300);
		        };
		        
		        // 해당 상품평 상세
				$scope.commentDetail = function(gdasNo, goodsNo) {
					LotteGA.evtTag($scope.gaCtgName, "리뷰내용", "상품평 상세보기", gdasNo);
					
					$timeout(function(){
						location.href = LotteCommon.productSubCommentEach + "?" + $scope.baseParam + "&goods_no=" + goodsNo + "&gdas_no=" + gdasNo;
					}, 300);
				};
				
				$scope.goBestReview = function(){
					LotteGA.evtTag($scope.gaCtgName, "이동구좌", "베스트 상품평 가기");
					
					$timeout(function(){
						location.href = $scope.objLink.reviewBest + "?" + $scope.baseParam;
					}, 300);
				};
				
				$scope.goMyReview = function(){
					LotteGA.evtTag($scope.gaCtgName, "이동구좌", "내 상품평 가기");
					
					$timeout(function(){
						location.href = $scope.objLink.critViewUrl + "?" + $scope.baseParam;
					}, 300);
				};
				
				var $cont = angular.element("body")[0];
        		$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
        			if($scope.stopScroll)	return;
        			if(!$scope.pageUI.loadData || !$scope.pageUI.loadData.totalCnt || $scope.currentRows >= $scope.pageUI.loadData.totalCnt)	return;
        			
        			if($scope.reportList && $scope.reportList.length) return;
        			if($scope.badList && $scope.badList.length)	return;
        			
        			if (!$scope.jsonLoading && $cont.scrollHeight - args.winHeight * 2 <= args.scrollPos + args.winHeight) {
						//console.log("more scroll;;;;; first");
						$scope.loadData();
        			}
        		});
            }
        };
    }]);
    
    // 이미지 에러시 처리
  	app.directive('onErrorSrc', function() {
  	    return {
  	        link: function(scope, element, attrs) {
  	          element.bind('error', function() {
  	        	  if(scope.pageUI.loadData.profile.imgUrl != scope.dummyUrl){
  	        		 scope.pageUI.loadData.profile.imgUrl = scope.dummyUrl;
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
	app.directive('reportPop', ['$window', '$location', 'LotteCommon', 'commInitData', '$timeout', '$http', function ($window, $location, LotteCommon, commInitData, $timeout, $http) {
		return {
			link: function (scope, el, attrs) {
				
				scope.sendReport = function(){
					
					if(!el.find('input[type=radio]:checked').length){
						alert('신고사유를 선택해주세요.');
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
	
	/**
	 * @ngdoc directive
	 * @name app.directive:reportHomePop
	 * @description
	 * reportHomePop directive
	 * @example
	 * <report-home-pop></report-home-pop>
	 */
	app.directive('reportHomePop', ['$window', '$location', 'LotteCommon', 'LotteForm', 'commInitData', '$timeout', '$http', function ($window, $location, LotteCommon, LotteForm, commInitData, $timeout, $http) {
		return {
			link: function (scope, el, attrs) {
				
				scope.sendReportHome = function(){
					
					if(!el.find('input[type=radio]:checked').length){
						alert('신고사유를 선택해주세요.');
						return;
					}
					
					if(hasSpecialChar(scope.inputData)){
						alert('특수문자는 입력할수 없습니다.');
						$("#inputReportPop").focus();
						return;
					}
					
					if (!scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
		                alert("로그인을 해주세요.");
						var targetUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
						$window.location.href = LotteCommon.loginUrl + "?" + scope.baseParam + targetUrl;
		            } else {
	                    LotteForm.FormSubmitForAjax(LotteCommon.reportBadReviewer, {
								revr_mbr_no: commInitData.query.revr_mbr_no,
								dcl_accp_tp_cd : el.find('input[type=radio]:checked').val(),
								note_cont : el.find('#inputReportPop').val()
							})
						.success(function (data) {
							//console.log(data);
							if(!data || !data.data){
								alert("다시 한번 시도해주시기 바랍니다.");
								return;
							}
							if(data.data.resultCode && data.data.resultCode == '01'){
								scope.pageUI.loadData.profile.badYn = true;
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
				
				scope.calcByte = function(){	
					var ip = angular.element('#inputReportPop');
					var disp = angular.element('#curbyte');
					var msgLen = 0, prevMsgLen = 0;
					var temp, tempStr = "";
					var max = 50;
					if(ip.val().length){
						for(var k = 0; k<ip.val().length; k++){
							temp = ip.val().charAt(k);
							prevMsgLen = msgLen;
							if(escape(temp).length > 4){
								msgLen += 2;
							}else{
								msgLen++;
							}
							if(msgLen > max){
								alert('50바이트를 초과할 수 없습니다.');
								ip.val(tempStr);
								//console.log(prevMsgLen);
								disp.text(prevMsgLen);
								break;
							}else{
								tempStr += temp;
								disp.text(msgLen);
							}
						}
					}else{
						disp.text(msgLen);
					}
					scope.inputData = tempStr;
				};
				
				scope.changeRadio = function(){
					scope.selectedR = angular.element('#reportHomePop').find('input[type=radio]:checked').val();
					//console.log(scope.selectedR);
				};
				
				function hasSpecialChar(str){
					var pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
					
					if(pattern.test(str)){ //특수문자가 포함되면
						return true;
					}
					return false;
				}
			}
		};
	}]);

})(window, window.angular);