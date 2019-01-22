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

	app.controller('StyleShopCtrl', ['$window', '$location', '$http', '$scope', '$timeout', 'LotteCommon', 'commInitData', 'LotteStorage', 
		function ($window, $location, $http, $scope, $timeout, LotteCommon, commInitData, LotteStorage) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "스타일샵"; // 서브헤더 타이틀
		$scope.screenID = "StyleShop"; // 스크린 아이디
		$scope.isShowThisSns = true; /*공유버튼*/
		$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png";

		$scope.dispNo = commInitData.query['disp_no'];
		$scope.ctgOpenFlag = false; // 카테고리 열림/펼침 Flag
		$scope.pageLoadFlag = false; // 상품 로드중 Flag
		
		// 스크린 데이터
		($scope.screenDataReset = function () {
			$scope.screenData = {
				page: 1,
				pageSize: 15,
				pageEnd: false,
				ctg_depth_idx : 0,
				ui: {
					selectbox_select_idx: 0,
					midCtg: {
						selected_hash_nm: "WOMEN",
						selected_ctg_no: "5550434",
						items: [{
							hash_nm: "WOMEN",
							ctg_no: "5550434"
						},{
							hash_nm: "MEN",
							ctg_no: "5550435"
						}],
						slideItems: [] // 이중배열
					},
					smlCtg: {
						selected_hash_nm: "",
						selected_ctg_no: "",
						items: [],
						slideItems: [] // 이중배열
					},
					detailCtg: {
						selected_hash_nm: "",
						selected_ctg_no: "",
						items: [],
						slideItems: [] // 이중배열
					}
				},
				first_banner_list: {},
				prod_list: {
					items: [],
					total_count: 0
				}
			};
		})();

		function getDispNm(ctg_no, list) { // DispNo에 해당하는 아이템 이름 찾기
			var i = 0,
				returnVal = null;

			for (i = 0; i < list.length; i++) {
				if (ctg_no == list[i].ctg_no) {
					returnVal = list[i].hash_nm;
					break;
				}
			}

			return returnVal;
		}

		function getSlideItems(arr, count, arrayFullFlag) { // 배열을 이중 배열로 변경한다.
			var rtnArr = [], i = 0, j = 0;

			for (i; i < arr.length; i++) {
				j = Math.floor(i / count);

				if (!rtnArr[j]) {
					rtnArr[j] = [];
				}

				rtnArr[j].push(arr[i]);
			}

			if (arrayFullFlag && rtnArr[j].length < count) { // Array 당 count 만큼의 item이 채워지지 않았을 경우 채우는 로직
				var tmpCnt = count - rtnArr[j].length;

				for (i = 0; i < tmpCnt; i++) {
					rtnArr[j].push({});
				}
			}

			return rtnArr;
		}

		function createCategory(data) {
			var ctgData = data,
				midCtgData = ctgData.mid_category,
				smlCtgData = ctgData.sml_category,
				detailCtgData = ctgData.detail_category;

			// 선택된 카테고리 확인
			if (ctgData) {
				if (midCtgData) { // 중카 (남성 / 여성)
					if (midCtgData.selected_no) {
						$scope.screenData.ui.midCtg.selected_ctg_no = midCtgData.selected_no;

						if ($scope.screenData.ui.midCtg.selected_ctg_no == "0") { // 전체
							$scope.screenData.ui.midCtg.selected_hash_nm = "전체";
						} else {
							$scope.screenData.ui.midCtg.selected_hash_nm = getDispNm(midCtgData.selected_no, midCtgData.items);
						}

						$scope.screenData.ctg_depth_idx = 0;
					}

					 // 중카는 데이터 받아오지 않음
					 $scope.screenData.ui.midCtg.slideItems = getSlideItems($scope.screenData.ui.midCtg.items, 6, true);
				}

				if (smlCtgData) { // 소카
					if (smlCtgData.selected_no) {
						$scope.screenData.ui.smlCtg.selected_ctg_no = smlCtgData.selected_no;

						if ($scope.screenData.ui.smlCtg.selected_ctg_no == "0") { // 전체
							$scope.screenData.ui.smlCtg.selected_hash_nm = "전체";
						} else {
							$scope.screenData.ui.smlCtg.selected_hash_nm = getDispNm(smlCtgData.selected_no, smlCtgData.items);
						}

						$scope.screenData.ctg_depth_idx = 1;
					}

					$scope.screenData.ui.smlCtg.items = [];
					$scope.screenData.ui.smlCtg.items.push({hash_nm: "전체", ctg_no: $scope.screenData.ui.midCtg.selected_ctg_no});
					$scope.screenData.ui.smlCtg.items = $scope.screenData.ui.smlCtg.items.concat(smlCtgData.items);
					$scope.screenData.ui.smlCtg.slideItems = getSlideItems($scope.screenData.ui.smlCtg.items, 6, true);
				}

				if (detailCtgData) { // 세카
					if (detailCtgData.selected_no) {
						$scope.screenData.ui.detailCtg.selected_ctg_no = detailCtgData.selected_no;

						if ($scope.screenData.ui.detailCtg.selected_ctg_no == "0") { // 전체
							$scope.screenData.ui.detailCtg.selected_hash_nm = "전체";
						} else {
							$scope.screenData.ui.detailCtg.selected_hash_nm = getDispNm(detailCtgData.selected_no, detailCtgData.items);
						}

						$scope.screenData.ctg_depth_idx = 2;
					}

					$scope.screenData.ui.detailCtg.items = [];
					$scope.screenData.ui.detailCtg.items.push({hash_nm: "전체", ctg_no: $scope.screenData.ui.smlCtg.selected_ctg_no});
					$scope.screenData.ui.detailCtg.items = $scope.screenData.ui.detailCtg.items.concat(detailCtgData.items);
					$scope.screenData.ui.detailCtg.slideItems = getSlideItems($scope.screenData.ui.detailCtg.items, 6, true);
				}
			}
		}

		/**
		 * @ngdoc function
		 * @name urlChkFnc
		 * (작성자 : 변룡수 / 날짜 : 2018-05-31)
		 * @description
		 * background-image url not found 개선
		 */

		function urlChkFnc (name){
			$timeout(function(){
				angular.element(name).each(function(idx,item){
					var _anchor = angular.element(this).find('.img_wrap'),
						_url = _anchor.data("bgUrl");
					_anchor.css('background-image',"url('" + _url + "')");

				});
			},100);
		}


		function createBannerLst(data) { // 배너 영역 생성
			$scope.screenData.first_banner_list = data;
            urlChkFnc('.top_wrap ul li');
		}

		function createPrdLst(data) { // 상품 리스트 생성
			$scope.screenData.prod_list.items = $scope.screenData.prod_list.items.concat(data);
            urlChkFnc('.prod_list_wrap ul li');
		}

		$scope.loadCont = function () { // 데이터 로드
			if ((!$scope.dispNo && !LotteCommon.isTestFlag) || $scope.pageLoadFlag || $scope.screenData.pageEnd) {
				return false;
			}

			$scope.pageLoadFlag = true;

			var httpConfig = {
				method: "get",
				url: LotteCommon.styleShopData + "?dispNo=" + $scope.dispNo + "&page=" + $scope.screenData.page + "&rowsPerPage=" + $scope.screenData.pageSize,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				datatype: "json"
			};

			$http(httpConfig)
			.success(function (data) {
				if (!data.styleshop_sub_list) {
					return false;
				}
				data = data.styleshop_sub_list;

				if ($scope.screenData.page == 1) { // 1페이이지일 경우에만
					if (data.category_list) { // 카테고리 생성
						createCategory(data.category_list);
					}

					if (data.first_banner_list) { // 배너 영역 생성
						createBannerLst(data.first_banner_list)

					}

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
			templateUrl : '/lotte/resources_dev/styleshop/styleshop_container.html',
			replace : true,
			link : function ($scope, el, attrs) {
				$scope.ctgSelectBoxClick = function (depth) { // 카테고리 선택
					if ($scope.screenData.ui.selectbox_select_idx != depth) {
						$scope.screenData.ui.selectbox_select_idx = depth;
						$scope.ctgOpenFlag = true;

						var tclick = "m_DC_SpeDisp5_Sub_Cat" + ($scope.screenData.ui.selectbox_select_idx + 1) + "_" + ($scope.ctgOpenFlag ? "Open" : "Close");
						$scope.sendTclick(tclick);
					} else {
						$scope.toggleCtg();
					}
				};

				$scope.toggleCtg = function () { // 카테고리 셀렉트 박스 열기/닫기
					$scope.ctgOpenFlag = !$scope.ctgOpenFlag;

					var tclick = "m_DC_SpeDisp5_Sub_Cat" + ($scope.screenData.ui.selectbox_select_idx + 1) + "_" + ($scope.ctgOpenFlag ? "Open" : "Close");
					$scope.sendTclick(tclick);
				};

				$scope.ctgChange = function (item) { // 카테고리 변경
					$window.location.href = LotteCommon.styleShopUrl + "?" + $scope.baseParam + "&disp_no=" + item.ctg_no + "&tclick=m_DC_SpeDisp5_Sub_Cat_" + item.ctg_no + "&curDispNoSctCd=46";
				};

				$scope.goProduct = function (goodsNo, tclick) { // 상품상세 이동
					var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goodsNo + "&curDispNoSctCd=46";;

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

				$scope.chkHtmlColorCode = function (color) { // 컬러 코드값 validate
					var colorCodeArr = (color + "").match(/^\#[0-9|a-f|A-F]+/i),
						colorCode = "",
						rtnColorCode = "#000";

					if (colorCodeArr && colorCodeArr.length > 0) {
						colorCode = colorCodeArr[0] + "";
					}

					if (colorCode && colorCode.match(/^\#/) && colorCode.length == 4 || colorCode.length == 7) {
						rtnColorCode = colorCode;
					}

					return rtnColorCode;
				};

			}
		};
	}]);
})(window, window.angular);