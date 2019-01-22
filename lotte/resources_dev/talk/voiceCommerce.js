(function(window, angular, undefined) {
	'use strict';
    
	var app = angular.module('app', [
        "lotteComm",
        "voiceCommerceService",
        "angular-carousel",
        "lotteSlider"
	]);
    
    // 보이스커머스 헤더 Controller
	app.controller('VoiceCommerceHeaderCtrl', ['$scope', 'LotteCommon', 'commInitData', 'VCAppApi', 'LotteAppChk', 
    function ($scope, LotteCommon, commInitData, VCAppApi, LotteAppChk) {
        // 앱 볼륨 조정
        $scope.toggleSound = function (flag) {
            $scope.pageUI.app.soundFlag = flag;
            VCAppApi.activatedSpeaker($scope.pageUI.app.soundFlag);
            
            if(flag) { //소리 켤 때
                $scope.setVCAnalysis("소리_ON");
            	$scope.setGATag("공통_상단영역", "소리_ON", null, "click");
            } else { //소리 끌 때
                $scope.setVCAnalysis("소리_OFF");
            	$scope.setGATag("공통_상단영역", "소리_OFF", null, "click");
            }
        };

        // 도움말 활성화/비활성화
        $scope.toggleHelp = function (flag) {
            $scope.setVCAnalysis("도움말");
            $scope.VCCtrl.loadChangehelp({actionHelp:"open"}, null, "click");
        };

        // 보이스 커머스 종료
        $scope.exit = function (click) {
            if(click == "btn"){
                $scope.setVCAnalysis("닫기");
            	$scope.setGATag("공통_상단영역", "닫기", null, "click");
            }
            VCAppApi.exit();
        };
    }]);
    
    // 보이스커머스 헤더
    app.directive("voiceHeader", [function () {
		return {
			templateUrl : "/lotte/resources_dev/talk/voiceCommerce_header.html",
            replace : true,
            controller: 'VoiceCommerceHeaderCtrl',
			link : function($scope, el, attrs) {
                // console.log("보이스커머스 헤더");
            }
        }
    }]);
    
    // 보이스커머스 SideNav Controller
	app.controller('VoiceCommerceSideNavCtrl',
			['$scope', '$window', 'LotteCommon', 'commInitData', 'LotteUserService', 'VCBasicInfo', 'VCOrder', 'LotteStorage', '$timeout', "LotteForm", 
    function( $scope,   $window,   LotteCommon,   commInitData,   LotteUserService,   VCBasicInfo,   VCOrder,   LotteStorage,   $timeout,   LotteForm) {
        // console.log("보이스커머스 Side Nav 컨트롤러");rue);

        // Side Nav 안드로이드 물리키 제어를 위한 State조작 추가
        // angular.element($window).on("popstate", function (event) {
        //     var currentState = history.state;
        //     console.log("popstate event", currentState);
        // });

        $scope.basicInfo = VCBasicInfo.initBasicInfo(); //음성데이터기본정보 가져오기
        $scope.SemanticHistory = VCBasicInfo.getSemanticeHistory();
        // console.info($scope.SemanticHistory);

        $scope.EVT_TXT_IONSTORAGE_FLAG = "vcEvtTxtHideFlag"; //이벤트 텍스트 세션 네임

        // 사이드 Navigation Toggle
        $scope.toggleSideNav = function (flag) {
            if ($scope.pageUI.evtTxtShowFlag) { // 이벤트 텍스트 가리기
                $scope.hideEvtTxt();
            }

            $scope.pageUI.sideNavOpenFlag = flag;
            angular.element("#myinfoWrap").scrollTop(0);

            if (flag) { // 햄버거 열기 시
                $scope.setVCAnalysis("햄버거");
                $scope.setGATag("공통_상단영역", "햄버거", null, "click");
            } else { // 햄버거 닫기 시
                $scope.setGATag("햄버거_공통", "닫기", null, "click");
            }
        };

        // 사이드 Navigation 발화가이드 Toggle
        $scope.toggleSideNavGuide = function (flag, btn) {
            $scope.pageUI.sideNavGuideOpenFlag = flag;
            angular.element("#guideWrap").scrollTop(0);
            
            if (flag) { //가이드 전체보기 열기 시            	
            	$scope.setGATag("햄버거_가이드", "전체보기", null, "click");
            } else { //가이드 전체보기 닫기 시
            	if(btn == "back"){
            		$scope.setGATag("햄버거_가이드", "뒤로", null, "click");
            	}else{
            		$scope.setGATag("햄버거_가이드", "닫기", null, "click");
            	}
            }
        };

        // 로그인 정보 확인
        LotteUserService.promiseLoginInfo()
        .finally(function (loginInfo) {
        	$timeout(function(){
        		promiseLoginInfoFinal(loginInfo);
        	}, 100);
        });
        
        function promiseLoginInfoFinal(loginInfo){

            var mbrNo = null;

            if ($scope.loginInfo.isLogin && $scope.loginInfo.mbrNo) {
                mbrNo = $scope.loginInfo.mbrNo;
            }

            $scope.pageLoading = true; // 로딩바

            // 초기 햄버거에 노출되는 데이터 호출
            VCBasicInfo.getBasicInfo(mbrNo)
            .then(function (basicInfo) {
                $scope.pageLoading = false; // 로딩바 제거

                $scope.basicInfo = basicInfo;
                
                // 결재수단 확인
                if ($scope.basicInfo.member_info.pay_mean_cd == "40") { // 결재수단이 Lpay 라면
                    VCOrder.initLpay(); // Lpay 초기화
                    VCOrder.authLpayMerchant($scope.basicInfo.member_info.onlCno, function (authFlag) { // Lpay 가맹점 코드 인증
                        // console.log("authFlag", authFlag);
                        if (authFlag) {
                            // console.log("Lpay 인증 성공");

                            VCOrder.getLpayPaymentInfo($scope.basicInfo.member_info.pay_card_rcgn_id, function (data) {
                                if (data) {
                                    // console.log("결제 수단 확인 성공", data);
                                    $scope.basicInfo.member_info.fnCoNm = data.fnCoNm;
                                    $scope.basicInfo.member_info.pmtMthdAlias = data.pmtMthdAlias;
                                } else {
                                    console.error("결제 수단 확인 실패");
                                    $scope.basicInfo.member_info.base_op_pay_chk = false;
                                }
                            });
                        } else {
                            console.error("Lpay 인증 실패");
                            $scope.basicInfo.member_info.base_op_pay_chk = false;
                        }
                    });
                }
            })
            .catch(function (basicInfo) {
                $scope.basicInfo = VCBasicInfo.initBasicInfo();
            })
            .finally(function () {
                $scope.pageLoading = false; // 로딩바
            });
            
            // 햄버거 옆 이벤트 텍스트 정보 호출
            if (LotteStorage.getSessionStorage($scope.EVT_TXT_SESSIONSTORAGE_FLAG) != "Y" ) {
                $scope.pageLoading = true; // 로딩바

                VCBasicInfo.getEvtTxt()
                .then(function (evtTxt) {
                    $scope.pageUI.evtTxt = evtTxt;
                    if ($scope.pageUI.state == "home"){
                        $scope.pageUI.evtTxtShowFlag = true;
                        $scope.setVCAnalysis("햄버거이벤트");
                    }
                })
                .catch(function () {
                    // console.log("햄버거 옆 이벤트 텍스트 없음");
                })
                .finally(function () {
                    $scope.pageLoading = false; // 로딩바
                });
            } else {
            	$scope.pageUI.evtTxtShowFlag = false;
            }

            LotteStorage.setSessionStorage($scope.EVT_TXT_SESSIONSTORAGE_FLAG, "Y");
            
            $scope.pageLoading = true; // 로딩바

            // BG 데코
            VCBasicInfo.getBgDeco()
            .then(function (imgUrl) {
            	if($scope.isValidString(imgUrl)){
            		$scope.pageUI.bgDecoStyle = "background-image:url(" + imgUrl + ")"
            	}
            })
            .catch(function(){})
            .finally(function () {
                $scope.pageLoading = false; // 로딩바
            });
        };

        $scope.hideEvtTxt = function () { // 이벤트 텍스트 숨기기
        	if($scope.pageUI.evtTxtShowFlag){
        		$scope.setGATag("햄버거이벤트", "햄버거이벤트", null, "click");
        	}
        	
            if(!$scope.pageUI.evtTxtShowFlag) return;
            $scope.pageUI.evtTxtShowFlag = false;
            LotteStorage.setSessionStorage($scope.EVT_TXT_SESSIONSTORAGE_FLAG, "Y");            
        };

        // 히스토리 터치 시 의미분석 전달
        $scope.sendHistory = function (historyTxt) {
            $scope.sendSemantic('click', historyTxt.replace(/\"/gi, ""),true);
            $scope.setGATag("햄버거_히스토리", "클릭", null, "click");
            $scope.pageUI.sideNavOpenFlag = false; // 의미분석 전달하며, 햄버거 닫기            
        };
    }]);
    
    // 보이스커머스 SideNav 디렉티브
    app.directive("voiceNav", ['VCPageMove', '$window', 
    function (VCPageMove, $window) {
		return {
			templateUrl : "/lotte/resources_dev/talk/voiceCommerce_sidenav.html",
            replace : true,
            controller: 'VoiceCommerceSideNavCtrl',
			link : function($scope, el, attrs, $ctrl) {
                $scope.speechBoxTabIdx = 0;
                $scope.voiceInfoLayer = false;
                
                $scope.voiceNavVCPageMove = function (command) { // SideNav용 페이지 이동
                	if(command == "actionChangeDelivery"){
                		if($scope.basicInfo.member_info.et_mbr_dlvp_chk == true){
                			$scope.setGATag("햄버거_등록변경", "배송지", null, "click");
                		} else{
                			$scope.setGATag("햄버거_등록", "배송지", null, "click");	
                		}
                	}else if(command == "goChangePayment"){
                		if($scope.basicInfo.member_info.base_op_pay_chk == true){
                			$scope.setGATag("햄버거_등록변경", "결제수단", null, "click");
                		} else{
                			$scope.setGATag("햄버거_등록", "결제수단", null, "click");
                		}
                		
                	}
                    VCPageMove.go(command, $scope.loginInfo.isLogin);
                };

                // 사만다 음성 가이드 리스트 스와이프 컨트롤러 구하기
                $scope.samandaListController = null;
                $scope.getSamadaListControl = function (controller) {
                    $scope.samandaListController = controller;
                };

                $scope.samadaListSwiperEnd = function (idx) { // 사만다 음성 가이드 스와이프 End Callback Func.
                    $scope.speechBoxTabIdx = idx;
                    $scope.setGATag("햄버거_가이드", "탭이동", null, "click");
                };

                $scope.speechBoxTabSelect = function(idx) { // 이렇게말해보세요 탭이동
                    $scope.samandaListController.moveIndex(idx);
                };

                $scope.toggleVoiceInfoLayer = function (event) { // 음성주문 안내레이어 Show/Hide toggle
                    $scope.voiceInfoLayer = !$scope.voiceInfoLayer;
                    if ($scope.voiceInfoLayer) { // 안내 레이어 열렸을 때 다른 곳 클릭하면 레이어 닫히게
                        angular.element($window).on("click.voiceInfoLayer", function () {
                            angular.element($window).off("click.voiceInfoLayer");
                            $scope.toggleVoiceInfoLayer();
                        });
                        $scope.setGATag("햄버거_공통", "인포", null, "click");
                    } else { // 안내 레이어 닫혔을 때 이벤트 해제
                        angular.element($window).off("click.voiceInfoLayer");
                    }
                    
                    if (event) { // 이벤트 전파 방지
                        event.stopPropagation();
                    }
                };

                // 음성 레이어 안내 클릭 시 이벤트 전파 방지
                $scope.infoLayerClick = function (event) {
                    event.stopPropagation();                    
                };
                
                angular.element(".myinfo_side_wrap .guide_wrap").on("scroll touchmove mousewheel", function(){
                	 $scope.setGATag("햄버거_가이드", "스크롤", null, "click"); 
                });

            }
        }
    }]);
    
    // 보이스커머스 컨테이너 Controller (TalkShoppingCtrl, VoiceCommerceCtrl)
    app.controller('VoiceCommerceCtrl', ['$scope', 'commInitData', 'VCDevMode', 'VCBasicInfo', '$timeout', 'VCMsgData', 'VCAppApi', 'LotteGA', 'LotteCommon', '$window', 'LotteStorage', '$location', 'StyleRecom', 'VCSendMsg',
    function ($scope, commInitData, VCDevMode, VCBasicInfo, $timeout, VCMsgData, VCAppApi, LotteGA, LotteCommon, $window, LotteStorage, $location ,StyleRecom ,VCSendMsg) {
        
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.pageLoading = true; // 데이터 로딩 유무
        $scope.pageSaunLoading = false; // 사은 모두신청 데이터 로딩 유무
        
        $scope.pageUI = {
            layerAnimate :false,//레이어 애니메이션 ing 값
            layerAnimateTime :500, //레이어 애니메이션 시간
            layerAnimateTimeout :null, //레이어 애니메이션 타임아웃
            referrerUrl: null, // 이전 페이지 URL
            curDispNo: "5607666", // 유입전시코드
            curDispNoSctCd: "17", // 유입전시구분코드
            state: "home", // 홈: home, 상품리스트(추천): prod_list, 상품상세: prod_detail, 장바구니: cart, 위시: wish, 주문확정: order, 주문완료: order_complete
            orderState : "",//주문배송 전용 구분
            stateHistory: [{state:"home",msgTop:""}], // 화면 상태 변경 이력 저장 (home이 기본이기 때문에 home 하나는 기본 세팅)
            semanticFlag: false, // 의미분석 중인지 여부
            voiceGuideInfo: [], // 음성 발화 가이드 안내(인기키워드 포함)
            curVoiceGuideIdx: 0, // 음성 발화 가이드 안내 현재 선택된 Index
            evtTxtShowFlag: false, // 이벤트 텍스트 말풍선 노출 여부
            evtTxt: "", // 햄버거 옆 이벤트 말풍선 (최초 1회만 노출)
            sideNavOpenFlag: false, // 햄버거 레이어
            sideNavGuideOpenFlag: false, // 햄버거 발화 가이드 전체보기
            showHotKeyword: false, // 추천상품없을 때 추천 키워드 노출 여부
            hotKeyword: [], // 추천상품없을 때 추천 키워드 데이터
            showShare: false, // SNS 공유하기 레이어 노출 여부
            showMsg: {
                guide: true, // 음성발화 가이드 (인기키워드) Show/Hide Flag
                home: false, // 중앙 발화 영역 Show/Hide Flag
                top: false, // 상단 발화 영역 Show/Hide Flag
                q: false // 질의 발화 영역 Show/Hide Flag
            },
            msg: {
                home: "", // 사만다 메시지 중앙
                top: "", // 사만다 메시지 상단
                q: "", // 사만다 메시지 하단
            },
            showHelp: false, // 도움말 레이어 Show/Hide Flag
            showAlert: false, // 장바구니 담기, 위시 찜하기 Show/Hide Flag
            alertType: "", // Alert 타입 (cart: 장바구니, wish: 위시)
            showPrdImgDetail: false, // 상품이미지 리스트보기 레이어 Show/Hide Flag
            showPrdComment: false, // 상품평 레이어 Show/Hide Flag
            showPrdOpt: false, // 상품 옵션 레이어 Show/Hide Flag
            showPrd10: false, // 10번째 상품에서 질의메시지 노출 
            showPrd20: false, // 20번째 상품에서 질의메시지 노출
            showPrdEnd: false, // 마지막 상품에서 질의메시지 노출
            showOrder: false, // 결제 레이어 Show/Hide Flag
            app: {
                nowTTS: false, // 현재 앱 TTS 발화 중 상태
                mowSTT: false, // 현재 앱 STT 인식 중 상태
                soundFlag: false // 디바이스 소리 상태 값 (true: 소리 ON, false: 소리 OFF)
            },
            inputMode: "", // 없음 : Default, mic: 음성모드, keyboard: 키보드모드
            lastInputMode: "", // 사용자 최종 입력 값
            activeVoice: false, // 음성이 들어오고 있을 때
            inputTxt: "", // 사용자가 입력창에 입력한 텍스트 정보
            micVoiceTxt: "듣고 있어요", // 마이크 입력 가이드 텍스트
            appSchemaDelay: 300, // 앱 스킴 호출 시 딜레이
            centerKind: "", //상담종류
            centerYn: "", //상담가능여부

            // 상품 정보
            curPrdSwiperIdx: 0, // 현재 선택된 상품 스와이프 인덱스
            curPage: 1, // 현재 페이지
            totalCnt: 0, // page Total 개수
            prdList: [], // 상품리스트
            prdSecretTextList: null, // 비밀 이벤트 상품리스트 텍스트
            preReqParam: null, // 최종 상품추천 검색 request 조건
            preReqParamObj: null, // 최종 상품추천 검색 request 조건을 Object 형태로 변환한 값
            curPrdInfo: null, // 현재 선택된 상품의 정보
            curPrdDetailInfo: null, // 현재 선택된 상품의 상세 정보
            rowsPerPage : 20 , //상품 리스트 보여주는 갯수
            rowsMaxNum : 40 , //리스트 한번에 보여주는 갯수
            prodImgInfo : [], // 상품 이미지 리스트 정보
            couponListInfo:null, //쿠폰
            recobellInfo:null, //마이추천해줘 
            eventListInfo:null, //이벤트 
            eventApplyInfo:null, //이벤트 응모내역
            eventApplyInfoScrollTop:0, //이벤트 응모내역 스크롤 위치
            eventApplyInfoTotal:null, //이벤트 응모내역 총 갯수
            counselorInfo:null, //고객센터
            saunListInfo:null, //구매사은이벤트 
            saunListInfoMyType:"list", //list : 리스트 , myList : 신청한 리스트 ,noGift : 신청결과없음 
            saleListInfo:null, //청구할인 무이자 할부
            pointCloverListInfo:null, //포인트
            purchaseList:null, //주문내역 정보
            optInfo: { // 옵션 정보
                isOpt: false, // 옵션 유무
                optType: "", // 옵션 발화 타입 (order: 주문해줘, '': 옵션 보여줘/옵션 변경해줘)
                goodsNo: null, // 현재 옵션정보 상품 번호
                prdOptStepCnt: 0, // 상품 옵션 개수
                prdOptInfo: [], // 상품 옵션 정보
                prdOptList: [], // 상품 옵션(단품) 정보
                curOptValArr: [], // 현재 선택된 옵션 정보
                selectedOptItemInfo: null, // 현재 선택된 옵션의 정보
                selectedOptItemNo: null, // 현재 선택된 옵션 itemNo
                
                curOptStep: 0, // 현재 옵션 선택 진행 단계 (몇번째 옵션 선택 중 인지)
                curLayerOptValArr: [], // 옵션 레이어 선택된 옵션 정보
                optSelectDelayTime: 1000 // 옵션 선택 후 다음 옵션 또는 옵션 최종판단까지 딜레이 시간
            },

            orderInfo: { // 주문정보
                cart_sn: null, // 주문 장바구니 번호
                deliver_info: null, // 배송정보
                discount_amt: 0, // 할인금액
                discount_list: null, // 할인정보
                goods_list: null, // 주문 상품 정보
                pay_info: null, // 결제 정보
                total_amt: 0, // 할인전 주문 합계 금액
                total_price: 0, // 최종 주문 금액
                total_deli_amt: 0, // 배송비
                orderCnt: 0, // 주문수량
                termLayerFlag: false // 약관 레이어 보기 Flag
            },

            orderCompleteInfo: { // 주문완료 정보
                goods_list: null, // 주문완료 상품 정보
                deliver_info: null, // 배송정보
                total_amt: 0, // 할인전 주문 합계 금액
                discount_amt: 0, // 할인금액
                total_price: 0, // 최종 주문 금액
                send_due_code: null, // 도착/발송/명절구분코드
                send_due_date: null, // ??
                send_due_month: null, // 예정월 (명절일 경우 빈값)
                send_due_day: null, // 예정일 (명절일 경우 빈값)
                send_due_week: null, // 예정요일 (명절일 경우 빈값)
                ord_no: null, // 주문번호
                saun_info: {//사은 이벤트 정보
                    evt_txt_view_yn:"N",
                    evt_txt_gbn : "1",
                    evt_add_pay_amt : "0",
                    evt_add_pay_pnt : "",
                    evt_as_pay_pnt : "",
                    evt_card_nm : "",
                    evt_saun_no : "",
                    areadyEnter : null
                }
            },

            helpInfo: [], // 해당 state에 맞는 도움말 리스트 정보
            prodComment: [], // 해당 상품에 맞는 상품평 정보
            prodCommentPageIndex: 1, // 상품평 페이지 인덱스
            prodCommentAjaxLoadFlag: false, // 상품평 페이지 더보기 플래그
            prodCommentLastPage: false, // 상품평 페이지 마지막 페이지 플래그
            starScoreOpen: true, // 상품평 페이지 별점 열기/닫기 플래그
            customerSatisOpen: true, // 상품평 페이지 고객 만족도 열기/닫기 플래그
            devCommand: VCDevMode.DEV_COMMAND, // 개발모드 명령어
            jsonLoading: false, // 데이터 호출 시 로딩 플래그
            isChangeCommandState: true, // commandExec의 command 변경 상태값 바뀐 값 : true
            curPrdHtmlInfo : {},
            bgDecoStyle:"",
            soundEndData : {}, //음성 사운드 끝나고 판단할 데이타 VCMsgData.getMsgData 적용
            saleCardInfo : {
                //"001":{name:"강원",className:''},"003":{name:"대동",className:''},"004":{name:"동화",className:''},"005":{name:"동남",className:''},"006":{name:"보람",className:''},"007":{name:"(구)신한카드",className:''},"009":{name:"장은",className:''},"012":{name:"충북",className:''},"019":{name:"한미카드",className:''},"020":{name:"하나카드(구,하나SK)",className:''},"025":{name:"해외카드사",className:''},"027":{name:"DINERS(해외)",className:''},"028":{name:"해외JCB",className:''},"037":{name:"롯데백화점",className:''},"049":{name:"해외AMEX",className:''},"050":{name:"조흥카드",className:''},"052":{name:"산은카드",className:''},"053":{name:"국방전자카드",className:''},"055":{name:"우리은행질북 L-PAY 전용",className:''}
                "002":{name:"광주카드",className:''},
                "008":{name:"하나카드",className:''},
                "010":{name:"전북카드",className:''},
                "011":{name:"제주카드",className:''},
                "016":{name:"KB국민카드",className:'kb'},
                "017":{name:"수협카드",className:''},
                "018":{name:"NH카드",className:'nh'},
                "021":{name:"우리카드",className:''},
                "026":{name:"비씨카드",className:'bc'},
                "029":{name:"신한카드",className:'shinhan'},
                "031":{name:"삼성카드",className:'samsung'},
                "036":{name:"씨티카드",className:''},
                "047":{name:"롯데카드",className:'lotte'},
                "048":{name:"현대카드",className:'hyundai'},
                "051":{name:"저축은행카드",className:''},
                "054":{name:"우체국체크카드",className:''},
            },
            situationData : {question:"",answer:[]}, //상황관리 질의문,대답
            stateSelectorObj : {//화면별 선택자 데이타 모음
                "purchase_gift" : {txt:"구매사은"},
                "billing_discount" : {txt:"청구할인"},
                "interest_free_installment" : {txt:"무이자할부"},
                "event" : {txt:"이벤트"},
            },
            stateSelectorViewInfo : false, //화면별(state) 선택자
            stateSelectorViewClass : true, //화면별(state) 선택자 클래스 구분
            stateSelector : [], //화면별(state) 선택자 데이타
            autoSlideInterval : null, //스와이프 자동 타이머
            autoSlideTime : 3000, //스와이프 자동 타이머 시간
            styleSelectedImageUrl : '', //스타일 추천 업로드 된 이미지 경로
            styleSelectedImageCate : '', //스타일 추천 업로드 된 카테고리
            styleSelectedImageSortCate : '', //스타일 추천 업로드 된 sort 카테고리
            styleSelectedImageGen : '', //스타일 추천 업로드 된 성별
            devMode: false, // 개발 모드 여부
            testMode: false // 테스트 패널 노출 여부
        };

        // 코치마크 설정
        $scope.coachMarkVisibility = false;
        if(LotteStorage.getLocalStorage("vcCoachMark") != "Y"){
        	$scope.coachMarkVisibility = true;
        }
        // 코치마크 닫기
        $scope.hideCoachMark = function(){
        	LotteStorage.setLocalStorage("vcCoachMark", "Y");
        	$scope.coachMarkVisibility = false;
        };
        
        // 청구할인 카드 클래스 얻기
        $scope.getSaleCardClass = function(code){
            var className;
            var cardAcrg = code;
            angular.forEach($scope.pageUI.saleCardInfo,function(value,key){
                if(key == cardAcrg){
                    className = value.className
                }
            });
            return className ? className : "";
        };
        // LocalStorage에 저장된 값 가져오기 Last InputMode
        // $scope.pageUI.lastInputMode = VCBasicInfo.getInputMode(); // 기획요건 없음

        // 클릭 이벤트 태깅
        $scope.setVCAnalysis = function(sendTxt , talkType , isQtype, option){
            console.log("클릭 이벤트 태깅 : " , sendTxt , talkType , isQtype, option);
            var onlyAnswerLogSaveYN = "N";
            var qType = "click";

            if(talkType){
                onlyAnswerLogSaveYN = "Y";
            }
            if(isQtype){
                qType = "none"
            }
            
            var param = {
                screen: $scope.pageUI.state, // 화면 상태
                text: sendTxt, // 발화/터치/입력 텍스트
                mbrNo: $scope.loginInfo.isLogin ? $scope.loginInfo.mbrNo : null, // 고객 회원번호
                answerLogSaveYN : talkType ? null : "N",//클릭 로그전용  N : Q 만 저장
                onlyAnswerLogSaveYN:talkType ? onlyAnswerLogSaveYN : null,//응답 로그전용  Y : A 만 저장
                qType: qType // 발화/터치/입력 구분 값
            };
            if(option && option.noHistory === true){
            	param.noHistory = true;
            }
            VCSendMsg.sendSemanticAnalysis(param);
        };
        // GA 이벤트 태깅
        $scope.setGATag = function (ea, el, d53, d54, prevState) {
            var eventCategory = $scope.appObj.isApp ? "APP_샬롯_" : "MO_샬롯_";
            var eventAction = ea ? ea : "";
            var eventLabel = el ? el : "";
            var dimension53 = d53 ? d53 : "-";
            var dimension54 = d54 ? d54 : "-";

            var stateCheck = $scope.pageUI.state;
            
            if($scope.pageUI.state == "purchase_gift"){
            	if($scope.pageUI.saunListInfoMyType == "list"){
            		stateCheck ="purchase_gift"
            	}else if($scope.pageUI.saunListInfoMyType == "myList"){
            		stateCheck ="purchase_gift_myList"
            	}else if($scope.pageUI.saunListInfoMyType == "noGift"){
            		stateCheck ="purchase_gift_noGift"
            	}else{
            		stateCheck ="purchase_gift"
            	}
            }
            
            if($scope.pageUI.state == "customer_center"){
	            if($scope.pageUI.centerYn == "N"){
	            	stateCheck = "customer_center_fail"
	            }else {
	            	stateCheck = "customer_center"
	            }
            }
            
            if(prevState){
            	stateCheck = prevState;
            }
            
            switch (stateCheck) { // 현재 페이지명 태깅
            case "home": eventCategory += "홈"; break;
            case "prod_list": eventCategory += "상품리스트"; break;
            case "prod_detail": eventCategory += "상품상세"; break;
            case "wish": eventCategory += "위시리스트"; break;
            case "cart": eventCategory += "장바구니"; break;
            case "order": eventCategory += "주문확정"; break;
            case "order_complete": eventCategory += "주문완료"; break;
            case "best_recommendation": eventCategory += "베스트추천"; break;
            case "purchase_frequently": eventCategory += "자주구매리스트"; break;
            case "recently_viewed_item": eventCategory += "최근본상품리스트"; break;
            case "style_recommendation": eventCategory += "스타일추천"; break;
            case "situation_recommendation": eventCategory += "상황리스트"; break;
            case "management_item_recommendation": eventCategory += "관리리스트"; break;
            case "order_inquiry": eventCategory += "주문조회"; break;
            case "coupon": eventCategory += "쿠폰"; break;
            case "secret_event": eventCategory += "비밀이벤트"; break;
            case "point": eventCategory += "포인트"; break;
            case "chulcheck": eventCategory += "출석체크"; break;
            case "event": eventCategory += "이벤트"; break;
            case "event_application_details": eventCategory += "이벤트응모"; break;
            case "purchase_gift": eventCategory += "구매사은진행중"; break;//사은목록
            case "purchase_gift_list": eventCategory += "구매사은진행중"; break;//사은목록
            case "purchase_gift_myList": eventCategory += "구매사은신청완료"; break;//사은신청완료
            case "purchase_gift_noGift": eventCategory += "구매사은신청없음"; break;//신청할게 없어
            case "billing_discount": eventCategory += "청구할인"; break;
            case "interest_free_installment": eventCategory += "무이자할부"; break;
            case "customer_center": eventCategory += "고객센터"; break;
            case "customer_center_fail": eventCategory += "고객센터불가"; break;
            case "mimitoutou_recommendation": eventCategory += "미미뚜뚜리스트"; break;
            case "my_recommendation": eventCategory += "마이추천"; break;
            case "favorite_brands": eventCategory += "즐찾브랜드신상리스트"; break;
            case "other_customers_item_recommendation": eventCategory += "남들은뭘봤지"; break;
            
            default: eventCategory += "홈"; break;
            }
            
            
            switch (d54) {
                case "mic": dimension54 = "음성"; break;
                case "click": dimension54 = "터치"; break;
                case "keyboard": dimension54 = "키패드"; break;
            }

            LotteGA.evtTag(eventCategory, eventAction, eventLabel, dimension53, dimension54);
        };
        

        var referrerUrl = document.referrer; // 인입한 페이지 경로 저장

        /*if ($location.host() == "localhost") {
            referrerUrl = "http://" + $location.host() + ($location.port() ? ":" + $location.port() : "") + "/main/main_2018_dev.html?udid=&v=&cn=&cdn=&schema=";
        }*/

        // console.log("document.referrer", referrerUrl);

        if (referrerUrl && (referrerUrl + "").indexOf(LotteCommon.talkShopPayment) == -1 && (referrerUrl + "").indexOf(LotteCommon.talkShopDelevery) == -1 && (referrerUrl + "").indexOf(LotteCommon.voiceCommerceUrl) == -1) {
            $scope.pageUI.referrerUrl = referrerUrl;
        }

        var SESSION_STORAGE_NAME = "vcSession";

        var unloadEvent = $scope.appObj.isAndroid ? "unload" : "pagehide"; // iOS unload 이벤트가 작동되지 않아 pagehide로 변경

        angular.element($window).on(unloadEvent, function () {
            LotteStorage.setSessionStorage(SESSION_STORAGE_NAME, $scope.pageUI, 'json');
        });

        $scope.isSessionChk = false; // 세션 스토리지 데이터 사용 여부 확인 값

        // 결제수단 변경, 배송지 변경에서 들어온 경우 세션스토리지로 현재 상태값 갱신 시키기
        if (
            (referrerUrl && (referrerUrl + "").indexOf(LotteCommon.talkShopPayment) > -1 || // 결제수단 변경 후 인입 시
            (referrerUrl + "").indexOf(LotteCommon.talkShopDelevery) > -1) || // 배송지 변경 후 인입 시
            (commInitData.query && commInitData.query.lastCommand && (referrerUrl + "").indexOf(LotteCommon.loginForm) > -1) || // 로그인 필요 기능 수행 시 로그인 후 이입 시
            (commInitData.query && commInitData.query.isLogin == "Y" && (referrerUrl + "").indexOf(LotteCommon.loginForm) > -1) || // 로그인 필요 기능 수행 시 로그인 후 이입 시
            (commInitData.query && commInitData.query.isp == "Y") || // ISP 결제 Callback
            (history.state && history.state.name == "voiceCommerce") // 뒤로가기로 페이지 인입 시
        ) {
            var sess = LotteStorage.getSessionStorage(SESSION_STORAGE_NAME, 'json');

            if (sess) {
                //console.log("세션스토리지 복원시점", sess);
                $scope.pageUI = sess;
                $scope.isSessionChk = true;
                $scope.pageUI.showMsg.q = false; // 사만다메시지 (하단)
            }
        } else {
            if (LotteStorage.getSessionStorage("vcLastCommandFlag") == "Y") {
                LotteStorage.setSessionStorage("vcLastCommandFlag", "N");
            }

            if (history.state == null || history.state.name != "voiceCommerce") {
                history.replaceState({name: "voiceCommerce"}, "voiceCommerce"); // 뒤로가기로 인입했을 때 체크를 위한 history state 변경
            }
        }
    }]);
    
    // 보이스커머스 컨테이너 Controller
	app.controller('LotteContainerCtrl',
			['$scope', '$window', '$timeout', 'LotteCommon', 'VCPageMove', 'VCAppApi', 'VCGetPrdInfo', 'LotteCookie', 'VCGetPrdDetailInfo', 'VCHelpInfo', 'VCGetPrdOption', 'VCMsgData', 'VCGetProdComment', 'VCGetPrdQty', 'VCGetOrderDecide', 'VCOrder', 'VCOrderComplete', 'commInitData', 'VDShareApp', 'VCAddCart', 'VCAddWish', 'VCDeliveryInfo', '$filter', 'VCHotKeywordInfo', 'VCStartVoiceInfo', '$interval', '$http', 'LotteUtil', 'LotteStorage', 'VCUpdateCart', 'VCCouponInfo', 'VCSaunInfo', 'VCSaleInfo', 'VCLocalLate', 'VCPointCloverInfo', 'VCEventInfo', 'VCPurchaseInfo', 'VCMyRecommend', 'VCCounselorInfo', 'StyleRecom', 'VCOthersHaveSee', "LotteForm",
    function( $scope,   $window,   $timeout,   LotteCommon,   VCPageMove,   VCAppApi,   VCGetPrdInfo,   LotteCookie,   VCGetPrdDetailInfo,   VCHelpInfo,   VCGetPrdOption,   VCMsgData,   VCGetProdComment,   VCGetPrdQty,   VCGetOrderDecide,   VCOrder,   VCOrderComplete,   commInitData,   VDShareApp,   VCAddCart,   VCAddWish,   VCDeliveryInfo,   $filter,   VCHotKeywordInfo,   VCStartVoiceInfo,   $interval,   $http,   LotteUtil,   LotteStorage,   VCUpdateCart ,   VCCouponInfo,  VCSaunInfo,   VCSaleInfo,   VCLocalLate,   VCPointCloverInfo,   VCEventInfo,   VCPurchaseInfo,   VCMyRecommend,   VCCounselorInfo,   StyleRecom,   VCOthersHaveSee,   LotteForm) {
        var self = this;

		////////////////////////////////////// DEV
		$scope.dev_refresh = function(){
			location.href = LotteCommon.voiceCommerceUrl + "?" + $scope.baseParam + "&dev_mode=Y&a="+(Math.round(Math.random()*10000));
		};
		$scope.dev_setSpeech = function(txt){
			var str = "";
			if($scope.isValidString(txt)){
				str = txt;
			}else{
				str = prompt();
			}
			if(!$scope.isValidString(str)){ return; }
			$window.sttEndCallback(str, {"working" : true});
		};
		$scope.dev_endTTS = function(){
			$window.ttsEndCallback();
		};
		$scope.dev_endSTT = function(){
			$window.sttEndCallback("", {"working" : true});
		};
		$scope.dev_logInOut = function(){
			var li = $scope.loginInfo;
			if(li.isLogin){
				li.isLogin = false;
				li.loginId = "";
				li.mbrNo = "";
				li.name = "";
			}else{
				li.isLogin = true;
				li.loginId = "japokcomet";
				li.mbrNo = "0011299367";
				li.name = "박형윤";
			}
		}
		
		/*$scope.dev_chulcheck = function(){
			var obj = {
				analysisData: "",
				basicVoiceMent: "---",
				command: "goAttCheckEvent",
				commandCard: "",
				commandDate: "",
				commandDayOfWeek: "",
				commandMonth: "",
				commandNewProductName: "",
				commandNumber: "",
				commandPeriod: "",
				commandQuantity: "",
				commandVal: "---",
				goodsNoList: "",
				homeScreenMent: "",
				preReqParam: "",
				queryMent: "",
				recommendData: "",
				requestUrl: "",
				responseCode: "00000",
				responseMsg: "",
				topScreenMent: ""
			}
			self.commandExec(obj.command, obj, "출석체크", "mic");
		}*/
		
		////////////////////////////////////// DEV
        
        
        
        /*
        * state 모음
        */
        self.checkUseState = function(state){
            //1차는 "home" ,"prod_list" ,"prod_detail" ,"cart" ,"wish" ,"order" ,"order_complete" 
            var stateArr = [
				"home",
				"prod_list",
				"prod_detail",
				"cart",
				"wish",
				"order",
				"order_complete",
				"best_recommendation",
				"purchase_frequently",
				"recently_viewed_item",
				"style_recommendation",
				"situation_recommendation",
				"management_item_recommendation",
				"order_inquiry",
				"coupon",
				"secret_event",
				"point",
				"event",
				"event_application_details",
				"purchase_gift",
				"billing_discount",
				"interest_free_installment",
				"customer_center",
				"mimitoutou_recommendation",
				"my_recommendation",
				"favorite_brands",
				"other_customers_item_recommendation",
				"chulcheck"
			];
            var check = false;
            angular.forEach(stateArr , function(value , key){
                if(value == state){
                    check = true;
                }
            })
            return check;
        }
        /* 상품 리스트에 포함되는지 조회
        * @params state String = 검색 state
        * @params notCheckArr Array = 검색 예외 
        */
        $scope.checkListState = function(state , notCheckArr){
            //1차는 'prod_list' , 'cart' , 'wish'
            var listState = [
				'prod_list',
				'cart',
				'wish',
				'best_recommendation',
				'purchase_frequently',
				'recently_viewed_item',
				'style_recommendation',
				'mimitoutou_recommendation',
				'my_recommendation',
				'favorite_brands',
				'situation_recommendation',
				'management_item_recommendation',
				'secret_event',
				"other_customers_item_recommendation"
			];
            var check = false;
            var checkState = [];
            angular.forEach(listState , function(value , key){
                if(value == state){
                    check = true;
                    checkState = value;
                }
            });

            if(notCheckArr){
                angular.forEach(notCheckArr , function(value , key){
                    if(value == checkState){
                        check = false;
                    }
                })
            }

            return check;
        }
        /* 상품 리스트 외 세로 리스트 포함되는지 조회
        * @params state String = 검색 state
        */
       $scope.checkListStateVertical = function(state){
            var listStateVer = ["order_inquiry"  , "coupon" , "purchase_gift" , "event" , "event_application_details" , "billing_discount" ,"interest_free_installment"];
            var check = false;
            angular.forEach(listStateVer , function(value , key){
                if(value == state){
                    check = true;
                }
            })
            return check;
        }
        // State 변경에 따른 selector 노출
        self.stateSelectorView = function(state){
            $scope.pageUI.stateSelector = [];
            var isStateValue = false;
            angular.forEach($scope.pageUI.stateSelectorObj , function(value,key){
                if(key == state){
                    isStateValue = true;
                }
            });

            if(!isStateValue) return;

            angular.forEach($scope.pageUI.stateSelectorObj , function(value,key){
                if(key != state){
                    this.push(value);
                }
            },$scope.pageUI.stateSelector);
            
            if($scope.pageUI.stateSelector.length > 0) {
                self.stateSelectorReset();
                $scope.pageUI.stateSelectorViewInfo = true;
            }
        };
        // State 변경에 따른 resize 스크롤 적용
        self.stateSelectorReset = function(){
            
            var w = 0;
            $("#stateSelectorSlider li").each(function(idx, itm){
                w += ($(itm).width() + 6);
            });
            $("#stateSelectorSlider .selectorSlider").width(w);
            $timeout(function(){
                $("#stateSelectorSlider").scrollLeft(0);
                if($("#stateSelectorSlider").length > 0){
                    angular.element("#stateSelectorSlider").scope().reset();
                }
            }, 100);
        };
        // State 변경에 따른 메시지 Show/Hide 처리
        function changeStateMsgHide() {
            if ($scope.pageUI.state == "home") {
                $scope.pageUI.showMsg.top = false;
            } else {
                $scope.pageUI.showMsg.top = true;
            }
            $scope.pageUI.showMsg.home = false;
        }

        self.stateHistoryBack = function (lastStateFlag) { // 이전 State로 이동
            if(($scope.pageUI.state == "cart" || $scope.pageUI.state == "wish" || $scope.pageUI.state == 'purchase_frequently') && $scope.pageUI.curPage > 1){
                $scope.swipeListPrev();
                return;
            }

            var stateSelectorViewInfo = $scope.pageUI.stateHistory[$scope.pageUI.stateHistory.length - 1].selectorViewInfo;
            var stateSelector = $scope.pageUI.stateHistory[$scope.pageUI.stateHistory.length - 1].stateSelector;

            if ($scope.pageUI.stateHistory.length > 0 && !lastStateFlag) {
                $scope.pageUI.stateHistory.pop();
            }

            if ($scope.pageUI.stateHistory.length >= 0) {
                self.changeState($scope.pageUI.stateHistory[$scope.pageUI.stateHistory.length - 1].state, null, true);
                
                if ($scope.pageUI.state != "home") {
                    $scope.pageUI.msg.top = $scope.pageUI.stateHistory[$scope.pageUI.stateHistory.length - 1].msgTop;
                }
            }
            
            if ($scope.pageUI.state == "home") {
                $scope.startVoiceGuide(); // 홈 발화가이드 애니메이션 시작
            } else if ($scope.checkListState($scope.pageUI.state)) {
                // 이전으로 돌아올 때 이전 스와이프 선택 Index로 변경
                if($scope.pageUI.state == "situation_recommendation" || $scope.pageUI.state == "management_item_recommendation" ){
                    $scope.pageUI.stateSelectorViewInfo = stateSelectorViewInfo;
                    $scope.pageUI.stateSelector = stateSelector;
                }
                
                if ($scope.pageUI.curPrdSwiperIdx > -1 && $scope.prdSwiperCtrl) {
                    angular.element(".prod_list_wrap").css("opacity", 0);
                    $timeout(function () {
                        $scope.prdSwiperCtrl.init();// 상품리스트 스와이프 초기화
                        $scope.prdSwiperCtrl.moveSpeedIndex($scope.pageUI.curPrdSwiperIdx, 10);
                        angular.element(".prod_list_wrap").css("opacity", 1);
                        // angular.element($window).trigger("scroll"); // 화면 갱신이 되지 않는 현상 방지를 위해
                    }, 300);
                }
            }
        };
        //클립보드 복사
        $scope.copyTextToClipboard = function(text) {

            var selection = window.getSelection();
            var copyText = document.querySelector('#accountNumber');
            copyText.innerHTML = text;
          

            selection.removeAllRanges();
            var range = document.createRange();
            range.selectNode(copyText);
            selection.addRange(range);
            
            try {
                document.execCommand('copy');
                $scope.setGATag("계좌번호 복사", "계좌복사", null, 'click');
                $scope.setVCAnalysis("계좌복사");
                $scope.pageUI.alertType = "copy_account";
                self.showAlert();
                
            } catch (err) {
                console.log('execCommand Error', err);
            }
            
            selection.removeAllRanges();
            
            // //console.log("copyTextToClipboard" , text , navigator.clipboard);
            // if (!navigator.clipboard) {
            //     return;
            // }
            
            // navigator.clipboard.writeText(text).then(function() {
            // 	$scope.setGATag("계좌번호 복사", "계좌복사", null, 'click');
            //     $scope.pageUI.alertType = "copy_account";
            //     self.showAlert();
            // }, function(err) {
            //     console.error('Async: Could not copy text: ', err);
            // });
        }
        /*
        * 자동 슬라이드 ("더 보여줘" , "다음" 발화시 동작)
        * 시작 구문
        * function autoSlideFun 인터벌로 실행되는 함수
        * self.autoSlideDestroy 자동 슬라이드 삭제
        * function windowScrollToAni 윈도우 스크롤 애니메이션
        * function easeInOut 효과
        */
        self.startAutoSlide = function (type) {
            if($scope.pageUI.autoSlideInterval){
                $interval.cancel($scope.pageUI.autoSlideInterval);
            }
            if(type == "list"){
                if ($scope.pageUI.state == "style_recommendation" && $scope.pageUI.prdList.length - 1 == $scope.pageUI.curPrdSwiperIdx) {
                    self.showMsg(VCMsgData.msg.prdStyleListEnd); //마지막 상품메세지
                    $scope.setVCAnalysis(VCMsgData.msg.prdStyleListEnd.voice,"Y","Y");
                    $scope.goStyleMore();
                    return;
                }
            }
            
            $scope.pageUI.autoSlideInterval = $interval(function () { autoSlideFun(type)}, $scope.pageUI.autoSlideTime);
            self.autoSlideRun(type);
            angular.element($window).on("touchend.autoSlide", function () {
                self.autoSlideDestroy();
            });
        };
        //자동 슬라이드 interval 구문
        self.autoSlideRun = function (type , direction) {
            if(type == "list"){
                if ($scope.pageUI.prdList.length - 1 > $scope.pageUI.curPrdSwiperIdx) {
                    $scope.prdSwiperCtrl.moveIndex($scope.pageUI.curPrdSwiperIdx + 1);
                } else{
                    self.autoSlideDestroy() //마지막 상품
                }
            }else if(type=="vertical"){
                
                if(direction == "up"){
                    windowScrollToAni(window,angular.element($window).scrollTop() - window.innerHeight*2/3 , 200);
                    if(angular.element($window).scrollTop() <= 0){
                        self.autoSlideDestroy() //처음 상품
                    }
                }else{
                    windowScrollToAni(window,angular.element($window).scrollTop() + window.innerHeight*2/3 , 200);
                    if(angular.element($window).scrollTop() >= document.body.scrollHeight - window.innerHeight){
                        self.autoSlideDestroy() //마지막 상품
                    }
                }
            }
        };
        //자동 슬라이드 interval 
        function autoSlideFun (type) {
            self.autoSlideRun(type);
        };
        self.autoSlideDestroy = function () {
            //console.log("autoSlideDestroy")
            angular.element($window).off("touchend.autoSlide");
            if($scope.pageUI.autoSlideInterval){
                $interval.cancel($scope.pageUI.autoSlideInterval);
            }
        };
        function windowScrollToAni(target , to, duration) {
            var start = target.scrollY || document.documentElement.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20;
            var animateScroll = function(){        
                currentTime += increment;
                var val = easeInOut(currentTime, start, change, duration);
                target.scrollTo(0, val);
                if(currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };
            animateScroll();
        }
        function easeInOut (currentTime, start, change, duration) {
            currentTime /= duration / 2;
            if (currentTime < 1) {
                return change / 2 * currentTime * currentTime + start;
            }
            currentTime -= 1;
            return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
        };
        /*
        * 자동 슬라이드 끝
        */

        $scope.pageUI.prestate=""; //ga 전용
        /********************************************************************************
         *  State 변화에 따른 처리
         * @param state 홈: home, 상품리스트(추천): prod_list, 상품상세: prod_detail, 장바구니: cart, 위시: wish, 주문확정: order, 주문완료: order_complete 
         * @param state 2차 추가
         * 자주구매 : purchase_frequently , 최근본상품 : recently_viewed_item , 스타일 추천 : style_recommendation, 상황추천 : situation_recommendation,관리아이템 : management_item_recommendation,주문내역 : order_inquiry ,쿠폰 : coupon , 포인트 : point , 이벤트 :event , 이벤트 응모내역 : event_application_details ,구매사은 이벤트 : purchase_gift ,청구할인 : billing_discount , 무이자할부 : interest_free_installment , 고객센터/톡상담/1:1문의 : customer_center, 미미뚜뚜 : mimitoutou_recommendation, 마이추천해줘 : my_recommendation  ,즐겨찾기브랜드 : favorite_brands , 비밀이벤트 : secret_event ,남들은뭘봤지? : other_customers_item_recommendation
         ********************************************************************************/
        self.changeState = function (state, options, notSaveFlag) {
            if(self.checkUseState(state) == false) return;
            
            $scope.pageUI.showHotKeyword = false; // 인기 키워드 초기화
            $scope.pageUI.hotKeyword = []; // 인기 키워드 초기화
            
            if ($scope.pageUI.state == "home") { // home state 전환 시 처리
                if (options && options.guideFlag) {
                    $scope.startVoiceGuide(); // 홈 발화가이드 애니메이션 시작
                } else {
                    $scope.stopVoiceGuide(); // 홈 발화가이드 애니메이션 종료
                }
            } else {
                self.allHideLayer(); // 모든 레이어 닫기
            }

            // state 변경 히스토리 저장 여부
            if ($scope.pageUI.state != state && !notSaveFlag) {
                if(state == "prod_detail"){ //히스토리에 상품상세 top 메세지 삭제
                    $scope.pageUI.msg.top = "";
                }
                $scope.pageUI.stateHistory.push({"state":state, "msgTop":$scope.pageUI.msg.top ,"selectorViewInfo":$scope.pageUI.stateSelectorViewInfo ,"stateSelector":$scope.pageUI.stateSelector});// State History 저장 (msgTop 는 showMsg에서 저장)
            }

            $scope.pageUI.prestate = $scope.pageUI.state;
            $scope.pageUI.state = state;

            // 도움말 정보 로드
            
            if($scope.pageUI.state != "home" ){//홈이 아닐때
                self.loadChangehelp({actionHelp:"change"});
            }else{
                self.loadChangehelp({actionHelp:"home"});
            }
            
            
            // if ($scope.pageUI.state == state) { // 현재 State와 같다면 변경 없음
            //     return false;
            // }

            if (state != "home") {
                $scope.hideEvtTxt(); //이벤트 텍스트 가리기
            }
            
            $scope.soundEndData = {};

            
            $scope.pageUI.stateSelectorViewInfo = false;//하단 키워드 셀렉터 감추기
            $scope.pageUI.stateSelector = []; //하단 키워드 셀렉터 초기화
            
            changeStateMsgHide(); // State 변경에 따른 메시지 Show/Hide 처리
            
            self.stateSelectorView($scope.pageUI.state); //state 변경에 따른 선택자 노출

            if ($scope.pageUI.state == "home") { // home state 전환 시 처리
                $scope.startVoiceGuide(); // 홈 발화가이드 애니메이션 시작
            } else if ($scope.checkListState($scope.pageUI.state , ["cart","wish"])) { // 상품리스트 (자세히 보기에서도 올 수 있음)
                $scope.prodListQuantity = -1; //  상품상세 발화 수량 초기화
            } else if ($scope.pageUI.state == "prod_detail") { // 자세히 보기 (상품상세)
                $scope.prodListQuantity = -1; //  상품상세 발화 수량 초기화
            } else if ($scope.pageUI.state == "order") { // 주문서
                $scope.prodListQuantity = -1; //  상품상세 발화 수량 초기화
            }

            if($scope.pageUI.state != "purchase_gift"){
                $scope.pageUI.saunListInfoMyType = "list";
            }
            
            if($scope.pageUI.state != "customer_center"){
            	$scope.pageUI.centerYn = "N";
            }

            angular.element($window).scrollTop(0);
            angular.element($window).trigger("scroll"); // 화면 갱신이 되지 않는 현상 방지를 위해
        };
        /********************************************************************************
         * 도움말 정보 읽기
         ********************************************************************************/
        self.loadChangehelp = function(data , sendTxt, iptType ){
            
            if ( ($scope.pageUI.state == "home" && !(data && data.actionHelp=="home")) || ($scope.pageUI.state == "order_complete" && data.actionHelp == "open")) { // 홈 ,결재완료 일때 도움말은 좌측 햄버거 열기
                $scope.pageUI.sideNavGuideOpenFlag = !$scope.pageUI.sideNavGuideOpenFlag;
                $scope.setGATag("공통_상단영역", "도움말", sendTxt, iptType);
            } else { // 기타 state에서는 해당 state에 맞는 도움말(코너정보) 로드
                  
                var nowHelpState = $scope.pageUI.state;
                if(nowHelpState == "purchase_gift"){// //list : 리스트 , myList : 신청한 리스트 ,noGift : 신청결과없음
                    if($scope.pageUI.saunListInfoMyType == "myList"){//신청한
                        nowHelpState = "purchase_gift_my";
                    }else if($scope.pageUI.saunListInfoMyType == "noGift"){//지급적립
                        nowHelpState = "purchase_giftNo";
                    }
                }else if(nowHelpState == "management_item_recommendation"){
                    if($scope.pageUI.prdList.length){
                        nowHelpState = "management_item_recommendationList";
                    }
                }else if(nowHelpState == "situation_recommendation"){
                    if($scope.pageUI.prdList.length){
                        nowHelpState = "situation_recommendationList";
                    }
                }
                $scope.pageLoading = true; // 로딩바
                VCHelpInfo.getHelpInfo(nowHelpState)
                .then(function (helpInfo) {
                    $scope.pageUI.helpInfo = helpInfo; // 도움말 정보 세팅
                    if(data.actionHelp == "open"){
                        self.allHideLayer(); // 모든 레이어 닫기
                        $scope.pageUI.showHelp = true; // 도움말 레이어 보여주기
                    }else if(data.actionHelp == "change"){
                        rollingInputGuide(); // 입력창 도움말 가이드 변경
                    }

                })
                .catch(function () {
                    // TO-DO : 도움말 코너 정보 로드 실패 시 처리
                    console.error("도움말 코너 정보 연동 실패");
                })
                .finally(function () {
                    $scope.pageLoading = false; // 로딩바
                });
                if(iptType || !data){
                    $scope.setGATag("공통_상단영역", "도움말", sendTxt, iptType);
                }
            }
        }
        
        /********************************************************************************
         * 모든 레이어 타입 닫기
         ********************************************************************************/
        self.allHideLayer = function () {
            $scope.pageUI.sideNavOpenFlag = false; // 좌측 햄버거 레이어
            $scope.pageUI.sideNavGuideOpenFlag = false; // 좌측 햄버거안 가이드 레이어
            
            $scope.pageUI.showMsg.guide = false; // 사만다메시지 (홈 가이드)
            //$scope.pageUI.showMsg.home = false; // 사만다메시지 (중앙)
            //$scope.pageUI.showMsg.top = false; // 사만다메시지 (상단)
            $scope.pageUI.showMsg.q = false; // 사만다메시지 (하단)
            $scope.pageUI.showAlert = false; // 장바구니찜, 위시 Alert 레이어
            $scope.pageUI.inputMode = ""; // 입력 모드 default로 변경
            $scope.pageUI.showPrdImgDetail = false; // 상품이미지 리스트보기 레이어
            $scope.pageUI.showOrder = false; // 결제 레이어

            
            $scope.pageUI.showShare = false; // SNS 공유 팝업
            $scope.pageUI.showHelp = false; // 도움말레이어
            $scope.pageUI.showPrdComment = false; // 상품평 레이어
            $scope.pageUI.showPrdOpt = false; // 상품 옵션 레이어
        };

        // 열린 레이어가 있는지 확인 후 해당 레이어 닫기 (발화 메시지는 제외, Alert도 제외)
        self.chkShowLayer = function () {
            var rtnValue = false;

            if ($scope.pageUI.sideNavOpenFlag ||
                $scope.pageUI.sideNavGuideOpenFlag ||
                $scope.pageUI.showShare ||
                $scope.pageUI.showHelp ||
                $scope.pageUI.showPrdImgDetail ||
                $scope.pageUI.showPrdComment ||
                $scope.pageUI.showPrdOpt ||
                $scope.pageUI.showOrder) {
                $scope.pageUI.sideNavOpenFlag = false; // 좌측 햄버거 레이어
                $scope.pageUI.sideNavGuideOpenFlag = false; // 좌측 햄버거안 가이드 레이어

                //닫기 애니메이션 효과
                $scope.pageUI.layerAnimate = true;
                $timeout.cancel($scope.pageUI.layerAnimateTimeout);
                $scope.pageUI.layerAnimateTimeout = $timeout(function () {
                        $scope.pageUI.layerAnimate = false;
                        $scope.pageUI.showShare = false; // SNS 공유 팝업
                        $scope.pageUI.showHelp = false; // 도움말레이어
                        $scope.pageUI.showPrdComment = false; // 상품평 레이어
                        $scope.pageUI.showPrdOpt = false; // 상품 옵션 레이어
                }, $scope.pageUI.layerAnimateTime);
                // $scope.pageUI.showMsg.guide = false; // 사만다메시지 (홈 가이드)
                // $scope.pageUI.showMsg.home = false; // 사만다메시지 (중앙)
                // $scope.pageUI.showMsg.top = false; // 사만다메시지 (상단)
                // $scope.pageUI.showMsg.q = false; // 사만다메시지 (하단)
                // $scope.pageUI.showAlert = false; // 장바구니찜, 위시 Alert 레이어
                // $scope.pageUI.inputMode = ""; // 입력 모드 default로 변경
                
                
                $scope.pageUI.showPrdImgDetail = false; // 상품이미지 리스트보기 레이어
                $scope.pageUI.showOrder = false; // 결제 레이어

                rtnValue = true;
            }

            return rtnValue;
        };

        /********************************************************************************
         * [APP] TTS/STT 컨트롤
         ********************************************************************************/
        // [APP] TTS 발화 @param txt TTS 발화 텍스트 정보
        self.startAppTTS = function (txt) {
            $scope.pageUI.app.nowTTS = true;
            VCAppApi.startTTS(txt);
        };

        // [APP] 현재 진행중인 TTS 발화 강제 종료
        self.stopAppTTS = function () {
            if ($scope.pageUI.app.nowTTS) {
                VCAppApi.stopTTS();
                $scope.pageUI.app.nowTTS = false;
            }
        };
        
        // [APP] STT 인식 시작
        self.startAppSTT = function () {
            $scope.pageUI.app.nowSTT = true;
            VCAppApi.startSTT($scope.pageUI.app.soundFlag);
            
            //$timeout.cancel(sttEndTimeout);
            //sttEndTimeout = $timeout(stopAppSttTimeout, 10000);
        };

        // [APP] STT 인식 중단
        self.stopAppSTT = function () {
            $scope.pageUI.app.nowSTT = false;
            VCAppApi.stopSTT($scope.pageUI.app.soundFlag);
        };

        /********************************************************************************
         *  앱 Callback API 등록
         ********************************************************************************/
        // [APP] APP SilentMode Check Callback
        VCAppApi.setIsSilentModeCallback(function (flag) {
            if (!$scope.isSessionChk) { // 세션스토리지 사용이 아닐때만 적용
                $scope.pageUI.app.soundFlag = flag === true || flag == "true" ? false : true;
            }
        	pageStart();
        });

        // 앱 사운드 여부 확인
        VCAppApi.getSilentMode(); // 앱 Silent Mode 확인

        // $timeout(function () { // 최초 실행 시 현재 디바이스의 사운드 상태값 getSilentMode와 스키마 호출이 동시에 일어나는 것을 방지하기 위해 딜레이 추가
        //     $scope.pageUI.inputMode = ""; // 입력창 초기화 이후 활성화 진행
        //     $scope.actionInput(); // 최초실행
        // }, 500);

        // [APP] 안드로이드 물리 Backkey 터치 시 Callback
        VCAppApi.setBackKeyCallback(backKeyCallback);

        function backKeyCallback() {
            // self.commandExec("actionBack", null, null, "click");
            if ($scope.pageUI.sideNavOpenFlag ||
            $scope.pageUI.sideNavGuideOpenFlag ||
            $scope.pageUI.showShare ||
            $scope.pageUI.showHelp ||
            $scope.pageUI.showPrdImgDetail ||
            $scope.pageUI.showPrdComment ||
            // $scope.pageUI.showPrdOpt || // 옵션 레이어 따로 체크
            $scope.pageUI.showOrder ||
            $scope.pageSaunLoading ) { // 레이어가 열려있다면
                $scope.pageUI.sideNavOpenFlag = false; // 좌측 햄버거 레이어
                $scope.pageUI.sideNavGuideOpenFlag = false; // 좌측 햄버거안 가이드 레이어
                //애니메이션
                $timeout.cancel($scope.pageUI.layerAnimateTimeout);
                $scope.pageUI.layerAnimate = true;
                $scope.pageUI.layerAnimateTimeout = $timeout(function () {
                    $scope.pageUI.layerAnimate = false;
                    $scope.pageUI.showShare = false; // SNS 공유 팝업
                    $scope.pageUI.showHelp = false; // 도움말레이어
                    $scope.pageUI.showPrdComment = false; // 상품평 레이어
                }, $scope.pageUI.layerAnimateTime);
                
                $scope.pageUI.showPrdImgDetail = false; // 상품이미지 리스트보기 레이어
                // $scope.pageUI.showPrdOpt = false; // 상품 옵션 레이어
                $scope.pageUI.showOrder = false; // 결제 레이어
                $scope.pageSaunLoading = false; //구매사은 로딩커버
            } else if ($scope.pageUI.showPrdOpt) { // 옵션 레이어가 켜져 있다면
                if ($scope.pageUI.optInfo.curOptStep != 0) { // 옵션 레이어 Step이 처음이 아니라면
                    $scope.pageUI.optInfo.curOptStep--; // 이전 Step으로
                    $scope.pageUI.optInfo.curLayerOptValArr.pop(); // 마지막 선택 옵션 삭제
                } else {
                    //애니메이션
                    $timeout.cancel($scope.pageUI.layerAnimateTimeout);
                    $scope.pageUI.layerAnimate = true;
                    $scope.pageUI.layerAnimateTimeout = $timeout(function () {
                        $scope.pageUI.layerAnimate = false;
                        $scope.pageUI.showPrdOpt = false; // 상품 옵션 레이어 닫기
                    }, $scope.pageUI.layerAnimateTime);
                }
            } else {
                if ($scope.pageUI.inputMode == "mic") { // 입력 모드가 마이크라면
                    $scope.pageUI.inputMode = ""; // 입력모드 Default 상태로
                    VCAppApi.stopSTT(); // 음성인식 종료 추가
                } else if ($scope.pageUI.showMsg.q) { // 질의 메시지 활성화 상태라면
                    $scope.pageUI.showMsg.q = false;
                    $timeout.cancel(msg_q_timer); // 질의 메시지 액션 타이머 클리어
                    msg_q_timer = null;
                } else {
                    if ($scope.pageUI.state == "home") { // 홈이라면
                        // VCPageMove.goMain(); // 닷컴 메인으로 이동
                        VCAppApi.exit();
                    } else if ($scope.pageUI.state == "order_complete") { // 주문완료 페이지라면
                        // self.changeState("home", {guideFlag: true}, true); // 홈으로
                        // 이전 페이지가 home일때까지 히스토리 삭제
                        var i = $scope.pageUI.stateHistory.length - 1;
                        
                        for (i; i >= 0; i--) {
                            if ($scope.pageUI.stateHistory[i].state != "home") {
                                $scope.pageUI.stateHistory.pop();
                            } else {
                                break;
                            }
                        }
                        self.stateHistoryBack(true);
                    } else if ($scope.checkListState($scope.pageUI.state) || $scope.checkListStateVertical($scope.pageUI.state)) {

                        // if($scope.pageUI.state == "style_recommendation"){//스타일 추천
                        //     if($scope.checkListState($scope.pageUI.stateHistory[$scope.pageUI.stateHistory.length-1].state)){
                        //         $scope.pageUI.curPrdSwiperIdx = 0;
                        //         self.stateHistoryBack();
                        //         return;
                        //     }
                        // }

                        // 이전 페이지가 home일때까지 히스토리 삭제
                        var i = $scope.pageUI.stateHistory.length - 1;
                        
                        for (i; i >= 0; i--) {
                            if ($scope.pageUI.stateHistory[i].state != "home") {
                                $scope.pageUI.stateHistory.pop();
                            } else {
                                break;
                            }
                        }
                        self.stateHistoryBack(true);
                    } else if ($scope.pageUI.state == "order") { // 주문확정 페이지라면
                        // 이전 페이지가 상품상세 였다면 해당 히스토리는 제거
                        // if ($scope.pageUI.stateHistory[$scope.pageUI.stateHistory.length - 1].state == "prod_detail") {
                            //     $scope.pageUI.stateHistory.pop();
                        // }
                        self.stateHistoryBack();
                    } else { // 그외 화면 이전으로
                        self.stateHistoryBack();
                    }
                }
            }
        }

        // [APP] TTS 발화 종료 Callback
        VCAppApi.setTTSEndCallback(function () {
            // TO-DO : APP TTS 발화 종료 후 처리
            $scope.pageUI.app.nowTTS = false;
            if (!$scope.pageUI.showPrdComment) { // TTS 발화 끝날 시 상품평이 활성화 아니라면

                if($scope.soundEndData && $scope.soundEndData.txt){//사운드 끝나고 2차 사운드 시작
                    self.showMsg($scope.soundEndData);
                    
                    $scope.soundEndData = {};

                }else{//사운드 끝나고 마이크 활성화 여부
                    $timeout.cancel(msg_q_timer);
                    msg_q_timer = null;
                    $scope.pageUI.showMsg.q = false;
                    
                    var isOnMic = false;
                    if($scope.viewInfoTemp != null){ //질의문 모음
                        if($scope.findQuestionEqual($scope.viewInfoTemp.txt)){
                            isOnMic = true;
                            yesNoFlag = true;
                        }

                        if($scope.viewInfoTempMicCheck){ //질의문 모음이 아닌경우 체크
                            isOnMic = true;
                        }
                        if(isOnMic) {
                            $scope.viewInfoTempMicCheck = false;
                            $scope.pageUI.inputMode = ""; // 입력창 초기화 이후 활성화 진행
                            if($scope.pageUI.lastInputMode == "keyboard"){
                                $scope.actionInput(null , "reKeyBoard"); // 입력창 활성화
                            }else{
                                $scope.actionInput(null); // 입력창 활성화
                            }
                        }
                        
                    }
                }
            }
        });
        //질의문인지 일치 여부
        $scope.findQuestionEqual = function(txt){
            var find = false;

            switch(txt){
                case VCMsgData.msg.needLoginYesNo.txt:
                case VCMsgData.msg.prdOptShow.txt:
                case VCMsgData.msg.orderDecideHelp.txt:
                case VCMsgData.msg.couponDown.txt:
                case VCMsgData.msg.useCloverShow.txt:
                case VCMsgData.msg.useCloverShowMil.txt:
                case VCMsgData.msg.mimiNoRegistQ.txt:
                case VCMsgData.msg.saunMoreShow.txt:
                case VCMsgData.msg.centerQnaYn.txt:
                case VCMsgData.msg.styleOtherQue.txt:
                case VCMsgData.msg.centerCounselingOtherTime.txt:
                case VCMsgData.msg.centerTalkOtherTime.txt:
                case VCMsgData.msg.centerCallOtherTime.txt:
                case VCMsgData.msg.purchaseNone.txt:
                case VCMsgData.msg.chulcheckBenefit.txt:
                    find = true;
                break;
            }
            return find;
        }

        // [APP] STT 인식된 TXT 정보 Callback
        VCAppApi.setSTTTextCallback(function (txt) {
            // if (!$scope.pageUI.semanticFlag) {
            //     $scope.sendSemantic("mic", txt);
            // }
            $scope.pageUI.micVoiceTxt = txt;
            $scope.pageUI.activeVoice = true;
        });

        // [APP] STT 종료 후 Callback
        VCAppApi.setSTTEndCallback(function (txt) {
            // TO-DO : STT 종료 후 처리
            // if (!$scope.pageUI.semanticFlag) {
            // }
            $scope.pageUI.micVoiceTxt = txt;
            $scope.pageUI.activeVoice = false;
            
            if (txt) {
                $scope.sendSemantic("mic", txt);
            }

            $timeout(function () {
                $scope.pageUI.app.nowSTT = false;
                $scope.pageUI.micVoiceTxt = "듣고 있어요";
            }, 1500);
        });

        // [APP] IOS 권한 체크 후 Callback
        /** 
        * @param type:String  "camera" , "album" 
        * @param access:Boolean 
        * @param file:String base64 bitmap
        */
        VCAppApi.setPermisionCallback(function (type , access , file) {
            if(access){ //권한 허용
                if($scope.appObj.isIOS || $scope.appObj.isIpad ){
                    $scope.fileAttachOpen(type);//IOS : input 실행
                }else{
                    $scope.createImageFile(type,file)//AOS : base64 bitmap 전달받음
                }
            }
        });
        /* AOS 에서 카메라,앨범 열어 사진선택으로 base64 bitmap 데이터 받아서 이미지 처리 */
        $scope.createImageFile = function(type,file){
            
            var img = new Image();
            img.onload = function(){
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img,0,0);
                canvas.toBlob(function(blob){
                    $scope.styleDetectFile(type,blob)
                },'image/jpeg');

                //document.getElementById("imgTest").appendChild(canvas);
            }
            img.src = "data:image/jpeg;base64,"+file;
        };
        /*
        * 스타일 추천
        * $scope.actionStyleClick : 스타일 추천 버튼 클릭
        * $scope.styleAppCheckAndCommand : 스타일 추천 액션 인터페이스
        * $scope.fileAttachOpen : input 클릭 실행
        * $scope.styleDetectFile : 스타일 추천 input change
        * function getImgOrientation : 선택된 이미지 방향 전환
        * function imgOrientationCallBack : 방향전환 끝나고 호출되는 콜백
        * $scope.uploadFileImage : 스타일 추천 이미지 업로드
        * function imageUploadSuccess : 업로드 성공
        * function imageUploadError : 업로드 실패
        * $scope.getStyleRecom : 업로드 화일 또는 goods_no 로 스타일추천
        */
        
        /*
        * command : "recom" -> //getStyle , 스타일 추천 버튼 클릭 에서 실행
        * command : "open" -> actionCamera , actionAlbum 에서 실행
        * data : 스타일 추천 -> {img_url:'',goods_no:'',style_recomm_cate_grp_cd:''}
        * data : 카메라,앨범 켜줘 -> camera , media
        */ 
        $scope.styleAppCheckAndCommand = function(command , type , data){
            if(command == "recom"){
                $scope.getStyleRecom(data);
            }else if(command == "open"){
                if($scope.appObj.isIOS || $scope.appObj.isIpad){
                    VCAppApi.IOSCheckPermission("media");
                }else{
                    VCAppApi.IOSCheckPermission(type);
                }
            }
        }
        /* 앱버전 체크 후 업데이트 유도창 */
        $scope.styleAppCheckShowAlert = function(){
            var msg = "사진을 찍고 원하는 스타일을<br/>말로 추천받고 싶으시다면<br>앱 업데이트를 해주세요.<br>지금 업데이트 하시겠어요?";
            var obj = {
                "label" : {
                    "ok" : "확인",
                    "cancel" : "취소"
                },
                "callback" : function(rtn){
                    if(rtn){
                        if($scope.appObj.isIOS || $scope.appObj.isIpad ){
                            location.href = "http://itunes.apple.com/app/id376622474?mt=8";
                        }else{
                            location.href = "market://details?id=com.lotte";
                        }
                    }
                }
            }
            $scope.confirm_2016(msg, obj);
        }
        //[APP] IOS 권한 체크 후 Callback
        $scope.fileAttachOpen = function(type){
            if(type == "camera"){
                angular.element("#fileAttachCamera").click();
            }else if(type == "media"){
                angular.element("#fileAttachMedia").click();
            }
        }

        //스타일 추천 버튼 클릭
        $scope.actionStyleClick = function(item){
            $scope.styleAppCheckAndCommand("recom" ,null,item)
            $scope.setGATag("음성명령어", "스타일추천", null, "click");
            $scope.setVCAnalysis("스타일추천");
        }
        $scope.styleDetectFile = function(type, file){
            
            var sendFile;
            var size;
            var uploadSizeLimit = 8;
            var max = uploadSizeLimit*1000*1000;// 서버에서 체크하는 방식과 맞춤
            
            if(file){
                sendFile = file;
            }else{
                if(type == "camera"){
                    sendFile = document.querySelector('#fileAttachCamera').files[0];
                }else if(type == "media"){
                    sendFile = document.querySelector('#fileAttachMedia').files[0];
                }
            }
            size = sendFile.size;
            
            if( size > max ) {
                self.showMsg(VCMsgData.msg.styleSizeFail ,[uploadSizeLimit]);
                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.styleSizeFail, [uploadSizeLimit]).voice ,"Y","Y"); 
                return;
            }
            $scope.pageLoading = true; // 로딩바
            getImgOrientation(sendFile, imgOrientationCallBack);
        };

        $scope.uploadFileImage = function(orient , sendFile){
        	
            var formData = new FormData();
            formData.append("file", sendFile ,"style.jpeg");
        	formData.append("rote_code", orient);
            // 닷컴 서버 파일업로드
            var upload_path = "https://secure.lotte.com/display/insertStyleRecoUploadImage.lotte";
			$.ajax({
				type : "post",
                data : formData,
                async : false,
                cache : false,
	            url: upload_path,
	            success: imageUploadSuccess,
	            error: imageUploadError,
	            contentType: false,
	            processData: false
	        });
        };

        $scope.getStyleRecom = function(_obj , clickIcon){
            $scope.pageLoading = true; // 로딩바
            var obj = {};
            if(_obj && _obj.img_url){
                obj.image = _obj.img_url;
                $scope.pageUI.styleSelectedImageUrl = obj.image;
            }
            if(_obj && _obj.style_recomm_cate_grp_cd){
                $scope.pageUI.styleSelectedImageCate = _obj.style_recomm_cate_grp_cd;
            }
            if(_obj && _obj.goods_no){
                obj.goodsNo = _obj.goods_no;
                $scope.pageUI.styleSelectedGoodsNo = _obj.goods_no;
            }

            $scope.pageUI.styleSelectedImageGen = _obj.style_gen_cd;
            
            obj.screen = "voiceCommerce";
            
            StyleRecom.detect(obj, function (list) {
                
                if (list.length > 0) { // 리턴 결과가 있을 경우 스타일 추천 데이터 사용 (없을 경우 비노출)
                    var cate = list[0].category; // 1, 2, 4, 8, 16, 32
                    var determineSex = StyleRecom.determineSex(list[0],  _obj.style_gen_cd, _obj.style_recomm_cate_grp_cd, $scope.loginInfo.genSctCd);
                    
                    var sendObj = {
                                "id"                 : list[0].id,
                                "sex"               : determineSex,
                                "cate"              : cate,
                                "subcate"        : _obj.style_recomm_cate_grp_cd, //카테고리 분류
                                "sortCate"	: list[0].category,
                                "count"            : 300, // 생략 가능, 디폴트는 300
                                "screen" : "voiceCommerce" // 현재 화면 정보 (voiceCommerce 등으로 사용하면 될 듯)
                    };
                    

                    $scope.pageUI.styleSelectedImageSortCate = list[0].category;
                    if(obj.goodsNo){
                        sendObj.goodsNo = obj.goodsNo // 상품 번호 (없으면 생략)
                    }
                    
                    if(list[0].sub_category.score > 0.2){
                        sendObj.sub_cate = list[0].sub_category.code;
                    }
                    
                    StyleRecom.search(sendObj, function (data) {
                        $scope.pageLoading = false; // 로딩바
                        var goodsNoList = "";
                        var resultData = data;
                        if(resultData.length > 10){
                            resultData.length = 10;
                        }
                        
                        angular.forEach(resultData , function(value , key){
                            if(value.goodsNo){
                                goodsNoList += value.goodsNo + ",";
                            }
                        });
                        self.commandExec("getStyleList" ,{
                            goodsNoList:goodsNoList.slice(0,goodsNoList.length-1) , 
                            styleObj:{ctgName : list[0].ctgName}
                        });

                    }, 100);
                }else{
                    //리스트 없음
                    $scope.pageLoading = false; // 로딩바
                    if(clickIcon){
                        self.showMsg(VCMsgData.msg.styleHasIconSearchFail);
                        $scope.setVCAnalysis(VCMsgData.msg.styleHasIconSearchFail.voice ,"Y","Y");
                    }else{
                        self.showMsg(VCMsgData.msg.styleSearchFail);
                        $scope.setVCAnalysis(VCMsgData.msg.styleSearchFail.voice ,"Y","Y");
                    }
                    $scope.setGATag("스타일추천", "실패메시지노출", null, null);
                }
            });

        };
		function imageUploadSuccess(data){
            $scope.pageLoading = false; // 로딩바
            if(typeof(data) == "string"){ data = JSON.parse(data); }
            if(data.rsltCode != "000"){
                self.showMsg(VCMsgData.msg.networkError);
                console.error("스타일 추천 화일 업로드 실패")
                $scope.setGATag("스타일추천", "네티워크불안정메시지노출", null, null);
                return;
            }

			if(data.styleUpImgInfo){
				$scope.getStyleRecom(data.styleUpImgInfo);
			}
        };
        function imageUploadError(){
            $scope.pageLoading = false; // 로딩바
            self.showMsg(VCMsgData.msg.styleUploadFail);
            $scope.setVCAnalysis(VCMsgData.msg.styleUploadFail.voice ,"Y","Y");
            $scope.setGATag("스타일추천", "사진업로드실패메시지노출", null, null);
        };
		function getImgOrientation(sendFile, callback) {
            var reader = new FileReader();
            reader.onload = function(e) {

            var view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) return callback(-2,sendFile);
            var length = view.byteLength, offset = 2;
            while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1, sendFile);
                var little = view.getUint16(offset += 6, false) == 0x4949;
                offset += view.getUint32(offset + 4, little);
                var tags = view.getUint16(offset, little);
                offset += 2;
                for (var i = 0; i < tags; i++)
                    if (view.getUint16(offset + (i * 12), little) == 0x0112)
                    return callback(view.getUint16(offset + (i * 12) + 8, little) , sendFile);
                }
                else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            return callback(-1, sendFile);
            };
            reader.readAsArrayBuffer(sendFile);
        }
		function imgOrientationCallBack (orient, sendFile){
			$scope.uploadFileImage(orient ,sendFile);
        };
        //닷컴 스타일 보기로 이동
        $scope.goStyleMore = function(type){
            var styleObj = {
                imageUrl : $scope.pageUI.styleSelectedImageUrl ? $scope.pageUI.styleSelectedImageUrl : "",
                cate : $scope.pageUI.styleSelectedImageCate ? $scope.pageUI.styleSelectedImageCate : "",
                sortcate : $scope.pageUI.styleSelectedImageSortCate ? $scope.pageUI.styleSelectedImageSortCate : "",
                gen : $scope.pageUI.styleSelectedImageGen ? $scope.pageUI.styleSelectedImageGen : "",
                goodsNo : $scope.pageUI.styleSelectedGoodsNo ? $scope.pageUI.styleSelectedGoodsNo : ""
            };

            VCPageMove.goStyleView(styleObj.imageUrl , styleObj.cate , styleObj.sortcate ,styleObj.gen ,styleObj.goodsNo);
            if(type == "clk"){
                $scope.setGATag("음성명령어", "더보여줘", null, "click");
                $scope.setVCAnalysis("더보여줘");
            }
        };
        /*
        * 스타일 추천 끝
        */

        // timeout 으로도 제때 반영이 안되어 interval 처리
        function calcMicText(){
        	var g = angular.element(".voice_mic .mic_guide:visible");
        	if(g.length == 0){ return; }
        	var h = g.height();
        	var H = g.parent().height();
        	var t = Math.round((H - h) / 2);
        	g.css("top", t);
        };
        $interval(calcMicText, 50);

        /********************************************************************************
         * 공유하기 제어
         ********************************************************************************/
        self.shareDataSet = function () {            
            // 상품 자세히 보기도 상품 리스트에서 선택되어져 들어가는거라 상품리스트의 데이터 사용
            var goodsObj = {};
            var curProdInfo = self.getCurProdInfo();

            if (curProdInfo) {
                goodsObj.goodsNo = curProdInfo.goods_no;
                goodsObj.goodsNm = curProdInfo.goods_nm;
                goodsObj.shareImg = curProdInfo.img_url;
            }

            return goodsObj;
        };

        /********************************************************************************
         * 화면 제어 공통
         ********************************************************************************/
        var voiceGuideInterval = null; // 최초 홈 진입 시 화면 가이드 롤링 인터벌

        // 발화가이드 현재 보이는 Index 변경
        function changeVoiceGuideIdx() {
            if ($scope.pageUI.curVoiceGuideIdx >= $scope.pageUI.voiceGuideInfo.length - 1) {
                $scope.pageUI.curVoiceGuideIdx = 0;
            } else {
                $scope.pageUI.curVoiceGuideIdx++;
            }
        }

        var activeShowCnt = 0,
            ACTIVE_SHOW_SECCOND = 10; // 추천 가이드가 보여지는 시간 (초)

        function animateVoiceGuide() { // 추천가이드 롤링 애니메이션 동작
            if ($scope.pageUI.showMsg.guide && $scope.pageUI.inputMode == "") {
                if ($scope.voiceGuideActive) {
                    if (activeShowCnt == ACTIVE_SHOW_SECCOND) {
                        activeShowCnt = 0;
                        $scope.voiceGuideActive = !$scope.voiceGuideActive;
        
                        if (!$scope.voiceGuideActive) {
                            $timeout(changeVoiceGuideIdx, 500);
                        }
                    }
                } else {
                    $scope.voiceGuideActive = !$scope.voiceGuideActive;
                }

                activeShowCnt++;
            }
        }
        
        $scope.showAlertHide = false; // Alert 창 감추기 Flag
        
        self.showAlert = function () { // 장바구니, 위시, 공유 등 Alert 애니메이션 처리
        	$scope.pageUI.showAlert = true;
        	$timeout(function () {
        		$scope.showAlertHide = true;
        		$timeout(function () {
            		$scope.pageUI.showAlert = false;
            		$scope.showAlertHide = false;
            	}, 500);
        	}, 2500);
        };

        // 발화가이드 애니메이션 시작
        $scope.startVoiceGuide = function () {
            $scope.pageUI.curVoiceGuideIdx = 0;
            $scope.voiceGuideActive = true;
            $scope.pageUI.showMsg.guide = true; // 가이드 보이기

            if (voiceGuideInterval) {
                $interval.cancel(voiceGuideInterval);
            }

            voiceGuideInterval = $interval(animateVoiceGuide, 500);
        };

        // 발화가이드 애니메이션 종료
        $scope.stopVoiceGuide = function () {
            $scope.pageUI.showMsg.guide = false; // 가이드 감추기
            $interval.cancel(voiceGuideInterval);
        };

        $scope.stateSelectorOpenCloseM = function(isView){
            $scope.pageUI.stateSelectorViewClass = isView;
        };
        
        //화면별 선택자 Open or Close
        $scope.stateSelectorOpenClose = function(isView){
            $scope.pageUI.stateSelectorViewClass = isView;

            if($scope.pageUI.stateSelectorViewClass == true){
                if($scope.pageUI.state == "situation_recommendation" || $scope.pageUI.state == "management_item_recommendation"){
                	$scope.setGATag("공통_추천", "더보기", null, "click");
                }else{
                	$scope.setGATag("키워드", "더보기", null, "click");
                }
                $scope.setVCAnalysis("더보기");
            }else {
                if($scope.pageUI.state == "situation_recommendation" || $scope.pageUI.state == "management_item_recommendation"){
                	$scope.setGATag("공통_추천", "닫기", null, "click");
                }else{
                	$scope.setGATag("키워드", "닫기", null, "click");
                }
                $scope.setVCAnalysis("닫기");
            }
        };
        
        self.getCurProdInfo = function () { // 현재 선택된 상품 정보 돌려주기
            var rtnPordInfo = null;
            if ($scope.pageUI.prdList && $scope.pageUI.curPrdSwiperIdx > -1) {
                rtnPordInfo = $scope.pageUI.prdList[$scope.pageUI.curPrdSwiperIdx];
            }
            return rtnPordInfo;
        };


        /**
         * 옵션 관련
         */

        // 선택 옵션 정보 초기화
        self.initProdOpt = function () {
            $scope.pageUI.optInfo = { // 옵션 정보
                isOpt: false, // 옵션 유무
                optType: "", // 옵션 발화 타입 (order: 주문해줘, '': 옵션 보여줘/옵션 변경해줘)
                goodsNo: null, // 현재 옵션정보 상품 번호
                prdOptStepCnt: 0, // 상품 옵션 개수
                prdOptInfo: [], // 상품 옵션 정보
                prdOptList: [], // 상품 옵션(단품) 정보
                curOptValArr: [], // 현재 선택된 옵션 정보
                selectedOptItemInfo: null, // 현재 선택된 옵션의 정보
                selectedOptItemNo: null, // 현재 선택된 옵션 itemNo

                curOptStep: 0, // 현재 옵션 선택 진행 단계 (몇번째 옵션 선택 중 인지)
                curLayerOptValArr: [] // 옵션 레이어 선택된 옵션 정보
            };
        };

        // 옵션 정보 구해와서 옵션 레이어 보여주기 @params type: 'order': 주문할래로 유입 시
        self.showOpt = function (type) {
            var curProdInfo = self.getCurProdInfo(); // 현재 선택 상품 정보

            if (curProdInfo.vic_ord_psb_yn != "Y") { // 음성주문 불가
                if ($scope.checkListState($scope.pageUI.state , ["cart"])) { // 상품리스트, 위시리스트상태
                    VCPageMove.goPrdDetail(curProdInfo.goods_no); // 일반 상품상세 연결
                } else if ($scope.pageUI.state == "cart") { // 장바구니 리스트
                    if (curProdInfo.smp_only_yn == "Y" || // 스마트픽 전용
                    curProdInfo.input_option_yn == "Y") { // 입력형/날짜형 옵션 여부
                        VCPageMove.goCart(); // 장바구니로 이동
                    } else {
                        $scope.pageUI.optInfo.curOptStep = 0; // 레이어 선택 옵션 초기화
                        $scope.pageUI.optInfo.curLayerOptValArr = []; // 레이어 선택 옵션 초기화
                        self.getOpt(type, true);
                    }
                }
            } else {
                if ($scope.pageUI.state == "cart" && curProdInfo.smpick_yn == "Y") { // 스마트픽 장바구니
                    VCPageMove.goCart(); // 장바구니로 이동
                } else {
                    $scope.pageUI.optInfo.curOptStep = 0; // 레이어 선택 옵션 초기화
                    $scope.pageUI.optInfo.curLayerOptValArr = []; // 레이어 선택 옵션 초기화
                    self.getOpt(type, true);
                }
            }
        };

        // 상품의 옵션 정보 조회
        self.getOpt = function (type, layerShowFlag, detailMoveFlag, addCartFlag) {
            self.allHideLayer(); // 모든 레이어 닫기
            // self.initProdOpt(); // 선택 옵션 정보 초기화 (초기화 하지 않음)

            var goodsInfo = self.getCurProdInfo(); // 상품 자세히 보기도 상품 리스트에서 선택되어져 들어가는거라 상품리스트의 데이터 사용

            if (goodsInfo && goodsInfo.goods_no) {
                var goodsNo = goodsInfo.goods_no;

                if (type) { // 발화타입에 따른 옵션 선택 후 이동 처리를 위해 타입 지정
                    $scope.pageUI.optInfo.optType = type;
                } else {
                    $scope.pageUI.optInfo.optType = "";
                }
                
                if ($scope.pageUI.optInfo.goodsNo == goodsNo) { // 이미 로드했던 상품 옵션 정보라면
                    self.prdOptLoadComplete(layerShowFlag, detailMoveFlag, addCartFlag);
                } else {
                    $scope.pageLoading = true; // 로딩바

                    VCGetPrdOption.getPrdOptInfo(goodsNo)
                    .then(function (optInfo) { // selectOptInfo: Step별 옵션 정보, optList: 품절을 제외한 전체 단품 옵션 정보
                        $scope.pageUI.optInfo.isOpt = false; // 옵션 없음
                        $scope.pageUI.optInfo.prdOptStepCnt = 0; // 옵션 Step 수
                        $scope.pageUI.optInfo.prdOptInfo = []; // 옵션 Step 정보
                        $scope.pageUI.optInfo.prdOptList = []; // 단품 옵션 정보
                        if (optInfo) { // 옵션 있음
                            var selectOptInfo = optInfo.optSelectList,
                                optList = optInfo.optItems;

                            if (selectOptInfo && selectOptInfo.length > 0 && optList && optList.length > 0) {
                                $scope.pageUI.optInfo.isOpt = true; // 옵션 있음
                                $scope.pageUI.optInfo.prdOptStepCnt = selectOptInfo.length; // 옵션 Step 수
                                $scope.pageUI.optInfo.prdOptInfo = selectOptInfo; // 옵션 Step 정보
                                $scope.pageUI.optInfo.prdOptList = optList; // 단품 옵션 정보
                            }
                        }

                        $scope.pageUI.optInfo.curOptValArr = []; // 선택 옵션 초기화

                        $scope.pageUI.optInfo.goodsNo = goodsNo; // 로드한 옵션의 상품 번호 세팅
                        self.prdOptLoadComplete(layerShowFlag, detailMoveFlag, addCartFlag); // 옵션 정보 로드 이후 수행
                    })
                    .catch(function () {
                        console.log("상품 옵션정보 오류");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                }
            } else {
                console.log("현재 선택된 상품 번호 없음");
            }
        };

        self.chkNowStepOptSoldout = function () { // 현재 단계 옵션의 품절 유무 확인
            // 현재까지 선택된 옵션 단계 optValCd 조합
            var i = 0, j = 0,
                selectOptValCd = "",
                soldOutFlag = true,
                nowStep = $scope.pageUI.optInfo.curLayerOptValArr.length,
                optValCdRegExp = null,
                curProdInfo = self.getCurProdInfo();

            if ($scope.pageUI.optInfo.prdOptInfo.length - 1 < nowStep) { // 더 이상 옵션이 없다면
                return false;
            }

            for (i = 0; i < $scope.pageUI.optInfo.curLayerOptValArr.length; i++) { // 옵션 레이어에서 현재까지 선택된 옵션들의 optValCd 조합 값 확인
                selectOptValCd += $scope.pageUI.optInfo.curLayerOptValArr[i].item.optValCd + " x ";
            }

            // 단품 옵션 정보에서 정규식으로 해당 옵션 정보가 있는지 확인
            for (i = 0; i < $scope.pageUI.optInfo.prdOptInfo[nowStep].itemList.items.length; i++) {
                optValCdRegExp = new RegExp("^" + selectOptValCd + $scope.pageUI.optInfo.prdOptInfo[nowStep].itemList.items[i].optValCd + "([^0-9]|$)");

                $scope.pageUI.optInfo.prdOptInfo[nowStep].itemList.items[i].isSoldout = true;
                
                for (j = 0; j < $scope.pageUI.optInfo.prdOptList.length; j++) {
                    // console.log(selectOptValCd + $scope.pageUI.optInfo.prdOptInfo[nowStep].itemList.items[i].optValCd, $scope.pageUI.optInfo.prdOptList[j].optValCd);
                    if (optValCdRegExp.exec($scope.pageUI.optInfo.prdOptList[j].optValCd + "")) {
                        if ($scope.pageUI.optInfo.prdOptList[j].invQty >= curProdInfo.min_lmt_qty) {
                            $scope.pageUI.optInfo.prdOptInfo[nowStep].itemList.items[i].isSoldout = false;
                        } else {
                            $scope.pageUI.optInfo.prdOptInfo[nowStep].itemList.items[i].isSoldout = true;
                        }
                        // console.log("품절 아님");
                        break;
                    }
                }
            }
        }

        self.prdOptLoadComplete = function (layerShowFlag, detailMoveFlag, addCartFlag) { // 옵션 정보 로드 이후 수행
            if ($scope.pageUI.optInfo.prdOptInfo.length > 0) { // 옵션 있음
                if (!$scope.pageUI.optInfo.curOptValArr || $scope.pageUI.optInfo.curOptValArr.length == 0) {
                    self.chkNowStepOptSoldout(); // 첫번째 스탭 옵션 품절 유무 확인

                    var curProdInfo = self.getCurProdInfo();

                    // 옵션 정보 최초 로드 후 첫번째 단품 옵션 자동 선택
                    var i = 0, j = 0,
                        firstOptItemValCdArr = ($scope.pageUI.optInfo.prdOptList[0].optValCd + "").split(" x ");
                    
                    // 품절 아닌 단품 옵션 첫번째 찾기
                    for (i = 0; i < $scope.pageUI.optInfo.prdOptList.length; i++) {
                        if (parseInt(curProdInfo.min_lmt_qty) <= $scope.pageUI.optInfo.prdOptList[i].invQty) {
                            firstOptItemValCdArr = ($scope.pageUI.optInfo.prdOptList[i].optValCd + "").split(" x ");
                            break;
                        }
                    }

                    for (i = 0; i < $scope.pageUI.optInfo.prdOptInfo.length; i++) {
                        for (j = 0; j < $scope.pageUI.optInfo.prdOptInfo[i].itemList.items.length; j++) {
                            if (firstOptItemValCdArr[i] == $scope.pageUI.optInfo.prdOptInfo[i].itemList.items[j].optValCd) {
                                // 품절 아닌 옵션 찾아서 기본 옵션 세팅하기
                                $scope.pageUI.optInfo.curOptValArr.push({
                                    name: $scope.pageUI.optInfo.prdOptInfo[i].optNm,
                                    item: $scope.pageUI.optInfo.prdOptInfo[i].itemList.items[j]
                                });
                                break;
                            }
                        }
                    }

                    self.setSelectedProdOptItemInfo(); // 현재 선택된 옵션 정보로 selectedOptItemNo 값 세팅
                }

                if (layerShowFlag) {
                    $scope.pageUI.optInfo.curOptStep = 0;
                    $scope.pageUI.showPrdOpt = true;
                    self.showMsg(VCMsgData.getMsgData("원하는 " + $scope.pageUI.optInfo.prdOptInfo[$scope.pageUI.optInfo.curOptStep].optNm + " 번호를 말해보세요", "원하는 " + $scope.pageUI.optInfo.prdOptInfo[$scope.pageUI.optInfo.curOptStep].optNm + " 번호를 말해보세요", "q") , null , true);

                    $scope.setVCAnalysis("원하는 " + $scope.pageUI.optInfo.prdOptInfo[$scope.pageUI.optInfo.curOptStep].optNm + " 번호를 말해보세요" ,"Y","Y");
                }

                if (addCartFlag) { // 장바구니 담기 진행 여부 확인
                    self.addCartProgress();
                }
            } else if (!detailMoveFlag) { // 옵션 전체 품절
                // console.log("품절");
                self.showMsg(VCMsgData.msg.notInventory);
            } else if (addCartFlag) { // 장바구니 담기 진행 여부 확인
                self.addCartProgress();
            }
        };

        self.chkOpt = function () { // 현재 선택 상품의 옵션 유무 확인
            var goodsInfo = self.getCurProdInfo(),
                rtnValue = false;
            if (goodsInfo) {
                if( goodsInfo.option_yn && (goodsInfo.option_yn + "").toUpperCase() == "Y" || goodsInfo.input_option_yn == "Y"){
                    rtnValue = true;
                }
            } else {
                //console.log("옵션없음");
                $scope.pageUI.optInfo.selectedOptItemInfo = null;
                $scope.pageUI.optInfo.selectedOptItemNo = 0;
            }
            return rtnValue;
        };

        self.setSelectedProdOptItemInfo = function () { // 마지막까지 선택된 옵션 값으로 단품 옵션리스트의 옵션 itemNo 찾기
            var selectedOptValCd = "",
                i = 0;

            if ($scope.pageUI.optInfo.curOptValArr && $scope.pageUI.optInfo.curOptValArr.length > 0) {
                // 선택된 optValCd ' x ' 구분자로 조합하기
                for (i = 0; i < $scope.pageUI.optInfo.curOptValArr.length; i++) {
                    if (i != 0) {
                        selectedOptValCd += " x ";
                    }
    
                    selectedOptValCd += $scope.pageUI.optInfo.curOptValArr[i].item.optValCd;
                }

                // console.log("selectedOptValCd", selectedOptValCd);

                // 단품 옵션 정보 리스트에서 선택된 optValCd 값과 동일한 옵션의 itemNo 구하기
                for (i = 0; i < $scope.pageUI.optInfo.prdOptList.length; i++) {
                    if ($scope.pageUI.optInfo.prdOptList[i].optValCd == selectedOptValCd) {

                        $scope.pageUI.optInfo.selectedOptItemInfo = $scope.pageUI.optInfo.prdOptList[i];
                        $scope.pageUI.optInfo.selectedOptItemNo = $scope.pageUI.optInfo.prdOptList[i].itemNo;

                        // console.log("$scope.pageUI.optInfo.selectedOptItemInfo", $scope.pageUI.optInfo.selectedOptItemInfo);
                        // console.log("$scope.pageUI.optInfo.selectedOptItemNo", $scope.pageUI.optInfo.selectedOptItemNo);
                        break;
                    }
                }
            } else { // 선택된 옵션이 없다면
                // $scope.pageUI.optInfo.selectedOptItemInfo = null;
                // $scope.pageUI.optInfo.selectedOptItemNo = 0;
                console.error("선택된 옵션에 대한 매칭 옵션 없음");
            }
        };

        // 상품 자세히 보기 시 데이터 가져오기
        self.getProdDetailInfo = function (orderFlag) {
            var curPrdInfo = self.getCurProdInfo(); // 현재 선택된 상품 정보
            if (curPrdInfo && curPrdInfo.goods_no) { // 상품번호가 있을 경우만 처리
                if (curPrdInfo.vic_ord_psb_yn == "Y") { // 음성주문 가능 여부
                    self.getOpt(false, false, true); // 상품 옵션 정보 로드 (옵션 출력을 위해)
                    $scope.pageLoading = true; // 로딩바

                    // 상품 상세 정보 호출 (기존 상품상세 데이터 활용)
                    VCGetPrdDetailInfo.getPrdDetailListInfo(curPrdInfo.goods_no)
                    .then(function (prdDetailInfo) {
                        $scope.pageUI.curPrdDetailInfo = prdDetailInfo;

                        // 상품 최소 주문 수량으로 세팅
                        $scope.pageUI.orderInfo.orderCnt = parseInt(curPrdInfo.min_lmt_qty) > 0 ? parseInt(curPrdInfo.min_lmt_qty) : 1;
                        VCLocalLate.setLateList(curPrdInfo.goods_no);
                        self.changeState("prod_detail"); // State 변경
                        $scope.setVCAnalysis("자세히" ,"Y","Y");
                    })
                    .catch(function () {
                        self.showMsg(VCMsgData.msg.networkError);
                        console.error("상품상세 정보 없음");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });

                    // 상품 상세 Html 정보 호출 (기존 상품상세 Html 데이터 활용)
                    $scope.pageLoading = false; // 로딩바

                    VCGetPrdDetailInfo.getPrdDetailHtmlInfo(curPrdInfo.goods_no)
                    .then(function (prdDetailHtmlInfo) {
                        $scope.pageUI.curPrdHtmlInfo = prdDetailHtmlInfo;

                        // $timeout(function () {
                        //     $scope.setDetailLayoutData($scope.pageUI.curPrdHtmlInfo);
                        // }, 500);
                    })
                    .catch(function () {
                        console.error("상품상세 Html 정보 없음");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                } else {
                    //console.log("음성주문 불가 상품상세 이동");
                    self.showMsg(VCMsgData.msg.notVoiceOrder);
                    $scope.setVCAnalysis(VCMsgData.msg.notVoiceOrder.voice,"Y","Y");
                    VCPageMove.goPrdDetail(curPrdInfo.goods_no); // 일반 상품상세 연결
                }
            }
        };

        // 장바구니 담기
        self.addCart = function (type) {
            if(type == "default") {
                if (self.chkOpt()) { // 옵션 유무 확인
                    self.getOpt(false, false, false, true);
                }else{
                    self.addCartProgress();
                }
                return;
            }

            if (self.chkOpt()) { // 옵션 유무 확인
                //console.log("옵션 체크: 옵션있음");
                self.showOpt("cart");
            } else {
                //console.log("옵션 체크: 옵션없음");
                self.addCartProgress();
            }
        };

        self.addCartProgress = function () { // 장바구니 담기 진행
            // 상품 재고 수량 체크
            var curPordInfo = self.getCurProdInfo();
            
            $scope.pageLoading = true; // 로딩바

            VCGetPrdQty.chkProdQty(
                curPordInfo.goods_no,
                $scope.pageUI.optInfo.selectedOptItemNo
            )
            .then(function (prdQtyInfo) { // 재고 상태 이상없음
                var curPrdInfo = self.getCurProdInfo(); // 현재 선택 상품 정보

                if (parseInt($scope.pageUI.orderInfo.orderCnt) < parseInt(curPrdInfo.min_lmt_qty) && parseInt(curPrdInfo.min_lmt_qty) > 0) { // 최소 구매 수량 확인
                    $scope.pageUI.orderInfo.orderCnt = parseInt(curPrdInfo.min_lmt_qty); // 최소 수량으로 강제 세팅
                } else if (parseInt($scope.pageUI.orderInfo.orderCnt) > parseInt(curPrdInfo.max_lmt_qty) && parseInt(curPrdInfo.max_lmt_qty) > 0) { // 최대 구매 수량 확인
                    $scope.pageUI.orderInfo.orderCnt = parseInt(curPrdInfo.max_lmt_qty); // 최대 수량으로 강제 세팅
                }

                if (!$scope.pageUI.optInfo.selectedOptItemNo && $scope.pageUI.optInfo.selectedOptItemNo !== 0) {
                    // console.log("설정된 옵션 없음");
                    $scope.pageUI.optInfo.selectedOptItemNo = 0;
                }

                $scope.pageLoading = true; // 로딩바

                VCAddCart.addCart({
                    member_no: $scope.loginInfo.mbrNo, // 회원번호
                    goods_no: curPrdInfo.goods_no, // 상품번호
                    item_no: $scope.pageUI.optInfo.selectedOptItemNo, // 옵션 단품 번호
                    ord_qty: $scope.pageUI.orderInfo.orderCnt, // 수량
                    goods_cmps_cd: curPrdInfo.goods_cmps_cd, // 상품구성코드 (50: 일반상품)
                    voice: "Y", // 음성주문여부 Y/N
                    cart_page_yn: "N" // 장바구니 페이지 Y/N
                })
                .then(function (res) { // 담기 성공
                    $scope.pageUI.alertType = "cart";
                    self.showAlert();
                    // angular.element($window).on("refreshCartCount"); // 장바구니 카운트 갱신
                    // TO-DO: 이미 담긴 상태 확인
                })
                .catch(function (res) { // 담기 실패
                    console.error("장바구니 담기 실패");

                    if (res.response_code && res.response_code != "00000" && res.response_msg && res.response_msg != "") {
                        $scope.alert_2016("[" + res.response_code + "] " + res.response_msg);
                    }
                })
                .finally(function () {
                    $scope.pageLoading = false; // 로딩바
                });
            })
            .catch(function () { // 재고 없음
                console.error("재고 없음");
                self.showMsg(VCMsgData.msg.notInventory);
                // TO-DO: 재고 없음 처리
            })
            .finally(function () {
                $scope.pageLoading = false; // 로딩바
            });
        };

        self.addWish = function () { // 위시리스트 담기 진행
            var curPrdInfo = self.getCurProdInfo(); // 현재 선택 상품 정보

            $scope.pageLoading = true; // 로딩바

            VCAddWish.addWish({
                member_no: $scope.loginInfo.mbrNo,
                goods_no: curPrdInfo.goods_no
            })
            .then(function (resCode) {
                if (resCode == "00000") { // 담기 성공
                    $scope.pageUI.alertType = "wish";
                    // self.showMsg(VCMsgData.msg.getWish); //위시리스트 담아줘
                    self.showAlert();
                } else { // 이미 담긴 상품
                    $scope.pageUI.alertType = "wish_duplicate";
                    // self.showMsg(VCMsgData.msg.alreadyWish); //위시리스트에서 위시리스트 담아줘
                    self.showAlert();
                }
            })
            .catch(function () {
                self.showMsg(VCMsgData.msg.networkError);
                console.error("위시 담기 연동 실패");
            })
            .finally(function () {
                $scope.pageLoading = false; // 로딩바
            });
        };

        // 주문확정으로 이동
        self.orderDecide = function (cartSn, ordQtyFlag, itemNoFlag) {
            // 로그인 여부, 배송지여부, 결제수단 여부 다시 한번 체크
            if (!$scope.loginInfo.isLogin || !$scope.basicInfo.member_info.et_mbr_dlvp_chk || !$scope.basicInfo.member_info.base_op_pay_chk) {
                return false;
            }
            
            var curPrdInfo = self.getCurProdInfo(); // 현재 선택 상품

            // 상품자세히보기에서 최소/최대 구매수량 확인
            if (parseInt($scope.pageUI.orderInfo.orderCnt) < parseInt(curPrdInfo.min_lmt_qty) && parseInt(curPrdInfo.min_lmt_qty) > 0) { // 최소 구매 수량 확인
                $scope.pageUI.orderInfo.orderCnt = parseInt(curPrdInfo.min_lmt_qty); // 최소 수량으로 강제 세팅
                self.showMsg(VCMsgData.msg.errMinLmtQty , [parseInt(curPrdInfo.min_lmt_qty)]);
                //console.log("최소/최대 구매수량 오류");
                return false;
            } else if (parseInt($scope.pageUI.orderInfo.orderCnt) > parseInt(curPrdInfo.max_lmt_qty) && parseInt(curPrdInfo.max_lmt_qty) > 0) { // 최대 구매 수량 확인
                $scope.pageUI.orderInfo.orderCnt = parseInt(curPrdInfo.max_lmt_qty); // 최대 수량으로 강제 세팅
                self.showMsg(VCMsgData.msg.errMxnLmtQty , [parseInt(curPrdInfo.max_lmt_qty)]);
                //console.log("최소/최대 구매수량 오류");
                return false;
            }
            
            $scope.pageLoading = true; // 로딩바

            // 상품 재고 수량 체크
            VCGetPrdQty.chkProdQty(
                curPrdInfo.goods_no,
                $scope.pageUI.optInfo.selectedOptItemNo
            )
            .then(function (prdQtyInfo) { // 재고 상태 이상없음
                var params = {
                    member_nm: $scope.loginInfo.name, // 회원이름
                    member_no: $scope.loginInfo.mbrNo, // 회원번호
                    goods_no: curPrdInfo.goods_no, // 상품번호
                    goods_cmps_cd: curPrdInfo.goods_cmps_cd // 상품구성코드 (default: 50 - 일반상품)
                };

                if (cartSn && ordQtyFlag) { // 장바구니 번호와 수량 변경이 있다면
                    params.cart_sn = cartSn;

                    if (curPrdInfo.ord_qty != $scope.pageUI.orderInfo.orderCnt) { // 수량이 변경되었는지 확인 하여 주문확정 넘겨줌
                        params.ord_qty = $scope.pageUI.orderInfo.orderCnt;
                    } else {
                        params.ord_qty = curPrdInfo.ord_qty;
                    }
                } else if (cartSn && itemNoFlag) { // 장바구니 번호와 옵션 변경이 있다면
                    params.cart_sn = cartSn;

                    if (curPrdInfo.item_no != $scope.pageUI.optInfo.selectedOptItemNo) { // 옵션이 변경되었는지 확인 하여 주문확정 넘겨줌
                        params.item_no = $scope.pageUI.optInfo.selectedOptItemNo;
                    } else {
                        params.item_no = curPrdInfo.item_no;
                    }
                } else {
                    params.item_no = $scope.pageUI.optInfo.selectedOptItemNo; // 옵션번호 (default: 0)
                    params.ord_qty = $scope.pageUI.orderInfo.orderCnt; // 수량 (default: 1)}
                }

                $scope.pageLoading = true; // 로딩바

                VCGetOrderDecide.getOrderDecide(params)
                .then(function (orderDecideInfo) {
                    $scope.pageUI.orderInfo.cart_sn =  orderDecideInfo.cart_sn ? orderDecideInfo.cart_sn : null; // 주문 장바구니 번호
                    $scope.pageUI.orderInfo.deliver_info = orderDecideInfo.deliver_info ? orderDecideInfo.deliver_info : null; // 배송정보
                    $scope.pageUI.orderInfo.discount_amt = orderDecideInfo.discount_amt ? orderDecideInfo.discount_amt : 0; // 할인금액
                    $scope.pageUI.orderInfo.discount_list = (orderDecideInfo.discount_list && orderDecideInfo.discount_list.items) ? orderDecideInfo.discount_list.items : null; // 할인정보
                    $scope.pageUI.orderInfo.goods_list = orderDecideInfo.goods_list.items && orderDecideInfo.goods_list.items[0] ? orderDecideInfo.goods_list.items[0] : null; // 주문 상품 정보
                    $scope.pageUI.orderInfo.pay_info = orderDecideInfo.pay_info ? orderDecideInfo.pay_info : null; // 결제 정보
                    $scope.pageUI.orderInfo.total_amt = orderDecideInfo.total_amt ? orderDecideInfo.total_amt : 0; // 할인전 주문 합계 금액
                    $scope.pageUI.orderInfo.total_price = orderDecideInfo.total_price ? orderDecideInfo.total_price : 0; // 최종 주문 금액
                    $scope.pageUI.orderInfo.total_deli_amt = orderDecideInfo.total_deli_amt ? orderDecideInfo.total_deli_amt : 0; // 배송비
                    
                    if ($scope.pageUI.orderInfo.cart_sn && 
                        $scope.pageUI.orderInfo.deliver_info && 
                        $scope.pageUI.orderInfo.goods_list && 
                        $scope.pageUI.orderInfo.total_amt && 
                        $scope.pageUI.orderInfo.total_price) { // Validate

                        self.changeState("order"); // 주문확정으로 이동

                        if ($scope.pageUI.orderInfo.discount_amt > 0) { // 할인 금액 유무에 따른 메시지 분기
                            self.showMsg(VCMsgData.msg.orderDecideDiscount, [
                                $scope.pageUI.orderInfo.discount_amt,
                                $scope.pageUI.orderInfo.total_price
                            ]);
                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.orderDecideDiscount, [$scope.pageUI.orderInfo.discount_amt,$scope.pageUI.orderInfo.total_price]).voice ,"Y","Y" );
                        } else {
                            self.showMsg(VCMsgData.msg.orderDecide);
                            $scope.setVCAnalysis(VCMsgData.msg.orderDecide.voice ,"Y","Y");
                        }

                        // 질의 메시지 이후 발화 데이타
                        $scope.soundEndData = VCMsgData.msg.orderDecideHelp;
                        $scope.setGATag("샬롯질의", "주문동의메시지노출", null, null);
                        $scope.setVCAnalysis("주문동의메시지노출");
                    }
                })
                .catch(function (response_msg) {
                    //alert("주문 확정 정보 오류 : " + response_msg);
                    console.error("주문확정 정보 오류");
                })
                .finally(function () {
                    $scope.pageLoading = false; // 로딩바
                });
            })
            .catch(function (prdQtyInfo) { // 재고 상태 오류
                if (prdQtyInfo) { // prdQtyInfo.inv_stat_cd == "P" : 부분품절
                    console.error(prdQtyInfo.inv_stat_cd, prdQtyInfo.inv_stat_msg);
                } else {
                    console.error("재고 체크 오류");
                }
            })
            .finally(function () {
                $scope.pageLoading = false; // 로딩바
            });
        };

        // 주문 시
        self.order = function () {
            // console.log("결제 진행");
            // 로그인 여부, 배송지여부, 결제수단 여부 다시 한번 체크
            if (!$scope.loginInfo.isLogin || !$scope.basicInfo.member_info.et_mbr_dlvp_chk || !$scope.basicInfo.member_info.base_op_pay_chk) {
                return false;
            }
            self.showMsg(VCMsgData.msg.orderProgress); // 직접 터치해서 결제 진행해주세요? 멘트
            $scope.setVCAnalysis(VCMsgData.msg.orderProgress.voice ,"Y","Y");

            if ($scope.basicInfo.member_info.pay_mean_cd == "40") { // Lpay (Lpay 인증 한번 더 검증)
                VCOrder.authLpayMerchant($scope.basicInfo.member_info.onlCno, function (authFlag) { // Lpay 가맹점 코드 인증
                    if (authFlag) {
                        // console.log("Lpay 인증 성공");
                        VCOrder.getLpayPaymentInfo($scope.basicInfo.member_info.pay_card_rcgn_id, function (data) {
                            if (data) {
                                // console.log("결제 수단 확인 성공", data);
                                $scope.basicInfo.member_info.fnCoNm = data.fnCoNm;
                                $scope.basicInfo.member_info.pmtMthdAlias = data.pmtMthdAlias;

                                orderProgress(); // 결제 진행
                            } else {
                                console.error("결제 수단 확인 실패");
                                $scope.basicInfo.member_info.base_op_pay_chk = false;
                            }
                        });
                    } else {
                        console.error("Lpay 인증 실패");
                        $scope.basicInfo.member_info.base_op_pay_chk = false;
                    }
                });
            } else { // Lpay가 아니라면
                orderProgress(); // 결제 진행
            }
        };

        function orderProgress() { // 결제 진행
            // console.log("결제 진행");
            $scope.pageUI.showOrder = true; // 결제 레이어 보이기

            var orderIframeSrc = VCOrder.getOrderUrl($scope.pageUI.orderInfo.cart_sn, $scope.pageUI.orderInfo.goods_list.goods_no);
            
            angular.element("#ordIframe").prop("src", orderIframeSrc);
        }

        /**
         * 결제 아이프레임 콜백
         * @param {String} resCode - 응답코드 ("0000" 정상)
         * @param {String} resMsg - 응답메시지
         * @param {String} ord_no - 주문번호
         */
        $scope.talkOrderCallBack = function (resCode, resMsg, ord_no) {
            if (resCode == "0000") { // 결제 완료
                $scope.pageLoading = true; // 로딩바

                // console.log("결제 성공");
                // TO-DO: 주문 완료 데이터 로드 후 주문완료 상태로 변경
                VCOrderComplete.getOrderComplete({
                    member_no: $scope.loginInfo.mbrNo, // 회원번호
                    ord_no: ord_no // 주문번호
                })
                .then(function (ordCompleteInfo) {
                    $scope.pageUI.orderCompleteInfo.ord_no = ordCompleteInfo.ord_no ? ordCompleteInfo.ord_no : null; // 주문번호

                    if (!$scope.pageUI.orderCompleteInfo.ord_no) {
                        $scope.pageUI.orderCompleteInfo.ord_no = ord_no;
                    }
                    $scope.pageUI.orderCompleteInfo.saun_info = ordCompleteInfo.saun_info;
                    $scope.pageUI.orderCompleteInfo.goods_list = ordCompleteInfo.goods_list && ordCompleteInfo.goods_list.items && ordCompleteInfo.goods_list.items[0] ? ordCompleteInfo.goods_list.items[0] : null; // 주문완료 상품 정보
                    $scope.pageUI.orderCompleteInfo.deliver_info = ordCompleteInfo.deliver_info ? ordCompleteInfo.deliver_info : null; // 배송정보
                    $scope.pageUI.orderCompleteInfo.total_amt = ordCompleteInfo.total_amt ? ordCompleteInfo.total_amt : 0; // 할인전 주문 합계 금액
                    $scope.pageUI.orderCompleteInfo.discount_amt = ordCompleteInfo.discount_amt ? ordCompleteInfo.discount_amt : 0; // 할인금액
                    $scope.pageUI.orderCompleteInfo.total_price = ordCompleteInfo.total_price ? ordCompleteInfo.total_price : 0; // 최종 주문 금액
                    $scope.pageUI.orderCompleteInfo.send_due_code = ordCompleteInfo.send_due_code ? ordCompleteInfo.send_due_code : null; // 도착/발송/명절구분코드
                    $scope.pageUI.orderCompleteInfo.send_due_date = ordCompleteInfo.send_due_date ? ordCompleteInfo.send_due_date : null; // ??
                    $scope.pageUI.orderCompleteInfo.send_due_month = ordCompleteInfo.send_due_month ? ordCompleteInfo.send_due_month : null; // 예정월 (명절일 경우 빈값)
                    $scope.pageUI.orderCompleteInfo.send_due_day = ordCompleteInfo.send_due_day ? ordCompleteInfo.send_due_day : null; // 예정일 (명절일 경우 빈값)
                    $scope.pageUI.orderCompleteInfo.send_due_week = ordCompleteInfo.send_due_week ? ordCompleteInfo.send_due_week : null; // 예정요일 (명절일 경우 빈값)

                    $scope.pageUI.showOrder = false;

                    self.changeState("order_complete");

                    // 상단 메시지 출력
                    var topMsg = $filter('number')(parseInt($scope.pageUI.orderCompleteInfo.total_price)) + "원에 결제가 완료되었어요.<br />",
                        voiceMsg = $filter('number')(parseInt($scope.pageUI.orderCompleteInfo.total_price)) + "원에 결제가 완료되었어요.";

                    if ($scope.pageUI.orderCompleteInfo.send_due_code == "01") { // 도착예정
                        topMsg += "<strong>" + $scope.pageUI.orderCompleteInfo.send_due_month + "월 " + $scope.pageUI.orderCompleteInfo.send_due_day + "일 도착 예정</strong>이며,<br />";
                        voiceMsg += $scope.pageUI.orderCompleteInfo.send_due_month + "월 " + $scope.pageUI.orderCompleteInfo.send_due_day + "일 도착 예정이며,";
                    } else if ($scope.pageUI.orderCompleteInfo.send_due_code == "02") { // 발송예정
                        topMsg += "<strong>" + $scope.pageUI.orderCompleteInfo.send_due_month + "월 " + $scope.pageUI.orderCompleteInfo.send_due_day + "일 발송 예정</strong>이며,<br />";
                        voiceMsg += $scope.pageUI.orderCompleteInfo.send_due_month + "월 " + $scope.pageUI.orderCompleteInfo.send_due_day + "일 발송 예정이며,";
                    } else if ($scope.pageUI.orderCompleteInfo.send_due_code == "03") { // 명절일때 예정일 안내 없음
                        topMsg += "";
                        voiceMsg += "";
                    }

                    topMsg += "자세한 주문정보는 주문배송조회에서 확인하실 수 있어요.";
                    voiceMsg += "자세한 주문정보는 주문배송조회에서 확인하실 수 있어요.";

                    self.showMsg(VCMsgData.getMsgData(topMsg, voiceMsg, "top"));
                    $scope.setVCAnalysis(voiceMsg ,"Y","Y");

                    $scope.pageUI.orderCompleteInfo.saun_info.areadyEnter = null;

                    if( $scope.pageUI.orderCompleteInfo.saun_info.evt_txt_view_yn == "Y" ){
                        //구매사은 이벤트 체크
                        VCSaunInfo.detailSaun({
                            evt_no : $scope.pageUI.orderCompleteInfo.saun_info.evt_saun_no
                        })
                        .then(function(result){
                            
                            if(result.areadyEnter == "Y" || result.areadyEnter == true ){//이미 응모
                                $scope.pageUI.orderCompleteInfo.saun_info.areadyEnter = "Y";
                            }else{
                                $scope.pageUI.orderCompleteInfo.saun_info.areadyEnter = "N";
                                if($scope.pageUI.orderCompleteInfo.saun_info.evt_txt_gbn == "3" || $scope.pageUI.orderCompleteInfo.saun_info.evt_txt_gbn == "4"){
                                    $scope.soundEndData = VCMsgData.msg.saunMoreShow;
                                    $scope.setGATag("샬롯질의", "구매사은질의메시지노출", null, null);
                                    $scope.setVCAnalysis(VCMsgData.msg.saunMoreShow.voice ,"Y","Y");
                                }
                            }
                            
                        }).catch(function () {
                            console.log("구매사은 이벤트 상세 실패");
                        });
                    }
                    
                })
                .catch(function () {
                    console.log("결제 실패 - 결제정보 없음");
                    $scope.pageUI.showOrder = false;
                })
                .finally(function () {
                    $scope.pageLoading = false; // 로딩바
                });
            } else { // 결제 실패
                $scope.alert_2016("[" + resCode + "] " + resMsg);
                $scope.pageUI.showOrder = false;
                angular.element("#ordIframe").prop("src", "");
            }

            // iOS 간헐적 헤더 숨김 이슈 해결
            function hideHeaderIOS() {
                VCAppApi.hideHeader();
            }
            
            hideHeaderIOS(); // 결제 종료 시 iOS 헤더 감추기
        };

        $window.talkOrderCallBack = $scope.talkOrderCallBack; // 주문 완료/실패 여부 event callback function 등록

        // Input창 발화 가이드 애니메이션
        $scope.iptGuideActiveIdx = 0;
        $scope.iptGuideHideIdx = -1;

        function rollingInputGuide() {
            // console.log("rollingInputGuide", $scope.iptGuideActiveIdx);
            if ($scope.pageUI.helpInfo.length > 1) {
                $scope.iptGuideHideIdx = $scope.iptGuideActiveIdx;

                if ($scope.iptGuideActiveIdx < $scope.pageUI.helpInfo.length - 1) {
                    $scope.iptGuideActiveIdx++;
                } else {
                    $scope.iptGuideActiveIdx = 0;
                }
            } else {
                $scope.iptGuideActiveIdx = 0;
                $scope.iptGuideHideIdx = -1;
            }
        }

        var iptRollingGuideInterval = null; // input창 가이드 애니메이션 인터벌
        var iptRollingGuideIntervalTime = 3000;

        function startIptRollingGuide() { // input창 가이드 애니메이션
            if (iptRollingGuideInterval) {
                $interval.cancel(iptRollingGuideInterval);
                iptRollingGuideInterval = null;
            }

            iptRollingGuideInterval = $interval(rollingInputGuide, iptRollingGuideIntervalTime);
        }

        // 로그인이 필요한 Command 수행 시 로그인 페이지로 이동 후 로그인 시 Command 실행
        self.needLoginCommand = function (command , data) {
            LotteStorage.setSessionStorage("vcLastCommandFlag", "Y");
            if(data){
                LotteStorage.setSessionStorage("vcLastCommandData", data);
            }
            VCPageMove.goLogin(command);
        };

        // 보이스 커머스 위시/장바구니 불가 상품 체크로직
        function chkVoiceProd(prodInfo) {
            var rtnVal = true;
            var curProdInfo = null;

            if (!prodInfo) {
                curProdInfo = self.getCurProdInfo();
            } else {
                curProdInfo = prodInfo;
            }

            // VINE 체크도 기획상 포함되어 있으나, VINE 장바구니나 위시에 담을 수 없음
            if (curProdInfo.limit_age_yn == "Y" || // 19금 상품 체크
                curProdInfo.input_option_yn == "Y" || // 입력형 옵션 체크
                curProdInfo.rental_yn == "Y" || // 렌탈상품 여부 체크)
                curProdInfo.smpick_yn == "Y" // 스마트픽 전용
                ) {
                rtnVal = false;
            }
            
            return rtnVal;
        }
        
        /********************************************************************************
         *  사만다 메시지 출력
         * @param msgData {txt: msg, voice: msg, position: position}
         * position - home: 홈, top: 상단, q: 질의, voice: 음성 Only
         * onMic - 연속 마이크 활성화
         ********************************************************************************/
        var msg_q_timer = null;
        var msgMaxShowTime = 5000;

        $scope.viewInfoTemp = null;
        $scope.viewInfoTempMicCheck = false;

        self.showMsg = function (msgData, replaceDataArr, onMic) {

            if (!msgData || $scope.pageUI.inputMode =="mic") {
                return;
            }
            // position q 이고 inputMode가 keyboard 나 mic 상태일때는 보이지 않음
            if($scope.pageUI.inputMode != "" && msgData.position == "q"){
                return;
            }
            // 모든 사만다 메시지 감추기
            // if (msgData.position != "voice") {
            //     $scope.pageUI.showMsg.guide = false;
            //     $scope.pageUI.showMsg.home = false;
            //     $scope.pageUI.showMsg.top = false;
            //     $scope.pageUI.showMsg.q = false;
            // }
            // 메세지 타입에 따른 타 메시지 감춤 처리
            if (msgData.position == "q"){

            }else if (msgData.position == "top") {
                $scope.pageUI.showMsg.guide = false;
                $scope.pageUI.showMsg.home = false;
            } else if (msgData.position == "home") {
                $scope.pageUI.showMsg.top = false;
                $scope.pageUI.showMsg.guide = false;
            }
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

            switch (viewInfo.position) {
                case "home": // 중앙 메시지 처리
                    $scope.stopVoiceGuide(); // 중앙 메시지 노출 시 홈 발화가이드 애니메이션 종료
                    $scope.pageUI.msg.home = viewInfo.txt;
                    $scope.pageUI.showMsg.home = true;
                    break;
                case "top": // 상단 메시지 처리
                    $scope.pageUI.msg.top = viewInfo.txt;
                    $scope.pageUI.stateHistory[$scope.pageUI.stateHistory.length - 1].msgTop = viewInfo.txt; //promise 후 저장
                    $scope.pageUI.showMsg.top = true;
                    break;
                case "q": // 질의 메시지 처리
                    $scope.pageUI.showMsg.q = true;
                	
                    $scope.pageUI.inputMode = ""; // 입력창 초기화 이후 활성화 진행
                    $scope.pageUI.msg.q = viewInfo.txt;

                    $scope.viewInfoTemp = viewInfo;
                    if(onMic){
                        $scope.viewInfoTempMicCheck = true;
                    }
                    // 기존 타이머가 있다면 타이머 중단
                    if (msg_q_timer) {
                        $timeout.cancel(msg_q_timer);
                        msg_q_timer = null;
                    }
                    addQMsgCloseEvent();
                	
                    break;
                case "voice": // 질의 메시지 처리
                    $scope.viewInfoTemp = viewInfo;
                    if(onMic){
                        $scope.viewInfoTempMicCheck = true;
                    }
                    break;
            }
            self.stopAppTTS(); // 사만다 메시지 음성 안내 중단
            
            // 음성 메시지 발화는 모든 케이스에 적용
            if ($scope.pageUI.app.soundFlag) { // Sound Mode 가 true 일때만
                $scope.pageUI.inputMode = ""; // 입력창 초기화 이후 TTS 진행 (TTS시 마이크로 소리 들어감)

                //if($scope.pageUI.inputMode != "mic"){
	                $timeout(function () {
                        self.startAppTTS(viewInfo.voice);
	                }, 200);
                //}
            }else{
                // 메시지 최대 노출 시간 이후 감추기
                // TTS 발화 종료 Callback 실행 
                msg_q_timer = $timeout(function () {
                    VCAppApi.TTSEndCallbackFunc();
                }, msgMaxShowTime);
            }
            if (viewInfo.voice) {
                self.showToast(viewInfo.voice);
            }
        };

        // 질의 메시지 노출 시 이외 영역 터치하면 메시지 사라지도록 이벤트 추가
        function addQMsgCloseEvent() {
            angular.element($window).off(".qMsg").on("touchstart.qMsg", function (event) {
                angular.element($window).off(".qMsg");

                $scope.pageUI.showMsg.q = false;
                
                if (msg_q_timer) {
                    $timeout.cancel(msg_q_timer);
                    msg_q_timer = null;
                }

                if($scope.findQuestionEqual($scope.viewInfoTemp.txt)){
                    yesNoFlag = true;
                }
            });
        }

        // 로그인 여부, 배송지 정보 여부, 결제수단 여부 체크
        function chkUserOrderInfo() {
            var rtnValue = $scope.loginInfo.isLogin && $scope.basicInfo.member_info.et_mbr_dlvp_chk && $scope.basicInfo.member_info.base_op_pay_chk;

            if (!rtnValue) {
                if (!$scope.basicInfo.member_info.et_mbr_dlvp_chk && !$scope.basicInfo.member_info.base_op_pay_chk) {
                    self.showMsg(VCMsgData.msg.regiMydlvpPay);
                
                }else if (!$scope.basicInfo.member_info.et_mbr_dlvp_chk) {
                    self.showMsg(VCMsgData.msg.regiMydlvp);
                
                }else if(!$scope.basicInfo.member_info.base_op_pay_chk){
                    self.showMsg(VCMsgData.msg.regiMypay);
                }
                $scope.toggleSideNav(true); // 햄버거 열기
            }

            return rtnValue;
        }

        // 일반 주문서 이동 시 (음성주문 불가) 수량 발화가 있는 케이스 처리
        function goNormalOrderChangeCnt(curPordInfo) {
            $scope.pageLoading = true; // 로딩바

            VCUpdateCart.updateCart({
                cart_sn: curPordInfo.cart_sn, // 장바구니 번호
                ord_qty: $scope.pageUI.orderInfo.orderCnt, // 주문수량
                item_no: curPordInfo.item_no, // 선택 단품옵션 번호
                update_ck: false, // 옵션 변경 유무
                goods_no: curPordInfo.goods_no, // 
                goods_cmps_cd: curPordInfo.goods_cmps_cd
            }) // 장바구니 정보 업데이트
            .then(function (res) {
                VCPageMove.voiceUnableOrder(curPordInfo.cart_sn); // 일반 주문으로
            })
            .catch(function () {
                console.error("장바구니 옵션 업데이트 실패");
                $scope.alert_2016("장바구니 옵션 반영 오류 발생");
            })
            .finally(function () {
                $scope.pageLoading = false; // 로딩바
            });
        }

        /**
         * 음성으로만 발화되는 케이스에 대해 개발 토스트 메시지 노출
         */
        $scope.devToastMsg = "";
        $scope.devToastMsgShowFlag = false;

        self.showToast = function (txt) {
            $scope.devToastMsg = txt;
            $scope.devToastMsgShowFlag = true;

            $timeout(function () {
                $scope.devToastMsgShowFlag = false;
            }, 3000);
        };

        /**
         *  의미 분석에서 돌아온 메시지 출력하기
         * 
         *  basicVoiceMent: 기본 음성 멘트
         *  homeScreenMent: 홈 화면 멘트
         *  topScreenMent: 상단 화면 멘트
         *  queryMent: 질의멘트
         */
        self.semanticMsgShow = function (data) {
            if (data.topScreenMent) { // 상단 메시지가 있다면
                self.showMsg(VCMsgData.getMsgData(data.topScreenMent, data.basicVoiceMent, 'top'));
            } else if (data.queryMent) { // 질의 메시지가 있다면
                self.showMsg(VCMsgData.getMsgData(data.queryMent, data.basicVoiceMent, 'q'));
            } else if (data.homeScreenMent) {
                self.showMsg(VCMsgData.getMsgData(data.homeScreenMent, data.basicVoiceMent, 'home'));
            }
        };

        /********************************************************************************
         *  의미분석 Command에 따른 화면별 케이스 처리
         * @param command 명령
         * @param data 추가 데이터
         * data: {
         *  responseCode: 결과코드
         *  responseMsg: 결과메시지
         *  basicVoiceMent: 기본 음성 멘트
         *  homeScreenMent: 홈 화면 멘트
         *  topScreenMent: 상단 화면 멘트
         *  queryMent: 질의멘트
         *  command: 명령어 텍스트
         *  commandVal: 음성 발화 추가 데이터 (옵션변경해줘: yes|no, 옵션바꿔줘: 1,2,3,4,5,6,7,8,9,10...)
         *  preReqParam: 결과를 호출하기 위해 사용한 URL
         *  goodsNoList: 검색된 상품 리스트 정보
         *  analysisData: 의미분석을 위해 사용된 data (챗봇서버 디버그 용도임)
         *  recommendData: 의미분석을 통해 식별된 추천용 분석 정보 (챗봇서버 디버그 용)
         *  commandNumber : 숫자
         *  commandDate  일 
         *  commandDayOfWeek 요일
         *  commandPeriod 기간
         *  commandMonth 달
         *  
         * }
         * @param sendTxt: 고객 발화 내용
         * @param iptType: mic: 음성, click: 터치, keyboard: 키패드
         * 
         ********************************************************************************/
        var optChangeYNDelayFlag = false; // 옵션 변경해줘 발화 응/아니오 대기 Flag
        var addWishLoginFlag = false; // 위시 담아줘 발화 응/아니오 대기 Flag
        var addCartLoginFlag = false; // 장바구니 담아줘 발화 응/아니오 대기 Flag
        var mimiNoRegistQ = false; // 미미뚜뚜 응/아니오 대기 Flag
        $scope.styleOtherQue = false; // 스타일추천 응/아니오 대기 Flag
        var yesNoFlag = false; //응/아니오 대기 Flag

        $scope.prodListQuantity = -1;//수량 발화 임시데이타
        $scope.prdSwiperMoveCommand = ""; // GA 리스트 스와이프 이동 touch , voice , key 3가지 문자로 구분
        $scope.listClickState = false; //리스트 이전 버튼 클릭 여부

        self.commandExec = function (command, data, sendTxt, iptType) {

            angular.element($window).off("scroll.eventDetail"); //이벤트 상세보기 스크롤 이벤트 삭제
            self.autoSlideDestroy(); //자동 슬라이드 초기화

            $scope.pageUI.isChangeCommandState = false;
            if($scope.listClickState){
                $scope.pageUI.isChangeCommandState = false;
            }else{
                //다음 페이지가 있는 리스트 모음 (장바구니 , 위시리스트 , 자주구매상품 , 이벤트 응모내역)
                if(command == "getCart" ||  command == "getWish" ||  command == "getOftenList" || command =="getEventApplicationDetail"){
                    $scope.pageUI.curPage = 1;
                    $scope.pageUI.isChangeCommandState = true;
                }
            }
            $scope.listClickState = false;

            switch (command) {
                // 일상대화, 금칙어에 대한 command 처리
                case "talk": // 일상대화
                case "prohibit": // 금칙어
                    if(command == "talk"){
                    	$scope.setGATag("공통_일상대화", "일상대화", sendTxt, iptType);
                    } else{
                    	$scope.setGATag("공통_금칙어", "금칙어", sendTxt, iptType);
                    }
                    
                    if (data && (data.homeScreenMent || data.queryMent)) {
                        
                        self.changeState("home"); // 홈화면에서 일상대화 노출을 위해 STATE home으로 전환
                        // var text = 'web<br>is<br>free';
                        var text = data.homeScreenMent || data.queryMent;
                        var position = "home";

                        if (!data.homeScreenMent && data.queryMent) {
                            position = "q";
                        }

                        var regexpText = text.replace(/(\\n|\n)/g, "<br />");
                        var regexpVoice = data.basicVoiceMent.replace(/(\\n|\n)/g, "");
                        self.showMsg(VCMsgData.getMsgData(regexpText, regexpVoice, position)); // 메세지에 대해 중앙 메시지 부분에서 노출 // TO-DO : 메시지 데이터 부분 수정 필요
                    }
                    break;
                // 페이지 이동에 대한 command 처리 (로그인에 따른 처리 필요한지 검토)
                case "goLogin": // 로그인페이지
                	if($(".myinfo_side_wrap").hasClass("open")){
                		$scope.setGATag("햄버거_공통", "로그인", null, "click");
                	}else{
                		$scope.setGATag("공통_로그인", "로그인", sendTxt, iptType);	
                	}
                    if ($scope.loginInfo.isLogin) { // 로그인 중이라면
                        self.showMsg(VCMsgData.msg.nowLogin);
                        $scope.setVCAnalysis(VCMsgData.msg.nowLogin.voice,"Y","Y");
                    } else {
                        $scope.setVCAnalysis("로그인해 주세요" ,"Y","Y");
                        VCPageMove.goLogin();
                    }
                    break;
                // 페이지 이동에 대한 command 처리 - 로그인 필요 페이지
                case "goChangePayment": // 결제수단 변경
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                    	self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                    	$scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                        $scope.setGATag("햄버거_등록", "결제수단", sendTxt, iptType);
                    }else{
                    	$scope.setGATag("공통_정보변경", "결제수단 변경", sendTxt, iptType);
                    }
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                case "actionChange":
                    if($scope.pageUI.state =="order_inquiry"){//주문배송
                        self.showMsg(VCMsgData.msg.purchaseChangeLike);
                        $scope.setVCAnalysis(VCMsgData.msg.purchaseChangeLike.voice ,"Y","Y");
                    }
                    $scope.setGATag("음성명령어", "변경해줘", sendTxt, iptType);
                    break;
                case "actionChangeDelivery": // 배송지 변경
                    if($scope.pageUI.state =="order_inquiry"){//주문배송
                        if(data && data.commandNumber){
                            var checkNum = data.commandNumber;
                        
                            if($scope.pageUI.purchaseList.length >= checkNum ){
                                checkNum = checkNum -1;
                                if($scope.pageUI.purchaseList[checkNum].dlv_change_psb_yn == "Y"){//배송지 변경 가능 확인
                                    $scope.orderDetail($scope.pageUI.purchaseList[checkNum].ord_no)
                                }else{
                                    //배송지 변경 불가능
                                    self.showMsg(VCMsgData.msg.purchaseSelectNone , ["배송지 변경"]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["배송지 변경"]).voice ,"Y","Y");
                                }
                                break;
                            }else if($scope.pageUI.purchaseList.length < checkNum){
                                //취소 가능한 번호가 없음
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                                break;
                            }
                        }else {
                            self.showMsg(VCMsgData.msg.purchaseDeliverLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseDeliverLike.voice ,"Y","Y");
                            break;
                        }
                    }else{
                        if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                            $scope.setGATag("햄버거_등록", "배송지", sendTxt, iptType);
                            self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                            $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                        }else{
                        	$scope.setGATag("공통_정보변경", "배송지 변경", sendTxt, iptType);
                        }
                        VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    }
                    
                    break;
                case "goPurchaseList": // 주문배송조회 
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                    	self.showMsg(VCMsgData.msg.needLogin); //로그인해 주세요.
                    	$scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "주문배송조회 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goCoupon": // 쿠폰  
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                    	self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                    	$scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "쿠폰 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goPoint": // 포인트내역 (L.point 탭)  
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); //로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "엘포인트 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)                	 
                 	break;
                case "goLmoney": // 포인트내역 (L.money 탭)  
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); //로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "엘머니 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)                	 
                 	break;
                case "goDeposit": // 포인트내역 (보관금 탭)  
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); //로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "보관금 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)                	 
                 	break;
                case "goClover": // 포인트내역 (클로버)  
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); //로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "클로버 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)                	 
                 	break;
                case "goCloverUseInfo": // 포인트내역 (클로버)  
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); //로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    if(iptType == "voice" || iptType == "keyboard"){
                    	$scope.setGATag("자세히", "클로버이용안내", sendTxt, iptType);
                    }
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)                	 
                 	break;
                case "goWish": // 위시리스트
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "위시리스트 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                 	break;
                case "goEvent": // 이벤트 응모내역 
                    if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "이벤트응모내역 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
	              	break;
                case "goPurchaseGiftList": // 구매사은 신청(나의신청내역) 
                	if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                	$scope.setGATag("공통_이동", "구매사은 신청내역보기", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
	              	break;
                case "goMembership": // 멤버십&쿠폰존 
                	if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                	$scope.setGATag("공통_이동", "멤버십 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
	              	break;
                case "goCenterQue": // 1:1문의하기
                	if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }else{
                    	self.showMsg(VCMsgData.msg.centerCallQue);	
                    	$scope.setVCAnalysis(VCMsgData.msg.centerCallQue.voice ,"Y","Y");
                    }
                	$scope.setGATag("공통_고객센터", "1:1문의 이동", sendTxt, iptType);
                	VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
	              	break;
                case "goTalkAdvice": // 톡상담
                	if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                	$scope.setGATag("공통_고객센터", "톡상담 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
	              	break;
                case "goMimitoutou" : //미미뚜뚜 아이 등록
                	if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "미미뚜뚜 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;     
                	
                // 페이지 이동에 대한 command 처리 - 로그인 불필요 페이지
                case "goMyLotte": // 마이롯데
                	if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                        self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                    }
                    $scope.setGATag("공통_이동", "마이롯데 이동", sendTxt, iptType); 
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)  
                	break;
                case "goCart": // 장바구니
                    $scope.setGATag("공통_이동", "장바구니 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goRecently": // 최근 본 상품  
                    $scope.setGATag("공통_이동", "최근본상품 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMallMimitoutou": // 전문관-미미뚜뚜  
                    $scope.setGATag("공통_이동", "미미뚜뚜 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;           	
                case "goMallSpecialTasty": // 전문관-특별한맛남
                    $scope.setGATag("공통_이동", "특별한맛남이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMallStyleshop": // 전문관-스타일샵
                    $scope.setGATag("공통_이동", "스타일샵 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMallLottebrand": // 전문관-롯데브랜드몰
                    $scope.setGATag("공통_이동", "롯데브랜드관 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMallKshop": // 전문관-KShop
                    $scope.setGATag("공통_이동", "케이샵 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMallScalp": // 전문관-두피전문관
                    $scope.setGATag("공통_이동", "두피전문관 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMallTVoutlet": // 전문관-TV아울렛
                    $scope.setGATag("공통_이동", "tv아울렛 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMallBook": // 전문관-도서
                    $scope.setGATag("공통_이동", "도서 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMallTenbyten": // 전문관-텐바이텐
                    $scope.setGATag("공통_이동", "텐바이텐 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMallVine": // 전문관-Vine
                    $scope.setGATag("공통_이동", "바인 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMain": // 메인-홈탭
                    $scope.setGATag("공통_이동", "홈 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMainBest": // 메인-베스트탭
                    $scope.setGATag("공통_이동", "베스트 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMainGift": // 메인-기프트탭
                    $scope.setGATag("공통_이동", "기프트 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goMainEvent": // 메인-이벤트/쿠폰탭
                    $scope.setGATag("공통_이동", "이벤트쿠폰 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                // case "goLuckybox": // 럭키박스이벤트 4/27 서비스 종료
                case "goDirectAttend": // 출석체크이벤트
                    $scope.setGATag("공통_이동", "출석체크 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                	break;
                case "goPurchaseGift": // 구매사은 신청
                	$scope.setGATag("공통_이동", "구매사은 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                case "goCiritOut": // 상품평 관리
                	$scope.setGATag("공통_이동", "상품평 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                case "goInqList": // 상품문의 내역
                	$scope.setGATag("공통_이동", "상품문의내역 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                case "goInquire": // 일대일 문의 답변
                	$scope.setGATag("공통_이동", "1:1문의답변 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                case "goPresent": // 선물함
                	$scope.setGATag("공통_이동", "선물함 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                case "goExchange": // 교환권
                	$scope.setGATag("공통_이동", "교환권 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                case "goSmartPay": // 스마트페이
                	$scope.setGATag("공통_이동", "스마트페이 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                case "goReceiptList": // 영수증이벤트
                	$scope.setGATag("공통_이동", "영수증 이벤트 이동", sendTxt, iptType);
                    VCPageMove.go(command); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                case "goFrequentlyPurchaseProduct": // 자주구매상품 이동
                	$scope.setGATag("공통_이동", "자주구매 이동", sendTxt, iptType);
                    VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
                    break;
                // 액션에 대한 command 처리 (State별 케이스 별도 처리)
                case "actionHelp":
                    self.loadChangehelp({actionHelp:"open"} , sendTxt, iptType);
                    break;
                case "actionChangeMyInfo": // 내 정보 변경해줘/바꿔줘 (햄버거 오픈)
                    $scope.pageUI.sideNavOpenFlag = true;
                    self.showMsg(VCMsgData.msg.changeMyInfo);
                    $scope.setVCAnalysis(VCMsgData.msg.changeMyInfo.voice ,"Y","Y");
                    $scope.setGATag("공통_정보변경", "내정보 변경", sendTxt, iptType);
                    break;
                case "actionBack": // 이전으로
                    if ($scope.pageUI.state == "home") { // 홈: 사만다 메시지 안내
                        $scope.setGATag("음성명령어", "이전", sendTxt, iptType);
                        self.commandExec("actionFirst");
                    } else if ($scope.pageUI.state == "cart" || $scope.pageUI.state == "wish" || $scope.pageUI.state == 'purchase_frequently') { // 장바구니 , 위시리스트: 
                        // 페이지 확인 필요 (첫페이지인지)
                        if ($scope.pageUI.curPage > 1) { // 첫페이지가 아니라면
                            $scope.swipeListPrev();
                        } else { // 첫페이지라면
                            backKeyCallback();
                            $scope.setVCAnalysis("이전" ,"Y","Y");
                        }
                    }else if($scope.pageUI.state == "customer_center"){
                        $scope.setGATag("음성명령어", "이전", sendTxt, iptType);
                        $scope.setVCAnalysis("이전" ,"Y","Y");
                        self.commandExec("actionFirst");
                    }else{
                        $scope.setGATag("음성명령어", "이전", sendTxt, iptType);
                        $scope.setVCAnalysis("이전" ,"Y","Y");
                    	backKeyCallback();
                    }
                    
                    break;
                case "actionMore": //더보여줘
                    if($scope.pageUI.stateSelectorViewInfo && $scope.pageUI.stateSelector.length > 0 &&  $scope.pageUI.stateSelectorViewClass == false){
                        $scope.stateSelectorOpenCloseM(true);
                        if($scope.pageUI.state == "situation_recommendation" || $scope.pageUI.state == "management_item_recommendation"){
                        	$scope.setGATag("공통_추천", "더보기", sendTxt, iptType);
                        }else{
                        	$scope.setGATag("키워드", "더보기", sendTxt, iptType);
                        }
                        break;
                    }

                    if ($scope.checkListState($scope.pageUI.state)) { //상품리스트 : 더 보여줘
                    	if($scope.pageUI.state != "style_recommendation" &&  $scope.pageUI.prdList.length - 1 == $scope.pageUI.curPrdSwiperIdx){
                            if($scope.pageUI.state == "wish" || $scope.pageUI.state == "cart" || $scope.pageUI.state == "purchase_frequently"){
                                self.commandExec("actionNext");
                            }else{
                                if($scope.pageUI.state == "cart" || $scope.pageUI.state == "wish" || $scope.pageUI.state == "purchase_frequently"){
                                    self.showMsg(VCMsgData.msg.prdListEndList); //마지막 상품메세지
                                    $scope.setVCAnalysis(VCMsgData.msg.prdListEndList.voice ,"Y","Y");
                                }else{
                                    self.showMsg(VCMsgData.msg.prdListEnd); //마지막 상품메세지
                                    $scope.setVCAnalysis(VCMsgData.msg.prdListEnd.voice ,"Y","Y");
                                }
                            }
                        }else {
                        	self.startAutoSlide("list");
                        }
                    } else if ($scope.pageUI.state == "prod_detail") {
                        var actionDownTargetPosY = angular.element($window).scrollTop() + angular.element($window).height();
                        angular.element("html, body").stop().animate({scrollTop:actionDownTargetPosY}, 300, 'swing');
                    } else if ($scope.checkListStateVertical($scope.pageUI.state)) {
                        self.startAutoSlide("vertical");
                    }else{
                    	switch($scope.pageUI.state){
                    	case "home":
                    	case "chulcheck":
                    		self.showMsg(VCMsgData.msg.homeMore);
                    		$scope.setVCAnalysis(VCMsgData.msg.homeMore.voice ,"Y","Y");
                    		break;
                    	// no default
                    	}
                    }
                    /*} else if($scope.pageUI.state == "home" || $scope.pageUI.state == "chulcheck"){
                        self.showMsg(VCMsgData.msg.homeMore);
                        $scope.setVCAnalysis(VCMsgData.msg.homeMore.voice ,"Y","Y");
                    }*/
                    $scope.setGATag("음성명령어", "더보여줘", sendTxt, iptType);
                    break;
                case "actionNext": //다음
                    if ($scope.pageUI.state == "home") { // 홈: 다음 
                        $scope.pageUI.showHotKeyword = false;
                        $scope.pageUI.showMsg.top = false;
                        $scope.pageUI.showMsg.guide = true;
                        $scope.pageUI.showMsg.home = false;

                        self.showMsg(VCMsgData.msg.homeMore);
                        $scope.setVCAnalysis(VCMsgData.msg.homeMore.voice ,"Y","Y");
                        $scope.setGATag("음성명령어", "다음", sendTxt, iptType);
                    } else if ($scope.checkListState($scope.pageUI.state)) { //상품리스트 :
                        if ($scope.pageUI.prdList.length - 1 > $scope.pageUI.curPrdSwiperIdx) {
                            $scope.prdSwiperCtrl.moveIndex($scope.pageUI.curPrdSwiperIdx + 1);
                            $scope.setGATag("음성명령어", "다음", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), iptType);
                        } else{
                            //장바구니 위시리스트 자주구매 마지막 상품에서 발활시 다음페이지 또는 마지막상품 메세지 노출
                            if($scope.pageUI.curPage < $scope.getTotalRowPerPage()){
                                $scope.swipeListNext();
                            }else{
                                if($scope.pageUI.state == "cart" || $scope.pageUI.state == "wish" || $scope.pageUI.state == "purchase_frequently"){
                                    self.showMsg(VCMsgData.msg.prdListEndList); //마지막 상품메세지
                                    $scope.setVCAnalysis(VCMsgData.msg.prdListEndList.voice ,"Y","Y");
                                }else{
                                    self.showMsg(VCMsgData.msg.prdListEnd); //마지막 상품메세지
                                    $scope.setVCAnalysis(VCMsgData.msg.prdListEnd.voice ,"Y","Y");
                                }
                                $scope.setGATag("음성명령어", "다음", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), iptType);
                            }
                        }
                    } else if ($scope.pageUI.state == "prod_detail") {
                        var actionDownTargetPosY = angular.element($window).scrollTop() + angular.element($window).height();
                        angular.element("html, body").stop().animate({scrollTop:actionDownTargetPosY}, 300, 'swing');
                        $scope.setGATag("음성명령어", "다음", sendTxt, iptType);
                    } else if ($scope.pageUI.state == "order" ||
                        $scope.pageUI.state == "order_complete") {
                        $scope.setGATag("음성명령어", "다음", sendTxt, iptType);
                    } else if ($scope.checkListStateVertical($scope.pageUI.state)) {
                        self.autoSlideRun("vertical");
                        $scope.setGATag("음성명령어", "다음", sendTxt, iptType);
                    }
                	break;
                case "actionFirst":
                    if ($scope.pageUI.state == "home") { // 홈: 처음으로 
                        if($scope.pageUI.showHotKeyword == false ){
                            self.showMsg(VCMsgData.msg.isHome);
                            $scope.setVCAnalysis(VCMsgData.msg.isHome.voice ,"Y","Y");
                        }
                        $scope.pageUI.showHotKeyword = false;
                        $scope.pageUI.showMsg.top = false;
                        $scope.pageUI.showMsg.guide = true;
                        $scope.pageUI.showMsg.home = false;
                        $scope.setGATag("음성명령어", "처음으로", sendTxt, iptType);
                        
                    } else {
                        $scope.pageUI.showMsg.top = false;
                        $scope.setGATag("음성명령어", "처음으로", sendTxt, iptType);	
                        self.changeState("home", {guideFlag: true}, true);
                    }                	
                	break;
                case "actionUp": 
                	if ($scope.pageUI.state == "prod_detail") {
                        angular.element("html, body").stop().animate({scrollTop:0}, 300, 'swing');	 
                	 }else if ($scope.checkListStateVertical($scope.pageUI.state)) {
                        self.autoSlideRun("vertical" , "up");
                    }
                  	$scope.setGATag("음성명령어", "위로", sendTxt, iptType);
                	break;
                case "actionDown": 
                    if ($scope.pageUI.state == "prod_detail") {
                        var actionDownTargetPosY = angular.element($window).scrollTop() + angular.element($window).height();
                        angular.element("html, body").stop().animate({scrollTop:actionDownTargetPosY}, 300, 'swing');
                    }else if ($scope.checkListStateVertical($scope.pageUI.state)) {
                        self.autoSlideRun("vertical" , "down");
                    }
                    $scope.setGATag("음성명령어", "아래로", sendTxt, iptType);
                	break;
                case "actionClose": // 사만다 닫기
                	
                	if($scope.pageUI.showPrdOpt){
                   		$scope.setGATag("옵션레이어", "닫기", sendTxt, iptType);
                	}
                	
                	if($scope.pageUI.showShare){
                		if(iptType == "voice" || iptType == "keyboard"){
                			$scope.setGATag("공유레이어", "닫기", sendTxt, iptType);
                		}
                    }
                    
                    if (!self.chkShowLayer()) { // 열려져 있는 레이어 체크 후 있으면 닫고 없다면 사만다 종료
                    
                        if($scope.pageUI.stateSelectorViewInfo && $scope.pageUI.stateSelectorViewClass){
                            $scope.stateSelectorOpenCloseM(false);
                            if($scope.pageUI.state == "situation_recommendation" || $scope.pageUI.state == "management_item_recommendation"){
                            	$scope.setGATag("공통_추천", "닫기", sendTxt, iptType);
                            }else{
                            	$scope.setGATag("키워드", "닫기", sendTxt, iptType);
                            }
                            break;
                        }
                        $scope.setGATag("음성명령어", "닫기", sendTxt, iptType);
                        $scope.exit();
                    }
                    
                    
                	break;
                case "actionUnknown":
                   	self.showMsg(VCMsgData.msg.unknown);
                   	$scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                	$scope.setGATag("음성명령어", "의미분석실패", sendTxt, iptType);
                	break;
                case "actionOrder": // 주문할래
                case "goPayment": // 결재해줘
                    
                    if ($scope.pageUI.state == "home" || $scope.pageUI.prdList.length < 1) {
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                    
                    var curPordInfo = self.getCurProdInfo(); // 현재 선택 상품 정보
                    var dataNum = data && data.commandNumber ? parseInt(data.commandNumber) - 1 : -1; // 번호 발화
                    var dataCnt = data && data.commandQuantity ? parseInt(data.commandQuantity) : 0; // 수량 발화

                    /**
                     * 수량 발화 체크
                     */
                    var dataCntFlag = false; // 수량 변경 여부

                    if (dataCnt >= 1) { // 수량 발화가 정상적이라면
                        if ($scope.pageUI.state == "order") { // 주문확정에서 주문해줘 발화 시
                            $scope.pageUI.orderInfo.orderCnt = dataCnt;
                            if (curPordInfo.cart_sn) { // 장바구니 상품이라면
                                self.orderDecide(curPordInfo.cart_sn, true);
                            } else {
                                self.orderDecide();
                            }
                            //self.showMsg(VCMsgData.msg.unknown);
                            $scope.setGATag("음성명령어", "수량 변경 주문", sendTxt, iptType);
                            break;
                        }
                        dataCntFlag = true;
                        $scope.pageUI.orderInfo.orderCnt = dataCnt; // 발화 주문 수량 세팅
                        $scope.setGATag("음성명령어", "수량 변경 주문", sendTxt, iptType);
                        
                    } else {
                        if ($scope.prodListQuantity > 0) {
                            $scope.pageUI.orderInfo.orderCnt = $scope.prodListQuantity;
                        } else{
                            $scope.pageUI.orderInfo.orderCnt = parseInt(curPordInfo.min_lmt_qty); // 주문 최소 수량 세팅
                        }                    
                    }
                    
                    if($scope.pageUI.orderInfo.orderCnt < parseInt(curPordInfo.min_lmt_qty)){
                        self.showMsg(VCMsgData.msg.errMinLmtQty , [parseInt(curPordInfo.min_lmt_qty)]);
                        $scope.pageUI.orderInfo.orderCnt = parseInt(curPordInfo.min_lmt_qty); // 주문 최소 수량 세팅
                        break;
                    }else if($scope.pageUI.orderInfo.orderCnt > parseInt(curPordInfo.max_lmt_qty)){
                        self.showMsg(VCMsgData.msg.errMxnLmtQty , [parseInt(curPordInfo.max_lmt_qty)]);
                        $scope.pageUI.orderInfo.orderCnt = parseInt(curPordInfo.min_lmt_qty); // 주문 최소 수량 세팅
                        break;
                    }
                    
                    if ($scope.checkListState($scope.pageUI.state)) { // 리스트에서 발화 시
                        /**
                         * 순번 발화 체크
                         */
                        if (dataNum > -1 && $scope.pageUI.prdList.length > dataNum) { // 번호 발화가 정상적이라면
                            $scope.pageUI.curPrdSwiperIdx = dataNum;
                            //console.log("번호발화 있음", dataNum);
                            $scope.prdSwiperCtrl.moveSpeedIndex(dataNum, 10); // 해당 상품 정보로 스와이프 위치 변경
                            curPordInfo = self.getCurProdInfo(); // 현재 선택 상품 정보
                        }

                        if ($scope.pageUI.state == "cart" || $scope.pageUI.state == "purchase_frequently") { // 장바구니에서 발화 시
                            if (curPordInfo.vic_ord_psb_yn == 'Y') { // 음성주문 가능
                                if (chkUserOrderInfo()) { // 로그인 여부, 결제, 배송지 세팅 유무 확인
                                    
                                    $scope.pageUI.optInfo.selectedOptItemNo = curPordInfo.item_no; // 장바구니에 선택된 옵션으로 세팅
                                    // 장바구니 리스트의 선택 옵션 정보로 선택 옵션 정보 세팅
                                    if (self.chkOpt() && curPordInfo.goods_option) { // 옵션 유무 확인
                                        $scope.pageUI.optInfo.curOptValArr = [];
                                        var tmpOptionStr = curPordInfo.goods_option,
                                            tmpCurOptValArr = [],
                                            tmpCurOptSplit = null,
                                            tmpCurOptNo = 0;

                                        if (curPordInfo.input_option_yn == "Y" && curPordInfo.goods_input_option) { // 입력형/날짜형 옵션 확인
                                            tmpOptionStr += ", " + curPordInfo.goods_input_option;
                                        }

                                        tmpCurOptValArr = (tmpOptionStr + "").split(", ");

                                        for (tmpCurOptNo = 0; tmpCurOptNo < tmpCurOptValArr.length; tmpCurOptNo++) {
                                            tmpCurOptSplit = null;
                                            tmpCurOptSplit = (tmpCurOptValArr[tmpCurOptNo] + "").split(" : ");

                                            if (tmpCurOptSplit.length == 2) {
                                                $scope.pageUI.optInfo.curOptValArr.push({
                                                    name: tmpCurOptSplit[0],
                                                    item: {
                                                        optValue: tmpCurOptSplit[1]
                                                    }
                                                });
                                            }
                                        }
                                    }

                                    if (!dataCntFlag && curPordInfo.ord_qty) { // 수량 발화가 없었다면 장바구니 담긴 수량으로 세팅
                                        $scope.pageUI.orderInfo.orderCnt = curPordInfo.ord_qty;
                                    }

                                    if (curPordInfo.cart_sn) { // 장바구니 번호가 있는지 확인
                                        if (curPordInfo.smpick_yn == "Y") { // 스마트픽 주문서에 담겨 있는지 확인
                                            if (dataCntFlag) { // 수량 발화가 있었다면 수량 업데이트 이후 일반 주문서로
                                                goNormalOrderChangeCnt(curPordInfo);
                                            } else {
                                                VCPageMove.voiceUnableOrder(curPordInfo.cart_sn); // 일반 주문으로 이동
                                                self.showMsg(VCMsgData.msg.notVoiceOrder); // 주문 불가 Alert
                                                $scope.setVCAnalysis(VCMsgData.msg.notVoiceOrder.voice ,"Y","Y");
                                            }
                                        } else {
                                            self.orderDecide(curPordInfo.cart_sn, dataCntFlag); // 주문확정 단계로 진행
                                        }
                                    }else{
                                        //자주구매
                                        self.orderDecide(curPordInfo.cart_sn, dataCntFlag); // 주문확정 단계로 진행
                                    }
                                }
                            } else { // 음성주문 불가
                                if (curPordInfo.m_sale_possible_yn != 'Y') { // 모바일 주문 불가 확인
                                    self.showMsg(VCMsgData.msg.notMobileOrder); // 주문 불가 Alert
                                    $scope.setVCAnalysis(VCMsgData.msg.notMobileOrder.voice ,"Y","Y");
                                } else {
                                    if (curPordInfo.cart_sn) { // 장바구니 번호가 있을때만 (일반주문서로)
                                        if (dataCntFlag) { // 수량 발화가 있었다면 수량 업데이트 이후 일반 주문서로
                                            goNormalOrderChangeCnt(curPordInfo);
                                        } else {
                                            self.showMsg(VCMsgData.msg.notVoiceOrder); // 주문 불가 Alert
                                            $scope.setVCAnalysis(VCMsgData.msg.notVoiceOrder.voice ,"Y","Y");
                                            VCPageMove.voiceUnableOrder(curPordInfo.cart_sn); // 일반 주문으로 이동
                                        }
                                    }else{
                                        self.showMsg(VCMsgData.msg.notVoiceOrder); // 주문 불가 Alert
                                        $scope.setVCAnalysis(VCMsgData.msg.notVoiceOrder.voice ,"Y","Y");
                                         VCPageMove.goPrdDetail(curPordInfo.goods_no); // 일반 상품상세 연결
                                    }
                                }
                            }
                        } else { // 상품리스트, 위시리스트에서 발화 시
                            if (curPordInfo.vic_ord_psb_yn == 'Y') { // 음성주문 가능
                                if (chkUserOrderInfo()) { // 로그인 여부, 결제, 배송지 세팅 유무 확인
                                    if (self.chkOpt()) { // 옵션 유무 확인
                                        self.showOpt('order'); // 옵션 보여주기
                                    } else {
                                        self.orderDecide(); // 주문확정 단계로 진행
                                    }
                                }
                            } else { // 음성주문 불가
                                self.showMsg(VCMsgData.msg.notVoiceOrder); // 주문 불가 Alert
                                $scope.setVCAnalysis(VCMsgData.msg.notVoiceOrder.voice ,"Y","Y");
                                VCPageMove.goPrdDetail(curPordInfo.goods_no); // 일반 상품상세 연결
                            }
                        }
                    } else if ($scope.pageUI.state == "prod_detail") { // 상품상세에서 발화 시
                        if (chkUserOrderInfo()) { // 로그인 여부, 결제, 배송지 세팅 유무 확인
                            self.orderDecide(); // 주문확정 단계로 진행 (상품상세에서는 옵션이 선택되어져 있어, 옵션 선택 없이 바로 주문확정 단계로 진행)
                        }
                    } else if ($scope.pageUI.state == "order") { // 주문확정에서 주문해줘 발화 시
                        if (chkUserOrderInfo()) { // 로그인 여부, 결제, 배송지 세팅 유무 확인
                            self.order(); // 결제 진행
                        }
                    }

                    // GA 태깅
                    if ($scope.checkListState($scope.pageUI.state)) {
                    	$scope.setGATag("유닛노출명령어", "주문해줘", sendTxt, iptType);
                    } else  if ($scope.pageUI.state == "prod_detail") {
                    	$scope.setGATag("상품상세노출명령어", "주문해줘", sendTxt, iptType);
                    }
                    break;
                case "actionDetail": // 현재 선택된 상품 자세히 보기
                    if ($scope.checkListState($scope.pageUI.state,["order_inquiry"]) ) { // 리스트 상태일때

                        var dataNum = data && data.commandNumber ? parseInt(data.commandNumber) - 1 : -1; // 번호 발화
                        
                        if (dataNum > -1 && $scope.pageUI.prdList.length > dataNum) { // 번호 발화가 정상적이라면
                            $scope.pageUI.curPrdSwiperIdx = dataNum;
                            $scope.prdSwiperCtrl.moveSpeedIndex(dataNum, 10); // 해당 상품 정보로 스와이프 위치 변경
                            curPordInfo = $scope.VCCtrl.getCurProdInfo(); // 현재 선택 상품 정보
                        }
                        self.getProdDetailInfo(); // 상품 상세 정보 가져오기 (해당 함수 안에 상품 자세히 보기 State 전환이 포함되어 있음, 음성 주문 가능 여부 체크도 있음)
                    } else if ($scope.pageUI.state == "prod_detail") { // 상품상세일때
                        // 상품 기술서 영역 포커싱
                        var targetPosY = angular.element("#prodDescription").offset().top - angular.element("header").outerHeight();
                        angular.element("html, body").stop().animate({scrollTop:targetPosY}, 300, 'swing');
                        $scope.setGATag("음성명령어", "자세히", sendTxt, iptType);
                    } else if($scope.pageUI.state =="order_inquiry"){//주문배송
                        if(data && data.commandNumber){
                            self.commandExec("getOrderDetailView",{commandNumber:data.commandNumber});
                        }else{
                            self.showMsg(VCMsgData.msg.purchaseDetailLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseDetailLike.voice ,"Y","Y");
                        }
                        $scope.setGATag("주문배송조회상세이동", "자세히", sendTxt, iptType);
                        $scope.setVCAnalysis("자세히" ,"Y","Y");
                    }else if($scope.pageUI.state =="event"){
                        if(data && data.commandNumber){
                            var items = $scope.pageUI.eventListInfo[data.commandNumber -1];
                            $scope.eventDetail("mic", items.linkUrl, items.isOutLink);
                        }
                        $scope.setGATag("이벤트", "자세히", sendTxt, iptType);
                    }else if($scope.pageUI.state =="purchase_gift"){
                        if(data && data.commandNumber){
                            var items = $scope.pageUI.saunListInfo[data.commandNumber -1];
                            $scope.saunDetail('mic', items.evtNo);
                        }
                        if($scope.pageUI.saunListInfoMyType != 'list'){
                        	$scope.setGATag("구매사은신청완료", "자세히", sendTxt, iptType, "purchase_gift_myList");
                        }else{
                        	$scope.setGATag("구매사은진행중", "자세히", sendTxt, iptType);
                        }
                    }else {
                    	$scope.setGATag("음성명령어", "자세히", sendTxt, iptType);
                    }
                    break;
                case "actionLPointDetail": //엘포인트 자세히
                case "actionLMoneyDetail": //엘머니 자세히
                case "actionDepositDetail": //보관금 자세히
                case "actionCloverDetail": //클로버 자세히
                    if($scope.pageUI.state =="point"){// 포인트 상세 페이지 연결
                    	//$scope.pointDetail(data.commandPoint)
                    	if(command == "actionLPointDetail"){//엘포인트 자세히
                    		$scope.setGATag("자세히", "엘포인트", sendTxt, iptType);
                    		$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=lt_point&tclick=m_mylayer_ltmoney";
                    	}else if(command == "actionLMoneyDetail"){//엘머니 자세히
                    		$scope.setGATag("자세히", "엘머니", sendTxt, iptType);
                    		$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam + "&point_div=l_point&tclick=m_mylayer_lmoney";
                    	}else if(command == "actionDepositDetail"){//보관금 자세히
                    		$scope.setGATag("자세히", "보관금", sendTxt, iptType);
                    		$window.location.href = LotteCommon.pointInfoUrl + "?" + $scope.baseParam +"&point_div=deposit&tclick=m_mylayer_deposit";
                    	}else if(command == "actionCloverDetail"){//클로버 자세히
                    		$scope.setGATag("자세히", "클로버", sendTxt, iptType);
                    		$window.location.href = LotteCommon.cloverUrl + "?" + $scope.baseParam + "&tclick=m_DC_clover_Clk_Btn_01";
                    	}
                    }
                    break;
                case "actionCancel": // 주문배송 상품 취소
                    if($scope.pageUI.state =="order_inquiry"){//주문배송
                        if(data && data.commandNumber){
                            if($scope.pageUI.purchaseList.length < data.commandNumber){
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                                $scope.setGATag("음성명령어", "취소해줘", sendTxt, iptType);
                                break;
                            }
                            var purchaseSelect = $scope.pageUI.purchaseList[data.commandNumber-1];
                            if(purchaseSelect.cancel_psb_yn !="Y"){
                                self.showMsg(VCMsgData.msg.purchaseSelectNone,["취소"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["취소"]).voice  ,"Y","Y");
                                $scope.setGATag("음성명령어", "취소해줘", sendTxt, iptType);
                                break;
                            }
                            //$scope.setGATag("음성명령어", data.commandNumber + "번 상품 취소", sendTxt, iptType);
                            $scope.setVCAnalysis("자세히" ,"Y","Y");
                            self.commandExec("getOrderDetailView",{commndOrdNo:purchaseSelect.ord_no});
                        }else{
                            self.showMsg(VCMsgData.msg.purchaseCancleLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseCancleLike.voice ,"Y","Y");
                        }
                    }
                    $scope.setGATag("음성명령어", "취소해줘", sendTxt, iptType);
                    break;
                case "actionAddWish": // 위시리스트 담기
                    if ($scope.checkListState($scope.pageUI.state,["wish"])) {

                        if($scope.pageUI.prdList.length < 1){
                            self.showMsg(VCMsgData.msg.unknown);
                            $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                            break;
                        }
                        var dataNum = data && data.commandNumber ? parseInt(data.commandNumber) - 1 : -1; // 번호 발화

                        /**
                         * 순번 발화 체크
                         */
                        if (dataNum > -1 && $scope.pageUI.prdList.length > dataNum) { // 번호 발화가 정상적이라면
                            $scope.pageUI.curPrdSwiperIdx = dataNum;
                            //console.log("번호발화 있음", dataNum);
                            $scope.prdSwiperCtrl.moveSpeedIndex(dataNum, 10); // 해당 상품 정보로 스와이프 위치 변경
                        }

                        var curPordInfo = self.getCurProdInfo(); // 현재 선택 상품 정보

                        if (curPordInfo.vic_ord_psb_yn == "Y") { // 음성 주문 가능 여부
                            if ($scope.loginInfo.isLogin) { // 로그인 체크
                                self.addWish();
                            } else { // 비로그인
                                addWishLoginFlag = true;
                                self.showMsg(VCMsgData.msg.needLoginYesNo); // 로그인 필요 메시지
                                $scope.setVCAnalysis(VCMsgData.msg.needLoginYesNo.voice ,"Y","Y");
                            }
                        } else { // 음성주문 불가
                            if ($scope.loginInfo.isLogin) { // 로그인 체크
                                if (curPordInfo.m_sale_possible_yn != "Y") { // 모바일 구매 불가
                                    self.showMsg(VCMsgData.msg.notMobileOrder); // 죄송해요 PC에서 구매해주세요
                                    $scope.setVCAnalysis(VCMsgData.msg.notMobileOrder.voice ,"Y","Y");
                                } else if (curPordInfo.limit_age_yn == "Y") { // 19금 상품 확인
                                    if ($scope.pageUI.state == "prod_list") { // 상품 리스트
                                        VCPageMove.goPrdDetail(curPordInfo.goods_no); // 일반 상품상세 연결
                                        $scope.setVCAnalysis(VCMsgData.msg.notVoiceWish.voice ,"Y","Y");
                                    } else if ($scope.pageUI.state == "cart") { // 장바구니 리스트
                                        self.addWish();
                                    }
                                } else if (curPordInfo.gfct_yn == "Y") { // 상품권 여부 확인
                                    if ($scope.loginInfo.isSimple) { // 간편회원 여부
                                        self.showMsg(VCMsgData.msg.notSimpleMemberCartWish); // 죄송해요 L.Point 통합회원만 구매 가능해요
                                        $scope.setVCAnalysis(VCMsgData.msg.notSimpleMemberCartWish.voice ,"Y","Y");
                                    } else {
                                        self.addWish();
                                    }
                                } else { // 모바일 구매 가능 / 19금 상품 아님
                                    self.addWish();
                                }
                            } else { // 비로그인
                                addWishLoginFlag = true;
                                self.showMsg(VCMsgData.msg.needLoginYesNo); // 로그인 필요 메시지
                                $scope.setVCAnalysis(VCMsgData.msg.needLoginYesNo.voice ,"Y","Y");
                            }
                        }
                    } else if ($scope.pageUI.state == "wish") { // 위시리스트 발화 시
                        if($scope.pageUI.prdList.length < 1){
                            self.showMsg(VCMsgData.msg.unknown);
                            $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                            break;
                        }
                        $scope.pageUI.alertType = "wish_duplicate";
                        self.showAlert();
                    	self.showMsg(VCMsgData.msg.alreadyWish); //위시리스트에서 위시리스트 담아줘
                    } else if ($scope.pageUI.state == "prod_detail") { // 상품상세에서 발화 시
                        if ($scope.loginInfo.isLogin) { // 로그인 체크
                            self.addWish();
                        } else { // 비로그인
                            addWishLoginFlag = true;
                            self.showMsg(VCMsgData.msg.needLoginYesNo); // 로그인 필요 메시지
                            $scope.setVCAnalysis(VCMsgData.msg.needLoginYesNo.voice ,"Y","Y");
                        }
                    }

                    $scope.setGATag("음성명령어", "위시리스트 담기", sendTxt, iptType);
                    break;
                case "actionAddCart": // 장바구니 담기
                    
                    if($scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }

                    var curPordInfo = self.getCurProdInfo(); // 현재 선택 상품 정보
                    var dataNum = data && data.commandNumber ? parseInt(data.commandNumber) - 1 : -1; // 번호 발화
                    var dataCnt = data && data.commandQuantity ? parseInt(data.commandQuantity) : 0; // 수량 발화
                    
                    /**
                     * 수량 발화 체크
                     */
                    var dataCntFlag = false; // 수량 변경 여부
                   
                    if (dataCnt >= 1 ) { // 수량 발화가 정상적이라면
                        dataCntFlag = true;
                        $scope.pageUI.orderInfo.orderCnt = dataCnt; // 발화 주문 수량 세팅
                    } else {
                        if ($scope.prodListQuantity > 0) {
                            $scope.pageUI.orderInfo.orderCnt = $scope.prodListQuantity;
                        }else{
                            $scope.pageUI.orderInfo.orderCnt = parseInt(curPordInfo.min_lmt_qty); // 주문 최소 수량 세팅    
                        }
                    }
                    
                    if($scope.pageUI.orderInfo.orderCnt < parseInt(curPordInfo.min_lmt_qty)){
                        self.showMsg(VCMsgData.msg.errMinLmtQty , [parseInt(curPordInfo.min_lmt_qty)]);
                        $scope.pageUI.orderInfo.orderCnt = parseInt(curPordInfo.min_lmt_qty); // 주문 최소 수량 세팅
                        break;
                    }else if($scope.pageUI.orderInfo.orderCnt > parseInt(curPordInfo.max_lmt_qty)){
                        self.showMsg(VCMsgData.msg.errMxnLmtQty , [parseInt(curPordInfo.max_lmt_qty)]);
                        $scope.pageUI.orderInfo.orderCnt = parseInt(curPordInfo.min_lmt_qty); // 주문 최소 수량 세팅
                        break;
                    }

                    if ($scope.checkListState($scope.pageUI.state,["cart"])) { // 상품리스트
                        /**
                         * 순번 발화 체크
                         */
                        if (dataNum > -1 && $scope.pageUI.prdList.length > dataNum) { // 번호 발화가 정상적이라면
                            $scope.pageUI.curPrdSwiperIdx = dataNum;
                            //console.log("번호발화 있음", dataNum);
                            $scope.prdSwiperCtrl.moveSpeedIndex(dataNum, 10); // 해당 상품 정보로 스와이프 위치 변경
                        }

                        if (curPordInfo.vic_ord_psb_yn == "Y") { // 음성 주문 가능 여부
                            self.addCart("default");
                        } else { // 음성주문 불가
                            if (curPordInfo.m_sale_possible_yn != "Y" || // 모바일 구매불가 확인
                            curPordInfo.smp_only_yn == "Y" || // 스마트픽 전용 여부
                            curPordInfo.rental_yn == "Y" || // 렌탈상품 여부
                            curPordInfo.limit_age_yn == "Y" || // 19금 상품 여부
                            curPordInfo.sale_promotion_yn == "Y" || // 기획전형 상품 여부
                            curPordInfo.input_option_yn == "Y" // 입력형/날짜형 상품 여부
                            ) {
                                self.showMsg(VCMsgData.msg.notVoiceCart);
                                $scope.setVCAnalysis(VCMsgData.msg.notVoiceCart.voice ,"Y","Y");
                                VCPageMove.goPrdDetail(curPordInfo.goods_no); // 일반 상품상세 연결
                            } else if (curPordInfo.gfct_yn == "Y") { // 상품권 여부
                                if ($scope.loginInfo.isLogin) { // 로그인 체크
                                    if ($scope.loginInfo.isSimple) { // 간편회원 여부
                                        self.showMsg(VCMsgData.msg.notSimpleMemberCartWish); // 죄송해요 L.Point 통합회원만 구매 가능해요
                                        $scope.setVCAnalysis(VCMsgData.msg.notSimpleMemberCartWish.voice ,"Y","Y");
                                    } else {
                                        self.addCart("default");
                                    }
                                } else {
                                    addCartLoginFlag = true;
                                    self.showMsg(VCMsgData.msg.needLoginYesNo); // 로그인 필요 메시지
                                    $scope.setVCAnalysis(VCMsgData.msg.needLoginYesNo.voice ,"Y","Y");
                                }
                            } else { // 그외 장바구니 담기 가능
                                self.addCart("default");
                            }
                        }
                    } else if ($scope.pageUI.state == "cart") { // 장바구니 리스트
                        $scope.pageUI.alertType = "cart_duplicate";
                        self.showAlert();
                    } else if ($scope.pageUI.state == "prod_detail") { // 상품상세
                        self.addCartProgress();                       
                    }
                    
                    // GA태깅
                    if ($scope.checkListState($scope.pageUI.state)) {
                    	$scope.setGATag("유닛노출명령어", "찜", sendTxt, iptType);
                    } else if($scope.pageUI.state == "prod_detail"){
                    	$scope.setGATag("상품상세노출명령어", "찜", sendTxt, iptType);
                    }
                    
                    break;
                case "actionShare": // 공유하기
                    if(!($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" ) || $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                    var dataNum = data && data.commandNumber ? parseInt(data.commandNumber) - 1 : -1; // 번호 발화
                        
                    if (dataNum > -1 && $scope.pageUI.prdList.length > dataNum) { // 번호 발화가 정상적이라면
                        if($scope.pageUI.state != "prod_detail"){
                            $scope.pageUI.curPrdSwiperIdx = dataNum;
                            $scope.prdSwiperCtrl.moveSpeedIndex(dataNum, 10); // 해당 상품 정보로 스와이프 위치 변경
                            curPordInfo = $scope.VCCtrl.getCurProdInfo(); // 현재 선택 상품 정보
                        }
                        
                    }
                    self.allHideLayer(); // 모든 레이어 닫기
                    $scope.pageUI.showShare = true;
                    
                    
                    if ($scope.checkListState($scope.pageUI.state)) {
                    		$scope.setGATag("유닛노출명령어", "공유", sendTxt, iptType);
                    } else if($scope.pageUI.state == "prod_detail"){
                    	if(iptType == "mic" || iptType == "keyboard"){
                			$scope.setGATag("음성명령어", "공유", sendTxt, iptType);
                		} else {
                			$scope.setGATag("공유레이어", "공유", sendTxt, iptType);
                		} 
                    }
                    
                    break;
                // 특정 SNS매체로 공유하기
                case "actionShareKakao":
                    if(!($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" ) || $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                	VDShareApp.sendAppShare(self.shareDataSet(),'kakaotalk');                	
                	if(iptType == "click"){
                        $scope.setGATag("공유레이어", "카카오톡", sendTxt, iptType);
                        $scope.setVCAnalysis("카카오톡");
                	}else{
                		$scope.setGATag("SNS공유함께발화", "카카오톡", sendTxt, iptType);
                	}
                    break;
                case "actionShareKaKaoStory":
                    if(!($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" ) || $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                    VDShareApp.sendAppShare(self.shareDataSet(),'kakaostory');
                	if(iptType == "click"){
                        $scope.setGATag("공유레이어", "카카오스토리", sendTxt, iptType);
                        $scope.setVCAnalysis("카카오스토리");
                	}else{
                		$scope.setGATag("SNS공유함께발화", "카카오스토리", sendTxt, iptType);
                	}
                    break;
                case "actionShareTwitter": 
                    if(!($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" ) || $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                    VDShareApp.sendAppShare(self.shareDataSet(),'twitter');
                	if(iptType == "click"){
                        $scope.setGATag("공유레이어", "트위터", sendTxt, iptType);
                        $scope.setVCAnalysis("트위터");
                	}else{
                		$scope.setGATag("SNS공유함께발화", "트위터", sendTxt, iptType);
                	}
                    break;
                case "actionShareSMS":
                    if(!($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" ) || $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                    VDShareApp.sendAppShare(self.shareDataSet(),'sms');
                	if(iptType == "click"){
                        $scope.setGATag("공유레이어", "문자", sendTxt, iptType);
                        $scope.setVCAnalysis("문자");
                	}else{
                		$scope.setGATag("SNS공유함께발화", "문자", sendTxt, iptType);
                	}
                    break;
                case "actionShareFacebook":
                    if(!($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" ) || $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                    VDShareApp.sendAppShare(self.shareDataSet(),'facebook');
                	if(iptType == "click"){
                        $scope.setGATag("공유레이어", "페이스북", sendTxt, iptType);
                        $scope.setVCAnalysis("페이스북");
                	}else{
                		$scope.setGATag("SNS공유함께발화", "페이스북", sendTxt, iptType);
                	}
                    break;
                case "actionShareURL": 
                    if(!($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" ) || $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                    VDShareApp.sendAppShare(self.shareDataSet(),'url_copy_voice');
                    $scope.pageUI.alertType = "copy";
                    self.showAlert();
                	if(iptType == "click"){
                        $scope.setGATag("공유레이어", "url복사", sendTxt, iptType);
                        $scope.setVCAnalysis("url복사");
                	}else{
                		$scope.setGATag("SNS공유함께발화", "url복사", sendTxt, iptType);
                    }
                    break;
                case "actionProdImg": // 상품이미지 보기
                    if(!($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" ) || $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }

                    self.allHideLayer(); // 모든 레이어 닫기

                    var curPrdInfo = self.getCurProdInfo();

                    $scope.pageLoading = true; // 로딩바

                    VCGetPrdDetailInfo.getProdImgInfo(curPrdInfo.goods_no)
                    .then(function (imgList) {
                        if (imgList && imgList.length > 0) {
                            $scope.pageUI.prodImgInfo = imgList;
                            $scope.pageUI.showPrdImgDetail = true;
                            angular.element(".img_layer_wrap .pop_layer .img_area").scrollTop(0);
                            
                        } else { // 이미지 리스트 없을 때
                            console.error("상품이미지 정보 없음");
                        }
                    })
                    .catch(function () {
                        console.error("상품 이미지 정보 로드 오류");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    
                    $scope.setGATag("음성명령어", "상품이미지보여줘", sendTxt, iptType);
                    break;
                case "actionProdComment":  // 상품평 보기
                    if(!($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" ) || $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                    if ($scope.checkListState($scope.pageUI.state) ||
                    $scope.pageUI.state == "prod_detail" ) {
                        // 상품평 정보 가져오기

                        var curPrdInfo = self.getCurProdInfo();

                        if($scope.checkListState($scope.pageUI.state) ){
                            var dataNum = data && data.commandNumber ? parseInt(data.commandNumber) - 1 : -1; // 번호 발화
                        
                            if (dataNum > -1 && $scope.pageUI.prdList.length > dataNum) { // 번호 발화가 정상적이라면
                                $scope.pageUI.curPrdSwiperIdx = dataNum;
                                $scope.prdSwiperCtrl.moveSpeedIndex(dataNum, 100); // 해당 상품 정보로 스와이프 위치 변경
                                curPrdInfo = self.getCurProdInfo(); // 현재 선택 상품 정보
                            }
                        }
                        
                        if (curPrdInfo && curPrdInfo.goods_no) { // 상품번호가 있을 경우만 처리
                            if (curPrdInfo.pmg_gdas_cnt > 0) { // 상품평 유무 확인
                                $scope.pageUI.prodCommentPageIndex = 1; // 상품평 페이지 인덱스 초기화

                                $scope.pageLoading = true; // 로딩바

                                VCGetProdComment.getProdComment(curPrdInfo.goods_no, $scope.pageUI.prodCommentPageIndex)
                                .then(function (prodComment) {
                                    $scope.pageUI.prodComment = prodComment;
                                    self.allHideLayer(); // 모든 레이어 닫기
                                    $scope.pageUI.starScoreOpen = true; // 전체상품평 펼치기
                                    $scope.pageUI.customerSatisOpen = true; // 고객만족도 펼치기
                                    $scope.pageUI.showPrdComment = true;
                                    self.showMsg(VCMsgData.msg.prdComment);
                                })
                                .catch(function () {
                                    console.error("상품평 정보 없음.");
                                    self.showMsg(VCMsgData.msg.notPrdComment);
                                    $scope.setVCAnalysis(VCMsgData.msg.notPrdComment.voice ,"Y","Y");
                                })
                                .finally(function () {
                                    $scope.pageLoading = false; // 로딩바
                                });
                            } else { // 상품평 없는 경우
                                self.showMsg(VCMsgData.msg.notPrdComment);
                                $scope.setVCAnalysis(VCMsgData.msg.notPrdComment.voice ,"Y","Y");
                            }
                        }
                    }
                    $scope.setGATag("음성명령어", "상품평 보여줘", sendTxt, iptType);
                    break;
                case "actionProdOptShow": // 상품 옵션 보기
                    if ($scope.checkListState($scope.pageUI.state) ||
                    $scope.pageUI.state == "prod_detail") {

                        if($scope.checkListState($scope.pageUI.state) ){
                            var dataNum = data && data.commandNumber ? parseInt(data.commandNumber) - 1 : -1; // 번호 발화
                            var curPordInfo;
                            if (dataNum > -1 && $scope.pageUI.prdList.length > dataNum) { // 번호 발화가 정상적이라면
                                $scope.pageUI.curPrdSwiperIdx = dataNum;
                                $scope.prdSwiperCtrl.moveSpeedIndex(dataNum, 10); // 해당 상품 정보로 스와이프 위치 변경
                                curPordInfo = $scope.VCCtrl.getCurProdInfo(); // 현재 선택 상품 정보
                            }
                        }

                        if (self.chkOpt()) { // 옵션이 있다면
                            self.showOpt(); // 옵션 보여주기
                            // $scope.setGATag("옵션레이어", "옵션선택", sendTxt, iptType);
                        } else { // 옵션 없음
                            if($scope.pageUI.prdList.length < 1){
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                            }else{
                                self.showMsg(VCMsgData.msg.notPrdOption);
                                $scope.setVCAnalysis(VCMsgData.msg.notPrdOption.voice ,"Y","Y");
                            }
                        }
                        $scope.setGATag("음성명령어", "옵션 보여줘", sendTxt, iptType);
                    }
                    // $scope.setGATag("음성명령어", "옵션 보여줘", sendTxt, iptType);
                    break;
                case "actionProdOptChange":  // 옵션 변경해줘 처리
                    if ($scope.pageUI.state == "prod_detail") {
                        if (self.chkOpt()) { // 옵션이 있다면
                            self.showOpt(); // 옵션 보여주기
                            $scope.setGATag("상품상세노출명령어", "옵션 변경해줘", sendTxt, iptType);
                        } else { // 옵션 없음
                            self.showMsg(VCMsgData.msg.notPrdOption);
                            $scope.setVCAnalysis(VCMsgData.msg.notPrdOption.voice ,"Y","Y");
                        }
                    } else if ($scope.checkListState($scope.pageUI.state,["cart","purchase_frequently"])) { // 상품상세가 아니라면 보여드릴까요? 발화 후 Y/N 받음
                        if (self.chkOpt()) { // 옵션이 있다면
                            optChangeYNDelayFlag = true;
                            self.showMsg(VCMsgData.msg.prdOptShow);
                            $scope.setVCAnalysis(VCMsgData.msg.prdOptShow.voice ,"Y","Y");
                        } else { // 옵션 없음
                            if($scope.pageUI.prdList.length < 1){
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                            }else{
                                self.showMsg(VCMsgData.msg.notPrdOption);
                                $scope.setVCAnalysis(VCMsgData.msg.notPrdOption.voice ,"Y","Y");
                            }
                        }
                        $scope.setGATag("음성명령어", "옵션 변경해줘", sendTxt, iptType);
                    } else if ($scope.pageUI.state == "cart" || $scope.pageUI.state == "purchase_frequently") {
                        if (self.chkOpt()) { // 옵션이 있다면
                            self.showOpt(); // 옵션 보여주기
                        } else { // 옵션 없음
                            if($scope.pageUI.prdList.length < 1){
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                            }else{
                                self.showMsg(VCMsgData.msg.notPrdOption);
                                $scope.setVCAnalysis(VCMsgData.msg.notPrdOption.voice ,"Y","Y");
                            }
                        }
                        $scope.setGATag("음성명령어", "옵션 변경해줘", sendTxt, iptType);
                    }else if ($scope.pageUI.state == "order") {
                        if (self.chkOpt()) { // 옵션이 있다면
                            self.showOpt("order"); // 옵션 보여주기
                        } else { // 옵션 없음
                            self.showMsg(VCMsgData.msg.notPrdOption);
                            $scope.setVCAnalysis(VCMsgData.msg.notPrdOption.voice ,"Y","Y");
                        }
                        $scope.setGATag("음성명령어", "옵션 변경해줘", sendTxt, iptType);
                    }else if ($scope.pageUI.state == "home") {
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        $scope.setGATag("음성명령어", "옵션 변경해줘", sendTxt, iptType);
                    }else if ($scope.pageUI.state == "order_inquiry") {
                        if(data && data.commandNumber){
                            var checkNum = data.commandNumber;
                        
                            if($scope.pageUI.purchaseList.length >= checkNum ){
                                checkNum = checkNum -1;
                                if($scope.pageUI.purchaseList[checkNum].opt_change_psb_yn == "Y"){//옵션 변경 가능 확인
                                    $scope.orderDetail($scope.pageUI.purchaseList[checkNum].ord_no)
                                }else{
                                    //옵션 변경 불가능
                                    self.showMsg(VCMsgData.msg.purchaseSelectNone , ["옵션 변경"]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["옵션 변경"]).voice ,"Y","Y" );
                                    
                                }
                            }else if($scope.pageUI.purchaseList.length < checkNum){
                                //취소 가능한 번호가 없음
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                            }
                        }else{
                            self.showMsg(VCMsgData.msg.purchaseOptionLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseOptionLike.voice ,"Y","Y");
                        }
                    }
                    break;
                case "actionYesNo": // 옵션 변경해줘 이후 긍정/부정 발화에 대한 처리
                    
                    if(!yesNoFlag){
                        break;
                    }
                    var isCommandYes = data ? (data.commandVal + "").toUpperCase() == "Y" : false; // 긍정/부정에 따른 true / false
                    
                    if (($scope.checkListState($scope.pageUI.state,["cart"]) || $scope.pageUI.state == "prod_detail") && isCommandYes && optChangeYNDelayFlag) {
                        optChangeYNDelayFlag = false;
                        if (self.chkOpt()) { // 옵션이 있다면
                            self.showOpt(); // 옵션 보여주기
                        } else { // 옵션 없음
                            self.showMsg(VCMsgData.msg.notPrdOption);
                        }
                    } else if ($scope.pageUI.state == "cart" && isCommandYes && optChangeYNDelayFlag) {
                        optChangeYNDelayFlag = false;
                        var curPrdInfo = self.getCurProdInfo();

                        if (curPrdInfo.limit_age_yn == "Y" || // 19금 상품
                        curPrdInfo.input_option_yn == "Y" || // 입력형 옵션
                        curPrdInfo.smpick_yn == "Y") { // 스마트픽 주문서
                            self.showMsg(VCMsgData.msg.notVoiceCart);
                            $scope.setVCAnalysis(VCMsgData.msg.notVoiceCart.voice ,"Y","Y");
                            VCPageMove.goPrdDetail(curPrdInfo.goods_no); // 상품상세로 연결
                    	} else if (curPrdInfo.gfct_yn == "Y") { // 상품권 여부
                    		self.showMsg(VCMsgData.msg.notSimpleMemberCartWish);
                    		$scope.setVCAnalysis(VCMsgData.msg.notSimpleMemberCartWish.voice ,"Y","Y");
                    	} else {
                            self.showOpt(); // 옵션 보여주기
                    	}
                    } else if (($scope.checkListState($scope.pageUI.state,["wish"]) || $scope.pageUI.state == "prod_detail") && isCommandYes && addWishLoginFlag) { // 위시 담아줘 발화 Flag
                        addWishLoginFlag = false;
                        self.needLoginCommand("actionAddWish");
                    } else if (($scope.checkListState($scope.pageUI.state,["cart"])) && isCommandYes && addCartLoginFlag) { // 장바구니 담아줘 발화 Flag
                        addCartLoginFlag = false;
                        self.needLoginCommand("actionAddCart");
                    } else if ($scope.pageUI.state == "order" && isCommandYes == true) { // 주문확정에서 "응"이라고 발화 시
                    	$scope.setGATag("샬롯질의", "주문동의", sendTxt, iptType);
                    	$scope.setVCAnalysis("주문동의");
                        self.order();
                    } else if ($scope.pageUI.state == "order" && isCommandYes == false) { // 주문확정에서 "아니"이라고 발화 시
                    	$scope.setGATag("샬롯질의", "주문동의거부", sendTxt, iptType);
                    	$scope.setVCAnalysis("주문동의거부");
                    } else if ($scope.pageUI.state == "coupon" && isCommandYes == true) { // 쿠폰에서 "응"이라고 발화 시
                    	$scope.setGATag("샬롯질의", "쿠폰동의", sendTxt, iptType);
                        VCPageMove.go("goMembership" ,$scope.loginInfo.isLogin);
                    } else if ($scope.pageUI.state == "coupon" && isCommandYes == false) { // 쿠폰에서 "아니"이라고 발화 시
                    	$scope.setGATag("샬롯질의", "쿠폰거부", sendTxt, iptType);
                    } else if ($scope.pageUI.state == "point" && isCommandYes == true) { // 포인트&클로버에서 "응"이라고 발화 시
                    	$scope.setGATag("샬롯질의", "클로버동의", sendTxt, iptType);
                    	VCPageMove.go("goDirectAttend");
                    } else if ($scope.pageUI.state == "point" && isCommandYes == false) { // 포인트&클로버에서 "아니"이라고 발화 시
                    	$scope.setGATag("샬롯질의", "클로버거부", sendTxt, iptType);
                    } else if ($scope.pageUI.state == "customer_center" && $scope.pageUI.centerKind == "customer" && isCommandYes == true){ //고객센터에서 "응"이리고 발화 시
                    	if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                            self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        }
                    	$scope.setGATag("샬롯질의", "1:1문의이동동의", sendTxt, iptType, "customer_center_fail");
                    	VCPageMove.go("goCenterQue",$scope.loginInfo.isLogin);
                    } else if ($scope.pageUI.state == "customer_center" && $scope.pageUI.centerKind == "customer" && isCommandYes == false){ //고객센터에서 "아니"이리고 발화 시
                    	self.showMsg(VCMsgData.msg.centerUseQna);
                    	$scope.setGATag("샬롯질의", "1:1문의이동거부", sendTxt, iptType, "customer_center_fail");
                    }else if ($scope.pageUI.state == "customer_center" && $scope.pageUI.centerKind == "talk" && isCommandYes == true){ //톡상담에서 "응"이리고 발화 시
                    	if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                            self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        }
                    	$scope.setGATag("샬롯질의", "톡상담이동동의", sendTxt, iptType, "customer_center_fail");
                    	VCPageMove.go("goTalkAdvice",$scope.loginInfo.isLogin);
                    } else if ($scope.pageUI.state == "customer_center" && $scope.pageUI.centerKind == "talk" && isCommandYes == false){ //톡상담에서 "아니"이리고 발화 시
                    	self.showMsg(VCMsgData.msg.centerTalkQna);
                    	$scope.setGATag("샬롯질의", "톡상담이동거부", sendTxt, iptType, "customer_center_fail");
                    } else if ($scope.pageUI.state == "customer_center" && $scope.pageUI.centerKind == "call" && isCommandYes == true){ //전화연결에서 "응"이리고 발화 시
                    	if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
                            self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
                        }
                    	$scope.setGATag("샬롯질의", "1문의이동동의", sendTxt, iptType);
                    	VCPageMove.go("goCenterQue",$scope.loginInfo.isLogin, "customer_center_fail");
                    } else if ($scope.pageUI.state == "customer_center" && $scope.pageUI.centerKind == "call" && isCommandYes == false){ //전화연결에서 "아니"이리고 발화 시
                    	self.showMsg(VCMsgData.msg.centerUseQna);
                    	$scope.setGATag("샬롯질의", "1:1문의이동거부", sendTxt, iptType, "customer_center_fail");
                    }else if ($scope.pageUI.state == "order_complete" && isCommandYes == true) { // 주문완료에서 "응"이라고 발화 시
                    	$scope.setGATag("샬롯질의", "구매사은신청동의", sendTxt, iptType);
                        VCPageMove.goSaunDetail($scope.pageUI.orderCompleteInfo.saun_info.evt_saun_no);
                    }else if ($scope.pageUI.state == "order_complete" && isCommandYes == false) { // 주문완료에서 "아니"이라고 발화 시
                        $scope.setGATag("샬롯질의", "구매사은신청거부", sendTxt, iptType);
                    }else if ($scope.pageUI.state =="order_inquiry" && isCommandYes == true) { // 주문배송내역에서 "응"이라고 발화 시
                        VCPageMove.go("goPurchaseList",$scope.loginInfo.isLogin);
                    }else if($scope.pageUI.state == "mimitoutou_recommendation" && isCommandYes == true && mimiNoRegistQ){ //미미뚜뚜에서 "응"이라고 발화 시
                        mimiNoRegistQ = false;
                    	self.commandExec("goMimitoutou",$scope.loginInfo.isLogin);
                    }else if($scope.pageUI.state == "style_recommendation" && isCommandYes == true && $scope.styleOtherQue){ //스타일추천에서 "응"이라고 발화 시
                        $scope.styleOtherQue = false;
                    	$scope.setGATag("샬롯질의", "이동동의", sendTxt, iptType);
                        $scope.goStyleMore();
                    }else if($scope.pageUI.state == "style_recommendation" && isCommandYes == false){ //스타일추천에서 "아니"이라고 발화 시
                    	$scope.setGATag("샬롯질의", "이동거부", sendTxt, iptType);
                    }else if($scope.pageUI.state == "chulcheck"){
                    	// 출석체크 클로버 교환하기
                    	$scope.gotoDirectAttend("voice", isCommandYes, sendTxt, iptType);
                    }
                    break;
                case "actionNumber": // 화면 상태별 숫자 발화에 대한 처리
                    if ($scope.checkListState($scope.pageUI.state) || $scope.pageUI.state == "prod_detail" || $scope.pageUI.state == "order") {
                        var dataNum = data && data.commandNumber ? parseInt(data.commandNumber) - 1 : -1; // 번호 발화

                        if (dataNum > -1) {
                            if ($scope.pageUI.showPrdOpt) { // 옵션 레이어가 켜져 있는 상태인지 확인 (옵션선택)
                                var optItem = $filter('filter')($scope.pageUI.optInfo.prdOptInfo[$scope.pageUI.optInfo.curOptStep].itemList.items, {isSoldout: false});

                                if (optItem.length > dataNum) { // 옵션 개수 판단
                                    $scope.selectOptItem(optItem[dataNum].idx, true);
                                    
                                    if(iptType == "voice"){
                                        $scope.setGATag("옵션레이어", "옵션선택", sendTxt, iptType);
                                    } else if(iptType == "keyboard"){
                                        $scope.setGATag("옵션레이어", "옵션선택", sendTxt, iptType);
                                    }
                                    
                                } else {
                                    // TO-DO : 옵션 개수 이상이라면
                                	self.showMsg(VCMsgData.msg.unknown);
                                	$scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                                }
                                
                            } else { // 상품 순번 선택
                                // 현재 상품의 리스트 개수안에 들어가는 숫자인지 판단
                                if ($scope.prdSwiperCtrl && $scope.pageUI.prdList.length > dataNum) { // 스와이프 컨트롤러가 존재 한다면
                                    $scope.pageUI.curPrdSwiperIdx  = dataNum;
                                    $scope.prdSwiperCtrl.moveIndex(dataNum);
                                }
                            }
                        }
                    } else { // 기타 페이지에서 숫자 발화 시
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                    }
                    break;
                
                // 질의에 대한 command 처리 (State 제한 - 상품 리스트)
                case "answerDeliveryFee":
                case "answerDeliveryTime":
                    if($scope.checkListState($scope.pageUI.state) && $scope.pageUI.prdList.length < 1){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }

                    if ($scope.checkListState($scope.pageUI.state) ||
                    $scope.pageUI.state == "prod_detail" ) {
                        var curPordInfo = self.getCurProdInfo();

                        if (curPordInfo && curPordInfo.goods_no) {
                            $scope.pageLoading = true; // 로딩바

                            VCDeliveryInfo.getDeliveryInfo({
                                goods_no: curPordInfo.goods_no
                            })
                            .then(function (data) { // 배송정보 확인 성공
                                /**
                                 * data.dlvFee: 배송비 (0인 경우 무료배송)
                                 * data.stdAmt: 무료배송 조건금액
                                 * data.dlvDate: 배송예정일자
                                 * data.dlvYoil: 배송예정요일
                                 * data.dlvDesc: 배송문구
                                 * data.gubunCd : 명절 구분 값 99 면 명절
                                 */
                                if (command == "answerDeliveryFee") { // 배송비 확인
                                    if (parseInt(data.dlvFee) == 0) { // 무료 배송
                                        self.showMsg(VCMsgData.msg.prdDeliveryFree);
                                        $scope.setVCAnalysis(VCMsgData.msg.prdDeliveryFree.voice ,"Y","Y");
                                    } else {
                                        self.showMsg(VCMsgData.msg.prdDeliveryCharge, [data.dlvFee,data.stdAmt]);
                                        $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.prdDeliveryCharge, [data.dlvFee,data.stdAmt]).voice ,"Y","Y" );
                                    }
                                    $scope.setGATag("음성명령어", "배송비 얼마야", sendTxt, iptType);
                                } else { // 배송기간 확인 (월/일)
                                    var prdDeliveryArr;
                                    var showTxt;
                                    var showVoice;
                                    var showPosition;
                                    
                                    if (data.gubunCd == "99") { // 명절
                                            self.showMsg(VCMsgData.msg.prdDeliveryHolidayDate); // 명절 케이스
                                            $scope.setVCAnalysis(VCMsgData.msg.prdDeliveryHolidayDate.voice ,"Y","Y");
                                    }else if(data.gubunCd == "1"){ // 스마트픽전용상품
                                        if($scope.pageUI.state == "cart" && curPordInfo.smpick_yn == "Y"){ // 스마트픽인경우
                                            self.showMsg(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]);
                                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]).voice ,"Y","Y" );
                                        }else{
                                            self.showMsg(VCMsgData.msg.prdDeliveryDateSmart, [data.smp_dlv_area]);
                                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.prdDeliveryDateSmart, [data.smp_dlv_area]).voice ,"Y","Y" );
                                        }
                                    }else if(data.gubunCd == "2"){ // 예약상품
                                        if($scope.pageUI.state == "cart" && curPordInfo.smpick_yn == "Y"){ // 스마트픽인경우
                                            self.showMsg(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]);
                                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]).voice ,"Y","Y" );
                                        }else{
                                            showTxt = $filter('replaceString')(VCMsgData.msg.prdDeliveryDateRese.txt , [data.dlvDate2,data.dlvDesc]);
                                            showVoice = $filter('replaceString')(VCMsgData.msg.prdDeliveryDateRese.voice, [data.dlvDate,data.dlvDesc]);
                                            showPosition = VCMsgData.msg.prdDeliveryDateRese.position;
                                            self.showMsg(VCMsgData.getMsgData(showTxt,showVoice,showPosition));
                                            $scope.setVCAnalysis(showVoice ,"Y","Y");
                                            //self.showMsg(VCMsgData.msg.prdDeliveryDateRese, [data.dlvDate,data.dlvDesc]);
                                        }
                                    }else if(data.gubunCd == "3"){ // 설치상품
                                        if($scope.pageUI.state == "cart" && curPordInfo.smpick_yn == "Y"){ // 스마트픽인경우
                                            self.showMsg(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]);
                                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]).voice ,"Y","Y" );
                                        }else{
                                            showTxt = $filter('replaceString')(VCMsgData.msg.prdDeliveryDateSet.txt , [data.dlvDate2]);
                                            showVoice = $filter('replaceString')(VCMsgData.msg.prdDeliveryDateSet.voice, [data.dlvDate]);
                                            showPosition = VCMsgData.msg.prdDeliveryDateSet.position;
                                            self.showMsg(VCMsgData.getMsgData(showTxt,showVoice,showPosition));
                                            $scope.setVCAnalysis(showVoice ,"Y","Y");
                                            //self.showMsg(VCMsgData.msg.prdDeliveryDateSet, [data.dlvDate]);
                                        }
                                    }else if(data.gubunCd == "4"){ // 렌탈상품
                                        showTxt = $filter('replaceString')(VCMsgData.msg.prdDeliveryDateRental.txt , [data.dlvDate2]);
                                        showVoice = $filter('replaceString')(VCMsgData.msg.prdDeliveryDateRental.voice, [data.dlvDate]);
                                        showPosition = VCMsgData.msg.prdDeliveryDateRental.position;
                                        self.showMsg(VCMsgData.getMsgData(showTxt,showVoice,showPosition));
                                        $scope.setVCAnalysis( showVoice ,"Y","Y");
                                        //self.showMsg(VCMsgData.msg.prdDeliveryDateRental, [data.dlvDate]);
                                    }else if(data.gubunCd == "5" ){ // 도서
                                        showTxt = $filter('replaceString')(VCMsgData.msg.prdDeliveryDate.txt , [data.dlvDate2,data.dlvDesc]);
                                        showVoice = $filter('replaceString')(VCMsgData.msg.prdDeliveryDate.voice, [data.dlvDate,data.dlvDesc]);
                                        showPosition = VCMsgData.msg.prdDeliveryDate.position;
                                        self.showMsg(VCMsgData.getMsgData(showTxt,showVoice,showPosition));
                                        $scope.setVCAnalysis(showVoice ,"Y","Y");
                                        //self.showMsg(VCMsgData.msg.prdDeliveryDate, [data.dlvDate,data.dlvDesc]);
                                    }else if(data.gubunCd == "6" || data.gubunCd == "7" || data.gubunCd == "8" ){ // 주문제작상품,해외직수입,주문후발주상품
                                        if($scope.pageUI.state == "cart" && curPordInfo.smpick_yn == "Y"){ // 스마트픽인경우
                                            self.showMsg(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]);
                                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]).voice ,"Y","Y" );
                                        }else{
                                            showTxt = $filter('replaceString')(VCMsgData.msg.prdDeliveryDate.txt , [data.dlvDate2,data.dlvDesc]);
                                            showVoice = $filter('replaceString')(VCMsgData.msg.prdDeliveryDate.voice, [data.dlvDate,data.dlvDesc]);
                                            showPosition = VCMsgData.msg.prdDeliveryDate.position;
                                            self.showMsg(VCMsgData.getMsgData(showTxt,showVoice,showPosition));
                                            $scope.setVCAnalysis(showVoice ,"Y","Y");
                                            //self.showMsg(VCMsgData.msg.prdDeliveryDate, [data.dlvDate,data.dlvDesc]);
                                        }
                                    }else if(data.gubunCd == "9"){ // E쿠폰상품
                                        if($scope.pageUI.state == "cart" && curPordInfo.smpick_yn == "Y"){ // 스마트픽인경우
                                            self.showMsg(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]);
                                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]).voice ,"Y","Y" );
                                        }else{
                                            showTxt = $filter('replaceString')(VCMsgData.msg.prdDeliveryDateCou.txt , [data.dlvDate2]);
                                            showVoice = $filter('replaceString')(VCMsgData.msg.prdDeliveryDateCou.voice, [data.dlvDate]);
                                            showPosition = VCMsgData.msg.prdDeliveryDateCou.position;
                                            self.showMsg(VCMsgData.getMsgData(showTxt,showVoice,showPosition));
                                            $scope.setVCAnalysis(showVoice ,"Y","Y");
                                            //self.showMsg(VCMsgData.msg.prdDeliveryDateCou, [data.dlvDate]);
                                        }
                                    }else if(data.gubunCd == "10"){ // 일반상품
                                        if($scope.pageUI.state == "cart" && curPordInfo.smpick_yn == "Y"){ // 스마트픽인경우
                                            self.showMsg(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]);
                                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.prdDeliveryDateSmart, [curPordInfo.smp_dlv_area]).voice ,"Y","Y" );
                                        }else{
                                            showTxt = $filter('replaceString')(VCMsgData.msg.prdDeliveryDate.txt , [data.dlvDate2,data.dlvDesc]);
                                            showVoice = $filter('replaceString')(VCMsgData.msg.prdDeliveryDate.voice, [data.dlvDate,data.dlvDesc]);
                                            showPosition = VCMsgData.msg.prdDeliveryDate.position;
                                            self.showMsg(VCMsgData.getMsgData(showTxt,showVoice,showPosition));
                                            $scope.setVCAnalysis(showVoice ,"Y","Y");
                                            //self.showMsg(VCMsgData.msg.prdDeliveryDate, [data.dlvDate,data.dlvDesc]);
                                        }
                                    } else {
                                        showTxt = $filter('replaceString')(VCMsgData.msg.prdDeliveryDate.txt , [data.dlvDate2]);
                                        showVoice = $filter('replaceString')(VCMsgData.msg.prdDeliveryDate.voice, [data.dlvDate]);
                                        showPosition = VCMsgData.msg.prdDeliveryDate.position;
                                        self.showMsg(VCMsgData.getMsgData(showTxt,showVoice,showPosition));
                                        $scope.setVCAnalysis(showVoice ,"Y","Y");
                                        //self.showMsg(VCMsgData.msg.prdDeliveryDate, [data.dlvDate]);
                                    }
                                    //$scope.setGATag("음성명령어", "언제와", sendTxt, iptType);
                                }
                            })
                            .catch(function () { // 배송정보 확인 실패
                                console.error("배송정보 확인 오류");
                            })
                            .finally(function () {
                                $scope.pageLoading = false; // 로딩바
                            });
                        } else {
                            console.error("상품정보 오류");
                        }
                    }
                    break;
                case "getRecommendMy": //마이추천
                	$scope.setGATag("공통_마이추천보기", "마이추천보기", sendTxt, iptType);
                    var sendData = {
                        goodsNoList : "",
                        searchType:"G"
                    };
                    var params = {};
                    var lately = VCLocalLate.getLateList();

                    if(!lately){
                        sendData.searchType = "M";
                        self.commandExec("getRecommendMyReceive" ,sendData);
                        break
                    }

                    params.iids = (lately + "").trim();

                    $scope.pageLoading = true; // 로딩바
                
                    VCMyRecommend.getMyRecommendList(params)
                    .then(function (recobellData) {
                        if (recobellData && recobellData.length > 0) {
                            angular.forEach(recobellData , function(value , key){
                                sendData.goodsNoList += value.itemId + ",";
                            });
                            sendData.goodsNoList = sendData.goodsNoList.slice(0,sendData.goodsNoList.length-1);
                            self.commandExec("getRecommendMyReceive" ,sendData);
                        } else {
                            sendData.searchType = "M";
                            self.commandExec("getRecommendMyReceive" ,sendData);
                            //console.error("마이추천 없음");
                        }
                    })
                    .catch(function () {
                        sendData.searchType = "M";
                        self.commandExec("getRecommendMyReceive" ,sendData);
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    
                    break;
                case "getOtherHaveSeen": //남들은뭘봣지
                    
                    if(!$scope.checkListState($scope.pageUI.state) || !self.getCurProdInfo()){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }

                    var sendData = {
                        goodsNoList : "",
                    };
                    var curPordInfo = self.getCurProdInfo(); // 현재 선택 상품 정보
                    var params = {};
                    params.iids = curPordInfo.goods_no;

                    $scope.pageLoading = true; // 로딩바
                    VCOthersHaveSee.getOthersHaveList(params)
                    .then(function (seenData) {
                        if (seenData && seenData.length > 0) {
                            angular.forEach(seenData , function(value , key){
                                sendData.goodsNoList += value.itemId + ",";
                            });
                            sendData.goodsNoList = sendData.goodsNoList.slice(0,sendData.goodsNoList.length-1);
                            self.commandExec("getOthersHaveSeenReceive" ,sendData);
                        } else {
                        	$scope.pageUI.prdList = [];
                            self.changeState("other_customers_item_recommendation");
                            self.showMsg(VCMsgData.msg.othersHaveNone);
                            $scope.setVCAnalysis(VCMsgData.msg.othersHaveNone.voice ,"Y","Y");
                            //console.error("남들은뭘봣지 없음");
                        }
                    })
                    .catch(function () {
                        console.error("남들은뭘봣지 확인 오류");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    
                    break;
                case "getSituationKeyword": //상황추천
                case "getManagementItem": //관리아이템
                case "getSecretEvent": //비밀이벤트
                case "getCart": // 장바구니 리스트에 대한 데이터 처리
                case "getDiscountedShoppingCartProduct": //할인중인장바구니
                case "getWish": // 위시리스트에 대한 데이터 처리
                case "getOftenList": // 자주구매상품에 대한 데이터 처리
                case "getLately": // 최근본상품에 대한 데이터 처리
                case "getMimitoutou": // 미미뚜뚜에 대한 데이터 처리
                case "getRecom": // 상품추천에 대한 데이터 처리
                case "getNewProduct": // 즐겨찾기 브랜드에 대한 데이터 처리
                case "getStyleList": // 스타일 추천 통해서 처리
                case "getRecommendMyReceive": //마이추천 통해서 처리
                case "getOthersHaveSeenReceive"://남들은 뭘봤지 통해서 처리
                    
                    var params = {};

                    params.siteNo = 1;
                    params.adultYn = false;
                    params.chlNo = LotteCookie.getCookie("CHLNO");
                    params.chlDtlNo = LotteCookie.getCookie("CHLDTLNO");
                    params.priceDisYn = "N"; //할인 중인 장바구니 상품 표시
                        
                    if ($scope.loginInfo.isLogin) { // 로그인 중인 사용자라면
                        params.mbrNo = $scope.loginInfo.mbrNo;
                        params.gradeCd = $scope.loginInfo.gradeCd;
                        params.adultYn = $scope.loginInfo.isAdult ? true: false;
                    }
                    
                    if (command == "getCart") { // 장바구니
                        params.searchType = "J";
                        params.page = $scope.pageUI.curPage;
                        params.rowsPerPage = $scope.pageUI.rowsPerPage;
                        
                        // params.CARTINFO = LotteCookie.getCookie("CARTINFO"); // (비회원) 장바구니 번호
                        
                        $scope.setGATag("공통_장바구니보기", "장바구니보기", sendTxt, iptType);
                        
                        
                    } else if (command == "getDiscountedShoppingCartProduct") { // 할인중인 장바구니
                    	if( !(data && data.goLogin == "goLogin") ){
                        	$scope.setGATag("공통_장바구니할인상품보기", "장바구니할인상품보기", sendTxt, iptType);
                        }
                        if ($scope.loginInfo.isLogin) { // 로그인 사용자만 가능
                            params.searchType = "J";
                            params.priceDisYn = "Y";
                            params.page = $scope.pageUI.curPage;
                            params.rowsPerPage = $scope.pageUI.rowsPerPage;
                        } else {
                            self.showMsg(VCMsgData.msg.needLogin);
                            $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                            var vsLastDate = angular.copy(data);
                            vsLastDate.sendTxt = sendTxt;
                            vsLastDate.iptType = iptType;
                            vsLastDate.goLogin = "goLogin";
                            var vcLastCommandData =JSON.stringify(vsLastDate);
                            self.needLoginCommand(command , vcLastCommandData);
                            break;
                        }
                    }else if (command == "getWish") { // 위시리스트
                    	if( !(data && data.goLogin == "goLogin") ){
                        	$scope.setGATag("공통_위시리스트보기", "위시리스트보기", sendTxt, iptType);	
                        }
                        if ($scope.loginInfo.isLogin) { // 로그인 사용자만 가능
                            params.searchType = "W";
                            params.page = $scope.pageUI.curPage;
                            params.rowsPerPage = $scope.pageUI.rowsPerPage;
                        } else {
                            self.showMsg(VCMsgData.msg.needLogin);
                            $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                            var vsLastDate = angular.copy(data);
                            vsLastDate.sendTxt = sendTxt;
                            vsLastDate.iptType = iptType;
                            vsLastDate.goLogin = "goLogin";
                            var vcLastCommandData =JSON.stringify(vsLastDate);
                            self.needLoginCommand(command , vcLastCommandData);
                            break;
                        }
                    }else if (command == "getOftenList") { // 자주구매상품
                    	if( !(data && data.goLogin == "goLogin") ){
                    		$scope.setGATag("공통_자주구매보기", "자주구매보기", sendTxt, iptType);
                    	}
                        if ($scope.loginInfo.isLogin) { // 로그인 사용자만 가능
                            params.searchType = "O";
                            params.page = $scope.pageUI.curPage;
                            params.rowsPerPage = $scope.pageUI.rowsPerPage;
                        } else {
                            self.showMsg(VCMsgData.msg.needLogin);
                            $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                            var vsLastDate = angular.copy(data);
                            vsLastDate.sendTxt = sendTxt;
                            vsLastDate.iptType = iptType;
                            vsLastDate.goLogin = "goLogin";
                            var vcLastCommandData =JSON.stringify(vsLastDate);
                            self.needLoginCommand(command , vcLastCommandData);
                            break;
                        }
                        
                        
                    }else if (command == "getLately") { // 최근 본 상품

                        var lately = VCLocalLate.getLateList();
                        if(lately != null && lately != ""){
                            params.searchType = "G";
                            params.page = 1;
                            params.rowsPerPage = $scope.pageUI.rowsPerPage;
                            params.goodsNo = (lately + "").trim();
                        }else{
                            //최근 본 상품 없음
                            $scope.pageUI.prdList = [];
                            self.changeState("recently_viewed_item"); // 화면 전환
                            self.showMsg(VCMsgData.msg.lateNone);
                            $scope.setGATag("공통_최근본상품보기", "최근본상품보기", sendTxt, iptType,  $scope.pageUI.prestate);
                            break;
                        }
                        $scope.setGATag("공통_최근본상품보기", "최근본상품보기", sendTxt, iptType);
                        
                    }else if (command == "getMimitoutou") { // 미미뚜뚜
                    	if( !(data && data.goLogin == "goLogin") ){
                    		$scope.setGATag("공통_미미뚜뚜추천보기", "미미뚜뚜추천보기", sendTxt, iptType);
                    	}
                        if ($scope.loginInfo.isLogin) { // 로그인 사용자만 가능
                              if($scope.basicInfo.my_pet_info.bbc_no == "" || $scope.basicInfo.my_pet_info.bbc_no == "0"){//등록된아이없음
                                mimiNoRegistQ = true;
                                $scope.pageUI.prdList = [];
                                self.changeState("mimitoutou_recommendation");
                          		self.showMsg(VCMsgData.msg.mimiNoRegist); //등록된 우리 아이가 없어요
                          		$scope.soundEndData = VCMsgData.msg.mimiNoRegistQ; //질의메시지
                          		$scope.setVCAnalysis(VCMsgData.msg.mimiNoRegist.voice ,"Y","Y");
                          		$scope.setVCAnalysis(VCMsgData.msg.mimiNoRegistQ.voice ,"Y","Y");
                          		break;
                              }else{//등록된아이있음
                                params.bbc_no = $scope.basicInfo.my_pet_info.bbc_no;
                                params.worry_yn = "N";
                                params.searchType = "P";

                                if($scope.basicInfo.my_pet_info.worry_yn == "Y"){//고민등록
                              		params.searchType = "P";
                                    params.page = $scope.pageUI.curPage;
                                    params.rowsPerPage = $scope.pageUI.rowsPerPage;
                                    params.worry_yn = "Y";
                              	}
                          	}
                          } else {//비로그인
                              self.showMsg(VCMsgData.msg.needLogin);
                              $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                              var vsLastDate = angular.copy(data);
                              vsLastDate.sendTxt = sendTxt;
                              vsLastDate.iptType = iptType;
                              vsLastDate.goLogin = "goLogin";
                              var vcLastCommandData =JSON.stringify(vsLastDate);
                              self.needLoginCommand("getMimitoutou" , vcLastCommandData);
                              break;
                          }
                    }else if(command == "getSituationKeyword" || command == "getManagementItem"){//상황,관리 키워드
                        $scope.pageUI.preReqParam = data.preReqParam ? data.preReqParam : null; // 최종 필터값 저장
                        $scope.pageUI.preReqParamObj = null; // 최종 필터값 Object 형태로 변경
                        
                        if($scope.pageUI.preReqParam){
                            $scope.pageUI.preReqParamObj = $filter('convertParamToObject')($scope.pageUI.preReqParam);
                        }
                        
                        var GApreReqParamObj
                        var GArecommendData = JSON.parse(data.recommendData);
                        
                        if(data.preReqParam){
                            GApreReqParamObj = $filter('convertParamToObject')(data.preReqParam);
                        }
                        
                        var temp_arr = [
                            (GApreReqParamObj.talkId == 2					? "1차"									    : "2차"),
                            (GArecommendData.situationKeyword   		? GArecommendData.situationKeyword : ""),
                            ($scope.pageUI.preReqParamObj.firstManagementItem   		? $scope.pageUI.preReqParamObj.firstManagementItem 	: ""), //관리키워드
                            (GArecommendData.keyword   					? GArecommendData.keyword 			: "")
                        ];
                        var temp_arr2 = [
                            (GApreReqParamObj.talkId == 2					? "1차"									    		: "2차"),
                            (GArecommendData.situationKeyword   		? GArecommendData.situationKeyword 			: ""),
                            ($scope.pageUI.preReqParamObj.firstManagementItem   		? $scope.pageUI.preReqParamObj.firstManagementItem 	: ""), //관리키워드
                            (GArecommendData.keyword   					? GArecommendData.keyword 					: ""),
                            ($scope.pageUI.preReqParamObj.combinationSearchWord  ? $scope.pageUI.preReqParamObj.combinationSearchWord : ""),
                            (GApreReqParamObj.priceValue					? "가격대" 											: ""),
                            (GArecommendData.freeDeliYN					? "무료배송"											: ""),
                            (GArecommendData.freeInstYN					? "무이자혜택"										: ""),
                            (GArecommendData.delQuickYN					? "퀵배송" 											: ""),
                            (GArecommendData.pointYN						? "포인트적립"										: ""),
                            (GArecommendData.delTdarYN					? "오늘도착" 											: ""),
                            (GArecommendData.pkgYN						? "무료선물포장"										: ""),
                            (GArecommendData.color							? "컬러"												: ""),
                            (GArecommendData.sort							? "정렬"												: "")
                        ];
                        var arr = [];
                        var arr2 = [];
                        for(i = 0; i < temp_arr.length; i++ ){
                            if(temp_arr[i] != ""){
                                arr.push(temp_arr[i])
                            }
                        }
                        for(i = 0; i < temp_arr2.length; i++ ){
                            if(temp_arr2[i] != ""){
                                arr2.push(temp_arr2[i])
                            }
                        }
                        
                        if(GApreReqParamObj.searchType == "C" || GApreReqParamObj.searchType == "T"){ //카테고리
                        	if(command == "getSituationKeyword"){
                                if(GApreReqParamObj.talkId == 2){
                                    $scope.setGATag("공통_추천","상황_" + arr.join("_"), sendTxt, iptType);
                                }else{
                                    $scope.setGATag("공통_추천","상황_" + arr2.join("_"), sendTxt, iptType);
                                }
                        	}else if(command == "getManagementItem"){
                                if(GApreReqParamObj.talkId == 2){
                                    $scope.setGATag("공통_추천","관리_" + arr.join("_"), sendTxt, iptType);
                                }else{
                                    $scope.setGATag("공통_추천","관리_" + arr2.join("_"), sendTxt, iptType);
                                }                        		
                        	}
                        }
                        
                        $scope.viewInfoTempMicCheck = false;//마이크 자동 활성화 하지 말것
                        //화면에 필수질의문 출력
                        if(!data || !data.goodsNoList){

                            $scope.pageUI.prdList = [];
                            if(command == "getSituationKeyword"){
                                self.changeState("situation_recommendation");
                            }else if(command == "getManagementItem"){
                                self.changeState("management_item_recommendation");
                            }

                            if(!data.homeScreenMent){ //상품 없음 판단

                                $scope.pageLoading = true; // 로딩바

                                VCHotKeywordInfo.getHotKeyword()
                                .then(function (items) {
                                    // 인기 키워드 노출로 전환
                                    if (items) {
                                        $scope.setGATag("공통_추천", "상품결과없음", sendTxt, iptType);
                                        $scope.pageUI.situationData.question = "";
                                        $scope.pageUI.showMsg.guide = false;
                                        $scope.pageUI.showHotKeyword = true;
                                        $scope.pageUI.hotKeyword = items;
                                        self.showMsg(VCMsgData.msg.prdDataEmpty);
                                        $scope.setVCAnalysis(VCMsgData.msg.prdDataEmpty.voice ,"Y","Y");
                                    }
                                })
                                .catch(function () {
                                    console.error("인기키워드 오류");
                                })
                                .finally(function () {
                                    $scope.pageLoading = false; // 로딩바
                                });

                                break;
                            }

                            var tempQueArr = data.homeScreenMent.split("@");
                            
                            if(tempQueArr.length > 1){
                                $scope.pageUI.situationData.question = tempQueArr[0];
                                $scope.pageUI.situationData.answer = tempQueArr[1].split("#");
                                $scope.pageUI.showMsg.top = false;
                                $scope.pageUI.showMsg.home = false;
                                self.showMsg(VCMsgData.getMsgData(data.basicVoiceMent, data.basicVoiceMent, "voice"),null , true);
                            }
                            
                            break;
                        }
                        params.goodsNo = (data.goodsNoList + "").trim();
                        params.searchType = "G";
                        
                    }else if(command == "getSecretEvent"){
                        params.searchType = "S";
                        params.conrNo = "78156";
                        params.dispNo = "5607666";
                        $scope.setGATag("공통_이벤트", "비밀이벤트", sendTxt, iptType);
            		}else if(command == "getRecommendMyReceive"){
                        if(data && data.searchType){
                            params.searchType = data.searchType;
                        }
                        if(data && data.goodsNoList){
                            params.goodsNo = (data.goodsNoList + "").trim();
                        }
                    }else if(command == "getStyleList"){
                        params.searchType = "G";
                        params.goodsNo = (data.goodsNoList + "").trim();
                        $scope.setGATag("스타일추천", "스타일추천성공", null, iptType);
                       //params.ctgName = data.styleObj.ctgName;
                    }else if(command == "getNewProduct"){
                        params.searchType = "T";
                        if(data && data.commandNewProductName){
                            params.keyword = data.commandNewProductName;
                        }

                        params.sort = "DATE,1";
                        if(data && data.goodsNoList){
                            params.goodsNo = (data.goodsNoList + "").trim();
                        }
                    }else if(command == "getOthersHaveSeenReceive"){
                        params.searchType = "G";
                        if(data && data.goodsNoList){
                            params.goodsNo = (data.goodsNoList + "").trim();
                        }
                    }else { // 상품 추천
                        if (data) { // 상품 추천일 경우 data에 상품 리스트가 있어야 함
                            
                            $scope.pageUI.preReqParam = data.preReqParam ? data.preReqParam : null; // 최종 필터값 저장
                            $scope.pageUI.preReqParamObj = null; // 최종 필터값 Object 형태로 변경

                            if($scope.pageUI.preReqParam){
                                $scope.pageUI.preReqParamObj = $filter('convertParamToObject')($scope.pageUI.preReqParam);
                            }
                            
                            if (data.goodsNoList && data.goodsNoList.length > 0) {
                                params.searchType = "G";
                                // 상품추천일때는 상품 번호로 조회하기 때문에 페이지, 페이지 로우 파라미터 없음
                                // params.page = 1;
                                // params.rowPerPage = 40;
                                params.goodsNo = (data.goodsNoList + "").trim();
                            } else { // 상품 결과 없음 처리 
                                
                                if ($scope.pageUI.preReqParamObj && $scope.pageUI.preReqParamObj.talkId && $scope.pageUI.preReqParamObj.talkId == "2") { // 1차 발화시 체크 talkId == 2 (추천 키워드)
                                    $scope.pageUI.prdList = [];
                                    $scope.pageLoading = true; // 로딩바

                                    VCHotKeywordInfo.getHotKeyword()
                                    .then(function (items) {
                                        // 인기 키워드 노출로 전환
                                        if (items) {
                                        	$scope.setGATag("공통_추천", "상품결과없음", sendTxt, iptType);
                                            self.changeState("prod_list");
                                            $scope.pageUI.showMsg.guide = false;
                                            $scope.pageUI.showHotKeyword = true;
                                            $scope.pageUI.hotKeyword = items;
                                            // 1차 발화 시 상품이 없을 경우는 인기키워드 노출로 멘트 하드코딩
                                            // self.semanticMsgShow(data);
                                            self.showMsg(VCMsgData.msg.prdDataEmpty);
                                            $scope.setVCAnalysis(VCMsgData.msg.prdDataEmpty.voice ,"Y","Y");
                                        }
                                    })
                                    .catch(function () {
                                        console.error("인기키워드 오류");
                                    })
                                    .finally(function () {
                                        $scope.pageLoading = false; // 로딩바
                                    });

                                    break;
                                } else if($scope.pageUI.preReqParamObj && $scope.pageUI.preReqParamObj.talkId > "2") { //2차 이상 발화시 상품 없을때 사만다 메시지 처리
                                    //console.log("2차 발화 이상 - 상품 없음, data : ", data);
                                    $scope.setGATag("공통_추천", "상품결과없음", sendTxt, iptType);
                                    if (data.queryMent && data.basicVoiceMent) {
                                        self.semanticMsgShow(data);
                                    }
                                    break;
                                } else {
                                    //console.log("발화 차수 정보 없음 - 상품 없음, data : ", data);
                                    $scope.setGATag("공통_추천", "상품결과없음", sendTxt, iptType);

                                    if (data.queryMent && data.basicVoiceMent) {
                                        self.semanticMsgShow(data);
                                    }
                                    break;
                                }
                            }
                            
                        } else { // TO-DO: Data 없을 때 처리
                            console.error("상품 추천 데이터 없음");
                            $scope.setGATag("공통_추천", "상품결과없음", sendTxt, iptType);
                            break;
                        }
                    }
                    self.initProdOpt(); // 이전 선택된 상품 옵션 정보 초기화
                    
                    $scope.pageLoading = true; // 로딩바

                    VCGetPrdInfo.getPrdListInfo(params) // 상품 리스트 정보 호출 (장바구니, 위시, 추천은 파라미터의 searchType으로 구분 됨)
                    .then(function (res) { // 상품정보 획득 성공 res: 상품정보 Array
                        if(res.prd_list && res.prd_list.items && res.prd_list.items.length > 0){
                            $scope.pageUI.prdList = res.prd_list.items;
                        }else{
                            $scope.pageUI.prdList = [];
                            if (command == "getCart") {
                                self.changeState("cart");
                                self.showMsg(VCMsgData.msg.cartNone);
                                $scope.setVCAnalysis(VCMsgData.msg.cartNone.voice ,"Y","Y");
                            }else if(command == "getWish"){
                                self.changeState("wish");
                                self.showMsg(VCMsgData.msg.wishNone);
                                $scope.setVCAnalysis(VCMsgData.msg.wishNone.voice ,"Y","Y");
                            }else if(command == "getOftenList"){
                                self.changeState("purchase_frequently");
                                self.showMsg(VCMsgData.msg.oftenNone);
                                $scope.setVCAnalysis(VCMsgData.msg.oftenNone.voice ,"Y","Y");
                            }else if(command =="getLately"){
                                self.changeState("recently_viewed_item");
                                self.showMsg(VCMsgData.msg.lateNone);
                                $scope.setVCAnalysis(VCMsgData.msg.lateNone.voice ,"Y","Y");
                            }else if(command =="getMimitoutou"){
                                self.changeState("mimitoutou_recommendation");
                                self.showMsg(VCMsgData.msg.mimiNone);
                                $scope.setVCAnalysis(VCMsgData.msg.mimiNone.voice ,"Y","Y");
                            }else if(command =="getNewProduct"){
                                self.changeState("favorite_brands");
                                self.showMsg(VCMsgData.msg.favorBrandNone);
                                $scope.setVCAnalysis(VCMsgData.msg.favorBrandNone.voice ,"Y","Y");
                            }else if(command =="getDiscountedShoppingCartProduct"){
                                self.changeState("cart");
                                self.showMsg(VCMsgData.msg.cartSaleNone);
                                $scope.setVCAnalysis(VCMsgData.msg.cartSaleNone.voice ,"Y","Y");
                            }else if(command == "getSecretEvent"){
                                self.changeState("secret_event");
                                self.showMsg(VCMsgData.msg.secretListNone);
                                $scope.setVCAnalysis(VCMsgData.msg.secretListNone.voice ,"Y","Y");
                            }else if(command == "getSituationKeyword" || command == "getManagementItem"){
                                //상품이 없는경우가 생기면 안됨
                            }else if(command == "getRecommendMyReceive"){
                                self.changeState("my_recommendation");
                                self.showMsg(VCMsgData.msg.myRecommendNone);
                                $scope.setVCAnalysis(VCMsgData.msg.myRecommendNone.voice ,"Y","Y");
                            }else if(command == "getOthersHaveSeenReceive"){
                                self.changeState("other_customers_item_recommendation");
                                self.showMsg(VCMsgData.msg.othersHaveNone);
                                $scope.setVCAnalysis(VCMsgData.msg.othersHaveNone.voice ,"Y","Y");
                            }
                            return;
                        }

                        $scope.pageUI.showPrd10 = false;
                        $scope.pageUI.showPrd20 = false;
                        $scope.pageUI.showPrdEnd = false;
                        
                        if (command == "getCart") {
                            $scope.pageUI.totalCnt = res.total_cnt;  
                            self.changeState("cart");
                            
                            if($scope.pageUI.isChangeCommandState){ //최초 실행(command 명령이 변경 됬을때)
                                if($scope.pageUI.totalCnt > $scope.pageUI.rowsPerPage){
                                    self.showMsg(VCMsgData.msg.cartShow, [$scope.pageUI.totalCnt]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.cartShow, [$scope.pageUI.totalCnt]).voice  ,"Y","Y");
                                } else if($scope.pageUI.totalCnt > 0){
                                    self.showMsg(VCMsgData.msg.cartShowUnder, [$scope.pageUI.totalCnt]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.cartShowUnder, [$scope.pageUI.totalCnt]).voice  ,"Y","Y");
                                } else if($scope.pageUI.totalCnt == 0 ){
                                    self.showMsg(VCMsgData.msg.cartNone);
                                    $scope.setVCAnalysis(VCMsgData.msg.cartNone.voice ,"Y","Y");
                                }
                            }
                        }else if (command == "getDiscountedShoppingCartProduct") {
                            self.changeState("cart");
                            self.showMsg(VCMsgData.msg.cartSaleShow);
                            $scope.setVCAnalysis(VCMsgData.msg.cartSaleShow.voice ,"Y","Y");
                        } else if (command == "getWish") {
                            $scope.pageUI.totalCnt = res.total_cnt;  
                            self.changeState("wish");
                            
                            if($scope.pageUI.isChangeCommandState){ //최초 실행(command 명령이 변경 됬을때)
                                if($scope.pageUI.totalCnt > $scope.pageUI.rowsPerPage){
                                    self.showMsg(VCMsgData.msg.wishShow, [$scope.pageUI.totalCnt]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.wishShow, [$scope.pageUI.totalCnt]).voice  ,"Y","Y");
                                } else if($scope.pageUI.totalCnt > 0) {
                                    self.showMsg(VCMsgData.msg.wishShowUnder, [$scope.pageUI.totalCnt]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.wishShowUnder, [$scope.pageUI.totalCnt]).voice  ,"Y","Y");
                                }else if($scope.pageUI.totalCnt == 0 ){
                                    self.showMsg(VCMsgData.msg.wishNone);
                                    $scope.setVCAnalysis(VCMsgData.msg.wishNone.voice ,"Y","Y");
                                }
                            }
                            
                        } else if (command == "getOftenList") {
                            $scope.pageUI.totalCnt = res.total_cnt; 
                            self.changeState("purchase_frequently");
                            if($scope.pageUI.isChangeCommandState){ //최초 실행(command 명령이 변경 됬을때)
                                if($scope.pageUI.totalCnt > $scope.pageUI.rowsPerPage){
                                    self.showMsg(VCMsgData.msg.oftenShow, [$scope.pageUI.totalCnt]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.oftenShow, [$scope.pageUI.totalCnt]).voice  ,"Y","Y"); 
                                } else if($scope.pageUI.totalCnt > 0) {
                                    self.showMsg(VCMsgData.msg.oftenShowUnder, [$scope.pageUI.totalCnt]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.oftenShowUnder, [$scope.pageUI.totalCnt]).voice  ,"Y","Y");
                                }else if($scope.pageUI.totalCnt == 0 ){
                                    self.showMsg(VCMsgData.msg.oftenNone);
                                    $scope.setVCAnalysis(VCMsgData.msg.oftenNone.voice ,"Y","Y");
                                }
                            }
                            
                        }else if (command == "getLately") {
                            $scope.pageUI.totalCnt = res.total_cnt ? res.total_cnt : res.prd_list.total_count;
                            self.changeState("recently_viewed_item");
                            
                            if($scope.pageUI.totalCnt > 0) {
                                if($scope.loginInfo.isLogin){
                                    self.showMsg(VCMsgData.msg.lateLoginedShow, [$scope.loginInfo.name]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.lateLoginedShow, [$scope.loginInfo.name]).voice  ,"Y","Y"); 
                                }else{
                                    self.showMsg(VCMsgData.msg.lateShow, [$scope.pageUI.totalCnt]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.lateShow, [$scope.pageUI.totalCnt]).voice ,"Y","Y" );
                                }
                            }else if($scope.pageUI.totalCnt == 0 ){
                                self.showMsg(VCMsgData.msg.lateNone);
                                $scope.setVCAnalysis(VCMsgData.msg.lateNone.voice ,"Y","Y");
                            }

                        }else if (command == "getMimitoutou") {
                        	$scope.pageUI.totalCnt = res.total_cnt;
                            self.changeState("mimitoutou_recommendation");
                            if($scope.basicInfo.my_pet_info.worry_yn == "N"){//고민등록되지않음
                                //상품뿌려지는지 확인
                                self.showMsg(VCMsgData.msg.mimiWorryNone, [$scope.basicInfo.my_pet_info.bbc_nm]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.mimiWorryNone, [$scope.basicInfo.my_pet_info.bbc_nm]).voice ,"Y","Y" );
                            }else{//고민등록
                              self.showMsg(VCMsgData.msg.mimiWorryShow, [$scope.basicInfo.my_pet_info.bbc_nm]);
                              $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.mimiWorryShow, [$scope.basicInfo.my_pet_info.bbc_nm]).voice ,"Y","Y" );
                            }
                        }else if (command == "getNewProduct") {
                        	$scope.setGATag("공통_브랜드신상품보기", "브랜드신상품보기", sendTxt, iptType);
                            self.changeState("favorite_brands");
                            self.showMsg(VCMsgData.msg.favorBrandShow , [data.commandNewProductName]);
                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.favorBrandShow, [data.commandNewProductName]).voice ,"Y","Y" );
                        }else if (command == "getSecretEvent") {
                            self.changeState("secret_event");
                            self.showMsg(VCMsgData.getMsgData(res.set_nm , res.set_nm , "top"));
                            $scope.setVCAnalysis(res.set_nm ,"Y","Y");
                            if(res.secret_text_list && res.secret_text_list.items){
                                $scope.pageUI.prdSecretTextList = res.secret_text_list.items;
                            }
                        }else if (command == "getRecommendMyReceive") {//마이추천
                            self.changeState("my_recommendation");
                            if($scope.loginInfo.isLogin){
                                self.showMsg(VCMsgData.msg.myRecommendOnly, [$scope.loginInfo.name]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.myRecommendOnly, [$scope.loginInfo.name]).voice ,"Y","Y" ); 
                            }else{
                                self.showMsg(VCMsgData.msg.myRecommendShow);
                                $scope.setVCAnalysis(VCMsgData.msg.myRecommendShow.voice ,"Y","Y");
                            }
                        }else if(command == "getOthersHaveSeenReceive"){
                            self.changeState("other_customers_item_recommendation");
                            self.showMsg(VCMsgData.msg.othersHave);
                            $scope.setVCAnalysis(VCMsgData.msg.othersHave.voice ,"Y","Y");
                        }else if(command == "getSituationKeyword" || command == "getManagementItem"){//상황, 관리
                            if(command == "getSituationKeyword"){
                                self.changeState("situation_recommendation");
                            }else if(command == "getManagementItem"){
                                self.changeState("management_item_recommendation");
                            }
                            
                            self.semanticMsgShow(data);
                            
                            //통합검색 관련 키워드 구현
                            if($scope.pageUI.preReqParamObj.keyword && $scope.pageUI.preReqParamObj.combinationSearchWord){
                                $scope.pageUI.stateSelector = [];
                                angular.forEach($scope.pageUI.preReqParamObj.combinationSearchWord.split(","),function(value , index){
                                    if(value != $scope.pageUI.preReqParamObj.keyword){
                                        this.push({txt:value});
                                  }
                                },$scope.pageUI.stateSelector)

                                if($scope.pageUI.stateSelector.length > 0){
                                    self.stateSelectorReset()
                                    $scope.pageUI.stateSelectorViewInfo = true;
                                }
                            }
                            
                        }else if(command == "getStyleList"){//스타일 추천
                            self.changeState("style_recommendation");
                            self.showMsg(VCMsgData.msg.styleRecomShow,[data.styleObj.ctgName]);
                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.styleRecomShow, [data.styleObj.ctgName]).voice ,"Y","Y" );
                        }else {
                        	
                            var GApreReqParamObj
                            var GArecommendData = JSON.parse(data.recommendData);

                            if(data.preReqParam){
                                GApreReqParamObj = $filter('convertParamToObject')(data.preReqParam);
                            }
                            
                            var temp_arr = [
                                (GApreReqParamObj.talkId == 2			? "1차"									: "2차"),
                                (GArecommendData.itemValue			? "아이템"								: ""), //카테고리일때 itemValue
                                (GApreReqParamObj.keyword				? "아이템"								: ""), //통합검색일때 keyword
                                (GArecommendData.brandNo				? "브랜드"								: ""),
                                (GApreReqParamObj.priceValue			? "가격대" 								: ""),
                                (GArecommendData.freeDeliYN			? "무료배송"								: ""),
                                (GArecommendData.freeInstYN			? "무이자혜택"							: ""),
                                (GArecommendData.delQuickYN			? "퀵배송" 								: ""),
                                (GArecommendData.pointYN				? "포인트적립"							: ""),
                                (GArecommendData.delTdarYN			? "오늘도착" 								: ""),
                                (GArecommendData.pkgYN				? "무료선물포장"							: ""),
                                (GArecommendData.color					? "컬러"									: ""),
                                (GArecommendData.sort					? "정렬"									: "")
                            ];
                            var temp_arr2 = [
                            (GApreReqParamObj.talkId == 2				? "1차"									: "2차"),
                            (GApreReqParamObj.priceValue				? "가격대"								: ""),
                            (GArecommendData.freeDeliYN				? "무료배송"								: ""),
                            (GArecommendData.freeInstYN				? "무이자혜택"							: ""),
                            (GArecommendData.delQuickYN				? "퀵배송" 								: ""),
                            (GArecommendData.pointYN					? "포인트적립"							: ""),
                            (GArecommendData.delTdarYN				? "오늘도착" 								: ""),
                            (GArecommendData.pkgYN					? "무료선물포장"							: ""),
                            (GArecommendData.color						? "컬러"									: ""),
                            (GArecommendData.sort						? "정렬"									: "")
                            ];
                            var arr = [];
                            var arr2 = [];
                            for(i = 0; i < temp_arr.length; i++ ){
                                if(temp_arr[i] != ""){
                                    arr.push(temp_arr[i])
                                }
                            }
                            for(i = 0; i < temp_arr2.length; i++ ){
                                if(temp_arr2[i] != ""){
                                    arr2.push(temp_arr2[i])
                                }
                            }
                            
                            if(GApreReqParamObj.searchType == "R" && GArecommendData.gender && GArecommendData.age){ //Best상품 성별, 나이
                                $scope.setGATag("공통_추천", "베스트_"+GArecommendData.gender+"_"+GArecommendData.age , sendTxt, iptType);
                            }else if(GApreReqParamObj.searchType == "R" && GArecommendData.gender ){ //Best상품 성별
                                $scope.setGATag("공통_추천", "베스트_"+GArecommendData.gender , sendTxt, iptType);
                            } else if(GApreReqParamObj.searchType == "R" && GArecommendData.age ){ //Best상품 나이
                                $scope.setGATag("공통_추천", "베스트_"+GArecommendData.age , sendTxt, iptType);
                            }
                            
                            if(GApreReqParamObj.searchType == "C" || GApreReqParamObj.searchType == "T"){ //카테고리
                                if(GApreReqParamObj.talkId == 2){
                                    $scope.setGATag("공통_추천","일반_" + arr.join("_"), sendTxt, iptType);
                                }else{
                                    $scope.setGATag("공통_추천","일반_" + arr2.join("_"), sendTxt, iptType);
                                }
                            }
                        
                            
                            
                            if($scope.pageUI.preReqParamObj && $scope.pageUI.preReqParamObj.searchType == "R"){
                                self.changeState("best_recommendation");
                            }else{
                                self.changeState("prod_list"); // 데이터 처리 후 화면 전환
                            }
                            
                            self.semanticMsgShow(data);
                        }
                        
                        if ($scope.prdSwiperCtrl) { // 리스트 갱신시 사이즈 재계산
                            angular.element(".prod_list_wrap").css("opacity", 0);
                            $scope.prdSwiperCtrl.init();// 상품리스트 스와이프 초기화
                            $timeout(function () { // 선택 인덱스 0번째로 변경 (리스트 갱신이기 때문에)
                                $scope.pageUI.curPrdSwiperIdx = 0; // 스와이프 Index 초기화
                                //$scope.prdSwiperCtrl.moveSpeedIndex(0, 10); // 스와이프 음성명령어Index 초기화
                                $scope.prdSwiperCtrl.setIndex(0); // 스와이프 Index 초기화
                                angular.element(".prod_list_wrap").css("opacity", 1);
                            }, 300);
                        }
                    })
                    .catch(function (res) { // 상품 리스트 정보 호출 오류 시 처리
                        $scope.pageUI.prdList = []; // 연동 실패 시 상품 정보 초기화
                        
                        if (command == "getCart") {
                            self.changeState("cart");
                            self.showMsg(VCMsgData.msg.cartNone);
                            $scope.setVCAnalysis(VCMsgData.msg.cartNone.voice ,"Y","Y");
                        }else if(command == "getWish"){
                            self.changeState("wish");
                            self.showMsg(VCMsgData.msg.wishNone);
                            $scope.setVCAnalysis(VCMsgData.msg.wishNone.voice ,"Y","Y");
                        }else if(command == "getOftenList"){
                            self.changeState("purchase_frequently");
                            self.showMsg(VCMsgData.msg.oftenNone);
                            $scope.setVCAnalysis(VCMsgData.msg.oftenNone.voice ,"Y","Y");
                        }else if(command =="getLately"){
                            self.changeState("recently_viewed_item");
                            self.showMsg(VCMsgData.msg.lateNone);
                            $scope.setVCAnalysis(VCMsgData.msg.lateNone.voice ,"Y","Y");
                        }else if(command =="getMimitoutou"){
                            self.changeState("mimitoutou_recommendation");
                            self.showMsg(VCMsgData.msg.mimiNone);
                            $scope.setVCAnalysis(VCMsgData.msg.mimiNone.voice ,"Y","Y");
                        }else if(command =="getNewProduct"){
                            self.changeState("favorite_brands");
                            self.showMsg(VCMsgData.msg.favorBrandNone);
                            $scope.setVCAnalysis(VCMsgData.msg.favorBrandNone.voice ,"Y","Y");
                        }else if(command =="getDiscountedShoppingCartProduct"){
                            self.changeState("cart");
                            self.showMsg(VCMsgData.msg.cartSaleNone);
                            $scope.setVCAnalysis(VCMsgData.msg.cartSaleNone.voice ,"Y","Y");
                        }else if(command == "getSecretEvent"){
                            self.changeState("secret_event");
                            self.showMsg(VCMsgData.msg.secretListNone);
                            $scope.setVCAnalysis(VCMsgData.msg.secretListNone.voice ,"Y","Y");
                        }else if(command == "getSituationKeyword" || command == "getManagementItem"){
                            //상품이 없는경우가 생기면 안됨
                        }else if(command == "getRecommendMyReceive"){
                            self.changeState("my_recommendation");
                            self.showMsg(VCMsgData.msg.myRecommendNone);
                            $scope.setVCAnalysis(VCMsgData.msg.myRecommendNone.voice ,"Y","Y");
                        }else if(command == "getOthersHaveSeenReceive"){
                            self.changeState("other_customers_item_recommendation");
                            self.showMsg(VCMsgData.msg.othersHaveNone);
                            $scope.setVCAnalysis(VCMsgData.msg.othersHaveNone.voice ,"Y","Y");
                        }
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });

                    break;

                case "actionQuantity": // 수량 발화
                case "actionQuantityChange": //수량 변경
                case "actionQuantityMore": //수량 증가
                case "actionOrderMore": //수량 증가 주문 요청
                    var curPordInfo = self.getCurProdInfo();
                    var dataCnt = data && data.commandQuantity ? parseInt(data.commandQuantity) : 0; // 수량 발화

                    if(command == "actionQuantityMore" || command == "actionOrderMore"){
                    	if(command == "actionQuantityMore"){
                    		$scope.setGATag("음성명령어", "수량 늘리기", sendTxt, iptType);
                    	} else if(command == "actionOrderMore"){
                    		$scope.setGATag("음성명령어", "수량 늘리기 주문", sendTxt, iptType);
                    	}
                        if($scope.pageUI.state == "prod_detail"){
                            if($scope.prodListQuantity < 1){
                                $scope.prodListQuantity = 1;
                            };
                            dataCnt = $scope.prodListQuantity + dataCnt;
                        }else if($scope.pageUI.state == "order"){
                            dataCnt = $scope.pageUI.orderInfo.orderCnt + dataCnt;
                        }
                    } else{
                    	/*if(command == "actionQuantityChange"){
                    		$scope.setGATag("음성명령어", "수량 변경", sendTxt, iptType);
                    	}*/
                    }

                    if (dataCnt > 0 && dataCnt >= parseInt(curPordInfo.min_lmt_qty) &&
                    dataCnt <= parseInt(curPordInfo.max_lmt_qty)) { // 수량 발화가 정상적이라면
                        if($scope.pageUI.state == "prod_detail"){
                            $scope.prodListQuantity = dataCnt;
                            if(command == "actionQuantityMore" || command == "actionOrderMore"){
                                
                            } else{
                            	$scope.setGATag("음성명령어", "수량 변경", sendTxt, iptType);
                            }

                            if(command == "actionOrderMore"){//주문 확정으로
                                $scope.pageUI.orderInfo.orderCnt = dataCnt;
                                self.orderDecide();
                            }
                        }else if($scope.pageUI.state == "order"){
                            $scope.pageUI.orderInfo.orderCnt = dataCnt;
                            if(command == "actionQuantityMore" || command == "actionOrderMore"){
                            
                            } else{
                            	$scope.setGATag("음성명령어", "수량 변경", sendTxt, iptType);
                            }

                            if (curPordInfo.cart_sn) { // 장바구니 상품이라면
                                self.orderDecide(curPordInfo.cart_sn, true);
                            } else {
                                self.orderDecide();
                            }
                        }else {
                            self.showMsg(VCMsgData.msg.unknown);
                            $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        }
                    }else{
                        if(dataCnt < parseInt(curPordInfo.min_lmt_qty)){
                            self.showMsg(VCMsgData.msg.errMinLmtQty , [parseInt(curPordInfo.min_lmt_qty)]);
                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.errMinLmtQty, [parseInt(curPordInfo.min_lmt_qty)]).voice ,"Y","Y" );
                        }else if(dataCnt > parseInt(curPordInfo.max_lmt_qty)){
                            self.showMsg(VCMsgData.msg.errMxnLmtQty , [parseInt(curPordInfo.max_lmt_qty)]);
                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.errMxnLmtQty, [parseInt(curPordInfo.max_lmt_qty)]).voice ,"Y","Y" );
                        }
                    }
                    
                    break;
                case "actionCamera": //카메라 실행
                case "actionAlbum": //앨범_실행
                    //스타일 추천 앱버전 체크
                    if(VCAppApi.styleAppChk() == false){
                        $scope.styleAppCheckShowAlert();
                        break;
                    }

                    if(command == "actionCamera"){
                    	$scope.setGATag("공통_스타일추천", "스타일추천 카메라 이동", sendTxt, iptType);
                        $scope.styleAppCheckAndCommand("open","camera");
                    }else if(command == "actionAlbum"){
                    	$scope.setGATag("공통_스타일추천", "스타일추천 앨범 이동", sendTxt, iptType);
                        $scope.styleAppCheckAndCommand("open","media");
                    }
                    break;
                case "getStyle": //스타일 추천해줘
                    //data.commandNumber : 1 (번호)
                    
                    if(!$scope.checkListState($scope.pageUI.state) && $scope.pageUI.state != "prod_detail" && $scope.pageUI.state != "order" && $scope.pageUI.state != "order_complete"){
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                		break;
                    }
                    
                    $scope.setGATag("음성명령어", "스타일추천", sendTxt, iptType);
                    var dataNum = data && data.commandNumber ? parseInt(data.commandNumber) - 1 : -1; // 번호 발화
                    var curPordInfo = $scope.VCCtrl.getCurProdInfo(); // 현재 선택 상품 정보
                    if(!curPordInfo){
                        console.error("스타일 추천 상품 선택이 없습니다")
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                        break;
                    }
                    if (dataNum > -1 && $scope.pageUI.prdList.length > dataNum) { // 번호 발화가 정상적이라면
                        $scope.pageUI.curPrdSwiperIdx = dataNum;
                        $scope.prdSwiperCtrl.moveSpeedIndex(dataNum, 10); // 해당 상품 정보로 스와이프 위치 변경
                        curPordInfo = $scope.VCCtrl.getCurProdInfo(); // 현재 선택 상품 정보
                    }
                    if(curPordInfo.style_recomm_yn != "Y"){ //가능한 상품인지 확인
                        self.showMsg(VCMsgData.msg.styleRecomNone);
                        $scope.setVCAnalysis(VCMsgData.msg.styleRecomNone.voice ,"Y","Y");
                        $scope.setGATag("스타일추천", "추천불가메시지노출", null, null);
                        break;
                    }
                    if($scope.pageUI.state == "prod_detail"){
                        var styleProdInfo = {};
                        styleProdInfo.style_recomm_cate_grp_cd = curPordInfo.style_recomm_cate_grp_cd;
                        styleProdInfo.img_url = $scope.pageUI.curPrdDetailInfo.imgInfo.imgList[$scope.prdDetailSwiperCtrl.getIndex()];
                        if($scope.prdDetailSwiperCtrl.getIndex() == 0){
                            styleProdInfo.goods_no = curPordInfo.goods_no;
                        }
                        styleProdInfo.style_gen_cd = curPordInfo.style_gen_cd;
                        $scope.getStyleRecom(styleProdInfo , true);
                    }else{
                        $scope.getStyleRecom(curPordInfo , true);
                    }
                    
                    break;
                case "getOrderExchangeVisitInformation": //주문 방문 일자 정보 변경  스마트픽 방문 일자
                	self.showMsg(VCMsgData.msg.unknown);
                	$scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                    if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                    	$scope.setGATag("공통_주문조회", "주문 방문일자변경", sendTxt, iptType);
                    }else{
                    	$scope.setGATag("공통_주문조회", "주문 방문일자변경+날짜", sendTxt, iptType);
                    }
                    break;
                case "getOrderDetailView": //주문내역 자세히 보기
                    if(data && $scope.pageUI.state == "order_inquiry"){
                        if(data.commandNumber){
                            if($scope.pageUI.purchaseList.length < data.commandNumber){
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                                break;
                            }
                            VCPageMove.goPurchaseView($scope.pageUI.purchaseList[data.commandNumber-1].ord_no);
                        }else if(data.commndOrdNo){
                            VCPageMove.goPurchaseView(data.commndOrdNo);
                        }
                    }    
                    break;
                case "actionExchange": //교환
                    if($scope.pageUI.state == "order_inquiry"){
                        if(data && data.commandNumber){
                            var checkNum = data.commandNumber;
                        
                            if($scope.pageUI.purchaseList.length >= checkNum ){
                                checkNum = checkNum -1;
                                if($scope.pageUI.purchaseList[checkNum].exchange_psb_yn == "Y"){//교환 가능 확인
                                    $scope.orderDetail($scope.pageUI.purchaseList[checkNum].ord_no)
                                }else{
                                    //교환 불가능
                                    self.showMsg(VCMsgData.msg.purchaseSelectNone , ["교환"]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["교환"]).voice ,"Y","Y" );
                                }
                            }else if($scope.pageUI.purchaseList.length < checkNum){
                                //교환 가능한 번호가 없음
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                            }
                        }else{
                            self.showMsg(VCMsgData.msg.purchaseExchangeLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseExchangeLike.voice ,"Y","Y");
                        }
                    }
                    $scope.setGATag("음성명령어", "교환해줘", sendTxt, iptType);
                    break;
                case "actionReturn": //반품해줘 = 반품 가능한 내역
                    if($scope.pageUI.state == "order_inquiry"){
                        if(data && data.commandNumber){
                            var checkNum = data.commandNumber;
                        
                            if($scope.pageUI.purchaseList.length >= checkNum ){
                                checkNum = checkNum -1;
                                if($scope.pageUI.purchaseList[checkNum].return_psb_yn == "Y"){//반품 가능 확인
                                    $scope.orderDetail($scope.pageUI.purchaseList[checkNum].ord_no)
                                }else{
                                    //반품 불가능
                                    self.showMsg(VCMsgData.msg.purchaseSelectNone , ["반품"]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["반품"]).voice ,"Y","Y" );
                                }
                            }else if($scope.pageUI.purchaseList.length < checkNum){
                                //반품 가능한 번호가 없음
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                            }
                            $scope.setGATag("공통_주문조회", data.commandNumber + "번 주문 반품", sendTxt, iptType);
                        }else{
                            self.showMsg(VCMsgData.msg.purchaseReturnLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseReturnLike.voice ,"Y","Y");
                        }
                    }
                    $scope.setGATag("음성명령어", "반품해줘", sendTxt, iptType);
                    break;
                case "getCancelOrder": //이미 취소한 주문 내역 (취소주문 보여줘) - 6
                case "getExchangeInProgressOrder": //교환중인 주문 보여줘  - 7
                case "getReturnInProgressOrder": //반품중인 주문 보여줘   - 8
                case "getOrderReturn": //주문 반품 가능 내역
                case "getOrderExchange"://주문 교환
                case "getOrderChangeShipping": //주문배송지 변경
                case "getOrderChangeOption": //주문옵션 변경 (날자)
                case "getOrderCancle": //{1번}주문취소 해줘
                case "getOrderInquire": //주문한거/주문정보/주문 언제와
                case "getOrderList": //주문내역

                    if(command == "getOrderInquire" && data && data.commandNumber){
                        
                        var checkNum = data.commandNumber;
                        if( $scope.pageUI.state == "order_inquiry" && $scope.pageUI.purchaseList.length >= checkNum ){
                            checkNum = checkNum -1;
                            var inquireTarget = $scope.pageUI.purchaseList[checkNum];
                            
                            if(inquireTarget.send_due_date){//배송예정일 있을때
                                if(inquireTarget.ord_step_str == "발송완료"){
                                    self.showMsg(VCMsgData.getMsgData(inquireTarget.ord_step_msg,inquireTarget.ord_step_msg,"q"));
                                    $scope.setVCAnalysis(inquireTarget.ord_step_msg ,"Y","Y");
                                }else{
                                    $scope.pageLoading = true; // 로딩바
                                    VCDeliveryInfo.getDeliveryInfo({
                                        goods_no: inquireTarget.goods_no
                                    })
                                    .then(function (data) { // 배송정보 확인 성공
                                        
                                        /**
                                        * data.gubunCd : 명절 구분 값 99 면 명절
                                        */
                                        if (data.gubunCd == "99") { // 명절
                                            self.showMsg(VCMsgData.msg.prdDeliveryHolidayDate); // 명절 케이스
                                            $scope.setVCAnalysis(VCMsgData.msg.prdDeliveryHolidayDate.voice ,"Y","Y");
                                        } else {
                                            self.showMsg(VCMsgData.getMsgData(inquireTarget.send_due_date + inquireTarget.send_due_word,inquireTarget.send_due_date + inquireTarget.send_due_word,"q"));
                                            $scope.setVCAnalysis(inquireTarget.send_due_date + inquireTarget.send_due_word ,"Y","Y");
                                        }
                                    })
                                    .catch(function () { // 배송정보 확인 실패
                                        console.error("배송정보 확인 오류");
                                        self.showMsg(VCMsgData.msg.networkError);
                                    })
                                    .finally(function () {
                                        $scope.pageLoading = false; // 로딩바
                                    });
                                }
                                
                            }else if(inquireTarget.ord_step_msg){
                                if(inquireTarget.ord_dtl_stat_cd == "17" && inquireTarget.ord_step_msg.search(inquireTarget.inv_no) > 0){
                                    if( inquireTarget.ord_step_str == "발송완료"){
                                        self.showMsg(VCMsgData.msg.purchaseSendShow);
                                        $scope.setVCAnalysis(VCMsgData.msg.purchaseSendShow.voice ,"Y","Y");
                                    }else if(inquireTarget.ord_step_str == "배송완료"){
                                        self.showMsg(VCMsgData.msg.purchaseSendShowSended);
                                        $scope.setVCAnalysis(VCMsgData.msg.purchaseSendShowSended.voice ,"Y","Y");
                                    }else{
                                        self.showMsg(VCMsgData.msg.purchaseSendShow);
                                        $scope.setVCAnalysis(VCMsgData.msg.purchaseSendShow.voice ,"Y","Y");
                                    }
                                }else{
                                    self.showMsg(VCMsgData.getMsgData(inquireTarget.ord_step_msg,inquireTarget.ord_step_msg,"q"));
                                    $scope.setVCAnalysis(inquireTarget.ord_step_msg ,"Y","Y");
                                }
                            }else {
                                self.showMsg(VCMsgData.msg.purchaseNameShow , [$scope.loginInfo.name]);
                                $scope.setVCAnalysis(VCMsgData.msg.purchaseNameShow.voice ,"Y","Y");
                            }
                            $scope.setGATag("음성명령어", "언제와", sendTxt, iptType);
                            break;
                        }
                    }
                    
                    if(command == "getOrderReturn"){
                        
                        if($scope.pageUI.state == "order_inquiry" && data && data.commandNumber){
                            var checkNum = data.commandNumber;
                            if($scope.pageUI.purchaseList.length >= checkNum ){
                                checkNum = checkNum -1;
                                if($scope.pageUI.purchaseList[checkNum].return_psb_yn == "Y"){//반품 가능 확인
                                    $scope.orderDetail($scope.pageUI.purchaseList[checkNum].ord_no)
                                }else{
                                    //반품 불가능
                                    self.showMsg(VCMsgData.msg.purchaseSelectNone , ["반품"]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["반품"]).voice ,"Y","Y");
                                }
                                break;
                            }else if($scope.pageUI.purchaseList.length < checkNum){
                                //반품 가능한 번호가 없음
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                                break;
                            }
                        }else if($scope.pageUI.state == "order_inquiry" && $scope.pageUI.orderState == "return" && !data.commandDate && !data.commandDayOfWeek && !data.commandMonth && !data.commandNumber && !data.commandPeriod){
                            self.showMsg(VCMsgData.msg.purchaseReturnLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseReturnLike.voice ,"Y","Y");
                            break;
                        }
                    }

                    if(command =="getOrderExchange"){
                        
                        if($scope.pageUI.state == "order_inquiry" &&  data && data.commandNumber){
                            var checkNum = data.commandNumber;
                            if($scope.pageUI.purchaseList.length >= checkNum ){
                                checkNum = checkNum -1;
                                if($scope.pageUI.purchaseList[checkNum].exchange_psb_yn == "Y"){//교환 가능 확인
                                    $scope.orderDetail($scope.pageUI.purchaseList[checkNum].ord_no)
                                }else{
                                    //교환 불가능
                                    self.showMsg(VCMsgData.msg.purchaseSelectNone , ["교환"]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["교환"]).voice ,"Y","Y");
                                }
                                break;
                            }else if($scope.pageUI.purchaseList.length < checkNum){
                                //교환 가능한 번호가 없음
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                                break;
                            }
                        }else if($scope.pageUI.state == "order_inquiry" && $scope.pageUI.orderState == "exchange" && !data.commandDate && !data.commandDayOfWeek && !data.commandMonth && !data.commandNumber && !data.commandPeriod){
                            self.showMsg(VCMsgData.msg.purchaseExchangeLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseExchangeLike.voice ,"Y","Y");
                            break;
                        }
                    }

                    if(command == "getOrderCancle"){
                        
                        if($scope.pageUI.state == "order_inquiry" &&  data && data.commandNumber){
                            var checkNum = data.commandNumber;
                            if($scope.pageUI.purchaseList.length >= checkNum ){
                                checkNum = checkNum -1;
                                if($scope.pageUI.purchaseList[checkNum].cancel_psb_yn == "Y"){//취소 가능 확인
                                    $scope.orderDetail($scope.pageUI.purchaseList[checkNum].ord_no)
                                }else{
                                    //취소 불가능
                                    self.showMsg(VCMsgData.msg.purchaseSelectNone , ["취소"]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["취소"]).voice ,"Y","Y");
                                }
                                break;
                            }else if($scope.pageUI.purchaseList.length < checkNum){
                                //취소 가능한 번호가 없음
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                                break;
                            }
                        }else if($scope.pageUI.state == "order_inquiry" && $scope.pageUI.orderState == "cancle" && !data.commandDate && !data.commandDayOfWeek && !data.commandMonth && !data.commandNumber && !data.commandPeriod){
                            self.showMsg(VCMsgData.msg.purchaseCancleLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseCancleLike.voice ,"Y","Y");
                            break;
                        }
                    }

                    if(command == "getOrderChangeOption"){
                        
                        if($scope.pageUI.state == "order_inquiry" &&  data && data.commandNumber){
                            var checkNum = data.commandNumber;
                            if($scope.pageUI.purchaseList.length >= checkNum ){
                                checkNum = checkNum -1;
                                if($scope.pageUI.purchaseList[checkNum].opt_change_psb_yn == "Y"){//옵션 변경 가능 확인
                                    $scope.orderDetail($scope.pageUI.purchaseList[checkNum].ord_no)
                                }else{
                                    //옵션 변경 불가능
                                    self.showMsg(VCMsgData.msg.purchaseSelectNone , ["옵션 변경"]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["옵션 변경"]).voice ,"Y","Y");
                                }
                                break;
                            }else if($scope.pageUI.purchaseList.length < checkNum){
                                //취소 가능한 번호가 없음
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                                break;
                            }
                        }else if($scope.pageUI.state == "order_inquiry" && $scope.pageUI.orderState == "option" && !data.commandDate && !data.commandDayOfWeek && !data.commandMonth && !data.commandNumber && !data.commandPeriod){
                            self.showMsg(VCMsgData.msg.purchaseOptionLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseOptionLike.voice ,"Y","Y");
                            break;
                        }
                    }

                    if(command == "getOrderChangeShipping"){
                        
                        if($scope.pageUI.state == "order_inquiry" &&  data && data.commandNumber){
                            var checkNum = data.commandNumber;
                            if($scope.pageUI.purchaseList.length >= checkNum ){
                                checkNum = checkNum -1;
                                if($scope.pageUI.purchaseList[checkNum].dlv_change_psb_yn == "Y"){//배송지 변경 가능 확인
                                    $scope.orderDetail($scope.pageUI.purchaseList[checkNum].ord_no)
                                }else{
                                    //배송지 변경 불가능
                                    self.showMsg(VCMsgData.msg.purchaseSelectNone , ["배송지 변경"]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseSelectNone, ["배송지 변경"]).voice ,"Y","Y");
                                }
                                break;
                            }else if($scope.pageUI.purchaseList.length < checkNum){
                                //취소 가능한 번호가 없음
                                self.showMsg(VCMsgData.msg.unknown);
                                $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                                break;
                            }
                        }else if($scope.pageUI.state == "order_inquiry" && $scope.pageUI.orderState == "delivery" && !data.commandDate && !data.commandDayOfWeek && !data.commandMonth && !data.commandNumber){
                            self.showMsg(VCMsgData.msg.purchaseDeliverLike);
                            $scope.setVCAnalysis(VCMsgData.msg.purchaseDeliverLike.voice ,"Y","Y");
                            break;
                        }
                    }
                    
                    
                    //GA 전용
                    if( !(data && data.goLogin == "goLogin") ){
                        if(command =="getOrderList"){
                            if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                                $scope.setGATag("공통_주문조회", "주문 보기", sendTxt, iptType);
                            }else{
                                $scope.setGATag("공통_주문조회", "주문 보기+날짜", sendTxt, iptType);
                            }

                        }else if(command == "getOrderInquire"){
                            if($scope.pageUI.prestate == "order_inquiry"){
                                if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                                    $scope.setGATag("음성명령어", "주문 언제와" , sendTxt, iptType);
                                }else{
                                    $scope.setGATag("음성명령어", "주문 언제와+날짜", sendTxt, iptType);
                                }
                            }else{
                                if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                                    $scope.setGATag("공통_주문조회", "주문 언제와" , sendTxt, iptType);
                                }else{
                                    $scope.setGATag("공통_주문조회", "주문 언제와+날짜", sendTxt, iptType);
                                }
                            }
                        }else if(command == "getOrderCancle"){//취소
                            if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                                $scope.setGATag("공통_주문조회", "주문 취소", sendTxt, iptType);
                            }else{
                                $scope.setGATag("공통_주문조회", "주문 취소+날짜", sendTxt, iptType);
                            }
                        }else if(command == "getOrderChangeOption"){//옵션 변경
                            if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                                $scope.setGATag("공통_주문조회", "주문 옵션변경", sendTxt, iptType);
                            }else{
                                $scope.setGATag("공통_주문조회", "주문 옵션변경+날짜", sendTxt, iptType);
                            }
                            
                        }else if(command == "getOrderChangeShipping"){//배송지 변경
                            if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                                $scope.setGATag("공통_주문조회", "주문 배송지변경", sendTxt, iptType);
                            }else{
                                $scope.setGATag("공통_주문조회", "주문 배송지변경+날짜", sendTxt, iptType);
                            }
                        }else if(command =="getOrderExchange"){//교환 가능
                            if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                                $scope.setGATag("공통_주문조회", "주문 교환", sendTxt, iptType);
                            }else{
                                $scope.setGATag("공통_주문조회", "주문 교환+날짜", sendTxt, iptType);
                            }
                        }else if(command == "getOrderReturn"){//주문 반품
                            if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                                $scope.setGATag("공통_주문조회", "주문 반품", sendTxt, iptType);
                            }else{
                                $scope.setGATag("공통_주문조회", "주문 반품+날짜", sendTxt, iptType);
                            }
                        }else if(command == "getExchangeInProgressOrder"){//교환중인
                            $scope.setGATag("공통_주문조회", "주문 교환중", sendTxt, iptType);
                        }else if(command == "getReturnInProgressOrder"){//반품중인
                            $scope.setGATag("공통_주문조회", "주문 반품중", sendTxt, iptType);
                        }else if(command == "getCancelOrder"){//취소한
                            $scope.setGATag("공통_주문조회", "주문 취소완료", sendTxt, iptType);
                        }
                    }
                    
                    if(!$scope.loginInfo.isLogin){
                        self.showMsg(VCMsgData.msg.needLogin);
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                        var vsLastDate = angular.copy(data);
                        vsLastDate.sendTxt = sendTxt;
                        vsLastDate.iptType = iptType;
                        vsLastDate.goLogin = "goLogin";
                        var vcLastCommandData =JSON.stringify(vsLastDate);
                        self.needLoginCommand(command , vcLastCommandData);
                        break;
                    }

                    $scope.pageUI.orderState = "";
                    var params = {};
                    params.vc_ord_search_gu = 1;
                    
                    if(command == "getOrderCancle"){
                        $scope.pageUI.orderState == "cancle";
                        params.vc_ord_search_gu = 3;
                    }else if(command == "getExchangeInProgressOrder"){
                        params.vc_ord_search_gu = 7;
                    }else if(command == "getReturnInProgressOrder"){
                        params.vc_ord_search_gu = 8;
                    }else if(command == "getCancelOrder"){
                        params.vc_ord_search_gu = 6;
                    }else if(command == "getOrderChangeOption"){
                        $scope.pageUI.orderState == "option";
                        params.change_type = "OPT";
                        params.vc_ord_search_gu = 2;
                    }else if(command == "getOrderChangeShipping"){
                        $scope.pageUI.orderState == "delivery";
                        params.vc_ord_search_gu = 2;
                        params.change_type = "DLV";
                    }else if(command =="getOrderExchange"){
                        $scope.pageUI.orderState = "exchange";
                        params.vc_ord_search_gu = 4;
                    }else if(command == "getOrderReturn"){
                        $scope.pageUI.orderState = "return";
                        params.vc_ord_search_gu = 5;
                    }else if(command == "getOrderList"){
                        params.vc_ord_search_gu = 1;
                    }
                    var dayName = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
                    var periodName = ["오늘","어제","이번 주","지난 주","지지난 주","한달"];
                    if(data){//기간 정의
                        if(data.commandDate !=""){//일 = 07
                            if(data.commandDate.length != 2){
                                params.date_search_val = "0" +data.commandDate;
                            } else{
                                params.date_search_val = data.commandDate;
                            }
                        }
                        if(data.commandDayOfWeek !=""){//요일 = VC5
                            angular.forEach(dayName , function(value , idx){
                                if(value == data.commandDayOfWeek){
                                    params.date_search_gu = "VC5";
                                    params.day_search_val = idx + 1;

                                }
                            });
                        }
                        if(data.commandPeriod !=""){//오늘,어제,이번 주 등 기간 
                            angular.forEach(periodName , function(value , idx){
                                if(value == data.commandPeriod){
                                    params.date_search_gu = "VC" + idx;
                                }
                            });
                        }
                        if(data.commandMonth !=""){
                            if(data.commandMonth.length != 2){
                                params.date_search_val =  "0" + data.commandMonth + params.date_search_val;
                            }else{
                                params.date_search_val =  data.commandMonth + params.date_search_val;
                            }
                        }
                       
                    }else{
                        params.date_search_gu = "VC6";
                    }
                    $scope.pageLoading = true; // 로딩바
                    
                    VCPurchaseInfo.getPurchaseList(params)
                    .then(function (purchaseList) {
                    	self.changeState("order_inquiry");
                        if (purchaseList && purchaseList.length > 0) {
                            $scope.pageUI.purchaseList = purchaseList;
                            if(command =="getOrderList"){
                                if(!data.commandDate && !data.commandDayOfWeek && !data.commandPeriod && !data.commandMonth){
                                    self.showMsg(VCMsgData.msg.purchaseDefaultShow);
                                    $scope.setVCAnalysis(VCMsgData.msg.purchaseDefaultShow.voice ,"Y","Y");
                                }else{

                                    var resultDateMsg = "";
                                    if(data.commandDate){
                                        resultDateMsg = data.commandDate + "일, " + dayName[new Date($filter('strToDate5')($scope.pageUI.purchaseList[0].ord_date)).getDay()] + "에";
                                    }
                                    if(data.commandDayOfWeek){
                                        resultDateMsg = data.commandDayOfWeek + "에";
                                    }
                                    if(data.commandPeriod){
                                        resultDateMsg = data.commandPeriod;
                                    }
                                    if(data.commandMonth){
                                        resultDateMsg = data.commandMonth + "월 " + resultDateMsg;
                                    }
                                    self.showMsg(VCMsgData.msg.purchaseShow , [resultDateMsg]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseShow, [resultDateMsg]).voice ,"Y","Y" );
                                }
                            }else if(command == "getOrderInquire"){
                                
                                if($scope.pageUI.purchaseList[0].send_due_date){
                                    if($scope.pageUI.purchaseList[0].ord_step_str == "발송완료"){
                                        self.showMsg(VCMsgData.getMsgData($scope.pageUI.purchaseList[0].ord_step_msg,$scope.pageUI.purchaseList[0].ord_step_msg,"top"));
                                        $scope.setVCAnalysis($scope.pageUI.purchaseList[0].ord_step_msg ,"Y","Y");
                                    }else{
                                        self.showMsg(VCMsgData.getMsgData($scope.pageUI.purchaseList[0].send_due_date + $scope.pageUI.purchaseList[0].send_due_word,$scope.pageUI.purchaseList[0].send_due_date + $scope.pageUI.purchaseList[0].send_due_word,"top"));
                                        $scope.setVCAnalysis($scope.pageUI.purchaseList[0].send_due_date + $scope.pageUI.purchaseList[0].send_due_word ,"Y","Y");
                                    }
                                }else if($scope.pageUI.purchaseList[0].ord_step_msg){
                                    if($scope.pageUI.purchaseList[0].ord_dtl_stat_cd == "17" && $scope.pageUI.purchaseList[0].ord_step_msg.search($scope.pageUI.purchaseList[0].inv_no) > 0){
                                        if( $scope.pageUI.purchaseList[0].ord_step_str == "발송완료"){
                                            self.showMsg(VCMsgData.msg.purchaseSendShowTop); 
                                            $scope.setVCAnalysis(VCMsgData.msg.purchaseSendShowTop.voice ,"Y","Y");
                                        }else if($scope.pageUI.purchaseList[0].ord_step_str == "배송완료"){
                                            self.showMsg(VCMsgData.msg.purchaseSendShowSendedTop);
                                            $scope.setVCAnalysis(VCMsgData.msg.purchaseSendShowSendedTop.voice ,"Y","Y");
                                        }else{
                                            self.showMsg(VCMsgData.msg.purchaseSendShowTop);
                                            $scope.setVCAnalysis(VCMsgData.msg.purchaseSendShowTop.voice ,"Y","Y");
                                        }
                                    }else{
                                        self.showMsg(VCMsgData.getMsgData($scope.pageUI.purchaseList[0].ord_step_msg,$scope.pageUI.purchaseList[0].ord_step_msg,"top"));
                                        $scope.setVCAnalysis($scope.pageUI.purchaseList[0].ord_step_msg ,"Y","Y");
                                    }
                                }else {
                                    self.showMsg(VCMsgData.msg.purchaseNameShow , [$scope.loginInfo.name]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseNameShow, [$scope.loginInfo.name]).voice ,"Y","Y" );
                                }
                            }else if(command == "getOrderCancle"){//취소
                                self.showMsg(VCMsgData.msg.purchaseExecShow,["주문취소가 "]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecShow, ["주문취소가 "]).voice ,"Y","Y" );
                            }else if(command == "getOrderChangeOption"){//옵션 변경
                                self.showMsg(VCMsgData.msg.purchaseExecShow,["옵션변경 "]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecShow, ["옵션변경 "]).voice ,"Y","Y" );
                            }else if(command == "getOrderChangeShipping"){//배송지 변경
                                self.showMsg(VCMsgData.msg.purchaseExecShow,["배송지 변경 "]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecShow, ["배송지 변경 "]).voice ,"Y","Y" );
                            }else if(command =="getOrderExchange"){//교환 가능
                                self.showMsg(VCMsgData.msg.purchaseExecShow,["교환"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecShow, ["교환"]).voice ,"Y","Y" );
                            }else if(command == "getOrderReturn"){//주문 반품
                                self.showMsg(VCMsgData.msg.purchaseExecShow,["반품"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecShow, ["반품"]).voice ,"Y","Y" );
                            }else if(command == "getExchangeInProgressOrder"){//교환중인
                                self.showMsg(VCMsgData.msg.purchaseDoingShow , ["교환","교환"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseDoingShow, ["교환","교환"]).voice ,"Y","Y" );
                            }else if(command == "getReturnInProgressOrder"){//반품중인
                                self.showMsg(VCMsgData.msg.purchaseDoingShow , ["반품","반품"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseDoingShow, ["반품","반품"]).voice ,"Y","Y" );
                            }else if(command == "getCancelOrder"){//취소한
                                self.showMsg(VCMsgData.msg.purchaseCancleShow);
                                $scope.setVCAnalysis(VCMsgData.msg.purchaseCancleShow.voice ,"Y","Y");
                            }
                        } else { // 주문내역 없을 때
                            $scope.pageUI.orderState = "";
                            $scope.pageUI.purchaseList = [];
                            if(command =="getOrderList" || command == "getOrderInquire"){
                            	$scope.setGATag("주문배송조회결과없음", "주문 보기 없음", sendTxt, iptType);
                                self.showMsg(VCMsgData.msg.purchaseNone);
                                $scope.setVCAnalysis(VCMsgData.msg.purchaseNone.voice ,"Y","Y");
                                $scope.soundEndData = VCMsgData.msg.purchaseNoneQnaYn
                            }else if(command == "getOrderCancle"){
                                self.showMsg(VCMsgData.msg.purchaseExecNoneHome ,["주문취소 "]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecNoneHome, ["주문취소 "]).voice ,"Y","Y" );
                                $scope.setGATag("주문배송조회결과없음", "주문 취소 없음", sendTxt, iptType);
                            }else if(command == "getOrderChangeOption"){//옵션 변경
                                self.showMsg(VCMsgData.msg.purchaseExecNoneHome ,["옵션변경"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecNoneHome, ["옵션변경"]).voice ,"Y","Y" );
                                $scope.setGATag("주문배송조회결과없음", "주문 옵션변경 없음", sendTxt, iptType);
                            }else if(command == "getOrderChangeShipping"){//배송지 변경
                                self.showMsg(VCMsgData.msg.purchaseExecNoneHome ,["배송지 변경"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecNoneHome, ["배송지 변경"]).voice ,"Y","Y" );
                                $scope.setGATag("주문배송조회결과없음", "주문 배송지 변경 없음", sendTxt, iptType);
                            }else if(command =="getOrderExchange"){//교환 가능
                                self.showMsg(VCMsgData.msg.purchaseExecNoneHome,["교환"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecNoneHome, ["교환"]).voice ,"Y","Y" );
                                $scope.setGATag("주문배송조회결과없음", "주문 교환 없음", sendTxt, iptType);
                            }else if(command == "getOrderReturn"){//주문 반품
                                self.showMsg(VCMsgData.msg.purchaseExecNoneHome,["반품"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseExecNoneHome, ["반품"]).voice ,"Y","Y" );
                                $scope.setGATag("주문배송조회결과없음", "주문 반품 없음", sendTxt, iptType);
                            }else if(command == "getExchangeInProgressOrder"){//교환중인
                                self.showMsg(VCMsgData.msg.purchaseDoingNone , ["교환","교환"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseDoingNone, ["교환","교환"]).voice ,"Y","Y" );
                                $scope.setGATag("주문배송조회결과없음", "주문 교환중 없음", sendTxt, iptType);
                            }else if(command == "getReturnInProgressOrder"){//반품중인
                                self.showMsg(VCMsgData.msg.purchaseDoingNone , ["반품","반품"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.purchaseDoingNone, ["반품","반품"]).voice ,"Y","Y" );
                                $scope.setGATag("주문배송조회결과없음", "주문 반품중 없음", sendTxt, iptType);
                            }else if(command == "getCancelOrder"){//취소한
                                self.showMsg(VCMsgData.msg.purchaseCancleNone);
                                $scope.setVCAnalysis(VCMsgData.msg.purchaseCancleNone.voice ,"Y","Y");
                                $scope.setGATag("주문배송조회결과없음", "주문 취소완료 없음", sendTxt, iptType);
                            }
                            
                        }
                    })
                    .catch(function () {
                        console.error("주문내역 정보 로드 오류");
                        self.showMsg(VCMsgData.msg.networkError);
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    
                    
                    break;
                case "getCouponHowToUse": //쿠폰이용방법
                    self.changeState("home" ,null,true);
                    self.showMsg(VCMsgData.msg.couponHowToUse);
                    $scope.setVCAnalysis(VCMsgData.msg.couponHowToUse.voice ,"Y","Y");
                    $scope.setGATag("공통_이벤트", "쿠폰 이용방법", sendTxt, iptType);
                    break;
                case "getCoupon": //쿠폰
                	
                	if( !(data && data.goLogin == "goLogin") ){
                		$scope.setGATag("공통_이벤트", "쿠폰 보기", sendTxt, iptType);
                	}
                	
                    if(!$scope.loginInfo.isLogin){
                        self.showMsg(VCMsgData.msg.needLogin);
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                        var vsLastDate = angular.copy(data);
                        vsLastDate.sendTxt = sendTxt;
                        vsLastDate.iptType = iptType;
                        vsLastDate.goLogin = "goLogin";
                        var vcLastCommandData =JSON.stringify(vsLastDate);
                        self.needLoginCommand(command , vcLastCommandData);
                        break;
                    }

                    $scope.pageLoading = true; // 로딩바
                    VCCouponInfo.getCouponList()
                    .then(function (couponData) {
                        self.changeState("coupon");
                        if (couponData.coupondownlist && couponData.coupondownlist.items && couponData.coupondownlist.items.length > 0) {
                            $scope.pageUI.couponListInfo = couponData.coupondownlist.items; 
                            self.showMsg(VCMsgData.msg.couponShow,[$scope.pageUI.couponListInfo.length]);
                            $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.couponShow, [$scope.pageUI.couponListInfo.length]).voice ,"Y","Y" ); 
                        } else { // 쿠폰 리스트 없을 때
                            $scope.pageUI.couponListInfo = [];
                            self.showMsg(VCMsgData.msg.couponNone);
                            $scope.setVCAnalysis(VCMsgData.msg.couponNone.voice ,"Y","Y");
                            console.error("쿠폰 정보 없음");
                        }

                        //절친쿠폰 or 멤버십쿠폰 다운려부가 N 경우 질의 메시지 구현
                        var couponDownCheck = false;
                        if(couponData.couponzonelist.mbrDownYn == "N"){
                            couponDownCheck = true;
                        }

                        var checkCouponList = couponData.couponzonelist.items;
                        for(var i=0; i<checkCouponList.length; i++){
                            if(checkCouponList[i].cpnDownYn == "N"){
                                couponDownCheck = true;
                            }
                        }
                        couponDownCheck ? $scope.soundEndData = VCMsgData.msg.couponDown : '';
                        
                        if(couponDownCheck){
                        	$scope.setGATag("샬롯질의", "쿠폰동의메시지노출", null, null)
                        }
                    })
                    .catch(function () {
                        self.showMsg(VCMsgData.msg.networkError);
                        $scope.setVCAnalysis(VCMsgData.msg.networkError.voice ,"Y","Y");
                        console.error("쿠폰 정보 로드 오류");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    
                    break;
                case "getOrderECouponResend": //E쿠폰 재발송
                    self.showMsg(VCMsgData.msg.unknown);
                    $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                    $scope.setGATag("음성명령어", "재발송해줘", sendTxt, iptType);
                    break;
                case "getPoint": //포인트 보기
                case "getLPoint": //엘포인트 보기
                case "getLMoney": //엘머니 보기
                case "getDeposit": //보관금 보기
                case "getClover": //클로버 보기

                    $scope.pageLoading = true; // 로딩바
                    var params = {};
                    
                    if(command == "getPoint"){
                        params.pointType = "point";
                    }else if(command == "getLPoint"){
                        params.pointType = "lpoint";
                    }else if(command == "getLMoney"){
                        params.pointType = "lmoney";
                    }else if(command == "getDeposit"){
                        params.pointType = "deposit";
                    }else if(command == "getClover"){
                        params.pointType = "clover";
                    }
                    
                    //GA 전용
                    if( !(data && data.goLogin == "goLogin") ){
	                    if(params.pointType == "point"){ //포인트
	                		$scope.setGATag("공통_이벤트", "포인트 보기", sendTxt, iptType);
	                	}else if(command == "getLPoint"){ //L.point 
	                		$scope.setGATag("공통_이벤트", "포인트_엘포인트 보기", sendTxt);
	                    }else if(command == "getLMoney"){ //L.money
	                    	$scope.setGATag("공통_이벤트", "포인트_엘머니 보기", sendTxt, iptType);
	                    }else if(command == "getDeposit"){ //보관금
	                    	$scope.setGATag("공통_이벤트", "포인트_보관금 보기", sendTxt, iptType);
	                    }else if(command == "getClover"){ //클로버
	                        $scope.setGATag("공통_이벤트", "포인트_클로버 보기", sendTxt, iptType);
	                    }
                    }
                	
                    if(!$scope.loginInfo.isLogin){
                        self.showMsg(VCMsgData.msg.needLogin);
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                        var vsLastDate = angular.copy(data);
                        vsLastDate.sendTxt = sendTxt;
                        vsLastDate.iptType = iptType;
                        vsLastDate.goLogin = "goLogin";
                        var vcLastCommandData =JSON.stringify(vsLastDate);
                        self.needLoginCommand(command , vcLastCommandData);
                        break;
                    }

                    VCPointCloverInfo.getPointCloverList(params)
                    
                    .then(function (cloverData) {
                        self.changeState("point");
                        
                        $scope.pageUI.pointCloverListInfo = $filter('findItemAndGetFront')(cloverData,"pointType",params.pointType);
                    	
                    	var lpointcount;
                    	var lmoneycount;
                    	var depositcount;
                    	var clovercount;
                    	
                    	for(var i=0; i < cloverData.length; i++) {
                    		if(cloverData[i].pointType == "lpoint"){
                    			lpointcount = cloverData[i].pointcount;
                    		}else if(cloverData[i].pointType == "lmoney"){
                    			lmoneycount = cloverData[i].pointcount;
                    		}else if(cloverData[i].pointType == "deposit"){
                    			depositcount = cloverData[i].pointcount;
                    		}else if(cloverData[i].pointType == "clover"){
                    			clovercount = cloverData[i].pointcount;
                    		}
                    	}
                    	
                        if(params.pointType == "point"){ //포인트
                            if(lpointcount == 0 && lmoneycount == 0 && depositcount == 0 && clovercount == 0){
                                self.showMsg(VCMsgData.msg.pointCloverNone , ["포인트가"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.pointCloverNone, ["포인트가"]).voice ,"Y","Y" ); 
                            }else{
                                self.showMsg(VCMsgData.getMsgData(VCMsgData.getMsgRepeatPoint($scope.pageUI.pointCloverListInfo) ,VCMsgData.getMsgRepeatPoint($scope.pageUI.pointCloverListInfo) , "top"));
                                $scope.setVCAnalysis(VCMsgData.getMsgRepeatPoint($scope.pageUI.pointCloverListInfo) ,"Y","Y");
                            }
                    	}else if(command == "getLPoint"){ //L.point 
                            //상단 노출 문구
                            if(lpointcount){
                                self.showMsg(VCMsgData.msg.pointShow,["엘포인트",lpointcount]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.pointShow, ["엘포인트",lpointcount]).voice ,"Y","Y" );
                            }else{
                                self.showMsg(VCMsgData.msg.pointCloverNone , ["엘포인트가"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.pointCloverNone, ["엘포인트가"]).voice ,"Y","Y" );
                            }
                        }else if(command == "getLMoney"){ //L.money
                            //상단 노출 문구
                            if(lmoneycount){
                                self.showMsg(VCMsgData.msg.pointShow,["엘머니",lmoneycount]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.pointShow, ["엘머니",lmoneycount]).voice ,"Y","Y" );
                            }else{
                                self.showMsg(VCMsgData.msg.pointCloverNone , ["엘머니가"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.pointCloverNone, ["엘머니가"]).voice ,"Y","Y" );
                            }
                        }else if(command == "getDeposit"){ //보관금
                            //상단 노출 문구
                            if(depositcount){
                                self.showMsg(VCMsgData.msg.pointShow,["보관금",depositcount]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.pointShow, ["보관금",depositcount]).voice ,"Y","Y" );
                            }else{
                                self.showMsg(VCMsgData.msg.pointCloverNone , ["보관금이"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.pointCloverNone, ["보관금이"]).voice ,"Y","Y" );
                            }
                        }else if(command == "getClover"){ //클로버
                            if(clovercount){
                                //상단 노출 문구
                                if(clovercount < 1000){ //1,000개 이하
                                    self.showMsg(VCMsgData.msg.cloverShowUnder,[clovercount]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.cloverShowUnder, [clovercount]).voice ,"Y","Y" );
                                }else if(clovercount > 999 && clovercount < 10000){ //1,000개이상 10,000개이하
                                    self.showMsg(VCMsgData.msg.cloverShowOver,[clovercount]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.cloverShowOver, [clovercount]).voice ,"Y","Y" );
                                } else if(clovercount > 9999){//10,000개이상
                                    self.showMsg(VCMsgData.msg.cloverShowMil,[clovercount]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.cloverShowMil, [clovercount]).voice ,"Y","Y" );
                                }

                                if(clovercount > 999 && clovercount < 10000){ //1,000개이상 10,000개이하
                                    $scope.soundEndData = VCMsgData.msg.useCloverShow;
                                    $scope.setVCAnalysis(VCMsgData.msg.useCloverShow.voice ,"Y","Y");
                                    $scope.setGATag("샬롯질의", "클로버동의메시지노출", sendTxt, iptType);
                                }else if(clovercount > 9999){//10,000개이상
                                    $scope.soundEndData = VCMsgData.msg.useCloverShowMil;
                                    $scope.setVCAnalysis(VCMsgData.msg.useCloverShowMil.voice ,"Y","Y");
                                    $scope.setGATag("샬롯질의", "클로버동의메시지노출", sendTxt, iptType);
                                }
                            }else{
                                self.showMsg(VCMsgData.msg.pointCloverNone , ["클로버가"]);
                                $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.pointCloverNone, ["클로버가"]).voice ,"Y","Y" );
                            }

                        }

                    })
                    .catch(function () {
                        self.showMsg(VCMsgData.msg.networkError);
                        $scope.setVCAnalysis(VCMsgData.msg.networkError.voice ,"Y","Y");
                        console.error("포인트 정보 로드 오류");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    
                    break;
                case "getEventApplicationDetail": //이벤트 응모내역
                	
                	if( !(data && data.goLogin == "goLogin") ){
                		$scope.setGATag("공통_이벤트", "이벤트 응모내역보기", sendTxt, iptType);
                	}
                	
                    if(!$scope.loginInfo.isLogin){
                        self.showMsg(VCMsgData.msg.needLogin);
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                        var vsLastDate = angular.copy(data);
                        vsLastDate.sendTxt = sendTxt;
                        vsLastDate.iptType = iptType;
                        vsLastDate.goLogin = "goLogin";
                        var vcLastCommandData =JSON.stringify(vsLastDate);
                        self.needLoginCommand(command , vcLastCommandData);
                        break;
                    };
                    
                    var params = {};
                    params.pageIdx = $scope.pageUI.curPage;

                    $scope.pageLoading = true; // 로딩바
                    VCEventInfo.getEventApplyList(params)
                    .then(function (eventApplyList) {
                        self.changeState("event_application_details");
                        if($scope.pageUI.isChangeCommandState){
                            $scope.pageUI.eventApplyInfo = eventApplyList.items;
                        }else{
                            $scope.pageUI.eventApplyInfo = $scope.pageUI.eventApplyInfo.concat(eventApplyList.items);
                            angular.element($window).scrollTop($scope.pageUI.eventApplyInfoScrollTop);
                        }
                        
                        $scope.pageUI.eventApplyInfoTotal = eventApplyList.total_count;
                        
                        if($scope.pageUI.eventApplyInfo.length > 0){
                            //스크롤 이벤트 등록
                            angular.element($window).on("scroll.eventDetail", function(){
                                if($scope.pageLoading || $scope.pageUI.eventApplyInfo.length > $scope.pageUI.eventApplyInfoTotal){
                                    angular.element($window).off("scroll.eventDetail");
                                    return; 
                                }

                                var $win = angular.element($window),
                                $body = angular.element("body"),
                                winH = $win.height(),
                                bodyH = $body[0].scrollHeight;
                                if($win.scrollTop() + winH >= bodyH - (winH + winH/10)){
                                    
                                    $scope.listClickState = true;
                                    $scope.pageUI.curPage = $scope.pageUI.curPage +1;
                                    $scope.pageUI.eventApplyInfoScrollTop = $win.scrollTop();
                                    self.commandExec("getEventApplicationDetail");
                                }
                            });
                            if($scope.pageUI.curPage == 1){
                                self.showMsg(VCMsgData.msg.eventApplyShow);
                                $scope.setVCAnalysis(VCMsgData.msg.eventApplyShow.voice ,"Y","Y");
                            }
                        }else{
                            self.showMsg(VCMsgData.msg.eventApplyShowNone);
                            $scope.setVCAnalysis(VCMsgData.msg.eventApplyShowNone.voice ,"Y","Y");
                        }
                        

                    })
                    .catch(function () {
                        self.showMsg(VCMsgData.msg.networkError);
                        $scope.setVCAnalysis(VCMsgData.msg.networkError.voice ,"Y","Y");
                        console.error("이벤트 응모내역 로드 오류");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    break;
                case "getEvent": //이벤트
                    
                    var params = {};
                    if($scope.loginInfo.isLogin){
                        params.age = $scope.loginInfo.mbrAge ?  $scope.loginInfo.mbrAge : "";
                        params.gender = $scope.loginInfo.genSctCd ?  $scope.loginInfo.genSctCd : "";
                    };

                    $scope.pageLoading = true; // 로딩바
                    
                    if($scope.pageUI.stateSelectorViewInfo){
                    	if(iptType == "click"){
                    		$scope.setGATag("키워드", "이벤트", null, iptType);
                    	}else{
                    		$scope.setGATag("키워드", "이벤트", sendTxt, iptType);
                    	}   
                    }else{
                    	$scope.setGATag("공통_이벤트", "이벤트 보기", sendTxt, iptType);
                    }
                    VCEventInfo.getEventList(params)
                    .then(function (eventList) {
                        self.changeState("event");
                        $scope.pageUI.eventListInfo = eventList;
                        if($scope.pageUI.eventListInfo.length){
                            self.showMsg(VCMsgData.msg.eventShow);
                            $scope.setVCAnalysis(VCMsgData.msg.eventShow.voice ,"Y","Y");
                        }else{
                            self.showMsg(VCMsgData.msg.eventNone);
                            $scope.setVCAnalysis(VCMsgData.msg.eventNone.voice ,"Y","Y");
                        }
                    })
                    .catch(function () {
                        self.showMsg(VCMsgData.msg.networkError);
                        $scope.setVCAnalysis(VCMsgData.msg.networkError.voice ,"Y","Y");
                        console.error("이벤트 로드 오류");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    break;
                case "actionApply": //신청(신청이 구매사은만 되서 구매사은 모두 신청 으로 사용)
                case "getPurchaseGiftApply": //구매사은 모두 신청
                	
                	//GA용
                	if( !(data && data.goLogin == "goLogin") ){ 
	                	if(command == "actionApply" || command == "getPurchaseGiftApply"){
	                		if($scope.pageUI.state == "purchase_gift"){
	                			$scope.setGATag("구매사은진행중", "신청해줘", sendTxt, iptType);
	                		}else{
	                			$scope.setGATag("공통_이벤트", "구매사은 신청해줘", sendTxt, iptType);
	                		}
	                	}
                	}
                
                    if(!$scope.loginInfo.isLogin){
                        self.showMsg(VCMsgData.msg.needLogin);
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                        var vsLastDate = angular.copy(data);
                        vsLastDate.sendTxt = sendTxt;
                        vsLastDate.iptType = iptType;
                        vsLastDate.goLogin = "goLogin";
                        var vcLastCommandData =JSON.stringify(vsLastDate);
                        self.needLoginCommand(command , vcLastCommandData);
                        break;
                    };
                    
                    if($scope.pageUI.saunListInfoMyType && ($scope.pageUI.saunListInfoMyType == "myList" || $scope.pageUI.saunListInfoMyType == "noGift")){
                        //self.showMsg(VCMsgData.msg.unknown);
                        console.log("구매사은 신청 불가 페이지")
                        break;
                    }

                    $scope.pageSaunLoading = true; // 로딩바
                    VCSaunInfo.registeSaunAll()
                    .then(function (result) {
                        if($scope.pageSaunLoading){
                            if (result.reg_cnt > 0) {
                                // 신청가능한 구매사은 이벤트는 n개이며, 모두 신청 완료되었어요.
                                self.commandExec("getAppliedPurchaseGift" ,{'applyCount':result.reg_cnt});
                                $scope.setGATag("구매사은진행중", "신청완료", sendTxt, iptType, "purchase_gift");
                            } else {
                                // 신청가능한 이벤트가 없어요
                                $scope.pageUI.saunListInfoMyType = "noGift";
                                self.changeState("purchase_gift");
                                $scope.pageUI.saunListInfo = [];
                                self.showMsg(VCMsgData.msg.saunAllApplyNone);
                                $scope.setGATag("구매사은진행중", "신청불가", sendTxt, iptType, "purchase_gift");
                                $scope.setVCAnalysis(VCMsgData.msg.saunAllApplyNone.voice ,"Y","Y");
                            }
                            
                        }
                    })
                    .catch(function () {
                        console.error("구매사은 이벤트 신청 로드 오류");
                        self.showMsg(VCMsgData.msg.networkError);
                        $scope.setVCAnalysis(VCMsgData.msg.networkError.voice ,"Y","Y");
                    })
                    .finally(function () {
                        $scope.pageSaunLoading = false; // 로딩바
                    });
                    
                    break;
                case "getPurchaseGiftInformation": //신청한 구매사은 지급,적립
                case "getAppliedPurchaseGift": //신청한 구매사은
                case "getPurchaseGift": //구매사은 이벤트
                	
                	
                	//GA전용
                	if( !(data && data.goLogin == "goLogin") ){
	                	if(command == "getAppliedPurchaseGift"){ //신청한 리스트
	                    	$scope.setGATag("공통_이벤트", "구매사은 신청내역보기", sendTxt, iptType);
	                    }else if(command =="getPurchaseGiftInformation"){
	                    	$scope.setGATag("공통_이벤트", "구매사은 포인트 지급일", sendTxt, iptType);
	                    }
                	}
                    
                    //일반 조회는 로그인 필요없음
                    if((command == "getAppliedPurchaseGift" || command == "getPurchaseGiftInformation" ) && !$scope.loginInfo.isLogin){
                        self.showMsg(VCMsgData.msg.needLogin);
                        $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                        var vsLastDate = angular.copy(data);
                        vsLastDate.sendTxt = sendTxt;
                        vsLastDate.iptType = iptType;
                        vsLastDate.goLogin = "goLogin";
                        var vcLastCommandData =JSON.stringify(vsLastDate);
                        self.needLoginCommand(command , vcLastCommandData);
                        break;
                    }

                    var params = {};
                    if(command == "getPurchaseGift"){
                        params.listType = "saun_list"; //일반 조회
                        if($scope.pageUI.stateSelectorViewInfo){
                        	if(iptType == "click"){
                        		$scope.setGATag("키워드", "구매사은", null, iptType);
                        	}else{
                        		$scope.setGATag("키워드", "구매사은", sendTxt, iptType);
                        	}
                        }else{
                        	$scope.setGATag("공통_이벤트", "구매사은 보기", sendTxt, iptType);
                        }
                    }else if(command == "getPurchaseGiftInformation"){
                        params.listType = "mysaun_list"; //신청한 구매사은 지급,적립
                    }else if(command == "getAppliedPurchaseGift"){
                        params.listType = "mysaun_list"; //신청한 이벤트 조회
                    }
                    
                    $scope.pageLoading = true; // 로딩바
                    VCSaunInfo.getSaunList(params)
                    .then(function (saunList) {
                    	self.changeState("purchase_gift");
                        if(command == "getPurchaseGift"){ //리스트, 
                            $scope.pageUI.saunListInfoMyType = "list";
                        }else if(command == "getAppliedPurchaseGift"){ //신청한 리스트
                            $scope.pageUI.saunListInfoMyType = "myList";
                        }else if(command =="getPurchaseGiftInformation"){//지급,적립 리스트 
                            $scope.pageUI.saunListInfoMyType = "myList";
                        }

                        $scope.pageUI.saunListInfo = saunList;
                        if(command == "getPurchaseGift"){ //리스트,
                            if (saunList && saunList.length > 0) {
                                self.showMsg(VCMsgData.msg.saunShow)
                                $scope.setVCAnalysis(VCMsgData.msg.saunShow.voice ,"Y","Y");
                            } else { // 구매사은 이벤트 리스트 없을 때
                                console.error("구매사은 이벤트 정보 없음");
                                self.showMsg(VCMsgData.msg.saunNone);
                                $scope.setVCAnalysis(VCMsgData.msg.saunNone.voice ,"Y","Y");
                            }
                        }else if(command == "getAppliedPurchaseGift"){ //신청한 리스트
                            if (saunList && saunList.length > 0) {
                                if(data && data.applyCount){//모두신청하기 결과 메세지
                                    self.showMsg(VCMsgData.msg.saunAllApply,[data.applyCount]);
                                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.saunAllApply, [data.applyCount]).voice ,"Y","Y" );
                                }else{
                                    self.showMsg(VCMsgData.msg.saunMyShow)
                                    $scope.setVCAnalysis(VCMsgData.msg.saunMyShow.voice ,"Y","Y");
                                }
                            } else { // 구매사은 이벤트 리스트 없을 때
                                console.error("신청한 구매사은 이벤트 정보 없음");
                                self.showMsg(VCMsgData.msg.saunMyNone);
                                $scope.setVCAnalysis(VCMsgData.msg.saunMyNone.voice ,"Y","Y");
                            }
                        }else if(command =="getPurchaseGiftInformation"){
                            if (saunList && saunList.length > 0) {
                                var informationMsg = "";
                                var informationVoiceMsg = "";
                                var inforListData = saunList[0];
                                
                                if(inforListData.eventStatus == "002" || inforListData.eventStatus == "003"){
                                    informationMsg = "신청하신 "+inforListData.evtNm+" 구매사은 이벤트의 지급일은 "+ $filter('strToDate4')(inforListData.pmgSndDt) +"입니다.";
                                    informationVoiceMsg = "신청하신 이벤트의 지급일은 "+ $filter('strToDate4')(inforListData.pmgSndDt) +"입니다.";
                                    self.showMsg(VCMsgData.getMsgData(informationMsg, informationVoiceMsg, "top"));
                                    $scope.setVCAnalysis(informationVoiceMsg ,"Y","Y");
                                    
                                }else if(inforListData.eventStatus == "004" || inforListData.eventStatus == "005" || inforListData.eventStatus == "006"){
                                    informationMsg = "신청하신 "+inforListData.evtNm +" 구매사은 이벤트는 "+ $filter('strToDate4')(inforListData.pmgSndDt) +" 지급 준비 중입니다. 조금만 기다려주세요";
                                    informationVoiceMsg = "신청하신 이벤트는 "+ $filter('strToDate4')(inforListData.pmgSndDt) +" 지급 준비 중입니다. 조금만 기다려주세요.";
                                    self.showMsg(VCMsgData.getMsgData(informationMsg, informationVoiceMsg, "top"));
                                    $scope.setVCAnalysis(informationVoiceMsg ,"Y","Y");
                                    
                                }else if(inforListData.eventStatus == "007" || inforListData.eventStatus == "008"){
                                    informationMsg = inforListData.evtNm+" 구매사은 이벤트는 "+ $filter('strToDate4')(inforListData.pmgSndDt) +" 지급완료 되었습니다.";
                                    informationVoiceMsg = "이벤트는 "+ $filter('strToDate4')(inforListData.pmgSndDt) +" 지급완료 되었습니다.";
                                    self.showMsg(VCMsgData.getMsgData(informationMsg, informationVoiceMsg, "top"));
                                    $scope.setVCAnalysis(informationVoiceMsg ,"Y","Y");
                                }
                            } else { // 구매사은 이벤트 리스트 없을 때
                                console.error("신청한 구매사은 이벤트 정보 없음");
                                self.showMsg(VCMsgData.msg.saunMyNone);
                                $scope.setVCAnalysis(VCMsgData.msg.saunMyNone.voice ,"Y","Y");
                            }
                        }
                    })
                    .catch(function () {
                        self.showMsg(VCMsgData.msg.networkError);
                        $scope.setVCAnalysis(VCMsgData.msg.networkError.voice ,"Y","Y");
                        console.error("구매사은 이벤트 정보 로드 오류");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    
                    break;
                case "getDiscount": //청구할인
                case "getInProgressInterestFreeInstallment": //진행중인 무이자할부
                case "getInterestFreeInstallment": //{카드} 무이자할부
                    //data.commandCard : 카드명
                    $scope.pageLoading = true; // 로딩바
                    var params = {};
                    if(command == "getDiscount"){
                        params.searchType = "D"; // D 청구할인
                        if($scope.loginInfo.isLogin && $scope.basicInfo.member_info.acqr_cd){
                            params.acgrCd = $scope.basicInfo.member_info.acqr_cd;
                            params.userCard = true; // 유저카드 조회 상태
                        }
                        if(data.commandCard){
                            if($scope.pageUI.stateSelectorViewInfo){
                            	$scope.setGATag("키워드", "청구할인 카드보기", sendTxt, iptType);
                            }else{
                            	$scope.setGATag("공통_이벤트", "청구할인 카드보기", sendTxt, iptType);
                            }
                        }else {
	                        if($scope.pageUI.stateSelectorViewInfo){
	                        	if(iptType == "click"){
	                        		$scope.setGATag("키워드", "청구할인", null, iptType);
	                        	}else{
	                        		$scope.setGATag("키워드", "청구할인", sendTxt, iptType);;
	                        	}
	                        }else{
	                        	$scope.setGATag("공통_이벤트", "청구할인 보기", sendTxt, iptType);
	                        }
                        }
                    }else if(command == "getInProgressInterestFreeInstallment" || command == "getInterestFreeInstallment"){
                        params.searchType = "C"; // C : 무이자 할부
                    }

                    if(data && data.commandCard){
                        params.userCard = false;
                    }

                    VCSaleInfo.getSaleList(params)
                    .then(function (saleList) {
                        if (saleList && saleList.length > 0) {
                            var saleMsgData;
                            var userCardName;
                            var userName;
                            

                            if(command == "getDiscount" && data.commandCard){
                                $scope.pageUI.saleListInfo = VCSaleInfo.getCardList(data.commandCard) //카드값에 의한 정렬
                            }else{
                                $scope.pageUI.saleListInfo = saleList;
                            }

                            if(command == "getDiscount"){ //청구할인
                                self.changeState("billing_discount");
                                if(params.userCard){//로그인 유저 등록카드 조회
                                    if(VCSaleInfo.getCardList(params.acgrCd).length > 0){//유저 등록카드와 매칭 된 경우
                                        //유저 카드 이름 조회
                                        angular.forEach($scope.pageUI.saleCardInfo,function(value,key){
                                            if(key == params.acgrCd){
                                                userCardName = value.name;
                                            }
                                        });
                                        userName = $scope.basicInfo.greeting_info.user_nm;
                                        saleMsgData = VCMsgData.getMsgData(
                                            VCMsgData.getMsgRepeatDiscountDataLogin($scope.pageUI.saleListInfo,params.acgrCd,userCardName,userName,false) ,
                                            VCMsgData.getMsgRepeatDiscountDataLogin($scope.pageUI.saleListInfo,params.acgrCd,userCardName,userName,true) , 
                                            "top"
                                        );
                                    }else{//유저 등록카드 매칭 없음
                                        $scope.pageUI.saleListInfo = saleList;
                                        saleMsgData = VCMsgData.getMsgData(
                                            VCMsgData.getMsgRepeatDiscountData($scope.pageUI.saleListInfo) ,
                                            VCMsgData.getMsgRepeatDiscountData($scope.pageUI.saleListInfo,false,false,true) , 
                                            "top"
                                        );
                                    }
                                }else if(data.commandCard){ //특정 카드 조회
                                    angular.forEach($scope.pageUI.saleCardInfo,function(value,key){
                                        if(key == data.commandCard){
                                            userCardName = value.name;
                                        }
                                    });
                                    if($scope.pageUI.saleListInfo.length > 0){
                                        saleMsgData = VCMsgData.getMsgData(VCMsgData.getMsgRepeatDiscountData($scope.pageUI.saleListInfo) ,VCMsgData.getMsgRepeatDiscountData($scope.pageUI.saleListInfo,false,false,true) , "top");
                                    }else{
                                        $scope.pageUI.saleListInfo = saleList;
                                        saleMsgData = VCMsgData.getMsgData(VCMsgData.getMsgRepeatDiscountData($scope.pageUI.saleListInfo,true,userCardName) ,VCMsgData.getMsgRepeatDiscountData($scope.pageUI.saleListInfo,true,userCardName,true) , "top");
                                    }
                                }else{//청구 전체 리스트
                                    saleMsgData = VCMsgData.getMsgData(VCMsgData.getMsgRepeatDiscountData($scope.pageUI.saleListInfo) ,VCMsgData.getMsgRepeatDiscountData($scope.pageUI.saleListInfo,false,false,true) , "top");
                                }
                            }else if(command == "getInProgressInterestFreeInstallment" || command == "getInterestFreeInstallment"){ //무이자할부
                                if($scope.pageUI.stateSelectorViewInfo){
    	                        	if(iptType == "click"){
    	                        		$scope.setGATag("키워드", "무이자할부", null, iptType);
    	                        	}else{
    	                        		if(data.commandCard){
                                    		$scope.setGATag("키워드", "무이자할부 카드보기", sendTxt, iptType);
                                    	}else{
                                    		$scope.setGATag("키워드", "무이자할부 보기", sendTxt, iptType);	
                                    	}
    	                        	}                           	
                                }else{
                                	if(data.commandCard){
                                		$scope.setGATag("공통_이벤트", "무이자할부 카드보기", sendTxt, iptType);
                                	}else{
                                		$scope.setGATag("공통_이벤트", "무이자할부 보기", sendTxt, iptType);	
                                	}
                                }
                                self.changeState("interest_free_installment");
                                if(data.commandCard){
                                    if(VCSaleInfo.getCardList(data.commandCard).length > 0){
                                        saleMsgData = VCMsgData.getMsgData(VCMsgData.getMsgRepeatSaleDataSearch(VCSaleInfo.getCardList(data.commandCard),false,true) ,VCMsgData.getMsgRepeatSaleDataSearch(VCSaleInfo.getCardList(data.commandCard),false,true,true) , "top");
                                    }else{
                                        saleMsgData = VCMsgData.getMsgData(VCMsgData.getMsgRepeatSaleDataSearch($scope.pageUI.saleListInfo,true,false,userCardName) ,VCMsgData.getMsgRepeatSaleDataSearch($scope.pageUI.saleListInfo,true,false,userCardName,true) , "top");
                                    }
                                }else{
                                    saleMsgData = VCMsgData.getMsgData(VCMsgData.getMsgRepeatSaleData($scope.pageUI.saleListInfo) ,VCMsgData.getMsgRepeatSaleData($scope.pageUI.saleListInfo) , "top");
                                }
                            }
                            self.showMsg(saleMsgData);
                            $scope.setVCAnalysis(saleMsgData.voice ,"Y","Y");
                            
                        } else { // 청구할인 무이자 할부 리스트 없을 때
                            console.error("청구할인 무이자 할부 정보 없음");
                            $scope.pageUI.saleListInfo = [];
                            self.changeState("interest_free_installment");
                            if(command == "getDiscount"){
                                self.showMsg(VCMsgData.msg.discountNone);
                                $scope.setVCAnalysis(VCMsgData.msg.discountNone.voice ,"Y","Y");
                            }else if(command == "getInProgressInterestFreeInstallment" || command == "getInterestFreeInstallment"){
                                self.showMsg(VCMsgData.msg.saleCardNone);
                                $scope.setVCAnalysis(VCMsgData.msg.saleCardNone.voice ,"Y","Y");
                            }
                        }
                    })
                    .catch(function () {
                        console.error("청구할인 무이자 할부 정보 로드 오류");
                        self.showMsg(VCMsgData.msg.networkError);
                        $scope.setVCAnalysis(VCMsgData.msg.networkError.voice ,"Y","Y");

                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    break;
                case "getCenter": //고객센터/톡상담/1:1문의
                case "goCenterTalk": //톡상담/채팅상담
                case "goCenterCall": //고객센터/전화연결
                    
                    $scope.pageLoading = true; // 로딩바
                    VCCounselorInfo.getCounselorList()
                    .then(function (counselorData) {
                    	var nowDate = new Date();
                    	var useTime = nowDate.getHours();
                    	
	                    if (command == "getCenter") { //고객센터
	                    	self.changeState("customer_center");
	                    	$scope.pageUI.centerKind = "customer";
	                    	if(counselorData.data.psb_yn == "Y" && counselorData.data.holiday_cd == "N" || counselorData.data.holiday_cd == "M" && useTime > 8 && useTime < 18){
	                    		$scope.pageUI.centerYn = "Y";
	                    		$scope.setGATag("공통_고객센터", "고객센터 이동", sendTxt, iptType, $scope.pageUI.prestate);
	                    		self.showMsg(VCMsgData.msg.centerCounseling);
	                    		$scope.setVCAnalysis(VCMsgData.msg.centerCounseling.voice ,"Y","Y");
	                    	}else if(counselorData.data.psb_yn == "N" || counselorData.data.holiday_cd == "W" || counselorData.data.holiday_cd == "H" ){
	                    		$scope.pageUI.centerYn = "N";
	                    		$scope.setGATag("공통_고객센터불가", "고객센터 이동", sendTxt, iptType, $scope.pageUI.prestate);
	                    		$scope.soundEndData = VCMsgData.msg.centerQnaYn;
	                    		self.showMsg(VCMsgData.msg.centerCounselingOtherTime);
	                    		$scope.setVCAnalysis(VCMsgData.msg.centerCounselingOtherTime.voice ,"Y","Y");
	                    	}
	                    }else if (command == "goCenterTalk") { //톡상담/채팅상담
	                    	$scope.pageUI.centerKind = "talk";
	                    	if(counselorData.data.psb_yn == "Y" && counselorData.data.holiday_cd == "N" || counselorData.data.holiday_cd == "M" && useTime > 8 && useTime < 18){
	                            if (!$scope.loginInfo.isLogin) { // 비로그인 중이라면
	                                self.showMsg(VCMsgData.msg.needLogin); // 로그인해 주세요.
	                                $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
	                            }
	                            $scope.setGATag("공통_고객센터", "톡상담 이동", sendTxt, iptType, $scope.pageUI.prestate);
	                    		VCPageMove.go(command, $scope.loginInfo.isLogin); // 해당 command에 맞는 페이지로 이동 처리 (Service)
			               	}else if(counselorData.data.psb_yn == "N" || counselorData.data.holiday_cd == "W" || counselorData.data.holiday_cd == "H" ){
			               		self.changeState("customer_center");
			               		$scope.pageUI.centerYn = "N";
			               		$scope.setGATag("공통_고객센터불가", "톡상담 이동", sendTxt, iptType, $scope.pageUI.prestate);
			               		$scope.soundEndData = VCMsgData.msg.centerQnaYn;
			               		self.showMsg(VCMsgData.msg.centerTalkOtherTime);
			               		$scope.setVCAnalysis(VCMsgData.msg.centerTalkOtherTime.voice ,"Y","Y");
			               	}                    	
	                    }else if (command == "goCenterCall") { //고객센터/전화연결
	                    	if(counselorData.data.psb_yn == "Y" && counselorData.data.holiday_cd == "N" || counselorData.data.holiday_cd == "M" && useTime > 8 && useTime < 18){
	                    		$scope.setGATag("공통_고객센터", "고객센터전화 연결", sendTxt, iptType, $scope.pageUI.prestate);
		               		 	self.showMsg(VCMsgData.msg.centerCall);
		               		 $scope.setVCAnalysis(VCMsgData.msg.centerCall.voice ,"Y","Y");
		               		 	document.location.href='tel:1577-1110';
		               		 	
			               	}else if(counselorData.data.psb_yn == "N" || counselorData.data.holiday_cd == "W" || counselorData.data.holiday_cd == "H" ){
		                    	$scope.pageUI.centerKind = "call";
			               		self.changeState("customer_center");
			               		$scope.pageUI.centerYn = "N";
			               		$scope.setGATag("공통_고객센터불가", "고객센터전화 연결", sendTxt, iptType, $scope.pageUI.prestate);
	                    		$scope.soundEndData = VCMsgData.msg.centerQnaYn;
	                    		self.showMsg(VCMsgData.msg.centerCallOtherTime);
	                    		$scope.setVCAnalysis(VCMsgData.msg.centerCallOtherTime.voice ,"Y","Y");
			               	}
	                    }
                    })
                    .catch(function () {
                        self.showMsg(VCMsgData.msg.networkError);
                        console.error("마이추천 정보 로드 오류");
                    })
                    .finally(function () {
                        $scope.pageLoading = false; // 로딩바
                    });
                    break;
                case "getKeyword": // 키워드(화면별 선택자) 오픈
                    if($scope.pageUI.stateSelectorViewInfo){
                        $scope.stateSelectorOpenCloseM(true);
                        if($scope.pageUI.state == "situation_recommendation" || $scope.pageUI.state == "management_item_recommendation"){
                        	$scope.setGATag("공통_추천", "더보기", sendTxt, iptType);
                        }else{
                        	$scope.setGATag("키워드", "더보기", sendTxt, iptType);
                        }
                    }else{
                        self.showMsg(VCMsgData.msg.unknown);
                        $scope.setVCAnalysis(VCMsgData.msg.unknown.voice ,"Y","Y");
                    }
                    break;
				
				case "goAttCheckEvent":// 출석체크
					doChulcheck();
					$scope.setGATag("공통_이벤트", "출석체크", sendTxt, iptType);
					break;
            }	


            if (command != "actionUnknown") { // 알수 없는 명령에서는 Yes/No 초기화 하지 않음
                if (command != "actionProdOptChange") {
                    optChangeYNDelayFlag = false; // 옵션 변경해줘 Yes/No 대기 Flag
                } else if (command != "actionAddWish") {
                    addWishLoginFlag = false; // 위시 담아줘 Yes/No 대기 Flag
                } else if (command != "addCartLoginFlag") {
                    addCartLoginFlag = false; // 장바구니 담아줘 Yes/No 대기 Flag
                } else if (command != "getMimitoutou") {
                    mimiNoRegistQ = false; // 미미뚜뚜 Yes/No 대기 Flag
                } else if ( !(command == "getStyle" || command == "getStyleList") ) {
                    
                }
                $scope.styleOtherQue = false; // 스타일추천 Yes/No 대기 Flag
                yesNoFlag = false;//공통 flag
            }
        };
        
		/**
		 * 출석체크 진행
		 */
		function doChulcheck(){
			if(!$scope.loginInfo.isLogin){
				// not logged in
                self.showMsg(VCMsgData.msg.needLogin);
                $scope.setVCAnalysis(VCMsgData.msg.needLogin.voice ,"Y","Y");
                var vsLastDate = {
                	sendTxt : "",
                	iptType : "",
                	goLogin : "goLogin"
                };
                var vcLastCommandData =JSON.stringify(vsLastDate);
                self.needLoginCommand("goAttCheckEvent" , vcLastCommandData);
				
			}else if($scope.loginInfo.isSimple){
				// 간편회원
				self.showMsg(VCMsgData.msg.chulcheckSimple);
					
			}else{
				// 일반회원
				loadChulcheck();
			}
		};
		
		/**
		 * 출석체크 JSON 호출
		 */
		function loadChulcheck(action){
			$scope.pageLoading = true;
			var url = LotteCommon.directAttendData + "?rnd=" + Math.round(Math.random() * 100000000);
			var param = {
                url: url,
                method: "get"
            };
			$http(param)
            .then(
            	function(response){
            		$scope.pageLoading = false;
            		if(action == "changeView"){
            			// 출석하기 이후에는 화면 이동
            			gotoChulCheck(response.data.direct_attend, false);
            			
            		}else{
            			// 출석하기 실행
            			loadChulcheckSuccess(response)
            		}
	            },
	            loadChulcheckError
	        );
		};
		
		function loadChulcheckSuccess(response){
			try{
				var today = (new Date()).getDate();
				var checked = false;
				angular.forEach(response.data.direct_attend.attend_tgtr_list.items, function(itm){
					if(parseInt(itm.sbscSgt_Dtime, 10) == today){
						checked = true;
					}
				});
				
				if(checked){
					// already check
					gotoChulCheck(response.data.direct_attend, true);
				}else{
					// not yet
					registChulcheck(response.data.direct_attend.evt_no);
				}
			}catch(e){
				loadChulcheckError(response);
			}
		};
		
		/**
		 * 출석체크하기
		 */
		function registChulcheck(evtNo){
			$scope.pageLoading = true;
            var postParams = {
	            "evt_no" : evtNo,
	            "evt_type" : "at"
            };

            LotteForm.FormSubmitForAjax(LotteCommon.registAttendData, postParams)
            .success(function (data) {
    			$scope.pageLoading = false;
                if(data.data_set.response_msg.indexOf("0000") > -1){
                	loadChulcheck("changeView");
                }else{
                	self.showMsg({
            			txt: data.data_set.response_msg,
            			voice: data.data_set.response_msg,
            			position: "q"
            		});
                }
            })
            .error(function(ex){
    			$scope.pageLoading = false;
            	try{
	            	if(ex.error.response_code == 'M000200'){
	            		self.showMsg({
	            			txt: ex.error.response_msg,
	            			voice: ex.error.response_msg,
	            			position: "q"
	            		});
	                }else{
	                	loadChulcheckError();
	                }
            	}catch(e){
            		loadChulcheckError();
            	}
            });
		};
		
		function loadChulcheckError(response){
    		$scope.pageLoading = false;
			self.showMsg(VCMsgData.msg.networkError);
            console.error("출석체크 정보 로드 오류");
		};
		
		/**
		 * 출첵화면으로 이동
		 * @param data {Object} - direct_attend.json 데이터
		 */
		function gotoChulCheck(data, checkedAlready){
			$scope.pageUI.chulcheck = data;
			self.changeState("chulcheck");

			var now = new Date();
			var day = now.getDay();
			if(day == 0 || day == 6){
				data.todayClover = 200;
			}else{
				data.todayClover = 100;
			}
			
			if(checkedAlready){
				// 이미 출석
				self.showMsg(VCMsgData.msg.chulcheckAlready);
				$scope.setVCAnalysis(VCMsgData.msg.chulcheckAlready.voice ,"Y","Y");
				$scope.setGATag("출석체크", "완료");
			}else{
				// 출석
				var cnt = $scope.pageUI.chulcheck.attend_tgtr_list.items.length;
				var total = $filter('number')($scope.pageUI.chulcheck.intClover);
				self.showMsg(VCMsgData.msg.chulcheckSuccess , [cnt , data.todayClover]);
				$scope.setVCAnalysis(VCMsgData.msg.chulcheckSuccess.voice ,"Y","Y" );
				$scope.setGATag("출석체크", "성공");
			}
			
			// 클로버 교환가능 혜택
			var avail = false;
			var free = data.freeDelivCnt < 1 && data.freeDelivTotalCnt < 200;// 무료배송
			var ecpn = data.sibECouponCnt < 1 && data.sibETotalCouponCnt < 100;// 10%추가할인
			var thnd = data.lpEntryWinCnt < 1 && data.lpEntryDailCnt < 1;// 1천점 내일적립
			if(data.intClover >= 10000 && (free || ecpn || thnd)){
				avail = true;
			}else if(data.intClover >= 1000 && (free || ecpn)){
				avail = true;
			}
			data.availBenefit = avail;

			if(avail){
				$scope.setGATag("샬롯질의", "혜택이동동의메시지노출");
				$scope.soundEndData = VCMsgData.msg.chulcheckBenefit;
			}
		};
		
		/**
		 * 출첵 페이지 이동
		 */
		$scope.gotoDirectAttend = function(flag, yn, sendTxt, iptType){
			if(flag == "voice"){
				if(yn){
					$scope.setGATag("샬롯질의", "혜택이동동의", sendTxt, iptType);
				}else{
					$scope.setGATag("샬롯질의", "혜택이동거부", sendTxt, iptType);
				}
			}else{
				$scope.setGATag("출석체크", "혜택이동", null, "click");
			}
			
			if(yn){
				$scope.gotoService("directAttendUrl");
			}
		};
		
        
        // 보이스 커머스 진입 시 수행
        function pageStart() {
            if (!$scope.isSessionChk) { // 세션스토리지 사용 여부 체크 (세션스토리지 사용이 아닐때만 최초 애니메이션 수행)
                // 추천 발화 가이드 정보 로드
                $scope.pageLoading = true; // 로딩바
                VCStartVoiceInfo.getVoiceInfo()
                .then(function (voiceInfo) {
                    //최근 본 상품 있는지 확인하여 BEST 다음에 넣음
                    var bestIndex = -1;
                    var lately = VCLocalLate.getLateList();
                    if(lately != null && lately != "" && lately.split(",").length > 3){
                        for(var i=0; i< voiceInfo.length; i++){
                            if(voiceInfo[i].guide_type == "BEST"){
                                bestIndex = i+1;
                            }
                        }
                    }

                    if(bestIndex > 0){
                        voiceInfo.splice(bestIndex,0,{
                            "guide_cd" : "",
                            "guide_cont" : "마이추천해줘",
                            "guide_type" : "MY",
                            "guide_rank" : bestIndex
                        });
                    }
                    
                    $scope.pageUI.voiceGuideInfo = voiceInfo;

                    //$timeout(function () {
                        if ($scope.pageUI.voiceGuideInfo.length > 0 && $scope.pageUI.voiceGuideInfo[0].guide_cont) {
                            $scope.VCCtrl.showMsg(VCMsgData.getMsgData($scope.pageUI.voiceGuideInfo[0].guide_cont, $scope.pageUI.voiceGuideInfo[0].guide_cont, "voice"));
                            $scope.setVCAnalysis($scope.pageUI.voiceGuideInfo[0].guide_cont , "Y", "Y", {noHistory:true});
                        }
                    //}, 500);
                })
                .catch(function () {
                    console.error("추천 발화가이드 없음");
                })
                .finally(function () {
                    $scope.pageLoading = false; // 로딩바
                });

                $scope.voiceGuideActive = true; // 가이드 활성화 여부
                
                // 홈 도움말 정보 로드
                self.loadChangehelp({actionHelp:"home"});

                
                ////////////////////////////////////////////////////////////////////// $timeout(checkMiniText, 1000);
            }

            // angular.element($window).on("pageshow", function () {
            //     console.log("PAGE SHOW!!!!!!!!!!!");
            // });

            // 세션 여부 관계 없이 무조건 실행
            if ($scope.pageUI.state == "home" && $scope.pageUI.showMsg.guide == true) {
                $scope.startVoiceGuide(); // 발화가이드 애니메이션 시작
            }
            $timeout(startIptRollingGuide, 1000); // input창 가이드 애니메이션

            // 히스토리 back으로 들어왔을 때 리스트 상태라면 스와이프 된 index 찾아가기
            if ($scope.checkListState($scope.pageUI.state) && $scope.pageUI.prdList.length > 0) {
                if ($scope.prdSwiperCtrl && $scope.pageUI.curPrdSwiperIdx > 0) {
                    $timeout(function () {
                    	try{
                    		$scope.prdSwiperCtrl.moveSpeedIndex($scope.pageUI.curPrdSwiperIdx, 10); // 스와이프 Index 초기화
                    		angular.element($window).trigger("scroll"); // 화면 갱신이 되지 않는 현상 방지를 위해
                    	}catch(e){
                    		console.warn(e);/////////////////////// 페이지 새로고침 시 에러
                    	}
                    }, 500);
                }
            }

            // 페이지 시작 시 ISP 결제 완료 Callback 체크
            var urlQuery = commInitData.query;

            if (urlQuery.isp == "Y") {
                var resCode = urlQuery.resCode;
                var resMsg = decodeURIComponent(urlQuery.resMsg);
                var ord_no = decodeURIComponent(urlQuery.ord_no);

                if (resCode == "9999") { // ISP 결제 취소
                    $scope.pageUI.showOrder = false;
                    // $scope.alert_2016("ISP 결제가 취소 되었습니다.");
                    // self.showMsg(VCMsgData.msg.ispCancel);
                } else {
                    $scope.talkOrderCallBack(resCode, resMsg, ord_no);
                }
            }

            if (urlQuery.lastCommand && LotteStorage.getSessionStorage("vcLastCommandFlag") == "Y") { // 로그인 이후 마지막 수행 Command가 있다면
                LotteStorage.setSessionStorage("vcLastCommandFlag", "N");
                var vcLastCommandData = JSON.parse(LotteStorage.getSessionStorage("vcLastCommandData"));
                if(!vcLastCommandData) vcLastCommandData = {};
                LotteStorage.setSessionStorage("vcLastCommandData", "");
                $timeout(function () {
                    self.commandExec(urlQuery.lastCommand , vcLastCommandData , vcLastCommandData.sendTxt , vcLastCommandData.iptType);
                }, 500);
            }
        };//pageStart
        
        /**
         * 앱 음성검색에서 넘어오는 경우 커맨드 체크
         */
		/*function checkMiniText(){
			if($scope.isSessionChk){ return; }
			
			var txt = "";
			try{
				if(commInitData.query.miniText){
					txt = decodeURIComponent(commInitData.query.miniText);
				}
			}catch(e){}
			
			if($scope.isValidString(txt)){
				$scope.pageUI.micVoiceTxt = txt;
	            $scope.pageUI.activeVoice = false;
	            
				console.warn("MINI : ", txt);
				$scope.sendSemantic("mini", txt);
			}
		};*/
        

        // 웹에서 테스트를 위해 삽입
        if (navigator.userAgent.indexOf("mlotte001") == -1) {
            pageStart(); // 화면 진입 시 수행
        }

        $scope.VCCtrl = self; // 헤더나 네비에서도 사용할 수 있도록 scope에 할당
       
    }]);
    
    // 보이스커머스 컨테이너
    app.directive("lotteContainer", ["LotteCommon", "commInitData", "$timeout", 'VCSendMsg', 'VCBasicInfo', 'VCPageMove', '$window','VCMsgData', 'LotteUtil', 'LotteGA', 'VCUpdateCart', '$filter','VCAppApi',
    function (LotteCommon, commInitData, $timeout, VCSendMsg, VCBasicInfo, VCPageMove, $window, VCMsgData, LotteUtil, LotteGA, VCUpdateCart,$filter,VCAppApi) {
		return {
			templateUrl : "/lotte/resources_dev/talk/voiceCommerce_container.html",
			replace : true,
            controller: 'LotteContainerCtrl',
			link : function($scope, el, attrs, $ctrl) {
                /*****************************************************
                 * DEV MODE 설정
                 *****************************************************/
				if($scope.DEV_MODE){
					//$scope.pageUI.devMode = true;
					$scope.appObj.isApp = true;
					$timeout(function(){
						$scope.pageUI.app.soundFlag = true;
					}, 2000);
				}
                //$scope.pageUI.devMode = true; // 테스트 코드

                if(location.host == "m.lotte.com"){
                	$scope.pageUI.devMode = false;
                }
        
                $scope.toggleDevMode = function () { // 개발자 모드 ON/OFF
                    $scope.pageUI.testMode = !$scope.pageUI.testMode;
                };

                
                $scope.execCommand = function (command, data) { // 개발 모드 명령 수행
                    $ctrl.commandExec(command, data, "개발테스트모드", "mic");
                };

                var previousScrollTop = 0;
                var buggedIphone = false;
                if($scope.appObj.iOsType == "iPhone"){// && $(window).width() == 414){
                	// 8에서도 재현되어서 아이폰 무조건 적용
                	buggedIphone = true;
                }

                var justBlurred = false;
                angular.element("#iptSendTxt").bind("blur", function(e) {
                    angular.element("#voiceMain").removeClass("disableScroll");
                    if(buggedIphone && $scope.pageUI.state == "prod_detail"){
                    	$timeout(function(){
                    		$(window).scrollTop(previousScrollTop);
                    	}, 10);
                    }
                    
                    if($scope.pageUI.inputMode == "keyboard"){
                    	$scope.pageUI.inputMode = "";
                    }
                    
                    justBlurred = true;
                    $timeout(function(){
                    	justBlurred = false;
                    }, 50);
                });
                angular.element("#iptSendTxt").bind("focus", function(e) {
                	if(buggedIphone && $scope.pageUI.state == "prod_detail"){
                		previousScrollTop = $(window).scrollTop();
                		angular.element("#voiceMain").addClass("disableScroll");
                	}
                });
                
                // angular.element("#iptSendTxt").bind("blur", function(e) {
                //     angular.element(".voice_mic").css("position" , "fixed");
                // });
                // angular.element("#iptSendTxt").bind("focus", function(e) {
                //     if(/iPhone|iPod|Android|iPad/.test($window.navigator.userAgent)){
                //         //angular.element(".voice_mic").css("position" , "absolute");
                //     }
                // });

                $scope.showDevToast = function (txt) {
                    $ctrl.showToast(txt);
                };
                /*****************************************************
                 * 화면 컨트롤
                 *****************************************************/
                // angular.element("#btnInputArea").on("touchstart", function (event) {
                //     event.preventDefault(); // 클릭 외에 별도 브라우저 이벤트 중지
                //     event.stopPropagation(); // Bubble Up (부모로 전파) 이벤트 윈도우 전파 방지

                //     $scope.actionInput(event);
                // }).on("touchend", function (event) {
                //     event.preventDefault(); // 클릭 외에 별도 브라우저 이벤트 중지
                //     event.stopPropagation(); // Bubble Up (부모로 전파) 이벤트 윈도우 전파 방지
                // });

                $scope.actionInput = function (event, act) { // 입력 액션
                	// 텍스트필드 블러로 인해 마이크 활성화 안되는 문제 수정
                	if(justBlurred){ $scope.pageUI.inputMode = "keyboard"; }
                    /*if (event) {
                        event.preventDefault(); // 클릭 외에 별도 브라우저 이벤트 중지
                        event.stopPropagation(); // Bubble Up (부모로 전파) 이벤트 윈도우 전파 방지
                    }*/
                	$scope.viewInfoTempMicCheck = false;
                    switch ($scope.pageUI.inputMode) {
                        case "mic": // 현재 마이크 상태일때
                            //console.log("Input Mode : Mic");

                            $scope.pageUI.inputTxt = ""; // 입력값 초기화
                            //$scope.pageUI.inputMode = "keyboard"; // 키보드모드로 전환
                            if(act == "keepMic"){
                            	$scope.pageUI.inputMode = ""; // 마이크모드로 유지
                            	$scope.setGATag("공통_마이크기능", "마이크_ON", null, "click");
                            }else{
                            	$scope.pageUI.inputMode = "keyboard"; // 키보드모드로 전환
                            	$scope.setGATag("공통_마이크기능", "키패드_전환", null, "click");
                            }
                            $ctrl.stopAppSTT(); // [APP] STT 대기 종료$ctrl.stopAppSTT(); // [APP] STT 대기 종료
                            
                            /*$timeout(function () { // input box 노출 후 포커싱을 위해 딜레이 추가
                                angular.element("#iptSendTxt").focus();
                            }, 300);*/
                            break;
                        case "keyboard": // 현재 키보드 입력상태일때
                            //console.log("Input Mode : Keyboard");

                            $scope.pageUI.inputTxt = ""; // 입력값 초기화
                            $scope.pageUI.inputMode = "mic"; // 음성모드로 전환
                            $ctrl.stopAppTTS(); // [APP] 음성 모드 전환 시 TTS 발화중이라면 TTS 발화 종료
                            
                            $scope.setGATag("공통_마이크기능", "마이크_전환", null, "click");
                            
                            $scope.pageUI.micVoiceTxt = "듣고 있어요";
                            $timeout(function () {
                                $ctrl.startAppSTT(); // [APP] STT 대기중으로 변경
                            }, $scope.pageUI.appSchemaDelay);
                            break;
                        default: // 최초 상태
                        
                            if ($scope.pageUI.lastInputMode == "keyboard") { // 마지막 입력 전송 값이 키보드 였을 경우

                            	if(act != "keepBlank"){

                                    if(act == "reKeyBoard"){
                                        $scope.pageUI.inputTxt = ""; // 입력값 초기화
                                        $scope.pageUI.inputMode = ""; // 키보드모드로 전환
                                        
                                    }else{
                                        $scope.pageUI.inputMode = "keyboard"; // 키보드모드로 전환
                                    }

                            		$scope.setGATag("공통_마이크기능", "키패드_ON", null, "click");
                            		//$scope.setGATag("공통_마이크기능", "키패드_전환", null, "click");
                                }
                                
                                $ctrl.stopAppSTT(); // [APP] STT 대기 종료
                                
                                /*$timeout(function () { // input box 노출 후 포커싱을 위해 딜레이 추가
                                    angular.element("#iptSendTxt").focus();
                                }, 300);*/
                            }else {
                                $scope.pageUI.inputTxt = ""; // 입력값 초기화
                                $scope.pageUI.inputMode = "mic"; // 음성모드로 전환
                                $ctrl.stopAppTTS(); // 음성 모드 전환 시 TTS 발화중이라면 TTS 발화 종료
                                
                                $scope.setGATag("공통_마이크기능", "마이크_ON", null, "click");
                                
                                $scope.pageUI.micVoiceTxt = "듣고 있어요";
                                $timeout(function () {
                                    $ctrl.startAppSTT(); // [APP] STT 대기중으로 변경
                                }, $scope.pageUI.appSchemaDelay);
                            }
                            break;
                    }
                    
                    keyboardBlur();

                    $scope.pageUI.lastInputMode = $scope.pageUI.inputMode; // 사용자 마지막 사용 input 모드 저장
                    // q 메세지 자동 닫히고 난 후
                    if(act == "reKeyBoard"){
                        $scope.pageUI.lastInputMode = "keyboard";
                    }
                    // VCBasicInfo.saveInputMode($scope.pageUI.lastInputMode);
                };

                function keyboardBlur() {
                    // 윈도우에 이벤트 바인딩 추가
                    // 입력창 외 다른 곳 클릭 시 입력창 초기화를 위해
                    angular.element($window).off(".actionInput").on("touchend.actionInput", function (event) {
                        //console.log("touchstart", angular.element(event.target));
                        // event.preventDefault();
                        // event.stopPropagation();

                        var md = $scope.pageUI.inputMode;
                        var tg = angular.element(event.target);
                        if(tg.hasClass("voice_mic") || tg.parents(".voice_mic").length > 0){ return; }
                        //console.log("touchend", tg);
                        
                        if(md == "keyboard" || md == "mic"){
                        	angular.element($window).off(".actionInput");
                        	var id = tg.attr("id");
                        	
                        	if( ! (id == "iptSendTxt" || id =="btnMic" || id =="btnKeyboard") ){
                                $ctrl.stopAppSTT(); // [APP] STT 대기 종료
                                angular.element("#iptSendTxt").blur();
                                $scope.pageUI.inputMode = "";
                                $scope.pageUI.inputTxt = "";
                        	}
                        }
                        
                        /*if (($scope.pageUI.inputMode == "keyboard") ||
                            ($scope.pageUI.inputMode == "mic")) {
                            
                            if (angular.element(event.target).attr("id") =="iptSendTxt" || angular.element(event.target).attr("id") =="btnMic" || angular.element(event.target).attr("id") =="btnKeyboard") {
                                angular.element($window).off(".actionInput");
                            } else {
                                $ctrl.stopAppSTT(); // [APP] STT 대기 종료
                                $scope.pageUI.inputMode = "";
                                angular.element($window).off(".actionInput");
                                angular.element("#iptSendTxt").blur();
                            }
                        }*/
                    });
                }

                // ""로 묶여 있는 텍스트 구하기 (""가 없다면 들어온 텍스트 그대로 리턴)
                $scope.getDoubleQuotationMarks = function (txt) {
                    var sendTxt = (txt + "").match(/\".+\"/gi);

                    if (sendTxt && sendTxt.length > 0) {
                        sendTxt = sendTxt[0];
                    }
                    
                    if (!sendTxt && txt) {
                        sendTxt = txt;
                    }
                    return sendTxt ? sendTxt : "";
                };
                
                // 엔터키로 의미분석 동작하도록
                $scope.enterSendSemantic = function (event, type, txt) {
                    if (event && event.keyCode == 13) {
                        $scope.sendSemantic(type, txt);
                    }
                };
                
                $scope.sendSemantic = function (type, txt , history) { // 음성/텍스트 입력 전송
                    var sendTxt = "";
                    var preReqParam = "";
                    
                    switch(type){
                    case "mic":
                    case "click":
                    case "mini":
                    	sendTxt = txt;
                    	break;
                    case "keyboard":
                        sendTxt = $scope.pageUI.inputTxt;
                        $scope.setGATag("공통_마이크기능", "키패드_전송", null, "click");
                    	break;
                    }
                    /*if (type == "mic" || type == "click") {  // TO-DO : 의미분석 협의 입력 텍스트 타입 수정 필요
                        sendTxt = txt;
                    } else if (type == "keyboard") {
                        sendTxt = $scope.pageUI.inputTxt;
                        $scope.setGATag("공통_마이크기능", "키패드_전송", null, "click");
                    }*/
                    $scope.prdSwiperMoveCommand = type;

                    if ($scope.loginInfo.isLogin) {
                        if(!$scope.pageUI.preReqParamObj) {
                            $scope.pageUI.preReqParamObj = {};
                        }
                        
                        $scope.pageUI.preReqParamObj.loginGender = $scope.loginInfo.genSctCd;
                        
                    }
                    
                    preReqParam = $filter('convertObjectToParam')($scope.pageUI.preReqParamObj);
                    
                    var typeOK = true;
                    switch(type){
                    case "mic":
                    case "click":
                    case "mini":
                    case "keyboard":
                    	break;
                	default:
                		typeOK = false;
                		break;
                    }
                    //if ((type == "mic" || type == "keyboard" || type == "click" || type == "mini") && sendTxt) {  // TO-DO : 의미분석 협의 입력 텍스트 타입 수정 필요
                    if(typeOK && sendTxt) {  // TO-DO : 의미분석 협의 입력 텍스트 타입 수정 필요
                    	if (type == "mic") { // 입력 타입이 음성 일 때
                            // $scope.pageUI.lastInputMode = "mic"; // 사용자 마지막 사용 input 모드 저장
                            $scope.pageUI.inputMode = ""; // 입력모드 초기화
                            $scope.pageUI.inputTxt = ""; // 사용자 입력 값 초기화
                        } else if (type == "keyboard") { // 입력 타입이 키보드 일 때
                            // $scope.pageUI.lastInputMode = "keyboard"; // 사용자 마지막 사용 input 모드 저장
                            $scope.pageUI.inputMode = ""; // 입력모드 초기화
                            $scope.pageUI.inputTxt = ""; // 사용자 입력 값 초기화
                            angular.element("#iptSendTxt").blur(); // input box 포커싱 해재
                        }
                    	
                        if (!$scope.pageUI.semanticFlag) {
                            $scope.pageUI.semanticFlag = true;
                            $scope.pageLoading = true; // 로딩바
                            
                            VCSendMsg.sendSemanticAnalysis({
                                screen: $scope.pageUI.state, // 화면 상태
                                qType: type, // 발화/터치/입력 구분 값
                                text: sendTxt, // 발화/터치/입력 텍스트
                                history : history, //히스토리 클릭 여부
                                mbrNo: $scope.loginInfo.isLogin ? $scope.loginInfo.mbrNo : null, // 고객 회원번호
                                preReqParam: preReqParam
                            })
                            .then(function (commandData) { // 의미분석 응답 성공 시
                                $ctrl.commandExec(commandData.command, commandData, sendTxt, type);
                            })
                            .catch(function () { // 의미분석 응답 실패 시
                                $scope.VCCtrl.showMsg(VCMsgData.msg.networkError);
                                // TO-DO 의미분석 응답 실패(처리 실패 포함) 시 처리 필요
                            })
                            .finally(function () {
                                $scope.SemanticHistory = VCBasicInfo.getSemanticeHistory(); // 햄버거 메뉴 히스토리 부분 갱신을 위해 의미분석 히스토리 데이터 갱신
                                if (type == "mic") { // 입력 타입이 음성 일 때
                                    // $scope.pageUI.lastInputMode = "mic"; // 사용자 마지막 사용 input 모드 저장
                                    $scope.pageUI.inputMode = ""; // 입력모드 초기화
                                    $scope.pageUI.inputTxt = ""; // 사용자 입력 값 초기화
                                } else if (type == "keyboard") { // 입력 타입이 키보드 일 때
                                    // $scope.pageUI.lastInputMode = "keyboard"; // 사용자 마지막 사용 input 모드 저장
                                    $scope.pageUI.inputMode = ""; // 입력모드 초기화
                                    $scope.pageUI.inputTxt = ""; // 사용자 입력 값 초기화
                                    angular.element("#iptSendTxt").blur(); // input box 포커싱 해재
                                }
    
                                // if (type != "click") { // 입력 타입이 음성 또는 키보드 일 때만 마지막 입력모드 저장  // TO-DO : 의미분석 협의 입력 텍스트 타입 수정 필요
                                //     VCBasicInfo.saveInputMode($scope.pageUI.lastInputMode);
                                // }
    
                                $scope.pageUI.semanticFlag = false;
                                $scope.pageLoading = false; // 로딩바
                            });
                        } else { // 의미분석 중일 때

                        }
                    }
                };

                // 음성 가이드 클릭 시 음성 가이드에 대한 의미분석 전송
                // $scope.voiceGuideSendMsg = function (curIdx) {
                //     var sendData = $scope.pageUI.voiceGuideInfo[curIdx],
                //         sendTxt = "";

                //     sendTxt = $scope.pageUI.voiceGuideInfo[curIdx].guide_cont;

                //     if (sendData.guide_type == "BEST") { // 코너 운영이 아닌 인기 키워드 일때는 문장 형태로 변환 하여 전달
                //         sendTxt = "인기있는 " + $scope.pageUI.voiceGuideInfo[curIdx].guide_cont + " 추천해줘";
                //     }

                //     $scope.sendSemantic("click", $scope.getDoubleQuotationMarks(sendTxt)); // TO-DO : 의미분석 협의 입력 텍스트 타입 수정 필요
                // };

                $scope.prdgetRecomrCtrl = null; // 상품리스트 스와이프 컨트롤러를 저장하기 위한 scope

                // 상품상세 스와이프 컨트롤러 구해오기
                $scope.getPrdDetailSwiperControl = function (ctrl) {
                    $scope.prdDetailSwiperCtrl = ctrl; // 상품리스트 스와이프 컨트롤러 저장
                };
                // 상품 리스트 스와이프 End Callback Func.
                $scope.prdDetailSwiperEnd = function (idx) {
                    $scope.setVCAnalysis("상품이미지 스와이프");
                }

                // 상품 스와이프 컨트롤러 구해오기
                $scope.getPrdSwiperControl = function (ctrl) {
                    $scope.prdSwiperCtrl = ctrl; // 상품리스트 스와이프 컨트롤러 저장
                    
                    if ($scope.pageUI.curPrdSwiperIdx > 0) {
                        $timeout(function () {
                            $scope.pageUI.curPrdSwiperIdx = $scope.pageUI.curPrdSwiperIdx; // 스와이프 Index 초기화
                            $scope.prdSwiperCtrl.moveSpeedIndex($scope.pageUI.curPrdSwiperIdx, 10);
                            // angular.element($window).trigger("scroll"); // 화면 갱신이 되지 않는 현상 방지를 위해
                        }, 10);
                    }
                };
                
                // 상품 리스트 스와이프 Start Callback Func.
                $scope.prdSwiperStart = function (idx) {
                    $scope.prdSwiperMoveCommand = "";
                };
                
                // 상품 리스트 스와이프 End Callback Func.
                $scope.prdSwiperEnd = function (idx) {
                    if ($scope.pageUI.curPrdSwiperIdx != idx) {
                        $ctrl.initProdOpt(); // 이전 선택 옵션 정보 초기화
                        $scope.pageUI.curPrdSwiperIdx = idx; // 현재 선택된 상품의 index 저장
                        
                        if($scope.prdSwiperMoveCommand == "mic"){
                        	//$scope.setGATag("음성명령어", "다음", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "mic");
                        }else if($scope.prdSwiperMoveCommand == "keyboard"){
                        	//$scope.setGATag("음성명령어", "다음", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "keyboard");
                        }else if($scope.prdSwiperMoveCommand == "touch" || $scope.prdSwiperMoveCommand == ""){
                        	$scope.setGATag("유닛스와이프", "유닛스와이프", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "click");
                        }
                        $scope.prdSwiperMoveCommand = "";
                    }
                    
                    if ($scope.pageUI.state == "prod_list" || $scope.pageUI.state == "management_item_recommendation" || $scope.pageUI.state == "favorite_brands" || $scope.pageUI.state == "situation_recommendation" && $scope.pageUI.preReqParamObj && $scope.pageUI.preReqParamObj.searchType != "R"){
                    		
	                    if($scope.pageUI.preReqParamObj && $scope.pageUI.preReqParamObj.talkId && $scope.pageUI.preReqParamObj.talkId == "2"){ // 1차발화
	                    	 if($scope.pageUI.prdList.length - 1 > 10){ //노출 상품이 10개 이상일때
	                             if($scope.pageUI.curPrdSwiperIdx == 9) { //상품에 10번째 1차 질의메시지 노출
	                            	 if (!$scope.pageUI.showPrd10) {
	                            		 //console.log("1차발화 :  10개이상")
	                            		 $scope.VCCtrl.showMsg(VCMsgData.msg.priceQuest);
                                         $scope.setVCAnalysis(VCMsgData.msg.priceQuest.voice ,"Y","Y");
	                            		 $scope.pageUI.showPrd10 = true;
                                         $scope.setGATag("샬롯재질의", "가격재질의", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "click");
	                            	 }
	                             } else  if($scope.pageUI.curPrdSwiperIdx == 19) { //상품에 20번째 2차 질의메시지 노출
	                            	 if (!$scope.pageUI.showPrd20) {
	                            		 //console.log("1차발화 :  20개")
                                         $scope.VCCtrl.showMsg(VCMsgData.msg.helpQuest);
                                         $scope.setVCAnalysis(VCMsgData.msg.helpQuest.voice ,"Y","Y");
	                            		 $scope.pageUI.showPrd20 = true;
	                            		 $scope.setGATag("샬롯재질의", "도와줘재질의", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "click");
	                            	 }
	                             } else if($scope.pageUI.prdList.length - 1 < 20 && $scope.pageUI.prdList.length - 1 == $scope.pageUI.curPrdSwiperIdx){ //노출 상품이 20개 미만일때
	                            	 if (!$scope.pageUI.showPrdEnd) {
	                            		 //console.log("1차발화 :  10개이상 20개이하 마지막")
                                         $scope.VCCtrl.showMsg(VCMsgData.msg.helpQuest);
                                         $scope.setVCAnalysis(VCMsgData.msg.helpQuest.voice ,"Y","Y");
	                            		 $scope.pageUI.showPrdEnd = true;
	                            		 $scope.setGATag("샬롯재질의", "도와줘재질의", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "click");
	                            	 }
	                             }
                             } else if($scope.pageUI.prdList.length - 1 > 1){ //노출 상품이 2개 이상일때
	                         	if($scope.pageUI.prdList.length - 1 == $scope.pageUI.curPrdSwiperIdx){ //마지막 상품에서 질의 메시지 노출
	                         		if (!$scope.pageUI.showPrdEnd) {
	                         			//console.log("1차발화 :  10개이하 마지막")
                                         $scope.VCCtrl.showMsg(VCMsgData.msg.priceQuest);
                                         $scope.setVCAnalysis(VCMsgData.msg.priceQuest.voice ,"Y","Y");
	                         			$scope.pageUI.showPrdEnd = true;
	                         			$scope.setGATag("샬롯재질의", "가격재질의", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "click");
	                         		}
	                         	}
	                         }
	                    	 
	                    } else { //2차 발화
	                    	if($scope.pageUI.prdList.length - 1 > 10){ //노출 상품이 10개 이상일때
	                            if($scope.pageUI.curPrdSwiperIdx == 9) { //상품에 10번째 1차 질의메시지 노출
	                            	if (!$scope.pageUI.showPrd10) {
	                            		//console.log("2차발화 :  10개이상")
                                        $scope.VCCtrl.showMsg(VCMsgData.msg.helpQuest);
                                        $scope.setVCAnalysis(VCMsgData.msg.helpQuest.voice ,"Y","Y");
	                            		$scope.pageUI.showPrd10 = true;
	                            		$scope.setGATag("샬롯재질의", "도와줘재질의", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "click");
	                            	}
	                            }
	                        } else if($scope.pageUI.prdList.length - 1 > 1 && $scope.pageUI.prdList.length - 1 <= 10){ //노출 상품이 2개 이상일때
	                        	if($scope.pageUI.prdList.length - 1 == $scope.pageUI.curPrdSwiperIdx){ //마지막 상품에서 질의 메시지 노출
	                        		if (!$scope.pageUI.showPrdEnd) {
	                        			//console.log("2차발화 :  10개이하 마지막")
                                        $scope.VCCtrl.showMsg(VCMsgData.msg.helpQuest);
                                        $scope.setVCAnalysis(VCMsgData.msg.helpQuest.voice ,"Y","Y");
		                        		$scope.pageUI.showPrdEnd = true;
		                        		$scope.setGATag("샬롯재질의", "도와줘재질의", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "click");
	                        		}
	                        	}
	                        }
	                    }
                    }else if($scope.pageUI.state == "style_recommendation"){
                        if($scope.pageUI.curPrdSwiperIdx == $scope.pageUI.prdList.length-1 && !$scope.styleOtherQue){
                            $scope.styleOtherQue = true;                            
                            $scope.VCCtrl.showMsg(VCMsgData.msg.styleOtherQue);
                            $scope.setVCAnalysis(VCMsgData.msg.styleOtherQue.voice ,"Y","Y");
                        }
                    }

                    $scope.setVCAnalysis("유닛스와이프");
                };
                
                //상품 상세 스와이프 End Callback Func.
                $scope.setInfo = function (idx) {
                    $scope.setGATag("상품이미지 스와이프", "상품이미지 스와이프", null, "click");
                    $scope.setVCAnalysis("상품이미지 스와이프");
                }

                // 이전 리스트 처리
                $scope.swipeListPrev = function (type) {
                    $scope.pageUI.curPage--;
                    if($scope.pageUI.curPage < 1){
                        $scope.pageUI.curPage = 1;
                    }
                    $scope.listClickState = true; //이전 버튼 클릭 여부
                    if ($scope.pageUI.curPage >= 1) {
                        if ($scope.pageUI.state == "cart") {
                            $ctrl.commandExec("getCart");
                        } else if ($scope.pageUI.state == "wish") {
                            $ctrl.commandExec("getWish");
                        }else if ($scope.pageUI.state == "purchase_frequently") {
                            $ctrl.commandExec("getOftenList");
                        }
                    }
                    if(type == "pervClick"){
                        $scope.setGATag("음성명령어", "이전", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "click");
                        $scope.setVCAnalysis("이전");
                    }
                    $ctrl.showMsg(VCMsgData.msg.prdPrev);
                    $scope.setVCAnalysis(VCMsgData.msg.prdPrev.voice ,"Y","Y" );
                };

                // 다음 리스트 처리
                $scope.swipeListNext = function (type) {
                    $scope.listClickState = true; //다음 버튼 클릭 여부
                    $scope.pageUI.curPage++;
                    var nextMaxViewNum = 0;

                    if($scope.pageUI.curPage > Math.ceil($scope.pageUI.totalCnt / $scope.pageUI.rowsPerPage)){
                        $scope.pageUI.curPage = Math.ceil($scope.pageUI.totalCnt / $scope.pageUI.rowsPerPage);
                    }
                    nextMaxViewNum = $scope.pageUI.totalCnt;

                    if ($scope.pageUI.state == "cart") {
                        $ctrl.commandExec("getCart");
                    } else if ($scope.pageUI.state == "wish") {
                        $ctrl.commandExec("getWish");
                    }else if ($scope.pageUI.state == "purchase_frequently") {
                        $ctrl.commandExec("getOftenList");
                    }
                    
                    if($scope.pageUI.curPage < $scope.getTotalRowPerPage()){
                        nextMaxViewNum = $scope.pageUI.rowsPerPage;
                    }else{
                        nextMaxViewNum = nextMaxViewNum % $scope.pageUI.rowsPerPage;
                        if(nextMaxViewNum == 0){
                            nextMaxViewNum = $scope.pageUI.rowsPerPage;
                        }
                    }
                    if(type == "nextClick"){
                        $scope.setGATag("음성명령어", "다음", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), "click");
                        $scope.setVCAnalysis("더보여줘");
                    }
                    $ctrl.showMsg(VCMsgData.msg.prdNext,[nextMaxViewNum]);
                    $scope.setVCAnalysis( VCMsgData.replaceData(VCMsgData.msg.prdNext, [nextMaxViewNum]).voice ,"Y","Y" );
                };

                 // 총 페이지 수 구하기
                 $scope.getTotalRowPerPage = function () {
                    var checkCnt ;
                    checkCnt =  Math.ceil($scope.pageUI.totalCnt / $scope.pageUI.rowsPerPage);
                    if($scope.pageUI.state != "wish" && $scope.pageUI.state != "cart" && $scope.pageUI.state != "purchase_frequently"){
                        checkCnt = 1;
                    }
                    return checkCnt;
                };

                // 이전 버튼 표시 유무
                $scope.prevBtnShow = function () {
                    var showFlag = false;
                    if ($scope.pageUI.prdList &&  $scope.pageUI.curPage > 1 && $scope.pageUI.curPrdSwiperIdx == 0) {
                        showFlag = true;
                    }

                    return showFlag;
                };
                
                // 다음 버튼 표시 유무
                $scope.nextBtnShow = function () {
                    var showFlag = false;
                    var checkCnt;
                    if(($scope.pageUI.curPrdSwiperIdx + 1) == $scope.pageUI.rowsPerPage){
                        if(1 < $scope.getTotalRowPerPage()){
                            showFlag = true;
                            checkCnt =  Math.ceil($scope.pageUI.totalCnt / ($scope.pageUI.rowsPerPage * $scope.pageUI.curPage) );
                            if(checkCnt == 1){
                                showFlag = false;
                            }
                        }else{
                            showFlag = false;
                        }
                    }
                    return showFlag;
                };

                // 상품평 별점 채우기 필터 (마크업 style 태그 오류 방지)
                $scope.prdStarBG = function (value) {
                    return {width: value * 20 + '%'}
                };

                // 실시간 채팅상담 이동
                $scope.goTalkAdvice = function () {
                    VCPageMove.go("goTalkAdvice", $scope.loginInfo.isLogin);
                };
                
                $scope.customerTel= function(){
                	document.location.href='tel:1577-1110';
                	$scope.setGATag("공통_고객센터", "고객센터전화 연결", null, "click");
                }
                
                $scope.centerQue= function(){
                	$scope.setGATag("공통_고객센터", "1:1문의 이동", null, "click");
                	VCPageMove.go("goCenterQue", $scope.loginInfo.isLogin);
                }
                
                $scope.centerTalk= function(){
                	$scope.setGATag("공통_고객센터", "톡상담 이동", null, "click");
                	VCPageMove.go("goTalkAdvice", $scope.loginInfo.isLogin);
                }

                // 상품상세 이동 (baseParam 붙여서 상품상세 페이지로 이동, TO-DO : curDispNo, curDispSctCd 처리 문의 필요)
                $scope.goPrdDetailPage = function (itemIdx) {
                    var goodsInfo = $ctrl.getCurProdInfo();

                    if (goodsInfo && goodsInfo.goods_no) {
                        VCPageMove.goPrdDetail(goodsInfo.goods_no);
                    }
                };

                $scope.prdShare = function (itemIdx) { // 상품 공유하기 클릭 시 동작
                    $scope.pageUI.curPrdSwiperIdx = itemIdx;
                    $scope.prdSwiperCtrl.moveSpeedIndex(itemIdx, 10);
                    $ctrl.commandExec("actionShare", null, null, "click"); // 상품 공유하기 command 실행
                    $scope.setVCAnalysis("공유");
                };

                $scope.orderDetail = function (ordNo) { // 주문배송 자세히 클릭 시 동작
                    if(!ordNo) return;
                    $scope.setGATag("주문배송조회상세이동", "자세히", null, "click");
                    $scope.setVCAnalysis("자세히" ,"Y","Y");
                    $ctrl.commandExec("getOrderDetailView",{commndOrdNo:ordNo});
                };
                
                $scope.cloverGuide = function(state){ // 클로버 이용안내 클릭시
                	$ctrl.commandExec("goCloverUseInfo", $scope.loginInfo.isLogin);
                	if(state == "chulcheck"){
                		$scope.setGATag("자세히", "클로버이용안내", null, "click");
                	}else{
                		$scope.setGATag("자세히", "클로버이용안내", null, "click");
                		$scope.setVCAnalysis("클로버이용안내");
                	}
                };
                
                
                $scope.prdShareHide = function () { // 상품 공유하기 레이어 감추기
                	//$ctrl.commandExec("actionClose", null, null, "click");
                     $scope.setGATag("공유레이어", "닫기", null , "click");
                     $scope.setVCAnalysis("닫기");
                	// $scope.showLayerHide = true;
            		// $timeout(function () {
                    //     $scope.showLayerHide = false;
                    // }, 2000);
                    $timeout.cancel($scope.pageUI.layerAnimateTimeout);
                    $scope.pageUI.layerAnimate = true;
                    $scope.pageUI.layerAnimateTimeout = $timeout(function () {
                        $scope.pageUI.layerAnimate = false;
                        $scope.pageUI.showShare = false;
                    }, $scope.pageUI.layerAnimateTime);
                    
                };
                

                // 상품 리스트 - 찜하기
                $scope.prdCart = function (itemIdx) { // 상품의 찜하기 클릭 시 동작 (찜하기 기존 위시 -> 장바구니로 변경 됨)
                    $scope.pageUI.curPrdSwiperIdx = itemIdx;
                    $scope.prdSwiperCtrl.moveSpeedIndex(itemIdx, 10);
                    $ctrl.commandExec("actionAddCart", null, null, "click");
                    $scope.setVCAnalysis("찜");
                };
                
                // 상품상세 - 찜하기
                $scope.addCart = function () {
                    $ctrl.commandExec("actionAddCart", null, null, "click");
                    $scope.setVCAnalysis("찜");
                };

                // 상품리스트 주문하기
                $scope.prdOrder = function (itemIdx) { // 상품의 주문하기 클릭 시 동작
                    $scope.pageUI.curPrdSwiperIdx = itemIdx;
                    $scope.prdSwiperCtrl.moveSpeedIndex(itemIdx, 10);
                    $scope.setVCAnalysis("주문해줘");
                    $ctrl.commandExec("actionOrder", null, null, "click"); // 주문하기 command 실행
                };

                // 상품상세 - 주문하기
                $scope.order = function () { // 상품의 주문하기 클릭 시 동작
                    $scope.setVCAnalysis("주문해줘");
                    $ctrl.commandExec("actionOrder", null, null, "click"); // 주문하기 command 실행
                };

                $scope.prdDetail = function (itemIdx) { // 상품의 자세히 클릭 시 동작
                    if (itemIdx >= 0 && //itemIdx < 20 &&
                        ($scope.checkListState($scope.pageUI.state))) {
                        $scope.pageUI.curPrdSwiperIdx = itemIdx;
                        $scope.prdSwiperCtrl.moveSpeedIndex(itemIdx, 10);
                        $scope.setVCAnalysis("자세히");
                        $ctrl.commandExec("actionDetail", null, null, "click"); // 상품 자세히 보기 command 실행
                    }
                };
                 // 구매사은 자세히 클릭 시 동작
                $scope.saunDetail = function (type, evtNo) {
                    if(!evtNo) return;
                    VCPageMove.goSaunDetail(evtNo);
                    if(type == "click"){
                        if($scope.pageUI.saunListInfoMyType != 'list'){
                        	$scope.setGATag("구매사은신청완료", "자세히", null, "click", "purchase_gift_myList");
                        }else{
                        	$scope.setGATag("구매사은진행중", "자세히", null, "click");
                        }
                        $scope.setVCAnalysis("자세히");
                    }
                };
                // 이벤트 자세히 클릭 시 동작
                $scope.eventDetail = function (type, linkUrl , isOutLink) {
                    if(!linkUrl) return;
                    VCPageMove.goEventDetail(linkUrl,isOutLink);
                    if(type == "click"){
                    	$scope.setGATag("이벤트", "자세히", null, "click");
                    	$scope.setVCAnalysis("자세히");
                    }
                };
                // 포인트 자세히 클릭 시 동작
                $scope.pointDetail = function(pointType, state){
                    if(!pointType) return;
                    if(pointType == "lpoint"){
                        VCPageMove.go("goPoint",$scope.loginInfo.isLogin);
                        $scope.setGATag("자세히", "엘포인트", null, "click");
                        $scope.setVCAnalysis("엘포인트");
                    }else if(pointType == "lmoney"){
                        VCPageMove.go("goLmoney",$scope.loginInfo.isLogin);
                        $scope.setGATag("자세히", "엘머니", null, "click");
                        $scope.setVCAnalysis("엘머니");
                    }else if(pointType == "deposit"){
                        VCPageMove.go("goDeposit",$scope.loginInfo.isLogin);
                        $scope.setGATag("자세히", "보관금", null, "click");
                        $scope.setVCAnalysis("보관금");
                    }else if(pointType == "clover"){
                    	if(state == "chulcheck"){
                    		$scope.setGATag("자세히", "클로버", null, "click");
                    	}else{
                    		$scope.setGATag("자세히", "클로버", null, "click");
                    		$scope.setVCAnalysis("클로버");
                    	}
                    	VCPageMove.go("goClover",$scope.loginInfo.isLogin);
                    }
                };
                // 이벤트 응모 결과 클릭 시 동작
                $scope.eventResult = function (evtSn) {
                    if(!evtSn) return;
                    VCPageMove.goEventResult(evtSn);
                };
                // 상황,관리 응답 , 화면별 선택자 클릭 시 동작
                $scope.keywordSendSemantic = function (txt) {
                    if(!txt) return;

                    $scope.viewInfoTempMicCheck = false; //마이크 자동 열기 방지
                    $scope.soundEndData = null;
                    $scope.viewInfoTemp = null;
                    
                    VCAppApi.stopSTT($scope.pageUI.app.soundFlag);
                    
                    $scope.sendSemantic("click", $scope.getDoubleQuotationMarks(txt));
                };

                $scope.closePrdOptLayer = function () { // 상품 옵션 닫기
                    
                    $scope.setVCAnalysis("닫기");
                    $timeout.cancel($scope.pageUI.layerAnimateTimeout);
                    $scope.pageUI.layerAnimate = true;
                    $scope.pageUI.layerAnimateTimeout = $timeout(function () {
                        $scope.pageUI.layerAnimate = false;
                        $scope.pageUI.showPrdOpt = false;
                    }, $scope.pageUI.layerAnimateTime);
                };

                var selectOptItemTimer = null; // 옵션 선택 후 선택 상태 표시 지연 타이머

                $scope.selectOptItem = function (idx, voice) { // 현태 옵션 스탭의 상품 옵션 순번으로 선택 & voice : 발화체크
                    // 현재 옵션 단계에서 해당 순번에 맞는 옵션 선택
                    var optName = $scope.pageUI.optInfo.prdOptInfo[$scope.pageUI.optInfo.curOptStep].optNm,
                        optList = $scope.pageUI.optInfo.prdOptInfo[$scope.pageUI.optInfo.curOptStep].itemList.items;
                    
                    if (idx < optList.length) { // 선택 idx가 현재 옵션 개수 보다 크지 않은지 확인
                        var item = optList[idx];
    
                        if ($scope.pageUI.optInfo.curLayerOptValArr.length == $scope.pageUI.optInfo.curOptStep) { // 현재 옵션 단계에서 값 선택 시
                            $scope.pageUI.optInfo.curLayerOptValArr.push({name: optName, item: item});
                            if(voice == true){
                            } else{
                            	$scope.setGATag("옵션레이어", "옵션선택", LotteUtil.setDigit(idx + 1) , "click");
                            }
                            
                            
                        } else if ($scope.pageUI.optInfo.curLayerOptValArr.length -1 == $scope.pageUI.optInfo.curOptStep) { // 혹시 모를 옵션 선택 후 단계가 변경되기 전 옵션 선택 시 선택된 옵션 값 제거 후 다시 추가
                            $scope.pageUI.optInfo.curLayerOptValArr.pop();
                            $scope.pageUI.optInfo.curLayerOptValArr.push({name: optName, item: item});
                        } else { // 그 외에 케이스에서는 옵션 레이어 초기화
                            $scope.pageUI.optInfo.curOptStep = 0;
                            $scope.pageUI.optInfo.curLayerOptValArr = [];
                            return false;
                        }

                        $ctrl.chkNowStepOptSoldout(); // 현재 단계 옵션 품절 유무 확인
    
                        if (selectOptItemTimer) { // 옵션 선택 딜레이 타이머가 이미 실행중이라면 타이머 취소
                            $timeout.cancel(selectOptItemTimer);
                            selectOptItemTimer = null;
                        }
    
                        selectOptItemTimer = $timeout(selectOptItemCompleteChk, $scope.pageUI.optInfo.optSelectDelayTime); // 딜레이 후 옵션 선택 판단
                        $scope.setVCAnalysis("옵션선택");
                    }
                };

                // 옵션 선택 후 선택된 옵션 정보를 잠깐 동안 보여 주기 위해 일정 시간 후 옵션 선택에 대한 판단 추가
                function selectOptItemCompleteChk() {
                    if ($scope.pageUI.optInfo.prdOptStepCnt == $scope.pageUI.optInfo.curLayerOptValArr.length) { // 마지막 옵션까지 선택 했다면
                        var tmpRollbackArr = $scope.pageUI.optInfo.curOptValArr;

                        $scope.pageUI.optInfo.curOptValArr = $scope.pageUI.optInfo.curLayerOptValArr; // 현재 레이어에서 선택된 옵션을 실제 선택된 옵션 값으로 적용

                        //console.log("선택옵션", $scope.pageUI.optInfo.curOptValArr);

                        $ctrl.setSelectedProdOptItemInfo(); // 마지막까지 선택한 옵션을 최종 값에 저장
                        
                        if ($scope.pageUI.optInfo.selectedOptItemNo != null) { // 선택된 옵션이 있다면
                            if ($scope.pageUI.optInfo.optType == "order") { // 주문으로 발화시 주문확정으로 이동
                                var curPordInfo = $ctrl.getCurProdInfo(); // 현재 상품
                                $ctrl.orderDecide(curPordInfo.cart_sn, false, true); // 주문확정 단계로 진행
                            } else if ($scope.pageUI.optInfo.optType == "cart") { // 장바구니 담기 시
                                $ctrl.addCartProgress(); // 장바구니 담기로 진행
                            } else {
                                if ($scope.pageUI.state == "cart") { // 장바구니 상태일때
                                    var curPordInfo = $ctrl.getCurProdInfo(); // 현재 상품
                                    var nowSelectItemNo = $scope.pageUI.optInfo.selectedOptItemNo;
    
                                    $scope.pageLoading = true; // 로딩바

                                    VCUpdateCart.updateCart({
                                        cart_sn: curPordInfo.cart_sn, // 장바구니 번호
                                        item_no: nowSelectItemNo, // 선택 단품옵션 번호
                                        ord_qty: curPordInfo.ord_qty, // 주문수량
                                        update_ck: true, // 옵션 변경 유무
                                        goods_no: curPordInfo.goods_no, // 상품번호
                                        goods_cmps_cd: curPordInfo.goods_cmps_cd,
                                    }) // 장바구니 정보 업데이트
                                    .then(function (res) {
                                        // 장바구니 리스트의 옵션 정보 갱신
                                        var goodsOptArr = [];

                                        angular.forEach($scope.pageUI.optInfo.curOptValArr, function (optInfo, idx) {
                                            goodsOptArr.push(optInfo.name + " : " + optInfo.item.optValue);
                                        });
                                         
                                        curPordInfo.goods_option = goodsOptArr.join(", ");
                                    })
                                    .catch(function () {
                                        console.error("장바구니 옵션 업데이트 실패");
                                        $scope.alert_2016("장바구니 옵션 반영 오류 발생");
                                    })
                                    .finally(function () {
                                        $scope.pageLoading = false; // 로딩바
                                    });
                                } else {
                                    $timeout(function () {
                                        $ctrl.getProdDetailInfo(); // 상품상세 데이터 로드 후 상품상세 이동
                                    }, $scope.pageUI.layerAnimateTime);
                                    
                                }
                            }
                            $timeout.cancel($scope.pageUI.layerAnimateTimeout);
                            $scope.pageUI.layerAnimate = true;
                            $scope.pageUI.layerAnimateTimeout = $timeout(function () {
                                $scope.pageUI.layerAnimate = false;
                                $scope.pageUI.showPrdOpt = false;
                            }, $scope.pageUI.layerAnimateTime);
                            
                        } else {
                            $scope.pageUI.optInfo.curOptValArr = tmpRollbackArr; // 옵션이 없다면 이전 선택 옵션으로 돌리기
                        }
                    } else {
                        $scope.pageUI.optInfo.curOptStep++; // 다음 옵션 선택 단계로 진행
                        $ctrl.showMsg(VCMsgData.getMsgData("원하는 " + $scope.pageUI.optInfo.prdOptInfo[$scope.pageUI.optInfo.curOptStep].optNm + " 번호를 말해보세요", "원하는 " + $scope.pageUI.optInfo.prdOptInfo[$scope.pageUI.optInfo.curOptStep].optNm + " 번호를 말해보세요", "q") , null , true);
                        $scope.setVCAnalysis("원하는 " + $scope.pageUI.optInfo.prdOptInfo[$scope.pageUI.optInfo.curOptStep].optNm + " 번호를 말해보세요","Y","Y");
                    }
                };

                $scope.helpInfoClick = function (txt) { // 도움말 가이드 클릭 시
                    $scope.sendSemantic("click", $scope.getDoubleQuotationMarks(txt));
                    $scope.pageUI.showHelp = false;
                };

                $scope.helpInfoHide = function () { // 도움말 레이어 감추기
                    $timeout.cancel($scope.pageUI.layerAnimateTimeout);
                    $scope.pageUI.layerAnimate = true;
                    $scope.pageUI.layerAnimateTimeout = $timeout(function () {
                        $scope.pageUI.layerAnimate = false;
                        $scope.pageUI.showHelp = false;
                    }, $scope.pageUI.layerAnimateTime);
                    
                };

                $scope.goCommentLayer = function () { // 상품자세히 상품평 보기
                    $ctrl.commandExec("actionProdComment", null, null, "click"); // 상품 자세히 보기 command 실행
                };

                $scope.commentLayerHide = function () { // 도움말 레이어 감추기
                    $timeout.cancel($scope.pageUI.layerAnimateTimeout);
                    $scope.pageUI.layerAnimate = true;
                    $scope.pageUI.layerAnimateTimeout = $timeout(function () {
                        $scope.pageUI.layerAnimate = false;
                        $scope.pageUI.showPrdComment = false;
                    }, $scope.pageUI.layerAnimateTime);
                    
                    $scope.setGATag("상품평레이어", "닫기", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), 'click');
                    $scope.setVCAnalysis("닫기");
                };

                $scope.goProdImgLayer = function () { // 상품이미지 보기
                    $ctrl.commandExec("actionProdImg", null, null, "click"); // 상품이미지 보기 command 실행
                };

                $scope.backPrdList = function () { // 상품 자세히 보기 상단 Back 버튼
                    // $ctrl.changeState("prod_list"); // 이전 - 상품 리스트로 이동
                    $ctrl.stateHistoryBack(); // 이전 State로 변경
                    $scope.setGATag("음성명령어", "이전", null, "click");
                    $scope.setVCAnalysis("이전");
                };

                $scope.changeProdOpt = function () { // 옵션변경 (상품상세 - 변경)
                    $ctrl.commandExec("actionProdOptChange", null, null, "click"); // 옵션 변경 command 실행
                    $scope.setVCAnalysis("옵션 변경해줘");
                };

                $scope.prodImgLayerHide = function () { // 상품 이미지 레이어 감추기
                    $scope.pageUI.showPrdImgDetail = false;
                    $scope.setGATag("이미지레이어", "닫기", LotteUtil.setDigit($scope.pageUI.curPrdSwiperIdx + 1), 'click');
                    $scope.setVCAnalysis("닫기");
                };

                $scope.toggleOrderTermLayer = function () { // 주문약관 레이어 Show/Hide
                    $scope.pageUI.orderInfo.termLayerFlag = !$scope.pageUI.orderInfo.termLayerFlag;
                };
				
				/**
				 * 약관 팝업 보기
				 */
                $scope.ts_clause = {
                    visible	: false,
                    index	: 0
                };

                $scope.ts_clause.index = 0; // 약관 현재 탭 Idx
                $scope.ts_clause.visible = false; // 약관 보여주는 Flag
                
				$scope.showHideClause = function (visible) {
					$scope.ts_clause.visible = visible;
					
					if (visible) {
						if ($scope.ts_clause.index == 0) {
							$timeout(function() { $scope.loadClause(1); }, 10);
						}else{
							$timeout(function() { $scope.loadClause($scope.ts_clause.index); }, 10);
						}
					}
				};
				
				/**
				 * 약관 로드하기
				 */
				$scope.loadClause = function (flag) {
					$scope.ts_clause.index = flag;
                    var path = "";
                    
					switch (flag) {
					case 1:
						path = LotteCommon.clauseECommerce;
						break;
					case 2:
						path = LotteCommon.clausePIUse;
						break;
					case 3:
						path = LotteCommon.clausePIConsign;
						break;
					default:
						return;
						break;
                    }
                    
					angular.element(".ts_clause_cont > div").scrollTop(0);
					angular.element(".ts_clause_cont > div").scrollLeft(0);
					angular.element("#clauseHolder").load(path + " .clause_wrap");
                };
                
                // 결제 레이어 닫기
                $scope.ordLayerHide = function () {
                    $scope.pageUI.showOrder = false;    
                    $scope.setGATag("닫기", "닫기", null, "click");
                    $scope.setVCAnalysis("닫기");
                	//hideHeaderIOS();
                };
                
                /**
                 * 공유하기 호출하기
                 */
                $scope.shareSNS = function (type) {
                    switch (type) {
                        case "sms":
                            $ctrl.commandExec("actionShareSMS", null, null, "click");
                        break;
                        case "kakaotalk":
                            $ctrl.commandExec("actionShareKakao", null, null, "click");
                        break;
                        case "kakaostory":
                            $ctrl.commandExec("actionShareKaKaoStory", null, null, "click");
                        break;
                        case "facebook":
                            $ctrl.commandExec("actionShareFacebook", null, null, "click");
                        break;
                        case "twitter":
                            $ctrl.commandExec("actionShareTwitter", null, null, "click");
                        break;
                        case "url_copy_voice":
                            $ctrl.commandExec("actionShareURL", null, null, "click");
                        break;
                    }
                };

                // TO-DO : 주문 완료시 주문과 관계된 모든 정보값 초기화 필요
            }
        }
    }]);

     // 보이스커머스 상품상세 Hthml
    app.directive('vcPrdDetailInfo', ["$window", 
    function ($window) {
        return {
			templateUrl : "/lotte/resources_dev/talk/voiceCommerce_dtl_info.html",
            replace : true,
            scope : {
                curPrdHtmlInfo : '=curPrdHtmlInfo'
            },
			link : function($scope, el, attrs) {

                /**
                 * html 영역 (md공지, 상품기술서, 기획전형 상품 기술서)
                 * link, style, script, embed, object 태그 제거
                 */
                $scope.defenseBadHtml = function (html, $target) {
                    html = html ? html : "";
                    html = html.replace(/<link(.*?)>/gi, "");
                    html = html.replace(/<meta(.*?)>/gi, "");
                    html = html.replace(/<script/gi,"<noscript");
                    html = html.replace(/<\/script/gi, "</noscript");

                    $target.html(html);
                    $target.find("style, object, embed, noscript").remove();
                };

                /**
                 * 상품상세 기술서 iframe, 사이즈조견표 처리
                 */
                $scope.prdDetailInfoModified = function ($wrapperTarget, $targets) {
                    if (!$wrapperTarget || !$targets) {
                        return false;
                    }

                    $targets.each(function (idx, entry) {
                        var $win = angular.element($window),
                            $wrapper = null,
                            $entry = null,
                            $scrollBox = null,
                            $l_arrow = null,
                            $r_arrow = null,
                            wrapperGap = 0,
                            arrowMiddleFlag = false,
                            arrowTopPos = 50,
                            ratio = 1,
                            wrapperHeight = 0,
                            contentWidth = 0,
                            contentHeight = 0,
                            winWidth = $win.width(),
                            showScrollArrow = function () {},
                            wrappingDOMHandler = function () {},
                            resizeEvtHandler = function () {};

                        if (entry.tagName == "TABLE") {
                            $wrapper = angular.element('<div class="prddetail_scrollwrap"></div>');
                            $entry = angular.element(entry);
                            $scrollBox = angular.element('<div class="prddetail_scrollbox"></div>');
                            $l_arrow = angular.element('<span class="scroll_arrow left">&lt;</span>');
                            $r_arrow = angular.element('<span class="scroll_arrow right">&gt;</span>');

                            showScrollArrow = function () {
                                var scrollLeft = $scrollBox.scrollLeft();
                                contentWidth = $entry.outerWidth();

                                if (scrollLeft > 5) {
                                    $l_arrow.stop().css("opacity", 0).show().animate({opacity: 1}, 1000);
                                    $wrapper.addClass("left_scroll");
                                } else {
                                    $wrapper.removeClass("left_scroll");
                                    $l_arrow.hide();
                                }

                                if (scrollLeft + 5 < contentWidth - $scrollBox.width()) {
                                    $r_arrow.stop().css("opacity", 0).show().animate({opacity: 1}, 1000);
                                    $wrapper.addClass("right_scroll");
                                } else {
                                    $wrapper.removeClass("right_scroll");
                                    $r_arrow.hide();
                                }
                            };

                            wrappingDOMHandler = function () {
                                $entry.after($wrapper);
                                $wrapper.append($scrollBox.append($entry), $l_arrow, $r_arrow);
                                $scrollBox.on("scroll", showScrollArrow);

                                resizeEvtHandler();
                                showScrollArrow();
                            };

                            resizeEvtHandler = function () {
                                if (winWidth == $win.width()) {
                                    return false;
                                }
                
                                winWidth = $win.width();
                                contentWidth = $entry.outerWidth();
                                contentHeight = $entry.outerHeight();
                
                                if (arrowMiddleFlag) {
                                    $l_arrow.css("top", contentHeight / 2 - $l_arrow.height() / 2);
                                    $r_arrow.css("top", contentHeight / 2 - $r_arrow.height() / 2);
                                } else {
                                    $l_arrow.css("top", arrowTopPos);
                                    $r_arrow.css("top", arrowTopPos);
                                }
                
                                if ($entry.width() > winWidth - wrapperGap) {
                                    $scrollBox.attr("style", "max-width:100%;overflow-x:scroll;width:" + (winWidth - wrapperGap) + "px !important");
                                    $l_arrow.show();
                                    $r_arrow.show();
                                } else {
                                    $scrollBox.removeAttr("style");
                                    $l_arrow.hide();
                                    $r_arrow.hide();
                                }
                            };
                        } else if (entry.tagName == "IFRAME") {
                            $wrapper = angular.element('<div class="resizer"></div>');
                            $entry = angular.element(entry);
                            
                            wrappingDOMHandler = function () {
                                $entry.after($wrapper);
                                $wrapper.append($entry);
                            };
                            
                            resizeEvtHandler = function () {
                                ratio = $wrapperTarget.width() / $entry.width();
                                wrapperHeight = $entry.height() * ratio;

                                if (ratio < 1) {
                                    $entry.css({
                                        "-transform-origin": "0 0",
                                        "transform": "scale(" + ratio + ", " + ratio + ")",
                                    });

                                    $wrapper.attr("style", "overflow:hidden;height:" + Math.round(wrapperHeight) + "px !important");
                                }
                            };
                        }

                        wrappingDOMHandler();
                        resizeEvtHandler();
                        $win.on("resize.prdDetailInfoModified", resizeEvtHandler);
                    });
                };
                
                 // 기술서 금지 태그 삭제
                 $scope.defenseBadHtml($scope.curPrdHtmlInfo.max, angular.element("#detailLayout"));
                 // 상품기술서 iframe, 사이즈 조견표 처리
                 $scope.prdDetailInfoModified(angular.element("#detailLayout"), angular.element("#detailLayout iframe, #detailLayout #sizeGuideTable .tabel_list_wrap >table"));

                // $scope.$parent.setDetailLayoutData = function(data) {
                //     // 기술서 금지 태그 삭제
                //     $scope.defenseBadHtml(data.max, angular.element("#detailLayout"));
                //     // 상품기술서 iframe, 사이즈 조견표 처리
                //     $scope.prdDetailInfoModified(angular.element("#detailLayout"), angular.element("#detailLayout iframe, #detailLayout #sizeGuideTable .tabel_list_wrap >table"));
                // };
            }
        }
    }]);

    // 밀리세컨드 타임 다시 시간 분으로 변환(history 노출을 위함)
    app.filter('timeChange', [function () {
        return function (date) {
            var newDate = new Date(date);

            var hour = newDate.getHours();
            var hhour = "오전";
            if(hour > 12){
                hhour = "오후";
                hour = hour-12;
            }
            var changeDate;

            var nowDate = new Date();
            
            if( nowDate.getMonth() - newDate.getMonth() == 0){
                if(nowDate.getDate() - newDate.getDate() == 0){
                    if(newDate.getMinutes() < 10){
                        changeDate = hhour + " " + hour + ":0" + newDate.getMinutes();
                    }else{
                        changeDate = hhour + " " + hour + ":" + newDate.getMinutes();
                    }
                    
                }else if(nowDate.getDate() - newDate.getDate() == 1){
                    changeDate = "어제";
                }else if(nowDate.getDate() - newDate.getDate() > 1){
                    changeDate = (newDate.getMonth()+1) + "월" + newDate.getDate() + "일";
                }
            }else{
                changeDate = (newDate.getMonth()+1) + "월" + newDate.getDate() + "일";
                
            }
            
            
            // 어제 , 12월31일 
            //
            //var changeDate = newDate.toLocaleString('ko-KR', {hour: 'numeric', minute: 'numeric', hour12: true }); //ios 9 버전 안됨
            return changeDate;
        }
    }]);

    //소수점 올림
    app.filter('ceil', function() {
        return function(input) {
            return Math.ceil(input);
        };
    });
    //날자형식 변경 ex)2018/07/01 -> 2018.07.01
    app.filter('strToDate', [function() {
    	return function(item) {
    		if( item == null || item == '') {
    			return '';
    		} else {
    			return item.substr(0,4)+"."+item.substr(5,2)+"."+item.substr(8,2);	
    		}
    	}
    }]);
    //날자형식 변경 ex)20180801 -> 2018.07.01
    app.filter('strToDate2', [function() {
    	return function(item) {
    		if( item == null || item == '') {
    			return '';
    		} else {
    			return item.substr(0,4)+"."+item.substr(4,2)+"."+item.substr(6,2);	
    		}
    	}
    }]);
    //날자형식 변경 ex)20180801 -> 2018년 07월 01일
    app.filter('strToDate3', [function() {
    	return function(item) {
    		return item.substr(0,4)+"년 "+item.substr(4,2)+"월 "+item.substr(6,2)+"일";
    	}
    }]);
    //날자형식 변경 ex)20180801 -> 08월 01일
    app.filter('strToDate4', [function() {
    	return function(item) {
            if( item == null || item == '') {
                return "";
            }
    		return item.substr(4,2)+"월 "+item.substr(6,2)+"일";
    	}
    }]);
    //날자형식 변경 ex)2018.07.01 -> 2018/07/01
    app.filter('strToDate5', [function() {
        return function(item) {
            if( item == null || item == '') {
                return '';
            } else {
                return item.substr(0,4)+"/"+item.substr(5,2)+"/"+item.substr(8,2);	
            }
        }
    }]);
    //날자형식 변경 ex)2018-08-01~~~ -> 2018-07-01
    app.filter('strCutdate', [function() {
    	return function(item) {
    		if( item == null || item == '') {
    			return '';
    		} else {
    			return item.substr(0,4)+"-"+item.substr(5,2)+"-"+item.substr(8,2);	
    		}
    	}
    }]);
    //금액 변경 ex)100000 -> 10만원
    app.filter('numToManwon', [function() {
    	return function(item) {
    		if( item == null || item == '') {
    			return '';
    		} else {
                var num = item.replace(/,/gi, "");
                if(num.length < 5){
                    return item;
                }
                return num.slice(0,-4) + "만원";
    		}
    	}
    }]);
     /*
    * Array를 순회하면서 Object의 property 와 매창되는 value 값을 찾아서 제일 앞으로 (포인트에서 사용)
    * @param arr : Array
    * @param property : 순회 key 값
    * @param value : 매칭 key 값
    */
   app.filter('findItemAndGetFront', [function() {
        return function(arr , property , value) {
            var idx = -1; 
            for(var i = 0 ; i < arr.length ; i++) { 
                if( arr[i][property] == value) { 
                    idx = i ; 
                    break ; 
                }
            }
            if( idx != -1) { 
                
                var item = arr.splice(idx , 1) ; 
                arr.unshift(item[0]) ;
                
            }
            return arr ; 
        }
    }]);
    /**
     * 별점 정책 filter
     * input: 입력값 5이하 값으로 소수점 있음
     * convertPerfectScore: [옵션] 변환 만점 기준
     */
    app.filter('starScorePolicy', function () {
        return function (input, convertPerfectScore) {
            if(!input) {return 0;}

            var originPerfectScore = 5;
            var newScore = Math.ceil(input * 2) / 2;

            if(convertPerfectScore != undefined){
                newScore = newScore / originPerfectScore * convertPerfectScore;
            }

            return newScore;
        }
    });

    app.filter('brToComma', function() {
        return function(text) {
            return  text ? String(text).replace(/<br\/>/gm, ', ') : '';
        }
    });
    /**
     * string parameter 를 object 로 변환
     * ex ) talkId=3&groupId=2 -> {talkId:3,groupId:2}
     */
    app.filter('convertParamToObject', function() {
        return function(strParam) {
            
            var tempPreParam = (strParam + "").replace(/^\&|\?/i, "");
            var tempPreParamArr = tempPreParam.split("&");
            var tempPreParamObj = {};
            
            if (tempPreParamArr && tempPreParamArr.length > 0) {
                var i = 0,
                    tempSplitData = null;
    
                for (i = 0; i < tempPreParamArr.length; i++) {
                    tempSplitData = null;
                    tempSplitData = tempPreParamArr[i].split("=");
    
                    if (tempSplitData && tempSplitData.length == 2) {
                        tempPreParamObj[tempSplitData[0]] = tempSplitData[1];
                    }
                }
            }
            return tempPreParamObj;
        }
    });

    /**
     * object 를 string parameter 로 변환
     * ex ) {talkId:3,groupId:2} -> talkId=3&groupId=2
     */
    app.filter('convertObjectToParam', function() {
        return function(objParam , encode) {
            var returnParam = "";
            angular.forEach(objParam,function (value , key){
                if(encode){
                    returnParam += key + "%3D" + value + "%26";
                }else{
                    returnParam += key + "=" + value + "&";
                }
            })
            return returnParam.slice(0,returnParam.length-1);
        }
    });
    /**
     * str 에서 {} 을 replaceDataArr 값으로 치환
     */
    app.filter('replaceString', function() {
        return function(str , replaceDataArr) {
            var returnStr = str;
            if (replaceDataArr && replaceDataArr.length > 0) { // 치환할 문자가 있는지 판단
                var i = 0;
        
                for (i = 0; i < replaceDataArr.length; i++) {
                    var replaceTxt;
                    if(Number(replaceDataArr[i])){
                        replaceTxt = $filter('number')(replaceDataArr[i]);
                    }else{
                        replaceTxt =  replaceDataArr[i];
                    }
                    returnStr = (returnStr + "").replace("{}", replaceTxt);
                }
            }

            return returnStr;
        }
    });

    

    // 스크롤 디렉티브(상품평 더보기)
    app.directive('moreScroll', ['$window', '$timeout', 'VCGetProdComment', 
    function ($window, $timeout, VCGetProdComment) {
        return function ($scope, elm, attr) {
            var scrollElm = elm[0],
                $win = angular.element($window),
                contHeight = 0,
                winHeight = $win.height(),
                contHeightCall = true; // 스크롤 영역 재로드 여부에 따라 컨텐츠 높이 다시 가져오기 플래그

            elm.bind('scroll', function () {
                if (contHeightCall) { // 스크롤 영역 컨텐츠 높이 가져오기(더보기 실행시마다 높이가 달라짐)
                    contHeight = angular.element(scrollElm).children().height();
                    contHeightCall = false;
                    $scope.pageUI.prodCommentPageIndex++;
                }

                if (contHeight <=  scrollElm.scrollTop + winHeight && !$scope.pageUI.prodCommentAjaxLoadFlag && !$scope.pageUI.prodCommentLastPage) {
                    $scope.pageUI.prodCommentAjaxLoadFlag = true;
                    $scope.pageUI.jsonLoading = true;

                    var goodsInfo = $scope.VCCtrl.getCurProdInfo();

                    if (goodsInfo && goodsInfo.goods_no) {
                        $scope.pageLoading = true; // 로딩바

                        VCGetProdComment.getProdComment(goodsInfo.goods_no, $scope.pageUI.prodCommentPageIndex)
                        .then(function (prodComment) {
                            if(prodComment.critList.total_count > 0) {
                                for(var i=0;i < prodComment.critList.items.length;i++) {
                                    $scope.pageUI.prodComment.critList.items.push(prodComment.critList.items[i]);
                                }
                            } else {
                                $scope.pageUI.prodCommentLastPage = true;
                            }
    
                            $scope.pageUI.prodCommentAjaxLoadFlag = false;
                            $scope.pageUI.jsonLoading = true;
                            contHeightCall = true;
                        })
                        .catch(function () {
                            console.error("상품평 정보 없음.");
                            $scope.pageUI.prodCommentAjaxLoadFlag = false;
                            $scope.pageUI.jsonLoading = true;
                        })
                        .finally(function () {
                            $scope.pageLoading = false; // 로딩바
                        });
                    }

                }
            });
        }

    }]);

    app.directive("ngTouchstart", function () {
        return {
          controller: function ($scope, $element, $attrs) {
            $element.bind('touchstart', onTouchStart);
            
            function onTouchStart(event) {
              var method = $element.attr('ng-touchstart');
              $scope.$event = event;
              $scope.$apply(method);
            };
          }
        };
      });

})(window, window.angular);