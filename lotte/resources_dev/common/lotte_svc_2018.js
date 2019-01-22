(function(window, angular, undefined) {
	'use strict';
	var urlSvc = angular.module('lotteUrl', []);
	urlSvc.service('LotteCommon', ['$location', function ($location) {
		this.isTestFlag = false; // LocalTestFlag

		console.log("LOTTE_CONSTANTS['M_HOST_SSL']", LOTTE_CONSTANTS['M_HOST_SSL']);

		this.secureUrl = LOTTE_CONSTANTS['M_HOST_SSL'];
		this.baseUrl = LOTTE_CONSTANTS['M_HOST_MOBILE'];
		this.foUrl = LOTTE_CONSTANTS['PC_HOST_WEB'];
		this.mapiUrl = LOTTE_CONSTANTS['MAPI_HOST_API'];
		this.mapiSSLUrl = LOTTE_CONSTANTS['MAPI_HOST_SSL_API'];
		this.localUrl = "";

		// if (location.host == "mo.lotte.com") { // 스테이지 SSL 테스트 용도
		// 	this.secureUrl = "https://mo.lotte.com";
		// 	this.mapiSSLUrl = "https://mo.lotte.com";
		// }

		this.storageShareUrl = this.baseUrl + "/common3/secureShareStorage.jsp"; // http/https 간 Storage 공유
		this.secureStorageShareUrl = this.secureUrl + "/common3/secureShareStorage.jsp"; // http/https 간 Storage 공유

		this.mainUrl = this.baseUrl + "/main_phone.do";
		this.mainOldContentData = this.localUrl + "/json/main/main_contents.json";
		this.mainContentData = this.localUrl + "/json/main_new/main_contents.json";
		this.mainBranchListData = "/json/main/mainDeptStoreList.json";
		this.mainBranchSelectData = "/json/main/mainDeptBranchUpdate.json";
		this.mainLatestProdData = "/json/main/main_latest_prod.json";
		this.mainRealRecommData = "/json/main/main_real_recommend.json";
		this.mainSmartAlramData = "/json/main/main_smart_alram_info.json";

		/*브랜드 찾기*/
		this.brandSearchUrl = "/category/m/brand_search.do";
		this.myBrandInfo = "/json/main_new/my_brnd_info.json";
		this.bestBrandInfo = "/json/main_new/best_brnd_info.json"; // 브랜드 찾기 페이지 진입 시 베스트브랜드 10개 노출
		this.orderState = "/json/main_new/new_ord_stat_info.json";

		/* login */
		this.loginUrl = this.secureUrl + "/login/m/loginForm.do";
		this.loginData = this.secureUrl + "/json/cn/login_check.json";
		this.logoutUrl = this.baseUrl + "/login/logout.do";
		this.changeMyInfoUrl = "https://member.lpoint.com/door/user/mobile/change_user_info.jsp"; //회원정보수정 URL
		this.memberOutUrl = "https://member.lpoint.com/door/user/mobile/withdrawl.jsp"; //회원탈퇴 URL
		this.getJoinBtnViewAjaxUrl = "/json/login/getJoinBtnViewAjax.json"; //회원가입 앱 테스트 기간 URL/***** login2 rudolph start *****/
		this.M_HOST_MOBILE = LOTTE_CONSTANTS["M_HOST_MOBILE"];

		//constants
		this.NORMAL_LOGIN = LOTTE_CONSTANTS['NORMAL_LOGIN'];
		this.ONENONE_BUY_LOGIN = LOTTE_CONSTANTS['ONENONE_BUY_LOGIN'];
		this.CART_BUY_LOGIN = LOTTE_CONSTANTS['CART_BUY_LOGIN'];
		this.ORDER_SEARCH_LOGIN = LOTTE_CONSTANTS['ORDER_SEARCH_LOGIN'];
		this.IMALL_BUY_LOGIN = LOTTE_CONSTANTS['IMALL_BUY_LOGIN'];
		this.MALL_CART_BUY_LOGIN = LOTTE_CONSTANTS['IMALL_CART_BUY_LOGIN'];
		this.LOGIN_SEED = LOTTE_CONSTANTS['LOGIN_SEED'];
		this.ELLOTTE_LOGIN_SEED = LOTTE_CONSTANTS['ELLOTTE_LOGIN_SEED'];
		this.ORDER_PROTOCAL = LOTTE_CONSTANTS['ORDER_PROTOCAL'];
		this.MOBILE_DOMAIN = LOTTE_CONSTANTS['MOBILE_DOMAIN'];
		this.ELLOTTE_HOST_MOBILE = LOTTE_CONSTANTS['ELLOTTE_HOST_MOBILE'];
		this.ELLOTTE_HOST_SSL = LOTTE_CONSTANTS['ELLOTTE_HOST_SSL'];
		this.ELLOTTE_LOGIN_SEED =  LOTTE_CONSTANTS['ELLOTTE_LOGIN_SEED'];
		this.ELLOTTE_IOS_APP_SCHEMA = LOTTE_CONSTANTS['ELLOTTE_IOS_APP_SCHEMA'];
		this.ELLOTTE_ANDROID_APP_SCHEMA = LOTTE_CONSTANTS['ELLOTTE_ANDROID_APP_SCHEMA'];

		// json url
		this.loginInitUrl = this.localUrl + "/json/loginInit.json"; // 로그인 폼 초기화
		this.loginProcUrl = this.localUrl + "/json/login.json"; // 로그인 처리
		this.fingerLoginChkUrl = this.localUrl + "/json/fingerLoginCheck.json"; // 지문 로그인 처리
		this.updateStaffInfoAjaxUrl = this.localUrl + "/json/updateStaffInfoAjax.json"; // 임직원 등록
		this.fingerLoginProcUrl = this.localUrl + "/json/fingerLogin.json"; // 지문 로그인 처리
		this.simpleSignMemberPWChangeUrl = this.localUrl + '/json/simpleSignMemberPWChange.json'; // 패스워드변경 폼 초기화
		this.simpleSignMemberPWChangeGoUrl = this.localUrl + "/json/login/simpleSignMemberPWChangeGo.json"; // 패스워드변경 처리
		this.simpleSignMemberIdFindAfterUrl = this.localUrl + '/json/simpleSignMemberIdFindAfter.json'; // 아이디찾기 결과
		this.simpleSignMemberIdFindUrl = this.localUrl + '/json/simpleSignMemberIdFind.json'; // 패스워드찾기 폼 초기화
		this.simpleSignMemberPWFindAfterInitUrl = this.localUrl + '/json/simpleSignMemberPWFindAfterInit.json'; // 패스워드 찾기 폼 초기화
		this.simpleSignMemberPWFindAfterUrl = this.localUrl + '/json/simpleSignMemberPWFindAfter.json'; // 패스워드 찾기 결과
		this.simpleSignMemberCertificationUrl = this.localUrl + "/json/simpleSignMemberCertification.json"; // 인증번호발송
		this.simpleSignMemberReSendEmailUrl = this.localUrl + "/json/simpleSignMemberReSendEmail.json";
		this.dormancyRestoreAjaxUrl = this.localUrl + "/json/login/dormancyRestoreAjax.json"; // 휴면회원 복원 AJAX
		this.dormancyRestoreFail = this.localUrl + "/login/dormancyInfoFail.do"; // 휴면회원 복원 AJAX

		// url
		this.loginForm = this.secureUrl + '/login/m/loginForm.do'; // 로그인폼
		this.sci_url = this.secureUrl + "/sci/pcc_V3_seed.jsp"; // 본인인증
		this.loginBlock = this.secureUrl + "/login/simpleSignMemberLoginBlock.do"; // 간편회원 10회이상 인증 실패
		this.gradeUp = this.secureUrl + "/event/getEntryEventCnt.do";	/*등급업확인*/
		this.registAttendData = this.localUrl + '/json/event/regist_attend.json'; //출석도장 이벤트
		this.simpleSignMemberIdFind = this.secureUrl + "/login/simpleSignMemberIdFind.do";	/*간편회원 아이디 찾기*/
		this.simpleSignMemberPWFind = this.secureUrl + "/login/simpleSignMemberPWFind.do"; /*간편회원 패스워드 찾기*/
		this.simpleSignMemberIdFindAfter = this.secureUrl + "/login/simpleSignMemberIdFindAfter.do";	/*아이디찾기 결과*/
		this.simpleSignMemberPWFindAfter = this.secureUrl + "/login/simpleSignMemberPWFindAfter.do"; /*간편회원 패스워드 찾기 결과*/
		this.simpleSignMemberReSendEmail = this.secureUrl + "/login/simpleSignMemberReSendEmail.do";	/*인증메일 재발송*/
		/***** login2 rudolph end *****/

		//shpark97:150925 - start
		this.PAYTYPE_CARD_047 = LOTTE_CONSTANTS['PAYTYPE_CARD_047']; // 결제카드_롯데
		this.PAYTYPE_CARD_029 = LOTTE_CONSTANTS['PAYTYPE_CARD_029']; // 결제카드_신한
		this.PAYTYPE_CARD_031 = LOTTE_CONSTANTS['PAYTYPE_CARD_031']; // 결제카드_삼성
		this.PAYTYPE_CARD_048 = LOTTE_CONSTANTS['PAYTYPE_CARD_048']; // 결제카드_현대
		this.EXP_MY_LOTTE_KO = LOTTE_CONSTANTS['EXP_MY_LOTTE_KO']; // MyPage Name
		//shpark97:150925 - end

		this.mylotteLayerData = this.localUrl+"/json/main/main_action_bar_my.json";
		this.mylotteLayerData2 = this.localUrl+"/json/main/main_action_bar.json";
		/*this.commBnrData = "http://fo.lotte.com/json/getMobileBannerInfoJson.lotte";*/
		this.sendEventSms = this.baseUrl + "/event/sendSMS.do";
		this.planData = this.foUrl + "/planshop/getPlanShopDetailJson.lotte";
		this.todayOtherAlarmData = "http://messagebox.lotte.com/msg-api-lotte/newMsg.m"; //오늘의 다른 알림 데이터

		/* search */
		this.srhAutoData = this.localUrl + "/search/m/search_keyword_app.do"; // 자동완성 키워드 데이터
		this.srhBestData = this.localUrl + "/json/searchKeywordLayer.json"; // 검색 레이어 인기 급상승 키워드 데이터
		this.customSearchUrl = this.localUrl + "/search/m/custom_search.do";   /*맞춤검색*/

		/*side_categoty*/
		this.sideCtgData = this.localUrl + "/jsondata/lotte_side_ctg.do";		/*좌측 카테고리 리스트(하드코딩 데이터로 되어있음)*/
		this.sideCtgBrandSearch = this.localUrl + "/json/cate_brand_keyword.json";		/*좌측 브랜드 카테고리 검색 리스트*/
		this.sideCtgBrandData = this.localUrl+"/json/cate_brand_list.json";			/*좌측 브랜드 카테고리 리스트*/
		this.sideCtgSpecialSearch = this.localUrl + "/json/searchPlanShopKeyword.json";/*좌측 기획전 카테고리 검색 리스트*/
		this.sideCtgSpecialData = this.localUrl + "/json/category/cate_plan_list.json";/*좌측 기획전 카테고리 리스트*/
		this.sideCtgSpecial = this.localUrl + "/jsondata/side_ctg_special.do";	/*카테고리 리스트*/

		/*우측 마이롯데 데이터*/
		this.sideMylotteData = this.baseUrl+ "/lotte/resources/data/side_mylotte_data.html";

		/*쿠폰위시리스트*/
		this.couponLayerData = this.baseUrl + "/json/m/getJsonDoubleCoupon.do";	/*쿠폰 레이어 데이터*/
		this.downDoubleCoupon = this.foUrl + "/json/regEventCouponJson.lotte";	/*중복쿠폰 다운로드*/
		//this.prdAddWish = this.baseUrl+ "/mylotte/wish/category_wish_add.do";	/*상품 위시리스트 추가*/
		this.prdAddWish = this.localUrl+ '/json/mylotte/wish/m/wish_add.json';	/*상품 위시리스트 추가*/
		/*main*/
		//this.mainTabsData = this.localUrl+"/json/root_menu.json";
		this.mainPopupData = this.localUrl+"/json/system/current_page_popup.json";
		this.recommendLatelyPrdData = this.localUrl+"/json/main/main_LastStatusViewGoods.json"; // 메인 - 맞춤추천 최근본 상품 데이터

		this.cateMidAngul =this.baseUrl+"/category/m/cate_mid_list_anglr.do";
		this.mainNoticeData =this.localUrl+"/json/notice_list.json";
		this.smallCategoryData = this.localUrl+"/json/category/cate_mid_list.json";
		this.cateMidBeauty = this.baseUrl+"/category/m/cate_beauty_list.do"; //명품화장품 카테고리
		this.cateMidBeautyData = this.localUrl+"/json/category/cate_beauty_list.json";

		/* 명절매장중카 */
		this.cateHolidayMidAngul =this.baseUrl+"/category/m/cate_holiday_mid_list_anglr.do";
		this.smallHolidayCategoryData = this.localUrl+"/json/category/cate_holiday_list.json";

		this.beautyEvtTester = "/category/m/beauty_evt_tester.do"; //명품화장품 테스터 이벤트
		this.beautyEvtTesterData = "/json/event/beauty_evt_tester.json";
		this.beautyEvtTesterSave = "/event/regEvent.do";
		this.beautyEvtReview = "/category/m/beauty_evt_review.do"; //명품화장품 상품평 이벤트
		this.beautyEvtReviewData = "/json/event/beauty_evt_review.json";

		/* TV 홈 */
		this.tvHomeOnAirData = this.localUrl + "/json/main/tv_home_onair_prod_list.json";
		this.tvHomeCalendarData = this.localUrl + "/json/main/tv_home_calendar.json";
		this.tvHomeBannerData = this.localUrl + "/json/main/tv_home_banner_list.json";

		/*카테고리*/
		this.cateProdListUrl = this.baseUrl + "/category/m/new_prod_list.do";
		this.cateProdListData = this.localUrl + "/json/category/new_product_list.json";
		this.listGoodsImgData =  this.localUrl + "/json/product/get_goods_img_list.json"; //상품리스트 확대보기 스와이프 이미지 정보

		/* 명절매장카테고리 */
		this.cateHolidayProdListUrl = this.baseUrl + "/category/m/new_holiday_prod_list.do";
		this.cateHolidayProdListData = this.localUrl + "/json/category/new_holiday_product_list.json";

		this.mainNewAlarmData = this.localUrl + "/json/alarm_info.json";

		/* event */
		this.directAttendData = this.localUrl +"/json/event/direct_attend.json"; /*new 출석도짱*/
		this.directAttendUrl = this.baseUrl + "/event/m/directAttend.do";			/*출석도장*/
		this.appPresentUrl = this.baseUrl + "/event/whiteDay.do";				/*롯데닷컴이 쏜다.*/
		this.recieptDataUrl = this.localUrl + "/json/event/receipt_event_info.json"; /* 영수증 이벤트 DATA */
		this.recieptVoteUrl = this.localUrl + "/json/event/regist_receipt.json"; /* 영수증 이벤트 응모하기 URL */
		this.eventSaunListUrl = this.baseUrl + "/event/m/eventSaunList.do"; /* 이벤트 사은 메인 URL */
		this.eventSaunMain = this.baseUrl + "/event/m/eventSaunMain.do"; /* 이벤트 사은 sub url */
		this.eventSaunListData = this.localUrl + "/json/event/saun_list.json"; /* 이벤트 사은 메인 List data */
		this.eventMySaunListData = this.localUrl + "/json/event/mysaun_list.json"; /* 이벤트 사은 메인 List data */
		this.eventSaunMainData = this.localUrl + "/json/event/saun_view.json"; /* 이벤트 사은 sub sata */
		this.eventSaunDetailData = this.localUrl + "/json/event/saun_apply_order_list.json"; /* 이벤트 사은 개인내역 data */
		this.eventJoinListUrl = this.baseUrl + ""; /* 이벤트 응모내역 List */
		this.eventRegistUrl = this.localUrl + "/json/event/regist_saun.json"; /* 이벤트 등록 */

		/* 전문관 */
		this.specialMall = this.localUrl + "/json/mall/special_booth.json";
		this.specialMallMain = this.localUrl + "/json/mall/special_mall.json";
		this.specialMallSubUrl = this.baseUrl + "/category/m/prod_list.do";

		/* planshop */
		this.smartAlarmUrl = this.baseUrl + "/planshop/m/smartAlarmList.do";    /*스마트 알림*/
		this.smartAlarmListData = this.localUrl+"/json/planshop/smart_alarm_list.json";
		this.startledAlarmListData = this.localUrl+"/json/planshop/startled_alarm_list.json";
		this.startledAlarmReadData = this.localUrl+"/json/cn/planshop/startled_alarm_read.json";
		this.emailBargainListData = this.localUrl+"/json/planshop/email_bargain_list.json";
		this.halfChanceData = this.baseUrl + "/json/getHalfChanceJson.lotte?dispNo=5466046";	/*하프찬스 데이터*/
		this.planshopData = this.localUrl + "/json/mall/planshop_detail.json";	/* 기획전 데이터 */
		this.planshopCommentData = this.localUrl + "/json/mall/commentList.json";	/* 기획전 댓글데이터 */
		this.planshopCommentDeleteData = this.localUrl + "/json/mall/commentDelete.json"; /* 기획전 댓글데이터 삭제 */
		this.planshopCommentRegData = this.localUrl + "/json/mall/commentInsert.json"; /* 기획전 댓글데이터 등록 */
		/* mall */
		this.specMallCtgData= this.localUrl + "/json/getKshopCtgListNewJson.lotte"; //kshop형 전문몰 카테고리 데이터
		this.specMallMainData= this.localUrl + "/json/getKshopMainJson.lotte";//kshop형 전문몰 메인 데이터
		this.specMallSubData= this.localUrl + "/json/getKshopGoodsListJson.lotte";   /*kshop형 전문몰 서브 데이터*/

		this.kshopCtgData = this.baseUrl + "/json/getKshopCtgListNewJson.lotte";	/*kshop 카테고리 데이터 (예외처리로 인하여 운영 데이터 사용 못함)*/
		this.kshopMainData = this.baseUrl + "/json/getKshopMainJson.lotte";		/*kshop 메인 데이터*/
		this.kshopSubData = this.baseUrl + "/json/getKshopGoodsListJson.lotte";	/*kshop 서브 데이터*/

		this.specMall2017Cate	= this.localUrl + "/json/mall/getKshopCtgListNew.json";
		this.specMall2017Main	= this.localUrl + "/json/mall/getKshopMain.json";
		this.specMall2017Sub	= this.localUrl + "/json/mall/getKshopGoodsList.json";

		this.specialMallUrl = "/mall/spec_mall.do"; // 전문관 URL
		this.specialSubUrl = "/mall/spec_mall_sub.do"; // 전문관 URL

		this.tenbytenUrl = this.baseUrl + "/mall/tenbyten/m/mall_main.do"; /* 텐바이텐 URL */
		this.d1200mUrl = this.baseUrl + "/mall/1200m/m/1200m_main.do"; /* 1200m URL */
		this.d1300kUrl = this.baseUrl + "/mall/1300k/m/1300k_main.do"; /* 1300k URL */
		this.bookshopUrl = this.baseUrl + "/mall/book/book.do"; /* 도서몰 URL */
		this.specialFlavorUrl = this.baseUrl + "/mall/special_flavor/special_flavor.do"; /* 특별한맛남 URL */
		this.gucciUrl = this.baseUrl + "/mall/gucci/m/gucci_main.do"; /* 구찌 URL */
		this.gucciQuestionUrl = this.baseUrl + "/product/product_quest_write_gucci.do" /* 구찌 문의하기 URL */
		this.gucciQuestionSaveUrl = this.localUrl + "/json/cn/comment/product_quest_save.json" /* 구찌 문의하기 save */
		this.gucciSubData = this.localUrl + "/json/mall/special_booth_sub.json"; /* 구찌 서브 데이터 yubu 추후삭제 */
		this.vineUrl = this.baseUrl + "/webzine/m/lzine_list.do"; /* 바인 URL */
		this.vineDetailData = this.localUrl + "/json/webzine/lzine_detail.json";
		this.instagramGoodsData = this.localUrl + "/json/mall/instagramGoodsArr.json"; /* 디어펫그램 데이터 */

		this.specialBoothSubData = this.localUrl + "/json/mall/special_booth_sub.json"; //구찌, 바인 카테고리

		this.mallWineUrl = this.baseUrl + "/webzine/m/lzine_detail.do"; /*와인 서브*/
		this.mallSubUrl = this.baseUrl + "/mall/m/mall_sub.do"; /*몰서브*/
		this.mallSubData = this.localUrl + "/json/mall/mall_sub.json";
		this.mallCateAttrData = this.localUrl + "/json/cate_attr.json";

		/* search */
		this.searchUrl = this.baseUrl + "/search/m/mobile_search_list.do";		/*검색 페이지*/
		this.srhListData = this.baseUrl + "/search/m/getSearchListJson.do";		/*검색결과 데이터*/
		this.srhListTermData = this.baseUrl + "/search/m/getSearchGBJson.do";	/*검색결과 조건 활성화 여부 데이터*/

		this.srhListData2016 = this.baseUrl + "/search/m/getSearch2016List.do";// 검색결과 상품목록
		this.srhListData2016LC = this.srhListData2016;
		this.srhListTermData2016 = this.baseUrl + "/search/m/getSearch2016Term.do";//검색결과 상세조건
		this.srhListTermData2018 = this.baseUrl + "/search/m/getSearch2018Term.do";//검색결과 상세조건
		this.srhListCustomSetting2016 = "/publish/getSearch2016Custom.json";//맞춤설정 카테고리, 컬러 고정값
		this.srhListCustomBrand2016 = this.baseUrl + "/json/cate_sub_brand.json";//맞춤설정 브랜드 검색
		this.srhListAdvtBrnList = "/json/search/getSearchAdvtBnrList.json";//검색광고배너 기획전배너
		this.srhListReivewPop = "/json/search/getSearchGdasDetailLayer.json";//리뷰형 팝업

		this.cateListData2016 = "/json/category/new_cate_search_list.json";// 카테고리 검색결과 데이터
		this.cateTermData2016 = "/json/category/new_cate_search_term.json";// 카테고리 검색결과 조건 활성화 여부 데이터
		this.cateListData2018 = "/json/category/renew_cate_search_list.json";// 카테고리 검색결과 데이터
		this.cateTermData2018 = "/json/category/renew_cate_search_term.json";// 카테고리 검색결과 조건 활성화 여부 데이터
		this.searchPanShopList = "/search/m/search_planshop_list.do"; // 검색,탐색 기획전형 모두보기 ( 20180308 박해원 )

		// 스타일 추천 (Style Push)
		this.stylePushIntroUrl = this.baseUrl + "/search/m/style_push_intro.do"; // 스타일 추천 인트로
		this.stylePushUrl = this.secureUrl + "/search/m/style_push.do"; // 스타일 추천 검색 리스트
		this.stylePushCtgData = this.secureUrl + "/search/m/styleRecommCateList.do"; // 스타일 추천 카테고리 정보 Data URL
		this.oddConceptAPI = "https://dl-api.oddconcepts.kr/v0/"; // 오드컨샙 API URL (스타일 추천)
		this.styleOddAPIData = "https://c-lottedotcom-g.oddconcepts.kr/api/v1/search"; // 스타일추천 데이터
		this.stylePushPrdData = this.secureUrl + "/json/search/m/styleRecommProdList.json"; // 스타일추천 상품 디테일 데이터
		this.styleRecomUrl = "/product/m/style_recom.do";
		this.styleCateListUrl = this.baseUrl + "/json/search/m/styleRecommCateGrpList.json"; // 스타일추천 카테고리 리스트
		this.styleRecomDetect	= "/json/search/m/styleRecoDetect.json";
		this.styleRecomSearch	= "/json/search/m/styleRecoSearch.json";

		/* category */
		this.brandShopUrl = this.baseUrl + "/category/m/cate_brand_main.do";	/*브랜드샵*/
		this.brandShopData = this.localUrl + "/json/brand_main.json";	/*브랜드샵 데이터*/
		this.brandShopSubSearchData = this.localUrl + "/json/cate_brand_attr.json";	/*브랜드샵 서브 검색필드 데이터*/
		this.brandShopSubUrl = this.baseUrl + "/category/m/brand_prod_list.do";	/*브랜드샵 서브*/
		this.brandShopSubData = this.localUrl + "/json/brand_sub.json";	/*브랜드샵 서브 데이터*/

		this.categoryUrl = this.baseUrl + "/category/m/new_prod_list.do"; //카테고리

		/* product */
		this.prdlstUrl = this.baseUrl + "/product/m/product_list.do";				/*기획전*/
		this.prdviewUrl = this.baseUrl + "/product/m/product_view_dev.html";			/*상품상세*/
		this.prdviewRecobellShareData = this.baseUrl + "/product/regBestProd.do"; // 상품상세 Recobell Share 데이터 수집 URL
		this.productviewUrl = "/product/m/product_view_dev.html"; /*상품상세*/

		// S 2017 상품상세 리뉴얼 신규
		this.productProductView2017Data = this.localUrl + "/json/product_new/product_view.json";			/*상품상세 기본정보*/
		this.productDetailData = "/json/product/product_detail.json";		/*[상품상세] 상품상세 Html정보*/
		this.planPrdDetailData = "/json/product_new/plan_prd_detail_html.json";		/*[상품상세] 기획전 상품상세 상단/하단 Html정보*/
		this.productOptionData = (function (goodsNo) { // 상품상세 코드별 로컬 데이터를 보기 위해 처리
			return "/json/product_new/prd_opt_info.json?goods_no="+goodsNo; /*[상품상세] 상품 옵션 정보*/
		});
		this.productCommentData = "/json/product_new/comment_info.json";		/*[상품상세] 상품평 정보*/
		this.productCommentDataNew = "/json/product_new/comment_info_new.json";		/*[상품상세] 상품평 개선 1차 */
		this.productSaleBestData = "/json/product_new/sale_best_info.json";										/*[상품상세] 다른 고객이 많이 구매한 상품 url*/
		this.productQnAData = "/json/product_new/quest_info.json";			/*[상품상세] QnA*/
		this.productBrandBestData = "/json/product_new/brand_best_info.json";				/*[상품상세]브랜드 BEST 상품정보*/
		this.otherBuyInfoUrl = "/json/product_new/other_buy_info.json";		/*[상품상세] 다른 고객들이 함께 본 상품 (recommPrdInfoUrl 레코벨 함께본 상품)*/
		this.productBestViewData = "/json/product/best_view.json";		/*[상품상세] 다른 고객들이 함께 본 상품 (recommPrdInfoUrl 레코벨 함께본 상품)*/
		this.recommSpdpInfoUrl = "/json/main_new/spdp_recomm_list.json"; // [상품상세] 추천 기획전
		this.productSimilarStyleData = "/json/search/m/styleRecommProdList.json";		/*[상품상세] 다른 고객들이 함께 본 상품 (recommPrdInfoUrl 레코벨 함께본 상품)*/
		this.productMDRecomData = "/json/product_new/md_recomm_info.json";		/*[상품상세] MD가 추천하는 상품*/
		this.productTogePlanData = "/json/main_new/spdp_recomm_list.json";		/*[상품상세] 함께 볼만한 기획전 (recommSpdpInfoUrl 레코벨 추천 기획전)*/
		this.planProdctDetailData = "/json/product/plan_product_detail.json";		/*[상품상세] 기획전형 상품 상세*/
		this.productSubReqInfoData = "/json/product_new/basic_item_info.json";	/*[상품상세 서브페이지] 필수표기정보*/
		this.productMdNoticeData = "/json/product_new/md_ntc_info.json";	/*[상품상세][앱 웹뷰 공지사항페이지]*/
		this.productSubCommentAllData = "/json/product_new/comment_info.json";	/*[상품상세 서브페이지] 전체 상품평 보기*/
		this.prodSubCommentDetailData = "/json/product_new/comment_info.json";	/*[상품상세 서브페이지] 상품평 상세 보기 데이터*/
		this.prodSubCommentImageData = "/json/product_new/comment_image.json";	/*[상품상세 서브페이지] 상품평 사진/영상 모아 보기 데이터*/
		this.productExtInfoData = "/json/product_new/exchange_info.json"; /* 배송/교환/반품/결제정보 */
		this.productBenefitCompareData = "/json/product_new/compare_prd_info.json"; /* 동일상품 혜택 비교하기 */
		this.productCollectBenefits = "/json/product_new/benefit_info.json"; /* 해택 모아보기 */
		this.productCollectBenefitsUrl = "/product/m/sub/product_collect_benefits.do"; /* 혜택 모아보기 페이지 URL */
		this.productExtInfoUrl = "/product/m/sub/product_ext_info.do?goods_no="; /* 배송/교환/반품/결제정보 안내 페이지 URL */

		this.productSubComment = "/product/m/sub/product_comment.do";	/*전체 상품평 보기 페이지*/
		this.productSubCommentDetail = "/product/m/sub/product_comment_detail.do";	/*상품평 상세 보기 페이지*/
		this.productSubCommentImageDetail = "/product/m/sub/product_comment_image_detail.do";	/*상품평 사진/영상 크게보기 페이지*/
		this.productSubCommentImage = "/product/m/sub/product_comment_image.do";	/*상품평 사진/영상 모아보기 페이지*/
		this.productSubCommentEach = "/product/m/sub/product_comment_each.do";	/*상품평 상세 보기 페이지*/
		this.prodSubImageDetailView = "/product/m/sub/product_image_view.do";	/*[상품상세 서브페이지] 상품이미지 자세히 보기 페이지*/
		this.productCategoryInfoData = "/json/product/cate_no_list.json?goods_no=";			/*상품상세 카테고리 정보*/

		// E 2017 상품상세 리뉴얼 신규

//		this.productProductViewData = this.localUrl + "/json/product/product_view.json";			/*상품상세 기본정보*/
		this.productProductViewData = this.localUrl + "/json/product/product_view.json";			/*상품상세 기본정보*/
		//this.productProductViewData = "/lotte/resources_dev/data/product/product_view_data.html";			/*상품상세 기본정보*/
		this.productLimitInfoData = "/jsondata/product_marketing.do"; // 상품상세 앱 전용/제휴채널 전면팝업 체크

		this.productProductDetailHtmlData = this.localUrl + "/json/product/product_detail.json";			/*[상품상세]상품상세 Html정보*/
		this.productProductDetailData = this.localUrl + "/json/product/getSelectProductDetails.json";			/*[상품상세]기획전형 상품상세 Html정보*/
		this.wishWishInsData = this.localUrl + "/json/mylotte/wish_ins.json"; /*[상품상세]위시리스트 담기*/
		this.cartCartInsData = this.localUrl + "/json/mylotte/cart_ins.json"; /*[상품상세]장바구니 담기*/

		this.cartRegCouponData = this.localUrl + "/json/event/reg_coupon.json"; /*[장바구니,위시리스트]중복쿠폰등록*/
		this.cartOptionData = this.localUrl + "/json/product/m/cart_option.json"; /*[장바구니]옵션정보조회*/
		this.cartLastOptionData = this.localUrl + "/json/product/m/new_product_option_change.json"; /*[장바구니]마지막옵션정보조회*/
		this.wishAddData = this.localUrl + "/json/mylotte/wish/m/wish_add.json"; /*[장바구니]위시리스트담기*/
		this.systemRestockAlramData = this.localUrl + "/json/system/restock_alram.json"; /*[장바구니]재입고알림*/
		this.cartDeleteData = this.localUrl + "/json/mylotte/cart/m/cart_delete.json"; /*[장바구니]상품삭제*/
		this.cartListData = this.localUrl + "/json/mylotte/cart/m/cart_list.json"; /*[장바구니]상품목록*/
		this.cartUpdateOptionData = this.localUrl + "/json/mylotte/cart/m/cart_update_option.json"; /*[장바구니]옵션수정*/
		this.cartUpdateSmartpickOptionData = this.localUrl + "/json/mylotte/cart/m/cart_update_smartpic_option.json"; /*[장바구니]스마트픽옵션수정*/

		this.wishDeleteData = this.localUrl + "/json/mylotte/wish/m/wish_delete.json"; /*[위시리스트]상품삭제*/
		this.wishDeleteAllByStatData = this.localUrl + "/json/mylotte/wish/m/wish_deleteall_by_stat.json"; /*[위시리스트]상태별상품전체삭제*/
		this.cartAddFromWishData = this.localUrl + "/json/mylotte/cart/m/cart_add_from_wish.json"; /*[위시리스트]카트담기*/
		this.wishSoldoutListData = this.localUrl + "/json/mylotte/wish/m/wish_soldout_list.json"; /*[위시리스트]품절판매종료상품목록조회*/
		this.wishListData = this.localUrl + "/json/mylotte/wish/m/wish_list.json"; /*[위시리스트]판매중상품목록조회*/

		this.custcenterFaqListData = this.localUrl + "/json/custcenter/faq_list.json";			/*[상품상세]faq List*/
		this.productImallStockCheckData = this.localUrl + "/json/product/imall_stock_check.json";			/*[상품상세]imal 상품및 사은품 재고 체크*/
		this.productLgStockCheckData = this.localUrl + "/json/product/lg_stock_check.json";			/*[상품상세]lg패션 재고체크*/
		this.custcenterQuestWriteGucciData = this.localUrl + "/json/custcenter/quest_write_gucci.json";			/*[상품상세]구찌상품 문의하기 화면데이터*/
		this.commentProductQuestListMobileData = this.localUrl + "/json/comment/product_quest_list_mobile.json";			/*[상품상세]상품 문의하기 목록데이터*/
		this.commentCommentViewMobileData = this.localUrl + "/json/comment/comment_view_mobile.json";			/*[상품상세]상품평 목록데이터*/
		this.couponRegCouponData = this.localUrl + "/json/coupon/regCoupon.json";			/*[상품상세]coupon download*/
		this.productRegistRentalPoint = this.localUrl + "/json/product/regist_rental_point.json";			/*[상품상세]lpoint 10원 download*/
		this.productCompareModelProduct = this.localUrl + "/json/product/compare_model_product.json";			/*[상품상세]같은상품 비교하기데이터*/
		this.productAheadCaculation = this.localUrl + "/json/product/ahead_caculation.json";			/*[상품상세]미리계산기 데이터*/
		this.productCateNavi = this.localUrl + "/json/product/cate_navi.json";			/*[상품상세]카테고리 네비게이션 데이터*/
		this.productMobileNaverMap = this.localUrl + "/json/product/mobile_naver_map.json";			/*[공통]네이버 지도정보*/
		this.productSelectGoodsOptInfoData = this.localUrl + "/json/product/select_goods_opt_info.json";			/*[상품상세]선택형 상품 옵션조회*/
		this.smartpickSmartpickBookingData = this.localUrl + "/json/smartpick/smartpick_booking.json"; /*[상품상세]스마트픽 지점정보*/

		this.productProductImgData = this.baseUrl + "/product/m/product_detail_new.do" // 상품상세 기술서 확대보기 페이지
		this.productProductSalebestData = this.localUrl + "/json/product/product_salebest.json" //이미지 확대보기 화면 이동
		this.productProductItemInfoData = this.localUrl + "/json/product/product_item_info.json";//상세정보

		/* mylotte */
		this.mylotteMainData = this.localUrl + "/json/mylotte/main_mylotte.json" /* 마이롯데 메인 데이터 */
		this.cateLstUrl = this.baseUrl + "/mylotte/cart/m/cart_list.do";				/*장바구니*/
		this.cartLstUrl = this.baseUrl + "/mylotte/cart/m/cart_list.do";				/*장바구니*/
		this.wishLstUrl = this.baseUrl + "/mylotte/wish/m/wish_list.do";				/*위시리스트*/
		this.ordLstUrl = this.secureUrl + "/mylotte/purchase/m/purchase_list.do"; 	/*주문/배송조회*/
		this.purchaseViewUrl = this.secureUrl + "/mylotte/purchase/m/purchase_view.do"; 	/*주문/배송조회 상세*/
		this.critViewUrl = this.baseUrl + "/mylotte/product/m/mylotte_crit_view.do";	/*상품평 관리*/
		this.mylotteUrl = this.baseUrl + "/mylotte/m/mylotte.do";   					/*마이롯데*/
		this.ordCancelUrl = this.secureUrl + "/mylotte/purchase/m/purchase_list.do";	/*주문취소*/
		this.ordChangeUrl = this.secureUrl + "/mylotte/purchase/m/purchase_list.do";	/*주문변경*/
		this.prdReturnUrl = this.secureUrl + "/mylotte/purchase/m/purchase_list.do";	/*교환/반품*/
		this.myCouponUrl = this.secureUrl + "/mylotte/pointcoupon/m/point_info.do";	/*내쿠폰*/
		this.gdBenefitUrl = this.baseUrl + "/mylotte/sub/soGoodBenefit.do";		/*참좋은 혜택*/
		this.gdBenefitData = this.localUrl + "/json/mylotte/good_benefit.json";		/*참좋은 혜택*/
		this.newCouponzoneUrl = this.baseUrl + "/mylotte/sub/newCouponzone.do";		/*쿠폰존*/
		this.newCouponzoneData = this.localUrl + "/json/mylotte/newCouponzone.json";		/*쿠폰존*/
		this.friendCouponUrl = this.baseUrl + "/product/m/product_list.do"; /* 절친 쿠폰북 */
		this.smartpayUrl = this.baseUrl + "/mylotte/smartpay/m/smartpay.do";		/*스마트페이 신청*/
		this.smartpayData = this.localUrl + "/json/mylotte/smartpay/smartpay.json";	/*스마트페이 data*/
		this.smartpayRegUrl = this.localUrl + "/json/cn/mylotte/smartpay/smartpay_regist.json";	/*스마트페이 등록*/
		this.lateProdUrl = this.baseUrl + "/product/m/late_view_product_list.do";	/*최근본 상품 리스트 Url*/
		this.lateProdData = this.localUrl + "/json/product/late_view_product.json";	/*최근본 상품 리스트 data*/
		this.lateOthersData = this.localUrl + "/json/product/product_salebest.json";	/*남들은 뭐봤지 data*/
		this.eventGumeUrl = this.baseUrl + "/mylotte/pointcoupon/m/event_info.do";	/*이벤트.응모/당첨*/
		this.eventGumeData = this.localUrl + "/json/mylotte/event_info.json";	/*이벤트.응모/당첨 데이터 */
		this.eventDetailUrl = this.baseUrl + "/mylotte/pointcoupon/m/event_detail.do";	/*이벤트.응모/당첨 내역 확인 */
		this.eventDetailData = this.localUrl + "/json/mylotte/event_info_detail.json";	/*이벤트.응모/당첨 내역 확인 데이터 */
		this.eventSaunUrl = this.baseUrl + "/event/m/eventSaunList.do";				/*이벤트.구매사은*/
		this.myPointUrl = this.secureUrl + "/mylotte/pointcoupon/m/point_info.do";	/*L.POINT L-money*/
		this.mylotteReinquiryListUrl = this.baseUrl + "/mylotte/product/m/mylotte_reinquiry_list.do"; /*상품 문의 내역*/
		this.mylotteReinquiryDetailUrl = this.baseUrl + "/mylotte/product/m/mylotte_reinquiry_detail.do"; /*상품 문의 상세*/
		this.productQuestListData = this.localUrl + "/json/mylotte/product/product_quest_list.json"; /*상품 문의 목록 데이터*/
		this.productQuestDetailData = this.localUrl + "/json/mylotte/product/product_quest_detail.json"; /*상품 문의 상세 데이터*/
		this.productQuestWriteUrl = this.baseUrl + "/product/product_quest_write.do";
		this.productQuestSave = this.localUrl + "/json/cn/comment/product_quest_save.json"; /*상품 문의 등록*/
		this.productQuestGoodsDetail = this.localUrl + "/json/comment/product_quest_goods_detail.json"; /*상품 문의 - 상품정보*/
		this.mylotteCritViewUrl = this.baseUrl + "/mylotte/product/m/mylotte_crit_view.do"
		this.critEventData = "/json/mylotte/product/crit_event.json";/*마이롯데 > 상품평관리 이벤트*/
		this.unwrittenCommentListData = this.localUrl + "/json/mylotte/product/unwritten_comment_list.json"; /*마이롯데 > 작성 가능한 상품평 목록 데이터*/
		this.writtenCommentListData = this.localUrl + "/json/mylotte/product/written_comment_list.json"; /*마이롯데 > 내가 작성한 상품평 목록 데이터*/
		this.commentWriteUrl = this.baseUrl + "/product/m/comment_write.do";
		this.commentWriteNewUrl = this.baseUrl + "/product/m/comment_write_new.do";
		this.commentWriteData = this.localUrl + "/json/comment/comment_write.json";
		this.commentWriteSaveData = this.localUrl + "/json/cn/comment/comment_write_save.json";
		this.commentRewriteUrl = this.baseUrl + "/product/m/comment_rewrite.do";
		this.commentRewriteNewUrl = this.baseUrl + "/product/m/comment_rewrite_new.do";
		this.commentRewriteData = this.localUrl + "/json/comment/comment_rewrite.json";
		this.commentRewriteSaveData = this.localUrl + "/json/cn/comment/comment_rewrite_save.json";
		this.commentImageDeleteData = this.localUrl + "/json/cn/comment/comment_img_delete.json"
		this.commentCountDeletedData = this.localUrl + "/json/cn/comment/comment_count_deleted.json";
		this.commentDeleteData = this.localUrl + "/json/cn/comment/comment_delete.json";
		this.commentReport = this.localUrl + "/json/product_new/bad_comment_save.json"; /* 상품평 신고하기 */
		this.checkCommentReport = this.localUrl + "/json/product_new/bad_comment_info.json"; /* 상품평 신고하기 조회 */
		this.receiptListUrl = this.secureUrl + "/mylotte/cscenter/m/cash_bill_list.do"; /* 영수증 내역 */
		this.receiptListData = this.localUrl + "/json/mylotte/receipt_issue_info.json"; /* 영수증 데이터 */
		this.smartPickListUrl = this.baseUrl + "/smartpick/pick_list.do"; /* 스마트픽 교환권 List URL */
		this.smartPickDetailUrl = this.baseUrl + "/smartpick/smp_cpn_info.do"; /* 스마트픽 교환권 상세보기 URL */
		this.smartPickSendUrl = this.localUrl + "/json/smartpick/smartpick_gift_send.json"; /* 스마트픽 교환권 보내기 URL */
		this.smartPickMmsUrl = this.localUrl + "/json/smartpick/reservation_send_mms.json"; /* 스마트픽 교환권 MMS 전송 URL */
		this.smartPickCancelUrl = this.localUrl + "/json/smartpick/reservation_cancel.json "; /* 스마트픽 교환권 취소 URL */
		this.smartPickUpdateUrl = this.localUrl + "/json/smartpick/reservation_update.json"; /* 스마트픽 교환권 수정 URL */
		this.smartPicKListData =  this.localUrl + "/json/smartpick/smartpick_list.json"; /* 스마트픽 교환권 데이터 */
		this.smartPicKGiftData =  this.localUrl + "/json/smartpick/smartpick_gift.json"; /* 스마트픽 교환권 gift 데이터 */
		this.lPayEasyUrl = this.baseUrl + "/mylotte/sub/lpay_mng.do"; /* lpay 간편결제 */
		this.orderAlarmYnUrl = this.baseUrl + "/mylotte/sub/ord_sms.do"; /* 주문정보 수신설정 */
		this.ordMsgUserSettingData = this.localUrl+"/json/mylotte/ordMsgGet.json"; // 주문정보 수신 설정 데이터 (엘롯데와 같이 쓸 경우 앞에 prefix 사용 안함)
		this.ordMsgSetting = this.localUrl+"/json/mylotte/ordMsgSave.json"; // 주문정보 수신 설정 세팅 AJAX 경로 (엘롯데와 같이 쓸 경우 앞에 prefix 사용 안함)
		this.talkUrl = this.secureUrl + "/talk/main/talk_main.do"; /* 채팅상담 Talk URL */
		this.talkIntroUrl = this.secureUrl + "/talk/main/talk_gateway.do"; /* 채팅상담 소개 URL */

		// 백화점라이브
		this.deptLiveShopUrl = this.baseUrl + "/mall/deptLive/deptLiveShop.do"; // 백화점 라이브 페이지 URL
		this.deptLiveMainData = this.localUrl+"/json/mall/deptLiveMain.json"; // 백화점 라이브 메인 데이터 (엘롯데와 같이 쓸 경우 앞에 prefix 사용 안함)
		this.deptLiveSubData = this.localUrl+"/json/mall/deptLiveBrand.json"; // 백화점 라이브 브랜드 데이터 (엘롯데와 같이 쓸 경우 앞에 prefix 사용 안함)
		this.deptLiveDetailData = this.localUrl+"/json/mall/deptLiveGoodsDetail.json"; // 백화점 라이브 상세 데이터 (엘롯데와 같이 쓸 경우 앞에 prefix 사용 안함)
		this.ellDeptLiveShopUrl = this.ellotteBaseUrl + "/mall/deptLive/deptLiveShop_el.do"; // 엘롯데 백화점 라이브 페이지 URL

		/* 포인트내역 */
		this.pointInfoUrl = this.secureUrl + "/mylotte/pointcoupon/m/point_info.do"; /* 포인트 URL */
		this.pointInfoData = this.localUrl + "/json/mylotte/pointcoupon/point_info.json"; /* 포인트 Data */
		this.smartPickGiftUrl = this.baseUrl + "/smartpick/pick_gift.do"; /* 스마트픽 교환권 SMS보내기 URL */

		this.ecouponListUrl = this.secureUrl + "" /* E쿠폰 리스트 */
		this.paperCouponUrl = this.baseUrl + "/mylotte/pointcoupon/m/coupon_write.do" /* 페이퍼쿠폰등록 URL */
		this.paperCouponSaveUrl = this.localUrl + "/json/mylotte/pointcoupon/insert_paper_coupon.json" /* 페이퍼쿠폰등록 등록 */
		this.savePointUrl = this.localUrl + "/json/mylotte/pointcoupon/point_save.json" /* 포인트 적립하기 URL */
		this.depositDetailUrl = this.baseUrl + "/mylotte/pointcoupon/m/deposit_refund.do" /* 보관금 환불신청상세 URL */
		this.depositRefundUrl = this.localUrl + "/json/mylotte/pointcoupon/point_save.json" /* 보관금 환불신청 URL */

		/* custcenter */
		this.questionSave = this.localUrl + "/json/cn/custcenter/inquiry_save.json";  /* 1:1문의하기 등록 */
		this.noticeListUrl = this.baseUrl + "/custcenter/notice.do";					/*공지사항*/

		this.cscenterMainData = this.localUrl + "/json/custcenter/main_custcenter.json"; /* 고객센터 메인 데이터 */
		this.cscenterFaqData = this.localUrl + "/json/custcenter/faq_list.json"; /* FAQ 데이터 */
		this.cscenterNoticeData = this.localUrl + "/json/custcenter/notice_list.json"; /* 공지사항 데이터 */
		this.cscenterQnaData = this.localUrl + "/json/custcenter/inquiry_list.json"; /* QNA 데이터 */
		this.productQuestionData = this.localUrl + "/json/custcenter/inquiry_detail.json";  /* 1:1문의 답변 상세 데이터 */
		this.cscenterOrderData = this.localUrl + "/json/custcenter/inquiry_order_list.json"; /* 1:1 주문이력 목록조회 데이터 */
		this.cscenterOrderDetailData = this.localUrl + "/json/custcenter/inquiry_order.json"; /* 1:1 주문이력 단건 조회 데이터 */

		this.custcenterUrl = this.baseUrl + "/custcenter/cscenter_main.do";				/*고객센터 URL*/
		this.cscenterFaqUrl = this.baseUrl + "/custcenter/faq.do"; /* FAQ URL */
		this.cscenterNoticeUrl = this.baseUrl + "/custcenter/notice.do"; /* 공지사항 URL */
		this.questionUrl = this.baseUrl + "/custcenter/m/question.do"; /* QNA URL */
		this.cscenterAnswerUrl = this.baseUrl + "/custcenter/m/answer.do"; /* 1:1문의목록 URL */
		this.cscenterAnswerDetaileUrl = this.baseUrl + "/custcenter/m/answer_detail.do"; /* 1:1문의상세 URL */

		this.footerProvisionData = this.localUrl + "/json/footerProvision.json"; // 이용약관

		// 임직원 오류 게시판
		this.errorAlarmUrl = this.baseUrl + "/custcenter/dotcomStaffBoard.do"; // 임직원 오류신고 게시판
		this.dotcomStaffBoardData = this.baseUrl + "/json/custcenter/dotcom_staff_board_list.json"; // 임직원 오류신고 데이터
		this.dotcomStaffBoardWrite = this.baseUrl + "/json/event/reg_dotcom_staff_board.json"; // 임직원 오류신고 게시판 글작성
		this.dotcomStaffBoardDelete = this.baseUrl + "/json/event/del_dotcom_staff_board.json"; // 임직원 오류신고 게시판 글삭제
		this.dotcomStaffBoardReply = this.baseUrl + "/json/event/reg_dotcom_staff_board_reply.json"; // 임직원 오류신고 게시판 댓글 등록

		/* agreement */
		//this.companyUrl = this.baseUrl + "/agreement/company.do";					/*회사소개*/
		this.companyUrl = "http://company.lotte.com/mobile/index.lotte";
		this.agreeUrl = this.baseUrl + "/agreement/custAgreement.do";				/*이용약관*/
		this.privacyUrl = this.baseUrl + "/agreement/custPrivacy.do";				/*개인정보취급방침*/
		this.protectYouthUrl = this.baseUrl + "/agreement/protect_youth.do";		/*청소년보호방침*/
		this.agreementDataUrl = this.localUrl + "/json/footerProvision.json";  /* yubu 추후 삭제 */

		/* etc */
		this.sciUrl = this.secureUrl + "/sci/pcc_V3_seed.jsp";						/*본인인증*/
		this.tclickUrl = this.localUrl + "/exevent/tclick.jsp?tclick=";				/*tclick*/
		this.appDown = this.baseUrl + "/app.do";
		this.facebookUrl = this.baseUrl + "/exevent/facebook_landing_lotte.jsp"; /* 페이스북 공유 페이지 */
		/* recobel 추천*/
		//this.salebestlist_url = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/r002?size=10&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b";
		// 추천 상품
		this.salebestlist_url		= "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/a002?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b"; // 남들은 뭘 샀지
		this.salebestlist_url_ds	= "http://analyticsapi.lotte.com/analytics/ds001"; // 다른고객이 함께 찾은 상품 (데이터 사이언스 API)
		this.salebestlist_url_al = "http://api-reco.alido.co.kr/recommendation/pagearea-set/service-id-1";
		this.recobellOtherBuyInfoUrl = "http://rb-rec-api-apne1.recobell.io/rec/a005?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b"; // 다른고객이 함께 찾은 상품 (보완재)
		this.salebestPaln_url = "http://rb-rec-api-apne1.recobell.io/rec/a101?size=100&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b"; // 추천 기획전
		/* footer */
		this.noticeUrl = this.localUrl + "/json/notice_list.json ";  /* footer 공지사항 */

		this.orderFormUrl = this.secureUrl + "/order/m/order_form.do"; // 주문서 페이지

		this.rentalCustomerUrl = "/json/login/lental_customer.json"; //렌탈 상담신청하기 - 사용자 정보
		this.rentalSendUrl = "/json/mylotte/lental_info_ins.json"; //렌탈상담신청하기 - 신청

		this.styleShopMainUrl = "/styleshop/styleshop_main.do"; // 스타일샵 메인
		this.styleShopUrl = "/styleshop/styleshop.do"; // 스타일샵 서브
		this.styleShopData = "/json/main/styleShop_sub_list.json"; // 스타일샵

		this.styleShopMenUrl = "/styleshop/styleshopmen.do"; // 스타일샵맨
		this.styleShopMenData = "/json/main/styleShop_men_sub_list.json"; // 스타일샵맨
		this.searchSurvery = "/json/search/insertSatisfaction.json"; // 201601012  검색결과 만족도
		// Naver Map
		this.naverMapInfo = "/product/crossdomain.do"; // 네이버맵 좌표 URL

		// 201603 모바일 리뉴얼
		this.cartCountData2016 = "/json/cart_count.json"; // 장바구니 개수 Data
		//this.rootMenuData2016 = "/json/main/root_menu_2016.json"; // 메인 메뉴 Data
		this.rootMenuData2017 = "/main_json_gate.do"; // 메인 메뉴 Data
		// this.rootMenuData2016 = "/json/root_menu_2016.json"; // 메인 메뉴 Data
		this.sideCtgData2016 = "/jsondata/lotte_sidectg_2016.do"; // 탐색(좌측카테고리) Data
		this.sideCtgData2017 = "/jsondata/lotte_sidectg_2017.do"; // 탐색(좌측카테고리) Data
        this.sideCtgData2018 = "/json/category/lotte_sidectg_2018.json"; // 탐색(좌측카테고리) Data
        
		this.smartpickUrl = "/mall/smartpick.do";  /*서브 스마트픽*/
		this.smartpickData = "/json/mall/smartpick.json"; /*서브 스마트픽data*/

		this.tvShoppingUrl = "/mall/tvShopping.do";  /*서브 TV쇼핑*/
		this.tvShoppingData = "/json/mall/tvShopping.json"; /*서브 TV쇼핑data*/

		this.rankingUrl = "/mall/ranking.do";  /*서브 랭킹존*/
		this.rankingData = "/json/mall/ranking.json"; /*서브 랭킹존*/

		this.cartSave = "/json/mylotte/cart/m/cart_save.json";// 장바구니 보관하기
		this.cartCancel = "/json/mylotte/cart/m/cartCancelArea.json";// 장바구니 보관취소

		this.presentListUrl				= "/gift/m/present_list.do";//받은 선물함
		this.presentDetailUrl			= "/gift/m/present_detail.do";//선물 상세
		this.presentWriteCommentUrl		= "/gift/m/present_comment_write.do";//선물 이용후기 쓰기
        this.presentEditCommentUrl		= "/gift/m/present_comment_write_2.do";//선물 이용후기 수정 20170706
		this.presentReceivedListData	= "/json/order/receive_present.json";//받은 선물 리스트 데이타
		this.presentSentListData		= "/json/order/send_present.json";//보낸 선물 리스트 데이타
		this.presentListCheckNewData	= this.secureUrl + "/json/order/receive_present_map.json";//받은 선물 조회
		this.presentDetailData			= "/json/order/gift_detail.json";//선물상세 데이타
		this.presentDetailOption		= "/json/order/option_update.json";//선물상세 옵션변경
		this.presentDetailAddress		= "/json/order/deli_update.json";//선물상세 배송지변경
		this.presentCommentProductData	= "/json/order/gift_epilogue_info.json";//선물 이용후기 상품정보
		this.presentCommentSave			= "/json/order/gift_epilogue_writer.json";//선물 이용후기 저장하기
		this.presentCommentImageDelete	= "/json/order/comment_img_delete.json";//선물 이용후기 이미지 삭제
		/*크로스픽*/
		this.pickMapUrl = "/smartpick/crosspick_map.do";//지도 경로
		this.pickCartUpdate = "/json/mylotte/cart/chgCrspkWithNormal.json"; //배송방법 변경
		/*퀵배송*/
		this.quickCartUpdate = "/json/mylotte/cart/chgQuickWithNormal.json";//장바구니 퀵배송상품 배송방법 변경
        /*선물확인*/
        this.giftCheckUrl = "/json/order/gift_confim_info.json"; //선물확인
        this.searchAddress    = "/json/order/ord_search_address.json";//배송지 조회
        this.giftGoodDetail = "/json/mylotte/gift_good_detail.json";//상품기술서
        this.gift_epilogue = "/json/order/gift_epilogue.json";//선물확인 완료 - 이거어때리스트
        this.confirm_gift = "/json/order/gift_update.json"; //선물확인, 거
        //배송지삭제
        this.delete_address_list = "/json/order/delivery_info.json";
        //생생#라이브
        this.sslive_good = "/json/mall/sslive.json"; //상품정보
        this.sslive_talk = "/json/mall/ssLive_commentList.json"; //생생톡
        this.sslive_save = "/json/mall/commentssLiveInsert.json"; //commentInsert.json"; //생생톡 저
        /*기획전추천*/
        this.prsn_list = "/json/planshop/prsn_spdp_recomm_list.json";

        /*선물함 교환 옵션리스트*/
        this.gift_optlist = "/json/order/gift_option_list.json";
        this.gift_change = "/json/order/gift_insert_ob.json";

		/* 샤넬관 */
		this.chanelMall = "/json/mall/mall_chanel_main.json"; //샤넬관 메인
		this.chanelMallSubData = "/json/mall/mall_chanel_sub.json"; //카테고리
		this.chanelMallSubUrl = "/mall/chanel/chanel_prod_list.do"; //리스트

		/* 나의 총 클로버 */
		this.cloverUrl = "/event/clover.do"; /* 나의 총 클로버 URL */

		/* 애완몰 */
		this.petMallMainUrl = "/mall/pet/mitou_main.do"; //애완몰 메인
		this.petMallMainData = "/json/mall/dearpet_main.json"; //애완몰 메인 데이타
		this.petMallProdListData = "/json/mall/dearpet_prod_list.json"; //애완몰 서브
		this.petMallProdListUrl = "/mall/pet/mitou_prod_list.do"; //애완몰 리스트
		this.petMallgalleryUrl = "/mall/pet/mitou_gallery.do"; //애완몰 뽐내기
		this.petMallgalleryData = "/json/mall/dearpet_gallery.json"; //애완몰 뽐내기 데이타
		this.petMallgalleryLikeData = "/json/mall/dearpet_good.json"; // 좋아한 게시물 (20170703)
		this.petMallSwagDeleteData = "/json/mall/swag_delete.json"; /* 뽐내기 글 삭제 */
		this.petCommentData = "/json/mall/pet/commentList.json";	/* 뽐내기 댓글데이터 */
		this.petCommentDeleteData = "/json/mall/pet/commentDelete.json"; /* 뽐내기 댓글데이터 삭제 */
		this.petCommentRegData = "/json/mall/pet/commentInsert.json"; /* 뽐내기 댓글데이터 등록 */
		this.petMalleventUrl = "/mall/pet/mitou_news.do"; // 이벤트 ( 20170405 추가 )
		this.petMalleventData = "/json/mall/dearpet_news.json";

		this.petMallpetMainPetProductData= "/json/mall/dearpet_main_data.json"; // 펫 스와이프시  제품 목록 변경 ( 20170628 )
		this.petMallpetMainPetActiveData= "/json/mall/pet_mast_yn.json"; // 펫 스와이프시  제품 목록 변경 ( 20170628 )
		this.petMallgalleryLikeData = "/json/mall/dearpet_gallery.json"; // 내가 좋아한 글 목록 (  ( 20170628 )
		this.petMallpetWriteUrl = "/mall/pet/pet_write.do" ; // 우리 아이 등록 페이지 ( 20170703 )
		this.petMallpetWriteData = "http://www.lotte.com/display/petInsert.lotte";//"/json/mall/pet_write_save.json"; // 우리 아이 등록 ( 20170703 )
		this.petMallpetEditData = "/json/mall/pet_rewrite.json"; // // 우리 아이 등록 목록 ( 20170703 )
		this.petMallpetReWrite = "http://www.lotte.com/display/petUpdate.lotte";//"/json/mall/pet_rewrite_save.json"; // 우리 아이 수정 ( 20170703 )
		this.petMallpetDeleteData = "/json/mall/pet_delete.json"; // 우리 아이 삭제 ( 20170703 )
		this.petMallpetFormCodeData = "/json/mall/pet_write.json"; // 등록 폼 데이타 ( 20170703 )

		this.swagWriteUrl = "/mall/pet/swag_write.do";
		this.swagWriteData = "/json/mall/swag_write.json"; //뽐내기 작성
		this.swagWriteCheckData = "/json/mall/chk_swag_cont.json"; //뽐내기 작성 금지어 체크
		this.swagWriteSaveData = "/json/mall/swag_write_save.json"; //뽐내기 저장
		this.swagRewriteUrl = "/mall/pet/swag_rewrite.do";
		this.swagRewriteData = "/json/mall/swag_rewrite.json";  //뽐내기 수정
		this.swagRewriteSaveData = "/json/mall/swag_rewrite_save.json"; //뽐내기 수정 저장
		this.swagImageDeleteData = "/json/mall/swag_img_delete.json";  //뽐내기 이미지 삭제

	    this.petMallStory= "/json/mall/mitou_story.json";
	    this.petMallStoryDetail="/json/mall/mitou_story_detail.json";//펫스토리상세
	    this.petMallStoryUrl= "/mall/pet/mitou_story.do";
	    this.petMallStoryDetailUrl="/mall/pet/mitou_story_detail.do";//펫스토리상세URL
	    this.petMallAdviceUrl="/mall/pet/mitou_advice.do"

		/* 유아동 체험단 */
		this.kidsExperienceMainUrl = "/event/m/kids/experience_main.do";  /* 유아동 체험단 상세 Url */
		this.kidsExperienceMainData = "/json/event/mom_tester_list.json"; /* 유아동 체험단 메인 List data */
		this.kidsExperienceDetailData = "/json/event/mom_tester_detail.json";  /* 유아동 체험단 상세 data */
		this.kidsExperienceDetailUrl = "/event/m/kids/experience_view.do";  /* 유아동 체험단 상세 Url */
		this.kidsExperienceWinnerUrl = "/event/m/kids/experience_winner_list.do";  /* 유아동 체험단 당첨자 Url */
		this.kidsExperienceWinnerData = "/json/event/evt_tester_prizewinner.json";  /* 유아동 체험단  당첨자  data */
		this.kidsExperienceApplySave = "/event/regEvent.do";
		this.kidsExperienceApplyBbsData = "/json/event/evt_bb_list.json";	/* 유아동 체험관 신청 게시판  data*/
		this.kidsExperienceReviewGdasData = "/json/event/evt_gdas_list.json";	/* 유아동 체험관 후기 게시판 */
		this.kidsExperienceWriteUrl = "/event/m/kids/experience_write.do";  /* 유아동 체험단 신청하기 Url */
		this.kidsExperienceReviewData = "/json/event/mom_tester_apply.json";	/* 유아동 체험관 후기 data */
		this.kidsExperiencePrizewinnerData = "/json/event/evt_tester_prizewinner_yn.json";	/* 유아동 체험관 당첨조회 data */

		//상품상세 -> 고객등록사진보기 Url
        this.photoreviewPage = "/product/m/photoreview.do";
		this.kidscommentWriteUrl = this.baseUrl + "/product/m/kids_comment_write.do";/* 유아동 체험관 후기작성 url */

		/* 육아고객타겟매장 */
		this.infantMainUrl = "/mall/baby/baby_main.do";  /* 육아고객타겟매장 메인 Url */
		this.infantMainData = "/json/mall/baby_main.json"; /* 육아고객타겟매장 메인  data */
		this.infantTipData = "/json/mall/baby_tip.json"; /* 육아고객타겟매장-팁  data */
		this.infantPhotoData = "/json/mall/baby_photo.json"; /* 육아고객타겟매장-포토후기  data */

		this.infantTipWriteUrl = "/mall/baby/swag_baby_write.do";
		this.infantTipWriteData = "/json/mall/swag_baby_write.json"; //육아팁 작성
		this.infantTipWriteCheckData = "/json/mall/chk_swag_baby_cont.json"; //육아팁 작성 금지어 체크
		this.infantTipWriteSaveData = "/json/mall/swag_baby_write_save.json"; //육아팁 저장
		this.infantTipRewriteUrl = "/mall/baby/swag_baby_rewrite.do";
		this.infantTipRewriteData = "/json/mall/swag_baby_rewrite.json";  //육아팁 수정
		this.infantTipRewriteSaveData = "/json/mall/swag_baby_rewrite_save.json"; //육아팁 수정 저장
		this.infantTipImageDeleteData = "/json/mall/swag_baby_img_delete.json";  //육아팁 이미지 삭제
		this.infantTipDeleteData = "/json/mall/swag_baby_delete.json"; // 육아팁 글 삭제
		this.infantTipCommentWriteData = "/json/mall/baby_comment_insert.json" // 육아팁 댓글 작성
		this.infantTipCommentListData = "/json/mall/baby_comment_list.json" // 육아팁 댓글 조회
		this.infantTipCommentDeleteData = "/json/mall/baby_comment_delete.json" // 육아팁 댓글 삭제
		this.infantTipLikeData = "/json/mall/baby_recomm_save.json" // 육아팁 댓글 좋아요 클릭

		/* 베스트브랜드몰 */
		this.bestBrandMain = "/brand/bestbrandMain.do" // 베스트브랜드몰메인
		this.bestBrandSub = "/brand/bestbrandSub.do" // 베스트브랜드몰서브
		this.bestBrandMainData = "/json/brand/best_brand_mall_main.json" // 베스트브랜드몰메인
		this.bestBrandSubData = "/json/brand/best_brand_mall_sub.json" // 베스트브랜드몰서브
		this.bestBrandHeaderData = "/json/brand/best_brand_mall_header.json" // 베스트브랜드몰헤더

		// 대화형커머스
		this.talkRecomUrl		= this.secureUrl + "/talk/main/Samanda_main.do";//바닥페이지
		this.talkRecomChatbot	= "/json/talk/chatbotRequest.json";//챗봇
		this.talkRecomProdlist	= "/json/talk/talk_recom_prod.json"//상품목록
		this.talkRecomAppMenu	= "/publish/talkrecom_menu.json";//App 메뉴
		this.talkShopUrl		= this.secureUrl + "/talk/main/talkShopping.do";//음성주문 pagae
		this.talkShopChatbot	= this.talkRecomChatbot;//챗봇
		this.talkShopPriorInfo	= this.secureUrl + "/json/talk/talk_prior_info.json"//배송/결제 data
		this.talkShopDelevery	= this.secureUrl + "/popup/talk_delivery_service.do";//배송지 수정 page
		this.talkShopPayment	= this.secureUrl + "/popup/talk_base_pay.do";//결제수단 수정 page
		this.talkShopOrderFrame	= this.secureUrl + "/order/m/order_form.do";//결제 아이프레임
		this.talkShopIntro		= "/talk/voice_order.do";//음성주문 안내

		// 보이스커머스
		this.voiceCommerceUrl = this.secureUrl + "/talk/main/voiceCommerce.do"; // 보이스커머스 (안녕샬롯) 페이지
		this.vcInfoData = "/json/talk/talk_my_page_info.json"; // 보이스커머스 햄버거 표현 데이터 (배송지, 결제수단, 추천발화가이드)
		this.vcStartVoiceInfoData = "/json/talk/talk_start_base_info.json"; // 보이스 커머스 인입시 발화가이드
		// this.semanticAnalysisData = "/json/talk/chatbotRequest.json"; // 의미분석 URL
		// this.semanticAnalysisData = "/ichat/talkAsync.wn"; // 의미분석 URL
		this.semanticAnalysisData = "/json/talk/voiceCommerceRequest.json"; // 의미분석 URL
		this.vcPrdInfoData = "/json/talk/talk_goods_list.json"; // 보이스 커머스 상품정보 URL
		this.vcPrdOptInfoData = "/json/talk/talk_prd_opt_info.json"; // 상품 옵션 정보
		this.vcHelpInfoData = "/json/talk/talk_help.json"; // 보이스 커므스 도움말 정보 데이터 (코너)
		this.vcPrdQtyChkData = "/json/talk/searchInvQtyCheckByGoodsNoAjax.json"; // 보이스커머스 재고 수량 체크
		this.vcPrdOrderDecideData = "/json/talk/talk_order_decide.json"; // 보이스커머스 주문 확정 데이터
		this.vcOrdCompleteData = "/json/talk/talk_order_complete.json"; // 보이스커머스 주문완료 데이터
		this.vcDeliveryInfoData = "/json/talk/talk_prd_dlv_info.json"; // 배송비, 배송기일 확인 API
		this.vcAddCart = "/json/talk/talk_cart_ins.json"; // 보이스 커머스 장바구니 담기 API
		this.vcAddWish = "/json/talk/talk_wish_ins.json"; // 보이스 커머스 위시 담기 API
		this.vcPrdImgListData = "/json/talk/talk_prd_img_info.json"; // 보이스 커머스 상품 이미지 리스트 정보 확인
		this.vcProductCommentData = "/json/product_new/comment_info.json"; // 상품평 데이터
		//보이스커머스 2차 
		this.vcCoupon = "/json/talk/talk_coupon_list.json"; //쿠폰 조회
		this.cardSaleListData = "/json/talk/talk_card_discount.json"; //청구할인,무이자할부
		this.saunRegistAll = "/json/talk/regist_all_saun.json"; //구매사은 이벤트 모두 신청
		this.purchaseList = "/json/talk/talk_purchase_list.json"; //주문내역
		this.counselorList = "/json/talk/talk_counselor_time_info.json"; /* 고객센터 Data */
		this.mimiRegistUrl = "/mall/pet/pet_write.do"; //우리 아이 등록
		this.receiptEvtUrl = "/event/receipt.do"; /* 영수증 이벤트 */
		

		/* 고객 이탈 방지 팝업*/
		this.keepPopData = "/json/main_new/keep_stay_popup.json";//고객 이탈 방지 팝업
        this.keepPopDataCall = "/json/main_new/keep_stay_popup_call.json"; //팝업 타입 ( 팝업 오픈 여부 호출 )

		/* 동영상플랫폼 */
    	this.movieStoreData = "/json/mall/goodsInfo_video_mall_bot.json"; // 동영상 전용매장
		this.movieStoreDataTop = "/json/mall/goodsInfo_video_mall_top.json?dispNo=5586147"; /* 동영상 플랫폼 */
		this.movieReviewData = "/json/mall/reviewer_mall.json"; /* 동영상 리뷰매장 */

		/* 삼성전자 베스트브랜드몰*/
		this.samsungBrandMain = "/mall/samsung/bestsamsung_main.do"; //삼성전자 베스트브랜드몰메인
		this.samsungBrandSub = "/mall/samsung/bestsamsung_sub.do"; // 삼성전자 베스트브랜드몰 서브
		this.samsungBrandcontData = "/json/mall/samsung_mall_main.json"; //삼성전자 베스트브랜드몰메인 데이터
		this.samsungBrandSubcontData = "/json/mall/samsung_mall_sub.json"; //삼성전자 베스트브랜드몰서브 데이터
		
		/* 개인화 종합페이지 */
		this.myfeedUrl			= "/mylotte/m/myfeed.do"; // 개인화 종합페이지
		this.myfeedDataUrl		= "/json/mylotte/my_recomm_info.json"; // 개인화 API 경로
		
		/* 이용약관 */
		this.clauseECommerce	= "/publish/layer_clause_ecommerce.jsp";
		this.clausePIUse		= "/publish/layer_clause_pi_use.jsp";
		this.clausePIConsign	= "/publish/layer_clause_pi_consign.jsp";
		
		/* 이용약관 */
		this.clauseKgECommerce	= "/publish/layer_kg_clause_ecommerce.jsp";
		this.clauseKgPIUse		= "/publish/layer_kg_clause_pi_use.jsp";
		this.clauseKgPIConsign	= "/publish/layer_kg_clause_pi_consign.jsp";
	
		/*자주 구매*/
		this.oftenProdUrl = "/mylotte/often/often_buy_list.do"; //자주구매 페이지
		this.oftenBuyList = "/json/mylotte/often/often_buy_list.json"; //자주구매리스트 데이터
		this.oftenBuyOption = "/json/product/often_buy_option.json"; //자주구매 상품 옵션 데이터

		/* 전문몰 핀터레스트 데이터 */
		this.specMallDetailData = "/json/mall/kshop_detail.json";
		this.specMallDetailProductsData = "/json/mall/kshop_detail_products.json";
		this.specMallDetail = "/mall/spec_mall_detail.do";
		this.specMallDetailProducts = "/mall/spec_mall_detail_product.do";

        /*20180130 개인화추천 API 변경*/
        this.rec_good = "http://rb-rec-api-apne1.recobell.io/rec/a002?cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b";
        this.rec_plan = "http://rb-rec-api-apne1.recobell.io/rec/a101?cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b";
        this.rec_buy = "http://rb-rec-api-apne1.recobell.io/rec/a005?cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b";
        this.rec_search = "http://rb-rec-api-apne1.recobell.io/rec/s001?cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b";		

		// 닷컴/슈퍼 폴더앱 PRJ 추가 API 경로
		this.headerLandingData = "/json/main_new/getAppHeaderIcon.json"; // 헤더 우측 상단 코너 데이터

		this.SuperCartListData = "https://m.lottesuper.co.kr/handler/united/gateway/SuperCartIf-Start"; // 슈퍼 장바구니 리스트 API JSON
		this.SuperWishListData = "https://m.lottesuper.co.kr/handler/united/gateway/WishListIf-Start"; // 슈퍼 위시리스트 리스트 API JSON
		this.SuperWishDeleteData = "https://m.lottesuper.co.kr/handler/united/gateway/WishListIf-Delete"; // 슈퍼 위시리스트 삭제 API JSON
		this.SuperWishInsertCartData = "https://m.lottesuper.co.kr/handler/united/gateway/SuperCartIf-InsertCart"; // 슈퍼 위시리스트 장바구니담기/바로구매 API JSON
		this.SuperDirectBuyUrl = "https://m.lottesuper.co.kr/handler/united/gateway/SuperCartIf-AddCart"; // 바로구매

		this.SuperLoginSSOUrl = "https://m.lottesuper.co.kr/handler/Interface-DcomSSO"; // 롯데슈퍼 로그인 연동 Gate 페이지

		this.SuperMainUrl = "http://m.lottesuper.co.kr"; // 슈퍼 메인
		this.SuperCartUrl = "http://m.lottesuper.co.kr/handler/cart/SuperCart-Start"; // 장바구니
		this.SuperProdDetailUrl = "http://m.lottesuper.co.kr/handler/goods/GoodsDetail"; // 상품상세
		this.SuperSearchListUrl = "http://m.lottesuper.co.kr/handler/search/Search-Result"; // 검색리스트
		this.SuperOrderListUrl = "http://m.lottesuper.co.kr/handler/mypage/main/MyPageOrder-Start"; // 슈퍼 주문내역
		this.SuperWishListUrl = "http://m.lottesuper.co.kr/handler/mypage/wishlist/WishList"; // 슈퍼 위시리스트
		this.SuperQuickBuyUrl = "http://m.lottesuper.co.kr/handler/mypage/wishlist/QuickBuy-OftenBuyList"; // 슈퍼 자주구매

		this.superBnrExcludeKeywordData = "/jsondata/superbnr_exclude_keyword.do"; // 닷컴/슈퍼 검색 슈퍼 배너 제외 키워드 데이터
		
        //this.adReq =  "http://alpha.display.lottecpcad.com/adReq"; //광고솔루션 테스트 URL (탐색, 검색) 
        //this.adReqMain =  "http://alpha.display.lottecpcad.com/da/"; //광고솔루션 테스트 URL 메인
        this.adReq =  "http://display.lottecpcad.com/adReq"; //광고솔루션 URL
        this.adReqMain =  "http://display.lottecpcad.com/da/"; //광고솔루션 URL 메인
        
		/*버버리 전문관*/
		this.mallBurberryMain = "/mall/burberry/burberry_main.do";// 버버리 메인페이지
		this.mallBurberryList = "/category/m/burberry_prod_list.do"; //버버리 상품리스트 페이지
		this.BurberryCsCenter = "/custcenter/m/burberry_cscenter.do"; // 버버리 cs 센터
		this.BurberryProdView = "/product/m/product_view_burberry.do"; // 버버리 상세
	
		this.mallBurberryCateData = "/json/mall/mall_burberry_category.json"; //버버리 카테고리 데이터
		this.mallBurberryData = "/json/mall/special_booth.json"; //버버리 메인 데이터
		this.subBurberryListData = "/json/mall/mall_burberry_sub.json"; //버버리 상품리스트 데이터
		this.BurberryCsData = "/json/mall/mall_burberry_faq.json"; // 버버리 cs 센터
        /*중고매장 06.28 open*/
        this.used_main = "/json/mall/board_main.json"; //중고매장 메인
        this.used_write = "http://www.lotte.com/display/boardInsert.lotte"; //중고물품 등록하기
        this.used_rewrite = "http://www.lotte.com/display/boardUpdate.lotte"; //중고물품 등록하기
        this.used_reply_list = "/json/mall/reply_list.json"; //댓글 조회 
        this.used_reply_write = "/json/mall/reply_write.json"; //댓글 조회 
        this.used_recommend = "/json/mall/board_recommend.json";//추천하기 
        this.used_declare = "/json/mall/board_declare.json";//신고하기 
		this.used_declare2 = "/json/mall/reply_declare.json";
		this.used_reply_delete = "/json/mall/reply_delete.json";//댓글 삭제하기 
        this.used_delete = "/json/mall/board_delete.json";//글 삭제하기 
        this.used_main_link = "/mall/board/board_main.do"; //메인 경로 
        this.used_write_link = "/mall/board/board_write.do"; //글 작성, 수정하기 경로    
        this.board_chk = "/json/mall/board_chk_cont.json"; //금칙어 체크 
		this.used_img_del = "/json/mall/board_img_delete.json";//이미지삭제
		this.used_photoWrite = "http://www.lotte.com/display/boardImgInsert.lotte"; //중고매장 이미지 한장씩 올리기 
		this.used_info = "/json/mall/board_info.json"; //중고라운지 공지사항
		
		/* 상품평 개선 2차 */
		this.favoriteReviewer = this.baseUrl + "/mylotte/product/m/mylotte_favorites_reviewer.do"; // 즐겨찾는 리뷰어
		this.favoriteReviewerList = "/json/mylotte/product/favorite_reviewer.json";	//즐겨찾는 리뷰어 조회
		this.addFavReviewer = "/json/mylotte/product/reg_favorite_reviewer.json"; //즐겨찾는 리뷰어 추가
		this.delFavReviewer = "/json/mylotte/product/del_favorite_reviewer.json"; // 즐겨찾는 리뷰어 삭제
		this.reviewCategory = "/json/comment/best_category_info.json";	//베스트 상품평 카테고리
		this.reviewBestCtg = "/json/comment/best_review_comment.json";	//베스트 상품평 조회 
		this.reviewBest = this.baseUrl + "/product/m/best_review_view.do"; //베스트 상품평 URL
		this.reviewerHomeInfo = "/json/comment/reviewer_home_info.json"; //리뷰어 홈 조회
		this.reportBadReviewer = "/json/comment/bad_reviewer_save.json"; //리뷰어 닉네임 신고하기
		
		this.dearpet_brdbest = "/json/mall/dearpet_brd_best_list.json";//미미뚜뚜 브랜드베스트

		/* SSO 통합회원제 */
		this.getClientAskInfo = "/json/login/getSsoActiveClientInfoAjax.json"; // SSO 통합회원 라이브러리초기화 데이터 
		this.ssoAfterLogin = "/json/login.json"; // SSO 통합회원 로그인 후 닷컴 로그인 처리 URL
		this.getSsoRnwTkn = "/json/login/getSsoAcesTknAjax.json"; // SSO 갱신토큰 및 갱신토큰 저장날짜 호출 URL
		this.ssoDropGate = this.baseUrl + "/login/ssoDropGate.do"; //SSO 탈퇴 리턴 URL
		
		/* 간편로그인 UI변경 이메일주소 리스트 */ 
		this.email_kind = "/json/login/getEmailKind.json";
	}]);
	 
	

})(window, window.angular);
