(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSns',
        'lotteCommFooter',
        'lotteVideo',
        'lotteSlider'
    ]);

    app.controller('movieReviewCtrl', ['$http', '$scope', '$timeout', '$window', 'LotteCommon', function($http, $scope, $timeout, $window, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.isShowThisSns = true;
        $scope.subTitle = "사전보고"; // 서브헤더 타이틀
        $scope.screenID = "movieReview"; // 스크린 아이디

        $scope.shareNoFixMessage = true;
        $scope.shareCodeis = "영상매장";
        $scope.shareRendingURL = location.href;

        $scope.tclick = $scope.tClickBase+$scope.screenID;
        $scope.vComDispNo;//tab displayNo

        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
        	}
        	$scope.screenData = {
        		page: 0,
        		pageSize: 20,
        		pageEnd: false
        	}
        })();
        // 탭 클릭
        $scope.tabClick = function (e, index) {
          $scope.ctgll.tabIdx = index;
          $scope.vComDispNo = 5586113;
          $scope.vComTabIdx = e.text_disp_prio_rnk;
          $scope.rScope.sendTclick('m_DC_SpeDisp_Reviewer_Clk_(' + $scope.vComTabIdx + ')');

          var jsonUrl = LotteCommon.movieReviewData;
          $scope.loadData(jsonUrl, $scope.vComDispNo,$scope.vComTabIdx);
          console.log($scope.product)
          $scope.product.mov = $scope.product.items;
          // console.log($scope.product.moviePrd)
          $scope.isMovie = true; //동영상 더볼 리스트 있음
          $scope.movPrdNum(); //동영상 리스트 초기화
          for(var i= 0;i < $scope.product.items.length; i++){
              var prd = "autoMovie" + [i + 1];
              $scope.product.mov[i].movid = prd;
              // console.log($scope.product.moviePrd[i]);
              // $scope.product.moviePrd[i].movieId.push('autoMovie' + (i + 1));
              // console.log($scope.product.moviePrd)
              // var prd = $scope.product.items[i].movieID;
          }
          //탭 미들
          // var windowwidth = $(window).width();
        	// var windowwidthhalf = windowwidth / 2;
          // var outerWidth = $scope.ctgll3[index];
          var idx = index;
          var idx2 = (index + 1);
          var ctg3 = $scope.ctgll3;
          var windowwidth = $(window).width();
        	var windowwidthhalf = windowwidth / 2;
          console.log('ctg3 : ' + ctg3)
          var elwidth = ctg3[idx2];
          var elwidthHalf = elwidth / 2;
          var leftTotal = 0;
          for (var i = 0; i <= idx; i++) {
            leftTotal += ctg3[i];
          }
          var offset = leftTotal - (windowwidthhalf - elwidthHalf);
          $(".swipe_wrap").animate({scrollLeft: offset}, 'slow')
        }
        // 동영상 리뷰매장 DATA
        var movieReviewData = LotteCommon.movieReviewData;
        // Data Load
        $http.get(movieReviewData)
        .success(function(data) {
          $scope.reviewer_mall = data.reviewer_mall;
          $scope.ctgll = data.reviewer_mall.tab_nm_list;
          $scope.ctgll2 = data.reviewer_mall.tab_nm_list.items;
          $scope.ctgll3 = [];
          $scope.ctgll4 = [];
          $scope.ctgll.tabIdx = 0;
          $scope.product = data.reviewer_mall.product;
          $scope.product.moviePage = 1;
          $scope.product.moviePrd = [];
          // $scope.product.moviePrd.movieId = []
          $scope.product.mov = $scope.product.items;
          // console.log($scope.product.moviePrd)
          $scope.isMovie = true; //동영상 더볼 리스트 있음
          $scope.movPrdNum(); //동영상 리스트 초기화
          //탭 미들
          var li_num1 = $scope.ctgll2.length;
          // for(var i = 1; i <= li_num1; i++){
          //   $( ".slide_ul li" ).each(function( index ) {
          // }
          var li_num2 = [];
          var li_num3 = [];
          var li_num5 = 0;
          setTimeout(function(){
            $( ".slide_ul li" ).each(function( index ) {
  					  // console.log( index + ": " + $( this ).outerWidth() );
              li_num2.push($( this ).outerWidth());
              var li_num4 = li_num5 += $( this ).outerWidth();
              var li_num1_width = (li_num1 * li_num2);
  					  $('.slide_ul').width(li_num4 + 1);
  					});
            $scope.ctgll3 = li_num2;
            $scope.ctgll4 = $scope.ctgll3.unshift(0);
          }, 500);
          // console.log(li_num2)
          for(var i= 0;i < $scope.product.items.length; i++){
              var prd = "autoMovie" + [i + 1];
              $scope.product.mov[i].movid = prd;
              // console.log($scope.product.moviePrd[i]);
              // $scope.product.moviePrd[i].movieId.push('autoMovie' + (i + 1));
              // console.log($scope.product.moviePrd)
              // var prd = $scope.product.items[i].movieID;
          }
        })
        .error(function(data, status, headers, config){
            console.log('Error Data : ', status, headers, config);
        });

        // Data Load
        $scope.loadData = function (jsonUrl, dispNop,idx) {
          var httpConfig = {
            method: "get",
            url: jsonUrl,
            params : {
    					dispNo : dispNop,
              tabIdx : idx
    				}
          };
          $scope.ajaxLoadFlag = true;
          $http(httpConfig)
          .success(function (data) {
            console.log(data)
            // $scope.reviewer_mall = data.reviewer_mall;
            $scope.reviewer_mall.main_banner = data.reviewer_mall.main_banner;
            // $scope.ctgll = data.reviewer_mall.tab_nm_list;
            // $scope.ctgll.tabIdx = 0;
            // $scope.product = data.reviewer_mall.product.items;
            // $scope.product.moviePage = 1;
            // $scope.product.moviePrd = data.reviewer_mall.product.items;
            $scope.product = data.reviewer_mall.product;
            $scope.product.moviePage = 1;
            $scope.product.moviePrd = [];
            $scope.product.mov = $scope.product.items;
            $scope.movPrdNum();
            for(var i= 0;i < $scope.product.items.length; i++){
                var prd = "autoMovie" + [i + 1];
                $scope.product.mov[i].movid = prd;
                // console.log($scope.product.moviePrd[i]);
                // $scope.product.moviePrd[i].movieId.push('autoMovie' + (i + 1));
                // console.log($scope.product.moviePrd)
                // var prd = $scope.product.items[i].movieID;
            }
            console.log($scope.product)
            // // $scope.product.moviePrd.movieId = []
            // $scope.product.mov = $scope.product.items;
          })
          .finally(function () {
            $scope.ajaxLoadFlag = false;
          });
        };

        //동영상 리스트수
    		$scope.movPrdNum = function(){
    			var page = $scope.product.moviePage, movieIdx = page*15, len = $scope.product.moviePrd.length;
    			for(var i=len; i<movieIdx; i++){
    				if(i>=$scope.product.mov.length){
    					$scope.isMovie = false;
    					break;
    				}else {
              $scope.product.moviePrd.push($scope.product.mov[i]);
              $scope.isMovie = true;
            };
    			}
    		}

        $scope.petShare = function( obj ){
            $scope.sendTclick('m_DC_SpeDisp_Vcom_Clk_shr');
            $scope.showSharePop( obj );
            // $timeout(function(){
            //     getScope().share_img = obj.shareImg;
            //     getScope().noCdnUrl = location.href;
            // },300);
        }

    }]);

    app.directive('lotteContainer', ['$rootScope', '$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
  		function ($rootScope, $http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
  			return {
            templateUrl : '/lotte/resources_dev/movie_review/movie_review_container.html',
            replace : true,
            link : function($scope, el, attrs) {
              //메인 로고 티클릭
              $scope.mallMainClick = function(tclick) {
                $scope.sendTclick(tclick);
              }
              //배너 티 클릭
              $scope.bnTclick = function(){
                var tclick = 'm_DC_SpeDisp_Reviewer_Clk_banner_(01)';
                $scope.sendTclick(tclick);
              }

              $scope.rScope = LotteUtil.getAbsScope($scope);
              $scope.product;
              // setTimeout(function(){ autoVideoPlay('autoVideo1', '#autoVideo1'); }, 1500);
              // slider를 현재 선택된 Idx 위치로 이동함
    					$scope.setSliderIdxPos = function(sliderIdx, disableAnimation){
    						// console.log('sliderIdx', sliderIdx);
    						// $scope.setHeaderMenuIdxPos = function (dispNo, disableAnimation) {
    						$timeout(function () { // timeout을 주지 않으면 DOM 렌더링이 끝나지 않아 탭의 넓이 계산에서 오류가 나 제대로 찾아가지 못한다.
    							var slider = el.find('div[lotte-slider]'),
    								listWrap = slider.find('>ul'),
    								list = listWrap.find('>li'),
    								target = list.eq(sliderIdx),
    								targetPosX = 0,
    								animateTime = disableAnimation ? 0 : 200;

    							if (slider.length > 0 && listWrap.length > 0 && target.length > 0 && slider.width() < listWrap.width()) {
    								targetPosX = (slider.width() / 2) + listWrap.offset().left - (target.offset().left + (target.outerWidth() / 2));
    								slider.scope().lotteSliderMoveXPos(targetPosX, animateTime);
    							}
    						}, 300);
    					};
              //영상 더보기 클릭
      				$scope.moremov = function(){
      					$scope.product.moviePage++;
      					$scope.movPrdNum();
                for(var i= 0;i < $scope.product.items.length; i++){
                    var prd = "autoMovie" + [i + 1];
                    $scope.product.mov[i].movid = prd;
                    // console.log($scope.product.moviePrd[i]);
                    // $scope.product.moviePrd[i].movieId.push('autoMovie' + (i + 1));
                    // console.log($scope.product.moviePrd)
                    // var prd = $scope.product.items[i].movieID;
                }
      					var tclick = 'm_DC_SpeDisp_Reviewer_Clk_(' + ($scope.ctgll.tabIdx + 1) + ')_more';
      					$scope.sendTclick(tclick);
      				}

              $scope.linkClick = function (linkUrl, tclick) {
          			console.log('linkUrl', linkUrl);
          			$window.location.href = LotteUtil.setUrlAddBaseParam(linkUrl , $scope.pageUI.baseParam + "&tclick=" + tclick);
          		};

              // 동영상 재생 티클릭
              $scope.movPlayTclick = function(index){
      					var tclick = 'm_DC_SpeDisp_Reviewer_Clk_(' + ($scope.ctgll.tabIdx + 1) + ')_item_(' + (index + 1) + ')_play';
      					$scope.sendTclick(tclick);
      				}

              //동영상 일시정지 티클릭
              $scope.movPauseTclick = function(index){
      					var tclick = 'm_DC_SpeDisp_Reviewer_Clk_(' + ($scope.ctgll.tabIdx + 1) + ')_item_(' + (index + 1) + ')_pause'
      					$scope.sendTclick(tclick);
      				}

              //영상 상품
              $scope.preBotTclick = function(item, index){
            	  if(item.soldout)	return;
            	  //console.log(item);
      					var tclick = 'm_DC_SpeDisp_Reviewer_Clk_(' + ($scope.ctgll.tabIdx + 1) + ')_item_(' + (index + 1) + ')_prd'
      					// $scope.sendTclick(tclick);
		                item.curDispNo = 5586113;
		                item.curDispNoSctCd = 86;
		                $(".btn_move_stop").trigger("click");
		                $scope.productView(item, "", "", tclick);
      				}


              // 동영상 volume TCLICK 처리
      				$scope.movVolume = function(id){
      					var tclick = $scope.tclick+ ($('#'+id).hasClass('mute') ? '_Clk_Video_vol' : '_Clk_Video_mute');
      					$scope.sendTclick(tclick);
      				}

              // 동영상 상세보기 링크
              $scope.mainProductClick = function(item, tclick, i) {
                // var tt = "#autoVideo" + (i + 1);
                // setTimeout(function() {angular.element(''+tt).load();}, 500);
                // setTimeout(function() {angular.element('#autoVideo1').load();}, 500);
                $(".btn_move_stop").trigger("click");
          			if(item.goods_no) {
                  var url = LotteCommon.prdviewUrl + "?" + $scope.rScope.baseParam + "&goods_no=" + item.goods_no;
          				$window.location.href = url + ("&tclick=" + tclick);
          			}
          			// console.log(" Product Click : ", goodsNo, "\n tclick : " ,tclick);
          		}

              $scope.getProductUrl = function(item, tclick, i) {
                // var tt = "#autoVideo" + (i + 1);
                // setTimeout(function() {angular.element(''+tt).load();}, 500);
                // setTimeout(function() {angular.element('#autoVideo1').load();}, 500);
                // $(".btn_move_stop").trigger("click");
          			if(item.goods_no) {
                  var url = LotteCommon.prdviewUrl + "?" + $scope.rScope.baseParam + "&goods_no=" + item.goods_no + "&tclick=" + tclick;
                  return url;
          			}
          			// console.log(" Product Click : ", goodsNo, "\n tclick : " ,tclick);
                return '';
          		}

              //영상제보 배너 클릭시
              $scope.topImg2Bn = function(address, tclick){
      					linkUrl(address, tclick);
      				}



              //sub header fix
              $scope.isMainHeaderFixed = false;
              var $win = angular.element($window);
      				function chkMainHeaderFixed() {
                // var topImgEl = angular.element(".top_tit_img");
                // var topImgEl2 = angular.element(".top_tit_img2");
                var topImgElWrap = angular.element(".top_tit_img_wrap");
                // var topImgElHeight = topImgEl[0].offsetHeight;
                // var topImgElHeight2 = topImgEl2[0].offsetHeight;
                var topImgElHeightWrap = topImgElWrap[0].offsetHeight;
      					if ($win.scrollTop() >= (topImgElHeightWrap)) {
      						$scope.isMainHeaderFixed = true;
      					} else {
      						$scope.isMainHeaderFixed = false;
      					}
      				}

              // 스크롤에 따른 헤더 고정
      				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
      					chkMainHeaderFixed();
      				});

            }
        };
    }]);

    app.filter('trusted', ['$sce', function ($sce) {
  		return function(url) {
  			return $sce.trustAsResourceUrl(url);
  		};
  	}]);

})(window, window.angular);
