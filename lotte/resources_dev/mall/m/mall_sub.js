(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteUtil',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteProduct',
        'lotteNgSwipe',
		'cateSideSearch'
    ]);
    
    app.controller('MallSubCtrl', ['$window', '$location' ,'$http', '$scope', '$timeout', '$filter', 'LotteStorage', 'LotteCommon','commInitData', function($window, $location ,$http, $scope, $timeout, $filter, LotteStorage, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productMoreScroll = true;
        $scope.screenID = "mallSub";
        $scope.subTitle = "";
        $scope.templateType = "list";
        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
        		//first: false,
        		//tabShow:false,
        		//tabIndex: 0,
        		//sortIdx: 0,
        		//tipShow: false,
        		//selectStore: 'A',
        		//selectDept: false,
        		selectCategory: 0,
        		selectCategoryDepth: 1
        		//selectBrand: 0,
        		//brandSort: 0,
        		//brandOrder: '-brnd_cnt',
        		//checkShipFree: false,
        		//checkPoint: false,
        		//checkDividFree: false,
        		//checkSmartPic: false,
        		//selectSmartPic: 0,
        		//selectSmartPicText: '전체',
        		//smartPicBox: false,
        		//disableSmartPic: true,
        		//keyword: '',
        		//minPrice: '',
        		//maxPrice: '',
        		//minLimitPrice: 0,
        		//maxLimitPrice: 0,
        		//cateRadioDep1:'',
        		//cateRadioDep2:'',
        		//cateRadioDep3:'',
        		//detailOption1: null,
        		//detailOption2: null,
        		//detailOption3: null,
        		/*sort: [
          			{sortText:'신상품',sortClass:'updown',searchKey:'DATE,1'}, 
        			{sortText:'판매순',sortClass:'updown',searchKey:'TOT_ORD_CNT,1'}, 
        			{sortText:'상품평',sortClass:'updown',searchKey:'TOT_REVIEW_CNT,1'}, 
        			{sortText:'신상품',sortClass:'updown',searchKey:'DATE,1'}, 
        			{sortText:'가격',sortClass:'down',searchKey:'DISP_PRICE,0'}, 
        			{sortText:'가격',sortClass:'up',searchKey:'DISP_PRICE,1'}, 
        		 ]*/
        	}
        	$scope.screenData = {
        		//page: 0,
        		//pageSize: 20,
        		//pageEnd: false,
        		//disp_name: null,
        		//disp_no: null,
        		idx: "",
        		mGrpNo: ""
        		//goodsTotal: 0,
        		//maxGoodsTotal:0,
        		//hasDept: false,
        		//goodsList: [],
        		//StoreList: [],
        		//SUB_CATE: [],
        		//dptsRglList: []  // 스마트픽 리스트
        	}
        })();

        /*
         * 화면에 필요한 인자값 세팅
         */
        if(commInitData.query['title'] != undefined) {
        	//$scope.screenData.disp_name = decodeURIComponent(commInitData.query['title']);
        	//$scope.subTitle = $scope.screenData.disp_name;
        	$scope.subTitle = decodeURIComponent(commInitData.query['title']);
        }
        if(commInitData.query['cateNo'] != undefined) {
        	//$scope.screenData.disp_no = commInitData.query['cateNo'];
        	//$scope.pageOptions.selectCategory = $scope.screenData.disp_no;
        	$scope.pageOptions.selectCategory = commInitData.query['cateNo'];
        }
        if(commInitData.query['cateDepth'] != undefined) {
        	$scope.pageOptions.selectCategoryDepth = commInitData.query['cateDepth'];
        }
        
        //$scope.curDispNo = $scope.screenData.disp_no;
        $scope.curDispNo = $scope.pageOptions.selectCategory;
        $scope.curDispNoSctCd = 73;
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mall/m/mall_sub_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	//
            }
        };
    });

})(window, window.angular);