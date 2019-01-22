(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm'        
    ]);

    app.controller('customSearchPageCtrl', ["$scope", "LotteCommon", function ($scope, LotteCommon){
        $scope.showWrap = true;
        $scope.contVisible = true;
    }]);

    /*app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/search/custom_search_page_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });*/

    app.directive('lotteContainer', ['LotteCommon', 'LotteStorage','$window', '$location', '$timeout', '$parse', '$http', function (LotteCommon, LotteStorage, $window, $location, $timeout, $parse, $http) {
        return {
            templateUrl : '/lotte/resources_dev/search/custom_search_page_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.referrerUrl = document.referrer; // 이전페이지
                $scope.inType = "";

                if ($location.absUrl().indexOf('inType=srhResult') > -1) { // 앱에서 url 직접이동시 검색페이지 판단
                    $scope.inType = 'srhResult';
                }

                $scope.csUIStatus = {
                    visible : false,
                    tabSelection : 0,
                    brandLanguage : "ko",
                    ajaxLoading :   false
                };
                
                $scope.csUIData = {
                    brandKeyword: "",
                    brandKeywordSearch: "",
                    brandList:  []
                }

                $scope.csURLs = {
                    baseData        : LotteCommon.srhListCustomSetting2016,//맞춤설정
                    customBrandTxt  : LotteCommon.sideCtgBrandSearch,//브랜드 검색
                    customBrandIdx  : LotteCommon.sideCtgBrandData//브랜드 인덱스 검색
                };
                
                $scope.csBrandIndex = [
                    ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"],
                    ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
                ];

                // 맞춤설정 저장값
                $scope.csCustomSettings = {
                    customized  : false,
                    category    : [],
                    brand       : [],
                    color       : []
                };

                // 맞춤설정 임시
                $scope.csTempSettings = {
                    customized  : false,
                    changed     : false,
                    category    : [],
                    brand       : [],
                    color       : []
                };
                
                $scope.csCustomBaseData = {};

                $scope.csBrandSearchTextTimer = -1;
                $scope.csSelectedScroll;
                $scope.csTabScroll;
                $scope.csIScrollOption = {
                    mouseWheel: true,
                    scrollY:    true,
                    scrollX:    false,
                    click:      true
                };
                
                
                /**
                 * 초기화
                 */
                $scope.csInitCustomSearch = function(){
                    var baseData = LotteStorage.getSessionStorage("customSearchBaseData", 'json');
                    if(baseData == null){
                        // load
                        $scope.csLoadBaseData();
                    }else{
                        // session
                        $scope.csCustomBaseData = baseData;
                        $scope.csInitIscroll();
                    }
                    
                    var customData = LotteStorage.getLocalStorage("customSearchSettings", 'json');
                    if(customData != null){
                        $scope.csCustomSettings = customData;
                    }

                    $scope.csInitTempSettings();
                    $timeout($scope.csInitIscroll, 0);                    
                }

                /**
                 * 맞춤설정 데이터 로드
                 */
                $scope.csLoadBaseData = function(){
                    $http.get( $scope.csURLs.baseData )
                        .success(function(data){
                            $scope.csCustomBaseData = data;
                            LotteStorage.setSessionStorage("customSearchBaseData", $scope.csCustomBaseData, 'json');
                            $scope.csInitIscroll();

                            $scope.csSetItemChecked("ctg");
                            $scope.csSetItemChecked("brd");
                            $scope.csSetItemChecked("clr");
                        })
                        .error(function(){
                            console.error('Data Error : 맞춤설정 데이터');
                        });
                }
                
                /**
                 * 맞춤설정 임시 데이터 초기화
                 */
                $scope.csInitTempSettings = function(){
                    $scope.csTempSettings.customized =  $scope.csCustomSettings.customized;
                    $scope.csTempSettings.changed = false;
                    $scope.csTempSettings.category =    [].concat($scope.csCustomSettings.category);
                    $scope.csTempSettings.brand =       [].concat($scope.csCustomSettings.brand);
                    $scope.csTempSettings.color =       [].concat($scope.csCustomSettings.color);
                    
                    $scope.csSetItemChecked("ctg");
                    $scope.csSetItemChecked("brd");
                    $scope.csSetItemChecked("clr");
                }
                
                /**
                 * 리스트 아이템 체크상태 설정
                 */
                $scope.csSetItemChecked = function(flag){
                    if($scope.csCustomBaseData == undefined || $scope.csCustomBaseData.category==undefined){ return; }
                    
                    var temp, base, name;
                    switch(flag){
                        case "ctg":
                            temp = $scope.csTempSettings.category;
                            base = $scope.csCustomBaseData.category.items;
                            name = "ctgNo";
                            break;
                        case "brd":
                            temp = $scope.csTempSettings.brand;
                            base = $scope.csUIData.brandList;
                            name = "brnd_no";
                            break;
                        case "clr":
                            temp = $scope.csTempSettings.color;
                            base = $scope.csCustomBaseData.color.items;
                            name = "colorCd";
                            break;
                        default:
                            return;
                            break;
                    }
                    
                    var arr = [];
                    angular.forEach(temp, function (item, index) {
                        arr.push(item[name]);
                    });
                    angular.forEach(base, function(item, index){
                        item.on = arr.indexOf(item[name]) >= 0;
                    });
                }
                
                /**
                 * 맞춤검색 레이어 열기/닫기
                 */
                $scope.csCloseCustomSearch = function(){
                    $scope.csDestroyIScroll();

                    if ($scope.inType == 'srhResult') {
                        $window.location.href = $scope.referrerUrl;
                    }else{
                        $scope.gotoPrepage();
                    }
                }
                
                /**
                 * 맞춤검색 티클릭 분기 처리
                 */
                $scope.csShowHideCustomSearch = function(flag){
                    if(flag == "list"){
                        $scope.sendTclick($scope.tClickBase + "m_RDC_SrhResult_Clk_customizing_search_Btn");
                    }else if(flag == "layer"){
                        $scope.sendTclick($scope.tClickBase + "m_RDC_SrhLayer_Clk_customizing_search_Btn");
                    }
                };             
                
                $scope.csSelectTab = function(n){
                    $scope.csUIStatus.tabSelection = n;
                    
                    $scope.csInitIscroll();
                };
                
                
                /**
                 * 아이스크롤 초기화
                 */
                $scope.csInitIscroll = function(){
                    $timeout($scope.csInitIscrollDelay, 50);
                }
                $scope.csInitIscrollDelay = function(){
                    $scope.csRefreshSelectionArea();
                    if($scope.appObj.isIOS){
                        // iphone: use iscroll
                        if($scope.csSelectedScroll == undefined){
                            if($("#customSearchWrap .csw_selected").length > 0){
                                $scope.csSelectedScroll = new IScroll("#customSearchWrap .csw_selected", $scope.csIScrollOption);
                            }
                        }
                        
                        if($scope.csTabScroll != undefined){
                            $scope.csTabScroll.destroy();
                            $scope.csTabScroll = null;
                        }
                        $("#customSearchWrap .csw_cont .scrollable > div").css("transform", "translate(0, 0)");
                        
                        if($("#customSearchWrap .csw_cont .show .scrollable").length > 0){
                            $scope.csTabScroll = new IScroll("#customSearchWrap .csw_cont .show .scrollable", $scope.csIScrollOption);
                        }
                    }else{
                        // android: use html scroll
                        $("#customSearchWrap .csw_cont .scrollable").css("overflow-y", "auto");
                        $("#customSearchWrap .csw_selected > div").css({"max-height":"104px", "height":"100%", "overflow-y":"auto"});
                    }
                }
                
                $scope.csDestroyIScroll = function(){
                    if($scope.csSelectedScroll != undefined){
                        $scope.csSelectedScroll.destroy();
                        $scope.csSelectedScroll = null;
                    }
                    if($scope.csTabScroll != undefined){
                        $scope.csTabScroll.destroy();
                        $scope.csTabScroll = null;
                    }
                }
                
                /**
                 * 탭 아이스크롤 리프레시
                 */
                $scope.csRefreshTabScroll = function(scrollTop){
                    $timeout(function(){$scope.csRefreshTabScrollDelay(scrollTop)}, 100);
                }
                
                $scope.csRefreshTabScrollDelay = function(scrollTop){
                    if($scope.csTabScroll != undefined){
                        if(scrollTop === true){
                            $scope.csTabScroll.scrollTo(0, 0);
                        }
                        $scope.csTabScroll.refresh();
                    }
                }
                
                /**
                 * 맞춤선택 아이스크롤 리프레시
                 */
                $scope.csRefreshSelectedScroll = function(){
                    $timeout($scope.csRefreshSelectionArea, 100);
                    $timeout($scope.csRefreshSelectedScrollDelay, 200);
                    $scope.csRefreshTabScroll();
                }
                
                $scope.csRefreshSelectedScrollDelay = function(){
                    if($scope.csSelectedScroll != undefined){
                        $scope.csSelectedScroll.refresh();
                    }
                }
                
                /**
                 * 맞춤선택 영역 크기 반영
                 */
                $scope.csRefreshSelectionArea = function(){
                    if($("#csw_selected").length == 0){ return; }
                    $("#csw_selection").css("top", $("#csw_selected").height());
                }
                
                
                /**
                 * 카테고리 선택
                 */
                $scope.csSelectCategory = function(item){
                    var existed = $scope.csCheckExisting("ctg", item);
                    if(existed){ return; }

                    var a = $scope.csTempSettings.category;
                    if(a.length >= 2){
                        $scope.alert_2016("카테고리 설정은 2개만 가능합니다.");
                        return;
                    }
                    
                    item.on = true;
                    a.push(item);
                    $scope.csUpdateCustomized();
                    $scope.csScrollTo("ctg");
                };
                
                /**
                 * 브랜드 선택
                 */
                $scope.csSelectBrand = function(item){
                    var existed = $scope.csCheckExisting("brd", item);
                    if(existed){ return; }

                    var a = $scope.csTempSettings.brand;
                    if(a.length >= 10){
                        $scope.alert_2016("브랜드 설정은 10개만 가능합니다.");
                        return;
                    }
                    
                    item.on = true;
                    a.push(item);
                    $scope.csUpdateCustomized();
                    $scope.csScrollTo("brd");
                };
                
                /**
                 * 컬러 선택
                 */
                $scope.csSelectColor = function(item){
                    var existed = $scope.csCheckExisting("clr", item);
                    if(existed){ return; }

                    var a = $scope.csTempSettings.color;
                    if(a.length >= 3){
                        $scope.alert_2016("컬러 설정은 3개만 가능합니다.");
                        return;
                    }
                    
                    item.on = true;
                    a.push(item);
                    $scope.csUpdateCustomized();
                    $scope.csScrollTo("clr");
                };
                
                /**
                 * 카테고리, 브랜드, 컬러 선택해제
                 */
                $scope.csDeselectItem = function(flag, item){
                    switch(flag){
                        case "ctg":
                            $scope.csSelectCategory(item);
                            break;
                        case "brd":
                            $scope.csSelectBrand(item);
                            break;
                        case "clr":
                            $scope.csSelectColor(item);
                            break;
                        default:
                            return;
                            break;
                    }
                    $scope.csSetItemChecked(flag);
                };
                
                /**
                 * 이미 선택된 아이템 여부 확인
                 */
                $scope.csCheckExisting = function(flag, item){
                    var a, n;
                    switch(flag){
                        case "ctg":
                            a = $scope.csTempSettings.category;
                            n = "ctgName";
                            break;
                            
                        case "brd":
                            a = $scope.csTempSettings.brand;
                            n = "brnd_no";
                            break;
                            
                        case "clr":
                            a = $scope.csTempSettings.color;
                            n = "colorCd";
                            break;
                            
                        default:
                            return true;
                            break;
                    }
                    
                    var o;
                    var len = a.length;
                    for(var i=0; i<len; i++){
                        o = a[i];
                        if(o[n] == item[n]){
                            item.on = false;
                            a.splice(i, 1);
                            $scope.csUpdateCustomized();
                            return true;
                            break;
                        }
                    }
                    
                    return false;
                };
                
                /**
                 * 추가된 항목으로 스크롤
                 */
                $scope.csScrollTo = function(flag){
                    $timeout(function(){
                        $scope.csScrollToDelay(flag);
                    }, 250);
                };
                
                $scope.csScrollToDelay = function(flag){
                    var scr = 0;
                    if($scope.appObj.isIOS){
                        // iphone: iscroll
                        if($scope.csSelectedScroll != undefined){
                            if(flag != "ctg"){
                                scr = $scope.csSelectedScroll.maxScrollY;
                            }
                            $scope.csSelectedScroll.scrollTo(0, scr, 300);
                        }
                    }else{
                        // android: html scroll
                        var div = $("#csw_selected > div");
                        if(flag != "ctg"){
                            scr = div.prop("scrollHeight");
                        }
                        div.stop().animate({scrollTop:scr}, 300);
                    }
                }
                
                /**
                 * 맞춤설정 적용 상태 체크
                 */
                $scope.csUpdateCustomized = function(){
                    var cnt = $scope.csTempSettings.category.length + $scope.csTempSettings.brand.length + $scope.csTempSettings.color.length;
                    $scope.csTempSettings.customized = (cnt > 0);
                    $scope.csTempSettings.changed = true;
                    
                    $scope.csRefreshSelectedScroll();
                };
                
                /**
                 * 브랜드 인덱스 언어설정
                 */
                $scope.csChangeBrandLanguage = function(lang){
                    if(lang == "en"){
                        $scope.csUIStatus.brandLanguage = "en";
                    }else{
                        $scope.csUIStatus.brandLanguage = "ko";
                    }
                    
                    $scope.csRefreshTabScroll(true);
                };
                
                /**
                 * 브랜드 텍스트 검색
                 */
                $scope.csBrandSearchText = function(){
                    clearTimeout($scope.csBrandSearchTextTimer);
                    $scope.csBrandSearchTextTimer = setTimeout($scope.csBrandSearchTextDelay, 500);
                };
                
                $scope.csBrandSearchTextDelay = function(){
                    var str = $scope.csUIData.brandKeyword;
                    if(str.length >= 2){
                        $scope.csUIStatus.ajaxLoading = true;
                        $scope.csUIData.brandKeywordSearch = str;
                        var param = {"sch_nm":str};
                        $http.get($scope.csURLs.customBrandTxt, {params:param})
                            .success($scope.csBrandSearchTextSuccess)
                            .error($scope.csBrandSearchError);
                    }else{
                        $scope.csUIData.brandKeywordSearch = "";
                        $scope.csUIData.brandList.length = 0;
                        
                        $scope.csRefreshTabScroll(true);
                    }
                };
                
                
                /**
                 * 브랜드 인덱스 검색
                 */
                $scope.csBrandSearchCap = function(btn, tab, str){
                    $scope.csUIStatus.ajaxLoading = true;
                    $scope.csUIData.brandKeyword = "";
                    $scope.csUIData.brandKeywordSearch = str;
                    var param = {"btnIndex":btn, "tabIndex":tab};
                    $http.get($scope.csURLs.customBrandIdx, {params:param})
                        .success($scope.csBrandSearchTextSuccess)
                        .error($scope.csBrandSearchError);
                };
                
                /**
                 * 브랜드 검색 성공
                 */
                $scope.csBrandSearchTextSuccess = function(data){
                    if(data && data.brandList && data.brandList.items){
                        $scope.csUIData.brandList = data.brandList.items;
                        $scope.csSetItemChecked("brd");
                        $scope.csRefreshTabScroll(true);
                    }
                    $scope.csUIStatus.ajaxLoading = false;
                };
                /**
                 * 브랜드 검색 실패
                 */
                $scope.csBrandSearchError = function(data){
                    $scope.csUIStatus.ajaxLoading = false;
                    console.log("brand search error");
                };
                
                /**
                 * 브랜드 키워드 반전
                 * 속도 이슈로 비활성, 요청 시 적용
                 */
                /*$scope.csReplaceBrandKeyword = function(item){
                    var str = item.brnd_nm;
                    if($scope.csUIData.brandKeyword.length >= 2){
                        str = str.replace($scope.csUIData.brandKeyword, '<b>' + $scope.csUIData.brandKeyword + '</b>');
                    }
                    str += '<span>' + item.cnt + '</span>';
                    return str;
                };*/
                
                
                /**
                 * 초기화 버튼 클릭
                 */
                $scope.csResetCustomSearch = function(tclick){
                    if($scope.csTempSettings.customized || $scope.csCustomSettings.customized){
                        var obj = {
                            callback: $scope.csResetCustomSearchCB,
                            label: { ok:"초기화" }
                        };
                        $scope.confirm_2016("맞춤 설정을<br/>초기화 하시겠습니까?", obj);
                    }
                    
                    if(tclick != undefined){
                        $scope.sendTclick(tclick);
                    }
                };
                
                $scope.csResetCustomSearchCB = function(rtn){
                    if(rtn === true){
                        $scope.csTempSettings.customized = false;
                        $scope.csTempSettings.changed = false;
                        $scope.csTempSettings.category.length = 0;
                        $scope.csTempSettings.brand.length = 0;
                        $scope.csTempSettings.color.length = 0;
                        
                        $scope.csApplyCustomSearchCB(true);
                    }
                }
                
                /**
                 * 선택적용 버튼 클릭
                 */
                $scope.csApplyCustomSearch = function(){
                    var obj = {
                        callback: $scope.csApplyCustomSearchCB
                    };
                    $scope.confirm_2016("맞춤설정이<br/>검색결과에 반영됩니다", obj);
                    
                    $scope.sendTclick("m_dc_customizing_search_CLK_complete_Btn");
                }
                $scope.csApplyCustomSearchCB = function(rtn){
                    if(rtn === true){
                        $scope.csCustomSettings.customized =    $scope.csTempSettings.customized;
                        $scope.csCustomSettings.category =      [].concat($scope.csTempSettings.category);
                        $scope.csCustomSettings.brand =         [].concat($scope.csTempSettings.brand);
                        $scope.csCustomSettings.color =         [].concat($scope.csTempSettings.color);
                        
                        LotteStorage.setLocalStorage("customSearchSettings", $scope.csCustomSettings, 'json');
                        customSearchChange();
                        $scope.csCloseCustomSearch();

                        
                        /* 선택적용시 검색페이지 돌아가기전 검색결과 session 삭제 */
                        /*if(LotteStorage.getSessionStorage("srhLst")) {
                            var srhLstData = LotteStorage.getSessionStorage("srhLst", 'json');

                            if(srhLstData.srhResultData) {
                                srhLstData.srhResultData = null;
                                LotteStorage.setSessionStorage('srhLst', srhLstData, 'json');
                            }
                        }*/
                        
                        /* 바닥페이지 분리로 인한 필요없는 로직 */
                        //$scope.csCloseCustomSearch();
                        
                        // 검색 결과 페이지이면, 다시 검색
                        // if($scope.loadDataParams != undefined && $scope.postParams != undefined){
                        //     if($scope.csCustomSettings.customized && $scope.uiStateObj != undefined){
                        //         $scope.uiStateObj.sortTypeIdx = 0;
                        //         $scope.postParams.sort = $scope.uiStateObj.sortTypeArr[0].value;
                        //     }
                            
                        //     $scope.postParams.rtnType = "E";
                        //     $scope.loadDataParams($scope.postParams.rtnType);
                        // }
                    }
                };
                
                
                $timeout(function(){
                    $scope.csInitCustomSearch();
                }, 100);

                $scope.gotoPrepage = function() { // (뒤로가기 시 앱 인터페이스 호출)
					$scope.sendTclick("m_RDC_header_new_pre");
					if($scope.appObj.isNativeHeader) {
						appSendBack();
					} else {
						history.go(-1);
					}
                };
                
            }
        };
    }]);// end of directive

})(window, window.angular);