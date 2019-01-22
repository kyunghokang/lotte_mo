(function(window, angular, undefined) {
	'use strict';
	
	var app = angular.module('app', [
		'lotteComm',
        'lotteSrh',
        'lotteSns',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteNgSwipe',
        'lotteSlider',
        'lotteVideo',
        'lotteCommFooter'
	]);
	
	app.controller('bestSamsungMainCtrl', ['$http', '$scope', '$window', 'LotteCommon', 'commInitData', '$timeout', function($http, $scope, $window, LotteCommon, commInitData, $timeout)  {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "삼성전자 브랜드샵";//서브헤더 타이틀
		$scope.screenID = "SpeMall_Samsung";
		$scope.screenData = {};

		$scope.screenData.gnbMenu = [];
        $scope.screenData.topBanner = [];
        $scope.screenData.hotDeal = {};
		$scope.screenData.brandStory = [];
		$scope.screenData.thema = [];
        $scope.screenData.newArrivals = [];
        $scope.screenData.bestReview = [];
		$scope.screenData.issue = [];
		$scope.screenData.benefit = {};
		$scope.story = [];


		//로고링크
		$scope.goSamsungBrandMain = function(){
        	$window.location.href = LotteCommon.samsungBrandMain +'?' + $scope.baseParam + "&curDispNo=" + commInitData.query.curDispNo + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + '_logo';
		};
		
		//서브카테고리 링크
		$scope.headerMenuClick = function(num,sort){
			$window.location.href = LotteCommon.samsungBrandSub + "?curDispNo=" + commInitData.query.curDispNo + "&cateSelected=" + num +  "&lstSortCd=" + sort + "&" + $scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_cat_" + num;	
		}
		//메인베너 링크
		$scope.goSamsungBrandTop = function(url,idx){
			$window.location.href = url + (url.indexOf('?') > -1 ? '&' : '?') + $scope.baseParam  +  
			"&tclick=" + $scope.tClickBase + $scope.screenID + "_Ban_main_" + getAddZero(idx + 1);
		};
		//핫딜배너 링크
		$scope.goHotdeal = function(url){
			$window.location.href = url + (url.indexOf('?') > -1 ? '&' : '?') + $scope.baseParam  +
			"&tclick=" + $scope.tClickBase + $scope.screenID + "_Ban_HotDeal";
		}
		//브랜드스토리 탭 
		$scope.selectBrandStory = function(idx){
			$scope.screenData.storyItem = $scope.screenData.brandStory[idx];
			$scope.sendTclick('m_DC_SpeMall_Samsung_BrandStory_Keyword_'+ getAddZero(idx + 1));
		};
		//브랜드스토리 아이템 링크
		$scope.prodBrandStory = function(goods_no, idx){
			$window.location.href = LotteCommon.prdviewUrl + "?goods_no=" + goods_no + "&" + $scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_BrandStory_Keyword_" + getAddZero(idx+1) + "_Clk_Prod";
		};
		//브랜드스토리 보기 링크
		$scope.goBrandStory = function(url){
			$window.location.href = url.indexOf('?') > -1 ? url + "&" + $scope.baseParam : url + "?" + $scope.baseParam;
		};
		//테마추천 배너 링크
		$scope.goThema = function(url,idx){
			$window.location.href = url + (url.indexOf('?') > -1 ? '&' : '?') + $scope.baseParam  +  
			"&tclick=" + $scope.tClickBase + $scope.screenID + "_Ban_Thema_" + getAddZero(idx + 1);
		}
		//MD추천 링크
		$scope.goNewArrival = function(goods_no,idx){
			$window.location.href = LotteCommon.prdviewUrl + "?goods_no=" + goods_no + "&" + $scope.baseParam + 
			"&tclick=" + $scope.tClickBase + $scope.screenID + "_Prod_Mdpick_" + getAddZero(idx + 1);
		}
		//베스트 리뷰 링크
		$scope.goPreview = function(goods_no, idx){
        	$window.location.href = LotteCommon.prdviewUrl + "?goods_no=" + goods_no + "&" + $scope.baseParam + 
        	"&tclick=" + $scope.tClickBase + $scope.screenID + "_Prd_Review_" + getAddZero(idx + 1);
        };
		//이슈상품 베너
		$scope.goIssueProd = function(url,idx){
			$window.location.href = url + (url.indexOf('?') > -1 ? '&' : '?') + $scope.baseParam  +  
			"&tclick=" + $scope.tClickBase + $scope.screenID + "_Ban_Issue_" + getAddZero(idx + 1);
		}
		//혜택배너
		$scope.goBenefitProd = function(url){
			$window.location.href = url + (url.indexOf('?') > -1 ? '&' : '?') + $scope.baseParam  +  
			"&tclick=" + $scope.tClickBase + $scope.screenID + "_Ban_Benefit";
		}

		// 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
		function getAddZero(num) {
            return num < 10 ? "0" + num : num + "";
		}
		
	
		/**
		 * @ngdoc function
		 * @name bestSamsungMainCtrl.function:loadScreenData
		 * @description
		 * 화면 데이터 로드
		 * @example
		 * $scope.loadScreenData();
		 */
		$scope.loadScreenData = function() {
			var url = LotteCommon.samsungBrandcontData + "?curDispNo=" + ( commInitData.query.curDispNo || "" ) ;
			$http.get(url)
			.success(function(data) {
				if(data.max){
					var max = data.max;
					//서브카테고리
					if(max.top_cate_sml_list && max.top_cate_sml_list.items && max.top_cate_sml_list.items.length > 0){
						$scope.screenData.gnbMenu = max.top_cate_sml_list.items;
					}
					//메인배너
					if(max.main_ban_list && max.main_ban_list.items && max.main_ban_list.items.length > 0){
						$scope.screenData.topBanner = max.main_ban_list.items;
					}
					//핫딜배너
					if(max.hotDeal_ban && max.hotDeal_ban.img_url.length > 0){
						$scope.screenData.hotDeal = max.hotDeal_ban;
					}
					//브랜드스토리 영역
					if(max.brand_story_list && max.brand_story_list.items && max.brand_story_list.items.length > 0){
						for(var i = 0; i < max.brand_story_list.items.length; i++){
								var storylist =  max.brand_story_list.items[i];
								storylist.idx = i;
						}
						$scope.screenData.brandStory = max.brand_story_list.items;
						$scope.selectBrandStory(0);
					}

					//테마배너
					if(max.thema_ban_list && max.thema_ban_list.items && max.thema_ban_list.items.length > 0){
						$scope.screenData.thema = max.thema_ban_list.items;
					}
					//md추천
					if(max.md_recomm && max.md_recomm.items && max.md_recomm.items.length > 0){
						$scope.screenData.md_recomm = max.md_recomm.items;
					}
					//베스트리뷰
					if(max.best_review && max.best_review.items && max.best_review.items.length > 0){
						$scope.screenData.bestReview = max.best_review.items;
					}
					//이슈상품
					if(max.issue_ban_list && max.issue_ban_list.items && max.issue_ban_list.items.length > 0){
						$scope.screenData.issueList = max.issue_ban_list.items;
					}
					//혜택배너
					if(max.benefit_ban && max.benefit_ban.img_url.length > 0){
						$scope.screenData.benefit = max.benefit_ban;
					}
				}
			});
		};
		
		$scope.loadScreenData();
	
	}]);

	app.directive('lotteContainer', [ '$http', '$window', function($http,$window) {
		return {
			templateUrl : '/lotte/resources_dev/mall/samsung/bestsamsung_main_container.html',
			replace : true,
			link : function($scope, el, attrs) {
				
				$scope.sb_index = 1;
				$scope.swipeEnd = function(idx) {
					$scope.sb_index = idx + 1;
				};
				
				$scope.showAll = function() {
					$scope.isShowAll = true;
					angular.element(document).find('body').addClass('noscroll');
					//$scope.rScope.sendTclick($scope.moduleData.tclick + '_Clk_Btn01');
				};

				$scope.showAllClose = function() {
					$scope.isShowAll = false;
					angular.element(document).find('body').removeClass('noscroll');
				};
				
				$scope.etvMovSktDescClose = function (event, item) { // 동영상 SKT 데이터 프리 레이어 감춤
					item.sktDescLayerCloseFlag = true;
					event.stopPropagation();
					return false;
				};
			}
		};
	}]);

	 /* header each */
	app.directive('subHeaderEach', ['$window', function($window) {
		return {
			replace : true,
			link : function($scope, el, attrs) {
				$scope.gotoPrepage = function() {
					$scope.sendTclick("m_RDC_header_new_pre");
					history.go(-1);
				};
				
				var $el = angular.element(el),
					$win = angular.element($window),
					headerHeight = $scope.subHeaderHeight;

				$win = angular.element($window),
				headerHeight = $scope.subHeaderHeight;

				function setHeaderFixed() {
					if ($scope.appObj.isNativeHeader) {
						headerHeight = 0;
					}

					if ($win.scrollTop() >= 0) {
						$el.attr("style", "z-index:10;position:fixed;top:" + headerHeight +"px;width:100%");
					} else {
						$el.removeAttr("style");
					}
				}

				$win.on('scroll', function (evt) {
					setHeaderFixed();
					setTimeout(setHeaderFixed, 300);
				});
			}
		}
	}]);

/*유튜브 동영상이 있는 경우 스크립트 자동 세팅*/
    /*
    데이타 샘플: "<youtube>M7lc1UVf-VE</youtube>"
    태그 샘플 : <div ng-bind-html="tagData | youtube_set | toTrustedHtml "></div>
    */
    app.filter('youtube_set', [ function() {
          return function(text) {
			var start = text.indexOf("<youtube>") + 9;
            if(start > 9){
			
                if($("#youtubeTag").length == 0){
						
                      var tag = document.createElement('script');
                      tag.id = "youtubeTag";
                      tag.src = "https://www.youtube.com/iframe_api";
                      var firstScriptTag = document.getElementsByTagName('script')[0];
					  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);     
					                         
				}         
			
				var vid = $(".ytcount").length;
				var setTime = (vid == 0) ? 1200 : 500;
				var end = text.indexOf("</youtube>");
				var uid = text.substr(start, end-start);
				var startText = text.substr(0, start-9);
				var endText =  text.substr(end+10, text.length);
				text = startText;
                var vodscript = "<div id='player_"+vid+"' class='ytcount'></div><script>setTimeout(function(){"+
					"var player_"+vid+" = new YT.Player('player_"+vid+"', {height:'100%',width:'100%',videoId:'"+uid+"'});},"+setTime+");</script>";	
				text += vodscript;
				text += endText;
			}
	
			return text;
				
          }
    }]);

})(window, window.angular);