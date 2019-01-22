(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
         'lotteComm',
         'lotteSrh',
         'lotteSideCtg', 
        //  'lotteSideMylotte', 
         'lotteCommFooter'
    ]);

    app.controller('findPwAfterCtrl', ['$scope', '$filter', '$sce', '$http', '$window', 'LotteCommon', 'LotteUtil','commInitData', function($scope, $filter, $sce, $http, $window, LotteCommon, LotteUtil,commInitData ){
        
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "비밀번호 찾기"; // 서브헤더 타이틀
        $scope.actionBar = true; // 액션바
        
        var mbr_name = decodeURIComponent($("#mbr_name").val(), "UTF-8");
        var mbr_no = $("#mbr_no").val();
        var login_id = decodeURIComponent($("#login_id").val(), "UTF-8")
        var hpno_1 = $("#hpno_1").val();
        var hpno_2 = $("#hpno_2").val();
        var hpno_3 = $("#hpno_3").val();

        $scope.cert_exp_dtime = "";
        $scope.mbr_nm = "";
        $scope.email_addr = "";
        $scope.mbr_no = "";                
        $scope.mask_mbr_nm = "";        
        $scope.mksh_cert_sn = "";
        $scope.easgn_sgt_sn = "";
        $scope.valid_domain = "";
        $scope.btnView = false;
        
        var paramData = {
            "mbr_name" : mbr_name 
            , "mbr_no" : mbr_no
            , "login_id" : login_id
            , "hpno_1" : hpno_1
            , "hpno_2" : hpno_2
            , "hpno_3" : hpno_3
     	}
        
        if(commInitData.query['ellotte_join']){
            paramData.ellotte_join = "Y";
            $scope.more_param = "&ellotte_join=Y"; 
        }
	   	 $.ajax({
	         type: 'post'
	         , async: false
	         , data : paramData
	         , url: LotteCommon.simpleSignMemberPWFindAfterUrl         
	         , success: function(data) {                
                if(data.chk_resend == "-95"){
                    alert("인증완료되어 다시 받기를 할 수 없습니다.\n비밀번호 찾기를 처음부터 진행해주세요.");
                    location.href = "/login/simpleSignMemberPWFind.do?" + $scope.baseParam + $scope.more_param;                    
                }else if(data.chk_resend == "-90"){
                    alert("인증메일 재발송 기간이 경과되었습니다.\n다시 진행 부탁 드립니다.");
                    location.href = "/login/simpleSignMemberPWFind.do?" + $scope.baseParam + $scope.more_param;                    
                }else if(data.email_addr == undefined){
                    alert("다시 진행 부탁 드립니다.");
                    location.href = "/login/simpleSignMemberPWFind.do?" + $scope.baseParam + $scope.more_param;                                        
                }else{
                    //alert("메일주소로 인증메일이 발송되었습니다.\n3시간 이내에 인증완료해주세요.");
                }                 
	             $scope.cert_exp_dtime = data.cert_exp_dtime;
	             $scope.mbr_nm = data.mbr_nm;
	             $scope.email_addr = decodeURIComponent(data.email_addr);
	             $scope.mbr_no = data.mbr_no;                
	             $scope.mask_mbr_nm = data.mask_mbr_nm;	             
	             $scope.mksh_cert_sn = data.mksh_cert_sn;
	             $scope.easgn_sgt_sn = data.easgn_sgt_sn;
	             $scope.valid_domain = data.valid_domin;
	             
	             //특정 도메인 버튼 노출 금지 - rudolph:151130
	             //var email_domain = $scope.email_addr.split('@');
                 $scope.btnView = true;
                 /*
	             if(email_domain[1] == "gmail.com"
	            	 || email_domain[1] == "hotmail.com"
	            	 || email_domain[1] == "lycos.com"
	                 || email_domain[1] == "empal.com") {
	            	 $scope.btnView = true;
	             } else {
	            	 $scope.btnView = false;
	             } 
                 */
	             
	         } , error: function(data) {
	             console.log("DATA : " + data);
	         }
	     });                

    }]);
    //마스킹처리
	app.filter('strmask', function() {
		return function(str) {    
            var arr = str.split("@");
            var temp = "";
            for(var i=0; i< arr[0].length; i++){
                if(i < 2){
                    temp += arr[0].charAt(i);
                }else{
                    temp += "*";
                }
            }            
			return temp + "@" + arr[1]; 
		}
	});    
    app.directive('lotteContainer',['LotteCommon', '$timeout', function(LotteCommon, $timeout){
        return {
            templateUrl: '/lotte/resources_dev/login/find_pw_after_container.html',
            replace:true,
            link:function($scope, el, attrs){
            	            
	    		if($scope.btnView == false) {
	    			$("#login_go_btn").attr("style", "display:none;");
	    		} else {
	    			$("#login_go_btn").attr("style", "display:block;");
	    		}        	
        	
                //인증메일 확인하러 가기
                $scope.goChkMail = function() {
                    var email_addr = $scope.email_addr;
                    var email_domain = email_addr.split('@');
                    outLink('http://www.'+email_domain[1]);                    
                }

                //다시인증 받기
                $scope.reSendCertifyEmail = function() {
    	    		var frm_send = el.find("#findMemberForm");
    	    		frm_send.attr("action", LotteCommon.simpleSignMemberReSendEmail + "?" + $scope.baseParam + $scope.more_param);
    	    		$timeout(function() {
    	    			frm_send.submit();
    	    		}, 1000);	                      
                }
            }
        };
    }]);
    
})(window, window.angular);
