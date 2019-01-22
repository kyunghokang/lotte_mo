(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
         'lotteComm',
         'lotteSrh',
         'lotteSideCtg', 
        //  'lotteSideMylotte', 
         'lotteCommFooter'
    ]);

    app.controller('findIdCtrl', ['$scope', '$filter', '$sce', '$http', '$window', 'LotteCommon', 'LotteUtil', 'commInitData', function($scope, $filter, $sce, $http, $window, LotteCommon, LotteUtil, commInitData ){
        
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = '계정 찾기'; // 서브헤더 타이틀
        $scope.actionBar = true; // 액션바
        $scope.screenID = "FindID";
        
        $scope.formVal = {};
        $scope.formVal.mbr_name = ''; //이름
        $scope.formVal.hpNum = {};
        $scope.formVal.hpNum.hpno_2 = ''; //핸드폰번호 중간자리
        $scope.formVal.hpNum.hpno_3 = ''; //핸드폰번호 뒷자리
        $scope.formVal.cert_no=''; //인증번호
        
        $scope.re_send_sms_yn = '' //인증번호 재발 송 유무                
        $scope.dbClick=false;		// 중복클릭
        $scope.smsSendCnt = 0; 
        $scope.schema = commInitData.query['schema']!= null?commInitData.query['schema']:"";
        
        //휴대폰번호
	   	$.ajax({
			type: 'post'
			, async: false
			, url: LotteCommon.simpleSignMemberIdFindUrl
	   		, success: function(data) {
	   			$scope.hp_list = data;
	   		} , error: function(data) {
				alert("핸드폰 국번 로딩 실패");
			}
		});
    }]);
    
    app.directive('lotteContainer',['LotteUtil', 'LotteCommon', function(LotteUtil, LotteCommon){
        return {
            templateUrl: '/lotte/resources_dev/login/find_id_container.html',
            replace:true,
            link:function($scope, el, attrs){

        		//인증번호 발송
		        $scope.fn_SendSms = function(doc_type){
		        	$('#sendSMS').hide();
		        	$('#reSendSMS').show();
		        	if($scope.smsSendCnt >= 10) {
		        		alert('일 인증번호 발송 횟수가 초과 되었습니다.\n내일 다시 시도해 주세요.'); 
		        		return;
		        	}

		        	if(!LotteUtil.korWordCheck($('#mbr_name'),$('#mbr_name').val())) return;		// 이름 체크		
		        	if(!LotteUtil.numWordCheck($('#hpno_2'),$('#hpno_2').val())) return;		// 휴대폰번호 통신사구분을 제외함
		        	if(!LotteUtil.numWordCheck($('#hpno_3'),$('#hpno_3').val())) return;

		        	$scope.cell_sct_no = $("#mbr_name").val();
		        	$scope.cell_no = $("#hpno_1").val() + $("#hpno_2").val() + $("#hpno_3").val();        	
		        	$scope.mksh_cert_sn = $("#mksh_cert_sn").val();
		        	
		        	var requestData = "&cell_sct_no="+$scope.cell_sct_no;
		        	requestData += "&cell_no="+$scope.cell_no;
		        	requestData += "&re_send_sms_yn="+$scope.re_send_sms_yn;
		        	requestData += "&mksh_cert_sn="+$scope.mksh_cert_sn;
		        	requestData += "&cert_no=";
		        	requestData += "&certGubun=1";  //1 단순sms
		        	console.log("requestData : " + requestData);
		        	
		        	$.ajax({
		        		type: 'post'
		        		, async: false		        					  
		        		, url: LotteCommon.simpleSignMemberCertificationUrl + '?' + $scope.baseParam
		        		, data: requestData
		        		, success: function(data) {
			        		if(data != ""){
			        			alert("인증번호를 발송 하였습니다.");
			        			$("#sendSMS").hide();
			        			$("#reSendSMS").show();
			        			$("#mksh_cert_sn").val(data.result);
			        			$scope.smsSendCnt++;
			        			console.log("smsSendCnt : " + $scope.smsSendCnt);
			        		}else{				
			        			alert("인증번호 발송에 실패 하였습니다.\n휴대폰번호를 확인해 주세요.");
			        		}
		        		}
		        	});		        	
		        }
		
		        //sms재발송
		        $scope.fn_reSendSms = function(){
		        	$scope.re_send_sms_yn = 'Y';		
		        	$scope.fn_SendSms();
		        }
		
		        $scope. fn_CertifySMS = function () {
		        	if(!$scope.dbClick){
		        		if(!LotteUtil.korWordCheck($('#mbr_name'),$('#mbr_name').val())) return;		// 이름 체크		
		        		if(!LotteUtil.numWordCheck($('#hpno_2'),$('#hpno_2').val())) return;		// 휴대폰번호 통신사구분을 제외함
		        		if(!LotteUtil.numWordCheck($('#hpno_3'),$('#hpno_3').val())) return;		
		        	
		        		if($scope.formVal.cert_no ==''){ alert('입력되지 않은 정보가 있습니다.'); return; }
		
		            	$scope.cell_sct_no = $("#mbr_name").val();
		            	$scope.cell_no = $("#hpno_1").val() + $("#hpno_2").val() + $("#hpno_3").val();
		            		
		            	$scope.mksh_cert_sn =  $("#mksh_cert_sn").val();	
		        	
		        		var requestData = "&cell_sct_no="+$scope.cell_sct_no;
		        		requestData += "&cell_no="+$scope.cell_no;
		        		requestData += "&re_send_sms_yn="+ $scope.re_send_sms_yn;
		        		requestData += "&mksh_cert_sn="+$scope.mksh_cert_sn;
		        		requestData += "&cert_no="+$scope.formVal.cert_no;
		        		requestData += "&certGubun=2"; //2 인증
		        		console.log("requestData : " + requestData);
		        		
		        		$.ajax({
		        			type: 'post'
		        			, async: false
		        			, url: LotteCommon.simpleSignMemberCertificationUrl + '?' + $scope.baseParam
		        			, data:requestData
		        			, success: function(data) {	
		        				    data = data.result.trim();
		        					if(data=="-99"){
		        						alert('인증번호가 일치하지 않습니다.\n다시 입력해주세요.');
		        					}
		        					else if(data=="-90"){
		        						alert('기간이 경과되었습니다.\n인증번호를 다시 받아 주세요.');
		        					}else if(data=="success"){		
		        						$scope.dbClick = true;			
		        						$scope.fn_successCertify();				
		        					}			
		        			},
		        			error:function(r){
		        				alert("에러 발생 :"+r);
		        			}
		        		});
		        	}	
		        }
		
		        //아이디 찾기 성공
		        $scope.fn_successCertify = function (){	
		        	document.findMemberForm.action = LotteCommon.simpleSignMemberIdFindAfter;	
		        	document.findMemberForm.submit();
		        }
		        
		
		        $scope.maxLengthCheck = function (object){
		        	if (object.value.length > object.maxLength){
		        		object.value = object.value.slice(0, object.maxLength);
		        	}    
		        }

	            $scope.goFamilySite = function(div) {
		         	   
	         	   if($scope.joinBtnViewYn == "N") {
	         		   /* 2015.05.29 iOS 닷컴, 엘롯데 APP 회원가입 pro 공통코드로 제어 */
	         		   var isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);
	         		   if(div == "mem_reg" && isIDevice) {
	         				alert("죄송합니다. 일시적으로 닷컴/엘롯데 PC를 통해서만 회원가입이 가능합니다.");
	         				return;
	         			}
	         	   }
	         	           	   
	         	   var family_url = "member.lpoint.com/door/user/mobile/";
	         	   var main_url = encodeURIComponent(
	         			   ($scope.schema == ""? LotteCommon.baseUrl:($scope.schema + LotteCommon.baseUrl.replace("http", ""))) + "/" 
	         			   + (LotteUtil.isSmp() ? "main_smp.do" : "main.do") 
	         			   + $scope.baseParam, "UTF-8");
	         		var target_url = "";
					var return_url = '';
					
					// 앱/웹 분기처리
					if($scope.schema == "") {
					 	return_url = encodeURIComponent(window.location.href, "UTF-8");
					}else{
						return_url = window.location.href.replace(/^http(s)?/,$scope.schema);
					}
	         		
	         		if(div == "id") { /* 아이디찾기 */
	         			target_url = "requestId.jsp";
	         		} else if(div == "passwd") { /* 비밀번호 찾기 */
	         			target_url = "requestPasswd.jsp";
	         		} else if(div == "mem_reg") { /* 회원가입 */
	         			target_url = "login_common.jsp";
	         		}
	         		
	         		family_url += (target_url + "?sid=" + LotteUtil.getLoginSeed() + "&returnurl=" + return_url + "&main_url=" + main_url);
	         		family_url += "&sch=" + $scope.schema;
	         		
	         		var uagent = navigator.userAgent;
	         		
	     			if($scope.schema != "") { /* 앱일경우 */
	     				if(LotteUtil.boolAppInstall(uagent)) {
	     					window.location = "family://" + family_url;    					
	     				} else if(LotteUtil.boolAndroid(uagent)) {
	     					window.myJs.callAndroid("https://" + family_url);
	     				}
	     			} else {
	     				window.open("https://" + family_url, "family");    				
	     			}
		        }		        
        	
            }
        };
    }]);
    
})(window, window.angular);
