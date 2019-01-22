(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'angular-carousel'
    ]);

    app.controller('OrdMsgSettingCtrl', ['$window', '$scope', '$http', 'LotteCommon', function($window, $scope, $http, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "주문정보 수신 설정"; // 서브헤더 타이틀

        $scope.mbrNo = ""; // 고객 MBRNO
        $scope.ordSmsYn = ""; // 메세지 수신 타입
        $scope.telNum = ""; // 고객 전화번호

        $scope.site_no = "1"; // 닷컴 site_no

        $http.get(LotteCommon.ordMsgUserSettingData)
            .success(function (data) {
                if (!data || !data.ord_msg_info)
                    return false;

                $scope.mbrNo = data.ord_msg_info.mbrNo;
                $scope.ordSmsYn = data.ord_msg_info.ordSmsYn;
                $scope.telNum = data.ord_msg_info.telNum;
            })
            .error(function () {
                console.log("Data Error : 주문정보 수신 설정 데이터 오류");
            });
    }]);

    app.directive('lotteContainer', ['$http', 'LotteCommon', function($http, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/sub/ord_msg_setting_container.html',
            replace : true,
            link : function($scope, el, attrs) {

                function makeTwoString(str) {
                    str = str + "";

                    if (str.length < 2)
                        str = "0" + str;

                    return str;
                }

                $scope.btnMsgTypeClick = function (type) {
                    if (type == $scope.ordSmsYn)
                        return false;

                    var receiveType = "",
                        receiveTypeMsg = "";

                    if (type == "N")  { // 카카오톡
                        receiveTypeMsg = "카카오톡으";
                        receiveType = "N";
                    } else { // SMS
                        receiveTypeMsg = "문자(SMS)";
                        receiveType = "Y";
                    }

                    if (confirm("주문/배송 메시지를 " + receiveTypeMsg + "로 받으시겠습니까?")) {
                        var params = {
                            mbrNo : $scope.mbrNo,
                            ordSmsYn : receiveType,
                            telNum : $scope.telNum
                        };

                        $http.get(LotteCommon.ordMsgSetting + "?mbrNo=" + params.mbrNo + "&ordSmsYn=" + params.ordSmsYn + "&telNum=" + params.telNum)
                            .success(function (data) {
                                if (data && data.ord_msg_info && data.ord_msg_info.resultCode == "0000") {
                                    var d = new Date(),
                                        dateStr = "";

                                    dateStr = d.getFullYear() + "년 ";
                                    dateStr += makeTwoString(d.getMonth() + 1) + "월 ";
                                    dateStr += makeTwoString(d.getDate()) + "일 ";
                                    dateStr += makeTwoString(d.getHours()) + "시 ";

                                    alert(dateStr + "부터 " + receiveTypeMsg + "로 주문/배송 메시지가 발송됩니다.");
                                    $scope.ordSmsYn = receiveType;
                                } else {
                                    console.log(data);
                                }
                            })
                            .error(function () {
                                console.log("주문정보 수신 설정 세팅 오류");
                            });
                    }
                };

            }
        };
    }]);

})(window, window.angular);