(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'product-sub-header'
    ]);

    app.controller('ProductCommentImageCtrl', ['$window', '$http', '$scope', '$timeout', 'LotteCommon', 'commInitData', function($window, $http, $scope, $timeout, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productSubTitle = "사진/영상 모아보기"; //서브헤더 타이틀
        $scope.screenID = "product_comment_image"; // 스크린 아이디
        $scope.jsonLoading = false; // 로딩커버
        $scope.gaCtgName = "MO_상품상세_사진/영상 모아보기";

        $scope.pageUI = {
            selectTab: 1,
            loadData: null,
            reqParam: {}
        };
        
        $scope.picHeight = parseInt(($(document).width() - 28) / 3, 10);
        $scope.pageUI.reqParam.goods_no = commInitData.query['goods_no'] ? commInitData.query['goods_no'] : '';
        $scope.pageUI.reqParam.usm_goods_no = commInitData.query['usm_goods_no'] ? commInitData.query['usm_goods_no'] : '';
        
        $scope.loadData = function() {
			$scope.jsonLoading = true; // 로딩커버

			$http.get(LotteCommon.prodSubCommentImageData , {
                params:$scope.pageUI.reqParam
            })
			.success(function (data) {
				if (data.data) {
					//console.log("상품평 상세보기 데이터 로드");
                    $scope.pageUI.loadData = modifiedData(data.data);
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
            rtnData.videoItems = [];

            for (var i = 0; i < data.critList.items.length; i++) {
            	var item = data.critList.items[i];
                if (item.photoList && item.photoList.items.length > 0) {
                	
                	if(item.videoUrl){
                		var temp = {};
                    	temp.critTpCd = item.critTpCd;
                    	temp.videoUrl = item.videoUrl;
                    	temp.critCont = item.critCont;
                    	temp.total = item.photoList.items.length;
                    	temp.imgMain = item.photoList.items[0].imgUrl;
                		temp.contsUrl = item.photoList.items[0].contsUrl;
                        rtnData.videoItems.push(temp);
                	}else{
                		for(var j = 0; j < item.photoList.items.length; j++){
                			var obj = {};
                        	obj.critTpCd = item.critTpCd;
                        	obj.critCont = item.critCont;
                        	obj.total = item.photoList.items.length;
                    		obj.imgUrl = item.photoList.items[j].imgUrl;
                    		obj.contsUrl = item.photoList.items[j].contsUrl;
                    		rtnData.photoItems.push(obj);
                    	}
                	}
                }
            }
            //console.log(rtnData);
            return rtnData;
        }
        $scope.loadData();
        
        $scope.addZero = function(v, len){
        	var str = v + '';
        	var count = len || 2;
        	while(str.length < count){
        		str = '0' + str;
        	}
            return str;
        };
    }]);

    app.directive('lotteContainer', ['$timeout', 'LotteUtil', 'LotteGA', function($timeout, LotteUtil, LotteGA) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/sub/product_comment_image_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
            	$scope.linkClick = function (linkUrl, index) {
					//console.log('linkUrl', linkUrl);
					LotteGA.evtTag($scope.gaCtgName, $scope.pageUI.selectTab == 2 ? "영상 탭" : "사진 탭", $scope.addZero(index, 3));
					$timeout(function(){
						location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.baseParam + "&tclick=");
					}, 300);
				};
				
				$scope.clickTab = function(index){
					$scope.pageUI.selectTab = index;
					LotteGA.evtTag($scope.gaCtgName, index == 2 ? "영상 탭" : "사진 탭", "탭 클릭");
				};
            }
        };
    }]);

})(window, window.angular);