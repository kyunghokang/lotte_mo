(function() {
    'use strict';

    angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteCommFooter',
        'lotteProduct',
        'lotteNgSwipe',
        'lotteSlider',
        'angular-carousel',
        'searchPlanShop'
    ])
    .filter('pageRange', [function() {
        return function(items, page, pgsize) {
            var newItem = [];
            for(var i =0;i < items.length;i++) {
                if(page*pgsize <= i && (page+1)*pgsize > i) {
                    newItem.push(items[i]);
                }
            }
            return newItem;
        }
    }])
    .controller('searchPlanShopListCtrl', ['$scope','defaultScopeValue',
        function(scope,defaultScopeValue) {
        scope.showWrap = true;
        scope.contVisible = true;
        scope.subTitle = "모두보기"; // 서브헤더 타이틀
        scope.pageLoading = true;
        scope.scrollReady	= false; //데이터 세팅 전에 스크롤 이벤트 무시

        defaultScopeValue(scope);
    }])
    .directive('lotteContainer', ['mainClass', function(mainClass) {
        return {
            restict:'EA',
            templateUrl : '/lotte/resources_dev/search/planshoplist/search_planshop_list_container.html',
            replace : true,
            link : mainClass
        };
    }])

    /**
     * @ngdoc factory
     * @name addWish
     * @description
     *  - 위시추가
     *  - 검색유닛(search_image_2017)에서 사용 search_list_2018.js 에서 가져옴
     */
    .factory('addWish',['LotteLink',function(LotteLink){
        return function(scope) {
            scope.addWishClick = function () {
                // 이미 등록된 위시 클릭 방지
                if (scope.srhPrdDetailInfo.data.saveWishYn) {
                    alert("이미 등록된 상품입니다.");
                    return false;
                }

                var item = scope.srhPrdDetailInfo.item,
                    idx = scope.srhPrdDetailInfo.idx;

                if (item.outlnkMall == "LECS") { /*LECS 상품*/
                    if (confirm("공식온라인 몰로 이동후 담을 수 있습니다."))
                        LotteLink.goOutLink(item.outlnk, item.outlnkMall);
                    return false;
                } else if (item.outlnkMall == "SP") { /*롯데슈퍼 상품*/
                    if (confirm("롯데슈퍼로 이동후 담을 수 있습니다."))
                        LotteLink.goOutLink(item.outlnk, item.outlnkMall);
                    return false;
                }

                if (!scope.loginInfo.isLogin) { /*로그인 안한 경우*/
                    alert('로그인 후 이용하실 수 있습니다.');
                    scope.loginProc();
                    /*go Login*/
                    return false;
                } else {
                    if (item.limit_age_yn == 'Y') {
                        if (scope.loginInfo.isAdult == "") { /*19금 상품이고 본인인증 안한 경우*/
                            alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
                            scope.goAdultSci();
                            return false;
                        } else if (!scope.loginInfo.isAdult) {
                            alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
                            return false;
                        }
                    }
                };
                scope.sendProductWish(item.goods_no, function (res) {
                    if (res) scope.srhPrdDetailInfo.data.saveWishYn = true
                    else scope.srhPrdDetailInfo.data.saveWishYn = false;
                });

                scope.sendTclick("m_RDC_SrhResult_Poplayer_Clk_Wsh");
            };
        }
    }])

    /**
     * @ngdoc factory
     * @name detailPop
     * @description
     *  - 검색 유닛(search_image_2017)일경우 상세 레이어 팝업
     *  - search_list_2018.js 에서 가져옴
     */
    .factory('detailPop',['$http','LotteCommon','$timeout','LotteScroll',
        function($http,LotteCommon,$timeout,LotteScroll){
        return function(scope) {

            // 상품 상세 정보 이미지 및 위시
            scope.srhPrdDetailInfo = {
                data: {},
                show: false,
                item: {},
                imageSwipeIdx: 1,
                showArrow: true
            };

            scope.setAutoHideSwipeArrow = function () {
                if (scope.srhPrdDetailInfo.showArrow) {
                    $timeout(function () {
                        var srhPrdDetailInfoArrow = angular.element("#srhPrdDetailInfoArrow");
                        srhPrdDetailInfoArrow.fadeOut(2000);
                    }, 1000);
                }
            }

            scope.getImageSwipeControl = function (control) {
                scope.imageSwipeControl = control;
            }

            scope.setImageSwipeInfo = function (id) {
                scope.srhPrdDetailInfo.imageSwipeIdx = id + 1;
                scope.sendTclick("m_RDC_SrhResult_PopLayer_Swp_Prd_idx" + scope.numberFill(id + 1, 3));
            }

            scope.advtBnrLstSwipeIdx = 1;
            scope.swipeEnd = function (id) {
                scope.advtBnrLstSwipeIdx = id + 1;
            }

            scope.setImageSwipePos = function (idx) {
                var pos = scope.srhPrdDetailInfo.imageSwipeIdx - 1;
                if (scope.srhPrdDetailInfo.data.imgList.items.length < (pos + idx)) {
                    pos = 0;
                } else if (pos + idx < 0) {
                    pos = scope.srhPrdDetailInfo.data.imgList.items.length - 1;
                } else {
                    pos = pos + idx;
                }
                scope.imageSwipeControl.moveIndex(pos);
            };

            scope.productDetailInfoClose = function (btnFlag) {
                if (!btnFlag) scope.sendTclick("m_RDC_SrhResult_Poplayer_Clk_Close");

                scope.srhPrdDetailInfo.show = false;
                scope.scrollFlag = true;
                LotteScroll.enableScroll();
                scope.dimmedClose();
                return false;
            };

            scope.getProductDetailInfo = function (item, idx) {
                scope.sendTclick("m_RDC_SrhResult_Clk_ProductPop");
                scope.srhPrdDetailInfo.data = {};
                $http.get(LotteCommon.listGoodsImgData, {params: {goods_no: item.goods_no}})
                .success(function (data, status, headers, config) {//호출 성공시
                    if (data.contents) {
                        scope.srhPrdDetailInfo.data = data.contents;
                        scope.srhPrdDetailInfo.show = true;
                        scope.srhPrdDetailInfo.showArrow = true;
                        scope.srhPrdDetailInfo.item = {};
                        angular.copy(item, scope.srhPrdDetailInfo.item);
                        scope.srhPrdDetailInfo.idx = idx;

                        scope.scrollFlag = false;
                        LotteScroll.disableScroll();
                        scope.dimmedOpen({
                            target: "prdDetailInfo",
                            callback: scope.productDetailInfoClose,
                            scrollEventFlag: true
                        });

                        scope.srhPrdDetailInfo.imageSwipeIdx = 1;
                        scope.setAutoHideSwipeArrow();
                        $timeout(function () {
                            angular.element(".thumb-list").height(angular.element(".unit-pop").width());
                        });

                    }
                })
                .error(function (data, status, headers, config) {//호출 실패시
                    console.log('Data Error : 상품기본정보 로드 실패');
                });
            }
        }
    }])

    /**
     * @ngdoc factory
     * @name productLink
     * @description
     *  - lotte_product 유닛에 custom링크적용
     *  - 뒤로가기 티클릭 적용
     */
    .factory('productLink',['LotteCommon',function(LotteCommon){
        return function(scope){
            /*scope.gotoPrepage = function () {
                scope.sendTclick( scope.getTclick(3) );
                if(scope.appObj.isNativeHeader) appSendBack()
                else history.go(-1);
            };*/

            var prdScope = scope.$watch(function(){
                var isScope = false;
                try{
                    isScope = angular.element("[product-container]")
                        .children().scope().productInfoClick ? true : false
                } catch(e){};

                return isScope;
            },
            function(n){
                if(!n) return;
                prdScope(); // clear
                // isolate인 lotte_product scope에 강제 접근
                angular.element("[product-container]").children().scope()
                    // 유닛 제품상세 함수를 변경
                    .productInfoClick = function(item,type,index){
                    var tclick = scope.getTclick(2, this.$index);
                    var itemLink = scope.getProductViewUrl(item, tclick);
                    itemLink += "&curDispNoSctCd=" + scope.curDispNoSctCd;
                    location.href = itemLink;
                };
            })
        }
    }])

    /**
     * @ngdoc facory
     * @name scrollPaging
     * @description
     *  - 스크롤 더 보기
     */
    .factory('scrollPaging',['updatePosition','$window',function(updatePosition,$window){
        return function(scope){

            scope.getHere=function(){
                return angular.element(".unitWrap .here")
            };

            angular.element($window).on("scroll", function(e){
                var $win = angular.element($window),
                    $body = angular.element("body"),
                    winH = $win.height(),
                    bodyH = $body[0].scrollHeight,
                    scrollRatio = 4.0; // 윈도우 높이의 4배

                updatePosition.setPos($win.scrollTop());

                // '여기까지 봤어요.' 삭제
                if(scope.scrollinitFixed && scope.hereState) {
                    scope.hereState = false;
                    scope.getHere().addClass('remove');
                    setTimeout(function(){
                        scope.getHere().remove();
                    },500);
                }

                if(!scope.scrollFlag){ e.preventDefault(); return ; }
                if(!scope.productMoreScroll || scope.productListLoading || scope.pageLoading){ return; }
                bodyH = $body[0].scrollHeight;

                if($win.width() >= 640) scrollRatio = 2;// 윈도우 높이의 2배
                else scrollRatio = 4.0;// 윈도우 높이의 4배

                if(scope.scrollReady && $win.scrollTop() + winH >= bodyH - (winH * scrollRatio)){
                	scope.loadDataParams();
                }
            });

            /**
             * 검색 데이터 타입별 Parameter 생성
             */
            scope.loadDataParams = function () {
                if (scope.isShowLoading ||
                    scope.productListLoading ||
                    angular.element(window).innerHeight() == angular.element(document).innerHeight() ) {
                    return false;// 전송 요청 중일 경우 중복 실행 방지
                }
                scope.postParams.page = scope.postParams.page + 1;// 페이지
                scope.postParams.rtnType = "P";// 조회 구분값 P : 페이징으로 설정
                //console.log("loadDataParams", scope.postParams)
                scope.getData();
            }

            angular.element(window).bind('resize',function(e){
                updatePosition.setPos(window.scrollY);
            });
        }
    }])

    /**
     * @ngdoc factory
     * @name counting
     * @description
     *  - 전체 상품 수 표시
     */
    /*.factory('totalProduct',['$interval',function($interval){
        return function (scope){
            var tt, nt, cnt=0, d=20, it=0, cntWatch, startTime;

            // 모두보기 전체 상품 수 카운팅 표시
            function countPush(){
                cnt+=(nt-cnt)/d;
                var rcnt = Math.abs(Math.round(cnt)),
                    vcnt = rcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                angular.element("#head_sub prog").css({width: (rcnt / nt * 100) + "%"});
                scope.subTitle = tt + "(" + vcnt + ")";
                if(rcnt >= nt) {
                    $interval.cancel(it);
                    angular.element("#head_sub").addClass('white');
                    angular.element("#head_sub prog").remove();
                    return;
                }

                // 5초 이상 걸리면 바로 표시
                if( Math.floor( Math.abs(new Date().getTime()-startTime)/1000 ) >= 5 ) {
                    $interval.cancel(it);
                    angular.element("#head_sub").addClass('white');
                    angular.element("#head_sub prog").remove();
                    scope.subTitle = tt + "(" + nt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +")";
                }
            }

            cntWatch = scope.$watch('total_count',function(n){
                if(n) {
                    cntWatch(); //clear;
                    startTime = new Date().getTime();
                    angular.element("#head_sub").prepend('<prog></prog>');
                    tt = scope.subTitle;
                    nt = n;
                    it && $interval.cancel(it);
                    it = $interval(countPush,10);
                }
            });
        }
    }])*/

    /**
     * @ngdoc factory
     * @name defaultScopeValue
     * @description
     *  - mainClass전용 기본값 적용
     */
    .factory('defaultScopeValue',['commInitData','currentPage','addWish','detailPop','productLink','scrollPaging', //,'totalProduct'
        function(commInitData,currentPage,addWish,detailPop,productLink,scrollPaging){ //,totalProduct
        return function(scope){

            // prodConfig -> catchInfo > def 적용
            for( var i in currentPage.def) scope[i] = currentPage.def[i];
            // 키워드가 인코딩되어 넘어와서 디코딩 처리
            if(commInitData.query.keyword) commInitData.query.keyword = decodeURIComponent(commInitData.query.keyword);

            scope.scrollFlag = true;
            scope.isShowLoading = false;// Ajax 로드 Flag 초기화
            scope.productListLoading = false;
            scope.productMoreScroll = true;
            scope.tipShow = false; //툴팁

            scope.templateType = "search_image_2017";
            scope.total_count = "";
            scope.products = [];
            scope.scrollinitFixed = false;
            scope.useScrollAction = false;
            scope.hereState = true;
            scope.counting = 0;
            scope.moreType =  commInitData.query.moreType || 0;
            
            scope.postParams = {};//commInitData.query;
            try{
            	var p = scope.postParams;
            	var q = commInitData.query;
	            for(var xx in q){
            		p[xx] = q[xx];
	            }
            }catch(e){}
            scope.postParams.page = 1;
            scope.postParams.rtnType = "";
            
            var funcs = [ detailPop, addWish, productLink, scrollPaging ];//, totalProduct
            for( var i in funcs ) funcs[i](scope);
        }
    }])

    /**
     * @ngdoc factory
     * @name mainClass
     * @description
     *  - main container class
     */
    .factory('mainClass',[
				'$http','$window','$timeout','updatePosition','currentPage','dataReplaceKey','LotteCommon','LotteStorage', 'commInitData',
        function($http,  $window,  $timeout,  updatePosition,  currentPage,  dataReplaceKey,  LotteCommon,  LotteStorage,   commInitData){
        return function(scope) {
            var fixInit = false;
            
            
            /**
             * 메인 클래스 시작하기
             */
            function startPlanshopList(){
            	if(history.state == null || history.state.name != "searchPlanshopList"){
            		//console.warn("NEW VISIT");
            		history.replaceState({name:"searchPlanshopList"}, "searchPlanshopList");
            		scope.getData();
            	}else{
            		//console.warn("REVISIT");
            		fixInit = true;
            		scope.scrollinitFixed = true;
            		if(restoreSessionStorage()){
            			//console.warn("HAS SESSION");
            			scope.pageLoading = scope.productListLoading = false;
            			setScrollReady();
            		}else{
            			//console.warn("NO SESSION");
            			scope.getData();
            		}
            	}
            	
            	/*페이지 unload 시 세션스토리지 저장*/
    			angular.element($window).on("unload", saveSessionStorage);
            };
            
            
            /**
			 * 데이터 세션에 저장하기
			 */
			function saveSessionStorage(){
				var ss = {
					"scrollTop"		: angular.element($window).scrollTop(),
					"total_count"	: scope.total_count,
					"products"		: scope.products,
					"postParams"	: scope.postParams
				};
				//console.log("SAVE SESSION");
				//console.log(ss);
				
				
				/*var data = (res.data.max||res.data).prdLst;
				//if(!scope.total_count) scope.total_count = (res.data.max||res.data).tCnt;
				scope.total_count = (res.data.max||res.data).tCnt;
				
				if(scope.isValidNumber(tcnt)){
					scope.subTitle = "모두보기 (" + tcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +")";
				}
				
				try{
					if(!data || !data.items.length ) scope.productMoreScroll = false;
				} catch(e) {
					scope.scrollFlag = scope.productMoreScroll = false;
					console.warn('데이터로드 종료 :' + e );
				}
				
				if(data) scope.products = scope.products.concat( dataReplaceKey(data.items) );
				scope.pageLoading = scope.productListLoading = false;
				
				if(!(scope.scrollinitFixed || fixInit)){
					$timeout(scrollFixEnter, 0);
				}*/
				
				LotteStorage.setSessionStorage("SEARCH_PLANSHOP_SSST", ss, "json");
			};
			
			/**
			 * 세션스토리지 데이터 복원하기
			 */
			function restoreSessionStorage(){
				var ss = LotteStorage.getSessionStorage("SEARCH_PLANSHOP_SSST", "json");
				if(ss == undefined){ return false; }
				
				try{
					setTotalCount(ss.total_count);
					scope.products		= ss.products;
					scope.postParams	= ss.postParams;
					
					if(scope.isValidNumber(ss.scrollTop)){
						//scrollTo(0, ss.scrollTop);
						updatePosition.setPos(ss.scrollTop);
					}
				}catch(e){
					return false;
				}
				
				return true;
			};

            scope.getData = function(){
                // paging tclick
                scope.sendTclick(scope.getTclick(1, scope.postParams.page));

        		if(location.host == "localhost:8082"){
        			currentPage.json[0] = LotteCommon.srhListData2016LC;
        		}
                
				scope.productListLoading  = true;
				delete scope.postParams.goodsNoList;
				$http.get(currentPage.json[0], {params:scope.postParams})
					.then(getDataSuccess, getDataError);
                /*.then(function(res){
                    var data = (res.data.max||res.data).prdLst;
                    //if(!scope.total_count) scope.total_count = (res.data.max||res.data).tCnt;
                    var tcnt = (res.data.max||res.data).tCnt;
                    if(scope.isValidNumber(tcnt)){
                		scope.subTitle = "모두보기 (" + tcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +")";
                	}else{
                		scope.subTitle = "모두보기";
                	}

                    try{
                        if(!data || !data.items.length ) scope.productMoreScroll = false;
                    } catch(e) {
                        scope.scrollFlag = scope.productMoreScroll = false;
                        console.warn('데이터로드 종료 :' + e );
                    }

                    if(data) scope.products = scope.products.concat( dataReplaceKey(data.items) );
                    scope.pageLoading = scope.productListLoading = false;

                    if(!scope.scrollinitFixed&&!fixInit) $timeout(scrollFixEnter,1500);

                    $timeout(function(){ // 스크롤 이벤트 갱신
                        updatePosition.setPos(window.scrollY);
                    },300);
                },
                function(er){
                    console.warn('error:'+er);
                });*/
            };
            
			/**
			 * 데이터 로드 성공
			 */
			function getDataSuccess(res){
				var data = (res.data.max||res.data).prdLst;
				//if(!scope.total_count) scope.total_count = (res.data.max||res.data).tCnt;
				//scope.total_count = (res.data.max||res.data).tCnt;
				setTotalCount((res.data.max||res.data).tCnt);
				
				/*if(scope.isValidNumber(scope.total_count)){
					scope.subTitle = "모두보기 (" + scope.total_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +")";
				}*/
				
				try{
					if(!data || !data.items.length ) scope.productMoreScroll = false;
				} catch(e) {
					scope.scrollFlag = scope.productMoreScroll = false;
				}
				
				if(data && data.items){
					var itm;
					var len = data.items.length;
					for(var i=0; i<len; i++){
						itm = data.items[i];
						if(itm.brandNm != undefined){
							itm.brandNm = itm.brandNm.replace(/\[|\]/g, "");
						}
					}
					scope.products = scope.products.concat( dataReplaceKey(data.items) );
				}
				scope.pageLoading = scope.productListLoading = false;
				

				if(scope.products.length >= scope.total_count){
					scope.productMoreScroll = false;
				}
				
				//if(!(scope.scrollinitFixed || fixInit)){
					$timeout(scrollFixEnter, 100);
				//}
				setScrollReady();
				
				/*$timeout(function(){ // 스크롤 이벤트 갱신
					updatePosition.setPos(window.scrollY);
				},300);*/
			};
			
			function getDataError(er){
				setScrollReady();
			};

            //scope.getData();

			/**
			 * 전체 리스트 갯수 설정
			 */
			function setTotalCount(cnt){
				if(scope.isValidNumber(cnt)){
					scope.total_count = cnt;
					scope.subTitle = "모두보기 (" + cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +")";
				}
			};
			
			/**
			 * 데이터 세팅 후 스크롤 이벤트 허용
			 */
			function setScrollReady(){
				$timeout(function(){
					scope.scrollReady = true;
				}, 100);
			};
			
            /**
             * 15번 상품 위치로 이동
             */
            function scrollFixEnter () {
            	if(scope.scrollinitFixed || fixInit){ return; }
            	
                var fixInterval = 0,
                    cnt = 0,
                    max = 20,
                    y = 0,
                    target,
                    h1 = angular.element("#lotteHeader").innerHeight(),
                    h2 = angular.element("#head_sub").innerHeight(),
                    space = 20;

                try{
	                target = angular.element("[product-container] ol>li").children()[14];
	                y = angular.element(target).offset().top;
	                window.scrollTo(0, y - (h1 + h2) - space - (scope.moreType==1?-10:0) ); // 카테고리 일때 -10
	                scope.getHere().css({display: 'block', top: y - (h1 + h2) - (space + 7)});
	                // '여기까지봤어요' 1초 후 사라짐
	                $timeout(function(){ scope.scrollinitFixed = true; }, 1000 );
                }catch(e){}
                
                //scope.scrollinitFixed = true;
                fixInit = true;
                
                // .1초동안 max번 만큼 강제로 15번째 상품 위치로 이동
                // ( 페이지 진입후 상단으로 강제 이동하는 경우가 있어 일정시간 동안 15번 상품 위치로 강제 이동 처리 )
                /*fixInterval = setInterval(function(){
                    try{
                        if(!scope.scrollinitFixed) {
                            target = angular.element("[product-container] ol>li").children()[14];
                            y = angular.element(target).offset().top;
                            window.scrollTo(0, y - (h1 + h2) - space - (scope.moreType==1?-10:0) ); // 카테고리 일때 -10
                            scope.getHere().css({display: 'block', top: y - (h1 + h2) - (space + 7)});
                        }
                    }
                    catch(e) { y = 0; }

                    if( cnt<max && !scope.scrollinitFixed ) cnt++;
                    else {
                        // '여기까지봤어요' 1초 후 스크롤시 사라짐
                        $timeout(function(){ scope.scrollinitFixed = true }, 1000 );
                        clearInterval(fixInterval);
                    }
                },10);*/
            }

            /**
             * 사용자가 15번 상품 위치로 스크롤 이동전
             * 스크롤를 50이상 이동시 '여기까지 봤어요' 표시안함
             */
            var touchY = 0;
            angular.element($window).bind('touchstart.plan touchmove.plan touchend.plan',
            function(e){
                switch(e.type) {
                    case "touchstart":
                        touchY = e.originalEvent.changedTouches[0].clientY;
                    break;
                    case "touchmove":
                        if( !scope.scrollinitFixed && Math.abs(touchY - e.originalEvent.changedTouches[0].clientY) > 50 ){
                            scope.scrollinitFixed = true;
                            angular.element($window).unbind('touchstart.plan touchmove.plan touchend.plan');
                        }
                    break;
                }
            });
            
            
            scope.getTclick = function(flag, idx){
            	var str = "";
            	if(commInitData.query.moreType == "1"){
            		str = scope.tClickBase + "side_cate_catesmall_" + commInitData.query.mGrpNo + "_";
            	}else{
            		str = scope.tClickBase + "SrhResult_";
            	}
            	
            	var n = "";
            	if(typeof(idx) == "number"){
            		if(flag == 2){
            			idx ++;
            		}
	            	if(idx < 10){
	            		n = "00" + idx;
	            	}else if(idx < 100){
	            		n = "0" + idx;
	            	}else{
	            		n = idx;
	            	}
            	}
            	
            	switch(flag){
            	case 1:
            		str += "Deal_Scl_Prd_page" + n;
            		break;
            	case 2:
            		str += "Deal_Clk_Deal_" + n;
            		break;
            	case 3:
            		str += "Deal_Clk_Back_Btn";
            		break;
            	// no default
            	}
            	
            	return str;
            }
            
            
            startPlanshopList();
        }
    }])

    /**
     * @ngdoc directive
     * @name lazyShow
     * @description
     *  - 유닛이 화면에 들어올때 보여주기
     */
    /*.directive('lazyShow',['updatePosition',function(updatePosition){
        return function(scope,el){
            var intY = el.offset().top,
                footh = angular.element("#lotteActionbar").innerHeight() || 50,
                wh = window.innerHeight + 40;
            updatePosition.updateState().then(null,null,function(res){
                scope.isLazyShow( res );
            });
            scope.isLazyShow = function(n){
                if( !el.hasClass('is_show') && n > intY-(wh-footh) ) el.addClass('is_show');
            };
            scope.isLazyShow(updatePosition.getPos());
        }
    }])*/

    /**
     * @gndoc service
     * @name updatePosition
     * @description
     *  - scroll, resize 갱신용
     */
    .service('updatePosition',['$q',function($q){
        this.synccpos = $q.defer();
        this.syncresize = $q.defer(); // lazyShow용
        this._pos = 0;
        this.setPos = function(n){
            this._pos = 0;
            this.synccpos.notify(n);
        }
        this.getPos = function(){
            return this._pos;
        }
        this.updateState = function(){
            return this.synccpos.promise;
        }
        this.setResize = function(n){
            this.syncresize.notify(n);
        }
        this.catchResize = function(){
            return this.syncresize.promise;
        }
    }])

    /**
     * @ngdoc config
     * @description
     * - 카테, 검색에 맞는 파라미터 설정
     */
    .config(['LotteCommonProvider','commInitDataProvider','$provide',
        function(LotteCommonProvider,commInitDataProvider,$provide){
        var moretype = commInitDataProvider.$get().query.moreType||0;
        $provide.decorator('prodConfig',['$delegate',function($delegate) {
            for (var i = 0; i < $delegate.catchInfo.length; ++i) {
                // 공통 변경
                $delegate.catchInfo[i].hideParams = [];
                $delegate.catchInfo[i].noparams = [ // 삭제할 파라미터
                    'cateDepth1',
                    'cateDepth2',
                    'cateDiv',
                    'tclick',
                    'title',
                    'moreType',
                    'curDispNo',
                    'curDispNo2',
                    'curDispNoSctCd',
                    'sort',
                    'idx',
                    'schema',
                    'c',
                    'cdn',
                    'cn',
                    'udid',
                    'v'
                ];
                $delegate.catchInfo[i].page = LotteCommonProvider.$get().searchPanShopList;
                // i:( resources_dev/search/products/planshop/planshop_list.js -> prodConfig -> moreType ) | 0:검색, 1:카테
                $delegate.catchInfo[i].necessaryParams = {
                    cmpsCd: 30,
                    sort: i ? 'TOT_ORD_CNT,1' : 'RANK,1'
                };
                if(i == 1) { // 카테고리 전용 필수 파라미터 추가
                    $delegate.catchInfo[i].necessaryParams = angular.extend( {
                        pageType:'C' // 파라미터에 pageType가 없을경우 C 기본값
                    }, $delegate.catchInfo[i].necessaryParams );
                }
                if(moretype == i) {
                    var cp = $delegate.catchInfo[i];
                    $provide.decorator('currentPage',[function(){
                        return cp;
                    }]);
                }
            }
            return $delegate;
        }]);
    }])
})();