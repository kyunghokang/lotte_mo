(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('ReviewFavoriteCtrl', ['$scope', 'LotteCommon', 'LotteGA', function($scope, LotteCommon, LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "즐겨찾는 리뷰어"; //서브헤더 타이틀
        $scope.dummyUrl = "http://image.lotte.com/lotte/mo2018/reviews/default_profile.png";
        $scope.gaCtgName = "MO_내상품평_즐겨찾는리뷰어";
        
        $scope.pageUI = {
            sort : 'D',
            mode : 0,
            loadData : null
        };
        
    }]);
    
    app.directive('onErrorSrc2', function() {
 	    return {
 	        link: function(scope, element, attrs) {
 	          element.bind('error', function() {
 	        	  //console.log('attrs.curIndex ' + attrs.curIndex);
 	        	  if(!attrs.curIndex)	return;
 	        	  if(scope.pageUI.loadData.reviewerList.items[attrs.curIndex - 1].reviewerImgUrl != scope.dummyUrl){
 	        		 scope.pageUI.loadData.reviewerList.items[attrs.curIndex - 1].reviewerImgUrl = scope.dummyUrl;
 	        	  }
 	          });
 	        }
 	    }
 	});

    app.directive('lotteContainer', ['$http', '$timeout', 'LotteCommon', 'LotteGA', 'LotteForm', function($http, $timeout, LotteCommon, LotteGA, LotteForm) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/review_favorite_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                
                ($scope.loadData = function(str) {
                	
                	if(str){
                		LotteGA.evtTag($scope.gaCtgName, str, $scope.pageUI.sort == "N" ? "가나다순" : "최근즐겨찾은순");
                	}
                    $scope.jsonLoading = true; // 로딩커버
        
                    $http.get(LotteCommon.isTestFlag ? '/json/comment/favorite_reviewer_all.json' : LotteCommon.favoriteReviewerList, {
                        params:{
                            all_view_yn : 'Y',
                            sort : $scope.pageUI.sort
                        }
                    })
                    .success(function (data) {
                        if (data.favoriteReviewer) {
                            $scope.pageUI.loadData = data.favoriteReviewer;
                        }
                    })
                    .error(function () {
                        console.log('Data Error : 즐겨찾는 리뷰어 데이터 로드 실패');
                    })
                    .finally(function () {
                        $scope.jsonLoading = false; // 로딩커버
                    });
                })();
                
                $scope.editFavorite = function(){
                	$scope.pageUI.mode = 1;
                	LotteGA.evtTag($scope.gaCtgName, "편집버튼", "편집");
                };
                
                $scope.clearFavorite = function(){
                	for(var i = 0; i<$scope.pageUI.loadData.reviewerList.items.length; i++){
                        $scope.pageUI.loadData.reviewerList.items[i].checked = false;
                    }
                	$scope.pageUI.mode = 0;
                	LotteGA.evtTag($scope.gaCtgName, "편집버튼", "취소버튼");
                };

                $scope.delFavorite = function(){
                	LotteGA.evtTag($scope.gaCtgName, "편집버튼", "삭제버튼");
                	var strNo = '';
                    for(var i = 0; i<$scope.pageUI.loadData.reviewerList.items.length; i++){
                        var item = $scope.pageUI.loadData.reviewerList.items[i];
                        if(item.checked){
                            strNo += ( strNo != '' ? ',' : '' ) + item.reviewerMbrNo;
                        }
                    }
                    if(!strNo)	return;
                    
                    if(confirm('즐겨찾는 리뷰어 목록에서 삭제하시겠습니까?')){
                        LotteForm.FormSubmitForAjax(
                            LotteCommon.delFavReviewer, {
                                revr_mbr_no_list : strNo
                            })
                        .success(function (data) {
                        	//var data = JSON.parse(json);
                            if (data.data && data.data.resultCode && data.data.resultCode == '01') {
                                $scope.mode = 0;
                                $scope.loadData();
                            }
                            if(data.data.resultMsg){
                                alert(data.data.resultMsg);
                            }
                        })
                        .error(function () {
                            console.log('Data Error : 즐겨찾는 리뷰어 삭제 실패');
                        })
                        .finally(function () {
                            $scope.jsonLoading = false; // 로딩커버
                        });
                    }
                };
                
                function addZero( n ) {
                    return n<10?'0'+n:n;
                }
                
                $scope.goReviewerHome = function(item, idx){
					LotteGA.evtTag($scope.gaCtgName, "리뷰어 홈 가기", "리뷰어_" + addZero(idx), item.reviewerMbrNo);
					if(!item.reviewerHomeUrl){
						return;
					}
					$timeout(function(){
						location.href = item.reviewerHomeUrl.indexOf('?') > -1 ? item.reviewerHomeUrl + "&" + $scope.baseParam : item.reviewerHomeUrl + "?" + $scope.baseParam;
					}, 300);
                };
            }
        };
    }]);

})(window, window.angular);