(function(window, angular, undefined) {
	'use strict';
	
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
        'lotteCommFooter',
        'lotteNgSwipe',
        'lotteSlider'
	]);
	
	app.controller('burberryMainCtrl', ['$http','$scope', '$window','LotteCommon','$timeout', function($http,$scope, $window, LotteCommon, $timeout) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "burberry_main";//서브헤더 타이틀
        $scope.pageLoading = true; // 로딩 프로그래스
        $scope.isTestmode = true;
        $scope.tClickBase = "m_DC_SpeMall_Burberry_";
	
	   // 스크린 데이터 리셋
	 
        $scope.screenData = {
            dispNo: 5595615, // 버버리 dispNo
            cate_list:[], // 카테고리 리스트
            cateDepth2:0, //카테고리 2depth 선택값(dispNo)
            cateDepth3:0, //카테고리 3depth 선택값(dispNo)
            subShow: false, //중카 영역 노출처리(true/false)
            main_big_prod : {}, // 버버리 메인배너
            collection_prod : {}, // 버버리 컬렉션
            new_prod : {}, // 버버리 이미지 상단
            center_prod : {}, // 버버리 이미지 하단
            newArr_prod : {} // 버버리 신상
        }
        

        /**
         * 티클릭 
         * 
         */
       
          /**
         * @ngdoc function
         * @name goBannerUrl
         * @description
         * 상품 링크 
         * @param {string} url 상품 URL
         * @param {string} type 배너 타입
        */
        $scope.goBurberryUrl = function(goods,type,tclick,idx){

           var url = (type == "main_prod") ? goods: goods.goods.link_url ;
           
            url += (url.indexOf("?") > -1) ? "&" : "?";
           
            $window.location.href = url + $scope.baseParam + "&tclick=" + $scope.tClickBase + tclick + getAddZero(idx+1);
           
          }
  
        /**
		 * 버버리 메인 데이터 로드
		 */

		$scope.loadScreenData = function(){
            
            $http.get(LotteCommon.mallBurberryData + '?dispNo=' + $scope.screenData.dispNo)
            .success(function(data) {

                //  메인 배너 데이터
                if(data.max.main_big_banner_list && data.max.main_big_banner_list.total_count > 0){
                    $scope.screenData.main_big_prod = data.max.main_big_banner_list.items[0].img_list;
                }

                 //  컬렉션 배너 데이터
                 if(data.max.collection_banner_list && data.max.collection_banner_list.total_count > 0){
                    $scope.screenData.collection_prod = data.max.collection_banner_list;
                }

                 //  이미지 상단 배너 데이터
                 if(data.max.new_goods_banner_list && data.max.new_goods_banner_list.total_count > 0){
                    $scope.screenData.new_prod = data.max.new_goods_banner_list;
                }

                 //  이미지 하단 배너 데이터
                 if(data.max.center_banner_list && data.max.center_banner_list.total_count > 0){
                    $scope.screenData.center_prod = data.max.center_banner_list;
                }

                 //  신상 배너 데이터
                 if(data.max.main_goods_list && data.max.main_goods_list.total_count > 0){
                    $scope.screenData.newArr_prod = data.max.main_goods_list;

                    //신상 배너 노출 개수 
                    switch(data.max.main_goods_list.total_count){
                        case 1:
                        case 2:
                        case 3:
                            $scope.screenData.newArr_prod.limit = 0;
                        break;
                        case 4:
                        case 5:
                            $scope.screenData.newArr_prod.limit = 4;
                        break;
                        case 6:
                        case 7:
                            $scope.screenData.newArr_prod.limit = 6;
                        break;
                        default:
                            $scope.screenData.newArr_prod.limit = 8;
                        break;
                    }
                }
                $timeout(function() {
                    $scope.pageLoading = false;
                },800);
            }).error(function(er){
                console.log("카테고리데이터 로드 오류");
                $timeout(function() {
                    $scope.pageLoading = false;
                },800);
            });

		}
        $scope.loadScreenData();

	}]);
	
	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/mall/burberry/burberry_main_container.html',
			replace : true,
			link : function($scope, el, attrs) {

			}
		};
	});

   /**
	 * @ngdoc directive
	 * @name mallSubHeader
	 * @description
	 * 전문관 서브 해더 영역
	 * @example
	 * <div mall-sub-header></div>
	 */
    app.directive('mallSubHeader', [ '$http','$window','LotteCommon', function($http, $window, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/burberry/mall_sub_header.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.screenData.subShow = false; //중카영역 비노출(true/false)
                /* 서브 해더 로드 */
                $http.get(LotteCommon.mallBurberryCateData + '?dispNo=5595615')
                .success(function(data) {
                    $scope.screenData.cate_list = data.max.cate_list.items;
                    
                }).error(function(er){
                    console.log("카테고리데이터 로드 오류");
                });

                /**
	            * @ngdoc function
	            * @name subHeaderCtrl
                * @description 
                * 서브 해더 메뉴 컨트롤
                * @param {objext} depthList 해당 뎁스 리스트데이터
                * @param {number} depthNo 뎁스 번호
	            */
                $scope.subHeaderCtrl = function(depthList,depthNo){
                  
                    switch(depthNo){
                        case 2:
                            
                            if(depthList.sub_cate_list != null){ //서브카티고리가 있을시
                                if(!$scope.depth2 || $scope.screenData.cateDepth2 != depthList.disp_no){
                                    $scope.screenData.cateDepth2 = depthList.disp_no; //선택 카테고리 담기
                                    $scope.screenData.subShow = $scope.depth2 = true; // 2뎁스메뉴 보기
                                }else{
                                    $scope.screenData.subShow = $scope.depth2 = false;
                                }
                            }
                        break;
                        case 3:
                            $scope.screenData.cateDepth3 = (depthList.sub_cate_list != null && $scope.screenData.cateDepth3 != depthList.disp_no) ? depthList.disp_no : "";
                        break;
                        default:
                            $scope.screenData.subShow = $scope.depth2 = false;
                        break;
                    }
                
                    if(typeof(depthList) == 'object' && depthList.sub_cate_list == null && depthList != 'close'){
                        
                        if(!depthList.link_url){
                            return false;
                        }
                        
                        //URL 재조합
                        var URL = ($scope.isTestmode) ? LotteCommon.mallBurberryList +"?curDispNo=" + depthList.disp_no +"&beforeNo=" + depthList.disp_no + "&cateDepth=" + depthList.cate_depth + "&title=" +depthList.disp_nm + "&" + $scope.baseParam :  depthList.link_url + "&" + $scope.baseParam;
                        $window.location.href = URL + "&tclick=" + $scope.tClickBase + "Clk_" + depthList.disp_no;
                    }
                  
                }
                
                /*이전 페이지 링크*/
                $scope.gotoPrepage = function() {
                   // $scope.sendTclick("m_RDC_header_new_pre");
                    //history.go(-1);
                    $window.location.href = LotteCommon.mallBurberryMain + "?"+ $scope.baseParam + "&tclick=" +  $scope.tClickBase + "logo";
                };

                /* 상단 서브해더 스크롤에 따른 위치값 고정 */
                var $el = angular.element(el),
                    $win = angular.element($window),
                    $wrap = angular.element("#burberry_main_wrap"), // 버버리 컨텐츠
                    headerHeight = $scope.subHeaderHeight,
                    subHeaderHeight = headerHeight;

                function setHeaderFixed() {
                    if ($scope.appObj.isNativeHeader) {
                        subHeaderHeight = 0;
                    }

                    if ($win.scrollTop() >= 0) {
                        $el.attr("style", "z-index:100;position:fixed;top:" + subHeaderHeight +"px;width:100%");
                        $wrap.css({"padding-top":headerHeight+51});
                    } else {
                        $el.removeAttr("style");
                        $wrap.css({"padding-top":0});
                    }
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
	 * @name burberryFooter
	 * @description
	 * 버버리 푸터 영역
	 * @example
	 * <burberry-footer></burberry-footer>
	 */
    app.directive('burberryFooter', [ '$http','$window','LotteCommon', function($http, $window, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/burberry/burberry_footer.html',
            replace : true,
            link : function($scope, el, attrs) {
              
              /**
	          * @ngdoc function
	          * @name goCscenter
              * @description 
              * 푸터 링크
              * @param {number} idx 탭 인덱스 넘버
	          */
              $scope.goCscenter = function(idx){
                $window.location.href =  LotteCommon.BurberryCsCenter+ "?" + $scope.baseParam + "&tabIdx=" + idx;
              }

            }
        }
    }]);

    function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
        return num < 10 ? "0" + num : num + "";
    }
})(window, window.angular);