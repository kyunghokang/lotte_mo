(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('UsedInfoCtrl', ['$http', '$scope', 'LotteCommon', function($http, $scope, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "#중고라운지"; // 서브헤더 타이틀
        $scope.screenID = "중고라운지"; // 스크린 아이디 
        
        $scope.tmenu = 0;//0~3 menu
        $scope.menuStr = ["기본이용원칙", "중고라운지 이용방법", "중고판매 금지 품목", "사기거래 예방 Tip"];
        $scope.contentHtml = new Array(4);
        //LotteCommon.used_info, "/json/mall/board_info.json"
        //test 
        $http.get(LotteCommon.used_info).success(function(data){
            for(var i=0; i<data.board_info.items.length; i++){
                $scope.menuStr[i] = data.board_info.items[i].title;
                $scope.contentHtml[i] = data.board_info.items[i].html_conr.html_cont;
            }
        });
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mall/UsedInfo_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            }
        };
    });

})(window, window.angular);