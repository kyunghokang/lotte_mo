(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSideMylotte',
        'lotteCommFooter',
        'lotteSlider',
		'lotteSns'
    ]);

    app.controller('StyleRecomCtrl', 
    				['$scope', '$http', 'LotteCommon', 'LotteForm', 'LotteStorage', "commInitData", "StyleRecom",
    		function( $scope,   $http,   LotteCommon,   LotteForm,   LotteStorage,   commInitData,   StyleRecom) {
		$scope.showWrap = true;
		$scope.contVisible = true;
		$scope.subTitle = "스타일추천";//서브헤더 타이틀
		$scope.screenID = "StyleReco"; // 스크린 아이디
		//공유하기
		$scope.hasSharePreFunc = true;
		$scope.isShowThisSns = true;
		$scope.planShopSns = true;
		$scope.share_img = commInitData.query.img;
		
		$scope.dataLoaded = false;
		$scope.SR_IMG = "";
		$scope.SR_IMG_WIDTH = 0;
		$scope.SR_IMG_HEIGHT = 0;
		$scope.DETECT_LIST = [];
		$scope.PROD_LIST = [];
		$scope.PROD_ORIGIN_LIST = [];
		$scope.CATE_NO = commInitData.query.cate;
		$scope.PROD_SEX = commInitData.query.prdGen;
		$scope.GOODS_NO = commInitData.query.goods_no;
		$scope.SORT_CATE = commInitData.query.sortCate;
		$scope.isCamera = commInitData.query.img_key; // 디바이스의 사진,카메라선택으로 들어온 경우 파라미터
		$scope.styleCateList = [];
		
		if(!$scope.isValidString($scope.GOODS_NO)){
			try{
				var arr = $scope.share_img.split("/");
				var img = arr[arr.length - 1];
				$scope.GOODS_NO = img.substr(0, img.indexOf("_"));
				if(isNaN($scope.GOODS_NO)){
					$scope.GOODS_NO = "";
				}
			}catch(e){}
		}
		
		$scope.showHeaderCamera = true; // 헤더에 카메라 버튼 유무
		$scope.isShowLoading = true;
		$scope.showCategory = false;
		$scope.noCateSlide = false;
		
		
		// 코치마크 체크 
		//$scope.styleCoachMark = true;///////////////////////////////////////////////////////////////////
		/*var styleCoachMark = LotteStorage.getLocalStorage("styleCoachMark");
		if(!styleCoachMark) {
			$scope.styleCoachMark = true;
			LotteStorage.setLocalStorage("styleCoachMark",'1');
		}*/
		
		/*$scope.closeCoachMark = function() {
			$scope.styleCoachMark = false;
		};*/
		
		$scope.SEX = [
			{
				"label": "여성",
				"data": "F"
			},{
				"label": "남성",
				"data": "M"
			},{
				"label": "전체",
				"data": "A"
			}
		];
		$scope.childSex = [
			{
				"label": "여아",
				"data": "F"
			},{
				"label": "남아",
				"data": "M"
			},{
				"label": "전체",
				"data": "A"
			}
		];
		$scope.CATE = [
			{
				"label": "상의",
				"data": 16,
				"tclick": 1,
				"selected": false
			},{
				"label": "아우터",
				"data": 32,
				"tclick": 6,
				"selected": false
			},{
				"label": "긴바지",
				"data": 2,
				"tclick": 2,
				"selected": false
			},{
				"label": "반바지",
				"data": 4,
				"tclick": 3,
				"selected": false
			},{
				"label": "스커트",
				"data": 8,
				"tclick": 5,
				"selected": false
			},{
				"label": "원피스",
				"data": 1,
				"tclick": 4,
				"selected": false
			}
		];
		
		//추천순(default), 판매순, 신상품순, 상품평순
		//case "reg_date":
		//case "order_count":
		//case "review_count":
		$scope.SORT = [
			{"name":"정확도순"	, "value":""},
			{"name":"추천순"	, "value":"order_count"},
			{"name":"신상품순"	, "value":"reg_date"},
			{"name":"상품평많은순"	, "value":"review_count"},
			{"name":"낮은가격순"	, "value":"price2"},
			{"name":"높은가격순"	, "value":"price"}
		];
		$scope.currentSort = $scope.SORT[0];
		$scope.sortLayerVisible = false;
		
		$scope.selectedID = "";
		//$scope.selectedSex = "";
		//$scope.fixCategory = false;

		/*****************************************
		 * 날짜 세팅
		 *****************************************/

		function getAddZero(num) { // 날짜 한자리로 나올경우 0을 붙여 두자리수로 만들기 위한 Func
			return num < 10 ? "0" + num : num + "";
		}

		function getTime(Year, Month, Day, Hour, Min, Sec) {
			var date = new Date(Year, Month, Day, Hour, Min, Sec);
			if (Year && Month && Day) {
				date.setFullYear(Year);
				date.setMonth(Month - 1);
				date.setDate(Day);

				if (Hour) {
					date.setHours(Hour);
				}

				if (Min) {
					date.setMinutes(Min);
				}

				if (Sec) {
					date.setSeconds(Sec);
				}
			}

			return date.getTime();
		}

		var todayDateTime = new Date(),
			todayDate = todayDateTime.getFullYear() + getAddZero(todayDateTime.getMonth() + 1) + getAddZero(todayDateTime.getDate()) , // 년월일
			todayTime = todayDateTime.getTime(); // Time

		/********************************************
		 * TEST Func. - 테스트를 위한 코드 추가
		 ********************************************/
		// 날짜 설정으로 운영되는 요소에 대한 테스트 코드
		if (commInitData.query["testDate"]) {
			var testDateStr = commInitData.query["testDate"];
			todayDate = commInitData.query["testDate"]; // 년월일
			todayTime = getTime(
				todayDate.substring(0, 4), // 년
				todayDate.substring(4, 6), // 월
				todayDate.substring(6, 8), // 일
				todayDate.substring(8, 10), // 시간
				todayDate.substring(10, 12), // 분
				todayDate.substring(12, 14)); // 초
		}		
		/* [MO] 스타일추천 이벤트 관련 수정 건 2017.06.16 */
		$scope.styRecomBnr = false;
		if(todayTime < getTime(2017, 6, 30, 17, 0)){
			$scope.styRecomBnr = true;
		};		
		
		$scope.refreshStyle = function(item, idx){
			$scope.ga("추천상품_재검색", "상품_" + idx);
			
			var imgUrl = item.imgUrl2;
			var imgUrl2 = imgUrl.replace("280.jpg", "550.jpg");
			if(idx < 10){ idx = '0' + idx; }
			var tclick = 'm_DC_' + $scope.screenID + '_clk_RePrd_idx' + idx;
			var sex = StyleRecom.determineSex(item, $scope.PROD_SEX, $scope.CATE_NO, $scope.loginInfo.genSctCd);
			
			var obj = {
    			"tclick"	: tclick,
    			"img"		: imgUrl2,
    			"goods_no"	: item.goodsNo,
    			"cate"		: $scope.CATE_NO,
    			"prdGen"	: sex,
    			"sortCate"	: $scope.selectedItem.category
    		}
			location.href = LotteCommon.styleRecomUrl + "?" + $scope.getBaseParam(true) + "&" + $.param(obj);
			
			//window.location.href = LotteCommon.styleRecomUrl + "?img=" + imgUrl2 + "&goods_no=" + item.goodsNo + "&"+ $scope.baseParam + tclick;
			//"&cate=" + commInitData.query.cate + 
		};
		
		$scope.goStyleRecom = function(obj){
			if(!obj.img_url || !obj.img_key){ return; }
			var tclick = '&tclick=m_DC_' + $scope.screenID + '_clk_camera';
			window.location.href = LotteCommon.styleRecomUrl +'?img=' + obj.img_url + '&img_key=' + obj.img_key + '&' + $scope.baseParam + tclick;
		};
		
		$scope.showSharePopPre = function(){
			$scope.ga("공유", "");
			
			//console.log('showSharePopPre');
			var obj = {shareImg:$scope.share_img, tclick:'m_DC_' + $scope.screenID + '_clk_share'};
			$scope.showSharePop(obj);
			
			if(!commInitData.query.img_key)	return;
			$http.get('/json/search/m/updateStyleRecoShareState.json' + "?img_key=" + commInitData.query.img_key)
	        .success(function(data){
	        	console.log('updateStyleRecoShareState 성공');
			})
	        .error(function(data){
	            console.log('Error Data :  updateStyleRecoShareState 실패');
	        });
		};
		
		/**
		 * 위시리스트 답기
		 * @param {Object} item - 상품 오브젝트
		 * @param {Number} idx - 인덱스 번호
		 */
		$scope.addWishList = function(item, idx){
			$scope.ga("추천상품_위시리스트", "상품_" + idx);
			
			if(!$scope.loginInfo.isLogin) { 
				$scope.alert_2016("로그인 후 이용하실 수 있습니다.", {callback : function(){
					/*var q = commInitData.query;
					var path = LotteCommon.styleRecomUrl + "?" + $scope.baseParam;
					if(q.img){ path += "&img=" + q.img; }
					if(q.cate){ path += "&cate=" + q.cate; }
					if(q.prdGen){ path += "&prdGen=" + q.prdGen; }*/
					$scope.gotoService("loginUrl", {targetUrl : encodeURIComponent(location.href)});
				}});
				return false;
			}
			
			if(item.wishAdded){
				$scope.alert_2016("이미 등록된 상품입니다.");
				return false;
			}
			
			
			$http({
				method: 'POST',
				url: LotteCommon.prdAddWish,
				data: { "goods_nos" : item.goodsNo },
				transformRequest: LotteForm.JsonToParam,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				item.wishAdded = true;
			})
			.error(function (ex) {
				if (ex.error) {
					var errorCode = ex.error.response_code;
					var errorMsg = ex.error.response_msg;
					
					switch(errorCode){
					case "5002":// 이미 등록된 상품 ==> 알러트 없이 선택 적용
						item.wishAdded = true;
						break;
					case "9003":
						$scope.alert_2016(errorMsg, {"callback":function(){
							var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8'); 
							location.href = '/login/m/loginForm.do?' + targUrl;
						}});
						break;
					default:
						$scope.alert_2016(errorMsg);
						break;
					}
				} else {
					$scope.alert_2016('처리중 오류가 발생하였습니다.');
				}
			});
		};
    }]);
    
    /**
     * 메인 이미지 로딩 디렉티브
     */
	app.directive('styleRecomImageLoad', ["$timeout", "commInitData", function($timeout, commInitData){
		return {
			restrict: 'A',
			link: function($scope, element, attrs) {
				function styleRecomImageLoaded(){
					getImageSize();
					$scope.detectStyleRecom();
					if(commInitData.query.img_key){
						$scope.cateListStyleRecom();
					}
				};
				
				function styleRecomImageError(){
					$scope.$parent.SR_IMG = "";
					$timeout(function(){ $scope.alert_2016("추천 상품을 준비중입니다.<br />다른 이미지로 검색해주세요."); }, 1);
				};
				
				/**
				 * 이미지 크기 구하기
				 */
				function getImageSize(){
            		var img = angular.element("#srImage");
            		$scope.SR_IMG_WIDTH = img.width();
            		$scope.SR_IMG_HEIGHT = img.height();
				};
				
				element.bind("load", styleRecomImageLoaded);
				element.bind("error", styleRecomImageError);
			}
		};
	}]);
	
	/**
	 * 스타일 추천 디렉티브
	 */
    app.directive("lotteContainer", ["LotteCommon", "commInitData", "StyleRecom", "$timeout", "$window", "LotteStorage", "LotteGA",
							function( LotteCommon,   commInitData,   StyleRecom,   $timeout,   $window,   LotteStorage,   LotteGA) {
        return {
            templateUrl : '/lotte/resources_dev/search/style_recom_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	
        		var PAGE_COUNT = $scope.appObj.isTablet ? 100 : 30;
        		var MAX_PAGE = 0;
        		var page_no = 0;
        		var page_changing = false;
        		
        		var genderCode = "";
        		
        		
            	/**
            	 * 스타일 추천 초기화
            	 */
            	function initStyleRecom(){
            		if(commInitData.query.img == undefined || commInitData.query.img == ""){
            			$scope.alert_2016("이미지가 없습니다.");
            			return;
            		}
            		
            		$scope.SR_IMG = decodeURIComponent(commInitData.query.img);
            		
            		var win = angular.element($window);
            		win.on("scroll orientationchange", windowScrollListener);
            		win.on("unload", saveCurrentState);
            		
            		angular.element("#file_input").bind("click", function(){
            			$scope.ga("사진촬영업로드", "");
            		});
            	};
            	
            	/**
            	 * 정렬 레이어 열기/닫기
            	 */
            	$scope.toggleSortLayer = function(flag){
            		if($scope.sortLayerVisible){
            			$scope.closeSideSearch();
            		}else{
            			$scope.sortLayerVisible = true;
            			$scope.dimmedOpen({
            				target: "sideSearch",
            				callback: this.closeSideSearch,
            				scrollEventFlag: false
            			});
            		}
            		
            		if(flag == "btn"){
            			$scope.ga("정렬순", "");
            		}
            	};
            	
            	$scope.closeSideSearch = function(){
            		if($scope.LotteDimm.target == "sideSearch"){
						$scope.dimmedClose();
					}else{
						$scope.sortLayerVisible = false;
					}
            	};
            	
            	/**
            	 * 정렬 변경
            	 */
            	$scope.changeSort = function(item){
            		$scope.ga("정렬순_필터레이어", item.name);
            		
            		if($scope.currentSort != item){
            			$scope.currentSort = item;
            			searchDetection($scope.selectedItem);
            		}
            		
            		$scope.LotteDimm.scrollY = 0;
            		$scope.closeSideSearch();
            		//$scope.sortLayerVisible = false;
            	};
            	
            	$scope.showHideSortGuide = function(e){
            		e.stopPropagation();
            		window.alert("최근 15일동안 많이 판매된 상품을 누적한 기준으로 상품을 정렬합니다.");
            	};
            	
            	/**
            	 * 데이터 로드 상태 변경
            	 */
            	function setDataLoaded(){
            		$timeout(function(){
            			$scope.dataLoaded = true;
            		}, 50);
            	};
            	
            	/**
            	 * 현재 상태 세션에 저장
            	 */
            	function saveCurrentState(){
            		var sess = {
            			scrollY		: angular.element($window).scrollTop(),
            			page_no		: page_no,
            			prod_list	: $scope.PROD_ORIGIN_LIST,
            			detect_list	: $scope.DETECT_LIST,
            			//cate		: $scope.CATE,
            			selected_id	: $scope.selectedID,
            			cur_sort	: $scope.currentSort.value,
            			//gender		: $scope.selectedSex,
            			genderCode	: genderCode
            		};
            		//console.log('set session');
            		//LotteStorage.setSessionStorage("styleRecomStorage", sess, "json");
            		try{
	            		var obj = LotteStorage.getSessionStorage("styleRecomStorage_1", "json");
	            		if(obj === null){ obj = {}; }
            			var img = commInitData.query.img;
	            		obj[img] = sess;
	            		LotteStorage.setSessionStorage("styleRecomStorage_1", obj, "json");
            		}catch(e){}
            	};
            	
                /**
                 * 스타일 추천 카테고리 리스트 조회
                 */
                $scope.cateListStyleRecom = function(){
                	StyleRecom.cateList(cateListCallback);
                };
                
                function cateListCallback(list){
                	if(list && list.length > 0){
                		$scope.styleCateList = list;
                	}
                	/*$scope.styleCateList = [ {
            		    "cate" : "5",
            		    "cate_nm" : "아동복"
            		  }, {
            		    "cate" : "2",
            		    "cate_nm" : "수영복"
            		  }, {
            		    "cate" : "4",
            		    "cate_nm" : "스키복"
            		  }, {
            		    "cate" : "3",
            		    "cate_nm" : "자전거의류"
            		  } ];*/
            		var w = 0;
					$("#cateListSlider li").each(function(idx, itm){
						w += ($(itm).width() + 6);
					});
					$("#cateListSlider ul").width(w);
                }
                
                /**
                 * 스타일추천 디텍트하기
                 */
                function detect(){
                	//var rtn = StyleRecom.detect($scope.SR_IMG, styleDetectCallback, $scope.GOODS_NO, "style", $scope.appObj.isApp);
                	var obj = {
                		"image"			: $scope.SR_IMG,
                		"goodsNo"		: $scope.GOODS_NO,
                		"sendGoodsNo"	: false,
                		"screen"		: "style",
                		"sortCate"		: $scope.SORT_CATE
                	}
                	var rtn = StyleRecom.detect(obj, styleDetectCallback);
        			if(rtn === false){
        				$('#loading').hide();
        				$scope.alert_2016("데이터를 불러올 수 없습니다.<br/>잠시 후에 다시 시도해 주세요.");
        				setDataLoaded();
        			}
                };
                
            	/**
            	 * 스타일 추천 검사 요청
            	 * styleRecomImageLoad 콘트롤 이미지 로드에서 호출
            	 */
            	$scope.detectStyleRecom = function(){
            		$('#loading').show();
            		
            		if(history.state == null || history.state.name != "stylerecom"){
            			
            			//console.warn("NEW VISIT");
            			history.replaceState({name:"stylerecom"}, "stylerecom");
            			detect();
            			/*var rtn = StyleRecom.detect($scope.SR_IMG, styleDetectCallback, $scope.GOODS_NO, "style", $scope.appObj.isApp);
            			
            			if(rtn === false){
            				$('#loading').hide();
            				$scope.alert_2016("데이터를 불러올 수 없습니다.<br/>잠시 후에 다시 시도해 주세요.");
            			}*/
            			
            		}else{
            			
            			//console.warn("REVISIT");
        				//var sess = LotteStorage.getSessionStorage("styleRecomStorage", "json");
            			var objSess = LotteStorage.getSessionStorage("styleRecomStorage_1", "json");
            			var sess = undefined;
            			var img = commInitData.query.img;
            			if(objSess && objSess[img]){
            				sess = objSess[img];
            			}
        				if(location.host == "localhost:8082"){ sess = null; }// 로컬에서 세션 사용 안함
        				if(sess == undefined || sess.detect_list == undefined || sess.selected_id == undefined 
        						/*|| sess.gender == undefined || sess.cate == undefined*/ || sess.prod_list == undefined
        						|| sess.detect_list.length == 0 || sess.prod_list.length == 0){
        					//console.warn("LOAD DATA")
        					//StyleRecom.detect($scope.SR_IMG, styleDetectCallback, $scope.GOODS_NO, 'style', $scope.appObj.isApp);
        					detect();
        					
        				}else{
        					//console.warn("USE SESSION")
        					$scope.DETECT_LIST = sess.detect_list;
        					//$timeout(setImagePosition, 1);
        					
       						//$scope.CATE = sess.cate;
       						//$scope.selectedSex = sess.gender;
        					$scope.selectedID = sess.selected_id;
        					genderCode = sess.genderCode;
        					
        					var len = $scope.DETECT_LIST.length;
        					var idx = -1;
        					var item;
        					for(var i=0; i<len; i++){
        						item = $scope.DETECT_LIST[i];
        						if(item.id == $scope.selectedID){
        							//idx = i;
        							$scope.selectedItem = item;
        							break;
        						}
        					}
        					
        					angular.forEach($scope.SORT, function(itm, idx){
        						if(itm.value == sess.cur_sort){
        							$scope.currentSort = itm;
        						}
        					});
        					
        					$timeout(refreshCategorySize, 10);
        					$timeout(setDetectionSlide, 100);
        					
        					//sess.cur_sort	: $scope.currentSort.value
        					
        					/*if(idx >= 0 && item != undefined){
	                			$timeout(function(){
	                				animateStyleClip(angular.element(".style_clip_list li").eq(idx).find(".style_clip"), item);
	                				setClippingArea(item);
	                			}, 100);
        					}*/
        					
        					$scope.PROD_ORIGIN_LIST = sess.prod_list;
        					MAX_PAGE = Math.ceil($scope.PROD_ORIGIN_LIST.length / PAGE_COUNT);
        					if(sess.page_no != undefined){
        						page_no = sess.page_no - 1;
        						if(page_no < 0){ page_no = 0; }
        					}else{
        						page_no = 0;
        					}
        					fillProductList();
        					
        					$timeout(function(){
        						var scr = angular.element($window).scrollTop();
        						if(sess.scrollY != scr){
        							$(window).scrollTop(sess.scrollY);
        						}
        					}, 200);
        					//console.log('del session');
        					try{
	        					var obj = LotteStorage.getSessionStorage("styleRecomStorage_1", "json");
	                			var img = commInitData.query.img;
	        					obj[img] = '';
	        					LotteStorage.setSessionStorage("styleRecomStorage_1", obj, "json");
        					}catch(e){}
                			//LotteStorage.delSessionStorage("styleRecomStorage");
        					$('#loading').hide();
        					setDataLoaded();
        				}//else
        				
            		}//else
            	};
            	
            	/**
            	 * 스타일 추천 콜백
            	 */
            	function styleDetectCallback(list){
            		$timeout(function(){ $('#loading').hide(); }, 0);
            		
            		$scope.DETECT_LIST = list;
            		
            		if(list == undefined || list.length == 0){
            			setDataLoaded();
            			$scope.alert_2016("추천 상품을 준비중입니다.<br/>다른 이미지로 검색해주세요.");
            			return;
            		}

            		genderCode = $scope.DETECT_LIST[0].genCd;
            		//setImagePosition();
            		$scope.selectDetection($scope.DETECT_LIST[0], 0);
            		
            		$timeout(refreshCategorySize, 10);
            		
            		//$timeout(setImagePosition, 1);
            		
        			/*$timeout(function(){
       					angular.element(".style_clip_list li:first-child .style_clip").trigger("click");
        			}, 50);*/
            	};
            	
            	/**
            	 * 카테고리 스와이프 세팅
            	 */
            	function refreshCategorySize(){
            		var sl = angular.element("#categorySlider");
            		var ul = sl.find("ul");
            		var list = sl.find("li");
            		
            		var w = 0,
            			li;
            		angular.forEach(list, function(itm, idx){
            			li = angular.element(itm);
            			w += li.outerWidth() + 1;// + 20;
            		});
            		ul.width(w);
            		
            		if(sl.width() >= w){
            			$scope.noCateSlide = true;
            		}else{
            			$scope.noCateSlide = false;
            		}
            		
            		$timeout(refreshCategorySizeDelay, 10);
            	};
            	
            	/**
            	 * 스와이프 리셋
            	 */
            	function refreshCategorySizeDelay(){
            		angular.element("#categorySlider").scope().reset();
            		$scope.showCategory = true;
            	};
            	
            	/**
            	 * 디텍션 영역 클릭
            	 */
            	$scope.selectDetection = function(item, idx, flag){
            		if($scope.selectedID == item.id){ return; }
            		
            		$scope.currentSort = $scope.SORT[0];
            		
            		$scope.selectedItem	= item;
            		$scope.selectedID	= item.id;
            		//$scope.selectedSex	= item.genCd;
            		//animateStyleClip($(e.currentTarget), item);
        			//setClippingArea(item);
        			////////////setGenderCate(item);
            		searchDetection(item);
            		$timeout(setDetectionSlide, 10);
            		
        			
        			//scrollToMid(e);
            		
            		if(flag == "디텍트"){
            			$scope.ga(flag, "");
            		}else if(flag == "카테고리"){
            			$scope.ga(flag, item.ctgName);
            		}
        			
        			$scope.sendTclick("m_DC_StyleReco_Swp_Rel_A" + (idx+1));
            	};
            	
            	function searchDetection(item){
            		$('#loading').show();
            		
            		var sex = StyleRecom.determineSex(item, $scope.PROD_SEX, $scope.CATE_NO, $scope.loginInfo.genSctCd);
            		
            		/*var sex = item.genCd;
            		
            		var prdGen = commInitData.query.prdGen;
					var prdCtg = "" + $scope.CATE_NO;
					var memSex = $scope.loginInfo.genSctCd;
					if(item.genOnly != ""){
						// 전용 성별 카테고리
						sex = item.genOnly;
					}else if(prdGen == "F" || prdGen == "M"){
						// 상품 성별
						sex = prdGen;
					}else{
						if(prdCtg == "5"){
							// 아동복
							sex = genCd;
						}else{
							// 기타
							if(memSex == "F" || memSex == "M"){
								// 현재 로그인정보의 성별 정보로 세팅
								sex = memSex;
							}else{
								sex = genCd;
							}
						}
					}*/
            		
            		//id, sex, cate, subcate, cb, limitCnt
            		//var rtn = StyleRecom.search(item.id, sex, item.category, commInitData.query.cate, searchRecomCallback);//, $scope.GOODS_NO, 'style', $scope.appObj.isApp);
            		var obj = {
        				"id"		: item.id,
        				"sex"		: sex,
        				"cate"		: item.category,
        				"subcate"	: commInitData.query.cate,
        				"sort"		: $scope.currentSort.value,
						"goodsNo"	: $scope.GOODS_NO,
						"screen"	: "style"
            		};
            		if(item.sub_category.score > 0.2){
            			obj.sub_cate = item.sub_category.code;
            		}
            		var rtn = StyleRecom.search(obj, searchRecomCallback);//, $scope.GOODS_NO, 'style', $scope.appObj.isApp);
            		
            		if(rtn === false){
            			$('#loading').hide();
            			setDataLoaded();
        				$scope.alert_2016("데이터를 불러올 수 없습니다.<br/>잠시 후에 다시 시도해 주세요.");
            		}
            	};
            	
            	/**
            	 * 디텍트 화면 스크롤
            	 */
            	function setDetectionSlide(){
            		var LS = angular.element(".category_slider").scope();
            		var ul = angular.element(".category_slider ul");
            		var li = angular.element(".category_slider li.on");
            		var wn = angular.element(window);
            		var x = Math.round(li.offset().left - ul.offset().left + li.width() / 2 - wn.width() / 2);
            		LS.lotteSliderMoveXPos(-x, 250);
            	};
            	
            	/**
            	 * 이미지 위치 조정
            	 */
            	function setImagePosition(){
    				angular.forEach($scope.DETECT_LIST, function(item, idx){
    					var rx1 = item.rx1;
    					var rx2 = item.rx2;
    					var ry1 = item.ry1;
    					var ry2 = item.ry2;
    					var cx = rx1 + (rx2 - rx1) / 2;
    					var cy = ry1 + (ry2 - ry1) / 2;
    					item.cx = Math.round(cx);
    					item.cy = Math.round(cy);
    				});
            		
        			/*$timeout(function(){
        				var list = $scope.DETECT_LIST;
        				angular.element(".style_clip_list li span.style_img img").each(function(idx, itm){
        					var img = angular.element(itm);
        					var item = list[idx];
        					var rx1 = item.rx1;
        					var rx2 = item.rx2;
        					var ry1 = item.ry1;
        					var ry2 = item.ry2;
        					var rwh = Math.min((rx2 - rx1), (ry2 - ry1));
        					var cx = rx1 + (rx2 - rx1) / 2;
        					var cy = ry1 + (ry2 - ry1) / 2;
        					item.cx = Math.round(cx);
        					item.cy = Math.round(cy);
        					img.width(99 / rwh * 100);
        					var w = img.width();
        					var h = img.height();
        					var l = Math.round(w / 100 * (cx - rwh/2));
        					var t = Math.round(h / 100 * (cy - rwh/2));
        					img.css({position:"absolute", left:-l, top:-t, opacity:1});
        				});
        			}, 10);*/
            	};
            	
            	// 닷컴 서버 파일업로드
        		var upload_path = "http://www.lotte.com/display/insertStyleRecoUploadImage.lotte";
            	
        		/**
        		 * 업로드 성공
        		 */
        		function uploadSuccess(data){
        			$('#loading').hide();
                	//var json = JSON.parse(data);
        			if(typeof(data) == "string"){ data = JSON.parse(data); }
        			//alert('success');
        			if(data.styleUpImgInfo){
        				$scope.goStyleRecom(data.styleUpImgInfo);
        			}
                };
                
                /**
                 * 업로드 에러
                 */
                function uploadError(){
                	$('#loading').hide();
                	$('body').fadeIn();
                	$scope.alert_2016("파일을 전송하지 못했습니다.<br/>잠시 후 다시 시도해 주세요.");
                	$("input#file_input").prop('disabled', false);
                }
                
                $scope.detectFile = function(){
                	$('#loading').show();
    				$('body').fadeIn();
                	var file = document.querySelector('#file_input');
        	        var extension = file.files[0].type;
        	        var uploadSizeLimit = 8;
        	        var size = file.files[0].size;
        	        var max = uploadSizeLimit*1000*1000;// 서버에서 체크하는 방식과 맞춤
        	        
        	        //console.log("extension " + extension);

        	        if(!checkExt(extension)) {
                        alert('지원하지 않는 확장자입니다.');
                        $('#loading').hide();
    					$('body').fadeIn();
                        return;
                    }
        	        
        	        if( size > max ) {
                        alert( '사진 용량이 '+uploadSizeLimit+'MB 초과하였습니다.' );
                        $('#loading').hide();
    					$('body').fadeIn();
                        return;
                    }
                	getOrientation(file.files[0], $scope.cbFileExif);
                };
                
                function checkExt( fileType ){
                    if( fileType == "image/jpeg" || fileType == "image/png" ) return true;
                    return false;
                }
                
                $scope.uploadFile = function(rotation){
                	$("input#file_input").prop('disabled', true);
                	var formData = new FormData();
                	formData.append("file", document.getElementById("file_input").files[0]);
                	formData.append("rote_code", rotation);
                	//console.log(formData);
        			$.ajax({
        				type : "post",
                        data : formData,
                        async : false,
                        cache : false,
        	            url: upload_path,
        	            success: uploadSuccess,
        	            error: uploadError,
        	            contentType: false,
        	            processData: false
        	        });
                };
                
        		function getOrientation(file, callback) {
        			  var reader = new FileReader();
        			  reader.onload = function(e) {

        			    var view = new DataView(e.target.result);
        			    if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
        			    var length = view.byteLength, offset = 2;
        			    while (offset < length) {
        			      var marker = view.getUint16(offset, false);
        			      offset += 2;
        			      if (marker == 0xFFE1) {
        			        if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
        			        var little = view.getUint16(offset += 6, false) == 0x4949;
        			        offset += view.getUint32(offset + 4, little);
        			        var tags = view.getUint16(offset, little);
        			        offset += 2;
        			        for (var i = 0; i < tags; i++)
        			          if (view.getUint16(offset + (i * 12), little) == 0x0112)
        			            return callback(view.getUint16(offset + (i * 12) + 8, little));
        			      }
        			      else if ((marker & 0xFF00) != 0xFF00) break;
        			      else offset += view.getUint16(offset, false);
        			    }
        			    return callback(-1);
        			  };
        			  reader.readAsArrayBuffer(file);
        			}
        		
        		$scope.cbFileExif = function(a){
        			//console.log('exif ' + a);
        			$scope.uploadFile(a);
        		};
            	
            	/**
            	 * 추천 영역 선택
            	 */
            	/*$scope.selectStyleClip = function(e, item, idx){
            		$scope.selectedID = item.id;
            		animateStyleClip($(e.currentTarget), item);
        			setClippingArea(item);
        			setGenderCate(item);
        			
        			scrollToMid(e);
        			
        			$scope.sendTclick("m_DC_StyleReco_Swp_Rel_A" + (idx+1));
            	};*/
            	
            	/**
            	 * 추천 영역 애니메이션
            	 */
            	function animateStyleClip(a, item){
            		var li = a.parent();
            		if(li.hasClass("on")){ return; }
            		
            		var si = li.siblings();
            		si.find(".dummy").stop(true);
            		si.find(".style_ani").css("background-position", "0 0");
            		si.removeClass("on");

            		var opt = {
            			duration: 400,
            			progress: styleScoreProgress,
            			easing: $scope.checkJQueryEasing("easeOutQuad")
            		};
            		var dummy = a.find(".dummy");
            		var pct = item.score;
            		dummy.css("left", 0);
            		try{
            			dummy.animate({left:pct}, opt);
            		}catch(e){
            			console.warn("animateStyleClip animate error");
            			dummy.css("left", pct);
            			styleScoreProgress({ani:dummy});
            		}
            		li.addClass("on");
            	};
            	
            	/**
            	 * 추천 영역 마스킹
            	 */
            	function setClippingArea(item){
            		var box = $(".clipping_beauty .clip_box");
            		var img = box.find("img");
            		var w = img.width();
            		var h = img.height();
            		//console.log("w " + w);
            		//console.log("h " + h);
            		angular.element('.clipping_beauty').css('width', w +'px');
            		if(w > h){
            			angular.element('.clipping_beauty').css('padding-top', '20px');
            		}
            		var top = Math.round(h / 100 * item.ry1);
            		var btm = h - Math.round(h / 100 * item.ry2);
            		var lft = Math.round(w / 100 * item.rx1);
            		var rgt = w - Math.round(w / 100 * item.rx2);
            		
            		var dummy = box.find(".dummy");
            		dummy.stop(true);
            		var css = {
            			left:lft,
            			right:rgt,
            			top:top,
            			bottom:btm
            		};
            		var opt = {
            			duration:250,
            			progress:styleMaskProgress,
            			easing: $scope.checkJQueryEasing("easeOutQuad")
            		};
            		try{
            			dummy.animate(css, opt);
            		}catch(e){
            			console.warn("setClippingArea animate error");
            			dummy.css(css);
            			styleMaskProgress({elem:dummy});
            		}
            	};
            	
            	/**
            	 * 정확도 애니메이션 이벤트
            	 */
            	function styleScoreProgress(ani, prog, rem){
            		var dummy = $(ani.elem);
            		var targ = dummy.parent();
            		var p = Math.round(parseInt(dummy.css("left"), 10));
            		var n = Math.round(p / 2) - 1;
            		if(n < 0){ n = 0; }
            		var x = (n % 10) * 110;
            		var y = (Math.floor(n / 10) + 1) * 110;
            		targ.css("background-position", -x + "px " + -y + "px");
            		targ.find(".style_pct em").text(p);
            	};
            	
            	/**
            	 * 마스킹 애니메이션 이벤트
            	 */
            	function styleMaskProgress(ani, prog, rem){
            		var dummy = $(ani.elem);
            		var box = dummy.parent();
            		var lft = parseInt(dummy.css("left"), 10);
            		var rgt = parseInt(dummy.css("right"), 10);
            		var top = parseInt(dummy.css("top"), 10);
            		var btm = parseInt(dummy.css("bottom"), 10);
            		box.find(".clip_top").css({"height":top});
            		box.find(".clip_btm").css({"height":btm});
            		box.find(".clip_lft").css({"width":lft, "top":top, "bottom":btm});
            		box.find(".clip_rgt").css({"width":rgt, "top":top, "bottom":btm});
            		box.find(".clip_brd").css({"left":lft, "right":rgt, "top":top, "bottom":btm});
            	};
            	
            	/**
            	 * 성별/카테고리 선택
            	 */
            	/*function setGenderCate(item){
            		switch(item.category){
	            		case 1:
	            		case 8:
	            			$scope.selectedSex = "F";
	            			break;
	            		default:
	            			if($scope.selectedSex == ""){
	            				if(genderCode == "M" || genderCode == "F"){
	            					$scope.selectedSex = genderCode;
	            				}else if($scope.loginInfo.genSctCd == "M" || $scope.loginInfo.genSctCd == "F"){
		            				$scope.selectedSex = $scope.loginInfo.genSctCd;
		            			}else{
		            				$scope.selectedSex = "A";
		            			}
	            			}
	            			break;
            		}
            		resetCategory(item.category);
            		resetCateSlider();
            		
           			searchRecomProd();
            	};*/
            	
            	/**
            	 * 성별 선택
            	 */
            	/*$scope.selectGender = function(item, idx, e){
            		if($scope.selectedSex == item.data){ return; }
            		$scope.selectedSex = item.data;
            		$timeout(selectGenderDelay, 1);
            		
            		scrollToMid(e);
            		
            		$scope.sendTclick("m_DC_StyleReco_Clk_tap_" + (idx+1));
            	};*/
            	
            	/**
            	 * 성별 선택 후 카테고리 설정
            	 */
            	/*function selectGenderDelay(){
            		if(getSelectedCate().length == 0){
                		var len = $scope.CATE.length;
                		var ct;
                		for(var i=0; i<len; i++){
                			ct = $scope.CATE[i];
                			ct.selected = (i==0);
                		}
            		}
            		resetCateSlider();
            		
            		searchRecomProd();
            	};*/
            	
            	/**
            	 * 카테고리 슬라이더 리셋
            	 */
            	/*function resetCateSlider(){
            		$timeout(function(){
            			if(angular.element(".slider_wrap > div").length > 0){
            				angular.element(".slider_wrap > div").scope().reset();
            			}
            		}, 50);
            	};*/
            	
            	/**
            	 * 카테고리 선택 초기화
            	 */
            	/*function resetCategory(cate){
            		var len = $scope.CATE.length;
            		var ct;
            		for(var i=0; i<len; i++){
            			ct = $scope.CATE[i];
            			ct.selected = (ct.data == cate);
            		}
            	};*/
            	
            	/**
            	 * 카테고리 선택
            	 */
            	/*$scope.selectCategory = function(item, e){
            		var cate = getSelectedCate();
            		if(cate.join("") == item.data){ return; }
            		resetCategory(item.data);//item.selected = ! item.selected;
            		searchRecomProd();
            		
            		scrollToMid(e);

            		var tc = item.tclick;
            		var s = "A";
            		if($scope.selectedSex == "M"){
            			s = "B";
            			if(tc == 6){ tc = 4; }
            		}else if($scope.selectedSex == "A"){
            			s = "C";
            		}
            		$scope.sendTclick("m_DC_StyleReco_Swp_Cate_" + s + tc);
            	};*/
            	
            	/**
            	 * 카테고리 그룹 선택
            	 */
            	$scope.selectCateGrp = function(item, idx){
            		var tclick = 'm_DC_' + $scope.screenID + '_clk_cate_' + item.cate;
            		window.location.href = LotteCommon.styleRecomUrl + "?img=" + commInitData.query.img + "&"+ $scope.getBaseParam(true) + "&cate=" + item.cate + "&tclick=" + tclick;
            	};

            	/**
            	 * 추천상품 검색
            	 */
            	/*function searchRecomProd(cd){
            		$('#loading').show();
            		//console.log('searchRecomProd');
            		var cate = getSelectedCate();
            		if(!cate || cate.length == 0){
            			cate = $scope.CATE[0].data;
            			$scope.CATE[0].selected = true;
            		}else{
            			cate = cate[0];
            		}
            		//console.log('id ' + $scope.selectedID);
            		//console.log('selectedSex ' + $scope.selectedSex);
            		//console.log('cate ' + cate);
            		//console.log(cd || commInitData.query.cate);
            		var rtn = StyleRecom.search($scope.selectedID, $scope.selectedSex, cate, (cd || commInitData.query.cate), searchRecomCallback);//, $scope.GOODS_NO, 'style', $scope.appObj.isApp);
            		
            		if(rtn === false){
            			$('#loading').hide();
        				$scope.alert_2016("2데이터를 불러올 수 없습니다.<br/>잠시 후에 다시 시도해 주세요.");
            		}
            	};*/
            	
            	/**
            	 * 선택된 카테고리 구하기
            	 */
            	/*function getSelectedCate(){
            		//console.log($scope.CATE);
            		var ct;
            		var len = $scope.CATE.length;
            		if($scope.selectedSex == "M"){
            			len = 4;
            		}
            		var cate = [];
            		for(var i=0; i<len; i++){
            			ct = $scope.CATE[i];
            			if(ct.selected){
            				cate.push(ct.data);
            			}
            		}
            		return cate;
            	};*/
            	
            	/**
            	 * 추천상품 검색결과 콜백 함수
            	 */
            	function searchRecomCallback(list){
            		$scope.PROD_ORIGIN_LIST = list;
            		if(list.length == 0){
            			$scope.PROD_LIST.length = 0;
            		}
            		MAX_PAGE = Math.ceil(list.length / PAGE_COUNT);
            		page_no = 0;
            		fillProductList();
            		
            		setDataLoaded();
            		$timeout(function(){ $('#loading').hide(); }, 0);
            	};
            	
            	/**
            	 * 상품 목록 채우기
            	 */
            	function fillProductList(){
            		if(page_changing){ return; }
            		if(page_no >= MAX_PAGE){ return; }
            		
            		page_changing = true;
            		$timeout(fillProductListDelay, 10);
            	};
            	
            	function fillProductListDelay(){
            		page_no++;
            		var n = page_no * PAGE_COUNT;
            		$scope.PROD_LIST = $scope.PROD_ORIGIN_LIST.slice(0, n);
            		
            		page_changing = false;
            	};
            	
            	/**
            	 * 상품상세 링크
            	 */
            	$scope.gotoProductDetail = function(item, idx){
            		$scope.ga("추천상품", "상품_" + (idx+1));
            		
            		item.curDispNoSctCd = 14;
        			var n = idx + 1;
            		$scope.productView(item, null, null, "m_DC_StyleReco_Clk_Prd_idx" + (n < 10 ? "0"+n : n));
            	};
            	
            	/**
            	 * 상품 URL 구하기
            	 */
            	$scope.getProductUrl = function(item, idx){
            		item.curDispNoSctCd = 14;
        			var n = idx + 1;
            		return $scope.getProductViewUrl(item, "m_DC_StyleReco_Clk_Prd_idx" + (n < 10 ? "0"+n : n), true);
            	};

            	var WN, SC, HS, CB, WR;
            	/**
            	 * 윈도우 스크롤 이벤트
            	 */
            	function windowScrollListener(e){
            		memoriseElements();
    				var wst = WN.scrollTop();
    				var wnh = WN.outerHeight();
    				var wrh = WR.outerHeight();
    				var cot = SC.length==0 ? 0 : SC.offset().top;
    				var hdh = HS.height();
    				var trf;
    				
    				// 카테고리 상단 고정
    				/*if(wst + hdh >= cot && cot > 0){
    					if($scope.fixCategory == false){
    						$scope.fixCategory = true;
    					}
    				}else{
    					if($scope.fixCategory == true){
    						$scope.fixCategory = false;
    					}
    				}*/
    				
    				// 상품 페이징
    				if($scope.PROD_LIST.length > 0){
    					if(wst + wnh * 3 >= wrh){
    						fillProductList();
    					}
    				}
            	};
            	
            	/**
            	 * 페이지 스크롤 하기
            	 */
            	/*function scrollToMid(e){
            		if(e.offsetX == undefined || e.pageX == undefined){ return; }
            		memoriseElements();
            		var wst = WN.scrollTop();
            		if(wst < 47){
            			$(window).scrollTop(47);
            		}
            	};*/
            	
            	/**
            	 * 엘레먼트 지정
            	 */
            	function memoriseElements(){
            		if(WN == undefined || HS == undefined || CB == undefined || WR == undefined){
            			WN = angular.element($window);
            			HS = angular.element("#head_sub");
            			CB = angular.element(".clipping_beauty");
            			WR = angular.element("#wrapper");
            		}
            		if(SC == undefined || SC.length == 0){
            			SC = angular.element("#style_category");
            		}
            	};
            	
            	/**
        		 * Google Analytics
        		 */
        		$scope.ga = function(act, lab){
        			var ctg = "MO_스타일추천";
        			if($scope.appObj.isApp){
        				ctg = "APP_스타일추천";
        			}
        			LotteGA.evtTag(ctg, act, lab);
        		};
            	
            	
            	// INITIALIZE
            	initStyleRecom();
            	
				/* [MO] 스타일추천 이벤트 관련 수정 건 2017.06.07 */
				$scope.styRecomBnrUrl = function (){
					window.location.href = LotteCommon.prdlstUrl + '?curDispNo=5407118&' + $scope.baseParam +'&tclick=m_DC_StyleReco_Clk_event';
				};
            }
        };
    }]);

})(window, window.angular);