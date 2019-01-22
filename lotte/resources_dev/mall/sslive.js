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
        
    app.controller('ssliveCtrl', ['$scope', 'LotteCommon','$http','commInitData', function($scope, LotteCommon,$http,commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "생생#"; //서브헤더 타이틀
        $scope.isShowThisSns = true;
        $scope.remainTime = 15; 
        $scope.loading = false;
        $scope.previewDate = commInitData.query['preview'];
        $scope.goods_info = {
            price : 0
        }
        
        //IOS 앱일때 액션바 제거
        /*
        if($scope.appObj.isApp && $scope.appObj.isIOS){
            console.log("call app interface");
            location.href = "lottebridge://lotteapps/hide" ;
        }*/
        $scope.previewstr = "";
        if($scope.previewDate != undefined){
            $scope.previewstr = "preview=" + $scope.previewDate;
        }                    
        //상품정보 로드
        $http.get(LotteCommon.sslive_good +"?"+ $scope.previewstr) 
            .success(function(data) {
                //console.log(data);
                $scope.goods_info = data.sslive;
                $scope.loadTalk(null);
                setTimeout(function(){
                    vod_useScroll = false; //스크롤시 자동재생 못하게 설정
                    autoVideoPlay('autoVideo', '#autoVideo');
                    
                    //풋터영역 확보 - 차후 제거
                    //$("#footer").after("<div style='height:auto;padding-bottom:50px;box-sizing:border-box;clear:both'></div>");
                }, 1500);            
            
                //1초 마다 갱신 후 15초에 한번씩 생생톡 로드 
                setInterval(function(){
                    if($scope.remainTime == 1){
                        $scope.loadTalk(null);
                    }
                    if(!$scope.loading){
                        $scope.remainTime -= 1;    
                        $("#timebox").text($scope.remainTime);
                    }                                        
                }, 1000);
        });
        //생생톡 로드 공통함수 
        var last_bbc_no = "0";
        $scope.loadTalk = function(){
            $scope.loading = true;
            $http.get(LotteCommon.sslive_talk, {params : {
                        start_dtime : $scope.goods_info.start_dtime,//$scope.loginInfo.loginId,
                        spdpNo : $scope.goods_info.spdp_no,
                        bbcNo : last_bbc_no 
                    }}) 
                .success(function(data) {
                    if(last_bbc_no == 0){
                        $scope.talklist = data.result.items;
                        if(data.result.items.length > 0){
                            last_bbc_no = $scope.talklist[$scope.talklist.length - 1].bbcNo;
                        }
                    }else{
                        if(data.result.items.length > 0){ //추가 목록이 있으면
                            $scope.talklist = $scope.talklist.concat(data.result.items);
                            last_bbc_no = $scope.talklist[$scope.talklist.length - 1].bbcNo;
                        }
                    }                    
                    setTimeout(function(){
                        $scope.remainTime = 15;
                        $("#timebox").text($scope.remainTime);                
                        var ms = $(".talkbox > ul").height();
                        $(".talkbox").scrollTop(ms);                        
                        $scope.loading = false;
                    }, 100);
                    
            });            
        }
        //생생톡 리로드
        $scope.reloadTalk = function(){
            $scope.loadTalk(null);
        }

        //생생톡 전송 
        $scope.saveTalk = function(){
            var msg = $("#talk").val().trim();
            if(msg.length == 0){
                alert("내용을 입력해주세요."); 
                $("#talk").focus();
            }else{
                //금칙어 체크 
                if($scope.goods_info.word_list != undefined && $scope.goods_info.word_list != null){
                    var word_ar = $scope.goods_info.word_list.items;                
                    for(var i=0; i<word_ar.length; i++){
                        if(msg.indexOf(word_ar[i]) >= 0){
                            alert("고객님께서 입력하신 댓글에\n금칙어(" + word_ar[i] + ")가 포함되어,\n전송하실 수 없습니다.");
                            return;
                        }
                    }                
                }
                if(!$scope.loading){
                    $("#talk").val("");
                    $http({
                        url: LotteCommon.sslive_save + "?spdpNo=" + $scope.goods_info.spdp_no,
                        data: $.param({cont : msg}),
                        method: 'POST',
                        headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
                    }).success(function(data) {
                        $scope.loadTalk();                    
                    });                      
                }
            }   
        }
        $scope.ss_login = function(){
            location.href = LotteCommon.loginUrl + '?'+$scope.baseParam + '&adultChk=N'+"&targetUrl=" + encodeURIComponent(window.location.href, 'UTF-8');
        }
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mall/sslive_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                
                
            }
        };
    });

})(window, window.angular);