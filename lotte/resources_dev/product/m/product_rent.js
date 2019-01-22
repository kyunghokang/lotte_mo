(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter'
    ]);

    app.controller('ProductRentCtrl', ['$scope', 'LotteCommon', 'LotteCookie','$http','LotteForm','LotteStorage', function($scope, LotteCommon, LotteCookie, $http, LotteForm,LotteStorage) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "상담신청하기"; //서브헤더 타이틀
        
        //사용자 이름과 전화번호를 조회해 온다.
        $http.get(LotteCommon.rentalCustomerUrl, {params:{'entr_no' : $("input[name='entr_no']").val()}})
        .success(function(data) {
            //국번이 select 에 없는 경우
            var phnum = '';
            if(data.result.cell_sct_no == '010' ||
               data.result.cell_sct_no == '011' ||
               data.result.cell_sct_no == '016' ||
               data.result.cell_sct_no == '017' ||
               data.result.cell_sct_no == '018' ||
               data.result.cell_sct_no == '019' ||
               data.result.cell_sct_no == '070' ||
               data.result.cell_sct_no == '0502' ||
               data.result.cell_sct_no == '0505'
              ){
            }else{
                phnum = data.result.cell_sct_no;
                data.result.cell_sct_no = "직접입력";
                setTimeout(function(){
                    $(".s_box02").hide();
                    $(".ph1").show();
                }, 300);
            }
            
            $scope.rentInfo = {
                "goods_no" : $("input[name='goods_no']").val(),
                "pImg" : $("input[name='pImg']").val(),
                "pTitle" :  $("input[name='pTitle']").val(),
                "pPrice" :  $("input[name='pPrice']").val(),
                "pName" : data.result.mbr_nm,
                "phone1" : data.result.cell_sct_no,
                "phone2" : data.result.cell_txno_no,
                "phone3" : data.result.cell_end_no,
                "ph1" : phnum,
                "entr_nm" : data.result.entr_nm,
                "goods_choc_desc" : $("input[name='goods_choc_desc']").val()
            }              
        })
        .error(function(ex) {
            console.log("사용자 정보 조회 에러:", ex);
        });        
        
        //$scope.agree = false;
        
        $scope.sendForm = function(){
            //상담신청 처리 
            LotteForm.FormSubmitForAjax(LotteCommon.rentalSendUrl, {
                       "entr_no" : $("input[name='entr_no']").val(),
                        "goods_no" : $("input[name='goods_no']").val(),
                        "item_no" : $("input[name='item_no']").val(),
                        "ord_qty" : $("input[name='ord_qty']").val(),
                        "appl_nm" : $scope.rentInfo.pName,
                        "appl_phon" : $scope.rentInfo.phoneNumber,
                        "goods_choc_desc" : $("input[name='goods_choc_desc']").val(),
                        "info_sup_agr_ip_addr":$("input[name='info_sup_agr_ip_addr']").val() 
            })
            .success(function(data) {
                if(data.result.response_code == null){
                    //20160927 수정 
                    alert("상담신청이 완료되었습니다.\n전문 상담원이 2~3일내에 전화를 드리도록 하겠습니다.");
                    var lastItemLink =  LotteStorage.getSessionStorage("lastItemCateLink");
                    if(lastItemLink != undefined && lastItemLink != ""){
                        location.href = lastItemLink;  //->  해당 카테고리로 이동   
                    }else{
                        $scope.gotoDetail(); //상세로 이동  
                    }
                    
                }else{
                    //error
                }
            })
            .error(function(ex) {
                console.log("상담신청 에러:", ex);
            });
        }
    }]);

    app.directive('lotteContainer',  function() {
        return {
            templateUrl : '/lotte/resources_dev/product/m/product_rent_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                
                //전화번호 국번 변경 
                $scope.phoneChange = function(){
                    if($scope.rentInfo.phone1 == "직접입력"){
                        $(".s_box02").hide();
                        $(".ph1").show();
                    }else{
                        $(".s_box02").show();
                        $(".ph1").hide();
                    }
                }
                
                //상담신청
                $scope.regist_ok = function(){
                    //로그인체크
                    //console.log("login:", $scope.rentInfo.ph1, $scope.rentInfo.phone1);
                    
                    if($scope.rentInfo.phone1 == '직접입력'){
                        $scope.rentInfo.phoneNumber = $scope.rentInfo.ph1 + "" + $scope.rentInfo.phone2 +""+ $scope.rentInfo.phone3;
                    }else{
                        $scope.rentInfo.phoneNumber = $scope.rentInfo.phone1 + "" + $scope.rentInfo.phone2 +""+ $scope.rentInfo.phone3;
                    }
                    
                    if (false) {  /*로그인 안한 경우 : !$scope.loginInfo.isLogin*/ 
                        //로그인 페이지 이동시는 폼서브밋
                        var frm_send = el.find("#frm_send");
                            //goUrl = LotteCommon.loginUrl + "?"+$scope.baseParam+"&fromPg="+LOTTE_CONSTANTS['ONENONE_BUY_LOGIN']+"&smp_buy_yn="+(isSmp?'Y':'N')+"&minority_yn="+$scope.BasicData.minority_limit_yn+"&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
                    }else{
                        //항목체크 
                        if($scope.rentInfo.pName == ''){
                            alert("이름을 입력해주세요.");
                            return;
                        }else if($scope.rentInfo.phone1 == '' || $scope.rentInfo.phone2 == '' || $scope.rentInfo.phone3 == '' || ($scope.rentInfo.ph1 == '' && $scope.rentInfo.phone1 == '직접입력')){
                            alert("연락처를 입력해주세요.");
                            return;
                        }else if(!$scope.agree){
                            alert("상품 안내 서비스를 위해 개인정보 제공 동의해주세요.");
                            return;
                        }
                        $scope.sendForm();
                    }                    
                }
                
                //상세페이지로 이동
                $scope.gotoDetail = function(){
                    location.href = "/product/m/product_view.do?" + $scope.baseParam + "&goods_no=" + $scope.rentInfo.goods_no;
                }
                
            }
        };
    });

})(window, window.angular);