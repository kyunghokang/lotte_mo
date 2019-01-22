'use strict'

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-string-replace');

	var version = "r20190110_1";
	var options = {
		config : {
			src : "config/*.json"
		},
		version : version/*,
		sourceMapRootURL : "http://molocal.lotte.com/lotte/resources/"+version*/
	};

	require('time-grunt')(grunt);

	var configs = require('load-grunt-configs')(grunt, options);

	grunt.initConfig(configs);
	grunt.registerTask('default', ['ngtemplates', 'concat', 'uglify', 'cssmin', 'clean', 'processhtml']);

	//Secure Resource 생성
	grunt.config.set("string-replace", { //http 이미지 https로 변환
		strReplaceComm2016: { //공통 리소스
			files: {
				"lotte/resources/<%= version %>/common_secure.min.css": "lotte/resources/<%= version %>/common.min.css",
				"lotte/resources/<%= version %>/common_secure.tpl.js": "lotte/resources/<%= version %>/common.tpl.js",
				"lotte/resources/<%= version %>/common_secure.min.js": "lotte/resources/<%= version %>/common.min.js"
			},
			options: {
				replacements: [{
					pattern: /http:\/\/image\.lotte\.com/gi,
					replacement: "https://simage.lotte.com"
				}]
			}
		},
		strReplaceOrderForm: { //주문서 리소스
			files: {
				"lotte/resources/<%= version %>/order.min.css": "lotte/resources/<%= version %>/order.min.css",
				"lotte/resources/<%= version %>/order.min.js": "lotte/resources/<%= version %>/order.min.js"
			},
			options: {
				replacements: [{
					pattern: /http:\/\/image\.lotte\.com/gi,
					replacement: "https://simage.lotte.com"
				}]
			}
		},
		strReplaceOrderGiftForm: { //주문서 리소스
			files: {
				"lotte/resources/<%= version %>/order_gift.min.css": "lotte/resources/<%= version %>/order_gift.min.css",
				"lotte/resources/<%= version %>/order_gift.min.js": "lotte/resources/<%= version %>/order_gift.min.js"
			},
			options: {
				replacements: [{
					pattern: /http:\/\/image\.lotte\.com/gi,
					replacement: "https://simage.lotte.com"
				}]
			}
		}
	});

	grunt.registerTask('comm2018', ['ngtemplates:tplComm2018', 'concat:jsComm2018', 'uglify:jsComm2018', 'uglify:tplComm2018', 'cssmin:cssComm2018', 'string-replace:strReplaceComm2016', 'clean:cleanComm2018', 'processhtml:htmlComm2018']); //공통영역
	grunt.registerTask('Main2018', ['ngtemplates:tplMain2018', 'concat:jsMain2018', 'uglify:jsMain2018', 'uglify:tplMain2018', 'cssmin:cssMain2018', 'clean:cleanMain2018', 'processhtml:htmlMain2018']); //메인
	grunt.registerTask('lotte_product2018', ['ngtemplates:tplLotteProduct2018', 'concat:jsLotteProduct2018', 'uglify:jsLotteProduct2018', 'uglify:tplLotteProduct2018', 'cssmin:cssLotteProduct2018', 'clean:cleanLotteProduct2018', 'processhtml:htmlLotteProduct2018']); //상품리스트
	grunt.registerTask('SearchList2018', ['ngtemplates:tplSearchList2018', 'concat:jsSearchList2018', 'uglify:jsSearchList2018', 'uglify:tplSearchList2018', 'cssmin:cssSearchList2018', 'clean:cleanSearchList2018', 'processhtml:htmlSearchList2018']); //검색리스트
	grunt.registerTask('cart2018', ['ngtemplates:tplcart2018', 'concat:jscart2018', 'uglify:jscart2018', 'uglify:tplcart2018', 'cssmin:csscart2018', 'clean:cleancart2018', 'processhtml:htmlcart2018']); //장바구니 리스트
	grunt.registerTask('wish2018', ['ngtemplates:tplwishlist2018', 'concat:jswishlist2018', 'uglify:jswishlist2018', 'uglify:tplwishlist2018', 'cssmin:csswishlist2018', 'clean:cleanwishlist2018', 'processhtml:htmlwishlist2018']); //위시 리스트
	grunt.registerTask('MyLotteMain2018', ['ngtemplates:tplMyLotteMain2018', 'concat:jsMyLotteMain2018', 'uglify:jsMyLotteMain2018', 'uglify:tplMyLotteMain2018', 'cssmin:cssMyLotteMain2018', 'clean:cleanMyLotteMain2018', 'processhtml:htmlMyLotteMain2018']); //마이롯데 메인
	grunt.registerTask('LatelyProduct2018', ['ngtemplates:tplLatelyProduct2018', 'concat:jsLatelyProduct2018', 'uglify:jsLatelyProduct2018', 'uglify:tplLatelyProduct2018', 'cssmin:cssLatelyProduct2018', 'clean:cleanLatelyProduct2018', 'processhtml:htmlLatelyProduct2018']); //최근본상품 리스트
	grunt.registerTask('StylePushIntro2018', ['ngtemplates:tplstylePushIntro2018', 'concat:jsstylePushIntro2018', 'uglify:jsstylePushIntro2018', 'uglify:tplstylePushIntro2018', 'cssmin:cssstylePushIntro2018', 'clean:cleanstylePushIntro2018', 'processhtml:htmlstylePushIntro2018']); //스타일추천
	grunt.registerTask('Order', ['concat:jsOrder', 'uglify:jsOrder', 'cssmin:cssOrder', 'string-replace:strReplaceOrderForm', 'clean:cleanOrder', 'processhtml:htmlOrder']); //주문서
	grunt.registerTask('OrderGift', ['concat:jsOrderGift', 'uglify:jsOrderGift', 'cssmin:cssOrderGift', 'string-replace:strReplaceOrderGiftForm', 'clean:cleanOrderGift', 'processhtml:htmlOrderGift']); //선물주문서
	grunt.registerTask('HalfChance', ['ngtemplates:tplHalfChance', 'concat:jsHalfChance', 'uglify:jsHalfChance', 'uglify:tplHalfChance', 'cssmin:cssHalfChance', 'clean:cleanHalfChance']); //하프찬스
	grunt.registerTask('BrandSub', ['ngtemplates:tplBrandSub', 'concat:jsBrandSub', 'uglify:jsBrandSub', 'uglify:tplBrandSub', 'cssmin:cssBrandSub', 'clean:cleanBrandSub', 'processhtml:htmlBrandSub']); //브랜드서브페이지
	grunt.registerTask('BrandMain', ['ngtemplates:tplBrandMain', 'concat:jsBrandMain', 'uglify:jsBrandMain', 'uglify:tplBrandMain', 'cssmin:cssBrandMain', 'clean:cleanBrandMain', 'processhtml:htmlBrandMain']); //브랜드메인
	grunt.registerTask('CateMidList', ['ngtemplates:tplCateMidList', 'concat:jsCateMidList', 'uglify:jsCateMidList', 'uglify:tplCateMidList', 'cssmin:cssCateMidList', 'clean:cleanCateMidList', 'processhtml:htmlCateMidList']); //중카테고리 리스트
	grunt.registerTask('CateHolidayMidList', ['ngtemplates:tplCateHolidayMidList', 'concat:jsCateHolidayMidList', 'uglify:jsCateHolidayMidList', 'uglify:tplCateHolidayMidList', 'cssmin:cssCateHolidayMidList', 'clean:cleanCateHolidayMidList', 'processhtml:htmlCateHolidayMidList']); //명절 중카테고리 리스트
	grunt.registerTask('CateBeauty', ['ngtemplates:tplCateBeauty', 'concat:jsCateBeauty', 'uglify:jsCateBeauty', 'uglify:tplCateBeauty', 'cssmin:cssCateBeauty', 'clean:cleanCateBeauty', 'processhtml:htmlCateBeauty']); //명품화장품카테고리
	grunt.registerTask('CateProdList', ['ngtemplates:tplCateProdList', 'concat:jsCateProdList', 'uglify:jsCateProdList', 'uglify:tplCateProdList', 'cssmin:cssCateProdList', 'clean:cleanCateProdList', 'processhtml:htmlCateProdList']); //세카테고리 상품리스트
	grunt.registerTask('CateHolidayProdList', ['ngtemplates:tplCateHolidayProdList', 'concat:jsCateHolidayProdList', 'uglify:jsCateHolidayProdList', 'uglify:tplCateHolidayProdList', 'cssmin:cssCateHolidayProdList', 'clean:cleanCateHolidayProdList', 'processhtml:htmlCateHolidayProdList']); //세카테고리 명절 상품리스트
	grunt.registerTask('DeptLive', ['ngtemplates:tplDeptLive', 'concat:jsDeptLive', 'uglify:jsDeptLive', 'uglify:tplDeptLive', 'cssmin:cssDeptLive', 'clean:cleanDeptLive', 'processhtml:htmlDeptLive']); //백화점라이브매장
	grunt.registerTask('mylotteReinquiryDetail', ['ngtemplates:tplmylotteReinquiryDetail', 'concat:jsmylotteReinquiryDetail', 'uglify:jsmylotteReinquiryDetail', 'uglify:tplmylotteReinquiryDetail', 'cssmin:cssmylotteReinquiryDetail', 'clean:cleanmylotteReinquiryDetail', 'processhtml:htmlmylotteReinquiryDetail']); //마이롯데 재조회 상세
	grunt.registerTask('mylotteReinquiryList', ['ngtemplates:tplmylotteReinquiryList', 'concat:jsmylotteReinquiryList', 'uglify:jsmylotteReinquiryList', 'uglify:tplmylotteReinquiryList', 'cssmin:cssmylotteReinquiryList', 'clean:cleanmylotteReinquiryList', 'processhtml:htmlmylotteReinquiryList']); //마이롯데 재조회 리스트
	grunt.registerTask('loginForm', ['ngtemplates:tplloginForm', 'concat:jsloginForm', 'uglify:jsloginForm', 'uglify:tplloginForm', 'cssmin:cssloginForm', 'clean:cleanloginForm', 'processhtml:htmlloginForm']); //로그인
	grunt.registerTask('findId', ['ngtemplates:tplfindId', 'concat:jsfindId', 'uglify:jsfindId', 'uglify:tplfindId', 'cssmin:cssfindId', 'clean:cleanfindId', 'processhtml:htmlfindId']); //아이디찾기
	grunt.registerTask('findIdAfter', ['ngtemplates:tplfindIdAfter', 'concat:jsfindIdAfter', 'uglify:jsfindIdAfter', 'uglify:tplfindIdAfter', 'cssmin:cssfindIdAfter', 'clean:cleanfindIdAfter', 'processhtml:htmlfindIdAfter']); //아이디찾기결과
	grunt.registerTask('loginBlock', ['ngtemplates:tplloginBlock', 'concat:jsloginBlock', 'uglify:jsloginBlock', 'uglify:tplloginBlock', 'cssmin:cssloginBlock', 'clean:cleanloginBlock', 'processhtml:htmlloginBlock']); //로그인잠금
	grunt.registerTask('changePw', ['ngtemplates:tplchangePw', 'concat:jschangePw', 'uglify:jschangePw', 'uglify:tplchangePw', 'cssmin:csschangePw', 'clean:cleanchangePw', 'processhtml:htmlchangePw']); //비밀번호변경
	grunt.registerTask('findPw', ['ngtemplates:tplfindPw', 'concat:jsfindPw', 'uglify:jsfindPw', 'uglify:tplfindPw', 'cssmin:cssfindPw', 'clean:cleanfindPw', 'processhtml:htmlfindPw']); //비밀번호찾기
	grunt.registerTask('findPwAfter', ['ngtemplates:tplfindPwAfter', 'concat:jsfindPwAfter', 'uglify:jsfindPwAfter', 'uglify:tplfindPwAfter', 'cssmin:cssfindPwAfter', 'clean:cleanfindPwAfter', 'processhtml:htmlfindPwAfter']); //
	grunt.registerTask('reSendEmail', ['ngtemplates:tplreSendEmail', 'concat:jsreSendEmail', 'uglify:jsreSendEmail', 'uglify:tplreSendEmail', 'cssmin:cssreSendEmail', 'clean:cleanreSendEmail', 'processhtml:htmlreSendEmail']);
	grunt.registerTask('m1200m', ['ngtemplates:tplm1200m', 'concat:jsm1200m', 'uglify:jsm1200m', 'uglify:tplm1200m', 'cssmin:cssm1200m', 'clean:cleanm1200m', 'processhtml:htmlm1200m']);
	grunt.registerTask('m1300k', ['ngtemplates:tplm1300k', 'concat:jsm1300k', 'uglify:jsm1300k', 'uglify:tplm1300k', 'cssmin:cssm1300k', 'clean:cleanm1300k', 'processhtml:htmlm1300k']);
	grunt.registerTask('specialFlavor', ['ngtemplates:tplspecialFlavor', 'concat:jsspecialFlavor', 'uglify:jsspecialFlavor', 'uglify:tplspecialFlavor', 'cssmin:cssspecialFlavor', 'clean:cleanspecialFlavor', 'processhtml:htmlspecialFlavor']);
	grunt.registerTask('SpecialMallMain', ['ngtemplates:tplSpecialMallMain', 'concat:jsSpecialMallMain', 'uglify:jsSpecialMallMain', 'uglify:tplSpecialMallMain', 'cssmin:cssSpecialMallMain', 'clean:cleanSpecialMallMain', 'processhtml:htmlSpecialMallMain']);
	grunt.registerTask('SpecMall', ['ngtemplates:tplSpecMall', 'concat:jsSpecMall', 'uglify:jsSpecMall', 'uglify:tplSpecMall', 'cssmin:cssSpecMall', 'clean:cleanSpecMall', 'processhtml:htmlSpecMall']);
	grunt.registerTask('SpecMallSub', ['ngtemplates:tplSpecMallSub', 'concat:jsSpecMallSub', 'uglify:jsSpecMallSub', 'uglify:tplSpecMallSub', 'cssmin:cssSpecMallSub', 'clean:cleanSpecMallSub', 'processhtml:htmlSpecMallSub']);
	grunt.registerTask('MallMain', ['ngtemplates:tplMallMain', 'concat:jsMallMain', 'uglify:jsMallMain', 'uglify:tplMallMain', 'cssmin:cssMallMain', 'clean:cleanMallMain', 'processhtml:htmlMallMain']);
	grunt.registerTask('book', ['ngtemplates:tplbook', 'concat:jsbook', 'uglify:jsbook', 'uglify:tplbook', 'cssmin:cssbook', 'clean:cleanbook', 'processhtml:htmlbook']);
	grunt.registerTask('GucciMain', ['ngtemplates:tplGucciMain', 'concat:jsGucciMain', 'uglify:jsGucciMain', 'uglify:tplGucciMain', 'cssmin:cssGucciMain', 'clean:cleanGucciMain', 'processhtml:htmlGucciMain']);
	grunt.registerTask('lzineList', ['ngtemplates:tpllzineList', 'concat:jslzineList', 'uglify:jslzineList', 'uglify:tpllzineList', 'cssmin:csslzineList', 'clean:cleanlzineList', 'processhtml:htmllzineList']);
	grunt.registerTask('WineDetail', ['ngtemplates:tplWineDetail', 'concat:jsWineDetail', 'uglify:jsWineDetail', 'uglify:tplWineDetail', 'cssmin:cssWineDetail', 'clean:cleanWineDetail', 'processhtml:htmlWineDetail']);
	grunt.registerTask('ProductWindSmartpic', ['ngtemplates:tplProductWindSmartpic', 'concat:jsProductWindSmartpic', 'uglify:jsProductWindSmartpic', 'uglify:tplProductWindSmartpic', 'cssmin:cssProductWindSmartpic', 'clean:cleanProductWindSmartpic', 'processhtml:htmlProductWindSmartpic']);
	grunt.registerTask('MallSub', ['ngtemplates:tplMallSub', 'concat:jsMallSub', 'uglify:jsMallSub', 'uglify:tplMallSub', 'cssmin:cssMallSub', 'clean:cleanMallSub', 'processhtml:htmlMallSub']);
	grunt.registerTask('SmpBooking', ['ngtemplates:tplSmpBooking', 'concat:jsSmpBooking', 'uglify:jsSmpBooking', 'uglify:tplSmpBooking', 'cssmin:cssSmpBooking', 'clean:cleanSmpBooking', 'processhtml:htmlSmpBooking']);
	grunt.registerTask('TvHome', ['ngtemplates:tplTvHome', 'concat:jsTvHome', 'uglify:jsTvHome', 'uglify:tplTvHome', 'cssmin:cssTvHome', 'clean:cleanTvHome', 'processhtml:htmlTvHome']);
	grunt.registerTask('ProdList', ['ngtemplates:tplProdList', 'ngtemplates:tplProdList2', 'concat:jsProdList', 'concat:jsProdList2','uglify:jsProdList', 'uglify:tplProdList', 'uglify:jsProdList2', 'uglify:tplProdList2','cssmin:cssProdList', 'cssmin:cssProdList2', 'clean:cleanProdList', 'clean:cleanProdList2','processhtml:htmlProdList', 'processhtml:htmlProdList2']);
	grunt.registerTask('ProdList2', ['ngtemplates:tplProdList2', 'concat:jsProdList2', 'uglify:jsProdList2', 'uglify:tplProdList2', 'cssmin:cssProdList2', 'clean:cleanProdList2', 'processhtml:htmlProdList2']);
	grunt.registerTask('GucciProduct', ['ngtemplates:tplGucciProduct', 'concat:jsGucciProduct', 'uglify:jsGucciProduct', 'uglify:tplGucciProduct', 'cssmin:cssGucciProduct', 'clean:cleanGucciProduct', 'processhtml:htmlGucciProduct']);
	grunt.registerTask('Product', ['ngtemplates:tplProduct', 'concat:jsProduct', 'uglify:jsProduct', 'uglify:tplProduct', 'cssmin:cssProduct', 'clean:cleanProduct', 'processhtml:htmlProduct']);
	grunt.registerTask('dormancyInfoFail', ['ngtemplates:tpldormancyInfoFail', 'concat:jsdormancyInfoFail', 'uglify:jsdormancyInfoFail', 'uglify:tpldormancyInfoFail', 'cssmin:cssdormancyInfoFail', 'clean:cleandormancyInfoFail', 'processhtml:htmldormancyInfoFail']);
	grunt.registerTask('dormancyInfo', ['ngtemplates:tpldormancyInfo', 'concat:jsdormancyInfo', 'uglify:jsdormancyInfo', 'uglify:tpldormancyInfo', 'clean:cleandormancyInfo', 'processhtml:htmldormancyInfo']);
	grunt.registerTask('soGoodBenefit', ['ngtemplates:tplsoGoodBenefit', 'concat:jssoGoodBenefit', 'uglify:jssoGoodBenefit', 'uglify:tplsoGoodBenefit', 'cssmin:csssoGoodBenefit', 'clean:cleansoGoodBenefit', 'processhtml:htmlsoGoodBenefit']);
	grunt.registerTask('directAttend', ['ngtemplates:tpldirectAttend', 'concat:jsdirectAttend', 'uglify:jsdirectAttend', 'uglify:tpldirectAttend', 'cssmin:cssdirectAttend', 'clean:cleandirectAttend', 'processhtml:htmldirectAttend']);
	grunt.registerTask('Company', ['ngtemplates:tplCompany', 'concat:jsCompany', 'uglify:jsCompany', 'uglify:tplCompany', 'cssmin:cssCompany', 'clean:cleanCompany', 'processhtml:htmlCompany']);
	grunt.registerTask('CustAgreement', ['ngtemplates:tplCustAgreement', 'concat:jsCustAgreement', 'uglify:jsCustAgreement', 'uglify:tplCustAgreement', 'cssmin:cssCustAgreement', 'clean:cleanCustAgreement', 'processhtml:htmlCustAgreement']);
	grunt.registerTask('CustPrivacy', ['ngtemplates:tplCustPrivacy', 'concat:jsCustPrivacy', 'uglify:jsCustPrivacy', 'uglify:tplCustPrivacy', 'cssmin:cssCustPrivacy', 'clean:cleanCustPrivacy', 'processhtml:htmlCustPrivacy']);
	grunt.registerTask('CouponWrite', ['ngtemplates:tplCouponWrite', 'concat:jsCouponWrite', 'uglify:jsCouponWrite', 'uglify:tplCouponWrite', 'cssmin:cssCouponWrite', 'clean:cleanCouponWrite', 'processhtml:htmlCouponWrite']);
	grunt.registerTask('cscenterMain', ['ngtemplates:tplcscenterMain', 'concat:jscscenterMain', 'uglify:jscscenterMain', 'uglify:tplcscenterMain', 'cssmin:csscscenterMain', 'clean:cleancscenterMain', 'processhtml:htmlcscenterMain']);
	grunt.registerTask('DepositRefund', ['ngtemplates:tplDepositRefund', 'concat:jsDepositRefund', 'uglify:jsDepositRefund', 'uglify:tplDepositRefund', 'cssmin:cssDepositRefund', 'clean:cleanDepositRefund', 'processhtml:htmlDepositRefund']);
	grunt.registerTask('cscenterFaq', ['ngtemplates:tplcscenterFaq', 'concat:jscscenterFaq', 'uglify:jscscenterFaq', 'uglify:tplcscenterFaq', 'cssmin:csscscenterFaq', 'clean:cleancscenterFaq', 'processhtml:htmlcscenterFaq']);
	grunt.registerTask('cscenterNotice', ['ngtemplates:tplcscenterNotice', 'concat:jscscenterNotice', 'uglify:jscscenterNotice', 'uglify:tplcscenterNotice', 'cssmin:csscscenterNotice', 'clean:cleancscenterNotice', 'processhtml:htmlcscenterNotice']);
	grunt.registerTask('SmartPickSend', ['ngtemplates:tplSmartPickSend', 'concat:jsSmartPickSend', 'uglify:jsSmartPickSend', 'uglify:tplSmartPickSend', 'cssmin:cssSmartPickSend', 'clean:cleanSmartPickSend', 'processhtml:htmlSmartPickSend']);
	grunt.registerTask('SmartPick', ['ngtemplates:tplSmartPick', 'concat:jsSmartPick', 'uglify:jsSmartPick', 'uglify:tplSmartPick', 'cssmin:cssSmartPick', 'clean:cleanSmartPick', 'processhtml:htmlSmartPick']);
	grunt.registerTask('smartpick2016', ['ngtemplates:tplsmartpick2016', 'concat:jssmartpick2016', 'uglify:jssmartpick2016', 'uglify:tplsmartpick2016', 'cssmin:csssmartpick2016', 'clean:cleansmartpick2016', 'processhtml:htmlsmartpick2016']);
	grunt.registerTask('Planshop', ['ngtemplates:tplPlanshop', 'concat:jsPlanshop', 'uglify:jsPlanshop', 'uglify:tplPlanshop', 'cssmin:cssPlanshop', 'clean:cleanPlanshop', 'processhtml:htmlPlanshop']);
	grunt.registerTask('ProtectYouth', ['ngtemplates:tplProtectYouth', 'concat:jsProtectYouth', 'uglify:jsProtectYouth', 'uglify:tplProtectYouth', 'cssmin:cssProtectYouth', 'clean:cleanProtectYouth', 'processhtml:htmlProtectYouth']);
	grunt.registerTask('SmartPickView', ['ngtemplates:tplSmartPickView', 'concat:jsSmartPickView', 'uglify:jsSmartPickView', 'uglify:tplSmartPickView', 'cssmin:cssSmartPickView', 'clean:cleanSmartPickView', 'processhtml:htmlSmartPickView']);
	grunt.registerTask('PointInfo', ['ngtemplates:tplPointInfo', 'concat:jsPointInfo', 'uglify:jsPointInfo', 'uglify:tplPointInfo', 'cssmin:cssPointInfo', 'clean:cleanPointInfo', 'processhtml:htmlPointInfo']);
	grunt.registerTask('CashBill', ['ngtemplates:tplCashBill', 'concat:jsCashBill', 'uglify:jsCashBill', 'uglify:tplCashBill', 'cssmin:cssCashBill', 'clean:cleanCashBill', 'processhtml:htmlCashBill']);
	grunt.registerTask('EventSaunList', ['ngtemplates:tplEventSaunList', 'concat:jsEventSaunList', 'uglify:jsEventSaunList', 'uglify:tplEventSaunList', 'cssmin:cssEventSaunList', 'clean:cleanEventSaunList', 'processhtml:htmlEventSaunList']);
	grunt.registerTask('EventSaunMain', ['ngtemplates:tplEventSaunMain', 'concat:jsEventSaunMain', 'uglify:jsEventSaunMain', 'uglify:tplEventSaunMain', 'cssmin:cssEventSaunMain', 'clean:cleanEventSaunMain', 'processhtml:htmlEventSaunMain']);
	grunt.registerTask('EventInfo', ['ngtemplates:tplEventInfo', 'concat:jsEventInfo', 'uglify:jsEventInfo', 'uglify:tplEventInfo', 'cssmin:cssEventInfo', 'clean:cleanEventInfo', 'processhtml:htmlEventInfo']);
	grunt.registerTask('EventDetail', ['ngtemplates:tplEventDetail', 'concat:jsEventDetail', 'uglify:jsEventDetail', 'uglify:tplEventDetail', 'cssmin:cssEventDetail', 'clean:cleanEventDetail', 'processhtml:htmlEventDetail']);
	grunt.registerTask('EventPlanshop', ['ngtemplates:tplEventPlanshop', 'concat:jsEventPlanshop', 'uglify:jsEventPlanshop', 'uglify:tplEventPlanshop', 'cssmin:cssEventPlanshop', 'clean:cleanEventPlanshop', 'processhtml:htmlEventPlanshop']);
	grunt.registerTask('evtReview', ['ngtemplates:tplevtReview', 'concat:jsevtReview', 'uglify:jsevtReview', 'uglify:tplevtReview', 'cssmin:cssevtReview', 'clean:cleanevtReview', 'processhtml:htmlevtReview']);
	grunt.registerTask('evtTester', ['ngtemplates:tplevtTester', 'concat:jsevtTester', 'uglify:jsevtTester', 'uglify:tplevtTester', 'cssmin:cssevtTester', 'clean:cleanevtTester', 'processhtml:htmlevtTester']);
	grunt.registerTask('mylotteCritView', ['ngtemplates:tplmylotteCritView', 'concat:jsmylotteCritView', 'uglify:jsmylotteCritView', 'uglify:tplmylotteCritView', 'cssmin:cssmylotteCritView', 'clean:cleanmylotteCritView', 'processhtml:htmlmylotteCritView']);
	grunt.registerTask('commentWrite', ['ngtemplates:tplcommentWrite', 'concat:jscommentWrite', 'uglify:jscommentWrite', 'uglify:tplcommentWrite', 'cssmin:csscommentWrite', 'clean:cleancommentWrite', 'processhtml:htmlcommentWrite']);
	grunt.registerTask('commentRewrite', ['ngtemplates:tplcommentRewrite', 'concat:jscommentRewrite', 'uglify:jscommentRewrite', 'uglify:tplcommentRewrite', 'cssmin:csscommentRewrite', 'clean:cleancommentRewrite', 'processhtml:htmlcommentRewrite']);
	grunt.registerTask('smartAlarmList', ['ngtemplates:tplsmartAlarmList', 'concat:jssmartAlarmList', 'uglify:jssmartAlarmList', 'uglify:tplsmartAlarmList', 'cssmin:csssmartAlarmList', 'clean:cleansmartAlarmList', 'processhtml:htmlsmartAlarmList']);
	grunt.registerTask('answer', ['ngtemplates:tplanswer', 'concat:jsanswer', 'uglify:jsanswer', 'uglify:tplanswer', 'cssmin:cssanswer', 'clean:cleananswer', 'processhtml:htmlanswer']);
	grunt.registerTask('answerDetail', ['ngtemplates:tplanswerDetail', 'concat:jsanswerDetail', 'uglify:jsanswerDetail', 'uglify:tplanswerDetail', 'cssmin:cssanswerDetail', 'clean:cleananswerDetail', 'processhtml:htmlanswerDetail']);
	grunt.registerTask('question', ['ngtemplates:tplquestion', 'concat:jsquestion', 'uglify:jsquestion', 'uglify:tplquestion', 'cssmin:cssquestion', 'clean:cleanquestion', 'processhtml:htmlquestion']);
	grunt.registerTask('productQuestWrite', ['ngtemplates:tplproductQuestWrite', 'concat:jsproductQuestWrite', 'uglify:jsproductQuestWrite', 'uglify:tplproductQuestWrite', 'cssmin:cssproductQuestWrite', 'clean:cleanproductQuestWrite', 'processhtml:htmlproductQuestWrite']);
	grunt.registerTask('productQuestWriteGucci', ['ngtemplates:tplproductQuestWriteGucci', 'concat:jsproductQuestWriteGucci', 'uglify:jsproductQuestWriteGucci', 'uglify:tplproductQuestWriteGucci', 'cssmin:cssproductQuestWriteGucci', 'clean:cleanproductQuestWriteGucci', 'processhtml:htmlproductQuestWriteGucci']);
	grunt.registerTask('ProductDetailPopUp', ['ngtemplates:tplProductDetailPopUp', 'concat:jsProductDetailPopUp', 'uglify:jsProductDetailPopUp', 'uglify:tplProductDetailPopUp', 'cssmin:cssProductDetailPopUp', 'clean:cleanProductDetailPopUp', 'processhtml:htmlProductDetailPopUp']);
	grunt.registerTask('couponBook', ['ngtemplates:tplcouponBook', 'concat:jscouponBook', 'uglify:jscouponBook', 'uglify:tplcouponBook', 'cssmin:csscouponBook', 'clean:cleancouponBook', 'processhtml:htmlcouponBook']);
	grunt.registerTask('emailBargainList', ['concat:jsemailBargainList', 'uglify:jsemailBargainList', 'cssmin:cssemailBargainList', 'clean:cleanemailBargainList']);
	grunt.registerTask('emailBargainDetail', ['ngtemplates:tplemailBargainDetail', 'concat:jsemailBargainDetail', 'uglify:jsemailBargainDetail', 'uglify:tplemailBargainDetail', 'cssmin:cssemailBargainDetail', 'clean:cleanemailBargainDetail', 'processhtml:htmlemailBargainDetail']);
	grunt.registerTask('shoppingMail', ['ngtemplates:tplshoppingMail', 'concat:jsshoppingMail', 'uglify:jsshoppingMail', 'uglify:tplshoppingMail', 'cssmin:cssshoppingMail', 'clean:cleanshoppingMail', 'processhtml:htmlshoppingMail']);
	grunt.registerTask('smpCpnRfdList', ['ngtemplates:tplsmpCpnRfdList', 'concat:jssmpCpnRfdList', 'uglify:jssmpCpnRfdList', 'uglify:tplsmpCpnRfdList', 'cssmin:csssmpCpnRfdList', 'clean:cleansmpCpnRfdList', 'processhtml:htmlsmpCpnRfdList']);
	grunt.registerTask('OrderChangeCancelConf', ['ngtemplates:tplOrderChangeCancelConf', 'concat:jsOrderChangeCancelConf', 'uglify:jsOrderChangeCancelConf', 'uglify:tplOrderChangeCancelConf', 'cssmin:cssOrderChangeCancelConf', 'clean:cleanOrderChangeCancelConf', 'processhtml:htmlOrderChangeCancelConf']);
	grunt.registerTask('OrderChangeCancelInfo', ['ngtemplates:tplOrderChangeCancelInfo', 'concat:jsOrderChangeCancelInfo', 'uglify:jsOrderChangeCancelInfo', 'uglify:tplOrderChangeCancelInfo', 'cssmin:cssOrderChangeCancelInfo', 'clean:cleanOrderChangeCancelInfo', 'processhtml:htmlOrderChangeCancelInfo']);
	grunt.registerTask('OrderChangeReg1', ['ngtemplates:tplOrderChangeReg1', 'concat:jsOrderChangeReg1', 'uglify:jsOrderChangeReg1', 'uglify:tplOrderChangeReg1', 'cssmin:cssOrderChangeReg1', 'clean:cleanOrderChangeReg1', 'processhtml:htmlOrderChangeReg1']);
	grunt.registerTask('OrderChangeReg2', ['ngtemplates:tplOrderChangeReg2', 'concat:jsOrderChangeReg2', 'uglify:jsOrderChangeReg2', 'uglify:tplOrderChangeReg2', 'cssmin:cssOrderChangeReg2', 'clean:cleanOrderChangeReg2', 'processhtml:htmlOrderChangeReg2']);
	grunt.registerTask('OrderChangeReg3', ['ngtemplates:tplOrderChangeReg3', 'concat:jsOrderChangeReg3', 'uglify:jsOrderChangeReg3', 'uglify:tplOrderChangeReg3', 'cssmin:cssOrderChangeReg3', 'clean:cleanOrderChangeReg3', 'processhtml:htmlOrderChangeReg3']);
	grunt.registerTask('OrderReturnCancelConf', ['ngtemplates:tplOrderReturnCancelConf', 'concat:jsOrderReturnCancelConf', 'uglify:jsOrderReturnCancelConf', 'uglify:tplOrderReturnCancelConf', 'cssmin:cssOrderReturnCancelConf', 'clean:cleanOrderReturnCancelConf', 'processhtml:htmlOrderReturnCancelConf']);
	grunt.registerTask('OrderReturnCancelInfo', ['ngtemplates:tplOrderReturnCancelInfo', 'concat:jsOrderReturnCancelInfo', 'uglify:jsOrderReturnCancelInfo', 'uglify:tplOrderReturnCancelInfo', 'cssmin:cssOrderReturnCancelInfo', 'clean:cleanOrderReturnCancelInfo', 'processhtml:htmlOrderReturnCancelInfo']);
	grunt.registerTask('OrderReturnReg1', ['ngtemplates:tplOrderReturnReg1', 'concat:jsOrderReturnReg1', 'uglify:jsOrderReturnReg1', 'uglify:tplOrderReturnReg1', 'cssmin:cssOrderReturnReg1', 'clean:cleanOrderReturnReg1', 'processhtml:htmlOrderReturnReg1']);
	grunt.registerTask('OrderReturnReg2', ['ngtemplates:tplOrderReturnReg2', 'concat:jsOrderReturnReg2', 'uglify:jsOrderReturnReg2', 'uglify:tplOrderReturnReg2', 'cssmin:cssOrderReturnReg2', 'clean:cleanOrderReturnReg2', 'processhtml:htmlOrderReturnReg2']);
	grunt.registerTask('OrderReturnReg3', ['ngtemplates:tplOrderReturnReg3', 'concat:jsOrderReturnReg3', 'uglify:jsOrderReturnReg3', 'uglify:tplOrderReturnReg3', 'cssmin:cssOrderReturnReg3', 'clean:cleanOrderReturnReg3', 'processhtml:htmlOrderReturnReg3']);
	grunt.registerTask('OrderComplete', ['ngtemplates:tplOrderComplete', 'concat:jsOrderComplete', 'uglify:jsOrderComplete', 'uglify:tplOrderComplete', 'cssmin:cssOrderComplete', 'clean:cleanOrderComplete', 'processhtml:htmlOrderComplete']);
	grunt.registerTask('OrderCancel', ['ngtemplates:tplOrderCancel', 'concat:jsOrderCancel', 'uglify:jsOrderCancel', 'uglify:tplOrderCancel', 'cssmin:cssOrderCancel', 'clean:cleanOrderCancel', 'processhtml:htmlOrderCancel']);
	grunt.registerTask('smartPay', ['ngtemplates:tplsmartPay', 'concat:jssmartPay', 'uglify:jssmartPay', 'uglify:tplsmartPay', 'cssmin:csssmartPay', 'clean:cleansmartPay', 'processhtml:htmlsmartPay']);
	grunt.registerTask('SelectPresent', ['ngtemplates:tplSelectPresent', 'concat:jsSelectPresent', 'uglify:jsSelectPresent', 'uglify:tplSelectPresent', 'cssmin:cssSelectPresent', 'clean:cleanSelectPresent', 'processhtml:htmlSelectPresent']);
	grunt.registerTask('PurchaseView', ['ngtemplates:tplPurchaseView', 'concat:jsPurchaseView', 'uglify:jsPurchaseView', 'uglify:tplPurchaseView', 'cssmin:cssPurchaseView', 'clean:cleanPurchaseView', 'processhtml:htmlPurchaseView']);
	grunt.registerTask('purchase', ['ngtemplates:tplpurchase', 'concat:jspurchase', 'uglify:jspurchase', 'uglify:tplpurchase', 'cssmin:csspurchase', 'clean:cleanpurchase', 'processhtml:htmlpurchase']);
	grunt.registerTask('OrdMsgSetting', ['ngtemplates:tplOrdMsgSetting', 'concat:jsOrdMsgSetting', 'uglify:jsOrdMsgSetting', 'uglify:tplOrdMsgSetting', 'cssmin:cssOrdMsgSetting', 'clean:cleanOrdMsgSetting', 'processhtml:htmlOrdMsgSetting']);
	grunt.registerTask('gucciFaq', ['ngtemplates:tplgucciFaq', 'concat:jsgucciFaq', 'uglify:jsgucciFaq', 'uglify:tplgucciFaq', 'cssmin:cssgucciFaq', 'clean:cleangucciFaq', 'processhtml:htmlgucciFaq']);
	grunt.registerTask('OrderChangeReturnCancelError', ['concat:jsOrderChangeReturnCancelError', 'uglify:jsOrderChangeReturnCancelError', 'cssmin:cssOrderChangeReturnCancelError', 'clean:cleanOrderChangeReturnCancelError']);
	grunt.registerTask('seed', [ 'concat:jsseed', 'uglify:jsseed', 'cssmin:cssseed', 'clean:cleanseed']);
	grunt.registerTask('ReceiptEvent', ['ngtemplates:tplReceiptEvent', 'concat:jsReceiptEvent', 'uglify:jsReceiptEvent', 'uglify:tplReceiptEvent', 'cssmin:cssReceiptEvent', 'clean:cleanReceiptEvent', 'processhtml:htmlReceiptEvent']);
	grunt.registerTask('appDownKt', ['concat:jsappDownKt', 'uglify:jsappDownKt', 'clean:cleanappDownKt']);
	grunt.registerTask('SktCoupon', ['ngtemplates:tplSktCoupon', 'concat:jsSktCoupon', 'uglify:jsSktCoupon', 'uglify:tplSktCoupon', 'cssmin:cssSktCoupon', 'clean:cleanSktCoupon']);
	grunt.registerTask('receipt', ['concat:jsreceipt', 'uglify:jsreceipt', 'clean:cleanreceipt']);
	grunt.registerTask('prsnMail', ['concat:jsprsnMail', 'uglify:jsprsnMail', 'cssmin:cssprsnMail', 'clean:cleanprsnMail']);
	grunt.registerTask('EventSmartpick', ['concat:jsEventSmartpick', 'uglify:jsEventSmartpick', 'clean:cleanEventSmartpick']);
	grunt.registerTask('appDownPriceDown', ['concat:jsappDownPriceDown', 'uglify:jsappDownPriceDown', 'cssmin:cssappDownPriceDown', 'clean:cleanappDownPriceDown']);
	grunt.registerTask('sktDataFree', ['concat:jssktDataFree', 'uglify:jssktDataFree', 'cssmin:csssktDataFree', 'clean:cleansktDataFree']);
	grunt.registerTask('eventAnycar', ['concat:jseventanycar', 'uglify:jseventanycar', 'cssmin:csseventanycar', 'clean:cleaneventanycar']);
	grunt.registerTask('eventKdbLife', ['concat:jseventkdbLife', 'uglify:jseventkdbLife', 'cssmin:csseventkdbLife', 'clean:cleaneventkdbLife']);
	grunt.registerTask('eventSamsungFire', ['concat:jseventsamsungFire', 'uglify:jseventsamsungFire', 'cssmin:csseventsamsungFire', 'clean:cleaneventsamsungFire']);
	grunt.registerTask('between', ['concat:jsbetween', 'uglify:jsbetween', 'cssmin:cssbetween', 'clean:cleanbetween']);
	grunt.registerTask('dotcomStaffBoard', ['ngtemplates:tpldotcomStaffBoard', 'concat:jsdotcomStaffBoard', 'uglify:jsdotcomStaffBoard', 'uglify:tpldotcomStaffBoard', 'cssmin:cssdotcomStaffBoard', 'clean:cleandotcomStaffBoard', 'processhtml:htmldotcomStaffBoard']);
	grunt.registerTask('dotcomStaffBoardAdmin', ['ngtemplates:tpldotcomStaffBoardAdmin', 'concat:jsdotcomStaffBoardAdmin', 'uglify:jsdotcomStaffBoardAdmin', 'uglify:tpldotcomStaffBoardAdmin', 'cssmin:cssdotcomStaffBoardAdmin', 'clean:cleandotcomStaffBoardAdmin', 'processhtml:htmldotcomStaffBoardAdmin']);
	grunt.registerTask('appDownOcb', ['concat:jsAppDownOcb', 'uglify:jsAppDownOcb', 'cssmin:cssAppDownOcb', 'clean:cleanAppDownOcb']);
	grunt.registerTask('ProductRent', ['ngtemplates:tplProductRent', 'concat:jsProductRent', 'uglify:jsProductRent', 'uglify:tplProductRent', 'cssmin:cssProductRent', 'clean:cleanProductRent', 'processhtml:htmlProductRent']); //렌탈상담신청하기
	grunt.registerTask('StylePush', ['ngtemplates:tplStylePush', 'concat:jsStylePush', 'uglify:jsStylePush', 'uglify:tplStylePush', 'cssmin:cssStylePush', 'clean:cleanStylePush', 'processhtml:htmlStylePush']); //스타일추천
	grunt.registerTask('StyleRecom', ['ngtemplates:tplStyleRecom', 'concat:jsStyleRecom', 'uglify:jsStyleRecom', 'uglify:tplStyleRecom', 'cssmin:cssStyleRecom', 'clean:cleanStyleRecom', 'processhtml:htmlStyleRecom']); //스타일추천
	grunt.registerTask('StyleShop', ['ngtemplates:tplStyleShop', 'concat:jsStyleShop', 'uglify:jsStyleShop', 'uglify:tplStyleShop', 'cssmin:cssStyleShop', 'clean:cleanStyleShop', 'processhtml:htmlStyleShop']); //스타일샵 서브
	grunt.registerTask('StyleShopMen', ['ngtemplates:tplStyleShopMen', 'concat:jsStyleShopMen', 'uglify:jsStyleShopMen', 'uglify:tplStyleShopMen', 'cssmin:cssStyleShopMen', 'clean:cleanStyleShopMen', 'processhtml:htmlStyleShopMen']); //스타일샵맨 서브
	grunt.registerTask('Katalk', ['concat:jsKatalk', 'uglify:jsKatalk','cssmin:cssKatalk', 'processhtml:htmlKatalk', 'clean:cleanKatalk']); //이벤트 - 카톡이벤트
	grunt.registerTask('BigDeal', ['ngtemplates:tplBigDeal', 'concat:jsBigDeal', 'uglify:jsBigDeal', 'uglify:tplBigDeal','cssmin:cssBigDeal', 'processhtml:htmlBigDeal', 'clean:cleanBigDeal']); //이벤트 - 기특한 빅딜이벤트
	grunt.registerTask('SamsungDriver', ['ngtemplates:tplSamsungDriver', 'concat:jsSamsungDriver', 'uglify:jsSamsungDriver', 'uglify:tplSamsungDriver','cssmin:cssSamsungDriver', 'processhtml:htmlSamsungDriver', 'clean:cleanSamsungDriver']); //이벤트 - 기특한 빅딜이벤트
	grunt.registerTask('FourDays', ['ngtemplates:tplFourDays', 'concat:jsFourDays', 'uglify:jsFourDays', 'uglify:tplFourDays','cssmin:cssFourDays', 'processhtml:htmlFourDays', 'clean:cleanFourDays']); //이벤트 - 바로방문 4Days 이벤트
	grunt.registerTask('GiftSaun', ['uglify:jsGiftSaun', 'cssmin:cssGiftSaun', 'processhtml:htmlGiftSaun', 'clean:cleanGiftSaun']); //이벤트 - 설연휴 현물지급 구매사은 이벤트
	grunt.registerTask('RsaleBest', ['ngtemplates:tplRsaleBest', 'concat:jsRsaleBest', 'uglify:jsRsaleBest', 'uglify:tplRsaleBest', 'cssmin:cssRsaleBest', 'clean:cleanRsaleBest', 'processhtml:htmlRsaleBest']); //실시간 맞춤추천
	grunt.registerTask('AppDownStaff', ['ngtemplates:tplAppDownStaff', 'concat:jsAppDownStaff', 'uglify:jsAppDownStaff', 'uglify:tplAppDownStaff','cssmin:cssAppDownStaff', 'processhtml:htmlAppDownStaff', 'clean:cleanAppDownStaff']); //이벤트 - 임직원 신규 앱 설치 이벤트
	grunt.registerTask('Shodoc', ['ngtemplates:tplShodoc', 'concat:jsShodoc', 'uglify:jsShodoc', 'uglify:tplShodoc','cssmin:cssShodoc', 'processhtml:htmlShodoc', 'clean:cleanShodoc']); //이벤트 - KT 쇼닥 이벤트
	grunt.registerTask('subSmartPick', ['ngtemplates:tplsubSmartpick', 'concat:jssubSmartpick', 'uglify:jssubSmartpick', 'uglify:tplsubSmartpick', 'cssmin:csssubSmartpick', 'clean:cleansubSmartpick', 'processhtml:htmlsubSmartpick']); //서브 스마트픽
	grunt.registerTask('tvShopping2016', ['ngtemplates:tpltvShopping2016', 'concat:jstvShopping2016', 'uglify:jstvShopping2016', 'uglify:tpltvShopping2016', 'cssmin:csstvShopping2016', 'clean:cleantvShopping2016', 'processhtml:htmltvShopping2016']); //서브 TV쇼핑
	grunt.registerTask('subRanking', ['ngtemplates:tplsubRanking', 'concat:jssubRanking', 'uglify:jssubRanking', 'uglify:tplsubRanking', 'cssmin:csssubRanking', 'clean:cleansubRanking', 'processhtml:htmlsubRanking']); //서브 랭킹존
	grunt.registerTask('EventComment20th', ['uglify:jsEventComment20th','cssmin:cssEventComment20th', 'processhtml:htmlEventComment20th']); //이벤트 - 20주년 이벤트
	grunt.registerTask('EventCommentHong', ['uglify:jsEventCommentHong','cssmin:cssEventCommentHong', 'processhtml:htmlEventCommentHong']); //이벤트 - 20주년 이벤트 (홍진영이 간단)
	grunt.registerTask('EventPetLove', ['uglify:jsEventPetLove','cssmin:cssEventPetLove', 'processhtml:htmlEventPetLove']); //이벤트 - 애완 기부 사랑의 온도계
	grunt.registerTask('EventYouthSpring', ['uglify:jsEventYouthSpring','cssmin:cssEventYouthSpring', 'processhtml:htmlEventYouthSpring']); //이벤트 - 청년을 봄
	grunt.registerTask('shareEvent', ['ngtemplates:tplshareEvent', 'concat:jsshareEvent', 'uglify:jsshareEvent', 'uglify:tplshareEvent', 'cssmin:cssshareEvent', 'clean:cleanshareEvent', 'processhtml:htmlshareEvent']); //이벤트 - 공유하기 헤더
	grunt.registerTask('EventMeritzCar', ['uglify:jsEventMeritzCar', 'cssmin:cssEventMeritzCar', 'processhtml:htmlEventMeritzCar']);
	grunt.registerTask('PresentList', ['ngtemplates:tplPresentList', 'concat:jsPresentList', 'uglify:jsPresentList', 'uglify:tplPresentList', 'cssmin:cssPresentList', 'clean:cleanPresentList', 'processhtml:htmlPresentList']); //선물하기
	grunt.registerTask('PresentDetail', ['ngtemplates:tplPresentDetail', 'concat:jsPresentDetail', 'uglify:jsPresentDetail', 'uglify:tplPresentDetail', 'cssmin:cssPresentDetail', 'clean:cleanPresentDetail', 'processhtml:htmlPresentDetail']); //선물하기
	grunt.registerTask('PresentComment', ['ngtemplates:tplPresentCommentWrite', 'concat:jsPresentCommentWrite', 'uglify:jsPresentCommentWrite', 'uglify:tplPresentCommentWrite', 'cssmin:cssPresentCommentWrite', 'clean:cleanPresentCommentWrite', 'processhtml:htmlPresentCommentWrite']); //선물하기
    grunt.registerTask('giftcheck', ['ngtemplates:tplgiftcheck', 'concat:jsgiftcheck', 'uglify:jsgiftcheck', 'uglify:tplgiftcheck', 'cssmin:cssgiftcheck', 'clean:cleangiftcheck', 'processhtml:htmlgiftcheck']); //선물확인
	grunt.registerTask('instagramList', ['ngtemplates:tplinstagramList', 'concat:jsinstagramList', 'uglify:jsinstagramList', 'uglify:tplinstagramList', 'cssmin:cssinstagramList', 'clean:cleaninstagramList', 'processhtml:htmlinstagramList']); //디어 팻스타그램
    grunt.registerTask('sslive', ['ngtemplates:tplsslive', 'concat:jssslive', 'uglify:jssslive', 'uglify:tplsslive', 'cssmin:csssslive', 'clean:cleansslive', 'processhtml:htmlsslive']); //생생#
    grunt.registerTask('CvsReturnGuide', ['ngtemplates:tplCvsReturnGuide', 'concat:jsCvsReturnGuide', 'uglify:jsCvsReturnGuide', 'uglify:tplCvsReturnGuide', 'cssmin:cssCvsReturnGuide', 'clean:cleanCvsReturnGuide', 'processhtml:htmlCvsReturnGuide']); //일선 오류
	grunt.registerTask('talk', ['ngtemplates:tpltalk', 'concat:jstalk', 'uglify:jstalk', 'uglify:tpltalk', 'cssmin:csstalk', 'clean:cleantalk', 'processhtml:htmltalk']); //톡상담
	grunt.registerTask('ChanelMain', ['ngtemplates:tplChanelMain', 'concat:jsChanelMain', 'uglify:jsChanelMain', 'uglify:tplChanelMain', 'cssmin:cssChanelMain', 'clean:cleanChanelMain', 'processhtml:htmlChanelMain']); //샤넬관
	grunt.registerTask('ChanelProdList', ['ngtemplates:tplChanelProdList', 'concat:jsChanelProdList', 'uglify:jsChanelProdList', 'uglify:tplChanelProdList', 'cssmin:cssChanelProdList', 'clean:cleanChanelProdList', 'processhtml:htmlChanelProdList']);
    grunt.registerTask('smart_deli_info', ['ngtemplates:tplsmart_deli_info', 'concat:jssmart_deli_info', 'uglify:jssmart_deli_info', 'uglify:tplsmart_deli_info', 'cssmin:csssmart_deli_info', 'clean:cleansmart_deli_info', 'processhtml:htmlsmart_deli_info']); //배송정보확인
	grunt.registerTask('DearpetMain', ['ngtemplates:tplDearpetMain', 'concat:jsDearpetMain', 'uglify:jsDearpetMain', 'uglify:tplDearpetMain', 'cssmin:cssDearpetMain', 'clean:cleanDearpetMain', 'processhtml:htmlDearpetMain']); //디어펫
	grunt.registerTask('DearpetProdList', ['ngtemplates:tplDearpetProdList', 'concat:jsDearpetProdList', 'uglify:jsDearpetProdList', 'uglify:tplDearpetProdList', 'cssmin:cssDearpetProdList', 'clean:cleanDearpetProdList', 'processhtml:htmlDearpetProdList']);
	grunt.registerTask('DearpetGallery', ['ngtemplates:tplDearpetGallery', 'concat:jsDearpetGallery', 'uglify:jsDearpetGallery', 'uglify:tplDearpetGallery', 'cssmin:cssDearpetGallery', 'clean:cleanDearpetGallery', 'processhtml:htmlDearpetGallery']);
	grunt.registerTask('DearpetNews', ['ngtemplates:tplDearpetNewsCtrl', 'concat:jsDearpetNewsCtrl', 'uglify:jsDearpetNewsCtrl', 'uglify:tplDearpetNewsCtrl', 'cssmin:cssDearpetNewsCtrl', 'clean:cleanDearpetNewsCtrl', 'processhtml:htmlDearpetNewsCtrl']);
	grunt.registerTask('SwagWrite', ['ngtemplates:tplSwagWrite', 'concat:jsSwagWrite', 'uglify:jsSwagWrite', 'uglify:tplSwagWrite', 'cssmin:cssSwagWrite', 'clean:cleanSwagWrite', 'processhtml:htmlSwagWrite']);
	grunt.registerTask('SwagRewrite', ['ngtemplates:tplSwagRewrite', 'concat:jsSwagRewrite', 'uglify:jsSwagRewrite', 'uglify:tplSwagRewrite', 'cssmin:cssSwagRewrite', 'clean:cleanSwagRewrite', 'processhtml:htmlSwagRewrite']);
	grunt.registerTask('ExperienceMain', ['ngtemplates:tplExperienceMain', 'concat:jsExperienceMain', 'uglify:jsExperienceMain', 'uglify:tplExperienceMain', 'cssmin:cssExperienceMain', 'clean:cleanExperienceMain', 'processhtml:htmlExperienceMain']); //유아동체험단
	grunt.registerTask('ExperienceWrite', ['ngtemplates:tplExperienceWrite', 'concat:jsExperienceWrite', 'uglify:jsExperienceWrite', 'uglify:tplExperienceWrite', 'cssmin:cssExperienceWrite', 'clean:cleanExperienceWrite', 'processhtml:htmlExperienceWrite']); //유아동체험단
	grunt.registerTask('ExperienceView', ['ngtemplates:tplExperienceView', 'concat:jsExperienceView', 'uglify:jsExperienceView', 'uglify:tplExperienceView', 'cssmin:cssExperienceView', 'clean:cleanExperienceView', 'processhtml:htmlExperienceView']); //유아동체험단
	grunt.registerTask('ExperienceWinnerList', ['ngtemplates:tplExperienceWinnerList', 'concat:jsExperienceWinnerList', 'uglify:jsExperienceWinnerList', 'uglify:tplExperienceWinnerList', 'cssmin:cssExperienceWinnerList', 'clean:cleanExperienceWinnerList', 'processhtml:htmlExperienceWinnerList']); //유아동체험단
	grunt.registerTask('KidscommentWrite', ['ngtemplates:tplKidscommentWrite', 'concat:jsKidscommentWrite', 'uglify:jsKidscommentWrite', 'uglify:tplKidscommentWrite', 'cssmin:cssKidscommentWrite', 'clean:cleanKidscommentWrite', 'processhtml:htmlKidscommentWrite']); //유아동체험단
	grunt.registerTask('photoreview', ['ngtemplates:tplphotoreview', 'concat:jsphotoreview', 'uglify:jsphotoreview', 'uglify:tplphotoreview', 'cssmin:cssphotoreview', 'clean:cleanphotoreview', 'processhtml:htmlphotoreview']); //고객등록사진
    grunt.registerTask('infantMain', ['ngtemplates:tplbaby_main', 'concat:jsbaby_main', 'uglify:jsbaby_main', 'uglify:tplbaby_main', 'cssmin:cssbaby_main', 'clean:cleanbaby_main', 'processhtml:htmlbaby_main']); //육아매장
    grunt.registerTask('infantSwagWrite', ['ngtemplates:tplbabySwagWrite', 'concat:jsbabySwagWrite', 'uglify:jsbabySwagWrite', 'uglify:tplbabySwagWrite', 'cssmin:cssbabySwagWrite', 'clean:cleanbabySwagWrite', 'processhtml:htmlbabySwagWrite']); //육아매장-육아팀작성
    grunt.registerTask('infantSwagRewrite', ['ngtemplates:tplbabySwagRewrite', 'concat:jsbabySwagRewrite', 'uglify:jsbabySwagRewrite', 'uglify:tplbabySwagRewrite', 'cssmin:cssbabySwagRewrite', 'clean:cleanbabySwagRewrite', 'processhtml:htmlbabySwagRewrite']); //육아매장-육아팁수정
	grunt.registerTask('WishRecom', ['ngtemplates:tplWishRecom', 'concat:jsWishRecom', 'uglify:jsWishRecom', 'uglify:tplWishRecom', 'cssmin:cssWishRecom', 'clean:cleanWishRecom', 'processhtml:htmlWishRecom']); //위시 추천상품페이지
	grunt.registerTask('BrandSearch', ['ngtemplates:tplBrandSearch', 'concat:jsBrandSearch', 'uglify:jsBrandSearch', 'uglify:tplBrandSearch', 'cssmin:cssBrandSearch', 'clean:cleanBrandSearch', 'processhtml:htmlBrandSearch']);
	grunt.registerTask('customSearchPage', ['ngtemplates:tplcustomSearchPage', 'concat:jscustomSearchPage', 'uglify:jscustomSearchPage', 'uglify:tplcustomSearchPage', 'cssmin:csscustomSearchPage', 'clean:cleancustomSearchPage', 'processhtml:htmlcustomSearchPage']); //맞춤설정페이지
	grunt.registerTask('StyleShopMain', ['ngtemplates:tplStyleShopMain', 'concat:jsStyleShopMain', 'uglify:jsStyleShopMain', 'uglify:tplStyleShopMain', 'cssmin:cssStyleShopMain', 'clean:cleanStyleShopMain', 'processhtml:htmlStyleShopMain']); //스타일샵 메인 ( 20170512 likearts )
	grunt.registerTask('BestBrandMain', ['ngtemplates:tplBestBrandMain', 'concat:jsBestBrandMain', 'uglify:jsBestBrandMain', 'uglify:tplBestBrandMain', 'cssmin:cssBestBrandMain', 'clean:cleanBestBrandMain', 'processhtml:htmlBestBrandMain']); //베스트브랜드몰
	grunt.registerTask('BestBrandSub', ['ngtemplates:tplBestBrandSub', 'concat:jsBestBrandSub', 'uglify:jsBestBrandSub', 'uglify:tplBestBrandSub', 'cssmin:cssBestBrandSub', 'clean:cleanBestBrandSub', 'processhtml:htmlBestBrandSub']); //베스트브랜드몰
	grunt.registerTask('TalkRecom', ['ngtemplates:tplTalkRecom', 'concat:jsTalkRecom', 'uglify:jsTalkRecom', 'uglify:tplTalkRecom', 'cssmin:cssTalkRecom', 'clean:cleanTalkRecom', 'processhtml:htmlTalkRecom']);//스마트톡 추천 자동화
	grunt.registerTask('TalkShopping', ['ngtemplates:tplTalkShopping', 'concat:jsTalkShopping', 'uglify:jsTalkShopping', 'uglify:tplTalkShopping', 'cssmin:cssTalkShopping', 'clean:cleanTalkShopping', 'processhtml:htmlTalkShopping']);
	grunt.registerTask('TalkShopDelPay', ['concat:jsTalkShopDelPay', 'uglify:jsTalkShopDelPay', 'cssmin:cssTalkShopDelPay', 'clean:cleanTalkShopDelPay']);
	grunt.registerTask('TalkShopOrder', ['concat:jsTalkShopOrder', 'uglify:jsTalkShopOrder', 'clean:cleanTalkShopOrder']);
	grunt.registerTask('orderSingle', ['concat:jsorderSingle', 'uglify:jsorderSingle', 'cssmin:cssorderSingle', 'clean:cleanorderSingle', 'processhtml:htmlorderSingle']);
	grunt.registerTask('DearpetPetWrite', ['ngtemplates:tplDearpetPetWrite', 'concat:jsDearpetPetWrite', 'uglify:jsDearpetPetWrite', 'uglify:tplDearpetPetWrite', 'cssmin:cssDearpetPetWrite', 'clean:cleanDearpetPetWrite', 'processhtml:htmlDearpetPetWrite']);//디어펫 펫등록 ( 201706 )
	grunt.registerTask('ProductView', ['ngtemplates:tplProductView', 'concat:jsProductView', 'uglify:jsProductView', 'uglify:tplProductView', 'cssmin:cssProductView', 'clean:cleanProductView', 'processhtml:htmlProductView']);
	grunt.registerTask('ProductBenefitCompare', ['ngtemplates:tplProductBenefitCompare', 'concat:jsProductBenefitCompare', 'uglify:jsProductBenefitCompare', 'uglify:tplProductBenefitCompare', 'cssmin:cssProductBenefitCompare', 'clean:cleanProductBenefitCompare', 'processhtml:htmlProductBenefitCompare']);
	grunt.registerTask('ProductCollectBenefits', ['ngtemplates:tplProductCollectBenefits', 'concat:jsProductCollectBenefits', 'uglify:jsProductCollectBenefits', 'uglify:tplProductCollectBenefits', 'cssmin:cssProductCollectBenefits', 'clean:cleanProductCollectBenefits', 'processhtml:htmlProductCollectBenefits']);
	grunt.registerTask('ProductComment', ['ngtemplates:tplProductComment', 'concat:jsProductComment', 'uglify:jsProductComment', 'uglify:tplProductComment', 'cssmin:cssProductComment', 'clean:cleanProductComment', 'processhtml:htmlProductComment']);
	grunt.registerTask('ProductCommentDetail', ['ngtemplates:tplProductCommentDetail', 'concat:jsProductCommentDetail', 'uglify:jsProductCommentDetail', 'uglify:tplProductCommentDetail', 'cssmin:cssProductCommentDetail', 'clean:cleanProductCommentDetail', 'processhtml:htmlProductCommentDetail']);
	grunt.registerTask('ProductExtInfo', ['ngtemplates:tplProductExtInfo', 'concat:jsProductExtInfo', 'uglify:jsProductExtInfo', 'uglify:tplProductExtInfo', 'cssmin:cssProductExtInfo', 'clean:cleanProductExtInfo', 'processhtml:htmlProductExtInfo']);
	grunt.registerTask('ProductImageView', ['ngtemplates:tplProductImageView', 'concat:jsProductImageView', 'uglify:jsProductImageView', 'uglify:tplProductImageView', 'cssmin:cssProductImageView', 'clean:cleanProductImageView', 'processhtml:htmlProductImageView']);
	grunt.registerTask('ProductQna', ['ngtemplates:tplProductQna', 'concat:jsProductQna', 'uglify:jsProductQna', 'uglify:tplProductQna', 'cssmin:cssProductQna', 'clean:cleanProductQna', 'processhtml:htmlProductQna']);
	grunt.registerTask('ProductReqInfo', ['ngtemplates:tplProductReqInfo', 'concat:jsProductReqInfo', 'uglify:jsProductReqInfo', 'uglify:tplProductReqInfo', 'cssmin:cssProductReqInfo', 'clean:cleanProductReqInfo', 'processhtml:htmlProductReqInfo']);
	grunt.registerTask('productMdNoticeWebview', ['uglify:jsproductMdNoticeWebview', 'cssmin:cssproductMdNoticeWebview', 'processhtml:htmlproductMdNoticeWebview']);
	grunt.registerTask('productDetailInfoWebview', ['uglify:jsproductDetailInfoWebview', 'cssmin:cssproductDetailInfoWebview', 'processhtml:htmlproductDetailInfoWebview']);
	grunt.registerTask('productPlanDetailInfoTopWebview', ['uglify:jsproductPlanDetailInfoTopWebview', 'cssmin:cssproductPlanDetailInfoTopWebview', 'processhtml:htmlproductPlanDetailInfoTopWebview']);
	grunt.registerTask('productPlanDetailInfoBottomWebview', ['uglify:jsproductPlanDetailInfoBottomWebview', 'cssmin:cssproductPlanDetailInfoBottomWebview', 'processhtml:htmlproductPlanDetailInfoBottomWebview']);
	grunt.registerTask('lpayWebMng', ['ngtemplates:tpllpayWebMng', 'concat:jslpayWebMng', 'uglify:jslpayWebMng', 'uglify:tpllpayWebMng', 'clean:cleanlpayWebMng', 'processhtml:htmllpayWebMng']);
	grunt.registerTask('movieStore', ['ngtemplates:tplmovieStore', 'concat:jsmovieStore', 'uglify:jsmovieStore', 'uglify:tplmovieStore', 'cssmin:cssmovieStore', 'clean:cleanmovieStore', 'processhtml:htmlmovieStore']);
	grunt.registerTask('movieReview', ['ngtemplates:tplmovieReview', 'concat:jsmovieReview', 'uglify:jsmovieReview', 'uglify:tplmovieReview', 'cssmin:cssmovieReview', 'clean:cleanmovieReview', 'processhtml:htmlmovieReview']);
	grunt.registerTask('cartPush', ['ngtemplates:tplcartPush', 'concat:jscartPush', 'uglify:jscartPush', 'uglify:tplcartPush', 'cssmin:csscartPush', 'clean:cleancartPush', 'processhtml:htmlcartPush']);
    grunt.registerTask('MitouStoryDetail', ['ngtemplates:tplMitouStoryDetail', 'concat:jsMitouStoryDetail', 'uglify:jsMitouStoryDetail', 'uglify:tplMitouStoryDetail', 'cssmin:cssMitouStoryDetail', 'clean:cleanMitouStoryDetail', 'processhtml:htmlMitouStoryDetail']);//디어펫스토리상세
    grunt.registerTask('MitouStory', ['ngtemplates:tplMitouStory', 'concat:jsMitouStory', 'uglify:jsMitouStory', 'uglify:tplMitouStory', 'cssmin:cssMitouStory', 'clean:cleanMitouStory', 'processhtml:htmlMitouStory']);//디어펫스토리
    grunt.registerTask('MitouAdvice', ['ngtemplates:tplMitouAdvice', 'concat:jsMitouAdvice', 'uglify:jsMitouAdvice', 'uglify:tplMitouAdvice', 'cssmin:cssMitouAdvice', 'clean:cleanMitouAdvice', 'processhtml:htmlMitouAdvice']);//디어펫 수의사
	grunt.registerTask('bestSamsungMain', ['ngtemplates:tplbestSamsungMain', 'concat:jsbestSamsungMain', 'uglify:jsbestSamsungMain', 'uglify:tplbestSamsungMain', 'cssmin:cssbestSamsungMain', 'clean:cleanbestSamsungMain', 'processhtml:htmlbestSamsungMain']);
	grunt.registerTask('bestSamsungSub', ['ngtemplates:tplbestSamsungSub', 'concat:jsbestSamsungSub', 'uglify:jsbestSamsungSub', 'uglify:tplbestSamsungSub', 'cssmin:cssbestSamsungSub', 'clean:cleanbestSamsungSub', 'processhtml:htmlbestSamsungSub']);
	grunt.registerTask('MyFeed', ['ngtemplates:tplMyFeed', 'concat:jsMyFeed', 'uglify:jsMyFeed', 'uglify:tplMyFeed', 'cssmin:cssMyFeed', 'clean:cleanMyFeed', 'processhtml:htmlMyFeed']); //나의 추천 피드
	grunt.registerTask('OftenBuy', ['ngtemplates:tplOftenBuy', 'concat:jsOftenBuy', 'uglify:jsOftenBuy', 'uglify:tplOftenBuy', 'cssmin:cssOftenBuy', 'clean:cleanOftenBuy', 'processhtml:htmlOftenBuy']); //자주 구매한 상품
	grunt.registerTask('ReOrder', ['ngtemplates:tplReOrder', 'concat:jsReOrder', 'uglify:jsReOrder', 'uglify:tplReOrder', 'cssmin:cssReOrder', 'clean:cleanReOrder', 'processhtml:htmlReOrder']); //취소 재구매
    grunt.registerTask('largeOrder', ['ngtemplates:tpllargeOrder', 'concat:jslargeOrder', 'uglify:jslargeOrder', 'uglify:tpllargeOrder', 'cssmin:csslargeOrder', 'clean:cleanlargeOrder', 'processhtml:htmllargeOrder']); //설 대량주문    
    grunt.registerTask('SpecMallDetail', ['ngtemplates:tplSpecMallDetail', 'concat:jsSpecMallDetail', 'uglify:jsSpecMallDetail', 'uglify:tplSpecMallDetail', 'cssmin:cssSpecMallDetail', 'clean:cleanSpecMallDetail', 'processhtml:htmlSpecMallDetail']); //전문몰 핀터레스트 상세
    grunt.registerTask('SpecMallDetailProduct', ['ngtemplates:tplSpecMallDetailProduct', 'concat:jsSpecMallDetailProduct', 'uglify:jsSpecMallDetailProduct', 'uglify:tplSpecMallDetailProduct', 'cssmin:cssSpecMallDetailProduct', 'clean:cleanSpecMallDetailProduct', 'processhtml:htmlSpecMallDetailProduct']); //전문몰 핀터레스트 연관상품
	grunt.registerTask('voiceOrder', ['ngtemplates:tplvoiceOrder', 'concat:jsvoiceOrder', 'uglify:jsvoiceOrder', 'uglify:tplvoiceOrder', 'cssmin:cssvoiceOrder', 'clean:cleanvoiceOrder', 'processhtml:htmlvoiceOrder']);//음성주문소개 		
	grunt.registerTask('searchPlanShopList', ['ngtemplates:tplsearchPlanShopList', 'concat:jssearchPlanShopList', 'uglify:jssearchPlanShopList', 'uglify:tplsearchPlanShopList', 'cssmin:csssearchPlanShopList', 'clean:cleansearchPlanShopList', 'processhtml:htmlsearchPlanShopList']); //검색/탐색 기획전형
	grunt.registerTask('VoiceCommerce', ['ngtemplates:tplVoiceCommerce', 'concat:jsVoiceCommerce', 'uglify:jsVoiceCommerce', 'uglify:tplVoiceCommerce', 'cssmin:cssVoiceCommerce', 'clean:cleanVoiceCommerce', 'processhtml:htmlVoiceCommerce']); //보이스 커머스 (안녕샬롯)
    grunt.registerTask('UsedMain', ['ngtemplates:tplusedMain', 'concat:jsusedMain', 'uglify:jsusedMain', 'uglify:tplusedMain', 'cssmin:cssusedMain', 'clean:cleanusedMain', 'processhtml:htmlusedMain']); //중고라운지 메인
    grunt.registerTask('UsedWrite', ['ngtemplates:tplusedWrite', 'concat:jsusedWrite', 'uglify:jsusedWrite', 'uglify:tplusedWrite', 'cssmin:cssusedWrite', 'clean:cleanusedWrite', 'processhtml:htmlusedWrite']); //중고라운지 쓰기
    grunt.registerTask('UsedInfo', ['ngtemplates:tplUsedInfo', 'concat:jsUsedInfo', 'uglify:jsUsedInfo', 'uglify:tplUsedInfo', 'cssmin:cssUsedInfo', 'clean:cleanUsedInfo', 'processhtml:htmlUsedInfo']); //중고라운지 계정안내
	grunt.registerTask('ProductCommentImage', ['ngtemplates:tplProductCommentImage', 'concat:jsProductCommentImage', 'uglify:jsProductCommentImage', 'uglify:tplProductCommentImage', 'cssmin:cssProductCommentImage', 'clean:cleanProductCommentImage', 'processhtml:htmlProductCommentImage']); //상품평
	grunt.registerTask('ProductCommentEach', ['ngtemplates:tplProductCommentEach', 'concat:jsProductCommentEach', 'uglify:jsProductCommentEach', 'uglify:tplProductCommentEach', 'cssmin:cssProductCommentEach', 'clean:cleanProductCommentEach', 'processhtml:htmlProductCommentEach']); //상품평
	grunt.registerTask('burberryMain', ['ngtemplates:tplburberryMain', 'concat:jsburberryMain', 'uglify:jsburberryMain', 'uglify:tplburberryMain', 'cssmin:cssburberryMain', 'clean:cleanburberryMain', 'processhtml:htmlburberryMain']);//버버리 메인
	grunt.registerTask('burberryProdList', ['ngtemplates:tplburberryProdList', 'concat:jsburberryProdList', 'uglify:jsburberryProdList', 'uglify:tplburberryProdList', 'cssmin:cssburberryProdList', 'clean:cleanburberryProdList', 'processhtml:htmlburberryProdList']);//버버리 상품 리스트
	grunt.registerTask('burberryCscenter', ['ngtemplates:tplburberryCscenter', 'concat:jsburberryCscenter', 'uglify:jsburberryCscenter', 'uglify:tplburberryCscenter', 'cssmin:cssburberryCscenter', 'clean:cleanburberryCscenter', 'processhtml:htmlburberryCscenter']);//버버리 CS센터
	grunt.registerTask('ProductViewBurberry', ['ngtemplates:tplProductViewBurberry', 'concat:jsProductViewBurberry', 'uglify:jsProductViewBurberry', 'uglify:tplProductViewBurberry', 'cssmin:cssProductViewBurberry', 'clean:cleanProductViewBurberry', 'processhtml:htmlProductViewBurberry']);//버버리 상품상세

	grunt.registerTask('orderSimple', ['concat:jsorderSimple', 'uglify:jsorderSimple', 'cssmin:cssorderSimple', 'clean:cleanorderSimple', 'processhtml:htmlorderSimple']); //간편 주문서
	grunt.registerTask('orderSimpleComplete', ['concat:jsorderSimpleComplete', 'uglify:jsorderSimpleComplete',  'cssmin:cssorderSimpleComplete', 'clean:cleanorderSimpleComplete', 'processhtml:htmlorderSimpleComplete']); //간편 주문서 완료
    /*미미뚜뚜 브랜드BEST*/
    grunt.registerTask('dearpetBrdBest', ['ngtemplates:tpldearpetBrdBest', 'concat:jsdearpetBrdBest', 'uglify:jsdearpetBrdBest', 'uglify:tpldearpetBrdBest', 'cssmin:cssdearpetBrdBest', 'clean:cleandearpetBrdBest', 'processhtml:htmldearpetBrdBest']);
	grunt.registerTask('ProfileWrite', ['ngtemplates:tplProfileWrite', 'concat:jsProfileWrite', 'uglify:jsProfileWrite', 'uglify:tplProfileWrite', 'cssmin:cssProfileWrite', 'clean:cleanProfileWrite', 'processhtml:htmlProfileWrite']); // 프로필 수정
	grunt.registerTask('ReviewBest', ['ngtemplates:tplReviewBest', 'concat:jsReviewBest', 'uglify:jsReviewBest', 'uglify:tplReviewBest', 'cssmin:cssReviewBest', 'clean:cleanReviewBest', 'processhtml:htmlReviewBest']); // 베스트 상품평
	grunt.registerTask('ReviewFavorite', ['ngtemplates:tplReviewFavorite', 'concat:jsReviewFavorite', 'uglify:jsReviewFavorite', 'uglify:tplReviewFavorite', 'cssmin:cssReviewFavorite', 'clean:cleanReviewFavorite', 'processhtml:htmlReviewFavorite']); // 즐겨찾는 리뷰어
	grunt.registerTask('ReviewerHome', ['ngtemplates:tplReviewerHome', 'concat:jsReviewerHome', 'uglify:jsReviewerHome', 'uglify:tplReviewerHome', 'cssmin:cssReviewerHome', 'clean:cleanReviewerHome', 'processhtml:htmlReviewerHome']); // 리뷰어 홈
	grunt.registerTask('ssoDropGate', ['ngtemplates:tplssoDropGate', 'concat:jsssoDropGate', 'uglify:jsssoDropGate', 'uglify:tplssoDropGate', 'cssmin:cssssoDropGate', 'clean:cleanssoDropGate', 'processhtml:htmlssoDropGate']);

	/*쿠폰존 20181115*/
	grunt.registerTask('couponzone', ['ngtemplates:tplcouponzone', 'concat:jscouponzone', 'uglify:jscouponzone', 'uglify:tplcouponzone', 'cssmin:csscouponzone', 'clean:cleancouponzone', 'processhtml:htmlcouponzone']);
	grunt.registerTask('CoachBrand', ['ngtemplates:tplCoachBrand', 'concat:jsCoachBrand', 'uglify:jsCoachBrand', 'uglify:tplCoachBrand', 'cssmin:cssCoachBrand', 'clean:cleanCoachBrand', 'processhtml:htmlCoachBrand']);//COACH 전문몰
	grunt.registerTask('LongChamp', ['ngtemplates:tplLongChamp', 'concat:jsLongChamp', 'uglify:jsLongChamp', 'uglify:tplLongChamp', 'cssmin:cssLongChamp', 'clean:cleanLongChamp', 'processhtml:htmlLongChamp']);//롱샴 전문몰
};
