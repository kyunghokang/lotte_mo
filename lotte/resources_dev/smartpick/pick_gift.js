(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('SmartPickSendCtrl', ['$scope', '$window', '$http', 'commInitData', 'LotteCommon', 'LotteUtil', function($scope, $window, $http, commInitData, LotteCommon, LotteUtil) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "교환권 전송"; //서브헤더 타이틀

        $scope.mapViewFlag = false;
        $scope.sendGiftCheck = false;
        $scope.recieveUserName;
        $scope.recieveUserNum1 = '010';
        $scope.sendUserNum1;
        $scope.sendUserNum2;
        $scope.sendUserNum3;
        
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
    	$scope.searchParam = getParameterByName('search_flag'); //사용기간구분값 D7:최근 7일 D15:최근 15일 M1:최근 1개월 M3:최근 3개월	- 기본 한달 M1	
    	$scope.usedGubnParam = getParameterByName('cpn_state_cd'); //쿠폰 사용 가능 코드 1:사용가능, 2:사용불가, 3:사용완료	
        $scope.smartYnParam = getParameterByName('smp_yn'); //스마트픽 여부		
        $scope.ordNoParam = getParameterByName('ord_no');  //주문번호
        $scope.ordSnParam = getParameterByName('ord_dtl_sn');//주문순번
        //비회원인경우 추가 
        $scope.grockle_yn = getParameterByName('grockle_yn');
        $scope.grockle_mbr_no = getParameterByName('grockle_mbr_no');
        
        // Data url
        var smartPickListData = LotteCommon.smartPicKGiftData + "?" + $scope.baseParam + "&search_flag=" + $scope.searchParam + "&cpn_state_cd=" 
                                + $scope.usedGubnParam + "&smp_yn=" + $scope.smartYnParam + "&ord_no=" + $scope.ordNoParam + "&ord_dtl_sn=" + $scope.ordSnParam
                                + "&grockle_yn=" + $scope.grockle_yn + "&grockle_mbr_no=" + $scope.grockle_mbr_no;
        
        // Data Load
        $http.get(smartPickListData)
        .success(function(data) {
        	// 상세정보
        	$scope.smartPickDetail = data.max;
        	
        	$scope.userName = $scope.smartPickDetail.ord_user_nm;
            $scope.sendUserNum1 = $scope.smartPickDetail.ord_user_cell_phone.substr(0,3);
            $scope.sendUserNum2 = $scope.smartPickDetail.ord_user_cell_phone.substr(3,4);
            $scope.sendUserNum3 = $scope.smartPickDetail.ord_user_cell_phone.substr(7,4);
            
            // 선물하기 체크 전까지 디폴트로 보내는 사람
            $scope.recieveUserName = $scope.smartPickDetail.use_adre_nm ? $scope.smartPickDetail.use_adre_nm : $scope.smartPickDetail.ord_user_nm;
        	$scope.recieveUserNum1 = $scope.smartPickDetail.use_adre_no.substr(0,3) ? $scope.smartPickDetail.use_adre_no.substr(0,3) : $scope.smartPickDetail.ord_user_cell_phone.substr(0,3);
        	$scope.recieveUserNum2 = $scope.smartPickDetail.use_adre_no.substr(3,4) ? $scope.smartPickDetail.use_adre_no.substr(3,4) : $scope.smartPickDetail.ord_user_cell_phone.substr(3,4);
        	$scope.recieveUserNum3 = $scope.smartPickDetail.use_adre_no.substr(7,4) ? $scope.smartPickDetail.use_adre_no.substr(7,4) : $scope.smartPickDetail.ord_user_cell_phone.substr(7,4);

            if ($scope.smartPickDetail.msg_cont != null) {
                $scope.recieveUserMgs = $scope.smartPickDetail.msg_cont;
            }else {
                $scope.recieveUserMgs = "";
            }
            $scope.byteCheck();
        })
        .error(function(data, status, headers, config){
            console.log('Error Data : ', status, headers, config);
        });
        
        // 선물하기 체크 20160225
        $scope.giftClick = function() {
            if($scope.sendGiftCheck){
                $scope.recieveUserName = "";
                $scope.recieveUserNum1 = "010";
                $scope.recieveUserNum2 = "";
                $scope.recieveUserNum3 = "";
                $scope.recieveUserMgs = "";
                $scope.byteCheck();
            }else{
                //디폴트로 보내는 사람
                $scope.recieveUserName = $scope.smartPickDetail.use_adre_nm ? $scope.smartPickDetail.use_adre_nm : $scope.smartPickDetail.ord_user_nm;
                $scope.recieveUserNum1 = $scope.smartPickDetail.use_adre_no.substr(0,3) ? $scope.smartPickDetail.use_adre_no.substr(0,3) : $scope.smartPickDetail.ord_user_cell_phone.substr(0,3);
                $scope.recieveUserNum2 = $scope.smartPickDetail.use_adre_no.substr(3,4) ? $scope.smartPickDetail.use_adre_no.substr(3,4) : $scope.smartPickDetail.ord_user_cell_phone.substr(3,4);
                $scope.recieveUserNum3 = $scope.smartPickDetail.use_adre_no.substr(7,4) ? $scope.smartPickDetail.use_adre_no.substr(7,4) : $scope.smartPickDetail.ord_user_cell_phone.substr(7,4);

                if ($scope.smartPickDetail.msg_cont != null) {
                    $scope.recieveUserMgs = $scope.smartPickDetail.msg_cont;
                }else {
                    $scope.recieveUserMgs = "";
                }
                $scope.byteCheck();
            }
        }
        
        // 글자수 체크
        $scope.byteCheck = function() {
			var text = $scope.recieveUserMgs || ($scope.recieveUserMgs = '');
			$scope.bytes = getByteLength(text);
    		if ($scope.bytes >= 51) {
    			alert('최대 50byte까지 작성하실 수 있습니다.');
    			var length = 0;
    			while (true) {
    				length = getByteLength(text = text.substring(0, text.length -1));
    				if (length < 51) {
    					$scope.recieveUserMgs = text;
    					$scope.bytes = length;
    					break;
    				}
    			}
    		}
		};
        // 글자수 체크 20160503
        $scope.byteCheckName = function() {
			var text = $scope.userName || ($scope.userName = '');
			$scope.bytes2 = getByteLength(text);
    		if ($scope.bytes2 >= 21) {
    			alert('최대 20byte까지 작성하실 수 있습니다.');
    			var length = 0;
    			while (true) {
    				length = getByteLength(text = text.substring(0, text.length -1));
    				if (length < 21) {
    					$scope.userName = text;
    					$scope.bytes2 = length;
    					break;
    				}
    			}
    		}
		};		
		$scope.contactFind = function() {
            var rNum = 1; // 다중배송 셋팅 값

			if($scope.appObj.isAndroid) {
                if ($scope.appObj.verNumber >= 264) {
                    window.lottebridge.callAndroid("lottebridge://showcontacts?" + rNum);
                }else{
                    window.lottebridge.callAndroid("lottebridge://showcontacts");
                }
			} else if($scope.appObj.isIOS){
                if ($scope.appObj.verNumber >= 261) {
                    location.href='lottebridge://showcontacts?' + rNum;
                }else{
                    location.href='lottebridge://showcontacts';
                }
			}
		}
		
        // 예약증 MMS 보내기
        //20160225 sendGiftCheck 파라미터 제거 
        //$scope.sendSmartPick = function(smartPickDetail, userName, sendUserNum1, sendUserNum2, sendUserNum3, recieveUserName, recieveUserNum1, recieveUserNum2, recieveUserNum3, recieveUserMgs) {
        $scope.sendSmartPick = function() {      
        	if($scope.userName == "") {
        		alert("보내시는 분 이름을 입력하여 주시기 바랍니다.");
        		return false;
        	}
        	if($scope.sendUserNum1 == "" || $scope.sendUserNum2 == "" || $scope.sendUserNum3 == "") {
        		alert("보내시는 분 휴대폰 번호를 입력하여 주시기 바랍니다.");
        		return false;
        	}
        	
        	// 선물보내기 체크
        	if($scope.sendGiftCheck == true) {
                
	                $scope.recieveUserName = $("#recieveUserName").val();
	                $scope.recieveUserNum1 = $("#userNum2").val();
	                $scope.recieveUserNum2 = $("#userNum22").val();
	                $scope.recieveUserNum3 = $("#userNum23").val();                                     
                
        		if($scope.recieveUserName == "") {
            			alert("받으시는 분 이름을 입력하여 주시기 바랍니다.");
            		return false;
            	}
            	if($scope.recieveUserNum1 == "" || $scope.recieveUserNum2 == "" || $scope.recieveUserNum3 == "") {
            		alert("받으시는 분 휴대폰 번호를 입력하여 주시기 바랍니다.");
            		return false;
            	}
            	$scope.giftYN = 'Y'
        	} else {
        		$scope.giftYN = 'N'
        	}
        	
            //20160329 선물하기 일 경우에는 제외
        	if(!angular.isDefined($scope.recieveUserMgs) && $scope.sendGiftCheck) {
        		alert("선물메시지를 입력하여 주시기 바랍니다.");
        		return false;
        	}

        	var postParams = {
        		ord_no	           : $scope.smartPickDetail.ord_no,   //주문번호
        		ord_dtl_sn	       : $scope.smartPickDetail.ord_dtl_sn,   //주문상세번호
        		goods_no	       : $scope.smartPickDetail.goods_no,   //상품번호
        		smartkpick_yn	   : 'Y',   //스마트픽 적용 여부
        		ecpn_cret_meth_cd  : '',   
        		gift_yn            : $scope.giftYN,   //선물여부
        		ecpn_no            : $scope.smartPickDetail.ecpn_no,   //E쿠폰번호
        		sndr_nm            : $scope.userName,   //보내는이 성명
        		sndr_no            : $scope.sendUserNum1 + $scope.sendUserNum2 + $scope.sendUserNum3,   //보내는이 휴대폰 번호
        		adre_nm            : $scope.recieveUserName,   //받는이 성명
        		adre_no            : $scope.recieveUserNum1 + $scope.recieveUserNum2 + $scope.recieveUserNum3,   //받는이 휴대폰 번호
        		sms_title          : '',   //제목
        		msg_cont           : $scope.recieveUserMgs,   //메시지
        		use_yn             : $scope.smartPickDetail.use_yn,   //사용여부
        		grockle_yn         : '',   //비회원여부
        		opt_1_nm           : $scope.smartPickDetail.opt_1_nm,   //단품옵션1 = 옵션1명 : 옵션1문자값
        		opt_2_nm           : $scope.smartPickDetail.opt_2_nm,   //단품옵션2 = 옵션2명 : 옵션2문자값
        		re_send_yn         : $scope.smartPickDetail.re_send_yn,   //재발송여부
        		pitm_no            : $scope.smartPickDetail.shop_no,   //사용처번호
                c : getParameterByName('c'),
                udid : getParameterByName('udid'), 
                v : getParameterByName('v'),
                cdn : getParameterByName('cdn'),
                schema : getParameterByName('schema')
        	};
            
			$http({
				url : '/json/smartpick/smartpick_gift_send.json',
				data : $.param(postParams),
				method : 'POST',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
			}) // AJAX 호출
			.success(function (data, status, headers, config) { // 호출 성공시
				$window.location.href = LotteCommon.smartPickListUrl + "?" + $scope.baseParam + "&tclick=m_my_smartpick";
			})
			.error(function (data, status, headers, config) { // 호출 실패시
				console.log('error..............');
				return false;
			});
        }
        
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/smartpick/pick_gift_container.html',
            replace : true,
            link : function($scope, el, attrs) {

            }
        };
    });
    
    app.directive('numericOnly', function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {
                    var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : null;

                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    });

})(window, window.angular);

function getByteLength(s, b, i, c) {
	for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 2 : 1);
	return b;
}

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

//휴대폰 주소 받기
function setPhnNum(adre_nm, mst_adre_no){
    console.log('setPhnNum('+adre_nm+','+mst_adre_no+')');

    var adre_no = mst_adre_no.replace(/-/gi, '');
    var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;
    if (!regExp.test(adre_no)){
        $("#not_phn_num_str_1").show();
        return;
    }

    var l_idx = (adre_no.length==11?7:6); // 휴대전화 길이에 따라
    var opt_idx = -1;
    var no_01 = adre_no.substring(0, 3);
    if (no_01=="010"){opt_idx = 0;  }
    else if (no_01=="011"){opt_idx = 1; }
    else if (no_01=="016"){opt_idx = 2; }
    else if (no_01=="017"){opt_idx = 3; }
    else if (no_01=="018"){opt_idx = 4; }
    else if (no_01=="019"){opt_idx = 5; } 
    
    $("#recieveUserName").val(adre_nm);
    $("#userNum2").val(adre_no.substring(0, 3));
    $("#userNum22").val(adre_no.substring(3, l_idx));
    $("#userNum23").val(adre_no.substring(l_idx, adre_no.length));

    try {
        fn_checkRcvAdreNo(i);
    } catch (e) { }
}

//휴대폰 주소 받기-제이슨
function setPhnNumJson(adreInfo){
    console.log('setPhnNum('+adreInfo+')');
    
    //console.log("제이슨함수 진입");
    
    //var adreInfo = '{"result":[{"adre_nm":"김김김","adre_no":"010-1234-5678"},{"adre_nm":"박박박","adre_no":"016-888-8888"}]}';
    
    var adre_info = JSON.parse(adreInfo);
/*  var adre_info = JSON.parse(adreInfoq.replace(/'/g,'"')); */
    
    //수신자 정보획득
    for (var i = 0 ; i <  adre_info.result.length  ; i ++ ){
        var adre_nm = adre_info.result[i].adre_nm;
        var adre_no = adre_info.result[i].adre_no;

        adre_no = adre_no.replace(/-/gi, '');

        var regExp = /(01[016789])(\d{3}|\d{4})\d{4}$/g;
        if (!regExp.test(adre_no)){
            $("#not_phn_num_str_"+(i+1)).show();
            return;
        }

        var l_idx = (adre_no.length==11?7:6); // 휴대전화 길이에 따라
        var opt_idx = -1;
        var no_01 = adre_no.substring(0, 3);

        if (no_01=="010"){opt_idx = 0;  }
        else if (no_01=="011"){opt_idx = 1; }
        else if (no_01=="016"){opt_idx = 2; }
        else if (no_01=="017"){opt_idx = 3; }
        else if (no_01=="018"){opt_idx = 4; }
        else if (no_01=="019"){opt_idx = 5; }        

        $("#recieveUserName").val(adre_nm);
        $("#userNum2").val(adre_no.substring(0, 3));
        $("#userNum22").val(adre_no.substring(3, l_idx));
        $("#userNum23").val(adre_no.substring(l_idx, adre_no.length));

    }
}