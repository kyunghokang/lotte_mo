(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteNgSwipe',
        'lotteProduct',
        'lotteSns',
        'dearpetSubCategory'
    ]);

app.controller('DearpetProdListCtrl', ['$http','$scope', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteStorage', '$timeout', function($http, $scope, $window, $location, LotteCommon, commInitData, LotteStorage, $timeout) {
         $scope.isMain = false;
         $scope.showWrap = true;
         $scope.contVisible = true;
         $scope.subTitle = "미미뚜뚜"; // 서브헤더 타이틀
         $scope.screenID = "미미뚜뚜"; // 스크린 아이디
         //$scope.screenID = "DearpetProdList"; // 스크린 아이디
         $scope.pageLoading = false;
         $scope.dispNo = "";
         $scope.productListLoading = true;
         $scope.productMoreScroll = true;

         //20170607  닷컴 제품 유닛으로 변경 // 박해원
         $scope.templateType = "list";
         $scope.LotteSuperBlockStatus = true;
         $scope.curDispNoSctCd = 95; // 전시유입코드 ( 상세 이동시 )

         $scope.shareCodeis = "MIMI TOUTOU";
         $scope.shareRendingURL = location.href;

        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
            $scope.screenData = {
                page: 0,
                disp_name: "",
                dispNo: '',
                curDispNo: '',
                cate3:"",
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
                title : '',
                //20170607  닷컴 제품 유닛으로 변경 // 박해원
                pageSize: 20,
                pageEnd: false,
                goodsTotal: 0,
                goodsList: [],
            }
        })();

        //20170607  닷컴 제품 유닛으로 변경 // 박해원
        $scope.changeTemplate = function( type ){
          if( $scope.templateType != type ) $scope.templateType = type;
        }

        if (commInitData.query['curDispNo']){
            $scope.screenData.curDispNo = commInitData.query['curDispNo'];
        }
        if (commInitData.query['cate3']){
            $scope.screenData.cate3 = commInitData.query['cate3'];
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
            if($scope.screenData.pageEnd) return;
            $scope.screenData.page++;
            $scope.productListLoading = true;
            var url = LotteCommon.petMallProdListData+'?dispNo='+($scope.screenData.cate3||$scope.screenData.curDispNo)+'&page='+$scope.screenData.page+'&last_goods_no='+$scope.screenData.lastGoodsNo;
            $http.get(url)
            .success(function(data) {
                var contents = [];
                contents = data['result'];

                /*
                try{ //  강아지, 고양이 임시 삭제
                    var catLength = contents.cate_list.items.length;
                    for( var i=0; i<catLength; ++i ) {
                        for( var d =0; d<2; ++d ) {
                            if( contents.cate_list.items[i].disp_no == 5566302 || contents.cate_list.items[i].disp_no == 5566303 ) {
                                contents.cate_list.items.splice( i, 1 );
                            }
                        }
                    }
                } catch(e){ }
                */

                $scope.ctgData = contents;
                $scope.findCurDispNoDepth($scope.screenData.curDispNo); /*서브 카테고리 번호로 카테고리 찾기*/

                // 20170607 제품 유닛 변경
                $scope.screenData.goodsTotal = contents.totalCnt;
                if($scope.screenData.page > 1) {
                      try{
                          var newDataArray = $scope.screenData.goodsList.concat( contents.prd_list.items );
                          $scope.screenData.goodsList = newDataArray;
                      } catch(e) { };
                } else {
                     try { $scope.screenData.goodsList = contents.prd_list.items; } catch(e) {}
                }

                if($scope.screenData.goodsTotal < $scope.screenData.page*$scope.screenData.pageSize) {
                    $scope.screenData.pageEnd = true;
                    $scope.productMoreScroll = false;
                }

                $scope.productListLoading = false;
                $scope.$parent.LotteSuperBlockStatus = false;
                $scope.pageLoading = false;
                // end 20170607 제품 유닛 변경

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

                if( !$scope.screenData.cate_list.length ) {
                    $scope.screenData.cate_list = contents.cate_list.items;
                    $scope.sendCategoryData( contents.cate_list.items );
                }
            });
        };

        // 20170619 박해원 서브카테고리
        $scope.getSubCateDataFunc;
        $scope.$on('getSubCateData', function(event, callFnc ) {
            if( !$scope.getSubCateDataFun && callFnc ) $scope.getSubCateDataFunc = callFnc;
            try{
                if($scope.screenData.cate_list.length) {
                    $scope.sendCategoryData ($scope.screenData.cate_list);
                }
            } catch(e) {};
        });
        $scope.sendCategoryData = function( data ){
            if(!$scope.getSubCateDataFunc) return;
            $scope.getSubCateDataFunc(data);
        };
        // end 20170619

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
                                    //  $scope.screenData.sCtgBnrShowFlag = true;
                                    //} else {
                                    //  $scope.screenData.sCtgBnrShowFlag = false;
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

        $scope.petShare = function( obj ){
            $scope.sendTclick( "m_DC_SpeDisp_Dearpet_Clk_Shr" );
            //try{ $scope.subTitle = $scope.screenData.goodsList[0].goods_nm } catch(e) { };
            $scope.showSharePop();
            $timeout(function(){
                getScope().noCdnUrl = location.href;
            },300);
        }
    }]);

    app.directive('lotteContainer',['$window','LotteCommon', function($window, LotteCommon) {
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
                $scope.productInfoClick = function(item) {
                    $scope.productClick(item);
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

                    //console.log(item.subopen,'테스트');
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
                    if(item.dearpet_depth_cd == '20') {
                        var url = LotteCommon.petMallgalleryUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth;
                        url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
                        $window.location.href = url;

                    } else {
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
    app.directive('subHeaderEach', [ '$window', '$timeout', 'AppDownBnrService',  function( $window, $timeout, AppDownBnrService ) {
        return {
            replace : true,
            link : function($scope, el, attrs) {
                $scope.subHeaderFixed = true;
                // 스크롤시 헤더 고정
				var $el = angular.element(el),
					headerHeight = $scope.subHeaderHeight;

				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					// console.log(args.scrollPos, AppDownBnrService.appDownBnrInfo.height);
					// args.scrollPos < 0 : iOS Bendding 현상으로 스크롤 포지션 마이너스때 처리
					if (args.scrollPos >= AppDownBnrService.appDownBnrInfo.height || args.scrollPos < 0) {
						$scope.headerFixed = true;
					} else {
						$scope.headerFixed = false;
                        console.log('fix');
					}

					$timeout(function () {
						$scope.$apply();
					});
				});
            }
        }
    }]);
})(window, window.angular);
