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
	
	app.controller('burberryCscenterCtrl', ['$scope', 'LotteCommon','$http', 'commInitData', function($scope, LotteCommon, $http, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "burberry_cscenter";//서브헤더 타이틀
		$scope.isTestmode = false;
        $scope.loadingPage = true; // 로딩 프로그래스
        $scope.tClickBase = "m_DC_SpeMall_Burberry_";
        
			 // 스크린 데이터 리셋
			 $scope.screenData = {
				dispNo: 5595615,
				cate_list:[], // 카테고리 리스트
				cateDepth2:0, //카테고리 2depth 선택값(dispNo)
				cateDepth3:0, //카테고리 3depth 선택값(dispNo)
				subShow: false, //중카 영역 노출처리(true/false)
                exChangeList : '',
                tabIdx:'0', //defalut: 자주묻는 질문
                faqList : [],
                faqDetailView : 0 // FAQ view
			}
       
        if (commInitData.query['tabIdx']){
            $scope.screenData.tabIdx = commInitData.query['tabIdx'];
        }

	    /**
		 * @ngdoc function
		 * @name tabShow
		 * @description
		 * cs센터 텝 
		 * @example
		 * $scope.tabShowd(tabIdx)
         * @param {string} tabIdx 탭 인덱스
		 */
        $scope.tabShow = function(tabIdx){
            $scope.screenData.tabIdx = tabIdx;
        }

        /**
		 * @ngdoc function
		 * @name tabShow
		 * @description
		 * cs센터 텝 
		 * @example
		 * $scope.tabShowd(listIdx)
         * @param {number} listIdx 리스트 인덱스
		 */
        $scope.faqDetail = function(listIdx){
            var faqlist = $scope.screenData.faqList;
          if($scope.screenData.faqDetailView == listIdx){

            angular.forEach(faqlist,function(val,key){
                if(listIdx != key){
                faqlist[key].view = false;
                 }    
            });

            faqlist[listIdx].view = ( faqlist[listIdx].view ) ? false : true;

          }else{

            angular.forEach(faqlist,function(val,key){
                faqlist[key].view = false;
            });
            $scope.screenData.faqDetailView = listIdx;
           
            faqlist[listIdx].view = true;

          }
        }


        // cs센터 스크린데이터 로드 
        $scope.loadScreenData = function(){
            $http.get(LotteCommon.BurberryCsData)
            .success(function(data){
                //교환 환불 정책
                if(data.exChangeList){
                    //단락 간격 조정 처리
                    $scope.screenData.exChangeList = data.exChangeList[0].quest_cont.replace(/(<br>)/gi,"<br/><br/>");
                }
                // 자주 묻는 질문
                if(data.faqList){
                    $scope.screenData.faqList = data.faqList;
                }

            })
            .error(function(er){
                console.log("버버리 CS센터 데이터 로드 에러");
            });
        }

        $scope.loadScreenData();    

	}]);
	
	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/mall/burberry/cscenter/burberry_cscenter_container.html',
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
                        //URL 재조합
                        var URL = ($scope.isTestmode) ? LotteCommon.mallBurberryList +"?curDispNo=" + depthList.disp_no +"&beforeNo=" + depthList.disp_no + "&cateDepth=" + depthList.cate_depth + "&title=" +depthList.disp_nm + "&" + $scope.baseParam :  depthList.link_url + "&" + $scope.baseParam;
                        $window.location.href = URL + "&tclick=" + $scope.tClickBase + "Clk_" + depthList.disp_no;
                    }
                  
                }
                
                /*이전 페이지 링크*/
                $scope.gotoPrepage = function() {
                   // $scope.sendTclick("m_RDC_header_new_pre");
                    //history.go(-1);
                    $window.location.href = LotteCommon.mallBurberryMain + "?"+ $scope.baseParam;
                };

                 /* 상단 서브해더 스크롤에 따른 위치값 고정 */
				 var $el = angular.element(el),
				 $win = angular.element($window),
				 $wrap = angular.element("#burberry_faq_wrap"), // 버버리 컨텐츠
				 headerHeight = $scope.subHeaderHeight,
                subHeaderHeight = headerHeight;

                function setHeaderFixed() {
                    if ($scope.appObj.isNativeHeader) {
                        subHeaderHeight = 0;
                    }

                    if ($win.scrollTop() >= 0) {
                        $el.attr("style", "z-index:100;position:fixed;top:" + subHeaderHeight +"px;width:100%");
                        $wrap.css({"padding-top":headerHeight+48});
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

})(window, window.angular);