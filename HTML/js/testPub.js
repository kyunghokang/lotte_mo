var app = angular.module( "app", ['ngRoute'] );
app.controller('LotteCtrl', ['$scope', '$location', '$window', '$document', '$http','$timeout', function($scope, $location, $window, $document, $http,$timeout){
	$scope.beforeScrollTop = 0;
	$scope.htmlEl = angular.element("html"),
	$scope.cover = angular.element("#cover");
	
	$scope.LotteDimm = {
		status: false,
		dimmed: true,
		target: null,
		callback: null,
		scrollY : 0
	}
	
	// 딤 유닛 디렉티브 생성
	//var dimmElem = angular.element(document.body).append($compile('<lotte-dimm></lotte-dimm>')($scope));
	
	$scope.dimmedOpen = function(dimmed) {
		if($scope.LotteDimm.target != null && $scope.LotteDimm.callback) {
			$scope.LotteDimm.callback();
		}
		$scope.LotteDimm.scrollY = angular.element($window).scrollTop();  
		$scope.LotteDimm.status = true;
		$scope.LotteDimm.target = dimmed.target ? dimmed.target : null;
		$scope.LotteDimm.callback = dimmed.callback ? dimmed.callback : null;
		if($scope.LotteDimm.dimmed){
			angular.element("#wrapper").css("height","100%");
		}
	}
	$scope.dimmedClose = function() {
		if(!$scope.LotteDimm.status) {
			return false;
		}
		$scope.LotteDimm.status = false;
		$scope.LotteDimm.target = null;
		if($scope.LotteDimm.callback) {
				$scope.LotteDimm.callback();
		}
		angular.element("#wrapper").attr("style","");
		$timeout(function(){
			angular.element($window).scrollTop($scope.LotteDimm.scrollY);
		},100);
	}
	$scope.$watch("LotteDimm.target", function(newVal) {
		if(newVal != null) {
			console.log("Popup Focus :"+newVal);
			$("html").attr("class","").addClass(newVal + "_act").removeClass("dimmedOpen");    
		}
	}, true);
	
	$scope.side_search = false;
	$scope.side_category = false;
	$scope.side_mylotte = false;
	$scope.actionbar = true;
	
	//액션바 관련 레이어 test
	$scope.searchOpen = function(e){
		$scope.side_search = true;
		$scope.dimmedOpen({target:"search", callback:this.searchClose});
	}
	$scope.searchClose = function(e){
		$scope.side_search = false;
		$scope.dimmedClose({target:"search"});
	}
	$scope.categoryOpen = function(e){
		$scope.side_category = true;
		$scope.dimmedOpen({target:"category", callback:this.categoryClose});
	}
	$scope.categoryClose = function(e){
		$scope.side_category = false;
		$scope.dimmedClose({target:"category"});
	}
	$scope.mylotteOpen = function(e){
		$scope.side_mylotte = true;
		$scope.dimmedOpen({target:"mylotte", callback:this.mylotteClose});
	}
	$scope.mylotteClose = function(e){
		$scope.side_mylotte = false;
		$scope.dimmedClose({target:"mylotte"});
	}
	
	//바로주문 레이어 택배/스마트픽 선택
	$scope.deliSelect = true;
	
	//바로주문 레이어 > 예약주문
	$scope.resvOrder = true;
	
	window.addEventListener('scroll',function(){
		//console.log(document.body.scrollTop)
    });
	
	//달력 레이어
	$scope.datePickerState = "";
	$scope.datePickerYn = false;
	$scope.datePickerOpen = function(obj){
		$scope.datePickerYn = true;
		if(obj){
			$scope.datePickerState = obj.target; 
		}
	}
	$scope.datePickerClose = function(){
		$scope.datePickerYn = false;
	}
	
}]);

/* dimm 유닛 */
app.directive('lotteDimm', [function() {
	return {
		template: '<section style="position:fixed; top:0; left:0px; width:100%; height:100%; background:rgba( 0, 0, 0, 0.5 ); z-index:100;" ng-show="LotteDimm.status" ng-click="dimmedClose()"></section>',
		replace: true,
		link: function($scope, el, attrs) {
		}
	}
}]);

app.directive('bannerSlide', ['$window', function($window){
    return {
        replace : true, link:function($scope, el, attrs){
        	var ul = el.find("ul"),
        		li = ul.find("li"),
        		li_len = li.length;
        	
        	var half = $(window).width()/2; //mobile 에서 스크롤 사라지면 절반됨 (window resize 적용 필요)
        	li.css("width",half);
        	ul.css("width",half * li_len);
    	}
    };
}]);
app.directive('baseCover', ['$window', function($window){
    return {
        replace : true,
        link:function($scope, el, attrs){
        	el.click(function(){
        		$scope.dimmedClose();
        	});
    	}
    };
}]);
app.directive('productList01', ['$window', function($window){
    return {
        replace : true, link:function($scope, el, attrs){
        	var detail = el.find(".detail");
        	detail.click(function(){
        		$(this).parent().toggleClass("on");
        	});
    	}
    };
}]);
app.directive('optionLayer', ['$window', function($window){
    return {
        replace : true, link:function($scope, el, attrs){
        	var btnOrder = el.find(".btnOrder"),
        		btnOptionClose = el.find(".btnOptionClose,.dim"),
        		selPopup = el.find(".selPopup"),
        		selLayer = el.find(".selLayer"),
        		deliSelect_li = el.find(".deliSelect li"),
        		selOption_li = el.find(".selOption li"),
        		selPick = el.find(".selPick");
        	
        	//바로주문 선택 관련       	
        	$scope.optionLayerYn = false;        	
        	btnOrder.click(function(){
        		if($scope.optionLayerYn){
        			alert("선택값 확인");
        		}
        		el.addClass("on");
        		$scope.optionLayerYn = true;
        	});
        	
        	//옵션 선택
        	selPick.click(function(){
        		el.addClass("option"); 		
        	});
        	
        	selOption_li.click(function(){
        		var selPrdTit = $(this).find(".selPrdTit").text();
        		
        		selPick.find("span").text(selPrdTit);
        		el.removeClass("option");
        	});
        	
        	btnOptionClose.click(function(){
        		el.removeClass("on");
        		$scope.optionLayerYn = false;        		
        	});
        	deliSelect_li.click(function(){
        		var idx =$(this).index();
        		if(idx == 0){
        			//택배로 받기
        		}else{
        			//스마트픽으로 받기
        		}
        		deliSelect_li.removeClass("on");
        		$(this).addClass("on");
        	});
    	}
    };
}]);
app.directive('addPrdList', ['$window', function($window){
    return {
        replace : true, link:function($scope, el, attrs){
        	var selPrdDel = el.find(".selPrdDel"),
        		btnMinus = el.find(".btnMinus"),
        		btnPlus = el.find(".btnPlus"),
        		ipt_num = el.find(".ipt_num"),
        		selPrice = el.find(".selPrice strong");
        	
        	selPrdDel.click(function(e){
        		e.preventDefault();
        		el.remove();      		
        	});
    	}
    };
}]);
app.directive('unitZoom', ['$window', function($window){
    return {
        replace : true, link:function($scope, el, attrs){
        	var unit_zoom = $("#unit_zoom");
        	el.click(function(){
        		var url = $(this).parent().find("img").attr("src");
        		unit_zoom.find(".img").html("<img src="+url+" alt=''>");
        		$scope.dimmedOpen({target:"unitZoom"});
        	});
        	unit_zoom.find(".btn_close").click(function(){
        		$scope.dimmedClose({target:"unitZoom"});
        	});
    	}
    };
}]);

app.directive('popSns', ['$window', function($window){
    return {
        replace : true,
        templateUrl: '/HTML/sns/pop_sns.html',
        link:function($scope, el, attrs){
        	var btn_close = el.find(".btn_close");
        	btn_close.click(function(){
        		$scope.dimmedClose();
        	});
    	}
    };
}]);

//팝업:롯데닷컴 선물 서비스
app.directive('popGift', [function() {
    return {
        replace:true,
        link : function($scope, el, attrs){
        	$scope.popGift = function(){
        		el.show();
        		$scope.dimmedOpen({
    				target : "pop_gift",
    				callback: this.popGiftClose
    			});
        	}
        	$scope.popGiftClose = function(){
        		el.hide();
        		$scope.dimmedClose({target : "pop_gift"});
        	}
    	}
    };
}]);

// 팝업:말풍선
app.directive('helpLayer', ['$sce',function($sce) {
    return {
        replace:true,
        link : function($scope, el, attrs){
        	var icQst = $(".icQst")
        	$scope.eventTarget = null;    
        	
        	$scope.helpLayer = function(obj){
        		$scope.eventTarget = $(event.target);
        		icQst.removeClass("on")
        		$scope.eventTarget.removeClass("on").addClass("on");
				if(obj.target == 'giftPrice'){
					$scope.helpTitle = $sce.trustAsHtml("참좋은 혜택가란?");
					$scope.helpTxt = $sce.trustAsHtml("즉석 쿠폰이나 일시불 할인 등 다양한 <br>할인혜택이 자동으로 적용된 가격입니다.<br><br>" + "본 가격은 대표상품의 가격으로<br> 선택상품에 따라 가격 및 할인혜택이<br>다를 수 있습니다.");
				}
				else if(obj.target == 'lottePointPlusCard'){
					$scope.helpTitle =  $sce.trustAsHtml("상품적립금  <strong>20,000</strong><span>점</span>");
					$scope.helpTxt = $sce.trustAsHtml("<p>롯데포인트플러스카드 최대 40,000점 적립</p><p class=tit>적립 기준</strong></p><ol>" +
						"<li>상기 표시된 적립금은 쿠폰 등 할인 금액에 따라 변동될 수 있습니다.</li>" +
						"<li>무이자할부 이용시 롯데카드 적립은 제외됩니다.</li>"+
						"<li>적립쿠폰은 2배 적립에서 제외됩니다.</li>"+
						"<li>카드사에서 제공되는 적립금은 롯데포인트플러스카드 결제분에 한해 산정된 적립율로 지급됩니다.<br>(롯데포인트플러스카드와 현금/포인트 복합 결제시 현금/포인트 결제금액 제외)</li>"+
						"<li>롯데닷컴 ID기준의 멤버스 회원과 결제하신 롯데포인트플러스카드의 소유주가<br> 다른 경우 롯데카드 적립금은 적립되지 않습니다. (롯데닷컴 적립금은 정상 지급)</li>"+
						"</ol>");//<li>엘롯데 ID기준의 멤버스 회원과 결제하신 롯데포인트플러스카드의 소유주가 <br>다른 경우 롯데카드 적립금은 적립되지 않습니다. (엘롯데 적립금은 정상 지급)</li>
				}				
				else if(obj.target == 'rentalOnly'){
					$scope.helpTitle =  $sce.trustAsHtml("<strong>10</strong>점이 적립 되셨습니다.");
					$scope.helpTxt = $sce.trustAsHtml("적립된 L-money 10점은 오을 자정 12시에 소멸되며, 내일 또 적립 받으실 수 있습니다.");
				}
				el.css("top" , $scope.eventTarget.offset().top + 20);
				el.addClass(obj.target).show();
        	}
        	$scope.helpLayerClose = function(e){
        		el.attr("class","").addClass("helpLayer").hide();
        		$scope.eventTarget.removeClass("on");
        	}
    	}
    };
}]);

//알림리스트
app.directive('brieflyPop', ['$window','$sce','$timeout', function($window,$sce,$timeout){
    return {
    	replace : true, link:function($scope, el, attrs){
    		$scope.brieflyHtml = "";
    		$scope.userPhoneNumber = "010-5555-5555";
        	$scope.brieflyPop = function(obj){
        		//확대안내
        		if(obj.target == "imgZoomPop"){
        			$scope.brieflyHtml = $sce.trustAsHtml("<div class=popTxt>자유로운 확대가<br />가능합니다</div>");
        		}
        		//재입고 알림 신청
        		else if(obj.target == "alarmPop"){
        			$scope.brieflyHtml = $sce.trustAsHtml("<span>" + $scope.userPhoneNumber + "</span>" + "<div class=popTxt>재 입고 알림<br />신청되었습니다</div>"+ "<p>연락처 수정은 마이롯데에서<br />하실 수 있습니다</p>");
        		}
        		//장바구니
        		else if(obj.target == "cartPop"){
        			$scope.brieflyHtml = $sce.trustAsHtml("<div class=popTxt>장바구니에<br />담겼습니다 </div>");
        		}
        		//위시리스트
        		else if(obj.target == "wishPop"){
        			$scope.brieflyHtml = $sce.trustAsHtml("<div class=popTxt>위시리스트에<br />담겼습니다</div>");
        		}
        		//상세 옵션이미지 설명
        		else if(obj.target == "optionPop"){
        			$scope.brieflyHtml = $sce.trustAsHtml("<div class=popTxt>옵션 이미지를 터치하면<br />자세한 상품설명을<br />볼 수 있어요!</div>");
        		}
        		el.attr('class', 'brieflyPop ' + obj.target).fadeIn(500,function(){
        			$timeout(function(){
        				el.fadeOut(500);
        			},1000)
        		});
        	}
    	}
    };
}]);

// datePicker 
app.directive('datePicker', ['$timeout','$window',function($timeout,$window) {
    return {
        replace:true,
        link : function(scope, el, attrs){
        	scope.getFirstDay = function(year, month) { //첫째요일
        		return new Date(year, month, 1).getDay();
        	}
        	scope.getLastDay = function(year, month) { //마지막날짜
        		return new Date(year, month + 1, 0).getDate();
         	}
         	scope.addZero = function(n) {return n < 10 ? "0" + n : n;};
         	scope.date = new Date();   	
         	scope.now = new Date();
         	scope.cdate = new Date(); //input current date
         	scope.today = scope.now.getDate();
         	scope.month = scope.now.getMonth();
         	scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
         	scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
         	scope.dateHead = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
         	
         	scope.datePrev = function(obj){
         		scope.date.setMonth(scope.date.getMonth() - 1);        		        		
         		scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
         		scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
         		scope.makeDays();
         	}
         	scope.dateNext = function(e){
         		scope.date.setMonth(scope.date.getMonth() + 1);
         		scope.firstDay = scope.getFirstDay(scope.date.getFullYear() , scope.date.getMonth() );
         		scope.lastDay = scope.getLastDay(scope.date.getFullYear() , scope.date.getMonth() );
         		scope.makeDays();
         	}        	
         	scope.makeDays = function(){
         		scope.day = [];
         		for (var i = 0 ; i < scope.firstDay ; i++) {
     				scope.day.push(0-i);
         		}        		
         		for (var i = 0 ; i < scope.lastDay ; i++) {
     				scope.day.push(i + 1);
         		}
         	}
         	scope.pick = function(i){        		
         		scope.cdate.setDate(i);        		
         		$("#" + scope.datePickerState).val(scope.date.getFullYear() + "-" + scope.addZero(scope.date.getMonth() + 1) + "-" + scope.addZero(i));
         		scope.datePickerClose();
         	}
         	scope.makeDays();
    	}
    };
}]);

$(function(){
	getScope = function(ctrl){
	    var appElement = angular.element('[ng-app=app]');
	    if (ctrl == undefined){
	        return  appElement.scope().$$childHead;
	    }
	    var conElement = appElement.find('[ng-controller='+ctrl+']');
	    return  conElement.scope();
	}
});