(function(window, angular, undefined) {
    'use strict';

    var srhModule = angular.module('lotteSrh', [
        'angular-carousel'
    ]);

    srhModule.controller('srhLayorCtrl', ['$scope', '$http', '$timeout', 'LotteCommon', function($scope, $http, $timeout, LotteCommon){
        
        $scope.getSrhBestData = function(){
            //$http.get(LotteCommon.srhBestData+"?keyword="+$scope.keyword+"&reqType=N&reqKind=C")
            $http.get(LotteCommon.srhBestData+"?reqType=N&reqKind=C")
            .success(function(data){
                $scope.srhBestData = data.searchPopList;
                $timeout($scope.positionBestText, 10);
            })
            .error(function(data, status, headers, config){
                console.log('Error Data :  인기 & 급상승', status, headers, config);
            });
        };
        
        /**
         * 인기검색어 텍스트 중앙정렬
         */
        $scope.positionBestText = function(){
        	var list = angular.element(".recentHotKeyword .hotKeyword li");
        	var li, dv, sp, h;
        	angular.forEach(list, function(item, idx){
        		li = angular.element(item);
        		dv = li.find(".cover div");
        		sp = li.find("span");
        		h = Math.floor((dv.height() - sp.outerHeight()) / 2);
        		sp.css({"transform" : "translate(0, "+ h + "px)", "opacity" : 1});
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
        //20171031 numberFill 추가
       $scope.numberFill = function(idx, length) {
			var strIdx = "" + idx;
			var fillData = "00000000000000000";
			return fillData.substring(0,length - strIdx.length) + strIdx;
		}


        $scope.getSrhAutoData = function(){
            $http.get(LotteCommon.srhAutoData+"?keyword="+$scope.keyword+"&reqType=N&reqKind=C")
            .success(function(data){
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

    srhModule.directive('lotteSearch', ['LotteUtil', 'LotteCommon', 'LotteStorage', '$sce', '$window', '$timeout', '$http', '$interval', 'LotteGA',
        						function(LotteUtil,   LotteCommon,   LotteStorage,   $sce,   $window,   $timeout,   $http,   $interval,   LotteGA) {
        return {
            templateUrl: '/lotte/resources_dev/layer/layer_search_2017.html',
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
                $scope.isAutoSrhingClear = false;
                $scope.deleteRecentCount = 0;
                $scope.doNotAskDeleteAll = false;
                if(LotteStorage.getSessionStorage("SRH_LAYER_doNotAskDeleteAll") === "Y"){
                	$scope.doNotAskDeleteAll = true;
                }
                
                /*검색레이어 닫기*/
                $scope.closeSrhLayor = function(tclick) {
                    $scope.dimmedClose();
                    $scope.showSrh = false;
                    $scope.searchLayerTabIdx = $scope.searchLayerDefaultTabIdx; //eung
                    $scope.latelyGoodsEditing = false;
                    
                    $scope.srhLayerGA("헤더_뒤로가기");
                    if(tclick == "tclick"){
                    	$scope.sendTclick( "m_RDC_SrhLayer_Clk_back" );
                    }
                };
                commModule.closeSrhLayor = $scope.closeSrhLayor;
                
                angular.element($window)
                	.unbind("orientationchange.searchLayer")
                	.bind("orientationchange.searchLayer", function(e){
                		$timeout($scope.positionBestText, 10);
                	});
                
                angular.element("#feSrhLayer")
                	.unbind("touchstart.searchLayer")
                	.bind("touchstart.searchLayer", function(e){
                		var targ = angular.element(e.target);
                		if(targ.hasClass("srh_ipt")){
                			// do nothing
                		}else if(targ.parents(".srh_ipt").length > 0){
                			// do nothing
                		}else{
                			angular.element("#keyword").blur();
                		}
                	});
                
                if($scope.appObj.isAndroid){
                	// 안드로이드 특정 단말에서 키패드 닫을 때 화면 갱신 안되는 문제
                	// 강제로 화면 갱신 발생
                	angular.element(".recentHotKeyword").append('<div id="rhk_dummy" style="display:block;position:relative;height:1px;background-color:white;" />');
	                var zzzzzzzzz = 0;
	                $interval(function(){
	                	if(zzzzzzzzz == 0){
	                		zzzzzzzzz = 1;
	                	}else{
	                		zzzzzzzzz = 0;
	                	}
	                	angular.element("#rhk_dummy").css("transform", "translate("+zzzzzzzzz+"px, 0");
	                }, 100);
                };
                
                $scope.addFakeData = function(){
                	if(location.host == "m.lotte.com"){ return; }
                	
                    $scope.srhBestData.result_best.items[0].hkeyword = "점프수트점프수트점프";
                    $scope.srhBestData.result_best.items[1].hkeyword = "점프수트점프수트점프수트";
                    $scope.srhBestData.result_best.items[2].hkeyword = "점프수트점프수트점프수트점프수트점프수트점프수트점프수트";
                	
                	//$scope.recentKwData
                	var now = new Date();
                	now.setHours(0, 0, 0, 0);
                	$scope.recentKwData.length = 0;
                	for(var i=0; i<10; i++){
                		$scope.recentKwData.push({
                			"keytxt": now.toString(),
                			"day"	: now.getTime()
                		});
                		now.setDate(now.getDate()-1);
                	}
                	
                	saveRecentKeywordLS();
                	processRecentKeyword();
                	//$scope.showRecentKeyword();
                };
                
                
                /**
                 * GA 호출
                 */
                $scope.srhLayerGA = function(act, lab){
        			var ctg = "MO_검색_검색레이어";
        			LotteGA.evtTag(ctg, act, lab);
        		};
                
                /**
                 * 오늘 날짜 구하기
                 */
                /*function getTodayString(){
                	var now = new Date();
                	var m = now.getMonth() + 1;
                	var d = now.getDate();
                	
                	return ((m < 10) ? "0"+m : m) + "." + ((d < 10) ? "0"+d : d);
                }
                var todayString = getTodayString();*/
                function getToday(){
                	var now = new Date();
                	now.setHours(0, 0, 0, 0);
                	return (now).getTime();
                }
                
                function processRecentKeyword(){
					$scope.recentKwData = [];
	                var today = getToday();
	                var week = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
					
                    var myWord = LotteStorage.getLocalStorage("myWord2016");
                	var obj = JSON.parse(myWord);
                	var len = 0;
                	if(obj && obj.list){
                		len = obj.list.length;
                	}else{
                		obj = {"list" : []};
                	}
                	var dif, item, m, d, date;
                	for(var i=0; i<len; i++){
                		item = obj.list[i];
                		dif = today - item.day;
                		if(dif < 0){ dif = 0; }
                		if(!isNaN(dif)){
                			d = Math.floor(dif / 86400000);// 1000 * 60 * 60 * 24
                			switch(d){
                			case 0:
                				item.date = "오늘";
                				break;
                			case 1:
                				item.date = "어제";
                				break;
                			case 2:
                			case 3:
                			case 4:
                			case 5:
                			case 6:
                				date = new Date(item.day);
                				item.date = week[date.getDay()];
                				break;
                			default:
                				date = new Date(item.day);
                				m = date.getMonth() + 1;
                				d = date.getDate();
                				item.date = ((m < 10) ? "0"+m : m) + "." + ((d < 10) ? "0"+d : d);
                				break;
                			}
                		}
                		if(item.$$hashKey != undefined){
                			delete item.$$hashKey;
                		}
                	}
                	$scope.recentKwData = obj.list;
                };
                
                
                /*최근 검색어 출력*/
                $scope.showRecentKeyword = function(){
                    $scope.deleteRecentCount = 0;
                    
                	if($scope.showSrh) {
                		$scope.closeSrhLayor();
                		return true;
                	}
                	$scope.dimmedOpen({
						target:"search",
						callback:this.closeSrhLayor
					});
					$scope.showSrh = true;
                    var viewCnt = 20;
                    $scope.srhKwLst = "";
                    processRecentKeyword();                    
                    $scope.getSrhBestData();                    
                    setSearchLayerTabIdx();
                    
                    $timeout(function(){
                    	angular.element(".nsh_cont li.nsh_li .nsh_div").scrollTop(0);
                    }, 10);
                };
                
                /**
                 * 탭 설정
                 */
                function setSearchLayerTabIdx(){
                    if($scope.recentKwData==null || $scope.recentKwData.length == 0){
                        $scope.searchLayerDefaultTabIdx = 1;
                    }else{
                        $scope.searchLayerDefaultTabIdx = 0;
                    }
                    $scope.searchLayerTabIdx = $scope.searchLayerDefaultTabIdx;
                }
                
                /**
                 * 최근 검색어 로컬스토리지 저장하기
                 */
                function saveRecentKeywordLS(){
                    if($scope.recentKwData.length > 10){
                    	$scope.recentKwData.length = 10;
                    }
                	
                    // $hashkey 빼고 저장
					var obj = {list:$scope.recentKwData};
					var json = JSON.stringify(obj, function(key, value){
						if(key === "$$hashKey"){ return undefined; }
						return value;
					});
					LotteStorage.setLocalStorage("myWord2016", json);
                }
                
                /**
                 * 최근 검색어 다시 검색
                 */
                $scope.researchRecentKeyword = function(item){
                	var keyword = item.keytxt;//angular.element(e.currentTarget).find("em").text();
                	$scope.keyword = keyword;
                	$scope.saveRecentKeyword();
                	$scope.srhLayerGA("최근검색어_선택", keyword);
                	$scope.fn_goSearch(keyword, "m_RDC_SrhLayer_ClkW_Rst_A");
                };
                
                /**
                 * 검색 결과 페이지 URL 구하기
                 */
                $scope.getSearchListUrl = function(item, tclick){
                    var str = "";
                   
                	if(item.hkeyword != undefined){
                		str = item.hkeyword;//인기
                	}else if(item.keytxt != undefined){
                		str = item.keytxt;//최근
                	}else if(item.keyword != undefined){
                		str = item.keyword.replace(/<[a-z/]+>/gi,"");//자동완성
                	}
                    var linkParams = "?reqType=N&keyword=" + encodeURIComponent(str) + "&tclick=" + tclick;
                    if(item.cateNum != undefined && item.cateNum != "" && !item.type){
                    	linkParams += "&cateNo=" + item.cateNum;
                    }
                    linkParams += "&" + $scope.getBaseParam(true);
                    return LotteCommon.searchUrl + linkParams
                };
                
                /**
                 * 인기/급상승 검색어 검색
                 */
                $scope.searchBestKeyword = function(keyword, tclick, idx){
                    $scope.keyword = keyword;
                	$scope.saveRecentKeyword();
                	$timeout($scope.positionBestText, 10);
                	$scope.srhLayerGA("인기검색어_" + idx, keyword);
                	$scope.fn_goSearch(keyword, tclick);
                };

                /*검색어 최근 키워드에 추가*/
                $scope.saveRecentKeyword = function(){
                	var word = $scope.keyword;
                	var len = $scope.recentKwData.length;
                	var key;
                	for(var i=0; i<len; i++){
                		key = $scope.recentKwData[i];
                		if(key.keytxt == word){
                			// update existing keyword
                			key.day = getToday();//todayString;
                			delete key.$$hashKey;
                			$scope.recentKwData.splice(i, 1);
                			$scope.recentKwData.unshift(key);
                			saveRecentKeywordLS();
                			return;
                			break;
                		}
                	}
                	
                	// add new keyword
                	key = {
                		keytxt: word,
                		day: getToday()
                	};
        			$scope.recentKwData.unshift(key);
        			saveRecentKeywordLS();
                };

                /*선택한 최근 검색어 삭제*/
                $scope.delRecentOneKeyword = function(delkey, item){
                	var delAll = false;
                	if(!$scope.doNotAskDeleteAll && $scope.deleteRecentCount >= 2){
                		delAll = confirm("최근 검색어\n전체를 삭제할까요?");
                		if(!delAll){
                			$scope.doNotAskDeleteAll = true;
                			LotteStorage.setSessionStorage("SRH_LAYER_doNotAskDeleteAll", "Y");
                		}
                		
                		if(delAll){
                			$scope.srhLayerGA("최근검색어_전체삭제", "확인");
                		}else{
                			$scope.srhLayerGA("최근검색어_전체삭제", "취소");
                		}
                	}else{
                		$scope.srhLayerGA("최근검색어_삭제", item.keytxt);
                	}
                	
                	if(delAll){
                		// 전체 삭제
                        $scope.deleteRecentCount = 0;
                		$scope.recentKwData.length = 0;
                	}else{
                		// 개별 삭제
                		$scope.deleteRecentCount++;
                		$scope.recentKwData.splice(delkey, 1);
                	}
                	saveRecentKeywordLS();
                	$timeout($scope.positionBestText, 10);
                };

                /*최근검색어 전체 삭제*/
                $scope.delRecentAllKeyword = function(){
                    if (confirm('최근 검색어를 모두 삭제 하시겠습니까?') == true){
                        LotteStorage.delLocalStorage("myWord2016");
                        $scope.recentKwData = undefined;
                        
                        $scope.sendTclick( $scope.tClickRenewalBase + "SrhLayer_Clk_del");
                    }
                    return false;
                };

                $scope.showAutoSrh = function(e) {
                    $scope.keyword = angular.element('#keyword').val();
                    if (e.keyCode == 13) return false; /*enter*/

                    if ($scope.keyword != undefined && $scope.keyword.length > 0) {
                        $scope.isAutoSrhing = true;
                        $scope.isAutoSrhingClear = true;
                        $scope.getSrhAutoData();
                    } else {
                        $scope.isAutoSrhing = false;
                        $scope.isAutoSrhingClear = false;
                        $scope.searchLayerTabIdx = $scope.searchLayerDefaultTabIdx; // 20150930-1
                    }
                };
                
                $scope.showAutoSrhFocus = function(){
                    if ($scope.keyword != undefined && $scope.keyword.length > 0) {
                        $scope.isAutoSrhingClear = true;
                    } else {
                        $scope.isAutoSrhingClear = false;
                    }
                };
                
                $scope.showAutoSrhBlur = function(){
                	$timeout(function(){
                		$scope.isAutoSrhingClear = false;
                	}, 10);
                };
                
                /*검색창 입력값 삭제*/
                $scope.delSrhText = function(){
                    $scope.keyword = undefined;
                    $scope.isAutoSrhing = false;
                    $scope.isAutoSrhingClear = false;
                    $scope.srhLayerGA("자동완성_삭제");
                    return false;
                };

                /*최근검색어 클릭시 제거 */
                $scope.fn_goSearch = function (keyword, tclick){
                	// 모의해킹 대응
                	if(checkProhibitWord(keyword)){
                		return;
                	}
                	
                    var linkParams = "&reqType=N&keyword=" + encodeURIComponent(keyword) + "&tclick=" + tclick;
                    $scope.locationParam = "SEARCH"; // 검색에서 언로드시 저장 방지용
                    $window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + linkParams);
                }
                
                /*자동완성 검색어 클릭시 , eung 수정함*/
                $scope.goAutoSrh = function(idx, param) {
                	var item = $scope.srhAutoData[idx];
                	if(item == undefined){ return; }
                	var keyword = item.keyword;
                    $scope.keyword = keyword.replace(/<[a-z/]+>/gi,"");
					//$scope.tclick = $scope.tClickBase + "Search_Autocomplete_Web";
                    $scope.saveRecentKeyword(); /*자동 검색 키워드에 저장*/
                    
                    $scope.srhLayerGA("자동완성_선택", keyword);

					var linkParams = "&reqType=N&keyword=" + $scope.keyword;
						//linkParams += "&tclick=" + $scope.tclick;
                    $scope.locationParam = "SEARCH"; // 검색에서 언로드시 저장 방지용
                    $window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + linkParams + param);
                };
                //20150930 자동완성 오른쪽 화살표 클릭시 처리
                $scope.searchSet = function(str, flag){
                	//var item = $scope.srhAutoData[idx];
                	//var str = item.keyword;
                	//if(str == undefined || item.keyword == undefined){ return; }
                	if(!$scope.isValidString(str)){ return; }
                    $scope.keyword = str.replace(/<[a-z/]+>/gi,"");
                    $scope.getSrhAutoData();
                    $('#keyword').focus(); // 포커스 셋팅
                    $scope.isAutoSrhing = true;
                    $scope.isAutoSrhingClear = true;
                    
                    if(flag == "recent"){
                    	$scope.srhLayerGA("최근검색어_검색어입력", str);
                    }
                }
                /*$scope.searchSet = function(idx){
                	var item = $scope.srhAutoData[idx];
                	if(item == undefined){ return; }
                	var str = item.keyword;
                    $scope.keyword = str.replace(/<[a-z/]+>/gi,"");
                    $scope.getSrhAutoData();
                    $('#keyword').focus(); // 포커스 셋팅
                }*/

                /*검색 페이지로 이동*/
                $scope.submitSearch = function(e) {
                    if(typeof $scope.keyword == "undefined" || $scope.keyword == ""){
                        alert('검색어를 입력해주세요.');

                        if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        return false;
                    }else if(checkProhibitWord($scope.keyword)){
                    	// 모의해킹 대응
                        if(e){
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        return false;
                    }else{
						$scope.tclick = $scope.tClickBase + "SrhLayer_Clk_Btn_1";
						$scope.saveRecentKeyword();
                        $scope.closeSrhLayor();
                        setTimeout(function(){
                            document.getElementById("searchForm").submit();
                            /*angular.element("#searchForm").submit();*/
                        },100);
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
                
                /**
                 * 모의해킹 대응 2016.10.11
                 */
                var prohibitedWords = ["<", ">", "\"", "append", "applet", "bgsound", "charset", "embed", "eval", "frameset", "href", "innerhtml",
                                       "javascript", "msgbox,", "vbscript", "fscommand", "onabort", "onactivate", "onafterprint", "onafterupdate",
                                       "onbeforeactivate", "onbeforecopy", "onbeforecut", "onbeforedeactivate", "onbeforeeditfocus", "onbeforepaste",
                                       "onbeforeprint", "onbeforeunload", "onbegin", "onblur", "onbounce", "oncellchange", "onchange", "onclick",
                                       "oncontextmenu", "oncontrolselect", "oncopy", "oncut", "ondataavailable", "ondatasetchanged", "ondatasetcomplete",
                                       "ondblclick", "ondeactivate", "ondrag", "ondragend", "ondragleave", "ondragenter", "ondragover", "ondragdrop",
                                       "ondrop", "onend", "onerror", "onerrorupdate", "onfilterchange", "onfinish", "onfocus", "onfocusin", "onfocusout",
                                       "onhelp", "onkeydown", "onkeypress", "onkeyup", "onlayoutcomplete", "onload", "onlosecapture", "onmediacomplete",
                                       "onmediaerror", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover",
                                       "onmouseup", "onmousewheel", "onmove", "onmoveend", "onmovestart", "onoutofsync", "onpaste", "onpause",
                                       "onprogress", "onpropertychange", "onreadystatechange", "onrepeat", "onreset", "onresize", "onresizeend",
                                       "onresizestart", "onresume", "onreverse", "onrowsenter", "onrowexit", "onrowdelete", "onrowinserted", "onscroll",
                                       "onseek", "onselect", "onselectionchange", "onselectstart", "onstart", "onstop", "onsyncrestored", "onsubmit",
                                       "ontimeerror", "ontrackchange", "onunload", "onurlflip", "seeksegmenttime"];
                function checkProhibitWord(keyword){
                	var str = keyword.toLowerCase();
                	var len = prohibitedWords.length;
                	var i, word;
                	for(i=0; i<len; i++){
                		word = prohibitedWords[i];
                		if(str.indexOf(word) >= 0){
                			angular.element("input#keyword").blur();
                			$scope.alert_2016("검색어에 포함할 수 없는 단어가 있습니다.<br/>\"" + word + "\"");
                			return true;
                			break;
                		}
                	}
                	
                	return false;
                }
                
                
                
                /**
                 * 최근검색/인기/최근상품 탭 선택
                 */
                $scope.searchLayerTabSelect = function(idx){
                	$scope.searchLayerTabIdx = idx;
                };
                
                $scope.latelyGoodsList = [];
                $scope.latelyGoodsEditing = false;
                
                /**
                 * 최근본 상품 가져오기
                 */
                function getLatelyGoods(){
                	$scope.latelyGoodsList.length = 0;
                	var str = LotteStorage.getLocalStorage("latelyGoods");
                	if(str == null || str == ""){ return; }
                	str = str.replace(/\|/g, ",");
            		//var latelyViewData = LotteCommon.lateProdData +"?goods_no=" + str;
            		var latelyViewData = LotteCommon.mainLatestProdData +"?latest_prod=" + str;
            		
            		// Data Load
            		$http.get(latelyViewData)
            		.success(function(data){
            			//if(data.max.prod_late_view_list != null) {
           				if(data.latest_prod != null && data.latest_prod.items != null) {
            				//if(data.max.prod_late_view_list.total_count != '0') {
            				if(data.latest_prod.items.length > 0) {
            					//$scope.itemListData = data.max.prod_late_view_list.items;
            					//$scope.latelyGoodsList = data.max.prod_late_view_list.items;
            					$scope.latelyGoodsList = data.latest_prod.items;
            					var len = $scope.latelyGoodsList.length;
            					for(var i=0; i<len; i++){
            						$scope.latelyGoodsList[i].curDispNo = 5572036;
            						$scope.latelyGoodsList[i].curDispNoSctCd = 50;
            					}
            				} else {
            					//$scope.itemListData = [];
            					//$scope.latelyGoodsList.length = 0;
            				}
            			} else {
        					//$scope.latelyGoodsList.length = 0;
            				//$scope.itemListData = [];
            				//$scope.noDataFlag = true;
            			}
            		});
                };
                
                /**
                 * 최근본상품 편집하기
                 */
                $scope.editLatelyGoods = function(){
                	$scope.latelyGoodsEditing = ! $scope.latelyGoodsEditing;
                    $scope.sendTclick( $scope.tClickRenewalBase + "SrhLayer_Clk_edit");
                };
                
                /**
                 * 최근본상품 삭제하기
                 */
                $scope.delLatelyGoods = function(item){
                	if(item == undefined || item.goods_no == undefined){ return; }
                	var n = item.goods_no;
                	var arr = [];
                	var list = $scope.latelyGoodsList;
                	var len = list.length;
                	var p;
                	for(var i=len-1; i>=0; i--){
                		p = list[i];
                		if(p.goods_no == n){
                			list.splice(i, 1);
                		}else{
                			arr.push(p.goods_no);
                		}
                	}
                	LotteStorage.setLocalStorage("latelyGoods", arr.join("|"));
                	
                	$scope.updateLatelyGoodsUI(n, arr.length);
                };
                
                /**
                 * 최근본상품 삭제 후 마이롯데 화면 갱신
                 * @param item_no 삭제한 상품번호
                 * @param length 삭제후 갯수
                 */
                $scope.updateLatelyGoodsUI = function(goods_no, length){
                	// 마이롯데메인 최근본상품 갯수 업데이트
                	if(LotteCommon.mylotteUrl.indexOf(location.pathname) >= 0 && $scope.myLotteMainInfo != undefined){
                		$scope.myLotteMainInfo.lateProdViewCnt = length;
                	}
                	
                	// 최근본상품 리스트 업데이트
                	if(LotteCommon.lateProdUrl.indexOf(location.pathname) >= 0 && $scope.itemListData != undefined){
                		var len = $scope.itemListData.length;
                		var list = $scope.itemListData;
                		for(var i=0; i<len; i++){
                			p = list[i];
                			if(p.goods_no == goods_no){
                				list.splice(i, 1);
                				break;
                			}
                		}
                		$scope.totalCount = list.length;
                	}
                };
                
                
                /*angular.element(".srh_layer .brlistBox, .srh_layer .srh_auto").bind("touchstart", function(){
                	angular.element("#keyword").blur();
                	$scope.showAutoSrhBlur();
                });*/
                

                /**
                 * 특정단말에서 렌더링 오류로 버튼 사라지는 현상 수정
                 */
                $scope.$watch('searchLayerTabIdx', function (newIndex, oldIndex) {
                	$timeout(function(){
                		var btns = $(".nsh_cont li.nsh_li .nsh_btns");
                		btns.stop(true);
                		btns.css("opacity", 0.95);
                		btns.animate({opacity:1}, 10);
                	}, 100);
                	
                	if(newIndex != oldIndex){
                		$scope.sendTclick($scope.tClickRenewalBase + 'SrhLayer_Swp_pg0' + (newIndex+1));
                	}
                });

                /**
                 * 맞춤설정 2017 리뉴얼 후 레이어가 아닌 페이지로 전환
                 * @param type layer 초기 인입(layer), 검색결과에서 인입(list) 분기
                 */
                $scope.customSearchPage = function(type) {
                    var tclick = "";

                    if(type == "srhResult"){
                        tclick = "m_RDC_SrhFilter_Clk_customizing_search_Btn";
                    }else{
                        tclick = "m_RDC_SrhLayer_Clk_customizing_search_Btn";
                    }
                    $window.location.href = LotteCommon.customSearchUrl + '?' + $scope.baseParam + '&inType=' + type + "&tclick=" + tclick;
                };

                /* 맞춤설정 올드앱 함수 방어처리를 위함 */
                $scope.csShowHideCustomSearch = function(flag) {
                    $scope.customSearchPage(flag);
                };
                
                /**
                 * 스타일추천 인입페이지로 이동
                 */
                $scope.goStyleIntro = function() {
                	$scope.srhLayerGA("헤더_스타일추천버튼");
                    var tclick = "m_DC_SrhLayer_Clk_style_Btn";
                    $window.location.href = LotteCommon.stylePushIntroUrl + '?' + $scope.baseParam + "&tclick=" + tclick;
                };

                // 검색 레이어 스타일 추천 애니메이션
                /*$scope.headerStyleRecomIcoCnt = 0;

                function headerStyleRecomIcoAnimate() {
                    if ($scope.headerStyleRecomIcoCnt == 2) {
                        $scope.headerStyleRecomIcoCnt = 0;
                    } else {
                        $scope.headerStyleRecomIcoCnt++;
                    }
                }

                $interval(headerStyleRecomIcoAnimate, 500);*/
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
                	var H = $scope.headerHeight;
                	
                	if ($scope.uiStateObj) {
                		// 검색 & 카테고리
                    	if($(".result_wrap .reated_keyword").length > 0){
                    		// 검색, 결과내검색 블록
                    		H = $(".result_wrap .reated_keyword").outerHeight();
                    	}else if($scope.uiStateObj.voiceSearch == true){
                    		//검색 음성검색
                    		H = -1;
                    	}
                    	// $scope.uiStateObj.emptyResult && !$scope.uiStateObj.emptyKeyword
	                	if ($scope.uiStateObj.relatedKeywordEnabled && $scope.uiStateObj.relatedKeywordNotEmpty) {
                            var reatedKeywordHeight = angular.element(".reated_keyword").outerHeight();
                            // var reatedKeywordHeight = 47;

	                        if (this.pageYOffset > reatedKeywordHeight) {//$scope.headerHeight){//2016.05 검색 리뉴얼 높이값 변경
	                            // $headerSpace.css("height",el[0].offsetHeight+"px");
	                            el[0].style.cssText = 'z-index:49;position:fixed;top:'+($scope.subHeaderHeight+7)+'px;width:100%;';
	                        } else {
	                            // $headerSpace.css("height","0px");
	                            el[0].style.cssText = '';
	                        }
	                    }
                	} else {
                		// other page
	                    //if(!$body.hasClass("fixfixed")) {
	                        if (this.pageYOffset > H){//$scope.headerHeight){//2016.05 검색 리뉴얼 높이값 변경
	                            $headerSpace.css("height",el[0].offsetHeight+"px");
	                            el[0].style.cssText = 'z-index:49;position:fixed;top:'+$scope.subHeaderHeight+'px;width:100%;';
	                        }else{
	                            $headerSpace.css("height","0px");
	                            el[0].style.cssText = '';
	                        }
	                	//}
                	}
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