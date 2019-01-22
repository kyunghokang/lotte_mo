(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', ['lotteComm']);

	app.controller('StyleRecomCtrl', ['$scope', function($scope){
		$scope.showWrap = true;
		$scope.contVisible = true;
	}]);
	
	/**
	 * 스타일 추천 디렉티브
	 */
	app.directive("lotteContainer", ["StyleRecom", function(StyleRecom){
		return {
			link : function($scope, el, attrs) {
				
				/**
				 * 이미지 경로에서 상품번호 추출
				 */
				function getGoodsNo(url){
					var goods_no = "";
					try{
						var arr = url.split("/");
						var img = arr[arr.length - 1];
						goods_no = img.substr(0, img.indexOf("_"));
						if(isNaN(goods_no)){ goods_no = ""; }
					}catch(e){}
					
					return goods_no;
				};
				
				/**
				 * 스타일 추천 디텍트
				 * @param imgUrl {String} 이미지 URL
				 * @param cb {Function} 콜백 함수
				 */
				function styleRecomDetectAngular(imgUrl, cb){
					imgUrl = (imgUrl + "").replace("_280", "_550");// 550 사이즈 이미지로 변경
					
					var obj = {
						"image"			: imgUrl,
						"goodsNo"		: getGoodsNo(imgUrl),
						"sendGoodsNo"	: false,
						"screen"		: "detail",
						"sortCate"		: ""
					}
					var rtn = StyleRecom.detect(obj, function(list){
						if(typeof(cb) == "function"){
							cb(list);
						}else{
							if(list.length > 0){
								styleRecomAppReturn("detect", true, list[0].category);
							}else{
								styleRecomAppReturn("detect", false);
							}
						}
					});
					if(rtn === false){
						if(typeof(cb) == "function"){
							cb([]);
						}else{
							styleRecomAppReturn("detect", false);
						}
					}
				};
				
				
				/**
				 * 스타일 추천 서치
				 */
				function styleRecomSearchAngular(imgUrl, gender, styleCate, prdSex){
					styleRecomDetectAngular(imgUrl, function(list){
						if(list.length > 0){
							// detect success
							var item = list[0];
							var sex = StyleRecom.determineSex(item, prdSex, styleCate, $scope.loginInfo.genSctCd);
							
							var obj = {
		        				"id"		: item.id,
		        				"sex"		: sex,
		        				"cate"		: item.category,
		        				"subcate"	: styleCate,
								"goodsNo"	: getGoodsNo(imgUrl),
								"screen"	: "detail",
								"count"		: 150
		            		};
		            		if(item.sub_category.score > 0.2){
		            			obj.sub_cate = item.sub_category.code;
		            		}
		            		var rtn = StyleRecom.search(obj, function(list){
	            				var arr = [];
	            				angular.forEach(list, function(itm){
	            					arr.push(itm.goodsNo);
	            				});
	            				styleRecomAppReturn("search", arr.join(","));
		            		});
		            		
		            		if(rtn === false){
		            			styleRecomAppReturn("search", "");
		            		}
							
						}else{
							// detect fail
							styleRecomAppReturn("search", "");
						}
					});
				};
				
				
				// replace existing function
				window.styleRecomDetect = styleRecomDetectAngular;
				window.styleRecomSearch = styleRecomSearchAngular;
			}
		};
	}]);

})(window, window.angular);