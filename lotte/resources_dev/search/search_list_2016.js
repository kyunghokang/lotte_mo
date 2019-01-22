(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
 		'lotteComm',
		'lotteSrh',
		'lotteDoubleCoupon',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteProduct',
		'lotteNgSwipe',
		'lotteSlider',
		'angular-carousel',
		'lotteMainPop'
    ]);
	app.filter('pageRange', [function() {
		return function(items, page, pgsize) {
			var newItem = [];
			for(var i =0;i < items.length;i++) {
				if(page*pgsize <= i && (page+1)*pgsize > i) {
					newItem.push(items[i]);
				}
			}
			return newItem;
		}
	}]); 
    app.controller('SearchList',
    		['$scope', '$http', '$filter', '$location', '$window', '$timeout', 'LotteCommon', 'LotteUtil', 'LotteLink', 'commInitData', 'LotteStorage', 'LotteUserService','$compile',
    		function($scope, $http, $filter, $location, $window, $timeout, LotteCommon, LotteUtil, LotteLink, commInitData, LotteStorage, LotteUserService, $compile) {
    	$scope.curDispNoSctCd = "50"; /*인입 전시 코드 (검색 : 50, 기획전/하프찬스 : 20), PC : infw_disp_no_sct_cd*/
		$scope.curDispNo="1749096";

		$scope.showWrap = true; /*Wrapper Show/Hide*/
		$scope.contVisible = true; /*Container Show/Hide*/
		$scope.templateType1 = "search_list";
		$scope.templateType2 = "search_list";
		$scope.screenID = "SrhResult";
		$scope.isShowLoading = false;// Ajax 로드 Flag 초기화
		$scope.productListLoading = false;
		$scope.searchTermsLoading = false;
		$scope.searchTermsChanged = false;
		$scope.productMoreScroll = true;
		$scope.tipShow = false; //툴팁
		$scope.brdShowListCnt = 50; // 20161201 박형윤 추가 - 상세검색 브랜드 노출 개수 (최초시)
		/**
		 * Object 정의
			delSevenYN : "N",//세븐일레븐
			delTdarYN : "N",//오늘도착
			delQuickYN : "N",//퀵배송
		 */
		$scope.uiStateObj = { /*UI 상태값 저장*/
			//templateType: 'list', /* 초기 템플릿 타입 */
			initFlag : true, /*최초 Flag*/
			srhFilterSelectedIdx : -1, /*검색 필터 탭 활성화 인덱스*/
			srhFilterCtgDepth1CtgNo : "", /*선택된 대대카 카테고리 No*/
			srhFilterCtgDepth : 0, /*검색 필터 - 카테고리 활성화 depth*/
			srhFilterCtgFlag : false, /*검색필터 - 카테고리탭 조건 선택 여부*/
			srhFilterBrdFlag : false, /*검색필터 - 브랜드탭 조건 선택 여부*/
			srhFilterBrdSort : "-cnt", /*검색필터 - 브랜드탭 Sortting 값*/
			srhFilterDetailFlag : false, /*검색필터 - 상세검색 조건 선택 여부*/
			srhFilterDetailArr : [
			                      	"deptYN", "tvhomeYN", "brdstoreYN",
			                      	"superYN", "freeDeliYN", "freeInstYN", "pointYN", "pkgYN",
			                      	"delSevenYN", "delTdarYN", "delQuickYN", "smpickYN"
			                     ],//검색픽터 - 상세검색 체크 갯수 여부를 체크하기 위한 전체 탭 배열
			srhFilterSortFlag : false, /*검색필터 - Sortting 탭 조건 선택 여부*/
			sortTypeIdx : 0, /*검색필터 - Sortting 타입 Index*/
			sortTypeArr : [ /*검색필터 - Sortting Label 과 Value 배열*/
				{label : "인기순", shortLabel : "인기순", value : "RANK,1" },
				{label : "판매순", shortLabel : "판매순", value : "TOT_ORD_CNT,1" },
				{label : "상품평 많은순", shortLabel : "상품평", value : "TOT_REVIEW_CNT,1" },
				{label : "최근등록순", shortLabel : "최근등록", value : "DATE,1" },
				{label : "낮은가격순", shortLabel : "낮은가격", value : "DISP_PRICE,0" },
				{label : "높은가격순", shortLabel : "높은가격", value : "DISP_PRICE,1" }
			],
			priceMinUFocus : false, /*검색필터 - 상세검색 최소가 input box focus여부*/
			priceMaxUFocus : false, /*검색필터 - 상세검색 최대가 input box focus여부*/
			emptyResult : false, /*검색 결과가 없는지에 대한 Flag*/
			emptyKeyword : false, /*검색 키워드가 없는지에 대한 Flag*/
			emptyPrdLstFlag : false, /*검색된 상품이 없는지에 대한 Flag*/
			ajaxPageEndFlag : false, /*마지막 페이지까지 로드 됐는지에 대한 Flag*/
			smpickLayerOpenFlag : false, /*스마트픽 지점 레이어 Open 여부*/
			smpickBranchName : "전체", /*검색필터 - 상세검색 - 스마트픽 셀렉트박스 label*/
			
			relatedKwywordOpenFlag	: false,//결과내 검색 팝업 표시여부
			relatedKeywordEntered	: false,//결과내 검색 팝업 텍스트입력중 
			relatedKeywordNotEmpty	: true,//연관키워드 존재여부
			relatedKeywordEnabled	: true,//연관키워드 영역 표시 여부
			detailSearchDataLoaded	: false,//상세설정 데이터 로드 상태
			selectedCategory		:{
				depth1:null,
				depth2:null,
				depth3:null,
				depth4:null,
				ctgName:""
			},
			defaultCtgNo : null,
			rekeywordChanged: false,
			skipListLoad: false,//카테고리 지정 시 리스트 재로드 방지
			voiceSearch:false
			,voiceResultParams:null
			,ageGenderSearched:false//성별연령 모아보기 상태
		};
		
		$scope.srhDetailPriceValidateFlag = true;//가격 검증 완료 Flag
		
		$scope.searchUISetting = {
			isShowSideBar		: false,//상세검색 사이드바 on/off
			isShowSub			: false,//상세검색 서브페이지 on/off
			title				: "카테고리",//상세검색 타이틀
			keywordIncExc		: false,//재검색 포함/제외 on/off
			researchTypeArr		: [{label:"포함단어"}, {label:"제외단어"}],
			researchIdx			: 0,
			isAndroidChrome		: false,//안드로이드 크롬 브라우저 여부
			smartPickSub		:true,
			smartPickList		:false
		};
		$scope.isValidApp = false//유효한 앱 여부
		$scope.validAppOS = "IOS";
		
		$scope.URLs = {
			searchList		: LotteCommon.srhListData2016// 검색결과 데이터
			, searchTerm	: LotteCommon.srhListTermData2016//상세검색 "http://m.lotte.com/publish/getSearch2016Term.jsp"
			, searchAdvtBnr	: LotteCommon.srhListAdvtBrnList// 검색광고배너 기획전배너
			, searchRevPop	: LotteCommon.srhListReivewPop// 리뷰 팝업 데이터
		};
		if(location.host == "localhost:8082"){
			$scope.URLs.searchList = "/json/search/m/getSearchListLC.jsp";
			$scope.URLs.searchTerm = "/json/search/m/getSearchTermLC.jsp";
		}

		/**
		 * 헤더 검색어 키워드 표시
		 */
		$scope.getSearchKeyword = function(){
			if($scope.uiStateObj.voiceSearch){
				return "음성검색 결과";
			}
			return $scope.srhResultData.keyword;
		};
		
		/**
		 * 앱 호출
		 */
		$scope.callAppAPI = function(param){
			if($scope.isValidApp){
				console.log(param)
				if($scope.validAppOS == "AND"){
					// android
					try{
						$window.lottesearch.callAndroid(param);
					}catch(e){}
				}else{
					//ios
					$window.location.href = param;
				}
			}
		}
		
		/**
		 * 앱 버전 체크
		 */
		$scope.checkAppVersion = function(){
			$scope.isValidApp = false;

			if($scope.appObj.isApp){
				if($scope.appObj.isAndroid){
					// android
					if($scope.appObj.isSktApp==false && $scope.appObj.verNumber >= 277){
						$scope.isValidApp = true;
						$scope.validAppOS = "AND";
					}
					
				}else if($scope.appObj.isIOS){
					// ios
					if( ($scope.appObj.iOsType=="iPhone" && $scope.appObj.verNumber >= 2700) || ($scope.appObj.iOsType=="iPad" && $scope.appObj.verNumber >= 236) ){
						$scope.isValidApp = true;
						$scope.validAppOS = "IOS";
					}
				}
			}
			
			// 안드로이드 크롬브라우저 체크 (CSS용 분기처리)
			var ua = (navigator.userAgent + "").toLowerCase();
			$scope.searchUISetting.isAndroidChrome = (ua.indexOf("android")>=0) && (ua.indexOf("chrome")>=0);
		};
		$scope.checkAppVersion();
		
		$scope.postParams = { /*전송 데이터 저장 Input Param*/
			rtnType : "", /*조회 구분값 - P : 페이징, S : 정렬, D : 상세검색, T : 삭세검색 조건 활성화 여부 조회, B : 브랜드, C : 카테고리, 없음 - 전체*/
			keyword : "", /*검색어*/
			orgKeyword : "",
			dpml_no : "1", /*몰 구분 (고정값 닷컴 1)*/
			dispCnt : 30, /*한페이지에 보여질 리스트 갯수*/
			page : 1, /*페이지 Number*/

			ctgNo : "", /*조회 카테고리 dispNo*/
			ctgDepth : 0, /*대대카  : 0, 대카 :1*/
			brdNoArr : [],//조회 브랜드 brandNo 배열
			brdNmArr : [],//조회 브랜드 brandName 배열

			sort : $scope.uiStateObj.sortTypeArr[0].value, /*정렬 타입*/

			deptYN : "N", /*상세검색 - 롯데백화점여부*/
			tvhomeYN : "N", /*상세검색 - 롯데홈쇼핑 여부*/
			smpickYN : "N", /*상세검색 - 스마트픽 여부*/
			smpickBranchNo : null,//"", /*상세검색 - 스마트픽 지점 번호*/
			brdstoreYN : "N", /*상세검색 - 브랜드스토어 여부*/
			superYN : "N", /*상세검색 - 슈퍼 여부*/

			freeDeliYN : "N", /*상세검색 - 무료배송 여부*/
			freeInstYN : "N", /*상세검색 - 무이자 여부*/
			pointYN : "N", /*상세검색 - 포인트 여부*/
			pkgYN : "N", /*상세검색 - 무료포장 여부*/
			
			delSevenYN : "N",//세븐일레븐
			delTdarYN : "N",//오늘도착
			delQuickYN : "N",//퀵배송
			
			selectedColor : [],

			rekeyword : "",// 상세검색 - 결과내 검색어
			reQuery   : [],// 결과 내 검색 (포함단어)
			exQuery   : [],// 결과 내 검색 (제외단어)

			priceMinU : null, /*상세검색 - 최소가*/
			priceMaxU : null, /*상세검색 - 최대가*/

			isVoice: "N", // 201603 모바일 리뉴얼 추가 Parameter
			brdNm: "" // 201603 모바일 리뉴얼 추가 Parameter
		};

		$scope.srhResultData = {}; /*검색 결과*/
		$scope.prdDealList = [];

		$scope.srhDetailData = {//상세 검색 활성화 여부
			srhTerms : {
				dept : false,//롯데백화점 활성화 여부
				tvhome : false,//롯데홈쇼핑 활성화 여부
				smpick : false,//스마트픽 활성화 여부
				smpickBranch : [],//스마트픽 지점 리스트
				brdstore : false,//브랜드스토어 활성화 여부
				super : false,//슈퍼 활성화 여부
				seven: false,//세븐일레븐
				tdar: false,//오늘도착
				quick: false//퀵배송
			},
			srhColorList:[]
		};

		// 맞춤설정 저장값
		$scope.csCustomSettings = {
			customized	: false,
			category	: [],
			brand		: [],
			color		: []
		};

		// 맞춤설정 임시
		$scope.csTempSettings = {
			customized	: false,
			changed		: false,
			category	: [],
			brand		: [],
			color		: []
		};
				
		$scope.csCustomBaseData = {};

		var baseData = LotteStorage.getSessionStorage("customSearchBaseData", 'json');
		if(baseData != null){
			// session
			$scope.csCustomBaseData = baseData;
		}
		
		var customData = LotteStorage.getLocalStorage("customSearchSettings", 'json');
		if(customData != null){
			$scope.csCustomSettings = customData;
		}

		$scope.csResetCustomSearch = function (tclick) {
			if($scope.csCustomSettings.customized) {
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
				$scope.csTempSettings.changed =	false;
				$scope.csTempSettings.category.length = 0;
				$scope.csTempSettings.brand.length = 0;
				$scope.csTempSettings.color.length = 0;
				
				$scope.csApplyCustomSearchCB(true);
			}
		}

		$scope.csApplyCustomSearchCB = function(rtn){
			if(rtn === true){
				$scope.csCustomSettings.customized =	$scope.csTempSettings.customized;
				$scope.csCustomSettings.category =		[].concat($scope.csTempSettings.category);
				$scope.csCustomSettings.brand =			[].concat($scope.csTempSettings.brand);
				$scope.csCustomSettings.color =			[].concat($scope.csTempSettings.color);
				
				LotteStorage.setLocalStorage("customSearchSettings", $scope.csCustomSettings, 'json');
				
				// $scope.csCloseCustomSearch();
				
				// 검색 결과 페이지이면, 다시 검색
				if($scope.loadDataParams != undefined && $scope.postParams != undefined){
					if($scope.csCustomSettings.customized && $scope.uiStateObj != undefined){
						$scope.uiStateObj.sortTypeIdx = 0;
						$scope.postParams.sort = $scope.uiStateObj.sortTypeArr[0].value;
					}
					
					// 오탈자인 경우 키워드 재설정
					if($scope.srhResultData.orgKeyword != null && $scope.srhResultData.orgKeyword != ""){
						$scope.postParams.keyword = $scope.srhResultData.orgKeyword;
					}
					
					$scope.postParams.rtnType = "E";
					$scope.loadDataParams($scope.postParams.rtnType);
				}
			}
		};

		/*페이지 인입시 처리*/
		$scope.postParams.keyword = decodeURIComponent(commInitData.query.keyword); /*URL Params 얻어오기 (keyword)*/
		$scope.postParams.keyword = LotteUtil.replaceAll($scope.postParams.keyword, "+" ," ");
		$scope.postParams.keyword = ($scope.postParams.keyword).replace(/(<([^>]+)>)/ig,"");
		$scope.postParams.orgKeyword = $scope.postParams.keyword;
		//$scope.postParams.ctgNo = commInitData.query.cateNo; /*URL Params 얻어오기 (ctgNo)*/
		$scope.postParams.isVoice = commInitData.query.isVoice == "Y" ? "Y" : "N";
		$scope.uiStateObj.voiceSearch = $scope.postParams.isVoice == "Y";
		
		if( !(commInitData.query.cateNo == undefined || commInitData.query.cateNo == "") ){
			$scope.uiStateObj.defaultCtgNo = commInitData.query.cateNo;
		}

		/*if ($scope.postParams.ctgNo) { 레이어 검색에서 카테고리 정보가 넘어왔을 경우 해당 State로 맞춰주기
			$scope.uiStateObj.srhFilterCtgDepth1CtgNo = $scope.postParams.ctgNo;
			$scope.uiStateObj.srhFilterCtgDepth = 1;
			$scope.uiStateObj.srhFilterCtgFlag = true;
		}*/
		
        /*20160112 검색만족도*/
        /*
        login_id (로그인id) – 로그인상태면 id 없으면 빈값
        site_no (사이트번호) – 닷컴1 엘롯데 39506 
        srchw_nm (검색키워드) 
        stfc_sct_cd(만족구분코드)
        좋아요 :  3
        다양성 부족 :  1
        관련없는 상품 :  1 
        찾는상품 없음 :  2
        add_op_cont(선택의견) – 선택한 버튼 text
        */
        $scope.surKeyword = "";
        $scope.resurKeyword = "";
        $scope.survey_state = 0;
        $scope.survey_noprod_stat = false;
        $scope.survey_check = function(val, str){            
            $scope.survey_state = val;
            if(val == 0 || val == 4){
                $scope.survey_noprod_stat = false;
            }
            if(val > 1){
                var stfc_arr = [0, 0, 3, 4, 2, 1];
                var surveryParam = {
                    login_id : LotteUserService.getCookie("LOGINID"),
                    site_no : "1",
                    srchw_nm : "" + $scope.srhResultData.keyword + ' ' + $scope.postParams.reQuery.join(" "),//.replace( /,/g, ' '),
                    stfc_sct_cd : stfc_arr[val],
                    add_op_cont : str                
                }
                $http.get(LotteCommon.searchSurvery, {params:surveryParam});
                    //.success(function (data) {});
            }
        };
        
        /**
         * 찾는상품 없음 전송하기
         */
        $scope.survey_noprod_send = function(){
        	var str = angular.element(".survey_noprd_ta:visible").val();
        	if(str.length == 0){
        		$scope.alert_2016("찾으시는 상품을 입력해 주세요.");
        		return;
        	}
        	
        	$scope.survey_state = 4;
        	$scope.survey_noprod_stat = false;
        	var surveryParam = {
                login_id : LotteUserService.getCookie("LOGINID"),
                site_no : "1",
                srchw_nm : "" + $scope.srhResultData.keyword + ' ' + $scope.postParams.reQuery.join(" "),//.replace( /,/g, ' '),
                stfc_sct_cd : 2,
                add_op_cont : "찾는상품 없음",
                cust_op_cont : str
            }
            $http.get(LotteCommon.searchSurvery, {params:surveryParam});
        };
        
        /**
         * 찾는상품 없음
         */
        $scope.survey_noprod = function(){
        	$scope.survey_noprod_stat = true;
        };
        
        //검색만족도 위치 세팅 
        $scope.setSurveyPos = function(){
        	var rsnum = $(".unitWrap").find("ol > li").length;
        	var pos = 29;
        	if($scope.templateType1 == "search_image6"){
        		pos = 23;
        	}
        	var ell;
        	if($(".survey.inst").length == 0){
				$scope.surKeyword = $scope.postParams.keyword;
				$scope.resurKeyword = $scope.postParams.reQuery;
				if(rsnum < 29){
					$timeout(function(){
						ell = $compile($(".survey").clone().addClass("inst"))($scope);
						if(rsnum == 0){
							angular.element(".empty_result_wrap .favlst").before(ell);
						}else{
							angular.element("#footer").before(ell);
						}
						
						if($scope.uiStateObj.emptyResult){
							$timeout(function(){
				    			var len = angular.element(".survey.inst").length;
				    			if(len > 0){
				    				$scope.survey_state = 1;
				    				$scope.survey_noprod_stat = true;
				    			}
							}, 1);
						}
					}, 0);
                    
                }else{
					//20160120 상품갯수에 따른 위치 변경, 25, 33.33, 50, 100 4개 케이스
					/*var liwidth = ($(".unitWrap").find("ol > li").width()/$(".unitWrap").width())*100; //상품리스트의 너비 %
					var lineCount = 1;
					if(liwidth > 40 && liwidth < 60){
					    lineCount = 2;
					}else if(liwidth > 30 && liwidth < 40){
					    lineCount = 3;
					}else if(liwidth < 30){
					    lineCount = 4;
					}
					if(rsnum >= 30){
					    rsnum = 30;
					}
					pos = rsnum - rsnum%lineCount - 1;
					if(pos < lineCount){
					    pos = rsnum - 1;
					}*/
					ell = $compile($(".survey").clone().addClass("inst"))($scope);
					//ell = $(".survey").clone(true).addClass("inst");
					if($(".prod_list_01").length > 0){
						angular.element(".prod_list_01 > li").eq(pos).after(ell);
					}else if($(".prod_list_02").length > 0){
						angular.element(".prod_list_02 > li").eq(pos).after(ell);
					}
                }
            }else{
            	//갯수가 변경된 경우
            	if(rsnum >= 30 && $(".unitWrap").find(".survey ").length == 0){
            		$(".survey.inst").remove();
                    ell = $compile($(".survey").clone().addClass("inst"))($scope);
                    if($(".prod_list_01").length > 0){
                    	angular.element(".prod_list_01 > li").eq(pos).after(ell);
                    }else if($(".prod_list_02").length > 0){
                    	angular.element(".prod_list_02 > li").eq(pos).after(ell);
                    }
            	}
            }
        	$timeout(function(){
        		angular.element(".survey.inst .caseA > .title span").text($scope.surKeyword);
        		angular.element(".survey.inst .caseA > .title var").text($scope.resurKeyword.join(" "));
        		angular.element(".survey.inst").show();
        	}, 1000);
        	$timeout(function(){
        		angular.element(".survey.inst .caseA > .title span").text($scope.surKeyword);
        		angular.element(".survey.inst .caseA > .title var").text($scope.resurKeyword.join(" "));
        		angular.element(".survey.inst").show();
        	}, 2000);
        };
        $scope.winW = $(window).width();
        angular.element($window).on({
            /*"click" : function () {
                setTimeout(function(){
                    $scope.setSurveyPos();
                }, 100);
            },*/
            "resize" : function () {
        		if($scope.winW != $(window).width()){
        			$scope.winW = $(window).width();
                	$(".survey.inst").remove();
                    setTimeout(function(){
                        $scope.setSurveyPos();
                    }, 100);    
                }
            }               
        });        
        //----------------------------------------------------------
        
        // 딜리스트 표시 여부
        $scope.checkDealListShow = function(){
        	if($scope.templateType1 == "search_image6"){//큐레이션이면 비노출
        		return false;
        	}
        	if($scope.uiStateObj.defaultCtgNo != null){
        		return false;
        	}
        	if($scope.prdDealList == undefined || $scope.prdDealList.length==0){
        		return false;
        	}
        	if($scope.uiStateObj.srhFilterCtgFlag || $scope.uiStateObj.srhFilterBrdFlag || $scope.uiStateObj.srhFilterDetailFlag){
        		return false;
        	}
        	if($scope.postParams.reQuery.length > 0 || $scope.postParams.exQuery.length > 0){
        		return false;
        	}
        	if($scope.csCustomSettings!=undefined && $scope.csCustomSettings.customized && $scope.uiStateObj.sortTypeIdx==0){
        		return false;
        	}
        	return true;
        	//!(prdDealList.length==0 || uiStateObj.srhFilterCtgFlag || uiStateObj.srhFilterBrdFlag || uiStateObj.srhFilterDetailFlag || postParams.reQuery.length>0 || postParams.exQuery.length>0)
        };
        
        $scope.retriveTemplateType = function(){
			// 전시유닛타입 지정
        	if(false && $scope.uiStateObj.emptyResult){// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        		$scope.templateType1 = "search_list";
        		$scope.templateType2 = "search_list";
        	}else{
				if($scope.uiStateObj.ageGenderSearched || $scope.postParams.isVoice == "Y" || $scope.postParams.isVoice == "T"){
					$scope.templateType1 = "search_list";
					$scope.templateType2 = "search_list";
				}else{
					if($scope.srhResultData.dispUnitType != undefined && $scope.srhResultData.dispUnitType == "01"){
						// 큐레이션형
						$scope.templateType1 = "search_image6";
						$scope.templateType2 = "search_image";
					}else{
						// 일반형
						$scope.templateType1 = "search_list";
						$scope.templateType2 = "search_list";
					}
				}
        	}
        	
			$timeout(function(){
				// 템플릿 깜박임 방지
				angular.element(".listWrap").css("opacity", 1);
			}, 1);
        }
        
        /**
         * 스크롤 시에 다음페이지 불러오기
         */
		$scope.loadMoreData = function() {
			if($scope.isShowLoading || $scope.productListLoading || $scope.searchTermsLoading){
				return false;// 전송 요청 중일 경우 중복 실행 방지
			}
			if($(window).height() == $(document).height()){ return; }// 레이어 딤드 상태 예외처리
			
			var tClickStr = $scope.tClickBase + "SrhResult_Scl_Prd_page"+($scope.postParams.page+1);
			$scope.sendTclick(tClickStr);// lotte-comm.js - TCLICK 수집
			
			$scope.postParams.rtnType = "P";// 조회 구분값 P : 페이징으로 설정
			$scope.loadDataParams($scope.postParams.rtnType);//결과값 조회
		}

		/**
		 * 검색 데이터 타입별 Parameter 생성
		 */
		$scope.loadDataParams = function (type) {
			if($scope.isShowLoading || $scope.productListLoading || $scope.searchTermsLoading){
				return false;// 전송 요청 중일 경우 중복 실행 방지
			}
			
			if(!type){
				type = "";// 타입이 넘어오지 않았을 경우 default로 세팅
			}

			var loadParam = {};// 전송 Parameter 초기화
			loadParam.page = 1;// 호출 페이지 초기화

			switch (type) {
				case "P" :// 페이징
					loadParam.page = $scope.postParams.page + 1;// 페이지
				case "S" :// 정렬
					loadParam.sort = $scope.postParams.sort;
				case "D" :// 상세 검색
				case "E" :// 상세 검색
					if($scope.postParams.rekeyword != ""){
						// 결과내 검색 키워드
						$scope.postParams.keyword +=  encodeURIComponent(" " + $scope.postParams.rekeyword);
						$scope.postParams.orgKeyword = $scope.postParams.keyword; //20160119 조건검색시 세션스토리지 저장 관련 수정 
						$scope.postParams.rekeyword = "";// 결과내 검색 키워드 초기화

						// 결과내 검색 키워드가 있을 경우 상세조건 비활성화 오류 방지를 위하여 '매장조건' 초기화
						$scope.postParams.deptYN = "N";
						$scope.postParams.tvhomeYN = "N";
						$scope.postParams.superYN = "N";
						$scope.postParams.brdstoreYN = "N";
						$scope.postParams.smpickYN = "N";
						$scope.postParams.delSevenYN = "N";
						$scope.postParams.delTdarYN = "N";
						$scope.postParams.delQuickYN = "N";
					}

					if ($scope.postParams.deptYN == "Y") {// 롯데백화점 조건 선택 여부
						loadParam.deptYN = $scope.postParams.deptYN;
					}

					if ($scope.postParams.tvhomeYN == "Y") {// 롯데홈쇼핑 조건 선택 여부
						loadParam.tvhomeYN = $scope.postParams.tvhomeYN;
					}

					if ($scope.postParams.smpickYN == "Y") {// 스마트픽 조건 선택 여부
						loadParam.smpickYN = $scope.postParams.smpickYN;
					}

					if ($scope.postParams.smpickYN == "Y" && !($scope.postParams.smpickBranchNo == null || $scope.postParams.smpickBranchNo == "")) {// 스마트픽 지점 번호 여부
						loadParam.smpickBranchNo = $scope.postParams.smpickBranchNo;
					}

					if ($scope.postParams.brdstoreYN == "Y") {// 브랜드스토어 조건 선택 여부
						loadParam.brdstoreYN = $scope.postParams.brdstoreYN;
					}

					if ($scope.postParams.superYN == "Y") {// 롯데슈퍼 조건 선택 여부
						loadParam.superYN = $scope.postParams.superYN;
					}

					if ($scope.postParams.freeDeliYN == "Y") {// 무료배송 조건 선택 여부
						loadParam.freeDeliYN = $scope.postParams.freeDeliYN;
					}

					if ($scope.postParams.freeInstYN == "Y") {// 무이자 조건 선택 여부
						loadParam.freeInstYN = $scope.postParams.freeInstYN;
					}

					if ($scope.postParams.pointYN == "Y") {// 포인트 조건 선택 여부
						loadParam.pointYN = $scope.postParams.pointYN;
					}
					
					if ($scope.postParams.pkgYN == "Y") {// 무료포장 조건 선택 여부
						loadParam.pkgYN = $scope.postParams.pkgYN;
					}

					if($scope.postParams.delSevenYN == "Y"){// 세븐일레븐
						loadParam.delSevenYN = "Y";
					}

					if($scope.postParams.delTdarYN == "Y"){// 오늘배송
						loadParam.delTdarYN = "Y";
					}

					if($scope.postParams.delQuickYN == "Y"){// 퀵배송
						loadParam.delQuickYN = "Y";
					}
					
					if($scope.postParams.pop != undefined && $scope.postParams != ""){//나이/성별 모아보기
						loadParam.pop = $scope.postParams.pop;
					}

					if ($scope.postParams.priceMinU && $scope.postParams.priceMinU >= $scope.srhResultData.price.min) { /*최소가 조건 선택 여부*/
						loadParam.priceMinU = $scope.postParams.priceMinU;
					}

					if ($scope.postParams.priceMaxU && $scope.postParams.priceMaxU <= $scope.srhResultData.price.max) { /*최대가 조건 선택 여부*/
						loadParam.priceMaxU = $scope.postParams.priceMaxU;
					}
					
					loadParam.colorCd = $scope.postParams.selectedColor.join(",");/* colors */
				case "T" :// 상세 검색 조건 활성화 여부
				case "B" :// 브랜드 선택 검색
					if ($scope.postParams.brdNoArr && $scope.postParams.brdNoArr.length > 0) { /*선택된 브랜드가 있는지 판단*/
						loadParam.brdNo = $scope.postParams.brdNoArr.join(); /*Array 형태로 넘어가는데 개발쪽과 협의 필요*/
					}
				case "C" :// 카테고리 선택 검색
				case "K":// 키워드 변경
				default :// 기본
					if ($scope.postParams.ctgNo) {// 선택된 카테고리가 있는지 판단
						loadParam.ctgNo = $scope.postParams.ctgNo;
					}

					//if ($scope.postParams.ctgNo && $scope.postParams.ctgDepth >= 0 && $scope.postParams.ctgDepth <= 1) {// 선택된 카테고리 depth가 정상적인지 판단
					if ($scope.postParams.ctgNo && $scope.postParams.ctgDepth >= 0 && $scope.postParams.ctgDepth <= 3) {// 선택된 카테고리 depth가 정상적인지 판단
						loadParam.ctgDepth = $scope.postParams.ctgDepth;
						loadParam.dsCtgDepth = $scope.postParams.ctgDepth + 1;
					}

					loadParam.rtnType = type;// 요청 구분
					loadParam.keyword = "" + $scope.postParams.keyword;// 검색 키워드
					var requery = "" + $scope.postParams.reQuery.join(" ");
					if(requery != ""){
						loadParam.keyword += " " + requery;
					}
					var exquery = "" + $scope.postParams.exQuery.join(" !");
					if(exquery != ""){
						loadParam.keyword += " !" + exquery;
					}
					//loadParam.reQuery = "";// 결과내 검색 (포함)
					//loadParam.exQuery = "";// 결과내 검색 (제외)
					//loadParam.reQuery = "" + decodeURI($scope.postParams.reQuery.join(","));// 결과내 검색 (포함)
					//loadParam.exQuery = "" + decodeURI($scope.postParams.exQuery.join(","));// 결과내 검색 (제외)
					loadParam.sort = $scope.postParams.sort;// 정렬 기준
					break;
			}

			if($scope.postParams.chkTypo === "N"){
				loadParam.chkTypo = $scope.postParams.chkTypo;
			}
			
			// 201603 모바일 리뉴얼 추가 - 박형윤
			loadParam.isVoice = $scope.postParams.isVoice;// 음성 검색 여부
			if ($scope.postParams.brdNm && $scope.postParams.brdNm != "") {
				loadParam.brdNm = $scope.postParams.brdNm;
			}
			
			$scope.appendCustomSettings(loadParam);
			
			var loadParam2;
			if($scope.uiStateObj.defaultCtgNo != null){
				loadParam2 = angular.extend({}, loadParam);
				loadParam2.ctgNo = $scope.uiStateObj.defaultCtgNo;
				loadParam2.ctgDepth = 0;
				loadParam2.dsCtgDepth = 1;
			}else{
				loadParam2 = loadParam;
			}
			
			if($scope.uiStateObj.skipListLoad==true){
				//카테고리 지정 시 리스트 재로드 방지
				$scope.uiStateObj.skipListLoad = false;
			}else{                
				$scope.loadListData(loadParam2);
			}
			

			if($scope.uiStateObj.voiceResultParams != null){
				var vp = $scope.uiStateObj.voiceResultParams;
				if(vp.VBrdNm != undefined && vp.VBrdNm != ""){
					loadParam.brdNm = vp.VBrdNm;
				}
				if(vp.VColorCd != undefined && vp.VColorCd != ""){
					loadParam.colorCd = vp.VColorCd;
				}
				if(vp.VSmpickYN == "Y"){
					loadParam.smpickYN = "Y";
					loadParam.smpickBranchNo = "";
					if(vp.VSmpickBranchNo != undefined && vp.VSmpickBranchNo != ""){
						loadParam.smpickBranchNo = vp.VSmpickBranchNo;
					}
				}
				if(vp.VDelSevenYN == "Y"){
					loadParam.delSevenYN = "Y";
				}
				if(vp.VPriceMaxU != undefined && vp.VPriceMaxU != ""){
					loadParam.priceMaxU = vp.VPriceMaxU;
				}
				if(vp.VPriceMinU != undefined && vp.VPriceMinU != ""){
					loadParam.priceMinU = vp.VPriceMinU;
				}
				if(vp.VKeyword != undefined){// && vp.VKeyword != ""){
					loadParam.keyword = vp.VKeyword;
				}
			}
			
			if($scope.postParams.isVoice != "Y"){
				switch(type){
				case "S":// 정렬
				case "P":// 페이징
				case "E":// 상세검색
					// 검색조건 호출 안함
					break;
				case "C":// 카테고리
					// 대중소카만 검색조건 호출(대대 호출안함)
					//if(loadParam.ctgDepth >= 1){
					$scope.loadTermData(loadParam);
					//}
					break;
				default:
					$scope.loadTermData(loadParam);
				break;
				}
			}
			
			//if($scope.uiStateObj.defaultCtgNo == null){
				//$scope.loadListData(loadParam);
			//}
			
			//$scope.appendCustomSettings(loadParam);// 맞춤설정 파라메터 추가
			
			$scope.searchTermsChanged = true;
		};

		$scope.reMappingDealUnitData = function(data) {
			var convertFields = {
				flag : 'flag', // 배열 변경
				sale_rate : 'saleRate',
				brnd_nm : 'brandNm',
				coupon : 'useCpn', // true:false
				is_dept : 'isDept',
				is_tvhome : 'isTvhome',
				md_tip : 'mdTip',
				img_url : 'imgUrl',
				goods_no : 'goodsNo',
				goods_nm : 'goodsNm',
				copy_nm : 'copyNm',
				price1 : 'price1',
				price2 : 'price',
				sale_cnt : 'saleCnt',
				curDispNo : 'curDispNo',
				plan_prod_yn: 'multiPrice',
				has_coupon: 'useCpn'
			}
			
			var defaultConvertStruct = {    
				unix_mix : false,
				sale_rate : "",
				coupon : "", // true:false
				tv_card : false,
				is_dept : "",
				is_tvhome : "",
				copy_nm : "",
				link_url : "", // 상품 link url (/product/product_view.do?goods_no&commonParam&curDispNoSctCd=44)
				img_url : "",
				goods_no : "",
				goods_nm : "",
				price1 : 0,
				price2 : 0,
				sale_cnt : 0,
				pmg_gdas_cnt : 0,
				sold_out : false,
				curDispNo : "",
				curDispNoSctCd : 65,
				genie_yn : false,
				plan_prod_yn : false,
				brnd_nm : "",
				has_coupon: false
			}
			var retData = [];
			angular.forEach(data, function(item, index) {
				var newData = angular.copy(defaultConvertStruct);
				angular.forEach(convertFields, function(val, key) {
					if(key == 'link_url') {
						newData[key] = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item['goodsNo'] + '&curDispNoSctCd=44';
					} else if(key == 'has_coupon') {
						newData[key] = item[val] == 'coupon' ? true:false;
					} else if(key == 'sale_rate') {
						if(item[val] == null) {
							newData[key] = 0;
						} else {
							newData[key] = parseInt(item[val]);
						}
					} else if(key == 'goods_nm') {
						newData[key] = LotteUtil.replaceAll(item['goodsNm'],'<!HS>','<STRONG>');
						newData[key] = LotteUtil.replaceAll(newData[key],'<!HE>','</STRONG>');
					} else if(key == 'md_tip') {
						newData['copy_nm'] = item[val];
					} else if(key == 'copy_nm') {
						if(item[val] != '') {
							newData['brnd_nm'] = "";
							newData['goods_nm'] = LotteUtil.replaceAll(item[val],'<!HS>','<STRONG>');
							newData['goods_nm'] = LotteUtil.replaceAll(newData['goods_nm'],'<!HE>','</STRONG>');
						}
					} else {
						newData[key] = item[val];
					}
				});
				retData.push(newData); 
			});
			return retData;
		}
		
		$scope.reMappingPldUnitData = function(data) {
			var convertFields = {
				goods_no : 'goodsNo',
				goods_nm : 'goodsNm',
				brnd_nm : 'brandNm',
				img_url : 'imgUrl',
				original_price : 'price1',
				discounted_price : 'price2',
				sale_rate : 'saleRate',
				flag : 'flag',
				review_count : 'reviewCnt',
				avg_gdas_stfd_val : 'avg_gdas_stfd_val',
				smartpick_yn: 'isSmpick',
				limit_age_yn: 'byrAgelmt',
				is_himart : 'isHimart',
				is_dept : 'isDept',
				is_tvhome : 'isTvhome',
				is_youngplz : 'isYoung',
				is_super : 'isSuper',
				is_sale_promotion: 'goodsCmpsCd',
				outlnk : 'outlnk',
				outlnkMall : 'outlnkMall',
				curDispNo: 'curDispNo',
				has_coupon: 'useCpn',
				hash_list: 'hash_list',
				find_age: 'find_age',
				find_gender: 'find_gender'
			}
			
			var defaultConvertStruct = {    
				goods_no : '',
				goods_nm : '',
				brnd_nm : '',
				img_url : '',
				img_url_550 : '',
				original_price : '',
				discounted_price : '',
				sale_rate : '',
				flag : '',
				is_sold_out : false,
				has_coupon : false, // 쿠폰 존재 여부 (AS-IS : useCpn = 'coupon' 일경우 true)
				has_wish : false,
				is_sale_promotion : false,
				review_count : 0,
				bought_sum : 0, 
				md_tip : '',
				promotion_text : '',
				isdlex_free : false, // (AS-IS : flag값에 무료배송 포함이면 true)
				smartpick_yn : false, // 스마트픽(AS-IS : isSmpick true/false 판단 Y or N)
				sold_out_cd_yn : 'N', // 품절임박 유무(기본 'N')
				limit_age_yn : 'N', // 성인 이미지 뷰 허용 여부(AS-IS : byrAgelmt 값으로 판단 'Y' OR 'N')
				link_url : '', 
				is_himart : '',
				is_dept : '',
				is_youngplz : '',
				outlnk: '',
				outlnkMall: '',
				curDispNo: '',
			}
			var retData = [];
			angular.forEach(data, function(item, index) {
				var newData = angular.copy(defaultConvertStruct);
				angular.forEach(convertFields, function(val, key) {
					if(key == 'has_coupon') {
						newData[key] = item[val] == 'coupon' ? true:false;
					} else if(key == 'flag') {
						if(item['flag'] && item['flag'].indexOf('무료배송') > -1) {
							newData['isdlex_free'] = true;
						}
					} else if(key == 'is_sale_promotion') {
						if(item['goodsCmpsCd'] == '30') {
							newData[key] = true;
						}
					} else if(key == 'sale_rate') {
						if(item[val] == null) {
							newData[key] = 0;
						} else {
							newData[key] = parseInt(item[val]);
						}
					} else if(key == 'smartpick_yn') {
						newData[key] = item[val] ? 'Y':'N';
					} else if(key == 'limit_age_yn') {
						newData[key] = item[val] == 19 ? 'Y':'N';
					} else if(key == 'goods_nm') {
						newData[key] = LotteUtil.replaceAll(item['goodsNm'],'<!HS>','<STRONG>');
						newData[key] = LotteUtil.replaceAll(newData[key],'<!HE>','</STRONG>');
					} else {
						newData[key] = item[val];
					}				
				});
				if(item.isDlvToday != undefined){
					newData.isDlvToday = item.isDlvToday;
				}
				if(item.isDeptPickYn != undefined){
					newData.isDeptPickYn = item.isDeptPickYn;
				}
				if(item.isCrsPickYn != undefined){
					newData.isCrsPickYn = item.isCrsPickYn;
				}
				if(item.isDlvQuick != undefined){
					newData.isDlvQuick = item.isDlvQuick;//퀵배송 2016.10.24
				}
				/* 2016.08.18 배송메세지 강화*/
				/* 2016.11.24 무이자 노출 */
				if(item.nint_card_flag != undefined){
					newData.nint_card_flag = item.nint_card_flag;
				}
				
				// 리뷰형
				newData.reivew_list = [];
				if(item.gdasInfo1 != undefined && item.gdasInfo1.gdasNo != undefined && item.gdasInfo1.gdasNo != ""){
					newData.reivew_list.push(item.gdasInfo1);
				}
				if(item.gdasInfo2 != undefined && item.gdasInfo2.gdasNo != undefined && item.gdasInfo2.gdasNo != ""){
					newData.reivew_list.push(item.gdasInfo2);
				}
				
				retData.push(newData);
			});
			return retData;
		}
		
		/**
		 * 검색, 색상 업데이트
		 */
		$scope.updateColors = function(colors){
			if(colors == undefined){
				$scope.srhDetailData.srhColorList = [];
				return;
			}
			
			var len = colors.length;
			var c;
			for(var i=0; i<len; i++){
				c = colors[i];
				c.selected = ($scope.postParams.selectedColor.indexOf(c.colorCd) >= 0);
			}
			$scope.srhDetailData.srhColorList = colors;
		}

		/**
		 * 검색 키워드 없음 처리
		 */
		$scope.noKeyword = function () {
			$scope.uiStateObj.emptyResult = false;// UI 검색결과 없음 비활성화
			$scope.uiStateObj.emptyKeyword = true;// UI 검색 키쿼드 없음 활성화
		};
		
		
		
		/*
		 * 상세검색 조건 로드
		 */
		$scope.loadTermData = function (params) {
			var postParams = angular.extend({
					rtnType : "",
					keyword : "",
					dpml_no : "1",
					dispCnt : 30,
					page : 1
				}, params),
				loadURL = $scope.URLs.searchTerm;

			// 음성 검색 추가 파라메타 처리
			if ($scope.postParams.isVoice && $scope.postParams.isVoice != "") {
				postParams.isVoice = $scope.postParams.isVoice;
			}

			if ($scope.postParams.brdNm) {
				postParams.brdNm = $scope.postParams.brdNm;
			}

			if (!postParams.keyword && !postParams.brdNm) {// 검색어가 없을 경우 AJAX 호출 방지
				$scope.noKeyword();
				return false;
			}
			
			// 최고값이 있고 최저값 입력 없을시 기본 최저 값으로 세팅
			if (postParams.priceMaxU && !postParams.priceMinU) {
				postParams.priceMinU = $scope.srhResultData.price.min;
			}
			// 최저값이 있고 최고값 입력 없을시 기본 최저 값으로 세팅
			if (postParams.priceMinU && !postParams.priceMaxU) {
				postParams.priceMaxU = $scope.srhResultData.price.max;
			}

			if($scope.searchTermsLoading){ return false; }

			$scope.isShowLoading = true;// AJAX 호출 Flag 활성화
			$scope.searchTermsLoading = true;
			
			$http.get(loadURL, {params:postParams})
				.success(function (data, status, headers, config) {//호출 성공시
					$scope.termDataLoadComplete(data);
					//$scope.isShowLoading = false;
					$scope.searchTermsLoading = false;
					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
						$scope.isShowLoading = false;
					}
					
                    //setTimeout(function(){ $scope.setSurveyPos(); }, 500);// 검색만족도
    				
    				$timeout(function(){
    					$scope.retriveTemplateType();
    				}, 0);
				})
				.error(function (data, status, headers, config) {//호출 실패시
					//$scope.isShowLoading = false;
					$scope.searchTermsLoading = false;
					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
						$scope.isShowLoading = false;
					}
				});
		}

		$scope.addRelatedKeyword = function(item, unshift){
			item = item.replace(/ /g, "");
			
			if($scope.srhResultData.reatedKeyword.indexOf(item) >= 0){
				return;
			}else if($scope.postParams.reQuery.indexOf(item) >= 0){
				return;
			}else if($scope.postParams.exQuery.indexOf(item) >= 0){
				return;
			}
			
			if(unshift===true){
				$scope.srhResultData.reatedKeyword.unshift(item);
			}else{
				$scope.srhResultData.reatedKeyword.push(item);
			}
		}
		
		var replaceMap = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":"\"", "&#39;":"'"};
		var repRegExp = new RegExp(Object.keys(replaceMap).join("|"), "gi");
		function replaceFunc(str){ return replaceMap[str]; }
		
		/**
		 * 상세검색 조건 데이터 로드 성공
		 */
		$scope.termDataLoadComplete = function($data){
			if($data.resultCode){//결과 코드가 있을 경우에만 처리
				if($data.keyword != undefined){
					$data.keyword = $data.keyword.replace(repRegExp, replaceFunc);
				}
				
				if($data.resultCode == "0000"){//검색결과 있음
					// 음성검색이고 리다이렉트 URL이 있으면 포워딩
					if($data.isVoice == "Y" && !($data.redirectUrl == undefined || $data.redirectUrl == "")){
						var url = $data.redirectUrl;
						if(url.indexOf("?") >= 0){
							url += "&" + $scope.baseParam;
						}else{
							url += "?" + $scope.baseParam;
						}
						$scope.showWrap = false;
						location.href = url;
						return;
					}
					
					// 201603 모바일 리뉴얼 추가 박형윤
					if ($data.isVoice && $data.isVoice != "") {
						$scope.postParams.isVoice = $data.isVoice;
					}
					
					var i, len;
					
					//if ($data.isVoice == "Y" || $data.isVoice == "T" && $data.keyword && $data.keyword != "" && $data.sortType && $data.sortType != "") {
					if ($data.isVoice == "Y" || $data.isVoice == "T" && $data.keyword && $data.sortType && $data.sortType != "") {
						$scope.postParams.keyword = $data.keyword;
						$scope.postParams.sort = $data.sortType;
		
						for (i = 0; i < $scope.uiStateObj.sortTypeArr.length; i++) {
							if ($scope.uiStateObj.sortTypeArr[i].value == $scope.postParams.sort) {
								$scope.uiStateObj.sortTypeIdx = i;
							}
						}
					}

					/*if ($data.brdNm && $data.brdNm != "") {
						$scope.postParams.brdNm = $data.brdNm;//encodeURIComponent($data.brdNm);
					}*/
					
					switch($scope.postParams.rtnType){
						case "":
							// 키워드
							$scope.srhResultData.keyword = $data.keyword;
							$scope.postParams.keyword = $data.keyword;
							
						case "K":
							// 재검색어
							// 재검색어 최대 갯수 제한
							/*var maxKeyword = 2;
							if($scope.postParams.reQuery.indexOf("스마트픽") >= 0){
								maxKeyword = 3;
							}
							
							if(($scope.postParams.reQuery.length + $scope.postParams.exQuery.length) >= maxKeyword){
								$scope.uiStateObj.relatedKeywordEnabled = false;
							}else{
								$scope.uiStateObj.relatedKeywordEnabled = true;
							}*/
							
							
							// 결과내 키워드
							if(!$scope.srhResultData.reatedKeyword){
								$scope.srhResultData.reatedKeyword = [];
							}
							$scope.srhResultData.reatedKeyword.length = 0;
							
							if($data.reatedKeyword && $data.reatedKeyword.Data &&
								$data.reatedKeyword.Data.Return == 0 &&
								$data.reatedKeyword.Data.Word && $data.reatedKeyword.Data.Word.length > 0){
								
									angular.forEach($data.reatedKeyword.Data.Word, function (item, index) {
										$scope.addRelatedKeyword(item);
									});
							}
							
							
							// 결과내 키워드에 스마트픽 추가
							if($data.smpick == 1){
								var addBranch = false;
								var rq = $scope.postParams.reQuery;
								if($scope.postParams.keyword == "스마트픽"){
									if(rq.length == 0){
										addBranch = true;
									}
								}else if(rq.length > 0 && rq.indexOf("스마트픽") == rq.length-1){
									addBranch = true;
								}
								
								if(addBranch && $data.smpickBranch != undefined && $data.smpickBranch.length > 0){
									len = $data.smpickBranch.length;
									for(i=len-1; i>=0; i--){
										$scope.addRelatedKeyword($data.smpickBranch[i].name, true);
									}
								}
								/*if($scope.postParams.keyword != "스마트픽" && $scope.postParams.reQuery.indexOf("스마트픽") < 0){// 스마트픽이 없을 때
									$scope.addRelatedKeyword("스마트픽", true);
								}else if($scope.postParams.reQuery.indexOf("스마트픽") == $scope.postParams.reQuery.length-1){// 스마트픽이 마지막일 때
								//if($scope.postParams.reQuery.indexOf("스마트픽") == $scope.postParams.reQuery.length-1){// 스마트픽이 마지막일 때
									if($data.smpickBranch != undefined && $data.smpickBranch.length > 0){
										len = $data.smpickBranch.length;
										for(i=len-1; i>=0; i--){
											$scope.addRelatedKeyword($data.smpickBranch[i].name, true);
										}
									}
								}*/
							}
							
							// 결과내키워드 없으면 UI 표시 안함
							$scope.uiStateObj.relatedKeywordNotEmpty = true;
							if($scope.srhResultData.reatedKeyword == undefined){
								$scope.uiStateObj.relatedKeywordNotEmpty = false;
							}else if($scope.srhResultData.reatedKeyword.length == 0){
								$scope.uiStateObj.relatedKeywordNotEmpty = false;
							}
							
							// 연관 검색어(기존 reatedKeyword 에서 relatedKeyword 로 이름 변경, reatedKeyword는 결과내키워드로 변경)
							if ($scope.uiStateObj.voiceSearch==false &&//음성검색이면 비노출
								$data.relatedKeyword &&
								$data.relatedKeyword.responsestatus == 0 &&
								typeof $data.relatedKeyword.result[0] != "undefined" &&
								typeof $data.relatedKeyword.result[0].items != "undefined" &&
								$data.relatedKeyword.result[0].items.length > 0) {
								angular.forEach($data.relatedKeyword.result[0].items, function (item, index) {
									if (!$scope.srhResultData.relatedKeyword) {
										$scope.srhResultData.relatedKeyword = [];
									}
									var hsaKeyword = false;
									//이미 추가된 요소인지 확인
									for(var i=0;i < $scope.srhResultData.relatedKeyword.length;i++) {
										if($scope.srhResultData.relatedKeyword[i].keyword == item.keyword) {
											hsaKeyword = true;
											break;
										}
									}
									if(!hsaKeyword) {
										if (item.keyword && item.type && item.count && /*스크립트 오류 방지 각 체크할 key값이 있는지 확인*/
												item.type == "2" && /*연관검색어는 type이 2인 요소만 가져옴*/
												item.count > 0 && /*검색 건수가 있는 검색어만 표시*/
												(item.keyword + "").toLowerCase() != ($scope.postParams.keyword + "").toLowerCase()) {
											$scope.srhResultData.relatedKeyword.push(item);
										}
									}
								});
							}
							
							if($data.ctgLst != undefined){
								$scope.srhResultData.ctgLst = $data.ctgLst;// 카테고리 리스트
							}
							
							//연관검색어 애니메이션
							$scope.tryAnimateRelatedKeyword();
				
						case "C" :// 카테고리
							
							// 서브카테 (3, 4뎁스), 대카일때만 실행
							if($scope.postParams.ctgDepth==1 && $data.subCtgLst != undefined){
								if($data.subCtgLst.items != undefined && $data.subCtgLst.items.length > 0){
									// 서브카테 있을경우
									var a1, a2, len, len2, i, i2, c1, c2;
									var endloop = false;
									var newbee = false;
									
									a1 = $scope.srhResultData.ctgLst.items;
									len = a1.length;
									for(i=0; i<len; i++){
										c1 = a1[i];
										if(c1.subCtgLst != undefined && c1.subCtgLst.items != undefined){
											a2 = c1.subCtgLst.items;
											len2 = a2.length;
											for(i2=0; i2<len2; i2++){
												c2 = a2[i2];
												if(c2.ctgNo == $data.subCtgLst.ctgNo){
													if(c2.subCtgLst == undefined){
														c2.subCtgLst = $data.subCtgLst;
														newbee = true;
													}
													
													endloop = true;
													break;
												}
											}
										}
										if(endloop){ break; }
									}
									
									var li = $("#ctg_" + $data.subCtgLst.ctgNo);
									if(newbee && !li.hasClass("open")){
										$timeout(function(){ $scope.categoryAccordian(li); }, 50);
										//$scope.categoryAccordian(li);
									}
								}else if($data.subCtgLst.ctgNo != undefined){
									// 서브카테 없을경우
									var li = $("#ctg_" + $data.subCtgLst.ctgNo);
									li.addClass("nochild");
								}
							}
							
							
						//case "D":// 상세 (구버전)
						case "E":// 기타 상세
						default:
							// 20161201 박형윤 수정 --
							// AS-IS
							// 브랜드
							// $scope.srhResultData.brdLst = $data.brdLst;// 브랜드 리스트
				
							// if (typeof $scope.srhResultData.brdLst.tcnt != "undefined" &&
							// 	$scope.srhResultData.brdLst.tcnt > 0 &&
							// 	typeof $scope.srhResultData.brdLst.items != "undefined") {
							// 	angular.forEach($scope.srhResultData.brdLst.items, function (item, index) {
							// 		$scope.srhResultData.brdLst.items[index].cnt = parseInt(item.cnt);
							// 	});
							// }

							// TO-BE
							$scope.srhResultData.brdLst = {};

							if ($data.brdLst.items) {
								$scope.srhResultData.brdLst.items = $filter('orderBy')($data.brdLst.items, $scope.uiStateObj.srhFilterBrdSort);// 브랜드 리스트
								$scope.srhResultData.brdLstRender = $scope.srhResultData.brdLst.items.slice(0, $scope.brdShowListCnt);
							}

							if ($data.brdLst.tcnt) {
								$scope.srhResultData.brdLst.tcnt = $data.brdLst.tcnt;// 브랜드 리스트
							}
							//-- 20161201 박형윤 수정

							//case "B" :// 브랜드
							
							// 혜택 - 스마트픽
							//$scope.srhDetailData.srhTerms.smpick = $data.smpick == "1" ? true : false;
							$scope.srhDetailData.srhTerms.smpick = ($data.smpDept == "1" || $data.smpick == "1") ? true : false;
							$scope.srhDetailData.srhTerms.smpickBranch = $data.smpickBranch;
							
							// 컬러
							$scope.updateColors($data.colors);
							
							// 가격대
							$scope.srhResultData.price = $data.price;
							
							// 매장
							$scope.srhDetailData.srhTerms.dept = $data.store.dept == "1" ? true : false;
							$scope.srhDetailData.srhTerms.super = $data.store.super == "1" ? true : false;
							$scope.srhDetailData.srhTerms.tvhome = $data.store.tvhome == "1" ? true : false;
							$scope.srhDetailData.srhTerms.brdstore = $data.store.brdstore == "1" ? true : false;

							$scope.srhDetailData.srhTerms.seven = $data.smpSeven == "1" ? true : false;
							$scope.srhDetailData.srhTerms.tdar = $data.tdar == "1" ? true : false;
							$scope.srhDetailData.srhTerms.quick = $data.quick == "1" ? true : false;
					}
		
					
					$scope.uiStateObj.detailSearchDataLoaded = true;// 데이터 로드 완료, 상세검색 UI활성화
					
					
					checkDefaultCategory();
					
					$timeout(checkVoiceResult, 1);
					
				//}else if ($data.resultCode == "1000") {//검색결과 없음
				//}else if($data.resultCode == "2000"){//검색키워드 없음
				}else{
					if($scope.postParams.rtnType == ""){
						// 키워드
						$scope.srhResultData.keyword = $data.keyword;
						$scope.postParams.keyword = $data.keyword;
					}
				}
			}else{//결과 코드(resultCode)가 없는 오류 처리
				if($scope.postParams.rtnType == ""){
					// 키워드
					$scope.srhResultData.keyword = $data.keyword;
					$scope.postParams.keyword = $data.keyword;
				}
				//$scope.uiStateObj.emptyKeyword = true;//UI
				//$scope.srhResultData.resultCode = "1000";
			}
		};
		
		function checkVoiceResult(){
			if($scope.uiStateObj.voiceResultParams == null || $scope.srhResultData.price == undefined){ return; }
			
			var p = $scope.uiStateObj.voiceResultParams;
			var len, i, item;
			
			//brand temp
			/*if($scope.srhResultData.brdLst != undefined && $scope.srhResultData.brdLst.items != undefined){
				len = $scope.srhResultData.brdLst.items.length;
				for(i=0; i<len; i++){
					item = $scope.srhResultData.brdLst.items[i];
					if(item.brdNo == "15706"){
						$scope.srhChkBrdPost(item, "N");
						item.checked = true;
						break;
					}
				}
				len = $scope.srhResultData.brdLstRender.length;
				for(i=0; i<len; i++){
					item = $scope.srhResultData.brdLstRender[i];
					if(item.brdNo == "15706"){
						item.checked = true;
					}
				}
			}*/
			if(p.VBrdNm != undefined && p.VBrdNm != ""){
				$scope.postParams.brdNm = p.VBrdNm;
			}
			
			// color
			if(p.VColorCd != undefined && p.VColorCd != "" && $scope.srhDetailData.srhColorList != undefined){
				len = $scope.srhDetailData.srhColorList.length;
				for(i=0; i<len; i++){
					item = $scope.srhDetailData.srhColorList[i];
					if(item.colorCd == p.VColorCd && item.selected==false){
						$scope.srhSelectColor(item, "N");
						break;
					}
				}
			}
			
			// smartpick
			if(p.VSmpickYN != undefined && p.VSmpickYN == "Y"){
				// 전체
				$scope.postParams.smpickYN = "Y";
				$scope.postParams.smpickBranchNo = "";
				$scope.uiStateObj.smpickBranchName = "";
				// 지점선택
				if(p.VSmpickBranchNo != undefined && p.VSmpickBranchNo != "" && $scope.srhDetailData.srhTerms.smpickBranch != undefined){
					len = $scope.srhDetailData.srhTerms.smpickBranch.length;
					for(i=0; i<len; i++){
						item = $scope.srhDetailData.srhTerms.smpickBranch[i];
						if(p.VSmpickBranchNo == item.branchNo){
							$scope.postParams.smpickBranchNo = item.branchNo;
							$scope.uiStateObj.smpickBranchName = item.name;
							break;
						}
					}
				}
			}
			if(p.VDelSevenYN != undefined && p.VDelSevenYN == "Y"){
				$scope.postParams.delSevenYN = "Y";
			}
			
			// price min
			var price = $scope.srhResultData.price;
			if(p.VPriceMinU != undefined && p.VPriceMinU != ""){
				p.VPriceMinU = parseInt(p.VPriceMinU, 10);
				if(p.VPriceMinU < price.min){
					p.VPriceMinU = price.min;
				}
				if(p.VPriceMinU > price.max){
					p.VPriceMinU = price.max;
				}
				$scope.postParams.priceMinUTemp = p.VPriceMinU;
				$scope.postParams.priceMinU = p.VPriceMinU;
			}
			// price max
			if(p.VPriceMaxU != undefined && p.VPriceMaxU != ""){
				p.VPriceMaxU = parseInt(p.VPriceMaxU, 10);
				if(p.VPriceMaxU < price.min){
					p.VPriceMaxU = price.min;
				}
				if(p.VPriceMaxU > price.max){
					p.VPriceMaxU = price.max;
				}
				$scope.postParams.priceMaxUTemp = p.VPriceMaxU;
				$scope.postParams.priceMaxU = p.VPriceMaxU;
			}
			
			$scope.uiStateObj.voiceResultParams = null;
		};
		
		/**
		 * 기본선택 카테고리 체크
		 */
		function checkDefaultCategory(){
			if($scope.uiStateObj.defaultCtgNo == null){ return; }
			
			if($scope.srhResultData.ctgLst && $scope.srhResultData.ctgLst.items){
				var len = $scope.srhResultData.ctgLst.items.length;
				var ctg;
				for(var i=0; i<len; i++){
					ctg = $scope.srhResultData.ctgLst.items[i];
					if(ctg.ctgNo == $scope.uiStateObj.defaultCtgNo){
						$scope.uiStateObj.selectedCategory.depth1 = ctg.ctgNo;
						$scope.uiStateObj.selectedCategory.ctgName = ctg.ctgName;
						break;
					}
				}
			}
			$scope.uiStateObj.defaultCtgNo = null;
			$scope.uiStateObj.skipListLoad = true;//리스트 재로드 방지
			$timeout($scope.srhSubCtgPost, 1);
			
			/*$timeout(function(){
				var ctg = angular.element("#ctg_" + $scope.uiStateObj.defaultCtgNo + " > a");
				$scope.uiStateObj.defaultCtgNo = null;
				$scope.uiStateObj.skipListLoad = true;//리스트 재로드 방지
				if(ctg.length > 0){
					ctg.trigger("click");
				}else{
					$scope.loadDataParams();
				}
			}, 1);*/
		};
		
		/**
		 * 상품 목록 데이터 로드
		 */
		$scope.loadListData = function (params) {
			$scope.survey_state = 0;
			
			var postParams = angular.extend({
					rtnType : "",
					keyword : "",
					dpml_no : "1",
					dispCnt : 30,
					page : 1
				}, params),
				loadURL = $scope.URLs.searchList;

			// 음성 검색 추가 파라메타 처리
			if ($scope.postParams.isVoice && $scope.postParams.isVoice != "") {
				postParams.isVoice = $scope.postParams.isVoice;
			}

			if ($scope.postParams.brdNm) {
				postParams.brdNm = $scope.postParams.brdNm;
			}

			if (!postParams.keyword && !postParams.brdNm) {// 검색어가 없을 경우 AJAX 호출 방지
				$scope.noKeyword();
				return false;
			}
			
			// 최고값이 있고 최저값 입력 없을시 기본 최저 값으로 세팅
			if (postParams.priceMaxU && !postParams.priceMinU) {
				postParams.priceMinU = $scope.srhResultData.price.min;
			}
			// 최저값이 있고 최고값 입력 없을시 기본 최저 값으로 세팅
			if (postParams.priceMinU && !postParams.priceMaxU) {
				postParams.priceMaxU = $scope.srhResultData.price.max;
			}

			if($scope.productListLoading){ return false; }

			$scope.isShowLoading = true;// AJAX 호출 Flag 활성화
			$scope.productListLoading = true;
			if($scope.uiStateObj.rekeywordChanged == true){
				$scope.uiStateObj.rekeywordChanged = false;
				$scope.callAppAPI("search2016://listloadstart?rekeywordChanged=Y");// 리스트 로딩 끝
			}else{
				$scope.callAppAPI("search2016://listloadstart");// 리스트 로딩 끝
			}
			
			
			$http.get(loadURL, {params:postParams})
				.success(function (data, status, headers, config) {//호출 성공시
					$scope.listDataLoadComplete(data);
					//$scope.isShowLoading = false;
					$scope.productListLoading = false;
					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
						$scope.isShowLoading = false;
					}
					
                    setTimeout(function(){ $scope.setSurveyPos(); }, 1000);// 검색만족도
    				
    				$timeout(function(){
    					$scope.retriveTemplateType();
    				}, 0);
    				
    				$scope.callAppAPI("search2016://listloadend?count=" + data.tCnt);// 리스트 로딩 끝
				})
				.error(function (data, status, headers, config) {//호출 실패시
					//$scope.isShowLoading = false;
					$scope.productListLoading = false;
					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
						$scope.isShowLoading = false;
					}
					
					$scope.callAppAPI("search2016://listloadend?count=0");// 리스트 로딩 끝
				});
		};
		
		/**
		 * 상품 목록 데이터 로드 성공
		 */
		$scope.listDataLoadComplete = function($data){
			if ($data.resultCode) {// 결과 코드가 있을 경우에만 처리
				// 음성검색이고 리다이렉트 URL이 있으면 포워딩
				if($data.isVoice == "Y" && !($data.redirectUrl == undefined || $data.redirectUrl == "")){
					var url = $data.redirectUrl;
					if(url.indexOf("?") >= 0){
						url += "&" + $scope.baseParam;
					}else{
						url += "?" + $scope.baseParam;
					}
					$scope.showWrap = false;
					$timeout(function(){
						location.href = url;
					},1);
					return;
				}
				
				var voiceSeached = $scope.postParams.isVoice == "Y";// 음성검색 여부
				
				if($data.voiceParams != undefined){
					$scope.uiStateObj.voiceResultParams = $data.voiceParams;// 음성검색 변환 조건
				}
				
				if($data.isVoice == "Y" || $data.isVoice == "T"){
					if($data.voiceParams == undefined || ($data.voiceParams.VBrdNm == "" && $data.voiceParams.VKeyword == "")){
						// 음성검색, 키워드/브랜드 없으면 검색결과 없음 처리
						$data.tCnt = 0;
						$data.prdLst.items = [];
						$data.prdLst.tcnt = 0;
						$data.resultCode = "1000";
					}
				}
				
				$scope.uiStateObj.initFlag = false;

				$scope.srhResultData.dispUnitType = $data.dispUnitType;
				// All : 항상
				$scope.srhResultData.resultCode = $data.resultCode;// 결과 코드
				//검색결과 갯수
				if($data.tCnt != undefined && typeof $data.tCnt == "number"){
					$scope.srhResultData.tCnt = $data.tCnt;
					
					// 앱에 검색결과 갯수 전달
					$scope.callAppAPI("search2016://searchcount?count=" + $data.tCnt);
				}

				// 201603 모바일 리뉴얼 추가 박형윤
				if ($data.isVoice && $data.isVoice != "") {
					$scope.postParams.isVoice = $data.isVoice;
				}

				//if ($data.isVoice == "Y" || $data.isVoice == "T" && $data.keyword && $data.keyword != "" && $data.sortType && $data.sortType != "") {
				if ($data.isVoice == "Y" || $data.isVoice == "T" && $data.keyword && $data.sortType && $data.sortType != "") {
					$scope.postParams.keyword = $data.keyword;
					$scope.postParams.sort = $data.sortType;

					var i = 0;

					for (i = 0; i < $scope.uiStateObj.sortTypeArr.length; i++) {
						if ($scope.uiStateObj.sortTypeArr[i].value == $scope.postParams.sort) {
							$scope.uiStateObj.sortTypeIdx = i;
						}
					}
				}

				/*if ($data.brdNm && $data.brdNm != "") {
					$scope.postParams.brdNm = $data.brdNm;//encodeURIComponent($data.brdNm);
				}*/
				
				if($data.page == 1){
					if($data.missKeyword != undefined && $data.missKeyword.orgKeyword != undefined && $data.missKeyword.orgKeyword != ""){
						$scope.srhResultData.orgKeyword = $data.missKeyword.orgKeyword;
						if($data.voiceParams != undefined && $data.voiceParams.VKeyword != undefined && $data.voiceParams.VKeyword != ""){
							$scope.postParams.keyword = $data.voiceParams.VKeyword;
						}
						$scope.surKeyword = $scope.postParams.keyword;
					}else{
						$scope.srhResultData.orgKeyword = "";
					}
				}

				if ($data.resultCode == "0000") {
					// 검색결과 있음
					var prevEmptyResult = $scope.uiStateObj.emptyResult;
					$scope.uiStateObj.emptyResult = false;// UI
					$scope.uiStateObj.emptyKeyword = false;// UI
					
					/*검색결과 로드 완료 처리*/
					switch ($scope.postParams.rtnType) {
						case "" ://기본
						case "K"://검색어 변경
							$scope.srhResultData.prdDealLst = $data.prdDealLst;// 딜상품 리스트
							if($scope.srhResultData.prdDealLst && $scope.srhResultData.prdDealLst.items && $scope.srhResultData.prdDealLst.items.length > 0){
								$scope.prdDealList = $scope.reMappingDealUnitData($scope.srhResultData.prdDealLst.items) ;
							}
							
						case "C":// 카테고리
						case "B" :// 브랜드
						case "E"://상세
							
						 case "S" :// 정렬
							$scope.srhResultData.sortType = $data.sortType;
							
						case "P" :// 페이징
							$scope.srhResultData.dispCnt = $data.dispCnt;// 한페이지의 상품 개수
							$scope.srhResultData.page = $data.page;// 현재 페이지
							$scope.postParams.page = $data.page;

							// 전체 상품 로드 여부 체크
							$scope.uiStateObj.ajaxPageEndFlag = false;
							
							if ($scope.postParams.page > 1) {
								// 첫페이지가 아닐 경우 상품 append
								$scope.srhResultData.prdLst.items = $scope.srhResultData.prdLst.items.concat($scope.reMappingPldUnitData($data.prdLst.items));// 검색결과상품 리스트
							} else {
								if ($data.prdLst) {
									// 검색된 상품 리스트가 있을 경우
									$scope.srhResultData.prdLst = $data.prdLst;
									$scope.srhResultData.prdLst.items = $scope.reMappingPldUnitData($data.prdLst.items);
									$scope.srhResultData.prdLst.tcnt = $data.prdLst.tcnt;// 상품 개수
								} else {
									// 페이지가 1페이지이고 검색된 상품 리스트가 없을 경우
									$scope.uiStateObj.ajaxPageEndFlag = true;
									$scope.productMoreScroll = false;
								}
							}

							// 전체 상품 로드 여부 체크
							if ($scope.srhResultData.prdLst && $scope.srhResultData.prdLst.items && $data.prdLst &&$data.prdLst.items) {
								if ($scope.srhResultData.tCnt <= $scope.srhResultData.prdLst.items.length || $data.prdLst.items.length == 0) {
									$scope.uiStateObj.ajaxPageEndFlag = true;
									$scope.productMoreScroll = false;
								} else {
									$scope.uiStateObj.ajaxPageEndFlag = false;
									$scope.productMoreScroll = true;
								}
								
								/**
            					 * BUZZNI 리타겟팅 스크립트 (List)
            					 * 2017.03.24
            					 */
            					var arrGoodsNo = [];
	        					for(var i = 0; i<$scope.srhResultData.prdLst.items.length; i++){
	        						if(arrGoodsNo.length < 3){
	        							arrGoodsNo.push($scope.srhResultData.prdLst.items[i].goods_no + '' || '');
	        						}else{
	        							break;
	        						}
	        					}
	        					if($scope.sendBuzzni && !window.buzzni_rt_list){
	        						$scope.sendBuzzni("list", arrGoodsNo);
	        						window.buzzni_rt_list = true;
	        					}
    	        			    
							} else {
								$scope.uiStateObj.ajaxPageEndFlag = true;
								$scope.productMoreScroll = false;
							}

							/*검색된 상품이 있는지 여부 판단*/
							if ((typeof $scope.srhResultData.prdLst == 'undefined' || typeof $scope.srhResultData.prdLst.items == 'undefined') &&
								!$scope.uiStateObj.emptyKeyword &&
								!$scope.uiStateObj.initFlag) {
								$scope.uiStateObj.ajaxPageEndFlag = true;
								$scope.uiStateObj.emptyPrdLstFlag = true;
								$scope.productMoreScroll = false;
							} else {
								$scope.uiStateObj.emptyPrdLstFlag = false;
							}
							break;
					}
					
					if($scope.srhResultData.prdLst && $scope.srhResultData.prdLst.items){
						for(i=0; i <  $scope.srhResultData.prdLst.items.length; i++) {// 테스트
							$scope.srhResultData.prdLst.items[i].brnd_nm =  $scope.srhResultData.prdLst.items[i].brnd_nm.replace("[", "");
							$scope.srhResultData.prdLst.items[i].brnd_nm =  $scope.srhResultData.prdLst.items[i].brnd_nm.replace("]", "");
						}
					}
					
					if(prevEmptyResult){
						//연관검색어 애니메이션
						$scope.tryAnimateRelatedKeyword();
					}
					
					if($scope.postParams.pop == undefined || $scope.postParams.pop == ""){
						if($data.ageGndrGrpLst && $data.ageGndrGrpLst.items && $data.ageGndrGrpLst.items.length > 0){
							$scope.srhResultData.ageGndrGrpLst = $data.ageGndrGrpLst.items;
						}else{
							$scope.srhResultData.ageGndrGrpLst = [];
						}
					}
					
					splitProductList();
					
					if(voiceSeached){
						$timeout(function(){
							$scope.uiStateObj.skipListLoad = true;
							$scope.loadDataParams();
						}, 1);
					}else{
						$timeout(checkVoiceResult, 1);
					}
					
				} else if ($data.resultCode == "1000") {
					// 검색결과 없음
					$scope.uiStateObj.emptyResult = true;// UI
					$scope.uiStateObj.emptyKeyword = false;// UI
					$scope.productMoreScroll = false;

					/*N : 검색결과 없음*/
					$scope.srhResultData.tCnt = $data.tCnt; /*총 검색결과 수*/
					$scope.srhResultData.missKeyword = $data.missKeyword; /*오탈자 검색어*/
					
					// 앱에 검색결과 갯수 전달
					$scope.callAppAPI("search2016://searchcount?count=" + $data.tCnt);
					

					if (typeof $data.favLst != "undefined") { /*인기검색어 데이터가 있을 경우 처리*/
						$scope.srhResultData.favLst = {}; /*인기검색어 초기화*/

						var favLstDate = new Date(); /*인기검색어 집계일시 초기화*/

						if (typeof $data.favLst.date != "undefined" && $data.favLst.date.length >= 8) {
							var favLstYear = ($data.favLst.date + "").substr(0, 4), /*년*/
								favLstMonth = parseInt(($data.favLst.date + "").substr(4, 2)) -1, /*월*/
								favLstDay = ($data.favLst.date + "").substr(6, 2); /*일*/

							favLstDate = new Date(favLstYear, favLstMonth, favLstDay); /*Date 형식으로 생성*/
						}

						$scope.srhResultData.favLst.date = favLstDate; /*인기검색어 집계일시*/
						$scope.srhResultData.favLst.items = $data.favLst.items ; /*인기검색어 리스트*/
					}
				} else if ($data.resultCode == "2000") { /*검색키워드 없음*/
					$scope.noKeyword(); /*검색 키워드 없음 처리*/
					/*alert("검색어가 없습니다.");*/
				}
			} else { /*결과 코드(resultCode)가 없는 오류 처리*/
				/*$scope.uiStateObj.emptyKeyword = true;*/ /*UI*/
				/*$scope.srhResultData.resultCode = "1000";*/
			}
			
			
			loadAdvtBnr();//검색광고배너 기획전배너 로드
		};
		
		/**
		 * 검색광고배너 기획전배너 로드
		 */
		function loadAdvtBnr(){
			if($scope.srhResultData.advtBnrLst != undefined){ return; }// 한번만 로드
			
			var param = { "keyword":$scope.postParams.keyword };
			$http.get($scope.URLs.searchAdvtBnr, {params:param})
				.success(function (data, status, headers, config) {//호출 성공시
					$scope.srhResultData.advtBnrLst = data.advtBnrLst;
				});
		};
		
		/**
		 * 상품리스트 분할
		 */
		function splitProductList(){
			if($scope.srhResultData == undefined
			|| $scope.srhResultData.prdLst == undefined
			|| $scope.srhResultData.prdLst.items == undefined
			|| $scope.srhResultData.prdLst.items.length == 0){
				$scope.srhResultData.listTop6 = [];
				$scope.srhResultData.listMid2 = [];
				$scope.srhResultData.listRest = [];
				return;
			}
			
			var len = $scope.srhResultData.prdLst.items.length;
			if(len <= 6){
				$scope.srhResultData.listTop6 = [].concat($scope.srhResultData.prdLst.items);
				$scope.srhResultData.listMid2 = [];
				$scope.srhResultData.listRest = [];
			}else if(len <= 18){
				$scope.srhResultData.listTop6 = $scope.srhResultData.prdLst.items.slice(0, 6);
				$scope.srhResultData.listMid2 = $scope.srhResultData.prdLst.items.slice(6, 18);
				$scope.srhResultData.listRest = [];
			}else{
				$scope.srhResultData.listTop6 = $scope.srhResultData.prdLst.items.slice(0, 6);
				$scope.srhResultData.listMid2 = $scope.srhResultData.prdLst.items.slice(6, 18);
				$scope.srhResultData.listRest = $scope.srhResultData.prdLst.items.slice(18);
			}
		}

		/**
		 * 연관 검색어 애니메이트
		 */
		$scope.tryAnimateRelatedKeyword = function(){
			try{
				$scope.animateRelatedKeyword();
			}catch(e){
				$timeout(function(){$scope.tryAnimateRelatedKeyword();}, 200);
			}
		}


		// 쿠폰 레이어 데이터 로드 (제휴채널)
		$scope.loadCouponeLayerData = function() {
			$http.get(LotteCommon.couponLayerData + "?" + $scope.baseParam)
			.success(function(data) {
				$scope.couponLayer = data;
			})
			.error(function() {
				console.log('Data Error : 쿠폰 레이어 데이터');
			})
		};
		
		
		/**
		 * 검색 콘트롤 시작하기
		 * 콘트롤, 디렉티브 초기화 시점상 에러 발생 방지를 위해 디렉티브에서 호출
		 */
		$scope.startSearchList = function() {
			// 세션 스토리지 체크
			if (LotteStorage.getSessionStorage("srhLstLoc") == $location.absUrl() &&  // URL 체크
				LotteStorage.getSessionStorage("srhLst") &&
				$scope.locationHistoryBack) { // 세션 체크
	
				var sessionScopeData = LotteStorage.getSessionStorage("srhLst", 'json');
	
				if (typeof sessionScopeData.srhResultData.resultCode == "undefined") { // SessionStorage에 resultCode가 없다면 데이터 로드 하기
					try { console.log('Data Load'); } catch (e) {}
	
					$scope.loadDataParams(); // 데이터 로드
					$scope.callAppAPI("search2016://pagein");// 화면 진입시 앱호출
					
				} else { // 세션 스토리지에 담긴 값이 정상이라면 세션 데이터 활용
					try { console.log('Session Load'); } catch (e) {}
	
					//$scope.searchCntTxt = sessionScopeData.searchCntTxt; // 검색결과 수 세팅
					$scope.uiStateObj = sessionScopeData.uiStateObj; // UI 상태값 세팅
					$scope.postParams = sessionScopeData.postParams; // 전송 파라메터 저장값 세팅
					$scope.srhResultData = sessionScopeData.srhResultData; // 전송 결과값 세팅
					$scope.srhDetailData = sessionScopeData.srhDetailData; // 상세검색 조건 활성화여부 세팅
					
					//$scope.templateType = $scope.uiStateObj.templateType; // 유닛 템플릿 타임 세팅
					
					if ($scope.isShowLoading || $scope.productListLoading) {
						$scope.productListLoading = false;
						$scope.isShowLoading = false; // Ajax 로드 Flag 초기화
					}
	
					// 딜 상품
					if ($scope.srhResultData.prdDealLst && $scope.srhResultData.prdDealLst.items && $scope.srhResultData.prdDealLst.items.length > 0) {
						$scope.prdDealList = $scope.reMappingDealUnitData($scope.srhResultData.prdDealLst.items) ;
					}
	
					// 이전 스크롤 위치로 스크롤 이동
					var m_nowScrollY = LotteStorage.getSessionStorage("srhLstNowScrollY");
	
					// iOS에서 딜레이를 주지 않을 경우 스크롤 위치를 찾아가지 못함 대략 300ms 정도면 적당한듯...
					$timeout(function () {
						angular.element($window).scrollTop(m_nowScrollY);
					}, 300);
					
					$timeout(function(){
						$scope.retriveTemplateType();
					}, 0);

					//연관검색어 애니메이션
					$scope.tryAnimateRelatedKeyword();
					
	
					LotteStorage.delSessionStorage('srhLstLoc'); // 세션스토리지에 저장된 현재 URL 삭제
					LotteStorage.delSessionStorage('srhLst'); // 세션스토리지에 저장된 검색결과리스트 데이터 삭제
					LotteStorage.delSessionStorage('srhLstNowScrollY'); // 세션스토리지에 저장된 스크롤 위치 삭제
				}
			} else { // 세션 스토리지에 데이터가 없을 경우 AJAX 데이터 로드
				try { console.log('Data Load'); } catch (e) {}
				$scope.loadDataParams(); // 데이터 로드
				$scope.callAppAPI("search2016://pagein");// 화면 진입시 앱호출
			}
	
			// 페이지 진입시 최초 1회 시행 (제휴채널 중복 쿠폰 여부 체크)
			if (commInitData.query.cn) {
				$scope.loadCouponeLayerData();
			}
	
			/*페이지 unload 시 세션스토리지 저장*/
			angular.element($window).on("unload", function () {
				if ($scope.locationParam == "SEARCH") {
					LotteStorage.delSessionStorage('srhLstLoc'); /*세션스토리지에 현재 URL 삭제*/
					LotteStorage.delSessionStorage('srhLst'); /*세션스토리지에 데이터를 삭제*/
					LotteStorage.delSessionStorage('srhLstNowScrollY'); /*세션스토리지에 스크롤 위치 삭제*/
				} else {
					var sess = {}; /*세션에 담을 Object 생성*/
					//$scope.uiStateObj.templateType = $scope.templateType; /* 유닛 템플릿 타임 세팅 */
					
					if($scope.postParams.orgKeyword != $scope.postParams.keyword) {
						LotteStorage.delSessionStorage('srhLstLoc');
						return;
					}
					
					//sess.searchCntTxt = $scope.searchCntTxt; /*서브 헤더 검색결과 수*/
					sess.uiStateObj = $scope.uiStateObj; /*UI 상태값 저장*/
					sess.postParams = $scope.postParams; /*전송 데이터 저장 Input Param*/
					sess.srhResultData = $scope.srhResultData; /*검색 결과*/
					sess.srhDetailData = $scope.srhDetailData; /*상세 검색 활성화 여부*/
		
					if (!commInitData.query.localtest) {
						LotteStorage.setSessionStorage('srhLstLoc', $location.absUrl()); /*세션스토리지에 현재 URL 저장*/
						LotteStorage.setSessionStorage('srhLst', sess, 'json'); /*세션스토리지에 데이터를 JSON 형태로 저장*/
						LotteStorage.setSessionStorage('srhLstNowScrollY', angular.element($window).scrollTop()); /*세션스토리지에 스크롤 위치 저장*/
					}
				}
				
				$scope.callAppAPI("search2016://pageout");// 화면 언로드 앱호출
			});
			

			/**
			 * 스크롤 이벤트 - 더보기
			 */
			angular.element($window).on("scroll", function(){
				var $win = angular.element($window),
					$body = angular.element("body"),
					winH = $win.height(),
					bodyH = $body[0].scrollHeight,
					scrollRatio = 4.0,// 윈도우 높이의 4배
					moreLoadTime = 0;

				if(!$scope.scrollFlag){ e.preventDefault(); return ; }
				if(!$scope.productMoreScroll || $scope.productListLoading || $scope.pageLoading){ return; }

				bodyH = $body[0].scrollHeight;

				if($win.width() >= 640){// 그리드가 2단 이상일 경우 로드 비율을 낮춘다
					scrollRatio = 2;// 윈도우 높이의 2배
				}else{
					scrollRatio = 4.0;// 윈도우 높이의 4배
				}

				if($win.scrollTop() + winH >= bodyH - (winH * scrollRatio)){
					$scope.loadMoreData();
				}
			});
			
			
			// 안드로이드 버전 체크, 2.6.7 앱 크래쉬 대응
			if($scope.appObj.isApp && $scope.appObj.isAndroid && $scope.appObj.isSktApp==false && $scope.appObj.verNumber == 267){
				var cfmsg = "<div style='font-size:16px;font-weight:bold'>고객님, 반갑습니다.</div><br/>롯데닷컴 검색 기능이<br/>보다 안정화 되었습니다.<br/><br/>쾌적하고 빠른 검색을 위해<br/>지금 업데이트 후 이용해 보세요.";
				var cfobj = {
					label:{
						ok:"지금 할게요",
						cancel:"다음에 할래요"
					},
					callback:function(rtn){
						if(rtn){
							//LotteLink.appDeepLink("lotte");
							location.href = "market://details?id=com.lotte";
						}else{
							LotteStorage.setLocalStorage("NO_SHOW_android_267_update", $scope.getTodayDate());
						}
					}
				};
				
				if(LotteStorage.getLocalStorage("NO_SHOW_android_267_update") != $scope.getTodayDate()){
					$scope.confirm_2016(cfmsg, cfobj);
				}
			}
		};
		
		$scope.searchTclick2016 = function(type, str){
			var tclick = $scope.tClickBase;
			if(type == "R"){
				// search result
				tclick += "SrhResult";
			}else if(type == "S"){
				// sidebar
				tclick += "Side_Srh";
			}
			
			tclick += "_" + str;
			
			if($scope.appObj.isAndroid){
				tclick += "_and";
			}else{
				tclick += "_ios";
			}
			$scope.sendTclick(tclick);// lotte-comm.js - TCLICK 수집
		}
		
		// 20160708 추가		
		// URL에 Base Parameter 추가
		function setBaseParameter(href) {
			href = (href + "").indexOf("?") > -1 ? href : href + "?";

			if (href.substring(href.length - 1, href.length) != "?") {
				href += "&";
			}

			return href + $scope.baseParam;
		}
		
		// 배너 일반/아웃 링크 처리
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

				if ( (url + "").indexOf('main_phone.do?dispNo=') != -1 ) { // 링크 메인탭 이동시 url 변경이 한번 된 후 는 이동이 안되는 현상 예외처리
					if(tclick){
                        $scope.sendTclick(tclick);
                    }
                    
                    var disp_no_start = url.indexOf('dispNo=') + 7;
					var header_menu_dispno = url.substr(disp_no_start, 7);
					$scope.headerMenuClick(header_menu_dispno);
				} else {
					window.location.href = url; // url 이동
				}
			}
		};
		
		/**
		 * 기획전 배너 링크
		 */
		$scope.advBnrLink = function(url, idx){
			url = setBaseParameter(url);
			url += "&tclick=" + $scope.tClickBase + "SrhResult_Clk_event_idx" + (idx+1);
			window.location.href = url;
		};
		
		/**
		 * 맞춤설정 파라메터 구하기
		 */
		$scope.appendCustomSettings = function(loadParam){
			// 맞춤설정
			var customData = $scope.csCustomSettings;
			if(customData == undefined){
				customData = LotteStorage.getLocalStorage("customSearchSettings", 'json');
			}
			if(customData == undefined){ return; }
			
			var cs_arr = [];
			if(customData.category.length > 0){
				cs_arr.length = 0;
				angular.forEach(customData.category, function(item, index) {
					cs_arr.push(item.ctgNo);
				});
				loadParam.MC = cs_arr.join(",");
			}
			if(customData.brand.length > 0){
				cs_arr.length = 0;
				angular.forEach(customData.brand, function(item, index) {
					cs_arr.push(item.brnd_no);
				});
				loadParam.MB = cs_arr.join(",");
			}
			if(customData.color.length > 0){
				cs_arr.length = 0;
				angular.forEach(customData.color, function(item, index) {
					cs_arr.push(item.colorCd);
				});
				loadParam.MR = cs_arr.join(",");
			}
		}
    }]);

    app.directive('lotteContainer', ['LotteStorage', 'LotteUtil', 'LotteCommon', '$http', '$timeout', '$window', '$filter', 
		function(LotteStorage, LotteUtil, LotteCommon, $http, $timeout, $window, $filter) { // 20161201 박형윤 추가 $filter
        return {
            templateUrl : '/lotte/resources_dev/search/search_list_2016_container.html',
			replace : true,
			link:function($scope, el, attrs) {
				var $win = angular.element($window);

				$scope.startSearchList();// 검색 콘트롤 시작하기

				/**
				 * 검색키워드 링크로 연결
				 */
				$scope.goSearch = function (keyword, tclick) {
					//tclick 있을 경우 tclick 수집을 위한 url parameter 추가
					var tClickStr = "";
					if (tclick) {
						tClickStr = "&tclick=" + tclick;
					}

					$window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + '&keyword=' + keyword + tClickStr);
				};

				/**
				 * 성별/연령 모아보기
				 */
				$scope.setAgeGender = function(item, idx, flag){
					if(item == null){
						$scope.postParams.pop = "";
						$scope.postParams.rtnType = "E";
						$scope.loadDataParams($scope.postParams.rtnType);
						$scope.uiStateObj.ageGenderSearched = false;
						$scope.animateRelatedKeyword(true);
					}else{
						var pop = item.age + "," + item.gender;
						if($scope.postParams.pop == pop){ return; }
						$scope.postParams.pop = pop;
						$scope.postParams.rtnType = "E";
						$scope.loadDataParams($scope.postParams.rtnType);
						$scope.uiStateObj.ageGenderSearched = true;
					}
					
					switch(flag){
						case 1:
							// 리스트
							$scope.sendTclick($scope.tClickBase + "SrhResult_Clk_Best_Gol_idx" + (idx+1));
							break;
						case 2:
							// 모아보기
							$scope.sendTclick($scope.tClickBase + "SrhResult_Clk_Bestlist_tab_idx" + (idx+1));
							break;
						default:
							$scope.sendTclick($scope.tClickBase + "SrhResult_Clk_Bestlist_back");
							// 취소
							break;
					}
				};
				
				/**
				 * 폰트 사이즈 변경
				 */
				$scope.changeFontSize = function(){
					var body = angular.element("body");
					if(body.hasClass("enlargeFont")){
						body.removeClass("enlargeFont");
						LotteStorage.delSessionStorage("SEARCH_fontsize")
					}else{
						body.addClass("enlargeFont");
						LotteStorage.setSessionStorage("SEARCH_fontsize", "1")
					}
					$scope.sendTclick($scope.tClickBase + "SrhResult_Clk_Text_elg");
				};
				function checkFontSize(){
					var ft = LotteStorage.getSessionStorage("SEARCH_fontsize");
					if(ft === "1"){
						angular.element("body").addClass("enlargeFont");
					}
				}
				checkFontSize()
				
				/**
				 * 연관 검색어 애니메이트
				 */
				$scope.animateRelatedKeyword = function(noani) {
					var wrap = $(".reated_keyword .scroll_wrap");
					wrap.stop(true);
					if(noani===true){
						wrap.css("left", 0);
					}else{
						wrap.css("left", "120%");
					}
					$timeout(function () {
						$scope.animateRelatedKeywordDelay(noani);
					}, 200);
				};

				$scope.animateRelatedKeywordDelay = function(noani) {
					try{
						var wrap = $(".reated_keyword .scroll_wrap");
						wrap.stop(true);
						if(noani===true){
							wrap.css("left", 0);
						}else{
							wrap.animate({left:"0px"}, 250);
						}
						var w = 0;
						$("#relatedKeywordSlider li").each(function(idx, itm){
							w += ($(itm).width() + 6);
						});
						$("#relatedKeywordSlider ul").width(w);
						$timeout(function(){
							$("#relatedKeywordSlider.ipad_slider").scrollLeft(0);
							if($("#relatedKeywordSlider.other_slider").length > 0){
								angular.element("#relatedKeywordSlider.other_slider").scope().reset();
							}
						}, 100);
						
					}catch(e){
						if(!$scope.uiStateObj.relatedKeywordEnabled){ return; }
						$timeout(function () {
							$scope.animateRelatedKeywordDelay();
						}, 200);
					}
				};
				
				/**
				 * 상단 검색 헤더, 삭제버튼 클릭
				 * @param clearKW 키워드 삭제 여부
				 */
				$scope.showSrhLayerHeader = function(clearKW){
					$scope.sendTclick($scope.tClickRenewalBase + "Srhheader_Clk_Lyr_1");
					$scope.showSrhLayer(true, clearKW);
				}

				/**
				 * 상단 검색 레이어 열기
				 * @param tFlag 티클릭 여부
				 * @param clearKW 키워드 삭제 여부
				 */
				$scope.showSrhLayer = function(tFlag, clearKW){
					if(!tFlag){
						$scope.sendTclick($scope.tClickBase + "header_Clk_Lyr_2");
					}
					if($scope.appObj.isApp && $scope.uiStateObj.voiceSearch){
						clearKW = true;
					}
					
					var ao = $scope.appObj;
					// app
					var str = "lottesearch://newsearch";
					if(clearKW !== true){
						if( ao.isIOS && ((ao.isIpad && ao.verNumber==237) || (ao.verNumber==2710)) ){
							str += "?keyword=" + encodeURIComponent(encodeURIComponent($scope.srhResultData.keyword));
						}else{
							str += "?keyword=" + encodeURIComponent($scope.srhResultData.keyword);
						}
					}
					
					// 최근본상품 추가
					var isLatelyGoodsApp = false;
					if(ao.isIOS){
						if(ao.isIpad && ao.verNumber>=237){
							isLatelyGoodsApp = true;
						}else if(ao.verNumber>=2710){
							isLatelyGoodsApp = true;
						}
					}else if(ao.isSktApp && ao.verNumber >= 215){
						isLatelyGoodsApp = true;
					}else if(ao.verNumber >= 279){
						isLatelyGoodsApp = true;
					}
					if(isLatelyGoodsApp){
						var lately = LotteStorage.getLocalStorage("latelyGoods");
						if(lately != null && lately != ""){
							lately = lately.replace(/\|/g, ",");
							if(str.indexOf("?") >= 0){
								str += "&latelyGoods=" + lately;
							}else{
								str += "?latelyGoods=" + lately;
							}
						}
					}
					// 최근본상품 추가
					if($scope.appObj.isApp && ! $scope.appObj.isIOS && !$scope.appObj.isOldApp){
						try{
							$window.lottesearch.callAndroid(str);
						}catch(e){}
						return;
					}

					if($scope.appObj.isApp && $scope.appObj.isIOS && !$scope.appObj.isIpad){
						$window.location.href =  str;
						return;
					}else if($scope.appObj.isApp && $scope.appObj.isIOS && ($scope.appObj.isIpad && !$scope.appObj.isOldApp)){
						$window.location.href =  str;
						return;
					}

					// web
					if(clearKW === true){
						$scope.delSrhText();
					}else{
						$scope.keyword = $scope.srhResultData.keyword;
						$timeout(function(){$scope.showAutoSrh({keyCode:1});}, 100);
					}
					$scope.showRecentKeyword();
				}
				
				
				/**
				 * 사이드바 닫기 버튼 클릭
				 */
				$scope.closeSidebarBtnClk = function(){
					if($scope.searchUISetting.isShowSub){
						switch($scope.searchUISetting.slide){
							case "category":
							case "brand":
							case "benefit":
							case "color":
							case "price":
								$scope.searchTclick2016("S", $scope.searchUISetting.slide + "_CLK_close_Btn");
								break;
							case "sort":
								$scope.searchTclick2016("S", "sorting_CLK_close_Btn");
								break;
							case "research":
								$scope.searchTclick2016("S", "srhwithinresult_CLK_close_Btn");
								break;
							case "store":
								$scope.searchTclick2016("S", "srhresult_CLK_close_Btn");
								break;
							case "delivery":
								$scope.searchTclick2016("S", "shipping_CLK_close_Btn");
								break;
						}
					}else{
						$scope.searchTclick2016("S", "CLK_close_Btn");
					}
					
					$scope.closeSideSearch();
				};

				/**
				 * 사이드 상세검색 열기/닫기
				 */
				$scope.closeSideSearch = function(){
					if($scope.searchTermsChanged){//검색이 변경되었으면 상단 스크롤 유지
						$scope.LotteDimm.scrollY = 0;
					}
					if ($scope.LotteDimm.target == "sideSearch") {
						$scope.dimmedClose();
					} else {
						//var tclick = "m_DC_side_cate_Clk_close_Btn";
						//$scope.sendTclick(tclick);
						$scope.searchUISetting.isShowSideBar = false;
					}
					
					if($scope.searchUISetting.isShowSub === true){
						$scope.hideSubSearch();
					}
				};
				
				$scope.showHideSideSearch = function(shortcut){
					if($scope.isValidApp){
						// APP
						$scope.callAppAPI( $scope.getSearchTermParam(shortcut) );
						
					}else{
						// WEB
						if ($scope.searchUISetting.isShowSideBar) {
							$scope.closeSideSearch();
						} else {
							if($scope.uiStateObj.detailSearchDataLoaded == false){ return; }
							
							$scope.searchTermsChanged = false;
							$scope.searchUISetting.isShowSideBar = true;
							$scope.dimmedOpen({
								target: "sideSearch",
								callback: this.closeSideSearch,
								scrollEventFlag: false
							});
							
							$(".side_search_wrap .ssw_content .ssw_slide.sub").scrollTop(0);// 서브슬라이드 상단으로 스크롤
							if(shortcut=="SORT"){
								$scope.showSubSearch({currentTarget:$(".ssw_slide.main li a[data-label='정렬']")});
							}
						}
					}
					
					if(shortcut=="SORT"){
						$scope.searchTclick2016("R", "sorting_Btn");//정렬
					}else{
						$scope.searchTclick2016("R", "detailedsrh_Btn");//상세검색
					}
				};
				
				/**
				 * 상세검색 서브 열기
				 */
				$scope.showSubSearch = function(e) {
					var a = $(e.currentTarget);
					var slide = a.data("slide");
					$scope.searchUISetting.title = a.data("label");
					$scope.searchUISetting.slide = slide;
					$scope.searchUISetting.isShowSub = true;

					var $sswSlideSub = angular.element(".ssw_slide.sub");
					$sswSlideSub.off("scroll");

					if ($scope.searchUISetting.slide == "brand") {
						// 20161201 박형윤 추가 --
						if (!$scope.srhResultData.brdLstRender || $scope.srhResultData.brdLstRender.length == 0) {
							if($scope.srhResultData.brdLst.items != undefined){
								$scope.srhResultData.brdLstRender = $scope.srhResultData.brdLst.items.slice(0, $scope.brdShowListCnt);
							}
						}
						
						$sswSlideSub.on("scroll", function () {
							if ($sswSlideSub.scrollTop() >= $sswSlideSub.find(".ssws_brand").height() - $sswSlideSub.height() - 200) {
								var brdLstCnt = $scope.srhResultData.brdLstRender.length,
									sliceItem = $scope.srhResultData.brdLst.items.slice(brdLstCnt, brdLstCnt + $scope.brdShowListCnt),
									concatItem = $scope.srhResultData.brdLstRender.concat(sliceItem);

								if (concatItem.length > 0) {
									$scope.$apply(function () {
										$scope.srhResultData.brdLstRender = concatItem;
									});
								} else {
									$sswSlideSub.off("scroll");
								}
							}
						});
					}
					//-- 20161201 박형윤 추가
					
					// 이전과 다른 슬라이드 열때 탑으로 스크롤
					if($scope.searchUISetting.lastSlide != slide){
						$(".side_search_wrap .ssw_content .ssw_slide.sub").scrollTop(0);
					}
					$scope.searchUISetting.lastSlide = slide;
					
					switch(a.data("slide")){
						case "price":
							$scope.postParams.priceMaxUTemp = $scope.postParams.priceMaxU;
							$scope.postParams.priceMinUTemp = $scope.postParams.priceMinU;
						break;
						case "research":
							$scope.postParams.rekeyword = "";
						break;
					}
					
					switch(a.data("slide")){
						case "category":
						case "brand":
						case "benefit":
						case "color":
						case "price":
							$scope.searchTclick2016("S", a.data("slide"));
							break;
						case "sort":
							$scope.searchTclick2016("S", "sorting");
							break;
						case "research":
							$scope.searchTclick2016("S", "srhwithinresult");
							break;
						case "store":
							$scope.searchTclick2016("S", "srhresult");
							break;
						case "delivery":
							$scope.searchTclick2016("S", "shipping");
							break;
					}
				};
				
				/**
				 * 상세검색 서브 닫기
				 */
				$scope.hideSubSearch = function(){
					if($scope.searchUISetting.isShowSub){
						switch($scope.searchUISetting.slide){
							case "category":
							case "brand":
							case "benefit":
							case "color":
							case "price":
								$scope.searchTclick2016("S", $scope.searchUISetting.slide + "_CLK_back_Btn");
								break;
							case "sort":
								$scope.searchTclick2016("S", "sorting_CLK_back_Btn");
								break;
							case "research":
								$scope.searchTclick2016("S", "srhwithinresult_CLK_back_Btn");
								break;
							case "store":
								$scope.searchTclick2016("S", "srhresult_CLK_back_Btn");
								break;
							case "delivery":
								$scope.searchTclick2016("S", "shipping_CLK_back_Btn");
								break;
						}
					}
					
					$scope.searchUISetting.slide = null;
					$scope.searchUISetting.keywordIncExc = false;
					if($scope.searchUISetting.isShowSub == false){ return; }
					$scope.searchUISetting.isShowSub = false;
				}
				

				
				/**
				 * 정렬 인기/판매 베스트 안내팝업
				 */
				$scope.showHideSortGuide = function(){
					$scope.tipShow = !$scope.tipShow;
					if($scope.tipShow){
						$("#pop_sortGuide").css("top", $("#sortGuideButton").offset().top - 152);
						$timeout($scope.positionSortGuide, 0);
					}
				}
				$scope.positionSortGuide = function(){
					$("#pop_sortGuide").css("top", $("#sortGuideButton").offset().top - $("#pop_sortGuide").outerHeight() - 3);
				}
				

				/**
				 * 스마트픽 체크박스 클릭
				 */
				$scope.srhFilterSmpickClick = function (e){
					var cb = $(e.currentTarget);
					if(cb.is(":checked")){
						$scope.uiStateObj.smpickLayerOpenFlag = true;
						angular.element("#wrapper").addClass("overflowy_hidden");
					}
					
					//var tClickStr = $scope.tClickBase + "SEARCH_detail_10";
					//$scope.sendTclick(tClickStr);// lotte-comm.js - TCLICK 수집
				}
				
				/**
				 * 스마트픽 펼치기/닫기
				 */
				$scope.showHideSmartPick = function(){
					$scope.searchUISetting.smartPickSub = ! $scope.searchUISetting.smartPickSub;
				};
				
				/**
				 * 스마트픽, 백화점 펼치기/닫기
				 */
				$scope.showHideDepartmentPick = function(e){
					var a = angular.element(e.currentTarget);
					var li = a.parent();
					if(li.hasClass("disabled")){ return; }
					
					$scope.searchUISetting.smartPickList = ! $scope.searchUISetting.smartPickList;
				};
				
				/**
				 * 스마트픽 지점 변경
				 */
				$scope.smpickBranchChange = function (item) {
					if($scope.postParams.smpickBranchNo == item.branchNo){
						$scope.postParams.smpickYN = "N";
						$scope.postParams.smpickBranchNo = null;
						$scope.uiStateObj.smpickBranchName = "";
					}else{
						$scope.postParams.smpickYN = "Y";
						$scope.postParams.smpickBranchNo = item.branchNo;
						$scope.uiStateObj.smpickBranchName = item.name;
					}
					$scope.srhDetailPost();//상세검색 조회
					$scope.searchTclick2016("S", "shipping_CLK_dep_Btn");
				};
				
				
				/**
				 * 카테고리 아이템 클릭
				 */
				$scope.categoryItemClick = function(e, item){
					var a = $(e.currentTarget);
					var li = a.parent();
					$scope.categoryAccordian(li, item.ctgNo);
					$scope.srhSubCtgPost();
					
					switch(li.data("depth")){
						case 0:
							$scope.searchTclick2016("S", "category_CLK_Catebiggest_" + item.ctgNo);
							break;
						case 1:
							$scope.searchTclick2016("S", "category_CLK_Catebig_" + item.ctgNo);
							break;
						case 2:
							$scope.searchTclick2016("S", "category_CLK_Catemedium_" + item.ctgNo);
							break;
						case 3:
							$scope.searchTclick2016("S", "category_CLK_Catesmall_" + item.ctgNo);
							break;
					}
				}
				
				/**
				 * 카테고리 펼치기/닫기
				 */
				$scope.categoryAccordian = function(li, ctgNo){
					if(li.hasClass("nochild")){ return; }
					
					var H = 41;
					var ul = li.find("> ul");
					
					if(ul.length > 0){
						// 서브카테가 있는 경우
						if(li.hasClass("open")){
							li.removeClass("open");
							ul.height(0);
						}else{
							li.addClass("open");
							var cnt = ul.find("> li").length;
							ul.height(H * cnt);
							
							var sb;
							li.siblings(".open").each(function(idx, itm){
								sb = $(itm);
								sb.removeClass("open");
								sb.find("> ul").height(0);
							});
						}
						
						// 상위카테 높이 조정
						$scope.categoryAccordianParent(li);
					}else{
						// 서브카테가 없는 경우
					}
					
					// 카테고리 선택상태 설정
					if(ctgNo == undefined){ return; }
					var pul = li.parent();
					var depth = 0;
					if(pul.hasClass("cate_d1")){
						//대대카
						$scope.uiStateObj.selectedCategory.depth1 = ctgNo;
						$scope.uiStateObj.selectedCategory.depth2 = null;
						$scope.uiStateObj.selectedCategory.depth3 = null;
						$scope.uiStateObj.selectedCategory.depth4 = null;
					}else if(pul.hasClass("cate_d2")){
						//대카
						$scope.uiStateObj.selectedCategory.depth2 = ctgNo;
						$scope.uiStateObj.selectedCategory.depth3 = null;
						$scope.uiStateObj.selectedCategory.depth4 = null;
						$scope.categoryCheckParent(li);
					}else if(pul.hasClass("cate_d3")){
						//중카
						$scope.uiStateObj.selectedCategory.depth3 = ctgNo;
						$scope.uiStateObj.selectedCategory.depth4 = null;
						$scope.categoryCheckParent(li);
					}else if(pul.hasClass("cate_d4")){
						//소카
						$scope.uiStateObj.selectedCategory.depth4 = ctgNo;
						$scope.categoryCheckParent(li);
					}
					$scope.uiStateObj.selectedCategory.ctgName = li.data("name");
				}
				
				/**
				 * 상위 카테고리 선택상태 체크
				 */
				$scope.categoryCheckParent = function(li){
					var pli;
					var ul = li.parent();
					pli = ul.parent();
					if(ul.hasClass("cate_d1")){
						//대대카
						return;
					}else if(ul.hasClass("cate_d2")){
						//대카
						if($scope.uiStateObj.selectedCategory.depth1 == null){
							$scope.uiStateObj.selectedCategory.depth1 = pli.data("no");
						}
					}else if(ul.hasClass("cate_d3")){
						//중카
						if($scope.uiStateObj.selectedCategory.depth2 == null){
							$scope.uiStateObj.selectedCategory.depth2 = pli.data("no");
						}
						$scope.categoryCheckParent(pli);
					}else if(ul.hasClass("cate_d4")){
						//소카
						if($scope.uiStateObj.selectedCategory.depth3 == null){
							$scope.uiStateObj.selectedCategory.depth3 = pli.data("no");
						}
						$scope.categoryCheckParent(pli);
					}
				}
				
				/**
				 * 상위 카테고리의 높이 조정
				 */
				$scope.categoryAccordianParent = function(li){
					var ul = li.parent();
					
					var lis = ul.find("> li");
					var h = 0;
					lis.each(function(idx, itm){
						h += $(itm).height();
					});
					ul.height(h);
					
					if(ul.hasClass("cate_d1")){ return; }
					$scope.categoryAccordianParent(ul.parent());
				}
				
				/**
				 * 서브 카테고리(대카) 선택
				 */
				$scope.srhSubCtgPost = function (){
					var ctgNo, depth;
					if($scope.uiStateObj.selectedCategory.depth4 != null){
						ctgNo = $scope.uiStateObj.selectedCategory.depth4;
						depth = 3;
					}else if($scope.uiStateObj.selectedCategory.depth3 != null){
						ctgNo = $scope.uiStateObj.selectedCategory.depth3;
						depth = 2;
					}else if($scope.uiStateObj.selectedCategory.depth2 != null){
						ctgNo = $scope.uiStateObj.selectedCategory.depth2;
						depth = 1;
					}else if($scope.uiStateObj.selectedCategory.depth1 != null){
						ctgNo = $scope.uiStateObj.selectedCategory.depth1;
						depth = 0;
					}
					
					if(ctgNo == undefined){ return; }
					
					$scope.postParams.ctgNo = ctgNo;
					$scope.postParams.ctgDepth = depth;
					$scope.uiStateObj.srhFilterCtgFlag = true;

					$scope.srhFilterBrdInit(); //브랜드 초기화
					$scope.srhFilterDetailInit(); //상세검색 초기화

					//POST
					$scope.postParams.rtnType = "C";
					$scope.loadDataParams($scope.postParams.rtnType);

					var tClickStr = $scope.tClickBase + "SEARCH_CATE_02";
					$scope.sendTclick(tClickStr); //lotte-comm.js, TCLICK 수집
				}

				/**
				 * 브랜드 체크 변경
				 */
				$scope.srhChkBrdPost = function (item, noload) {
					if ($scope.postParams.brdNoArr.indexOf(item.brdNo) == -1) {
						$scope.postParams.brdNoArr.push(item.brdNo);
						$scope.postParams.brdNmArr.push(item.brdName);
					} else {//선택 취소
						var tmpIdx = $scope.postParams.brdNoArr.indexOf(item.brdNo);
						if (tmpIdx > -1) {
							$scope.postParams.brdNoArr.splice(tmpIdx, 1);
							$scope.postParams.brdNmArr.splice(tmpIdx, 1);
						}
					}

					if ($scope.postParams.brdNoArr.length > 0) {//선택된 값이 있을 경우
						$scope.uiStateObj.srhFilterBrdFlag = true;
					} else {
						$scope.uiStateObj.srhFilterBrdFlag = false;
					}

					//$scope.srhFilterDetailInit(); //상세검색 초기화

					if(noload !== "N"){
						//POST
						$scope.postParams.rtnType = "E";
						$scope.loadDataParams($scope.postParams.rtnType);
						
						$scope.searchTclick2016("S", "brand_CLK_" + item.brdNo);
						//var tClickStr = $scope.tClickBase + "SEARCH_BRAND_03";
						//$scope.sendTclick(tClickStr);//lotte-comm.js, TCLICK 수집
					}
				}
				
				/**
				 * 브랜드 리스트 정렬조건 변경
				 */
				$scope.srhFilterBrdSortChange = function (type) {
					// 20161201 박형윤 추가 --
					$scope.srhResultData.brdLst.items = $filter('orderBy')($scope.srhResultData.brdLst.items, $scope.uiStateObj.srhFilterBrdSort);

					if (typeof $scope.srhResultData.brdLst.tcnt != "undefined" &&
						$scope.srhResultData.brdLst.tcnt > 0 &&
						typeof $scope.srhResultData.brdLst.items != "undefined") {
						$scope.srhResultData.brdLstRender = $scope.srhResultData.brdLst.items.slice(0, 50);
					}
					//-- 20161201 박형윤 추가

					if(type == "-cnt"){
						$scope.searchTclick2016("S", "brand_CLK_srtcnt_Btn");
					}else{
						$scope.searchTclick2016("S", "brand_CLK_srtabc_Btn");
					}
					/*var tClickStr = "";
					if (type == "-cnt") {
						tClickStr = $scope.tClickBase + "SEARCH_BRAND_01";
					} else {
						tClickStr = $scope.tClickBase + "SEARCH_BRAND_02";
					}
					$scope.sendTclick(tClickStr);//lotte-comm.js - TCLICK 수집*/
				}
				

				/**
				 * Sortting 변경
				 */
				$scope.srhSortPost = function (idx) {
					$scope.uiStateObj.sortTypeIdx = idx;
					$scope.uiStateObj.srhFilterSortFlag = true;

					$scope.postParams.rtnType = "S";//정렬 조건 타입으로 설정
					$scope.loadDataParams($scope.postParams.rtnType); //결과 조회

					switch (idx) {
						case 0 : $scope.searchTclick2016("S", "sorting_popbest"); break; //인기순BEST
						case 1 : $scope.searchTclick2016("S", "sorting_selbest"); break; //판매BEST
						case 2 : $scope.searchTclick2016("S", "sorting_reviewbest"); break; //상품평많은순
						case 3 : $scope.searchTclick2016("S", "sorting_newest"); break; //최근등록순
						case 4 : $scope.searchTclick2016("S", "sorting_hghprice"); break; //낮은가격순
						case 5 : $scope.searchTclick2016("S", "sorting_lwprice"); break; //높은가격순
					}
					$win.scrollTop(0);
				};
				

				
				/**
				 * 색상칩 클릭
				 */
				$scope.srhSelectColor = function(item, noload){
					var idx = $scope.postParams.selectedColor.indexOf(item.colorCd);
					if(item.selected === true){
						// 선택 해제
						item.selected = false;
						if(idx >= 0){
							$scope.postParams.selectedColor.splice(idx, 1);
						}
						
					}else{
						// 선택
						item.selected = true;
						if(idx < 0){
							$scope.postParams.selectedColor.push(item.colorCd);
						}
					}
					
					if(noload!=="N"){
						//$scope.srhDetailSearchActiveChk();//상세검색 활성화 여부 검증
						$scope.srhDetailPost();//상세검색 조회
						
						//$scope.sendTclick($scope.tClickBase + "SEARCH_color");//lotte-comm.js - TCLICK 수집
						$scope.searchTclick2016("S", "color_" + item.colorCd);
					}
					
					return;
					// 20161201 박형윤 로직 오류 주석 처리
					// $scope.postParams.selectedColor.length = 0;
					
					// var c = $(e.currentTarget);
					// var cd = c.data("color-cd");
					// var cl = $scope.srhDetailData.srhColorList;
					// var cli;
					// var len = cl.length;
					// for(var i=0; i<len; i++){
					// 	cli = cl[i];
					// 	if(cli.colorCd == cd){
					// 		cli.selected = ! cli.selected;
					// 	}
						
					// 	if(cli.selected){
					// 		$scope.postParams.selectedColor.push(cli.colorCd);
					// 	}
					// }
					
					// //$scope.srhDetailSearchActiveChk();//상세검색 활성화 여부 검증
					// $scope.srhDetailPost();//상세검색 조회
					
					// $scope.sendTclick($scope.tClickBase + "SEARCH_color");//lotte-comm.js - TCLICK 수집
				};

				/*상세조건 활성화 여부*/
				$scope.srhDetailSearchActiveChk = function () {
					var chkCnt = 0;

					angular.forEach($scope.uiStateObj.srhFilterDetailArr, function (item) {
						if ($scope.postParams[item] == "Y") {
							chkCnt++;
						}
					});
					
					// 선택된 컬러 체크
					if($scope.postParams.selectedColor.length > 0){
						chkCnt++;
					}
					
					// 선택된 조건이 있다면
					if (chkCnt > 0 ||
						$scope.postParams.priceMinU ||
						typeof $scope.postParams.priceMinU == "undefined" ||
						 $scope.postParams.priceMaxU != null ||
						 typeof $scope.postParams.priceMaxU == "undefined" ||
						 $scope.postParams.rekeyword) {
						$scope.uiStateObj.srhFilterDetailFlag = true;// 상세 검색 조건 필터된 상태로 탭 표시
					} else {
						$scope.uiStateObj.srhFilterDetailFlag = false;
					}
				}

				/*상세검색 조회*/
				$scope.srhDetailPost = function () {
					$scope.srhDetailSearchActiveChk();
					$scope.postParams.rtnType = "E";//상세검색 조건 타입으로 설정
					$scope.loadDataParams($scope.postParams.rtnType); //결과 조회
				}
				
				
				/*상세검색 조건 변경*/
				$scope.srhDetailChange = function (type){
					/*
					// 기획 요청으로 갯수제한 삭제
					var chkCnt = 0;
					angular.forEach($scope.uiStateObj.srhFilterDetailArr, function (item) {
						if ($scope.postParams[item] == "Y") {
							chkCnt++;
						}
					});
					if (chkCnt > 5) {
						alert("조건이 너무 많습니다.\n초기화 후 사용하시기 바랍니다.");
						$scope.postParams[type] = "N";
					}
					*/

					//선택한 조건에 따른 tclick 설정
					var tClickStr = "";
					switch (type) {
						case "deptYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_01"; break; //롯데백화점
						case "tvhomeYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_02"; break; //롯데홈쇼핑
						case "superYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_03"; break; //롯데슈퍼
						case "brdstoreYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_04"; break; //브랜드스토어
						
						case "freeDeliYN"	: $scope.searchTclick2016("S", "benefit_freeshipping"); break; //무료배송
						case "smpickYN"		: $scope.searchTclick2016("S", "benefit_smartpick"); break; //스마트픽
						case "freeInstYN"	: $scope.searchTclick2016("S", "benefit_interestfree"); break; //무이자
						case "pointYN"		: $scope.searchTclick2016("S", "benefit_point"); break; //포인트
						case "pkgYN"		: $scope.searchTclick2016("S", "benefit_freepackaging"); break; //무료포장
						
						case "delSevenYN"	: $scope.searchTclick2016("S", "shipping_CLK_seveneleven_Btn"); break;//세븐일레븐
						case "delTdarYN"	: $scope.searchTclick2016("S", "shipping_CLK_today_Btn"); break;//오늘배송
						case "delQuickYN"	: $scope.searchTclick2016("S", "shipping_CLK_quick_Btn"); break;//퀵배송
					}
					if (tClickStr != "") { //tclick 이 있다면
						$scope.sendTclick(tClickStr); //lotte-comm.js, TCLICK 수집
					}

					/*if(type != 'deptYN' && type != 'tvhomeYN' && type != 'superYN' && type != 'brdstoreYN') {
						$scope.srhDetailSearchActiveChk(); //상세검색 활성화 여부 검증
					}*/
					$scope.srhDetailPost(); //상세검색 조회
				}
				
				/**
				 * 가격 입력시 글자수 제한
				 */
				$scope.srhDetailPriceMaxlen = function(type){
					var tf = $("#priceMaxU");
					if(type == "min"){
						tf = $("#priceMinU");
					}
					var str = tf.val();
					if(str.length > 10){
						tf.val( str.substr(0, 10) );
					}
				}
				/**
				 * 상세검색 가격 변경시 가격 검증 가격 검증 실패시 $scope.srhDetailPriceValidateFlag 값 false 처리
				 */
				$scope.srhDetailPriceValidate = function (type) {
					$scope.srhDetailPriceValidateFlag= true;

					if($scope.postParams.priceMinUTemp != null) {
						if($scope.postParams.priceMinUTemp.length > 0) {
							$scope.postParams.priceMinUTemp = $scope.postParams.priceMinUTemp.replace(/[^0-9]/g,'');
						}
					}
					if($scope.postParams.priceMaxUTemp != null) {
						if($scope.postParams.priceMaxUTemp.length > 0) {
							$scope.postParams.priceMaxUTemp = $scope.postParams.priceMaxUTemp.replace(/[^0-9]/g,'');
						}
					}
					
					if (type == "min" && $scope.srhResultData.price.min) {
						/*CASE 1 : 가격 INPUT에 아무것도 입력 안했을 경우 type이 object로 나옴 - 해당하는 경우 처리해줄 내용 없음*/
						/*CASE 2 : 가격에 최소가로 설정한 값보다 값이 작거나 최대가로 설정한 값보다 값이 큰 경우 type이 undefined로 나옴*/
						/*CASE 3 : 가격에 정상적인 가격이 입력됐을 경우 type이 number로 나옴*/
						if (typeof $scope.postParams.priceMinUTemp == "undefined") { /*CASE 2 : 검색 최소가로 변경 처리*/
							$scope.postParams.priceMinUTemp = $scope.srhResultData.price.min;
							$scope.srhDetailPriceValidateFlag= false;
							alert("검색결과 내 최저가격보다 낮습니다.");
							return false;
						} else if (typeof $scope.postParams.priceMinUTemp == "number" &&  /*입력된 최소가가 있고*/
							typeof $scope.postParams.priceMaxUTemp != "number" &&  /*입력된 최고가가 없고*/
							$scope.postParams.priceMinUTemp > $scope.srhResultData.price.max) { /*검색 최고가 보다 최소가가 큰 경우*/
							$scope.postParams.priceMinUTemp = $scope.srhResultData.price.max;
							$scope.srhDetailPriceValidateFlag= false;
							alert("검색결과 내 최고가격보다 높습니다.");
							return false;
						} else if (typeof $scope.postParams.priceMinUTemp == "number" &&  /*입력된 최소가가 있고*/
							typeof $scope.postParams.priceMaxUTemp == "number" &&  /*입력된 최고가가 있고*/
							$scope.postParams.priceMinUTemp > $scope.postParams.priceMaxUTemp) { /*검색 최고가 보다 최소가가 큰 경우*/
							//$scope.postParams.priceMinUTemp = $scope.postParams.priceMaxUTemp;
							if($scope.postParams.priceMinUTemp > $scope.srhResultData.price.max){
								alert("검색결과 내 최고가격보다 높습니다.");
								$scope.postParams.priceMinUTemp = $scope.srhResultData.price.max;
							}
							var mintemp = $scope.postParams.priceMinUTemp;
							$scope.postParams.priceMinUTemp = $scope.postParams.priceMaxUTemp;
							$scope.postParams.priceMaxUTemp = mintemp;
							$scope.srhDetailPriceValidateFlag= true;
							//alert("최고가격이 최저가격보다 낮습니다.");
							//return false;
						}
					} else if (type == "max" && $scope.srhResultData.price.max) {
						/*CASE 1 : 가격 INPUT에 아무것도 입력 안했을 경우 type이 object로 나옴 - 해당하는 경우 처리해줄 내용 없음*/
						/*CASE 2 : 가격에 최대가로 설정한 값보다 값이 크거나 최소가로 설정한 값보다 값이 작은 경우 type이 undefined로 나옴*/
						/*CASE 3 : 가격에 정상적인 가격이 입력됐을 경우 type이 number로 나옴*/
						if (typeof $scope.postParams.priceMaxUTemp == "undefined") { /*CASE 2 : 검색 최고가로 변경 처리*/
							$scope.postParams.priceMaxUTemp = $scope.srhResultData.price.max;
							$scope.srhDetailPriceValidateFlag= false;
							alert("검색결과 내 최고가격보다 높습니다.");
							return false;
						} else if (typeof $scope.postParams.priceMaxUTemp == "number" &&  /*입력된 최고가가 있고*/
							typeof $scope.postParams.priceMinUTemp != "number" &&  /*입력된 최소가가 없고*/
							$scope.postParams.priceMaxUTemp < $scope.srhResultData.price.min) { /*검색 최소가 보다 최고가가 작은 경우*/
							$scope.postParams.priceMaxUTemp = $scope.srhResultData.price.max;
							$scope.srhDetailPriceValidateFlag= false;
							alert("검색결과 내 최저가격보다 낮습니다.");
							return false;
						} else if (typeof $scope.postParams.priceMaxUTemp == "number" &&  /*입력된 최고가가 있고*/
							typeof $scope.postParams.priceMinUTemp == "number" &&  /*입력된 최소가가 있고*/
							$scope.postParams.priceMaxUTemp < $scope.postParams.priceMinUTemp) { /*검색 최고가 보다 최소가가 큰 경우*/
							//$scope.postParams.priceMaxUTemp = $scope.postParams.priceMinUTemp;
							if($scope.postParams.priceMaxUTemp < $scope.srhResultData.price.min){
								alert("검색결과 내 최저가격보다 낮습니다.");
								$scope.postParams.priceMaxUTemp = $scope.srhResultData.price.min;
							}
							var mintemp = $scope.postParams.priceMinUTemp;
							$scope.postParams.priceMinUTemp = $scope.postParams.priceMaxUTemp;
							$scope.postParams.priceMaxUTemp = mintemp;
							$scope.srhDetailPriceValidateFlag= true;
							//alert("최고가격이 최저가격보다 낮습니다.");
							//return false;
						}
					}
				}
				
				/**
				 * 가격대 검색 버튼 클릭
				 */
				$scope.srhDetailSearchPrice = function(){
					if (!$scope.srhDetailPriceValidateFlag) { //가격 검증 완료 체크
						$scope.srhDetailPriceValidateFlag = true;
						return false;
					}

					//상세검색 '검색' 버튼 클릭시 선택된 조건이 있는지 확인
					if (!$scope.postParams.priceMinUTemp && !$scope.postParams.priceMaxUTemp){
						//&& $scope.postParams.rekeyword == "") {
						alert("검색 조건을 입력해 주세요.");
						return false;
					} else {
						//var tClickStr = $scope.tClickBase + "SEARCH_detail_09";
						//$scope.sendTclick(tClickStr); //lotte-comm.js - TCLICK 수집
						
						$scope.postParams.priceMinU = $scope.postParams.priceMinUTemp;
						$scope.postParams.priceMaxU = $scope.postParams.priceMaxUTemp;
						$scope.srhDetailPost(); //상세검색 조회
						
						$scope.searchTclick2016("S", "price_CLK_srh_Btn");
					}
				}
				
				$scope.srhDetailSearchFocus = function(){
					$scope.searchUISetting.keywordIncExc = false;
				}

				/**
				 * 결과 내 검색 버튼 클릭
				 */
				$scope.srhDetailSearchKeyword = function(from){
					$scope.searchUISetting.keywordIncExc = false;
					
					var isPopup = (from == "pop");
					if(isPopup){
						$scope.searchUISetting.researchIdx = 0;
					}
					
					if ($scope.postParams.rekeyword == "") {
						alert("검색할 단어를 입력해 주세요.");
						return false;
					}
					
					if($scope.searchUISetting.researchIdx == 0){
						$scope.addRequeryKeyword($scope.postParams.rekeyword);// 포함단어
						if(!isPopup){
							$scope.searchTclick2016("S", "srhwithinresult_CLK_include_srh_Btn");
						}
					}else{
						$scope.addExqueryKeyword($scope.postParams.rekeyword);// 제외단어
						if(!isPopup){
							$scope.searchTclick2016("S", "srhwithinresult_CLK_exclude_srh_Btn");
						}
					}
					$scope.postParams.rekeyword = "";
					
					$scope.closeSideSearch();// 사이드바 닫기
					$scope.hideRelatedKWPopup();// 팝업 닫기
				}

				/*키보드 검색 엔터시*/
				$scope.srhDetailSearchKeypress = function (e) {
					if (e.which === 13) {
						if( $(e.currentTarget).prop("id") == "rekeyword_pop" ){
							$scope.srhDetailSearchKeyword("pop");
						}else{
							$scope.srhDetailSearchKeyword();
						}
						e.preventDefault();
					}
				}
				
				$scope.srhDetailSearchKeyUp = function(e){
					$scope.uiStateObj.relatedKeywordEntered = false;
					var str = $(e.currentTarget).val();
					if(str != undefined && str.length > 0){
						$scope.uiStateObj.relatedKeywordEntered = true;
					}
				}
				
				/**
				 * 재검색 키워드 삭제하기 (포함단어)
				 */
				$scope.deleteRequeryKeyword = function(keyword){
					var idx = $scope.postParams.reQuery.indexOf(keyword);
					if(idx >= 0){
						$scope.postParams.reQuery.splice(idx, 1);// remove keyword
						angular.element("#searchKeywordSlider").scope().reset();// reset slider
						$scope.uiStateObj.rekeywordChanged = true;
						$scope.srhKeywordPost();// POST
						
						$scope.scrollToTop();
					}

					//$scope.callAppAPI("search2016://rekeywordChanged");// 재검색어 변경됨
					$scope.searchTclick2016("R", "CLK_del_srhkeywd_Btn");
				};
				
				/**
				 * 재검색 키워드 추가 (포함단어)
				 */
				$scope.addRequeryKeyword = function(keyword, tclick){
					keyword = keyword.replace(/ /g, "");
					var idx = $scope.postParams.reQuery.indexOf(keyword);
					if(idx < 0){
						$scope.postParams.reQuery.push(keyword);// add keyword
						angular.element("#searchKeywordSlider").scope().reset();// reset slider
						$scope.uiStateObj.rekeywordChanged = true;
						$scope.srhKeywordPost();// POST
						
						$scope.scrollToTop();
					}
					
					if(tclick == "Y"){
						if(keyword == "스마트픽"){
							$scope.searchTclick2016("R", "CLK_srhkeywd_smartpick_Btn");
						}else{
							$scope.searchTclick2016("R", "CLK_srhkeywd_Btn");
						}
					}
					
					//$scope.callAppAPI("search2016://rekeywordChanged");// 재검색어 변경됨
				}
				
				/**
				 * 재검색 키워드 추가 (제외단어)
				 */
				$scope.addExqueryKeyword = function(keyword){
					keyword = keyword.replace(/ /g, "");
					var idx = $scope.postParams.exQuery.indexOf(keyword);
					if(idx < 0){
						$scope.postParams.exQuery.push(keyword);// add keyword
						angular.element("#searchKeywordSlider").scope().reset();// reset slider
						$scope.srhKeywordPost();// POST
						
						$scope.scrollToTop();
					}
				}
				
				/**
				 * 재검색 포함/제외 셀렉트 클릭
				 */
				$scope.showKeywordLayer = function(){
					$scope.searchUISetting.keywordIncExc = ! $scope.searchUISetting.keywordIncExc;
				}
				// 포함/제외단어 선택
				$scope.selectKeywordLayer = function(idx){
					if($scope.searchUISetting.keywordIncExc === false){ return; }
					$scope.searchUISetting.researchIdx = idx;
					$scope.showKeywordLayer();
				}
				
				$scope.showRelatedKWPopup = function(){
					$scope.uiStateObj.relatedKwywordOpenFlag = true;
					$scope.uiStateObj.relatedKeywordEntered = false;
					$timeout(function(){
						$("#rekeyword_pop").val("");
						$("#rekeyword_pop").focus();
					}, 0);
					
					//m_dc_SrhResult_CLK_srhkeywd_add_Btn_ios/and
					$scope.searchTclick2016("R", "CLK_srhkeywd_add_Btn");
				}
				
				$scope.hideRelatedKWPopup = function(){
					$("#rekeyword_pop").blur();
					$scope.uiStateObj.relatedKwywordOpenFlag = false;
					$scope.scrollToTop();
				}

				/**
				 * 결과내 검색 조회
				 */
				$scope.srhKeywordPost = function () {
					$scope.srhFilterCtgInit();// 카테고리 초기화
					$scope.srhFilterBrdInit();// 브랜드 초기화
					$scope.srhFilterDetailInit();// 상세검색 초기화
					
					$scope.postParams.rtnType = "K";
					$scope.loadDataParams($scope.postParams.rtnType);// 결과 조회
				}

				/**
				 * 상세검색 가격 포커싱
				 */
				$scope.srhFilterDetailPriceIpt = function (target){
					angular.element("#" + target).focus();
				}
				

				/**
				 * 검색 필터 - 상세검색 초기화
				 */
				$scope.srhFilterDetailInit = function () {
					$scope.uiStateObj.srhFilterDetailFlag = false;

					angular.forEach($scope.uiStateObj.srhFilterDetailArr, function (item) {
						$scope.postParams[item] = "N";
					});
					
					$scope.postParams.pop = "";
					
					$scope.srhFilterBenefitInit();
					$scope.srhFilterDeliveryInit();
					$scope.srhFilterColorInit();
					$scope.srhFilterPriceInit();
					$scope.srhFilterStoreInit();
				}
				
				/**
				 * 초기화 버튼 비활성 체크
				 */
				$scope.checkResetDisabled = function(){
					var uiStateObj = $scope.uiStateObj;
					var searchUISetting = $scope.searchUISetting;
					var postParams = $scope.postParams;
					
					if($scope.searchUISetting.isShowSub==false){
						// main slide
						if(
							uiStateObj.srhFilterCtgFlag==false//category
							&& (uiStateObj.srhFilterBrdFlag==false)//brand
							&& (uiStateObj.sortTypeIdx==0)//sort
							&& (uiStateObj.srhFilterDetailFlag==false)//other detail
							&& (postParams.reQuery.length==0 && postParams.exQuery.length==0)//requery
						){
							return "disabled";
						}
					}else{
						// sub slide
						if(
							(searchUISetting.slide=='category' && uiStateObj.srhFilterCtgFlag==false)
							|| (searchUISetting.slide=='brand' && uiStateObj.srhFilterBrdFlag==false)
							|| (searchUISetting.slide=='sort' && uiStateObj.sortTypeIdx==0)
							|| (searchUISetting.slide=='benefit' && postParams.freeDeliYN+postParams.freeInstYN+postParams.pointYN+postParams.pkgYN=='NNNN')
							|| (searchUISetting.slide=='delivery' && postParams.delSevenYN+postParams.delTdarYN+postParams.delQuickYN+postParams.smpickYN=='NNNN')
							|| (searchUISetting.slide=='color' && postParams.selectedColor.length==0)
							|| (searchUISetting.slide=='price' && postParams.priceMaxU==null && postParams.priceMinU==null)
							|| (searchUISetting.slide=='research' && postParams.reQuery.length==0 && postParams.exQuery.length==0)
							|| (searchUISetting.slide=='store' && postParams.deptYN+postParams.tvhomeYN+postParams.superYN+postParams.brdstoreYN=='NNNN')
						){
							return "disabled";
						}
					}
					
					return "";
				};
				
				/**
				 * 전체 초기화
				 */
				$scope.resetAllSearchTerm = function(){
					$(".side_search_wrap .ssw_content .ssw_slide.sub").scrollTop(0);
					if($scope.searchUISetting.isShowSub === true){
						switch($scope.searchUISetting.slide){
							case "category":
								$scope.srhFilterCtgInit(true);
								$scope.searchTclick2016("S", "category_CLK_ini_Btn");
								break;
								
							case "brand":
								$scope.srhFilterBrdInit(true);
								$scope.searchTclick2016("S", "brand_CLK_ini_Btn");
								break;
								
							case "sort":
								$scope.srhFilterSortInit(true);
								$scope.searchTclick2016("S", "sorting_CLK_ini_Btn");
								break;
								
							case "benefit":
								$scope.srhFilterBenefitInit(true);
								$scope.searchTclick2016("S", "benefit_CLK_ini_Btn");
								break;
								
							case "delivery":
								$scope.srhFilterDeliveryInit(true);
								$scope.searchTclick2016("S", "shipping_CLK_ini_Btn");
								break;
								
							case "color":
								$scope.srhFilterColorInit(true);
								$scope.searchTclick2016("S", "color_CLK_ini_Btn");
								break;
								
							case "price":
								$scope.srhFilterPriceInit(true);
								$scope.searchTclick2016("S", "price_CLK_ini_Btn");
								break;
								
							case "research":
								$scope.srhFilterRequeryInit(true);
								$scope.searchTclick2016("S", "srhwithinresult_CLK_ini_Btn");
								break;
								
							case "store":
								$scope.srhFilterStoreInit(true);
								$scope.searchTclick2016("S", "srhresult_CLK_ini_Btn");
								break;
						}
					}else{
						// 전체 초기화
						$scope.srhFilterSortInit();
						$scope.srhFilterRequeryInit(true);
						$scope.searchTclick2016("S", "CLK_ini_Btn");
					}
				};
				
				// 카테고리 초기화
				$scope.srhFilterCtgInit = function (reload) {
					// reset data
					$scope.uiStateObj.srhFilterCtgFlag = false;
					$scope.uiStateObj.srhFilterCtgDepth = 0;
					$scope.uiStateObj.srhFilterCtgDepth1CtgNo = "";
					
					$scope.uiStateObj.selectedCategory.depth1 = null;
					$scope.uiStateObj.selectedCategory.depth2 = null;
					$scope.uiStateObj.selectedCategory.depth3 = null;
					$scope.uiStateObj.selectedCategory.depth4 = null;
					$scope.uiStateObj.selectedCategory.ctgName = "";
					
					$scope.postParams.ctgNo = "";
					$scope.postParams.ctgDepth = 0;
					
					// reset UI
					var li;
					$(".ssws_wrap.ssws_category li.open").each(function(idx, itm){
						li = $(itm);
						li.removeClass("open");
						li.find(">ul").height(0);
					});
					$(".ssws_wrap.ssws_category .cate_d1").height( 41 * $(".ssws_wrap.ssws_category .cate_d1 > li").length );
					
					//POST
					if(reload === true){
						$scope.srhFilterBrdInit();// 브랜드 초기화
						$scope.srhFilterDetailInit();// 상세검색 초기화
						
						$scope.postParams.rtnType = "C";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				}

				// 브랜드 초기화
				$scope.srhFilterBrdInit = function (reload) {
					$scope.uiStateObj.srhFilterBrdFlag = false;
					$scope.postParams.brdNoArr = [];
					$scope.postParams.brdNmArr = [];

					angular.forEach($scope.srhResultData.brdLst.items, function (item, idx) {
						item.checked = false;
					});
					angular.forEach($scope.srhResultData.brdLstRender, function(item, idx){
						item.checked = false;
					});
					
					//POST
					if(reload === true){
						$scope.postParams.rtnType = "E";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				}

				// 정렬  초기화
				$scope.srhFilterSortInit = function (reload) {
					$scope.uiStateObj.srhFilterSortFlag = false;
					$scope.uiStateObj.sortTypeIdx = 0;
					$scope.postParams.sort = $scope.uiStateObj.sortTypeArr[0].value;
					
					//POST
					if(reload === true){
						$scope.postParams.rtnType = "S";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				}
				
				// 혜택 초기화
				$scope.srhFilterBenefitInit = function(reload){
					$scope.postParams.freeDeliYN = "N";
					//$scope.postParams.smpickYN = "N";
					$scope.postParams.freeInstYN = "N";
					$scope.postParams.pointYN = "N";
					$scope.postParams.pkgYN = "N";

					//$scope.postParams.smpickBranchNo = "";
					//$scope.uiStateObj.smpickBranchName = "전체";
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				}
				
				// 배송 초기화
				$scope.srhFilterDeliveryInit = function(reload){
					$scope.postParams.delSevenYN = "N";
					$scope.postParams.delTdarYN = "N";
					$scope.postParams.delQuickYN = "N";
					$scope.postParams.smpickYN = "N";

					$scope.searchUISetting.smartPickList = false;
					$scope.postParams.smpickBranchNo = null;
					$scope.uiStateObj.smpickBranchName = "전체";
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};
				
				// 컬러 초기화
				$scope.srhFilterColorInit = function(reload){
					$scope.postParams.selectedColor.length = 0;
					var len = $scope.srhDetailData.srhColorList.length;
					for(var i=0; i<len; i++){
						$scope.srhDetailData.srhColorList[i].selected = false;
					}
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				}
				
				// 가격대 초기화
				$scope.srhFilterPriceInit = function(reload){
					$scope.postParams.priceMinU = null;
					$scope.postParams.priceMaxU = null;
					$scope.postParams.priceMaxUTemp = null;
					$scope.postParams.priceMinUTemp = null;
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				}
				
				// 결과내검색 초기화
				$scope.srhFilterRequeryInit = function(reload){
					$scope.postParams.reQuery.length = 0;
					$scope.postParams.exQuery.length = 0;
					$scope.postParams.rekeyword = "";
					
					$scope.srhFilterCtgInit();
					$scope.srhFilterBrdInit();
					$scope.srhFilterDetailInit();
					
					//POST
					if(reload === true){
						$scope.postParams.rtnType = "K";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				}
				
				// 매장 초기화
				$scope.srhFilterStoreInit = function(reload){
					$scope.postParams.deptYN = "N";
					$scope.postParams.tvhomeYN = "N";
					$scope.postParams.superYN = "N";
					$scope.postParams.brdstoreYN = "N";
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				}
				
				
				
				/**
				 * 앱에 전달할 파라메터 생성
				 */
				$scope.getSearchTermParam = function(shortcut){
					var param = "search2016://searchterm";
					var obj = {}

					// 배열 스트링 생성
					var checkSearchTermArray = function(name, arr, div){
						if(div == undefined){ div = ","; }
						if(arr != undefined && arr.length > 0){
							obj[name] = arr.join(div);
						}
					}
					// 오브젝트 배열로 변환
					var getSearchTermArray = function(arr, name){
						var rtn_arr = [];
						if(arr != undefined && arr.length > 0){
							var len = arr.length;
							for(var i=0; i<len; i++){
								if(arr[i][name] != undefined){
									rtn_arr.push(arr[i][name]);
								}
							}
						}
						return rtn_arr;
					}
					// 데이터 추가
					var addSearchTerm = function(name, value, check){
						if(value === check){
							obj[name] = value;
						}
					}
					
					
					obj.keyword = encodeURIComponent($scope.postParams.keyword);
					
					// 카테고리
					if($scope.postParams.ctgNo){
						obj.ctgNo = $scope.postParams.ctgNo;
						if($scope.postParams.ctgDepth >= 0 && $scope.postParams.ctgDepth <= 3){
							obj.ctgDepth = $scope.postParams.ctgDepth;
						}
					}
					
					// 브랜드
					checkSearchTermArray("brdNo", $scope.postParams.brdNoArr);

					// 소트
					obj.sort = $scope.postParams.sort;
					
					// 혜택
					addSearchTerm("freeDeliYN", $scope.postParams.freeDeliYN, "Y");
					addSearchTerm("freeInstYN", $scope.postParams.freeInstYN, "Y");
					addSearchTerm("pointYN", $scope.postParams.pointYN, "Y");
					addSearchTerm("pkgYN", $scope.postParams.pkgYN, "Y");
					addSearchTerm("smpickYN", $scope.postParams.smpickYN, "Y");
					if ($scope.postParams.smpickYN == "Y" && !($scope.postParams.smpickBranchNo == null || $scope.postParams.smpickBranchNo == "")) {//스마트픽 지점 번호 여부
						obj.smpickBranchNo = $scope.postParams.smpickBranchNo;
					}
					
					// 컬러
					checkSearchTermArray("colorCd", $scope.postParams.selectedColor);
					
					// 가격대
					if ($scope.postParams.priceMinU && $scope.postParams.priceMinU >= $scope.srhResultData.price.min){//최소가 조건 선택 여부
						obj.priceMinU = $scope.postParams.priceMinU;
					}
					if ($scope.postParams.priceMaxU && $scope.postParams.priceMaxU <= $scope.srhResultData.price.max){//최대가 조건 선택 여부
						obj.priceMaxU = $scope.postParams.priceMaxU;
					}
					
					// 결과 내 검색
					checkSearchTermArray("reQuery", $scope.postParams.reQuery);
					checkSearchTermArray("exQuery", $scope.postParams.exQuery);
					
					// 매장
					addSearchTerm("deptYN", $scope.postParams.deptYN, "Y");
					addSearchTerm("tvhomeYN", $scope.postParams.tvhomeYN, "Y");
					addSearchTerm("brdstoreYN", $scope.postParams.brdstoreYN, "Y");
					addSearchTerm("superYN", $scope.postParams.superYN, "Y");
					
					// 배송
					addSearchTerm("delSevenYN", $scope.postParams.delSevenYN, "Y");
					addSearchTerm("delTdarYN", $scope.postParams.delTdarYN, "Y");
					addSearchTerm("delQuickYN", $scope.postParams.delQuickYN, "Y");

					// 기타
					obj.dpml_no = $scope.postParams.dpml_no;
					obj.brdNm = encodeURIComponent($scope.postParams.brdNm);
					obj.isVoice = $scope.postParams.isVoice;
					
					// 정렬 바로가기
					if(shortcut=="SORT"){
						obj.openSort = "Y";
					}
					
					
					// 스트링 만들기
					var comma = false;
					var str = "";
					for(var x in obj){
						if(comma){ str += "&"; }
						str += x + "=" + obj[x];
						comma = true;
					}
					
					param += "?" + str;
					return param;
				};
				
				
				/**
				 * 앱에서 검색 호출
				 */
				$scope.searchFromApp = function(data){
					var params = $scope.postParams;
					
					// 리턴타입
					switch(data.rtnType){
						case "":
						case "K":
						case "C":
						case "E":
						case "S":
							break;
						default:
							data.rtnType = "";
							break;
					}
					
					// 파라메터 업데이트
					var setSearchTerm = function(name, value, a, b){
						if(value == a){
							params[name] = a;
						}else{
							params[name] = b;
						}
					}
					// 파라메터 배열 업데이트
					var setSearchTermArray = function(name, value){
						params[name].length = 0;
						if(! (value == undefined || value == "") ){
							var arr = value.split(",");
							params[name] = [].concat(arr);
						}
					}
					
					var i, len, item;
					
					// 키워드
					if(data.keyword != undefined && data.keyword != ""){
						var word = decodeURIComponent(data.keyword);
						params.keyword = word
						$scope.srhResultData.keyword = word;
					}
					
					// 카테고리
					if(data.ctgNo != undefined && data.ctgDepth != undefined && data.ctgDepth >= 0 && data.ctgDepth <= 3){
						switch(data.ctgDepth){
							case 0://대대카 - 대중소카 초기화
								$scope.uiStateObj.selectedCategory.depth1 = data.ctgNo;
								$scope.uiStateObj.selectedCategory.depth2 = null;
								$scope.uiStateObj.selectedCategory.depth3 = null;
								$scope.uiStateObj.selectedCategory.depth4 = null;
								break;
							case 1://대카 - 중소카 초기화
								$scope.uiStateObj.selectedCategory.depth2 = data.ctgNo;
								$scope.uiStateObj.selectedCategory.depth3 = null;
								$scope.uiStateObj.selectedCategory.depth4 = null;
								break;
							case 2://중카 - 소카 초기화
								$scope.uiStateObj.selectedCategory.depth3 = data.ctgNo;
								$scope.uiStateObj.selectedCategory.depth4 = null;
								break;
							case 3:
								$scope.uiStateObj.selectedCategory.depth4 = data.ctgNo;
								break;
						}
						$scope.postParams.ctgNo = data.ctgNo;
						$scope.postParams.ctgDepth = data.ctgDepth;
						$scope.uiStateObj.srhFilterCtgFlag = true;
					}else{
						$scope.uiStateObj.selectedCategory.depth1 = null;
						$scope.uiStateObj.selectedCategory.depth2 = null;
						$scope.uiStateObj.selectedCategory.depth3 = null;
						$scope.uiStateObj.selectedCategory.depth4 = null;
						$scope.uiStateObj.selectedCategory.ctgName = "";
						$scope.postParams.ctgNo = "";
						$scope.postParams.ctgDepth = 0;
						$scope.uiStateObj.srhFilterCtgFlag = false;
					}
					
					// 브랜드
					if(data.brdNo != undefined && data.brdNo != "" && $scope.srhResultData.brdLst && $scope.srhResultData.brdLst.items){
						$scope.postParams.brdNoArr.length = 0;
						$scope.postParams.brdNmArr.length = 0;
						
						var barr = data.brdNo.split(",");
						angular.forEach($scope.srhResultData.brdLst.items, function (item, index) {
							if(barr.indexOf(item.brdNo) < 0){
								item.checked = false;
							}else{
								item.checked = true;
								$scope.postParams.brdNoArr.push(item.brdNo);
								$scope.postParams.brdNmArr.push(item.brdName);
							}
						});
						
						$scope.uiStateObj.srhFilterBrdFlag = $scope.postParams.brdNoArr.length > 0;
					}else{
						$scope.postParams.brdNoArr.length = 0;
						$scope.postParams.brdNmArr.length = 0;
						angular.forEach($scope.srhResultData.brdLst.items, function (item, index) {
							item.checked = false;
						});
					}

					// 소트
					if(data.sort != undefined){
						len = $scope.uiStateObj.sortTypeArr.length;
						for (i=0; i<len; i++) {
							if($scope.uiStateObj.sortTypeArr[i].value == data.sort){
								$scope.uiStateObj.sortTypeIdx = i;
								params.sort = data.sort;
								break;
							}
						}
					}
					
					// 혜택
					setSearchTerm("freeDeliYN", data.freeDeliYN, "Y", "N");
					setSearchTerm("freeInstYN", data.freeInstYN, "Y", "N");
					setSearchTerm("pointYN", data.pointYN, "Y", "N");
					setSearchTerm("pkgYN", data.pkgYN, "Y", "N");
					
					// 배송
					setSearchTerm("delSevenYN", data.delSevenYN, "Y", "N");
					setSearchTerm("delTdarYN", data.delTdarYN, "Y", "N");
					setSearchTerm("delQuickYN", data.delQuickYN, "Y", "N");
					setSearchTerm("smpickYN", data.smpickYN, "Y", "N");
					//if(data.smpickBranchNo == undefined){ data.smpickBranchNo = ""; }
					setSearchTerm("smpickBranchNo", data.smpickBranchNo, "", data.smpickBranchNo);
					
					// 컬러
					if(data.colorCd != undefined && data.colorCd != ""){
						setSearchTermArray("selectedColor", data.colorCd);
						var carr = data.colorCd.split(",");
						len = $scope.srhDetailData.srhColorList.length;
						for(i=0; i<len; i++){
							item = $scope.srhDetailData.srhColorList[i];
							item.selected = carr.indexOf(item.colorCd) >= 0;
						}
					}else{
						params.selectedColor.length = 0;
						len = $scope.srhDetailData.srhColorList.length;
						for(i=0; i<len; i++){
							item = $scope.srhDetailData.srhColorList[i];
							item.selected = false;
						}
					}
					
					// 가격대
					var pmin = parseInt(data.priceMinU, 10);
					var pmax = parseInt(data.priceMaxU, 10);
					if(isNaN(pmin)){
						pmin = null;
					}else{
						if(pmin < $scope.srhResultData.price.min){
							pmin = $scope.srhResultData.price.min;
						}
					}
					if(isNaN(pmax)){
						pmax = null;
					}else{
						if(pmax > $scope.srhResultData.price.max){
							pmax = $scope.srhResultData.price.max;
						}
					}
					if(pmin != null && pmax != null){
						if(pmin > pmax){
							pmin = null;
						}
					}
					$scope.postParams.priceMinU = pmin;
					$scope.postParams.priceMinUTemp = pmin;
					$scope.postParams.priceMaxU = pmax;
					$scope.postParams.priceMaxUTemp = pmax;
					
					// 결과 내 검색
					setSearchTermArray("reQuery", data.reQuery);
					setSearchTermArray("exQuery", data.exQuery);
					
					// 매장
					setSearchTerm("deptYN", data.deptYN, "Y", "N");
					setSearchTerm("tvhomeYN", data.tvhomeYN, "Y", "N");
					setSearchTerm("brdstoreYN", data.brdstoreYN, "Y", "N");
					setSearchTerm("superYN", data.superYN, "Y", "N");
					
					$scope.srhDetailSearchActiveChk();// 상세 선택여부 체크
					
					// POST
					params.rtnType = data.rtnType;
					$scope.loadDataParams(params.rtnType);
				};
				window.searchFromApp = $scope.searchFromApp;

				
				
				$scope.scrollToTop = function(){
					var st = $(window).scrollTop();
					if(st > 1){
						$(window).scrollTop(1);
					}
				}
				
				
				$scope.toggleApp = function(){
					$scope.isValidApp = ! $scope.isValidApp;
				}
				
				/**
				 * 음성검색 호출하기
				 */
				$scope.openSpeechSearch = function(){
					if($scope.appObj.isApp && ! $scope.appObj.isIOS && !$scope.appObj.isOldApp){
						try {
							$window.lottesearch.callAndroid("lottesearch://newsearch/speech");
						}catch(e){}
						return;
					}else if($scope.appObj.isApp && $scope.appObj.isIOS){
						$window.location.href =  "lottesearch://newsearch/speech";
						return;
					}
				};
				
				/**
				 * 리뷰 팝업 보기
				 * @param rev 리뷰 오브젝트
				 */
				$scope.reviewPopData = null;
				$scope.showReviewPop = function(rev, e){
					if(rev == undefined || rev.gdasNo == undefined || rev.gdasNo == ""){ return; }
					
					var a = angular.element(e.currentTarget);
					a.addClass("highlight");
					$timeout(function(){ a.removeClass("highlight"); }, 500);
					
					$scope.isShowLoading = true;
					var param = {gdasNo:rev.gdasNo};
					var loadURL = $scope.URLs.searchRevPop;
					$http.get(loadURL, {params:param})
					.success(function (data, status, headers, config) {//호출 성공시
						if(data == undefined || data.gdasDtlInfo == undefined){
							$scope.reviewPopData = null;
							return;
						}
						
						$scope.isShowLoading = false;
						try{
							data.gdasDtlInfo.gdasCont = data.gdasDtlInfo.gdasCont.replace(new RegExp('\r?\n','g'), "<br />");
						}catch(e){}
						$scope.reviewPopData = data.gdasDtlInfo;
						
						$timeout(positionReviewPop, 1);
					})
					.error(function (data, status, headers, config) {//호출 실패시
						$scope.isShowLoading = false;
						$scope.reviewPopData = null;
					});
					
					$scope.sendTclick($scope.tClickBase + "SrhResult_Clk_Review");
				};
				
				function positionReviewPop(){
					var WH = $(window).height();
					var ABH = $scope.appObj.isApp ? 50 : 0;
					var pop = angular.element("#srhReviewPop .layerPop");
					var cnt = pop.find(".cont > div");
					cnt.css("max-height", WH - 140 - ABH);
					pop.css({"top" : (WH - pop.height() - ABH) / 2, "opacity" : 1});
				};
				
				/**
				 * 리뷰 팝업 닫기
				 */
				$scope.hideReviewPop = function(){
					angular.element("#srhReviewPop .layerPop").css({"opacity" : 0});
					$scope.reviewPopData = null;
				};
				
				/**
				 * 상품상세 리뷰로 이동하기
				 */
				$scope.gotoProductReview = function(){
					if($scope.reviewPopData == undefined || $scope.reviewPopData.goodsNo == undefined || $scope.reviewPopData.goodsNo == ""){ return; }
					var path = $scope.getProductViewUrl($scope.reviewPopData, $scope.tClickBase + "RVPopLayer_Clk_Btn_Clk");
					location.href = path;
				};
				
				
				/**
				 * 오탈자 원래 검색어로 검색하기
				 */
				$scope.searchByOriginalKeyword = function(){
					$scope.postParams.keyword = $scope.srhResultData.orgKeyword;
					$scope.srhResultData.keyword = $scope.srhResultData.orgKeyword;
					$scope.srhResultData.orgKeyword = "";

					$scope.postParams.reQuery.length = 0;
					$scope.postParams.exQuery.length = 0;
					$scope.postParams.rekeyword = "";
					$scope.postParams.chkTypo = "N";

					$scope.srhFilterCtgInit();// 카테고리 초기화
					$scope.srhFilterBrdInit();// 브랜드 초기화
					$scope.srhFilterDetailInit();// 상세검색 초기화
					
					$scope.postParams.rtnType = "";
					$scope.loadDataParams($scope.postParams.rtnType);// 결과 조회
				};
				
			}
        };
    }]);

	/*추천 검색어 Directive*/
	app.directive('recomLink', ['$window', function ($window) {
		return {
			link : function ($scope, el, attrs) {
				$scope.recomOutlink = "_self"; /*외부링크 여부 (추천 링크가 하나라고 하여 전역 스코프로 정의)*/

				$scope.goRecomLink = function ($event) { /*추천 링크*/
					if (typeof $scope.srhResultData.recomLink.linkUrl != "undefined" &&
						$scope.srhResultData.recomLink.linkUrl != "") {
						var linkURL =  $scope.srhResultData.recomLink.linkUrl + "";

						if (!linkURL.match(/^http|^https/gi)) { /*http 나 https 가 아닐 경우*/
							linkURL = "http://" + linkURL;
						}
						var tClickStr = $scope.tClickBase + "SrhResult_Clk_Kwd_A";
						if ($scope.srhResultData.recomLink.blankFlag) { /*외부 링크*/
							if (typeof $scope.srhResultData.recomLink.alertStr != "undefined" &&  /*경고문구가 있을 경우*/
								$scope.srhResultData.recomLink.alertStr != "" &&
								$scope.srhResultData.recomLink.alertStr != "null") {
								if (confirm($scope.srhResultData.recomLink.alertStr)) { /*경고문구가 있을 경우 경고문구 확인*/
									outLink(linkURL); /*cnt_interface.js : 아웃링크 처리*/
									$scope.sendTclick(tClickStr); /* lotte-comm.js*/  /*TCLICK 수집*/
								}
							} else { /*경고 문구가 없을 경우*/
								outLink(linkURL); /*cnt_interface.js : 아웃링크 처리*/
								$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
							}
						} else { /*내부링크*/
							if (linkURL.indexOf("?") > -1) {
								linkURL += "&tclick="+tClickStr;
							} else {
								linkURL += "?tclick="+tClickStr;
							}

							if (typeof $scope.srhResultData.recomLink.alertStr != "undefined" &&  /*경고문구가 있을 경우*/
								$scope.srhResultData.recomLink.alertStr != "" &&
								$scope.srhResultData.recomLink.alertStr != "null") {
								if (confirm($scope.srhResultData.recomLink.alertStr)) {
									$window.location = linkURL; /*내부 링크일 경우 URL 이동*/
								}
							} else { /*경고문구가 없을 경우*/
								$window.location = linkURL; /*내부 링크일 경우 URL 이동*/
							}
						}
					}

					$event.preventDefault(); /*기본 이벤트 전파 방지*/
					$event.stopPropagation(); /*기본 이벤트 전파 방지*/
				};
			}
		}	
	}]);

	/*인기 검색어 Directive*/
	app.directive('favLst', [function () {
		return {
			link : function ($scope, el, attrs) {
				$scope.favRankClass = function (rank) { /*인기검색어 변동 순위 값에 따른 Class 처리*/
					var rtnCls = "",
						rankValType = typeof rank;

					if (rank == "NEW") {
						rtnCls = "new";
					} else if (parseInt(rank) != NaN) {
						if (parseInt(rank) > 0) {
							rtnCls = "up";
						} else if (parseInt(rank) < 0) {
							rtnCls = "down";
						} else {
							rtnCls = "none";
						}
					}
					return rtnCls;
				};

				$scope.favRankVal = function (val) { /*순위 변동값 절대값으로*/
					var rtnVal = val;

					if (parseInt(rtnVal) != NaN) {
						rtnVal = Math.abs(parseInt(rtnVal));
					}
					return rtnVal;
				};
			}
		}
	}]);
	
	/* 검색실패시 추천상품 */
	app.directive('recomData', ['$http', 'LotteCommon','LotteUtil', 'commInitData', function($http, LotteCommon, LotteUtil, commInitData) {
		return {
			link : function ($scope, el, attrs) {
				// 실시간 맞춤 추천 상품 레코벨 조회
				//링크 이동 : 티클릭조함
                $scope.gotoLinkM = function(link, tclick_b, infoFlag, item){

                    var tclick = "search_" + tclick_b;
                    if(item != null){ 
                       link =  LotteCommon.prdviewUrl + "?goods_no=" + item.goods_no + link;
                    }
                    // $window.location.href = link + "&tclick=" + tclick;
                    $scope.linkUrl(link, false, tclick);
                };
				
				$scope.tpmlData = {		
					recommondData: {}, // 맞춤추천상품 Data 초기화
					rbDispnoResult: "" // 레코벨 조회 Dispno 초기화
				};		
				$scope.LoadRealRecommnd = function() {
                    var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/s001?size=30&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&st="+$scope.postParams.keyword;
					$.ajax({
						type: 'post'
						, async: true
						, url: viewSaleBestLink
						, dataType  : "jsonp"
						, success: function(data) {
                            getProduct(data);
						}
						, error: function(data, status, err) {
                            //getProduct(data);
							console.log('Data Error : 실시간 맞춤 추천 Data로드 실패');
						}
					});
				};
                function getProduct(data){
                    var logrecom_view_result = new Array();
                    if(data.results != null && data.results.length > 0){
                    	$(data.results).each(function(i, val) {
                            logrecom_view_result.push(val.itemId);
                        });
                        $scope.tpmlData.rbDispnoResult = logrecom_view_result.join(",");
                        
                        //실시간 맞춤 추천 상품 Data Load
                        if(LotteCommon.mainRealRecommData == undefined){ return false; }
                        var recommDataReset = "Y"; // 0202 추가 추천데이타 순서 변경 파라메타값
                        var httpConfig = {
                            method: "get",
                            url: LotteCommon.mainRealRecommData,
                            params: {
                            	isSearch: recommDataReset,
                            	latest_prod: $scope.tpmlData.rbDispnoResult
                            }
                        };

                        $http(httpConfig) // 실제 탭 데이터 호출
                        .success(function (data) {
                            $scope.tpmlData.recommondData = data.recommnd_prod;
                        })
                        .finally(function () {
                        });
                    } else{
                    	setTimeout(function () {
							angular.element('.recommond_wrap').css("display","none"); 
						}, 0);
                    }
                                        
                }
                $scope.LoadRealRecommnd();
			}
		}
	}]);
	
})(window, window.angular);