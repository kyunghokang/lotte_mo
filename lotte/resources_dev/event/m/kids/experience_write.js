(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('ExperienceWriteCtrl', ['$http', '$scope', 'LotteCommon', 'LotteCookie', 'LotteUtil', 'commInitData', '$timeout','LotteForm', '$window', function($http, $scope, LotteCommon, LotteCookie, LotteUtil, commInitData, $timeout,LotteForm, $window) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "체험단 신청서"; // 서브헤더 타이틀
        $scope.selectAddressIndex = 0; // 주소        
        $scope.PopAgreeFlag = false;
        $scope.PopApplyFlag = false;
    	$scope.isNewestApp = isNewestApp();
    	$scope.isKidsApp = false;
     	
        var easyJoinCookie = LotteCookie.getCookie("SIMPLESIGNYN");
		var side_big = LotteUtil.getLoginSeed().toUpperCase();
		
		var return_url = '';
		
		// 앱/웹 분기처리
		if($scope.schema == "") {
		 	return_url = encodeURIComponent(window.location.href, "UTF-8");
		}else{
			return_url = window.location.href.replace(/^http(s)?/,$scope.schema);
		}
		
		var family_url;
		
		if(commInitData.query['evt_no'] != undefined) {
			$scope.evtNo = commInitData.query['evt_no'];
		}
		
		if (commInitData.query['isKidsApp']){
			$scope.isKidsApp = (commInitData.query['isKidsApp'] == 'Y')?true:false;
		}
		
		if ($scope.isKidsApp) {					
			angular.element(document).ready(function () {
	    		$timeout(function(){
	    			// 앱으로 사진 영역 좌표 전달
	    			if($scope.appObj.isApp){
	        			var area = angular.element(".appPhotoArea");    			
	        			if($scope.appObj.isAndroid){
	    					//console.log('aaa', $scope.appObj.isAndroid);
	    					// android
	    					try{
	    						$window.lottepetswag.callAndroid('swag://position?top=' + area.offset().top);
	    					}catch(e){    						
	    						//console.log('테스트', e);
	    					}
	    					//console.log('bbb', area.offset().top);
	    				}else{
	    					//ios    					
	    					location.href = 'swag://position?top=' + area.offset().top;
	        				console.log("SEND APP TOP POSI", area.offset().top);
	    				}
	        		}
	        	}, 200);
	    	});	
		}
		function isNewestApp() {
    		return true;
			if($scope.appObj.isApp){
				var v = $scope.appObj.verNumber;
				if($scope.appObj.isAndroid){
					// android
					return ($scope.appObj.isSktApp==false && v >= 249) || ($scope.appObj.isSktApp==true && v >= 149);
				}else if($scope.appObj.isIOS){
					// ios
					return ($scope.appObj.isIpad==false && v >= 249) || ($scope.appObj.isIpad==true && v >= 149);
				}
			}
			return false;
    	};
    	
    	// attachImage(): 사진첨부
    	$scope.attachImage = function() {
    		if ($scope.appObj.isApp) {
    			//location.href = 'swag://attachImage';
    			location.href = 'ghost://CommentWithPhoto';
    		} else {
    			if (confirm('롯데닷컴 앱에서 이용 가능합니다. 지금 설치하시겠습니까?')) {
    				location.href = LotteCommon.appDown + '?' + $scope.baseParam;
    			}
    		}
    	};
    	
    	
		// INPUT 데이터 초기화
    	$scope.input = {};
    	$scope.input.kids_tit = '';
    	$scope.input.writeTxt = '';  
    	
    	// cancel(): 취소
    	$scope.cancel = function() {
    		if (confirm('체험단 신청서 작성을 취소하시겠습니까?')) {
				//alert("리스트 이동 할것")
    			location.replace(LotteCommon.kidsExperienceMainUrl+"?"+$scope.baseParam);
    		}
    	};    	
    	
    	//동의 팝업
    	$scope.agreeSave = function() {
			
    		// 로그인 안된 경우
			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
				location.href = '/login/m/loginForm.do?' + targUrl;
				return;   
			}
            if($scope.loginInfo.isSimple){
                alert("응모 가능 회원구분이 아닙니다.\nL.POINT 통합 회원으로 가입해주세요.");
                return;
            }            
			//기본배송지 체크 20180607
            if(!$scope.addressDefaultData || $scope.addressDefaultData.addr1.indexOf("입력해주세요") > 0){
                alert("기본배송지를 먼저 설정해주세요.\n(PC 마이롯데 > '배송지/회원정보 관리' 에서 설정 가능)");
                return;
            }
            
			// 입력값 유효성 검사
			var kidsTitle = $scope.input.kids_tit;
			var kidsTitleElement = document.querySelector('#kidsTitle');
			var writeTxt = $scope.input.writeTxt;
			var writeTxtTxtElement = document.querySelector('#writeTxt');
			var writeAgree = angular.element("#request_agree");

			if (kidsTitle.trim().length == 0) {
				alert('제목을 작성해주세요.');
				kidsTitleElement.focus();
				return false;
			}
			if (calcBytes(kidsTitle) < 6) {
				alert('제목을 한글 3자 이상 입력하세요.');
				kidsTitleElement.focus();
				return false;
			}		
			
			if (writeTxt.trim().length == 0) {
				alert('사연 내용을 작성해 주세요.');
				writeTxtTxtElement.focus();
				return false;
			}
			if (calcBytes(writeTxt) < 20) {
				alert('사연 내용을 한글 10자 이상 입력하세요.');
				writeTxtTxtElement.focus();
				return false;
			}
			if (calcBytes(writeTxt) > 2000) {
				alert('사연 내용은 1000자 [한글기준] 이내로 제한되어 있습니다.');
				writeTxtTxtElement.focus();
				return false;
			}
			
			/* 20181126 체험단이벤트 개인정보처리 위탁 동의방법 변경 */
			if(!writeAgree.is(":checked")){
				if(confirm('개인정보 활용에 동의하셔야만\n이벤트에 응모하실 수 있습니다.')){
					writeAgree.prop("checked",true);
				}
				return false;
			}

    		if ($scope.appObj.isApp && $scope.isKidsApp) {

				/* 20180910 앱 동의팝업 호출 삭제
	    		var url = 'swag://writeKidsPop'; //동의하기 팝업 호출
	    		$timeout(function() {
					location.href  = url;		
				}, 200); */
				
				$scope.save(); // 앱 등록 처리 함수 바로 호출

    		} else{

				// 웹일 때
				/* 20180910 웹 동의팝업 호출 삭제 
				$scope.dimmedOpen({
					target: "kids_pop",
					callback: this.popupClose
				});
				$scope.sendTclick('m_DC_Clk');
				$scope.PopAgreeFlag = true;	*/
				$scope.popupAgree(); // 웹 등록 처리 함수 바로 호출

    		}	
    		
    	}
    	
    	//앱에서 동의확인버튼 클릭시
    	$scope.kidsAgreeOk = function() {
    		$scope.save();
    		
    	}
    	
    	window.kidsAgreeOk = $scope.kidsAgreeOk;
    	
    	/* 앱에서 이미지 등록 후 리다이렉트  */
    	$scope.kidsMainGo = function() {
			$timeout(function() {
				location.replace(LotteCommon.kidsExperienceMainUrl+"?"+$scope.baseParam);
			}, 200);	
    	}
    	
    	window.kidsMainGo = $scope.kidsMainGo;
    	
    	// save(): 등록
    	$scope.save = function() {
			if ($scope.appObj.isApp && $scope.isKidsApp) {
				// 앱일때 sumbmit은 네이티브로 처리한다.
				var url = 'kids://writeKids';
				url += '?bbc_tit_nm=' + encodeURIComponent($scope.input.kids_tit);
				url += '&bbc_fcont=' + encodeURIComponent($scope.input.writeTxt);
				url += '&dlvp_sn=' + encodeURIComponent($scope.dlvp_sn);
				url += '&evt_no=' + $scope.evtNo;
				url += '&loginId=' + $scope.input.login_id;
				url += '&mbrNo=' + $scope.input.mbr_no;
				url += '&mbrNm=' + $scope.input.mbr_nm;
				url += '&mbrEmail=' + $scope.input.mbr_email;
				url += '&site_no=' + $scope.input.site_no;
				url += '&imageServerURL=' + "/mobile/evtTesterImgParamReq.lotte"; 
				//url += '&returnUrlData=' + "/event/m/kids/experience_main.do"+ "?" + $scope.baseParam;
				if (!$scope.isNewestApp) {
					// 구버전 앱일 때 항목 추가
					url += '&radio1=';
					url += '&radio2=';
					url += '&radio3=';
					url += '&radio4=';
					url += '&radio5=';
					url += '&radio6=';
					url += '&check_cont=';
					url += '&img_no=';
					url += '&img_file_1=';
					url += '&img_file_2=';
					url += '&img_file_3=';
					url += '&img_file_4=';
					url += '&img_path_1=';
					url += '&img_path_2=';
					url += '&img_path_3=';
					url += '&img_path_4=';
					url += '&prdt_clor_eval_desc=';
					url += '&prdt_size_eval_desc=';
					url += '&use_flag=';
					url += '&wrtr_pur_dt=';
				}				
			//	console.log(url);
				 
				$timeout(function() {
					location.href  = url;
					//20181018 IOS 구버전 앱 체크	
					$scope.oldIOSAppChk();	
            	}, 200);
				return;
				
			} 			
    		return false; // form sumbmit 기본 동작 방지
    	};

		/**
		 * @ngdoc function
		 * @name $scope.oldIOSAppChk
		 * @description
		 * 구버전 앱(IOS) 글쓰기 후 팝업 미노출 방어 - 시스템얼럿 후 리스트화면 이동
		 */
		$scope.oldIOSAppChk = function(){
			if($scope.appObj.isIOS && ((!$scope.appObj.isSuperApp && $scope.appObj.verNumber < 4180) || ($scope.appObj.isSuperApp && $scope.appObj.verNumber < 4170))){
				$timeout(function() {
					alert('응모 완료 되셨습니다.');
					$window.location.href = LotteCommon.kidsExperienceMainUrl + "?" + $scope.baseParam;	
				},500);
			}
			return;
		}

		//팝업 닫기
		$scope.popupClose = function(){
			$scope.dimmedClose();
		}
		
    	$scope.popupAgree = function(){
    		
    		var postParams = {
    				evt_no : $scope.evtNo,
    				bbc_tit_nm : $scope.input.kids_tit,
    				bbc_fcont : $scope.input.writeTxt,
    				dlvp_sn : $scope.dlvp_sn
    		};
    		
    		$.ajax({
    			type: 'post' // test 시 get - 운영 post
    				, async: false
    				, url: LotteCommon.kidsExperienceApplySave
    				, data: (postParams)
    				, success: function(data) {
						//if(data.code.indexOf('0000')>-1){ // test 용
    					if(data.indexOf('0000')>-1){
							$scope.PopApplyFlag = true;
    						$scope.dimmedOpen({
    							target: "kids_pop",
    							callback: this.popupClose
    						});
    						angular.element('.write').removeClass("on"); //레이어 닫기
    						/*$scope.PopApplyFlag = true;
    						$scope.PopAgreeFlag = false;    						
    						alert("신청이 완료되었습니다.");
    						location.replace(LotteCommon.kidsExperienceMainUrl+"?"+$scope.baseParam); */
    					}else if(data.indexOf('dup.err')>-1){
							alert("이미 신청하셨습니다.");
							$scope.PopApplyFlag = false;
    					}
    				}
    		});
    	}
    	
    	$scope.popupClose2 = function(){
    		location.replace(LotteCommon.kidsExperienceMainUrl + '?' + $scope.baseParam);		    	
    	}
    	
    	/**
    	 * 사용자 정보 불러오기
    	 */
    	function loadScreenData(){
    		$http.get(LotteCommon.kidsExperienceReviewData + "?evt_no=" + $scope.evtNo)
    		.success(function loadUserInfoSuccess(data){
    			$scope.evtData = data.tester_evt;
    			$scope.addressDefaultData = data.user_addr_info.default_addr; //현재 주소
	            $scope.addressList = data.user_addr_info.addr_list;
    			$scope.select_addr = data.user_addr_info.addr_list[0];
    			$scope.dlvp_sn = data.user_addr_info.addr_list[0].dlvp_sn;
    			$scope.input.login_id = data.tester_evt.login_id;
        		$scope.input.login_id = data.tester_evt.login_id;
        		$scope.input.mbr_email = data.tester_evt.mbr_email;
        		$scope.input.mbr_nm = data.tester_evt.mbr_nm;
        		$scope.input.mbr_no = data.tester_evt.mbr_no;
        		$scope.input.site_no = '1';    		
        		
	            family_url = LotteCommon.changeMyInfoUrl + "?sid=" + side_big + "&returnurl=" + return_url + "&custid=" + $scope.evtData.seedCustId + "&loginid=" + LotteCookie.getCookie('LOGINID') + "&pageflag=I" + "&opentype=P" + "&sch=" + $scope.schema;
	            
	           
        	}).error(function(ex) {
	    		ajaxResponseErrorHandler(ex);
	        });
    	};
    	
    	loadScreenData();
    	$scope.memeberChange = function(){
			if($scope.loginInfo.isLogin){
				if(easyJoinCookie == "Y"){
					alert("간편회원의 정보변경은 PC에서만 가능합니다.");
					return false;
				} else {
					// 회원정보 수정
					outLink(family_url);
					$scope.PopApplyFlag = false;
					$scope.kidsMainGo();
				}
			}else{
				alert("로그인 후 이용 가능합니다.");
			}
		}
    	
    	window.memeberChange = $scope.memeberChange;
    }]);

    app.directive('lotteContainer', ['$timeout', 'LotteCommon','$window', function($timeout, LotteCommon, $window) {
        return {
            templateUrl : '/lotte/resources_dev/event/m/kids/experience_write_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	$scope.AddrinfoDefault = true;
            	$scope.AddrList = false;
				$scope.selectAddress = function(){
					if($scope.selectAddressIndex >= 0){
						$scope.add_name = $scope.addressList[$scope.selectAddressIndex].addr_name;
						$scope.r_name = $scope.addressList[$scope.selectAddressIndex].r_name;
						$scope.addr1 = $scope.addressList[$scope.selectAddressIndex].addr1;
						$scope.addr2 = $scope.addressList[$scope.selectAddressIndex].addr2;
						$scope.addr_tel = $scope.addressList[$scope.selectAddressIndex].addr_tel;
						$scope.dlvp_sn = $scope.addressList[$scope.selectAddressIndex].dlvp_sn;
						$scope.AddrinfoDefault = false;
						$scope.AddrList = true;
					} 
				}
				
				// 이벤트 메인 페이지로 이동 Click
		        $scope.goEvtMainClick = function() {
		       		$window.location.href = LotteCommon.kidsExperienceMainUrl + "?" + $scope.baseParam;	
		        }
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
/*var ajaxResponseFailHandler = function(errorCallback) {
	alert('처리중 오류가 발생하였습니다.');
	if (errorCallback) errorCallback();
};*/

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
			var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8'); 
//    		$window.location.href = LotteCommon.loginUrl+"?"+$scope.baseParam+targUrl
			location.href = '/login/m/loginForm.do?' + targUrl;
		} else {
			alert('[' + errorCode + '] ' + errorMsg);
		}
	} else {
		alert('처리중 오류가 발생하였습니다.');
	}
	if (errorCallback) errorCallback();
};

function calcBytes(txt) {
	var bytes = 0;
	for (i=0; i<txt.length; i++) {
		var ch = txt.charAt(i);
		if(escape(ch).length > 4) {
			bytes += 2;
		} else if (ch == '\n') {
			if (txt.charAt(i-1) != '\r') {
				bytes += 1;
			}
		} else if (ch == '<' || ch == '>') {
			bytes += 4;
		} else {
			bytes += 1;
		}
	}
	return bytes;
}


/* ===========================================================================================
maxLengthCheck(maxSize, lineSize, obj, remainObj)
사용법 : maxLengthCheck("256", "3",  this, remain_intro)
parameter : 
	 maxSize : 최대 사용 글자 길이(필수)
	 lineSize  : 최대 사용 enter 수 (옵션 : null 사용 시 체크 안 함)
	 obj   : 글자 제한을 해야 하는 object(필수)
	 remainObj : 남은 글자 수를 보여줘야 하는 object (옵션 : null 사용 시 사용 안 함)
===========================================================================================*/
function maxLengthCheck(maxSize, lineSize, obj, remainObj) {
	var temp;
	var f = obj.value.length;
	var msglen = parseInt(maxSize);
	var tmpstr = '';
	var enter = 0;
	var strlen;
	if (f == 0){//남은 글자 byte 수 보여 주기
		if (document.getElementById('spn_input_char') != null){//null 옵션이 아닐 때 만 보여준다.
		  document.getElementById('spn_input_char').innerText = msglen;
		}  
	} else {
		for(k = 0; k < f ; k++){
			temp = obj.value.charAt(k);
			if(temp =='\n'){
				enter++;
			}
			if(escape(temp).length > 4){
				msglen -= 2;
			}else{
				msglen--;
			}

			if(msglen < 0){
				alert('총 한글 '+(maxSize/2)+'자 영문 '+maxSize+'자 까지 쓰실 수 있습니다.');
				obj.value = tmpstr;
				break;
			} else if (lineSize != null & enter > parseInt(lineSize)){// lineSize 옵션이 nulldl 아닐 때만 사용
				alert('라인수 '+lineSize+'라인을 넘을 수 없습니다.');
				enter = 0;
				strlen = tmpstr.length -1;
				obj.value = tmpstr.substring(0, strlen);
				break;
			}else{
				if (document.getElementById('spn_input_char') != null){
					document.getElementById('spn_input_char').innerText = msglen;
				}      
				tmpstr += temp;
			}
		}  
	}
}