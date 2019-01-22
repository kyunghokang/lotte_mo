(function(window, angular, undefined) {
    'use strict';

    var listModule = angular.module('lotteList', []);

    listModule.directive('listHeader', [function(){
        return {
            templateUrl:'/lotte/resources_dev/list/list_ctg_viewtype.html',
            replace:true,
            link:function($scope) {
                /*console.log($scope.divNum);
                var thisWatcher = $scope.$watch('divNum', function() {
                    console.log($scope.divNum);
                });*/
            }
        };
    }]);

    listModule.directive('unitViewType', ['$location', 'planLoc', '$window', '$timeout', function($location, planLoc, $window, $timeout) { // 20150721 박형윤 -  $window 추가
        return {
            link:function($scope, el, attrs){
                /*뷰타입 리스트 open*/
                $scope.openViewTypeList = function(){
                    var $el = angular.element('#vtypeLst');
                    if($el.hasClass('on')) $el.removeClass('on');
                    else $el.addClass('on');
                };

                /*뷰타입 변경*/
                $scope.changeViewType = function(vt){
                    if(vt=='sw') {
                        $scope.showSmartWindow();
                        return false;
                    }
                    $scope.srhObj.imgListGbn = vt;
                    angular.element('#vtypeLst').removeClass('on');
                    planLoc.updateLocation($scope);
                    angular.element($window).scrollTop(angular.element("#prdLst").offset().top - 45); // 20150721 박형윤 - 스크롤 위치 맞춤
                };

                /*스마트윈도우 열기*/
                $scope.showSmartWindow = function() {
                    $scope.showWrap = false;
                    $scope.showSmartWin = true;
                    angular.element('#vtypeLst').removeClass('on');
                };
                
                /*스마트윈도우 닫기*/
                $scope.hideSmartWindow = function() {
                    $scope.showWrap = true;
                    $scope.showSmartWin = false;

                    /*console.log(angular.element("#prdLst").length);*/

                    if (angular.element("#prdLst").length > 0) {
                        $timeout(function () {
                            angular.element($window).scrollTop(angular.element("#prdLst").offset().top); // 20150721 박형윤 - 스크롤 위치 맞춤
                        }, 100);
                    }
                };

                /*구분자 변경*/
                $scope.changeDivObj = function() {
                    /*console.log('changeDivObj')*/
                    $scope.srhObj.divNum = $scope.divNum.divObjNo;
                    $scope.srhObj.page = 1;
                    $scope.loadData();
                    /* select 선택시 화면 이동 */
                    var listOffsetTop = document.querySelector('#prdLst').offsetTop - 90;    
                    document.querySelector('body').scrollTop = listOffsetTop;          
                };
            }
        };
    }]);

    listModule.directive('moreBtn', [function(){
        return {
            templateUrl:'/lotte/resources_dev/list/more_view_btn.html',
            replace:true,
            link:function($scope) {
                /*더보기 클릭*/
                $scope.clickMoreView = function() {
                    $scope.srhObj.page ++;
                    $scope.isShowLoading = true;
                    $scope.loadData();
                };
            }
        };
    }]);

    listModule.directive('lotteSmartwindow', [function(){
        return{
            templateUrl:'/lotte/resources_dev/list/smart_window.html',
            replace:true,
            link:function($scope, $el, attrs){
        		$scope.$watch(function(){
        			if(! $scope.appObj.isApp){
        				angular.element('.prd_info_wrap').css("bottom","50px");
        			}
        		});
            }
        };
    }]);

    listModule.directive('shoppingWindow', ['$window', function($window){
        return function($scope, $el, attrs){
            var swWatcher, winWd, winHt;

            swWatcher = $scope.$watch('showSmartWin', function(){
                if($scope.showSmartWin!=undefined){
                    if($scope.showSmartWin) {
                        $scope.lotteSmartWindow();
                    } else {
                        $scope.cntIdx = 0;
                        $scope.showNextBtn = false;
                        $scope.swItems = null;
                        $scope.swDrag.setMoveX(0, 0, function(){});
                        $scope.swDrag = undefined;
                    }
                }
            });

            winWd = $window.innerWidth;
            winHt = $window.innerHeight;
            $scope.cntIdx = 0;

            $scope.lotteSmartWindow = function() {
                var $box = $el.find('ul.product-container'),
                      $item = $box.find('li.product-ct'),
                      $nav = $el.find('nav.nav'),
                      $btn_prev = $el.find('nav.nav > span.prev > a'),
                      $btn_next = $el.find('nav.nav > span.next > a');

                if($scope.cntIdx < $scope.contents.prdList.totalCnt) {
                    $scope.showNextBtn = true;
                }

                $scope.swItems = $scope.contents.prdList.items.slice($scope.cntIdx, 3);

                $item.width(winWd);
                $box.width(winWd * $scope.swItems.length);

                if(winHt > 590) {
                    if(winWd > 550) {
                        $nav.css('top', 315);
                    }else{
                        $nav.css("top", winWd / 2 - 25);
                    }
                } else {
                    $nav.css("top", (winHt - 110) / 2 + 40);
                }

                $scope.swDrag = $box.simpleDrag(function() {
                    var mx = $scope.swDrag._x(),
                          dir = $scope.swDrag._dir();
                    
                    if($scope.cntIdx == 0 && mx > 0) {
                        $scope.swDrag.setMoveX(0, 300, function(){});
                    } else {
                        if(dir == 0) { /*right*/
                            if(!$scope.showNextBtn) {
                                $scope.swDrag.setMoveX(-winWd, 300, function(){});
                            } else {
                                $scope.nextPrd();
                            }
                        } else if( dir == 1) { /*left*/
                            $scope.prevPrd();
                        }
                    }
                });
            };

            $scope.prevPrd = function(){
                /*console.log('prevPrd', $scope.cntIdx, $scope.contents.prdList.totalCnt);*/
                $scope.swDrag.setMoveX(0, 300, function() {
                    $scope.cntIdx -= 1;
                    $scope.$apply();
                    if($scope.cntIdx > 0) {
                        $scope.changeSwItems();
                        $scope.swDrag.setMoveX(-winWd, 0, function(){});
                    }

                    if($scope.cntIdx < $scope.contents.prdList.totalCnt) {
                        $scope.showNextBtn = true;
                        $scope.$apply();
                    }
                });
            };

            $scope.nextPrd = function() {
                /*console.log('nextPrd', $scope.cntIdx, $scope.contents.prdList.totalCnt);*/
                var mx = -winWd;
                if($scope.cntIdx != 0) {
                    mx = -winWd * 2;
                }
                $scope.swDrag.setMoveX(mx, 300, function() {
                    $scope.cntIdx += 1;
                    $scope.$apply();

                    if($scope.contents.prdList.totalCnt > $scope.contents.prdList.items.length && $scope.cntIdx+6  == $scope.contents.prdList.items.length){
                        $scope.clickMoreView();
                    }else if($scope.cntIdx + 1 == $scope.contents.prdList.totalCnt) {
                        $scope.showNextBtn = false;
                    }

                    if($scope.cntIdx > 1) {
                        $scope.changeSwItems();
                        $scope.swDrag.setMoveX(-winWd, 0, function(){});
                    }
                });
            };

            $scope.changeSwItems = function() {
                $scope.swItems = [];
                $scope.swItems = $scope.contents.prdList.items.slice($scope.cntIdx-1, $scope.cntIdx+2);
                $scope.$apply();
            };

            $scope.clickUnit = function(idx) {
                $scope.productView($scope.swItems[idx]);
            };
        };
    }]);

})(window, window.angular);