(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteSns'
    ]);

    app.controller('KidscommentWriteCtrl', ['$scope', '$timeout', 'LotteCommon', '$http', '$filter', '$window', 'LotteUtil', 'LotteForm', function($scope, $timeout, LotteCommon, $http, $filter, $window, LotteUtil, LotteForm) {
    	$scope.showWrap = true;
    	$scope.contVisible = true;
    	$scope.subTitle = '상품평 쓰기'; /* 서브헤더 타이틀 */

    	// INPUT 데이터 초기화
    	$scope.input = {};
    	$scope.input.reviewTxt = '';
    	$scope.input.prc_stfd_val = 5;
    	$scope.input.qual_stfd_val = 5;
    	$scope.input.dsgn_stfd_val = 5;
    	$scope.input.dlv_stfd_val = 5;
    	$scope.input.size = 1;
    	$scope.input.color = 1;
    	$scope.input.evt_no = LotteUtil.getParameter('evt_no');
    	$scope.input.evt_flag = LotteUtil.getParameter('evt_flag');
    	
    	$scope.isNewestApp = isNewestApp();
    	
    	/* 유아동 체험단 예외 처리 추가 */
    	$scope.isKids = false;
    	$scope.isKidsApp = false;
    	$scope.isKidsParam =  LotteUtil.getParameter('isKids');    
    	$scope.isKidsAppParam =  LotteUtil.getParameter('isKidsApp');    	
    	
    	/* 유아동 체험단 예외 처리 추가 */
    	if(LotteUtil.getParameter('isKids') == 'Y'){
    		$scope.isKids = true;
			$scope.subTitle = "체험단 후기 작성";
		}
    	
    	if (LotteUtil.getParameter('isKidsApp') == 'Y'){
    		$scope.isKidsApp = true;
		}
		
		//if ($scope.isKidsApp) {
			angular.element(document).ready(function () {
	    		$timeout(function(){
	    			// 앱으로 사진 영역 좌표 전달
	    			if($scope.appObj.isApp){
	        			if($scope.appObj.isAndroid){
	    					// android
	    					try{
	    						$window.lottepetswag.callAndroid('swag://no_position');
	    					}catch(e){}
	    				}else{
	    					//ios    					
	    					location.href = 'swag://no_position';
	    				}
	        		}
	        	}, 200);
	    	});	
		//}
    	
    	// 상품 데이터 조회
    	$scope.commentWrite = {};
    	try {
	    	$http.get(
	    		LotteCommon.commentWriteData + '?' + $scope.baseParam + '&evt_no=' + LotteUtil.getParameter('evt_no') + '&goods_no=' + LotteUtil.getParameter('goods_no')
	    	).success(function(data) {
	    		$scope.commentWrite = data.comment_write;		    		
	    		$scope.input.frst_gdas_yn = 'N'; 
	        	$scope.input.wrtr_pur_yn = 'T'; 
	        	$scope.input.goods_no = $scope.commentWrite.goods_no;
	        	$scope.input.usm_goods_no = $scope.commentWrite.usm_goods_no;
	    	}).error(function(ex) {
	    		ajaxResponseErrorHandler(ex);
	        });
    	} catch(e) {
    		console.error(e);
    	}	    	
    	
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
    		if(LotteUtil.getParameter('isKids') == 'Y'){
    			if (confirm('체험단 후기 작성을 취소하시겠습니까?')) {
        			location.replace(LotteCommon.kidsExperienceMainUrl + '?' + $scope.baseParam);
        		}
    		} else{
	    		if (confirm('상품평 작성을 취소하시겠습니까?')) {
	    			location.replace(LotteCommon.mylotteCritViewUrl + '?' + $scope.baseParam);
	    		}
    		}	
    	};
    	
    	$scope.save = function() {
    		var reviewTxt = $scope.input.reviewTxt;
			var reviewTxtElement = document.querySelector('#reviewTxt');
			if (reviewTxt.trim().length == 0) {
				alert('상품평을 작성해 주세요.');
				reviewTxtElement.focus();
				return false;
			}
			if (calcBytes(reviewTxt) < 6) {
				alert('상품평을 한글 3자 이상 입력하세요.');
				reviewTxtElement.focus();
				return false;
			}
			if (calcBytes(reviewTxt) > 4000) {
				alert('상품평은 2000자[한글기준] 이내로 제한되어 있습니다.');
				reviewTxtElement.focus();
				return false;
			}
			
			if ($scope.snsFlag) {
				// 카카오 라이브러리 키
				Kakao.cleanup();
				if($scope.appObj.isSktApp == true) {
            		Kakao.init("7a460fb5cdebe4589041db57d906ddda");
            	} else {
            		Kakao.init("574659987ca46095c123d71f72abac14");	
            	}
    			// 상품평 등록 후 SNS 공유
    			$scope.subTitle = '[상품평]';
				$scope.prdComment = $scope.input.reviewTxt; // 상품평
    			$scope.share_img = $scope.commentWrite.goods_img_url;
    			$scope.share_url = '/product/product_view.do?goods_no=' + $scope.commentWrite.goods_no;
    			$scope.goodsNm = $scope.commentWrite.goods_nm;
    			
                // 채널코드 분기
                if($scope.appObj.isSktApp == true) {
                	$scope.noCdnUrl = location.protocol + "//" + location.hostname + $scope.share_url + "&cn=171127";
                } else {
                	$scope.noCdnUrl = location.protocol + "//" + location.hostname + $scope.share_url + "&cn=123624";	
                }
                if($scope.appObj.isSktApp == true) {
            		$scope.talkCdn = "3093671";
            		$scope.twitCdn = "3093668";
            		$scope.stotyCdn = "3093670";
            		$scope.smsCdn = "3093672";
            		$scope.mailCdn = "3158697";
            		$scope.faceCdn = "3093669";
            		$scope.urlCdn = "3158696";
            		$scope.appCdn = "3158696";	
            	} else {
            		$scope.talkCdn = "2929723";
            		$scope.twitCdn = "2929720";
            		$scope.stotyCdn = "2929722";
            		$scope.smsCdn = "2929725";
            		$scope.mailCdn = "2929724";
            		$scope.faceCdn = "2929721";
            		$scope.urlCdn = "2929719";
            		$scope.appCdn = "2929719";
            	}
    		}
			if ($scope.appObj.isApp && LotteUtil.getParameter('isKidsApp') == 'Y') {
    			// 앱일 때
				if ($scope.snsFlag) {
	       			if($scope.snsFlag == "sms") {
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "4");
	            		$scope.kakaoType = "";
	            		$scope.cnShareUrl = "";
	                	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.smsCdn;
	            	}
	            	if($scope.snsFlag == "kakaotalk") {
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "1");
	            		if($scope.appObj.isOldApp) {
							$scope.kakaoType = "[롯데닷컴 이거어때?]" + "\n";	
						} else {
							$scope.kakaoType = "";	
						}
	            		$scope.cnShareUrl = "";
	                	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.talkCdn;
	            	}
	            	if($scope.snsFlag == "kakaostory") {
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "3");
	            		$scope.kakaoType = "";
	            		$scope.cnShareUrl = "";
	                	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.stotyCdn;
	            	}
	            	if($scope.snsFlag == "facebook") {
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "6");
	            		$scope.kakaoType = "";
	            		$scope.cnShareUrl = "";
	                	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.faceCdn;
	            	}
	            	if($scope.snsFlag == "twitter") {
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "2");
	            		$scope.kakaoType = "";
	            		$scope.cnShareUrl = "";
	                	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.twitCdn;
	            	}
	            	if($scope.snsFlag == "url_copy") {
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "7");
	            		$scope.kakaoType = "";
	            		$scope.cnShareUrl = "";
	                	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.urlCdn;
	            	}
	            	if($scope.snsFlag == "moreapp") {
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "8");
	            		$scope.kakaoType = "";
	            		$scope.cnShareUrl = "";
	                	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.appCdn;
	            	}
	            	if($scope.snsFlag == "mail") {
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "5");
	            		$scope.kakaoType = "";
	            		$scope.cnShareUrl = "";
	                	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.mailCdn;
	            	}
	            	 
	            	if($scope.share_img && $scope.share_img != "") {
	            		$scope.share_img = $scope.share_img;
	            	} else {
	            		$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png";
	            	}
	            	
					/* kakao link V1, V2 API 버젼 따라 params 형태 달라지므로 분기 처리 */
					if (($scope.appObj.isAndroid && $scope.appObj.verNumber < 408) || ($scope.appObj.isIOS && $scope.appObj.verNumber < 4050)) {
						var params = {
		                    url : $scope.cnShareUrl,
		                    title : $scope.kakaoType + $scope.prdComment.replace(/#/gi, ""),
		                    imageUrl : $scope.share_img
						};
					}else {
						var params = {
							type : "default",
							title : $scope.subTitle + $scope.goodsNm,
							imageUrl : $scope.share_img,
							url : $scope.cnShareUrl,
							buttons : [
								{
									title : "바로가기",
									url : $scope.cnShareUrl
								}
							]
						};

						if (type == "kakaotalk") { // 카카오일 경우 타이틀 처리 안함
							params.desc = $scope.kakaoType + $scope.subTitle.replace(/#/gi, "") + $scope.prdComment.replace(/#/gi, "");
						} else {
							params.desc = $scope.kakaoType + $scope.getDearPetShareTitle( $scope.subTitle ).replace(/#/gi, "") + $scope.prdComment.replace(/#/gi, "");
						}
					}
	
	                if($scope.appObj.isAndroid) {
	                    $window.lotteshare.callAndroid("lotteshare://" + $scope.snsFlag + "/query?" + JSON.stringify(params));
	                } else if($scope.appObj.isIOS) {
	                    $window.location = "lotteshare://" + $scope.snsFlag + "/query?" + JSON.stringify(params);
	                }
       			}
				
				// 앱일때 sumbmit은 네이티브로 처리한다.
				var url = 'ghost://SubmitPhotoComment/write';
				// angular.element('#commentWriteForm').serialize();
				// serialize()는 scope에 접근할 수 없고 앱은 JSON 객체를 받을 수 없으므로 일일이 문자열로 설정해야함
				url += '?frst_gdas_yn=' + $scope.input.frst_gdas_yn;  
				url += '&wrtr_pur_yn=' + $scope.input.wrtr_pur_yn;
				url += '&goods_no=' + $scope.input.goods_no;
				url += '&usm_goods_no=' + $scope.input.usm_goods_no;
				url += '&evt_no=' + $scope.input.evt_no;
				url += '&evt_flag=' + $scope.input.evt_flag;
				url += '&reviewTxt=' + $scope.input.reviewTxt;
				url += '&prc_stfd_val=' + $scope.input.prc_stfd_val;
				url += '&qual_stfd_val=' + $scope.input.qual_stfd_val;
				url += '&dsgn_stfd_val=' + $scope.input.dsgn_stfd_val;
				url += '&dlv_stfd_val=' + $scope.input.dlv_stfd_val;
				url += '&size=' + $scope.input.size;
				url += '&color=' + $scope.input.color;
				url += '&loginId=' + $scope.commentWrite.login_id;
				url += '&mbrNo=' + $scope.commentWrite.mbr_no;
				url += '&mbrNm=' + $scope.commentWrite.mbr_nm;
				url += '&mbrEmail=' + $scope.commentWrite.mbr_email;
				url += '&site_no=' + $scope.commentWrite.site_no;
				if (!$scope.isNewestApp) {
					// 구버전 앱일 때 항목 추가
					url += '&radio1=';
					url += '&radio2=' + $scope.input.color;
					url += '&radio2=';
					url += '&radio2=' + $scope.input.color;
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
					url += '&div_stfd_val=' + $scope.input.dlv_stfd_val;
				}
				console.log(url);
				
				$timeout(function() {
					location.href  = url;
            	}, 200);
				return;
    		} else{// 웹일 때
    			var url = LotteCommon.commentWriteSaveData + '?' + $scope.baseParam;
	    		LotteForm.FormSubmitForAjax(
	    			url, $scope.input
	    		).success(function(data) {
	    			//alert(data);
	    			console.log(data); 
	    			if ($scope.snsFlag) {
	                    if($scope.snsFlag == "sms") {
	                    	$scope.cnShareUrl = "";
	                  	  	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.smsCdn;
	                        $scope.showSmsBox();
	                    } else if($scope.snsFlag == "kakaotalk") {
	                    	$scope.cnShareUrl = "";
	                  	  	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.talkCdn;
	                        $scope.sendKakaoTalk();
	                    } else if($scope.snsFlag == "kakaostory") {
	                    	$scope.cnShareUrl = "";
	                  	  	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.stotyCdn;
	                        $scope.sendKakaoStory();
	                    } else if($scope.snsFlag == "facebook") {
	                    	$scope.cnShareUrl = "";
	                  	  	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.faceCdn;
	                        $scope.sendFacebook();
	                    } else if($scope.snsFlag == "twitter") {
	                    	$scope.cnShareUrl = "";
	                  	  	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.twitCdn;
	                        $scope.sendTwitter();
	                    } else if($scope.snsFlag == "url_copy") {
	                    	$scope.cnShareUrl = "";
	                  	  	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.urlCdn;
	                  	  	$scope.urlCopyClick();
	                    }
	    			}
	    			if(data.comment_write_save.response_code == '3101'){
	    				alert("이미 체험단 후기 등록을 하셨습니다");  	
	    				//location.replace(LotteCommon.kidsExperienceMainUrl + '?' + $scope.baseParam);
	    			} else if(data.comment_write_save.response_code == '3102'){
	    				alert("후기 작성에 실패했습니다.");  	
	    				//location.replace(LotteCommon.kidsExperienceMainUrl + '?' + $scope.baseParam);
	    			} else if(data.comment_write_save.response_code == '3100'){
	    				alert("후기 작성에 실패했습니다.");  	
	    				//location.replace(LotteCommon.kidsExperienceMainUrl + '?' + $scope.baseParam);
	    			} else if(data.comment_write_save.response_code == '3103'){
	    				alert("내용에 [금지어] 해당 글자는 등록하실 수 없습니다. 삭제 후 다시 등록해 주시기 바랍니다."); 
	    			} else{
	    				// 리스트로 이동
		    			$timeout(function() {  
		    				alert('후기 작성이 완료되셨습니다');
	    					location.replace(LotteCommon.kidsExperienceMainUrl + '?' + $scope.baseParam);		    				
		            	}, 200);
	    			}
	    		}).error(function(ex) {
		    		ajaxResponseErrorHandler(ex);
		        });	
    		}	
    	}	
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/product/m/kids_comment_write_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

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