(function(window, angular, undefined) {
    'use strict';

    var app = angular.module('app', [
        'lotteComm',
        'lotteSrh',
        'lotteSideCtg',
        'lotteSns',
        // 'lotteSideMylotte',
        'lotteCommFooter',
        'lotteNgSwipe'
    ]);

    app.controller('tvShopping2016Ctrl', ['$scope', 'LotteCommon','$http','LotteStorage', '$window', function($scope, LotteCommon,$http,LotteStorage,$window) {
        $scope.isShowThisSns = true;
        $scope.showWrap = true;
        $scope.contVisible = true;
        $scope.subTitle = "TV쇼핑"; //서브헤더 타이틀
        $scope.playcover = false; //동영상 보이기
        $scope.planShopSns = true;
        
        $scope.screen = LotteStorage.getSessionStorage("tvshopping_screen", 'json');
        if($scope.screen == null || $scope.screen == ''){
            $scope.screen = {
                tv_cate : 0,
                scroll_y : 0
            }            
        }
		// Data Load
		$scope.loadData = function () {
            $scope.playcover = false; 
			if ($scope.ajaxLoadFlag)
				return false;

			$scope.ajaxLoadFlag = true;

			var httpConfig = {
				method: "get",
				url: LotteCommon.tvShoppingData,
				params: {
				}
			};
			$http(httpConfig) // 실제 탭 데이터 호출
			.success(function (data) {
                $scope.smp = data.main_contents; //전체 데이타
                //호스트배너의 서브타이틀 br처리
                if($scope.smp.host_ban_list.items != undefined){
                    for(var i=0; i<$scope.smp.host_ban_list.items.length; i++){
                        $scope.smp.host_ban_list.items[i].banner_sub_nm = $scope.smp.host_ban_list.items[i].banner_sub_nm.replace("&lt;br&gt;", "<br>");
                        $scope.smp.host_ban_list.items[i].banner_sub_pad_nm = $scope.smp.host_ban_list.items[i].banner_sub_nm.replace("<br>", " ");
                    }
                }

                $scope.tvTimeStart(false);
			})
			.finally(function () {
				$scope.ajaxLoadFlag = false;                
			});
		}
        angular.element($window).on("unload", function(e) {
            LotteStorage.setSessionStorage("tvshopping" , $scope.smp, 'json');
            $scope.screen.scroll_y = angular.element($window).scrollTop();
            LotteStorage.setSessionStorage("tvshopping_screen" , $scope.screen, 'json');            
		});        
        $scope.tvTimeStart = function(sessionFlag){
            //tv상품 남은 시간 표시
            if($scope.smp.today_product.tv_time == ""){
                //$("#tvTime").text("00:00:00");
            }else{
                var tmpStr = $scope.smp.today_product.tv_time;
                //tmpStr = tmpStr.substr(5,2) +"/"+ tmpStr.substr(8,2) +"/"+ tmpStr.substr(0,4) +" "+ tmpStr.substr(11,8);
                var endTime = new Date(tmpStr).getTime();
                if ($scope.tvtimer != null && $scope.tvtimer != undefined) {
                    clearInterval($scope.tvtimer);
                }
                $scope.tvtimer = setInterval(function() {
                    tvRemainTimer();
                }, 1000);
                var tvRemainTimer = function(){
                    var remainTime = endTime - new Date().getTime();
                    var remainStr = "";
                    if(remainTime < 10){
                        clearInterval($scope.tvtimer);
                        remainStr = "00:00:00";
                        //세션에서 불러왔는데 시간이 지났다면
                        if(sessionFlag && !LotteCommon.isTestFlag){
                            console.log("timeover reload");
                            $scope.loadData();
                            setTimeout(function(){                    
                                $scope.control_a.init();//깨지는 현상 방지                    
                                if($scope.smp.today_product.tv_time != ''){
                                    autoVideoPlay('autoVideo', '#autoVideo'); //비디오재생                    
                                }
                            },1500);                            
                        }
                    }else{
                        var hour = Math.floor((remainTime / 60 / 60 ) / 1000);
                        var min = Math.floor((remainTime / 60) / 1000) % 60;
                        var sec = Math.floor(remainTime / 1000) % 60;
                        (hour < 10 ? remainStr += "0" + hour + ":" : remainStr += hour + ":");
                        (min < 10 ? remainStr += "0" + min + ":" : remainStr += min + ":");
                        (sec < 10 ? remainStr += "0" + sec : remainStr += sec);
                    }
                    $("#tvTime").text(remainStr);
                }
            }
        }
        $scope.onAirClick = function(){
            var tClickCode = "m_DC_TV_Clk_Btn_01"; // 방송편성표는 Tclick 고정
            window.location.href = "/main/tvhome.do?homeTabFlag=1&" + $scope.baseParam + "&tclick=" + tClickCode;
        }
        $scope.onBestClick = function(){
            var tClickCode = "m_DC_TV_Clk_Btn_02"; // 베스트30 
            window.location.href = "/main/tvhome.do?homeTabFlag=2&" + $scope.baseParam + "&tclick=" + tClickCode;
        }
        $scope.linkProduct_gbn = function(item, index){ //생방송여부에 따른 티클릭코드 분기처리
            var tclick = "m_DC_TV_Clk_best_Prd_"; //대체상품이면
            if($scope.smp.today_product.tv_time != ''){ //생방송중이면
                tclick = "m_DC_TV_Clk_Onair_Prd_";    
            }
            $scope.linkProduct(item, tclick, index, "");
        }
        
        $scope.linkProduct = function(item, tclick, index, moreParam){
            if(index != "" && index < 10){
                index = "0" + index;
            }
            var tClickCode = tclick + index;
            window.location.href = LotteCommon.prdviewUrl + "?" + $scope.baseParam + "&curDispNo=5537340&curDispNoSctCd=42&goods_no=" + item.goods_no+ "&tclick="+tClickCode + moreParam;
        }
        $scope.linkUrl = function(item, tclick, index){
            if(index != "" && index < 10){
                index = "0" + index;
            }
            var tClickCode = tclick + index;
            if(item.link_url.indexOf('?') > 1){
                item.link_url = item.link_url + "&";
            }else{
                item.link_url = item.link_url + "?";
            }
            window.location.href =  item.link_url + $scope.baseParam + "&tclick="+tClickCode;
        }
        $scope.getProductImage = function(item) {
            var newUrl = "";
            if(item.img_url == null) {
                return "";
            }
            newUrl = item.img_url.replace("280.jpg","550.jpg");
            return newUrl;
        }

        $scope.smp = LotteStorage.getSessionStorage("tvshopping", 'json');//sessionStorage.getItem("tvshopping");
        if($scope.smp == null || $scope.smp == ''){
            $scope.loadData();
        }else{
            $scope.tvTimeStart(true);
        }
    }]);

    app.directive('lotteContainer', ['$window', function($window) {
        return {
            templateUrl : '/lotte/resources_dev/mall/tvShopping2016_container.html',
            replace : true,
            link : function($scope, el, attrs) {
                $scope.tg_index = 1;
                $scope.changeCate = function(id){
                    $scope.screen.tv_cate = id;
                    $scope.sendTclick("m_DC_TV_Clk_Prd_C_Tap0" + (id + 1));
                }
                $scope.setInfo = function(id){                    
                    $scope.tg_index = id+1;
                }
                //외부에서 호출하는 함수
                $scope.getControl1 = function(control){
                    $scope.control_a = control;
                }    
                //TV쇼핑 상품 좌우 스와이프 이동 버튼 
                $scope.tg_go = function(dir){
                    $scope.control_a.moveIndex($scope.tg_index - 1 + dir);
                }
                
                $scope.show_play = function(){
                    $scope.playcover = true;
                    $(".btn_move_start").trigger("click");
                }
                $scope.hide_play = function(){
                    $scope.sendTclick("m_DC_menu_TV_Clk_Video_close");
                    $scope.playcover = false;
                    $(".btn_move_stop").trigger("click");
                }
                setTimeout(function(){
                    //공유하기에 티클릭추가
                    $("#head_sub > p > a").on("click", function(){
                        $scope.sendTclick("m_DC_SpeDisp_TV_Clk_Shr");
                    })
                    angular.element($window).scrollTop($scope.screen.scroll_y);
                    if($scope.smp.today_product.tv_time != ''){
                        autoVideoPlay('autoVideo', '#autoVideo'); //비디오재생                    
                    }
                },1500);
            }
        };
    }]);
// Directive :: 스와이핑 (특정영역 안에서 좌우로 스크롤하는 기능)
    /*사용 예
   //스와이핑 영역에 simple-swipe 설정
   <div simple-swipe>
        //스와이핑되는 컨텐츠에 class swipeBox 설정
        <div class="swipeBox">
        </div>
   </div>
    */
    commModule.directive('simpleSwipe', [function() {
        return {
            link : function($scope,el,attr){
                //console.log('EGSwipe', attr);
                var prvx = -1,
                    DOWNPOS,
                    OPOS = 0,
                    target = angular.element(el).find(".swipeBox"),
                    DOWNY,
                    DOWNX,
                    dragDist = 0,
                    dragDir = 2, //드래그방향 : 0 - 왼쪽 , 1 - 오른쪽, 2 - 제자리
                    tx = 0,
                    downTime,
                    wwd = angular.element(el).width();

                $(document.body).attr("ondragstart","return false");
                $(document.body).attr("onselectstart","return false");
                $(target).css("-webkit-transition-property","transform");
                $(target).css("transition-property","transform");
                target.on({
                    "touchstart" : mDown,
                    "touchmove" : mMove,
                    "touchend" : mUp
                });
                function mUp(e){
                    if(Math.abs(dragDist) > 20){
                        if(dragDist > 0){
                            dragDir = 1;
                        }else{
                            dragDir = 0;
                        }
                    }else{
                        dragDir = 2;
                    }

                    var rightSide = angular.element(el).width() - target.width();
                    //플리킹 여부 판단해서 조금 더 이동
                    var timeGap = new Date().getMilliseconds() - downTime;
                    var tmpx = tx;
                    if(timeGap > 0 && timeGap < 200 && Math.abs(dragDist) > 40){
                        tmpx += dragDist*2;
                    }
                    if(tmpx > 0 || rightSide > 0){
                        setTxTween(0);
                    }else if(tmpx < rightSide){
                        setTxTween(rightSide);
                    }else{
                        setTxTween(tmpx);
                    }
                }
                function mDown(e){
                    downTime = new Date().getMilliseconds();
                    dragDist = 0;
                    var point = e.originalEvent.touches[0];
                    OPOS = tx;
                    DOWNPOS = point.clientX - OPOS;
                    DOWNY = point.clientY;
                    DOWNX = point.clientX;
                    prvx = 0;
                }
                function mMove(e){
                    var point = e.originalEvent.touches[0];
                    if(Math.abs(point.clientY - DOWNY) < Math.abs(point.clientX - DOWNX)){
                        e.preventDefault();
                        dragDist = point.clientX - DOWNX;
                        prvx = OPOS - tx;
                        tx = point.clientX - DOWNPOS;
                        setTx(tx);
                    }else{
                        mUp(null);
                    }
                }
                function setTxTween(val){
                    $(target).css("-webkit-transition-duration", "300ms");
                    $(target).css("transition-duration", "300ms");
                    setTx(val);
                    setTimeout(function(){
                        $(target).css("-webkit-transition-duration", "0ms");
                        $(target).css("transition-duration", "0ms");
                    }, 300);
                }
                function setTx(val){
                    $(target).css("-webkit-transform","translate3d(" + val + "px, 0, 0)");
                    $(target).css("transform","translate3d(" + val + "px, 0, 0)");
                    tx = val;
                }
            }
        };
    }]);
	commModule.directive("zoomProductContiner",['$parse', '$http' , '$timeout', 'LotteCommon' , 'LotteScroll', 'LotteUtil', function($parse,$http,$timeout,LotteCommon,LotteScroll, LotteUtil) {
		return {
			template: '<div class="unit_zoomImage" ng-show="zoomImageFalg"><span class="btn_close" ng-click="zoomImageClose()"></span><p class="img"><img ng-src="{{zoomImageSrc|| \'//:0\'}}" alt="{{zoomImageTitle}}" /></p></div>',
			replace: true,
			link : function($scope, el, attrs) {
				$scope.zoomImageFalg = false;
				$scope.zoomImageSrc = "";
				$scope.zoomImageTitle = "";

				$scope.zoomImageClose = function() {
					if($scope.zoomImageFalg) {
						$scope.dimmedClose();
						$scope.zoomImageFalg = false;
						$scope.scrollFlag = true;
						LotteScroll.enableScroll();
					}
				}

				$scope.zoomImageClick = function(url) {
					if(url != null) {
						url = url.replace("60.jpg","550.jpg");
						url = url.replace("280.jpg","550.jpg");
					}

					$scope.dimmedOpen({
						target: "imageZoom",
						callback: this.zoomImageClose,
						scrollEventFlag: true
					});
					$scope.scrollFlag = false;
					LotteScroll.disableScroll();
					$scope.sendTclick($scope.tClickBase+$scope.$$childHead.screenID+'_Clk_Elg');
					$timeout(function() {
						$scope.$apply(function() {
							$scope.zoomImageSrc = url;
							$scope.zoomImageFalg = true;
						});
					});
				}
			}
		}
	}]);
})(window, window.angular);
