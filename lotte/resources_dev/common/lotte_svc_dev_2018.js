 LOTTE_CONSTANTS = {};
LOTTE_CONSTANTS['MAPI_HOST_API'] = "http://mapi.lotte.com";
LOTTE_CONSTANTS['MAPI_HOST_SSL_API'] = "http://molocal.lotte.com";
LOTTE_CONSTANTS['M_HOST_MOBILE'] = "http://molocal.lotte.com";
LOTTE_CONSTANTS['M_HOST_SSL'] = "http://molocal.lotte.com";
LOTTE_CONSTANTS['PC_HOST_WEB'] = "http://fo.lotte.com";

//rudolph:150911 - start
LOTTE_CONSTANTS['NORMAL_LOGIN'] = "0";  /*일반적 로그인 시*/
LOTTE_CONSTANTS['ONENONE_BUY_LOGIN'] = "1"; /*원앤원 구매 요청 시 로그인 페이지로 올 때*/
LOTTE_CONSTANTS['CART_BUY_LOGIN'] = "2"; /*카드 구매 요청 시 로그인 페이지로 올 때*/
LOTTE_CONSTANTS['ORDER_SEARCH_LOGIN'] = "3"; /*주문배송조회 요청 시 로그인 페이지로 올 때*/
LOTTE_CONSTANTS['IMALL_BUY_LOGIN'] = "4";  /*홈쇼핑상품 상품상세 바로구매 요청 시 로그인 페이지로 올 때*/
LOTTE_CONSTANTS['IMALL_CART_BUY_LOGIN'] = "5";  /*홈쇼핑상품 장바구니에서 바로구매 요청 시 로그인 페이지로 올때*/
LOTTE_CONSTANTS['LOGIN_SEED'] = "MDOTCOM";
LOTTE_CONSTANTS['ORDER_PROTOCAL'] = "http";
LOTTE_CONSTANTS['MOBILE_DOMAIN'] = "molocal.lotte.com";

LOTTE_CONSTANTS['ELLOTTE_HOST_MOBILE'] = "http://molocal.ellotte.com";
LOTTE_CONSTANTS['ELLOTTE_HOST_SSL'] = "http://molocal.ellotte.com";
LOTTE_CONSTANTS['ELLOTTE_LOGIN_SEED'] = "NMELLOTTE";
LOTTE_CONSTANTS['ELLOTTE_IOS_APP_SCHEMA'] = "ellotte001";
LOTTE_CONSTANTS['ELLOTTE_ANDROID_APP_SCHEMA'] = "ellotte002";
//rudolph:150911 - end
LOTTE_CONSTANTS['SPLIT_GUBUN_1'] = ":^:";
LOTTE_CONSTANTS['SPLIT_GUBUN_3'] = ";;;;;";
LOTTE_CONSTANTS['ST_STD_CD_PAY_MEAN_CD_L_POINT'] = "21";     //L-포인트
LOTTE_CONSTANTS['ST_STD_CD_PAY_MEAN_CD_LOTTE_POINT'] = "19";     //롯데포인트
LOTTE_CONSTANTS['ST_STD_CD_PAY_MEAN_CD_DEPOSIT'] = "20";     //회원보관금
LOTTE_CONSTANTS['DEFAULT_LATE_VIEW_GOODS_COUNT'] = "20";     //최근본 상품 수

//shpark97:150925 - start
LOTTE_CONSTANTS['PAYTYPE_CARD_047'] = "047"; // 결제카드_롯데
LOTTE_CONSTANTS['PAYTYPE_CARD_029'] = "029"; // 결제카드_신한
LOTTE_CONSTANTS['PAYTYPE_CARD_031'] = "031"; // 결제카드_삼성
LOTTE_CONSTANTS['PAYTYPE_CARD_048'] = "048"; // 결제카드_현대
LOTTE_CONSTANTS['EXP_MY_LOTTE_KO'] = "마이롯데"; // MyPage Name
//shpark97:150925 - end

(function(window, angular, undefined) {
	'use strict';

	var urlSvc = angular.module('lotteUrl', []);
	urlSvc.service('LotteCommon', ['$location', 'LotteCookie', function ($location, LotteCookie) {
		this.isTestFlag = true; // LocalTestFlag // 운영에 true로 올라가면 절대 안됨

		LotteCookie.setCookie("MBRNO", "123456"); //로그인 상태 로컬테스트용(yubu)

		// 파라메타로 테스트를 하기 위한 Func 추가
		function getUrlParams() {
			var params = {};

			if (location.search) {
				var parts = location.search.substring(1).split('&');

				for (var i = 0; i < parts.length; i++) {
					var nv = parts[i].split('=');
					if (!nv[0]) continue;
					params[nv[0]] = nv[1] || null;
				}
			}

			return params;
		};

		//this.secureUrl = $location.host() == "mob2.lotte.com" ? "http://" + $location.host() : "";
		this.baseUrl = "http://" + location.host;//"http://localhost:3007";

		this.testlocal = "http://molocal.lotte.com";
//        this.testlocal = LOTTE_CONSTANTS['MAPI_HOST_API'];
//        this.testlocal = "http://mrenewdev.lotte.com";

		this.foUrl = $location.host();
		this.mapiUrl = LOTTE_CONSTANTS['MAPI_HOST_API'];
		this.mapiSSLUrl = "";

		this.storageShareUrl = "/webapp/common3/secureShareStorage.jsp"; // http/https 간 Storage 공유
		this.secureStorageShareUrl = "/webapp/common3/secureShareStorage.jsp"; // http/https 간 Storage 공유

		this.mainUrl = "/main/main_2018_dev.html";
		this.mainContentData = "/json/main_new/main_contents.json";
    this.mainOldContentData = "/json/main/main_contents.json";
		this.mainTempateRankData = "/json/main/ranking_list.json";
		this.mainBranchListData = "/json/main/mainDeptStoreList.json";
		this.mainBranchSelectData = "/json/main/mainDeptBranchUpdate.json";
		this.mainLatestProdData = "/json/main/main_latest_prod.json";
		this.mainRealRecommData = "/json/main/main_real_recommend.json";
		this.mainSmartAlramData = "/json/main/main_smart_alram_info.json";

		this.brandSearchUrl = "/brand/brandsearch_dev.html";
		this.myBrandInfo = "/json/main_new/my_brnd_info.json";
		this.orderState = "/json/main_new/new_ord_stat_info.json";

		/* login */
		this.loginData = "/json/login_check.json";
		this.logoutUrl = this.baseUrl + "/login/logout.do";
		this.changeMyInfoUrl = "https://member.lpoint.com/door/user/mobile/change_user_info.jsp"; //회원정보수정 URL
		this.memberOutUrl = "https://member.lpoint.com/door/user/mobile/withdrawl.jsp"; //회원탈퇴 URL
    this.getJoinBtnViewAjaxUrl = this.mapiUrl + "/json/login/getJoinBtnViewAjax.json";   //회원가입 앱 테스트 기간 URL
    //  this.getJoinBtnViewAjaxUrl = "/json/login/getJoinBtnViewAjax.json";   //회원가입 앱 테스트 기간 URL
		/***** login2 rudolph start *****/
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
		this.loginInitUrl = "/json/loginInit.json"; // 로그인 폼 초기화
		this.loginProcUrl = "/json/login.json"; // 로그인 처리
		this.fingerLoginChkUrl = "/json/fingerLoginCheck.json"; // 지문 로그인 처리
		this.updateStaffInfoAjaxUrl = this.mapiUrl + "/json/updateStaffInfoAjax.json"; // 임직원 등록
		this.fingerLoginProcUrl = "/json/fingerLogin.json"; // 지문 로그인 처리
		this.simpleSignMemberPWChangeUrl = this.mapiUrl + '/json/simpleSignMemberPWChange.json'; // 패스워드변경 폼 초기화
		this.simpleSignMemberPWChangeGoUrl = this.mapiUrl + "/json/login/simpleSignMemberPWChangeGo.json"; // 패스워드변경 처리
		this.simpleSignMemberIdFindAfterUrl = this.mapiUrl + '/json/simpleSignMemberIdFindAfter.json'; // 아이디찾기 결과
		this.simpleSignMemberIdFindUrl = this.mapiUrl + '/json/simpleSignMemberIdFind.json'; // 패스워드찾기 폼 초기화
		this.simpleSignMemberPWFindAfterInitUrl = this.mapiUrl + '/json/simpleSignMemberPWFindAfterInit.json'; // 패스워드 찾기 폼 초기화
		this.simpleSignMemberPWFindAfterUrl = this.mapiUrl + '/json/simpleSignMemberPWFindAfter.json'; // 패스워드 찾기 결과
		this.simpleSignMemberCertificationUrl = this.mapiUrl + "/json/simpleSignMemberCertification.json"; // 인증번호발송
		this.simpleSignMemberReSendEmailUrl = this.mapiUrl + "/json/simpleSignMemberReSendEmail.json";
		this.dormancyRestoreAjaxUrl = "/json/login/dormancyRestoreAjax.json"; // 휴면회원 복원 AJAX
		this.dormancyRestoreFail = this.baseUrl + "/login/dormancyInfoFail.do"; // 휴면회원 복원 AJAX

		// url
		this.loginForm = this.baseUrl + '/login/m/loginForm_dev.html'; // 로그인폼
		this.sci_url = this.baseUrl + "/sci/pcc_V3_seed.jsp"; // 본인인증
		this.loginBlock = this.baseUrl + "/login/simpleSignMemberLoginBlock.do"; // 간편회원 10회이상 인증 실패
		this.gradeUp = "/json/event/getEntryEventCnt.json"; // 등급업확인
		this.registAttendData = '/json/event/regist_attend.json'; // 출석도장 이벤트
		this.simpleSignMemberIdFind = this.baseUrl + "/login/simpleSignMemberIdFind.do"; // 간편회원 아이디 찾기
		this.simpleSignMemberPWFind = this.baseUrl + "/login/simpleSignMemberPWFind.do"; // 간편회원 패스워드 찾기
		this.simpleSignMemberIdFindAfter = this.baseUrl + "/login/simpleSignMemberIdFindAfter.do"; // 아이디찾기 결과
		this.simpleSignMemberPWFindAfter = this.baseUrl + "/login/simpleSignMemberPWFindAfter.do"; // 간편회원 패스워드 찾기 결과
		this.simpleSignMemberReSendEmail = this.baseUrl + "/login/simpleSignMemberReSendEmail.do"; // 인증메일 재발송
		/***** login2 rudolph end *****/

		this.mylotteLayerData = "/json/main/main_action_bar_my.json";
		this.mylotteLayerData2 = "/json/main/main_action_bar_my.json";
		/*this.commBnrData = "/lotte/resources_dev/data/foot_banner_data.html";*/ /*"http://fo.lotte.com/json/getMobileBannerInfoJson.lotte?bnrSctCd=MC";*/
		this.sendEventSms = "/lotte/resources_dev/data/send_event_sms.html";
		this.planData = "/lotte/resources_dev/data/product/product_list_data_onehour.html";
		this.todayOtherAlarmData = "/lotte/resources_dev/data/today_other_alarm_data.html"; /*오늘의 다른 알림 데이터*/

		// HEADER (SEARCH LAYER)
//        this.srhAutoData = "/lotte/resources_dev/data/search/srh_auto_data.html"; // 검색 레이어 자동완성 키워드 데이터
//        this.srhBestData = "/lotte/resources_dev/data/search/srh_best_data.html"; // 검색 레이어 인기 급상승 키워드 데이터
		//this.srhAutoData = this.testlocal + "/search/m/search_keyword_app.do"; // 자동완성 키워드 데이터
		this.srhAutoData = "/json/search/m/search_keyword_app.json"; // 자동완성 키워드 데이터
		this.srhBestData = "/json/searchKeywordLayer.json"; // 검색 레이어 인기 급상승 키워드 데이터
		this.customSearchUrl = "/search/custom_search_page_dev.html";   /*맞춤검색*/


		/*side_categoty*/
		this.sideCtgData = "/lotte/resources_dev/data/side_ctg_data.html"; /*좌측 카테고리 리스트(하드코딩 데이터로 운영)*/
		this.sideCtgBrandData = "/json/cate_brand_list.json"; /*좌측 브랜드 카테고리 리스트*/
		this.sideCtgBrandSearch = "/json/cate_brand_keyword.json"; /*좌측 브랜드 카테고리 검색 리스트*/
		this.sideCtgSpecialData = "/lotte/resources_dev/data/side_ctg_special_data.html"; /*좌측 기획전 카테고리 리스트*/
		this.sideCtgSpecialSearch = "/lotte/resources_dev/data/side_ctg_special_search.html"; /*좌측 기획전 카테고리 검색 리스트*/
		this.sideCtgSpecial = "/jsondata/side_ctg_special.do"; /*카테고리 리스트*/

		/*우측 마이롯데 데이터*/
		this.sideMylotteData = "/lotte/resources_dev/data/side_mylotte_data.html"; /*우측 마이롯데 데이터*/

		/*쿠폰위시리스트*/
		this.couponLayerData = "/lotte/resources_dev/data/coupon_layer_data.html"; /*쿠폰 레이어 데이터*/
		this.downDoubleCoupon = "/lotte/resources_dev/data/regCoupon.html"; /*중복쿠폰 다운로드*/
		this.prdAddWish = "/json/mylotte/wish/m/wish_add.html"; /*상품 위시리스트 추가*/

		/* *** Bang Kijeong Star ***** */
		/* main */
		//this.mainTabsData ="/json/main/root_menu.json";
		this.mainNoticeData = "/json/notice_list.json";
		this.mainPopupData ="/json/system/current_page_popup.json"; // 팝업
		//this.mainPopupData ="/json/system/current_page_popup_01.json"; // 채널정보 없을때
		//this.mainPopupData ="/json/system/current_page_popup_02.json"; // 채널정보 있을때
		/*this.mainPopupData = "/json/system/current_page_popup.json";*/
		/*this.smallCategoryData ="/lotte/resources_dev/data/product/menu_samll_category_data.html";*/
		//this.smallCategoryData ="/lotte/resources_dev/data/category/cate_mid_list.html";
		this.smallCategoryData = "/json/category/cate_mid_list.json";
		this.cateMidAngul = "/category/m/cate_mid_list_anglr_dev.html";
		this.recommendLatelyPrdData = "/json/main/main_recommend_latelyPrd.json"; // 메인 - 맞춤추천 최근본 상품 데이터
		this.cateMidBeauty = "/category/m/cate_beauty_list_dev.html"; //명품화장품 카테고리
		this.cateMidBeautyData = "/json/category/cate_beauty_list.json";

		/* 명절매장중카 */
		this.smallHolidayCategoryData = "/json/category/cate_holiday_list.json";
		this.cateHolidayMidAngul = "/category/m/cate_holiday_mid_list_anglr_dev.html";

		this.beautyEvtTester = "/category/m/beauty_evt_tester_dev.html"; //명품화장품 테스터 이벤트
		this.beautyEvtTesterData = "/json/event/beauty_evt_tester.json";
		this.beautyEvtTesterSave = "/json/event/regEvent.json";
		this.beautyEvtReview = "/category/m/beauty_evt_review_dev.html"; //명품화장품 상품평 이벤트
		this.beautyEvtReviewData = "/json/event/beauty_evt_review.json";

		/* TV 홈 */
		this.tvHomeOnAirData = "/json/main/tv_home_onair_prod_list.json";
		this.tvHomeCalendarData = "/json/main/tv_home_calendar.json";
		this.tvHomeBannerData = "/json/main/tv_home_banner_list.json";

		/*카테고리*/
		this.cateProdListUrl = "/category/m/new_prod_list_dev.html";
		this.cateProdListData = "/json/category/new_product_list.json";
		//this.listGoodsImgData =  "/json/product/get_goods_img_list.json"; //상품리스트 확대보기 스와이프 이미지 정보

		/* 명절매장카테고리 */
		this.cateHolidayProdListUrl = "/category/m/new_holiday_prod_list_dev.html";
		this.cateHolidayProdListData = "/json/category/new_holiday_product_list.json";

		this.listGoodsImgData = (function () {
			return "/json/product/get_goods_img_list_6919160.json";
		}());

		this.mainNewAlarmData = "/json/main/alarm_info.json";
		/* *** Bang Kijeong  End ***** */
		/* event */
		this.directAttendUrl = "/event/m/directAttend_dev.html";  /*출석도장*/
		this.directAttendData = "/json/event/direct_attend.json"; /*new 출석도짱*/
		this.recieptDataUrl = "/lotte/resources_dev/data/event/recieptData.html"; /* 영수증 이벤트 DATA */
		this.recieptVoteUrl = this.testlocal + "/json/event/regist_receipt.json"; /* 영수증 이벤트 응모하기 URL */
		this.receiptIframeUrl = "http://www.lotte.com/dacom/xansim/iframe.jsp"; /* 영수증 이벤트 iframe Url */
		this.eventSaunListUrl = "/event/m/eventSaunList_dev.html"; /* 이벤트 사은 메인 URL */
		this.eventSaunMain = "/event/m/eventSaunMain_dev.html"; /* 이벤트 사은 sub url */
		this.eventSaunListData = "/lotte/resources_dev/data/event/eventSaunListData.html"; /* 이벤트 사은 메인 List data */
		this.eventMySaunListData = "/lotte/resources_dev/data/event/eventMySaunListData.html"; /* 이벤트 사은 메인 List data */
		this.eventSaunMainData = "/lotte/resources_dev/data/event/eventSaunMainData.html"; /* 이벤트 사은 sub sata */
		this.eventSaunDetailData = "/lotte/resources_dev/data/event/eventSaunDetailData.html"; /* 이벤트 사은 개인내역 data */
		this.eventRegistUrl = "/json/event/regist_saun.json"; /* 이벤트 등록 */
		this.eventGumeUrl = "/mylotte/pointcoupon/m/event_info_dev.html";   /*이벤트.응모/당첨*/
		this.eventGumeData = "/json/mylotte/event_info.json";   /*이벤트.응모/당첨 데이터 */
		this.eventDetailUrl = "/mylotte/pointcoupon/m/event_detail_dev.html";   /*이벤트.응모/당첨 내역 확인 */
		this.eventDetailData = "/json/mylotte/event_info_detail.json";  /*이벤트.응모/당첨 내역 확인 데이터 */

		/* 전문관 */
		// this.specialMall = this.testlocal + "/json/mall/special_booth.json";
		this.specialMall = (function() {
			return "/json/mall/special_booth_" + getUrlParams().dispNo + ".json";
		}());
		// this.specialMallMain = this.testlocal + "/json/mall/special_mall.json";
		this.specialMallMain= (function () { // 상품상세 코드별 로컬 데이터를 보기 위해 처리
			return "/json/mall/special_mall_" + getUrlParams().dispNo + ".json";
		}());
		this.specialMallSubUrl = this.baseUrl + "/category/m/prod_list_dev.html";

		/* planshop */
		this.smartAlarmUrl = "/planshop/m/smartAlarmList_dev.html";    /*스마트 알림*/
		this.smartAlarmListData = "/json/planshop/smart_alarm_list.json";
		this.startledAlarmListData = "/json/planshop/startled_alarm_list.json";
		this.startledAlarmReadData = "/json/cn/planshop/startled_alarm_read.json";
		this.emailBargainListData = "/json/planshop/email_bargain_list.json";
		this.halfChanceData = "/lotte/resources_dev/data/planshop/half_chance_data.html"; /*하프찬스 데이터*/
		//this.planshopData = "/json/mall/planshop_detail.json";  /* 기획전 데이터 */
		this.planshopData = (function () { // 기획전/이벤트 코드별 로컬 데이터를 보기 위해 처리
			var dispno;
			if (getUrlParams().curDispNo!=undefined) dispno = getUrlParams().curDispNo;
			if (getUrlParams().spdp_no!=undefined) dispno = getUrlParams().spdp_no;
			if (!dispno) { // 지정 번호 없을때 Default 하나 지정
				if ($location.url().indexOf("/planshop/m/planshop_view_dev.html") > -1) { // 이벤트
					dispno = "5393653";
				} else { // 기획전
					dispno = "5398875";
				}
			}
			return "/json/mall/planshop_detail_" + dispno + ".json";
		}());
		this.planshopCommentData = "/json/mall/commentList.json";	/* 기획전 댓글데이터 */
		this.planshopCommentDeleteData = "/json/mall/commentDelete.json"; /* 기획전 댓글데이터 삭제 */
		this.planshopCommentRegData = "/json/mall/commentInsert.json"; /* 기획전 댓글데이터 등록 */
		/* mall */
		this.specMallCtgData= (function () { // 전문몰 카테고리 코드별 로컬 데이터를 보기 위해 처리
			return "/json/mall/getKshopCtgListNewJson_" + getUrlParams().dispNo + ".json";
		}());
		this.specMallMainData= (function () { // 전문몰 메인 코드별 로컬 데이터를 보기 위해 처리
			return "/json/mall/getKshopMainJson_" + getUrlParams().dispNo + ".json";
		}());
		this.specMallSubData= "/json/mall/getKshopGoodsListJson.json";

		this.kshopCtgData = "/json/getKshopCtgListNewJson.json"; //yubu 추후 삭제
		this.kshopMainData = "/json/getKshopMainJson.json";//yubu 추후 삭제
		this.kshopSubData = "/lotte/resources_dev/data/mall/kshop_sub_data.html";//yubu 추후 삭제

		this.specMall2017Cate	= "/json/mall/getKshopCtgListNew.json";//"/json/mall/getKshopCtgListNew.json"
		this.specMall2017Main	= "/json/mall/getKshopMain.json";//"/json/mall/getKshopMain.json"
		this.specMall2017Sub	= "/json/mall/getKshopGoodsList.json";

		this.specialMallUrl = "/mall/spec_mall_dev.html"; // 전문관 URL
		this.specialSubUrl = "/mall/spec_mall_sub_dev.html"; // 전문관 URL

		this.tenbytenUrl = "/mall/tenbyten/m/mall_main_dev.html"; /* 텐바이텐 URL */
		this.tenbytenData = "/lotte/resources_dev/data/mall/tenbyten_data.html"; /* 텐바이텐 데이터 */
		this.d1200mData = "/lotte/resources_dev/data/mall/1200m_data.html"; /* 1200m 데이터 */
		this.d1300kData = "/lotte/resources_dev/data/mall/1300k_data.html"; /* 1300k 데이터 */
		this.bookshopUrl = "/mall/book/book_dev.html"; /* 도서몰 URL */
		this.bookshopData = "/lotte/resources_dev/data/mall/book_shop_data.html"; /* 도서몰 데이터 */
		this.vineData = "/lotte/resources_dev/data/mall/vine_data.html"; /* 바인 데이터 */

		this.tenbytenData = "/mall/tenbyten/m/tenbyten_dev.html"; /* 텐바이텐 URL */
		this.d1200mData = "/mall/1200m/m/1200m_main_dev.html"; /* 1200m URL */
		this.d1300kData = "/mall/1300k/m/1300k_main_dev.html"; /* 1300k URL */
		this.bookshopData = "/mall/book_shop/m/book_shop_main_dev.html"; /* 도서몰 URL */
		this.specialFlavorUrl = "/mall/special_flavor/special_flavor_dev.html"; /* 특별한맛남 URL */
		this.gucciUrl = "/mall/gucci/m/gucci_main_dev.html"; /* 구찌 URL */
		this.gucciQuestionUrl = "/product/product_quest_write_gucci_dev.html" /* 구찌 문의하기 URL */
		this.gucciQuestionSaveUrl = "/json/comment/product_quest_save.json" /* 구찌 문의하기 save */
		this.gucciSubData = "/json/mall/special_booth_sub.json"; /* 구찌 서브 데이터 yubu 추후 삭제 */
		this.vineData = "/mall/webzine/m/lzine_list_dev.html"; /* 바인 URL */
		this.vineDetailData = "/json/webzine/lzine_detail.json";
		this.instagramGoodsData ="/json/mall/instagramGoodsArr.json"; /* 디어펫그램 데이터 */

		this.specialBoothSubData = (function () { // 구찌, 바인 카테고리
			return "/json/mall/special_booth_sub_" + ((getUrlParams().isWine=="Y")?"vine" : "gucci") + ".json";
		}());

		this.mallWineUrl = "/webzine/m/lzine_detail_dev.html"; /*와인 서브*/
		this.mallSubUrl = "/mall/m/mall_sub_dev.html"; /*몰서브*/
		this.mallSubData = "/json/mall/mall_sub.json";
		this.mallCateAttrData = "/json/cate_attr.json";

		// search
		this.searchUrl = "/search/search_list_2018_dev.html"; // 검색 페이지
		// this.srhListData = "/lotte/resources_dev/data/search/search_result_data.html"; // 검색결과 데이터
		// this.srhListTermData = "/lotte/resources_dev/data/search/search_result_data.html"; // 검색결과 조건 활성화 여부 데이터
		this.srhListData = "/json/search/m/getSearchListJson.json"; // 검색결과 데이터
		this.srhListTermData = "/json/search/m/getSearchGBJson.json";	/*검색결과 조건 활성화 여부 데이터*/

		this.srhListData2016 = "/json/search/m/getSearch2018List.json";//"/json/search/m/getSearch2016List.json";// 검색결과 데이터
		this.srhListData2016LC = "/json/search/m/getSearchListLC.jsp";
		this.srhListTermData2016 = "/json/search/m/getSearch2018Term.json";//"/json/search/m/getSearch2016Term.json";//검색결과 조건 활성화 여부 데이터
		this.srhListTermData2018 = "/json/search/m/getSearch2018Term.json";//"/json/search/m/getSearch2016Term.json";//검색결과 조건 활성화 여부 데이터
		this.srhListCustomSetting2016 = "/publish/getSearch2016Custom.json";//맞춤설정
		this.srhListCustomBrand2016 = "/json/search/m/getSearch2016Brand.json";//맞춤설정 브랜드 검색 "/json/cate_brand_keyword.json";// 좌측 브랜드 카테고리 검색 리스트"
		this.srhListAdvtBrnList = "/json/search/getSearchAdvtBnrList.json";//검색광고배너 기획전배너
		this.srhListReivewPop = "/json/search/getSearchGdasDetailLayer.jsp";//리뷰형 팝업

		this.cateListData2016 = "/json/category/new_cate_search_list.json";//"/json/search/m/getSearch2016List.json";// 카테고리 검색결과 데이터
		this.cateTermData2016 = "/json/category/new_cate_search_term.json";//"/json/search/m/getSearch2016Term.json";// 카테고리 검색결과 조건 활성화 여부 데이터
		this.cateListData2018 = "/json/category/new_cate_search_list.json";// 카테고리 검색결과 데이터
		this.cateTermData2018 = "http://mo2.lotte.com/json/category/renew_cate_search_term.json";// 카테고리 검색결과 조건 활성화 여부 데이터
		this.searchPanShopList = "/search/planshoplist/search_planshop_list_dev.html"; // 검색,탐색 기획전형 모두보기 ( 20180308 박해원 )

		// 스타일 추천 (Style Push)
		this.stylePushIntroUrl = "/search/style_push_intro_dev.html"; // 스타일 추천 인트로
		this.stylePushUrl = "/search/style_push_dev.html"; // 스타일 추천 검색 리스트
		this.stylePushCtgData = "/app/oddconcept_cateList.json"; // 스타일 추천 카테고리 정보 Data URL
		this.oddConceptAPI = "https://dl-api.oddconcepts.kr/v0/"; // 오드컨샙 API URL (스타일 추천)
		this.styleOddAPIData = "/json/search/m/stylePushOddList.json"; // 스타일추천 데이터
		this.stylePushPrdData = "/json/search/m/styleRecommProdList.json"; // 스타일추천 상품 디테일 데이터
		this.styleRecomUrl = "/search/style_recom_dev.html";
		this.styleCateListUrl = this.baseUrl + "/json/search/m/styleRecommCateGrpList.json"; // 스타일추천 카테고리 리스트
		this.styleRecomDetect	= "/json/oddconcept/detect.jsp";
		this.styleRecomSearch	= "/json/oddconcept/search.jsp";

		// category
		this.brandShopUrl = "/category/m/cate_brand_main_dev.html"; /*브랜드샵*/
		this.brandShopData = "/json/brand_main.json";   /*브랜드샵 데이터*/
		this.brandShopSubUrl = "/category/m/brand_prod_list_dev.html";  /*브랜드샵 서브 */
		this.brandShopSubData = "/json/brand_sub.json"; /*브랜드샵 서브 데이터*/
		this.brandShopSubSearchData = "/json/cate_brand_attr.json"; /*브랜드샵 서브 검색필드 데이터*/
		
		this.categoryUrl = this.baseUrl + "/category/m/new_prod_list_dev.html"; //카테고리

		/* product */
		this.prdlstUrl = "/product/m/product_list_dev.html"; /*기획전*/
		this.prdviewUrl = "/product/m/product_view_2017_dev.html"; /*상품상세 */
		this.prdviewRecobellShareData = "/json/product/regBestProd.json"; // 상품상세 Recobell Share 데이터 수집 URL
		this.productviewUrl = "/product/m/product_view_dev.html"; /*상품상세*/

		/**
		[모바일 판매 불가 상품]
		19338070    연동형 CGV E-쿠폰
		23261585    사은품, 경품
		69584848    핸드폰 10원 상품

		[구찌상품]
		100581285   판매중
		100581286   품절 상품
		100581287   판매종료 상품
		6850366     예약상품1
		4606929     예약상품2
		5703503     예약상품3

		[일반상품] :: 아시아나클럽 마일리지 적립 제휴 (cn=156230&cdn=2969556), OK 캐시백 (cn=137725)
		100581195   스마트픽 전용
		100581187   스마트픽 + 택배
		86167728    망고
		41276325    도서1
		41422052    도서2
		47400512    렌탈
		97642747    E쿠폰
		100581197   의료기기
		100581200   건강식품 (닷컴전용)
		6691261     옵션상품 (날짜선택 & 인품박스)
		100581198   최대구매제한 5개
		100581199   최소구매3개, 최대구매 10개
		100581204   상품설명 이미지 제작형, 조건부 무료 배송
		100581210   상품설명 전체 html로된 형태
		100581209   즉석쿠폰_정액할인 (100원) (9/30까지)
		100581206   즉석쿠폰_정액적립 (100원) (9/30까지)
		100581208   즉석쿠폰_정률할인 (2%) (9/30까지)
		100581207   즉석쿠폰_정률적립 (2%)
		100581205   스마트픽할인 (100원)
		100581214   선물서비스 (선물포장 + 선물메시지) 단품상품
		100581220   설치상품
		100581219   주문제작상품
		100581231   기획전형상품
		99536682    와인
		93320930    닷컴 예약상품
		6850366     백화점이 아닌 상품
		6847597     백화점이 아닌 상품 - 가격인하상품
		37221543	옵션없음
		**/
		this.productProductViewData = (function () { // 상품상세 코드별 로컬 데이터를 보기 위해 처리
			var goodsNo = getUrlParams().goods_no;

			if (!goodsNo) {
				goodsNo = "4606929";
			}
			return "/json/product/product_view_" + goodsNo + ".json";
		}());

		// S 2017 상품상세 리뉴얼 신규

		this.productProductView2017Data = (function () { // 상품상세 코드별 로컬 데이터를 보기 위해 처리
			var goodsNo = getUrlParams().goods_no;

			if (!goodsNo) {
				goodsNo = "100581187";
			}
			return "/json/product/product_view_" + goodsNo + ".json";
		}());
		this.productDetailData = (function () { /*[상품상세] 상품상세 Html정보*/
			var goodsNo = getUrlParams().goods_no;

			if (!goodsNo) {
				goodsNo = "100581187";
			}
			return "/json/product/product_detail_" + goodsNo + ".json";
		}());

		this.productCommentData  = (function (goodsNo) { // [상품상세]상품평 정보 코드별 로컬 데이터를 보기 위해 처리
			var goodsNo = getUrlParams().goods_no;

			if (!goodsNo) {
				goodsNo = "100581187";
			}
			return "/json/product/comment_info_" + goodsNo + ".json";
		}());	
		
		this.productCommentDataNew  = (function (goodsNo) { // [상품상세]상품평 정보 코드별 로컬 데이터를 보기 위해 처리
			var goodsNo = getUrlParams().goods_no;

			if (!goodsNo) {
				goodsNo = "100581187";
			}
			return "/json/product_new/comment_info_" + goodsNo + ".json";
		}());	
		
		this.planPrdDetailData = "/json/product_new/plan_prd_detail_html_" + getUrlParams().goods_no + "_" + getUrlParams().type + ".json";		/*[상품상세] 기획전 상품상세 Html정보*/
		this.productOptionData = (function (goodsNo) { // 상품상세 코드별 로컬 데이터를 보기 위해 처리
			return "/json/product/prd_opt_info_" + goodsNo + ".json";
		});
	
		this.productSaleBestData = "/json/product/sale_best.json";										/*[상품상세] 다른 고객이 많이 구매한 상품 url*/
		this.productQnAData = "/json/product/quest_info_"+ getUrlParams().goods_no + "_" + getUrlParams().usm_goods_no +".json";			/*[상품상세] QnA*/
		this.productSaleBestData = "/json/product/sale_best.json";										/*[상품상세] 다른 고객이 많이 구매한 상품 url*/
		this.productQnAData = "/json/product/quest_info_"+ getUrlParams().goods_no +".json";			/*[상품상세] QnA*/
		this.productBrandBestData = "/json/product/brand_best.json";				/*[상품상세]브랜드 BEST 상품정보*/
		this.otherBuyInfoUrl = "/json/product_new/other_buy_info.json"; // [상품상세] 다른 고객들이 함께 본 상품 (recommPrdInfoUrl 레코벨 함께본 상품)
		this.productBestViewData = "/json/product/best_view.json";		/*[상품상세] 다른 고객들이 함께 본 상품 (recommPrdInfoUrl 레코벨 함께본 상품)*/
		this.recommSpdpInfoUrl = "/json/main_new/spdp_recomm_list.json"; // [상품상세] 추천 기획전 (recommSpdpInfoUrl 레코벨 추천 기획전)
		this.productSimilarStyleData = "/json/product/styleRecommProdList.json";		/*[상품상세] 다른 고객들이 함께 본 상품 (recommPrdInfoUrl 레코벨 함께본 상품)*/
		this.productMDRecomData = "/json/product/mdrecomm_prd_info_"+ getUrlParams().goods_no +".json";		/*[상품상세] MD가 추천하는 상품*/
		this.productTogePlanData = "/json/product/spdp_recomm_list.json";		/*[상품상세] 함께 볼만한 기획전 (recommSpdpInfoUrl 레코벨 추천 기획전)*/
		this.productTogePlanData = "/json/product/spdp_recomm_list.json";		/*[상품상세] 함께 볼만한 기획전 (recommSpdpInfoUrl 레코벨 추천 기획전)*/
		this.planProdctDetailData = "/json/product/plan_product_detail.json";		/*[상품상세] 기획전형 상품 상세*/
		this.productBottomBannerData = "/json/product/product_bottom_banner_"+ getUrlParams().goods_no +".json";			/*[상품상세] QnA*/
		this.chanelRelInfoUrlData = "/json/product/chanel_rel_info.json";		/*[상품상세] 샤넬 관련상품보기 & 베스트 셀러 */

		this.productSubReqInfoData = "/json/product/basic_item_info_"+ getUrlParams().goods_no +".json";	/*[상품상세 서브페이지] 필수표기정보*/
		this.productMdNoticeData = "/json/product/md_ntc_info_"+ getUrlParams().goods_no +".json";	/*[상품상세][앱 웹뷰 공지사항페이지]*/

		this.productPlanDetailData = "/json/product_new/plan_prd_detail_html.json?goods_no=" + getUrlParams().goods_no + "&type=" + getUrlParams().type;		/*[상품상세] 기획전 상품상세 Html정보*/
		this.productPlanDetailData = (function (goodsNo, type) { // 상품상세 코드별 로컬 데이터를 보기 위해 처리
			return "/json/product/prd_opt_info_" + goodsNo + "_" + type + ".json";
		});

		this.productSubComment = "/product/m/sub/product_comment.do";	/*[상품상세 서브페이지] 상품평 보기 페이지*/
		this.productSubCommentAllData = "/json/product/comment_info_"+ getUrlParams().goods_no +".json";	/*[상품상세 서브페이지] 전체 상품평 보기*/
		this.prodSubCommentDetailData = "/json/product/comment_detail_"+ getUrlParams().goods_no +".json";	/*[상품상세 서브페이지] 사진/영상 상품평 크게보기 */
		this.prodSubCommentImageData = "/json/product/comment_detail_"+ getUrlParams().goods_no +".json";	/*[상품상세 서브페이지] 사진/영상 상품평 모아보기*/
		this.productExtInfoData = "/json/product_new/exchange_info_"+ getUrlParams().goods_no +".json"; /* 배송/교환/반품/결제정보 */
		this.productBenefitCompareData = "/json/product_new/compare_prd_info.json"; /* 동일상품 혜택 비교하기 */
		this.productCollectBenefits = "/json/product_new/benefit_info.json"; /* 해택 모아보기 */
		this.productCollectBenefitsUrl = "/product/m/sub/product_collect_benefits.do"; /* 혜택 모아보기 페이지 URL */
		this.productCategoryInfoData = "/json/product/cate_no_list_"+ getUrlParams().goods_no +".json?goods_no=";			/*상품상세 카테고리 정보*/

		// E 2017 상품상세 리뉴얼 신규

		this.productLimitInfoData = "/json/jsondata/product_marketing.json"; // 상품상세 앱 전용/제휴채널 전면팝업 체크

		// this.productProductViewData = "/lotte/resources_dev/data/product/product_view_wine.html";         /* 와인 스마트픽 상품상세 기본정보*/
		// this.productProductViewData = "/lotte/resources_dev/data/product/product_view_wine.html";            /* 와인 스마트픽 상품상세 기본정보*/
		// this.productProductViewData = this.mapiUrl + "/lotte/resources_dev/data/product/product_view_data.html";         /*상품상세 기본정보*/
		this.productProductDetailHtmlData = "/json/product/product_view_data.json";         /*상품상세 기본정보*/
		this.productProductDetailData = this.mapiUrl + "/json/product/product_detail.json";         /*[상품상세]상품상세 Html정보*/
		this.productProductDetailData = "/json/product/getSelectProductDetails.json";           /*[상품상세]기획전형 상품상세 Html정보*/
		this.wishWishInsData = "/lotte/resources_dev/data/product/proc_data.html";          /*[상품상세]위시리스트 담기*/
		this.cartCartInsData = "/lotte/resources_dev/data/product/proc_data.html";          /*[상품상세]장바구니 담기*/

		this.cartRegCouponData = "/json/event/reg_coupon.json"; /*[장바구니,위시리스트]중복쿠폰등록*/
		this.cartLastOptionData = "/json/product/m/new_product_option_change.json"; /*[장바구니]마지막옵션정보조회*/
		this.wishAddData = "/json/mylotte/wish/m/wish_add.json"; /*[장바구니]위시리스트담기*/
		this.systemRestockAlramData = "/json/system/restock_alram.json"; /*[장바구니]재입고알림*/
		this.cartDeleteData = "/json/mylotte/cart/m/cart_delete.json"; /*[장바구니]상품삭제*/

		this.custcenterFaqListData = "/json/custcenter/faq_list.json";          /*[구찌상품상세]faq List*/
		this.productImallStockCheckData = "/json/product/imall_stock_check.json";           /*[상품상세]imal 상품및 사은품 재고 체크*/
		this.productLgStockCheckData = "/json/product/lg_stock_check.json";         /*[상품상세]lg패션 재고체크*/
		this.custcenterQuestWriteGucciData = "/json/custcenter/quest_write_gucci.json";         /*[상품상세]화면이동하여 내용없음.*/
		this.commentProductQuestListMobileData = "/json/comment/product_quest_list_mobile.json";    /*[상품상세]화면이동하여 내용없음*/
		this.commentCommentViewMobileData = "/lotte/resources_dev/data/product/comment_view_mobile_data.html";          /*[상품상세]상품평 목록데이터*/
		this.couponRegCouponData = "/lotte/resources_dev/data/product/proc_data.html";          /*[상품상세]coupon download*/
		this.productRegistRentalPoint = "/lotte/resources_dev/data/product/proc_data.html";         /*[상품상세]lpoint 10원 download*/
		this.productCompareModelProduct = "/json/product/compare_model_product.json";           /*[상품상세]같은상품 비교하기데이터*/
		this.productAheadCaculation = "/json/product/ahead_caculation.json";            /*[상품상세]미리계산기 데이터*/
		this.productCateNavi = "/json/product/cate_navi.json";          /*[상품상세]카테고리 네비게이션 데이터*/
		this.productMobileNaverMap = "/json/product/mobile_naver_map.json";            /*[공통]네이버 지도정보*/
		this.productSelectGoodsOptInfoData = "/json/product/select_goods_opt_info.json";            /*[상품상세]선택형 상품 옵션조회*/
		this.smartpickSmartpickBookingData = "/json/product/smartpick_booking.json"; /*[상품상세]스마트픽 지점정보*/

		this.productProductImgData = "/product/m/product_detail_new.html" //이미지 확대보기 화면 이동
		this.productProductSalebestData = "/json/product/product_salebest.json" //이미지 확대보기 화면 이동

		//this.productProductItemInfoData = "/json/product/product_item_info.json";//상세정보
		this.productProductItemInfoData = (function () { // 상품상세 구매정보 코드별 로컬 데이터를 보기 위해 처리
			return "/json/product/product_item_info_" + getUrlParams().goods_no + ".json";
		}());

		this.wishListData = "/json/mylotte/wish/m/wish_list.json"; /*[위시리스트]판매중상품목록조회*/
		this.cartListData = "/json/mylotte/cart/m/cart_list.json"; /*[장바구니]상품목록*/
		this.cartAddFromWishData = "/json/mylotte/cart/m/cart_add_from_wish.json"; /*[위시리스트]카트담기*/

		/* login */
		this.loginUrl = "/login/m/loginForm.do"; //rudolph수정
		this.logoutUrl = "/test/logout.html";
		/* mylotte */
		this.mylotteMainData = "/json/mylotte/main_mylotte.json" /* 마이롯데 메인 데이터 */
		this.cateLstUrl = "/mylotte/cart/m/cart_list_dev.html";   /*장바구니*/
		this.cartLstUrl = "/mylotte/cart/m/cart_list_dev.html";   /*장바구니*/
		this.wishLstUrl = "/mylotte/wish/m/wish_list_dev.html";   /*위시리스트*/
		this.ordLstUrl = "/mylotte/purchase/m/purchase_list_dev.html";    /*주문/배송조회*/
        this.cartOptionData = "/json/mylotte/cart/m/cart_option.json"; /*[장바구니]옵션정보조회*/
		this.cartUpdateOptionData = "/json/mylotte/cart/m/cart_option.json"; /*[장바구니]옵션수정*/
		this.cartUpdateSmartpickOptionData = "/json/mylotte/cart/m/cart_option.json"; /*[장바구니]스마트픽옵션수정*/
		this.purchaseViewUrl = "/mylotte/purchase/m/purchase_view.do";  /*주문/배송조회 상세*/
		this.critViewUrl = "/mylotte/product/m/mylotte_crit_view_dev.html";  /*상품평 관리*/
		this.mylotteUrl = "/mylotte/m/mylotte_dev.html" /* 마이롯데 메인 */
		this.ordCancelUrl = "/mylotte/purchase/m/purchase_list.do"; /*주문취소*/
		this.ordChangeUrl = "/mylotte/purchase/m/purchase_list.do"; /*주문변경*/
		this.prdReturnUrl = "/mylotte/purchase/m/purchase_list.do"; /*교환/반품*/
		this.myCouponUrl = "/mylotte/pointcoupon/m/point_info_dev.html";  /*내쿠폰*/
		this.gdBenefitUrl = "/mylotte/sub/soGoodBenefit_dev.html"; /*참좋은 혜택*/
		this.gdBenefitData = "/json/mylotte/good_benefit.json";     /*참좋은 혜택*/
		this.newCouponzoneUrl = "/mylotte/sub/couponzone_dev.html";		/*쿠폰존*/
		this.newCouponzoneData = "/json/mylotte/newCouponzone.json";		/*쿠폰존*/
		this.friendCouponUrl = ""; /* 절친 쿠폰북 */
		this.smartpayUrl = "/mylotte/smartpay/m/smartpay_dev.html";  /*스마트페이 신청*/
		this.smartpayData = "/json/mylotte/smartpay/smartpay.json"; /*스마트페이 data*/
		this.smartpayRegUrl = "/lotte/resources_dev/data/mylotte/smartpay/smartpayRegData.html";    /*스마트페이 등록*/
		this.receiptListUrl = "/mylotte/cscenter/m/cash_bill_list_dev.html"; /* 영수증 내역 */
	   // this.receiptListData = this.testlocal + "/json/mylotte/receipt_issue_info.json"; /* 영수증 데이터 */
		this.receiptListData = "/json/mylotte/receipt_issue_info.json"; /* 영수증 데이터 */
		this.smartPickListUrl = "/smartpick/smp_cpn_rfd_list_dev.html"; /* 스마트픽 교환권 List URL */
		this.smartPickDetailUrl = "/smartpick/smp_cpn_info_dev.html"; /* 스마트픽 교환권 상세보기 URL */
		this.smartPickSendUrl = "/json/smartpick/smartpick_gift_send.json"; /* 스마트픽 교환권 보내기 URL */
		this.smartPickMmsUrl = "/json/smartpick/reservation_send_mms.json"; /* 스마트픽 교환권 MMS 전송 URL */
		this.smartPickCancelUrl = "/json/smartpick/reservation_cancel.json "; /* 스마트픽 교환권 취소 URL */
		this.smartPickUpdateUrl = "/json/smartpick/reservation_update.json"; /* 스마트픽 교환권 수정 URL */
		this.smartPicKListData =  "/json/smartpick/smartpick_list.json"; /* 스마트픽 교환권 데이터 */
		this.smartPicKGiftData =  "/json/smartpick/smartpick_gift.json"; /* 스마트픽 교환권 gift 데이터 */
		this.lPayEasyUrl = "/mylotte/sub/lpay_mng_dev.html"; /* lpay 간편결제 */
		this.orderAlarmYnUrl = "/mylotte/sub/ord_msg_setting_dev.html"; /* 주문정보 수신설정 */
		this.ordMsgUserSettingData = "/json/mylotte/ordMsgGet.json"; // 주문정보 수신 설정 데이터
		this.ordMsgSetting = "json/mylotte/ord_msg_setting_ajax.html"; // 주문정보 수신 설정 세팅 AJAX 경로
		this.talkUrl = "http://m.lotte.com/talk/main/talk_main.do"; /* 채팅상담 Talk URL */
		this.talkIntroUrl = "http://m.lotte.com/talk/main/talk_gateway.html"; /* 채팅상담 소개 URL */

		this.lateProdUrl = "/product/m/late_view_product_list_dev.html";  /*최근본 상품 리스트 URL*/
		this.lateProdData = "/json/product/late_view_product.json";  /* 최근본상품 데이터 */
		this.lateOthersData = this.testlocal + "/json/product/product_salebest.json";  /* 최근본상품 남들은 */
		this.mylotteReinquiryListUrl = this.baseUrl + "/mylotte/product/m/mylotte_reinquiry_list_dev.html"; /*상품 문의 내역*/
		this.mylotteReinquiryDetailUrl = "/mylotte/product/m/mylotte_reinquiry_detail_dev.html"; /*상품 문의 상세*/
		this.productQuestListData = "/json/mylotte/product/product_quest_list.json"; /*상품 문의 목록 데이터*/
		this.productQuestDetailData = "/json/mylotte/product/product_quest_detail.json"; /*상품 문의 상세 데이터*/
		this.productQuestWriteUrl = this.baseUrl + "/product/product_quest_write_dev.html";
		this.productQuestSave = "/json/comment/product_quest_save.json"; /*상품 문의 등록*/
		this.productQuestGoodsDetail = "/json/comment/product_quest_goods_detail.json"; /*상품 문의 - 상품정보*/
		this.mylotteCritViewUrl = "/mylotte/product/m/mylotte_crit_view_dev.html"
		this.unwrittenCommentListData = "/json/mylotte/product/unwritten_comment_list.json"; /*마이롯데 > 작성 가능한 상품평 목록 데이터*/
		this.writtenCommentListData = "/json/mylotte/product/written_comment_list.json"; /*마이롯데 > 내가 작성한 상품평 목록 데이터*/
		this.critEventData = "/json/mylotte/product/crit_event.json";/*마이롯데 > 상품평관리 이벤트*/
		this.commentWriteUrl = "/product/m/comment_write_dev.html";
		this.commentWriteData = "/json/comment/comment_write.json";
		this.commentWriteSaveData = "/json/cn/comment/comment_write_save.json";
		this.commentRewriteUrl = "/product/m/comment_rewrite_dev.html";
		this.commentRewriteData = "/json/comment/comment_rewrite.json";
		this.commentRewriteSaveData = "/json/cn/comment/comment_rewrite_save.json";
		this.commentImageDeleteData = "/json/cn/comment/comment_img_delete.json"
		this.commentCountDeletedData = "/json/cn/comment/comment_count_deleted.json";
		this.commentDeleteData = "/json/cn/comment/comment_delete.json";
		this.eventSaunUrl = "/event/m/eventSaunList_dev.html";              /*이벤트.구매사은*/
		this.myPointUrl = "/mylotte/pointcoupon/m/point_info_dev.html";	/*L.POINT L-money*/

		/* 포인트 */
		this.pointInfoUrl = "/mylotte/pointcoupon/m/point_info_dev.html"; /* 포인트 URL */
		this.pointInfoData = "/json/mylotte/pointcoupon/point_info.json"; /* 포인트 Data */
		this.smartPickListUrl = "/smartpick/pick_list_dev.html"; /* 스마트픽 교환권 List URL */
		//this.smartPickDetailUrl = "/smartpick/pick_view_dev.html"; /* 스마트픽 교환권 상세 URL */
		this.smartPickGiftUrl = "/smartpick/pick_gift_dev.html"; /* 스마트픽 교환권 SMS보내기 URL */
		this.smartPickSendUrl = this.mapiUrl + "/json/smartpick/smartpick_gift_send.json"; /* 스마트픽 교환권 보내기 URL */
		this.smartPickMmsUrl = this.mapiUrl + "/json/smartpick/reservation_send_mms.json"; /* 스마트픽 교환권 MMS 전송 URL */
		this.smartPickCancelUrl = this.mapiUrl + "/json/smartpick/reservation_cancel.json"; /* 스마트픽 교환권 취소 URL */
		this.smartPickUpdateUrl = this.mapiUrl + "/json/smartpick/reservation_update.json"; /* 스마트픽 교환권 수정 URL */
		this.smartPicKListData =  "/json/smartpick/smartpick_list.json"; /* 스마트픽 교환권 데이터 */
		this.ecouponListUrl = "" /* E쿠폰 리스트 */
		this.paperCouponUrl = "/mylotte/pointcoupon/m/coupon_write_dev.html" /* 페이퍼쿠폰등록 URL */
		this.paperCouponSaveUrl = this.testlocal + "/json/mylotte/pointcoupon/insert_paper_coupon.json" /* 페이퍼쿠폰등록 등록 */
		this.savePointUrl = this.testlocal + "/json/mylotte/pointcoupon/point_save.json" /* 포인트 적립하기 URL */
		this.depositDetailUrl = "/mylotte/pointcoupon/m/deposit_refund_dev.html" /* 보관금 환불신청상세 URL */
		this.depositRefundUrl = "/json/mylotte/pointcoupon/point_save.json" /* 보관금 환불신청 URL */

		// 백화점라이브
		this.deptLiveShopUrl = "/deptLive/deptLive_dev.html"; // 백화점 라이브 페이지 URL
		this.deptLiveMainData = "/lotte/resources_dev/data/deptLive/deptLive_main_data.html"; // 백화점 라이브 메인 데이터
		this.deptLiveSubData = "/lotte/resources_dev/data/deptLive/deptLive_goodList_data.html"; // 백화점 라이브 브랜드 데이터
		this.deptLiveDetailData = "/lotte/resources_dev/data/deptLive/deptLive_detail_data.html"; // 백화점 라이브 상세 데이터
		this.ellDeptLiveShopUrl = "/ellDeptLive/ellDeptLive_dev.html"; // 엘롯데 백화점 라이브 페이지 URL

		/* custcenter */
		this.orderListData = "/lotte/resources_dev/data/custcenter/order_list.html";  /*1:1문의하기 주문이력 보기*/
		this.questionSave = this.mapiUrl +  "/json/cn/custcenter/inquiry_save.json";  /* 1:1문의하기 등록 */
		this.productQuestionData = "/lotte/resources_dev/data/cscenter/question_detail.html";  /* 상품문의하기 조회 */
		this.productQuestionSave = "/lotte/resources_dev/data/custcenter/product_quest_save.html";  /*상품문의하기 등록 */
		this.cscenterOrderData = "/json/custcenter/inquiry_order_list.json"; /* 1:1 주문이력 목록조회 데이터 */

		// this.productProductViewData = "/lotte/resources_dev/data/product/product_view_data.html";         /*상품상세 기본정보*/
		this.productProductDetailData = "/lotte/resources_dev/data/product/product_detail_data.html";           /*[상품상세]상품상세 Html정보*/

		this.custcenterUrl = "/custcenter/cscenter_main_dev.html";    /*고객센터*/
		this.cscenterMainData = "/json/custcenter/main_custcenter.json"; /* 고객센터 메인 데이터 */
		this.cscenterFaqData = "/json/custcenter/faq_list.json"; /* FAQ 데이터 */
		this.cscenterNoticeData = "/json/custcenter/notice_list.json"; /* 공지사항 데이터 */
		this.cscenterQnaData = "/json/custcenter/inquiry_list.json"; /* 1:1문의 답변확인 */
		this.productQuestionData = "/json/custcenter/inquiry_detail.json";  /* 1:1문의 답변 상세 데이터 */

		this.cscenterFaqUrl = "/custcenter/faq_dev.html"; /* FAQ URL */
		this.cscenterNoticeUrl = "/custcenter/notice_dev.html"; /* 공지사항 URL */
		this.questionUrl = "/custcenter/m/question_dev.html"; /* QNA URL */
		this.cscenterAnswerUrl = "/custcenter/m/answer_dev.html"; /* 1:1문의목록 URL */
		this.cscenterAnswerDetaileUrl = "/custcenter/m/answer_detail_dev.html"; /* 1:1문의상세 URL */

		// 이용약관
		this.footerProvisionData  = (function () { // 상품상세 구매정보 코드별 로컬 데이터를 보기 위해 처리
			return "/json/footerProvision.json";
		}());

		// 임직원 오류 게시판
		this.errorAlarmUrl = "/custcenter/dotcomStaffBoard_dev.html"; // 오류신고페이지
		this.dotcomStaffBoardData = "/json/custcenter/dotcom_staff_board_list.json"; // 오류신고 데이터
		this.dotcomStaffBoardWrite = "/json/event/reg_dotcom_staff_board.json"; // 임직원 오류신고 게시판 글작성
		this.dotcomStaffBoardDelete = "/json/event/del_dotcom_staff_board.json"; // 임직원 오류신고 게시판 글삭제
		this.dotcomStaffBoardReply = "/json/event/reg_dotcom_staff_board_reply.json"; // 임직원 오류신고 게시판 댓글 등록

		/* agreement */
		//this.companyUrl = this.baseUrl + "/agreement/company.do";					/*회사소개*/
		this.companyUrl = "http://company.lotte.com/mobile/index.lotte";
		this.agreeUrl = "/agreement/custAgreement_dev.html?pv=D"; /*이용약관*/
		this.privacyUrl = "/agreement/custPrivacy_dev.html?pv=I";   /*개인정보취급방침*/
		this.protectYouthUrl = "/agreement/protect_youth_dev.html?pv=T";  /*청소년보호방침*/
		this.agreementDataUrl = "/lotte/resources_dev/data/agreement/agreement.html";  /* yubu 추후삭제 */
		/* etc */
		this.sciUrl = "https://m.lotte.com/sci/pcc_V3_seed.jsp";   /*본인인증*/
		this.tclickUrl = "/test/tclick.html?tclick=";  /*tclick*/
		this.appDown = this.baseUrl + "/app.do";
		this.facebookUrl = this.baseUrl + "/exevent/facebook_landing_lotte.jsp"; /* 페이스북 공유 페이지 */
		/* recobel 추천*/
		this.salebestlist_url		= "/json/product/salebestlist_data.json";
		this.salebestlist_url_ds	= this.salebestlist_url;//"http://analyticsapi.lotte.com/analytics/ds001"; // 다른고객이 함께 찾은 상품 (데이터 사이언스 API)
		this.salebestlist_url_al = "http://api-reco.alido.co.kr/recommendation/pagearea-set/service-id-1";
		// this.salebestlist_url = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/a002?size=100&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b"; // 남들은 뭘 샀지
		this.recobellOtherBuyInfoUrl = "/json/product/recobellOtherBuyInfoUrl.json?"; // 다른고객이 함께 찾은 상품 (보완재)
		// this.recobellOtherBuyInfoUrl = "http://rb-rec-api-apne1.recobell.io/rec/a005?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b"; // 다른고객이 함께 찾은 상품 (보완재)
		this.salebestPaln_url = "/json/product/salebestPaln_url.json?"; // 추천 기획전
		// this.salebestPaln_url = "http://rb-rec-api-apne1.recobell.io/rec/a101?size=100&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b"; // 추천 기획전
		/* footer */
		this.noticeData = "/lotte/resources_dev/data/notice_list.html";
		//상품상세 탭 kdkim4 start
		/*product*/
		//this.productProductViewData = "/lotte/resources_dev/data/product/product_view_data.html";         /*상품상세 기본정보*/
		//this.productProductViewData = this.testlocal + "/json/product/product_view.json";         /*상품상세 기본정보*/
		//this.productProductDetailData = this.foUrl + "/json/product/product_detail.json";         /*[상품상세]상품상세 Html정보*/
//        this.productProductDetailData = "/lotte/resources/data/product_detail.html";          /*[상품상세]상품상세 Html정보*/
//        this.productProductDetailData = this.mapiUrl + "/json/product/product_detail.json";           /*[상품상세]상품상세 Html정보*/
//        this.productProductDetailDataA ="/lotte/resources/data/product_detail_data.html";         /*[상품상세]상품상세 Html정보 정보입력형 용 */
//        this.productProductDetailDataB = "/lotte/resources/data/product_detail_img.html";         /*[상품상세]상품상세 Html정보 이미지형 용 */
//        this.productProductImgData = "/product/m/product_detail_new.html" //이미지 확대보기 화면 이동
////        this.productProductSalebestData = "/lotte/resources/data/product_salebest.html" //이미지 확대보기 화면 이동
//          this.productProductSalebestData = this.mapiUrl + "/json/product/product_salebest.json"
//        this.productProductItemInfoData = this.mapiUrl + "/json/product/product_item_info.json";//상세정보
//
//        this.commentProductQuestListMobileData = this.testlocal + "/json/comment/product_quest_list_mobile.json"; /*[상품상세]상품 문의하기 목록데이터*/
//        //this.commentCommentViewMobileData = this.testlocal + "/json/comment/comment_view_mobile.json";          /*[상품상세]상품평 목록데이터*/
//        this.commentCommentViewMobileData = "/lotte/resources/data/comment_view_mobile.html";     /*[상품상세]상품평 목록데이터  test용 */
		//상품상세 탭 kdkim4 end

		this.orderFormUrl = this.secureUrl + "/order/m/order_form.do"; // 주문서 페이지

		this.rentalCustomerUrl = "/json/login/lental_customer.json"; //렌탈 상담신청하기 - 사용자 정보
		this.rentalSendUrl = "/json/mylotte/lental_info_ins.json"; //렌탈상담신청하기 - 신청

		this.styleShopMainUrl = "/styleshop/StyleShopMain_dev.html"; // 스타일샵 메인
		this.styleShopUrl = "/styleshop/styleshop_dev.html"; // 스타일샵 서브
		this.styleShopData = "/json/main/styleshop_sub_list.json"; // 스타일샵

		this.styleShopMenUrl = "/styleshop/styleshopmen_dev.html"; // 스타일샵맨
		this.styleShopMenData = "/json/main/styleshop_men_sub_list.json"; // 스타일샵맨

		this.searchSurvery = "/json/search/insertSatisfaction.json"; // 201601012  검색결과 만족도

		// Naver Map
		this.naverMapInfo = "/product/crossdomain.do"; // 네이버맵 좌표 URL

		// 201603 모바일 리뉴얼
		this.cartCountData2016 = "/json/cart_count.json"; // 장바구니 개수 Data
//		this.rootMenuData2016 = "/json/main/root_menu_2016.json"; // 메인 메뉴 Data
		this.rootMenuData2017 = "/json/main/root_menu_2017.json"; // 메인 메뉴 Data
		this.sideCtgData2016 = "/json/jsondata/lotte_sidectg_2016.json"; // 탐색(좌측카테고리) Data
		this.sideCtgData2017 = "/json/jsondata/lotte_sidectg_2017.json"; // 탐색(좌측카테고리) Data
        this.sideCtgData2018 = "/json/category/lotte_sidectg_2018.json"; // 탐색(좌측카테고리) Data

		this.smartpickUrl = "/mall/smartpick_dev.html";  /*서브 스마트픽*/
		this.smartpickData = "/json/mall/smartpick.json"; /*서브 스마트픽data*/

		this.tvShoppingUrl = "/mall/tvShopping_dev.html";  /*서브 TV쇼핑*/
		this.tvShoppingData = "/json/mall/tvShopping.json"; /*서브 TV쇼핑data*/

		this.rankingUrl = "/mall/ranking_dev.html";  /*서브 TV쇼핑*/
		this.rankingData = "/json/mall/ranking.json"; /*서브 TV쇼핑data*/

		this.cartSave = "/json/mylotte/cart/m/cart_save.json";// 장바구니 보관하기
		this.cartCancel = "/json/mylotte/cart/m/cartCancelArea.json";// 장바구니 보관취소

		this.presentDetailUrl			= "/mylotte/present/present_detail_dev.html";//선물 상세
		this.presentListUrl				= "/mylotte/present/present_list_dev.html";//받은 선물함
		this.presentWriteCommentUrl		= "/mylotte/present/present_comment_write_dev.html";//선물 이용후기 쓰기
		this.presentEditCommentUrl		= "/mylotte/present/present_comment_write_dev.html";//선물 이용후기 쓰기
		if(false){
			this.presentReceivedListData	= "/json/order/receive_present.json";//받은 선물 리스트 데이타
			this.presentSentListData		= "/json/order/send_present.json";//보낸 선물 리스트 데이타
			this.presentListCheckNewData	= "/json/order/receive_present_map.json";//받은 선물 조회
			this.presentDetailData			= "/json/order/gift_detail.json";//선물상세 데이타
			this.presentCommentProductData	= "/json/order/gift_epilogue_info.json";//선물 이용후기 상품정보
		}else{
			this.presentReceivedListData	= "/json/mylotte/present/present_receive_list.jsp";//받은 선물 리스트 데이타
			this.presentSentListData		= "/json/mylotte/present/present_sent_list.jsp";//보낸 선물 리스트 데이타
			this.presentListCheckNewData	= "/json/mylotte/present/present_list_check_new.jsp";//받은 선물 조회
			this.presentDetailData			= "/json/mylotte/present/present_detail.jsp";//선물상세 데이타
			this.presentCommentProductData	= "/json/mylotte/present/present_comment_prod.jsp";//선물 이용후기 상품정보
		}
		this.presentDetailOption		= "/json/order/option_update.json";//선물상세 옵션변경
		this.presentDetailAddress		= "/json/order/deli_update.json";//선물상세 배송지변경
		this.presentCommentSave			= "/json/order/gift_epilogue_writer.json";//선물 이용후기 저장하기
		this.presentCommentImageDelete	= "/json/mylotte/present/present_image_delete.json";//선물 이용후기 이미지 삭제
		/*크로스픽*/
		this.pickMapUrl = "/smartpick/crosspick_map.do";//지도 경로
		this.pickCartUpdate = "/json/mylotte/cart/chgCrspkWithNormal.json"; //배송방법 변경]
		/*퀵배송*/
		this.quickCartUpdate = "/json/mylotte/cart/chgQuickWithNormal.json";//장바구니 퀵배송상품 배송방법 변경
        /*선물확인*/
        this.giftCheckUrl = "/json/order/gift_confim_info.json"; //선물확인
        this.searchAddress    = "/json/ord_search_address.json";//배송지 조회
        this.giftGoodDetail = "/json/mylotte/gift_good_detail.json";//상품기술서
        this.gift_epilogue = "/json/order/gift_epilogue.json";//선물확인 완료 - 이거어때리스트
        this.confirm_gift = "/json/order/gift_update.json"; //선물확인, 거

        //배송지삭제
        this.delete_address_list = "/json/order/delivery_info.json";

        //생생#라이브
        this.sslive_good = "/json/mall/sslive.json"; //상품정보
        this.sslive_talk = "/json/mall/sslive_talk.json"; //생생톡
        this.sslive_save = "/json/mall/sslive_save.json"; //생생톡 저

        /*기획전추천*/
        this.prsn_list = "/json/planshop/prsn_spdp_recomm_list.json";

        /*선물함*/
        this.gift_optlist = "/json/order/gift_option_list.json";
        this.gift_change = "/json/order/gift_insert_ob.json";

		/* 샤넬관 */
		this.chanelMall = "/json/mall/mall_chanel_main.json"; //샤넬관 메인
		this.chanelMallSubData = "/json/mall/mall_chanel_sub.json"; //카테고리
		this.chanelMallSubUrl = "/mall/chanel/chanel_prod_list.do"; //리스트

		/* 나의 총 클로버 */
		this.cloverUrl = "http://m.lotte.com/event/clover.do"; /* 나의 총 클로버 URL */

		/* 애완몰 디어펫 */
		this.petMallMainUrl = "/mall/pet/mitou_main_dev.html"; //애완몰 메인
		this.petMallMainData = "/json/mall/dearpet_main.json"; //애완몰 메인 데이타
		this.petMallProdListData = "/json/mall/dearpet_prod_list.json"; //애완몰 서브
		this.petMallProdListUrl = "/mall/pet/mitou_prod_list_dev.html"; //애완몰 리스트
		this.petMallgalleryUrl = "/mall/pet/mitou_gallery_dev.html"; //애완몰 뽑내기
		this.petMallSwagDeleteData = "/json/mall/swag_delete.json"; /* 뽑내기 글 삭제 */
		this.petCommentData = "/json/mall/pet/commentList.json";	/* 뽑내기 댓글데이터 */
		this.petCommentDeleteData = "/json/mall/pet/commentDelete.json"; /* 뽑내기 댓글데이터 삭제 */
		this.petCommentRegData = "/json/mall/pet/commentInsert.json"; /* 뽑내기 댓글데이터 등록 */
		this.petMalleventUrl = "/mall/pet/mitou_news_dev.html"; // 이벤트 ( 20170405 추가 )
		this.petMalleventData = "/json/mall/dearpet_news.json";
		this.petMallgalleryData= (function () {//애완몰 뽑내기 데이타 로컬 데이터를 보기 위해 처리
		        var url = "/json/mall/dearpet_gallery_" + getUrlParams().curDispNo + ".json";
		        if(!getUrlParams().curDispNo) url = "/json/mall/dearpet_gallery.json";
			return url;
		}());

		this.petMallpetMainPetProductData= "/json/mall/dearpet_main_data.json"; // 펫 스와이프시  제품 목록 변경 ( 20170628 )
		this.petMallpetMainPetActiveData= "/json/mall/pet_mast_yn.json"; // 펫 스와이프시  제품 목록 변경 ( 20170628 )
		this.petMallgalleryLikeData = "/json/mall/dearpet_gallery.json"; // 내가 좋아한 글 목록 (  ( 20170628 )
		this.petMallpetWriteUrl = "/mall/pet/pet_write_dev.html" ; // 우리 아이 등록 페이지 ( 20170703 )
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

		this.petMallStory= "/json/mall/mitou_story.json";//미뚜 스토리 메인
		this.petMallStoryDetail="/json/mall/mitou_story_detail.json";//미뚜 스토리 상세
		this.petMallStoryUrl= "/mall/pet/mitou_story_dev.html";//미뚜 스토리 url
		this.petMallStoryDetailUrl="/mall/pet/mitou_story_detail_dev.html";//펫스토리상세URㅣ

		/* 유아동 체험단 */
		this.kidsExperienceMainUrl = "/event/m/kids/experience_main_dev.html";  /* 유아동 체험단 메인 Url */
		this.kidsExperienceMainData = "/json/event/mom_tester_list.json"; /* 유아동 체험단 메인  data */
		this.kidsExperienceDetailData = "/json/event/mom_tester_detail.json";  /* 유아동 체험단 상세 data */
		this.kidsExperienceDetailUrl = "/event/m/kids/experience_view_dev.html";  /* 유아동 체험단 상세 Url */
		this.kidsExperienceWinnerUrl = "/event/m/kids/experience_winner_list_dev.html";  /* 유아동 체험단 당첨자 Url */
		this.kidsExperienceWinnerData = "/json/event/evt_tester_prizewinner.json";  /* 유아동 체험단  당첨자  data */
		this.kidsExperienceApplyBbsData = "/json/event/evt_bb_list.json";	/* 유아동 체험관 신청 게시판 */
		this.kidsExperienceApplySave = "/json/event/regEvent.json";
		this.kidsExperienceReviewGdasData = "/json/event/evt_gdas_list.json";	/* 유아동 체험관 후기 게시판 */
		this.kidsExperienceWriteUrl = "/event/m/kids/experience_write_dev.html";  /* 유아동 체험단 신청하기 Url */
		this.kidsExperienceReviewData = "/json/event/mom_tester_apply.json";	/* 유아동 체험관 후기 data */
		this.kidsExperiencePrizewinnerData = "/json/event/evt_tester_prizewinner_yn.json";	/* 유아동 체험관 당첨조회 data */
		//상품상세 -> 고객등록사진보기 Url
        this.photoreviewPage = "photoreview_dev.html";
		this.kidscommentWriteUrl = "/product/m/kids_comment_write_dev.html";/* 유아동 체험관 후기작성 url */

		/* 육아고객타겟매장 */
		this.infantMainUrl = "/mall/baby/baby_main_dev.html";  /* 육아고객타겟매장 메인 Url */
		this.infantMainData = "/json/mall/baby_main.json"; /* 육아고객타겟매장 메인  data */
		this.infantTipData = "/json/mall/baby_tip.json"; /* 육아고객타겟매장-팁  data */
		this.infantPhotoData = "/json/mall/baby_photo.json"; /* 육아고객타겟매장-포토후기  data */

		this.infantTipWriteUrl = "/mall/baby/swag_baby_write_dev.html";
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
		this.bestBrandMain = "/brand/bestbrand_main_dev.html" // 베스트브랜드몰메인
		this.bestBrandSub = "/brand/bestbrand_sub_dev.html" // 베스트브랜드몰서브
		this.bestBrandMainData = "/json/brand/best_brand_mall_main.json" // 베스트브랜드몰메인
		this.bestBrandSubData = "/json/brand/best_brand_mall_sub.json" // 베스트브랜드몰서브
		this.bestBrandHeaderData = "/json/brand/best_brand_mall_header.json" // 베스트브랜드몰헤더

		// 대화형커머스
		this.talkRecomUrl		= "/talk/talkRecom_dev.html";//바닥페이지
		this.talkRecomChatbot	= "/json/talk/chatbot.jsp";//챗봇
		this.talkRecomProdlist	= "/json/talk/prodlist.jsp"//상품목록
		this.talkRecomAppMenu	= "/publish/talkrecom_menu.json";//App 메뉴
		this.talkShopUrl		= "/talk/talkShopping_dev.html";//음성주문 pagae
		this.talkShopChatbot	= "/json/talk/chatbot_ts.jsp";//챗봇
		this.talkShopPriorInfo	= "/json/talk/talk_prior_info.json";//배송/결제 data
		this.talkShopDelevery	= "/talk/voice_shopping1_dev.html";//배송지 수정 page
		this.talkShopPayment	= "/talk/voice_shopping2_dev.html";//결제수단 수정 page
		this.talkShopOrderFrame	= "/lotte/resources_dev/talk/talkShoppingOrderFrame.html";//결제 아이프레임
		this.talkShopIntro		= "/voice_order/voice_order_dev.html";//음성주문 안내

		// 보이스커머스
		this.voiceCommerceUrl = "/talk/voiceCommerce_dev.html"; // 보이스커머스 (안녕샬롯) 페이지
		this.vcInfoData = "/json/talk/voice_commerce/talk_my_page_info.json"; // 보이스커머스 햄버거 표현 데이터 (배송지, 결제수단, 추천발화가이드)
		this.vcStartVoiceInfoData = "/json/talk/voice_commerce/talk_start_base_info.json"; // 보이스 커머스 인입시 발화가이드
		this.semanticAnalysisData = "/json/talk/voice_commerce/voiceCommerceRequest.json"; // 의미분석 URL
		this.vcPrdInfoData = "/json/talk/voice_commerce/talk_goods_list.json"; // 보이스 커머스 상품정보 URL
		this.vcPrdOptInfoData = "/json/talk/voice_commerce/talk_prd_opt_info.json"; // 상품 옵션 정보
		this.vcHelpInfoData = "/json/talk/voice_commerce/talk_help.json"; // 보이스 커므스 도움말 정보 데이터 (코너)
		this.vcPrdQtyChkData = "/json/talk/voice_commerce/searchInvQtyCheckByGoodsNoAjax.json"; // 보이스커머스 재고 수량 체크
		this.vcPrdOrderDecideData = "/json/talk/voice_commerce/talk_order_decide.json"; // 보이스커머스 주문 확정 데이터
		this.vcOrdCompleteData = "/json/talk/voice_commerce/talk_order_complete.json"; // 보이스커머스 주문완료 데이터
		this.vcDeliveryInfoData = "/json/talk/voice_commerce/talk_prd_dlv_info.json"; // 배송비, 배송기일 확인 API
		this.vcAddCart = "/json/talk/voice_commerce/talk_cart_ins.json"; // 보이스 커머스 장바구니 담기 API
		this.vcAddWish = "/json/talk/voice_commerce/talk_wish_ins.json"; // 보이스 커머스 위시 담기 API
		this.vcPrdImgListData = "/json/talk/voice_commerce/talk_prd_img_info.json"; // 보이스 커머스 상품 이미지 리스트 정보 확인
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
        this.movieStoreData = "/json/mall/goodsInfo_video_mall_bot.json?"; /* 동영상 플랫폼 */
        this.movieStoreDataTop = "/json/mall/goodsInfo_video_mall_top.json?dispNo=5586147"; /* 동영상 플랫폼 */
        this.movieReviewData = "/json/mall/reviewer_mall.json"; /* 동영상 리뷰매장 */
		/* 삼성전자 베스트브랜드몰*/
		this.samsungBrandMain = "/mall/samsung/bestsamsung_main_dev.html"; //삼성전자 베스트브랜드몰메인
		this.samsungBrandSub = "/mall/samsung/bestsamsung_sub_dev.html"; // 삼성전자 베스트브랜드몰 서브
		this.samsungBrandcontData = "/json/mall/samsung_mall_main.json"; //삼성전자 베스트브랜드몰메인 데이터
		this.samsungBrandSubcontData = "/json/mall/samsung_mall_sub.json"; //삼성전자 베스트브랜드몰서브 데이터

		/* 개인화 종합페이지 */
		this.myfeedUrl			= "/myfeed/myfeed_dev.html"; // 개인화 종합페이지
		this.myfeedDataUrl		= "/json/mylotte/my_recomm_info.json"; // 개인화 API 경로

		/* 이용약관 */
		this.clauseECommerce	= "/webapp/publish/layer_clause_ecommerce.jsp";
		this.clausePIUse		= "/webapp/publish/layer_clause_pi_use.jsp";
		this.clausePIConsign	= "/webapp/publish/layer_clause_pi_consign.jsp";

		/* 이용약관 */
		this.clauseKgECommerce	= "/webapp/publish/layer_kg_clause_ecommerce.jsp";
		this.clauseKgPIUse		= "/webapp/publish/layer_kg_clause_pi_use.jsp";
		this.clauseKgPIConsign	= "/webapp/publish/layer_kg_clause_pi_consign.jsp";

		/*자주 구매*/
		this.oftenProdUrl = "/mylotte/often_buy/often_buy_dev.html"; //자주구매 페이지
		this.oftenBuyList = "/json/mylotte/often/often_buy_list.json"; //자주구매리스트 데이터
		this.oftenBuyOption = "/json/product/often_buy_option.json"; //자주구매 상품 옵션 데이터
		
		/* 전문몰 핀터레스트 데이터 */
		this.specMallDetailData = "/json/mall/kshop_detail.json";
		this.specMallDetailProductsData = "/json/mall/kshop_detail_products.json";
		this.specMallDetail = "/mall/spec_mall_detail_dev.html";
		this.specMallDetailProducts = "/mall/spec_mall_detail_product_dev.html";
		
        /*20180130 개인화추천 API 변경*/
        this.rec_good = "http://rb-rec-api-apne1.recobell.io/rec/a002?cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b";
        this.rec_plan = "http://rb-rec-api-apne1.recobell.io/rec/a101?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b";
        this.rec_buy = "http://rb-rec-api-apne1.recobell.io/rec/a005?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b";
        this.rec_search = "http://rb-rec-api-apne1.recobell.io/rec/s001?cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b";		

		
		// 닷컴/슈퍼 폴더앱 PRJ 추가 API 경로
		this.headerLandingData = "/json/main_new/getAppHeaderIcon.json"; // 헤더 우측 상단 코너 데이터

		this.SuperCartListData = "http://m.lottesuper.co.kr/handler/united/gateway/SuperCartIf-Start"; // 슈퍼 장바구니 리스트 API JSON
		this.SuperWishListData = "http://m.lottesuper.co.kr/handler/united/gateway/WishListIf-Start"; // 슈퍼 위시리스트 리스트 API JSON
		this.SuperWishDeleteData = "http://m.lottesuper.co.kr/handler/united/gateway/WishListIf-Delete"; // 슈퍼 위시리스트 삭제 API JSON
		this.SuperWishInsertCartData = "http://m.lottesuper.co.kr/handler/united/gateway/SuperCartIf-InsertCart"; // 슈퍼 위시리스트 장바구니담기/바로구매 API JSON

		this.SuperLoginSSOUrl = "https://m.lottesuper.co.kr/handler/Interface-DcomSSO"; // 롯데슈퍼 로그인 연동 Gate 페이지

		this.SuperMainUrl = "http://m.lottesuper.co.kr"; // 슈퍼 메인
		this.SuperCartUrl = "http://m.lottesuper.co.kr/handler/cart/SuperCart-Start"; // 장바구니
		this.SuperDirectBuyUrl = "http://m.lottesuper.co.kr/handler/united/gateway/SuperCartIf-AddCart"; // 바로구매
		this.SuperProdDetailUrl = "http://m.lottesuper.co.kr/handler/goods/GoodsDetail"; // 상품상세
		this.SuperSearchListUrl = "http://m.lottesuper.co.kr/handler/search/Search-Result"; // 검색리스트
		this.SuperOrderListUrl = "http://m.lottesuper.co.kr/handler/mypage/main/MyPageOrder-Start"; // 슈퍼 주문내역
		this.SuperWishListUrl = "http://m.lottesuper.co.kr/handler/mypage/wishlist/WishList"; // 슈퍼 위시리스트
		this.SuperQuickBuyUrl = "http://m.lottesuper.co.kr/handler/mypage/wishlist/QuickBuy-OftenBuyList"; // 슈퍼 자주구매

		this.superBnrExcludeKeywordData = "/jsondata/superbnr_exclude_keyword.json"; // 닷컴/슈퍼 검색 슈퍼 배너 제외 키워드 데이터
        
        //this.adReq =  "/json/adReq.json"; //광고솔루션 테스트 URL
        this.adReq =  "http://alpha.display.lottecpcad.com/adReq"; //광고솔루션 URL
        this.adReqMain =  "http://alpha.display.lottecpcad.com/da/"; //광고솔루션 테스트 URL 메인
        //this.adReq =  "http://display.lottecpcad.com/adReq"; //광고솔루션 URL

		/*버버리 전문관*/
		this.mallBurberryMain = "/mall/burberry/burberry_main_dev.html";// 버버리 메인페이지
		this.mallBurberryList = "/mall/burberry/burberry_prod_list_dev.html"; //버버리 상품리스트 페이지
		this.BurberryCsCenter = "/mall/burberry/cscenter/burberry_cscenter_dev.html"; // 버버리 cs 센터
		this.BurberryProdView = "/mall/burberry/product_view_burberry_dev.html"; // 버버리 상세

		this.mallBurberryCateData = "/json/mall/mall_burberry_category.json"; //버버리 카테고리 데이터
		this.mallBurberryData = "/json/mall/special_booth.json"; //버버리 메인 데이터
		this.subBurberryListData = "/json/mall/mall_burberry_sub.json"; //버버리 상품리스트 데이터
		this.BurberryCsData = "/json/mall/mall_burberry_faq.json"; // 버버리 cs 센터

        /*중고매장*/
        this.used_main = "/json/mall/used_main.json"; //중고매장 메인
        this.used_write = "/json/mall/board_write.json"; //중고물품 등록하기
        this.used_rewrite = "/json/mall/board_write.json"; //중고물품 등록하기
        this.used_reply_list = "/json/mall/reply_list.json"; //댓글 조회 
        this.used_reply_write = "/json/mall/reply_write.json"; //댓글 조회 
        this.used_recommend = "/json/mall/board_recommend.json";//추천하기 
        this.used_declare = "/json/mall/board_declare.json";//신고하기 
        this.used_declare2 = "/json/mall/reply_declare.json";
        this.used_reply_delete = "/json/mall/reply_delete.json";//댓글 삭제하기 
        this.used_delete = "/json/mall/board_delete.json";//글 삭제하기 
        this.used_main_link = "/mall/used_main_dev.html"; //메인 경로 
        this.used_write_link = "/mall/used_write_dev.html"; //글 작성, 수정하기 경로 
        this.board_chk = "/json/mall/board_chk_cont.json"; //금칙어 체크 
        this.used_img_del = "/json/mall/board_img_delete.json";//이미지삭제
        this.used_photoWrite = "/json/mall/board_img_upload.json";//중고매장 이미지 한장씩 올리기 
		this.used_info = "/json/mall/board_info.json"; //중고라운지 공지사항
        
        /* 상품평 개선 2차 */
        this.favoriteReviewerList = "/json/mylotte/product/favorite_reviewer.json";	//즐겨찾는 리뷰어 조회
        this.reviewCategory = "/json/comment/best_category_info.json";	//베스트 상품평 카테고리
        this.reviewBestCtg = "/json/comment/best_review_comment.json"; //베스트 상품평 조회
        this.reviewBest = "/product/m/review_best_dev.html"; //베스트 상품평 URL
        this.reviewerHomeInfo = "/json/comment/reviewer_home_info.json"; //리뷰어 홈 조회
        
		this.dearpet_brdbest = "/json/mall/dearpet_brd_best_list.json";//미미뚜뚜 브랜드베스트
		
		
		/* SSO 통합회원제 */
		this.getClientAskInfo = "/json/login/sso/getSsoData.json"; // SSO 통합회원 라이브러리초기화 데이터 
		this.ssoAfterLogin = "/json/login.json"; // SSO 통합회원 로그인 후 닷컴 로그인 처리 URL
		this.getSsoRnwTkn = "/json/login/getSsoAcesTknAjax.json"; // SSO 갱신토큰 및 갱신토큰 저장날짜 호출 URL
		this.ssoDropGate = "/login/sso_drop_gate_dev.html"; //SSO 탈퇴 리턴 URL
		
			/* 간편로그인 UI변경 이메일주소 리스트 */ 
		this.email_kind = "/json/login/getEmailKind.json";

	}]);
})(window, window.angular);
