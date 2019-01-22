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
    app.controller('TenbytenCtrl', ['$scope', '$http', 'LotteCommon', '$location', function($scope, $http, LotteCommon, $location) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "텐바이텐"; /*서브헤더 타이틀*/

        /*UI Scope*/
        $scope.sshopUI = {
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
        
        var tenbytenData = "/lotte/resources_dev/data/tenbyten/tenbytenData.html";

        /**
         * Data Load Scope Func
         */
        /*카테고리 데이터 로드  LotteCommon.tenbytenCtgData, {withCredentials:false}   ==> , {withCredentials:false}  삭제*/
        $scope.loadCtgData = function() {
            if ($scope.ctgData == undefined) {
                $http.get(tenbytenData, {withCredentials:false})
                .success(function(data) {
                    $scope.ctgData = data.max.cate_list;
                    $scope.findCurDispNoDepth($scope.sshopUI.curDispNo); /*서브 카테고리 번호로 카테고리 찾기*/
                    //console.log($scope.ctgData.items[0].disp_nm ) ;
                })
                .error(function() {
                    console.log('Data Error : tenbyten 데이터' );
                });
            } else {
                $scope.findCurDispNoDepth($scope.sshopUI.curDispNo); /*서브 카테고리 번호로 카테고리 찾기*/
            }
        };

        /*tenbyten 메인 데이터 로드*/
        $scope.loadMainData = function() {
            if($scope.mainData == undefined) {
                $http.get(tenbytenData, {withCredentials:false} )
                .success(function(data){
                    $scope.mainData = data.max;
                    $scope.focusData = data.max.focus_on_prod_list;
                    $scope.newData = data.max.new_arrival_prod_list;
                    $scope.bestData = data.max.best_seller_prod_list;
                    
                    console.log($scope.focusData) ;
                    
                    if (data.max.top_banner_list.items) {
                        $scope.swipeBanner = data.max.top_banner_list.items;
                        //console.log($scope.swipeBanner) ;
                    }
                    
                })
                .error(function() {
                    console.log('Data Error : tenbyten 메인페이지 데이터');
                });
            }
        };

        /* tenbyten 서브페이지(소카,세카) 데이터 로드*/
        $scope.loadSubData = function(dispNo) {
            console.log('loadSubData');
            var rowsPerPage = 50000, /*한페이지당 갯수*/
                pageIdx = 1; /*페이지 Index*/
            $http.get(tenbytenSubData, {params:{curDispNo:dispNo, pageIdx : pageIdx, rowsPerPage : rowsPerPage}, withCredentials:false})
            .success(function(data) {
                $scope.subData = data;
            })
            .error(function() {
                console.log('Data Error : tenbyten 서브페이지 데이터');
            });
        };

        /**
         * Util Scope Func
         */
        /*소카 전부 닫기*/
        $scope.allSSCtgClose = function (sCtgIdx) {
            if ($scope.sshopUI.curCtgIdx > -1) {
                var targetNode = $scope.ctgData.items[$scope.sshopUI.curCtgIdx].sub_cate_list,
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
            if (curDispNo &&curDispNo != "" && $scope.ctgData && $scope.ctgData.items && $scope.ctgData.items.length > 0) {
                var ctgIdx = 0,
                    sCtgIdx = 0,
                    ssCtgIdx = 0;

                for (ctgIdx= 0; ctgIdx < $scope.ctgData.items.length; ctgIdx++) {
                    if ($scope.ctgData.items[ctgIdx].sub_cate_list && $scope.ctgData.items[ctgIdx].sub_cate_list.length > 0) {
                        for (sCtgIdx = 0; sCtgIdx < $scope.ctgData.items[ctgIdx].sub_cate_list.length; sCtgIdx++) {
                            if ($scope.ctgData.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list && $scope.ctgData.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list.length > 0) {
                                for (ssCtgIdx = 0; ssCtgIdx < $scope.ctgData.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list.length; ssCtgIdx++) {
                                    if ($scope.ctgData.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list[ssCtgIdx].disp_no == curDispNo) {
                                        $scope.selectCurDispCtg(ctgIdx, sCtgIdx, ssCtgIdx); /*세카에서 맵핑될경우*/
                                        
                                        if (ssCtgIdx == 0) {
                                            $scope.sshopUI.sCtgBnrShowFlag = true;
                                        } else {
                                            $scope.sshopUI.sCtgBnrShowFlag = false;
                                        }
                                        return false;
                                    }
                                }
                            }
                            /*세카가 없을 경우에만 소카에서 맵핑 확인*/
                            else if (!$scope.ctgData.items[ctgIdx].sub_cate_list[sCtgIdx].sub_cate_list && $scope.ctgData.items[ctgIdx].sub_cate_list[sCtgIdx].disp_no == curDispNo) {
                                $scope.selectCurDispCtg(ctgIdx, sCtgIdx); /*소카에서 맵핑될경우*/
                                $scope.sshopUI.sCtgBnrShowFlag = true;
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
            $scope.sshopUI.curCtgName = "";
            $scope.sshopUI.curSCtgName = "";
            $scope.sshopUI.curSSCtgName = "";

            $scope.sshopUI.curCtgIdx = curCtgIdx;
            $scope.sshopUI.curCtgName = $scope.ctgData.items[curCtgIdx].disp_nm;
            $scope.sshopUI.curCtgNo = $scope.ctgData.items[curCtgIdx].disp_no;

            $scope.sshopUI.curSCtgIdx = curSCtgIdx;
            $scope.sshopUI.curSCtgName = $scope.ctgData.items[curCtgIdx].sub_cate_list[curSCtgIdx].disp_nm;
            $scope.sshopUI.curSCtgNo = $scope.ctgData.items[curCtgIdx].sub_cate_list[curSCtgIdx].disp_no;

            if (curSSCtgIdx != null) {
                $scope.sshopUI.curSSCtgIdx = curSSCtgIdx;
                $scope.sshopUI.curSSCtgName = $scope.ctgData.items[curCtgIdx].sub_cate_list[curSCtgIdx].sub_cate_list[curSSCtgIdx].disp_nm;
                $scope.sshopUI.curSSCtgNo = $scope.ctgData.items[curCtgIdx].sub_cate_list[curSCtgIdx].sub_cate_list[curSSCtgIdx].disp_no;

                $scope.sshopUI.ssCtgList = $scope.ctgData.items[curCtgIdx].sub_cate_list[curSCtgIdx].sub_cate_list;
            } else {
                $scope.sshopUI.curSSCtgIdx = -1;
                $scope.sshopUI.ssCtgList  = [];
            }

            /*카테고리 선택 활성화 후 처리*/
            /*해당 카테고리가 속한 소카 번호로 카테고리 데이터 요청*/
            if ($scope.sshopUI.curSCtgNo && $scope.sshopUI.curSCtgNo != "") {
                $scope.loadSubData($scope.sshopUI.curDispNo);
            }
        };

        /*소카 클릭*/
        $scope.tenbytenSctgClick = function (curDispNo) {
            $location.path("/" + curDispNo);
        };

        /*세카 (셀렉트박스형) 버튼 클릭*/
        $scope.tenbytenSsctgClick = function () {
            $scope.sshopUI.ssCtgLayerOpenFlag = true;
            angular.element("#wrapper").addClass("overflowy_hidden");
        };

        $scope.mainPdtTclickIdx = function (ctgIdx, itemIdx) {
            var rtnTclick = ctgIdx * 2 + (itemIdx + 1);

            rtnTclick = (rtnTclick < 10) ? "0" + rtnTclick : rtnTclick;
            return "M_K_PRD_" + rtnTclick;
        }
    }]);

    /*Route용 Controller*/
    app.controller('SshopPage', ['$scope', '$http', '$location', '$routeParams', '$window', 'LotteCommon', 'LotteUtil', function($scope, $http, $location, $routeParams, $window, LotteCommon, LotteUtil) {
        if($routeParams.curDispNo == undefined) {
            $scope.sshopUI.curDispNo = "";
            $scope.loadCtgData();
            $scope.loadMainData();
        } else {
            $scope.sshopUI.curDispNo = $routeParams.curDispNo;
            $scope.loadCtgData();
        }

        angular.element($window).scrollTop(0);
    }]);

    /*Directive :: tenbyten 타이틀, 카테고리*/
    app.directive('tenbytenHeader', [function() {
        return {
            templateUrl: '/lotte/resources_dev/tenbyten/tenbyten_ctg_container.html',
            replace:true
        };
    }]);

    /*Directive :: tenbyten 카테고리 슬라이드*/
    app.directive('tenbytenCtg', ['$window', '$timeout', '$location', function($window, $timeout, $location) {
        return {
            link:function($scope, el, attrs) {
                function sshopSlide(selectIdx) {
                    var $tenbytenSubHead = angular.element("#tenbytenSubHead"), /*헤더 Wrapper*/
                        $ksMenu = $tenbytenSubHead.find("#ksAmenu"),
                        $menuList = $ksMenu.find(">button"), /*상위 카테고리 리스트*/
                        $sideBar = $tenbytenSubHead.find(".sideBar > img"), /*더보기 그림자*/
                        $subMenu = $tenbytenSubHead.find(".ksCB"),
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
                            if ($scope.sshopUI.curCtgIdx == index && $scope.sshopUI.sCtgLayerOpen) { /*닫기*/
                                $scope.sshopUI.sCtgLayerOpen = false;
                                $scope.sshopUI.curCtgIdx = -1;
                            } else { /*열기*/
                                $scope.sshopUI.sCtgLayerOpen = true;
                                $scope.sshopUI.curCtgIdx = index;
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

                $timeout(sshopSlide); /*생성완료 후 실행*/

                /*초기화 후 tenbyten 메인으로 이동*/
                $scope.goSshopHome = function (e) {
                    $scope.sshopUI.curDispNo = "";
                    $scope.sshopUI.prdFilterCurDispNo = "";
                    $scope.sshopUI.sCtgLayerOpen = false;
                    $scope.sshopUI.curCtgIdx = -1;
                    $scope.sshopUI.curCtgName = "";
                    $scope.sshopUI.curCtgNo = "";
                    $scope.sshopUI.curSCtgIdx = -1;
                    $scope.sshopUI.curSCtgName = "";
                    $scope.sshopUI.curSCtgNo = "";
                    $scope.sshopUI.curSSCtgIdx = -1;
                    $scope.sshopUI.curSSCtgName = "";
                    $scope.sshopUI.curSSCtgNo = "";
                    $scope.sshopUI.ssCtgLayerOpenFlag = false;

                    var tClickStr = "K_LOGO";
                    $scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/

                    $location.path("/");

                    e.preventDefault();
                };

                /*Route Sub 페이지 이동*/
                $scope.goRouteSubPage = function (ctgNo) {
                    $location.path("/" + ctgNo);
                    $scope.sshopUI.sCtgLayerOpen = false; /*이동시 열려진 카테고리 닫기*/
                };

                /*소카테고리 클릭*/
                $scope.sctgClick = function (e, sctg, idx) {
                    if (sctg.sub_cate_list && sctg.sub_cate_list.length > 0) { /*세세카테고리가 있다면*/
                        sctg.open = !sctg.open;

                        if (sctg.open) {
                            $scope.sshopUI.curSCtgIdx = idx;
                            $scope.allSSCtgClose(idx);
                        } else {
                            $scope.sshopUI.curSCtgIdx = -1;
                            $scope.allSSCtgClose();
                        }
                    } else { /*마지막 depth라면 카테고리로 이동*/
                        /*$scope.categoryView(sctg.disp_no, sctg.disp_nm);*/
                        $scope.goRouteSubPage(sctg.disp_no);

                        if ($scope.sshopUI.curCtgIdx > -1 && idx > -1) {
                            var tClickStr = "M_K_CATEGORY_",
                                ctgNo = parseInt($scope.sshopUI.curCtgIdx) + 1,
                                sCtgNo = parseInt(idx) + 1;

                            tClickStr +=  ctgNo + "_" + (sCtgNo < 10 ? "0" + sCtgNo : sCtgNo);

                            $scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
                        }
                    }
                    e.preventDefault(); /*a 링크 이벤트 전파 방지*/
                };

                /*세카테고리 클릭*/
                $scope.ssctgClick = function (e, ssctg, idx) {
                    $scope.goRouteSubPage(ssctg.disp_no);

                    if ($scope.sshopUI.curCtgIdx > -1 && $scope.sshopUI.curSCtgIdx > -1) {
                        var tClickStr = "M_K_CATEGORY_",
                            ctgNo = parseInt($scope.sshopUI.curCtgIdx) + 1,
                            sCtgNo = parseInt($scope.sshopUI.curSCtgIdx) + 1;

                        tClickStr +=  ctgNo + "_" + (sCtgNo < 10 ? "0" + sCtgNo : sCtgNo);

                        $scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
                    }

                    e.preventDefault(); /*a 링크 이벤트 전파 방지*/
                };
            }
        };
    }]);

    /*세세카 레이어 Directive*/
    app.directive('lyTenbyten', ['$window', '$location', function ($window, $location) {
        return {
            link : function ($scope, el, attrs) {
                $scope.ctgChange = function (curDispNo) {
                    $location.path("/" + curDispNo);
                    $scope.lyTenbytenClose();
                };

                $scope.lyTenbytenClose = function () { /*스마트픽 레이어 닫기*/
                    $scope.sshopUI.ssCtgLayerOpenFlag = false;
                    angular.element("#wrapper").removeClass("overflowy_hidden");
                };
            }
        }
    }]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl : '/lotte/resources_dev/tenbyten/tenbyten_main.html',
            controller: 'SshopPage',
            reloadOnSearch : false
        })
        .when('/:curDispNo', {
            templateUrl : '/lotte/resources_dev/tenbyten/tenbyten_sub.html',
            controller: 'SshopPage',
            reloadOnSearch : false
        })
        .otherwise({
            redirectTo:'/'
        });
    }]);

})(window, window.angular);