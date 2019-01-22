(function(window, angular, undefined) {
    'use strict';
    var saleBest = angular.module('lotteSaleBestList', ['lotteComm']);
    //뭘 봤지?뭘싸지 기획전
    saleBest.service('SaleBestListSvc',['$http','LotteCommon',function($http, LotteCommon) {
		this.func_SaleBestData = function(goods_no,disp_no,callBackFn) {
			//엘롯데 "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/r002?size=10&format=jsonp&cuid=5dfabb12-dae3-4a56-a123-c097dadbca58&iids=<%=goods_no%>",
			var reqParam = [];
			reqParam.goods_no=goods_no;
			reqParam.disp_no = disp_no;
			reqParam.iids=goods_no;
			//var viewSaleBestLink = LotteCommon.salebestlist_url + "&iids="+goods_no; // "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/r002?size=10&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+goods_no;
            var viewSaleBestLink = LotteCommon.rec_good + "&size=15&iids="+goods_no;
//			var viewSaleBestLink = "/lotte/resources_dev/data/product/m/salebestlist_data.html";
			
			$.ajax({
				type: 'post'
				, async: true
				, url: viewSaleBestLink
				, dataType  : "jsonp"
				, jsonp  : "callback"
				, success: function(data) {
					try{
						var logrecom_type_view_jsonp = function(data) {
							var goodsNoArr = new String();
							for (var i = 0; i < data.items.length; i++) {
									if(i>0){
											goodsNoArr += ",";
									}
									goodsNoArr +="\'"+data.items[i]+"\'";
							}
							return goodsNoArr;
						};
						
						var logrecom_view_result = new Array();
						$(data.results).each(function(i, val) {
								logrecom_view_result.push(val.itemId);
						});
						var v_goodsNoArr = new Array();
		
						v_goodsNoArr=logrecom_type_view_jsonp({"items" : logrecom_view_result});
						var reqDetailParam = [];
						reqDetailParam.goodsRelList=v_goodsNoArr;
						reqDetailParam.disp_no = disp_no;
						$http.get(LotteCommon.productProductSalebestData, {params:reqDetailParam})
						.success(function(data) {
							console.log('Data Success : saleBestData로드 성공');
							callBackFn(data);
						})
						.error(function() {
							 console.log('Data Error : saleBestData로드 실패');
							 callBackFn(null);
						});
					}
					catch(ex){
						console.log('Process Error : saleBestData로드 실패');
						callBackFn(null);
					}
				}
				, error: function(data, status, err) {
					//레코벨 오류 발생시 남들은 뭘 봤지 데이터는 없음.
					console.log('handle Error : saleBestData2로드 실패');
					callBackFn(null);
					/*
					$http.get(LotteCommon.productProductSalebestData, {params:reqParam})
					.success(function(data) {
						console.log('Data Success : saleBestData2로드 성공');
						callBackFn(data);
					})
					.error(function() {
						 console.log('Data Error : saleBestData2로드 실패');
						 callBackFn(null);
					});
					*/
				}
			});
    	};
	}]);
})(window, window.angular);