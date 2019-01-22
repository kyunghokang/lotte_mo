(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
         'lotteComm',
         'lotteSrh',
         'lotteSideCtg', 
        //  'lotteSideMylotte', 
         'lotteCommFooter'
    ]);

    app.controller('findPwCtrl', ['$scope', '$filter', '$sce', '$http', '$window', 'LotteCommon', 'LotteUtil', 'commInitData' , function($scope, $filter, $sce, $http, $window, LotteCommon, LotteUtil, commInitData ){
        
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "비밀번호 찾기"; // 서브헤더 타이틀
        $scope.actionBar = true; // 액션바
        $scope.screenID = "FindPWD";
        
        $scope.hpno_1 = "";
        $scope.hpno_2 = "";
        $scope.hpno_3 = "";
        
        $scope.requestAgent = navigator.userAgent;
        $scope.schema = commInitData.query['schema']!= null?commInitData.query['schema']:"";        

        //휴대폰번호
	   	$.ajax({
			type: 'post'
			, async: false
			, url: LotteCommon.simpleSignMemberIdFindUrl			
	   		, success: function(data) {
	   			$scope.hp_list = data;
	   		} , error: function(data) {
				console.debug("핸드폰 국번 로딩 실패");
			}
		});        
        
    }]);
    
    app.directive('lotteContainer',['LotteUtil', 'LotteCommon', '$timeout', function(LotteUtil, LotteCommon, $timeout){
        return {
            templateUrl: '/lotte/resources_dev/login/find_pw_container.html',
            replace:true,            
            link:function($scope, el, attrs){
            	
            	var transformJsonToParam = function(obj) {
            		  var str = [];
            		  for (var p in obj) {
            		    if (Array.isArray(obj[p])) {
            		      for(var i=0; i<obj[p].length; i++) {
            		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p][i]));
            		      }
            		    } else {
            		      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            		    }
            		  }
            		  return str.join("&");
            		}            	
        	
	        	$scope.fn_SendEmail = function() {	        			
	        		if(!LotteUtil.notKorWordCheck($('#login_id'),$('#login_id').val())) return;		// 이메일 id
	        		if(!LotteUtil.korWordCheck($('#mbr_name'),$('#mbr_name').val())) return;		// 이름 체크	
	        		if(!LotteUtil.numWordCheck($('#hpno_2'),$('#hpno_2').val())) return;		// 휴대폰번호 통신사구분을 제외함
	        		if(!LotteUtil.numWordCheck($('#hpno_3'),$('#hpno_3').val())) return;		// 휴대폰번호 통신사구분을 제외함
	
	        		var cell_sct_no = $("select[name=hpno_1]").val();
	        		var cell_no =  $("input[name=hpno_2]").val() + $("input[name=hpno_3]").val();
	        		var mksh_cert_sn =  $("#login_id").val();	
	        		var cert_no =  $("#mbr_name").val();	
	
	        		var requestData = "";
	        		requestData += "&cell_sct_no="+cell_sct_no;
	        		requestData += "&cell_no="+cell_sct_no+cell_no;
	        		requestData += "&re_send_sms_yn=";
	        		requestData += "&mksh_cert_sn="+mksh_cert_sn;
	        		requestData += "&cert_no="+cert_no;
	        		requestData += "&certGubun=3"; //3 이메일
                    if($scope.fromEllotte){
                        requestData += "&ellotte_join=Y"; 
                    }
                    
                    
	        		$.ajax({
	        			type: 'post'
	        			, async: false
	        			, url: LotteCommon.simpleSignMemberCertificationUrl + '?' + $scope.baseParam
	        			, data:requestData
	        			, success: function(data) {		        				
	        				data = data.result;
	        				if(data != "fail" && data != "chkEmail" && data != "chkCell" ){
	        					$scope.mbr_no = data;
	        					$("#mbr_no").val(data);
	        					$scope.next();
	        				}else if ( data == "chkEmail"){
	        					alert("이메일 주소를 다시 입력해 주세요.");
	        				}else if ( data == "chkCell"){
	        					alert("휴대폰 번호를 다시 입력해 주세요.");
	        				}else{
	        					alert("입력한 정보로 가입된 회원을 찾을 수 없습니다. \n정보를 확인해 주세요.");
	        				}
	        			},
	        			error:function(r){
	        				alert("에러 발생 :"+r);
	        			}
	        		});
	        	}        	
        	
        	
	        	$scope.next = function() {
	        		//20180327 
    	    		var frm_send = el.find("#findMemberForm");
    	    		frm_send.attr("action", LotteCommon.simpleSignMemberPWFindAfter + '?' + $scope.baseParam + $scope.more_param);
    	    		$timeout(function() {
    	    			frm_send.submit();
    	    		}, 1000);	        		
	        	}        	
        	

	        	/*패밀리 팝업*/	    
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
    
    app.directive('inputMaxLengthNumber', function() {
    	return {
    		require: 'ngModel',
    		restrict: 'A',
    		link: function(scope, element, attrs, ngModelCtrl) {
    			function maxLengthCheck(text) {
    				var maxlength = Number(attrs.maxlength);    				
    				if(String(text).length > maxlength) {
                        ngModelCtrl.$setViewValue(ngModelCtrl.$modelValue);
                        ngModelCtrl.$render();
                        return ngModelCtrl.$modelValue;
                    }
    				return text;
    			}
                ngModelCtrl.$parsers.push(maxLengthCheck);
    		}
    	};
    });
    
})(window, window.angular);
