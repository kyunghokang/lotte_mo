(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSns',
        'lotteCommFooter',
        'lotteSlider'
    ]);
    app.controller('movieStoreCtrl', ['$http', '$scope', '$timeout', '$window', 'LotteCommon', function($http, $scope, $timeout, $window, LotteCommon) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "영상제보"; // 서브헤더 타이틀
        $scope.isShowThisSns = true;
        $scope.screenID = "videoMall"; // 스크린 아이디
        $scope.tclick = $scope.tClickBase+$scope.screenID;
        $scope.shareNoFixMessage = true;
        $scope.shareCodeis = "영상제보";
        $scope.shareRendingURL = location.href;

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
        // 동영상 클릭
        $scope.movClick = function (e, index) {
          var movieStoreDataTop = LotteCommon.movieStoreDataTop+'&goodsNo=' + e.prd_info.goods_no + '&prdYn=Y';
          $http.get(movieStoreDataTop)
          .success(function(data) {
            $scope.MainMovInfoTop = data.goodsInfo_video_mall_top;
            $scope.MainMovInfoTopMov = data.goodsInfo_video_mall_top.movie_url;
            $scope.MainMovInfoTopInfo = $scope.MainMovInfoTop.top_product.items[0];
            $scope.MainMovInfoTopCmps = $scope.MainMovInfoTop.top_select_goods_cmps_info;
            if ($scope.MainMovInfoTopMov != 'null') {
              setTimeout(function() {angular.element("#autoVideo").load();}, 500);
              setTimeout(function() {autoVideoPlay('autoVideo', '#autoVideo',false,false,false,true);}, 500);
            }
          })
          .error(function(data, status, headers, config){
              console.log('Error Data : ', status, headers, config);
          });
          var tclick = 'm_DC_SpeDisp_Vcom_Clk_(' + ($scope.ctgll.tabIdx + 1) + ')_vod_(' + (index+1) + ')';
          $scope.sendTclick(tclick);
        }

        // 배너리스트 클릭
        $scope.bannClick = function (e, index) {
          var tclick = 'm_DC_SpeDisp_Vcom_Clk_(' + ($scope.ctgll.tabIdx + 1) + ')_banner_(' + (index+1) + ')';
          $scope.sendTclick(tclick);
          var url = e.banner_info.img_link;
          linkUrl(url, tclick);
        }

        // 동영상 상단 DATA
        var movieStoreDataTop = LotteCommon.movieStoreDataTop;
        // Data Load
        $http.get(movieStoreDataTop)
        .success(function(data) {
          $scope.MainMovInfoTop = data.goodsInfo_video_mall_top;
          $scope.MainMovInfoTopMov = data.goodsInfo_video_mall_top.movie_url;
          $scope.MainMovInfoTopInfo = $scope.MainMovInfoTop.top_product.items[0];
          $scope.MainMovInfoTopCmps = $scope.MainMovInfoTop.top_select_goods_cmps_info;
          setTimeout(function() {autoVideoPlay('autoVideo', '#autoVideo');}, 500);
        })
        .error(function(data, status, headers, config){
            console.log('Error Data : ', status, headers, config);
        });

        // 동영상 poster notFound 개선
        $timeout(function(){
            var _anchor = angular.element('.top_tit_img #autoVideo'),
                _pstImg = _anchor.data("bgUrl");
            _anchor.attr({'video-poster':_pstImg,'poster':_pstImg});
        },1500);

        // 동영상 하단 DATA
        var movieStoreData = LotteCommon.movieStoreData + '?dispNo=5586147&subDispNo=5586745';
        // Data Load
        $http.get(movieStoreData)
        .success(function(data) {
          $scope.MainMovInfo = data.MainMovInfo;
          $scope.ctgll = data.goodsInfo_video_mall_bot.cate_sml_list;
          $scope.ctgll2 = data.goodsInfo_video_mall_bot.cate_sml_list.items;
          $scope.ctgll.tabIdx = 0;
          //탭 미들
          var li_num1 = $scope.ctgll2.length;
          var li_num1_width = (li_num1 * 90);
          $('.slide_ul').width(li_num1_width);

          $scope.cate_goods_list2 =  data.goodsInfo_video_mall_bot.cate_goods_list.items;
          //console.log("%o list %o list2",data.goodsInfo_video_mall_bot.cate_goods_list,$scope.cate_goods_list2);
        })
        .error(function(data, status, headers, config){
            console.log('Error Data : ', status, headers, config);
        });

        // 탭 클릭
        $scope.tabClick = function (e, index) {
          $scope.ctgll.tabIdx = index;
          $scope.DispNo = 5586147;
          $scope.subDispNo = $scope.DispNo + '&subDispNo=' + e.disp_no;
          $scope.vComTabIdx = e.text_disp_prio_rnk;
          $scope.rScope.sendTclick('m_DC_SpeDisp_Vcom_Clk_(' + (index + 1) + ')');

          var jsonUrl = LotteCommon.movieStoreData+"?dispNo="+$scope.DispNo + '&subDispNo=' + e.disp_no;
          // $scope.loadData(jsonUrl, $scope.subDispNo);
          $scope.loadData(jsonUrl, $scope.subDispNo)

          // $scope.setSliderIdxPos(index, false); // 200 animateTime

          //탭 미들
          var windowwidth = $(window).width();
        	var windowwidthhalf = windowwidth / 2;
        	var outerWidth = 90;
        	var outerWidthhalf = outerWidth / 2;
        	var halfhalf = windowwidthhalf - outerWidthhalf;
        	var leftValue = (outerWidth * index);
          console.log(leftValue)
        	var howleft = leftValue - halfhalf;
          $(".swipe_wrap").animate({scrollLeft: howleft}, 'slow');
        	// $('.swipe_wrap').scrollLeft(howleft,'fast');
        }

        // Data Load
        $scope.loadData = function (jsonUrl) {
          var httpConfig = {
            method: "get",
            url: jsonUrl
          };
          // console.log('dispNo', dispNop);

          $scope.ajaxLoadFlag = true;
          $http(httpConfig)
          .success(function (data) {
            // $scope.mainData = data;

            $scope.cate_goods_list2 =  data.goodsInfo_video_mall_bot.cate_goods_list.items;
          // $scope.cate_goods_list2 =  (data.goodsInfo_video_mall_bot.cate_goods_list) ?  data.goodsInfo_video_mall_bot.cate_goods_list.items : "";

          })
          .finally(function () {
            $scope.ajaxLoadFlag = false;

          });
        };

        //로그인 페이지로
        $scope.goToLogin = function ($window, $scope,url) {
          var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
          console.log(targUrl)
          if (url.indexOf('?') > 0) {
            $window.location.href = url + "&" + $scope.baseParam + targUrl;
          } else {
            $window.location.href = url + "?" + $scope.baseParam + targUrl;
          }
        };

        $scope.petShare = function( obj ){
            $scope.sendTclick('m_DC_SpeDisp_Reviewer_Clk_shr');
            $scope.showSharePop( obj );
        }

        function linkUrl(url,tclick,login){
            if(url.indexOf('?')>-1) url += '&'+$scope.baseParam+'&tclick='+$scope.tclick+tclick;
            else url += '?'+$scope.baseParam+'&tclick='+$scope.tclick+tclick;
            if(login!=null){
                if (!$scope.loginInfo.isLogin){
                    url = LotteCommon.loginUrl + "?" + $scope.baseParam+'&fromPg=0'+"&targetUrl=" + encodeURIComponent(url,'UTF-8');
                }
            }
            location.href = url;
        }
    }]);

    app.directive('lotteContainer', ['$rootScope', '$http', '$timeout', '$window', '$location', 'LotteCommon', 'LotteCookie', 'LotteStorage', 'LotteUtil',
      function ($rootScope, $http, $timeout, $window, $location, LotteCommon, LotteCookie, LotteStorage, LotteUtil) {
        return {
            templateUrl : '/lotte/resources_dev/movie_store/movie_store_container.html',
            replace : true,
            link : function($scope, el, attrs) {
              $scope.mallMainClick = function(tclick) {
                $scope.sendTclick(tclick);
              }
              $scope.wishClick = function(ele, tclick) {
          			var tclickCode = "m_RDC_ProdDetail_Clk_Wsh";

          			if (tclick) {
          				tclickCode = tclick;
          			}
          			$scope.sendTclick(tclickCode);
          			if(!$scope.loginInfo.isLogin) {
          				alert("로그인을 해주세요.");
          				$scope.goToLogin($window,$scope,LotteCommon.loginUrl);
          				return false;
          			}

          			if(ele.has_wish) {
                  $scope.productViewAlert({type:'alert',msg:'이미 담은 상품 입니다.',time:2500});
                  ele.has_wish = true;
          				// alert('이미 담은 상품입니다');
          				return false;
          			}
          			console.log("위시 담기 시도 ::: "+ ele.goods_no);
                ele.has_wish = true;
          			$scope.sendProductWish(ele.goods_no, function (res) {
          				if (res) {
                    $scope.productViewAlert({type:'alert',msg:'위시리스트에 담았습니다.',time:2500});
                    ele.has_wish = true;
          				} else {
          					ele.has_wish = false;
          				}
          			});
                console.log(ele)
          		};

              $scope.productViewAlert = function(obj) {
          			switch(obj.type) {
          				case 'alert':
          					$scope.alertTemplate = '<div class="msg"><span>'+obj.msg+'</span></div>';
          					angular.element("#alertTemplateContent").html($scope.alertTemplate);
          					break;
          			}

          			var alertPop = angular.element("#productViewAlert");

          			if(!obj.speed) {
          				obj.speed = 500;
          			}
          			if(!obj.time) {
          				obj.time = 1000;
          			}
          			alertPop.fadeIn(obj.speed,function(){
          				$timeout(function(){
          					alertPop.fadeOut(obj.speed);
          				},obj.time)
          			});
          		};

              $scope.rScope = LotteUtil.getAbsScope($scope);
              $scope.setSliderIdxPos = function(sliderIdx, disableAnimation){
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
              $scope.productInfoClick = function(item, i){
                item.curDispNo = 5586148;
                item.curDispNoSctCd = 87;
                var tclick = 'm_DC_SpeDisp_Vcom_Clk_item_(' + (i) + ')';
                $scope.productView(item, "", "", tclick);
              }

              $scope.productInfoClick2 = function(item,i){
                item.curDispNo = 5586148;
                item.curDispNoSctCd = 87;
                var tclick = 'm_DC_SpeDisp_Vcom_Clk_(' + ($scope.ctgll.tabIdx + 1) + ')_item_(' + (i+1) + ')';
                setTimeout(function() {angular.element("#autoVideo").load();}, 500);
                $scope.productView(item, "", "", tclick);
              }

              // 동영상 재생 티클릭
              $scope.movPlayTclick = function(){
                  var tclick = 'm_DC_SpeDisp_Vcom_Clk_play';
                  $scope.sendTclick(tclick);
               }

              //동영상 일시정지 티클릭
              $scope.movPauseTclick = function(){
                  var tclick = 'm_DC_SpeDisp_Vcom_Clk_pause';
                  $scope.sendTclick(tclick);
              }

              // 동영상 volume TCLICK 처리
              $scope.movVolume = function(id){
                  var tclick = $scope.tclick+ ($('#'+id).hasClass('mute') ? '_Clk_Video_vol' : '_Clk_Video_mute');
                  $scope.sendTclick(tclick);
              }

              // 동영상 상세보기 링크
              $scope.mainProductClick = function(goodsNo, tclick) {
          			if(goodsNo) {
                  var url = LotteCommon.prdviewUrl + "?" + $scope.rScope.baseParam + "&goods_no=" + goodsNo;
                  setTimeout(function() {angular.element("#autoVideo").load();}, 500);
                  $window.location.href = url + ("&tclick=" + tclick);
          			}
          			console.log(" Product Click : ", goodsNo, "\n tclick : " ,tclick);
          		}

              // 영상 상품 TCLICK 처리
              $scope.movprdTclick = function(item){
                // var tclick = 'm_DC_SpeDisp_Vcom_Clk_prd';
                // $scope.sendTclick(tclick);
                item.curDispNo = 5586148;
                item.curDispNoSctCd = 87;
                var tclick = 'm_DC_SpeDisp_Vcom_Clk_prd';
                setTimeout(function() {angular.element("#autoVideo").load();}, 500);
                $scope.productView(item, "", "", tclick);
              }

              // 하단상품 티클릭
              $scope.prdItemTclick = function(e, i){
                var tclick = 'm_DC_SpeDisp_Vcom_Clk_(' + ($scope.ctgll.tabIdx + 1) + ')_item_(' + (i+1) + ')';
                $scope.sendTclick(tclick);
               }
            }
        };
    }]);

    app.filter('trusted', ['$sce', function ($sce) {
  		return function(url) {
  			return $sce.trustAsResourceUrl(url);
  		};
  	}]);

    app.filter('dealFlagName', function () {
  		return function (flag) {
  			var flagName;
  			// "flag": [ "dept", "smartpick", "quick", "today"]
  			// 롯데백화점, 스마트픽, 퀵, 오늘도착
  			switch(flag){
  				case 'dept': flagName = '롯데백화점'; break;
  				case 'smartpick': flagName = '스마트픽'; break;
  				case 'quick': flagName = '퀵'; break;
  				case 'today': flagName = '오늘도착'; break;
  			}
  			return flagName;
  		}
  	});

    app.filter('optName', function () {
  		return function (opt) {
  			var optName;
  			// "flag": [ "dept", "smartpick", "quick", "today"]
  			// 롯데백화점, 스마트픽, 퀵, 오늘도착
  			switch(opt){
  				case '무료배송': optName = '무료배송'; break;
  				case '무이자3': optName = '무이자3'; break;
  			}
  			return optName;
  		}
  	});
})(window, window.angular);
