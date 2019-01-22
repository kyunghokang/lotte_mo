(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteProduct',
        'lotteNgSwipe',
        'lotteCommFooter'
    ]);

    app.controller('largeOrderCtrl', ['$http', '$scope', 'LotteCommon', function($http, $scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "명절 대량주문"; // 서브헤더 타이틀
        $scope.screenID = "largeOrder"; // 스크린 아이디 
        
        $scope.pageData = {
            html : "",
            prdList : [],
        };
        $scope.oInfo = {
            name : $scope.loginInfo.name,
            id : $scope.loginInfo.loginId,
            tel1 : "010",
            tel2 : "",
            email : "",
            email2 : "naver.com",
            a : ['','','','',''],
            b : ['','','','',''],
            c : ['','','','','']
        }
        //ios 대응
        setTimeout(function(){
            $scope.oInfo.name = $scope.loginInfo.name; 
            $scope.oInfo.id = $scope.loginInfo.loginId; 
        },1000);
        
        $scope.view_more = false; //관심품목 3~5 더보기 
        $scope.viewMore = function(){
            $scope.view_more = true;
        }
        //화면 출력용 데이타 생성
        $scope.box_count = [1,2,3,4,5];
        $scope.data_pm = ["갈비/정육/사골","굴비/옥돔/생선","사과/배/과일세트","곶감/건과/버섯/수삼/견과세트","홍삼/인삼","건강식품","꿀/건강즙","김/멸치/젓갈/육포","한과/양과/떡","음료/차/잼","오일/햄/캔류","생활 선물세트","제수용품","상품권"];                 
        $scope.data_num = [];
        for(var i=1; i<101; i+=5){
            $scope.data_num.push(i +"~"+ (i+4));
        }
        $scope.agree = false; //개인정보 수집이용 동의 여부 
        $scope.getProductDataLoad = function(){
            //데이타 추가 로딩 필요시
        };
        // 스크린 데이터
        ($scope.screenDataReset = function() {            
            //기본 데이타 로드             
            var url = "/json/category/large_order.json";            
            $http.get(url)
        	.success(function(data) {
                $scope.pageData.html = data.result.html;
                $scope.pageData.prdList = data.result.prdList.items;
            }).error(function(data) {
                
            });
        })();
        
    }]);

    app.directive('lotteContainer',['$http','$window','LotteCommon', function($http,$window,LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/category/m/large_order_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                //바이트 수 체크 
                $scope.memo_count = 0;
                $scope.checkByte = function(str){
                    var flag = false;
                    var tcount = 0;
                    var byteStr = "";
                    var maxLength = 5000;
                    var length = str.length;
                    for(var i=0; i < length; i++){
                        byteStr = str.charAt(i);
                        if(escape(byteStr).length > 4){
                            tcount += 2;
                        }else{
                            tcount += 1;
                        }
                    }
                    
                    if(tcount > maxLength){
                        flag = true;           
                        tcount --;
                    }                
                    $scope.memo_count = tcount;
                    return flag;
                }
                $scope.change_field = function(){
                    if($scope.checkByte($scope.memo)){
                        $scope.memo = $scope.memo.substr(0, $scope.memo.length - 1);
                    }
                } 
                //다시 입력하기
                $scope.again = function(){
                    angular.element($window).scrollTop(0);
                    location.reload();
                }
                $scope.emailview = false;
                $scope.emailchange = function(){
                    if($scope.oInfo.email2 == ""){
                        $scope.emailview = true;
                        $("#oemail2").focus();
                    }
                }
                //상담신청하기
                //$scope.submit_url = "http://www.lotte.com/mail/insertNewyearLargeApplyMailMobile.lotte"; //상담신청하기 경로 
                $scope.submit_url = "/json/category/insert_large_order.json";
                
                var check_value = function(value, id, msg){
                    var flag = false;                    
                    if(value == "" || value == undefined){
                        alert(msg + " 입력해주세요.");
                        $("#" + id).focus();
                        flag = true;
                    }
                    return flag;
                }
                var check_box = function(){
                    if(!$scope.agree){
                        alert("개인정보 수집 이용에 동의해 주세요.");
                        $("#agree").focus();
                        return true;
                    }
                    return false;
                }
                $scope.check_login = function(){
                    console.log("login_check");
                    //로그인여부 (로컬에서는 패스)                    
                    if(!$scope.loginInfo.isLogin && !LotteCommon.isTestFlag){
                        $window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&targetUrl=" + encodeURIComponent($window.location.href, "UTF-8");
                    }                    
                }

                $scope.register = function(){
                    //로그인여부 (로컬에서는 패스)                    
                    if(!$scope.loginInfo.isLogin && !LotteCommon.isTestFlag){
                        $window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&targetUrl=" + encodeURIComponent($window.location.href, "UTF-8");
                        return;
                    }                    
                    //check value
                    if(check_value($scope.oInfo.name, "oname", "성명을") || 
                       check_value($scope.oInfo.id, "oid", "롯데패밀리ID를") || 
                       check_value($scope.oInfo.tel2, "otel2", "연락처를") || 
                       check_value($scope.oInfo.email, "omail", "E-mail을") ||
                       ($scope.emailview && check_value($scope.oInfo.email2, "oemail2", "E-mail을")) ||
                       check_value($scope.oInfo.a[0], "a0", "품목을")||  
                       check_value($scope.oInfo.b[0], "b0", "가격대를")||  
                       check_value($scope.oInfo.c[0], "c0", "수량을") ||
                       check_box()){                       
                    }else{
                        //make form JSON.stringify
                        var postParams = {
                            orderId : $scope.oInfo.id,
                            orderName : $scope.oInfo.name,
                            selItem: $scope.oInfo.a ,
                            selPrice:$scope.oInfo.b,
                            selQty:$scope.oInfo.c,
                            mbr_no:$scope.loginInfo.mbrNo,
                            orderEmail:$scope.oInfo.email + "@" + $scope.oInfo.email2,
                            orderPhone : $scope.oInfo.tel1 +""+ $scope.oInfo.tel2,
                            orderMobile : $scope.oInfo.tel1 +""+ $scope.oInfo.tel2,
                            writeMemo : $scope.memo,
                            site_no : 1                        
                        }; 
                        /*
                        관심품목(String Array)	selItem	[갈비/정육/사골, 굴비/옥돔/생선, 사과/배/과일세트, 곶감/건과/버섯/수삼/견과세트, 홍삼/인삼]
                        가격대(String Array)	selPrice	[1~5만원대, 5~10만원대, 11~15만원대, 16~20만원대, 21~25만원대]
                        수량(String Array)	selQty	[1~5개, 6~10개, 11~15개, 16~20개, 21~25개]
                        회원번호(String)	mbr_no	123123
                        이메일(String)	orderEmail	abc@lotte.com
                        연락처(String)	orderPhone	010-1234-1234
                        핸드폰(String)	orderMobile	010-1234-1234
                        메모(String)	writeMemo	메모메모
                        사이트번호(String)	site_no	1
                        */  
                        jQuery.ajaxSettings.traditional = true;                        
                        $.ajax({
                            method: 'POST',
                            url: $scope.submit_url,
                            data: $.param(postParams),
                            dataType:"json"
                        })
                        .success(function(data) {
                            console.log("data:", data);
                            if(data.result != "reg_fail"){
                               alert("대량 주문 상담 신청이 접수되었습니다.\n확인 후 신청해주신 연락처로 유선 연락 드리겠습니다.\n감사합니다."); 
                            }
                        })
                        .error(function(ex) {
                            console.log("ex:", ex);
                            if(ex.responseText == "reg_success"){
                                alert("대량 주문 상담 신청이 접수되었습니다.\n확인 후 신청해주신 연락처로 유선 연락 드리겠습니다.\n감사합니다.");     
                            }
                            
                        });
                                                
                    }
                }
            }
        };
    }]);

})(window, window.angular);
