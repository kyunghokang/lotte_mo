(function(window, angular, undefined) {
	'use strict';
	
	var utilModule = angular.module("lotteUtil");

	/**
	 * @ngdoc service
	 * @name lotteUtil.service:MyFeedService
	 * @description
	 * MY 추천 service
	 */
	utilModule.service('MyFeedService', ['$http', '$timeout', '$q', 'LotteCommon', '$sessionStorage', 'commInitData', 'LotteStorage', 'LotteConsole', 'LotteCookie',
								 function($http ,  $timeout ,  $q ,  LotteCommon ,  $sessionStorage ,  commInitData ,  LotteStorage ,  LotteConsole ,  LotteCookie) {
		var self = this;
		var loginInfo = {};
		var isTestParam = /*LotteCookie.getCookie('isTest') || */false; // 테스트 모드일때만 사용
		var mbr_no = "";
		var gender = "";
		var age = "";
		
		// 로그인 정보 받기
		this.setLoginInfo = function(obj){
			loginInfo = obj;
			mbr_no = (!isTestParam ? loginInfo.mbrNo : commInitData.query.mbr_no) || "";
			gender = (!isTestParam ? loginInfo.genSctCd : commInitData.query.gender) || "";
			age = (!isTestParam ? loginInfo.mbrAge : commInitData.query.age) || "A";
		};
		
		function getMbrNo(){
			return isTestParam ? '&mbr_no=' + mbr_no : ''; 
		}
		function getGender(){
			return '&gender=' + gender; 
		}
		function getAge(){
			if(age == 'A'){
				return '&age=' + age;
			}
			if(age < 20){
				return '&age=20';
			}
			if(age >= 60){
				return '&age=50';
			}
			try{
				age = Math.floor(age/10) * 10;
			}catch(e){
				age = 'A';
			}
			return '&age=' + age;
		}
		
		/**
		 * 최근본 상품
		 */
		this.loadRecentlyInit = function(latest_prod) {
			var deferred = $q.defer();
			
			var url = LotteCommon.myfeedDataUrl + '?type=P1&mode=1' + '&latest_prod=' + latest_prod + getMbrNo();
			if(LotteCommon.isTestFlag){
				url = "/json/myfeed/recently.json";
			}
			$http.get(url)
	         .success(function(data) { 
	        	 //LotteConsole.traceObj(data, 'recently init');
	        	 deferred.resolve(data);
	         })
	         .error(function(data, status, headers, config) {
	        	 console.log('recently init error ', data);
	        	 deferred.reject('recently init error');
	         });
			return deferred.promise;
		};

		/**
		 * 최근본 상품 기반 추천 게이트
		 */
		this.loadRecentlyData = function(latest_prod, hasLatelyYn) {
			var deferred = $q.defer();
			
			// 최근본 상품이 있는 경우 추천
			if(hasLatelyYn == 'Y'){
				var cnt = 0;
				var latest_prod_recomm = "";
				var spdp_no_list = "";
				self.loadRecentlyRecom(latest_prod).then(function(result){
					//LotteConsole.traceObj(result, '최근본 상품 추천 레코벨');
					latest_prod_recomm = result;
				}).catch(function(error){
					console.log('최근본 상품 추천 레코벨 error ', error);
				}).finally(function(){
					cnt++;
					if(cnt == 2){
						self.loadRecentlyPrd(latest_prod, hasLatelyYn, latest_prod_recomm, spdp_no_list).then(function(data){
							//LotteConsole.traceObj(data, '최근본 상품 추천 Prd');
							deferred.resolve(data);
						}).catch(function(error){
							console.log('최근본 상품 추천 Prd error ', error);
							deferred.reject('최근본 상품 추천 Prd 로드 실패');
						});
					}
				});

				self.loadRecentlyPlan(latest_prod).then(function(result){
					//LotteConsole.traceObj(result, '최근본 상품 추천 기획전 레코벨');
					spdp_no_list = result;
				}).catch(function(error){
					console.log('최근본 상품 추천 기획전 레코벨 error ', error);
				}).finally(function(){
					cnt++;
					if(cnt == 2){
						self.loadRecentlyPrd(latest_prod, hasLatelyYn, latest_prod_recomm, spdp_no_list).then(function(data){
							//LotteConsole.traceObj(data, '최근본 상품 추천 Prd');
							deferred.resolve(data);
						}).catch(function(error){
							console.log('최근본 상품 추천 Prd error ', error);
							deferred.reject('최근본 상품 추천 Prd 로드 실패');
						});
					}
				});
				
			}else{ //최근본 상품이 없는 경우 추천
				var url = LotteCommon.myfeedDataUrl + '?type=P1&mode=0&recobellYn=N' + getMbrNo();

				if(LotteCommon.isTestFlag){
					url = "/json/myfeed/recently.json";
				}
				$http.get(url)
					.success(function(data) { 
						//LotteConsole.traceObj(data, 'recently product');
						deferred.resolve(data);
					})
					.error(function(data, status, headers, config) {
						console.log('recently product error ', data);
						deferred.reject('recently product error');
					});
			}
			return deferred.promise;
		};

		/**
		 * 최근본 상품 기반 추천 상품들
		 */
		this.loadRecentlyPrd = function(latest_prod, hasLatelyYn, latest_prod_recomm, spdp_no_list) {
			var deferred = $q.defer();
			
			var url = LotteCommon.myfeedDataUrl + '?type=P1&mode=0&recobellYn=' + hasLatelyYn + '&latest_prod=' + latest_prod + '&latest_prod_recomm=' + latest_prod_recomm + '&spdp_no_list=' + spdp_no_list + getMbrNo();

			if(LotteCommon.isTestFlag){
				url = "/json/myfeed/recently.json";
			}
			$http.get(url)
				.success(function(data) { 
					//LotteConsole.traceObj(data, 'recently product');
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config) {
					console.log('recently product error ', data);
					deferred.reject('recently product error');
				});
			return deferred.promise;
		};
		
		/**
		 * 최근본 상품 기반 추천 (레코벨)
		 */
		this.loadRecentlyRecom = function(latest_prod) {
			var deferred = $q.defer();
			//var link1 = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/a002?size=20&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids=";
            var link1 = LotteCommon.rec_good + "&size=30&iids=";
			var latest_prod_recomm = '';
			$.ajax({
				type: 'post'
				, async: true
				, url: link1 + latest_prod
				, dataType  : "jsonp"
				, success: function(data) {
					//LotteConsole.traceObj(data, 'recently a002');
					if(data.results && data.results.length > 0){
						var arr = [];
						for(var i = 0; i<data.results.length; i++){
							arr.push(data.results[i].itemId);
						}
						latest_prod_recomm = arr.join(',');
					}
				}
				, error: function(data, status, err) {
					console.log('recently a002 error  ' + data);
				}
				, complete: function(){
					deferred.resolve(latest_prod_recomm);
				}
			});
			return deferred.promise;
		};

		/**
		 * 최근본 상품 기반 추천 기획전 (레코벨)
		 */
		this.loadRecentlyPlan = function(latest_prod) {
			var deferred = $q.defer();
			//var link2 = "http://rb-rec-api-apne1.recobell.io/rec/a101?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids=";
            var link2 = LotteCommon.rec_plan + "&size=10&iids=";
			var spdp_no_list = '';
			$.ajax({
				type: 'post'
				, async: true
				, url: link2 + latest_prod
				, dataType  : "jsonp"
				, success: function(data) {                                    
					//LotteConsole.traceObj(data, 'recently a101');
					if(data.results && data.results.length > 0){
						var arr = [];
						for(var i = 0; i<data.results.length; i++){
							arr.push(data.results[i].itemId);
						}
						spdp_no_list = arr.join(',');
					}
				}
				, error: function(data, status, err) {
					console.log('recently a101 error  ' + data);
				}
				, complete: function(){
					deferred.resolve(spdp_no_list);
				}
			});
			return deferred.promise;
		};
		
		/**
		 * 구매한 상품/장바구니에 담은 상품 기반 4.0 데이타
		 */
		this.loadOrderData = function(){
			var deferred = $q.defer();
			var url = LotteCommon.myfeedDataUrl + '?type=P2&mode=1' + getMbrNo();
			if(LotteCommon.isTestFlag){
				url = "/json/myfeed/order.json";
			}
			$http.get(url)
			.success(function(data) {	                                                    
				if(!data || !data.data || !data.data.cart_recomm_list || !data.data.cart_recomm_list.prdList
						|| !data.data.cart_recomm_list.prdList.items || data.data.cart_recomm_list.prdList.items.length == 0){
					deferred.reject('구매한 상품 데이타 로드 실패');
					return deferred.promise;
				}
				var items = data.data.cart_recomm_list;
				var goods_no = "";
				var cnt = 0;
				var sCnt = 0;
				var hasSubCnt = 0;
				//LotteConsole.traceObj(items, 'order 4.0');
				var maxLength = items.prdList.items.length > 3 ? 3 : items.prdList.items.length;
	        	for(var i = 0; i<maxLength; i++){
	        		if(items.prdList.items[i].goodsNo){
	        			cnt++;
	        			self.loadOrderRecom(items.prdList.items[i].goodsNo, i).then(function(result){
							if(result && result.data && result.data.goods_list_1 && result.data.goods_list_1.prdList
								 && result.data.goods_list_1.prdList.items && result.data.goods_list_1.prdList.items.length > 2){
								hasSubCnt++;
							}
							items.prdList.items[result.idx].subItem = result.data.goods_list_1.prdList.items || [];
							sCnt++;
							//LotteConsole.traceObj(result, 'order 추천 ' + result.idx+  ', ' + sCnt +', ' + maxLength);
	        				if(sCnt == maxLength){
								if(hasSubCnt == 0){
									items.hasSub = false;
								}else{
									items.hasSub = true;
								}
								deferred.resolve(items);
							}
	        			}).catch(function(error){
							console.log('Order 추천 error ', error);
							deferred.reject('구매한 추천 데이타 로드 실패');
						});
	        			if(cnt >= 3)	break;
	        		}
	        	}
				
			})
			.error(function() {
				console.log('Data Error : Order 4.0 실패');
				deferred.reject('구매 데이타 로드 실패');
			});
			return deferred.promise;
		};
		
		/**
		 * 구매한 상품/장바구니에 담은 상품 기반 추천 데이타
		 */
		this.loadOrderRecom = function(goods_no, index){
			var deferred = $q.defer();
			//var recLink = "http://rb-rec-api-apne1.recobell.io/rec/a005?size=10&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+goods_no;
            var recLink = LotteCommon.rec_buy + "&size=10&iids="+goods_no;
			$.ajax({
				type: 'post'
				, async: true
				, url: recLink
				, dataType  : "jsonp"
				, success: function(data) {
					if(data.results != null && data.results.length > 0){
						//LotteConsole.traceObj(data, 'order recobell');
						var str = '';
						var arr = new Array();
						
						$(data.results).each(function(i, val) {
							arr.push(val.itemId);
						});
						str = getCommaString(arr);  
						
						var url = LotteCommon.myfeedDataUrl + '?type=P3&mode=1&limit_1=6&goods_nos_1=' + str;
						if(LotteCommon.isTestFlag){
							url = "/json/myfeed/wishRecom.json";
						}
						$http.get(url)
						.success(function(data) {	
							data.idx = index;
							//LotteConsole.traceObj(data, 'order 상품');
							deferred.resolve(data);
						})
						.error(function() {
							console.log('Data Error : order 상품 데이타 로드 실패');
							deferred.reject('order 상품 데이타 로드 실패');
						});
					}else{
						deferred.reject('order recobell 로드 실패');
					}
				}
				, error: function(data, status, err) {
					console.log('Data Error : order recobell 로드 실패');
					deferred.reject('order recobell 로드 실패');
				}
			});
			
			return deferred.promise;
		};
		
		/**
		 * 카드 데이타 로드
		 */
		this.loadCardData = function(){
			var deferred = $q.defer();
			var url = LotteCommon.myfeedDataUrl + '?type=P2&mode=2' + (loginInfo.isLogin ? getMbrNo() : '');
			if(LotteCommon.isTestFlag){
				url = "/json/myfeed/card.json";
			}
			$http.get(url)
			.success(function(data) {	                                                    
				deferred.resolve(data);
			})
			.error(function() {
				console.log('Data Error : 카드 데이타 로드 실패');
				deferred.reject('카드 데이타 로드 실패');
			});
			return deferred.promise;
		};
		
		/**
		 * 재고/신상품 알림
		 */
		this.loadPushData = function(){
			var deferred = $q.defer();
			var amlist = encodeURIComponent(LotteStorage.getLocalStorage('amlist')) || '';
			var url = '/json/planshop/smart_alarm_list.json?c=mlotte&udid=&v=&cn=&cdn=&schema=&amlist=' + amlist;
			if(LotteCommon.isTestFlag){
				url = '/json/myfeed/push.json';
			}
			$http.get(url)
			.success(function(data) {	
				var pData = data; 
				if(!pData){
					deferred.reject('재고/신상품 상품 로드 실패');
					return deferred.promise;
				}
				var tempUrl = LotteCommon.myfeedDataUrl + '?type=P2&mode=3';
				if(LotteCommon.isTestFlag){
					tempUrl = "/json/myfeed/pushTitle.json";
				}
				$http.get(tempUrl)
				.success(function(data) {	     
					if(data && data.data && data.data.goods_alarm_list){
						pData.title = data.data.goods_alarm_list.txt || "";
						deferred.resolve(pData);
					}else{
						deferred.reject('재고/신상품 제목 로드 실패');
					}
				})
				.error(function() {
					console.log('Data Error : 재고/신상품 제목 로드 실패');
					deferred.reject('재고/신상품 제목 로드 실패');
				});                                           
			})
			.error(function() {
				console.log('Data Error : 재고/신상품 상품 로드 실패');
				deferred.reject('재고/신상품 상품 로드 실패');
			});
			return deferred.promise;
		};

		/**
		 * 찜한 상품 로드
		 */
		this.loadWishData = function(prod){
			var deferred = $q.defer();
			var url = LotteCommon.myfeedDataUrl + '?type=P2&mode=4&latest_prod=' + prod + getMbrNo();
			if(LotteCommon.isTestFlag){
				url = '/json/myfeed/wish.json';
			}
			$http.get(url)
			.success(function(data) {	                                                    
				deferred.resolve(data);
			})
			.error(function() {
				console.log('Data Error : 찜한 상품 로드 실패');
				deferred.reject('찜한 상품 로드 실패');
			});
			return deferred.promise;
		};
		
		function getCommaString(arr) {
			var str = new String();
			for (var i = 0; i < arr.length; i++) {
				if (i > 0) {
					str += ",";
				}
				str += arr[i];
			}
			return str;
		}

		/**
		 * 찜한 상품 추천 데이타
		 */
		this.loadWishRecom = function(goods_no){
			var deferred = $q.defer();
			//var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/a002?size=5&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&iids="+goods_no;
            var viewSaleBestLink = LotteCommon.rec_good + "&size=10&iids="+goods_no;
			$.ajax({
				type: 'post'
				, async: true
				, url: viewSaleBestLink
				, dataType  : "jsonp"
				, success: function(data) {
					var str = '';
					var arr = new Array();
					
					if(data.results != null && data.results.length > 0){
						$(data.results).each(function(i, val) {
							arr.push(val.itemId);
						});
						str = getCommaString(arr);  
						
						var url = LotteCommon.myfeedDataUrl + '?type=P3&mode=1&limit_1=3&goods_nos_1=' + str;
						if(LotteCommon.isTestFlag){
							url = "/json/myfeed/wishRecom.json";
						}
						$http.get(url)
						.success(function(data) {	                                                    
							deferred.resolve(data);
						})
						.error(function() {
							console.log('Data Error : 찜 상품 데이타 로드 실패');
							deferred.reject('찜 상품 데이타 로드 실패');
						});
					}else{
						deferred.reject('찜 추천 데이타 로드 실패');
					}
				}
				, error: function(data, status, err) {
					deferred.reject('찜 추천 데이타 로드 실패');
				}
			});
			return deferred.promise;
		};
		
		/**
		 * 즐겨찾는 브랜드 데이타
		 */
		this.loadBrandData = function(){
			var deferred = $q.defer();
			var url = LotteCommon.myfeedDataUrl + '?type=P4&mode=1' + getMbrNo() + getAge() + getGender();
			if(LotteCommon.isTestFlag){
				url = '/json/myfeed/brand.json';
			}
			$http.get(url)
			.success(function(data) {
				//LotteConsole.traceObj(data, '브랜드 4.0');
				if(data && data.data && data.data.brnd_recomm_list && data.data.brnd_recomm_list.prdList
						&& data.data.brnd_recomm_list.prdList.items && data.data.brnd_recomm_list.prdList.items.length > 0){
					var items = data.data.brnd_recomm_list.prdList.items;
					var goods_no = "";
					var cnt = 0;
					var sCnt = 0;
					var maxLength = items.length > 3 ? 3 : items.length;
					for(var i = 0; i<maxLength; i++){
						if(items[i].brdNo){
							cnt++;
							self.loadBrandPrd(items[i].brdNo, i).then(function(result){
								//LotteConsole.traceObj(result, 'brand 상품 ' + result.idx);
								data.data.brnd_recomm_list.prdList.items[result.idx].subItem = result.max.prdLst.items;
								sCnt++;
								if(sCnt == maxLength){
									deferred.resolve(data);
								}
							}).catch(function(error){
								console.log('브랜드 추천 error ', error);
								deferred.reject('브랜드 추천 데이타 로드 실패');
							});
							if(cnt >= 3)	break;
						}
					}
				}else{
					deferred.resolve(data);
				}
			})
			.error(function() {
				console.log('Data Error : 브랜드 로드 실패');
				deferred.reject('브랜드 상품 로드 실패');
			});
			return deferred.promise;
		};
		
		/**
		 * 브랜드 추천 상품 데이타
		 */
		this.loadBrandPrd = function(brdNo, index){
			var deferred = $q.defer();
			var url = '/json/category/new_cate_search_list.json?dispCnt=10&dpml_no=1&loadTerm=true&page=1&pageType=B&sort=TOT_ORD_CNT,1&upBrdNo=' + brdNo;
			if(LotteCommon.isTestFlag){
				url = '/json/myfeed/brandPrd.json';
			}
			$http.get(url)
			.success(function(data) {
				//LotteConsole.traceObj(data, '브랜드 검색 상품');
				data.idx = index;
				deferred.resolve(data);
			})
			.error(function() {
				console.log('Data Error : 브랜드 검색 상품 로드 실패');
				deferred.reject('브랜드 검색 상품 로드 실패');
			});
			return deferred.promise;
		};
		
		/**
		 * 검색했던 상품 추천 데이타
		 * @param {String} appKeyword - 앱의 최근 검색어
		 */
		this.loadSearchRecom = function(appKeyword){
			var deferred = $q.defer();
			var keyword = "";
			
        	// 앱 최근 검색어 있으면 적용
        	if(typeof(appKeyword) == "string" && appKeyword.length > 0){
        		keyword = appKeyword;
        	}
			
        	if(keyword == ""){
				var myWord = LotteStorage.getLocalStorage("myWord2016");
	            if(myWord == null || myWord == ""){
	            	deferred.reject('검색키워드 없음');
	            	return deferred.promise;
	            }
	            
				var obj = JSON.parse(myWord);
	        	for(var i=0; i<obj.list.length; i++){
	        		if(obj.list[i].keytxt){
	        			keyword = obj.list[i].keytxt;
	        			break;
	        		}
	        	}
        	}
        	
        	//var viewSaleBestLink = "http://rb-rec-api-apne1.elasticbeanstalk.com/rec/s001?size=15&cps=false&format=jsonp&cuid=fdd29847-94cd-480d-a0d9-16144485d58b&st="+keyword;
            var viewSaleBestLink = LotteCommon.rec_search + "&size=15&st="+keyword;
			$.ajax({
				type: 'post'
				, async: true
				, url: viewSaleBestLink
				, dataType  : "jsonp"
				, success: function(data) {
					//LotteConsole.traceObj(data, '검색 recobell s001 ');
					if(data && data.results && data.results.length > 2){
						var str = "";
						for(var j=0; j<data.results.length; j++){
							str += ( j > 0 ? "," : "" ) + data.results[j].itemId;
						}
						var url = LotteCommon.myfeedDataUrl + '?type=P3&mode=1&limit_1=15&goods_nos_1=' + str;
						if(LotteCommon.isTestFlag){
							url = "/json/myfeed/search_prd.json";
						}
						$http.get(url)
						.success(function(data) {
							//LotteConsole.traceObj(data, '검색 상품 ');
							data.keyword = keyword;
							if(keyword.length > 7){
								data.keyword = keyword.substr(0, 7) + '...';
							}
							deferred.resolve(data);
						})
						.error(function() {
							console.log('Data Error : 검색 상품 데이타 로드 실패');
							deferred.reject('검색 상품 데이타 로드 실패');
						});
					}else{
						deferred.reject('검색 recobell 데이타 로드 실패');
					}
				}
				, error: function(data, status, err) {
					console.log('Data Error : 검색 recobell Data로드 실패');
					deferred.reject('검색 recobell Data로드 실패');
				}
			});
			return deferred.promise;
		};
		
		/**
		 * 카테고리 상품 데이타
		 */
		this.loadCategory = function(){
			var deferred = $q.defer();
			var paramAge = getAge();
			var url = LotteCommon.myfeedDataUrl + '?type=P4&mode=3' + getMbrNo() + paramAge + getGender();
			if(LotteCommon.isTestFlag){
				url = '/json/myfeed/category.json';
			}
			$http.get(url)
			.success(function(data) {
				//LotteConsole.traceObj(data, '카테고리 상품');
				var result = data;
				// entity 값을 나누기 위한 코드
				if(data && data.data && data.data.txt && paramAge.indexOf('A') < 0 && data.data.txt.indexOf('성') > 0){
					var arr = data.data.txt.split('성');
					result.data.user 	= arr[0] + '성';
					result.data.txt 	= arr[1];
				}
				deferred.resolve(result);
			})
			.error(function() {
				console.log('Data Error : 카테고리 로드 실패');
				deferred.reject('카테고리 상품 로드 실패');
			});
			return deferred.promise;
		};

	}]);

})(window, window.angular);