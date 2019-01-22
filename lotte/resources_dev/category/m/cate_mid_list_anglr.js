
(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteProduct',
        'lotteNgSwipe',
        'lotteMainPop'
    ]);


    app.controller('CateMidListCtrl', ['$window', '$location' ,'$http', '$scope', '$timeout', '$filter', 'LotteStorage', 'LotteCommon','commInitData', 'LotteUtil', function($window, $location ,$http, $scope, $timeout, $filter, LotteStorage, LotteCommon, commInitData, LotteUtil) {
		$scope.rScope = LotteUtil.getAbsScope($scope);
		$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.productMoreScroll = true;
        $scope.screenID = "cateTpl";
        $scope.pageLoading = true; //페이지 첫 로딩
        $scope.subTitle = " ";
        
        //배너 관련 날짜 설정 20180821 추석 추가
        $scope.todayDate = new Date();
		if (commInitData.query["testDate"]) {
			var todayDate = commInitData.query["testDate"]; // 년월일
			var todayTime = new Date(
				todayDate.substring(0, 4), // 년
				parseInt(todayDate.substring(4, 6)) - 1, // 월
				todayDate.substring(6, 8), // 일
				todayDate.substring(8, 10), // 시간
				todayDate.substring(10, 12), // 분
				todayDate.substring(12, 14)); // 초
			$scope.todayDate = todayTime;
		}        
        
        $scope.chusBanner = false; //설배너 1.4 00시 이후 활성화 1.30 24시 종료
		if ($scope.todayDate.getTime() >= (new Date(2019, 0, 4, 0)).getTime() && $scope.todayDate.getTime() <= (new Date(2019, 0, 30, 23,59,59)).getTime()){
            $scope.chusBanner = true;
		}
        
        LotteStorage.delSessionStorage('cateListLoc');
        LotteStorage.delSessionStorage('cateListData');
        LotteStorage.delSessionStorage('cateListScrollY');
        //추천기획전 스와이프 관련
        $scope.control = null;
        $scope.sb_index = 1;
        $scope.mom_index = 1;
        //외부에서 호출하는 함수
        $scope.getControl1 = function(control){
            $scope.control = control;
        }
        $scope.setInfo = function(id){                    
            $scope.sb_index = id + 1;
        } 
        $scope.midSlide = function(dir){
            $scope.control.moveIndex(($scope.sb_index - 1) + dir);
        }
        $scope.setInfoMom = function(id){                    
            $scope.mom_index = id + 1;
        } 
        //추천상품 스와이프 관련
        $scope.control2 = null;
        $scope.sb_index2 = 1;
        //외부에서 호출하는 함수
        $scope.getControl2 = function(control){
            $scope.control2 = control;
        }
        $scope.setInfo2 = function(id){                    
            $scope.sb_index2 = id + 1;
        } 
        $scope.midSlide2 = function(dir){
            $scope.control2.moveIndex(($scope.sb_index2 - 1) + dir);
        }
        $scope.getProductImage2 = function(item) {
            var newUrl = "";
            if(item.img_url == null) {
                return "";
            }
            var imgurl = item.img_url.replace('_280', '_550');            
            
            if(commInitData.query['adultChk'] == "Y") {
                return imgurl;
            }
            if(item.pmg_byr_age_lmt_cd != '19' || item.pmg_byr_age_lmt_cd == undefined) {
                if(item.img_url != "") {
                    newUrl = imgurl;
                }
            } else {
                if (!$scope.loginInfo.isAdult) { /*로그인 안한 경우*/
                    newUrl = "http://image.lotte.com/lotte/mobile/sub/img_19_280x280.png";
                } else {
                    if(item.img_url != "") {
                        newUrl = imgurl;
                    }
                }
            }
            return newUrl;
        }
        
        /*
         * 스크린 데이터 초기화
         201604
         */
        $scope.screenDataReset = function() {
        	$scope.screenData = {
        		page: 0,
        		disp_name: null,
        		disp_no: null,
        		mGrpNo: '',
        		idx: "",
    			smallCate: [],
    			productBestList: [],
    			rankingBestBuy: [],
                prdPlanList:[], 
                babyBnnerList : [],
                kidsBannerList:[],
                brand:[],
                kids_yn:'',
                babyBnnRolling : false
        	}
			$scope.superDayShoppingBnr = null;
        };
        $scope.screenDataReset();
        /*
         * 화면에 필요한 인자값 세팅
         */
        if(commInitData.query['curDispNo'] != undefined) {
        	$scope.screenData.disp_no = commInitData.query['curDispNo'];
        }
        if(commInitData.query['idx'] != undefined) {
        	$scope.screenData.idx = commInitData.query['idx'];
        }
        if(commInitData.query['title'] != undefined) {
            $scope.subTitle = decodeURIComponent(commInitData.query['title']);
        }
        
        $scope.curDispNo = $scope.screenData.disp_no;
        $scope.curDispNoSctCd = 65;
        
        /*
         * 스크린 데이터 로드
         */
        $scope.loadScreenData = function() {
        	if($scope.screenData.endPage) { // 더이상 데이터 없음 
        		return false;
        	}
        	//console.log("스크린 데이터 로드...");
        	
        	$scope.screenData.page++;
        	$scope.productListLoading = true;
        	$http.get(LotteCommon.smallCategoryData+'?curDispNo='+$scope.screenData.disp_no+'&cateDiv=MIDDLE&idx='+$scope.screenData.idx+"&page="+$scope.screenData.page)
        	.success(function(data) {
        		var contents = [];
        		if(data['max'] != undefined) {
        			contents = data['max'];
        			if(contents.mgrp_no) {
        				$scope.screenData.mGrpNo = contents.mgrp_no;
        			}
                    if( contents.baby_banner_list && !$scope.screenData.babyBnnerList.length ) {
                        $scope.screenData.babyBnnerList = contents.baby_banner_list.items || [];
                        $scope.screenData.babyBnnRolling = $scope.screenData.babyBnnerList.length > 1 ? true : false;
                        $scope.babyBnnWidth = "100%";
                        setTimeout(function(){
                            if( $scope.screenData.babyBnnerList.length ) $scope.babyBnnWidth = $(".bnnBlock .main_slide").innerWidth() + "px";    
                        }, 300);
                    }

         			if($scope.screenData.disp_name == null) {
        				$scope.subTitle = $scope.screenData.disp_name = contents.disp_nm;
        			}
        			if(!$scope.screenData.smallCate.length) {
        				$scope.screenData.smallCate = contents.small_cate.items;
                    }
                    //베스트 카테고리
                    if($scope.screenData.page == 1){ 
                         $scope.screenData.brand = null; //3배수만 남기고 날림
                        if(contents.brand_list && contents.brand_list.items.length > 2){
                            contents.brand_list.items = contents.brand_list.items.splice(0, contents.brand_list.items.length - contents.brand_list.items.length%3);
                            $scope.screenData.brand = contents.brand_list.items;
                        }
                    }
                   
                    //201604
                    var tmp = [];
        			if(!$scope.screenData.productBestList.length && contents.prd_best_list != null) {
        				angular.forEach(contents.prd_best_list.items, function(val, key) {
        					val.genie_yn = true;
        					tmp.push(val);                            
        				});                        
                        setTimeout(function(){
                            $scope.screenData.productBestList = tmp;    
                        }, 500);
        			}
                    //201604
        			if(contents.prd_plan_list != undefined && !$scope.screenData.prdPlanList.length) {
        				$scope.screenData.prdPlanList = contents.prd_plan_list.items;
        			}
        			//201701 유아동 체험단
        			if(!$scope.screenData.kids_yn) $scope.screenData.kids_yn = contents.kids_yn;
        			if(contents.kids_banner_list !=undefined && !$scope.screenData.kidsBannerList.length){
        				$scope.screenData.kidsBannerList = contents.kids_banner_list.items;
        			}
                    
        			if(contents.ranking_best_buy) {
        				if(!contents.ranking_best_buy.items.length) {
        					$scope.productMoreScroll = false;
        				} else {
	        				angular.forEach(contents.ranking_best_buy.items, function(val, key) {
	        					$scope.screenData.rankingBestBuy.push(val);
	        				});
        				}
        			}

                    // 20170421 likearts 맘&베이비 배너
                    if( contents.baby_banner_list ) {
                        $scope.screenData.babyBnnerList = contents.baby_banner_list.items || [];
                        $scope.screenData.babyBnnRolling = $scope.screenData.babyBnnerList.length > 1 ? true : false;
                        $scope.tdata = "123";

                        $scope.babyBnnWidth = "100%";
                        if( $scope.screenData.babyBnnerList.length )
                            $scope.babyBnnWidth = $(".bnnBlock .main_slide").innerWidth() + "px";
                    }
                    // 2017.05.17 롯데슈퍼 당일장보기
					if( contents.super_day_shopping_ban_list ){
						$scope.superDayShoppingBnr = contents.super_day_shopping_ban_list.items;
					}
					
                    $scope.getRolling = function(status)
                    {
                        return "true";
                    }
        			$scope.productListLoading = false;
        		}
        		//console.log($scope.screenData);
        		$scope.pageLoading = false;
            }).error(function(data) {
                $scope.pageLoading = false;
                $scope.productListLoading = false;
            });
        }
        
        setTimeout(function(){
            $("span.title").css("color", "#000");
        }, 500);

        //201604 추천기획전 이동 
        $scope.gotoLinkP = function(no, tclick, idx){
            if(idx < 10){
                idx = "0" + idx;
            }
            var link = "/product/m/product_list.do?"+$scope.baseParam+"&curDispNo=" + no +"&tClick=" + tclick + idx;
            $window.location.href = link;
        }
        
        //201701 유아동 체험단 이동 
        $scope.gotoKidsLink = function(tclick, idx){
        	if(idx < 10){
                idx = "0" + idx;
            }
            var link = LotteCommon.kidsExperienceMainUrl+"?" + $scope.baseParam
            if (tclick) { // tclick이 있다면
                $window.location.href = link + "&tClick=" + tclick + idx;
            } else{
            	 $window.location.href = link;
            }
        }
        $scope.gotoKidsMoreLink = function(tclick){
            var link = LotteCommon.kidsExperienceMainUrl+"?" + $scope.baseParam
            if (tclick) { // tclick이 있다면
                $window.location.href = link + "&tClick=" + tclick;
            } else{
            	 $window.location.href = link;
            }
        }
        // 20170421 likearts 맘&베이비 
        $scope.gotoBabyBnnLink = function( link, tclick )
        {
            var link = link;
            if( link.indexOf("?") != -1 ) link += "&";
            else link += "?";
            link += $scope.baseParam;
             if (tclick) { // tclick이 있다면
                $window.location.href = link + "&tClick=" + tclick;
            } else{
                 $window.location.href = link;
            }
        }
        
        $scope.totalPagePad = function(value){            
            return Math.ceil(value/2);
        }
        // 세션에서 가저올 부분 선언 
        var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
        var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
        var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');
        
        if(StoredLoc == window.location.href && $scope.locationHistoryBack) {
        	var StoredData = JSON.parse(StoredDataStr);
    		$scope.pageLoading = false;

        	$scope.screenData = StoredData.screenData;
        	$scope.subTitle = $scope.screenData.disp_name;
        	$timeout(function() {
        		angular.element($window).scrollTop(StoredScrollY);
        	},800);
        } else {
        	$scope.loadScreenData();
        }
        
        /**
         * unload시 관련 데이터를 sessionStorage에 저장
         */
        angular.element($window).on("unload", function(e) {
            var sess = {};
            sess.screenData = angular.copy($scope.screenData);
            if (!commInitData.query.localtest && $scope.leavePageStroage) {
	            LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
	            LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
	            LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
            }
        });
        
        function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		
		/* 중카에서 가져오는 중카테고리 값*/
		$scope.cateDepth1 = {};
		$scope.depthCurDispNo = {}; 
		
		$scope.paramCurDispNo = getParameterByName('curDispNo');
		$scope.paramCateDepth1 = getParameterByName('cateDepth1');

        if (getParameterByName('cateDepth1') == ""){
        	$scope.cateDepth1 = ""; 
        } else if($scope.paramCateDepth1.length >= 1) {
        	$scope.cateDepth1 = $scope.paramCateDepth1; 
        }
        
        if (getParameterByName('paramCurDispNo') == ""){
        	$scope.depthCurDispNo = ""; 
        } else if($scope.paramCurDispNo.length >= 1) {
        	$scope.depthCurDispNo = $scope.paramCurDispNo; 
        }

    }]);
    app.directive('lotteContainer',['$window','LotteCommon', function($window,LotteCommon) {
        return {
            templateUrl : '/lotte/resources_dev/category/m/cate_mid_list_anglr_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.gotoBrand = function(item, idx){
                    var link = item.link_url;
                    if(link == "" || link == null){
                        link = "/category/m/brand_prod_list.do?upBrdNo=" + item.brand_no; 
                    }
                    if(idx < 10){
                        idx = "0" + idx;
                    }
                    location.href = $scope.baseLink(link) +  "&tclick=m_DC_CateTpl_Clk_Brd_idx" +idx 
                }
                $scope.gotoProduct = function(item, index){
                    location.href = $scope.baseLink(LotteCommon.prdviewUrl) +"&curDispNo="+item.curDispNo+ "&curDispNoSctCd=" + item.curDispNoSctCd + "&goods_no=" + item.goods_no +"&tclick=m_DC_cateTpl_Swp_Prd_idx" + index;
                }
                $scope.showBrandCate = function(){
                    $scope.sendTclick("m_DC_CateTpl_Clk_Brd_Search");
					$window.location.href = LotteCommon.brandSearchUrl+"?"+$scope.baseParam+"&tclick="+$scope.tClickRenewalBase + "header_new_cate";
                }
            	$scope.subCateClick = function(item){
                    //20160711 $scope.cateDepth1 을 조회
                    $scope.cateDepth1 = "";
                    var len = $scope.sideCtgData.ctgAll.length;
                    var klen;
                    outerLoop : for(var i=0; i<len; i++){
                    	klen = $scope.sideCtgData.ctgAll[i].lctgs.length;
                        for(var k=0; k < klen; k++){
                        	if($scope.sideCtgData.ctgAll[i].lctgs[k].link == $scope.curDispNo){
                                $scope.cateDepth1 = $scope.sideCtgData.ctgAll[i].name;
                                break outerLoop;
                            }
                        }
                    }
                    
            		var tclick = "&tclick="+$scope.tClickBase+"side_cate_catesmall_"+item.disp_no+"&curDispNoSctCd=65";
            		//var url = LotteCommon.cateProdListUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDiv=MIDDLE&idx="+$scope.screenData.idx+"&mGrpNo="+item.mgrp_no+"&title="+encodeURIComponent(item.disp_nm)+tclick;
            		var url = LotteCommon.cateProdListUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDiv=MIDDLE&idx="+$scope.screenData.idx+"&mGrpNo="+item.mgrp_no+"&curDispNo2="+$scope.curDispNo+"&cateDepth1="+$scope.cateDepth1+"&cateDepth2="+$scope.subTitle+"&title="+encodeURIComponent(item.disp_nm)+tclick;
            		if(item.sort != undefined){
            			url += "&sort=" + item.sort;
            		}
            		$window.location.href = url;
            	}
                $scope.isTotal=true;
				
				/* 2017.05.17 롯데슈퍼 당일장보기 서비스 */
				$scope.lotteSuperTodayView = function(obj,idx){
					var tclick = 'm_DC_CateTpl_Clk_Ban_idx'+idx;
					if(confirm("롯데슈퍼로 이동 후 당일 장보기 서비스 이용이 가능합니다.\n롯데슈퍼로 이동 하시겠습니까?")) {
						$scope.sendOutLink(obj.img_link);
					}
					$scope.sendTclick(tclick);	
					return false;

				}
            }
        };
    }]);

})(window, window.angular);