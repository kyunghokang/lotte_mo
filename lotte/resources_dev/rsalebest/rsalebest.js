(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
		'lotteNgSwipe'        
    ]);

    app.controller('RsaleBestCtrl', ['$scope', 'LotteCommon','$http', 'commInitData', function($scope, LotteCommon, $http, commInitData) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "실시간 맞춤추천"; //서브헤더 타이틀
        $scope.testMode = false; //테스트 코드 
        
        if(commInitData.query['testMode'] == 'Y'){
            $scope.testMode = true;
        }
        
        var logrecom_type_view_jsonp = function (data) {
			var goodsNoArr = new String();
			for (var i = 0; i < data.items.length; i++) {
				if (i > 0) {
					goodsNoArr += ",";
				}
				goodsNoArr += "\'" + data.items[i] + "\'";
			}
			return goodsNoArr;
		};
        
            //뭘 봤지?뭘싸지 기획전
            $scope.func_SaleBestData2 = function() {
                    var goodNums = $scope.lateAction2;
                    var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/a002?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+ goodNums;

                    $.ajax({
                            type: 'post'
                            , async: true
                            , url: viewSaleBestLink
                            , dataType  : "jsonp"
                            , success: function(data) {
                                    var logrecom_view_result = new Array();
                                    var v_goodsNoArr = new Array();
                                    if(data.results != null){
                                        $(data.results).each(function(i, val) {
                                                logrecom_view_result.push(val.itemId);
                                        });
                                        v_goodsNoArr = logrecom_type_view_jsonp({"items" : logrecom_view_result});
                                    }
                                    $scope.reqDetailParam = {};
                                    $scope.reqDetailParam.goodsRelList = v_goodsNoArr;
                                    //console.log("rb-rec : ", v_goodsNoArr);
                                     //$scope.reqDetailParam.disp_no = $scope.BasicData.product.mast_disp_no;
                                    $http.get(LotteCommon.productProductSalebestData, {params:$scope.reqDetailParam})
                                    .success(function(data) {
                                            //console.log('func_saleBestData2',data.max);
                                            $scope.SaleBestData = data.max;
                                    })
                                    .error(function() {
                                             console.log('Data Error : saleBestData로드 실패');
                                    });
                            }
                            , error: function(data, status, err) {
                                    console.log("error");
                                    $scope.reqParam.disp_no = $scope.BasicData.product.mast_disp_no;
                                    $http.get(LotteCommon.productProductSalebestData, {params:$scope.reqParam})
                                    .success(function(data) {
                                            //console.log('func_saleBestData2',data.max);
                                            $scope.SaleBestData = data.max;
                                    })
                                    .error(function() {
                                             console.log('Data Error : saleBestData로드 실패');
                                    });
                            }
                    });
            };                

    }]);

    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/rsalebest/rsalebest_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                
                //localStorage.setItem("viewGoods", "0003118535^135659944|0003118535^53166439|0003118535^216992858|0003118535^198083334|0003118535^212608554|0003118535^218469346|0003118535^204740148|0003118535^199250407|0003118535^212164705|0003118535^62055629|0003118535^62058766|0003118535^218136287|0003118535^218483796|0003118535^218492886|0003118535^214190746|0003118535^215427272|0003118535^192785553|0003118535^218088216|0003118535^220223580|0003118535^220850729|");
                //최근 본 상품 정보 가져와서 3개만 잘라내기 - 마지막에서 자르기 
                var storage_goods = localStorage.getItem("viewGoods");                
                var mem_arr = storage_goods.split("|");
                storage_goods = "";
                mem_arr = mem_arr.reverse();
                var count = 0;
                for (var i = 0; i < mem_arr.length && count < 3; i++){
                    if(mem_arr[i] != ""){
                        storage_goods += mem_arr[i].split("^")[1];
                        if(i < mem_arr.length - 2 && count < 2){
                            storage_goods += ",";
                        }
                        count ++;
                    }
                } 
                
                $scope.lateAction2 =  storage_goods;
                //console.log(storage_goods);
                $scope.func_SaleBestData2() ;//'218469346');
               
            }
        };
    });

})(window, window.angular);