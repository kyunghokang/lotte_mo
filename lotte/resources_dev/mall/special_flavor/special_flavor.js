(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteProduct',
        'angular-carousel'
    ]);
    app.controller('specialFlavorCtrl', ['$scope', '$http', '$filter', '$location', '$window', '$timeout', 'LotteCommon', 'LotteUtil', 'commInitData', 'LotteStorage', 'LotteUserService','$compile', function($scope, $http, $filter, $location, $window, $timeout, LotteCommon, LotteUtil, commInitData, LotteStorage, LotteUserService, $compile) {  
        $scope.showWrap = true; // 컨텐츠 표시 Flag
        $scope.contVisible = true; // 컨텐츠 표시 Flag
        $scope.subTitle = "특별한 맛남"; //서브헤더 타이틀
        $scope.pageLoading = true; // 페이지 로딩중 여부 Flag
        $scope.productMoreScroll = true; // 페이지 더 불러오기 가능 여부 Flag
        $scope.productListLoading = false; // 페이지 더 불러오기 로딩중 Flag
        $scope.winWidth = angular.element($window).width();

        angular.element($window).on("resize orientationchange", function (e) {
            $scope.winWidth = angular.element($window).width();
        });

        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function () {
            $scope.screenData = {
                pageEnd: false,
                disp_name: "특별한맛남",
                top_banner_list:[], // 상단 스와이프 배너
                tab_list:[], // 카테고리 탭
                deal_banner_list:[], // 상품 배너
                product_deal_list:[], // 상품
                bannerMixContents: [] // [deal] 딜 배너, 상품 믹스 리스트
            }
            $scope.top_banner=[];
        })();

        $scope.productChkList = { // 탭 클릭시 부분 갱신할 데이터
            deal_banner_list:[], // 상품 배너
            product_deal_list:[], // 상품
            bannerMixContents: [] // [deal] 딜 배너, 상품 믹스 리스트
        };


        // 화면 옵션에 UI 설정값 및 옵션에 대한 초기화
        $scope.optionDataReset = function () {
            $scope.storedData = {}; // Object형태로 초기 선언을 해야 Array로 생성되는 것을 필할 수 있다.
            $scope.pageOptions = {
                page: 0,
                dispNo: 5553043,
                opt_dispno: Math.floor(Math.random() * 4),
                pageSize: 15,
                mixed_idx: 0
            }
        }();

        $scope.productOnlyNumberKey = [ // 숫자형태가 되어야 하는 키값
            "discounted_price",
            "original_price",
            "pmg_gdas_cnt",
            "price",
            "price1",
            "price2",
            "review_count",
            "saleCnt",
            "sale_cnt",
            "sale_rate"
        ];

        $scope.joinBannerContent = function (idx, bannerData, rnkKey, page) { // 상품과 배너 믹스 형태 처리
            var rtnArr = null;

            if (page == undefined || page == 0) {
                $scope.pageOptions.mixed_idx = 0;
            }

            try {
                var i = 0,
                    bannerTemp = [];

                for (i = $scope.pageOptions.mixed_idx; i < bannerData.length; i++) {
                    if (bannerData[i][rnkKey] == idx || (bannerData[i][rnkKey] == 0 && idx == 1)) {
                        $scope.pageOptions.mixed_idx = i;
                        bannerTemp.push(angular.extend({bannerIdx: i, bannerPrioriry: bannerData[i][rnkKey]}, bannerData[i])); // 배너 우선순위 공통 Key 지정
                    }
                }

                if (bannerTemp.length > 1) {
                    rtnArr = {isSwipe: true, items: bannerTemp};
                } else if (bannerTemp.length == 1) {
                     bannerTemp[0].isBanner = true;
                    rtnArr = bannerTemp[0];
                }
            } catch(e) {
                console.log('Error::checkBanner');
            }

            return rtnArr;
        };

        $scope.resetLoading = function () { // 로딩바와 스와이프 초기화
            $scope.pageLoading = false;
            $scope.productListLoading = false;
            $scope.$parent.LotteSuperBlockStatus = false;
        };

        /*
         * 스크린 데이터 로드
         */
        $scope.loadScreenData = function (params) {
            $scope.$parent.LotteSuperBlockStatus = true;

            if (params.page != undefined) { // 탭 클릭시 page 변수 교체
                $scope.pageOptions.page = params.page;
            }

            $scope.pageOptions.page++;
            $scope.productListLoading = true;

            if (params.page == undefined) { // 페이지 초기 인입시 페이지 로딩
                $scope.pageLoading = true;
            }

            if ($scope.screenData.pageEnd) { // 상품 로드가 끝났는지의 여부 체크
                $scope.resetLoading(); // 로딩 초기화
                return true;
            }

            $http.get(LotteCommon.specialMallMain+'?dispNo='+$scope.pageOptions.dispNo+'&opt_dispno='+$scope.pageOptions.opt_dispno+'&page='+$scope.pageOptions.page+"&rowsPerPage=" + $scope.pageOptions.pageSize)
            .success(function(data) {
                var contents = [];

                if(data['max'] != undefined) {
                    contents = data['max'];

                    // 넘어온 데이터가 더이상 없는 경우처리
                    if (!contents.product_deal_list.items.length) {
                        $scope.screenData.pageEnd = true;
                        $scope.productMoreScroll = false;
                        return;
                    }

                    if (params.page == undefined) { // 페이지 초기 인입시 초기화
                        $scope.screenData.top_banner_list = contents.top_banner_list.items;
                        $scope.top_banner=$scope.screenData.top_banner_list;
                        $scope.screenData.tab_list = contents.tab_list.items;
                        $scope.screenData.deal_banner_list = contents.deal_banner_list.items;
                        $scope.screenData.product_deal_list = contents.product_deal_list.items;
                    } else if (params.page == 0) { // 탭클릭 인입시 초기화
                        $scope.screenData.deal_banner_list = contents.deal_banner_list.items;
                        $scope.screenData.product_deal_list = contents.product_deal_list.items;
                    } else { // 상품 더불러오기 일 경우 데이터 concat
                        if (contents.deal_banner_list != null) { // 배너가 더 있을 경우만 추가
                            $scope.screenData.deal_banner_list = $scope.screenData.deal_banner_list.concat(contents.deal_banner_list.items);
                        }
                        $scope.screenData.product_deal_list = $scope.screenData.product_deal_list.concat(contents.product_deal_list.items);
                    }

                    // 유닛 & 배너 조합
                    var mixDataTemp = [], // 배너/상품 조합 후 임시로 담을 변수
                        sidx = ($scope.pageOptions.page - 1) * $scope.pageOptions.pageSize, // 배너 조합 시작 인덱스 지정 (page에 따라 시작 위치 조정)
                        bannerContent = $scope.screenData.deal_banner_list, // 배너 데이터
                        productContent = $scope.screenData.product_deal_list, // 상품 데이터
                        bannerIndexKey = 'mrk_rnk', // 배너 우선순위 키값 지정
                        eidx = productContent.length, // 로프 완료 인덱스 지정
                        addItem = null,
                        i = 0,
                        j = 0; // 배너 index (tclick 시 사용)


                    if (params.partContents) { // 부분 데이터 갱신일 경우
                        $scope.loopData = angular.copy($scope.productChkList);
                    } else { // 전체 데이터 갱신일 경우
                        $scope.loopData = angular.copy($scope.screenData);
                    }

                    // loopData 기준의 키값에 해당 하는 데이터 담기
                    angular.forEach($scope.loopData, function (val, key) {
                        if (contents[key] != undefined) { // 갱신 데이터가 존재할 경우에만 처리
                            for (var i = 0; i < contents[key]['items'].length; i++) {
                                angular.forEach(contents[key]['items'][i], function (itemVal, itemKey) {
                                    if ($scope.productOnlyNumberKey.indexOf(itemKey) > -1) { // 숫자형태여야 하는 데이터가 숫자형태가 아닌 걍우 데이터를 숫자형태로 변경
                                        contents[key]['items'][i][itemKey] = parseInt((itemVal + "").replace(/\,/gi, ""));
                                    }
                                });
                            }
                        }
                    });


                    for (i = sidx; i < eidx; i++) { // 루프 돌면서 배너 우선순위에 따라 배열 조합
                        addItem = $scope.joinBannerContent(i + 1, bannerContent, bannerIndexKey, params.page); // 우선순위에 맞는 배너 구하기
                        if (addItem) { // 우선순위에 맞는 배너가 있을 경우 배열에 추가
                            mixDataTemp.push(addItem);
                        }

                        productContent[i].isProduct = true; // 상품인지 여부 Flag 설정
                        productContent[i].pIdx = i; // 상품에대한 Index 따로 부여
                        mixDataTemp.push(productContent[i]); // 조합 배열에 상품 추가
                    }

                    if (params.page == undefined || params.page == 0) { // 처음로드하거나, 탭클릭으로 변경시
                        $scope.screenData.bannerMixContents = mixDataTemp;
                    }else { //상품 더 불러오기일 경우 믹스데이터 concat
                        $scope.screenData.bannerMixContents = $scope.screenData.bannerMixContents.concat(mixDataTemp);
                    }

                }
            })
            .error(function(data){
                console.log('Error Data : 데이터 로딩 에러');
            })
            .finally(function (data) {
                $scope.resetLoading();
            });
        }

        // sessionStorage - 세션에서 가저올 부분 선언
        var specialFlavorLoc = LotteStorage.getSessionStorage('specialFlavorLoc');
        var specialFlavorDataStr = LotteStorage.getSessionStorage('specialFlavorData');
        var specialFlavorScrollY = LotteStorage.getSessionStorage('specialFlavorScrollY');

        if (specialFlavorLoc == window.location.href && specialFlavorDataStr != null && commInitData.query["localtest"] != "true") { // 세션데이터 있을 경우 갱신하기
            var specialFlavorData = JSON.parse(specialFlavorDataStr);

            $scope.storedData = specialFlavorData.storedData; // 저장 데이터 갱신
            $scope.pageOptions = specialFlavorData.pageOptions; // 페이지 옵션값 갱신
            $scope.screenData = $scope.storedData; // 화면 데이터 갱신
            $scope.top_banner=$scope.screenData.top_banner_list;
            $scope.pageLoading = false;

            $timeout(function () {
                angular.element($window).scrollTop(specialFlavorScrollY);
            }, 800);
        } else {
            $scope.loadScreenData({ dispNo: $scope.pageOptions.dispNo });
        }

        // unload시 관련 데이터를 sessionStorage에 저장
        angular.element($window).on('unload', function(e) {
            var sess = {}; // session 초기화

            sess.storedData = angular.copy($scope.screenData);
            sess.pageOptions = $scope.pageOptions; // 페이지 설정값 데이터

            LotteStorage.setSessionStorage('specialFlavorLoc', $location.absUrl());
            LotteStorage.setSessionStorage('specialFlavorData', sess, 'json');
            LotteStorage.setSessionStorage('specialFlavorScrollY', angular.element($window).scrollTop());
        });
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mall/special_flavor/special_flavor_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.opt_dispno = $scope.pageOptions.opt_dispno ? $scope.pageOptions.opt_dispno : 0; // 명절 탭 랜덤으로 가져오기
                $scope.tab_idx = $scope.opt_dispno;
                $scope.tabMenu = function (id) {
                    $scope.tab_idx = id;
                    $scope.screenData.pageEnd = false;
                    $scope.opt_dispno = id; // 명절 카테고리 데이터 지정
                    $scope.pageOptions.opt_dispno = $scope.opt_dispno; // 클릭한 카테고리 id 세션데이터도 갱신
                    $scope.screenData.bannerMixContents = [];
                    $scope.loadData(); // 데이터 로드
                    $scope.sendTclick("m_SpecialFood_TAB_0" + (id + 1));
                    return false;
                };

                $scope.loadData = function () { // 카테고리 데이터 로드
                    $scope.pageOptions.page = 1; // 옵션이나 카테고리 변경일때만 loadData를 호출하기 때문에 페이지를 Default 1로 설정
                    $scope.productMoreScroll = true; // 상품 페이징 기능 활성화

                    var params = {
                        partContents: true,
                        opt_dispno: $scope.opt_dispno, // 카테고리
                        page: 0
                    };

                    $scope.loadScreenData(params);
                };

                $scope.getProductData = function () { // 상품 페이지 로드
                    var params = {
                        partContents: true,
                        opt_dispno: $scope.opt_dispno, // 카테고리
                        page: +$scope.pageOptions.page
                    };

                    $scope.loadScreenData(params);
                };
                
                $scope.specialFlavorBannerClick = function(link, outLink, tclick) {
                    var linkUrl = link;
                    if (outLink) {
                        $scope.sendOutLink(link); // 외부 링크 보내기 (새창)

                        if (tclick) { // tclick이 있다면
                            $scope.sendTclick(tclick); // 외부링크일때 iframe으로 tclick 전송
                        }
                    } else {
                        if (tclick) { // tclick 이 있다면 url 뒤에 parameter를 추가한다.
                            linkUrl += "&tclick=" + tclick + '&' + $scope.baseParam;
                        }
                        window.location.href = linkUrl;
                    }
                }
            }
        };
    });

})(window, window.angular);