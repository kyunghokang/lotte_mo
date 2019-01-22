(function(window, angular, undefined) {
	'use strict';

	var cateSideSearchModule = angular.module('cateSideSearch', [
        'lotteComm'        
    ]);
    
	cateSideSearchModule.controller('CateSideSearchCtrl', ["$scope", "LotteCommon", function ($scope, LotteCommon) {
		
	}]);

	cateSideSearchModule.directive('cateSideSearch',
			['LotteCommon', 'LotteUtil', 'LotteStorage' ,'$window', '$timeout', '$http', '$location', 'commInitData',
			function (LotteCommon, LotteUtil, LotteStorage, $window, $timeout, $http, $location, commInitData) {
        return {
            templateUrl : '/lotte/resources_dev/category/m/cate_side_search.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
        		$scope.templateType = "list";
        		$scope.isShowLoading = false;// Ajax 로드 Flag 초기화
        		$scope.productListLoading = false;
        		$scope.searchTermsLoading = false;
        		$scope.searchTermsChanged = false;
        		$scope.productMoreScroll = true;
        		$scope.tipShow = false; //툴팁
        		$scope.cateProdYn = false; // new_prod_list 여부
				
				if(LotteCommon.cateProdListUrl.indexOf(window.location.pathname) >= 0){// new_prod_list 일시
					$scope.cateProdYn = true;
				}
        		/**
        		 * Object 정의
        		 */
        		$scope.uiStateObj = { /*UI 상태값 저장*/
        			templateType: 'list', /* 초기 템플릿 타입 */
        			initFlag : true, /*최초 Flag*/
        			srhFilterSelectedIdx : -1, /*검색 필터 탭 활성화 인덱스*/
        			srhFilterCtgDepth1CtgNo : "", /*선택된 대대카 카테고리 No*/
        			srhFilterCtgDepth : 0, /*검색 필터 - 카테고리 활성화 depth*/
        			srhFilterCtgFlag : false, /*검색필터 - 카테고리탭 조건 선택 여부*/
        			srhFilterBrdFlag : false, /*검색필터 - 브랜드탭 조건 선택 여부*/
        			srhFilterBrdSort : "brdName", /*검색필터 - 브랜드탭 Sortting brdName / -cnt 값*/
        			srhFilterDetailFlag : false, /*검색필터 - 상세검색 조건 선택 여부*/
        			//srhFilterDetailArr : ["deptYN", "tvhomeYN", "smpickYN", "brdstoreYN", "superYN", "bookYN", "freeDeliYN", "freeInstYN", "pointYN"], /*검색픽터 - 상세검색 체크 갯수 여부를 체크하기 위한 전체 탭 배열*/
        			//srhFilterDetailArr : ["deptYN", "smpickYN", "freeDeliYN", "freeInstYN", "pointYN"], /*검색픽터 - 상세검색 체크 갯수 여부를 체크하기 위한 전체 탭 배열*/
        			srhFilterDetailArr : ["smpickYN", "freeDeliYN", "freeInstYN", "pointYN","isCrsPickYn", "isDlvToday", "isDlvQuick"], /*검색픽터 - 상세검색 체크 갯수 여부를 체크하기 위한 전체 탭 배열*/
        			srhFilterSortFlag : false, /*검색필터 - Sortting 탭 조건 선택 여부*/
        			sortTypeIdx : 0, /*검색필터 - Sortting 타입 Index*/
        			sortTypeArr : [ /*검색필터 - Sortting Label 과 Value 배열*/
        				//{label : "인기 BEST", shortLabel : "인기순", value : "RANK,1" },
        				{label : "판매 BEST", shortLabel : "판매순", value : "TOT_ORD_CNT,1" },
        				{label : "상품평 많은순", shortLabel : "상품평", value : "TOT_REVIEW_CNT,1" },
        				{label : "최근등록순", shortLabel : "최근등록", value : "DATE,1" },
        				{label : "낮은가격순", shortLabel : "낮은가격", value : "DISP_PRICE,0" },
        				{label : "높은가격순", shortLabel : "높은가격", value : "DISP_PRICE,1" }
        			],
        			sortTypeArrNewProd : [ /*검색필터 - Sortting Label 과 Value 배열*/
        				//{label : "인기 BEST", shortLabel : "인기순", value : "RANK,1" },
        				{label : "판매 BEST", shortLabel : "판매순", value : "TOT_ORD_CNT,1", shortIdx : 0 },/* shortIdx 파라미터 순서 */
        				{label : "상품평 많은순", shortLabel : "상품평", value : "TOT_REVIEW_CNT,1", shortIdx : 1 },
        				{label : "MD 추천순", shortLabel : "MD 추천", value : "EXT_CHAR_FT3,0/TOT_ORD_CNT,1/DATE,1", shortIdx : 5 },
        				{label : "최근등록순", shortLabel : "최근등록", value : "DATE,1", shortIdx : 2 },
        				{label : "낮은가격순", shortLabel : "낮은가격", value : "DISP_PRICE,0", shortIdx : 3 },
        				{label : "높은가격순", shortLabel : "높은가격", value : "DISP_PRICE,1", shortIdx : 4 }
        			],
        			priceMinUFocus : false, /*검색필터 - 상세검색 최소가 input box focus여부*/
        			priceMaxUFocus : false, /*검색필터 - 상세검색 최대가 input box focus여부*/
        			emptyResult : false, /*검색 결과가 없는지에 대한 Flag*/
        			emptyKeyword : false, /*검색 키워드가 없는지에 대한 Flag*/
        			emptyPrdLstFlag : false, /*검색된 상품이 없는지에 대한 Flag*/
        			ajaxPageEndFlag : false, /*마지막 페이지까지 로드 됐는지에 대한 Flag*/
        			smpickLayerOpenFlag : false, /*스마트픽 지점 레이어 Open 여부*/
        			smpickBranchName : "전체", /*검색필터 - 상세검색 - 스마트픽 셀렉트박스 label*/
        			
        			//relatedKwywordOpenFlag	: false,//결과내 검색 팝업 표시여부
        			//relatedKeywordEntered	: false,//결과내 검색 팝업 텍스트입력중 
        			relatedKeywordNotEmpty	: true,//연관키워드 존재여부
        			relatedKeywordEnabled	: true,//연관키워드 영역 표시 여부
        			detailSearchDataLoaded	: false,//상세설정 데이터 로드 상태
        			selectedCategory		:{
        				depth1:[],//null
        				depth2:[],//null
        				depth3:[],//null
        				depth4:[],//null
        				depth5:[],//null
        				//depth6:[],//null
        				ctgName:[]//""
        			},
        			
        			currentPageType : "C"// 현재 페이지 C 카테고리, B 브랜드, S 전문관
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
        			showCSBalloon		: false,
        			
        			smartPickSub		:true,
        			smartPickList		:false
        		};
        		
        		$scope.URLs = {
        			searchList		: LotteCommon.cateListData2016,// 검색결과 데이터
        			searchTerm		: LotteCommon.cateTermData2016,//상세검색
        			
        			subPageCate			: LotteCommon.cateProdListUrl,//카테고리 바닥페이지
        			subPageBrand		: LotteCommon.brandShopSubUrl,//브랜드 바닥페이지
        			subPageSpecial		: LotteCommon.mallSubUrl//전문관 바닥페이지
        		};
        		
        		$scope.postParams = { /*전송 데이터 저장 Input Param*/
    				rtnType : "", /*조회 구분값 - P : 페이징, S : 정렬, D : 상세검색, T : 삭세검색 조건 활성화 여부 조회, B : 브랜드, C : 카테고리, 없음 - 전체*/
    				keyword : "", /*검색어*/
    				orgKeyword : "",
    				//imgListGbn : "L", /*이미지 사이즈 여부*/
    				dpml_no : "1", /*몰 구분 (고정값 닷컴 1)*/
    				dispCnt : 30, /*한페이지에 보여질 리스트 갯수*/
    				page : 1, /*페이지 Number*/

    				ctgNo : "", /*조회 카테고리 dispNo*/
    				ctgDepth : 0, /*대대카  : 0, 대카 :1*/
    				brdNoArr : [],//조회 브랜드 brandNo 배열
    				brdNmArr : [],//조회 브랜드 brandName 배열

    				sort : $scope.uiStateObj.sortTypeArr[0].value, /*정렬 타입*/

    				deptYN : "N", /*상세검색 - 롯데백화점여부*/
    				//tvhomeYN : "N", /*상세검색 - 롯데홈쇼핑 여부*/
    				smpickYN : "N", /*상세검색 - 스마트픽 여부*/
    				smpBranchNo : "", /*상세검색 - 스마트픽 지점 번호*/
    				//brdstoreYN : "N", /*상세검색 - 브랜드스토어 여부*/
    				//superYN : "N", /*상세검색 - 슈퍼 여부*/

    				freeDeliYN : "N", /*상세검색 - 무료배송 여부*/
    				freeInstYN : "N", /*상세검색 - 무이자 여부*/
    				pointYN : "N", /*상세검색 - 포인트 여부*/
    				
    				isCrsPickYn : "N",//세븐일레븐
    				isDlvToday : "N",//오늘도착
    				isDlvQuick : "N",//퀵배송
    				
    				selectedColor : [],

    				rekeyword : "",// 상세검색 - 결과내 검색어
    				reQuery   : [],// 결과 내 검색 (포함단어)
    				exQuery   : [],// 결과 내 검색 (제외단어)

    				priceMinU : null, /*상세검색 - 최소가*/
    				priceMaxU : null, /*상세검색 - 최대가*/

    				brdNm: "", // 201603 모바일 리뉴얼 추가 Parameter
					mGrpNo: "",
	        		upBrdNo: "",
	        		cateNo: "",
	        		cateDepth: ""
    			};

        		$scope.srhResultData = {}; /*검색 결과*/
        		//$scope.prdDealList = [];

        		$scope.srhDetailData = { /*상세 검색 활성화 여부*/
        			srhTerms : {
        				dept : false, /*롯데백화점 활성화 여부*/
        				tvhome : false, /*롯데홈쇼핑 활성화 여부*/
        				smpick : false, /*스마트픽 활성화 여부*/
        				smpickBranch : [], /*스마트픽 지점 리스트*/
        				brdstore : false, /*브랜드스토어 활성화 여부*/
        				super : false, /*슈퍼 활성화 여부*/
        				seven: false, //세븐일레븐
        				tdar: false,//오늘도착
        				quick: false//퀵배송
        			},
        			srhColorList:[]
        		};

        		/*페이지 인입시 처리*/
        		//$scope.postParams.keyword = decodeURIComponent(commInitData.query.keyword); /*URL Params 얻어오기 (keyword)*/
        		//$scope.postParams.keyword = LotteUtil.replaceAll($scope.postParams.keyword, "+" ," ");
        		$scope.postParams.keyword = "";
        		$scope.postParams.orgKeyword = "";//$scope.postParams.keyword;
        		//$scope.postParams.ctgNo = commInitData.query.cateNo; /*URL Params 얻어오기 (ctgNo)*/
        		
        		if(commInitData.query["cateNo"] != undefined){
        			$scope.postParams.cateNo = commInitData.query["cateNo"];
        		}
        		if(commInitData.query["mGrpNo"] != undefined){
        			$scope.postParams.mGrpNo = commInitData.query["mGrpNo"];
        		}
        		if(commInitData.query["upBrdNo"] != undefined){
        			$scope.postParams.upBrdNo = commInitData.query["upBrdNo"];
        		}
        		if(commInitData.query["cateDepth"] != undefined){
        			$scope.postParams.cateDepth = commInitData.query["cateDepth"];
        		}
        		
        		if(commInitData.query["sort"] != undefined){
        			var qsort = parseInt(commInitData.query["sort"], 10);
        			if(!isNaN(qsort)){
						
        				if(!$scope.cateProdYn && qsort >= 0 && qsort <= 4){
        					$scope.uiStateObj.sortTypeIdx = qsort;
        					$scope.postParams.sort = $scope.uiStateObj.sortTypeArr[qsort].value;
        				}						
        				if($scope.cateProdYn && qsort >= 0 && qsort <= 5){
							if($scope.cateProdYn){// new_prod_list 일시
								$scope.uiStateObj.sortTypeIdx = qsort;
								$scope.postParams.sort = $scope.uiStateObj.sortTypeArrNewProd[qsort].value;
								if(qsort >= 2 && qsort <5){
									$scope.postParams.sort = $scope.uiStateObj.sortTypeArrNewProd[qsort+1].value;
									$scope.uiStateObj.sortTypeIdx =	qsort+1;
								}
								if(qsort == 5){
									$scope.postParams.sort = $scope.uiStateObj.sortTypeArrNewProd[2].value;
									$scope.uiStateObj.sortTypeIdx =	2;
								}
							}
        				}
        			}
        		}

        		/*if ($scope.postParams.ctgNo) { 레이어 검색에서 카테고리 정보가 넘어왔을 경우 해당 State로 맞춰주기
        			$scope.uiStateObj.srhFilterCtgDepth1CtgNo = $scope.postParams.ctgNo;
        			$scope.uiStateObj.srhFilterCtgDepth = 1;
        			$scope.uiStateObj.srhFilterCtgFlag = true;
        		}*/
        		
        		
        		/**
        		 * 현재 페이지 구분
        		 */
        		function checkCurrentPage(){
        			var path = $location.absUrl();
        			if(path.indexOf($scope.URLs.subPageBrand) >= 0){
        				$scope.uiStateObj.currentPageType = "B";//브랜드
        			}else if(path.indexOf($scope.URLs.subPageSpecial) >= 0){
        				$scope.uiStateObj.currentPageType = "S";//전문관
        			}
        		}

        		
        		/**
        		 * 앱 호출
        		 */
        		/*$scope.callAppAPI = function(param){
        		}*/
                
        		/**
        		 * 상품 유닛 타입 변경
        		 */
                $scope.changeTemplate = function(type){
                	$scope.templateType = type;
                	LotteStorage.setLocalStorage($scope.screenID+'TemplateTypeDC', type);
                	
                	switch(type){
	                	case "list":
	                		$scope.searchTclick2016("C", "Clk_Pcto1");
	                		break;
	                	case "image":
	                		$scope.searchTclick2016("C", "Clk_Pcto2");
	                		break;
	                	case "swipe":
	                		$scope.searchTclick2016("C", "Clk_Pcto3");
	                		break;
                	}
                };
                
                /**
                 * 상품 유닛 타입 스토리지에서 복원
                 */
                $scope.retriveTemplateType = function(){
                	var template = LotteStorage.getLocalStorage($scope.screenID+'TemplateTypeDC');
                	if(!(template == "image" || template == "swipe")){
                		template = "list";
                	}
                	$scope.templateType = template;
                	//$timeout(function(){ $(".unitWrap").css("opacity", 1); }, 300);
                };
                
                /**
                 * 스크롤 시에 다음페이지 불러오기
                 */
        		$scope.loadMoreData = function() {
        			if($(window).height() == $(document).height()){ return; }// 레이어 딤드 상태 예외처리
        			
        			$scope.postParams.rtnType = "P";// 조회 구분값 P : 페이징으로 설정
        			$scope.loadDataParams($scope.postParams.rtnType);//결과값 조회
        		}

        		/**
        		 * 검색 데이터 타입별 Parameter 생성
        		 * @param type 데이터 타입
        		 * @param nolist 리스트 로드 방지
        		 */
        		$scope.loadDataParams = function (type, nolist){
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
        					loadParam.page = ++$scope.postParams.page;// 페이지
        				case "S" :// 정렬
        					loadParam.sort = $scope.postParams.sort;
        				case "E" :// 상세 검색
        				//case "T" :// 상세 검색 조건 활성화 여부
        				//case "B" :// 브랜드 선택 검색
        				//case "C" :// 카테고리 선택 검색
        				//case "K":// 키워드 변경
        				//default :// 기본
        					/*if ($scope.postParams.rekeyword != "") {
        						// 결과내 검색 키워드
        						$scope.postParams.keyword +=  encodeURIComponent(" " + $scope.postParams.rekeyword);
        						$scope.postParams.orgKeyword = $scope.postParams.keyword; //20160119 조건검색시 세션스토리지 저장 관련 수정 
        						$scope.postParams.rekeyword = "";// 결과내 검색 키워드 초기화

        						// 결과내 검색 키워드가 있을 경우 상세조건 비활성화 오류 방지를 위하여 '매장조건' 초기화
        						$scope.postParams.deptYN = "N";
        						//$scope.postParams.tvhomeYN = "N";
        						//$scope.postParams.superYN = "N";
        						//$scope.postParams.brdstoreYN = "N";
        						$scope.postParams.smpickYN = "N";
        						// $scope.postParams.bookYN = "N";
        					}*/

        					if ($scope.postParams.deptYN == "Y") { /*롯데백화점 조건 선택 여부*/
        						loadParam.deptYN = $scope.postParams.deptYN;
        					}

        					/*if ($scope.postParams.tvhomeYN == "Y") { 롯데홈쇼핑 조건 선택 여부
        						loadParam.tvhomeYN = $scope.postParams.tvhomeYN;
        					}*/

        					if ($scope.postParams.smpickYN == "Y") { /*스마트픽 조건 선택 여부*/
        						loadParam.smpickYN = $scope.postParams.smpickYN;
        					}

        					if ($scope.postParams.smpickYN == "Y" && $scope.postParams.smpBranchNo != "") { /*스마트픽 지점 번호 여부*/
        						loadParam.smpBranchNo = $scope.postParams.smpBranchNo;
        					}

        					/*if ($scope.postParams.brdstoreYN == "Y") { 브랜드스토어 조건 선택 여부
        						loadParam.brdstoreYN = $scope.postParams.brdstoreYN;
        					}*/

        					/*if ($scope.postParams.superYN == "Y") { 롯데슈퍼 조건 선택 여부
        						loadParam.superYN = $scope.postParams.superYN;
        					}*/

        					if ($scope.postParams.freeDeliYN == "Y") { /*무료배송 조건 선택 여부*/
        						loadParam.freeDeliYN = $scope.postParams.freeDeliYN;
        					}

        					if ($scope.postParams.freeInstYN == "Y") { /*무이자 조건 선택 여부*/
        						loadParam.freeInstYN = $scope.postParams.freeInstYN;
        					}

        					if ($scope.postParams.pointYN == "Y") { /*포인트 조건 선택 여부*/
        						loadParam.pointYN = $scope.postParams.pointYN;
        					}
        					
        					if($scope.postParams.isCrsPickYn == "Y"){// 세븐일레븐
        						loadParam.isCrsPickYn = "Y";
        					}

        					if($scope.postParams.isDlvToday == "Y"){// 오늘배송
        						loadParam.isDlvToday = "Y";
        					}

        					if($scope.postParams.isDlvQuick == "Y"){// 퀵배송
        						loadParam.isDlvQuick = "Y";
        					}

        					if($scope.postParams.priceMinU != undefined){
        						loadParam.priceMinU = $scope.postParams.priceMinU;
        					}
        					if($scope.postParams.priceMaxU != undefined){
        						loadParam.priceMaxU = $scope.postParams.priceMaxU;
        					}
        					/*if ($scope.postParams.priceMinU && $scope.postParams.priceMinU >= $scope.srhResultData.price.min) {//최소가 조건 선택 여부
        						loadParam.priceMinU = $scope.postParams.priceMinU;
        					}

        					if ($scope.postParams.priceMaxU && $scope.postParams.priceMaxU <= $scope.srhResultData.price.max) {//최대가 조건 선택 여부
        						loadParam.priceMaxU = $scope.postParams.priceMaxU;
        					}*/
        					
        					loadParam.colorCd = $scope.postParams.selectedColor.join(",");/* colors */
        				//case "T" :// 상세 검색 조건 활성화 여부
        				//case "B" :// 브랜드 선택 검색
        					if ($scope.postParams.brdNoArr && $scope.postParams.brdNoArr.length > 0) { /*선택된 브랜드가 있는지 판단*/
        						loadParam.brdNo = $scope.postParams.brdNoArr.join(); /*Array 형태로 넘어가는데 개발쪽과 협의 필요*/
        					}
        				case "C" :// 카테고리 선택 검색
        				case "K":// 키워드 변경
        				default :// 기본
        					if($scope.postParams.ctgNo) {// 선택된 카테고리가 있는지 판단
        						loadParam.ctgNo = $scope.postParams.ctgNo;
        						//$scope.postParams.ctgNo = null;
        					}
        					if($scope.postParams.dsCtgDepth){
        						loadParam.dsCtgDepth = $scope.postParams.dsCtgDepth;
        						//$scope.postParams.dsCtgDepth = null;
        					}

        					////////$scope.postParams.ctgNo = ctgno;
        					////////$scope.postParams.dsCtgDepth = depth;

        					//if ($scope.postParams.ctgNo && $scope.postParams.ctgDepth >= 0 && $scope.postParams.ctgDepth <= 1) {// 선택된 카테고리 depth가 정상적인지 판단
        					/*if ($scope.postParams.ctgNo && $scope.postParams.ctgDepth >= 0 && $scope.postParams.ctgDepth <= 3) {// 선택된 카테고리 depth가 정상적인지 판단
        						loadParam.ctgDepth = $scope.postParams.ctgDepth;
        						loadParam.dsCtgDepth = $scope.postParams.ctgDepth + 1;
        					}*/
        					if($scope.postParams.ctgDepth1 != ""){ loadParam.ctgDepth1 = $scope.postParams.ctgDepth1; }
        					if($scope.postParams.ctgDepth2 != ""){ loadParam.ctgDepth2 = $scope.postParams.ctgDepth2; }
        					if($scope.postParams.ctgDepth3 != ""){ loadParam.ctgDepth3 = $scope.postParams.ctgDepth3; }
        					if($scope.postParams.ctgDepth4 != ""){ loadParam.ctgDepth4 = $scope.postParams.ctgDepth4; }
        					if($scope.postParams.ctgDepth5 != ""){ loadParam.ctgDepth5 = $scope.postParams.ctgDepth5; }
        					/*loadParam.ctgDepth2 = $scope.postParams.ctgDepth2;
        					loadParam.ctgDepth3 = $scope.postParams.ctgDepth3;
        					loadParam.ctgDepth4 = $scope.postParams.ctgDepth4;
        					loadParam.ctgDepth5 = $scope.postParams.ctgDepth5;*/
        					//loadParam.ctgDepth6 = $scope.postParams.ctgDepth6;
        					/*if($scope.postParams.ctgDepth2 != ""){
        						loadParam.dsCtgDepth = $scope.postParams.ctgDepth2;
        					}*/

        					loadParam.rtnType = type;// 요청 구분
        					loadParam.keyword = "";// + $scope.postParams.keyword;// 검색 키워드
        					var spacer = "";//(loadParam.keyword == "") ? "" : " ";
        					var requery = "" + $scope.postParams.reQuery.join(" ");
        					loadParam.keyword = requery;
        					/*if(requery != ""){
        						loadParam.keyword += spacer + requery;
        					}*/
        					spacer = (loadParam.keyword == "") ? "" : " ";
        					var exquery = "" + $scope.postParams.exQuery.join(" !");
        					if(exquery != ""){
        						loadParam.keyword += spacer + "!" + exquery;
        					}
        					//loadParam.reQuery = "";// 결과내 검색 (포함)
        					//loadParam.exQuery = "";// 결과내 검색 (제외)
        					//loadParam.reQuery = "" + decodeURI($scope.postParams.reQuery.join(","));// 결과내 검색 (포함)
        					//loadParam.exQuery = "" + decodeURI($scope.postParams.exQuery.join(","));// 결과내 검색 (제외)
        					loadParam.sort = $scope.postParams.sort;// 정렬 기준
        					break;
        			}
        			
        			if($scope.postParams.mGrpNo != ""){
        				loadParam.mGrpNo = $scope.postParams.mGrpNo;
        			}
        			if($scope.postParams.upBrdNo != ""){
        				loadParam.upBrdNo = $scope.postParams.upBrdNo;
        			}
        			// 상품상세에서 mGrpNo 없이 넘어올 경우
        			if($scope.uiStateObj.currentPageType == "C"){
	        			if($scope.postParams.mGrpNo == "" && commInitData.query['disp_no'] != undefined){
	        				loadParam.cateNo = commInitData.query['disp_no'];
	        			}
        			}
        			if($scope.uiStateObj.currentPageType == "S"){
        				loadParam.cateNo = $scope.postParams.cateNo;
        				if($scope.postParams.dsCtgDepth == null){
        					loadParam.dsCtgDepth = $scope.postParams.cateDepth;
        				}
        			}
        			
        			loadParam.pageType = $scope.uiStateObj.currentPageType;
        			

        			// 201603 모바일 리뉴얼 추가 - 박형윤
        			if ($scope.postParams.brdNm && $scope.postParams.brdNm != "") {
        				loadParam.brdNm = $scope.postParams.brdNm;
        			}
        			
        			switch(type){
        				case "S":// 정렬
        				case "P":// 페이징
        					break;
        				case "E":// 상세검색
        					// 검색조건 호출 안함
        					break;
        				//case "C":// 카테고리
        					// 대중소카만 검색조건 호출(대대 호출안함)
        					//if(loadParam.ctgDepth >= 1){
        						//$scope.loadTermData(loadParam);
        					//}
        					//break;
        				default:
        					$scope.loadTermData(loadParam);
        					loadParam.loadTerm = true;
        					break;
        			}
        			
        			if(nolist !== true){
        				$scope.loadListData(loadParam);
        			}
        			
        			$scope.searchTermsChanged = true;
        		};
        		
        		/**
        		 * 색상 선택 상태 업데이트
        		 */
        		function updateColors(colors){
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
        		};

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
        					//imgListGbn : "L",
        					dpml_no : "1",
        					dispCnt : 30,
        					page : 1
        				}, params),
        				loadURL = $scope.URLs.searchTerm;

        			if ($scope.postParams.brdNm) {
        				postParams.brdNm = $scope.postParams.brdNm;
        			}

        			/*if (!postParams.keyword) {// 검색어가 없을 경우 AJAX 호출 방지
        				$scope.noKeyword();
        				return false;
        			}*/
        			
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
        		};

        		/*$scope.addRelatedKeyword = function(item, unshift){
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
        		};*/
        		
        		/**
        		 * 상세검색 조건 데이터 로드 성공
        		 */
        		$scope.termDataLoadComplete = function($data){
        			if($data.max != undefined){
        				$data = $data.max;
        			}
        			if($data.resultCode){//결과 코드가 있을 경우에만 처리
        				
        				if($data.resultCode == "0000"){//검색결과 있음
        					var i, len;
        					
        					/*if ($data.isVoice == "Y" || $data.isVoice == "T" && $data.keyword && $data.keyword != "" && $data.sortType && $data.sortType != "") {
        						//$scope.postParams.keyword = $data.keyword;
        						$scope.postParams.sort = $data.sortType;
        		
        						for (i = 0; i < $scope.uiStateObj.sortTypeArr.length; i++) {
        							if ($scope.uiStateObj.sortTypeArr[i].value == $scope.postParams.sort) {
        								$scope.uiStateObj.sortTypeIdx = i;
        							}
        						}
        					}*/
        					
        					switch($scope.postParams.rtnType){
        						case "":
        							// 키워드
        							$scope.srhResultData.keyword = $data.keyword;
        							$scope.postParams.keyword = $data.keyword;
        							
        						case "K":
        							// 재검색어
        							if($data.ctgLst != undefined){
        								$scope.srhResultData.ctgLst = $data.ctgLst;// 카테고리 리스트
        								if($scope.uiStateObj.currentPageType == "C"){
        									modifyCategories();// 중카 노출하지 않고, 대카에 데이터 매핑
        								}
        							}
        							
        						case "C" :// 카테고리
        							// 서브카테 추가하기
        							if($data.subCtgLst != undefined){
        			        			if($scope.postParams.dsCtgDepth >= 2){
        			        				appendSubCategory($scope.srhResultData.ctgLst, $data.subCtgLst);
        			        			}
        								
        							}
        							
        						case "E":// 기타 상세
        						default:
        							// 브랜드
        							$scope.srhResultData.brdLst = $data.brdLst;// 브랜드 리스트
        				
        							if (typeof $scope.srhResultData.brdLst.tcnt != "undefined" &&
        								$scope.srhResultData.brdLst.tcnt > 0 &&
        								typeof $scope.srhResultData.brdLst.items != "undefined") {
        								angular.forEach($scope.srhResultData.brdLst.items, function (item, index) {
        									$scope.srhResultData.brdLst.items[index].cnt = parseInt(item.cnt);
        								});
        							}
        								
        							// 혜택 - 스마트픽
        							$scope.srhDetailData.srhTerms.smpick = $data.smpick == "1" ? true : false;
        							$scope.srhDetailData.srhTerms.smpickBranch = $data.smpickBranch;
        							
        							// 컬러
        							updateColors($data.colors);
        							
        							// 가격대
        							//$scope.srhResultData.price = $data.price;
        							
        							// 매장
        							$scope.srhDetailData.srhTerms.dept = $data.store.dept == "1" ? true : false;
        							$scope.srhDetailData.srhTerms.super = $data.store.super == "1" ? true : false;
        							$scope.srhDetailData.srhTerms.tvhome = $data.store.tvhome == "1" ? true : false;
        							$scope.srhDetailData.srhTerms.brdstore = $data.store.brdstore == "1" ? true : false;
        							$scope.srhDetailData.srhTerms.seven = $data.deliver.smpSeven == "1" ? true : false;
        							$scope.srhDetailData.srhTerms.tdar = $data.deliver.tdar == "1" ? true : false;
        							$scope.srhDetailData.srhTerms.quick = $data.deliver.quick == "1" ? true : false;
        					}
        		
        					
        					$scope.uiStateObj.detailSearchDataLoaded = true;// 데이터 로드 완료, 상세검색 UI활성화
        					
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
        		
        		/**
        		 * 카테고리 데이터 가공
        		 * 중카 노출하지 않고, 대카에 데이터 매핑
        		 */
        		function modifyCategories(){
        			if($scope.srhResultData.ctgLst == undefined || $scope.srhResultData.ctgLst.items == undefined){ return; }
        			
        			var sub;
    				angular.forEach($scope.srhResultData.ctgLst.items, function(ctg){
    					if(ctg.subCtgLst == undefined || ctg.subCtgLst.items == undefined){ return; }
    					if(ctg.subCtgLst.items.length == 1){
    						sub = ctg.subCtgLst.items[0];
    						ctg.ctgNo = sub.ctgNo;
    						ctg.depthMod = true;
    						delete ctg.subCtgLst;
    					}
    				});
        		};
        		
        		/**
        		 * 서브카테 찾아서 추가하기
        		 * @param ctgLst 카테고리 리스트 데이터
        		 * @param subCtgLst 서브카테고리 데이터
        		 */
        		function appendSubCategory(ctgLst, subCtgLst){
        			if(ctgLst == undefined || ctgLst.items == undefined){ return; }
        			
    				if(subCtgLst.items != undefined && subCtgLst.items.length > 0){
    					// 서브카테 있을경우
    					var current = subCtgLst.items[0];
    					if(current == undefined){ return; }
    					
    					var ctgNo = current.ctgNo;
    					if(current.subCtgLst == undefined || current.subCtgLst.items == undefined || current.subCtgLst.items.length == 0){
    						// 서브카테 없음
    						angular.element("#ctg_" + ctgNo).addClass("nochild");
    						
    					}else{
    						// 서브카테 존재
        					var len = ctgLst.items.length;
        					var ctg, rtn;
        					for(var i=0; i<len; i++){
        						ctg = ctgLst.items[i];
        						if(ctg.ctgNo == ctgNo){
        							if(ctg.subCtgLst == undefined){
        								ctg.subCtgLst = current.subCtgLst;
        								
        								var li = $("#ctg_" + ctgNo);
        								if(!li.hasClass("open")){
        									$timeout(function(){ $scope.categoryAccordian(li); }, 200);
        								}
        							}
        							
        							return true;
        							break;
        						}else{
        							if(ctg.subCtgLst != undefined){
        								rtn = appendSubCategory(ctg.subCtgLst, subCtgLst);
        								if(rtn === true){
        									break;
        								}
        							}
        						}
        					}
    					}
    					
    				}else{
    					// 서브카테 없을경우
    					if($scope.postParams.ctgNo != undefined){
    						angular.element("#ctg_" + $scope.postParams.ctgNo).addClass("nochild");
    					}
    				}
    				
    				/*else if(subCtgLst.ctgNo != undefined){
						// 서브카테 없을경우
						angular.element("#ctg_" + subCtgLst.ctgNo).addClass("nochild");
					}*/
        		};
        		
        		/**
        		 * 상품 목록 데이터 로드
        		 */
        		$scope.loadListData = function (params) {
        			var postParams = angular.extend({
        					rtnType : "",
        					keyword : "",
        					//imgListGbn : "L",
        					dpml_no : "1",
        					dispCnt : 30,
        					page : 1
        				}, params),
        				loadURL = $scope.URLs.searchList;

        			if ($scope.postParams.brdNm) {
        				postParams.brdNm = $scope.postParams.brdNm;
        			}

        			/*if (!postParams.keyword) {// 검색어가 없을 경우 AJAX 호출 방지
        				$scope.noKeyword();
        				return false;
        			}*/
        			
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
        			//$scope.callAppAPI("search2016://listloadstart");// 리스트 로딩 끝
        			
        			$http.get(loadURL, {params:postParams})
        				.success(function (data, status, headers, config) {//호출 성공시
        					$scope.listDataLoadComplete(data, postParams.loadTerm);
        					//$scope.isShowLoading = false;
        					$scope.productListLoading = false;
        					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
        						$scope.isShowLoading = false;
        					}
        					
            				$timeout(function(){
            					$scope.retriveTemplateType();
            				}, 0);
            				
            				//$scope.callAppAPI("search2016://listloadend?count=" + data.tCnt);// 리스트 로딩 끝
            				//$scope.callAppAPI("search2016://searchcount?count=" + $data.tCnt);
        				})
        				.error(function (data, status, headers, config) {//호출 실패시
        					//$scope.isShowLoading = false;
        					$scope.productListLoading = false;
        					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
        						$scope.isShowLoading = false;
        					}
        					
        					//$scope.callAppAPI("search2016://listloadend?count=0");// 리스트 로딩 끝
        				});
        		};
        		
        		/**
        		 * 상품 목록 데이터 로드 성공
        		 */
        		$scope.listDataLoadComplete = function($data, loadTerm){
        			// 브랜드몰이면 목록화면에 데이타 전달 20170323
        			if($scope.setBrandMainData){
        				$scope.setBrandMainData($data);
    				}
    				
        			if($data.max != undefined){
        				$data = $data.max;
        			}
        			if ($data.resultCode) {// 결과 코드가 있을 경우에만 처리
        				$scope.uiStateObj.initFlag = false;

        				// All : 항상
        				$scope.srhResultData.resultCode = $data.resultCode;// 결과 코드
        				//검색결과 갯수
        				if($data.tCnt != undefined && typeof $data.tCnt == "number"){
        					$scope.srhResultData.tCnt = $data.tCnt;
        					
        					// 앱에 검색결과 갯수 전달
        					//$scope.callAppAPI("search2016://searchcount?count=" + $data.tCnt);
        				}

        				/*if ($data.isVoice == "Y" || $data.isVoice == "T" && $data.keyword && $data.keyword != "" && $data.sortType && $data.sortType != "") {
        					$scope.postParams.keyword = $data.keyword;
        					$scope.postParams.sort = $data.sortType;

        					var i = 0;

        					for (i = 0; i < $scope.uiStateObj.sortTypeArr.length; i++) {
        						if ($scope.uiStateObj.sortTypeArr[i].value == $scope.postParams.sort) {
        							$scope.uiStateObj.sortTypeIdx = i;
        						}
        					}
        				}*/

        				if ($data.brdNm && $data.brdNm != "") {
        					$scope.postParams.brdNm = encodeURIComponent($data.brdNm);
        				}

        				if ($data.resultCode == "0000") {
        					// 검색결과 있음
        					var prevEmptyResult = $scope.uiStateObj.emptyResult;
        					$scope.uiStateObj.emptyResult = false;// UI
        					$scope.uiStateObj.emptyKeyword = false;// UI
							
							// 가격대
        					if(loadTerm === true){
        						$data.price.min = parseInt($data.price.min, 10);
        						$data.price.max = parseInt($data.price.max, 10);
								$scope.srhResultData.price = $data.price;
								if($scope.postParams.priceMinU == null && $scope.postParams.priceMaxU == null){
									$scope.srhFilterPriceInit(false);
								}
        					}
        					
        					/*검색결과 로드 완료 처리*/
        					switch ($scope.postParams.rtnType) {
        						case "" ://기본
        						case "K"://검색어 변경
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
        								$scope.srhResultData.prdLst.items = $scope.srhResultData.prdLst.items.concat($data.prdLst.items);// 검색결과상품 리스트
        							} else {
        								if ($data.prdLst) {
        									// 검색된 상품 리스트가 있을 경우
        									$scope.srhResultData.prdLst = $data.prdLst;
        									$scope.srhResultData.prdLst.items = $data.prdLst.items;
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
            	        			    if($scope.sendBuzzni && !window.buzzni_rt_list && LotteCommon.mallSubUrl.indexOf(location.pathname) < 0){
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
        					
        				} else if ($data.resultCode == "1000") {
        					// 검색결과 없음
        					$scope.uiStateObj.emptyResult = true;// UI
        					$scope.uiStateObj.emptyKeyword = false;// UI

        					/*N : 검색결과 없음*/
        					$scope.srhResultData.tCnt = $data.tCnt; /*총 검색결과 수*/
        					$scope.srhResultData.missKeyword = $data.missKeyword; /*오탈자 검색어*/
        					
        					// 앱에 검색결과 갯수 전달
        					//$scope.callAppAPI("search2016://searchcount?count=" + $data.tCnt);
        					

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
        		};
        		
        		
        		/**
        		 * 검색 콘트롤 시작하기
        		 * 콘트롤, 디렉티브 초기화 시점상 에러 발생 방지를 위해 디렉티브에서 호출
        		 */
        		function startSearchList(){
        			checkCurrentPage();
        			
            		if(history.state == null || history.state.name != "catesub"){
            			//console.warn("NEW VISIT");
            			if(location.host.indexOf("localhost")>=0){
            				// local
            			}else{
            				history.replaceState({name:"catesub"}, "catesub");
            			}
            			//try { console.log('Data Load'); } catch (e) {}
            			$scope.loadDataParams(); // 데이터 로드
            			
            		}else{
            			//console.warn("REVISIT");
        				var sessionScopeData = LotteStorage.getSessionStorage($scope.screenID + "srhLst", 'json');
        	
        				if (sessionScopeData == undefined || sessionScopeData.srhResultData == undefined || typeof sessionScopeData.srhResultData.resultCode == "undefined") { // SessionStorage에 resultCode가 없다면 데이터 로드 하기
        					try { console.log('Data Load'); } catch (e) {}
        					$scope.loadDataParams(); // 데이터 로드
        					//$scope.callAppAPI("search2016://pagein");// 화면 진입시 앱호출
        					
        				} else { // 세션 스토리지에 담긴 값이 정상이라면 세션 데이터 활용
        					//try { console.log('Session Load'); } catch (e) {}
        					
        					// 세션 스토리지와 관계없이 데이터를 재로드해야 하는 경우
        					if(location.pathname.indexOf('/category/m/brand_prod_list.do') > -1){
        						$scope.loadDataParams();
        						return;
        					}
        	
        					//$scope.subTitle = sessionScopeData.subTitle; // 서브헤더 타이틀 세팅
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
        	
        					// 이전 스크롤 위치로 스크롤 이동
        					var m_nowScrollY = LotteStorage.getSessionStorage($scope.screenID + "srhLstNowScrollY");
        	
        					// iOS에서 딜레이를 주지 않을 경우 스크롤 위치를 찾아가지 못함 대략 300ms 정도면 적당한듯...
        					$timeout(function () {
        						angular.element($window).scrollTop(m_nowScrollY);
        					}, 300);
        					
        					$timeout(function(){
        						$scope.retriveTemplateType();
        					}, 0);

        					LotteStorage.delSessionStorage($scope.screenID + 'srhLstLoc'); // 세션스토리지에 저장된 현재 URL 삭제
        					LotteStorage.delSessionStorage($scope.screenID + 'srhLst'); // 세션스토리지에 저장된 검색결과리스트 데이터 삭제
        					LotteStorage.delSessionStorage($scope.screenID + 'srhLstNowScrollY'); // 세션스토리지에 저장된 스크롤 위치 삭제
        				}
            		}
        	
        	
        			/*페이지 unload 시 세션스토리지 저장*/
        			angular.element($window).on("unload", function(){
    					var sess = {};// 세션에 담을 Object 생성
    					$scope.uiStateObj.templateType = $scope.templateType;// 유닛 템플릿 타임 세팅
    					
    					sess.uiStateObj = $scope.uiStateObj;// UI 상태값 저장
    					sess.postParams = $scope.postParams;// 전송 데이터 저장 Input Param
    					sess.srhResultData = $scope.srhResultData;// 검색 결과
    					sess.srhDetailData = $scope.srhDetailData;// 상세 검색 활성화 여부
    		
						LotteStorage.setSessionStorage($scope.screenID + 'srhLstLoc', $location.absUrl());// 세션스토리지에 현재 URL 저장
						LotteStorage.setSessionStorage($scope.screenID + 'srhLst', sess, 'json');// 세션스토리지에 데이터를 JSON 형태로 저장
						LotteStorage.setSessionStorage($scope.screenID + 'srhLstNowScrollY', angular.element($window).scrollTop());// 세션스토리지에 스크롤 위치 저장
        				
        				//$scope.callAppAPI("search2016://pageout");// 화면 언로드 앱호출
        			});
        		};
				
				/**
				 * 사이드바 닫기 버튼 클릭
				 */
				$scope.closeSidebarBtnClk = function(){
					$scope.searchTclick2016("L", "Btn_Close");
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
						$scope.searchUISetting.isShowSideBar = false;
					}
					
					if($scope.searchUISetting.isShowSub === true){
						$scope.hideSubSearch();
					}
				};
				
				$scope.showHideSideSearch = function(shortcut){
					// WEB
					if($scope.searchUISetting.isShowSideBar){
						$scope.closeSideSearch();
					}else{
						if($scope.uiStateObj.detailSearchDataLoaded == false){ return; }
						
						$scope.searchTermsChanged = false;
						$scope.searchUISetting.isShowSideBar = true;
						$scope.dimmedOpen({
							target: "sideSearch",
							callback: $scope.closeSideSearch,
							scrollEventFlag: false
						});
						
						$(".side_search_wrap .ssw_content .ssw_slide.sub").scrollTop(0);// 서브슬라이드 상단으로 스크롤
						if(shortcut=="SORT"){
							$scope.showSubSearch({currentTarget:$(".ssw_slide.main li a[data-label='정렬']")});
						}
					}
					
					if(shortcut=="SORT"){
						$scope.searchTclick2016('C', 'Clk_Sort');//정렬
					}else{
						$scope.searchTclick2016('C', 'Clk_Detail');//상세검색
					}
				};
				
				/**
				 * 상세검색 서브 열기
				 */
				$scope.showSubSearch = function(e){
					var a = $(e.currentTarget);
					var slide = a.data("slide");
					$scope.searchUISetting.title = a.data("label");
					$scope.searchUISetting.slide = slide;
					$scope.searchUISetting.isShowSub = true;
					
					// 이전과 다른 슬라이드 열때 탑으로 스크롤
					if($scope.searchUISetting.lastSlide != slide){
						$(".side_search_wrap .ssw_content .ssw_slide.sub").scrollTop(0);
					}
					$scope.searchUISetting.lastSlide = slide;
					
					/*switch(a.data("slide")){
						case "price":
							$scope.postParams.priceMaxUTemp = $scope.postParams.priceMaxU;
							$scope.postParams.priceMinUTemp = $scope.postParams.priceMinU;
						break;
						case "research":
							$scope.postParams.rekeyword = "";
						break;
					}*/
					
					switch(a.data("slide")){
						case "category":
							$scope.searchTclick2016('L', 'Clk_Cate');
							break;
						case "brand":
							$scope.searchTclick2016('L', 'Clk_Brand');
							break;
						case "sort":
							$scope.searchTclick2016('L', 'Clk_Sort');
							break;
						case "benefit":
							$scope.searchTclick2016('L', 'Clk_Opt');
							break;
						case "color":
							$scope.searchTclick2016('L', 'Clk_Clr');
							break;
						case "price":
							$scope.searchTclick2016('L', 'Clk_Prc');
							break;
						case "research":
							$scope.searchTclick2016('L', 'Clk_Kwd');
							break;
					}
				};
				
				/**
				 * 상세검색 서브 닫기
				 */
				$scope.hideSubSearch = function(){
					$scope.searchUISetting.slide = null;
					$scope.searchUISetting.keywordIncExc = false;
					if($scope.searchUISetting.isShowSub == false){ return; }
					$scope.searchUISetting.isShowSub = false;
				};
				
				
				/**
				 * 정렬 인기/판매 베스트 안내팝업
				 */
				$scope.showHideSortGuide = function(){
					$scope.tipShow = !$scope.tipShow;
					if($scope.tipShow){
						$("#pop_sortGuide").css("top", $("#sortGuideButton").offset().top - 152);
						$timeout($scope.positionSortGuide, 0);
					}
				};
				$scope.positionSortGuide = function(){
					$("#pop_sortGuide").css("top", $("#sortGuideButton").offset().top - $("#pop_sortGuide").outerHeight() - 3);
				};
				

				/**
				 * 스마트픽 체크박스 클릭
				 */
				$scope.srhFilterSmpickClick = function (e){
					var cb = $(e.currentTarget);
					if(cb.is(":checked")){
						$scope.uiStateObj.smpickLayerOpenFlag = true;
						angular.element("#wrapper").addClass("overflowy_hidden");
					}
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
				};
				
				/**
				 * 스마트픽 지점 변경
				 */
				$scope.smpickBranchChange = function (item) {
					if($scope.postParams.smpBranchNo == item.branchNo){
						$scope.postParams.smpickYN = "N";
						$scope.postParams.smpBranchNo = null;
						$scope.uiStateObj.smpickBranchName = "";
					}else{
						$scope.postParams.smpickYN = "Y";
						$scope.postParams.smpBranchNo = item.branchNo;
						$scope.uiStateObj.smpickBranchName = item.name;
					}
					$scope.srhDetailPost();//상세검색 조회
					//$scope.searchTclick2016("S", "shipping_CLK_dep_Btn");
				};
				
				/**
				 * 하위 카테고리 선택해제
				 */
				/*$scope.deselectSubCategory = function(item){
					if(item.subCtgLst == undefined || item.subCtgLst.items == undefined){ return; }
					
					angular.forEach(item.subCtgLst.items, function(obj){
						//if(obj.checked === true){
							obj.checked = false;
							obj.subChecked = false;
						//}
						$scope.deselectSubCategory(obj);
					});
				};*/
				
				/**
				 * 카테고리 아이템 열기/닫기
				 */
				$scope.categoryItemOpen = function(e, item){
					// a tag disabled
					/*var a = $(e.currentTarget);
					var li = a.parent();
					
					$scope.categoryAccordian(li, item.ctgNo);
					if(li.find(">ul").length == 0){
						var depth = li.data("depth");
						if(li.hasClass("depthMod") || li.parents(".depthMod").length > 0){
							depth ++;
						}
						if(item.depth != undefined){
							depth = item.depth;
						}
						
						$scope.srhSubCtgPost(depth + 1, item.ctgNo, true);
					}*/
				};
				
				/**
				 * 카테고리 아이템 클릭
				 */
				$scope.categoryItemClick = function(e, item){
					var a = $(e.currentTarget);
					var li = a.parent();
					
					if(item.checked === true){
						//item.checked = false;
					}else{
						srhFilterSubCtgInit($scope.srhResultData.ctgLst);
						item.checked = true;
					}
					//$scope.deselectSubCategory(item);
					
					//if( ! li.hasClass("open")){
						$scope.categoryAccordian(li, item.ctgNo);
					//}
					categoryUpdateSelected();
					
					var depth = li.data("depth");
					if(li.hasClass("depthMod") || li.parents(".depthMod").length > 0){
						depth ++;
					}
					/*if(item.depth != undefined){
						depth = item.depth;
					}*/
					
					$scope.srhSubCtgPost(depth + 1, item.ctgNo);
				};
				
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
								sb.find(".open").removeClass("open");
								sb.find("ul").height(0);
							});
						}
						
						// 상위카테 높이 조정
						$scope.categoryAccordianParent(li);
					}else{
						// 서브카테가 없는 경우
					}
					
					// 카테고리 선택상태 설정
					//if(ctgNo == undefined){ return; }
					/*var pul = li.parent();
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
					$scope.uiStateObj.selectedCategory.ctgName = li.data("name");*/
					
					
					//categoryUpdateSelected();
				};
				
				/**
				 * 백화점 아닌 카테고리 선택해제
				 */
				function categoryDeselectNonDept(){
					var isdept;
					
					// 1 depth
					angular.forEach($scope.srhResultData.ctgLst.items, function(ctg1){
						isdept = (ctg1.mall == "롯데백화점");
						if(!isdept){
							ctg1.checked = false;
							ctg1.subChecked = false;
							
							if(ctg1.subCtgLst != undefined && ctg1.subCtgLst.items != undefined){
								// 2 depth
								angular.forEach(ctg1.subCtgLst.items, function(ctg2){
									ctg2.checked = false;
									ctg2.subChecked = false;
									
									if(ctg2.subCtgLst != undefined && ctg2.subCtgLst.items != undefined){
										// 3 depth
										angular.forEach(ctg2.subCtgLst.items, function(ctg3){
											ctg3.checked = false;
											ctg3.subChecked = false;
											
											if(ctg3.subCtgLst != undefined && ctg3.subCtgLst.items != undefined){
												// 4 depth
												angular.forEach(ctg3.subCtgLst.items, function(ctg4){
													ctg4.checked = false;
													ctg4.subChecked = false;
													
													if(ctg4.subCtgLst != undefined && ctg4.subCtgLst.items != undefined){
														// 5 depth
														angular.forEach(ctg4.subCtgLst.items, function(ctg5){
															ctg5.checked = false;
															ctg5.subChecked = false;
														});
														// 5 depth
													}
												});
												// 4 depth
											}
										});
										// 3 depth
									}
								});
								// 2 depth
							}
						}
					});
					// 1 depth
					
					categoryUpdateSelected();
					
					$scope.postParams.ctgNo = "";
					$scope.postParams.dsCtgDepth = null;
					$scope.postParams.ctgDepth1 = $scope.uiStateObj.selectedCategory.depth1.join(",");
					$scope.postParams.ctgDepth2 = $scope.uiStateObj.selectedCategory.depth2.join(",");
					$scope.postParams.ctgDepth3 = $scope.uiStateObj.selectedCategory.depth3.join(",");
					$scope.postParams.ctgDepth4 = $scope.uiStateObj.selectedCategory.depth4.join(",");
					$scope.postParams.ctgDepth5 = $scope.uiStateObj.selectedCategory.depth5.join(",");
				};
				
				/**
				 * 선택된 카테고리 리스팅
				 */
				function categoryUpdateSelected(){
					var d1 = [];
					var d2 = [];
					var d3 = [];
					var d4 = [];
					var d5 = [];
					//var d6 = [];
					var nm = [];
					
					// 1 depth
					angular.forEach($scope.srhResultData.ctgLst.items, function(ctg1){
						if(ctg1.subCtgLst != undefined && ctg1.subCtgLst.items != undefined){
							// 2 depth
							angular.forEach(ctg1.subCtgLst.items, function(ctg2){
								if(ctg2.subCtgLst != undefined && ctg2.subCtgLst.items != undefined){
									// 3 depth
									angular.forEach(ctg2.subCtgLst.items, function(ctg3){
										if(ctg3.subCtgLst != undefined && ctg3.subCtgLst.items != undefined){
											// 4 depth
											angular.forEach(ctg3.subCtgLst.items, function(ctg4){
												if(ctg4.subCtgLst != undefined && ctg4.subCtgLst.items != undefined){
													// 5 depth
													angular.forEach(ctg4.subCtgLst.items, function(ctg5){
														if(ctg5.checked === true){
															ctg1.checked = false;
															ctg2.checked = false;
															ctg3.checked = false;
															ctg4.checked = false;
															ctg1.subChecked = true;
															ctg2.subChecked = true;
															ctg3.subChecked = true;
															ctg4.subChecked = true;
															d5.push(ctg5.ctgNo);
															nm.push(ctg5.ctgName);
														}
													});
													// 5 depth
												}
												
												if(ctg4.checked === true){
													ctg1.checked = false;
													ctg2.checked = false;
													ctg3.checked = false;
													ctg1.subChecked = true;
													ctg2.subChecked = true;
													ctg3.subChecked = true;
													if(ctg1.depthMod===true){
														d5.push(ctg4.ctgNo);
													}else{
														d4.push(ctg4.ctgNo);
													}
													//d4.push(ctg4.ctgNo);
													nm.push(ctg4.ctgName);
												}
											});
											// 4 depth
										}

										if(ctg3.checked === true){
											ctg1.checked = false;
											ctg2.checked = false;
											ctg1.subChecked = true;
											ctg2.subChecked = true;
											if(ctg1.depthMod===true){
												d4.push(ctg3.ctgNo);
											}else{
												d3.push(ctg3.ctgNo);
											}
											nm.push(ctg3.ctgName);
										}
									});
									// 3 depth
								}

								if(ctg2.checked === true){
									ctg1.checked = false;
									ctg1.subChecked = true;
									if(ctg1.depthMod===true){
										d3.push(ctg2.ctgNo);
									}else{
										d2.push(ctg2.ctgNo);
									}
									nm.push(ctg2.ctgName);
								}
							});
							// 2 depth
						}
						
						if(ctg1.checked === true){
							if(ctg1.depthMod===true){
								d2.push(ctg1.ctgNo);
							}else{
								d1.push(ctg1.ctgNo);
							}
							nm.push(ctg1.ctgName);
						}
					});
					// 1 depth
					
					$scope.uiStateObj.srhFilterCtgFlag = (nm.length > 0);
					
					$scope.uiStateObj.selectedCategory.depth1 = d1;
					$scope.uiStateObj.selectedCategory.depth2 = d2;
					$scope.uiStateObj.selectedCategory.depth3 = d3;
					$scope.uiStateObj.selectedCategory.depth4 = d4;
					$scope.uiStateObj.selectedCategory.depth5 = d5;
					//$scope.uiStateObj.selectedCategory.depth6 = d6;
					$scope.uiStateObj.selectedCategory.ctgName = nm;
				};
				
				/**
				 * 상위 카테고리 선택상태 체크
				 */
				/*$scope.categoryCheckParent = function(li){
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
				};*/
				
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
				};
				
				/**
				 * 서브 카테고리(대카) 선택
				 * @param depth 카테고리 뎁스
				 * @param ctgno 카테고리 번호
				 * @param nolist 리스트 로드 방지
				 */
				$scope.srhSubCtgPost = function (depth, ctgno, nolist){
					/*var ctgNo, depth;
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
					$scope.uiStateObj.srhFilterCtgFlag = true;*/

					$scope.srhFilterBrdInit();// 브랜드 초기화
					$scope.srhFilterDetailInit();// 상세검색 초기화
					
					$scope.postParams.ctgNo = ctgno;
					if($scope.uiStateObj.currentPageType == "S"){
						// 전문몰이면 뎁스 2 추가
						$scope.postParams.dsCtgDepth = depth + 2;
						$scope.postParams.ctgDepth3 = $scope.uiStateObj.selectedCategory.depth1.join(",");
						$scope.postParams.ctgDepth4 = $scope.uiStateObj.selectedCategory.depth2.join(",");
						$scope.postParams.ctgDepth5 = $scope.uiStateObj.selectedCategory.depth3.join(",");
					}else{
						// 카테고리, 브랜드
						$scope.postParams.dsCtgDepth = depth;
						$scope.postParams.ctgDepth1 = $scope.uiStateObj.selectedCategory.depth1.join(",");
						$scope.postParams.ctgDepth2 = $scope.uiStateObj.selectedCategory.depth2.join(",");
						$scope.postParams.ctgDepth3 = $scope.uiStateObj.selectedCategory.depth3.join(",");
						$scope.postParams.ctgDepth4 = $scope.uiStateObj.selectedCategory.depth4.join(",");
						$scope.postParams.ctgDepth5 = $scope.uiStateObj.selectedCategory.depth5.join(",");
					}
					
					//$scope.postParams.ctgDepth6 = $scope.uiStateObj.selectedCategory.depth6.join(",");

					//POST
					$scope.postParams.rtnType = "C";
					$scope.loadDataParams($scope.postParams.rtnType, nolist);
				};

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
					}
				};
				
				/**
				 * 브랜드 리스트 정렬조건 변경
				 */
				$scope.srhFilterBrdSortChange = function (type) {
					if(type == "-cnt"){
						$scope.searchTclick2016("L", "Brand_02");
					}else{
						$scope.searchTclick2016("L", "Brand_01");
					}
				};
				

				/**
				 * Sortting 변경
				 */
				$scope.srhSortPost = function (idx) {
					$scope.uiStateObj.sortTypeIdx = idx;
					$scope.uiStateObj.srhFilterSortFlag = true;

					$scope.postParams.rtnType = "S";//정렬 조건 타입으로 설정
					$scope.loadDataParams($scope.postParams.rtnType); //결과 조회
					
					if($scope.cateProdYn){
						if(idx >= 2 && idx < 5){
							$scope.uiStateObj.sortTypeIdx = idx + 1;
						}
						if(idx == 5 ){
							$scope.uiStateObj.sortTypeIdx = 2;
						}	
					}
					switch (idx) {
						case 0 : $scope.searchTclick2016("L", "Sort_01"); break; //판매BEST
						case 1 : $scope.searchTclick2016("L", "Sort_02"); break; //상품평많은순
						case 2 : $scope.searchTclick2016("L", "Sort_03"); break; //신상품순
						case 3 : $scope.searchTclick2016("L", "Sort_04"); break; //낮은가격순
						case 4 : $scope.searchTclick2016("L", "Sort_05"); break; //높은가격순
						case 5 : $scope.searchTclick2016("L", "Sort_06"); break; //MD 추천순
					}
			
					$scope.scrollToTop();
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
					}
					
					
					return;
					$scope.postParams.selectedColor.length = 0;
					
					var c = $(e.currentTarget);
					var cd = c.data("color-cd");
					var cl = $scope.srhDetailData.srhColorList;
					var cli;
					var len = cl.length;
					for(var i=0; i<len; i++){
						cli = cl[i];
						if(cli.colorCd == cd){
							cli.selected = ! cli.selected;
						}
						
						if(cli.selected){
							$scope.postParams.selectedColor.push(cli.colorCd);
						}
					}
					
					//$scope.srhDetailSearchActiveChk();//상세검색 활성화 여부 검증
					$scope.srhDetailPost();//상세검색 조회
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
				};

				/*상세검색 조회*/
				$scope.srhDetailPost = function () {
					$scope.srhDetailSearchActiveChk();
					$scope.postParams.rtnType = "E";//상세검색 조건 타입으로 설정
					$scope.loadDataParams($scope.postParams.rtnType); //결과 조회
				};
				
				
				/*상세검색 조건 변경*/
				$scope.srhDetailChange = function (type){
					//선택한 조건에 따른 tclick 설정
					var tClickStr = "";
					switch (type) {
						case "deptYN":
							categoryDeselectNonDept();
							$scope.searchTclick2016("L", "Chk_Dep");
							break; //롯데백화점
						
						case "freeDeliYN"	: $scope.searchTclick2016("L", "Opt_01"); break; //무료배송
						case "smpickYN"		: $scope.searchTclick2016("L", "Opt_02"); break; //스마트픽
						case "freeInstYN"	: $scope.searchTclick2016("L", "Opt_03"); break; //무이자
						case "pointYN"		: $scope.searchTclick2016("L", "Opt_04"); break; //포인트
						
						case "isCrsPickYn"	: $scope.searchTclick2016("L", ""); break;//세븐일레븐
						case "isDlvToday"	: $scope.searchTclick2016("L", ""); break;//오늘배송
						case "isDlvQuick"	: $scope.searchTclick2016("L", ""); break;//퀵배송
					}
					
					$scope.srhDetailPost(); //상세검색 조회
				};
				
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
				};

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
				};
				
				/**
				 * 가격대 검색 버튼 클릭
				 * @param btnClicked 버튼 직접 클릭 여부
				 */
				$scope.srhDetailSearchPrice = function(btnClicked){
					if (!$scope.srhDetailPriceValidateFlag) { //가격 검증 완료 체크
						$scope.srhDetailPriceValidateFlag = true;
						return false;
					}
					
					deselectPriceRange();

					//상세검색 '검색' 버튼 클릭시 선택된 조건이 있는지 확인
					if (!$scope.postParams.priceMinUTemp && !$scope.postParams.priceMaxUTemp){
						alert("검색 조건을 입력해 주세요.");
						return false;
					} else {
						$scope.postParams.priceMinU = $scope.postParams.priceMinUTemp;
						$scope.postParams.priceMaxU = $scope.postParams.priceMaxUTemp;
						$scope.srhDetailPost(); //상세검색 조회
						
						if(btnClicked === true){
							$scope.searchTclick2016("L", "Brc_Btn");
						}
					}
				};
				
				$scope.srhDetailSearchFocus = function(){
					$scope.searchUISetting.keywordIncExc = false;
				};

				/**
				 * 결과 내 검색 버튼 클릭
				 */
				$scope.srhDetailSearchKeyword = function(){
					$scope.searchUISetting.keywordIncExc = false;
					
					if ($scope.postParams.rekeyword == "") {
						alert("검색할 단어를 입력해 주세요.");
						return false;
					}
					
					if($scope.searchUISetting.researchIdx == 0){
						$scope.addRequeryKeyword($scope.postParams.rekeyword);// 포함단어
					}else{
						$scope.addExqueryKeyword($scope.postParams.rekeyword);// 제외단어
					}
					$scope.postParams.rekeyword = "";
					$scope.searchTclick2016("L", "Kwd_Btn");
					
					////////$scope.closeSideSearch();// 사이드바 닫기
				};

				/*키보드 검색 엔터시*/
				$scope.srhDetailSearchKeypress = function (e) {
					if (e.which === 13) {
						$scope.srhDetailSearchKeyword();
						e.preventDefault();
					}
				};
				
				/*$scope.srhDetailSearchKeyUp = function(e){
					$scope.uiStateObj.relatedKeywordEntered = false;
					var str = $(e.currentTarget).val();
					if(str != undefined && str.length > 0){
						$scope.uiStateObj.relatedKeywordEntered = true;
					}
				};*/
				
				/**
				 * 재검색 키워드 삭제하기 (포함단어)
				 */
				$scope.deleteRequeryKeyword = function(keyword){
					var idx = $scope.postParams.reQuery.indexOf(keyword);
					if(idx >= 0){
						$scope.postParams.reQuery.splice(idx, 1);// remove keyword
						$scope.srhKeywordPost();// POST
						
						$scope.scrollToTop();
					}
				};
				
				/**
				 * 재검색 키워드 삭제하기 (제외단어)
				 */
				$scope.deleteExqueryKeyword = function(keyword){
					var idx = $scope.postParams.exQuery.indexOf(keyword);
					if(idx >= 0){
						$scope.postParams.exQuery.splice(idx, 1);// remove keyword
						$scope.srhKeywordPost();// POST
						
						$scope.scrollToTop();
					}
				};
				
				/**
				 * 재검색 키워드 추가 (포함단어)
				 */
				$scope.addRequeryKeyword = function(keyword, tclick){
					keyword = keyword.replace(/ /g, "");
					var idx = $scope.postParams.reQuery.indexOf(keyword);
					if(idx < 0){
						$scope.postParams.reQuery.push(keyword);// add keyword
						$scope.srhKeywordPost();// POST
						
						$scope.scrollToTop();
					}
				};
				
				/**
				 * 재검색 키워드 추가 (제외단어)
				 */
				$scope.addExqueryKeyword = function(keyword){
					keyword = keyword.replace(/ /g, "");
					var idx = $scope.postParams.exQuery.indexOf(keyword);
					if(idx < 0){
						$scope.postParams.exQuery.push(keyword);// add keyword
						$scope.srhKeywordPost();// POST
						
						$scope.scrollToTop();
					}
				};
				
				/**
				 * 재검색 키워드, 포함/제외 라디오 선택
				 */
				$scope.changeKeywordType = function(type){
					if(type == "in"){
						$scope.searchTclick2016("L", "Kwd_01");
					}else{
						$scope.searchTclick2016("L", "Kwd_02");
					}
				}

				/**
				 * 결과내 검색 조회
				 */
				$scope.srhKeywordPost = function () {
					$scope.srhFilterCtgInit();// 카테고리 초기화
					$scope.srhFilterBrdInit();// 브랜드 초기화
					$scope.srhFilterDetailInit();// 상세검색 초기화
					$scope.srhFilterStoreInit();
					
					$scope.postParams.rtnType = "K";
					$scope.loadDataParams($scope.postParams.rtnType);// 결과 조회
				};

				/**
				 * 상세검색 가격 포커싱
				 */
				$scope.srhFilterDetailPriceIpt = function (target){
					angular.element("#" + target).focus();
				};
				
				/**
				 * 상세검색 가격대 입력하기
				 */
				$scope.srhSetPriceRange = function(min, max, e){
					var MIN = $scope.srhResultData.price.min
					var MAX = $scope.srhResultData.price.max;
					
					switch(min){
						case 50000:
							$scope.searchTclick2016("L", "Prc_02");
							break;
						case 100000:
							$scope.searchTclick2016("L", "Prc_03");
							break;
						case 300000:
							$scope.searchTclick2016("L", "Prc_04");
							break;
						case 1000000:
							$scope.searchTclick2016("L", "Prc_05");
							break;
						default:
							$scope.searchTclick2016("L", "Prc_01");
							break;
					}
					
					/*if(min == null || min < MIN){
						min = MIN;
					}
					if(max == null || max > MAX){
						max = MAX;
					}*/
					
					/*if(min > max){
						min = MIN;
					}
					if(max < min){
						max = MAX;
					}*/
					
					$scope.postParams.priceMinU = min;
					$scope.postParams.priceMaxU = max;
					$scope.postParams.priceMinUTemp = min;
					$scope.postParams.priceMaxUTemp = max;
					
					$scope.srhDetailSearchPrice();
					
					if(e != undefined){
						var a = angular.element(e.currentTarget);
						a.addClass("selected");
					}
				};
				
				/**
				 * 가격대 선택 취소
				 */
				function deselectPriceRange(){
					angular.element(".ssws_wrap.ssws_price li a").removeClass("selected");
				};
				

				/**
				 * 검색 필터 - 상세검색 초기화
				 */
				$scope.srhFilterDetailInit = function () {
					$scope.uiStateObj.srhFilterDetailFlag = false;

					angular.forEach($scope.uiStateObj.srhFilterDetailArr, function (item) {
						$scope.postParams[item] = "N";
					});
					
					$scope.srhFilterBenefitInit();
					$scope.srhFilterColorInit();
					$scope.srhFilterPriceInit();
					//$scope.srhFilterStoreInit();
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
								$scope.searchTclick2016("L", "Cate_Reset");
								break;
								
							case "brand":
								$scope.srhFilterBrdInit(true);
								$scope.searchTclick2016("L", "Brand_Reset");
								break;
								
							case "sort":
								$scope.srhFilterSortInit(true);
								$scope.searchTclick2016("L", "Sort_Reset");
								break;
								
							case "benefit":
								$scope.srhFilterBenefitInit(true);
								$scope.searchTclick2016("L", "Opt_Reset");
								break;
								
							case "color":
								$scope.srhFilterColorInit(true);
								$scope.searchTclick2016("L", "Clr_Reset");
								break;
								
							case "price":
								$scope.srhFilterPriceInit(true);
								$scope.searchTclick2016("L", "Prc_Reset");
								break;
								
							case "research":
								$scope.srhFilterRequeryInit(true);
								$scope.searchTclick2016("L", "Kwd_Reset");
								break;
								
							case "delivery":
								$scope.srhFilterDeliveryInit(true);
								$scope.searchTclick2016("L", "");
								break;
						}
					}else{
						// 전체 초기화
						$scope.srhFilterSortInit();
						//$scope.srhFilterStoreInit();
						$scope.srhFilterRequeryInit(true);
						$scope.searchTclick2016("L", "Btn_Reset");
					}
				};
				
				// 카테고리 초기화
				$scope.srhFilterCtgInit = function (reload) {
					// reset data
					$scope.uiStateObj.srhFilterCtgFlag = false;
					$scope.uiStateObj.srhFilterCtgDepth = 0;
					//$scope.uiStateObj.srhFilterCtgSelIdx = 0;
					$scope.uiStateObj.srhFilterCtgDepth1CtgNo = "";
					
					$scope.uiStateObj.selectedCategory.depth1 = [];//null;
					$scope.uiStateObj.selectedCategory.depth2 = [];//null;
					$scope.uiStateObj.selectedCategory.depth3 = [];//null;
					$scope.uiStateObj.selectedCategory.depth4 = [];//null;
					$scope.uiStateObj.selectedCategory.depth5 = [];//null;
					//$scope.uiStateObj.selectedCategory.depth6 = [];//null;
					$scope.uiStateObj.selectedCategory.ctgName = [];//"";
					$scope.postParams.ctgNo = "";
					$scope.postParams.ctgDepth = 0;
					$scope.postParams.dsCtgDepth = null;
					$scope.postParams.ctgDepth1 = "";//$scope.uiStateObj.selectedCategory.depth1.join(",");
					$scope.postParams.ctgDepth2 = "";//$scope.uiStateObj.selectedCategory.depth2.join(",");
					$scope.postParams.ctgDepth3 = "";//$scope.uiStateObj.selectedCategory.depth3.join(",");
					$scope.postParams.ctgDepth4 = "";//$scope.uiStateObj.selectedCategory.depth4.join(",");
					$scope.postParams.ctgDepth5 = "";//$scope.uiStateObj.selectedCategory.depth5.join(",");
					
					srhFilterSubCtgInit($scope.srhResultData.ctgLst);
					
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
				};
				
				/**
				 * 서브카테고리 초기화
				 */
				function srhFilterSubCtgInit(cate){
					if(cate == undefined || cate.items == undefined){ return; }
					
					var items = cate.items;
					angular.forEach(items, function(ctg){
						ctg.checked = false;
						ctg.subChecked = false;
						srhFilterSubCtgInit(ctg.subCtgLst);
					});
				};

				// 브랜드 초기화
				$scope.srhFilterBrdInit = function (reload) {
					$scope.uiStateObj.srhFilterBrdFlag = false;
					$scope.postParams.brdNoArr = [];
					$scope.postParams.brdNmArr = [];

					angular.forEach($scope.srhResultData.brdLst.items, function (item, idx) {
						item.checked = false;
					});
					
					//POST
					if(reload === true){
						$scope.postParams.rtnType = "E";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				};

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
				};
				
				// 혜택 초기화
				$scope.srhFilterBenefitInit = function(reload){
					$scope.postParams.freeDeliYN = "N";
					$scope.postParams.smpickYN = "N";
					$scope.postParams.freeInstYN = "N";
					$scope.postParams.pointYN = "N";

					$scope.postParams.smpBranchNo = "";
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
				};
				
				// 가격대 초기화
				$scope.srhFilterPriceInit = function(reload){
					$scope.postParams.priceMinU = null;
					$scope.postParams.priceMaxU = null;
					$scope.postParams.priceMinUTemp = null;
					$scope.postParams.priceMaxUTemp = null;
					deselectPriceRange();
					//$scope.postParams.priceMinU = $scope.srhResultData.price.min;
					//$scope.postParams.priceMaxU = $scope.srhResultData.price.max;
					//$scope.postParams.priceMinUTemp = $scope.srhResultData.price.min;
					//$scope.postParams.priceMaxUTemp = $scope.srhResultData.price.max;
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};
				
				// 결과내검색 초기화
				$scope.srhFilterRequeryInit = function(reload){
					$scope.postParams.reQuery.length = 0;
					$scope.postParams.exQuery.length = 0;
					$scope.postParams.rekeyword = "";
					
					$scope.srhFilterCtgInit();
					$scope.srhFilterBrdInit();
					$scope.srhFilterDetailInit();
					$scope.srhFilterStoreInit();
					
					//POST
					if(reload === true){
						$scope.postParams.rtnType = "K";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				};
				
				// 매장 초기화
				$scope.srhFilterStoreInit = function(reload){
					$scope.postParams.deptYN = "N";
					//$scope.postParams.tvhomeYN = "N";
					//$scope.postParams.superYN = "N";
					//$scope.postParams.brdstoreYN = "N";
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};
				
				// 배송 초기화
				$scope.srhFilterDeliveryInit = function(reload){
					$scope.postParams.isCrsPickYn = "N";
					$scope.postParams.isDlvToday = "N";
					$scope.postParams.isDlvQuick = "N";
					$scope.postParams.smpickYN = "N";

					$scope.searchUISetting.smartPickList = false;
					$scope.postParams.smpBranchNo = null;//"";
					$scope.uiStateObj.smpickBranchName = "전체";
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};
				
				
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
					/*if($scope.postParams.ctgNo){
						obj.ctgNo = $scope.postParams.ctgNo;
						if($scope.postParams.ctgDepth >= 0 && $scope.postParams.ctgDepth <= 3){
							obj.ctgDepth = $scope.postParams.ctgDepth;
						}
					}*/
					
					// 브랜드
					checkSearchTermArray("brdNo", $scope.postParams.brdNoArr);

					// 소트
					obj.sort = $scope.postParams.sort;
					
					// 혜택
					addSearchTerm("freeDeliYN", $scope.postParams.freeDeliYN, "Y");
					addSearchTerm("freeInstYN", $scope.postParams.freeInstYN, "Y");
					addSearchTerm("pointYN", $scope.postParams.pointYN, "Y");
					addSearchTerm("smpickYN", $scope.postParams.smpickYN, "Y");
					if ($scope.postParams.smpickYN == "Y" && $scope.postParams.smpBranchNo != "") {//스마트픽 지점 번호 여부
						obj.smpBranchNo = $scope.postParams.smpBranchNo;
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
					//addSearchTerm("tvhomeYN", $scope.postParams.tvhomeYN, "Y");
					//addSearchTerm("brdstoreYN", $scope.postParams.brdstoreYN, "Y");
					//addSearchTerm("superYN", $scope.postParams.superYN, "Y");
					
					// 배송
					addSearchTerm("isCrsPickYn", $scope.postParams.isCrsPickYn, "Y");
					addSearchTerm("isDlvToday", $scope.postParams.isDlvToday, "Y");
					addSearchTerm("isDlvQuick", $scope.postParams.isDlvQuick, "Y");

					// 기타
					obj.dpml_no = $scope.postParams.dpml_no;
					obj.brdNm = encodeURIComponent($scope.postParams.brdNm);
					
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
						params[name].length = 0;// reset
						if(! (value == undefined || value == "") ){
							// update
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
					/*if(data.ctgNo != undefined && data.ctgDepth != undefined && data.ctgDepth >= 0 && data.ctgDepth <= 3){
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
					}*/
					
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
					setSearchTerm("smpickYN", data.smpickYN, "Y", "N");
					if(data.smpBranchNo == undefined){ data.smpBranchNo = ""; }
					setSearchTerm("smpBranchNo", data.smpBranchNo, "", data.smpBranchNo);
					
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
					//setSearchTerm("tvhomeYN", data.tvhomeYN, "Y", "N");
					//setSearchTerm("brdstoreYN", data.brdstoreYN, "Y", "N");
					//setSearchTerm("superYN", data.superYN, "Y", "N");
					
					$scope.srhDetailSearchActiveChk();// 상세 선택여부 체크
					
					// POST
					params.rtnType = data.rtnType;
					$scope.loadDataParams(params.rtnType);
				};
				window.searchFromApp = $scope.searchFromApp;

				
				
				/**
				 * 티클릭 전송
				 */
				$scope.searchTclick2016 = function(type, str){
					var tclick = $scope.tClickBase;
					
					switch($scope.uiStateObj.currentPageType){
					case "C":
						tclick += "CatSrh";
						break;
					case "S":
						tclick += "SShop";
						break;
					case "B":
						tclick += "Brand";
						break;
					}
					
					switch(type){
						case "C":
							break;
						case "L":
							tclick += "Layer";
							break;
						default:
							return;
							break;
					}
					
					tclick += "_" + str;
					
					$scope.sendTclick(tclick);// lotte-comm.js - TCLICK 수집
				};
				
				
				/**
				 * 스마트픽 레이어 닫기
				 */
				$scope.lySmpickClose = function () {
					$scope.uiStateObj.smpickLayerOpenFlag = false;
					angular.element("#wrapper").removeClass("overflowy_hidden");
				};
				
				/**
				 * 스마트픽 지점 변경
				 */
				/*$scope.smpickBranchChange = function (item) {
					$scope.uiStateObj.smpickBranchName = item.name;
					$scope.srhDetailPost();//상세검색 조회
				};*/

				
				/**
				 * 페이지 상단으로 스크롤
				 */
				$scope.scrollToTop = function(){
					var st = $(window).scrollTop();
					if(st > 1){
						$(window).scrollTop(1);
					}
				}
				
				
				startSearchList();// 검색 콘트롤 시작하기
            }
        };
        
	}]);//directive

})(window, window.angular);