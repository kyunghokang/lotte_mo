(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'ngRoute',
		'angular-carousel',
		'angularGrid',
		'lotteSns'
	]);
	
	app.controller('DeptLiveCtrl', ['$scope', '$http', 'LotteCommon', 'commInitData', '$location', 'angularGridInstance', 'LotteStorage', 
		function($scope, $http, LotteCommon, commInitData, $location, angularGridInstance, LotteStorage) {
		if (commInitData.query.detailCode && commInitData.query.detailCode != "") {
			location.href = LotteCommon.deptLiveShopUrl + "#/" +commInitData.query.detailCode;
		}
		
		$scope.subTitle = "백화점 라이브"; //서브헤더 타이틀
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.isShowThisSns = true; /*공유버튼*/

		$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png"; // 공유하기 이미지 URL
		$scope.share_url = LotteCommon.deptLiveShopUrl;
		
		$scope.mainData = "";
		$scope.subData = "";
		$scope.detailData = "";        
		$scope.mainIndex = 0; //0~4
		$scope.menuAr = [0,1,2,3,4];
		$scope.pageSub = 1;
		$scope.scrollSub = 0;
		$scope.loadFlag = true;
		$scope.curDispNo = "";
		$scope.subList;
		$scope.totalNum = 0;
		$scope.screen = 1;

		// 티클릭 데이타 20151005
		$scope.tclickInfo = ["main_banner", "m_live_main_category0", "main_brand", "m_live_product_video", "m_live_product_contact", "m_live_product_purchase", "m_live_product_list_brand", "sub_banner"];
				
		// 메인 데이터 로드
		$scope.loadMainData = function () {
			//sub 초기화 
			$scope.subData = "";
			$scope.totalNum = 0;
			$scope.detailData = "";
			$scope.subList = "";
			$("#player").html("");
			$scope.vodFlag = false;

			$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png"; // 공유하기 이미지 URL (로고로 변경해야함)
			$scope.share_url = LotteCommon.deptLiveShopUrl;
			
			$scope.screen = 1; 
			$scope.subTitle = "백화점 라이브"; //서브헤더 타이틀

			if ($scope.mainData == "") {
				$http.get($scope.getParam(1))
				.success(function (data) {
					 $scope.mainData = data.deptLive_main;
					 $scope.main_prdList = [$scope.mainData.prdList1, $scope.mainData.prdList2, $scope.mainData.prdList3, $scope.mainData.prdList4];
					 $scope.pageScrollTo();
				})
				.error(function() {
					console.log('Data Error : main 데이터');
				});
			} else {
				$scope.pageScrollTo();
			}
		};

		//서브페이지로 이동 
		$scope.dLgoDetail = function (dispNo, goodNo, tclickStr, tstr2) {
			tstr2 = tstr2 + 1;

			if (tstr2 < 10) { 
				tstr2 = "0" + tstr2
			};

			$scope.sendTclick(tclickStr + tstr2);

			LotteStorage.setSessionStorage("dept_brand", dispNo);
			LotteStorage.setSessionStorage("dept_good", goodNo);

			$scope.scrollSub = 0;             
			location.href = "#/" + dispNo + "_" + goodNo;
		}

		//====================================================== sub =========================================                
		// 이미지 URL을 받아 리사이즈 처리 여부를 결정하여 리턴한다.
		$scope.getImgResizeUrl = function (imgPath, postfix) {
			if (!imgPath) {
				return "";
			}

			var rtnImgPath = imgPath + "";

			if (rtnImgPath.indexOf("http://live.lotte.com") > -1) {
				rtnImgPath = rtnImgPath + postfix;
			}
			return rtnImgPath;
		}

		//서브 데이터 로드
		$scope.loadSubData = function() {
			$scope.screen = 2;
			if ($scope.subData == "") {
				$scope.pageSub = 1;
				$http.get($scope.getParam(2))
				.success(function(data) {
					// http://live.lotte.com으로 들어왔을때만 리사이징 태그 추가
					if (data.brnd_goods && data.brnd_goods.prdList && data.brnd_goods.prdList.items && data.brnd_goods.prdList.items.length > 0) {
						var i = 0;

						for (i; i < data.brnd_goods.prdList.items.length; i++) {
							data.brnd_goods.prdList.items[i].imgUrl = $scope.getImgResizeUrl(data.brnd_goods.prdList.items[i].imgUrl, "/lotte/resize/320x320");
						}
					}

					$scope.subData = data.brnd_goods;
					$scope.subTitle = $scope.subData.subTitle;  
					$scope.totalNum = $scope.subData.prdList.total_count; 
					$scope.subList = $scope.subData.prdList.items;
					$scope.loadDetailData();
				})
				.error(function () {
					console.log('Data Error : sub list 데이터');
				});
			} else {
				//서브의 다른 상품보기 클릭하여 온 경우
				$scope.loadDetailData();
			}
		};
		
		//서브 추가 데이터 로드
		$scope.loadSubDataMore = function () {
			$scope.loadFlag = false;
			$scope.pageSub ++;
			$http.get($scope.getParam(2))
			.success(function (data) {
				// http://live.lotte.com으로 들어왔을때만 리사이징 태그 추가
				if (data.brnd_goods && data.brnd_goods.prdList && data.brnd_goods.prdList.items && data.brnd_goods.prdList.items.length > 0) {
					var i = 0;
					for (i; i < data.brnd_goods.prdList.items.length; i++) {
						data.brnd_goods.prdList.items[i].imgUrl = $scope.getImgResizeUrl(data.brnd_goods.prdList.items[i].imgUrl, "/lotte/resize/320x320");
					}
				}

				$scope.subList = $scope.subList.concat(data.brnd_goods.prdList.items);
				$scope.loadFlag = true;
			})
			.error(function () {
				console.log('Data More Error : 데이터');
			});
		};        
		
		//상세 데이터 로드
		$scope.loadDetailData = function() {
			$scope.brandNo = LotteStorage.getSessionStorage("dept_brand");
			$scope.detailNo = LotteStorage.getSessionStorage("dept_good");

			$http.get($scope.getParam(3))
			.success(function (data) {
				// http://live.lotte.com으로 들어왔을때만 리사이징 태그 추가
				if (data.goods && data.goods.imgList && data.goods.imgList.length > 0) {
					var i = 0;
					for (i; i < data.goods.imgList.length; i++) {
						data.goods.imgList[i] = $scope.getImgResizeUrl(data.goods.imgList[i], "/lotte/resize/640x640");
					}
				}

				$scope.detailData = data.goods;                                                                                        
				$scope.commentStr = $scope.detailData.comment.replace(/\n/g,"<br>");
				$("html, body").animate({scrollTop:0},300, function () {
					if ($(window).width() >= 768) {
						$(".baseImage").show();
						$(".baseInfo").show();                        
					} else {
						$(".baseImage").slideDown(300);
						$(".baseInfo").slideDown(300);
					}
				});

				// SNS 공유를 위한 이미지, URL 세팅 (타이틀은 서브타이틀 가져감)
				if ($scope.detailData.imgList && $scope.detailData.imgList.length > 0) {
					$scope.share_img = ($scope.detailData.imgList[0] + "").replace("/lotte/resize/640x640", ""); // 공유하기 이미지 URL
				} else {
					$scope.share_img = "http://image.lotte.com/lotte/mobile/common/share_img2016_v2.png"; // 공유하기 이미지 URL
				}

				$scope.share_url = LotteCommon.deptLiveShopUrl + "?detailCode=" + $scope.brandNo + "_" + $scope.detailNo;
			})
			.error(function () {
				console.log('Data Error : Detail 데이터');
			});
		};
		
		// 문의하기
		$scope.dLask = function () {
			var minH = 10,
				minM = 30,
				maxH = 20, //10:30 ~ 20:00
				date = new Date(),
				dhour = date.getHours(),
				dmin = date.getMinutes(),
				dflag = false;

			// $scope.sendTclick($scope.tclickInfo[4]);
			if (dhour == minH){
				if (dmin >= minM) {
					dflag = true;
				}
			} else if (dhour > minH && dhour < maxH) {
				dflag = true;
			}
			
			$scope.sendTclick($scope.tclickInfo[4]);

			if (dflag) {
				setTimeout(function () {
					location.href="tel:" + $scope.detailData.phoneNm;    
				}, 500);
			} else {
				alert("지금은 백화점 오픈시간이 아닙니다.");
			}
		};

		//사러가기 
		$scope.dLbuy = function () {
			location.href= "/product/m/product_view.do?" + $scope.baseParam + "&goods_no=" + $scope.detailData.detailid + "&tclick=" + $scope.tclickInfo[5];
		};

		// 동영상보기
		$scope.vodFlag = false;

		$scope.vodView = function () {
			$scope.sendTclick($scope.tclickInfo[3]);
			$scope.vodFlag = true;
			$('html, body').animate({scrollTop:0}, 100);
			onYouTubeReady();
		};
		
		//동영상 닫기
		$scope.closeVodBox = function () {
			player.stopVideo();
			$scope.vodFlag = false;                 
		};

		$scope.otherDetail = function (brandNo, goodsNo) {
			$scope.sendTclick($scope.tclickInfo[6] + brandNo);
			$scope.scrollSub = 0;  
			
			location.href = "#/" + brandNo + "_" + goodsNo;
		};

		// 뷰카운트 : 999 처리
		$scope.viewRateFnc = function (value) {
			if (value >= 1000) {
				value = "999+";
			}

			return value;
		};

		$scope.refresh = function () {
			angularGridInstance.gallery.refresh();
		};

		var $win = $(window),
			$el = $(".ng-scope");

		$win.on({
			"scroll" : function () {
				if ($scope.subList != undefined && $scope.screen == 2) {
					if ($el.offset().top + $el.outerHeight() + 221 < $win.scrollTop() + $win.height() * 3
						&& $scope.loadFlag && $scope.subList.length < $scope.totalNum) {
						$scope.loadSubDataMore();
					}
				}
			}
		});

		// 데이터 링크 
		$scope.getParam = function (id) { //1 main, 2 sub, 3 detail
			var returnParam = "";

			if (id == 1) {
				returnParam = LotteCommon.deptLiveMainData + "?dispNo=5542569&" + $scope.baseParam;
			} else if (id == 2) {
				$scope.brandNo = LotteStorage.getSessionStorage("dept_brand");
				returnParam = LotteCommon.deptLiveSubData + "?dispNo=5542569&" + $scope.baseParam +"&brandNo=" + $scope.brandNo +"&page=" + $scope.pageSub + "$order=" + $scope.orderSub;
			} else if (id == 3) {
				$scope.detailNo = LotteStorage.getSessionStorage("dept_good");
				returnParam = LotteCommon.deptLiveDetailData + "?" + $scope.baseParam +"&goodsNo=" + $scope.detailNo;
			}

			return returnParam;
		};

		$scope.bannerTclick = function (link, id) {
		   location.href = link + (link.indexOf("?") >= 0?"&":"?") + $scope.baseParam;// + "&tclick=" + $scope.tclickInfo[id];
		};

		$scope.pageScrollTo = function() {
			var topPos = 0;
			if ($scope.screen == 1) {
				topPos = $scope.scrollMain;
			} else if ($scope.screen == 2) {
				topPos = $scope.scrollSub;
			}

			$(window).scrollTop(topPos);
		}      
	}]);

	//배열에서 파라매터 개수만큼 뽑아오는 필터     
	app.filter('number6Filter', function(){
		return function(data, param){
			var filtered=[];
			if(data != undefined){
				for(var i=0;i<param && i<data.length;i++){
					filtered.push(data[i]);
				}
			}
			return filtered;
		}
	});
	
	// Route용 Controller
	app.controller('deptLivePage', ['$scope', '$http', '$location', '$routeParams', 'LotteStorage', function($scope, $http, $location, $routeParams, LotteStorage) {
		if ($location.$$path == "/") {
			 $scope.loadMainData();
		} else if ($location.$$path == "/floor0") {
			 $scope.mainIndex = 0;
			 $scope.sendTclick($scope.tclickInfo[1] + $scope.mainIndex);//20151005
			 $scope.loadMainData(); 
		} else if ($location.$$path == "/floor1") {
			 $scope.mainIndex = 1;
			 $scope.sendTclick($scope.tclickInfo[1] + $scope.mainIndex);//20151005
			 $scope.loadMainData(); 
		} else if ($location.$$path == "/floor2") {
			 $scope.mainIndex = 2;
			 $scope.sendTclick($scope.tclickInfo[1] + $scope.mainIndex);//20151005
			 $scope.loadMainData(); 
		} else if ($location.$$path == "/floor3") {
			 $scope.mainIndex = 3;
			 $scope.sendTclick($scope.tclickInfo[1] + $scope.mainIndex);//20151005
			 $scope.loadMainData(); 
		} else if ($location.$$path == "/floor4") {
			 $scope.mainIndex = 4;
			 $scope.sendTclick($scope.tclickInfo[1] + $scope.mainIndex);//20151005
			 $scope.loadMainData(); 
		} else {
			var params = ($routeParams.pageParams + "").split("_");

			if (params && params.length == 2) {
				LotteStorage.setSessionStorage("dept_brand", params[0]);
				LotteStorage.setSessionStorage("dept_good", params[1]);

				$scope.loadSubData();
			} else {
				$scope.loadMainData(); 
			}
		}
	}]);
	
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl : '/lotte/resources_dev/deptLive/deptLive_container.html',
			controller: 'deptLivePage',
			reloadOnSearch : false
		})
		.when('/floor0', {
			templateUrl : '/lotte/resources_dev/deptLive/deptLive_container.html',
			controller: 'deptLivePage',
			reloadOnSearch : false
		})                
		.when('/floor1', {
			templateUrl : '/lotte/resources_dev/deptLive/deptLive_container.html',
			controller: 'deptLivePage',
			reloadOnSearch : false
		})        
		.when('/floor2', {
			templateUrl : '/lotte/resources_dev/deptLive/deptLive_container.html',
			controller: 'deptLivePage',
			reloadOnSearch : false
		})        
		.when('/floor3', {
			templateUrl : '/lotte/resources_dev/deptLive/deptLive_container.html',
			controller: 'deptLivePage',
			reloadOnSearch : false
		})        
		.when('/floor4', {
			templateUrl : '/lotte/resources_dev/deptLive/deptLive_container.html',
			controller: 'deptLivePage',
			reloadOnSearch : false
		})        
		.when('/:pageParams', {
			templateUrl : '/lotte/resources_dev/deptLive/deptLive_detail.html',
			controller: 'deptLivePage',
			reloadOnSearch : false,
		})
		.otherwise({
			redirectTo:'/'
		});
	}]);
		
  
})(window, window.angular);