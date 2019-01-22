(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteProduct',
        'lotteNgSwipe'
    ]);

    app.controller('smartpickCtrl', ['$scope', '$http', '$filter', '$location', '$window', '$timeout', 'LotteCommon', 'LotteUtil', 'commInitData', 'LotteStorage', 'LotteUserService','$compile', function($scope, $http, $filter, $location, $window, $timeout, LotteCommon, LotteUtil, commInitData, LotteStorage, LotteUserService, $compile) { 
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.ctgDispNo = "5539740"; // 카테고리 번호
        $scope.curDispNo = $scope.ctgDispNo; // 카테고리 번호(상품상세 이동시 인입 코드 전달 위해)
        $scope.curDispNoSctCd = "64"; // 전시 인입 코드(상품상세 이동시 인입 코드 전달 위해)
        $scope.subTitle = "스마트픽"; // 서브헤더 타이틀
        $scope.pageLoading = true; // 페이지 로딩 Flag
        $scope.productListLoading = false; // 페이지 더 불러오기 로딩중 Flag
        $scope.productMoreScroll = true; // 페이지 더 불러오기 가능 여부 Flag
        $scope.winWidth = angular.element($window).width(); // 윈도우 넓이

        $scope.productListItemKey = [ // 상품리스트 키값
            "prd_deal_list"
        ];

        // 숫자형태가 되어야 하는 키값
        $scope.productOnlyNumberKey = [ 
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

        // 반응형을 위한 윈도우 넓이 계산
        angular.element($window).on("resize.main orientationchange.main", function (e) { 
            $scope.winWidth = angular.element($window).width();
        });

        // 콘텐츠 데이터의 데이터 정의 초기화
        $scope.screenDataReset = function () { 
            $scope.productMoreScroll = true; // 상품 리스트 페이징 가능 여부
            $scope.screenData = {
                // 리스트 페이지 관련
                page: 0, // 현재 페이지 Index
                pageSize: 15, // 한페이지당 아이템 개수
                listTotal: 0, // 총 리스트 개수
                pageEnd: false, // 마지막 페이지 체크 Flag
                reward_banner: {}, // 카드구매사은 배너
                deal_banners: [], // 딜 배너 가공 (구매사은 배너 제외)
                mix_banner: false, // [common] 배너와 상품 MIX 노출 여부 (우선순위에 따라)
                mixed_pos: 0,
                bannerMixContents: [], // [deal] 딜 배너, 상품 믹스 리스트
                ban_list: [], // [deal] 배너 리스트
                mrk_rnk: [], // [deal] 딜 상품 리스트
                prd_deal_list: [] // [deal] 딜 상품 리스트
            };
        };

        // 메인 탭 데이터 URL / Parameter 정의
        $scope.getThemaDataUrl = function (params) {
            var url = LotteCommon.smartpickData + "?";; // 데이터 호출 경로 설정

                url += "&rowsPerPage=" + $scope.screenData.pageSize; // 불러올 아이템 갯수 설정
                if (params.page) { // 페이징 여부 체크 후 페이지 파라메타 추가
                    url += "&page=" + params.page;
                }

            if (LotteCommon.isTestFlag) { // 로컬 테스트 예외 처리
                try {
                    console.log("url ::::: " + url); // 로컬테스트용 - 실 데이터 호출 URL 정보 로깅
                } catch (e) {}

                url = LotteCommon.smartpickData; // 로컬 테스트 일 경우 추가 파라메타 제외
            }
            return url;
        };

        // 로딩바 초기화
        $scope.resetLoading = function () {
            $scope.pageLoading = false;
            $scope.productListLoading = false;
            $scope.$parent.LotteSuperBlockStatus = false;
        };

        // 데이터 로드
        $scope.loadScreenData = function (params) {
            $scope.$parent.LotteSuperBlockStatus = true; // 데이터 로드중에는 클릭이나 기타 이벤트를 막는다.

            if (!params.page || params.page == 1) { // 첫페이지라면
                $scope.pageLoading = true; // 페이지 로딩 Flag
            } else { // 첫페이지가 아니고 페이징이라면
                $scope.productListLoading = true; // 페이지 더 불러오기 로딩중 Flag
            }

            if ($scope.screenData.pageEnd) { // 상품 로드가 끝났는지의 여부 체크
                $scope.productMoreScroll = false; // 상품 더 불러오기 막음
                $scope.resetLoading(); // 로딩 초기화
                return true;
            }

            var httpConfig = {
                method: "get",
                url: $scope.getThemaDataUrl(params)
            };

            $http(httpConfig) // 실제 탭 데이터 호출
            .success(function (data) {
                $scope.productMoreScroll = true;
                var contents = [];

                if (typeof data["main_contents"] != undefined) { // 데이터 오류가 아닐 경우
                    contents = data["main_contents"];
                } else { // 데이터 오류가 있는 경우 로딩 Reset
                    // 데이터 오류가 있는경우에 어찌할지 추가 코딩이 필요해 보임
                    return false;
                }

                $scope.loopData = angular.copy($scope.screenData);

                // 페이징 유닛 관련 처리
                if (!params.loadContents) {
                    if (!params.page) { // 파라메타에 지정된 페이지가 없을 경우 1페이지로 세팅
                        $scope.screenData.page = 1;
                    }

                    // 파라메타에 페이지가 지정되어 있을 경우 페이징이 필요한 데이터만 갱신하도록 처리
                    if (params.page > 1) {// 1page 가 아닐 경우
                        $scope.loopData = {prd_deal_list: true};

                    }

                    if ((!params.page || params.page == 1) && $scope.firstLoopData) { // 1페이지 일경우의 loopData 추가가 필요할 경우
                        $scope.loopData = angular.extend($scope.loopData, $scope.firstLoopData);
                    }
                } else {
                    $scope.productMoreScroll = false; // 페이징이 없는 탭일 경우 스크롤시 상품 더 불러오기 비활성화
                }

                // loopData 기준의 키값에 해당 하는 데이터 담기
                angular.forEach($scope.loopData, function (val, key) {
                    if (contents[key] != undefined) { // 갱신 데이터가 존재할 경우에만 처리
                        if (contents[key]['items'] != undefined) { // 갱신 데이터에 items key값이 있을 경우 items 데이터를 해당 키값에 갱신
                            // 상품 데이터 보정 (가격, 할인가, 상품평등은 숫자형태로 만들고, MappingKey를 맞춤)
                            if ($scope.productListItemKey.indexOf(key) > -1) { //
                                for (var i = 0; i < contents[key]['items'].length; i++) {
                                    angular.forEach(contents[key]['items'][i], function (itemVal, itemKey) {
                                        if ($scope.productOnlyNumberKey.indexOf(itemKey) > -1) { // 숫자형태여야 하는 데이터가 숫자형태가 아닌 걍우 데이터를 숫자형태로 변경
                                            contents[key]['items'][i][itemKey] = parseInt((itemVal + "").replace(/\,/gi, ""));
                                        }

                                        angular.forEach($scope.loopData, function (mappingObj, mappingKey) {
                                            if (key == mappingKey) {
                                                angular.forEach(mappingObj, function (mappingKey, originalKey) {
                                                    if (itemKey == originalKey) {
                                                        contents[key]['items'][i][mappingKey] = contents[key]['items'][i][itemKey];
                                                    }
                                                })
                                            }
                                        });
                                    });
                                }
                            }

                            if (params.page > 1) { // 페이지 파라메타가 있다면
                                if (!contents[key]['items'] || contents[key]['items'].length == 0) { // 페이지 파라메타가 있을 경우 응답온 데이터의 아이템 갯수가 없다면 페이지 더보기 비활성화
                                    $scope.productMoreScroll = false;
                                }

                                $scope.screenData[key] = $scope.screenData[key].concat(contents[key]['items']); // 이전 상품데이터와 새로 로드한 상품 데이터 합침
                            } else {
                                $scope.screenData[key] = contents[key]['items']; // 페이징이 아닐 경우 (옵션, 소팅 등) 데이터 갱신
                            }
                        } else { // 갱신데이터에 items 키값이 없을 경우에는 데이터 그대로 갱신
                            $scope.screenData[key] = contents[key];
                        }
                    }
                });

                // Mixed Content (우선순위에 따라 배너/상품 조합 처리)
                var mixDataTemp = []; // 배너/상품 조합 후 임시로 담을 변수

                // 넘어온 데이터가 더이상 없는 경우처리
                if (!contents['prd_deal_list'].items.length) {
                    $scope.screenData.pageEnd = true;
                    $scope.productMoreScroll = false;
                    return;
                }

                var sidx = ($scope.screenData.page - 1) * $scope.screenData.pageSize, // 배너 조합 시작 인덱스 지정 (page에 따라 시작 위치 조정)
                    productContent = $scope.screenData.prd_deal_list, // 상품 데이터
                    bannerContent = $scope.screenData.ban_list, // 배너 데이터
                    bannerIndexKey = 'mrk_rnk', // 배너 우선순위 키값 지정
                    eidx = productContent.length, // 로프 완료 인덱스 지정
                    addItem = null,
                    i = 0,
                    j = 0; // 배너 index (tclick 시 사용)

                if (!params.page || params.page == 1) {
                    $scope.screenData.mixed_pos = 0; // 배너 믹스 Position 초기화

                    // 반응형 배너를 위한 처리 (카드혜택 배너와 일반 배너 분리)
                    $scope.screenData.deal_banners = [];

                    for (i = 0; i < bannerContent.length; i++) {
                        if (bannerContent[i].banner_nm == "rewardevent") {
                            $scope.screenData.reward_banner = bannerContent[i];
                        } else {
                            $scope.screenData.deal_banners.push(angular.extend({bannerIdx : j++}, bannerContent[i]));
                        }
                    }
                }

                for (i = sidx; i < eidx; i++) { // 루프 돌면서 배너 우선순위에 따라 배열 조합
                    addItem = $scope.joinBannerContent(i + 1, bannerContent, bannerIndexKey); // 우선순위에 맞는 배너 구하기

                    if (addItem) { // 우선순위에 맞는 배너가 있을 경우 배열에 추가
                        mixDataTemp.push(addItem);
                    }

                    productContent[i].isProduct = true; // 상품인지 여부 Flag 설정
                    productContent[i].pIdx = i; // 상품에대한 Index 따로 부여
                    mixDataTemp.push(productContent[i]); // 조합 배열에 상품 추가
                }

                if (!params.page || params.page == 1) { // 페이지에 따라 데이터 교체 또는 추가
                    $scope.screenData.bannerMixContents = mixDataTemp;
                } else {
                    $scope.screenData.bannerMixContents = $scope.screenData.bannerMixContents.concat(mixDataTemp);
                }
                $scope.screenData = angular.copy($scope.screenData);
            })
            .error(function (data) {
                console.log("MainContent Data 오류");
            })
            .finally(function (data) { // Success던 Error던 항상 실행
                $scope.resetLoading(); // 로딩 초기화
            });
        };

        // 상품과 배너 믹스 형태 처리
        $scope.joinBannerContent = function (idx, bannerData, rnkKey) { 
            var rtnArr = null;

            try {
                var i = 0, bannerTemp = [];

                for (i = $scope.screenData.mixed_pos; i < bannerData.length; i++) {
                    if (bannerData[i][rnkKey] == idx || (bannerData[i][rnkKey] == 0 && idx == 1)) {
                        $scope.screenData.mixed_pos = i;
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

        // sessionStorage - 세션에서 가저올 부분 선언
        var smartPickLoc = LotteStorage.getSessionStorage('smartPickLoc');
        var smartPickDataStr = LotteStorage.getSessionStorage('smartPickData');
        var smartPickScrollY = LotteStorage.getSessionStorage('smartPickScrollY');

        if (smartPickLoc == window.location.href && smartPickDataStr != null && commInitData.query["localtest"] != "true") { // 현재 URL과 session storage에 저장된 경로가 동일 할 경우
            var smartPickData = JSON.parse(smartPickDataStr);

            $scope.screenData = smartPickData.screenData; // 화면 데이터 갱신
            $scope.pageLoading = false; // 페이지 로딩 중 Flag 감추기

            $timeout(function () {
                angular.element($window).scrollTop(smartPickScrollY);
            }, 800);
        } else { // 세션에 담긴 데이터가 없을 경우 데이터 로드
            $scope.screenDataReset(); // 데이터 초기화
            $scope.loadScreenData({
                page : ++$scope.screenData.page
            });
        }

        // unload시 관련 데이터를 sessionStorage에 저장
        angular.element($window).on("unload", function (e) {
            var sess = {};

            sess.screenData = $scope.screenData; // 전체탭 저장 데이터

            if (!commInitData.query.localtest && $scope.leavePageStroage) { // localtest url 파라메타가 없을때 저장
                LotteStorage.setSessionStorage('smartPickLoc', $location.absUrl());
                LotteStorage.setSessionStorage('smartPickData', sess, 'json');
                LotteStorage.setSessionStorage('smartPickScrollY', angular.element($window).scrollTop());
            }
        });
    }]);

    // 스마트픽 Directive (빅딜형)
    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mall/smartpick_container.html',
            link: function ($scope, el, attrs) {
                $scope.getProductData = function () { // 상품 페이지 로드
                    $scope.loadScreenData({
                        page : ++$scope.screenData.page
                    });

                    // [TCLICK] 스마트픽추가로딩횟수
                    $scope.sendTclick('m_DC_Smartpick_' + $scope.ctgDispNo + '_load' + ($scope.screenData.page - 1));
                };

                // URL에 Base Parameter 추가
                function setBaseParameter(href) {
                    href = (href + "").indexOf("?") > -1 ? href : href + "?";

                    if (href.substring(href.length - 1, href.length) != "?") {
                        href += "&";
                    }

                    return href + $scope.baseParam;
                }

                // 일반/아웃 링크 처리
                $scope.linkUrl = function (url, outlinkFlag, tclick, addParams) {
                    if (outlinkFlag) {
                        $scope.sendOutLink(url); // 외부 링크 보내기 (새창)

                        if (tclick) { // tclick이 있다면
                            $scope.sendTclick(tclick); // 외부링크일때 iframe으로 tclick 전송
                        }
                    } else {
                        var url = setBaseParameter(url) ; // 링크 url에 base parameter를 붙여준다.

                        if (addParams) { // 추가 파라메타가 있다면
                            angular.forEach(addParams, function (val, key) {
                                url += "&" + key + "=" + val;
                            });
                        }

                        if (tclick) { // tclick 이 있다면 url 뒤에 parameter를 추가한다.
                            url += "&tclick=" + tclick;
                        }

                        window.location.href = url; // url 이동
                    }
                };
            }
        };
    });


})(window, window.angular);