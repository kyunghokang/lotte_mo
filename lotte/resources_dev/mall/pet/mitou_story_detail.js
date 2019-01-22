(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteSns',
        'lotteNgSwipe',
    ]);

    app.controller('MitouStoryDetailCtrl', ['$http', '$scope', 'LotteCommon','$timeout' , '$window',function($http, $scope, LotteCommon, $timeout,$window) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "스토리"; // 서브헤더 타이틀
        $scope.shareCodeis = "MIMI TOUTOU";
        $scope.screenID = "MitouStory"; // 스크린 아이디
        $scope.swipeIdx=1;
        $scope.innerText="";

        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
        	}
        	$scope.screenData = {
        		 story_list:[],
                 story_no:''    		      		
        	}

        })();   

    window.addEventListener("load", function() {

            setTimeout(scrollTo, 0, 0, 1);

        }, false);




        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        $scope.loadScreenData = function(param) {
                      
            var story_no =  getParameterByName("story_no"); 
            var disp_no =   getParameterByName("disp_no");       
            var url = LotteCommon.petMallStoryDetail+'?story_no='+story_no+"&disp_no="+disp_no;
            console.log(url);
            $http.get(url)
                .success(function(data) {
                    var contents = [];
                    var keyname = Object.keys(data);//key 명을 바꾸는 경향이 있으므로..
                    contents = data[keyname];
                      
                    /*console.log(contents.story_list.items[0].img_list);*/
                   
                    if(contents.story_list.items!=null||contents.story_list.items.length!=0){                      
                        $scope.screenData.story_list = contents.story_list.items;

                    }else {
                             alert( "등록된 게시물이 없습니다." );
                            $scope.screenData.story_list = [];
                            $scope.pageLoading = false;
                    }
                    $scope.pageLoading = false;
                
            });

        }

        $scope.loadScreenData();

        //이전 페이지 버튼 (ipad)
        $scope.btn_beforeSlide= function(){
            angular.element(".list.mask").scope().beforeSlide();
        }
        //다음 페이지 버튼 (ipad)
        $scope.btn_nextSlide =function(){
            angular.element(".list.mask").scope().nextSlide()
        }

        //페이지 인덱스
        $scope.getSwipeIndex = function(){
            $scope.swipeIdx = angular.element(".list.mask").scope().swipeIdx;
            return $scope.swipeIdx;
        }
        // 모바일 높이에 따라 최소높이 재설정
        $scope.getHeight = function(){

            var addHeight = 0;
            if(!isApp)addHeight = 57;

            var height =document.documentElement.clientHeight -addHeight;          
             return {"min-height":+height+"px"};
        }
        //공유하기 
        $scope.petShare = function( obj ){
            console.log(obj.shareImg)
            $scope.sendTclick( "m_RDC_ProdDetail_Clk_SNS" );
            $scope.showSharePop( {tclick:'m_RDC_ProdDetail_Clk_SNS'});
            $timeout(function(){
                getScope().share_img =obj.shareImg;
                getScope().noCdnUrl = location.href;
            },300);
        }
        //--공유하기
      

    }]);

 

    app.directive('lotteContainer',['$window','LotteCommon', function($window, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/pet/mitou_story_detail_container.html',
            replace : true,
             link : function($scope, el, attrs) {
                 $scope.mallMainClick = function(tclick) {
                    var url = LotteCommon.petMallMainUrl + "?" + $scope.baseParam;
                    if (tclick) {
                        url += "&tclick=" + tclick;
                    }
                    $window.location.href = url;
                }
            }
        };
    }]);
     /* header each */
    app.directive('subHeaderEach', [ '$window', '$timeout', 'AppDownBnrService',  function( $window, $timeout, AppDownBnrService ) {
        return {
            replace : true,
            link : function($scope, el, attrs) {
                $scope.subHeaderFixed = true;// 스크롤시 헤더 고정
                var $el = angular.element(el),
                headerHeight = $scope.subHeaderHeight;
                $scope.$on("winScroll", function (event, args) { 
                    // args.scrollPos, args.winWidth, args.winHeight
                    // console.log(args.scrollPos, AppDownBnrService.appDownBnrInfo.height);
                    // args.scrollPos < 0 : iOS Bendding 현상으로 스크롤 포지션 마이너스때 처리
                     if (args.scrollPos >= AppDownBnrService.appDownBnrInfo.height || args.scrollPos < 0) {
                            $scope.headerFixed = true;
                     } else {
                               $scope.headerFixed = false;

                     }
                       $timeout(function () {
                                $scope.$apply();
                       });
                });
            }
        }
    }]);

})(window, window.angular);