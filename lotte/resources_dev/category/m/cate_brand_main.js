(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteProduct',
        'lotteNgSwipe'
    ]);

    app.controller('BrandMainCtrl', ['$window', '$location' ,'$http', '$scope', '$timeout', '$filter', 'LotteStorage', 'LotteCommon','commInitData', function($window, $location ,$http, $scope, $timeout, $filter, LotteStorage, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.screenID = "BrandShop";
        $scope.subTitle = ""; //"브랜드샵" 서브헤더 타이틀
        
        $scope.brandInfo = [];
        $scope.BrandCateList = [];
        $scope.productList = [];
        $scope.BannerList = [];

        $scope.upBrdNo = "";
        $scope.brdNo = "";
        if(commInitData.query['upBrdNo'] != undefined) {
        	$scope.upBrdNo = commInitData.query['upBrdNo'];
        }
        if(commInitData.query['brdNo'] != undefined) {
        	$scope.brdNo = commInitData.query['brdNo'];
        }
        
        $scope.curDispNo = $scope.brdNo!="" ? $scope.brdNo : $scope.upBrdNo;
        $scope.curDispNoSctCd = 74;
        
        var brandMainUrl = LotteCommon.brandShopData+"?upBrdNo="+$scope.upBrdNo+"&brdNo="+$scope.brdNo;
	    $scope.getBrandMainData = function() {
	        $http.get(brandMainUrl)
	        .success(function(data) {
	        	try{
		        	$scope.brandInfo = data.BrandInfo;
		        	if(data.BrandCateList) {
		        		$scope.BrandCateList = data.BrandCateList.items;
		        	}
		        	if(data.Banner) {
		        		$scope.BannerList = data.Banner.items;
		        	}
		        	if(data.GoodsList) {
		        		$scope.productList = data.GoodsList.items;
		        	}
		        	$scope.subTitle = $scope.brandInfo.brnd_nm;
	        	} catch(e) {
	        		console.log('Error Data : 브랜드 데이터 로딩 실패');
	        	}
	        })
	        .error(function(data, status, headers, config){
	            console.log('Error Data : ', status, headers, config);
	        });
	    }
        
        // 세션에서 가저올 부분 선언 
        //
        //
        var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
        var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
        var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');
        
        if(StoredLoc == window.location.href && $scope.locationHistoryBack) {
        	var StoredData = JSON.parse(StoredDataStr);
    		$scope.pageLoading = false;

        	$scope.brandInfo = StoredData.brandInfo;
        	$scope.BrandCateList = StoredData.BrandCateList;
        	$scope.BannerList = StoredData.BannerList;
        	$scope.productList = StoredData.productList;
        	
        	$scope.subTitle = $scope.brandInfo.brnd_nm; /*브랜드 타이틀*/
        	$timeout(function() {
        		angular.element($window).scrollTop(StoredScrollY);
        	},800);
        } else {
        	$scope.getBrandMainData();
        }
        
        /**
         * unload시 관련 데이터를 sessionStorage에 저장
         */
        angular.element($window).on("unload", function(e) {
            var sess = {};
            sess.brandInfo = $scope.brandInfo;
        	sess.BrandCateList = $scope.BrandCateList;
        	sess.BannerList = $scope.BannerList;
        	sess.productList = $scope.productList;
            if (!commInitData.query.localtest && $scope.leavePageStroage) {
	            LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
	            LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
	            LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
            }
        });
    }]);

    app.directive('lotteContainer',['LotteCommon', function(LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/category/m/cate_brand_main_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	$scope.brandSubClick = function(item) {
            		var brandNm = $scope.brandInfo ? $scope.brandInfo.brnd_nm:"";
            		var tclick = "&tclick="+$scope.tClickBase+$scope.screenID+"_Clk_Lnk_"+(this.$index+1);
            		location.href = LotteCommon.brandShopSubUrl+((LotteCommon.brandShopSubUrl.indexOf('?')!=-1)?"&":"?")+$scope.baseParam+"&upBrdNo="+$scope.upBrdNo+"&mGrpNo="+item.disp_no+"&title="+brandNm+"&curDispNoSctCd="+$scope.curDispNoSctCd+tclick;
            	}
            	
            	$scope.brandShopBannerClick = function(item,$index) {
            		var tclick = "&tclick="+$scope.tClickBase+$scope.screenID+"_Swp_Ban_"+(this.$index+1);
            		window.location.href = LotteCommon.prdlstUrl+((LotteCommon.prdlstUrl.indexOf('?')!=-1)?"&":"?")+$scope.baseParam+"&curDispNo="+item.spdp_no+"&curDispNoSctCd="+$scope.curDispNoSctCd+tclick;
            	}
            }
        };
    }]);

})(window, window.angular);