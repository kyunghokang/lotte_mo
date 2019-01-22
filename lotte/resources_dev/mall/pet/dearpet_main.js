(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteNgSwipe',
        'ngTouch',
        'lotteSns',
        'lotteSlider'
    ]);

    app.controller('DearpetMainCtrl', ['$http','$scope', '$window', 'LotteCommon', 'LotteUtil', '$timeout',  function($http, $scope, $window, LotteCommon, LotteUtil, $timeout )
    {
        $scope.isMain = true;
    	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "미미뚜뚜"; //서브헤더 타이틀
        $scope.pageLoading = false;

        $scope.shareNoFixMessage = true;
        $scope.shareCodeis = "MIMI TOUTOU";
        $scope.shareRendingURL = location.href;

		/*
         * 스크린 데이터 초기화
         */
        ($scope.screenDataReset = function() {
        	$scope.screenData = {
        		page: 0,
        		dispNo: 5553935,
        		showAllCategory: false,
        		selectCate1: 0,
        		selectCate2: 0,
        		selectCate3: 0,
        		selectedCategory: 0,
        		cate_list: [],
        		top_banner: [],
        		newBest: [],
        		swgView: [],
        		dearpetGramView: [],
        		dearpetCampain: [],
        		strategeList: [],
        		photoView : [],
        		themePlan : null,
        		weekBestList : [],
        		ctgDispNo: "",
        		ctgName : "",
        		ctgBeforeName :"",
        		ctgDepth : "",
        		take: "a", // 탭 (a: 고양이, b : 강아지),
                pet_list:[],
                recom_list:[],
                swag_count : 0,
                like_count: 0,
                pet_recom_code : "",
                dataLoadFlog:false,
                activePetCode : "",
                event_banner:"",
                story_banner:[],
                advice_banner:"",
                storyBanner:[]

        	}
        })();

        $scope.petTclickList = {
            share : "m_DC_SpeDisp_Dearpet_Clk_Shr", // 공유하기
            write : "m_DC_SpeDisp_Dearpet_Clk_Btn08", // 등록하기
            edit : "m_DC_SpeDisp_Dearpet_Clk_Btn10", // 대표 아이
            active : "m_DC_SpeDisp_Dearpet_Clk_Btn11", // 대표 아이
            photo : "m_DC_SpeDisp_Dearpet_Clk_Btn09", // 아이사진 클릭시
            petIndicator : "m_DC_SpeDisp_Dearpet_Swp_page", // 펫 indicator
            myswag : "m_DC_SpeDisp_Dearpet_Clk_Btn12", // 내가 쓴 뽐내기
            mylikepost : "m_DC_SpeDisp_Dearpet_Clk_Btn13", // 좋아한 게시물
            petPrd1 : "m_DC_SpeDisp_Dearpet_Prd_J0", // 고민상품
            petPrd2 : "m_DC_SpeDisp_Dearpet_Prd_K0",//연령대 상품
            ban10:"m_DC_SpeDisp_Dearpet_Clk_Ban_10",//메인 탑배너
            ban11:"m_DC_SpeDisp_Dearpet_Clk_Ban_11",//수의사 배너 뽐내기위
            ban12:"m_DC_SpeDisp_Dearpet_Clk_Ban_12"//수의사 배너 캠페인 위
        };
        $scope.shareTiclick = $scope.petTclickList.share;

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
            if( !$scope.screenData.cate_list.length ) $scope.pageLoading = true;
            $scope.productListLoading = true;

            $http.get(LotteCommon.petMallMainData+'?'+$scope.baseParam+'&dispNo='+$scope.screenData.dispNo+'&pet_no='+$scope.screenData.pet_recom_code )
            .success(function(data) {
                var contents = [];
                var newVal = [];
                if(data['dearpet_main'] != undefined) {
                	$scope.screenData.take = !take ? "a" : take; // 탭 세팅
                	contents = data['dearpet_main'];

                    if( !$scope.screenData.cate_list.length ) $scope.screenData.cate_list = contents.cate_list.items;

                    // 카테고리 3자 줄바꿈
                    /*
                    if($scope.screenData.cate_list.length) {
                        for( var i=0; i<$scope.screenData.cate_list.length; ++i ) {
                            var name = $scope.screenData.cate_list[i].disp_nm;
                            if( name.length > 3  ) {
                                var cut = name.substr( 0, 3 );
                                name = cut + "<br>" + name.substr(3);
                                $scope.screenData.cate_list[i].disp_nm = name;
                            }
                        }
                        // console.log($scope.screenData.cate_list);
                    }
                    */

                    // 아이목록 출력용으로 가공
                    if( !$scope.screenData.pet_list.length ) {
                        try{ $scope.screenData.pet_list = contents.pet_list.items || []; } catch(e) { }
                        for( var i=0;i<$scope.screenData.pet_list.length;++i) {
                            var thisActive = $scope.screenData.pet_list[i].active,
                                birthday = $scope.screenData.pet_list[i].birthday,
                                petbirthday = birthday.replace(/\./gi,""),
                                yy = petbirthday.substr(0,4),
                                mm = petbirthday.substr(4,2),
                                dd = petbirthday.substr(6,2);
                            petbirthday = yy+"."+mm+"."+dd; // 출력용 날짜
                            // 대표 아이 설정 값 "Y/N" or true/false 어떻게 넘어와도 boolean 처리
                            $scope.screenData.pet_list[i].active = ( thisActive == 'Y' || ( typeof thisActive == "boolean" && thisActive ) || ( typeof  thisActive == "string" && thisActive == "true" ) ) ? true : false;
                            $scope.screenData.pet_list[i].birthday = petbirthday;
                            console.log( $scope.screenData.pet_list[i].disp_no )
                        }
                    }
                    //$scope.screenData.recom_list = contents.recom_list || []
                    $scope.screenData.swag_count = contents.swag_count;
                    $scope.screenData.like_count = contents.like_count;

                    angular.forEach($scope.screenData.cate_list, function(val, key) {
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

                    if( !$scope.screenData.dataLoadFlog ) {
                        if(contents.top_banner){
                            $scope.screenData.top_banner = contents.top_banner.items;
                        }                        
                        $scope.screenData.swagView = contents.swag;
                        $scope.screenData.dearpetGramView = contents.dearpetgram;
                        $scope.screenData.photoView = contents.photo_review;
                        if(contents.stratege){
                            $scope.screenData.strategeList = contents.stratege.items;    
                        }            			
                        $scope.screenData.dearpetCampain = contents.dearpet_campain;
                        if(contents.dearpet_campain){
            			    $scope.screenData.dearpetCampainList = contents.dearpet_campain.items;
                        }
                        $scope.screenData.event_banner = contents.event_banner;
                        $scope.screenData.story_banner = contents.story_banner;
                        $scope.screenData.advice_banner = contents.advice_banner;
                    }

        			$scope.productListLoading = false;
                    if($scope.pageLoading) $scope.pageLoading = false;
                    $scope.screenData.dataLoadFlog = true;

                    getActivePet(0);
                }
            }).error(function(data){
                console.log('Error Data : 데이터 로딩 에러');
                $scope.productListLoading = false;
                $scope.pageLoading = false;
            });
        }

        function addCatch ( data ) {
            var catchData;
            try { catchData = data } catch(e) { catchData = null }
            return catchData;
        }

        function getActivePet( c ) {
            if( !$scope.screenData.pet_list || !$scope.screenData.pet_list.length ){
                $scope.getProductList();
                return;
            }
            // 펫 별 상품 데이타
            var pet_data = $scope.screenData.pet_list,
                pet_bbs_node = addCatch( pet_data[c].bbs_no || pet_data[c].bbc_no );
            switch( pet_data[c].type ) {
                case "10": $scope.screenData.take = "a"; break; // 강아지
                case "20": $scope.screenData.take = "b"; break; // 고양이
                default: $scope.screenData.take = "a";
            }
            $scope.getProductList( pet_bbs_node );
        }

        /*
            대표 아이 변경
        */
        function setActiveChange( bbsNo ) {
            var pet_data = $scope.screenData.pet_list, cbbsNo;
            // 중복이면 종료.
            for( var i in pet_data ) {
                var bNo = pet_data[i] || pet_data[i];
                if( (bNo.bbs_no||bNo.bbc_no) == bbsNo ) {
                    cbbsNo = i;
                    if(bNo.active) return;
                };
            }
            $http.get(LotteCommon.petMallpetMainPetActiveData +"?bbc_no="+ ( (!bbsNo||bbsNo==undefined)?'':bbsNo ) )
            .success(function(data) {
                //if( String(data.result_code) === "0000"  ) {
                    for( var i in pet_data ) pet_data[i].active = false;
                    pet_data[cbbsNo].active = true;
                //}
            });
        }

        /*
            등록한 뽐내기, 추천한 글 이 없을경우 알럿 팝업
            ( config.json변경 않하기 위해 태그 생성 )
        */
        function showConfirm( type ){
            var text = type == "swag" ? "우리 아이 뽐내기 소식이 아직 없어요~<br> 어서 우리 아이를 뽐내보세요~" : "아직 좋아요♡ 한 게시물이 없어요~ 뽐내기 둘러보시고 ♡ 해보세요~",
                button = "뽐내러 가기",
                $mdDialog = [
                    "<div class='mdDialog'>",
                        "<div class='mdDiallog_pop_up'>",
                            "<div class='mdDialog_body'>",
                                "<div class=''>"+text+"</div>",
                            "</div>",
                            "<div class='mdDialog_foot clear'>",
                                "<button onclick='getScope().popState()'>취소</button>",
                                "<button onclick='getScope().popState(true)'>"+button+"</button>",
                            "</div>",
                        "</div>",
                    "</div>" ];
            angular.element("body").append(  $mdDialog.join("") );
        }

        /*
            펫 스와이프시 데이타 로드
        */
        $scope.getProductList = function( bbcNo, test ){
            $http.get(LotteCommon.petMallpetMainPetProductData+"?bbc_no="+ ( (!bbcNo||bbcNo==undefined)?'':bbcNo ) )
            .success(function(data) {
                var contents = data['dearpet_main'];
                $scope.screenData.storyBanner=[];
                // 추천 상품 가공 처리 ( 정의된 인터페이스와 데이터 키 및 구조가 다르게 넘어와서 가공 처리 )
                if(!contents.age_recom_list ) contents.age_recom_list = {};
                var age_title = contents.age_recom_list.ctgName || "";
                if(!contents.age_recom_list.prd_list) contents.age_recom_list = {};
                var age_recom_list = [];
                try{
                    for( var i=0; i<contents.age_recom_list.prd_list.items.length; ++i  ) {
                        if( i<3 ) age_recom_list.push( contents.age_recom_list.prd_list.items[i] );
                    }
                } catch(e) {}
                
                if(!contents.recom_list) contents.recom_list = {};
                var rec_title = contents.recom_list.ctgName || "";
                if(!contents.recom_list.prd_list) contents.recom_list.prd_list = {};
                var recom_list = [];
                try{
                    for( var i=0; i<contents.recom_list.prd_list.items.length; ++i  ) {
                        if( i<3 ) recom_list.push( contents.recom_list.prd_list.items[i] );
                    }
                } catch(e) { }

                var all_recom_list = [ ];
                if( recom_list.length ) all_recom_list.push( { title:'말하지 않아도<br>케어해줄께' , items: recom_list, tclick:$scope.petTclickList.petPrd1 } );
                if( age_recom_list.length ) all_recom_list.push( { title:'지금 나이에<br>챙겨줘야 할 추천 상품' , items: age_recom_list, tclick:$scope.petTclickList.petPrd2 } );

                $scope.screenData.recom_list = all_recom_list;
                // console.log($scope.screenData.recom_list);
                setTimeout(function(){
                    $scope.screenData.storyBanner = contents.story_banner;
                },500);            
                try{ $scope.screenData.brdBestList = addCatch( contents.brd_best) } catch(e) { $scope.screenData.brdBestList  = null }
                try{ $scope.screenData.weekBestList = addCatch( contents.week_best.prd_list.items ) } catch(e) { $scope.screenData.weekBestList = [] }
                try{ $scope.screenData.themePlan = addCatch( contents.theme_plan ) } catch(e) { $scope.screenData.themePlan = [] }
            })
        }

        /*
         * TODO: 화면 나갈때 세션에 데이터 저장 및 세선 체크후 데이터 세팅 부분 공통화 개발 필요
         */
        $scope.loadScreenData();

        /*
            스와이프 컨트롤러
            @param :
            return
        */
        $scope.swpControl = {
            swpIdx : 1,
            control : null,
            setControl : function( c ) { $scope.swpControl.control = c },
            getControl : function( ) { return $scope.swpControl.control },
            end : function( i ) { $scope.swpControl.swpIdx = i; console.log( i );   }
        };

        try{ $scope.useLoginState = getLoginInfo().isLogin; }
        catch(e) { $scope.useLoginState = false }

        function appUpdate(){
            if( $scope.appObj.verNumber < 292 ) {
                $scope.appDown();
            }
        }

        function getDomain(){
            var domain = location.href;
            var pattern = /^http:\/\/([a-z0-9-_\.]*)[\/\?]/i;
            try{
                domain = domain.match(pattern);
                domain = domain[1];
                domain = domain.replace("www.", "");
            } catch(e) {
                console.log( 'localhost' );
                return null;
            }
            if( domain.indexOf("mo.lotte.com") != -1 ) {
            	domain = "mo.lotte.com";
            }
            if( domain.indexOf("m.lotte.com") != -1 ) {
            	domain = "m.lotte.com";
            }
            return domain;
        }
        
        $scope.petSwipeIndex = 0;
        $scope.goPage = function( url, tclick ) {
            var p = "&";
            if( tclick ) {
                if( url.indexOf("?") != -1 ) p = "?";
                url + p + "tclick=" + tclick;
            }
            window.location.href = url;
        }

        $scope.petFunc = function( type, idx ){
            switch( type ) {
                case "insert": // 등록
                    if( !$scope.loginInfo.isLogin && getDomain() ) { // 로그인 안한 경우
                        alert('로그인 후 이용하실 수 있습니다.');
                        var targUrl = "targetUrl="+encodeURIComponent( "http://"+getDomain()+"/"+ LotteCommon.petMallpetWriteUrl+"?"+$scope.baseParam+"&dispMode=edit&tclick="+$scope.petTclickList.write, 'UTF-8');
                        location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+'&'+targUrl;
                        return;
                    }
                    $scope.goPage( LotteCommon.petMallpetWriteUrl+"?"+$scope.baseParam+"&tclick="+$scope.petTclickList.write );
                break;
                case "edit": // 수정
                    $scope.goPage( LotteCommon.petMallpetWriteUrl+"?"+$scope.baseParam+"&dispMode=edit&bidx="+idx+"&tclick="+$scope.petTclickList.edit );
                break;
                case "active": // 대표 아이 변경
                    $scope.sendTclick( $scope.petTclickList.active );
                    setActiveChange( idx );
                break;
                case "myswag": // 내가 쓴 뽐내기
                    if(!$scope.screenData.swag_count) {
                        showConfirm( 'swag' );
                    } else {
                        var url = LotteCommon.petMallgalleryUrl,
                            addParam = "&curDispNo=5566438&beforeNo=5566305&cateDepth=3&tclick="+$scope.petTclickList.myswag;
                        url += "?"+$scope.baseParam+addParam+"&type=mySwagList";
                        $scope.goPage( url );
                    }
                break;
                case "likePost": // 내가 좋아요 한 게시물
                    if(!$scope.screenData.like_count) {
                        showConfirm( 'like' );
                    } else {
                        var url = LotteCommon.petMallgalleryUrl,
                            addParam = "&beforeNo=5566305&tclick="+$scope.petTclickList.mylikepost;
                        url += "?"+$scope.baseParam+addParam+"&type=myLikeList";
                        $scope.goPage( url );
                    }
                break;
                case "indicator": // 펫 스와이프 인디케이터
                    $scope.sendTclick(  $scope.petTclickList.petIndicator + idx );
                break;
                case "petPhoto": // 펫 사진 클릭
                    $scope.goPage( LotteCommon.petMallpetWriteUrl+"?"+$scope.baseParam+"&dispMode=edit&bidx="+idx+"&tclick="+$scope.petTclickList.photo );
                break;
            }
        }
        $scope.petSwipeEnd = function(c){
            if( $scope.petSwipeIndex == c ) return;
            $scope.petSwipeIndex = c;
            $scope.sendTclick(  $scope.petTclickList.petIndicator + (c+1) );
            getActivePet(c);
        }
        $scope.popState = function(c) {
            if(!c) {
                angular.element(".mdDialog").remove();
                return;
            }
            var URL = LotteCommon.petMallgalleryUrl+"?"+$scope.baseParam+"&curDispNo=5566438&beforeNo=5566305&cateDepth=3&tclick=m_DC_SpeDisp_Dearpet_Clk_5566438";
            $scope.goPage( URL );
        }
        $scope.petShare = function( obj ){
            $scope.sendTclick(  $scope.petTclickList.share );
            $scope.showSharePop( obj );
            $timeout(function(){
                getScope().share_img = obj.shareImg;
                getScope().noCdnUrl = location.href;
            },300);
        }
        // END 디어펫 개선 4차

        //20170926 탑배너 클릭
         $scope.tob_banner_click=function(url){
            $scope.sendTclick($scope.petTclickList.ban10);
            window.location.href =url+"&"+$scope.baseParam; 
        }

    }]);

    app.directive('lotteContainer',['$window','LotteCommon', '$timeout', 'AppDownBnrService', 'LotteLink', function($window, LotteCommon, $timeout, AppDownBnrService, LotteLink ) {
        return {
            templateUrl : '/lotte/resources_dev/mall/pet/dearpet_main_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	$scope.tabDepChange = function (take) { // 탭 변경
            		$scope.screenData.take = take;
					var tclickCode = "";
					if (take == "a") { // 강아지
						tclickCode = "m_DC_SpeDisp_Dearpet_Clk_Tap01";
					} else if (take == "b") { // 고양이
						tclickCode = "m_DC_SpeDisp_Dearpet_Clk_Tap02";
					}
					if (tclickCode) {
						$scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Tap0" + (take == "a" ? "1" : "2"));
					}
				};
                
                //메인 카테고리 이동 
                $scope.go_cate = function(item, index){
                    var baseURL = LotteCommon.petMallProdListUrl+"?curDispNo="+item.disp_no;
                    if(!item.sub_cate_list ) item.sub_cate_list = [];
                    // 대카 클릭시 첫번째 중카 상품리시트 목록
                    if( item.sub_cate_list.length ) {
                        baseURL = LotteCommon.petMallProdListUrl+"?beforeNo="+item.disp_no+"&curDispNo="+item.sub_cate_list[0].disp_no;
                    }
                    switch( String(item.disp_no) ) {
                        case "5566305": // 갤러리는 전체 데이타를(펫그램,포토후기,뽐내기) 가져 올수 없음으로 디어펫그램으로 연결 )
                            baseURL = LotteCommon.petMallgalleryUrl+"?curDispNo=5566436&beforeNo="+item.disp_no;
                        break;
                        case "5572261": // 뉴스

                            if( item.sub_cate_list.length != 0){
                                
                            item.sub_cate_list[0].disp_no == 5585896 ? baseURL = LotteCommon.petMalleventUrl : baseURL = LotteCommon.petMallStoryUrl;
                            baseURL = baseURL +"?curDispNo="+item.sub_cate_list[0].disp_no +"&beforeNo="+item.disp_no;}else{
                               baseURL =  LotteCommon.petMalleventUrl +"?curDispNo="+item.disp_no+"&beforeNo="+item.disp_no;
                            }

                        break;
                    }
                    baseURL+="&"+$scope.baseParam+"&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
                    
                    if(item.outlink_yn == 'Y'){
                        if(item.mov_frme_cd){
                            if($scope.appObj.isApp){
                                openNativePopup('', item.link_url);
                            }else{
                                window.open(item.link_url, "_blank");
                            }                                                        
                        }else{
                            location.href = item.link_url;
                        }                        
                    }else{
                        $window.location.href = baseURL;    
                    }
                    
                }
                
                
            	$scope.goSubCategory = function (linkUrl, tclick) {
            		if (linkUrl) {
                		window.location.href = linkUrl +"&"+$scope.baseParam + (tclick ? "&tclick=" + tclick : "");
                	}
				};

				$scope.BannerClick = function(linkUrl, tclick) {
                	if (linkUrl) {
                        var ch = "&";
                        if(linkUrl.indexOf("?") == -1){
                            ch = "?";    
                        }
                		window.location.href = linkUrl + ch + $scope.baseParam + (tclick ? "&tclick=" + tclick : "");
                	}
                }

				$scope.stategeBannerClick = function(linkUrl, tclick) {
                	if (linkUrl) {
                		window.location.href = linkUrl+"&"+$scope.baseParam  + "&curDispNoSctCd=95" + (tclick ? "&tclick=" + tclick : "");
                	}
                }

				$scope.mallProductClick = function(no, tclick) {
                	var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + no + "&curDispNoSctCd=95";
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }

				$scope.mallMainClick = function(tclick) {
                	var url = LotteCommon.petMallMainUrl + "?" + $scope.baseParam;
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }

				$scope.galleryMoreClick= function(e, tclick) {
					var a = $(e.target);
					var cateData = a.parent();

					$scope.screenData.ctgDispNo = cateData.data("ctgDispNo");
					$scope.screenData.ctgName = cateData.data("ctgName");
					$scope.screenData.ctgBeforeDispNo = cateData.data("ctgBeforeDispNo");
					$scope.screenData.ctgDepth = cateData.data("ctgDepth");

					//console.log($scope.screenData.ctgDispNo, $scope.screenData.ctgName, $scope.screenData.ctgBeforeDispNo, $scope.screenData.ctgDepth);
					var url = LotteCommon.petMallgalleryUrl+"?"+$scope.baseParam+"&curDispNo="+$scope.screenData.ctgDispNo+"&beforeNo="+$scope.screenData.ctgBeforeDispNo+"&cateDepth="+$scope.screenData.ctgDepth;
					url += "&tclick=" + tclick;
					$window.location.href = url;
                }

				$scope.gallerydearpetClick= function(e,no,tclick) {
					var a = $(e.target);
					var cateData = a.parent();
					$scope.screenData.ctgDispNo = cateData.data("ctgDispNo");
					$scope.screenData.ctgName = cateData.data("ctgName");
					$scope.screenData.ctgBeforeDispNo = cateData.data("ctgBeforeDispNo");
					$scope.screenData.ctgDepth = cateData.data("ctgDepth");
					var url = LotteCommon.petMallgalleryUrl+"?"+$scope.baseParam+"&curDispNo="+$scope.screenData.ctgDispNo+"&beforeNo="+$scope.screenData.ctgBeforeDispNo+"&cateDepth="+$scope.screenData.ctgDepth+"&bbc_no="+ no;
					url += "&tclick=" + tclick;
					$window.location.href = url;
                }

				function linkUrl_Pro(url,tclick){
					if(url.indexOf('?')>-1) url += '&'+$scope.baseParam+'&tclick='+$scope.tclick+tclick;
					else url += '?'+$scope.baseParam+'&tclick='+$scope.tclick+tclick;
					location.href = url;
				}

                //20170926 펫상식(스토리),수의사 게시판 추가 한성희

                    // 펫상식 배너 링크 클릭
                $scope.story_banner_swipe_click=function(url,index){
                    console.log(url);
                    var url=  url + '&'+$scope.baseParam +"&tclick="+"m_DC_SpeDisp_Dearpet_Clk_Prd_M"+index;
                     $window.location.href=url;
                }
                    //20170927 수의사 배너 링크 클릭
                $scope.advice_banner_click=function(url,tclick){
                      console.log(url);
                    var url = url +'?'+$scope.baseParam + "&tclick="+tclick;
                       $window.location.href =url;
                }
                //end 20170926 펫상식(스토리),수의사 게시판 추가
               
            }
        };
    }]);

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
	app.filter('replacebr', function() {
		  return function(str) {
	    	    return str.replace("<br>", " ");
		  }
	 });
    // Directive :: 카테고리
	app.directive('petMallCtg',['$window','LotteCommon', function($window, LotteCommon) {
		return {
			templateUrl: '/lotte/resources_dev/mall/pet/pet_mall_ctg_container.html',
			link: function ($scope, el, attrs) {
				/*
				 * 메뉴 카테고리 클릭
				 */
                $scope.menuCateLink = function( item, index ) {
                    var baseURL = LotteCommon.petMallProdListUrl+"?curDispNo="+item.disp_no;
                    if(!item.sub_cate_list ) item.sub_cate_list = [];
                    // 대카 클릭시 첫번째 중카 상품리시트 목록
                    if( item.sub_cate_list.length ) {
                        baseURL = LotteCommon.petMallProdListUrl+"?beforeNo="+item.disp_no+"&curDispNo="+item.sub_cate_list[0].disp_no;
                    }
                    switch( String(item.disp_no) ) {
                        case "5566305": // 갤러리는 전체 데이타를(펫그램,포토후기,뽐내기) 가져 올수 없음으로 디어펫그램으로 연결 )
                            baseURL = LotteCommon.petMallgalleryUrl+"?curDispNo=5566436&beforeNo="+item.disp_no;
                        break;
                        case "5572261": // 뉴스

                            if( item.sub_cate_list.length != 0){
                                
                            item.sub_cate_list[0].disp_no == 5585896 ? baseURL = LotteCommon.petMalleventUrl : baseURL = LotteCommon.petMallStoryUrl;
                            baseURL = baseURL +"?curDispNo="+item.sub_cate_list[0].disp_no +"&beforeNo="+item.disp_no;}else{
                               baseURL =  LotteCommon.petMalleventUrl +"?curDispNo="+item.disp_no+"&beforeNo="+item.disp_no;
                            }

                        break;
                    }
                    baseURL+="&"+$scope.baseParam+"&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
                    $window.location.href = baseURL;
                }
			}
		};
	}]);

    /* header each */
    app.directive('subHeaderEach', [ '$window', '$timeout', 'AppDownBnrService',  function( $window, $timeout, AppDownBnrService ) {
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
                        console.log('fix');
					}
					$timeout(function () {
						$scope.$apply();
					});
				});

            }
        }
    }]);

    app.directive( 'dearPetCategory', [ '$window', '$timeout', function( $window, $timeout ) {
            return {
                link : function( scope, el, attrs ) {
                    function init (){
                        var max = scope.screenData.cate_list.length,
                            cont = angular.element(el),
                            parent_w = cont.parent()[0].offsetWidth,
                            w = Math.floor(parent_w/4.5),
                            cont_w = Math.ceil( w * max);

                        angular.element( cont ).css({width:cont_w+"px"});
                        angular.forEach( cont.children(), function(e,i) {
                            angular.element(e).css({width:w+"px"});
                        });
                    }
                    $timeout(init);
                }
            }
    }]);

    app.directive( 'hwSlider', ['$timeout','$window', function($timeout,$window){
        return {
            restrict : 'A',
            replace: true,
            scope: { selector:"=?", slideindex:"=?" },
            link : function( scope, el, attrs ){

                var options = { }, windowWidth = 0;

                // 선택
                scope.currentCnt = -1;
                scope.loadFlag = false;
                angular.element( $window ).bind( 'resize', function(e){
                    if( Math.ceil( angular.element($window).innerWidth() ) == Math.ceil(windowWidth) ) return;
                    initialize();
                    $timeout(function(){
                        if(scope.currentCnt>-1) {
                            scope.slideis( scope.currentCnt );
                        } else {
                            setChangePos(0, true);
                        }
                    }, 200 );
                });

                function getParentSize(){
                    options.parentWidth = angular.element( options.container[0].parentElement ).width();
                    options.parentHeight = angular.element( options.container[0].parentElement ).height();
                }

                function initialize(){
                    windowWidth = angular.element($window).innerWidth();
                    options = {
                        touchPos : 0,
                        targetX : 0,
                        parentWidth : 0,
                        parentHeight : 0,
                        dragis : false,
                        itemList:[],
                        containerWidth : 0,
                        containerHeight : 0,
                        initiTime : attrs.hwSlideInitTime,
                        duration : ".2",
                        arr_pos : [],
                        width320 : attrs.width320,
                        width640 : attrs.width640,
                        width900 : attrs.width900,
                        maxWidth : attrs.maxWidth,
                        drag : attrs.drag || true,
                        space : attrs.slideSpace || 0,
                        dispStyle : attrs.displayStyle || 'inline-block',
                        activeClass : attrs.itemActiveClass || 'active',
                        scrollingIs : attrs.slidePos || "horizontal",
                        container  : attrs.dragTarget ? angular.element( angular.element(el)[0].querySelector(attrs.dragTarget) ) : angular.element(el),
                        cleave : 0
                    }

                    getParentSize();
                    if(options.parentWidth < 640 ){
                        options.cleave = options.width320;
                    }
                    if(options.parentWidth > 640 && options.parentWidth < 900  ){
                        options.cleave = options.width640;
                    }
                    if(options.parentWidth >= 900 && options.parentWidth < 940  ){
                        options.cleave = options.width900;
                    }
                    if(options.parentWidth >= 940 ){
                        options.cleave = 0;
                    }

                    var w = 0;
                    if( options.cleave != 0 ) w = Math.ceil( options.parentWidth/options.cleave );
                    options.itemList = options.container[0].children;
                    angular.forEach( options.itemList, function(e, c, n ){
                        var item = angular.element(e);
                        // 세로
                        if(options.scrollingIs == 'vertical' ) {
                            item.css( 'height', item.height() + "px" );
                            options.containerHeight += item.height();
                            options.arr_pos.push( options.containerHeight );
                        } // 가로
                        else {
                            item.css( {display:options.dispStyle, width:(w||options.maxWidth) });
                            options.containerWidth += item.width();
                            options.arr_pos.push( options.containerWidth );
                        }
                        scope.selector = scope.slideis;
                        scope.slideindex = scope.currentCnt;
                    });

                    // 컨테이너 넓이값 적용 및 드래그 이벤트 추가
                    options.container.css( ( options.scrollingIs == 'vertical' ? 'height':'width') ,  ( options.scrollingIs == 'vertical' ? options.containerHeight : options.containerWidth )+ 'px' );
                    console.log( options.drag );
                    if(!scope.loadFlag && options.drag == "true" ) {
                        options.container.bind('touchstart touchmove touchend',function(e){
                            if( options.containerWidth<=options.parentWidth ) return;
                            var dragPos=(options.scrollingIs=='vertical'?e.originalEvent.changedTouches[0].clientY:e.originalEvent.changedTouches[0].clientX);
                            switch(e.type) {
                                case "touchstart":
                                    options.dragis = true;
                                    options.touchPos = dragPos
                                    break;
                                case "touchmove":
                                    setChangePos( options.touchPos - dragPos );
                                    break;
                                case "touchend":
                                    options.dragis = false;
                                    options.targetX = options.targetX - ( options.touchPos - dragPos );
                                    dragFinish();
                                    break;
                                }
                        });
                        // 클릭 이벤트
                        angular.element(options.itemList).bind( 'click', function(){
                            scope.slideis( angular.element(this).index(), true );
                        });
                        scope.loadFlag = true;
                    }
                }

                // 위치 변경
                function setChangePos( cpos, finish, apply ){
                    var ncpos = cpos-options.space, limit=50,
                        controllPos=options.targetX-ncpos,
                        overX = (options.containerWidth-options.parentWidth);

                    if( !finish && (options.targetX-ncpos) > 0  ) {
                        var per = (options.targetX-ncpos)/100*180;
                        controllPos = (options.targetX-ncpos)-(per*.4);
                    }
                    if( !finish && (options.targetX-ncpos)<-(options.containerWidth-options.parentWidth) ) {
                        var per = Math.abs((options.targetX-ncpos)+(options.containerWidth-options.parentWidth))/100*180;
                        controllPos = (options.targetX-ncpos)+(per*.4);
                    }

                    var mcss = {
                        '-webkit-backface-visibility': 'hidden',
        				'-moz-backface-visibility': 'hidden',
        				'backface-visibility': 'hidden',
                        '-webkit-transform' : ( options.scrollingIs == 'vertical' ? 'translateY(' : 'translateX(' ) +( apply ? ncpos : (finish ? ncpos : controllPos) )+'px)',
                        '-webkit-transition' : '-webkit-transform ease '+( options.dragis?"0":options.duration )+'s'
                    };
                    if( !finish ) {
                        mcss['-webkit-transition'] = '';
                        mcss['-moz-transition'] = '';
                        mcss['transition'] = '';
                    }

                    options.container.css(mcss);
                    if( finish ) options.targetX = ncpos;
                }

                // 드래그 종료시
                function dragFinish() {
                    options.touchPos = 0;
                    var left = 0, right = (  options.scrollingIs == 'vertical' ? -( options.container.height()-parentHeight) : -(options.container.width()-options.parentWidth) );
                    if( options.targetX > left )  { setChangePos( left, true ); return }
                    if( options.targetX < right ) setChangePos( right > left ? left : right , true );
                }
                // 아이템 체크 및 센터 처리
                scope.slideis = function( index, apply ){
                    if( apply ) scope.$apply(function(){ scope.currentCnt = scope.slideindex = index; });
                    else scope.currentCnt = scope.slideindex = index;
                    angular.element(options.itemList).removeClass(options.activeClass);
                    angular.element(options.itemList[index]).addClass(options.activeClass);
                    var itemX = ( options.scrollingIs == 'vertical' ? -(options.arr_pos[index]) + ( options.parentHeight/2 + Math.ceil( angular.element(options.itemList[index]).height()/2 ) )  : -(options.arr_pos[index]) + ( options.parentWidth/2 + Math.ceil( angular.element(options.itemList[index]).width()/2 ) ) );
                    if( itemX < ( options.scrollingIs == 'vertical' ? -(options.container.height() - options.parentHeight)  : -(options.container.width() - options.parentWidth) ) ) itemX = ( options.scrollingIs == 'vertical' ? -(options.container.height() - options.parentHeight) : -(options.container.width() - options.parentWidth) );
                    setChangePos( itemX >0 ? 0 : itemX, true, true );
                }
                // 초기실행
                $timeout(initialize, attrs.hwSlideInitTime );
          }
        }
    }]);

    app.directive( 'refeshSize', [ '$timeout', function($timeout){
        return {
            link : function( scope, el, attrs ) {
                angular.element(window).bind('resize', function(){
                    $timeout(function(){ reSizeing() },1000);
                });
                function reSizeing(){
                    var children = angular.element(el).find('.swipeBox').children().length
                    angular.element(".my_pet_list").find('.swipeBox').css({width:(100*children)+"%"});
                }
                $timeout(reSizeing, 1000);
            }
        }
    }]);

})(window, window.angular);
