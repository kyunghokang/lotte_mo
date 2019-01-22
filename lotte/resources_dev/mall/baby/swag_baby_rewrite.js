(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('SwagBabyRewriteCtrl', ['$http', '$scope', 'LotteCommon', 'commInitData', 'LotteUtil', '$timeout','LotteForm', '$location', function($http, $scope, LotteCommon, commInitData, LotteUtil, $timeout,LotteForm ,$location) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "육아 TIP 수정"; // 서브헤더 타이틀
        $scope.dispNo = commInitData.query['dispNo'];
        $scope.bbc_no = commInitData.query['bbcNo'];

    	// 빈 이미지 경로
    	var blankImageUrl = LotteUtil.getImagePath() + '/mobile/mobile_new/mylotte/blank.png';
        
    	$scope.input = {};
    	//$scope.hasImage = false;
    	
    	$scope.images = {
    		img_1:"",
    		img_2:"",
    		img_3:""
    	};
        
    	// 첨부된 이미지 삭제
    	$scope.deleteAttachedImage = function(index) {
    		if (confirm('사진을 삭제하시겠습니까?')) {
    			$scope.input.del_file = '';
    			$scope.input.del_path = '';
	    		switch (index) {
		    		case 1:	
		    			$scope.input.del_file = $scope.input.img_file_1
		    			$scope.input.del_path = $scope.input.img_path_1
		    			$scope.input.img_file_1 = '';
		    			$scope.input.img_path_1 = '';
		    			break;
		    		case 2:
		    			$scope.input.del_file = $scope.input.img_file_2
		    			$scope.input.del_path = $scope.input.img_path_2
		    			$scope.input.img_file_2 = '';
		    			$scope.input.img_path_2 = '';
		    			break;
		    		case 3:
		    			$scope.input.del_file = $scope.input.img_file_3
		    			$scope.input.del_path = $scope.input.img_path_3
		    			$scope.input.img_file_3 = '';
		    			$scope.input.img_path_3 = '';
		    			break;
	    		}
//	    		var params = $('#commentRewriteForm').serialize();
	    		LotteForm.FormSubmitForAjax(
	    			LotteCommon.swagImageDeleteData + '?' + $scope.baseParam, $scope.input
        		).success(function(data) {
        			// 엘리먼트 숨김 처리
        			document.querySelectorAll('#img_list img')[index - 1].src = blankImageUrl; 
        			document.querySelectorAll('#img_list a')[index - 1].style.display = 'none';
        		}).error(function(ex) {
        			ajaxResponseErrorHandler(ex);
                });
    		}
    	};
    	
    	// cancel(): 취소
    	$scope.cancel = function() {
    		if (confirm('육아TIP 작성을 취소하시겠습니까?')) {
				//alert("리스트 이동 할것")
				/* Start::20170614 작성취소 시 선택되어진 리프카테고리로 이동 */
				var url = $location.absUrl().split('&');
				var mcate = [];
				for(i = 0; i < url.length; i++){
					if(url[i].indexOf('mcate')>-1){
						mcate = url[i].split('=');
					}
				}
    			location.replace(LotteCommon.infantMainUrl+"?"+$scope.baseParam+"&dispNo="+$scope.dispNo+"&dcate=2" + "&mcate=" + (mcate[1] || ''));
				/* End::20170614 작성취소 시 선택되어진 리프카테고리로 이동 */
    		}
    	};
    	
    	// deleteComment(): 육아TIP 삭제
    	$scope.deleteComment = function() {
			/* Start::20170614 작성취소 시 선택되어진 리프카테고리로 이동 */
			var url = $location.absUrl().split('&');
			var mcate = [];
			for(i = 0; i < url.length; i++){
				if(url[i].indexOf('mcate')>-1){
					mcate = url[i].split('=');
				}
			}
			/* End::20170614 작성취소 시 선택되어진 리프카테고리로 이동 */
				
    		$http.get(
    			//LotteCommon.commentCountDeletedData + '?' + $scope.baseParam + '&gdas_no=' + $scope.commentRewrite.gdas_no
    			"/json/mall/swag_delete.json?bbcNo =" + $scope.bbc_no
    		).success(function(data) {
    			//alert("리스트로 이동");
    			// 최근 1개월 동안 삭제한 육아TIP 수
    			/*var count = data.comment_count_deleted.deleted_count;
    			if (count == 2) {
    				if (!confirm('고객님께서는 최근 1개월 동안 총 2회 육아TIP를 삭제하셨습니다.\n지금 삭제하시면 앞으로 3개월간 육아TIP 작성 권한이 제한됩니다.\n삭제하시겠습니까?')) {
    					return;
    				}
    			} else {
    				if (!confirm('해당 육아TIP를 삭제 하시겠습니까?')) {
    					return;
    				}
    			}
    			// 삭제
	    		LotteForm.FormSubmitForAjax(
	    			LotteCommon.commentDeleteData + '?' + $scope.baseParam, { 'gdas_no': $scope.input.gdas_no }
        		).success(function(data) {
        			location.replace(LotteCommon.mylotteCritViewUrl + '?' + $scope.baseParam);
        		}).error(function(ex) {
        			ajaxResponseErrorHandler(ex);
                });*/
    			// 리스트로 이동
    			$timeout(function() {
    				//alert("리스트 이동 할것")
    				location.replace(LotteCommon.infantMainUrl+"?"+$scope.baseParam+"&dispNo="+$scope.dispNo+"&dcate=2" + "&mcate=" + (mcate[1] || ''));
            	}, 200);
	    	}).error(function(ex) {
	        	ajaxResponseErrorHandler(ex);
	        });
    	};
    	
    	// save(): 등록
    	$scope.save = function(no) {
			/* Start::20170614 작성취소 시 선택되어진 리프카테고리로 이동 */
			var url = $location.absUrl().split('&');
			var mcate = [];
			for(i = 0; i < url.length; i++){
				if(url[i].indexOf('mcate')>-1){
					mcate = url[i].split('=');
				}
			}
			/* End::20170614 작성취소 시 선택되어진 리프카테고리로 이동 */
			
    		// 로그인 안된 경우
			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
				location.href = '/login/m/loginForm.do?' + targUrl;
				return;   
			}
    		// 입력값 유효성 검사
			var reviewTxt = $scope.input.bbc_cont;
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
				} else {
					// 웹일 때
		    		var url = LotteCommon.swagRewriteSaveData + '?' + $scope.baseParam;
					//var url = "/json/mall/swag_rewrite_save.json" + "?bbcNo=" + $scope.bbc_no; + $scope.baseParam;
		    		LotteForm.FormSubmitForAjax(
		    			url, $scope.input
		    		).success(function(data) {
		    			if (data.swag_rewrite_save.response_code != "0000") {
							alert(data.swag_rewrite_save.response_msg);
						} else {
							// 리스트로 이동
			    			$timeout(function() {
			    				//alert("리스트 이동 할것")
			    				location.replace(LotteCommon.infantMainUrl+"?scrollback=y&"+$scope.baseParam+"&dispNo="+$scope.dispNo+"&dcate=2" + "&mcate=" + (mcate[1] || ''));
			  
			            	}, 200);
						}
		    			
		    		}).error(function(ex) {
			    		ajaxResponseErrorHandler(ex);
			        });
				}
    		});
    		return false; // form sumbmit 기본 동작 방지
    	};

    	
    	/**
    	 * 사용자 정보 불러오기
    	 */
    	function loadUserInfo(){
    		var param = {
    			bbc_no:$scope.bbc_no
    		};
    		$http.get("/json/mall/swag_rewrite.json", {params:param})
    		.success(function loadUserInfoSuccess(data){
    			$scope.input = data.swag_rewrite;

	        	$scope.images.img_1 = ($scope.input.img_path_1_nm && $scope.input.img_file_1_nm) 
						? LotteUtil.getImagePath('') + $scope.input.img_path_1_nm + $scope.input.img_file_1_nm
						: blankImageUrl; 
				$scope.images.img_2 = ($scope.input.img_path_2_nm && $scope.input.img_file_2_nm) 
						? LotteUtil.getImagePath('') + $scope.input.img_path_2_nm + $scope.input.img_file_2_nm
						: blankImageUrl;
				$scope.images.img_3 = ($scope.input.img_path_3_nm && $scope.input.img_file_3_nm) 
						? LotteUtil.getImagePath('') + $scope.input.img_path_3_nm + $scope.input.img_file_3_nm
						: blankImageUrl;
				$scope.hasImage = (($scope.input.img_path_1_nm && $scope.input.img_file_1_nm) 
						|| ($scope.input.img_path_2_nm && $scope.input.img_file_2_nm)
						|| ($scope.input.img_path_3_nm && $scope.input.img_file_3_nm)) ? true : false;
        	}).error(function(ex) {
	    		ajaxResponseErrorHandler(ex);
	        });
    	};
    	
    	loadUserInfo();
    	
    }]);

    app.directive('lotteContainer', ['$http', 'LotteUtil', function($http, LotteUtil) {
        return {
            templateUrl : '/lotte/resources_dev/mall/baby/swag_rewrite_container.html',
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