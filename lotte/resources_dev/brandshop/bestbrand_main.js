(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSns',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteNgSwipe',
        'lotteSlider',
        'lotteCommFooter'
    ]);

    app.controller('BestBrandMainCtrl', ['$http', '$scope', '$window', 'LotteCommon', 'commInitData', function($http, $scope, $window, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.screenID = "BestBrandMall";
        $scope.mallID = "mall01";
        $scope.subTitle = (commInitData.query.curDispNo == "5402174") ? "아모레퍼시픽" : "몽블랑";
        $scope.screenData = {};
        $scope.screenData.head = {bgColor :"", 
        							bgType : "1",
        							title : "",
        							logo: "",
        							ctgBgColor : "", 
        							color: ""};
        
        $scope.screenData.gnbMenu = [];
        $scope.screenData.topBanner = [];
        $scope.screenData.promotion = [];
        $scope.screenData.bestItems = [];
        $scope.screenData.newArrivals = [];
        $scope.screenData.bestReview = [];
        
        $scope.headerMenuClick = function(num){
        	$window.location.href = LotteCommon.bestBrandSub + "?curDispNo=" + commInitData.query.curDispNo + "&cateSelected=" + num + "&" + $scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_" + $scope.mallID + "_cat_" + num;
        };
        $scope.goBestBrandTop = function(url, idx){
        	$window.location.href = url + (url.indexOf('?') > -1 ? '' : '?') +  
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_" + $scope.mallID + "_Ban_main_" + getAddZero(idx + 1);
        };
        $scope.goBestBrandMain = function(){
        	$window.location.href = LotteCommon.bestBrandMain +'?'+$scope.baseParam + "&curDispNo=" + commInitData.query.curDispNo + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_" + $scope.mallID + "_logo";
        };
        $scope.promotionLink = function(item, idx){
        	$window.location.href = item.img_link +'?'+$scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_" + $scope.mallID + "_Ban_promotion_" + getAddZero(idx + 1);
        };
        $scope.goNewArrival = function(goods_no, idx){
        	$window.location.href = LotteCommon.prdviewUrl + "?goods_no=" + goods_no + "&" + $scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_" + $scope.mallID + "_Prd_new_" + getAddZero(idx + 1);
        };
        $scope.goPreview = function(goods_no, idx){
        	$window.location.href = LotteCommon.prdviewUrl + "?goods_no=" + goods_no + "&" + $scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_" + $scope.mallID + "_Prd_review_" + getAddZero(idx + 1);
        };
        $scope.goSubPage = function(goods_no, num, idx){
        	$window.location.href = LotteCommon.prdviewUrl + "?goods_no=" + goods_no + "&" + $scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_" + $scope.mallID + "_Prd_best_" + num + "_" + getAddZero(idx + 1);
        };
        $scope.goSubPageMore = function(num){
        	$window.location.href = LotteCommon.bestBrandSub + "?curDispNo=" + commInitData.query.curDispNo + "&cateSelected=" + num + "&" +$scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_" + $scope.mallID + "_Prd_best_" + num +"_viewall";
        };
        
        function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
            return num < 10 ? "0" + num : num + "";
        }
        
        /**
		 * @ngdoc function
		 * @name BestBrandMainCtrl.function:loadHeaderData
		 * @description
		 * 헤더 데이터 로드
		 * @example
		 * $scope.loadHeaderData();
		 */
		$scope.loadHeaderData = function() {
			var url = LotteCommon.bestBrandHeaderData + "?curDispNo=" + ( commInitData.query.curDispNo || "" ) ;
			$http.get(url)
			.success(function(data) {
				if(data.max){
					var max = data.max;
					// 헤더, GNB 셋팅
					if(max.header_logo_img_info && max.header_logo_img_info.items && max.header_logo_img_info.items.length > 0){
						$scope.screenData.head.logo = max.header_logo_img_info.items[0].img_url;
						$scope.screenData.head.title = max.header_logo_img_info.items[0].banner_nm;
					}
					if(max.header_logo_text_info && max.header_logo_text_info.items && max.header_logo_text_info.items.length > 0){
						$scope.screenData.head.bgColor = max.header_logo_text_info.items[0].text_conts_tit_nm;
						$scope.screenData.head.bgType = max.header_logo_text_info.items[0].text_conts_desc_cont;
					}
					if(max.header_cate_text_info && max.header_cate_text_info.items && max.header_cate_text_info.items.length > 0){
						$scope.screenData.head.color = max.header_cate_text_info.items[0].text_conts_desc_cont;
						$scope.screenData.head.ctgBgColor = max.header_cate_text_info.items[0].text_conts_tit_nm;
					}
					if(max.header_logo_text_info && max.header_logo_text_info.items && max.header_logo_text_info.items.length > 0){
						$scope.screenData.head.logo = max.header_logo_img_info.items[0].img_url;
					}
				}
			});
		};
		
		/**
		 * @ngdoc function
		 * @name BestBrandMainCtrl.function:loadScreenData
		 * @description
		 * 화면 데이터 로드
		 * @example
		 * $scope.loadScreenData();
		 */
		$scope.loadScreenData = function() {
			var url = LotteCommon.bestBrandMainData + "?curDispNo=" + ( commInitData.query.curDispNo || "" ) ;
			$http.get(url)
			.success(function(data) {
				if(data.max){
					var max = data.max;
					if(max.top_cate_sml_list && max.top_cate_sml_list.items && max.top_cate_sml_list.items.length > 0){
						$scope.screenData.gnbMenu = max.top_cate_sml_list.items;
					}
					if(max.main_ban_list && max.main_ban_list.items && max.main_ban_list.items.length > 0){
						$scope.screenData.topBanner = max.main_ban_list.items;
					}
					if(max.prom_news_list && max.prom_news_list.items && max.prom_news_list.items.length > 0){
						$scope.screenData.promotion = max.prom_news_list.items;
					}
					if(max.new_arrivals && max.new_arrivals.items && max.new_arrivals.items.length > 0){
						$scope.screenData.newArrivals = max.new_arrivals.items;
					}
					if(max.best_review && max.best_review.items && max.best_review.items.length > 0){
						$scope.screenData.bestReview = max.best_review.items;
					}
					if(max.cate_best_goods_list && max.cate_best_goods_list.items && max.cate_best_goods_list.items.length > 0){
						for(var i = 0; i<max.cate_best_goods_list.items.length; i++){
							var tempItems = max.cate_best_goods_list.items[i];
							if(tempItems && tempItems.best_goods_list && tempItems.best_goods_list.length > 0){
								tempItems.best_goods_list.push({last:true});
								$scope.screenData.bestItems.push(tempItems);
							}
						}
					}
				}
			});
		};
		$scope.loadHeaderData();
		$scope.loadScreenData();
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/brandshop/bestbrand_main_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });
    
    /* header each */
	app.directive('subHeaderEach', ['$window', function($window) {
		return {
			replace : true,
			link : function($scope, el, attrs) {
				$scope.gotoPrepage = function() {
					$scope.sendTclick("m_RDC_header_new_pre");
					history.go(-1);
				};
				
				var $el = angular.element(el),
					$win = angular.element($window),
					headerHeight = $scope.subHeaderHeight;

				$win = angular.element($window),
				headerHeight = $scope.subHeaderHeight;

				function setHeaderFixed() {
					if ($scope.appObj.isNativeHeader) {
						headerHeight = 0;
					}

					if ($win.scrollTop() >= 0) {
						$el.attr("style", "z-index:10;position:fixed;top:" + headerHeight +"px;width:100%");
					} else {
						$el.removeAttr("style");
					}
				}

				$win.on('scroll', function (evt) {
					setHeaderFixed();
					setTimeout(setHeaderFixed, 300);
				});
			}
		}
	}]);

})(window, window.angular);