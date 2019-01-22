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
        'ngPinchZoom',
        'lotteVideo'
    ]);
    
    app.controller('ProductCommentDetailCtrl', ['$window', '$http', '$scope', '$timeout', '$compile', '$rootScope', 'LotteCommon', 'commInitData', 'LotteGA', function($window, $http, $scope, $timeout, $compile, $rootScope, LotteCommon, commInitData, LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "사진/영상 크게보기"; // 서브헤더 타이틀
        $scope.screenID = "product_comment_detail"; // 스크린 아이디
		$scope.jsonLoading = false; // 로딩커버
		$scope.gaCtgName = "MO_상품상세_사진/영상 크게보기";

		$scope.pageUI = {
            gdasNo: null,
	       	baseParam: $scope.baseParam,
	       	curIdx: 0, // 전체 상품평 중 선택된 상품평 인덱스
	       	imgIdx: 0, // 상품평 하나 안의 현재 선택된 이미지 인덱스
	       	loadData: {
	       		photoItems : []
	       	},
	       	reqParam: {}
        };
		
		$scope.dummyUrl = "http://image.lotte.com/lotte/mo2018/reviews/default_profile.png";
		
        // 상품평 상세보기에서는 usm_goods_no, photoview=Y, tot_cnt(사진상품평 전체개수. photoList.total_count+photoMoreCnt) 전달 부탁드립니다.

        $scope.pageUI.reqParam.goods_no = commInitData.query['goods_no'] ? commInitData.query['goods_no'] : '';

		$scope.pageUI.reqParam.usm_goods_no = commInitData.query['usm_goods_no'] ? commInitData.query['usm_goods_no'] : '';
		$scope.pageUI.reqParam.photoview = 'Y';
        $scope.pageUI.reqParam.tot_cnt = commInitData.query['tot_cnt'] ? commInitData.query['tot_cnt'] : '1';
        $scope.pageUI.gdasNo = commInitData.query['gdas_no'] ? commInitData.query['gdas_no'] : null;
        $scope.pageUI.imgIdx = commInitData.query['id'] ? commInitData.query['id'] : null;
        
        //var startIndex = commInitData.query['start_index'] ? commInitData.query['start_index'] : 0;
        var startIndex = 0;
        
		$scope.loadData = function() {
			$scope.jsonLoading = true; // 로딩커버

			$http.get(LotteCommon.prodSubCommentImageData, {
                params:$scope.pageUI.reqParam
            })
			.success(function (data) {
				if (data.data) {
					//console.log("상품평 상세보기 데이터 로드");
                    $scope.pageUI.loadData = modifiedData(data.data);
                    
                	$timeout(function(){
            			$scope.reviewSwipeCurIdx = parseInt(startIndex, 10);
            			$scope.sb_review_index = $scope.reviewSwipeCurIdx + 1;
            			$scope.swipeReviewControl.moveIndex($scope.reviewSwipeCurIdx);
            		}, 500);
				}
			})
			.error(function () {
				console.log('Data Error : 상품평 상세보기 데이터 로드 실패');
			})
			.finally(function () {
				$scope.jsonLoading = false; // 로딩커버
			});
        };

        function modifiedData(data) {
            var rtnData = {}; // obj
            rtnData.photoItems = [];
            var photoCnt = 0;
            
            for (var i = 0; i < data.critList.items.length; i++) {
            	var item = data.critList.items[i];
                if (item.photoList && item.photoList.items.length > 0) {
                	if(item.videoUrl){
                		var temp = {};
                    	temp.critTpCd = item.critTpCd;
                    	temp.videoUrl = item.videoUrl;
                    	temp.wrtrId = item.wrtrId;
                    	temp.wrtrTpNm = item.wrtrTpNm;
                    	temp.gdasTpNm = item.gdasTpNm;
                    	temp.critPnt = item.critPnt;
                    	temp.regDate = item.regDate;
                    	temp.critCont = item.critCont;
                    	temp.total = item.photoList.items.length;
                    	temp.imgMain = item.photoList.items[0].imgUrl;
                    	temp.gdasNo = item.gdasNo;
                    	temp.reviewerNickname = item.reviewerNickname;
                    	temp.reviewerFlag = item.reviewerFlag;
                    	temp.catReviewerFlag = item.catReviewerFlag;
                    	temp.reviewerHomeUrl = item.reviewerHomeUrl;
                    	temp.reviewerImgUrl = item.reviewerImgUrl;
                    	var curGdasCnt = 0;
                    	if(item.easnGdasList && item.easnGdasList.items){
                    		temp.reviewList = item.easnGdasList.items;
                    	}
                        rtnData.photoItems.push(temp);
                        if($scope.pageUI.gdasNo == temp.gdasNo && $scope.pageUI.imgIdx == curGdasCnt){
                        	startIndex = photoCnt;
                        }
                        curGdasCnt++;
                        photoCnt++;
                	}else{
                		var curGdasCnt = 0;
                		for(var j = 0; j < item.photoList.items.length; j++){
                			var obj = {};
                        	obj.critTpCd = item.critTpCd;
                        	obj.videoUrl = item.videoUrl;
                        	obj.wrtrId = item.wrtrId;
                        	obj.wrtrTpNm = item.wrtrTpNm;
                        	obj.gdasTpNm = item.gdasTpNm;
                        	obj.critPnt = item.critPnt;
                        	obj.regDate = item.regDate;
                        	obj.critCont = item.critCont;
                        	obj.total = item.photoList.items.length;
                        	obj.imgMain = item.photoList.items[0].imgUrl;
                        	obj.gdasNo = item.gdasNo;
                        	obj.reviewerNickname = item.reviewerNickname;
                        	obj.reviewerFlag = item.reviewerFlag;
                        	obj.catReviewerFlag = item.catReviewerFlag;
                        	obj.reviewerHomeUrl = item.reviewerHomeUrl;
                        	obj.reviewerImgUrl = item.reviewerImgUrl;
                        	if(item.easnGdasList && item.easnGdasList.items){
                        		obj.reviewList = item.easnGdasList.items;
                        	}
                    		obj.imgUrl = item.photoList.items[j].imgUrl;
                    		rtnData.photoItems.push(obj);
                    		if($scope.pageUI.gdasNo == obj.gdasNo && $scope.pageUI.imgIdx == curGdasCnt){
                    			startIndex = photoCnt;
                    		}
                    		curGdasCnt++;
                    		photoCnt++;
                    	}
                	}
                }
            }
            //console.log(rtnData);
            return rtnData;
        }
        $scope.loadData();

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
			
			LotteGA.evtTag($scope.gaCtgName, "이미지영역", "스와이프");
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
				$scope.reviewSwipeCurIdx = $scope.pageUI.loadData.photoItems.length;
			}else{
				$scope.reviewSwipeCurIdx--;
			}
			$scope.swipeReviewControl.moveIndex($scope.reviewSwipeCurIdx);
			
			if($scope.sb_review_index == 1) {
			 	$scope.sb_review_index = $scope.pageUI.loadData.photoItems.length;
			}else{
				$scope.sb_review_index--;
			}
		};
		
		$scope.swipeNextReview = function() {
			if($scope.reviewSwipeCurIdx === $scope.pageUI.loadData.photoItems.length -1){
				$scope.reviewSwipeCurIdx = 0;
			}else{
				$scope.reviewSwipeCurIdx++;
			}
			$scope.swipeReviewControl.moveIndex($scope.reviewSwipeCurIdx);
			
			if($scope.sb_review_index == $scope.pageUI.loadData.photoItems.length) {
			 	$scope.sb_review_index = 1;
			}else{
				$scope.sb_review_index++;
			}
		};
		
		// 해당 상품평 상세
		$scope.productCommentDetailOne = function(gdasNo) {
			LotteGA.evtTag($scope.gaCtgName, "리뷰 정보", "상품평 상세보기 가기");
			$timeout(function(){
				location.href = LotteCommon.productSubCommentEach + "?" + $scope.baseParam + "&goods_no=" + $scope.pageUI.reqParam.goods_no + "&gdas_no=" + gdasNo + "&usm_goods_no=" + ( $scope.pageUI.reqParam.usm_goods_no || "" );
			}, 300);
		};
    }]);

    app.directive('lotteContainer', ['$timeout', 'LotteGA', function($timeout, LotteGA) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/sub/product_comment_detail_container.html',
            replace : true,
            link : function($scope, el, attrs) {
				$scope.isShowBtnTalk = false; // 톡상담 버튼 감추기

				// 리뷰어홈 또는 내 상품평관리 가기
				$scope.goReviewerHome = function(item){
					LotteGA.evtTag($scope.gaCtgName, "리뷰 정보", "리뷰어홈 가기");
					$timeout(function(){
						if(item.reviewerHomeUrl)
							location.href = item.reviewerHomeUrl.indexOf('?') > -1 ? item.reviewerHomeUrl + "&" + $scope.baseParam : item.reviewerHomeUrl + "?" + $scope.baseParam
					}, 300);
				};
				
				$scope.sendGA = function(str){
					if(str == 'play'){
						LotteGA.evtTag($scope.gaCtgName, "이미지영역", "영상재생");
					}
				};
            }
        };
    }]);

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
 	        	  if(scope.pageUI.loadData.photoItems[attrs.curIndex - 1].reviewerImgUrl != scope.dummyUrl){
 	        		 scope.pageUI.loadData.photoItems[attrs.curIndex - 1].reviewerImgUrl = scope.dummyUrl;
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
