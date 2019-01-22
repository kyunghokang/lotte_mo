//===== 배송지 주소 관련 추가 스크립트
// 배송지 팝업 닫기
function searchOrdDeliveryListClose(){
    // $(".lpoint_btn3").show();
    $("#ordSearchDeliPop").hide();
    $("#ordSearchDeliPop").find("iframe").remove();
    scrollYN('Y','DELI');
    $("#ordSearchDeliInfo input").trigger("change");
    $("#change_mode").trigger("click");
    //console.log("top", $("#addressInfoCtrlContainer").offset().top - 150);
    $(document).scrollTop($("#addressInfoCtrlContainer").offset().top - 150);
}

// 스크롤 방지
function scrollYN(scroll,type){
     if(scroll == 'N'){
        // 부모창 스크롤 방지
        $('html, body').css({'overflow': 'hidden'});
        if(type == 'DELI'){
            $('body').on('scroll touchmove mousewheel', function(event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            });
        }
        //이력추가
        if(browserChk() != 'Safari'){
            history.pushState('history1', '');
        }
     }else{
        // 부모창 스크롤 풀기
        $('html, body').css({'overflow': 'visible'});
        if(type == 'DELI'){
            $('body').off('scroll touchmove mousewheel');
        }
        if(browserChk() != 'Safari'){
            if(history.state != null){
                history.back();
            }
        }
     }
}

// 배송지 팝업
function searchOrdDeliveryListPop(deli_cnt,single){
    var tag = '<iframe id="deliIframe" src=""></iframe>'
    var dlvp_sn = $("input[name=indlvpsn]").val();
    var crspk_map_url = "/popup/ord_search_delivery_list.do?deli_cnt="+deli_cnt+"&selectedDlvpSn="+dlvp_sn+"&single="+single;
    //crspk_map_url = "/mylotte/find_address.html";//test
    // iframe 보이기 및 url, parameter 셋팅
    $("#ordSearchDeliPop").show();
    $("#ordSearchDeliPop").html(tag);
    $("#ordSearchDeliPop").find("iframe").attr("src", crspk_map_url);
    scrollYN('N','DELI');
}

// 브라우저 체크
function browserChk(){
    var browser = "";
    var ua = window.navigator.userAgent;
    if(ua.indexOf('Safari') > 0) {
        if(ua.indexOf('Chrome') > 0) browser = "Chrome";
        else browser = "Safari";
    }
    return browser;
}
function sendTclick(tclick){
    
}

(function(window, angular, undefined) {
	'use strict';

	var addressInfoModule = angular.module('addressInfo', [
        'lotteComm'        
    ]);
    
	addressInfoModule.controller('AddressInfoCtrl', ["$scope", "LotteCommon", function ($scope, LotteCommon) {
		
	}]);

	addressInfoModule.directive('addressInfo', ['LotteCommon','$window', '$timeout', '$parse', '$http', function (LotteCommon,$window, $timeout, $parse, $http) {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/address_info.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.has_address = false; //기본 주소지의 존재 여부
                $scope.pageGubun = false; //선물함 상세페이지
                if($scope.subTitle == '선물 확인'){
                    $scope.pageGubun = true; //선물확인 페이지
                }
                var setGiftData = function(){
                    if($scope.giftData == undefined){
                        setTimeout(function(){                                        
                            setGiftData();
                        }, 500);
                        console.log("load again");
                    }else{
                        var selectAddr = {};
                        if($scope.loginInfo.isLogin){
                            if($scope.giftData.user_addr_info != undefined && $scope.giftData.user_addr_info.default_addr.addr1 != undefined){
                                selectAddr = $scope.giftData.user_addr_info.default_addr;
                                $scope.has_address = true;
                            }                            
                            if($scope.giftData.ord_addr_info != undefined && $scope.giftData.ord_addr_info.addr1 != undefined){
                                selectAddr = $scope.giftData.ord_addr_info;
                                $scope.has_address = true;
                            }                                                                            
                        }else{
                            if($scope.giftData.ord_addr_info != undefined && $scope.giftData.ord_addr_info.addr1 != undefined){
                                selectAddr = $scope.giftData.ord_addr_info;
                                $scope.has_address = true;
                            }                                                                            
                        }
                        $scope.user_msg = "배송메시지";
                        if($scope.has_address){ //주소가 있으면                          
                            var telAr = selectAddr.addr_tel.split("-");
                            //기본 주소 세팅
                            $scope.oinfo = {
                                indlvpsn : selectAddr.dlvp_sn,
                                inpbasedlvpyn : '',
                                inprmitnm : selectAddr.r_name,
                                inpdlvpnm : selectAddr.addr_name,
                                inpzip1: selectAddr.addr_post.substr(0,3),
                                inpzip2: selectAddr.addr_post.substr(3,3),
                                inpaddr1: selectAddr.addr1,
                                inpaddr2: selectAddr.addr2,
                                stnm_inp_zip1: '',
                                stnm_inp_zip2: '',
                                stnm_inp_addr1 :'',
                                stnm_inp_addr2:'',                                
                                incellsctno: telAr[0],
                                incelltxnono: telAr[1],
                                incellendno: telAr[2]
                            }
                            //도로명 주소가 있는 경우 추가 세팅
                            if(selectAddr.stnm_addr_post != null && selectAddr.stnm_addr_post != ''){
                                $scope.oinfo.stnm_inp_zip1 = selectAddr.stnm_addr_post.substr(0,3);
                                $scope.oinfo.stnm_inp_zip2 = selectAddr.stnm_addr_post.substr(3,3);
                                $scope.oinfo.stnm_inp_addr1 = selectAddr.stnm_addr1;
                                $scope.oinfo.stnm_inp_addr2 = selectAddr.stnm_addr2;
                            }
                        }else{
                            $scope.oinfo = {
                                indlvpsn : '',
                                inpbasedlvpyn : '',
                                inprmitnm : '',
                                inpdlvpnm : '',
                                inpzip1: '',
                                inpzip2: '',
                                inpaddr1: '',
                                inpaddr2: '',
                                stnm_inp_zip1: '',
                                stnm_inp_zip2: '',
                                stnm_inp_addr1 :'',
                                stnm_inp_addr2:'',
                                incellsctno: '',
                                incelltxnono: '',
                                incellendno: ''
                            }                                              
                        }                         
                    }                   
                }
                
                setTimeout(function(){                                        
                    setGiftData();
                }, 5);
                //주소 찾기 정보를 최종으로 리턴하는 함수
                $scope.getlastAddress = function(){                    
                    var result = {};
                    if($scope.oinfo.inpaddr1 == '' && $scope.oinfo.stnm_inp_addr1 == ''){//입력한 주소가 없으면 
                        alert("주소찾기를 완료해주세요.");                        
                    }else{ //주소가 있으면 
                        var msgData = $("#message").val();
                        if($scope.writeMessage){
                            msgData = $("#message2").val();
                            if(msgData.length < 1){
                                alert("배송메시지를 입력해주세요."); 
                                $("#message2").focus();
                                return result;
                            }
                        }
                        //데이타 구성 
                        result = {
                          "idx" : 0,
                          "is_default" : $scope.oinfo.inpbasedlvpyn,
                          "dlvp_sn" : $scope.oinfo.indlvpsn,
                          "r_name" : $scope.oinfo.inprmitnm,
                          "addr_name" : $scope.oinfo.inpdlvpnm,
                          "addr_post" : $scope.oinfo.inpzip1 +""+$scope.oinfo.inpzip2,
                          "addr1" : $scope.oinfo.inpaddr1,
                          "addr2" : $scope.oinfo.inpaddr2,
                          "addr_tel" :$scope.oinfo.incellsctno +"-"+ $scope.oinfo.incelltxnono +"-"+ $scope.oinfo.incellendno,
                          "message" : msgData,
                          "stnm_addr_post" : $scope.oinfo.stnm_inp_zip1 +""+$scope.oinfo.stnm_inp_zip2,
                          "stnm_addr1" : $scope.oinfo.stnm_inp_addr1,
                          "stnm_addr2" : $scope.oinfo.stnm_inp_addr2
                        }
                    }
                    return result;
                }                
                $scope.writeMessage = false;
                $scope.messageChange = function(){
                    console.log("in", $("#message").val());
                    if($("#message").val() == ''){
                        $scope.writeMessage = true;
                    }                    
                }
                //외부에서 세팅하기 위해 호출
                $scope.myAddrChange = function(flag){
                    if(flag){
                        if($scope.oinfo.inpaddr1 != '' || $scope.oinfo.stnm_inp_addr1 != ''){
                            $scope.has_address = true;
                        }
                    }else{
                        $scope.has_address = false;    
                    }                    
                }
                //입력필드 검사
                $scope.checkField = function(message, fieldID){
                    var str = $(fieldID).val();
                    if(str == ""){
                        alert(message + " 입력해주세요.");
                        $(fieldID).focus();
                        return true;
                    }
                    return false;
                }
            }
        };
        
	}]);

})(window, window.angular);