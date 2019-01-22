(function(window, angular, undefined) {
	'use strict';

	var app = angular.module('app', [
		'lotteComm',
		'lotteSrh',
		'lotteSideCtg',
		// 'lotteSideMylotte',
		'lotteCommFooter',
		'lotteSns',
		'lotteProduct',
		'lotteNgSwipe',
		'lotteMainPop'
	]);


	/**
	 * @ngdoc object
	 * @name Planshop.controller:PlanshopCtrl
	 * @requires
	 * $scope, $http, $window, $timeout, $sce, $location, LotteCommon, LotteStorage, commInitData
	 * @description
	 * 기획전 컨트롤러
	 */
	app.controller('EventPlanshopCtrl', ['$scope', '$http', '$window', '$timeout', '$sce', '$location', 'LotteCommon', 'LotteStorage', 'commInitData', 'LotteLink',
		function ($scope, $http, $window,$timeout,$sce, $location, LotteCommon, LotteStorage, commInitData, LotteLink) {
        $scope.ct_ver = "20170517";
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "이벤트";
        $scope.screenID = "event";

		$scope.isShowThisSns = true; /*공유버튼*/
		$scope.isProductLoading = true;
		$scope.planShopSns = true ; //  2017.02.17 planshop 일시 공유버튼 값 변경
		$scope.productMoreScroll = true;
		$scope.isLoading = true;
		$scope.dataLoadingFinish = false;
		$scope.allProductOpenFlag = false; /* 기획전 상품 Sort Category */
		$scope.cateViewFlag = false; /* 상당 카테고리 종류 */
		$scope.allProductFlag = true;
		$scope.upplanshopMainData = [];
		$scope.itemCateDataList = [];
		$scope.sortCateTop; //구분자 위치

        $scope.bottomBannerClick = function() {
			var tClickCode = $scope.tClickBase+ $scope.screenID+"_Clk_Prd_Clk_Ban_1";
        	$window.location.href = LotteCommon.baseUrl + $scope.bottomDate.lnk_url_addr + "&tclick=" + tClickCode;
        }

        $scope.benefitBnrClick = function() {
			var tClickCode = $scope.tClickBase+ $scope.screenID+"_Clk_Prd_Clk_Ban_1";
        	$window.location.href = LotteCommon.baseUrl + $scope.benefitBnr.linkUrl + "&tclick=" + tClickCode;
        }
		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.getParameterByName
		 * @description
		 * 파라메터 값 가져오기
		 * @example
		 * getParameterByName(name)
		 */
		function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

		$scope.dispNoParam = getParameterByName('spdp_no');
		if (getParameterByName('divObjNo') == ""){
			$scope.divObjNoParam = "";
		} else {
			$scope.divObjNoParam = getParameterByName('divObjNo');
		}


		$scope.paramTitle = getParameterByName('divObjTitle'); // 메인에서 가져오는 더보기 값
		$scope.divItemParam = getParameterByName('divItem');

		$scope.productList = [];
		$scope.pageSize = 60;
		$scope.product_tot_cnt= 0;
		$scope.thisPage = 0;
		$scope.divName = "전체상품";

		if($scope.paramTitle.length >= 1){
			$scope.divName = $scope.paramTitle;
		}


        //20160823 앱푸쉬배너 ==================
		function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
			return num < 10 ? "0" + num : num + "";
		}
		function getTime(Year, Month, Day, Hour, Min, Sec) { // Timestemp 구하기
			var date = new Date(Year, Month, Day, Hour, Min, Sec);
			if (Year && Month && Day) {
				date.setFullYear(Year);
				date.setMonth(Month - 1);
				date.setDate(Day);
				if (Hour) {	date.setHours(Hour);}
				if (Min) {date.setMinutes(Min);}
				if (Sec) {date.setSeconds(Sec);}
			}
			return date.getTime();
		}
		function strToTime(str) {
			var rtnTime = 0;
			rtnTime = getTime(
				str.substring(0, 4), // 년
				str.substring(4, 6) ? str.substring(4, 6) : 1, // 월
				str.substring(6, 8) ? str.substring(6, 8) : 1, // 일
				str.substring(8, 10), // 시간
				str.substring(10, 12), // 분
				str.substring(12, 14)); // 초
			return rtnTime;
		}
		var todayDateTime = new Date(),
			todayDate = todayDateTime.getFullYear() + getAddZero(todayDateTime.getMonth() + 1) + getAddZero(todayDateTime.getDate()), // 년월일
			todayTime = todayDateTime.getTime(); // TimeStemp
		if (commInitData.query["testDate"]) { // 날짜 설정으로 운영되는 요소에 대한 테스트 코드
			var testDateStr = commInitData.query["testDate"];
			todayDate = commInitData.query["testDate"]; // 년월일
			todayTime = strToTime(todayDate); // 20160616 앱전용/제휴채널팝업 데이터화로 인한 수정
		}

        /* 20180914 날짜 수정 10월
				$scope.appPushFlag = false;
        if(todayTime >= getTime(2018, 10, 1)){
            $scope.appPushFlag = true;
        }*/
				/* 앱푸시 배너 날짜 수정 10월 */
				if(todayTime >= getTime(2018, 10, 1)){
						$scope.appPushFlag = '10';
				}
				/* 앱푸시 배너 날짜 수정 11월 */
				 if(todayTime >= getTime(2018, 11, 1)){
						 $scope.appPushFlag = '11';
				 }
				 /* 앱푸시 배너 비노출 */
				 if(todayTime >= getTime(2018, 11, 5)){
						 $scope.appPushFlag = '';
				 }
        //20180622 only 7월1일 이미지 노출
       /* if( $scope.appPushFlag && todayTime == getTime(2018, 7, 1)){
            $scope.monthFirst = true;
        }  */

        $scope.param_cn = getParameterByName('cn');

    /* Event2 , Event3 얼럿내용 수정 20180828 */
        $scope.goApppush_Event2 = function(){
            setTimeout(function(){
                // 간편회원 확인
                if(getCookie('MBRSCTCD') == "pnhZkYs9a5U="){
                     alert("간편계정 회원의 경우 응모가 불가합니다.\nL.POINT 통합회원 가입 후 신청해주세요.");
                }else{
                    if($scope.loginInfo.isLogin){
                        $.ajax({
                                type: 'post',
                                async: false,
                                url: "/event/regAppPush.do",
                                data: {evt_no: ''},
                                success: function(data) {
                                       if(data.indexOf("|")>-1){
                                        var data_arr = data.split("|");
                                        var evtEntryCnt = data_arr[1];
                                        if(data_arr[0]=="S"){
                                        	if(todayTime >= getTime(2018, 11, 1) && todayTime < getTime(2018, 11, 5)){
												 alert("금주 ["+evtEntryCnt+"]회 L-point 10점 적립 응모 완료! 7회 응모시 총 100점(차주 화요일 지급)\n11월 4일 이벤트 종료!\ncoming soon!!");
											}else{
												 alert("금주 ["+evtEntryCnt+"]회 L-point 10점 적립 응모 완료! 7회 응모시 총 100점(차주 화요일 지급)\n11월 4일 이벤트 종료!\ncoming soon!!");
											}
                                        	return;
                                        }else if(data_arr[0]=="D"){
                                            alert("오늘은 이미 적립하셨네요.\n금주 ["+evtEntryCnt+"]회 적립 응모 완료");
                                            return;
                                        }
                                    }
                                    if(data=="F"){
                                        /*alert("이벤트 기간이 아닙니다.");*/
                                        /*return;*/
                                    }
                                }
                        });
                    }else{
                         if(confirm('로그인 후 적립하실 수 있습니다.')){
                            var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
                            location.href = '/login/m/loginForm.do?' + targUrl;
                         }
                    }
                }
            }, 500);
        }
        $scope.goApppush_Event3 = function(){
            setTimeout(function(){
                // 간편회원 확인
                if(getCookie('MBRSCTCD') == "pnhZkYs9a5U="){
                     alert("간편계정 회원의 경우 응모가 불가합니다.\nL.POINT 통합회원 가입 후 신청해주세요.");
                }else{
                    if($scope.loginInfo.isLogin){
                        $.ajax({
                                type: 'post',
                                async: false,
                                url: "/event/regAppPush.do",
                                data: {evt_no: ''},
                                success: function(data) {
                                	if(data.indexOf("|")>-1){
                                        var data_arr = data.split("|");
                                        var evtEntryCnt = data_arr[1];
                                        if(data_arr[0]=="S"){
											if(todayTime >= getTime(2018, 10, 1) && todayTime < getTime(2018, 10, 8)){
												alert("금주 ["+evtEntryCnt+"]회 L-point 10점 적립 응모 완료! 7회 응모시 총 100점(차주 월요일 지급)\nL-point 1만점 추가찬스(11월 발표)");
											}else if(todayTime >= getTime(2018, 10, 8) && todayTime < getTime(2018, 10, 22)){
												alert("금주 ["+evtEntryCnt+"]회 L-point 10점 적립 응모 완료! 7회 응모시 총 100점(차주 화요일 지급)\nL-point 1만점 추가찬스(11월 발표)");
											}else if(todayTime >= getTime(2018, 10, 22) && todayTime < getTime(2018, 10, 29)){
												alert("금주 ["+evtEntryCnt+"]회 L-point 10점 적립 응모 완료! 7회 응모시 총 100점(차주 목요일 지급)\nL-point 1만점 추가찬스(11월 발표)");
											}else{
												alert("금주 ["+evtEntryCnt+"]회 L-point 10점 적립 응모 완료! 7회 응모시 총 100점(차주 화요일 지급)\nL-point 1만점 추가찬스(11월 발표)");
											}
											return;
										}else if(data_arr[0]=="D"){
											alert("오늘은 이미 적립하셨네요. 내일 또 만나요^^\n금주 ["+evtEntryCnt+"]회 적립 응모 완료");
											return;
										}
									}
                                     if(data=="F"){
                                         /*alert("이벤트 기간이 아닙니다.");*/
                                         /*return;*/
                                     }
                                 }
                         });
                    }else{
                         if(confirm('로그인 후 적립하실 수 있습니다.')){
                            var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
                            location.href = '/login/m/loginForm.do?' + targUrl;
                         }
                    }
                }
            }, 500);
        }
         //20160823 앱푸쉬배너 ==================




		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.loadedListTemplate
		 * @description
		 * 데이터 로딩 상태 확인
		 * @example
		 * $scope.loadedListTemplate()
		 */
		$scope.loadedListTemplate = function(type) {
			$timeout(function() {
				$scope.$apply(function() {
					$scope.templateType = type;
					$timeout(function() {
						$scope.dataLoadingFinish = true;
					});
				});
			});
		}


		// ?표를 제외한 URL 파라메타를 Object 형태로 리턴
		function objToURLParams(paramStr) {
			var paramsObj = {};

			paramStr = paramStr + "";

			if (paramStr) {
				var parts = paramStr.split('&'),
					i = 0;

				for (i; i < parts.length; i++) {
					var nv = parts[i].split('=');
					if (!nv[0]) continue;
					paramsObj[nv[0]] = nv[1] || null;
				}
			}

			return paramsObj;
		}

		// URL에 Base Parameter를 치환하여 붙여준다.
		function changeBaseParam(url) {
			var rtnUrl = url + "";

			if (rtnUrl.indexOf("javascript") == -1) {
				var urlArr = rtnUrl.split("?");

				if (urlArr[1]) {
					var paramObj = objToURLParams(urlArr[1]),
						paramStrArr = [],
						baseParamArr = [],
						baseParamObj = {},
						i = 0;

					baseParamArr = ($scope.baseParam + "").split("&");

					for (i; i < baseParamArr.length; i++) {
						var tmpArr = (baseParamArr[i] + "").split("=");

						baseParamObj[tmpArr[0]] = tmpArr[1] ? tmpArr[1] : "";
					}

					paramObj = angular.extend(paramObj, baseParamObj);

					for (var key in paramObj) {
						paramStrArr.push(key + "=" + paramObj[key]);
					}

					rtnUrl = urlArr[0] + "?" + paramStrArr.join("&");
				}
			}

			return rtnUrl;
		}

		function getChangeHref(str) {
			if (str.indexOf("javascript") < 0 && str.indexOf("tel:") < 0 && str.indexOf("mailto:") < 0) {
				if (str.indexOf("?") > -1) {
					str = str + "&" + $scope.baseParam;
				} else {
					str = str + "?" + $scope.baseParam;
				}
			}
			return str;
		}
        //스와이프 화면에서 스와이프 할때마다 호출 20170309
        $scope.firstcate_flag = false;
        $scope.swipefnc = function(){
            setTimeout(function(){
                $scope.$apply(function(){
                    var swip_id = parseInt($("#swipe_indi").attr("val"));
                    var firstitem = $scope.findfirstCate($scope.productList[0].divObjNo);
                    if(swip_id == 0){
                        $scope.cate_first = firstitem.divObjNm;
                        $scope.cate_count = firstitem.goodsCnt;
                    }else{
                        var obj = angular.element(".prod_list_03 > li").eq(swip_id);
                        $scope.cate_first = obj.attr("item_nm");
                        $scope.cate_count = obj.attr("item_cnt");
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
            if($scope.cate_first == $scope.itemCateDataList[1].divObjNm){
                $scope.firstcate_flag = false;
            }else{
                $scope.firstcate_flag = true;
            }

        }
		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.getProductDataLoad
		 * @description
		 * 기획전 데이터 가져오기
		 * @example
		 * $scope.getProductDataLoad()
		 */
		// Data Load
		$scope.getProductDataLoad = function() {
			$scope.thisPage++;
			$scope.productListLoading = true;
            //console.log("load : ", $scope.thisPage);
			try{
				$http.get(LotteCommon.planshopData +
						"?spdpNo=" + $scope.dispNoParam +
                        "&divObjNo=" + $scope.divObjNoParam
				)
				.success(function(data) {
                    $scope.share_img = data.max.autoProductEntity.img_url_550; //  2017.02.17 공유하기 대표이미지
					if(data.max.resultCode == '0000'){
						// 총 상품 카운트 (for 페이징)
						$scope.page_end = parseInt(data.max.page_end);
						$scope.product_tot_cnt= data.max.productCount;
						var arrGoodsNo = [];

						if($scope.thisPage == '1'){
							// maxItemData
							$scope.maxitemData = data.max.productCount;
							// Top Category Data
							if(data.max.linkSpdpList == null) {
								$scope.categoryData = [];
								$scope.categoryData.total_count = '0';
							} else {
								$scope.categoryData = data.max.linkSpdpList;
							}
							// story shop category
							if(data.max.stsLst == null){
								$scope.stroyShopData = [];
							} else {
								$scope.stroyShopData = data.max.stsLst.items;
							}
							// ITEM CATEGORY(MID)
							if(data.max.ctgList == null) {
								$scope.itemCateData = [];
								$scope.itemCateDataList = [];
							} else {
								if(data.max.ctgList.items == null){
									$scope.itemCateData = [];
									$scope.itemCateDataList = [];
								} else {
									$scope.itemCateData = data.max.ctgList;
									$scope.itemCateDataList = data.max.ctgList.items;
								}
							}
							$scope.subTitle = data.max.spdp_nm; //서브헤더 타이틀
							// Planshop Number
							$scope.planshopNumber = data.max.spdpNo;

							// Top 배너 영역 baseparam 수정
                            /*
							var $topHtmlDom = angular.element(data.max.topHtml),
								i = 0;

							for (i; i < $topHtmlDom.length; i++) {
								 var $entry = angular.element($topHtmlDom[i]),
								 	hrefStr = $entry.attr("href");

								if ($entry.is("a")) {
									$entry.attr("href", getChangeHref(hrefStr));
								}

								$entry.find("a").each(function (idx, entry) {
									var $subEntry = angular.element(entry),
										subHrefStr = $subEntry.attr("href");

									$subEntry.attr("href", getChangeHref(subHrefStr));
								});
							}

							var topHtmlStr = "";

							$topHtmlDom.each(function (index, entry) {
								if (entry.nodeName == "#text") {
									topHtmlStr += $(entry)[0].textContent;
								} else {
									topHtmlStr += $(entry).prop("outerHTML");
								}
							});

							$scope.topHtml = topHtmlStr;

							if($scope.topHtml.indexOf("null")==0){ $scope.topHtml=""; }
                            */
                            $scope.topHtml = data.max.topHtml;//$sce.trustAsHtml(data.max.topHtml);
							// TOP 카드 배너
							if(data.max.benefitBnr == null || data.max.benefitBnr == ""){
								$scope.benefitData = "";
							} else {
								$scope.benefitData = data.max.benefitBnr;
							}
							// 상품 자동완성
							if(data.max.auto_pfcn_yn == ''){
								if(data.max.spdp_tp_cd == '10') {
									$scope.autoBanner = 'Y';
								} else {
									$scope.autoBanner = 'N';
								}
							} else {
								$scope.autoBanner = data.max.auto_pfcn_yn;
							}
							$scope.autoBannerData = data.max.autoProductEntity;
							// Main Banner img
							if(data.max.mo_spdp_bnr_img == null) {
								$scope.bannerImgData = "";
							} else {
								$scope.bannerImgData = data.max.mo_spdp_bnr_img;
							}
							// Main Banner name
							$scope.bannerNameData = data.max.spdp_nm;
							// planshop kind
							if(data.max.spdp_tp_cd != '11' && data.max.spdp_tp_cd != '24'){
								if($scope.storyParam == 'Y'){
									$scope.planKindData = 'SS';
								} else if(data.max.superChaceSpdpTpCd == 'superchance'){
									$scope.planKindData = 'superchance';
								} else {
									$scope.planKindData = '10';
								}
							} else {
								$scope.planKindData = data.max.spdp_tp_cd;
							}
							// upplanshopMainData Data
							if(data.max.topConr == null) {
								$scope.upplanshopMainData = '0';
							} else {
								if(data.max.topConr.items.length == '0') {
									$scope.upplanshopMainData = '0';
								} else {
									$scope.upplanshopMainData = data.max.topConr;
								}
							}

							if(data.max.topConr == null) {
								$scope.promotionData = '0';
							} else {
								$scope.promotionData = data.max.topConr.promotion;
							}
							// Last Product Data
							$scope.lastProData =data.max.recentPrdLst;
							//20160503
							$scope.prv_banner_list = data.max.prv_banner_list;

							// 20160125 템플릿 타입 기억
							switch($scope.templateType){
							case "image":
								$scope.loadedListTemplate("image");
								break;
							case "list":
								$scope.loadedListTemplate("list");
								break;
							case "swipe":
								$scope.loadedListTemplate("swipe");
								break;
							default:
								// 상품전시영역 작은박스형 10/리스트형 20/스와이프형 30
								if(data.max.mbl_goods_disp_lst_tp_cd == null) {
									$scope.loadedListTemplate("image");
								} else {
									if(data.max.mbl_goods_disp_lst_tp_cd == '10') {
										$scope.loadedListTemplate("image");
									} else if(data.max.mbl_goods_disp_lst_tp_cd == '20') {
										$scope.loadedListTemplate("list");
									} else if(data.max.mbl_goods_disp_lst_tp_cd == '30') {
										$scope.loadedListTemplate("swipe");
									} else {
										$scope.loadedListTemplate("image");
									}
								}
							}

							// product list Data
							if(data.max.prdLst == null){
								$scope.productList = [];
							} else {
                                //20170309 카테고리 구분용 데이타 가공
                                var tmpList = [];
                                var pitem = data.max.prdLst.items[0];
                                $scope.cid = 1;
                                /*
                                if(pitem.divObjNo){
                                    tmpList.push({
                                        cateflag : true,
                                        divObjNm : pitem.divObjNm,
                                        count : $scope.itemCateDataList[$scope.cid].goodsCnt
                                    });
                                }
                                */
                                //console.log("----------------3 ");
                                $scope.cate_first = pitem.divObjNm;
                                $scope.cate_count = $scope.itemCateDataList[$scope.cid].goodsCnt;
                                checkfirst_color();
                                var cnt = $scope.cate_count;
                                for(var i=0; i<data.max.prdLst.items.length;i++){
                                    pitem = data.max.prdLst.items[i];
                                    if(arrGoodsNo.length < 3)	arrGoodsNo.push(pitem.goods_no + '' || '');
                                    if(pitem.divObjNo && i > 0){
                                        if(pitem.divObjNo != data.max.prdLst.items[i - 1].divObjNo){
                                            $scope.cid ++;
                                            if($scope.itemCateDataList[$scope.cid].goodsCnt){
                                                cnt = $scope.itemCateDataList[$scope.cid].goodsCnt;
                                            }

                                            tmpList.push({
                                                cateflag : true,
                                                divObjNm : pitem.divObjNm,
                                                count : cnt,
                                                id : $scope.cid
                                            });
                                            //$scope.itemCateDataList[$scope.cid].pos_y = $scope.cid * 35;
                                        }
                                    }
                                    pitem.cnt = cnt;
                                    //console.log("cnt", cnt);
                                    tmpList.push(pitem);
                                }
                                $scope.productList = tmpList;
								//$scope.productList = data.max.prdLst.items;
							}

							if($scope.product_tot_cnt < $scope.thisPage * $scope.pageSize) {
								$scope.productMoreScroll = false;
							} else {
								$scope.productMoreScroll = true;
							}
							$scope.productListLoading = false;
						} else {
                            //console.log('num : ' + $scope.product_tot_cnt * $scope.pageSize)
							// product list Data
                            var cnt = 0;
                            if($scope.productList[$scope.productList.length - 1]){
                                cnt = $scope.productList[$scope.productList.length - 1].cnt;
                            }
							angular.forEach(data.max.prdLst.items, function(val, key) {
                                //20170309 카테고리 구분용 데이타 가공
                                if(val.divObjNo && $scope.productList.length > 0 && $scope.productList[$scope.productList.length - 1].divObjNo){
                                    if(val.divObjNo != $scope.productList[$scope.productList.length - 1].divObjNo &&
                                      ($scope.cid < $scope.itemCateDataList.length - 1) ){
                                        $scope.cid ++;
                                        if($scope.itemCateDataList[$scope.cid].goodsCnt){
                                            cnt = $scope.itemCateDataList[$scope.cid].goodsCnt;
                                        }
                                        $scope.productList.push({
                                            cateflag : true,
                                            divObjNm : val.divObjNm,
                                            count : cnt,
                                            id : $scope.cid
                                        });
                                        //$scope.itemCateDataList[$scope.cid].pos_y = $scope.cid * 35;
                                    }
                                }
                                val.cnt = cnt;
								$scope.productList.push(val);
							});
							if($scope.product_tot_cnt < $scope.thisPage * $scope.pageSize) {
								$scope.productMoreScroll = false;
							} else {
								$scope.productMoreScroll = true;
							}
							$scope.productListLoading = false;

						}
						$scope.productListLoading = false;
					} else {/*종료된 기획전 or 잘못된 기획전 번호*/
						$scope.contents = {};
						$scope.subTitle = "기획전";
						$scope.noData = true; /*not found template 출력*/
						$scope.productListLoading = false;
					}
					$scope.isLoading = false;


				})
				.error(function(data, status, headers, config){
					console.log('Error Data : ', status, headers, config);
				});
			} catch(e) {
				$scope.contents = {};
				$scope.subTitle = "기획전";
				$scope.noData = true; /*not found template 출력*/
				$scope.isLoading = false;
				$scope.productListLoading = false;
			}
		}

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.gotoPrepageSide
		 * @description
		 * 이전 페이지 이동
		 * @example
		 * $scope.gotoPrepageSide()
		 */
		// 이전 페이지 이동
		$scope.gotoPrepageSide = function() {
			$scope.sendTclick("m_side_new_pre");
			history.go(-1);
		};

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.moreListClick
		 * @description
		 * 상품 더보기
		 * @example
		 * $scope.moreListClick()
		 */
		// 더보기 클릭
		$timeout(function() {
			$scope.moreListClick = function() {
				$scope.sendTclick($scope.tClickBase + 'Event_Scl_Prd_page' + $scope.divObjNoParam);
				$scope.getProductDataLoad();
			};
		});

		// 20160420 서프라이즈 띠배너클릭
		$scope.surpriseEventBannerClick = function() {
			var tClickCode = "&tclick=" + $scope.tClickBase + 'm_Suprise_Ban01';
			$window.location.href = LotteCommon.baseUrl + $scope.surpriseEventBanner.linkUrl + tClickCode;
		}

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.allProductClick
		 * @description
		 * 하단 구분자 카테고리 Flag
		 * @example
		 * $scope.allProductClick()
		 */
		// 기획전 상품 Sort Category 열기
		$scope.allProductClick = function () {
			$scope.sendTclick($scope.tClickBase + 'Event_Clk_Btn_' + "1");
			$scope.allProductOpenFlag = !$scope.allProductOpenFlag;
		};

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.benefitClick
		 * @description
		 * 상품 설명 내 배너 클릭
		 * @example
		 * $scope.benefitClick()
		 */
		// 배너클릭
		$scope.benefitClick = function() {
			var tClickCode = "&tclick=" + $scope.tClickBase + 'Event_Clk_Btn_' + "1";
			$window.location.href = LotteCommon.baseUrl + $scope.benefitData.linkUrl + tClickCode + '&' + $scope.baseParam;
		}

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.closeProClick
		 * @description
		 * 하단 구분자 카테고리 닫기 버튼
		 * @example
		 * $scope.closeProClick()
		 */
		// 하단 구분자
		$scope.closeProClick = function () {
			$scope.allProductOpenFlag = false;
		};

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
			$scope.sendTclick($scope.tClickBase + 'Event_Clk_Pico_' + tp);
			$scope.firstcate_flag = false;//20170309
            var firstitem = $scope.findfirstCate($scope.productList[0].divObjNo);
            $scope.cate_first = firstitem.divObjNm;
            $scope.cate_count = firstitem.goodsCnt;
            checkfirst_color();
			$scope.templateType = tp;
			//var sess = {};
			//sess.templateType = $scope.templateType;
			LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
			setCookie($scope.screenID+'TemplateType', $scope.templateType);
		};

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.closeCateClick
		 * @description
		 * 상단 카테고리 구분자 닫기
		 * @example
		 * $scope.closeCateClick()
		 */
		// 상단 카테고리 구분자 닫기
		$scope.closeCateClick = function () {
			$scope.cateViewFlag = false;
		};

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.cateViewClick
		 * @description
		 * 상단 카테고리 열기
		 * @example
		 * $scope.cateViewClick()
		 */
		// 상단 카테고리 종류 열기
		//20150503
		$scope.cateViewClick = function () {
			if($scope.storyParam == "Y") {
				$scope.sendTclick('m_DC_Event_Clk_Btn_8');
				if($scope.stroyShopData.total_count == '0'){
					return false;
				} else {
					$scope.cateViewFlag = !$scope.cateViewFlag;
					return false;
				}
			} else {
				$scope.sendTclick($scope.tClickBase + 'Event_Clk_Btn_8');
				if($scope.categoryData.total_count == '0'){
					return false;
				}
			}

			if($scope.planKindData == '10') {
				if($scope.categoryData == '0'){
					$scope.cateViewFlag = false;
					return false;
				}
				$scope.cateViewFlag = false;
				return false;
			} else {
				$scope.cateViewFlag = !$scope.cateViewFlag;
				return false;
			}
		};

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.gotoPrepage
		 * @description
		 * 이전페이지 가기
		 * @example
		 * $scope.gotoPrepage()
		 */
		$scope.gotoPrepage = function() {
			$scope.sendTclick("m_RDC_header_new_pre");
		};


		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.goGoodsDetail
		 * @description
		 * 상품클릭
		 * @example
		 * $scope.goGoodsDetail(item, type, idx)
		 * @param {object} item 템플릿 타입
		 * @param {String} item.limit_age_yn 성인여부
		 * @param {String} item.pmg_byr_age_lmt_cd 나이제한여부
		 * @param {number} item.curDispNo 전시번호
		 * @param {number} item.curDispNoSctCd 전시상세번호
		 * @param {String} type 템플릿 타입 (recent : 최근본상품, norUp : 일반기획전 상단구분자상품, spUp : 슈퍼찬스 상단구분자상품)
		 * @param {number} idx 아이템 인덱스
		 */
		// 상품클릭
		$scope.goGoodsDetail = function(item, type, idx) {
			var idxNo = idx + 1;

			if(item.limit_age_yn == 'Y' || item.pmg_byr_age_lmt_cd == '19') {
				if (scope.$parent.loginInfo.isAdult == "") { /*19금 상품이고 본인인증 안한 경우*/
					alert("이 상품은 본인 인증 후 이용하실 수 있습니다.");
					scope.$parent.goAdultSci();
					return false;
				} else if (!scope.$parent.loginInfo.isAdult) {
					alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
					return false;
				}
			}

			var curDispNo = "";
			if (item.curDispNo) {
				curDispNo = "&curDispNo=" + item.curDispNo;
			}

			var curDispNoSctCd = "";
			if (item.curDispNoSctCd) {
				curDispNoSctCd = "&curDispNoSctCd=" + item.curDispNoSctCd;
			}

			if(type == "recent") {
				var clickType = "_Clk_Prd_1";
			} else if(type == "norUp") {
				var clickType = "_Swp_Prd_A" + idxNo;
			} else if(type == "spUp") {
				var clickType = "_Swp_Prd_" + idxNo;
			}

			var tClickCode = $scope.tClickBase + "Event" + clickType;
			window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + curDispNo + curDispNoSctCd +"&tclick="+tClickCode;
		};

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.sortCateClick
		 * @description
		 * 하단구분자 카테고리 클릭
		 * @example
		 * $scope.sortCateClick(divObjNo, divObjNm, idx)
		 * @param {number} divObjNo 카테고리번호
		 * @param {String} divObjNm 카테고리명
		 * @param {number} idx 카테고리 인덱스
		 */
		//  하단구분자 카테고리 상품 보기 클릭 url 화면 리플레시
		$scope.sortCateClick = function(divObjNo, divObjNm, idx){
			var idxNo = idx + 1;
			$scope.sendTclick($scope.tClickBase + 'Event_ClkW_Rst_A' + idxNo);

			var sess = {};

			// data load
			$scope.dataLoadingFinish = false;
			$scope.divObjNoParam = divObjNo;
			$scope.divName = divObjNm;

            //console.log("$scope.divName", $scope.divName);
			$scope.thisPage = '1';
			$scope.productList = [];

			$scope.isLoading = false;
			$scope.isProductLoading = true;
			$scope.allProductOpenFlag = false; /* 기획전 상품 Sort Category */


			$http.get(LotteCommon.planshopData +
					"?spdpNo=" + $scope.dispNoParam +
                    "&divItem=" + $scope.divItemParam
			)
			.success(function(data) {
				$("#curcatenm").text($scope.divName);
				// 총 상품 카운트 (for 페이징)
				$scope.page_end = parseInt(data.max.page_end);
				$scope.product_tot_cnt= data.max.productCount;
                $scope.cid = 1;
				// product list Data
                var firstitem = $scope.findfirstCate(data.max.prdLst.items[0].divObjNo);
                var cnt = firstitem.goodsCnt;
				angular.forEach(data.max.prdLst.items, function(val, key) {
                    //20170309 카테고리 구분용 데이타 가공
                    if(val.divObjNo && key > 0 && $scope.productList[key - 1].divObjNo){
                        if(val.divObjNo != $scope.productList[$scope.productList.length - 1].divObjNo){
                            $scope.cid ++;
                            if($scope.itemCateDataList[$scope.cid].goodsCnt){
                                cnt = $scope.itemCateDataList[$scope.cid].goodsCnt;
                            }
                            $scope.productList.push({
                                cateflag : true,
                                divObjNm : val.divObjNm,
                                count : cnt,
                                id : $scope.cid
                            });
                            //$scope.itemCateDataList[$scope.cid].pos_y = $scope.cid * 35;
                        }
                    }
                    val.cnt = cnt;
					$scope.productList.push(val);
				});

                $scope.cate_first = firstitem.divObjNm;
                $scope.cate_count = firstitem.goodsCnt;

                checkfirst_color();
				if($scope.product_tot_cnt < $scope.thisPage * $scope.pageSize) {
					$scope.productMoreScroll = false;
				} else {
					$scope.productMoreScroll = true;
				}
				$scope.productListLoading = false;
				$scope.maxitemData = data.max.productCount;

				if($scope.templateType == 'image') {
					$scope.loadedListTemplate("image");
				} else if($scope.templateType == 'list') {
					$scope.loadedListTemplate("list");
				} else if($scope.templateType == 'swipe') {
					$scope.loadedListTemplate("swipe");
				}
				$scope.isProductLoading = true;
                //angular.element($window).scrollTop($scope.sortCateTop + 1); //구분자 위치로 초기화
			})
			.error(function(data, status, headers, config){
				console.log('Error Data : ', status, headers, config);
			});


			$timeout(function() {
			// Data
				 sess.subTitle = $scope.subTitle;
				 sess.allProductOpenFlag = $scope.allProductOpenFlag;
				 sess.cateViewFlag = $scope.cateViewFlag;
				 sess.allProductFlag = $scope.allProductFlag;
				 sess.upplanshopMainData = $scope.upplanshopMainData;
				 sess.itemCateDataList = $scope.itemCateDataList;
				 sess.dispNoParam = $scope.dispNoParam;
				 sess.divObjNoParam = $scope.divObjNoParam;
				 sess.storyParam = $scope.storyParam;
				 sess.productList = $scope.productList;
				 sess.pageSize = $scope.pageSize;
				 sess.product_tot_cnt = $scope.product_tot_cnt;
				 sess.divName = $scope.divName;
				 sess.thisPage = $scope.thisPage;
				 sess.page_end = $scope.page_end;
				 sess.maxitemData = $scope.maxitemData;
				 sess.categoryData = $scope.categoryData;
				 sess.itemCateData = $scope.itemCateData;
				 sess.itemCateDataList = $scope.itemCateDataList;
				 sess.planshopNumber = $scope.planshopNumber;
				 sess.topHtml = $scope.topHtml;
				 sess.autoBanner = $scope.autoBanner;
				 sess.autoBannerData = $scope.autoBannerData;
				 sess.bannerImgData = $scope.bannerImgData;
				 sess.bannerNameData = $scope.bannerNameData;
				 sess.planKindData = $scope.planKindData;
				 sess.promotionData = $scope.promotionData;
				 sess.templateType = $scope.templateType;
				 sess.benefitData = $scope.benefitData;
				if (!commInitData.query.localtest && $scope.leavePageStroage) {
					LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
					LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
					LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
				}
                $("#curcatenm").text($scope.divName);
			}, 2000);
		}

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.goPlanshopClick
		 * @description
		 * 상단구분자 이동
		 * @example
		 * $scope.goPlanshopClick(conts_desc_cont)
		 * @param {number} conts_desc_cont 기획전번호
		 */
		//  상단 기획전간 이동
		$scope.goPlanshopClick = function(conts_desc_cont){
			var tClickCode = $scope.tClickBase+ "Event_ClkW_Rst_B" + $scope.divObjNoParam;
			$window.location.href = LotteCommon.prdlstUrl + "?" + $scope.baseParam + "&curDispNo=" + conts_desc_cont + "&tclick=" + tClickCode;
		}

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.getPlanSwipeSize
		 * @description
		 * 스와이프 사이즈 구해오기
		 * @example
		 * $scope.getPlanSwipeSize()
		 */
		$timeout(function() {
			$scope.getPlanSwipeSize = function() {
				if($scope.itemCateDataList.length) {
					var bNode = parseInt($scope.itemCateDataList.length/5);
					if($scope.itemCateDataList.length%5 != 0) {
						bNode++;
					}
					return new Array(bNode);
				}
				return new Array();
			}
		}, 2000);

		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.getPlanSwipeSize
		 * @description
		 * 스와이프 사이즈 구해오기
		 * @example
		 * $scope.getPlanSwipeSize()
		 */
		$scope.getPlanSwipeSize = function() {
			if($scope.itemCateDataList.length) {
				var bNode = parseInt($scope.itemCateDataList.length/5);
				if($scope.itemCateDataList.length%5 != 0) {
					bNode++;
				}
				return new Array(bNode);
			}
			return new Array();
		}


		/**
		 * @ngdoc function
		 * @name PlanshopCtrl.getStorySwipeSize
		 * @description
		 * 스토리샵 상단 카테고리 스와이프 사이즈 구해오기
		 * @example
		 * $scope.getStorySwipeSize()
		 */
		$timeout(function() {
			$scope.getStorySwipeSize = function() {
				if($scope.stroyShopData.length) {
					return new Array(parseInt($scope.stroyShopData.length/5+0.9));
				}

				return new Array();
			}
		}, 2000);


		// 세션에서 가저오는 영역
		var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
		var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
		var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');
		var StoredTemplateType = getCookie($scope.screenID+'TemplateType');
		$scope.StoredScrollY = StoredScrollY;
        //20170310
        if(StoredLoc == window.location.href && $scope.locationHistoryBack){
			var StoredData = JSON.parse(StoredDataStr);
			$scope.isLoading = false;
			$scope.dataLoadingFinish = false;
			// Data
			$scope.subTitle = StoredData.subTitle;
			$scope.allProductOpenFlag = StoredData.allProductOpenFlag;
			$scope.cateViewFlag = StoredData.cateViewFlag;
			$scope.allProductFlag = StoredData.allProductFlag;
			$scope.upplanshopMainData = StoredData.upplanshopMainData;
			$scope.itemCateDataList = StoredData.itemCateDataList;
			$scope.dispNoParam = StoredData.dispNoParam;
			$scope.divObjNoParam = StoredData.divObjNoParam;
			$scope.planShopGubunParam = StoredData.planShopGubunParam;
			$scope.recentParam = StoredData.recentParam;
			$scope.productList = StoredData.productList;
			$scope.pageSize = StoredData.pageSize;
			$scope.product_tot_cnt = StoredData.product_tot_cnt;
			$scope.divName = StoredData.divName;
			$scope.thisPage = StoredData.thisPage;
			$scope.page_end = StoredData.page_end;
			$scope.maxitemData = StoredData.maxitemData;
			$scope.categoryData = StoredData.categoryData;
			$scope.itemCateData = StoredData.itemCateData;
			$scope.itemCateDataList = StoredData.itemCateDataList;
			$scope.planshopNumber = StoredData.planshopNumber;
			$scope.topHtml = StoredData.topHtml;//	StoredData.topHtml;
			$scope.autoBanner = StoredData.autoBanner;
			$scope.autoBannerData = StoredData.autoBannerData;
			$scope.bannerImgData = StoredData.bannerImgData;
			$scope.bannerNameData = StoredData.bannerNameData;
			$scope.planKindData = StoredData.planKindData;
			$scope.promotionData = StoredData.promotionData;
			$scope.templateType = StoredTemplateType;//StoredData.templateType;
			$scope.benefitData = StoredData.benefitData;

			if($scope.templateType == 'list') {
				$scope.loadedListTemplate("list");
			} else if($scope.templateType == 'swipe') {
				$scope.loadedListTemplate("swipe");
			}else{
				$scope.loadedListTemplate("image");
			}

			if($scope.product_tot_cnt < $scope.thisPage * $scope.pageSize) {
				$scope.productMoreScroll = false;
			} else {
				$scope.productMoreScroll = true;
			}
			//console.log('-------------- productMoreScroll : ' + $scope.productMoreScroll);

			$timeout(function() {
				angular.element($window).scrollTop(StoredScrollY);
                //20170309
                var firstitem = $scope.findfirstCate($scope.productList[0].divObjNo);
                $scope.cate_first = firstitem.divObjNm;
                $scope.cate_count = firstitem.goodsCnt;
                checkfirst_color();
                $("#curcatenm").text($scope.divName);
			},800);

		} else {
            $scope.StoredScrollY = 0;
			$scope.templateType = StoredTemplateType;
			$scope.getProductDataLoad();
		}

		// 세션에 담는 영역
		angular.element($window).on("unload", function(e) {
			$scope.allProductOpenFlag == false;
			$scope.cateViewFlag == false;
			$scope.allProductFlag == false;

			var sess = {};

			// Data
			sess.subTitle = $scope.subTitle;
			sess.allProductOpenFlag = $scope.allProductOpenFlag;
			sess.cateViewFlag = $scope.cateViewFlag;
			sess.allProductFlag = $scope.allProductFlag;
			sess.upplanshopMainData = $scope.upplanshopMainData;
			sess.itemCateDataList = $scope.itemCateDataList;
			sess.dispNoParam = $scope.dispNoParam;
			sess.divObjNoParam = $scope.divObjNoParam;
			sess.planShopGubunParam = $scope.planShopGubunParam;
			sess.recentParam = $scope.recentParam;
			sess.productList = $scope.productList;
			sess.pageSize = $scope.pageSize;
			sess.product_tot_cnt = $scope.product_tot_cnt;
			sess.divName = $scope.divName;
			sess.thisPage = $scope.thisPage;
			sess.page_end = $scope.page_end;
			sess.maxitemData = $scope.maxitemData;
			sess.categoryData = $scope.categoryData;
			sess.itemCateData = $scope.itemCateData;
			sess.itemCateDataList = $scope.itemCateDataList;
			sess.planshopNumber = $scope.planshopNumber;
			sess.topHtml = $scope.topHtml;
			sess.autoBanner = $scope.autoBanner;
			sess.autoBannerData = $scope.autoBannerData;
			sess.bannerImgData = $scope.bannerImgData;
			sess.bannerNameData = $scope.bannerNameData;
			sess.planKindData = $scope.planKindData;
			sess.promotionData = $scope.promotionData;
			sess.templateType = $scope.templateType;
			sess.benefitData = $scope.benefitData;
			if (!commInitData.query.localtest && $scope.leavePageStroage) {
				LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
				LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
				LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
			}
		});

	}]);

	/**
	 * @ngdoc directive
	 * @name Planshop.directive:lotteContainer
	 * @description
	 * 기획전 메인 directive
	 */
    app.directive('lotteContainer', function() {
        return {
            templateUrl : '/lotte/resources_dev/planshop/m/planshop_container.html',
            replace : true,
            link : function($scope, el, attrs) {

            }
        };
    });



	/**
	 * @ngdoc directive
	 * @name Planshop.directive:sortCate
	 * @description
	 * 하단구분자 directive
	 */
	// 하단구분자
	app.directive('sortCate', ['$window','$timeout', '$location', function($window,$timeout,$location) {
		return {
			templateUrl:'/lotte/resources_dev/product/m/product_list_select_container2.html',
			replace:true,
			link:function($scope, el, attrs) {
				var sortCateTop;

				/**
				 * @ngdoc function
				 * @name sortCate.function:sortPosition
				 * @description
				 * 스크롤 시 헤더 이동
				 * @example
				 * $scope.sortPosition();
				 */
                $scope.fixflag = false;
				$scope.sortPosition = function(){
					//var $headerSpace = angular.element('#headerSpace');
					sortCateTop = angular.element(".unitWrap").offset().top - $scope.headerHeight - 54;
                                  //el.offset().top - $scope.headerHeight;

					$scope.$parent.$parent.sortCateTop = sortCateTop;
					//console.log("----", $scope.$parent.$parent.StoredScrollY);
                    angular.element($window).scrollTop($scope.$parent.$parent.StoredScrollY).scroll();
				}
                angular.element($window).on('scroll', function(evt) {
                    if($scope.productList.length > 0){
                        var $headerSpace = angular.element('#headerSpace');
                        sortCateTop = angular.element(".unitWrap").offset().top - $scope.headerHeight - 54;
                        if (this.pageYOffset > sortCateTop){
                            $headerSpace.css('height','37px');
                            el[0].style.cssText = 'position:fixed;top:45px;';
                            $scope.fixflag = true;
                        }else{
                            $headerSpace.css('height','0px');
                            el[0].style.cssText = '';
                            $scope.fixflag = false;
                        }
                        //스크롤시 해당되는 카테고리 검색 0309
                            /*
                            $scope.templateType    list
                            $scope.screenType  1    2    3
                            상품개수            1     2    3
                            $scope.templateType    image
                            $scope.screenType  1    2    3
                            상품개수            2    3    4
                            */
                        //
                        if($scope.templateType != "swipe" && $scope.divObjNoParam == ""){
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
                            for(;i < $scope.productList.length; i++){
                                if($scope.productList[i].cateflag){ //카테고리이면 높이 저장
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
                                if(this.pageYOffset - sortCateTop > harr[i]){
                                    titid = i + 1;
                                }
                            }
                            if(!$scope.fixflag){
                                titid = 0;
                            }
                            //console.log($scope.itemCateDataList[titid].divObjNm, "----", titid, this.pageYOffset - sortCateTop, harr[titid]);
                            if(titid < $scope.itemCateDataList.length){
                                $scope.divName = $scope.itemCateDataList[titid].divObjNm;
                                $("#curcatenm").text($scope.divName);
                            }
                        }

                    }
                });

				$timeout(function(){
                    if($scope.productList.length > 0){
                        var imgLoad = angular.element(".plan_bannerWrap img,.prd_swipe img"); //구분자 위 이미지 로딩
                        if(imgLoad.length != 0){
                            imgLoad.load(function(){
                                $timeout(function(){
                                    $scope.sortPosition();
                                },900);
                            });
                            $timeout(function(){
                                $scope.sortPosition();
                            },900);
                        }else{
                            $timeout(function(){
                                $scope.sortPosition();
                            },900);
                        }

                    }
				},1500);
			}
		};
	}]);

})(window, window.angular);
