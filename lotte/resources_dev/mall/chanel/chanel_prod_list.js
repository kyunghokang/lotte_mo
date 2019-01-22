(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

   app.controller('ChanelProdListCtrl', ['$http','$scope', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteStorage', '$timeout', function($http, $scope, $window, $location, LotteCommon, commInitData, LotteStorage, $timeout) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "chanel_prod_list"; //서브헤더 타이틀
		$scope.pageLoading = false;
		$scope.dispNo = "";
		$scope.productListLoading = true;
		$scope.productMoreScroll = true;
		$scope.screenID = "ChanelProdList";
		/*
		 * 스크린 데이터 초기화
		 */
		($scope.screenDataReset = function() {
			$scope.screenData = {
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
				lastGoodsNo : 0,
				sortQuery : ''
			}
		})();

		if (commInitData.query['curDispNo']){
			$scope.screenData.curDispNo = commInitData.query['curDispNo'];
		}
		
		$scope.screenData.sortQuery = commInitData.query['sortQuery'] || '';

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
			var url = LotteCommon.chanelMallSubData+'?dispNo='+$scope.screenData.curDispNo+'&page='+$scope.screenData.page+'&last_goods_no='+$scope.screenData.lastGoodsNo + ($scope.screenData.sortQuery != '' ? '&sort=' + $scope.screenData.sortQuery : '');
			$http.get(url)
			.success(function(contents) {
				if($scope.screenData.page <= 1) {
					$scope.screenData.cate_list = contents.cate_list.items;
					$scope.getCateNodeName('',1);
					$scope.screenData.dispGoodsList = contents.prd_list;
					if($scope.screenData.dispGoodsList.length) {
						$scope.screenData.lastGoodsNo = $scope.screenData.dispGoodsList[$scope.screenData.dispGoodsList.length-1].goods_no;						
					}
				} else {
					if(contents.prd_list) {
						$scope.screenData.dispGoodsList = $scope.screenData.dispGoodsList.concat(contents.prd_list);
					} else {
						$scope.productMoreScroll = false;
					}
				}
				if( contents.prd_list.length > 5 ) {
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
	}]);

	app.directive('lotteContainer',['$window','LotteCommon', function($window, LotteCommon) {
		return {
			templateUrl : '/lotte/resources_dev/mall/chanel/chanel_prod_list_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				/*
				 * 메뉴 카테고리 클릭
				 */
				$scope.menuCategoryClick = function(item) {
					$scope.menuCategory1Click(item);
				}

				$scope.menuCategory1Click = function(item,index) {
            		$scope.menuCategory1Index = 0;
            		if(item.link_url != "") {
						//window.location.href = item.link_url; 
						window.location.href = LotteCommon.chanelMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+(item.sort ? "&sortQuery="+item.sort : '');
					} else {
						if($scope.screenData.selectCate1 == item.disp_no) {
							$scope.screenData.selectCate1 = 0;
							angular.element('.navi_area').removeClass("on"); //레이어 닫기
							angular.element('nav').removeClass("on"); //레이어 닫기
						} else {
							$scope.screenData.selectCate1 = item.disp_no;
							angular.element('.navi_area').addClass("on"); //레이어 열기
							angular.element('nav').addClass("on"); //레이어 닫기
						}
					}
            		$scope.menuCategory1Index = index; //순서
                    $scope.sendTclick("m_DC_specialshop_Chanel_category_" + item.disp_no);
				}
				$scope.menuCategory2Click = function(item, item2, index) {
					$scope.menuCategory2Index = 0;
					if(!item2){
						item2 = ""; //temp
					}
					if(item.link_url != "") {
						var url = LotteCommon.chanelMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+(item.sort ? "&sortQuery="+item.sort : '');
						url += "&tclick=" + 'm_DC_specialshop_Chanel_category_'+ item.disp_no;
						$window.location.href = url;
					} else {
						if($scope.screenData.selectCate2 == item.disp_no) {
							$scope.screenData.selectCate2 = 0;							
						} else {
							$scope.screenData.selectCate2 = item.disp_no;
							$scope.menuCategory2Index = index; //순서
							$scope.sendTclick("m_DC_specialshop_Chanel_category_" + item.disp_no);
						}
					}					
				}
				$scope.menuCategory3Click = function(item, item2, index) {
					if(item.link_url != "") {
						var url = LotteCommon.chanelMallSubUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm+(item.sort ? "&sortQuery="+item.sort : '');
						url += "&tclick=" + 'm_DC_specialshop_Chanel_category_' + item.disp_no;
						$window.location.href = url;
					} else {
						if($scope.screenData.selectCate3 == item.disp_no) {
							$scope.screenData.selectCate3 = 0;
						} else {
							$scope.screenData.selectCate3 = item.disp_no;
						}
					}					
				}	

				/*
				 * 상품 클릭
				 */
				$scope.productClick = function(item) {
					var tClickCode = $scope.tClickBase+"m_DC_specialshop_Chanel_cateTpl_Clk_Prd_idx0"+(this.$index+1);
					window.location.href = LotteCommon.prdviewUrl + "?" + $scope.$parent.baseParam + "&goods_no=" + item.goods_no+"&tclick="+tClickCode;
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
				
				$scope.hideCate = function() {
					$scope.screenData.selectCate1 = false;
					angular.element('.navi_area').removeClass("on"); //레이어 닫기
					angular.element('nav').removeClass("on"); //레이어 닫기
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

                    if ($win.scrollTop() >= 0) {
                        $el.attr("style", "z-index:100;position:fixed;top:" + headerHeight +"px;width:100%");
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
