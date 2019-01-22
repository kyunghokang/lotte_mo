/**
 * @author : 박해원
 * @date : 20180306
 *
 * @ngdoc : Module
 * @name : searchPlanShop
 * @description
 *  - 기획전형 상품 목록
 *  - 기본설정 페이지 : 검색 목록 페이지, 카테고리 상품목록
 *    config로 추가 페이지 등록 가능
 */
(function(){
    angular.module('searchPlanShop',['hwSwipe'])
    .value('currentPage',{})
    /**
     * @ngdoc constant
     * @name observers
     * @description
     * - observer 목록
     */
    .constant('observers',{
        request:'request',
        response:'response'
    })

    /**
     * @ngdoc provider
     * @name prodConfig
     * @description
     *  - responseParams : 기획전형 강제 노출 파라미터 설정 { false : null, true : not null }
     *  - catchInfo :
     *      necessaryParams : 데이터 로드시 필수 추가 파라미터
     *      hideParams : 설정된 파라미터 값이 있을경우 기획전형 상품 비노출
     *      page : 체크할 페이지
     *      json : 체크된 페이지의 데이터 URL,
     *      screenID : 상품 티클릭,
     *      moreType : 0:검색, 1:카테 ( '모두보기' 페이지에서 사용 )
     */
    .provider('prodConfig',['LotteCommonProvider',function(LotteCommonProvider){
       var urlSvc = LotteCommonProvider.$get(),
           config = {
           actionParams: {},
           // 카테고리 상품목록, 검색결과 목록
           catchInfo : [{
               page: urlSvc['searchUrl'],
               json: [ urlSvc['srhListData2016'], urlSvc['srhListData2016LC'] ],
               necessaryParams: {
                   cmpsCd:50,
                   dispCnt:30
               },
               hideParams : [
                   'ctgNo',
                   'dsCtgDepth',
                   'brdNo',
                   'ctgDepth1',
                   'ctgDepth2',
                   'ctgDepth3',
                   'ctgDepth4',
                   'ctgDepth5',
                   'priceMaxU',
                   'priceMinU',
                   'freeInstYN',
                   'pointYN',
                   'smpickYN',
                   'isDlvQuick',
                   'colorCd',
                   'freeDeliYN',
                   'deptYN',
                   'tvhomeYN',
                   'superYN',
                   'brdstoreYN',
                   'pkgYN',
                   'freeGiftYN',
                   'delQuickYN',
                   'delSevenYN',
                   'delTdarYN',
                   'dtCtgNo',
                   'dtCtgDepth',
                   'dtDsCtgDepth',
                   'feelNo',
                   'shoesSize',
                   'starPoint'
               ],
               def:{
                   screenID:'SrhResult',
                   curDispNoSctCd:50,
                   moreType:0
               },
               noparams : []
           },
           {
               page: urlSvc['categoryUrl'],
               json: [ urlSvc['cateListData2018'] ],
               necessaryParams: {
                   cmpsCd:50,
                   dispCnt:30
               },
               hideParams : [
                   'ctgNo',
                   'dsCtgDepth',
                   'brdNo',
                   'ctgDepth1',
                   'ctgDepth2',
                   'ctgDepth3',
                   'ctgDepth4',
                   'ctgDepth5',
                   'priceMaxU',
                   'priceMinU',
                   'freeInstYN',
                   'pointYN',
                   'smpickYN',
                   'isDlvQuick',
                   'colorCd',
                   'freeDeliYN',
                   'deptYN',
                   'tvhomeYN',
                   'superYN',
                   'brdstoreYN',
                   'pkgYN',
                   'freeGiftYN',
                   'delQuickYN',
                   'isDlvToday',
                   'isCrsPickYn',
                   'feelNo',
                   'shoesSize',
                   'starPoint'
               ],
               def:{
                   screenID:'side_cate_catesmall',
                   curDispNoSctCd:73,
                   moreType:1
               },
               noparams : []
           }]
       };
       return {
           setResponseParams:function(param){
                if( typeof param === 'object' ) config.actionParams = angular.extend( param, config.actionParams );
           },
           setCatchInfo:function(options){
                if( typeof options === 'object' ) {
                    options.page = urls[options.page];
                    options.json = urls[options.json];
                    config.catchInfo.push(options);
                }
           },
           $get: function(){
               return config;
           }
       }
    }])
    /**
     * @ngdoc factory
     * @name catchFilter
     * @description
     *  - $http url filter
     *  - 기획전형 상품이 노출 될 페이지와 데이터 URL 체크
     */
    .factory('catchFilter',
				['prodConfig', 'LotteCommon', 'searchPlanShopService', 'observers',
		function( prodConfig,   LotteCommon,   searchPlanShopService,   observers){
        var config = {
            permit: prodConfig.catchInfo,
            URLFilter: function(url){
                var addParmas = null;
                for( var i in config.permit ) {
                    //if( config.permit[i].page.indexOf(location.pathname) !== -1 ) {}
                    for( var j in config.permit[i].json ) { // json Array로 필터 처리 201803127
                        if (url.indexOf(config.permit[i].json[j]) != -1) {
                            if (!searchPlanShopService.getCurrPage().json){
                            	searchPlanShopService.setCurrPage(config.permit[i]);
                            }
                            addParmas = angular.copy(config.permit[i].necessaryParams);
                        }
                    }
                }
                return addParmas;
            },
            ParamsFilter: function( params ){
                var exit = false;
                if(!params) params = {};
                if(params.page===1) { // 노출 상태 변경은 page가 1일 경우에만
                    searchPlanShopService.visibleState.set(false); // 기본 노출
                    for(var i in params) {
                        // 비노출 파라미터 체크
                        for( var s in searchPlanShopService.getCurrPage().hideParams ){
                            if( i === searchPlanShopService.getCurrPage().hideParams[s] && params[i] ) {
                                searchPlanShopService.visibleState.set(true);
                                exit = true;
                                break;
                            }
                        }
                        // 강제노출 값 체크 ( 비노출 중 일때만 )
                        if(searchPlanShopService.visibleState.get()) {
                            for (var j in prodConfig.actionParams) {
                                if (i === j && ( (!prodConfig.actionParams[j] && !params[i]) || (prodConfig.actionParams[j] && params[i]) )) {
                                    searchPlanShopService.visibleState.set(false);
                                    exit = true;
                                    break;
                                }
                            }
                        }
                        if(exit) break;
                    }
                }
                return searchPlanShopService.visibleState.get();
            },
            request : function(res){
                return config.URLFilter(res.url);
            },
            response: function(res){
                if( config.URLFilter(res.config.url) ) {
                    searchPlanShopService.promiseList[observers.response].set({
                        data: res.data,
                        visible: config.ParamsFilter(res.config.params)
                    });
                }
            }
        }
        return config;
    }])
    /**
     * @ngdoc factory
     * @name httpInterceptor
     * @description
     *  - $Http event
     */
    .factory('httpInterceptor', ['$q','catchFilter','searchPlanShopService',
        function ($q,catchFilter,searchPlanShopService) {
        return {
            request: function (config) {
                // 삭제 파라미터
                var deleteParams = searchPlanShopService.getCurrPage().noparams || [];
                for( var i=0; i<deleteParams.length; ++i ) {
                    for( var s in config.params ){
                        if( s === deleteParams[i] ) delete config.params[s];
                    }
                }
                // 필수 파라미터 추가
                var appendParam = catchFilter.request(config);
                if(appendParam){
                    if(!config.params) config.params = {};
                    config.params = angular.extend( appendParam, config.params );
                }
                // 모두보기페이지로 이동시 필요한 파라미터
                if( appendParam && config.params ) searchPlanShopService.setParams( config.params );
                return config || $q.when(config);
            },
            response: function (response) {
                catchFilter.response(response);
                return response || $q.when(response);
            },
            requestError: function (rejection) {
                return $q.reject(rejection);
            },
            responseError: function (rejection) {
                return $q.reject(rejection);
            }
        };
    }])
    /**
     * @ngdoc directive
     * @name searchPlanShop
     * @description
     *  - 기획전형 상품
     */
    .directive('searchPlanShop',
				['searchPlanShopService','prodConfig','observers','LotteCommon','dataReplaceKey','commInitData','$timeout',
		function( searchPlanShopService,  prodConfig,  observers,  LotteCommon,  dataReplaceKey,  commInitData,  $timeout){
        return {
            restrict:'EA',
            scope:true,
            replace:true,
            templateUrl: "/lotte/resources_dev/search/products/planshop/planshop_list.html",
            link:function(scope){
                function getObjeToString(obj) {
                    var params = "?";
                    // tclick, title, cmpsCd, sort값은 미 포함
                    for (var i in obj) if (i != 'tclick' && i != 'title' && i != 'cmpsCd' && i != 'sort' ) params += i + "=" + obj[i] + "&";
                    params = params.substr(0, params.length - 1) + "&moreType="+searchPlanShopService.getCurrPage().def.moreType;
                    params+="&"+baseParam;
                    return params;
                }

                scope.visiblity = false;
                scope.planShopData = [];
                scope.swipeVisible = false;
                
                var psDataLoaded = false;
                
                $timeout(function(){
                	if(psDataLoaded === true){ return; }
                	//config.URLFilter(LotteCommon.cateListData2016);
                	//searchPlanShopService.setCurrPage(config.permit[i]);
                	try{
                		var i, info;
                		var len = prodConfig.catchInfo.length;
                		for(i=0; i<len; i++){
                			info = prodConfig.catchInfo[i];
                			if(location.href.indexOf(info.page) >= 0){
                				searchPlanShopService.setCurrPage(info);
                				break;
                			}
                		}
                		scope.planShopData = dataReplaceKey(scope.srhResultData.planPrdLst.items);
                		scope.swipeVisible = true;
                	}catch(e){}
                }, 10);
                
            	searchPlanShopService.promiseList[observers.response].get()
            	.then(null,null,function(res){
            		psDataLoaded = true;
            		scope.visiblity = res.visible;
            		var data = res.data.max || res.data;
            		try{
            			if(data.planPrdLst.items) scope.planShopData = dataReplaceKey(data.planPrdLst.items);
            			scope.swipeVisible = true;
            		} catch(e){
            			if(res.visible) scope.planShopData = [];
            			console.log('[planshop_list] : 데이터 없음');
            		}
            	});
                
                scope.more=function(){
                    // 최종 뷰 상태의 파라미터 값을 모두 링크에 추가
            		if(location.href.indexOf("new_prod_list.do") >= 0){
            			location.href=LotteCommon.searchPanShopList+getObjeToString(commInitData.query)+"&tclick="+getTclick(3);
            		}else{
            			location.href=LotteCommon.searchPanShopList+getObjeToString(searchPlanShopService.getParams()||commInitData.query)+"&tclick="+getTclick(3);
            		}
                }
                
                scope.$watch("planShopData", function(){
                	try{
                		var scp = angular.element(".planshop_list_wrap [hw-swipe]").scope();
                		scp.planshopSwpIdx = 0;
                		scp.planshopTotal = Math.min(scope.planShopData.length, 14);
                		
                		scope.swipeVisible = false;
                		$timeout(function(){
                			scope.swipeVisible = true;
                		}, 100);
                	}catch(e){}
                });

                /**
                 * 기획전 상품 링크
                 * @param item
                 */
                scope.planProductsLink = function(item){
                    var tclick = getTclick(1, this.$index);
                    var itemLink = scope.getProductViewUrl(item, tclick);
                    itemLink += "&curDispNoSctCd=" + scope.curDispNoSctCd;
                    location.href = itemLink;
                }

                /**
                 * 스와이프 티클릭
                 */
                scope.$watch(function(){
                    var n = 0;
                    try{ n = angular.element(".planshop_list_wrap [hw-swipe]").scope().planshopSwpIdx } catch(e){};
                    return n;
                },
                function(n,o){
                    if(n===o||n===undefined) return;
                    scope.sendTclick( getTclick(2, n) );
                });
                
                
                /**
                 * 티클릭 구하기
                 */
                function getTclick(flag, idx){
                	var str = "";
                	if(location.href.indexOf("new_prod_list.do") >= 0){
                		str = scope.tClickBase + "side_cate_catesmall_" + commInitData.query.mGrpNo + "_";
                	}else{
                		str = scope.tClickBase + "SrhResult_";
                	}
                	
                	switch(flag){
                	case 1:
                		str += "Clk_Deal_" + (idx + 1);
                		break;
                	case 2:
                		str += "Swp_Deal_" + (idx + 1);
                		break;
                	case 3:
                		str += "Clk_Deal_GoL";
                		break;
                	// no default
                	}
                	
                	return str;
                };
                
            }
        }
    }])

    /**
     * @ngdoc service
     * @name searchPlanShopService
     * @description
     *  - observer response 전용
     */
    .service('searchPlanShopService',['$q','currentPage',function($q,currentPage){
        this.promiseList = { };
        this.addPromise = function( observerName ) {
            var self = this;
            if(self.promiseList[observerName]) return;
            var obs = self.promiseList[observerName]={},
                defer = $q.defer();

            obs['defer'] = defer;
            obs['notify'] = defer.notify;
            obs.get = function(){
                return defer.promise;
            }
            obs.set = function(data){
                defer.notify(data)
            }
        }
        this.visibleState = {
            state : false,
            set : function( state ){
                this.state = state;
            },
            get : function( ) {
                return this.state;
            }
        }
        this.setCurrPage = function(config){
        	currentPage = config;
        }
        this.getCurrPage = function(){ return currentPage }

        this.setParams = function(p){ this.params = p }
        this.getParams = function() { return this.params }
    }])
    /**
     * @ngdoc config
     * @description
     *  - $http이벤트 및 기획전형 영역 비 노출 파라미터 설정
     */
    .config(['$httpProvider','prodConfigProvider',
        function($httpProvider,prodConfigProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
            prodConfigProvider.setResponseParams( {rtnType:false} );

            /*
                @추가시
                prodConfigProvider.setCatchInfo( {
                    page : 'specialMallUrl', <-- svc url변수명을 string으로
                    json : 'specialSubUrl', <-- svc url변수명을 string으로
                    necessaryParams: {},
                    hideParams : []
                });

                @다른 모듈에서 추가시
                angular.module('app',['searchPlanShop'])
                .config(['prodConfigProvider,function(prodConfigProvider){
                    prodConfigProvider.setCatchInfo( {
                        page : 'specialMallUrl', <-- svc url변수명을 string으로
                        json : 'specialSubUrl', <-- svc url변수명을 string으로
                        necessaryParams: {},
                        hideParams : []
                    });
                }]);
             */
        }
    ])
    /**
     * @ngdoc run
     * @description
     *  - observer 등록
     */
    .run(['observers','searchPlanShopService',
        function(observers,searchPlanShopService){
        if(!observers) return;
        for( var i in observers ) searchPlanShopService.addPromise(observers[i]);
    }])

    /**
     * @ngdoc factory
     * @name dataMaping
     * @description
     *  - search_list_2018.js > reMappingPldUnitData
     */
    .factory('dataReplaceKey',['LotteUtil',function(LotteUtil){
        return function(data) {
            try{
                if(data[0].goods_nm && data[0].goods_no){
                	angular.forEach(data, function(itm, idx){
                		itm.brnd_nm = itm.brnd_nm.replace(/\[|\]/g, "");
                	});
                	return data;
                }
            } catch(e) { return [] }

            var convertFields = {
                goods_no : 'goodsNo',
                goods_nm : 'goodsNm',
                brnd_nm : 'brandNm',
                img_url : 'imgUrl',
                original_price : 'price1',
                discounted_price : 'price2',
                sale_rate : 'saleRate',
                flag : 'flag',
                review_count : 'reviewCnt',
                avg_gdas_stfd_val : 'avg_gdas_stfd_val',
                smartpick_yn: 'isSmpick',
                limit_age_yn: 'byrAgelmt',
                is_himart : 'isHimart',
                is_dept : 'isDept',
                is_tvhome : 'isTvhome',
                is_youngplz : 'isYoung',
                is_super : 'isSuper',
                is_sale_promotion: 'goodsCmpsCd',
                outlnk : 'outlnk',
                outlnkMall : 'outlnkMall',
                curDispNo: 'curDispNo',
                has_coupon: 'useCpn',
                hash_list: 'hash_list',
                find_age: 'find_age',
                find_gender: 'find_gender',
                savePoint: 'savePoint',
                vodUrl: 'vodUrl'
            }

            var defaultConvertStruct = {
                goods_no : '',
                goods_nm : '',
                brnd_nm : '',
                img_url : '',
                img_url_550 : '',
                original_price : '',
                discounted_price : '',
                sale_rate : '',
                flag : '',
                is_sold_out : false,
                has_coupon : false, // 쿠폰 존재 여부 (AS-IS : useCpn = 'coupon' 일경우 true)
                has_wish : false,
                is_sale_promotion : false,
                review_count : 0,
                bought_sum : 0,
                md_tip : '',
                promotion_text : '',
                isdlex_free : false, // (AS-IS : flag값에 무료배송 포함이면 true)
                smartpick_yn : false, // 스마트픽(AS-IS : isSmpick true/false 판단 Y or N)
                sold_out_cd_yn : 'N', // 품절임박 유무(기본 'N')
                limit_age_yn : 'N', // 성인 이미지 뷰 허용 여부(AS-IS : byrAgelmt 값으로 판단 'Y' OR 'N')
                link_url : '',
                is_himart : '',
                is_dept : '',
                is_youngplz : '',
                outlnk: '',
                outlnkMall: '',
                curDispNo: '',
                savePoint: 0,
                vodUrl: ''
            }
            var retData = [];
            angular.forEach(data, function(item, index) {
                var newData = angular.copy(defaultConvertStruct);
                angular.forEach(convertFields, function(val, key) {
                    if(key == 'has_coupon') {
                        newData[key] = item[val] == 'coupon' ? true:false;
                    } else if(key == 'flag') {
                        if(item['flag'] && item['flag'].indexOf('무료배송') > -1) {
                            newData['isdlex_free'] = true;
                        }
                    } else if(key == 'is_sale_promotion') {
                        if(item['goodsCmpsCd'] == '30') {
                            newData[key] = true;
                        }
                    } else if(key == 'sale_rate' || key == 'savePoint') {
                        if(item[val] == null) {
                            newData[key] = 0;
                        } else {
                            newData[key] = parseInt(item[val]);
                        }
                    } else if(key == 'smartpick_yn') {
                        newData[key] = item[val] ? 'Y':'N';
                    } else if(key == 'limit_age_yn') {
                        newData[key] = item[val] == 19 ? 'Y':'N';
                    } else if(key == 'goods_nm') {
                        newData[key] = LotteUtil.replaceAll(item['goodsNm'],'<!HS>','<STRONG>');
                        newData[key] = LotteUtil.replaceAll(newData[key],'<!HE>','</STRONG>');
                    } else {
                        newData[key] = item[val];
                    }
                });

                if(item.isDlvToday != undefined) newData.isDlvToday = item.isDlvToday;
                if(item.isDeptPickYn != undefined) newData.isDeptPickYn = item.isDeptPickYn;
                if(item.isCrsPickYn != undefined) newData.isCrsPickYn = item.isCrsPickYn;
                if(item.isDlvQuick != undefined) newData.isDlvQuick = item.isDlvQuick;//퀵배송 2016.10.24

                /* 2016.08.18 배송메세지 강화*/
                /* 2016.11.24 무이자 노출 */
                if(item.nint_card_flag != undefined) newData.nint_card_flag = item.nint_card_flag;

                // 리뷰형
                newData.reivew_list = [];
                if(item.gdasInfo1 != undefined && item.gdasInfo1.gdasNo != undefined && item.gdasInfo1.gdasNo != "") newData.reivew_list.push(item.gdasInfo1);

                if(item.gdasInfo2 != undefined && item.gdasInfo2.gdasNo != undefined && item.gdasInfo2.gdasNo != "") newData.reivew_list.push(item.gdasInfo2);

                retData.push(newData);
            });
            return retData;
        }
    }])

})();