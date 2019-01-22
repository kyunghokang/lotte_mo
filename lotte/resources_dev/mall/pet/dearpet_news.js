(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteCommFooter',
        'dearpetSubCategory',
        'lotteSns'
    ]);

    app.controller('DearpetNewsCtrl', ['$http','$scope', '$window', '$location', 'LotteCommon', 'commInitData', 'LotteStorage', '$timeout', function($http, $scope, $window, $location, LotteCommon, commInitData, LotteStorage, $timeout) {
    	$scope.isMain = false;
    	$scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = ""; // 서브헤더 타이틀
        $scope.screenID = "DearpetNews"; // 스크린 아이디
        $scope.pageLoading = true;
		$scope.dispNo = "";
		$scope.productListLoading = true;
		$scope.productMoreScroll = true;
        $scope.shareRendingURL = location.href;
        $scope.shareCodeis = "MIMI TOUTOU";

        // commInitData.query['beforeNo'] = "";

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
				event_list: [],
				event_list :[], //갤러리 오브젝트
				pageSize : 10,
				pageEnd: false,
				galleryTotal : 0
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
		$scope.subTitle = $scope.screenData.disp_name = "뉴스";

		/**
		 * @ngdoc function
		 * @name ProdListCtrl.function:getCateNodeName
		 * @description
		 * 카테고리 노트명 추출
		 * @example
		 * $scope.getCateNodeName(idxs,depth);
		 * @param {Array} idxs 인덱스 어레이
		 * @param {int} depth 깊이
		 */
		$scope.getCateNodeName = function(idxs,depth) {
			var idx = [];
			if(idxs != '') {
				idx = idxs.split(",");
			}
			switch(depth) {
			case 1:
				for(var i=0;i < $scope.screenData.cate_list.length;i++) {
					if($scope.screenData.cate_list[i].sub_cate_list != null) {
						$scope.getCateNodeName(i+'',depth+1);
					}
				}
				break;
			case 2:
				for(var i=0;i < $scope.screenData.cate_list[idx[0]].sub_cate_list.length;i++) {
					if($scope.screenData.cate_list[idx].sub_cate_list[i].sub_cate_list != null) {
						$scope.getCateNodeName(idxs+','+i,depth+1);
					} else {
						if($scope.screenData.cate_list[idx[0]].sub_cate_list[i].disp_no == $scope.screenData.curDispNo) {
							$scope.screenData.cateNodeName[0] = $scope.screenData.cate_list[idx[0]].disp_nm;
							$scope.screenData.cateNodeName[1] = $scope.screenData.cate_list[idx[0]].sub_cate_list[i].disp_nm;
							$scope.screenData.cateNodeName[2] = '';
							return;
						}
					}
				}
				break;
			case 3:
				for(var i=0;i < $scope.screenData.cate_list[idx[0]].sub_cate_list[idx[1]].sub_cate_list.length;i++) {
					if($scope.screenData.cate_list[idx[0]].sub_cate_list[idx[1]].sub_cate_list[i].disp_no == $scope.screenData.curDispNo) {
						$scope.screenData.cateNodeName[0] = $scope.screenData.cate_list[idx[0]].disp_nm;
						$scope.screenData.cateNodeName[1] = $scope.screenData.cate_list[idx[0]].sub_cate_list[idx[1]].disp_nm;
						$scope.screenData.cateNodeName[2] = $scope.screenData.cate_list[idx[0]].sub_cate_list[idx[1]].sub_cate_list[i].disp_nm;
						return;
					}
				}
				break;
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
		$scope.loadScreenData = function(el) {
			console.log("스크린 데이터 로드...");
			if($scope.screenData.pageEnd) {
				return;
			}
			$scope.screenData.page++;
			if($scope.screenData.page > 1) {
				$scope.productListLoading = true;
			} else {
				$scope.pageLoading = true;
			}
			var url = LotteCommon.petMalleventData+'?dispNo='+$scope.screenData.curDispNo+'&page='+$scope.screenData.page+'&pageSize='+$scope.screenData.pageSize;
			$http.get(url)
			.success(function(data) {
				var contents = [];
				contents = data['dearpet_news'];

                /*
                try{  // 강아지, 고양이 임시 삭제
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

				if(contents.event_list != null) {
					var nDataList = contents.event_list.items;
					$scope.screenData.event_list = contents.event_list.items;
					try {
						$scope.screenData.event_old_list = contents.event_old_list.items;
					} catch(e) { $scope.screenData.event_old_list = [] }
					$scope.screenData.pageEnd = true;

					$timeout(function(){
						for(var i=0; i< $scope.screenData.event_list.length; i++){
							$scope.screenData.event_list[i].big = false;
							$scope.screenData.event_list[i].open = false;
							if($("#swaglist_cont" + i).height() > 35){
								$scope.screenData.event_list[i].big = true;
							}
						}
					}, 100);

					$scope.contMoreClick = function(item){
						item.open = !item.open;
						item.more = !item.more;
					};

					if($scope.screenData.galleryTotal < $scope.screenData.page*$scope.screenData.pageSize) {
						$scope.screenData.pageEnd = true;
						$scope.productMoreScroll = false;
					}

					$scope.productListLoading = false;
					$scope.pageLoading = false;
				}

                if( !$scope.screenData.cate_list.length ) {
                    $scope.screenData.cate_list = contents.cate_list.items;
                    $scope.sendCategoryData( contents.cate_list.items );
                }
			});
		}

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
            $scope.getSubCateDataFunc(data);
        };

		// 세션에서 가저올 부분 선언
		var StoredLoc = LotteStorage.getSessionStorage($scope.screenID+'Loc');
		var StoredDataStr = LotteStorage.getSessionStorage($scope.screenID+'Data');
		var StoredScrollY = LotteStorage.getSessionStorage($scope.screenID+'ScrollY');

		if( StoredLoc == window.location.href && $scope.locationHistoryBack ) {
			var StoredData = JSON.parse(StoredDataStr);
			$scope.pageLoading = false;
			$scope.pageOptions = StoredData.pageOptions;
			$scope.screenData = StoredData.screenData;
			$timeout(function() {
				angular.element($window).scrollTop(StoredScrollY);
			},800);
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

        $scope.petShare = function( obj ){
            $scope.sendTclick( "m_DC_SpeDisp_Dearpet_Clk_Shr" );
            $scope.showSharePop({tclick:"m_DC_SpeDisp_Dearpet_Clk_Shr"} );
            $timeout(function(){
                getScope().noCdnUrl = location.href;
            },300);
        }
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
            templateUrl : '/lotte/resources_dev/mall/pet/dearpet_news_container.html',
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

                $scope.eventClick = function(item, tclick) {
                	var url = item.img_link + "&" + $scope.baseParam;
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
					if (!$scope.productMoreScroll ||
						$scope.productListLoading ||
						$scope.pageLoading) {
						return;
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
            }
        };
    }]);

   
	/* header each */
    app.directive('subHeaderEach', [ '$window','AppDownBnrService', '$timeout', function($window,AppDownBnrService,$timeout) {
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
