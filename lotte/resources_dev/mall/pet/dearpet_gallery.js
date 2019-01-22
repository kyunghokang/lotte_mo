(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'lotteNgSwipe',
        'lotteSns',
        'ngPinchZoom',
        'dearpetSubCategory'
    ]);

    app.controller('DearpetGalleryCtrl', ['$http','$scope', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteStorage', '$timeout', function($http, $scope, $window, $location, LotteCommon, commInitData, LotteStorage, $timeout) {
    	$scope.isMain = false;
    	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = ""; // 서브헤더 타이틀
        $scope.shareCodeis = "MIMI TOUTOU";
        $scope.screenID = "DearpetGallary"; // 스크린 아이디
        $scope.pageLoading = true;
		$scope.dispNo = "";
		$scope.productListLoading = true;
		$scope.productMoreScroll = true;
        $scope.sheadHide = false;
        $scope.shareRendingURL = location.href;

        // 내글, 좋아한 글 201706022
        $scope.myListState = commInitData.query['type'] == 'mySwagList' ? true : false;
        $scope.likeitPost = commInitData.query['type'] == 'myLikeList' ? true : false;

        // 앱에서 뽐내기 쓰고 들어올경우 추가된 파라미터가 없음으로 추가
        if( !$scope.myListState && !$scope.likeitPost ) {
            commInitData.query['chkDepth'] = 3;
        }
        
        // 뽐내기 앱에서 돌아올시 cate코드 변
        if( parseInt( commInitData.query['beforeNo'] ) === 5564054 ) {
            commInitData.query['beforeNo'] = 5566305;
        }
        
		/*
		 * 스크린 데이터 초기화
		 */
		($scope.screenDataReset = function() {
			$scope.screenData = {
				page: 0,
				disp_name: "",
				dispNo: '',
				curDispNo: '',
				cateNodeName: [],
				top_banner : [],
				showAllCategory: false,
				selectCate1: commInitData.query['beforeNo'],
				selectCate2: 0,
				selectCate3: 0,
				selectedCategory: 0,
				cate_list: [],
				gallery_list: [],
				dispGallery :[], //갤러리 오브젝트
				pageSize : 10,
				pageEnd: false,
				galleryTotal : 0,
                user_swag_count : 0
			}
		})();

		 //파라메터 get
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
		var scrollback = commInitData.query['scrollback'];
		$scope.screenData.curDispNo = getParameterByName('curDispNo');

		if($scope.screenData.curDispNo == '5566436'){
			$scope.screenData.disp_name = "미뚜그램";
		} else if($scope.screenData.curDispNo == '5566437'){
			$scope.screenData.disp_name = "포토후기";
		} else {
			$scope.screenData.disp_name = "뽐내기";
		}

        // 20170622 좋아요 게시물 목록 보기로 페이지에 들어올경우
        if( $scope.likeitPost ) {
            $scope.screenData.disp_name = "좋아한 게시물 ♡";
            //$scope.pageName = "좋아요";
        }

		$scope.subTitle = $scope.screenData.disp_name;
        function myPostCheckID () {
            if( $scope.loginInfo.isLogin) {
                try{  if( !$scope.myLoginID ) { $scope.myLoginID = getLoginInfo().loginId;  }}
                catch(e) {
                    $timeout(function(){
                        $scope.myLoginID = getLoginInfo().loginId;
                    },500);
                }
            }
        }
		/*
		 * 스크린 데이터 로드
		 */

		/**
		 * @ngdoc function
		 * @name ProdListCtrl.function:loadScreenData
		 * @description
		 * 화면 데이터 로드
		 * @example
		 * $scope.loadScreenData();
		 */
		$scope.loadScreenData = function(param) {
			console.log("스크린 데이터 로드...");
			if($scope.screenData.pageEnd) {
				return;
			}

            $scope.screenData.page++;
			if($scope.screenData.page > 1) {
				$scope.productListLoading = true;
			} else {
                // 20170621 수정
				if( !$scope.screenData.cate_list.length ) $scope.pageLoading = true;
			}

			var url = LotteCommon.petMallgalleryData+'?dispNo='+$scope.screenData.curDispNo+'&page='+$scope.screenData.page+'&pageSize='+$scope.screenData.pageSize;
            // 20170622
            if( $scope.likeitPost ) url = LotteCommon.petMallgalleryLikeData +'?page='+$scope.screenData.page+'&pageSize='+$scope.screenData.pageSize+"&type="+commInitData.query['type']
            if( param ) for( var i in param ) url+="&"+i+"="+param[i];
            if($scope.myListState ) url+="&type="+commInitData.query['type'];
            // end 20170621
            $http.get(url)
			.success(function(data) {
				var contents = [];
				contents = data['dearpet_gallery'];

                myPostCheckID();

                /*
                try{ // 강아지, 고양이 임시 삭제
                    var catLength = contents.cate_list.items.length;
                    for( var i=0; i<catLength; ++i ) {
                        for( var d =0; d<2; ++d ) {
                            if( contents.cate_list.items[i].disp_no == 5566302 || contents.cate_list.items[i].disp_no == 5566303 ) {
                                contents.cate_list.items.splice( i, 1 );
                            }
                        }
                    }
                } catch(e){ }
                */

                // 내글 보기가 아닐경우
                if(!$scope.myListState) {
                    try {
                        $scope.screenData.user_swag_count = contents.swag_count;
                    } catch(e) {
                        $scope.screenData.user_swag_count = 0;
                    }
                }

				if(contents.gallery_list != null) {
					$scope.screenData.galleryTotal = contents.max_count;
					if($scope.screenData.page > 1) {
                        var nlist = $scope.screenData.gallery_list.concat( contents.gallery_list.items );
                        $scope.screenData.gallery_list = nlist;
					} else {
						$scope.screenData.gallery_list = contents.gallery_list.items;
					}
					if($scope.screenData.curDispNo == '5566438') {
						$scope.commentListIndex = -1;
					}

					$timeout(function(){
                        if(!$scope.screenData.gallery_list) $scope.screenData.gallery_list = [];
						for(var i=0; i< $scope.screenData.gallery_list.length; i++){
							$scope.screenData.gallery_list[i].big = false;
							$scope.screenData.gallery_list[i].open = false;
							if($("#swaglist_cont" + i).height() > 35){
								$scope.screenData.gallery_list[i].big = true;
							}
						}
					}, 100);

					if($scope.screenData.galleryTotal < $scope.screenData.page*$scope.screenData.pageSize) {
						$scope.screenData.pageEnd = true;
						$scope.productMoreScroll = false;
					}

				} else {
                    alert( "등록된 게시물이 없습니다." );
                    $scope.screenData.gallery_list = [];
                    $scope.screenData.pageEnd = true;
                    $scope.productMoreScroll = false;
                    $scope.productListLoading = false;
					$scope.pageLoading = false;
                }

                if( !$scope.screenData.cate_list.length ) {
                    $scope.screenData.cate_list = contents.cate_list.items;
                    if( contents.cate_list.items) $scope.sendCategoryData( contents.cate_list.items );
                }

                $scope.productListLoading = false;
                $scope.pageLoading = false;
			});
		};

        // 20170619 박해원 서브카테고리
        $scope.getSubCateDataFunc;
        $scope.$on('getSubCateData', function(event, callFnc ) {
            if( !$scope.getSubCateDataFun && callFnc ) $scope.getSubCateDataFunc = callFnc;
            try{
                if($scope.screenData.cate_list.length) {
                    $scope.sendCategoryData ($scope.screenData.cate_list);
                }
            } catch(e) {};
        });

        $scope.sendCategoryData = function( data ){
            if(!$scope.getSubCateDataFunc) return;
            // 좋아한 게시물 일경우
            if( commInitData.query['beforeNo'] == '5566305' && $scope.likeitPost ) {
                angular.forEach(data, function(e,n) {
                    if( commInitData.query['beforeNo'] == e.disp_no ) {
                        e.extra = [ {
                            disp_nm : "좋아한 게시물",
                            hideArrow:true
                        }]
                    }
                })
            }
            $scope.getSubCateDataFunc(data);
        };

        $scope.contMoreClick = function(item){
            try {
                item.open = !item.open;
                item.more = !item.more;
            } catch(e) {}
        };

        $scope.commentViewClick = function(item,idx){
            if($scope.commentListIndex == idx){
                //$scope.commentListIndex = "";
            }else{
                if( $scope.likeitPost ) { // 좋아한 게시물일경우
                    $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn15");
                } else {
                    $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn07");
                }
                $scope.commentListIndex = idx;
                // 댓글 추가 //
                $http.get(LotteCommon.petCommentData + "?bbc_no="  + item.bbc_no)
                .success(function (data) {
                    $scope.sendTclick('');
                    $scope.commentViewFlag = !$scope.commentViewFlag;
                    $scope.commentListData = [];

                    if(data.comment_list.comment != null){
                        //" 가공처리
                        for(var i=0; i<data.comment_list.comment.items.length; i++){
                            data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&#34;").join('"');
                            data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&lt;").join('<');
                            data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&gt;").join('>');
                        }
                        $scope.commentListData = data.comment_list.comment.items; //
                        //console.log($scope.commentListData);
                    }

                })
            }
        };

		// 세션에서 가저올 부분 선언
		var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
		var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
		var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');

		if(StoredLoc == window.location.href && $scope.locationHistoryBack) {
			var StoredData = JSON.parse(StoredDataStr);
			$scope.pageLoading = false;

			$scope.pageOptions = StoredData.pageOptions;
			$scope.screenData = StoredData.screenData;
			$timeout(function() {
				angular.element($window).scrollTop(StoredScrollY);
			},800);

            myPostCheckID();
		} else {
			$scope.loadScreenData();
			// 뽐내기 수정 후 현재 위치 값 설정
			if(scrollback == 'y'){
				$timeout(function() {
					angular.element($window).scrollTop(StoredScrollY);
				},800);
			}
		}
		/**
		 * unload시 관련 데이터를 sessionStorage에 저장
		 */
		angular.element($window).on("unload", function(e) {
			var sess = {};
			//sess.templateType = $scope.templateType;
			sess.pageOptions = $scope.pageOptions;
			sess.screenData = $scope.screenData;
			if (!commInitData.query.localtest && $scope.leavePageStroage) {
				LotteStorage.setSessionStorage($scope.screenID+'Loc', $location.absUrl());
				LotteStorage.setSessionStorage($scope.screenID+'Data', sess, 'json');
				LotteStorage.setSessionStorage($scope.screenID+'ScrollY', angular.element($window).scrollTop());
			}
		});
    }]);
    app.filter('hidestr', function() {
		  return function(id) {
			  	var conID = "";
	    		if(id != undefined){
		    	    conID = id.substr(0,3);
		    	    for(var i=3;i<id.length; i++){
		    	        conID += "*";
		    	    }
	    		}
	    	    return conID;
		  }
	 });

    app.directive('lotteContainer',['$window','LotteCommon', '$timeout', function($window, LotteCommon, $timeout) {
        return {
            templateUrl : '/lotte/resources_dev/mall/pet/dearpet_gallery_container.html',
            replace : true,
            link : function($scope, el, attrs) {
            	$scope.mallMainClick = function(tclick) {
                	var url = LotteCommon.petMallMainUrl + "?" + $scope.baseParam;
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }
				$scope.mallProductClick = function(item, tclick) {
                	var url = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&goods_no=" + item.goods_no + "&curDispNoSctCd=95";
					if (tclick) {
						url += "&tclick=" + tclick;
					}
					$window.location.href = url;
                }

                /* 아이디 마스킹처리 */
                $scope.idChange = function(id){
		    	    var conID = id.substr(0,3);
		    	    for(var i=3;i<id.length; i++){
		    	        conID += "*";
		    	    }
		    	    return conID;
		    	}

				var $win = angular.element($window),
				$body = angular.element("body"),
				winH = $win.height(),
				bodyH = $body[0].scrollHeight,
				scrollRatio = 4.0, // 윈도우 높이의 4배
				moreLoadTime = 0;

				$win.on("scroll" , function (e) {
					if (!$scope.productMoreScroll || $scope.productListLoading || $scope.pageLoading) {
						return ;
					}
					bodyH = $body[0].scrollHeight;

					if ($win.width() >= 640) { // 그리드가 2단 이상일 경우 로드 비율을 낮춘다
						scrollRatio = 2; // 윈도우 높이의 2배
					} else {
						scrollRatio = 4.0; // 윈도우 높이의 4배
					}

					if( bodyH - (winH * scrollRatio) > winH && $win.scrollTop() + winH >= bodyH - (winH * scrollRatio)) {
						$scope.loadScreenData();
					}
				});

				// 20170411 - likearts 팝업 갤러리 확대축소 기능 추가
				$scope.popOption = {
					open : false,
					cnt : 0,
					data : [],
					zoomPopup : function( c, p, single ){
						$scope.popOption.cnt = c;
						$scope.popOption.data = single ? [$scope.screenData.gallery_list[p]] : $scope.screenData.gallery_list[p].img_list.items;
						$scope.popOption.popState();
					},
					next : function() {
						if( $scope.popOption.cnt < $scope.popOption.data.length-1 ) $scope.popOption.cnt++;
					},
					prev : function() {
						if( $scope.popOption.cnt > 0 ) $scope.popOption.cnt--;
					},
					popState : function() {
						$scope.popOption.open = !$scope.popOption.open;
						if( $scope.popOption.open ) angular.element("body").addClass('no-scroll');
						else angular.element("body").removeClass('no-scroll');
					}
				}

                // 20170621 filter 내글목록
                $scope.myCheckBox = function(){
                    if (!$scope.loginInfo.isLogin) { /*로그인 안한 경우*/
						alert('로그인 후 이용하실 수 있습니다.');
						$scope.loginProc();
						return;
					}
                    if(!$scope.myListState&&!$scope.screenData.user_swag_count) {
                        alert( '우리 아이 뽐내기 소식이 아직 없어요~\n어서 우리 아이를 뽐내보세요~' );
                        return;
                    }
                    $scope.myListState = !$scope.myListState;
                    setFilter();
                }
                function setFilter() {
                    //$scope.screenData.gallery_list = [];
                    $scope.screenData.galleryTotal = 0;
                    $scope.screenData.page = 0;
                    $scope.screenData.pageEnd = false;
                    $scope.loadScreenData( $scope.myListState? { type:'mySwagList' } : null );
                    if( $scope.myListState ) $scope.sendTclick( "m_DC_SpeDisp_Dearpet_Clk_Btn16" );
                }
                $scope.likeShowSharePop = function( shareData ){
                    $scope.sendTclick( "m_DC_SpeDisp_Dearpet_Clk_Shrlike" );
                    $scope.showSharePop(shareData);
                }
                $scope.petShare = function(){
                    $scope.sendTclick( "m_DC_SpeDisp_Dearpet_Clk_Shr" );
                    var shareName = "";
                    //try{ shareName = $scope.screenData.gallery_list[0].text } catch(e) { };
                    $scope.showSharePop({shareImg:null,prdComment:shareName,bbsNo:null});
                    $timeout(function(){
                        getScope().noCdnUrl = location.href;
                    },300);
                }
            }
        };
    }]);

    // Directive :: 카테고리
	app.directive('petMallCtg',['$window','LotteCommon', function($window, LotteCommon) {
		return {
			templateUrl: '/lotte/resources_dev/mall/pet/pet_mall_ctg_container.html',
			link: function ($scope, el, attrs)
			{
				/*
				 * 메뉴 카테고리 클릭
				 */
				$scope.menuCategoryClick = function(item) {
					$scope.menuCategory1Click(item);
				}

            	$scope.menuCategory1Click = function(item,index) {
            		if(!item.sub_cate_list) item.sub_cate_list = [];
	            	if( !item.sub_cate_list.length ){
                        var url = LotteCommon.petMalleventUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&cateDepth="+item.cate_depth;
                        url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no + '&beforeNo=' + item.disp_no;
                        $window.location.href = url;
                        return;
	                }
            		if($scope.screenData.selectCate1 == item.disp_no){
            			item.subopen = !item.subopen;
            		}else{
            			item.subopen = true;
            		}
					$scope.screenData.selectCate1 = item.disp_no;
                    $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_" + item.disp_no);
				}
				$scope.menuCategory2Click = function(item, item2) {
					$scope.menuCategory2Index = 0;
					if(!item2){
						item2 = ""; //temp
					}

					switch( item.dearpet_depth_cd.toString()) {
						case "20":
							var url = LotteCommon.petMallgalleryUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth;
							url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
							$window.location.href = url;
						break;

						// 신규 이벤트 20170406 추가
						case "21":
							var url = LotteCommon.petMalleventUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth;
							url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
							$window.location.href = url;
						break;

						default:
							var url = LotteCommon.petMallProdListUrl+"?"+$scope.baseParam+"&curDispNo="+item.disp_no+"&beforeNo="+item2.disp_no+"&cateDepth="+item.cate_depth+"&title="+item.disp_nm;
							url += "&tclick=" + 'm_DC_SpeDisp_Dearpet_Clk_' + item.disp_no;
							$window.location.href = url;
					}
				}
			}
		};
	}]);
    // Directive :: 디어펫그램
    app.directive('petMallPetgram',['$http','$window','LotteCommon','$timeout','commInitData', function($http, $window, LotteCommon, $timeout,commInitData) {
		return {
			templateUrl: '/lotte/resources_dev/mall/pet/pet_mall_petgram.html',
			link: function ($scope, el, attrs) {
				/* 추천 */
                $scope.recomm_click = function(item){
                	// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href =LotteCommon.loginUrl+'?'+$scope.baseParam+'&'+ targUrl;
        				return;
        			} else{
                        $http.get("/json/mall/pet_recomm_save.json?bbcNo="+item.bbc_no)
                        .success(function(data) {
                            if (data.result == "reg_success") { // 추천완료
                                //alert("추천하셨습니다."); // 20170620 주석 처리 박해원
                                item.like_count += 1;
                                $("#recomm_" + item.bbc_no).addClass("on");
                            }else if (data.result == "reg_duplicate") { // 중복추천
                                alert("이미 추천하셨습니다.");
                            }else if (data.result == "reg_mywrit") {   // 본인글 추천
                                alert("본인이 작성한 글에는 추천 하실 수 없습니다.");
                            }else {
                                alert("다시 한번 시도해주시기 바랍니다.");
                            }
                            if($scope.likeitPost) { // 좋아한 게시물로 들어왔을경우
                                $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn14");
                            } else {
                                $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn04");
                            }
                        })
                    }
                }
                if (commInitData.query['bbc_no'] != null){
	                $timeout(function(){
		                var param = location.search.split('&'), bbc_no = null;
		                for( var a = 0, b = param.length; a < b; a++ ) {
		                	if( param[a].split('=')[0] == 'bbc_no' ) {
		                		bbc_no = param[a].split('=')[1];
		                	}
		                }
		               	try{ document.body.scrollTop = angular.element( '#bbc_'+ bbc_no).offset().top }
		               	catch(e) { }
	                }, 300)
                }
			}
		};
	}]);
	// Directive :: 포토뷰
	app.directive('petMallPhotoview',['$window','LotteCommon', function($window, LotteCommon) {
		return {
			templateUrl: '/lotte/resources_dev/mall/pet/pet_mall_photoview.html',
			link: function ($scope, el, attrs) {

			}
		};
	}]);
	// Directive :: 뽐내기
	app.directive('petMallSwag',['$http','$window','LotteCommon','$timeout','commInitData', function($http, $window, LotteCommon, $timeout,commInitData) {
		return {
			templateUrl: '/lotte/resources_dev/mall/pet/pet_mall_swag.html',
			link: function ($scope, el, attrs) {
				//console.log("href: "+$(location).attr('href'));
				$scope.swagWriteGo = function(tclick) {
					
/*
					로그인한 경우이고 앱의 특정버전 이상인경우
					//로그인 한 경우이고 앱의 특정버전 이하인경우

					로그인 한 경우이고 웹인 경우

					로그인하지 않은 경우 앱의 특정버전 이상인경우
					//로그인하지 않은 경우 앱의 특정버전 이하인경우

					//로그인하지 않은 경우이고 웹인 경우
					로그인 안 한 경우
*/

					// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
    					//var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				//location.href = '/login/m/loginForm.do?' + targUrl;
        				$scope.loginProc(); 
        				return;
        			} else{
        				if($scope.appObj.isApp){ //앱인경우
        					//버전체크
                			if(
                			($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 276) ||// 안드로이드 체크, T롯데닷컴이 아닌 경우, 버젼체크(2.7.6 이상)
                			($scope.appObj.isAndroid && $scope.appObj.isSktApp && $scope.appObj.verNumber >= 212) ||// 안드로이드 T롯데닷컴 버전체크 (2.1.2 이상)
                			($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.verNumber >= 2690) || // ios 체크, 버젼체크(2.69.0 이상)
	    					($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.verNumber >= 235)// 아이패드 체크, 버젼체크(2.3.5 이상)
                			)
                			{
								console.log('테스트');
                				var url = LotteCommon.swagWriteUrl + "?" + $scope.baseParam + "&top=136";
								if (tclick) {
									url += "&tclick=" + tclick;
								}
								$window.location.href = url;
        					}else{ //버전이하
        						if (confirm('롯데닷컴 앱 업데이트 후 이용 가능합니다. 지금 업데이트 하시겠습니까?')) {
            	    				location.href = LotteCommon.appDown + '?' + $scope.baseParam;
            	    			}
        					}
        				} else{ //웹
        					if (confirm('롯데닷컴 앱에서 이용 가능합니다. 지금 설치하시겠습니까?')) {
        	    				location.href = LotteCommon.appDown + '?' + $scope.baseParam;
        	    			}
        				}

        			}
                }
				/* 추천 */
                $scope.recomm_click = function(item){
                	// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href =LotteCommon.loginUrl+'?'+$scope.baseParam+'&'+targUrl;
        				return;
        			} else{
                        $http.get("/json/mall/pet_recomm_save.json?bbcNo="+item.bbc_no)
                        .success(function(data) {
                            if (data.result == "reg_success") { // 추천완료
                                //alert("추천하셨습니다.");
                                item.like_count += 1;
                                $("#recomm_" + item.bbc_no).addClass("on");
                            }else if (data.result == "reg_duplicate") { // 중복추천
                                alert("이미 추천하셨습니다.");
                            }else if (data.result == "reg_mywrit") {   // 본인글 추천
                                alert("본인이 작성한 글에는 추천 하실 수 없습니다.");
                            }else {
                                alert("다시 한번 시도해주시기 바랍니다.");
                            }
                            if($scope.likeitPost) { // 좋아한 게시물로 들어왔을경우
                                $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn14");
                            } else {
                                $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn06");
                            }
                        })
                    }
                }

				// deleteComment(): 삭제
		    	$scope.deleteSwag = function(item,index) {
					var conf = confirm("글을 삭제하시겠습니까?");
					if (!conf) return false;

					$http.get(LotteCommon.petMallSwagDeleteData + "?bbcNo="  + item.bbc_no)
                	.success(function (data) {
                		if(data.comment_delete.response_code == '0000'){
                    		alert("삭제되었습니다");
                    		$scope.screenData.gallery_list.splice(index, 1);
                    		$scope.modifyOpen = null;
                        }
					})

				}

		    	/* 해당 리스트 삭제 레이어  */
		    	$scope.modifyOpen;
				$scope.modifyClick = function(item,idx){
					if($scope.modifyOpen == idx){
						$scope.modifyOpen = null;
						$("#swaglist_" + item.bbc_no).removeClass("on");
					}else{
						$scope.modifyOpen = idx;
						$("#swaglist_" + item.bbc_no).addClass("on");
					}
				};

		        // 레이어 닫기
                $scope.hideModify = function(item,idx) {
                	$scope.modifyOpen = null;
                	$("#swaglist_" + item.bbc_no).removeClass("on");
                };

				$scope.getswagRewriteUrl = function(item, index) {
					var params = $scope.baseParam + '&bbcNo=' + item.bbc_no;
		    		return LotteCommon.swagRewriteUrl + "?" + params;
		    	};
			}
		};
	}]);

    // Directive :: 뽐내기
    app.directive('petMallLike',['$http','$window','LotteCommon','$timeout','commInitData', function($http, $window, LotteCommon, $timeout,commInitData) {
        return {
            templateUrl: '/lotte/resources_dev/mall/pet/pet_mall_like.html',
            replace:true,
            link : function( $scope, el, attrs ) {

                $scope.swagWriteGo = function(tclick) {
					// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
    					var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = LotteCommon.loginUrl+$scope.baseParam+'&'+ targUrl;
        				return;
        			} else{
        				if($scope.appObj.isApp){ //앱인경우
        					//버전체크
                			if(
                			($scope.appObj.isAndroid && !$scope.appObj.isSktApp && $scope.appObj.verNumber >= 276) ||// 안드로이드 체크, T롯데닷컴이 아닌 경우, 버젼체크(2.7.6 이상)
                			($scope.appObj.isAndroid && $scope.appObj.isSktApp && $scope.appObj.verNumber >= 212) ||// 안드로이드 T롯데닷컴 버전체크 (2.1.2 이상)
                			($scope.appObj.isIOS && !$scope.appObj.isIpad && $scope.appObj.verNumber >= 2690) || // ios 체크, 버젼체크(2.69.0 이상)
	    					($scope.appObj.isIOS && $scope.appObj.isIpad && $scope.appObj.verNumber >= 235)// 아이패드 체크, 버젼체크(2.3.5 이상)
                			)
                			{
								console.log('테스트');
                				var url = LotteCommon.swagWriteUrl + "?" + $scope.baseParam + "&top=136";
								if (tclick) {
									url += "&tclick=" + tclick;
								}
								$window.location.href = url;
        					}else{ //버전이하
        						if (confirm('롯데닷컴 앱 업데이트 후 이용 가능합니다. 지금 업데이트 하시겠습니까?')) {
            	    				location.href = LotteCommon.appDown + '?' + $scope.baseParam;
            	    			}
        					}
        				} else{ //웹
        					if (confirm('롯데닷컴 앱에서 이용 가능합니다. 지금 설치하시겠습니까?')) {
        	    				location.href = LotteCommon.appDown + '?' + $scope.baseParam;
        	    			}
        				}

        			}
                }

                /* 추천 */
                $scope.recomm_click = function(item){
                	// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+'&'+targUrl;
        				return;
        			} else{
                        $http.get("/json/mall/pet_recomm_save.json?bbcNo="+item.bbc_no)
                        .success(function(data) {
                            if (data.result == "reg_success") { // 추천완료
                                //alert("추천하셨습니다.");
                                item.like_count += 1;
                                $("#recomm_" + item.bbc_no).addClass("on");
                            }else if (data.result == "reg_duplicate") { // 중복추천
                                alert("이미 추천하셨습니다.");
                            }else if (data.result == "reg_mywrit") {   // 본인글 추천
                                alert("본인이 작성한 글에는 추천 하실 수 없습니다.");
                            }else {
                                alert("다시 한번 시도해주시기 바랍니다.");
                            }
                            if($scope.likeitPost) { // 좋아한 게시물로 들어왔을경우
                                $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn14");
                            } else {
                                $scope.sendTclick("m_DC_SpeDisp_Dearpet_Clk_Btn06");
                            }
                        })
                    }
                }

                // deleteComment(): 삭제
		    	$scope.deleteSwag = function(item,index) {
					var conf = confirm("글을 삭제하시겠습니까?");
					if (!conf) return false;

					$http.get(LotteCommon.petMallSwagDeleteData + "?bbcNo="  + item.bbc_no)
                	.success(function (data) {
                		if(data.comment_delete.response_code == '0000'){
                    		alert("삭제되었습니다");
                    		$scope.screenData.gallery_list.splice(index, 1);
                    		$scope.modifyOpen = null;
                        }
					})

				}

                /* 해당 리스트 삭제 레이어  */
		    	$scope.modifyOpen;
				$scope.modifyClick = function(item,idx){
					if($scope.modifyOpen == idx){
						$scope.modifyOpen = null;
						$("#swaglist_" + item.bbc_no).removeClass("on");
					}else{
						$scope.modifyOpen = idx;
						$("#swaglist_" + item.bbc_no).addClass("on");
					}
				};

                // 레이어 닫기
                $scope.hideModify = function(item,idx) {
                   $scope.modifyOpen = null;
                   $("#swaglist_" + item.bbc_no).removeClass("on");
                };

               $scope.getswagRewriteUrl = function(item, index) {
                   var params = $scope.baseParam + '&bbcNo=' + item.bbc_no;
                   return LotteCommon.swagRewriteUrl + "?" + params;
               };
            }
        }
    }]);

	/**
	 * @ngdoc directive
	 * @name Planshop.directive:sortCate
	 * @description
	 * 하단구분자 directive
	 */
	// 하단구분자 기획전 댓글 기능 추가
	app.directive('commentModule', ['$window','$http', 'LotteCommon', 'LotteCookie', function($window,$http,LotteCommon,LotteCookie) {
		return {
			templateUrl:'/lotte/resources_dev/mall/pet/pet_comment.html',
			replace:true,
			link:function($scope, el, attrs) {

				// INPUT 데이터 초기화
		    	$scope.input = {};
		    	$scope.input.commentTxt = '';
				$scope.commentListIndex;
				$scope.commentListClick = function(idx){
					if($scope.commentListIndex == idx){
						$scope.commentListIndex = null;
					}else{
						$scope.commentListIndex = idx;
					}
				};
				$scope.reqDetailParam = {
						NoArrList:[]
				};
				$scope.commentList = [];
				$scope.commentListPage = 1; // Comment 현재페이지

				$scope.registerCheck = function() {
					// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				//$scope.loginProc('N');
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = LotteCommon.loginUrl+'?'+$scope.baseParam+'&'+ targUrl;
        				return;
        			}
				}

				// register(): 등록
		    	$scope.register = function(cont, index) {
		    		// 로그인 안된 경우
        			if ($scope.loginInfo == null || !$scope.loginInfo.isLogin) {
        				//$scope.loginProc('N');
        				var targUrl = "targetUrl="+encodeURIComponent(location.href, 'UTF-8');
        				location.href = LotteCommon.loginUrl+'?'+$scope.baseParam +'&'+ targUrl;
        				return;
        			}
		    		var commentTxt = $scope.input.commentTxt;
					var commentTxtElement = document.querySelector('#commentTxt');
					if (commentTxt.trim().length == 0) {
						alert('댓글을 남겨주세요.');
						commentTxtElement.focus();
						return false;

					}
					if (calcBytes(commentTxt) > 400) {
						alert('댓글은 200자[한글기준] 이내로 제한되어 있습니다.');
						commentTxtElement.focus();
						return false;
					}

					$.ajax({
						type: 'POST',
						url : LotteCommon.petCommentRegData + "?bb_tgt_no="  + $scope.item.bbc_no,
						data: {cont : commentTxt}
						}).
						success(function (data) {
	                		if(data.commentInsert.response_code == "reg_success"){
	                    		alert( "등록되었습니다.");
	                    		$http.get(LotteCommon.petCommentData + "?bbc_no="  + $scope.item.bbc_no)
	    						.success(function (data) {
	    							$scope.commentData = data.comment_list; //
									$scope.commentListData = [];
									if(data.comment_list.comment != null){
										//" 가공처리
										for(var i=0; i<data.comment_list.comment.items.length; i++){
											data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&#34;").join('"');
											data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&lt;").join('<');
											data.comment_list.comment.items[i].cont =  data.comment_list.comment.items[i].cont.split("&gt;").join('>');
										}
										$scope.commentListData = data.comment_list.comment.items; //
										$scope.commentLoginidData = data.comment_list.comment.items.login_id; //
										$scope.item.reply_count += 1;
									}
	    						});
	                    		$scope.input.commentTxt = '';
	                        } else if (data.commentInsert.response_code == "reg_fail"){
	                        	alert( "등록이 실패되었습니다.")
	                		}
						}
					);
		    		return false; // form sumbmit 기본 동작 방지
		    	};

		    	/* 댓글 아이디 글자 짜르기 */
		    	$scope.idChange = function(id){
		    	    var conID = id.substr(0,3);
		    	    for(var i=3;i<id.length; i++){
		    	        conID += "*";
		    	    }
		    	    return conID;
		    	}

		    	// deleteComment(): 삭제
		    	$scope.deleteComment = function(bbcNo,index, item) {
					var conf = confirm("댓글을 삭제하시겠습니까?");
					if (!conf) return false;
					$http.get(LotteCommon.petCommentDeleteData + "?bbTgtNo="  + $scope.item.bbc_no + "&bbcNo=" + item.bbc_no)
                	.success(function (data) {
                		if(data.commentDelete.response_code == 'del_success'){
                    		alert( "삭제되었습니다.");
                    		//$scope.commentListData  =[];
                    		$scope.commentListData.splice(index, 1);
                    		$scope.item.reply_count -= 1;
                        }
					})
				}
			}
		};
	}]);

    /* header each */
    app.directive('subHeaderEach', [ '$window', '$timeout', 'AppDownBnrService',  function( $window, $timeout, AppDownBnrService ) {
        return {
            replace : true,
            link : function($scope, el, attrs) {
                $scope.subHeaderFixed = true;
                // 스크롤시 헤더 고정
				var $el = angular.element(el),
					headerHeight = $scope.subHeaderHeight;

				$scope.$on("winScroll", function (event, args) { // args.scrollPos, args.winWidth, args.winHeight
					// console.log(args.scrollPos, AppDownBnrService.appDownBnrInfo.height);
					// args.scrollPos < 0 : iOS Bendding 현상으로 스크롤 포지션 마이너스때 처리
					if (args.scrollPos >= AppDownBnrService.appDownBnrInfo.height || args.scrollPos < 0) {
						$scope.headerFixed = true;
					} else {
						$scope.headerFixed = false;
                        console.log('fix');
					}

					$timeout(function () {
						$scope.$apply();
					});
				});

            }
        }
    }]);

    app.directive('depFilterLayer', ['$window', function($window) {
        return {
            replace : true,
            link : function($scope, el, attrs) {
                var $el = angular.element(el),
                   $win = angular.element($window),
                   headerHeight = $scope.subHeaderHeight,
                   subheaderHeight = angular.element("#head_sub").innerHeight(),
                   elOffsetTop = angular.element(".swag_go_wrap").offset().top;

               $win = angular.element($window),
               headerHeight = $scope.subHeaderHeight;

               function setHeaderFixed() {
                   if ($scope.appObj.isNativeHeader) {
                       headerHeight = 0;
                   }
                   elOffsetTop = angular.element(".swag_go_wrap").offset().top;

                   if ($win.scrollTop() >= elOffsetTop - ( headerHeight ) ) {
                       //$el.attr("style", "z-index:100;position:fixed;top:" + (headerHeight) +"px;width:100%");
                      // $el.addClass('swag_write_header_fix');
                       if(!angular.element("body").scope().sheadHide) {
                           angular.element("body").scope().sheadHide = true;
                           try{ angular.element("body").scope().$apply() } catch(e) { }
                       }
                   } else {
                       //$el.removeAttr("style");
                       //$el.removeClass('swag_write_header_fix');
                       if(angular.element("body").scope().sheadHide) {
                           angular.element("body").scope().sheadHide = false;
                           try{ angular.element("body").scope().$apply() } catch(e) { }
                       }
                   }
               }
               $win.on('scroll', setHeaderFixed);
            }
        }
    }]);

    // 20170411 likearts 스크립트로 화면 안넘어가게 이미지 사이즈 조정 할 경우
    app.directive('orientable', function () {
	    return {
	        link: function($scope, element, attrs) {
	            element.bind("load" , function(e){
	            	$scope.imageSize = { width:this.width, height:this.height };
	            });
	        }
	    }
	});

})(window, window.angular);

/* 댓글 기능 추가 */
function calcBytes(txt) {
	var bytes = 0;
	for (i=0; i<txt.length; i++) {
		var ch = txt.charAt(i);
		if(escape(ch).length > 4) {
			bytes += 2;
		} else if (ch == '\n') {
			if (txt.charAt(i-1) != '\r') {
				bytes += 1;
			}
		} else if (ch == '<' || ch == '>') {
			bytes += 4;
		} else {
			bytes += 1;
		}
	}
	return bytes;
}

/* ===========================================================================================
maxLengthCheck(maxSize, lineSize, obj, remainObj)
사용법 : maxLengthCheck("256", "3",  this, remain_intro)
parameter :
	 maxSize : 최대 사용 글자 길이(필수)
	 lineSize  : 최대 사용 enter 수 (옵션 : null 사용 시 체크 안 함)
	 obj   : 글자 제한을 해야 하는 object(필수)
	 remainObj : 남은 글자 수를 보여줘야 하는 object (옵션 : null 사용 시 사용 안 함)
===========================================================================================*/
function maxLengthCheck(maxSize, lineSize, obj, remainObj) {
	var temp;
	var f = obj.value.length;
	var msglen = parseInt(maxSize);
	var tmpstr = '';
	var enter = 0;
	var strlen;
	if (f == 0){//남은 글자 byte 수 보여 주기
		if (document.getElementById('spn_input_char') != null){//null 옵션이 아닐 때 만 보여준다.
		  document.getElementById('spn_input_char').innerText = msglen;
		}
	} else {
		for(k = 0; k < f ; k++){
			temp = obj.value.charAt(k);
			if(temp =='\n'){
				enter++;
			}
			if(escape(temp).length > 4){
				msglen -= 2;
			}else{
				msglen--;
			}

			if(msglen < 0){
				alert('총 한글 '+(maxSize/2)+'자 영문 '+maxSize+'자 까지 쓰실 수 있습니다.');
				obj.value = tmpstr;
				break;
			} else if (lineSize != null & enter > parseInt(lineSize)){// lineSize 옵션이 nulldl 아닐 때만 사용
				alert('라인수 '+lineSize+'라인을 넘을 수 없습니다.');
				enter = 0;
				strlen = tmpstr.length -1;
				obj.value = tmpstr.substring(0, strlen);
				break;
			}else{
				if (document.getElementById('spn_input_char') != null){
					document.getElementById('spn_input_char').innerText = msglen;
				}
				tmpstr += temp;
			}
		}
	}
}
