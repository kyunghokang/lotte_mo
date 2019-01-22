(function(window, angular, undefined) {
	'use strict';
	
	var utilModule = angular.module("lotteUtil");
	
	/**
	 * 스타일추천 서비스
	 */
	utilModule.service('StyleRecom', [
								'$window', '$http',
						function($window,   $http) {

		var API_VER = "v1";
		var API_KEY = "LOTT5afb4ffde7d5521fbe52a00cb8191e9dc77d2b0eae5ead382c2d99f9";
		var API_URL = "https://dl-api.oddconcepts.kr/" + API_VER + "/";//LotteCommon.oddConceptAPI; //"https://dl-api.oddconcepts.kr/v1/";
		var DOT_API_URL = "/json/search/m/styleRecommProdList.json";//LotteCommon.stylePushPrdData; // this.secureUrl + "/json/search/m/styleRecommProdList.json"
		var CATE_URL = "/json/search/m/styleRecommCateGrpList.json";
		var tclickBase = "";
		//var searchItemLimit = 400;
		
		
		
		// API 경로 변경
		this.setDotAPIUrl = function (apiUrl) {
			//DOT_API_URL = apiUrl;
		};
		
		// 티클릭 Base 변경
		this.setTclickBase = function (baseName) {
			tclickBase = baseName;
		};

		this.setSearchItemLimit = function (itemCnt) {
			//searchItemLimit = itemCnt;
		};
		
		/*var SEX_CATEGORY = {
		    F1  : 536870913,
		    F2  : 536870914,
		    F4  : 536870916,
		    F8  : 536870920,
		    F16 : 536870928,
		    F32 : 536870944,
		    M2  : 1073741826,
		    M4  : 1073741828,
		    M16 : 1073741840,
		    M32 : 1073741856,
		    A1  : 1,
		    A2  : 2,
		    A4  : 4,
		    A8  : 8,
		    A16 : 16,
		    A32 : 32
		};*/
		
		/*this.gender = {
			female	: "F",
			male	: "M",
			all		: "A"
		}*/
		/*this.category = {
			dresses	: 1,
			pants	: 2,
			shorts	: 4,
			skirts	: 8,
			tops	: 16,
			outers	: 32
		}*/
		
		var cateMap = {
			8			: {gender:"F",	name:"스커트"},
			252			: {gender:"F",	name:"롱스커트"},
			253			: {gender:"F",	name:"미디스커트"},
			254			: {gender:"F",	name:"미니스커트"},
			32			: {gender:"",	name:"아우터"},
			232			: {gender:"",	name:"가디건"},
			233			: {gender:"",	name:"점퍼"},
			234			: {gender:"",	name:"코트"},
			235			: {gender:"",	name:"자켓"},
			236			: {gender:"",	name:"조끼"},
			1			: {gender:"F",	name:"원피스"},
			4			: {gender:"",	name:"반바지"},
			16			: {gender:"",	name:"상의"},
			242			: {gender:"",	name:"셔츠"},
			243			: {gender:"F",	name:"뷔스티에"},
			239			: {gender:"",	name:"후드"},
			241			: {gender:"F",	name:"블라우스"},
			240			: {gender:"",	name:"니트"},
			237			: {gender:"",	name:"티셔츠"},
			238			: {gender:"",	name:"맨투맨"},
			2			: {gender:"",	name:"바지"},
			249			: {gender:"",	name:"긴바지"},
			250			: {gender:"",	name:"7부 바지"},
			512			: {gender:"",	name:"수영복상의"},
			247			: {gender:"F",	name:"비키니상의"},
			248			: {gender:"",	name:"래쉬가드"},
			1024		: {gender:"",	name:"수영복하의"},
			258			: {gender:"F",	name:"비키니하의"},
			259			: {gender:"M",	name:"삼각수영복"},
			260			: {gender:"M",	name:"사각수영복"},
			2048		: {gender:"",	name:"원피스수영복"},
			265			: {gender:"F",	name:"원피스수영복"},
			266			: {gender:"F",	name:"모노키니"},
			267			: {gender:"",	name:"전신수영복"},
			2097152		: {gender:"",	name:"부츠"},
			274			: {gender:"M",	name:"부츠"},
			268			: {gender:"F",	name:"부티"},
			269			: {gender:"F",	name:"앵클부츠"},
			270			: {gender:"",	name:"워커"},
			271			: {gender:"F",	name:"롱부츠"},
			272			: {gender:"F",	name:"하프부츠"},
			273			: {gender:"",	name:"레인부츠"},
			4194304		: {gender:"F",	name:"구두"},
			275			: {gender:"F",	name:"펌프스"},
			276			: {gender:"F",	name:"스틸레토힐"},
			277			: {gender:"F",	name:"웨지힐"},
			278			: {gender:"F",	name:"토오픈힐"},
			279			: {gender:"F",	name:"슬링백"},
			280			: {gender:"F",	name:"스트랩힐"},
			8388608		: {gender:"",	name:"로퍼"},
			281			: {gender:"F",	name:"플랫슈즈"},
			282			: {gender:"",	name:"로퍼"},
			283			: {gender:"F",	name:"블로퍼"},
			284			: {gender:"F",	name:"옥스퍼드화"},
			296			: {gender:"M",	name:"정장화"},
			297			: {gender:"M",	name:"보트슈즈"},
			16777216	: {gender:"",	name:"샌들"},
			298			: {gender:"",	name:"샌들"},
			285			: {gender:"F",	name:"플랫샌들"},
			286			: {gender:"F",	name:"플랫폼샌들"},
			287			: {gender:"F",	name:"웨지샌들"},
			288			: {gender:"F",	name:"글래디에이터"},
			289			: {gender:"F",	name:"스트랩샌들"},
			290			: {gender:"",	name:"슬리퍼"},
			291			: {gender:"",	name:"쪼리"},
			292			: {gender:"F",	name:"뮬"},
			33554432	: {gender:"",	name:"스니커즈"},
			293			: {gender:"",	name:"하이탑"},
			294			: {gender:"",	name:"스니커즈"},
			295			: {gender:"",	name:"슬립온"},
			67108864	: {gender:"",	name:"운동화"},
			299			: {gender:"",	name:"등산화"},
			4096		: {gender:"",	name:"토트백"},
			8192		: {gender:"",	name:"숄더백"},
			65536		: {gender:"",	name:"클러치"},
			131072		: {gender:"F",	name:"파우치"},
			16384		: {gender:"",	name:"백팩"},
			262144		: {gender:"M",	name:"서류가방"},
			1048576		: {gender:"",	name:"캐리어"},
			32768		: {gender:"",	name:"힙색"},
			524288		: {gender:"",	name:"스포츠가방"}
		}
		
		
		/**
		 * 이미지에서 스타일 추천 영역 검색
		 * @param {String} img - 이미지 경로
		 * @param {Function} cb - 콜백 함수
		 * @param {String} goods_no - 상품번호
		 * @param {String} screen - 상품상세 비슷한 스타일 추천에서 호출 여부(전시파트 통계확인 파라미터 추가요청)
		 * @param {boolean} isApp - 웹/앱 호출 여부(전시파트 통계확인 파라미터 추가요청)
		 */
		//this.detect = function(img, cb, goods_no, screen, isApp){
		this.detect = function(data, cb){
			if(data == undefined){
				console.warn("NO DATA");
				return false;
			}
			if(data.image == undefined || data.image == ""){
				console.warn("NO IMAGE");
				return false;
			}
			if(cb == undefined || typeof(cb) != "function"){
				console.warn("NO CALLBACK FUNCTION");
				return false;
			}
			//if(isNaN(goods_no)){ goods_no = ""; }
			data.type	= "detect";
			
			var path = API_URL + "detect?url=" + encodeURIComponent(data.image);
			if(data.sendGoodsNo !== false && data.goodsNo){
				path += "&product_code=" + data.goodsNo;
			}
			
    		$.ajax({
    			url: path,
    			//url: LotteCommon.styleRecomDetect + "?url=" + encodeURIComponent(img) + "&goods_no=" + goods_no + "&call_type=" + screen + "&isApp=" + isApp,
    	        type: "get",
    	        dataType: "json",
    	        async: true,
    	        beforeSend : function(xhr){
    	            xhr.setRequestHeader("apikey", API_KEY);
    	        },
    	        success: function(result){
    	        	if(data.sortCate){
    	        		result.sortCate = data.sortCate;
    	        	}
    	        	cb( processDetection(result) );
    	        	data.result	= "success";
    	        	log(data);
    	        },
    	        error: function(result){
    	        	data.result	= "fail";
    	        	log(data);
    	        	sendErrorTclick();
    	            cb([]);
    	        }
    		});
    		
    		getScope().sendTclick("DC_StyleReco_Detect");
		};
		
		/**
		 * 스타일 추천 데이터 가공
		 */
		function processDetection(data){
			//if(data == undefined || data.list == undefined){ return []; }
			if(data == undefined){ return []; }
			if(data.status === false){
				console.warn(data.message);
				sendErrorTclick();
				return [];
			}
			if(data.list == undefined){ return []; }
			
			var list = data.list;
	        var arr = [];
	        var arr2 = [];
	        var i, len, li, dt, ctg, map;
	        
        	len = list.length;
        	for(i=0; i<len; i++){
        		dt = list[i];
        		
        		// 카테고리
        		ctg = dt.category;
        		dt.ctgObj = ctg;
        		dt.category = ctg.code;
        		/*if(dt.sub_category.code != 0){
        			dt.category = dt.sub_category.code;
        		}else{
        			dt.category = ctg.code;
        		}*/

        		// 카테고리명 하드코딩, 성별전용 설정
        		if(dt.sub_category.code != 0){
        			map = cateMap[dt.sub_category.code];
        		}else{
        			map = cateMap[dt.category];
        		}
        		if(map){
        			dt.ctgName = map.name;
        			dt.genOnly = map.gender;
        		}else{
        			dt.ctgName = "";
        			dt.genOnly = "";
        		}
        		
        		// 성별
    			switch(dt.gender.code){
    			case 1073741824:
    				dt.genCd = "M";
    				break;
    			case 536870912:
    				dt.genCd = "F";
    				break;
    			case 1610612736:
    				dt.genCd = "A";
    				break;
				default:
					dt.genCd = "";
					break;
    			}
        		
    			// 영역
    			dt.score = Math.round(dt.score * 100);
    			dt.rx1 = Math.round(dt.rx1 * 10000) / 100;
    			dt.rx2 = Math.round(dt.rx2 * 10000) / 100;
    			dt.ry1 = Math.round(dt.ry1 * 10000) / 100;
    			dt.ry2 = Math.round(dt.ry2 * 10000) / 100;
    			// 중심좌표
    			switch(ctg.code){
    			case 2:// 바지
    			case 4:// 반바지
    			case 1024:// 수영복하의
    				dt.cx = Math.round(dt.rx1 + (dt.rx2 - dt.rx1) * 0.3);
    				dt.cy = Math.round(dt.ry1 + (dt.ry2 - dt.ry1) * 0.3);
    				break;
				default:
    				dt.cx = Math.round(dt.rx1 + (dt.rx2 - dt.rx1) * 0.5);
					dt.cy = Math.round(dt.ry1 + (dt.ry2 - dt.ry1) * 0.5);
					break;
    			}
    			if(dt.category == data.sortCate){
    				arr.push(dt);
    			}else{
    				arr2.push(dt);
    			}
        	}
	        
	        
	        arr = arr.sort(sortByScore);
	        arr2 = arr2.sort(sortByScore);
	        
	        arr = arr.concat(arr2);
	        
	        /*if(data.sortCate){
	        	len = arr.length;
	        	for(i=0; i<len; i++){
	        		dt = arr[i];
	        		if(dt.category == data.sortCate){
	        			arr.unshift(arr.splice(i, 1)[0]);
	        		}
	        	}
	        }*/
	        
	        return arr;
		};
		
		/**
		 * 스타일 추천 데이터 정확도순 정렬
		 */
		function sortByScore(s1, s2){
			var a = s1.score;
			var b = s2.score;
			if(a > b){
				return -1;
			}else if(a < b){
				return 1;
			}
			return 0;
		};
		
		/**
		 * 추천 상품 조회
		 * @param {String} id 스타일 추천 ID
		 * @param {String} sex 성별
		 * @param {Number} cate 카테고리
		 * @param {String} subcate 서브카테고리
		 * @param {Number} limitCnt 상품갯수 제한
		 * @param {Function} cb 콜백 함수
		 * 
		 * deprecated
		 * @param {String} goods_no - 상품번호
		 * @param {boolean} screen - 상품상세 비슷한 스타일 추천에서 호출 여부(전시파트 통계확인 파라미터 추가요청)
		 * @param {boolean} isApp - 웹/앱 호출 여부(전시파트 통계확인 파라미터 추가요청)
		 */
		//this.search = function(id, sex, cate, subcate, cb, limitCnt){//, goods_no, screen, isApp, limitCnt){
		this.search = function(data, cb){
			if(data.id == undefined || data.id == ""){
				console.warn("NO ID");
				return false;
			}
			if(data.sex == undefined || data.sex == ""){
				console.warn("NO SEX");
				return false;
			}
			if(data.cate == undefined){
				console.warn("NO CATEGORY");
				return false;
			}
			/*if(typeof(cate) != "object"){
				cate = [cate];
			}*/
			if(cb == undefined || typeof(cb) != "function"){
				console.warn("NO CALLBACK FUNCTION");
				return false;
			}
			//if(isNaN(goods_no)){ goods_no = ""; }
			
			var category = getCategory(data.sex, data.cate);
			if(category == ""){
				console.warn("INCORRECT CATEGORY");
				return false;
			}
			data.type = "search";
			
			var obj = {
				id			: data.id,
				category	: category,
				//goods_no	: goods_no,
				//recommcgcd	: 1,
				//call_type	: screen,
				//isApp		: isApp,
				count		: 200
				//sub_category: [123]
			};
			if(typeof(data.count) == "number"){
				obj.count = data.count;
			}
			
			var obj2 = {
					recommcgcd	: 1
			};
			if(data.sub_cate != undefined && data.sub_cate != 0){
				//obj2.sub_category = [data.sub_cate];
				obj2.sub_category = data.sub_cate;
			}
			//mode 	Integer 	1 = filter , 2 = fixed boost , 3 = dynamic boost , 4 = naive boost
			//alpha 	Integer 	클러스터당 요소 갯수로 fixed boost , dynamic boost에서만 사용. (권장값: 페이지 2개에 들어가는 상품 갯수)

			switch(data.sort){
			case "order_count":// 추천순
			case "reg_date":// 신상품
			case "review_count":// 상품평많은
			case "price":// 높은가격
				obj.order_by = data.sort;
				obj.reverse = 1;
				break;
			case "price2":// 낮은가격
				obj.order_by = "price";
				break;
			//no default // 정확도순
			}
			
			/*if(typeof(data.count) == "number" && data.count > 0){
				obj.count = data.count;
			}*/
			
			if(data.subcate != undefined || data.subcate != ""){
				var n = parseInt(data.subcate, 10);
				if(!isNaN(n)){
					obj2.recommcgcd = n;
				}
			}

			var path = API_URL + "search/" + data.id + "?" + $.param(obj);
			//var path = LotteCommon.styleRecomSearch;// + "?" + $.param(obj);

    		$.ajax({
				url: path,
				type: "POST",//LotteCommon.isTestFlag ? "GET" : "POST",
				data: JSON.stringify(obj2),
				dataType: "JSON",
				async: true,
				method: "POST",//LotteCommon.isTestFlag ? "GET" : "POST",
				beforeSend : function(xhr){
					xhr.setRequestHeader("apikey", API_KEY);
					xhr.setRequestHeader('Content-Type', 'application/json');
				},
				success: function(result){
					//result.goodsNo = data.goodsNo;
					loadProductList(result, data.goodsNo, cb);
					data.result = "success";
					log(data);
				},
				error: function(result){
					data.result = "fail";
					log(data);
					sendErrorTclick();
				    cb([]);
				}
    		});
    		
    		getScope().sendTclick("DC_StyleReco_Search");
		};
		
		/**
		 * 스타일 추천 카테고리 조회
		 * @param cb 콜백 함수
		 */
		this.cateList = function(cb){
    		$.ajax({
    			url: CATE_URL,
    	        type: "get",
    	        dataType: "json",
    	        async: true,
    	        success: function(data){
    	        	cb(data.cateGrpList || []);
    	        },
    	        error: function(data){
    	        	cb([]);
    	        }
    		});
		};
		
		/**
		 * 성별 적용
		 * @param {Object} item 디텍션 아이템
		 * @param {String} prdSex 상품 성별
		 * @param {String} prdCtg 상품 카테고리
		 * @param {String} mbrSex 회원 성별
		 */
		this.determineSex = function(item, prdSex, prdCtg, mbrSex){
			var reg = /^F$|^M$/;
			var sex = item.genCd;
			if(reg.test(item.genOnly)){
				// 전용 성별 카테고리
				sex = item.genOnly;
			}else if(reg.test(prdSex)){
				// 상품 성별
				sex = prdSex;
			}else{
				if(prdCtg == "5"){
					// 아동복이면 회원정보 성별 사용안함
					sex = item.genCd;
				}else{
					// 기타
					if(reg.test(item.genCd)){
						// 오드컨셉 성별
						sex = item.genCd;
					}else if(reg.test(mbrSex)){
						// 회원정보 성별
						sex = mbrSex;
					}else{
						sex = "A";
					}
					/*if(reg.test(mbrSex)){
						// 회원정보 성별
						sex = mbrSex;
					}else{
						// 오드컨셉 성별
						sex = item.genCd;
					}*/
				}
			}
			return sex;
		};
		
		/**
		 * 이미지 해시 중복 삭제
		 */
		function uniqueImageHash(list){
			var rtnArr = [];
			var hashArr = [];
			var x, itm, arr;
			
			angular.forEach(list, function(itm, idx){
				itm.idx = idx;
				x = itm.image_hash;
				if(hashArr[x] == undefined){
					hashArr[x] = [];
				}
				hashArr[x].push(itm);
			});
			
			for(x in hashArr){
				rtnArr.push(getLowPrice(hashArr[x]));
			}
			return rtnArr.sort(sortByIdx);
		};
		
		/**
		 * 최저가 구하기
		 */
		function getLowPrice(arr){
			if(arr.length > 1){
				arr = arr.sort(sortByPrice);
			}
			return arr[0];
		};
		
		/**
		 * 스타일 추천 데이터 순서대로 재정렬
		 */
		function sortByPrice(s1, s2){
			var a = s1.price;
			var b = s2.price;
			if(a > b){
				return 1;
			}else if(a < b){
				return -1;
			}
			return 0;
		};
		
		/**
		 * 스타일 추천 데이터 순서대로 재정렬
		 */
		function sortByIdx(s1, s2){
			var a = s1.idx;
			var b = s2.idx;
			if(a > b){
				return 1;
			}else if(a < b){
				return -1;
			}
			return 0;
		};
		
		/**
		 * 상품정보 로드
		 */
		function loadProductList(data, goodsNo, cb) {
			var list = [];
			//var goodsNo = data.goodsNo;
			
			if(API_VER == "v1"){
				data = data.list;
			}
			for(var x in data){
				if(getScope().isValidArray(data[x])){
					list = data[x];
					break;
				}
			}
			
			if (list == undefined || list.length == 0) {
				cb([]);
				return;
			}
			
			list = uniqueImageHash(list);
			/*
			var prd;
			var len = list.length;
			for(var i=0; i<len; i++){
				prd = list[i];
				prd.imgUrl2 = prd.imgUrl.replace(/_280/g, "_550");
			}
			
			cb(list);*/
			
			
			var p;
			var prod = [];
			angular.forEach(list, function(itm){
				p = itm.product_code;
				if((goodsNo != p) && (prod.indexOf(p) < 0)){
					prod.push(p);
				}
			});
			
			if (prod.length == 0) {
				cb([]);
				return;
			}

			// 테스트시
			/*DOT_API_URL = LotteCommon.isTestFlag ? LotteCommon.stylePushPrdData + "?" : DOT_API_URL;
			DOT_API_URL = (DOT_API_URL + "").indexOf("?") >= 0 ? DOT_API_URL : DOT_API_URL + "?";
			
			var path = DOT_API_URL + "goods_no=" + (prod.splice(0, searchItemLimit)).join();*/
			//var path = LotteCommon.stylePushPrdData + "?goods_no=" + (prod.splice(0, searchItemLimit)).join();
			//var path = DOT_API_URL + "?goods_no=" + (prod.splice(0, searchItemLimit)).join();
			var path = DOT_API_URL + "?goods_no=" + prod.join();
			//if (location.host == "localhost:8082"){ path = "http://mo2.lotte.com/" + path; }
			
			$http({
				url: path,
				method: "GET"
			})
			.success(function (data){
				if(data.prdList != undefined){
					var prd;
					var arr = [];
					var len = data.prdList.length;
					//var styleShopUrl = data.styleShopUrl;//LotteCommon.isTestFlag ? LotteCommon.styleRecomUrl : data.styleShopUrl;
					
					for(var i=0; i<len; i++){
						prd = data.prdList[i];

						if (!prd.imgUrl2) {
							prd.imgUrl2 = prd.imgUrl.replace(/_280/g, "_550");
						}

						if(prd == undefined || prd.price2 == 0){
							continue;
						}
						arr.push(prd);
					}

					cb(arr);
					//cb(arr, styleShopUrl);
				}else{
					cb([]);
				}
			})
			.error(function (data){
				sendErrorTclick();
				cb([]);
			});
		};
		
		/**
		 * 카테고리 구하기
		 * @param sex 성별
		 * @param cate 카테고리
		 */
		function getCategory(sex, cate){
			try{
				var base = 0;
				
				switch(sex){
				case "F":
					base = 536870912;
					break;
				case "M":
					base = 1073741824;
					break;
				// no default
				}
				
				return base + cate;
				
				/*var len = cate.length;
				var rtn = 0;
				for(var i=0; i<len; i++){
					if(SEX_CATEGORY[sex + cate[i]] != undefined){
						rtn = rtn | SEX_CATEGORY[sex + cate[i]];
					}
				}
				return rtn;*/
			}catch(e){}
			
			return "";
		};
		
		/**
		 * DB에 로그 쌓기
		 */
		function log(data){
			var $scope = getScope();
			var path = "/json/search/m/insertStyleRecoLogInfo.json?call_api=" + data.type + "&isApiResult=" + data.result
					+ "&isApp=" + $scope.appObj.isApp + "&call_type=" + data.screen + "&goods_no=" + data.goodsNo;
			
			$http({
				url: path,
				method: "GET"
			});
		};
		
		/**
		 * 에러 티클릭 전송
		 */
		function sendErrorTclick(){
			var $scope = getScope();
			var now = new Date();
			var h = now.getHours();
			var HH = (h < 10) ? "0"+h : ""+h;
			var tclick_prefix = $scope.tClickBase;

			if (tclickBase != "") {
				tclick_prefix = tclickBase;
			}

			$scope.sendTclick(tclick_prefix + "ProdDetail_DataError_" + HH);
		};

	}]);

})(window, window.angular);