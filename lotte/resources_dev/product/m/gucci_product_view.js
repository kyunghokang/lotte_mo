var _rlq = _rlq || []; // 레코벨 수집데이터 push 변수 초기화

(function(window, angular, undefined) {
		'use strict';

		var app = angular.module('app', [
				'lotteComm',
				'lotteSrh',
				'lotteSideCtg',
				// 'lotteSideMylotte',
				'lotteCommFooter',
				'lotteMainPop',
				'lotteSns',
				'ngRoute',
				'lotteUnit',
				'lotteNgSwipe',
				'lotteUtil'
		]);

		app.config(['$routeProvider', function($routeProvider) {
				$routeProvider
				.otherwise({
						templateUrl : '/lotte/resources_dev/product/m/gucci_product_view_container.html',
						controller: 'GucciDetailPage',
						reloadOnSearch : false
				})
		}]);

		app.factory('SharedData',function(){
			var data = {SharedData : undefined};
			return {
				getSharedData : function(){
					return data.SharedData;
				},
				setSharedData : function(data_){
					data.SharedData = data_
				}
			};
		});

		app.service('Fnproductview', function () {
			this.productbtnlayertp = function ($scope) {
				console.log('productbtnlayertp', 'called');
				var rtnVal = "00";
						if ($scope.BasicData.tworld_sell == "N"){ //skt 판매 여부
							rtnVal = "01";
						} else if ($scope.reqParam.goods_no == '19338070'){ //모바일 주문 불가
							rtnVal = "02";
						} else if ($scope.BasicData.product.goods_tp_cd == '30' || $scope.BasicData.product.goods_tp_cd == '40' || $scope.BasicData.m_yn == 'Y'){ //모바일 주문 불가
							rtnVal = "03";
						} else if ($scope.BasicData.product.item_opt_yn == 'Y'){ //모바일 주문 불가
							rtnVal = "04";
						} else if ($scope.BasicData.product.entr_yn == 'Y'){ //모바일 주문 불가
							rtnVal = "05";
						} else if ($scope.BasicData.product.pmg_md_gsgr_no == '1696' && $scope.BasicData.product.org_sale_prc == '10'){ //모바일 주문 불가
							rtnVal = "06";
						} else if ($scope.BasicData.product.sale_stat_cd == '20'){ //품절
							rtnVal = "07";
						} else if ($scope.BasicData.product.sale_stat_cd == '30'){ //품절
							rtnVal = "08";
						} else if ($scope.BasicData.product.smp_only_yn == 'Y' && $scope.BasicData.product.smp_goods_view_yn != 'Y'){ //품절
							rtnVal = "09";
						}
				return rtnVal;
			};
			this.getDeliveryInfo = function($scope){
				var rtnVal = "";

				if($scope.BasicData.product.entr_no =='13145'){
					rtnVal = "홈쇼핑상품";
				} else if($scope.BasicData.product.reserve_start !=''){
					rtnVal = "예약상품";
				} else if($scope.BasicData.product.dlv_goods_sct_cd =='02' || $scope.BasicData.product.dlv_goods_sct_cd =='04'){
					rtnVal = "설치상품";
				} else if($scope.BasicData.product.dlv_goods_sct_cd =='03'){
					rtnVal = "주문제작상품";
				} else if($scope.BasicData.product.dlv_goods_sct_cd =='05'){
					rtnVal = "e쿠폰상품";
				} else {
					rtnVal = "일반상품";
				}
				if (rtnVal != ''){
					rtnVal += "/ " + $scope.BasicData.product.delivery_info;
				}
				return rtnVal;
			};

			//구찌 상품정보 list로 변환(yubu)
			this.makeListCode = function(str, searchStr) {
				var strArr = str.split(searchStr),
					  returnHtml = "<ul>";

				angular.forEach(strArr, function(list, key){
					returnHtml += "<li>" + list + "</li>";
				});

				returnHtml += "</ul>"

				return returnHtml;
			};

			this.replaceAll = function (str, searchStr, replaceStr) {
					return str.split(searchStr).join(replaceStr);
			};
			this.isEmpty = function (str) {
				var rtnVal = true;
						if (str != undefined && str != null && str != "" && str != 'null'){
							rtnVal = false;
						}
						return rtnVal;
			};
			this.getNumberFormat = function(num) { /* 숫자 콤마찍기*/
				var pattern = /(-?[0-9]+)([0-9]{3})/;
				while (pattern.test(num)) { num = (num + "").replace(pattern, "$1,$2"); }
				return num;
			};
			this.toNumber = function(num) { /* 문자->숫자*/
				if (num == undefined || num == null || num == '' ||  num == 'null'){
					return 0;
				} else {
					var strNum = this.objectToString(num);
					try{
						if (strNum.indexOf(',') >= 0){
							Number(this.replaceAll(strNum,',',''));
						} else {
							return Number(strNum);
						}
					} catch(e){
						console.log("toNumber Error ==> " + strNum);
					}
				}
			};
			this.objectToString = function(obj) {
				return obj == undefined ? "" : obj.toString();
			};
			this.goUrl = function($window,$scope,url,tclick) {
				if (tclick != null){
				var tclickcd = this.getTclickCd($scope.BasicData.elotte_yn,tclick);
				}

				var fullUrl = "";
				if (url.indexOf("?") >= 0) {
					fullUrl = url + "&" + $scope.baseParam;
				} else {
					fullUrl = url + "?" + $scope.baseParam;
				}
				$window.location.href = fullUrl;
			};
			this.goToLogin = function($window,$scope,url) {
				var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
				if (url.indexOf('?') > 0){
					$window.location.href = url + "&" + $scope.baseParam + targUrl;
				} else {
					$window.location.href = url + "?" + $scope.baseParam + targUrl;
				}
			};
			this.goToLogin2 = function($window,$scope,url) {
				var targUrl = "&targetUrl=" + encodeURIComponent($window.location.href, 'UTF-8');
				if (url.indexOf('?') > 0){
					$window.location.href = url + "&" + $scope.baseParam + "&fromPg=1" + targUrl;
				} else {
					$window.location.href = url + "?" + $scope.baseParam + "&fromPg=1" +targUrl;
				}
			};

			this.toTimeObject = function (time) { /*parseTime(time)*/
					var year  = time.substr(0,4);
					var month = time.substr(4,2) - 1; /* 1월=0,12월=11*/
					var day   = time.substr(6,2);
					var hour  = time.substr(8,2);
					var min   = time.substr(10,2);
					var min   = time.substr(10,2);
					return new Date(year,month,day,hour,min);
			};
			/*==================================================================
			* 두 Time이 몇 시간 차이나는지 구함
			* time1이 time2보다 크면(미래면) minus(-)
			------------------------------------------------------------------*/
			this.getHourInterval =function (time1,time2) {
					var date1 = (time1 == undefined) ? new Date() : this.toTimeObject(time1); //대상시간 From
					var date2 = this.toTimeObject(time2); //대상시간 To
					var hour  = 1000 * 3600; //1시간
					return parseInt((date2 - date1) / hour, 10);
			};
			/*==================================================================
			* 두 Time이 몇 시간/분 차이나는지 구함
			* time1이 time2보다 크면(미래면) minus(-)
			------------------------------------------------------------------*/
			this.getMinuteIntervalStr =function (time1,time2) {
					var date1 = (time1 == undefined) ? new Date() : this.toTimeObject(time1); //대상시간 From
					var date2 = this.toTimeObject(time2); //대상시간 To

					var minute  = parseInt((date2 - date1) / (1000 * 60), 10); //남은분
					// var rtnVal = parseInt((minute / 60)) + "시간 " + (minute % 60) + "분";
					var sHour = parseInt(minute / 60);;
					var sMinute = parseInt(minute % 60);
					if ((minute / 60) < 10){
						sHour = "0" + parseInt(minute / 60);
					}
					if ((minute % 60) < 10){
						sMinute = "0" + parseInt(minute % 60);
					}
					var rtnVal = sHour + "시간 " + sMinute + "분";
					return rtnVal;
			};
			/*==================================================================
			* 자바스크립트 Date 객체를 Time 스트링으로 변환
			* parameter date: JavaScript Date Object, YYYY
			------------------------------------------------------------------*/
			this.toTimeString =function (date,fmt) { /*formatTime(date)*/
					var year  = date.getFullYear();
					var month = date.getMonth() + 1; /* 1월=0,12월=11이므로 1 더함*/
					var day   = date.getDate();
					var hour  = date.getHours();
					var min   = date.getMinutes();
					var sec   = date.getSeconds();

					if (("" + month).length == 1) { month = "0" + month; }
					if (("" + day).length   == 1) { day   = "0" + day;   }
					if (("" + hour).length  == 1) { hour  = "0" + hour;  }
					if (("" + min).length   == 1) { min   = "0" + min;   }
					if (("" + sec).length   == 1) { sec   = "0" + sec;   }
					var rtnVal = "" + year + month + day + hour + min + sec;
					if (fmt != undefined){
						rtnVal = fmt.replace("YYYY",year.toString())
									.replace("YY",year.toString())
									.replace("MM",month)
									.replace("DD",day)
									.replace("HH",hour)
									.replace("MN",min)
									.replace("SS",sec);
					}

					return rtnVal;
			};
			/*==================================================================
			* 자바스크립트 Date 객체를 Time 스트링으로 변환
			* parameter date: JavaScript Date Object, YYYY
			------------------------------------------------------------------*/
			this.httpPost = function ($http,targetUrl,param) { /*formatTime(date)*/
				var rtnObj = {};
				rtnObj.isError = false;
				rtnObj.result = null;
				$http({
							method: 'POST',
							url: targetUrl,
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
							transformRequest: function(obj) {
									var str = [];
									for(var p in obj){
										if (obj[p] != null){
											str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
										}
									}
									return str.join("&");
							},
							data: param
					}).success(function (data) {
						rtnObj.isError = false;
					rtnObj.result = data;
						return rtnObj;
					})
					.error(function (e) {
						rtnObj.isError = true;
					rtnObj.result = e;
					return rtnObj;
					});

					return rtnObj;
			};

			this.getTclickCd = function(isEllotte,cd) { /* 상품상세용 tclick*/
				var rtnVal = "";
				if (isEllotte) {
					rtnVal = "el_m_o_" + cd;
				} else {
					rtnVal = "m_o_" + cd;
				}
				return rtnVal;
			};
			this.getObjListKey = function(objList,itemkey,itemval){
				var rtnObj = null;
				var keepGoing = true;
				for(var c=0; c < objList.length; c++){
					var rtn = this.getObjKeyValue(objList[c],itemkey);
					if (rtn == itemval){
						rtnObj = objList[c];
						break;
					}
				}
				return rtnObj;
			};

			this.getObjKeyValue = function(obj,itemkey){
				var rtnObj = null;
				var keepGoing = true;
					angular.forEach(obj, function(val,key) {
						if (keepGoing == true){
							if(key == itemkey) {
								rtnObj = val;
								keepGoing = false;
							}
						}
					});

				return rtnObj;
			};

			//이미지이름구하기
			this.getSubImgName = function(imgName){
				var retImgNameVal="";
				if(imgName.length > 0){
					var paramArr = imgName.split("|");
					retImgNameVal = paramArr[0];
				}
					console.log('retImgNameVal',retImgNameVal);

				return retImgNameVal;
			};

			this.logrecom_type_view_jsonp = function(data) {
				var goodsNoArr = new Array();
				for (var i = 0; i < data.items.length; i++) {
					goodsNoArr[i] ="\'"+data.items[i]+"\'";
				}
				return goodsNoArr;
			};
		});

		// object -> array filter
		app.filter("toArray", function(){
		    return function(obj) {
		        var result = [];
		        angular.forEach(obj, function(val, key) {
		            result.push(val);
		        });
		        return result;
		    };
		});

		// 전체 Controller
		app.controller('GucciCtrl', ['$scope', '$window', '$http', '$routeParams', '$location', '$timeout', '$filter', 'LotteCommon','Fnproductview','commInitData', 'LotteUtil', 'LotteCookie', 'LotteStorage', function($scope, $window, $http,$routeParams, $location, $timeout, $filter, LotteCommon,Fnproductview,commInitData,LotteUtil,LotteCookie,LotteStorage) {
			// console.log('GucciCtrl call start');
			$scope.showWrap = true;
				$scope.contVisible = true;
				$scope.subTitle = "GUCCI"; //서브헤더 타이틀
				$scope.screenData = {
					dispNo: 5522717,
					showAllCategory: false,
					selectCate1: 0,
					selectCate2: 0,
					selectCate3: 0,
					selectedCategory: 0,
					cate_list: [],
				}
				$scope.isBasicData = false;
				$scope.windowWidth = $(window).width();
				$scope.windowHeight = $(window).height();
				/* menu Small Category GET */

				// UI Scope
				$scope.reqParam = {
					upCurDispNo : Fnproductview.objectToString(commInitData.query['upCurDispNo']), // 상위 카테고리번호
					dispDep : Fnproductview.objectToString(commInitData.query['dispDep']),
					curDispNo : Fnproductview.objectToString(commInitData.query['curDispNo']),
					goods_no : Fnproductview.objectToString(commInitData.query['goods_no']) ,
					wish_lst_sn : Fnproductview.objectToString(commInitData.query['wish_lst_sn']),
					cart_sn : Fnproductview.objectToString(commInitData.query['cart_sn']),
					item_no : Fnproductview.objectToString(commInitData.query['item_no']),
					genie_yn : Fnproductview.objectToString(commInitData.query['genie_yn']),
					cn : Fnproductview.objectToString(commInitData.query['cn']),
					cdn : Fnproductview.objectToString(commInitData.query['cdn']),
					curDispNoSctCd : Fnproductview.objectToString(commInitData.query['curDispNoSctCd']),
					smp_yn : Fnproductview.objectToString(commInitData.query['smp_yn']),
					tclick : Fnproductview.objectToString(commInitData.query['tclick']),
						late_view_yn : Fnproductview.objectToString(commInitData.query['late_view_yn'])
				};
				$scope.reqParamStr = $scope.baseParam;
				if ($scope.reqParam.curDispNoSctCd != null){$scope.reqParamStr += "&curDispNoSctCd="+$scope.reqParam.curDispNoSctCd;}
				if ($scope.reqParam.curDispNo != null){$scope.reqParamStr += "&curDispNo="+$scope.reqParam.curDispNo;}
				if ($scope.reqParam.goods_no != null){$scope.reqParamStr += "&goods_no="+$scope.reqParam.goods_no;}

				$scope.imageList = []; //상품 스와이프 이미지 목록
				$scope.totalPromInfo = {}; // 팝업 레이어용 청구할인 데이타
				$scope.dispPromInfo_base = []; // 화면노출하는 청구할인 베이스 데이타
				$scope.dispPromInfo_before = {}; // 화면노출하는 청구할인 오브젝트 데이타
				$scope.dispPromInfo = []; // 화면에 노출하는 청구할인 배열 데이타
				$scope.isMatchLmt = false; // 구간대에 부합하는것이 하나라도 있는지 여부

				/**
				 * Data Load Scope Func
				 */
				// 상품기본정보 데이터 로드
				$scope.loadingFail = false;
				$scope.loadBasicData = function() {
						if ($scope.BasicData == undefined) {
								$http.get(LotteCommon.productProductViewData, {params:$scope.reqParam})
								.success(function(data) {
									$scope.BasicData = data.max; /*상품기본정보 로드*/
									$scope.isBasicData = true;
									$scope.btnDispTp = Fnproductview.productbtnlayertp($scope);
									$scope.mdNtcFcont = '';

								    if($scope.BasicData.product.planshop.items != null && $scope.BasicData.product.planshop.items.length > 0){// 2017.02.01 구찌 기획전 정보
										$scope.relatedEvents = $scope.BasicData.product.planshop.items[0];
									}
									if (!Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont)){$scope.mdNtcFcont += $scope.BasicData.product.md_ntc_fcont;}
									if (!Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont1)){$scope.mdNtcFcont += $scope.BasicData.product.md_ntc_fcont1;}
									if (!Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont2)){$scope.mdNtcFcont += $scope.BasicData.product.md_ntc_fcont2;}
									//console.log(Fnproductview.isEmpty($scope.BasicData.product.md_ntc_fcont2) + "----------------");

									$scope.BasicData.product.dtl_info_fcont = Fnproductview.makeListCode($scope.BasicData.product.dtl_info_fcont, ";");

									$scope.reqCheckList(); /*체크리스트 */

									angular.forEach($scope.BasicData.product, function(val,key) {
										if(key != 'img_url' && key.indexOf('img_url') == 0) {
											if ($scope.BasicData.product[key] != null && $scope.BasicData.product[key] != ''){
												var item = {};
												item.tp = "img";
												item.imgUrl = $scope.BasicData.product[key].replace('_280', '_550');
														$scope.imageList.push(item);
											}
										}
									});
									// 2017.02.01 공유하기
									if ($scope.imageList.length > 0) {
										$scope.share_img = $scope.imageList[0].imgUrl;
									} else {
										$scope.share_img = "";
									}
									// 최근 본 상품에서 온 경우가 아니면
									if ($scope.reqParam.late_view_yn != 'Y'){
										lastStatusViewGoods();
									}

									/**
									 * 청구할인 구성
									 * 2017.10.30
									 */
									if($scope.BasicData.product.clm_dscnt_prom_items && $scope.BasicData.product.clm_dscnt_prom_items.length > 0){
										var allItems = $scope.BasicData.product.clm_dscnt_prom_items;
										// 소팅
										var objTotal = {};
										var arrCard = [];
										for(var k = 0; k<allItems.length; k++){
											var sItem = allItems[k];
											if(!objTotal[sItem.card_knd_cd]){
												arrCard.push(sItem.card_knd_cd);
												objTotal[sItem.card_knd_cd] = {};
												objTotal[sItem.card_knd_cd].sort = k;
												objTotal[sItem.card_knd_cd].arr = [];
												objTotal[sItem.card_knd_cd].arr.push(sItem);
											}else{
												objTotal[sItem.card_knd_cd].arr.push(sItem);
											}
											if(sItem.prom_dscnt_prc != 0){
												objTotal[sItem.card_knd_cd].match = true;
											}
										}
										for (var prop in objTotal) {
											if(objTotal[prop].arr.length > 1 && objTotal[prop].match){
												objTotal[prop].arr = $filter('orderBy')(objTotal[prop].arr, 'aply_lmt_amt', false);
											}
										}
										var arrTotal = [];
										for(var i = 0; i<arrCard.length; i++){
											for (var prop in objTotal) {
												if(prop == arrCard[i]){
													for(var j = 0; j <objTotal[prop].arr.length; j++){
														arrTotal.push(objTotal[prop].arr[j]);
													}
												}
											}
										}
										// 시작
										for(var i = 0; i<arrTotal.length; i++){
											var tempItem = arrTotal[i];
											tempItem.prom_dscnt_prc = $scope.objPromDisc.getDiscPrice(tempItem);
											tempItem.lmt_amt_kr = $scope.objPromDisc.getPriceKr(tempItem.aply_lmt_amt + "");
											tempItem.max_fvr_kr = $scope.objPromDisc.getPriceKr(tempItem.max_fvr_val + "");
											if(!$scope.totalPromInfo[tempItem.card_knd_cd]){
												$scope.totalPromInfo[tempItem.card_knd_cd] = {};
												$scope.totalPromInfo[tempItem.card_knd_cd].arr = [];
												$scope.totalPromInfo[tempItem.card_knd_cd].sort = i;
												$scope.totalPromInfo[tempItem.card_knd_cd].arr.push(tempItem);
											}else{
												$scope.totalPromInfo[tempItem.card_knd_cd].arr.push(tempItem);
											}
											if(tempItem.aply_lmt_amt <= $scope.BasicData.product.sale_prc){
												$scope.isMatchLmt = true;
											}
											$scope.dispPromInfo_base.push(tempItem);
										}
				                    	// 구간대 부합하는 것이 하나도 없으면
				                    	var cnt = 0;
										if(!$scope.isMatchLmt){
											for(var i = 0; i<$scope.dispPromInfo_base.length; i++){
												var tempItem = $scope.dispPromInfo_base[i];
												if(!$scope.dispPromInfo_before[tempItem.card_knd_cd]){
													tempItem.sort = cnt++;
													tempItem.card_knd_nm = tempItem.card_knd_nm.replace('카드', '');
													tempItem.info = $scope.objPromDisc.getDispPromText_nomatch(tempItem, $scope.dispPromInfo_base);
													$scope.dispPromInfo_before[tempItem.card_knd_cd] = tempItem;
												}
											}
										}else{ // 구간대 부합하는 것이 하나라도 있으면
											for(var i = 0; i<$scope.dispPromInfo_base.length; i++){
												var item = $scope.dispPromInfo_base[i];
												// 처음나온 카드이거나 부합하는 구간이면서 최종금액이 작은경우에 데이타 갱신
												if(!$scope.dispPromInfo_before[item.card_knd_cd] || (item.aply_lmt_amt <= $scope.BasicData.product.sale_prc && item.prom_dscnt_prc < $scope.dispPromInfo_before[item.card_knd_cd].prom_dscnt_prc)){
													item.sort = cnt++;
													item.card_knd_nm = item.card_knd_nm.replace('카드', '');
													item.info = $scope.objPromDisc.getDispPromText(item, $scope.dispPromInfo_base);
													$scope.dispPromInfo_before[item.card_knd_cd] = item;
												}
											}
										}
										for(var prop in $scope.dispPromInfo_before){
											$scope.dispPromInfo.push($scope.dispPromInfo_before[prop]);
										}
									}

									// 주의사항 및 사이즈 노출
									$timeout(function(){
										console.log($scope.BasicData.product.gucci_caution_id);
										$("#caution_"+$scope.BasicData.product.gucci_caution_id).show();
										$("#size_"+$scope.BasicData.product.gucci_size_id).show();
									}, 300);



				            		/**
				            		 * 와이더플래닛 모바일 스크립트
				            		 * 2016.09.19 한상훈
				            		 */
				            		$timeout(function(){
				            			var items = [{i:$scope.BasicData.goods_no, t:$scope.BasicData.product.goods_nm}];
				            			$scope.addWiderPlanetLog("Item", items);
				            		}, 3000);

									/**
					 				 * 레코벨 수집스크립트
					 				 * 2018.07.5 김낙운
					 				 */
					 				var recobellCollectLog = function () {
								        var rlqDevice = "MW";

								        if ($scope.appObj.isApp && $scope.appObj.isAndroid) {
								            rlqDevice = "MA";
								        } else if ($scope.appObj.isApp && $scope.appObj.isIOS) {
								            rlqDevice = "MI";
								        }

								        _rlq.push(['setVar','cuid','fdd29847-94cd-480d-a0d9-16144485d58b']);
								        _rlq.push(['setVar','device',rlqDevice]);
								        _rlq.push(['setVar','itemId',$scope.BasicData.goods_no ? $scope.BasicData.goods_no : ""]);
								        _rlq.push(['setVar','userId',LotteCookie.getCookie('MBRNO') ? LotteCookie.getCookie('MBRNO') : ""]);
								        _rlq.push(['setVar','brandId',$scope.BasicData.goods_cmps_cd != "30" ? $scope.BasicData.product.brnd_no : ""]);
								        _rlq.push(['track','view']);
								        setTimeout(function() {
								          (function(s,x){s=document.createElement('script');s.type='text/javascript';
								          s.async=true;s.defer=true;s.src=(('https:'==document.location.protocol)?'https':'http')+ '://d1hn8mrtxasu7m.cloudfront.net/rblc/js/rblc-apne1.min.js';
								          x=document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);})();
								        }, 0);
					 				}
					 				recobellCollectLog();

					 				$scope.prdCtgInfoDataLoad(); // 상품 카테고리 정보 가져오기

								})
								.error(function() {
										$scope.loadingFail = true;
										console.log('Data Error : 상품기본정보 로드 실패');
								});
						}
				};

				// 카테고리 데이터 로드
				$scope.prdCtgInfoDataLoad = function() {
					$http.get(LotteCommon.productCategoryInfoData + $scope.BasicData.goods_no)
					.success(function(data){
						$scope.BasicData.prdCtgInfoData = {}; // 상품 카테고리 정보 데이터
						$scope.BasicData.prdCtgInfoData = data.data;
					})
					.error(function () {
						console.log('Data Error : 상품 카테고리정보 로드 실패');
					})
					.finally(function () {
		 				$scope.alidoCollectLog('gucciPrdView', $scope.BasicData); // // ALIDO 수집스크립트 호출(상품상세 보기), 카테고리 데이러 로드 완료 후로 변경
					});
				}

				/**
				 * 청구할인 관련 함수
				 * 2017.10.30
				 */
				$scope.objPromDisc = {
					// 숫자 금액을 한글로 변환
					getPriceKr : function(num){
						if(!num || isNaN(num))	return num;
						if(num.length > 8 || num % 10000 != 0)	return $scope.Fnproductview.getNumberFormat(num) + "원";
						var num2 = num.substr(0, num.length - 4);
			        	return num2 + "만원";
					},
		            // 청구할인 화면 표시 문구 - 구간대 미부합
					getDispPromText_nomatch : function(item, total){
						var str = "";
						str = item.card_knd_nm + " " + item.fvr_val + "% (" + item.lmt_amt_kr + " 이상)";
						return str;
					},
					// 청구할인 화면 표시 문구 - 구간대 부합
					getDispPromText : function(item, total){
						var str = "";
						if(item.prom_dscnt_prc == 0 || item.prom_dscnt_prc == '0'){
							str = item.card_knd_nm + " " + item.fvr_val + "% (" + item.lmt_amt_kr + " 이상)";
							return str;
						}else{
							str = item.card_knd_nm + " " + item.lmt_amt_kr + "↑ " +item.fvr_val + "%";
							var second = $scope.objPromDisc.getSecondItem(item, total);
							if(second)	str += ", " + second.lmt_amt_kr + "↑ " +second.fvr_val + "%";
							return str;
						}
					},
					// 청구할인 적용된 금액 구하기
					getDiscPrice : function(item){
						// 제한금액과 비교
						if(item.aply_lmt_amt > $scope.BasicData.product.sale_prc){
							return 0;
						}
						// 할인가격
						var disc = $scope.BasicData.product.sale_prc * item.fvr_val * 0.01;
						// 할인가격과 최대할인 가격 비교
						if(item.max_fvr_val < disc){
							return $scope.BasicData.product.sale_prc - item.max_fvr_val;
						}
						return $scope.BasicData.product.sale_prc - disc;
					},
					// 구간대에 부합하는 경우 차상위 찾기
					getSecondItem : function(item, total){
						var result;
						for(var i = 0; i<total.length; i++){
							if(total[i].card_knd_cd == item.card_knd_cd && total[i].aply_lmt_amt > item.aply_lmt_amt){
								if(!result){
									result = total[i];
									continue;
								}
								if(result.aply_lmt_amt > total[i].aply_lmt_amt){
									result = total[i];
								}
							}
						}
						return result;
					}
				};

				$scope.loadSubHeaderCtgData = function() {
					$http.get(LotteCommon.specialMall+'?dispNo='+$scope.screenData.dispNo)
					.success(function(data) {
						$scope.screenData.cate_list = data.max.cate_list.items;
					});
				};

				// 최근본상품
				var lastStatusViewGoods = function () {
					var storageViewGoods = LotteStorage.getLocalStorage('latelyGoods');
					var scope = angular.element('html').scope();
					var storageViewGoodsArr = [];
					var newStorageViewGoodsObj = {};
					var newStorageViewGoods = "";
					var userGoodsDataInsert = false;
					var loginUserMbrNo = "";
					var storageStr = "";


					if (storageViewGoods != null) {
						storageViewGoodsArr = storageViewGoods.split("|");

						newStorageViewGoodsObj['goods_no'] = [];

						for (var i = 0; i < storageViewGoodsArr.length; i++) {
							newStorageViewGoodsObj['goods_no'].push(storageViewGoodsArr[i]);
						}

						if (newStorageViewGoodsObj['goods_no'].indexOf($scope.BasicData.goods_no) != -1) {
							newStorageViewGoodsObj['goods_no'].splice(newStorageViewGoodsObj['goods_no'].indexOf($scope.BasicData.goods_no),1);
						}
						newStorageViewGoodsObj['goods_no'].push($scope.BasicData.goods_no);

						angular.forEach(newStorageViewGoodsObj, function (val, key) {
							if (val.length > 20) {
								val.splice(0, (val.length-20));
							}

							if (newStorageViewGoods != "") { newStorageViewGoods += "|"; }
							newStorageViewGoods += val.join("|");
						});

						storageStr = newStorageViewGoods;
						LotteStorage.setLocalStorage("latelyGoods", storageStr);
						$scope.shareStorage("local", "latelyGoods", storageStr); //https일때 추가
					} else {
						storageStr = $scope.BasicData.goods_no;
						LotteStorage.setLocalStorage("latelyGoods", storageStr);
						$scope.shareStorage("local","latelyGoods", storageStr); //https일때 추가
					}
				};

				// faq 데이터 로드
				$scope.loadFaqListData = function() {
						if ($scope.faqListData == undefined) {
								console.log('faqListData-reqParam', 'called');
								$http.get(LotteCommon.custcenterFaqListData, {params : {cust_inq_sml_tp_cd : "1578"}})
								.success(function(data) {
										$scope.faqListData = data.faqList; //상품기본정보 로드
										$scope.isFaqListData = true;
								})
								.error(function() {
										console.log('Data Error : 상품기본정보 로드 실패');
								});
						}
				};
				$scope.reqCheckList = function() {
					//성인 인증 체크
					if ($scope.BasicData.product.byr_age_lmt_cd == 19) { /*19금 상품*/
						if ($scope.loginInfo.isAdult == "") { /*본인인증 안한 경우*/

										if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
												//$scope.loginProc('Y');
											Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl + '?adultChk=Y');
										} else {
												$scope.goAdultSci();
										}
										return false;
								} else if (!$scope.loginInfo.isAdult) { /*성인이 아닌 경우*/
										alert("이 상품은 법률규정에 의하여 만 19세 이상 성인만 조회 및 구매가 가능합니다.");
										return false;
								}
						}
				}
				$scope.goProduct_view = function(goods_no){
					var fullUrl = LotteCommon.productviewUrl + "?goods_no="+goods_no+"&" + $scope.baseParam;
					if ($scope.reqParam.curDispNoSctCd != null){fullUrl += "&curDispNoSctCd="+$scope.reqParam.curDispNoSctCd;}
					if ($scope.reqParam.curDispNo != null){fullUrl += "&curDispNo="+$scope.reqParam.curDispNo;}
					//$scope.sendTclick( 'm_DC_ProdDetail_Swp_Rel_A' + ( this.$index + 1 ) );
					fullUrl += '&tclick=m_DC_ProdDetail_Swp_Rel_A' + ( this.$index + 1 );
					$window.location.href = fullUrl;
				}
				// 2017.02.01 구찌 기획전 링크 이동
				$scope.productListUrl = function(curDispNo,idx){
					$window.location.href = LotteCommon.prdlstUrl +'?' + $scope.baseParam + '&curDispNo=' + curDispNo.planshopNo + '&tclick=m_DC_ProdDetail_Gucci_Swp_Planshop_idx0' + idx ;
				}
		}]);

		// Route용 Controller
		app.controller('GucciDetailPage', ['$scope', '$window','Fnproductview', function($scope, $window,Fnproductview) {
			console.log('GucciDetailPage called');
			$scope.Fnproductview = Fnproductview;
			$scope.loadSubHeaderCtgData();
			$scope.loadBasicData();
			//$scope.productDetail(); //bottom 상품옵션정보 layer
			angular.element($window).scrollTop(0);

			// 상품기본정보 데이터 로드
			$scope.optionChange = function(idx,t) {
				 console.log('idx', idx);
			};
		}]);

		// Route용 Controller
		app.controller('GucciFaqListPage', ['$scope', '$window', 'LotteCommon','Fnproductview', function($scope, $window, LotteCommon,Fnproductview) {
			console.log('GucciFaqListPage called');
			$scope.loadFaqListData(); //gucci faq list data
				angular.element($window).scrollTop(0);

				angular.element(document).ready(function(){
					// FAQ 페이지 내용 펼치기/접기
					$('.gucci_faq_list').on('click',' > ul > li > a' , function(e){
						if($(this).parent('li').hasClass('faq_on')){
							$(this).siblings('ul').slideUp('fast', function(){
								$(this).parent('li').removeClass('faq_on');
							});
						}else{
							if($('.gucci_faq_list > ul > li').hasClass('faq_on')){
								$('.gucci_faq_list > ul > li.faq_on').children('ul').slideUp('fast', function(){
									$('.gucci_faq_list > ul > li').removeClass('faq_on');
								});
							}
							$(this).siblings('ul').slideDown('fast', function(){
								$(this).parent('li').addClass('faq_on');
							});
						};
						return false;
					});

					//history back 키 눌렸을 때 이벤트처리
					window.addEventListener( 'popstate', function(event){
						$window.location.href = "#/";
					}, false);
				});
		 // --------------------------------------------- FAQ  ---------------------------------------------- //
		}]);

		// Route용 Controller
		app.controller('GucciQnaListPage', ['$http','$scope', '$window', 'LotteCommon','Fnproductview','$routeParams','commInitData', function($http,$scope, $window, LotteCommon,Fnproductview,$routeParams,commInitData) {
			console.log('GucciQnaListPage called');
				angular.element($window).scrollTop(0);
				$scope.mdl_no = $routeParams.mdl_no == undefined ? "" : $routeParams.mdl_no;
				if ($scope.reqParam == undefined){
					$scope.reqParam = {
						upCurDispNo : Fnproductview.objectToString(commInitData.query['upCurDispNo']), // 상위 카테고리번호
						dispDep : Fnproductview.objectToString(commInitData.query['dispDep']),
						curDispNo : Fnproductview.objectToString(commInitData.query['curDispNo']),
						goods_no : Fnproductview.objectToString(commInitData.query['goods_no']) ,
						wish_lst_sn : Fnproductview.objectToString(commInitData.query['wish_lst_sn']),
						cart_sn : Fnproductview.objectToString(commInitData.query['cart_sn']),
						item_no : Fnproductview.objectToString(commInitData.query['item_no']),
						genie_yn : Fnproductview.objectToString(commInitData.query['genie_yn']),
						cn : Fnproductview.objectToString(commInitData.query['cn']),
						cdn : Fnproductview.objectToString(commInitData.query['cdn']),
						curDispNoSctCd : Fnproductview.objectToString(commInitData.query['curDispNoSctCd']),
						tclick : Fnproductview.objectToString(commInitData.query['tclick'])
					};
				}

				/**
				 * Data Load Scope Func
				 */
				// qna 화면 데이터 로드
				var fnGucciQnaData = function() {
						if ($scope.GucciQnaData == undefined) {
								console.log('reqParam', $scope.reqParam);

								$http.get(LotteCommon.custcenterQuestWriteGucciData, {params:$scope.reqParam})
								.success(function(data) {
										$scope.GucciQnaData = data.data_set; //상품기본정보 로드
										$scope.isGucciQnaData = true;
										//$scope.goodsnm = $scope.reqParam.curDispNo;
										$scope.gucciQnaInit();

								})
								.error(function(ex) {
									if (ex == null){
										console.log('Data Error : 구찌문의하기 로드 실패-->null');
										return;
									}
									if (ex.error.response_code == '2000'){
										alert("로그인이 필요한 서비스입니다.");
										//$scope.loginProc();
										Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
									} else {
										console.log('Data Error : 구찌문의하기 로드 실패-->' + ex.error.response_msg);
									}
								});
						}
				};
				fnGucciQnaData();

				$scope.goQnaWrite = function(){

				};
				$scope.gucciQnaInit = function(){
					//angular.element(document).ready(function(){
					$('#email_ans_ntc_yn').change(function(){
						$scope.fn_changeWrtrEmail();
					});

					$('#sms_ans_rcv_yn').change(function(){
						$scope.fn_changeWrtrPhone();
					});
					$('#wrtr_cell_no1').change(function(){
						$("input[name=wrtr_cell_no1]").val(this.value);
					});

					$('input[name=wrtr_cell_no2]').click(function(){
						var frm = document.getElementById("questWrite");
						if(!frm.sms_ans_rcv_yn.checked){
							if(confirm("답신 여부를 SMS로 받으시겠습니까?")){
								frm.sms_ans_rcv_yn.checked = true;
								$scope.fn_changeWrtrPhone();
							}
						}
					});
					$('input[name=wrtr_cell_no3]').click(function(){
						var frm = document.getElementById("questWrite");
						if(!frm.sms_ans_rcv_yn.checked){
							if(confirm("답신 여부를 SMS로 받으시겠습니까?")){
								frm.sms_ans_rcv_yn.checked = true;
								$scope.fn_changeWrtrPhone();
							}
						}
					});

					// 직접입력 이메일 바인드 방법 변경
					var email_addr = $scope.GucciQnaData.email_addr;
					if(email_addr.indexOf("@") >= 0){
						var emailAddr = email_addr.split("@");

						$('INPUT[name="wrtr_email_addr1"]').val( emailAddr[0] );
						$('SELECT[name="wrtr_email_addr2"]').val( emailAddr[1] );
						if( "D" == $('SELECT[name="wrtr_email_addr2"]').val() && "" != emailAddr[1] && null != emailAddr[1] )
							$('SELECT[name="wrtr_email_addr2"]').val( "" );

						$scope.f_InputEmail( $('SELECT[name="wrtr_email_addr2"]').val() );
					}
				};

				$scope.fn_changeWrtrPhone = function(){
					var obj = document.getElementById("sms_ans_rcv_yn");
					if( obj.checked ){
						obj.value ="Y";
						$("#wrtr_cell_no1").attr("disabled",false);
						$("input[name=wrtr_cell_no2]").attr("readOnly",false);
						$("input[name=wrtr_cell_no3]").attr("readOnly",false);
					}else{
						obj.value ="N";
						$("#wrtr_cell_no1").attr("disabled",true);
						$("input[name=wrtr_cell_no2]").attr("readOnly",true);
						$("input[name=wrtr_cell_no3]").attr("readOnly",true);
					}
				};
				$scope.fn_changeWrtrEmail = function(){
					var obj = document.getElementById("email_ans_ntc_yn");
					if( obj.checked ){
						obj.value ="Y";
					}else{
						obj.value ="N";
					}
				};
				$scope.f_InputEmail = function (pval){
					/*var frm = document.questWrite;
					 if( pval == "D" ){
						 $('.direct').hide();
						 return;
					 }
					 if( pval == "" ) {
						 $('.direct').show();
						 $("input[name=wrtr_email_addr_direct]").attr("readOnly",false);
						 frm.wrtr_email_addr_direct.value = "";
						 frm.wrtr_email_addr_direct.focus();
					 } else {
						 $("input[name=wrtr_email_addr_direct]").attr("readOnly",true);
						 frm.wrtr_email_addr_direct.value = pval;
						 $('.direct').hide();
					 }*/
				};
		}]);

		// --------------------------------------------- Qna  ---------------------------------------------- //

		// Directive :: GUCCI 타이틀, 카테고리
		/*app.directive('gucciHeader', ['$window', '$timeout', '$location', function($window, $timeout, $location) {
				return {
						templateUrl: '/lotte/resources_dev/product/m/gucci_product_view_ctg.html',
						replace:true,
						link:function($scope, el, attrs) {
							$scope.goGucciHome = function (e) {
										var tClickStr = "G_LOGO";
										$scope.sendTclick(tClickStr); // lotte-comm.js  // TCLICK 수집
									$window.location.href = '/mall/gucci/gucci_main.do?disp_no=5522717' + "&" + $scope.baseParam;
								};
									 $scope.gotoPrepage = function() {
												$scope.sendTclick("m_RDC_header_new_pre");
												history.go(-1);
										};
								$scope.headerJsload = function(){
									var $subHeadWrap = $('#gucciSubHead');
									var $ctgWrap = $subHeadWrap.find('nav');
									var $ctgListBig = $ctgWrap.find('.ctg_list_big');
									var $ctgListMid = $ctgWrap.find('.ctg_list_mid');
									var $ctgListSml = $ctgWrap.find('.ctg_list_sml');
									var $bigCtgBtn = $ctgListBig.find(' > li > .btn_ctg_big');
									var $midCtgBtn = $ctgListMid.find(' > li > .btn_ctg_mid');

									//대카테고리 클릭
									$bigCtgBtn.on('click', function(){
										$scope.thisCtgHeight = $(this).siblings('ul').height();

										if($(this).parent().hasClass('big_on') == false && !$ctgListBig.children('li').hasClass('big_on')){
											$ctgListMid.children('.big_on').removeClass('big_on').children('ul').stop().slideUp(300);
											$(this).parent().addClass('big_on').children('ul').stop().slideDown(300);
											$subHeadWrap.stop().animate({marginBottom:$scope.thisCtgHeight},300)
										}else if($(this).parent().hasClass('big_on') == false && $ctgListBig.children('li').hasClass('big_on')){
											$subHeadWrap.animate({marginBottom:0},200);
											$subHeadWrap.animate({marginBottom:$scope.thisCtgHeight},300);
											$ctgListBig.children('.big_on').removeClass('big_on').children('ul').stop().slideUp(200);
											$(this).parent().addClass('big_on').children('ul').stop().delay(200).slideDown(300);
										}else{
											$(this).parent().children('ul').stop().slideUp(300);
											$subHeadWrap.stop().animate({marginBottom:0},300)
											setTimeout(function(){
												$ctgListBig.children('li').removeClass('big_on');
											}, 300);
										};
										return false;
									});

									//중카테고리 클릭
									$midCtgBtn.on('click', function(){
										$scope.thisCtgMargin = parseInt($subHeadWrap.css('margin-bottom'));
										$scope.activeCtgMargin = $ctgListMid.children('.mid_on').children('ul').height();
										$scope.thisCtgHeight = $(this).siblings('ul').height();

										if($(this).parent().hasClass('mid_on') == false && !$ctgListMid.children('li').hasClass('mid_on')){
											$(this).parent().addClass('mid_on').children('ul').stop().slideDown(200);
											$subHeadWrap.stop().animate({marginBottom : $scope.thisCtgMargin + $scope.thisCtgHeight},200)
										}else if($(this).parent().hasClass('mid_on') == false && $ctgListMid.children('li').hasClass('mid_on')){
											$ctgListMid.children('.mid_on').removeClass('mid_on').children('ul').stop().slideUp(200);
											$(this).parent().addClass('mid_on').children('ul').stop().slideDown(200);
											$subHeadWrap.stop().animate({marginBottom : $scope.thisCtgMargin - $scope.activeCtgMargin + $scope.thisCtgHeight},200)
										}else{
											$(this).parent().removeClass('mid_on').children('ul').stop().slideUp(200);
											$subHeadWrap.stop().animate({marginBottom:$scope.thisCtgMargin - $scope.thisCtgHeight},200)
										};
										return false;
									});
								};

								angular.element(document).ready(function(){
									$scope.headerJsload();
								});
					}
				};
		}]);*/

		app.directive('headerSubGucci', [ '$window', 'LotteCommon', function($window, LotteCommon) {
			return {
				templateUrl : "/lotte/resources_dev/layout/header_sub_gucci.html",
				replace : true,
				link : function($scope, el, attrs) {
					$scope.menuCategory1Click = function(item) {
						console.log("menuCategory1Click", $scope.screenData.selectCate1, item.disp_no);
						if(item.link_url != "") {
							$window.location.href = item.link_url;
						} else {
							if($scope.screenData.selectCate1 == item.disp_no) {
								$scope.screenData.selectCate1 = 0;
							} else {
								$scope.screenData.selectCate1 = item.disp_no;
							}

						}
					}
					$scope.menuCategory2Click = function(item, item2) {
						if(item.link_url != "") {
							$window.location.href = item.link_url;
						} else {
							if($scope.screenData.selectCate2 == item.disp_no) {
								$scope.screenData.selectCate2 = 0;
							} else {
								$scope.screenData.selectCate2 = item.disp_no;
							}
						}
					}
					$scope.menuCategory3Click = function(item, item2) {
						if(item.link_url != "") {
							window.location.href = item.link_url;
						} else {
							if($scope.screenData.selectCate3 == item.disp_no) {
								$scope.screenData.selectCate3 = 0;
							} else {
								$scope.screenData.selectCate3 = item.disp_no;
							}
						}
					}
				}
			};
		}]);

		/* header each */
		app.directive('subHeaderEach', [ '$window', function($window) {
			return {
				replace : true,
				link : function($scope, el, attrs) {
					/*이전 페이지 링크*/
					$scope.gotoPrepage = function() {
						$scope.sendTclick("m_RDC_header_new_pre");
						history.go(-1);
					};

					var $el = angular.element(el),
						$win = angular.element($window),
						headerHeight = $scope.subHeaderHeight;

					$win = angular.element($window),
					headerHeight = $scope.subHeaderHeight;

					function setHeaderFixed() {
						if ($scope.appObj.isNativeHeader) {
							headerHeight = 0;
						}

						if ($win.scrollTop() >= 43) {
							$el.attr("style", "z-index:10;position:fixed;top:" + headerHeight +"px;width:100%");
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

		// Directive :: GUCCI 상품정보
		app.directive('gucciProductInfo', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info.html',
				replace:true,
				link : function(){
				// 상품정보 아코디언
					$(function(){
						$('.toggle_button').on('click', function(){
							if($(this).parent().hasClass('on') == false){
								if($('.gucci_product_info > ul > li').hasClass('on')){
									$('.gucci_product_info > ul > li.on').children('.content').slideUp('fast', function(){
										$('.gucci_product_info > ul > li').removeClass('on');
									});
								}
								$(this).siblings('.content').slideDown('fast', function(){
									$(this).parent().addClass('on');
								});
							} else{
								$(this).siblings('.content').slideUp('fast', function(){
									$(this).parent().removeClass('on');
								});
							}
						});
					});
				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈10
		app.directive('gucciProductInfoSize10', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size10.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);

		// Directive :: GUCCI 상품정보 사이즈11
		app.directive('gucciProductInfoSize11', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size11.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈12
		app.directive('gucciProductInfoSize12', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size12.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈13
		app.directive('gucciProductInfoSize13', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size13.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈14
		app.directive('gucciProductInfoSize14', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size14.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈15
		app.directive('gucciProductInfoSize15', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size15.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈16
		app.directive('gucciProductInfoSize16', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size16.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈17
		app.directive('gucciProductInfoSize17', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size17.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈18
		app.directive('gucciProductInfoSize18', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size18.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈19
		app.directive('gucciProductInfoSize19', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size19.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈20
		app.directive('gucciProductInfoSize20', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size20.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);
		// Directive :: GUCCI 상품정보 사이즈21
		app.directive('gucciProductInfoSize21', [function() {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_product_info_size21.html',
				replace:true,
				link : function($scope, el, attrs){

				}
			};
		}]);

		// Directive :: GUCCI faq & 문의하기
		app.directive('gucciBottomMenu', ['$window',function($window) {
			return {
				templateUrl: '/lotte/resources_dev/product/m/gucci_bottom_menu.html',
				replace:true,
				link : function($scope, el, attrs){
					$scope.goGucciFaq = function(){
						var tClickStr = "G_FAQ";
								$scope.sendTclick(tClickStr); // lotte-comm.js  // TCLICK 수집
							$window.location.href = "/custcenter/m/submain_gucci.do?cust_inq_sml_tp_cd=1578&" + $scope.baseParam;
								//$window.location.href = "#submain_gucci";
					};
					$scope.goGucciQuestWrite = function(){
						var tClickStr = "G_QnA";
								$scope.sendTclick(tClickStr); // lotte-comm.js  // TCLICK 수집
						// $window.location.href = "#product_quest_write_gucci/" + $scope.BasicData.product.model_no;

						if($scope.loginInfo.isLogin){
							/*
							 * 회원구분
							 * mbrSctCdCheck : 0 - 비회원, 1 - 정회원, 2 - 준회원, 3 - 법인회원
							 */
							if($scope.BasicData.mbr_sct_cd_check == '3'){
								alert("롯데패밀리 개인회원으로 로그인 하신 후 응모해주세요.");
								//$scope.loginProc('Y');
								Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
							} else {
							/*
							 * 상품문의 등록화면
							 */
								var mdl_no_g = $("input[name=mdl_no]").val();

								// <%=defaultDomain%>
								location.href="/product/product_quest_write_gucci.do?"+$scope.reqParamStr+"&mdl_no="+mdl_no_g;
								//location.href="#product_quest_write_gucci/mdl_no=337551|18M08685";
							}
						}
						else{
							if(confirm('롯데 패밀리 회원 로그인 후 참여하실 수 있습니다.')){
								//$scope.loginProc('Y');
								Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
							}
						}
					}
				}
			};
		}]);
		// Directive :: 상품상세 Html정보 셋팅
		app.directive('productDetailHtml', ['$http','$timeout','LotteCommon',function($http,$timeout,LotteCommon) {
			return {
				link:function($scope, el, attrs) {
					console.log('reqParam', $scope.reqParam);
					$http.get(LotteCommon.productProductDetailData, {params:$scope.reqParam})
					.success(function(data) {
						$scope.DetailData = data.result.dtl_info_fcont; //상품기본정보 로드
						$scope.isDetailData = true;
						el.html($scope.DetailData);
					})
					.error(function() {
							console.log('Data Error : 상품상세정보 로드 실패');
					});
				}
			};
		}]);
		/*// Directive :: rendering 후 호출하기위한 함수
		app.directive('onFinishRender', function($timeout) {
		   return {
			 restrict:'A',
			 scope:true,
			 link:function($scope, el, attrs) {
				 console.log('$scope.$last : ',$scope.$last);
				 if ($scope.$last == true){
					   $timeout(function(ngFinishedEvent){
						   $scope.$emit(attrs.onFinishRender);
						   $scope.$apply();
					   },0)
				   }
			 }
		   };
		});*/

		app.directive('lotteFooterProductOptionbar', ['$http','$window', '$timeout', '$location','$compile','LotteCommon','Fnproductview', 'LotteForm', function($http,$window, $timeout, $location, $compile,LotteCommon,Fnproductview,LotteForm) {
				return {
					templateUrl: '/lotte/resources_dev/product/m/lotte_footer_product_optionbar.html',
						replace:true,
						link:function($scope, el, attrs) {
							$scope.soldoutCheck = "";

							$scope.setOptsQty = function (num) { // 수량 +, - 처리
								if ($scope.soldoutCheck == "Y") {
									return false;
								}
								var $qty = $("#frm_send input[name=order_qty]:hidden"),
									  qty = parseInt($qty.val()),
									  calNum = num > 0 ? qty + 1: qty - 1;

								$scope.changeQty(calNum);
							};

							// 바로주문 레이어 옵션 선택처리
							$scope.setLayerOrderQty = function(optnum, target) {
								var optn = parseInt(optnum),
									obj = $('#opt_value'+optn);

								obj.val(obj.find('option').eq(target).val());
								$scope.optionChange(optn, obj[0]);
								$('.s_box01').eq(optn).find( 'a' ).addClass( 'select_on' );

								$("div.option_select_layer.act").removeClass("act").css("bottom","-500px");//선택후 레이어 닫기
							};

							$scope.initOrderQty = function (optval) {
								var qty = parseInt($scope.initOptValue(optval)[3]);// sample : value^itemno^soldout^qty 중 문자열 split하고 맨 마지막 qty

								var _opt_max_qty = parseInt($("#frm_send input[name=lmt_cnt_max]:hidden").val());
								var _opt_min_qty = parseInt($("#frm_send input[name=lmt_cnt_min]:hidden").val());

								if (qty != '' && qty > 0) {
									if (qty < _opt_max_qty) {
										_opt_max_qty = qty;
									}
									if (_opt_min_qty > _opt_max_qty) {
										_opt_max_qty = _opt_min_qty;
									}
									if (_opt_max_qty > 50) {
										_opt_max_qty = 50;
									}
								}
								$scope.changeQty(parseInt($("#frm_send input[name=order_qty]:hidden").val()));
							};
							//품절 상품 체크
							$scope.isSoldout = function (optval) {
								 var soldout = $scope.initOptValue(optval)[2];
								 if ( soldout == 'Y') {
										 return true;
								 } else  {
										 var qty = $scope.initOptValue(optval)[3];

										 if (qty == "0") return true;
										 else return false;
								 }
							};
							$scope.setSoldoutQty = function (){
								$scope.soldoutCheck = "Y";
								$scope.changeQty(0);
								$("#frm_send input[name=order_qty]:hidden").val("0");
							};
							$scope.getItemDtlStkInfo = function (optValCd){
								var optItemStkList = $scope.BasicData.product.item_dtl_stk_list;
								var rtnObj;
								for(var i=0; i < optItemStkList.total_count; i++){
									if (optItemStkList.items[i].opt_val_cd == optValCd){
										rtnObj = optItemStkList.items[i];
										break;
									}
								}
								return rtnObj;
							};
							$scope.initOptValue = function (optval) {
								var arrOptVal = "";
								try{
									arrOptVal = optval.split("^");
								}catch(e){}
									return arrOptVal;
							};
							$scope.getOptItemNo = function (optval) {
								 return $scope.initOptValue(optval)[1];
							};
							$scope.getMakeOptValCd = function () { // 1x1x...
								var rtnVal = "";
								var opt1    = $("#frm_input select[name=opt_value1]").val();
								var opt2    = $("#frm_input select[name=opt_value2]").val();
								var opt3    = $("#frm_input select[name=opt_value3]").val();
								var opt4    = $("#frm_input select[name=opt_value4]").val();

								if ( opt1 != '' && opt1 != undefined ) {
									rtnVal  = $scope.getOptItemNo(opt1);
								}
								if (rtnVal == ""){
									return rtnVal;
								}
								if ( opt2 != '' && opt2 != undefined ) {
									rtnVal  += " x "+$scope.getOptItemNo(opt2);
								}
								if ( opt3 != '' && opt3 != undefined ) {
									rtnVal  += " x "+$scope.getOptItemNo(opt3);
								}
								if ( opt4 != '' && opt4 != undefined ) {
									rtnVal  += " x "+$scope.getOptItemNo(opt4);
								}

								return rtnVal;
							};

							$scope.changeQty = function (num) { // 수량 +, - 처리 (Layer 동기화)
								var _opt_max_qty = parseInt($("#frm_send input[name=lmt_cnt_max]:hidden").val());
								var _opt_min_qty = parseInt($("#frm_send input[name=lmt_cnt_min]:hidden").val());
								// var basePrice =  parseInt($(".option_list_layer .totalPrice .price").text().replace(/[^0-9]/g, ""));  // 상품가격 출력
								var basePrice =  parseInt($scope.BasicData.product.sale_prc);  // 상품가격 출력

								var $qty = $("#frm_send input[name=order_qty]:hidden"),
									$iptOptsQty = $("#optQty"),
									$iptOptsQtyLayer = $("#optQtyLayer");

								if ($.isNumeric(num)) {
									num = Math.floor(num);
								} else {
									num = 0;
								}

								if (num < _opt_min_qty) {
									num = _opt_min_qty;
								}

								if (num > _opt_max_qty) {
									num = _opt_max_qty;
								}

								$qty.val(num);
								$iptOptsQty.val(num);
								$iptOptsQtyLayer.val(num);

								$(".option_list_layer .totalPrice .num").html(num);  // 수량합계 출력
								var totalPrice = basePrice*num ;
								$(".option_list_layer .totalPrice .price").html( Fnproductview.getNumberFormat(totalPrice) );  // 금액합계 출력
								$scope.BasicData.totalPrice = totalPrice; // ALIDO 수집스크립트를 위한 합계값 추가
							};

							//옵션 change 시 ajax[삭제 라인 재처리]
							$scope.optionChange = function (optnum, obj, div){
								var optItemStkList = $scope.BasicData.product.item_dtl_stk_list;
								var optItemList     = $scope.BasicData.product.item_dtl.items[optnum-1].item.items;
								var itemno      = $("#frm_send input[name=itemno]:hidden").val();
								var optcount    = $("#frm_input select[name^=opt_value]").length; // 옵션갯수
								var optval      = $("#frm_input select[name=opt_value" + optnum + "]").val();
								var invMgmtYn   = $("#frm_input input[name=invMgmtYn]:hidden").val();

								if($("#opt_value"+optnum+" option:selected").attr('sold_yn') == "Y"){
									alert('품절 상품을 선택하셨습니다.');

									for(var i=optnum; i<=optcount; i++){
										$("#opt_value"+i+" option:first").attr('selected',true);
									}

									return;
								}

								// 마지막 옵션
								if ( optnum == optcount ) {
									$scope.initOrderQty(optval);

									if ( $scope.isSoldout(optval) ) {
										$scope.setSoldoutQty();
											alert('선택하신 옵션은 품절입니다.');
											return;
									}else{
										$scope.soldoutCheck = "N";
									}

									$("#frm_send input[name=itemno]:hidden").val( $scope.getOptItemNo(optval) );//option value를 split하고 첫번째 값을 세팅.
								}
								// 마지막 바로전 옵션
								else if ( optnum == (optcount - 1) ) {
									var optNextItemList     = $scope.BasicData.product.item_dtl.items[optnum].item.items;
									// var optno1 = "", optno2 = "", optno3 = "", optno4 = "";

									$("#opt_value"+optcount+" option:first").attr("selected", true);                            // 마지막 옵션은 비선택 상태로 변경한다.
									$('div.option_list_layer').find('.s_box01').eq(optcount-1).find('.tl a').text( '선택하세요' );// 레이어 마지막 옵션은 비선택 상태로 변경한다.

									 /*var opt1    = $("#frm_input select[name=opt_value1]").val();
									 var opt2    = $("#frm_input select[name=opt_value2]").val();
									 var opt3    = $("#frm_input select[name=opt_value3]").val();
									 var opt4    = $("#frm_input select[name=opt_value4]").val();

									 if ( opt1 != '' && opt1 != undefined ) {
										 optno1  = $scope.getOptItemNo(opt1);
									 }
									 if ( opt2 != '' && opt2 != undefined ) {
										 optno2  = $scope.getOptItemNo(opt2);
									 }
									 if ( opt3 != '' && opt3 != undefined ) {
										 optno3  = $scope.getOptItemNo(opt3);
									 }
									 if ( opt4 != '' && opt4 != undefined ) {
										 optno4  = $scope.getOptItemNo(opt4);
									 }

									 alert(invMgmtYn);*/
									 // 바로 주문에 필요한 레이어 데이터 json 으로 만든다
									 var optValCd = $scope.getMakeOptValCd();
									 var optcnt = optnum+1;
									 var leyerRenderData = [];
									$("#opt_value"+optcnt).empty();
									$("#opt_value"+optcnt).append("<option value=''>선택하세요</option>");
									//for(var itemList in optItemList){
									for(var i = 0; i <optNextItemList.length; i++){
										var itemList = optNextItemList[i];
										var opt_stk_yn = "";
										var opt_cnt = "";
										var itemDtlStkInfo = $scope.getItemDtlStkInfo(optValCd + " x " + itemList.item_no );

										if (itemDtlStkInfo.opt_stk_yn == 'Y' || itemDtlStkInfo.inv_qty == '0'){
											$("#opt_value"+optcnt).append("<option value =\"" + itemList.opt_value + "^"+itemList.item_no+ "^"+itemDtlStkInfo.opt_stk_yn+ "^"+itemDtlStkInfo.inv_qty + "\" disabled>(품절) "+ itemList.opt_value +" </option>");
													leyerRenderData.push( { disabled : "disabled", value : "(품절) "+ itemList.opt_value} );
										} else {
											$("#opt_value"+optcnt).append("<option value =\"" + itemList.opt_value + "^"+itemList.item_no+ "^"+itemDtlStkInfo.opt_stk_yn+ "^"+itemDtlStkInfo.inv_qty + "\">"
																	+ itemList.opt_value +" </option>");
													leyerRenderData.push( { disabled : "", value : itemList.opt_value } );
										}

									}
									//$("#opt_value"+optcnt).attr('selectedIndex','0');
									$("#opt_value"+optcnt+" option:first").attr('selected',true);
									$compile($("#opt_value"+optcnt))($scope);
									// 바로 주문 레이어 렌더
									$scope.setLayerOptionRender( leyerRenderData, optnum+1 );


									// 옵션 그리는 로직
									 /*$.ajax({
										 type: 'get'
										 , async: false
										 , url: '/product/m/product_option_change.do'
										 , data: 'goodsno=${param.goods_no}&optcnt=' + optcount + '&optnum=' + optnum
											 + '&opt1=' + optno1 + '&opt2=' + optno2 + '&opt3=' + optno3 + '&opt4=' + optno4 +'&invMgmtYn='+invMgmtYn
											 + '&<%=commonParam %>'
										 , success: function(response) {
											 $("div#script").html(response);
										 }
									 });*/
								}
								else {
									this.setOption(optnum, obj);
											// 하위 옵션을 초기화 한다.
									for(i=optnum+1; i<optcount+1; i++) {
										$("#opt_value"+i+" option:first").attr('selected',true);
										$('div.option_list_layer').find('.s_box01').eq(i).find('.tl a').text( '선택하세요' );
									}
								}

									// 바로주문 레이어 값 변경
								if ( $scope.initOptValue(optval)[0] == '' ) {
									$('div.option_list_layer').find('.s_box01').eq(optnum-1).find('.tl a').text( '선택하세요' );
								}
								else {
										$('div.option_list_layer').find('.s_box01').eq(optnum-1).find('.tl a').text( $scope.initOptValue(optval)[0] );
								}
								return false;
							};

							//옵션 초기화
							var setOption = function (optnum, obj){
								var empty_str = "<option value=''>선택하세요</option>";
								var html_str = empty_str;
								var nxt_opt = parseInt(optnum) + 1;
								var opt = "";
								var opt_val;

								for( var i=1 ; i <= optnum ; i++ ){
									opt_val = $("#frm_input select[name=opt_value"+i+"]").val().split("^");

										opt+=(opt==""?"":"x")+opt_val[1];
								}

								var option_item_arr = $("input[name=option_item]:hidden");
								var opt_str_len = opt.length;
								var opt_id = "";
								var opt_arr;
								var leyerRenderData = [];
								for(var i=0; i<option_item_arr.length; i++){
									opt_id = option_item_arr[i].id
									opt_arr = opt_id.split("x");

									if (nxt_opt==opt_arr.length && opt_str_len < opt_id.length && opt == opt_id.substring(0, opt_str_len)){

										html_str += option_item_arr[i].value;

										var value = option_item_arr[i].value.replace(/(<([^>]+)>)/ig, "");
										leyerRenderData.push( { disabled : ( value.indexOf("품절") != -1 ? "disabled" : "" ) , value : value  } );
									}
								}

								$("#frm_input select[name=opt_value"+nxt_opt+"]").html(html_str);

								$scope.setLayerOptionRender( leyerRenderData , nxt_opt )

							};

							// 바로주문 레이어 옵션 랜더링
							$scope.setLayerOptionRender = function ( data, optNum ){
								var el = "";
								$(data).each(function( idx , item ){
									if( item.disabled != "" )
										el += '<li><a href="#go" disabled>' + item.value + '</a></li>';
									else
										el += '<li><a href="#go1" ng-click="setLayerOrderQty('+ optNum + ', '+(idx+1)+');">' + item.value + '</a></li>';
								});

								$( '#option_select_layer_' + optNum + ' .option_select ul' ).html( el );

								$compile($( '#option_select_layer_' + optNum + ' .option_select ul' ))($scope);
								//$compile($( '#option_select_layer_' + optNum + ' .option_select ul' ).html())($scope);
								$('div.option_list_layer').find('.s_box01').eq(optNum).find('.tl a').text( '선택하세요' );
							};

							$scope.$on('ngRepeatFinished',function(ngFinishedEvent){
							});

							//상품구매 레이어 Check
							$scope.openOptionCheckYn = false; //바로주문 사용여부
							$scope.wishCheckYn = true; //위시리스트 버튼이 보이는 여부
							$scope.openOptionCheck = function (strLink){
								var $opLayer = angular.element('.detail_option_layer'),
								$optionBtn = angular.element('.detail_option_layer > .layer_head > a'),
								$opSelect = angular.element('div.option_select_layer'),
								$opLayerList = angular.element('.option_list_layer'),
								$selBtn = $opLayerList.find('div.tl'),
								$selectBtn = $opSelect.find('.layer_head > a'),
								$list = $opSelect.find('div.option_select > a');

								if($scope.openOptionCheckYn){
									if ( "imallBuy" == strLink) {
										$scope.buy('imall');
									} else if ( "imallCart" == strLink ) {
										$scope.cartAdd('imall');
									} else if ( "buy" == strLink ) {
										$scope.buy('buy');
									} else if ( "reserve" == strLink ) {
										$scope.buy('reserve');
									} else if ( "cart" == strLink ) {
										$scope.cartAdd();
									} else if ( "smart" == strLink ) {
										$scope.buy('smart');
									} else if ( "wish" == strLink ) {
										$scope.wishListAdd()
									}
								}else{
									$opLayer.css("bottom","50px"); //바로주문 열기
									$scope.openOptionCheckYn = true;
                                    //위시를 누르면 그냥 보이도록 유지
                                    $scope.wishCheckYn = false;
                                    if("wish" == strLink){
                                        $scope.wishCheckYn = true;
                                    }
								}
								$selBtn.click(function(){ //옵션 셀렉트레이어 열기
										$(this).parent().parent().find("div.option_select_layer").addClass("act").css("bottom","50px");
									});
								$selectBtn.click(function(){ //옵션 셀렉트레이어 닫기
									$(this).parent().parent().removeClass("act").css("bottom", "-500px");
								});
							};
							//20160127 바로주문 닫기
                            $scope.closeOpt = function(){
                                angular.element('.detail_option_layer').css("bottom", -500 );
                                $scope.openOptionCheckYn = false;
                                $scope.wishCheckYn = true;
                            }

							//상품구매 레이어 Check
							$scope.wishListAdd = function () {
								console.log('wishListAdd : called');
								var qty = $("#frm_send input[name=order_qty]:hidden").val();

								var optcount  = $("#frm_input select[name^=opt_value]").length; // 옵션갯수
								for (var i=1; i<=optcount; i++){
									if( $scope.isSoldout($("#frm_input select[name=opt_value"+i+"]").val()) ){
										 alert("선택하신 제품은 품절되었습니다.");
										 return;
									}
								}

								if (qty < 1){
									alert('주문수량을 선택해 주세요.');
									return;
								}

								if($scope.BasicData.product.smpExgYn == "Y"){
									var smartpickdate =  $("select[name=smartpickdate] option:selected").val();
									var sptoday = $("input[name=sptoday]:hidden").val();
									var now = new Date();
									var dd = now.getDate();
									var mm = now.getMonth();
									var yyyy = now.getFullYear();
									var today   = yyyy+(mm+1)+dd;
									var hour = now.getHours();
									if(hour < 10) {
										hour = "0" + hour;
									}

									if ( smartpickdate == today ) {
										if ( sptoday == 'Y' && hour > 10) {
											alert('당일 주문 가능한 시간이 지났습니다.\n다른 일자를 선택해 주세요.');
											return;
										}
									}

									if ( $.trim(smartpickdate) == '' ) {
										alert('픽업예정일을 선택해 주세요.');
										return;
									}
								}
								if (!$scope.loginInfo.isLogin){
									//$scope.loginProc('Y');
									Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
									return false;
								}

								$http.get(LotteCommon.wishWishInsData, {params:{
									goods_no: $scope.BasicData.goods_no,
									goods_cmps_cd: $scope.BasicData.product.goods_cmps_cd,
									goods_choc_desc: $("#frm_send input[name=goodsChocDesc]:hidden").val(),
									ord_qty: "1",
									item_no: $("#frm_send input[name=itemno]:hidden").val(),
									dno: $scope.reqParam.curDispNo,
									mc: "",
									smp_vst_shop_no: $("#frm_send input[name=smpVstShopNo]:hidden").val(),
									smp_vst_rsv_dtime: $("#frm_send input[name=smartpickdate]:hidden").val(),
									conr_no: "0",
									smp_tp_cd : $scope.BasicData.product.smp_tp_cd,
									smp_deli_loc_sn : $scope.smp_deli_loc_sn
								}})
								.success(function(data) {
									 //   $scope.BasicData = data.max; //상품기본정보 로드
									 //   var data = data;
									 // data = data.replace(/^\s*/,'');
									 // data = data.replace(/\s*$/,'');
									 // if(data == "0"){
												alert("저장되었습니다.");
									 //     $('#wishAdd').addClass('off');
									 // }else if(data == "2"){
									 //     alert("이미 담은 상품입니다.");
									 // }else if(data == "-1"){
									 //     alert("서버 오류로 인해 처리되지 않았습니다.");
									 // }else if(data == "-2"){
									 //     alert("로그인이 필요한 서비스입니다.");
									 //     goLogin();
									 //     return false;
									 // }else{
									 //     alert("프로그램 오류로 인해 처리되지 않았습니다.("+data+")" );
									 // }

								})
								.error(function(ex) {
									if (ex.error.response_code == '1001'){
										alert("이미 담은 상품입니다.");
									} else if (ex.error.response_code == '9004'){
										alert("로그인이 필요한 서비스입니다.");
										//$scope.loginProc('N');
										Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
									} else {
										alert("프로그램 오류로 인해 처리되지 않았습니다." );
									}
								});
							};

							//장바구니 담기
							$scope.cartAdd = function(imall){
								var checkResult = $scope.cartCheckResult();
								if (checkResult != ""){
									alert(checkResult);
									return;
								}
									/** 홈쇼핑 상품인경우 - 연동에 의해 장바구니 담기가 결정됨 */
								if(imall&&imall=='imall'){
									$scope.imall_prod_chk('cart', $("#frm_send input[name=itemno]:hidden").val()); // 아이몰 재고수량 체크
								} else {
									$scope.cartAddProc();
								}
							};
							//cartAdd end

							//cartAdd common
							$scope.cartAddProc = function (){
								$http.get(LotteCommon.cartCartInsData, {params:{
									goods_no: $scope.BasicData.goods_no,
									item_no: $("#frm_send input[name=itemno]:hidden").val(),
									goods_cmps_cd: $scope.BasicData.product.goods_cmps_cd,
									goods_choc_desc: $("#frm_send input[name=goodsChocDesc]:hidden").val(),
									ord_qty: $("#frm_send input[name=order_qty]:hidden").val(),
									infw_disp_no: $scope.reqParam.curDispNo,
									infw_disp_no_sct_cd : $scope.BasicData.disp_no_sct_cd,
									master_goods_yn: $scope.BasicData.product.master_goods_yn,
									cart_sn: "",
									cart_no: "",
									cmps_qty: "0",
									mast_disp_no: $scope.BasicData.product.mast_disp_no,
									smp_tp_cd : $scope.BasicData.product.smp_tp_cd,
									smp_deli_loc_sn : $scope.smp_deli_loc_sn
								}})
								.success(function(data) {
									$scope.alidoCollectLog('gucciPrdCartAdd', $scope.BasicData); // ALIDO 수집스크립트 호출(장바구니 담기)

									if (!confirm("장바구니에 상품이 담겼습니다. \n장바구니로 이동하시겠습니까?")){
												return;
										}
										//장바구니로 이동시 탭셋팅값
										var type = "normal";
										if ($scope.BasicData.product.entr_no == '13145'){
											type = "imall";
										} else if ($scope.BasicData.product.entr_no == '443808'){
											type = "manggo";
										} else if ($scope.BasicData.product.entr_contr_no == '226680'){
											type = "book";
										}
										var tclickcd = Fnproductview.getTclickCd($scope.BasicData.elotte_yn,"cart");
										$window.location.href = LotteCommon.cateLstUrl + "?type="+type + "&" + $scope.baseParam;
										//location.href = "defaultDomain/mylotte/cart/cart_list.do?commonParam&tclick=prod_tclick_cart&type="+type;

										try {
											angular.element($window).trigger("refreshCartCount");
										} catch (e) {}
								})
								.error(function(ex) {
									if (ex.error.response_code == 'M000200'){
										alert(ex.error.response_msg);
									}else if (ex.error.response_code == '9004'){
										alert(ex.error.response_msg);
										// $scope.loginProc('N');
										Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl);
									} else {
										alert("프로그램 오류로 인해 처리되지 않았습니다." );
										console.log('[Error]Cart Save Fail', ex.error.response_msg);
									}
								});
							};
							//cartAdd common end
							//
							//cart and buy option check
							$scope.cartCheckResult = function(){
								var checkResult = "";
								var qty = $("#frm_send input[name=order_qty]:hidden").val();
								var opt_name1   = $("#frm_input input[name=opt_name1]").val();
								var opt_name2   = $("#frm_input input[name=opt_name2]").val();
								var  opt_name3   = $("#frm_input input[name=opt_name3]").val();
								var  opt_name4   = $("#frm_input input[name=opt_name4]").val();
								var  opt_name5   = $("#frm_input input[name=opt_name5]").val();

								var  opt_value1  = $("#frm_input select[name=opt_value1]").val();
								var  opt_value2  = $("#frm_input select[name=opt_value2]").val();
								var  opt_value3  = $("#frm_input select[name=opt_value3]").val();
								var  opt_value4  = $("#frm_input select[name=opt_value4]").val();
								var  opt_value5  = $("#frm_input select[name=opt_value5]").val();
								var checkGoodsChocDesc = $scope.setGoodsChocDesc();
								if ( $.trim(opt_name1) != '' && $.trim(opt_value1) == '' ) {
									checkResult = opt_name1 + '을(를) 선택해주세요.';
										return checkResult;
								} else if ( $.trim(opt_name2) != '' && $.trim(opt_value2) == '' ) {
									checkResult = opt_name2 + '을(를) 선택해주세요.';
										return checkResult;
								} else if ( $.trim(opt_name3) != '' && $.trim(opt_value3) == '' ) {
									checkResult = opt_name3 + '을(를) 선택해주세요.';
										return checkResult;
								} else if ( $.trim(opt_name4) != '' && $.trim(opt_value4) == '' ) {
									checkResult = opt_name4 + '을(를) 선택해주세요.';
										return checkResult;
								} else if ( $.trim(opt_name5) != '' && $.trim(opt_value5) == '' ) {
									checkResult = opt_name5 + '을(를) 선택해주세요.';
										return checkResult;
								} else if (checkGoodsChocDesc != "" ){
										return checkGoodsChocDesc;
								}

								var optcount  = $("#frm_input select[name^=opt_value]").length;
								for (var i=1; i<=optcount; i++){
									if( $scope.isSoldout($("#frm_input select[name=opt_value"+i+"]").val()) ){
										checkResult = "선택하신 제품은 품절되었습니다.";
										 return checkResult;
									}
								}

								if (qty < 1){
									checkResult = '주문수량을 선택해 주세요.';
									return checkResult;
								}
								$("#frm_send input[name=qty]:hidden").val( qty );

								$("#frm_send input[name=opt_name1]:hidden").val( opt_name1 );
								$("#frm_send input[name=opt_name2]:hidden").val( opt_name2 );
								$("#frm_send input[name=opt_name3]:hidden").val( opt_name3 );
								$("#frm_send input[name=opt_name4]:hidden").val( opt_name4 );
								$("#frm_send input[name=opt_name5]:hidden").val( opt_name5 );

								$("#frm_send input[name=opt_value1]:hidden").val( opt_value1 );
								$("#frm_send input[name=opt_value2]:hidden").val( opt_value2 );
								$("#frm_send input[name=opt_value3]:hidden").val( opt_value3 );
								$("#frm_send input[name=opt_value4]:hidden").val( opt_value4 );
								$("#frm_send input[name=opt_value5]:hidden").val( opt_value5 );
								return checkResult;
							};

							//바로구매, 예약구매, 스마트픽구매
							$scope.buy = function (buy){
								var loginCheck = $scope.BasicData.login_check;
								var dlvGoodsSctCd = $scope.BasicData.product.dlv_goods_sct_cd;
								var orderYn = $scope.BasicData.order_yn;
								var deliveryInfo = $scope.BasicData.product.delivery_info;
								var delivery = deliveryInfo.replace("순차적", "주문순서대로");
								var checkResult = $scope.cartCheckResult();
								if (checkResult != ""){
									alert(checkResult);
									return;
								}
								if(orderYn == 'N'){
									alert("롯데닷컴 정회원만 주문/결제가 가능합니다. 정회원 신청은 롯데닷컴 웹사이트를 이용해 주세요.");
									return;
								}

								if (!$scope.loginInfo.isLogin) {  //로그인 안한 경우
										//alert("로그인이 필요한 서비스입니다.");
										//Fnproductview.goToLogin($window,$scope,LotteCommon.loginUrl + '?fromPg=1');
										//Fnproductview.goToLogin2($window,$scope,LotteCommon.loginUrl);
										var frm_send = el.find("#frm_send");
										var goUrl = LotteCommon.loginUrl + "?"+$scope.baseParam+"&fromPg="+LOTTE_CONSTANTS['ONENONE_BUY_LOGIN']+"&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8');
										frm_send.attr("action", goUrl);
										LotteForm.FormSubmit(frm_send);
										return;
								}


                                    //loginCheck != '1'){  - 20161227
								if (buy!="smart" && !$scope.loginInfo.isLogin){
									if(dlvGoodsSctCd == '03')
										alert("본 상품은 주문제작상품으로서 고객님의 주문을 확인한 후 제작에 착수합니다. 실제 상품제작 7일~12일 소요(토,일,공휴일제외) 배송정보를 꼭 확인해 주세요.");
									if(buy == 'imall') {     //홈쇼핑 상품
										$scope.imall_prod_chk('buylogin', $("#frm_send input[name=itemno]:hidden").val());
									}else{
										$("#frm_send").attr("action", M_HOST_SSL + "/login/loginForm.do?"+$scope.baseParam+"&fromPg=" + LOTTE_CONSTANTS["ONENONE_BUY_LOGIN"] +"&minority_yn="+$scope.BasicData.minority_limit_yn +"&smp_buy_yn="+(buy=='smart'?'Y':'N')+"&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8'));
										$("#frm_send").submit();
									}
								} else if (buy == 'imall'){
										$scope.imall_prod_chk('buy', $("#frm_send input[name=itemno]:hidden").val());
								} else {
										if ('${product.lgf_tgt_yn }' == 'Y'){ // LG 패션 재고 관리
											$scope.lgFashionStockMng(buy, dlvGoodsSctCd, delivery);
										}else{
											$scope.dotcom_buy(buy, dlvGoodsSctCd, delivery);
										}
								}
							};
							//$scope.buy end

							//입력형 상품 체크 및 파라메터 생성
							$scope.setGoodsChocDesc = function (){
								var checkResult = "";
								if ($("input[name=opt_input_name]") == "undefiend") { return true; } // 입력형이 없을 경우

								var goodsChocDesc = "";
								var opt_len = $("input[name=opt_input_name]").length;
								var opt_name = "";
								var opt_type = "";
								var opt_value= "";

								for (var i = 0 ; i < opt_len ; i++){
									opt_type = $("#frm_input input[name=opt_input_type]:eq("+i+")").val();
									opt_name = $("#frm_input input[name=opt_input_name]:eq("+i+")").val();
									opt_value= $("#frm_input input[name=opt_input_value]:eq("+i+")").val();
									if ( opt_name != '' && opt_value == '' ) {
										checkResult = opt_name + '을(를) 입력해주세요.';
												return checkResult;
										}

										opt_value = opt_value.replace(/-/gi, "");

									if (i > 0) { goodsChocDesc += SPLIT_GUBUN_3; } // SPLIT_GUBUN_3-> angular_common_..jsp

									goodsChocDesc += opt_type;
									goodsChocDesc += ":"+opt_name;
									goodsChocDesc += ":"+opt_value;
								}

								$("#frm_send input[name=goodsChocDesc]:hidden").val( goodsChocDesc );

								return checkResult;
							};
							//setGoodsChocDesc end

							// 아이몰 재고 체크
							$scope.imall_prod_chk = function (gubun, opt_value){
								$http.get(LotteCommon.productImallStockCheckData, {params:{
									ord_qty : $("#frm_send input[name=order_qty]:hidden").val(),
										goods_no : $scope.BasicData.goods_no,
										item_no : opt_value
									}})
										.success(function(data) {
											if (gubun == "buy") {
												if(data.gift_goods_nos != "" ) {
										$('#frm_send input[name=gift_goods_no]:hidden').val(data.gift_goods_nos);
										$('#frm_send input[name=girtGoodsChoice]:hidden').val('Y');
									}
												$("#frm_send").attr("action", LOTTE_CONSTANTS['M_HOST_SSL'] + "/order/m/order_form.do?"+$scope.reqParamStr+"&mastDispNo="+$scope.BasicData.product.mast_disp_no + "&tclick=m_o_buynow");
													$("#frm_send").submit();
											} else if (gubun == "buylogin"){
												$("#frm_send").attr("action", LOTTE_CONSTANTS['M_HOST_SSL'] + "/login/loginForm.do?"+$scope.baseParam+"&fromPg="+IMALL_BUY_LOGIN+"&minority_yn="+$scope.BasicData.minority_limit_yn +"&smp_buy_yn="+(buy=='smart'?'Y':'N')+"&targetUrl=" + encodeURIComponent(window.location.href,'UTF-8'));
											$("#frm_send").submit();
											} else if (gubun == "cart"){
												$scope.cartAddProc();
											}
										})
										.error(function(ex) {
											if (ex.error.response_code == '1000'){
												alert(ex.error.response_msg);
											location.reload();
											} else {
												alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
											}
										});
							};
							//imall_prod_chk end

							//LG패션 재고 관리
							$scope.lgFashionStockMng = function (buy, dlvGoodsSctCd, delivery){

								var item_no = $("#frm_send input[name=itemno]:hidden").val();
								var ord_qty = $("#frm_send input[name=order_qty]:hidden").val();

								$http.get(LotteCommon.productLgStockCheckData, {params:{
									ord_qty : $("#frm_send input[name=order_qty]:hidden").val(),
										goods_no : $scope.BasicData.goods_no,
										item_no : opt_value,
										entr_no : $scope.BasicData.product.entr_no
									}})
										.success(function(data) {
											$scope.dotcom_buy(buy, dlvGoodsSctCd, delivery);
										})
										.error(function(ex) {
											if (ex.error.response_code == '1000'){
												alert(ex.error.response_msg);
											} else {
												alert("죄송합니다. 잠시 후 다시 이용해 주세요.");
											}
										});

										 /*$.ajax({
											 type: 'post'
											 , async: false
											 , url: '/popup/lg_fashion_stock_mng.do?'+$scope.baseParam
											 , data: 'goods_no='+$scope.BasicData.goods_no+'&item_no='+item_no+'&entr_no='+$scope.BasicData.product.entr_no +'&ord_qty='+ord_qty
											 , success: function(response) {
												 if(response!=""){
													 alert(response);
													 return;
												 }else{
													 $scope.dotcom_buy(buy, dlvGoodsSctCd, delivery);
												 }
											 }
										 });*/
							};
							//lgFashionStockMng end

							//공통 주문처리 코드
							$scope.dotcom_buy = function (buy, dlvGoodsSctCd, delivery){
								if(buy == 'buy'){
											if(dlvGoodsSctCd == '03')alert("본 상품은 주문제작상품으로서 고객님의 주문을 확인한 후 제작에 착수합니다. 실제 상품제작 7일~12일 소요(토,일,공휴일제외) 배송정보를 꼭 확인해 주세요.");
											var tclickcd = Fnproductview.getTclickCd($scope.BasicData.elotte_yn,"directorder");
											$("#frm_send").attr("action", LOTTE_CONSTANTS['M_HOST_SSL'] + "/order/m/order_form.do?"+$scope.reqParamStr+"&mastDispNo="+$scope.BasicData.product.mast_disp_no+"&tclick="+tclickcd);

									} else if (buy == 'smart'){

										 $("#frm_send").attr("action", LOTTE_CONSTANTS['M_HOST_MOBILE'] + "/product/m/product_visit_date.do?"+$scope.reqParamStr+"&mastDispNo="+$scope.BasicData.product.mast_disp_no + ($scope.BasicData.spick_app_yn=='Y' ? "&spick_app_yn="+$scope.BasicData.spick_app_yn :"" ));
										 $("#frm_send input[name=smartOrd]:hidden").val("Y");

									} else if (buy == 'reserve'){
											if ( dlvGoodsSctCd == '03' ) {
													alert("본 상품은 주문제작상품으로서 고객님의 주문을 확인한 후 제작에 착수합니다. 실제 상품제작 7일~12일 소요(토,일,공휴일제외) 배송정보를 꼭 확인해 주세요.");
											}
											if(confirm("본 상품은 예약상품이므로 " + delivery + "됩니다. 배송일자를 미리 확인하시기 바랍니다.")){
													$("#frm_send").attr("action", LOTTE_CONSTANTS['M_HOST_SSL'] +"/order/m/order_form.do?"+$scope.reqParamStr+"&mastDispNo=" + $scope.BasicData.product.mast_disp_no);
											}else{
													return ;
											}
									}

									$("#frm_send").submit();
							};
							//dotcom_buy end
						}
				};
		}]);

		//Directive :: 상품주문관련 Form 정보
		app.directive('productFormInfo', ['$window', '$location', function($window, $location) {
				return {
					templateUrl:'/lotte/resources_dev/product/m/productFormInfo.html',
						replace:true,
						link:function($scope, el, attrs) {
						console.log('productFormInfo', 'called');

						}
				};
		}]);

})(window, window.angular);
