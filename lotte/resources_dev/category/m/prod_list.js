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

	/**
	 * @ngdoc overview
	 * @name app.controller:ProdListCtrl
	 * @description
	 * 전문관 전문몰 서브 페이지
	 * prod_list.js
	 */
	app.controller('ProdListCtrl', ['$http','$scope', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteStorage', '$timeout', function($http, $scope, $window, $location, LotteCommon, commInitData, LotteStorage, $timeout) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "gucci_main"; //서브헤더 타이틀
		$scope.curDispNo = "";
		$scope.productListLoading = true;
		$scope.productMoreScroll = true;
		/*
		 * 스크린 데이터 초기화
		 */
		($scope.screenDataReset = function() {
			$scope.screenData = {
				isWine:false,
				wineParam: '',
				page: 0,
				disp_name: "",
				dispNo: '',
				curDispNo: '',
				cateNodeName: [],
				showAllCategory: false,
				selectCate1: 0,
				selectCate2: 0,
				selectCate3: 0,
				selectedCategory: 0,
				cate_list: [],
				dispGoodsList: [],
				sortIdx: 10,
				moneySelect: '',
				moneyStart : '',
				moneyEnd : '',
				lastGoodsNo : 0,
			}
		})();

		if (commInitData.query['isWine']){
			$scope.screenData.isWine = (commInitData.query['isWine'] == 'Y')?true:false;
			if($scope.screenData.isWine) {
				$scope.screenData.wineParam = "&isWine=Y";
				$scope.subTitle = "와인&스토리 Vine";
			}
		}
		// yubu	샤넬검색 리다이렉팅 url인 경우 임시조치
		if (commInitData.query['isComm']){
			$scope.screenData.isComm = (commInitData.query['isComm'] == 'Y')?true:false;
			if($scope.screenData.isComm) {
				// $scope.screenData.wineParam = "&isWine=Y";
				$scope.subTitle = (commInitData.query['title']!=undefined)?decodeURIComponent(commInitData.query['title']):"";
			}
		}

		if (commInitData.query['curDispNo']){
			$scope.screenData.curDispNo = commInitData.query['curDispNo'];
		}

		/**
		 * @ngdoc function
		 * @name ProdListCtrl.function:getCateNodeName
		 * @description
		 * 카테고리 노트명 추출
		 * @example
		 * $scope.getCateNodeName(idxs,depth);
		 * @param {Array} idxs 인덱스 어레이
		 * @param {int} depth 깊이
		 */
		$scope.getCateNodeName = function(idxs,depth) {
			var idx = [];
			if(idxs != '') {
				idx = idxs.split(",");
			}
			switch(depth) {
			case 1:
				for(var i=0;i < $scope.screenData.cate_list.length;i++) {
					if($scope.screenData.cate_list[i].sub_cate_list != null) {
						$scope.getCateNodeName(i+'',depth+1);
					}
				}
				break;
			case 2:
				for(var i=0;i < $scope.screenData.cate_list[idx[0]].sub_cate_list.length;i++) {
					if($scope.screenData.cate_list[idx].sub_cate_list[i].sub_cate_list != null) {
						$scope.getCateNodeName(idxs+','+i,depth+1);
					} else {
						if($scope.screenData.cate_list[idx[0]].sub_cate_list[i].disp_no == $scope.screenData.curDispNo) {
							//console.log($scope.screenData.cate_list[idx[0]].sub_cate_list[i]);
							$scope.screenData.cateNodeName[0] = $scope.screenData.cate_list[idx[0]].disp_nm;
							$scope.screenData.cateNodeName[1] = $scope.screenData.cate_list[idx[0]].sub_cate_list[i].disp_nm;
							$scope.screenData.cateNodeName[2] = '';
							return;
						}
					}
				}
				break;
			case 3:
				for(var i=0;i < $scope.screenData.cate_list[idx[0]].sub_cate_list[idx[1]].sub_cate_list.length;i++) {
					if($scope.screenData.cate_list[idx[0]].sub_cate_list[idx[1]].sub_cate_list[i].disp_no == $scope.screenData.curDispNo) {
						//console.log($scope.screenData.cate_list[idx[0]].sub_cate_list[idx[1]].sub_cate_list[i]);
						$scope.screenData.cateNodeName[0] = $scope.screenData.cate_list[idx[0]].disp_nm;
						$scope.screenData.cateNodeName[1] = $scope.screenData.cate_list[idx[0]].sub_cate_list[idx[1]].disp_nm;
						$scope.screenData.cateNodeName[2] = $scope.screenData.cate_list[idx[0]].sub_cate_list[idx[1]].sub_cate_list[i].disp_nm;
						return;
					}
				}
				break;
			}
		}

		/*
		 * 스크린 데이터 로드
		 */
		/**
		 * @ngdoc function
		 * @name ProdListCtrl.function:loadScreenData
		 * @description
		 * 화면 데이터 로드
		 * @example
		 * $scope.loadScreenData();
		 */
		$scope.loadScreenData = function() {
			console.log("스크린 데이터 로드...");
			$scope.screenData.page++;
			$scope.productListLoading = true;
			// 구찌
			//$http.get(LotteCommon.gucciSubData+'?'+$scope.baseParam+'&dispNo='+$scope.screenData.dispNo)
			var url = LotteCommon.specialBoothSubData+'?curDispNo='+$scope.screenData.curDispNo+'&upCurDispNo='+$scope.screenData.curDispNo+'&sort='+$scope.screenData.sortIdx+'&beforeNo=&detail=&size=&moneyStart='+$scope.screenData.moneyStart+'&moneyEnd='+$scope.screenData.moneyEnd+'&page='+$scope.screenData.page+'&last_goods_no='+$scope.screenData.lastGoodsNo+$scope.screenData.wineParam;
			$http.get(url)
			.success(function(contents) {
				if($scope.screenData.page <= 1) {
					$scope.screenData.cate_list = contents.cateList.items;
					$scope.getCateNodeName('',1);
					$scope.screenData.dispGoodsList = contents.prdList;
					if($scope.screenData.dispGoodsList.length) {
						$scope.screenData.lastGoodsNo = $scope.screenData.dispGoodsList[$scope.screenData.dispGoodsList.length-1].goods_no;
					}
				} else {
					if(contents.prdList) {
						$scope.screenData.dispGoodsList = $scope.screenData.dispGoodsList.concat(contents.prdList);
					} else {
						$scope.productMoreScroll = false;
					}
				}
				if( contents.prdList != undefined && contents.prdList.length > 5 ) {
					$scope.productListLoading = false;
				}
			});
		}

		// 세션에서 가저올 부분 선언
		var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
		var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
		var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');

		if(StoredLoc == window.location.href && $scope.locationHistoryBack) {
			var StoredData = JSON.parse(StoredDataStr);
			$scope.pageLoading = false;

			$scope.pageOptions = StoredData.pageOptions;
			$scope.screenData = StoredData.screenData;
			$timeout(function() {
				angular.element($window).scrollTop(StoredScrollY);
			},800);
		} else {
			$scope.loadScreenData();
		}

		/**
		 * unload시 관련 데이터를 sessionStorage에 저장
		 */
		angular.element($window).on("unload", function(e) {
			var sess = {};
			//sess.templateType = $scope.templateType;
			sess.pageOptions = $scope.pageOptions;
			sess.screenData = $scope.screenData;
			if (!commInitData.query.localtest && $scope.leavePageStroage) {
				LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
				LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
				LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
			}
		});


		/*
		 * 소트 클릭
		 */
		$scope.sortClick = function() {
			$scope.screenData.page = 0;
			$scope.screenData.lastGoodsNo = 0;
			$scope.loadScreenData();
		}

		/*
		 * 금액 클릭
		 */
		$scope.moneyClick = function(item) {
			if(item) {
				var moneySplit = item.split("_");
				$scope.screenData.moneyStart = moneySplit[0];
				$scope.screenData.moneyEnd = moneySplit[1];
			} else {
				$scope.screenData.moneyStart = "";
				$scope.screenData.moneyEnd = "";
			}
			$scope.screenData.page = 0;
			$scope.screenData.lastGoodsNo = 0;
			$scope.loadScreenData();
		}
	}]);

	app.directive('lotteContainer',['$window','LotteCommon', function($window, LotteCommon) {
		return {
			templateUrl : '/lotte/resources_dev/category/m/prod_list_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				/*
				 * 메뉴 카테고리 클릭
				 */
				$scope.menuCategoryClick = function(item) {
					$scope.menuCategory1Click(item);
					$scope.screenData.showAllCategory = false;
				}

				$scope.menuCategory1Click = function(item) {
					if(item.link_url != "") {
						window.location.href = LotteCommon.specialMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+$scope.screenData.wineParam;
					} else {
						if($scope.screenData.selectCate1 == item.disp_no) {
							$scope.screenData.selectCate1 = 0;
						} else {
							$scope.screenData.selectCate1 = item.disp_no;
						}
						$scope.screenData.showAllCategory = false;
					}
				}
				$scope.menuCategory2Click = function(item, item2) {
					if(!item2){
						item2 = ""; //temp
					}
					if(item.link_url != "") {
						window.location.href = LotteCommon.specialMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+$scope.screenData.wineParam;
					} else {
						if($scope.screenData.selectCate2 == item.disp_no) {
							$scope.screenData.selectCate2 = 0;
						} else {
							$scope.screenData.selectCate2 = item.disp_no;
						}
						$scope.screenData.showAllCategory = false;
					}
				}
				$scope.menuCategory3Click = function(item, item2) {
					if(item.link_url != "") {
						window.location.href = LotteCommon.specialMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+$scope.screenData.wineParam;
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
				 * 구찌 카테고리 클릭
				 */
				$scope.GucciMenuCategoryClick = function(item) {
					$scope.GucciMenuCategory1Click(item);
					$scope.screenData.showAllCategory = false;
				}

				$scope.GucciMenuCategory1Click = function(item) {
					if(item.link_url != "") {
						window.location.href = item.link_url;
					} else {
						if($scope.screenData.selectCate1 == item.disp_no) {
							$scope.screenData.selectCate1 = 0;
						} else {
							$scope.screenData.selectCate1 = item.disp_no;
						}
						$scope.screenData.showAllCategory = false;
					}
				}
				$scope.GucciMenuCategory2Click = function(item, item2) {
					if(!item2){
						item2 = ""; //temp
					}
					if(item.link_url != "") {
						window.location.href = item.link_url;
					} else {
						if($scope.screenData.selectCate2 == item.disp_no) {
							$scope.screenData.selectCate2 = 0;
						} else {
							$scope.screenData.selectCate2 = item.disp_no;
						}
						$scope.screenData.showAllCategory = false;
					}
				}
				$scope.GucciMenuCategory3Click = function(item, item2) {
					if(item.link_url != "") {
						window.location.href = item.link_url;
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
						$scope.screenData.showAllCategory = false;
					} else {
						$scope.screenData.showAllCategory = true;
					}
				}
				/*
				 * 플렌샵 배너 클릭
				 */
				$scope.planshopBannerClick = function(item) {
					window.location.href = item.link_url;
				}
				/*
				 * 배너 클릭
				 */
				$scope.gucciBannerClick = function(item) {
					window.location.href = item.img.link_url+"&"+$scope.baseParam;
				}

				/*
				 * 상품 클릭
				 */
				$scope.productClick = function(item) {
					if($scope.screenData.isWine) {
						var tClickCode = $scope.tClickBase+"SpeDisp2_Clk_Prd_B"+this.$index;
						window.location.href = LotteCommon.prdviewUrl + "?" + $scope.$parent.baseParam + "&goods_no=" + item.goods_no+"&tclick="+tClickCode;
					} else{
						var tClickCode = $scope.tClickBase+"SpeDisp1_Clk_Prd_B"+this.$index;
						window.location.href = "/product/m/product_view_gucci.do?" + $scope.$parent.baseParam + "&goods_no=" + item.goods_no+"&tclick="+tClickCode;//20171019
					}
				}

				var $win = angular.element($window),
				$body = angular.element("body"),
				winH = $win.height(),
				bodyH = $body[0].scrollHeight,
				scrollRatio = 4.0, // 윈도우 높이의 4배
				moreLoadTime = 0;

				$win.on("scroll" , function (e) {
					if (!$scope.productMoreScroll || $scope.productListLoading || $scope.pageLoading) {
						return ;
					}

					bodyH = $body[0].scrollHeight;

					if ($win.width() >= 640) { // 그리드가 2단 이상일 경우 로드 비율을 낮춘다
						scrollRatio = 2; // 윈도우 높이의 2배
					} else {
						scrollRatio = 4.0; // 윈도우 높이의 4배
					}

					if( bodyH - (winH * scrollRatio) > winH && $win.scrollTop() + winH >= bodyH - (winH * scrollRatio)) {
						$scope.loadScreenData();
					}
				});

				// 20160718 중카레이어 닫기
				$scope.hideSubCate = function() {
					$scope.screenData.selectCate1 = false;
                };
			}
		};
	}]);

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

					if ($win.scrollTop() >= 43) {
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
