(function(window, angular, undefined) {
	'use strict';
	angular.module('dearpetSubCategory',['lotteComm'])
	.controller( 'petMallSubCtgCtrl', [ '$scope', 'commInitData', function($scope, commInitData){
	    $scope.pet_cate_linemap = [];
	    // disp_no 데이타 리턴
	    function getGetInfo( key ) {
	        var data = null;
	        angular.forEach( $scope.pet_cate_data, function(a, i ) {
	            if( data ) return data;
	            if( key == a.disp_no && !data ) data = a;
	            angular.forEach( a.sub_cate_list, function(b, i ) {
	                if( key == b.disp_no && !data ) data = b;
	                angular.forEach( b.sub_cate_list, function(c,i){
	                    if( key == c.disp_no && !data ) data = c;
	                })
	            })
	        } );
	        return data;
	    }

	    function cateInit( catedata ) {
			if(!catedata) return;
	        $scope.pet_cate_data = catedata;
	        var cateParams = [
	            commInitData.query.beforeNo || null, // 1depth
	            commInitData.query.curDispNo || null, // 2depth
	            commInitData.query.cate3 || null // 3depth
	        ];
			if( cateParams[1] == cateParams[2] ) cateParams.splice(2,1);
	        // 라인맵 데이타 만들기
	        for( var i=0; i<cateParams.length; ++i ) {
	            if( cateParams[i] ) {
	                var currentData = getGetInfo( cateParams[i] );
	                if( currentData ) $scope.pet_cate_linemap.push( currentData );
	                if( !currentData.sub_cate_list ) break;
	            }
	        }
	        // 최대 3depth 까지
	        var len = $scope.pet_cate_linemap.length;
	        for( var i=len; i<3; ++i  ) {
	            var cdata = $scope.pet_cate_linemap[  $scope.pet_cate_linemap.length-1 ];
	            if( cdata.sub_cate_list && cdata.sub_cate_list.length || cdata.extra ) {
	                if(currentData ) {
	                    var addData = cdata.extra ? cdata.extra[0] : cdata.sub_cate_list[0];
	                    $scope.pet_cate_linemap.push( addData );
	                }
	            }
	        }
			if( $scope.connectCategoryDirectiveFunc ) $scope.connectCategoryDirectiveFunc();
	    }
	    // prod_list 에 콜백 함수 전달 ( 데이타 받아오기 )
	    $scope.$emit('getSubCateData', cateInit );
		$scope.connectCategoryDirectiveFunc = null;
		$scope.directiveIsCallController = function( callback ){
			if( $scope.pet_cate_data ) {
				callback();
				return;
			}
			$scope.connectCategoryDirectiveFunc = callback;
		}
	}])
	.directive( 'petMallSubCtg', [ '$window', '$timeout', 'LotteCommon', 'commInitData', function( $window, $timeout, LotteCommon, commInitData ){
	        return {
	            templateUrl : '/lotte/resources_dev/mall/pet/dearpet_mall_sub_category.html',
	            restrict:'E',
	            replace:true,
	            link : function(scope, el, attrs ) {
	                scope.currentCateList;
	                scope.select_disp_no;
					scope.chkNo;
	                scope.swipeIndex = 0;
	                scope.select_depth_index = -1;
	                scope.swipe_item_width = angular.element(".dearpet_mall_sub_category").width();

	                function activeReset (c) {
	                    for( var i=0; i<scope.pet_cate_linemap.length; ++i ) {
	                        if( c != i ) scope.pet_cate_linemap[i].active = false;
	                    }
	                }

	                function getBaseURL (disp_no) {
	                    var baseUrl = LotteCommon.petMallProdListUrl;
	                    // 디어펫그램, 뽐내기, 포토후기
	                    if( disp_no == '5566305' || disp_no == '5566436' || disp_no == '5566437' || disp_no == '5566438' ) {
	                        baseUrl = LotteCommon.petMallgalleryUrl;
	                    }
	                    
	                    if( disp_no == '5585896' ) {//뉴스
	                        baseUrl = LotteCommon.petMalleventUrl;
	                    }
	                    
	                    if( disp_no == '5585895' ){//스토리
	                    	baseUrl =   LotteCommon.petMallStoryUrl;                 	
	                    }

	                    if( disp_no == '5572261' ){//메거진중카
	                    	var curDispNo = scope.pet_cate_data[6].sub_cate_list[0].disp_no;
	                    	baseUrl = curDispNo == 5585896 ? LotteCommon.petMalleventUrl : LotteCommon.petMallStoryUrl
	                     }
	                     
	                    return baseUrl;
	                }
	                scope.swipeSlideFinish = function(c){
	                    scope.swipeIndex  = c;
	                };
	                scope.subcateClick = function( c ) {
	                    activeReset(c);
	                    scope.currentCateList = null;
	                    scope.select_disp_no = null;
	                    scope.pet_cate_linemap[c].active = !scope.pet_cate_linemap[c].active;
	                    if(scope.pet_cate_linemap[c].disp_no) scope.sendTclick(  "m_DC_SpeDisp_Dearpet_Clk_"+ scope.pet_cate_linemap[c].disp_no );
	                    if( scope.pet_cate_linemap[c].active ) getOpenCateList( c );
	                }
	                scope.subcateClose = function(){
	                    scope.currentCateList = null;
	                    scope.select_disp_no = null;
	                    scope.select_depth_index = -1;
	                    activeReset(null);
	                }
	                scope.subcateLink = function(item, i ){
                        var disp_no = item.disp_no;
                        if(item.outlink_yn == 'Y'){
                            if(item.mov_frme_cd){
                                if(scope.appObj.isApp){
                                    openNativePopup('', item.link_url);
                                }else{
                                    window.open(item.link_url, "_blank");
                                }                                                        
                            }else{
                                location.href = item.link_url;
                            }
                        }else{                        
                            console.log(disp_no+"####")
                            if( !disp_no ) return;
                            var curDispNo="", beforeNo="", cate3="", chkDepth=2, url = getBaseURL( disp_no  );
                            switch( String( scope.select_depth_index ) ) {
                                case "0":
                                    beforeNo = disp_no;
                                    try{
                                        curDispNo = scope.pet_cate_data[i].sub_cate_list[0].disp_no;
                                        if(!curDispNo) curDispNo = disp_no;
                                     } catch(e) { curDispNo = disp_no }
                                break;
                                case "1":
                                    beforeNo = scope.pet_cate_linemap[0].disp_no;
                                    curDispNo = disp_no;
                                    chkDepth = 3;
                                break;
                                case "2":
                                    beforeNo = scope.pet_cate_linemap[0].disp_no;
                                    curDispNo = scope.pet_cate_linemap[1].disp_no;
                                    cate3 = ( curDispNo === disp_no ?  "" : disp_no );
                                    chkDepth = 3;
                                break;
                            }
                            // 카테고리 코드
                            url += "?"+ scope.baseParam + "&beforeNo=" + beforeNo +"&curDispNo=" + curDispNo + "&cate3=" + cate3 + "&chkDepth="+ chkDepth;
                            // 티클릭
                            url += "&tclick=" + "m_DC_SpeDisp_Dearpet_Clk_" + disp_no;
                            window.location.href = url;                                                        
                        }
	                }

	                // 카테고리 페이징
	                function sliceCategory( arr ) {
	                    if( !arr ) return [];
	                    if( arr.length < 10 ) return [arr];
	                    var cleave = arr.length/10,
	                        nArr = [];
	                    for( var i=0; i<cleave; ++i ) {
	                        var n = []
	                        for( var s=0; s<10; ++s ) {
	                            if( arr[ i*10 + s ] ) n.push( arr[ i*10 + s ] );
	                        }
	                        if( n.length ) nArr.push( n );
	                    }
	                    return nArr;
	                }

	                // 선택한 라인맵 카테고리를 포함한 목록
	                function getOpenCateList ( i ) {
	                    if( !scope.pet_cate_linemap[i].disp_no ) return;
	                    switch( String(i) ) {
	                        case "0":
	                            scope.currentCateList = sliceCategory(scope.pet_cate_data);
	                            break;
	                        default:
	                            scope.currentCateList = sliceCategory(scope.pet_cate_linemap[i-1].sub_cate_list);
	                    }
	                    scope.select_depth_index = i;
	                    scope.swipeIndex = 0;
	                    scope.select_disp_no = scope.pet_cate_linemap[i].disp_no;
	                }

	                function getCutSize() {
	                    var w = angular.element($window).width();
	                    if( w < 360 ) return 13;
	                    if( w > 450 && w < 640 ) return 19;
	                    if( w > 640 ) return 31;
	                    return 18;
	                }

	                function stringCut (){
	                    // 라인맵 2줄 않되게 잘라주기
	                    var text_lenth = 0, max = getCutSize();
	                    for( var i=0; i<scope.pet_cate_linemap.length;++i ) {
	                        text_lenth += scope.pet_cate_linemap[i].disp_nm.length;
	                    }
	                    if( text_lenth > max ) {
	                        var cut = text_lenth  - max, item = scope.pet_cate_linemap[ scope.pet_cate_linemap.length-1 ];
	                        item.cut_name = item.disp_nm.substr(0, item.disp_nm.length-cut) +"...";
	                    }
	                }

					scope.swipeObj = { getCtrl : function( ctrl ) {
						scope.swipeObj.ctrl = ctrl;
					}, ctrl : null };
					scope.currentSwipeCategory = function( s ) {
						if( !s ) return;
						$timeout(function(){
							scope.swipeObj.ctrl.moveIndex( s );
						},500);
					}

					scope.directiveIsCallController( function(){
		                $timeout( function(){
		                    try{ // 마지막 라인맵 자동 선택
								var chk = 1;
								if(commInitData.query.chkDepth && scope.pet_cate_linemap.length == 3 ) chk = Number(commInitData.query.chkDepth)-1;
								scope.pet_cate_linemap[chk].active = true;
								scope.select_disp_no = scope.pet_cate_linemap[chk].disp_no;
								scope.chkNo = chk;
		                    	getOpenCateList( chk );
							} catch(e) {}
		                } );
					});
	                angular.element($window).bind('resize',function(e){
	                    stringCut();
	                });
	            }
	        }
	}]);
})(window, window.angular);
