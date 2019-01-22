//201605크로스픽 편의점 지도 연동 
var martIndex = 0;
var mapMode = "search";
function searchMartClose(){
    $("#mart").show();
    $("#searchMartPop").hide();
}
function searchMartResult(paramObj){
    //console.log(martIndex,mapMode, paramObj);
    //var sc = getScope();    
    if(mapMode == "search"){
        $("#crspk_name_" + martIndex).val(paramObj.name);
        $("#crspk_corp_cd_" + martIndex).val(paramObj.crspk_corp_cd);//1000 세븐, 3000 하이마트
        $("#crspk_corp_str_sct_cd_" + martIndex).val(paramObj.crspk_corp_str_sct_cd);
        $("#crspk_str_no_" + martIndex).val(paramObj.crspk_str_no);
        $("#crspk_addr_" + martIndex).val(paramObj.address);
        $("#crspk_phone_" + martIndex).val(paramObj.tel);   
        
        $("#crspk_str_no_" + martIndex).trigger("change");
        $("#crspk_name_" + martIndex).trigger("change");
        $("#crspk_corp_cd_" + martIndex).trigger("change");
        $("#crspk_addr_" + martIndex).trigger("change");
        $("#crspk_phone_" + martIndex).trigger("change");          
        $("#crspk_corp_str_sct_cd_" + martIndex).trigger("change");   
        
        if($("#scr_a:checked").length == 0 && martIndex == 0){ //한곳으로 보내기이면 나머지 지점들도 세팅
            var max = getScope().sevenStore.length;
            for(var i = 1; i < max; i++){
                $("#crspk_name_" + i).val(paramObj.name);
                $("#crspk_corp_cd_" + i).val(paramObj.crspk_corp_cd);//1000 세븐, 3000 하이마트
                $("#crspk_corp_str_sct_cd_" + i).val(paramObj.crspk_corp_str_sct_cd);
                $("#crspk_str_no_" + i).val(paramObj.crspk_str_no);
                $("#crspk_addr_" + i).val(paramObj.address);
                $("#crspk_phone_" + i).val(paramObj.tel);   

                $("#crspk_str_no_" + i).trigger("change");
                $("#crspk_name_" + i).trigger("change");
                $("#crspk_corp_cd_" + i).trigger("change");
                $("#crspk_addr_" + i).trigger("change");
                $("#crspk_phone_" + i).trigger("change");          
                $("#crspk_corp_str_sct_cd_" + i).trigger("change");   
            }            
        }        
    }
}

(function(window, angular, undefined) {
		'use strict';

		var app = angular.module('app', [
				'lotteComm',
				'lotteSrh',
				'lotteSideCtg',
				// 'lotteSideMylotte',
				'lotteCommFooter',
				'lotteMap'
		]);

		app.controller('SmpBookingCtrl', ['$scope', '$http','$timeout', 'LotteCommon', 'LotteForm', 'commInitData','LotteStorage', function($scope,$http, $timeout, LotteCommon,LotteForm, commInitData,LotteStorage) {
                $scope.ver = "20170515";
            
                $scope.resultData = {
                    list : [],
                    seven : []                    
                }        
                $scope.check_param = false; //baseparam 리셋기능 중지 
            
				$scope.showWrap = true;
				$scope.contVisible = true;
				
				$scope.pageLoading = true;
			    $scope.split_str = ":^:";
                $scope.frame = -1; //장면 구분 
                $scope.history_back = -1;
                $scope.history_len = history.length;
            
                if(commInitData.query['cur_pg'] != undefined && commInitData.query['cur_pg'] != ''){
                    $scope.frame = parseInt(commInitData.query['cur_pg']);
                }
                //$scope.test_str = commInitData.query['cur_pg'] +","+$scope.frame;
                $scope.base_goods_no = commInitData.query['gno'];
                $scope.sevenStore = []; //선택한 지점목록 
                $scope.scr_a = false;
                $scope.onemore = false; //상품이 한개인지
                $scope.smpLocation = []; //dept pick store map
                $scope.TITLE = ["스마트픽 매장 선택하기", "스마트픽 지점 찾기", "스마트픽 지점 찾기", "스마트픽 예약정보 확인", "스마트픽 예약정보 확인"];
                $scope.setFrame = function(id){
                    $scope.frame = id;
                    $scope.subTitle = $scope.TITLE[$scope.frame];
                    $(document.body).scrollTop(0);
                    if(id == 2){ //편의점이면 최근편의점 기본 선택                        
                        if($scope.last_pick.length > 0){
                            $scope.setSeven($scope.last_pick[0]);    
                        }else{ //최근 편의점이 없으면 지점 검색창 실행
                           $scope.showLocationGoogle(0, 'search');
                        }                       
                    }                    
                }
                $scope.gotoPage = function(page){ //0:선택화면,1:백화점,2:편의점,3:백화점 장소확인, 4:편의점 장소확인,5:주문서
                    var $form = angular.element("form[name=smp_frm]");                    
                    if(page == 5){
                        $form.attr("action", LotteCommon.orderFormUrl + "?" + $scope.baseParam + "&goods_no=" + $scope.postdata.goods_no + "&tclick=​m_RDC_ProdDetail_Clk_order");
                    }else{                        
                        $form.attr("action", "/smartpick/m/smartpick_booking.do" + "?" + $scope.baseParam + "&cur_pg=" + page + "&gno=" + $scope.base_goods_no);
                        /*
                        if(location.host == "localhost:3392"){
                            $form.attr("action", "/smartpick/m/smartpick_booking_dev.html" + "?" + $scope.baseParam + "&cur_pg=" + page + "&gno=" + $scope.base_goods_no); 
                        }*/
                    }
                    $form.attr("method","POST");                    
                    $timeout(function() {
                        $form.submit();
                    },300);                    
                }
                var now = new Date();
                function addzero(dt){
                    if(dt < 10){dt = "0" + dt};
                    return dt;
                }            
                $scope.today = now.getFullYear() + "-" + addzero(now.getMonth()+1) + "-" + addzero(now.getDate());
                        
				($scope.screenDataReset = function() {
					$scope.pageOptions = {
						orderCount: 1,
						showLocation: false,
						showComplite: false
					}
				})();
                
                
				$scope.getProductData = function() {
					$scope.productListLoading = true;
					$scope.$parent.LotteSuperBlockStatus = true;
					try {
                        var crosspickparam = "&crspk_store=" + $scope.postdata.crspk_store;
                            crosspickparam += "&crspk_psb_yn=" + $scope.postdata.crspk_psb_yn;
                            crosspickparam += "&crspk_corp_cd=" + $scope.postdata.crspk_corp_cd;
                            crosspickparam += "&crspk_corp_str_sct_cd=" + $scope.postdata.crspk_corp_str_sct_cd;
                            crosspickparam += "&crspk_str_no=" + $scope.postdata.crspk_str_no;
                            crosspickparam += "&goods_no=" + $scope.postdata.goods_no +"&item_no="+$scope.postdata.item_no;
                            crosspickparam += "&smp_prod_yn="+$scope.postdata.smp_prod_yn;
                        $scope.pageOptions.orderCount = $scope.postdata.ord_qty.split($scope.split_str);
                        $http.get("/json/smartpick/smartpick_booking.json?"+ crosspickparam)
                        .success(function(data) {
							var goods = data.smartpick_booking.goods_list.items;
                            $scope.smpb = data.smartpick_booking;
                            if(goods.length > 1){
                                $scope.onemore = true;
                            }
                                 
                            if($scope.base_goods_no == undefined || $scope.base_goods_no == "direct"){
                                $scope.base_goods_no = "direct";
                            }
                            
                            $scope.sevenStore = new Array($scope.smpb.goods_list.items.length);                                                        
                            //최근픽업지점
                            $scope.last_pick = [];
                            if($scope.smpb.last_cvs_pick_list != null && $scope.smpb.last_cvs_pick_list.items != null && $scope.smpb.last_cvs_pick_list.total_count > 0){
                                for(i=0; i<4; i++){
                                    if(i < $scope.smpb.last_cvs_pick_list.items.length){
                                        $scope.last_pick.push($scope.smpb.last_cvs_pick_list.items[i]);
                                    }else{
                                        $scope.last_pick.push({"crspk_corp_cd" : "0"});
                                    }
                                }    
                            }
                            
                            //화면분기처리
                            if($scope.frame < 1){ //첫페이지인 경우
                                LotteStorage.setSessionStorage("book_resultData", {list:[],seven:[]}, 'json');  
                                if($scope.smpb.depts_pick_yn == 'N' && $scope.smpb.seven_pick_yn == 'N'){                                
                                    //상세로 돌아감
                                    alert("해당 상품은 스마트픽으로 찾기 서비스 이용이 불가능한 상태입니다. \n다른 배송수단을 이용해주세요.");
                                    //history.back();
                                    if($scope.base_goods_no == undefined || $scope.base_goods_no == "direct"){
                                        history.go($scope.history_back);
                                    }else{
                                        location.href = LotteCommon.productviewUrl + "?" + $scope.baseParam + "&goods_no=" + $scope.base_goods_no;                                      
                                    }
                                }else if($scope.smpb.depts_pick_yn == 'Y' && $scope.smpb.seven_pick_yn == 'Y'){                                
                                    $scope.setFrame(0);
                                }else if($scope.smpb.depts_pick_yn == 'Y'){
                                    $scope.setFrame(1); 
                                    //$scope.gotoPage(1);
                                }else if($scope.smpb.seven_pick_yn == 'Y'){
                                    $scope.setFrame(2);
                                    //$scope.gotoPage(2);
                                }
                            }else{ //첫페이지가 아닌 경우           
                                if($scope.frame > 2){ //세번째 페이지 : 예약정보확인
                                    $scope.resultData = LotteStorage.getSessionStorage("book_resultData", "json");                                     
                                    $scope.history_back -= 2;
                                }else{ //두번재 페이지
                                    $scope.history_back -= 1;
                                }
                                $scope.setFrame($scope.frame);
                                
                            }
                            
                            $scope.checkPick();
							$scope.productListLoading = false;
				            $scope.$parent.LotteSuperBlockStatus = false;
							$scope.pageLoading = false;
                            
						})
						.error(function() {
							$scope.productListLoading = false;
							$scope.$parent.LotteSuperBlockStatus = false;
							$scope.pageLoading = false;
						});
					} catch(e) {
                        console.log(e);
                    }
				}
                $scope.checkPick = function(){
                    //한개지점인 경우 자동선택 처리 
                    var item;
                    for(var i=0; i<$scope.smpb.goods_list.items.length; i++){
                        item = $scope.smpb.goods_list.items[i];                        
                        if(item.smp_brch_list != undefined && item.smp_brch_list.items != null && item.smp_brch_list.items.length == 1){
                            item.select_brch = item.smp_brch_list.items[0];                            
                            if(item.select_brch.dsk_lck_list.items.length == 1){
                                item.select_loc = item.select_brch.dsk_lck_list.items[0]; 
                            }
                        }else{
                            break;
                        }
                    }
                    /*
                    //한개상품, 한개지점인 경우 자동선택 처리 
                    if($scope.smpb.goods_list.items.length == 1){
                        if($scope.smpb.goods_list.items[0].smp_brch_list.items.length == 1){
                            $scope.smpb.goods_list.items[0].select_brch = $scope.smpb.goods_list.items[0].smp_brch_list.items[0];                            
                            $scope.smpb.goods_list.items[0].select_loc = $scope.smpb.goods_list.items[0].select_brch.dsk_lck_list.items[0]; 
                        }
                    } 
                    */                   
                    
                }
                        
				angular.element(document).ready(function() {
					if($scope.postdata != undefined){ //eung
						$scope.getProductData();
                    }
				});
		}]);
    
        //201701 상품평 이미지용 
        app.filter("nullcheck", ['$sce', function ($sce) {
            return function (str) {
                if(str == undefined){
                    str = "";
                }
                return str;
            };
        }]);
        //201701 픽업예정일
        app.filter("datetype1", ['$sce', function ($sce) {
            return function (str) {                
                if(str != undefined){
                    //2017-03-29 -> 3/29
                   var tmp = str.split("-");
                    str = parseInt(tmp[1]) +"/"+ parseInt(tmp[2]);
                }else{
                    str = "";
                }
                return str;
            };
        }]);

		app.directive('lotteContainer',['$timeout', 'LotteCommon','LotteForm','LotteStorage', function ($timeout, LotteCommon,LotteForm,LotteStorage) {
				return {
						templateUrl : '/lotte/resources_dev/smartpick/m/smartpick_booking_container.html',
						replace : true,
						link : function($scope, el, attrs) {
                            $scope.picktype = {
                                type : 1
                            }
                            //세븐 전체 선택
                            $scope.setSeven = function(item){
                                for(var i=0; i<$scope.smpb.goods_list.items.length; i++){
                                    $scope.sevenStore[i] = {
                                        crspk_corp_cd : item.crspk_corp_cd,
                                        crspk_str_str_nm: item.crspk_str_str_nm,
                                        crspk_str_phon: item.crspk_str_phon,
                                        crspk_str_addr: item.crspk_str_addr,
                                        crspk_str_no: item.crspk_str_no,
                                        crspk_corp_str_sct_cd : item.crspk_corp_str_sct_cd,
                                        locker_inst_yn_nm : item.locker_inst_yn_nm
                                    }
                                }
                            };
                            //백화점 지점선택
                            $scope.first_deptFlag = true;
                            $scope.select_brch = function(id, dept){
                                var item;                            
                                //처음 선택이면 나머지 지점도 동일하게 선택함
                                if($scope.first_deptFlag){
                                    var i, k, subitem;
                                    for(i=0; i<$scope.smpb.goods_list.items.length; i++){
                                        item = $scope.smpb.goods_list.items[i];
                                        for(k = 0; k< item.smp_brch_list.items.length; k++){
                                            subitem = item.smp_brch_list.items[k];
                                            if(subitem.shop_no == dept.shop_no){
                                                item.select_brch = subitem;
                                                //장소가 1개일 때에만 자동 선택 
                                                if(item.select_brch.dsk_lck_list.items.length == 1){
                                                    item.select_loc = item.select_brch.dsk_lck_list.items[0]; 
                                                }
                                            }
                                        }
                                    }
                                    $scope.first_deptFlag = false;
                                }else{
                                    item = $scope.smpb.goods_list.items[id]
                                    item.select_brch = dept;
                                    item.select_loc = null; //초기화 
                                    item.select_time = null; //초기화                             
                                    //장소가 1개일 때에만 자동 선택 
                                    if(item.select_brch.dsk_lck_list.items.length == 1){
                                        item.select_loc = item.select_brch.dsk_lck_list.items[0]; 
                                    }
                                    //item.select_time = item.select_brch.pickup_date_list.items[0];                                    
                                }
                            }
                            //백화점 픽업장소선택
                            $scope.select_pickloc = function(item, loc){
                                item.select_loc = loc;
                            }
                            //백화점 픽업 time 선택
                            $scope.select_picktime = function(item, time){
                                item.select_time = time;
                            }                            
                            //상품삭제
                            $scope.deletePop = false;
                            $scope.deletePop2 = false;
                            $scope.del_id = -1;
                            $scope.adddel_ok = function(){
                                $scope.deletePop = false;
                                $scope.deletePop2 = false;                                
                            }
                            //X button
                            $scope.deleteItem = function(id){
                                $scope.del_item_nm = $scope.smpb.goods_list.items[id].goods_nm; 
                                $scope.deletePop = true;
                                $scope.del_id = id;
                            }
                            function splitPost(str){
                                if(str == undefined){
                                    str = "";
                                }else{
                                    if(str.indexOf($scope.split_str) > -1){
                                        var tmpar = str.split($scope.split_str);
                                        str = tmpar[$scope.del_id];
                                    }                                    
                                }
                                return str;
                            }
                            function removePost(str){
                                if(str.indexOf($scope.split_str) > -1){
                                    var tmpar = str.split($scope.split_str);
                                    tmpar.splice($scope.del_id, 1);
                                    str = tmpar.join($scope.split_str); 
                                }
                                return str;
                            }
                            $scope.add_cart = function(){ //장바구니 담고 삭제 
                                var param = {
                                    goods_no: splitPost($scope.postdata.goods_no),
                                    item_no: splitPost($scope.postdata.item_no),
                                    goods_cmps_cd:splitPost($scope.postdata.goods_cmps_cd),
                                    goods_choc_desc:splitPost($scope.postdata.goods_choc_desc),
                                    ord_qty:splitPost($scope.postdata.ord_qty),
                                    infw_disp_no:splitPost($scope.postdata.infw_disp_no),
                                    infw_disp_no_sct_cd:splitPost($scope.postdata.infw_disp_no_sct_cd),
                                    master_goods_yn:splitPost($scope.postdata.master_goods_yn),
                                    cart_sn:splitPost($scope.postdata.cart_sn),
                                    cmps_qty:splitPost($scope.postdata.cmps_qty),
                                    mast_disp_no:splitPost($scope.postdata.mast_disp_no),
                                    std_goods_no:splitPost($scope.postdata.std_goods_no)
                                }                                
                                LotteForm.FormSubmitForAjax(LotteCommon.cartCartInsData, param)
                                .success(function(data) {
                                    //alert($scope.del_item_nm+ "\n상품이 장바구니에 담겼습니다.");
                                    $scope.deletePop2 = true;
                                    $scope.delete_item();                                                                        
                                })
                                .error(function(ex) {
                                    var errorMsg = ex.error.response_msg;
                                    alert(errorMsg);
                                });                                    
                            }
                            $scope.close_delete_item = function(){
                                 $scope.adddel_ok();
                                 $scope.delete_item(); 
                            }
                            $scope.delete_item = function(){ //삭제
                                $scope.smpb.goods_list.items.splice($scope.del_id, 1);
                                $scope.sevenStore.splice($scope.del_id, 1);                                
                                //delete post data
                                for(var k in $scope.postdata){
                                    $scope.postdata[k] = removePost($scope.postdata[k]);
                                }
                                if($scope.smpb.goods_list.items.length == 1){
                                   $scope.onemore = false;
                                }
                                $scope.checkPick();                                                            
                            }
                            //------------------ show & search map -------------------
							$scope.smpLocationClose = function() {
								if($scope.pageOptions.showLocation) {
									$scope.pageOptions.showLocation = false;
									$scope.dimmedClose();
								}
							}
							
							$scope.showLocationClick = function(item,gitem) {
                                try{
                                    if(item.smp_tp_cd != 1) {
                                        $scope.smpLocation = item;
                                        $scope.pageOptions.showLocation = true;
                                        $scope.dimmedOpen({target:"smpLocation_popup", callback:this.smpLocationClose});
                                    } else {
                                        $scope.$broadcast('showStoreMap', {
                                                goods_no: gitem.goods_no, 
                                                entr_no: item.entr_no, 
                                                entr_contr_no: item.entr_contr_no, 
                                                smp_ecoupon_yn: ('0102ETC'==gitem.smp_goods_type)?"Y":"N"
                                        });
                                    }
                                    
                                } catch(e) {
                                    console.log(e);
                                }
							}
                            //크로스픽 위치 search
							$scope.showLocationGoogle = function(id, type){
                                martIndex = id;                                    
                                mapMode = type;  
                                var param = 'store_div=ALL'; //201711 수정                                                                                                  
                                $scope.google_map_url = LotteCommon.pickMapUrl + "?" + param + "&t=" + Math.random(10); 
                                $("#searchMartPop").show();
                                $("#mart").hide();
                            }
                            //크로스픽 위치보기 
							$scope.showLocationGoogleView = function(id){
                                mapMode = "view";
                                $scope.sevenStore = $scope.resultData.seven;
                                //console.log(id, $scope.sevenStore[id]);
                                //크로스픽 지도
                                var param = "crspk_yn=Y&crspk_corp_cd=" + $scope.sevenStore[id].crspk_corp_cd +
                                    "&crspk_corp_str_sct_cd=" + $scope.sevenStore[id].crspk_corp_str_sct_cd +
                                    "&crspk_str_no=" + $scope.sevenStore[id].crspk_str_no+ "&t=" + Math.random(10);                                
                                $scope.google_map_url = LotteCommon.pickMapUrl + "?" + param; 
                                $("#searchMartPop").show();
                                $("#mart").hide();
                            }
                                                        
                            //------------------ yes, no ------------------
                            $scope.go_back = function() {
                                if (confirm("[취소] 하시면 선택한 픽업 정보를 처음부터 다시 입력해야 합니다 진행하시겠습니까?")) {
                                    // 닷컴 앱이면서 AOS 2.9.5 초과 / iOS 2.84.0 초과일 경우 Native back schema 호출
                                    if ($scope.appObj.isApp &&
                                        ($scope.appObj.isAndroid && $scope.appObj.verNumber > 295 ||
                                        $scope.appObj.isIOS && $scope.appObj.verNumber > 2840)) {
                                        try {
                                            appSendBack(); // app_interface.js
                                        } catch (e) {}
                                    } else {
                                        //상품상세 페이지로 이동
                                        if ($scope.base_goods_no == undefined || $scope.base_goods_no == "direct") {
                                            history.go($scope.history_back - (history.length - $scope.history_len));
                                            //history.go($scope.history_back);
                                        } else { //로그인 페이지를 거쳐서 왔으면
                                            location.href = LotteCommon.productviewUrl + "?" + $scope.baseParam + "&goods_no=" + $scope.base_goods_no;
                                        }
                                    }
                                }
                            };

                            //백화점 & 편의점 선택 
                            $scope.nextframe = function(){                                
                                //$scope.setFrame($scope.picktype.type);
                                $scope.gotoPage($scope.picktype.type) 
                                //history.pushState({frame:$scope.picktype.type}, "frame_");                                
                            }
                            $scope.ok_btn = function(){
                                var i, item;
                                var enter_confirm = false; //예약정보화면 진입여부
                                //선택여부 체크 ; data check
                                if($scope.frame == 1){ //lotte                           
                                    for(i=0; i<$scope.smpb.goods_list.items.length; i++){
                                        item = $scope.smpb.goods_list.items[i];
                                        if(i>0){
                                            if(item.select_brch != $scope.smpb.goods_list.items[i-1].select_brch){
                                                enter_confirm = true;    
                                            }
                                            if(item.select_loc != $scope.smpb.goods_list.items[i-1].select_loc){
                                                enter_confirm = true;    
                                            }
                                        }                                        
                                        
                                        if(item.select_brch == undefined){
                                            alert("지점을 선택해주세요.");
                                            return;                                            
                                        }else if(item.select_loc == undefined){
                                            alert("픽업장소를 선택해주세요.");
                                            return;                                            
                                        }else if(item.select_time == undefined){
                                            alert("방문예정일을 선택해주세요.");
                                            return;                                            
                                        }
                                    }
                                }else if($scope.frame == 2){ //seven                                    
                                    for(i=0; i<$scope.sevenStore.length; i++){
                                        if($("#scr_a:checked").length == 1){ //여러곳으로 보내기
                                            if($scope.sevenStore[i] == undefined){
                                                alert("픽업지점을 선택해주세요.");
                                                return;
                                            }
                                            if(i > 0 && $scope.sevenStore[i] != undefined){ //선택한 픽업지점이 다른 경우 
                                                if($scope.sevenStore[i].crspk_str_str_nm != $scope.sevenStore[i-1].crspk_str_str_nm){
                                                    enter_confirm = true;    
                                                }  
                                            }                                             
                                        }else{//한곳으로 보내기
                                            if($scope.sevenStore[0] == undefined){
                                                alert("픽업지점을 선택해주세요.");
                                                return;
                                            }                                                                                        
                                            if(i > 0){ 
                                               $scope.sevenStore[i] = $scope.sevenStore[0];
                                            }                                                                                     
                                            
                                        }
                                    }                                                                        
                                }                                
                                
                                if(enter_confirm){ //확인 페이지로 이동
                                    $scope.resultData.list = $scope.smpb.goods_list.items;
                                    $scope.resultData.seven = $scope.sevenStore;
                                    LotteStorage.setSessionStorage("book_resultData", $scope.resultData, 'json');                                                                        
                                    $scope.gotoPage(parseInt($scope.frame) + 2);
                                    //$scope.setFrame(parseInt($scope.frame) + 2);                                                                        
                                    //history.pushState({frame:$scope.picktype.type}, "frame_");                                
                                }else{
                                    //1개인 경우 바로 처리 
                                    //console.log("submit");
                                    $scope.ok_submit();
                                }
                            }
                            //최종확인
                            $scope.ok_last_btn = function(){
                                $scope.ok_submit();
                            }
                            
                            $scope.ok_submit = function(){
                                //make data 
                                var tmp = "", item;                                
                                if($scope.frame == 1 || $scope.frame == 3){ //lotte
                                        $scope.postdata.smp_vst_shop_no = "";                                        
                                        $scope.postdata.smp_shop_no = "";                                                             
                                        $scope.postdata.smp_vst_rsv_dtime = "";                                        
                                        $scope.postdata.smp_tp_cd = "";                                                              
                                        $scope.postdata.smp_deli_loc_sn = "";                                                                                
                                        $scope.postdata.crspk_yn = "";    
                                        if($scope.frame == 3){$scope.smpb.goods_list.items = $scope.resultData.list};
                                    for(i=0; i<$scope.smpb.goods_list.items.length; i++){
                                        item = $scope.smpb.goods_list.items[i];
                                        if(i > 0){
                                            tmp = $scope.split_str;
                                        }
                                        $scope.postdata.smp_vst_shop_no += tmp + item.select_loc.shop_no;                                    
                                        $scope.postdata.smp_shop_no += tmp + item.select_brch.shop_no;                                    
                                        $scope.postdata.smp_vst_rsv_dtime += tmp + item.select_time.target_date;
                                        $scope.postdata.smp_tp_cd += tmp + item.select_loc.smp_tp_cd;                                        
                                        $scope.postdata.smp_deli_loc_sn += tmp + item.select_loc.smp_deli_loc_sn;                                        
                                        $scope.postdata.crspk_yn += tmp + "N";            
                                    }
                                }else if($scope.frame == 2 || $scope.frame == 4){ //seven
                                        $scope.postdata.crspk_yn = "";                                        
                                        $scope.postdata.crspk_store = "";                                        
                                        $scope.postdata.crspk_corp_cd = "";                                        
                                        $scope.postdata.crspk_corp_str_sct_cd = "";                                        
                                        $scope.postdata.crspk_str_no = "";                                          
                                        if($scope.frame == 4){
                                            $scope.sevenStore = $scope.resultData.seven
                                        };
                                    for(i=0; i<$scope.sevenStore.length; i++){
                                        item = $scope.sevenStore[i];
                                        if(i > 0){
                                            tmp = $scope.split_str;
                                        }
                                        $scope.postdata.crspk_yn += tmp + "Y";                                        
                                        $scope.postdata.crspk_store += tmp + item.crspk_str_str_nm;
                                        $scope.postdata.crspk_corp_cd += tmp + item.crspk_corp_cd;
                                        $scope.postdata.crspk_corp_str_sct_cd += tmp + item.crspk_corp_str_sct_cd;
                                        $scope.postdata.crspk_str_no += tmp + item.crspk_str_no;
                                   }                                                                        
                                }                                
                                //console.log($scope.postdata);
                                
                                //submit
                                if($scope.postdata.url_div) {
                                    LotteForm.FormSubmitForAjax(LotteCommon.cartCartInsData,$scope.postdata)
                                    .success(function(data) {
                                        alert("상품이 장바구니에 담겼습니다");
                                        window.location.href = LotteCommon.cateLstUrl + "?" + $scope.baseParam;
                                    })
                                    .error(function(ex) {
                                        var errorMsg = ex.error.response_msg;
                                        alert(errorMsg);
                                    });                                
                                } else { //주문서
                                    $scope.gotoPage(5);
                                }                                
                            }
						}
				}
		}]);

})(window, window.angular);