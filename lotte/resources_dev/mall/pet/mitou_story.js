(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteNgSwipe',
        'dearpetSubCategory',
        'lotteSns'
    ]);

    app.controller('MitouStoryCtrl', ['$http','$scope', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteStorage', '$timeout', function($http, $scope, $window, $location, LotteCommon, commInitData, LotteStorage, $timeout) {
        $scope.isMain = false;
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "스토리"; // 서브헤더 타이틀
        $scope.screenID = "스토리"; // 스크린 아이디 
        $scope.shareCodeis = "MIMI TOUTOU";
        $scope.screenID = "MitouStory"; // 스크린 아이디
        $scope.pageLoading = true;
        $scope.dispNo = "";
        $scope.productListLoading = true;
        $scope.productMoreScroll = true;
        $scope.sheadHide = false;
        $scope.shareRendingURL = location.href;
        $scope.categoryNo='';
        $scope.categoryIndex=1;
        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
        	}
        	$scope.screenData = {
        		page: 0,
        		pageSize: 20,
        		pageEnd: false,
                cate_list: [],
                story_list:[],
                total_count:0,
                curDispNo: '',
                categoryNo:'',
                isloaded : false,
                storyTab : [
                    { name : '건강/질병', disp_no:68462, index:1 },
                    { name : '훈련', disp_no:68463, index:2 },
                    { name : '펫 상식', disp_no:68464, index:3 },
                    { name : '이모저모', disp_no:68465, index:4 }
                ]
        	}
        })()
    

        function autoSelectTab() {
            var url = location.href;
            for( var i=0; i<$scope.screenData.storyTab.length; ++i ) {
                    if( url.indexOf( "#/"+$scope.screenData.storyTab[i].disp_no) != -1 ) {
                        $scope.story_cate_click($scope.screenData.storyTab[i]); 
                        return;                    
                    }
            }
            $scope.story_cate_click( $scope.screenData.storyTab[0] );
        }
       

        //서브카테고리클릭
        $scope.story_cate_click= function(item){
           /* var url =window.location.href;*/
                
            $scope.screenData.page= 0;
            $scope.screenData.pageEnd=false; 
            $scope.screenData.story_list=[];
            $scope.categoryIndex= item.index;
            $scope.categoryNo =item.disp_no;
         /*  console.log(item.disp_no);
            location.hash= item.disp_no;*/
            $scope.sendTclick(  "m_DC_SpeDisp_Dearpet_Clk_Story" + $scope.categoryIndex);//카테고리 티클릭
            if(!$scope.screenData.isloaded) return;
            $scope.loadScreenData( {                                                    
                categoryNo :$scope.disp_no                           
             });
        }

         //파라메터 get
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }


        $scope.loadScreenData = function(param) {
            console.log("스크린 데이터 로드...");
            if($scope.screenData.pageEnd) {
                return;
            }
            $scope.screenData.page++;
            if($scope.screenData.page > 1) {
                $scope.productListLoading = true;
            } else {       
                if( !$scope.screenData.cate_list.length ) $scope.pageLoading = true;
            }
            /*if ($scope.categoryNo==''){
                $scope.categoryNo='68462'
            }*/
                
            var url = LotteCommon.petMallStory+'?disp_no='+$scope.categoryNo+'&page='+$scope.screenData.page+'&pageSize='+$scope.screenData.pageSize ;
            console.log(url);
            $http.get(url)
                .success(function(data) {
                    console.log(data);
                    var contents = [];
                    var keyname = Object.keys(data);//key 명을 바꾸는 경향이 있으므로..
                    contents = data[keyname];
                    $scope.screenData.isloaded = true;
                    $scope.screenData.total_count = contents.story_list.total_count;
                    
                    if(contents.story_list != null){                      
                        if($scope.screenData.page>1){ 
                            var nlist = $scope.screenData.story_list.concat(contents.story_list.items);
                            $scope.screenData.story_list =nlist;
                        }else{
                             $scope.screenData.story_list = contents.story_list.items;
                        }
                    if($scope.screenData.total_count < $scope.screenData.page*$scope.screenData.pageSize){
                            $scope.screenData.pageEnd = true;
                            $scope.productMoreScroll = false;
                        }
                    }else {

                             alert( "등록된 게시물이 없습니다." );
                            $scope.screenData.gallery_list = [];
                            $scope.screenData.pageEnd = true;
                            $scope.productMoreScroll = false;
                            $scope.productListLoading = false;
                            $scope.pageLoading = false;

                    }
                    $scope.productListLoading = false;
                    $scope.pageLoading = false;

                    if( !$scope.screenData.cate_list.length ) {
                    $scope.screenData.cate_list = contents.cate_list.items;
                    $scope.sendCategoryData( contents.cate_list.items );
                }
            });

        }
        
        autoSelectTab();
        $scope.loadScreenData();

        
        //스토리아이템클릭
        $scope.storyDetailCick= function(story_no,index){
            var tclik = 'm_DC_SpeDisp_Dearpet_Clk_Story'+ $scope.categoryIndex +"_"+addPot(index);
            var url = LotteCommon.petMallStoryDetailUrl + '?'+"story_no="+story_no+"&disp_no="+$scope.categoryNo+"&"+$scope.baseParam +"&tclick="+tclik;
            console.log(tclik);
            $window.location.href=url;
        }

        var $win = angular.element($window),
                $body = angular.element("body"),
                winH = $win.height(),
                bodyH = $body[0].scrollHeight,
                scrollRatio = 4.0, // 윈도우 높이의 4배
                moreLoadTime = 0;

        $win.on("scroll" , function (e) {

            if (!$scope.productMoreScroll || $scope.productListLoading || $scope.pageLoading) {
                return ;
            }
            bodyH = $body[0].scrollHeight;

            if ($win.width() >= 640) { // 그리드가 2단 이상일 경우 로드 비율을 낮춘다
                scrollRatio = 2; // 윈도우 높이의 2배
            } else {
                scrollRatio = 4.0; // 윈도우 높이의 4배
            }

            if( bodyH - (winH * scrollRatio) > winH && $win.scrollTop() + winH >= bodyH - (winH * scrollRatio)) {
                
                $scope.loadScreenData();
            }
        });

/*카테고리 라인맵 관련 */  
        $scope.getSubCateDataFunc;
        $scope.$on('getSubCateData', function(event, callFnc ) {
            if( !$scope.getSubCateDataFun && callFnc ) $scope.getSubCateDataFunc = callFnc;
            try{
                if($scope.screenData.cate_list.length) {
                    $scope.sendCategoryData ($scope.screenData.cate_list);
                }
            } catch(e) {};
        });

        $scope.sendCategoryData = function( data ){
            if(!$scope.getSubCateDataFunc) return;        
            $scope.getSubCateDataFunc(data);
        };
/* --카테고리 라인맵 관련 */ 

/*공유하기 관련*/
        $scope.petShare = function( obj ){
            $scope.sendTclick( "m_RDC_ProdDetail_Clk_SNS" );
            $scope.showSharePop( {tclick:'m_RDC_ProdDetail_Clk_SNS'});
            $timeout(function(){
                getScope().noCdnUrl = location.href;
            },300);
        }

        $scope.petShare2 = function( obj ){
            $scope.sendTclick( "m_RDC_ProdDetail_Clk_SNS" );
            $scope.showSharePop( {tclick:'m_RDC_ProdDetail_Clk_SNS'});
            $timeout(function(){
                getScope().noCdnUrl = location.origin+ LotteCommon.petMallStoryDetailUrl + '?'+"story_no="+obj.story_no+"&disp_no="+$scope.categoryNo+"&"+$scope.baseParam;
                getScope().share_img =obj.shareImg;
            },300);
        }



/*--공유하기 관련*/

    function addPot(index){
        var returnValue=index;
        if(index<10){
           returnValue ="0"+index;
        }
        return returnValue;
    }

    }]);

    app.directive('lotteContainer',['$window','LotteCommon', function($window, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/pet/mitou_story_container.html',
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

    app.directive('petMallStory',['$http','$window','LotteCommon','$timeout','commInitData', function($http, $window, LotteCommon, $timeout,commInitData) {
        return { templateUrl: '/lotte/resources_dev/mall/pet/pet_mall_story.html',
                 link:function($scope,el,attrs){
                  
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