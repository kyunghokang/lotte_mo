(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter'
    ]);

    app.controller('BrandSearchCtrl', ['$window', '$http', '$timeout', '$scope', 'LotteCommon', 'LotteStorage', 'commInitData', '$location', 
    	function($window, $http, $timeout, $scope, LotteCommon, LotteStorage, commInitData,  $location) {
    	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.isShowBack = true;
        $scope.pageLoading = false;
        $scope.subTitle = "브랜드 검색/추가"; // 서브헤더 타이틀
        $scope.screenID = "brandSearch"; // 스크린 아이디 
      
        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
       			searchTab: 0,
        		keyword:"",
        		curKeyword: "",
        		curKeyIdx: "",
        		curEngKeyIdx: -1,
        		curKorKeyIdx: -1,
        		dataLoading: false
        	}
        	$scope.screenData = {
        		page: 0,
        		pageSize: 20,
        		pageEnd: false,
        		searchList: null,
        		myBrand: "",
        		myBrandList: {}
        	}
        })();
       
        $scope.keys = [['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],
			['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']];

        $scope.loadData = function(type){
        	if($scope.pageOptions.dataLoading) {
        		return;
        	}
			$scope.searchList = null; // 이전 검색리스트 삭제
			var jsonUrl, params;
			switch (type){
				case 'key':
					jsonUrl = LotteCommon.isTestFlag ?  "/json/brand/brandsearch.json" : LotteCommon.sideCtgBrandData;
					params = {btnIndex: $scope.pageOptions.curKeyIdx, tabIndex:$scope.pageOptions.searchTab};
					break;
				case 'keyword':
					jsonUrl = LotteCommon.isTestFlag ?  "/json/brand/brandsearch_keyword.json" : LotteCommon.sideCtgBrandSearch;
					params = {sch_nm: $scope.pageOptions.keyword};
					break;
			}
			var httpConfig = {
				method: "get",
				url: jsonUrl,
				params: params
			};
			
			$scope.pageLoading = true;
			
			$http(httpConfig)
			.success(function (data) {
				if(data.brandList) {
					$scope.screenData.searchList = {};
					$scope.screenData.searchList.items = [];
					for(var i=0;i < data.brandList.items.length;i++) {
						if($scope.screenData.myBrand.indexOf("|"+data.brandList.items[i].brdNo+"|") >= 0) {
							data.brandList.items[i].isMyBrand = true;
						} else {
							data.brandList.items[i].isMyBrand = false;
						}
						$scope.screenData.searchList.items[i] = data.brandList.items[i];
					}
				}
			})
			.finally(function () {
				$scope.pageLoading = false;
				$scope.pageOptions.dataLoading = false;
			});
		};


		/*
		파라미터값 정의 flag : 등록 (i), 삭제(d), 조회시 없음
		brnd_no : 등록,삭제할 브랜드번호
		등록,삭제 : http://m.lotte.com/json/main_new/my_brnd_info.json?flag=i&brnd_no=33143
		조회 : http://m.lotte.com/json/main_new/my_brnd_info.json
		*/
		$scope.getMyBrandInfo = function() {
			var jsonUrl = LotteCommon.isTestFlag ?  "/json/brand/my_brnd_info.json" : LotteCommon.myBrandInfo;
			var httpConfig = {
				method: "get",
				url: jsonUrl
			};
        	$scope.pageOptions.dataLoading = true;

			$http(httpConfig)
			.success(function (data) {
				if(data.data) {
					var mybrand = data.data
					if(!mybrand.isBestBrand) {
						if(mybrand.brndList) {
							for(var i=0;i < mybrand.brndList.items.length;i++) {
								$scope.screenData.myBrand += "|"+mybrand.brndList.items[i].brdNo+"|";
							}
						}
					}
				}
			})
			.finally(function () {
	        	$scope.pageOptions.dataLoading = false;
				$scope.getBestBrandInfo(); // 브랜드 찾기 페이지 진입 시 베스트브랜드 10개 노출
			});
		}

		$scope.getBestBrandInfo = function() {
			var jsonUrl = LotteCommon.isTestFlag ?  "/json/brand/best_brnd_info.json" : LotteCommon.bestBrandInfo;
			var httpConfig = {
				method: "get",
				url: jsonUrl
			};
			$scope.pageOptions.dataLoading = true;

			$http(httpConfig)
				.success(function (data) {
					if(data.data) {
						var bestBrand = data.data;
						$scope.screenData.searchList = {};
						$scope.screenData.searchList.items = [];
						for(var i=0;i < bestBrand.brndList.items.length;i++) {
							if($scope.screenData.myBrand.indexOf("|"+bestBrand.brndList.items[i].brdNo+"|") >= 0) {
								bestBrand.brndList.items[i].isMyBrand = true;
							} else {
								bestBrand.brndList.items[i].isMyBrand = false;
							}
							$scope.screenData.searchList.items[i] = bestBrand.brndList.items[i];
						}
					}
				})
				.finally(function () {
					$scope.pageOptions.dataLoading = false;
				});
		};

		// 세션에서 가저올 부분 선언
		var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
		var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
		var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');

		if(StoredLoc == window.location.href && $scope.locationHistoryBack) {
			var StoredData = JSON.parse(StoredDataStr);
			$scope.pageLoading = false;
			$scope.pageOptions = StoredData.pageOptions;
			$scope.screenData = StoredData.screenData;
			$timeout(function() {
				angular.element($window).scrollTop(StoredScrollY);
			},800);
		} else {
			$scope.getMyBrandInfo(); // 내가 즐겨찾기한 브랜드 가져오기
		}
		
		/**
		 * unload시 관련 데이터를 sessionStorage에 저장
		 */
		angular.element($window).on("unload", function(e) {
			var sess = {};
			sess.pageOptions = $scope.pageOptions;
			sess.screenData = $scope.screenData;
			if (!commInitData.query.localtest && $scope.leavePageStroage) {
				LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
				LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
				LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
			}
		});
    }]);

    app.directive('lotteContainer', ['$timeout', '$http', 'LotteCommon', 'LotteLink', function($timeout, $http, LotteCommon, LotteLink) {
        return {
            templateUrl : '/lotte/resources_dev/brand/brandsearch_container.html',
            replace : true,
            link : function($scope, el, attrs) {

				$scope.myBrandCntMax = 50; // 내 브랜드 즐겨찾기 최대수
				$scope.showMoreCnt = 100; // 검색결과 추가로 보여줄 수
				$scope.showCnt = $scope.showMoreCnt; // 검색 시 처음 결과 보여주는 수 (많은 수가 올때 페이지 랜더링 속도 저하로 스크롤 시 동적으로 추가하여 보여주기 위해)

				$scope.numberFill = function(idx, length) {
					var strIdx = "" + idx;
					var fillData = "00000000000000000";
					return fillData.substring(0,length - strIdx.length) + strIdx;
				}

            	$scope.keyClick = function(lang, index){
                	if($scope.pageOptions.dataLoading) {
                		return;
                	}

                	$scope.sendTclick('m_RDC_side_brand_Clk_idx'+$scope.numberFill((this.$index+1),2));
                	
            		$scope.screenData.searchList = null;
					lang == 'kor'? $scope.pageOptions.curKorKeyIdx = index: $scope.pageOptions.curEngKeyIdx = index;
					$scope.pageOptions.curKeyIdx = index;
					$scope.pageOptions.curKeyword = $scope.keys[$scope.pageOptions.searchTab][$scope.pageOptions.curKeyIdx];
            		// console.log('$scope.curKorKeyIdx, $scope.curEngKeyIdx, $scope.curKeyIdx',$scope.pageOptions.curKorKeyIdx, $scope.pageOptions.curEngKeyIdx, $scope.pageOptions.curKeyIdx);
					$scope.loadData('key');
					$scope.showCnt = $scope.showMoreCnt; // 처음 보여줄 검색결과 수 초기화
            	}

            	$scope.searchKeywordClick = function(){
                	if($scope.pageOptions.dataLoading) {
                		return;
                	}

                	// console.log('$scope.pageOptions.keyword', '|'+ $scope.pageOptions.keyword +'|');
                	if($scope.pageOptions.keyword == '' || !$scope.pageOptions.keyword){
						$scope.pageOptions.keyword = null;
						return;
					}

                	$scope.sendTclick('m_RDC_side_brand_Clk_brandsearch');
                	
            		$scope.screenData.searchList = null;
					$scope.pageOptions.curKeyword = $scope.pageOptions.keyword;
					$scope.loadData('keyword');
					$scope.showCnt = $scope.showMoreCnt; // 처음 보여줄 검색결과 수 초기화
					angular.element("#srhBrdKeyword").blur();
				}
				
            	$scope.goBrandPage = function (brandNo, brdNo, idx) {
            		//LotteCommon.brandShopUrl + "?" + $scope.baseParam+"&upBrdNo="+brdNo+"&idx=1&tclick=m_side_brand_"+$scope.lang+"_idx"+(idx+1)
					//brandsearch_list
					var tclick = "";
					if(!($scope.pageOptions.keyword != '' || $scope.pageOptions.curKeyword != '')) {
						tclick = 'm_RDC_side_brand_Recobrand_Clk_list'+$scope.numberFill((idx+1),2);
					} else {
						tclick = 'm_RDC_side_brand_brandsearch_Clk_list'+$scope.numberFill((idx+1),2);
					}
					
					var _brandNo;
					brandNo? _brandNo = brandNo: _brandNo = brdNo;

					LotteLink.goLink(LotteCommon.brandShopSubUrl, $scope.baseParam, {
						upBrdNo: _brandNo,
						idx: 1,
						tclick: tclick
					});
				};
				
				/*
				파라미터값 정의 flag : 등록 (i), 삭제(d), 조회시 없음
				brnd_no : 등록,삭제할 브랜드번호
				등록,삭제 : http://m.lotte.com/json/main_new/my_brnd_info.json?flag=i&brnd_no=33143
				조회 : http://m.lotte.com/json/main_new/my_brnd_info.json
				*/
				$scope.brandBookMark = function() {
					if (!$scope.loginInfo.isLogin) { /*로그인 안한 경우*/
						alert('로그인 후 이용하실 수 있습니다.');
						$scope.loginProc(); /*go Login*/
						return false;
					} else {
						var jsonUrl = LotteCommon.myBrandInfo;
						var brndNo = this.item.brdNo;
						var brndNm = this.item.brdNm;
						var idx = this.$index;
						var flag = "add";
						if(this.item.isMyBrand) {
							// 브랜드 삭제
							flag = "del";
							jsonUrl += "?flag=d&brnd_no="+brndNo;
						} else {
							// 추가는 50개까지만
							var myBrandCnt = $scope.getMyBrandCnt();
							if(myBrandCnt < $scope.myBrandCntMax){
								// 브랜드 추가
								jsonUrl += "?flag=i&brnd_no="+brndNo;
							}else{
								$scope.showAlertPop('브랜드 즐겨찾기는 최대 50개까지 가능합니다.');
								return;
							}
						}
						var httpConfig = {
							method: "get",
							url: jsonUrl
						};
	
						$http(httpConfig)
						.success(function (data) {
							if(flag == "add") {
								$scope.screenData.myBrand += "|"+brndNo+"|";
								$scope.screenData.searchList.items[idx].isMyBrand = true;
								// alert(brndNm+"을 즐겨찾기에 추가 하였습니다.");
								$scope.showAlertPop(brndNm +' 브랜드가 즐겨찾기에 추가되었습니다.');
							} else {
								$scope.screenData.myBrand = $scope.screenData.myBrand.replace("\|"+brndNo+"\|","");
								$scope.screenData.searchList.items[idx].isMyBrand = false;
								// alert(brndNm+"을 즐겨찾기에서 삭제 하였습니다.");
								$scope.showAlertPop(brndNm +' 브랜드가 즐겨찾기에서 삭제되었습니다.');
							}
						})
						.finally(function () {
						});
					}
				};

				$scope.getMyBrandCnt = function(){
					var searchStr = $scope.screenData.myBrand;
					var cnt = (searchStr.split("|").length - 1) / 2;
					return cnt;
				}

				$scope.showAlertPop = function (msg) {
					var alertPop = angular.element(el).find('.header_alert_pop');
					alertPop.find('.msg').text(msg); // 메시지 표시
					alertPop.fadeIn(500,function(){
						$timeout(function(){
							alertPop.fadeOut(500);
						},1000)
					});
				}

				// 테스트
				// $scope.showAlertPop('가나 브랜드가 즐겨찾기에 추가되었습니다.');
				// $scope.showAlertPop('가나 브랜드가 즐겨찾기에서 삭제되었습니다.');

				/**
				 * 많은 검색결과가 올때 페이지 랜더링 속도 저하로 스크롤 시 동적으로 추가하여 보여주기 위해)
				 */
				var $cont = angular.element("body")[0];
				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight

					if(!$scope.screenData.searchList){ return; } // 데이터 처음 로드하여 보여줄때 데이터 들어오기전 winScroll 이벤트가 발생하는 경우가 있어 막음 처리

					if ($cont.scrollHeight <= args.scrollPos + args.winHeight) {
						console.log("more scroll;;;;;");

						if($scope.screenData.searchList.items.length > $scope.showCnt){
							$scope.showCnt += $scope.showMoreCnt;
							console.log('$scope.showCnt', $scope.showCnt);
							$scope.$apply($scope.showCnt);
						}
					}
				});

            }
        };
    }]);

})(window, window.angular);