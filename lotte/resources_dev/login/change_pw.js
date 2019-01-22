(function(window, angular, undefined) {
    'use strict';
    var app = angular.module('app', [
         'lotteComm',
         'lotteSrh',
         'lotteSideCtg', 
        //  'lotteSideMylotte', 
         'lotteCommFooter'
    ]);

    app.controller('changePwCtrl', ['$scope', '$filter', '$sce', '$http', '$window', 'LotteCommon', "commInitData" , function($scope, $filter, $sce, $http, $window, LotteCommon, commInitData ){
        
        $scope.showWrap = true;
        $scope.contVisible = true;        
        $scope.subTitle = '비밀번호 변경'; // 서브헤더 타이틀
        $scope.actionBar = true; // 액션바 

		$scope.cert_key1 = "";
		$scope.cert_key2 = "";     
		
		$scope.cert_key1 = commInitData.query['cert_key1']!= null?commInitData.query['cert_key1']:"";
		$scope.cert_key2 = commInitData.query['cert_key2']!= null?commInitData.query['cert_key2']:"";
        
        $.ajax({
			type: 'post'
			, async: false
			, url: LotteCommon.simpleSignMemberPWChangeUrl
			, data: {
				"cert_key1": $scope.cert_key1,
				"cert_key2": $scope.cert_key2        		
        	}			
			, success: function(data) {
	   			$scope.cert_key1 = data.cert_key1;
	   			$scope.cert_key2 = data.cert_key2;
	   			
	   			if ($scope.cert_key1 == "") {
	   				document.href = LotteCommon.mainUrl;
	   				return;
	   			}

	   			if ($scope.cert_key2 == "" ) {
	   				document.href = LotteCommon.mainUrl;;	   				
	   				return;
	   			}	   			
	   			
			}
			, error: function(data) {
			}
		});        
        
    }]);
    
    app.directive('lotteContainer',["LotteUtil", "LotteCommon", function(LotteUtil, LotteCommon){
        return {
            templateUrl: '/lotte/resources_dev/login/change_pw_container.html',
            replace:true,
            link:function($scope, el, attrs){
                                
        	   /* 비밀번호 체크 로직 : common 이 프리징으로 사용중이라 이곳에 직접 작성함.*/
                var korCheck = /([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i; // 한글외에 입력 정규식
                var engCheck = /([가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i; // 한글제외 입력 정규식 //20150617 수정
                var blankAllCheck = /^\s+|\s+$/g; // 공백만 입력 확인 정규식
                var blankCheck = /[\s]/g; // 중간 공백 확인 정규식
                var numCheck = /^[0-9]*$/; // 숫자 정규식 // 20150616 정규식 수정
                var mixCheck = /^(?=.*[a-zA-Z])(?=.*[`~!@#$%^*+=-?:;.,|\\\{\}\[\]\(\)\/])(?=.*[0-9]).{6,16}$/; // 영문, 숫자, 특수문자 혼합 확인 정규식 // 20150618 수정
                var specificCheck = /([\<\>\&\'\"])/i; // 특수문자 제외 정규식
                
                function pwWordCheck2(sel, val) {
                    var pwSel = sel; // 받아온 인자 [이름] 선택자
                    var pwVal = val; // 받아온 인자 [이름] value값

                    if(pwVal == ''){ // 빈 값일 경우
                           alert('입력되지 않은 정보가 있습니다.');                           
                           return false;
                    }
                    if(kin4(pwVal, 3)) {       // 같은 영문자&숫자 연속 3번 정규식
                           alert('연속된 문자를 사용할 수 없습니다.')
                           return false;
                        }
                    if(blankAllCheck.test(pwVal)){ // 공백만 입력 되어 있을 경우
                           alert('공백은 사용할 수 없습니다.');
                           return false;
                        }
                    if(blankCheck.test(pwVal)){ // 공백이 포함 되어 있을 경우
                           alert('공백은 사용할 수 없습니다.');
                           return false;
                    }
                        if(specificCheck.test(pwVal)) {
                            alert('특수문자 중 &, <, >,", ' + "'는 사용할 수 없습니다.")                            
                            return false;
                        }
                        if(pwVal.length < 8 || pwVal.length > 15 || !mixCheck.test(pwVal)){ // 숫자 7자리 미만 15자 초과이고 영문, 숫자, 특수문자 혼합 아닐 경우
                            alert('비밀번호는 8~15자리의 영문, 숫자, 특수문자를 혼합하여 설정해주세요.')
                            return false;
                        }
                        return true;
                };

                //연속된 숫자, 문자 체크
                function kin4(val, max) {
                        if(!max) max = 3; //글자수를 지정하지 않으면 3로 지정
                        var i, j, k, x, y;
                        var buff = ["0123456789", "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
                        var src, src2, ptn = "";

                        for(i=0; i<buff.length; i++) {
                               src = buff[i];
                               src2 = buff[i] + buff[i];
                               for(j=0; j<src.length; j++) {
                                       x = src.substr(j, 1);
                                       y = src2.substr(j, max);
                                       ptn += "["+x+"]{"+max+",}|";
                                       ptn += y+"|";
                               }
                        }
                        ptn = new RegExp(ptn.replace(/.$/, ""));

                        if(ptn.test(val)) return true;
                        return false;
                }                
                
	        	$scope.fn_SendPW = function() {	                    
	        		if(!pwWordCheck2($('#passwd'),$('#passwd').val())){
                        $("#passwd").val("");
                        $("#passwd_re").val("");
                        $("#passwd").focus();
                        return;		// 비번체크 
                    }else{
                        if(!LotteUtil.pwReWordCheck($('#passwd_re'),$('#passwd_re').val(),$('#passwd').val())){
                            $("#passwd_re").val("");
                            $("#passwd_re").val("");
                            $("#passwd_re").focus();
                            return;		// 비번확인
                        }else{
                            //동일한 비번인지 먼저 체크, common 이 프리징이라 주소 직접 입력
                            $.ajax({
                                type: "GET"
                                ,url: "/json/login/curPwSameCheck.json?passwd="+$('#passwd').val()+"&cert_key1=" + $scope.cert_key1
                                ,success:function(data) {	
                                    if(data.result=="success"){
                                        $.ajax({
                                            type: "POST"
                                            ,url: LotteCommon.simpleSignMemberPWChangeGoUrl
                                            ,data: {
                                                "cert_key1": $scope.cert_key1,
                                                "cert_key2": $scope.cert_key2,
                                                "passwd": $('#passwd').val(),
                                                "passwd_re": $('#passwd_re').val()        						
                                            }
                                            ,success:function(data) {	
                                                data = data.result;		
                                                if(data=="success"){
                                                    alert("비밀번호 변경에 성공하였습니다.\n다시 로그인하여 안전하게 쇼핑하세요.");
                                                    $scope.next();
                                                }else if(data=="same"){
                                                    alert("이메일 주소와 비밀번호가 동일합니다.\n다시 입력 바랍니다.");	
                                                    $("#passwd").val("");
                                                    $("#passwd_re").val("");
                                                    $("#passwd").focus();                                        
                                                }else {
                                                    alert("비밀번호 변경 실패 하였습니다.");                                
                                                }
                                            }
                                        });	                                
                                    }else {
                                        alert(data.result);  
                                        $("#passwd").val("");
                                        $("#passwd_re").val("");
                                        $("#passwd").focus();                                        
                                    }
                                }
                            });	                             
                        } 	
                    } 								                    
	        	}

	        	$scope.next = function(){
                    var url = LotteCommon.mainUrl;
                    if($scope.fromEllotte){
                        url = "https://m.members.ellotte.com/members-mo/login/form";   
                        //url = "https://m.members.tellotte.com/members-mo/login/form";
                    }
	        		window.location.href = url;
	        	}
	        	
	        	$scope.$watch('passwd',function(newVal) {
	        		//console.log(newVal);
	        		if(newVal) {
	        			$scope.passwd = newVal.slice(0, 15);
	        		}
	        	});
	        	
	        	$scope.$watch('passwd_re',function(newVal) {
	        		//console.log(newVal);
	        		if(newVal) {
	        			$scope.passwd_re = newVal.slice(0, 15);
	        		}
	        	});
	        	
            }
        };
    }]);
    
})(window, window.angular);
