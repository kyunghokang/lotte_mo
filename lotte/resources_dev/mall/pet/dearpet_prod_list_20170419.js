(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteNgSwipe',
        'lotteMainPop',
        'lotteProduct'
    ]);
  	 
   	app.controller('DearpetProdListCtrl', ['$http','$scope', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteStorage', '$timeout', function($http, $scope, $window, $location, LotteCommon, commInitData, LotteStorage, $timeout) {
	    $scope.isMain = false;
	   	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "엘디어펫 서브"; // 서브헤더 타이틀
        $scope.screenID = "엘디어펫 서브"; // 스크린 아이디 
        $scope.pageLoading = false;
		$scope.dispNo = "";
		$scope.productListLoading = true;
		$scope.productMoreScroll = true;
		$scope.banners = "banners";
		
		/*
		 * 스크린 데이터 초기화
		 */
		($scope.screenDataReset = function() {
			$scope.screenData = {
				page: 0,
				disp_name: "",
				dispNo: '',
				curDispNo: '',
				curCtgIdx : -1,
				curCtgName : "",
				curCtgNo : "",
				curSCtgIdx : -1,
				curSCtgName : "",
				curSCtgNo : "",
				curSSCtgIdx : -1,
				curSSCtgName : "",
				curSSCtgNo : "",
				ssCtgList : [],
				cateNodeName: [],
				selectCate1: commInitData.query['beforeNo'],
				selectCate2: 0,
				selectCate3: 0,
				selectedCategory: 0,
				cate_list: [],
				dispGoodsList: [],
				lastGoodsNo : 0,
				title : ''
			}
		})();
		
		if (commInitData.query['curDispNo']){
			$scope.screenData.curDispNo = commInitData.query['curDispNo'];			 
		}
		if (commInitData.query['title']){
			$scope.screenData.title = commInitData.query['title'];
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
		$scope.loadScreenData = function() {
			console.log("스크린 데이터 로드...");
			$scope.screenData.page++;
			$scope.productListLoading = true;
			var url = LotteCommon.petMallProdListData+'?dispNo='+$scope.screenData.curDispNo+'&page='+$scope.screenData.page+'&last_goods_no='+$scope.screenData.lastGoodsNo;
			$http.get(url)
			.success(function(data) {
				var contents = [];
				contents = data['result'];
				$scope.ctgData = contents;
				$scope.findCurDispNoDepth($scope.screenData.curDispNo); /*서브 카테고리 번호로 카테고리 찾기*/
				
				for(var k=0; k<contents.cate_list.items.length;k++){
					contents.cate_list.items[k].subopen = false;
				}
				$scope.screenData.cate_list = contents.cate_list.items;
				if(contents.prd_list != null){
					if($scope.screenData.page <= 1) {						
						$scope.getCateNodeName('',1);
						$scope.screenData.dispGoodsList = contents.prd_list.items;
						if($scope.screenData.dispGoodsList.length) {
							$scope.screenData.lastGoodsNo = $scope.screenData.dispGoodsList[$scope.screenData.dispGoodsList.length-1].goods_no;						
						}
					} else {
						if(contents.prd_list.items) {
							$scope.screenData.dispGoodsList = $scope.screenData.dispGoodsList.concat(contents.prd_list.items);
						} else {
							$scope.productMoreScroll = false;
						}
					}
					if( contents.prd_list.items.length > 10 ) {
						$scope.productListLoading = false;
					}
				}
				
				/* 카테고리 리스트 스와이프 갯수 분기처리 */
				var dataTotal = $scope.screenData.ssCtgList != null ? $scope.screenData.ssCtgList.length : 0;
				var ssCtgListSliceData = [];
				
				if($(window).width() >= 640){
					if ($scope.screenData.ssCtgList && dataTotal > 0) {
						var i = 0,
							j = -1;

						for (i; i < dataTotal; i++) {
							if (i % 8 == 0) {
								j++;
								ssCtgListSliceData[j] = [];
							}
							ssCtgListSliceData[j].push($scope.screenData.ssCtgList[i]);
						}
						$scope.screenData.ssCtgList = ssCtgListSliceData;
					}else{
						$scope.screenData.ssCtgList = null;
					}
				} 
				
				if($(window).width() < 640){
					if ($scope.screenData.ssCtgList && dataTotal > 0) {
						var i = 0,
							j = -1;
						
						for (i; i < dataTotal; i++) {
							if (i % 4 == 0) {
								j++;
								ssCtgListSliceData[j] = [];
							}
							ssCtgListSliceData[j].push($scope.screenData.ssCtgList[i]);
						}
						$scope.screenData.ssCtgList = ssCtgListSliceData;
					}else{
						$scope.screenData.ssCtgList = null;
					}
				}
			});
		}
		
		/*인입 curDispNo로 해당 카테고리 Depth 및 index 찾기*/
		$scope.findCurDispNoDepth = function () {
			var ctgIdx = 0,
				sCtgIdx = 0,
				ssCtgIdx = 0;
			for (ctgIdx= 0; ctgIdx < $scope.ctgData.cate_list.items.length; ctgIdx++) {
				if ($scope.ctgData.cate_list.items[ctgIdx].sub_cate_list && $scope.ctgData.cate_list.items[ctgIdx].sub_cate_list.length > 0) {
					for (sCtgIdx = 0; sCtgIdx < $scope.ctgData.cate_list.items[ctgIdx].sub_cate_list.length; sCtgIdx++) {
						if ($scope.ctgData.cate_list.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list && $scope.ctgData.cate_list.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list.length > 0) {
							for (ssCtgIdx = 0; ssCtgIdx < $scope.ctgData.cate_list.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list.length; ssCtgIdx++) {
								if ($scope.ctgData.cate_list.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list[ssCtgIdx].disp_no == $scope.screenData.curDispNo) {
									$scope.selectCurDispCtg(ctgIdx, sCtgIdx, ssCtgIdx); /*세카에서 맵핑될경우*/
	
									//if (ssCtgIdx == 0) {
									//	$scope.screenData.sCtgBnrShowFlag = true;
									//} else {
									//	$scope.screenData.sCtgBnrShowFlag = false;
									//}
									return false;
								}
							}
						}
						/*세카가 없을 경우에만 소카에서 맵핑 확인*/
						else if (!$scope.ctgData.cate_list.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list && $scope.ctgData.cate_list.items[ctgIdx].sub_cate_list[sCtgIdx].disp_no == $scope.screenData.curDispNo) {
							$scope.selectCurDispCtg(ctgIdx, sCtgIdx); /*소카에서 맵핑될경우*/
							//$scope.screenData.sCtgBnrShowFlag = true;
							return false;
						}
					}
				}
			}
		};
		
		/*카테고리 선택 활성화, Label 세팅*/
		$scope.selectCurDispCtg = function (curCtgIdx, curSCtgIdx, curSSCtgIdx) {
			$scope.screenData.curCtgName = "";
			$scope.screenData.curSCtgName = "";
			$scope.screenData.curSSCtgName = "";

			$scope.screenData.curCtgIdx = curCtgIdx;
			$scope.screenData.curCtgName = $scope.ctgData.cate_list.items[curCtgIdx].disp_nm;
			$scope.screenData.curCtgNo = $scope.ctgData.cate_list.items[curCtgIdx].disp_no;

			$scope.screenData.curSCtgIdx = curSCtgIdx;
			$scope.screenData.curSCtgName = $scope.ctgData.cate_list.items[curCtgIdx].sub_cate_list[curSCtgIdx].disp_nm;
			$scope.screenData.curSCtgNo = $scope.ctgData.cate_list.items[curCtgIdx].sub_cate_list[curSCtgIdx].disp_no;

			if (curSSCtgIdx != null) {
				$scope.screenData.curSSCtgIdx = curSSCtgIdx;
				$scope.screenData.curSSCtgdisp_nm = $scope.ctgData.cate_list.items[curCtgIdx].sub_cate_list[curSCtgIdx].sub_cate_list[curSSCtgIdx].name;
				$scope.screenData.curSSCtgNo = $scope.ctgData.cate_list.items[curCtgIdx].sub_cate_list[curSCtgIdx].sub_cate_list[curSSCtgIdx].disp_no;

				$scope.screenData.ssCtgList = $scope.ctgData.cate_list.items[curCtgIdx].sub_cate_list[curSCtgIdx].sub_cate_list;
			} else {
				$scope.screenData.curSSCtgIdx = -1;
				$scope.screenData.ssCtgList  = [];
			}
			/*카테고리 선택 활성화 후 처리*/
			/*해당 카테고리가 속한 소카 번호로 카테고리 데이터 요청*/
			if ($scope.screenData.curSCtgNo && $scope.screenData.curSCtgNo != "") {
				//$scope.loadSubData($scope.screenData.curDispNo); // 서브 페이지 데이터 조회
			}
		};
		
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
	
	app.directive('lotteContainer',['$window','LotteCommon', 'LotteUtil', function($window, LotteCommon, LotteUtil) {
		return {
			templateUrl : '/lotte/resources_dev/mall/pet/dearpet_prod_list_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				$scope.mallMainClick = function(tclick) {
                	var url = LotteCommon.petMallMainUrl + "?" + $scope.baseParam;
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }
				$scope.productClick = function(item) {
					var tClickCode = $scope.tClickBase+"m_DC_specialshop_Dearpet_cateTpl_Clk_Prd_idx"+this.$index;
					window.location.href = LotteCommon.prdviewUrl + "?" + $scope.$parent.baseParam + "&goods_no=" + item.goods_no+"&curDispNoSctCd=95"+"&tclick="+tClickCode;
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
                
                
                /**
                	@ 20170417 likearts
                	## 위시리스트 ( lotte_product 모듈에서 가져옴 )
                */
                var isSwipe = attrs.isSwipe ? true:false;
                $scope.rScope = LotteUtil.getAbsScope($scope);
                
                $scope.addWishClick = function(idx, item) {
					if (item.outlnkMall == "LECS") { /*LECS 상품*/
						if (confirm("공식온라인 몰로 이동후 담을 수 있습니다.")) LotteLink.goOutLink(item.outlnk, item.outlnkMall);
						return false;
					} else if (item.outlnkMall == "SP") { /*롯데슈퍼 상품*/
						if (confirm("롯데슈퍼로 이동후 담을 수 있습니다.")) LotteLink.goOutLink(item.outlnk, item.outlnkMall);
						return false;
					}
					
					 if (item.has_wish) {
						$scope.rScope.openSystemAlert({msg:"이미 등록된 상품입니다."});
						return false;
					}
					 
					if (!$scope.rScope.loginInfo.isLogin) { /*로그인 안한 경우*/
						alert('로그인 후 이용하실 수 있습니다.');
						$scope.rScope.loginProc(); /*go Login*/
						return false;
					} else {
						if (item.limit_age_yn == 'Y') {
							if ($scope.rScope.loginInfo.isAdult == "") { /*19금 상품이고 본인인증 안한 경우*/
								alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
								$scope.rScope.goAdultSci();
								return false;
							} else if (!$scope.rScope.loginInfo.isAdult) {
								alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
								return false;
							}
						}
					};
					
					$scope.rScope.sendProductWish(item.goods_no, function (res) {
						if (res) { 
							$scope.screenData.dispGoodsList[idx].has_wish = true;
						} else {
							$scope.screenData.dispGoodsList[idx].has_wish = false;
						}
						
						// 위시등록 완료 팝업
						if( !$scope.screenData.dispGoodsList[idx].has_wish ) return;
						
					});
					
					var tClickCode = "";
					if (attrs.tclickWish) tClickCode = attrs.tclickWish + (idx + 1);
					else {
						tClickCode = $scope.rScope.tClickBase + $scope.rScope.screenID;
						if (isSwipe) { tClickCode += "_Swp_Wsh";
						} else { tClickCode += "_Clk_Wsh"; }
					}
					
					$scope.rScope.sendTclick(tClickCode); // AJAX 링크 tclick 수집
				};

				//상품리스트 리스트형, 작은 박스형 유닛일때 확대보기 스와이프
				$scope.zoomImageSwipeClick = function(item) {
					$scope.rScope.zoomImageSwipeClick(item);
				}
				
				/**
				 end 20170417 addWishClick
				*/
			}
		};
	}]);
	
	// Directive :: 카테고리
	app.directive('petMallCtg',['$window','LotteCommon','commInitData', function($window, LotteCommon, commInitData) {
		return {
			templateUrl: '/lotte/resources_dev/mall/pet/pet_mall_ctg_container.html',
			link: function ($scope, el, attrs) {
				
				/*
				 * 메뉴 카테고리 클릭
				 */
            	$scope.menuCategoryClick = function(item) {
					$scope.menuCategory1Click(item);
				}        	
            		
            	$scope.menuCategory1Click = function(item,index) {
            		if(!item.sub_cate_list) item.sub_cate_list = [];
            		if( !item.sub_cate_list.length ){
                        var url = LotteCommon.petMalleventUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDepth="+item.cate_depth;
                        url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no + '&beforeNo=' + item.disp_no;
                        $window.location.href = url;
                        return;
                    }
            		if($scope.screenData.selectCate1 == item.disp_no){
            			item.subopen = !item.subopen;
            			
            		}else{
            			item.subopen = true;
            		}
            		//angular.element('.sca_list .recommond_swipe').addClass("on");
            		//if($scope.screenData.selectCate1 == item.disp_no) {
						//$scope.screenData.selectCate1 = 0;
					//} else {
						$scope.screenData.selectCate1 = item.disp_no;
					//}   
                    $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_" + item.disp_no);
				}
				$scope.menuCategory2Click = function(item, item2) {
 
					$scope.menuCategory2Index = 0;
					if(!item2){
						item2 = ""; //temp
					}
					
					switch(item.dearpet_depth_cd.toString()) {
						case "20":
							var url = LotteCommon.petMallgalleryUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth;
							url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
							$window.location.href = url;
						break;
                        
						// 신규 이벤트 20170406 추가
						case "21":
							var url = LotteCommon.petMalleventUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth;
							url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
							$window.location.href = url;
						break;

						default:						
							var url = LotteCommon.petMallProdListUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm;
							url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
							$window.location.href = url;
					}		
				}
				
				$scope.menuCategory3Click = function(item) {
					$scope.screenData.curDispNo = item.disp_no;
					$scope.screenData.selectCate1 = commInitData.query['beforeNo'];
					$scope.screenData.page = 0;
					$scope.screenData.last_goods_no = 0;
					//console.log($scope.screenData.curDispNo);
					$scope.loadScreenData();
					/*
					var url = LotteCommon.petMallProdListUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+$scope.screenData.selectCate1+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm;
					url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
					$window.location.href = url;
					*/					
				}
			}
		};
	}]);
	
	/* header each */
    app.directive('subHeaderEach', [ '$window', function($window) {
        return {
            replace : true,
            link : function($scope, el, attrs) {
                /*이전 페이지 링크*/
                var elHeight = el[0].offsetHeight;
                var $body = angular.element('body'); 
                $scope.gotoPrepage = function() {
                    $scope.sendTclick("m_header_new_pre");
                    history.go(-1);
                };
                angular.element($window).on('scroll', function(evt) {
                    if (this.pageYOffset > $scope.headerHeight){
                        angular.element('body').css("paddingTop",elHeight+"px");
                        el[0].style.cssText = 'z-index:800;position:fixed;top:0px;width:100%;';
                    }else{
                        angular.element('body').css("paddingTop","0px");
                        el[0].style.cssText = '';
                    }
                });
            }
        }
    }]);
})(window, window.angular);
