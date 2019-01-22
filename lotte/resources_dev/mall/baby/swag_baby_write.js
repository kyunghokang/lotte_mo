(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('SwagBabyWriteCtrl', ['$http', '$scope', 'LotteCommon', 'LotteUtil', 'LotteForm', '$timeout', '$window','LotteStorage', '$location', function($http, $scope, LotteCommon, LotteUtil, LotteForm, $timeout, $window,LotteStorage, $location) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "육아 TIP 작성"; // 서브헤더 타이틀
        $scope.screenID = "육아 TIP 작성"; // 스크린 아이디 
        $scope.top_title = LotteStorage.getSessionStorage('param_more1');
        $scope.dispNo = LotteStorage.getSessionStorage('param_more2');
        if($scope.top_title == undefined){
            $scope.top_title = '';
        }
        if($scope.dispNo == null){
            $scope.dispNo = "5571270"; //출산꿀팁
        }
    	// INPUT 데이터 초기화
    	$scope.input = {};
    	$scope.input.swagTxt = '';
    	
    	$scope.isNewestApp = isNewestApp();
    	
    	angular.element(document).ready(function () {
    		$timeout(function(){
    			
    			// 앱으로 사진 영역 좌표 전달
    			if($scope.appObj.isApp){
        			var area = angular.element(".appPhotoArea");    			
        			if($scope.appObj.isAndroid){
    					// android
    					try{
    						$window.lottepetswag.callAndroid('swag://position?top=' + area.offset().top);
    					}catch(e){    						
    					}
    				}else{
    					//ios    					
    					location.href = 'swag://position?top=' + area.offset().top;
        				console.log("SEND APP TOP POSI", area.offset().top);
    				}
        		}
        	}, 200);
    	});
    	
    	/*
		if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
			var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
			location.href = '/login/m/loginForm.do?' + targUrl;
			return;    
		}*/
    	
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
    			location.href = 'ghost://CommentWithPhoto';
    		} else {
    			if (confirm('롯데닷컴 앱에서 이용 가능합니다. 지금 설치하시겠습니까?')) {
    				location.href = LotteCommon.appDown + '?' + $scope.baseParam;
    			}
    		}
    	};
    	
    	// cancel(): 취소
    	$scope.cancel = function() {
    		if (confirm('육아TIP 작성을 취소하시겠습니까?')) {
				//alert("리스트 이동 할것")
				/* 20170614 작성취소 시 선택되어진 리프카테고리로 이동 */
				var url = $location.absUrl().split('&');
				var mcate = [];
				for(i = 0; i < url.length; i++){
					if(url[i].indexOf('mcate')>-1){
						mcate = url[i].split('=');
					}
				}
    			location.replace(LotteCommon.infantMainUrl+"?"+$scope.baseParam+"&dispNo="+$scope.dispNo+"&dcate=2" + "&mcate=" + ( mcate[1] || ''));
    		}
    	};
    	
    	// save(): 등록
    	$scope.save = function() {
			
			/* Start::20170614 작성취소 시 선택되어진 리프카테고리로 이동 */
			var url = $location.absUrl().split('&');
			var mcate = [];
			for(i = 0; i < url.length; i++){
				if(url[i].indexOf('mcate')>-1){
					mcate = url[i].split('=');
				}
			}
			/* End::20170614 작성취소 시 선택되어진 리프카테고리로 이동 */
    		
    		// 입력값 유효성 검사
			var reviewTxt = $scope.input.swagTxt;
			var reviewTxtElement = document.querySelector('#reviewTxt');
			if (reviewTxt.trim().length == 0) {
				alert('내용을 작성해 주세요.');
				reviewTxtElement.focus();
				return false;
			}
			if (calcBytes(reviewTxt) < 6) {
				alert('내용을 한글 3자 이상 입력하세요.');
				reviewTxtElement.focus();
				return false;
			}
			if (calcBytes(reviewTxt) > 350) { //20170614 꿀팁등록 글자 수 제한 수정
				alert('내용은 750자[한글기준] 이내로 제한되어 있습니다.');
				reviewTxtElement.focus();
				return false;
			}
			
    		//20170613금지어 체크 MO_DC/lotte/resources_dev/common/lotte_svc_dev.js에서 해당 사이트에 맞는 금지어 data(json) 경로로 수정::육아꿀팁(infantTipWriteCheckData)
			LotteForm.FormSubmitForAjax(LotteCommon.infantTipWriteCheckData + "?swagTxt=" + reviewTxt)
    		.success(function(data) {
				if (data.chk_swag_cont.response_code != "0000") {
					alert(data.chk_swag_cont.response_msg);
					//console.log(LotteCommon.infantTipWriteCheckData + "?swagTxt=" + reviewTxt);
				} else {
					if ($scope.appObj.isApp) {
						// 앱일때 sumbmit은 네이티브로 처리한다.
						var url = 'swag://writeSwag';
						//var url = 'ghost://SubmitPhotoComment/swagWrite';
						
						// angular.element('#commentWriteForm').serialize();
						// serialize()는 scope에 접근할 수 없고 앱은 JSON 객체를 받을 수 없으므로 일일이 문자열로 설정해야함
						url += '?swagTxt=' + encodeURIComponent($scope.input.swagTxt);
						url += '&loginId=' + $scope.input.login_id;
						url += '&mbrNo=' + $scope.input.mbr_no;
						url += '&mbrNm=' + $scope.input.mbr_nm;
						url += '&mbrEmail=' + $scope.input.mbr_email;
						url += '&isPhoto=N&site_no=' + $scope.input.site_no;
						url += '&imageServerURL=' + "/mobile/swagBabyImgParamReq.lotte&dispNo=" + $scope.dispNo;
						url += '&returnUrlData=' + "/mall/baby/baby_main.do?" + $scope.baseParam +"&dispNo="+$scope.dispNo+"&dcate=2" + "&mcate=" + (mcate[1] || ''); // 20170614 작성취소 시 선택되어진 리프카테고리 추가
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
						
						console.log(url);
						
						$timeout(function() {
							location.href  = url;
		            	}, 200);
						return;
					} else {
						// 웹일 때
			    		//var url = LotteCommon.commentWriteSaveData + '?' + $scope.baseParam;
						var url = LotteCommon.swagWriteData + '?bbcNo=' + $scope.bbc_no + $scope.baseParam;
			    		LotteForm.FormSubmitForAjax(
			    			url, $scope.input
			    		).success(function(data) {
			    			// 리스트로 이동
			    			$timeout(function() {
			    				//alert("리스트 이동 할것")
			    				location.replace(LotteCommon.infantMainUrl+"?"+$scope.baseParam+"&dispNo="+$scope.dispNo+"&dcate=2" + "&mcate=" + ( mcate[1] || ''));
			            	}, 200);
			    		}).error(function(ex) {
				    		ajaxResponseErrorHandler(ex);
				        });
					}
				}
			});
    		return false; // form sumbmit 기본 동작 방지
    	}; 	
    	
    	
    	/**
    	 * 사용자 정보 불러오기
    	 */
    	function loadUserInfo(){
    		$http.get("/json/mall/swag_write.json", {})
    		.success(function loadUserInfoSuccess(data){
        		$scope.input.login_id = data.swag_write.login_id;
        		$scope.input.mbr_email = data.swag_write.mbr_email;
        		$scope.input.mbr_nm = data.swag_write.mbr_nm;
        		$scope.input.mbr_no = data.swag_write.mbr_no;
        		$scope.input.site_no = data.swag_write.site_no;        		
        		

    			
        	}).error(function(ex) {
	    		ajaxResponseErrorHandler(ex);
	        });
    	};
    	
    	loadUserInfo();
    	
    	
    	
    }]);

    app.directive('lotteContainer', ["$timeout", "$http", function($timeout, $http){
        return {
            templateUrl : '/lotte/resources_dev/mall/baby/swag_write_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
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
	var Maxmsglen = maxSize;
	var msglen = 0;
	var tmpstr = '';
	var enter = 0;
	var strlen;
	if (f == 0){//작성한 글자 byte 수 보여 주기
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
				msglen += 2;
			}else{
				msglen++;
			}
			
			if(msglen > 350){ //20170614 꿀팁등록 글자 수 제한 수정
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