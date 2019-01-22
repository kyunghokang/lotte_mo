(function(window, angular, undefined) {
    'use strict';
    var sideCtgModule = angular.module('lotteSideCtg', []);
    sideCtgModule.controller('SideCtgCtrl', ['$scope','$window','$timeout' ,'$http', 'LotteCommon','LotteUtil', function($scope, $window, $timeout, $http, LotteCommon, LotteUtil){
        
        $scope.isBrdLoadSrc = false; /* 브랜드 키워드 검색 결과 로딩바 */
        $scope.isBrdLoadCst = false; /* 브랜드 초성 검색 결과 로딩바 */
        
        $scope.isSpdpLoadSrc = false; /* 기획전 키워드 검색 결과 로딩바 */
        $scope.isSpdpLoadCtg = true; /* 기획전 카테고리별 검색 결과 로딩바 */
        
        $scope.planshopCateIdx = '1'
        
        $scope.lotteApp = {
            /* isApp: false, //브라우저가 아닌 앱으로 접속했는지 여부. 현재 사용안함 */ 
            isIPHONE: false,
            isIPAD: false,
            isANDROID: false,
            isCHROME: false,
            scheme: '',
            appStoreUrl: '',
            init : function(who) {
                /* this.isApp = (chkApp == 'N' ? false : true); */
                this.isIPHONE = (navigator.userAgent.match('iPhone') != null || navigator.userAgent.match('iPod') != null);
                this.isIPAD = (navigator.userAgent.match('iPad') != null);
                this.isANDROID = (navigator.userAgent.match('Android') != null);
                this.isCHROME = (navigator.userAgent.match('Chrome') != null);
                switch (who) {
                case 'lotte':
                    if (this.isANDROID) {
                        this.scheme = 'intent://m.lotte.com/main.do?cn=23&cdn=537217#Intent;scheme=mlotte001;action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;category=android.intent.category.BROWSABLE;package=com.lotte;end';
                    } else if (this.isIPHONE) {
                        this.scheme = 'mlotte001://m.lotte.com/main.do?cn=23&cdn=537217';
                        this.appStoreUrl = 'http://itunes.apple.com/app/id376622474?mt=8';
                    } else if (this.isIPAD) {
                        this.scheme = 'mlotte003://m.lotte.com/main.do?cn=145524&cdn=2911590';
                        this.appStoreUrl = 'http://itunes.apple.com/app/id447799601?&mt=8';
                    } 
                    break;
                case 'ellotte':
                    if (this.isANDROID) {
                        this.scheme = 'intent://m.ellotte.com/main.do?cn=152726&cdn=3112669#Intent;scheme=ellotte002;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.ellotte;end';
                    } else if (this.isIPHONE || this.isIPAD) {
                        this.scheme = 'ellotte001://m.ellotte.com/main.do?cn=152726&cdn=3112669';
                        this.appStoreUrl = 'http://itunes.apple.com/kr/app/id902962633?mt=8';
                    } 
                    break;
                case 'smp':
                    if (this.isANDROID) {
                        this.scheme = 'intent://m.lotte.com/main_smp.do?cn=116824&cdn=601848&smp_yn=Y#Intent;scheme=splotte002a;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.smartpick2a;end'
                    } else if (this.isIPHONE || this.isIPAD) {
                        this.scheme = 'splotte001://m.lotte.com/main_smp.do?cn=116824&cdn=601848&smp_yn=Y';
                        this.appStoreUrl = 'https://itunes.apple.com/app/id483508898'; 
                    } 
                    break;
                case 'lottedfs':
                    if (this.isANDROID) {
                        this.scheme = 'intent://chindex#Intent;scheme=lottedutyfree;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lotte.lottedutyfree;end';
                    } else if (this.isIPHONE || this.isIPAD) {
                        this.scheme = 'lottedfs://m.lottedfs.com/handler/Index?CHANNEL_CD=303396';
                        this.appStoreUrl = 'https://itunes.apple.com/app/losdemyeonsejeom/id492083651?mt=8';
                    }
                    break;
                case 'lottesuper':
                    if (this.isANDROID) {
                        this.scheme = 'intent://order?redirect=http://m.lottesuper.co.kr/handler/Index-Start?CHL_NO=M385701&AFCR_NO=110682#Intent;scheme=lottesuper;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.lottesuper.mobile;end';
                    } else if (this.isIPHONE || this.isIPAD) {
                        this.scheme = 'lottesuper://order?redirect=http://m.lottesuper.co.kr/handler/Index-Start?CHL_NO=M385701&AFCR_NO=110682';
                        this.appStoreUrl = 'https://itunes.apple.com/app/losdemobailsyupeo/id618095243?mt=8'; 
                    }
                    break;
                }
            },
            getIframe: function(id, url) {
                var iframe = document.getElementById(id);
                if (iframe !== null) {
                    iframe.parentNode.removeChild(iframe);
                }
                iframe = document.createElement('iframe');
                iframe.id = id;
                iframe.style.visibility = 'hidden';
                iframe.style.display = 'none';
                iframe.src = url;
                return iframe;
            },
            exec: function(who, url) {
                this.init(who);
                if (this.isANDROID) { /* 안드로이드 */
                    window.location = this.scheme;
                } else if (this.isIPHONE || this.isIPAD) { /* IOS */
                    var url = this.appStoreUrl;
                    setTimeout(function() {
                        window.location = url;
                    }, 500);
                    var iframe = this.getIframe('lotteAppIframe', this.scheme);
                    document.body.appendChild(iframe);
                }
                else { /* 그 외 단말기 */
                    outLink(url);
                }
            }
        }
        
        /* 카테고리 */
        $scope.ctgTabIdx = 0; /* 상단탭 (카테고리,브랜드,기획전) */
        $scope.ctgSubTabIdx = 0; /* 카테고리 서브텝(전체상품,롯데백화점) */
        
        $scope.resultPosition = 0; // 카테고리 초성 검색 결과후 스크롤 위치 구함
        $scope.setResultPosTop = function(){
            $scope.resultPosition = angular.element(".brandSet .resultPosition").position().top;
            console.log($scope.resultPosition);
        }
        
        /* 좌측 카테고리 닫기 */
        $scope.closeSideCtg = function(){
            if($scope.isShowSideCtg) {
                // history.back(-1);
                // dimmedClose({target:"category"});
                if($scope.LotteDimm.target=="category") {
                    $scope.dimmedClose();
                }
                LotteUtil.elementMoveX($("section.side_cate"), 350, 0, 20);
                window.scrollTo( 0 , commModule.scrollY ) ;
                $scope.isShowSideCtg = false;
                // $scope.$apply();
            }
        };

        $http.get(LotteCommon.sideCtgData)
        .success(function(data){
            console.log(data)
            $scope.depth;
            $scope.sideCtgData = data;

            $scope.depthSet = function(idx , obj ){
                $scope.depth = idx;
                /*
                 * $scope.sendTclick('m_side_cate_categroup_' + parseInt(obj) );
                 * Tclick 삭제
                 */
            }

            $scope.goCategory = function(who,idx , sub_cate){
                var arr = (who == 'ctgAll') ? $scope.sideCtgData.ctgAll : $scope.sideCtgData.ctgDepart;
                var ctg_no = arr[$scope.depth].lctgs[idx].ctg_no;
                $scope.closeSideCtg() ;
                setTimeout(function(){
                    /*
                     * $window.location.href =
                     * LotteCommon.cateMidAngul+"?"+$scope.baseParam+"&curDispNo="+ctg_no+"&cateDiv=MIDDLE&idx="+($scope.depth+1)+"&tclick=m_side_cate_catebig_"+ctg_no;
                     */
                    /*
                     * $window.location.href =
                     * LotteCommon.cateMidAngul+"?"+$scope.baseParam+"&curDispNo="+ctg_no+"&title="+sub_cate+"&cateDiv=MIDDLE&idx=1&tclick=m_side_cate_catebig_"+ctg_no;
                     */
                    $window.location.href = encodeURI(LotteCommon.cateMidAngul+"?"+$scope.baseParam+"&curDispNo="+ctg_no+"&title="+sub_cate+"&cateDiv=MIDDLE&idx=1&tclick=m_side_cate_catebig_"+ctg_no);
                } , 100 ) ; 
            }

            $scope.sideCateTab = function(tab){
                $scope.ctgSubTabIdx = tab;
                /* 백화점 리스트는 display:none 또는 hide() 처리하면 작동 안됨 */
                var categorySet = $('section#s_category div.categorySet'),
                    nav = categorySet.find('nav.navi a'),
                    menu = categorySet.find('.menu');
                menu.hide();
                menu.removeClass('active');
                menu.find('dd').css('height','0px');
                categorySet.find(".scroll_wrap").css("height",""); //텝이동간  height 값 초기화
                categorySet.scrollTop(0);
                if(tab==0){
                    categorySet.find('.menu.all').show();
                    $scope.sendTclick("m_side_cate_subtab_allproduct");
                }else{
                    categorySet.find('.menu.depart').show().css({'visibility':'visible',position:'static'});
                    $scope.sendTclick("m_side_cate_subtab_lottedept");
                }
            }
        })
        .error(function(data){
            console.log('Error Data :  좌측 카테고리 데이터');
        });
        /* 브랜드 */ 
        $scope.loadBrandList = function(tabIndex,btnIndex){
            $scope.sideCtgBrandData = [];
            var params = {
                tabIndex : tabIndex,
                btnIndex : btnIndex
            };
            /* console.log(LotteCommon.sideCtgBrandData,params); */
            $http.get(LotteCommon.sideCtgBrandData, {params:params})
            .success(function(data){
                $scope.sideCtgBrandData = data.brandList.items;
                $scope.isBrdLoadCst = false;
                $scope.setResultPosTop();
                setTimeout(function(){
                    angular.element(".brandSet").scrollTop($scope.resultPosition - 65);
                },300);
            })
            .error(function(data){
                console.log('Error Data :  좌측 카테고리 브랜드리스트 데이터');
                $scope.isBrdLoadCst = false;
            });
        }
        /* 브랜드 검색 */
        $scope.searchBrandList = function(keyword){
            $scope.isBrdLoadSrc = true; /* 키워드 검색결과 로딩바 시작 */
            var params = {
                sch_nm : keyword
            };            
            $scope.sendTclick("m_side_brand_brandsearch");
            $scope.sideCtgBrandSearch = [];
            $http.get(LotteCommon.sideCtgBrandSearch, {params:params})
            .success(function(data){                
                $scope.sideCtgBrandSearch = data.brandList.items;
                $scope.isBrdLoadSrc = false; /* 키워드 검색결과 로딩바 끝 */
                $scope.setResultPosTop();
            })
            .error(function(data){
                console.log('Error Data :  좌측 카테고리 기획전  검색 리스트 데이터');
                $scope.isBrdLoadSrc = false;
            });
        }
        /* 기획전 */
        $scope.specialBannerData; /* 2개 배너 */     
        $scope.specialListData; /* 하단 리스트 */
        $scope.loadSpecialList = function(disp_no){
            var params = {
                curDispNo : disp_no
            };
            $http.get(LotteCommon.sideCtgSpecialData, {params:params})
            .success(function(data){
                $scope.sideCtgSpecialBannerData = data.specialList.plan_banner_list.items;  
                $scope.sideCtgSpecialListData = data.specialList.plan_shop_list.items;
                                
                $scope.isSpdpLoadCtg = false;
            })
            .error(function(data){
                console.log('Error Data :  좌측 카테고리 기획전 리스트 데이터');
                $scope.isSpdpLoadCtg = false;
            });
        }
        /* 기획전 검색 */
        $scope.changeKeyword = function(str){ /* '[<!HS>나이키<!HE>&뉴발란스]' ; */ 
            str = LotteUtil.replaceAll(str,'<!HS>','<u>') ; 
            str = LotteUtil.replaceAll(str,'<!HE>','</u>') ;
            return str;
        }
        $scope.sideCtgSpecialSearch;
        $scope.searchSpecialList = function(str){
            var params = {
                keyword : str
            };
            $scope.sendTclick("m_side_planshop_search");
            $http.get(LotteCommon.sideCtgSpecialSearch + "?" + $scope.baseParam, {params:params})
            .success(function(data){
                $scope.sideCtgSpecialSearch = data.planshop.items;
                $scope.isSpdpLoadSrc = false;
            })
            .error(function(data){
                console.log('Error Data :  좌측 카테고리 기획전  검색 리스트 데이터');
                $scope.isSpdpLoadSrc = false;
            });
        }
        /* 검색결과 눌렀을 때 */
        $scope.specialSearchLink = function(idx,spdp_no){
            $scope.closeSideCtg();
            setTimeout(function(){                
                $window.location.href = LotteCommon.prdlstUrl + "?" + $scope.baseParam + "&curDispNo=" + spdp_no + "&tclick=m_side_planshop_search_list"+idx;
            },100);
        }
        $scope.specialLink = function(idx, spdp_no, specialTab){
            $scope.closeSideCtg();
            $scope.planshopCateIdx = specialTab+1;
            console.log('side plan idx : ' + $scope.planshopCateIdx);
            setTimeout(function(){                
                $window.location.href = LotteCommon.prdlstUrl + "?" + $scope.baseParam + "&curDispNo=" + spdp_no + "&tclick=m_side_planshop_cate_" + $scope.planshopCateIdx + "_list"+idx;
            },100);
        }
        $scope.specialBannerLink = function(idx,disp_no,url){ /* 배너 링크값 = DB */
            $scope.closeSideCtg();
            setTimeout(function(){
                $window.location.href = url + (url.indexOf("?") >= 0?"&":"?") + $scope.baseParam + "&curDispNo=" + disp_no + "&tclick=m_side_planshop_cate_" + disp_no + "_banner"+idx;
            },100); 
        }
    }]);
    sideCtgModule.directive('lotteSideCategory', ['$window', 'LotteCommon','LotteUtil', 'LotteLink', function($window, LotteCommon,LotteUtil, LotteLink){
        return {
            templateUrl:'/lotte/resources_dev/layout/lotte_side_category.html',
            replace:true,
            controller:'SideCtgCtrl',
            link:function($scope, el, attrs){    
                $scope.changeCtgTab = function(idx){
                    var set;
                    if(idx == 0){
                        set = el.find(".categorySet"); 
                    }else if(idx == 1){
                        set = el.find(".brandSet"); 
                    }else if(idx == 2){
                        set = el.find(".specialSet"); 
                    }
                    if(el.find("nav.mainTop a:eq("+ idx +")").hasClass("on")){
                        set.scrollTop(0);
                    }
                    $scope.ctgTabIdx = idx;
                    if($scope.ctgTabIdx == 0){
                        $scope.sendTclick("m_side_cate_tab_category");
                    }else if($scope.ctgTabIdx == 1){
                        $scope.sendTclick("m_side_cate_tab_brand");
                    }else{
                        $scope.sendTclick("m_side_cate_tab_planshop");
                    }
                };
                
                $scope.showSideCategory = function() {
                    if($scope.isShowSideCtg) {
                        $scope.closeSideCtg();
                        return true;
                    }
                    if($scope.ctgTabIdx == 2){ // 닷컴 기획전 텝일경우 스크롤 및 결과값 초기화
                        // $scope.changeCtgTab(2);
                    }
                    
                    if (isApp) { /* app 일경우 간격이 다름 */
                        $(el).addClass("isApp");
                    }
                    $scope.isShowSideCtg = true;
                    
                    $scope.dimmedOpen({
                        target:"category",
                        callback:this.closeSideCtg,
                        scrollEventFlag: false
                    });
                    LotteUtil.elementMoveX(el, 0, 350, 15);
                }
                
                $scope.showSideCtgHeader = function(tFlag) {
                    if($scope.appObj.isApp && !$scope.appObj.isOldApp){
                        openSideCategoryMenu('category');
                        return;
                    }
                    if(!tFlag) {
                        $scope.sendTclick($scope.tClickRenewalBase + 'header_new_cate');
                    }
                    $scope.showSideCategory();
                }
                
                $scope.goMPage = function(tp, idx, outLink){
                    var arr;

                    if(tp == 'spShop') arr = $scope.sideCtgData.spShops;
                    else if(tp == 'svcShop') arr = $scope.sideCtgData.svcShops;
                    else if(tp == 'bestBrd') arr = $scope.sideCtgData.bestBrds;

                    if (outLink) {
                        LotteLink.goOutLink(arr[idx].linkUrl);

                        if(arr[idx].iconClass == "iconInsu") { // 보험몰 Tclick
                            $scope.sendTclick("m_side_cate_specialshop_kokdeal");
                        }
                    } else {
                    	var shopname = "";
                    	if(arr[idx].iconClass == 'iconGucci') {
                    		shopname = "gucci";
                    	} else if(arr[idx].iconClass == 'iconVine') {
                    		shopname = "vine";
                    	} else if(arr[idx].iconClass == 'iconKshop') {
                            shopname = "kshop";
                        } else if(arr[idx].iconClass == 'iconLotteG') {
                            shopname = "LotteBrandShop";
                        }
                        $window.location.href = arr[idx].linkUrl + ((arr[idx].linkUrl.indexOf("?")!=-1)?"&":"?") + $scope.baseParam + "&tclick="+$scope.tClickBase+"side_cate_specialshop_"+shopname;
                    }
                }
                $scope.goSpecialMallPage = function(outLink){
                    $window.location.href = outLink + (outLink.indexOf("?") >= 0?"&":"?") + $scope.baseParam + "&tclick=m_side_cate_specialmall_"+(this.$index+1);
                }
            }
        }
    }]);
    /* 브랜드 */
    sideCtgModule.directive('lotteBrandkey', ['$window', 'LotteCommon', function($window, LotteCommon){
        return {
            link:function($scope, el, attrs){   
                $scope.tabIndex = 0;
                $scope.btnIndex = 0;
                $scope.lang = 'kor'; /* ㄱㄴㄷ & ABC */
                                
                $scope.searchBrand = function(){
                    var $kwInput = $('.brandSet fieldset input[type=text]'),
                          keyword = $kwInput.val(),
                          resultBox = $('.brandSet .searchList.result');

                    if(keyword == '' || keyword.length < 2){
                        alert('검색을 위해서는 2글자 이상의 단어를 입력하여 주시기 바랍니다.');
                        return;
                    }else{
                        $kwInput.blur();
                        $scope.searchBrandList(keyword);
                        resultBox.show();
                        return;
                    }
                };
                el.find(".result .btn_close").click(function(){
                    $(this).parent().hide();
                    el.scrollTop(0);
                });
                /* ㄱㄴㄷ & ABC 선택 */
                $scope.brandTab = function(idx){
                    $scope.tabIndex = idx;
                    if(idx == '0'){
                        $scope.lang = "kor";
                    }else{
                        $scope.lang = "eng";
                    }
                };
                /* 브랜드 자음검색 */
                $scope.brandBtn = function(idx,val){
                    $scope.brandVal = val;
                    $scope.$parent.isBrdLoadCst = true; /* 자음검색 로딩바 시작 */
                    $scope.btnIndex = idx;
                    $(".brandSet nav."+$scope.lang+" a").removeClass("on");
                    $(".brandSet nav."+$scope.lang+" a:eq("+$scope.btnIndex+")").addClass("on");
                    $scope.loadBrandList($scope.tabIndex,$scope.btnIndex);
                };
                /* 브랜드 링크 */
                $scope.goBrand = function(who,idx){
                    $scope.closeSideCtg() ;
                    setTimeout(function(){
                        var arr = (who == 'search') ? $scope.sideCtgBrandSearch : $scope.sideCtgBrandData;
                        var disp_no = arr[idx].disp_no;
                        var brnd_no = arr[idx].brnd_no;
                        var disp_lrg_nm = arr[idx].disp_lrg_nm;
                        if(who == 'search'){
                            $scope.who = 'search';
                        }else{
                            $scope.who = 'list';
                        }
                        if($scope.who == 'search'){
                            // $window.location.href =
                            // LotteCommon.baseUrl+"/category/m/cate_brand_main.do?"+$scope.baseParam+"&curDispNo="+disp_no+"&dispLrgNm="+disp_lrg_nm+"&idx="+(idx+1)+"&tclick=m_side_brand_brandsearch_list"+(idx+1);
                            $window.location.href = LotteCommon.brandShopUrl + "?" + $scope.baseParam+"&upBrdNo="+brnd_no+"&idx=1&tclick=m_side_brand_brandsearch_list"+(idx+1);
                        }else{
                            // $window.location.href =
                            // LotteCommon.baseUrl+"/category/m/cate_brand_main.do?"+$scope.baseParam+"&curDispNo="+disp_no+"&dispLrgNm="+disp_lrg_nm+"&idx="+(idx+1)+"&tclick=m_side_brand_"+$scope.lang+"_idx"+(idx+1);
                            $window.location.href = LotteCommon.brandShopUrl + "?" + $scope.baseParam+"&upBrdNo="+brnd_no+"&idx=1&tclick=m_side_brand_"+$scope.lang+"_idx"+(idx+1);
                        }
                    },100);
                }
            }
        }
    }]);
    /* 기획전 */
    sideCtgModule.directive('lotteSpecialkey', ['$window','$http', 'LotteCommon', function($window, $http, LotteCommon){
        return {
            link:function($scope, el, attrs){
                $scope.specialTab = 0; /* 기획전 tab */
                $http.get(LotteCommon.sideCtgSpecial) /* data */ 
                .success(function(data){                
                    $scope.sideCtgSpecial = data.planShopCate; 
                    $scope.loadSpecialList(data.planShopCate[0].disp_no);
                    
                }).error(function(data){
                    console.log('Error Data :  카테고리  데이터');
                });
                el.find(".result .btn_close").click(function(){
                    $(this).parent().hide();
                    el.scrollTop(0);
                });
                $scope.searchSpecial = function(){
                    $scope.$parent.isSpdpLoadSrc = true;
                    
                    var keyword = $('.specialSet fieldset input[type=text]').val();
                    if(keyword == '' || keyword.length < 2){
                        alert('검색을 위해서는 2글자 이상의 단어를 입력하여 주시기 바랍니다.');
                        return;
                    }else{
                        $scope.searchSpecialList(keyword);
                        $(".specialSet .result").show();
                        return;
                    };
                };
                $scope.selectSpecialKey = function(idx,disp_no){
                    $scope.$parent.isSpdpLoadCtg = true;
                    $scope.specialTab = idx;
                    $scope.sendTclick('m_side_planshop_cate_'+(idx+1));
                    $scope.loadSpecialList(disp_no);
                };
            }
        }
    }]);
    sideCtgModule.directive('sideCategorySlide',function(){
        return function(scope,element,attrs){
            if(scope.$last){
                setTimeout(function(){
                    scope.$apply(function(){
                        /* sideCategory = new SideCategory; */ 
                        /*
                         * 전체상품,롯데백화점 고정 및 클릭시 scrollTop 변경 & 클릭시 미리 높이값계산하여 메뉴
                         * scrollTop 시킴
                         */
                        var s_category = $("section#s_category"),
                            categorySet = s_category.find(".categorySet"),
                            scroll_wrap = categorySet.find(".scroll_wrap"),
                            dl = categorySet.find("dl"),
                            dt = categorySet.find("dl.menu dt"),
                            dd = categorySet.find("dl.menu dd"),                            
                            dh = dt.height() + 1,
                            spShop = categorySet.find(".spShop"),
                            lotteApp = categorySet.find(".lotteApp");
                        dd.each(function(){
                            $(this).addClass("hiding").attr("role",$(this).find("li").length);
                        });
                        dt.click(function(){ 
                            var otHt = ($(this).parent().parent().find("dl").length * dh) + spShop.height() + lotteApp.height(),
                                liHt = ($(this).parent().find("dd").attr("role") * dh);
                            if($(this).parent().hasClass("active")){
                                scroll_wrap.css("height","");
                                $(this).parent().removeClass("active");
                                $(this).parent().find("dd").css({height:0});
                            }else{
                                scroll_wrap.css("height",otHt + liHt + 150);
                                dl.removeClass("active");
                                categorySet.scrollTop(($(this).parent().index() * dh));
                                dd.css({height:0});
                                $(this).parent().addClass("active");
                                $(this).parent().find("dd").css({height:liHt});
                            }
                        });
                    });
                },0);
            } 
        }
    });
})(window, window.angular);