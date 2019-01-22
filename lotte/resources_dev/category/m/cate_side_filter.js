(function(window, angular, undefined) {
	'use strict';

	var cateSideFilterModule = angular.module('cateSideFilter', [
        'lotteComm'
    ]);
    
	cateSideFilterModule.controller('CateSideFilterCtrl', ["$scope", "LotteCommon", function ($scope, LotteCommon) {
		
	}]);

	cateSideFilterModule.directive('cateSideFilter',
			['LotteCommon', 'LotteUtil', 'LotteStorage' ,'$window', '$timeout', '$http', '$location', '$filter', 'commInitData', 'LotteGA',
			function (LotteCommon, LotteUtil, LotteStorage, $window, $timeout, $http, $location, $filter, commInitData ,LotteGA) {
        return {
            templateUrl : '/lotte/resources_dev/category/m/cate_side_filter.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
        		$scope.isShowLoading = false;// Ajax 로드 Flag 초기화
        		$scope.productListLoading = false;
        		$scope.searchTermsLoading = false;
        		$scope.searchTermsChanged = false;
        		$scope.productMoreScroll = true;
        		$scope.tipShow = false; //툴팁
        		$scope.ctgInitFlag = false; // 카테고리 선택시 필터 초기화 alert 유무
				$scope.firstLoad = true; // term data 첫호출 전인지 여부 
				$scope.curSideStatus = 1; // 뒤로가기시 히스토리 기능
                $scope.templateType = 'cate_prod_double'; /* 초기 템플릿 타입 */
        		if(commInitData.query['curDispNo'] != undefined){
                    $scope.curDispNo =  commInitData.query['curDispNo'];
                }                
        		/**
        		 * Object 정의
        		 */
        		$scope.uiStateObj = { /*UI 상태값 저장*/
        			initFlag : true, /*최초 Flag*/
        			srhFilterSelectedIdx : -1, /*검색 필터 탭 활성화 인덱스*/
        			srhFilterCtgDepth1CtgNo : "", /*선택된 대대카 카테고리 No*/
        			srhFilterCtgDepth : 0, /*검색 필터 - 카테고리 활성화 depth*/
        			srhFilterCtgFlag : false, /*검색필터 - 카테고리탭 조건 선택 여부*/
        			srhFilterBrdFlag : false, /*검색필터 - 브랜드탭 조건 선택 여부*/
        			srhFilterBrdSort : "brdName", /*검색필터 - 브랜드탭 Sortting brdName / -cnt 값*/
        			srhFilterDetailFlag : false, /*검색필터 - 상세검색 조건 선택 여부*/
        			srhFilterSortFlag : false, /*검색필터 - Sortting 탭 조건 선택 여부*/
        			sortTypeIdx : 4, /*검색필터 - Sortting 타입 Index*/
        			sortTypeArr : [ /*검색필터 - Sortting Label 과 Value 배열*/
						// {label : "인기순", shortLabel : "인기순", value : "RANK,1", notice : true},
						{label : "판매순", shortLabel : "판매순", value : "TOT_ORD_CNT,1", notice : true, shortIdx : 0 },
						{label : "높은가격순", shortLabel : "높은가격", value : "DISP_PRICE,1", shortIdx : 4 },
						{label : "낮은가격순", shortLabel : "낮은가격", value : "DISP_PRICE,0", shortIdx : 3 },
						{label : "상품평 많은순", shortLabel : "상품평", value : "TOT_REVIEW_CNT,1", shortIdx : 1 },
						{label : "MD 추천순", shortLabel : "MD추천순", value : "EXT_CHAR_FT3,0/TOT_ORD_CNT,1/DATE,1", shortIdx : 5 },
						{label : "최근등록순", shortLabel : "최근등록", value : "DATE,1", shortIdx : 2 }
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
        			emptyResult : false, /*검색 결과가 없는지에 대한 Flag*/
        			emptyKeyword : false, /*검색 키워드가 없는지에 대한 Flag*/
        			emptyPrdLstFlag : false, /*검색된 상품이 없는지에 대한 Flag*/
        			ajaxPageEndFlag : false, /*마지막 페이지까지 로드 됐는지에 대한 Flag*/
        			smpickLayerOpenFlag : false, /*스마트픽 지점 레이어 Open 여부*/
        			smpickBranchName : "", /*검색필터 - 상세검색 - 스마트픽 셀렉트박스 label*/
        			
        			//relatedKwywordOpenFlag	: false,//결과내 검색 팝업 표시여부
        			//relatedKeywordEntered	: false,//결과내 검색 팝업 텍스트입력중 
        			relatedKeywordNotEmpty	: true,//연관키워드 존재여부
        			relatedKeywordEnabled	: true,//연관키워드 영역 표시 여부
        			detailSearchDataLoaded	: false,//상세설정 데이터 로드 상태
        			selectedCategory		:{
        				depth1:"",//null
        				depth2:"",//null
        				depth3:"",//null
        				depth4:"",//null
        				depth5:"",//null
        				ctgName:[]//""
        			},
        			
        			currentPageType : "C", // 현재 페이지 C 카테고리, B 브랜드, S 전문관
        			
        			srhFilterPriceFlag : false, /*검색필터 - Price 탭 조건 선택 여부*/
        			// priceTypeIdx : -1, /*검색필터 - Price 타입 Index*/
        			// priceTypeArr : [ // 가격필터
        			// 	{label : "~5만원 미만", shortLabel : "~50,000원", value : ",50000", shortIdx : 0 },
        			// 	{label : "5만원 ~ 10만원", shortLabel : "50,000원~100,000원", value : "50000,100000", shortIdx : 1 },
        			// 	{label : "10만원 ~ 30만원", shortLabel : "100,000원~300,000원", value : "100000,300000", shortIdx : 2 },
        			// 	{label : "30만원 ~ 100만원", shortLabel : "300,000원~1,000,000원", value : "300000,1000000", shortIdx : 3},
        			// 	{label : "100만원 이상", shortLabel : "1,000,000원~", value : "1000000,", shortIdx : 4 }
        			// ],
        			subTitle : "",
        			brandArr : [],// 브랜드 선택된 아이템
        			priceOptionOpend: true,
        			priceInputOpend: false,
        			arrOpenCtgCd: [], // 카테고리 펼친 폴더
					filterCateCnt: 0 // 카테고리 카운트
        		};
        		
        		$scope.srhDetailPriceValidateFlag = true;//가격 검증 완료 Flag
        		
        		$scope.searchUISetting = {
					slide               : null, //탭 선택
					lastSlide           : "", //탭 이전 선택
					searchSlide           : true, //탭 이전 선택
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
        			searchList		: LotteCommon.cateListData2018,// 검색결과 데이터
        			searchTerm		: LotteCommon.cateTermData2018,//상세검색
        			
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
					ctgDepth : 0, /*선택 카테고리 depth*/
					dsCtgDepth : 0, /*선택 하위 카테고리 depth*/
					dtDsCtgDepth : 2, /*중카 :2 고정*/
					dtCtgNo : "", /*중카 :2 ctgNo*/
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
					pkgYN:"", //상세검색 - 무료선물포장
					freeGiftYN:"", //상세검색 - 사은품 제공
					
					/* 배송 */
					smpickYN : "N", /*상세검색 - 스마트픽 여부*/
					smpBranchNo : "", /*상세검색 - 스마트픽 지점 번호*/
					isCrsPickYn : "N", /* 상세검색 - 내 주변 픽업 */
    				freeDeliYN : "N", /*상세검색 - 무료배송 여부*/
    				isDlvQuick : "N",//퀵배송
    				isDlvToday : "N",//오늘도착
    				
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
					srhColorList:[],
					freeGiftYN : false, //사은품 제공
					freeGiftView : false, //사은품 제공 보여주기 여부
					feelListCnt : 0, //스타일갯수
					starPoinCnt : 0, //별점갯수
					shoseSizeLst : [], //신발사이즈
					shoseSizeCnt : 0 //신발 선택 갯수
        		};
        		
        		// 퀵배송 보이기 (오전 9시 ~오후 4시 30분까지 )
        		$scope.showQuick = false;
        		var curHM = parseInt("" + new Date().getHours() + new Date().getMinutes(), 10);
        		if(curHM >= 900 && curHM <= 1630){
        			$scope.showQuick = true;
        		}

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
						for(var i = 0; i<$scope.uiStateObj.sortTypeArr.length; i++){
							if($scope.uiStateObj.sortTypeArr[i].shortIdx == qsort){
								$scope.postParams.sort = $scope.uiStateObj.sortTypeArr[i].value;
								$scope.uiStateObj.sortTypeIdx = i;
								break;
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
				 * Google Analytics
				 */
				$scope.ga = function(act, lab, flag){
					var type = "MO";
					if($scope.appObj.isApp){
						type = "APP";
					}
					if(flag === "sort"){
						LotteGA.evtTag(type + "_탐색_검색결과_정렬", act, lab);
					}else{
						LotteGA.evtTag(type + "_탐색_검색결과_필터", act, lab);
					}
				};
        		
        		/**
        		 * 상품 유닛 타입 변경
        		 */
                $scope.changeTemplate = function(type){
					$scope.templateType = type;
                	LotteStorage.setLocalStorage($scope.screenID+'TemplateTypeDC', type);
                	
                	switch(type){
	                	case "cate_prod_normal":
	                		$scope.searchTclick2016("C", "Clk_Pcto1");
	                		break;
	                	case "cate_prod_double":
	                		$scope.searchTclick2016("C", "Clk_Pcto2");
	                		break;
	                	case "cate_prod_image":
	                		$scope.searchTclick2016("C", "Clk_Pcto3");
	                		break;
	                	case "cate_prod_single":
	                		$scope.searchTclick2016("C", "Clk_Pcto4");
	                		break;
                	}
                };
                
                /**
                 * 상품 유닛 타입 스토리지에서 복원
                 */
                $scope.retriveTemplateType = function(){
                	var template = LotteStorage.getLocalStorage($scope.screenID+'TemplateTypeDC');
                	
					if(template){
						$scope.templateType = template;
					}else{
						$scope.templateType = "cate_prod_double";
					}
					
                };
                
                /**
                 * 스크롤 시에 다음페이지 불러오기
                 */
        		$scope.loadMoreData = function(n) {
					
					if($(window).height() == $(document).height()){ return; }// 레이어 딤드 상태 예외처리
					if($scope.srhResultData.tCnt <= $scope.srhResultData.prdLst.items.length) return;

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
                    loadParam.curDispNo = $scope.postParams.curDispNo;
                    
        			switch (type) {
        				case "P" :// 페이징
        					loadParam.page = ++$scope.postParams.page;// 페이지
        				case "S" :// 정렬
        					loadParam.sort = $scope.postParams.sort;
        				case "B" :// 브랜드 선택 검색
        				case "E" :// 상세 검색
        				case "C" :// 카테고리 선택 검색
        				//case "T" :// 상세 검색 조건 활성화 여부
        				//case "K":// 키워드 변경
        				//default :// 기본
							
							/* 매장 */
        					if ($scope.postParams.deptYN == "Y") { /*롯데백화점 조건 선택 여부*/
        						loadParam.deptYN = $scope.postParams.deptYN;
        					}

        					if ($scope.postParams.tvhomeYN == "Y") { //롯데홈쇼핑 조건 선택 여부
        						loadParam.tvhomeYN = $scope.postParams.tvhomeYN;
        					}

							if ($scope.postParams.superYN == "Y") { //롯데슈퍼 조건 선택 여부
        						loadParam.superYN = $scope.postParams.superYN;
							}
							
        					if ($scope.postParams.brdstoreYN == "Y") { //브랜드스토어 조건 선택 여부
        						loadParam.brdstoreYN = $scope.postParams.brdstoreYN;
        					}
							
							/* 가격/혜택/선물포장 */
							if($scope.uiStateObj.srhDetailSearchClicked){ // 최소,최대 검색버튼 클릭 여부
								loadParam.priceMinU = $scope.postParams.priceMinU;
								loadParam.priceMaxU = $scope.postParams.priceMaxU;
							}
							
							if ($scope.postParams.freeInstYN == "Y") { /*무이자 조건 선택 여부*/
        						loadParam.freeInstYN = $scope.postParams.freeInstYN;
        					}

        					if ($scope.postParams.pointYN == "Y") { /*포인트 조건 선택 여부*/
        						loadParam.pointYN = $scope.postParams.pointYN;
							}
							
							if ($scope.postParams.pkgYN == "Y") { /*무료 선물 포장 조건 선택 여부*/
        						loadParam.pkgYN = $scope.postParams.pkgYN;
							}
							
							if ($scope.postParams.freeGiftYN == "Y") { /*사은품 제공 조건 선택 여부*/
        						loadParam.freeGiftYN = $scope.postParams.freeGiftYN;
							}
							
							/* 배송 */
							if ($scope.postParams.smpickYN == "Y") { /*스마트픽 조건 선택 여부*/
        						loadParam.smpickYN = $scope.postParams.smpickYN;
        					}

        					if ($scope.postParams.smpickYN == "Y" && $scope.postParams.smpBranchNo != "") { /*스마트픽 지점 번호 여부*/
								loadParam.smpBranchNo = $scope.postParams.smpBranchNo;
							}
							
        					if ($scope.postParams.freeDeliYN == "Y") { /*무료배송 조건 선택 여부*/
        						loadParam.freeDeliYN = $scope.postParams.freeDeliYN;
        					}
							
							if($scope.postParams.isDlvQuick == "Y"){// 퀵배송
        						loadParam.isDlvQuick = "Y";
							}
							
							if($scope.postParams.isDlvToday == "Y"){// 오늘배송
        						loadParam.isDlvToday = "Y";
							}

							if($scope.postParams.isCrsPickYn == "Y"){// 내 주변 픽업
								loadParam.isCrsPickYn = "Y";
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
							if($scope.postParams.ctgNo) {// 선택된 카테고리가 있는지 판단
        						loadParam.ctgNo = $scope.postParams.ctgNo;
							}
							if($scope.postParams.dsCtgDepth){
        						loadParam.dsCtgDepth = $scope.postParams.dsCtgDepth;
        					}
							loadParam.dtDsCtgDepth = $scope.postParams.dtDsCtgDepth; /*중카 :*/
							loadParam.dtCtgNo = $scope.postParams.dtCtgNo; /*중카 :2 ctgNo*/
							loadParam.ctgDepth = $scope.postParams.ctgDepth;
							
        					        					
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
        					
        					angular.element("#rekeyword").blur(); // 키보드 내리기
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
        					//break;
        				//case "C":// 카테고리
        					// 대중소카만 검색조건 호출(대대 호출안함)
        					//if(loadParam.ctgDepth >= 1){
        						//$scope.loadTermData(loadParam);
        					//}
        					//break;
        				case "B":// 브랜드
						default:
        					$scope.loadTermData(loadParam);
        					break;
        			}
        			if(nolist != true){
                        //201804 광고솔루션 ============================ srart 
						//http://alpha.display.lottecpcad.com/adReq?query=5537414&channelId=D01A02102&serverUrl=http://naver.com&userIp=49.254.179.206&adType=MLP
						$scope.srhDetailSearchActiveChk();// 상세 선택여부 체크
                        if(loadParam.page == 1 && $scope.postParams.sort == 'TOT_ORD_CNT,1' && $scope.uiStateObj.srhFilterDetailFlag == false && !$scope.postParams.ctgNo && !$scope.uiStateObj.srhFilterBrdFlag && $scope.postParams.reQuery.length == 0 && $scope.postParams.exQuery.length == 0){
                            console.log("call adReq", loadParam.page);
                            $scope.ad_param = {
                                query : $scope.curDispNo,
                                channelId : "D01M02102",
                                startRank : 1,
                                maxCnt : 3,
                                serverUrl : encodeURIComponent(location.href),
                                mbrId : $scope.loginInfo.mbrNo,
                                userIp : '',
                                ua : encodeURIComponent(navigator.userAgent),
                                adType : "MLP"
                            }
                            $scope.ad_list = [];     
                            $scope.timeout_flag = 0;
                            setTimeout(function(){
                                if($scope.timeout_flag == 0){
                                    //검색 결과 로드 
                                    console.log("- 광고솔루션 timeout -");
                                    $scope.timeout_flag = 1;
                                    $scope.loadListData(loadParam);                                      
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
                                        if($scope.ad_list && $scope.ad_list.length > 0){
                                            var goodNoList = "";
                                            for(var i=0; i<$scope.ad_list.length; i++){
                                                goodNoList += $scope.ad_list[i].goodsNo;
                                                if(i < $scope.ad_list.length - 1){
                                                    goodNoList += ",";
                                                }                            
                                            }    
                                            loadParam.goodsNoList = goodNoList;
                                        }                                        
                                    }
                                    //검색 결과 로드 
                                    if($scope.timeout_flag == 0){
                                        $scope.loadListData(loadParam);
                                        $scope.timeout_flag = 1;
                                    }
                                }
                                , error: function(data) {
                                    console.log("광고솔루션 에러", data);                                    
                                    if($scope.timeout_flag == 0){
                                        $scope.loadListData(loadParam);;//에러가 나도 데이타 로드는 진행함.                                             
                                        $scope.timeout_flag = 1;                                
                                    }                                    
                                }
                                ,timeout : 2000
                            });                        
                            //201804 광고솔루션 ============================ end                         
                           
                        }else{
                           $scope.loadListData(loadParam);
                        }
        			}
        			
        			$scope.searchTermsChanged = true;
        		};
        		
        		/**
        		 * 색상 선택 상태 업데이트
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
						
						if(colors == undefined || colors.length < 1){ return; }
						
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
        					//imgListGbn : "L",
        					dpml_no : "1",
        					dispCnt : 30,
        					page	: 1,
        					cmpsCd	: 50
        				}, params),
        				loadURL = $scope.URLs.searchTerm;

        			if ($scope.postParams.brdNm) {
        				postParams.brdNm = $scope.postParams.brdNm;
        			}
        			
        			/*if (!postParams.keyword) {// 검색어가 없을 경우 AJAX 호출 방지
        				$scope.noKeyword();
        				return false;
        			}*/
        			
        			// 첫호출 전인지 여부 플래그
        			$scope.firstLoad = false;
        			if($scope.searchTermsLoading){ return false; }

        			$scope.isShowLoading = true;// AJAX 호출 Flag 활성화
        			$scope.searchTermsLoading = true;

        			$http.get(loadURL, {params:postParams})
						.success(function (data, status, headers, config) {//호출 성공시
							$scope.setTreeId();

        					$scope.termDataLoadComplete(data);
        					//$scope.isShowLoading = false;
        					$scope.searchTermsLoading = false;
        					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
        						$scope.isShowLoading = false;
        					}
        					
            				$timeout(function(){
            					$scope.retriveTemplateType();
            					//$scope.setTreeId();
            				}, 0);
        				})
        				.error(function (data, status, headers, config) {//호출 실패시
        					//$scope.isShowLoading = false;
        					$scope.searchTermsLoading = false;
        					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
        						$scope.isShowLoading = false;
        					}
        					$timeout(function(){
            					$scope.setTreeId();
            				}, 0);
        				});
        		};

        		/**
        		 * 상세검색 조건 데이터 로드 성공
        		 */
        		$scope.termDataLoadComplete = function($data){
        			if($data.max != undefined){
        				$data = $data.max;
        			}
        			if($data.resultCode){//결과 코드가 있을 경우에만 처리
        				
						$scope.uiStateObj.subTitle = $data.ctgTitle;
						
						switch($scope.postParams.rtnType){
							case "":
								// 키워드
								$scope.srhResultData.keyword = $data.keyword;
								$scope.postParams.keyword = $data.keyword;
								
							//case "K":
							//case "C" :// 카테고리
							//case "E":// 기타 상세
							//case "B":// 브랜드
							default:

								// 재검색어
								
								if($data.ctgLst != undefined && $scope.srhResultData.ctgLst == null){
									//최초 1회
									var objCtg = {items:[]};
									for(var i = 0; i<$data.ctgLst.items.length; i++){
										var itemTemp = $data.ctgLst.items[i];
										itemTemp.dtCtgNo = itemTemp.ctgNo;
										itemTemp.ctgNo = itemTemp.subCtgLst.items[0].ctgNo;
										itemTemp.subCtgLst = null;
										itemTemp.show = true;
										
										objCtg.items.push(itemTemp);
									}
									$scope.srhResultData.ctgLst = objCtg;// 카테고리 리스트
								}else{
									
									//원본 과 새로운 데이터 비교해서 show 할당
									var hasCheck = false;
									var ctgLen = $scope.srhResultData.ctgLst.items.length;
									for(var n = 0; n < ctgLen; n++){
										hasCheck = false;
										var resultDataNo = $scope.srhResultData.ctgLst.items[n].dtCtgNo;
										angular.forEach($data.ctgLst.items , function(newCtg){
											if(resultDataNo == newCtg.ctgNo){
												hasCheck = true;
												if( parseInt($scope.postParams.ctgDepth) <= 2){
													$scope.srhResultData.ctgLst.items[n].cnt = newCtg.cnt;
												}
											}
										});
										if(hasCheck){
											$scope.srhResultData.ctgLst.items[n].show = true;
										}else{
											$scope.srhResultData.ctgLst.items[n].show = false;
										}
									}

								}

								//카테고리 있는지 확인(UI)
								$scope.srhResultData.ctgLength = $data.ctgLst.items.length;

								// 서브카테 추가하기
								if($data.subCtgLst && $data.subCtgLst.items ){
									appendSubCategory($scope.srhResultData.ctgLst,$data.subCtgLst.items);
								}
								
								
								//브랜드
								if($scope.srhResultData.brdLst == undefined){
									$scope.srhResultData.brdLst		= {};
									$scope.srhResultData.brandList	= {};
								}
								if($data.brdLst.items == undefined){
									$data.brdLst.items = [];
								}
								var brd;
								if($scope.postParams.rtnType == "" || $scope.postParams.rtnType == "K"){
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
								$scope.srhResultData.brdLstRender = $scope.srhResultData.brandList.items;//.slice(0, $scope.brdShowListCnt);
								
								if ($data.brdLst.total_count != null) {
									$scope.srhResultData.brdLst.tcnt = $data.brdLst.total_count;
								}else{
									$scope.srhResultData.brdLst.tcnt = $scope.srhResultData.brdLstRender.length;// 브랜드 리스트
								}

								// 매장
								$scope.srhDetailData.srhTerms.dept = $data.store.dept == "1" ? true : false;
								$scope.srhDetailData.srhTerms.tvhome = $data.store.tvhome == "1" ? true : false;
								$scope.srhDetailData.srhTerms.super = $data.store.super == "1" ? true : false;
								$scope.srhDetailData.srhTerms.brdstore = $data.store.brdstore == "1" ? true : false;
								
								// 가격대 (list에서 받아 처리함 listDataLoadComplete)
								
								// 사은품 제공
								
								if($scope.postParams.rtnType == "" || $scope.postParams.rtnType == "K"){
									$data.freeGiftYN == "Y" ? $scope.srhDetailData.freeGiftView = true  : $scope.srhDetailData.freeGiftView = false;
								}
								$data.freeGiftYN == "Y" ? $scope.srhDetailData.freeGiftYN = true  : $scope.srhDetailData.freeGiftYN = false;
								
								// 배송 - 스마트픽
								$scope.srhDetailData.srhTerms.smpick = $data.smpick == "1" ? true : false;
								$scope.srhDetailData.srhTerms.smpickBranch = $filter('orderBy')($data.smpickBranch, 'name');
								$scope.srhDetailData.srhTerms.seven = $data.deliver.smpSeven == "1" ? true : false;
								$scope.srhDetailData.srhTerms.quick = $data.deliver.quick == "1" ? true : false;
								$scope.srhDetailData.srhTerms.tdar = $data.deliver.tdar == "1" ? true : false;

								// 컬러
								$scope.updateColors($data.colors);
								
								//스타일
								if($data.feelList){
									if($scope.postParams.rtnType == "" || $scope.postParams.rtnType == "K"){
										if($data.feelList.items){
											$scope.srhResultData.srhFeelList = $data.feelList.items;
											$scope.srhResultData.feelListCnt = $scope.srhResultData.srhFeelList.length;
										}
									}else{
										var feel = [];
										angular.forEach($data.feelList.items, function(item){
											feel.push(item.feelNo);
											angular.forEach($scope.srhResultData.srhFeelList, function(feel){
												if(feel.feelNo == item.feelNo){
													feel.feelcnt = item.feelcnt;
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
									if($scope.postParams.rtnType == "" || $scope.postParams.rtnType == "K"){
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
								if($data.starPointLst && $data.starPointLst.items && $data.starPointLst.items.length > 0){
									$scope.srhResultData.starPointLst = $data.starPointLst.items;
									var s = "2";
									if($scope.srhResultData.starPointLst.length > 0){
										switch($scope.srhResultData.starPointLst[0].starNo){
										case "0":
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
						
						if($data.resultCode != "0000"){
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
        		 * 서브카테 찾아서 추가하기
        		 * @param ctgLst 카테고리 리스트 데이터
        		 * @param subCtgLst 서브카테고리 데이터
        		 */
				//appendSubCategory($scope.srhResultData.ctgLst,$data.subCtgLst.items);
        		function appendSubCategory(ctgLst, subCtgLst){
					if(ctgLst == undefined || ctgLst.items == undefined){ return; }
					
    				if(subCtgLst && subCtgLst.length > 0){
    					// 서브카테 있을경우
    					var current = subCtgLst;
						var len = ctgLst.items.length;
						
						var ctg;
						for(var i=0; i<len; i++){
							ctg = ctgLst.items[i];
							
							for(var k=0; k<current.length; k++){
								var currnetItem = current[k];
								if(ctg.ctgNo == currnetItem.ctgNo){
									ctg.subCtgLst = currnetItem.subCtgLst;

									var li = $("#ctg_" + ctg.ctgNo);
									if(!li.hasClass("open") && ctg.checked){
										li.addClass("open")
										$scope.setTreeId();
									}
								}else{
									appendSubCategory(ctg.subCtgLst,subCtgLst);
								}
							}

						}

					}
					
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
        			
        			if($scope.productListLoading){ return false; }

        			$scope.isShowLoading = true;// AJAX 호출 Flag 활성화
        			$scope.productListLoading = true;
        			
        			
        			$http.get(loadURL, {params:postParams})
        				.success(function (data, status, headers, config) {//호출 성공시
                            //201804 광고솔루션 ============================ srart                     
                            for(var k=0; k<3; k++){
                                if(k < data.max.prdLst.items.length && data.max.prdLst.items[k].ad_url != undefined){//광고상품이면
                                    for(var i=0; i<$scope.ad_list.length; i++){
                                        if(data.max.prdLst.items[k].goods_no == $scope.ad_list[i].goodsNo){
                                            data.max.prdLst.items[k].click_url = $scope.ad_list[i].clickUrl;    
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
        					
            				$timeout(function(){
            					$scope.retriveTemplateType();
            				}, 0);
            				
        				})
        				.error(function (data, status, headers, config) {//호출 실패시
        					//$scope.isShowLoading = false;
        					$scope.productListLoading = false;
        					if(! ($scope.searchTermsLoading || $scope.productListLoading) ){
        						$scope.isShowLoading = false;
        					}
        				});
        		};
        		
        		/**
        		 * 선택했던 카테고리인지 확인
        		 */
        		$scope.checkOpenCtgCd = function(item){
					
        			var el = $('#ctg_' + item.ctgNo);
        			
        			var result = false;
        			for(var i = 0; i<$scope.uiStateObj.arrOpenCtgCd.length; i++){
        				if(item.ctgNo == $scope.uiStateObj.arrOpenCtgCd[i].ctgNo){
        					result = true;
        					break;
        				}
        			}
        			if(result){
						if(!el.hasClass('open')){
							el.addClass('open');
						}
        			}
        			return result;
        		};
        		
        		/**
        		 * 열려있는 카테고리 저장
        		 */
        		$scope.setTreeId = function(){
					//카테고리가 아니면 노드가 없어서 open 되어 있는것을 찾지 못함
					if($scope.searchUISetting.slide !='category') return;
					var arrTemp = [];
					
    				for(var i = 0; i <$('.ssws_wrap.ssws_category .openable li.open').length; i++){
    					var el = $($('.ssws_wrap.ssws_category .openable li.open')[i]);
    					
    					arrTemp.push({ctgNo : el.data("no")});
					}
    				$scope.uiStateObj.arrOpenCtgCd = arrTemp;
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
        				}

        				if ($data.brdNm && $data.brdNm != "") {
        					$scope.postParams.brdNm = encodeURIComponent($data.brdNm);
        				}

        				if ($data.resultCode == "0000") {
        					// 검색결과 있음
        					var prevEmptyResult = $scope.uiStateObj.emptyResult;
        					$scope.uiStateObj.emptyResult = false;// UI
        					$scope.uiStateObj.emptyKeyword = false;// UI
							
							
							// 가격대 상품 있으나 없으나 설정(resultCode 0000,1000)
							$scope.postParams.priceMinUTemp = $data.price.min;
							$scope.postParams.priceMaxUTemp = $data.price.max;
							
        					
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
                    					var len = $scope.srhResultData.prdLst.items.length;
        	        					for(var i = 0; i<len; i++){
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
            	        			    
            	        			    // 배열 분리에 따른 tclick 인덱싱
            	        			    for(var i=0; i<len; i++){
        	        						$scope.srhResultData.prdLst.items[i].nIdx = i;            	        			    	
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
        					
        					// 배열 분리
        					if($scope.srhResultData.prdLst.items.length <= 6){
        						$scope.srhResultData.prdLst1 = $scope.srhResultData.prdLst.items.slice(0, 6);
        						$scope.srhResultData.prdLst2 = [];
        					}else{
        						$scope.srhResultData.prdLst1 = $scope.srhResultData.prdLst.items.slice(0, 6);
        						$scope.srhResultData.prdLst2 = $scope.srhResultData.prdLst.items.slice(6);
        					}
        					
        					// 딜전용구좌
        					$scope.srhResultData.planPrdLst = $data.planPrdLst;
        					
        				} else if ($data.resultCode == "1000") {


							// 가격대 상품 있으나 없으나 설정(resultCode 0000,1000)
							$scope.postParams.priceMinUTemp = $data.price.min;
							$scope.postParams.priceMaxUTemp = $data.price.max;


        					// 검색결과 없음
        					$scope.uiStateObj.emptyResult = true;// UI
        					$scope.uiStateObj.emptyKeyword = false;// UI

        					/*N : 검색결과 없음*/
        					$scope.srhResultData.tCnt = $data.tCnt; /*총 검색결과 수*/
        					$scope.srhResultData.missKeyword = $data.missKeyword; /*오탈자 검색어*/
        					
							
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
					
					var sessionScopeData = LotteStorage.getSessionStorage($scope.screenID + "srhLst", 'json');

					if(sessionScopeData && 
						LotteStorage.getSessionStorage($scope.screenID + 'srhLstLoc') == $location.absUrl() &&
						$scope.locationHistoryBack){
							
						if (sessionScopeData.srhResultData == undefined || typeof sessionScopeData.srhResultData.resultCode == "undefined") { // SessionStorage에 resultCode가 없다면 데이터 로드 하기
        					try { console.log('Data Load'); } catch (e) {}
        					$scope.loadDataParams(); // 데이터 로드
        					
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
        					}, 100);
							
        					LotteStorage.delSessionStorage($scope.screenID + 'srhLstLoc'); // 세션스토리지에 저장된 현재 URL 삭제
        					LotteStorage.delSessionStorage($scope.screenID + 'srhLst'); // 세션스토리지에 저장된 검색결과리스트 데이터 삭제
							LotteStorage.delSessionStorage($scope.screenID + 'srhLstNowScrollY'); // 세션스토리지에 저장된 스크롤 위치 삭제

        				}
            			
            		}else{

						//console.warn("NEW VISIT");
            			if(location.host.indexOf("localhost")>=0){
            				// local
            			}else{
            				history.replaceState({name:"catesub"}, "catesub");
						}
            			//try { console.log('Data Load'); } catch (e) {}
						$scope.loadDataParams(); // 데이터 로드
						
            		}
        	
        	
        			/*페이지 unload 시 세션스토리지 저장*/
        			angular.element($window).on("unload", function(){
						var sess = {};// 세션에 담을 Object 생성
						
    					
    					sess.uiStateObj = $scope.uiStateObj;// UI 상태값 저장
    					sess.postParams = $scope.postParams;// 전송 데이터 저장 Input Param
    					sess.srhResultData = $scope.srhResultData;// 검색 결과
    					sess.srhDetailData = $scope.srhDetailData;// 상세 검색 활성화 여부
    		
						LotteStorage.setSessionStorage($scope.screenID + 'srhLstLoc', $location.absUrl());// 세션스토리지에 현재 URL 저장
						LotteStorage.setSessionStorage($scope.screenID + 'srhLst', sess, 'json');// 세션스토리지에 데이터를 JSON 형태로 저장
						LotteStorage.setSessionStorage($scope.screenID + 'srhLstNowScrollY', angular.element($window).scrollTop());// 세션스토리지에 스크롤 위치 저장
        			});
        			
        			// 상태 변경 이벤트
        			angular.element($window).on("popstate", function(event){
        				$scope.tipShow = false;
        				if($scope.curSideStatus == 2){
        					$scope.closeSideSearch();
        				}else{
                            if($scope.searchUISetting.isShowSideBar){ //20180521 특정 아이폰 버전에 대한 대
        					   history.back();
                            }
        				}
        			});
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
        			if($scope.curSideStatus < 2){
        				$scope.curSideStatus++;
        				history.pushState($scope.curSideStatus, $scope.curSideStatus, $window.location.href);
        			}
        		};
				
				/**
				 * 사이드바 닫기 버튼 클릭
				 */
				$scope.closeSidebarBtnClk = function(){
					$scope.searchTclick2016("L", "Btn_Close");
					$scope.ga("필터_닫기", "닫기");
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
					$scope.actionbarHideFlag = false;

					$scope.goPrevSideStatus();
					if($scope.curSideStatus > 1){
						$scope.goPrevSideStatus();
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
						$scope.searchUISetting.slide = null, //탭 선택
						$scope.searchUISetting.lastSlide = "", //탭 이전 선택
						$scope.searchUISetting.searchSlide = true; //결과내검색 선택
						$scope.actionbarHideFlag = true;
						$scope.dimmedOpen({
							target: "sideSearch",
							callback: $scope.closeSideSearch,
							scrollEventFlag: false
						});
						
						$(".side_search_wrap .ssw_content .ssw_slide.sub").scrollTop(0);// 서브슬라이드 상단으로 스크롤
						// if(shortcut=="SORT"){
						// 	$scope.showSubSearch({currentTarget:$(".ssw_slide.main li a[data-label='정렬']")});
						// }
						$scope.goNextSideStatus();
						angular.element(".ssw_slide.main").unbind("scroll").bind("scroll", sswSlideMainScroll);
						$timeout(sswSlideMainScroll, 100);

					}
					
					if(shortcut=="SORT"){
						$scope.searchTclick2016('C', 'Clk_Sort');//정렬
					}else{
						$scope.searchTclick2016('C', 'Clk_Detail');//상세검색
					}
				};
				
				$scope.currentFixedTab = "category";

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
					var t = angular.element(".ssw_content .fixed_tab").offset().top ;// + 20;
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
						if(target && target.length){
							$(".ssw_slide.main").scrollTop(0);
							$(".ssw_slide.main").scrollTop($(target).position().top);
						}
					}
				};

				/**
				 * 상세검색 서브 열기
				 */
				$scope.showSubSearch = function(e){
					
					var a = $(e.currentTarget);
					var slide = a.data("slide");

					$timeout(sswSlideMainScroll, 10);
					$timeout(function(){$scope.scrollFilterTop(a.parents(".foldable_tab"))}, 20);

					if(slide == "research"){
						$scope.searchUISetting.searchSlide = !$scope.searchUISetting.searchSlide;
					}else{
						if($scope.searchUISetting.lastSlide == slide){
							$scope.searchUISetting.slide = null;
							$scope.searchUISetting.lastSlide = "";
							return;
						}else{
							$scope.searchUISetting.title = a.data("label");
							$scope.searchUISetting.slide = slide;
						}
						
						$scope.searchUISetting.lastSlide = slide;
					}
					
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
							$scope.ga("카테고리", "리스트메뉴");
							break;
						case "brand":
							$scope.searchTclick2016('L', 'Clk_Brand');
							$scope.ga("브랜드", "리스트메뉴");
							break;
						case "delivery":
							$scope.ga("배송", "리스트메뉴");
							break;
						case "color":
							$scope.searchTclick2016('L', 'Clk_Clr');
							$scope.ga("컬러", "리스트메뉴");
							break;
						case "store":
							$scope.ga("매장", "리스트메뉴");
							break;
						case "price":
							$scope.searchTclick2016('L', 'Clk_Prc');
							$scope.ga("가격혜택선물포장", "리스트메뉴");
							break;
						case "research":
							$scope.searchTclick2016('L', 'Clk_Kwd');
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
					}
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

				$scope.positionSortGuide = function(){
					$("#pop_sortGuide").css("top", $("#sortGuideButton").offset().top + 28);
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
					if(!$scope.postParams.smpBranchNo){
						$scope.postParams.smpBranchNo = '';
						$scope.postParams.smpickYN = "N";
						//$scope.srhDetailPost();//상세검색 조회 //전체 항목이 삭제되서 호출하면 안됨
						$scope.ga("배송", "스마트픽_백화점픽업");
					}

					// 전체인 상태로 펼칠때에 자동 조회하기
					// if($scope.searchUISetting.smartPickList && $scope.postParams.smpBranchNo==''){
					// 	$scope.smpickBranchChange({'name':'전체', 'branchNo':''});
					// }
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
					$scope.searchTclick2016("L", "Dlr_01");
					$scope.ga("배송", "스마트픽_백화점픽업_" + item.name);
				};
				
				$scope.showDeliveryGuide = function(){
					window.alert("내 주변 픽업 서비스는 세븐일레븐 / 하이마트 / 롯데슈퍼 / 롯데리아에서 픽업이 가능합니다.");
					$scope.searchTclick2016("L", "Dlr_02_tip");
				};
				
				/**
				 * 카테고리 아이템 클릭
				 */
				
				$scope.categoryItemClick = function(e, item){
					var a = $(e.currentTarget);
					var li = a.parent();
					var depth = li.data("depth");

					/*  ga코드 */
					var gaCateName = "";
					var gaCateNameArr = [];


					if(item.checked == true ){
						gaCateName ="해제_";
					}

					if( li.data("name")){
						gaCateNameArr.push(li.data("name"));
					}

					var parentCate = li.parents("[data-depth]");
					var panretLen = parentCate.length;

					for(var i=0; i<panretLen; i++ ){
						gaCateNameArr.push($(parentCate[i]).data("name"));
					}
					gaCateName = gaCateName + gaCateNameArr.reverse().join("_");
					$scope.ga("카테고리", gaCateName);
					/* //ga코드 */

					if(item.checked === true){
						item.checked = false;

						/* 체크해제하면 상위 ctgNo 값 체크하여 checked  한다 */
						var parentDepthNode = li.parents("[data-depth]");
						if(parentDepthNode.length > 0){
							var parentNo = $(parentDepthNode[0]).data("no");
							$scope.setCtgLstChecked($scope.srhResultData.ctgLst.items , parentNo);
						}
						/* 해당 depth의 선택 값을 삭제한다 */
						$scope.uiStateObj.selectedCategory["depth" + (parseInt(depth)+1)] = "";
						

					}else{
						srhFilterSubCtgInit($scope.srhResultData.ctgLst, item.ctgDepth);// 하위 카테고리 초기화 (checked=false subChecked=false 설정)
						item.checked = true;
					}
					
					$scope.categoryAccordian(li, item); // class open 추가
					
					categoryUpdateSelected(); // 전체 checked subChecked 설정 , 선택된 ctgNo 설정

					//0뎁 닫으면 강제 open 초기화
					if(depth == 0 && item && item.checked == false){
						$scope.uiStateObj.arrOpenCtgCd = [];
					}

					if(item.checked){
						$scope.srhSubCtgPost(depth + 1, item);
					}else{
						$scope.srhSubCtgPost(depth, item);
					}

				};
				
				/* 카테고리 데이터를 loop 하여 ctgNo 와 일치한 값의 checked 를 true 한다 */
				$scope.setCtgLstChecked = function(ctgData , ctgNo){
					angular.forEach(ctgData , function(ctg){
						if(ctg.ctgNo == ctgNo){
							ctg.checked = true;
							return;
						}
						if(ctg.subCtgLst && ctg.subCtgLst.items){
							$scope.setCtgLstChecked(ctg.subCtgLst.items , ctgNo);
						}
					})
				}

				/**
				 * 카테고리 펼치기/닫기
				 */
				$scope.categoryAccordian = function(li, item){
					
					var ul = li.find("> ul");
					
					// 서브카테가 있는 경우
					if(ul.length > 0){
						if(li.hasClass("open")){
							li.removeClass("open");
						}else{
							li.addClass("open");
						}
					}

					//0뎁스는 다른 0뎁스 닫아서 높이가 바뀌어 선택한 필터가 안보임
					// if($(li).position()){
					// 	var scrollBox = $(".ssw_slide.main");
					// 	var scrollBoxTop = scrollBox.scrollTop();
					// 	var selectTop = $(li).position().top;
					// 	if(scrollBoxTop > selectTop && ul.length > 0){
					// 		scrollBox.scrollTop(selectTop);
					// 	}
					// }
					
					
				};
				
				
				/**
				 * 선택된 카테고리 리스팅
				 */
				function categoryUpdateSelected(){
					var d1 = "";
					var d2 = "";
					var d3 = "";
					var d4 = "";
					var d5 = "";
					
					var nm = [];
					var checkedArr = [];
					
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
															
															d5 = ctg5.ctgNo;
															nm.push(ctg5.ctgName);
															checkedArr.push(ctg5.ctgNo);
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
													
													d4 = ctg4.ctgNo;
													$scope.uiStateObj.selectedCategory.depth5 = "";
													nm.push(ctg4.ctgName);
													checkedArr.push(ctg4.ctgNo);
												}
											});
											// 4 depth
										}
										
										if(ctg3.checked === true){
											ctg1.checked = false;
											ctg2.checked = false;
											ctg1.subChecked = true;
											ctg2.subChecked = true;
											
											d3 = ctg3.ctgNo;
											$scope.uiStateObj.selectedCategory.depth4 = "";
											$scope.uiStateObj.selectedCategory.depth5 = "";
											nm.push(ctg3.ctgName);
											checkedArr.push(ctg3.ctgNo);
										}
									});
									// 3 depth
								}

								if(ctg2.checked === true){
									ctg1.checked = false;
									ctg1.subChecked = true;
									
									d2 = ctg2.ctgNo;
									$scope.uiStateObj.selectedCategory.depth3 = "";
									$scope.uiStateObj.selectedCategory.depth4 = "";
									$scope.uiStateObj.selectedCategory.depth5 = "";
									nm.push(ctg2.ctgName);
									checkedArr.push(ctg2.ctgNo);
								}
								
							});
							// 2 depth
						}
						
						if(ctg1.checked === true){
							d1 = ctg1.ctgNo;
							$scope.uiStateObj.selectedCategory.depth2 = "";
							$scope.uiStateObj.selectedCategory.depth3 = "";
							$scope.uiStateObj.selectedCategory.depth4 = "";
							$scope.uiStateObj.selectedCategory.depth5 = "";
							nm.push(ctg1.ctgName);
							checkedArr.push(ctg1.ctgNo);
						}
					});
					// 1 depth
					
					$scope.uiStateObj.srhFilterCtgFlag = (nm.length > 0);
					
					$scope.uiStateObj.selectedCategory.depth1 = d1.length > 0 ? d1 : $scope.uiStateObj.selectedCategory.depth1;
					$scope.uiStateObj.selectedCategory.depth2 = d2.length > 0 ? d2 : $scope.uiStateObj.selectedCategory.depth2;
					$scope.uiStateObj.selectedCategory.depth3 = d3.length > 0 ? d3 : $scope.uiStateObj.selectedCategory.depth3;
					$scope.uiStateObj.selectedCategory.depth4 = d4.length > 0 ? d4 : $scope.uiStateObj.selectedCategory.depth4; 
					$scope.uiStateObj.selectedCategory.depth5 = d5.length > 0 ? d5 : $scope.uiStateObj.selectedCategory.depth5;
					$scope.uiStateObj.selectedCategory.ctgName = nm;
					
					$scope.postParams.ctgNo = checkedArr.join(",");

				};
				
				/**
				 * 서브 카테고리(대카) 선택
				 * @param depth 카테고리 뎁스
				 * @param ctgno 카테고리 번호
				 * @param nolist 리스트 로드 방지
				 */
				$scope.srhSubCtgPost = function (depth, item, nolist){
					
					/*중카 :1 선택이면 dtCtgNo 보낸다*/
					if(depth == 1 && item && item.checked){
						$scope.postParams.dtCtgNo = item.dtCtgNo;
					}

					$scope.postParams.dtDsCtgDepth = depth +1;
					$scope.postParams.ctgDepth = depth +1;
					$scope.postParams.dsCtgDepth = depth +1;
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
						$scope.uiStateObj.brandArr.push(item);

						angular.forEach($scope.srhResultData.brdLst.items,function(brdItem){
							if(brdItem.brdNo == item.brdNo){
								brdItem.checked = true;
							}
						});
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
						$scope.postParams.rtnType = "B";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				};
				
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
							$scope.ga("브랜드", "해제_요약_" + item.brdName);
						}
					}
					
					for(var i =0; i<$scope.srhResultData.brdLst.items.length; i++){
						var obj = $scope.srhResultData.brdLst.items[i];
						if(obj.brdNo == item.brdNo){
							$scope.srhResultData.brdLst.items[i].checked = null;
						}
					}
					
					if ($scope.postParams.brdNoArr.length > 0) {//선택된 값이 있을 경우
						$scope.uiStateObj.srhFilterBrdFlag = true;
					} else {
						$scope.uiStateObj.srhFilterBrdFlag = false;
					}

					//POST
					$scope.postParams.rtnType = "B";
					$scope.loadDataParams($scope.postParams.rtnType);
				};
				
				/**
				 * 브랜드 리스트 정렬조건 변경
				 */
				$scope.srhFilterBrdSortChange = function (type) {
					console.log("srhFilterBrdSortChange")
					// 20161201 박형윤 추가 --
					
					$scope.srhResultData.brdLst.items = $filter('orderBy')($scope.srhResultData.brdLst.items, $scope.uiStateObj.srhFilterBrdSort);
					$scope.srhResultData.brandList.items = $filter('orderBy')($scope.srhResultData.brandList.items, $scope.uiStateObj.srhFilterBrdSort);
					
					if (typeof $scope.srhResultData.brdLst.tcnt != "undefined" &&
						$scope.srhResultData.brdLst.tcnt > 0 &&
						typeof $scope.srhResultData.brdLst.items != "undefined") {
						//$scope.srhResultData.brdLstRender = $scope.srhResultData.brdLst.items.slice(0, 50);
						$scope.srhResultData.brdLstRender = $scope.srhResultData.brandList.items;//$scope.srhResultData.brdLst.items;//.slice(0, 50);
					}

					if(type == "-cnt"){
						$scope.searchTclick2016("L", "Brand_02");
						$scope.ga("브랜드", "상품많은순");
					}else{
						$scope.searchTclick2016("L", "Brand_01");
						$scope.ga("브랜드", "가나다");
					}

				};
				
				/**
				 * 정렬 레이어 보기
				 */
				$scope.showHideSortPop = function(visible){
					$scope.sortLayerPopVisible = visible;
					if(visible){
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
						case 0 : 
							$scope.searchTclick2016("L", "Sort_01"); 
							$scope.ga("판매순", "", "sort");
							break; //판매BEST
                            
						case 1 : 
							$scope.searchTclick2016("L", "Sort_02"); 
							$scope.ga("높은가격순", "", "sort");
							break; //높은가격순

						case 2 : 
							$scope.searchTclick2016("L", "Sort_04"); 
							$scope.ga("낮은가격순", "", "sort");
							break; //낮은가격순
						case 3 : 
							$scope.searchTclick2016("L", "Sort_05");
							$scope.ga("상품평많은순", "", "sort");
							break; //상품평많은순
						case 4 : 
							$scope.searchTclick2016("L", "Sort_06"); 
							$scope.ga("MD추천순", "", "sort");
							break; //MD 추천순
						case 5 : 
							$scope.searchTclick2016("L", "Sort_03");
							$scope.ga("최근등록순", "", "sort");
							break; //최근등록순
					}
					
					$scope.scrollToTop();
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
				 * Price 변경
				 */
				// $scope.srhPricePost = function (item) {
				// 	$scope.uiStateObj.priceTypeIdx = item.shortIdx;
				// 	$scope.uiStateObj.srhFilterPriceFlag = true;
					
				// 	switch (item.shortIdx) {
				// 	case 0 : $scope.searchTclick2016("L", "Prc_01"); break;
				// 	case 1 : $scope.searchTclick2016("L", "Prc_02"); break;
				// 	case 2 : $scope.searchTclick2016("L", "Prc_03"); break;
				// 	case 3 : $scope.searchTclick2016("L", "Prc_04"); break;
				// 	case 4 : $scope.searchTclick2016("L", "Prc_05"); break;
				// 	}
					
				// 	var arr = item.value.split(',');
				// 	var min = arr[0];
				// 	var max = arr[1];
				// 	$scope.postParams.priceMinU = min;
				// 	$scope.postParams.priceMaxU = max;
				// 	$scope.postParams.priceMinUTemp = min;
				// 	$scope.postParams.priceMaxUTemp = max;
					
				// 	$scope.srhDetailSearchPrice();
					
				// 	angular.element('.ssws_wrap.ssws_price .price.openable').removeClass('open');
				// };
				
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
					$scope.searchTclick2016("L", "Clr_Opt");
					$scope.ga("컬러", item.colorCd);

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
							//$scope.postParams.selectedStyleNmArr.splice(idx, 1);
						}
						
					}else{
						// 선택
						item.selected = true;
						if(idx < 0){
							$scope.postParams.selectedStyle.push(item.feelNo);
							//$scope.postParams.selectedStyleNmArr.push(item);
						}
					}
					$scope.ga("스타일", item.feelNm);

					if(noload!=="N"){
						$scope.srhDetailSearchActiveChk();//상세검색 활성화 여부 검증
						$scope.srhDetailPost();//상세검색 조회
					}
				};

				/*상세조건 활성화 여부*/
				$scope.srhDetailSearchActiveChk = function () {
					var chkCnt = 0;

					//카테고리
					if($scope.postParams.ctgNo){
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
					if($scope.postParams.smpickYN =='Y' || $scope.postParams.isCrsPickYn =='Y' || $scope.postParams.freeDeliYN =='Y'|| $scope.postParams.isDlvQuick =='Y' || $scope.postParams.isDlvToday =='Y' ){
						chkCnt++;
					}

					// 선택된 컬러 체크
					if($scope.postParams.selectedColor.length > 0){
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
						case "deptYN"://롯데백화점
							$scope.searchTclick2016("L", "Clk_Dep");
							$scope.ga("매장", "백화점");
							break; //롯데백화점
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
						
						case "freeDeliYN"	: 
							$scope.searchTclick2016("L", "Clk_Fdlr");
							$scope.ga("배송", "무료배송");
							break; //무료배송
						case "smpickYN"		: 
							$scope.searchTclick2016("L", "Opt_02"); 
							break; //스마트픽
						case "freeInstYN"	: 
							$scope.searchTclick2016("L", "Prc_06");
							$scope.ga("가격혜택선물포장", "무이자할부");
							break; //무이자
						case "pointYN"		: 
							$scope.searchTclick2016("L", "Prc_07");
							$scope.ga("가격혜택선물포장", "포인트적립");
							break; //포인트
						case "isCrsPickYn"	: 
							$scope.searchTclick2016("L", "Dlr_02"); 
							$scope.ga("배송", "스마트픽_내주변픽업");
							break;//내 주변 픽업
						case "isDlvToday"	: 
							$scope.searchTclick2016("L", "Dlr_03");
							$scope.ga("배송", "오늘도착"); 
							break;//오늘배송
						case "isDlvQuick"	: 
							$scope.searchTclick2016("L", "Dlr_04"); 
							$scope.ga("배송", "퀵배송");
							break;//퀵배송
						case "pkgYN"	: 
							$scope.ga("가격혜택선물포장", "무료선물포장");
							break;//무료선물 포장
						case "freeGiftYN"	:  
							$scope.ga("가격혜택선물포장", "사은품포함");
							break;//사은품제공
					}
					
					$scope.srhDetailPost(); //상세검색 조회
				};
				
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
				};
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
					
					if(btnClicked === true){
						$scope.searchTclick2016("L", "Prc_Btn");
						$scope.ga("가격혜택선물포장", "가격검색");
					}
					
				};
				
				$scope.srhDetailSearchFocus = function(){
					$scope.actionbarHideFlag = true;
					$scope.searchUISetting.keywordIncExc = false;
					$scope.searchUISetting.focusIn = true;
					$(".ssw_slide.main").animate({ scrollTop: $(document).height()}, 600);
					$('.ssws_wrap').css('margin-bottom', 0);
					$('.side_search_wrap .ssw_content').css('bottom', 0);
				};
				
				$scope.srhDetailSearchBlur = function(){
					$scope.actionbarHideFlag = false;
					$scope.searchUISetting.focusIn = false;
					//$('.ssws_wrap').css('margin-bottom', '40px');
					$('.side_search_wrap .ssw_content').css('bottom', '50px');
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
						$scope.ga("결과내검색", "포함단어_" + $scope.postParams.rekeyword);
					}else{
						$scope.addExqueryKeyword($scope.postParams.rekeyword);// 제외단어
						$scope.ga("결과내검색", "제외단어_" + $scope.postParams.rekeyword);
					}
					$scope.postParams.rekeyword = "";
					$scope.searchTclick2016("L", "Kwd_Btn");
					$scope.showSubSearch({currentTarget:{}});//폴더 닫히기
					$scope.closeSideSearch();// 사이드바 닫기
				};

				/*키보드 검색 엔터시*/
				$scope.srhDetailSearchKeypress = function (e) {
					if (e.which === 13) {
						$('#rekeyword').blur();
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
						$scope.ga("결과내검색", "해제_" + keyword );
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
						$scope.ga("결과내검색", "제외해제_" + keyword );
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
				// 포함/제외단어 선택
				$scope.selectKeywordLayer = function(idx){
					$scope.searchUISetting.researchIdx = idx;
				};
				
				$scope.selectKeywordLayer2 = function(){
					$scope.uiStateObj.researchOpt = $scope.uiStateObj.researchCheck ? "brdName" : "-cnt";
					$scope.searchUISetting.researchIdx = $scope.uiStateObj.researchCheck ? 1 : 0;
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
					
					$scope.postParams.rtnType = "K";
					$scope.loadDataParams($scope.postParams.rtnType);// 결과 조회
				};
				
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
				};
				
				
				/**
				 * 검색 필터 - 상세검색 초기화 (카테고리 , 브랜드 제외)
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

				};
				
				/**
				 * 초기화 버튼 비활성 체크
				 */
				$scope.checkResetDisabled = function(flag){
					$scope.srhDetailSearchActiveChk();// 상세 선택여부 체크
					return $scope.uiStateObj.srhFilterDetailFlag;
				};

				
				/**
				 * 전체 초기화 (초기화 버튼)
				 */
				$scope.resetAllSearchTerm = function(){
					
					$(".side_search_wrap .ssw_content .ssw_slide.sub").scrollTop(0);
					//$scope.showSubSearch({currentTarget:{}});//폴더 닫히기
					// 전체 초기화
					$scope.srhFilterCtgInit();// 카테고리 초기화
					$scope.srhFilterBrdInit();// 브랜드 초기화
					$scope.srhFilterRequeryInit(true); //나머지 초기화
					$scope.searchTclick2016("L", "Btn_Reset");
					$scope.ga("필터_초기화", "초기화");
					
				};
				
				// 카테고리 초기화
				$scope.srhFilterCtgInit = function (reload) {
					// reset data
					$scope.uiStateObj.srhFilterCtgFlag = false;
					$scope.uiStateObj.srhFilterCtgDepth = 0;
					$scope.uiStateObj.srhFilterCtgDepth1CtgNo = "";
					
					
					$scope.uiStateObj.selectedCategory.depth1 = "";//null;
					$scope.uiStateObj.selectedCategory.depth2 = "";//null;
					$scope.uiStateObj.selectedCategory.depth3 = "";//null;
					$scope.uiStateObj.selectedCategory.depth4 = "";//null;
					$scope.uiStateObj.selectedCategory.depth5 = "";//null;

					$scope.uiStateObj.selectedCategory.ctgName = [];//"";
					$scope.postParams.ctgNo = "";
					$scope.postParams.ctgDepth = 0;
					$scope.postParams.dsCtgDepth = 0;
					$scope.postParams.dtDsCtgDepth = 2;
					srhFilterSubCtgInit($scope.srhResultData.ctgLst);
					// 열린카테고리 저장 초기화
					$scope.uiStateObj.arrOpenCtgCd = [];
					
					// reset UI
					var li;
					$(".ssws_wrap.ssws_category li.open").each(function(idx, itm){
						li = $(itm);
						li.removeClass("open");
					});
					
					//POST
					if(reload === true){
						$scope.postParams.rtnType = "C";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				};
				
				/**
				 * 서브카테고리 초기화
				 */
				function srhFilterSubCtgInit(cate, targetDepth){
					if(cate == undefined || cate.items == undefined){ return; }
					
					var items = cate.items;
					angular.forEach(items, function(ctg){
						// if(!targetDepth || targetDepth !== ctg.ctgDepth){
						// 	ctg.checked = false;
						// 	ctg.subChecked = false;
						// 	ctg.subHeight = 0;
						// }
						ctg.checked = false;
						ctg.subChecked = false;
						srhFilterSubCtgInit(ctg.subCtgLst, targetDepth);
					});
				};
				
				// 브랜드 초기화
				$scope.srhFilterBrdInit = function (reload) {
					
					$scope.uiStateObj.srhFilterBrdFlag = false;
					$scope.postParams.brdNoArr = [];
					$scope.postParams.brdNmArr = [];
					$scope.uiStateObj.brandArr = [];

					$scope.uiStateObj.srhFilterBrdSort = "brdName";
					
					angular.forEach($scope.srhResultData.brdLst.items, function (item, idx) {
						item.checked = false;
					});
					angular.forEach($scope.srhResultData.brdLstRender, function(item, idx){
						item.checked = false;
					});

					//POST
					if(reload === true){
						$scope.postParams.rtnType = "B";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				};

				// 정렬  초기화
				$scope.srhFilterSortInit = function (reload) {
					$scope.uiStateObj.srhFilterSortFlag = false;
					var qsort = parseInt(commInitData.query["sort"], 10);

					if(!isNaN(qsort)){
						$scope.uiStateObj.sortTypeIdx = qsort;
						for(var i = 0; i<$scope.uiStateObj.sortTypeArr.length; i++){
							if($scope.uiStateObj.sortTypeArr[i].shortIdx == qsort){
								$scope.uiStateObj.sortTypeIdx = i;
								break;
							}
						}

						if($scope.uiStateObj.sortTypeIdx > $scope.uiStateObj.sortTypeArr.length -1){
							$scope.uiStateObj.sortTypeIdx = $scope.uiStateObj.sortTypeArr.length -1;
						}else if($scope.uiStateObj.sortTypeIdx < 0){
							$scope.uiStateObj.sortTypeIdx = 0;
						}

						$scope.postParams.sort = $scope.uiStateObj.sortTypeArr[$scope.uiStateObj.sortTypeIdx].value;

					}

					//POST
					if(reload === true){
						$scope.postParams.rtnType = "S";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				};

				// 가격대 초기화
				$scope.srhFilterPriceInit = function(reload){
					$scope.uiStateObj.srhDetailSearchClicked = false;
					$scope.postParams.priceMinU = null;
					$scope.postParams.priceMaxU = null;

					//$scope.postParams.priceMinU = $scope.srhResultData.price.min;
					//$scope.postParams.priceMaxU = $scope.srhResultData.price.max;
					//$scope.postParams.priceMinUTemp = null;
					//$scope.postParams.priceMaxUTemp = null;

					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};

				// 혜택 ,사은품 , 선물포장 초기화
				$scope.srhFilterBenefitInit = function(reload){
					$scope.postParams.freeInstYN = "N";//무이자
					$scope.postParams.pointYN = "N";//포인트적립
					$scope.postParams.pkgYN = "N"; //선물포장
					$scope.postParams.freeGiftYN = "N";//사은품
					
					//POST
					if(reload === true){
						$scope.srhDetailPost();//상세검색 조회
					}
				};

				// 배송 초기화
				$scope.srhFilterDeliveryInit = function(reload){
					$scope.postParams.smpickYN = "N"; //스마트픽
					$scope.searchUISetting.smartPickList = false; //백화점 픽업리스트 보여주기 여부
					$scope.postParams.smpBranchNo = null;// 백화점 스마트픽 번호
					$scope.uiStateObj.smpickBranchName = "";  //백화점 선택 스마트픽 이름

					$scope.postParams.isCrsPickYn = "N"; //내 주변 픽업
					$scope.postParams.freeDeliYN = "N";//무료배송
					$scope.postParams.isDlvQuick = "N"; //퀵배송
					$scope.postParams.isDlvToday = "N"; //오늘 도착
					
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
				};
				
				// 카테고리 브랜드 외 나머지 초기화
				$scope.srhFilterRequeryInit = function(reload){
					
					$scope.srhFilterCtgInit();
					$scope.srhFilterBrdInit();
					$scope.srhFilterDetailInit();

					//결과 내 검색
					$scope.srhFilterResearchInit();
					
					//POST
					if(reload === true){
						$scope.postParams.rtnType = "K";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				};
				
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
				};

				// 스타일 초기화
				$scope.srhFilterFeelInit = function(reload){
					$scope.postParams.selectedStyle.length = 0;
					//$scope.postParams.selectedStyleNmArr.length = 0;
					
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
				 * 페이지 상단으로 스크롤
				 */
				$scope.scrollToTop = function(){
					var st = $(window).scrollTop();
					if(st > 1){
						$(window).scrollTop(1);
					}
				}
				
				startSearchList();// 검색 콘트롤 시작하기
				
				/**
				 * 폰트 사이즈 변경
				 */
				$scope.changeFontSize = function(){
					var body = angular.element("body");
					if(body.hasClass("enlargeFont")){
						body.removeClass("enlargeFont");
						LotteStorage.delSessionStorage($scope.screenID + "_fontsize");
						$scope.searchTclick2016('L', 'Clk_Text02');
					}else{
						body.addClass("enlargeFont");
						LotteStorage.setSessionStorage($scope.screenID + "_fontsize", "1");
						$scope.searchTclick2016('L', 'Clk_Text01');
					}
				};
				function checkFontSize(){
					var ft = LotteStorage.getSessionStorage($scope.screenID + "_fontsize");
					if(ft === "1"){
						angular.element("body").addClass("enlargeFont");
					}
				}
				checkFontSize();
            }
        };
        
	}]);//directive

})(window, window.angular);