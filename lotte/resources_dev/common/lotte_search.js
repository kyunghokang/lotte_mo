(function(window, angular, undefined) {
    'use strict';

    var srhModule = angular.module('lotteSrh', ['angular-carousel']);

    srhModule.controller('srhLayorCtrl', ['$scope', '$http', 'LotteCommon', function($scope, $http, LotteCommon){
        
        $scope.getSrhBestData = function(){
            /*console.log('getSrhAutoData', $scope.keyword);*/            
            $http.get(LotteCommon.srhBestData+"?keyword="+$scope.keyword+"&reqType=N&reqKind=C")
            .success(function(data){
                /*console.log(data);*/
                $scope.srhBestData = data.searchPopList;
             
            })
            .error(function(data, status, headers, config){
                console.log('Error Data :  인기 & 급상승', status, headers, config);
            });
        };
        
        //자동완성 데이타 새로 세팅
        function setSpeedItem(ktype, keystr, cateNum, cateStr){
            var obj = {
                "type" : ktype
                ,"keyword" : keystr
                , "cateNum" : cateNum
                , "cateStr" : cateStr                
            }
            return obj;
        }
        
        $scope.getSrhAutoData = function(){
            /*console.log('getSrhAutoData', $scope.keyword);*/            
            $http.get(LotteCommon.srhAutoData+"?keyword="+$scope.keyword+"&reqType=N&reqKind=C")
            .success(function(data){
                /*console.log(data);*/
                if (data.result && data.result.length > 0 && typeof data.result[0].items != "undefined") {
                    var $items = data.result[0].items,
                        speedItems = [],
                        keystr = "",
                        ktype = true;
                    for(var i = 0;i<data.result[0].totalcount;i++){
                        if(i>0){
                            if($items[i].hkeyword != $items[i-1].hkeyword){
                                speedItems.push(setSpeedItem(true, $items[i].hkeyword, $items[i].linkurl, $items[i].linkname));
                            }
                        }else{
                            speedItems.push(setSpeedItem(true, $items[i].hkeyword, $items[i].linkurl, $items[i].linkname));
                        }                        
                        if($items[i].linkurl != ""){
                            speedItems.push(setSpeedItem(false, $items[i].hkeyword, $items[i].linkurl, $items[i].linkname));
                        }                        
                        
                    }                              
                    $scope.srhAutoData = speedItems;
                } else {
                    $scope.srhAutoData = [];
                }
            })
            .error(function(data, status, headers, config){
                console.log('Error Data :  검색 자동완성', status, headers, config);
            });
        };
    }]);

    srhModule.directive('lotteSearch', ['LotteUtil', 'LotteCommon', '$sce', '$window', '$timeout', function(LotteUtil, LotteCommon, $sce, $window, $timeout) {
        return {
            templateUrl: '/lotte/resources_dev/layer/layer_search.html',
            controller:'srhLayorCtrl',
            replace:true,
            link:function($scope, $el, attrs) {
                $scope.searchLayerDefaultTabIdx = 0;
                $scope.searchLayerTabIdx = 0;

                /*$el.find('#searchForm').attr('action', LotteCommon.searchUrl);*/
                $scope.srhUrl = $sce.trustAsResourceUrl(LotteCommon.searchUrl);

                $scope.fnSrhParam = function(k) {
                    var bpArr = $scope.baseParam.split("&");
                    var rtnStr = "";

                    for (var i in bpArr) {
                        if( bpArr[i].split("=").length > 1 && bpArr[i].split("=")[0] == k ){
                            rtnStr = bpArr[i].split("=")[1];
                            break;
                        }
                    }
                    return rtnStr;
                };

                $scope.isAutoSrhing = false; /*자동완성검색 실행여부, 실행중일때는 최근검색어 노출안함*/

                /*검색레이어 닫기*/
                $scope.closeSrhLayor = function() {
                    $scope.dimmedClose();
                    $scope.showSrh = false;
                    $scope.searchLayerTabIdx = $scope.searchLayerDefaultTabIdx; //eung
                };
                commModule.closeSrhLayor = $scope.closeSrhLayor;
                
                /*최근 검색어 출력*/
                $scope.showRecentKeyword = function(){
                	if($scope.showSrh) {
                		$scope.closeSrhLayor();
                		return true;
                	}
                	$scope.dimmedOpen({
						target:"search",
						callback:this.closeSrhLayor
					});
					$scope.showSrh = true;
                    var viewCnt = 20,
                        recentKeyList = localStorage.getItem('myWord'),
                        recentKeyArray = [];

                    $scope.srhKwLst = "";

					//LotteUtil.elementMoveY($el, 0, $el.height(), 15);

                    if (!recentKeyList) {
                        $scope.recentKwData = undefined;
                    } else {
                        recentKeyArray = recentKeyList.split("|");
                        $scope.recentKwData = [];

                        for (var i = 0; i < recentKeyArray.length; ++i) {
                            if (recentKeyArray[i] != "") {
                                var objData = {'keytxt':recentKeyArray[i]};
                                $scope.recentKwData.push(objData);
                            }
                        }
                    }

                    //$("#cover").addClass("nsh");
                    $scope.getSrhBestData();

                    if (!recentKeyList || recentKeyArray.length == 0) {
                        $scope.searchLayerDefaultTabIdx = 1;
                    } else {
                        $scope.searchLayerDefaultTabIdx = 0;
                    }

                    $scope.searchLayerTabIdx = $scope.searchLayerDefaultTabIdx;
                };

                
                /*최근 검색어 localStorage에 추가*/
                $scope.addSearchKeyword = function(){
                    var myWordList = localStorage.getItem('myWord');

                    if (myWordList == null) {
                        localStorage.setItem('myWord','');
                        myWordList = localStorage.getItem('myWord');
                    }

                    $scope.keyword = $scope.keyword.replace(/(<|>)/g, "");

                    var matchFlag = false;
                    var keyArray = new Array();

                    if (myWordList != null) {
                        keyArray = myWordList.split("|");
                    }

                    angular.forEach(keyArray, function (item, index) {
                        if (item == $scope.keyword) {
                            matchFlag = true;
                            return false;
                        }
                    });

                    if ($scope.keyword == '' || matchFlag) {
                        return false;
                    }

                    if(keyArray.length >= 20){
                        keyArray.splice(19, keyArray.length - 19);
                    }

                    keyArray.unshift($scope.keyword);
                    localStorage.myWord = keyArray.join('|');
                };

                /*선택한 최근 검색어 삭제*/
                $scope.delRecentOneKeyword = function(delkey){
                    $scope.recentKwData.splice(delkey, 1);
                    var recentKeyArray = localStorage.getItem('myWord'), nowKeyArr = [];
                    angular.forEach($scope.recentKwData, function(valObj, key){
                        nowKeyArr.push(valObj.keytxt);
                    });
                    localStorage.setItem('myWord',nowKeyArr.join('|'));
                    if (nowKeyArr == null || nowKeyArr.length == 0){
                        $scope.recentKwData = undefined;
                    }
                    return false;
                };

                /*최근검색어 전체 삭제*/
                $scope.delRecentAllKeyword = function(){
                    if (confirm('최근 검색어를 모두 삭제 하시겠습니까?') == true){
                        localStorage.removeItem('myWord');
                        $scope.recentKwData = undefined;
                    }
                    return false;
                };

                $scope.showAutoSrh = function(e) {
                    /*console.log('getAutoSrh', $scope.keyword, 'trim:', $.trim($scope.keyword), angular.element('#keyword').val());*/
                    $scope.keyword = angular.element('#keyword').val();
                    if (e.keyCode == 13) return false; /*enter*/

                    if ($scope.keyword != undefined && $scope.keyword.length > 0) {
                        $scope.isAutoSrhing = true;
                        $scope.getSrhAutoData();
                    } else {
                        $scope.isAutoSrhing = false;
                        $scope.searchLayerTabIdx = $scope.searchLayerDefaultTabIdx; // 20150930-1
                    }
                };
                /*검색창 입력값 삭제*/
                $scope.delSrhText = function(){
                    $scope.keyword = undefined;
                    $scope.isAutoSrhing = false;
                    return false;
                };

                /*최근검색어 클릭시 제거 
                $scope.goRecentSrh = function(key) {
                    $scope.keyword = $scope.recentKwData[key].keytxt;
                    $scope.tclick = $scope.tClickBase + "Search_RecentSearch_Web";

                    var linkParams = "&reqType=N&keyword=" + $scope.keyword + "&tclick=" + $scope.tclick;
                    $window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + linkParams);
                };
                */
                //eung
                $scope.fn_goSearch = function (keyword, tclick){
                    var linkParams = "&reqType=N&keyword=" + keyword + "&tclick=" + tclick;
                    $scope.locationParam = "SEARCH"; // 검색에서 언로드시 저장 방지용
                    $window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + linkParams);
                }
                
                /*자동완성 검색어 클릭시 , eung 수정함*/                
                $scope.goAutoSrh = function(keyword, param) {
                    $scope.keyword = keyword.replace(/<[a-z/]+>/gi,"");
					$scope.tclick = $scope.tClickBase + "Search_Autocomplete_Web";
                    $scope.saveRecentKeyword(); /*자동 검색 키워드에 저장*/

					var linkParams = "&reqType=N&keyword=" + $scope.keyword;
						linkParams += "&tclick=" + $scope.tclick;
                    $scope.locationParam = "SEARCH"; // 검색에서 언로드시 저장 방지용
                    $window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + linkParams + param);
                };
                //20150930 자동완성 오른쪽 화살표 클릭시 처리 
                $scope.searchSet = function(str){
                    $scope.keyword = str.replace(/<[a-z/]+>/gi,"");
                    $scope.getSrhAutoData();
                    $('#keyword').focus(); // 포커스 셋팅
                }

                /*검색 페이지로 이동*/
                $scope.submitSearch = function(e) {
                    if(typeof $scope.keyword == "undefined" || $scope.keyword == ""){
                        alert('검색어를 입력해주세요.');

                        if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        return false;
                    } else {
						$scope.tclick = $scope.tClickBase + "SrhLayer_Clk_Btn_1";
                        $scope.closeSrhLayor();
                        setTimeout(function(){
                            $scope.saveRecentKeyword();
                            document.getElementById("searchForm").submit();
                            /*angular.element("#searchForm").submit();*/
                        },100);
                    }
                };

                /*검색어 최근 키워드에 추가*/
                $scope.saveRecentKeyword = function () {
                    if (localStorage.getItem('myWord') == null || localStorage.getItem('myWord').length == 0){
                        localStorage.setItem('myWord', $.trim($scope.keyword));
                    } else {
                        var recentKeyList = localStorage.getItem('myWord');
                        var recentKeyArray = recentKeyList.split("|");
                        var matchFlag = false;

                        angular.forEach(recentKeyArray, function (item, index) {
                            if (item == $scope.keyword) {
                                matchFlag = true;
                                return false;
                            }
                        });

                        if (!matchFlag) {
                            $scope.addSearchKeyword();
                        }
                    }
                };

                 /*검색 레이어 영역 트랙킹 코드*/
                $scope.getTrakingCd = function(p_trakingCd) {
                    var returnStr = "";
                    if ("MBL_TRK_CD_RECENT" == p_trakingCd) {           /*키워드 입력전*/
                        returnStr += "M_Search_RecentSearch_Web";
                    }else if ("MBL_TRK_CD_AUTO" == p_trakingCd) {       /*키워드 입력중*/
                        returnStr += "M_Search_Autocomplete_Web";
                    }else if ("MBL_TRK_CD_RESEARCH" == p_trakingCd) {   /*검색결과 : 재검색*/
                        returnStr += "M_Search_Re-search";
                    }else if ("MBL_TRK_CD_SEARCH" == p_trakingCd) {     /*검색결과 : 상품유닛*/
                        returnStr += "M_Search_Result";
                    }else if ("MBL_TRK_CD_CATE" == p_trakingCd) {       /*검색결과 : 카테고리선택*/
                        returnStr += "M_Search_Category";
                    }else if ("MBL_TRK_CD_BRAND" == p_trakingCd) {      /*검색결과 : 브랜드선택*/
                        returnStr += "M_Search_Brand";
                    }else if ("MBL_TRK_CD_SORT" == p_trakingCd) {       /*검색결과 : 정렬기준*/
                        returnStr += "M_Search_Sort";
                    }else if ("MBL_TRK_CD_SORT_RECOM" == p_trakingCd) { /*정렬기준선택 : 추천순*/
                        returnStr += "M_Search_Sort_SuggestionRatings";
                    }else if ("MBL_TRK_CD_SORT_BEST" == p_trakingCd) {  /*정렬기준선택 : 판매순*/
                        returnStr += "M_Search_Sort_Bestseller";
                    }else if ("MBL_TRK_CD_SORT_NEW" == p_trakingCd) {   /*정렬기준선택 : 신상품순*/
                        returnStr += "M_Search_Sort_Newest";
                    }else if ("MBL_TRK_CD_SORT_REVIEW" == p_trakingCd) { /*정렬기준선택 : 상품평순*/
                        returnStr += "M_Search_Sort_BestReview";
                    }else if ("MBL_TRK_CD_SORT_LOW" == p_trakingCd) {   /*정렬기준선택 : 낮은가격순*/
                        returnStr += "M_Search_Sort_LowestPrice";
                    }else if ("MBL_TRK_CD_SORT_HIGH" == p_trakingCd) {  /*정렬기준선택 : 높은가격순*/
                        returnStr += "M_Search_Sort_HighestPrice";
                    }else{
                        returnStr = "";
                    }
                    return returnStr;
                };
            }
        };
    }]);

    srhModule.directive('srhFocus', ['$timeout', function($timeout){
        return function($scope, $el, attrs){
            $scope.$watch(attrs.srhFocus, function(){
                $timeout(function() {
                    if($scope.showSrh){
                        /*$el.focus(); ipad 에서 자동 닫힘(?) test*/
                    }
                },0);
            })
        };
    }]);
    
    srhModule.directive('searchFilterLayer', ['$window', function($window) {
        return {
            replace : true,
            link : function($scope, el, attrs) {          
                var $body = angular.element('body'),
                    $headerSpace = angular.element('#headerSpace');
            
                angular.element($window).on('scroll', function(evt) {
                    //if(!$body.hasClass("fixfixed")) {
                        if (this.pageYOffset > $scope.headerHeight){
                            $headerSpace.css("height",el[0].offsetHeight+"px");
                            el[0].style.cssText = 'z-index:100;position:fixed;top:'+$scope.subHeaderHeight+'px;width:100%;';
                        }else{
                            $headerSpace.css("height","0px");
                            el[0].style.cssText = '';
                        }
                    //}
                });
                /*if($scope.appObj.isIOS) {
                    angular.element(document).on('focus', 'input[type=text],input[type=tel],input[type=number],input[type=search],textarea', function(evt) {
                        el[0].style.cssText = '';
                        $headerSpace[0].style.cssText = '';
                    });
                    angular.element(document).on('blur', 'input[type=text],input[type=tel],input[type=number],input[type=search],textarea', function(evt) {
                        $body.removeClass("fixfixed")
                    });
                }*/
            }
        }
    }]);
    
})(window, window.angular);