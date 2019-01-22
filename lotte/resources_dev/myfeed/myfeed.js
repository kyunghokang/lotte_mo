(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteCommFooter',
		'lotteSlider',
		'lotteNgSwipe',
		'lotteUtil'
    ]);

    app.controller('MyFeedCtrl',
    			['$scope', '$window', '$interval', '$timeout', '$filter', 'LotteCommon', 'LotteStorage', 'MyFeedService', 'LotteConsole', 'LotteUserService', 'commInitData', '$http', 'LotteForm', 
    	function( $scope,   $window,   $interval,   $timeout,   $filter,   LotteCommon,   LotteStorage,   MyFeedService,   LotteConsole,   LotteUserService,   commInitData,   $http,   LotteForm) {
    	
    	$scope.screenID = "MyReco"; // 스크린 아이디
    	$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "";
		$scope.latelyGoods = '';
        $scope.swipeCurIdx = 0;
        $scope.wishSwipeCurIdx = 0;
        // 최근본 상품 추천 더보기 인덱스
        $scope.recentlyRecomIdx = 0;
        
        $scope.recently = {
			hasLately : "Y"
		};
        $scope.recentlyRecom = {};
        $scope.recentlyPlan = {};
        $scope.orderRecom = {};
		$scope.cardList = [];
		$scope.pushProducts = {};
		$scope.wishes = {};
		$scope.wishesRecom = [];
		$scope.brandList = {};
		$scope.brandRecom = {};
		$scope.searchList = {};
		$scope.categoryList = {};
		
		//$scope.ABtest = commInitData.query.ABtest === "Y";
		$scope.favoriteBrand = {
			"title"		: "",
			"brandList"	: [],
			"available"	: 0,
			"curBrand"	: {"brdNo":0, "brdNm":""},
			"curIndex"	: -1,
			"prodList"	: [],
			"relBrands"	: []
		};
		$scope.customRecomProd = {
			"origin"	: [],
			"page"		: 0,
			"total"		: 0,
			"size"		: 20,
			"limit"		: 0
		}
		
		$scope.gaCate = "MO_마이추천_OLD";
		$scope.tclickPrefix = $scope.tClickBase + $scope.screenID + "_";
		$scope.arrAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']; 
		
		/* { 1세트 호출함: call_1, 1세트 로드됨: load_1, 2세트 호출함:call_2, 2세트 로드됨: load_2, 3세트 호출함: call_3 }*/
		var objStatus = {
			call_1 : 1,
			load_1 : 2,
			call_2 : 3,
			load_2 : 4,
			call_3 : 5
		};
		$scope.callStatus = objStatus.call_1; 
		$scope.cntLoading = 0;

		/**
		 * 로딩애니메이션 show/hide 체크
		 */
		$scope.checkLoading = function(isStart){
			if(isStart){
				$scope.cntLoading++;
				$scope.isShowLoading = true;
				return;
			}
			$scope.cntLoading--;
			if($scope.cntLoading == 0){
				$scope.isShowLoading = false;
			}
		};

		/**
		 * 스크롤시 어떤 데이타 호출할지 체크
 		 */
		$scope.scrollBottomCall = function(){
			// 3세트 콜했거나 1세트 로드전이면
			if($scope.callStatus === objStatus.call_3 || !$scope.callStatus){
				return;
			}
			// 1세트 로드되었으면
			if($scope.callStatus === objStatus.load_1){
				$scope.callStatus = objStatus.call_2;
				// 카드 데이타 조회
				$scope.callCardData();
				// 재고가격/가격인하 알림 조회
				$scope.callPushData();
				// 찜 데이타 조회
				if($scope.loginInfo.isLogin)	$scope.callWishData($scope.latelyGoods);
				return;
			}
			// 2세트 로드되었으면
			if($scope.callStatus === objStatus.load_2){
				$scope.callStatus = objStatus.call_3;
				// 브랜드 데이타 조회
				$scope.callBrandData();
				callCustomRecomDS();
				// 검색 데이타 조회
				$scope.callSearchRecom();
				// 카테고리 데이타 조회
				$scope.callCategory();
				return;
			}
		};
		
		/**
		 * 데이타 로드후 후처리
		 */
		$scope.callbackCtrl = function(){
			if($scope.callStatus === objStatus.call_1){
				$scope.callStatus = objStatus.load_1;
			}else if($scope.callStatus === objStatus.call_2){
				$scope.callStatus = objStatus.load_2;
			}
			var $win = angular.element($window);
			if($win.scrollTop() + $win.height() > angular.element(document).height() - angular.element('#footer').height()) {
				$scope.scrollBottomCall();
			}
		};
		
		/**
		 * 최근본상품 아웃풋데이타 처리
 		 */
        function getRecently(data){
        	if(!data || data.length == 0){
        		return [];
        	}
        	
        	var temp = {
				imgUrl: $scope.screenType > 1 ? 'http://image.lotte.com/lotte/mo2017/myfeed/recomm_more_big.jpg' : 'http://image.lotte.com/lotte/mo2017/myfeed/recomm_more.jpg'
			};
        	if(data.length % 3 != 0){
				data.push(temp);
				if(data.length % 3 != 0){
					data.push(temp);
				}
			}
			var dataTotal = data.length;
			var sliceData = [];
			var	j = -1;

			for (var i = 0; i < dataTotal; i++) {
				if (i % 3 == 0) {
					j++;
					sliceData[j] = [];
				}
				sliceData[j].push(data[i]);
			}
			return sliceData;
        }
        
        /**
         * 최근 본 상품 추천 데이타
         */
        function getRecentlyRecom(data){
        	if(!data || data.length < 3){
        		return [];
        	}
        	if(data.length % 3 != 0){
				data.pop();
				if(data.length % 3 != 0){
					data.pop();
				}
			}
        	return data;
        }
        
        
        /**
         * 최근 본 상품 추천 더보기용 데이타
         */
        function getRecentlyRecomSlice(data){
        	if(!data || data.length == 0){
        		return [];
        	}
			var dataTotal = data.length;
			var sliceData = [];
			var	j = -1;

			for (var i = 0; i < dataTotal; i++) {
				if (i % 6 == 0) {
					j++;
					sliceData[j] = [];
				}
				sliceData[j].push(data[i]);
			}
			return sliceData;
        }
		
		/**
         * 최근 본 상품 조회
         */
		$scope.callRecentlyInit = function(str){
			$scope.checkLoading(true);
			MyFeedService.loadRecentlyInit(str).then(function(data){
				//LotteConsole.traceObj(data, '0 RecentlyInit success', 'green');
				if(data && data.data && data.data.latest_prod_list && data.data.latest_prod_list.prdList 
					&& data.data.latest_prod_list.prdList.items && data.data.latest_prod_list.prdList.items.length > 0){
					$scope.recently.items = getRecently(data.data.latest_prod_list.prdList.items);
					
					var strTemp = '';
					for(var i = 0; i<$scope.recently.items[0].length; i++){
						strTemp += (i > 0 ? ',' : '') + $scope.recently.items[0][i].goodsNo;
					}
					$scope.callRecentlyData(strTemp);
					
					$scope.recently.topTxt = data.data.latest_prod_list.topTxt || '';
					$scope.recently.txt = data.data.latest_prod_list.txt || '';
					$timeout(function(){
	            		angular.element('.recently_wrap .swipe_wrap > ul > li.item'+$scope.swipeCurIdx).addClass('on');
	            	}, 100);
				}else{
					$scope.callStatus = objStatus.load_1;
					$scope.scrollBottomCall();
				}
			}).catch(function(error){
				console.log('0 RecentlyInit error ', error);
			}).finally(function(){
				$scope.callbackCtrl();
				$scope.checkLoading();
			});
		};
		
        /**
         * 최근 본 상품 관련 조회
         */
		$scope.callRecentlyData = function(str){
			$scope.checkLoading(true);
			MyFeedService.loadRecentlyData(str, $scope.recently.hasLately).then(function(data){
				//LotteConsole.traceObj(data, '1 RecentlyData success', 'green');
				if(!data)	return;
				if(data.data.latest_prod_recomm_list && data.data.latest_prod_recomm_list.prdList 
					&& data.data.latest_prod_recomm_list.prdList.items && data.data.latest_prod_recomm_list.prdList.items.length > 0){
					$scope.recentlyRecomIdx = 0;
					$scope.recentlyRecom.items = getRecentlyRecom(data.data.latest_prod_recomm_list.prdList.items);
					$scope.recentlyRecom.txt = data.data.latest_prod_recomm_list.txt || '';
					$scope.recentlyRecom.slice = getRecentlyRecomSlice($scope.recentlyRecom.items);
				}else{
					$scope.recentlyRecom.items = [];
				}
				if(data.data.spdp_recomm_list && data.data.spdp_recomm_list.items && data.data.spdp_recomm_list.items.length > 0){
					var doReset = false;
					if($scope.recentlyPlan.items && $scope.recentlyPlan.items.length > 0){
						doReset = true;
					}
					$scope.recentlyPlan.txt = data.data.spdp_recomm_list.txt;
					$scope.recentlyPlan.items = data.data.spdp_recomm_list.items;
					
					if(!doReset)	return;
					// 슬라이드 다시 그림
					var slider = angular.element('.recently_plan .swipe_wrap');
					setTimeout(function () {
						slider.scope().reset();
					},300);
				}else{
					$scope.recentlyPlan.items = [];
				}
			}).catch(function(error){
				console.log('1 RecentlyData error ', error);
			}).finally(function(){
				$scope.callbackCtrl();
				$scope.checkLoading();
			});
		};
		
		/**
		 * 최근 본 상품 추천 더보기
		 */
		$scope.recentlyRecomMore = function(){
			if($scope.recentlyRecomIdx < $scope.recentlyRecom.slice.length-1){
				$scope.recentlyRecomIdx++;
			}else{
				$scope.recentlyRecomIdx = 0;
			}
			$scope.sendTclick($scope.tclickPrefix + "RctView_Clk_Btn01");
			$scope.ga("이런상품은어떠세요", "다른추천상품볼래요");
		};
		
		/**
		 * 최근 구매/장바구니 담아둔 데이터 조회
		 */
		$scope.callOrderData = function(){
			$scope.checkLoading(true);
			MyFeedService.loadOrderData().then(function(data){
				//LotteConsole.traceObj(data, '2 OrderData success', 'green');
				if(!data)	return;
				$scope.orderRecom = data;
			}).catch(function(error){
				console.log('2 OrderData error ', error);
			}).finally(function(){
				$scope.callbackCtrl();
				$scope.checkLoading();
			});
		};

		function getDispAmt(num){
			if(!num || isNaN(num))	return num;
			if(num.length > 8 || num % 10000 != 0)	return num;
			var num2 = num.substr(0, num.length - 4);
			return num2 + "만원";
		}
		
		/**
		 * 카드 데이터 조회
		 */
		$scope.callCardData = function(){
			$scope.checkLoading(true);
			MyFeedService.loadCardData().then(function(data){
				//LotteConsole.traceObj(data, '3 CardData success', 'green');
				
				//var str = '{"data" : {"card_recomm" : {"event_list" : [],"prom_list" : [ {"fvr_val" : 5,"prom_end_dtime" : "2017.11.28 23:59:59","aply_lmt_amt" : 50000,"card_knd_cd" : "047","prom_no" : 1194817,"prom_diff_dtime" : "14:36:43","evt_crcm_nm" : "롯데카드"}]}}}';
				//data = JSON.parse(str);
				
				if(!data || !data.data || !data.data.card_recomm || !data.data.card_recomm.event_list || !data.data.card_recomm.prom_list)	return;
				var arr = data.data.card_recomm.event_list;
				var arrProm = data.data.card_recomm.prom_list;
				var objProm = {};
				var arrTemp = [];
				var arrColor = ['#9cb5d4', '#99d2cb', '#d899a2'];
				// IOS 앱인 경우 청구할인 제외 (메인 링크때문)
				//if(!$scope.appObj.isApp){
				// 신버전 앱에서 허용
				if($scope.isAvailApp){
					// 청구할인 재조합
					for(var j = 0; j<arrProm.length; j++){
						var card_knd_cd = arrProm[j].card_knd_cd;
						if(!objProm[card_knd_cd]){
							objProm[card_knd_cd] = arrProm[j];
							objProm[card_knd_cd].sort = j;
						}else if(!objProm[card_knd_cd].multi){
							objProm[card_knd_cd].multi = true;
							objProm[card_knd_cd].aply_lmt_amt = getDispAmt("" + objProm[card_knd_cd].aply_lmt_amt);
							objProm[card_knd_cd].aply_lmt_amt += '/' + getDispAmt("" + arrProm[j].aply_lmt_amt);
							objProm[card_knd_cd].fvr_val += '/' + arrProm[j].fvr_val;
						}	
					}
					for (var prop in objProm) {
						arrTemp.push(objProm[prop]);
					}
					// 청구할인 재소팅
					arrTemp = $filter('orderBy')(arrTemp, 'sort', false);
				}
				//}
				// 배열 합침
				$scope.cardList = arr.concat(arrTemp);
				// 카드 타이머 시작
				for(var i = 0; i<$scope.cardList.length; i++){
					$scope.cardList[i].idx = i;
					$scope.cardList[i].remain_time = $scope.cardList[i].pur_diff_dtime || $scope.cardList[i].prom_diff_dtime;
					$scope.cardList[i].color = arrColor[i%3];
					(function(i){
						var interval = $interval(function(){
							var k = -1;
							for(var j = 0; j<$scope.cardList.length; j++){
								if($scope.cardList[j].idx == i){
									k = j;
									break;
								}
							}
							if(k == -1)	return;
							$scope.cardList[k].remain_time = $scope.setCardTime($scope.cardList[k].remain_time);
							if($scope.cardList[k].remain_time == '00:00:00'){
								$interval.cancel(interval);
								$scope.cardList.splice(k, 1);
							}
						}, 1000);
					})(i);
				}
				$timeout(function(){
					angular.element(angular.element('.card_wrap .indicator li')[0]).addClass('on');
				});
			}).catch(function(error){
				console.log('3 CardData error ', error);
			}).finally(function(){
				$scope.callbackCtrl();
				$scope.checkLoading();
			});
		};

		/**
		 * 재입고/가격인하 알림 데이터 조회
		 */
		$scope.callPushData = function(){
			$scope.checkLoading(true);
			MyFeedService.loadPushData().then(function(data){
				//LotteConsole.traceObj(data, '4 PushData success', 'green');
				if(!data || !data.smart_alarm_list || !data.smart_alarm_list.alarm_list || !data.smart_alarm_list.alarm_list.items || data.smart_alarm_list.alarm_list.items.length == 0)	return;
				$scope.pushProducts.items = data.smart_alarm_list.alarm_list.items;
				$scope.pushProducts.title = data.title;
			}).catch(function(error){
				console.log('4 PushData error ', error);
			}).finally(function(){
				$scope.callbackCtrl();
				$scope.checkLoading();
			});
		};
		
		/**
		 * 찜한 데이터 조회
		 */
		$scope.callWishData = function(prod){
			$scope.checkLoading(true);
			MyFeedService.loadWishData(prod).then(function(data){
				//LotteConsole.traceObj(data, '5 WishData success', 'green');
				if(data && data.data && data.data.goods_15day_list_other){
					$scope.wishes.title = data.data.goods_15day_list_other.txt;
				}
				if(!data || !data.data || !data.data.goods_15day_list_save || !data.data.goods_15day_list_save.prdList 
						|| !data.data.goods_15day_list_save.prdList.items || data.data.goods_15day_list_save.prdList.items.length == 0)	return;
				$scope.wishes.items = data.data.goods_15day_list_save.prdList.items;
				$scope.wishes.txt = data.data.goods_15day_list_save.txt;

				$scope.callWishRecom($scope.wishes.items[0].goodsNo);
				$timeout(function(){
            		angular.element('.wish_wrap .swipe_wrap > ul > li.wish'+$scope.wishSwipeCurIdx).addClass('on');
				}, 100);
			}).catch(function(error){
				console.log('5 WishData error ', error);
			}).finally(function(){
				$scope.callbackCtrl();
				$scope.checkLoading();
			});
		};

		/**
		 * 찜 추천 상품 가져오기
		 */
		$scope.callWishRecom = function(goods_no){
			$scope.checkLoading(true);
			MyFeedService.loadWishRecom(goods_no).then(function(data){
				//LotteConsole.traceObj(data, '6 WishRecom success', 'green');
				$scope.wishesRecom = [];
				if(!data || !data.data || !data.data.goods_list_1 || !data.data.goods_list_1.prdList
						|| !data.data.goods_list_1.prdList.items || data.data.goods_list_1.prdList.items.length == 0)	return;
				for(var i = 0; i<data.data.goods_list_1.prdList.items.length; i++){
					$scope.wishesRecom.push(data.data.goods_list_1.prdList.items[i]);
					if(i == 2)	break;
				}
			}).catch(function(error){
				$scope.wishesRecom = [];
				console.log('6 WishRecom error ', error);
			}).finally(function(){
				$scope.callbackCtrl();
				$scope.checkLoading();
			});
		};
		
		/**
		 * 즐겨찾는 브랜드샵 이동
		 */
		$scope.goFavBrandShop = function(tclick){
			var brand = $scope.favoriteBrand.curBrand;
			var url = brand.linkUrl;
			var upBrdNo = brand.upBrdNo;
			/*var upBrdNo = "";
			try{
				upBrdNo = url.split("upBrdNo=")[1].split("&")[0];
			}catch(e){}*/
			
			var tc = "";
			switch(tclick){
			case "PreBrd_Clk_Brdname":
				$scope.ga("관심있는브랜드인기상품_브랜드명", "", upBrdNo);
				tc = "&tclick=" + $scope.tclickPrefix + tclick;
				break;
			case "PreBrd_Clk_Brd_more":
				$scope.ga("관심있는브랜드인기상품_더보기", "", upBrdNo);
				tc = "&tclick=" + $scope.tclickPrefix + tclick;
				break;
			case "PreBrdReco_Clk_Brdname":
				$scope.ga("이브랜드관심있으시죠_기준브랜드", "", upBrdNo);
				tc = "&tclick=" + $scope.tclickPrefix + tclick;
				break;
			// no default
			}
			
			url = url + tc + "&" + $scope.baseParam;
			window.location.href = url;
		};
		
		/**
		 * 즐겨찾는 브랜드 리스트 불러오기
		 */
		function callFavBrandList(){
			var age = Math.floor($scope.loginInfo.mbrAge / 10) * 10;
			if(age < 10){ age = 10; }
			var url = "/json/mylotte/my_brand_list.json?gender=" + $scope.loginInfo.genSctCd + "&age=" + age;
			$http.get(url)
			.success(function(data){
				if(data && data.data && data.data.brndList && data.data.brndList.items){
					$scope.favoriteBrand.brandList = data.data.brndList.items;
					$scope.favoriteBrand.available = $scope.favoriteBrand.brandList.length;
					
					try{
					angular.forEach($scope.favoriteBrand.brandList, function(itm){
						itm.upBrdNo = itm.linkUrl.split("upBrdNo=")[1].split("&")[0];
					});
					}catch(e){}
					
					$scope.favoriteBrand.title = data.data.title;
					$scope.changeFavBrand();
				}else{
					console.warn("my_brand_list empty");
				}
			})
			.error(function(data, status, headers, config){
				console.warn("my_brand_list error  " + data);
			});
		};
		
		/**
		 * 즐겨찾는 브랜드 변경하기
		 */
		$scope.changeFavBrand = function(click){
			var n, b;
			var changed = false;
			var len = $scope.favoriteBrand.brandList.length;
			var no = $scope.favoriteBrand.curBrand.brdNo;
			
			var cnt = 0;
			angular.forEach($scope.favoriteBrand.brandList, function(itm){
				if(itm.skip !== true){
					cnt++;
				}
			});
			$scope.favoriteBrand.available = cnt;
			if(click == true && $scope.favoriteBrand.available <= 1){
				$scope.alert_2016("마지막 페이지 입니다. 쇼핑을 하면 할수록, 맞춤 브랜드가 더욱 많아져요!");
				return;
			}
			
			for(var i=0; i<10000; i++){
				n = Math.floor(Math.random() * len);
				b = $scope.favoriteBrand.brandList[n];
				if(b.skip === true){
					continue;
				}
				if(b.brdNo != no){
					$scope.favoriteBrand.curBrand = b;
					$scope.favoriteBrand.curIndex = n;
					changed = true;
					break;
				}
			}
			
			if(changed){
				if(!$scope.isValidArray($scope.favoriteBrand.curBrand.prodList) || $scope.favoriteBrand.curBrand.prodList.length < 6){
					callFavBrandRecobell();
				}
				callRelBrandRecobell();
			}
			
			if(click === true){
				$scope.sendTclick($scope.tclickPrefix + "PreBrd_Clk_Btn01");
				$scope.ga("관심있는브랜드인기상품", "다른브랜드볼래요");
			}
		};
		
		/**
		 * 즐겨찾는 브랜드 상품 불러오기 - 레코벨
		 */
		function callFavBrandRecobell(){
			//http://rb-rec-api-apne1.recobell.io/rec/b004?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&bids=763
			var bn = $scope.favoriteBrand.curBrand.brdNo;
			var url = "http://rb-rec-api-apne1.recobell.io/rec/b004?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&bids=" + bn;
			
			$.ajax({
				type: 'post'
				, async: true
				, url: url
				, dataType  : "jsonp"
				, success: function(data) {
					if(data && data.results){
						var arr = [];
						var len = data.results.length;
						for(var i=0; i<len; i++){
							arr.push(data.results[i].itemId);
						}
						callFavBrandProd(arr);
					}else{
						callFavBrandProd([]);
					}
				}
				, error: function(data, status, err) {
					$scope.favoriteBrand.curBrand.prodList = [];
					callFavBrandProd([]);
					console.warn("recobell b004 error  " + data);
				}
			});
		};
		
		/**
		 * 즐겨찾는 브랜드 상품 불러오기 - 닷컴
		 */
		function callFavBrandProd(arr){
			/*if( !angular.isArray(arr) ){// || arr.length == 0){
				//$scope.favoriteBrand.prodList.length = 0;
				//console.warn("recobell b004 empty", $scope.favoriteBrand.curBrand.brdNo);
				callFavBrandException();
				return;
			}*/
			//console.log($scope.favoriteBrand.curBrand.brdNo, arr.join(","));

			//http://m.lotte.com/json/mylotte/recomm_brand_prd_list.json?brnd_no=랜덤선택된 브랜드 번호&goods_list=상품번호1,상품번호2,상품번호3....(레코벨 b004 상품번호)			
			var bn = $scope.favoriteBrand.curBrand.brdNo;
			var url = "/json/mylotte/recomm_brand_prd_list.json?brnd_no=" + bn + "&goods_list=" + arr.join(",");
			$http.get(url)
			.success(function(data){
				if(data && data.data && data.data.prdList && data.data.prdList.items && data.data.prdList.items.length > 0){
					if(data.data.prdList.items.length > 6){
						data.data.prdList.items.length = 6;
					}
					$scope.favoriteBrand.curBrand.prodList = data.data.prdList.items;
					if($scope.favoriteBrand.curBrand.prodList.length < 6){
						console.warn("recomm_brand_prd_list less than 6");
						//$scope.favoriteBrand.prodList.length = 0;
						callFavBrandException();
					}
				}else{
					$scope.favoriteBrand.curBrand.prodList = [];
					console.warn("recomm_brand_prd_list empty")
					callFavBrandException();
				}
			})
			.error(function(data){
				$scope.favoriteBrand.curBrand.prodList = [];
				console.warn("recomm_brand_prd_list error " + data)
				callFavBrandException();
			});
		};
		
		/**
		 * 즐겨찾는 브랜드 상품 없을 때
		 */
		function callFavBrandException(){
			var brdNo = $scope.favoriteBrand.curBrand.upBrdNo;
			var url = "/json/category/new_cate_search_list.json?dispCnt=10&dpml_no=1&loadTerm=true&page=1&pageType=B&sort=TOT_ORD_CNT,1&upBrdNo=" + brdNo;
			$http.get(url)
			.success(function(data){
				if(data && data.max && data.max.prdLst && data.max.prdLst.items && data.max.prdLst.items.length > 0){
					if(data.max.prdLst.items.length > 6){
						data.max.prdLst.items.length = 6;
					}
					var arr = [];
					angular.forEach(data.max.prdLst.items, function(itm){
						arr.push({
							"goodsNo"	: itm.goods_no,
							"isPlanPrd"	: false,
							//"goodsNm"	: (itm.brnd_nm ? "["+itm.brnd_nm+"] " : "") + itm.goods_nm,
							"goodsNm"	: itm.goods_nm,
							"imgUrl"	: itm.img_url_550,
							"price"		: itm.discounted_price
						});
					});
					try{
						$scope.favoriteBrand.curBrand.prodList = $scope.favoriteBrand.curBrand.prodList.concat(arr);
						if($scope.favoriteBrand.curBrand.prodList.length > 6){
							$scope.favoriteBrand.curBrand.prodList.length = 6;
						}
					}catch(e){
						$scope.favoriteBrand.curBrand.prodList = arr;
					}

					$scope.favoriteBrand.title = "요즘 다른 고객들의 관심브랜드 인기상품";
					
					if($scope.favoriteBrand.curBrand.prodList.length < 6){
						console.warn("my_brand_exception less than 6", $scope.favoriteBrand.curBrand.brdNm);
						$scope.favoriteBrand.curBrand.skip = true;
						$scope.changeFavBrand();
					}
				}else{
					console.warn("my_brand_exception empty");
					$scope.favoriteBrand.curBrand.skip = true;
					$scope.changeFavBrand();
				}
			})
			.error(function(data, status, headers, config){
				console.warn("my_brand_exception error");
				$scope.favoriteBrand.curBrand.skip = true;
				$scope.changeFavBrand();
			});
		};
		
		/**
		 * 연관 브랜드 레코벨 호출
		 */
		function callRelBrandRecobell(){
			//http://rb-rec-api-apne1.recobell.io/rec/b002?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&bids=763
			var bn = $scope.favoriteBrand.curBrand.brdNo;
			var url = "http://rb-rec-api-apne1.recobell.io/rec/b002?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&bids=" + bn;
			
			$.ajax({
				type: 'post'
				, async: true
				, url: url
				, dataType  : "jsonp"
				, success: function(data) {
					if(data && data.results){
						var arr = [];
						var len = data.results.length;
						for(var i=0; i<len; i++){
							arr.push(data.results[i].itemId);
						}
						callRelBrandList(arr);
					}
				}
				, error: function(data, status, err) {
					$scope.favoriteBrand.relBrands.length = 0;
					console.warn("recobell b002 error  " + data);
				}
			});
		};
		
		/**
		 * 연관 브랜드 목록 호출
		 */
		function callRelBrandList(arr){
			if( !angular.isArray(arr) || arr.length == 0){
				$scope.favoriteBrand.relBrands.length = 0;
				console.warn("recobell b002 empty", $scope.favoriteBrand.curBrand.brdNo);
				return;
			}
			
			//http://m.lotte.com/json/mylotte/recomm_brand_list.json?brand_list=브랜드1,브랜드2,브랜드3...(레코벨 b002 브랜드 번호)
			var url = "/json/mylotte/recomm_brand_list.json?brand_list=" + arr.join(",");
			$http.get(url)
			.success(function(data){
				if(data && data.data && data.data.recommBrndList && data.data.recommBrndList.items){
					if(data.data.recommBrndList.items.length > 3){
						data.data.recommBrndList.items.length = 3;
					}
					
					$scope.favoriteBrand.relBrands = data.data.recommBrndList.items;
					
					$timeout(function(){
						var wrap;
						angular.forEach(angular.element('.brand_wrap .swipe_wrap'), function(value, key){
							wrap = angular.element(value);
							wrap.parent().addClass("posx0");
							wrap.find("ul").css("transform", "translateX(0)");
							wrap.unbind("slide").bind("slide", function(e){
								if(e.posX >= 0){
									angular.element(this).parent().addClass('posx0');
								}else{
									angular.element(this).parent().removeClass('posx0');
								}
							});
						});
					});
				}
			})
			.error(function(data){
				$scope.favoriteBrand.relBrands.length = 0;
				console.warn("recomm_brand_list error " + data)
			});
		};
		
		/**
		 * 브랜드 상품 가져오기
		 */
		$scope.callBrandData = function(){
			//if($scope.ABtest){
				callFavBrandList();
			//}else{
				
				/*$scope.checkLoading(true);
				// 기존 브랜드 추천
				MyFeedService.loadBrandData().then(function(data){
					//LotteConsole.traceObj(data, '7 BrandData success', 'green');
					if(!data)	return;
					if(data.data && data.data.brnd_new_list){
						$scope.brandList = data.data.brnd_new_list;
					}
					if(data.data && data.data.brnd_recomm_list){
						var result = data.data.brnd_recomm_list;
						if(result.btmTxt && result.btmTxt.indexOf('성별/연령별') > -1 && result.topTxt && result.topTxt.indexOf('성') > 0){
							var arr = result.topTxt.split('성');
							if(arr[0].indexOf('요즘') > -1){
								result.prefix = '요즘';
								var arr2 = arr[0].split('요즘');
								result.user 	= arr2[1] + '성';
							}else{
								result.user 	= arr[0] + '성';
							}
							result.subtitle = arr[1];
					   }
					   $scope.brandRecom = result;
					}
					$timeout(function(){
						angular.forEach(angular.element('.brand_wrap .swipe_wrap'), function(value, key){
							angular.element(value).on('slide', function(e){
								if(e.posX >= 0){
									angular.element(this).parent().removeClass('posx0').addClass('posx0');
								}else{
									angular.element(this).parent().removeClass('posx0');
								}
							});
						});
					});
				}).catch(function(error){
					console.log('7 BrandData error ', error);
				}).finally(function(){
					$scope.checkLoading();
				});
			}*/
		};
		
		/**
		 * 검색 상품 가져오기
		 */
		$scope.callSearchRecom = function(){
			var validApp = false;
			
			var ao = $scope.appObj;
			var vn = ao.verNumber;
			if(ao.isApp){
				// 아이폰 버전 체크
				if(ao.isIOS){// && vn < 4040){
	        		var cvn = ao.isSuperApp ? 4040 : 4030;
	        		if(vn >= cvn){
	        			validApp = true;
	        		}
	        	}
	        	
	        	// 안드로이드 버전 체크
	        	if(ao.isAndroid && vn >= 407){
	        		validApp = true;
	        	}
			}
			
			if(validApp){
				// APP
				$timeout(function(){
					window.location.href = "myfeed://getRecentSearchApp";
				}, 200);
			}else{
				// WEB
				loadSearchRecom("");
			}
			/*$scope.checkLoading(true);
			
			var keyword = "";
			try{
				var words = getRecentSearchApp();
				var arr = words.split(",");
				keyword = arr[0];
			}catch(e){}
			
			MyFeedService.loadSearchRecom(keyword).then(function(data){
				LotteConsole.traceObj(data, '8 SearchRecom success', 'green');
				if(!data || !data.data || !data.data.goods_list_1 || !data.data.goods_list_1.prdList || !data.data.goods_list_1.prdList.items
						|| data.data.goods_list_1.prdList.items.length == 0)	return;
				$scope.searchList = data;
			}).catch(function(error){
				console.log('8 SearchRecom error ', error);
			}).finally(function(){
				$scope.checkLoading();
			});*/
		};
		
		/**
		 * 앱에서 최신 검색어 받아오기
		 * @param {String} words - 검색어를 ","로 연결한 문자열
		 */
		function setRecentSearchApp(words){
			if(typeof(words) != "string"){
				loadSearchRecom();
				return;
			}
			
			try{
				var arr = words.split(",");
				var keyword = arr[0];
				loadSearchRecom(keyword);
			}catch(e){}
		};
		window.setRecentSearchApp = setRecentSearchApp;

		/**
		 * 검색 상품 데이터 로드하기
		 * @param {String} keyword - 최근 검색어
		 */
		function loadSearchRecom(keyword){
			$scope.checkLoading(true);
			
			MyFeedService.loadSearchRecom(keyword).then(function(data){
				//LotteConsole.traceObj(data, '8 SearchRecom success', 'green');
				if(!data || !data.data || !data.data.goods_list_1 || !data.data.goods_list_1.prdList || !data.data.goods_list_1.prdList.items
						|| data.data.goods_list_1.prdList.items.length == 0)	return;
				$scope.searchList = data;
			}).catch(function(error){
				console.log('8 SearchRecom error ', error);
			}).finally(function(){
				$scope.checkLoading();
			});
		};
		
		/**
		 * 카테고리 상품 가져오기
		 */
		$scope.callCategory = function(){
			$scope.checkLoading(true);
			MyFeedService.loadCategory().then(function(data){
				//LotteConsole.traceObj(data, '9 Category success', 'green');
				if(!data || !data.data)	return;
				$scope.categoryList = data.data;
			}).catch(function(error){
				console.log('9 Category error ', error);
			}).finally(function(){
				$scope.checkLoading();
			});
		};
		
		/**
		 * 맞춤 추천 상품 DS 로드
		 */
		function callCustomRecomDS(){
			if(!$scope.loginInfo.isLogin){ return; }
			
			// http://analyticsdevapi.lotte.com/recomm?mbrNo=0017210696 (테스트용 mbrno=0012743769, 0012133892, 0000007998 등)
			// https://analyticsapi.lotte.com/recomm?mbrNo=0012743769
			/////////////////////////////////////////////////////////////////////////////////
			var url = "//analyticsapi.lotte.com/recomm?mbrNo=" + $scope.loginInfo.mbrNo;
			/////////////////////////////////////////////////////////////////////////////////
			$.ajax({
				type: 'post'
				, async: true
				, url: url
				, dataType  : "jsonp"
				, success: function(data) {
					if(data && data.results){
						var arrTemp = data.results;
						arrTemp = $filter('orderBy')(arrTemp, 'rank', false);
						//console.log(arrTemp);
						var arr = [];
						var len = arrTemp.length;
						for(var i=0; i<len; i++){
							arr.push(arrTemp[i].itemId);
						}
						callCustomRecomProd(arr);
					}
				}
				, error: function(data, status, err) {
					//$scope.favoriteBrand.relBrands = 0;
					console.warn("analyticsdevapi/recomm error " + data)
				}
			});
		};
		
		/**
		 * 맞춤 추천 상품 데이터 로드
		 * @returns
		 */
		function callCustomRecomProd(arr){
			if( !angular.isArray(arr) || arr.length == 0){
				console.warn("analyticsdevapi/recomm empty", $scope.favoriteBrand.curBrand.brdNo);
				return;
			}
			//http://m.lotte.com/json/mylotte/ds_recomm_prd_list.json?goods_list=상품번호1,상품번호2,상품번호3....(DS 추천 상품번호)
			var url = "/json/mylotte/ds_recomm_prd_list.json?goods_list=" + arr.join(",");
			$http.get(url)
			.success(function(data){
				if(data && data.data && data.data.prdList && data.data.prdList.items){
					$scope.customRecomProd.origin = data.data.prdList.items;
					$scope.customRecomProd.page = 0;
					$scope.customRecomProd.limit = 0;
					$scope.customRecomProd.total = Math.ceil($scope.customRecomProd.origin.length / $scope.customRecomProd.size);
					
					$scope.customRecomProdPaging();

					//$scope.customRecomProd.origin = [];
					
					/*if(data.data.prdList.items.length > 6){
						data.data.prdList.items.length = 6;
					}
					$scope.favoriteBrand.prodList = data.data.prdList.items;*/
				}else{
					console.warn("ds_recomm_prd_list empty " + data);
				}
			})
			.error(function(data){
				console.warn("ds_recomm_prd_list error " + data);
			});
		};
		
		/**
		 * 맞춤 추천 상품 페이징 처리
		 * @returns
		 */
		$scope.customRecomProdPaging = function(){
			var p = $scope.customRecomProd;
			if(p.page < p.total){
				p.page ++;
			}else{
				return;
			}
			
			p.limit = Math.min(p.size * p.page, p.origin.length);
		};
		
		
		/**
		 * 최초 실행 함수
		 */
		function startAppData(){
			var ssData = LotteStorage.getSessionStorage("lotteMyFeedData", 'json') || null;
			if(location.host == "localhost"){ ssData = null; }
			
			MyFeedService.setLoginInfo($scope.loginInfo);
			
			if($scope.locationHistoryBack && ssData && !LotteCommon.isTestFlag){
				if(ssData.recently){
					$scope.recently = ssData.recently;
				}
				if(ssData.recentlyRecom){
					$scope.recentlyRecom = ssData.recentlyRecom;
				}
				if(ssData.recentlyPlan){
					$scope.recentlyPlan = ssData.recentlyPlan;
				}
				if(ssData.orderRecom){
					$scope.orderRecom = ssData.orderRecom;
				}
				if(ssData.pushProducts){
					$scope.pushProducts = ssData.pushProducts;
				}
				if(ssData.wishes){
					$scope.wishes = ssData.wishes;
				}
				if(ssData.wishesRecom){
					$scope.wishesRecom = ssData.wishesRecom;
				}
				if(ssData.searchList){
					$scope.searchList = ssData.searchList;
				}
				if(ssData.categoryList){
					$scope.categoryList = ssData.categoryList;
				}
				$scope.callStatus = objStatus.load_3;
				// 카드 데이타 조회
				$scope.callCardData();
				// 브랜드 데이타 조회
				$scope.callBrandData();
				
				if(ssData.customRecomProd && ssData.customRecomProd.origin && ssData.customRecomProd.origin.length > 0){
					$scope.customRecomProd = ssData.customRecomProd;
				}else{
					callCustomRecomDS();
				}
			}else{
				// 최근 본 상품
				var latelyGoods = LotteStorage.getLocalStorage('latelyGoods') || '';
				var arrLatelyTemp = latelyGoods.split('|');
				if(!latelyGoods){
					$scope.recently.hasLately = 'N';
					//angular.element('.recently_wrap').hide();
				}
				try{
					$scope.latelyGoods = arrLatelyTemp.join(',');
				}catch(e){}
				$scope.callRecentlyInit($scope.latelyGoods);
				// 구매 데이타 조회
				if($scope.loginInfo.isLogin)	$scope.callOrderData();
			}
			// 페이지 벗어날때에 모델 저장
			angular.element($window).on("unload", function(e) {
				var obj = {};
				obj.recently = $scope.recently;
				obj.recentlyRecom = $scope.recentlyRecom;
				obj.recentlyPlan = $scope.recentlyPlan;
				obj.orderRecom = $scope.orderRecom;
				obj.pushProducts = $scope.pushProducts;
				obj.wishes = $scope.wishes;
				obj.wishesRecom = $scope.wishesRecom;
				obj.searchList = $scope.searchList;
				obj.categoryList = $scope.categoryList;
				obj.customRecomProd = $scope.customRecomProd;
				LotteStorage.setSessionStorage("lotteMyFeedData", obj, "json");
	        });
		}
		LotteUserService.promiseLoginInfo().then(function(loginInfo){
			$scope.loginInfo = loginInfo;
			//LotteConsole.warn($scope.loginInfo);
			startAppData();
			$scope.subTitle = ($scope.loginInfo.isLogin ? $scope.loginInfo.name : '고객') + "님을 위한 맞춤쇼핑"; //서브헤더 타이틀 20181204 수정
		}).catch(function(loginInfo){
			$scope.loginInfo = loginInfo;
			//LotteConsole.info($scope.loginInfo);
			startAppData();
			$scope.subTitle = ($scope.loginInfo.isLogin ? $scope.loginInfo.name : '고객') + "님을 위한 맞춤쇼핑"; //서브헤더 타이틀 20181204 수정
		});
		
		$scope.addZero = function(v, d){
			if(d === 3){
				if(v < 10){
					v = "00" + v;
				}else if(v < 100){
					v = "0" + v;
				}
			}else{
				if(v < 10){
					v = "0" + v;
				}
			}
            return v;
        };
        

		/**
		 * 위시리스트 답기
		 * @param {Object} item - 상품 오브젝트
		 * @param {Number} idx - 인덱스 번호
		 */
		$scope.addWishList = function(item, idx){
			//$scope.ga("추천상품_위시리스트", "상품_" + idx);
			
			if(!$scope.loginInfo.isLogin) { 
				$scope.alert_2016("로그인 후 이용하실 수 있습니다.", {callback : function(){
					$scope.gotoService("loginUrl", {targetUrl : encodeURIComponent(location.href)});
				}});
				return false;
			}
			
			if(item.wishAdded){
				$scope.alert_2016("이미 등록된 상품입니다.");
				return false;
			}
			
			
			$http({
				method: 'POST',
				url: LotteCommon.prdAddWish,
				data: { "goods_nos" : item.goodsNo },
				transformRequest: LotteForm.JsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				item.wishAdded = true;
			})
			.error(function (ex) {
				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;
					
					switch(errorCode){
					case "5002":// 이미 등록된 상품 ==> 알러트 없이 선택 적용
						item.wishAdded = true;
						break;
					case "9003":
						$scope.alert_2016(errorMsg, {"callback":function(){
							var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8'); 
							location.href = '/login/m/loginForm.do?' + targUrl;
						}});
						break;
					default:
						$scope.alert_2016(errorMsg);
						break;
					}
				} else {
					$scope.alert_2016('처리중 오류가 발생하였습니다.');
				}
			});
		};
        
        
        /**
         * 앱 버전 체크
         */
        function checkAppVer(){
        	var ao = $scope.appObj;
        	var vn = ao.verNumber;
        	
        	// 웹 허용
        	if(!ao.isApp){
        		return true;
        	}
        	
        	// 구버전 iOS 앱 제한
        	if(ao.isIOS){// && vn < 4040){
        		var cvn = $scope.appObj.isSuperApp ? 4040 : 4030;
        		if(vn < cvn){
        			return false;
        		}
        	}
        	
        	// 구버전 안드로이드 앱 제한
        	if(ao.isAndroid && vn < 407){
        		return false;
        	}
        	
        	return true;
        };
        $scope.isAvailApp = checkAppVer();
        
    }]);
    
    app.filter('pushDate', function() {
		return function(date) {
			var arr = date.split(' ');
			var myDate = new Date(arr[0]);
			var str = myDate.getFullYear() + "." + (myDate.getMonth() + 1) + "." + myDate.getDate();
			return str;
		}
	});

	app.filter('delDot', function() {
		return function(data) {
			var arr = data.split("...");
			return arr[0];
		}
	});

    app.directive('lotteContainer', ['LotteCommon', 'LotteUtil', 'LotteStorage', 'LotteGA', '$window', '$timeout', '$http',
                             function(LotteCommon,   LotteUtil,   LotteStorage,   LotteGA,   $window,   $timeout,   $http) {
        return {
            templateUrl : '/lotte/resources_dev/myfeed/myfeed_container.html',
            replace : true,
            link : function(scope, el, attrs) {
            	
            	var $scope = angular.element(document.body).scope();
            	
            	var $win = angular.element($window);
				$win.scroll(function() {
					if($win.scrollTop() + $win.height() > angular.element(document).height() - angular.element('#footer').height()) {
						$scope.scrollBottomCall();
						$scope.customRecomProdPaging();
					}
				});
				

            	/**
        		 * Google Analytics
        		 */
        		$scope.ga = function(act, lab, cd53){
        			LotteGA.evtTag($scope.gaCate, act, lab, cd53);
        		};
        		
				
            	// 로그인
        		scope.goLoginClick = function() {
        			$scope.ga("로그인하기");
        			var targUrl = "&tclick=" + scope.tclickPrefix + "Login_Clk_Btn01&targetUrl=" + encodeURIComponent(LotteCommon.baseUrl + LotteCommon.myfeedUrl + "?" + scope.baseParam, 'UTF-8');
        			$window.location.href = LotteCommon.loginUrl+"?"+scope.baseParam+targUrl;
        		};
        		
                scope.swipeComplete = function(idx){
                	scope.swipeCurIdx = idx;
                	angular.element('.recently_wrap .swipe_wrap > ul > li').removeClass('on');
					angular.element('.recently_wrap .swipe_wrap > ul > li.item'+idx).addClass('on');
                	var strTemp = '';
					for(var i = 0; i<scope.recently.items[idx].length; i++){
						strTemp += (i > 0 ? ',' : '') + scope.recently.items[idx][i].goodsNo;
					}
					scope.callRecentlyData(strTemp);
					scope.sendTclick(scope.tclickPrefix + "RctView_Swp_Unit" + scope.addZero(idx+1));
					$scope.ga("최근본상품_스와이프", scope.addZero(idx+1));
				};
				scope.wishSwipeComplete = function(idx){
					scope.wishSwipeCurIdx = idx;
					angular.element('.wish_wrap .swipe_wrap > ul > li').removeClass('on');
					angular.element('.wish_wrap .swipe_wrap > ul > li.wish'+idx).addClass('on');
					scope.callWishRecom(scope.wishes.items[scope.wishSwipeCurIdx].goodsNo);
					scope.sendTclick(scope.tclickPrefix + "Pick_Swp_Unit" + scope.addZero(idx+1));
					$scope.ga("혹시잊지않으셨나요_스와이프", scope.addZero(idx+1));
                };
                
                scope.cardSwipeComplete = function(idx){
                	angular.element('.card_wrap .indicator li').removeClass('on');
                	angular.element(angular.element('.card_wrap .indicator li')[idx]).addClass('on');
                };
				
				function addZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
					return num < 10 ? "0" + num : num + "";
				}

                scope.setCardTime = function(str){
					var arr = str.split(':');
					var hour = parseInt(arr[0], 10);
					var min = parseInt(arr[1], 10);
					var sec = parseInt(arr[2], 10);

					if(hour == 0 && min == 0 && sec == 0){
						return '00:00:00';
					}

                	if(sec && sec > 0){
                		sec = sec - 1;
                	}else if(sec == 0){
						if(min && min > 0){
							min = min - 1;
							sec = 59;
						}else if(min == 0){
							if(hour && hour > 0){
								hour = hour - 1;
								min = 59;
								sec = 59;
							}
						}
					}
					return addZero(hour) + ":" + addZero(min) + ":" + addZero(sec);
				};
				
				scope.goProductView = function(goodsNo, tclick, sctCd, mParam){
					var addParam = '';

					if(tclick.indexOf("RctView_Clk_Prd") >= 0){
						$scope.ga("최근본상품_클릭", tclick.substring(16), goodsNo);
					}else if(tclick.indexOf("RctView_Clk_Rel") >= 0){
						$scope.ga("이런상품은어떠세요", tclick.substring(16), goodsNo);
					}else if(tclick.indexOf("RelCodi_Clk_Prd") >= 0){
						$scope.ga("함께구매하면좋아요_근간상품", tclick.substring(16, 17), goodsNo);
					}else if(tclick.indexOf("RelCodi_Swp_Rel") >= 0){
						$scope.ga("함께구매하면좋아요_추천상품", tclick.substring(16), goodsNo);
					}else if(tclick.indexOf("SmartPush_Clk_Prd") >= 0){
						$scope.ga("놓치면후회하는최신정보", tclick.substring(17), goodsNo);
					}else if(tclick.indexOf("Pick_Swp_Prd") >= 0){
						$scope.ga("혹시잊지않으셨나요_클릭", tclick.substring(13), goodsNo);
					}else if(tclick.indexOf("Pick_Clk_Rel") >= 0){
						$scope.ga("다른고객들이함께본상품", tclick.substring(13), goodsNo);
					}else if(tclick.indexOf("PreBrd_Clk_Prd") >= 0){
						$scope.ga("관심있는브랜드인기상품_추천상품", tclick.substring(15), goodsNo);
						addParam = '&_reco=M_brand_myreco';
					}else if(tclick.indexOf("BkBrd_Clk_Prd") >= 0){
						$scope.ga("즐겨찾는브랜드의신상품_추천상품", tclick.substring(14), goodsNo);
					}else if(tclick.indexOf("PreBrdReco_Clk_Prd") >= 0){
						$scope.ga("이브랜드관심있으시죠_상품", tclick.substring(19), goodsNo);
					}else if(tclick.indexOf("BrdReco_Swp_Prd") >= 0){
						$scope.ga("이브랜드관심있으시죠_상품", tclick.substring(16), goodsNo);
					}else if(tclick.indexOf("SchReco_Clk_Prd") >= 0){
						$scope.ga("검색어기반추천", tclick.substring(16), goodsNo);
					}else if(tclick.indexOf("BestPrd_Swp_Prd") >= 0){
						$scope.ga("성별연령기반추천", tclick.substring(15), goodsNo);
					}else if(tclick.indexOf("PrdReco_Clk_Rel") >= 0){
						$scope.ga("맞춤추천상품", tclick.substring(16), goodsNo);
					}
					
					var tcbase = scope.tclickPrefix;
					if(!goodsNo)	return;
					window.location.href = LotteCommon.productviewUrl + '?' + scope.baseParam + '&goods_no=' + goodsNo + "&curDispNo=5589895" + ( sctCd ? "&curDispNoSctCd=" + sctCd : "" ) + ( mParam ? "&_reco=" + mParam : "" ) +"&tclick=" + tcbase + tclick + addParam;
				};

				scope.goPlanView = function(url, idx, mParam){
					var evtNo = "";
					try{
						//evtNo = url.match(/(?<=curDispNo=)\d+/)[0];
						evtNo = url.split("curDispNo=")[1].split("&")[0];
					}catch(e){}
					$scope.ga("함께많이본기획전", $scope.arrAlpha[$scope.swipeCurIdx] + addZero(idx + 1), evtNo);
					window.location.href = url + '&' + scope.baseParam + ( mParam ? "&_reco=" + mParam : "" ) + '&tclick=' + scope.tclickPrefix + 'RctView_Swp_Ban_' + $scope.arrAlpha[$scope.swipeCurIdx] + addZero(idx + 1);
				};
				
				function getAge(age){
					var result = 'A';
					if(!age)	return result;
					if(age > 0 && age < 20)	return '20';
					if(age >= 60)	return '50';
					try{
						result = Math.floor(age/10) * 10;
					}catch(e){}
					return result;
				}

				scope.goMain = function(dispNo, type, tclick, idx){
					if(tclick.indexOf("Event_Swp_Ban") >= 0){
						$scope.ga("카드배너", addZero(idx + 1));
					}else if(tclick == "BkBrd_Clk_Btn01"){
						$scope.ga("즐겨찾는브랜드더보기");
					}else if(tclick == "BestPrd_Clk_Btn01"){
						$scope.ga("성별연령기반추천", "베스트상품더보기");
					}
					console.log(tclick)
					
					$scope.clearSessionStorage();
					var linkUrl = LotteCommon.mainUrl + '?' + scope.baseParam + '&dispNo=' + dispNo + '&tclick=' + scope.tclickPrefix + tclick;
					if(type == 'card'){
						linkUrl += addZero(idx + 1);
						linkUrl += '&prom=true';
						linkUrl += "&isFromMyFeed=true";
					}else if(type == 'category'){
						if($scope.loginInfo.genSctCd){
							linkUrl += '&gender=' + $scope.loginInfo.genSctCd;
						}
						if($scope.loginInfo.mbrAge){
							linkUrl += '&age=' + getAge($scope.loginInfo.mbrAge);
						}
						linkUrl += "&isFromMyFeed=true";
					}
					
					$window.location.href = linkUrl;
				};
				
				scope.goCardEvent = function(evt_no, idx){
					$scope.ga("카드배너", addZero(idx + 1));
					window.location.href = LotteCommon.eventSaunMain + '?' + scope.baseParam + '&evt_no=' + evt_no + '&tclick=' + scope.tclickPrefix + 'Event_Swp_Ban' + addZero(idx + 1);
				};
				
				// showAppConfig(): native 설정 화면
				scope.showAppConfig = function() {
					scope.sendTclick(scope.tclickPrefix + "SmartPush_Btn01");
					$scope.ga("놓치면후회하는최신정보", "재입고/할인소식알림받기");

					if (LotteUtil.boolAndroid(navigator.userAgent)) { // 안드로이드
						window.lottebridge.opensetting('on');
					} else if (LotteUtil.boolAppInstall(navigator.userAgent)) { // IOS
						location.href = 'lottebridge://opensetting';
					}
				};
				
				scope.goBrandShop = function(upBrdNo, tclick){
					if(tclick == "PreBrd_Clk_Brdname"){
						$scope.ga("관심있는브랜드인기상품_브랜드명", "", upBrdNo);
					}else if(tclick == "PreBrd_Clk_Brd_more"){
						$scope.ga("관심있는브랜드인기상품_더보기", "", upBrdNo);
					}else if(tclick.indexOf("BkBrd_Clk_Brd") >= 0){
						if(tclick.indexOf("more") >= 0){
							$scope.ga("즐겨찾는브랜드의신상품_더보기", tclick.substring(14, 15), upBrdNo);
						}else{
							$scope.ga("즐겨찾는브랜드의신상품_브랜드명", tclick.substring(14, 15), upBrdNo);
						}
					}else if(tclick.indexOf("PreBrdReco_Clk") >= 0){
						if(tclick.indexOf("more") >= 0){
							$scope.ga("이브랜드관심있으시죠_상품더보기", tclick.substring(15, 16), upBrdNo);
						}else{
							$scope.ga("이브랜드관심있으시죠_기준브랜드", "", upBrdNo);
						}
					}else if(tclick.indexOf("BrdReco_Swp") >= 0){
						$scope.ga("이브랜드관심있으시죠_상품더보기", tclick.substring(12, 13), upBrdNo);
					}
					var tcbase = scope.tclickPrefix;
					window.location.href = LotteCommon.brandShopSubUrl + '?' + scope.baseParam + '&upBrdNo=' + upBrdNo + '&tclick=' + tcbase + tclick;
				};

				scope.brandClick = function(url, tclick){
					var upBrdNo = "";
					try{
						//upBrdNo = url.match(/(?<=(upBrdNo=))\d+/)[0];
						upBrdNo = url.split("upBrdNo=")[1].split("&")[0];
					}catch(e){}
					if(tclick.indexOf("PreBrdReco_Clk_Brd") >= 0){
						$scope.ga("이브랜드관심있으시죠_브랜드", tclick.substring(19), upBrdNo);
					}else if(tclick.indexOf("BrdReco_Clk_Brd") >= 0){
						$scope.ga("이브랜드관심있으시죠_브랜드", tclick.substring(16), upBrdNo);
					}
					var tcbase = scope.tclickPrefix;
					window.location.href = url + '?' + scope.baseParam + '&tclick=' + tcbase + tclick + '&_reco=M_brand_detail_myreco';
				};

				scope.brandBookMark = function(brdNo, brdNm, $event, index) {
					if (!scope.loginInfo.isLogin) { /*로그인 안한 경우*/
						alert('로그인 후 이용하실 수 있습니다.');
						scope.loginProc(); /*go Login*/
						return false;
					} else {
						if(angular.element('.myfeed .brand_wrap').hasClass('pending'))	return;
						angular.element('.myfeed .brand_wrap').addClass('pending');

						var $el = angular.element($event.currentTarget);
						var isDel = $el.parents('li.item').hasClass('on');
						var jsonUrl = LotteCommon.myBrandInfo + "?flag=" + (isDel ? "d" : "i") + "&brnd_no="+brdNo;
						var httpConfig = {
							method: "get",
							url: jsonUrl
						};
						scope.checkLoading(true);
						$http(httpConfig)
						.success(function (data) {
							if(!isDel) {
								$el.parents('li.item').addClass('on');
								scope.showAlertPop(brdNm +' 브랜드가 즐겨찾기에 추가되었습니다.');
							} else {
								$el.parents('li.item').removeClass('on');
								scope.showAlertPop(brdNm +' 브랜드가 즐겨찾기에서 삭제되었습니다.');
							}
						})
						.finally(function () {
							angular.element('.myfeed .brand_wrap').removeClass('pending');
							$scope.checkLoading();
						});
					}
					
					$scope.ga("이브랜드관심있으시죠_즐겨찾기", scope.arrAlpha[index], brdNo);
					scope.sendTclick(scope.tclickPrefix + 'BrdReco_Clk_Btn' + scope.arrAlpha[index]);
				};

				scope.showAlertPop = function (msg) {
					var alertPop = angular.element('.header_alert_pop');
					alertPop.find('.msg').text(msg); // 메시지 표시
					alertPop.fadeIn(500,function(){
						$timeout(function(){
							alertPop.fadeOut(500);
						},1000);
					});
				};
            }
        };
    }]);
})(window, window.angular);