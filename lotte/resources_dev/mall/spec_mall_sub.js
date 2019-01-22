(function(window, angular, undefined) {
	'use strict';
	
	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		'lotteCommFooter',
		'lotteProduct',
		'specMallCate',
		'lotteSns'
	]);
	
	app.controller('SpecMallSubCtrl',
			['$scope', 'LotteCommon', 'commInitData',
			function($scope, LotteCommon, commInitData) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "";//서브헤더 타이틀
			
		//공유하기
		$scope.isShowThisSns = true;
		//$scope.planShopSns = true;
		//$scope.share_img = commInitData.query.img;

		$scope.kShopUI = {
			dispNo : commInitData.query.dispNo,
			pageSize : 30
		}
		$scope.addCls = "spec" + $scope.kShopUI.dispNo;
		$scope.loadingMore = false;
		$scope.subData = {};
		$scope.emptyData = false;
		$scope.screenID = ($scope.kShopUI.dispNo == '5617247') ? "SpeMall_MK_Sub_" : "SpeMall_Sub_"; // 스크린 아이디 세팅 수정
	}]);
	
	app.directive('lotteContainer',
			['$http', '$window', '$timeout', 'LotteCommon', 'LotteStorage', 'commInitData',
			function($http, $window, $timeout, LotteCommon, LotteStorage, commInitData){
		return {
			templateUrl : '/lotte/resources_dev/mall/spec_mall_sub_container.html',
			replace : true,
			link : function($scope, el, attrs){
				
				/**
				 * 디렉티브 시작하기
				 */
				function startOver(){
					if(history.state == null || history.state.name != "specmallsub"){
						history.replaceState({name:"specmallsub"}, "specmallsub");
						//console.warn("NEW VISIT");
						loadSubData();
						
					}else{
						//console.warn("REVISIT");
						var ss = LotteStorage.getSessionStorage("SS_specMallSub", "json");
						if(ss == undefined){
							//console.warn("NO SESSION");
							loadSubData();
							
						}else{
							//console.warn("USE SSION");
							try{
								$scope.subData = ss.subData;
								if($scope.subData.prdList.items.length > 0){
									angular.element($window).on("scroll", smsScrollListener);
								}
								
								setSpecSubLogo();
								
								$timeout(function(){
									if(ss.scrollY != angular.element($window).scrollTop()){
										$(window).scrollTop(ss.scrollY);
									}
								}, 200);
								
								LotteStorage.delSessionStorage("SS_specMallSub");
							}catch(e){
								loadSubData();
							}
						}
					}

					angular.element($window).on("unload", pageUnloadListener);
				};

				/**
				 * 페이지 unload시 세션 저장
				 */
				function pageUnloadListener(){
					var ss = {
            			scrollY	: angular.element($window).scrollTop(),
            			subData	: $scope.subData
					}
					LotteStorage.setSessionStorage("SS_specMallSub", ss, "json");
				};
				
				/**
				 * 데이터 로드하기
				 */
				function loadSubData(){
					var cd = commInitData.query.curDispNo;
					var c1 = commInitData.query.cate1;
					var c2 = commInitData.query.cate2;
					var c3 = commInitData.query.cate3;
					
					var param = {
						pageIdx : 1,
						rowsPerPage : 50000
					}
					if(c3 != undefined && c3 != ""){
						param.curDispNo = c3;
					}else if(c2 != undefined && c2 != ""){
						param.curDispNo = c2;
					}else if(c1 != undefined && c1 != ""){
						param.curDispNo = c1;
					}

					$http.get(LotteCommon.specMall2017Sub, {
						params: param
					})
					.success(loadSubDataSuccess);
				};

				/**
				 * 데이터 로드 성공
				 */
				function loadSubDataSuccess(data){
					$scope.subData = data.kShopSub;

					setSpecSubLogo();

					if($scope.subData.prdList == undefined || $scope.subData.prdList.items == undefined || $scope.subData.prdList.items.length == 0){
						$scope.emptyData = true;
						return;
					}

					$scope.subData.prodList = $scope.subData.prdList.items.splice(0, $scope.kShopUI.pageSize);
					if($scope.subData.prdList.items.length > 0){
						angular.element($window).on("scroll", smsScrollListener);
					}
				};
				
				/**
				 * 로고 세팅하기
				 */
				function setSpecSubLogo(){
					// 20171213
					if($scope.subData.logo != undefined ) {
						if($scope.subData.logo.img_url || $scope.subData.logo.imgUrl) {
							var addstyle = 'width:180px !important; height:25px !important; color:transparent !important; background:url('+($scope.subData.logo.img_url||$scope.subData.logo.imgUrl)+') center center no-repeat !important; background-size:auto 100% !important';
							document.styleSheets[0].addRule( '#head_sub h2 span span', addstyle );
						} else {
							var addstyle = 'width:180px !important; height:25px !important; color:#000 !important;';
							document.styleSheets[0].addRule( '#head_sub h2 span span', addstyle );
						}
					} else {
						var addstyle = 'width:180px !important; height:25px !important; color:#000 !important; ';
						document.styleSheets[0].addRule( '#head_sub h2 span span', addstyle );
					}
				};
				
				/**
				 * 리스트 페이징
				 */
				function loadMoreData(){
					$scope.loadingMore = true;
					
					var arr = $scope.subData.prdList.items.splice(0, $scope.kShopUI.pageSize);
					$scope.subData.prodList = $scope.subData.prodList.concat(arr);
					
					if($scope.subData.prdList.items.length <= 0){
						angular.element($window).off("scroll", smsScrollListener);
					}
					
					$timeout(function(){
						$scope.loadingMore = false;
					}, 100);
				};
				
				/**
				 * 스크롤 이벤트 설정
				 */
				function smsScrollListener(){
					if($scope.loadingMore){ return; }
					
					var $win = angular.element($window);
					var $body = angular.element("body");
					var winH = $win.height();
					var bodyH = $body[0].scrollHeight;
					var scrollRatio = ($win.width() >= 640) ? 2 : 4;

					if($win.scrollTop() + winH >= bodyH - (winH * scrollRatio)){
						loadMoreData();
					}
				};

				startOver();
				$scope.sssss = function(){}

                /**
                 * 20171027 전물몰 개선 ( 기:이선미, 개:박은영, 퍼:박해원  )
                 * 서브헤더 링크
                 */
                $scope.goKshopMain = function(){
                    if(!$scope.kShopUI.dispNo) return;
					var url = LotteCommon.specialMallUrl+"?"+baseParam+"&dispNo="+$scope.kShopUI.dispNo;
					
					// 20180611 마이클코어스 로고 티클릭 추가
					if($scope.kShopUI.dispNo == '5617246'){
						url += "&tclick=" + $scope.tClickBase + "SpeMall_MK_Logo";
					}
					
                    location.href = url;
                }
                var titleWatch = $scope.$watch( 'subTitle', function(res){
                    if(!res) return;
                    titleWatch();
                    $timeout(function(){
                        var subheadLink = angular.element("#head_sub h2 span.title");
                        subheadLink.attr('onclick','angular.element(this).scope().goKshopMain()');
					},400);
                })

            }
		};
	}]);

})(window, window.angular);