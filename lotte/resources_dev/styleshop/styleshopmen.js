(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteNgSwipe',
        		'lotteSns'
	]);

	app.controller('StyleShopMenCtrl', ['$window', '$location', '$http', '$scope', '$timeout', 'LotteCommon', 'commInitData', 'LotteStorage', 
		function ($window, $location, $http, $scope, $timeout, LotteCommon, commInitData, LotteStorage) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "스타일샵"; // 서브헤더 타이틀
		$scope.screenID = "StyleShop"; // 스크린 아이디
		$scope.isShowThisSns = true; /*공유버튼*/
		$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png";
		$scope.dispNo = commInitData.query['disp_no'];
		$scope.pageLoadFlag = false; // 상품 로드중 Flag
		
		// 스크린 데이터
		($scope.screenDataReset = function () {
			$scope.screenData = {
				page: 1,
				pageSize: 10,
				pageEnd: false,
				prod_list: {
					items: [],
					total_count: 0
				}
			};
		})();

		function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        $scope.keyword = getParameterByName('keyword');
        
		function createPrdLst(data) { // 상품 리스트 생성
			$scope.screenData.prod_list.items = $scope.screenData.prod_list.items.concat(data);
		}

		$scope.loadCont = function () { // 데이터 로드
			if ((!$scope.keyword && !LotteCommon.isTestFlag) || $scope.pageLoadFlag || $scope.screenData.pageEnd) {
				return false;
			}
			
			$scope.pageLoadFlag = true;

			var httpConfig = {
				method: "get",
				url: LotteCommon.styleShopMenData + "?keyword=" + $scope.keyword + "&page=" + $scope.screenData.page + "&rowsPerPage=" + $scope.screenData.pageSize,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				datatype: "json"
			};

			$http(httpConfig)
			.success(function (data) {
				if (!data.styleshop_men_sub_list) {
					return false;
				}

				data = data.styleshop_men_sub_list;

				if ($scope.screenData.page == 1) { // 1페이이지일 경우에만

					if (data.prod_list) { // 상품 데이터 생성
						$scope.screenData.prod_list.items = []; // 초기화
						$scope.screenData.prod_list.total_count = data.total_count;
						createPrdLst(data.prod_list.items);
					}
				} else {
					if (data.prod_list && data.prod_list.items && data.prod_list.items.length > 0) { // 상품 추가 로딩
						createPrdLst(data.prod_list.items); // 상품 추가

						$scope.sendTclick("m_DC_SpeDisp5_Sub_Load" + ($scope.screenData.page - 1));
					} else {
						$scope.screenData.pageEnd = true;
					}
				}

				$scope.screenData.page++; // 페이지 증가
			})
			.finally(function (data) { // Success던 Error던 항상 실행
				$scope.pageLoadFlag = false; // 데이터 로드 Flag 초기화
			});
		};

		

		// sessionStorage - 세션에서 가저올 부분 선언
		var styleShopLoc = LotteStorage.getSessionStorage("styleShopLoc");
		var styleShopDataStr = LotteStorage.getSessionStorage("styleShopData");
		var styleShopScrollY = LotteStorage.getSessionStorage("styleShopScrollY");

		if (styleShopLoc == $window.location.href && styleShopDataStr != null && commInitData.query["localtest"] != "true") { // 현재 URL과 session storage에 저장된 경로가 동일 할 경우
			var styleShopData = JSON.parse(styleShopDataStr);

			if (styleShopData) {
				$scope.screenData = styleShopData.screenData;

				$timeout(function () {
					angular.element($window).scrollTop(styleShopScrollY);
				}, 800);
			}
		} else {
			$scope.loadCont(); // 데이터 로드
		}

		// unload시 관련 데이터를 sessionStorage에 저장
		angular.element($window).on("unload", function (e) {
			var sess = {};

			sess.screenData = $scope.screenData;

			if (!commInitData.query["locatest"] && $scope.leavePageStroage) { // localtest url 파라메타가 없을때 저장
				LotteStorage.setSessionStorage('styleShopLoc', $location.absUrl());
				LotteStorage.setSessionStorage('styleShopData', sess, 'json');
				LotteStorage.setSessionStorage('styleShopScrollY', angular.element($window).scrollTop());
			}
		});
	}]);

	app.directive('lotteContainer', ['$window', 'LotteCommon', function($window, LotteCommon) {
		return {
			templateUrl : '/lotte/resources_dev/styleshop/styleshopmen_container.html',
			replace : true,
			link : function ($scope, el, attrs) {

				$scope.goProduct = function (goodsNo, tclick) { // 상품상세 이동
					var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goodsNo;

					if (tclick) {
						url += "&tclick=" + tclick;
					}

					$window.location.href = url;
				};

				angular.element($window).on("scroll", function (e) {
					if (!$scope.pageLoadFlag) {
						var bodyH = angular.element("body")[0].scrollHeight,
							winH = angular.element($window).height();

						if (angular.element($window).scrollTop() > (bodyH - winH) - winH * 3) {
							$scope.loadCont();
						}
					}
				});
			}
		};
	}]);
})(window, window.angular);