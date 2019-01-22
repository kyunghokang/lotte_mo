(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.filter('strToDate', [function() {
    	return function(item) {
    		//item.substr(0,4)+"년 "+
    		return item.substr(4,2)+"월 "+item.substr(6,2)+"일";
    	}
    }]);
    
    app.controller('SmartPickCtrl', ['$scope', '$http', '$window', 'commInitData', 'LotteCommon', function($scope, $http, $window, commInitData, LotteCommon) {
    	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "스마트픽/e-쿠폰 교환권"; //서브헤더 타이틀        
        
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
        
        $scope.isShowLoadingImage = true; // 로딩이미지 출력 여부
        
        $scope.smartPickPopFlag = false; //교환권 팝업
        
        $scope.smartPickListFlag = true; // 스마트픽교환권 탭
        $scope.eCouponListFlag = false; // 이쿠폰리스ㅂ트 탭
        $scope.useGubn = 1;
        $scope.termGubn = '';
        
        $scope.thisPopupPickIdx = 0;
        $scope.thisChangePickIdx = 0;

        $scope.sendPickPopupFlag = [];
        $scope.sendPickPopupFlag[$scope.thisPopupPickIdx] = false; // 예약증보내기 팝업
        
        $scope.changePickPopup = [];
        $scope.changePickPopup[$scope.thisChangePickIdx] = false; // 예약증 변경하기 팝업
        
        
        $scope.dayOne = '';
        $scope.dayTwo = '';
        $scope.dayThree = '';
        
        $scope.pageStart = 0;
        $scope.pageSize = 20;
        $scope.smartPickData = [];
        $scope.changeDateList = [];
		$scope.smp_end_yn = false; //2017-12-26 추가
        Kakao.cleanup();
    	Kakao.init("574659987ca46095c123d71f72abac14");
        
        //파라메터 get
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        //사용기간구분값 D7:최근 7일 D15:최근 15일 M1:최근 1개월 M3:최근 3개월	- 기본 한달 M1
        if (getParameterByName('search_flag') == ""){
        	$scope.searchParam = "M1";
        } else {
        	$scope.searchParam = getParameterByName('search_flag');	
        }
        //쿠폰 사용 가능 코드 0:전체 1:사용가능, 2:사용불가, 3:사용완료
        if (getParameterByName('cpn_state_cd') == ""){
        	$scope.usedGubnParam = "1";
        } else {
        	$scope.usedGubnParam = getParameterByName('cpn_state_cd');	
        }
        $scope.smartYnParam = getParameterByName('smp_yn'); //스마트픽 여부		
        $scope.ordNoParam = getParameterByName('ord_no');  //주문번호
        $scope.ordSnParam = getParameterByName('ord_dtl_sn');//주문순번
        
        $scope.changeDateFn = function(item) {
    		return item.substr(9,17);
    	}
        
        // Data url
        var smartPickListData = LotteCommon.smartPicKListData + "?" + $scope.baseParam + "&search_flag=" + $scope.searchParam + "&cpn_state_cd=" + $scope.usedGubnParam + "&ord_no=" + $scope.ordNoParam + "&ord_dtl_sn=" + $scope.ordSnParam;    

        $scope.smartPickList = [];
        $scope.addSmartPickData = function(smartpickList){
        	$scope.smartPickList = [];
        	angular.forEach(smartpickList, function(val, key) {
//        		if (val.d_day_cnt == -1){
//       				val.d_day_cnt = Math.abs(val.d_day_cnt);
//       			} else if (val.d_day_cnt < -1){
//       				val.d_day_cnt = 0;
//       				val.ord_cncl_psbl_yn = 'N';
//       			} else {
//       				val.d_day_cnt = 0;
//       			}
        		$scope.smartPickData.push(val);
       		});
        }

        // Data Load
        $scope.getSmartPickDataLoad = function() {
        	$scope.thisPage++;
        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
        		return;
        	}
        	try {
        		$http.get(smartPickListData)
    	        .success(function(data) {
    	        	// smartPick Total
    	        	$scope.smartPickTotal = data.obj.smp_cpn_cnt;
    	       		// 스마트픽 리스트
    	        	$scope.addSmartPickData(data.obj.smartpick);
    	        	$scope.morePick();
    	        	$scope.isShowLoadingImage = false; // 로딩이미지 출력 여부
    	        	// 변경하기 날짜
    	        	if(data.obj.RESPONSE_MSG == "정상") {
    	        		$scope.changeDateList = data.obj.smartpick[0].smp_vst_avlbl_dt;	
    	        	} else {
    	        		$scope.changeDateList = "";
    	        	}
    	        })
    	        .error(function(data, status, headers, config){
    	            console.log('Error Data : ', status, headers, config);
    	        });
        	} catch(e) {
        		console.log('Data load error........')
        	}
        }
        
        $scope.page_end = 0;
        $scope.thisPage = 0;
        $scope.getSmartPickDataLoad();
        
        $scope.morePick = function() {
        	for(i=$scope.pageStart; i < $scope.smartPickTotal && i < ($scope.pageStart+$scope.pageSize); i++) {
        		$scope.smartPickList.push($scope.smartPickData[i]);
        	}
        	$scope.pageStart = $scope.pageStart + $scope.pageSize;
        }
        
        $scope.moreListClick = function() {
        	$scope.morePick();
    	}
        
        // 경과일자
        $scope.findOverDay = function(orginalDate) {
        	var newDate = new Date();            
            var todayYYYY = newDate.getFullYear();
            var todayMM = newDate.getMonth();
            var todayDD = newDate.getDate();
            if((''+todayMM).length == 1){
            	todayMM = '0' + todayMM;
            }
            if((''+todayDD).length == 1){
            	todayDD = '0' + todayDD;
            }            
            var afteryyyy = orginalDate.substr(0,4);
            var aftermm = parseInt(orginalDate.substr(4,2)) - 1;
            if((''+aftermm).length == 1){
            	aftermm = '0' + aftermm;
            }            
            var afterdd = orginalDate.substr(6,2);            
            $scope.tempDate2 = new Date(afteryyyy,aftermm,afterdd).getTime();
            $scope.toDay = new Date(todayYYYY,todayMM,todayDD).getTime();
            var result = 0;
            if($scope.tempDate2 >= $scope.toDay){                
                result = 0;
            }else{
                result = ($scope.toDay - $scope.tempDate2)/1000/60/60/24;    
            }
            //console.log("result:", $scope.toDay,$scope.tempDate2,result,afteryyyy,aftermm,afterdd,todayYYYY,todayMM,todayDD);
            return result;
        }
        
        // 제품보기 20180306 수정
        $scope.goSmartPickProduct = function(items) {
            $window.location.href = LotteCommon.baseUrl + "/product/m/product_view.do?goods_no=" + items.good_no + "&" + $scope.baseParam ;    
        }
        
        // go deatil
        $scope.smartPickDetail = function(items) {
            //크로스픽 추가
        	if(items.crspk_install_yn != undefined && items.crspk_install_yn == 'N' && items.crspk_yn != undefined && items.crspk_yn == 'Y'){
        		 alert('스마트픽 픽업 교환권은 스마트픽 픽업 매장에서 \n픽업준비완료 후 바코드가 생성됩니다.\n\n픽업준비완료 후 교환권을 확인해주세요.');
        		 return false;
        	}
            //20180306
            if(items.prod_div == 'S' && items.smp_install_yn == 'N' && items.ord_dtl_stat_cd != '15'){
                alert("상품준비가 완료된 후 교환권 확인 및 발송이 가능합니다.");    
            }else{
                $window.location.href = LotteCommon.smartPickDetailUrl + "?ord_no=" + items.ord_no + "&ord_dtl_sn=" + items.ord_dtl_sn + "&" + $scope.baseParam + $scope.smpParam;
            } 
        }
        
        // 예약변경 팝업
        $scope.changePick = function(items) {
        	$scope.thisItems = items;
        	
        	$scope.originalDate = items.smp_vst_fcst_dtime;
        	$scope.thisChangePickIdx = items.ord_no + items.ord_dtl_sn;
        	$scope.changePickPopup[$scope.thisChangePickIdx] = true;
        	
        	if(items.ord_cncl_psbl_yn == 'N'){
        		alert("스마트픽 예약일 변경이 불가능합니다.")
        		return false;
        	}
            
            $scope.dimmedOpen({
				target : "change_popup["+$scope.thisChangePickIdx+"]",
				callback: $scope.changePickClose
			});
        }
        
        // 예약변경 팝업 닫기
        $scope.changePickClose = function() {
    		$scope.changePickPopup[$scope.thisChangePickIdx] = false;
    		$scope.dimmedClose();
        	$scope.thisChangePickIdx = 0;
        }
        
        // 예약변경 
        $scope.changeSmartPick = function(changeDate, items) {
        	if(!changeDate){
        		alert("예약변경일자를 선택하여 주시기 바랍니다.");
        		return false;
        	}
        	if(items.ord_cncl_psbl_yn == 'N'){
        		alert("스마트픽 예약일 변경이 불가능합니다.")
        		return false;
        	}
        	var postParams = angular.extend({
        		ord_no		: items.ord_no,	//주문번호		
        		ord_dtl_sn	: items.ord_dtl_sn,	//주문순번
        		ecpn_no		: items.ecpn_no,	//이쿠폰번호
        		smp_vst_fcst_dtime	: changeDate.substr(0,8),	//변경일자 YYYYMMDD
        		smp_tp_cd   : items.smp_tp_cd //픽업유형
        	},$scope.baseParam);
			$http({
				url : '/json/smartpick/reservation_update.json',
				data : $.param(postParams),
				method : 'POST',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
			}) // AJAX 호출
			.success(function (data, status, headers, config) { // 호출 성공시
				alert(data.responseMsg);
				$window.location.href = LotteCommon.smartPickListUrl + "?" + $scope.baseParam + "&search_flag=" + $scope.searchParam + "&cpn_state_cd=" + $scope.usedGubnParam + "&ord_no=" + $scope.ordNoParam + "&ord_dtl_sn=" + $scope.ordSnParam;
			})
			.error(function (data, status, headers, config) { // 호출 실패시
				alert("error");
			});
			
        }
        
        // 예약증 보내기 팝업
        $scope.sendPickPopup = function(items) {
            //크로스픽 추가
        	if(items.crspk_install_yn != undefined && items.crspk_install_yn == 'N' && items.crspk_yn != undefined && items.crspk_yn == 'Y'){
        		 alert('스마트픽 픽업 교환권은 스마트픽 픽업 매장에서 \n픽업준비완료 후 바코드가 생성됩니다.\n\n픽업준비완료 후 교환권을 확인해주세요.');
        		 return false;
        	}
            
        	$scope.thisItems = items;
        	$scope.thisPopupPickIdx = items.ord_no + items.ord_dtl_sn;
        	$scope.sendPickPopupFlag[$scope.thisPopupPickIdx] = true;
        	$scope.dimmedOpen({
				target : "send_popup["+$scope.thisPopupPickIdx+"]",
				callback: $scope.sendPickPopupClose
			});
        }
        
        // 예약증 보내기 팝업 닫기
        $scope.sendPickPopupClose = function() {
    		$scope.sendPickPopupFlag[$scope.thisPopupPickIdx] = false;
    		$scope.dimmedClose();
        	$scope.thisPopupPickIdx = 0;
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
        
        // 예약증 문자 다시 보내기
        $scope.sendPickSms = function(smartPickDetail) {
        	var postParams = angular.extend({
        		goods_no        : smartPickDetail.goods_no, //상품코드
        		ecpn_no         : smartPickDetail.ecpn_no,  //이쿠폰번호
        		send_sct_cd     : "2",  //전송유형코드 (1:MMS, 2:SMS, 3:EMAIL)
        		adre_no         : smartPickDetail.adre_no,  //고객전화번호
        		sndr_no         : smartPickDetail.sndr_no,  //발송자전화번호
        		adre_nm         : smartPickDetail.adre_nm,  //고객명
        		sndr_nm         : smartPickDetail.sndr_nm,  //발송자명
        		msg_cont        : smartPickDetail.msg_cont,  //추가메시지
        		rsv_yn          : smartPickDetail.rsv_yn,  //예약발송여부
        		shop_no         : smartPickDetail.shop_no,  //사용처번호
        		ord_qty         : smartPickDetail.ord_qty  //예약수량	
        	},$scope.baseParam);
			$http({
				url : '/json/smartpick/reservation_send_mms.json ',
				data : $.param(postParams),
				method : 'POST',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
			}) // AJAX 호출
			.success(function (data, status, headers, config) { // 호출 성공시
				console.log(data.data_set.response_msg);
				console.log(status);
				alert(data.data_set.response_msg);
				$window.location.href = LotteCommon.smartPickListUrl + + "?" + $scope.baseParam + "&search_flag=" + $scope.searchParam + "&cpn_state_cd=" + $scope.usedGubnParam + "&ord_no=" + $scope.ordNoParam + "&ord_dtl_sn=" + $scope.ordSnParam;
			})
			.error(function (data, status, headers, config) { // 호출 실패시
				alert("error");
			});
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
                shareGoodsLink = items.goods_no != "" ? location.protocol + "//" + location.hostname + '/product/m/product_view.do?goods_no=' + items.goods_no : location.protocol + "//" + location.hostname, // 상품상세 링크
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
        
        // 사용가능상태 선택 셀렉트 박스
        $scope.useGubnClick = function(useGubn, termGubn) {
        	$scope.pageStart = 0;
        	$scope.smartPickData = [];
        	
        	$scope.useGubn = useGubn;
        	if($scope.useGubn == '1') {
        		$scope.termGubn = '';        		
        	} else {
        		$scope.termGubn = 'M1';
        	}
        	
        	$scope.smartPickList = [];
        	var smartPickListData = "";
        	var smartPickListData = LotteCommon.smartPicKListData + "?" + $scope.baseParam + "&search_flag=" + $scope.termGubn + "&cpn_state_cd=" + $scope.useGubn + "&ord_no=" + $scope.ordNoParam + "&ord_dtl_sn=" + $scope.ordSnParam;
        	
        	$scope.thisPage++;
        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
        		return;
        	}
	        $http.get(smartPickListData)
	        .success(function(data) {
	        	// smartPick Total
	        	$scope.smartPickTotal = data.obj.smp_cpn_cnt;
	        	// ecoupon Total
	        	$scope.eCouponTotal = data.obj.smp_cpn_cnt;
	       		// 스마트픽 리스트
	        	//$scope.page_end = parseInt(data.obj.page_end);
	        	$scope.addSmartPickData(data.obj.smartpick);
	        	$scope.morePick();
	        })
	        .error(function(data, status, headers, config){
	            console.log('Error Data : ', status, headers, config);
	        });
        }
        
        // 사용기간 선택 셀렉트 박스
        $scope.termGubnClick = function(useGubn, termGubn) {
        	$scope.pageStart = 0;
        	$scope.smartPickData = [];
        	
        	$scope.useGubn = useGubn;
        	$scope.termGubn = termGubn;
        	
        	$scope.smartPickList = [];
        	var smartPickListData = "";
        	var smartPickListData = LotteCommon.smartPicKListData + "?" + $scope.baseParam + "&search_flag=" + $scope.termGubn + "&cpn_state_cd=" + $scope.useGubn + "&ord_no=" + $scope.ordNoParam + "&ord_dtl_sn=" + $scope.ordSnParam;
        	
        	$scope.thisPage++;
        	if($scope.page_end < $scope.thisPage && $scope.page_end != 0) {
        		return;
        	}
	        $http.get(smartPickListData)
	        .success(function(data) {
	        	// smartPick Total
	        	$scope.smartPickTotal = data.obj.smp_cpn_cnt;
	        	// ecoupon Total
	        	$scope.eCouponTotal = data.obj.smp_cpn_cnt;
	       		// 스마트픽 리스트
	        	//$scope.page_end = parseInt(data.obj.page_end);
	        	$scope.addSmartPickData(data.obj.smartpick);
	        	$scope.morePick();
	        })
	        .error(function(data, status, headers, config){
	            console.log('Error Data : ', status, headers, config);
	        });
        }
        
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

    app.directive('lotteContainer', ['commInitData', 'LotteLink', 'LotteCommon' ,function(commInitData, LotteLink, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/smartpick/pick_list_container.html',
            replace : true,
            link : function($scope, el, attrs) {

                $scope.todayDate2 = new Date();
    			//  2017-12-26 스마트픽 앱 종료 팝업 추가
    			// 날짜 설정으로 운영되는 요소에 대한 테스트 코드
    			var todayYear = new Date().getFullYear();
    			if (commInitData.query["testDate"]) {
    				var todayDate = commInitData.query["testDate"]; // 년월일
    				todayYear = todayDate.substring(0, 4); // 년
                    var todayTime = new Date(
                        todayDate.substring(0, 4), // 년
                        parseInt(todayDate.substring(4, 6)) - 1, // 월
                        todayDate.substring(6, 8), // 일
                        todayDate.substring(8, 10), // 시간
                        todayDate.substring(10, 12), // 분
                        todayDate.substring(12, 14)); // 초
                    $scope.todayDate2 = todayTime;                    
    			}
    			if (todayYear > 2017) {
    				$scope.smp_end_yn = true;
    				if($scope.smp_yn == true) $("body").css("overflow" , "hidden");
    			}

                $scope.smpEndAppCall = function (appService) {
                    if (appService != '') {
                        LotteLink.appDeepLink(appService);
                    }
                }

                // TEST Date 20181005 : 2018년 10월 31일 23시59분59초 까지
                // TEST Date 20181102 : 2018년 11월 29일 23시59분59초 까지
                $scope.enableBanner = false;
                if($scope.todayDate2.getTime() < (new Date(2018, 11 - 1,30)).getTime()){
                    $scope.enableBanner = true;
                }	
                
                
                /* 기간설정 
                var objStartDate = {
                	year : "2018",
                	month : "06",
                	date : "04"
                }
                if (commInitData.query["startDate"]) {
    				var startDate = commInitData.query["startDate"];
    				objStartDate.year = startDate.substring(0, 4); // 년
    				objStartDate.month = startDate.substring(4, 6); // 월
    				objStartDate.date = startDate.substring(6, 8); // 일
    			}                
                function checkPeriod(start, end){
                	var today = new Date().getTime();
                	if(today > start.getTime() && today < end.getTime()){
                		return true;
                	}
                	return false;
                }                
                $scope.enableBanner = checkPeriod(new Date(objStartDate.year, objStartDate.month - 1, objStartDate.date), new Date(2018, 8 - 1, 31)); // 2018.06.04 ~ 2018.08.31
                $scope.goBanner = function(){
                	location.href = "/event/smpRelayStamp.do?" + $scope.baseParam + "&tclick=" + "m_DC_MyPage_Clk_SPP_Ban";
                };
                */
            }
        };
    }]);
    
    // 예약증 보내기 팝업
    app.directive('sendPick', ['$window', '$location', function($window, $location) {
        return {
        	templateUrl:'/lotte/resources_dev/smartpick/send_pick.html',
            replace:true,
            link:function($scope, el, attrs) {
            	
            }
        };
    }]); 
    
    // 예약변경하기 팝업
    app.directive('changePick', ['$window', '$location', function($window, $location) {
        return {
        	templateUrl:'/lotte/resources_dev/smartpick/change_pick.html',
            replace:true,
            link:function($scope, el, attrs) {

            }
        };
    }]); 

})(window, window.angular);

/**
 * 비동기 서비스 요청 후 실패 시 핸들러
 * 		- 응답을 정상(500)으로 받은 후
 * 		  리턴된 결과로 호출됨 
 */
// TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseFailHandler = function(errorCallback) {
	alert('처리중 오류가 발생하였습니다.');
	if (errorCallback) errorCallback();
};

/**
 * 비동기 서비스 요청 후 에러 시 핸들러
 * 		- 응답을 서버수행에러(500)으로 받은 후 호출 됨 
 */
// TODO ywkang2 : Angular 공통 처리 필요
var ajaxResponseErrorHandler = function(ex, errorCallback) {
	if (ex.error) {
		var errorCode = ex.error.response_code;
		var errorMsg = ex.error.response_msg;
		if ('9004' == errorCode) {
			// TODO ywkang2 : lotte_svc.js 를 참조해야함
			var targUrl = 'targetUrl='+encodeURIComponent(location.href, 'UTF-8'); 
//    		$window.location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+targUrl
			location.href = '/login/m/loginForm.do?' + targUrl;
		} else {
			alert('[' + errorCode + '] ' + errorMsg);
		}
	} else {
		alert('처리중 오류가 발생하였습니다.');
	}
	if (errorCallback) errorCallback();
};