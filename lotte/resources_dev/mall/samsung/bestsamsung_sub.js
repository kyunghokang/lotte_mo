(function(window, angular, undefined) {
	'use strict';
	
	var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSns',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteNgSwipe',
        'lotteCommFooter'
	]);
	
	app.controller('bestSamsungSubCtrl',['$http', '$scope', '$window', '$timeout', 'LotteCommon', 'commInitData', function($http, $scope, $window, $timeout, LotteCommon, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "삼성전자 브랜드샵";//서브헤더 타이틀
		$scope.screenID = "SpeMall_Samsung_sub";
		$scope.productMoreScroll = true;
		$scope.isLoading = false;
		$scope.screenData = {};

		$scope.screenData.category_1depth_list = [];
        $scope.screenData.category_2depth_list = [];
		$scope.screenData.products = [];
		$scope.screenData.noproduct = false;
		$scope.screenData.benefit = {};
		 $scope.optionDataReset = function () {
			$scope.pageOptions = {
				cate1:commInitData.query.cateSelected || 0,
				cate2:commInitData.query.cateSelected || 0,
				cate1nm:'',
				cate2nm:'전체',
				cateShow:[false,false],
				cateSelected: commInitData.query.cateSelected || "",
				sortSelect : commInitData.query.lstSortCd || 11,
        		page : 0,
        		cateName: "",
        		totalCnt : 0
			}
		}();

		$scope.getCatRange = function (range) {
			var rangeList = [];

			for (var i = 0;i < range / 10; i++) {
				rangeList.push(i);
			}

			return rangeList;
		};

		$scope.categorySelectClick = function (idx) {
			// console.log($scope.screenData.category_1depth_list);
			if ($scope.pageOptions.cateShow[idx] == true) {
				$scope.pageOptions.cateShow = [false,false];
			} else {
				var el = angular.element("#cateSwipe" + idx);

				$timeout(function () {
					el.css("height",el.find('li:eq(0)').height());
				});

				$scope.pageOptions.cateShow = [false, false];
				$scope.pageOptions.cateShow[idx] = true;
			}
		};
		
		$scope.goSamsungBrandMain = function(){
        	$window.location.href = LotteCommon.samsungBrandMain +'?'+$scope.baseParam + "&curDispNo=" + commInitData.query.curDispNo + 
        	"&tclick=" + $scope.tClickBase + "_SpeMall_Samsung_logo";
        };



		/*
		 * 베스트 카테고리 변경
		 */
		$scope.categoryChoiceClick = function (node, item, idx) {
			var loadContents = {realtime_best_prod_list:true};

			$scope.pageOptions.cateShow = [false,false];

			switch (node) {
				case 0:
					if (item.disp_no == 0) {
						$scope.pageOptions.cate1 = 0;
						$scope.pageOptions.cate1nm = item.disp_nm;
						$scope.pageOptions.cateSelected = 0;
					} else {
						$scope.pageOptions.cate1nm = item.disp_nm;
						$scope.pageOptions.cate1 = item.disp_no;
						$scope.pageOptions.cateShow = [false,true];
						$scope.pageOptions.cateSelected = item.disp_no;
					}

					$scope.pageOptions.cate2nm = "전체";
					$scope.pageOptions.cate2 = commInitData.query.cateSelected;

					$scope.screenData.category_2depth_list = $scope.screenData.category_1depth_list[idx].sub_cate_list || [];
					break;
				case 1:
					if (item.disp_no == 0) {
						$scope.pageOptions.cate2 = commInitData.query.cateSelected;
						$scope.pageOptions.cate2nm = "전체";
						$scope.pageOptions.cateSelected = $scope.pageOptions.cate1;
					} else {
						$scope.pageOptions.cate2nm = item.disp_nm;
						$scope.pageOptions.cate2 = item.disp_no;
						$scope.pageOptions.cateSelected = item.disp_no;
					}
					break;
			}

			$scope.pageOptions.page = 0;
			$scope.loadScreenData();
			
			$scope.sendTclick($scope.tClickBase + $scope.screenID + '_' + $scope.pageOptions.cateSelected);
		};
		$scope.pageOptions.cateShow = [false, true];
		
		$scope.sortClick = function(idx){
			$scope.pageOptions.page = 0;
			$scope.loadScreenData();
			$scope.sendTclick($scope.tClickBase + $scope.screenID +'_Clk_Sort_' + getAddZero($('#sortSelect option:selected').index() + 1));
		};
		
		$scope.moreLoadData = function(){

			if($scope.pageOptions.totalCnt > $scope.screenData.products.length && $scope.pageOptions.totalCnt > 0)
				$scope.loadScreenData();
		};
		
		$scope.closeCate = function(){
			$scope.pageOptions.cateShow = [false,false];
		};
		
		$scope.goGoodsPage = function(goods_no, idx){
        	$window.location.href = LotteCommon.prdviewUrl + "?goods_no=" + goods_no + "&" + $scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_Clk_" + $scope.pageOptions.cateSelected + "_item_" + getAddZero(idx + 1);
        };
		
		//혜택배너
		$scope.goBenefitProd = function(url){
			$window.location.href = url + (url.indexOf('?') > -1 ? '&' : '?') + $scope.baseParam  +  
			"&tclick=" + $scope.tClickBase + $scope.screenID + "_Ban_Benefit";
		}

		function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
            return num < 10 ? "0" + num : num + "";
        }
	

		/**
		 * @ngdoc function
		 * @name bestSamsungSubCtrl.function:loadScreenData
		 * @description
		 * 화면 데이터 로드
		 * @example
		 * $scope.loadScreenData();
		 */
		$scope.loadScreenData = function() {
			$scope.pageOptions.page++;
			$scope.isLoading = true;
			


			var param = "?curDispNo=" + $scope.pageOptions.cateSelected + "&pageIdx=" + $scope.pageOptions.page + "&lstSortCd=" + $scope.pageOptions.sortSelect;
			var url = LotteCommon.samsungBrandSubcontData + param;
			$http.get(url)
			.success(function(data) {
				if(data.max){
					var max = data.max;
					
					if(max.top_cate_list && max.top_cate_list.items && max.top_cate_list.items.length > 0){
						var temp = max.top_cate_list.items;
						$scope.screenData.category_1depth_list = [];
						$scope.screenData.category_2depth_list = [];

						for(var i = 0; i<temp.length; i++){
							if(temp[i].dpth_no && temp[i].dpth_no == 2){
								$scope.screenData.category_1depth_list.push(temp[i]);
							}else if(temp[i].dpth_no && temp[i].dpth_no == 3){
								$scope.screenData.category_2depth_list.push(temp[i]);
							}
							if(temp[i].disp_no == $scope.pageOptions.cateSelected){
								if(temp[i].dpth_no && temp[i].dpth_no == 2){
									$scope.pageOptions.cate1nm = temp[i].disp_nm;
								}
								$scope.pageOptions.cateName = temp[i].disp_nm;
							}
						}
			            var allCat = {
		      				disp_nm: "전체",
		      				disp_no: commInitData.query.cateSelected
		      			};
			            $scope.screenData.category_2depth_list.unshift(allCat);
					}
					
					if(max.prdList && max.prdList.items && max.prdList.items.length > 0 && max.goodsTotalCnt > 0){
						if($scope.pageOptions.page == 1)	$scope.screenData.products = [];
						var arrTemp = [];
						$scope.screenData.noproduct = false;

						for(var i = 0; i<max.prdList.items.length; i++){
							var objTemp = max.prdList.items[i];
							if(objTemp.brnd_nm){
								objTemp.title_nm = "[" +objTemp.brnd_nm + "] " + objTemp.goods_nm;
							}else{
								objTemp.title_nm = objTemp.goods_nm;
							}
							arrTemp.push(objTemp);
						}
						$scope.screenData.products = $scope.screenData.products.concat(arrTemp);
						$scope.pageOptions.totalCnt = max.goodsTotalCnt;
					}else{
						$scope.screenData.products = [];
						$scope.pageOptions.totalCnt = max.goodsTotalCnt || 0;
						$scope.screenData.noproduct = true;
					}
					
					if(max.benefit_ban && max.benefit_ban.img_url.length > 0){
						$scope.screenData.benefit = max.benefit_ban;
					}
				}
				$scope.isLoading = false;
 			});
			if($scope.pageOptions.page > 1){
				$scope.sendTclick($scope.tClickBase + $scope.screenID + '_' + $scope.pageOptions.cateSelected + '_load' + getAddZero($scope.pageOptions.page));
			}
		};
		$scope.loadScreenData();
	}]);
	

	app.filter('pageRange', [function () {
		return function (items, page, pgsize) {
			var newItem = [];

			for (var i = 0;i < items.length; i++) {
				if (page * pgsize <= i && (page+1) * pgsize > i) {
					newItem.push(items[i]);
				}
			}
			return newItem;
		}
	}]);


	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/mall/samsung/bestsamsung_sub_container.html',
			replace : true,
			link : function($scope, el, attrs) {
			}
		};
	});

    /* header each */
	app.directive('subHeaderEach', [ '$window', function($window) {
		return {
			replace : true,
			link : function($scope, el, attrs) {
				/*이전 페이지 링크*/
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
	
	// 상품 더보기 자동 스크롤
	app.directive("moreGoodsContainer",['$rootScope','$window', '$parse', '$http' , '$log', 'LotteCommon', 'LotteUtil', function ($rootScope , $window, $parse,$http,$log,LotteCommon, LotteUtil) {
		return {
			link : function($scope, el, attrs) {
				var loadMoreHandler = $parse(attrs.moreGoodsContainer);
                
				if ($scope.productMoreScroll) {
					var $win = angular.element($window);
					$win.scroll(function() {
						if (!$scope.productMoreScroll) {
							return ;
						}
						if($win.scrollTop() + $win.height() > angular.element(document).height() - angular.element('#footer').height() - angular.element('.benefit_ban').height()) {
							//console.log("near bottom!");
							if(!$scope.isLoading){
								$scope.$apply(attrs.moreGoodsContainer);
							}
						}
					});
				}
			}
		}
	}]);
	
})(window, window.angular);