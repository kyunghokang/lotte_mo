(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		'lotteSideMylotte',
		'lotteCommFooter',
		'lotteProduct',
		'lotteNgSwipe',
		'lotteSns'
    ]);

    app.controller('InfantMainCtrl', ['$http', '$scope', 'LotteCommon', 'LotteStorage', 'commInitData', 'LotteUtil', function($http, $scope, LotteCommon, LotteStorage, commInitData, LotteUtil) {
    	$scope.isMain = true;
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "InfantCare";//서브헤더 타이틀
        $scope.isShowThisSns = true; /*공유버튼*/
        $scope.allProductFlag = true;
        $scope.allSubCateFlag = true;
        $scope.sortCateTop; //구분자 위치
        $scope.subCateSelectTop;
		
		$scope.templateType = "list";
		$scope.isProductLoading = true;
        $scope.dataLoadingFinish = false;//eung
        $scope.inFantUi = {
        	uiDispNo : '5571267'//'5571265' // 최초메인 [스토리] 콘텐츠 노출
        };
        
        /*$scope.stratege_title = {
        		a : '수량 한정찬스',
        		b : '브랜드 할인쿠폰'
        };*/
        
        /*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
        	$scope.screenData = {
        		page: 0,
        		//dispNo: '1',
        		strategeList: [],
        		take: "a" // 탭 (a: 수량한정찬스, b : 브랜드할인쿠폰)
        	}
        })();
        $scope.checkHasSub = function(item) {
            angular.forEach(item, function(val) {
                if(val.sub_cate_list != null) {
                    if(val.sub_cate_list.length) {
                        val.hasSub = true;
                        val.sub_cate_list = $scope.checkHasSub(val.sub_cate_list);
                    } else {
                        val.hasSub = false;
                    }
                } else {
                    val.hasSub = false;
                }
            });
            return item;
        }
        
        /*
         * 스크린 데이터 로드
         */
        $scope.loadScreenData = function(take) {
            console.log("스크린 데이터 로드...");         
            $scope.screenData.page++;
            $scope.pageLoading = true;
            $scope.productListLoading = true;
            $http.get(LotteCommon.infantMainData)
            .success(function(data) {
            	//console.log(data);
                var contents = [];
                var newVal = [];
                if(data['baby_main'] != undefined) {
                	$scope.screenData.take = !take ? "a" : take; // 탭 세팅
                	contents = data['baby_main'];
                    $scope.screenData.cate_list = contents.cate_list.items;
                    /*angular.forEach($scope.screenData.cate_list, function(val, key) {
                        if(val.sub_cate_list != null) {
                            if(val.sub_cate_list.length) {
                                val.hasSub = true;
                                val.sub_cate_list = $scope.checkHasSub(val.sub_cate_list);
                            } else {
                                val.hasSub = false;
                            }
                        } else {
                            val.hasSub = false;
                        }
                    });*/
                    $scope.screenData.StrategeList = contents.stratege.items; //한정수량찬스 & 브랜드할인쿠폰
					$scope.screenData.StrBgImg = contents.stratege.items[0].img_list.items[0].img_url;
					$scope.screenData.StrBadge = contents.stratege.items[0].img_list.items[1].img_url;
					
                    $scope.screenData.BestBrandList = contents.bestBrandList.best_brand_list.items; //믿고 쓰는 Best 브랜드
                    $scope.screenData.KeyWrodList = contents.keywordList.keyword_list.items; // 관련 검색 키워드
                    $scope.screenData.FreeTester = contents.freeBannerList.event_list.items; //무료 체험 기회
                    $scope.screenData.UsefulTip = contents.userfulTip.tip_list.items; //육아꿀팁
                    $scope.screenData.PhotoReview = contents.photoReview.photo_list.items; // 포토후기
                    
					//$scope.screenData.ProductList = contents.prd_list.items[0].prd_list.items; //상품리스트(메인)
        			$scope.productListLoading = false;
                    $scope.pageLoading = false;
                    
                    
                    //eung ============== 상품리스트 start ==============
                    $scope.total_product = contents.prd_list.items;
                    $scope.dataLoadingFinish = true;
                    $scope.selectCate = 0;
                    $scope.allList = [];
                    //카테고리 데이타 가공
                    $scope.itemCateDataList = [{
                            divObjNo : "",
                            divObjNm : "전체상품보기",
                            dispPrioRnk : 0,
                            imgUrl : null,
                            lnkUrl : null,
                            goodsCnt : 0
                          }                            
                    ];                 
                    var i , k ;
                    for(i=0; i<$scope.total_product.length; i++){
                        //카테고리 
                        $scope.itemCateDataList.push({
                            divObjNo : "0" + i,
                            divObjNm : $scope.total_product[i].title,
                            dispPrioRnk : 0,
                            imgUrl : null,
                            lnkUrl : null,
                            goodsCnt : $scope.total_product[i].prd_list.items.length
                          });     
                        console.log($scope.total_product[i].prd_list.items.length);
                        //전체상품리스트
                        if(i > 0){
                            $scope.allList.push({
                                cateflag : true,
                                divObjNm : $scope.total_product[i].title,
                                count : $scope.total_product[i].prd_list.items.length,
                                id : "0" + i
                            });                            
                        }
                        for(k=0; k<$scope.total_product[i].prd_list.items.length;k++){
                            $scope.total_product[i].prd_list.items[k].divObjNo = i;
                            $scope.total_product[i].prd_list.items[k].divObjNm = $scope.total_product[i].title;
                            $scope.total_product[i].prd_list.items[k].cnt = $scope.total_product[i].prd_list.items.length;
                            $scope.allList.push($scope.total_product[i].prd_list.items[k]);
                        }
                    }
                    $scope.screenData.ProductList = $scope.allList;
                    $scope.screenData.cate_first = $scope.itemCateDataList[1].divObjNm;
                    $scope.screenData.cate_count = $scope.itemCateDataList[1].goodsCnt;  
                                        
                    $scope.divName = $scope.itemCateDataList[$scope.selectCate].divObjNm;
                    //$scope.divObjNoParam = $scope.itemCateDataList[$scope.selectCate].id;  
                    //eung ============== 상품리스트 end ==============
                }
                
            }).error(function(data){
                console.log('Error Data : 데이터 로딩 에러');
                $scope.productListLoading = false;
                $scope.pageLoading = false;
            });
        }
        
        /*
         * TODO: 화면 나갈때 세션에 데이터 저장 및 세선 체크후 데이터 세팅 부분 공통화 개발 필요
         */
        $scope.loadScreenData();
    }]);
    
    /* 아이디 자르기 */
    app.filter('hidestr', function() {
		  return function(id) {   
			  	var conID = "";
	    		if(id != undefined){
		    	    conID = id.substr(0,3);
		    	    for(var i=3;i<id.length; i++){
		    	        conID += "*";
		    	    }		    			
	    		}
	    	    return conID;        
		  }
	 });	 

    app.directive('lotteContainer',['$http', 'LotteCommon', function($http, LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/mall/infant/InfantMain_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                //eung ============== 상품리스트 start ==============
                    $scope.allProductOpenFlag = false;              
                    // 기획전 상품 Sort Category 열기
                    $scope.allProductClick = function () {
                        $scope.sendTclick("m_DC_SpeDisp_Mom&baby_Clk_Btn_04");
                        $scope.allProductOpenFlag = !$scope.allProductOpenFlag;
                    };                
                    //카테고리 선택
                    $scope.sortCateClick = function(divObjNo, divObjNm, idx){
                        $scope.selectCate = idx;
                        if(idx == 0){ //전체보기
                            $scope.screenData.ProductList = $scope.allList;    
                            $scope.screenData.cate_first = $scope.itemCateDataList[1].divObjNm;
                            $scope.screenData.cate_count = $scope.itemCateDataList[1].goodsCnt;                                            
                        }else{ //카테고리별 
                            $scope.screenData.ProductList = $scope.total_product[idx-1].prd_list.items;                         
                            $scope.screenData.cate_first = $scope.itemCateDataList[$scope.selectCate].divObjNm;
                            $scope.screenData.cate_count = $scope.itemCateDataList[$scope.selectCate].goodsCnt;                                                                    
                        }                    
                        $scope.divName = $scope.itemCateDataList[$scope.selectCate].divObjNm;
                        $scope.allProductOpenFlag = false; //close
                        checkfirst_color()
                    }
                    $scope.swipefnc = function(){
                        setTimeout(function(){   
                            $scope.$apply(function(){
                                var swip_id = parseInt($("#swipe_indi").attr("val"));                                                
                                var firstitem = $scope.findfirstCate($scope.screenData.ProductList[0].divObjNo);
                                if(swip_id == 0){                                
                                    $scope.screenData.cate_first = firstitem.divObjNm;
                                    $scope.screenData.cate_count = firstitem.goodsCnt;                                                                    
                                }else{
                                    var obj = angular.element(".prod_list_03 > li").eq(swip_id);            
                                    $scope.screenData.cate_first = obj.attr("item_nm");
                                    $scope.screenData.cate_count = obj.attr("item_cnt");                
                                }
                                checkfirst_color();

                            });
                        }, 300);                
                    }
                    $scope.findfirstCate = function(firstNo){
                        var cate = {
                            divObjNo : "",
                            divObjNm : "",
                            goodsCnt : 0
                        };
                        angular.forEach($scope.itemCateDataList, function(val, key) {
                            if(val.divObjNo == firstNo){
                                cate = val;                    
                            }
                        });
                        return cate;
                    }
                function checkfirst_color(){
                    //console.log($scope.cate_first, $scope.itemCateDataList[1].divObjNm);
                    if($scope.screenData.cate_first == $scope.itemCateDataList[1].divObjNm){
                        $scope.firstcate_flag = false;        
                    }else{
                        $scope.firstcate_flag = true;        
                    }
                }                
                //eung ============== 상품리스트 end ==============    
                
                
                
            	/* tab */
            	$scope.tabDepChange = function (take) { // 탭 변경
            		$scope.screenData.take = take;		
					var tclickCode = "";
					if (take == "a") { // 수량한정찬스
						tclickCode = "m_DC_SpeDisp_Mom&baby_Clk_Tap01";
					} else if (take == "b") { // 브랜드할인쿠폰 
						tclickCode = "m_DC_SpeDisp_Mom&baby_Clk_Tap02";
					}
					if (tclickCode) {
						$scope.sendTclick("m_DC_SpeDisp_Mom&baby_Clk_Tap0" + (take == "a" ? "1" : "2"));
					}
				};
				
				$scope.stategeBannerClick = function(linkUrl, tclick) {
                	if (linkUrl) {
                		window.location.href = linkUrl+"&"+$scope.baseParam  + "&curDispNoSctCd=95" + (tclick ? "&tclick=" + tclick : "");
                	}
                }
				
				//상품정보 로드
				$http.get(LotteCommon.sslive_good) 
					.success(function(data) {
						//console.log(data);
						$scope.goods_info = data.sslive;
						if($scope.goods_info != undefined && $scope.goods_info.goods_no != 0){
							$scope.sslive_vod_flag = true;
						}                
				});
				
				/**
				 * @ngdoc function
				 * @name PlanshopCtrl.changeTemplate
				 * @description
				 * 템플릿 변경
				 * @example
				 * $scope.changeTemplate(type)
				 * @param {String} 템플릿 타입
				 */
				// 템플릿 변경
				$scope.changeTemplate = function(tp) {
					$scope.sendTclick($scope.tClickBase + 'Mom&baby_Clk_Pico_' + tp);
					$scope.firstcate_flag = false;//20170309
					//var firstitem = $scope.findfirstCate($scope.productList[0].divObjNo);
					//$scope.cate_first = firstitem.divObjNm;
					//$scope.cate_count = firstitem.goodsCnt;
					//checkfirst_color();
					$scope.templateType = tp;
					//var sess = {};
					//sess.templateType = $scope.templateType;
					//LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
					//setCookie($scope.screenID+'TemplateType', $scope.templateType);
				};
                
             
                
				
            }
        };
        
    }]);
    
    app.directive('infantMallCtg',['$window','LotteCommon', function($window, LotteCommon) {
		return {
			templateUrl: '/lotte/resources_dev/mall/infant/infant_mall_ctg_container.html',
			link: function ($scope, el, attrs) {
                // $scope.menufix = false;
				
	            // angular.element($window).on('scroll', function(evt) {
	            // 	if(angular.element($window).scrollTop() > 45){
	            // 		$scope.menufix = true;
	            // 	}else{
	            // 		$scope.menufix = false;
	            // 	}
	            // });
	            
	            // 헤더 상단 메뉴 클릭 (GNB)
				$scope.headerMenuClick = function (dispNo) {
					$scope.sendTclick("m_DC_category_click_" + dispNo);
					$scope.inFantUi.uiDispNo = dispNo;
				};
			}
		};
	}]);
    
	/* header each */
	app.directive('subHeaderEach', ['$window', 'AppDownBnrService',
		function ($window, AppDownBnrService) {
		return {
			replace : true,
			link : function($scope, el, attrs) {
				// var $el = angular.element(el),
				// 	$win = angular.element($window),
				// 	headerHeight = $scope.subHeaderHeight;
	
				// function setHeaderFixed() {
				// 	if ($win.scrollTop() > headerHeight) {
				// 		$el.attr("style", "z-index:10;position:fixed;top:0;width:100%");
				// 		$el.parent().css({paddingTop: $el.outerHeight()});
				// 	} else {
				// 		$el.removeAttr("style");
				// 		$el.parent().css({paddingTop: 0});
				// 	}
				// }
	
				// $win.on('scroll', function (evt) {
				// 	setHeaderFixed();
				// 	setTimeout(setHeaderFixed, 300);
				// });
	
				// 앱다운로드 배너 상태 값 변경 확인
				// $scope.$watch(function () { return AppDownBnrService.appDownBnrInfo.isShowFlag }, function (newValue, oldValue) {
				// 	if (typeof newValue !== 'undefined') {
				// 		headerHeight = AppDownBnrService.appDownBnrInfo.isShowFlag ? $scope.subHeaderHeight + $scope.subHeaderHeight : $scope.subHeaderHeight;
				// 	}
				// });
				
                var $el = angular.element("#infantCtg"),
                    $win = angular.element($window),
                    headerHeight = $scope.subHeaderHeight;

                $win = angular.element($window),
                headerHeight = $scope.subHeaderHeight;

                function setHeaderFixed() {
					$el = angular.element("#infantCtg");

                    if ($scope.appObj.isNativeHeader) {
                        headerHeight = 0;
                    }

                    if ($win.scrollTop() >= 47) {
                        $el.attr("style", "z-index:100;position:fixed;top:" + headerHeight +"px;width:100%");
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
	
	 /**
	 * @ngdoc directive
	 * @name Infant.directive:subCateSelect
	 * @description
	 * 서브카테고리 directive
	 */
	// 하단구분자-중메뉴
	app.directive('subCateSelect', ['$window','$timeout', '$location', function($window,$timeout,$location) {
		return {
			templateUrl:'/lotte/resources_dev/mall/infant/infant_sub_ctg_select_container.html',
			replace:true,
			link:function($scope, el, attrs) {				
				
				$scope.allSubCateClick = function () {
						$scope.sendTclick("");
						$scope.allSubCateOpenFlag = !$scope.allSubCateOpenFlag;
					};
				
				$timeout(function(){
					var imgLoad = angular.element(".plan_bannerWrap img,.prd_swipe img"); //구분자 위 이미지 로딩
					   
                    /*
				angular.element(".prod_list_swipe").on('touchend.checkswipe mouseup.checkswipe', function(event) { // 터치 종료
                    console.log(event);
                });*/
                    
				},1500);
			}
		};
	}]);
	
	/**
	 * @ngdoc directive
	 * @name Planshop.directive:sortCate
	 * @description
	 * 하단구분자 directive
	 */
	// 하단구분자-상품리스트
	app.directive('sortCate', ['$window','$timeout', '$location', function($window,$timeout,$location) {
		return {
			templateUrl:'/lotte/resources_dev/product/m/product_list_select_container2.html',
			replace:true,
			link:function($scope, el, attrs) {
				$timeout(function(){
					var imgLoad = angular.element(".plan_bannerWrap img,.prd_swipe img"); //구분자 위 이미지 로딩
					
 
				},1500);
                
               
			}
		};
	}]);
	
	/**
	 * @ngdoc directive
	 * @name Planshop.directive:sortCate
	 * @description
	 * 하단구분자 directive
	 */
	// 하단구분자 기획전 댓글 기능 추가
	app.directive('commentModule', ['$window','$http', 'LotteCommon', 'LotteCookie', function($window,$http,LotteCommon,LotteCookie) {
		return {
			templateUrl:'/lotte/resources_dev/mall/infant/infant_comment.html',
			replace:true,
			link:function($scope, el, attrs) {		
				
				// INPUT 데이터 초기화				
		    	$scope.input = {};
		    	$scope.input.commentTxt = '';
				$scope.commentListIndex;
				$scope.commentListClick = function(idx){
					if($scope.commentListIndex == idx){
						$scope.commentListIndex = null;
					}else{
						$scope.commentListIndex = idx;
					}
				};	
				$scope.reqDetailParam = {
						NoArrList:[]
				};
				$scope.commentList = [];
				$scope.commentListPage = 1; // Comment 현재페이지
				
				$scope.registerCheck = function() {
					// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				//$scope.loginProc('N');
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = '/login/m/loginForm.do?' + targUrl;
        				return;   
        			}		
				}				
				
				// register(): 등록
		    	$scope.register = function(cont, index) {  		
		    		// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				//$scope.loginProc('N');
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = '/login/m/loginForm.do?' + targUrl;
        				return;   
        			}	
		    		var commentTxt = $scope.input.commentTxt;
					var commentTxtElement = document.querySelector('#commentTxt');
					if (commentTxt.trim().length == 0) {
						alert('댓글을 남겨주세요.');
						commentTxtElement.focus();
						return false;
						
					}
					if (calcBytes(commentTxt) > 400) {
						alert('댓글은 200자[한글기준] 이내로 제한되어 있습니다.');
						commentTxtElement.focus();
						return false;
					}		    		
					
					$.ajax({
						type: 'POST',
						url : LotteCommon.petCommentRegData + "?bb_tgt_no="  + $scope.item.bbc_no,
						data: {cont : commentTxt}						
						}).
						success(function (data) {              
	                		if(data.commentInsert.response_code == "reg_success"){
	                    		alert( "등록되었습니다.");
	                    		$http.get(LotteCommon.petCommentData + "?bbc_no="  + $scope.item.bbc_no)
	    						.success(function (data) {
	    							//$scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn07");
	    							$scope.commentData = data.comment_list; //
									$scope.commentListData = [];
									if(data.comment_list.comment != null){
										//" 가공처리
										for(var i=0; i<data.comment_list.comment.items.length; i++){
											data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&#34;").join('"');
											data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&lt;").join('<');
											data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&gt;").join('>');
										}
										$scope.commentListData = data.comment_list.comment.items; //						
										$scope.commentLoginidData = data.comment_list.comment.items.login_id; //
										//console.log($scope.commentListData);
										$scope.item.reply_count += 1;
									}	
	    						});	
	                    		$scope.input.commentTxt = '';
	                        } else if (data.commentInsert.response_code == "reg_fail"){
	                        	alert( "등록이 실패되었습니다.")
	                		}
						}	
					);						 
		    		return false; // form sumbmit 기본 동작 방지
		    	};	    	
		    	
		    	/* 댓글 아이디 글자 짜르기 */
		    	$scope.idChange = function(id){		    		
		    	    var conID = id.substr(0,3);
		    	    for(var i=3;i<id.length; i++){
		    	        conID += "*";
		    	    }
		    	    return conID;        
		    	}
		    	//alert($scope.idChange('abcdefg'));    	
		    	
				
		    	// deleteComment(): 삭제
		    	$scope.deleteComment = function(bbcNo,index, item) {
					var conf = confirm("댓글을 삭제하시겠습니까?");
					if (!conf) return false;                	
					$http.get(LotteCommon.petCommentDeleteData + "?bbTgtNo="  + $scope.item.bbc_no + "&bbcNo=" + item.bbc_no)
                	.success(function (data) {   
                		if(data.commentDelete.response_code == 'del_success'){
                    		alert( "삭제되었습니다.");  							
                    		//$scope.commentListData  =[];
                    		$scope.commentListData.splice(index, 1);
                    		$scope.item.reply_count -= 1;
                        } 	                    
					}) 			
					console.log($scope.commentListData);
				}	
			}
		};
	}]);
	
	/*포토후기::20170414*/
	// Directive
	app.directive('petMallPhotoview',['$http','$window','LotteCommon','$timeout','commInitData', function($http, $window, LotteCommon, $timeout,commInitData) {
		return {
			templateUrl: '/lotte/resources_dev/mall/infant/infant_mall_photoview.html',
			link: function ($scope, el, attrs) {
				$scope.babyPhotoData = function(take) {
					$http.get(LotteCommon.infantPhotoData)
					.success(function (data) {
						var contents = [];
						var newVal = [];
						if(data['dearpet_gallery'] != undefined) {
							$scope.screenData.take = !take ? "a" : take; // 탭 세팅
							contents = data['dearpet_gallery'];
                    
							$scope.screenData.gallery_list = contents.gallery_list.items;
						}
					})
				};
				
				// 이미지자세히보기팝업
				$scope.popOption = {
					open : false,
					cnt : 0,
					data : [],
					zoomPopup : function( c, p, single ){
						$scope.popOption.cnt = c;
						$scope.popOption.data = single ? [$scope.screenData.gallery_list[p]] : $scope.screenData.gallery_list[p].img_list.items;
						$scope.popOption.popState();
						console.log('openPop');
					},
					next : function() {
						if( $scope.popOption.cnt < $scope.popOption.data.length-1 ) $scope.popOption.cnt++;
					},
					prev : function() {
						if( $scope.popOption.cnt > 0 ) $scope.popOption.cnt--;
					},
					popState : function() {
						$scope.popOption.open = !$scope.popOption.open;
						if( $scope.popOption.open ) $("body").addClass('no-scroll');
						else $("body").removeClass('no-scroll');
					}
				}
				
				$scope.keyword_more = false;//
                $scope.moreKeyword = function(){
                    $scope.keyword_more = true;
                }
				
				$scope.contMoreClick = function(item){
					item.open = !item.open;
					item.more = !item.more;
				};
				
				//포토후기상품 링크
				$scope.mallProductClick = function(item, tclick) {
                	var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNoSctCd=95";
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }
					
				$scope.babyPhotoData();
				
			}
		};
	}]);
	
	/*육아꿀팁::20170413*/
	// Directive
	app.directive('infantMallTip',['$http','$window','LotteCommon','$timeout','commInitData', function($http, $window, LotteCommon, $timeout,commInitData) {
		return {
			templateUrl: '/lotte/resources_dev/mall/infant/infant_mall_useful_tip.html',
			link: function ($scope, el, attrs) {
				//console.log("href: "+$(location).attr('href'));
				$scope.swagWriteGo = function(tclick) {
/*				
					로그인한 경우이고 앱의 특정버전 이상인경우
					//로그인 한 경우이고 앱의 특정버전 이하인경우
					
					로그인 한 경우이고 웹인 경우
					
					로그인하지 않은 경우 앱의 특정버전 이상인경우
					//로그인하지 않은 경우 앱의 특정버전 이하인경우
					
					//로그인하지 않은 경우이고 웹인 경우
					로그인 안 한 경우 
*/
					
					
					// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
    					var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = '/login/m/loginForm.do?' + targUrl;
        				return;    
        			} else{
        				if($scope.appObj.isApp){ //앱인경우
        					//버전체크 
                			if(
                			($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 276) ||// 안드로이드 체크, T롯데닷컴이 아닌 경우, 버젼체크(2.7.6 이상)
                			($scope.appObj.isAndroid && $scope.appObj.isSktApp && $scope.appObj.verNumber >= 212) ||// 안드로이드 T롯데닷컴 버전체크 (2.1.2 이상)
                			($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.verNumber >= 2690) || // ios 체크, 버젼체크(2.69.0 이상)
	    					($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.verNumber >= 235)// 아이패드 체크, 버젼체크(2.3.5 이상)
                			)
                			{ 
								console.log('테스트');
                				var url = LotteCommon.swagWriteUrl + "?" + $scope.baseParam + "&top=136";
								if (tclick) {
									url += "&tclick=" + tclick;
								}
								$window.location.href = url;        						
        					}else{ //버전이하
        						if (confirm('롯데닷컴 앱 업데이트 후 이용 가능합니다. 지금 업데이트 하시겠습니까?')) {
            	    				location.href = LotteCommon.appDown + '?' + $scope.baseParam;
            	    			}
        					}
        				} else{ //웹
        					if (confirm('롯데닷컴 앱에서 이용 가능합니다. 지금 설치하시겠습니까?')) {
        	    				location.href = LotteCommon.appDown + '?' + $scope.baseParam;
        	    			}
        				}        				
						
        			}
                }
				/* 추천 */
                $scope.recomm_click = function(item){
                	// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = '/login/m/loginForm.do?' + targUrl;
        				return;   
        			} else{
                        $http.get("/json/mall/pet_recomm_save.json?bbcNo="+item.bbc_no)
                        .success(function(data) {
                            if (data.result == "reg_success") { // 추천완료
                                alert("추천하셨습니다.");
                                item.like_count += 1;
                                $("#recomm_" + item.bbc_no).addClass("on"); 
                            }else if (data.result == "reg_duplicate") { // 중복추천
                                alert("이미 추천하셨습니다.");
                            }else if (data.result == "reg_mywrit") {   // 본인글 추천
                                alert("본인이 작성한 글에는 추천 하실 수 없습니다.");
                            }else {
                                alert("다시 한번 시도해주시기 바랍니다.");
                            }	
                            $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn06");
                        })                                            
                    }
                }
                
				// deleteComment(): 삭제
		    	$scope.deleteSwag = function(item,index) {
					var conf = confirm("글을 삭제하시겠습니까?");
					if (!conf) return false;            
					
					$http.get(LotteCommon.petMallSwagDeleteData + "?bbcNo="  + item.bbc_no)
                	.success(function (data) {   
                		if(data.comment_delete.response_code == '0000'){
                    		alert("삭제되었습니다");  							
                    		//$scope.screenData.gallery_list  =[];
                    		$scope.screenData.gallery_list.splice(index, 1);
                    		console.log($scope.screenData.gallery_list.length);
                    		
                    		$scope.modifyOpen = null;
                        }
					}) 			
					
				}					
		    	
		    	/* 해당 리스트 삭제 레이어  */
		    	$scope.modifyOpen;
				$scope.modifyClick = function(item,idx){
					if($scope.modifyOpen == idx){
						$scope.modifyOpen = null;
						$("#swaglist_" + item.bbc_no).removeClass("on");  
					}else{
						$scope.modifyOpen = idx;
						$("#swaglist_" + item.bbc_no).addClass("on");
					}
				};					
		        
		        // 레이어 닫기
                $scope.hideModify = function(item,idx) {
                	$scope.modifyOpen = null;
                	$("#swaglist_" + item.bbc_no).removeClass("on");  
                };
		    	
				$scope.getswagRewriteUrl = function(item, index) {
					var params = $scope.baseParam + '&bbcNo=' + item.bbc_no;					
		    		return LotteCommon.swagRewriteUrl + "?" + params;
		    	};
				
				
				$scope.babyTipData = function(take) {
					$http.get(LotteCommon.infantTipData)
					.success(function (data) {
						var contents = [];
						var newVal = [];
						contents = data['dearpet_gallery'];
						$scope.screenData.cate_list = contents.cate_list.items;
						for(var k=0; k<contents.cate_list.items.length;k++){
							contents.cate_list.items[k].subopen = false;
						}
						if(data['dearpet_gallery'] != undefined) {
							$scope.screenData.take = !take ? "a" : take; // 탭 세팅
							contents = data['dearpet_gallery'];
                    
							$scope.screenData.gallery_list = contents.gallery_list.items;
						}
						
						/**글내용펼쳐보기**/
						
						$timeout(function(){
							for(var i=0; i< $scope.screenData.gallery_list.length; i++){	
								$scope.screenData.gallery_list[i].big = false;
								$scope.screenData.gallery_list[i].open = false;
								if($("#swaglist_cont" + i).height() > 35){
									$scope.screenData.gallery_list[i].big = true;								
								}
							}	
						}, 100);
						
						$scope.contMoreClick = function(item){
							item.open = !item.open;
							item.more = !item.more;
						};		
						
						if($scope.screenData.galleryTotal < $scope.screenData.page*$scope.screenData.pageSize) {
							$scope.screenData.pageEnd = true;
							$scope.productMoreScroll = false;						
						}				
						
						$scope.productListLoading = false;
						$scope.pageLoading = false;
						
						
						$scope.commentListIndex = -1;
						$scope.commentViewClick = function(item,idx){
							if($scope.commentListIndex == idx){
								//$scope.commentListIndex = "";
							}else{
								$scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn07");
								$scope.commentListIndex = idx;
								// 댓글 추가 //		
								$http.get(LotteCommon.petCommentData + "?bbc_no="  + item.bbc_no)
								.success(function (data) {
									$scope.sendTclick('');
									$scope.commentViewFlag = !$scope.commentViewFlag;
									$scope.commentListData = [];
									
									if(data.comment_list.comment != null){
										//" 가공처리
										for(var i=0; i<data.comment_list.comment.items.length; i++){
											data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&#34;").join('"');
											data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&lt;").join('<');
											data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&gt;").join('>');
										}
										$scope.commentListData = data.comment_list.comment.items; //	
										//console.log($scope.commentListData);
									}
									
								})
							}
							
						}
					})
				};
					
				$scope.babyTipData();
				
				// 이미지자세히보기팝업
				$scope.popOption = {
					open : false,
					cnt : 0,
					data : [],
					zoomPopup : function( c, p, single ){
						$scope.popOption.cnt = c;
						$scope.popOption.data = single ? [$scope.screenData.gallery_list[p]] : $scope.screenData.gallery_list[p].img_list.items;
						$scope.popOption.popState();
						console.log('openPop');
					},
					next : function() {
						if( $scope.popOption.cnt < $scope.popOption.data.length-1 ) $scope.popOption.cnt++;
					},
					prev : function() {
						if( $scope.popOption.cnt > 0 ) $scope.popOption.cnt--;
					},
					popState : function() {
						$scope.popOption.open = !$scope.popOption.open;
						if( $scope.popOption.open ) $("body").addClass('no-scroll');
						else $("body").removeClass('no-scroll');
					}
				}
			}
		};
	}]);

})(window, window.angular);

/* 댓글 기능 추가 */
function calcBytes(txt) {
	var bytes = 0;
	for (i=0; i<txt.length; i++) {
		var ch = txt.charAt(i);
		if(escape(ch).length > 4) {
			bytes += 2;
		} else if (ch == '\n') {
			if (txt.charAt(i-1) != '\r') {
				bytes += 1;
			}
		} else if (ch == '<' || ch == '>') {
			bytes += 4;
		} else {
			bytes += 1;
		}
	}
	return bytes;
}

/* ===========================================================================================
maxLengthCheck(maxSize, lineSize, obj, remainObj)
사용법 : maxLengthCheck("256", "3",  this, remain_intro)
parameter : 
	 maxSize : 최대 사용 글자 길이(필수)
	 lineSize  : 최대 사용 enter 수 (옵션 : null 사용 시 체크 안 함)
	 obj   : 글자 제한을 해야 하는 object(필수)
	 remainObj : 남은 글자 수를 보여줘야 하는 object (옵션 : null 사용 시 사용 안 함)
===========================================================================================*/
function maxLengthCheck(maxSize, lineSize, obj, remainObj) {
	var temp;
	var f = obj.value.length;
	var msglen = parseInt(maxSize);
	var tmpstr = '';
	var enter = 0;
	var strlen;
	if (f == 0){//남은 글자 byte 수 보여 주기
		if (document.getElementById('spn_input_char') != null){//null 옵션이 아닐 때 만 보여준다.
		  document.getElementById('spn_input_char').innerText = msglen;
		}  
	} else {
		for(k = 0; k < f ; k++){
			temp = obj.value.charAt(k);
			if(temp =='\n'){
				enter++;
			}
			if(escape(temp).length > 4){
				msglen -= 2;
			}else{
				msglen--;
			}

			if(msglen < 0){
				alert('총 한글 '+(maxSize/2)+'자 영문 '+maxSize+'자 까지 쓰실 수 있습니다.');
				obj.value = tmpstr;
				break;
			} else if (lineSize != null & enter > parseInt(lineSize)){// lineSize 옵션이 nulldl 아닐 때만 사용
				alert('라인수 '+lineSize+'라인을 넘을 수 없습니다.');
				enter = 0;
				strlen = tmpstr.length -1;
				obj.value = tmpstr.substring(0, strlen);
				break;
			}else{
				if (document.getElementById('spn_input_char') != null){
					document.getElementById('spn_input_char').innerText = msglen;
				}      
				tmpstr += temp;
			}
		}  
	}
}