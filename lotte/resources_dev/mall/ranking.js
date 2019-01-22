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

    app.controller('rankingCtrl', ['$scope', '$http', '$filter', '$location', '$window', '$timeout', 'LotteCommon', 'LotteUtil', 'commInitData', 'LotteStorage', 'LotteUserService','$compile', function($scope, $http, $filter, $location, $window, $timeout, LotteCommon, LotteUtil, commInitData, LotteStorage, LotteUserService, $compile) { 
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.ctgDispNo = "5537343"; // 카테고리 번호
        $scope.curDispNo = $scope.ctgDispNo; // 카테고리 번호(상품상세 이동시 인입 코드 전달 위해)
        $scope.curDispNoSctCd = "44"; // 전시 인입 코드(상품상세 이동시 인입 코드 전달 위해)
        $scope.subTitle = "랭킹존"; // 서브헤더 타이틀
        $scope.pageLoading = true; // 페이지 로딩 Flag
        $scope.productListLoading = false; // 페이지 더 불러오기 로딩중 Flag
        $scope.productMoreScroll = true; // 페이지 더 불러오기 가능 여부 Flag
        $scope.winWidth = angular.element($window).width(); // 윈도우 넓이
        
        // 이벤트탭 관련 링크
        $scope.eventLinkObj = {
            eventInfoUrl : LotteCommon.eventGumeUrl, // 응모/당첨
            eventSaunUrl : LotteCommon.eventSaunUrl, // 구매사은
            eventBenefitUrl : LotteCommon.gdBenefitUrl, // 참좋은 혜택
            eventAttendUrl : LotteCommon.directAttendUrl // 출석도짱
        };

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
        
        $scope.selectbox_page = [0, 0, 0]; // 각 카테고리 페이지 저장
        
        // 콘텐츠 데이터의 데이터 정의 초기화
        $scope.screenDataReset = function () { 
            $scope.productMoreScroll = true; // 상품 리스트 페이징 가능 여부
            $scope.screenData = {
                // 리스트 페이지 관련
                page: 0, // 현재 페이지 Index
                pageSize: 15, // 한페이지당 아이템 개수
                listTotal: 0, // 총 리스트 개수
                pageEnd: false, // 마지막 페이지 체크 Flag
                ban_list: [], // 배너 리스트
                prd_deal_list: [], // 상품 리스트
                disp_grp_no: NaN, // [ranking] 랭킹 그룹 번호
                ranking_disp_no: "", // [ranking]  랭킹 전시번호
                lank_keyword: [], // [ranking] 급상승 검색어 데이터
                ranking_ctg_depth_idx: 0, // [ranking] 랭킹 카테고리 depth
                ranking_ctg_level: "MA", // [ranking] 카테고리 현재 선택 depth (MA : 전체, M0 : 대대카, M1 : 대카, M2 : 중카)
                ranking_category: [], // [ranking] 카테고리 데이터
                ranking_ctg_depth: [null, null, null], // [ranking] 카테고리 UI 데이터
                ranking_gender: "A", // [ranking] 카테고리 현재 선택 성별 (A : 전체, M : 남자, F : 여자)
                ranking_age: "A", // [ranking] 카테고리 현재 선택 연령 (A : 전체, 20 : 20대이하, 30 : 30대, 40 : 40대, 50 : 50대 이상)
                ranking_ui: { // [ranking] select 박스 UI 관련 정보
                    setting_flag: false, // 옵션값을 변경했는지 여부에 대해저장하고 변경 안했을 경우에만 로그인 정보 기반으로 Default 세팅하기 위한 Flag
                    select_all: [ // 카테고리 "전체" 에 대한 정보 세팅
                        { disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "", isAll: true },
                        { disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "", isAll: true },
                        { disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "", isAll: true }
                    ],
                    selectbox: [ // 현재 선택된 카테고리 정보 저장
                        { disp_grp_desc: "카테고리 전체", disp_grp_no: NaN, disp_no: "" },
                        { disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "" },
                        { disp_grp_desc: "전체", disp_grp_no: NaN, disp_no: "" }
                    ],
                    selectbox_select_idx: 0 // 현재 선택된 (대대카, 대카, 중카) 카테고리 셀렉트박스 Depth 인덱스
                },
            };
        };

        // 메인 탭 데이터 URL / Parameter 정의
        $scope.getThemaDataUrl = function (params) {
            var url = LotteCommon.rankingData + "?"; // 데이터 호출 경로 설정
                url += "&rowsPerPage=" + $scope.screenData.pageSize; // 불러올 아이템 갯수 설정

            if (params.page) { // 페이징 여부 체크 후 페이지 파라메타 추가
                url += "&page=" + params.page;
            }

            // 설정을 변경한 적이 없고 로그인 정보가 있을 경우에만 로그인 기반 사용자 정보로 Default 성별, 연령 세팅
            if (!$scope.screenData.ranking_ui.setting_flag && $scope.loginInfo.isLogin) {
                if ($scope.loginInfo.gradeCd) {
                    $scope.screenData.ranking_gender = $scope.loginInfo.genSctCd; // 성별
                }

                if ($scope.loginInfo.mbrAge) { // 연령
                    var userAge = parseInt($scope.loginInfo.mbrAge); // 로그인 정보의 회원 나이를 숫자 형태로 할당

                    if (userAge < 30) { // 연령은 나이가 직접 들어와 범위에 맞게 값 세팅 되도록 분기
                        $scope.screenData.ranking_age =  20;
                    } else if (userAge < 40) {
                        $scope.screenData.ranking_age =  30;
                    } else if (userAge < 50) {
                        $scope.screenData.ranking_age =  40;
                    } else if (userAge >= 50) {
                        $scope.screenData.ranking_age =  50;
                    }
                }

                params.gender = $scope.screenData.ranking_gender; // 성별
                params.age = $scope.screenData.ranking_age; // 나이
            }
            try{
                console.info('++++++++++++ selectDispNo ++++++++++++', selectDispNo);
            }catch(e){}


            if (params.dispGrpNo && params.selectDispNo != "5537343" && params.ctgDepth != "MA") { // 대대카가 아니라면 dispGrpNo를 파라메타에 추가한다
                url += "&dispGrpNo=" + params.dispGrpNo;
            }

            if (params.selectDispNo && params.selectDispNo != "5537343" && params.ctgDepth != "MA") {
                url += "&selectDispNo=" + (params.selectDispNo ? params.selectDispNo : "5537343");
            }

            url += "&ctgDepth=" + (params.ctgDepth ? params.ctgDepth : "MA");
            url += "&gender=" + (params.ctgDepth != "M2" && params.gender ? params.gender : "A");
            url += "&age=" + (params.ctgDepth != "M2" && params.age ? params.age : "A");

            if (LotteCommon.isTestFlag) { // 로컬 테스트 예외 처리
                try {
                    console.log("url ::::: " + url); // 로컬테스트용 - 실 데이터 호출 URL 정보 로깅
                } catch (e) {}

                url = LotteCommon.rankingData; // 로컬 테스트 일 경우 추가 파라메타 제외
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

            if ((!params.page && params.page > 1) && $scope.screenData.prd_deal_list.length > 100) { // 첫페이지가 아니고 랭킹존 100개 보다 클때 예외처리
                $scope.resetLoading(); // 로딩 초기화
                return false;
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

                if (!params.page || params.page == 1) { // 첫페이지일때만
                    if ($scope.screenData.ranking_ctg_depth_idx == 0) { // 랭킹존 카테고리 처리 (최초로드일때 전체값 세팅)
                        $scope.screenData.ranking_ui.select_all[0] = { disp_grp_desc: "전체", disp_grp_no: $scope.screenData.disp_grp_no, disp_no: "5537343", isAll: true };
                        $scope.screenData.ranking_ui.selectbox[0] = { disp_grp_desc: "카테고리 전체", disp_grp_no: $scope.screenData.disp_grp_no, disp_no: $scope.screenData.ranking_disp_no, isAll: true };
                        $scope.screenData.ranking_ui.select_all[1] = null;
                        $scope.screenData.ranking_ui.select_all[2] = null;
                        $scope.screenData.ranking_ui.selectbox[1] = null;
                        $scope.screenData.ranking_ui.selectbox[2] = null;
                    }

                    if (params.ctgDepth != "M2") { // 마지막 Depth 일때 카테고리 데이터 갱신하지 않음
                        $scope.screenData.ranking_category.unshift($scope.screenData.ranking_ui.select_all[$scope.screenData.ranking_ctg_depth_idx]); // 전체에 대한 아이템 추가
                        $scope.screenData.ranking_ctg_depth[$scope.screenData.ranking_ctg_depth_idx] = $scope.splitArrayItem($scope.screenData.ranking_category, 6, true); // 현재 선택된 카테고리 depth에 카테고리 정보 갱신 ( 6개씩 )
                    }
                }

                if ($scope.screenData.prd_deal_list.length >= 100) { // 상품 100개 로드시 로드 완료 처리
                    $scope.productMoreScroll = false;
                    $scope.productListLoading = false;
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

        // 카테고리 지정갯수로 이중배열 형태로 변환
        $scope.splitArrayItem = function (arr, count, arrayFullFlag) {
            var rtnArr = [], i = 0, j = 0;

            for (i; i < arr.length; i++) {
                j = Math.floor(i / count);

                if (!rtnArr[j]) {
                    rtnArr[j] = [];
                }

                rtnArr[j].push(arr[i]);
            }

            if (arrayFullFlag && rtnArr[j].length < count) { // Array 당 count 만큼의 item이 채워지지 않았을 경우 채우는 로직
                var tmpCnt = count - rtnArr[j].length;

                for (i = 0; i < tmpCnt; i++) {
                    rtnArr[j].push({});
                }
            }

            return rtnArr;
        };

        // sessionStorage - 세션에서 가저올 부분 선언
        var rankingLoc = LotteStorage.getSessionStorage('rankingLoc');
        var rankingDataStr = LotteStorage.getSessionStorage('rankingData');
        var rankingScrollY = LotteStorage.getSessionStorage('rankingScrollY');

        if (rankingLoc == window.location.href && rankingDataStr != null && commInitData.query["localtest"] != "true") { // 현재 URL과 session storage에 저장된 경로가 동일 할 경우
            var rankingData = JSON.parse(rankingDataStr);

            if ($scope.loginInfo.isLogin != rankingData.isLoginData) { // 로그인 정보가 저장된 정보랑 다를 경우 데이터 로드
                $scope.screenDataReset(); // 데이터 초기화
                $scope.loadScreenData({
                    page : ++$scope.screenData.page
                });
            } else {
                $scope.screenData = rankingData.screenData; // 화면 데이터 갱신
                $scope.pageLoading = false; // 페이지 로딩 중 Flag 감추기

                $timeout(function () {
                    angular.element($window).scrollTop(rankingScrollY);
                }, 800);

            }
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
            sess.isLoginData = $scope.loginInfo.isLogin; // 세션스토리지 저장할때의 로그인 상태값 저장

            if (!commInitData.query.localtest && $scope.leavePageStroage) { // localtest url 파라메타가 없을때 저장
                LotteStorage.setSessionStorage('rankingLoc', $location.absUrl());
                LotteStorage.setSessionStorage('rankingData', sess, 'json');
                LotteStorage.setSessionStorage('rankingScrollY', angular.element($window).scrollTop());
            }
        });
    }]);

    // 랭킹존 Directive
    app.directive('lotteContainer', ['$timeout', function($timeout) {
        return {
            templateUrl : '/lotte/resources_dev/mall/ranking_container.html',
            link: function ($scope, el, attrs) {
                $scope.rankingCtgOpenFlag = false; // 카테고리 열림/닫힘 Flag

                function rankingSortTclick() { // [TCLICK] 메뉴-랭킹존 : 5. 성별/연령 소팅
                    var tclick = "m_DC_Ranking_" + $scope.ctgDispNo + "_sort";

                    if ($scope.screenData.ranking_gender == "F") { // 여성
                        tclick += "F";
                    } else if ($scope.screenData.ranking_gender == "M") { // 남성
                        tclick += "M";
                    } else { // 전체
                        tclick += "H";
                    }

                    tclick += "_";

                    if ($scope.screenData.ranking_age == "20") { // 20대
                        tclick += "20";
                    } else if ($scope.screenData.ranking_age == "30") { // 30대
                        tclick += "30";
                    } else if ($scope.screenData.ranking_age == "40") { // 40대
                        tclick += "40";
                    } else if ($scope.screenData.ranking_age == "50") { // 50대
                        tclick += "50";
                    } else { // 전체
                        tclick += "1";
                    }

                    $scope.sendTclick(tclick);
                }

                $scope.toggleCtg = function () { // 카테고리 셀렉트 박스 열기/닫기
                    $scope.rankingCtgOpenFlag = !$scope.rankingCtgOpenFlag;
                };

                $scope.ctgSelectBoxClick = function (depth) { // 카테고리 선택
                    if ($scope.screenData.ranking_ui.selectbox_select_idx != depth) {
                        $scope.screenData.ranking_ui.selectbox_select_idx = depth;
                        $scope.rankingCtgOpenFlag = true;
                    } else {
                        $scope.toggleCtg();
                    }
                    // 저장된 페이지로 슬라이드 이동
                    $timeout(function(){
	                    var scope = angular.element('#rankSwipeCtg' + (depth + 1)).scope();
	                    scope.goSlide($scope.selectbox_page[depth] || 0);
	                    $timeout(function(){
	                    	$scope.$apply();
	                    });
                    }, 10);
                };
                
                $scope.swipeEndHandler1 = function(event){
                	$scope.selectbox_page[0] = event.idx;
                };
                
                $scope.swipeEndHandler2 = function(event){
                	$scope.selectbox_page[1] = event.idx;
                };
                
                $scope.swipeEndHandler3 = function(event){
                	$scope.selectbox_page[2] = event.idx;
                };

                $scope.ctgChange = function (item) { // 카테고리 변경
                    if (item.disp_no == $scope.screenData.ranking_disp_no || item.disp_grp_no == $scope.screenData.disp_grp_no) // disp_grp_no가 다를 경우에만 처리
                        return false;

                    // 카테고리 Depth 판단
                    if (item.isAll) { // 전체 선택일 경우 (전체선택일 경우 한 depth 위로 설정 - 이전 disp_grp_no 기반이 전체 데이터여서 한 depth 위로)
                        switch ($scope.screenData.ranking_ui.selectbox_select_idx) { // 카테고리 Depth 선택 여부에 따라 카테고리 레벨, depth 설정
                            case 0: // 대대카 전체 선택일 경우
                                $scope.screenData.ranking_ctg_level = "MA";
                                $scope.screenData.ranking_ctg_depth_idx = 0;
                                break;
                            case 1: // 대카 전체 선택일 경우
                                $scope.screenData.ranking_ctg_level = "M0";
                                $scope.screenData.ranking_ctg_depth_idx = 1;
                                break;
                            case 2: // 중카 전체 선택일 경우
                                $scope.screenData.ranking_ctg_level = "M1";
                                $scope.screenData.ranking_ctg_depth_idx = 2;
                                break;
                        }
                    } else { // 일반
                        switch ($scope.screenData.ranking_ui.selectbox_select_idx) { // 카테고리 Depth 선택 여부에 따라 카테고리 레벨, depth 설정
                            case 0: // 대대카 카테고리 선택일 경우
                                $scope.screenData.ranking_ctg_level = "M0";
                                $scope.screenData.ranking_ctg_depth_idx = 1;
                                $scope.selectbox_page[1] = 0;
                                $scope.selectbox_page[2] = 0;
                                break;
                            case 1: // 대카 카테고리 선택일 경우
                                $scope.screenData.ranking_ctg_level = "M1";
                                $scope.screenData.ranking_ctg_depth_idx = 2;
                                $scope.selectbox_page[2] = 0;
                                break;
                            case 2: // 중카 카테고리 선택일 경우
                                $scope.screenData.ranking_ctg_level = "M2";
                                break;
                        }
                    }

                    // 카테고리 셀렉트 박스 item 변경
                    $scope.screenData.ranking_ui.select_all[$scope.screenData.ranking_ctg_depth_idx] = { disp_grp_desc: "전체", disp_grp_no: item.disp_grp_no, disp_no: item.disp_no, isAll: true};
                    $scope.screenData.ranking_ui.selectbox[$scope.screenData.ranking_ctg_depth_idx] = { disp_grp_desc: "전체", disp_grp_no: item.disp_grp_no, disp_no: item.disp_no, isAll: true};

                    if (!item.isAll) { // 전체선택이 아닐 경우
                        $scope.screenData.ranking_ui.selectbox[$scope.screenData.ranking_ui.selectbox_select_idx] = { disp_grp_desc: item.disp_grp_desc, disp_grp_no: item.disp_grp_no, disp_no: item.disp_no};
                    }

                    $scope.rankingCtgOpenFlag = false; // 카테고리 선택시 카테고리 닫기
                    $scope.screenData.ranking_disp_no = item.disp_no; // 카테고리 전시 번호 할당
                    $scope.screenData.disp_grp_no = item.disp_grp_no; // 카테고리 disp_grp_no 할당

                    $scope.loadData($scope.screenData.ranking_ctg_level, item.disp_no, item.disp_grp_no); // 변경된 데이터 로드

                    // [TCLICK] 메뉴-랭킹존 : 2. 랭킹존 카테고리
                    $scope.sendTclick("m_DC_Ranking_" + item.disp_no + "_cate");
                };

                $scope.rankGenderChange = function (gender) { // 성별 변경
                    $scope.screenData.ranking_ui.setting_flag = true; // 설정 변경 여부 Flag
                    $scope.screenData.ranking_gender = gender; // 성별 데이터 지정
                    $scope.loadData(); // 데이터 로드

                    rankingSortTclick();
                };

                $scope.rankAgeChange = function () { // 나이 변경 (나이변경은 셀렉트 박스에 bindding 된 model 값 직접 참조하여 로드)
                    $scope.screenData.ranking_ui.setting_flag = true; // 설정 변경 여부 Flag
                    $scope.loadData(); // 데이터 로드

                    rankingSortTclick();
                };

                $scope.rankAgeLabelClick = function () { // 랭킹 셀렉트박스 label 클릭시 선택되도록
                    angular.element(el).find("#rankTypeAge").trigger("click");
                };

                $scope.loadData = function (ctgDepth, selectDispNo, disp_grp_no, page) { // 랭킹 데이터 로드
                    $scope.screenData.page = 1; // 옵션이나 카테고리 변경일때만 loadData를 호출하기 때문에 페이지를 Default 1로 설정
                    $scope.productMoreScroll = true; // 상품 페이징 기능 활성화

                    var params = {
                        dispGrpNo: disp_grp_no ? disp_grp_no : $scope.screenData.disp_grp_no, // 랭킹그룹번호
                        selectDispNo: selectDispNo ? selectDispNo : $scope.screenData.ranking_disp_no, // 랭킹 카테고리 전시번호
                        ctgDepth: ctgDepth ? ctgDepth : $scope.screenData.ranking_ctg_level, // 카테고리 레벨
                        gender: $scope.screenData.ranking_gender, // 성별
                        age: $scope.screenData.ranking_age // 연령
                    };

                    $scope.loadScreenData(params);
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

                $scope.getProductData = function () { // 상품 페이지 로드
                    $scope.loadScreenData({
                        dispGrpNo: $scope.screenData.disp_grp_no, // 랭킹그룹번호
                        selectDispNo: $scope.screenData.ranking_disp_no, // 랭킹 카테고리 전시번호
                        ctgDepth: $scope.screenData.ranking_ctg_level, // 카테고리 레벨
                        gender: $scope.screenData.ranking_gender, // 성별
                        age: $scope.screenData.ranking_age, // 연령
                        page : ++$scope.screenData.page
                    });

                    // [TCLICK] 랭킹존추가로딩횟수
                    $scope.sendTclick('m_DC_Ranking_' + $scope.ctgDispNo + '_load' + ($scope.screenData.page - 1));
                };
            }
        };
    }]);


})(window, window.angular);