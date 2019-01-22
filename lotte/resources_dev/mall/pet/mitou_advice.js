(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'dearpetSubCategory',
        'lotteSns'
    ]);

    app.controller('MitouAdviceCtrl', ['$http','$scope', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteStorage', '$timeout', function($http, $scope, $window, $location, LotteCommon, commInitData, LotteStorage, $timeout) {
        $scope.isMain = false;
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.pageLoading = true;
        $scope.dispNo = "";
        $scope.productListLoading = true;
        $scope.productMoreScroll = true;
        $scope.shareRendingURL = location.href;
        $scope.shareCodeis = "MIMI TOUTOU";
        $scope.screenID = "DearpetAdvice"; // 스크린 아이디
        commInitData.query.beforeNo ='5572261'; //매거진 전시코드 
        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
            $scope.screenData = {
                    page: 0,
                    disp_name: "",
                    dispNo: '',
                    curDispNo: '',
                    cateNodeName: [],
                    cate_list: []
            }
        })();
        
        //파라메터 get
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
               
        /*
         * 스크린 데이터 로드
         */
        /**
         * @ngdoc function
         * @name ProdListCtrl.function:loadScreenData
         * @description
         * 화면 데이터 로드
         * @example
         * $scope.loadScreenData();
         */
       
        $scope.getHeight = function(){
            var height = angular.element(".plan_bannerWrap iframe").height();          
             return {"min-height":+height+"px"};
        }

        $scope.loadScreenData = function(el) {
            console.log("스크린 데이터 로드...");
            if( !$scope.pageLoading ) return;
            
            var url = LotteCommon.petMalleventData;
            $http.get(url).then(function(res){
                var contents = [], d = res.data;
                contents = d['dearpet_news'];                
                if( !$scope.screenData.cate_list.length ) {
                    $scope.screenData.cate_list = contents.cate_list.items;
                    $scope.sendCategoryData( contents.cate_list.items );
                }
                $scope.pageLoading = false;
            });
        }
        
                       
        // 20170619 박해원 서브카테고리
        $scope.getSubCateDataFunc;
        $scope.$on('getSubCateData', function(event, callFnc ) {
            if( !$scope.getSubCateDataFun && callFnc ) $scope.getSubCateDataFunc = callFnc;
            try{
                if($scope.screenData.cate_list.length) {
                    $scope.sendCategoryData($scope.screenData.cate_list);
                }
            } catch(e) {};
        });
        

        $scope.sendCategoryData = function( data ){
            if(!$scope.getSubCateDataFunc) return;
            // 좋아한 게시물 일경우
                angular.forEach(data, function(e,n) {
                    if( '5572261' == e.disp_no ) {
                        e.extra = [ {
                            disp_nm : "상담"
                        }];
                    }
                })     
            $scope.getSubCateDataFunc(data);
         
        };          
            
        $scope.subTitle = $scope.screenData.disp_name = "상담";       
        $scope.petShare = function( obj ){
            $scope.sendTclick( "m_DC_SpeDisp_Dearpet_Clk_Shr" );
            $scope.showSharePop( {tclick:"m_DC_SpeDisp_Dearpet_Clk_Shr"});
            $timeout(function(){
                getScope().noCdnUrl = location.href;
            },300);
        }
        
         $scope.loadScreenData();

         window.onload= function(){
            iframeInit();
         }
         
        // IFRAME AUTO HEIGHT :: 20170808 박해원 ( iframe )
         var frmPage, frmWindow, frmReload = false, frameWidth;
         function iframeAutoHeight(){
            // 테스트 기획전 (5408554)
            if($scope.dispNoParam!='5408554') return;
            $timeout( iframeInit, 1000 ); // 아이프레임 인식이 느려서 1초 뒤에 실행
         }

         function iframeInit(){
            frmPage = angular.element(".plan_bannerWrap iframe")[0];
            frmWindow = frmPage.contentWindow; 
            angular.element(frmPage).attr('onLoad', 'angular.element(this).scope().iframeOnLoaded()');               
            frmPage.height = "auto";
            window.onmessage = onmessage;
            sendMessage();
            window.onload = sendMessage;
            window.onresize = iframeResize;
            iframeResize ();
            frameWidth = window.innerWidth;
         }

         function iframeResize (){
            if( Math.ceil( frameWidth ) == Math.ceil( window.innerWidth ) ) return;
            frameWidth = window.innerWidth;
            var url = angular.element(frmPage).attr('src');
            angular.element(frmPage).attr('src', url );
         }
         function sendMessage(){
                    /*frmWindow.postMessage('lotte.com','*');*/
             frmWindow.postMessage('lotte.com','*');
         }
         function onmessage(e){
            if( frmReload ) return;
            frmReload = true;
            sendMessage();
            if (e.data.type==="dearpet") {
               $scope.frameHeight = event.data.height+"px";
               frmPage.height  = event.data.height+"px";            
           }
         
         }
         $scope.iframeOnLoaded = function(){
            frmReload = false;
            frmPage.height = "0px";
            angular.element(window).scrollTop(0);
            sendMessage();
                   
         }
         // END IFRAME AUTO HEIGHT 
   
    }]);
    
    
    app.directive('lotteContainer',['$window','LotteCommon', function($window, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/pet/mitou_advice_container.html',
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
    app.directive('subHeaderEach', [ '$window','AppDownBnrService', '$timeout', function($window,AppDownBnrService,$timeout) {
        return {
            replace : true,
            link : function($scope, el, attrs) {
                $scope.subHeaderFixed = true;
                // 스크롤시 헤더 고정
                var $el = angular.element(el),
                        headerHeight = $scope.subHeaderHeight;

                $scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
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


