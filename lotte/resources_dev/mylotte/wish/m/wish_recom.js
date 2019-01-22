(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteCommFooter'
    ]);
    app.filter('titleToHtml', function() {
		return function(title) {
			if (title == null){return '';}
			var newTitle = "";
			
			newTitle = title.split('<!HS>').join('<STRONG>');
			newTitle = newTitle.split('<!HE>').join('</STRONG>');
			return newTitle;
		}
	});
    app.controller('WishRecomCtrl', ['$scope', 'LotteCommon', '$http', 'commInitData', '$window', function($scope, LotteCommon, $http, commInitData, $window) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "위시리스트 알리미";//서브헤더 타이틀
		$scope.goods_no = commInitData.query['goods_no'];
		$scope.spdpList;
		$scope.relList;
		
		$scope.recoSpdpList = function(){
			//prsn_list
			//var viewSaleBestLink = "http://rb-rec-api-apne1.recobell.io/rec/a101?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+$scope.goods_no;
            var viewSaleBestLink = LotteCommon.rec_plan + "&size=10&iids=" + $scope.goods_no;
			$.ajax({
					type: 'post'
					, async: true
					, url: viewSaleBestLink
					, dataType  : "jsonp"
					, success: function(data) {
						$scope.spdpList = [];
						if(data.results != null){
							$(data.results).each(function(i, val) {
								$scope.spdpList.push(val.itemId);
							});
						}
						$scope.loadData();
					 }
					, error: function(data, status, err) {
						// TODO
						$scope.spdpList = [];
						$scope.loadData();
					}
			});
		}
		
		$scope.loadData = function(){
			
			if($scope.spdpList == null || $scope.relList == null)	return;
			
			var httpConfig = {
				method: "get",
				url: "/json/display/wishlist_recommGoods.json",//LotteCommon.wishRecomBsData,
				params: {
					spdp_no_list : $scope.spdpList.join(","),
					goods_no : $scope.goods_no ,      
					goodsRelList : $scope.relList
				}
			};

			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
				$scope.wishRecomData = data.max;
				$scope.RecomData();
			});
			
		};
		$scope.RecomData = function (){// 데이터 가공
			$scope.wishRecomTopGood = $scope.wishRecomData.wishlist_goods;
			$scope.wishRecomCouponBnr = $scope.wishRecomData.top_ban_list ? $scope.wishRecomData.top_ban_list.items[0] : null;
			$scope.wishlist_recomm_good = $scope.wishRecomData.wishlist_recomm_goods; 
			if($scope.wishlist_recomm_good.items){
				var goodList = $scope.wishlist_recomm_good.items,goodListSize = $scope.wishlist_recomm_good.items.length ;
				if( goodListSize % 2 != 0){
				    $scope.goodListIdx = goodListSize-1;
				}
			}
		}
		
		$scope.logrecom_type_view_jsonp = function (data) {
			var guestArr = new String();
			for (var i = 0; i < data.items.length; i++) {
				if (i > 0) {
					guestArr += ",";
				}

				guestArr += "\'" + data.items[i] + "\'";
			}

			return guestArr;
		};
		
		$scope.goodsRelList = function(){
			//var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/a002?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+$scope.goods_no;
            var viewSaleBestLink = LotteCommon.rec_good + "&size=15&iids=" + $scope.goods_no;
			//console.log("-------------------call");
			$.ajax({
					type: 'post'
					, async: true
					, url: viewSaleBestLink
					, dataType  : "jsonp"
					, success: function(data) {
						$scope.relList = [];
						var v_guestArr = new Array();
						//20161122 레코벨 데이타가 있는 경우에만 조회하도록 수
						if(data.results != null && data.results.length > 0){
							$(data.results).each(function(i, val) {
								v_guestArr.push(val.itemId);
							});
							$scope.relList = $scope.logrecom_type_view_jsonp({"items" : v_guestArr});  
						}
						$scope.loadData();
					}
					, error: function(data, status, err) {
						// TODO
						$scope.relList = [];
						$scope.loadData();
					}
			});
		};
		$scope.recoSpdpList();
		$scope.goodsRelList();
	}]);

    app.directive('lotteContainer', ['LotteCommon', '$window',  function(LotteCommon, $window) {
        return {
            templateUrl : '/lotte/resources_dev/mylotte/wish/m/wish_recom_container.html',
            replace : true,
            link : function($scope, el, attrs) {
				// 상품,배너 랜딩
				$scope.wiRecomGoUrl = function (obj,idx,type){
					//window.location.href =
					var clickCodeParam = "&curDispNo=5570653&curDispNoSctCd=99";// 유입전시코드 고정
					switch (type) {
						case 'wishTopPrd':
							window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + obj.goods_no + clickCodeParam + "&tclick=m_DC_wishpush_clk_Prd_push";
							break;
						case 'prdList':
							window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + obj.goods_no + clickCodeParam + "&tclick=m_DC_wishpush_clk_Prd_idx" + idx + "&_reco=M_wish";
							break;
						case 'planBnr':
							window.location.href = obj.img_link + "&" + $scope.baseParam + "&tclick=m_DC_wishpush_clk_planshop_idx" + idx + "&_reco=M_plan_wish";
							break;
						case 'bnr1' :
							window.location.href = obj.img_link + "&" + $scope.baseParam + "&tclick=m_DC_wishpush_clk_ban1";
							break;
						case 'bnr2' :
							window.location.href = obj.img_link + "&" + $scope.baseParam + "&tclick=m_DC_wishpush_clk_ban2";
							break;
					
					}					
				};
				// 위시리스트 더 보기
				$scope.wishMoreUrl = function () {
					window.location.href = LotteCommon.wishLstUrl +"?"+ $scope.baseParam + "&tclick=m_DC_wishpuch_clk_Btn_1";
				}
				// 쿠폰 다운로드
				$scope.wishRecomRegNewCoupon = function (cpnNo){ 
					if(loginChk()){ 
						var url = "/event/regNewCoupon.do?"; 
						var params = "cpn_issu_no="+cpnNo; 
						$.post(url, params, function(data){ 
						$('#msg').html(data).show(); 
						}); 
						$scope.sendTclick('m_DC_wishpush_clk_ban1');
					}else{ 
						if(confirm('로그인 후 다운로드 받을 수 있습니다.')){ 
							goLogin(); 
						} 
					} 
				} 					

            }
        };
    }]);

})(window, window.angular);
