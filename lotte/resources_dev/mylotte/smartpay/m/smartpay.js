(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
	     'lotteComm',
	     'lotteSrh',
	     'lotteSideCtg',
	    //  'lotteSideMylotte',
	     'lotteCommFooter'
    ]);

    app.controller('smartPayCtrl', ['$scope', '$window', '$http', 'LotteCommon', 'LotteCookie', function($scope, $window, $http, LotteCommon, LotteCookie) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "스마트페이 관리";
        $scope.mbrNo = LotteCookie.getCookie('MBRNO');
        $scope.loginId = LotteCookie.getCookie('LOGINID');
        
        // 결함번호 293 로그인 체크 해제
//    	var init = function() {
//			if(!$scope.loginInfo.isLogin){
//				alert("로그인 후 이용가능합니다.");
//				var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
//				$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
//			}
//    	}
//    	init();
    	
    	var targetUrl = "";
    	console.log("#LotteCommon.smartpayData : " + LotteCommon.smartpayData);
    	$http.get(LotteCommon.smartpayData + "?targetUrl=" + targetUrl)
    	.success(function(data) {
            if(data.resultCode==1000){
            } 
            else {
            	$scope.mbr_no = data.smartpay.mbr_no;
            	$scope.order_cardname = data.smartpay.order_cardname;
            	$scope.smartpayUser_key = data.smartpay.smartpayUser_key;
            	$scope.targetUrl = data.smartpay.targetUrl;
            	$scope.reqType = "4";
            	$scope.pay = "ESPS"; // 안심결제(EACS), 간편결제 (ESPS)
            	
            	if( data.smartpay.smartpayUser_key == "" ){
            		$scope.reqType = "1";
            	}
            }
        })
        .error(function(data, status, headers, config){
            console.log('Error Data : ', status, headers, config);
        });

		
		$scope.smartpaySubmit = function(key){
			
			$scope.dimmedOpen({target:"ansimLayer",callback:this.ansimclose});
			
			console.log("key : " + key);
			
			// map 에 담아 smartpay_container.html 에서 foreach 로 <li> 를 돌리는 것으로 전환 예정
			var paytype_card_arr = [
                LotteCommon.PAYTYPE_CARD_047,
                LotteCommon.PAYTYPE_CARD_029,
                LotteCommon.PAYTYPE_CARD_031,
                LotteCommon.PAYTYPE_CARD_048
			];
			var card_name_arr = [
  			    "롯데카드",
  			    "신한카드",
  			    "삼성카드",
  			    "현대카드"
 			];
			

			console.log("paytype_card_arr[" + key + "] : " + paytype_card_arr[key]);
			console.log("$scope.loginId : " + $scope.loginId);
			
			if($scope.loginId = ""){
				var targUrl = "&targetUrl="+encodeURIComponent($window.location.href, 'UTF-8');
				$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl;
			
			}
			else {

				 //20171016 현대카드 등록불가
				if(key == 3){
					alert("현대카드는 서비스 준비 중입니다.");
					$scope.dimmedClose();
					return;
				}

				//$("#ANSIM_LAYER").css("top"	,"-90px");		
				$("#ANSIM_LAYER .tit").text(card_name_arr[key]);
				$("#ANSIM_LAYER").show();
				$("#X_ANSIM_FRAME").show();
				$("#CLOSE_BTN").hide();
				
				if (paytype_card_arr[key] == LOTTE_CONSTANTS['PAYTYPE_CARD_047']){
					//$("#X_ANSIM_FRAME").css("width"	,"370px");
					//$("#X_ANSIM_FRAME").css("height","530px");
				
					$("#SIMPLEPAYFORM").attr("target", "X_ANSIM_FRAME");
					$("#SIMPLEPAYFORM").attr("action", "/smpi/M_LCSMPIAgent01.jsp");
					$("#SIMPLEPAYFORM").submit();
				} else if (paytype_card_arr[key] == LOTTE_CONSTANTS['PAYTYPE_CARD_029'] ){
					$("#frm_card input[name=X_CARDTYPE]").val(paytype_card_arr[key]);
					$("#frm_card input[name=X_SP_CHAIN_CODE]").val("");
					$("#frm_card").submit();
				} else if (paytype_card_arr[key] == LOTTE_CONSTANTS['PAYTYPE_CARD_031']){
					$("#CLOSE_BTN").show();
					$("#X_ANSIM_FRAME").attr("src", "https://vbv.samsungcard.co.kr/VbV/spmobile/SMITFX500.jsp?mod=simplepay_reg");
				} else if (paytype_card_arr[key] == LOTTE_CONSTANTS['PAYTYPE_CARD_048']){
					$("#frm_card input[name=X_CARDTYPE]").val(paytype_card_arr[key]);
					$("#frm_card input[name=X_SP_CHAIN_CODE]").val("1");
					$("#frm_card").submit();
				}
				
			}
		}
		
		$scope.ansimclose = function(){
			$("#ANSIM_LAYER").hide();
			$("#X_ANSIM_FRAME").attr("src","/dacom/xansim/iframe.jsp");
		}

		$scope.paramSmartpaySet = function(xid, eci, cavv, realPan, hs_useamt_sh, restype, userkey, result ){
			$("#frm_send input[name=xid]").val(xid);
			$("#frm_send input[name=eci]").val(eci);
			$("#frm_send input[name=cavv]").val(cavv);
			$("#frm_send input[name=cardno]").val(realPan);
			$("#frm_send input[name=restype]").val(restype);
			$("#frm_send input[name=smart_pay_use_yn]").val("Y");
			
			if ( userkey != $("#frm_send input[name=user_key]").val() ){
				$("#frm_send input[name=update_easn_yn]").val("Y");
			}
			$("#frm_send input[name=user_key]").val(userkey);
			$("#frm_send input[name=res_type]").val(restype);
			$("#frm_send input[name=req_type]").val(restype);
			$("#frm_send input[name=apvl_desc]").val(result);

			if(xid=="" && eci=="" && cavv=="" && realPan=="") {
				returnPaymentPage();
				$("#X_ANSIM_FRAME").hide();
				$("#ANSIM_LAYER").hide();	
			} else {			
				$scope.doPayment();
			}
		}
		
		$scope.setCertSmartpayResult = function(xid, eci, cavv, cardno, joinCode, hs_useamt_sh, restype, userkey, result ){
			$scope.paramSmartpaySet(xid, eci, cavv, cardno, hs_useamt_sh, restype, userkey, result );
		}
		
		$scope.returnPaymentPage = function(){
			$("#X_ANSIM_FRAME").attr("src","/dacom/xansim/iframe.jsp");
		}

		$scope.closeFrame = function(){
			$("#ANSIM_LAYER").hide();
			$("#X_ANSIM_FRAME").hide();
			$("#CLOSE_BTN").hide();

			$scope.returnPaymentPage();
		}

		$scope.doPayment = function(){
			var smart_pay_use_yn = $("#frm_send input[name=smart_pay_use_yn]").val();
			var user_key = $("#frm_send input[name=user_key]").val();
			var restype = $("#frm_send input[name=restype]").val();
			var res_type = $("#frm_send input[name=res_type]").val();
			var req_type = $("#frm_send input[name=req_type]").val();
			var apvl_desc = $("#frm_send input[name=apvl_desc]").val();
			var update_easn_yn = $("#frm_send input[name=update_easn_yn]").val();
			var targetUrl = encodeURIComponent($scope.targetUrl,'UTF-8');

			try {
				$http.get(
					LotteCommon.smartpayRegUrl + '?' + $scope.baseParam +
						'&smart_pay_use_yn='+smart_pay_use_yn+
						'&user_key='+user_key+
						'&restype='+restype+
						'&res_type='+res_type+
						'&req_type='+req_type+
						'&apvl_desc='+apvl_desc+
						'&update_easn_yn='+update_easn_yn+
						'&targetUrl='+targetUrl
				).success(function(data) {
					$("#smartpayreg").html( response );
				}).error(function(ex) {
					ajaxResponseErrorHandler(ex, function() {});
				});
	    	} catch (e) {
	    		console.error(e);
	    	}
		}
		
		
		/**
		 * post message receive
		 */
    	function receiveMessage(e){
    		if(e.data == "closeLayer"){
    			var fr = angular.element("#X_ANSIM_FRAME");
    			fr.prop("width", 0);
    			fr.prop("height", 0);
    			fr.css("display", "none");
    			$scope.dimmedClose({target:"ansimLayer", callback:$scope.ansimclose});
    		}
    	};
    	
    	window.addEventListener("message", receiveMessage, false);
    	
		
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/smartpay/m/smartpay_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);
