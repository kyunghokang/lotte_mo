var mainApp = {} ; 
mainApp.resizeBool = true ;

(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteUnit',
        'lotteSideCtg', 
        // 'lotteSideMylotte', 
        'lotteCommFooter'
    ]);
    
    app.controller('MainCtrl', ['$scope', '$http', '$window', 'LotteCommon', 'commInitData', function($scope, $http, $window, LotteCommon,commInitData){
        $scope.showWrap = true;
        $scope.contVisible = true;
        
        /*var params = {
                curDispNo : $scope.srhObj.ctg_no
        };*/
        
        mainApp.isShowListLoadingFunc = function ( value ) {
            // 로딩이 완료되면 로딩바를 초기화 합니다.
            [].forEach.call( document.querySelectorAll( 'ol.list li' ) , function ( li ){ 
                li.style.visibiliity = 'visible' ; 
            }) ; 
        }

            
        /* menu Small Category GET */
        var chkHref = decodeURI(window.location.href) ,  
        	findEnd = '&' , 
        	str_curDispNo = 'curDispNo' , 
        	str_cateDiv = 'cateDiv' , 
        	str_idx = 'idx'  , 
        	str_title = 'title' ;
            
        function findStr ( _url , str1 , str2 ) {
        	var url = _url , 
        		txt1 = url.indexOf( str1 ) , 
        		txt1Len = str1.length , 
        		step1Url = url.substr( txt1 + txt1Len + 1 , url.length ) , 
        		txt2 = step1Url.indexOf( findEnd ) , 
        		step2Url = step1Url.substr( 0 , txt2 ) ; 
        	return step2Url ; 
        }
        str_curDispNo = findStr( chkHref , str_curDispNo , findEnd ) ;
        str_cateDiv = findStr( chkHref , str_cateDiv , findEnd ) ;
        str_idx = findStr( chkHref , str_idx , findEnd ) ;
        str_title = findStr( chkHref , str_title , findEnd ) ;

        $scope.subTitle = str_title; /*서브헤더 타이틀*/

        $scope.isShowLoading = true; /* 로딩 바 출력 */  

        $http.get(LotteCommon.smallCategoryData+'?curDispNo='+str_curDispNo+'&'+$scope.baseParam+'&cateDiv=MIDDLE&idx='+str_idx)
        .success(function(data){
        	
            $scope.mCateMenu = data.max;            
            $scope.cateDiv = data.cateDiv; /*카테고리 디비젼*/
            
            $scope.smallCategoryList = data.max.small_cate.items;
            
            $scope.prdBestList = data.max.prd_best_list.items;
            /*$scope.subTitle = $scope.mCateMenu.disp_nm; 서브헤더 타이틀*/ 
            $('#head_sub').addClass('scrollFixHead');
            $scope.isShowLoading = false; /* 로딩 바 제거*/ 

        }).error(function(data){ console.log('%c kjbang', errorBang, 'Error Data :  mainCategory');});
        
        /*$scope.srhObj = angular.extend({}, commInitData.query);*/
        /* menu Small Category GET  */
    }]);
    app.directive('lotteContainer',[function(){
        return {
            templateUrl: '/lotte/resources_dev/category/cate_mid_list_container.html',
            replace:true,
            link:function($scope, el, attrs){
            }
        };
    }]);
    app.directive( 'domLoadDirective2' , [ 'LotteCommon' , function( LotteCommon ){
        return {
            replace:true,
            link:function($scope, el, attrs){
                if ( $scope.$last ) {
                    setTimeout(function(){
                        $scope.$apply(function(){
                             
//                            document.querySelector( 'div.bestList ol.list' ).style.visibility= 'hidden' ; 
//                            
//                            var loadImgs = document.querySelectorAll( 'img' ) ; 
//                            var addImgsLen = loadImgs.length ; 
//                            var loadImagesLen = 0 ;
//                            
//                            [].forEach.call( loadImgs , function ( _img ){
//                                var img = new Image() ; 
//                                var imgSrc = _img.getAttribute( 'src' ) ; 
//                                var oImg = _img ; 
//                                
//                                img.onload = function () {
//                                    loadImagesLen += 1 ; 
//                                    loadImageChkFun() ; 
//                                    $scope.isShowLoading = false ; 
//                                }
//                                
//                                img.onerror = function () {
//                                    loadImagesLen += 1 ; 
//                                    oImg.src = 'http://image.lotte.com/lotte/images/common/product/no_280.gif' ; 
//                                    loadImageChkFun() ; 
//                                }
//                                img.src = oImg.src ; 
//                            }) ; 
//                            
//                            /* 현재 삽입된 리스트의 이미지가 모두 로딩이 되어있는지 체크 */
//                            function loadImageChkFun () {
//                                if ( loadImagesLen == addImgsLen ) { 
//                                    grid = new Grid({ 
//                                        topHeight : 0 , 
//                                        minWArr: [640 , 900 ] ,
//                                        gap: 5, 
//                                        duration : .3
//                                    });
//                                    
//                                    document.querySelector( 'div.bestList ol.list' ).style.visibility= 'visible' ; 
//                                }
//                            }

                        }) ; 
                    } , 0 ) ; 
                }
            }
        };
    }]);

})(window, window.angular);
