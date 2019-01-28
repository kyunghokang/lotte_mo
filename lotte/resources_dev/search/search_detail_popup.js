(function(window, angular, undefined) {
	'use strict';

	var app = angular.module("searchDetailPopup", ["lotteComm"]);
    
	app.controller("SearchDetailPopupCtrl", ["$scope", function($scope){}]);
	
	app.filter('trusted', ['$sce', function ($sce) {
		return function(url) { 
			return $sce.trustAsResourceUrl(url); 
		};
	}]);
	
	app.directive('videoPoster', [function () {
		return {
			restrict: 'A', // attribute
			link : function ($scope, element, attrs) {
				if (attrs.videoPoster) {
					angular.element(element).attr("poster", attrs.videoPoster);
				}
				$scope.vPoster = function(){
					angular.element(element).attr("poster", attrs.videoPoster);
				}
			}
		};
	}]);

	app.directive("searchDetailPopup",
					["LotteCommon", "LotteUtil", "LotteScroll", "LotteStorage" ,"$window", "$timeout", "$http", "$location", "$filter", "commInitData",
			function( LotteCommon,   LotteUtil,   LotteScroll,   LotteStorage,   $window,   $timeout,   $http,   $location,   $filter,   commInitData){
        return {
            templateUrl : "/lotte/resources_dev/search/search_detail_2019_popup.html",
            replace : true,
            link : function($scope, el, attrs) {
            	
            	//$scope.rScope = LotteUtil.getAbsScope($scope);
            	$scope.srhPrdDetailInfo = {data: {}, show: false, item: {}, imageSwipeIdx: 1, showArrow: true};
            	
            	
            	var timer = -1;
            	$scope.stopAutoPlayTimer = function(){
            		clearTimeout(timer);
            	};
            	
				/**
				 * 상세 팝업 열기
				 * @param item {Object} 상품 데이터
				 * @param idx {Number} 인덱스 번호
				 */
            	$scope.getProductDetailInfo = function(item, idx, zIndex){
        			$scope.sendTclick("m_RDC_SrhResult_Clk_ProductPop");
        			$scope.srhPrdDetailInfo.data = {};
        			try{
        				item.vodUrl = item.mpic_info.mpic_url;
    			    }catch(e){}

        			if($scope.isValidString(item.vodUrl)){
        				// video
        				angular.copy(item, $scope.srhPrdDetailInfo.item);
    					$scope.srhPrdDetailInfo.show = true;
    					$scope.srhPrdDetailInfo.idx = idx;
    					
    					$scope.scrollFlag = false;
    					LotteScroll.disableScroll();
    					$scope.dimmedOpen({
    						target: "prdDetailInfo",
    						callback: $scope.productDetailInfoClose,
    						scrollEventFlag: true,
                            zIndex : zIndex
    					});
    					
    					// 높이 설정
    					$timeout(function(){
    						angular.element(".thumb-wrap").height(angular.element(".unit-pop").width());
    					}, 0);
    					
    					// 처음엔 자동재생 안함
    					setTimeout(function(){
    						autoVideoPlay('autoVideo1', '#autoVideo1', false, 2);
    					}, 0);
    					// 4초뒤 자동재생
    					timer = setTimeout(function(){
    						autoVideoPlay('autoVideo1', '#autoVideo1', false, 1);
    					}, 4000);

        			}else{
        				// no video
	        			$http.get(LotteCommon.listGoodsImgData, {params : {goods_no : item.goods_no}})
	        			.success(function (data, status, headers, config) {//호출 성공시
	        				if(data.contents) {
	        					$scope.srhPrdDetailInfo.data = data.contents;
	        					$scope.srhPrdDetailInfo.show = true;
	        					$scope.srhPrdDetailInfo.showArrow = true;
	        					$scope.srhPrdDetailInfo.item = {};
	        					angular.copy(item, $scope.srhPrdDetailInfo.item);
	        					$scope.srhPrdDetailInfo.idx = idx;
	
	        					$scope.scrollFlag = false;
	        					LotteScroll.disableScroll();
	        					$scope.dimmedOpen({
	        						target: "prdDetailInfo",
	        						callback: $scope.productDetailInfoClose,
	        						scrollEventFlag: true,
                                    zIndex : zIndex
	        					});
	
	        					$scope.srhPrdDetailInfo.imageSwipeIdx = 1;
	        					$scope.setAutoHideSwipeArrow();
	        					$timeout(function() {
	        						//console.log(angular.element(".unit-pop").width());
	        						angular.element(".thumb-list").height(angular.element(".unit-pop").width());
	        					});
	        					//LotteScroll.disableScroll();
	        				}
	        			})
	        			.error(function (data, status, headers, config) {//호출 실패시
	        				console.log('Data Error : 상품기본정보 로드 실패');
	        			});
        			}
            	};
        		
        		$scope.setAutoHideSwipeArrow = function() {
        			if($scope.srhPrdDetailInfo.showArrow) {
        				$timeout(function() {
        					var srhPrdDetailInfoArrow = angular.element("#srhPrdDetailInfoArrow");
        					srhPrdDetailInfoArrow.fadeOut(2000);
        				},1000);
        			}
        		}
        		
        		$scope.getImageSwipeControl = function(control) {
        			$scope.imageSwipeControl = control;
        		}
        		
                $scope.setImageSwipeInfo = function(id) {
        			$scope.srhPrdDetailInfo.imageSwipeIdx = id + 1;
        			$scope.sendTclick("m_RDC_SrhResult_PopLayer_Swp_Prd_idx" + $scope.numberFill(id + 1, 3));
                }
                
                $scope.advtBnrLstSwipeIdx = 1;
                $scope.swipeEnd = function(id) {
                	$scope.advtBnrLstSwipeIdx = id + 1;
                }
                
                $scope.setImageSwipePos = function(idx){
                	var pos = $scope.srhPrdDetailInfo.imageSwipeIdx - 1;
                	if($scope.srhPrdDetailInfo.data.imgList.items.length < (pos + idx)) {
                		pos = 0;
                	} else if(pos + idx < 0) {
                		pos = $scope.srhPrdDetailInfo.data.imgList.items.length - 1;
                	} else {
                		pos = pos + idx;
                	}
                	$scope.imageSwipeControl.moveIndex(pos);
                };
        		
        		$scope.productDetailInfoClose = function(btnFlag) {
        			// stop video
        			try{
        				document.getElementById("autoVideo1").pause();
        			}catch(e){}
        			
        			if (!btnFlag) {
        				$scope.sendTclick("m_RDC_SrhResult_Poplayer_Clk_Close");
        			}

        			$scope.srhPrdDetailInfo.show = false;
        			$scope.scrollFlag = true;
        			LotteScroll.enableScroll();
        			$scope.dimmedClose();
        			return false;
        		};

                // #hhk
                /*$scope.tabSetTab = function(tabNum) {

                };*/

                // $scope.tabActive = 1;
                $scope.tabActive = 'resultPrice';

                $scope.setTabActive = function(newTab){
                  $scope.tabActive = newTab;

                };

                $scope.isSetActive = function(tabNum){
                  return $scope.tabActive === tabNum;
                };

        		/**
        	     * @ngdoc function
        	     * @name productContainer.function:addWishClick
        	     * @description
        	     * 위시 리스트에 담기 클릭
        	     * @example
        	     * $scope.addWishClick(idx, item)
        	     * @param {Number} idx 상품 리스트 인덱스
        	     * @param {Object} item 상품 json data
        	     * 
        	     * @param {Number} item.outlnkMall 외부 상품 구분값
        	     * @param {Boolean} item.has_wish 위시에 담긴 상품인지에 대한 구분값
        	     * @param {String} item.limit_age_yn 성인 상품 여부 Y/N
        	     * @param {String} item.goods_no 상품 번호

        	     * @returns {String} 
        	        1. 이미 등록된 상품입니다.
        		    2. 선택하신 상품은 \n상품정보화면에서 담아주세요.
        		    3. 죄송합니다. 품절된 상품입니다.
        			4. 죄송합니다. 판매종료된 상품입니다.
        			5. 위시리스트에 저장되었습니다.
        			6. 죄송합니다. 잠시 후 다시 이용해 주세요.
        			7. 죄송합니다. 품절된 상품입니다.
        			8. 죄송합니다. 잠시 후 다시 이용해 주세요.
        			9. 로그인 후 이용하실 수 있습니다.
        	     */
        		$scope.addWishClick = function() {
        			// 이미 등록된 위시 클릭 방지
        			if($scope.srhPrdDetailInfo.data.saveWishYn) {
        				alert("이미 등록된 상품입니다.");
        				//$scope.openSystemAlert({msg:"이미 등록된 상품입니다."});
        				return false;
        			}

        			var item = $scope.srhPrdDetailInfo.item;
        			var idx = $scope.srhPrdDetailInfo.idx;

        			if (item.outlnkMall == "LECS") { /*LECS 상품*/
        				if (confirm("공식온라인 몰로 이동후 담을 수 있습니다.")) {
        					LotteLink.goOutLink(item.outlnk, item.outlnkMall);
        				}
        				return false;
        			} else if (item.outlnkMall == "SP") { /*롯데슈퍼 상품*/
        				if (confirm("롯데슈퍼로 이동후 담을 수 있습니다.")) {
        					LotteLink.goOutLink(item.outlnk, item.outlnkMall);
        				}
        				return false;
        			}

        			if (!$scope.loginInfo.isLogin) { /*로그인 안한 경우*/
        				alert('로그인 후 이용하실 수 있습니다.');
        				$scope.loginProc(); /*go Login*/
        				return false;
        			} else {
        				if (item.limit_age_yn == 'Y') {
        					if ($scope.loginInfo.isAdult == "") { /*19금 상품이고 본인인증 안한 경우*/
        						alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
        						$scope.goAdultSci();
        						return false;
        					} else if (!$scope.loginInfo.isAdult) {
        						alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
        						return false;
        					}
        				}
        			};
        			$scope.sendProductWish(item.goods_no, function (res) {
        				if (res) {
        					$scope.srhPrdDetailInfo.data.saveWishYn = true;
        				} else {
        					$scope.srhPrdDetailInfo.data.saveWishYn = false;
        				}
        			});

        			$scope.sendTclick("m_RDC_SrhResult_Poplayer_Clk_Wsh"); 
        		};
            	
            }
        };
        
	}]);//directive

})(window, window.angular);