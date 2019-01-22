(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteProduct'
	]);

	app.controller('StylePushCtrl', ['$http', '$window', '$location', '$scope', '$timeout', 'LotteCommon', 'commInitData', 'LotteUtil', 'LotteStorage',
		function ($http, $window, $location, $scope, $timeout, LotteCommon, commInitData, LotteUtil, LotteStorage) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "스타일추천"; // 서브헤더 타이틀
		$scope.screenID = "patternsearch"; // 스크린 아이디

		$scope.goodsNoDataArray = []; // 오드컨셉 상품번호 Data
		$scope.goodsNoLstStr = ""; // 오드컨셉 상품번호 Data 조인으로 배열을 변경

		$scope.productListLoadingFlag = false;
		$scope.productMoreScroll = true;
		$scope.prodcutFirstLoadFlag = true;
		
		$scope.curDispNoSctCd = 14;

		// 스크린 데이터
		($scope.screenDataReset = function () {
			$scope.defaultParams = {
				uuid: commInitData.query['uuid'],
				rid: commInitData.query['rid'],
				accessToken: commInitData.query['accessToken'],
				cat1Name: decodeURIComponent(commInitData.query['cat1Name'] + ""),
				cat2Name: decodeURIComponent(commInitData.query['cat2Name'] + ""),
				sel_cat1_name: "",
				sel_cat2_name: "",
				caid1: "",
				caid2: "",
				caid3: "",
				caid4: "",
				imgPath: "https://c-lottedotcom-g.oddconcepts.kr" + decodeURIComponent(commInitData.query['imgPath'])
			};

			$scope.screenData = {
				page: 1,
				pageSize: 20,
				totalCount: 0,
				totalPage: 0,
				pageEnd: false
			};
		
			$scope.srhResultData = {
				resultCode: "1000",
				prdList: []
			};
		})();

		// 스타일 추천 카테고리 정보 호출
		function getStyleCtg() {
			$http.get(LotteCommon.stylePushCtgData)
			.success(function (data) {
				var ctg_l_list,
					ctg_m_list,
					i = 0;

				if (LotteCommon.isTestFlag) { // 테스트
					$scope.defaultParams.sel_cat1_name = "여성"; // 카테고리 선택 정보 (여성/남성)
					$scope.defaultParams.sel_cat2_name = "티셔츠"; // 카테고리 선택 정보 (카테고리)
					
					$scope.defaultParams.caid1 = '"'; // Odd Concepts 전달 데이터
					$scope.defaultParams.caid2 = ""; // Odd Concepts 전달 데이터
					$scope.defaultParams.caid3 = ""; // Odd Concepts 전달 데이터
					$scope.defaultParams.caid4 = ""; // Odd Concepts 전달 데이터

					$scope.defaultParams.imgPath = "http://image.lotte.com/goods/97/38/18/96/1/196183897_1_280.jpg";

					callPrdNoList();
				} else {
					for (i = 0; i < data.cate_l_list.length; i++) { // 남성 / 여성
						if (data.cate_l_list[i].name == $scope.defaultParams.cat1Name) {
							ctg_l_list = data.cate_l_list[i];
							break;
						}
					}

					if (!ctg_l_list) {
						console.log("카테고리 정보 오류");
					} else {
						for (i = 0; i < ctg_l_list.cate_m_list.length; i++) { // 카테고리 정보
							if (ctg_l_list.cate_m_list[i].name == $scope.defaultParams.cat2Name) {
								ctg_m_list = ctg_l_list.cate_m_list[i];
								break;
							}
						}

						if (!ctg_m_list) {
							console.log("카테고리 정보 오류");
						} else {
							$scope.defaultParams.sel_cat1_name = ctg_l_list.name; // 카테고리 선택 정보 (여성/남성)
							$scope.defaultParams.sel_cat2_name = ctg_m_list.name; // 카테고리 선택 정보 (카테고리)
							
							$scope.defaultParams.caid1 = ctg_m_list.caid1; // Odd Concepts 전달 데이터
							$scope.defaultParams.caid2 = ctg_m_list.caid2; // Odd Concepts 전달 데이터
							$scope.defaultParams.caid3 = ctg_m_list.caid3; // Odd Concepts 전달 데이터
							$scope.defaultParams.caid4 = ctg_m_list.caid4; // Odd Concepts 전달 데이터

							callPrdNoList();
						}
					}
				}

			});
		}

		// 오드컨셉 API 연동
		function callPrdNoList() {
			$scope.productListLoadingFlag = true; // 로딩 활성화
			$scope.productMoreScroll = false;

			var url = LotteCommon.styleOddAPIData +
				"?uuid=" + $scope.defaultParams.uuid + 
				"&rid=" + $scope.defaultParams.rid + 
				"&caid1=" + $scope.defaultParams.caid1 + 
				"&caid2=" + $scope.defaultParams.caid2 + 
				"&caid3=" + $scope.defaultParams.caid3 + 
				"&caid4=" + $scope.defaultParams.caid4 +
				"&page=" + $scope.screenData.page;
				
			$.ajax({
				url: url,
				type: "POST",
				headers: {'Authorization': 'Bearer ' + $scope.defaultParams.accessToken},			
				dataType: "json",
				success: function (data) {
					if (data.main_list) { // 추천 상품
						dispNoArray(data.main_list);
					}

					// if (data.sub_list) { // 유사상품 포함
					// 	dispNoArray(data.sub_list);
					// }

					$scope.goodsNoLstStr = $scope.goodsNoDataArray.join(); // Array 형태를 변경

					$scope.screenData.totalCount = data.total_count;
					$scope.screenData.totalPage = Math.ceil($scope.screenData.totalCount / $scope.screenData.pageSize);

					lodaData($scope.goodsNoLstStr);
				},
				error: function (data) {
					console.log(data);
				}
			});
		}

		// Data 받아서 상품번호 배열로 만들기
		function dispNoArray(data) {
			var i = 0;

			for (i = 0; i < data.length; i++) {
				$scope.goodsNoDataArray.push(data[i].mapid);
			}
		}

		// goodsNo 넘긴 후, 상품 데이터 받기
		function lodaData(prdNoLst) {
			$http({
				url: LotteCommon.stylePushPrdData + "?goods_no=" + prdNoLst,
				method: "POST"
			})
			.success(function (data) {
				dataLoadComplete(data);
			})
			.error(function (data) {
			});
		}

		// 데이터 로드 완료 핸들러
		function dataLoadComplete(data) {
			if (data.resultCode) { // 결과 코드가 있을 경우에만 처리
				$scope.srhResultData.resultcode = data.resultcode; /*결과 코드*/

				if (data.resultCode == "0000" && data.prdList && data.prdList.length > 0) { // 검색결과 있음
					$scope.productMoreScroll = true;

					if ($scope.screenData.page == 1) {
						$scope.srhResultData.prdList = reMappingPldUnitData(data.prdList);
					} else {
						$scope.srhResultData.prdList = $scope.srhResultData.prdList.concat(reMappingPldUnitData(data.prdList));
					}

					if ($scope.screenData.totalPage <= $scope.screenData.page) {
						$scope.productMoreScroll = false;
						$scope.screenData.pageEnd = true;
					}

					$scope.productListLoadingFlag = false; // 로딩 비활성화
					++$scope.screenData.page; // 페이지 증가
				} else if (data.resultCode == "1000" || !data.prdList || (data.prdList && data.prdList.length == 0)) { // 검색결과 없음 (품절상품으로 인한거일 수 있어 totalCount와 비교한다.)
					if ($scope.screenData.totalPage > $scope.screenData.page) {
						++$scope.screenData.page; // 페이지 증가

						callPrdNoList();
					} else { // 결과 없음
						$scope.productMoreScroll = false; // 로딩 비활성화
						$scope.screenData.pageEnd = true;
						$scope.productListLoadingFlag = false; // 로딩 비활성화
					}
				}
			} else { // 결과 코드(resultcode)가 없는 오류 처리
				$scope.productListLoadingFlag = false; // 로딩 비활성화
				console.info("조회 중 에러가 발생하였습니다.");
			}
			
			$scope.prodcutFirstLoadFlag = false;
		}

		// 스크롤시 데이터 추가 로드
		$scope.loadMoreData = function() {
			callPrdNoList();
		};

		function reMappingPldUnitData(data) {
			var convertFields = {
				goods_no : 'goodsNo',
				goods_nm : 'goodsNm',
				brnd_nm : 'brandNm',
				img_url : 'imgUrl',
				original_price : 'price1',
				discounted_price : 'price2',
				sale_rate : 'saleRate',
				flag : 'flag',
				review_count : 'reviewCnt',
				smartpick_yn: 'smpick',
				limit_age_yn: 'byrAgelmt',
				is_himart : 'himart',
				is_dept : 'dept',
				is_tvhome : 'tvhome',
				is_youngplz : 'young',
				is_sale_promotion: 'goodsCmpsCd',
				curDispNo: 'curDispNo',
				has_coupon: 'useCpn'
			};
			
			var defaultConvertStruct = {    
				goods_no : '',
				goods_nm : '',
				brnd_nm : '',
				img_url : '',
				img_url_550 : '',
				original_price : '',
				discounted_price : '',
				sale_rate : '',
				flag : '',
				is_sold_out : false,
				has_coupon : false, // 쿠폰 존재 여부 (AS-IS : useCpn = 'coupon' 일경우 true)
				has_wish : false,
				is_sale_promotion : false,
				review_count : 0,
				bought_sum : 0, 
				md_tip : '',
				promotion_text : '',
				isdlex_free : false, // (AS-IS : flag값에 무료배송 포함이면 true)
				smartpick_yn : false, // 스마트픽(AS-IS : isSmpick true/false 판단 Y or N)
				sold_out_cd_yn : 'N', // 품절임박 유무(기본 'N')
				limit_age_yn : 'N', // 성인 이미지 뷰 허용 여부(AS-IS : byrAgelmt 값으로 판단 'Y' OR 'N')
				link_url : '', 
				is_himart : '',
				is_dept : '',
				is_youngplz : '',
				outlnk: '',
				outlnkMall: '',
				curDispNo: ''
			};

			var retData = [];
			angular.forEach(data, function(item, index) {
				var newData = angular.copy(defaultConvertStruct);
				angular.forEach(convertFields, function(val, key) {
					if (key == 'has_coupon') {
						newData[key] = item[val] == 'coupon' ? true:false;
					} else if (key == 'flag') {
						if(item['flag'] && item['flag'].indexOf('무료배송') > -1) {
							newData['isdlex_free'] = true;
						}
					} else if (key == 'is_sale_promotion') {
						if (item['goodsCmpsCd'] == '30') {
							newData[key] = true;
						}
					} else if (key == 'sale_rate') {
						if (item[val] == null) {
							newData[key] = 0;
						} else {
							newData[key] = parseInt(item[val]);
						}
					} else if (key == 'smartpick_yn') {
						newData[key] = item[val] ? 'Y':'N';
					} else if (key == 'limit_age_yn') {
						newData[key] = item[val] == 19 ? 'Y':'N';
					} else if (key == 'goods_nm') {
						newData[key] = LotteUtil.replaceAll(item['goodsNm'],'<!HS>','<STRONG>');
						newData[key] = LotteUtil.replaceAll(newData[key],'<!HE>','</STRONG>');
					} else {
						newData[key] = item[val];
					}
				});

				retData.push(newData); 
			});
			return retData;
		}

		// sessionStorage - 세션에서 가저올 부분 선언
		var stylePushLoc = LotteStorage.getSessionStorage('stylePushLoc');
		var stylePushDataStr = LotteStorage.getSessionStorage('stylePushData');
		var stylePushScrollY = LotteStorage.getSessionStorage('stylePushScrollY');

		if (stylePushLoc == $window.location.href && stylePushDataStr != null && commInitData.query["locatest"] != "true") { // 현재 URL과 session storage에 저장된 경로가 동일 할 경우
			var stylePushData = JSON.parse(stylePushDataStr);

			$scope.defaultParams = stylePushData.defaultParams;
			$scope.screenData = stylePushData.screenData;
			$scope.srhResultData = stylePushData.srhResultData;

			$timeout(function () {
				angular.element($window).scrollTop(stylePushScrollY);
			}, 500);
		} else {
			getStyleCtg();
		}

		// 페이지 벗어날 경우 sessionStorage 저장
		angular.element($window).on("unload", function (e) {
			var sess = {};

			sess.defaultParams = $scope.defaultParams;
			sess.screenData = $scope.screenData;
			sess.srhResultData = $scope.srhResultData;

			if (!commInitData.query["localtest"]) { // localtest url 파라메타가 없을때 저장
				LotteStorage.setSessionStorage('stylePushLoc', $location.absUrl());
				LotteStorage.setSessionStorage('stylePushData', sess, 'json');
				LotteStorage.setSessionStorage('stylePushScrollY', angular.element($window).scrollTop());
			}
		});
	}]);

	app.directive('lotteContainer', [ '$window', 'LotteCommon', function($window, LotteCommon) {
		return {
			templateUrl : '/lotte/resources_dev/search/style_push_container.html',
			replace : true,
			link : function ($scope, el, attrs) {
				// 다시 찾아보기
				$scope.stylePushLink = function () {
					$window.location.href = LotteCommon.stylePushIntroUrl + "?" + $scope.baseParam + "&tclick=m_patternsearch_retry";
				};
			}
		};
	}]);

})(window, window.angular);