(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteNgSwipe'
	]);

	app.controller('SpecialMallMainCtrl', ['$http', '$scope', 'LotteCommon', 'commInitData', function($http, $scope, LotteCommon, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		// $scope.screenID = "전문몰"; // 스크린 아이디
		$scope.pageLoading = false;

		// 스크린 데이터
		($scope.screenDataReset = function() {
			$scope.pageOptions = {
			}
			$scope.screenData = {
				page: 0,
				disp_name: decodeURIComponent(commInitData.query.title),
				dispNo: commInitData.query.dispNo, //1300K : 5492531, 1200M : 5453087, 텐바이텐 : 5293948
				showAllCategory: false,
				selectCate1: 0,
				selectCate2: 0,
				selectCate3: 0,
				selectedCategory: 0,
				cate_list: [],
				top_banner_list:[],
				prod_list: []
			}
		})();

		$scope.subTitle = $scope.screenData.disp_name;

		var gubunTitleObj = {
			"5492531" : ["WHAT's NEW", "MD's PICK", "BEST OF BEST"],
			"5453087" : ["WHAT's NEW", "MD's PICK", "BEST OF BEST"],
			"5293948" : ["FOCUS ON", "New Arrival", "BEST Seller"]
		};
		$scope.gubunTitle = gubunTitleObj[$scope.screenData.dispNo];
        //20160901 dispNo 가 위 3개 가 아닌경우
        if($scope.screenData.dispNo != '5492531' && 
           $scope.screenData.dispNo != '5453087' && 
           $scope.screenData.dispNo != '5293948'){
            $scope.gubunTitle = ["WHAT's NEW", "MD's PICK", "BEST OF BEST"];
        }
        
		$scope.checkHasSub = function(item) {
			angular.forEach(item, function(val) {
				if(val.sub_cate_list != null) {
					if(val.sub_cate_list.length) {
						val.hasSub = true;
						val.sub_cate_list = $scope.checkHasSub(val.sub_cate_list);
					} else {
						val.hasSub = false;
					}
				} else {
					val.hasSub = false;
				}
			});
			return item;
		};

		/*
		 * 스크린 데이터 로드
		 */
		$scope.loadScreenData = function() {
			$scope.screenData.page++;
			$scope.pageLoading = true;
			$scope.productListLoading = true;
			$http.get(LotteCommon.specialMallMain+'?dispNo='+$scope.screenData.dispNo)
			.success(function(data) {
				var contents = [];
				var newVal = [];
				if(data['max'] != undefined) {
					contents = data['max'];
					$scope.screenData.cate_list = contents.cate_list.items;
					angular.forEach($scope.screenData.cate_list, function(val, key) {
						if($scope.screenData.dispNo == 5293948) { //텐바이텐
							val.cate_depth = 2;
							val.disp_no = key+1;
						}
						if(val.sub_cate_list != null) {
							if(val.sub_cate_list.length) {
								val.hasSub = true;
								val.sub_cate_list = $scope.checkHasSub(val.sub_cate_list);
							} else {
								val.hasSub = false;
							}
						} else {
							val.hasSub = false;
						}
					});

					if($scope.screenData.dispNo == 5492531 || $scope.screenData.dispNo == 5453087) { //1300K || 1200M
						angular.forEach(contents.top_banner_list.items, function(item, key){
							$scope.screenData.top_banner_list.push(item.img);
						});

						$scope.screenData.prod_list.push(contents.whats_new_prod_list.items[0].goods_list);
						$scope.screenData.prod_list.push(contents.mds_pick_prod_list.items[0].goods_list);
						$scope.screenData.prod_list.push(contents.best_of_best_prod_list.items[0].goods_list);

					} else if($scope.screenData.dispNo == 5293948) { //텐바이텐
						$scope.screenData.top_banner_list = contents.top_banner_list.items;

						$scope.screenData.prod_list.push(contents.focus_on_prod_list.items);
						$scope.screenData.prod_list.push(contents.new_arrival_prod_list.items);
						$scope.screenData.prod_list.push(contents.best_seller_prod_list.items);
					}else{ //20160901 1300K 템플릿으로 쓰는 공통 리스트 
						angular.forEach(contents.top_banner_list.items, function(item, key){
							$scope.screenData.top_banner_list.push(item.img);
						});
						$scope.screenData.prod_list.push(contents.whats_new_prod_list.items[0].goods_list);
						$scope.screenData.prod_list.push(contents.mds_pick_prod_list.items[0].goods_list);
						$scope.screenData.prod_list.push(contents.best_of_best_prod_list.items[0].goods_list);                        
                    }

					$scope.productListLoading = false;
					$scope.pageLoading = false;
				}
			}).error(function(data){
				console.log('Error Data : 데이터 로딩 에러');
				$scope.productListLoading = false;
				$scope.pageLoading = false;
			});
		};

		/*
		 * TODO: 화면 나갈때 세션에 데이터 저장 및 세선 체크후 데이터 세팅 부분 공통화 개발 필요
		 */
		$scope.loadScreenData();
	}]);

	app.directive('lotteContainer', ['LotteCommon', function(LotteCommon) {
		return {
			templateUrl : '/lotte/resources_dev/mall/special_mall_main_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				/*
				 * 메뉴 카테고리 클릭
				 */
				$scope.cate1Index = 0;
                $scope.menuCategoryClick = function(item) {
					$scope.menuCategory1Click(item);
                    $scope.cate1Index = this.$index + 1;
					$scope.screenData.showAllCategory = false;
				}                
				$scope.menuCategory1Click = function(item) {
                    $scope.cate1Index = this.$index + 1;
					if(!item.hasSub) {
						window.location.href = LotteCommon.mallSubUrl+"?"+$scope.baseParam+"&cateNo="+item.disp_no+"&cateDepth="+item.cate_depth+"&title="+$scope.subTitle;
					} else {                        
						if($scope.screenData.selectCate1 == item.disp_no) {
							$scope.screenData.selectCate1 = 0;
						} else {
							$scope.screenData.selectCate1 = item.disp_no;
							$scope.moveMenuSwipe(this.$index);
						}
						$scope.screenData.showAllCategory = false;
					}
				}
                function addZero(num){
                    if(num < 10){
                        num = "0" + num;
                    }
                    return num;
                }
				$scope.menuCategory2Click = function(item, index) {
					if(!item.hasSub) {
                        var tclick = "&tclick=m_" + $scope.screenData.dispNo + "_CATEGORY_" + $scope.cate1Index + "_" + addZero(index);
						window.location.href = LotteCommon.mallSubUrl+"?"+$scope.baseParam+"&cateNo="+item.disp_no+"&cateDepth="+item.cate_depth+"&title="+$scope.subTitle + tclick;
					} else {
						if($scope.screenData.selectCate2 == item.disp_no) {
							$scope.screenData.selectCate2 = 0;
						} else {
							$scope.screenData.selectCate2 = item.disp_no;
						}
						$scope.screenData.showAllCategory = false;
					}
				}
				$scope.menuCategory3Click = function(item) {
					if(!item.hasSub) {
						window.location.href = LotteCommon.mallSubUrl+"?"+$scope.baseParam+"&cateNo="+item.disp_no+"&cateDepth="+item.cate_depth+"&title="+$scope.subTitle;
					} else {
						if($scope.screenData.selectCate3 == item.disp_no) {
							$scope.screenData.selectCate3 = 0;
						} else {
							$scope.screenData.selectCate3 = item.disp_no;
						}
						$scope.screenData.showAllCategory = false;
					}
				}
				/*
				 * 모든 매뉴 보기 클릭
				 */
				$scope.showAllCategoryClick = function() {
					if($scope.screenData.showAllCategory) {
						$scope.screenData.selectCate1 = 0;
						$scope.screenData.showAllCategory = false;
					} else {
						$scope.screenData.selectCate1 = 0;
						$scope.screenData.showAllCategory = true;
					}
				}
				/*
				 * 플렌샵 배너 클릭
				 */
				$scope.planshopBannerClick = function(item, index) {
                     var tclick = "&tclick=m_" + $scope.screenData.dispNo + "_MTHEME_BANNER_idx" + addZero(index);
					window.location.href = $scope.baseLink(item.link_url) + tclick;
				}

				$scope.mallProductClick = function(item, key, index) {
                     var tclickCateStr = ["_MNEW_BANNER_idx", "_MPICK_BANNER_idx", "_MBEST_BANNER_idx"];
                     var tclick = "&tclick=m_" + $scope.screenData.dispNo +  tclickCateStr[key] + addZero(index);
					window.location.href = LotteCommon.prdviewUrl+"?"+$scope.baseParam+"&goods_no="+item.goods_no  + tclick;
				}
				
				// 20160718 대카 레이어 닫기
                $scope.hideCate = function() {
					$scope.screenData.showAllCategory = false
                };
                
                // 20160718 중카레이어 닫기
				$scope.hideSubCate = function() {
					$scope.screenData.selectCate1 = false;
                };
			}
		};
	}]);

})(window, window.angular);