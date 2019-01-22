(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('dearpetBrdBestCtrl', ['$http', '$scope', 'LotteCommon','$window','LotteStorage', function($http, $scope, LotteCommon,$window,LotteStorage) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "브랜드 BEST"; // 서브헤더 타이틀
        $scope.screenID = "브랜드 BEST"; // 스크린 아이디 
        $scope.dearpet_scroll = 0;
        $scope.dp_data = null;
    
        $scope.gotoPrdDetail = function(goods_no, index){
            if(index < 10) index = "0" + index;
            var tClickCode = "brand_best_" + index;
            location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goods_no +"&tclick="+tClickCode;
        }
        angular.element($window).on("unload", function(e) {
            var sess = {
                scrollY : angular.element($window).scrollTop(),
                data : $scope.dp_data
            };
            LotteStorage.setSessionStorage('BrandBestData', sess, 'json');
        });
        
        var sectiondata = JSON.parse(LotteStorage.getSessionStorage('BrandBestData'));        
        if(sectiondata && sectiondata.data){
            $scope.dp_data = sectiondata.data;
            angular.element($window).scrollTop(sectiondata.scrollY);
        }else{
            $http({
                method : "get",
                url : LotteCommon.dearpet_brdbest //"/json/mall/dearpet_brd_best_list.json" LotteCommon.dearpet_brdbest
            }).
            success(function(data){
                $scope.dp_data = data.brd_best.items;
            });             
        }
    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/mall/pet/dearpet_brd_best_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                
            }
        };
    });

})(window, window.angular);