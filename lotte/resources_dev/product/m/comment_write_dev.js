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

    app.controller('commentRewriteCtrl', ['$scope', '$timeout', 'LotteCommon', '$http', '$filter', '$window', 'LotteUtil', 'LotteForm', function($scope, $timeout, LotteCommon, $http, $filter, $window, LotteUtil, LotteForm) {
    	$scope.showWrap = true;
    	$scope.contVisible = true;
    	$scope.subTitle = '상품평 수정'; /* 서브헤더 타이틀 */

    	// INPUT 데이터 초기화
    	$scope.input = {};
    	$scope.input.evt_no = LotteUtil.getParameter('evt_no');
    	$scope.input.evt_flag = LotteUtil.getParameter('evt_flag');
    	$scope.snsFlag = '';
    	
    	// 빈 이미지 경로
    	var blankImageUrl = LotteUtil.getImagePath() + '/mobile/mobile_new/mylotte/blank.png';
    	
    	// 상품 데이터 조회
    	$scope.commentRewrite = {};
    	try {
	    	$http.get(LotteCommon.commentRewriteData + '?' + $scope.baseParam + '&gdas_no=' + LotteUtil.getParameter('gdas_no') + '&goods_no=' + LotteUtil.getParameter('goods_no'))
					.success(function(data) {
				$scope.commentRewrite = data.comment_rewrite;
				
				// E-쿠폰 혹은 스마트픽일 때 타이틀 변경
				$scope.subTitle = ($scope.commentRewrite.goods_tp_cd == '20' || $scope.commentRewrite.smp_psb_yn) ? '이용후기 쓰기' : $scope.subTitle;
				
				$scope.input.gdas_no = $scope.commentRewrite.gdas_no; 
		    	$scope.input.reviewTxt = $scope.commentRewrite.gdas_cont;
		    	$scope.input.prc_stfd_val = $scope.commentRewrite.prc_stfd_val;
		    	$scope.input.qual_stfd_val = $scope.commentRewrite.qual_stfd_val;
		    	$scope.input.dsgn_stfd_val = $scope.commentRewrite.dsgn_stfd_val;
		    	$scope.input.dlv_stfd_val = $scope.commentRewrite.dlv_stfd_val;
		    	$scope.input.size = $scope.commentRewrite.prdt_size_eval_desc;
		    	$scope.input.color = $scope.commentRewrite.prdt_clor_eval_desc;
	        	$scope.input.frst_gdas_yn = $scope.commentRewrite.frst_gdas && 'Y' || 'N'; 
	        	$scope.input.wrtr_pur_yn = $scope.commentRewrite.wrtr_pur && 'Y' || 'N'; 
	        	$scope.input.goods_no = $scope.commentRewrite.goods_no;
	        	$scope.input.usm_goods_no = $scope.commentRewrite.usm_goods_no;
	        	$scope.input.img_1 = ($scope.commentRewrite.img_path_1_nm && $scope.commentRewrite.img_file_1_nm) 
						? LotteUtil.getImagePath('') + $scope.commentRewrite.img_path_1_nm + $scope.commentRewrite.img_file_1_nm
						: blankImageUrl; 
				$scope.input.img_2 = ($scope.commentRewrite.img_path_2_nm && $scope.commentRewrite.img_file_2_nm) 
						? LotteUtil.getImagePath('') + $scope.commentRewrite.img_path_2_nm + $scope.commentRewrite.img_file_2_nm
						: blankImageUrl;
				$scope.input.img_3 = ($scope.commentRewrite.img_path_3_nm && $scope.commentRewrite.img_file_3_nm) 
						? LotteUtil.getImagePath('') + $scope.commentRewrite.img_path_3_nm + $scope.commentRewrite.img_file_3_nm
						: blankImageUrl;
				$scope.hasImage = (($scope.commentRewrite.img_path_1_nm && $scope.commentRewrite.img_file_1_nm) 
						|| ($scope.commentRewrite.img_path_2_nm && $scope.commentRewrite.img_file_2_nm)
						|| ($scope.commentRewrite.img_path_3_nm && $scope.commentRewrite.img_file_3_nm)) ? true : false;
	    	}).error(function(ex) {
	        	ajaxResponseErrorHandler(ex);
	        });
    	} catch(e) {
    		console.error(e);
    	}
    	
    	// deleteAttachedImage(): 첨부된 이미지 삭제
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
	    			LotteCommon.commentImageDeleteData + '?' + $scope.baseParam, $scope.input
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
    		if (confirm('상품평 수정을 취소하시겠습니까?')) {
    			location.replace(LotteCommon.mylotteCritViewUrl + '?' + $scope.baseParam + '&mode=second');
    		}
    	};
    	
    	// deleteComment(): 상품평 삭제
    	$scope.deleteComment = function() {
    		$http.get(
    			LotteCommon.commentCountDeletedData + '?' + $scope.baseParam + '&gdas_no=' + $scope.commentRewrite.gdas_no
    		).success(function(data) {
    			// 최근 1개월 동안 삭제한 상품평 수
    			var count = data.comment_count_deleted.deleted_count;
    			if (count == 2) {
    				if (!confirm('고객님께서는 최근 1개월 동안 총 2회 상품평을 삭제하셨습니다.\n지금 삭제하시면 앞으로 3개월간 상품평 작성 권한이 제한됩니다.\n삭제하시겠습니까?')) {
    					return;
    				}
    			} else {
    				if (!confirm('해당 상품평을 삭제 하시겠습니까?')) {
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
                });
	    	}).error(function(ex) {
	        	ajaxResponseErrorHandler(ex);
	        });
    	};
    	
    	// save(): 등록
    	$scope.save = function() {
    		// 입력값 유효성 검사
    		if (!$scope.commentRewrite.healthfood) {
    			// 상품평은 건강식품이 아닐때만 검사한다.
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
				$scope.prdComment = "[상품평] " + $scope.input.reviewTxt; // 상품평
    			$scope.share_img = $scope.commentRewrite.goods_img_url;
    			$scope.share_url = '/product/product_view.do?goods_no=' + $scope.commentRewrite.goods_no;
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
    		
       		if ($scope.appObj.isApp){
       			if ($scope.snsFlag) {
	       			if($scope.snsFlag == "sms") {
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "4");
	            		$scope.kakaoType = "";
	            		$scope.cnShareUrl = "";
	                	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.smsCdn;
	            	}
	            	if($scope.snsFlag == "kakaotalk") {
	        			$scope.kakaoType = "[롯데닷컴 이거어때]" + "\n";
	            		$scope.sendTclick($scope.tClickBase + 'share_Clk_Pop_' + "1");
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
	            		$scope.share_img = "http://image.lotte.com/lotte/mobile/common/icon3.png";
	            	}
	            	
	                var params = {
	                    url : $scope.cnShareUrl,
	                    title : $scope.kakaoType + $scope.prdComment.replace(/#/gi, ""),
	                    imageUrl : $scope.share_img
	                };
	
	                if($scope.appObj.isAndroid) {
	                    $window.lotteshare.callAndroid("lotteshare://" + $scope.snsFlag + "/query?" + JSON.stringify(params));
	                } else if($scope.appObj.isIOS) {
	                    $window.location = "lotteshare://" + $scope.snsFlag + "/query?" + JSON.stringify(params);
	                }
       			}
				// 앱일때 sumbmit은 네이티브로 처리한다.
				var url = 'ghost://SubmitPhotoComment/rewrite'
				// angular.element('#commentRewriteForm').serialize();
				// serialize()는 scope에 접근할 수 없고 앱은 JSON 객체를 받을 수 없으므로 일일이 문자열로 설정해야함
				url += '?gdas_no=' + $scope.input.gdas_no;
				url += '&reviewTxt=' + $scope.input.reviewTxt;
				url += '&prc_stfd_val=' + $scope.input.prc_stfd_val;
				url += '&qual_stfd_val=' + $scope.input.qual_stfd_val;
				url += '&dsgn_stfd_val=' + $scope.input.dsgn_stfd_val;
				url += '&dlv_stfd_val=' + $scope.input.dlv_stfd_val;
				url += '&size=' + $scope.input.size;
				url += '&color=' + $scope.input.color;
				url += '&mbr_no=' + $scope.commentRewrite.mbr_no;
				location.href  = url;
				return;
			} else {
	    		var url = LotteCommon.commentRewriteSaveData + '?' + $scope.baseParam;
	    		LotteForm.FormSubmitForAjax(
	    			url, $scope.input
	    		).success(function(data) {
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
                      	  	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.twitCdn; cc
                            $scope.sendTwitter();
                        } else if($scope.snsFlag == "url_copy") {
                        	$scope.cnShareUrl = "";
                      	  	$scope.cnShareUrl = $scope.noCdnUrl + "&cdn=" + $scope.urlCdn;
                      	  	$scope.urlCopyClick();
                        }
	    			}
	    			// 리스트로 이동
	            	$timeout(function() {
	            		location.replace(LotteCommon.mylotteCritViewUrl + '?' + $scope.baseParam + '&mode=second');
	            	}, 200);
	    		}).error(function(ex) {
	    			ajaxResponseErrorHandler(ex);
	            });
			}
    		return false; // form sumbmit 기본 동작 방지
    	};
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/product/m/comment_rewrite_container.html',
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