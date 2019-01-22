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
		'lotteSns',
    ]);

    app.controller('BabyMainCtrl', ['$http', '$scope', 'LotteCommon', 'LotteStorage', 'commInitData', 'LotteUtil','$timeout', '$location', '$window', function($http, $scope, LotteCommon, LotteStorage, commInitData, LotteUtil,$timeout, $location, $window) {
        $scope.screenID = "Mombaby";
    	$scope.isMain = true;
        $scope.showWrap = true;
        $scope.contVisible = true;
		
        /* Start::20170615 페이지별 sns 공유 타이틀 변경적용 */
		var url = $location.absUrl().split('&');
		for(i = 0; i < url.length; i++){
			if(url[i].indexOf('dcate')>-1){
				var dcate = url[i].split('=');
			}
		}
		
		if(dcate != null){		
			switch(dcate[1]){
				case '1':
					$scope.subTitle = "맘&베이비 - 육아 정보가 가득! "
				break;
				case '2':
					$scope.subTitle = "맘&베이비 - 유용한 육아꿀팁보기 "
				break;
				case '3':
					$scope.subTitle = "맘&베이비 - 포토후기 보기 "
				break;
			}
		} else {
			$scope.subTitle = "맘&베이비 - 육아 정보가 가득!"
		}
		/* End::20170615 페이지별 sns 공유 타이틀 변경적용 */
		
        $scope.isShowThisSns = true; /*공유버튼*/
        $scope.allProductFlag = true;
        $scope.allSubCateFlag = true;
        $scope.sortCateTop; //구분자 위치
        $scope.subCateSelectTop;
		$scope.chanceSeason = true;
		$scope.templateType = "list";
		$scope.isProductLoading = true;
        $scope.dataLoadingFinish = false;//eung
        $scope.curDispNoSctCd = 85;//전시유입코드 : (체크 필요)
        $scope.curDispNo="";
        $scope.share_img = "";       
        $scope.showRegBtn = false;
        
        $scope.inFantUi = {
            d_cate : commInitData.query['dcate'],
            m_cate : commInitData.query['mcate'],
            sort : 1,
            cur_key : "",
            sub_dispNo : commInitData.query['dispNo']
        };
        $scope.preview = commInitData.query['preview'];
        if($scope.preview == undefined){$scope.preview = ""};
        /*sort=
1 최신 2 추천 3 댓글*/
        if($scope.inFantUi.sub_dispNo == undefined){
           $scope.inFantUi.sub_dispNo = '5571266';
        }
        if($scope.inFantUi.d_cate == undefined || $scope.inFantUi.d_cate == 0){
            $scope.inFantUi.d_cate = 0;  
        }else{
        	$scope.inFantUi.d_cate = parseInt($scope.inFantUi.d_cate) - 1;
        }
        if($scope.inFantUi.m_cate == undefined || $scope.inFantUi.m_cate == 0){
            $scope.inFantUi.m_cate = 0;  
        }else{
        	$scope.inFantUi.m_cate = parseInt($scope.inFantUi.m_cate) - 1;
        }
        $scope.curDispNo = $scope.inFantUi.sub_dispNo;
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
                max : 10,
                load_more : true,
        		//dispNo: '1',
        		strategeList: [],
        		take: "a" ,// 탭 (a: 수량한정찬스, b : 브랜드할인쿠폰)
				active:false
        	}
        })();
        $scope.addZero = function(v){
            if(v < 10){
                v = "0" + v;
            }
            return v;
        }
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
        $scope.pageLoading = true;
        $scope.loadScreenData = function(take) {
            $scope.screenData.page++;
            $scope.productListLoading = true;
            $http.get(LotteCommon.infantMainData +"?dispNo="+ $scope.inFantUi.sub_dispNo +"&preview="+$scope.preview)
            .success(function(data) {
                var contents = [];
                var newVal = [];     
                
				$timeout(function(){
                    if(angular.element(".unitWrap").length > 0){
                        $scope.sortCateTop = angular.element(".unitWrap").offset().top - $scope.headerHeight - 54;                 
                    }                    
				},1500);                
                //init
                $scope.screenData.html_0 = null;
                $scope.screenData.html_1 = null;
                $scope.screenData.html_2 = null;
                $scope.screenData.html_3 = null;
                $scope.screenData.html_4 = null;
                $scope.screenData.StrategeList = null;
                $scope.screenData.BestBrandList = null;
                $scope.screenData.KeyWrodList = null;
                $scope.screenData.FreeTester = null;
                $scope.screenData.UsefulTip = null;
                $scope.screenData.PhotoReview = null;
                $scope.total_product = null;
                $scope.screenData.ProductList = null;
                $scope.divObjNoParam = "";
                if(data['baby_main'] != undefined) {
                	
                	contents = data['baby_main'];
                    $scope.screenData.cate_list = contents.cate_list.items;
                    $scope.screenData.cateName = contents.cate_list.items[$scope.inFantUi.d_cate].sub_cate_list[$scope.inFantUi.m_cate].disp_nm;
					/* html 배너 */
                    //html 리플레이스 처리 
                    if(contents.topHtml != null){
                        $scope.screenData.html_0 = $scope.replaceHTML(contents.topHtml.items[0].html_cont);
                    }
                    
                    if(contents.freeHtml != null){
                        $scope.screenData.html_1 = $scope.replaceHTML(contents.freeHtml.items[0].html_cont);
                    }
                    if(contents.freeHtml2 != null){
                        $scope.screenData.html_2 = $scope.replaceHTML(contents.freeHtml2.items[0].html_cont);
                    }
                    if(contents.freeHtml3 != null){
                        $scope.screenData.html_3 = $scope.replaceHTML(contents.freeHtml3.items[0].html_cont);
                    }
                    if(contents.freeHtml4 != null){
                        $scope.screenData.html_4 = $scope.replaceHTML(contents.freeHtml4.items[0].html_cont);
                    }
                    if(contents.keywordList != null){
                       $scope.screenData.KeyWrodList = contents.keywordList;
                    }
					//$scope.screenData.FreeBanner = contents.freeHtml.items //자유배너
					if(contents.stratege != null){ //수량한정찬스가 없는 경우
                        if(contents.stratege.items[0].itemType == 'brand' || (contents.stratege.items[0].itemType == undefined && contents.stratege.items[0].title == "브랜드 할인쿠폰")){
                            $scope.screenData.StrategeList = [];
                            $scope.screenData.StrategeList.push({
                                title : "수량한정찬스",
                                prd_list : {
                                    items : null
                                }
                            });
                            $scope.screenData.StrategeList.push(contents.stratege.items[0]);                            
                        }else if(contents.stratege.items.length == 1 && contents.stratege.items[0].itemType != 'brand'){ //브랜드가 없는경우
                            $scope.screenData.StrategeList = [];
                            $scope.screenData.StrategeList.push(contents.stratege.items[0]);                            
                                $scope.screenData.StrategeList.push({
                                title : "브랜드 할인쿠폰"
                            });
                                 
                        }else{ //둘다 있는 경우 
                            $scope.screenData.StrategeList = contents.stratege.items; //한정수량찬스 & 브랜드할인쿠폰    
                        }
                        
                        if( $scope.screenData.StrategeList[0].prd_list.items != null){
                            $scope.screenData.StrBgImg =  $scope.screenData.StrategeList[0].prd_list.items[0].imgUrl550;    
                            $scope.screenData.SoldOutChk_1 =  $scope.screenData.StrategeList[0].prd_list.items[0].invQty;
                            $scope.screenData.SoldOutChk_2 =  $scope.screenData.StrategeList[0].prd_list.items[0].soldOut;
                            $scope.screenData.take = 'a';
                            //SoldOut 일때 브랜드할인쿠폰 탭 노출
        					if($scope.screenData.SoldOutChk_1 < 1 || $scope.screenData.SoldOutChk_2 == true){
        						$scope.screenData.take = 'b';
        					}
        					// 탭데이타가 하나인경우 예외처리함
        					if($scope.screenData.StrategeList[0].prd_list.items.length < 2){
        						$scope.screenData.take = 'a';
        					}
        					var start_date = $scope.screenData.StrategeList[0].prd_list.items[0].startDate;
        					var today_date = new Date();
        					today_date=today_date.getFullYear() +'-'+ setDigit(today_date.getMonth() + 1) +'-'+ setDigit(today_date.getDate()) +' '+ setDigit(today_date.getHours()) +':'+ setDigit(today_date.getMinutes()) +':'+ setDigit(today_date.getSeconds()) + '.0';
        					function setDigit(value){
        						return ((value + "").length < 2) ? "0" + value : value + "";
        					}
        					if(start_date > today_date ){
        						$scope.chanceSeason = false;
        					}
                            
                        }else{
                            $scope.screenData.take = 'b';                            
                        }
						
                        if($scope.screenData.StrategeList[0].img_list){
							/* 한정찬스 뱃지이미지와 솔드아웃 이미지 처리 */
							if($scope.screenData.StrategeList[0].img_list.items && $scope.screenData.StrategeList[0].img_list.items.length > 0){
								var tempItem = $scope.screenData.StrategeList[0].img_list.items[0];
								if(tempItem.type== 'FLAG'){
									$scope.screenData.StrBadge = tempItem.img_url; //한정수량 badge
								}else{
									$scope.screenData.StrSoldOut = tempItem.img_url; //솔드아웃 image
									$scope.soldOutActive = true;
								}
							}
                            if($scope.screenData.StrategeList[0].img_list.items && $scope.screenData.StrategeList[0].img_list.items.length > 1){
                            	var tempItem = $scope.screenData.StrategeList[0].img_list.items[1];
                            	if(tempItem.type== 'FLAG'){
                            		$scope.screenData.StrBadge = tempItem.img_url; //한정수량 badge
                            	}else{
                            		$scope.screenData.StrSoldOut = tempItem.img_url; //솔드아웃 image
                            		$scope.soldOutActive = true;
                            	}
                            }
                        }
                        $scope.screenData.StrCoupon = null;
                        if($scope.screenData.StrategeList[1].html_list != null){
                            $scope.screenData.StrCoupon = $scope.replaceHTML($scope.screenData.StrategeList[1].html_list.items[0].html_cont);    
                        }
                        
                        
                        //$scope.chanceSeason
                        
                    }

					//END:한정수량 soldout 체크
                    $scope.screenData.BestBrandList = contents.bestBrandList; //믿고 쓰는 Best 브랜드
                    if(contents.keywordList != null){
                        $scope.screenData.KeyWordList = contents.keywordList.keyword_list.items; // 관련 검색 키워드
                    }
                    $scope.screenData.FreeTester = contents.freeBannerList; //무료 체험 기회
                    $scope.screenData.UsefulTip = contents.userfulTip; //육아꿀팁
                    $scope.screenData.PhotoReview = contents.photoReview;// 포토후기
                    
					//$scope.screenData.ProductList = contents.prd_list.items[0].prd_list.items; //상품리스트(메인)
        			$scope.productListLoading = false;
                    $scope.pageLoading = false;                    
                    
                    //eung ============== 상품리스트 start ==============
                    if(contents.prd_list != null){
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
                                goodsCnt : $scope.total_product[i].prdList.items.length
                              });     
                            //전체상품리스트
                            if(i > 0){
                                $scope.allList.push({
                                    cateflag : true,
                                    divObjNm : $scope.total_product[i].title,
                                    count : $scope.total_product[i].prdList.items.length,
                                    id : "0" + i
                                });                            
                            }
                            for(k=0; k<$scope.total_product[i].prdList.items.length;k++){
                                $scope.total_product[i].prdList.items[k].divObjNo = i;
                                $scope.total_product[i].prdList.items[k].divObjNm = $scope.total_product[i].title;
                                $scope.total_product[i].prdList.items[k].cnt = $scope.total_product[i].prdList.items.length;
                                $scope.allList.push($scope.total_product[i].prdList.items[k]);
                            }
                        }
                        $scope.screenData.ProductList = $scope.allList.slice(0, $scope.screenData.page*10);
                        $scope.screenData.cate_first = $scope.itemCateDataList[1].divObjNm;
                        $scope.screenData.cate_count = $scope.itemCateDataList[1].goodsCnt;  

                        $scope.divName = $scope.itemCateDataList[$scope.selectCate].divObjNm;
                        //$scope.divObjNoParam = $scope.itemCateDataList[$scope.selectCate].id;  
                        //eung ============== 상품리스트 end ==============						
                        $scope.share_img = $scope.screenData.ProductList[0].img_url;
                    }
                }
                
            }).error(function(data){
                console.log('Error Data : 데이터 로딩 에러');
                $scope.productListLoading = false;
                $scope.pageLoading = false;
            });
        }
        $scope.setSort = function(v){
            $scope.inFantUi.sort = v;
            $scope.screenData.page = 0;
            $scope.screenData.load_more = true;            
            $scope.babyTipData('');            
        }
		
		var more_height = $window.innerWidth; // 20170616 더보기 버튼 테블릿/모바일 구분
		
        $scope.babyTipData = function(take) {
            $scope.screenData.page ++;
            if($scope.screenData.load_more){
                $http.get(LotteCommon.infantTipData+"?dispNo="+ $scope.inFantUi.sub_dispNo+ "&page="+$scope.screenData.page+"&pageSize=10&sort="+ $scope.inFantUi.sort+"&preview="+$scope.preview)
                .success(function (data) {
                    
                    var contents = [];
                    var newVal = [];
                    if(data['baby_tip'] != undefined) {
                        $scope.screenData.take = !take ? "a" : take; // 탭 세팅
                        contents = data['baby_tip'];                        
                        if($scope.screenData.page == 1){
                            $scope.screenData.max = contents.max_count;
                            if(contents.top_text != null){
                                $scope.screenData.baby_tip_title = contents.top_text.items[0].title;                                
                            }else{
                                $scope.screenData.baby_tip_title = "";
                            }
                            if(contents.btn_text != null){
                            	$scope.showRegBtn = true;
                                $scope.screenData.baby_tip_btn = contents.btn_text.items[0].title;                                
                            }else{
                            	$scope.showRegBtn = false;
                            }/*else{
                                $scope.screenData.baby_tip_btn = "등록하기";
                            }*/ //20170614 버튼 텍스트 없는 경우 노출 안됨

                            $scope.screenData.gallery_list = [];
                            if(contents.gallery_list != null){
                                $scope.screenData.gallery_list = contents.gallery_list.items;
                                /**글내용펼쳐보기**/						
                                $timeout(function(){
                                    for(var i=0; i< $scope.screenData.gallery_list.length; i++){	
                                        $scope.screenData.gallery_list[i].big = false;
                                        $scope.screenData.gallery_list[i].open = false;
										
										/* Start::20170616 더보기 버튼 테블릿/모바일 구분 */
										if (more_height < 768){
											if($("#swaglist_cont" + i).height() > 36){
												$scope.screenData.gallery_list[i].big = true;								
											}
										} else {
											if($("#swaglist_cont" + i).height() > 162){
												$scope.screenData.gallery_list[i].big = true;								
											}
										}
										/* End::20170616 더보기 버튼 테블릿/모바일 구분 */
                                    }	
                                }, 100);
								if($scope.screenData.gallery_list[0].img_list.items.length == 1){
                                $scope.share_img = $scope.screenData.gallery_list[0].img_list.items[0].img_url;
								}
                            }
                            $scope.screenData.cate_list = contents.cate_list.items;
                            $scope.screenData.cateName = contents.cate_list.items[$scope.inFantUi.d_cate].sub_cate_list[$scope.inFantUi.m_cate].disp_nm;
                            
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
                                    $scope.sendTclick("m_DC_SpeDisp_Mombaby_Clk_Btn08");
                                    $scope.commentListIndex = idx;
                                    // 댓글 추가 //		
                                    $http.get(LotteCommon.infantTipCommentListData + "?bbc_no="  + item.bbc_no)
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
                        }else{
                            if(contents.gallery_list != null){
                                for(var i=0; i<contents.gallery_list.items.length; i++){
                                    $scope.screenData.gallery_list.push(contents.gallery_list.items[i]);
                                }
                                /**글내용펼쳐보기**/						
                                $timeout(function(){
                                    for(var i=0; i< $scope.screenData.gallery_list.length; i++){	
                                        $scope.screenData.gallery_list[i].big = false;
                                        $scope.screenData.gallery_list[i].open = false;
										
										/* Start::20170616 더보기 버튼 테블릿/모바일 구분 */
										if (more_height < 768){
											if($("#swaglist_cont" + i).height() > 36){
												$scope.screenData.gallery_list[i].big = true;								
											}
										} else {
											if($("#swaglist_cont" + i).height() > 162){
												$scope.screenData.gallery_list[i].big = true;								
											}
										}
										/* End::20170616 더보기 버튼 테블릿/모바일 구분 */
										
                                    }	
                                }, 100);                              
                            }                                                
                        }
					}
                })
                
            }
        };
        
        $scope.babyPhotoData = function(take) {
            $scope.screenData.page ++;
            if($scope.screenData.load_more){
                $http.get(LotteCommon.infantPhotoData+"?dispNo="+ $scope.inFantUi.sub_dispNo +"&curDispNo="+ $scope.inFantUi.cur_key + "&page="+$scope.screenData.page+"&pageSize=10"+"&preview="+$scope.preview)
                .success(function (data) {
                    var contents = [];
                    var newVal = [];
                    if(data['baby_photo'] != undefined) {
                        //$scope.screenData.take = !take ? "a" : take; // 탭 세팅
                        contents = data['baby_photo'];
                        $scope.pageLoading = false;                      
                        if($scope.screenData.page == 1){
                            $scope.screenData.max = contents.max_count;                    
                            $scope.screenData.gallery_list = [];
                            if(contents.gallery_list != null){
                                 $scope.screenData.gallery_list = contents.gallery_list.items;
                                 /**글내용펼쳐보기**/						
                                 $timeout(function(){
                                     for(var i=0; i< $scope.screenData.gallery_list.length; i++){	
                                         $scope.screenData.gallery_list[i].big = false;
                                         $scope.screenData.gallery_list[i].open = false;
										 
										 /* Start::20170616 더보기 버튼 테블릿/모바일 구분 */
										if (more_height < 768){
											if($("#swaglist_cont" + i).height() > 36){
												$scope.screenData.gallery_list[i].big = true;								
											}
										} else {
											if($("#swaglist_cont" + i).height() > 162){
												$scope.screenData.gallery_list[i].big = true;								
											}
										}
										/* End::20170616 더보기 버튼 테블릿/모바일 구분 */
                                     }	
                                 }, 100);
                                 if($scope.screenData.gallery_list[0].img_list.items.length == 1){
									$scope.share_img = $scope.screenData.gallery_list[0].img_list.items[0].img_url;
								 }
                            }
                            if(contents.keywordList != null){
                                $scope.screenData.KeyWordListTab = contents.keywordList.keyword_list.items;    
                            }else{
                                $scope.screenData.KeyWordListTab = null;
                            }

                            $scope.screenData.cate_list = contents.cate_list.items;
                            $scope.screenData.cateName =  contents.cate_list.items[$scope.inFantUi.d_cate].sub_cate_list[$scope.inFantUi.m_cate].disp_nm;  
                            setTimeout(function(){
                                $scope.checkBtnPos();    
                            }, 500);                              
                        }else{
                            if(contents.gallery_list != null){
                            	 for(var i=0; i<contents.gallery_list.items.length; i++){
                                     $scope.screenData.gallery_list.push(contents.gallery_list.items[i]);
                                 }
                                 /**글내용펼쳐보기**/
                                 $timeout(function(){
                                     for(var i=0; i< $scope.screenData.gallery_list.length; i++){	
                                         $scope.screenData.gallery_list[i].big = false;
                                         $scope.screenData.gallery_list[i].open = false;
										 
                                         /* Start::20170616 더보기 버튼 테블릿/모바일 구분 */
										if (more_height < 768){
											if($("#swaglist_cont" + i).height() > 36){
												$scope.screenData.gallery_list[i].big = true;								
											}
										} else {
											if($("#swaglist_cont" + i).height() > 162){
												$scope.screenData.gallery_list[i].big = true;								
											}
										}
										/* End::20170616 더보기 버튼 테블릿/모바일 구분 */
										
                                     }	
                                 }, 100);
                            }
                        }
                    }
                })
                
            }            
        };
        
        
		$scope.sortCateTop = 0;

		
		//스크롤시 높이 계산하고, 카테고리 값을 가변적으로 바꾸어줌
		angular.element(window).on('scroll.baby_story', function(evt) {
			if($scope.inFantUi.d_cate == 0){
				if($scope.templateType != "swipe" && $scope.screenData.ProductList != null){
					var titid = 1;
					//var smax = $(".cate_cell").length;                        
					var i = 0;
					var ssh = 0; //높이계산을하기위한 증가치 
					var selH = 174; //한 상품의 높이, list 174, image : 가변 
					var cellmax = $scope.screenType; //한줄에 표시되는 상품의 수 (고정)
					var cellcount = 0; //한줄에 보여지는 개수 (가변)
					if($scope.templateType == "image"){ //이미지형인 경우 가변 처리
						//selH = parseInt($(".prod_list_02 > li:first-child").width() * 1.52);
						selH = parseInt($(".prod_list_02 > li:first-child").height());
						cellmax += 1;
					}
					var harr = [0]; //각 카테고리의 높이 정보                            
					for(;i < $scope.screenData.ProductList.length; i++){
						if($scope.screenData.ProductList[i].cateflag){ //카테고리이면 높이 저장
							harr.push(ssh);
							ssh += 49;
							cellcount = 0;
						}else{ //상품인경우 높이 증가 
							if(cellcount == 0){ //첫번째 상품만 높이 저장 
								ssh += selH;
							}
							cellcount +=1;                                
							if(cellcount >= cellmax){
								cellcount = 0;
							}
						}
					}
					//저장된 높이와 현재의 스크롤위치 비교하여 해당 카테고리 찾아냄 
					for(i=0; i <  harr.length; i++){
						if(this.pageYOffset - $scope.sortCateTop > harr[i]){
							titid = i + 1;
						}                
					}
					if(!$scope.fixflag){
						titid = 0;
					}

					if(titid < $scope.itemCateDataList.length){                            
						$scope.divName = $scope.itemCateDataList[titid].divObjNm;
						//$("#curcatenm").text($scope.divName);
					}

					//페이징 처리 
					//console.log(this.pageYOffset, angular.element("#footer").offset().top - 600);
					if(this.pageYOffset > angular.element("#footer").offset().top - 600){
						$scope.getProductDataLoad();   
					}
				}                        
			}else if($scope.inFantUi.d_cate == 1){
				if(this.pageYOffset > angular.element("#footer").offset().top - 600){
					if($scope.screenData.gallery_list != undefined && ($scope.screenData.page*10 < $scope.screenData.max)){
						$scope.babyTipData();
					}else{
						$scope.screenData.load_more = false;
					}
				}
			}else if($scope.inFantUi.d_cate == 2){
				if(this.pageYOffset > angular.element("#footer").offset().top - 600){
					if($scope.screenData.gallery_list != undefined && ($scope.screenData.page*10 < $scope.screenData.max)){                               
						$scope.babyPhotoData();
					}else{
						$scope.screenData.load_more = false;
					}                        
				}
			}

		});                
        

        
        
        angular.element(window).on("resize.key", function(e){            
            $scope.checkBtnPos();            
        });
        $scope.checkBtnPos = function(){
            if($scope.inFantUi.d_cate == 2 && $scope.screenData.KeyWordListTab){
                var hh = $("#baby_keyword > li:last-child").offset().top;
                if(hh != null && hh > 260){
                   $scope.keyword_btn_show = true;
                }else{
                    $scope.keyword_btn_show = false;
                }     
                $scope.$apply();
            }
        }
        
        $scope.loadPhotoReview = function(curno){
            $scope.inFantUi.cur_key = curno;
            $scope.screenData.page = 0;
            $scope.screenData.load_more = true;                        
            $scope.babyPhotoData('');
        }
		$scope.getProductDataLoad = function() {
            $scope.screenData.page ++;                      
            if($scope.selectCate == 0){
                if($scope.screenData.ProductList.length < $scope.allList.length){                    
                    $scope.screenData.ProductList = $scope.allList.slice(0, $scope.screenData.page*10);        
                }else{
                    $scope.screenData.page --;                      
                }                
            }else{
               // console.log("$scope.selectCate", $scope.selectCate);
                if($scope.screenData.ProductList.length < $scope.total_product[$scope.selectCate-1].prdList.items.length){
                    $scope.screenData.ProductList = $scope.total_product[$scope.selectCate-1].prdList.items.slice(0, $scope.screenData.page*10);                                    
                }else{
                    $scope.screenData.page --;                      
                }
                
            }
        }
        $scope.replaceHTML = function(html){
            html = html.replace(/\<br(.*?)\>|\<p\>\&nbsp\;\<\/p\>|\<p\>\<br(.*?)\>\&nbsp\;\<\/p\>|null/g, "");//빈값 제거 
            html = html.replace(/\&\#34\;/g, '"').replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>'); //태그 처리             
            return html;
        }
        /*
         * TODO: 화면 나갈때 세션에 데이터 저장 및 세선 체크후 데이터 세팅 부분 공통화 개발 필요
         */
        //$scope.loadScreenData();
        if($scope.inFantUi.d_cate == 0){
            $scope.loadScreenData();
        }else if($scope.inFantUi.d_cate == 1){
            $scope.babyTipData();
        }else if($scope.inFantUi.d_cate == 2){
            $scope.babyPhotoData();   
        }        
        //상세 링크
        $scope.gotoProduct = function(goodno, tclick, index){
            location.href = $scope.baseLink(LotteCommon.prdviewUrl) +"&curDispNo="+$scope.inFantUi.sub_dispNo+ "&curDispNoSctCd=" + $scope.curDispNoSctCd  + "&goods_no=" + goodno +"&tclick="+ tclick + index;
        }
        //일반링크
        $scope.gotoLink = function(link, tclick, index){
            if(link != null){
                location.href = $scope.baseLink(link) + "&tclick="+ tclick + index;
            }else{
                console.log("링크가 없습니다.");
            }
        }
        //검색키워드 링크
        $scope.gotoSearch = function (keyword, tclick, index){
            var linkParams = "&reqType=N&keyword=" + keyword + "&curDispNo=" + $scope.inFantUi.sub_dispNo + "&tclick=" + tclick + index;
            location.href = $scope.baseLink(LotteCommon.searchUrl) + linkParams;
        };
        
        
        
        
        
        
        
        
        
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
            templateUrl : '/lotte/resources_dev/mall/baby/baby_main_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                //eung ============== 상품리스트 start ==============
                    $scope.allProductOpenFlag = false;              
                    // 기획전 상품 Sort Category 열기
                    $scope.allProductClick = function () {
                        //$scope.sendTclick("m_DC_SpeDisp_Mombaby_Clk_Btn_04");
                        $scope.allProductOpenFlag = !$scope.allProductOpenFlag;
                    };                
                    //카테고리 선택
                    $scope.sortCateClick = function(divObjNo, divObjNm, idx){
                        $scope.selectCate = idx;
                        $scope.screenData.page = 1;
                        $scope.divObjNoParam = divObjNo;
                        $scope.inFantUi.cur_key = '';
                        //console.log($scope.screenData.page);
                        $scope.sendTclick("m_DC_SpeDisp_Mombaby_ClkW_Rst_B" + $scope.addZero(idx + 1));
                        if(idx == 0){ //전체보기                                                        
                            $scope.screenData.ProductList = $scope.allList.slice(0, $scope.screenData.page*10);                            
                            //$scope.screenData.ProductList = $scope.allList;    
                            $scope.screenData.cate_first = $scope.itemCateDataList[1].divObjNm;
                            $scope.screenData.cate_count = $scope.itemCateDataList[1].goodsCnt;                                            
                        }else{ //카테고리별 
                            //$scope.screenData.ProductList = $scope.total_product[idx-1].prdList.items;                         
                            $scope.screenData.ProductList = $scope.total_product[idx-1].prdList.items.slice(0, $scope.screenData.page*10);                            
                            $scope.screenData.cate_first = $scope.itemCateDataList[$scope.selectCate].divObjNm;
                            $scope.screenData.cate_count = $scope.itemCateDataList[$scope.selectCate].goodsCnt;                                                                    
                        }                    
                        $scope.divName = $scope.itemCateDataList[$scope.selectCate].divObjNm;
                        $("#curcatenm").text($scope.divName);
                        $scope.allProductOpenFlag = false; //close
                        $scope.checkfirst_color()
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
                                $scope.checkfirst_color();

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
                $scope.checkfirst_color = function(){
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
                    if(take == 'a' && $scope.screenData.StrategeList[0].prd_list.items == null){
                        return;
                    }
                    if(take == 'b' && $scope.screenData.StrCoupon == null){
                        return;
                    }
                    
            		$scope.screenData.take = take;		
					var tclickCode = "";
					if (take == "a") { // 수량한정찬스
						tclickCode = "m_DC_SpeDisp_Mombaby_Clk_Tap01";
					} else if (take == "b") { // 브랜드할인쿠폰 
						tclickCode = "m_DC_SpeDisp_Mombaby_Clk_Tap02";
					}
                    $scope.sendTclick(tclickCode);
				};
				
				$scope.stategeBannerClick = function(linkUrl, tclick) {
                	if (linkUrl) {
                		window.location.href = linkUrl+"&"+$scope.baseParam  +"&curDispNo="+$scope.inFantUi.sub_dispNo+ "&curDispNoSctCd=" + $scope.curDispNoSctCd  + (tclick ? "&tclick=" + tclick : "");
                	}
                }
				
				//이미지자세히보기팝업
				$scope.popOption = {
					open : false,
					cnt : 0,
					data : [],
					zoomPopup : function( c, p, single ){

						if(c == "mom"){ //스와이프에서 선택한 사진
							c = parseInt($("ol#ii_"+p).find('li.active').attr('v'));
							if($("ol#ii_"+p).length == 0){
								c = 0;
							}
						}

						$scope.popOption.cnt = c;
						$scope.popOption.data = single ? [$scope.screenData.gallery_list[p]] : $scope.screenData.gallery_list[p].img_list.items;
						$scope.popOption.popState();
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
				/*
				//상품정보 로드
				$http.get(LotteCommon.sslive_good) 
					.success(function(data) {
						//console.log(data);
						$scope.goods_info = data.sslive;
						if($scope.goods_info != undefined && $scope.goods_info.goods_no != 0){
							$scope.sslive_vod_flag = true;
						}                
				});
				*/
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
					$scope.sendTclick($scope.tClickBase + 'Mombaby_Clk_Pico_' + tp);
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
    
    app.directive('infantMallCtg',['$window','LotteCommon', 'AppDownBnrService', function($window, LotteCommon, AppDownBnrService) {
		return {
			templateUrl: '/lotte/resources_dev/mall/baby/baby_mall_ctg_container.html',
			link: function ($scope, el, attrs) {

                var $body = angular.element('body'),
                $headerSpace = angular.element('#headerSpace'),
                $container = angular.element('#container');
                $scope.menufix = false;

				var $el = angular.element(el).find(".ctg_list"),
					$win = angular.element($window),
					headerHeight = $scope.subHeaderHeight;

				function setHeaderFixed() {
					if ($scope.appObj.isNativeHeader) {
						headerHeight = 0;
					}

					if ($win.scrollTop() >= 46) {
						$el.attr("style", "z-index:10;position:fixed;top:" + headerHeight +"px;width:100%");
					} else {
						$el.removeAttr("style");
					}
				}

				$win.on('scroll', function (evt) {
					setHeaderFixed();
					setTimeout(setHeaderFixed, 300);
				});
	
				// 앱다운로드 배너 상태 값 변경 확인
				$scope.$watch(function () { return AppDownBnrService.appDownBnrInfo.isShowFlag }, function (newValue, oldValue) {
					setHeaderFixed();
				});
	            
	            // 헤더 상단 메뉴 클릭 (GNB)
				$scope.headerMenuClick = function (obj, index, tclick) {
                    if($scope.screenData.cate_list != null){
                        //범위를 벗어나면 초기화 시킴
                        if($scope.screenData.cate_list[index].sub_cate_list.length <= $scope.inFantUi.m_cate){
                            $scope.inFantUi.m_cate = 0;
                        }                        
                        $scope.inFantUi.sub_dispNo = $scope.screenData.cate_list[index].sub_cate_list[$scope.inFantUi.m_cate].disp_no;  
                        $scope.curDispNo = $scope.inFantUi.sub_dispNo;
						//console.log($scope.inFantUi.sub_dispNo);
                    }
                    if(tclick == ''){
                       tclick = "m_DC_SpeDisp_Mombaby_Clk_0"+(index + 1); 
                    }
                    
                    location.href = $scope.baseLink(LotteCommon.infantMainUrl) + "&dispNo=" + $scope.inFantUi.sub_dispNo + "&dcate="+(index+1)+ "&mcate="+($scope.inFantUi.m_cate+1) +"&tclick=" + tclick;
					//console.log(obj.disp_no);
					
				};
			}
		};
	}]);
    
	/* header each */
	app.directive('subHeaderEach', ['$window', 'AppDownBnrService',
		function ($window, AppDownBnrService) {
		return {
			replace : true,			
			restrict : "C",// 20170421추가 class를 통한 directive 호출
			link : function($scope, el, attrs) {
				// var $el = angular.element(el),
				// 	$win = angular.element($window),
				// 	headerHeight = $scope.subHeaderHeight;

				// function setHeaderFixed() {
				// 	if ($scope.appObj.isNativeHeader) {
				// 		headerHeight = 0;
				// 	}

				// 	if ($win.scrollTop() >= 0) {
				// 		$el.attr("style", "z-index:10;position:fixed;top:" + headerHeight +"px;width:100%");
				// 	} else {
				// 		$el.removeAttr("style");
				// 	}
				// }

				// $win.on('scroll', function (evt) {
				// 	setHeaderFixed();
				// 	setTimeout(setHeaderFixed, 300);
				// });
	
				// // 앱다운로드 배너 상태 값 변경 확인
				// $scope.$watch(function () { return AppDownBnrService.appDownBnrInfo.isShowFlag }, function (newValue, oldValue) {
				// 	setHeaderFixed();
				// });
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
			templateUrl:'/lotte/resources_dev/mall/baby/baby_sub_ctg_select_container.html',
			replace:true,
			link:function($scope, el, attrs) {				
				
				$scope.allSubCateClick = function () {
					$scope.sendTclick("");
					$scope.allSubCateOpenFlag = !$scope.allSubCateOpenFlag;
				};
				
				$scope.subCateClick = function(dispno, idx){
                    $scope.sendTclick("m_DC_SpeDisp_Mombaby_Clk_" + $scope.addZero(idx + 1));
                    angular.element(window).scrollTop(0);
                    $scope.allSubCateOpenFlag = false;
                    $scope.inFantUi.m_cate = idx;
                    $scope.inFantUi.sub_dispNo = dispno;   
                    $scope.curDispNo = $scope.inFantUi.sub_dispNo;
                    $scope.screenData.page = 0;
                    $scope.screenData.load_more = true;
                    $scope.screenData.max = 10;
                    
                    if($scope.inFantUi.d_cate == 0){
                        $scope.loadScreenData();
                    }else if($scope.inFantUi.d_cate == 1){
                        $scope.babyTipData();
                    }else if($scope.inFantUi.d_cate == 2){
                        $scope.babyPhotoData();   
                    }
                    
                    
                    
				}
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
	app.directive('commentModule', ['$window','$http', '$timeout', 'LotteCommon', 'LotteCookie', function($window,$http, $timeout, LotteCommon,LotteCookie) {
		return {
			templateUrl:'/lotte/resources_dev/mall/baby/baby_comment.html',
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
				
				/* 20170529 덧글입력 focus일때 */
				$scope.focuseIn = function(){
					//$scope.screenData.active=true;
					$timeout(function(){
						$scope.screenData.active=true;
					}, 300);
				};
				
				$scope.focuseOut = function(){
					$timeout(function(){
						$scope.screenData.active=false;
					}, 300);
				};
				
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
        			} else {
        				var $el = angular.element("#head_sub"); 
        				$el.attr("style", "position:fixed; top:0");
        			}
                    $scope.sendTclick("m_DC_SpeDisp_Mombaby_Clk_Btn_09");                    
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
						url : LotteCommon.infantTipCommentWriteData + "?bb_tgt_no="  + $scope.item.bbc_no,
						data: {cont : commentTxt}						
						})
						.success(function (data) {              
	                		if(data.commentInsert.response_code == "reg_success"){
	                    		alert( "등록되었습니다.");
	                    		$http.get(LotteCommon.infantTipCommentListData + "?bbc_no="  + $scope.item.bbc_no)
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
					$http.get(LotteCommon.infantTipCommentDeleteData + "?bbTgtNo="  + $scope.item.bbc_no + "&bbcNo=" + item.bbc_no)
                	.success(function (data) {   
                		if(data.commentDelete.response_code == 'del_success'){
                    		alert( "삭제되었습니다.");  							
                    		//$scope.commentListData  =[];
                    		$scope.commentListData.splice(index, 1);
                    		$scope.item.reply_count -= 1;
                        } 	                    
					}) 			
				}	
			}
		};
	}]);
	
	/*포토후기::20170414*/
	// Directive
	app.directive('infantMallPhotoview',['$http','$window','LotteCommon','$timeout','commInitData', function($http, $window, LotteCommon, $timeout,commInitData) {
		return {
			templateUrl: '/lotte/resources_dev/mall/baby/baby_mall_photoview.html',
			link: function ($scope, el, attrs) {
				$scope.keyword_more = false;
                $scope.moreKeyword = function(){
                    if($scope.keyword_more){
						$scope.keyword_more = false;
					} else {
						$scope.keyword_more = true;
					}
                }
                
				$scope.contMoreClick = function(item){
					item.open = !item.open;
					item.more = !item.more;
				};
				
				//포토후기상품 링크
				$scope.mallProductClick = function(item, tclick) {
                	var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no +"&curDispNo="+$scope.inFantUi.sub_dispNo+ "&curDispNoSctCd=" + $scope.curDispNoSctCd ;
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }
					
				//$scope.babyPhotoData();
				
			}
		};
	}]);
	
	/*육아꿀팁::20170413*/
	// Directive
	app.directive('infantMallTip',['$http','$window','LotteCommon','$timeout','commInitData','LotteStorage', function($http, $window, LotteCommon, $timeout,commInitData,LotteStorage) {
		return {
			templateUrl: '/lotte/resources_dev/mall/baby/baby_mall_useful_tip.html',
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
								//console.log('테스트');
                				var url = LotteCommon.infantTipWriteUrl + "?" + $scope.baseParam + "&top=136";
								if (tclick) {
									url += "&mcate=" + ($scope.inFantUi.m_cate+1) + "&tclick=" + tclick;
								}
                                //console.log(LotteCommon.infantTipWriteUrl);
                                
                                LotteStorage.setSessionStorage('param_more1', $scope.screenData.cateName);
                                LotteStorage.setSessionStorage('param_more2', $scope.inFantUi.sub_dispNo);
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
                        $http.get("/json/mall/baby_recomm_save.json?bbcNo="+item.bbc_no)
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
                            $scope.sendTclick("m_DC_SpeDisp_Mombaby_Clk_Btn_07");
                        })                                            
                    }
                }
                
				// deleteComment(): 삭제
		    	$scope.deleteSwag = function(item,index) {
					var conf = confirm("글을 삭제하시겠습니까?");
					if (!conf) return false;            
					
					$http.get(LotteCommon.infantTipDeleteData + "?bbcNo="  + item.bbc_no)
                	.success(function (data) {   
                		if(data.comment_delete.response_code == '0000'){
                    		alert("삭제되었습니다");  							
                    		//$scope.screenData.gallery_list  =[];
                    		$scope.screenData.gallery_list.splice(index, 1);
                    		//console.log($scope.screenData.gallery_list.length);
                    		
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
					var params = $scope.baseParam + '&bbcNo=' + item.bbc_no +"&dispNo="+$scope.inFantUi.sub_dispNo + "&mcate=" +($scope.inFantUi.m_cate+1);					
		    		return LotteCommon.infantTipRewriteUrl + "?" + params;
		    	};
				
				
					
				//$scope.babyTipData();
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