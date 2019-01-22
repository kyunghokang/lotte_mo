(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteMap'
    ]);
    
    app.filter('ordNoChange', [function() {
    	return function(item) {
    		if(item == null) {
    			return "";
    		} else {
    			return item.substr(0,4) + "-" + item.substr(4,2) + "-" + item.substr(6,2) + "-" + item.substr(8,7);	
    		}
    	}
    }]);
    
    app.filter('strToDate', [function() {
    	return function(item) {
    		if(item == null) {
    			return "";
    		} else {
    			return item.substr(0,4)+"년 "+item.substr(4,2)+"월 "+item.substr(6,2)+"일";
    		}
    	}
    }]);
    
    app.filter('strToDateNoYear', [function() {
    	return function(item) {
    		var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
    		var newDate = String(item).substr(0,4)+"-"+String(item).substr(4,2)+"-"+String(item).substr(6,2);
    		var today = new Date(newDate).getDay();
    		var todayLabel = week[today];
    		var date = String(item).substr(4,2)+"/"+String(item).substr(6,2);
    		
    		return date + "("+ String(todayLabel).substr(0,1)+")";
    	}
    }]);
    
    app.controller('SmartPickViewCtrl', ['$scope', '$http', '$window', '$timeout', 'LotteCommon', 'LotteForm', 'commInitData', function($scope, $http, $window, $timeout, LotteCommon, LotteForm, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "스마트픽 교환권 상세"; //서브헤더 타이틀
        $scope.mapViewFlag = false;
        
        $scope.thisPopupPickIdx = 0;
        $scope.sendPickPopupFlag = [];
        $scope.sendPickPopupFlag[$scope.thisPopupPickIdx] = false; // 예약증보내기 팝업
        Kakao.cleanup();
        if($scope.appObj.isSktApp == true) {
    		Kakao.init("7a460fb5cdebe4589041db57d906ddda");
    	} else {
    		Kakao.init("574659987ca46095c123d71f72abac14");	
    	}
        // 로그인 정보 체크 후 로그인 페이지로 리턴
//        if(!$scope.loginInfo.isLogin){
//    		var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
//        	$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
//        	return;
//    	}
        
        $scope.smp_yn = false;
        if(commInitData.query['smp_yn'] == 'Y'){
            $scope.smp_yn = true;
            $scope.promotionUrl = function() {
            	$window.location.href = LotteCommon.baseUrl + "/smartpick/smartpick_promotion.do?" + $scope.baseParam + "&smp_yn=Y&tab_click_yn=Y";
            }
            $scope.pickListUrl = function() {
            	$window.location.href = LotteCommon.baseUrl + "/smartpick/pick_list.do?" + $scope.baseParam + "&smp_yn=Y";
            }
            $scope.setupUrl = function() { 
            	$window.location.href = LotteCommon.baseUrl + "/smartpick/smp_cpn_setup.do?" + $scope.baseParam + "&smp_yn=Y";
            }
            $scope.smpParam = "&smp_yn=Y"
        } else {
        	$scope.smpParam = "";
        }
        
        //파라메터 get
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        //사용기간구분값 D7:최근 7일 D15:최근 15일 M1:최근 1개월 M3:최근 3개월	- 기본 한달 M1
        if (getParameterByName('search_flag') == ""){
        	$scope.searchParam = "D7";
        } else {
        	$scope.searchParam = getParameterByName('search_flag');	
        }
        //쿠폰 사용 가능 코드 1:사용가능, 2:사용불가, 3:사용완료
        if (getParameterByName('cpn_state_cd') == ""){
        	$scope.usedGubnParam = "1";
        } else {
        	$scope.usedGubnParam = getParameterByName('cpn_state_cd');	
        }
        $scope.smartYnParam = getParameterByName('smp_yn'); //스마트픽 여부		
        $scope.ordNoParam = getParameterByName('ord_no');  //주문번호
        $scope.ordSnParam = getParameterByName('ord_dtl_sn');//주문순번
        
        // Data url
        var smartPickListData = LotteCommon.smartPicKListData + "?" + $scope.baseParam + "&search_flag=" + $scope.searchParam + "&cpn_state_cd=" + $scope.usedGubnParam + "&ord_no=" + $scope.ordNoParam + "&ord_dtl_sn=" + $scope.ordSnParam;
        
        // Data Load
        $http.get(smartPickListData)
        .success(function(data) {
        	// 상세정보
        	$scope.smartPickDetail = data.obj.smartpick[0];
       		$scope.orderNumebr = $scope.smartPickDetail.ord_no.substr(0,4) + "-" +$scope.smartPickDetail.ord_no.substr(4,2) + "-" + $scope.smartPickDetail.ord_no.substr(6,2) + "-" + $scope.smartPickDetail.ord_no.substr(8,7);
        })
        .error(function(data, status, headers, config){
            console.log('Error Data : ', status, headers, config);
        });

        //이상품 더 구매하기
        $scope.moreProduct = function(goods_no){
        	$window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no="+goods_no+"&search_flag=" + $scope.searchParam;
        }
        
        // 주문취소
        $scope.orderCancel = function(smartPickDetail) {
        	if($scope.smartPickDetail.ord_cncl_psbl_yn == 'N') {
        		alert("스마트픽 교환권을 취소하실 수 없습니다.");
        		return false;
        	}
        	
        	if (confirm('예약을 취소하시겠습니까?')) {
        		var postParams = angular.extend({
        			non_pay_ord_no : smartPickDetail.ord_no,		//	주문번호
        			non_pay_ord_dtl_sn : smartPickDetail.ord_dtl_sn,	//	주문순번
            		ecpn_no : smartPickDetail.ecpn_no,	//	이쿠폰번호
            		ord_qty : smartPickDetail.rel_qty,	//	실수량
            		vstr_cell_no : smartPickDetail.adre_no,	//	수신자번호
            		vstr_nm : smartPickDetail.adre_nm,	//	수신자명
            		goods_nm : smartPickDetail.goods_nm	//	상품명
    			},$scope.baseParam);
    			$http({
    				url : '/json/smartpick/reservation_cancel.json',
    				data : $.param(postParams),
    				method : 'POST',
    				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
    			}) // AJAX 호출
    			.success(function (data) { // 호출 성공시
    				alert(data.responseMsg);
    				$window.location.href = LotteCommon.smartPickListUrl + "?" + $scope.baseParam;
    			})
    			.error(function (data, status, headers, config) { // 호출 실패시
    				alert(data.responseMsg);
    				return false;
    			});
			} else {
				return false;
			}
        }
        
     // 예약증 다시 보내기
        $scope.sendSmartPick = function(smartPickDetail) {
            //크로스픽 추가
        	if(smartPickDetail.crspk_install_yn != undefined && smartPickDetail.crspk_install_yn == 'N' && smartPickDetail.crspk_yn != undefined && smartPickDetail.crspk_yn == 'Y'){
        		 alert('편의점 픽업 교환권은 세븐 일레븐 매장에서 \n픽업준비완료 후 바코드가 생성됩니다.\n\n픽업준비완료 후 교환권을 확인해주세요.');
        		 return false;
        	}            
            
            
        	// 와인인 경우
        	if(smartPickDetail.prod_div == "W") {
        		// 보내기 횟수 체크
            	if(smartPickDetail.mms_trns_rmnd_cnt == '0') {
            		alert('스마트픽 교환권 전송은 총3회까지만 가능합니다.')
            		return false;
            	}
            	
            	var postParams = angular.extend({
            		goods_no        : smartPickDetail.goods_no,   //상품번호
            		ecpn_no         : smartPickDetail.ecpn_no,   //E쿠폰번호
            		send_sct_cd     : '1',
            		adre_no         : smartPickDetail.adre_no,   //받는이 휴대폰 번호
            		sndr_no         : smartPickDetail.ord_user_cell_phone,   //보내는이 휴대폰 번호
            		adre_nm         : smartPickDetail.adre_nm,   //받는이 성명
            		sndr_nm         : smartPickDetail.sndr_nm,   //보내는이 성명
            		msg_cont        : smartPickDetail.msg_cont,   //메시지
            		rsv_yn          : 'N',
            		shop_no         : smartPickDetail.shop_no,   //사용처번호
            		ord_qty         : smartPickDetail.rel_qty   //예약수량		
            	},$scope.baseParam);
    			$http({
    				url : '/json/smartpick/reservation_send_mms.json',
    				data : $.param(postParams),
    				method : 'POST',
    				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
    			}) // AJAX 호출
    			.success(function (data, status, headers, config) { // 호출 성공시
    				alert(data.responseMsg);
    				$window.location.href = LotteCommon.smartPickListUrl + "?" + $scope.baseParam + "&tclick=m_my_smartpick";
    			})
    			.error(function (data, status, headers, config) { // 호출 실패시
    				alert('error..............');
    				return false;
    			});
    			
    		// E-쿠폰 , 일반상품
        	} else {
            	$scope.thisItems = smartPickDetail;
            	$scope.thisPopupPickIdx = smartPickDetail.ord_no + smartPickDetail.ord_dtl_sn;
            	$scope.sendPickPopupFlag[$scope.thisPopupPickIdx] = true;
            	$scope.dimmedOpen({
    				target : "send_popup["+$scope.thisPopupPickIdx+"]",
    				callback: $scope.sendPickPopupClose
    			});
        	}
        }
        
        // 문자보내기 페이지 이동 
        $scope.goSmsPage = function(items) {
            $scope.sendTclick('m_DC_Smartpicklist_Clk_Shr_1');
            
            if(items.mms_trns_rmnd_cnt == '0'){
                alert("스마트픽 교환권 전송은 총3회까지만 가능합니다.");
                return false;
            }
            if(items.prod_div == "W") {
                var postParams = angular.extend({
                    goods_no        : items.goods_no,   //상품번호
                    ecpn_no         : items.ecpn_no,   //E쿠폰번호
                    send_sct_cd     : '1',
                    adre_no         : items.adre_no,   //받는이 휴대폰 번호
                    sndr_no         : items.ord_user_cell_phone,   //보내는이 휴대폰 번호
                    adre_nm         : items.adre_nm,   //받는이 성명
                    sndr_nm         : items.sndr_nm,   //보내는이 성명
                    msg_cont        : items.msg_cont,   //메시지
                    rsv_yn          : 'N',
                    shop_no         : items.shop_no,   //사용처번호
                    ord_qty         : items.rel_qty   //예약수량        
                },$scope.baseParam);
                $http({
                    url : '/json/smartpick/reservation_send_mms.json ',
                    data : $.param(postParams),
                    method : 'POST',
                    headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
                }) // AJAX 호출
                .success(function (data, status, headers, config) { // 호출 성공시
                    alert(data.responseMsg);
                    $window.location.href = LotteCommon.smartPickListUrl + "?" + $scope.baseParam + "&tclick=m_DC_MyPage_Clk_Btn_8";
                })
                .error(function (data, status, headers, config) { // 호출 실패시
                    alert("error");
                });
            } else {
                $window.location.href = LotteCommon.smartPickGiftUrl + "?ord_no=" + items.ord_no + "&ord_dtl_sn=" + items.ord_dtl_sn + "&" + $scope.baseParam + $scope.smpParam;    
            }
        }
        
        $scope.goKakako = function(items){
            var shareTitle = '[롯데닷컴 스마트픽]\n', // 타이틀
                shareImg = '', // 이미지
                shareBarcode = '', // (상담권,교환권,예약증)번호
                sharePlace = '', // (상담매장,픽업장소,예약매장) 장소
                shareBusinessTime =  items.bsns_time != '' ? items.bsns_time : '', // 영업시간
                sharePossibleDate =  items.smp_vst_fcst_dtime != '' ? items.smp_vst_fcst_dtime : '', // (상담예정,픽업가능) 일
                shareLink = '', // 링크
                shareButtonText = '', // 버튼명
                shareGoodsLink = items.goods_no != "" ? location.protocol + "//" + location.hostname + '/product/m/product_wine_view.do?goods_no=' + items.goods_no : location.protocol + "//" + location.hostname, // 상품상세 링크
                shareVineDetailLink = location.protocol + "//" + location.hostname + '/smartpick/smp_cpn_info.do?ord_no=', // 와인 교환권상세 링크
                sharePickInfoLink = location.protocol + "//" + location.hostname + '/product/m/product_list.do?curDispNo=5409473'; // 스마트픽 안내 링크

            /* 공통 처리 */
            // 이미지 처리
            if (items.goods_img != "") {
                shareImg = items.goods_img.replace('_150.jpg', '_550.jpg');
            } else {
                shareImg = 'http://image.lotte.com/lotte/mobile/common/share_img_common.jpg';
            }


            /* kakao link V1, V2 API 버젼 따라 분기 처리 */
            if (($scope.appObj.isAndroid && $scope.appObj.verNumber >= 408) || ($scope.appObj.isIOS && $scope.appObj.verNumber >= 4050) || !$scope.appObj.isApp) { // V2 지원가능 앱이거나, 웹일 경우

                if (items.prod_div == 'W') { // 와인상품일 경우
                    shareBarcode = '*예약증 번호 : ' + items.ecpn_no;
                    sharePlace = '*예약매장 : ' + items.use_loc_nm + '\n';
                    sharePossibleDate = '*픽업가능일 : ' + sharePossibleDate.substr(0,4)+"년 "+sharePossibleDate.substr(4,2)+"월 "+sharePossibleDate.substr(6,2)+"일 "+ shareBusinessTime;
                    shareButtonText = '예약증 상세보기';
                    shareLink = shareVineDetailLink + items.ord_no + '&ord_dtl_sn=' + items.ord_dtl_sn;
                } else if (items.prod_div == 'S' && items.smp_install_yn == 'N' && items.crspk_install_yn == 'N') { // 스마트픽 상품 && 미설치상품 && 크로스픽 미상품
                    shareBarcode = '*교환권 번호 : ' + items.ecpn_no;
                    sharePlace = '*픽업장소 : ' + items.use_loc_nm + '\n';
                    sharePossibleDate = '*픽업일시 : ' + sharePossibleDate.substr(0,4)+"년 "+sharePossibleDate.substr(4,2)+"월 "+sharePossibleDate.substr(6,2)+"일 "+ shareBusinessTime;
                    shareButtonText = '스마트픽 안내';
                    shareLink = sharePickInfoLink;
                } else if (items.prod_div == 'S' && items.smp_install_yn == 'Y') { // 스마트픽 상품 && 설치상품
                    shareBarcode = '*상담권 번호 : ' + items.ecpn_no;
                    sharePlace = '*상담매장 : ' + items.use_loc_nm + '\n';
                    sharePossibleDate = '*상담예정일 : ' + sharePossibleDate.substr(0,4)+"년 "+sharePossibleDate.substr(4,2)+"월 "+sharePossibleDate.substr(6,2)+"일 "+ shareBusinessTime;
                    shareButtonText = '스마트픽 안내';
                    shareLink = sharePickInfoLink;
                } else if (items.prod_div == 'S' && items.crspk_install_yn == 'Y') { //크로스픽
                    shareBarcode = '*교환권 번호 : ' + items.ecpn_no;
                    sharePlace = '*픽업장소 : ' + items.use_loc_nm + '\n';
                    sharePossibleDate = '*픽업가능일 : ' + sharePossibleDate.substr(0,4)+"년 "+sharePossibleDate.substr(4,2)+"월 "+sharePossibleDate.substr(6,2)+"일 "+ shareBusinessTime;
                    shareButtonText = '스마트픽 안내';
                    shareLink = sharePickInfoLink;
                }

                if ($scope.appObj.isApp) { // 앱일 경우
                    var params = {
                        type : "default",
                        title : shareTitle + shareBarcode,
                        desc : sharePlace + sharePossibleDate,
                        imageUrl : shareImg,
                        url : shareGoodsLink,
                        buttons : [
                            {
                                title : shareButtonText,
                                url : shareLink
                            }
                        ]
                    };

                    if($scope.appObj.isAndroid) {
                          $window.lotteshare.callAndroid("lotteshare://kakaotalk/query?" + JSON.stringify(params));
                    } else if ($scope.appObj.isIOS) {
                          $window.location = "lotteshare://kakaotalk/query?" + JSON.stringify(params);
                    }
                } else { // 웹일 경우 
                    // V2
                    Kakao.Link.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: shareTitle + shareBarcode,
                            description: sharePlace + sharePossibleDate,
                            imageUrl: shareImg,
                            link: {
                                mobileWebUrl: shareGoodsLink
                            }
                        },
                        buttons: [{
                            title: shareButtonText,
                            link: {
                                mobileWebUrl: shareLink
                            }
                        }]
                    });
                }
            } else { // V1 지원가능 앱일 경우    
                var k_money = items.sale_prc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                if(items.prod_div == 'W') {
                    var pickName = "방문예정일";
                    var k_date = items.smp_vst_fcst_dtime.substr(0,4)+"년 "+items.smp_vst_fcst_dtime.substr(4,2)+"월 "+items.smp_vst_fcst_dtime.substr(6,2)+"일";
                    var ecouponData = "";
                    var kakaoTalkText = "[롯데닷컴 스마트픽]\n";
                    kakaoTalkText += items.sndr_nm + "님이 보내신 예약증입니다.\n\n";
                    kakaoTalkText += "◆상품 정보◆\n";
                    kakaoTalkText += "▶ 상품명 : " + items.goods_nm + "\n";  
                    if(items.opt_desc != ""){
                        kakaoTalkText += "▶ 단품 : " + items.opt_desc + "\n";
                    }
                    kakaoTalkText += "▶ 수량 : " + items.rel_qty + "\n";
                    kakaoTalkText += "▶ 상품가격 : " + k_money +  "원\n";
                    kakaoTalkText += "▶ 방문매장 : " + items.use_loc_nm +  "\n";
                    kakaoTalkText += "▶ " + pickName + " : " + k_date + items.bsns_time + "\n";
                    kakaoTalkText += "▶ 교환권번호 : " + items.ecpn_no +  "\n";
                    if(items.exch_bil_use_goods_smp_cpn_no != "") {
                        kakaoTalkText += "▶ 다른상품픽 번호 : " + items.exch_bil_use_goods_smp_cpn_no + "\n";
                    }
                    kakaoTalkText += "\n" + "<유의사항>" + "\n";
                    kakaoTalkText += "- 상품이 준비되면 별도의 알람을 드립니다. 알람을 받은 후 픽업장소로  방문 바랍니다." + "\n";
                    kakaoTalkText += "- 픽업예정일 다음날까지 수령하지 않으면 주문이 자동으로 주문취소 됩니다." + "\n";
                    kakaoTalkText += "- 매장에서 다른 사이즈 및 컬러로 수령 가능합니다." + "\n";
                } else if(items.prod_div == 'E') {
                    var pickName = "유효기간";
                    var k_date = items.aval_term_strt_dtime.substr(0,4)+"년 "+items.aval_term_strt_dtime.substr(4,2)+"월 "+items.aval_term_strt_dtime.substr(6,2)+"일" + "~" + items.aval_term_end_dtime.substr(0,4)+"년 "+items.aval_term_end_dtime.substr(4,2)+"월 "+items.aval_term_end_dtime.substr(6,2)+"일";
                    var kakaoTalkText = "[롯데닷컴 스마트픽]\n";
                    kakaoTalkText += items.sndr_nm + "님이 보내신 예약증입니다.\n\n";
                    kakaoTalkText += "◆상품 정보◆\n";
                    kakaoTalkText += "▶ 상품명 : " + items.goods_nm + "\n";  
                    if(items.opt_desc != ""){
                        kakaoTalkText += "▶ 단품 : " + items.opt_desc + "\n";
                    }
                    kakaoTalkText += "▶ 수량 : " + items.rel_qty + "\n";
                    kakaoTalkText += "▶ 상품가격 : " + k_money +  "원\n";
                    kakaoTalkText += "▶ 사용매장 : " + items.use_loc_nm +  "\n";
                    kakaoTalkText += "▶ " + pickName + " : " + k_date + "\n";
                    kakaoTalkText += "▶ 주문번호 : " + items.ord_no +  "\n";
                    kakaoTalkText += "▶ 교환권번호 : " + items.ecpn_no +  "\n";
                    if(items.exch_bil_use_goods_smp_cpn_no != "") {
                        kakaoTalkText += "▶ 다른상품픽 번호 : " + items.exch_bil_use_goods_smp_cpn_no + "\n";
                    }
                    if(items.rfd_psbl_tgt_yn == 'Y') {
                        kakaoTalkText += "\n" + "◆환불 안내◆" + "\n";
                        if(items.auto_rfd_tgt_yn == 'Y'){
                            kakaoTalkText += "▶ 환불유형 : 자동환불 상품" + "\n";
                        } else if(items.auto_rfd_tgt_yn == 'N') {
                            kakaoTalkText += "▶ 환불유형 : 수동환불 상품" + "\n";
                        }
                        if(items.rfd_tgt_cd = '01') {
                            kakaoTalkText += "▶ 환불대상 : 주문자" + "\n";
                        } else if(data.rfd_tgt_cd = '02') {
                            kakaoTalkText += "▶ 환불대상 : 받는분" + "\n";
                        }
                        kakaoTalkText += "▶ 환불조건" + "\n";
                        kakaoTalkText += "1. 구매일로부터 5년 이내 교환권" + "\n";
                        kakaoTalkText += "2. 사용하지 않고 유효기간 지난 교환권" + "\n";
                        kakaoTalkText += "▶ 환불신청 방법" + "\n";
                        if(items.rfd_tgt_cd = '01') {
                            kakaoTalkText += "1. 환불대상이 주문자인 경우 환불 자동 신청" + "\n";
                        } else if(items.rfd_tgt_cd = '02') {
                            kakaoTalkText += "1. 환불대상이 받는분인 경우 \"로그인 > 마이롯데 > e쿠폰 환불신청\"에서 쿠폰번호 등록" + "\n";
                        }
                        if(items.auto_rfd_tgt_yn = 'Y') {
                            kakaoTalkText += "2. 자동환불 상품 : 유효기간 경과 후 롯데닷컴 ID 내 \"보관금\"으로 자동 환불" + "\n";
                        } else if(items.auto_rfd_tgt_yn = 'N') {
                            kakaoTalkText += "2. 수동환불 상품 : 유효기간 경과 후 고객센터로 문의 주세요. 등록된 쿠폰에 한하여 환불해 드립니다." + "\n";
                        }
                        kakaoTalkText += "\n" + "▶ 주의사항 및 유의사항은 상품 설명 페이지 > 기본정보에서 확인해주세요." + "\n";
                    }
                } else if(items.prod_div == 'S' && items.smp_install_yn == 'N' && items.crspk_install_yn == 'N') {
                    var pickName = "픽업예정일";
                    var k_date = items.smp_vst_fcst_dtime.substr(0,4)+"년 "+items.smp_vst_fcst_dtime.substr(4,2)+"월 "+items.smp_vst_fcst_dtime.substr(6,2)+"일";
                    var kakaoTalkText = "[롯데닷컴 스마트픽]\n";
                    kakaoTalkText += items.sndr_nm + "님이 보내신 교환권입니다.\n\n";
                    kakaoTalkText += "◆상품 정보◆\n";
                    kakaoTalkText += "▶ 상품명 : " + items.goods_nm + "\n";  
                    if(items.opt_desc != ""){
                        kakaoTalkText += "▶ 단품 : " + items.opt_desc + "\n";
                    }
                    kakaoTalkText += "▶ 수량 : " + items.rel_qty + "\n";
                    kakaoTalkText += "▶ 상품가격 : " + k_money +  "원\n";
                    kakaoTalkText += "▶ 사용매장 : " + items.use_loc_nm +  "\n";
                    kakaoTalkText += "▶ " + pickName + " : " + k_date + items.bsns_time + "\n";
                    kakaoTalkText += "▶ 교환권번호 : " + items.ecpn_no +  "\n";
                    if(items.exch_bil_use_goods_smp_cpn_no != "") {
                        kakaoTalkText += "▶ 다른상품픽 번호 : " + items.exch_bil_use_goods_smp_cpn_no + "\n";
                    }
                    //2016-06-07 수정 start (by jdkim33) 
                    kakaoTalkText += "<유의사항>" + "\n"; 
                    kakaoTalkText += "* 상품준비가 완료되면 알림 문자를 드립니다. 확인 후 픽업장소로 방문바랍니다." + "\n";
                    kakaoTalkText += "* 매장에서 다른 사이즈 및 컬러로 수령 가능합니다." + "\n";
                    kakaoTalkText += "* 픽업예정일 다음날까지 수령하지 않으면, 주문이 자동으로 취소됩니다." + "\n";
                    kakaoTalkText += "* 픽업예정일 변경이 가능합니다. (상품당 1회)" + "\n";
                    kakaoTalkText += "  픽업예정일 변경안내 : http://s.lotte.com/Change" + "\n";         
                    //2016-06-07 수정 end (by jdkim33)                
                } else if(items.prod_div == 'S' && items.smp_install_yn == 'Y') {
                    var pickName = "상담예정일";
                    var k_date = items.smp_vst_fcst_dtime.substr(0,4)+"년 "+items.smp_vst_fcst_dtime.substr(4,2)+"월 "+items.smp_vst_fcst_dtime.substr(6,2)+"일";
                    var kakaoTalkText = "[롯데닷컴 스마트픽]\n";
                    kakaoTalkText += items.sndr_nm + "님이 보내신 상담권입니다.\n\n";
                    kakaoTalkText += "◆상담 정보◆\n";
                    kakaoTalkText += "▶ 상담명 : " + items.goods_nm + "\n";  
                    if(items.opt_desc != ""){
                        kakaoTalkText += "▶ 단품 : " + items.opt_desc + "\n";
                    }
                    kakaoTalkText += "▶ 수량 : " + items.rel_qty + "\n";
                    kakaoTalkText += "▶ 상품가격 : " + k_money +  "원\n";
                    kakaoTalkText += "▶ 상담매장 : " + items.use_loc_nm +  "\n";
                    kakaoTalkText += "▶ " + pickName + " : " + k_date + items.bsns_time + "\n";
                    kakaoTalkText += "▶ 상담권번호 : " + items.ecpn_no +  "\n";
                    if(items.exch_bil_use_goods_smp_cpn_no != "") {
                        kakaoTalkText += "▶ 다른상담픽 번호 : " + items.exch_bil_use_goods_smp_cpn_no + "\n";
                    }
                    kakaoTalkText += "<유의사항>" + "\n"; 
                    kakaoTalkText += "* 지정한 상담매장에서만 상담 가능합니다." + "\n";
                    kakaoTalkText += "* 상담예정일 +2일까지 방문상담 가능합니다. (방문하지 않을 시 주문취소) 설치상품의 주문완료는 상담예약만을 한 것이며, 매장 방문 후 설치예정일을 협의하셔야 설치가 가능합니다." + "\n";
                    kakaoTalkText += "* 상담예정일 변경은 롯데닷컴 고객센터 또는 모바일에서 가능합니다." + "\n";
                } else if(items.prod_div == 'S' && items.crspk_install_yn == 'Y') { //크로스픽
                    var k_date = items.smp_vst_fcst_dtime.substr(0,4)+"년 "+items.smp_vst_fcst_dtime.substr(4,2)+"월 "+items.smp_vst_fcst_dtime.substr(6,2)+"일";
                    var kakaoTalkText = "★ 보내시는 분의 메시지\n";              
                    kakaoTalkText += items.msg_cont + "\n\n";
                    kakaoTalkText += items.sndr_nm + " 고객님 편의점에 상품이 도착하였습니다.\n\n";                
                    kakaoTalkText += "교환권번호 : " + items.ecpn_no + "\n";
                    kakaoTalkText += "주문상품 : " + items.goods_nm + "\n";
                    kakaoTalkText += "픽업장소 : " + items.use_loc_nm + "\n\n";
                    kakaoTalkText += "도착일로부터 5일 경과 시점까지 수령하지 않으면 자동으로 반품됩니다. \n반품 시 반품배송료 차감 후 환불됩니다. \n";                
                }
                kakaoTalkText += "\n" + "▶ 롯데닷컴 고객센터 : 1577-1110" + "\n";
                kakaoTalkText += "단, 주말/공휴일은 1599-8437로 연락바랍니다." + "\n";    //2016-06-07 수정 02-6744-5004 -> 1599-8437 (by jdkim33)
                kakaoTalkText += "▶ 스마트픽 앱 URL : m.lotte.com/spp.do"     + "\n";
                
                var params = {
                        url : 'smartpick',
                        title : kakaoTalkText,
                        imageUrl : shareImg
                    };
                if($scope.appObj.isAndroid) {
                      $window.lotteshare.callAndroid("lotteshare://kakaotalk/query?" + JSON.stringify(params));
                } else if($scope.appObj.isIOS) {
                      $window.location = "lotteshare://kakaotalk/query?" + JSON.stringify(params);
                }     
            }

            $scope.sendTclick('m_DC_Smartpicklist_Clk_Shr_2');
        };
        
        // 예약증 보내기 팝업 닫기
        $scope.sendPickPopupClose = function() {
    		$scope.sendPickPopupFlag[$scope.thisPopupPickIdx] = false;
    		$scope.dimmedClose();
        	$scope.thisPopupPickIdx = 0;
        }
        
       /*########################  크로스픽 구글맵 ######################## */
        $scope.google_map = function(item){
            $scope.mapViewFlag = !$scope.mapViewFlag;   
            if($scope.mapViewFlag){
                var param = "crspk_yn=Y&crspk_map=Y&crspk_corp_cd=" + item.crspk_corp_cd +
                    "&crspk_corp_str_sct_cd=" + item.crspk_corp_str_sct_cd+
                    "&crspk_str_no=" + item.crspk_str_no;                                
                $scope.google_map_url = LotteCommon.pickMapUrl + "?" + param; 
            }else{
                //$scope.google_map_url = ""; //닫을때에는 초기화 
            }            
        }
        //20170912 네이버맵 -> 구글맵 백화점용
        $scope.google_map_dept = function(item){             
            $scope.mapViewFlag = !$scope.mapViewFlag;    
            $scope.$broadcast('showStoreMap', {
                goods_no: item.goods_no, 
                entr_no: item.entr_no, 
                entr_contr_no: item.entr_contr_no, 
                smp_ecoupon_yn: "N"
            });            
        }
      //######################## map start
        /*네이버 지도정보*/
    	 //지점 담을 변수 대카 중카 소카 
        $scope.regionName0st = [];
        $scope.regionName1st = [];
        $scope.regionName2st = [];
        $scope.regionStoreList = [];
        $scope.reqParam = [];
        $scope.naverStoreName;
        $scope.naverStoreAddr;
        
        $scope.naver_store_map = function(arg, isLoadScript, smpEtNo, smpEtContrNo, smp_goods_type){
        	$scope.smp_goods_type = smp_goods_type;
        	
        	if($scope.smp_good_type == '0101DEP' || $scope.smp_good_type == '0101ETC' || $scope.smp_good_type == '0102ETC'){
        		$scope.smp_good_type = 'Y';
        	} else {
        		$scope.smp_good_type = 'N';
        	}
        
        	if (typeof isLoadScript != 'boolean' || isLoadScript === false) 
        	{
        		$scope.mapViewFlag = !$scope.mapViewFlag;
        		LoadScript("http://map.naver.com/js/naverMap.naver?key=956f6f619b13d3caf5540349078f9593", function(){$scope.naver_store_map(arg, true, smpEtNo, smpEtContrNo, smp_goods_type);});
        		return;	
        	}
        	console.log('naver_store_map called!!');
        	$scope.isNaverStoreMapData = false;
        	$scope.reqParam.goods_no = arg;
        	$scope.reqParam.smp_entr_no = smpEtNo;
        	$scope.reqParam.smp_entr_contr_no = smpEtContrNo;
        	$scope.reqParam.smp_ecoupon_yn = $scope.smp_good_type;
        	$http.get(LotteCommon.productMobileNaverMap, {params:$scope.reqParam})
            .success(function(data) {
            	console.log('naver_store_map Success!!');
            	$scope.naverStoreMapData = data.mobileNaverMap; /*상품기본정보 로드*/
                $scope.isNaverStoreMapData = true;
                
                var smpShopList = $scope.naverStoreMapData.smartpick_store_addr;
            	var separator = "|;|";
            	var currentOptionValue = "";
            	var totalLocCnt = 0;
            	var currentLocalShopCode = "0";
            	var Smartpick_region = $scope.naverStoreMapData.smartpick_region;
            	$scope.regionName0st = Smartpick_region;
            	console.log('smpShopList.total_count',smpShopList.total_count);
            	if(smpShopList.total_count == 1){
            		console.log('Smartpick_region',Smartpick_region[0]);
	            	console.log('smpShopList',smpShopList.items[0]);
	            	//한건일 경우 바로 지도 이미지 가져오기호출
	            	//smpShopList.get(i).getPostAddr()+ " " +smpShopList.get(i).getDtlAddr()
	            	 $scope.getMapPoint(smpShopList.items[0].post_addr+ " " +smpShopList.items[0].dtl_addr);
	            	 $scope.naverStoreName=smpShopList.items[0].shop_nm;
	                 $scope.naverStoreAddr=smpShopList.items[0].post_addr+smpShopList.items[0].dtl_addr;
            	}else if(smpShopList.total_count >	1){
            		var smpShopListItems = $scope.naverStoreMapData.smartpick_store_addr.items;
	            	if(smpShopList != null && smpShopList.total_count >	0){
	            		currentLocalShopCode = smpShopList.items[0].shop_no;
	            	}
	            	
	            	/** 기본 업체 지점 Select Box 영역 문자열 생성 */
	            	if(smpShopListItems != null && smpShopListItems.length >0){
	            		for(var i=0; i<smpShopListItems.length; i++){
	            			var localShopCode = smpShopListItems[i].shop_no;
	            			var localAddress = smpShopListItems[i].post_addr+ " " +smpShopListItems[i].dtl_addr;
	            			var localShopName = smpShopListItems[i].shop_nm;
	            			var localPhoneNo = smpShopListItems[i].asgd_phon;
	            			var optionValue = localShopCode + separator + localShopName.replace("\"", "\\\"") + separator + localAddress.replace("\"", "\\\"") + separator + localPhoneNo.replace("\"", "\\\"");
	            			
	            			/* 화면에 출력할 지점 정보 생성 */
	            			if( currentLocalShopCode.length==0 && currentOptionValue.length==0 ) {
	            				currentOptionValue = optionValue;
	            			}

	            			/* Map URL Copy를 위한 Select box 선택 정보 생성 */
	            			if( currentLocalShopCode == localShopCode ) {
	            				currentOptionValue = optionValue;
	            			}			
	            		}
	            	}
            	}
            })
            .error(function() {
                console.log('Data Error : Download 실패');
               // alert('매장위치 조회 중 오류가 발생하였습니다.\n잠시 후 조회해 주세요.');
            });
        };
        
        //지도가져오기
        $scope.getMapPoint = function(value){
        	console.log('getMapPoint',value);
        	var address = "";
        	address = value.replace(/ /g,"");
    		  address = value.replace(/\s/g,"");
//    		  var map_link_url = LotteCommon.mapiSSLUrl + "/product/crossdomain.do?query="+address;
    		  var map_link_url = LotteCommon.naverMapInfo + "?query=" + address;
        	console.log('map_link_url',map_link_url);
        	$http.get(map_link_url)
            .success(function(data) {
            	var pointText = data;
    				var xpoint = pointText.substring(pointText.indexOf('<x>')+3,pointText.indexOf('</x>'));
    				var ypoint = pointText.substring(pointText.indexOf('<y>')+3,pointText.indexOf('</y>'));
            	
            	// 서울 중구 소공1동
//                var xpoint = 310168;
//                var ypoint = 551866;
                
                // 강남
//                var xpoint = 315219;
//                var ypoint = 544611;
                
                console.log('xpoint',xpoint);
    			console.log('ypoint',ypoint);
    			
//				$scope.mapScriptLoad();
				$scope.display_marker('1',xpoint,ypoint);
				
            })
            .error(function() {
                console.log('getMapPoint : Download 실패');
//                $scope.display_marker('1',309967,551771);
               // alert('매장위치 조회 중 오류가 발생하였습니다.\n잠시 후 조회해 주세요.');
            });	

    	};
    	
    	var MARKER_KEY = "marker";
    	var iconcenter = "http://static.naver.com/maps/ic_spot.png";
    	var latlng = "";
    	var mapObj;
    	
    	var zoom;
    	
    	var centermarker;
    	
    	//이벤트에서 호출하는 이전 센터 마커는 삭제 하고 새로운 센터 마커를 표시
        $scope.senddraged = function(movepos){
    		zoomlevel=mapObj.getZoom();
    		nposx=(movepos[0]+movepos[2])/2;
    		nposy=(movepos[1]+movepos[3])/2;
    		mapObj.removeOverlay(centermarkercross);
    		centermarkercross = new NMark(new NPoint(nposx,nposy),new NIcon(iconcentercross,new NSize(52,41)));
    		mapObj.addOverlay(centermarkercross);
    	};
    	
    	$scope.mapScriptLoad = function(){
    		
    		mapObj = new NMap(document.getElementById("mapContainer"),313,290);
    		zoom =new NZoomControl();
    		zoom.setAlign("right");
    		zoom.setValign("top");
    		mapObj.addControl(zoom);
    		//지도를 휠로 조절한다.
    		mapObj.enableWheelZoom();
    		//지도 가운데 이미지 마커를 표시함.
    		
    		NEvent.addListener(mapObj,"endDrag",$scope.senddraged);
    	};
    	
    	$scope.display_marker = function(recordUser,recordLat,recordLon) {
    		//clearMarkers();//마크 텍스트 박스 삭제
    		mapObj= new NMap(document.getElementById("mapContainer"));
    		
    		mapObj.clearOverlays(MARKER_KEY);//마크 텍스트 박스 삭제
    	    var new_marker_point  = new NPoint(recordLat,recordLon);  	    
    	    var new_marker_map  = new NPoint(parseInt(recordLat)+10,parseInt(recordLon)+30);
    	    //TM128 좌표를 경위도 좌표로 변환한다.
    	    latlng = mapObj.fromTM128ToLatLng(new_marker_point);
    	    //지도 가운데 이미지 마커를 표시함.
    	    var marker = new NMark(latlng, new NIcon(iconcenter,new NSize(52,41),new NSize(14,40)));
    	    $scope.centerDispMarker(latlng);
    	    //입력좌표 지도로 이동합니다.
    	    mapObj.setCenterAndZoom(new_marker_point,2);
    	};
    	
    	//마커를 모두 삭제 합니다.
    	$scope.clearMarkers = function() {
    	    mapObj.clearOverlays(MARKER_KEY);
    	}
    	
    	//신규 마커이미지 여러개를 표시합니다.
    	$scope.display_marker_list= function(recordUser,recordLat,recordLon) {
    	    var new_marker_point  = new NPoint(recordLat,recordLon);
    	    //TM128 좌표를 경위도 좌표로 변환한다.
    	    latlng = mapObj.fromTM128ToLatLng(new_marker_point);
    	    //지도 가운데 이미지 마커를 표시함.
    	    var marker = new NMark(latlng, new NIcon(iconcenter,new NSize(52,41),new NSize(14,40)));
    	    $scope.centerDispMarker(latlng);
    		//입력좌표 지도로 이동합니다.
    		mapObj.setCenterAndZoom(new_marker_point,2);
    	}  
    	
    	//센터 위치에 마커 표시
    	$scope.centerDispMarker = function(latlng){
    		centermarker = new NMark(latlng,new NIcon(iconcenter,new NSize(52,41),new NSize(14,40)));
    		mapObj.addOverlay(centermarker,MARKER_KEY);
    	};
    	
    	//select box에서 선택 할경우 지도 
    	$scope.getMapselected = function(searchVal) {
        	console.log('getMapselected',searchVal);
        	//select box 경우에 확인 하기 fun_gubun S
    		if(searchVal != ""){
        		var paramArr = searchVal.split("^");
        		//{{item.shop_no }}^{{item.entr_no}}^{{item.entr_contr_no}}^{{item.post_addr}}^{{item.dtl_addr}}
        		$scope.getMapPoint(paramArr[3]+paramArr[4]);
        		$scope.naverStoreName=paramArr[5];
                $scope.naverStoreAddr=paramArr[3]+paramArr[4];
        		
    		}else{
    			alert("본 상품의 매장정보는 제공하고 있지 않습니다.");
    		}
        };
        
        //region 1
        $scope.getRegionName1stSelected = function(region,regionGubun){
       	//$scope.regionName0st; 변경 없음
        //$scope.regionName1st;	초기화 필요
        //$scope.regionName2st; 초기화 필요
        //$scope.regionStoreList;     초기화 필요 	
        	console.log('getRegionName1stSelected',region+"|"+regionGubun);
        	var regionItems = $scope.naverStoreMapData.smartpick_store_addr.items;
        	var regionVal0;
        	var regionVal1;
        	var regionVal2;
        	
        	region = region.replace(/ /g,"");
        	region = region.replace(/\s/g,"");
        	if(regionItems != null && regionItems.length >0){
        		//초기화
        		if(regionGubun == 0){
        			$scope.regionName1st = [];
        			$scope.regionName2st = [];
        			$scope.regionStoreList = [];
        		}else if(regionGubun == 1){
        			$scope.regionName2st = [];
        			$scope.regionStoreList = [];
        		}else if(regionGubun == 2){
        			$scope.regionStoreList = [];
        		}

        		for(var i=0; i<regionItems.length; i++){
        			var regionPostAddr = regionItems[i].post_addr.split(" ");
        			regionVal0 = regionPostAddr[0];
        			regionVal1 = regionPostAddr[1];
        			regionVal2 = regionPostAddr[2];
        			//console.log('regionPostAddr',regionPostAddr.length+"|"+regionVal0+"|"+regionVal1+"|"+regionVal2);
        			//ex)서울특별시 
        			if(regionGubun == 0){
        				
        				regionVal0 = regionVal0.replace(/ /g,"");
        				regionVal0 = regionVal0.replace(/\s/g,"");
        				if(region == regionVal0){
        					console.log('regionVal1',regionVal1);
        					$scope.regionName1st.push(regionVal1);
        				}
        				
        			}else if(regionGubun == 1){

        				regionVal1 = regionVal1.replace(/ /g,"");
        				regionVal1 = regionVal1.replace(/\s/g,"");
        				if(region == regionVal1){
        					console.log('regionVal2',regionVal2);
        					$scope.regionName2st.push(regionVal2);
        				}
        			}else if(regionGubun == 2){

        				regionVal2 = regionVal2.replace(/ /g,"");
        				regionVal2 = regionVal2.replace(/\s/g,"");
        				
        				if(region == regionVal2){
        					console.log('regionVal2',regionVal2);
        					$scope.regionStoreList.push(regionItems[i]);
        				}
        			}
        		}
        	}
        };
    	
        var LoadScript = function(src, callback, charset, defer, id) {
        	if (typeof src != 'string' || src == undefined) return;
        	
        	var isLoaded= false;
        	var head	= document.getElementsByTagName('head')[0];	
        	var script	= document.createElement('script');
        	var charset	= (charset && typeof charset == 'string') ? charset : 'UTF-8';
        	
        	if (id && typeof id == 'string' && id != ''){
        		script.id = id;
        	}
        	script.src = src;
        	script.charset = charset;
        	script.type	 = 'text/javascript';
        	script.async = true;
        	script.defer = (typeof defer == 'boolean') ? defer : true;
        	
        	if (typeof callback == 'function') {
        		script.onreadystatechange = function() {
        			if (this.readyState == 'loaded' || this.readyState == 'complate') {
        				if (isLoaded) return;
        				window.setTimeout(callback(), 1);
        				isLoaded = true;				
        			}
        		};
        		script.onload = function() {
        			if (isLoaded) return;
        			window.setTimeout(callback(), 1);
        			isLoaded = true;
        		};
        	}	
        	head.appendChild(script);
        };
        
        /*****************************************
         * 날짜 세팅
         *****************************************/
        function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
            return num < 10 ? "0" + num : num + "";
        }

        $scope.todayDateTime = new Date();
        $scope.todayDate = $scope.todayDateTime.getFullYear() + getAddZero($scope.todayDateTime.getMonth() + 1) + getAddZero($scope.todayDateTime.getDate()); // 년월일
        $scope.todayHours = $scope.todayDateTime.getHours();
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/smartpick/pick_view_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });
    
    // 예약증 보내기 팝업
    app.directive('sendPick', ['$window', '$location', function($window, $location) {
        return {
        	templateUrl:'/lotte/resources_dev/smartpick/send_pick.html',
            replace:true,
            link:function($scope, el, attrs) {
            	
            }
        };
    }]); 
    
    app.directive('pickMapInfo', ['$window', '$location', function($window, $location) {
        return {
        	templateUrl:'/lotte/resources_dev/smartpick/pick_map_info.html',
            replace:true,
            link:function($scope, el, attrs) {
        		console.log('naverMapInfo', 'called');
        		
            }
        };
    }]);  

})(window, window.angular);