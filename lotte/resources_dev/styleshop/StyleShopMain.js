(function (window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteMainPop',
        'lotteNgSwipe',
        'lotteSlider'
    ]);
    
    app.controller('StyleShopMainCtrl', ['$rootScope', '$scope', '$timeout', '$window', '$location', '$q', 'LotteCommon', 'commInitData', 'LotteUserService', 'LotteStorage', 'LotteCookie', 'AppDownBnrService',
        function ($rootScope, $scope, $timeout, $window, $location, $q, LotteCommon, commInitData, LotteUserService, LotteStorage, LotteCookie, AppDownBnrService) {
        
        $scope.showWrap = true; // 컨텐츠 표시 Flag
        $scope.contVisible = true; // 컨텐츠 표시 Flag
        
        $scope.subTitle = "스타일샵"; // 서브헤더 타이틀
        $scope.screenID = "styleshop"; // Tclick 을 위한 screenID
        
        $scope.pageLoading = false; // 탭 페이지 로드 Flag
        $scope.productListLoading = false; // 상품 로드 Flag <div class="listLoading" ng-if="productListLoading && !pageLoading"> 가 있어야 함    
    }]);

    // Main Container
    app.directive('lotteContainer', [function () {
        return {
            templateUrl : '/lotte/resources_dev/styleshop/StyleShopMain_container.html',
            replace : true,
            link : function ($scope, element, attrs) {

            }
        }
    }]);

    // Content Container
    app.directive('contentContainer', ['$compile', '$http', '$templateCache','$timeout','$window', function ($compile, $http, $templateCache,$timeout,$window) {
        return {
            templateUrl : '/lotte/resources_dev/main/tpml/tpml_styleshop.html',
            restrict: 'AEC',
            replace : true,
            transclude: true,
            link : function ($scope, element, attrs) 
            {

                /*****************************************
                 * Page UI / Data
                 *****************************************/
                $scope.pageUI = {
                    curMenuDispNo: "5550633", // 현재 탭 전시번호
                    storedData: {}, // 탭 데이터
                    curDispNo: "", // 전시 인입코드
                    curdispNoSctCd: 46, // 전시 인입 상세 코드
                    isLoginData: false, // 로그인 상태
                    winScrollHeaderDownFlag: false
                };

                $scope.getRbTclick = function(code)
                {
                    var rb_tlcikCode = "m_DC_menu"+code+"_Clk_TOP_";
                    switch ($scope.loginInfo.gradeCd){
                        case "10": rb_tlcikCode = rb_tlcikCode + "PLTN01"; break; 
                        case "20": rb_tlcikCode = rb_tlcikCode + "PLTN02"; break; 
                        case "30": rb_tlcikCode = rb_tlcikCode + "PLTN03"; break; 
                        case "40": rb_tlcikCode = rb_tlcikCode + "GOLD"; break; 
                        case "50": rb_tlcikCode = rb_tlcikCode + "SILV"; break; 
                        default: rb_tlcikCode = rb_tlcikCode + "COMN"; break; // 기타 또는 예외
                    }
                    return rb_tlcikCode;
                }

                // 배너 일반/아웃 링크 처리
                $scope.linkUrl = function (url, outlinkFlag, tclick, addParams) {
                   
                    if (outlinkFlag) {
                        $scope.sendOutLink(url); // 외부 링크 보내기 (새창)
                        if (tclick) $scope.sendTclick(tclick); // 외부링크일때 iframe으로 tclick 전송
                    } 
                    else {
                        // 링크 url에 base parameter를 붙여준다.
                        var url = $scope.baseLink(url); 

                        if (addParams) { // 추가 파라메타가 있다면
                            angular.forEach(addParams, function (val, key) {
                                url += "&" + key + "=" + val;
                            });
                        }

                        // url에 전시 유입코드가 없다면 붙여줌
                        if (url.indexOf('curDispNo') == -1) url += "&curDispNo=" + $scope.pageUI.curDispNo;

                        // url에 전시 유입상세 코드가 없으면서 실제 전시 유입코드 상세 값이 있으면 붙여줌
                        if (url.indexOf('curDispNoSctCd') == -1 && $scope.pageUI.curDispNoSctCd) url += "&curDispNoSctCd=46";// + $scope.pageUI.curDispNoSctCd;

                        // tclick 이 있다면 url 뒤에 parameter를 추가한다.
                        if (tclick) url += "&tclick=" + tclick;

                        // 링크 메인탭 이동시 url 변경이 한번 된 후 는 이동이 안되는 현상 예외처리
                        if ( (url + "").indexOf('main_phone.do?dispNo=') != -1 ) { 
                            if(tclick) $scope.sendTclick(tclick);
                            var disp_no_start = url.indexOf('dispNo=') + 7;
                            var header_menu_dispno = url.substr(disp_no_start, 7);
                            $scope.headerMenuClick(header_menu_dispno);
                        } else {
                            window.location.href = url; // url 이동
                        }
                    }
                };
				/*2017.07.03*/
				$scope.gotoStyleRecom = function (obj){
					window.location.href = $scope.baseLink(obj.link_url) + "&tclick=m_DC_SpeDisp5_W_Clk_Ban";
				};
				
            }
        }
    }]);
    

    // 스타일샵 탭 Controller
    app.controller('tpmlStyleshopCtrl', ['$scope', '$http', 'LotteCommon', 'commInitData', function ($scope, $http, LotteCommon, commInitData) {
        $scope.ajaxLoadFlag = false;
        $scope.tpmlData = {
            uiOpt: {
                dispNo: "5550633",
                gender: "F" // 스타일샵 선택된 탭 (F : 여성, M : 남성)
            },
            contData: {}
        };

        // Data Load
        $scope.loadData = function (gender) {
            if ($scope.ajaxLoadFlag)
                return false;

            $scope.ajaxLoadFlag = true;
            $scope.tpmlData.uiOpt.gender = !gender ? "F" : gender; // 로드 성별 세팅

            if($scope.tpmlData.uiOpt.gender == "F"){
                if($scope.loginInfo.isLogin){
                    if ( $scope.loginInfo.genSctCd && $scope.loginInfo.mbrAge) { // 간편회원일 경우 해당 정보가 없어서 예외처리
                        $scope.bndGen = $scope.loginInfo.genSctCd;
                        $scope.bndAge = $scope.loginInfo.mbrAge;    
                    }
                }

                //디폴트값 설정
                var h_gen = "F"; // 성별(M:남,F:여)
                var h_age = "30"; // 나이대(20, 30, 40, 50)
                if($scope.loginInfo.isLogin){
                    if ($scope.loginInfo.mbrAge) { // 간편회원일 경우 해당 정보가 없어서 예외처리
                        h_age = $scope.loginInfo.mbrAge;
                    }
                }            
                
                /********************************************
                * TEST Func. - 테스트를 위한 코드 추가
                ********************************************/
                if (commInitData.query["age"]) {
                    if(commInitData.query["age"]) {
                        h_age = commInitData.query["age"];
                    }
                }

                //브랜드 상품 성별/연령대별 보기
                $scope.bndAge = h_age;
                
                //LotteCommon.isTestFlag = true; // StyleShopMain.html용에서 확인시 true
                
                var httpConfig = {
                    method: "get",
                    url: LotteCommon.mainOldContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo + "." + $scope.tpmlData.uiOpt.gender : "") ,
                    params: {
                        dispNo: $scope.tpmlData.uiOpt.dispNo,
                        gender: $scope.tpmlData.uiOpt.gender,
                        age   : h_age,
                        preview : $scope.previewDate
                    }
                };

                console.log( LotteCommon.isTestFlag );

            } else{
                var httpConfig = {
                    method: "get",
                    url: LotteCommon.mainOldContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo + "." + $scope.tpmlData.uiOpt.gender : "") ,
                    params: {
                        dispNo: $scope.tpmlData.uiOpt.dispNo,
                        gender: $scope.tpmlData.uiOpt.gender,
                        preview : $scope.previewDate
                    }
                };
            }


            $http(httpConfig) // 실제 탭 데이터 호출
            .success(function (data) {
                $scope.tpmlData.contData = data.main_contents;

                //console.log('$scope.tpmlData.contData', $scope.tpmlData.contData );

                /* 디자이너 하단 브랜드샵 리스트 */
                var dataTotal;
                try{ dataTotal = $scope.tpmlData.contData.brand_shop_list.items != null ? $scope.tpmlData.contData.brand_shop_list.items.length : 0; }
                catch(e){
                    $scope.tpmlData.contData = {
                        brand_shop_list : {
                            items : []
                        }
                    }
                    dataTotal = 0;
                    //console.log('err', '데이타 없음' );
                };

                var brandshopSliceData = [];
                
                // 20170131 테블릿 제거 수정
                if ($scope.tpmlData.contData.brand_shop_list.items && dataTotal > 0) {
                    var i = 0,
                        j = -1;

                    for (i; i < dataTotal; i++) {
                        if (i % 16 == 0) {
                            j++;
                            brandshopSliceData[j] = [];
                        }
                        brandshopSliceData[j].push($scope.tpmlData.contData.brand_shop_list.items[i]);
                    }
                    $scope.tpmlData.brandshopData = brandshopSliceData;
                }else{
                    $scope.tpmlData.brandshopData = null;
                }
				/* 2017.07.03 스타일샵띠배너 재정의 */
				if($scope.tpmlData.contData.img_banner && $scope.tpmlData.contData.img_banner.swip_banner && $scope.tpmlData.contData.img_banner.swip_banner.items){
					$scope.styleRecomBnr = $scope.tpmlData.contData.img_banner.swip_banner.items[0];
				}
            })
            .finally(function () {
                $scope.ajaxLoadFlag = false;
                $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
            });
        };

        // Stored Data Check
        if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
            Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length > 0) {
            $scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
        } else {
            gender=$scope.tpmlData.uiOpt.gender;
            if(commInitData.query['gender'] != undefined){
                var gender = commInitData.query['gender'];
            }
            $scope.loadData(gender);
        }
    }]);
    
    // 스타일샵 탭 Directive
    app.directive('tpmlStyleshop', ['$window', 'LotteCommon', function ($window, LotteCommon) {
        return {
            restrict: 'A', // attribute
            controller: "tpmlStyleshopCtrl",
            link : function ($scope, element, attrs) {
                $scope.tabChange = function (gender) { // WOMEN / MEN 탭 변경
                    $scope.tpmlData.gender = gender;
                    $scope.tpmlData.contData = {};
                    $scope.loadData(gender);

                    var tclickCode = "";

                    if (gender == "F") { // 여성탭
                        tclickCode = "m_DC_SpeDisp5_Tab_Women";
                    } else if (gender == "M") { // 남성탭
                        tclickCode = "m_DC_SpeDisp5_Tab_Men";
                    } else if (gender == "D") { // 남성탭
                        tclickCode = "m_DC_SpeDisp5_Tab_Designer";
                    }

                    if (tclickCode) {
                        var mType= "";
                        switch(gender){
                           default: mType='Women'; break;   
                           case 'F': mType = 'Women'; break;
                           case 'M': mType = 'Men'; break;
                           case 'D': mType = 'Designer'; break;
                        }
                        $scope.sendTclick("m_DC_SpeDisp5_Tab_"+mType);
                    }
                };
                
                function getParameter(url, name) { // 전달 받은 입력된 운영 URL의 파라메타를 Object 형태로 리턴
                    var vars = {};
                    var parts = (url + "").replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                        vars[key] = value;
                    });
                    
                    return vars[name];
                }

                function validateURL(url) { // URL 맵핑
                    var rtnURL = url + "";

                    // PC 기획전 URL일 경우 모바일 기획전 URL로 변경
                    if (rtnURL.indexOf("/planshop/viewPlanShopDetail.lotte") > -1) { 
                        rtnURL = LotteCommon.prdlstUrl + "?curDispNo=" + getParameter(rtnURL, "spdp_no");
                    } // 모바일 기획전일 경우
                    else if (rtnURL.indexOf("/product/m/product_list.do") > -1) { 
                        rtnURL = LotteCommon.prdlstUrl + "?curDispNo=" + getParameter(rtnURL, "curDispNo");
                    } //숫자형태 6~8자 사이로 입력했을 경우 스타일샵 DispNo로 인식하고 스타일샵 카테고리 페이지로 이동
                    else if (rtnURL.length >= 6 && rtnURL.length <= 8 && !rtnURL.match(/[^0-9]/)) { 
                        rtnURL = LotteCommon.styleShopUrl + "?disp_no=" + rtnURL + "&curDispNoSctCd=46";
                    } // 모바일 스타일샵 카테고리일 경우
                    else if (rtnURL.indexOf("/styleshop/styleshop.do") > -1) { 
                        rtnURL = LotteCommon.styleShopUrl + "?disp_no=" + getParameter(rtnURL, "disp_no") + "&curDispNoSctCd=46";
                    } 
                    else if (rtnURL.indexOf("/goods/viewGoodsDetail.lotte") > -1) {
                        rtnURL = LotteCommon.prdviewUrl + "?goods_no=" + getParameter(rtnURL, "goods_no") + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=46";// + $scope.pageUI.curDispNoSctCd;
                    }/* else if () { // PC 스타일샵 오픈시 PC용 스타일샵 링크 페이지를 모바일 스타일샵 링크로 변경 필요

                    }*/

                    return rtnURL;
                }

                $scope.goStyleShopLink = function (item, tclick) { // 운영 링크 경로가 있을 경우 운영 링크로 없을 경우 상품페이지로
                    if (item.sold_out) {
                        return false;
                    }
                    
                    if (item.img_link && (item.img_link + "").length > 3) { // 코너 입력 링크로 이동
                        $scope.linkUrl(validateURL(item.img_link), false, tclick);
                    } else if (item.goods_no) { // 상품으로 이동
                        var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=46"; // + $scope.pageUI.curDispNoSctCd;
                        $window.location.href = url + (tclick ? "&tclick=" + tclick : "");
                    }
                };          
                
                $scope.goStyleShopCategory = function (dispNo, tclick) { // 스타일샵 카테고리 페이지
                    if (dispNo) {
                        var url = LotteCommon.styleShopUrl + "?" + $scope.baseParam + "&disp_no=" + dispNo + "&curDispNoSctCd=46";
                        $window.location.href = url + (tclick ? "&tclick=" + tclick : "");
                    }
                };
                
                $scope.goStyleShopMenLink = function (item, tclick) { // 운영 링크 경로가 있을 경우 운영 링크로 없을 경우 상품페이지로
                    if (item.sold_out) {
                        return false;
                    }
                    
                    if (item.banner_nm !='') { // 코너 입력 링크로 이동
                        var url = LotteCommon.styleShopMenUrl + "?" + $scope.baseParam  + '&' + "keyword=" + item.banner_nm;
                        $window.location.href = url + (tclick ? "&tclick=" + tclick : "");
                    } else if (item.goods_no) { // 상품으로 이동
                        var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=46" ; // + $scope.pageUI.curDispNoSctCd;
                        $window.location.href = url + (tclick ? "&tclick=" + tclick : "");
                    }
                };
               
                $scope.goStyleBrand = function (item, tclick) { // 브랜드 매장 연결
                    if(item.img_link!=''){
                        var url = LotteCommon.brandShopUrl + "?" + $scope.baseParam + "&upBrdNo=" + item.img_link;
                        $window.location.href = url + (tclick ? "&tclick=" + tclick : "");
                    }else{
                        $scope.linkUrl(validateURL(item.url_link), false, tclick);
                    }
                };
                
                $scope.goStyleKeyword = function (item, tclick) { // 브랜드 매장 연결
                    $scope.linkUrl(validateURL(item.ctg_no), false, tclick);
                };

                $scope.chkHtmlColorCode = function (color) { // 컬러 코드값 validate
                    var colorCodeArr = (color + "").match(/^\#[0-9|a-f|A-F]+/i),
                        colorCode = "",
                        rtnColorCode = "#000";

                    if (colorCodeArr && colorCodeArr.length > 0) {
                        colorCode = colorCodeArr[0] + "";
                    }

                    if (colorCode && colorCode.match(/^\#/) && colorCode.length == 4 || colorCode.length == 7) {
                        rtnColorCode = colorCode;
                    }

                    return rtnColorCode;
                };
                $scope.goStyleCateLink = function(link, tclick){
                    var url = link.indexOf('?')>-1 ? link+'&' : link+'?';
                    url += $scope.baseParam + '&tclick=' + tclick;
                    location.href = url;
                };
                
                
                /*
                 * 영상 관련 누락 함수 추가 ( likearts )
                 * 20170703 
                 */        		
                var NORMAL_BASE_TCLICK = "m_DC_menu_5550633_",
                    NORMAL_BASE_TCLICK2 = "tclick=" + NORMAL_BASE_TCLICK;

                // 동영상 재생 TCLICK 처리
                $scope.movPlayTclick = function(){
                    var tclick = NORMAL_BASE_TCLICK + "Clk_Video_play";
                    $scope.sendTclick(tclick);
                }
                
                // 동영상 일시정지 TCLICK 처리
                $scope.movStopTclick = function(){
                    var tclick = NORMAL_BASE_TCLICK + "Clk_Video_pause";
                    $scope.sendTclick(tclick);
                }
                
                // 동영상 상세보기 링크
                $scope.movProdLink = function(goodsNo, tlick_b){
                    var link = '',
                        tclick = tlick_b;
                        
                    link =  LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + goodsNo; 
                    $scope.linkUrl(link, false, tclick);
                }
                	
                // TCLICK 처리
				$scope.processTclick = function(url, obj){
					var path = $scope.baseLink(url);
					path = path + "&" + NORMAL_BASE_TCLICK2;
					if(obj && obj.prefix != undefined){
						path = path + obj.prefix;
					}
					if(obj && obj.useIndex === true && obj.index != undefined){
						path = path + "_idx" + ((obj.index < 10) ? "0"+obj.index : obj.index);
					}
					if(obj && obj.useSex === true){
						if($scope.rScope.loginInfo && $scope.rScope.loginInfo.login){
							if($scope.rScope.loginInfo.genSctCd == "M" || $scope.rScope.loginInfo.genSctCd == "F"){
								path = path + "_sort_" + $scope.rScope.loginInfo.genSctCd;
							}else{
								path = path + "_sort_H";
							}
						}else{
							path = path + "_sort_H";
						}
					}
					if(obj && obj.useAge === true && $scope.rScope.loginInfo && $scope.ageRange){
						path = path + "_" + $scope.ageRange;
					}
					if(obj && obj.useDevice === true){
						if($scope.rScope.appObj.isIOS){
							path = path + "_ios";
						}else if($scope.rScope.appObj.isAndroid){
							path = path + "_and";
						}else if($scope.rScope.appObj.isSktApp){
							path = path + "_tlotte";
						}
					}
					location.href = path;
				}
                /* END :: 영상 관련 누락 함수 추가 */
                
                $scope.goStyleShop = function (item, tclick) { // 운영 링크 경로가 있을 경우 운영 링크로 없을 경우 상품페이지로
                    if (item.sold_out) {
                        return false;
                    }
                    
                    if (item.link_url && (item.link_url + "").length > 3) { // 코너 입력 링크로 이동
                        $scope.linkUrl(validateURL(item.link_url), false, tclick);
                    } else if (item.goods_no) { // 상품으로 이동
                        var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=46"; // + $scope.pageUI.curDispNoSctCd;
                        $window.location.href = url + (tclick ? "&tclick=" + tclick : "");
                    }
                };  
                
                $scope.themeGoLink = function(item, tclick_b){
                    var url = $scope.baseLink(item.link_url);
                    var tclick = tclick_b;          
                    location.href = url + (tclick ? "&tclick=" + tclick : "");
                }
                
                $scope.dBrandShopGo = function (items, tclick, index) { // 운영 링크 경로가 있을 경우 운영 링크로 없을 경우 상품페이지로
                    if(index!=null){
                        index = index + 1;
                        if(index < 10){
                            tclick = tclick + "0" + index;
                        }else{
                            tclick = tclick + index;
                        }
                    }
                    
                    if(items.link_url != null){
                        window.location.href = items.link_url + (tclick ? "&tclick=" + tclick : "");    
                    } else if (item.goods_no) { // 상품으로 이동
                        var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNo=" + $scope.pageUI.curDispNo + "&curDispNoSctCd=46"; // + $scope.pageUI.curDispNoSctCd;
                        $window.location.href = url + (tclick ? "&tclick=" + tclick : "");
                    }
                };
            }
        }
    }]);
    
    // 스토리샵 탭 Controller
    app.controller('tpmlStoryshopCtrl', ['$scope', '$http', 'LotteCommon',  function ($scope, $http, LotteCommon) {
        $scope.ajaxLoadFlag = false;
        $scope.tpmlData = {
            uiOpt: {
                dispNo: "5544340"
            },
            contData: {}
        };

        // Data Load
        $scope.loadData = function () {
            if ($scope.ajaxLoadFlag)
                return false;

            $scope.ajaxLoadFlag = true;

            var httpConfig = {
                method: "get",
                url: LotteCommon.mainContentData + (LotteCommon.isTestFlag ? "." + $scope.tpmlData.uiOpt.dispNo : "") ,
                params: {
                    dispNo: $scope.tpmlData.uiOpt.dispNo,
                    preview : $scope.previewDate
                }
            };

            $http(httpConfig) // 실제 탭 데이터 호출
            .success(function (data) {
                $scope.tpmlData.contData = data.main_contents;
            })
            .finally(function () {
                $scope.ajaxLoadFlag = false;
                $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] = $scope.tpmlData; // Stored Data 저장
            });
        };

        // Stored Data Check
        if ($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo] &&
            Object.getOwnPropertyNames($scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo]).length) {
            $scope.tpmlData = $scope.pageUI.storedData[$scope.tpmlData.uiOpt.dispNo];
        } else {
            $scope.loadData();
        }
    }]);

    // 스토리샵 탭 Directive
    app.directive('tpmlStoryshop', [function () {
        return {
            restrict: 'A', // attribute
            controller: "tpmlStoryshopCtrl",
            link : function ($scope, element, attrs) {
                //20160419
                //카테고리 탭 
                $scope.stSelectId = 0;
                $scope.stSelectIndex = 0;
                $scope.stCateLink = function(id, index){
                    $scope.stSelectId = id;  //카테고리 고유번
                    $scope.stSelectIndex = index; //순서
                    $scope.sendTclick("m_DC_menu_5544340_Clk_Btn_0" + (index + 1));
                }
                
                $scope.brReplace = function(str){
                    return str.replace("&lt;br&gt;", "<br>");
                }
                //스토리샵 링크 
                $scope.storyLink = function(item, tclickstr, id, count){
                    var url = item.img_link;
                    var outlinkFlag = item.mov_frme_cd;
                    var addParams = {
                        ss_yn: 'Y',
                        stcate : item.category_nm,
                        stnm : item.banner_nm.replace("&lt;br&gt;", ""),
                        stdt : item.date,
                        stno : item.category_no
                    };
                    var tclick = tclickstr;
                    if(id != null){
                        var index = $(id).index() + 1;
                        if(count == 1){
                            index += $("#fbanner > li").length;
                        }                        
                        if(index < 10){
                            tclick += "0" + index;
                        }else{
                            tclick += index;
                        }                        
                    }
                    //linkUrl(tpmlData.contData.stsp_banner_top.items[0].img_link, tpmlData.contData.stsp_banner_top.items[0].mov_frme_cd, 'm_menu_5544340_banner1', {ss_yn: 'Y'})                    
                    $scope.linkUrl(url, outlinkFlag, tclick, addParams);
                }
            }
        }
    }]);

    // 동영상 주소 - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
    app.directive('videoSource', ['$timeout', function ($timeout) {
        return {
            restrict: 'A', // attribute
            link : function ($scope, element, attrs) {
                if (attrs.videoSource) {
                    angular.element(element).attr("src", attrs.videoSource);
                }else{
                    // 생생샵 동영상 video-src 데이터 호출이 늦음으로 인한 분기 처리(생생샵 삭제 처리시 같이 제거 필요)
                    $timeout(function () {
                        if (attrs.videoSource) {
                            angular.element(element).attr("src", attrs.videoSource);
                        }
                    }, 4500);
                }
                $scope.vSource = function(vod){
                    if (attrs.videoSource) {
                        angular.element(element).attr("src", attrs.videoSource);
                        if(vod) angular.element(element).parent().attr("src", attrs.videoSource);
                    }else{
                    // 생생샵 동영상 video-src 데이터 호출이 늦음으로 인한 분기 처리(생생샵 삭제 처리시 같이 제거 필요)
                    $timeout(function () {
                        if (attrs.videoSource) {
                            angular.element(element).attr("src", attrs.videoSource);
                            if(vod) angular.element(element).parent().attr("src", attrs.videoSource);
                        }
                    }, 4500);
                }

                }
            }
        };
    }]);

    // 동영상 포스트컷(스냅샷) - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
    app.directive('videoPoster', [function () {
        return {
            restrict: 'A', // attribute
            link : function ($scope, element, attrs) {
                if (attrs.videoPoster) {
                    angular.element(element).attr("poster", attrs.videoPoster);
                }
                $scope.vPoster = function(){
                    angular.element(element).attr("poster", attrs.videoPoster);
                }
            }
        };
    }]);

    
    app.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);

    app.filter('qrpage', function() {
        return function(input) {
            return parseInt(input/2);
        }
    });

    app.filter('startFrom', function() {
        return function(input, start) {
            if(input) {
                start = +start; //parse to int
                return input.slice(start);
            }
            return [];
        }
    });

})(window, window.angular);
