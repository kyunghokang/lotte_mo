(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteNgSwipe',
        'lotteSns'
    ]);

    app.controller('ExperienceViewCtrl', ['$http', '$scope', 'LotteCommon', 'commInitData', function($http, $scope, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "유아동 체험단"; // 서브헤더 타이틀
        $scope.screenID = "유아동 체험단"; // 스크린 아이디 
        $scope.evt_no = '', // 이벤트 번호
        $scope.isShowThisSns = true; /*공유버튼*/
        
        ($scope.screenDataReset = function() {
        	$scope.screenData = {
        		page_num: 0
	        }
        })();
        
        $scope.reqDetailParam = {
			evt_no : commInitData.query['evt_no']
		};
		
		if ($scope.reqDetailParam.evt_no != null) {
			$scope.reqDetailParamStr += "&evt_no="+$scope.reqDetailParam.evt_no;
		}
		
		$scope.loadScreenData = function() {
			if ($scope.BasicData == undefined) {
				//console.log('reqParam', $scope.reqParam);

				$http.get(LotteCommon.kidsExperienceDetailData, {params:$scope.reqDetailParam})
				.success(function(data) {
		        	$scope.maxData = data;
		        	$scope.screenData.goods_no = data.prod_info.goods_no;
		        	$scope.screenData.ProdInfo = data.prod_info;
		        	$scope.screenData.experInfo = data.experience_info;
		        	$scope.screenData.info_cont = data.info_cont;
		        	$scope.screenData.evtFaqList = data.evt_faq.items;		        	
		        	
				})
				.error(function () {
					$scope.loadingFail = true;
					console.log('Data Error : 상품기본정보 로드 실패');

					// 20160616 앱전용/제휴채널팝업 데이터화로 인한 삭제 - 박형윤
					/*
					//20160315 박형윤 - 백화점잡화(아동) 앱전용(폐쇄몰) 상품 웹 진입 불가 처리 및 APP에서 공유하기 제거
					$scope.checkDeptBabyAppProd($scope.reqParam.goods_no);
					*/
				});
			}
		};
		$scope.loadScreenData();	
		$scope.productInfotabIdx = 0;		

		$scope.loadingTabData = function (idx) {
			$scope.productInfotabIdx = idx;	
			$scope.thisPage = 0;
			$scope.comment = [];
			switch(idx) {
				case 0:
					$scope.func_Tab0(idx);
					$scope.sendTclick("m_DC_KidsEventDetail_Clk_Tap01");
					break;
				case 1:
					$scope.func_Tab1(idx);
					$scope.sendTclick("m_DC_KidsEventDetail_Clk_Tap02");
					break;
				case 2:
					$scope.func_Tab2(idx);
					$scope.sendTclick("m_DC_KidsEventDetail_Clk_Tap03");
					break;
			}
		};	

		// 상품설명tab0
		$scope.func_Tab0 = function(){
			$scope.loadScreenData();	
		};	
		// 신청게시판 tab1
		$scope.func_Tab1 = function(idx){	  
	        $scope.comment = [];
	        $scope.comment_tot_cnt= 0;
			//댓글 아코디언
			$scope.commentApplyListIndex;
			$scope.applyListClick = function(idx){
				$scope.end_tot_cnt= 0;
				if($scope.commentApplyListIndex == idx){
					$scope.commentApplyListIndex = null;
				}else{
					$scope.commentApplyListIndex = idx;
				}
			}
			$scope.getApplyDataLoad = function() {
	        	$scope.thisPage++;
	        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
	        		return;
	        	}
		        $http.get(LotteCommon.kidsExperienceApplyBbsData + "?evt_no=" + $scope.reqDetailParam.evt_no + "&page_num=" + $scope.thisPage)
		        .success(function(data) {
		        	if(data.comment.items != null){
			        	$scope.page_end = parseInt(data.page_end);
			       		angular.forEach(data.comment.items, function(val, key) {
			       			$scope.comment.push(val);
			       		});
			       		$scope.comment_total = data.comment.total_count;
			            $scope.comment_tot_cnt= data.comment.items[0].apply_totalcnt;
			            $scope.pageLoading = false;
			            $scope.isShowLoadingImage = false;
		        	}    
		        })
		        .error(function(data, status, headers, config){
		        	 $scope.pageLoading = false;
			         $scope.isShowLoadingImage = false;
		            console.log('Error Data : ', status, headers, config);
		        });
	        }
	        
	        $scope.page_end = 0;
	        $scope.thisPage = 0;
	        $scope.getApplyDataLoad();
	        
	        // 더보기 클릭
	    	$scope.moreListClick = function() {
	    		$scope.getApplyDataLoad();
	    	}
		};
		// 후기게시판 tab2
		$scope.func_Tab2 = function(idx,data){
			$scope.comment = [];
	        $scope.comment_edas_tot_cnt= 0;
			//댓글 아코디언
			$scope.commentAfterListIndex;
			$scope.afterListClick = function(idx){
				if($scope.commentAfterListIndex == idx){
					$scope.commentAfterListIndex = null;
				}else{
					$scope.commentAfterListIndex = idx;
				}
			}
			
			$scope.getAfterataLoad = function() {
	        	$scope.thisPage++;
	        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
	        		return;
	        	}
		        $http.get(LotteCommon.kidsExperienceReviewGdasData + "?evt_no=" + $scope.reqDetailParam.evt_no + "&goods_no=" + $scope.screenData.goods_no + "&page_num=" + $scope.thisPage)
		        .success(function(data) {
		        	if(data.comment.items != null){
			        	$scope.page_end = parseInt(data.page_end);
			        	console.log('page end ; ' + $scope.page_end)
			       		angular.forEach(data.comment.items, function(val, key) {
			       			$scope.comment.push(val);
			       		});
			        	$scope.comment_edas_total = data.comment.total_count;
			            $scope.comment_edas_tot_cnt= data.comment.items[0].apply_totalcnt;
			            $scope.pageLoading = false;
			            $scope.isShowLoadingImage = false;
		        	}    
		        })
		        .error(function(data, status, headers, config){
		        	 $scope.pageLoading = false;
			         $scope.isShowLoadingImage = false;
		            console.log('Error Data : ', status, headers, config);
		        });
	        }
	        
	        $scope.page_end = 0;
	        $scope.thisPage = 0;
	        $scope.getAfterataLoad();
	        
	        // 더보기 클릭
	    	$scope.moreListClick = function() {
	    		$scope.getAfterataLoad();
	    	}
			
		};
		
		//이미지이름구하기
		$scope.getImgName = function (imgName) {
			if (imgName.length > 0) {
				var imgGList = imgName.split("|");
				return imgGList[0];
			}
		};
		$scope.getImgName1 = function (imgName) {
			if (imgName.length > 0) {
				var imgGList = imgName.split("|");
				return imgGList[1];
			}
		};
		$scope.getImgName2 = function (imgName) {
			if (imgName.length > 0) {
				var imgGList = imgName.split("|");
				return imgGList[2];
			}
		};
    }]);

    app.directive('lotteContainer',['$http','$window','LotteCommon', function($http, $window, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/event/m/kids/experience_view_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	//FAQ 아코디언
				$scope.faqIdx=-1;
				$scope.faqAccordion = function(i){
					if($scope.faqIdx==i) $scope.faqIdx=-1;
					else $scope.faqIdx=i;
				}	
            	$scope.ProductClick = function(no, tclick) {
                	var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + no + "&curDispNoSctCd=12";
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }
            	
            	// 체험단 당첨자 발표
            	$scope.goEvtWinnerClick = function(evt_no, tclick) {
            		var url = $window.location.href = LotteCommon.kidsExperienceWinnerUrl + "?" + $scope.baseParam + "&evt_no=" + evt_no;
		       		if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
		        }
            	
            	// 체험단 신청서 작성
            	$scope.goEvtApplyClickNo = function() {
            		$scope.sendTclick("m_DC_KidsEventDetail_Clk_Btn01");
            		alert('이미 신청한 체험단입니다');
		        }
            	
            	// 체험단 신청서 작성
            	$scope.goEvtApplyClick = function(evt_no, tclick) {
            		// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = '/login/m/loginForm.do?' + targUrl;
        				return;   
        			} else{
        				var url = $window.location.href = LotteCommon.kidsExperienceWriteUrl + "?" + $scope.baseParam + "&evt_no=" + evt_no + "&isKidsApp=Y";
        				if (tclick) {
    						url += "&tclick=" + tclick;
    					}
    					$window.location.href = url;
        			}
		        }
            	
            	// 체험단 후기 작성
		        $scope.getCommentWriteUrl = function(evt_no, goods_no, tclick) {
		        	if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = '/login/m/loginForm.do?' + targUrl;
        				return;   
        			}  else{
        				$http.get(LotteCommon.kidsExperiencePrizewinnerData + "?" + "&evt_no=" + evt_no)
        		        .success(function(data) {
        		        	if(data.winner_yn == "Y"){
        		        		var url = LotteCommon.kidscommentWriteUrl + "?" + $scope.baseParam + "&isKids=Y" + "&evt_no=" + evt_no+ "&goods_no=" + goods_no + "&isKidsApp=Y";
								if (tclick) {
									url += "&tclick=" + tclick;
								}
					       		$window.location.href = url;
							} else if(data.winner_yn == "N" || data.winner_yn == ""){
								alert('체험단 당첨자인 경우에만 작성하실 수 있습니다');
							}
        		        })	
		        	}
		        }
            }
        };
    }]);
    
    app.filter('strToDate', [function() {
    	return function(item) {
    		if( item == null || item == '') {
    			return '';
    		} else {
    			return item.substr(0,4)+"."+item.substr(4,2)+"."+item.substr(6,2);	
    		}
    	}
    }]);
})(window, window.angular);