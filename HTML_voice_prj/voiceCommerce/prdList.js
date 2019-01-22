(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        "lotteComm"
    ]);

    // 보이스커머스 헤더 Controller
    app.controller('VoiceCommerceHeaderCtrl', ['$scope', 'LotteCommon', 'commInitData',
    function($scope, LotteCommon, commInitData) {
        console.log("보이스커머스 헤더 컨트롤러");
    }]);

    // 보이스커머스 헤더
    app.directive("voiceHeader", [function () {
        return {
            templateUrl : "/lotte/resources_dev/talk/voiceCommerce_header.html",
            replace : true,
            controller: 'VoiceCommerceHeaderCtrl',
            link : function($scope, el, attrs) {
                console.log("보이스커머스 헤더");
            }
        }
    }]);

    // 보이스커머스 Side Nav Controller
    app.controller('VoiceCommerceSideNavCtrl', ['$scope', 'LotteCommon', 'commInitData',
    function($scope, LotteCommon, commInitData) {
        console.log("보이스커머스 헤더 컨트롤러");
    }]);

    // 보이스커머스 Side Nav
    app.directive("voiceSideMenu", [function () {
        return {
            templateUrl : "/lotte/resources_dev/talk/voiceCommerce_sidenav.html",
            replace : true,
            controller: 'VoiceCommerceSideNavCtrl',
            link : function($scope, el, attrs) {
                console.log("보이스커머스 햄버거");
            }
        }
    }]);

    // 보이스커머스 컨테이너 Controller
    app.controller('VoiceCommerceCtrl', ['$scope', 'LotteCommon', 'commInitData',
    function($scope, LotteCommon, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.prdList = [];
        $scope.DEV_MODE = commInitData.query.dev_mode == "Y";

        $http.get("/HTML_voice_prj/voiceCommerce/prdList.json").success(function(data){
                $scope.prdList = data;
        });
    }]);

    // 보이스커머스 컨테이너
    app.directive("lotteContainer", ["LotteCommon", "LotteUserService", "LotteStorage", "commInitData", "$http", "$timeout", "$interval",
    function (LotteCommon, LotteUserService, LotteStorage, commInitData, $http, $timeout, $interval) {
        return {
            templateUrl : "/lotte/resources_dev/talk/voiceCommerce_container.html",
            replace : true,
            link : function($scope, el, attrs) {

               /**
                 * 알럿창 애니메이션
                 */
                function animateAlert(){
                    var d = $(".alert_msg");
                    var pos = $(window).height() / 2 - 74;

                    var css = {
                        "bottom"    :  pos,
                        "opacity" : "1"
                    };
                    var opt = {
                        "duration"  : 300,
                        "easing"    : $scope.checkJQueryEasing("easeOutBack"),
                        "complete"  : function(){
                            var css2 ={
                                "bottom" : pos + 50,
                                "opacity" : "0"
                            }
                            var opt2 = {
                              "duration"  : 600,
                                "easing"    : $scope.checkJQueryEasing("easeOutBack"),
                                "complete" : function(){
                                    d.css({
                                        "bottom" : "",
                                    })
                                }
                            }
                            setTimeout(function(){
                                    d.animate(css2, opt2);
                            }, 1000)
                        }
                    };
                    d.animate(css, opt);
                };

                $scope.alertShow = function(){
                	animateAlert();
                }

                /**
                 * 티클릭 전달
                 */
                function tsTclick(tc, affix){
                    var send = true;
                    var tclick = $scope.tClickRenewalBase + "VoiceOrder_Clk_";

                    switch(tc){
                    case 1:
                        tclick += "btn_inputaddress";
                        send = false;
                        break;
                    case 2:
                        tclick += "btn_inputPayment";
                        send = false;
                        break;
                    case 3:
                        tclick += "btn_closeadvancerg";
                        send = false;
                        break;
                    case 4:
                        tclick += "btn_changeaddress";
                        send = false;
                        break;
                    case 5:
                        tclick += "btn_changePayment";
                        send = false;
                        break;
                    case 6:
                        tclick += "btn_StartVorceOrder";
                        break;
                    case 7:
                        tclick += "apply";
                        break;
                    case 8:
                        tclick += "btn_back";
                        break;
                    case 9:
                        tclick += "btn_info";
                        break;
                    case 10:
                        tclick += "btn_setting";
                        break;
                    case 11:
                        tclick += "btn_prevStep";
                        break;
                    case 12:
                        tclick += "btn_category_" + affix;
                        break;
                    case 13:
                        tclick += "btn_product_" + affix;
                        break;
                    case 14:
                        tclick += "btn_mic";
                        break;
                    default:
                        return "";
                        break;
                    }

                    if(send){
                        $scope.sendTclick(tclick);
                    }else{
                        return tclick;
                    }
                }

                /**
                 * 이전 페이지로 이동
                 */
                $scope.goHistoryBack = function(){
                    tsTclick(8);
                    $scope.showExitConfirm = true;
                    $scope.confirm_2016("음성주문 서비스를 종료하시겠습니까?", {"callback" : exitTalkShopping});
                };

                /**
                 * 음성쇼핑 종료
                 */
                function exitTalkShopping(rtn, tc){
                    $scope.showExitConfirm = false;
                };
            }
        }
    }]);
})(window, window.angular);
