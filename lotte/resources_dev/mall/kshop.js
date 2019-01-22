(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'ngRoute',
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteUnit',
        'lotteCommFooter',
        'angular-carousel'
    ]);

    /*전체 Controller*/
    app.controller('KshopCtrl', ['$scope', '$http', 'LotteCommon', 'LotteUtil', '$location', function($scope, $http, LotteCommon, LotteUtil, $location) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "대한민국 창조의 힘"; /*서브헤더 타이틀*/

        /*UI Scope*/
        $scope.kShopUI = {
            curDispNo : "", /*서브 페이지일 경우 curDispNo*/
            prdFilterCurDispNo : "", /*상품 카테고리 필터 (전체일경우 빈값)*/
            sCtgLayerOpen : false,
            curCtgIdx : -1,
            curCtgName : "",
            curCtgNo : "",
            curSCtgIdx : -1,
            curSCtgName : "",
            curSCtgNo : "",
            curSSCtgIdx : -1,
            curSSCtgName : "",
            curSSCtgNo : "",
            sCtgBnrShowFlag : false,
            ssCtgLayerOpenFlag : false,
            ssCtgList : []
        };

        /**
         * Data Load Scope Func
         */
        /*카테고리 데이터 로드  LotteCommon.kshopCtgData, {withCredentials:false}   ==> , {withCredentials:false}  삭제*/
        $scope.loadCtgData = function() {
            if ($scope.ctgData == undefined) {
                $http.get(LotteCommon.kshopCtgData, {withCredentials:false})
                .success(function(data) {
                	/*console.log( data ) ;*/ 
                    $scope.ctgData = data;
                    $scope.findCurDispNoDepth($scope.kShopUI.curDispNo); /*서브 카테고리 번호로 카테고리 찾기*/
                    

                    //서브 카테고리 배열로 자르기
                    $scope.ctgSliceData = function(idx) {  
                        //데이터 파라메터 받기, 배열 n개로 잘라주기
                        function sliceArray(dataArr, cnt) {
                            var targetArr = [],
                                i = 0,
                                j = Math.ceil(dataArr.length / cnt); 
                            
                            for (i ; i < j; i++) {
                                if (dataArr.length > 0) {
                                    cnt = dataArr.length == 1 ? 1 : cnt;
                                    targetArr[i] = dataArr.slice(i*cnt, i*cnt + cnt);
                                }
                            }
                            return targetArr;
                        };

                        if ($scope.ctgData.ctgs && $scope.ctgData.ctgs.length > 0) {
                            $scope.ctgData.ctgs.sliceItems = sliceArray($scope.ctgData.ctgs[idx].sctgs , 2);     
                        }
                    }

                })
                .error(function() {
                    console.log('Data Error : kshop 카테고리 데이터' );
                });
            } else {
                $scope.findCurDispNoDepth($scope.kShopUI.curDispNo); /*서브 카테고리 번호로 카테고리 찾기*/
            }
        };

        /*KShop 메인 데이터 로드*/
        $scope.loadMainData = function() {
            if($scope.mainData == undefined) {
                $http.get(LotteCommon.kshopMainData, {withCredentials:false})
                .success(function(data){
                    $scope.mainData = data;

                    if (data.banners) {
                        $scope.swipeBanner = data.banners;
                    }
                })
                .error(function() {
                    console.log('Data Error : kshop 메인페이지 데이터');
                });
            }
        };

        /*KShop 서브페이지(소카,세카) 데이터 로드*/
        $scope.loadSubData = function(dispNo) {
            /*console.log('loadSubData', 'dispNo : ' + dispNo);*/
            var rowsPerPage = 50000, /*한페이지당 갯수*/
                pageIdx = 1; /*페이지 Index*/
            $http.get(LotteCommon.kshopSubData, {params:{curDispNo:dispNo, pageIdx : pageIdx, rowsPerPage : rowsPerPage}, withCredentials:false})
            .success(function(data) {
                $scope.subData = data;
            })
            .error(function() {
                console.log('Data Error : kshop 서브페이지 데이터');
            });
        };

        /**
         * Util Scope Func
         */
        /*소카 전부 닫기*/
        $scope.allSSCtgClose = function (sCtgIdx) {
            if ($scope.kShopUI.curCtgIdx > -1) {
                var targetNode = $scope.ctgData.ctgs[$scope.kShopUI.curCtgIdx].sctgs,
                    targetLength = targetNode.length,
                    i = 0;

                for (i = 0; i < targetLength; i++) {
                    if (typeof targetNode[i].open != "undefined") {
                        if (sCtgIdx == null || sCtgIdx != i) {
                            delete targetNode[i].open; /*open node 삭제*/
                        }
                    }
                }
            }
        };

        /*인입 curDispNo로 해당 카테고리 Depth 및 index 찾기*/
        $scope.findCurDispNoDepth = function (curDispNo) {
            if (curDispNo &&curDispNo != "" && $scope.ctgData && $scope.ctgData.ctgs && $scope.ctgData.ctgs.length > 0) {
                var ctgIdx = 0,
                    sCtgIdx = 0,
                    ssCtgIdx = 0;

                for (ctgIdx= 0; ctgIdx < $scope.ctgData.ctgs.length; ctgIdx++) {
                    if ($scope.ctgData.ctgs[ctgIdx].sctgs && $scope.ctgData.ctgs[ctgIdx].sctgs.length > 0) {
                        for (sCtgIdx = 0; sCtgIdx < $scope.ctgData.ctgs[ctgIdx].sctgs.length; sCtgIdx++) {
                            if ($scope.ctgData.ctgs[ctgIdx].sctgs[sCtgIdx].ssctgs && $scope.ctgData.ctgs[ctgIdx].sctgs[sCtgIdx].ssctgs.length > 0) {
                                for (ssCtgIdx = 0; ssCtgIdx < $scope.ctgData.ctgs[ctgIdx].sctgs[sCtgIdx].ssctgs.length; ssCtgIdx++) {                              
                                    if ($scope.ctgData.ctgs[ctgIdx].sctgs[sCtgIdx].ssctgs[ssCtgIdx].ctg_no == curDispNo) {
                                        $scope.selectCurDispCtg(ctgIdx, sCtgIdx, ssCtgIdx); /*세카에서 맵핑될경우*/

                                        if (ssCtgIdx == 0) {
                                            $scope.kShopUI.sCtgBnrShowFlag = true;
                                        } else {
                                            $scope.kShopUI.sCtgBnrShowFlag = false;
                                        }
                                        return false;
                                    }
                                }
                            }
                            /*세카가 없을 경우에만 소카에서 맵핑 확인*/
                            else if (!$scope.ctgData.ctgs[ctgIdx].sctgs[sCtgIdx].ssctgs && $scope.ctgData.ctgs[ctgIdx].sctgs[sCtgIdx].ctg_no == curDispNo) {
                                $scope.selectCurDispCtg(ctgIdx, sCtgIdx); /*소카에서 맵핑될경우*/
                                $scope.kShopUI.sCtgBnrShowFlag = true;
                                return false;
                            }
                        }
                    }
                }

                $location.path("/"); /*매칭되는 카테고리가 없을 경우 메인으로 튕기도록*/
            }
        };

        /*카테고리 선택 활성화, Label 세팅*/
        $scope.selectCurDispCtg = function (curCtgIdx, curSCtgIdx, curSSCtgIdx) {
            $scope.kShopUI.curCtgName = "";
            $scope.kShopUI.curSCtgName = "";
            $scope.kShopUI.curSSCtgName = "";

            $scope.kShopUI.curCtgIdx = curCtgIdx;
            $scope.kShopUI.curCtgName = $scope.ctgData.ctgs[curCtgIdx].name;
            $scope.kShopUI.curCtgNo = $scope.ctgData.ctgs[curCtgIdx].ctg_no;

            $scope.kShopUI.curSCtgIdx = curSCtgIdx;
            $scope.kShopUI.curSCtgName = $scope.ctgData.ctgs[curCtgIdx].sctgs[curSCtgIdx].name;
            $scope.kShopUI.curSCtgNo = $scope.ctgData.ctgs[curCtgIdx].sctgs[curSCtgIdx].ctg_no;

            if (curSSCtgIdx != null) {
                $scope.kShopUI.curSSCtgIdx = curSSCtgIdx;
                $scope.kShopUI.curSSCtgName = $scope.ctgData.ctgs[curCtgIdx].sctgs[curSCtgIdx].ssctgs[curSSCtgIdx].name;
                $scope.kShopUI.curSSCtgNo = $scope.ctgData.ctgs[curCtgIdx].sctgs[curSCtgIdx].ssctgs[curSSCtgIdx].ctg_no;

                $scope.kShopUI.ssCtgList = $scope.ctgData.ctgs[curCtgIdx].sctgs[curSCtgIdx].ssctgs;
            } else {
                $scope.kShopUI.curSSCtgIdx = -1;
                $scope.kShopUI.ssCtgList  = [];
            }
            /*카테고리 선택 활성화 후 처리*/
            /*해당 카테고리가 속한 소카 번호로 카테고리 데이터 요청*/
            if ($scope.kShopUI.curSCtgNo && $scope.kShopUI.curSCtgNo != "") {
                /*$scope.loadSubData($scope.kShopUI.curSCtgNo);*/
                $scope.loadSubData($scope.kShopUI.curDispNo);
            }

            /*세카 번호 세팅 및 상품 Filter 설정*/
            /*
            if (curSSCtgIdx != null && curSSCtgIdx > 0) {
                $scope.kShopUI.prdFilterCurDispNo = $scope.kShopUI.curSSCtgNo;
            } else {
                $scope.kShopUI.prdFilterCurDispNo =  "";
            }
            */
        };

        /*소카 클릭*/
        $scope.kshopSctgClick = function (curDispNo) {
            $location.path("/" + curDispNo);
        };

        /*세카 (셀렉트박스형) 버튼 클릭*/
        $scope.kshopSsctgClick = function () {
            $scope.kShopUI.ssCtgLayerOpenFlag = true;
            angular.element("#wrapper").addClass("overflowy_hidden");
        };

        $scope.mainPdtTclickIdx = function (ctgIdx, itemIdx) {
            var rtnTclick = ctgIdx * 2 + (itemIdx + 1);

            rtnTclick = (rtnTclick < 10) ? "0" + rtnTclick : rtnTclick;
            return "M_K_PRD_" + rtnTclick;
        };

        function kshopBnrChangeURL(url) {
            var rtnUrl = "",
                baseUrl = "",
                params = "",
                paramsArr = [],
                paramsObj = {},
                mallHash = "",
                baseParam = $scope.baseParam;

            if (!url) {
                return rtnUrl;
            }

            url += "";

            if (url.indexOf("#/") > -1) { // Angular Route Page
                if (url.indexOf("?") > -1) {
                    baseUrl = url.substring(0, url.indexOf("?"));
                    params = url.substring(url.indexOf("?") + 1, url.indexOf("#/"));
                    mallHash = url.substring(url.indexOf("#/") + 2, url.length);

                    if (params != "") {
                        paramsArr = params.split("&");
                    }

                    var paramsTemp = [];

                    for (var i = 0; i < paramsArr.length; i++) {
                        paramsTemp = paramsArr[i].split("=");
                        paramsObj[paramsTemp[0]] = paramsTemp[1];
                    }

                    var baseParamArr = baseParam.split("&"),
                        baseParamsObj = {},
                        baseParamsTemp = [];

                    for (var i = 0; i < baseParamArr.length; i++) {
                        baseParamsTemp = baseParamArr[i].split("=");
                        baseParamsObj[baseParamsTemp[0]] = baseParamsTemp[1];
                    }

                    var mergeParams = angular.extend(paramsObj, baseParamsObj);

                    paramsArr = [];

                    for (var key in mergeParams) {
                        paramsArr.push(key + "=" + mergeParams[key]);
                    }

                    params = paramsArr.join("&");

                    url = baseUrl + "?" + params + "#/" + mallHash;
                } else {
                    baseUrl = url.substring(0, url.indexOf("#/"));
                    mallHash = url.substring(url.indexOf("#/") + 2, url.length);
                    url = baseUrl + "#/" + mallHash;
                }
            } else { // 일반 링크
                if (url.indexOf("?") > -1) {
                    baseUrl = url.substring(0, url.indexOf("?"));
                    params = url.substring(url.indexOf("?") + 1, url.length);

                    if (params != "") {
                        paramsArr = params.split("&");
                    }

                    var paramsTemp = [];

                    for (var i = 0; i < paramsArr.length; i++) {
                        paramsTemp = paramsArr[i].split("=");
                        paramsObj[paramsTemp[0]] = paramsTemp[1];
                    }

                    var baseParamArr = baseParam.split("&"),
                        baseParamsObj = {},
                        baseParamsTemp = [];

                    for (var i = 0; i < baseParamArr.length; i++) {
                        baseParamsTemp = baseParamArr[i].split("=");
                        baseParamsObj[baseParamsTemp[0]] = baseParamsTemp[1];
                    }

                    var mergeParams = angular.extend(paramsObj, baseParamsObj);

                    paramsArr = [];

                    for (var key in mergeParams) {
                        paramsArr.push(key + "=" + mergeParams[key]);
                    }

                    params = paramsArr.join("&");

                    url = baseUrl + "?" + params;
                } else {
                    url += baseParam;
                }
            }
            
            return url;
        }

        $scope.goSwipeBnrLink = function (url) {
            window.location.href = kshopBnrChangeURL(url);
        };
    }]);

    /*Route용 Controller*/
    app.controller('KshopPage', ['$scope', '$http', '$location', '$routeParams', '$window', 'LotteCommon', 'LotteUtil', function($scope, $http, $location, $routeParams, $window, LotteCommon, LotteUtil) {
        if($routeParams.curDispNo == undefined) {
            $scope.kShopUI.curDispNo = "";
            $scope.loadCtgData();
            $scope.loadMainData();
        } else {
            $scope.kShopUI.curDispNo = $routeParams.curDispNo;
            $scope.loadCtgData();
            /*세카번호로 조회하면 안되기때문에 카테고리 정보가 로드된 이후 카테고리에서 소카번호 조회후 호출되도록 해야함*/
            /*$scope.loadSubData($scope.kShopUI.curDispNo);*/
        }

        angular.element($window).scrollTop(0);
    }]);

    /*Directive :: KShop 타이틀, 카테고리*/
    app.directive('kshopHeader', [function() {
        return {
            templateUrl: '/lotte/resources_dev/mall/kshop_ctg_container.html',
            replace:true
        };
    }]);

    /*Directive :: KShop 카테고리 슬라이드*/
    app.directive('kshopCtg', ['$window', '$timeout', '$location', function($window, $timeout, $location) {
        return {
            link:function($scope, el, attrs) {
                function kshopSlide(selectIdx) {
                    var $kshopSubHead = angular.element("#kshopSubHead"), /*헤더 Wrapper*/
                        $ksMenu = $kshopSubHead.find("#ksAmenu"),
                        $menuList = $ksMenu.find(">button"), /*상위 카테고리 리스트*/
                        $sideBar = $kshopSubHead.find(".sideBar > img"), /*더보기 그림자*/
                        $subMenu = $kshopSubHead.find(".ksCB"),
                        menuSlide = null, /*슬라이드 Plug-in*/
                        winWidth = angular.element($window).width(), /*윈도우 넓이*/
                        menuWidth = $ksMenu.outerWidth(); /*메뉴 넓이*/

                    /*메뉴 사이드에 그림자 표시*/
                    function setMenuSide() {
                        if (menuWidth < winWidth) {
                            $sideBar.removeClass("on");                        
                        } else if (menuSlide._x() == 0) {
                            $sideBar.filter(".left").removeClass("on");
                            $sideBar.filter(".right").addClass("on");
                        } else if (menuSlide._x() == (winWidth - menuWidth)) {
                            $sideBar.filter(".left").addClass("on");
                            $sideBar.filter(".right").removeClass("on");                 
                        } else {
                            $sideBar.addClass("on");                        
                        }
                    }

                    /*대카 클릭시 메뉴 중앙 위치*/
                    function menuClick(index) {
                        /*가운데 위치 찾기*/ 
                        var $cell = $menuList.eq(index),                
                            targetX = winWidth / 2 - parseInt($cell.position().left + ($cell.outerWidth()) / 2),            
                            mmax = winWidth - menuWidth;

                        if (targetX > 0 || mmax > 0) {
                            menuSlide.setMoveX(0, 300, setMenuSide);
                        } else if (targetX < mmax) {
                            menuSlide.setMoveX(mmax, 300, setMenuSide);
                        } else {
                            menuSlide.setMoveX(targetX, 300, setMenuSide);
                        }

                        /*$timeout에서 scope 값 변경시에는 $apply를 사용하여 변경해주어야함.*/
                        $scope.$apply(function () {
                            if ($scope.kShopUI.curCtgIdx == index && $scope.kShopUI.sCtgLayerOpen) { /*닫기*/
                                $scope.kShopUI.sCtgLayerOpen = false;
                                $scope.kShopUI.curCtgIdx = -1;
                            } else { /*열기*/
                                $scope.kShopUI.sCtgLayerOpen = true;
                                $scope.kShopUI.curCtgIdx = index;
                            }

                            $scope.allSSCtgClose(); /*열려진 소카 전부 닫기*/
                        });
                    }

                    /*초기화*/
                    function init() {
                        /*메뉴 스와이핑 설정*/ 
                        menuSlide = $ksMenu.simpleDrag(function() { /*- EGSlider.js 에선언*/
                            menuSlide.setMoveX(menuSlide.getFlickDist2(0, winWidth - menuWidth, 2.5, 40), 300, setMenuSide);                
                        });

                        setMenuSide(); /*메뉴 사이드에 그림자 표시 확인*/
                        addEvent(); /*이벤트 바인딩*/
                    }

                    function addEvent() {
                        /*rotate 이벤트 등록  - EGSlider.js 에선언*/
                        rotateWindow(function () {
                            winWidth = $(window).width();
                            menuSlide.setX(0);
                            setMenuSide();
                        });

                        $menuList.on("click", function () {
                            menuClick(angular.element(this).index());
                        });
                    }

                    init(); /*최초 실행*/
                };

                $timeout(kshopSlide); /*생성완료 후 실행*/

                /*초기화 후 KShop 메인으로 이동*/
                $scope.goKshopHome = function (e) {
                    $scope.kShopUI.curDispNo = "";
                    $scope.kShopUI.prdFilterCurDispNo = "";
                    $scope.kShopUI.sCtgLayerOpen = false;
                    $scope.kShopUI.curCtgIdx = -1;
                    $scope.kShopUI.curCtgName = "";
                    $scope.kShopUI.curCtgNo = "";
                    $scope.kShopUI.curSCtgIdx = -1;
                    $scope.kShopUI.curSCtgName = "";
                    $scope.kShopUI.curSCtgNo = "";
                    $scope.kShopUI.curSSCtgIdx = -1;
                    $scope.kShopUI.curSSCtgName = "";
                    $scope.kShopUI.curSSCtgNo = "";
                    $scope.kShopUI.ssCtgLayerOpenFlag = false;

                    var tClickStr = "K_LOGO";
                    $scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/

                    $location.path("/");

                    e.preventDefault();
                };

                /*Route Sub 페이지 이동*/
                $scope.goRouteSubPage = function (ctgNo) {
                    $location.path("/" + ctgNo);
                    $scope.kShopUI.sCtgLayerOpen = false; /*이동시 열려진 카테고리 닫기*/
                };

                /*소카테고리 클릭*/
                $scope.sctgClick = function (e, sctg, idx) {
                    if (sctg.ssctgs && sctg.ssctgs.length > 0) { /*세세카테고리가 있다면*/
                        sctg.open = !sctg.open;

                        if (sctg.open) {
                            $scope.kShopUI.curSCtgIdx = idx;
                            $scope.allSSCtgClose(idx);
                        } else {
                            $scope.kShopUI.curSCtgIdx = -1;
                            $scope.allSSCtgClose();
                        }
                    } else { /*마지막 depth라면 카테고리로 이동*/
                        /*$scope.categoryView(sctg.ctg_no, sctg.name);*/
                        $scope.goRouteSubPage(sctg.ctg_no);

                        if ($scope.kShopUI.curCtgIdx > -1 && idx > -1) {
                            var tClickStr = "M_K_CATEGORY_",
                                ctgNo = parseInt($scope.kShopUI.curCtgIdx) + 1,
                                sCtgNo = parseInt(idx) + 1;

                            tClickStr +=  ctgNo + "_" + (sCtgNo < 10 ? "0" + sCtgNo : sCtgNo);

                            $scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
                        }
                    }
                    e.preventDefault(); /*a 링크 이벤트 전파 방지*/
                };

                /*세카테고리 클릭*/
                $scope.ssctgClick = function (e, ssctg, idx) {
                    $scope.goRouteSubPage(ssctg.ctg_no);

                    if ($scope.kShopUI.curCtgIdx > -1 && $scope.kShopUI.curSCtgIdx > -1) {
                        var tClickStr = "M_K_CATEGORY_",
                            ctgNo = parseInt($scope.kShopUI.curCtgIdx) + 1,
                            sCtgNo = parseInt($scope.kShopUI.curSCtgIdx) + 1;

                        tClickStr +=  ctgNo + "_" + (sCtgNo < 10 ? "0" + sCtgNo : sCtgNo);

                        $scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
                    }

                    e.preventDefault(); /*a 링크 이벤트 전파 방지*/
                };
            }
        };
    }]);

    /*세세카 레이어 Directive*/
    app.directive('lyKshop', ['$window', '$location', function ($window, $location) {
        return {
            link : function ($scope, el, attrs) {
                $scope.ctgChange = function (curDispNo) {
                    $location.path("/" + curDispNo);
                    $scope.lyKshopClose();
                };

                $scope.lyKshopClose = function () { /*스마트픽 레이어 닫기*/
                    $scope.kShopUI.ssCtgLayerOpenFlag = false;
                    angular.element("#wrapper").removeClass("overflowy_hidden");
                };
            }
        }
    }]);

    /*KShop Info Directive*/
    app.directive('kshopInfo', ['LotteLink', function (LotteLink) {
        return {
            link : function ($scope, el, attrs) {
                $scope.goOutLink = function (e, url) { /*외부링크*/
                    LotteLink.goOutLink(url);
                    e.preventDefault();
                    return false;
                };
            }
        }
    }])

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl : '/lotte/resources_dev/mall/kshop_main.html',
            controller: 'KshopPage',
            reloadOnSearch : false
        })
        .when('/info', {
            templateUrl : '/lotte/resources_dev/mall/kshop_info.html',
            controller: 'KshopPage',
            reloadOnSearch : false
        })
        .when('/:curDispNo', {
            templateUrl : '/lotte/resources_dev/mall/kshop_sub.html',
            controller: 'KshopPage',
            reloadOnSearch : false
        })
        .otherwise({
            redirectTo:'/'
        });
    }]);

})(window, window.angular);