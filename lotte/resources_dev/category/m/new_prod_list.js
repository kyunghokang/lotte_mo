(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteUtil',
		'lotteSideCtg',
		'lotteCommFooter',
		'lotteProduct',
		'lotteNgSwipe',
		'lotteVideo',
		'cateSideFilter',
        'searchPlanShop', // 기획전형 상품 20180306 박해원
        'searchDetailPopup'
	]);

	app.controller('CateProdListCtrl', ['$window', '$location' ,'$http', '$scope', '$timeout', '$filter', 'LotteStorage', 'LotteCommon','commInitData', function($window, $location ,$http, $scope, $timeout, $filter, LotteStorage, LotteCommon, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.productMoreScroll = true;
		$scope.screenID = "side_cate_catesmall";
		$scope.subTitle = "";
		$scope.templateType = "cate_prod_normal";
		$scope.currentItem = 1;
		$scope.totalItem = 0;
		$scope.tClickBase = "m_RDC_";
		/*
		 * 스크린 데이터 초기화
		 */
		($scope.screenDataReset = function() {
			$scope.pageOptions = {
				selectCategory: 0,
				selectCategoryCode: '',
				selectCategoryParentNo:0,
				selectCategoryDepth: 1
			};

			$scope.screenData = {
				idx: "",
				mGrpNo: ""
			};
		})();


		/*
		 * 화면에 필요한 인자값 세팅
		 */
		if(commInitData.query['mGrpNo'] != undefined) {
			$scope.screenData.mGrpNo = commInitData.query['mGrpNo'];
		}
		if(commInitData.query['curDispNo'] != undefined) {
			$scope.pageOptions.selectCategory = commInitData.query['curDispNo'];
		}
		if(commInitData.query['disp_no'] != undefined) {
			$scope.pageOptions.selectCategory = commInitData.query['disp_no'];
		}
		if(commInitData.query['idx'] != undefined) {
			$scope.screenData.idx = commInitData.query['idx'];
		}
		$scope.curDispNo = $scope.pageOptions.selectCategory;
		$scope.curDispNoSctCd = 73;
		
		$scope.cateViewFlag = false; // 서브헤더 카테고리 여부
		$scope.cateView = function () {
			$scope.sendTclick('m_DC_new_prod_list_Clk_Ttl');
			$scope.cateViewFlag = !$scope.cateViewFlag;
		};
		/* 중카에서 가져오는 중카테고리 값*/
		$scope.cateDepth1 = "";
		$scope.cateDepth2 = "";
		$scope.depthCurDispNo = "";
		
		$scope.paramTitle = getParameterByName('cateDepth1');
		$scope.paramSubTitle = getParameterByName('cateDepth2');
		$scope.paramCurDispNo = getParameterByName('curDispNo');
		$scope.paramCurDispNo2 = getParameterByName('curDispNo2');
		
		if (getParameterByName('cateDepth1') == ""){
        	$scope.cateDepth1 = ""; 
        } else if($scope.paramTitle.length >= 1) {
        	$scope.cateDepth1 = $scope.paramTitle; 
        }        
        if (getParameterByName('paramCurDispNo') == ""){
        	$scope.depthCurDispNo = ""; 
        } else if($scope.paramCurDispNo.length >= 1) {
        	$scope.depthCurDispNo = $scope.paramCurDispNo; 
        }
		if($scope.paramSubTitle.length >= 1){
			$scope.cateDepth2 = $scope.paramSubTitle; 
		}
		if($scope.paramCurDispNo2.length >= 1){
			$scope.curDispNo = $scope.paramCurDispNo2; 
		}
		
		var tempItemCnt = 2;
		var tempWidth = 228;
		if(document.body.clientWidth >= 640){
			tempItemCnt = 3;
			tempWidth = 324;
		}
		if(document.body.clientWidth >= 870){
			tempItemCnt = 4;
		}
		// 이미지 강조형의 경우 left margin 구하기
		$scope.imageMargin = parseInt((tempWidth - parseInt(document.body.clientWidth/tempItemCnt, 10)) / 2, 10) * -1 + 'px';
		
		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.getParameterByName
		 * @description
		 * 파라메터 값 가져오기
		 * @example
		 * getParameterByName(name)
		 */
		function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

	}]);
	
	/* header each */
    app.directive('subHeaderProdList', [ '$window', function($window) {
        return {
            replace : true,
            link : function($scope, el, attrs) {
				
                var $el = angular.element(el),
                    $win = angular.element($window),
                    headerHeight = $scope.subHeaderHeight;

                $win = angular.element($window),
                headerHeight = $scope.subHeaderHeight;

                function setHeaderFixed() {
                    if ($scope.appObj.isNativeHeader) {
                        headerHeight = 0;
                    }
                    /*if ($win.scrollTop() >= 0) {
                        $el.attr("style", "z-index:100;position:fixed;top:" + headerHeight +"px;width:100%");
                    } else {
                        $el.removeAttr("style");
                    }*/
                }
                $win.on('scroll', function (evt) {
                    setHeaderFixed();
                    setTimeout(setHeaderFixed, 300);
                });
            }
        }
    }]);

    /**
	 * @ngdoc directive
	 * @name lotteComm.directive:scrollCount
	 * @description
	 * top button
	 * @example
	 * <scroll-count></scroll-count>
	 */
	commModule.directive('scrollCount', ['$window', 'LotteCommon', function ($window, LotteCommon) {
		return {
			template: '<div ng-show="srhResultData.tCnt && srhResultData.tCnt > 0" class="count_wrap"><span class="count">{{currentItem|number}}/{{srhResultData.tCnt|number}}</span></div>',
			replace: true,
			link: function ($scope, el, attrs) {

				angular.element($window).on('scroll', function (evt) {
					$('.count_wrap').stop().show();
					clearTimeout($('.count_wrap').data('scroll'));

					setTimeout(function(){
						$('.count_wrap').fadeOut();
					},1000);
					
					$scope.totalItem = $('.listWrap ol > li').length;
					var prevIndex = -1;
					var prevTop = -1;
					for(var i = 0; i<$scope.totalItem; i++){
						var el = $($('.listWrap ol > li')[i]);
						var top = el.offset().top;
						if(window.scrollY - top <= 100 && prevIndex == -1){
							prevIndex = i;
							prevTop = window.scrollY - top;
						}
						if(prevIndex != -1 && window.scrollY - top <= 100 && window.scrollY - top != prevTop){
							$scope.currentItem = i;
							break;
						}
					}
				});
			}
		}
	}]);
	
	app.directive('lotteContainer', ['$window', 'LotteCommon', function($window,LotteCommon) {
		return {
			templateUrl : '/lotte/resources_dev/category/m/new_prod_list_container.html',
			replace : true,
			link : function($scope, el, attrs) {

				/* 스크롤 기능 구현 */
				var prodListFilterHead = angular.element(".srh_terms_wrap_area");
				var prodOffY = prodListFilterHead.offset().top;
				var prodOffSpace = angular.element(".sub_header_top_wrap").outerHeight();
				
				$scope.getListHeadFixedPose = function(){
					if(prodOffY - prodOffSpace> angular.element($window).scrollTop()){
						prodListFilterHead.removeClass("fixed");
					}else{
						prodListFilterHead.addClass("fixed");
					}
				}

			}
		};
	} ]);

})(window, window.angular);