(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteUnit',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteProduct',
        'lotteNgSwipe'
    ]);
    
    app.controller('productUnitCtrl', ['$scope', '$http', 'LotteCommon', function($scope, $http, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "product_unit"; //서브헤더 타이틀
        // 상품 리스트 스크롤 로드 사용 유/무
        $scope.productMoreScroll = true;
        // 상품 배너 디스플레이
        $scope.dispBanner = false;
        // Swipe List 
        $scope.swipeList = false;
        
        // 임시 경로
        // 리소스 Root (LotteCommon에서 받아 와야함)
        $scope.resourceRootUrl = "http://motest.lotte.com";
        
        // 상품 리스트 템플릿 경로지정
        $scope.productUnitTemplate = $scope.resourceRootUrl+'/lotte/resources_dev/product_unit/product_unit_container.html';
        // 상품 리스트 Json data 가저올 경로
        $scope.productListUrl = "/lotte/resources_dev/data/main/main_deal.html";
        $scope.templateType = "box";
        
        $scope.productsObj = {list:[],totalItems:0,totalMixItems:0};
        // 배너 디스플레이 활성
        $scope.productListBannerShow = true;
        $scope.productList = [];
        $scope.bannerList = [];
        var node = 0;
        
        $scope.loadMoreProduct = function() {
        	$scope.productListLoading = true;
       		$scope.isShowLoading = true;

       		$http.get($scope.productListUrl)
            .success(function(data) {
            	var pData,bData;
            	pData = data.main_contents.prd_deal_list.items;
            	if(data.main_contents.ban_list) {
            		$scope.bannerList = data.main_contents.ban_list.items;
            	}
            	$scope.productsObj = $scope.addProductList(pData,$scope.productsObj);
            	$scope.productList = $scope.productsObj.list;
            	$scope.productListLoading = false;
            })
            .error(function(data, status, headers, config){
                console.log('Error Data : ', status, headers, config);
            });
        }
        
        $scope.otherProductList = function(idx) {
        	console.log(idx);
        }
        $scope.loadMoreProduct();
        
    }]);
    
    app.directive('lotteContainer',['$window',function($window) {
        return {
        	template: '<div ng-controller="productCtrl" lotte-ng-list-swipe '
        			+'swipe-end-exec="otherProductList($event)" '
        			+'swipe-max-ratio="0.3" '
        			+'swipe-loading-el=".loadWrap" '
        			+'swipe-min-distance="40">'
        			+'<div product-container template="/lotte/resources_dev/product_unit/product_unit_container.html" products="productList" more-product-continer="loadMoreProduct()"></div></div>',
            replace : true,
            link : function($scope, el, attrs) {
                function onOrientationChange() {
                	//alert(1);
                }

                // handle orientation change
                //var winEl = angular.element($window);
                //winEl.bind('orientationchange', onOrientationChange);
                //winEl.bind('resize', onOrientationChange);
            }
        };
    }]);
    
    
})(window, window.angular);