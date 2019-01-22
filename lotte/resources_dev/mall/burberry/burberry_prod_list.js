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
	
	app.controller('burberryProdListCtrl', ['$scope', '$http', '$window', 'LotteCommon','commInitData', '$timeout',function($scope, $http, $window, LotteCommon, commInitData, $timeout) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "burberry_prod_list";//서브헤더 타이틀
		$scope.loadingPage = true; // 로딩 프로그래스
        $scope.isTestmode = true;
        $scope.morePage = true;
        $scope.money = ["",""];
        $scope.tClickBase = "m_DC_SpeMall_Burberry_";
        
		 // 스크린 데이터 리셋
		 $scope.screenData = {
			curDispNo: "",
            cate_list:[], // 카테고리 리스트
            cateNodeName: [],
            selectDepthNo : 0,
            cateDepth2:0, //카테고리 2depth 선택값(dispNo)
            cateDepth3:0, //카테고리 3depth 선택값(dispNo)
            subShow: false, //중카 영역 노출처리(true/false)
            listType:true, // 리스트 UI타입(false:리스트형/true:박스형)
            sortIdx:'19',
            moneySelect:'',
            dispGoodsList: [],
			page : 0 //페이징 넘버
        }
        
        if (commInitData.query['curDispNo']){
			$scope.screenData.curDispNo = commInitData.query['curDispNo'];
        }

        if (commInitData.query['cateDepth']){
			$scope.screenData.selectDepthNo = commInitData.query['cateDepth'];
        }

       
		// 버버리 상품 리스트 데이터 로드

		$scope.loadScreenData = function(){
            $scope.loadingPage = true; 
            $scope.screenData.page ++;
			$http.get(LotteCommon.subBurberryListData + '?dispNo=' + $scope.screenData.curDispNo +'&page='+ $scope.screenData.page +'&dispCnt=60&sort=' + $scope.screenData.sortIdx + '&moneyStart=' + $scope.money[0]+ '&moneyEnd='+ $scope.money[1] )
			.success(function(data) {
                if(data.prdList){
                    if($scope.screenData.page <= 1){

                        $scope.screenData.dispGoodsList = data.prdList;
                        $scope.loadingPage = false; 
                    }else{

                       $scope.screenData.dispGoodsList =  $scope.screenData.dispGoodsList.concat(data.prdList);
                       $scope.loadingPage = false;  
                    }

                    //불러온 마지막 data.prdList 개수 체크
                    $scope.morePage = (data.prdList.length < 60) ? false : true;

                }else{
                    $scope.morePage = false;
                }
            })
            .error(function(er){
                console.log("버버리 상품 리스트 데이터 로드 오류");
                $scope.loadingPage = false; 
            });
        }
        
        /**
         * @ngdoc function
         * @name sortClick
         * @description
         * 리스트 sort 값
         * @example
         * $scope.sortClick(sort,money)
         * @param {string} sort 정렬 
         * @param {string} money 금액 정렬 
        */

        $scope.sortClick = function(sort,money){
           
            $scope.screenData.page = 0;
            $scope.screenData.sortIdx = (sort) ? sort : $scope.screenData.sortIdx;
            
            if(money){
                $scope.money = money.split("_");
            }else{
                $scope.money = ["",""];
            }
            $scope.loadScreenData(); 

        }
        /**
	     * @ngdoc function
	     * @name listUiChange
	     * @description
	     * 리스트 ui 선택
	     * @example
	     * $scope.listUIChang(listTyp)
         * @param {boolen} listType
	     */
         $scope.listUIChange = function(listType){
            $scope.screenData.listType = (!listType) ? true : false;
         }
        
          /**
	     * @ngdoc function
	     * @name goproduct
	     * @description
	     * 상품 상세 가기
	     * @example
	     * $scope.goproduct(item)
         * @param {object} item
	     */

        $scope.goproduct = function(item){
            $window.location.href = LotteCommon.BurberryProdView + "?goods_no=" + item.goods_no + "&" + $scope.baseParam ;	
        }
        

        var $win = angular.element($window),
        $body = angular.element("body"),
        winH = $win.height(),
        bodyH = $body[0].scrollHeight,
        scrollRatio = 4.0; // 윈도우 높이의 4배
       
        /**
         * 스크롤 이벤트
        */
        $win.on("scroll" , function (e) {
            if ($scope.loadingPage || !$scope.morePage) {
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

        $scope.loadScreenData(); 
	}]);
	
	app.directive('lotteContainer', function() {
		return {
			templateUrl : '/lotte/resources_dev/mall/burberry/burberry_prod_list_container.html',
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

               /**
		         * @ngdoc function
		         * @name ProdListCtrl.function:getCateNodeName
		         * @description
		         * 카테고리 노드명 추출
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
		        			}else{
                               if($scope.screenData.cate_list[i].disp_no == $scope.screenData.curDispNo){
                                 $scope.screenData.cateNodeName[0] = $scope.screenData.cate_list[i].disp_nm;
                               }  
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

                /* 서브 해더 로드 */
                $http.get(LotteCommon.mallBurberryCateData + '?dispNo=5595615')
                .success(function(data) {
                    $scope.screenData.cate_list = data.max.cate_list.items;
                    $scope.getCateNodeName('',1); //카테고리 노드명 추출
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
                   $window.location.href = LotteCommon.mallBurberryMain + "?"+ $scope.baseParam;
                };

                /* 상단 서브해더 스크롤에 따른 위치값 고정 */
                var $el = angular.element(el),
                    $win = angular.element($window),
                    $wrap = angular.element("#burberry_prod_list"), // 버버리 컨텐츠
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