(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
		'lotteSns',
        'lotteCommFooter',
        'ngPinchZoom'
    ]);

	// v-com : 고객등록사진 페이지에서 동영상 trustUrl 가져오기 
	app.filter("trustUrl", ['$sce', function ($sce) {
		return function (recordingUrl) {
			return $sce.trustAsResourceUrl(recordingUrl);
		};
	}]);

	// v-com : 동영상 포스트컷(스냅샷) - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
	app.directive('videoPoster', [function () {
		return {
			restrict: 'A', // attribute
			link : function ($scope, element, attrs) {
				if (attrs.videoPoster) {
					angular.element(element).attr("poster", attrs.videoPoster);
					//poster="http://image.lotte.com/lotte/mo2015/angular/common/transparent.png"
					//element.parent('.video_wrap').attr("style", "background:url("+attrs.videoPoster+") no-repeat 50% 50%;background-size:cover;");
				}
			}
		};
	}]);

	// v-com : 동영상 주소 - bind로 할 경우 최초 로드시 에러 출력으로 인하여 커스텀 attr로 구현
	app.directive('videoSource', [function () {
		return {
			restrict: 'A', // attribute
			link : function ($scope, element, attrs) {
				if (attrs.videoSource) {
					angular.element(element).attr("src", attrs.videoSource);
				}
			}
		};
	}]);

    app.controller('photoreviewCtrl', ['$http', '$scope', 'LotteCommon','commInitData','$window','$timeout','$compile', function($http, $scope, LotteCommon,commInitData,$window,$timeout,$compile) {
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "고객 등록 콘텐츠"; // v-com : 서브헤더 타이틀
        $scope.screenID = "고객 등록 콘텐츠"; // v-com : 스크린 아이디 
                
        // 스크린 데이터
        ($scope.screenDataReset = function() {
        	$scope.pageOptions = {
        	}
        	$scope.screenData = {
        		page: 0,
        		pageSize: 20,
        		pageEnd: false
        	}
        })();
        //
        var goods_no = commInitData.query['goods_no'];
        var usm_goods_no = commInitData.query['usm_goods_no'];
        var totCnt = commInitData.query['totCnt'];
        $scope.goods_img = commInitData.query['goods_img'];
        $scope.sid = parseInt(commInitData.query['id']);        
        if(!$scope.sid){
            $scope.sid = 0;
        }
        $scope.sid_sub = 0;
        if(!$scope.mgoods_nm){
            $scope.mgoods_nm = "";
        }
        $scope.reqDetailParam = {
            usm_goods_no : usm_goods_no,
            goods_no : goods_no,
            photoview : "Y",
            totCnt : totCnt
        }
        var csr = 0;
        var block = 5;
        block = parseInt(angular.element($window).width()/74 + 1);
        $http.get(LotteCommon.commentCommentViewMobileData, {params:$scope.reqDetailParam})
        .success(function(data) {
                try {                    
                    $scope.totaldata = data.data_set.product_review.items;
                    $scope.baseinfo = data.data_set;
                    $scope.max = $scope.totaldata.length - 1;
                    $scope.dataset = [];        
                    $scope.photolist = []; //각 상품평의 사진 전체 리스트를 생성                                      
                    $timeout(function(){
                        $scope.scl = 0;
                        //pushData();   
                        $scope.dataset = $scope.totaldata;
                        $scope.setInfo($scope.sid);                    
                        if(!$scope.goods_img){
                            $scope.goods_img = $scope.photolist[0].img_url;
                        }          
                        
                        //이미지리스트를 화면 사이즈에 맞추어서 스크롤시 로딩하도록 함
                        /*
                        angular.element(".photolistbox").on("scroll.photo", function(e){
                            $scope.scl = this.scrollLeft;                        
                            var wid = angular.element($window).width();                            
                            if($scope.dataset.length*74 - $scope.scl < wid + 100){
                                pushData();                                   
                            }                            
                            if($scope.totaldata.length == $scope.dataset.length){
                                console.log("end load");
                                $(this).off();
                            }
                        });                                            
                        */
                        $timeout(function(){
                            $(".infopop").hide();
                        }, 3000);
                        //앱일때 액션바의 위치에 따라 포토리스트 위치 변경
                        if($scope.appObj.isApp){
                            var prvsc = 0;
                            var nowsc = 0;
                            angular.element($window).on("scroll", function(){
                                nowsc = $($window).scrollTop();
                                if(nowsc - prvsc > 10){
                                    $(".bottomcont").removeClass("barsize");
                                }else if(nowsc - prvsc < -10){
                                    $(".bottomcont").addClass("barsize");
                                }
                                prvsc = nowsc;
                            });
                        }
                        
                    }, 100);
                }catch(e) {
                    console.log(e);
                }
        })
        .error(function() {
                 console.log('Data Error : getCommentViewListPaging 실패');
        });        
        function pushData(){
            csr = $scope.dataset.length;
            var lastend = csr + block;
            if(lastend >= $scope.max){
                lastend = $scope.totaldata.length;
            }
            $scope.dataset = $scope.totaldata.slice(0, lastend);
            console.log("photo load : ", $scope.dataset.length + "/" + $scope.totaldata.length);
            $scope.$apply();
        }

		// v-com : 동영상 높이값 계산
		$scope.resizeVideoHeight = function(){
			angular.element("div.video_wrap").each(function(idx, itm){
				var wrap = $(itm)
				wrap.css({'height': wrap.find("video").height()});
			});
		};
        
    }]);
    app.directive('lotteContainer',["$http","$timeout", function($http,$timeout) {
        return {
            templateUrl : '/lotte/resources_dev/product/m/photoreview_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.moveEnd = function(index){
                    
                }
                $scope.movePhoto = function(dir){
                    $scope.sid_sub += dir;
                    if($scope.sid_sub < 0){  //왼쪽방향
                        $scope.sid += dir;  // 왼쪽버튼 클릭시 순서
                        if($scope.sid < 0){
                            $scope.sid = $scope.max; // 대표 이미지 순서와 버튼누른 순서가 같다
                        }                        
                        $scope.setInfo($scope.sid);            
                        $scope.sid_sub = $scope.photolist.length - 1;
                        angular.element(".photolistbox").animate({scrollLeft: $scope.sid*71}, 500);    // 버튼클릭시 하단 스크롤 이동                   
                    }else if($scope.sid_sub >= $scope.photolist.length){
                        $scope.sid += dir;    
                        if($scope.sid > $scope.max){
                            $scope.sid = 0;
                        }                        
                        $scope.setInfo($scope.sid);                        
                        angular.element(".photolistbox").animate({scrollLeft: $scope.sid*71}, 500);
                    }                                        
                }
                $scope.setInfo = function(id){   
                    $scope.sid = id;
                    $scope.sid_sub = 0;
                    $scope.sComment = $scope.dataset[id];                    
                    if($scope.sComment){
                        $scope.photolist = [];
                        addPhoto($scope.sComment.img_path_1_nm + $scope.sComment.img_file_1_nm, 0, id, $scope.sComment.mpic_url_addr); // v-com : 추가
                        addPhoto($scope.sComment.img_path_2_nm + $scope.sComment.img_file_2_nm, 1, id);
                        addPhoto($scope.sComment.img_path_3_nm + $scope.sComment.img_file_3_nm, 2, id);

						// v-com : 비디오 재생 초기화
						setTimeout(function(){
							autoVideoPlay('autoVideo1', '#autoVideo1');
							$scope.resizeVideoHeight();
						}, 100);

						setTimeout(function(){
							$scope.resizeVideoHeight();
						}, 1000);

						setTimeout(function(){
							$scope.resizeVideoHeight();
						}, 2500);
                    }
                    if($scope.control){
                        $scope.control.init(); //스와이프 재설정                    
                    }
                }

                //외부에서 호출하는 함수
                $scope.getControl1 = function(control){
                    $scope.control = control;
                }
                function addPhoto(imglink, index, i, vdolink){  // v-com : vdolink 추가
                    if(imglink != ""){
                        var link = imglink.split("|");
                        $scope.photolist.push({
                            img_url : "http://image.lotte.com"  + link[0],
                            index : index,
                            id : i,
							vdo_url : vdolink  // v-com : 추가
                        });
                    }
                }

				/* v-com : 동영상 버튼 3개일때 - 상세보기 링크
				$scope.movProdLink = function(){
					var item={"goods_no":$scope.reqDetailParam.goods_no}
					$scope.productView(item)
				}*/

                $scope.imgload = function(index){                    
                    $timeout(function(){
                        $scope.imageSetSize(index);                        
                    }, 600);
                }
                $scope.imageSetSize = function(index){
                    var obj = $("#imgbox_" + index);
                    var ww = obj.width();
                    var hh = obj.height();                        
                    if(hh > 100){                            
                        if(hh > ww){
                            obj.find("img").height(ww);
                            obj.find("img").width(parseInt(ww*ww/hh));                                                                   
                        }else if(ww > hh){
                            obj.find("img").css({"margin-top": parseInt((ww - hh)/2) + "px"});
                        }                   
                        obj.addClass("loaded");
                    }
                    else{
                        $timeout(function(){
                            $scope.imageSetSize(index);    
                        }, 100);                            
                    }
                }
                $scope.barsize = true;
                
                /*20160929 상품평추천*/
                $scope.recomm_click = function(item){                    
                    if (!$scope.loginInfo.isLogin) {  /*로그인 안한 경우*/
                        $scope.loginMoveProc("", "N");
				    }else{
                        $http.get("/json/comment/comment_recomm_write.json?gdas_no="+item.gdas_no+"&goods_no=" +  $scope.reqDetailParam.goods_no)
                        .success(function(data) {
                            if (data.result == "reg_success") { // 추천완료
                                alert("추천하셨습니다.");
                                item.recomm_cnt += 1;
                                item.ok = true;
                                //$("#recomm_" + item.gdas_no).addClass("on");                        
                            }else if (data.result == "reg_clv_success") { // 클로버 적립 
                                alert("추천하셨습니다.\n클로버 20개 적립되었습니다.\nID당 1일 3회까지 지급됩니다."); 
                                item.recomm_cnt += 1;
                                item.ok = true;
                                //$("#recomm_" + item.gdas_no).addClass("on");                                                        
                            }else if (data.result == "reg_duplicate") { // 중복추천
                                alert("이미 추천하셨습니다.");
                            }else if (data.result == "reg_mywrit") {   // 본인글 추천
                                alert("본인이 작성한 상품평에는 추천하실 수 없습니다.");
                            }else {
                                alert("다시 한번 시도해주시기 바랍니다.");
                            }	
                        })                                            
                    }
                }
                
            }
        };
    }]);
    //201701 상품평 이미지용 
	app.filter("splitimg", ['$sce', function ($sce) {
		return function (url, index) {
            var tmp = url.split("|");
			return tmp[0];
		};
	}]);

})(window, window.angular);