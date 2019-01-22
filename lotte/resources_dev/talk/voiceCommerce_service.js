(function(window, angular, undefined) {
	'use strict';

    var VCServiceModule = angular.module('voiceCommerceService', [
        'lotteUrl', 
        'lotteUtil'
    ]);

    // 보이스 커머스 기본 정보 연동 처리 (햄버거 정보표시, 발화가이드 포함)
    VCServiceModule.service('VCBasicInfo', ['$http', '$q', 'LotteCommon', 'LotteStorage', 
    function ($http, $q, LotteCommon, LotteStorage) {
        // console.log("VCBasicInfo service");
        var self = this;

        // 데이터 형태를 보기 위한 구조체 생성
        var basicInfo = null;

        // 의미분석 히스토리 저장 구조체 생성
        var SEMANTIC_HISTORY_STORAGE_NAME = "vsSemanticKeywordHome";
        self.semanticHistory = [];

        var LAST_INPUTMODE_STORAGE_NAME = "vsInputType";
        self.lastInputMode = "";
        

        /**
         * 보이스 커머스 인입 시 기본 정보 세팅을 위한 구조체 초기화
         */
        self.initBasicInfo = function () {
            self.basicInfo = {
                member_info: { // 회원 결제, 배송지 설정 정보
                    prior_info_chk: false, // 사전정보 (배송지, 결제수단 모두 등록되어 있으면 true, 하나라도 등록 안되어 있으면 false)
                    base_op_pay_chk: false, // 결제 정보 유무
                    et_mbr_dlvp_chk: false, // 배송지 정보 유무
                    card_pay_meth_cd: "", // 카드 결제방식 코드
                    caer_pay_meth_nm: "", // 카드 결제방식 명
                    bnk_cd: "", // 은행코드
                    pay_mean_cd: "", // 결제수단코드
                    pay_mean_nm: "", // 결제수단명
                    acqr_cd: "", // 매입사코드
                    pay_nm: "", // 매입사명
                    dlvp_nm: "", // 배송지명
                    post_no: "", // 우편번호
                    post_addr: "", // 주소
                    dtl_addr: "", // 상세주소
                    rmit_nm: "", // 수취인명
                    cell_txno_no: "", // 휴대폰국번번호
                    cell_sct_no: "", // 휴대폰 구분번호
                    cell_end_no: "", // 휴대폰 끝 번호
                    morc_man_nm: "", // 입금자명
                    cbl_tel_rgn_no: "", // 유선전화 지역번호
                    cbl_tel_txno_no: "", // 유선전화 국번번호
                    cbl_tel_end_no: "", // 유선전화 끝번호
                    addr_choc_sct_cd: "", // 주소선택 구분코드
                    member_no: "", // 회원번호
                    pr_dlvp_chane_chk: "", // 선배송지 변경 유무
                    onlCno: "", // 사용자 번호
                    pay_card_rcgn_id: "" // 결제카드 식별 아이디
                },
                greeting_info: { // 고객명, 고객 인사말 운영 코너 정보
                    user_nm: "", // 고객명
                    greeting_img_url: "", // 인사말 이미지 URL
                    greeting_txt: "" // 인사말 텍스트
                },
                samada_list: { // 사만다 발화(음성) 목록 정보
                    items: [{
                        list_cate: "", // 세트명
                        list_cate_bg: "", // 세트 BG컬러
                        conts_list: {
                            items: [
                            /*
                            {
                                list_txt: "", // 세트하위 텍스트
                                list_url: "" // 테스트 배너 링크
                            }
                            */
                            ],
                            total_count: 0 // 항목건수
                        }
                    }],
                    total_count: 0 // 항목 건수
                },
                my_pet_info: { // 미미뚜뚜 정보
                    bbc_no: "", // 회원반려동물등록일련번호
                    bbc_nm: "", // 반려동물이름
                    worry_yn: "", // 반려동물 고민여부
                    bbc_cnt: "" // 반려동물등록된 총건수
                },
            };

            return self.basicInfo;
        };
        
        self.initBasicInfo(); // 보이스 커머스 인입 시 기본 정보 세팅을 위한 구조체 초기화

        // 기본 정보 얻어오기 promise
        self.getBasicInfo = function (mbrNo) {
            var deferred = $q.defer();
            var paramsObj = {};

            if (mbrNo) {
                paramsObj.mbr_no = mbrNo;
            }

            $http({
                url: LotteCommon.vcInfoData,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공
                    if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                        var basicInfo = response.data.data ? response.data.data : null;
                        if (basicInfo) {
                            self.basicInfo = basicInfo;
                            deferred.resolve(self.basicInfo);
                        } else {
                            deferred.reject(self.basicInfo);
                        }
                    } else {
                        console.error("보이스 커머스 기본 정보 로드 오류");
                        self.basicInfo = self.initBasicInfo();
                        deferred.reject(self.basicInfo);
                    }
                },
                function (response) { // 실패
                    console.error("보이스 커머스 기본 정보 로드 실패");
                    self.basicInfo = self.initBasicInfo();
                    deferred.reject(self.basicInfo);
                }
            );

            return deferred.promise;
        };

        // 햄버거 옆 말풍선 데이터 가져오기
        self.getEvtTxt = function () {
            var deferred = $q.defer();
            var paramsObj = {};

            $http({
                url: LotteCommon.vcHelpInfoData,
                method: "get",
                params: {
                    conr_no: "75355"
                }
            })
            .then(
                function (response) { // 성공
                    if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                        var helpInfo = response.data.data ? response.data.data : null;

                        if (helpInfo && helpInfo.help_info_list && helpInfo.help_info_list[0] && helpInfo.help_info_list[0].banner_nm) {
                            deferred.resolve(helpInfo.help_info_list[0].banner_nm);
                        } else {
                            deferred.reject([]);
                        }
                    } else {
                        console.error("햄버거옆 이벤트 정보 데이터 오류");
                        deferred.reject([]);
                    }
                },
                function (response) { // 실패
                    console.error("햄버거옆 이벤트 정보 데이터 오류");
                    deferred.reject([]);
                }
            );

            return deferred.promise;
        };
        
        
        // BG 데코 데이터 가져오기
        self.getBgDeco = function () {
        	var deferred = $q.defer();
        	var paramsObj = {};
        	
        	$http({
        		url: LotteCommon.vcHelpInfoData,
        		method: "get",
        		params: {
        			conr_no: "75059"
        		}
        	})
        	.then(
        			function (response) { // 성공
        				if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
        					var helpInfo = response.data.data ? response.data.data : null;
        					
        					if (helpInfo && helpInfo.help_info_list && helpInfo.help_info_list[0] && helpInfo.help_info_list[0].img_url) {
        						deferred.resolve(helpInfo.help_info_list[0].img_url);
        					} else {
        						deferred.reject("");
        					}
        				} else {
        					deferred.reject("");
        				}
        			},
        			function (response) { // 실패
        				deferred.reject("");
        			}
        	);
        	
        	return deferred.promise;
        };

        // LocalStorage에 저장된 semanticHistory 얻기
        function findSemanticHistory() {
            self.semanticHistory = [];
            
            // Local Storage 저장 구조 : [{ keyword: '', date: timestamp }]
            var storageSemanticKeyword = LotteStorage.getLocalStorage(SEMANTIC_HISTORY_STORAGE_NAME, "json");

            if (storageSemanticKeyword && storageSemanticKeyword.length > 0) {
                var i = 0;

                for (i = 0; i < storageSemanticKeyword.length; i++) {
                    if (storageSemanticKeyword[i].keyword && storageSemanticKeyword[i].date) {
                        self.semanticHistory.push({
                            keyword: storageSemanticKeyword[i].keyword,
                            date: storageSemanticKeyword[i].date
                        });
                    }
                }
            }
        };

        findSemanticHistory(); // 실행 시 LocalStorage 히스토리 얻기
        
        /**
         * 의미분석했던 히스토리 얻어오기
         */
        self.getSemanticeHistory = function () {
            return self.semanticHistory;
        };

        var SemanticeHistorySaveCnt = 10; // 히스토리 저장 개수

        /**
         * 의미분석 전송 시 History 저장
         * @param txt 의미분석에 전송되는 텍스트 (히스토리에 저장할 텍스트 값)
         */
        self.saveSemanticHistory = function (txt) {
            var now = new Date();
            if (self.semanticHistory) {
            	
            	var len = self.semanticHistory.length;
            	for(var i=0; i<len; i++){
            		if(txt == self.semanticHistory[i].keyword){
            			self.semanticHistory.splice(i, 1);
            			break;
            		}
            	}
            	
                self.semanticHistory.unshift({ // 배열 첫번째 밀어넣기
                    keyword: txt, 
                    date: now.getTime()
                });

                if (self.semanticHistory.length > SemanticeHistorySaveCnt) {
                    self.semanticHistory = self.semanticHistory.slice(0, SemanticeHistorySaveCnt);
                }
            } else {
                self.semanticHistory = [{
                    keyword: txt, 
                    date: now.getTime() // timeStamp 형태로 저장
                }];
            }

            LotteStorage.setLocalStorage(SEMANTIC_HISTORY_STORAGE_NAME, self.semanticHistory, "json");
        };

        // LocalStorage에 저장된 마지막 input mode 얻기
        function findLastInputMode() {
            var lastInputMode = LotteStorage.getLocalStorage(LAST_INPUTMODE_STORAGE_NAME);

            if (lastInputMode) {
                self.lastInputMode = lastInputMode;
            } else {
                self.lastInputMode = "";
            }
        }

        findLastInputMode(); // LocalStorage에 저장된 마지막 input mode 얻기

        // 마지막 Input Type Local Storage 가져오기
        self.getInputMode = function () {
            return self.lastInputMode;
        };

        // 마지막 InputMode Local Storage 저장
        self.saveInputMode = function (type) {
            if (type == "mic" || type == "keyboard") {
                LotteStorage.setLocalStorage(LAST_INPUTMODE_STORAGE_NAME, type);
            }
        };
    }]);

    // 보이스 커머스 발화 가이드(인기키워드 포함) 정보 연동 처리
    VCServiceModule.service('VCStartVoiceInfo', ['$http', '$q', 'LotteCommon', '$window',
    function ($http, $q, LotteCommon,$window) {
        var self = this;

        // 인기검색어 데이터 (srhBestData)
        // self.bestKeyword = [];
        // self.getBestKeyword = function () {
        //     var deferred = $q.defer();

        //     $http({
        //         url: LotteCommon.srhBestData,
        //         method: "get",
        //         params: {
        //             reqType: "N",
        //             reqKind: "C"
        //         }
        //     })
        //     .then(
        //         function (response) { // 성공
        //             var bestKeyword = response.data.searchPopList ? response.data.searchPopList : null;

        //             if (bestKeyword && bestKeyword.result_best && bestKeyword.result_best.items) {
        //                 self.bestKeyword = bestKeyword.result_best.items;
        //                 deferred.resolve(self.bestKeyword);
        //             } else {
        //                 deferred.reject(self.bestKeyword);
        //             }
        //         },
        //         function (response) { // 실패
        //             console.error("인기검색어 로드 실패");
        //             deferred.reject(self.bestKeyword);
        //         }
        //     );

        //     return deferred.promise;
        // };

        // 기본 발화 가이드 얻어오기 promise
        self.voiceInfo = [];
        self.getVoiceInfo = function () {
            var deferred = $q.defer();
            $http({
                url: LotteCommon.vcStartVoiceInfoData,
                method: "get"
            })
            .then(
                function (response) { // 성공
                    if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                        var voiceInfo = response.data.data ? response.data.data : null;

                        if (voiceInfo && voiceInfo.guide_list && voiceInfo.guide_list.items) {
                            self.voiceInfo = voiceInfo.guide_list.items;

                            deferred.resolve(self.getRandomPick(self.voiceInfo)); // 인기검색어 리스트 5개 랜덤
                            //deferred.resolve(self.voiceInfo);
                        } else {
                            deferred.reject(self.voiceInfo);
                        }
                    } else {
                        console.error("보이스 커머스 기본 발화 정보 로드 오류");
                        deferred.reject(self.voiceInfo);
                    }
                },
                function (response) { // 실패
                    console.error("보이스 커머스 기본 발화 정보 로드 실패");
                    deferred.reject(self.voiceInfo);
                }
            );

            return deferred.promise;
        };

        self.getRandomPick = function(arr){
            
            var bestArr = [];
            var recieveArr = angular.copy(arr);

            angular.forEach(recieveArr , function(value,key){
                if(value.guide_type == "BEST"){
                    bestArr.push(value);
                }
            });

            var ranBest = Math.round(Math.random() * (bestArr.length-1));
            
            var first = false;
            var firstIndex = -1;
            var lastIndex = -1;
            for(var i=0; i< recieveArr.length; i++){
                if(recieveArr[i].guide_type == "BEST"){
                    if(first == false){
                        first = true;
                        firstIndex = i;
                    }else{
                        lastIndex = i;
                    }
                }
            }
            
            recieveArr.splice(firstIndex,lastIndex - firstIndex +1);
            recieveArr.splice(firstIndex,0,bestArr[ranBest])
            
            return recieveArr;

        }

    }]);

    // 보이스 커머스 발화 가이드(인기키워드 포함) 정보 연동 처리
    VCServiceModule.service('VCHelpInfo', ['$http', '$q', 'LotteCommon', 'LotteStorage', 
    function ($http, $q, LotteCommon, LotteStorage) {
        var self = this;

        /**
         * 도움말 코너 정보 연동
         * state
         * - order_complete (주문완료): etc 코너번호 (햄버거 열림)
         */
        self.helpInfo = {
            home: {conrNo: '', list: [{banner_nm: "여기를 터치해 말해보세요"}]},//home (메인): 없음
            prod_list: {conrNo: '74755', list: []},//상품리스트
            prod_detail: {conrNo: '74756', list: []},//상품상세
            order: {conrNo: '74757', list: []},//주문확정
            cart: {conrNo: '74758', list: []},//장바구니
            wish: {conrNo: '74759', list: []},//위시리스트
            best_recommendation: {conrNo: '74755', list: []},//베스트추천
            other_customers_item_recommendation: {conrNo: '74755', list: []},//다른고객들이함께본상품추천
            purchase_frequently: {conrNo: '76955', list: []},//자주구매
            mimitoutou_recommendation: {conrNo: '74755', list: []},//미미뚜뚜
            my_recommendation: {conrNo: '74755', list: []},//마이추천
            point: {conrNo: '77258', list: []},//포인트/클로버
            recently_viewed_item: {conrNo: '76956', list: []},//최근본상품
            situation_recommendation: {conrNo: '74760', list: []},//상황아이템 질의
            situation_recommendationList: {conrNo: '74755', list: []},//상황아이템 리스트
            management_item_recommendation: {conrNo: '74760', list: []},//관리아이템 질의
            management_item_recommendationList: {conrNo: '74755', list: []},//관리아이템 리스트
            style_recommendation: {conrNo: '77255', list: []},//스타일추천
            order_inquiry: {conrNo: '77256', list: []},//주문배송조회
            coupon: {conrNo: '77257', list: []},//쿠폰
            purchase_gift: {conrNo: '77259', list: []},//구매사은이벤트
            purchase_gift_my: {conrNo: '78755', list: []},//구매사은이벤트신청완료(나의 내역)
            purchase_giftNo: {conrNo: '78756', list: []},//구매사은이벤트신청불가
            event: {conrNo: '77260', list: []},//이벤트
            event_application_details: {conrNo: '77262', list: []},//이벤트응모내역
            billing_discount: {conrNo: '77263', list: []},//청구할인이벤트
            interest_free_installment: {conrNo: '77264', list: []},//무이자할부
            customer_center: {conrNo: '77265', list: []},//상담
            favorite_brands: {conrNo: '74755', list: []},//즐겨찾기 브랜드
            secret_event: {conrNo: '78155', list: []},//비밀이벤트
            etc: {conrNo: '74760', list: []} // etc 사용 안함으로 변경
        };
        
        // 도움말 정보 로드
        self.getHelpInfo = function (stateName) {
            var deferred = $q.defer();
            if (self.helpInfo[stateName] && self.helpInfo[stateName].list && self.helpInfo[stateName].list.length > 0) {
                // 이미 로드된 데이터는 로드된 데이터로 리턴
                deferred.resolve(self.helpInfo[stateName].list);
            } else {
                if (!self.helpInfo[stateName]) {
                    stateName = "etc";
                }
                var conrNo = self.helpInfo[stateName].conrNo ? self.helpInfo[stateName].conrNo : "74760";
    
                $http({
                    url: LotteCommon.vcHelpInfoData,
                    method: "get",
                    params: {
                        conr_no: conrNo
                    }
                })
                .then(
                    function (response) { // 성공
                        if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                            var helpInfo = response.data.data ? response.data.data : null;
    
                            if (helpInfo && helpInfo.help_info_list) {
                                self.helpInfo[stateName].list = helpInfo.help_info_list;
                                deferred.resolve(self.helpInfo[stateName].list);
                            } else {
                                deferred.reject([]);
                            }
                        } else {
                            console.error("보이스 커머스 도움말 정보 로드 오류", stateName);
                            deferred.reject([]);
                        }
                    },
                    function (response) { // 실패
                        console.error("보이스 커머스 도움말 정보 로드 실패", stateName);
                        deferred.reject([]);
                    }
                );
            }

            return deferred.promise;
        };
    }]);

    // 의미분석 음성 전달 처리
    VCServiceModule.service('VCSendMsg', ['$http', '$q', 'LotteCommon', 'VCBasicInfo', 
    function ($http, $q, LotteCommon, VCBasicInfo) {
        var self = this;

        /**
         * 의미분석에 사용자 입력 값 전송
         * @param {string} qType v: 보이스, t: 텍스트
         * @param {string} txt 전송 텍스트
         */
        self.sendSemanticAnalysis = function (reqParam) {
            var deferred = $q.defer();
            var sendData = {
                //screenEng: reqParam.screen, // 화면 상태 영문
                screen: self.screenToHangul(reqParam.screen), // 화면 상태 한글
                qType: "", // 발화/터치/입력 구분 값
                text: reqParam.text, // 발화/터치/입력 텍스트
                //history : reqParam.history, //히스토리 클릭 Boolean
                mbrNo: reqParam.mbrNo ? reqParam.mbrNo : null, // 고객 회원번호
                preReqParam: reqParam.preReqParam ? reqParam.preReqParam : null,
                answerLogSaveYN : reqParam.answerLogSaveYN ? reqParam.answerLogSaveYN : null ,//로그전용 값 Y : 로그 Q and A 저장 , N : Q 만 저장
                onlyAnswerLogSaveYN : reqParam.onlyAnswerLogSaveYN ? reqParam.onlyAnswerLogSaveYN : null //로그전용 값 Y : 로그 A 저장 , N : QA 저장
            };
            switch (reqParam.qType) {
                case 'mic':
                    sendData.qType = "V";
                    break;
                case 'keyboard':
                    sendData.qType = "I";
                    break;
                case 'click':
                    sendData.qType = "T";
                    break;
                case 'none':
                    sendData.qType = "N";
                    break;
                case 'mini':
                	sendData.qType = "M";
                	break;
                default:
                    sendData.qType = "";
                    break;
            }

            // Validate
            if (!sendData.screen || sendData.screen == "" || sendData.qType == "" || !sendData.text || sendData.text == "") {
            	console.warn("reject", sendData)
                console.log("reject", sendData, reqParam , sendData.screen);
                deferred.reject();
                return deferred.promise;
            }

            if(location.host == "localhost:8082"){
            	LotteCommon.semanticAnalysisData = 			"/json/talk/voice_commerce/voiceCommerceRequest.jsp";
            	LotteCommon.productProductView2017Data = 	"/json/product_new/product_view_570616943.json";
            	LotteCommon.productDetailData = 			"/json/product_new/product_detail_570616943.json";
            	//LotteCommon.vcPrdInfoData = "http://mo.lotte.com/json/talk/talk_goods_list.json";
            }
            $http({
                url: LotteCommon.semanticAnalysisData,
                method: "get",
                params: sendData
            })
            .then(
                function (response) { // 성공
                    if(sendData.answerLogSaveYN && sendData.answerLogSaveYN == "N") return;

                    var commandData = response.data ? response.data : null;

                    if (response.data && response.data.responseCode == "00000") {
                        if (commandData) {
                            if (reqParam.noHistory !== true && (reqParam.screen == "home" || reqParam.history == true)) {
                                VCBasicInfo.saveSemanticHistory(reqParam.text); // 의미분석 전송 텍스트 히스토리 저장
                            }
                            deferred.resolve(commandData);
                        } else {
                            console.error("의미분석 실패");
                            deferred.reject();
                        }
                    } else if (response.data.responseCode == "99999") {
                        console.error("의미분석 실패", response.data.responseMsg);
                        if (commandData) {
                            deferred.resolve(commandData);
                        }
                    } else {
                        console.error("의미분석 실패", response.data.responseMsg);
                        deferred.reject();
                    }
                },
                function (response) { // 실패
                    if(sendData.answerLogSaveYN && sendData.answerLogSaveYN == "N") return;
                    
                    console.error("의미분석 연동 실패");
                    deferred.reject();
                }
            );
            
            return deferred.promise;
        };

        self.screenToHangul = function(nameStr){
            var hangulObj = {
            	"home" : "홈",
            	"prod_list" :"상품리스트",
            	"prod_detail":"상품상세",
            	"cart" :"장바구니",
            	"wish" : "위시리스트",
            	"order" :"주문확정",
            	"order_complete" : "주문완료",
            	"best_recommendation":"베스트추천",
            	"purchase_frequently" : "자주구매",
            	"recently_viewed_item" : "최근본상품",
            	"style_recommendation" : "스타일추천",
            	"situation_recommendation" : "상황추천",
            	"management_item_recommendation" : "관리아이템추천",
            	"order_inquiry" : "주문조회", "coupon" : "쿠폰",
            	"secret_event":"비밀이벤트" , "point" : "포인트",
            	"event" : "이벤트", "event_application_details" : "이벤트응모내역",
            	"purchase_gift" : "구매사은",
            	"billing_discount" : "청구할인",
            	"interest_free_installment" : "무이자할부",
            	"customer_center" : "고객센터",
            	"mimitoutou_recommendation" : "미미뚜뚜추천",
            	"my_recommendation" : "마이추천",
            	"favorite_brands" : "즐겨찾기브랜드",
            	"other_customers_item_recommendation":"다른고객들이함께본상품추천",
            	"chulcheck" : "출석체크"
            };
            var returnName ;
            angular.forEach(hangulObj, function(value, key) {
                if(nameStr == key){
                    returnName =  value;
                }
            });
            return returnName;
        };

    }]);

    // 상품 리스트(장바구니, 위시 포함)에 대한 의미 분석일 경우 상품 정보 EC 가져오기
    VCServiceModule.service('VCGetPrdInfo', ['$http', '$q', 'LotteCommon',
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 상품 정보 호출
         * @param {objec} params 얻어오고자 하는 상품번호 리스트
         */
        self.getPrdListInfo = function (params) {
            var deferred = $q.defer();

            $http({
                url: LotteCommon.vcPrdInfoData,
                method: "get",
                params: params
            })
            .then(
                function (response) { // 성공
                    if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                        var prodInfoData = response.data.data ? response.data.data : null;

                        if (prodInfoData.prd_list && prodInfoData.prd_list.items) {
                            var prodInfo = prodInfoData;
                            deferred.resolve(prodInfo); // 상품 정보 성공
                        } else {
                            deferred.resolve([]); // 상품 정보 없을 경우 빈 Array로 전달
                        }
                    } else {
                        console.error("상품정보 로드 실패");
                        deferred.reject();
                    }
                },
                function (response) { // 실패
                    console.error("상품정보 로드 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };

    }]);

    // 상품 자세히 보기 정보 EC 가져오기
    VCServiceModule.service('VCGetPrdDetailInfo', ['$http', '$q', 'LotteCommon',
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 상품 이미지 리스트 정보 호출
         * @param {objec} goods_no 이미지 리스트를 얻어오고자 하는 상품번호
         */
        self.getProdImgInfo = function (goods_no) {
            var deferred = $q.defer();

            if (!goods_no) {
                deferred.reject();
            }

            $http({
                url: LotteCommon.vcPrdImgListData,
                method: "get",
                params: {
                    goods_no: goods_no
                }
            })
            .then(
                function (response) { // 성공
                    var resData = response.data ? response.data : null;

                    if (resData && resData.data) { // 응답 성공 여부 확인
                            var prodImgListInfo = resData.data && resData.data.imgList ? resData.data.imgList : [];
                            deferred.resolve(prodImgListInfo); // 상품 정보 성공
                    } else {
                        console.error("상품이미지 리스트 로드 실패");
                        deferred.reject();
                    }
                },
                function (response) { // 실패
                    console.error("상품이미지 리스트 로드 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };

        /**
         * EC에 상품 정보 호출 (기존 상품상세 데이터 활용)
         * @param {objec} goods_no 얻어오고자 하는 상품번호
         */
        self.getPrdDetailListInfo = function (goods_no) {
            var deferred = $q.defer();

            if (!goods_no) {
                deferred.reject();
            }

            $http({
                url: LotteCommon.productProductView2017Data,
                method: "get",
                params: {
                    goods_no: goods_no
                }
            })
            .then(
                function (response) { // 성공
                    var resData = response.data ? response.data : null;

                    if (resData && resData.data) { // 응답 성공 여부 확인
                            var prodDetailInfo = resData.data;
                            deferred.resolve(prodDetailInfo); // 상품 정보 성공
                    } else {
                        console.error("상품상세정보 로드 실패");
                        deferred.reject();
                    }
                },
                function (response) { // 실패
                    console.error("상품상세정보 로드 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };

        /**
         * EC에 상품상세 Html정보 호출 (기존 상품상세 Html 데이터 활용)
         * @param {objec} params 얻어오고자 하는 상품번호 리스트
         */
        self.getPrdDetailHtmlInfo = function (goods_no) {
            var deferred = $q.defer();

            if (!goods_no) {
                deferred.reject();
            }

            $http({
                url: LotteCommon.productDetailData,
                method: "get",
                params: {
                    goods_no: goods_no
                }
            })
            .then(
                function (response) { // 성공
                    var resData = response.data;

                    if (resData.max) { // 응답 성공 여부 확인
                            var prodDetailHtmlInfo = resData;
                            deferred.resolve(prodDetailHtmlInfo); // 상품 정보 성공
                    } else {
                        console.error("상품상세 Html 정보 로드 실패");
                        deferred.reject();
                    }
                },
                function (response) { // 실패
                    console.error("상품상세 Html 정보 로드 실패");
                    deferred.reject();
                }
            );
            return deferred.promise;
        };
    }]);

    // 상품평 정보 EC 가져오기
    VCServiceModule.service('VCGetProdComment', ['$http', '$q', 'LotteCommon',
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 상품 정보 호출 (기존 상품상세 데이터 활용)
         * @param {objec} params 얻어오고자 하는 상품번호 리스트
         */
        self.getProdComment = function (goods_no, pageIndex) {
            var deferred = $q.defer();

            if (!goods_no) {
                deferred.reject();
            }

            $http({
                url: LotteCommon.vcProductCommentData,
                method: "get",
                params: {
                    all_view_yn: "Y",
                    goods_no: goods_no,
                    page: pageIndex,
                    sort: "L"
                }
            })
            .then(
                function (response) { // 성공
                    var resData = response.data ? response.data : null;

                    if (resData && resData.data) { // 응답 성공 여부 확인
                            var prodComment = resData.data;
                            deferred.resolve(prodComment); // 상품 정보 성공
                    } else {
                        console.error("상품평정보 로드 실패");
                        deferred.reject();
                    }
                },
                function (response) { // 실패
                    console.error("상품평정보 로드 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };
    }]);

    // 상품 옵션 정보 확인
    VCServiceModule.service('VCGetPrdOption', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        // 옵션 가공 (단품정보 품절 제외 시키기)
        function optItemSoldoutChk(items) {
            var rtnItems = [],
                i = 0;

            for (i = 0; i < items.length; i++) {
                if (items[i].invQty > 0 && !items[i].optStkYn) { // 수량 및 품절 여부 확인
                    rtnItems.push(items[i]);
                }
            }

            return rtnItems;
        }

        self.prdOptInfo = { // 이전 요청된 상품 옵션 정보 저장
            goodsNo: null,
            optInfo: null
        };

        /**
         * EC에 상품 옵션 정보 호출
         * @param {objec} goods_no 옵션정보를 얻어오고자 하는 상품번호
         */
        self.getPrdOptInfo = function (goods_no) {
            var deferred = $q.defer();

            if (!goods_no) {
                deferred.reject();
            } else {
                if (self.prdOptInfo.goodsNo == goods_no && self.prdOptInfo.optInfo) { // 이전 호출된 상품이라면
                    deferred.resolve(self.prdOptInfo.optInfo); // 상품 옵션 정보 성공
                } else {
                    $http({
                        url: LotteCommon.vcPrdOptInfoData,
                        method: "get",
                        params: {
                            goods_no: goods_no
                        }
                    })
                    .then(
                        function (response) { // 성공
                            if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                                var resData = response.data;
            
                                if (resData.data) { // 응답 성공 여부 확인
                                        var prdOptInfo = resData.data;

                                        /**
                                        optSelectList.items
                                        [
                                            {
                                                optNm: "생상",
                                                valueType: "OPT_1_TVAL",
                                                itemList: {
                                                    items: [
                                                        {
                                                            optValCd: "5",
                                                            optValue: "PK"
                                                        }
                                                    ],
                                                    total_count: 1
                                                }
                                            }
                                        ]
                                        optDtlList.items
                                        [
                                            {
                                                invQty: 20,
                                                optValCd: "5 x 4",
                                                optValue: "PK x 64",
                                                itemNo: 0,
                                                optStkYn: true // 품절 여부 (품절여부 체크는 optStkYn 값과 수량을 같이 확인 하여 판단 )
                                            }
                                        ]
                                         */
                                        if (prdOptInfo.optDtlList && prdOptInfo.optDtlList.items && prdOptInfo.optDtlList.items.length > 0) {
                                            var optItems = optItemSoldoutChk(prdOptInfo.optDtlList.items); // 품절 제외된 단품 옵션 정보

                                            if (optItems && optItems.length > 0) {
                                                self.prdOptInfo = {
                                                    goodsNo: goods_no,
                                                    optInfo: {
                                                        optSelectList: prdOptInfo.optSelectList.items,
                                                        optItems: optItems
                                                    }
                                                };
            
                                                deferred.resolve(self.prdOptInfo.optInfo); // 상품 옵션 정보 성공
                                            } else { // 옵션이 없는 경우
                                                deferred.resolve(null); // 상품 옵션 정보 성공
                                            }
                                        } else { // 옵션이 없는 경우
                                            deferred.resolve(null); // 상품 옵션 정보 성공  
                                        }
                                } else {
                                    console.error("상품 옵션 정보 로드 실패");
                                    deferred.reject();
                                }
                            } else {
                                console.error("상품 옵션 정보 로드 실패");
                                deferred.reject();
                            }
                        },
                        function (response) { // 실패
                            console.error("상품 옵션 정보 로드 실패");
                            deferred.reject();
                        }
                    );
                }
            }

            return deferred.promise;
        };
    }]);

    // 상품 재고 체크
    VCServiceModule.service('VCGetPrdQty', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 상품 재고 체크
         * @param {objec} goods_no 재고 체크 하고자 하는 상품 정보
         * @param {objec} item_no 재고 체크 하고자 하는 상품 정보
         */
        self.chkProdQty = function (goods_no, item_no) {
            //console.log("재고체크", goods_no, item_no);

            var deferred = $q.defer(),
                params = {};

            if (!goods_no) {
                deferred.reject();
            } else {
                params.goods_no = goods_no;
                
                if (item_no) {
                    params.item_no = item_no;
                }
                
                $http({
                    url: LotteCommon.vcPrdQtyChkData,
                    method: "get",
                    params: params
                })
                .then(
                    function (response) { // 성공
                        if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                            var prdQtyInfo = response.data.data ? response.data.data : null;

                            if (prdQtyInfo && prdQtyInfo.inv_stat_cd == "S") {
                                /**
                                 * prdQtyInfo : {
                                 *  inv_stat_cd: "S", // S: 정상, P: 부분품절, F: 전체 품절
                                 *  inv_stat_msg: "" // 재고 상태 메시지 (S일때는 없음)
                                 * }
                                 */
                                deferred.resolve(prdQtyInfo); // 상품 옵션 정보 성공
                            } else {
                                console.error("재고 없음");
                                deferred.reject(prdQtyInfo);
                            }
                        } else {
                            console.error("재고 체크 확인 실패");
                            deferred.reject();
                        }
                    },
                    function (response) { // 실패
                        console.error("재고 체크 확인 실패");
                        deferred.reject();
                    }
                );
            }

            return deferred.promise;
        };
    }]);

    // 주문확정 정보 확인
    VCServiceModule.service('VCGetOrderDecide', ['$http', '$q', 'LotteCommon', 'LotteAppChk', 'commInitData', 'LotteCookie', 
    function ($http, $q, LotteCommon, LotteAppChk, commInitData, LotteCookie) {
        var self = this;

        /**
         * EC에 주문확정 정보 확인
         * @param {objec} goods_no 재고 체크 하고자 하는 상품 정보
         * @param {objec} item_no 재고 체크 하고자 하는 상품 정보
         */
        self.getOrderDecide = function (params) {
            var deferred = $q.defer(),
                paramsObj = {
                    // member_nm: "", // 회원이름
                    member_no: "", // 회원번호

                    goods_no: "", // 상품번호
                    goods_cmps_cd: "", // 상품구성코드 (default: 50 - 일반상품)
                    // item_no: 0, // 옵션번호 (default: 0)
                    // ord_qty: 1, // 수량 (default: 1)
                    site_no: 1, // 사이트번호 (default: 1)
                    
                    uagent: LotteAppChk.appObj.isAndroid ? "Y" : "N", // UserAgent : 안드로이드여부 Y,N
                    cp_schema: commInitData.query['schema'], // 앱스키마명
                    cp_v: commInitData.query['v'], // 앱 버전 (ex. 4.0.0)
                    cp_udid: commInitData.query['udid'], // 단말기 고유번호

                    chl_no: LotteCookie.getCookie("CHLNO"), // 채널번호 (default: 23)
                    chl_dtl_no: LotteCookie.getCookie("CHLDTLNO"), // 채널상세 (default: 0)
                    infw_disp_no: "5607666", // 유입전시번호 (default: 5607666)
                    infw_disp_no_sct_cd: "18" // 유입전시번호 구분코드 (default: 18)
                };
            
            if (params) {
                //console.log("주문확정 데이터 요청", paramsObj, params);
                paramsObj = angular.extend(paramsObj, params);
            }

            if (!paramsObj.goods_no) { // 필수 값 체크
                deferred.reject();
            } else {
                $http({
                    url: LotteCommon.vcPrdOrderDecideData,
                    method: "get",
                    params: paramsObj
                })
                .then(
                    function (response) { // 성공
                        if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                            var orderDecideInfo = response.data.data ? response.data.data : null;

                            if (orderDecideInfo) {
                                deferred.resolve(orderDecideInfo); // 주문확정 정보 확인 성공
                            } else {
                                console.error("주문확정 정보 확인 실패");
                                deferred.reject(orderDecideInfo);
                            }
                        } else {
                            console.error("주문확정 정보 확인 실패");
                            deferred.reject(response.data.result.response_msg);
                        }
                    },
                    function (response) { // 실패
                        console.error("주문확정 정보 확인 실패");
                        deferred.reject(null);
                    }
                );
            }

            return deferred.promise;
        };
    }]);

    // 주문연동 관련 API
    VCServiceModule.service('VCOrder', ['LotteCommon', '$window', 'LotteUtil', 
    function (LotteCommon, $window, LotteUtil) {
        var self = this;
        
        // Lpay 관련 설정
        var LPAY_URL = "https://web.lpay.com:1452"; // Lpay 경로
        var LPAY_SIGN_KEY = "e30f88c2c39f2a82af5d08f4691ba6b6";
        var LPAY_REQ_TYPE_CD = "6000002";
        var LPAY_MCHT_AUTH_KEY = "00076790";
        var LPAY_ONLINE_CUSTNO = null;
        var LPAY_PAYCARD_RCGN_ID = null;
        var URL_ORDER_FRAME_URL = LotteCommon.talkShopOrderFrame; // 결제 Iframe URL

        var CALLBACKFUNC_LPAY_MCHT_AUTH = function () {}; // 가맹점 사용자 인증 결과 callback func.
        var CALLBACKFUNC_LPAY_GET_PAYMENT = function () {}; // 결제수단 조회 callback func.

        // Lpay 초기화
        self.initLpay = function () {
            $window.lpay = new Lpay({
                name: "lpay",
                url: LPAY_URL,
                merchantSignKey: LPAY_SIGN_KEY,
                reqTypeCd: LPAY_REQ_TYPE_CD,
                style: "1",
                openMode: "0",
                closeCallback: function () { // Lpay 닫기 Callback
                    console.warn("lpay close");
                },
                __iframe: {},
                popupReturnUrl: ""
            });
        };

        // Lpay Online cust_no 세팅
        self.authLpayMerchant = function (custNo, callbackFunc) {
            LPAY_ONLINE_CUSTNO = custNo;

            if (callbackFunc) { // 가맹점 사용자 인증 callback func 등록
                CALLBACKFUNC_LPAY_MCHT_AUTH = callbackFunc;
            }

            lpayMerchantAuth(); // Lpay 결제수단 인증
        };

        // Lpay 가맹점 사용자 인증
        function lpayMerchantAuth() {
            if ($window.lpay) {
                try {
                    $window.lpay.merchantAuth({
                        mchtAuthKey: LPAY_MCHT_AUTH_KEY,
                        onlCno: LPAY_ONLINE_CUSTNO,
                        callback: callbackLpayMerchantAuth
                    });
                } catch (e) {
                    console.log("error", 1);
                    CALLBACKFUNC_LPAY_MCHT_AUTH(false);
                }
            } else {
                console.log("error", 2);
                CALLBACKFUNC_LPAY_MCHT_AUTH(false);
            }
        };
        
        // Lpay 가맹점 사용자 인증 Callback
        function callbackLpayMerchantAuth(data) {
            if (data == undefined || data.resClac != "S") { // Error
                //console.log("error", 3, data);
                CALLBACKFUNC_LPAY_MCHT_AUTH(false);
            } else { // Success
                //console.log("error", 4);
                CALLBACKFUNC_LPAY_MCHT_AUTH(true);
            }
        }

        self.getLpayPaymentInfo = function (cardRcgnId, callbackFunc) {
            if (callbackFunc) { // 결제 정보 Callback Func
                CALLBACKFUNC_LPAY_GET_PAYMENT = callbackFunc;
            }

            if (cardRcgnId) { // 카드 등록 ID 정보
                LPAY_PAYCARD_RCGN_ID = cardRcgnId;
            } else {
                CALLBACKFUNC_LPAY_GET_PAYMENT(false);
                return false;
            }

            if ($window.lpay) {
                try {
                    $window.lpay.getPaymentMethod({
                        onlCno: LPAY_ONLINE_CUSTNO,
                        callback: callbackLpayPayment
                    });
                } catch(e) {
                    CALLBACKFUNC_LPAY_GET_PAYMENT(false);
                }
            } else {
                CALLBACKFUNC_LPAY_GET_PAYMENT(false);
            }
        };

        function callbackLpayPayment(data) {
            if (data == undefined || data.resClac != "S") { // Error
                console.error("Lpay 결제 수단 확인 실패");
                CALLBACKFUNC_LPAY_GET_PAYMENT(false);
            } else { // Success
                //console.log("Lpay 결제 수단 확인 성공");
                var rtnItem = {
                    fnCoNm: "",
                    pmtMthdAlias: ""
                };

                angular.forEach(data.pmtMthdList, function (item, idx) {
                    if (item.pmtMthdId == LPAY_PAYCARD_RCGN_ID) {
                        rtnItem.fnCoNm = item.fnCoNm;
                        rtnItem.pmtMthdAlias = item.pmtMthdAlias;
                    }
                });

                if ((rtnItem.pmtMthdAlias + "").length > 0) {
                    CALLBACKFUNC_LPAY_GET_PAYMENT(rtnItem);
                } else {
                    CALLBACKFUNC_LPAY_GET_PAYMENT(false);
                }
            }
        }

        // 주문 Iframe 경로 구하기
        self.getOrderUrl = function (cartSn, goodsNo) {
            var rtnUrl = "";

            if (cartSn && goodsNo) {
                rtnUrl = URL_ORDER_FRAME_URL + "?talkYN=Y&vc=Y&cart_sn=" + cartSn + "&goods_no=" + goodsNo + "&" + LotteUtil.getBaseParam();
            }

            return rtnUrl;
        };
    }]);

    // 주문완료 정보 확인
    VCServiceModule.service('VCOrderComplete', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 주문완료 정보 확인
         * @param {objec} member_no 회원번호
         * @param {objec} ord_no 주문번호
         */
        self.getOrderComplete = function (params) {
            var deferred = $q.defer(),
                paramsObj = {
                    member_no: "", // 회원번호
                    ord_no: "" // 주문번호
                };
            
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }

            if (!paramsObj.ord_no || !paramsObj.member_no) { // 필수 값 체크
                deferred.reject();
            } else {
                $http({
                    url: LotteCommon.vcOrdCompleteData,
                    method: "get",
                    params: paramsObj
                })
                .then(
                    function (response) { // 성공
                        if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                            var orderCompleteInfo = response.data.data ? response.data.data : null;

                            if (orderCompleteInfo) {
                                deferred.resolve(orderCompleteInfo); // 주문확정 정보 확인 성공
                            } else {
                                console.error("주문완료 정보 확인 실패");
                                deferred.reject(orderCompleteInfo);
                            }
                        } else {
                            console.error("주문완료 정보 확인 실패");
                            deferred.reject();
                        }
                    },
                    function (response) { // 실패
                        console.error("주문완료 정보 확인 실패");
                        deferred.reject();
                    }
                );
            }

            return deferred.promise;
        };
    }]);

    // 장바구니 담기
    VCServiceModule.service('VCAddCart', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 장바구니 담기 정보 확인
         * @param {objec} member_no 회원번호
         * @param {objec} goods_no 상품번호
         * @param {objec} item_no 옵션 단품 번호
         * @param {objec} ord_qty 수량
         * @param {objec} goods_cmps_cd 상품구성코드 (50: 일반상품)
         * @param {objec} voice 음성주문여부 Y/N
         * @param {objec} infw_disp_no 전시유입번호
         * @param {objec} infw_disp_no_sct_cd 전시유입 구분코드
         * @param {objec} cart_page_yn 장바구니 페이지 Y/N
         */
        self.addCart = function (params) {
            var deferred = $q.defer(),
                paramsObj = {
                    member_no: null, // 회원번호
                    goods_no: null, // 상품번호
                    item_no: null, // 옵션 단품 번호
                    ord_qty: 1, // 수량
                    goods_cmps_cd: null, // 상품구성코드 (50: 일반상품)
                    voice: "Y", // 음성주문여부 Y/N
                    infw_disp_no: "5607666", // 전시유입번호
                    infw_disp_no_sct_cd: "18", // 전시유입 구분코드
                    cart_page_yn: "N" // 장바구니 페이지 Y/N
                };
            
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }

            //console.log("장바구니 담아줘", paramsObj);

            if (!paramsObj.goods_no || (!paramsObj.item_no && paramsObj.item_no !== 0) || !paramsObj.ord_qty || !paramsObj.goods_cmps_cd) { // 필수 값 체크
                deferred.reject();
            } else {
                $http({
                    url: LotteCommon.vcAddCart,
                    method: "get",
                    params: paramsObj
                })
                .then(
                    function (response) { // 성공
                        if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                            var cartInsRes = response.data.result ? response.data.result : null;

                            deferred.resolve(cartInsRes); // 장바구니 담기 성공
                        } else {
                            console.error("장바구니 담기 실패");
                            deferred.reject(response.data.result);
                        }
                    },
                    function (response) { // 실패
                        console.error("장바구니 담기 연동 실패");
                        deferred.reject(response);
                    }
                );
            }

            return deferred.promise;
        };
    }]);

    // 장바구니 옵션/수량 변경
    VCServiceModule.service('VCUpdateCart', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 장바구니 담기 정보 확인
         * @param {objec} member_no 회원번호
         * @param {objec} goods_no 상품번호
         * @param {objec} item_no 옵션 단품 번호
         * @param {objec} ord_qty 수량
         * @param {objec} goods_cmps_cd 상품구성코드 (50: 일반상품)
         * @param {objec} voice 음성주문여부 Y/N
         * @param {objec} infw_disp_no 전시유입번호
         * @param {objec} infw_disp_no_sct_cd 전시유입 구분코드
         * @param {objec} cart_page_yn 장바구니 페이지 Y/N
         */
        self.updateCart = function (params) {
            var deferred = $q.defer(),
                paramsObj = {
                    cart_sn: params.cart_sn, // 장바구니 번호
                    ord_qty: params.ord_qty, // 주문수량
                    item_no: params.item_no, // 선택 단품옵션 번호
                    update_ck: params.update_ck ? true : false, // 옵션 변경 유무
                    goods_no: params.goods_no, // 상품번호
                    goods_cmps_cd: params.goods_cmps_cd // 상품 구분 코드
                };

            //console.log("장바구니 옵션 변경", paramsObj);

            if (!paramsObj.cart_sn || !paramsObj.ord_qty || (!paramsObj.item_no && paramsObj.item_no !== 0) || !paramsObj.goods_no || !paramsObj.goods_cmps_cd) { // 필수 값 체크
                deferred.reject();
            } else {
                $http({
                    url: LotteCommon.cartUpdateOptionData,
                    method: "post",
                    params: paramsObj
                })
                .then(
                    function (response) { // 성공
                        deferred.resolve(response); // 장바구니 담기 성공
                    },
                    function (response) { // 실패
                        console.error("장바구니 업데이트 연동 실패");
                        deferred.reject();
                    }
                );
            }

            return deferred.promise;
        };
    }]);

    // 위시리스트 담기
    VCServiceModule.service('VCAddWish', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 위시 담기 정보 확인
         * @param {objec} goods_no 상품번호
         */
        self.addWish = function (params) {
            var deferred = $q.defer(),
                paramsObj = {
                    member_no: null, // 고객번호
                    goods_no: null // 상품번호
                };
            
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }

            if (!paramsObj.goods_no || !paramsObj.member_no) { // 필수 값 체크
                deferred.reject();
            } else {
                $http({
                    url: LotteCommon.vcAddWish,
                    method: "get",
                    params: paramsObj
                })
                .then(
                    function (response) { // 성공
                        if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                            deferred.resolve(response.data.result.response_code); // 위시 담기 성공
                        } else if (response.data.result && response.data.result.response_code == "00001") {
                            deferred.resolve(response.data.result.response_code); // 이미 등록된 위시
                        } else {
                            console.error("위시 담기 오류");
                            deferred.reject();
                        }
                    },
                    function (response) { // 실패
                        console.error("위시 담기 연동 실패");
                        deferred.reject();
                    }
                );
            }

            return deferred.promise;
        };
    }]);

    // 배송비/배송기간 확인
    VCServiceModule.service('VCDeliveryInfo', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 배송비/배송기간 확인
         * @param {objec} goods_no 상품번호
         */
        self.getDeliveryInfo = function (params) {
            var deferred = $q.defer(),
                paramsObj = {
                    goods_no: null // 상품번호
                };
            
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }

            if (!paramsObj.goods_no) { // 필수 값 체크
                deferred.reject();
            } else {
                $http({
                    url: LotteCommon.vcDeliveryInfoData,
                    method: "get",
                    params: paramsObj
                })
                .then(
                    function (response) { // 성공
                        if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                            var deliveryInfo = response.data.data ? response.data.data : null;

                            if (deliveryInfo) {
                                deferred.resolve(deliveryInfo); // 배송 정보 확인 성공
                            } else {
                                console.error("배송 정보 확인 오류");
                                deferred.reject();
                            }
                        } else {
                            console.error("배송 정보 확인 오류");
                            deferred.reject();
                        }
                    },
                    function (response) { // 실패
                        console.error("배송 정보 확인 연동 실패");
                        deferred.reject();
                    }
                );
            }

            return deferred.promise;
        };
    }]);

    // 인기키워드 조회
    VCServiceModule.service('VCHotKeywordInfo', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
         * EC에 인기키워드 조회
         */
        self.getHotKeyword = function () {
            var deferred = $q.defer();
            $http({
                url: LotteCommon.srhBestData,
                method: "get"
            })
            .then(
                function (response) { // 성공
                    if (response.data.searchPopList && response.data.searchPopList.result_best && response.data.searchPopList.result_best.items && response.data.searchPopList.result_best.items.length > 0) { // 응답 성공 여부 확인
                        deferred.resolve(response.data.searchPopList.result_best.items); 
                    } else {
                        console.error("인기검색어 데이터 오류");
                        deferred.reject();
                    }
                },
                function (response) { // 실패
                    console.error("인기검색어 연동 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };
    }]);

    // 쿠폰
    VCServiceModule.service('VCCouponInfo', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
        * EC에 쿠폰
        */
        self.getCouponList = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            
            $http({
                url: LotteCommon.vcCoupon,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공
                    if (response.data.data) { // 응답 성공 여부 확인
                        deferred.resolve(response.data.data); // 쿠폰 리스트
                    } else {
                        console.error("쿠폰 기본 정보 로드 오류");
                        deferred.reject();
                    }
                    
                },
                function (response) { // 실패
                    console.error("쿠폰 연동 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };
    }]);
    
    // 포인트
    VCServiceModule.service('VCPointCloverInfo', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
        * EC에 포인트
        * @param {objec} rowsPerPage 페이지당 출력수 default 10
        * @param {objec} page 호출할 페이지번호 default 1
        */
        self.getPointCloverList = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            $http({
                url: LotteCommon.pointInfoData,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공
                    var cloverData = {
	        	        item : [{name: "L.point", pointType : "lpoint", pointcount : response.data.max.lt_point},
	        	        	    {name: "L-money", pointType : "lmoney", pointcount : response.data.max.l_point},
	        	        	    {name: "보관금",  pointType : "deposit", pointcount : response.data.max.deposit},
	        	        	    {name: "클로버",  pointType : "clover", pointcount : response.data.max.clover_cnt}]
				    	}
                    
                    if (cloverData.item) { // 응답 성공 여부 확인
                        deferred.resolve(cloverData.item); // 포인트 리스트
                        console.log(cloverData.item)
                    } else {
                        console.error("포인트 기본 정보 로드 오류");
                        deferred.reject();
                    }
                    
                },
                function (response) { // 실패
                    console.error("포인트 연동 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };
    }]);
    
    // 마이추천
    VCServiceModule.service('VCMyRecommend', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
        * 레코벨 마이추천
        */
        self.getMyRecommendList = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            paramsObj.size = 100;
            paramsObj.url = LotteCommon.rec_good + "&size=" + paramsObj.size +"&iids=" + paramsObj.iids + "&_reco=M_detail_voice&callback=JSON_CALLBACK";
            $http.jsonp(paramsObj.url)
            .success(function (data) {
                console.log(data);
                deferred.resolve(data.results); // 마이추천 리스트
            })
            .error(function (data) {
                deferred.reject();
            })

            return deferred.promise;
        };
    }]);
    
    // 남들은 뭘봤지
    VCServiceModule.service('VCOthersHaveSee', ['$http', '$q', 'LotteCommon', 'LotteCookie', 
    function ($http, $q, LotteCommon, LotteCookie) {
        var self = this;

        /**
        * 레코벨 남들은뭘봤지
        */
        self.getOthersHaveList = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            paramsObj.size = 40;

            var recobellUrl;
            var gaCidLastNum = LotteCookie.getCookie("_ga").charAt(LotteCookie.getCookie("_ga").length-1), // GA cid cookie 마지막 자리수 체크
    			recobellUrl = LotteCommon.rec_good + "&size=" + paramsObj.size +"&iids=" + paramsObj.iids + "&_reco=M_detail_voice_recent";

    		if (gaCidLastNum%2 == 0) { // GA cid 마지막자리 짝수일 경우 DS팀 상품추천 API호출
    			recobellUrl = LotteCommon.salebestlist_url_ds + "?format=jsonp&size=" +paramsObj.size + "&iids=" + paramsObj.iids;
    		}
    	
    		
            paramsObj.url = recobellUrl + "&callback=JSON_CALLBACK";
            
            $http.jsonp(paramsObj.url)
            .success(function (data) {
                deferred.resolve(data.results); // 남들은뭘봤지 리스트
            })
            .error(function (data) {
                deferred.reject();
            })

            return deferred.promise;
        };
    }]);

    // 고객센터
    VCServiceModule.service('VCCounselorInfo', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;
        
        /**
         * EC에  주문내역 리스트
         * @param {objec} holiday_cd 휴일코드 N:평일(휴일아님) M:월요일(휴일아님) W:주말(토,일) H:법정 공휴일
         */
        self.getCounselorList = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            $http({
                url: LotteCommon.counselorList,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공                	
                    if (response.data) { // 응답 성공 여부 확인
                        deferred.resolve(response.data); // 포인트 리스트
                    } else {
                        console.error("고객센터 기본 정보 로드 오류");
                        deferred.reject();
                    }
                    
                },
                function (response) { // 실패
                    console.error("고객센터 연동 실패");
                    console.log(response)
                    deferred.reject();
                }
            );

            return deferred.promise;
        };
    }]);
   
    // 구매사은이벤트 조회 , 신청
    VCServiceModule.service('VCSaunInfo', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;
        self.SAUN_CARD_DATA = null;

        /**
        * EC에 구매사은이벤트
        * @param {objec} rowsPerPage 페이지당 출력수 default 10
        */
        self.getSaunList = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            $http({
                url: LotteCommon.eventSaunListData,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공
                    if (response.data.saunList) { // 응답 성공 여부 확인
                        var resultSanunList;
                        if(params.listType == "mysaun_list"){
                            resultSanunList = response.data.saunList.mysaun_list.items;
                            deferred.resolve(resultSanunList); // 신청한 리스트
                        }else if(params.listType == "saun_list"){
                            resultSanunList = response.data.saunList.saun_list.items;
                            // if(response.data.saunList.mysaun_list.items){
                            //     resultSanunList = self.listSumMysaun(response.data.saunList.mysaun_list.items).concat(resultSanunList);
                            // }
                            deferred.resolve(resultSanunList); // 리스트
                        }else{
                            resultSanunList = response.data.saunList.saun_list.items;
                            // if(response.data.saunList.mysaun_list.items){
                            //     resultSanunList = self.listSumMysaun(response.data.saunList.mysaun_list.items).concat(resultSanunList);
                            // }
                            deferred.resolve(resultSanunList); // 리스트
                        }
                    } else {
                        console.error("구매사은이벤트 기본 정보 로드 오류");
                        deferred.reject();
                    }
                    
                },
                function (response) { // 실패
                    console.error("구매사은이벤트 연동 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };

        /**
        * 일반 리스트에 나의 구매사은 추가
        * eventstatus 진행중 003 && 신청완료된것
        */
        self.listSumMysaun = function (arr) {
            var tempArr = [];
            for(var i=0; i < arr.length; i++) {
                if(arr[i].eventStatus == "003"){
                    arr[i].aleady = "Y";
                    tempArr.push(arr[i]);
                }
            }
            return tempArr;
        };

        /**
        * EC에 구매사은이벤트 모두 신청
        */
        self.registeSaunAll = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            
            $http({
                url: LotteCommon.saunRegistAll,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공
                    if (response.data.result.response_code == '00000') { // 응답 성공 여부 확인
                        deferred.resolve(response.data.data);
                    } else {
                        console.error("구매사은이벤트 전체 등록 로드 오류");
                        deferred.reject();
                    }
                    
                },
                function (response) { // 실패
                    console.error("구매사은이벤트 전체 등록 연동 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };
        /**
        * EC에 구매사은 상세 검색
        * @param {objec} evt_no 이벤트 넘버
        */
        self.detailSaun = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            $http({
                url: LotteCommon.eventSaunMainData,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공
                    if (response.data.saun) { // 응답 성공 여부 확인
                        deferred.resolve(response.data.saun);
                    } else {
                        console.error("구매사은 상세 로드 오류");
                        deferred.reject();
                    }
                    
                },
                function (response) { // 실패
                    console.error("구매사은 상세 연동 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };

    }]);

    // 이벤트 조회 
    VCServiceModule.service('VCEventInfo', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;

        /**
        * EC에 이벤트
        * @param {objec} dispNo 전시번호
        * @param {objec} age 나이 30
        * @param {objec} gender 성별 F
        */
        self.getEventList = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            paramsObj.dispNo = 5570119; //전시번호
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            
            $http({
                url: LotteCommon.mainContentData,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공
                    if (response.data.moduleData) { // 응답 성공 여부 확인
                        var resultData = [];
                        for(var i=0; i< response.data.moduleData.length; i++){
                            if(response.data.moduleData[i].moduleId == "M2059"){
                                resultData = response.data.moduleData[i].items;
                                break;
                            }
                        }
                        deferred.resolve(resultData); // 신청한 리스트
                    } else {
                        console.error("이벤트 기본 정보 로드 오류");
                        deferred.reject();
                    }
                    
                },
                function (response) { // 실패
                    console.error("이벤트 연동 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };

        /**
        * EC에 이벤트 응모내역
        */
       self.getEventApplyList = function (params) {
        var deferred = $q.defer();
        var paramsObj = {};
        if (params) {
            paramsObj = angular.extend(paramsObj, params);
        }
        $http({
            url: LotteCommon.eventGumeData,
            method: "get",
            params: paramsObj
        })
        .then(
            function (response) { // 성공
                if (response.data && response.data.eventInfoList) { // 응답 성공 여부 확인
                    deferred.resolve(response.data.eventInfoList); 
                } else {
                    console.error("이벤트 응모내역 로드 오류");
                    deferred.reject();
                }
                
            },
            function (response) { // 실패
                console.error("이벤트 응모내역 연동 실패");
                deferred.reject();
            }
        );

        return deferred.promise;
    };

        
    }]);


    // 청구할인/무이자 조회
    VCServiceModule.service('VCSaleInfo', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;
        self.SALE_CARD_DATA = null;
        /**
        * EC에 청구할인/무이자
        * @param {objec} 
        */
        self.getSaleList = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            $http({
                url: LotteCommon.cardSaleListData,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공
                    if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인
                        deferred.resolve(response.data.data.cardList.items); // 리스트
                        self.SALE_CARD_DATA = response.data.data.cardList.items;
                    } else {
                        console.error("청구할인/무이자 기본 정보 로드 오류");
                        deferred.reject();
                    }
                    
                },
                function (response) { // 실패
                    console.error("청구할인/무이자 연동 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };
        //카드 key값 조회해서 해당 카드정보만 추출
        self.getCardList = function (params) {
            var arr = [];
            angular.forEach(self.SALE_CARD_DATA, function(value, key) {
                if(params == value.acqrCd){
                    this.push(value);
                }
            },arr);
            return arr;
        };
    }]);

    // 최근본상품
    VCServiceModule.service('VCLocalLate', ['$http', '$q', 'LotteCommon', 'LotteStorage', 'commInitData',
    function ($http, $q, LotteCommon, LotteStorage, commInitData) {
        var self = this;
        var LATELY_GOODS_STORAGE_NAME = "latelyGoods";
        /**
        * local storage 에 최근본 상품 추가
        * @param {objec} 
        */
        self.setLateList = function (params) {
            var add_goods_no = params;
            var storageViewGoods = LotteStorage.getLocalStorage(LATELY_GOODS_STORAGE_NAME);
			var storageViewGoodsArr = [];
			var newStorageViewGoodsObj = {};
			var newStorageViewGoods = "";
			var storageStr = "";

			if (storageViewGoods != null) {
				storageViewGoodsArr = storageViewGoods.split("|");

				newStorageViewGoodsObj['goods_no'] = [];

				for (var i = 0; i < storageViewGoodsArr.length; i++) {
					newStorageViewGoodsObj['goods_no'].push(storageViewGoodsArr[i]);
				}
				if (newStorageViewGoodsObj['goods_no'].indexOf(add_goods_no) < 0) {
                    newStorageViewGoodsObj['goods_no'].push(add_goods_no);
				}
				
				angular.forEach(newStorageViewGoodsObj, function (val, key) {
					if (val.length > 20) {
						val.splice(0, (val.length-20));
					}

					if (newStorageViewGoods != "") { newStorageViewGoods += "|"; }
					newStorageViewGoods += val.join("|");
				});

				storageStr = newStorageViewGoods;
				localStorage.setItem("latelyGoods", storageStr);
			} else {
				LotteStorage.setLocalStorage(LATELY_GOODS_STORAGE_NAME, add_goods_no);
            }
            
        };

        /**
        * local storage 에 최근본 상품 가져오기
        * @param {objec} 
        */
        self.getLateList = function () {
            var lateList = LotteStorage.getLocalStorage(LATELY_GOODS_STORAGE_NAME);
            if(lateList){
                lateList = lateList.replace(/\|/gi, ",");
            }
            return lateList;
        };
    }]);

    // 주문내역
    VCServiceModule.service('VCPurchaseInfo', ['$http', '$q', 'LotteCommon', 
    function ($http, $q, LotteCommon) {
        var self = this;
        /**
        * EC에  주문내역 리스트
        * @param {objec} vc_ord_search_gu 주문배송 조회 구분 (1:전체조회,2:변경가능,3:최소가능,4:교환가능,5:반품가능,6:취소목록,7:교환목록,8:반품목록)
        * @param {objec} date_search_gu 조회기간구분 VC0:오늘 , VC1:어제 , VC2:이번주 , VC3:지난주 , VC4:지지난주, VC5:요일, VC6:15일, VC7:한달
        */
        self.getPurchaseList = function (params) {
            var deferred = $q.defer();
            var paramsObj = {};
            if (params) {
                paramsObj = angular.extend(paramsObj, params);
            }
            
            $http({
                url: LotteCommon.purchaseList,
                method: "get",
                params: paramsObj
            })
            .then(
                function (response) { // 성공
                    if (response.data.result && response.data.result.response_code == "00000") { // 응답 성공 여부 확인

                        //vc_ord_search_gu
                        //3 취소가능 6 취소목록
                        //4 교환가능 7 교환목록
                        //5 반품가능 8 반품목록
                        
                        //2 , change_type = "OPT" 옵션가능
                        //2 , change_type = "DLV" 배송지가능
                        var searchResultData;
                        if(paramsObj.vc_ord_search_gu == "2"){
                            if(paramsObj.change_type == "OPT"){
                                searchResultData = self.searchGuData(response.data.result.purchase_list ,"opt_change_psb_yn")
                            }else if(paramsObj.change_type == "DLV"){
                                searchResultData = self.searchGuData(response.data.result.purchase_list ,"dlv_change_psb_yn")
                            }
                        }else if(paramsObj.vc_ord_search_gu == "3"){
                            searchResultData = self.searchGuData(response.data.result.purchase_list ,"cancel_psb_yn");
                        }else if(paramsObj.vc_ord_search_gu == "4"){
                            searchResultData = self.searchGuData(response.data.result.purchase_list ,"exchange_psb_yn");
                        }else if(paramsObj.vc_ord_search_gu == "5"){
                            searchResultData = self.searchGuData(response.data.result.purchase_list ,"return_psb_yn");
                        }else{
                            searchResultData = response.data.result.purchase_list
                        }
                        //console.log("주문배송 검색 데이타 " , searchResultData)
                        deferred.resolve(searchResultData); // 리스트
                    } else {
                        console.error("주문내역 기본 정보 로드 오류");
                        deferred.reject();
                    }
                    
                },
                function (response) { // 실패
                    console.error("주문내역 연동 실패");
                    deferred.reject();
                }
            );

            return deferred.promise;
        };

        self.searchGuData = function(dataArr , guStr){
            var searchedData = [];
            angular.forEach(dataArr, function (value, key) {
                if(value[guStr] == "Y" ){
                    this.push(value);
                }
            } , searchedData);
            return searchedData;
        }

    }]);

    // 페이지 이동에 대한 페이지 매칭 및 파라미터 조정 후 이동 처리
    VCServiceModule.service('VCPageMove', ['LotteCommon', 'LotteUtil', '$window', '$location', '$timeout', 
    function (LotteCommon, LotteUtil, $window, $location, $timeout) {
        var self = this,
            pageMoveDelayTime = 500,
            pageUrl = {
                "goLogin": {url: LotteCommon.loginForm, needLogin: false}, // 로그인

                // 로그인 필요페이지
                "goChangePayment": {url: LotteCommon.talkShopPayment, param: {vc: "Y"}, needLogin: true}, // 결제수단 변경
                "actionChangeDelivery": {url: LotteCommon.talkShopDelevery, param: {vc: "Y"}, needLogin: true}, // 배송지 변경
                "goPurchaseList": {url: LotteCommon.ordLstUrl, needLogin: true}, // 주문배송조회
                "goCoupon": {url: LotteCommon.myCouponUrl, param: {point_div: "coupon"}, needLogin: true}, // 쿠폰
                "goPoint": {url: LotteCommon.myCouponUrl, param: {point_div: "lt_point"}, needLogin: true}, // 포인트내역 (L.point 탭)
                "goWish": {url: LotteCommon.wishLstUrl, needLogin: true}, // 위시리스트
                "goEvent": {url: LotteCommon.eventGumeUrl, param: {search_div: "event"}, needLogin: true}, // 이벤트 응모내역
                "goPurchaseGiftList": {url: LotteCommon.eventSaunUrl, needLogin: true}, // 구매사은 신청(나의신청내역)
                "goTalkAdvice": {url: LotteCommon.talkUrl, needLogin: true}, // 톡상담
                //2차 추가
                "goCiritOut": {url: LotteCommon.critViewUrl, needLogin: true}, // 상품평 관리
                "goInqList": {url: LotteCommon.mylotteReinquiryListUrl, needLogin: true}, // 상품문의 내역
                "goInquire": {url: LotteCommon.cscenterAnswerUrl, needLogin: true}, // 일대일문의답변
                "goPresent": {url: LotteCommon.presentListUrl, needLogin: true}, // 선물함
                "goExchange": {url: LotteCommon.smartPickListUrl, needLogin: true}, // 교환권
                "goSmartPay": {url: LotteCommon.smartpayUrl, needLogin: true}, // 스마트페이
                "goLmoney": {url: LotteCommon.myCouponUrl, param: {point_div: "l_point"}, needLogin: true}, // 포인트내역 (L.money 탭)
                "goDeposit": {url: LotteCommon.myCouponUrl, param: {point_div: "deposit"}, needLogin: true}, // 포인트내역 (보관금 탭)
                "goClover": {url: LotteCommon.myCouponUrl, param: {point_div: "clover"}, needLogin: true}, // 포인트내역 (보관금 탭)
                "goCenterQue": {url: LotteCommon.questionUrl, needLogin: true}, // 1:1문의하기
                "goFrequentlyPurchaseProduct": {url: LotteCommon.oftenProdUrl, needLogin: true}, // 자주구매
                "goMimitoutou": {url: LotteCommon.mimiRegistUrl, needLogin: true}, //미미뚜뚜 
                "goCenterTalk": {url: LotteCommon.talkUrl, needLogin: true}, // 톡상담
                "goCloverUseInfo": {url: LotteCommon.cloverUrl, needLogin: true}, // 클로버 이용안내
                //추가요청&수정
                "goMembership": {url: LotteCommon.gdBenefitUrl, needLogin: true}, // 멤버십&쿠폰존
                "goMyLotte": {url: LotteCommon.mylotteUrl, needLogin: true}, // 마이롯데
                
                
                // 로그인 불필요 페이지

                "goCart": {url: LotteCommon.cateLstUrl, needLogin: false}, // 장바구니
                "goRecently": {url: LotteCommon.lateProdUrl, needLogin: false}, // 최근 본 상품
                "goMallMimitoutou": {url: LotteCommon.petMallMainUrl, needLogin: false}, // 전문관-미미뚜뚜
                "goMallSpecialTasty": {url: LotteCommon.specialMallUrl, param: {dispNo: "5558814"}, needLogin: false}, // 전문관-특별한맛남 (특별한 맛남 경로 변경 됨)
                "goMallStyleshop": {url: LotteCommon.styleShopMainUrl, param: {dispNo: "5550415"}, needLogin: false}, // 전문관-스타일샵
                "goMallLottebrand": {url: LotteCommon.specialMallUrl, param: {dispNo: "5553048"}, needLogin: false}, // 전문관-롯데브랜드몰
                "goMallKshop": {url: LotteCommon.specialMallUrl, param: {dispNo: "5535841"}, needLogin: false}, // 전문관-KShop
                "goMallScalp": {url: LotteCommon.specialMallUrl, param: {dispNo: "5569995"}, needLogin: false}, // 전문관-두피전문관
                "goMallTVoutlet": {url: LotteCommon.specialMallUrl, param: {dispNo: "5565610"}, needLogin: false}, // 전문관-TV아울렛
                "goMallBook": {url: LotteCommon.bookshopUrl, needLogin: false}, // 전문관-도서
                "goMallTenbyten": {url: LotteCommon.tenbytenUrl, needLogin: false}, // 전문관-텐바이텐
                "goMallVine": {url: LotteCommon.vineUrl, needLogin: false}, // 전문관-Vine //dev 페이지 없음
                "goMain": {url: LotteCommon.mainUrl, needLogin: false}, // 메인-홈탭
                "goMainBest": {url: LotteCommon.mainUrl, param: {dispNo: "5572537"}, needLogin: false}, // 메인-베스트탭
                "goMainGift": {url: LotteCommon.mainUrl, param: {dispNo: "5570117"}, needLogin: false}, // 메인-기프트탭
                "goMainEvent": {url: LotteCommon.mainUrl, param: {dispNo: "5570119"}, needLogin: false}, // 메인-이벤트/쿠폰탭
                // "goLuckybox": {url: LotteCommon.loginForm, needLogin: false}, // 럭키박스이벤트 4/27 서비스 종료
                "goDirectAttend": {url: LotteCommon.directAttendUrl, needLogin: false}, // 출석체크이벤트
                "goPurchaseGift": {url: LotteCommon.eventSaunListUrl, needLogin: false}, // 구매사은 신청
                //2차 추가
                "goReceiptList": {url: LotteCommon.receiptEvtUrl, needLogin: false}, // 영수증이벤트
                
            };

        self.go =  function (targetName, loginFlag) {
            if (pageUrl[targetName] && pageUrl[targetName].url) {
                var linkUrl = "",
                    targetUrl = "";

                linkUrl = pageUrl[targetName].url + "?" + LotteUtil.getBaseParam();
                
                if (pageUrl[targetName].param) {
                    angular.forEach(pageUrl[targetName].param, function (value, key) {
                        linkUrl += "&" + key + "=" + value;
                    });
                }
                
                if ((pageUrl[targetName].needLogin && !loginFlag)) { // 로그인 필요 페이지
                    if ((linkUrl + "").indexOf("http") == -1) {
                        linkUrl = $location.protocol() + "://" + $location.host() + linkUrl;
                    }
                    linkUrl = LotteCommon.loginForm + "?" + LotteUtil.getBaseParam() + "&targetUrl=" + encodeURIComponent(linkUrl);
                }else if(targetName == "goLogin"){ // 로그인 발활
                    self.goLogin();
                    return;
                }
                
                $timeout(function () {
                    $window.location.href = linkUrl;
                }, pageMoveDelayTime);
            }
        };

        // 보이스 커머스 이용 시 로그인 필요 기능일 경우 로그인 시키고 다시 돌아오는 용도
        self.goLogin = function (lastCommand) {
            var linkUrl = LotteCommon.voiceCommerceUrl + "?" + LotteUtil.getBaseParam();

            if (lastCommand) {
                linkUrl += "&lastCommand=" + lastCommand;
            } else {
                linkUrl += "&isLogin=Y";
            }
            
            $timeout(function () {
                $window.location.href = LotteCommon.loginForm + "?" + LotteUtil.getBaseParam() + "&targetUrl=" + encodeURIComponent(linkUrl);
            }, pageMoveDelayTime);
        };

        // 상품상세 이동
        self.goPrdDetail = function (goodsNo) {
            var curDispNo = "5607666"; // 유입전시 번호
            var curDispNoSctCd = "17"; // 유입전시 코드 (보이스커머스 ->일반상품상세로 이동 시 전시유입코드)

            if (goodsNo) {
                // 유입전시코드(curDispNo), 유입전시 상세코드(curDispNoSctCd)
                var linkUrl = LotteCommon.productviewUrl + "?" + LotteUtil.getBaseParam() + "&goods_no=" + goodsNo + "&curDispNo=" + curDispNo + "&curDispNoSctCd=" + curDispNoSctCd;

                $timeout(function () {
                    $window.location.href = linkUrl;
                }, pageMoveDelayTime);
            }
        };


        // 메인으로 이동
        self.goMain = function () {
            var linkUrl = LotteCommon.mainUrl + "?" + LotteUtil.getBaseParam();

            $timeout(function () {
                $window.location.href = linkUrl;
            }, pageMoveDelayTime);
        };

        // 장바구니 이동
        self.goCart = function () {
            var linkUrl = LotteCommon.cartLstUrl + "?" + LotteUtil.getBaseParam();

            $timeout(function () {
                $window.location.href = linkUrl;
            }, pageMoveDelayTime);
        };

        // 일반 주문서 이동
        self.voiceUnableOrder = function (cartSn) {
            if (!cartSn) return false;

            $timeout(function () {
                $window.location.href = LotteCommon.orderFormUrl + "?" + LotteUtil.getBaseParam() + "&cartSn=" + cartSn;
            }, pageMoveDelayTime);
        };

        // 구매사은 상세 이동
        self.goSaunDetail = function (evtSn) {
            if (!evtSn) return false;

            $timeout(function () {
                $window.location.href = LotteCommon.eventSaunMain + "?" + LotteUtil.getBaseParam() + "&evt_no=" + evtSn;
            }, pageMoveDelayTime);
        };
        // 이벤트 상세 이동
        self.goEventDetail = function (linkUrl,isOutLink) {
            if (!linkUrl) return false;
            if(isOutLink){
                window.open(linkUrl);
            }else{
                $timeout(function () {
                    $window.location.href = linkUrl;
                }, pageMoveDelayTime);
            }
        };
        // 이벤트 응모 결과 이동
        self.goEventResult = function (evtSn) {
            if (!evtSn) return false;
            $timeout(function () {
                $window.location.href = LotteCommon.eventDetailUrl + "?" + LotteUtil.getBaseParam() + "&evt_no=" + evtSn;
            }, pageMoveDelayTime);
        };
        // 주문배송조회상세 이동
        self.goPurchaseView = function (orderNo) {
            if (!orderNo) return false;
            $timeout(function () {
                $window.location.href = LotteCommon.purchaseViewUrl + "?" + LotteUtil.getBaseParam() + "&orderNo=" + orderNo;
            }, pageMoveDelayTime);
        };
        // 스타일추천 상세 이동
        self.goStyleView = function (uploadedImg,cate,sortCate,gen , goodsNo) {
            if (!uploadedImg) return false;
            $timeout(function () {
                $window.location.href = LotteCommon.styleRecomUrl + "?" + LotteUtil.getBaseParam() + "&img=" + uploadedImg + "&cate=" + cate + "&sortCate=" + sortCate +"&prdGen=" + gen + "&goods_no=" + goodsNo;
            }, pageMoveDelayTime);
        };
        

    }]);

    // APP 연동 처리
    VCServiceModule.service('VCAppApi', ['LotteAppChk', '$window', 'VCPageMove', '$timeout', '$interval',
    function (LotteAppChk, $window, VCPageMove, $timeout, $interval) {
        /**
         * 음성발화, 음성인식 정책 기준
         * STT (Speech to Text) : 구글 API 활용 (STT 대기시간: 5초)
         * TTS (Text-to-speech) : 다음 API 활용
         */
        var self = this,
            appSchemaQue = [],
            appSchemaQueDelay = 200,
            AppSchemaQueInterval = null;

        self.isEnable = false; // 앱 기능 활성화 여부

        // 보이스 커머스 앱 기능 사용 가능 체크
        if (LotteAppChk.appObj.isApp &&
            (
                (LotteAppChk.appObj.isAndroid && LotteAppChk.appObj.verNumber > 400) ||
                (LotteAppChk.appObj.isIOS && LotteAppChk.appObj.verNumber > 4000)
            )) {
            self.isEnable = true;
        }

        // Android / iOS Schema Cancel 방지를 위한 Que 설정
        function addQueAppSchema(schema) {
            if (LotteAppChk.appObj.isAndroid) { // Andorid는 Que 사용 안함
                $window.location.href = schema;
            } else { // iOS는 Que 형태로
                appSchemaQue.push(schema);
                if (!AppSchemaQueInterval) { // 앱 스키마 큐에 내용이 없다면 인터벌 수행
                    AppSchemaQueInterval = $interval(execSchema, appSchemaQueDelay);
                }
            }
        }

        function execSchema() { // 정해진 인터벌 시간에 따른 앱 스키마 실행
            if (!self.isEnable) return false;

            // 앱 스키마 큐에 내용이 없다면 interval 취소
            if (appSchemaQue.length <= 0 && AppSchemaQueInterval) {
                $interval.cancel(AppSchemaQueInterval);
                AppSchemaQueInterval = null;
            } else {
                var targetSchema = appSchemaQue.pop();
                $window.location.href = targetSchema;
            }
        }
        //스타일추천 앱 버전 체크
        self.styleAppChk = function(){
            if (LotteAppChk.appObj.isApp &&
                (
                    (LotteAppChk.appObj.isAndroid && LotteAppChk.appObj.verNumber >= 418) ||
                    (LotteAppChk.appObj.isIOS && LotteAppChk.appObj.verNumber >= 4150)
                )) {
                return true;
            }
            return false;
        };
        // APP SilentMode Check
        self.getSilentMode = function () {
            console.log("talkshop://getSilentMode", self.isEnable);
            if (!self.isEnable) return false;
            // $window.location.href = "talkshop://getSilentMode";
            addQueAppSchema("talkshop://getSilentMode");
        };

        // APP Sound ON/OFF
        self.activatedSpeaker = function (flag) {
            var soundFlag = flag ? "Y" : "N";
            console.log("talkshop://activatedSpeaker?sound=" + soundFlag);
            if (!self.isEnable) return false;
            // $window.location.href = "talkshop://activatedSpeaker?sound=" + soundFlag;
            addQueAppSchema("talkshop://activatedSpeaker?sound=" + soundFlag);
        };

        // 앱 헤더 감추기
        self.hideHeader = function () {
            console.log("talkshop://hideHeader");
            if (!self.isEnable) return false;
            // $window.location.href = "talkshop://hideHeader";

            if (LotteAppChk.appObj.isIOS) {
                addQueAppSchema("talkshop://hideHeader");
            }
        };

        // 2차 범위 : status bar 칼라 변경 hex (#000000)
        // self.setStatusColor = function (color) {
        //     if (!self.isEnable) return false;
        //     var check = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.exec(color);
        //     if(!check) {
        //         return false;
        //     }
        //     addQueAppSchema("talkshop://statusColor?color=" + color);
        // };

        /* 2차 범위 : IOS 전용 카메라,앨범 권한 체크 
        * parameter type = camera or media
        */
        self.IOSCheckPermission = function (type) {
            if (!self.isEnable || !type) return false;
            var sendType = type;
            addQueAppSchema("talkshop://queryPermission?action=" + sendType);
        };

        // 앱 볼륨 조정
        // self.soundOnOff = function (flag) {
        //     var volumn = flag ? 100 : 0;
        //     console.log("talkshop://soundVolume?" + volumn);
        //     if (!self.isEnable) return false;
        //     $window.location.href = "talkshop://soundVolume?" + volumn;
        // };

        // 앱 보이스 커머스 종료
        self.exit = function () {
            console.log("talkshop://endTalk");
            if (self.isEnable && navigator.userAgent.indexOf("mlotte001") > -1) {
                try {
                    $window.location.href = "talkshop://endTalk";
                } catch (e) {
                    VCPageMove.go("goMain");
                }
            } else {
                VCPageMove.go("goMain");
            }
        };

        // 앱 TTS 발화
        self.startTTS = function (txt) {
            console.log("talkshop://startTTS?text=" + txt);
            //getScope().trace("talkshop://startTTS?text=" + txt);
            if (!self.isEnable || !txt) return false;
            // $window.location.href = "talkshop://startTTS?text=" + txt;
            addQueAppSchema("talkshop://startTTS?text=" + txt);
        };

        // 앱 TTS 종료
        self.stopTTS = function () {
            console.log("talkshop://stopTTS");
            //getScope().trace("talkshop://stopTTS");
            if (!self.isEnable) return false;
            // $window.location.href = "talkshop://stopTTS";
            addQueAppSchema("talkshop://stopTTS");
        };

        // 앱 STT 활성화
        self.startSTT = function (flag) {
        	isSTTWorking = true;
            var flagStr = flag ? "Y" : "N";
            console.log("talkshop://startSTT?sound=" + flag);
            //getScope().trace("talkshop://startSTT?sound=" + flag);
            if (!self.isEnable) return false;
            // $window.location.href = "talkshop://startSTT?sound=" + flag;
            addQueAppSchema("talkshop://startSTT?sound=" + flag);
        };

        // 앱 STT 비활성화
        self.stopSTT = function (flag) {
        	isSTTWorking = false;
            var flagStr = flag ? "Y" : "N";
            console.log("talkshop://stopSTT?sound=" + flag);
            //getScope().trace("talkshop://stopSTT?sound=" + flag);
            if (!self.isEnable) return false;
            // $window.location.href = "talkshop://stopSTT";
            addQueAppSchema("talkshop://stopSTT?sound=" + flag);
        };

        
        var isSTTWorking = false;
        
        /***********************************
         * APP API ADD Listener SET Callback Func.setIsSilentModeCallback
         * 앱 Callback Func은 voiceCommerce.js에서 할당 됨.
         ***********************************/
        // APP SilentMode Check
        self.isSilentModeCallbackFunc = function () {};
        self.setIsSilentModeCallback = function (callbackFunc) {
            if (typeof callbackFunc == "function") {
                self.isSilentModeCallbackFunc = callbackFunc;
            }
        };

        // 앱에서 TTS 발화 종료 후 돌려받을 Func 설정
        self.BackKeyCallbackFunc = function () {};
        self.setBackKeyCallback = function (callbackFunc) {
            if (typeof callbackFunc == "function") {
                self.BackKeyCallbackFunc = callbackFunc;
            }
        };

        // 앱에서 TTS 발화 종료 후 돌려받을 Func 설정
        self.TTSEndCallbackFunc = function () {};
        self.setTTSEndCallback = function (callbackFunc) {
            if (typeof callbackFunc == "function") {
                self.TTSEndCallbackFunc = callbackFunc;
            }
        };

        // 앱에서 STT 음성 인식 완료 후 돌려받을 Func 설정
        self.STTTextCallbackFunc = function () {};
        self.setSTTTextCallback = function (callbackFunc) {
            if (typeof callbackFunc == "function") {
                self.STTTextCallbackFunc = callbackFunc;
            }
        };

        // 앱에서 STT 음성 인식 상태 종료 후 돌려받을 Func 설정
        self.STTTEndCallbackFunc = function () {};
        self.setSTTEndCallback = function (callbackFunc) {
            if (typeof callbackFunc == "function") {
                self.STTTEndCallbackFunc = callbackFunc;
            }
        };
        
        // IOS 권한 체크 후 돌려받을 Func 설정
        self.VCPermisionCallbackFunc = function () {};
        self.setPermisionCallback = function (callbackFunc) {
            if (typeof callbackFunc == "function") {
                self.VCPermisionCallbackFunc = callbackFunc;
            }
        };

        /***********************************
         * APP Callback Func Window 등록
         ***********************************/
        // APP SilentMode Check
        $window.isSilentMode = function (flag) {
            console.log("[APP] isSilentMode", flag);
            self.isSilentModeCallbackFunc(flag);
        };

        // AOS 하드웨어 뒤로가기 Callback API
        $window.backKeyClicked = function () {
            console.log("[APP] backKeyClicked");
            self.BackKeyCallbackFunc();
        };
        
        // APP TTS End Callback
        $window.ttsEndCallback = function () {
            console.log("[APP] ttsEndCallback");
            //getScope().trace("[APP] ttsEndCallback");
            self.TTSEndCallbackFunc();
        };

        var sttTxtDelayTimer = null,
            lastSTTTxt = "",
            DelayTime = 600;


        $window.setSTTText = function (txt) {
            //console.log("[APP] setSTTText", txt);
            lastSTTTxt = txt;
            self.STTTextCallbackFunc(lastSTTTxt);
            // self.STTTextCallbackFunc(delayTxt);
        };
        
        // APP STT TXT Callback
        
        // APP STT End Callback (STT 시작 후 5초 이후 자동종료 시 Callback)
        $window.sttEndCallback = function (txt, prop) {
        	if(prop && prop.working === true){
        		isSTTWorking = true;
        	}
            if( ! isSTTWorking ){
            	//getScope().trace("------------------- block stt end cb")
            	return;
            }
        	
            if (sttTxtDelayTimer) {
                $timeout.cancel(sttTxtDelayTimer);
            }
            
            var root = getScope();
            
            sttTxtDelayTimer = $timeout(function () {
                //console.log("[APP] sttEndCallback1",  txt, lastSTTTxt)
            	if(root.isValidString(lastSTTTxt)){
            		self.STTTEndCallbackFunc(lastSTTTxt);
            	}else if(root.isValidString(txt)){
            		self.STTTEndCallbackFunc(txt);
            	}else{
                    console.log("마이크 업")
            		if(root.pageUI.inputMode == "mic"){
            			root.actionInput(null, 'keepMic');
            		}
            	}
            	
                /*if (lastSTTTxt && lastSTTTxt != "") {
                    self.STTTEndCallbackFunc(lastSTTTxt);
                }*/
                console.log("[APP] sttEndCallback2", txt, lastSTTTxt);
                //getScope().trace("[APP] sttEndCallback - " + txt + " - " + lastSTTTxt);

                lastSTTTxt = "";
            }, DelayTime);
        };

        // IOS 권한체크 콜백
        $window.VCPermisionCallback = function (type , access , filePath) {
            self.VCPermisionCallbackFunc(type , access , filePath)
        }

    }]);

    // 공유하기 실행 모음
    VCServiceModule.service('VDShareApp', ['LotteAppChk', '$window', function (LotteAppChk, $window) {
        var self = this;

        self.shareDataSet = function(obj) { // 공유데이터 기본 셋팅
            if(!obj) obj = {}; // 기본값 초기화

            // 기본값 셋팅
            var shareData = {
                goodsNo : obj.goodsNo, // 공유 상품번호
                goodsNm : obj.goodsNm, // 공유 상품명
                shareUrl : "http://" + location.hostname + '/product/m/product_view.do', // cdn없는 공유 링크(상품상세만 공유가능)
                noCdnUrl : '',
                shareImg : 'http://image.lotte.com/lotte/mobile/common/share_img_common.jpg', // 기본 공유이미지
                urlParam : {}, // url 파라메터
                shareTitle : '[롯데닷컴 이거어때?]\n', // 기본 공유 타이틀
                kakaoTitle : '[롯데닷컴]', // 카카오톡 링크 타이틀
            };
            
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { shareData.urlParam[key] = value; }); // url 파라메터 가져오기

            // 공유 이미지 정의
            if (angular.isDefined(obj.shareImg)) { //넘어온 공유하기 이미지 있을 경우 처리
                shareData.shareImg = obj.shareImg;
            }

            // 공유 링크 정의
            // shareData.noCdnUrl = shareData.shareUrl + "?goods_no=" + shareData.goodsNo + shareData.urlParam + "&cn=123624"; // 낙운님께 urlParam을 왜 붙이는지 확인 필요
            shareData.noCdnUrl = shareData.shareUrl + "?goods_no=" + shareData.goodsNo + "&cn=123624";

            return shareData;
        }

        self.sendAppShare = function(obj, type) {
            var shareData = self.shareDataSet(obj); // 공유데이터 기본 셋팅
            var cnShareUrl = ''; // cdn붙은 공유하기 url

            console.log("shareData", shareData);

            // 채널 코드 생성
            var talkCdn = "2929723",
                twitCdn = "2929720",
                stotyCdn = "2929722",
                smsCdn = "2929725",
                faceCdn = "2929721",
                urlCdn = "2929719";

            switch (type) {
                case "sms":
                    cnShareUrl = shareData.noCdnUrl + "&cdn=" + smsCdn;
                break;
                case "kakaotalk":
                    cnShareUrl = shareData.noCdnUrl + "&cdn=" + talkCdn;
                break;
                case "kakaostory":
                    cnShareUrl = shareData.noCdnUrl + "&cdn=" + stotyCdn;
                break;
                case "facebook":
                    cnShareUrl = shareData.noCdnUrl + "&cdn=" + faceCdn;
                break;
                case "twitter":
                    cnShareUrl = shareData.noCdnUrl + "&cdn=" + twitCdn;
                break;
                case "url_copy":
                    cnShareUrl = shareData.noCdnUrl + "&cdn=" + urlCdn;
                break;
                case "url_copy_voice":
                    cnShareUrl = shareData.noCdnUrl + "&cdn=" + urlCdn;
                break;
            }

            /* kakao link API에 따라 params 형태 달라지므로 분기 처리 */
            if (type != "kakaotalk") { // 카카오톡이 아닐 경우
            	/*var tit = "";
            	if(type == "facebook"){
            		tit = self.getShareTitle("", shareData.goodsNm).replace(/#/gi, "");
            	}else{
            		tit = self.getShareTitle(shareData.shareTitle, shareData.goodsNm).replace(/#/gi, "");
            	}*/
                var params = {
                    url : cnShareUrl,
                    title : self.getShareTitle(shareData.shareTitle, shareData.goodsNm).replace(/#/gi, ""),
                    imageUrl : shareData.shareImg
                };
            }else { // 카카오톡일 경우
                var params = {
                    type : "default",
                    title : shareData.kakaoTitle,
                    imageUrl : shareData.shareImg,
                    url : cnShareUrl,
                    buttons : [
                        {
                            title : "바로가기",
                            url : cnShareUrl
                        }
                    ]
                };

                if (type == "kakaotalk") { // 카카오일 경우 타이틀 처리 안함
                    params.desc =(shareData.goodsNm + "").replace(/#/gi, "");
                } else {
                    params.desc = self.getShareTitle(shareData.shareTitle, shareData.goodsNm).replace(/#/gi, "");
                }
            }
            
            self.shareAppCall(type, params); // 공유데이터 APP호출하기 // 공유하기 각 타입별로 실행
        }

        self.getShareTitle = function(shareTitle, goodsNm) { // 타이틀 값 조합 및 변경
            var title = shareTitle + goodsNm;

            try {
                title = title.replace("[[","[");
                title = title.replace("]]","]");
            } catch(e) { console.log( 'shareTitle replace err'); }

            return title;
        };

        self.shareAppCall = function(type, params) { // 공유데이터 APP호출하기
            if(LotteAppChk.appObj.isAndroid) {
                $window.lotteshare.callAndroid("lotteshare://" + type + "/query?" + JSON.stringify(params));
            } else if(LotteAppChk.appObj.isIOS) {
                $window.location = "lotteshare://" + type + "/query?" + JSON.stringify(params);
            }
        }
    }]);

    // 사만다 노출 하드코딩 메시지 정의
    VCServiceModule.service('VCMsgData', ['$filter' , function ($filter) {
        var self = this;

        // 사만다 메시지 타입 Object 생성
        self.getMsgData = function (txt, voice, position) {
            return {txt: txt, voice: voice, position: position};
        };
        // 로그인용 청구 반복 구문 붙이기
        self.getMsgRepeatDiscountDataLogin = function (arr,userAcgrCd ,userCardName,userName,voiceFlag) {
            var returnMsg = "";
            returnMsg += "지금 " + userName + "님이 자주 사용하시는 ";
            if(arr.length == 1){
                if(voiceFlag){
                    returnMsg += userCardName + "로 " + " " + $filter('number')(arr[0].tgtAmt) + "원 이상 결제하시면 " + arr[0].fvrVal + "퍼센트 청구할인 받으 실 수 있어요.";
                }else{
                    returnMsg += userCardName + "로 " + " " + $filter('number')(arr[0].tgtAmt) + "원 이상 결제하시면 " + arr[0].fvrVal + "% 청구할인 받으실 수 있어요.";
                }
            }else{
                var copyArr = angular.copy(arr);
                var userIdx = -1;

                for(var k=0; k<copyArr.length; k++){
                    
                    if(copyArr[k].acqrCd == userAcgrCd){
                        userIdx = k;
                    }
                };
                
                var userCardArr;
                if(userIdx >= 0){
                    userCardArr = copyArr.splice(userIdx,1);
                    if(voiceFlag){
                        returnMsg += userCardName + "로 " + " " + $filter('number')(userCardArr[0].tgtAmt) + "원 이상 결제하시면 " + userCardArr[0].fvrVal + "퍼센트.";
                    }else{
                        returnMsg += userCardName + "로 " + " " + $filter('number')(userCardArr[0].tgtAmt) + "원 이상 결제하시면 " + userCardArr[0].fvrVal + "%,";
                    }
                }
                
                if(copyArr.length > 0){
                    returnMsg += " 그밖에 "
                    for(var i=0; i<copyArr.length; i++){
                        if(voiceFlag){
                            returnMsg += copyArr[i].acqrNm + "로 " + " " + $filter('number')(copyArr[i].tgtAmt) + "원 이상 결제하시면 " + copyArr[i].fvrVal + "퍼센트";
                        }else{
                            returnMsg += copyArr[i].acqrNm + "로 " + " " + $filter('number')(copyArr[i].tgtAmt) + "원 이상 결제하시면 " + copyArr[i].fvrVal + "%";
                        }
                        if(i < copyArr.length-1) {
                            if(voiceFlag){
                                returnMsg += ". ";
                            }else{
                                returnMsg += ", ";
                            }
                        }
                    }
                }

                if(voiceFlag){
                    returnMsg += " 청구할인 받으 실 수 있어요. "
                }else{
                    returnMsg += " 청구할인 받으실 수 있어요."
                }
            }
            return returnMsg ;
        };

        // 청구 반복 구문 붙이기
        self.getMsgRepeatDiscountData = function (arr , searchNone ,userCardName,voiceFlag) {
            var returnMsg = "";
            if(searchNone){
            	 if(voiceFlag){
            		 returnMsg += userCardName +"는 청구할인을 진행하고 있지 않아요. ";
                 }else{
                	 returnMsg += userCardName +"는 청구할인을 진행하고 있지 않아요.<br />";
                 }
            }
            
            returnMsg += "지금 ";
            
            for(var i=0; i<arr.length; i++){
                if(voiceFlag){
                    returnMsg += arr[i].acqrNm + "로 " + " " + $filter('number')(arr[i].tgtAmt) + "원 이상 결제하시면 " + arr[i].fvrVal + "퍼센트";
                }else{
                    returnMsg += arr[i].acqrNm + "로 " + " " + $filter('number')(arr[i].tgtAmt) + "원 이상 결제하시면 " + arr[i].fvrVal + "%";
                }

                if(arr.length > 1 && i != arr.length-1){
                    if(voiceFlag){
                        returnMsg += " . ";
                    }else{
                        returnMsg += " , ";
                    }
                }
            }
            if(voiceFlag){
                return returnMsg += " 청구할인 받으 실 수 있어요.";
            }else{
                return returnMsg += " 청구할인 받으실 수 있어요.";
            }
        };

        // 특정 검색 무이자 반복 구문 붙이기
        self.getMsgRepeatSaleDataSearch = function (arr , searchNone , searchHave , userCardName , voiceFlag) {
            var returnMsg = "";
            if(searchNone){
                returnMsg += userCardName +"는 무이자할부를 진행하고 있지 않습니다. ";
            }
            if(!searchHave){
                if(voiceFlag){
                    returnMsg += "현재 무이자할부 진행중인 카드는. ";
                }else{
                    returnMsg += "현재 무이자할부 진행중인 카드는 ";
                }
            }
            for(var i=0; i<arr.length; i++){
                if(!searchNone){
                    if(arr.length == 1){
                        returnMsg += arr[i].acqrNm + "는 " + $filter('number')(arr[i].minAmt) + "원 이상 최대 " + arr[i].minMm + "개월, " + $filter('number')(arr[i].maxAmt) + "원 이상 최대 " + arr[i].maxMm + "개월 무이자할부 진행 중"
                    }
                }
                if(!searchHave){
                    returnMsg +=  arr[i].acqrNm;
                }
                if(i < arr.length -1 && arr.length != 1){
                    if(voiceFlag){
                        returnMsg += ". ";
                    }else{
                        returnMsg += ", ";
                    }
                }
            }
            return returnMsg += "입니다.";
        };
        // 일반 무이자 반복 구문 붙이기
        self.getMsgRepeatSaleData = function (arr) {

            var returnMsg = "";
            returnMsg += "현재 무이자할부 진행중인 카드에요";
            return returnMsg;

            // for(var i=0; i<arr.length; i++){
                
            //     if(arr.length == 1){
            //         returnMsg += arr[i].acqrNm + "는 " + $filter('number')(arr[i].minAmt) + "원 이상 최대 " + arr[i].minMm + "개월, " + $filter('number')(arr[i].maxAmt) + "원 이상 최대 " + arr[i].maxMm + "개월 무이자할부 진행 중"
            //     }else{
            //         if(i < arr.length ){
            //             returnMsg +=  arr[i].acqrNm;
            //         }
                    
            //         if(i < arr.length -1){
            //             returnMsg += ", ";
            //         }    
            //     }
            // }
            // return returnMsg += "입니다.";
        };
        // 포인트 반복 구문 붙이기
        self.getMsgRepeatPoint = function (arr) {

            var returnMsg = "";
            var checkArr = [];

            for(var i=0; i<arr.length; i++){
                if(arr[i].pointcount != "0" && arr[i].pointcount != 0){
                    checkArr.push(i);
                }
            }
            
            for(var i=0; i<arr.length; i++){
                
                if(arr[i].pointcount != "0" || arr[i].pointcount != 0){
                    if(arr[i].name == "L.point"){
                        returnMsg += "엘포인트 " + $filter('number')(arr[i].pointcount);
                    }else if(arr[i].name == "L-money"){
                        returnMsg += "엘머니 " + $filter('number')(arr[i].pointcount);
                    }else{
                        returnMsg += arr[i].name +" " + $filter('number')(arr[i].pointcount);
                    }
                    if(arr.length-1 != i){
                        returnMsg += ", ";
                    }
                }
                
                if(checkArr.length > 1){
                    if(arr.length-1 == i && arr[i].pointType == "clover" && arr[i].pointcount != "0" && arr[i].pointcount != 0 ){
                        returnMsg += "개를"
                    }else if(arr.length-1 == i && arr[i].pointType != "clover" && arr[i].pointcount != "0" && arr[i].pointcount != 0){
                        returnMsg += "점을"
                    }
                }else if(checkArr.length == 1){
                    if( arr[i].pointType == "clover" && arr[i].pointcount != "0"){
                        returnMsg += "개를"
                    }else if(arr[i].pointType != "clover" && arr[i].pointcount != "0"){
                        returnMsg += "점을"
                    }
                }
                
            }
            
            returnMsg += " 가지고 있어요.";
            if(checkArr.length == 1){
                returnMsg = returnMsg.replace(", ","")
            }
            return returnMsg;
        };
        
        self.replaceData = function(msgData , replaceDataArr){
            var viewInfo = angular.copy(msgData);
            if (replaceDataArr && replaceDataArr.length > 0) { // 치환할 문자가 있는지 판단
                var i = 0;

                for (i = 0; i < replaceDataArr.length; i++) {
                    var replaceTxt;
                    if(Number(replaceDataArr[i])){
                        replaceTxt = $filter('number')(replaceDataArr[i]);
                    }else{
                        replaceTxt =  replaceDataArr[i];
                    }
                    viewInfo.txt = (viewInfo.txt + "").replace("{}", replaceTxt);
                    viewInfo.voice = (viewInfo.voice + "").replace("{}", replaceTxt);
                }
            }
            return viewInfo;
        }
        // 사만다 정의된 메시지 타입
        self.msg = {
            unknown: {txt: "아직 제가 할 수 없는 일이에요.", voice: "아직 제가 할쑤 없는 일이에요.", position: "q"},
            nowLogin: {txt: "이미 로그인하셨습니다.", voice: "이미 로그인하셨습니다.", position: "q"},
            needLogin: {txt: "로그인이 필요해요.", voice: "로그인이 필요해요.", position: "voice"},
            needLoginYesNo: {txt: "로그인이 필요해요~ 로그인 하시겠어요?", voice: "로그인이 필요해요~ 로그인 하시겠어요?", position: "q"},
            bestKeyword: {txt: "인기있는 {} 추천해드려요.", voice: "인기있는 {} 추천해드려요.", position: "top"},
            prdDataEmpty: {txt: "어쩌죠? 원하시는 상품이 없어요..<br />아래 인기 키워드를 말해보는건 어떠세요?​", voice: "어쩌죠? 원하시는 상품이 없어요.. 아래 인기 키워드를 말해보는건 어떠세요?​", position: "top"},
            isHome: {txt: "첫 화면이에요.", voice: "첫 화면이에요.", position: "q"},
            homeMore: {txt: "무엇을 더 보여드릴까요?", voice: "무엇을 더 보여드릴까요?", position: "q"},
            prdListEnd: {txt: "지금 보시는 상품이 마지막이에요~", voice: "지금 보시는 상품이 마지막이에요~", position: "voice"},
            prdListEndList: {txt: "여기가 마지막이에요~", voice: "여기가 마지막이에요~", position: "voice"},
            prdStyleListEnd: {txt: "직접 터치해주세요!", voice: "직접 터치해주세요!", position: "voice"},
            notVoiceOrder: {txt: "죄송해요. 직접 터치해서 주문해주세요.", voice: "죄송해요. 직접 터치해서 주문해주세요.", position: "voice"},
            notVoiceWish: {txt: "죄송해요. 직접 터치해서 담아주세요.", voice: "죄송해요. 직접 터치해서 담아주세요.", position: "voice"},
            notMobileOrder: {txt: "죄송해요, PC에서 주문해주세요~", voice: "죄송해요, PC에서 주문해주세요~", position: "voice"},
            notVoiceWish: {txt: "죄송해요. 직접 터치해서 위시리스트에 담아주세요.", voice: "죄송해요. 직접 터치해서 위시리스트에 담아주세요.", position: "voice"},
            notVoiceCart: {txt: "죄송해요. 터치해서 찜해주세요.", voice: "죄송해요. 터치해서 찜해주세요.", position: "voice"},
            notSimpleMemberCartWish: {txt: "죄송해요. 엘포인트 통합회원만 구매 가능해요.", voice: "죄송해요. 엘포인트 회원만 구매 가능해요.", position: "q"},
            prdComment: {txt: "상품평 보여드릴게요~", voice: "상품평 보여드릴게요~", position: "q"},
            notPrdComment: {txt: "상품평이 없는 상품이에요~", voice: "상품평이 없는 상품이에요~", position: "q"},
            notPrdOption: {txt: "옵션이 없어요.", voice: "옵션이 없어요.", position: "q"},
            notPrdOptionHome: {txt: "옵션이 없어요.", voice: "옵션이 없어요.", position: "home"},
            prdOptShow: {txt: "옵션을 보여드릴까요?", voice: "옵션을 보여드릴까요?", position: "q"},
            prdDeliveryFree: {txt: "무료배송이에요~", voice: "무료배송이에요~", position: "q"},
            prdDeliveryCharge: {txt: "배송비는 {}원이고, {}원 이상 무료배송이에요~", voice: "배송비는 {}원이고, {}원 이상 무료배송이에요~", position: "q"},
            prdDeliveryDateSmart: {txt: "{}에서 픽업하는 상품입니다", voice: "{}에서 픽업하는 상품입니다", position: "q"},
            prdDeliveryDateRese: {txt: "지금 주문하시면 {} {} 되어요", voice: "지금 주문하시면? {} {} 되어요", position: "q"},
            prdDeliveryDateSet: {txt: "{}해 드려요", voice: "{}해 드려요", position: "q"},
            prdDeliveryDateRental: {txt: "{}드려요", voice: "{}드려요", position: "q"},
            prdDeliveryDate: {txt: "지금 주문하시면 {} {}이에요", voice: "지금 주문하시면? {} {}이에요", position: "q"},
            prdDeliveryDateCou: {txt: "{} 가능해요", voice: "{} 가능해요", position: "q"},
            prdDeliveryHolidayDate: {txt: "명절 기간으로 택배사별로 배송일이 달라요~", voice: "명절 기간으로 택배사별로 배송일이 달라요~", position: "q"},
            prdPrev: {txt: "이전 20개 상품 보여드릴게요.", voice: "이전 20개 상품 보여드릴게요.", position: "top"},
            prdNext: {txt: "다음 {}개 상품 보여드릴게요.", voice: "다음 {}개 상품 보여드릴게요.", position: "top"},
            alreadyWish: {txt: "이미 담은 상품이에요.", voice: "이미 담은 상품이에요.", position: "voice"},
            getWish: {txt: "위시리스트에 담았어요.", voice: "위시리스트에 담았어요.", position: "voice"},
            cartShow: {txt: "장바구니에 {}개의 상품이 있어요. 20개씩 보여드릴게요.", voice: "장바구니에 {}개의 상품이 있어요. 20개씩 보여드릴게요.", position: "top"},
            cartShowUnder: {txt: "장바구니에 {}개의 상품이 있어요.", voice: "장바구니에 {}개의 상품이 있어요.", position: "top"},
            cartNone: {txt: "찜한 상품이 없어요. &#x1F62E;", voice: "찜한 상품이 없어요.", position: "home"},
            wishShow: {txt: "위시리스트에 {}개의 상품이 있어요. 20개씩 보여드릴게요.", voice: "위시리스트에 {}개의 상품이 있어요. 20개씩 보여드릴게요.", position: "top"},
            wishShowUnder: {txt: "위시리스트에 {}개의 상품이 있어요.", voice: "위시리스트에 {}개의 상품이 있어요.", position: "top"},
            wishNone: {txt: "담긴 상품이 없어요. &#x1F62E;", voice: "담긴 상품이 없어요.", position: "home"},
            priceQuest: {txt: "원하는 가격대가 있으면 말해주세요.", voice: "원하는 가격대가 있으면 말해주세요.", position: "q"},
            helpQuest: {txt: '도움이 필요하시면 "도와줘!" 라고 말해보세요.', voice: '도움이 필요하시면 "도와줘!" 라고 말해보세요.', position: "q"},
            chkInventory: {txt: "{} {}부터 구매가능한 상품이에요~", voice: "{} {}부터 구매가능한 상품이에요~", position: "q"},
            notInventory: {txt: "죄송해요. 재고가 부족해요~", voice: "죄송해요. 잭오가 부족해요~", position: "q"},
            orderDecide: {txt: "선택하신 상품의 주문내역이에요.", voice: "결제를 진행할까요?", position: "top"},
            orderDecideDiscount: {txt: "{}원이 할인된 {}원에 결제 하실 수 있어요. 결제를 진행할까요?", voice: "결제를 진행할까요?", position: "top"},
            orderDecideHelp: {txt: '"응, 아니"라고 말해보세요', voice: "으으응. 또는. 아니 라고 말해보세요", position: "q"},
            orderProgress: {txt: '"직접 터치해서 결제 진행해주세요?', voice: "직접 터치해서 결제 진행해주세요?", position: "voice"},
            changeMyInfo: {txt: "변경 버튼을 눌러주세요", voice: "변경 버튼을 눌러주세요", position: "voice"},
            regiMydlvpPay: {txt: "배송지와 결제수단을 먼저 등록해주세요", voice: "배송지와 결제수단을 먼저 등록해주세요", position: "voice"},
            regiMydlvp: {txt: "배송지를 먼저 등록해주세요", voice: "배송지를 먼저 등록해주세요", position: "voice"},
            regiMypay: {txt: "결제수단을 먼저 등록해주세요", voice: "결제수단을 먼저 등록해주세요", position: "voice"},
            ispCancel: {txt: "ISP 결제가 취소되었습니다", voice: "ISP 결제가 취소되었습니다", position: "q"},
            errMinLmtQty: {txt: "최소 {}개부터 구매 가능한 상품입니다.", voice: "최소 {}개부터 구매 가능한 상품입니다.", position: "q"},
            errMxnLmtQty: {txt: "최대 {}개까지 구매 가능한 상품입니다.", voice: "최대 {}개까지 구매 가능한 상품입니다.", position: "q"},
            oftenShow: {txt: "자주 구매하는 {}개 상품입니다. 20개씩 보여드릴게요.", voice: "자주 구매하는 {}개 상품입니다. 20개씩 보여드릴게요.", position: "top"},
            oftenShowUnder: {txt: "자주 구매하는 {}개의 상품이 있어요.", voice: "자주 구매하는 {}개의 상품이 있어요.", position: "top"},
            oftenNone: {txt: "자주 구매한 상품이 없어요.<br />지금 쇼핑하고, 다음 구매 시 추천을 받아보세요!", voice: "자주 구매한 상품이 없어요! 지금 쇼핑하고! 다음 구매 시 추천을 받아보세요!", position: "home"},
            lateLoginedShow: {txt: "최근에 {}님이 본 상품이에요.", voice: "최근에 {}님이 본 상품이에요.", position: "top"},
            lateShow: {txt: "최근 본 {}개의 상품이 있어요.", voice: "최근 본 {}개의 상품이 있어요.", position: "top"},
            lateNone: {txt: "최근 본 상품이 없어요. &#x1F62E;", voice: "최근 본 상품이 없어요.", position: "home"},
            couponShow: {txt: "총 {}장의 쿠폰이 있어요.", voice: "사용 가능한 쿠폰이에요.", position: "top"},
            couponNone: {txt: "사용 가능한 쿠폰 내역이 없어요. &#x1F62E;", voice: "사용 가능한 쿠폰 내역이 없어요.", position: "home"},
            couponDown: {txt: "다운로드 가능한 쿠폰이 있어요! <br> 지금 받으러 갈까요?", voice: "다운로드 가능한 쿠폰이 있어요! 지금 받으러 갈까요?", position: "q"},
            couponHowToUse: {txt: "쿠폰을 마이롯데의 쿠폰에서 확인할 수 있으며, 주문서 작성 페이지에서 사용 가능한 쿠폰이 자동적으로 보이게 됩니다.", voice: "쿠폰을 마이롯데의 쿠폰에서 확인할 수 있으며, 주문서 작성 페이지에서 사용 가능한 쿠폰이 자동적으로 보이게 됩니다.", position: "home"},
            //구매사은
            saunShow: {txt: "신청진행 중인 구매사은 이벤트에요.", voice: "신청진행 중인 구매 사은 이벤트에요.", position: "top"},
            saunNone: {txt: "신청진행 중인 이벤트가 없어요. &#x1F62E;", voice: "신청진행 중인 이벤트가 없어요.", position: "home"},
            saunMyShow: {txt: "신청한 구매사은 이벤트에요.", voice: "신청한 구매 사은 이벤트에요.", position: "top"},
            saunMyNone: {txt: "신청한 구매사은 이벤트가 없어요. &#x1F62E;", voice: "신청한 구매 사은 이벤트가 없어요.", position: "home"},
            saunApplySuccess: {txt: "신청 완료되었어요.", voice: "신청 완료되었어요.", position: "q"},
            saunApplyAlready: {txt: "이미 신청이 완료된 이벤트에요.", voice: "이미 신청이 완료된 이벤트에요.", position: "q"},
            saunApplyNotTarget: {txt: "신청 가능한 대상이 아니세요~", voice: "신청 가능한 대상이 아니세요~", position: "q"},
            saunApplyFail: {txt: "이벤트 조건이 충족되지 않았네요!", voice: "이벤트 조건이 충족되지 않았네요!", position: "q"},
            saunAllApply: {txt: "신청가능한 구매사은 이벤트는 {}개이며, 모두 신청 완료되었어요.", voice: "{}개 신청 완료되었어요.", position: "top"},
            saunAllApplyNone: {txt: "신청가능한 구매사은 이벤트가 없어요. 결제 금액을 더 채워보세요! &#x1F62E;", voice: "신청가능한 구매 사은이 없어요. 결제 금액을 더 채워보세요!", position: "home"},
            saunMoreShow: {txt: "신청가능한 구매사은이벤트가 있어요.<br>지금 신청하러 갈까요?", voice: "신청가능한 구매 사은 이벤트가 있어요. 지금 신청하러 갈까요?", position: "q"},
            
            saleCardNone: {txt: "현재 무이자할부 진행중인 카드가 없습니다. &#x1F62E;", voice: "현재 무이자할부 진행중인 카드가, 없습니다.", position: "home"},
            discountNone: {txt: "현재 청구할인 진행중인 카드가 없습니다. &#x1F62E;", voice: "현재 청구할인 진행중인 카드가 없습니다.", position: "home"},
           
            //포인트&클로버
            pointCloverNone: {txt: "{} 없어요...", voice: "{} 없어요.", position: "top"},
            pointShow: {txt: "{} {}점 가지고 있어요.", voice: "{} {}점 가지고 있어요.", position: "top"},
            cloverShowUnder: {txt: "갖고계신 클로버는 총 {}개입니다.", voice: "갖고계신 클로버는 총 {}개입니다.", position: "top"},
            cloverShowOver: {txt: "갖고계신 클로버는 총 {}개입니다. 혜택으로 교환하러 갈까요?", voice: "갖고계신 클로버는 총 {}개입니다. 혜택으로 교환하러 갈까요?", position: "top"},
            cloverShowMil: {txt: "갖고계신 클로버는 총 {}개입니다. L-money 1,000점을로 교환하러 갈까요?", voice: "갖고계신 클로버는 총 {}개입니다. L-money 1,000점을로 교환하러 갈까요?", position: "top"},
            useCloverShow: {txt: "혜택으로 교환하러 갈까요?", voice: "혜택으로 교환하러 갈까요?", position: "q"},
            useCloverShowMil: {txt: "L-money 1,000점으로 교환하러 갈까요?", voice: "L-money 1,000점으로 교환하러 갈까요?", position: "q"},

            //미미뚜뚜
            mimiWorryShow: {txt: "지금 {}에게 필요한 것들이에요.", voice: "지금 {}에게 필요한 것들이에요.", position: "top"},
            mimiNoRegist: {txt: "등록된 우리 아이가 없어요.", voice: "등록된 우리 아이가 없어요.", position: "home"},
            mimiNoRegistQ: {txt: "아이 등록하러 미미뚜뚜 매장으로 이동할까요?", voice: "아이 등록하러 미미뚜뚜 매장으로 이동할까요?", position: "q"},
            mimiWorryNone: {txt: "지금 {} 나이에 챙겨줘야 할 것들이에요.", voice: "지금 {} 나이에 챙겨줘야 할 것들이에요.", position: "top"},
            mimiNone: {txt: "추천해줄 상품이 없어요. &#x1F62E;", voice: "추천해줄 상품이 없어요.", position: "home"},
            
            //마이추천해줘
            myRecommendShow: {txt: "고객님을 위한 추천입니다.", voice: "고객님을 위한 추천입니다.", position: "top"},
            myRecommendOnly: {txt: "오직 {}님만을 위한 추천입니다.", voice: "오직{}님만을 위한 추천입니다.", position: "top"},
            myRecommendNone: {txt: "추천 상품이 없네요. 더 많은 상품을 보고, 담을수록 추천이 풍성해집니다.", voice: "추천 상품이 없네요. 더 많은 상품을 보고, 담을수록 추천이 풍성해집니다.", position: "home"},

            //이벤트
            eventShow: {txt: "진행중인 대표 이벤트에요.", voice: "진행중인 대표 이벤트에요.", position: "top"},
            eventNone: {txt: "진행중인 대표 이벤트가 없어요.", voice: "진행중인 대표 이벤트가 없어요.", position: "home"},
            eventApplyShow: {txt: "이벤트 응모내역이에요.", voice: "이벤트 응모내역이에요.", position: "top"},
            eventApplyShowNone: {txt: "이벤트 응모내역이 없어요. &#x1F62E;", voice: "이벤트 응모내역이 없어요.", position: "home"},

            //즐겨찾기 브랜드
            favorBrandShow: {txt: "{} 신상품이 나왔어요.", voice: "{} 신상품이 나왔어요.", position: "top"},
            favorBrandNone: {txt: "즐겨찾는 브랜드가 없네요. 좋아하는 브랜드를 즐겨찾기 해보세요.", voice: "즐겨찾는 브랜드가 없네요. 좋아하는 브랜드를 즐겨찾기 해보세요.", position: "home"},

            //할인중인 장바구니
            cartSaleShow: {txt: "고객님을 기다리고 있는 할인 상품이에요. 상품이 사라지기 전에 서두르세요!", voice: "고객님을 기다리고 있는 할인 상품이에요. 상품이 사라지기 전에 서두르세요!", position: "top"},
            cartSaleNone: {txt: "가격 인하 중인 장바구니 상품이 없어요. &#x1F62E;", voice: "가격 인하 중인 장바구니 상품이 없어요.", position: "home"},
            
            //고객센터
            centerCounseling: {txt: "아래와 같이 말해보세요. 상담으로 바로 연결돼요.", voice: "아래와 같이 말해보세요. 상담으로 바로 연결돼요.", position: "top"},
            centerCounselingOtherTime: {txt: "지금은 상담이 불가능한 시간이에요... 일대일 문의로 이동할까요?", voice: "지금은 상담이 불가능한 시간이에요... 일대일 문의로 이동할까요?", position: "top"},
            centerUseQna: {txt: "공휴일을 제외한 평일 오전 9시~오후6시에 다시 찾아주세요.", voice: "공휴일을 제외한, 평일 오전 9시부터, 오후6시 사이에 다시 찾아주세요.", position: "q"},
            centerTalkOtherTime: {txt: "현재, 채팅상담 가능시간이 아닙니다. 그래도 이동할까요?", voice: "채팅상담 가능시간이 아닙니다. 그래도 이동할까요?", position: "top"},
            centerTalkQna: {txt: "현재 일대일 문의만 가능합니다.", voice: "현재 일대일 문의만 가능합니다.", position: "q"},
            centerQnaYn: {txt: "응, 아니라고 말해보세요.", voice: "으으응. 또는. 아니라고 말해보세요.", position: "q"},
            centerCall: {txt: "아래와 같이 말해보세요. 상담으로 바로 연결돼요.", voice: "직접 통화 버튼을 터치해주세요?", position: "voice"},
            centerCallOtherTime: {txt: "현재, 고객센터 연결 가능 시간이 아닙니다. 일대일 문의로 이동할까요?", voice: "현재 고객센터 연결 가능 시간이 아닙니다. 일대일 문의로 이동할까요?", position: "top"},
            centerCallQue: {txt: "직접 문의 내용 입력해주세요?", voice: "직접 무니 내용 입력해주세요?", position: "voice"},
            //비밀이벤트
            secretListNone: {txt: "오늘은 비밀상점 물건이 없어요..<br>내일 또 찾아주시겠어요?", voice: "오늘은 비밀상점 물건이 없어요. 내일 또 찾아주시겠어요?", position: "home"},

            //주문배송
            purchaseNone: {txt: "최근에 주문하신 적이 없어요.<br>주문배송조회로 이동할까요?", voice: "최근에 주문하신적이 없어요. 주문배송조회로 이동할까요?", position: "home"},
            purchaseNoneQnaYn: {txt: "응, 아니라고 말해보세요.", voice: "으으응. 또는. 아니라고 말해보세요.", position: "q"},
            purchaseDefaultShow: {txt: "최근 2주 동안 주문하신 상품이에요.", voice: "최근 2주 똥안 주문하신 상품이에요.", position: "top"},
            purchaseShow: {txt: "{} 주문하신 상품이에요.", voice: "{} 주문하신 상품이에요.", position: "top"},
            purchaseNameShow: {txt: "{}님의 주문 현황입니다.", voice: "{}님의 주문 현황입니다.", position: "top"},
            purchaseSendShow: {txt: "상품이 발송 되었습니다.", voice: "상품이 발송 되었습니다.", position: "q"},
            purchaseSendShowTop: {txt: "상품이 발송 되었습니다.", voice: "상품이 발송 되었습니다.", position: "top"},
            purchaseSendShowSended: {txt: "배송이 완료 되었습니다.", voice: "배송이 완료 되었습니다.", position: "q"},
            purchaseSendShowSendedTop: {txt: "배송이 완료 되었습니다.", voice: "배송이 완료 되었습니다.", position: "top"},
            purchaseExecShow: {txt: "{}가능한 주문이에요.", voice: "{}가능한 주문이에요.", position: "top"},
            purchaseExecNone: {txt: "{}가능한 주문이 없어요.<br>고객센터로 문의 부탁드려요.", voice: "{}가능한 주문이 없어요. 고객센터로 무니 부탁드려요.", position: "q"},
            purchaseSelectNone: {txt: "{}할 수 없는 주문상태에요.<br>고객센터로 문의 부탁드려요.", voice: "{}할 수 없는 주문상태에요. 고객센터로 무니 부탁드려요.", position: "q"},
            purchaseExecNoneHome: {txt: "{}가능한 주문이 없어요.<br>고객센터로 문의 부탁드려요.", voice: "{}가능한 주문이 없어요. 고객센터로 무니 부탁드려요.", position: "home"},
            purchaseDoingShow: {txt: "{} 및 {} 진행중인 내역이에요.", voice: "{} 및 {} 진행중인 내역이에요.", position: "top"},
            purchaseDoingNone: {txt: "최근에 {} 및 {} 진행중인 주문이 없어요. &#x1F62E;", voice: "최근에 {} 및 {} 진행중인 주문이 없어요.", position: "home"},
            purchaseCancleShow: {txt: "주문취소 내역이에요.", voice: "주문취소 내역이에요.", position: "top"},
            purchaseCancleNone: {txt: "최근에 취소한 주문이 없어요. &#x1F62E", voice: "최근에 취소한 주문이 없어요.", position: "home"},

            purchaseDetailLike: {txt: '"1번 자세히"처럼 말해주시겠어요?', voice: "1번 자세히,처럼 말해주시겠어요?", position: "q"},
            purchaseCancleLike: {txt: '"1번 취소해줘"처럼 말해주시겠어요?', voice: "1번 취소해줘,처럼 말해주시겠어요?", position: "q"},
            purchaseExchangeLike: {txt: '"1번 교환해줘"처럼 말해주시겠어요?', voice: "1번 교환해줘,처럼 말해주시겠어요?", position: "q"},
            purchaseReturnLike: {txt: '"1번 반품해줘"처럼 말해주시겠어요?', voice: "1번 반품해줘,처럼 말해주시겠어요?", position: "q"},
            purchaseOptionLike: {txt: '"1번 옵션 변경해줘"처럼 말해주시겠어요?', voice: "1번 옵션 변경해줘,처럼 말해주시겠어요?", position: "q"},
            purchaseDeliverLike: {txt: '"1번 배송지 변경해줘"처럼 말해주시겠어요?', voice: "1번 배송지 변경해줘,처럼 말해주시겠어요?", position: "q"},
            purchaseChangeLike: {txt: '"1번 옵션 변경해줘" 혹은 "1번 배송지 변경해줘"처럼 말해주시겠어요?', voice: "1번 옵션 변경해줘, 혹은 1번 배송지 변경해줘,처럼 말해주시겠어요?", position: "q"},

            //스타일 추천
            styleRecomShow: {txt: "비슷한 {} 추천해드릴게요.", voice: "비슷한 {} 추천해드릴게요.", position: "top"},
            styleRecomNone: {txt: "이 상품은 추천이 어려워요...패션 상품 중 스타일 추천 아이콘이 있는 상품으로 시도해주세요!", voice: "이 상품은 추천이 어려워요...", position: "q"},
            styleRecomStateNone: {txt: "죄송해요.. {} 상품은 스타일 추천이 어려워요!", voice: "죄송해요... {} 상품은 스타일 추천이 어려워요...", position: "q"},
            styleOtherQue: {txt: "더 자세한 스타일 추천 화면으로 이동할까요?", voice: "더 자세한 스타일 추천 화면으로 이동할까요?", position: "q"},
            styleSizeFail: {txt: "이 사진은 용량이 커 추천이 어려워요... {}MB 아래로 업로드 부탁드려요!", voice: "이 사진은 용량이 커 추천이 어려워요...", position: "q"},
            styleUploadFail: {txt: "사진 업로드에 실패했어요. 다시 시도해주세요.", voice: "사진 업로드에 실패했어요. 다시 시도해주세요.", position: "q"},
            styleSearchFail: {txt: "이 사진은 추천이 어려워요! 다른 사진으로 시도해주세요!", voice: "이 사진은 추천이 어려워요..", position: "q"},
            styleHasIconSearchFail: {txt: "추천 상품을 준비중이에요..다른 상품으로 시도해주세요!", voice: "추천 상품을 준비중이에요..", position: "q"},

            chulcheckSimple: {txt: "죄송해요... 간편회원 고객님은 이벤트 참여가 제한됩니다.", voice: "죄송해요. 간편회원 고객님은 이벤트 참여가 제한됩니다.", position: "q"},
            chulcheckSuccess: {
            	txt: "출석체크 완료! 이번 달 {}번 출석하셨네요.<br>오늘 클로버 {}개 적립해드릴게요~",
            	voice: "출석체크 완료... 클로버 적립해드릴게요.",
            	position: "top"
            },
            chulcheckAlready: {
            	txt: "이미 출석체크를 하셨네요!<br>내일 또 참여해주세요~",
            	voice: "이미 출석체크를 하셨네요.",
            	position: "top"
            },
            chulcheckBenefit: {txt: "클로버로 교환 가능한 혜택이 있어요! 지금 교환하러 갈까요?", voice: "클로버로 교환 가능한 혜택이 있어요. 지금 교환하러 갈까요.", position: "q"},
            
            //남들은 뭘봤지
            othersHave: {txt: "다른 고객들이 함께 본 상품이에요.", voice: "다른 고객들이 함께 본 상품이에요.", position: "top"},
            othersHaveNone: {txt: "추천상품이 없어요...", voice: "추천상품이 없어요...", position: "home"},

            networkError : {txt: "앗, 현재 네트워크 연결이 불안정해요. 잠시 후에 시도해주세요.", voice: "앗, 현재 네트워크 연결이 불안정해요. 잠시 후에 시도해주세요.", position: "q"},
        };
    }]);

    // 개발 모드 명령어 모음
    VCServiceModule.service('VCDevMode', [function () {
        var self = this;

        self.DEV_COMMAND = [
             {name:"actionProdComment", command: "actionProdComment"},
            //{name:"talk", command: "talk", data: {homeScreenMent: "일상대화 테스트"}},
            {name:"남들은뭘봤지", command: "getOthersHaveSeen"},
            {name:"마이추천", command: "getRecommendMy"},
            {name:"구매사은지급적립", command: "getPurchaseGiftInformation"},
            {name:"스타일추천", command: "getStyle"},
            {name:"카메라호출", command: "actionCamera"},
            {name:"미디어호출", command: "actionAlbum"},
            {name:"취소해줘", command: "actionCancel",data:{commandNumber:100}},
            {name:"옵션변경", command: "actionProdOptChange",data:{commandNumber:1}},
            {name:"배송지변경", command: "actionChangeDelivery",data:{commandNumber:1}},
            {name:"actionDetail", command: "actionDetail",data:{commandNumber:1}},
            {name:"이전", command: "actionBack"},
            {name:"주문내역", command: "getOrderList",data:{commandPeriod:"지지난주"}},
            {name:"주문내역언제와", command: "getOrderInquire"},
            {name:"주문내역반품", command: "actionReturn"},
            {name:"주문내역교환", command: "actionExchange"},
            {name:"주문내역배송지변경", command: "getOrderChangeShipping"},
            {name:"주문내역옵션변경", command: "getOrderChangeOption"},
            {name:"주문내역취소", command: "getOrderCancle"},
            {name:"교환중인 주문 내역", command: "getExchangeInProgressOrder"},
            {name:"반품중인 주문 내역", command: "getReturnInProgressOrder"},
            {name:"취소한 주문 내역", command: "getCancelOrder"},
            {name:"주문 방문 일자 정보 변경", command: "getOrderExchangeVisitInformation"},
            {name:"다음", command: "actionNext"},
            {name:"더보여줘", command: "actionMore"},
            {name:"위로", command: "actionUp"},
            {name:"아래로", command: "actionDown"},
            {name:"상황추천", command: "situation_recommendation",data: {goodsNoList: "5522725,5523769",commandBrand: "구찌",preReqParam: "&talk_id=2&keyword=브랜드&searchType=T",recommendData:'{}'}},
            {name:"비밀이벤트", command: "getSecretEvent",data: {goodsNoList: "5522725,5523769",commandBrand: "구찌",preReqParam: "&talk_id=2&keyword=브랜드&searchType=S",recommendData:'{}'}},
            
            {name:"즐겨찾기브랜드", command: "getNewProduct",data: {goodsNoList: "5522725,5523769",commandBrand: "구찌",preReqParam: "&talk_id=2&keyword=브랜드&searchType=T"}},
            {name:"쿠폰", command: "getCoupon"},
            {name:"쿠폰이용방법", command: "getCouponHowToUse"},
            {name:"포인트", command: "getPoint",data: {commandPoint: "point"}},
            {name:"포인트_엘포인트", command: "getLPoint",data: {commandPoint: "lpoint"}},
            {name:"포인트_엘머니", command: "getLMoney",data: {commandPoint: "lmoney"}},
            {name:"포인트_보관금", command: "getDeposit",data: {commandPoint: "deposit"}},
            {name:"포인트_클로버", command: "getPoint",data: {commandPoint: "clover"}},
            {name:"포인트_엘포인트상세", command: "actionPointDetail"},
            {name:"포인트_엘머니상세", command: "actionMoneyDetail"},
            {name:"포인트_보관금상세", command: "actionDepositDetail"},
            {name:"포인트_클로버상세", command: "actionCloverDetail"},
            {name:"이벤트", command: "getEvent"},
            {name:"이벤트응모내역", command: "getEventApplicationDetail"},
            {name:"구매사은이벤트", command: "getPurchaseGift"},
            {name:"구매사은신청한거", command: "getPurchaseGiftInformation"},
            {name:"구매사은신청1번", command: "actionApply",data: {commandNumber: '2'}},
            {name:"구매사은모두신청", command: "getPurchaseGiftApply"},
            {name:"청구할인", command: "getDiscount"},
            {name:"청구할인(카드선택)", command: "getDiscount" ,data: {commandCard: '026'}},//롯데카드
            {name:"청구할인(카드없음)", command: "getDiscount" ,data: {commandCard: '030'}},//삼성카드
            {name:"무이자", command: "getInProgressInterestFreeInstallment"},
            {name:"무이자(카드선택)", command: "getInterestFreeInstallment",data: {commandCard: '026'}},//롯데카드
            {name:"무이자(카드없음)", command: "getInterestFreeInstallment",data: {commandCard: '031'}},//삼성카드
            {name:"고객센터", command: "getCenter"},
            {name:"톡상담", command: "goCenterTalk"},
            {name:"전화연결", command: "goCenterCall"},
            {name:"1:1문의", command: "goCenterQue"},
            {name:"자주구매상품", command: "getOftenList"},
            {name:"최근본상품", command: "getLately"},
            {name:"주문언제와", command: "getOrderInquire"},
            {name:"주문취소", command: "getOrderCancle"},
            {name:"E쿠폰 재발송", command: "getOrderECouponResend"},
            {name:"미미뚜뚜", command: "getMimitoutou"},

            {name:"상품평관리", command: "goCiritOut"},
            {name:"상품내역문의", command: "goInqList"},
            {name:"일대일 문의/답변", command: "goInquire"},
            {name:"교환권", command: "goPresent"},
            {name:"스마트페이관련", command: "goSmartPay"},
            {name:"영수증이벤트", command: "goReceiptList"},
            {name:"자주구매상품이동", command: "goFrequentlyPurchaseProduct"},
            
            
            {name:"할인중인장바구니", command: "getDiscountedShoppingCart"},
            {name:"다른사람이본상품", command: "getOthersHaveSeen"},
            // {name:"goLogin", command: "goLogin"},
            // {name:"goChangePayment", command: "goChangePayment"},
            
            // {name:"goPurchaseList", command: "goPurchaseList"},
            // {name:"goCoupon", command: "goCoupon"},
            // {name:"goPoint", command: "goPoint"},
            // {name:"goCart", command: "goCart"},
            // {name:"goWish", command: "goWish"},
            // {name:"goMyLotte", command: "goMyLotte"},
            // {name:"goEvent", command: "goEvent"},
            // {name:"goPurchaseGiftList", command: "goPurchaseGiftList"},
            // {name:"goMembership", command: "goMembership"},
            // {name:"goRecently", command: "goRecently"},
            // {name:"goMallMimitoutou", command: "goMallMimitoutou"},
            // {name:"goMallSpecialTasty", command: "goMallSpecialTasty"},
            // {name:"goMallStyleshop", command: "goMallStyleshop"},
            // {name:"goMallLottebrand", command: "goMallLottebrand"},
            // {name:"goMallKshop", command: "goMallKshop"},
            // {name:"goMallScalp", command: "goMallScalp"},
            // {name:"goMallTVoutlet", command: "goMallTVoutlet"},
            // {name:"goMallBook", command: "goMallBook"},
            // {name:"goMallTenbyten", command: "goMallTenbyten"},
            // {name:"goMallVine", command: "goMallVine"},
            // {name:"goMain", command: "goMain"},
            // {name:"goMainBest", command: "goMainBest"},
            // {name:"goMainGift", command: "goMainGift"},
            // {name:"goMainEvent", command: "goMainEvent"},
            // {name:"goLuckybox", command: "goLuckybox"},
            // {name:"goDirectAttend", command: "goDirectAttend"},
            // {name:"goPurchaseGift", command: "goPurchaseGift"},
            // {name:"goTalkAdvice", command: "goTalkAdvice"},
            {name:"actionHelp", command: "actionHelp"},
            // {name:"actionChangeMyInfo", command: "actionChangeMyInfo"},
            // {name:"actionFirst", command: "actionFirst"},
            // {name:"actionClose", command: "actionClose"},
            // {name:"actionUnknown", command: "actionUnknown"},
            // {name:"actionOrder", command: "actionOrder"},
            
            // {name:"actionAddWish", command: "actionAddWish"},
            // {name:"actionAddCart", command: "actionAddCart"},
            // {name:"actionShare", command: "actionShare"},
            // {name:"actionShareKakao", command: "actionShareKakao"},
            // {name:"actionShareKaKaoStory", command: "actionShareKaKaoStory"},
            // {name:"actionShareTwitter", command: "actionShareTwitter"},
            // {name:"actionShareSMS", command: "actionShareSMS"},
            // {name:"actionShareFacebook", command: "actionShareFacebook"},
            // {name:"actionShareURL", command: "actionShareURL"},
            // {name:"actionProdImg", command: "actionProdImg"},
            
            // {name:"actionProdOptShow", command: "actionProdOptShow"},
            
            // {name:"answerDeliveryFee", command: "answerDeliveryFee"},
            // {name:"answerDeliveryTime", command: "answerDeliveryTime"},
            {name:"actionYesNo", command: "actionYesNo", data: {commandVal: "Y"}},
            // {name:"actionNumber", command: "actionNumber", data: {commandNumber: 1}},
            {name:"getCart", command: "getCart"},
            {name:"getWish", command: "getWish"},
            {name:"getRecom", command: "getRecom", data: {goodsNoList: "1234,444", topScreenMent: "aaaa", preReqParam: "&talk_id=2&keyword=%EB%82%98%EC%9D%B4%ED%82%A4+%EC%97%AC%EC%84%B1",recommendData:'{"ageValue":null,"ageLabel":null,"age":null,"genderValue":null,"genderLabel":null,"gender":null,"priceVariableName":null,"priceVariableValue":null,"priceMin":0,"priceMax":0,"priceOnly":false,"itemValue":"원피스","nameValue":null,"preItemValue":null,"mGrpNo":"7112","ctgNo":"5415550","dsCtgDepth":"2","itemCombination":false,"brandValue":null,"brandNo":null,"keyword":null,"ner":null,"colorValue":null,"colorLabel":null,"color":null,"colorOnly":false,"sort":null,"freeDeliYN":null,"freeInstYN":null,"pointYN":null,"pkgYN":null,"delTdarYN":null,"delQuickYN":null,"deliveryAndBenefitOnly":false,"multiCondition":false,"deliveryAndBenefit":false,"searchType":"C"}'}}
        ];
    }]);
})(window, window.angular);