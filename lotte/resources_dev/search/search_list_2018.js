(function(window, angular, undefined) {
    'use strict';
    
    var app = angular.module('app', [
 		'lotteComm',
		'lotteSrh',
		'lotteDoubleCoupon',
		'lotteSideCtg',
		'lotteCommFooter',
		'lotteProduct',
		'lotteNgSwipe',
		'lotteSlider',
		'angular-carousel',
		'lotteMainPop',
        'searchPlanShop', // 기획전형 상품 20180306 박해원
        'searchDetailPopup'
    ]);
	app.filter('pageRange', [function() {
		return function(items, page, pgsize) {
			var newItem = [];
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
    		['$scope', '$http', '$filter', '$location', '$window', '$timeout', 'LotteCommon', 'LotteUtil', 'LotteLink', 'commInitData', 'LotteScroll', 'LotteStorage', 'LotteUserService','$compile', 'LotteGA', 'LotteCookie',
    		function($scope, $http, $filter, $location, $window, $timeout, LotteCommon, LotteUtil, LotteLink, commInitData, LotteScroll, LotteStorage, LotteUserService, $compile, LotteGA, LotteCookie) {
    	$scope.curDispNoSctCd = "50"; /*인입 전시 코드 (검색 : 50, 기획전/하프찬스 : 20), PC : infw_disp_no_sct_cd*/
		$scope.curDispNo="1749096";

		$scope.showWrap = true; /*Wrapper Show/Hide*/
		$scope.contVisible = true; /*Container Show/Hide*/
		$scope.templateType2 = "search_image_2017";
		$scope.screenID = "SrhResult";
		$scope.isShowLoading = false;// Ajax 로드 Flag 초기화
		$scope.productListLoading = false;
		$scope.searchTermsLoading = false;
		$scope.searchTermsChanged = false;
		$scope.productMoreScroll = true;
		$scope.tipShow = false; //툴팁
		$scope.brdShowListCnt = 50; // 20161201 박형윤 추가 - 상세검색 브랜드 노출 개수 (최초시)
		$scope.curSideStatus = 1; // 뒤로가기시 히스토리 기능
		//$scope.ctgInitFlag = false; // 카테고리 선택시 필터 초기화 alert 유무
		/**
		 * Object 정의
			delSevenYN : "N",//내 주변 픽업
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
			srhFilterBrdSort : "-cnt",//"brdName", /*검색필터 - 브랜드탭 Sortting 값*/
			srhFilterDetailFlag : false, /*검색필터 - 상세검색 조건 선택 여부*/
			srhFilterSortFlag : false, /*검색필터 - Sortting 탭 조건 선택 여부*/
			sortTypeIdx : 0, /*검색필터 - Sortting 타입 Index*/
			sortTypeArr : [ /*검색필터 - Sortting Label 과 Value 배열*/
				{label : "인기순", shortLabel : "인기순", value : "RANK,1", notice : true},
				{label : "판매순", shortLabel : "판매순", value : "TOT_ORD_CNT,1", notice : true},
				{label : "상품평 많은순", shortLabel : "상품평", value : "TOT_REVIEW_CNT,1"},
				{label : "최근등록순", shortLabel : "최근등록", value : "DATE,1"},
				{label : "낮은가격순", shortLabel : "낮은가격", value : "DISP_PRICE,0"},
				{label : "높은가격순", shortLabel : "높은가격", value : "DISP_PRICE,1"}
			],
			starPointIdx : 0,
			starPointArr : [
				{label : "전체",			value : "",		dimm : false},
				//{label : "5점",				value : "5",	dimm : false},
				{label : "4점 이상",		value : "4",	dimm : false},
				{label : "3점 이상",		value : "3",	dimm : false},
				{label : "2점 미만 제외",	value : "2",	dimm : false}
			],
			srhDetailSearchClicked : false, //최초 검색버튼 클릭 여부
			priceMinUFocus : false, /*검색필터 - 상세검색 최소가 input box focus여부*/
			priceMaxUFocus : false, /*검색필터 - 상세검색 최대가 input box focus여부*/
			priceMinUTemp : "",
			priceMaxUTemp : "",
			emptyResult : false, /*검색 결과가 없는지에 대한 Flag*/
			emptyKeyword : false, /*검색 키워드가 없는지에 대한 Flag*/
			emptyPrdLstFlag : false, /*검색된 상품이 없는지에 대한 Flag*/
			planShopOnly	: false,// 검색결과 없고 기획전만 있는 경우
			ajaxPageEndFlag : false, /*마지막 페이지까지 로드 됐는지에 대한 Flag*/
			smpickLayerOpenFlag : false, /*스마트픽 지점 레이어 Open 여부*/
			smpickBranchName : "", /*검색필터 - 상세검색 - 스마트픽 셀렉트박스 label*/
			
			relatedKwywordOpenFlag	: false,//결과내 검색 팝업 표시여부
			relatedKeywordEntered	: false,//결과내 검색 팝업 텍스트입력중 
			relatedKeywordNotEmpty	: true,//연관키워드 존재여부
			relatedKeywordEnabled	: true,//연관키워드 영역 표시 여부
			detailSearchDataLoaded	: false,//상세설정 데이터 로드 상태
			selectedCategory		:{
				depth1:null,
				depth2:null,
				depth3:null,
				depth4:[],//null,
				ctgName:[]//""
			},
			defaultCtgNo : null,
			rekeywordChanged: false,
			skipListLoad: false,//카테고리 지정 시 리스트 재로드 방지
			voiceSearch:false
			,voiceResultParams:null
			,ageGenderSearched:false//성별연령 모아보기 상태
			,researchOpt: "-cnt" // 결과내 검색 라디오버튼
			,researchCheck: false
			,brandArr : [] // 브랜드 선택된 아이템
			,excludeKeyword: null // 닷컴/슈퍼 : 슈퍼 배너 미노출 키워드 리스트
			,superBrnShowFlag: false // 닷컴/슈퍼 배너 노출 여부
		};
		$scope.tClickBase = "m_RDC_";

		$scope.srhDetailPriceValidateFlag = true;//가격 검증 완료 Flag
		
		$scope.searchUISetting = {
			isShowSideBar		: false,//상세검색 사이드바 on/off
			isShowSub			: false,//상세검색 서브페이지 on/off
			title				: "카테고리",//상세검색 타이틀
			researchTypeArr		: [{label:"포함단어"}, {label:"제외단어"}],
			researchIdx			: 0,
			isAndroidChrome		: false,//안드로이드 크롬 브라우저 여부
			smartPickSub		:true,
			smartPickList		:false
		};
		$scope.isValidApp = false//유효한 앱 여부
		$scope.validAppOS = "IOS";
		$scope.sortLayerPopVisible = false;
		
		$scope.URLs = {
			searchList		: LotteCommon.srhListData2016// 검색결과 데이터
			, searchTerm	: LotteCommon.srhListTermData2018//상세검색
			, searchAdvtBnr	: LotteCommon.srhListAdvtBrnList// 검색광고배너 기획전배너
			, searchRevPop	: LotteCommon.srhListReivewPop// 리뷰 팝업 데이터
		};
		
		// 필터 오픈 상태
		// 디폴트 오픈 - 결과 내 검색
		$scope.foldable = {
			"research"	: "research"
		};

		if(location.host == "localhost:8082"){
			$scope.URLs.searchList = LotteCommon.srhListData2016LC;//"/json/search/m/getSearchListLC.jsp";
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

			/* 매장 */
			deptYN : "N", /*상세검색 - 롯데백화점여부*/
			tvhomeYN : "N", /*상세검색 - 롯데홈쇼핑 여부*/
			superYN : "N", /*상세검색 - 슈퍼 여부*/
			brdstoreYN : "N", /*상세검색 - 브랜드스토어 여부*/
			
			/* 가격/혜택/선물포장 */
			priceMinU : null, /*상세검색 - 최소가*/
			priceMaxU : null, /*상세검색 - 최대가*/
			freeInstYN : "N", /*상세검색 - 무이자 여부*/
			pointYN : "N", /*상세검색 - 포인트 여부*/
			pkgYN : "N", /*상세검색 - 무료포장 여부*/
			freeGiftYN:"", /*상세검색 - 사은품 제공*/
			
			/* 배송 */
			smpickYN : "N", /*상세검색 - 스마트픽 여부*/
			smpickBranchNo : null,//"", /*상세검색 - 스마트픽 지점 번호*/
			delSevenYN : "N",//내 주변 픽업
			freeDeliYN : "N", /*상세검색 - 무료배송 여부*/
			delQuickYN : "N",//퀵배송
			delTdarYN : "N",//오늘도착
			
			/* 컬러 */
			selectedColor : [],
			selectedColor2 : [],

			/* 스타일 */
			selectedStyle : [], //스타일 선택
			//selectedStyleNmArr :[], //스타일 선택 이름

			/* 신발 사이즈 */
			shoesSize : "",

			starPoint : $scope.uiStateObj.starPointArr[0].value, // 별점

			/* 결과내 검색 */
			rekeyword : "",// 상세검색
			reQuery   : [],// (포함단어)
			exQuery   : [],// (제외단어)

			isVoice: "N", // 201603 모바일 리뉴얼 추가 Parameter
			brdNm: "" // 201603 모바일 리뉴얼 추가 Parameter
		
		};

		$scope.srhResultData = {}; /*검색 결과*/
		$scope.prdDealList = [];

		$scope.srhDetailData = {//상세 검색 활성화 여부
			srhTerms : {
				dept : false, /*롯데백화점 활성화 여부*/
				tvhome : false, /*롯데홈쇼핑 활성화 여부*/
				super : false, /*슈퍼 활성화 여부*/
				brdstore : false, /*브랜드스토어 활성화 여부*/
				smpick : false, /*스마트픽 활성화 여부*/
				smpickBranch : [], /*스마트픽 지점 리스트*/
				quick: false,//퀵배송
				tdar: false,//오늘도착
				seven: false //세븐일레븐
			},
			srhColorList:[],
			freeGiftYN : false, //사은품 제공
			freeGiftView : false, //사은품 제공 보여주기 여부
			feelListCnt : 0, //스타일갯수
			starPoinCnt : 0, //별점갯수
			shoseSizeLst : [], //신발사이즈
			shoseSizeCnt : 0 //신발 선택 갯수
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
        $scope.noSearchKeywordFlag = false;
        $scope.survey_noprod_stat = false;
        $scope.survey_check = function(val, str) {
        	//티클릭 추가
            if(val == 2){
            	$scope.sendTclick("m_RDC_SrhResult_Clk_like_btn");
            } else if (val == 1){
            	$scope.sendTclick("m_RDC_SrhResult_Clk_dislike_btn");
            }
            
            $scope.survey_state = val;
            if(val == 0 || val == 4){
                $scope.survey_noprod_stat = false;
                $scope.dimmedClose();
            }
            if(val > 1){
                var stfc_arr = [0, 0, 3, 4, 2, 1];
                var surveryParam = {
                    login_id : LotteCookie.getCookie("LOGINID"),
                    site_no : "1",
                    srchw_nm : "" + $scope.srhResultData.keyword + ' ' + $scope.postParams.reQuery.join(" "),//.replace( /,/g, ' '),
                    stfc_sct_cd : stfc_arr[val],
                    add_op_cont : str                
                }
                $http.get(LotteCommon.searchSurvery, {params:surveryParam});
                    //.success(function (data) {});
            }
        };

		
        $scope.survey_noprod_text_check = function() {
        	var str = angular.element(".survey_noprd_ta:visible").val();
        	if(str) {
        		if(str.length == 0){
        			return true;
        		}
        	}
        	return false;
        } 
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
            $scope.dimmedClose();

        	var surveryParam = {
                login_id : LotteCookie.getCookie("LOGINID"),
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
        	$scope.survey_state = 1;
        	$scope.survey_noprod_stat = true;
        	$scope.actionbarHideFlag = true;
			$scope.dimmedOpen({
				target: "surveyNoprod",
				callback: $scope.surveyNoprodClose,
			});
        };
        
        $scope.surveyNoprodClose = function() {
        	$scope.actionbarHideFlag = false;
        	$scope.survey_state = 4;
        }
        
        //검색만족도 위치 세팅 
        $scope.setSurveyPos = function(){
        	var rsnum = $(".unitWrap").find("ol > li").length;
        	var pos = 29;
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
				    				// $scope.survey_check(1, '');
				    				$scope.noSearchKeywordFlag = true;
				    				//$scope.survey_state = 1;
				    				//$scope.survey_noprod_stat = true;
				    			}
							}, 1);
						}
					}, 0);
                    
                }else{
					//20160120 상품갯수에 따른 위치 변경, 25, 33.33, 50, 100 4개 케이스
					ell = $compile($(".survey").clone().addClass("inst"))($scope);
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
        	return true;
        	//!(prdDealList.length==0 || uiStateObj.srhFilterCtgFlag || uiStateObj.srhFilterBrdFlag || uiStateObj.srhFilterDetailFlag || postParams.reQuery.length>0 || postParams.exQuery.length>0)
        };
        
        /**
		 * 상품 유닛 타입 변경
		 */
        $scope.changeTemplate = function(type){
        	$scope.templateType2 = type;
        	switch(type){
            	case "search_list_2017":
            		$scope.searchTclick2016("Clk_Unit_01");
            		break;
            	case "search_image_2017":
            		$scope.searchTclick2016("Clk_Unit_02");
            		break;
        	}
        };

        /**
         * 스크롤 시에 다음페이지 불러오기
         */
		$scope.loadMoreData = function() {
			if($scope.isShowLoading || $scope.productListLoading || $scope.searchTermsLoading){
				return false;// 전송 요청 중일 경우 중복 실행 방지
			}
			if($(window).height() == $(document).height()){ return; }// 레이어 딤드 상태 예외처리
			
			var tClickStr = "m_RDC_SrhResult_Scl_Prd_page"+$scope.numberFill(($scope.postParams.page+1), 3);
			$scope.sendTclick(tClickStr);// lotte-comm.js - TCLICK 수집
			
			$scope.postParams.rtnType = "P";// 조회 구분값 P : 페이징으로 설정
			$scope.loadDataParams($scope.postParams.rtnType);//결과값 조회
		};

		/*상세조건 활성화 여부*/
		$scope.srhDetailSearchActiveChk = function () {
			var chkCnt = 0;

			//카테고리
			if($scope.postParams.ctgNo != "" || $scope.postParams.ctgDepth != 0 || $scope.postParams.dsCtgDepth != null){
				chkCnt++;
			}
			
			//브랜드
			if($scope.uiStateObj.srhFilterBrdFlag){
				chkCnt++;
			}

			//매장
			if($scope.postParams.deptYN == "Y" || $scope.postParams.tvhomeYN  == "Y"|| $scope.postParams.superYN == "Y" || $scope.postParams.brdstoreYN == "Y"){
				chkCnt++;
			};

			//가격직접입력
			if($scope.uiStateObj.srhDetailSearchClicked)
			{
				chkCnt++;
			}

			//가격혜택
			// 무이자 ,  포인트 , 무료 선물 포장 , 사은품 제공
			if($scope.postParams.freeInstYN =='Y'|| $scope.postParams.pointYN =='Y' || $scope.postParams.pkgYN =='Y'|| $scope.postParams.freeGiftYN =='Y'){
				chkCnt++;
			}
			
			//배송
			//스마트픽 ,내 주변 픽업 , 무료배송 , 퀵배송 , 오늘도착
			if($scope.postParams.smpickYN =='Y' || $scope.postParams.delSevenYN =='Y' || $scope.postParams.freeDeliYN =='Y'|| $scope.postParams.delQuickYN =='Y' || $scope.postParams.delTdarYN =='Y' ){
				chkCnt++;
			}

			// 선택된 컬러 체크
			if($scope.postParams.selectedColor.length > 0){ //$scope.postParams.selectedColor2.length = 0;
				chkCnt++;
			}

			//스타일
			if($scope.postParams.selectedStyle.length > 0){
				chkCnt++;
			}

			// 신발 사이즈
			var checkShoseArr = [];
			angular.forEach($scope.srhResultData.shoseSizeLst, function(item){
				if(item.checked){
					this.push(item);
				}
			},checkShoseArr);
			if(checkShoseArr.length>0) chkCnt++;
			
			// 별점
			if($scope.uiStateObj.starPointIdx > 0){
				chkCnt++;
			}
			
			//결과내검색
			if($scope.postParams.reQuery.length > 0 || $scope.postParams.exQuery.length > 0){
				chkCnt++;
			}
			
			// 선택된 조건이 있다면
			if (chkCnt > 0 ) {
				$scope.uiStateObj.srhFilterDetailFlag = true;// 상세 검색 조건 필터된 상태로 탭 표시
			} else {
				$scope.uiStateObj.srhFilterDetailFlag = false;
			}
		};


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
				case "T" :// 상세 검색 조건 활성화 여부
				case "B" :// 브랜드 선택 검색
				case "C" :// 카테고리 선택 검색
					/*
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
						$scope.postParams.freeDeliYN = "N";
						$scope.postParams.delTdarYN = "N";
						$scope.postParams.delQuickYN = "N";

					}
					*/
					/* 매장 */
					if ($scope.postParams.deptYN == "Y") {// 롯데백화점 조건 선택 여부
						loadParam.deptYN = $scope.postParams.deptYN;
					}

					if ($scope.postParams.tvhomeYN == "Y") {// 롯데홈쇼핑 조건 선택 여부
						loadParam.tvhomeYN = $scope.postParams.tvhomeYN;
					}

					if ($scope.postParams.superYN == "Y") {// 롯데슈퍼 조건 선택 여부
						loadParam.superYN = $scope.postParams.superYN;
					}

					if ($scope.postParams.brdstoreYN == "Y") {// 브랜드스토어 조건 선택 여부
						loadParam.brdstoreYN = $scope.postParams.brdstoreYN;
					}

					/* 가격/혜택/선물포장 */
					if($scope.uiStateObj.srhDetailSearchClicked){ // 최소,최대 검색버튼 클릭 여부
						loadParam.priceMinU = $scope.postParams.priceMinU;
						loadParam.priceMaxU = $scope.postParams.priceMaxU;
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

					if ($scope.postParams.freeGiftYN == "Y") { /*사은품 제공 조건 선택 여부*/
						loadParam.freeGiftYN = $scope.postParams.freeGiftYN;
					}

					/* 배송 */
					if ($scope.postParams.smpickYN == "Y") {// 스마트픽 조건 선택 여부
						loadParam.smpickYN = $scope.postParams.smpickYN;
					}

					if ($scope.postParams.smpickYN == "Y" && !($scope.postParams.smpickBranchNo == null || $scope.postParams.smpickBranchNo == "")) {// 스마트픽 지점 번호 여부
						loadParam.smpickBranchNo = $scope.postParams.smpickBranchNo;
					}
					
					if ($scope.postParams.freeDeliYN == "Y") {// 무료배송 조건 선택 여부
						loadParam.freeDeliYN = $scope.postParams.freeDeliYN;
					}

					if($scope.postParams.delQuickYN == "Y"){// 퀵배송
						loadParam.delQuickYN = "Y";
					}
					
					if($scope.postParams.delTdarYN == "Y"){// 오늘배송
						loadParam.delTdarYN = "Y";
					}

					if($scope.postParams.delSevenYN == "Y"){// 내 주변 픽업
						loadParam.delSevenYN = "Y";
					}
					
					if($scope.postParams.pop != undefined && $scope.postParams != ""){//나이/성별 모아보기
						loadParam.pop = $scope.postParams.pop;
					}

					/* colors */
					loadParam.colorCd = $scope.postParams.selectedColor.join(",");
					/* 스타일 */
					loadParam.feelNo = $scope.postParams.selectedStyle.join(",");
					// 신발 사이즈
					if($scope.postParams.shoesSize){
						loadParam.shoesSize = $scope.postParams.shoesSize;
					}
					// 별점
					if($scope.postParams.starPoint){
						loadParam.starPoint = $scope.postParams.starPoint;
					}


				//case "T" :// 상세 검색 조건 활성화 여부
				//case "B" :// 브랜드 선택 검색
					if ($scope.postParams.brdNoArr && $scope.postParams.brdNoArr.length > 0) { /*선택된 브랜드가 있는지 판단*/
						loadParam.brdNo = $scope.postParams.brdNoArr.join(); /*Array 형태로 넘어가는데 개발쪽과 협의 필요*/
					}
					
				//case "C" :// 카테고리 선택 검색
				case "K":// 키워드 변경
				default :// 기본
					if($scope.postParams.ctgNo){// 선택된 카테고리가 있는지 판단
						loadParam.ctgNo = $scope.postParams.ctgNo;
					}

					//if($scope.postParams.ctgNo && $scope.postParams.ctgDepth >= 0 && $scope.postParams.ctgDepth <= 1){// 선택된 카테고리 depth가 정상적인지 판단
					if($scope.postParams.ctgNo && $scope.postParams.ctgDepth >= 0 && $scope.postParams.ctgDepth <= 3){// 선택된 카테고리 depth가 정상적인지 판단
						loadParam.ctgDepth		= $scope.postParams.ctgDepth;
						//loadParam.dsCtgDepth	= $scope.postParams.ctgDepth + 1;
						loadParam.dsCtgDepth	= 0;// 대대카로 고정
						
						if(loadParam.ctgDepth > 0){// 대,중,소카 선택 시
							loadParam.dtDsCtgDepth	= 2;// 중카로 고정
							loadParam.dtCtgNo		= $scope.uiStateObj.selectedCategory.depth2;// 대카 카테고리 번호
						}
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
				$scope.srhDetailSearchActiveChk();// 상세 선택여부 체크
                if(loadParam.page == 1 && $scope.postParams.sort == 'RANK,1' &&  $scope.uiStateObj.srhFilterDetailFlag == false && !$scope.postParams.ctgNo && !$scope.uiStateObj.srhFilterBrdFlag && $scope.postParams.reQuery.length == 0 && $scope.postParams.exQuery.length == 0 ){ //1페이지이고 인기순일때만
                    //201804 광고솔루션 ============================ srart  
                    console.log("call adReq");
                    $scope.ad_param = {
                        query : $scope.postParams.keyword, //encodeURIComponent($scope.postParams.keyword),
                        channelId : "D01M02101",
                        startRank : 1,
                        maxCnt : 3,
                        serverUrl : encodeURIComponent(location.href),
                        mbrId : $scope.loginInfo.mbrNo,
                        userIp : '',
                        ua : encodeURIComponent(navigator.userAgent),
                        adType : "SRP"
                    }
                    $scope.ad_list = []; 
					$scope.timeout_flag = 0;
					
                    setTimeout(function(){
                        if($scope.timeout_flag == 0){
                            //검색 결과 로드 
                            console.log("- 광고솔루션 timeout -");
                            $scope.timeout_flag = 1;
                            $scope.loadListData(loadParam2);                              
                        }
                    }, 2000);
                    $.ajax({
                        type: 'get'
                        , url: LotteCommon.adReq
                        , data : $scope.ad_param
                        , dataType  : "json"
                        , success: function(data) {
                            if(data.ads){
                                $scope.ad_list = data.ads;
                                if($scope.ad_list.length > 0){
                                    var goodNoList = "";
                                    for(var i=0; i<$scope.ad_list.length; i++){
                                        goodNoList += $scope.ad_list[i].goodsNo;
                                        if(i < $scope.ad_list.length - 1){
                                            goodNoList += ",";
                                        }                            
                                    }    
                                    loadParam2.goodsNoList = goodNoList;
                                }                                
                            }
                            
                            //검색 결과 로드 
                            if($scope.timeout_flag == 0){
                                $scope.loadListData(loadParam2);                       
                                $scope.timeout_flag = 1;
                            }
                        }
                        , error: function(data) {
                        	console.warn("ADREQ LOAD ERROR");
                            console.log("광고솔루션 에러", data);
                            if($scope.timeout_flag == 0){
                                $scope.loadListData(loadParam2);//에러가 나도 데이타 로드는 진행함.                        
                                $scope.timeout_flag = 1;                                
                            }
                        }
                        ,timeout : 2000
                    });
                    //201804 광고솔루션 ============================ end                                     
                }else{
                    $scope.loadListData(loadParam2);
                }
			}
			

			if($scope.postParams.isVoice != "N" && $scope.uiStateObj.voiceResultParams != null){
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
					break;
				case "E":// 상세검색
					// 검색조건 호출 안함
					//break;
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
				has_coupon: 'useCpn',
				tenten_yn: 'tenten_yn'
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
				has_coupon: false,
				tenten_yn: ""
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
				saleRate : 'saleRate',
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
				sale_cnt : 'saleCnt',
				is_sale_promotion: 'goodsCmpsCd',
				outlnk : 'outlnk',
				outlnkMall : 'outlnkMall',
				curDispNo: 'curDispNo',
				has_coupon: 'useCpn',
				hash_list: 'hash_list',
				//find_age: 'find_age',
				//find_gender: 'find_gender',
				savePoint: 'savePoint',
				vodUrl: 'vodUrl',
                click_url : 'click_url',
                ad_url  : "ad_url",
                nIdx : "nIdx",
                tenten_yn : "tenten_yn",
                soldout_yn : "soldout_yn",
                nhCardPrice : "nhCardPrice"
			} //201804 광고솔루션 타입추가 click_url
			
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
				savePoint: 0,
				vodUrl: '',
				tenten_yn: '',
				soldout_yn:"",
				nhCardPrice:""
			};
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
					} else if(key == 'sale_rate' || key == 'savePoint') {
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
			var len, i, c ;
			var rtnType = $scope.postParams.rtnType;

			if(rtnType == "" || rtnType == "K"){
				if(colors == undefined){
					$scope.srhDetailData.srhColorList = [];
					$scope.srhDetailData.srhColorList2 = [];
					return;
				}
	
				len = colors.length;
				var tempColor = [];
				for(i=0; i<len; i++){
					c = colors[i];
					c.selected	= ($scope.postParams.selectedColor.indexOf(c.colorCd) >= 0);
					c.avail		= true;
					c.name = c.colorNm;
					tempColor.push(c);
				}
				$scope.srhDetailData.srhColorList = tempColor;
				$scope.srhDetailData.srhColorList2 = tempColor.concat([]);
			}else{
				$scope.postParams.selectedColor2 = [];
				$scope.srhDetailData.srhColorList2.length = 0;
				if(colors == undefined){ return; }
				
				var arr = [];
				len = colors.length;
				for(i=0; i<len; i++){
					arr.push(colors[i].colorCd);
				}
				
				var scl = $scope.srhDetailData.srhColorList;
				len = scl.length;
				for(i=0; i<len; i++){
					c		= scl[i];
					c.avail	= arr.indexOf(c.colorCd) >= 0;
					if(c.selected && c.avail){
						$scope.postParams.selectedColor2.push(c.colorCd);
					}
					if(c.avail){
						$scope.srhDetailData.srhColorList2.push(c);
					}
				}
			}
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
					page	: 1,
					cmpsCd	: 50,
                    holyDayYN : commInitData.query.holyDayYN === 'Y' ? 'Y' : 'N' // 명절상품전용 : 20180110 박해원
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
			

			if($scope.searchTermsLoading){ return false; }

			$scope.isShowLoading = true;// AJAX 호출 Flag 활성화
			$scope.searchTermsLoading = true;
			
			$http.get(loadURL, {params:postParams})
				.success(function (data, status, headers, config) {//호출 성공시
					$scope.termDataLoadComplete(data);
					// 명절상품전용 : 20180110 박해원
					if( commInitData.query.holyDayYN === 'Y' ) {
		                setTimeout(function() { // 비활성 처리
		                    commInitData.query.holyDayYN = 'N';
		                }, 1000);
		            }
					
					//$scope.isShowLoading = false;
					$scope.searchTermsLoading = false;
					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
						$scope.isShowLoading = false;
					}
					
                    //setTimeout(function(){ $scope.setSurveyPos(); }, 500);// 검색만족도
					//console.log("슈퍼 상품 존재여부 : ", $scope.srhDetailData.srhTerms.super);
				})
				.error(function (data, status, headers, config) {//호출 실패시
					//$scope.isShowLoading = false;
					console.warn("TERM LOAD ERROR")
					$scope.searchTermsLoading = false;
					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
						$scope.isShowLoading = false;
					}
				});
		}

		$scope.relationKeyword = function(keyword) {
			return keyword.replace($scope.srhResultData.keyword,"<em>"+$scope.srhResultData.keyword+"</em>");
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
				
				//if($data.resultCode == "0000"){//검색결과 있음
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
					
					var i, k, len, klen;
					
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
					
					var rtnType = $scope.postParams.rtnType;
					
					switch(rtnType){
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
							
							// 결과내 키워드에 오늘장보기 추가
							if(($data.store.super == "1") && $scope.uiStateObj.superBrnShowFlag && ($scope.postParams.reQuery.indexOf("오늘장보기") < 0)){
								$scope.addRelatedKeyword("오늘장보기", true);
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
							
							//연관검색어 애니메이션
							$scope.tryAnimateRelatedKeyword();
				
						//case "C" :// 카테고리
						default:
							
							if($data.ctgLst != undefined){
								$scope.srhResultData.ctgLst = $data.ctgLst;// 카테고리 리스트
							}
							if($data.dtlCtgLst != undefined){
								$data.subCtgLst = $data.dtlCtgLst;
								$data.subCtgLst.ctgNo = $scope.uiStateObj.selectedCategory.depth2;//$scope.postParams.ctgNo;
							}
							
							// 서브카테 (3, 4뎁스), 대카일때만 실행
							//if($scope.postParams.ctgDepth==1 && $data.subCtgLst != undefined){

							if($data.subCtgLst != undefined){
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
							
							// 카테고리 노출상태 설정
							//$timeout($scope.updateCategoryheight, 100);
							
							
						//case "D":// 상세 (구버전)
						//case "E":// 기타 상세
						//default:
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
							if($scope.srhResultData.brdLst == undefined){
								$scope.srhResultData.brdLst		= {};
								$scope.srhResultData.brandList	= {};
							}
							if($data.brdLst.items == undefined){
								$data.brdLst.items = [];
							}
							
							var brd;
							if(rtnType == "" || rtnType == "K"){
								$scope.srhResultData.brdLst.items = $filter('orderBy')($data.brdLst.items, $scope.uiStateObj.srhFilterBrdSort);// 브랜드 리스트
								$scope.srhResultData.brandList.items = [].concat($scope.srhResultData.brdLst.items);
								/*len = $scope.srhResultData.brdLst.items.length;
								for(i=0; i<len; i++){
									brd = $scope.srhResultData.brdLst.items[i];
									brd.hide = false;
									brd.dimm = false;
								}*/
							}else{
								//$scope.srhResultData.brdLst.items = $filter('orderBy')($data.brdLst.items, $scope.uiStateObj.srhFilterBrdSort);// 브랜드 리스트
								var brdNo = [];
								var brdList = $filter('orderBy')($data.brdLst.items, $scope.uiStateObj.srhFilterBrdSort);
								angular.forEach(brdList, function(itm, idx){
									brdNo.push(itm.brdNo);
									angular.forEach($scope.srhResultData.brdLst.items, function(brd, bdx){
										if(brd.brdNo == itm.brdNo){
											brd.cnt = itm.cnt;
										}
									});
								});
								
								var brandDimm = [];
								$scope.srhResultData.brandList.items.length = 0;
								angular.forEach($scope.srhResultData.brdLst.items, function(itm, idx){
									itm.dimm = false;
									if(brdNo.indexOf(itm.brdNo) >= 0){
										$scope.srhResultData.brandList.items.push(itm);
									}else if(itm.checked){
										itm.dimm = true;
										itm.cnt = 0;
										brandDimm.push(itm);
										//$scope.srhResultData.brandList.items.push(itm);
									}
								});
								$scope.srhResultData.brandList.items = $filter('orderBy')($scope.srhResultData.brandList.items, $scope.uiStateObj.srhFilterBrdSort);
								if(brandDimm.length > 0){
									$scope.srhResultData.brandList.items = $scope.srhResultData.brandList.items.concat(brandDimm);
								}
								
								/*len = $scope.srhResultData.brdLst.items.length;
								for(i=0; i<len; i++){
									brd = $scope.srhResultData.brdLst.items[i];
									brd.hide = brdNo.indexOf(brd.brdNo) < 0;
									brd.dimm = brdNo.indexOf(brd.brdNo) < 0;
								}*/
							}
							
							//$scope.srhResultData.brdLstRender = $scope.srhResultData.brdLst.items.slice(0, $scope.brdShowListCnt);
							//$scope.srhResultData.brdLstRender = $scope.srhResultData.brandList.items.slice(0, $scope.brdShowListCnt);
							$scope.srhResultData.brdLstRender = $scope.srhResultData.brandList.items;//.slice(0, $scope.brdShowListCnt);

							/*if ($data.brdLst.items) {
								$scope.srhResultData.brdLst.items = $filter('orderBy')($data.brdLst.items, $scope.uiStateObj.srhFilterBrdSort);// 브랜드 리스트
								$scope.srhResultData.brdLstRender = $scope.srhResultData.brdLst.items.slice(0, $scope.brdShowListCnt);
							}*/

							if ($data.brdLst.tcnt) {
								$scope.srhResultData.brdLst.tcnt = $data.brdLst.tcnt;// 브랜드 리스트
							}
							//-- 20161201 박형윤 수정

							//case "B" :// 브랜드
							

							// 매장
							$scope.srhDetailData.srhTerms.dept = $data.store.dept == "1" ? true : false;
							$scope.srhDetailData.srhTerms.tvhome = $data.store.tvhome == "1" ? true : false;
							$scope.srhDetailData.srhTerms.super = $data.store.super == "1" ? true : false;
							$scope.srhDetailData.srhTerms.brdstore = $data.store.brdstore == "1" ? true : false;

							// 가격대
							$scope.srhResultData.price = $data.price;
							$scope.postParams.priceMinUTemp = $data.price.min;
							$scope.postParams.priceMaxUTemp = $data.price.max;
							
							// 사은품 제공
							if(rtnType == "" || rtnType == "K"){
								$data.freeGiftYN == "Y" ? $scope.srhDetailData.freeGiftView = true  : $scope.srhDetailData.freeGiftView = false;
							}
							$data.freeGiftYN == "Y" ? $scope.srhDetailData.freeGiftYN = true  : $scope.srhDetailData.freeGiftYN = false;
							
							// 배송
							//$scope.srhDetailData.srhTerms.smpick = $data.smpick == "1" ? true : false;
							$scope.srhDetailData.srhTerms.smpick = ($data.smpDept == "1" || $data.smpick == "1") ? true : false;
							$scope.srhDetailData.srhTerms.smpickBranch = $filter('orderBy')($data.smpickBranch, 'name');
							$scope.srhDetailData.srhTerms.seven = $data.smpSeven == "1" ? true : false;
							$scope.srhDetailData.srhTerms.quick = $data.quick == "1" ? true : false;
							$scope.srhDetailData.srhTerms.tdar = $data.tdar == "1" ? true : false;

							// 컬러
							$scope.updateColors($data.colors);

							//스타일
							if($data.feelList){
								if(rtnType == "" || rtnType == "K"){
									if($data.feelList.items){
										$scope.srhResultData.srhFeelList = $data.feelList.items;
										$scope.srhResultData.feelListCnt = $scope.srhResultData.srhFeelList.length;
									}
								}else{
									var feel = [];
									angular.forEach($data.feelList.items, function(item){
										feel.push(item.feelNo);
										angular.forEach($scope.srhResultData.srhFeelList, function(feelItem){
											if(feelItem.feelNo == item.feelNo){
												feelItem.feelcnt = item.feelcnt;
											}
										});
									});

									$scope.srhResultData.srhFeelList = $filter('orderBy')($scope.srhResultData.srhFeelList, '-feelcnt');

									angular.forEach($scope.srhResultData.srhFeelList, function(item){
										if(feel.indexOf(item.feelNo) >= 0){
											item.dimm = false;
										}else{
											item.dimm = true;
											item.feelcnt = 0;
										}
									});
									
									var cnt = 0;
									angular.forEach($scope.srhResultData.srhFeelList, function(item){
										if(!item.dimm || (item.dimm && item.checked)){
											cnt ++;
										}
									});
									$scope.srhResultData.feelListCnt = cnt;
								}
							}
							
							// 신발사이즈
							if($data.shoseSizeLst){
								if(rtnType == "" || rtnType == "K"){
									if($data.shoseSizeLst.items){
										$scope.srhResultData.shoseSizeLst = $data.shoseSizeLst.items;
										$scope.srhResultData.shoseSizeCnt = $scope.srhResultData.shoseSizeLst.length;
									}
								}else{
									var shoes = [];
									angular.forEach($data.shoseSizeLst.items, function(item){
										shoes.push(item.shoseNm);
										angular.forEach($scope.srhResultData.shoseSizeLst, function(shoe){
											if(shoe.shoseNm == item.shoseNm){
												shoe.shoseCnt = item.shoseCnt;
											}
										});
									});
									
									angular.forEach($scope.srhResultData.shoseSizeLst, function(item){
										if(shoes.indexOf(item.shoseNm) >= 0){
											item.dimm = false;
										}else{
											item.dimm = true;
											item.shoseCnt = 0;
										}
									});
									
									var cnt = 0;
									angular.forEach($scope.srhResultData.shoseSizeLst, function(item){
										if(!item.dimm || (item.dimm && item.checked)){
											cnt ++;
										}
									});
									$scope.srhResultData.shoseSizeCnt = cnt;
								}
							}
							
							// 별점
							if($data.starPointLst && $data.starPointLst.items){
								$scope.srhResultData.starPointLst = $data.starPointLst.items;
								var s = "2";
								if($scope.srhResultData.starPointLst.length > 0){
									switch($scope.srhResultData.starPointLst[0].starNo){
									case "1":
									case "2":
									case "3":
									case "4":
									case "5":
										s = $scope.srhResultData.starPointLst[0].starNo;
										break;
									// no default;
									}
								}else{
									s = "0";
								}
								var v;
								
								angular.forEach($scope.uiStateObj.starPointArr, function(itm){
									v = itm.value;
									if(v == "" || v <= s){
										itm.dimm = false;
									}else{
										itm.dimm = true;
									}
								});
								$scope.srhResultData.starPoinCnt = $data.starPointLst.items.length;
							}else{
								$scope.srhResultData.starPoinCnt = 0;
								angular.forEach($scope.uiStateObj.starPointArr, function(itm){
									itm.dimm = true;
								});
							}
						
					}
		
					
					$scope.uiStateObj.detailSearchDataLoaded = true;// 데이터 로드 완료, 상세검색 UI활성화
					
					
					checkDefaultCategory();
					//$timeout($scope.scrollFilterTop, 1);
					$timeout(checkVoiceResult, 1);
				
					
					if($data.resultCode != "0000"){
						$scope.uiStateObj.relatedKeywordNotEmpty = false;
						if($scope.postParams.rtnType == ""){
							// 키워드
							$scope.srhResultData.keyword = $data.keyword;
							$scope.postParams.keyword = $data.keyword;
						}
					}
				//}else if ($data.resultCode == "1000") {//검색결과 없음
				//}else if($data.resultCode == "2000"){//검색키워드 없음
				/*}else{
					$scope.uiStateObj.relatedKeywordNotEmpty = false;
					if($scope.postParams.rtnType == ""){
						// 키워드
						$scope.srhResultData.keyword = $data.keyword;
						$scope.postParams.keyword = $data.keyword;
					}
				}*/
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
			return;
			if($scope.uiStateObj.voiceResultParams == null || $scope.srhResultData.price == undefined){ return; }
			//if($scope.postParams.isVoice == "N" || $scope.uiStateObj.voiceResultParams == null || $scope.srhResultData.price == undefined){ return; }
			
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
			console.log("p" , p)
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
			/*var price = $scope.srhResultData.price;
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
			}*/
			
			$scope.uiStateObj.voiceResultParams = null;
		};
		
		/**
		 * 필터 변경 후 해당 필터를 화면에 표시되도록 스크롤
		 */
		$scope.scrollFilterTop = function(target){
			var opened = $(".foldable_tab.opened:not(.research)");
			var filterHeadHeight = opened.height();
			if(opened.length > 0){
				var next = opened.next();
				if(next.length > 0){
					var t0 = $(".foldable_tab:first-child").position().top,
						t1 = opened.position().top,
						t2 = next.position().top;
					if(t2 < filterHeadHeight){
						$(".ssw_slide.main").scrollTop(t1 - t0);
					}
				}
			}else{
				if(target){
					$(".ssw_slide.main").scrollTop(0);
					$(".ssw_slide.main").scrollTop($(target).position().top);
				}
			}
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
						$scope.uiStateObj.selectedCategory.ctgName = [ctg.ctgName];
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
					page : 1,
					cmpsCd	: 50,
                    holyDayYN : commInitData.query.holyDayYN === 'Y' ? 'Y' : 'N' // 명절상품전용 : 20180110 박해원
				}, params),
				loadURL = $scope.URLs.searchList;
			
			if($scope.productListLoading){ return false; }

			$scope.isShowLoading = true;// AJAX 호출 Flag 활성화
			$scope.productListLoading = true;
			
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
			
			// 20180221 닷컴/슈퍼 폴더앱 키워드에 따른 슈퍼 배너 미노출 처리
			$scope.uiStateObj.superBrnShowFlag = $scope.chkExcludeSuperBnr(postParams.keyword);
			//console.log("슈퍼 배너 노출여부 : ", $scope.uiStateObj.superBrnShowFlag);
			$http.get(loadURL, {params:postParams})
				.success(function (data, status, headers, config) {//호출 성공시
                    //201804 광고솔루션 ============================ srart                     
                    if(data.prdLst && data.prdLst.items){
                        for(var k=0; k<3; k++){
                            if(k < data.prdLst.items.length && data.prdLst.items[k].ad_url != undefined){//광고상품이면
                                if($scope.ad_list.length > 0){
                                    for(var i=0; i<$scope.ad_list.length; i++){
                                        if(data.prdLst.items[k].goodsNo == $scope.ad_list[i].goodsNo){
                                            data.prdLst.items[k].click_url = $scope.ad_list[i].clickUrl;    
                                            //console.log(k, "clickurl", data.prdLst.items[k].click_url);
                                        }                                
                                    }                                    
                                }
                            }                        
                        }
					}
					
                    //201804 광고솔루션 ============================ end                     
					$scope.listDataLoadComplete(data);
					//$scope.isShowLoading = false;
					$scope.productListLoading = false;
					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
						$scope.isShowLoading = false;
					}
					
                    setTimeout(function(){ $scope.setSurveyPos(); }, 1000);// 검색만족도
                    
                    /**
					 * groobee 스크립트 검색 로그 수집
					 * 적용 기간 : 2018.12.26 ~ 2019.06.26
					 * 2018.12.19 고영우
					 */
					$timeout(function(){
						try{
							groobee( "search", { keyword : postParams.keyword } );
						//	console.log('groobee search ' + postParams.keyword);
						}catch(e){}
					}, 1300);
				})
				.error(function (data, status, headers, config) {//호출 실패시
					//$scope.isShowLoading = false;
					console.warn("LIST LOAD ERROR");
					$scope.productListLoading = false;
					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
						$scope.isShowLoading = false;
					}
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
                //201804 데이타에 인덱스 값 추가 설정                 
                if($data.prdLst.items && $data.prdLst.items.length > 0){
                    var startIndex = 0;
                    if($scope.postParams.page > 1){
                        startIndex = $scope.srhResultData.prdLst.items.length;                   
                    }                    
                    for(var k=0;k<$data.prdLst.items.length;k++){
                        $data.prdLst.items[k].nIdx = startIndex + k;
                    }                                    
                }
                
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
				
				$scope.uiStateObj.planShopOnly = false;
				if($data.resultCode == "0000"){
					if( ($data.prdLst == undefined || $data.prdLst.items == undefined || $data.prdLst.items.length == 0)
						&&
						($data.planPrdLst != undefined && $data.planPrdLst.items != undefined && $data.planPrdLst.items.length > 0) )
					{
						$scope.uiStateObj.planShopOnly = true;
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
					
					$scope.srhResultData.planPrdLst = $data.planPrdLst;
					
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
					$timeout(function(){$scope.alidoCollectLog('search', $data);}, 500); // ALIDO 수집스크립트 호출(검색 결과)

				} else if ($data.resultCode == "1000") {
					// 검색결과 없음
					$scope.uiStateObj.emptyResult = true;// UI
					$scope.uiStateObj.emptyKeyword = false;// UI
					$scope.productMoreScroll = false;

					/*N : 검색결과 없음*/
					$scope.srhResultData.tCnt = $data.tCnt; /*총 검색결과 수*/
					$scope.srhResultData.missKeyword = $data.missKeyword; /*오탈자 검색어*/
					$scope.srhResultData.smpBanner = $data.smpBanner; // 스마트픽배너 코너화
					
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
					if($scope.srhResultData.advtBnrLst.items) {
						for(var i=0;i < $scope.srhResultData.advtBnrLst.items.length;i++) {
							var item = $scope.srhResultData.advtBnrLst.items[i];
							if(item.title != "") {
								item.title = item.title.replace(/\\n/g,"<br>");
							}
						}
					}
					
					if(data.advtTxtBnrInfo != undefined && $scope.isValidString(data.advtTxtBnrInfo.linkUrl)){
						$scope.srhResultData.advtTxtBnrInfo = data.advtTxtBnrInfo;
					}
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
				$scope.srhResultData.listMid2 = [];
				$scope.srhResultData.listMid3 = [];
				$scope.srhResultData.listRest = [];
				return;
			}
			
			var len = $scope.srhResultData.prdLst.items.length;
			
			if(len <= 6){
				$scope.srhResultData.listMid2 = [].concat($scope.srhResultData.prdLst.items);;
				$scope.srhResultData.listMid3 = [];
				$scope.srhResultData.listRest = [];
			}else if(len <= 18){
				$scope.srhResultData.listMid2 = $scope.srhResultData.prdLst.items.slice(0, 6);
				$scope.srhResultData.listMid3 = $scope.srhResultData.prdLst.items.slice(6, 18);
				$scope.srhResultData.listRest = [];
			}else{
				$scope.srhResultData.listMid2 = $scope.srhResultData.prdLst.items.slice(0, 6);
				$scope.srhResultData.listMid3 = $scope.srhResultData.prdLst.items.slice(6, 18);
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
					//try { console.log('Data Load'); } catch (e) {}
	
					$scope.loadDataParams(); // 데이터 로드
					
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
					
					//연관검색어 애니메이션
					$scope.tryAnimateRelatedKeyword();
	
					LotteStorage.delSessionStorage('srhLstLoc'); // 세션스토리지에 저장된 현재 URL 삭제
					LotteStorage.delSessionStorage('srhLst'); // 세션스토리지에 저장된 검색결과리스트 데이터 삭제
					LotteStorage.delSessionStorage('srhLstNowScrollY'); // 세션스토리지에 저장된 스크롤 위치 삭제
				}
			} else { // 세션 스토리지에 데이터가 없을 경우 AJAX 데이터 로드
				//try { console.log('Data Load'); } catch (e) {}
				$scope.loadDataParams(); // 데이터 로드
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
				
			});


			/**
			 * 스크롤 이벤트 - 더보기
			 */
			angular.element($window).on("scroll", function(e){
				var $win = angular.element($window),
					$body = angular.element("body"),
					winH = $win.height(),
					bodyH = $body[0].scrollHeight,
					scrollRatio = 4.0,// 윈도우 높이의 4배
					moreLoadTime = 0;

				if(!$scope.scrollFlag){ e.preventDefault(); return ; }
				if(!$scope.srhResultData.prdLst){return} //리스트 없으면 예외
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

			// 상태 변경 이벤트
			angular.element($window).on("popstate", function(event){
				$scope.tipShow = false;
				if($scope.curSideStatus == 3){
					$scope.hideSubSearch();
				}else if($scope.curSideStatus == 2){
					$scope.closeSideSearch();
				}else{
                    if($scope.searchUISetting.isShowSideBar){ //20180521 특정 아이폰 버전에 대한 대비
 					   history.back();    
                     }										
				}
			});

			// 안드로이드 크롬브라우저 체크 (CSS용 분기처리)
			var ua = (navigator.userAgent + "").toLowerCase();
			$scope.searchUISetting.isAndroidChrome = (ua.indexOf("android")>=0) && (ua.indexOf("chrome")>=0);
		};
		
		/**
		 * 사이드바 펼침 상태 - 닫기
		 */
		$scope.goPrevSideStatus = function(){
			if($scope.curSideStatus > 1){
				$scope.curSideStatus--;
			}
		};
		/**
		 * 사이드바 펼침 상태 - 열리기
		 */
		$scope.goNextSideStatus = function(){
			if($scope.curSideStatus < 3){
				$scope.curSideStatus++;
				history.pushState($scope.curSideStatus, $scope.curSideStatus, $window.location.href);
			}
		};
		
		$scope.searchTclick2016 = function(str){
			var tclick = $scope.tClickBase;
			// renewal
			tclick += "SrhFilter_" + str;
			
			$scope.sendTclick(tclick);// lotte-comm.js - TCLICK 수집
			
			if(str == "Cate_ALL"){
				$scope.ga("카테고리", "전체");
			}
		};
		
		/**
		 * Google Analytics
		 */
		$scope.ga = function(act, lab, flag){
			if(flag === "sort"){
				LotteGA.evtTag("MO_검색_검색결과_정렬", act, lab);
			}else{
				LotteGA.evtTag("MO_검색_검색결과_필터", act, lab);
			}
		};
		
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
			url += "&tclick=" + "m_RDC_SrhResult_Clk_event_idx" + $scope.numberFill((idx+1),3);
			window.location.href = url;
		};
		
		/**
		 * 롯데슈퍼 검색배너 링크
		 */
		$scope.lsSearchLink = function(lsKeyword){
			var lsSearchCHLNO = ($scope.appObj.isSuperApp) ? "M389288" : "M389287"; // 슈퍼 base : 닷컴 base
			for(i=0;i < $scope.postParams.reQuery.length;i++) {
				if($scope.postParams.reQuery[i].indexOf('오늘장보기') >= 0) {
					continue;
				}
				lsKeyword += ' '+$scope.postParams.reQuery[i];
			}
			$scope.gotoLotteSuperUrl(LotteCommon.SuperSearchListUrl + "?query=" + lsKeyword, lsSearchCHLNO); // param (url, 채널)
		};
		
		/**
	     * @ngdoc function
	     * @name productContainer.function:productInfoProc
	     * @description
	     * 상품 클릭 이벤트 처리
	     * @example
	     * $scope.productInfoProc(item, type, idx)
	     * @param {Object} item 상품 json data
	     * @param {Object} type 상품 Tyep 딜상품인지 아닌지에 대한 처리 
	     * @param {Number} idx 상품 리스트 인덱스
	     * 
	     * @param {Number} item.outlnkMall 외부 상품 구분값
	     * @param {Boolean} item.has_wish 위시에 담긴 상품인지에 대한 구분값
	     * @param {String} item.limit_age_yn 성인 상품 여부 Y/N
	     * @param {Number} item.pmg_byr_age_lmt_cd 성인 상품 여부 19 이면 19금 
	     * @param {String} item.goods_no 상품 번호
	     * @param {String} item.outlnk 외부링크 주소
	     */
		$scope.productInfoProc = function(item, type, tClick) {
			if(item.limit_age_yn == 'Y' || item.pmg_byr_age_lmt_cd == '19') {
				if (!$scope.loginInfo.isAdult && $scope.loginInfo.isLogin) { /*19금 상품이고 본인인증 안한 경우*/
					// alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
					$scope.goAdultSci();
					return false;
				} else if(!$scope.loginInfo.isLogin) {
					window.location.href = LotteCommon.loginUrl + '?'+$scope.baseParam + '&adultChk=Y'+"&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
					return false;
				} else if (!$scope.loginInfo.isAdult) {
					alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
					return false;
				}
			}

			if (item.outlnk != "" && item.outlnk != undefined) {
				if (item.outlnkMall == "SP") {
					if (confirm("롯데슈퍼로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
						if ($scope.appObj.isApp) {
							openNativePopup("롯데슈퍼", item.outlnk);
						} else {
							window.open(item.outlnk);
						}
					}
				} else {
					if (confirm("공식 온라인 몰로 이동 후 구입하실 수 있습니다.\n이동 하시겠습니까?")) {
						if ($scope.appObj.isApp) {
							openNativePopup("공식온라인몰", item.outlnk);
						} else {
							window.open(item.outlnk);
						}
					}
				}
				return false;
			}

			var curDispNo = "";
			if($scope.curDispNo) {
				curDispNo = "&curDispNo=" + $scope.curDispNo;
			} else if (item.curDispNo) {
				curDispNo = "&curDispNo=" + item.curDispNo;
			}

			var curDispNoSctCd = "";
			if ($scope.curDispNoSctCd) {
				curDispNoSctCd = "&curDispNoSctCd=" + $scope.curDispNoSctCd;
			} else if (item.curDispNoSctCd) {
				curDispNoSctCd = "&curDispNoSctCd=" + item.curDispNoSctCd;
			}

			var dealProd = "";
			if (type == "deal" || item.genie_yn) {
				dealProd = "&genie_yn=Y";
			}

			window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no+ curDispNo + curDispNoSctCd + dealProd + "&tclick="+tClick;
		}

		$scope.numberFill = function(idx, length) {
			var strIdx = "" + idx;
			var fillData = "00000000000000000";
			return fillData.substring(0,length - strIdx.length) + strIdx;
		};

		/**
		 * 닷컴/슈퍼 폴더앱 슈퍼 배너 제외키워드 체크
		 */
		$scope.superBnrExclude = function () {
			$http.get(LotteCommon.superBnrExcludeKeywordData, {})
			.success(function (data, status, headers, config) {
				if (data.result) {
					$scope.uiStateObj.excludeKeyword = data.result;
				} else {
					$scope.uiStateObj.excludeKeyword = [];
				}

				// console.log("$scope.postParams.keyword", $scope.postParams.keyword);
				$scope.uiStateObj.superBrnShowFlag = $scope.chkExcludeSuperBnr($scope.postParams.keyword);
				//console.log("슈퍼 배너 노출여부 : ", $scope.uiStateObj.superBrnShowFlag);
			})
			.error(function (data, status, headers, config) {//호출 실패시
				console.log('Data Error : 슈퍼배너 제외 키워드 로드 실패');
				$scope.uiStateObj.excludeKeyword = [];
			});;
		};

		// 배너 노출 제외 키워드 판단
		$scope.chkExcludeSuperBnr = function (keyword) {
			var rtnValue = true,
				i = 0,
				chkFinder = false,
				compareKeyword = (keyword + "").replace(/\![^\s]+/gi, "");

			if ($scope.uiStateObj.excludeKeyword && $scope.uiStateObj.excludeKeyword.length > 0) {
				for (i; i < $scope.uiStateObj.excludeKeyword.length; i++) {
					if (compareKeyword.indexOf($scope.uiStateObj.excludeKeyword[i]) > -1) {
						chkFinder = true;
						break;
					}
				}

				if (chkFinder) {
					rtnValue = false;
				}
			}

			return rtnValue;
		};

		if (!$scope.uiStateObj.excludeKeyword) {
			$scope.superBnrExclude();
		}
    }]);
    
    /**
	 * @ngdoc directive
	 * @name lotteComm.directive:scrollCount
	 * @description
	 * top button
	 * @example
	 * <scroll-count></scroll-count>
	 */
	commModule.directive('scrollCount', ['$window', 'LotteCommon', function ($window, LotteCommon) {
		return {
			template: '<div ng-show="srhResultData.tCnt && srhResultData.tCnt > 0" class="count_wrap"><span class="count">{{currentItem|number}}/{{srhResultData.tCnt|number}}</span></div>',
			replace: true,
			link: function ($scope, el, attrs) {
				
				$scope.currentItem = 1;
				
				angular.element($window).on('scroll', function (evt) {
					$('.count_wrap').stop().show();
					clearTimeout($('.count_wrap').data('scroll'));
					
					setTimeout(function(){
						$('.count_wrap').fadeOut();
					},1000);
					
					var prevIndex = -1;
					var prevTop = -1;
					for(var i = 0; i<$scope.totalItem; i++){
						var el = $($('.listWrap ol > li')[i]);
						var top = el.offset().top;
						if(window.scrollY - top <= 100 && prevIndex == -1){
							prevIndex = i;
							prevTop = window.scrollY - top;
						}
						if(prevIndex != -1 && window.scrollY - top <= 100 && window.scrollY - top != prevTop){
							$scope.currentItem = i;
							break;
						}
					}
				});
			}
		}
	}]);

    app.directive('lotteContainer', ['LotteStorage', 'LotteUtil', 'LotteCommon', '$http', '$timeout', '$window', '$filter', 
		function(LotteStorage, LotteUtil, LotteCommon, $http, $timeout, $window, $filter) { // 20161201 박형윤 추가 $filter
        return {
            templateUrl : '/lotte/resources_dev/search/search_list_2018_container.html',
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

				$scope.delResrhText = function() {
					$scope.postParams.rekeyword = "";
				}
				
				/**
				 * 성별/연령 모아보기
				 */
				$scope.setAgeGender = function(item, idx, flag){
					/*if(item == null){
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
							$scope.sendTclick("m_RDC_SrhResult_Clk_Best_GoL");
							break;
						case 2:
							// 모아보기
							$scope.sendTclick("m_RDC_SrhResult_Clk_Bestlist_tap_idx" + $scope.numberFill((idx+1),3));
							break;
						default:
							$scope.sendTclick("m_RDC_SrhResult_Clk_Bestlist_back_Btn");
							// 취소
							break;
					}
					
					$timeout(function() {
						$win.scrollTop(0);
					},500);*/
				};
				
				/**
				 * 폰트 사이즈 변경
				 */
				/*$scope.changeFontSize = function(){
					var body = angular.element("body");
					if(body.hasClass("enlargeFont")){
						body.removeClass("enlargeFont");
						LotteStorage.delSessionStorage("SEARCH_fontsize")
					}else{
						body.addClass("enlargeFont");
						LotteStorage.setSessionStorage("SEARCH_fontsize", "1")
					}
					$scope.searchTclick2016("Clk_Text_elg");
					$scope.ga("글자크게", "글자크게");
				};*/
				/*$scope.getFontSize = function() {
					var body = angular.element("body");
					if(body.hasClass("enlargeFont")){
						return true;
					} else {
						return false;
					}
				}*/
				/*function checkFontSize(){
					var ft = LotteStorage.getSessionStorage("SEARCH_fontsize");
					if(ft === "1"){
						angular.element("body").addClass("enlargeFont");
					}
				}*/
				//checkFontSize()
				
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
					//$scope.sendTclick($scope.tClickRenewalBase + "Srhheader_Clk_Lyr_1");
					if(clearKW){
						$scope.sendTclick("m_RDC_SrhResult_Clk_delete_Btn");
					} else {
						$scope.sendTclick("m_RDC_header_Clk_Lyr_1");
					}
					
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
						var kw = $scope.srhResultData.keyword;
						angular.forEach($scope.postParams.reQuery, function(itm){
							kw += " " + itm;
						});
						$scope.keyword = kw;
						$timeout(function(){$scope.showAutoSrh({keyCode:1});}, 100);
					}
					$scope.showRecentKeyword();
				}
				
				
				/**
				 * 사이드바 닫기 버튼 클릭
				 */
				$scope.closeSidebarBtnClk = function(){
					$scope.searchTclick2016("Clk_Close_Btn");
					
					if($scope.searchUISetting.isShowSub){
						switch($scope.searchUISetting.lastSlide){
						case "category":
							$scope.ga("카테고리", "닫기");
							break;
						case "brand":
							$scope.ga("브랜드", "닫기");
							break;
						// no default
						}
					}else{
						$scope.ga("필터_닫기", "닫기");
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
					$scope.actionbarHideFlag = false;
					
					if($scope.searchUISetting.isShowSub === true){
						$scope.hideSubSearch();
					}
					$scope.goPrevSideStatus();
					if($scope.curSideStatus > 1){
						$scope.goPrevSideStatus();
					}
				};
				
				$scope.showHideSideSearch = function(shortcut){
					if ($scope.searchUISetting.isShowSideBar) {
						$scope.closeSideSearch();
					} else {
						if($scope.uiStateObj.detailSearchDataLoaded == false){ return; }
						
						$scope.searchTermsChanged = false;
						$scope.searchUISetting.isShowSideBar = true;
						$scope.actionbarHideFlag = true;
						$scope.dimmedOpen({
							target: "sideSearch",
							callback: this.closeSideSearch,
							scrollEventFlag: false
						});
						
						$(".side_search_wrap .ssw_content .ssw_slide.sub").scrollTop(0);// 서브슬라이드 상단으로 스크롤
						if(shortcut=="SORT"){
							$scope.showSubSearch({currentTarget:$(".ssw_slide.main li a[data-label='정렬']")});
						}
						$scope.goNextSideStatus();
						
						angular.element(".ssw_slide.main").unbind("scroll").bind("scroll", sswSlideMainScroll);
						$timeout(sswSlideMainScroll, 10);
					}
					
					if(shortcut=="SORT"){
						//$scope.searchTclick2016("R", "Sorting_Btn");//정렬
						$scope.sendTclick( "m_RDC_SrhFilter_Clk_Sorting" );
					}else{
						//$scope.searchTclick2016("R", "detailedsrh_Btn");//상세검색
						$scope.sendTclick( "m_RDC_SrhResult_Clk_Filter" );
					}
				};


				
				var sswSlideMainScroll_ST;
				function sswSlideMainScroll2(opened){
					if(opened == undefined){
						opened = angular.element(".foldable_tab.opened:not(.research)");
					}
					if(opened.offset().top <= 84){
						opened.addClass("fixtop");
					}else{
						opened.removeClass("fixtop");
					}
				}
				
				function sswSlideMainScroll(){
					var opened = angular.element(".foldable_tab.opened:not(.research)");
					if(opened.length > 0){
						if($scope.appObj.isIOS){
							opened.removeClass("fixtop");
							clearTimeout(sswSlideMainScroll_ST);
							sswSlideMainScroll_ST = setTimeout(sswSlideMainScroll2, 300);
						}else{
							sswSlideMainScroll2(opened);
							/*if(opened.offset().top <= 84){
								opened.addClass("fixtop");
							}else{
								opened.removeClass("fixtop");
							}*/
						}
					}
					
					angular.element(".foldable_tab.fixtop:not(.opened)").removeClass("fixtop");
					
					/*var i, li, slide;
					var t = angular.element(".ssw_content .fixed_tab").offset().top;// + 20;
					var arr = angular.element(".ssw_slide.main > ul > li > a");
					var len = arr.length;
					for(i=len-1; i>=0; i--){
						li = angular.element(arr[i]);
						slide = li.data("slide");
						if(li.offset().top <= t){
							if($scope.currentFixedTab != slide){
								$scope.currentFixedTab = slide;
								$timeout(function(){
									$scope.currentFixedTab = slide;
								}, 1);
							}
							break;
						}
					}*/
				};

				/**
				 * 상세검색 서브 열기
				 */
				$scope.showSubSearch = function(e) {
					var a = $(e.currentTarget);
					var slide = a.data("slide");
					
					switch(slide){
					case "category":
						$scope.ga("카테고리", "리스트메뉴");
						break;
					case "brand":
						$scope.ga("브랜드", "리스트메뉴");
						break;
					case "sort":
						$scope.ga("정렬", "리스트메뉴");
						break;
					case "benefit":
						$scope.ga("가격혜택선물포장", "리스트메뉴");
						break;
					case "delivery":
						$scope.ga("배송", "리스트메뉴");
						break;
					case "color":
						$scope.ga("컬러", "리스트메뉴");
						break;
					case "store":
						$scope.ga("매장", "리스트메뉴");
						break;
					case "research":
						$scope.ga("결과내검색", "리스트메뉴");
						break;
					case "shoe":
						$scope.ga("신발사이즈", "리스트메뉴");
						break;
					case "star":
						$scope.ga("별점", "리스트메뉴");
						break;
					case "style":
						$scope.ga("스타일", "리스트메뉴");
						break;
					// no default
					}
					
					$timeout(sswSlideMainScroll, 10);
					$timeout(function(){$scope.scrollFilterTop(a.parents(".foldable_tab"))}, 20);
					
					switch(slide){
					case "sort":
					case "category":
					case "shoe":
					case "brand":
					case "benefit":
					case "delivery":
					case "color":
					case "star":
					case "store":
					case "style":
					case "research":
						if($scope.foldable[slide] == slide){
							$scope.foldable[slide] = null;
							$scope.foldable.lastSlide = null;
						}else{
							var research = $scope.foldable.research;
							$scope.foldable = { "research" : research };
							$scope.foldable[slide] = slide;
							$scope.foldable.lastSlide = slide;

						}
						return;
						break;
					// no default
					}
					
					$scope.searchUISetting.title = a.data("label");
					$scope.searchUISetting.slide = slide;
					$scope.searchUISetting.isShowSub = true;
					$scope.goNextSideStatus();

					if ($scope.searchUISetting.slide == "brand") {
						// 20161201 박형윤 추가 --
						if (!$scope.srhResultData.brdLstRender || $scope.srhResultData.brdLstRender.length == 0) {
							if($scope.srhResultData.brdLst.items != undefined){
								//$scope.srhResultData.brdLstRender = $scope.srhResultData.brdLst.items.slice(0, $scope.brdShowListCnt);
								//$scope.srhResultData.brdLstRender = $scope.srhResultData.brandList.items.slice(0, $scope.brdShowListCnt);
								$scope.srhResultData.brdLstRender = $scope.srhResultData.brandList.items;//.slice(0, $scope.brdShowListCnt);
							}
						}
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
							$scope.searchTclick2016("Clk_Cat");
							$scope.ga("카테고리", "리스트메뉴");
							break;
						case "brand":
							$scope.ga("브랜드", "리스트메뉴");
							$scope.searchTclick2016("Clk_Brand");
							break;
						case "benefit":
							$scope.searchTclick2016("Clk_ETC");
							break;
						case "color":
							$scope.searchTclick2016("Clk_Color");
							break;
						case "sort":
							$scope.searchTclick2016("Clk_Sorting");
							break;
						case "store":
							$scope.searchTclick2016("Clk_Store");
							break;
						case "delivery":
							$scope.searchTclick2016("Clk_Shipping");
							break;
					}
				};
				
				/**
				 * 상세검색 서브 닫기
				 */
				$scope.hideSubSearch = function(){
					if($scope.searchUISetting.isShowSub){
						$scope.searchTclick2016("Clk_Back_Btn");
						
						switch($scope.searchUISetting.lastSlide){
						case "category":
							$scope.ga("카테고리", "뒤로");
							break;
						case "brand":
							$scope.ga("브랜드", "뒤로가기");
							break;
						// no default
						}
						
						if($scope.curSideStatus == 3){
							$scope.goPrevSideStatus();
						}
					}
					
					$scope.searchUISetting.slide = null;
					if($scope.searchUISetting.isShowSub == false){ return; }
					$scope.searchUISetting.isShowSub = false;
				};
				
				/**
				 * 정렬 인기/판매 베스트 안내팝업
				 */
				$scope.showHideSortGuide = function(e){
					try{
						var a = angular.element(e.currentTarget);
						switch( a.parent().text().trim() ){
						case "인기순":
							window.alert("검색 정확도 및 판매 실적 등을 점수화하여 상품을 정렬합니다. (단, 광고상품은 별도기준에 따라 상단 정렬)");
							$scope.ga("정렬", "말풍선");
							break;
						case "판매순":
							window.alert("최근 7일동안 많이 판매된 상품을 누적한 기준으로 상품을 정렬합니다.");
							$scope.ga("정렬", "말풍선");
							break;
						case "내 주변 픽업":
							window.alert("내 주변 픽업 서비스는 세븐일레븐 / 하이마트 / 롯데슈퍼 / 롯데리아에서 픽업이 가능합니다.");
							$scope.ga("배송", "말풍선");
							break;
						// no default;
						}
					}catch(e){}
				};
				

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
					if(!$scope.postParams.smpickBranchNo){
						$scope.postParams.smpickBranchNo = '';
						$scope.postParams.smpickYN = "N";
						//$scope.srhDetailPost();//상세검색 조회 //전체 항목이 삭제되서 호출하면 안됨
						$scope.searchTclick2016("Shipping_Smartpick_Dpt");
						$scope.ga("배송", "스마트픽_백화점픽업");
					}
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
					$scope.searchTclick2016("Shipping_Smartpick_Dpt");
					$scope.ga("배송", "스마트픽_백화점픽업_" + item.name);
				};
				
				/**
				 * 카테고리 변경 확인
				 */
				function getLastCateNo(){
					var no = "";
					var sc = $scope.uiStateObj.selectedCategory;
					/*if(sc.depth4 != null){
						no = sc.depth4;
					}else */
					if(sc.depth4.length > 0){
						no = sc.depth4.join(",");
					}else if(sc.depth3 != null){
						no = sc.depth3;
					}else if(sc.depth2 != null){
						no = sc.depth2;
					}else if(sc.depth1 != null){
						no = sc.depth1;
					}
					return no;
				};
				
				/**
				 * 카테고리 아이템 클릭
				 */
				$scope.categoryItemClick = function(e, item, ctg1, ctg2, ctg3, ctg4){
					//console.log($scope.ctgInitFlag);
					/*if($scope.ctgInitFlag){
						alert("카테고리 변경 시 앞서 설정한 필터는 초기화됩니다.");
						$scope.ctgInitFlag = false;
					}*/
					
					var old = getLastCateNo();
					var a = $(e.currentTarget);
					var li = a.parent();
					var depth = li.data("depth");
					
					if(li.hasClass("selected")){
						$scope.deselectCategory(depth+1, ctg1, ctg2, ctg3, ctg4);
						return;
					}
					
					$scope.categoryAccordian(li, item.ctgNo);
					if(old != getLastCateNo()){
						$scope.srhSubCtgPost();
					}
					
					// tclick
					switch(depth){
						case 0:
							$scope.searchTclick2016("Cate_Cate1_" + item.ctgNo);
							break;
						case 1:
							$scope.searchTclick2016("Cate_Cate2_" + item.ctgNo);
							break;
						case 2:
							$scope.searchTclick2016("Cate_Cate3_" + item.ctgNo);
							break;
						case 3:
							$scope.searchTclick2016("Cate_Cate4_" + item.ctgNo);
							break;
					}
					
					// ga
					var str = "";
					var ctg2, mall;
					var sc = $scope.uiStateObj.selectedCategory;
					if(sc.depth1 != null){
						str = angular.element("#ctg_" + sc.depth1).data("name");
						if(sc.depth2 != null){
							ctg2 = angular.element("#ctg_" + sc.depth2);
							str += "_" + ctg2.data("name");
							mall = ctg2.data("mall");
							console.log(str, mall)
							if(mall != ""){
								str += " (" + mall + ")";
							}
							if(sc.depth3 != null){
								str += "_" + angular.element("#ctg_" + sc.depth3).data("name");
								if(sc.depth4.length > 0){
									str += "_" + item.ctgName;
								}
								/*if(sc.depth4 != null){
									str += "_" + angular.element("#ctg_" + sc.depth4).data("name");
								}*/
							}
						}
						$scope.ga("카테고리", str);
					}
				};
				
				/**
				 * 카테고리 선택 해제
				 */
				$scope.deselectCategory = function(depth, ctg1, ctg2, ctg3, ctg4){
					var sc = $scope.uiStateObj.selectedCategory;
					switch(depth){
					case 1:
						sc.depth1 = null;
						sc.depth2 = null;
						sc.depth3 = null;
						sc.depth4.length = 0;// = null;
						sc.ctgName.length = 0;// = "";
						break;
					case 2:
						sc.depth2 = null;
						sc.depth3 = null;
						sc.depth4.length = 0;// = null;
						try{
							sc.ctgName = [angular.element("#ctg_" + sc.depth1).data("name")];
						}catch(e){
							sc.ctgName.length = 0;// = "";
						}
						break;
					case 3:
						sc.depth3 = null;
						sc.depth4.length = 0;// = null;
						try{
							sc.ctgName = [angular.element("#ctg_" + sc.depth2).data("name")];
						}catch(e){
							sc.ctgName.length = 0;// = "";
						}
						break;
					case 4:
						sc.depth4.length = 0;// = null;
						try{
							sc.ctgName = [angular.element("#ctg_" + sc.depth3).data("name")];
						}catch(e){
							sc.ctgName.length = 0;// = "";
						}
						break;
					}
					
					$scope.srhSubCtgPost();
					var str = "해제";
					if(ctg1){
						str += "_" + ctg1.ctgName;
					}
					if(ctg2){
						str += "_" + ctg2.ctgName;
					}
					if(ctg3){
						str += "_" + ctg3.ctgName;
					}
					if(ctg4){
						str += "_" + ctg4.ctgName;
					}
					$scope.ga("카테고리", str);
				};
				
				/**
				 * 카테고리 데이터 업데이트 후 높이 재설정
				 */
				/*$scope.updateCategoryheight = function(){
					var sc = $scope.uiStateObj.selectedCategory;
					if(sc.depth1 != null){
						$("#ctg_" + sc.depth1).siblings().removeClass("open");
						if(sc.depth2 != null){
							$("#ctg_" + sc.depth1).addClass("open");
							$("#ctg_" + sc.depth2).siblings().removeClass("open");
							if(sc.depth3 != null){
								$("#ctg_" + sc.depth2).addClass("open");
								$("#ctg_" + sc.depth3).siblings().removeClass("open");
								if(sc.depth4 != null){
									$("#ctg_" + sc.depth3).addClass("open");
								}
							}
						}
					}
					
					var H = 45;
					var h1 = 0;
					var h2 = 0;
					var h3 = 0;
					var h4 = 0;
					var u1, u2, u3, u4, c1, c2, c3, c4;
					var u1 = angular.element(".ssws_wrap.ssws_category ul.cate_d1");
					h1 = u1.find(">li").length * H;
					angular.forEach(u1.find(">li"), function(li1, idx1){
						c1 = angular.element(li1);
						u2 = c1.find("ul.cate_d2");
						h2 = 0;
						if(c1.hasClass("open")){
							h2 = u2.find(">li").length * H;
							angular.forEach(u2.find(">li"), function(li2, idx2){
								c2 = angular.element(li2);
								u3 = c2.find("ul.cate_d3");
								h3 = 0;
								if(c2.hasClass("open")){
									h3 = u3.find(">li").length * H;
									angular.forEach(u3.find(">li"), function(li3, idx3){
										c3 = angular.element(li3);
										u4 = c3.find("ul.cate_d4");
										h4 = 0;
										if(c3.hasClass("open")){
											h4 = u4.find(">li").length * H;
										}
										h3 += h4;
										u4.height(h4);
									});
								}
								h2 += h3;
								u3.height(h3);
							});
						}
						h1 += h2;
						u2.height(h2);
					});
					u1.height(h1);
				};*/
				
				/**
				 * 카테고리 펼치기/닫기
				 */
				$scope.categoryAccordian = function(li, ctgNo){
					if(li.hasClass("nochild")){ return; }
					
					var H = 45;
					var ul = li.find("> ul");
					
					/*if(ul.length > 0){
						// 서브카테가 있는 경우
						if(li.hasClass("open")){
							li.removeClass("open");
							ul.height(0);
							ul.find("ul").height(0);
							ul.find("li.open").removeClass("open");
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
					}*/
					
					// 카테고리 선택상태 설정
					if(ctgNo == undefined){ return; }
					var pul = li.parent();
					var depth = 0;
					if(pul.hasClass("cate_d1")){
						//대대카
						$scope.uiStateObj.selectedCategory.depth1 = ctgNo;
						$scope.uiStateObj.selectedCategory.depth2 = null;
						$scope.uiStateObj.selectedCategory.depth3 = null;
						$scope.uiStateObj.selectedCategory.depth4.length = 0;// = null;
						$scope.uiStateObj.selectedCategory.ctgName = [li.data("name")];
					}else if(pul.hasClass("cate_d2")){
						//대카
						$scope.uiStateObj.selectedCategory.depth2 = ctgNo;
						$scope.uiStateObj.selectedCategory.depth3 = null;
						$scope.uiStateObj.selectedCategory.depth4.length = 0;// = null;
						$scope.uiStateObj.selectedCategory.ctgName = [li.data("name")];
						$scope.categoryCheckParent(li);
					}else if(pul.hasClass("cate_d3")){
						//중카
						$scope.uiStateObj.selectedCategory.depth3 = ctgNo;
						$scope.uiStateObj.selectedCategory.depth4.length = 0;// = null;
						$scope.uiStateObj.selectedCategory.ctgName = [li.data("name")];
						$scope.categoryCheckParent(li);
					}else if(pul.hasClass("cate_d4")){
						//소카
						////////////////////////////$scope.uiStateObj.selectedCategory.depth4 = ctgNo;
						$scope.uiStateObj.selectedCategory.depth4 = [ctgNo];
						$scope.uiStateObj.selectedCategory.ctgName = [li.data("name")];
						$scope.categoryCheckParent(li);
						
						/*************************************** 다중선택 가능 선작업
						var d4 = $scope.uiStateObj.selectedCategory.depth4;
						var idx = d4.indexOf(ctgNo);
						if(idx < 0){
							d4.push(ctgNo);
						}else{
							d4.splice(idx, 1);
						}
						
						$scope.uiStateObj.selectedCategory.ctgName = [];
						angular.forEach(pul.find(" > li"), function(itm){
							if(d4.indexOf(angular.element(itm).data("no")+"") >= 0){
								$scope.uiStateObj.selectedCategory.ctgName.push(angular.element(itm).data("name"));
							}
						});
						//$scope.uiStateObj.selectedCategory.ctgName = [li.data("name")];
						$scope.categoryCheckParent(li);
						********************************************/
					}

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
				/*$scope.categoryAccordianParent = function(li){
					var ul = li.parent();
					
					var lis = ul.find("> li");
					var h = 0;
					lis.each(function(idx, itm){
						h += $(itm).height();
					});
					ul.height(h);
					
					if(ul.hasClass("cate_d1")){ return; }
					$scope.categoryAccordianParent(ul.parent());
				}*/
				
				/**
				 * 서브 카테고리(대카) 선택
				 */
				$scope.srhSubCtgPost = function (){
					var ctgNo, depth;
					if($scope.uiStateObj.selectedCategory.depth4.length > 0){// != null){
						ctgNo = $scope.uiStateObj.selectedCategory.depth4.join(",");
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
					
					if(ctgNo == undefined){
						ctgNo = "";
						depth = "";
						//return;
					}
					
					$scope.postParams.ctgNo = ctgNo;
					$scope.postParams.ctgDepth = depth;
					$scope.uiStateObj.srhFilterCtgFlag = true;

					//$scope.srhFilterBrdInit(); //브랜드 초기화
					//$scope.srhFilterDetailInit(); //상세검색 초기화

					//POST
					$scope.postParams.rtnType = "E";//////////////////////////////////////////////////////////////"C";
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
						$scope.uiStateObj.brandArr.push(item);

						angular.forEach($scope.srhResultData.brdLst.items,function(brdItem){
							if(brdItem.brdNo == item.brdNo){
								brdItem.checked = true;
							}
						});
						
						$scope.searchTclick2016("Brand_Clk");
						$scope.ga("브랜드", "선택_" + item.brdName);
					} else {//선택 취소
						var tmpIdx = $scope.postParams.brdNoArr.indexOf(item.brdNo);
						if (tmpIdx > -1) {
							$scope.postParams.brdNoArr.splice(tmpIdx, 1);
							$scope.postParams.brdNmArr.splice(tmpIdx, 1);
							$scope.uiStateObj.brandArr.splice(tmpIdx, 1);

							angular.forEach($scope.srhResultData.brdLst.items,function(brdItem){
								if(brdItem.brdNo == item.brdNo){
									brdItem.checked = false;
								}
							});

							$scope.searchTclick2016("Brand_ClkC");
							$scope.ga("브랜드", "해제_리스트_" + item.brdName);
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
					}
				}

				/**
				 * 브랜드 선택된 목록중 체크 변경
				 */
				$scope.triggerChkBrdPost = function(item){
					if ($scope.postParams.brdNoArr.indexOf(item.brdNo) == -1) {
						$scope.postParams.brdNoArr.push(item.brdNo);
						$scope.postParams.brdNmArr.push(item.brdName);
						$scope.uiStateObj.brandArr.push(item);
					} else {//선택 취소
						var tmpIdx = $scope.postParams.brdNoArr.indexOf(item.brdNo);
						if (tmpIdx > -1) {
							$scope.postParams.brdNoArr.splice(tmpIdx, 1);
							$scope.postParams.brdNmArr.splice(tmpIdx, 1);
							$scope.uiStateObj.brandArr.splice(tmpIdx, 1);
							$scope.searchTclick2016("Brand_ClkCL");
							$scope.ga("브랜드", "해제_요약_" + item.brdName);
						}
					}
					
					for(var i =0; i<$scope.srhResultData.brdLst.items.length; i++){
						var obj = $scope.srhResultData.brdLst.items[i];
						if(obj.brdNo == item.brdNo){
							$scope.srhResultData.brdLst.items[i].checked = null;
							break;
						}
					}
					
					if ($scope.postParams.brdNoArr.length > 0) {//선택된 값이 있을 경우
						$scope.uiStateObj.srhFilterBrdFlag = true;
					} else {
						$scope.uiStateObj.srhFilterBrdFlag = false;
					}

					//POST
					$scope.postParams.rtnType = "E";
					$scope.loadDataParams($scope.postParams.rtnType);
					
				};
				
				/**
				 * 브랜드 리스트 정렬조건 변경
				 */
				$scope.srhFilterBrdSortChange = function (type) {
					// 20161201 박형윤 추가 --
					$scope.srhResultData.brdLst.items = $filter('orderBy')($scope.srhResultData.brdLst.items, $scope.uiStateObj.srhFilterBrdSort);
					$scope.srhResultData.brandList.items = $filter('orderBy')($scope.srhResultData.brandList.items, $scope.uiStateObj.srhFilterBrdSort);

					if (typeof $scope.srhResultData.brdLst.tcnt != "undefined" &&
						$scope.srhResultData.brdLst.tcnt > 0 &&
						typeof $scope.srhResultData.brdLst.items != "undefined") {
						//$scope.srhResultData.brdLstRender = $scope.srhResultData.brdLst.items.slice(0, 50);
						$scope.srhResultData.brdLstRender = $scope.srhResultData.brandList.items;//$scope.srhResultData.brdLst.items;//.slice(0, 50);
					}
					//-- 20161201 박형윤 추가

					if(type == "-cnt"){
						$scope.searchTclick2016("Brand_Soringcnt");
						$scope.ga("브랜드", "상품많은순");
					}else{
						$scope.searchTclick2016("Brand_SoringABC");
						$scope.ga("브랜드", "가나다");
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
				 * 정렬 레이어 보기
				 */
				$scope.showHideSortPop = function(visible){
					$scope.sortLayerPopVisible = visible;
					if(visible){
						$scope.sendTclick($scope.tClickBase + "SrhFilter_Clk_Sorting" );
						$timeout(function(){
							var pop = angular.element("#sortLayerPop .layerPop");
							var t = ($window.innerHeight - pop.height()) / 2;
							pop.css({"top" : t, "opacity" : 1});
						}, 0);
					}else{
						$scope.ga("정렬_닫기", "", "sort");
					}
				};

				/**
				 * Sortting 변경
				 */
				$scope.srhSortPost = function (idx) {
					$scope.uiStateObj.sortTypeIdx = idx;
					$scope.uiStateObj.srhFilterSortFlag = true;
					$scope.showHideSortPop(false);

					$scope.postParams.rtnType = "S";//정렬 조건 타입으로 설정
					$scope.loadDataParams($scope.postParams.rtnType); //결과 조회

					switch (idx) {
						case 0://인기순BEST
							$scope.searchTclick2016("Sorting_Best");
							$scope.ga("인기순", "", "sort");
							break;
						case 1://판매BEST
							$scope.searchTclick2016("Sorting_Sell");
							$scope.ga("판매순", "", "sort");
							break;
						case 2://상품평많은순
							$scope.searchTclick2016("Sorting_Review");
							$scope.ga("상품평많은순", "", "sort");
							break;
						case 3://최근등록순
							$scope.searchTclick2016("Sorting_Recent");
							$scope.ga("최근등록순", "", "sort");
							break;
						case 4://낮은가격순
							$scope.searchTclick2016("Sorting_Lprice");
							$scope.ga("낮은가격순", "", "sort");
							break;
						case 5://높은가격순
							$scope.searchTclick2016("Sorting_Hprice");
							$scope.ga("높은가격순", "", "sort");
							break;
					}
					$win.scrollTop(0);
				};
				
				/**
				 * 신발 사이즈 변경
				 */
				$scope.shoeSizeChaned = function(name){
					var arr = [];
					angular.forEach($scope.srhResultData.shoseSizeLst, function(item){
						if(item.checked && !item.dimm){
							//arr.push(parseInt(item.shoseNm, 10));
							arr.push(item.shoseNm);
						}
					});
					$scope.postParams.shoesSize = arr.join(",");
					$scope.srhDetailPost();
					
					$scope.ga("신발사이즈", name);
				};

				/**
				 * 별점 변경
				 */
				$scope.starPointChanged = function(idx){
					$scope.uiStateObj.starPointIdx = idx;
					$scope.srhDetailPost();
					
					switch (idx) {
					case 0:
						$scope.ga("별점", "전체");
						break;
					/*case 1:
						$scope.ga("별점", "5점");
						break;*/
					case 1:
						$scope.ga("별점", "4점이상");
						break;
					case 2:
						$scope.ga("별점", "3점이상");
						break;
					case 3:
						$scope.ga("별점", "2점미만제외");
						break;
					}
				};
				
				/**
				 * 색상칩 클릭
				 */
				$scope.srhSelectColor = function(item, noload){
					console.log("srhSelectColor")
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
						$scope.searchTclick2016("Color");
						$scope.ga("컬러", item.colorCd);
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


				/**
				 * 스타일 클릭
				 */
				$scope.srhSelectStyle = function(item, noload){
					
					var idx = $scope.postParams.selectedStyle.indexOf(item.feelNo);
					
					if(item.selected === true){
						// 선택 해제
						item.selected = false;
						if(idx >= 0){
							$scope.postParams.selectedStyle.splice(idx, 1);
							// $scope.postParams.selectedStyleNmArr.splice(idx, 1);
						}
						
					}else{
						// 선택
						item.selected = true;
						if(idx < 0){
							$scope.postParams.selectedStyle.push(item.feelNo);
							// $scope.postParams.selectedStyleNmArr.push(item);
						}
					}
					$scope.ga("스타일", item.feelNm);

					if(noload!=="N"){
						$scope.srhDetailSearchActiveChk();//상세검색 활성화 여부 검증
						$scope.srhDetailPost();//상세검색 조회
					}
				};


				/*상세검색 조회*/
				$scope.srhDetailPost = function () {
					$scope.srhDetailSearchActiveChk();
					$scope.postParams.rtnType = "E";//상세검색 조건 타입으로 설정
					$scope.loadDataParams($scope.postParams.rtnType); //결과 조회
				}
				
				
				/*상세검색 조건 변경*/
				$scope.srhDetailChange = function (type){
					//선택한 조건에 따른 tclick 설정
					var tClickStr = "";
					switch (type) {
						case "deptYN"://롯데백화점
							$scope.searchTclick2016("Store_01");
							$scope.ga("매장", "백화점");
							break;
						case "tvhomeYN"://롯데홈쇼핑
							$scope.searchTclick2016("Store_02");
							$scope.ga("매장", "홈쇼핑");
							break;
						case "superYN"://롯데슈퍼
							$scope.searchTclick2016("Store_03");
							$scope.ga("매장", "슈퍼");
							break;
						case "brdstoreYN"://브랜드스토어
							$scope.searchTclick2016("Store_04");
							$scope.ga("매장", "브랜드스토어");
							break;
						
						case "freeDeliYN"://무료배송
							$scope.searchTclick2016("Clk_FreeShipping");
							$scope.ga("배송", "무료배송");
							break;
						case "smpickYN"://스마트픽
							$scope.searchTclick2016("benefit_smartpick");
							break;
						case "freeInstYN"://무이자
							$scope.searchTclick2016("Price_Interest");
							$scope.ga("가격혜택선물포장", "무이자할부");
							break;
						case "pointYN"://포인트
							$scope.searchTclick2016("Price_Point");
							$scope.ga("가격혜택선물포장", "포인트적립");
							break;
						case "pkgYN"://무료포장
							$scope.searchTclick2016("Price_Packing");
							$scope.ga("가격혜택선물포장", "무료선물포장");
							break;
						case "freeGiftYN"://사은품제공
							$scope.searchTclick2016("free_Gift");
							$scope.ga("가격혜택선물포장", "사은품포함");
							break;

						case "delSevenYN"://내 주변픽업
							$scope.searchTclick2016("Shipping_Smartpick_Store");
							$scope.ga("배송", "스마트픽_내주변픽업");
							break;
						case "delTdarYN"://오늘배송
							$scope.searchTclick2016("Shipping_Oneday");
							$scope.ga("배송", "오늘도착");
							break;
						case "delQuickYN"://퀵배송
							$scope.searchTclick2016("Shipping_Quick");
							$scope.ga("배송", "퀵배송");
							break;
						
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
				$scope.srhDetailPriceMaxlen = function(event,type){
					var tf = $("#priceMaxU");
					if(type == "min"){
						tf = $("#priceMinU");
					}
					var str = tf.val();
					
					if(str.length > 10){
						tf.val( str.substr(0, 10) );
					}

					if (event && event.keyCode == 13) {
						$scope.srhDetailPriceValidate(type);
						if($scope.srhDetailPriceValidateFlag){
							tf.blur();
							$scope.srhDetailSearchPrice();
						}
					}
				}
				/**
				 * 상세검색 가격 변경시 가격 검증 가격 검증 실패시 $scope.srhDetailPriceValidateFlag 값 false 처리
				 */
				$scope.srhDetailPriceValidate = function (type) {
					$scope.srhDetailPriceValidateFlag= true;

					if($scope.postParams.priceMinU != null) {
						if($scope.postParams.priceMinU.length > 0) {
							$scope.postParams.priceMinU = $scope.postParams.priceMinU.replace(/[^0-9]/g,'');
						}
					}
					if($scope.postParams.priceMaxU != null) {
						if($scope.postParams.priceMaxU.length > 0) {
							$scope.postParams.priceMaxU = $scope.postParams.priceMaxU.replace(/[^0-9]/g,'');
						}
					}

					var min_type = typeof($scope.postParams.priceMinU);
					var max_type = typeof($scope.postParams.priceMaxU);  
					var min = parseInt($scope.postParams.priceMinUTemp, 10);
					var max = parseInt($scope.postParams.priceMaxUTemp, 10);
					//console.warn(type, $scope.postParams.priceMinU, $scope.postParams.priceMaxU, min, max)
					
					if (type == "min") {
						// CASE 1 : 가격 INPUT에 아무것도 입력 안했을 경우 type이 object로 나옴 - 해당하는 경우 처리해줄 내용 없음
						// CASE 2 : 가격에 최소가로 설정한 값보다 값이 작거나 최대가로 설정한 값보다 값이 큰 경우 type이 undefined로 나옴
						// CASE 3 : 가격에 정상적인 가격이 입력됐을 경우 type이 number로 나옴
						
						if(min_type == "object"){
							// CASE 2 : 검색 최소가로 변경 처리
							//$scope.postParams.priceMinU = min;
							$scope.srhDetailPriceValidateFlag= false;
							//alert("검색결과 내 최저가격보다 낮습니다.");
							return false;
							
						}else{
							if($scope.postParams.priceMinU > max){
								$scope.postParams.priceMinU = min;
								$scope.srhDetailPriceValidateFlag= false;
								alert("검색결과 내 최고가격보다 높습니다.");
								return false;
								
							}else if($scope.postParams.priceMinU < min){
								$scope.postParams.priceMinU = min;
								$scope.srhDetailPriceValidateFlag= false;
								alert("검색결과 내 최저가격보다 낮습니다.");
								return false;
							}
							
							if(max_type == "number" && $scope.postParams.priceMinU > $scope.postParams.priceMaxU){
								var mintemp = $scope.postParams.priceMinU;
								$scope.postParams.priceMinU = $scope.postParams.priceMaxU;
								$scope.postParams.priceMaxU = mintemp;
							}
							
							//초기값과 변경되었는지 확인
							if($scope.postParams.priceMinU != min){
								//$scope.postParams.priceMinUTemp = $scope.postParams.priceMinU;
							}
							//$scope.srhDetailPriceValidateFlag= true;
						}
					
					} else if (type == "max") {
						// CASE 1 : 가격 INPUT에 아무것도 입력 안했을 경우 type이 object로 나옴 - 해당하는 경우 처리해줄 내용 없음
						// CASE 2 : 가격에 최대가로 설정한 값보다 값이 크거나 최소가로 설정한 값보다 값이 작은 경우 type이 undefined로 나옴
						// CASE 3 : 가격에 정상적인 가격이 입력됐을 경우 type이 number로 나옴
						
						if(max_type == "object"){
							//$scope.postParams.priceMaxU = max;
							$scope.srhDetailPriceValidateFlag= false;
							//alert("검색결과 내 최고가격보다 높습니다.");
							return false;
							
						}else{
							if($scope.postParams.priceMaxU < min){
								$scope.postParams.priceMaxU = max;
								$scope.srhDetailPriceValidateFlag= false;
								alert("검색결과 내 최저가격보다 낮습니다.");
								return false;
							}else if($scope.postParams.priceMaxU > max){
								$scope.postParams.priceMaxU = max;
								$scope.srhDetailPriceValidateFlag= false;
								alert("검색결과 내 최고가격보다 높습니다.");
								return false;
							}
							
							if(min_type == "number" && $scope.postParams.priceMinU > $scope.postParams.priceMaxU){
								var mintemp = $scope.postParams.priceMinU;
								$scope.postParams.priceMinU = $scope.postParams.priceMaxU;
								$scope.postParams.priceMaxU = mintemp;
							}
							//초기값과 변경되었는지 확인
							if($scope.postParams.priceMaxU != max){
								//$scope.postParams.priceMaxUTemp = $scope.postParams.priceMaxU;
							}
							//$scope.srhDetailPriceValidateFlag= true;
						}
						
					}
				}
				
				/**
				 * 가격대 검색 버튼 클릭
				 * @param btnClicked 버튼 직접 클릭 여부
				 */
				$scope.srhDetailSearchPrice = function(btnClicked){
					// if (!$scope.srhDetailPriceValidateFlag) { //가격 검증 완료 체크
					// 	$scope.srhDetailPriceValidateFlag = true;
					// 	return false;
					// }
					if(($scope.postParams.priceMinU == 0 && $scope.postParams.priceMaxU == 0) || ($scope.postParams.priceMinUTemp == 0 && $scope.postParams.priceMaxUTemp == 0) ){
						$scope.postParams.priceMinU = 0;
						$scope.postParams.priceMinUTemp = 0;
						$scope.postParams.priceMaxU = 0;
						$scope.postParams.priceMaxUTemp = 0;
						alert("최저, 최대 가격이 존재하지 않습니다.");
						return false;
					}

					$scope.srhDetailPriceValidate("min");
					$scope.srhDetailPriceValidate("max");
					
					$scope.uiStateObj.srhDetailSearchClicked = true;

					if(!$scope.postParams.priceMinU){
						$scope.postParams.priceMinU = $scope.postParams.priceMinUTemp;
					}

					if(!$scope.postParams.priceMaxU){
						$scope.postParams.priceMaxU = $scope.postParams.priceMaxUTemp;
					}

					$scope.uiStateObj.priceMinUTemp= $scope.postParams.priceMinU;
					$scope.uiStateObj.priceMaxUTemp = $scope.postParams.priceMaxU;

					$scope.srhDetailPost(); //상세검색 조회
					
					$scope.searchTclick2016("Price_Clk_Srh_Btn");
					$scope.ga("가격혜택선물포장", "가격검색");
					
				}

				/**
				 * 결과 내 검색 버튼 클릭
				 */
				$scope.srhDetailSearchKeyword = function(from){
					
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
							$scope.searchTclick2016("Clk_IncludeSrh_Btn");
							$scope.ga("결과내검색", "포함단어_" + $scope.postParams.rekeyword);
						}
					}else{
						$scope.addExqueryKeyword($scope.postParams.rekeyword);// 제외단어
						if(!isPopup){
							$scope.searchTclick2016("Clk_ExcludeSrh_Btn");
							$scope.ga("결과내검색", "제외단어_" + $scope.postParams.rekeyword);
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
							$('#rekeyword').blur();
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

					//$scope.searchTclick2016("R", "CLK_del_srhkeywd_Btn");
					$scope.sendTclick("m_RDC_SrhResult_Clk_Kwd_Del");
				};
				
				/**
				 * 재검색 키워드 추가 (포함단어)
				 */
				$scope.addRequeryKeyword = function(keyword, tclick, itemIdx) {
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
							$scope.searchTclick2016("CLK_srhkeywd_smartpick_Btn");
						}else{
							// $scope.searchTclick2016("R", "CLK_srhkeywd_Btn");
							if (itemIdx || itemIdx === 0) {
								$scope.sendTclick("m_RDC_SrhResult_Clk_Srhkwd_idx"+$scope.numberFill((itemIdx + 1), 3));
							} else {
								$scope.sendTclick("m_RDC_SrhResult_Clk_Srhkwd_idx"+$scope.numberFill((idx + 1),3));
							}
						}
					}
					
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
				
				// 포함/제외단어 선택
				$scope.selectKeywordLayer = function(idx){
					$scope.searchUISetting.researchIdx = idx;
				};
				
				$scope.selectKeywordLayer2 = function(){
					$scope.uiStateObj.researchOpt = $scope.uiStateObj.researchCheck ? "brdName" : "-cnt";
					$scope.searchUISetting.researchIdx = $scope.uiStateObj.researchCheck ? 1 : 0;
				};
				
				$scope.showRelatedKWPopup = function(){
					$scope.uiStateObj.relatedKwywordOpenFlag = true;
					$scope.uiStateObj.relatedKeywordEntered = false;
					$scope.actionbarHideFlag = true;
					
					$scope.dimmedOpen({
						target: "relatedKWPopup",
						callback: $scope.hideRelatedKWPopup
					});
					$timeout(function(){
						$("#rekeyword_pop").val("");
						$("#rekeyword_pop").focus();
					}, 50);
					//m_dc_SrhResult_CLK_srhkeywd_add_Btn_ios/and
					//$scope.searchTclick2016("R", "CLK_srhkeywd_add_Btn");
					$scope.sendTclick("m_RDC_SrhResult_Clk_SrhkwdAdd");
				}
				
				$scope.hideRelatedKWPopup = function(){
					$("#rekeyword_pop").blur();
					$scope.actionbarHideFlag = false;
					$scope.uiStateObj.relatedKwywordOpenFlag = false;
					// $scope.scrollToTop();
					$scope.dimmedClose();
				}

				/**
				 * 결과내 검색 조회
				 */
				$scope.srhKeywordPost = function () {
					$scope.srhFilterCtgInit();// 카테고리 초기화
					$scope.srhFilterBrdInit();// 브랜드 초기화
					$scope.srhFilterDetailInit();// 상세검색 초기화
					
					var resarch = $scope.foldable.research;
					$scope.foldable = {};
					if(resarch == "research"){
						$scope.foldable.research = "research"
					}
					$scope.uiStateObj.researchOpt		= "-cnt";
					$scope.uiStateObj.researchCheck		= false;
					$scope.searchUISetting.researchIdx	= 0;
					
					$scope.postParams.rtnType = "K";
					$scope.loadDataParams($scope.postParams.rtnType);// 결과 조회
				}

				/**
				 * 상세검색 가격  input 포커싱
				 */
				$scope.srhFilterDetailPriceFocus = function (target){
					
					var type= "min";
					if(target == "priceMinU"){
						type= "min";
						$scope.postParams.priceMinUFocus = true
					}else if(target == "priceMaxU"){
						type= "max";
						$scope.postParams.priceMaxUFocus = true
					}
				}

				/**
				 * 상세검색 가격 포커싱
				 */
				$scope.srhFilterDetailPriceIpt = function (target){
					angular.element("#" + target).focus();
					var type= "min";
					if(target == "priceMinU"){
						type= "min";
					}else if(target == "priceMaxU"){
						type= "max";
					}
				}
				
				/**
				 * 검색 필터 - 상세검색 초기화
				 */
				$scope.srhFilterDetailInit = function () {
					$scope.uiStateObj.srhFilterDetailFlag = false;

					// 정렬  초기화
					$scope.srhFilterSortInit();

					// 매장 초기화
					$scope.srhFilterStoreInit();

					// 가격대 초기화
					$scope.srhFilterPriceInit();

					// 혜택(무이자,포인트적립) ,사은품 , 선물포장  초기화
					$scope.srhFilterBenefitInit();

					//배송 초기화
					$scope.srhFilterDeliveryInit();

					//칼라 초기화
					$scope.srhFilterColorInit();

					//스타일 초기화
					$scope.srhFilterFeelInit();

					// 신발사이즈
					angular.forEach($scope.srhResultData.shoseSizeLst, function(item){
						item.checked = false;
					});
					$scope.postParams.shoesSize = "";
					
					// 별점
					$scope.postParams.starPoint = "";
					$scope.uiStateObj.starPointIdx = 0;
					angular.forEach($scope.uiStateObj.starPointArr, function(itm){
						itm.dimm = false;
					});
					
					$scope.postParams.pop = "";
					
				}
				
				/**
				 * 초기화 버튼 비활성 체크
				 */
				$scope.checkResetDisabled = function(flag){
					$scope.srhDetailSearchActiveChk();// 상세 선택여부 체크
					return $scope.uiStateObj.srhFilterDetailFlag;
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
								$scope.ga("카테고리", "초기화");
								break;
							case "brand":
								$scope.srhFilterBrdInit(true);
								$scope.ga("브랜드", "초기화");
								break;
							case "sort":
								$scope.srhFilterSortInit(true);
								break;
							case "benefit":
								$scope.srhFilterBenefitInit(true);
								break;
							case "delivery":
								$scope.srhFilterDeliveryInit(true);
								break;
							case "color":
								$scope.srhFilterColorInit(true);
								break;
							case "research":
								$scope.srhFilterRequeryInit(true);
								break;
							case "store":
								$scope.srhFilterStoreInit(true);
								break;
						}
					}else{
						// 전체 초기화
						$scope.srhFilterRequeryInit(true);
						$scope.ga("필터_초기화", "초기화");
					}
					$scope.searchTclick2016("Clk_ini_Btn");
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
					$scope.uiStateObj.selectedCategory.depth4.length = 0;// = null;
					$scope.uiStateObj.selectedCategory.ctgName.length = 0;// = "";
					
					$scope.postParams.ctgNo = "";
					$scope.postParams.ctgDepth = 0;
					
					// reset UI
					var li;
					$(".ssws_wrap.ssws_category li.open").each(function(idx, itm){
						li = $(itm);
						li.removeClass("open");
						li.find(">ul").height(0);
					});
					$(".ssws_wrap.ssws_category .cate_d1").height( 45 * $(".ssws_wrap.ssws_category .cate_d1 > li").length );
					
					//POST
					if(reload === true){
						//$scope.srhFilterBrdInit();// 브랜드 초기화
						//$scope.srhFilterDetailInit();// 상세검색 초기화
						
						$scope.postParams.rtnType = "E";//////////////////////////////////////////////////////////////////////////"C";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				}

				// 브랜드 초기화
				$scope.srhFilterBrdInit = function (reload) {
					$scope.uiStateObj.srhFilterBrdFlag = false;
					$scope.postParams.brdNoArr = [];
					$scope.postParams.brdNmArr = [];
					$scope.uiStateObj.brandArr = [];

					$scope.uiStateObj.srhFilterBrdSort = "-cnt";

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
				
				// 혜택(무이자,포인트적립) ,사은품 , 선물포장  초기화
				$scope.srhFilterBenefitInit = function(reload){
					$scope.postParams.freeInstYN = "N";//무이자
					$scope.postParams.pointYN = "N";//포인트적립
					$scope.postParams.pkgYN = "N"; //선물포장
					$scope.postParams.freeGiftYN = "N";//사은품
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				}
				
				// 배송 초기화
				$scope.srhFilterDeliveryInit = function(reload){
					$scope.postParams.smpickYN = "N"; //스마트픽
					$scope.searchUISetting.smartPickList = false; //백화점 픽업리스트 보여주기 여부
					$scope.postParams.smpickBranchNo = null; //백화점 스마트픽 번호
					$scope.uiStateObj.smpickBranchName = ""; //백화점 선택 스마트픽 이름

					$scope.postParams.delSevenYN = "N"; //내 주변 픽업
					$scope.postParams.freeDeliYN = "N"; //무료배송
					$scope.postParams.delQuickYN = "N"; //퀵배송
					$scope.postParams.delTdarYN = "N"; //오늘 도착

					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};
				
				// 컬러 초기화
				$scope.srhFilterColorInit = function(reload){
					$scope.postParams.selectedColor.length = 0;
					$scope.postParams.selectedColor2.length = 0;
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
					$scope.uiStateObj.srhDetailSearchClicked = false;
					$scope.postParams.priceMinU = null;
					$scope.postParams.priceMaxU = null;
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};
				// 결과 내 검색 초기화
				$scope.srhFilterResearchInit = function(reload){
					$scope.postParams.reQuery.length = 0;
					$scope.postParams.exQuery.length = 0;
					$scope.postParams.rekeyword = "";
					$scope.uiStateObj.researchCheck = false;
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};
				
				// 전체 초기화
				$scope.srhFilterRequeryInit = function(reload){
					
					$scope.srhFilterCtgInit();
					$scope.srhFilterBrdInit();
					$scope.srhFilterDetailInit();
					//결과 내 검색
					$scope.srhFilterResearchInit()	
					
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
				
				// 스타일 초기화
				$scope.srhFilterFeelInit = function(reload){
					$scope.postParams.selectedStyle.length = 0;
					//$scope.postParams.selectedStyleNmArr.length = 0;
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};

				$scope.scrollToTop = function(){
					var st = $(window).scrollTop();
					if(st > 1){
						$(window).scrollTop(1);
					}
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
					
					//$scope.sendTclick($scope.tClickBase + "SrhResult_Clk_Review");
					$scope.sendTclick("m_RDC_SrhResult_Clk_Review");
					
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
					//var path = $scope.getProductViewUrl($scope.reviewPopData, $scope.tClickBase + "RVPopLayer_Clk_Btn_Clk");
					//location.href = path;
					location.href = LotteCommon.productSubComment +"?"+ $scope.baseParam + "&goods_no="+$scope.reviewPopData.goodsNo+"&tclick=m_RDC_RVPopLayer_Clk_Btn";
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
				
				/**
				 * 카테고리 필터 전체 버튼 활성/비활성
				 */
				$scope.checkCategoryAllBtn = function(){
					if(angular.element('.ssws_category li.selected').length == 0){
						return true;
					}
					return false;
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
            templateUrl : '/lotte/resources_dev/search/search_list_recommend.html',
			replace : true,
			link : function ($scope, el, attrs) {
				// 실시간 맞춤 추천 상품 레코벨 조회
				//링크 이동 : 티클릭조함
                $scope.gotoLinkM = function(link, tclick_b, infoFlag, item){
					var tclick = "m_RDC_SrhResult_Clk_RecPrd_idx" + tclick_b;
					
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
                    //var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/s001?size=30&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&st="+$scope.postParams.keyword;
					var viewSaleBestLink = LotteCommon.rec_search + "&size=30&st="+$scope.postParams.keyword;
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

	commProduct.directive("demoDirective",['$rootScope','$window', '$parse', '$http' , '$log', 'LotteCommon', 'LotteUtil', function ($rootScope , $window, $parse,$http,$log,LotteCommon, LotteUtil) {
		return {
			replace : true,
			link : function($scope, el, attrs) {
				// console.log($scope)
				// console.log(angular.element(el).find("li"));
			}
		}
	}]);

	app.filter('superCutTxt', function(){
		return function (txt) {
			return txt.substring(0, 12);
		}
	});

})(window, window.angular);