(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.filter('htmlRemove', [function() {
        return function(text) {
            return text.substr(0,4)+"."+text.substr(8,2)+"."+text.substr(11,2);
        }
    }]);

    app.controller('couponzoneCtrl', ['$scope', '$window', '$http', '$timeout', 'LotteCommon', 'commInitData', 'LotteStorage', '$location', 'LotteUtil', 'LotteGA', function($scope, $window, $http, $timeout, LotteCommon, commInitData, LotteStorage, $location, LotteUtil, LotteGA) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "쿠폰존"; // 서브헤더 타이틀
        $scope.gaCtgName = "MO_쿠폰존";
        $scope.screenID = "couponzone"; // 스크린 아이디 
        $scope.pageLoading = true;
        $scope.schema = commInitData.query['schema']!= null?commInitData.query['schema']:"";
        $scope.currTime;
        $scope.currMonth;
        $scope.todayDate = new Date();
        $scope.data_param = "";
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.depositView = false; // 보관금 공지사항 뷰
        $scope.delCloverListViewFlag = false; //소멸예정클로버 리스트 뷰
        $scope.isShowLoadingImage = true; // 로딩이미지 출력 여부
        $scope.couponZoneTab = false;
        $scope.tabControl = 'first';
        //$scope.gradView = true;

        // TEST Date
        if (commInitData.query["toDate"]) {
            var todayDate = commInitData.query["toDate"]; // 년월일
            var todayTime = new Date(
                todayDate.substring(0, 4), // 년
                parseInt(todayDate.substring(4, 6)) - 1, // 월
                todayDate.substring(6, 8), // 일
                todayDate.substring(8, 10), // 시간
                todayDate.substring(10, 12), // 분
                todayDate.substring(12, 14)); // 초
                $scope.data_param = "toDate=" +todayDate; //20180125
                $scope.todayDate = todayTime;
        }
        
        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
        	}
        	$scope.screenData = {
        		page: 0,
        		pageSize: 20,
        		pageEnd: false
        	}
        })();

        //안내팝업 닫기    
        $scope.pop_close = function(){
            $scope.gpop_type = 0;    
        }   

        $scope.pop_open = function(id, item){
            $scope.gpop_type = id; 
            if(item){
                $scope.gpop_item = item;
            }
        }

        function getAddZero(num) { 
            return num < 10 ? "0" + num : num + "";
        } 

        var todayDateTime2 = new Date();
        var todayDate2 = todayDateTime2.getFullYear() + getAddZero(todayDateTime2.getMonth() + 1) + getAddZero(todayDateTime2.getDate()) + getAddZero(todayDateTime2.getHours());

        var testDate = commInitData.query["testDate"] || "";
        if(testDate){
            todayDate2 = testDate;
        }
        if(parseInt(todayDate2, 10) >= parseInt('2018081710', 10)){
            $scope.validDate = true;
        }

        var newCouponzoneData = LotteCommon.newCouponzoneData + "?"+$scope.data_param;
        var newCouponzoneTop = '/main_json_contents.do?dispNo=5570119&age=20&dispNo=5570119&gender=F';
        
        $http.get(newCouponzoneTop)
        .success(function(data) {
            $scope.linkInfo = data.moduleData[0].linkInfo;
        });
        
        $scope.cpLinks = function(num){
            switch(num){
                case '1':
                    if($scope.linkInfo){
                        $window.location.href = $scope.linkInfo.attendUrl + '?' + $scope.baseParam;
                    }else{
                        $window.location.href = LotteCommon.directAttendUrl + '?' + $scope.baseParam;
                    }
                    break;
                /*case '2':
                    if($scope.linkInfo){
                        $window.location.href = $scope.linkInfo.benefitUrl + '?' + $scope.baseParam;
                    }else{
                        $window.location.href = LotteCommon.newCouponzoneUrl + '?' + $scope.baseParam;
                    }
                    break;*/
                case '3':
                    if($scope.linkInfo){
                        $window.location.href = $scope.linkInfo.rewordUrl + '?' + $scope.baseParam;
                    }else{
                        $window.location.href = LotteCommon.eventSaunUrl + '?' + $scope.baseParam;
                    }
                    break;
                case '4':
                    if($scope.linkInfo){
                        $window.location.href = $scope.linkInfo.eventUrl + '?' + $scope.baseParam;
                    }else{
                        $window.location.href = LotteCommon.eventGumeUrl + '?' + $scope.baseParam;
                    }
                    break;
            }
        }

        $scope.cpLinks2 = function(){
            LotteGA.evtTag($scope.gaCtgName, '탭02_멤버십혜택배너');
            $window.location.href = LotteCommon.gdBenefitUrl + '?' + $scope.baseParam;
        }

        /* 쿠폰 초기값 */
        $scope.cpstartCount = [];
        $scope.couponListNum = 0;
        
        // Data Load
        $http.get(newCouponzoneData)
        .success(function(data) {
            // console.log(data.goodBenefit.banner.banner.items);

            if($scope.newVer && data.goodBenefit.attributes){
                //데이타 갯수 쿠폰존 15개 까지, 배너 8개까지             
                if(data.goodBenefit.attributes.banner_top.items.length > 8){
                    data.goodBenefit.attributes.banner_top.items = data.goodBenefit.attributes.banner_top.items.slice(0, 8);
                }
                if(data.goodBenefit.attributes.banner_bottom.items.length > 8){
                    data.goodBenefit.attributes.banner_bottom.items = data.goodBenefit.attributes.banner_bottom.items.slice(0, 8);
                }
                if(data.goodBenefit.attributes.couponList.items.length > 15){
                    data.goodBenefit.attributes.couponList.items = data.goodBenefit.attributes.couponList.items.slice(0, 15);
                }
            }
            // totalData            
            $scope.goodBenefit = data.goodBenefit;
            // 쿠폰
            $scope.couponData = data.goodBenefit.couponInfo;
            // 받을 수 있는 쿠폰 수
            $scope.couponYnCnt = data.goodBenefit.attributes.couponList.coupon_yn_cnt;

            $scope.couponCont = $scope.goodBenefit.attributes.couponList.items;

            for (var b = 0; b < $scope.couponCont.length; b++) {
                for (var n = 0; n < 5; n++) {
                    if($scope.couponCont[b].cpn_list.items[n]){
                        $scope.couponListNum += Number($scope.couponCont[b].cpn_list.items[n].duplicate_cnt);
                    }
                }
                $scope.cpstartCount.push($scope.couponListNum);
                $scope.couponListNum = 0;
            }

            // 배너
            if (data.goodBenefit.banner.banner != null) {
                $scope.bannerData = data.goodBenefit.banner.banner.items;
            }

            $scope.cpbestlink = function(url){
                $window.location.href = url + (url.indexOf('?') != -1 ? '&' : '?') + $scope.baseParam;
            }

            $scope.cpGA = function(num, name, name2){
                LotteGA.evtTag($scope.gaCtgName, '탭0'+ num +'_' + name, name2);
            }
            
            //webSchema
            $scope.webSchema = data.goodBenefit.webSchema;
            $scope.gradeYear = "2015년";
            $scope.gradeMonth = "9월";
            $scope.gradehalf = "하반기";
            
            $scope.gradeNm;
            $scope.nextGradeNm;

            switch (data.goodBenefit.mbrGradeCd) {
                case '10':
                    $scope.gradeNm = "플래티넘+";
                    $scope.nextGradeNm = "플래티넘+";
                    break;
                case '20':
                    $scope.gradeNm = "플래티넘";
                    $scope.nextGradeNm = "플래티넘+";
                    break;
                case '30':
                    $scope.gradeNm = "플래티넘#";
                    $scope.nextGradeNm = "플래티넘";
                    break;
                case '40':
                    $scope.gradeNm = "골드";
                    $scope.nextGradeNm = "플래티넘#";
                    break;
                case '50':
                    $scope.gradeNm = "실버";
                    $scope.nextGradeNm = "골드";
                    break;
                case '70':
                    $scope.gradeNm = "프렌드";
                    $scope.nextGradeNm = "실버";
                    break;
                case '80':
                    $scope.gradeNm = "웰컴";
                    $scope.nextGradeNm = "실버";
                    break;
            }

            if ($scope.mbrGradeCd == '10') {
                $scope.couponDownYn = false;

                if (Number($scope.day) == 1 && Number($scope.hour) < 9) { // 매월 첫째날 오전 9시 이전엔 쿠폰받기 불가   
                    $scope.couponDownYn = true;
                }
            }

            $scope.pageLoading = false;
        })
        .error(function (data, status, headers, config) {
            //console.log('Error Data : ', status, headers, config);
            $scope.pageLoading = false;
        });
        
        // goLogin
        $scope.goLogin = function () {
            $window.location.href = LotteCommon.loginUrl + "?" + $scope.baseParam + "&targetUrl=" + encodeURIComponent($window.location.href, "UTF-8");
        };

        // 쿠폰 발급 완료 후 스크롤 위치 고정
        var lotteCouponLoc = LotteStorage.getSessionStorage('lotteCouponLoc');
        var lotteCouponScrollY = LotteStorage.getSessionStorage('lotteCouponScrollY');

        angular.element($window).on("load", function(e) {
            if (lotteCouponLoc == window.location.href) {
                $timeout(function () {
                    angular.element($window).scrollTop(lotteCouponScrollY);
                }, 1000);
            }
        });
        
        angular.element($window).on("unload", function(e) {
	        if($scope.leavePageStroage){
	            LotteStorage.setSessionStorage('lotteCouponLoc', $location.absUrl());
	            LotteStorage.setSessionStorage('lotteCouponScrollY', angular.element($window).scrollTop());
	        }
        });

        //쿠폰존 쿠폰다운로드
        $scope.getCoupon = function(key){

            if(!$scope.loginInfo.isLogin){
                $scope.goLogin();
            }else{
                $scope.sendTclick('m_DC_MemCouponZone_Clk_Btn_2');
                $http.get("/json/coupon/regCoupon2.json?cpn_issu_no=" + key + "&"+ $scope.data_param)
                .success(function(data) {
                    if(data.result == "0"){
                        location.reload();
                    }else{
                        if(data.message){
                            alert(data.message);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log(status);
                });                            
            }
        }

        $scope.noti_msg = function(type){
            if(type == 1){
                alert("이미 쿠폰을 다운받으셨습니다.");
            }else if(type == 2){
                alert("쿠폰 발급 대상이 아닙니다.");
            }
        }

        //쿠폰존 텝제어 
        $scope.changeTab = function(str){
           $scope.tabControl = str;

           if(str == 'first'){
                $scope.couponZoneTab = false;
                $window.location.href = LotteCommon.newCouponzoneUrl + '?' + $scope.baseParam;
                
           }else{
                $scope.couponZoneTab = true;
                $window.location.href = LotteCommon.myPointUrl + '?point_div=coupon&' + $scope.baseParam;
           }
        }

        angular.element($window).on('load',function(){
            $timeout(function(){
                if($scope.loginInfo.isLogin){
                    $http.get(LotteCommon.pointInfoData +"?" + $scope.baseParam + "&point_div=coupon")
                    .success(function(data) {
                        $scope.pointTabNum = data.max.couponList_tot_cnt;
                    })
                }
            }, 100);
        })
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/sub/couponzone_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

    app.filter('dayinfo', [function () {
        return function (str) {            
            return str.substr(0, 10);
        }
    }]);

})(window, window.angular);