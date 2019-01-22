(function(window, angular, undefined) {
    'use strict';

    var swipeModule = angular.module('lotteSwipe', []);

    swipeModule.directive('lotteSwipperCont', ['$window', '$timeout', function ($window, $timeout) {
        return {
            link : function ($scope, el, attrs, ctrl) {
                $scope.lotteSwipper = function () {
                    var options = $scope[attrs.lotteSwipperCont];

                    /*필수값 체크*/
                    var opts = angular.extend({
                        containerSelector : ">ul",
                        itemsSelector : ">ul >li",
                        startIdx : 0,
                        duration : "0.5s",
                        swipeRangeRate : 0.2,
                        swipeEndFunc : null,
                    }, options);

                    if (!opts.containerSelector || !opts.itemsSelector) {
                        return false;
                    }

                    /*console.log(options);*/

                    var $win = angular.element(window),
                        $wrapper = el,
                        $container = $wrapper.find(opts.containerSelector),
                        $items = $wrapper.find(opts.itemsSelector),
                        itemLength = $items.length,
                        wrapWidth = $wrapper.width(),
                        wrapHeight = $wrapper.height(),
                        itemWidth = $items.width(),
                        itemHeight = $items.height(),
                        beforeIdx = -1,
                        curIdx = opts.startIdx ? opts.startIdx * 1 : 0,
                        dragFlag = false,
                        dragDirChkFlag = false,
                        swipeFlag = false,
                        durationTime = opts.duration ? opts.duration : "0.5s",
                        tmpTouchStartPosX = 0,
                        tmpTouchPosX = 0,
                        tmpTouchPosY = 0,
                        dragDist = 0,
                        dragDir = 0,
                        swipeRangeRate = opts.swipeRangeRate ? opts.swipeRangeRate * 1 : 0.2,
                        swipeEndFunc = opts.swipeEndFunc ? opts.swipeEndFunc : null,
                        transitionFlag = false;

                    function init() { /*초기화*/
                        setLayout();
                        setIdx(curIdx);
                        addEvent();

                        if (swipeEndFunc != null)
                            swipeEndFunc(beforeIdx, curIdx);
                    }

                    /**
                     * Layout
                     */
                    function setLayout() {
                        $items.attr("style", getTransition(0, 0) + "width:" + wrapWidth + "px"); /*아이템 레이아웃 설정*/
                    }

                    /**
                     * Position
                     */
                    function setPosX(posx) {
                        if (transitionFlag) {
                            return false;
                        }

                        $container.attr("style", getTransition(0, posx + "px"));
                    }

                    function setBeforeIdx(idx, dir) {
                        $items.eq(idx).attr("style", getTransition(0, 0));

                        if (dir < 0) {
                            $items.eq(getNextIdx(idx)).attr("style", getTransition(0, "100%"));
                        } else {
                            $items.eq(getPrevIdx(idx)).attr("style", getTransition(0, "-100%"));
                        }
                    }

                    function setIdx(idx) {
                        if (itemLength > 2) {
                            angular.forEach($items, function (item, index) {
                                if (index == getPrevIdx(idx)) { /*이전*/
                                    $items.eq(index).attr("style", getTransition(0, "-100%"));
                                } else if (index == getNextIdx(idx)) { /*다음*/
                                    $items.eq(index).attr("style", getTransition(0, "100%"));
                                } else if (index == idx) { /*현재*/
                                    $items.eq(index).attr("style", getTransition(0, 0));
                                } else { /*기타*/
                                    $items.eq(index).attr("style", getTransition(0, "200%"));
                                }
                            });
                        } else if (itemLength == 2) {
                            $items.eq(idx).attr("style", getTransition(0, 0));
                            $items.eq(getNextIdx(idx)).attr("style", getTransition(0, "100%"));
                        } else if (itemLength == 1) {
                            $items.attr("style", getTransition(0, 0));
                        }

                        $container.attr("style", getTransition(0, 0));
                        transitionFlag = false;
                    }

                    function setContMovIdx(dir) {
                        var tmpStyle = "";
                        beforeIdx = curIdx;

                        if (dir < 0) { /*다음*/
                            tmpStyle = getTransition(durationTime, "-100%");
                            curIdx = getNextIdx(curIdx);
                            transitionFlag = true;
                        } else if (dir > 0) { /*이전*/
                            tmpStyle = getTransition(durationTime, "100%");
                            curIdx = getPrevIdx(curIdx);
                            transitionFlag = true;
                        } else {
                            tmpStyle = getTransition(durationTime, "0");
                        }

                        $container.attr("style", tmpStyle);
                    }

                    /**
                     * Util
                     */
                    function getTransition(duration, posX) {
                        var returnStyle = "";

                        if (duration != 0) {
                            returnStyle = "-webkit-transform:translate3d(" + posX + ",0,0);transform:translate3d(" + posX + ",0,0);-webkit-transition-property:-webkit-transform;-webkit-transition-duration:" + duration + ";transition-property:transform;transition-duration:" + duration + ";";
                        } else {
                            returnStyle = "-webkit-transform:translate3d(" + posX + ",0,0);transform:translate3d(" + posX + ",0,0);-webkit-transition-property:-webkit-transform;transition-property:transform;";
                        }
                        return returnStyle;
                    }

                    function matrixToArray(str) {
                        return str.match(/(-?[0-9\.]+)/g);
                    }

                    function getPrevIdx(idx) {
                        return idx == 0 ? itemLength - 1 : idx - 1;
                    }

                    function getNextIdx(idx) {
                        return idx == itemLength - 1 ? 0 : idx + 1;
                    }

                    /**
                     * Event
                     */
                    function touchStart(e) {
                        dragFlag = true;
                        dragDir = 0;

                        var point = e.originalEvent.touches[0];
                        tmpTouchPosX = point.clientX;
                        tmpTouchPosY = point.clientY;

                        var matrix = matrixToArray($container.css("transform"));
                        tmpTouchStartPosX = parseInt(matrix[4]);
                    }

                    function touchMove(e) {
                        var point = e.originalEvent.touches[0],
                            dirChk = !dragDirChkFlag ? Math.abs(point.clientY - tmpTouchPosY) < Math.abs(point.clientX - tmpTouchPosX) : true,
                            tmpDragDir = 0;

                        if (dirChk) {
                            dragDirChkFlag = true;
                            e.preventDefault();
                            dragDist = tmpTouchStartPosX + point.clientX - tmpTouchPosX;

                            if (dragDist < 0) {
                                tmpDragDir = -1;
                            } else if (dragDist > 0) {
                                tmpDragDir = 1;
                            } else {
                                tmpDragDir = 0;
                            }

                            if (tmpDragDir != dragDir) {
                                setBeforeIdx(curIdx, tmpDragDir);
                            }

                            tmpDragDir = dragDir;
                            setPosX(dragDist);
                        }
                    }

                    function touchEnd(e) {
                        dragFlag = false;
                        dragDirChkFlag = false;
                        dragDir = 0;

                        if (wrapWidth * swipeRangeRate < Math.abs(dragDist)) {
                            setContMovIdx(dragDist);
                        } else {
                            setContMovIdx(0);
                        }

                        dragDist = 0;
                    }

                    function transitionEnd(e) {
                        setIdx(curIdx);

                        if (swipeEndFunc != null) {
                            swipeEndFunc(beforeIdx, curIdx);
                        }
                    }

                    function winResize(e) {
                        wrapWidth = $wrapper.width();
                        wrapHeight = $wrapper.height();
                        itemWidth = $items.width();
                        itemHeight = $items.height();

                        setLayout();
                        setIdx(curIdx);
                    }

                    function addEvent() { /*Event Binding*/
                        if (itemLength > 1) {
                            $wrapper.on({
                                "touchstart" : touchStart,
                                "touchmove" : touchMove,
                                "touchend" : touchEnd,
                                "prev" : function () { setContMovIdx(1); },
                                "next" : function () { setContMovIdx(-1); }
                            });
                            $container.on("transitionend", transitionEnd);
                        }
                        $win.on("resize", winResize);
                    }

                    init();
                };
            }
        }
    }]);

    swipeModule.directive('lotteSwipperItem', [function () {
        return {
            link : function ($scope, el, attrs) {
                if ($scope.$last === true) {
                    $scope.lotteSwipper();
                }
            }
        }
    }]);
})(window, window.angular);