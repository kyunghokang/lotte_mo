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
	app.controller('SearchList', ['$scope', '$http', '$filter', '$location', '$window', '$timeout', 'LotteCommon', 'LotteUtil', 'commInitData', 'LotteStorage', 'LotteUserService','$compile', function($scope, $http, $filter, $location, $window, $timeout, LotteCommon, LotteUtil, commInitData, LotteStorage, LotteUserService, $compile) {	
		$scope.curDispNoSctCd = "50"; /*인입 전시 코드 (검색 : 50, 기획전/하프찬스 : 20), PC : infw_disp_no_sct_cd*/
		$scope.curDispNo="1749096";

		$scope.showWrap = true; /*Wrapper Show/Hide*/
		$scope.contVisible = true; /*Container Show/Hide*/
		$scope.searchResultList = true; /*Search List Container Show/Hide*/
		$scope.subTitle = "검색결과페이지"; /*서브헤더 타이틀*/
		$scope.templateType = 'list';
		$scope.screenID = "SrhResult";
		$scope.isShowLoading = false; /*Ajax 로드 Flag 초기화*/
		$scope.productListLoading = false;
		$scope.productMoreScroll = true;
		$scope.tipShow = false; //툴팁
		$scope.showColorSearchGuide = false;/* 컬러검색 안내 레이어 */
		/**
		 * Object 정의
		 */
		$scope.uiStateObj = { /*UI 상태값 저장*/
			otherStore: false, /* 다른 매장 팝업 */
			templateType: 'list', /* 초기 템플릿 타입 */
			initFlag : true, /*최초 Flag*/
			ajaxFlag : false, /*Ajax 호출중 여부 Flag*/
			srhFilterSelectedIdx : -1, /*검색 필터 탭 활성화 인덱스*/
			reatedKeywordBtnFlag : false, /*연관검색어 버튼 활성화 여부 (Show/Hide)*/
			reatedOpen : false, /*연관검색어 열림/닫힘*/
			srhFilterCtgSelIdx : 0, /*검색 필터 - 카테고리 선택 인덱스*/
			srhFilterCtgDepth1CtgNo : "", /*선택된 대대카 카테고리 No*/
			srhFilterCtgDepth : 0, /*검색 필터 - 카테고리 활성화 depth*/
			srhFilterCtgFlag : false, /*검색필터 - 카테고리탭 조건 선택 여부*/
			srhFilterBrdFlag : false, /*검색필터 - 브랜드탭 조건 선택 여부*/
			srhFilterBrdSort : "-cnt", /*검색필터 - 브랜드탭 Sortting 값*/
			srhFilterDetailFlag : false, /*검색필터 - 상세검색 조건 선택 여부*/
			srhFilterDetailArr : ["deptYN", "tvhomeYN", "smpickYN", "brdstoreYN", "superYN", "bookYN", "freeDeliYN", "freeInstYN", "pointYN"], /*검색픽터 - 상세검색 체크 갯수 여부를 체크하기 위한 전체 탭 배열*/
			srhFilterSortFlag : false, /*검색필터 - Sortting 탭 조건 선택 여부*/
			sortTypeIdx : 0, /*검색필터 - Sortting 타입 Index*/
			sortTypeArr : [ /*검색필터 - Sortting Label 과 Value 배열*/
				{label : "인기 BEST", shortLabel : "인기순", value : "RANK,1" },
				{label : "판매 BEST", shortLabel : "판매순", value : "TOT_ORD_CNT,1" },
				{label : "상품평 많은순", shortLabel : "상품평", value : "TOT_REVIEW_CNT,1" },
				{label : "신상품순", shortLabel : "신상품", value : "DATE,1" },
				{label : "낮은가격순", shortLabel : "가격", value : "DISP_PRICE,0" },
				{label : "높은가격순", shortLabel : "가격", value : "DISP_PRICE,1" }
			],
			requeryTermInitFlag : false, /*검색필터 - 상세검색 재검색어 검색 여부 (재검색어 초기화를 위한 Flag)*/
			priceMinUFocus : false, /*검색필터 - 상세검색 최소가 input box focus여부*/
			priceMaxUFocus : false, /*검색필터 - 상세검색 최대가 input box focus여부*/
			emptyResult : false, /*검색 결과가 없는지에 대한 Flag*/
			emptyKeyword : false, /*검색 키워드가 없는지에 대한 Flag*/
			emptyPrdLstFlag : false, /*검색된 상품이 없는지에 대한 Flag*/
			ajaxPageEndFlag : false, /*마지막 페이지까지 로드 됐는지에 대한 Flag*/
			smpickLayerOpenFlag : false, /*스마트픽 지점 레이어 Open 여부*/
			smpickBranchName : "전체" /*검색필터 - 상세검색 - 스마트픽 셀렉트박스 label*/
		};

		$scope.postParams = { /*전송 데이터 저장 Input Param*/
			rtnType : "", /*조회 구분값 - P : 페이징, S : 정렬, D : 상세검색, T : 삭세검색 조건 활성화 여부 조회, B : 브랜드, C : 카테고리, 없음 - 전체*/
			keyword : "", /*검색어*/
			orgKeyword : "",
			imgListGbn : "L", /*이미지 사이즈 여부*/
			dpml_no : "1", /*몰 구분 (고정값 닷컴 1)*/
			dispCnt : 30, /*한페이지에 보여질 리스트 갯수*/
			page : 1, /*페이지 Number*/

			ctgNo : "", /*조회 카테고리 dispNo*/
			ctgDepth : 0, /*대대카  : 0, 대카 :1*/
			brdNoArr : [], /*조회 브랜드 brandNo 배열*/

			sort : $scope.uiStateObj.sortTypeArr[0].value, /*정렬 타입*/

			deptYN : "N", /*상세검색 - 롯데백화점여부*/
			tvhomeYN : "N", /*상세검색 - 롯데홈쇼핑 여부*/
			smpickYN : "N", /*상세검색 - 스마트픽 여부*/
			smpickBranchNo : "", /*상세검색 - 스마트픽 지점 번호*/
			brdstoreYN : "N", /*상세검색 - 브랜드스토어 여부*/
			superYN : "N", /*상세검색 - 슈퍼 여부*/

			freeDeliYN : "N", /*상세검색 - 무료배송 여부*/
			freeInstYN : "N", /*상세검색 - 무이자 여부*/
			pointYN : "N", /*상세검색 - 포인트 여부*/
			
			selectedColor : [],

			rekeyword : "", /*상세검색 - 결과내 검색어*/

			priceMinU : null, /*상세검색 - 최소가*/
			priceMaxU : null, /*상세검색 - 최대가*/

			isVoice: "N", // 201603 모바일 리뉴얼 추가 Parameter
			brdNm: "" // 201603 모바일 리뉴얼 추가 Parameter
		};

		$scope.srhResultData = {}; /*검색 결과*/
		$scope.prdDealList = [];

		$scope.srhDetailData = { /*상세 검색 활성화 여부*/
			srhTerms : {
				dept : false, /*롯데백화점 활성화 여부*/
				tvhome : false, /*롯데홈쇼핑 활성화 여부*/
				smpick : false, /*스마트픽 활성화 여부*/
				smpickBranch : [], /*스마트픽 지점 리스트*/
				brdstore : false, /*브랜드스토어 활성화 여부*/
				super : false /*슈퍼 활성화 여부*/
			},
			srhColorList:[]
		};

		/*페이지 인입시 처리*/
		$scope.postParams.keyword = decodeURI(commInitData.query.keyword); /*URL Params 얻어오기 (keyword)*/
		$scope.postParams.keyword = LotteUtil.replaceAll($scope.postParams.keyword, "+" ," ");
		$scope.postParams.orgKeyword = $scope.postParams.keyword;
		$scope.postParams.ctgNo = commInitData.query.cateNo; /*URL Params 얻어오기 (ctgNo)*/
		$scope.postParams.isVoice = commInitData.query.isVoice == "Y" ? "Y" : "N";

		// 음성 검색일 경우 서브헤더 타이틀을 "음성 검색결과" 로 고정
		if ($scope.postParams.isVoice == "Y" || $scope.postParams.isVoice == "T") {
			$scope.subTitle = "음성 검색결과";
		} else {
			$scope.subTitle = "'"+$scope.postParams.keyword.substring(0,20)+"'"+" 검색결과";
		}

		if ($scope.postParams.ctgNo) { /*레이어 검색에서 카테고리 정보가 넘어왔을 경우 해당 State로 맞춰주기*/
			$scope.uiStateObj.srhFilterCtgDepth1CtgNo = $scope.postParams.ctgNo;
			$scope.uiStateObj.srhFilterCtgDepth = 1;
			$scope.uiStateObj.srhFilterCtgFlag = true;
		}

		$scope.srhDataLoadURL = ""; /*AJAX 호출URL*/

		if ($scope.srhDataLoadURL == "") { /*호출 테스트 URL이 없을 경우 lotte-svc.js에 선언된 URL로 세팅*/
			$scope.srhDataLoadURL = LotteCommon.srhListData;
		}
		
		/* 컬러검색 안내 레이어 */
		if (localStorage.getItem("srhColorSearchGuide") != "Y") {
			$scope.showColorSearchGuide = true;
		}
		$scope.hideColorSearchGuide = function(){
			$scope.showColorSearchGuide = false;
			localStorage.setItem("srhColorSearchGuide", "Y");
		}
		
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
        $scope.survey_state = 0;
        $scope.survey_check = function(val, str){            
            $scope.survey_state = val;
            if(val > 1){
                var stfc_arr = [0, 0, 3, 1, 1, 2];
                var surveryParam = {
                    login_id : LotteUserService.getCookie("LOGINID"),
                    site_no : "1",
                    srchw_nm : $scope.srhResultData.keyword,
                    stfc_sct_cd : stfc_arr[val],
                    add_op_cont : str                
                }
                $http.get(LotteCommon.searchSurvery, {params:surveryParam}) 
                    .success(function (data) { /*호출 성공시*/
                     console.log("검색만족도 전송");
                });
            }
        }
        //검색만족도 위치 세팅 
        $scope.setSurveyPos = function(){
            //console.log("load and pos", $(".survey.inst").length);
           // console.log("--", $(".survey.inst").length, $(".unitWrap").find("ol > li").length, $scope.srhResultData.tCnt);
        	var rsnum = $(".unitWrap").find("ol > li").length;
        	if($(".survey.inst").length == 0){
                var kstr = $scope.srhResultData.keyword;  
                if(kstr != undefined && kstr.length > 6){
                    kstr = kstr.substring(0, 6) + '...';
                } 
                $scope.surKeyword = kstr;                 
                if(rsnum < 29){      
                    var ell = $compile($(".survey").clone().addClass("inst"))($scope);
                    $("#footer").before(ell);                    
                }else{
                    var pos = 29;
                    //20160120 상품갯수에 따른 위치 변경, 25, 33.33, 50, 100 4개 케이스
                    var liwidth = ($(".unitWrap").find("ol > li").width()/$(".unitWrap").width())*100; //상품리스트의 너비 % 
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
                    }
                    var ell = $compile($(".survey").clone().addClass("inst"))($scope);
                    $(".prod_list_01 > li").eq(pos).after(ell);   
                    $(".prod_list_02 > li").eq(pos).after(ell);     
                }               
            }else{
            	//갯수가 변경된 경우 
            	if(rsnum >= 30 && $(".unitWrap").find(".survey ").length == 0){
            		$(".survey.inst").remove();
                    var ell = $compile($(".survey").clone().addClass("inst"))($scope);
                    $(".prod_list_01 > li").eq(pos).after(ell);   
                    $(".prod_list_02 > li").eq(pos).after(ell); 
            	}            		
            }
            $(".caseA > .title > span").text($scope.surKeyword);
            $(".survey.inst").show();
        }   
        $scope.winW = $(window).width();    	
        angular.element($window).on({
            "click" : function () {
                setTimeout(function(){
                    $scope.setSurveyPos();                                        
                }, 100);    
            },
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
        
        // 템플릿 타입 저장
        $scope.saveTemplateType = function(type){
        	setCookie($scope.screenID+'TemplateTypeDC', type);
        }
        $scope.retriveTemplateType = function(){
        	var template = getCookie($scope.screenID+'TemplateTypeDC');
        	if(!(template == "image" || template == "swipe")){
        		template = "list";
        	}
        	$scope.templateType = template;
        	$timeout(function(){ $(".unitWrap").css("opacity", 1); }, 300);
        }
        
		$scope.loadMoreData = function() {
			var tClickStr = $scope.tClickBase + "SrhResult_Scl_Prd_page"+($scope.postParams.page+1);
			$scope.sendTclick(tClickStr); /* lotte-comm.js*/  /*TCLICK 수집*/
			
			$scope.postParams.rtnType = "P"; /*조회 구분값 P : 페이징으로 설정*/
			$scope.loadDataParams($scope.postParams.rtnType); /*결과값 조회*/
		}
		
		/*검색 데이터 로드*/
		$scope.lodaData = function (params) {
			var postParams = angular.extend({
					rtnType : "",
					keyword : "",
					imgListGbn : "L",
					dpml_no : "1",
					dispCnt : 30,
					page : 1
				}, params),
				loadURL = $scope.srhDataLoadURL;

			// 음성 검색 추가 파라메타 처리
			if ($scope.postParams.isVoice && $scope.postParams.isVoice != "") {
				postParams.isVoice = $scope.postParams.isVoice;
			}

			if ($scope.postParams.brdNm) {
				postParams.brdNm = $scope.postParams.brdNm;
			}

			if (!postParams.keyword) { /*검색어가 없을 경우 AJAX 호출 방지*/
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

			if ($scope.isShowLoading || $scope.productListLoading) { /*AJAX 호출중일 경우 호출 방지*/
				return false;
			}

			if (postParams.rtnType == "T") { /*상세검색 활성화 여부 조회일 경우 활성화여부 체크 AJAX URL로 세팅*/
				loadURL = LotteCommon.srhListTermData;
			}

			$scope.isShowLoading = true; /*AJAX 호출 Flag 활성화*/
			$scope.productListLoading = true;

			// 검색 상세 조건 조회
			$http.get(loadURL, {params:postParams}) /*AJAX 호출*/
				.success(function (data, status, headers, config) { /*호출 성공시*/
					$scope.dataLoadComplete(data);
					$scope.isShowLoading = false;
					$scope.productListLoading = false;
                    setTimeout(function(){
                        $scope.setSurveyPos();                                        
                    }, 500);
    				
    				$timeout(function(){
    					$scope.retriveTemplateType();
    				}, 0);
				})
				.error(function (data, status, headers, config) { /*호출 실패시*/
					$scope.isShowLoading = false;
					$scope.productListLoading = false;
				});
		}

		/*검색 데이터 타입별 Parameter 생성*/
		$scope.loadDataParams = function (type) {
			if ($scope.isShowLoading || $scope.productListLoading) /*전송 요청 중일 경우 중복 실행 방지*/
				return false;

			if (!type) { /*타입이 넘어오지 않았을 경우 default로 세팅*/
				type = "";
			}

			var loadParam = {}; /*전송 Parameter 초기화*/
			loadParam.page = 1; /*호출 페이지 초기화*/

			switch (type) {
				case "P" : /*페이징*/
					loadParam.page = ++$scope.postParams.page; /*페이지*/
				case "S" : /*정렬*/
					loadParam.sort = $scope.postParams.sort;
				case "D" : /*상세 검색*/
					if ($scope.postParams.rekeyword != "") { /*결과내 검색 키워드*/
						$scope.postParams.keyword +=  encodeURI(" " + $scope.postParams.rekeyword);
						$scope.postParams.orgKeyword = $scope.postParams.keyword; //20160119 조건검색시 세션스토리지 저장 관련 수정 
						$scope.postParams.rekeyword = ""; /*결과내 검색 키워드 초기화*/

						/*결과내 검색 키워드가 있을 경우 상세조건 비활성화 오류 방지를 위하여 '매장조건' 초기화*/
						$scope.postParams.deptYN = "N";
						$scope.postParams.tvhomeYN = "N";
						$scope.postParams.superYN = "N";
						$scope.postParams.brdstoreYN = "N";
						$scope.postParams.smpickYN = "N";
						/*$scope.postParams.bookYN = "N";*/

						$scope.uiStateObj.requeryTermInitFlag = true; /*결과내 검색 후 상세검색 조건 재로드를 위한 Flag 설정*/
					}

					if ($scope.postParams.deptYN == "Y") { /*롯데백화점 조건 선택 여부*/
						loadParam.deptYN = $scope.postParams.deptYN;
					}

					if ($scope.postParams.tvhomeYN == "Y") { /*롯데홈쇼핑 조건 선택 여부*/
						loadParam.tvhomeYN = $scope.postParams.tvhomeYN;
					}

					if ($scope.postParams.smpickYN == "Y") { /*스마트픽 조건 선택 여부*/
						loadParam.smpickYN = $scope.postParams.smpickYN;
					}

					if ($scope.postParams.smpickYN == "Y" && $scope.postParams.smpickBranchNo != "") { /*스마트픽 지점 번호 여부*/
						loadParam.smpickBranchNo = $scope.postParams.smpickBranchNo;
					}

					if ($scope.postParams.brdstoreYN == "Y") { /*브랜드스토어 조건 선택 여부*/
						loadParam.brdstoreYN = $scope.postParams.brdstoreYN;
					}

					if ($scope.postParams.superYN == "Y") { /*롯데슈퍼 조건 선택 여부*/
						loadParam.superYN = $scope.postParams.superYN;
					}

					if ($scope.postParams.freeDeliYN == "Y") { /*무료배송 조건 선택 여부*/
						loadParam.freeDeliYN = $scope.postParams.freeDeliYN;
					}

					if ($scope.postParams.freeInstYN == "Y") { /*무이자 조건 선택 여부*/
						loadParam.freeInstYN = $scope.postParams.freeInstYN;
					}

					if ($scope.postParams.pointYN == "Y") { /*포인트 조건 선택 여부*/
						loadParam.pointYN = $scope.postParams.pointYN;
					}

					if ($scope.postParams.priceMinU && $scope.postParams.priceMinU >= $scope.srhResultData.price.min) { /*최소가 조건 선택 여부*/
						loadParam.priceMinU = $scope.postParams.priceMinU;
					}

					if ($scope.postParams.priceMaxU && $scope.postParams.priceMaxU <= $scope.srhResultData.price.max) { /*최대가 조건 선택 여부*/
						loadParam.priceMaxU = $scope.postParams.priceMaxU;
					}
					
					loadParam.colorCd = $scope.postParams.selectedColor.join(",");/* colors */
				case "T" : /*상세 검색 조건 활성화 여부*/
				case "B" : /*브랜드 선택 검색*/
					if ($scope.postParams.brdNoArr && $scope.postParams.brdNoArr.length > 0) { /*선택된 브랜드가 있는지 판단*/
						loadParam.brdNo = $scope.postParams.brdNoArr.join(); /*Array 형태로 넘어가는데 개발쪽과 협의 필요*/
					}
				case "C" : /*카테고리 선택 검색*/
				default : /*기본*/
					if ($scope.postParams.ctgNo) { /*선택된 카테고리가 있는지 판단*/
						loadParam.ctgNo = $scope.postParams.ctgNo;
					}

					if ($scope.postParams.ctgNo && $scope.postParams.ctgDepth >= 0 && $scope.postParams.ctgDepth <= 1) { /*선택된 카테고리 depth가 정상적인지 판단*/
						loadParam.ctgDepth = $scope.postParams.ctgDepth;
					}

					loadParam.rtnType = type; /*요청 구분*/
					loadParam.keyword = "" + decodeURI($scope.postParams.keyword); /*검색 키워드*/
					/*loadParam.page = 1;*/ /*페이지*/
					loadParam.sort = $scope.postParams.sort; /*정렬 기준*/

					// 201603 모바일 리뉴얼 추가 - 박형윤
					loadParam.isVoice = $scope.postParams.isVoice; // 음성 검색 여부

					if ($scope.postParams.brdNm && $scope.postParams.brdNm != "") {
						loadParam.brdNm = $scope.postParams.brdNm;
					}
					break;
			}

			$scope.lodaData(loadParam);
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
				is_sale_promotion: 'goodsCmpsCd',
				outlnk : 'outlnk',
				outlnkMall : 'outlnkMall',
				curDispNo: 'curDispNo',
				has_coupon: 'useCpn',
				hash_list: 'hash_list'
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
				curDispNo: ''
			}
			var retData = [];
			angular.forEach(data, function(item, index) {
				//console.log(item);
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
				retData.push(newData); 
			});
			return retData;
		}
		
		$scope.getBrandSwipeSize = function() {
			if($scope.srhResultData.brdLst.items) {
				if($scope.srhResultData.brdLst.items.length) {
					var bNode = parseInt($scope.srhResultData.brdLst.items.length/8);
					if($scope.srhResultData.brdLst.items.length%8 != 0) {
						bNode++;
					}
					return new Array(bNode);
				}
			}
			return new Array(); 
		}
		
		/*데이터 로드 완료 핸들러*/
		$scope.dataLoadComplete = function ($data) {
			if ($data.resultCode) { /*결과 코드가 있을 경우에만 처리*/
				$scope.uiStateObj.initFlag = false;

				/*All : 항상*/
				$scope.srhResultData.resultCode = $data.resultCode; /*결과 코드*/
				$scope.srhResultData.keyword = $data.keyword; /*검색어*/

				// 201603 모바일 리뉴얼 추가 박형윤
				if ($data.isVoice && $data.isVoice != "") {
					$scope.postParams.isVoice = $data.isVoice;
				}

				if ($data.isVoice == "Y" || $data.isVoice == "T" && $data.keyword && $data.keyword != "" && $data.sortType && $data.sortType != "") {
					$scope.postParams.keyword = $data.keyword;
					$scope.postParams.sort = $data.sortType;

					var i = 0;

					for (i = 0; i < $scope.uiStateObj.sortTypeArr.length; i++) {
						if ($scope.uiStateObj.sortTypeArr[i].value == $scope.postParams.sort) {
							$scope.uiStateObj.sortTypeIdx = i;
						}
					}
				}

				if ($data.brdNm && $data.brdNm != "") {
					$scope.postParams.brdNm = encodeURI($data.brdNm);
				}

				if ($data.resultCode == "0000") { /*검색결과 있음*/
					$scope.uiStateObj.emptyResult = false; /*UI*/
					$scope.uiStateObj.emptyKeyword = false; /*UI*/

					/*검색결과 로드 완료 처리*/
					switch ($scope.postParams.rtnType) {
						case "" : /*기본*/
							$scope.srhResultData.ctgLst = $data.ctgLst; /*카테고리 리스트*/

							if ($scope.srhResultData.ctgLst.items && $scope.srhResultData.ctgLst.items.length > 0) { /*선택 카테고리가 있다면 그 카테고리 index를 구한다.*/
								angular.forEach($data.ctgLst.items, function (item, index) {
									if (item.ctgNo == $scope.uiStateObj.srhFilterCtgDepth1CtgNo) {
										$scope.uiStateObj.srhFilterCtgSelIdx = index;
										return false;
									}
								});
							}

							$scope.srhResultData.recomLink = $data.recomLink; /*추천 링크*/

							/*연관 검색어*/
							if ($data.reatedKeyword &&
								$data.reatedKeyword.responsestatus == 0 &&
								typeof $data.reatedKeyword.result[0] != "undefined" &&
								typeof $data.reatedKeyword.result[0].items != "undefined" &&
								$data.reatedKeyword.result[0].items.length > 0) {
								angular.forEach($data.reatedKeyword.result[0].items, function (item, index) {
									if (!$scope.srhResultData.reatedKeyword) {
										$scope.srhResultData.reatedKeyword = [];
									}
									var hsaKeyword = false;
									/*이미 추가된 요소인지 확인*/
									for(var i=0;i < $scope.srhResultData.reatedKeyword.length;i++) {
										if($scope.srhResultData.reatedKeyword[i].keyword == item.keyword) {
											hsaKeyword = true;
											break;
										}
									}
									if(!hsaKeyword) {
										if (item.keyword && item.type && item.count && /*스크립트 오류 방지 각 체크할 key값이 있는지 확인*/
												item.type == "2" && /*연관검색어는 type이 2인 요소만 가져옴*/
												item.count > 0 && /*검색 건수가 있는 검색어만 표시*/
												(item.keyword + "").toLowerCase() != (decodeURI($scope.postParams.keyword) + "").toLowerCase()) {
											$scope.srhResultData.reatedKeyword.push(item);
										}
									}
								});
							}
							$scope.srhResultData.prdDealLst = $data.prdDealLst; /*딜상품 리스트*/

							if ($scope.srhResultData.prdDealLst && $scope.srhResultData.prdDealLst.items && $scope.srhResultData.prdDealLst.items.length > 0) {
								$scope.prdDealList = $scope.reMappingDealUnitData($scope.srhResultData.prdDealLst.items) ;
							}
							$scope.uiStateObj.requeryTermInitFlag = true;
						case "C" : /*카테고리*/
							$scope.srhResultData.brdLst = $data.brdLst; /*브랜드 리스트*/

							if (typeof $scope.srhResultData.brdLst.tcnt != "undefined" &&
								$scope.srhResultData.brdLst.tcnt > 0 &&
								typeof $scope.srhResultData.brdLst.items != "undefined") {
								angular.forEach($scope.srhResultData.brdLst.items, function (item, index) {
									$scope.srhResultData.brdLst.items[index].cnt = parseInt(item.cnt);
								});
							}
						case "B" : /*브랜드*/
							$scope.srhResultData.price = $data.price; /*최소,최대가*/
						case "D" : /*상세*/
							$scope.srhResultData.tCnt = $data.tCnt; /*총 검색결과 수*/
							var keywordElsp = "";
							if($data.keyword.length > 20) {
								keywordElsp = "...";
							}

							if ($scope.postParams.isVoice != "Y" && $scope.postParams.isVoice != "T") { // 음성 검색결과가 아닐 경우에만 서브헤더 타이틀 변경
								$scope.subTitle = "'"+$data.keyword.substring(0,20)+keywordElsp+"'"+" 검색결과";
							}

							$scope.searchCntTxt = " 검색결과 (" + $filter('number')($data.tCnt) + "개)";
							$scope.postParams.rekeyword = ""; /*결과내 검색어 삭제 (다음 결과내 검색시 오류를 방지하기 위해)*/
						case "S" : /*정렬*/
							$scope.srhResultData.sortType = $data.sortType; /*정렬순*/
						case "P" : /*페이징*/
							$scope.srhResultData.dispCnt = $data.dispCnt; /*한페이지의 상품 개수*/
							$scope.srhResultData.page = $data.page; /*현재 페이지*/
							$scope.postParams.page = $data.page;

							/*전체 상품 로드 여부 체크*/
							$scope.uiStateObj.ajaxPageEndFlag = false;
							
							if ($scope.postParams.page > 1) { /*첫페이지가 아닐 경우 상품 append*/
								$scope.srhResultData.prdLst.items = $scope.srhResultData.prdLst.items.concat($scope.reMappingPldUnitData($data.prdLst.items)); /*검색결과상품 리스트*/
							} else {
								if ($data.prdLst) { /*검색된 상품 리스트가 있을 경우*/
									$scope.srhResultData.prdLst = $data.prdLst;
									$scope.srhResultData.prdLst.items = $scope.reMappingPldUnitData($data.prdLst.items);
									$scope.srhResultData.prdLst.tcnt = $data.prdLst.tcnt; /*상품 개수*/
								} else { /*페이지가 1페이지이고 검색된 상품 리스트가 없을 경우*/
									$scope.uiStateObj.ajaxPageEndFlag = true;
									$scope.productMoreScroll = false;
								}
							}

							/*전체 상품 로드 여부 체크*/
							if ($scope.srhResultData.prdLst && $scope.srhResultData.prdLst.items && $data.prdLst &&$data.prdLst.items) {
								if ($scope.srhResultData.tCnt <= $scope.srhResultData.prdLst.items.length || $data.prdLst.items.length == 0) {
									$scope.uiStateObj.ajaxPageEndFlag = true;
									$scope.productMoreScroll = false;
								} else {
									$scope.uiStateObj.ajaxPageEndFlag = false;
									$scope.productMoreScroll = true;
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
						case "T" : /*상세검색 조건 여부*/
							if ($data.resultCode == "0000" &&
								typeof $data.srhTerms != "undefined" &&
								typeof $data.srhTerms.dept != "undefined" &&
								typeof $data.srhTerms.tvhome != "undefined" &&
								typeof $data.srhTerms.super != "undefined" &&
								typeof $data.srhTerms.brdstore != "undefined" &&
								typeof $data.srhTerms.smpick != "undefined"/* &&
								typeof $data.srhTerms.book != "undefined"*/) {

								$scope.srhDetailData.srhTerms.dept = $data.srhTerms.dept == "0" ? false : true; /*검색필터 - 상세검색 롯데백화점 활성화여부*/
								$scope.srhDetailData.srhTerms.tvhome = $data.srhTerms.tvhome == "0" ? false : true; /*검색필터 - 상세검색 롯데홈쇼핑 활성화여부*/
								$scope.srhDetailData.srhTerms.super = $data.srhTerms.super == "0" ? false : true; /*검색필터 - 상세검색 롯데슈퍼 활성화여부*/
								$scope.srhDetailData.srhTerms.brdstore = $data.srhTerms.brdstore == "0" ? false : true; /*검색필터 - 상세검색 브랜드스토어 활성화여부*/
								$scope.srhDetailData.srhTerms.smpick = $data.srhTerms.smpick == "0" ? false : true; /*검색필터 - 상세검색 스마트픽 활성화여부*/
								/*$scope.srhDetailData.srhTerms.book = $data.srhTerms.book == "0" ? false : true;*/ /*검색필터 - 상세검색 도서 활성화여부*/
								/*스마트픽 지점 리스트*/
								
								// colors
								$scope.updateColors($data.srhTerms.colors);
							}
							if ($data.srhTerms.smpickBranch) {
								$scope.srhDetailData.srhTerms.smpickBranch = $data.srhTerms.smpickBranch;
							}

							break;
					}
					
					for(i=0; i <  $scope.srhResultData.prdLst.items.length; i++) {// 테스트
						$scope.srhResultData.prdLst.items[i].brnd_nm =  $scope.srhResultData.prdLst.items[i].brnd_nm.replace("[", "");
						$scope.srhResultData.prdLst.items[i].brnd_nm =  $scope.srhResultData.prdLst.items[i].brnd_nm.replace("]", "");
						//console.log("more---["+i+"]"); //brnd_nm
					}

					if ($scope.uiStateObj.requeryTermInitFlag) { /*재검색어로 검색했을 경우 조건 초기화를 위하여*/
						$scope.uiStateObj.requeryTermInitFlag = false;

						$scope.isShowLoading = false; /*AJAX 중복 방지 Flag 예외처리*/
						$scope.productListLoading = false;
						$scope.postParams.rtnType = "T"; /*검색조건 활성화 여부로 조회*/
						$scope.loadDataParams($scope.postParams.rtnType); /*조회*/
					}
				} else if ($data.resultCode == "1000") { /*검색결과 없음*/
					$scope.uiStateObj.emptyResult = true; /*UI*/
					$scope.uiStateObj.emptyKeyword = false; /*UI*/

					/*N : 검색결과 없음*/
					$scope.srhResultData.tCnt = $data.tCnt; /*총 검색결과 수*/
					$scope.srhResultData.missKeyword = $data.missKeyword; /*오탈자 검색어*/

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
				/*console.log("resultCode error");*/
				/*$scope.uiStateObj.emptyKeyword = true;*/ /*UI*/
				/*$scope.srhResultData.resultCode = "1000";*/
			}
		};
		
		/*검색, 색상 업데이트*/
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

		/*검색 키워드 없음 처리*/
		$scope.noKeyword = function () {
			$scope.uiStateObj.emptyResult = false; /*UI 검색결과 없음 비활성화*/
			$scope.uiStateObj.emptyKeyword = true; /*UI 검색 키쿼드 없음 활성화*/
		};

		/*검색키워드 링크로 연결*/
		$scope.goSearch = function (keyword, tclick) { /*새 키워드 검색*/
			/*tclick 있을 경우 tclick 수집을 위한 url parameter 추가*/
			var tClickStr = "";

			if (tclick) {
				tClickStr = "&tclick=" + tclick;
			}

			/*URL 이동*/
			$window.location = LotteUtil.setUrlAddBaseParam(LotteCommon.searchUrl, $scope.baseParam + '&keyword=' + keyword + tClickStr);
		};
		
		$scope.fnSearchReatedOpen = function () {
			var tClickStr = $scope.tClickBase + "SrhResult_Clk_Btn_1";
			$scope.sendTclick(tClickStr); // lotte-comm.js // TCLICK 수집
			$scope.uiStateObj.reatedOpen = !$scope.uiStateObj.reatedOpen;
		};

		// 세션 스토리지 체크 #######################################################################################
		if (LotteStorage.getSessionStorage("srhLstLoc") == $location.absUrl() &&  // URL 체크
			LotteStorage.getSessionStorage("srhLst") &&
			$scope.locationHistoryBack) { // 세션 체크

			var sessionScopeData = LotteStorage.getSessionStorage("srhLst", 'json');

			if (typeof sessionScopeData.srhResultData.resultCode == "undefined") { // SessionStorage에 resultCode가 없다면 데이터 로드 하기
				try { console.log('Data Load'); } catch (e) {}

				$scope.loadDataParams(); // 데이터 로드
			} else { // 세션 스토리지에 담긴 값이 정상이라면 세션 데이터 활용
				try { console.log('Session Load'); } catch (e) {}

				$scope.subTitle = sessionScopeData.subTitle; // 서브헤더 타이틀 세팅
				$scope.searchCntTxt = sessionScopeData.searchCntTxt; // 검색결과 수 세팅
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

				LotteStorage.delSessionStorage('srhLstLoc'); // 세션스토리지에 저장된 현재 URL 삭제
				LotteStorage.delSessionStorage('srhLst'); // 세션스토리지에 저장된 검색결과리스트 데이터 삭제
				LotteStorage.delSessionStorage('srhLstNowScrollY'); // 세션스토리지에 저장된 스크롤 위치 삭제
			}
		} else { // 세션 스토리지에 데이터가 없을 경우 AJAX 데이터 로드
			try { console.log('Data Load'); } catch (e) {}
			$scope.loadDataParams(); // 데이터 로드
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
				$scope.uiStateObj.templateType = $scope.templateType; /* 유닛 템플릿 타임 세팅 */
				
				if($scope.postParams.orgKeyword != $scope.postParams.keyword) {
					LotteStorage.delSessionStorage('srhLstLoc');
					return;
				}
				
				sess.subTitle = $scope.subTitle; /*서브헤더 타이틀*/
				sess.searchCntTxt = $scope.searchCntTxt; /*서브 헤더 검색결과 수*/
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
	}]);

	/*기본 전체 Container (검색결과용 탭플릿 로드)*/
	app.directive('lotteContainer', [function() {
		return {
			templateUrl: '/lotte/resources_dev/search/search_list_container.html',
			replace : true,
			link:function($scope, el, attrs) {
				/* 
				 * 다른 매장 선택
				 */
				$scope.otherStoreClick = function() {
					if($scope.uiStateObj.otherStore) {
						$scope.uiStateObj.otherStore = false;
					} else {
						$scope.uiStateObj.otherStore = true;
					}
				}
				
				$scope.otherStoreClose = function() {
					$scope.uiStateObj.otherStore = false;
				}
				
				$scope.changeStoreClick = function(idx) {
					switch(idx) {
					case 0:
						break;
					case 1:
						break;
					case 2:
						break;
					case 3:
						break;
					}
				}
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

	/*연관 검색어 Directive*/
	app.directive('reatedKeyword', ['$timeout', function ($timeout) {
		return {
			link : function ($scope, el, attrs) {
				$timeout(function () { /*AngularJS 실행 후 ul의 높이 판단하여 Open 버튼 노출 여부 계산*/
					var lineHeight = 40; /*연관검색어 기본 높이*/

					if ($scope.srhResultData.reatedKeyword && /*연관 검색어가 있고*/
						$scope.srhResultData.reatedKeyword.length > 2 && /*연관검색어 갯수가 2개보다 많고*/
						el.height() > lineHeight) { /*연관검색어 높이가 기본 높이 보다 클 경우*/
						$scope.uiStateObj.reatedKeywordBtnFlag = true; /*연관검색어 펼쳐보기 버튼 활성화*/
					}
				});
			}
		}
	}]);

	/*검색 필터 Directive*/
	app.directive('srhFilter', ['$window', function ($window) {
		return {
			link : function ($scope, el, attrs) {
				var $win = angular.element($window);

				/**
				 * UI Controller
				 */
				$scope.tipShowClick = function() {
					$scope.tipShow = !$scope.tipShow;
				}
				/*TAB - Index Change*/
				$scope.srhFilterTabChange = function (idx) { /*검색 필터 탭 변경*/
					var tClickStr = "";

					if (idx == 0) {
						tClickStr = $scope.tClickBase + "SEARCH_CATE";
					} else if (idx == 1) {
						tClickStr = $scope.tClickBase + "SEARCH_BRAND";
					} else if (idx == 2) {
						tClickStr = $scope.tClickBase + "SEARCH_detail";
					} else if (idx == 3) {
						tClickStr = $scope.tClickBase + "SEARCH_sort";
					}

					$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/

					if ($scope.uiStateObj.srhFilterSelectedIdx == idx) { /*현재 선택된 탭 Index와 선택한 탭 Index가 같다면 탭 Index를 -1로 하여 탭 닫기*/
						$scope.uiStateObj.srhFilterSelectedIdx = -1;
					} else { /*탭 활성화*/
						$scope.uiStateObj.srhFilterSelectedIdx = idx;
					}

					if (idx == 2) { /*선택한 탭 Index가 2(상세검색)라면 조건 활성화 여부 조회*/
						$scope.postParams.rtnType = "T";
						$scope.loadDataParams($scope.postParams.rtnType);
					}
				};

				$scope.srhFilterClose = function () { /*필터 닫기*/
					$scope.uiStateObj.srhFilterSelectedIdx = -1;
					angular.element('#headerSpace').css("height",0);
				};

				$scope.srhFilterSmpickClick = function () { /*스마트픽 (셀렉트박스형) 버튼 클릭*/
					var tClickStr = $scope.tClickBase + "SEARCH_detail_10";
					$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
					
					$scope.uiStateObj.smpickLayerOpenFlag = true;
					angular.element("#wrapper").addClass("overflowy_hidden");
				};

				$scope.srhFilterBrdSortChange = function (type) { /*브랜드 리스트 정렬조건 변경*/
					var tClickStr = "";

					if (type == "-cnt") {
						tClickStr = $scope.tClickBase + "SEARCH_BRAND_01";
					} else {
						tClickStr = $scope.tClickBase + "SEARCH_BRAND_02";
					}

					$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
				};

				/*CONT - Category*/
				$scope.srhFilterCtgChange = function (idx) { /*검색 필터 - 카테고리 depth 변경*/
					$scope.uiStateObj.srhFilterCtgSelIdx = idx;
					$scope.uiStateObj.srhFilterCtgDepth1CtgNo = $scope.srhResultData.ctgLst.items[idx].ctgNo;
					$scope.uiStateObj.srhFilterCtgDepth = 1;
					$scope.postParams.ctgDepth = 0;

					angular.element(el).find(".depth2 >ul").scrollTop(0);

					var tClickStr = $scope.tClickBase + "SEARCH_CATE_01";
					$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
				};

				$scope.getSubCtgCnt = function (idx) { /*선택된 대대카에 속한 서브카테고리 개수 리턴*/
					var rtnValue = 0;

					if ($scope.srhResultData.ctgLst && $scope.srhResultData.ctgLst.items[idx].subCtgLst) {
						rtnValue = $scope.srhResultData.ctgLst.items[idx].subCtgLst.items.length;
					}

					return rtnValue;
				};

				/*CONT - Detail*/
				$scope.srhFilterDetailPriceIpt = function (target) { /*상세검색 가격 포커싱*/
					angular.element("#" + target).focus();
				};

				/**
				 * Data Ajax
				 */
				$scope.srhSubCtgPost = function (ctgNo) { /*서브 카테고리(대카) 선택*/
					$scope.postParams.ctgNo = ctgNo;
					$scope.postParams.ctgDepth = 1;
					$scope.uiStateObj.srhFilterCtgFlag = true;

					$scope.srhFilterBrdInit(); /*브랜드 초기화*/
					$scope.srhFilterDetailInit(); /*상세검색 초기화*/

					/*POST*/
					$scope.postParams.rtnType = "C";
					$scope.loadDataParams($scope.postParams.rtnType);

					var tClickStr = $scope.tClickBase + "SEARCH_CATE_02";
					$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
				};

				$scope.srhChkBrdPost = function (item) { /*브랜드 체크 변경*/
					if ($scope.postParams.brdNoArr.indexOf(item.brdNo) == -1) {
						$scope.postParams.brdNoArr.push(item.brdNo);
					} else { /*선택 취소*/
						var tmpIdx = $scope.postParams.brdNoArr.indexOf(item.brdNo);
						if (tmpIdx > -1) {
							$scope.postParams.brdNoArr.splice(tmpIdx, 1);
						}
					}

					if ($scope.postParams.brdNoArr.length > 0) { /*선택된 값이 있을 경우*/
						$scope.uiStateObj.srhFilterBrdFlag = true;
					} else {
						$scope.uiStateObj.srhFilterBrdFlag = false;
					}

					$scope.srhFilterDetailInit(); /*상세검색 초기화*/

					/*POST*/
					$scope.postParams.rtnType = "B";
					$scope.loadDataParams($scope.postParams.rtnType);

					var tClickStr = $scope.tClickBase + "SEARCH_BRAND_03";
					$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
				};

				$scope.srhDetailChange = function (type) { /*상세검색 조건 변경*/
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

					/*선택한 조건에 따른 tclick 설정*/
					var tClickStr = "";

					switch (type) {
						case "deptYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_01"; break; /*롯데백화점*/
						case "tvhomeYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_02"; break; /*롯데홈쇼핑*/
						case "superYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_03"; break; /*롯데슈퍼*/
						case "brdstoreYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_04"; break; /*브랜드스토어*/
						case "smpickYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_05"; break; /*스마트픽*/
						case "freeDeliYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_06"; break; /*무료배송*/
						case "freeInstYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_07"; break; /*무이자*/
						case "pointYN" : tClickStr = $scope.tClickBase + "SEARCH_detail_08"; break; /*포인트*/
					}

					if (tClickStr != "") { /*tclick 이 있다면*/
						$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
					}

					if(type != 'deptYN' && type != 'tvhomeYN' && type != 'superYN' && type != 'brdstoreYN') {
						$scope.srhDetailSearchActiveChk(); /*상세검색 활성화 여부 검증*/
					}
					$scope.srhDetailPost(); /*상세검색 조회*/
				};
				
				/* 색상칩 클릭 */
				$scope.srhSelectColor = function(e){
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
					
					$scope.srhDetailSearchActiveChk();/*상세검색 활성화 여부 검증*/
					$scope.srhDetailPost();/*상세검색 조회*/
					
					$scope.sendTclick($scope.tClickBase + "SEARCH_color");/*lotte-comm.js - TCLICK 수집*/
				}

				$scope.srhDetailPriceValidateFlag = true; /*가격 검증 완료 Flag*/

				$scope.srhDetailPriceValidate = function (type) { /*상세검색 가격 변경시 가격 검증 가격 검증 실패시 $scope.srhDetailPriceValidateFlag 값 false 처리*/
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
					
					if (type == "min" && $scope.srhResultData.price.min) {
						/*CASE 1 : 가격 INPUT에 아무것도 입력 안했을 경우 type이 object로 나옴 - 해당하는 경우 처리해줄 내용 없음*/
						/*CASE 2 : 가격에 최소가로 설정한 값보다 값이 작거나 최대가로 설정한 값보다 값이 큰 경우 type이 undefined로 나옴*/
						/*CASE 3 : 가격에 정상적인 가격이 입력됐을 경우 type이 number로 나옴*/
						if (typeof $scope.postParams.priceMinU == "undefined") { /*CASE 2 : 검색 최소가로 변경 처리*/
							$scope.postParams.priceMinU = $scope.srhResultData.price.min;
							$scope.srhDetailPriceValidateFlag= false;
							alert("검색결과 내 최저가격보다 낮습니다.");
							return false;
						} else if (typeof $scope.postParams.priceMinU == "number" &&  /*입력된 최소가가 있고*/
							typeof $scope.postParams.priceMaxU != "number" &&  /*입력된 최고가가 없고*/
							$scope.postParams.priceMinU > $scope.srhResultData.price.max) { /*검색 최고가 보다 최소가가 큰 경우*/
							$scope.postParams.priceMinU = $scope.srhResultData.price.max;
							$scope.srhDetailPriceValidateFlag= false;
							alert("검색결과 내 최고가격보다 높습니다.");
							return false;
						} else if (typeof $scope.postParams.priceMinU == "number" &&  /*입력된 최소가가 있고*/
							typeof $scope.postParams.priceMaxU == "number" &&  /*입력된 최고가가 있고*/
							$scope.postParams.priceMinU > $scope.postParams.priceMaxU) { /*검색 최고가 보다 최소가가 큰 경우*/
							$scope.postParams.priceMinU = $scope.postParams.priceMaxU;
							$scope.srhDetailPriceValidateFlag= false;
							alert("최고가격이 최저가격보다 낮습니다.");
							return false;
						}
					} else if (type == "max" && $scope.srhResultData.price.max) {
						/*CASE 1 : 가격 INPUT에 아무것도 입력 안했을 경우 type이 object로 나옴 - 해당하는 경우 처리해줄 내용 없음*/
						/*CASE 2 : 가격에 최대가로 설정한 값보다 값이 크거나 최소가로 설정한 값보다 값이 작은 경우 type이 undefined로 나옴*/
						/*CASE 3 : 가격에 정상적인 가격이 입력됐을 경우 type이 number로 나옴*/
						if (typeof $scope.postParams.priceMaxU == "undefined") { /*CASE 2 : 검색 최고가로 변경 처리*/
							$scope.postParams.priceMaxU = $scope.srhResultData.price.max;
							$scope.srhDetailPriceValidateFlag= false;
							alert("검색결과 내 최고가격보다 높습니다.");
							return false;
						} else if (typeof $scope.postParams.priceMaxU == "number" &&  /*입력된 최고가가 있고*/
							typeof $scope.postParams.priceMinU != "number" &&  /*입력된 최소가가 없고*/
							$scope.postParams.priceMaxU < $scope.srhResultData.price.min) { /*검색 최소가 보다 최고가가 작은 경우*/
							$scope.postParams.priceMaxU = $scope.srhResultData.price.max;
							$scope.srhDetailPriceValidateFlag= false;
							alert("검색결과 내 최저가격보다 낮습니다.");
							return false;
						} else if (typeof $scope.postParams.priceMaxU == "number" &&  /*입력된 최고가가 있고*/
							typeof $scope.postParams.priceMinU == "number" &&  /*입력된 최소가가 있고*/
							$scope.postParams.priceMaxU < $scope.postParams.priceMinU) { /*검색 최고가 보다 최소가가 큰 경우*/
							$scope.postParams.priceMaxU = $scope.postParams.priceMinU;
							$scope.srhDetailPriceValidateFlag= false;
							alert("최고가격이 최저가격보다 낮습니다.");
							return false;
						}
					}
				};

				/*키보드 검색 엔터시*/
				$scope.srhDetailSearchKeypress = function (e) {
					if (e.which === 13) {
						$scope.srhDetailSearch();
						e.preventDefault();
					}
				};

				$scope.srhDetailSearch = function () { /*검색 버튼 클릭*/
					if (!$scope.srhDetailPriceValidateFlag) { /*가격 검증 완료 체크*/
						$scope.srhDetailPriceValidateFlag = true;
						return false;
					}
					/*alert(angular.element("#rekeyword").val());*/

					/*상세검색 '검색' 버튼 클릭시 선택된 조건이 있는지 확인*/
					if (!$scope.postParams.priceMinU &&
						!$scope.postParams.priceMaxU &&
						$scope.postParams.rekeyword == "") {
						alert("검색 조건을 입력해 주세요.");
						return false;
					} else {
						var tClickStr = $scope.tClickBase + "SEARCH_detail_09";
						$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/
						$scope.srhDetailPost(); /*상세검색 조회*/
					}
				};

				$scope.srhDetailPost = function () { /*상세검색 조회*/
					$scope.postParams.rtnType = "D"; /*상세검색 조건 타입으로 설정*/
					$scope.loadDataParams($scope.postParams.rtnType); /*결과 조회*/
				};

				$scope.srhSortPost = function (idx) { /*Sortting 변경*/
					$scope.uiStateObj.sortTypeIdx = idx;
					$scope.uiStateObj.srhFilterSortFlag = true;

					$scope.postParams.rtnType = "S"; /*정렬 조건 타입으로 설정*/
					$scope.loadDataParams($scope.postParams.rtnType); /*결과 조회*/

					var tClickStr = "";

					switch (idx) {
						case 0 : tClickStr = $scope.tClickBase + "SEARCH_sort_01"; break; /*인기순BEST*/
						case 1 : tClickStr = $scope.tClickBase + "SEARCH_sort_02"; break; /*판매BEST*/
						case 2 : tClickStr = $scope.tClickBase + "SEARCH_sort_03"; break; /*상품평많은순*/
						case 3 : tClickStr = $scope.tClickBase + "SEARCH_sort_04"; break; /*신상품순*/
						case 4 : tClickStr = $scope.tClickBase + "SEARCH_sort_05"; break; /*낮은가격순*/
						case 5 : tClickStr = $scope.tClickBase + "SEARCH_sort_06"; break; /*높은가격순*/
					}

					$scope.sendTclick(tClickStr); /*lotte-comm.js*/  /*TCLICK 수집*/

					$win.scrollTop(0);
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
					
					/*선택된 조건이 있다면*/
					if (chkCnt > 0 ||
						$scope.postParams.priceMinU ||
						typeof $scope.postParams.priceMinU == "undefined" ||
						 $scope.postParams.priceMaxU != null ||
						 typeof $scope.postParams.priceMaxU == "undefined" ||
						 $scope.postParams.rekeyword) {
						$scope.uiStateObj.srhFilterDetailFlag = true; /*상세 검색 조건 필터된 상태로 탭 표시*/
					} else {
						$scope.uiStateObj.srhFilterDetailFlag = false;
					}
				};

				/**
				 * 초기화
				 */
				$scope.srhFilterInit = function () { /*검색 필터 초기화 공통*/
					if ($scope.uiStateObj.srhFilterSelectedIdx < 1) {
						$scope.srhFilterCtgInit(); /*카테고리 초기화*/
						$scope.postParams.ctgDepth = 0;
						$scope.postParams.rtnType = "";
					}

					if ($scope.uiStateObj.srhFilterSelectedIdx < 2) {
						$scope.srhFilterBrdInit(); /*브랜드 초기화*/
						$scope.postParams.rtnType = "C";
					}

					if ($scope.uiStateObj.srhFilterSelectedIdx < 3) {
						$scope.srhFilterDetailInit(); /*상세검색 초기화*/
					}

					/*초기화시 선택된 탭 Index에 따른 검색결과 재로드*/
					if ($scope.uiStateObj.srhFilterSelectedIdx == 0) {
						$scope.postParams.rtnType = "";
					} else if ($scope.uiStateObj.srhFilterSelectedIdx == 1) {
						$scope.postParams.rtnType = "C";
					} else if ($scope.uiStateObj.srhFilterSelectedIdx == 2) {
						$scope.postParams.rtnType = "B";
					} else if ($scope.uiStateObj.srhFilterSelectedIdx == 3) {
						$scope.srhFilterSortInit(); /*정렬 초기화*/
						$scope.postParams.rtnType = "S";
					}

					$scope.loadDataParams($scope.postParams.rtnType); /*결과 조회*/
				};

				$scope.srhFilterCtgInit = function () { /*검색 필터 - 카테고리 초기화*/
					$scope.uiStateObj.srhFilterCtgFlag = false;
					$scope.uiStateObj.srhFilterCtgDepth = 0;
					$scope.uiStateObj.srhFilterCtgSelIdx = 0;
					$scope.uiStateObj.srhFilterCtgDepth1CtgNo = "";
					$scope.postParams.ctgNo = "";
					$scope.postParams.ctgDepth = 0;
				};

				$scope.srhFilterBrdInit = function () { /* 검색필터 - 브랜드 초기화 */
					$scope.uiStateObj.srhFilterBrdFlag = false;
					$scope.postParams.brdNoArr = [];

					angular.forEach($scope.srhResultData.brdLst.items, function (item, idx) {
						item.checked = false;
					});
				};

				$scope.srhFilterDetailInit = function () { /*검색 필터 - 상세검색 초기화*/
					$scope.uiStateObj.srhFilterDetailFlag = false;

					angular.forEach($scope.uiStateObj.srhFilterDetailArr, function (item) {
						$scope.postParams[item] = "N";
					});
					
					$scope.postParams.selectedColor.length = 0;
					$(".term.detail .colors ul > li").removeClass("on");

					$scope.postParams.rekeyword = "";
					$scope.postParams.priceMinU = null;//"";
					$scope.postParams.priceMaxU = null;//"";
					$scope.postParams.smpickBranchNo = "";
					$scope.uiStateObj.smpickBranchName = "전체";
					$scope.postParams.selectedColor.length = 0;//색상 선택 초기화
					var len = $scope.srhDetailData.srhColorList.length;
					for(var i=0; i<len; i++){
						$scope.srhDetailData.srhColorList[i].selected = false;
					}
				};

				$scope.srhFilterSortInit = function () { /*검색 필터 - Sortting  초기화*/
					$scope.uiStateObj.srhFilterSortFlag = false;
					$scope.uiStateObj.sortTypeIdx = 0;
					$scope.postParams.sort = $scope.uiStateObj.sortTypeArr[0].value;
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

	/*상품 리스트 Directive*/
	app.directive('prdLst', ['$window', function ($window) {
		return {
			link : function ($scope, el, attrs) {
				/*Scroll시 상품 더 불러오기*/
				var $win = angular.element($window),
					$el = angular.element(el);

				/*페이지 하단으로 스크롤시 상품 더 불러오기*/
				$win.on({
					"scroll" : function () {
						if ($scope.srhResultData && /*결과 데이터 체크*/
							$scope.srhResultData.resultCode == "0000" && /*검색 결과가 있을때만 더 불러오기*/
							typeof $scope.srhResultData.prdLst != "undefined" && /*결과 데이터에서 상품 데이터 체크*/
							typeof $scope.srhResultData.prdLst.items != "undefined" && /*결과 데이터에서 상품 데이터 체크*/
							$el.offset().top + $el.outerHeight() + 221 < $win.scrollTop() + $win.height() * 3 && /*스크롤 위치 판단*/
							$scope.srhResultData.prdLst.items.length < $scope.srhResultData.tCnt && /*상품 총 로드 개수 판단*/
							!$scope.isShowLoading && /*요청중인지 판단*/
							!$scope.uiStateObj.ajaxPageEndFlag) { /*전체 상품을 로드했는지 판단*/
							$scope.postParams.rtnType = "P"; /*조회 구분값 P : 페이징으로 설정*/
							$scope.loadDataParams($scope.postParams.rtnType); /*결과값 조회*/
						}
					}
				});
			}
		}
	}]);

	/*스마트픽 지점 레이어 Directive*/
	app.directive('lySmpick', ['$window', function ($window) {
		return {
			link : function ($scope, el, attrs) {
				$scope.lySmpickClose = function () { /*스마트픽 레이어 닫기*/
					$scope.uiStateObj.smpickLayerOpenFlag = false;
					angular.element("#wrapper").removeClass("overflowy_hidden");
				};

				$scope.smpickBranchChange = function (item) { /*스마트픽 지점 변경*/
					$scope.uiStateObj.smpickBranchName = item.name;

					$scope.postParams.rtnType = "D"; /*상세조건 검색으로 조회 구분값 설정*/
					$scope.loadDataParams($scope.postParams.rtnType); /*결과값 조회*/
				};
			}
		}
	}]);
})(window, window.angular);