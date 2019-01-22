(function(window, angular, undefined) {
	'use strict';
	
	var specMallCateModule = angular.module('specMallCate', [
		'lotteComm',
		'lotteNgSwipe'
	]);

	specMallCateModule.controller('SpecMallCateCtrl', ["$scope", function($scope){}]);
	
	specMallCateModule.directive('specMallCate',
			['LotteCommon', '$window', '$timeout', '$interval', '$http', 'LotteStorage', 'commInitData',
			function(LotteCommon, $window, $timeout, $interval, $http, LotteStorage, commInitData){
        return {
			templateUrl : '/lotte/resources_dev/mall/spec_mall_cate.html',
			replace : true,
			link : function($scope, el, attrs){
				
				//test data
				//$scope.testCate = '/json/mall/getKshopCtgListNewJson_5617246.json';

				$scope.smcCateType = attrs.type;//main | sub
				$scope.smcCateList = [];
				$scope.smcCateArrowRight = false;
				$scope.smcCateArrowLeft = false;
				$scope.smcCateWidth = Math.round($(window).width() / 4.5);
				if($(window).width() >= 768){
					$scope.smcCateWidth = 100;
				}
				
				var intervalID;
				var sessionKey = "smc_" + $scope.kShopUI.dispNo + "_" + (new Date()).getHours();
				
				
				// main
				$scope.smcListType = "";
				$scope.smcListMore = false;
				$scope.list_type = "";
				// sub
				$scope.smcSubIndicator = [];
				$scope.smcSubNaviList = {
					list:[],
					depth:-1,
					visible:false,
					currentDepth:""
				};
				$scope.smcSubNaviVisible = false;
				
				// 20180607 마이클코어스 setting
				$scope.mainSubCateNo = -1; // 선택된 중카 index
				$scope.subShow = false; // 소카 영역 노출

               $scope.setCateType = function(){
                    // 20180607 마이클코어스 카테고리 분기 (기존 타입에 depth 타입 추가)
                    $scope.smcListType = ($scope.kShopUI.type == 'mk_template' && $scope.smcCateType == "main") ? "depth" : $scope.list_type;						
                    if($scope.kShopUI.type == 'mk_template'){
                        angular.element("#head_sub").css({"border-bottom":"#fff","height":"46px"});
                    }                    
                }                
				/**
				 * 디렉티브 초기화
				 */
				function startOver(){
					var ss = LotteStorage.getSessionStorage(sessionKey, "json");
					if(location.host == "localhost:3392" || location.host == "localhost:3001"){
						ss = null;
					}
					if(ss != null){
						//console.warn("SESSION");
						loadCateSuccess(ss);
						return;
					}
					
					loadCategory();
				};
				
				/**
				 * 카테고리 데이터 로드
				 */
				function loadCategory(){
					//var url = ($scope.testCate != '' && $scope.testCate != undefined) ? $scope.testCate : LotteCommon.specMall2017Cate;
					var url = LotteCommon.specMall2017Cate;
					$http.get(url, {
						params: { dispNo:$scope.kShopUI.dispNo }
					})
					.success(function(data){
						if(data == undefined && data.kshopCtg == undefined){ return; }
						
						//console.warn("DATA LOAD");
						loadCateSuccess(data.kshopCtg);
						
						LotteStorage.setSessionStorage(sessionKey, data.kshopCtg, "json");
					});
				};
               
				/**
				 * 카테고리 데이터 로드 성공
				 */
				function loadCateSuccess(data){
					if(data.disp_nm != undefined){
						$scope.$parent.subTitle = data.disp_nm;
						$scope.subTitle = data.disp_nm;
					}
					if(data.ctgs == undefined){ return; }
					var ctg;
					$scope.list_type = "icon";
					var len = data.ctgs.length;

					for(var i=0; i<len; i++){
						ctg = data.ctgs[i];
						if(ctg.img_url == undefined || ctg.img_url == ""){
							$scope.list_type = "list";
							break;
						}
					}
			        /*
					$timeout(function(){
						// 20180607 마이클코어스 카테고리 분기 (기존 타입에 depth 타입 추가)
						$scope.smcListType = ($scope.kShopUI.type == 'mk_template' && $scope.smcCateType == "main") ? "depth" : type;						
						if($scope.kShopUI.type == 'mk_template'){
							angular.element("#head_sub").css({"border-bottom":"#fff","height":"46px"});
						}
					}, 100);
                    */
					$scope.smcCateList = data.ctgs;
					smcInitNavigator();
					
					/*$timeout(function(){
						if($scope.smcCateType == "main" && type == "icon"){
							// 메인이고 아이콘인 경우
							var wrap = angular.element(".smcCateMain .smcIconType");
							var cont = wrap.find("ul");
							var diff = wrap.width() - cont.width();
							var mat, tx;
							intervalID = $interval(function(){
								if(diff >= 0){
									$interval.cancel(intervalID);
									$scope.smcCateArrowRight = false;
									$scope.smcCateArrowLeft = false;
									return;
								}
								
								mat = cont.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
								if(mat == undefined || mat.length <= 1){
									$scope.smcCateArrowRight = true;
									$scope.smcCateArrowLeft = false;
									return;
								}
								tx = mat[12] || mat[4];
								$scope.smcCateArrowRight = tx > diff;
								$scope.smcCateArrowLeft = tx < 0;
							}, 200);
						}
					}, 100);*/
				};
				
				
				/**
				 * 리스트 더보기
				 */
				$scope.smcCateListShowMore = function(){
					$scope.smcListMore = true;
				};
				
				
				/**
				 * 전문몰 서브 링크 구하기
				 */
				$scope.smcGetSubUrl1 = function(cate){
					var path = LotteCommon.specialSubUrl;
					path += "?dispNo=" + $scope.kShopUI.dispNo;
					path += "&cate1=" + cate.ctg_no;
					try{
						path += "&cate2=" + cate.sctgs[0].ctg_no;
					}catch(e){}
					if($scope.kShopUI.type == "mk_template" && cate.sctgs[0]){ // 마이클코어스 서브카테고리 티클릭 추가
						path += "&tclick=m_DC_SpeMall_MK_Sub_" + (cate.sctgs[0].ctg_no) ?  cate.sctgs[0].ctg_no : cate.ctg_no;
					}
					return path;
				};
				
				
				/**
				 * curDispNo로 카테고리 찾기
				 */
				function smcGetCurrentCate(cd){
					var i, k, m, len, klen, mlen;
					var c1, c2, c3;
					var obj = {};

					len = $scope.smcCateList.length;
					for(i=0; i<len; i++){
						c1 = $scope.smcCateList[i];
						if(c1.ctg_no == cd){
							obj.cate1 = c1.ctg_no;
						}
						
						klen = c1.sctgs.length;
						for(k=0; k<klen; k++){
							c2 = c1.sctgs[k];
							if(c2.ctg_no == cd){
								obj.cate1 = c1.ctg_no;
								obj.cate2 = c2.ctg_no;
							}
							
							mlen = c2.ssctgs.length;
							for(m=0; m<mlen; m++){
								c3 = c2.ssctgs[m];
								if(c3.ctg_no == cd){
									obj.cate1 = c1.ctg_no;
									obj.cate2 = c2.ctg_no;
									obj.cate3 = c3.ctg_no;
								}
							}
						}
					}
					
					return obj;
				};
				
				/**
				 * 서브 네비게이터 초기화
				 */
				function smcInitNavigator(){
					if($scope.smcCateType != "sub"){ return; }
					
					var cd = commInitData.query.curDispNo;
					var c1 = commInitData.query.cate1;
					var c2 = commInitData.query.cate2;
					var c3 = commInitData.query.cate3;
					var ls = commInitData.query.linksub;
					var ctg1, ctg2, ctg3;
					
					
					if(c1 == undefined && cd != undefined){
						var obj = smcGetCurrentCate(cd);
						c1 = obj.cate1;
						c2 = obj.cate2;
						c3 = obj.cate3;
					}
					
					
					//1 depth
					var ctg = smcMatchCate(c1, $scope.smcCateList);
					if(ctg != null){
						ctg1 = ctg;
						$scope.smcSubIndicator.push(ctg);
						
						//2 depth
						ctg = smcMatchCate(c2, ctg.sctgs);
						if(ctg != null){
							ctg2 = ctg;
							$scope.smcSubIndicator.push(ctg);
							
							//3 depth
							ctg = smcMatchCate(c3, ctg.ssctgs);
							if(ctg != null){
								ctg3 = ctg;
								$scope.smcSubIndicator.push(ctg);
							}
						}
					}
					
					
					var allAdded = false;
					// 전체 추가하기
					switch($scope.smcSubIndicator.length){
					/*case 1:
						if(ctg1 != undefined && ctg1.sctgs != undefined && ctg1.sctgs.length > 0){
							$scope.smcSubIndicator.push({name:"전체",ctg_no:0});
						}
						break;*/
					case 2:
						if(ctg2 != undefined && ctg2.ssctgs != undefined && ctg2.ssctgs.length > 0){
							$scope.smcSubIndicator.push({name:"전체보기",ctg_no:0});
							allAdded = true;
						}
						break;
					// no default
					}
					
					if(ls !== "1" && allAdded){
						$scope.smcSubNaviList.currentDepth = $scope.smcSubIndicator.length - 2;
					}else{
						$scope.smcSubNaviList.currentDepth = $scope.smcSubIndicator.length - 1;
					}
					
					$timeout(function(){
						if(ls === "1"){
							// 서브에서 진입
							angular.element(".smcNavigator .navi:last-child a").trigger("click");
						}else{
							// 메인에서 진입
							var last = angular.element(".smcNavigator .navi:last-child");
							if(last.find("a span").text() == "전체보기" && last.index() > 0){
								last.prev().find("a").trigger("click");
							}else{
								last.find("a").trigger("click");
							}
						}
					}, 0);
				};
				
				/**
				 * URL 파람과 일치하는 카테고리 선택하기
				 */
				function smcMatchCate(no, list){
					if(no == undefined || no == "" || list == undefined || list.length == 0){ return null; }
					
					var ctg;
					var len = list.length;
					for(var i=0; i<len; i++){
						ctg = list[i];
						if(ctg.ctg_no == no){
							return ctg;
						}
					}
					
					return null;
				};
				
				/**
				 * 서브 네비 펼치기
				 */
				$scope.smcShowSubNavi = function(cate, idx){
					if($scope.smcSubNaviList.visible && $scope.smcSubNaviList.depth == idx){
						$scope.smcHideSubNavi();
						return;
					}
					
					var scate = [];
					switch(idx){
						case 0:
							scate = $scope.smcCateList;
							break;
						case 1:
							scate = $scope.smcSubIndicator[0].sctgs;
							break;
						case 2:
							scate = $scope.smcSubIndicator[1].ssctgs;
							if(scate[0].name == "전체보기"){
								scate[0].ctg_no = "";
							}else{
								scate.unshift({
									ctg_no : "",
									name : "전체보기",
									new_flag : false
								});
							}
							break;
					}
					
					var list = [];
					var arr;
					var len = scate.length;
					for(var i=0; i<len; i++){
						if(i % 10 == 0){
							arr = [];
							list.push(arr);
						}
						arr.push(scate[i]);
					}
					
					$scope.smcSubNaviList.list = list;
					$scope.smcSubNaviList.depth = idx;
					$scope.smcSubNaviList.visible = true;
				};
				
				/**
				 * 서브 네비 닫기
				 */
				$scope.smcHideSubNavi = function(){
					$scope.smcSubNaviList.list.length = 0;
					$scope.smcSubNaviList.depth = -1;
					$scope.smcSubNaviList.visible = false;
				};
				
				/**
				 * 서브 네비 링크 구하기
				 */
				$scope.smcGetNaviUrl = function(cate){
					var param = {
						"dispNo"	: $scope.kShopUI.dispNo,
						"linksub"	: 1
					};
					var len = Math.min($scope.smcSubNaviList.depth + 1, $scope.smcSubIndicator.length);
					for(var i=0; i<len; i++){
						param["cate" + (i+1)] = $scope.smcSubIndicator[i].ctg_no;
					}
					param["cate" + len] = cate.ctg_no;
					if(len == 1){
						if(cate.sctgs != undefined && cate.sctgs.length > 0){
							param["cate" + (len+1)] = cate.sctgs[0].ctg_no;
						}
					}
					
					var path = LotteCommon.specialSubUrl + "?" + $.param(param);
					return path;
				};

				/* 20180607 마이클코어스 2단 카테고리 추가 영역 */

				/**
				 * 마이클코어스 서브 카테고리 열기
				 */
				$scope.subCateShow = function(idx){
					$scope.mainSubCateNo = idx; // 선택된 카테고리 idx
					angular.element("body, html").css({"height":"100%","overflow":"hidden"}); // 페이지 스크롤 막기
					$scope.subShow = true; // 서브 카테고리 show
					return false;
				}

				/**
				 * 마이클코어스 서브 카테고리 닫기
				*/
				$scope.subCateClose = function(){

					$scope.mainSubCateNo = -1 // 선택 카테고리 초기화
					angular.element("body, html").css({"height":"auto","overflow":"auto"}); // 페이지 스크롤 활성화
					$scope.subShow = false; //서브카테고리 close
					return false;
				}

				/**
				 * 마이클코어스 서브 링크 구하기
				 */
				$scope.smcGetSubUrl2 = function(cate2){
					var path = LotteCommon.specialSubUrl;

					var depthNo = $scope.smcCateList[$scope.mainSubCateNo].ctg_no;

					path += "?dispNo=" + $scope.kShopUI.dispNo;
					path += "&cate1=" + depthNo;
					try{
						path += "&cate2=" + cate2.ctg_no + "&tclick=m_DC_SpeMall_MK_Cat_" + cate2.ctg_no; 
					}catch(e){}
					return path;
				};

				/* // 20180607 마이클코어스 2단 카테고리 추가 영역 */
				startOver();
				
			}
        };
	}]);

})(window, window.angular);